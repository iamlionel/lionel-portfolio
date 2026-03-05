# Lionel's Portfolio

A personal portfolio and blog built with **Next.js 14**, featuring a Markdown-based blog system, interactive UI components, and a clean dark-themed design.

## Features

- 🏠 **Portfolio Pages** — Home, Services, Resume, Work, and Contact pages
- 📝 **Markdown Blog** — File-based blog with full Markdown rendering, syntax highlighting, and auto-generated navigation
- 📖 **Document Navigation** — Right-side TOC with scroll-aware active highlighting
- 🎨 **Dark Theme** — Custom Tailwind CSS design system with accent color and smooth animations
- ⚡ **Static Generation** — All blog pages pre-rendered at build time with `generateStaticParams`

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Framer Motion
- **Markdown**: react-markdown, remark-gfm, rehype-raw, gray-matter
- **UI**: Radix UI primitives, Lucide React icons
- **Deployment**: Vercel

## Project Structure

```
├── app/                    # Next.js App Router pages
│   └── blog/[[...slug]]/   # Dynamic blog routes
├── blog/                   # Markdown content files
│   ├── index.md
│   ├── frontend/
│   ├── AI/
│   └── mobile/
├── components/             # Reusable UI components
│   ├── DocumentNav.jsx     # Right-side TOC navigation
│   ├── DocsNav.jsx         # Left-side section navigation
│   └── MDComponents.jsx    # Custom Markdown renderers
└── utils/                  # Helper utilities
    ├── parseHeadingId.js   # Parses {#id} syntax from headings
    └── getKebabCaseFromName.js
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Blog Content

Blog posts are written in Markdown and stored in the `blog/` directory. Each section has an `index.md` intro page. Navigation is configured via `blog/documentation-links.yaml`.

Headings support custom anchor IDs using the `{#id}` syntax:

```md
## My Section {#my-section}
```

## Deploy

Deployed on [Vercel](https://vercel.com). Push to `main` to trigger a new deployment.
