<div align="center">
<img width="1200" height="475" alt="CareerVerse Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# 🌌 CareerVerse — AI-Powered Professional Tech Career Network

**CareerVerse** adalah platform ekosistem karir teknologi masa kini yang dirancang khusus untuk para developer dan profesional IT. Platform ini mengintegrasikan profil profesional yang terhubung langsung dengan portofolio GitHub, umpan sosial (social feed) interaktif mirip LinkedIn, portal lowongan kerja terintegrasi, fitur pesan langsung (direct messaging), serta asisten bimbingan karir berbasis kecerdasan buatan (**AI Career Coach**) yang didukung oleh teknologi canggih Google Gemini API.

Platform ini tidak hanya memiliki visual yang premium (Kyoto Ink Obsidian Dark & Oatmeal Linen Silk Light), tetapi juga dilengkapi dengan **Interactive Database Visualizer** untuk memetakan hubungan database relasional secara real-time.

---

## 🌟 Fitur & Modul Utama

### 1. 🧠 AI Career Coach (Asisten Karir AI)
Modul kecerdasan buatan interaktif yang terhubung dengan **Google GenAI SDK**:
* **ATS Resume Scanner & Score**: Memindai teks resume pengguna, menilai kecocokan kata kunci dengan standar industri, mendeteksi kesalahan, dan memberikan skor kecocokan ATS secara instan.
* **Interactive Mock Interview**: Simulasi wawancara kerja interaktif dengan AI sebagai pewawancara. Pengguna dapat memilih jenis peran (Frontend, Backend, Full-Stack, dll.) dan menjawab pertanyaan secara bertahap untuk mendapatkan evaluasi mendalam.
* **AI Career Advisor Router**: Menyediakan saran karir personal, rekomendasi jalur belajar teknis, dan strategi branding berdasarkan pengalaman kerja dan keahlian yang tercantum di profil.

### 2. 💻 Developer Engine (Integrasi GitHub)
Visualisasi telemetri repositori publik secara langsung:
* Pengguna dapat menghubungkan username GitHub untuk menarik metrik penting secara real-time.
* Visualisasi distribusi bahasa pemrograman dalam grafik persentase interaktif.
* Pemetaan grid kontribusi (commit heatmap) untuk menunjukkan aktivitas coding selama 52 minggu terakhir.
* Sinkronisasi kartu repositori yang menampilkan jumlah bintang (*stars*), percabangan (*forks*), dan tautan langsung ke kode sumber.

### 3. 💬 Executive Messaging Desk (Pesan Langsung)
Ruang komunikasi privat yang aman untuk berinteraksi dengan recruiter dan developer lain:
* Pengiriman pesan instan dengan indikator status online.
* Fitur simulasi unggah lampiran dokumen resume (PDF) atau tangkapan layar (PNG) untuk mempermudah proses rekrutmen langsung dari platform chat.

### 4. 📢 Social Feed & Professional Network
Umpan sosial interaktif bergaya micro-blogging:
* Membuat postingan baru dengan dukungan teks dan gambar.
* Menyukai (*like*) dan mengomentari postingan pengguna lain.
* Mengirim, menerima, dan menyetujui permintaan koneksi untuk memperluas jaringan profesional.

### 5. 💼 Active Tech Careers (Job Portal)
Portal lowongan pekerjaan khusus bidang IT:
* Recruiter dapat mempublikasikan lowongan kerja baru lengkap dengan persyaratan, gaji, tingkat pengalaman, dan keahlian yang dibutuhkan.
* Pencari kerja dapat memfilter lowongan berdasarkan tipe kerja (Onsite, Hybrid, Remote) dan tingkat keahlian (Entry, Mid, Senior).
* Pelacakan status aplikasi lamaran secara real-time (`APPLIED`, `REVIEWING`, `INTERVIEWING`, `DECIDED`).

### 6. 📊 Interactive ERD & Database Schema Visualizer
Fitur edukasi arsitektur perangkat lunak yang memungkinkan pengguna melihat skema relasional **Prisma ORM** & **PostgreSQL** secara visual, lengkap dengan deskripsi fungsional dari masing-masing tabel database.

---

## 🛠️ Tech Stack (Teknologi Utama)

* **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4, Lucide React (ikon), Motion (animasi transisi).
* **Backend**: Express.js (Node.js API routes), TypeScript dijalankan melalui `tsx` di mode pengembangan.
* **Database & ORM**: Prisma ORM v6 dengan database relasional PostgreSQL (dihosting di Supabase).
* **AI Engine**: Google GenAI SDK (`@google/genai`) dengan model Gemini API (seperti Gemini 2.5/3.5).
* **Bundler & Build Tool**: `esbuild` untuk mem-bundle server backend menjadi single file CommonJS (`dist/server.cjs`) agar siap dideploy ke Vercel Serverless.

---

## 💡 Software Engineering Insights & Keunggulan Arsitektur

