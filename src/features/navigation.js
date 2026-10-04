export function markActiveNavigation() {
    const page = document.body.dataset.page
    const section = page == 'game' ? 'games' : page
  
    document.querySelectorAll('[data-nav]').forEach((link)=>{
      const active = link.dataset.nav == section
      link.classList.toggle('active', active)
      if(active){
        link.setAttribute('aria-current', page == 'game' ? 'location' : 'page')
      }
      else{
        link.removeAttribute('aria-current')
      }
    });
  }
  