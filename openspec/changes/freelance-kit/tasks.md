## 1. Project Setup

- [x] 1.1 Install `nanoid` dependency (`npm install nanoid`) in `package.json`
- [x] 1.2 Create `data/invoices/` directory and add `.gitkeep` to track it
- [x] 1.3 Add `MAYAR_API_KEY` to `.env.local` and document it in `.env.example`
- [x] 1.4 Define `Invoice` TypeScript type in `lib/types.ts` (`id`, `clientName`, `clientEmail`, `projectDescription`, `dueDate`, `items`, `total`, `mayarPaymentUrl`, `createdAt`)

## 2. Invoice Storage

- [x] 2.1 Create `lib/invoice-storage.ts` — `saveInvoice(invoice: Invoice): void` writes to `data/invoices/<id>.json`
- [x] 2.2 Create `lib/invoice-storage.ts` — `getInvoice(id: string): Invoice | null` reads and parses `data/invoices/<id>.json`, returns null if not found

## 3. Mayar Payment Integration

- [x] 3.1 Create `lib/mayar.ts` — `createPaymentLink({ amount, email, description }): Promise<string | null>` calls Mayar API and returns the payment URL
- [x] 3.2 Handle Mayar API error gracefully in `lib/mayar.ts` — return `null` on failure, log error to console

## 4. Invoice Creation Server Action

- [x] 4.1 Create `app/actions.ts` — `createInvoice(formData)` Server Action: generates nanoid, calls `createPaymentLink`, builds Invoice object, calls `saveInvoice`, redirects to `/invoice/[id]`
- [x] 4.2 Calculate `total` in the Server Action as sum of `quantity × unitPrice` for all items

## 5. Invoice Form UI

- [x] 5.1 Build `app/page.tsx` — invoice creation form with fields: client name, client email, project description, due date
- [x] 5.2 Add dynamic line items section in `app/page.tsx` — "Add Item" button appends a row (item name, qty, unit price), "Remove" deletes it
- [x] 5.3 Add running total display in `app/page.tsx` — updates live as qty/price changes
- [x] 5.4 Add client-side validation in `app/page.tsx` — required fields check before submit, inline error messages
- [x] 5.5 Wire form submission to `createInvoice` Server Action in `app/page.tsx`

## 6. Invoice View Page

- [x] 6.1 Create `app/invoice/[id]/page.tsx` — server component that reads invoice via `getInvoice(id)`, calls `notFound()` if null
- [x] 6.2 Render invoice layout in `app/invoice/[id]/page.tsx`: header, client details, itemized table with subtotals, grand total, due date
- [x] 6.3 Add "Pay Now" button in `app/invoice/[id]/page.tsx` — links to `mayarPaymentUrl`, hidden with fallback message if URL is null

## 7. Styling & Polish

- [x] 7.1 Style `app/page.tsx` form with Tailwind — clean, mobile-responsive layout
- [x] 7.2 Style `app/invoice/[id]/page.tsx` with Tailwind — professional invoice look, print-friendly
- [x] 7.3 Add loading state to form submit button in `app/page.tsx` — disable and show "Creating..." while submitting
