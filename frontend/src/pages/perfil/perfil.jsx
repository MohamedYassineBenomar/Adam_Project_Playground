// Pagina de perfil: mostra correu i rol (read-only) i permet editar
// nom, telefon i ciutat. Crida apiUpdatePerfil() i actualitza l'estat
// global (setUsuari) perquè el header reflecteixi el canvi al moment.
import { useState } from "react";
import { apiUpdatePerfil } from "../../api";
import { CIUTATS } from "../../constants";
import "./perfil.css";

function Perfil(props) {
  const [nom, setNom] = useState(props.usuari.nom);
  const [telefon, setTelefon] = useState(String(props.usuari.telefon));
  const [ciutat, setCiutat] = useState(props.usuari.ciutat);
  const [error, setError] = useState(null);
  const [desat, setDesat] = useState(false);
  const [carregant, setCarregant] = useState(false);

  async function gestionarSubmit(event) {
    event.preventDefault();
    setError(null);
    setDesat(false);
    setCarregant(true);
    try {
      const usuariActualitzat = await apiUpdatePerfil(
        { nom, telefon: parseInt(telefon), ciutat },
        props.token
      );
      props.setUsuari(usuariActualitzat);
      localStorage.setItem("usuari", JSON.stringify(usuariActualitzat));
      setDesat(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setCarregant(false);
    }
  }

  return (
    <section className="perfil">
      <h2>El meu perfil</h2>
      <form onSubmit={gestionarSubmit} className="perfil-form">
        <label>
          Correu (no editable)
          <input value={props.usuari.correu} readOnly />
        </label>
        <label>
          Rol (no editable)
          <input value={props.usuari.rol} readOnly />
        </label>
        <label>
          Nom
          <input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </label>
        <label>
          Telefon
          <input
            type="tel"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            required
          />
        </label>
        <label>
          Ciutat
          <select value={ciutat} onChange={(e) => setCiutat(e.target.value)}>
            {CIUTATS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        {error && <div className="perfil-error">{error}</div>}
        {desat && <div className="perfil-ok">Perfil actualitzat correctament.</div>}
        <button type="submit" className="perfil-btn" disabled={carregant}>
          {carregant ? "Desant…" : "Desar canvis"}
        </button>
      </form>
    </section>
  );
}

export default Perfil;
