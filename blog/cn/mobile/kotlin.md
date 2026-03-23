---
title: "Kotlin概览"
description: "全面整理 Kotlin 的内置类型、面向对象、函数与高阶函数及编译原理，加上清晰的代码和图解示例，帮助你迅速掌握核心精髓。"
date: "2021-04-03"
tags: ["Kotlin", "Android", "编程语言"]
---

在切换至 Kotlin 开发的过程中，理解其内置类型、高阶函数以及编译时特性是掌握这门语言不可或缺的基础。本文整合了多篇文档的核心知识点，配合大量的示例代码和截图，对 Kotlin 常见机制进行了一次全面系统的回顾。

## 1. 内置类型与基础语法 {#kotlin-built-in-types}

Kotlin 与 Java 在类型上有明显的区别。Kotlin 的基础类型包括：`Byte`、`Int`、`Long`、`Float`、`Double`、`Char`、`String`。

### 1.1 基本类型特性

1. **统一类型系统**：Java 中区分基本数据类型（如 `int`）和包装类型（如 `Integer`），而 Kotlin 中表现出高度一致，只有一种概念上的类型。编译器在生成 JVM 字节码时会根据具体使用场景自动决定使用原始类型还是包装类型。
2. **无隐式转换**：Kotlin 不允许像 Java 那样把 `Int` 隐式赋予 `Long` 变量，必须显示调用 `.toLong()` 方法。
3. **内容比较与引用比较**：在 Kotlin 当中，`==` 用于比较内容（底层调用 `equals`），而 `===` 用于比较内存引用地址（引用的同一对象）。
4. **字符串模板机制**：支持用 `$` 为符号直接内嵌变量或使用 `${}` 镶嵌复杂表达式。支持通过 `"""` 创建保留所有回车换行的多行原始字符串。

示例代码：

```kotlin
val e: Int = 10
val f: Long = e.toLong() // 必须显式转换

val k = "Today is a sunny day."
val m = String("Today is a sunny day.".toCharArray())
println(k === m) // false：比较引用内存地址
println(k == m)  // true：比较真实内容

val j = "I❤️China"
println("Length of String 'j' is: ${j.length}") // 字符串模板示例
```

### 1.2 数组、集合与区间

基本类型都有对应的类似 `IntArray` 等优化数组，对应 Java 基本类型数组。而 `Array<Int>` 对应的是包装类型的数组，如 `Integer[]`。
![](/assets/img/kotlin/types-1.png)

```kotlin
// 声明一个区间
val intRange = 1..10       // 闭区间 [1, 10]
val exclusive = 1 until 10 // 前闭后开区间 [1, 10)
val revRange = 10 downTo 1 // 降序序列 [10, 9, ... 1]
val stepped = 1..10 step 2 // 间隔为 2

// 集合的遍历
val intList: List<Int> = listOf(1, 2, 3, 4)
intList.forEachIndexed { index, i ->
    println("index = $index, value = $i")
}
```

### 1.3 变量、控制流表达式与运算符重载

与 Java 不同，Kotlin 中 `if`、`when` 甚至 `try...catch` 都可以直接作为**表达式**参与赋值运算返回结果：

```kotlin
val c = if (a == 3) 4 else 5

val result = when (x) {
    0 -> 5
    is String -> x.length
    else -> 20
}

val num = try { a / b } catch (e: Exception) { 0 }
```

**`val` 与 `const val` 的区分：**

- `val` 是**只读变量**，当用于类属性时，如果写了自定义的 `getter`，每次调用可能会计算返回不同的结果。
- `const val` 是真正的**编译期常量**，类似 Java 的 `static final`，只能定义于全局层级并用于基础字面量的修饰。

**中缀语法与操作符重载：**
可使用 `operator` 覆写并构建直观的数学操作符（`+`、`-`、`[ ]`），并用 `infix` 修饰函数，让程序读起来像自然语言：

```kotlin
class Complex(var real: Double, var image: Double) {
    // 允许通过 c1 + c2 的操作直接累加对象
    operator fun plus(other: Complex) = Complex(real + other.real, image + other.image)
}

// 极其著名的中缀函数实例
infix fun <A, B> A.to(that: B): Pair<A, B> = Pair(this, that)
val pair = 2 to 3 // 等价于调用 2.to(3)
```

