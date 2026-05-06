# Mercat Local

A simple web application that connects users with local food sellers in Spain. The goal is to promote local consumption and let users discover products from nearby stores.

## Stack

- **Frontend:** React (Vite), React Router, react-leaflet
- **Backend:** Django + Django REST Framework
- **Database:** SQLite (default)
- **Maps:** Leaflet + OpenStreetMap (no API key)
- **Geocoding:** Nominatim (OpenStreetMap, no API key)

## User roles

- **Client** — browse, search and filter products, view stores on the map.
- **Seller** — add and manage products listed in their city.

## Project structure

```
mercat-local/
├── backend/        Django REST API
└── frontend/       React (Vite) SPA
```

See [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md) for run instructions.

## Quick start

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata api/fixtures/seed.json
python manage.py runserver

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:8000`, frontend on `http://localhost:5173`.
