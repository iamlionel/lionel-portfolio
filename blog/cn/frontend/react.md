---
title: "React概览"
description: "系统梳理 React 核心概念，涵盖组件化开发、JSX 语法、Hooks 体系、组件通信、状态管理与样式方案。"
date: "2025-09-15"
tags: ["React", "前端", "JavaScript"]
---

## 什么是 React？ {#what-is-react}

React 是 Meta 推出的用于构建用户界面的 JavaScript 库，其核心理念体现在以下四点：

1. **组件化开发（Component-Based）**：UI 被拆分为一个个独立、可复用的**组件**，每个组件管理自己的状态与渲染逻辑，如同搭积木一样组合成完整的页面。这极大提升了代码的可维护性与复用率。

2. **声明式 UI（Declarative UI）**：你只需描述"界面应该长什么样"，React 负责计算出最小的 DOM 变更并高效更新。相比命令式（"如何一步步去改"）的方式，代码意图更清晰直观。

3. **JSX 语法直观**：JSX 是 JavaScript 的语法扩展，让你可以在 JS 中写 HTML 结构，经由 Babel 编译后转换为 `React.createElement()` 调用。它让组件代码的结构与逻辑融合在一起，极易阅读和理解。

4. **虚拟 DOM（Virtual DOM）优化性能**：React 在内存中维护一棵轻量的"虚拟 DOM 树"。每次状态变化时，React 先在虚拟 DOM 层做 Diff 比对，仅将真正变化的部分同步到真实 DOM，从而避免了不必要的页面重绘，显著提升渲染性能。

---

## 1. JSX 语法 {#jsx}

JSX（JavaScript XML）是 React 的模板语言，本质上是 `React.createElement()` 的语法糖，由 Babel 在编译阶段转换：

```jsx
// JSX 写法
const element = <h1>Hello, world!</h1>;

// 编译后等价于：
const element = React.createElement("h1", null, "Hello, world!");
```

### 在 JSX 中使用表达式 {#jsx-expressions}

用 `{}` 包裹任意合法的 JavaScript 表达式：

```jsx
let count = 100;

function getName() {
  return "I am lionel";
}

function App() {
  return (
    <div className="App">
      {/* 字符串 */}
      {"this is a message"}

      {/* 变量 */}
      {count}

      {/* 函数调用 */}
      {getName()}

      {/* 内联样式（注意双花括号：外层是 JS 表达式，内层是对象字面量） */}
      <div style={{ color: "red" }}>This is a div</div>
    </div>
  );
}
```

### 渲染列表 {#rendering-lists}

```jsx
const list = [
  { id: 1001, name: "Vue" },
  { id: 1002, name: "React" },
  { id: 1003, name: "Angular" },
];

function App() {
  return (
    <ul>
      {/* key 属性帮助 React 高效识别列表项的变化 */}
      {list.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

---

## 2. 组件（Component） {#components}

React 组件是 UI 的基本单元。现代 React 以**函数组件**为主流，类组件已逐渐淡出：

```jsx
// 函数组件（推荐）
function Button() {
  return <button>Click me</button>;
}

// 箭头函数写法
const ArrowButton = () => <button>Arrow Button</button>;

// 类组件（较旧的写法，现在基本不用）
class ClzButton extends React.Component {
  render() {
    return <button>Class Button</button>;
  }
}

// 组合使用
function App() {
  return (
    <div>
      <Button />
      <ArrowButton />
      <ClzButton />
    </div>
  );
}
```

---

## 3. Props 传递 {#props}

`props` 是父组件向子组件传递数据的标准方式，**只读，不可在子组件内修改**。

### 基本传值 {#basic-props}

```jsx
function ParentComponent() {
  const name = "John Doe";
  return <ChildComponent name={name} />;
}

function ChildComponent(props) {
  return <h1>Hello, {props.name}!</h1>;
}
```

### props.children — 插槽模式 {#props-children}

`props.children` 接收组件标签内部嵌套的内容，实现类似"插槽"的灵活组合：

```jsx
function Card(props) {
  return (
    <div className="card">
      <h1>Card Title</h1>
      {/* 渲染外部传入的子内容 */}
      <div>{props.children}</div>
    </div>
  );
}

function App() {
  return (
    <Card>
      <p>This content is passed as children.</p>
    </Card>
  );
}
```

---

## 4. 事件绑定 {#event-binding}

React 使用驼峰命名法（`onClick`、`onChange`）绑定事件，并通过内联箭头函数处理参数传递：

```jsx
// 无参数
function App() {
  const handleClick = () => console.log("clicked");
  return <button onClick={handleClick}>Click me</button>;
}

// 传递参数（用箭头函数包裹）
function App() {
  const handleClick = (name) => console.log("clicked by", name);
  return <button onClick={() => handleClick("lionel")}>Click me</button>;
}

