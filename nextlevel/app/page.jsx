"use client";

import Link from "next/link";
import Header from "@/src/common/header/header";
import Footer from "@/src/common/footer/footer";
import { games } from "@/src/data/games";
import "@/app/styles/home.css";
import "@/app/styles/genre-cards.css";


export default function Home() {
  const featuredGames = games.filter((game) => game.category == "featured");
  const trendingGames = games.filter((game) => game.category == "trending");
  const genreCards = [
    {
      name:"Action",
      image: "/images/action.png",
    },
    {
      name:"Adventure",
      image: "/images/adventure.png",
    },
    {
      name:"RPG",
      image: "/images/rpg.png",
    },
    {
      name:"Strategy",
      image: "/images/strategy.png",
    },
    {
      name:"Racing",
      image: "/images/carx-street-h-cover.png",
    },
    {
      name:"Indie",
      image: "/images/sea-of-stars-h-cover.png",
    },
  ];
  const fallbackImage = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="#e8e8e6"/><text x="50%" y="50%" fill="#777" font-family="Arial" font-size="24" text-anchor="middle">No image</text></svg>'
  );
  const getImage = (path) => path?.replace(/^@\/assets\/images\//, "/images/") || fallbackImage;
  const imageError = (event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackImage; };
  
  const GameRow = ({ items, type })=>{
    return (
      <div className={`row games-row ${type}-row`}>
        {items.map((game) => (
          <article className="col-12 col-sm-6 col-lg-3" key={game.id} data-game-card>
            <Link className="game-card" href={`/games/${game.id}`} aria-label={`View ${game.title}`}>
              <div className="game-art overflow-hidden">
                <img src={getImage(game.image_horizontal)} alt={game.title} onError={imageError} className="block h-full w-full object-cover" />
              </div>
              <h3>{game.title}</h3>
              <div className="game-meta">
                <span>{game.genre.join(" · ")} · {game.platform.join(", ")}</span>
                <span className="game-rating" aria-label={`Rating: ${game.rating} out of 5`}>★ {game.rating}</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    );
  }
  return (
    <>
      <Header />
      <main className="home-shell home-content" id="main-content">
        <section className="discovery-hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-eyebrow">FIND YOUR NEXT GAME</p>
            <h1 id="hero-title">What will you play next?</h1>
            <p className="hero-description">Search by title, genre, platform, or mood and discover a game worth saving.</p>
            <form className="hero-search" role="search" action="/games" method="get">
              <label className="visually-hidden" htmlFor="hero-query">Search games, genres, topics</label>
              <input id="hero-query" name="q" type="search" placeholder="Search games, genres, topics…" maxLength={100} />
              <button className="btn" type="submit">SEARCH</button>
            </form>
          </div>
          <div className="hero-art overflow-hidden" aria-hidden="true">
            <img src={getImage(featuredGames[0]?.image_horizontal)} onError={imageError} alt="" className="block h-full w-full object-cover" />
          </div>
        </section>

        <section className="home-section" aria-labelledby="featured-title">
          <div className="section-heading"><h2 id="featured-title">Featured games</h2><p>Editor picks to start your search.</p></div>
          <GameRow items={featuredGames} type="featured" />
        </section>

        <section className="home-section" aria-labelledby="genres-title">
          <div className="section-heading"><h2 id="genres-title">Browse by genre</h2></div>
          <div className="genre-grid">
            {genreCards.map(({ name, image }) => (
              <Link key={name} className="genre-link genre-card-filled" href={`/games?genre=${name.toLowerCase()}`} aria-label={`Browse ${name} games`}>
                <img src={image} alt="" loading="lazy" onError={imageError} />
                <span>{name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-section" aria-labelledby="trending-title">
          <div className="section-heading"><h2 id="trending-title">Trending now</h2></div>
          <GameRow items={trendingGames} type="trending" />
        </section>
      </main>
      <Footer />
    </>
  );
}
