# Backend — Django REST API

## Setup

```bash
# 1) Arrencar PostgreSQL via docker-compose
docker compose up -d

# 2) Crear el venv i instal·lar dependencies
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# 3) Migrar i sembrar la BD (manage.py viu a backend/src/)
cd src
python manage.py migrate
python manage.py seed         # categories, vendedors, productes i ressenyes demo
python manage.py runserver    # http://localhost:8000
```

La comanda `seed` mostra la contrasenya demo (`demo1234`) per fer login
amb qualsevol vendedor i provar el botó `+ Afegir producte`.

## Endpoints

| Mètode | Path                                | Auth          | Descripció                                |
| ------ | ----------------------------------- | ------------- | ----------------------------------------- |
| POST   | `/api/registre/`                    | —             | Crea usuari, retorna `{ token, usuari }`  |
| POST   | `/api/login/`                       | —             | Autentica, retorna `{ token, usuari }`    |
| GET    | `/api/categories/`                  | —             | Llista de categories                      |
| GET    | `/api/productes/`                   | —             | Llista de tots els productes              |
| GET    | `/api/productes/<id>/`              | —             | Detall d'un producte                      |
| POST   | `/api/productes/add/`               | vendedor      | Crea producte (geocodifica l'adreça)      |
| GET    | `/api/ressenyes/?botiga_id=<id>`    | —             | Ressenyes d'una botiga                    |
| POST   | `/api/ressenyes/add/`               | autenticat    | Crea una ressenya                         |
| GET    | `/api/perfil/`                      | autenticat    | Usuari actual                             |
| PUT    | `/api/perfil/update/`               | autenticat    | Actualitza nom / telèfon / ciutat         |

Les peticions autenticades fan servir el header `Authorization: Bearer <jwt>`.

## Base de dades

PostgreSQL via `docker-compose.yml` (servei `postgres` + pgAdmin a
`http://localhost:5050`, login `admin@mercat.local` / `admin`).

```bash
docker compose up -d        # arrencar
docker compose down         # aturar
docker compose down -v      # reset complet (esborra el volum)
```

## Geocodificació

`POST /api/productes/add/` crida Nominatim (OpenStreetMap) per convertir
l'adreça completa en latitud/longitud abans de desar el producte. Si
l'adreça no es pot resoldre, retorna 400 amb
`{ "adreca": "Adreça no trobada, comprova-la" }`.

## Admin

```bash
cd src
python manage.py createsuperuser
```

Després `http://localhost:8000/admin/` exposa els models Categoria,
Usuari, TokenJWT, Producte i Ressenya.
