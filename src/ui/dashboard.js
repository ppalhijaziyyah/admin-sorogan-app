import Sortable from 'sortablejs';
import { DOM } from '../dom.js';
import { state, levelDetails, levelsInOrder } from '../state.js';
import { showModal } from './modal.js';
import { showNotification } from './notifications.js';
import { openEditor } from './editor.js';

function handleLessonCardClick(e) {
    const button = e.target.closest('button[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === 'edit') openEditor(id);
    if (action === 'delete') {
        showModal('Yakin ingin menghapus pelajaran ini dari indeks?', () => {
            state.masterIndex = state.masterIndex.filter(l => l.id !== id);
            state.isIndexDirty = true;
            updateDashboardUIState();
            renderDashboard();
            showNotification("Pelajaran dihapus dari sesi ini. Jangan lupa simpan perubahan indeks.", 'info');
        });
    }
}

function initializeDragAndDrop() {
    document.querySelectorAll('.lesson-grid').forEach(grid => {
        new Sortable(grid, {
            group: 'lessons', animation: 150, handle: '.drag-handle', ghostClass: 'sortable-ghost', chosenClass: 'sortable-chosen',
            onEnd: (evt) => {
                if (evt.oldIndex === evt.newIndex && evt.from === evt.to) return;

                const movedLessonId = evt.item.dataset.id;
                const targetLevel = evt.to.id.replace('grid-', '');

                const movedLesson = state.masterIndex.find(l => l.id === movedLessonId);
                if (movedLesson) movedLesson.level = targetLevel;

                let newMasterIndex = [];
                levelsInOrder.forEach(level => {
                    const gridEl = document.getElementById(`grid-${level}`);
                    if (gridEl) {
                        const idsInGrid = Array.from(gridEl.querySelectorAll('.lesson-card')).map(card => card.dataset.id);
                        const lessonsInGrid = idsInGrid.map(id => state.masterIndex.find(l => l.id === id)).filter(Boolean);
                        newMasterIndex.push(...lessonsInGrid);
                    }
                });
                const renderedIds = newMasterIndex.map(l => l.id);
                const nonRenderedLessons = state.masterIndex.filter(l => !renderedIds.includes(l.id));
                state.masterIndex = [...newMasterIndex, ...nonRenderedLessons];

                state.isIndexDirty = true;
                updateDashboardUIState();
                renderDashboard();
                showNotification('Urutan pelajaran diubah. Simpan perubahan indeks.', 'info');
            }
        });
    });
}

export function renderDashboard() {
    DOM.lessonGroupsContainer.innerHTML = '';
    const groupsToRender = state.activeFilter === 'All' ? levelsInOrder : [state.activeFilter];
    let lessonsFound = false;

    groupsToRender.forEach(level => {
        const lessonsForLevel = state.masterIndex.filter(l => l.level === level);
        if (lessonsForLevel.length === 0 && state.activeFilter !== 'All') return;

        lessonsFound = lessonsForLevel.length > 0 || lessonsFound;
        const section = document.createElement('div');
        section.innerHTML = `<h2 class="text-2xl font-bold mb-4 pb-2 border-b-2 text-${levelDetails[level].color}-700 dark:text-${levelDetails[level].color}-400 border-${levelDetails[level].color}-500">${levelDetails[level].title}</h2>`;

        const gridContainer = document.createElement('div');
        gridContainer.id = `grid-${level}`;
        gridContainer.className = 'lesson-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';

        if (lessonsForLevel.length > 0) {
            lessonsForLevel.forEach(lessonInfo => {
                const card = document.createElement('div');
                card.className = `lesson-card bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4 flex flex-col justify-between border-l-4 border-${levelDetails[level].color}-500`;
                card.dataset.id = lessonInfo.id;
                card.innerHTML = `
                <div class="flex items-start gap-2">
                    <div class="drag-handle text-gray-400 pt-1 cursor-grab"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></div>
                    <div class="flex-grow">
                        <p class="text-sm font-bold text-${levelDetails[level].color}-600 dark:text-${levelDetails[level].color}-400">${lessonInfo.level}</p>
                        <h3 class="text-lg font-bold mt-2 arabic-font text-right">${lessonInfo.titleArabic || ''}</h3>
                        <h4 class="text-md font-semibold">${lessonInfo.title}</h4>
                        <p class="text-sm italic text-gray-500 dark:text-gray-400 mt-2">"${lessonInfo.preview || ''}"</p>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-3">ID: ${lessonInfo.id}</p>
                    </div>
                </div>
                <div class="flex justify-end gap-2 mt-4">
                    <button data-action="edit" data-id="${lessonInfo.id}" class="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-3 rounded">Edit</button>
                    <button data-action="delete" data-id="${lessonInfo.id}" class="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-3 rounded">Hapus</button>
                </div>
            `;
                gridContainer.appendChild(card);
            });
        } else {
            gridContainer.innerHTML = `<p class="text-gray-500 dark:text-gray-400 text-center col-span-full">Tidak ada pelajaran.</p>`;
        }
        section.appendChild(gridContainer);
        DOM.lessonGroupsContainer.appendChild(section);
    });

    if (!lessonsFound && state.activeFilter !== 'All') {
        DOM.lessonGroupsContainer.innerHTML = `<p class="text-gray-500 text-center col-span-full">Tidak ada pelajaran untuk tingkatan ini.</p>`;
    }
    initializeDragAndDrop();
}

export function updateDashboardUIState() {
    DOM.saveMasterIndexBtn.disabled = !state.isIndexDirty;
    DOM.saveMasterIndexBtn.classList.toggle('dirty', state.isIndexDirty);
}

function handleTabClick(e) {
    if (e.target.matches('.tab')) {
        state.activeFilter = e.target.dataset.level;
        DOM.tabContainer.querySelector('.active')?.classList.remove('active');
        e.target.classList.add('active');
        renderDashboard();
    }
}

function handleSort(direction) {
    if (state.masterIndex.length === 0) {
        showNotification("Tidak ada pelajaran untuk diurutkan.", 'info');
        return;
    }

    state.masterIndex.sort((a, b) => {
        const pathA = a.path || '';
        const pathB = b.path || '';

        if (pathA.toLowerCase() < pathB.toLowerCase()) {
            return direction === 'asc' ? -1 : 1;
        }
        if (pathA.toLowerCase() > pathB.toLowerCase()) {
            return direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    state.isIndexDirty = true;
    updateDashboardUIState();
    renderDashboard();
    showNotification(`Pelajaran diurutkan berdasarkan nama file (${direction === 'asc' ? 'A-Z' : 'Z-A'}). Jangan lupa simpan perubahan.`, 'info');
}

export function renderTabButtons() {
    const buttons = [{ level: 'All', text: 'Semua' }, ...levelsInOrder.map(l => ({ level: l, text: l }))];
    DOM.tabContainer.innerHTML = buttons.map(btn => `
    <button data-level="${btn.level}" class="tab py-3 px-6 font-semibold border-b-4 border-transparent whitespace-nowrap ${btn.level === state.activeFilter ? 'active' : ''}">
        ${btn.text}
    </button>
`).join('');
}

export function initDashboard() {
    DOM.tabContainer.addEventListener('click', handleTabClick);
    DOM.lessonGroupsContainer.addEventListener('click', handleLessonCardClick);
    DOM.sortAscBtn.addEventListener('click', () => handleSort('asc'));
    DOM.sortDescBtn.addEventListener('click', () => handleSort('desc'));
}
