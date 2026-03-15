# Spec: Invoice Storage

## Purpose
Invoice storage handles persistence operations for FreelanceKit. On the server, invoices are written to `/tmp/invoices/` (ephemeral, per-Lambda-instance). For reliable cross-request access on Vercel's serverless infrastructure, invoice data is encoded as a base64url string and passed via the `?d=` URL query parameter. The `/invoices` dashboard reads from browser localStorage, which is populated client-side when an invoice page is viewed.

---

## Requirements

### Requirement: Invoice data is persisted with a unique ID
The system SHALL save each invoice as a JSON file at `/tmp/invoices/<id>.json` using a nanoid-generated 10-character ID.

#### Scenario: Invoice is saved on creation
- **WHEN** the invoice form is submitted successfully
- **THEN** a JSON file is written to `/tmp/invoices/<id>.json` containing all invoice fields and the Mayar payment URL

#### Scenario: Invoice ID is unique
- **WHEN** a new invoice is created
- **THEN** the system generates a unique nanoid that does not collide with existing invoice files

---

### Requirement: Invoice data is passed via URL for cross-instance reliability
The system SHALL encode the full invoice as a base64url string in the redirect URL to ensure data is available regardless of which serverless instance handles the subsequent request.

#### Scenario: Invoice encoded in redirect URL
- **WHEN** the invoice is created and the server action redirects
- **THEN** the full invoice JSON is encoded as base64url and appended as `?d=<encoded>` to the `/invoice/[id]` redirect URL

#### Scenario: Invoice page decodes from URL param
- **WHEN** the invoice view page at `/invoice/[id]` is rendered with a `?d=` param
- **THEN** the page decodes the base64url string to retrieve the invoice data, without relying on the filesystem

#### Scenario: Invoice page falls back to filesystem
- **WHEN** the invoice view page is rendered without a `?d=` param
- **THEN** the page attempts to read `/tmp/invoices/<id>.json` as a fallback

#### Scenario: Invoice not found
- **WHEN** neither the `?d=` param nor the filesystem contains data for the given ID
- **THEN** the system calls `notFound()` and the page renders a 404

---

### Requirement: Invoice JSON schema is well-defined
The system SHALL store invoices in a consistent schema.

#### Scenario: Invoice JSON contains required fields
- **WHEN** an invoice is saved
- **THEN** the JSON contains: `id`, `invoiceNumber`, `freelancerName`, `clientName`, `clientEmail`, `clientPhone`, `projectDescription`, `notes`, `dueDate`, `items` (array of `{name, quantity, unitPrice}`), `total`, `mayarPaymentUrl`, `createdAt`

---

### Requirement: Invoice numbers are sequential and persistent
The system SHALL assign each invoice a sequential integer number stored in `/tmp/counter.json`.

#### Scenario: First invoice gets number 1
- **WHEN** no `/tmp/counter.json` exists and a new invoice is created
- **THEN** the file is created with `{ "count": 1 }` and the invoice is assigned `invoiceNumber: 1`

#### Scenario: Subsequent invoices increment the counter
- **WHEN** `/tmp/counter.json` already exists and a new invoice is created
- **THEN** the counter is incremented by 1 and the invoice receives the new number

#### Scenario: Counter file is corrupted
- **WHEN** `/tmp/counter.json` cannot be parsed
- **THEN** the system falls back to writing `{ "count": 1 }` and assigning `invoiceNumber: 1`

---

### Requirement: Invoice dashboard reads from browser localStorage
The system SHALL persist invoices in browser localStorage so the `/invoices` dashboard works reliably across serverless Lambda instances.

#### Scenario: Invoice is saved to localStorage on view
- **WHEN** the invoice view page at `/invoice/[id]` is rendered in the browser
- **THEN** the `InvoiceSaver` client component saves the full invoice object to localStorage under the key `fk_invoices` (array, newest first, deduped by ID)

#### Scenario: Dashboard lists invoices from localStorage
- **WHEN** the user visits `/invoices`
- **THEN** the client component reads `fk_invoices` from localStorage and renders the invoice list sorted by `invoiceNumber` descending

#### Scenario: Dashboard with no invoices
- **WHEN** `fk_invoices` is empty or missing in localStorage
- **THEN** the dashboard shows a friendly empty state with a CTA to create the first invoice

#### Scenario: "Lihat →" link includes encoded invoice data
- **WHEN** the dashboard renders an invoice row
- **THEN** the "Lihat →" link goes to `/invoice/${id}?d=${base64url_encoded}` so the invoice page has data regardless of server state

---

### Requirement: Storage directory is auto-created
The system SHALL create `/tmp/invoices/` if it does not exist before any read or write operation.

#### Scenario: First run
- **WHEN** `/tmp/invoices/` does not exist
- **THEN** all storage functions create the required directory automatically before operating
