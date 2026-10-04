import { markActiveNavigation } from './features/navigation.js';

markActiveNavigation();

const year = document.querySelector('[data-year]');
if (year) {
  year.textContent = String(new Date().getFullYear());
}
