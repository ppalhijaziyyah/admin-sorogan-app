import { DOM } from '../dom.js';

function loadTheme() {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        DOM.theme.lightIcon.classList.add('hidden');
        DOM.theme.darkIcon.classList.remove('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        DOM.theme.lightIcon.classList.remove('hidden');
        DOM.theme.darkIcon.classList.add('hidden');
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    loadTheme();
}

export function initTheme() {
    loadTheme();
    DOM.theme.toggleBtn.addEventListener('click', toggleTheme);
}
