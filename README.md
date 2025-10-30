# Admin Panel Materi Sorogan

Sebuah aplikasi web berbasis Vite dan Tailwind CSS untuk mengelola konten materi pembelajaran I'rab. Aplikasi ini memungkinkan admin untuk membuat, melihat, memperbarui, dan menghapus (CRUD) data pelajaran, yang kemudian diekspor dalam format `.json` untuk digunakan oleh aplikasi pembelajaran utama.

## ✨ Fitur Utama

- **Manajemen Pelajaran Lengkap:** Tambah, edit, dan hapus pelajaran dari indeks utama.
- **Editor Visual:** Editor kaya fitur untuk informasi dasar, teks pelajaran kata per kata (Arab, terjemahan, I'rab), dan pembuat kuis.
- **Impor & Ekspor Data:** Muat dan simpan indeks utama (`master-index.json`) serta file pelajaran individual (`.json`).
- **Impor dari Spreadsheet:** Impor data pelajaran lengkap dari format `.xlsx` atau `.csv`.
- **Drag & Drop:** Atur urutan pelajaran dan pindahkan antar level dengan mudah.
- **Pengurutan Cerdas:** Urutkan pelajaran berdasarkan nama file secara ascending (A-Z) atau descending (Z-A).
- **Antarmuka Responsif:** Tampilan yang menyesuaikan dengan berbagai ukuran layar, dari desktop hingga mobile.
- **Tema Gelap & Terang:** Pilihan tema untuk kenyamanan visual.

---

## 🚀 Cara Menjalankan Proyek

Untuk menjalankan aplikasi ini di lingkungan lokal, ikuti langkah-langkah berikut:

1.  **Clone Repository**
    ```bash
    git clone <URL_REPOSITORY_ANDA>
    cd <NAMA_FOLDER_PROYEK>
    ```

2.  **Install Dependensi**
    Pastikan Anda memiliki Node.js terinstal. Jalankan perintah berikut di terminal:
    ```bash
    npm install
    ```

3.  **Jalankan Server Pengembangan**
    Aplikasi akan berjalan menggunakan Vite. Gunakan perintah:
    ```bash
    npm run dev
    ```
    Buka URL yang ditampilkan di terminal (biasanya `http://localhost:5173`).

---

## ⚙️ Alur Kerja & Panduan Penggunaan

Aplikasi ini bekerja dengan dua jenis file utama: `master-index.json` yang berisi daftar semua pelajaran, dan file `.json` individual untuk setiap pelajaran.

#### 1. Memuat Indeks Utama
- **Tombol:** `[ 1 ] Muat File Indeks Utama`
- **Fungsi:** Langkah pertama adalah memuat file `master-index.json` yang sudah ada. Jika belum ada, Anda bisa memulai dengan membuat pelajaran baru dan menyimpan indeksnya nanti.
- **Hasil:** Setelah dimuat, semua pelajaran akan ditampilkan di dasbor sesuai dengan tingkatannya.

#### 2. Menambah atau Mengimpor Pelajaran
- **Tombol:** `Tambah Baru` atau `Impor File`
- **Fungsi:** 
    - **Tambah Baru:** Membuka halaman editor dengan form kosong untuk membuat pelajaran dari awal.
    - **Impor File:** Memungkinkan Anda mengimpor pelajaran dari file `.json` atau `.xlsx` yang sudah diformat.
- **Hasil:** Setelah mengisi data di editor, tekan `Simpan & Unduh File Pelajaran`. Sebuah file `.json` untuk pelajaran tersebut akan terunduh ke komputer Anda. Pelajaran baru juga akan ditambahkan ke daftar di dasbor.

#### 3. Mengedit Pelajaran
- **Tombol:** `Edit` pada setiap kartu pelajaran.
- **Fungsi:** Untuk mengedit konten sebuah pelajaran, Anda harus mengunggah file `.json` pelajaran yang bersangkutan saat diminta.
- **Hasil:** Setelah selesai mengedit, simpan kembali untuk mengunduh file `.json` pelajaran yang telah diperbarui.

#### 4. Mengatur Ulang Pelajaran
- **Aksi:** Gunakan ikon *drag handle* pada kartu pelajaran untuk menyeretnya ke posisi baru atau bahkan ke level yang berbeda. Gunakan tombol `A-Z` / `Z-A` di setiap header level untuk mengurutkan.
- **Fungsi:** Mengubah urutan atau level pelajaran.

#### 5. Menyimpan Indeks Utama
- **Tombol:** `[ 2 ] Simpan & Unduh Indeks`
- **Fungsi:** Tombol ini akan aktif setiap kali ada perubahan pada daftar pelajaran (tambah, hapus, atau urutkan ulang). 
- **Hasil:** Klik tombol ini untuk mengunduh file `master-index.json` yang sudah diperbarui. **Langkah ini krusial** agar semua perubahan yang Anda buat tersimpan.

---

### 📋 Panduan Format Impor XLSX

Untuk menggunakan fitur impor dari file spreadsheet (`.xlsx`), file Anda harus memiliki struktur dan nama sheet yang spesifik. Sistem akan mencari tiga sheet (nama tidak case-sensitive): `Info`, `Materi`, dan `Kuis`.

#### 1. Sheet: `Info`

Sheet ini berisi informasi umum tentang pelajaran dalam format kunci-nilai.

| Kunci | Nilai | Wajib? | Deskripsi |
| :--- | :--- | :--- | :--- |
| `Judul Latin` | Judul dalam tulisan Latin | **Ya** | Judul utama pelajaran. |
| `Judul Arab` | Judul dalam tulisan Arab | **Ya** | Judul dalam bahasa Arab. |
| `Level` | `Ibtidai`, `Mutawassit`, atau `Mutaqaddim` | **Ya** | Tingkatan pelajaran. |
| `Terjemahan Lengkap`| Teks terjemahan | Tidak | Terjemahan utuh dari naskah. |
| `Referensi` | Sumber teks | Tidak | Referensi atau sumber materi. |

#### 2. Sheet: `Materi`

Sheet ini berisi teks pelajaran kata per kata. Setiap baris mewakili satu kata atau tanda baca.

| Kolom | Wajib? | Deskripsi |
| :--- | :--- | :--- |
| `berharakat` | **Ya** | Teks Arab lengkap dengan harakat. |
| `terjemahan` | Tidak | Terjemahan bahasa Indonesia untuk kata tersebut. |
| `irab` | Tidak | Penjelasan I'rab untuk kata tersebut. |
| `link` | Tidak | URL tautan terkait kata tersebut (misal: ke kamus atau referensi). |

**Penting:** Untuk memisahkan antar paragraf, buat satu baris kosong dan isi kolom `berharakat` dengan `---`.

#### 3. Sheet: `Kuis` (Opsional)

Sheet ini berisi daftar pertanyaan kuis untuk pelajaran terkait.

| Kolom | Wajib? | Deskripsi |
| :--- | :--- | :--- |
| `question` | **Ya** | Teks pertanyaan kuis. |
| `option1` | **Ya** | Teks untuk pilihan jawaban pertama. |
| `option2` | **Ya** | Teks untuk pilihan jawaban kedua. |
| `option3` | **Ya** | Teks untuk pilihan jawaban ketiga. |
| `option4` | **Ya** | Teks untuk pilihan jawaban keempat. |
| `correctAnswer` | **Ya** | **Indeks** jawaban yang benar (dimulai dari 0). `0` untuk option1, `1` untuk option2, dst. |
| `context` | Tidak | Konteks tambahan untuk pertanyaan (biasanya dalam teks Arab). |
| `explanation` | Tidak | Penjelasan singkat mengapa jawaban tersebut benar. |

---

## 🌐 Deployment ke GitHub Pages

Aplikasi ini sudah dikonfigurasi untuk bisa di-hosting secara gratis melalui GitHub Pages.

1.  **Konfigurasi `vite.config.js`**
    Pastikan Anda telah mengatur `base` di dalam file `vite.config.js` sesuai dengan nama repository Anda.
    ```javascript
    export default {
      base: '/nama-repo-anda/',
    };
    ```

2.  **Jalankan Perintah Deploy**
    Setelah melakukan `git push` untuk kode terbaru Anda, jalankan perintah berikut di terminal lokal:
    ```bash
    npm run deploy
    ```

3.  **Atur di GitHub**
    Di pengaturan repository GitHub Anda, di bawah bagian **Pages**, atur sumber deployment ke branch `gh-pages` dari folder `/(root)`.

Situs Anda akan tersedia dalam beberapa menit.
