// Pagina de login. Crida apiLogin() i, si es correcte, propaga el token
// i l'usuari al component pare amb la prop onLogin.
import { useState } from "react";
import { apiLogin } from "../../api";
import "./login.css";

function Login(props) {
  const [correu, setCorreu] = useState("");
  const [contrasenya, setContrasenya] = useState("");
  const [error, setError] = useState(null);
  const [carregant, setCarregant] = useState(false);

  async function gestionarSubmit(event) {
    event.preventDefault();
    setError(null);
    setCarregant(true);
    try {
      const resposta = await apiLogin(correu, contrasenya);
      props.onLogin(resposta.usuari, resposta.token);
    } catch (error) {
      setError(error.message);
    } finally {
      setCarregant(false);
    }
  }

  return (
    <section className="login">
      <h2>Iniciar sessió</h2>
      <form onSubmit={gestionarSubmit} className="login-form">
        <label>
          Correu
          <input
            type="email"
            value={correu}
            onChange={(e) => setCorreu(e.target.value)}
            required
          />
        </label>
        <label>
          Contrasenya
          <input
            type="password"
            value={contrasenya}
            onChange={(e) => setContrasenya(e.target.value)}
            required
          />
        </label>
        {error && <div className="login-error">{error}</div>}
        <button type="submit" className="login-btn" disabled={carregant}>
          {carregant ? "..." : "Entrar"}
        </button>
      </form>
      <p className="login-canvi">
        No tens compte?{" "}
        <button
          className="login-enllac"
          onClick={() => props.onNavegar("registre")}
        >
          Registra't
        </button>
      </p>
    </section>
  );
}

export default Login;
