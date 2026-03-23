---
title: "AI学习路线"
description: "从数学基础到 Agent 工程落地，基于大模型学习路线图，系统整理 LLM 知识体系、核心资源与实战项目 Todo List。"
date: "2026-02-10"
tags: ["AI", "LLM", "Agent", "RAG", "学习路线"]
---

> **核心思路**：结构化思维学习 AI，先将大模型的根、树干建立起来，再填充枝叶。先建立整体认知框架，再深入工程落地，培养 **AI 落地**的核心能力。

---

## 大模型知识体系全景 {#llm-overview}

参考 LLM Learning Roadmap，学习路径分为五个递进层次：

```markdown
一、基础知识: 数学 + Python + 深度学习入门

二、核心架构与原理: Transformer、Attention、BERT/GPT

三、预训练与微调技术: 预训练目标、LoRA/QLoRA、RLHF

四、应用与部署: RAG、Prompt Engineering、LangChain、量化推理

五、前沿与伦理: 多模态、自主智能体、安全与伦理
```

---

## 一、基础知识 {#fundamentals}

### 数学基础 {#math}

| 课程                  | 内容       | 说明                                 |
| --------------------- | ---------- | ------------------------------------ |
| **MIT 18.06**         | 线性代数   | 理解 Embedding、Attention 的数学本质 |
| **MIT 18.01 / 18.02** | 微积分     | 梯度下降、反向传播的数学基础         |
| **MIT RES.6-012**     | 概率论导论 | 理解语言模型的采样策略与损失函数设计 |

### 入门编程 {#programming}

| 课程                         | 内容            | 说明                                      |
| ---------------------------- | --------------- | ----------------------------------------- |
| **哈佛 CS50P**               | Python 编程导论 | 你的第一门编程课，打好工程基础            |
| **MIT The Missing Semester** | 必备工具链学习  | Shell、Git、Vim、调试工具，工程师的必修课 |

