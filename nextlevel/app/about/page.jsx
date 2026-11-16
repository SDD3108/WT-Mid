"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/src/common/header/header";
import Footer from "@/src/common/footer/footer";
import "@/app/styles/about.css";
import "@/app/styles/feedback-fix.css";

export default function AboutPage(){
  const [isFavorite, setIsFavorite] = useState(false);
  const [errors, setErrors] = useState({});
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const featuredGameId = 1;
  const readStoredFavorites = ()=>{
    const value = JSON.parse(localStorage.getItem("favoriteGames") || "[]");
    return Array.isArray(value) ? value : [];
  }
  const validateFeedback = (values)=>{
    const errors = {};
    if(values.name.trim().length < 2){
      errors.name = "Enter at least 2 characters.";
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())){
      errors.email = "Enter a valid email address.";
    }
    if(!["Action", "Adventure", "RPG", "Strategy"].includes(values.genre)){
      errors.genre = "Choose a genre.";
    }
    if(!["1", "2", "3", "4", "5"].includes(values.rating)){
      errors.rating = "Choose a rating.";
    }
    if(values.message.trim().length < 10 || values.message.trim().length > 500){
      errors.message = "Write between 10 and 500 characters.";
    }
    return errors;
  }

  useEffect(() => {
    setIsFavorite(readStoredFavorites().some((id) => String(id) === String(featuredGameId)));
  }, []);

  const toggleFavorite = ()=>{
    const current = readStoredFavorites();
    const exists = current.some((id) => String(id) == String(featuredGameId));
    const updated = exists ? current.filter((id) => String(id) !== String(featuredGameId)) : [...current, featuredGameId];
    localStorage.setItem("favoriteGames", JSON.stringify(updated));
    setIsFavorite(!exists);
    window.dispatchEvent(new Event("favorites-updated"));
  }

  const handleFeedbackSubmit = (event)=>{
    event.preventDefault();
    setFeedbackStatus("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = Object.fromEntries(["name", "email", "genre", "rating", "message"].map((key) => [key, String(data.get(key) || "")]));
    const validationErrors = validateFeedback(values);
    setErrors(validationErrors);
    if(Object.keys(validationErrors).length > 0){
      return;
    }
    const previous = JSON.parse(localStorage.getItem("nextlevel-feedback") || "[]");
    const submissions = Array.isArray(previous) ? previous : [];
    submissions.push({ ...values, submittedAt: new Date().toISOString() });
    localStorage.setItem("nextlevel-feedback", JSON.stringify(submissions));
    form.reset();
    setFeedbackStatus("Thank you! Your feedback was saved in this browser (demo mode; not sent to a server). ");
  }

  return (
    <div className="about-page">
      <Header />
      <main>
        <div className="container page-container">
          <nav className="breadcrumb-line" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">About</span>
          </nav>
          <section className="hero row align-items-center g-5" aria-labelledby="hero-title">
            <div className="col-lg-6 hero-copy">
              <p className="eyebrow">About NextLevel</p>
              <h1 id="hero-title">Find your next <br className="desktop-break" /> favorite game.</h1>
              <p className="hero-description">Discover games that fit the way you play. Search, explore, and keep your next adventure within reach.</p>
              <div className="hero-actions d-flex flex-wrap align-items-center gap-3">
                <Link className="button button-dark text-white" href="/games">Explore games <span aria-hidden="true">→</span></Link>
                <Link className="button button-text" href="/categories">Browse categories <span aria-hidden="true">→</span></Link>
              </div>
            </div>
            <div className="col-lg-6">
              <section className="search-preview" aria-label="Example game discovery search">
                <h2>A game for every kind of player.</h2>
                <form className="preview-search" role="search" action="/games" method="get">
                  <label className="visually-hidden" htmlFor="previewSearch">Search games, genres, or platforms</label>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
                  <input id="previewSearch" name="q" type="search" placeholder="Search games, genres, platforms..." />
                </form>
                <ul className="filter-list" aria-label="Example filters"><li>RPG</li><li>PC</li><li>Rating: 4+</li><li>Adventure</li></ul>
                <p className="mini-label">Discover. Explore. Save.</p>
                <article className="game-preview-card">
                  <div className="game-art" aria-hidden="true">
                    <svg viewBox="0 0 100 60"><path d="M28 14h44c6 0 10 4 12 10l6 21c2 7-5 11-11 7L66 41H34L21 52c-6 4-13 0-11-7l6-21c2-6 6-10 12-10Z" /><path d="M32 23v14m-7-7h14m28-3h.1m9 7h.1" /></svg>
                  </div>
                  <div className="game-info"><h3>Echoes of Elysium</h3><p>RPG · Adventure · PC</p><strong>4.9 / 5</strong></div>
                  <button className="favorite-button" type="button" aria-label={isFavorite ? "Remove Echoes of Elysium from favorites" : "Save Echoes of Elysium to favorites"} aria-pressed={isFavorite} onClick={toggleFavorite} title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.8c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10A4.6 4.6 0 0 1 12 6.4a4.6 4.6 0 0 1 8.8 2.4Z" /></svg>
                  </button>
                </article>
              </section>
            </div>
          </section>
          <section className="intro row g-4" aria-labelledby="intro-title">
            <div className="col-md-5"><h2 id="intro-title">Less searching.<br />More playing.</h2></div>
            <div className="col-md-7 intro-copy"><p>NextLevel brings game discovery into one simple place. From familiar favorites to something completely new, explore genres, compare details, and find what you want to play next.</p></div>
          </section>
          <section className="feature-section" aria-labelledby="features-title">
            <h2 className="section-heading" id="features-title">Built around your next discovery</h2>
            <div className="row g-3">
              <div className="col-md-4"><article className="feature-card h-100"><span className="feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg></span><h3>Search your way</h3><p>Find a title you already know or explore games by genre, category, and platform.</p></article></div>
              <div className="col-md-4"><article className="feature-card h-100"><span className="feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 7h9m4 0h3M4 17h3m4 0h9M4 12h3m4 0h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="9" cy="17" r="2" /></svg></span><h3>Find the right fit</h3><p>Narrow your search with filters and ratings. Check game details before you choose.</p></article></div>
              <div className="col-md-4"><article className="feature-card h-100"><span className="feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20.8 8.8c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10A4.6 4.6 0 0 1 12 6.4a4.6 4.6 0 0 1 8.8 2.4Z" /></svg></span><h3>Keep your favorites</h3><p>Save games that catch your eye and build a personal list to come back to later.</p></article></div>
            </div>
          </section>
          <section className="steps-section" aria-labelledby="steps-title">
            <h2 className="section-heading" id="steps-title">From discovery to your next game</h2>
            <p className="section-subtitle">Three simple steps to get started.</p>
            <ol className="steps-grid">
              <li className="step-card"><div className="step-number"><span>01</span><span className="step-rule" /></div><h3>Explore the catalog</h3><p>Start with a title, a genre, or a platform. There is more than one way to discover.</p></li>
              <li className="step-card"><div className="step-number"><span>02</span><span className="step-rule" /></div><h3>Take a closer look</h3><p>Read the overview, check the rating, and see which platforms are supported.</p></li>
              <li className="step-card"><div className="step-number"><span>03</span><span className="step-rule" /></div><h3>Save what you love</h3><p>Add a game to Favorites and keep your next picks together in one place.</p></li>
            </ol>
          </section>
          <section className="feedback-section" aria-labelledby="feedback-title">
            <div className="feedback-heading"><h2 id="feedback-title">Help us improve NextLevel</h2><p>Tell us what you think about your game discovery experience.</p></div>
            <form id="feedback-form" noValidate onSubmit={handleFeedbackSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="feedback-name">Your name</label>
                  <input type="text" id="feedback-name" name="name" className={`form-control ${errors.name ? "is-invalid" : ""}`} minLength={2} required aria-invalid={!!errors.name} aria-describedby="name-error" />
                  <p className="field-error" id="name-error">{errors.name}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="feedback-email">Email address</label>
                  <input type="email" id="feedback-email" name="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} required aria-invalid={!!errors.email} aria-describedby="email-error" />
                  <p className="field-error" id="email-error">{errors.email}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="feedback-genre">Favorite game genre</label>
                  <select id="feedback-genre" name="genre" className={`form-select ${errors.genre ? "is-invalid" : ""}`} required aria-invalid={!!errors.genre} aria-describedby="genre-error">
                    <option value="">Choose a genre</option><option value="Action">Action</option><option value="Adventure">Adventure</option><option value="RPG">RPG</option><option value="Strategy">Strategy</option>
                  </select>
                  <p className="field-error" id="genre-error">{errors.genre}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="feedback-rating">Rate NextLevel</label>
                  <select id="feedback-rating" name="rating" className={`form-select ${errors.rating ? "is-invalid" : ""}`} required aria-invalid={!!errors.rating} aria-describedby="rating-error">
                    <option value="">Choose a rating</option><option value="1">1 - Poor</option><option value="2">2 - Fair</option><option value="3">3 - Good</option><option value="4">4 - Very good</option><option value="5">5 - Excellent</option>
                  </select>
                  <p className="field-error" id="rating-error">{errors.rating}</p>
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="feedback-message">Your feedback</label>
                  <textarea id="feedback-message" name="message" className={`form-control ${errors.message ? "is-invalid" : ""}`} rows={5} minLength={10} maxLength={500} required aria-invalid={!!errors.message} aria-describedby="message-error" placeholder="What do you like? What should we improve?" />
                  <p className="field-error" id="message-error">{errors.message}</p>
                </div>
                <div className="col-12"><button type="submit" className="feedback-submit">SUBMIT FEEDBACK</button></div>
              </div>
              {feedbackStatus && <p id="feedback-success" role="status" aria-live="polite">{feedbackStatus}</p>}
            </form>
          </section>
          <section className="closing-banner d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4" aria-labelledby="closing-title">
            <div><h2 id="closing-title">Your next favorite is out there.</h2><p>Explore the catalog and find a game worth saving.</p></div>
            <Link href="/games" className="closing-link">View all games <span aria-hidden="true">→</span></Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
