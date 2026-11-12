"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/src/common/header/header";
import Footer from "@/src/common/footer/footer";
import { games } from "@/src/data/games";
import "@/app/styles/categories+favorites.css";


export default function FavoritesPage() {
  const [favoriteGames, setFavoriteGames] = useState([]);

  const fallbackImage = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="#e8e8e6"/><text x="50%" y="50%" fill="#777" font-family="Arial" font-size="24" text-anchor="middle">No image</text></svg>'
  );
  const getImage = (path)=>{
    return path?.replace(/^@\/assets\/images\//, "/images/") || fallbackImage;
  }
  const handleImageError = (event)=>{
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackImage;
  }
  const readFavorites = ()=>{
    const stored = JSON.parse(localStorage.getItem("favoriteGames") || "[]");
    return Array.isArray(stored) ? stored : [];
  }
  
  const GameCard = ({ game, onRemove })=>{
    return (
      <article className="game-card" key={game.id}>
        <Link href={`/games/${game.id}`} className="favorite-game-link">
          <img className="game-art" src={getImage(game.image_horizontal)} alt={`${game.title} cover`} onError={handleImageError} />
          <h3>{game.title}</h3>
          <div className="game-meta">
            <span>{game.genre.join(" · ").toUpperCase()} · {game.platform.join(", ").toUpperCase()}</span>
            <span className="rating"><b aria-hidden="true">★</b> {game.rating}</span>
            {onRemove && <button className="remove-button" type="button" onClick={() => onRemove(game.id)}>Remove</button>}
          </div>
        </Link>
        
      </article>
    );
  }

  useEffect(() => {
    function syncFavorites() { setFavoriteGames(readFavorites()); }
    syncFavorites();
    window.addEventListener("storage", syncFavorites);
    window.addEventListener("favorites-updated", syncFavorites);
    return () => {
      window.removeEventListener("storage", syncFavorites);
      window.removeEventListener("favorites-updated", syncFavorites);
    };
  }, []);

  const totalGames = games.filter((game) => favoriteGames.some((id) => String(id) === String(game.id)));

  function removeFavorite(gameId) {
    const updated = favoriteGames.filter((id) => String(id) !== String(gameId));
    setFavoriteGames(updated);
    localStorage.setItem("favoriteGames", JSON.stringify(updated));
    window.dispatchEvent(new Event("favorites-updated"));
  }

  return (
    <div>
      <Header />
      <main className="container page-width page-main favorites-main">
        <section aria-labelledby="page-title">
          <h1 id="page-title" className="page-title">Your favorites</h1>
          <p className="page-intro"><span id="saved-count">{totalGames.length}</span> saved games <span aria-hidden="true">·</span> Keep a shortlist for your next play session.</p>
          {totalGames.length > 0 ? (
            <div className="game-grid" id="saved-games" aria-live="polite">
              {totalGames.map((game) => <GameCard key={game.id} game={game} onRemove={removeFavorite} />)}
            </div>
          ) : (
            <p className="empty-state" id="empty-state">Your favorites list is empty. Add a game from the catalog to save it here.</p>
          )}
        </section>
        <aside className="favorites-note">
          <span>Favorites are saved to this browser so you can compare games later.</span>
          <strong>Use “Add to favorites” on any game</strong>
        </aside>
        <section className="discover-section" aria-labelledby="discover-title">
          <h2 id="discover-title">More to discover</h2>
          <p className="section-intro">Continue exploring popular picks.</p>
          <div className="game-grid discover-grid">
            {games.filter((game) => !favoriteGames.some((id) => String(id) === String(game.id))).slice(0, 4).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
