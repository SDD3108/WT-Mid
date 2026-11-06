import {
    games
} from "../data/games.js";

const categoryCards = document.querySelectorAll(".category-card");

function countGamesByGenre(genre) {
    return games.filter((game) =>
        game.genres.some(
            (gameGenre) =>
            gameGenre.toLowerCase() === genre.toLowerCase()
        )
    ).length;
}

function displayCategoryCounts() {
    categoryCards.forEach((card) => {
        const title = card.querySelector("h2");
        const countElement = card.querySelector(".category-count");

        if (!title || !countElement) {
            return;
        }

        const genre = title.textContent.trim();
        const count = countGamesByGenre(genre);

        countElement.textContent =
            `${count} ${count === 1 ? "game" : "games"}`;
    });
}

function updateCategoryLinks() {
    categoryCards.forEach((card) => {
        const title = card.querySelector("h2");

        if (!title) {
            return;
        }

        const genre = title.textContent.trim().toLowerCase();

        card.href = `./games.html?genre=${encodeURIComponent(genre)}`;
    });
}

displayCategoryCounts();
updateCategoryLinks();