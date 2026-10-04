const forms = document.querySelectorAll('[data-home-search]');
const cards = document.querySelectorAll('[data-game-card]');
const status = document.querySelector('#search-status');
const message = document.querySelector('#search-message');
const clearButton = document.querySelector('#clear-search');

const filterGames = (value)=>{
  const query = value.trim().toLowerCase();
  const words = query.split(/\s+/).filter(Boolean);
  let count = 0;

  cards.forEach((card) => {
    const matches = words.every((word) => card.dataset.search.includes(word));
    card.hidden = !matches;
    if(matches){
      count += 1;
    }
  });

  forms.forEach((form) => {
    form.elements.q.value = value;
  })
  status.hidden = !query
  message.textContent = count ? `${count} ${count == 1 ? 'game' : 'games'} found for “${value.trim()}”` : `No games found for “${value.trim()}”. Try a title, genre, or platform`

  const url = new URL(window.location.href)
  if(query){
    url.searchParams.set('q', value.trim())
  }
  else{
    url.searchParams.delete('q')
  }
  window.history.replaceState(null, '', url)
}

forms.forEach((form)=>{
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    filterGames(form.elements.q.value);
    if (!status.hidden) {
      status.scrollIntoView({ block: 'center' });
    }
  });
  form.elements.q.addEventListener('input',()=>{
    if(!form.elements.q.value){
      filterGames('');
    }
  });
});

clearButton.addEventListener('click',()=>{
  filterGames('');
  document.querySelector('#hero-query').focus();
});

const initialQuery = new URLSearchParams(window.location.search).get('q');
if(initialQuery){
  filterGames(initialQuery);
}
