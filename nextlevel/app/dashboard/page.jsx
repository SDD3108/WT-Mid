"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/src/common/header/header";
import Footer from "@/src/common/footer/footer";
import { useGames } from "@/src/hooks/useGames";
import { apiFetch } from "@/src/lib/api";
import { loadCollections, saveCollections, COLLECTIONS_UPDATED_EVENT } from "@/src/utils/collectionStorage.js";
import { readReviews, REVIEWS_STORAGE_KEY, REVIEWS_UPDATED_EVENT } from "@/src/utils/reviewStorage";
import { calculateDashboardStats } from "@/src/utils/dashboardStats";
import "@/app/styles/dashboard.css";

const COLLECTIONS_STORAGE_KEY = "nextlevel-collections";

function StatCard({ label, value, detail, icon }) {
  return (
    <article className="dashboard-stat-card">
      <div className="dashboard-stat-head"><span>{label}</span><span className="dashboard-stat-icon" aria-hidden="true">{icon}</span></div>
      <strong className="dashboard-stat-number">{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

export default function DashboardPage() {
  const { games, loading: gamesLoading, error: gamesError } = useGames();
  const [collections, setCollections] = useState({ want: [], completed: [] });
  const [reviews, setReviews] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [reviewsError, setReviewsError] = useState("");
  const [collectionsSyncError, setCollectionsSyncError] = useState("");

  useEffect(() => {
    let active = true;
    const refresh = () => {
      if (!active) return;
      setCollections(loadCollections());
      const result = readReviews();
      setReviews(result.reviews);
      setReviewsError(result.error);
      setLoaded(true);
    };
    const onStorage = (event) => {
      if (event.key === REVIEWS_STORAGE_KEY || event.key === COLLECTIONS_STORAGE_KEY || event.key === null) {
        refresh();
      }
    };
    const onVisibility = () => { if (document.visibilityState === "visible") refresh(); };

    refresh();
    // Collections have been moved to MongoDB in this project. Mirror the API
    // response to localStorage so this assignment's dashboard can read that key.
    apiFetch("/collections")
      .then((data) => {
        if (!active) return;
        if (!data || !Array.isArray(data.want) || !Array.isArray(data.completed)) {
          setCollectionsSyncError("The collections API returned an unexpected response. Displaying locally saved data.");
          return;
        }
        const wrote = saveCollections(data);
        setCollections(loadCollections());
        if (!wrote) setCollectionsSyncError("Browser storage is unavailable; the dashboard cannot cache the latest collections.");
        else setCollectionsSyncError("");
      })
      .catch(() => {
        if (active) setCollectionsSyncError("Could not refresh collections from MongoDB. Displaying locally saved data.");
      });

    window.addEventListener("storage", onStorage);
    window.addEventListener(REVIEWS_UPDATED_EVENT, refresh);
    window.addEventListener(COLLECTIONS_UPDATED_EVENT, refresh);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      active = false;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(REVIEWS_UPDATED_EVENT, refresh);
      window.removeEventListener(COLLECTIONS_UPDATED_EVENT, refresh);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const stats = calculateDashboardStats(collections, reviews, games);
  const wantShare = stats.totalInLists ? stats.wantCount / stats.totalInLists : 0;
  const maxGenre = Math.max(1, ...stats.genreData.map((genre) => genre.count));
  const avg = stats.averageRating === null ? "—" : `${stats.averageRating.toFixed(1)} / 5`;

  return (
    <div className="dashboard-page">
      <Header />
      <main className="home-shell dashboard-main">
        <nav className="dashboard-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Dashboard</span></nav>
        <div className="dashboard-heading">
          <div>
            <span className="dashboard-eyebrow">YOUR GAMING OVERVIEW</span>
            <h1>Personal dashboard</h1>
            <p>Your collections, ratings and favorite genres at a glance.</p>
          </div>
          <div className="dashboard-heading-actions">
            <Link href="/collections" className="dashboard-outline-link">Manage collections</Link>
            <Link href="/reviews" className="dashboard-dark-link">Write a review</Link>
          </div>
        </div>

        {!loaded && <p role="status">Loading your statistics...</p>}
        {collectionsSyncError && <p role="status" className="dashboard-notice">{collectionsSyncError}</p>}
        {reviewsError && <p role="alert" className="dashboard-warning">{reviewsError} Go to <Link href="/reviews">Reviews</Link> to reset damaged data.</p>}
        {gamesError && <p role="alert" className="dashboard-notice">Could not load game genres: {gamesError}</p>}

        <section className="dashboard-stats" aria-label="Key statistics">
          <StatCard label="Want to play" value={stats.wantCount} detail="Games in your wishlist" icon="⌛" />
          <StatCard label="Completed games" value={stats.completedCount} detail="Adventures finished" icon="✓" />
          <StatCard label="My reviews" value={stats.reviewCount} detail="Reviews you've written" icon="✎" />
          <StatCard label="Average rating" value={avg} detail={stats.reviewCount ? "Across your personal reviews" : "Rate a game to get started"} icon="★" />
        </section>

        <div className="dashboard-charts">
          <section className="dashboard-chart-panel" aria-labelledby="dashboard-collection-title">
            <div className="dashboard-panel-heading">
              <div><span className="dashboard-small-label">COLLECTION BREAKDOWN</span><h2 id="dashboard-collection-title">Your game lists</h2></div>
              <span className="dashboard-panel-badge">{stats.totalInLists} saved entries</span>
            </div>
            <p className="dashboard-panel-description">How your saved games are split between planned and completed.</p>
            {stats.totalInLists ? (
              <div className="dashboard-donut-layout">
                <div className="dashboard-donut" role="img"
                  aria-label={`Want to play: ${stats.wantCount} games. Completed: ${stats.completedCount} games.`}
                  style={{ "--want-angle": `${wantShare * 360}deg` }}>
                  <div className="dashboard-donut-center"><strong>{stats.totalInLists}</strong><span>List entries</span></div>
                </div>
                <div className="dashboard-legend">
                  <div><span className="dashboard-legend-dot want"/><span>Want to play</span><strong>{stats.wantCount}</strong></div>
                  <div><span className="dashboard-legend-dot completed"/><span>Completed</span><strong>{stats.completedCount}</strong></div>
                  <p>{stats.uniqueGames} unique {stats.uniqueGames === 1 ? "game" : "games"} across your collections.</p>
                </div>
              </div>
            ) : (
              <div className="dashboard-chart-empty"><span aria-hidden="true">◌</span><p>No games in your collections yet.</p><Link href="/collections">Start a collection</Link></div>
            )}
          </section>

          <section className="dashboard-chart-panel" aria-labelledby="dashboard-genre-title">
            <div className="dashboard-panel-heading">
              <div><span className="dashboard-small-label">GENRE INSIGHTS</span><h2 id="dashboard-genre-title">Most popular genres</h2></div>
            </div>
            <p className="dashboard-panel-description">Most common genres among games you have saved. Each game is counted once per genre.</p>
            {gamesLoading ? <p role="status" className="dashboard-chart-status">Loading genre data...</p> : stats.genreData.length ? (
              <div className="dashboard-genre-bars" role="img" aria-label={stats.genreData.map((genre) => `${genre.name}: ${genre.count} games`).join("; ")}>
                {stats.genreData.map((genre) => (
                  <div className="dashboard-genre-row" key={genre.name}>
                    <span className="dashboard-genre-name">{genre.name}</span>
                    <div className="dashboard-genre-track"><div className="dashboard-genre-fill" style={{ width: `${genre.count / maxGenre * 100}%` }} /></div>
                    <strong>{genre.count}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-chart-empty"><span aria-hidden="true">▤</span><p>No genre statistics yet.</p><Link href="/collections">Add games to see trends</Link></div>
            )}
          </section>
        </div>
        <p className="dashboard-storage-note">Reviews are saved in this browser. Collections are synchronized from MongoDB and cached in localStorage.</p>
      </main>
      <Footer />
    </div>
  );
}
