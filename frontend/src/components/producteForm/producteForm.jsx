// Modal amb el formulari per afegir un nou producte. Nomes visible per
// vendedors. Geocodifica l'adreça al backend amb Nominatim.
import { useState, useEffect } from "react";
import { apiCategories, apiCreateProducte } from "../../api";
import { UNITATS } from "../../constants";
import "./producteForm.css";

function ProducteForm(props) {
  const [nom, setNom] = useState("");
  const [descripcio, setDescripcio] = useState("");
  const [imatge, setImatge] = useState("");
  const [preu, setPreu] = useState("");
  const [unitat, setUnitat] = useState(UNITATS[0]);
  const [categories, setCategories] = useState([]);
  const [categoriaFK, setCategoriaFK] = useState("");
  const [adreca, setAdreca] = useState("");
  const [error, setError] = useState(null);
  const [carregant, setCarregant] = useState(false);

  // Carrega les categories disponibles per omplir el dropdown
  useEffect(function () {
    async function obtenir() {
      try {
        const dades = await apiCategories();
        setCategories(dades);
        if (dades.length > 0) {
          setCategoriaFK(dades[0].id);
        }
      } catch (error) {
        console.log("Error categories:", error);
      }
    }
    obtenir();
  }, []);

  async function gestionarSubmit(event) {
    event.preventDefault();
    setError(null);
    setCarregant(true);
    try {
      const producte = await apiCreateProducte(
        {
          nom,
          descripcio,
          imatge,
          preu,
          unitat,
          categoriaFK: parseInt(categoriaFK),
          adreca,
        },
        props.token
      );
      props.onCreat(producte);
    } catch (error) {
      setError(error.message);
    } finally {
      setCarregant(false);
    }
  }

  return (
    <div className="producte-form-overlay" role="dialog">
      <div className="producte-form-modal">
        <button
          className="producte-form-tancar"
          onClick={props.onCancel}
          type="button"
        >
          ✕
        </button>
        <h2>Afegir producte</h2>
        <form onSubmit={gestionarSubmit} className="producte-form">
          <label>
            Nom
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              maxLength={80}
            />
          </label>
          <label>
            Descripció
            <textarea
              value={descripcio}
              onChange={(e) => setDescripcio(e.target.value)}
              rows={3}
            />
          </label>
          <label>
            URL imatge
            <input
              type="url"
              value={imatge}
              onChange={(e) => setImatge(e.target.value)}
              placeholder="https://…"
            />
          </label>
          <div className="producte-form-fila">
            <label>
              Preu (€)
              <input
                type="number"
                step="0.01"
                min="0"
                value={preu}
                onChange={(e) => setPreu(e.target.value)}
                required
              />
            </label>
            <label>
              Unitat
              <select
                value={unitat}
                onChange={(e) => setUnitat(e.target.value)}
              >
                {UNITATS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Categoria
            <select
              value={categoriaFK}
              onChange={(e) => setCategoriaFK(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>
          </label>
          <label>
            Adreça completa
            <input
              value={adreca}
              onChange={(e) => setAdreca(e.target.value)}
              placeholder="Carrer, número, ciutat, codi postal"
              required
            />
          </label>
          {error && <div className="producte-form-error">{error}</div>}
          <div className="producte-form-accions">
            <button
              type="button"
              className="producte-form-cancel"
              onClick={props.onCancel}
              disabled={carregant}
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              className="producte-form-enviar"
              disabled={carregant}
            >
              {carregant ? "Desant…" : "Afegir producte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProducteForm;
