"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/src/common/header/header";
import Footer from "@/src/common/footer/footer";
import { games } from "@/src/data/games";
import GameCollection from "@/src/models/GameCollection";
import {
  loadCollections,
  saveCollections,
} from "@/src/utils/collectionStorage";
import "@/app/styles/collections.css";

function createCollections(saved = { want: [], completed: [] }) {
  return {
    want: new GameCollection("Want to Play", saved.want),
    completed: new GameCollection("Completed", saved.completed),
  };
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState(
    () => createCollections()
  );

  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState("");

  // Restore saved data when the page opens.
  useEffect(() => {
    setCollections(createCollections(loadCollections()));
    setLoaded(true);
  }, []);

  // Save whenever the collections change.
  useEffect(() => {
    if (!loaded) return;

    const success = saveCollections(collections);

    setStorageError(
      success ? "" : "Your changes could not be saved."
    );
  }, [collections, loaded]);

  function toggleGame(collectionKey, gameId) {
    setCollections((previous) => {
      const oldCollection = previous[collectionKey];

      const updatedCollection = new GameCollection(
        oldCollection.name,
        oldCollection.gameIds
      );

      if (updatedCollection.hasGame(gameId)) {
        updatedCollection.removeGame(gameId);
      } else {
        updatedCollection.addGame(gameId);
      }

      return {
        ...previous,
        [collectionKey]: updatedCollection,
      };
    });
  }

  function clearCollection(collectionKey) {
    const collection = collections[collectionKey];

    if (!collection.getCount()) return;

    if (
      !window.confirm(
        `Clear all games from "${collection.name}"?`
      )
    ) {
      return;
    }

    setCollections((previous) => {
      const updatedCollection = new GameCollection(
        previous[collectionKey].name,
        previous[collectionKey].gameIds
      );

      updatedCollection.clear();

      return {
        ...previous,
        [collectionKey]: updatedCollection,
      };
    });
  }

  return (
    <div className="collections-page">
      <Header />

      <main className="container collections-main">
        <div className="collections-heading">
          <h1>My Game Collections</h1>
          <p>
            Keep track of games you're planning to play
            and adventures you've already completed.
            Your collections are saved automatically.
          </p>
        </div>

        {storageError && (
          <p role="alert" className="alert alert-danger">
            {storageError}
          </p>
        )}

        {!loaded ? (
          <p role="status">Loading your collections...</p>
        ) : (
          Object.entries(collections).map(
            ([key, collection]) => (
              <section className="collection-section" key={key}>
                <div className="collection-title">
                  <div>
                    <h2>{collection.name}</h2>
                    <span className="collection-count">
                      {collection.getCount()} saved
                    </span>
                  </div>

                  <button
                    type="button"
                    className="collection-clear"
                    disabled={collection.getCount() === 0}
                    onClick={() => clearCollection(key)}
                  >
                    Clear collection
                  </button>
                </div>

                <div className="row g-4">
                  {games.map((game) => {
                    const added = collection.hasGame(game.id);

                    const image = game.image_horizontal
                      ?.replace(
                        "@/assets/images/",
                        "/images/"
                      );

                    return (
                      <div
                        className="col-12 col-sm-6 col-lg-4"
                        key={game.id}
                      >
                        <article className="collection-card">
                          <img
                            src={image}
                            alt={`${game.title} cover`}
                            className="collection-image"
                          />

                          <div className="collection-card-body">
                            <h3>
                              <Link href={`/games/${game.id}`}>
                                {game.title}
                              </Link>
                            </h3>

                            <p className="collection-genre">
                              {game.genre.join(" · ")}
                            </p>

                            <button
                              type="button"
                              className={
                                added
                                  ? "collection-button added"
                                  : "collection-button"
                              }
                              aria-pressed={added}
                              onClick={() =>
                                toggleGame(key, game.id)
                              }
                            >
                              {added
                                ? "✓ Added to collection"
                                : "+ Add to collection"}
                            </button>
                          </div>
                        </article>
                      </div>
                    );
                  })}
                </div>
              </section>
            )
          )
        )}
      </main>

      <Footer />
    </div>
  );
}