---

## 2. 自建类型与面向对象 {#kotlin-oop}

Kotlin 对面向对象范式进行了深度增强，不仅减少了样板代码（Boilerplate），还内置了大量实用的设计模式结构。

### 2.1 类、属性与可见性

Kotlin 里的属性在底层是由 `field + getter + setter` 默认生成的。类的默认修饰符是 `final`，要允许继承一个类，必须在前段显式加上 `open` 修饰符：

```kotlin
open class SimpleClass(var x: Int, val y: String) : AbsClass(), SimpleInf {
    override val simpleProperty: Int
        get() = 2 // 自定义 getter

    val z: Long
        get() = simpleProperty * 2L
}
```

类的可见性关键字含义（如 internal 为模块可见）：
![](/assets/img/kotlin/custom_types-1.png)

### 2.2 扩展函数与属性

Kotlin 的“扩展（Extensions）”极大优化了代码架构。在不修改基类源码的基础上，可以动态“挂接”方法或属性：

```kotlin
fun String.lastChar(): Char {
    return this[this.length - 1] // this 表示目标对象
}
```

### 2.3 延迟初始化与空安全

```kotlin
val str: String? = null
val length = str?.length      // 安全调用，如果非空则执行
val res: String = str ?: "0"  // Elvis 操作符：前面为空则取后者的备用值
str!!.length                  // 强制转换为不可空类型并调用（可能抛异常）
```

延时初始化可以使用 `lateinit`，后续可用 `::inner.isInitialized` 判读是否初赋值完成：

```kotlin
class Config {
    lateinit var inner: String

    fun setup() {
        if (!this::inner.isInitialized) {
            inner = "Done!"
        }
    }
}
```

### 2.4 属性代理与数据类

纯存放数据各类模型，加上 `data` 关键字将会自动生成常用模板：`equals()`、`hashCode()`、`toString()`、`copy()` 以及解构方法 `componentN()`。

```kotlin
// 创建一个全功能的数据承载模型仅仅需要一行代码
data class User(val id: Int, val name: String)
```

属性委托可以将变量的 `getter` / `setter` 控制权移交给其它类：

```kotlin
class Person(private val name: String) {
    // lazy：代理了 firstName 的 getter，只会初始化一次
    val firstName: String by lazy { name.split(" ")[0] }

    // observable：代理了 state 获取/设值，设值时会触发回调
    var state: Int by Delegates.observable(0) { property, oldValue, newValue ->
        println("State changed from $oldValue -> $newValue")
    }
}
```

### 2.5 泛型体系与实化约束 (Generics & Reified)

泛型在 Kotlin 中获得了深度增强。除标准的声明约束 `<T: Comparable<T>>` 外，还可以借助 `where` 语句附加更严格的多维度限制：

```kotlin
fun <T> maxOf(a: T, b: T) where T : Comparable<T>, T : () -> Unit {
    return if (a > b) a() else b()
}
```

**Type Erasure 泛型擦除与 `reified` 伪关键突破：**
与 Java 一样，基于 JVM 下的泛型实例会在编译期遭到强制类型擦除（导致无法直接调用 `T::class` 等获取实类）。但 Kotlin 可通过 `inline` 内联函数的展开能力搭配 `reified` 后饰词，创造出真正可以在运行期抓取实际类型反射的**真泛型能力**：

```kotlin
// 利用 inline 铺平上下环境，reified 拿到真实的 T 元信息拦截类型探测
inline fun <reified T : AbsModel> modelOf() = ModelDelegate(T::class)
```

### 2.6 反射机制剖析 (Reflection)

Kotlin 提供了一套完全独立的反射工具库 `kotlin-reflect`，其常见数据结构大类为 `KClass`、`KFunction`、`KProperty` 等等。
凭借强大的反射，能在运行时逆向突破限制或进行诸如**对象深层次的遍历拷贝**等极限操作。

```kotlin
// 利用 declaredFunctions 搜索所有参数信息，并逐出其深层附带泛型的实体值
Api::class.declaredFunctions.first { it.name == "getUsers" }
    .returnType.arguments.forEach { println(it.type) }
```

---

