import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function ProductCard({ product, onOpenMap }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let active = true;
    api
      .reviews(product.store_id)
      .then((data) => {
        if (active) setReviews(data.slice(0, 2));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [product.store_id]);

  return (
    <article className="card">
      {product.image ? (
        <img src={product.image} alt={product.title} className="card-image" />
      ) : (
        <div className="card-image card-image-placeholder">No image</div>
      )}
      <div className="card-body">
        <h3 className="card-title">{product.title}</h3>
        <p className="card-desc">{product.description}</p>
        <div className="card-meta">
          <span className="card-store">{product.store_name}</span>
          <span className="card-city">{product.city}</span>
        </div>
        {product.phone ? (
          <div className="card-phone">📞 {product.phone}</div>
        ) : null}
        <div className="card-price-row">
          <span className="card-price">
            {product.price} €{product.unit ? `/${product.unit}` : ""}
          </span>
          <button
            className="map-button"
            onClick={() => onOpenMap(product)}
            title="View on map"
            aria-label="View on map"
          >
            📍
          </button>
        </div>
        {reviews.length > 0 ? (
          <ul className="card-reviews">
            {reviews.map((review) => (
              <li key={review.id}>
                <span className="stars">{"★".repeat(review.estrellas)}</span>{" "}
                {review.comentario}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
