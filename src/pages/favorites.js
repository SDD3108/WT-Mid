import {
    games
} from "../data/games.js";

const STORAGE_KEY = "nextlevel:favorites";

const savedGamesContainer = document.querySelector("#saved-games");
const savedCount = document.querySelector("#saved-count");
const emptyState = document.querySelector("#empty-state");

function readFavorites() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

        return Array.isArray(saved) ? [...new Set(saved.filter((id) => typeof id === "string"))] : [];
    } catch (error) {
        return [];
    }
}

function removeFavorite(gameId) {
    const favorites = readFavorites();

    const updatedFavorites = favorites.filter((id) => id !== gameId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFavorites));

    renderFavorites();
}

function createFavoriteCard(game, index) {
    const article = document.createElement("article");
    article.className = "game-card";
    article.dataset.gameId = game.id;

    const artwork = document.createElement("div");
    artwork.className = "game-art";
    artwork.style.backgroundImage = `url(${game.image})`;
    artwork.style.backgroundSize = "cover";
    artwork.style.backgroundPosition = "center";
    artwork.setAttribute("aria-hidden", "true");

    const title = document.createElement("h2");
    const link = document.createElement("a");

    link.href = `./game.html?id=${encodeURIComponent(game.id)}`;
    link.textContent = game.title;
    link.className = "favorite-game-link";

    title.appendChild(link);

    const metadata = document.createElement("div");
    metadata.className = "game-meta";

    const genre = document.createElement("span");
    genre.textContent = game.genres.join(", ");

    const rating = document.createElement("span");
    rating.className = "rating";
    rating.textContent = `★ ${game.rating.toFixed(1)}`;

    metadata.append(genre, rating);

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.dataset.removeId = game.id;
    removeButton.setAttribute(
        "aria-label",
        `Remove ${game.title} from favorites`,
    );

    article.append(artwork, title, metadata, removeButton);

    return article;
}

function renderFavorites() {
    const favoriteIds = readFavorites();

    const favoriteGames = favoriteIds
        .map((id) => games.find((game) => game.id === id))
        .filter(Boolean);

    savedGamesContainer.replaceChildren();

    favoriteGames.forEach((game, index) => {
        const card = createFavoriteCard(game, index);
        savedGamesContainer.appendChild(card);
    });

    savedCount.textContent = favoriteGames.length;
    emptyState.hidden = favoriteGames.length > 0;
}

savedGamesContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-id]");

    if (!button) {
        return;
    }

    removeFavorite(button.dataset.removeId);
});

window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY || event.key === null) {
        renderFavorites();
    }
});

renderFavorites();