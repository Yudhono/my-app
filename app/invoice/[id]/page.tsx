import { notFound } from "next/navigation";
import { getInvoice } from "@/lib/invoice-storage";
import { Invoice } from "@/lib/types";
import InvoiceActions from "./InvoiceActions";
import InvoiceSaver from "./InvoiceSaver";
import Link from "next/link";

type Params = { id: string };

export default async function InvoicePage({
  params,
  searchParams,
}: Readonly<{ params: Promise<Params>; searchParams: Promise<Record<string, string>> }>) {
  const { id } = await params;
  const { d } = await searchParams;

  let invoice: Invoice | null = null;
  if (d) {
    try { invoice = JSON.parse(Buffer.from(d, "base64url").toString("utf-8")) as Invoice; } catch { /* fall through */ }
  }
  if (!invoice) invoice = getInvoice(id);

  if (!invoice) notFound();

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 print:bg-white print:py-0">
      <InvoiceSaver invoice={invoice} />
      <div className="mx-auto max-w-2xl">
        {/* Action Bar */}
        <InvoiceActions
          invoiceId={id}
          invoice={{
            id: invoice.id,
            clientName: invoice.clientName,
            projectDescription: invoice.projectDescription,
            total: invoice.total,
            dueDate: invoice.dueDate,
            mayarPaymentUrl: invoice.mayarPaymentUrl,
          }}
        />

        {/* Invoice Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 print:shadow-none print:border-none print:rounded-none">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {invoice.freelancerName || "FreelanceKit"}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {invoice.invoiceNumber ? `INV-${String(invoice.invoiceNumber).padStart(3, "0")}` : `#${invoice.id}`}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-full bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1">
                Menunggu Pembayaran
              </span>
              <p className="text-xs text-gray-400 mt-2">
                Dibuat: {formatDate(invoice.createdAt)}
              </p>
            </div>
          </div>

          {/* Client + Due Date */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Tagihan Untuk</p>
              <p className="font-semibold text-gray-900">{invoice.clientName}</p>
              <p className="text-sm text-gray-500">{invoice.clientEmail}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Jatuh Tempo</p>
              <p className="font-semibold text-gray-900">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Deskripsi Proyek</p>
            <p className="text-gray-700 text-sm">{invoice.projectDescription}</p>
          </div>

          {invoice.notes && (
            <div className="mb-8 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Catatan</p>
              <p className="text-gray-700 text-sm whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}

          {/* Line Items Table */}
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide">
                <th className="text-left pb-2 font-semibold">Item</th>
                <th className="text-right pb-2 font-semibold">Qty</th>
                <th className="text-right pb-2 font-semibold">Harga Satuan</th>
                <th className="text-right pb-2 font-semibold">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={`${item.name}-${index}`} className="border-b border-gray-50">
                  <td className="py-3 text-gray-900">{item.name}</td>
                  <td className="py-3 text-right text-gray-600">{item.quantity}</td>
                  <td className="py-3 text-right text-gray-600">{formatRupiah(item.unitPrice)}</td>
                  <td className="py-3 text-right font-medium text-gray-900">
                    {formatRupiah(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div className="flex justify-end mb-8">
            <div className="w-56">
              <div className="flex justify-between py-3 border-t-2 border-gray-900">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-gray-900">{formatRupiah(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* QR Code + Pay section */}
          {invoice.mayarPaymentUrl && (
            <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex flex-col items-center gap-2 shrink-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Scan untuk Bayar</p>
                <InvoiceActions qrOnly paymentUrl={invoice.mayarPaymentUrl} invoiceId={id} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 mb-1">Link Pembayaran</p>
                <p className="text-xs text-indigo-600 break-all">{invoice.mayarPaymentUrl}</p>
                <a
                  href={invoice.mayarPaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors print:hidden"
                >
                  Bayar Sekarang →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-center gap-6 print:hidden">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
            ← Buat Invoice Baru
          </Link>
          <Link href="/invoices" className="text-sm text-gray-400 hover:text-gray-600">
            Semua Invoice →
          </Link>
        </div>
      </div>
    </div>
  );
}