> 课程链接：[MIT The Missing Semester](https://missing.csail.mit.edu/)

### 机器学习与深度学习 {#ml-dl}

| 课程                          | 内容                  | 说明                                              |
| ----------------------------- | --------------------- | ------------------------------------------------- |
| **UCB CS188**                 | 人工智能导论          | 经典回顾，建议认真学习，建立 AI 全局观            |
| **Coursera Machine Learning** | 机器学习（Andrew Ng） | 同样经典，不要跳过，扎实掌握 ML 基础              |
| **Stanford CS231n**           | 计算机视觉与深度学习  | CNN、RNN、反向传播的直觉与实现                    |
| **动手学深度学习**            | 李沐公开网课          | 用代码实现一切，理论与实践高度结合                |
| **Stanford CS224n**           | 自然语言处理          | 深入理解现代 NLP 的核心架构和技术，LLM 的直接前驱 |
| **Stanford CS336**            | 从零创建语言模型      | 从零开始构建 LLM，成为大模型专家的进阶之路        |

**推荐资源：**

- [Andrej Karpathy — Neural Networks: Zero to Hero](https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ) — 从零实现神经网络到 GPT
- [动手学深度学习](https://zh.d2l.ai/) — 李沐，中文开源教材配套视频

---

## 二、核心架构与原理 {#core-architecture}

### Transformer 架构 {#transformer}

现代 LLM 的基础架构，三个核心组件：

| 组件                                 | 说明                                             |
| ------------------------------------ | ------------------------------------------------ |
| **注意力机制（Self-Attention）**     | 让模型关注输入序列中最相关的部分，实现长距离依赖 |
| **编码器-解码器（Encoder-Decoder）** | BERT 用编码器，GPT 用解码器，T5 用完整结构       |
| **BERT / GPT 系列**                  | 双向理解 vs 自回归生成，两大主流范式             |

**推荐资源：**

- [Deep Dive into LLMs — Andrej Karpathy](https://www.youtube.com/watch?v=7xTGNNLPyMI)（YouTube）/ [Bilibili](https://www.bilibili.com/video/BV1atCRYsE7x/) — **第一优先级，必看**
- Karpathy 是 GPT-2/GPT-4 核心研究员，深入讲解了 Tokenization、Attention、KV Cache、采样策略、RLHF 完整链路

---

## 三、预训练与微调技术 {#pretraining-finetuning}

### 预训练目标 {#pretraining-objectives}

| 目标                    | 说明                         | 代表模型 |
| ----------------------- | ---------------------------- | -------- |
| **MLM（掩码语言模型）** | 随机遮蔽词语，预测被遮蔽部分 | BERT     |
| **CLM（因果语言模型）** | 根据前文预测下一个 token     | GPT 系列 |

### 高效微调（PEFT） {#peft}

| 方法              | 说明                                         | 适用场景                      |
| ----------------- | -------------------------------------------- | ----------------------------- |
| **LoRA / QLoRA**  | 低秩适配，冻结原始权重，只训练少量参数       | 资源受限的个人微调            |
| **Prompt Tuning** | 只学习软提示（soft prompt），不修改模型权重  | 快速适配特定任务              |
| **RLHF**          | 基于人类反馈的强化学习，将模型对齐到人类偏好 | ChatGPT/Claude 的核心训练方式 |

**推荐实践：**

- [MiniMind](https://github.com/ninehills/blog/issues/97) — 从零实现 LLM（数据处理 → 预训练 → SFT → RLHF），补全底层基础

---

## 四、应用与部署 {#applications}

### Prompt Engineering（提示词工程） {#prompt-engineering}

> DeepLearning.AI × OpenAI 官方课程 [ChatGPT Prompt Engineering for Developers](https://learn.deeplearning.ai)

核心模块：

| 模块             | 说明                               |
| ---------------- | ---------------------------------- |
| **Guidelines**   | 双原则：清晰指令 + 给模型时间思考  |
| **Iterative**    | 提示词是迭代出来的，不是一次写好的 |
| **Summarizing**  | 评论总结、场景化摘要               |
| **Inferring**    | 从文本推断情感、提取主题           |
| **Transforming** | 翻译、语气调整、格式转换           |
| **Expanding**    | 基于简短输入生成丰富内容           |

### RAG（检索增强生成） {#rag}

让模型"读"外部知识库，是当前最实用的 LLM 落地方案之一。

- 技术栈：Embedding → 向量数据库（Chroma / Qdrant）→ Retrieval → Generation
- 参考项目：[Qmatter](https://github.com/zyf-ngu/Qmatter)
- 进阶方向：HyDE（假设文档嵌入）、Reranking、多路召回

### LangChain / LlamaIndex {#langchain}

大模型应用开发的两大主流框架，用于快速构建 RAG pipeline、Agent 链路和工具调用系统。

### Agentic Design Patterns {#agent-patterns}

| 模式                        | 说明                               | 典型实现                 |
| --------------------------- | ---------------------------------- | ------------------------ |
| **Reflection（反思）**      | Agent 自我检查并迭代改进输出       | Critic Agent             |
| **Tool Use（工具调用）**    | 调用搜索、代码执行、API 等外部工具 | Function Calling         |
| **Planning（规划）**        | 将复杂任务拆解为有序子步骤并执行   | ReAct / Plan-and-Execute |
| **Multi-Agent（多智能体）** | 多个专职 Agent 协作完成任务        | AutoGen / CrewAI         |

**学习资源：**

- [Agentic AI — DeepLearning.AI](https://learn.deeplearning.ai/courses/agentic-ai/lesson/pu5xbv/welcome) — Agent 系列课程
- [Hello-Agents](https://learn.shareai.run/en/s01/) — 快速建立 Agent 整体认知
- [OpenCode](https://github.com/openai/openai-codex) — 阅读 Code Agent 工程实现，理解任务分发与上下文管理
- [《Agentic Design Patterns》]() - AI Agent系统的各种设计模式

### 量化与推理加速（Quantization & Inference） {#quantization}

- INT8 / INT4 量化：降低显存占用，加速推理
- vLLM：高吞吐推理引擎，支持 Continuous Batching
- GGUF / llama.cpp：本地 CPU 推理方案

---

## 五、前沿与伦理 {#frontiers}

### 未来趋势与挑战 {#future-trends}

| 方向                                | 说明                                                 |
| ----------------------------------- | ---------------------------------------------------- |
| **多模态模型（Multimodal）**        | 图文、视频、音频统一建模（GPT-4V、Gemini、Claude 3） |
| **自主智能体（Autonomous Agents）** | 能自主规划、调用工具、完成多步骤任务的 Agent         |
| **安全与伦理（Safety & Ethics）**   | 幻觉（Hallucination）、偏见、对齐、隐私等问题        |

**前沿资源：**

- [Latent Space — 2025 Papers](https://www.latent.space/p/2025-papers#§section-prompting-icl-and-chain-of-thought) — 跟进 Prompting、ICL、CoT 最新论文
- **OpenAI Blog**：https://openai.com/blog
- **Anthropic Blog**：https://www.anthropic.com/news

---

## ✅ Todo List {#todo}

### 📚 学习任务（按顺序） {#learning-tasks}

- [ ] **Andrej Karpathy — Deep Dive into LLMs** 完整观看并整理笔记
- [ ] **MiniMind** 从零实现 LLM，跑通预训练 → SFT → RLHF 完整流程
- [ ] **ChatGPT Prompt Engineering** 系统过完 6 个核心模块
- [ ] **RAG from Scratch** 手动实现完整 RAG pipeline（Embedding → 检索 → 生成）
- [ ] **Agentic AI (DeepLearning.AI)** 完成 Agent 系列课程
- [ ] **Agentic Design Patterns** 整理四大模式实践笔记
- [ ] **Hello-Agents** 快速入门，建立全局 Agent 认知

### 🛠️ 工具实践 {#tool-practice}

- [ ] **MCP 协议** 理解规范并动手实现一个 MCP Server
- [ ] **Claude Code** 完成官方课程，深度用于日常开发
- [ ] **LangChain / LlamaIndex** 用其构建一个完整 RAG 应用
- [ ] 订阅并定期阅读 **OpenAI / Anthropic 博客**

### 🚀 项目实战 {#project-tasks}

- [ ] **AI Agent-LLMOps** 完成核心功能（Prompt 管理、版本追踪、评估流水线）
- [ ] **面试 Agent** 设计需求文档 → 实现 MVP → 迭代优化
- [ ] **学习 Agent** 基于结构化思维框架搭建第一版
- [ ] **职业规划 Agent** 需求调研 → 选型 MVP → 迭代优化
- [ ] **语言学习 Agent** 设计个性化学习路径与对话机制

---

## 资源索引 {#resources}

| 资源                                     | 链接                                                                 |
| ---------------------------------------- | -------------------------------------------------------------------- |
| Karpathy — Deep Dive into LLMs           | https://www.youtube.com/watch?v=7xTGNNLPyMI                          |
| Karpathy — Neural Networks: Zero to Hero | https://youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ |
| MiniMind（参考路线）                     | https://github.com/ninehills/blog/issues/97                          |
| Qmatter（RAG 实践）                      | https://github.com/zyf-ngu/Qmatter                                   |
| Prompt Engineering 课程                  | https://learn.deeplearning.ai                                        |
| Latent Space 2025 论文                   | https://www.latent.space/p/2025-papers                               |
| Agentic AI 课程                          | https://learn.deeplearning.ai/courses/agentic-ai                     |
| Hello-Agents                             | https://learn.shareai.run/en/s01/                                    |
| MCP Bilibili                             | https://www.bilibili.com/video/BV1uronYREWR/                         |
| Claude Code 官方                         | https://anthropic.skilljar.com/claude-code-in-action                 |
| OpenAI Blog                              | https://openai.com/blog                                              |
| Anthropic Blog                           | https://www.anthropic.com/news                                       |
