# Development Guide

## Prerequisites
- Node.js 20 (see `.nvmrc`)
- Copy `.env.example` → `.env.local` and fill values

## Install & Run
```
nvm use
npm ci
npm run dev
```

## Useful Scripts
- `npm run typecheck` — TypeScript only
- `npm run lint` — ESLint
- `npm run format` — Prettier write
- `npm run check` — typecheck + lint + test
- `npm test` — Jest

## Repository Structure
```
src/
  app/              # Next.js App Router
  components/       # UI components
  hooks/            # React hooks
  lib/              # Integrations & server libs
    embeddings/     # Voyage embeddings client
    search/         # Supabase vector search client
  types/            # Shared TypeScript types
```

## Environment Validation
All environment variables are validated at import via `src/env.ts` (zod). Missing variables throw early and clearly.

## CI
GitHub Actions runs typecheck, lint, tests, and build for PRs to `main`.

