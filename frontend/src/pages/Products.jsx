import { useEffect, useMemo, useState } from "react";
import AddProductForm from "../components/AddProductForm.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductMapModal from "../components/ProductMapModal.jsx";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import { CATEGORIES, SPAIN_CITIES } from "../constants.js";

function shuffle(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [mapProduct, setMapProduct] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { timeout: 6000 }
    );
  }, []);

  useEffect(() => {
    let active = true;
    api
      .products()
      .then((data) => {
        if (active) setProducts(shuffle(data));
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      if (term && !product.title.toLowerCase().includes(term)) return false;
      if (city && product.city !== city) return false;
      if (category && product.category !== category) return false;
      return true;
    });
  }, [products, search, city, category]);

  function handleCreated(product) {
    setProducts((prev) => [product, ...prev]);
    setShowAddForm(false);
  }

  return (
    <section>
      {user?.role === "seller" ? (
        <div className="toolbar">
          <button className="btn" onClick={() => setShowAddForm(true)}>
            + Add Product
          </button>
        </div>
      ) : null}

      {showAddForm ? (
        <AddProductForm
          onCreated={handleCreated}
          onCancel={() => setShowAddForm(false)}
        />
      ) : null}

      <div className="filters">
        <input
          type="search"
          placeholder="Search by product name…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={city} onChange={(event) => setCity(event.target.value)}>
          <option value="">All cities</option>
          {SPAIN_CITIES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {loading ? <p>Loading products…</p> : null}
      {error ? <div className="error">{error}</div> : null}
      {!loading && !error && filtered.length === 0 ? (
        <p className="muted">No products match these filters.</p>
      ) : null}

      <div className="grid">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpenMap={setMapProduct}
          />
        ))}
      </div>

      {mapProduct ? (
        <ProductMapModal
          product={mapProduct}
          userLocation={userLocation}
          onClose={() => setMapProduct(null)}
        />
      ) : null}
    </section>
  );
}
