// Targeta d'un producte. Mostra imatge, nom, descripcio, preu/unitat,
// botiga, ciutat i un boto per veure'l a OpenStreetMap.
// També carrega les ultimes 1-2 ressenyes de la botiga al muntar-se.
import { useState, useEffect } from "react";
import { apiRessenyes } from "../../api";
import "./producteCard.css";

function ProducteCard(props) {
  const producte = props.producte;
  const [ressenyes, setRessenyes] = useState([]);

  // Carrega les ressenyes de la botiga propietaria d'aquest producte
  useEffect(function () {
    async function carregar() {
      try {
        const dades = await apiRessenyes(producte.vendedorFK);
        setRessenyes(dades.slice(0, 2));
      } catch (error) {
        console.log("Error carregant ressenyes:", error);
      }
    }
    carregar();
  }, [producte.vendedorFK]);

  // Construeix l'enllaç a OpenStreetMap centrat en el producte
  function obrirMapa() {
    const url = `https://www.openstreetmap.org/?mlat=${producte.latitud}&mlon=${producte.longitud}&zoom=16`;
    window.open(url, "_blank");
  }

  return (
    <article className="producte-card">
      {producte.imatge ? (
        <img
          src={producte.imatge}
          alt={producte.nom}
          className="producte-card-imatge"
        />
      ) : (
        <div className="producte-card-imatge producte-card-imatge-buit">
          Sense imatge
        </div>
      )}
      <div className="producte-card-cos">
        <h3 className="producte-card-nom">{producte.nom}</h3>
        <p className="producte-card-desc">{producte.descripcio}</p>
        <div className="producte-card-meta">
          <span className="producte-card-botiga">{producte.nom_botiga}</span>
          <span className="producte-card-ciutat">{producte.ciutat}</span>
        </div>
        {producte.telefon_botiga && (
          <div className="producte-card-telefon">📞 {producte.telefon_botiga}</div>
        )}
        <div className="producte-card-preu-fila">
          <span className="producte-card-preu">
            {producte.preu} €/{producte.unitat}
          </span>
          <button
            className="producte-card-mapa"
            onClick={obrirMapa}
            title="Veure al mapa"
          >
            📍
          </button>
        </div>
        {ressenyes.length > 0 && (
          <ul className="producte-card-ressenyes">
            {ressenyes.map((r) => (
              <li key={r.id}>
                <span className="producte-card-estrelles">
                  {"★".repeat(r.estrelles)}
                </span>{" "}
                {r.comentari}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export default ProducteCard;
