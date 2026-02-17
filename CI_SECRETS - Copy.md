# GitHub Secrets & Vercel Project IDs — Quick Guide

This file lists the repository secrets and Vercel project identifiers you should add to automate deployments and configure runtime env variables.

Required GitHub repository secrets
- `VERCEL_TOKEN` — A Vercel Personal Token (used by the GitHub Action to call the Vercel CLI).
- `VERCEL_PROJECT_FRONTEND` — (optional) Vercel Project ID or name for the frontend. Used if the CI workflow deploys by project.
- `VERCEL_PROJECT_BACKEND` — (optional) Vercel Project ID or name for the backend.

How to create a Vercel token
1. Sign in to Vercel → Settings → Tokens.
2. Create a new token and copy it.
3. In GitHub: Repository → Settings → Secrets and variables → Actions → New repository secret. Add `VERCEL_TOKEN`.

Vercel project environment variables (set these in each Vercel project's Environment Variables UI)
- Frontend project:
  - `VITE_API_BASE` = `https://<YOUR_BACKEND_URL>/api`
  - `VITE_DISABLE_STREAMING` = `true` (set `true` if backend is deployed serverless on Vercel)
- Backend project:
  - `GEMINI_API_KEY` (or other AI provider key)
  - `GEMINI_MODEL` (optional)
  - `SECRET_KEY` (JWT secret)
  - `MONGODB_URI` or other DB connection string (if used)

Notes
- If you prefer not to store Vercel project IDs in GitHub, the workflow can be configured to deploy by specifying `--local-config` or by using the default token behavior; adjust `.github/workflows/deploy-vercel.yml` accordingly.
- For streaming support, host the backend on Render or Railway and point `VITE_API_BASE` to that URL; set `VITE_DISABLE_STREAMING=false`.