### 🔌 In-Memory Database Fallback (Toleransi Kesalahan Tinggi)
Untuk menjamin aplikasi tetap dapat diuji tanpa hambatan, server backend dilengkapi dengan sistem **Hybrid DB Store**. Jika koneksi ke database PostgreSQL di Supabase mengalami kegagalan (misalnya karena limit kuota, *cold start*, atau belum dikonfigurasi), server akan secara otomatis mengalihkan penyimpanan data ke struktur simulasi in-memory (`db` object). Ini mencegah aplikasi mengalami crash saat pertama kali dijalankan oleh penguji.

### 🚀 Optimasi Bundling Node Serverless
Karena Vercel dan platform serverless lainnya memiliki batasan ukuran paket dan sensitif terhadap kecepatan inisialisasi (*cold start*), proyek ini dikonfigurasi menggunakan `esbuild` untuk mengompilasi dan mengemas seluruh kode backend (`server.ts` dan dependensinya) ke dalam satu file tunggal: `dist/server.cjs`. Langkah ini memotong ukuran distribusi Node.js secara masif dan mempercepat waktu *cold start*.

### ⚡ Lazy Initialization SDK
Inisialisasi `GoogleGenAI` client di backend dilakukan secara *lazy* (hanya ketika API kecerdasan buatan pertama kali dipanggil). Ini menghemat penggunaan memori dan mempercepat startup server Express di lingkungan serverless.

### 🎨 Desain Antarmuka Premium (Aesthetic Craft)
Menggunakan pendekatan visual modern dengan:
* **Asymmetric Card Geometry**: Kartu bertekstur dengan sudut membulat asimetris untuk memberikan getaran arsitektur modern.
* **Physical Elevation Feedback**: Efek hover interaktif yang mensimulasikan ketinggian fisik objek saat didekati kursor.
* **Kyoto Ink Obsidian & Oatmeal Linen Silk**: Tema gelap/terang kustom yang diatur dengan transisi warna berbasis kurva bezier untuk memanjakan mata pengguna.

---

## ⚙️ Cara Menjalankan Proyek Secara Lokal

### Prasyarat
* **Node.js** (Versi 18 atau yang lebih baru)
* Akun **Google AI Studio** (untuk mendapatkan `GEMINI_API_KEY`)
* Akun **Supabase** & Database PostgreSQL (Opsional, untuk fitur database fisik)

### Langkah-langkah Penginstalan

1. **Klon Repositori & Masuk ke Direktori Proyek**
   ```bash
   cd career
   ```

2. **Instal Dependensi**
   Menggunakan npm:
   ```bash
   npm install
   ```
   Atau menggunakan pnpm jika tersedia:
   ```bash
   pnpm install
   ```

3. **Konfigurasi Environment Variables**
   Salin berkas `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Buka file `.env` baru tersebut, lalu isi nilai-nilainya:
   ```env
   # API Key dari Google AI Studio
   GEMINI_API_KEY="masukkan_gemini_api_key_anda_di_sini"

   # URL Database PostgreSQL dari Supabase (Opsional - Jika ingin menggunakan database fisik)
   DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres?schema=public"
   DIRECT_URL="postgresql://postgres:password@db.supabase.co:5432/postgres?schema=public"
   ```

4. **Inisialisasi Database dengan Prisma (Opsional)**
   Jika Anda memasukkan `DATABASE_URL` Supabase di langkah 3, jalankan perintah berikut untuk membuat tabel dan mengisi data awal (*seed*):
   ```bash
   # Sinkronisasi skema database
   npx prisma db push

   # Masukkan data mock awal ke database
   npx prisma db seed
   ```

5. **Jalankan Aplikasi dalam Mode Pengembangan**
   ```bash
   npm run dev
   ```
   Aplikasi Anda kini berjalan di: [http://localhost:3000](http://localhost:3000)

6. **Membangun Proyek untuk Produksi**
   Untuk memvalidasi build produksi lokal:
   ```bash
   npm run build
   npm run start
   ```

---

## 📂 Struktur Folder Proyek

```text
├── api/                  # Konfigurasi endpoint untuk Vercel Serverless
├── assets/               # File aset statis
├── dist/                 # Hasil build produksi server & client
├── prisma/               # Skema ORM & Script Seeding database
│   ├── schema.prisma     # Definisi model database relasional
│   └── seed.ts           # Data awal untuk tabel database
├── src/                  # Sumber Kode Frontend (React 19)
│   ├── components/       # Komponen antarmuka (AI Coach, DevMode, Feed, dll)
│   ├── lib/              # Pustaka utility & konektor Prisma Client
│   ├── types.ts          # Definisi antarmuka TypeScript
│   ├── main.tsx          # Titik masuk React
│   └── index.css         # Desain sistem & kustomisasi gaya CSS (Tailwind 4)
├── server.ts             # Node Express Server & rute API AI/GitHub/Database
├── tsconfig.json         # Konfigurasi TypeScript compiler
├── vite.config.ts        # Konfigurasi bundler frontend Vite 6
└── vercel.json           # Konfigurasi deployment platform Vercel
```

---
*Dibuat dengan dedikasi penuh menggunakan Google GenAI & Vite Express Web-containers.*

