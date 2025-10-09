import * as XLSX from 'xlsx';
import { DOM } from './dom.js';
import { state } from './state.js';
import { renderDashboard, renderTabButtons, updateDashboardUIState } from './ui/dashboard.js';
import { openEditor, renderEditor } from './ui/editor.js';
import { showNotification } from './ui/notifications.js';
import { downloadFile } from './utils/file.js';
import { removeHarakat } from './utils/text.js';

export function switchView(viewName) {
    DOM.dashboardView.style.display = viewName === 'dashboard' ? 'block' : 'none';
    DOM.editorView.style.display = viewName === 'editor' ? 'block' : 'none';
}

function handleMasterIndexUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (re) => {
        try {
            state.masterIndex = JSON.parse(re.target.result);
            DOM.dashboardContent.style.display = 'block';
            state.isIndexDirty = false;
            updateDashboardUIState();
            renderDashboard();
            showNotification("File Indeks Utama berhasil dimuat!", 'success');
        } catch (err) {
            showNotification("Gagal memuat file. Pastikan format master-index.json benar.", 'error');
        }
    };
    reader.readAsText(file);
}

function handleSaveIndex() {
    if (!state.isIndexDirty) return;
    downloadFile(JSON.stringify(state.masterIndex, null, 2), 'master-index.json', 'application/json');
    state.isIndexDirty = false;
    updateDashboardUIState();
    showNotification("File master-index.json telah diperbarui dan diunduh!", 'success');
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop().toLowerCase();

    reader.onload = (e) => {
        try {
            if (fileExtension === 'json') {
                state.currentLessonData = JSON.parse(e.target.result);
                if (!Array.isArray(state.currentLessonData.textData) || !Array.isArray(state.currentLessonData.textData[0])) {
                    state.currentLessonData.textData = [state.currentLessonData.textData];
                }
            } else if (['xlsx', 'csv'].includes(fileExtension)) {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'array' });

                const infoSheetName = workbook.SheetNames.find(name => name.toLowerCase() === 'info');
                if (!infoSheetName) throw new Error("Sheet 'Info' tidak ditemukan.");
                const infoData = XLSX.utils.sheet_to_json(workbook.Sheets[infoSheetName], { raw: true }).reduce((obj, item) => {
                    const key = Object.keys(item).find(k => k.trim().toLowerCase() === 'kunci');
                    const value = Object.keys(item).find(k => k.trim().toLowerCase() === 'nilai');
                    if (key && value && item[key]) obj[item[key]] = item[value];
                    return obj;
                }, {});

                const materiSheetName = workbook.SheetNames.find(name => name.toLowerCase() === 'materi');
                if (!materiSheetName) throw new Error("Sheet 'Materi' tidak ditemukan.");
                const materiJson = XLSX.utils.sheet_to_json(workbook.Sheets[materiSheetName], { raw: true });
                const newTextData = [[]];
                let pIndex = 0;
                materiJson.forEach(row => {
                    const berharakat = row.berharakat || '';
                    if (berharakat.trim() === '---') {
                        if (newTextData[pIndex].length > 0) {
                            pIndex++;
                            newTextData[pIndex] = [];
                        }
                        return;
                    }
                    newTextData[pIndex].push({
                        berharakat: berharakat,
                        gundul: removeHarakat(berharakat),
                        terjemahan: row.terjemahan || '',
                        irab: row.irab || ''
                    });
                });

                let newQuizData = [];
                const kuisSheetName = workbook.SheetNames.find(name => name.toLowerCase() === 'kuis');
                if (kuisSheetName) {
                    newQuizData = XLSX.utils.sheet_to_json(workbook.Sheets[kuisSheetName], { raw: true }).map(row => ({
                        question: row.question || '', context: row.context || '',
                        options: [row.option1 || '', row.option2 || '', row.option3 || '', row.option4 || ''],
                        correctAnswer: parseInt(row.correctAnswer, 10) || 0,
                        explanation: row.explanation || ''
                    }));
                }

                const rawLevel = (infoData['Level'] || 'Ibtidai').trim().toLowerCase();
                let normalizedLevel = 'Ibtida’i';
                if (rawLevel === 'mutawassit') normalizedLevel = 'Mutawassit';
                else if (rawLevel === 'mutaqaddim') normalizedLevel = 'Mutaqaddim';

                state.currentLessonData = {
                    title: infoData['Judul Latin'] || "", titleArabic: infoData['Judul Arab'] || "",
                    level: normalizedLevel, textData: newTextData, quizData: newQuizData,
                    fullTranslation: infoData['Terjemahan Lengkap'] || "", reference: infoData['Referensi'] || ""
                };
            }
            state.editingLessonId = null;
            renderEditor('Impor & Review Pelajaran');
        } catch (error) {
            showNotification(`Gagal memproses file: ${error.message}`, 'error');
        }
    };

    if (fileExtension === 'json') reader.readAsText(file);
    else reader.readAsArrayBuffer(file);
    event.target.value = '';
}

function setupGlobalEventListeners() {
    DOM.masterIndexUploader.addEventListener('change', handleMasterIndexUpload);
    DOM.addLessonBtn.addEventListener('click', () => openEditor());
    DOM.importUploader.addEventListener('change', handleImport);
    DOM.saveMasterIndexBtn.addEventListener('click', handleSaveIndex);
}

export function initApp() {
    renderTabButtons();
    setupGlobalEventListeners();
}