## 3. 函数与高阶函数 {#kotlin-functions}

Kotlin 是一门允许将**函数作为一等公民**的语言。函数可以赋值给变量，可以作为参数，也可以作为返回值。

### 3.1 函数的本质

一等公民的概念和函数类型的示例图：
![](/assets/img/kotlin/functions-6.png)

函数的类型及引用示范：

```kotlin
fun foo(p0: Int): String { return "" } // 函数类型是 (Int) -> String
val funcRef: (Int) -> String = ::foo   // 获取函数的引用
```

> **注意：`(T) -> Unit` 和 `T.() -> Unit` 类型的区别：**
> 两者生成的字节码虽然一致，都是 `Function1<T, Unit>`。但在代码层面：前者仅仅是传入 `T` 泛型实例作为函数的必填常规参数；而后者是**带有接收者（Receiver）**的函数类型，会把传递进入的 `T` 隐式地转化为闭包作用域内部的 `this` 关键字操作。

### 3.2 高阶函数与内联优化 (Inline)

高阶函数指的是**将一个函数类型作为参数，或者把一个函数作为返回值返回**的函数。

```kotlin
fun time(block: () -> Unit) {
    val start = System.currentTimeMillis()
    block() // 闭包执行
    println(System.currentTimeMillis() - start)
}
```

为避免高阶函数内部重复创建函数对象造成的性能损耗，在前面加上 `inline`。编译器会把**内联函数**和它包裹的内容展开直接铺平嵌到调用它的源码位置。

### 3.3 集合变换与高级序列

在处理集合时，大量默认的高阶函数极大方便了日常的流式编程：

- **`filter`**: 对集合按条件过滤筛选。
  ![](/assets/img/kotlin/functions-1.png)

- **`map`**: 对集合对象进行 1对1 的变换转换。
  ![](/assets/img/kotlin/functions-2.png)

- **`flatMap`**: 铺平集合（展平多层 List）。
  ![](/assets/img/kotlin/functions-3.png)

- **`fold`** 或 `reduce`: 进行累加类的聚合运算操作。
  ![](/assets/img/kotlin/functions-4.png)

综合示例操作：

```kotlin
val list = listOf(1, 2, 3, 4)
list.filter { it % 2 == 0 }     // 选择偶数 [2, 4]
    .map { it * 2 + 1 }         // 乘积加一 [5, 9]
    .forEach { println(it) }    // 最终遍历 5与9
```

### 3.4 作用域扩展函数、SAM 转换与 DSL

Kotlin 语言核心中被高频使用的五个作用域扩展函数（`let`, `run`, `also`, `apply`, `use`）：

```kotlin
fun <T, R> T.let(block: (T) -> R): R
fun <T, R> T.run(block: T.() -> R): R
fun <T> T.also(block: (T) -> Unit): T
fun <T> T.apply(block: T.() -> Unit): T
fun <T : Closeable?, R> T.use(block: (T) -> R): R
```

**SAM (Simple Abstract Method) 转换**支持 Java 单抽象接口在 Kotlin 里的一键 Lambda 替换。
![](/assets/img/kotlin/functions-5.png)

---

## 4. 协程实用指南 {#coroutines}

Kotlin 协程是一个强大的并发框架，让异步编程变得简单且可读。与回调或 RxJava 不同，协程让你以同步的方式编写异步代码。

### 4.1 什么是协程？ {#what-are-coroutines}

协程是一个轻量级的、可挂起的计算。与线程不同，协程非常廉价 —— 你可以启动上千个而不会出现性能问题，因为它们不是与操作系统线程 1:1 映射的。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    launch {
        delay(1000L)
        println("World!")
    }
    println("Hello,")
}
// 输出: Hello, World!
```

**关键特性**：

- **轻量级**：协程由 Kotlin 运行时管理，而非操作系统。
- **可挂起**：可以暂停执行而不阻塞线程。
- **结构化**：通过结构化并发管理生命周期。

### 4.2 挂起函数 {#suspend-functions}

`suspend` 关键字标记可以被暂停和恢复的函数。它们只能在其他挂起函数或协程构建器中调用：

```kotlin
suspend fun fetchUser(userId: String): User {
    val response = httpClient.get("https://api.example.com/users/$userId")
    return response.body<User>()
}

