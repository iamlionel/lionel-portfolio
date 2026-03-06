---
title: "Understanding the Transformer Architecture"
description: "A deep dive into the Transformer model — the architecture powering modern LLMs like GPT and BERT"
date: "2026-03-06"
tags: ["AI", "Transformer", "Deep Learning", "NLP"]
---

The Transformer architecture, introduced in the landmark paper _"Attention Is All You Need"_ (2017), revolutionized natural language processing and became the backbone of modern large language models. Let's break down how it works.

## Why Transformers? {#why-transformers}

Before Transformers, sequence models like RNNs and LSTMs dominated NLP. They had critical limitations:

- **Sequential processing**: Tokens must be processed one at a time, making parallelization impossible
- **Long-range dependencies**: Information from early tokens fades over long sequences (vanishing gradient)
- **Slow training**: No way to leverage modern GPU parallelism effectively

Transformers solve all three problems by replacing recurrence with **self-attention** — allowing every token to directly attend to every other token in the sequence.

## High-Level Architecture {#architecture}

A Transformer consists of two main components:

- **Encoder**: Processes the input sequence and produces contextual representations
- **Decoder**: Generates output tokens auto-regressively, attending to both previous outputs and encoder representations

Models like **BERT** use only the encoder, while **GPT** uses only the decoder. The original Transformer uses both.

## Self-Attention Mechanism {#self-attention}

Self-attention is the core innovation. For each token, it computes how much "attention" to pay to every other token in the sequence.

### Step-by-Step

1. **Create Q, K, V vectors**: Each token embedding is projected into three vectors — Query (Q), Key (K), and Value (V) — using learned weight matrices.

2. **Compute attention scores**: The dot product of Q and K measures similarity between tokens:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

3. **Scale**: Division by √d_k prevents dot products from growing too large

4. **Softmax**: Normalize scores to get attention weights (probabilities)

5. **Weighted sum**: Multiply weights by V to get the output representation

### Multi-Head Attention

Instead of a single attention function, Transformers use **multi-head attention** — running multiple attention operations in parallel with different learned projections:

```
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) × W_O
where head_i = Attention(Q × W_Q_i, K × W_K_i, V × W_V_i)
```

This allows the model to jointly attend to information from different representation subspaces.

## Positional Encoding {#positional-encoding}

Since self-attention has no notion of token order, Transformers add **positional encodings** to the input embeddings to inject sequence position information:

- **Sinusoidal (original)**: Fixed mathematical functions of position
- **Learned**: Trainable position embeddings (used in GPT, BERT)
- **RoPE**: Rotary Position Embeddings (used in LLaMA, modern LLMs)

## Feed-Forward Network {#ffn}

Each Transformer layer includes a **position-wise feed-forward network** (FFN):

```
FFN(x) = max(0, xW_1 + b_1)W_2 + b_2
```

This is a simple two-layer MLP with a ReLU (or GELU) activation, applied independently to each position. It's where much of the model's "knowledge" is stored.

## Layer Normalization and Residual Connections {#layer-norm}

Each sub-layer (attention + FFN) is wrapped with:

1. **Residual connection**: `output = sublayer(x) + x` — prevents degradation in deep networks
2. **Layer normalization**: Normalizes activations for stable training

Modern models use **Pre-LN** (normalize before the sub-layer) instead of the original Post-LN, which improves training stability.

## From Transformer to Modern LLMs {#modern-llms}

| Model | Year | Type            | Key Innovation                          |
| ----- | ---- | --------------- | --------------------------------------- |
| BERT  | 2018 | Encoder         | Masked language modeling, bidirectional |
| GPT-2 | 2019 | Decoder         | Autoregressive, large-scale pretraining |
| T5    | 2019 | Encoder-Decoder | Text-to-text framework                  |
| GPT-3 | 2020 | Decoder         | 175B parameters, few-shot learning      |
| GPT-4 | 2023 | Decoder (MoE?)  | Multimodal, RLHF alignment              |
| LLaMA | 2023 | Decoder         | Open-source, efficient architecture     |

## Key Takeaways {#key-takeaways}

- Transformers replaced RNNs with **self-attention**, enabling parallel processing and capturing long-range dependencies
- **Multi-head attention** allows the model to focus on different aspects of the input simultaneously
- **Positional encodings** provide sequence order information absent from attention
- The architecture scales remarkably well — the key insight behind the "scaling laws" driving modern AI
- Understanding Transformers is essential for working with any modern LLM or NLP system

The Transformer is one of the most impactful architectures in the history of deep learning, and its influence continues to expand beyond NLP into vision, audio, and multimodal AI.