// 同时传递参数和事件对象
function App() {
  const handleClick = (name, e) => console.log(name, e);
  return <button onClick={(e) => handleClick("lionel", e)}>Click me</button>;
}
```

---

## 5. 核心 Hooks {#hooks}

### 5.1 useState — 本地状态 {#use-state}

`useState` 让函数组件拥有自己的状态：

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0); // 初始值为 0

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### 5.2 useEffect — 副作用处理 {#use-effect}

`useEffect` 用于处理网络请求、订阅、DOM 操作等副作用，对应类组件的 `componentDidMount`、`componentDidUpdate`、`componentWillUnmount`：

```jsx
import { useState, useEffect } from "react";

function Example() {
  const [count, setCount] = useState(0);

  // 无依赖数组：每次渲染后都执行
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  // 依赖数组为空：仅在组件挂载后执行一次（等价于 componentDidMount）
  useEffect(() => {
    console.log("Mounted");
  }, []);

  // 指定依赖：仅在 count 变化时执行
  useEffect(() => {
    console.log("count changed:", count);
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>+1</button>;
}
```

**网络请求示例：**

```jsx
useEffect(() => {
  async function fetchData() {
    const res = await fetch("https://api.example.com/data");
    const json = await res.json();
    setList(json.data);
  }
  fetchData();
}, []); // 仅挂载时请求一次
```

**清理副作用（cleanup）：**

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Counting");
  }, 1000);

  // 返回清理函数：组件卸载时自动调用，清除定时器
  return () => clearInterval(timer);
}, []);
```

### 5.3 useContext — 跨层级状态共享 {#use-context}

比逐层传 props 更优雅地在组件树中共享数据：

```jsx
import { createContext, useContext, useState } from "react";

// 1. 创建 Context 对象
const ThemeContext = createContext();

// 2. 提供者（Provider）：在顶层包裹并注入 value
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. 消费者：在任意子孙组件中用 useContext 直接获取
const Header = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <header>
      <span>Current: {theme}</span>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
    </header>
  );
};

const App = () => (
  <ThemeProvider>
    <Header />
  </ThemeProvider>
);
```

### 5.4 useRef — 访问 DOM 元素 {#use-ref}

在 React 中不直接操作 DOM，应通过 `useRef` 获取真实 DOM 节点：

```jsx
import { useRef } from "react";

function App() {
  const myRef = useRef(null);

  function handleClick() {
    // 通过 .current 访问真实 DOM 节点
    myRef.current.style.backgroundColor = "red";
  }

  return (
    <div>
      <div ref={myRef}>Hello, World!</div>
      <button onClick={handleClick}>Change Color</button>
    </div>
  );
}
```

---

## 6. 组件通信 {#component-communication}

### 6.1 父 → 子：Props {#parent-to-child}

直接通过 props 传递数据（见第 3 节）。

### 6.2 子 → 父：Callback 回调 {#child-to-parent}

父组件将一个回调函数作为 props 传给子组件，子组件调用它来向父组件传递数据：

```jsx
function ParentComponent() {
  const [message, setMessage] = useState("");

  return (
    <div>
      <p>Received: {message}</p>
      <ChildComponent onSend={setMessage} />
    </div>
  );
}

function ChildComponent({ onSend }) {
  return (
    <button onClick={() => onSend("Hello from Child!")}>Send to Parent</button>
  );
}
```

### 6.3 状态提升（State Lifting） {#state-lifting}

兄弟组件需要共享数据时，将 state 提升到它们最近的公共父组件中统一管理：

```jsx
function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Counter1 count={count} onChange={() => setCount(count + 1)} />
      <Counter2 count={count} onChange={() => setCount(count - 1)} />
    </div>
  );
}

function Counter1({ count, onChange }) {
  return <button onClick={onChange}>+ (count: {count})</button>;
}

function Counter2({ count, onChange }) {
  return <button onClick={onChange}>- (count: {count})</button>;
}
```

---

## 7. 受控组件（Controlled Binding） {#controlled-components}

表单元素的值受 React state 驱动，使 React 成为数据的"单一数据源"：

```jsx
import { useState } from "react";

function App() {
  const [value, setValue] = useState("");

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something..."
      />
      <p>You typed: {value}</p>
    </div>
  );
}
```

---

## 8. 自定义 Hook {#custom-hooks}

将可复用的有状态逻辑封装到独立的函数中（函数名必须以 `use` 开头）：

```jsx
import { useState } from "react";

// 自定义 Hook：封装开关状态逻辑
function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);
  const toggle = () => setState((prev) => !prev);
  return [state, toggle];
}

// 在组件中复用
function ToggleComponent() {
  const [isOn, toggle] = useToggle(false);

  return (
    <div>
      <button onClick={toggle}>Toggle</button>
      {isOn && <p>Feature is ON</p>}
    </div>
  );
}
```

## 9. Hooks 使用规则 {#hooks-rules}

1. **只在顶层调用**：不能在循环、条件或嵌套函数内调用 Hook（否则每次渲染调用顺序可能不一致，导致 bug）。
2. **只在 React 函数中调用**：只能在函数组件或自定义 Hook 中使用，不能在普通 JavaScript 函数里调用。
3. **自定义 Hook 以 `use` 开头**：这是区分自定义 Hook 与普通函数的约定俗成的命名规范。
