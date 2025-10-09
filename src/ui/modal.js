import { DOM } from '../dom.js';

function hideModal() {
    DOM.modal.container.classList.add('hidden');
}

export function showModal(message, onConfirm) {
    DOM.modal.message.textContent = message;
    const newConfirmBtn = DOM.modal.confirmBtn.cloneNode(true);
    DOM.modal.confirmBtn.parentNode.replaceChild(newConfirmBtn, DOM.modal.confirmBtn);
    DOM.modal.confirmBtn = newConfirmBtn;
    DOM.modal.confirmBtn.onclick = () => { onConfirm(); hideModal(); };
    DOM.modal.container.classList.remove('hidden');
}

export function initModal() {
    DOM.modal.cancelBtn.addEventListener('click', hideModal);
}