suspend fun fetchUserWithPosts(userId: String): UserWithPosts {
    val user = fetchUser(userId)
    val posts = fetchPosts(userId) // 在 fetchUser 完成后运行
    return UserWithPosts(user, posts)
}
```

> **底层原理**：Kotlin 编译器使用 **续体传递风格 (Continuation Passing Style, CPS)** 将挂起函数转换为状态机。

### 4.3 协程构建器 {#builders}

Kotlin 提供了几种协程构建器：

| 构建器        | 返回值        | 使用场景                 |
| ------------- | ------------- | ------------------------ |
| `launch`      | `Job`         | 即发即忘，不需要返回结果 |
| `async`       | `Deferred<T>` | 返回结果，可以被 await   |
| `runBlocking` | `T`           | 桥接阻塞代码与协程世界   |
| `withContext` | `T`           | 切换协程上下文/调度器    |

**使用 async 并行执行**：

```kotlin
suspend fun loadDashboard(): Dashboard = coroutineScope {
    val user = async { fetchUser() }
    val posts = async { fetchPosts() }
    val notifications = async { fetchNotifications() }

    // 三个请求并行执行，同步等待结果
    Dashboard(
        user = user.await(),
        posts = posts.await(),
        notifications = notifications.await()
    )
}
```

### 4.4 调度器 {#dispatchers}

调度器决定协程在哪个线程池上运行：

- **`Dispatchers.Main`**：主/UI 线程（Android）。用于 UI 更新。
- **`Dispatchers.IO`**：为磁盘/网络读写优化。使用共享的线程池。
- **`Dispatchers.Default`**：CPU 密集型工作。使用等于 CPU 核心数的线程。
- **`Dispatchers.Unconfined`**：在调用者线程启动，并在恢复时使用当前正在运行的任意线程。

### 4.5 结构化并发 {#structured-concurrency}

结构化并发确保协程不会泄漏，并在不再需要时被正确取消。它的核心原则是：

- 协程的生命周期绑定到其**作用域**。
- 父协程被取消时，所有子协程也会被自动取消。
- 子协程失败时，父协程和兄弟协程也会被取消（除非使用 `supervisorScope`）。

```kotlin
class UserViewModel : ViewModel() {
    // viewModelScope 在 ViewModel 被清除时自动取消
    fun loadUser() {
        viewModelScope.launch {
            try {
                val user = repository.fetchUser()
                _userState.value = UiState.Success(user)
            } catch (e: Exception) {
                _userState.value = UiState.Error(e.message)
            }
        }
    }
}
```

### 4.6 Flow：基于协程的响应式流 {#flow}

`Flow` 是 Kotlin 基于协程构建的响应式流（Reactive Stream）标准方案，可以用来冷发射多个值：

```kotlin
fun observeSearchResults(query: Flow<String>): Flow<List<Result>> {
    return query
        .debounce(300)
        .distinctUntilChanged()
        .flatMapLatest { searchQuery ->
            repository.search(searchQuery)
        }
        .catch { emit(emptyList()) }
}
```

---

## 5. Kotlin 编译原理 {#kotlin-compilation}

所有的 Kotlin 源码最后还是编译成 JVM 的 `.class` 字节码文件，这也是能够与 Java **百分之百无缝互相调用**的原因。

在 Kotlin 中许多看似神奇优雅的设计，其实都是在编译期间进行的**语法糖机制转换**：

1. **类型推导**：变量省略声明类型，最后都会由编译器推导后补充还原。
2. **包装类决策**：编译器会根据变量是否有 `?` 可控性，自动判断到底是生成基础装箱 `int` 还是包装引用的 `Integer`。
3. **类与方法修饰符**：Kotlin 的类默认省略了 `public` 和 `final`，编译器在背后悄悄给你都加上了。
4. **嵌套类阻断内存泄露**：我们在 Kotlin 类中新开的一个内部类，默认编译下都会加上 `static` 变成静态内部类，杜绝它持有外部类的隐式引用而导致大面积严重的 Java 内存泄露！
5. **数据类扩展**：仅需加上 `data class`，编译器就会替你在背后洋洋洒洒生成几百行的 `.java` 源码（包括 equals / toString 等）。
