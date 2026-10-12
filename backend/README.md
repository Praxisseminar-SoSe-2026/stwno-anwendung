# STWNO Application – Backend
FastAPI backend of the STWNO application.

## Prerequisites
- Docker

## Setup
> Be sure to be in the `backend` directory

### 1. Set up environment variables:

```bash
cp .env.example .env
```

Then adjust the values in [.env](.env) to your own setup. See [Environment variables](#environment-variables) below for what each one does.

### 2. Start backend & database:
> Make sure that Docker is running
```bash
docker compose up -d --build
```

### 3. Apply a Alembic migration (more information in [Database migrations](#Database-migrations))
```bash
docker compose exec backend alembic upgrade head
```

### 4. Seed the data (more information in [Seed data](#Seed-data))
```
docker compose exec backend python -m app.db.seed
```

Done, the app runs at http://127.0.0.1:8000.

## Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string (`postgresql+pg8000://...`) |
| `FRONTEND_URL` | Allowed origin for CORS |
| `ENVIRONMENT` | `development` or `production` (affects log format) |
| `LOG_LEVEL` | `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL` |
| `JWT_SECRET_KEY` | Secret used to sign access tokens (≥32 bytes recommended) |
| `JWT_ALGORITHM` | JWT signing algorithm, default `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Session inactivity timeout in minutes |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Credentials used by the `db` service (Postgres container); must match `DATABASE_URL` |
| `SMTP_HOST` / `SMTP_PORT` | Mail server (use `mailhog` for local dev) |
| `SMTP_USERNAME` / `SMTP_PASSWORD` | Mail credentials (leave empty for Mailhog) |
| `SMTP_USE_TLS` | `true` for providers requiring STARTTLS (e.g. Gmail) |
| `SMTP_FROM_EMAIL` | Sender address for outgoing emails |
| `BACKEND_URL` | Base URL used to build public URLs for uploaded files |

## API overview

- **Permissions** (`/permissions`) – list available permissions
- **Requests** (`/requests`) – repair tickets and room booking requests
- **Announcements** (`/announcements`) – bulletin board posts/announcements
- **Email** (`/email`) - email sending
- **Dormitories** (`/dormitories`) – CRUD for dormitories
- **Auth** (`/auth`) – login, current-user
- **FAQ** (`/faq`) – frequently asked questions, grouped by category
- **Infrastructure** (`/infrastructure`) – community rooms, laundry rooms, and laundry machines
- **Uploads** (`/uploads`) – image uploads for announcements and repair requests
- **Laundry booking** (`/laundry`) – reserve and end laundry machine bookings
- **Users** (`/users`) – admin management of accounts, roles, and dormitory assignments
- **Health** (`/health`) - check backend status
- **Registration** (`/registration`) – verify person number and email against the imported resident master data, send a confirmation link, and create the account once the password is set and the privacy notice is accepted (consent is stored in `privacy_consents`)

Full interactive documentation is available at http://127.0.0.1:8000/docs once the backend is running.

## Database migrations
Apply migration:
```bash
docker compose exec backend alembic upgrade head
```

Roll back the last migration:
```bash
docker compose exec backend alembic downgrade -1
```

Check the current migration status:
```bash
docker compose exec backend alembic current
```

Generate a new migration after a model has been changed/added:
```bash
docker compose exec backend alembic revision --autogenerate -m "short description"
```

## Seed data
Populate the database with test data (roles, permissions, dormitories, users,
sample repair/room requests, announcements, FAQ entries, etc.). Run this
**after** `alembic upgrade head`.

```bash
docker compose exec backend python -m app.db.seed
```

All accounts use the password `password`.

| Email                                      | Role | Dormitory |
|--------------------------------------------|---|---|
| raffael.eger@web.de                        | admin | – |
| maximilian.auberger@stud.uni-regensburg.de | admin | – |
| jonas.haller@stud.uni-regensburg.de        | admin | – |
| hausmeister@mail.de                        | hausmeister | Franz-Mayer-Straße |
| zita.hoelzl@mail.de                        | mitarbeiter | – |
| sophia@mail.com                            | tutor | Franz-Mayer-Straße |
| lena@mail.com                              | bewohner | Franz-Mayer-Straße |
| lukas@mail.com                             | bewohner | Fort-Skelly-Straße |

## Tests
```bash
docker compose exec backend pytest
```

Tests run against an isolated in-memory SQLite database (see [conftest.py](tests/conftest.py))
and don't require a running Postgres instance.

## Linting & Formatting
```bash
docker compose exec backend ruff check app  
```

## Logging
Logging is configured centrally in [logging.py](app/core/logging.py) and availably in [app.log](logs/app.log). 
Every request is logged automatically via a middleware, including method, path, status code, and response time. 
Log level and format (human-readable vs. JSON) are controlled via `LOG_LEVEL` and `ENVIRONMENT` in [.env](.env).

## Email Notifications

Emails are sent asynchronously via SMTP using a background task, so requests don't block while the email is being delivered.

For local development, emails are caught by Mailhog instead of being delivered.
View sent emails at http://127.0.0.1:8025 and configure settings in [.env](.env).

## File uploads

Images (e.g. for announcements) can be uploaded via `POST /uploads/images` and persist across container restarts.

## Project structure
```
.
├── Dockerfile
├── README.md
├── alembic
│   ├── README
│   ├── __pycache__
│   ├── env.py
│   ├── script.py.mako
│   └── versions
├── alembic.ini
├── app
│   ├── __init__.py
│   ├── __pycache__
│   ├── core        Configuration, security, permissions, logging
│   ├── db          Database connection (Engine, Session, Base) and seed script
│   ├── main.py     App entry point
│   ├── models      SQLAlchemy models (DB tables)
│   ├── routers     FastAPI endpoints
│   ├── schemas     Pydantic schemas (API request/response)
│   └── services    Business logic / DB access
├── docker-compose.yml
├── logs
├── pyproject.toml
├── pytest.ini
├── requirements-dev.txt
├── requirements.txt
├── tests            Pytest suite (isolated SQLite test database)
└── uploads
```