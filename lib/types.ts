export type InvoiceItem = {
  name: string;
  quantity: number;
  unitPrice: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: number;
  freelancerName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectDescription: string;
  notes: string;
  dueDate: string;
  items: InvoiceItem[];
  total: number;
  mayarPaymentUrl: string | null;
  createdAt: string;
};
