// Targeta lleugera per a la seccio "Featured Items" de la landing.
// No carrega ressenyes ni té boto de mapa per mantenir la landing rapida.
import "./featuredCard.css";

function FeaturedCard(props) {
  const producte = props.producte;
  return (
    <article className="featured-card">
      {producte.imatge ? (
        <img src={producte.imatge} alt={producte.nom} />
      ) : (
        <div className="featured-card-buit">Sense imatge</div>
      )}
      <div className="featured-card-cos">
        <h3>{producte.nom}</h3>
        <p className="featured-card-desc">{producte.descripcio}</p>
        <div className="featured-card-meta">
          <span>{producte.ciutat}</span>
          {producte.telefon_botiga && <span>📞 {producte.telefon_botiga}</span>}
        </div>
        <div className="featured-card-preu">
          {producte.preu} €/{producte.unitat}
        </div>
      </div>
    </article>
  );
}

export default FeaturedCard;
