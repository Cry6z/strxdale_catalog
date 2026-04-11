# strxdale's catalog

Sebuah ruang digital untuk menampilkan produk dengan cara yang lebih dari sekadar katalog.  
Di sini, setiap item punya tempat, setiap visual punya cerita.

Dibangun dengan **Next.js**, **Tailwind CSS**, dan **Supabase**, platform ini dirancang agar terasa ringan, cepat, dan nyaman—baik untuk pengunjung maupun pengelola.

---

## ✨ Apa yang Bisa Dilakukan?

### 🛍️ Untuk Pengunjung
- **Halaman depan yang hidup**  
  Hero section dengan visual yang bisa berubah—bukan sekadar banner statis.

- **Galeri visual yang estetik**  
  Tampilan grid yang fokus ke vibe dan identitas brand, bukan cuma produk.

- **Katalog yang jelas & rapi**  
  Produk ditampilkan dengan info penting: harga, kategori, dan tipe (pre-order, showcase, dll).

- **Detail produk yang langsung to the point**  
  Lihat info lengkap + langsung lanjut ke WhatsApp tanpa ribet.

---

### 🔒 Untuk Admin
- **Akses simpel tapi tetap aman**  
  Masuk lewat `/access-portal`, langsung ke dashboard.

- **Dashboard yang ringkas**  
  Lihat jumlah item, nilai koleksi, dan aktivitas tanpa harus mikir.

- **Kelola produk tanpa ribet (CRUD)**  
  - Tambah, edit, hapus produk  
  - Upload gambar cover & galeri  
  - Atur status: pre-order, showcase, atau unggulan  
  - Kategori otomatis rapi

- **Edit konten tanpa sentuh kode**  
  - Ganti background hero  
  - Ubah teks (judul & deskripsi)  
  - Atur galeri landing

---

## 🚀 Teknologi yang Dipakai

- **Next.js** (App Router) — struktur modern & scalable  
- **TypeScript** — biar lebih aman & jelas  
- **Tailwind CSS** — styling cepat + fleksibel  
- **Supabase** — database + storage dalam satu tempat  
- **Vercel** — deployment paling praktis

---

## 📂 Struktur Project (Singkat Aja)

```text
app/
 ├── page.tsx         # Homepage
 ├── collection/      # Katalog
 ├── admin/           # Dashboard admin
 ├── access-portal/   # Login
 └── story/           # Tentang brand

components/
 ├── admin/           # Komponen admin
 └── ui/              # Komponen umum

lib/
 ├── supabase.ts
 └── utils.ts

public/
```

---

## 🛠️ Cara Jalanin di Lokal

```bash
git clone <repository-url>
cd strxdale_catalog
npm install
```

Buat file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-project-anon-key
```

Jalankan:

```bash
npm run dev
```

Buka di: `http://localhost:3000`

---

## 📦 Deployment

Paling enak pakai **Vercel**:

1. Push ke GitHub  
2. Import project ke Vercel  
3. Masukin environment variables  
4. Deploy — selesai

---

**strxdale's catalog**  
*Bukan cuma katalog. Tapi cara baru buat nampilin karya.*
