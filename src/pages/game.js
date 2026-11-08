import {
    games
} from "../data/games.js";

const STORAGE_KEY = "nextlevel:favorites";

const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");
const game = games.find((item) => item.id == gameId);

const gameContent = document.querySelector("#game-content");
const favoriteButton = document.querySelector("#favorite-button");
const favoriteFeedback = document.querySelector("#favorite-feedback");

function readFavorites() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

        return Array.isArray(saved) ?
            [...new Set(saved.filter((id) => typeof id == "string"))] :
            [];
    } catch (error) {
        return [];
    }
}

function updateFavoriteButton() {
    const isFavorite = readFavorites().includes(game.id);

    favoriteButton.textContent = isFavorite ?
        "REMOVE FROM FAVORITES" :
        "ADD TO FAVORITES";

    favoriteButton.setAttribute("aria-pressed", String(isFavorite));
}

function displayGame(game) {
    document.title = `${game.title} — NextLevel`;

    gameContent.dataset.gameId = game.id;

    document.querySelector("#game-breadcrumb").textContent = game.title;
    document.querySelector("#game-title").textContent = game.title;
    document.querySelector("#game-genres").textContent =
        game.genres.join(" · ").toUpperCase();

    const rating = document.querySelector("#game-rating");
    rating.textContent = game.rating.toFixed(1);
    rating.setAttribute("aria-label", `${game.rating.toFixed(1)} out of 5`);

    document.querySelector("#game-description").textContent =
        game.description;

    document.querySelector("#game-about").textContent = game.about;
    document.querySelector("#game-developer").textContent = game.developer;
    document.querySelector("#game-publisher").textContent = game.publisher;

    const release = document.querySelector("#game-release");
    release.textContent = String(game.year);
    release.setAttribute("datetime", String(game.year));

    document.querySelector("#game-information-genres").textContent =
        game.genres.join(", ");

    document.querySelector("#game-modes").textContent = game.modes;

    const platformsList = document.querySelector("#game-platforms");
    platformsList.replaceChildren();

    game.platforms.forEach((platform) => {
        const item = document.createElement("li");
        item.textContent = platform;
        platformsList.appendChild(item);
    });
}

function toggleFavorite() {
    const favorites = readFavorites();
    const isFavorite = favorites.includes(game.id);

    const updatedFavorites = isFavorite ?
        favorites.filter((id) => id !== game.id) :
        [...favorites, game.id];

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedFavorites)
    );

    updateFavoriteButton();

    favoriteFeedback.textContent = isFavorite ?
        "Removed from your favorites" :
        "Added to your favorites";
}

if (game) {
    displayGame(game);
    updateFavoriteButton();

    favoriteButton.addEventListener("click", toggleFavorite);

    window.addEventListener("storage", (event) => {
        if (event.key == STORAGE_KEY || event.key == null) {
            updateFavoriteButton();
            favoriteFeedback.textContent = "";
        }
    });
} else {
    document.title = "Game not found — NextLevel";

    document.querySelector("#game-title").textContent = "Game not found";
    document.querySelector("#game-description").textContent =
        "The requested game does not exist.";

    favoriteButton.hidden = true;
}