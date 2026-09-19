# NOLE SHOP — Premium Digital Products 🚀

Landing page dan storefront e-commerce produk digital modern, responsif, dan siap langsung di-hosting (Production Ready).

---

## 🌟 Fitur Utama
- **Apple-inspired Modern Aesthetic**: Desain minimalis, bersih, tipografi Inter, gradasi ambient bergerak (*fluid ambient glow*), dan efek *card lift* saat hover.
- **Katalog Produk Terstruktur**: Filter kategori (*All Products, AI Video, Text & Code, Productivity, Streaming*), badge *Featured*, dan modal detail produk.
- **Keranjang Belanja (Cart Drawer)**: Slide-over drawer interaktif, pengaturan kuantitas barang, dan kalkulasi subtotal instan.
- **Metode Pembayaran Kripto Terintegrasi**:
  - **USDT (BEP-20 / BNB Smart Chain)** dengan QR Code scan dan 1-Click Copy Wallet Address.
  - **USDC (Solana / SPL)** dengan QR Code scan dan 1-Click Copy Wallet Address.
  - Input hash transaksi (TxID) untuk validasi transfer.
- **Direct WhatsApp Checkout**: Kirim ringkasan detail pesanan, total harga, alamat dompet kripto, dan TxID langsung ke chat WhatsApp.
- **FAQ Accordion & Support**: Menu tanya jawab interaktif dengan transisi CSS Grid mulus.
- **100% Responsif & Ringan**: Tampilan optimal di smartphone, tablet, maupun desktop.

---

## 🛠️ Cara Menjalankan Secara Lokal (Local Development)

Pastikan Node.js sudah terpasang di komputer Anda.

1. Buka terminal pada folder proyek:
   ```bash
   cd C:\Users\zoomd\.gemini\antigravity-ide\scratch\nole-shop
   ```
2. Jalankan server lokal:
   ```bash
   npm run dev
   ```
   Web akan terbuka otomatis di browser Anda pada alamat `http://localhost:3000`.

3. Untuk membuat file build produksi:
   ```bash
   npm run build
   ```
   File hasil build akan berada di folder `dist/`.

---

## 🌐 Panduan Hosting Gratis (Ready to Host)

Proyek ini sudah dilengkapi konfigurasi siap pakai untuk berbagai platform hosting terkemuka:

### 1. Vercel (Paling Direkomendasikan)
- **Opsi A (Vercel CLI)**:
  ```bash
  npx vercel
  ```
- **Opsi B (GitHub Integration)**:
  1. Upload/Push folder proyek ini ke repository GitHub Anda.
  2. Buka [vercel.com](https://vercel.com), login, dan klik **"Add New Project"**.
  3. Pilih repositori GitHub Anda.
  4. Vercel akan otomatis mendeteksi konfigurasi `vercel.json` dan Vite. Klik **"Deploy"**.

### 2. Netlify
- **Opsi A (Drag & Drop / Netlify Drop)**:
  1. Jalankan `npm run build` untuk menghasilkan folder `dist`.
  2. Kunjungi [app.netlify.com/drop](https://app.netlify.com/drop).
  3. Tarik dan lepas (*drag & drop*) folder `dist` (atau seluruh folder proyek ini).
- **Opsi B (Netlify CLI / Git)**:
  File `netlify.toml` sudah tersedia sehingga proses build otomatis berjalan di Netlify.

### 3. Cloudflare Pages
1. Hubungkan repositori GitHub Anda ke Cloudflare Pages.
2. Atur Build command: `npm run build`
3. Atur Output directory: `dist`
4. Klik **Deploy**.

### 4. GitHub Pages
1. Push proyek ke repository GitHub.
2. Buka **Settings** > **Pages** > pilih branch `main`.

---

## ⚙️ Kustomisasi & Konfigurasi

Semua pengaturan utama dapat diubah langsung pada file `index.html`:

1. **Nomor WhatsApp**:
   Cari baris `const WHATSAPP_PHONE_NUMBER = "";` dan isi dengan nomor WhatsApp Anda (format internasional tanpa tanda +, contoh: `"6281234567890"`).
2. **Alamat Dompet Kripto & QR Code**:
   Cari objek `CRYPTO_WALLETS` di dalam `<script>`:
   - Ganti `address` dengan alamat wallet Anda.
   - Ganti `qrCode` dengan tautan gambar QR Code Anda.
3. **Katalog Produk & Harga**:
   Cari array `MASTER_PRODUCTS` di dalam `<script>` untuk menambah, mengubah, atau menghapus produk, durasi, serta harga.
