# FreelanceKit

> Invoice profesional untuk freelancer Indonesia. Buat invoice, terima pembayaran via Mayar, kirim ke klien lewat WhatsApp — selesai dalam 60 detik.

Dibuat untuk **Mayar Vibecoding Competition 2026**.

---

## Fitur

- **Buat Invoice** — form lengkap dengan info klien, item layanan, dan catatan pembayaran
- **Link Pembayaran Mayar** — otomatis generate payment link via Mayar Headless API
- **Kirim via WhatsApp** — satu klik, pesan siap kirim dengan detail invoice & link bayar
- **QR Code Scan-to-Pay** — QR langsung di halaman invoice
- **Nomor Invoice Berurutan** — INV-001, INV-002, dst.
- **Cetak / Simpan PDF** — print-friendly invoice layout
- **Salin Link Invoice** — bagikan URL invoice ke klien
- **Dashboard Invoice** — lihat semua invoice yang pernah dibuat

---

## Tech Stack

- [Next.js 15](https://nextjs.org) — App Router + Server Actions
- [Tailwind CSS v4](https://tailwindcss.com)
- [Mayar Headless API](https://docs.mayar.id) — payment link generation
- [react-qr-code](https://github.com/rosskhanas/react-qr-code) — QR code rendering
- [nanoid](https://github.com/ai/nanoid) — invoice ID generation
- File system storage — invoice data disimpan sebagai JSON lokal

---

## Cara Menjalankan

### 1. Clone & install

```bash
git clone <repo-url>
cd my-app
npm install
```

### 2. Setup environment variable

```bash
cp .env.example .env.local
```

Buka `.env.local` dan isi dengan Mayar API key kamu:

```env
MAYAR_API_KEY=your_mayar_api_key_here
```

Untuk sandbox, gunakan API key dari [Mayar Sandbox](https://api.mayar.club).

### 3. Jalankan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## Struktur Halaman

| Route | Deskripsi |
|---|---|
| `/` | Landing page + form buat invoice |
| `/invoices` | Dashboard semua invoice |
| `/invoice/[id]` | Detail invoice + tombol bayar & kirim |

---

## Cara Pakai

1. Buka `/` lalu isi form invoice (info kamu, info klien, item, catatan)
2. Klik **Buat Invoice & Link Pembayaran**
3. Halaman invoice terbuka dengan link Mayar otomatis terpasang
4. Klik **Kirim via WhatsApp** — pesan profesional langsung siap dikirim ke klien
5. Klien membuka link dan bayar via Mayar

---

## Integrasi Mayar

FreelanceKit menggunakan **Mayar Headless API** untuk membuat invoice dan payment link secara otomatis saat freelancer submit form. Payment link yang dihasilkan langsung disematkan di halaman invoice dan pesan WhatsApp.

Endpoint: `POST /hl/v1/invoice/create`

---

## Lisensi

MIT
