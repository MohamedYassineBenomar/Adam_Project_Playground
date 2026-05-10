"""Geocodificació d'adreces amb Nominatim (OpenStreetMap).

Converteix una adreça (text lliure) en coordenades (latitud, longitud).
És un servei gratuït i no requereix clau d'API. La política d'ús
demana un User-Agent descriptiu i un màxim d'1 petició per segon.
"""
import requests

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
USER_AGENT = "MercatLocal/1.0 (class project)"
TIMEOUT_SECONDS = 8


def geocode_address(adreca: str):
    # Retorna (latitud, longitud) o None si no es troba l'adreça
    if not adreca or not adreca.strip():
        return None

    try:
        response = requests.get(
            NOMINATIM_URL,
            params={"q": adreca, "format": "json", "limit": 1},
            headers={"User-Agent": USER_AGENT},
            timeout=TIMEOUT_SECONDS,
        )
    except requests.RequestException:
        return None

    if response.status_code != 200:
        return None

    resultats = response.json()
    if not resultats:
        return None

    primer = resultats[0]
    return float(primer["lat"]), float(primer["lon"])
