import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        Mercat Local
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/products" className="nav-link">
              Products
            </Link>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <span className="hello">Hola, {user.name}</span>
            <button className="link-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
}
