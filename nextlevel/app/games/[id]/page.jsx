"use client";
import { useState, useEffect,Suspense } from "react";
import Link from "next/link";
import { notFound,useParams } from "next/navigation";
import Header from "@/src/common/header/header";
import Footer from "@/src/common/footer/footer";
import { games } from "@/src/data/games";
import "@/app/styles/game.css";

export default function GamesPage() {
  return (
    <Suspense fallback={<p>Loading game...</p>}>
      <GameContent />
    </Suspense>
  );
}
const GameContent = ()=>{
  const { id } = useParams();
  const game = games.find((item) => String(item.id) == id);
  console.log(`games: ${games}`);
  
  const [favoriteGames, setFavoriteGames] = useState([]);
  const isFavorite = game ? favoriteGames.some((id) => String(id) === String(game.id)) : false;
  console.log(favoriteGames);
  
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favoriteGames") || "[]");
    setFavoriteGames(stored);
  }, []);
  
  if(!game){
    notFound();
  }
  const relatedGames = games.filter((item) => item.id !== game.id)
    .map((item) => ({
      ...item,
      matches: item.genre.filter((genre) => game.genre.includes(genre)).length,
    }))
    .sort((a, b) => b.matches - a.matches)
    .slice(0, 4);
  const AddToFavorites = ()=>{
    const updatedFavorites = isFavorite ? favoriteGames.filter((id) => String(id) !== String(game.id)) : [...favoriteGames, game.id];
  
    setFavoriteGames(updatedFavorites);
  
    localStorage.setItem("favoriteGames",JSON.stringify(updatedFavorites));
  };
  const defaultImage =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="#e8e8e6"/  ><text x="50%" y="50%" fill="#777" font-family="Arial" font-size="24" text-anchor="middle">No image</text></svg>'
    );

  const getImage = (path)=>{
    if (!path) return defaultImage;
    return path.replace("@/assets/images/", "/images/");
  };
  const imageError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = defaultImage;
  };
  return (
    <div className="game-page">
      <Header />

      <main
        className="gd-container gd-main"
        id="game-content"
        data-game-id={game.id}
      >
        <nav className="gd-breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/games">Games</Link>
            </li>
            <li id="game-breadcrumb" aria-current="page">
              {game.title}
            </li>
          </ol>
        </nav>

        <section className="gd-hero" aria-labelledby="game-title">
          <img
            className="gd-placeholder gd-cover w-full object-cover"
            src={getImage(game.image_vertical)}
            alt={`${game.title} cover`}
            onError={imageError}
          />

          <div className="gd-summary">
            <p className="gd-eyebrow" id="game-genres">
              {game.genre.join(" · ").toUpperCase()}
            </p>

            <h1 id="game-title">{game.title}</h1>

            <div className="gd-rating">
              <span className="gd-rating-value">
                <span className="gd-star" aria-hidden="true">
                  ★
                </span>
                <span
                  id="game-rating"
                  aria-label={`${game.rating} out of 5`}
                >
                  {game.rating}
                </span>
              </span>

              {game.ratingCount && (
                <span>
                  {game.ratingCount.toLocaleString("en-US")} ratings
                </span>
              )}
            </div>

            <p className="gd-description" id="game-description">
              {game.description}
            </p>

            <ul
              className="gd-platforms"
              id="game-platforms"
              aria-label="Available platforms"
            >
              {game.platform.map((platform) => (
                <li key={platform}>{platform}</li>
              ))}
            </ul>

            <div>
              <button
                className="btn gd-favorite-button"
                id="favorite-button"
                type="button"
                aria-pressed={isFavorite}
                onClick={AddToFavorites}
              >
                {isFavorite ? "REMOVE FROM FAVORITES" : "ADD TO FAVORITES"}
              </button>
              <p className="gd-feedback" id="favorite-feedback" role="status" aria-live="polite"></p>
            </div>
          </div>
        </section>

        <section className="gd-details" aria-labelledby="about-game-title">
          <div className="gd-about">
            <h2 id="about-game-title">About this game</h2>

            <p id="game-about">{game.about}</p>

            <h3>What to expect</h3>

            <ul>
              {game.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>

          <aside className="gd-information" aria-labelledby="game-information-title">
            <h3 id="game-information-title">Game information</h3>
            <table>
              <caption className="visually-hidden">
                {game.title} game information
              </caption>
              <tbody>
                <tr>
                  <th scope="row">Developer</th>
                  <td id="game-developer">
                    {game.developer ?? "Not specified"}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Publisher</th>
                  <td id="game-publisher">
                    {game.publisher ?? "Not specified"}
                  </td>
                </tr>

                <tr>
                  <th scope="row">Release</th>
                  <td>
                    {game.releaseDate ? (
                      <time
                        id="game-release"
                        dateTime={game.releaseDate}
                      >
                        {game.releaseLabel}
                      </time>
                    ) : (
                      "Not specified"
                    )}
                  </td>
                </tr>

                <tr>
                  <th scope="row">Genres</th>
                  <td id="game-information-genres">
                    {game.genre.join(", ")}
                  </td>
                </tr>

                <tr>
                  <th scope="row">Modes</th>
                  <td id="game-modes">
                    {game.modes ?? "Not specified"}
                  </td>
                </tr>
              </tbody>
            </table>
          </aside>
        </section>

        <section className="gd-section" aria-labelledby="screenshots-title">
          <h2 id="screenshots-title">Screenshots</h2>

          <div className="row gd-row">
            <div className="row gd-row">
              {[0, 1, 2].map((index) => (
                <div className="col-12 col-md-4" key={index}>
                  <img
                    className="gd-placeholder gd-screenshot w-full object-cover"
                    src={getImage(game.screenshots?.[index])}
                    alt={`${game.title} screenshot ${index + 1}`}
                    onError={imageError}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="gd-section" aria-labelledby="related-title">
          <h2 id="related-title">Related games</h2>

          <div className="row gd-row">
            {relatedGames.map((related) => (
              <article
                className="col-12 col-sm-6 col-lg-3"
                key={related.id}
              >
                <Link
                  className="gd-card"
                  href={`/games/${related.id}`}
                  aria-label={`View ${related.title}`}
                >
                  <img
                    className="gd-placeholder gd-card-image w-full object-cover"
                    src={getImage(related.image_horizontal)}
                    alt={related.title}
                    onError={imageError}
                  />

                  <h3>{related.title}</h3>

                  <div className="gd-card-meta">
                    <span>
                      {related.genre.join(", ")} ·{" "}
                      {related.platform.join(", ")}
                    </span>

                    <span className="gd-card-rating">
                      <span aria-hidden="true">★</span>
                      <span
                        aria-label={`${related.rating} out of 5`}
                      >
                        {related.rating}
                      </span>
                    </span>
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