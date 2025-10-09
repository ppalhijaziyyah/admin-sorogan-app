import { initApp } from './app.js';
import { initDashboard } from './ui/dashboard.js';
import { initModal } from './ui/modal.js';
import { initTheme } from './ui/theme.js';

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    initDashboard();
    initModal();
    initTheme();
});