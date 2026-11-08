"use client";
import React from 'react'
import Header from "@/src/common/header/header";
import Footer from "@/src/common/footer/footer";
import "@/app/styles/games.css";
import { useState } from 'react';
import { games } from '@/src/data/games';
import Link from 'next/link';

const GamesPage = () => {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState("popular");
  const [year, setYear] = useState(0);

  const filteredGames = games
    .filter((game) =>
      game.title.toLowerCase().includes(search.toLowerCase()) && (genre == "" || game.genre.includes(genre)) && (platform == "" || game.platform.includes(platform)) &&
      game.rating >= rating && (year == 0 || Number(game.releaseDate?.slice(0, 4)) == year)
    )
    .sort((a, b) => {
      if(sort == "rating"){
        return b.rating - a.rating;
      }
      if(sort == "title"){
        return a.title.localeCompare(b.title);
      }
      return a.id - b.id;
    });

  const resetFilters = () => {
    setSearch("");
    setGenre("");
    setPlatform("");
    setRating(0);
    setSort("popular");
    setYear(0)
  };
  const defaultImage = "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="#e8e8e6"/><text x="50%" y="50%" fill="#777" font-family="Arial" font-size="24" text-anchor="middle">No image</text></svg>'
  );
  const getImage = (path)=>{
    if (!path) return defaultImage;
    return path.replace("@/assets/images/", "/images/");
  };

  const imageError = (e)=>{
    e.currentTarget.onerror = null;
    e.currentTarget.src = defaultImage;
  };
  return (
    <div className='games-page'>
      <Header/>
      <main className="gc-container gc-main" id="games-content">
        <nav className="gc-breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li aria-current="page">Games</li>
          </ol>
        </nav>
        <h1>Browse all games</h1>
        <form className="gc-search" onSubmit={(e) => e.preventDefault()}>
          <input
            type="search"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">SEARCH</button>
        </form>
        <div className="gc-catalog">
          <aside className="gc-filters" aria-labelledby="filters-title">
            <h2 id="filters-title">Filters</h2>
            <form id="games-filters">
              <fieldset>
                <legend>Genre</legend>
                <label>
                  <input type="checkbox" name="genre" value="Action" checked={genre == "Action"} onChange={(e) => setGenre(e.target.checked ? "Action" : "")}/>
                  <span>Action</span>
                </label>
                <label>
                  <input type="checkbox" name="genre" value="Adventure"
                  checked={genre == "Adventure"} onChange={(e) => setGenre(e.target.checked ? "Adventure" : "")}
                  />
                  <span>Adventure</span>
                </label>
                <label>
                  <input type="checkbox" name="genre" value="RPG"
                  checked={genre == "RPG"} onChange={(e) => setGenre(e.target.checked ? "RPG" : "")}
                  />
                  <span>RPG</span>
                </label>
                <label>
                  <input type="checkbox" name="genre" value="Strategy"
                  checked={genre == "Strategy"} onChange={(e) => setGenre(e.target.checked ? "Strategy" : "")}
                  />
                  <span>Strategy</span>
                </label>
              </fieldset>
              <fieldset>
                <legend>Platform</legend>
                <label>
                  <input type="checkbox" name="platform" value="PC"
                  checked={platform == "PC"} onChange={(e) => setPlatform(e.target.checked ? "PC" : "")}
                  />
                  <span>PC</span>
                </label>
                <label>
                  <input type="checkbox" name="platform" value="Console"
                  checked={platform == "Console"} onChange={(e) => setPlatform(e.target.checked ? "Console" : "")}
                  />
                  <span>Console</span>
                </label>
                <label>
                  <input type="checkbox" name="platform" value="Mobile"
                  checked={platform == "Mobile"} onChange={(e) => setPlatform(e.target.checked ? "Mobile" : "")}
                  />
                  <span>Mobile</span>
                </label>
              </fieldset>
              <fieldset>
                <legend>Rating</legend>
                <div className="d-flex gap-3">
                  <label>
                    <input type="radio" name="rating" value="4" checked={rating == 4} onChange={() => setRating(4)}/>
                    <span>4+</span>
                  </label>
                  <label>
                    <input type="radio" name="rating" value="3" checked={rating == 3} onChange={() => setRating(3)}/>
                    <span>3+</span>
                  </label>
                  <label>
                    <input type="radio" name="rating" value="2" checked={rating == 2} onChange={() => setRating(2)}/>
                    <span>2+</span>
                  </label>
                  <label>
                    <input type="radio" name="rating" value="1" checked={rating == 1} onChange={() => setRating(1)}/>
                    <span>1+</span>
                  </label>
                </div>
              </fieldset>
              <fieldset>
                <legend>Release year</legend>
                <label>
                  <input type="checkbox" name="year" value="2026" checked={year == 2026} onChange={(e) => setYear(e.target.checked ? 2026 : 0)} />
                  <span>2026</span>
                </label>
                <label>
                  <input type="checkbox" name="year" value="2025" checked={year == 2025} onChange={(e) => setYear(e.target.checked ? 2025 : 0)}/>
                  <span>2025</span>
                </label>
                <label>
                  <input type="checkbox" name="year" value="earlier"
                  checked={year == "earlier"} onChange={(e) => setYear(e.target.checked ? "earlier" : "1")}
                  />
                  <span>Earlier</span>
                </label>
              </fieldset>
              <button className="gc-reset" type="button" id="games-reset" onClick={resetFilters}>Reset filters</button>
            </form>
          </aside>
          <section className="gc-results" aria-label="Game catalog">
            <div className="gc-toolbar">
            <p id="games-count">{filteredGames.length} games found</p>
              <label className="visually-hidden">Sort games</label>
              <select className='games-sort' value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="popular">Most popular</option>
                <option value="rating">Highest rated</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
            <div className="gc-grid">
              <div className="row gc-cards" id="games-list">
                {filteredGames.map((game) => (
                  <article className="col-12 col-sm-6 col-lg-4" key={game.id}>
                    <Link href={`/games/${game.id}`} className="gc-card">
                      <img
                        className="gc-card-image w-full object-cover"
                        src={getImage(game.image_horizontal)}
                        alt={game.title}
                        onError={imageError}
                      />
                      <h3 className="gc-card-title">{game.title}</h3>
                      <div className="gc-card-meta">
                        <span>{game.genre.join(" · ")} · {game.platform.join(", ")}</span>
                        <span className="gc-card-rating">★ {game.rating}</span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
            <div className="gc-empty" id="games-empty" hidden>
              <h2>No games found</h2>
              <p>Try another search or reset your filters.</p>
              <button className="btn gc-empty-button" id="games-empty-reset" type="button" onClick={resetFilters}>Reset filters</button>
            </div>
            <nav className="gc-pagination" id="games-pagination" aria-label="Catalog pages"></nav>
          </section>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default GamesPage
