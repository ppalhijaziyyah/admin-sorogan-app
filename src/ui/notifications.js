import { DOM } from '../dom.js';

export function showNotification(message, type = 'success') {
    const colors = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600' };
    DOM.notification.message.textContent = message;
    DOM.notification.bar.className = `fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 text-white text-center rounded-b-lg shadow-lg z-50 transform -translate-y-full ${colors[type] || colors.success}`;
    DOM.notification.bar.style.transform = 'translate(-50%, 0)';
    setTimeout(() => { DOM.notification.bar.style.transform = 'translate(-50%, -100%)'; }, 4000);
}
