# STWNO-Application
## Overview
This project is a dormitory management system developed with and for the STWNO
as part of the Media Informatics course "Praxisseminar".

The purpose of this application is to improve the daily life of staff and
residents of dormitories by providing features like tracking washing machine
usage, submitting repair requests, managing infrastructure, and more. All in
one place, with an account system.

*TODO Bilder*

## Project Structure
```
.
├── .github         CI/CD pipeline
├── README.md
├── backend         Backend code
├── documentation   Internal planing documents
└── frontend        Frontend code
```

## Requirements
- Backend: Docker
- Frontend: Node v24.18.0 (or higher)

## Quickstart

### Backend (for more information see the backend [README.md](backend/README.md))
In the `backend` directory:
1. Set up environment variables:

```bash
cp .env.example .env
```

Then adjust the values in [.env](.env) to your own setup. See [Environment variables](#environment-variables) below for what each one does.

2. Start backend & database:
> Make sure that Docker is running
```bash
docker compose up -d --build
```

3. Apply a Alembic migration (more information in [Database migrations](#Database-migrations))
```bash
docker compose exec backend alembic upgrade head
```

4. Seed the data (more information in [Seed data](#Seed-data))
```
docker compose exec backend python -m app.db.seed
```

Done, the app runs at http://127.0.0.1:8000.

### Frontend (for more information see the backend [README.md](frontend/README.md))
In the `frontend` directory:
1. Install Dependencies

```bash
npm install
```

2. Set environment variables

```bash
cp .env.example .env
```

Set `VITE_API_BASE_URL` in [.env](.env) to the backend URL

3. Running

```bash
npm run dev
```

Done, the frontend is available at http://localhost:5173/

## Licence
