---
title: "深入理解 React Fiber 架构"
description: "深入 React Fiber —— React 并发渲染背后的协调引擎"
date: "2026-03-06"
tags: ["React", "Fiber", "性能优化", "前端"]
---

React Fiber 是 React 核心协调算法的重新实现，在 React 16 中引入。它使并发渲染、Suspense 和优先级更新等特性成为可能。本文将深入探讨 Fiber 的工作原理。

## 什么是 React Fiber？ {#what-is-fiber}

React Fiber 是 React 协调器（Reconciler）的完全重写 —— 协调器负责确定需要对 DOM 做出哪些更改。旧的协调器（栈协调器）同步处理更新，这可能会阻塞主线程并导致卡顿的用户体验。

Fiber 通过引入**增量渲染**模型来解决这个问题：工作可以被分割成块，根据优先级暂停、恢复甚至中止。

## Fiber 节点 {#fiber-node}

Fiber 的核心是 **Fiber 节点** —— 一个代表工作单元的 JavaScript 对象。每个 React 元素都有一个对应的 Fiber 节点：

```js
{
  type: 'div',           // 组件类型
  key: null,             // 协调 key
  stateNode: DOM_NODE,   // 对实际 DOM 节点的引用
  child: Fiber | null,   // 第一个子 Fiber
  sibling: Fiber | null, // 下一个兄弟 Fiber
  return: Fiber | null,  // 父 Fiber
  pendingProps: {},       // 新的 props
  memoizedProps: {},      // 上次渲染的 props
  memoizedState: {},      // 上次渲染的 state
  effectTag: 'UPDATE',   // 需要执行的副作用
  alternate: Fiber,      // work-in-progress / current Fiber
}
```

Fiber 节点通过 `child`、`sibling` 和 `return` 指针形成一棵**链表树**，无需递归即可高效遍历。

## 渲染的两个阶段 {#two-phases}

Fiber 将渲染分为两个不同的阶段：

### 阶段一：Render（协调）

这个阶段是**可中断的**。Fiber 遍历树，比较新旧元素，并构建一个副作用列表（要应用的更改）。此阶段不会发生 DOM 变更。

关键操作：

- 调用 `render()` 或函数组件主体
- 对比子元素（协调）
- 构建 work-in-progress 树

### 阶段二：Commit

这个阶段是**同步且不可中断的**。React 将所有收集到的副作用一次性应用到 DOM：

- 插入、更新或删除 DOM 节点
- 调用生命周期方法（`componentDidMount`、`useEffect` 等）
- 更新 refs

## 优先级与调度 {#priority}

Fiber 为更新引入了**优先级系统**。并非所有更新都是平等的：

| 优先级       | 示例           | 行为               |
| ------------ | -------------- | ------------------ |
| Immediate    | 用户输入、点击 | 同步执行           |
| UserBlocking | 悬停效果       | 高优先级，近乎即时 |
| Normal       | 数据请求结果   | 标准优先级         |
| Low          | 分析、日志     | 可以延迟           |
| Idle         | 预加载         | 仅在浏览器空闲时   |

React 的调度器（`scheduler` 包）使用类似 `requestIdleCallback` 的机制在工作单元之间将控制权交还给浏览器。

## 并发模式与 Fiber {#concurrent-mode}

Fiber 是 React 并发特性的基础：

- **`startTransition`**: 标记更新为非紧急，不会阻塞用户交互
- **`Suspense`**: 在等待异步数据时暂停渲染
- **`useDeferredValue`**: 延迟高开销组件的重新渲染

```jsx
import { startTransition } from "react";

function handleSearch(query) {
  // 紧急：更新输入框
  setInput(query);

  // 非紧急：更新过滤结果
  startTransition(() => {
    setFilteredResults(filterData(query));
  });
}
```

## 核心要点 {#key-takeaways}

- Fiber 是 React 的协调引擎，支持增量、可中断的渲染
- 每个元素映射到链表树结构中的一个 Fiber 节点
- 渲染分为可中断的 **Render 阶段**和同步的 **Commit 阶段**
- 更新按优先级排列，允许紧急交互抢占后台工作
- Fiber 是 `startTransition` 和 `Suspense` 等并发特性的基础

理解 Fiber 有助于编写更高性能的 React 应用、调试渲染问题并更好地使用并发 API。
