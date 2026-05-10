// Pagina principal de productes: graella amb cerca + filtres ciutat/categoria.
// Si l'usuari logat es vendedor, mostra el boto "+ Afegir producte".
import { useState, useEffect } from "react";
import ProducteCard from "../../components/producteCard/producteCard";
import ProducteForm from "../../components/producteForm/producteForm";
import { apiProductes, apiCategories } from "../../api";
import { CIUTATS } from "../../constants";
import "./productes.css";

// Barreja una llista (ordre aleatori inicial, com demana l'enunciat)
function barrejar(llista) {
  const copia = llista.slice();
  for (let i = copia.length - 1; i > 0; i = i - 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const aux = copia[i];
    copia[i] = copia[j];
    copia[j] = aux;
  }
  return copia;
}

function Productes(props) {
  const [productes, setProductes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [carregant, setCarregant] = useState(true);
  const [error, setError] = useState(null);
  const [cerca, setCerca] = useState("");
  const [filtreCiutat, setFiltreCiutat] = useState("");
  const [filtreCategoria, setFiltreCategoria] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);

  // Carrega productes i categories al muntar el component
  useEffect(function () {
    async function obtenirDades() {
      try {
        const dadesProductes = await apiProductes();
        setProductes(barrejar(dadesProductes));
        const dadesCategories = await apiCategories();
        setCategories(dadesCategories);
      } catch (error) {
        setError(error.message);
      } finally {
        setCarregant(false);
      }
    }
    obtenirDades();
  }, []);

  // Quan es crea un producte nou des del modal, l'afegim al principi
  function gestionarCreacio(producte) {
    setProductes([producte, ...productes]);
    setMostrarForm(false);
  }

  // Aplica els filtres en local sobre la llista carregada
  const filtrats = productes.filter((p) => {
    const terme = cerca.trim().toLowerCase();
    if (terme && !p.nom.toLowerCase().includes(terme)) {
      return false;
    }
    if (filtreCiutat && p.ciutat !== filtreCiutat) {
      return false;
    }
    if (filtreCategoria && p.nom_categoria !== filtreCategoria) {
      return false;
    }
    return true;
  });

  const esVendedor = props.usuari && props.usuari.rol === "Vendedor";

  return (
    <section className="productes">
      {esVendedor && (
        <div className="productes-toolbar">
          <button
            className="productes-add-btn"
            onClick={() => setMostrarForm(true)}
          >
            + Afegir producte
          </button>
        </div>
      )}

      {mostrarForm && (
        <ProducteForm
          token={props.token}
          onCreat={gestionarCreacio}
          onCancel={() => setMostrarForm(false)}
        />
      )}

      <div className="productes-filtres">
        <input
          type="search"
          placeholder="Buscar per nom de producte…"
          value={cerca}
          onChange={(e) => setCerca(e.target.value)}
        />
        <select
          value={filtreCiutat}
          onChange={(e) => setFiltreCiutat(e.target.value)}
        >
          <option value="">Totes les ciutats</option>
          {CIUTATS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filtreCategoria}
          onChange={(e) => setFiltreCategoria(e.target.value)}
        >
          <option value="">Totes les categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.nom}>
              {c.nom}
            </option>
          ))}
        </select>
      </div>

      {carregant && <p>Carregant productes…</p>}
      {error && <div className="productes-error">{error}</div>}
      {!carregant && !error && filtrats.length === 0 && (
        <p className="productes-buit">Cap producte coincideix amb els filtres.</p>
      )}

      <div className="productes-graella">
        {filtrats.map((producte) => (
          <ProducteCard key={producte.id} producte={producte} />
        ))}
      </div>
    </section>
  );
}

export default Productes;
