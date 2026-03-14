"use client";

import { useEffect } from "react";
import { Invoice } from "@/lib/types";

const LS_KEY = "fk_invoices";

export function getInvoicesFromStorage(): Invoice[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]") as Invoice[];
  } catch {
    return [];
  }
}

export function encodeInvoiceForUrl(invoice: Invoice): string {
  const json = JSON.stringify(invoice);
  const bytes = new TextEncoder().encode(json);
  const binary = Array.from(bytes)
    .map((b) => String.fromCharCode(b))
    .join("");
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export default function InvoiceSaver({ invoice }: { invoice: Invoice }) {
  useEffect(() => {
    try {
      const existing = getInvoicesFromStorage();
      const filtered = existing.filter((inv) => inv.id !== invoice.id);
      localStorage.setItem(LS_KEY, JSON.stringify([invoice, ...filtered]));
    } catch {
      // silent fail
    }
  }, [invoice]);

  return null;
}
