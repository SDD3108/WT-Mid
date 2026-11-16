"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import Header from "@/src/common/header/header";
import Footer from "@/src/common/footer/footer";
import { useGames } from "@/src/hooks/useGames";
import { apiFetch } from "@/src/lib/api";
import "@/app/styles/game.css";

// Keep the URL-dependent hook below a Suspense boundary. Next.js 16 with
// cacheComponents cannot prerender useParams() outside of Suspense.
function GamePageContent() {
  const { id } = useParams();
  const { games, loading, error } = useGames();
  const game = games.find((item) => String(item.id) === String(id));
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [favoriteLoading, setFavoriteLoading] = useState(true);
  const [favoriteError, setFavoriteError] = useState("");
  const [saving, setSaving] = useState(false);
  const isFavorite = game ? favoriteGames.includes(game.id) : false;

  useEffect(() => {
    let active = true;
    apiFetch("/favorites")
      .then((ids) => { if (active) setFavoriteGames(ids); })
      .catch((err) => { if (active) setFavoriteError(err.message); })
      .finally(() => { if (active) setFavoriteLoading(false); });
    return () => { active = false; };
  }, []);

  async function toggleFavorite() {
    if (!game || saving) return;
    setSaving(true);
    setFavoriteError("");
    try {
      const ids = await apiFetch(`/favorites/${game.id}`, {
        method: isFavorite ? "DELETE" : "POST",
      });
      setFavoriteGames(ids);
      window.dispatchEvent(new Event("favorites-updated"));
    } catch (err) {
      setFavoriteError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="game-page"><Header /><main className="gd-container gd-main">Loading game...</main><Footer /></div>;
  }
  if (error) {
    return <div className="game-page"><Header /><main className="gd-container gd-main" role="alert">Could not load game: {error}</main><Footer /></div>;
  }
  if (!game) notFound();

  const relatedGames = games.filter((item) => item.id !== game.id)
    .map((item) => ({
      ...item,
      matches: item.genre.filter((genre) => game.genre.includes(genre)).length,
    }))
    .sort((a, b) => b.matches - a.matches)
    .slice(0, 4);

  const defaultImage = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="#e8e8e6"/><text x="50%" y="50%" fill="#777" font-family="Arial" font-size="24" text-anchor="middle">No image</text></svg>'
  );
  const getImage = (path) => path?.replace("@/assets/images/", "/images/") || defaultImage;
  const imageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = defaultImage;
  };

  return (
    <div className="game-page">
      <Header />
      <main className="gd-container gd-main" id="game-content" data-game-id={game.id}>
        <nav className="gd-breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/games">Games</Link></li>
            <li id="game-breadcrumb" aria-current="page">{game.title}</li>
          </ol>
        </nav>
        <section className="gd-hero" aria-labelledby="game-title">
          <img className="gd-placeholder gd-cover w-full object-cover" src={getImage(game.image_vertical)} alt={`${game.title} cover`} onError={imageError} />
          <div className="gd-summary">
            <p className="gd-eyebrow" id="game-genres">{game.genre.join(" · ").toUpperCase()}</p>
            <h1 id="game-title">{game.title}</h1>
            <div className="gd-rating">
              <span className="gd-rating-value"><span className="gd-star" aria-hidden="true">★</span>
                <span id="game-rating" aria-label={`${game.rating} out of 5`}>{game.rating}</span>
              </span>
              {game.ratingCount && <span>{game.ratingCount.toLocaleString("en-US")} ratings</span>}
            </div>
            <p className="gd-description" id="game-description">{game.description}</p>
            <ul className="gd-platforms" id="game-platforms" aria-label="Available platforms">
              {game.platform.map((platform) => <li key={platform}>{platform}</li>)}
            </ul>
            <div>
              <button className="btn gd-favorite-button" id="favorite-button" type="button"
                disabled={favoriteLoading || saving} aria-pressed={isFavorite} onClick={toggleFavorite}>
                {saving ? "SAVING..." : isFavorite ? "REMOVE FROM FAVORITES" : "ADD TO FAVORITES"}
              </button>
              <p className="gd-feedback" id="favorite-feedback" role="status" aria-live="polite">
                {favoriteError && `Could not save favorite: ${favoriteError}`}
              </p>
            </div>
          </div>
        </section>
        <section className="gd-details" aria-labelledby="about-game-title">
          <div className="gd-about">
            <h2 id="about-game-title">About this game</h2>
            <p id="game-about">{game.about}</p>
            <h3>What to expect</h3>
            <ul>{(game.features || []).map((feature) => <li key={feature}>{feature}</li>)}</ul>
          </div>
          <aside className="gd-information" aria-labelledby="game-information-title">
            <h3 id="game-information-title">Game information</h3>
            <table>
              <caption className="visually-hidden">{game.title} game information</caption>
              <tbody>
                <tr><th scope="row">Developer</th><td>{game.developer ?? "Not specified"}</td></tr>
                <tr><th scope="row">Publisher</th><td>{game.publisher ?? "Not specified"}</td></tr>
                <tr><th scope="row">Release</th><td>
                  {game.releaseDate ? <time dateTime={game.releaseDate}>{game.releaseLabel || game.releaseDate}</time> : "Not specified"}
                </td></tr>
                <tr><th scope="row">Genres</th><td>{game.genre.join(", ")}</td></tr>
                <tr><th scope="row">Modes</th><td>{game.modes ?? "Not specified"}</td></tr>
              </tbody>
            </table>
          </aside>
        </section>
        <section className="gd-section" aria-labelledby="screenshots-title">
          <h2 id="screenshots-title">Screenshots</h2>
          <div className="row gd-row">
            {[0, 1, 2].map((index) => (
              <div className="col-12 col-md-4" key={index}>
                <img className="gd-placeholder gd-screenshot w-full object-cover"
                  src={getImage(game.screenshots?.[index])} alt={`${game.title} screenshot ${index + 1}`} onError={imageError} />
              </div>
            ))}
          </div>
        </section>
        <section className="gd-section" aria-labelledby="related-title">
          <h2 id="related-title">Related games</h2>
          <div className="row gd-row">
            {relatedGames.map((related) => (
              <article className="col-12 col-sm-6 col-lg-3" key={related.id}>
                <Link className="gd-card" href={`/games/${related.id}`} aria-label={`View ${related.title}`}>
                  <img className="gd-placeholder gd-card-image w-full object-cover"
                    src={getImage(related.image_horizontal)} alt={related.title} onError={imageError} />
                  <h3>{related.title}</h3>
                  <div className="gd-card-meta">
                    <span>{related.genre.join(", ")} · {related.platform.join(", ")}</span>
                    <span className="gd-card-rating"><span aria-hidden="true">★</span> {related.rating}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="game-page">
        <header className="home-header">
          <nav className="navbar home-shell" aria-label="Main navigation">
            <Link className="home-brand" href="/">NextLevel</Link>
          </nav>
        </header>
        <main className="gd-container gd-main" role="status">Loading game...</main>
      </div>
    }>
      <GamePageContent />
    </Suspense>
  );
}
