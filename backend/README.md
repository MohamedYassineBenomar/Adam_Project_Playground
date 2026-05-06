# Backend — Django REST API

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed         # demo sellers, products and reviews
python manage.py runserver    # http://localhost:8000
```

The seed command also prints the demo seller password (`demo1234`) so you
can log in as a seller and try `+ Add Product`.

## Endpoints

| Method | Path                          | Auth        | Description                              |
| ------ | ----------------------------- | ----------- | ---------------------------------------- |
| POST   | `/api/register`               | —           | Create user, returns `{ token, user }`   |
| POST   | `/api/login`                  | —           | Authenticate, returns `{ token, user }`  |
| GET    | `/api/products`               | —           | List all products with lat/lng + store   |
| POST   | `/api/products`               | seller only | Create product (geocodes the address)    |
| GET    | `/api/reviews?store_id=<id>`  | —           | Reviews of a store                       |
| POST   | `/api/reviews`                | required    | Create a review for a store              |
| GET    | `/api/profile`                | required    | Current user                             |
| PUT    | `/api/profile`                | required    | Update name / phone / city               |

Authenticated requests use the `Authorization: Token <key>` header.

## Geocoding

`POST /api/products` calls Nominatim (OpenStreetMap) to convert the full
address into latitude and longitude before saving. If the address can't
be resolved the endpoint returns a 400 with `{ "address": "Address not
found, please check it" }`.

Nominatim's policy: 1 request/second and a descriptive User-Agent — both
honoured in `api/geocoding.py`.

## Admin

```bash
python manage.py createsuperuser
```

Then `http://localhost:8000/admin/` exposes the User, Product and Review
models.
