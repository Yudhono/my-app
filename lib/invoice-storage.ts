import fs from "fs";
import path from "path";
import { Invoice } from "./types";

const INVOICES_DIR = path.join("/tmp", "invoices");
const COUNTER_FILE = path.join("/tmp", "counter.json");

function ensureDir() {
  if (!fs.existsSync(INVOICES_DIR)) {
    fs.mkdirSync(INVOICES_DIR, { recursive: true });
  }
}

export function getNextInvoiceNumber(): number {
  ensureDir();
  try {
    if (fs.existsSync(COUNTER_FILE)) {
      const { count } = JSON.parse(fs.readFileSync(COUNTER_FILE, "utf-8"));
      const next = (count ?? 0) + 1;
      fs.writeFileSync(COUNTER_FILE, JSON.stringify({ count: next }), "utf-8");
      return next;
    }
  } catch {
    // fall through to default
  }
  fs.writeFileSync(COUNTER_FILE, JSON.stringify({ count: 1 }), "utf-8");
  return 1;
}

export function saveInvoice(invoice: Invoice): void {
  ensureDir();
  const filePath = path.join(INVOICES_DIR, `${invoice.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(invoice, null, 2), "utf-8");
}

export function getInvoice(id: string): Invoice | null {
  const filePath = path.join(INVOICES_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Invoice;
  } catch {
    return null;
  }
}

export function listInvoices(): Invoice[] {
  ensureDir();
  try {
    return fs
      .readdirSync(INVOICES_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => {
        try {
          return JSON.parse(
            fs.readFileSync(path.join(INVOICES_DIR, f), "utf-8")
          ) as Invoice;
        } catch {
          return null;
        }
      })
      .filter((inv): inv is Invoice => inv !== null)
      .sort((a, b) => (b.invoiceNumber ?? 0) - (a.invoiceNumber ?? 0));
  } catch {
    return [];
  }
}
