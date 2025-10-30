import { DOM } from '../dom.js';
import { state } from '../state.js';
import { showModal } from './modal.js';
import { showNotification } from './notifications.js';
import { downloadFile } from '../utils/file.js';
import { removeHarakat } from '../utils/text.js';
import { switchView } from '../app.js';
import { renderDashboard, updateDashboardUIState } from './dashboard.js';

export function renderEditor(title) {
    DOM.editorView.innerHTML = `
    <header class="flex justify-between items-center mb-8">
        <button id="back-to-dashboard-btn" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">← Kembali</button>
        <h1 id="editor-title" class="text-3xl font-bold text-teal-600 dark:text-teal-400">${title}</h1>
        <div></div>
    </header>
    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-2xl font-bold mb-4">Informasi Dasar</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label for="lesson-title-latin" class="block text-sm font-medium">Judul (Latin)</label><input type="text" id="lesson-title-latin" class="mt-1 w-full rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-600"></div>
            <div><label for="lesson-title-arabic" class="block text-sm font-medium text-right">Judul (Arab)</label><input type="text" id="lesson-title-arabic" class="mt-1 w-full rounded-md text-right arabic-font text-xl border-gray-300 dark:bg-gray-800 dark:border-gray-600"></div>
            <div><label for="lesson-manual-number" class="block text-sm font-medium">No. Urut Berkas (Opsional)</label><input type="text" id="lesson-manual-number" class="mt-1 w-full rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-600" placeholder="cth: 1, 01, 2a"></div>
            <div><label for="lesson-level" class="block text-sm font-medium">Tingkatan</label><select id="lesson-level" class="mt-1 w-full rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-600"><option>Ibtida’i</option><option>Mutawassit</option><option>Mutaqaddim</option></select></div>
        </div>
        <div class="mt-6"><label for="lesson-full-translation" class="block text-sm font-medium">Terjemahan Keseluruhan (Opsional)</label><textarea id="lesson-full-translation" rows="3" class="mt-1 w-full rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-600"></textarea></div>
        <div class="mt-6"><label for="lesson-reference" class="block text-sm font-medium">Referensi/Sumber Teks (Opsional)</label><input type="text" id="lesson-reference" class="mt-1 w-full rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-600"></div>
    </div>
    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-2xl font-bold mb-4">Teks Pelajaran</h2>
        <p class="text-sm text-gray-500 mb-2 dark:text-gray-400">Masukkan teks lengkap di sini. Gunakan baris kosong untuk memisahkan paragraf.</p>
        <textarea id="lesson-full-text" rows="8" class="w-full p-2 border rounded-md arabic-text text-2xl text-right border-gray-300 dark:bg-gray-800 dark:border-gray-600"></textarea>
        <button id="process-text-btn" class="mt-2 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded">Proses Teks</button>
        <h3 class="text-xl font-semibold mt-6 mb-4">Editor Kata per Kata</h3>
        <div id="word-editor-container" class="space-y-8"></div>
    </div>
    <div id="quiz-editor-section" class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-2xl font-bold mb-4">Pembuat Kuis</h2>
        <div class="space-y-4 p-4 border border-gray-200 dark:border-gray-600 rounded-md">
            <h3 id="quiz-form-title" class="text-xl font-semibold">Tambah Pertanyaan Baru</h3>
            <div><label for="quiz-question" class="block text-sm font-medium">Pertanyaan</label><input type="text" id="quiz-question" class="mt-1 w-full rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-600"></div>
            <div><label for="quiz-context" class="block text-sm font-medium">Konteks (opsional, teks Arab)</label><input type="text" id="quiz-context" class="mt-1 w-full rounded-md arabic-font text-right border-gray-300 dark:bg-gray-800 dark:border-gray-600"></div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label for="quiz-opt-1" class="block text-sm font-medium">Opsi 1</label><input type="text" id="quiz-opt-1" class="mt-1 w-full rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-600"></div>
                <div><label for="quiz-opt-2" class="block text-sm font-medium">Opsi 2</label><input type="text" id="quiz-opt-2" class="mt-1 w-full rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-600"></div>
                <div><label for="quiz-opt-3" class="block text-sm font-medium">Opsi 3</label><input type="text" id="quiz-opt-3" class="mt-1 w-full rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-600"></div>
                <div><label for="quiz-opt-4" class="block text-sm font-medium">Opsi 4</label><input type="text" id="quiz-opt-4" class="mt-1 w-full rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-600"></div>
            </div>
            <div><label for="quiz-correct" class="block text-sm font-medium">Jawaban Benar</label><select id="quiz-correct" class="mt-1 w-full rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-600"><option value="0">Opsi 1</option><option value="1">Opsi 2</option><option value="2">Opsi 3</option><option value="3">Opsi 4</option></select></div>
            <div><label for="quiz-explanation" class="block text-sm font-medium">Penjelasan Jawaban (opsional)</label><textarea id="quiz-explanation" rows="2" class="mt-1 w-full rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-600"></textarea></div>
            <div id="quiz-form-buttons" class="flex items-center gap-4"><button id="quiz-submit-btn" class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg">Tambah Pertanyaan</button></div>
        </div>
        <div class="mt-6"><h3 class="text-xl font-semibold">Daftar Pertanyaan</h3><div id="quiz-list-container" class="mt-2 space-y-3"></div></div>
    </div>
    <div class="mt-8 text-center"><button id="save-lesson-btn" class="w-full md:w-1/2 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-xl">Simpan & Unduh File Pelajaran</button></div>
    `;

    populateEditorForm();
    switchView('editor');
    setupEditorEventListeners();
}

