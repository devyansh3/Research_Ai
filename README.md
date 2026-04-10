# Raar Monorepo

Monorepo for the Raar report analysis generator for manufacturing workflows.

- `backend/`: FastAPI service, auth, report generation/comparison APIs, OpenAPI export
- `ui/`: React + Vite + TypeScript frontend, typed API client generation via Orval

## Repository Layout

```text
research-ai/
├── backend/
│   ├── api.py
│   ├── requirements.txt
│   ├── Makefile
│   ├── scripts/export_openapi.py
│   └── openapi/openapi.json
├── ui/
│   ├── src/
│   ├── package.json
│   ├── Makefile
│   ├── orval.config.ts
│   └── openapi/openapi.json
└── Makefile
```

## Prerequisites

- Python 3.11+ (project currently runs on local `.venv`)
- Node.js 18+ and npm
- `make`

## Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at `http://localhost:8000`.

### Backend Env

Create `backend/.env` with values as needed:

```env
OPENAI_API_KEY=...
JWT_SECRET_KEY=change-me
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=120
AUTH_COOKIE_NAME=rar_access_token
AUTH_COOKIE_SECURE=false
AUTH_COOKIE_SAMESITE=lax
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
CORS_ALLOWED_ORIGIN_REGEX=
```

## UI Setup

```bash
cd ui
npm install
npm run dev
```

UI runs at `http://localhost:5173`.

### UI Env

`ui/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Makefile Commands

### Monorepo Root (`/Makefile`)

- `make backend-openapi`: run backend OpenAPI export
- `make ui-api-refresh`: sync schema to UI and regenerate typed client
- `make dev-backend`: start backend (expects `backend/.venv` ready)
- `make dev-ui`: start frontend

### Backend (`backend/Makefile`)

- `make openapi`: generates `backend/openapi/openapi.json` directly from app code

### UI (`ui/Makefile`)

- `make api-refresh`: clean generated client, sync `../backend/openapi/openapi.json`, regenerate Orval axios client/types

## OpenAPI + Typed Client Workflow

Source of truth is backend OpenAPI.

1. Update backend API contract/models.
2. Regenerate backend schema:
   `cd backend && make openapi`
3. Refresh frontend typed client:
   `cd ui && npm run api:refresh`

Generated UI files are under:

- `ui/src/lib/api/generated/client.ts`
- `ui/src/lib/api/generated/model/*`

## API Overview

Core API routes (auth required for report/config endpoints):

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/base-config`
- `GET /api/v1/stages?sector=...`
- `GET /api/v1/tools?sector=...&stage=...`
- `POST /api/v1/optimize-weights`
- `POST /api/v1/generate-report`
- `POST /api/v1/compare-tools`

## Auth Model

- Email/password signup/login
- Backend issues JWT in HttpOnly cookie
- UI sends credentials with axios (`withCredentials: true`)
- `/api/v1/auth/me` is used to bootstrap logged-in session state

## Reporting Agent Flow (High Level)

1. User picks sector, stage, tool, persona, and weights in UI.
2. UI calls backend:
   - `generate-report` for main report markdown
   - `compare-tools` for comparison markdown
3. Backend orchestrates report generation logic and returns:
   - `status`
   - `report_markdown`
   - `token_usage`
4. UI renders markdown report and supports regenerate/compare actions.

## Build & Verification

```bash
cd ui && npm run build
```

Optional API check examples:

```bash
curl -i http://localhost:8000/api/v1/auth/me
curl -i http://localhost:8000/api/v1/base-config
```

If unauthenticated, protected endpoints return `401` as expected.

## Vercel Deployment (Monorepo, Step 1)

Deploy as two separate Vercel projects from the same repo.

### 1) UI Project

- Project root directory: `ui`
- Build command: `npm run build`
- Output directory: `dist`
- Config file: `ui/vercel.json` (SPA rewrites for React routes)

UI env vars:

```env
VITE_API_BASE_URL=https://<your-backend-project>.vercel.app
```

### 2) Backend Project

- Project root directory: `backend`
- Entry file: `api.py`
- Config file: `backend/vercel.json` (routes all requests to FastAPI app)

Backend env vars:

```env
OPENAI_API_KEY=...
JWT_SECRET_KEY=change-me
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
AUTH_COOKIE_NAME=rar_access_token
AUTH_COOKIE_SECURE=true
AUTH_COOKIE_SAMESITE=none
CORS_ALLOWED_ORIGINS=https://<your-ui-project>.vercel.app
# Optional for preview deployments:
CORS_ALLOWED_ORIGIN_REGEX=https://.*\.vercel\.app
```

Notes:
- On Vercel, if `DATABASE_URL` is not set, backend uses `/tmp/auth.db` (ephemeral).
- You can set `DATABASE_URL` later to move auth persistence off SQLite.
