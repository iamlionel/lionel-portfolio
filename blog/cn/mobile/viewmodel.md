---
title: "ViewModel源码解析"
description: "深入理解 ViewModel 组件的数据存储机制，分析配置变更后 ViewModel 复用的底层原理，以及与 onSaveInstanceState 的核心区别。"
date: "2022-02-23"
tags: ["Android", "ViewModel", "Jetpack", "源码剖析"]
---

## 1. 什么是 ViewModel？ {#what-is-viewmodel}

ViewModel 是具备**宿主生命周期感知能力**的数据存储组件。使用 ViewModel 保存的数据，在页面因**配置变更**导致销毁重建之后依然存在。

> **配置变更**主要包括：横竖屏切换、分辨率调整、权限变更、系统字体样式变更等。

### 核心优势 {#viewmodel-advantages}

| 优势                     | 说明                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------- |
| **配置变更数据不丢失**   | Activity/Fragment 重建后，ViewModel 中的数据依然存在，配合 LiveData 可立即恢复界面状态 |
| **生命周期感知**         | 复写 `onCleared()` 可在宿主 `onDestroy` 时终止网络请求、释放内存                       |
| **跨 Fragment 数据共享** | 单 Activity 多 Fragment 场景下，各 Fragment 可获取同一个 ViewModel 实例，轻松共享数据  |

---

## 2. ViewModel 的用法 {#viewmodel-usage}

添加依赖：

```groovy
// 通常只需要添加 appcompat 即可
api 'androidx.appcompat:appcompat:1.1.0'
```

### 2.1 基本用法 {#basic-usage}

```kotlin
class HiViewModel : ViewModel() {
    val liveData = MutableLiveData<List<GoodsModel>>()

    fun loadInitData(): LiveData<List<GoodsModel>> {
        // 配置变更后页面重建时，liveData.value 依然存在，无需重新请求接口
        if (liveData.value == null) {
            val remoteData = fetchDataFromRemote()
            liveData.postValue(remoteData)
        }
        return liveData
    }
}

// 通过 ViewModelProvider 获取 ViewModel 实例
// 单 Activity 多 Fragment 时，只需传同一个 Activity，即可得到同一个 ViewModel 实例
val viewModel = ViewModelProvider(this).get(HiViewModel::class.java)

viewModel.loadInitData().observe(this) {
    // 渲染列表
}
```

### 2.2 跨 Activity 数据共享 {#shared-viewmodel}

让 `Application` 实现 `ViewModelStoreOwner` 接口，即可在不同 Activity 之间共享同一个 ViewModel：

```kotlin
class MyApp : Application(), ViewModelStoreOwner {
    private val appViewModelStore: ViewModelStore by lazy { ViewModelStore() }

    override fun getViewModelStore(): ViewModelStore = appViewModelStore
}

// 在任意 Activity 中获取全局共享的 ViewModel
val viewModel = ViewModelProvider(application).get(HiViewModel::class.java)
```

---

## 3. ViewModel 复用实现原理 {#viewmodel-internals}

### 3.1 ViewModelProvider 如何获取实例？ {#viewmodel-provider}

`ViewModelProvider` 本质上是从传入的 `ViewModelStore` 中查找/存储 ViewModel 实例：

```java
class ViewModelProvider {
    private static final String DEFAULT_KEY =
            "androidx.lifecycle.ViewModelProvider.DefaultKey";

    // 根据 modelClass 自动生成唯一 Key
    public <T extends ViewModel> T get(Class<T> modelClass) {
        String canonicalName = modelClass.getCanonicalName();
        return get(DEFAULT_KEY + ":" + canonicalName, modelClass);
    }

    public <T extends ViewModel> T get(String key, Class<T> modelClass) {
        // 先尝试从 ViewModelStore 取出已有实例
        ViewModel viewModel = mViewModelStore.get(key);
        if (viewModel != null && modelClass.isInstance(viewModel)) {
            return (T) viewModel; // 命中缓存，直接复用
        }
        // 未命中则通过 factory 创建新实例并存入 ViewModelStore
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

> **ViewModelStore** 是真正存储 ViewModel 实例的容器，本质是一个 `HashMap<String, ViewModel>`。

### 3.2 ViewModelStore 为何不随页面重建而销毁？ {#viewmodel-store}

关键点就在 `getViewModelStore()` 的实现上：

```java
class ComponentActivity extends ViewModelStoreOwner {

