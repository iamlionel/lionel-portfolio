---
title: "深入理解 Transformer 架构"
description: "深入 Transformer 模型 —— 驱动 GPT、BERT 等现代大语言模型的核心架构"
date: "2026-03-06"
tags: ["AI", "Transformer", "深度学习", "NLP"]
---

Transformer 架构出自 2017 年的里程碑论文 _"Attention Is All You Need"_，彻底改变了自然语言处理领域，并成为现代大语言模型的基石。让我们来详细分析它的工作原理。

## 为什么需要 Transformer？ {#why-transformers}

在 Transformer 之前，RNN 和 LSTM 等序列模型主导了 NLP 领域。它们有几个关键限制：

- **顺序处理**：Token 必须逐个处理，无法并行化
- **长距离依赖**：序列开头的信息会随距离衰减（梯度消失）
- **训练缓慢**：无法有效利用现代 GPU 的并行能力

Transformer 用**自注意力机制**替代了循环结构，允许每个 Token 直接关注序列中的所有其他 Token，从而解决了以上三个问题。

## 整体架构 {#architecture}

Transformer 由两个主要组件组成：

- **编码器 (Encoder)**：处理输入序列，生成上下文表示
- **解码器 (Decoder)**：自回归地生成输出 Token，同时关注先前的输出和编码器的表示

**BERT** 仅使用编码器，**GPT** 仅使用解码器，原始 Transformer 两者都使用。

## 自注意力机制 {#self-attention}

自注意力是核心创新。对于每个 Token，它计算应该对序列中其他所有 Token 给予多少"注意力"。

### 逐步分解

1. **创建 Q、K、V 向量**：每个 Token 的嵌入通过学习到的权重矩阵投影为三个向量 —— 查询 (Query)、键 (Key) 和值 (Value)。

2. **计算注意力分数**：Q 和 K 的点积衡量 Token 之间的相似度：

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

3. **缩放**：除以 √d_k 防止点积值过大

4. **Softmax**：归一化分数以获取注意力权重（概率）

5. **加权求和**：将权重乘以 V 得到输出表示

### 多头注意力

Transformer 不使用单个注意力函数，而是使用**多头注意力** —— 用不同的学习投影并行运行多个注意力操作：

```
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) × W_O
其中 head_i = Attention(Q × W_Q_i, K × W_K_i, V × W_V_i)
```

这使模型能够同时关注来自不同表示子空间的信息。

## 位置编码 {#positional-encoding}

由于自注意力没有 Token 顺序的概念，Transformer 在输入嵌入中添加**位置编码**来注入序列位置信息：

- **正弦编码（原始）**：基于位置的固定数学函数
- **可学习编码**：可训练的位置嵌入（GPT、BERT 使用）
- **RoPE**：旋转位置嵌入（LLaMA 等现代 LLM 使用）

## 前馈神经网络 {#ffn}

每个 Transformer 层包含一个**逐位置前馈网络** (FFN)：

```
FFN(x) = max(0, xW_1 + b_1)W_2 + b_2
```

这是一个简单的两层 MLP，使用 ReLU（或 GELU）激活函数，独立应用于每个位置。模型的大部分"知识"存储于此。

## 层归一化与残差连接 {#layer-norm}

每个子层（注意力 + FFN）都包含：

1. **残差连接**：`output = sublayer(x) + x` —— 防止深层网络退化
2. **层归一化 (Layer Norm)**：归一化激活值以稳定训练

现代模型使用 **Pre-LN**（在子层之前归一化）代替原始的 Post-LN，以提高训练稳定性。

## 从 Transformer 到现代 LLM {#modern-llms}

| 模型  | 年份 | 类型          | 关键创新                |
| ----- | ---- | ------------- | ----------------------- |
| BERT  | 2018 | 编码器        | 掩码语言建模，双向      |
| GPT-2 | 2019 | 解码器        | 自回归，大规模预训练    |
| T5    | 2019 | 编码器-解码器 | 文本到文本框架          |
| GPT-3 | 2020 | 解码器        | 1750 亿参数，少样本学习 |
| GPT-4 | 2023 | 解码器 (MoE?) | 多模态，RLHF 对齐       |
| LLaMA | 2023 | 解码器        | 开源，高效架构          |

## 核心要点 {#key-takeaways}

- Transformer 用**自注意力**取代了 RNN，实现并行处理和捕获长距离依赖
- **多头注意力**使模型能同时关注输入的不同方面
- **位置编码**为注意力机制提供缺失的序列顺序信息
- 该架构具有卓越的可扩展性 —— 这是驱动现代 AI 的"缩放定律"背后的关键洞见
- 理解 Transformer 对使用任何现代 LLM 或 NLP 系统至关重要

Transformer 是深度学习历史上最具影响力的架构之一，其影响力已从 NLP 扩展到视觉、音频和多模态 AI 领域。
