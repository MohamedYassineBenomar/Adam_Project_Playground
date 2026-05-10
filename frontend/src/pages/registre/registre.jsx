// Pagina de registre amb validacio per expressions regulars (rubric):
//  - correu: format email valid
//  - telefon: 9 digits (numero de telefon espanyol)
//  - contrasenya: minim 4 caracters
import { useState } from "react";
import { apiRegistre } from "../../api";
import { CIUTATS, ROLS } from "../../constants";
import "./registre.css";

// Expressions regulars per validacio del formulari
const REGEX_CORREU = /^[\w.+-]+@[\w-]+\.[\w.-]+$/;
const REGEX_TELEFON = /^[6-9]\d{8}$/;
const REGEX_CONTRASENYA = /^.{4,}$/;

function Registre(props) {
  const [nom, setNom] = useState("");
  const [correu, setCorreu] = useState("");
  const [contrasenya, setContrasenya] = useState("");
  const [telefon, setTelefon] = useState("");
  const [ciutat, setCiutat] = useState(CIUTATS[0]);
  const [rol, setRol] = useState(ROLS[0]);
  const [error, setError] = useState(null);
  const [carregant, setCarregant] = useState(false);

  function validar() {
    if (!REGEX_CORREU.test(correu)) {
      return "El correu no té un format valid";
    }
    if (!REGEX_TELEFON.test(telefon)) {
      return "El telefon ha de tenir 9 digits i començar per 6, 7, 8 o 9";
    }
    if (!REGEX_CONTRASENYA.test(contrasenya)) {
      return "La contrasenya ha de tenir com a minim 4 caracters";
    }
    return null;
  }

  async function gestionarSubmit(event) {
    event.preventDefault();
    const errorValidacio = validar();
    if (errorValidacio) {
      setError(errorValidacio);
      return;
    }
    setError(null);
    setCarregant(true);
    try {
      const dades = {
        nom,
        correu,
        contrasenya,
        telefon: parseInt(telefon),
        ciutat,
        rol,
      };
      const resposta = await apiRegistre(dades);
      props.onLogin(resposta.usuari, resposta.token);
    } catch (error) {
      setError(error.message);
    } finally {
      setCarregant(false);
    }
  }

  return (
    <section className="registre">
      <h2>Crear compte</h2>
      <form onSubmit={gestionarSubmit} className="registre-form">
        <label>
          Nom
          <input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </label>
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
            minLength={4}
          />
        </label>
        <label>
          Telefon (9 digits)
          <input
            type="tel"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            placeholder="612345678"
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
        <label>
          Rol
          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            {ROLS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        {error && <div className="registre-error">{error}</div>}
        <button type="submit" className="registre-btn" disabled={carregant}>
          {carregant ? "..." : "Crear compte"}
        </button>
      </form>
      <p className="registre-canvi">
        Ja tens compte?{" "}
        <button
          className="registre-enllac"
          onClick={() => props.onNavegar("login")}
        >
          Inicia sessió
        </button>
      </p>
    </section>
  );
}

export default Registre;
