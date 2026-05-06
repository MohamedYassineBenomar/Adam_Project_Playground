# Frontend — React (Vite)

## Setup

```bash
npm install
npm run dev    # http://localhost:5173
```

Vite proxies every `/api/*` request to `http://localhost:8000`, so the
backend must be running for the SPA to load data.

## Pages

| Path         | Description                                                   |
| ------------ | ------------------------------------------------------------- |
| `/`          | Landing page with Login / Register CTAs                       |
| `/login`     | Email + password sign-in                                      |
| `/register`  | Sign-up form (name, email, password, phone, city, role)       |
| `/products`  | Product list with search + city + category filters; sellers see "+ Add Product" |
| `/profile`   | View / edit name, phone and city (email & role are read-only) |

## Stack

- React 18 + React Router 6
- react-leaflet + Leaflet for the map modal
- A thin `fetch` wrapper in [src/api.js](src/api.js) for all backend calls
- Token kept in `localStorage` and sent as `Authorization: Token <key>`

## Map

`ProductMapModal` shows the store marker (default Leaflet blue) plus the
user marker (red) using `navigator.geolocation`. Distance is displayed in
kilometres (Haversine formula). If the user denies location, only the
store marker is shown with a hint.
