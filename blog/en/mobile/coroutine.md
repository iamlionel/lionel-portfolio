---
title: "Kotlin Coroutines: A Practical Guide"
description: "Understanding Kotlin coroutines — structured concurrency, suspend functions, and real-world patterns"
date: "2026-03-06"
tags: ["Kotlin", "Coroutines", "Android", "Mobile"]
---

Kotlin Coroutines are a powerful concurrency framework that makes asynchronous programming simple and readable. Unlike callbacks or RxJava, coroutines let you write async code that looks sequential. Let's explore how they work.

## What Are Coroutines? {#what-are-coroutines}

A coroutine is a lightweight, suspendable computation. Unlike threads, coroutines are incredibly cheap — you can launch thousands without performance issues because they don't map 1:1 to OS threads.

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    launch {
        delay(1000L)
        println("World!")
    }
    println("Hello,")
}
// Output: Hello, World!
```

Key characteristics:

- **Lightweight**: Coroutines are managed by the Kotlin runtime, not the OS
- **Suspendable**: They can pause execution without blocking the thread
- **Structured**: Lifecycle is managed through structured concurrency

## Suspend Functions {#suspend-functions}

The `suspend` keyword marks functions that can be paused and resumed. They can only be called from other suspend functions or coroutine builders:

```kotlin
suspend fun fetchUser(userId: String): User {
    val response = httpClient.get("https://api.example.com/users/$userId")
    return response.body<User>()
}

suspend fun fetchUserWithPosts(userId: String): UserWithPosts {
    val user = fetchUser(userId)
    val posts = fetchPosts(userId) // Runs after fetchUser completes
    return UserWithPosts(user, posts)
}
```

Under the hood, the Kotlin compiler transforms suspend functions into state machines using **Continuation Passing Style (CPS)**.

## Coroutine Builders {#builders}

Kotlin provides several coroutine builders:

| Builder       | Returns       | Use Case                              |
| ------------- | ------------- | ------------------------------------- |
| `launch`      | `Job`         | Fire-and-forget, no result needed     |
| `async`       | `Deferred<T>` | Returns a result, can be awaited      |
| `runBlocking` | `T`           | Bridges blocking and coroutine world  |
| `withContext` | `T`           | Switches coroutine context/dispatcher |

### Parallel Execution with async

```kotlin
suspend fun loadDashboard(): Dashboard = coroutineScope {
    val user = async { fetchUser() }
    val posts = async { fetchPosts() }
    val notifications = async { fetchNotifications() }

    // All three run in parallel, await results
    Dashboard(
        user = user.await(),
        posts = posts.await(),
        notifications = notifications.await()
    )
}
```

## Dispatchers {#dispatchers}

Dispatchers determine which thread(s) a coroutine runs on:

- **`Dispatchers.Main`**: Main/UI thread (Android). Use for UI updates
- **`Dispatchers.IO`**: Optimized for disk/network I/O. Uses a shared thread pool
- **`Dispatchers.Default`**: CPU-intensive work. Uses threads equal to CPU cores
- **`Dispatchers.Unconfined`**: Starts in the caller's thread, resumes in whatever thread

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

## Structured Concurrency {#structured-concurrency}

Structured concurrency ensures that coroutines don't leak and are properly cancelled when no longer needed:

```kotlin
class UserViewModel : ViewModel() {
    // viewModelScope is cancelled when ViewModel is cleared
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

Key principles:

- A coroutine's lifetime is bound to its **scope**
- If a parent coroutine is cancelled, all children are cancelled too
- If a child fails, the parent and siblings are cancelled (unless using `supervisorScope`)

## Flow: Reactive Streams with Coroutines {#flow}

`Flow` is Kotlin's answer to reactive streams, built on top of coroutines:

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

// Collect in UI
lifecycleScope.launch {
    viewModel.searchResults
        .flowWithLifecycle(lifecycle, Lifecycle.State.STARTED)
        .collect { results ->
            adapter.submitList(results)
        }
}
```

## Key Takeaways {#key-takeaways}

- Coroutines make async code look **sequential and readable**
- `suspend` functions can pause without blocking threads
- Use `async` for parallel execution, `launch` for fire-and-forget
- **Dispatchers** control which thread pool runs your coroutine
- **Structured concurrency** prevents coroutine leaks and ensures proper cancellation
- **Flow** provides reactive stream capabilities built on coroutines

Kotlin Coroutines are now the recommended approach for async programming on Android and beyond. Master them, and you'll write cleaner, safer concurrent code.
