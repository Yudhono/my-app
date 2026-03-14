"use server";

import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { saveInvoice, getNextInvoiceNumber } from "@/lib/invoice-storage";
import { createPaymentLink } from "@/lib/mayar";
import { Invoice, InvoiceItem } from "@/lib/types";

export async function createInvoice(formData: FormData) {
  const invoiceNumber = getNextInvoiceNumber();
  const freelancerName = formData.get("freelancerName") as string;
  const clientName = formData.get("clientName") as string;
  const clientEmail = formData.get("clientEmail") as string;
  const clientPhone = formData.get("clientPhone") as string;
  const projectDescription = formData.get("projectDescription") as string;
  const notes = formData.get("notes") as string;
  const dueDate = formData.get("dueDate") as string;

  // Parse line items — submitted as itemName_0, itemQty_0, itemPrice_0, etc.
  const items: InvoiceItem[] = [];
  let index = 0;
  while (formData.get(`itemName_${index}`) !== null) {
    const name = formData.get(`itemName_${index}`) as string;
    const quantity = Number(formData.get(`itemQty_${index}`));
    const unitPrice = Number(formData.get(`itemPrice_${index}`));
    if (name && quantity > 0 && unitPrice >= 0) {
      items.push({ name, quantity, unitPrice });
    }
    index++;
  }

  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const mayarPaymentUrl = await createPaymentLink({
    name: clientName,
    email: clientEmail,
    mobile: clientPhone,
    description: projectDescription || `Invoice for ${clientName}`,
    items: items.map((item) => ({
      name: item.name,
      description: item.name,
      quantity: item.quantity,
      rate: item.unitPrice,
    })),
  });

  const id = nanoid(10);
  const invoice: Invoice = {
    id,
    invoiceNumber,
    freelancerName,
    clientName,
    clientEmail,
    clientPhone,
    projectDescription,
    notes,
    dueDate,
    items,
    total,
    mayarPaymentUrl,
    createdAt: new Date().toISOString(),
  };

  saveInvoice(invoice);
  redirect(`/invoice/${id}?d=${encodeURIComponent(Buffer.from(JSON.stringify(invoice)).toString("base64"))}`);
}
