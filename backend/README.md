# STWNO Anwendung – Backend

FastAPI-Backend der STWNO-Anwendung.

## Voraussetzungen

- Python 3.12
- PostgreSQL (lokal oder remote erreichbar)

## Setup

1. Virtuelle Umgebung erstellen und aktivieren:

```bash
   python -m venv venv
   venv\Scripts\activate
```

2. Abhängigkeiten installieren:

```bash
   pip install -r requirements-dev.txt
```

3. Umgebungsvariablen einrichten:

```bash
   copy .env.example .env
```

   Anschließend `DATABASE_URL` in `.env` an die eigene Postgres-Instanz anpassen.

## Anwendung starten

```bash
uvicorn app.main:app --reload
```

- API-Dokumentation: http://127.0.0.1:8000/docs
- Health-Check: http://127.0.0.1:8000/health

## Linting & Formatting

```bash
black app
ruff check app
```

## Projektstruktur

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