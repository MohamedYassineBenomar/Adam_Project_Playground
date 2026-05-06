import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import { SPAIN_CITIES } from "../constants.js";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone || "",
    city: user.city,
  });
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .profile()
      .then((data) => {
        if (!active) return;
        setUser(data);
        setForm({ name: data.name, phone: data.phone || "", city: data.city });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [setUser]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setLoading(true);
    try {
      const updated = await api.updateProfile(form);
      setUser(updated);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth">
      <h2>My profile</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Email (read-only)
          <input value={user.email} readOnly />
        </label>
        <label>
          Role (read-only)
          <input value={user.role} readOnly />
        </label>
        <label>
          Name
          <input
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            required
          />
        </label>
        <label>
          Phone
          <input
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </label>
        <label>
          City
          <select
            value={form.city}
            onChange={(event) => update("city", event.target.value)}
          >
            {SPAIN_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
        {error ? <div className="error">{error}</div> : null}
        {saved ? <div className="success">Profile updated.</div> : null}
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Saving…" : "Save changes"}
        </button>
      </form>
    </section>
  );
}
