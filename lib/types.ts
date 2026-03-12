export type InvoiceItem = {
  name: string;
  quantity: number;
  unitPrice: number;
};

export type Invoice = {
  id: string;
  freelancerName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectDescription: string;
  dueDate: string;
  items: InvoiceItem[];
  total: number;
  mayarPaymentUrl: string | null;
  createdAt: string;
};
