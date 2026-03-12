## Why

Indonesian freelancers lack a simple, professional way to create invoices and collect payments. Most resort to manual WhatsApp messages or spreadsheets, leading to unpaid work and lost credibility. FreelanceKit solves this with a zero-auth, form-based invoice generator with built-in Mayar payment links — shareable in seconds.

## What Changes

- New web app built on the existing Next.js 15 project
- Invoice creation form (client info, line items, due date)
- Invoice template renderer (professional PDF-ready layout)
- Mayar payment link generation attached to each invoice
- Shareable invoice page via unique URL (no login required)

## Capabilities

### New Capabilities

- `invoice-form`: Form for freelancer to input client details, project description, line items (name, qty, price), and due date
- `invoice-view`: Public invoice page rendered from stored data, accessible via unique URL slug
- `mayar-payment`: Integration with Mayar API to generate a payment link tied to the invoice total
- `invoice-storage`: Client-side or server-side storage of invoice data keyed by unique ID (no database, use JSON files or in-memory for MVP)

### Modified Capabilities

<!-- None — this is a greenfield app -->

## Impact

- New routes: `/` (form), `/invoice/[id]` (view)
- New dependency: Mayar API (payment link generation)
- Mayar API key stored in `.env.local` (never committed)
- No database — invoices stored as JSON files in `/data/invoices/` on the server

## Non-goals

- User authentication or accounts
- Invoice editing after creation
- Email sending
- PDF export
- Multi-currency support
