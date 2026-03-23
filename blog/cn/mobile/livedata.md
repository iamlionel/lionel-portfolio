---
title: "LiveData源码解析"
description: "深入理解 LiveData 的消息分发机制、黏性事件的成因与解决方案，并基于 LiveData 打造一款无需反注册的消息总线。"
date: "2022-03-17"
tags: ["Android", "LiveData", "Jetpack", "源码剖析"]
---

## 1. 什么是 LiveData？ {#what-is-livedata}

LiveData 是 Jetpack 中基于**观察者模式**的消息订阅/分发组件，具有宿主（Activity、Fragment）**生命周期感知能力**，确保 LiveData 仅分发消息给处于活跃状态的观察者。

> **活跃状态**：通常等于观察者所在宿主处于 `STARTED` 或 `RESUMED` 状态。如果使用 `observeForever` 注册，则一直处于活跃状态。

LiveData 的出现解决了传统 `Handler`、`EventBus`、`RxJavaBus` 的通病 —— 它们不会顾及当前页面是否可见，一股脑地有消息就转发，导致后台任务仍在抢占资源。

```java
class MainActivity extends AppCompatActivity {
    public void onCreate(Bundle bundle) {

        // Handler：无论页面可见与否，消息都会分发 -> 消耗资源 + 内存泄漏风险
        Handler handler = new Handler() {
            @Override
            public void handleMessage(@NonNull Message msg) {
                // 即便页面不可见，依然会执行刷新、弹框等操作
            }
        };
        handler.sendMessage(msg);

        // LiveData：天然应对上述所有痛点
        liveData.observe(this, new Observer<User>() {
            @Override
            public void onChanged(User user) {
                // 页面不可见时不会收到消息
                // 页面重新可见时，立刻收到最新的一条消息确保状态同步
            }
        });
        liveData.postValue(data);
    }
}
```

### LiveData 的核心优势 {#livedata-advantages}

| 特性                       | 说明                                                 |
| -------------------------- | ---------------------------------------------------- |
| **界面始终最新**           | 生命周期状态变化时，自动把最新数据派发给活跃的观察者 |
| **无需手动处理生命周期**   | 宿主 `onDestroy` 时自动反注册，无内存泄漏            |
| **页面重回活跃时立刻同步** | 从后台切到前台，立即收到最新数据                     |
| **支持黏性事件**           | 先发送数据，后注册的观察者也能收到最后一条数据       |
| **可打造消息总线**         | 通过单例模式拓展，实现全局消息分发，替代 EventBus    |

---

## 2. LiveData 衍生类 {#livedata-subclasses}

使用前需添加依赖：

```groovy
// 通常引入 appcompat 即可
api 'androidx.appcompat:appcompat:1.1.0'
```

### 2.1 MutableLiveData {#mutable-livedata}

日常开发最常用的子类，遵循「单一开闭原则」：只有拿到 `MutableLiveData` 对象才能发送消息，`LiveData` 对象只能接收，职责清晰。

```java
public class MutableLiveData<T> extends LiveData<T> {
    @Override
    public void postValue(T value) { super.postValue(value); }

    @Override
    public void setValue(T value) { super.setValue(value); }
}
```

### 2.2 MediatorLiveData {#mediator-livedata}

可以**统一观察多个 LiveData**，将多路数据汇聚到同一个出口处理：

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
        // liveData1 或 liveData2 任意一个发送数据，都会触发这里
    }
};
```

### 2.3 Transformations.map {#transformations-map}

对 LiveData 的数据进行**变换转换**，并返回一个新的 LiveData 对象：

```java
MutableLiveData<Integer> data = new MutableLiveData<>();

// 将 Integer 类型转换为 String 类型输出
LiveData<String> transformed = Transformations.map(data, input -> String.valueOf(input));
transformed.observe(this, output -> { /* 使用转换后的数据 */ });

