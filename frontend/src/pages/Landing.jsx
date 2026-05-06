import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function Landing() {
  const { user } = useAuth();
  if (user) return <Navigate to="/products" replace />;

  return (
    <section className="landing">
      <h1>Mercat Local</h1>
      <p className="lead">
        Discover fresh products from local food sellers around Spain.
      </p>
      <div className="cta">
        <Link to="/login" className="btn">
          Login
        </Link>
        <Link to="/register" className="btn btn-outline">
          Register
        </Link>
      </div>
    </section>
  );
}
