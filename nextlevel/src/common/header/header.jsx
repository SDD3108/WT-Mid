"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/app/styles/home.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", key: "home" },
    { name: "Games", href: "/games", key: "games" },
    { name: "Categories", href: "/categories", key: "categories" },
    { name: "Favorites", href: "/favorites", key: "favorites" },
    { name: "About", href: "/about", key: "about" },
  ];

  return (
    <header className="home-header">
      <nav className="navbar navbar-expand-lg home-shell" aria-label="Main navigation">
        <Link className="navbar-brand home-brand" href="/">
          NextLevel
        </Link>
        <button
          className="navbar-toggler"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="home-navigation"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`navbar-collapse ${isOpen ? "show" : ""}`} id="home-navigation">
          <ul className="navbar-nav">
            {links.map((link) => (
              <li className="nav-item" key={link.key}>
                <Link className={`nav-link ${pathname == link.href ? "active" : ""}`} data-nav={link.key} href={link.href} onClick={() => setIsOpen(false)}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <form className="header-search" role="search" action="/games" method="get"data-home-search>
            <label className="visually-hidden" htmlFor="header-query">
              Search games
            </label>
            <input id="header-query" name="q" type="search" placeholder="Search games…" maxLength={100}/>
          </form>
        </div>
      </nav>
    </header>
  );
};

export default Header;
