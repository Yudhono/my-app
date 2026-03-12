import fs from "fs";
import path from "path";
import { Invoice } from "./types";

const INVOICES_DIR = path.join(process.cwd(), "data", "invoices");

export function saveInvoice(invoice: Invoice): void {
  if (!fs.existsSync(INVOICES_DIR)) {
    fs.mkdirSync(INVOICES_DIR, { recursive: true });
  }
  const filePath = path.join(INVOICES_DIR, `${invoice.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(invoice, null, 2), "utf-8");
}

export function getInvoice(id: string): Invoice | null {
  const filePath = path.join(INVOICES_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as Invoice;
  } catch {
    return null;
  }
}
