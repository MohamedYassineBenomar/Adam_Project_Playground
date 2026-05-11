# Mercat Local

Aplicació web senzilla que connecta gent amb venedors d'aliments locals
d'arreu d'Espanya. L'objectiu és promoure el consum de proximitat i
permetre descobrir productes de botigues properes.

## Stack

- **Frontend:** React + Vite (sense router; estat de pàgina amb `useState`)
- **Backend:** Django 5 + Django REST Framework (només `@api_view`)
- **Base de dades:** PostgreSQL via `docker-compose.yml`
- **Auth:** JWT amb PyJWT (custom `autenticar()` + `generar_token()`)
- **Geocodificació:** Nominatim (OpenStreetMap, sense API key)

## Rols d'usuari

- **Comprador** — navegar, cercar i filtrar productes; veure botigues al mapa.
- **Vendedor** — afegir i gestionar els seus productes.

## Estructura del projecte

```
mercat-local/
├── backend/        API Django REST + docker-compose.yml (PostgreSQL)
└── frontend/       SPA React (Vite)
```

Vegeu [backend/README.md](backend/README.md) i [frontend/README.md](frontend/README.md).

## Quick start

```bash
# 1) Arrencar PostgreSQL
cd backend
docker compose up -d

# 2) Backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cd src
python manage.py migrate
python manage.py seed
python manage.py runserver

# 3) Frontend (segon terminal)
cd frontend
npm install
npm run dev
```

Backend a `http://localhost:8000`, frontend a `http://localhost:5173`,
pgAdmin a `http://localhost:5050`.
