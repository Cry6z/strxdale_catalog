# strxdale's catalog

strxdale's catalog adalah aplikasi web modern yang dirancang sebagai ruang pamer digital komprehensif. Platform ini berfungsi tidak hanya sebagai tempat untuk menampilkan produk, tetapi juga sebagai media untuk merepresentasikan visual dan identitas merek secara profesional.

Dibangun menggunakan arsitektur web modern, platform ini menitikberatkan pada performa tinggi, pengalaman pengguna yang halus, dan sistem manajemen konten (CMS) mandiri yang mudah digunakan oleh administrator.

---

## Fitur Utama

### Pengalaman Pengunjung
- **Halaman Utama Dinamis:** Menghadirkan antarmuka pembuka dengan animasi interaktif dan visual hero section yang dapat disesuaikan.
- **Galeri Kurasi:** Tampilan galeri berbasis tata letak grid yang menekankan estetika dan identitas merek.
- **Katalog Terstruktur:** Sistem katalog produk komprehensif yang menampilkan informasi esensial seperti harga, kategori, dan status ketersediaan (seperti pre-order atau eksibisi).
- **Detail Produk Responsif:** Memberikan rincian mendalam pada setiap produk dengan integrasi komunikasi langsung (WhatsApp) untuk proses transaksi atau pertanyaan teknis.

### Panel Administrator
- **Autentikasi Aman:** Portal akses terproteksi untuk administrator.
- **Dasbor Analitik Singkat:** Ringkasan statistik performa katalog, termasuk total item dan estimasi nilai koleksi.
- **Manajemen Inventaris (CRUD):** Sistem manajemen data produk penuh, mengizinkan admin untuk menambah, mengedit, dan menghapus entri katalog beserta aset gambarnya.
- **Pengaturan Situs Dinamis:** Administrator dapat memodifikasi teks, hero banner, dan konten galeri langsung melalui dasbor tanpa perlu mengubah kode sumber.

---

## Teknologi

Proyek ini dibangun di atas fondasi teknologi berikut:

- **Kerangka Kerja Utama:** Next.js 16 (App Router) dengan React 19
- **Bahasa Pemrograman:** TypeScript
- **Penataan Gaya (Styling):** Tailwind CSS v4, Radix UI, dan Shadcn
- **Animasi:** Framer Motion dan GSAP
- **Basis Data dan Penyimpanan:** Supabase (PostgreSQL)

---

## Struktur Proyek

Berikut adalah gambaran arsitektur dan struktur utama dari proyek ini:

```text
strxdale_catalog/
├── app/                  # Rute aplikasi dan halaman
│   ├── access-portal/    # Portal autentikasi admin
│   ├── admin/            # Area panel administrator
│   ├── collection/       # Halaman katalog produk
│   ├── story/            # Halaman cerita dan identitas merek
│   ├── layout.tsx        # Konfigurasi tata letak utama
│   └── page.tsx          # Halaman beranda
├── components/           # Komponen antarmuka yang dapat digunakan kembali
│   ├── admin/            # Komponen khusus halaman administrator
│   └── ui/               # Komponen antarmuka umum (tombol, formulir)
├── lib/                  # Fungsi utilitas dan konfigurasi eksternal
│   ├── supabase.ts       # Klien Supabase
│   └── utils.ts          # Fungsi utilitas umum
└── public/               # Aset statis seperti gambar dan ikon
```

---

## Panduan Instalasi Lokal

Untuk menjalankan proyek ini di perangkat lokal, pastikan Anda telah memasang **Node.js** (versi 18 atau lebih baru) dan **npm** di sistem Anda.

### 1. Kloning Repositori
```bash
git clone <url-repositori-anda>
cd strxdale_catalog
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan
Buat sebuah file baru bernama `.env.local` pada direktori dasar proyek. Salin format di bawah ini dan isi nilainya sesuai dengan proyek Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=alamat_url_proyek_supabase_anda
NEXT_PUBLIC_SUPABASE_ANON_KEY=kunci_anon_proyek_supabase_anda
```

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```

Platform akan berjalan dan dapat diakses melalui peramban web di alamat: `http://localhost:3000`.

---

## Basis Data (Supabase)

Aplikasi ini bergantung pada skema tabel berikut di Supabase untuk dapat berfungsi:
1. `catalog_items`: Menyimpan seluruh data produk dalam katalog.
2. `landing_gallery`: Mengatur konten visual galeri pada halaman beranda.
3. `site_settings`: Menyimpan preferensi dinamis dan teks situs yang diatur oleh admin.

Pastikan struktur tabel pada Supabase Anda telah selaras dengan model data TypeScript yang ada pada direktori proyek.

---

## Panduan Penerapan (Deployment)

Aplikasi ini sangat direkomendasikan untuk disebarkan menggunakan layanan **Vercel** karena integrasinya yang optimal dengan Next.js:

1. Unggah kode sumber ini ke repositori platform Git (GitHub, GitLab, atau Bitbucket).
2. Buat proyek baru di Vercel dan hubungkan repositori terkait.
3. Pastikan untuk menambahkan semua nilai lingkungan (Environment Variables) dari file `.env.local` pada pengaturan proyek Vercel sebelum tahap penyebaran dimulai.
4. Klik tombol deploy dan tunggu proses hingga aplikasi siap digunakan secara publik.
