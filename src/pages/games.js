
const games = [
    {
        id: "echoes-of-aether",
        title: "Echoes of Aether",
        genres: ["Adventure", "RPG"],
        platforms: ["PC", "Console"],
        rating: 4.8,
        year: 2026,
    },
    {
        id: "neon-drift",
        title: "Neon Drift",
        genres: ["Action"],
        platforms: ["PC", "Console"],
        rating: 4.6,
        year: 2026,
    },
    {
        id: "wildwood",
        title: "Wildwood",
        genres: ["Adventure"],
        platforms: ["PC"],
        rating: 4.7,
        year: 2025,
    },
    {
        id: "orbit-breaker",
        title: "Orbit Breaker",
        genres: ["Action"],
        platforms: ["PC", "Console"],
        rating: 4.5,
        year: 2026,
    },
    {
        id: "kingdom-tactics",
        title: "Kingdom Tactics",
        genres: ["Strategy", "RPG"],
        platforms: ["PC"],
        rating: 4.6,
        year: 2025,
    },
    {
        id: "summit-rally",
        title: "Summit Rally",
        genres: ["Action"],
        platforms: ["PC", "Console"],
        rating: 4.4,
        year: 2024,
    },
    {
        id: "moonlit-vale",
        title: "Moonlit Vale",
        genres: ["Adventure", "RPG"],
        platforms: ["PC", "Console"],
        rating: 4.7,
        year: 2025,
    },
    {
        id: "pixel-quest",
        title: "Pixel Quest",
        genres: ["Adventure"],
        platforms: ["PC", "Mobile"],
        rating: 4.3,
        year: 2024,
    },
    {
        id: "skybound",
        title: "Skybound",
        genres: ["Adventure"],
        platforms: ["PC", "Console"],
        rating: 4.6,
        year: 2026,
    },
    {
        id: "emberfall",
        title: "Emberfall",
        genres: ["Action", "RPG"],
        platforms: ["PC", "Console"],
        rating: 4.2,
        year: 2025,
    },
    {
        id: "iron-frontier",
        title: "Iron Frontier",
        genres: ["Strategy"],
        platforms: ["PC"],
        rating: 4.1,
        year: 2024,
    },
    {
        id: "crystal-cove",
        title: "Crystal Cove",
        genres: ["Adventure"],
        platforms: ["Mobile"],
        rating: 3.9,
        year: 2026,
    },
    {
        id: "shadow-circuit",
        title: "Shadow Circuit",
        genres: ["Action"],
        platforms: ["PC", "Console"],
        rating: 4.4,
        year: 2025,
    },
    {
        id: "tiny-kingdoms",
        title: "Tiny Kingdoms",
        genres: ["Strategy"],
        platforms: ["Mobile"],
        rating: 3.8,
        year: 2024,
    },
    {
        id: "astral-chronicles",
        title: "Astral Chronicles",
        genres: ["RPG"],
        platforms: ["PC", "Console"],
        rating: 4.5,
        year: 2026,
    },
    {
        id: "forest-keepers",
        title: "Forest Keepers",
        genres: ["Adventure", "Strategy"],
        platforms: ["PC", "Mobile"],
        rating: 4.0,
        year: 2025,
    },
    {
        id: "pocket-raiders",
        title: "Pocket Raiders",
        genres: ["Action", "RPG"],
        platforms: ["Mobile"],
        rating: 3.6,
        year: 2023,
    },
    {
        id: "frozen-horizon",
        title: "Frozen Horizon",
        genres: ["Adventure"],
        platforms: ["PC", "Console"],
        rating: 4.2,
        year: 2024,
    },
]
const PAGE_SIZE = 9;

const searchForm = document.querySelector("#games-search");
const searchInput = document.querySelector("#games-query");
const headerSearchForm = document.querySelector("#games-header-search");
const headerSearchInput = document.querySelector("#games-header-query");
const filtersForm = document.querySelector("#games-filters");
const sortSelect = document.querySelector("#games-sort");
const gamesList = document.querySelector("#games-list");
const gamesCount = document.querySelector("#games-count");
const emptyState = document.querySelector("#games-empty");
const pagination = document.querySelector("#games-pagination");
const cardTemplate = document.querySelector("#games-card-template");
const resetButton = document.querySelector("#games-reset");
const emptyResetButton = document.querySelector("#games-empty-reset");
const yearElement = document.querySelector("#games-year");
const params = new URLSearchParams(window.location.search);
  
let currentPage = 1;
let currentQuery = params.get("q")?.trim() ?? ""

