// Component arrel del projecte Mercat Local.
// Manté l'estat global (pàgina actual, usuari autenticat i token JWT)
// i el passa per props als components fills. Substitueix react-router-dom
// per un simple useState 'pagina', tal com es fa a classe.
import { useState, useEffect } from "react";
import Header from "./components/header/header";
import Landing from "./pages/landing/landing";
import Login from "./pages/login/login";
import Registre from "./pages/registre/registre";
import Productes from "./pages/productes/productes";
import Perfil from "./pages/perfil/perfil";

function App() {
  // Estat de navegació: quina pàgina mostrem ara mateix
  const [pagina, setPagina] = useState("landing");
  // Estat d'autenticació: usuari logat (o null) i el seu JWT
  const [usuari, setUsuari] = useState(null);
  const [token, setToken] = useState(null);

  // En arrencar, recuperem la sessió del localStorage si existeix
  useEffect(function () {
    const tokenGuardat = localStorage.getItem("token");
    const usuariGuardat = localStorage.getItem("usuari");
    if (tokenGuardat && usuariGuardat) {
      setToken(tokenGuardat);
      setUsuari(JSON.parse(usuariGuardat));
    }
  }, []);

  // Quan l'usuari fa login o registre amb èxit
  function iniciarSessio(nouUsuari, nouToken) {
    setUsuari(nouUsuari);
    setToken(nouToken);
    localStorage.setItem("token", nouToken);
    localStorage.setItem("usuari", JSON.stringify(nouUsuari));
    setPagina("productes");
  }

  // Tancar sessió: esborrem token i usuari, tornem a la landing
  function tancarSessio() {
    setUsuari(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuari");
    setPagina("landing");
  }

  // Funció per canviar de pàgina (passada com a prop als fills)
  function navegar(novaPagina) {
    setPagina(novaPagina);
  }

  return (
    <>
      <Header usuari={usuari} onNavegar={navegar} onLogout={tancarSessio} />
      <main>
        {pagina === "landing" && (
          <Landing usuari={usuari} onNavegar={navegar} />
        )}
        {pagina === "login" && (
          <Login onLogin={iniciarSessio} onNavegar={navegar} />
        )}
        {pagina === "registre" && (
          <Registre onLogin={iniciarSessio} onNavegar={navegar} />
        )}
        {pagina === "productes" && (
          <Productes usuari={usuari} token={token} />
        )}
        {pagina === "perfil" && usuari && (
          <Perfil usuari={usuari} token={token} setUsuari={setUsuari} />
        )}
      </main>
    </>
  );
}

export default App;