data.setValue(10); // 发送原始数据
```

---

## 3. LiveData 核心方法 {#livedata-core-methods}

| 方法                       | 说明                                           |
| -------------------------- | ---------------------------------------------- |
| `observe(owner, observer)` | 注册生命周期关联的观察者，宿主销毁时自动反注册 |
| `observeForever(observer)` | 注册永久观察者，需自行手动反注册               |
| `setValue(data)`           | 主线程发送数据，没有活跃观察者时不分发         |
| `postValue(data)`          | 任意线程发送数据，内部切换到主线程执行         |
| `onActive()`               | 从零个到有一个活跃观察者时触发（可用于懒加载） |
| `onInactive()`             | 活跃观察者归零时触发（可用于资源释放）         |

---

## 4. 消息分发原理 {#dispatch-principles}

### 4.1 黏性事件的成因 {#sticky-event-cause}

LiveData 每次调用 `setValue` / `postValue` 发送数据时，内部的 `mVersion` 都会 `+1`。但是，一个**新注册的 Observer 的 `mLastVersion` 初始值为 `-1`**，导致即便是先发送、后注册，`considerNotify` 方法也会把之前的数据分发给它 —— 这就是**黏性事件**的根本来源。

```java
private void considerNotify(ObserverWrapper observer) {
    // 1. 观察者不活跃，不分发
    if (!observer.mActive) return;

    // 2. 宿主不可见，不分发
    if (!observer.shouldBeActive()) {
        observer.activeStateChanged(false);
        return;
    }

    // 3. 关键：新 Observer 的 mLastVersion=-1，LiveData.mVersion=1
    //    所以 -1 < 1，条件不满足，直接把旧数据分发出去 -> 黏性事件！
    if (observer.mLastVersion >= mVersion) {
        return;
    }
    observer.mLastVersion = mVersion;
    observer.mObserver.onChanged((T) mData);
}
```

### 4.2 observe() 注册流程 {#observe-registration}

```java
public void observe(@NonNull LifecycleOwner owner, @NonNull Observer<? super T> observer) {
    // 1. 断言只能在主线程调用
    assertMainThread("observe");

    // 2. 把 observer 包装为具有生命周期边界感知的 LifecycleBoundObserver
    LifecycleBoundObserver wrapper = new LifecycleBoundObserver(owner, observer);

    // 3. 防止重复注册同一个 observer
    ObserverWrapper existing = mObservers.putIfAbsent(observer, wrapper);
    if (existing != null && !existing.isAttachedTo(owner)) {
        throw new IllegalArgumentException("Cannot add the same observer with different lifecycles");
    }

    // 4. 向 Lifecycle 注册，宿主状态变化时触发 onStateChanged
    owner.getLifecycle().addObserver(wrapper);
}
```

`LifecycleBoundObserver.shouldBeActive()` 的实现决定了宿主不可见时静默消息：

```java
@Override
boolean shouldBeActive() {
    // 只有宿主状态 >= STARTED 时，观察者才处于活跃状态
    return mOwner.getLifecycle().getCurrentState().isAtLeast(STARTED);
}

@Override
public void onStateChanged(LifecycleOwner source, Lifecycle.Event event) {
    if (mOwner.getLifecycle().getCurrentState() == DESTROYED) {
        // 宿主销毁时，自动反注册，彻底消除内存泄漏
        removeObserver(mObserver);
        return;
    }
    activeStateChanged(shouldBeActive());
}
```

### 4.3 ObserverWrapper.activeStateChanged() — 状态变更触发分发 {#active-state-changed}

当宿主生命周期发生变化（如从后台切回前台），`LifecycleBoundObserver.onStateChanged()` 会调用 `activeStateChanged()`，这是数据分发链路的**中间枢纽**：

```java
abstract class ObserverWrapper {
    final Observer<? super T> mObserver;
    boolean mActive;
    int mLastVersion = START_VERSION; // 初始值为 -1，为黏性事件埋下伏笔

