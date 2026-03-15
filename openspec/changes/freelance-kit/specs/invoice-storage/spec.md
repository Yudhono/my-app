## ADDED Requirements

### Requirement: Invoice data is persisted with a unique ID
The system SHALL save each invoice as a JSON file at `/tmp/invoices/<id>.json` using a nanoid-generated 10-character ID.

#### Scenario: Invoice is saved on creation
- **WHEN** the invoice form is submitted successfully
- **THEN** a JSON file is written to `/tmp/invoices/<id>.json` containing all invoice fields and the Mayar payment URL

#### Scenario: Invoice ID is unique
- **WHEN** a new invoice is created
- **THEN** the system generates a unique nanoid that does not collide with existing invoice files

### Requirement: Invoice data is passed via URL for cross-instance reliability
The system SHALL encode the full invoice as a base64url string in the redirect URL.

#### Scenario: Invoice encoded in redirect URL
- **WHEN** the invoice is created and the server action redirects
- **THEN** the full invoice JSON is base64url-encoded and appended as `?d=<encoded>` to the `/invoice/[id]` redirect URL

#### Scenario: Invoice page decodes from URL param
- **WHEN** the invoice view page is rendered with a `?d=` param
- **THEN** the page decodes the base64url string to retrieve the invoice data

#### Scenario: Invoice page falls back to filesystem
- **WHEN** the invoice view page is rendered without a `?d=` param
- **THEN** the page attempts to read `/tmp/invoices/<id>.json`

#### Scenario: Invoice not found
- **WHEN** neither `?d=` nor the filesystem has data for the given ID
- **THEN** `notFound()` is called and the page renders a 404

### Requirement: Invoice JSON schema is well-defined
The system SHALL store invoices in a consistent schema.

#### Scenario: Invoice JSON contains required fields
- **WHEN** an invoice is saved
- **THEN** the JSON contains: `id`, `invoiceNumber`, `freelancerName`, `clientName`, `clientEmail`, `clientPhone`, `projectDescription`, `notes`, `dueDate`, `items` (array of `{name, quantity, unitPrice}`), `total`, `mayarPaymentUrl`, `createdAt`

### Requirement: Invoice numbers are sequential and persistent
The system SHALL assign each invoice a sequential integer stored in `/tmp/counter.json`.

#### Scenario: First invoice gets number 1
- **WHEN** no `/tmp/counter.json` exists and a new invoice is created
- **THEN** the file is created with `{ "count": 1 }` and the invoice is assigned `invoiceNumber: 1`

#### Scenario: Subsequent invoices increment the counter
- **WHEN** `/tmp/counter.json` already exists and a new invoice is created
- **THEN** the counter is incremented by 1

### Requirement: Invoice dashboard reads from browser localStorage
The system SHALL persist invoices in browser localStorage for reliable dashboard listing.

#### Scenario: Invoice is saved to localStorage on view
- **WHEN** the invoice view page renders in the browser
- **THEN** `InvoiceSaver` saves the invoice to `fk_invoices` in localStorage (deduped by ID, newest first)

#### Scenario: Dashboard lists invoices from localStorage
- **WHEN** the user visits `/invoices`
- **THEN** the client component reads `fk_invoices` from localStorage and renders the list

#### Scenario: "Lihat →" link includes encoded invoice data
- **WHEN** the dashboard renders an invoice row
- **THEN** the "Lihat →" link goes to `/invoice/${id}?d=${base64url_encoded}`
