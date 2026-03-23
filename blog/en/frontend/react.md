---
title: "React Overview"
description: "A systematic overview of React's core concepts, covering component-based development, JSX syntax, the Hooks system, component communication, and state management."
date: "2025-09-15"
tags: ["React", "Frontend", "JavaScript"]
---

## What is React?

React is a JavaScript library built by Meta for building user interfaces. Its philosophy is built on four core pillars:

1. **Component-Based**: The UI is broken into independent, reusable **components**, each managing its own state and rendering logic — like building blocks composed into a full page. This dramatically improves maintainability and reusability.

2. **Declarative UI**: You describe _what the UI should look like_, and React figures out the minimal set of DOM changes needed. Compared to imperative ("how to change it step-by-step") approaches, declarative code is far more readable and predictable.

3. **Intuitive JSX Syntax**: JSX is a syntax extension for JavaScript that lets you write HTML-like markup inside JS files. Babel compiles it down to `React.createElement()` calls. It blends structure and logic into a single, easy-to-understand format.

4. **Virtual DOM for Performance**: React maintains a lightweight "virtual DOM tree" in memory. On each state change, it runs a Diff algorithm against the virtual DOM and only syncs the actual changes to the real DOM — avoiding unnecessary re-renders and significantly boosting performance.

---

## 1. JSX Syntax

JSX (JavaScript XML) is React's templating language — syntactic sugar for `React.createElement()`, compiled by Babel at build time:

```jsx
// JSX syntax
const element = <h1>Hello, world!</h1>;

// Compiles to:
const element = React.createElement("h1", null, "Hello, world!");
```

### Expressions in JSX

Wrap any valid JavaScript expression in `{}`:

```jsx
let count = 100;

function getName() {
  return "I am lionel";
}

function App() {
  return (
    <div className="App">
      {/* String literal */}
      {"this is a message"}

      {/* Variable */}
      {count}

      {/* Function call */}
      {getName()}

      {/* Inline style (outer {} = JS expression, inner {} = object literal) */}
      <div style={{ color: "red" }}>This is a div</div>
    </div>
  );
}
```

### Rendering Lists

```jsx
const list = [
  { id: 1001, name: "Vue" },
  { id: 1002, name: "React" },
  { id: 1003, name: "Angular" },
];

function App() {
  return (
    <ul>
      {/* key helps React efficiently identify which items changed */}
      {list.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

---

## 2. Components

A React component is the fundamental building block of any UI. Modern React favors **function components** — class components are largely legacy:

```jsx
// Function component (recommended)
function Button() {
  return <button>Click me</button>;
}

// Arrow function style
const ArrowButton = () => <button>Arrow Button</button>;

// Class component (legacy, rarely used today)
class ClzButton extends React.Component {
  render() {
    return <button>Class Button</button>;
  }
}

// Compose them together
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

## 3. Props

`props` is how a parent passes data down to a child component. Props are **read-only** — the child must never mutate them.

### Basic Passing

```jsx
function ParentComponent() {
  const name = "John Doe";
  return <ChildComponent name={name} />;
}

function ChildComponent(props) {
  return <h1>Hello, {props.name}!</h1>;
}
```

### props.children — Slot Pattern

`props.children` holds whatever is nested between the component's opening and closing tags, enabling flexible composition:

```jsx
function Card(props) {
  return (
    <div className="card">
      <h1>Card Title</h1>
      {/* Render externally provided content here */}
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

## 4. Event Binding

React uses camelCase event names (`onClick`, `onChange`) and inline arrow functions for argument passing:

```jsx
// No arguments
function App() {
  const handleClick = () => console.log("clicked");
  return <button onClick={handleClick}>Click me</button>;
}

// Pass custom arguments (wrap in arrow function)
function App() {
  const handleClick = (name) => console.log("clicked by", name);
  return <button onClick={() => handleClick("lionel")}>Click me</button>;
}

// Pass both arguments and the event object
function App() {
  const handleClick = (name, e) => console.log(name, e);
  return <button onClick={(e) => handleClick("lionel", e)}>Click me</button>;
}
```

---

## 5. Core Hooks

### 5.1 useState — Local State

`useState` gives function components their own state:

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0); // initial value: 0

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### 5.2 useEffect — Side Effects

`useEffect` handles side effects like data fetching, subscriptions, and DOM manipulation. It maps to `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined:

```jsx
import { useState, useEffect } from "react";

function Example() {
  const [count, setCount] = useState(0);

  // No dependency array: runs after every render
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  // Empty array: runs once after mount (equivalent to componentDidMount)
  useEffect(() => {
    console.log("Mounted");
  }, []);

  // Specific dependency: runs only when count changes
  useEffect(() => {
    console.log("count changed:", count);
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>+1</button>;
}
```

**Data fetching example:**

```jsx
useEffect(() => {
  async function fetchData() {
    const res = await fetch("https://api.example.com/data");
    const json = await res.json();
    setList(json.data);
  }
  fetchData();
}, []); // Fetch once on mount
```

**Cleanup function:**

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Counting");
  }, 1000);

  // Return a cleanup function — called when the component unmounts
  return () => clearInterval(timer);
}, []);
```

### 5.3 useContext — Cross-Component State Sharing

A much cleaner alternative to prop-drilling for sharing data across the component tree:

```jsx
import { createContext, useContext, useState } from "react";

// 1. Create the Context
const ThemeContext = createContext();

// 2. Provider: wrap the tree and inject the value
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Consumer: access the value anywhere in the tree with useContext
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

### 5.4 useRef — Accessing DOM Elements

In React, you don't directly manipulate the DOM. Use `useRef` to get a reference to a real DOM node:

```jsx
import { useRef } from "react";

function App() {
  const myRef = useRef(null);

  function handleClick() {
    // Access the real DOM node via .current
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

## 6. Component Communication

### 6.1 Parent → Child: Props

Pass data directly via props (see Section 3).

### 6.2 Child → Parent: Callback Functions

The parent passes a callback as a prop; the child calls it to send data back up:

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

### 6.3 State Lifting

When sibling components need shared state, lift it up to their nearest common ancestor:

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

## 7. Controlled Components

Form element values are driven by React state, making React the **single source of truth**:

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

## 8. Custom Hooks

Encapsulate reusable stateful logic into dedicated functions. The name **must start with `use`**:

```jsx
import { useState } from "react";

// Custom hook: encapsulates toggle logic
function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);
  const toggle = () => setState((prev) => !prev);
  return [state, toggle];
}

// Reuse in any component
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

---

## 9. Rules of Hooks

1. **Only call Hooks at the top level**: Never inside loops, conditions, or nested functions — this ensures Hooks are called in the same order on every render.
2. **Only call Hooks from React functions**: Use them only in function components or custom Hooks, never in plain JavaScript functions.
3. **Custom Hooks must start with `use`**: This naming convention distinguishes custom Hooks from regular utility functions and enables linting rule enforcement.
