import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

const DONATE_URL = "https://github.com/sponsors/MohamedYassineBenomar";

function FeaturedCard({ product }) {
  return (
    <article className="featured-card">
      {product.image ? (
        <img src={product.image} alt={product.title} />
      ) : (
        <div className="featured-image-placeholder">No image</div>
      )}
      <div className="featured-body">
        <h3>{product.title}</h3>
        <p className="featured-desc">{product.description}</p>
        <div className="featured-meta">
          <span>{product.city}</span>
          {product.phone ? <span>📞 {product.phone}</span> : null}
        </div>
        <div className="featured-price">
          {product.price} €{product.unit ? `/${product.unit}` : ""}
        </div>
      </div>
    </article>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    let active = true;
    api
      .products()
      .then((data) => {
        if (active) setFeatured(data.slice(0, 3));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="landing">
      <section className="hero">
        <h1>Mercat Local</h1>
        <p className="hero-tagline">
          A free, community-driven platform that connects people with local
          food sellers across Spain — supporting the local economy and
          sustainable consumption.
        </p>
        <div className="hero-buttons">
          {user ? (
            <>
              <Link to="/products" className="btn-white">
                Browse products
              </Link>
              <Link to="/profile" className="btn-outline-white">
                My profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-white">
                Login
              </Link>
              <Link to="/register" className="btn-outline-white">
                Sign up
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="sustain">
        <h2>A free and sustainable project for the community</h2>
        <p className="section-lead">
          Mercat Local is 100% free, open source and community-driven. Anyone
          — neighbours, small businesses, local groups — can use it without
          paying anything.
        </p>
        <div className="card-row">
          <article className="feature-card">
            <h3>100% Free</h3>
            <p>
              No cost for shoppers or sellers. Local-commerce technology
              accessible to everyone, with no fees and no hidden subscriptions.
            </p>
          </article>
          <article className="feature-card">
            <h3>Open Source</h3>
            <p>
              The whole codebase is public. The community can review it,
              contribute to it and adapt it to their own neighbourhood.
            </p>
          </article>
          <article className="feature-card">
            <h3>Local Impact</h3>
            <p>
              Every local purchase cuts transport emissions, supports families
              and strengthens the proximity economy of your city.
            </p>
          </article>
        </div>
      </section>

      <section className="donate">
        <h2>Help us keep the project alive</h2>
        <p className="section-lead">
          Donations cover servers, maintenance and ongoing development so the
          platform stays free for everyone, forever.
        </p>
        <a
          className="donate-btn"
          href={DONATE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Make a donation
        </a>
      </section>

      <section className="sdg">
        <h2>Sustainable Development Goals</h2>
        <div className="card-row">
          <article className="sdg-card">
            <h3>SDG 11 — Sustainable Cities</h3>
            <p>
              Promoting local commerce shortens supply chains, reduces transport
              inside our cities and makes neighbourhoods more self-sufficient
              and resilient.
            </p>
          </article>
          <article className="sdg-card">
            <h3>SDG 12 — Responsible Consumption</h3>
            <p>
              Connecting consumers directly with local producers cuts
              intermediaries, reduces food waste and encourages buying only
              what's truly needed, in season.
            </p>
          </article>
        </div>
      </section>

      <section className="featured">
        <h2>Featured Items</h2>
        {featured.length === 0 ? (
          <p className="featured-empty">
            No items available yet. Be the first to add one!
          </p>
        ) : (
          <div className="card-row">
            {featured.map((product) => (
              <FeaturedCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
