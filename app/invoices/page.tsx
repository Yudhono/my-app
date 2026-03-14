"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Invoice } from "@/lib/types";
import { getInvoicesFromStorage, encodeInvoiceForUrl } from "@/app/invoice/[id]/InvoiceSaver";

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

const formatInvNumber = (n: number | undefined) =>
  n ? `INV-${String(n).padStart(3, "0")}` : "—";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    setInvoices(getInvoicesFromStorage());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white px-4 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-gray-900">FreelanceKit</Link>
          <Link
            href="/#buat-invoice"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            + Buat Invoice
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Semua Invoice</h1>
            <p className="mt-1 text-sm text-gray-500">{invoices.length} invoice dibuat</p>
          </div>
        </div>

        {invoices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
            <p className="text-4xl mb-4">📄</p>
            <p className="font-semibold text-gray-700 mb-2">Belum ada invoice</p>
            <p className="text-sm text-gray-400 mb-6">Invoice yang kamu buat akan muncul di sini.</p>
            <Link
              href="/#buat-invoice"
              className="inline-block rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Buat Invoice Pertama
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-semibold">No. Invoice</th>
                  <th className="text-left px-6 py-3 font-semibold">Klien</th>
                  <th className="text-left px-6 py-3 font-semibold hidden sm:table-cell">Proyek</th>
                  <th className="text-right px-6 py-3 font-semibold">Total</th>
                  <th className="text-right px-6 py-3 font-semibold hidden sm:table-cell">Jatuh Tempo</th>
                  <th className="text-right px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-700 font-medium">
                      {formatInvNumber(invoice.invoiceNumber)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{invoice.clientName}</p>
                      <p className="text-xs text-gray-400">{invoice.clientEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 hidden sm:table-cell max-w-[200px] truncate">
                      {invoice.projectDescription}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                      {formatRupiah(invoice.total)}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 hidden sm:table-cell">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {invoice.mayarPaymentUrl ? (
                        <span className="inline-block rounded-full bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1">
                          Menunggu
                        </span>
                      ) : (
                        <span className="inline-block rounded-full bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1">
                          No Link
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/invoice/${invoice.id}?d=${encodeInvoiceForUrl(invoice)}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-xs"
                      >
                        Lihat →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
