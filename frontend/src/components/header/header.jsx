// Capçalera fixa del projecte. Mostra el nom + els enllaços de navegació.
// Si l'usuari està logat, mostra "Productes" / "Perfil" / "Tancar sessió".
import "./header.css";

function Header(props) {
  const usuari = props.usuari;

  return (
    <nav className="header">
      <button
        className="header-marca"
        onClick={() => props.onNavegar("landing")}
      >
        Mercat Local
      </button>
      <div className="header-enllacos">
        {usuari && (
          <>
            <button
              className="header-link"
              onClick={() => props.onNavegar("productes")}
            >
              Productes
            </button>
            <button
              className="header-link"
              onClick={() => props.onNavegar("perfil")}
            >
              Perfil
            </button>
            <span className="header-hola">Hola, {usuari.nom}</span>
            <button className="header-logout" onClick={props.onLogout}>
              Tancar sessio
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;
