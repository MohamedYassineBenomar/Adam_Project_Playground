import { useState } from "react";
import { api } from "../api.js";
import { CATEGORIES } from "../constants.js";

const initialForm = {
  title: "",
  description: "",
  image: "",
  price: "",
  category: CATEGORIES[0],
  address: "",
};

export default function AddProductForm({ onCreated, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const product = await api.createProduct(form);
      onCreated(product);
      setForm(initialForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <button
          className="modal-close"
          onClick={onCancel}
          aria-label="Close"
          type="button"
        >
          ✕
        </button>
        <h2>Add a product</h2>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Title
            <input
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              required
              maxLength={120}
            />
          </label>
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              rows={3}
            />
          </label>
          <label>
            Image URL
            <input
              type="url"
              value={form.image}
              onChange={(event) => update("image", event.target.value)}
              placeholder="https://…"
            />
          </label>
          <label>
            Price (€)
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(event) => update("price", event.target.value)}
              required
            />
          </label>
          <label>
            Category
            <select
              value={form.category}
              onChange={(event) => update("category", event.target.value)}
            >
              {CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label>
            Full address
            <input
              value={form.address}
              onChange={(event) => update("address", event.target.value)}
              placeholder="Full address (street, number, city, postal code)"
              required
            />
          </label>
          {error ? <div className="error">{error}</div> : null}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Saving…" : "Add product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
