// Landing del projecte: 5 seccions (hero, sostenibilitat, donacio, ODS, destacats).
// Sempre visible per a tothom; si l'usuari no està logat mostra Login/Registre,
// si està logat mostra "Veure productes" / "El meu perfil".
import { useState, useEffect } from "react";
import FeaturedCard from "../../components/featuredCard/featuredCard";
import { apiProductes } from "../../api";
import "./landing.css";

const URL_DONACIO = "https://github.com/sponsors/MohamedYassineBenomar";

function Landing(props) {
  const usuari = props.usuari;
  const [destacats, setDestacats] = useState([]);

  // Carrega els 3 productes més recents per la secció Featured Items
  useEffect(function () {
    async function obtenir() {
      try {
        const dades = await apiProductes();
        setDestacats(dades.slice(0, 3));
      } catch (error) {
        console.log("Error productes destacats:", error);
      }
    }
    obtenir();
  }, []);

  return (
    <div className="landing">
      <section className="landing-hero">
        <h1>Mercat Local</h1>
        <p className="landing-tagline">
          Plataforma gratuita i comunitaria que connecta la gent amb venedors
          d'aliments locals d'arreu d'Espanya — recolzant l'economia local i
          el consum sostenible.
        </p>
        <div className="landing-botons">
          {usuari ? (
            <>
              <button
                className="landing-btn-blanc"
                onClick={() => props.onNavegar("productes")}
              >
                Veure productes
              </button>
              <button
                className="landing-btn-outline"
                onClick={() => props.onNavegar("perfil")}
              >
                El meu perfil
              </button>
            </>
          ) : (
            <>
              <button
                className="landing-btn-blanc"
                onClick={() => props.onNavegar("login")}
              >
                Iniciar sessió
              </button>
              <button
                className="landing-btn-outline"
                onClick={() => props.onNavegar("registre")}
              >
                Registrar-se
              </button>
            </>
          )}
        </div>
      </section>

      <section className="landing-sostenibilitat">
        <h2>Un projecte gratuit i sostenible per a la comunitat</h2>
        <p className="landing-lead">
          Mercat Local és 100% gratuit, codi obert i impulsat per la comunitat.
          Qualsevol persona, comerç o associació local pot fer-lo servir sense
          pagar res.
        </p>
        <div className="landing-fila-cards">
          <article className="landing-card">
            <h3>100% Gratuit</h3>
            <p>
              Sense cost per a compradors ni venedors. Tecnologia de comerç de
              proximitat accessible per a tothom, sense quotes ni subscripcions
              amagades.
            </p>
          </article>
          <article className="landing-card">
            <h3>Codi obert</h3>
            <p>
              Tot el codi és public. La comunitat el pot revisar, contribuir
              amb millores i adaptar-lo al seu propi barri.
            </p>
          </article>
          <article className="landing-card">
            <h3>Impacte local</h3>
            <p>
              Cada compra local redueix les emissions del transport, ajuda
              famílies i enforteix l'economia de proximitat de la teva ciutat.
            </p>
          </article>
        </div>
      </section>

      <section className="landing-donacio">
        <h2>Ajuda'ns a mantenir el projecte viu</h2>
        <p className="landing-lead">
          Les donacions paguen els servidors, el manteniment i el
          desenvolupament continuat perquè la plataforma sigui sempre gratuita
          per a tothom.
        </p>
        <a
          className="landing-btn-donar"
          href={URL_DONACIO}
          target="_blank"
          rel="noopener noreferrer"
        >
          Fer una donació
        </a>
      </section>

      <section className="landing-ods">
        <h2>Objectius de Desenvolupament Sostenible</h2>
        <div className="landing-fila-cards">
          <article className="landing-ods-card">
            <h3>ODS 11 — Ciutats Sostenibles</h3>
            <p>
              Promoure el comerç local escurça les cadenes de subministrament,
              redueix el transport dins les nostres ciutats i fa els barris
              més autosuficients i resilients.
            </p>
          </article>
          <article className="landing-ods-card">
            <h3>ODS 12 — Consum Responsable</h3>
            <p>
              Connectar consumidors directament amb productors locals elimina
              intermediaris, redueix el malbaratament i fomenta comprar només
              el que realment cal, de temporada.
            </p>
          </article>
        </div>
      </section>

      <section className="landing-destacats">
        <h2>Productes destacats</h2>
        {destacats.length === 0 ? (
          <p className="landing-buit">
            Encara no hi ha productes. Sigues el primer en afegir-ne un!
          </p>
        ) : (
          <div className="landing-fila-cards">
            {destacats.map((p) => (
              <FeaturedCard key={p.id} producte={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Landing;
