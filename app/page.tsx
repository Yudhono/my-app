"use client";

import { useState, useTransition } from "react";
import { createInvoice } from "./actions";

type LineItem = {
  id: number;
  name: string;
  quantity: string;
  unitPrice: string;
};

let itemCounter = 0;
const emptyItem = (): LineItem => ({ id: ++itemCounter, name: "", quantity: "1", unitPrice: "" });

const steps = [
  {
    number: "01",
    title: "Isi Detail Invoice",
    description: "Masukkan info klien, deskripsi proyek, dan item layanan kamu.",
  },
  {
    number: "02",
    title: "Generate Link Pembayaran",
    description: "FreelanceKit otomatis membuat link pembayaran via Mayar.",
  },
  {
    number: "03",
    title: "Kirim ke Klien",
    description: "Kirim link invoice lewat WhatsApp, email, atau QR code. Klien langsung bisa bayar.",
  },
];

export default function Home() {
  const [items, setItems] = useState<LineItem[]>([emptyItem()]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const updateItem = (index: number, field: keyof LineItem, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const total = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    return sum + qty * price;
  }, 0);

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

  const validate = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.get("clientName")) newErrors.clientName = "Nama klien wajib diisi";
    if (!formData.get("clientEmail")) newErrors.clientEmail = "Email klien wajib diisi";
    if (!formData.get("clientPhone")) newErrors.clientPhone = "No. HP klien wajib diisi";
    if (!formData.get("projectDescription")) newErrors.projectDescription = "Deskripsi proyek wajib diisi";
    if (!formData.get("dueDate")) newErrors.dueDate = "Tanggal jatuh tempo wajib diisi";
    const hasValidItem = items.some(
      (item) => item.name.trim() && parseFloat(item.unitPrice) > 0
    );
    if (!hasValidItem) newErrors.items = "Tambahkan minimal satu item dengan nama dan harga";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!validate(formData)) return;
    startTransition(() => {
      createInvoice(formData);
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 px-4 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">FreelanceKit</span>
          <a
            href="#buat-invoice"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Buat Invoice Sekarang
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 py-20 text-center bg-linear-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 mb-6 uppercase tracking-wide">
            Powered by Mayar
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Invoice profesional.<br />
            <span className="text-indigo-600">Dibayar lebih cepat.</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
            Buat invoice dalam 60 detik, kirim ke klien via WhatsApp, dan terima pembayaran langsung lewat Mayar.
            Gratis. Tanpa ribet.
          </p>
          <a
            href="#buat-invoice"
            className="inline-block rounded-2xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Coba Sekarang — Gratis →
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 bg-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">Cara Kerjanya</h2>
          <p className="text-gray-500 text-center mb-12">3 langkah, selesai dalam 60 detik.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-4xl flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          {["Link Pembayaran via Mayar", "Kirim via WhatsApp 1 Klik", "QR Code Scan-to-Pay", "Cetak / Simpan PDF", "Gratis & Tanpa Login"].map((f) => (
            <span key={f} className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span> {f}
            </span>
          ))}
        </div>
      </section>

      {/* Form */}
      <section id="buat-invoice" className="px-4 py-20 bg-white">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Buat Invoice Sekarang</h2>
            <p className="mt-2 text-gray-500">Isi form di bawah, invoice siap dalam hitungan detik.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Freelancer Info */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">Info Kamu</h3>
              <div>
                <label htmlFor="freelancerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama / Nama Bisnis
                </label>
                <input
                  id="freelancerName"
                  name="freelancerName"
                  type="text"
                  placeholder="Budi Creative Studio"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Client Info */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">Info Klien</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">Nama Klien</label>
                  <input
                    id="clientName"
                    name="clientName"
                    type="text"
                    placeholder="Budi Santoso"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  {errors.clientName && <p className="mt-1 text-xs text-red-500">{errors.clientName}</p>}
                </div>
                <div>
                  <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Klien</label>
                  <input
                    id="clientEmail"
                    name="clientEmail"
                    type="email"
                    placeholder="budi@email.com"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  {errors.clientEmail && <p className="mt-1 text-xs text-red-500">{errors.clientEmail}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-1">No. HP Klien</label>
                  <input
                    id="clientPhone"
                    name="clientPhone"
                    type="tel"
                    placeholder="08123456789"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  {errors.clientPhone && <p className="mt-1 text-xs text-red-500">{errors.clientPhone}</p>}
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">Detail Proyek</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Proyek</label>
                  <textarea
                    id="projectDescription"
                    name="projectDescription"
                    rows={2}
                    placeholder="Pembuatan website landing page untuk toko online..."
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
                  />
                  {errors.projectDescription && <p className="mt-1 text-xs text-red-500">{errors.projectDescription}</p>}
                </div>
                <div className="w-full sm:w-1/2">
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Jatuh Tempo</label>
                  <input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>}
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">Item / Layanan</h3>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id} className="flex gap-2 items-start">
                    <input
                      name={`itemName_${index}`}
                      type="text"
                      placeholder="Nama item"
                      value={item.name}
                      onChange={(e) => updateItem(index, "name", e.target.value)}
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                    <input
                      name={`itemQty_${index}`}
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                      className="w-16 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                    <input
                      name={`itemPrice_${index}`}
                      type="number"
                      min="0"
                      placeholder="Harga"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                      className="w-32 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="mt-px text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg leading-none px-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {errors.items && <p className="text-xs text-red-500">{errors.items}</p>}
                <button
                  type="button"
                  onClick={addItem}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  + Tambah Item
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-end border-t border-gray-100 pt-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatRupiah(total)}</p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Membuat Invoice..." : "Buat Invoice & Link Pembayaran →"}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-4 py-8 text-center text-sm text-gray-400">
        <p>FreelanceKit — Dibuat dengan Mayar & Next.js</p>
      </footer>
    </div>
  );
}
