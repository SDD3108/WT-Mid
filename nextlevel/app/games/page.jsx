"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/src/common/header/header";
import Footer from "@/src/common/footer/footer";
import { games } from "@/src/data/games";
import "@/app/styles/games.css";


const GamesCatalog = ()=>{
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("q") || "";
  const urlGenre = searchParams.get("genre") || "";
  const genres = ["Action", "Adventure", "RPG", "Strategy", "Racing", "Indie"];
  const platforms = ["PC", "Console", "Mobile"];
  const defaultImage = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="#e8e8e6"/><text x="50%" y="50%" fill="#777"  font-family="Arial" font-size="24" text-anchor="middle">No image</text></svg>'
  );
  const getImage = (path)=>{
    return path?.replace(/^@\/assets\/images\//, "/images/") || defaultImage;
  }
  const handleImageError = (event)=>{
    event.currentTarget.onerror = null;
    event.currentTarget.src = defaultImage;
  }
  const canonicalGenre = genres.find((item) => item.toLowerCase() === urlGenre.trim().toLowerCase()) || "";

  const [search, setSearch] = useState(urlSearch);
  const [genre, setGenre] = useState(canonicalGenre);
  const [platform, setPlatform] = useState("");
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState("popular");
  const [year, setYear] = useState("all");


  useEffect(() => {
    setSearch(urlSearch);
    setGenre(canonicalGenre);
  }, [urlSearch, canonicalGenre]);

  const query = search.trim().toLowerCase();
  const filteredGames = games
    .filter((game) => {
      const matchesSearch = !query || [
        game.title,
        ...game.genre,
        ...game.platform,
      ].some((value) => value?.toLowerCase().includes(query));
      const matchesGenre = !genre || game.genre.some((item) => item.toLowerCase() === genre.toLowerCase());
      const matchesPlatform = !platform || game.platform.includes(platform);
      const releaseYear = Number(game.releaseDate?.slice(0, 4));
      const matchesYear = year === "all" ||
        (year === "earlier" ? releaseYear > 0 && releaseYear < 2025 : releaseYear === Number(year));

      return matchesSearch && matchesGenre && matchesPlatform && game.rating >= rating && matchesYear;
    })
    .sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "title") return a.title.localeCompare(b.title);
      return a.id - b.id;
    });

  function resetFilters() {
    setSearch("");
    setGenre("");
    setPlatform("");
    setRating(0);
    setSort("popular");
    setYear("all");
    if (searchParams.toString()) router.replace("/games", { scroll: false });
  }

  return (
    <div className="games-page">
      <Header />
      <main className="gc-container gc-main" id="games-content">
        <nav className="gc-breadcrumbs" aria-label="Breadcrumb">
          <ol><li><Link href="/">Home</Link></li><li aria-current="page">Games</li></ol>
        </nav>
        <h1>Browse all games</h1>
        <form className="gc-search" role="search" onSubmit={(event) => event.preventDefault()}>
          <input type="search" aria-label="Search games" placeholder="Search games..." value={search} onChange={(event) => setSearch(event.target.value)} />
          <button type="submit">SEARCH</button>
        </form>
        <div className="gc-catalog">
          <aside className="gc-filters" aria-labelledby="filters-title">
            <h2 id="filters-title">Filters</h2>
            <form id="games-filters" onSubmit={(event) => event.preventDefault()}>
              <fieldset>
                <legend>Genre</legend>
                {genres.map((item) => (
                  <label key={item}>
                    <input type="checkbox" name="genre" value={item} checked={genre === item} onChange={(event) => setGenre(event.target.checked ? item : "")} />
                    <span>{item}</span>
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend>Platform</legend>
                {platforms.map((item) => (
                  <label key={item}>
                    <input type="checkbox" name="platform" value={item} checked={platform === item} onChange={(event) => setPlatform(event.target.checked ? item : "")} />
                    <span>{item}</span>
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend>Rating</legend>
                <div className="d-flex gap-3">
                  {[4, 3, 2, 1].map((value) => (
                    <label key={value}>
                      <input type="radio" name="rating" value={value} checked={rating === value} onChange={() => setRating(value)} />
                      <span>{value}+</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>Release year</legend>
                {[{ label: "2026", value: "2026" }, { label: "2025", value: "2025" }, { label: "Earlier", value: "earlier" }].map(({ label, value }) => (
                  <label key={value}>
                    <input type="checkbox" name="year" value={value} checked={year === value} onChange={(event) => setYear(event.target.checked ? value : "all")} />
                    <span>{label}</span>
                  </label>
                ))}
              </fieldset>
              <button className="gc-reset" type="button" id="games-reset" onClick={resetFilters}>Reset filters</button>
            </form>
          </aside>
          <section className="gc-results" aria-label="Game catalog">
            <div className="gc-toolbar">
              <p id="games-count">{filteredGames.length} games found</p>
              <label className="visually-hidden" htmlFor="games-sort">Sort games</label>
              <select id="games-sort" className="games-sort" value={sort} onChange={(event) => setSort(event.target.value)}>
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
                      <img className="gc-card-image w-full object-cover" src={getImage(game.image_horizontal)} alt={game.title} onError={handleImageError} />
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
            {filteredGames.length === 0 && (
              <div className="gc-empty" id="games-empty">
                <h2>No games found</h2>
                <p>Try another search or reset your filters.</p>
                <button className="btn gc-empty-button" id="games-empty-reset" type="button" onClick={resetFilters}>Reset filters</button>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function GamesPage() {
  return <Suspense fallback={
    <div className="games-page">
      <Header />
      <main className="gc-container gc-main">Loading games...</main>
      <Footer />
    </div>
  }>
    <GamesCatalog />
  </Suspense>;
}
