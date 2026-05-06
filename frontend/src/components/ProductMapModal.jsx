import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

const ICON_BASE = "https://unpkg.com/leaflet@1.9.4/dist/images/";

const storeIcon = new L.Icon({
  iconUrl: `${ICON_BASE}marker-icon.png`,
  iconRetinaUrl: `${ICON_BASE}marker-icon-2x.png`,
  shadowUrl: `${ICON_BASE}marker-shadow.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: `${ICON_BASE}marker-shadow.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    if (points.length === 1) {
      map.setView(points[0], 15);
      return;
    }
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [points, map]);
  return null;
}

function distanceKm(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

export default function ProductMapModal({ product, userLocation, onClose }) {
  const [resolvedLocation, setResolvedLocation] = useState(userLocation);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    if (resolvedLocation || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setResolvedLocation([pos.coords.latitude, pos.coords.longitude]),
      () => setLocationDenied(true),
      { timeout: 6000 }
    );
  }, [resolvedLocation]);

  const storePoint = [product.latitude, product.longitude];
  const points = resolvedLocation ? [storePoint, resolvedLocation] : [storePoint];
  const distance = resolvedLocation
    ? distanceKm(storePoint, resolvedLocation).toFixed(2)
    : null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal modal-map">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          ✕
        </button>
        <h2>{product.title}</h2>
        <p className="muted">{product.address}</p>
        {distance ? (
          <p className="distance">≈ {distance} km from your location</p>
        ) : locationDenied ? (
          <p className="muted">Enable location to see distance</p>
        ) : null}
        <div className="map-wrapper">
          <MapContainer
            center={storePoint}
            zoom={15}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={storePoint} icon={storeIcon}>
              <Popup>
                <strong>{product.store_name}</strong>
                <br />
                {product.address}
              </Popup>
            </Marker>
            {resolvedLocation ? (
              <Marker position={resolvedLocation} icon={userIcon}>
                <Popup>You are here</Popup>
              </Marker>
            ) : null}
            <FitBounds points={points} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
