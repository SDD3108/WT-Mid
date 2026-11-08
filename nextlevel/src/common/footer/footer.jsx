import React from 'react'
import "@/app/styles/home.css";


const Footer = () => {
  return (
    <footer className="home-footer">
      <div className="home-shell footer-inner">
        <div className="footer-columns">
          <div className="footer-brand">
            <a className="home-brand" href="/">NextLevel</a>
            <p>Discover. Explore. Save.</p>
          </div>
          <nav className="footer-group" aria-label="Explore">
            <h2>Explore</h2>
            <p className="footer-links">
              <a href="/games">Games</a>
              &nbsp;·&nbsp;
              <a href="/categories">Categories</a>
              &nbsp;·&nbsp;
              <a href="/favorites">Favorites</a>
            </p>
          </nav>
          <div className="footer-group">
            <h2>Contact</h2>
            <a href="mailto:support@nextlevel.example">support@nextlevel.example</a>
            <a href="/about">About</a>
          </div>
        </div>
        <p className="footer-copyright">© <span data-year>2026</span> Nextlevel</p>
      </div>
    </footer>
  )
}

export default Footer