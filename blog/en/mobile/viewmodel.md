---
title: "ViewModel Architecture Internals"
description: "Deep dive into how ViewModel survives configuration changes, the role of ViewModelStore and NonConfigurationInstances, and the comparison with onSaveInstanceState."
date: "2022-02-23"
tags: ["Android", "ViewModel", "Jetpack", "Source Analysis"]
---

## 1. What is ViewModel? {#what-is-viewmodel}

ViewModel is a **lifecycle-aware data storage component**. Data stored in a ViewModel **persists across configuration changes** that cause the host Activity or Fragment to be destroyed and recreated.

> **Configuration changes** include: screen rotation, resolution adjustment, permission changes, system font changes, etc.

### Core Advantages {#viewmodel-advantages}

| Advantage                        | Description                                                                                                      |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Data survives config changes** | ViewModel data is not lost when Activity/Fragment rebuilds; combined with LiveData, the UI can restore instantly |
| **Lifecycle awareness**          | Override `onCleared()` to cancel network requests or release resources when the host is destroyed                |
| **Cross-Fragment data sharing**  | In a single-Activity multi-Fragment setup, all Fragments can access the same ViewModel instance                  |

---

## 2. ViewModel Usage {#viewmodel-usage}

Add dependencies:

```groovy
// Typically just appcompat is enough
api 'androidx.appcompat:appcompat:1.1.0'
```

### 2.1 Basic Usage {#basic-usage}

```kotlin
class HiViewModel : ViewModel() {
    val liveData = MutableLiveData<List<GoodsModel>>()

    fun loadInitData(): LiveData<List<GoodsModel>> {
        // After config change, liveData.value still exists — no need to re-fetch
        if (liveData.value == null) {
            val remoteData = fetchDataFromRemote()
            liveData.postValue(remoteData)
        }
        return liveData
    }
}

// Obtain ViewModel via ViewModelProvider
// In single-Activity/multi-Fragment, pass the same Activity to get the same ViewModel instance
val viewModel = ViewModelProvider(this).get(HiViewModel::class.java)

viewModel.loadInitData().observe(this) {
    // Render list
}
```

### 2.2 Cross-Activity Data Sharing {#shared-viewmodel}

Have `Application` implement `ViewModelStoreOwner` to share a ViewModel across different Activities:

```kotlin
class MyApp : Application(), ViewModelStoreOwner {
    private val appViewModelStore: ViewModelStore by lazy { ViewModelStore() }

    override fun getViewModelStore(): ViewModelStore = appViewModelStore
}

// Access the global shared ViewModel from any Activity
val viewModel = ViewModelProvider(application).get(HiViewModel::class.java)
```

---

## 3. How ViewModel Survives Reconstruction {#viewmodel-internals}

### 3.1 How ViewModelProvider Retrieves Instances {#viewmodel-provider}

`ViewModelProvider` works by looking up or creating ViewModel instances inside a `ViewModelStore`:

```java
class ViewModelProvider {
    private static final String DEFAULT_KEY =
            "androidx.lifecycle.ViewModelProvider.DefaultKey";

    // Auto-generates a unique key from the model class name
    public <T extends ViewModel> T get(Class<T> modelClass) {
        String canonicalName = modelClass.getCanonicalName();
        return get(DEFAULT_KEY + ":" + canonicalName, modelClass);
    }

    public <T extends ViewModel> T get(String key, Class<T> modelClass) {
        // Try to retrieve an existing instance from the store first
        ViewModel viewModel = mViewModelStore.get(key);
        if (viewModel != null && modelClass.isInstance(viewModel)) {
            return (T) viewModel; // Cache hit — reuse the existing instance
        }
        // Cache miss — create a new instance via factory and store it
        if (mFactory instanceof KeyedFactory) {
            viewModel = ((KeyedFactory) mFactory).create(key, modelClass);
        } else {
            viewModel = mFactory.create(modelClass);
        }
        mViewModelStore.put(key, viewModel);
        return (T) viewModel;
    }
}
```

> **ViewModelStore** is the actual container for ViewModel instances — essentially a `HashMap<String, ViewModel>`.

### 3.2 Why Doesn't ViewModelStore Get Destroyed with the Activity? {#viewmodel-store}

The key is in `getViewModelStore()`:

```java
class ComponentActivity extends ViewModelStoreOwner {

    // Container that survives configuration changes
    static final class NonConfigurationInstances {
        Object custom;
        ViewModelStore viewModelStore; // ViewModelStore is saved here!
    }

    public ViewModelStore getViewModelStore() {
        if (mViewModelStore == null) {
            // First try to retrieve the previously saved ViewModelStore
            NonConfigurationInstances nc =
                    (NonConfigurationInstances) getLastNonConfigurationInstance();
            if (nc != null) {
                mViewModelStore = nc.viewModelStore; // Reuse!
            }
            if (mViewModelStore == null) {
                mViewModelStore = new ViewModelStore(); // First time: create new
            }
        }
        return mViewModelStore;
    }
}
```

### 3.3 When is ViewModelStore Saved? {#viewmodel-store-save}

When a configuration change triggers the system to reclaim the Activity, `onRetainNonConfigurationInstance()` is called, packaging the `ViewModelStore` into a `NonConfigurationInstances` object:

```java
class ComponentActivity {
    public final Object onRetainNonConfigurationInstance() {
        ViewModelStore viewModelStore = mViewModelStore;

        if (viewModelStore == null) {
            // Try to salvage from a previously retained instance
            NonConfigurationInstances nc =
                    (NonConfigurationInstances) getLastNonConfigurationInstance();
            if (nc != null) {
                viewModelStore = nc.viewModelStore;
            }
        }

        if (viewModelStore == null && custom == null) {
            return null; // Nothing to save
        }

        // Package and return the ViewModelStore
        NonConfigurationInstances nci = new NonConfigurationInstances();
        nci.custom = custom;
        nci.viewModelStore = viewModelStore; // KEY: saved here
        return nci;
        // The system stores this in ActivityThread#ActivityClientRecord
        // and hands it back to the new Activity via getLastNonConfigurationInstance()
    }
}
```

**Complete survival flow:**

```
Configuration change (e.g., screen rotation)
  → System calls onRetainNonConfigurationInstance()
  → ViewModelStore is saved into ActivityThread#ActivityClientRecord
  → Old Activity is destroyed
  → New Activity is created
  → getLastNonConfigurationInstance() retrieves the NonConfigurationInstances
  → getViewModelStore() restores ViewModelStore from it
  → ViewModelProvider.get() retrieves the original ViewModel instance ✅
```

---

## 4. Summary: ViewModel vs onSaveInstanceState {#viewmodel-vs-savestate}

|                         | `ViewModel`                           | `onSaveInstanceState`                               |
| ----------------------- | ------------------------------------- | --------------------------------------------------- |
| **Triggered by**        | Configuration changes only            | Any system-initiated reclaim (including low memory) |
| **Storable data**       | Any Object (including large datasets) | Lightweight key-value only (Bundle-serializable)    |
| **Storage location**    | `ActivityThread#ActivityClientRecord` | `ActivityRecord` (AMS side)                         |
| **Low memory scenario** | ❌ Data is lost                       | ✅ Data can be restored                             |

> 💡 **Key Takeaway**: If a page is reclaimed due to **low memory** or **low battery** — not a configuration change — the ViewModel **cannot be reused**. In those cases, `SavedStateHandle` must be used to guarantee data persistence. That's the next topic to explore!
