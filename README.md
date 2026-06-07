# ChitGit

ChitGit is a full-stack repository chat assistant: upload a GitHub repo, index its code, and ask questions against it in a conversational UI.

## Highlights

- GitHub authentication with Clerk.
- Repository ingestion and background upload jobs (workers + RQ).
- Semantic search over repository chunks using Qdrant and sentence-transformers.
- Chat responses grounded in the uploaded repository content.
- Separate React/Vite client and FastAPI Python server.

## Tech Stack

- Client: React, TypeScript, Vite, (Tailwind CSS present in parts), Clerk, Axios.
- Server: FastAPI, Pydantic/SQLModel, Qdrant, Sentence Transformers, Uvicorn, RQ workers.
  -- Local services: Redis, optional Qdrant.

## Repository Layout

```
Frontend/        React + Vite client application
Server/          FastAPI backend, controllers, workers
render.yaml          Render deployment manifest
Procfile             Procfile for workers/processes
```

Notable server folders/files:

- `Server/controllers/` – request handlers and controller logic
- `Server/Model.py`, `Server/pydanticModels.py` – data models
- `Server/qdrant.py` – Qdrant integration
- `Server/upload_worker.py` – background upload worker

## Notable frontend files

- `Frontend/src/` – React source
- `Frontend/src/api/` – API client wrappers
- `Frontend/src/Components/RepoUploadUI.tsx` – repo upload UI

## Prerequisites

- Node.js 20 or newer
- pnpm (or npm/yarn if you prefer)
- Python 3.11 or newer

## Environment setup

Create environment files as needed.

Server example:

```bash
cp Server/.env.example Server/.env
# edit Server/.env with your values
```

Frontend: if `Frontend/.env` is required, copy from any example present in that folder.

## Run locally

1. Ensure required local services are running (for example, Redis):

macOS example (Homebrew):

```bash
brew install redis
brew services start redis
```

Or start Redis using your preferred method or system service manager.

2. Run the server:

```bash
cd Server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

3. Run the frontend:

```bash
cd Frontend
pnpm install
pnpm dev
```

The frontend expects the API at `http://localhost:8000` by default; update the client config if needed.

## Validation

- Frontend: `pnpm lint` and `pnpm build` inside `Frontend/` (if configured in `package.json`).
- Server: basic checks like `python -m compileall Server` and running unit tests if present.

## Changes from previous README

- `Client/` was renamed/replaced by `Frontend/` in this repo layout.
- Fixed server dependency file to `requirements.txt` (was previously referenced incorrectly).
- Added pointers to controllers and worker files under `Server/`.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
