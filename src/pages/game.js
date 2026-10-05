const STORAGE_KEY = "nextlevel:favorites"

const gameContent = document.querySelector("#game-content");
const favoriteButton = document.querySelector("#favorite-button");
const favoriteFeedback = document.querySelector("#favorite-feedback");
const yearElement = document.querySelector("#game-year");

if(yearElement){
    yearElement.textContent = String(new Date().getFullYear())
}

if(gameContent && favoriteButton && favoriteFeedback){
    const gameId = gameContent.dataset.gameId
    const readFavorites = ()=>{
        const savedValue = localStorage.getItem(STORAGE_KEY)
        const parsedValue = JSON.parse(savedValue)
        return [...new Set(parsedValue.filter((id) => typeof id == "string"))]
    }
    const updateFavoriteButton = ()=>{
        const favorites = readFavorites();
        const isFavorite = favorites.includes(gameId);

        favoriteButton.textContent = isFavorite ? "REMOVE FROM FAVORITES" : "ADD TO FAVORITES"
        favoriteButton.setAttribute("aria-pressed",String(isFavorite));
    }
    favoriteButton.addEventListener("click",()=>{
        const favorites = readFavorites();
        const isFavorite = favorites.includes(gameId);
        const updatedFavorites = isFavorite ? favorites.filter((id) => id !== gameId) : [...favorites, gameId];

        localStorage.setItem(STORAGE_KEY,JSON.stringify(updatedFavorites));
        updateFavoriteButton();
        favoriteFeedback.textContent = isFavorite ? "Removed from your favorites" : "Added to your favorites"
    });
    window.addEventListener("storage",(event)=>{
        if(event.key == STORAGE_KEY || event.key == null){
            updateFavoriteButton()
            favoriteFeedback.textContent = ""
        }
    });
    updateFavoriteButton();
}

export {};