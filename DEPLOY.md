# Deployment Guide — Vercel

This document explains how to deploy the project (frontend + backend) to Vercel and how to configure the environment variables, CORS, and GitHub Actions for automatic deployment.

Summary
- Frontend: React + Vite (`/frontend`) — deploy to Vercel (recommended).
- Backend: FastAPI (`/backend`) — can be deployed to Vercel (serverless) or a long-lived host (Render/Railway) if you need streaming.

Important note about streaming
- Vercel serverless functions do not support long-lived streaming responses reliably. The repository includes two backend endpoints:
  - `/api/ai/stream` — streaming endpoint (best used when backend is hosted on Render/Railway).
  - `/api/ai/generate` — non-streaming endpoint (suitable for Vercel serverless). The frontend falls back to this when streaming is unavailable or when `VITE_DISABLE_STREAMING=true`.

Before you begin
- Ensure your repository is pushed to GitHub and connected to Vercel.
- Create a Vercel account and obtain a Personal Token (Vercel → Settings → Tokens) if you want CLI/Action deployments.

1) Frontend deployment (Vercel)

- In Vercel: New Project → Import GitHub repo.
- When Vercel asks for project settings:
  - Root Directory: `frontend`
  - Framework Preset: `Vite` (or Other)
  - Build Command: `npm run build`
  - Output Directory: `dist`
- Environment Variables (Vercel Project → Settings → Environment Variables):
  - `VITE_API_BASE` = `https://<YOUR_BACKEND_URL>/api` (point to your deployed backend)
  - `VITE_DISABLE_STREAMING` = `true` (only if backend is serverless on Vercel; set `true` to use `/api/ai/generate`)

2) Backend deployment (Vercel serverless)

If you want to deploy the backend to Vercel serverless functions (note: no streaming):

- In Vercel: New Project → Import GitHub repo.
- Project settings:
  - Root Directory: `backend`
  - Build/Install: ensure Python is available. Use the following in Vercel's settings:
    - Install Command: `pip install -r requirements.txt`
    - Build Command: *(leave empty)*
    - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment Variables (Project → Settings → Environment Variables): add the secrets your app needs:
  - `GEMINI_API_KEY` (optional)
  - `GEMINI_MODEL` (optional)
  - `SECRET_KEY` (JWT secret)
  - `MONGODB_URI` or `SQLITE_*` if you use a hosted DB

3) Backend deployment (Render / Railway) — supports streaming

If you need streaming support, host your backend on Render or Railway and use that URL in `VITE_API_BASE` for the frontend deployed on Vercel.

Quick Render setup:

1. Create a `requirements.txt` at `/backend` (this repo includes one).
2. On Render create a new Web Service and connect to the repo. Set the Root Directory to `backend`.
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add env vars (GEMINI_API_KEY, GEMINI_MODEL, SECRET_KEY, DB URI).

4) CORS
- Make sure your backend `allow_origins` includes your deployed frontend origin(s), for example:

```python
app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173", "https://your-app.vercel.app"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)
```

5) GitHub Actions auto-deploy (already included)
- There is a workflow at `.github/workflows/deploy-vercel.yml` that calls the Vercel CLI to deploy both `frontend` and `backend` when you push to `main`.
- Required repository secret in GitHub: `VERCEL_TOKEN` (a Vercel Personal Token).

6) Local testing
- Start backend locally:

```powershell
cd backend
.\venv\Scripts\uvicorn.exe app.main:app --reload --port 8000
```

- Start frontend locally:

```bash
cd frontend
npm install
npm run dev
# open http://localhost:5173 (or the port Vite prints)
```

7) Troubleshooting
- If AI generation shows instruction text ("Summarize clearly...") in the result: the repository includes a fallback that strips prompt prefixes, but if a remote model echoes instructions, inspect the backend logs and the raw response.
- If you see `ERR_INCOMPLETE_CHUNKED_ENCODING` in the browser console: your backend likely closed the streaming connection prematurely. For Vercel serverless, use `VITE_DISABLE_STREAMING=true`.
- Check Vercel logs in the Vercel dashboard for both frontend and backend projects to diagnose build/runtime errors.

8) Optional: `vercel.json` (monorepo hints)

You can add a `vercel.json` at the repo root to specify project settings for monorepos. Example minimal file to instruct root routes:

```json
{
  "projects": [
    { "src": "frontend/package.json", "use": "@vercel/static-build", "config": { "distDir": "frontend/dist" } },
    { "src": "backend/app/main.py", "use": "@vercel/python" }
  ]
}
```

Note: Vercel's monorepo config may require fine-tuning; the easiest route is to create two Vercel projects (one for `frontend`, one for `backend`).

9) Final checklist before you hit Deploy
- Add `VERCEL_TOKEN` to GitHub secrets.
- Add the required env vars to each Vercel project.
- Ensure `VITE_API_BASE` points to the correct backend URL.
- Set `VITE_DISABLE_STREAMING=true` for the frontend if backend is serverless on Vercel.

If you'd like, I can:
- Add a `vercel.json` tuned for this repo, or
- Create a `DEPLOYMENT.md` with screenshots of the Vercel UI steps.

Good luck — ping me when you have the Vercel URLs and I can help validate CORS and env configuration.