function populateEditorForm() {
    document.getElementById('lesson-title-latin').value = state.currentLessonData.title;
    document.getElementById('lesson-title-arabic').value = state.currentLessonData.titleArabic;
    document.getElementById('lesson-manual-number').value = '';
    document.getElementById('lesson-level').value = state.currentLessonData.level || 'Ibtida’i';
    const fullText = (state.currentLessonData.textData || [[]])
        .map(paragraph => paragraph.map(word => word.berharakat).join(' '))
        .join('\n\n');
    document.getElementById('lesson-full-text').value = fullText;
    document.getElementById('lesson-full-translation').value = state.currentLessonData.fullTranslation || '';
    document.getElementById('lesson-reference').value = state.currentLessonData.reference || '';
    renderWordEditors();
    renderQuizList();
}

function renderWordEditors() {
    const container = document.getElementById('word-editor-container');
    container.innerHTML = '';
    if (!state.currentLessonData.textData || state.currentLessonData.textData.length === 0) {
        state.currentLessonData.textData = [[]];
    }

    // Add headers
    const header = document.createElement('div');
    header.className = 'p-3 grid grid-cols-1 md:grid-cols-5 gap-3 items-center font-bold text-sm text-gray-600 dark:text-gray-400 border-b-2 border-gray-300 dark:border-gray-600';
    header.innerHTML = `
        <div class="text-right">Teks Arab</div>
        <div>Terjemahan</div>
        <div class="text-right">I'rab</div>
        <div>Link (Opsional)</div>
        <div class="text-center">Aksi</div>
    `;
    container.appendChild(header);


    state.currentLessonData.textData.forEach((paragraph, pIndex) => {
        const paragraphWrapper = document.createElement('fieldset');
        paragraphWrapper.className = 'border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4';
        paragraphWrapper.innerHTML = `<legend class="px-2 font-semibold text-lg">Paragraf ${pIndex + 1}</legend>`;

        paragraph.forEach((word, wIndex) => {
            const isPunctuation = /[.،؟:!()"«»]/.test(word.berharakat) && word.berharakat.length === 1;
            const wordDiv = document.createElement('div');
            wordDiv.className = 'p-3 border-t first:border-t-0 border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-5 gap-3 items-center';

            const arabicInput = document.createElement('input');
            arabicInput.type = 'text';
            arabicInput.value = word.berharakat;
            arabicInput.className = 'w-full border-gray-300 rounded-md arabic-font text-2xl text-right dark:bg-gray-800 dark:border-gray-600';
            arabicInput.oninput = (e) => {
                const newVocalizedText = e.target.value;
                state.currentLessonData.textData[pIndex][wIndex].berharakat = newVocalizedText;
                state.currentLessonData.textData[pIndex][wIndex].gundul = removeHarakat(newVocalizedText);
            };

            const translationInput = document.createElement('input');
            translationInput.type = 'text';
            translationInput.value = word.terjemahan || '';
            translationInput.className = 'w-full border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600';
            translationInput.oninput = (e) => { state.currentLessonData.textData[pIndex][wIndex].terjemahan = e.target.value; };
            translationInput.disabled = isPunctuation;

            const irabInput = document.createElement('textarea');
            irabInput.rows = '1';
            irabInput.value = word.irab || '';
            irabInput.className = 'w-full border-gray-300 rounded-md arabic-font text-right dark:bg-gray-800 dark:border-gray-600';
            irabInput.oninput = (e) => { state.currentLessonData.textData[pIndex][wIndex].irab = e.target.value; };
            irabInput.disabled = isPunctuation;

            const linkInput = document.createElement('input');
            linkInput.type = 'text';
            linkInput.placeholder = 'https://...';
            linkInput.value = word.link || '';
            linkInput.className = 'w-full border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600';
            linkInput.oninput = (e) => { state.currentLessonData.textData[pIndex][wIndex].link = e.target.value; };
            linkInput.disabled = isPunctuation;

            const actionDiv = document.createElement('div');
            actionDiv.className = 'flex items-center justify-center gap-2';
            actionDiv.innerHTML = `
            <button data-action="add-word" data-pindex="${pIndex}" data-windex="${wIndex}" class="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center" title="Tambah Baris di Bawah">+</button>
            <button data-action="delete-word" data-pindex="${pIndex}" data-windex="${wIndex}" class="bg-red-500 hover:red-600 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center" title="Hapus Baris Ini">-</button>
        `;

            wordDiv.append(arabicInput, translationInput, irabInput, linkInput, actionDiv);
            paragraphWrapper.appendChild(wordDiv);
        });
        container.appendChild(paragraphWrapper);
    });
}

function setupEditorEventListeners() {
    document.getElementById('back-to-dashboard-btn').addEventListener('click', () => {
        showModal("Yakin kembali? Perubahan yang belum disimpan akan hilang.", () => switchView('dashboard'));
    });
    document.getElementById('save-lesson-btn').addEventListener('click', handleSaveLesson);
    document.getElementById('process-text-btn').addEventListener('click', handleProcessText);
    document.getElementById('quiz-submit-btn').addEventListener('click', handleQuizSubmit);

    document.getElementById('word-editor-container').addEventListener('click', e => {
        const addBtn = e.target.closest('[data-action="add-word"]');
        const deleteBtn = e.target.closest('[data-action="delete-word"]');
        if (addBtn) addWordRow(parseInt(addBtn.dataset.pindex), parseInt(addBtn.dataset.windex));
        if (deleteBtn) deleteWordRow(parseInt(deleteBtn.dataset.pindex), parseInt(deleteBtn.dataset.windex));
    });

    document.getElementById('quiz-list-container').addEventListener('click', e => {
        const editBtn = e.target.closest('[data-action="edit-quiz"]');
        const deleteBtn = e.target.closest('[data-action="delete-quiz"]');
        if (editBtn) populateQuizFormForEdit(parseInt(editBtn.dataset.index));
        if (deleteBtn) {
            const index = parseInt(deleteBtn.dataset.index);
            showModal(`Yakin ingin menghapus pertanyaan ${index + 1}?`, () => {
                state.currentLessonData.quizData.splice(index, 1);
                renderQuizList();
            });
        }
    });
}

function handleProcessText() {
    const fullText = document.getElementById('lesson-full-text').value.trim();
    const paragraphs = fullText.split(/\n\s*\n/).filter(p => p.trim() !== '');
    state.currentLessonData.textData = paragraphs.map(p => {
        const textWithSpacedPunctuation = p.replace(/([.،؟:!()"«»])/g, ' $1 ');
        const tokens = textWithSpacedPunctuation.split(/\s+/).filter(Boolean);
        return tokens.map(token => ({
            berharakat: token,
            gundul: removeHarakat(token),
            terjemahan: '',
            irab: '',
            link: ''
        }));
    });
    renderWordEditors();
}

function addWordRow(pIndex, wIndex) {
    const newWord = { berharakat: "", gundul: "", terjemahan: "", irab: "", link: "" };
    state.currentLessonData.textData[pIndex].splice(wIndex + 1, 0, newWord);
    renderWordEditors();
}

function deleteWordRow(pIndex, wIndex) {
    if (state.currentLessonData.textData[pIndex].length > 1) {
        state.currentLessonData.textData[pIndex].splice(wIndex, 1);
    } else if (state.currentLessonData.textData.length > 1) {
        state.currentLessonData.textData.splice(pIndex, 1);
    } else {
        showNotification("Tidak dapat menghapus baris terakhir dari paragraf terakhir.", 'error');
    }
    renderWordEditors();
}

function handleSaveLesson() {
    const newTitle = document.getElementById('lesson-title-latin').value;
    const newTitleArabic = document.getElementById('lesson-title-arabic').value;
    const newLevel = document.getElementById('lesson-level').value;
    if (!newTitle || !newTitleArabic) {
        showNotification("Judul pelajaran (Latin dan Arab) wajib diisi.", 'error');
        return;
    }

    state.currentLessonData.title = newTitle;
    state.currentLessonData.titleArabic = newTitleArabic;
    state.currentLessonData.level = newLevel;
    state.currentLessonData.fullTranslation = document.getElementById('lesson-full-translation').value;
    state.currentLessonData.reference = document.getElementById('lesson-reference').value;

    const fullTextForPreview = state.currentLessonData.textData.flat().map(w => w.berharakat).join(' ');
    const gundulTextForPreview = removeHarakat(fullTextForPreview);
    const previewText = gundulTextForPreview.substring(0, 50) + (gundulTextForPreview.length > 50 ? '...' : '');

    const levelMap = { 'Ibtida’i': 1, 'Mutawassit': 2, 'Mutaqaddim': 3 };
    const levelPathMap = { 'Ibtida’i': '1-ibtidai', 'Mutawassit': '2-mutawassit', 'Mutaqaddim': '3-mutaqaddim' };
    const levelNumber = levelMap[newLevel] || 0;
    const sanitizedTitle = newTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-');
    const manualNumber = document.getElementById('lesson-manual-number').value.trim();
    
    const fileNameParts = [levelNumber];
    if (manualNumber) {
        fileNameParts.push(manualNumber.replace(/[^a-z0-9-]/g, ''));
    }
    fileNameParts.push(sanitizedTitle);

    const lessonFileName = `${fileNameParts.join('-')}.json`;
    const newPath = `data/${levelPathMap[newLevel]}/${lessonFileName}`;

    const lessonJSON = JSON.stringify(state.currentLessonData, null, 2);

    if (state.editingLessonId) {
        const indexToUpdate = state.masterIndex.findIndex(l => l.id === state.editingLessonId);
        if (indexToUpdate !== -1) {
            state.masterIndex[indexToUpdate] = { ...state.masterIndex[indexToUpdate], title: newTitle, titleArabic: newTitleArabic, level: newLevel, preview: previewText, path: newPath, lastModified: new Date().toISOString() };
        }
    } else {
        const newId = `${newLevel.substring(0, 3).toLowerCase()}-${Date.now()}`;
        state.masterIndex.push({ id: newId, title: newTitle, titleArabic: newTitleArabic, level: newLevel, path: newPath, preview: previewText, lastModified: new Date().toISOString() });
    }

    state.isIndexDirty = true;
    downloadFile(lessonJSON, lessonFileName, 'application/json');
    switchView('dashboard');
    renderDashboard();
    updateDashboardUIState();
    showNotification(`Pelajaran "${lessonFileName}" disimpan. Jangan lupa simpan perubahan indeks.`, 'success');
}

function renderQuizList() {
    const container = document.getElementById('quiz-list-container');
    container.innerHTML = '';
    if (!state.currentLessonData.quizData || state.currentLessonData.quizData.length === 0) {
        container.innerHTML = '<p class="text-gray-500 dark:text-gray-400">Belum ada pertanyaan.</p>';
        return;
    }
    state.currentLessonData.quizData.forEach((quiz, index) => {
        const quizDiv = document.createElement('div');
        quizDiv.className = "p-3 border rounded-md bg-gray-50 dark:bg-gray-900/50 dark:border-gray-600 flex justify-between items-start gap-4";
        quizDiv.innerHTML = `
        <div>
            <p class="font-bold">${index + 1}. ${quiz.question}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Jawaban: ${quiz.options[quiz.correctAnswer]}</p>
            ${quiz.explanation ? `<p class="mt-2 text-xs italic text-gray-500 dark:text-gray-400"><b>Penjelasan:</b> ${quiz.explanation}</p>` : ''}
        </div>
        <div class="flex gap-2 flex-shrink-0">
            <button data-action="edit-quiz" data-index="${index}" class="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-2 rounded">Edit</button>
            <button data-action="delete-quiz" data-index="${index}" class="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-2 rounded">Hapus</button>
        </div>
    `;
        container.appendChild(quizDiv);
    });
}

function handleQuizSubmit() {
    const question = document.getElementById('quiz-question').value;
    const context = document.getElementById('quiz-context').value;
    const options = [
        document.getElementById('quiz-opt-1').value,
        document.getElementById('quiz-opt-2').value,
        document.getElementById('quiz-opt-3').value,
        document.getElementById('quiz-opt-4').value,
    ];
    const correctAnswer = parseInt(document.getElementById('quiz-correct').value);
    const explanation = document.getElementById('quiz-explanation').value;

    if (!question || options.some(opt => !opt)) {
        showNotification("Mohon isi pertanyaan dan semua opsi jawaban.", 'error');
        return;
    }

    const newQuiz = { question, context, options, correctAnswer, explanation };
    if (state.editingQuizIndex !== null) {
        state.currentLessonData.quizData[state.editingQuizIndex] = newQuiz;
    } else {
        state.currentLessonData.quizData.push(newQuiz);
    }
    renderQuizList();
    resetQuizForm();
}

function populateQuizFormForEdit(index) {
    state.editingQuizIndex = index;
    const quiz = state.currentLessonData.quizData[index];
    document.getElementById('quiz-question').value = quiz.question;
    document.getElementById('quiz-context').value = quiz.context;
    document.getElementById('quiz-opt-1').value = quiz.options[0];
    document.getElementById('quiz-opt-2').value = quiz.options[1];
    document.getElementById('quiz-opt-3').value = quiz.options[2];
    document.getElementById('quiz-opt-4').value = quiz.options[3];
    document.getElementById('quiz-correct').value = quiz.correctAnswer;
    document.getElementById('quiz-explanation').value = quiz.explanation || '';
    document.getElementById('quiz-form-title').textContent = `Mengedit Pertanyaan ${index + 1}`;
    const submitBtn = document.getElementById('quiz-submit-btn');
    submitBtn.textContent = "Update Pertanyaan";
    submitBtn.className = "bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg";
    if (!document.getElementById('cancel-edit-quiz-btn')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.id = "cancel-edit-quiz-btn";
        cancelBtn.textContent = "Batal";
        cancelBtn.className = "bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg";
        cancelBtn.onclick = resetQuizForm;
        document.getElementById('quiz-form-buttons').appendChild(cancelBtn);
    }
    document.getElementById('quiz-editor-section').scrollIntoView({ behavior: 'smooth' });
}

function resetQuizForm() {
    document.getElementById('quiz-question').value = '';
    document.getElementById('quiz-context').value = '';
    ['quiz-opt-1', 'quiz-opt-2', 'quiz-opt-3', 'quiz-opt-4'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('quiz-correct').value = '0';
    document.getElementById('quiz-explanation').value = '';
    state.editingQuizIndex = null;
    document.getElementById('quiz-form-title').textContent = "Tambah Pertanyaan Baru";
    const submitBtn = document.getElementById('quiz-submit-btn');
    submitBtn.textContent = "Tambah Pertanyaan";
    submitBtn.className = "bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg";
    document.getElementById('cancel-edit-quiz-btn')?.remove();
}

export function openEditor(lessonId = null) {
    state.editingLessonId = lessonId;
    if (lessonId) {
        const lessonInfo = state.masterIndex.find(l => l.id === lessonId);
        if (!lessonInfo) {
            showNotification("Pelajaran tidak ditemukan.", 'error');
            return;
        }
        showNotification(`Untuk mengedit, unggah file pelajaran: ${lessonInfo.path}`, 'info');
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.onchange = (e) => {
            const reader = new FileReader();
            reader.onload = (re) => {
                try {
                    state.currentLessonData = JSON.parse(re.target.result);
                    renderEditor('Edit Pelajaran');
                } catch (err) {
                    showNotification('Gagal membaca file pelajaran. Format JSON tidak valid.', 'error');
                }
            };
            reader.readAsText(e.target.files[0]);
        };
        fileInput.click();
    } else {
        state.currentLessonData = { title: "", titleArabic: "", level: "Ibtida’i", textData: [[]], quizData: [], fullTranslation: "", reference: "" };
        renderEditor('Tambah Pelajaran Baru');
    }
}
