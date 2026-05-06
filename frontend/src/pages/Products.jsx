import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { api } from "../api.js";
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

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

  return (
    <section>
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
            onOpenMap={() => {}}
          />
        ))}
      </div>
    </section>
  );
}
