import { notFound } from "next/navigation";
import { getInvoice } from "@/lib/invoice-storage";

type Params = { id: string };

export default async function InvoicePage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const invoice = getInvoice(id);
  if (!invoice) notFound();

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 print:bg-white print:py-0">
      <div className="mx-auto max-w-2xl">
        {/* Pay Now Banner */}
        {invoice.mayarPaymentUrl ? (
          <div className="mb-6 rounded-2xl bg-indigo-600 p-4 flex items-center justify-between print:hidden">
            <div>
              <p className="text-white font-semibold">Invoice siap dibayar</p>
              <p className="text-indigo-200 text-sm">Bagikan link ini ke klien kamu</p>
            </div>
            <a
              href={invoice.mayarPaymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Bayar Sekarang
            </a>
          </div>
        ) : (
          <div className="mb-6 rounded-2xl bg-yellow-50 border border-yellow-200 p-4 print:hidden">
            <p className="text-yellow-800 text-sm">Link pembayaran tidak tersedia. Silakan hubungi freelancer.</p>
          </div>
        )}

        {/* Invoice Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FreelanceKit</h1>
              <p className="text-gray-400 text-sm mt-1">Invoice #{invoice.id}</p>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-full bg-green-100 text-green-700 text-xs font-semibold px-3 py-1">
                Menunggu Pembayaran
              </span>
              <p className="text-xs text-gray-400 mt-2">
                Dibuat: {formatDate(invoice.createdAt)}
              </p>
            </div>
          </div>

          {/* Client + Project */}
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
                <tr key={index} className="border-b border-gray-50">
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
          <div className="flex justify-end">
            <div className="w-56">
              <div className="flex justify-between py-2 border-t-2 border-gray-900">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-gray-900">{formatRupiah(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Pay Button (print-visible version) */}
          {invoice.mayarPaymentUrl && (
            <div className="mt-8 print:block hidden">
              <p className="text-sm text-gray-500">Link Pembayaran: {invoice.mayarPaymentUrl}</p>
            </div>
          )}
        </div>

        {/* Back link */}
        <div className="mt-4 text-center print:hidden">
          <a href="/" className="text-sm text-gray-400 hover:text-gray-600">
            ← Buat Invoice Baru
          </a>
        </div>
      </div>
    </div>
  );
}
