---
title: "Kotlin 协程实用指南"
description: "理解 Kotlin 协程 —— 结构化并发、挂起函数和实战模式"
date: "2026-03-06"
tags: ["Kotlin", "协程", "Android", "移动端"]
---

Kotlin 协程是一个强大的并发框架，让异步编程变得简单且可读。与回调或 RxJava 不同，协程让你以同步的方式编写异步代码。让我们来探索它的工作原理。

## 什么是协程？ {#what-are-coroutines}

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

关键特性：

- **轻量级**：协程由 Kotlin 运行时管理，而非操作系统
- **可挂起**：可以暂停执行而不阻塞线程
- **结构化**：通过结构化并发管理生命周期

## 挂起函数 {#suspend-functions}

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

在底层，Kotlin 编译器使用**续体传递风格 (CPS)** 将挂起函数转换为状态机。

## 协程构建器 {#builders}

Kotlin 提供了几种协程构建器：

| 构建器        | 返回值        | 使用场景                 |
| ------------- | ------------- | ------------------------ |
| `launch`      | `Job`         | 即发即忘，不需要返回结果 |
| `async`       | `Deferred<T>` | 返回结果，可以被 await   |
| `runBlocking` | `T`           | 桥接阻塞代码与协程世界   |
| `withContext` | `T`           | 切换协程上下文/调度器    |

### 使用 async 并行执行

```kotlin
suspend fun loadDashboard(): Dashboard = coroutineScope {
    val user = async { fetchUser() }
    val posts = async { fetchPosts() }
    val notifications = async { fetchNotifications() }

    // 三个请求并行执行，等待结果
    Dashboard(
        user = user.await(),
        posts = posts.await(),
        notifications = notifications.await()
    )
}
```

## 调度器 {#dispatchers}

调度器决定协程在哪个线程上运行：

- **`Dispatchers.Main`**：主/UI 线程（Android）。用于 UI 更新
- **`Dispatchers.IO`**：为磁盘/网络 I/O 优化。使用共享线程池
- **`Dispatchers.Default`**：CPU 密集型工作。使用等于 CPU 核心数的线程
- **`Dispatchers.Unconfined`**：在调用者线程启动，在恢复时使用任意线程

```kotlin
suspend fun processData() {
    withContext(Dispatchers.IO) {
        val data = readFromDatabase()

        withContext(Dispatchers.Default) {
            val processed = heavyComputation(data)

            withContext(Dispatchers.Main) {
                updateUI(processed)
            }
        }
    }
}
```

## 结构化并发 {#structured-concurrency}

结构化并发确保协程不会泄漏，并在不再需要时被正确取消：

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

核心原则：

- 协程的生命周期绑定到其**作用域**
- 父协程被取消时，所有子协程也会被取消
- 子协程失败时，父协程和兄弟协程也会被取消（除非使用 `supervisorScope`）

## Flow：基于协程的响应式流 {#flow}

`Flow` 是 Kotlin 基于协程构建的响应式流方案：

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

// 在 UI 中收集
lifecycleScope.launch {
    viewModel.searchResults
        .flowWithLifecycle(lifecycle, Lifecycle.State.STARTED)
        .collect { results ->
            adapter.submitList(results)
        }
}
```

## 核心要点 {#key-takeaways}

- 协程让异步代码看起来**像同步代码一样简洁可读**
- `suspend` 函数可以暂停而不阻塞线程
- 使用 `async` 进行并行执行，`launch` 用于即发即忘
- **调度器**控制协程运行在哪个线程池
- **结构化并发**防止协程泄漏，确保正确取消
- **Flow** 提供基于协程的响应式流能力

Kotlin 协程现在是 Android 及更多平台上推荐的异步编程方式。掌握它，你将能编写更简洁、更安全的并发代码。
