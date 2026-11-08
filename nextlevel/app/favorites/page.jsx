"use client"
import React from 'react'
import Header from "@/src/common/header/header";
import Footer from "@/src/common/footer/footer";
import { useState, useEffect } from "react";
import {games} from "@/src/data/games";
import "@/app/styles/categories+favorites.css";

const FavoritesPage = () => {
  const [favoriteGames, setFavoriteGames] = useState([]);

  useEffect(()=>{
    const stored = JSON.parse(localStorage.getItem("favoriteGames") || "[]");
    setFavoriteGames(stored);
  },[]);
  const totalGames = games.filter((game) => favoriteGames.some((id) => String(id) == String(game.id)));
  return (
    <div>
      <Header/>
      <main className="container page-width page-main">
        <section aria-labelledby="page-title">
          <h1 id="page-title" className="page-title">Your favorites</h1>
          <p className="page-intro">
            <span id="saved-count">0</span> saved games 
            <span aria-hidden="true">·</span> Keep a shortlist for your next play session.
          </p>
          <div className="game-grid" id="saved-games" aria-live="polite"></div>
          <p className="empty-state" id="empty-state" hidden>Your favorites list is empty. Add a game from the catalog to save it here.</p>
        </section>
        <aside className="favorites-note">
          {totalGames.length > 0 ? 
            totalGames.map((game) => (
              <article className="game-card w-1/4" key={game.id}>
                <a href={game.href}>
                  <div className="game-art game-art-5" role="img" aria-label="Snowy mountain rally course"></div>
                  <h3>{game.title}</h3>
                  <div className="game-meta">
                    <span>{game.genre.join(" · ").toUpperCase()} {game.platform.join(",").toUpperCase()}</span>
                    <span className="rating"><b aria-hidden="true">★</b> {game.rating}</span>
                  </div>
                </a>
              </article>
            ))
          : (
            <>
              <span>Favorites are saved to this list so you can compare games later.</span>
              <strong>Use “Add to favorites” on any game</strong>
            </>
           
          )}
          
        </aside>
        <section className="discover-section" aria-labelledby="discover-title">
          <h2 id="discover-title">More to discover</h2><p className="section-intro">Continue exploring popular picks.</p>
          <div className="game-grid discover-grid">
            {games.length > 0 ? games.slice(0, 4).map((game) => (
              <article className="game-card" key={game.id}>
                <a href={game.href}>
                  <img
                    className={`game-art game-art-${game.id} object-cover w-full`}
                    src={game.image_horizontal || "/assets/images/default.jpg"}
                    alt={game.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/assets/images/default.jpg";
                    }}
                  />
                  <h3>{game.title}</h3>
                  <div className="game-meta">
                    <span>{game.genre.join(" · ").toUpperCase()} {game.platform.join(",").toUpperCase()}</span>
                    <span className="rating"><b aria-hidden="true">★</b> {game.rating}</span>
                  </div>
                </a>
              </article>
            )) : (
              <>
                <article className="game-card">
                  <a href="/games/6">
                    <div className="game-art game-art-5" role="img" aria-label="Snowy mountain rally course"></div>
                    <h3>Summit Rally</h3>
                    <div className="game-meta">
                      <span>Racing PC</span>
                      <span className="rating"><b aria-hidden="true">★</b> 4.6</span>
                    </div>
                  </a>
                </article>
                <article className="game-card">
                  <a href="games/7">
                    <div className="game-art game-art-6" role="img" aria-label="Moonlit valley"></div>
                    <h3>Moonlit Vale</h3>
                    <div className="game-meta">
                      <span>RPG · Indie PC</span>
                      <span className="rating"><b aria-hidden="true">★</b> 4.6</span>
                    </div>
                  </a>
                </article>
                <article className="game-card">
                  <a href="games/8">
                    <div className="game-art game-art-7" role="img" aria-label="Retro pixel landscape"></div>
                    <h3>Pixel Quest</h3>
                    <div className="game-meta">
                      <span>Adventure · Indie PC</span>
                      <span className="rating"><b aria-hidden="true">★</b> 4.6</span>
                    </div>
                  </a>
                </article>
                <article className="game-card">
                  <a href="games/5">
                    <div className="game-art game-art-8" role="img" aria-label="Bright open sky above floating islands"></div>
                    <h3>Kingdom Tactics</h3>
                    <div className="game-meta">
                      <span>Strategy PC</span>
                      <span className="rating"><b aria-hidden="true">★</b> 4.6</span>
                    </div>
                  </a>
                </article>
              </>
            )}
            
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  )
}

export default FavoritesPage