---
title: "LiveData Internals & Practical Guide"
description: "Deep dive into LiveData's message dispatch mechanism, sticky event causes and solutions, and building a lifecycle-aware message bus that replaces EventBus."
date: "2022-03-17"
tags: ["Android", "LiveData", "Jetpack", "Source Analysis"]
---

## 1. What is LiveData? {#what-is-livedata}

LiveData is a Jetpack component based on the **observer pattern** for message subscription and dispatch. It is **lifecycle-aware**, ensuring that LiveData only dispatches messages to observers in an active state.

> **Active state**: Generally means the host (`Activity`/`Fragment`) is in `STARTED` or `RESUMED` state. Observers registered via `observeForever` are always considered active.

LiveData solves the fundamental flaw of traditional `Handler`, `EventBus`, and `RxJavaBus` — they dispatch regardless of whether the current page is visible, wasting resources on background tasks.

```java
class MainActivity extends AppCompatActivity {
    public void onCreate(Bundle bundle) {

        // Handler: dispatches no matter what, even when page is invisible -> wastes resources + memory leak risk
        Handler handler = new Handler() {
            @Override
            public void handleMessage(@NonNull Message msg) {
                // UI updates or dialogs fire even when page is invisible
            }
        };
        handler.sendMessage(msg);

        // LiveData: solves all the above problems natively
        liveData.observe(this, new Observer<User>() {
            @Override
            public void onChanged(User user) {
                // No dispatch when page is invisible
                // Immediately delivers latest data when page becomes visible again
            }
        });
        liveData.postValue(data);
    }
}
```

### Core Advantages of LiveData {#livedata-advantages}

| Feature                          | Description                                                                 |
| -------------------------------- | --------------------------------------------------------------------------- |
| **UI always up-to-date**         | Automatically delivers latest data to active observers on lifecycle changes |
| **No manual lifecycle handling** | Auto-unregisters on host `onDestroy`, no memory leaks                       |
| **Instant sync on return**       | Immediately receives latest data when returning from background             |
| **Sticky event support**         | Observers registered after data was sent still receive the last value       |
| **Message bus capable**          | Extend with singleton pattern for global dispatch replacing EventBus        |

---

## 2. LiveData Subtypes {#livedata-subclasses}

Add the dependency before use:

```groovy
// appcompat is usually sufficient
api 'androidx.appcompat:appcompat:1.1.0'
```

### 2.1 MutableLiveData {#mutable-livedata}

The most commonly used subclass. Follows the **Open/Closed Principle**: only `MutableLiveData` can send messages, while `LiveData` is receive-only. Clear separation of responsibilities.

```java
public class MutableLiveData<T> extends LiveData<T> {
    @Override
    public void postValue(T value) { super.postValue(value); }

    @Override
    public void setValue(T value) { super.setValue(value); }
}
```

### 2.2 MediatorLiveData {#mediator-livedata}

**Observes multiple LiveData sources** and merges them into a single outlet:

```java
LiveData<Integer> liveData1 = new MutableLiveData<>();
LiveData<Integer> liveData2 = new MutableLiveData<>();

MediatorLiveData<Integer> merger = new MediatorLiveData<>();
merger.addSource(liveData1, observer);
merger.addSource(liveData2, observer);

Observer<Integer> observer = new Observer<Integer>() {
    @Override
    public void onChanged(@Nullable Integer s) {
        titleTextView.setText(String.valueOf(s));
        // Triggered whenever either liveData1 or liveData2 emits
    }
};
```

### 2.3 Transformations.map {#transformations-map}

**Transforms** LiveData data and returns a new LiveData object:

```java
MutableLiveData<Integer> data = new MutableLiveData<>();

// Convert Integer to String output
LiveData<String> transformed = Transformations.map(data, input -> String.valueOf(input));
transformed.observe(this, output -> { /* consume transformed data */ });

data.setValue(10); // send raw data
```

---

## 3. Core LiveData Methods {#livedata-core-methods}

| Method                     | Description                                                             |
| -------------------------- | ----------------------------------------------------------------------- |
| `observe(owner, observer)` | Register lifecycle-bound observer, auto-unregisters on host destroy     |
| `observeForever(observer)` | Register permanent observer, must manually call `removeObserver`        |
| `setValue(data)`           | Send data on main thread; skipped if no active observers                |
| `postValue(data)`          | Send data from any thread; internally switches to main thread           |
| `onActive()`               | Triggered when observer count goes from 0 to 1 (great for lazy loading) |
| `onInactive()`             | Triggered when active observer count drops to 0 (great for cleanup)     |

---

## 4. Message Dispatch Internals {#dispatch-principles}

