import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { SPAIN_CITIES } from "../constants.js";

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  city: SPAIN_CITIES[0],
  role: "client",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
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
      await register(form);
      navigate("/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Name
          <input
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => update("password", event.target.value)}
            required
            minLength={4}
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
        <label>
          Role
          <select
            value={form.role}
            onChange={(event) => update("role", event.target.value)}
          >
            <option value="client">Client</option>
            <option value="seller">Seller</option>
          </select>
        </label>
        {error ? <div className="error">{error}</div> : null}
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "..." : "Create account"}
        </button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}
