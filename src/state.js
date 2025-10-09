export const state = {
    masterIndex: [],
    currentLessonData: {},
    editingLessonId: null,
    editingQuizIndex: null,
    activeFilter: 'All',
    isIndexDirty: false,
};

export const levelDetails = {
    'Ibtida’i': { title: 'Tingkat Ibtida’i (Pemula)', color: 'green' },
    'Mutawassit': { title: 'Tingkat Mutawassit (Menengah)', color: 'blue' },
    'Mutaqaddim': { title: 'Tingkat Mutaqaddim (Mahir)', color: 'purple' }
};

export const levelsInOrder = ['Ibtida’i', 'Mutawassit', 'Mutaqaddim'];
