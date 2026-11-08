import React from 'react'
import Header from "@/src/common/header/header";
import Footer from "@/src/common/footer/footer";
import "@/app/styles/about.css";

const AboutPage = () => {
  return (
    <div>
      <Header/>
      <main>
        <div className="container page-container">
          <nav className="breadcrumb-line" aria-label="Breadcrumb">
            <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">About</span>
          </nav>
          <section className="hero row align-items-center g-5" aria-labelledby="hero-title">
            <div className="col-lg-6 hero-copy">
              <p className="eyebrow">About NextLevel</p>
              <h1 id="hero-title">Find your next <br className="desktop-break"/> favorite game.</h1>
              <p className="hero-description">Discover games that fit the way you play. Search, explore, and keep your next adventure within reach.</p>
              <div className="hero-actions d-flex flex-wrap align-items-center gap-3">
                <a className="button button-dark text-white" href="/games">Explore games <span aria-hidden="true">→</span></a>
                <a className="button button-text" href="/categories">Browse categories <span aria-hidden="true">→</span></a>
              </div>
            </div>
            <div className="col-lg-6">
              <section className="search-preview" aria-label="Example game discovery search">
                <h2>A game for every kind of player.</h2>
                <form className="preview-search" role="search" action="/games">
                  <label className="visually-hidden">Search games, genres, or platforms</label>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8">
                    </circle>
                    <path d="m16 16 5 5"></path>
                  </svg>
                  <input id="previewSearch" type="search" placeholder="Search games, genres, platforms..."/>
                </form>
                <ul className="filter-list" aria-label="Example filters">
                  <li>RPG</li><li>PC</li><li>Rating: 4+</li><li>Adventure</li>
                </ul>
                <p className="mini-label">Discover. Explore. Save.</p>
                <article className="game-preview-card">
                  <div className="game-art" aria-hidden="true">
                    <svg viewBox="0 0 100 60">
                      <path d="M28 14h44c6 0 10 4 12 10l6 21c2 7-5 11-11 7L66 41H34L21 52c-6 4-13 0-11-7l6-21c2-6     6-10 12-10Z"></path>
                      <path d="M32 23v14m-7-7h14m28-3h.1m9 7h.1"></path>
                    </svg>
                  </div>
                  <div className="game-info">
                    <h3>Echoes of Aether</h3>
                    <p>RPG · Adventure · PC</p>
                    <strong>4.6 / 5</strong>
                  </div>
                  <button className="favorite-button" type="button" aria-label="Save Echoes of Aether to favorites">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.8c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10A4.6 4.6 0 0 1 12 6.4a4.6 4.6 0 0 1 8.8 2.4Z">
                      </path>
                    </svg>
                  </button>
                </article>
              </section>
            </div>
          </section>
          <section className="intro row g-4" aria-labelledby="intro-title">
            <div className="col-md-5">
              <h2 id="intro-title">Less searching.<br/>More playing.</h2>
            </div>
            <div className="col-md-7 intro-copy">
              <p>NextLevel brings game discovery into one simple place. From familiar favorites to something completely new, explore genres,    compare details, and find what you want to play next.</p>
            </div>
          </section>
          <section className="feature-section" aria-labelledby="features-title">
            <h2 className="section-heading" id="features-title">Built around your next discovery</h2>
            <div className="row g-3">
              <div className="col-md-4">
                <article className="feature-card h-100">
                  <span className="feature-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8">
                      </circle>
                      <path d="m16 16 5 5"></path>
                    </svg>
                  </span>
                  <h3>Search your way</h3>
                  <p>Find a title you already know or explore games by genre, category, and platform.</p>
                </article>
              </div>
              <div className="col-md-4">
                <article className="feature-card h-100">
                  <span className="feature-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M4 7h9m4 0h3M4 17h3m4 0h9M4 12h3m4 0h9"></path>
                      <circle cx="15" cy="7" r="2"></circle>
                      <circle cx="9" cy="12" r="2"></circle>
                      <circle cx="9" cy="17" r="2"></circle>
                    </svg>
                  </span>
                  <h3>Find the right fit</h3>
                  <p>Narrow your search with filters and ratings. Check game details before you choose.</p>
                </article>
              </div>
              <div className="col-md-4">
                <article className="feature-card h-100">
                  <span className="feature-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M20.8 8.8c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10A4.6 4.6 0 0 1 12 6.4a4.6 4.6 0 0 1 8.8 2.4Z"></path>
                    </svg>
                  </span>
                  <h3>Keep your favorites</h3>
                  <p>Save games that catch your eye and build a personal list to come back to later.</p>
                </article>
              </div>
            </div>
          </section>
          <section className="steps-section" aria-labelledby="steps-title">
            <h2 className="section-heading" id="steps-title">From discovery to your next game</h2>
            <p className="section-subtitle">Three simple steps to get started.</p>
            <ol className="steps-grid">
              <li className="step-card">
                <div className="step-number">
                  <span>01</span>
                  <span className="step-rule"></span>
                </div>
                <h3>Explore the catalog</h3>
                <p>Start with a title, a genre, or a platform. There is more than one way to discover.</p>
              </li>
              <li className="step-card">
                <div className="step-number">
                  <span>02</span>
                  <span className="step-rule"></span>
                </div>
                <h3>Take a closer look</h3>
                <p>Read the overview, check the rating, and see which platforms are supported.</p>
              </li>
              <li className="step-card">
                <div className="step-number">
                  <span>03</span>
                  <span className="step-rule"></span>
                </div>
                <h3>Save what you love</h3>
                <p>Add a game to Favorites and keep your next picks together in one place.</p>
              </li>
            </ol>
          </section>
          <section className="feedback-section" aria-labelledby="feedback-title">
            <div className="feedback-heading">
              <h2 id="feedback-title">Help us improve NextLevel</h2>
              <p>Tell us what you think about your game discovery experience.</p>
            </div>

          <form id="feedback-form" noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Your name</label>
                <input
                  type="text"
                  id="feedback-name"
                  name="name"
                  className="form-control"
                  minLength={2}
                  required
                  aria-describedby="name-error"
                />
                
                <p className="field-error" id="name-error"></p>
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Email address
                </label>
                <input
                type="email"
                id="feedback-email"
                name="email"
                className="form-control"
                required
                aria-describedby="email-error"
                />
                <p className="field-error" id="email-error"></p>
              </div>

            <div className="col-md-6">
              <label className="form-label">
                Favorite game genre
              </label>
              <select
                id="feedback-genre"
                name="genre"
                className="form-select"
                required
                aria-describedby="genre-error"
              >
              <option value="">Choose a genre</option>
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="RPG">RPG</option>
              <option value="Strategy">Strategy</option>
              </select>
              <p className="field-error" id="genre-error"></p>
            </div>

            <div className="col-md-6">
              <label className="form-label">
                Rate NextLevel
              </label>
              <select
                id="feedback-rating"
                name="rating"
                className="form-select"
                required
                aria-describedby="rating-error"
              >
              <option value="">Choose a rating</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very good</option>
              <option value="5">5 - Excellent</option>
              </select>
              <p className="field-error" id="rating-error"></p>
            </div>
            <div className="col-12">
              <label className="form-label">Your feedback</label>

              <textarea
              id="feedback-message"
              name="message"
              className="form-control"
              rows="5"
              minLength={10}
              maxLength={500}
              required
              aria-describedby="message-error"
              placeholder="What do you like? What should we improve?"
              ></textarea>

              <p className="field-error" id="message-error"></p>
            </div>

            <div className="col-12">
              <button type="submit" className="feedback-submit">SUBMIT FEEDBACK</button>
            </div></div>
            <p id="feedback-success" role="status"aria-live="polite" hidden></p>
          </form>
          </section>
          <section className="closing-banner d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4" aria-labelledby="closing-title">
            <div>
              <h2 id="closing-title">Your next favorite is out there.</h2>
              <p>Explore the catalog and find a game worth saving.</p>
            </div>
            <a href="/games" className="closing-link">View all games <span aria-hidden="true">→</span></a>
          </section>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default AboutPage