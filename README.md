<p align="center">
  <a href="./Meridian%20_%20Analytics%20Dashboard.jpeg">
    <img
      src="./Meridian%20_%20Analytics%20Dashboard.jpeg"
      alt="Meridian — analytics dashboard with KPI cards, lead sources chart, revenue flow, and active deals table"
      width="min(920px, 100%)"
    />
  </a>
</p>

# Meridian — Analytics Dashboard

A production-style **CRM / revenue analytics dashboard** built as a demo-quality front end. It shows how KPIs, charts, tabular data, and export flows can come together in a single Next.js app with a cohesive dark UI.

If you are a **contractor or reviewer** evaluating the stack or onboarding onto the codebase, this document is meant to answer: what it is, what it uses, how to run it, and where the important pieces live.

---

## At a glance

| Area            | What you get                                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **UI**          | Responsive dashboard shell: sidebar, header (search, range, export), welcome strip, metric cards, charts, searchable deals table           |
| **Data**        | Typed JSON APIs under `app/api/*` backed by **mock generators** (deterministic jitter) so the UI behaves like real data without a database |
| **Theming**     | Light / dark via **next-themes**, Tailwind v4 tokens, `suppressHydrationWarning` on `<html>` where required                                |
| **Quality bar** | TypeScript throughout, ESLint (Next.js config), App Router conventions                                                                     |

---

## Tech stack

### Core

- **[Next.js 16](https://nextjs.org/)** — App Router, React Server Components where appropriate, Route Handlers for APIs, Turbopack in dev (`next dev`)
- **[React 19](https://react.dev/)** — Client components for interactive charts, table, theme, and shell controls
- **[TypeScript 5](https://www.typescriptlang.org/)** — Shared types for API responses and UI props (`lib/types`)

### UI & styling

- **[Tailwind CSS v4](https://tailwindcss.com/)** with `@tailwindcss/postcss`
- **[shadcn/ui](https://ui.shadcn.com/)** (CLI `shadcn` in repo) — composable primitives (sidebar, buttons, dropdowns, tooltips, etc.)
- **[Base UI](https://base-ui.com/)** — `@base-ui/react` where components align with the design system
- **[Lucide React](https://lucide.dev/)** — Icons
- **[class-variance-authority](https://cva.style/)** + **[clsx](https://github.com/lukeed/clsx)** + **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** — Variant styling and class composition
- **[tw-animate-css](https://github.com/Wombosvideo/tw-animate-css)** — Animation utilities

### Data fetching & UX

- **[TanStack Query (React Query) v5](https://tanstack.com/query)** — Server state, caching, and request orchestration from client components
- **[date-fns](https://date-fns.org/)** — Date range handling and formatting
- **[Sonner](https://sonner.emilkowal.ski/)** — Toasts (e.g. export feedback)
- **[cmdk](https://cmdk.paco.me/)** — Command palette / search UX patterns where used

### Visualization

- **[Recharts 3](https://recharts.org/)** — Lead sources (donut) and revenue flow (composed bar chart) with responsive containers

### Tooling

- **[pnpm](https://pnpm.io/)** — Package manager (lockfile + `pnpm-workspace.yaml`; includes a **patched** `next-themes` for React 19 inline-script compatibility — see `patches/`)
- **[ESLint 9](https://eslint.org/)** + **eslint-config-next**

---

## Features (product surface)

- **Dashboard home** — Redirect from `/` to `/dashboard`
- **Metric cards** — Headline KPIs with period comparison copy
- **Lead sources** — Breakdown by channel (mock distribution)
- **Revenue flow** — Multi-series or comparative revenue view over time
- **Active deals** — Table with search, stage badges, owners, and expected close
- **Export** — CSV / JSON download via API (`Content-Disposition` filenames aligned with branding)
- **Theme toggle** — Resolves system preference when configured; default dark-friendly palette

---

## Project layout (orientation)

```text
app/
  (dashboard)/          # Dashboard segment layout + pages
  api/                  # Route handlers: deals, export, lead-sources, metrics, revenue
  layout.tsx            # Root layout, fonts, theme bootstrap script
  providers.tsx         # React Query, ThemeProvider, tooltip + toaster shell
components/
  dashboard/            # Feature UI: charts, table, metrics, export control
  ui/                     # shadcn-style building blocks
lib/
  mock-data.ts          # Generators + date-range parsing
  hooks/                  # e.g. useDeals and related data hooks
  types.ts                # API / domain types
patches/                  # pnpm patch for next-themes (see pnpm-workspace.yaml)
```

---

## Getting started

**Requirements:** Node.js compatible with Next 16 (see Next.js docs), **pnpm** recommended.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) (you will be redirected to `/dashboard`).

Other scripts:

```bash
pnpm build    # Production build
pnpm start    # Serve production build
pnpm lint     # ESLint
```

---

## API overview (for integration or replacement)

All handlers live under `app/api/<name>/route.ts` and accept query parameters such as date range presets where applicable. Responses are JSON (except export routes returning CSV or JSON files). **Replacing mock builders** in `lib/mock-data.ts` with real database or CRM calls is the natural extension path while keeping the same route shapes and types.

---

## Deployment

The app is a standard Next.js deployment. **[Vercel](https://vercel.com/)** is the zero-config path; any Node host that supports Next.js 16 works if you run `pnpm build` and `pnpm start` (or the platform’s equivalent).

---

## License / usage

This repository is a **portfolio / demo** project. If you extend it for a client engagement, confirm licensing and data handling with your own legal and security review.