searchInput.value = currentQuery
headerSearchInput.value = currentQuery
yearElement.textContent = String(new Date().getFullYear())
const getSelectedValues = (name)=>{
    return Array.from(filtersForm.querySelectorAll(`input[name="${name}"]:checked`),(input)=>{input.value})
}
const getFilteredGames = ()=>{
    const selectedGenres = getSelectedValues("genre")
    const selectedPlatforms = getSelectedValues("platform")
    const selectedYears = getSelectedValues("year")
    const selectedRating = filtersForm.querySelector('input[name="rating"]:checked')
  
    const minimumRating = Number(selectedRating?.value ?? 0)
    const searchWords = currentQuery.toLowerCase().split(/\s+/).filter(Boolean)
    const filteredGames = games.filter((game)=>{
        const searchableText = [
            game.title,
            ...game.genres,
            ...game.platforms,
            game.year,
        ].join(" ").toLowerCase();
        const matchesSearch = searchWords.every((word) => {
            searchableText.includes(word)
        });
        const matchesGenre = selectedGenres.length == 0 || selectedGenres.some((genre) => game.genres.includes(genre))
        const matchesPlatform = selectedPlatforms.length == 0 || selectedPlatforms.some((platform)=>{
            game.platforms.includes(platform)
        });
        const matchesYear = selectedYears.length == 0 || selectedYears.some((year) => {
            if(year == "earlier"){
                return game.year < 2025
            }
            return game.year == Number(year)
        })
        const matchesRating = game.rating >= minimumRating
        return (
            matchesSearch &&
            matchesGenre &&
            matchesPlatform &&
            matchesYear &&
            matchesRating
        )
    })
    switch(sortSelect.value){
      case "rating":
        filteredGames.sort((a,b)=>{b.rating - a.rating});
        break
      case "newest":
        filteredGames.sort((a,b)=>{b.year - a.year});
        break
      case "title":
        filteredGames.sort((a,b)=>{
            a.title.localeCompare(b.title,"en")
        });
        break
    }
    return filteredGames;
}
const createGameCard = (game)=>{
    const card = cardTemplate.content.cloneNode(true);
    const link = card.querySelector(".gc-card")
    const title = card.querySelector(".gc-card-title")
    const category = card.querySelector(".gc-card-category")
    const score = card.querySelector(".gc-card-score")
    const rating = card.querySelector(".gc-card-rating")
    link.href = `./game.html?id=${encodeURIComponent(game.id)}`
    title.textContent = game.title;
    category.textContent = `${game.genres[0]} · ${game.platforms[0]}`
    score.textContent = game.rating.toFixed(1)
    rating.setAttribute("aria-label",`Rating: ${game.rating.toFixed(1)} out of 5`)
  
    return card
}

const createPageButton = (text, page, label,disabled = false)=>{
    const button = document.createElement("button");
    button.type = "button"
    button.textContent = text
    button.disabled = disabled
    button.setAttribute("aria-label",label)
  
    if(page == currentPage && text === String(page)){
      button.setAttribute("aria-current","page")
    }
  
    button.addEventListener("click",()=>{
      currentPage = page
      renderGames();
      pagination.querySelector('[aria-current="page"]')?.focus()
    });
  
    return button
  }
const renderPagination = (totalPages)=>{
    pagination.replaceChildren()
    pagination.hidden = totalPages <= 1;
  
    if (totalPages <= 1) {
      return;
    }
  
    pagination.append(createPageButton("←",currentPage - 1,"Previous page",currentPage == 1))
    for (let page = 1; page <= totalPages; page += 1){
      pagination.append(createPageButton(String(page), page, `Page ${page}`))
    }
    pagination.append(createPageButton("→",currentPage + 1,"Next page",currentPage == totalPages))
}

const renderGames = ()=>{
    const filteredGames = getFilteredGames()
    const totalPages = Math.ceil(filteredGames.length / PAGE_SIZE)
    currentPage = Math.min(currentPage, Math.max(1, totalPages))
    const startIndex = (currentPage - 1) * PAGE_SIZE
    const visibleGames = filteredGames.slice(startIndex,startIndex + PAGE_SIZE)
    const cards = document.createDocumentFragment()
  
    visibleGames.forEach((game) => {
      cards.append(createGameCard(game))
    });
  
    gamesList.replaceChildren(cards)
    gamesCount.textContent = `${filteredGames.length} ` + (filteredGames.length == 1 ? "game" : "games");
    emptyState.hidden = filteredGames.length > 0;
    renderPagination(totalPages);
}

const applySearch = (value)=>{
    currentQuery = value.trim();
    currentPage = 1;
    searchInput.value = currentQuery;
    headerSearchInput.value = currentQuery;
    renderGames();
}
searchForm.addEventListener("submit",(event)=>{
    event.preventDefault()
    applySearch(searchInput.value)
})
headerSearchForm.addEventListener("submit",(event)=>{
    event.preventDefault()
    applySearch(headerSearchInput.value)
})
filtersForm.addEventListener("change",()=>{
    currentPage = 1;
    renderGames();
})
filtersForm.addEventListener("submit",(event)=>{
    event.preventDefault();
})
sortSelect.addEventListener("change",()=>{
    currentPage = 1;
    renderGames();
});

function resetCatalog() {
    filtersForm.reset();
    sortSelect.value = "popular";
    applySearch("");
}

resetButton.addEventListener("click", resetCatalog)
emptyResetButton.addEventListener("click",()=>{
    resetCatalog()
    searchInput.focus()
});
  
renderGames();