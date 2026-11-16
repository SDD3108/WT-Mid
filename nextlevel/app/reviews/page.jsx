"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/src/common/header/header";
import Footer from "@/src/common/footer/footer";
import { useGames } from "@/src/hooks/useGames";
import {
  readReviews,
  saveReviews,
  validateReview,
  newReviewId,
  REVIEWS_STORAGE_KEY,
  REVIEWS_UPDATED_EVENT,
  MAX_REVIEW_LENGTH,
} from "@/src/utils/reviewStorage";
import "@/app/styles/reviews.css";

const emptyForm = { gameId: "", rating: 0, comment: "" };
const emptyCover = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#e9e9e6"/><text x="50%" y="50%" text-anchor="middle" font-size="24" font-family="Arial" fill="#777">No cover available</text></svg>'
);

const gameCover = (game) =>
  (game?.image_horizontal || game?.image_vertical)?.replace(/^@\/assets\/images\//, "/images/") || emptyCover;

function Stars({ rating }) {
  return (
    <span className="review-rating-stars" aria-label={`${rating} out of 5 stars`}>
      <span aria-hidden="true">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>
      <strong>{rating}.0</strong>
    </span>
  );
}

export default function ReviewsPage() {
  const { games, loading: gamesLoading, error: gamesError } = useGames();
  const [reviews, setReviews] = useState([]);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const refresh = () => {
      const result = readReviews();
      setReviews(result.reviews);
      setStorageError(result.error);
      setStorageLoaded(true);
    };
    const onStorage = (event) => {
      if (event.key === REVIEWS_STORAGE_KEY || event.key === null) refresh();
    };
    refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener(REVIEWS_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(REVIEWS_UPDATED_EVENT, refresh);
    };
  }, []);

  const gameById = new Map(games.map((game) => [Number(game.id), game]));
  const sortedReviews = [...reviews].sort((a, b) =>
    Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
  );

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setFormError("");
    if (storageError) return;

    const validationError = validateReview(form, new Set(gameById.keys()));
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const gameId = Number(form.gameId);
    if (reviews.some((review) => review.gameId === gameId && review.id !== editingId)) {
      setFormError("You already reviewed this game. Edit the existing review instead.");
      return;
    }

    const now = new Date().toISOString();
    const record = {
      id: editingId || newReviewId(),
      gameId,
      rating: Number(form.rating),
      comment: form.comment.trim(),
      createdAt: reviews.find((review) => review.id === editingId)?.createdAt || now,
      updatedAt: now,
    };
    const updated = editingId
      ? reviews.map((review) => review.id === editingId ? record : review)
      : [record, ...reviews];
    const result = saveReviews(updated);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    setReviews(updated);
    setEditingId(null);
    setForm(emptyForm);
    setMessage(editingId ? "Your review has been updated." : "Your review has been saved.");
  }

  function startEdit(review) {
    setEditingId(review.id);
    setForm({ gameId: String(review.gameId), rating: review.rating, comment: review.comment });
    setFormError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  }

  function deleteReview(review) {
    if (!window.confirm("Delete this review? This action cannot be undone.")) return;
    const updated = reviews.filter((item) => item.id !== review.id);
    const result = saveReviews(updated);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    setReviews(updated);
    if (editingId === review.id) cancelEdit();
    setMessage("Your review was deleted.");
  }

  function resetBrokenData() {
    if (!window.confirm("Reset damaged reviews? The existing stored data will be permanently replaced.")) return;
    const result = saveReviews([]);
    if (!result.ok) {
      setStorageError(result.error);
      return;
    }
    setReviews([]);
    setStorageError("");
    cancelEdit();
    setMessage("Stored reviews were reset.");
  }

  return (
    <div className="reviews-page">
      <Header />
      <main className="home-shell reviews-main">
        <nav className="reviews-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span><span>Reviews</span>
        </nav>
        <div className="reviews-heading">
          <div>
            <span className="reviews-eyebrow">YOUR PLAY HISTORY</span>
            <h1>My game reviews</h1>
            <p>Rate the games you play and keep your thoughts in one place.</p>
          </div>
          <span className="reviews-counter">{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</span>
        </div>

        {!storageLoaded && <p role="status">Loading your saved reviews...</p>}
        {storageError && (
          <section className="reviews-storage-error" role="alert">
            <strong>Local reviews are unavailable</strong>
            <p>{storageError}</p>
            <button type="button" onClick={resetBrokenData}>Reset damaged reviews</button>
          </section>
        )}
        {message && <p className="reviews-message" role="status">{message}</p>}

        <div className="reviews-layout">
          <section className="reviews-form-panel" aria-labelledby="review-form-title">
            <div className="reviews-panel-top">
              <span className="reviews-panel-kicker">{editingId ? "EDIT REVIEW" : "NEW REVIEW"}</span>
              <h2 id="review-form-title">{editingId ? "Update your review" : "Write a review"}</h2>
              <p>{editingId ? "Make changes and save your updated thoughts." : "Choose a title and share your experience."}</p>
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <label className="reviews-label" htmlFor="review-game">Game <span>*</span></label>
              <select id="review-game" value={form.gameId} required disabled={gamesLoading || Boolean(storageError)}
                onChange={(event) => setForm({ ...form, gameId: event.target.value })}>
                <option value="">Select a game</option>
                {games.map((game) => <option key={game.id} value={game.id}>{game.title}</option>)}
              </select>
              {gamesLoading && <p className="reviews-help" role="status">Loading the game catalog...</p>}
              {gamesError && <p className="reviews-input-error" role="alert">Could not load games: {gamesError}</p>}

              <fieldset className="reviews-rating-field">
                <legend className="reviews-label">Your rating <span>*</span></legend>
                <div className="reviews-star-input" aria-label="Your rating">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value} title={`${value} ${value === 1 ? "star" : "stars"}`}>
                      <input type="radio" name="review-rating" value={value} checked={Number(form.rating) === value}
                        onChange={() => setForm({ ...form, rating: value })} disabled={Boolean(storageError)} />
                      <span className={value <= Number(form.rating) ? "selected" : ""} aria-hidden="true">★</span>
                      <span className="visually-hidden">{value} {value === 1 ? "star" : "stars"}</span>
                    </label>
                  ))}
                  <span className="reviews-rating-hint">{form.rating ? `${form.rating} / 5` : "Select stars"}</span>
                </div>
              </fieldset>

              <label className="reviews-label" htmlFor="review-comment">Your review <span>*</span></label>
              <textarea id="review-comment" rows={6} value={form.comment} required maxLength={MAX_REVIEW_LENGTH}
                disabled={Boolean(storageError)} onChange={(event) => setForm({ ...form, comment: event.target.value })}
                placeholder="What did you enjoy? What would you change?" />
              <div className="reviews-form-meta"><span>At least 10 characters</span><span>{form.comment.length} / {MAX_REVIEW_LENGTH}</span></div>
              {formError && <p className="reviews-input-error" role="alert">{formError}</p>}
              <div className="reviews-form-actions">
                <button type="submit" className="reviews-primary" disabled={!storageLoaded || Boolean(storageError) || gamesLoading || Boolean(gamesError)}>
                  {editingId ? "Save changes" : "Publish review"}
                </button>
                {editingId && <button type="button" className="reviews-secondary" onClick={cancelEdit}>Cancel</button>}
              </div>
              <p className="reviews-local-note">Saved privately in this browser. Reviews are not sent to the server.</p>
            </form>
          </section>

          <section className="reviews-list-panel" aria-labelledby="review-list-title">
            <div className="reviews-list-header">
              <h2 id="review-list-title">Your collection of reviews</h2>
              <span>Newest updated first</span>
            </div>
            {storageLoaded && !storageError && sortedReviews.length === 0 && (
              <div className="reviews-empty">
                <span className="reviews-empty-icon" aria-hidden="true">☆</span>
                <h3>No reviews yet</h3>
                <p>Your reviews will appear here. Start by selecting a game and sharing your thoughts.</p>
                <Link href="/games">Explore games</Link>
              </div>
            )}
            <div className="reviews-cards">
              {sortedReviews.map((review) => {
                const game = gameById.get(review.gameId);
                const title = game?.title || `Game #${review.gameId}`;
                return (
                  <article className="reviews-card" key={review.id}>
                    <div className="reviews-card-cover">
                      <img src={gameCover(game)} alt={`${title} cover`}
                        onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = emptyCover; }} />
                    </div>
                    <div className="reviews-card-info">
                      <div className="reviews-card-top">
                        <div>
                          <h3>{game ? <Link href={`/games/${game.id}`}>{title}</Link> : title}</h3>
                          <p className="reviews-genres">{game?.genre?.join(" · ") || "Game no longer in catalog"}</p>
                        </div>
                        <Stars rating={review.rating} />
                      </div>
                      <p className="reviews-comment">{review.comment}</p>
                      <div className="reviews-card-bottom">
                        <time dateTime={review.updatedAt}>
                          {review.updatedAt !== review.createdAt ? "Updated" : "Reviewed"} {new Date(review.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </time>
                        <div className="reviews-card-actions">
                          <button type="button" onClick={() => startEdit(review)}>Edit</button>
                          <button type="button" className="reviews-delete" onClick={() => deleteReview(review)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
