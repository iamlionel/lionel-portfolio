---
title: "Lifecycle源码解析"
description: "深入探讨 Android Lifecycle 组件的概念、使用方式，以及 Activity/Fragment 的分发原理与重入问题的源码级解析。"
date: "2022-02-13"
tags: ["Android", "Lifecycle", "源码剖析"]
---

### 1. 什么是 Lifecycle？ {#what-is-lifecycle}

Lifecycle 是 Android Jetpack 中具备**宿主生命周期感知能力**的组件。它能持有组件（如 `Activity` 或 `Fragment`）生命周期状态的信息，并且允许其他观察者安全地监听宿主的状态变化，从而灵活应对清理工作并避免内存泄漏和崩溃。

### 2. 如何使用 Lifecycle 观察宿主状态？ {#observe-lifecycle}

强烈推荐使用实现接口的形式。如果非要使用注解的形式（方式 A），若没有添加配套的 `lifecycle-compiler` 注解处理器，运行时会退化为使用反射回调，从而影响运行性能。

#### 方式 A：注解形式

```java
// 1. 自定义的 LifecycleObserver 观察者，在方法上用注解声明想要追踪的生命周期事件
class LocationObserver extends LifecycleObserver {

    // 宿主执行了 onStart 时，会分发该事件
    @OnLifecycleEvent(Lifecycle.Event.ON_START)
    void onStart(@NotNull LifecycleOwner owner){
        // 开启定位
    }

    // 宿主执行了 onStop 时会分发该事件
    @OnLifecycleEvent(Lifecycle.Event.ON_STOP)
    void onStop(@NotNull LifecycleOwner owner){
        // 停止定位
    }
}

// 2. 注册观察者，从而挂载并监听宿主生命周期状态变化
class MyFragment extends Fragment {
    public void onCreate(Bundle bundle){
        LocationObserver observer = new LocationObserver();
        getLifecycle().addObserver(observer);
    }
}
```

#### 方式 B：实现 LifecycleEventObserver 接口 (推荐用法)

```java
// 1. 系统底层源码定义
public interface LifecycleEventObserver extends LifecycleObserver {
    void onStateChanged(LifecycleOwner source, Lifecycle.Event event);
}

// 2. 实际业务用法
class LocationObserver implements LifecycleEventObserver {
    @Override
    public void onStateChanged(LifecycleOwner source, Lifecycle.Event event){
        // 收到集中的投递，需要自行使用 switch/if 判断 event 是 ON_START 还是 ON_STOP
    }
}
```

### 3. Fragment 如何实现 Lifecycle？ {#fragment-lifecycle}

在极简的抽象封装里，Fragment 内部默认使用一套 `LifecycleRegistry` 来分发完整的生命周期机制：

```java
public class Fragment implements LifecycleOwner {
    // 创建一个专用于此 Fragment 宿主的注册分发中心
    LifecycleRegistry mLifecycleRegistry = new LifecycleRegistry(this);

    @Override
    public Lifecycle getLifecycle() {
        // 必须暴露出 LifecycleRegistry 对象返回给外界监听
        return mLifecycleRegistry;
    }

    void performCreate(){
        mLifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_CREATE);
    }

    void performStart(){
        mLifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_START);
    }

    // ... 其他阶段

    void performResume(){
        mLifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_RESUME);
    }
}
```

### 4. Activity 如何实现 Lifecycle？ {#activity-lifecycle}

普通的 Activity 实现 Lifecycle 一般需要借助于系统隐式挂靠的 `ReportFragment` 往 Activity 内添加一个肉眼不可见的 Fragment 充当间谍，用以无感知报告外部的生命周期变化。这样做的目的是为了完美兼顾那些并非直接继承自 `AppCompatActivity` 的原始界面场景。

```java
public class ComponentActivity extends Activity implements LifecycleOwner {
    private LifecycleRegistry mLifecycleRegistry = new LifecycleRegistry(this);

    @NonNull
    @Override
    public Lifecycle getLifecycle() {
        return mLifecycleRegistry;
    }

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 往 Activity 注入一个空的 ReportFragment，用以拦截报告生命周期
        // 这极大地隔离了入侵耦合，实现了非常简洁的架构
        ReportFragment.injectIfNeededIn(this);
    }
}
```

