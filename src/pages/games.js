import { games } from "../data/games.js";
const STORAGE_KEY = "nextlevel:favorites";
const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");
const game = games.find((item) => item.id === gameId);
const gameContent = document.querySelector("#game-content");
const favoriteButton = document.querySelector("#favorite-button");
const favoriteFeedback = document.querySelector("#favorite-feedback");
const breadcrumb = document.querySelector("#game-breadcrumb");
const title = document.querySelector("#game-title");
const genres = document.querySelector("#game-genres");
const rating = document.querySelector("#game-rating");
const description = document.querySelector("#game-description");
const platforms = document.querySelector("#game-platforms");
const about = document.querySelector("#game-about");

const developer = document.querySelector("#game-developer");
const publisher = document.querySelector("#game-publisher");
const release = document.querySelector("#game-release");
const informationGenres = document.querySelector("#game-information-genres");
const modes = document.querySelector("#game-modes");

if(game){
    gameContent.dataset.gameId = game.id;
    document.title = `${game.title} — NextLevel`;
    breadcrumb.textContent = game.title;
    title.textContent = game.title;
    genres.textContent = game.genres.join(" · ").toUpperCase();
    rating.textContent = game.rating.toFixed(1);
    rating.setAttribute("aria-label",`${game.rating.toFixed(1)} out of 5`)
    description.textContent = game.description;
    about.textContent = game.about;
    platforms.replaceChildren();

    game.platforms.forEach((platform)=>{
        const item = document.createElement("li")
        item.textContent = platform
        platforms.append(item);
    })
    developer.textContent = game.developer
    publisher.textContent = game.publisher
    release.textContent = game.year
    informationGenres.textContent = game.genres.join(", ")
    modes.textContent = game.modes
}
else{
    document.title = "Game not found — NextLevel"
    title.textContent = "Game not found"
    description.textContent = "The game you are looking for does not exist"
    favoriteButton.hidden = true;
}
const readFavorites = () => {
    const savedValue = localStorage.getItem(STORAGE_KEY)
    const parsedValue = JSON.parse(savedValue)
    return [...new Set(parsedValue.filter((id) => typeof id == "string"))]
}

const updateFavoriteButton = ()=>{
    const favorites = readFavorites()
    const isFavorite = favorites.includes(game.id)

    favoriteButton.textContent = isFavorite ? "REMOVE FROM FAVORITES" : "ADD TO FAVORITES"
    favoriteButton.setAttribute("aria-pressed",String(isFavorite))
}
favoriteButton.addEventListener("click",()=>{
    const favorites = readFavorites();
    const isFavorite = favorites.includes(game.id);
    let updatedFavorites;

    if(isFavorite){
        updatedFavorites = favorites.filter((id) => id !== game.id);
    }
    else{
        updatedFavorites = [...favorites,game.id];
    }
    localStorage.setItem(STORAGE_KEY,JSON.stringify(updatedFavorites))
    updateFavoriteButton();
    favoriteFeedback.textContent = isFavorite ? "Removed from your favorites" : "Added to your favorites"
});

window.addEventListener("storage", (event) => {
    if(event.key == STORAGE_KEY || event.key == null){
        updateFavoriteButton()
        favoriteFeedback.textContent = ""
    }
});


updateFavoriteButton();