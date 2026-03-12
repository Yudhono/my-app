"use client";

import { useState, useTransition } from "react";
import { createInvoice } from "./actions";

type LineItem = {
  name: string;
  quantity: string;
  unitPrice: string;
};

const emptyItem = (): LineItem => ({ name: "", quantity: "1", unitPrice: "" });

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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">FreelanceKit</h1>
          <p className="mt-1 text-gray-500">Buat invoice profesional & terima pembayaran via Mayar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Client Info */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">Info Klien</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Klien</label>
                <input
                  name="clientName"
                  type="text"
                  placeholder="Budi Santoso"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                {errors.clientName && <p className="mt-1 text-xs text-red-500">{errors.clientName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Klien</label>
                <input
                  name="clientEmail"
                  type="email"
                  placeholder="budi@email.com"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                {errors.clientEmail && <p className="mt-1 text-xs text-red-500">{errors.clientEmail}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">No. HP Klien</label>
                <input
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
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">Detail Proyek</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Proyek</label>
                <textarea
                  name="projectDescription"
                  rows={2}
                  placeholder="Pembuatan website landing page untuk toko online..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
                />
                {errors.projectDescription && <p className="mt-1 text-xs text-red-500">{errors.projectDescription}</p>}
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Jatuh Tempo</label>
                <input
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
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">Item / Layanan</h2>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
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
            {isPending ? "Membuat Invoice..." : "Buat Invoice & Link Pembayaran"}
          </button>
        </form>
      </div>
    </div>
  );
}
