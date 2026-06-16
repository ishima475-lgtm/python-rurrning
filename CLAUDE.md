# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Monorepo with a Python (FastAPI) backend and a React (Vite + TypeScript) frontend, intended to run inside a DevContainer (`.devcontainer/devcontainer.json`, Python 3.12 + Node 20). On container creation, `postCreateCommand` runs `pip install -e "./backend[dev]"` and `npm --prefix frontend install`, so both stacks are ready immediately.

## Commands

Backend (run from repo root unless noted):
- Run API: `python-rurrning` (console script → uvicorn on `:8000`). Equivalent: `python -m python_rurrning.main`.
- Tests: `pytest --rootdir backend backend`
- Single test: `pytest backend/tests/test_main.py::test_hello_default`
- Lint/format: `ruff check backend` / `ruff format backend`

Frontend (`frontend/`):
- Dev server: `npm --prefix frontend run dev` (Vite on `:5173`)
- Build + typecheck: `npm --prefix frontend run build`

If running the backend outside the editable install, prefix module commands with `PYTHONPATH=backend/src`.

## Architecture

- **Two independent processes.** Backend (uvicorn `:8000`) and frontend (Vite `:5173`) run separately. They are not served from one process; the frontend reaches the backend over HTTP.
- **Dev request flow.** The frontend calls same-origin paths like `/api/hello`. Vite's dev proxy (`frontend/vite.config.ts`, `server.proxy["/api"]`) forwards `/api/*` to `http://localhost:8000`. Because of the proxy, browser requests stay same-origin in dev. The backend also sets CORS for `http://localhost:5173` (`backend/src/python_rurrning/main.py`) as a fallback for direct cross-origin calls. **In production there is no Vite proxy** — `/api` must be routed to the backend by whatever serves the built frontend, or CORS/origins updated accordingly.
- **Backend layout.** `src` layout at `backend/src/python_rurrning/`. `app` is the FastAPI instance; `run()` (the `python-rurrning` console script entry) launches uvicorn. Add endpoints on `app`; keep the API under the `/api/*` prefix so the Vite proxy rule keeps working.
- **Tests** use FastAPI's `TestClient` against the imported `app` (no running server needed). `httpx` is a dev dependency required by `TestClient`.

## Adding an endpoint

New backend routes should live under `/api/...` (matches the Vite proxy and keeps the frontend calling same-origin). After adding one, the frontend can `fetch("/api/<path>")` directly in dev.