    // 存储配置变更数据的容器
    static final class NonConfigurationInstances {
        Object custom;
        ViewModelStore viewModelStore; // ViewModelStore 就藏在这里！
    }

    public ViewModelStore getViewModelStore() {
        if (mViewModelStore == null) {
            // 优先从 NonConfigurationInstances 中读取上一次保存的 ViewModelStore
            NonConfigurationInstances nc =
                    (NonConfigurationInstances) getLastNonConfigurationInstance();
            if (nc != null) {
                mViewModelStore = nc.viewModelStore; // 复用！
            }
            if (mViewModelStore == null) {
                mViewModelStore = new ViewModelStore(); // 首次创建
            }
        }
        return mViewModelStore;
    }
}
```

### 3.3 ViewModelStore 何时被保存？ {#viewmodel-store-save}

当**因配置变更**导致 Activity 被系统回收时，会触发 `onRetainNonConfigurationInstance()`，将 `ViewModelStore` 打包存入 `NonConfigurationInstances` 中：

```java
class ComponentActivity {
    public final Object onRetainNonConfigurationInstance() {
        ViewModelStore viewModelStore = mViewModelStore;

        if (viewModelStore == null) {
            // 如果当前没有，尝试从上次保存的实例中取出
            NonConfigurationInstances nc =
                    (NonConfigurationInstances) getLastNonConfigurationInstance();
            if (nc != null) {
                viewModelStore = nc.viewModelStore;
            }
        }

        if (viewModelStore == null && custom == null) {
            return null; // 没有任何需要保存的内容
        }

        // 将 viewModelStore 打包并返回
        NonConfigurationInstances nci = new NonConfigurationInstances();
        nci.custom = custom;
        nci.viewModelStore = viewModelStore; // 关键：保存在此
        return nci;
        // 系统会在 Activity 重建后，通过 getLastNonConfigurationInstance() 将上面的对象还回来
    }
}
```

**完整复用流程：**

```
配置变更 (如横竖屏)
  → 系统调用 onRetainNonConfigurationInstance()
  → ViewModelStore 被保存到 ActivityThread#ActivityClientRecord
  → 旧 Activity 销毁
  → 新 Activity 创建
  → getLastNonConfigurationInstance() 取回 NonConfigurationInstances
  → getViewModelStore() 从中恢复 ViewModelStore
  → ViewModelProvider.get() 从 ViewModelStore 取到原 ViewModel 实例 ✅
```

---

## 4. 总结：ViewModel vs onSaveInstanceState {#viewmodel-vs-savestate}

|                  | `ViewModel`                           | `onSaveInstanceState`                     |
| ---------------- | ------------------------------------- | ----------------------------------------- |
| **触发时机**     | 仅配置变更导致的页面重建              | 任意页面被系统回收（包括内存不足等）      |
| **可存储内容**   | 任意 Object（包括大型数据集）         | 仅轻量级 key-value（Bundle 可序列化数据） |
| **数据存储位置** | `ActivityThread#ActivityClientRecord` | `ActivityRecord`（AMS 侧）                |
| **内存不足时**   | ❌ 数据丢失                           | ✅ 数据仍可恢复                           |

> 💡 **关键结论**：如果是因**内存不足**或**电量不足**导致页面被回收，这不属于配置变更，ViewModel 将**无法复用**。这种情况下需要结合 `SavedStateHandle` 来保证数据的持久化，这也是下一个进阶话题！
