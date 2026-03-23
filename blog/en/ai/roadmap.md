---
title: "AI Learning Roadmap"
description: "From math fundamentals to Agent engineering — a structured LLM knowledge map with curated courses, resources, and a project-based todo list."
date: "2026-02-10"
tags: ["AI", "LLM", "Agent", "RAG", "Roadmap"]
---

> **Core Philosophy**: Learn AI with structured thinking — build the roots and trunk of your LLM knowledge first, then fill in the branches. Establish a solid mental model before diving into engineering, with the ultimate goal of **shipping AI products that actually work**.

---

## LLM Knowledge Map Overview {#llm-overview}

Based on the LLM Learning Roadmap, the learning path has five progressive layers:

```markdown
I. Fundamentals: Math + Python + Deep Learning basics

II. Core Architecture: Transformer, Attention, BERT/GPT

III. Pre-training & Fine-tuning: Training objectives, LoRA/QLoRA, RLHF

IV. Applications & Deployment: RAG, Prompt Engineering, LangChain, Inference

V. Frontiers & Ethics: Multimodal, Autonomous Agents, Safety
```

---

## I. Fundamentals {#fundamentals}

### Math {#math}

| Course                | Topic                       | Why It Matters                                                   |
| --------------------- | --------------------------- | ---------------------------------------------------------------- |
| **MIT 18.06**         | Linear Algebra              | The mathematical foundation of Embeddings and Attention          |
| **MIT 18.01 / 18.02** | Calculus                    | Essential for understanding gradient descent and backpropagation |
| **MIT RES.6-012**     | Introduction to Probability | Sampling strategies, loss functions, and information theory      |

### Programming {#programming}

| Course                       | Topic                   | Why It Matters                                                       |
| ---------------------------- | ----------------------- | -------------------------------------------------------------------- |
| **Harvard CS50P**            | Python Programming      | Your first programming course — build solid engineering fundamentals |
| **MIT The Missing Semester** | Essential Dev Toolchain | Shell, Git, Vim, debugging — every engineer's must-know              |

