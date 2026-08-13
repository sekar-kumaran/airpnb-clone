# 📚 Knowledge Base — Airbnb Clone

This folder contains concise, developer-focused reference docs for every service, page, and component in the project. Each file is designed to be loaded independently as context to reduce token overhead during development.

## Index

| File | Contents |
|---|---|
| [project-overview.md](./project-overview.md) | Architecture, tech stack, data flow, design tokens |
| [backend-models.md](./backend-models.md) | SQLAlchemy models, relationships, schema notes |
| [backend-services.md](./backend-services.md) | All FastAPI routers — endpoints, params, validation rules |
| [frontend-pages.md](./frontend-pages.md) | Every Next.js page/route — props, data fetching, state |
| [frontend-components.md](./frontend-components.md) | Every component — purpose, props, internal state, connected pages |
| [api-client.md](./api-client.md) | `lib/api-client.ts` function reference |
| [airbnb-design-spec.md](./airbnb-design-spec.md) | Airbnb.co.in UI patterns, design tokens, UX flows — enhancement roadmap |
| [enhancement-roadmap.md](./enhancement-roadmap.md) | Gap analysis vs real Airbnb + prioritized improvements |

## Quick Reference

- **Frontend**: `d:/airbnb-clone/frontend/` — Next.js App Router + TypeScript + Tailwind CSS
- **Backend**: `d:/airbnb-clone/backend/` — Python FastAPI + SQLite via SQLAlchemy
- **Auth**: Mocked — email only, `X-User-Id` header, user id in `localStorage`
- **API Base**: `http://localhost:8000` (dev), env var `NEXT_PUBLIC_API_URL`
- **Airbnb Brand Color**: `#FF385C` (rausch) — used as `primary` in Tailwind config
