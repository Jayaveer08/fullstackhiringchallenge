# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deployment (Vercel)

To deploy the frontend to Vercel and point it at your backend API, follow these steps:

1. In the Vercel dashboard for your project, add an environment variable named `VITE_API_BASE` with the base URL of your API (for example `https://api.example.com/api`).

2. Build & Deploy — Vercel will run `npm run build` by default. The production build will inline `import.meta.env.VITE_API_BASE` from your environment.

3. CORS — ensure your backend allows the Vercel origin in its CORS allowlist (e.g., `https://your-app.vercel.app`). Update `backend/app/main.py` `allow_origins` accordingly.

Local development notes

- For local testing keep `VITE_API_BASE` unset; the app falls back to `http://localhost:8000/api`.
- To run locally:

```bash
cd frontend
npm install
npm run dev
```

Advanced: If you prefer the frontend to call relative paths (e.g., `/api`) and proxy during dev, configure Vite server proxy in `vite.config.js` to forward `/api` to `http://localhost:8000`.

### Deploying the backend to Vercel (serverless, non-streaming)

If you want both frontend and backend on Vercel, note that Vercel serverless functions do not support long-lived streaming responses. Use the non-streaming endpoint `/api/ai/generate` (already added) and set the following env var for the frontend project:

- `VITE_DISABLE_STREAMING=true`

Steps:

1. In Vercel, create a new Project -> Import GitHub repo.
2. Set the **Root Directory** for the backend project to `backend`.
3. In Project Settings -> Environment Variables add your secrets:
	- `GEMINI_API_KEY` (optional)
	- `GEMINI_MODEL` (optional)
	- `SECRET_KEY`
4. Also add `VITE_DISABLE_STREAMING=true` to your frontend project environment variables.
5. For the backend project, set these Build & Start commands in Vercel's UI:
	- Install Command: `pip install -r requirements.txt`
	- Build Command: *(leave empty)*
	- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

6. Ensure `backend/requirements.txt` exists (committed). The repository includes a basic `requirements.txt` you can extend.

Notes:
- The non-streaming `/api/ai/generate` endpoint will be used for AI features when `VITE_DISABLE_STREAMING` is true.
- If you want streaming support later, consider hosting the backend on Render/Railway which supports long-lived connections.
