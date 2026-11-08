import React from 'react'
import Header from "@/src/common/header/header";
import Footer from "@/src/common/footer/footer";
import "@/app/styles/categories+favorites.css";

const CategoriesPage = () => {
  return (
    <div>
      <Header/>
      <main className="container page-width page-main">
        <nav className="breadcrumb-line" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Categories</span>
        </nav>

        <section aria-labelledby="page-title">
          <h1 id="page-title" className="page-title">Explore by genre</h1>
          <p className="page-intro mt-2">Start with a play style you love, then narrow the catalog to find the right game.</p>

          <div className="category-grid mt-4">
            <a className="category-card" href="/games?genre=action">
              <div className="category-art art-action" role="img" aria-label="Abstract warm action game artwork"></div>
              <h2>Action</h2>
              <div className="category-meta">
                <span className="category-count">Loading...</span>
                <span>Browse category <b aria-hidden="true">→</b></span>
              </div>
            </a>

            <a className="category-card" href="/games?genre=adventure">
              <div className="category-art art-adventure" role="img" aria-label="Abstract forest adventure artwork"></div>
              <h2>Adventure</h2>
              <div className="category-meta">
                <span className="category-count">Loading...</span>
                <span>Browse category <b aria-hidden="true">→</b></span>
              </div>
            </a>

            <a className="category-card" href="/games?genre=rpg">
              <div className="category-art art-rpg" role="img" aria-label="Abstract fantasy role-playing artwork"></div>
              <h2>RPG</h2>
              <div className="category-meta">
                <span className="category-count">Loading...</span>
                <span>Browse category <b aria-hidden="true">→</b></span>
              </div>
            </a>

            <a className="category-card" href="/games?genre=strategy">
              <div className="category-art art-strategy" role="img" aria-label="Abstract strategy game artwork"></div>
              <h2>Strategy</h2>
              <div className="category-meta">
                <span className="category-count">Loading...</span>
                <span>Browse category <b aria-hidden="true">→</b></span>
              </div>
            </a>
          </div>
        </section>

        <aside className="catalog-cta" aria-labelledby="cta-title"><div><h2 id="cta-title">Not sure where to start?</h2><p>Browse the complete    NextLevel catalog.</p></div><a className="btn btn-light btn-sm text-black" href="/games">View all games <span aria-hidden="true">→</span></a></  aside>
      </main>
      <Footer/>
    </div>
  )
}

export default CategoriesPage