### 4.1 Root Cause of Sticky Events {#sticky-event-cause}

Every time `setValue` / `postValue` is called, the internal `mVersion` counter increments by 1. However, a **newly registered Observer starts with `mLastVersion = -1`**. Because of this, `considerNotify` will deliver previously sent data to any new observer — this is the root cause of **sticky events**.

```java
private void considerNotify(ObserverWrapper observer) {
    // 1. Observer is not active, skip
    if (!observer.mActive) return;

    // 2. Host is not visible, skip
    if (!observer.shouldBeActive()) {
        observer.activeStateChanged(false);
        return;
    }

    // 3. KEY: new Observer has mLastVersion=-1, LiveData.mVersion=1
    //    -1 < 1, so this check fails -> old data gets dispatched -> sticky event!
    if (observer.mLastVersion >= mVersion) {
        return;
    }
    observer.mLastVersion = mVersion;
    observer.mObserver.onChanged((T) mData);
}
```

### 4.2 observe() Registration Flow {#observe-registration}

```java
public void observe(@NonNull LifecycleOwner owner, @NonNull Observer<? super T> observer) {
    // 1. Assert must be called on the main thread
    assertMainThread("observe");

    // 2. Wrap observer in a lifecycle-boundary-aware LifecycleBoundObserver
    LifecycleBoundObserver wrapper = new LifecycleBoundObserver(owner, observer);

    // 3. Prevent duplicate registration of the same observer
    ObserverWrapper existing = mObservers.putIfAbsent(observer, wrapper);
    if (existing != null && !existing.isAttachedTo(owner)) {
        throw new IllegalArgumentException("Cannot add the same observer with different lifecycles");
    }

    // 4. Register with Lifecycle; host state changes trigger onStateChanged
    owner.getLifecycle().addObserver(wrapper);
}
```

`LifecycleBoundObserver.shouldBeActive()` determines whether the host is visible enough to receive data:

```java
@Override
boolean shouldBeActive() {
    // Active only when host state >= STARTED
    return mOwner.getLifecycle().getCurrentState().isAtLeast(STARTED);
}

@Override
public void onStateChanged(LifecycleOwner source, Lifecycle.Event event) {
    if (mOwner.getLifecycle().getCurrentState() == DESTROYED) {
        // Auto-unregister on host destroy — eliminates memory leaks entirely
        removeObserver(mObserver);
        return;
    }
    activeStateChanged(shouldBeActive());
}
```

### 4.3 ObserverWrapper.activeStateChanged() — The Dispatch Pivot {#active-state-changed}

When the host lifecycle changes (e.g., returning from background), `LifecycleBoundObserver.onStateChanged()` calls `activeStateChanged()`. This is the **central relay** in the dispatch chain:

```java
abstract class ObserverWrapper {
    final Observer<? super T> mObserver;
    boolean mActive;
    int mLastVersion = START_VERSION; // initialized to -1, seeds sticky event behavior

    void activeStateChanged(boolean newActive) {
        if (newActive == mActive) {
            return; // state unchanged, skip
        }
        mActive = newActive;
        boolean wasInactive = LiveData.this.mActiveCount == 0;
        LiveData.this.mActiveCount += mActive ? 1 : -1;

        // 0 → 1 active observer: triggers onActive() — great for lazy data loading
        if (wasInactive && mActive) {
            onActive();
        }
        // N → 0 active observers: triggers onInactive() — great for resource release
        if (LiveData.this.mActiveCount == 0 && !mActive) {
            onInactive();
        }
        // If observer just became active, immediately dispatch latest data to it
        if (mActive) {
            dispatchingValue(this); // passes `this` — only targets this specific observer
        }
    }
}
```

### 4.4 dispatchingValue() — Dispatch Flow Controller {#dispatching-value}

`dispatchingValue` uses two flags — `mDispatchingValue` and `mDispatchInvalidated` — to prevent chaotic nested dispatch calls:

```java
void dispatchingValue(@Nullable ObserverWrapper initiator) {
    if (mDispatchingValue) {
        // Already dispatching; mark that a new re-dispatch is needed (e.g., setValue called mid-dispatch)
        mDispatchInvalidated = true;
        return;
    }
    mDispatchingValue = true;
    do {
        mDispatchInvalidated = false;
        if (initiator != null) {
            // Triggered by new observer registration: dispatch only to the initiator
            considerNotify(initiator);
            initiator = null;
        } else {
            // Triggered by setValue/postValue: broadcast to all registered observers
            for (Iterator<Map.Entry<Observer<? super T>, ObserverWrapper>> iterator =
                    mObservers.iteratorWithAdditions(); iterator.hasNext(); ) {
                considerNotify(iterator.next().getValue());
                if (mDispatchInvalidated) {
                    break; // new data arrived mid-dispatch; restart loop
                }
            }
        }
    } while (mDispatchInvalidated);
    mDispatchingValue = false;
}
```

