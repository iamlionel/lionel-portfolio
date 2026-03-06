---
title: "Understanding React Fiber Architecture"
description: "A deep dive into React Fiber — the reconciliation engine behind React's concurrent rendering"
date: "2026-03-06"
tags: ["React", "Fiber", "Performance", "Frontend"]
---

React Fiber is the reimplementation of React's core reconciliation algorithm, introduced in React 16. It enables features like concurrent rendering, Suspense, and prioritized updates. In this post, we'll explore how Fiber works under the hood.

## What is React Fiber? {#what-is-fiber}

React Fiber is a complete rewrite of React's reconciler — the engine responsible for determining what changes need to be made to the DOM. The old reconciler (Stack Reconciler) processed updates synchronously, which could block the main thread and cause janky user experiences.

Fiber solves this by introducing an **incremental rendering** model: work can be split into chunks, paused, resumed, or even aborted based on priority.

## The Fiber Node {#fiber-node}

At the heart of Fiber is the **Fiber Node** — a JavaScript object that represents a unit of work. Each React element gets a corresponding Fiber node:

```js
{
  type: 'div',           // Component type
  key: null,             // Reconciliation key
  stateNode: DOM_NODE,   // Reference to the actual DOM node
  child: Fiber | null,   // First child Fiber
  sibling: Fiber | null, // Next sibling Fiber
  return: Fiber | null,  // Parent Fiber
  pendingProps: {},       // New props
  memoizedProps: {},      // Props from last render
  memoizedState: {},      // State from last render
  effectTag: 'UPDATE',   // What side effect to perform
  alternate: Fiber,      // Work-in-progress / current Fiber
}
```

Fiber nodes form a **linked list tree** using `child`, `sibling`, and `return` pointers, enabling efficient traversal without recursion.

## Two Phases of Rendering {#two-phases}

Fiber splits rendering into two distinct phases:

### Phase 1: Render (Reconciliation)

This phase is **interruptible**. Fiber walks the tree, compares old and new elements, and builds a list of effects (changes to apply). No DOM mutations happen here.

Key operations:

- Call `render()` or function component body
- Diff children (reconciliation)
- Build the work-in-progress tree

### Phase 2: Commit

This phase is **synchronous and uninterruptible**. React applies all the collected effects to the DOM in one go:

- Insert, update, or delete DOM nodes
- Call lifecycle methods (`componentDidMount`, `useEffect`, etc.)
- Update refs

## Priority and Scheduling {#priority}

Fiber introduces a **priority system** for updates. Not all updates are equal:

| Priority     | Example               | Behavior                    |
| ------------ | --------------------- | --------------------------- |
| Immediate    | User input, clicks    | Executed synchronously      |
| UserBlocking | Hover effects         | High priority, near-instant |
| Normal       | Data fetching results | Standard priority           |
| Low          | Analytics, logging    | Can be deferred             |
| Idle         | Prefetching           | Only when browser is idle   |

React's scheduler (`scheduler` package) uses `requestIdleCallback`-like mechanisms to yield control back to the browser between units of work.

## Concurrent Mode and Fiber {#concurrent-mode}

Fiber is the foundation for React's concurrent features:

- **`startTransition`**: Mark updates as non-urgent so they don't block user interactions
- **`Suspense`**: Pause rendering while waiting for async data
- **`useDeferredValue`**: Defer re-rendering of expensive components

```jsx
import { startTransition } from "react";

function handleSearch(query) {
  // Urgent: update the input
  setInput(query);

  // Non-urgent: update filtered results
  startTransition(() => {
    setFilteredResults(filterData(query));
  });
}
```

## Key Takeaways {#key-takeaways}

- Fiber is React's reconciliation engine that enables incremental, interruptible rendering
- Each element maps to a Fiber node in a linked list tree structure
- Rendering is split into an interruptible **Render phase** and a synchronous **Commit phase**
- Updates are prioritized, allowing urgent interactions to preempt background work
- Fiber is the foundation for concurrent features like `startTransition` and `Suspense`

Understanding Fiber helps you write more performant React apps, debug rendering issues, and make better use of concurrent APIs.
