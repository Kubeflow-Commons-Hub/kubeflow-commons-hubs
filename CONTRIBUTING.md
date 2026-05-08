# Contributing to Kubeflow Common Hubs

Thank you for your interest in contributing! This guide will help you get started.

## Prerequisites

- Node.js 22+
- npm 10+
- Docker (for local Supabase)
- Git

## Local Development Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-org/kubeflow-common-hubs.git
   cd kubeflow-common-hubs
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required values. See `.env.example` for documentation on each variable.

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/          # Next.js App Router pages
    (public)/   # Public pages (no auth)
    (auth)/     # Auth pages
    (dashboard)/ # Authenticated user area
    (admin)/    # Admin-only area
  components/   # React components
    ui/         # Base UI components (shadcn/ui)
    layout/     # Header, Footer, Sidebar
    landing/    # Landing page sections
    common/     # Shared components
  lib/          # Utilities and helpers
  db/           # Drizzle ORM schema
  types/        # TypeScript types
```

## Development Guidelines

- **TypeScript** is required for all files. No `any` types.
- **Tailwind CSS** for all styling. No CSS modules or styled-components.
- Use existing design tokens from `globals.css` (e.g., `bg-bg-primary`, `text-text-secondary`).
- All components must be accessible (keyboard nav, ARIA labels, focus management).
- Server Components by default. Add `"use client"` only when needed.
- Run `npm run lint` before committing.

## Pull Request Process

1. Create a feature branch from `main`.
2. Make your changes with clear, atomic commits.
3. Ensure `npm run build` passes.
4. Open a PR with a clear description of what and why.
5. PRs require at least one review before merge.

## Code of Conduct

This project follows the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/main/code-of-conduct.md). Please be respectful and inclusive.
