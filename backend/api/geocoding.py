import requests

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
USER_AGENT = "MercatLocal/1.0 (class project)"
TIMEOUT_SECONDS = 8


def geocode_address(address: str):
    """Resolve a street address to (lat, lng) using Nominatim.

    Returns (lat, lng) on success or None when the address can't be found
    or the service is unreachable. Nominatim's usage policy requires
    a descriptive User-Agent and at most 1 request per second; the second
    constraint is the caller's responsibility.
    """
    if not address or not address.strip():
        return None

    try:
        response = requests.get(
            NOMINATIM_URL,
            params={"q": address, "format": "json", "limit": 1},
            headers={"User-Agent": USER_AGENT},
            timeout=TIMEOUT_SECONDS,
        )
    except requests.RequestException:
        return None

    if response.status_code != 200:
        return None

    results = response.json()
    if not results:
        return None

    first = results[0]
    return float(first["lat"]), float(first["lon"])