> **Key distinction**:
>
> - `initiator != null`: Triggered by new observer registration or host returning to foreground — **only dispatches to the initiating observer**.
> - `initiator == null`: Triggered by `setValue` / `postValue` — **broadcasts to all active observers**.

---

## 5. Practical Guide: Building a Sticky-Controllable Message Bus {#hidatabus}

### 5.1 Why Build a Custom Solution? {#why-custom}

The root of sticky events is that new Observers initialize with `mLastVersion = -1`, misaligned from the current `LiveData.mVersion`. A common but inelegant fix involves reflection to forcibly update `mLastVersion`. **A cleaner approach is the proxy design pattern**: wrap the observer at registration time and proactively align its version with the current LiveData version.

### 5.2 StickyObserver (Proxy Observer) {#sticky-observer}

```java
class StickyObserver<T> implements Observer<T> {
    private final StickyLiveData<T> mLiveData;
    private final Observer<T> mObserver;
    private final boolean mSticky; // whether to receive historical sticky data

    // KEY: align with current LiveData version at construction time
    private int mLastVersion;

    public StickyObserver(StickyLiveData<T> liveData, Observer<T> observer, boolean sticky) {
        mLiveData = liveData;
        mObserver = observer;
        mSticky = sticky;
        // Immediately align mLastVersion to block historical data by default
        mLastVersion = mLiveData.mVersion;
    }

    @Override
    public void onChanged(T t) {
        if (mLastVersion >= mLiveData.mVersion) {
            // Only deliver sticky data if explicitly opted in
            if (mSticky && mLiveData.mStickyData != null) {
                mObserver.onChanged(mLiveData.mStickyData);
            }
            return;
        }
        mLastVersion = mLiveData.mVersion;
        mObserver.onChanged(t);
    }
}
```

### 5.3 StickyLiveData (Self-Managed LiveData) {#sticky-livedata}

```java
public static class StickyLiveData<T> extends LiveData<T> {
    private final String mEventName;
    private T mStickyData;
    int mVersion = 0; // package-visible for StickyObserver access

    public StickyLiveData(String eventName) { mEventName = eventName; }

    @Override
    public void setValue(T value) {
        mVersion++; // increment version on every send
        super.setValue(value);
    }

    // Send sticky message (received by observers with sticky=true registered after)
    public void setStickyData(T stickyData) {
        this.mStickyData = stickyData;
        setValue(stickyData);
    }

    public void postStickyData(T stickyData) {
        this.mStickyData = stickyData;
        postValue(stickyData);
    }

    @Override
    public void observe(@NonNull LifecycleOwner owner, @NonNull Observer<? super T> observer) {
        observeSticky(owner, observer, false); // non-sticky by default
    }

    public void observeSticky(LifecycleOwner owner, Observer<? super T> observer, boolean sticky) {
        // Wrap with proxy to block historical data
        super.observe(owner, new StickyObserver<>(this, observer, sticky));
        // Auto-cleanup bus entry when host is destroyed
        owner.getLifecycle().addObserver((LifecycleEventObserver) (source, event) -> {
            if (event == Lifecycle.Event.ON_DESTROY) {
                mHashMap.remove(mEventName);
            }
        });
    }
}
```

### 5.4 Usage {#usage}

```java
// Default: non-sticky (won't receive historical messages)
HiDataBus.with("eventName").observe(lifecycleOwner, new Observer<String>() {
    @Override
    public void onChanged(String data) { /* handle data */ }
});

// Opt-in: sticky (receives the last message sent before registration)
HiDataBus.with("eventName").observeSticky(lifecycleOwner, observer, true);

// Send a regular message
HiDataBus.with("eventName").setValue("hello");

// Send a sticky message (receivable by future sticky observers)
HiDataBus.with("eventName").setStickyData("hello sticky");
```

---

## 6. Summary {#summary}

|                              | `observe()`                      | `observeForever()`                     |
| ---------------------------- | -------------------------------- | -------------------------------------- |
| Auto-unregister              | ✅ On host `onDestroy`           | ❌ Must call `removeObserver` manually |
| Receives while in background | ❌ Silent when host is invisible | ✅ Receives at all times               |
| Receives latest on return    | ✅ Immediately syncs latest data | ✅ Always receives                     |

> 💡 **Sticky Event Root Cause**: New Observers initialize `mLastVersion = -1`, out of sync with `LiveData.mVersion`. The cleanest fix is the proxy pattern — align the version at construction time rather than relying on risky reflection hacks.
