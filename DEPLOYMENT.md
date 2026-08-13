# Deployment Guide

This project is set up for:

- Frontend: Vercel
- Backend: Render
- Database: Supabase Postgres
- CI: GitHub Actions
- Optional CI/CD runner: Jenkins
- Optional container orchestration: Kubernetes

## Supabase

Create a Supabase project and copy the Postgres connection string from Project Settings -> Database.

Use it as:

```text
DATABASE_URL=postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres
```

The backend accepts `postgres://`, `postgresql://`, and `postgresql+psycopg://` URLs.

## Render Backend

The root `render.yaml` creates a Docker web service from `backend/`.

Set these Render environment variables:

```text
DATABASE_URL=<your-supabase-postgres-url>
CORS_ORIGINS=https://<your-vercel-domain>
SEED_ON_START=true
```

After the first successful seed, set `SEED_ON_START=false`.

Health check:

```text
/api/health
```

## Vercel Frontend

Import the GitHub repo in Vercel and set:

```text
Root Directory: frontend
Framework: Next.js
Build Command: npm run build
Install Command: npm ci
```

Environment variable:

```text
NEXT_PUBLIC_API_URL=https://<your-render-backend-url>
```

The frontend also includes `frontend/vercel.json`.

## GitHub Actions

`.github/workflows/ci.yml` runs backend lint/tests, frontend lint/typecheck/build, and Docker image publishing to GitHub Container Registry on `main`.

Images:

```text
ghcr.io/sekar-kumaran/airpnb-clone/backend:latest
ghcr.io/sekar-kumaran/airpnb-clone/frontend:latest
```

For production frontend Docker images, set the GitHub Actions repository variable:

```text
NEXT_PUBLIC_API_URL=https://<your-backend-domain>
```

## Jenkins

`Jenkinsfile` runs the same validation flow and Docker builds.

Jenkins agent requirements:

- Python 3.11
- Node 20
- Docker
- Git

## Kubernetes

Manifests are in `k8s/`.

Create a real secret from the example:

```bash
cp k8s/backend-secret.example.yaml k8s/backend-secret.yaml
```

Edit `DATABASE_URL`, `CORS_ORIGINS`, and `SEED_ON_START`, then apply:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/backend-secret.yaml
kubectl apply -k k8s
```

Optional ingress:

```bash
cp k8s/ingress.example.yaml k8s/ingress.yaml
kubectl apply -f k8s/ingress.yaml
```

Do not commit `k8s/backend-secret.yaml`.