    void activeStateChanged(boolean newActive) {
        if (newActive == mActive) {
            return; // 状态没变，直接跳过
        }
        mActive = newActive;
        boolean wasInactive = LiveData.this.mActiveCount == 0;
        LiveData.this.mActiveCount += mActive ? 1 : -1;

        // 从无到有：触发 onActive()，可利用此时机实现数据懒加载
        if (wasInactive && mActive) {
            onActive();
        }
        // 从有到无：触发 onInactive()，可利用此时机释放资源
        if (LiveData.this.mActiveCount == 0 && !mActive) {
            onInactive();
        }
        // 若当前观察者变为活跃，立刻把最新数据分发给它
        if (mActive) {
            dispatchingValue(this); // 注意：这里传的是 this（当前观察者）
        }
    }
}
```

### 4.4 dispatchingValue() — 分发流程总控 {#dispatching-value}

`dispatchingValue` 通过 `mDispatchingValue` 和 `mDispatchInvalidated` 两个标志位防止嵌套分发带来的混乱：

```java
void dispatchingValue(@Nullable ObserverWrapper initiator) {
    if (mDispatchingValue) {
        // 如果当前正在分发，标记需要重新分发（例如 setValue 在分发过程中被再次调用）
        mDispatchInvalidated = true;
        return;
    }
    mDispatchingValue = true;
    do {
        mDispatchInvalidated = false;
        if (initiator != null) {
            // 新观察者注册触发：只把数据分发给它自己
            considerNotify(initiator);
            initiator = null;
        } else {
            // setValue/postValue 触发：遍历所有已注册的观察者逐一分发
            for (Iterator<Map.Entry<Observer<? super T>, ObserverWrapper>> iterator =
                    mObservers.iteratorWithAdditions(); iterator.hasNext(); ) {
                considerNotify(iterator.next().getValue());
                if (mDispatchInvalidated) {
                    break; // 分发过程中有新数据到来，重新遍历
                }
            }
        }
    } while (mDispatchInvalidated);
    mDispatchingValue = false;
}
```

> **关键区别**：
>
> - `initiator != null`：新 Observer 注册或宿主从后台切回前台时调用，**只分发给触发者自身**。
> - `initiator == null`：`setValue` / `postValue` 时调用，**广播给所有已注册的活跃观察者**。

---

## 5. 实战：打造无黏性的消息总线 HiDataBus {#hidatabus}

### 5.1 为什么需要自定义？ {#why-custom}

LiveData 黏性事件的根源在于新 Observer 创建时 `mLastVersion = -1`，没有与当前 LiveData 的 `mVersion` 对齐。网络上流传使用反射修改 `mLastVersion` 字段，但不够优雅。**更好的方案是代理设计模式**：让新注册的 Observer 在包装时就把自身版本号与 LiveData 当前版本号对齐。

### 5.2 StickyObserver（代理观察者） {#sticky-observer}

```java
class StickyObserver<T> implements Observer<T> {
    private final StickyLiveData<T> mLiveData;
    private final Observer<T> mObserver;
    private final boolean mSticky; // 是否关心黏性事件

    // 关键：创建时与 LiveData 当前 version 对齐
    private int mLastVersion;

    public StickyObserver(StickyLiveData<T> liveData, Observer<T> observer, boolean sticky) {
        mLiveData = liveData;
        mObserver = observer;
        mSticky = sticky;
        // 立刻将 mLastVersion 与 liveData.mVersion 对齐，屏蔽历史数据
        mLastVersion = mLiveData.mVersion;
    }

    @Override
    public void onChanged(T t) {
        if (mLastVersion >= mLiveData.mVersion) {
            // 如果关心黏性事件，才给历史最后一条数据
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

### 5.3 StickyLiveData（自管控的 LiveData） {#sticky-livedata}

```java
public static class StickyLiveData<T> extends LiveData<T> {
    private final String mEventName;
    private T mStickyData;
    int mVersion = 0; // 包可见，供 StickyObserver 访问

    public StickyLiveData(String eventName) { mEventName = eventName; }

    @Override
    public void setValue(T value) {
        mVersion++; // 每次发送版本号 +1
        super.setValue(value);
    }

    // 发送黏性消息（后注册的 sticky=true 观察者能收到）
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
        observeSticky(owner, observer, false); // 默认不关心黏性事件
    }

    public void observeSticky(LifecycleOwner owner, Observer<? super T> observer, boolean sticky) {
        // 用代理 Observer 包装，屏蔽历史数据
        super.observe(owner, new StickyObserver<>(this, observer, sticky));
        // 监测宿主销毁从而自动清理总线中的 LiveData
        owner.getLifecycle().addObserver((LifecycleEventObserver) (source, event) -> {
            if (event == Lifecycle.Event.ON_DESTROY) {
                mHashMap.remove(mEventName);
            }
        });
    }
}
```

### 5.4 使用方式 {#usage}

```java
// 不关心黏性事件（推荐默认用法）
HiDataBus.with("eventName").observe(lifecycleOwner, new Observer<String>() {
    @Override
    public void onChanged(String data) { /* 处理数据 */ }
});

// 关心黏性事件：后注册也能收到之前发的最后一条消息
HiDataBus.with("eventName").observeSticky(lifecycleOwner, observer, true);

// 发送普通消息
HiDataBus.with("eventName").setValue("hello");

// 发送黏性消息
HiDataBus.with("eventName").setStickyData("hello sticky");
```

---

## 6. 总结 {#summary}

|              | `observe()`              | `observeForever()`             |
| ------------ | ------------------------ | ------------------------------ |
| 自动反注册   | ✅ 宿主 onDestroy 时自动 | ❌ 需手动调用 `removeObserver` |
| 后台接收消息 | ❌ 宿主不可见时静默      | ✅ 随时接收                    |
| 重回活跃时   | ✅ 立刻收到最新数据      | ✅ 随时接收                    |

> 💡 **黏性事件关键**：新 Observer 的 `mLastVersion` 初始化为 `-1`，未与 `LiveData.mVersion` 对齐是黏性事件的根本原因。自定义代理观察者并在初始化时主动对齐版本号是最优雅的解决方案，无需依赖反射。
