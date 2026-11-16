"use client";

import Link from "next/link";
import Header from "@/src/common/header/header";
import Footer from "@/src/common/footer/footer";
import { useGames } from "@/src/hooks/useGames";
import "@/app/styles/categories+favorites.css";

export default function CategoriesPage() {
  const { games, loading, error } = useGames();
  const categories = [
    { name: "Action", description: "Action game artwork" },
    { name: "Adventure", description: "Adventure game artwork" },
    { name: "RPG", description: "Role-playing game artwork" },
    { name: "Strategy", description: "Strategy game artwork" },
  ];

  return (
    <div>
      <Header />
      <main className="container page-width page-main">
        <nav className="breadcrumb-line" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Categories</span>
        </nav>
        <section aria-labelledby="page-title">
          <h1 id="page-title" className="page-title">Explore by genre</h1>
          <p className="page-intro mt-2">Start with a play style you love, then narrow the catalog to find the right game.</p>
          {loading && <p role="status">Loading categories...</p>}
          {error && <p role="alert">Could not load games: {error}</p>}
          <div className="category-grid mt-4">
            {categories.map(({ name, description }) => {
              const count = games.filter((game) => game.genre.some((item) => item.toLowerCase() === name.toLowerCase())).length;
              return (
                <Link className="category-card" key={name} href={`/games?genre=${encodeURIComponent(name.toLowerCase())}`}>
                  <div className={`category-art art-${name.toLowerCase()}`} role="img" aria-label={description} />
                  <h2>{name}</h2>
                  <div className="category-meta">
                    <span className="category-count">{count} {count === 1 ? "game" : "games"}</span>
                    <span>Browse category <b aria-hidden="true">→</b></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
        <aside className="catalog-cta" aria-labelledby="cta-title">
          <div><h2>Not sure where to start?</h2><p>Browse the complete NextLevel catalog.</p></div>
          <Link className="btn btn-light btn-sm text-black" href="/games">View all games <span aria-hidden="true">→</span></Link>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