### 5. Lifecycle 是如何分发状态及解决重入的？ {#lifecycle-dispatch}

#### 5.1 状态 (State) 与 事件 (Event) 模型

在分发时，Lifecycle Registry 会涉及到两个高频抽象概念：

- **宿主生命周期事件 (Event)**：如我们熟悉的动作指令 `ON_CREATE`, `ON_START`, `ON_RESUME`。
- **宿主的当前停留状态 (State)**：宿主执行完某一动作指令之后，它自然步入的某种**暂定界限**。

状态图映射如下，`onCreate` 操作将状态推向 `CREATED`，接着 `onStart` 将状态推向 `STARTED`，`onResume` 到达巅峰状态 `RESUMED`；反向的销毁时期则递减降级。

![](https://img1.sycdn.imooc.com/wiki/5ee820ce0947f7e314000762.jpg)

除了线性过渡，Lifecycle 还支持**完整事件追溯**特性。即便我们在 `onResume` 的最晚期刚刚注册一个全新的观察者对象，`Lifecycle` 内部模型也会依次向它回放所有的前置漏接事件：
`Lifecycle.Event.ON_CREATE -> Lifecycle.Event.ON_START -> Lifecycle.Event.ON_RESUME`。

![](https://img1.sycdn.imooc.com/wiki/5ee820d60984fce530620784.jpg)

#### 5.2 如何彻底防止方法重入造成的死循环？

`LifecycleRegistry` 在系统层级严密设计了 `mAddingObserverCounter`，`mHandlingEvent`，`mNewEventOccurred` 这三大状态变量指标。其核心使命就是确保 `sync()` 同步推进永远只在最顶端的执行层发生。一旦当前已经锁在同步过程中，任何嵌套动作都被消化处理，绝对不会反复递归。

**场景 A: mHandlingEvent = true**
此时说明主轮盘正在进行完整的 Observer 分发同步，在主轮结束时自然会补上全局 `sync()`，所以在中途被嵌套触发的分支会直接跳过：

```java
moveToState(state1)
->  sync()
->  moveToState(state2)
    ->  sync() // 系统检测到已经处于同级，无视请求，静默跳过

moveToState(state1)
->  sync()
->  addObserver()
    ->  sync() // 嵌套行为一样会被静默拦截跳过
```

**场景 B: mNewEventOccurred != 0**
表示由于事件并发出现了更新的变化节点！此时没关系，依然会让当前最顶尖运行的 `sync()` 获取控制权循环消化这些变化动作，不会破坏有序性：

```java
addObserver()
    ->  addObserver()
        ->  sync() // 废弃该深层嵌套跳跃
    ->  sync()     // 真正统筹全部改变执行的一层
```

#### 5.3 进阶防崩：如何在并发执行事件时安全移除又添加？

假定在系统执行某个 `onStart()` 循环分列所有被监听者的时候，突然前面执行回调的 `Observer1` 将自己强行销毁注销了，而又紧接着动态 `add` 注册了另一个 `Observer2`，整个顺序模型将会被如何守护呢？

此时系统执行在 `ON_START` 的动作回调内。由于机制规定必须先执行所有的回调触发，再整体修改记录本身处于 `STARTED` 状态阶段，**因此在毁坏的那一瞬间，整个框架停留的官方状态标记其实仍然卡在前置的 `CREATED` 内！**

```java
void dispatchEvent(LifecycleOwner owner, Event event) {
    State newState = getStateAfter(event);
    mState = min(mState, newState);
    // [这行中]：触发了 Observer1 内部移除了自身并产生 Observer2
    mLifecycleObserver.onStateChanged(owner, event);

    // 本来应该到了这里才宣布一切升级成 STARTED，然而上面的行导致了乱序
    mState = newState;
}
```

如果 `Observer1` 突然死亡并且从链表树摘下，当后面排队的 `Observer2` 进场测算自己应该爬升到多高状态的时候；如果不加以约束限制，`Observer2` 将会认为已经没有障碍，并抢班夺权越界直接飞向终点，严重破坏了有向图的递进稳定性。

解决方式就是源码强制构建了一个缓存队列叫 `mParentStates` 作为生命安全防坠网：

```java
// 我们必须保留这些状态用来应付以下情况：
// 比如处于旧的 Observer 还未完成自身脱离的时候产生了全新的 Observer，
// 会导致映射链表查无此人...
private ArrayList<State> mParentStates = new ArrayList<>();
```

由于 `mParentStates` 在分配到 `Observer1` 执行的微秒前果断进行了压栈快照（保存着 `CREATED` 的最高上限），即便 `Observer1` 被恶意拔除，`Observer2` 想升舱时也必须乖乖过一遍安全检查，并最终取最小值卡在 `CREATED`。

```java
private State calculateTargetState(LifecycleObserver observer) {
    ... // 获取兄弟节点等等

    // 直接使用 mParentStates 保险屏障拿到的安全界限值为 CREATED
    State parentState = !mParentStates.isEmpty() ?
            mParentStates.get(mParentStates.size() - 1): null;

    // 严密封锁：也就是 min(min(STARTED, sibling), CREATED) -> 最终只允许升到 CREATED
    return min(min(mState, siblingState), parentState);
}
```

### 6. 自定义 LifecycleOwner {#custom-lifecycle-owner}

当你的基类非常非主流没有继承到标准内置的 `AppCompatActivity` 或者你在编织一些极具奇淫巧技的独立引擎对象，你可以完美手工接管赋予它们生命力。

```kotlin
class MyEngineActivity : Activity(), LifecycleOwner {

    private lateinit var lifecycleRegistry: LifecycleRegistry

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 绑定自身为宿主
        lifecycleRegistry = LifecycleRegistry(this)
        // 手动打步进标记，宣告对象创世
        lifecycleRegistry.markState(Lifecycle.State.CREATED)
    }

    public override fun onStart() {
        super.onStart()
        // 手动推进标记运转流逝
        lifecycleRegistry.markState(Lifecycle.State.STARTED)
    }

    // 归还官方登记处，向全世界证明自己可以被监听
    override fun getLifecycle(): Lifecycle {
        return lifecycleRegistry
    }
}
```

### 7. 前后台切换状态监听实践 {#foreground-background}

在实际开发中，如果我们需要在 Application 层面统计应用的“前台”或“后台”切换状态，通常有两种常用的方式。

#### 7.1 使用 ActivityLifecycleCallbacks (传统方式)

在 `Application` 中利用 `registerActivityLifecycleCallbacks` 监控所有 Activity 的执行次数并维持一个全局计数器。当页面启动发生 `started` 增减时，即可推断应用是否位于后台。顺便通过该 API 还可以轻易维护一个全局可见的 Activity 任务出入栈：

```java
registerActivityLifecycleCallbacks(new ActivityLifecycleCallbacks() {
    private int started = 0;

    @Override
    public void onActivityStarted(@NonNull Activity activity) {
        started++;
        if (started == 1) {
            Log.i("LifecycleCallbacks", "应用回到前台");
        }
    }

    @Override
    public void onActivityStopped(@NonNull Activity activity) {
        started--;
        if (started == 0) {
            Log.i("LifecycleCallbacks", "应用退到后台");
        }
    }
    //...
});
```

#### 7.2 使用 ProcessLifecycleOwner (推荐方案)

`ProcessLifecycleOwner` 是 Google Lifecycle 库中针对整个应用程序进程专门封装的管理类。借助架构内自洽的感知，这无疑是一种更为**优雅与精准**监听应用挂起、唤醒的手段，完全避免手工维护那些棘手且容易并发报错的全局数字累加器。

```java
public class App extends Application implements DefaultLifecycleObserver {

    @Override
    public void onCreate() {
        super.onCreate();

        // 像监听某个普通 Activity 那样为应用全局加上监听订阅
        ProcessLifecycleOwner.get().getLifecycle().addObserver(this);
    }

    @Override
    public void onStart(@NonNull LifecycleOwner owner) {
        Log.i("flf", "应用到前台");
    }

    @Override
    public void onStop(@NonNull LifecycleOwner owner) {
        Log.i("flf", "应用到后台");
    }
}
```
