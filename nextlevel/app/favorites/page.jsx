"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/src/common/header/header";
import Footer from "@/src/common/footer/footer";
import { useGames } from "@/src/hooks/useGames";
import { apiFetch } from "@/src/lib/api";
import "@/app/styles/categories+favorites.css";

function GameCard({ game, onRemove }) {
  const fallbackImage = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="#e8e8e6"/><text x="50%" y="50%" fill="#777" font-family="Arial" font-size="24" text-anchor="middle">No image</text></svg>'
  );
  const image = game.image_horizontal?.replace(/^@\/assets\/images\//, "/images/") || fallbackImage;
  const handleImageError = (event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackImage; };

  return (
    <article className="game-card">
      <Link href={`/games/${game.id}`} className="favorite-game-link">
        <img className="game-art" src={image} alt={`${game.title} cover`} onError={handleImageError} />
        <h3>{game.title}</h3>
        <div className="game-meta">
          <span>{game.genre.join(" · ").toUpperCase()} · {game.platform.join(", ").toUpperCase()}</span>
          <span className="rating"><b aria-hidden="true">★</b> {game.rating}</span>
        </div>
      </Link>
      {onRemove && <button className="remove-button" type="button" onClick={() => onRemove(game.id)}>Remove</button>}
    </article>
  );
}

export default function FavoritesPage() {
  const { games, loading: gamesLoading, error: gamesError } = useGames();
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadFavorites() {
      try {
        const ids = await apiFetch("/favorites");
        if (active) { setFavoriteGames(ids); setError(""); }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadFavorites();
    window.addEventListener("favorites-updated", loadFavorites);
    return () => { active = false; window.removeEventListener("favorites-updated", loadFavorites); };
  }, []);

  const savedGames = games.filter((game) => favoriteGames.includes(game.id));

  async function removeFavorite(gameId) {
    try {
      const ids = await apiFetch(`/favorites/${gameId}`, { method: "DELETE" });
      setFavoriteGames(ids);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <Header />
      <main className="container page-width page-main favorites-main">
        <section aria-labelledby="page-title">
          <h1 id="page-title" className="page-title">Your favorites</h1>
          <p className="page-intro"><span id="saved-count">{savedGames.length}</span> saved games <span aria-hidden="true">·</span> Keep a shortlist for your next play session.</p>
          {(loading || gamesLoading) && <p role="status">Loading favorites...</p>}
          {(error || gamesError) && <p role="alert">Could not load favorites: {error || gamesError}</p>}
          {!loading && !gamesLoading && !error && !gamesError && (savedGames.length ? (
            <div className="game-grid" id="saved-games" aria-live="polite">
              {savedGames.map((game) => <GameCard key={game.id} game={game} onRemove={removeFavorite} />)}
            </div>
          ) : (
            <p className="empty-state" id="empty-state">Your favorites list is empty. Add a game from the catalog to save it here.</p>
          ))}
        </section>
        <aside className="favorites-note">
          <span>Favorites are saved in MongoDB and shared by this demo project.</span>
          <strong>Use “Add to favorites” on any game</strong>
        </aside>
        <section className="discover-section" aria-labelledby="discover-title">
          <h2 id="discover-title">More to discover</h2>
          <p className="section-intro">Continue exploring popular picks.</p>
          <div className="game-grid discover-grid">
            {games.filter((game) => !favoriteGames.includes(game.id)).slice(0, 4).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
