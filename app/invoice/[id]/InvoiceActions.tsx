"use client";

import { useState } from "react";
import QRCode from "react-qr-code";

type Props =
  | { qrOnly: true; paymentUrl: string; invoiceId: string }
  | { qrOnly?: false; invoiceId: string; mayarPaymentUrl: string | null; paymentUrl?: never };

export default function InvoiceActions(props: Props) {
  const [copied, setCopied] = useState(false);

  // QR-only mode: just render the QR code (used inside invoice card)
  if (props.qrOnly) {
    return (
      <div className="rounded-xl border border-gray-100 p-2 bg-white">
        <QRCode value={props.paymentUrl} size={120} />
      </div>
    );
  }

  // Action bar mode: copy link + print buttons
  const invoiceUrl = typeof window !== "undefined"
    ? `${window.location.origin}/invoice/${props.invoiceId}`
    : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invoiceUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  };

  return (
    <div className="mb-4 flex flex-wrap gap-2 print:hidden">
      {props.mayarPaymentUrl && (
        <a
          href={props.mayarPaymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          Bayar Sekarang →
        </a>
      )}
      <button
        onClick={handleCopy}
        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        {copied ? "✓ Link Tersalin!" : "Salin Link Invoice"}
      </button>
      <button
        onClick={() => window.print()}
        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Cetak / Simpan PDF
      </button>
    </div>
  );
}
