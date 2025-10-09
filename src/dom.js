export const DOM = {
    dashboardView: document.getElementById('dashboard-view'),
    editorView: document.getElementById('editor-view'),
    masterIndexUploader: document.getElementById('master-index-uploader'),
    dashboardContent: document.getElementById('dashboard-content'),
    tabContainer: document.getElementById('tab-container'),
    lessonGroupsContainer: document.getElementById('lesson-groups-container'),
    addLessonBtn: document.getElementById('add-lesson-btn'),
    importUploader: document.getElementById('import-uploader'),
    saveMasterIndexBtn: document.getElementById('save-master-index-btn'),
    sortAscBtn: document.getElementById('sort-asc-btn'),
    sortDescBtn: document.getElementById('sort-desc-btn'),
    notification: {
        bar: document.getElementById('notification-bar'),
        message: document.getElementById('notification-message'),
    },
    modal: {
        container: document.getElementById('confirmation-modal'),
        message: document.getElementById('modal-message'),
        cancelBtn: document.getElementById('modal-cancel-btn'),
        confirmBtn: document.getElementById('modal-confirm-btn'),
    },
    theme: {
        toggleBtn: document.getElementById('theme-toggle-btn'),
        lightIcon: document.getElementById('theme-icon-light'),
        darkIcon: document.getElementById('theme-icon-dark'),
    },
};