> Course link: [MIT The Missing Semester](https://missing.csail.mit.edu/)

### Machine Learning & Deep Learning {#ml-dl}

| Course                            | Topic                           | Why It Matters                                                                  |
| --------------------------------- | ------------------------------- | ------------------------------------------------------------------------------- |
| **UCB CS188**                     | Introduction to AI              | A classic survey — study it seriously to build a strong AI mental model         |
| **Coursera Machine Learning**     | ML by Andrew Ng                 | Don't skip this classic — it's the bedrock of ML intuition                      |
| **Stanford CS231n**               | Computer Vision & Deep Learning | CNN, RNN, backpropagation intuition and implementation                          |
| **Dive into Deep Learning (D2L)** | Open course by Mu Li            | Implement everything in code — theory and practice deeply integrated            |
| **Stanford CS224n**               | Natural Language Processing     | Deep understanding of modern NLP architectures — the direct predecessor to LLMs |
| **Stanford CS336**                | Language Modeling from Scratch  | Build LLMs from the ground up — the path to becoming an LLM expert              |

**Recommended resources:**

- [Andrej Karpathy — Neural Networks: Zero to Hero](https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ) — implement neural networks from scratch all the way to GPT
- [Dive into Deep Learning (d2l.ai)](https://d2l.ai/) — Mu Li's open textbook with code, English edition

---

## II. Core Architecture & Principles {#core-architecture}

### The Transformer Architecture {#transformer}

The foundational architecture of all modern LLMs, with three key components:

| Component             | Description                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| **Self-Attention**    | Allows the model to focus on the most relevant parts of the input, capturing long-range dependencies |
| **Encoder-Decoder**   | BERT uses encoder-only; GPT uses decoder-only; T5 uses the full structure                            |
| **BERT / GPT Series** | Bidirectional understanding vs. autoregressive generation — the two dominant paradigms               |

**Recommended resources:**

- [Deep Dive into LLMs — Andrej Karpathy](https://www.youtube.com/watch?v=7xTGNNLPyMI) (YouTube) / [Bilibili](https://www.bilibili.com/video/BV1atCRYsE7x/) — **#1 priority, must watch**
- Karpathy was a core researcher on GPT-2/GPT-4. This talk covers Tokenization, Attention, KV Cache, sampling strategies, and the full RLHF pipeline

---

## III. Pre-training & Fine-tuning {#pretraining-finetuning}

### Pre-training Objectives {#pretraining-objectives}

| Objective                       | Description                                        | Representative Model |
| ------------------------------- | -------------------------------------------------- | -------------------- |
| **MLM (Masked Language Model)** | Randomly mask tokens, predict the masked positions | BERT                 |
| **CLM (Causal Language Model)** | Predict the next token given the preceding context | GPT series           |

### Parameter-Efficient Fine-tuning (PEFT) {#peft}

| Method            | Description                                                                        | Best For                                         |
| ----------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------ |
| **LoRA / QLoRA**  | Low-rank adaptation — freeze original weights, train a small set of parameters     | Personal fine-tuning under resource constraints  |
| **Prompt Tuning** | Learn only soft prompts, no model weight changes                                   | Rapid task-specific adaptation                   |
| **RLHF**          | Reinforcement Learning from Human Feedback — aligns the model to human preferences | The core training method behind ChatGPT / Claude |

**Recommended practice:**

- [MiniMind](https://github.com/ninehills/blog/issues/97) — implement a tiny LLM from scratch (data → pretraining → SFT → RLHF), great for cementing fundamentals

---

## IV. Applications & Deployment {#applications}

### Prompt Engineering {#prompt-engineering}

> Official course by DeepLearning.AI × OpenAI: [ChatGPT Prompt Engineering for Developers](https://learn.deeplearning.ai)

Core modules:

| Module           | Description                                                                 |
| ---------------- | --------------------------------------------------------------------------- |
| **Guidelines**   | Two principles: be clear + give the model time to think                     |
| **Iterative**    | Prompts are iterated into existence, not written perfectly on the first try |
| **Summarizing**  | Review summarization, scenario-specific abstracts                           |
| **Inferring**    | Extract sentiment and themes from text                                      |
| **Transforming** | Translation, tone adjustment, format conversion                             |
| **Expanding**    | Generate rich content from brief inputs                                     |

### RAG (Retrieval-Augmented Generation) {#rag}

Allows the model to "read" from external knowledge bases — one of the most practical LLM deployment patterns today.

- Tech stack: Embedding → Vector DB (Chroma / Qdrant) → Retrieval → Generation
- Reference project: [Qmatter](https://github.com/zyf-ngu/Qmatter)
- Advanced topics: HyDE (Hypothetical Document Embeddings), Reranking, multi-path retrieval

### LangChain / LlamaIndex {#langchain}

The two dominant frameworks for building LLM applications — used to rapidly construct RAG pipelines, Agent chains, and tool-use systems.

### Agentic Design Patterns — The Four Paradigms {#agent-patterns}

> The four agentic design patterns are core methodologies in Agent engineering, systematized and popularized by Andrew Ng through the DeepLearning.AI newsletter (The Batch) in March 2024. Google also published the white paper [Agents](https://www.kaggle.com/whitepaper-agents) (by Julia Wiesinger et al.), which provides a deep-dive into Agent architecture and tool-use patterns.

| Pattern         | Description                                             | Example                  |
| --------------- | ------------------------------------------------------- | ------------------------ |
| **Reflection**  | Agent critiques and iteratively improves its own output | Critic Agent             |
| **Tool Use**    | Calls external tools: search, code execution, APIs      | Function Calling         |
| **Planning**    | Decomposes complex tasks into ordered sub-steps         | ReAct / Plan-and-Execute |
| **Multi-Agent** | Multiple specialized Agents collaborating               | AutoGen / CrewAI         |

**Learning resources:**

- [Agentic AI — DeepLearning.AI](https://learn.deeplearning.ai/courses/agentic-ai/lesson/pu5xbv/welcome) — systematic Agent course
- [Hello-Agents](https://learn.shareai.run/en/s01/) — quick survey to build a global Agent mental model
- [OpenCode](https://github.com/openai/openai-codex) — study a Code Agent's source code to understand task dispatch and context management
- [《Agentic Design Patterns》]()- AI Agent Design Patterns

### Quantization & Inference Acceleration {#quantization}

- INT8 / INT4 quantization: reduce GPU memory usage, speed up inference
- vLLM: high-throughput inference engine with Continuous Batching
- GGUF / llama.cpp: local CPU inference solution

---

## V. Frontiers & Ethics {#frontiers}

### Future Trends & Challenges {#future-trends}

| Direction             | Description                                                                  |
| --------------------- | ---------------------------------------------------------------------------- |
| **Multimodal Models** | Unified modeling of text, image, video, and audio (GPT-4V, Gemini, Claude 3) |
| **Autonomous Agents** | Agents that independently plan, use tools, and complete multi-step tasks     |
| **Safety & Ethics**   | Hallucination, bias, alignment, privacy, and responsible AI deployment       |

**Frontier resources:**

- [Latent Space — 2025 Papers](https://www.latent.space/p/2025-papers#§section-prompting-icl-and-chain-of-thought) — track the latest research on Prompting, ICL, and Chain-of-Thought
- **OpenAI Blog**: https://openai.com/blog
- **Anthropic Blog**: https://www.anthropic.com/news

---

## ✅ Todo List {#todo}

### 📚 Learning Tasks (in order) {#learning-tasks}

- [ ] **Andrej Karpathy — Deep Dive into LLMs** — watch in full and write notes
- [ ] **MiniMind** — implement a tiny LLM from scratch (pretraining → SFT → RLHF)
- [ ] **ChatGPT Prompt Engineering** — complete all 6 core modules
- [ ] **RAG from Scratch** — implement a full RAG pipeline (Embedding → retrieval → generation)
- [ ] **Agentic AI (DeepLearning.AI)** — complete the full Agent course series
- [ ] **Agentic Design Patterns** — write up notes on all four patterns
- [ ] **Hello-Agents** — quick survey to build a global Agent mental model

### 🛠️ Tool Practice {#tool-practice}

- [ ] **MCP protocol** — understand the spec and implement a simple MCP Server
- [ ] **Claude Code** — complete the official course; use daily in development
- [ ] **LangChain / LlamaIndex** — build a complete RAG application with each
- [ ] Subscribe to and regularly read **OpenAI / Anthropic blogs**

### 🚀 Project Milestones {#project-tasks}

- [ ] **AI Agent-LLMOps** — ship core features (Prompt management, versioning, eval pipeline)
- [ ] **Interview Agent** — write product spec → build MVP → iterate
- [ ] **Learning Agent** — build v1 based on structured-thinking framework
- [ ] **Career Planning Agent** — research → design MVP → iterate
- [ ] **Language Learning Agent** — design personalized learning path and dialogue system

---

## Resource Index {#resources}

| Resource                                 | Link                                                                 |
| ---------------------------------------- | -------------------------------------------------------------------- |
| Karpathy — Deep Dive into LLMs           | https://www.youtube.com/watch?v=7xTGNNLPyMI                          |
| Karpathy — Neural Networks: Zero to Hero | https://youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ |
| MiniMind (reference roadmap)             | https://github.com/ninehills/blog/issues/97                          |
| Qmatter (RAG practice)                   | https://github.com/zyf-ngu/Qmatter                                   |
| Prompt Engineering Course                | https://learn.deeplearning.ai                                        |
| Latent Space 2025 Papers                 | https://www.latent.space/p/2025-papers                               |
| Agentic AI Course                        | https://learn.deeplearning.ai/courses/agentic-ai                     |
| Hello-Agents                             | https://learn.shareai.run/en/s01/                                    |
| MCP Bilibili                             | https://www.bilibili.com/video/BV1uronYREWR/                         |
| Claude Code (Official)                   | https://anthropic.skilljar.com/claude-code-in-action                 |
| OpenAI Blog                              | https://openai.com/blog                                              |
| Anthropic Blog                           | https://www.anthropic.com/news                                       |
