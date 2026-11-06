import {
    games
} from "../data/games.js";

const gamesList = document.querySelector("#games-list");
const cardTemplate = document.querySelector("#games-card-template");
const searchForm = document.querySelector("#games-search");
const searchInput = document.querySelector("#games-query");
const filtersForm = document.querySelector("#games-filters");
const sortSelect = document.querySelector("#games-sort");
const gamesCount = document.querySelector("#games-count");
const emptyMessage = document.querySelector("#games-empty");
const pagination = document.querySelector("#games-pagination");

const artwork = fragment.querySelector(".gc-card-image");

if (game.image) {
  artwork.style.backgroundImage = `url("${game.image}")`;
  artwork.style.backgroundSize = "cover";
  artwork.style.backgroundPosition = "center";
}

const GAMES_PER_PAGE = 6;
let currentPage = 1;

function getSearchQuery() {
    return searchInput.value.trim().toLowerCase();
}

function getSelectedValues(name) {
    const checked = filtersForm.querySelectorAll(
        `input[name="${name}"]:checked`
    );

    return Array.from(checked, (input) => input.value);
}

function filterGames() {
    const query = getSearchQuery();
    const genres = getSelectedValues("genre");
    const platforms = getSelectedValues("platform");
    const years = getSelectedValues("year");

    const ratingInput = filtersForm.querySelector(
        'input[name="rating"]:checked'
    );

    const minimumRating = ratingInput ?
        Number(ratingInput.value) :
        0;

    return games.filter((game) => {
        const searchableText = [
            game.title,
            game.description,
            ...game.genres,
            ...game.platforms
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(query);

        const matchesGenre =
            genres.length === 0 ||
            genres.some((genre) => game.genres.includes(genre));

        const matchesPlatform =
            platforms.length === 0 ||
            platforms.some((platform) =>
                game.platforms.includes(platform)
            );

        const matchesRating = game.rating >= minimumRating;

        const matchesYear =
            years.length === 0 ||
            years.some((year) =>
                year === "earlier" ?
                game.year < 2025 :
                game.year === Number(year)
            );

        return (
            matchesSearch &&
            matchesGenre &&
            matchesPlatform &&
            matchesRating &&
            matchesYear
        );
    });
}

function sortGames(gameList) {
    const sorted = [...gameList];

    switch (sortSelect.value) {
        case "rating":
            return sorted.sort((a, b) => b.rating - a.rating);

        case "newest":
            return sorted.sort((a, b) => b.year - a.year);

        case "title":
            return sorted.sort((a, b) =>
                a.title.localeCompare(b.title)
            );

        default:
            return sorted;
    }
}

function createGameCard(game) {
    const fragment = cardTemplate.content.cloneNode(true);

    const link = fragment.querySelector(".gc-card");
    const title = fragment.querySelector(".gc-card-title");
    const category = fragment.querySelector(".gc-card-category");
    const rating = fragment.querySelector(".gc-card-score");

    const image = fragment.querySelector(".gc-card-image");
    image.style.backgroundImage = `url(${game.image})`;
    image.style.backgroundSize = "cover";
    image.style.backgroundPosition = "center";


    link.href = `./game.html?id=${encodeURIComponent(game.id)}`;
    title.textContent = game.title;
    category.textContent = game.genres.join(", ");
    rating.textContent = game.rating.toFixed(1);

    return fragment;
}

function renderPagination(totalGames) {
    pagination.replaceChildren();

    const totalPages = Math.ceil(totalGames / GAMES_PER_PAGE);

    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = page;
        button.classList.add("page-button");

        if (page === currentPage) {
            button.classList.add("active");
            button.setAttribute("aria-current", "page");
        }

        button.addEventListener("click", () => {
            currentPage = page;
            renderGames();
            gamesList.scrollIntoView({
                behavior: "smooth"
            });
        });

        pagination.appendChild(button);
    }
}

function renderGames() {
    const filtered = filterGames();
    const sorted = sortGames(filtered);

    const totalPages = Math.ceil(
        sorted.length / GAMES_PER_PAGE
    );

    currentPage = Math.max(
        1,
        Math.min(currentPage, totalPages || 1)
    );

    const start = (currentPage - 1) * GAMES_PER_PAGE;
    const visibleGames = sorted.slice(
        start,
        start + GAMES_PER_PAGE
    );

    gamesList.replaceChildren();

    visibleGames.forEach((game) => {
        gamesList.appendChild(createGameCard(game));
    });

    gamesCount.textContent =
        `${filtered.length} game(s) found`;

    emptyMessage.hidden = filtered.length !== 0;

    renderPagination(filtered.length);
}

function updateResults() {
    currentPage = 1;
    renderGames();
}

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateResults();
});

searchInput.addEventListener("input", updateResults);

filtersForm.addEventListener("change", updateResults);

sortSelect.addEventListener("change", updateResults);

function resetFilters() {
    filtersForm.reset();
    searchInput.value = "";
    sortSelect.value = "popular";

    updateResults();
}

document.querySelector("#games-reset")
    .addEventListener("click", resetFilters);

document.querySelector("#games-empty-reset")
    .addEventListener("click", resetFilters);

const params = new URLSearchParams(window.location.search);

const initialQuery = params.get("q");
const initialGenre = params.get("genre");

if (initialQuery) {
    searchInput.value = initialQuery;
}

if (initialGenre) {
    const genreCheckboxes = filtersForm.querySelectorAll(
        'input[name="genre"]'
    );

    genreCheckboxes.forEach((checkbox) => {
        checkbox.checked =
            checkbox.value.toLowerCase() === initialGenre.toLowerCase();
    });
}

renderGames();