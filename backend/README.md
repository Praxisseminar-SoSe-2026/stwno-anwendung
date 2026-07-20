# STWNO Application – Backend
FastAPI backend of the STWNO application.

## Prerequisites
- Python 3.12
- Docker
- PostgreSQL (local or remote)

## Setup

1. Create and activate a virtual environment:

**Windows:**
```bash
   python -m venv .venv
   .venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
   python3 -m venv .venv
   source .venv/bin/activate
```

2. Set up environment variables:

**Windows:**
```bash
copy .env.example .env
```

**macOS / Linux:**
```bash
cp .env.example .env
```

Then adjust `DATABASE_URL` in `.env` to your own instance.

There are two ways to run the backend:

### Option A: Backend & database entirely via Docker

1. Start backend & database:
```bash
    docker compose up -d --build
```

2. Done – the app runs at http://127.0.0.1:8000, code changes are picked up automatically thanks to `--reload`.

### Option B: Database via Docker, backend running locally

1. Start the database (Docker):
```bash
    docker compose up -d db
```

2. Install dependencies:
```bash
    pip install -r requirements.txt
```  

3. Start the application:
```bash
    uvicorn app.main:app --reload
```

## Endpoints
- API-Dokumentation: http://127.0.0.1:8000/docs
- Health-Check: http://127.0.0.1:8000/health

## Tests
**Option A (Docker):**
```bash
docker compose exec backend pytest
```

**Option B (local):**
Activate the virtual environment (see Setup Option B), then:
```bash
pytest
```

## Database migrations (Alembic)
Generate a new migration after a model has been changed/added:

**Option A (Docker):**
```bash
docker compose exec backend alembic revision --autogenerate -m "short description"
```

**Option B (local):**
```bash
alembic revision --autogenerate -m "short description"
```

Review the generated file in `alembic/versions/` before applying it – autogenerate doesn't reliably detect everything (e.g. renames).

Apply migration:

**Option A (Docker):**
```bash
docker compose exec backend alembic upgrade head
```

**Option B (local):**
```bash
alembic upgrade head
```

Roll back the last migration:

**Option A (Docker):**
```bash
docker compose exec backend alembic downgrade -1
```

**Option B (local):**
```bash
alembic downgrade -1
```

Check the current migration status:

**Option A (Docker):**
```bash
docker compose exec backend alembic current
```

**Option B (local):**
```bash
alembic current
```

## Linting & Formatting

**Option A (Docker):**
```bash
docker compose exec backend black app
docker compose exec backend ruff check app  
```

**Option B (local):**
```bash
black app
ruff check app 
```

## Project structure
```
app/
  core/       Konfiguration (Settings)
  db/         Datenbankverbindung (Engine, Session, Base)
  models/     SQLAlchemy-Models (DB-Tabellen)
  schemas/    Pydantic-Schemas (API Request/Response)
  services/   Business-Logik / DB-Zugriffe
  routers/    FastAPI-Endpunkte
  main.py     App-Einstiegspunkt
```