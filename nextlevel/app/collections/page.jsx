"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/src/common/header/header";
import Footer from "@/src/common/footer/footer";
import { useGames } from "@/src/hooks/useGames";
import { apiFetch } from "@/src/lib/api";
import GameCollection from "@/src/models/GameCollection";
import "@/app/styles/collections.css";

function createCollections(saved = { want: [], completed: [] }) {
  return {
    want: new GameCollection("Want to Play", saved.want),
    completed: new GameCollection("Completed", saved.completed),
  };
}

export default function CollectionsPage() {
  const { games, loading: gamesLoading, error: gamesError } = useGames();
  const [collections, setCollections] = useState(() => createCollections());
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    let active = true;
    apiFetch("/collections")
      .then((data) => { if (active) setCollections(createCollections(data)); })
      .catch((err) => { if (active) setStorageError(err.message); })
      .finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, []);

  async function toggleGame(collectionKey, gameId) {
    const added = collections[collectionKey].hasGame(gameId);
    try {
      const updated = await apiFetch(`/collections/${collectionKey}/${gameId}`, {
        method: added ? "DELETE" : "POST",
      });
      setCollections(createCollections(updated));
      setStorageError("");
    } catch (err) {
      setStorageError(err.message);
    }
  }

  async function clearCollection(collectionKey) {
    const collection = collections[collectionKey];
    if (!collection.getCount()) return;
    if (!window.confirm(`Clear all games from "${collection.name}"?`)) return;
    try {
      const updated = await apiFetch(`/collections/${collectionKey}`, { method: "DELETE" });
      setCollections(createCollections(updated));
      setStorageError("");
    } catch (err) {
      setStorageError(err.message);
    }
  }

  return (
    <div className="collections-page">
      <Header />
      <main className="container collections-main">
        <div className="collections-heading">
          <h1>My Game Collections</h1>
          <p>Keep track of games you're planning to play and adventures you've already completed. Your collections are saved in MongoDB.</p>
        </div>
        {(storageError || gamesError) && <p role="alert" className="alert alert-danger">{storageError || gamesError}</p>}
        {!loaded || gamesLoading ? (
          <p role="status">Loading your collections...</p>
        ) : (
          Object.entries(collections).map(([key, collection]) => (
            <section className="collection-section" key={key}>
              <div className="collection-title">
                <div>
                  <h2>{collection.name}</h2>
                  <span className="collection-count">{collection.getCount()} saved</span>
                </div>
                <button type="button" className="collection-clear" disabled={collection.getCount() === 0} onClick={() => clearCollection(key)}>
                  Clear collection
                </button>
              </div>
              <div className="row g-4">
                {games.map((game) => {
                  const added = collection.hasGame(game.id);
                  const image = game.image_horizontal?.replace("@/assets/images/", "/images/");
                  return (
                    <div className="col-12 col-sm-6 col-lg-4" key={game.id}>
                      <article className="collection-card">
                        <img src={image} alt={`${game.title} cover`} className="collection-image" />
                        <div className="collection-card-body">
                          <h3><Link href={`/games/${game.id}`}>{game.title}</Link></h3>
                          <p className="collection-genre">{game.genre.join(" · ")}</p>
                          <button type="button" className={added ? "collection-button added" : "collection-button"}
                            aria-pressed={added} onClick={() => toggleGame(key, game.id)}>
                            {added ? "✓ Added to collection" : "+ Add to collection"}
                          </button>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </main>
      <Footer />
    </div>
  );
}
