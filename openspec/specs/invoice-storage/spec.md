# Spec: Invoice Storage

## Purpose
Invoice storage handles all persistence operations for FreelanceKit. Invoices are stored as individual JSON files on the filesystem under `data/invoices/`. A separate counter file (`data/counter.json`) tracks sequential invoice numbers.

---

## Requirements

### Requirement: Invoice data is persisted with a unique ID
The system SHALL save each invoice as a JSON file at `data/invoices/<id>.json` using a nanoid-generated 10-character ID.

#### Scenario: Invoice is saved on creation
- **WHEN** the invoice form is submitted successfully
- **THEN** a JSON file is written to `data/invoices/<id>.json` containing all invoice fields and the Mayar payment URL

#### Scenario: Invoice ID is unique
- **WHEN** a new invoice is created
- **THEN** the system generates a unique nanoid that does not collide with existing invoice files

---

### Requirement: Invoice data is retrievable by ID
The system SHALL read and return invoice data from the filesystem given a valid invoice ID.

#### Scenario: Read existing invoice
- **WHEN** the invoice view page at `/invoice/[id]` is rendered server-side
- **THEN** the system reads `data/invoices/<id>.json` and passes the parsed data to the page

#### Scenario: Invoice file not found
- **WHEN** no file exists at `data/invoices/<id>.json`
- **THEN** the system returns null and the page renders a 404

---

### Requirement: Invoice JSON schema is well-defined
The system SHALL store invoices in a consistent schema.

#### Scenario: Invoice JSON contains required fields
- **WHEN** an invoice is saved
- **THEN** the JSON file contains: `id`, `invoiceNumber`, `freelancerName`, `clientName`, `clientEmail`, `clientPhone`, `projectDescription`, `notes`, `dueDate`, `items` (array of `{name, quantity, unitPrice}`), `total`, `mayarPaymentUrl`, `createdAt`

---

### Requirement: Invoice numbers are sequential and persistent
The system SHALL assign each invoice a sequential integer number stored in `data/counter.json`.

#### Scenario: First invoice gets number 1
- **WHEN** no `data/counter.json` exists and a new invoice is created
- **THEN** `data/counter.json` is created with `{ "count": 1 }` and the invoice is assigned `invoiceNumber: 1`

#### Scenario: Subsequent invoices increment the counter
- **WHEN** `data/counter.json` already exists with a count value and a new invoice is created
- **THEN** the counter is incremented by 1 and the invoice receives the new number

#### Scenario: Counter file is corrupted
- **WHEN** `data/counter.json` cannot be parsed
- **THEN** the system falls back to writing `{ "count": 1 }` and assigning `invoiceNumber: 1`

---

### Requirement: All invoices are listable for the dashboard
The system SHALL return all invoices sorted by invoice number descending.

#### Scenario: List invoices with existing data
- **WHEN** `listInvoices()` is called
- **THEN** it reads all `.json` files in `data/invoices/`, parses them, and returns them sorted by `invoiceNumber` descending (newest first)

#### Scenario: List invoices with empty directory
- **WHEN** no invoice files exist
- **THEN** `listInvoices()` returns an empty array

#### Scenario: Corrupted invoice file is skipped
- **WHEN** a file in `data/invoices/` cannot be parsed as JSON
- **THEN** that file is silently skipped and the rest are returned normally

---

### Requirement: Storage directory is auto-created
The system SHALL create the `data/invoices/` directory if it does not exist before any read or write operation.

#### Scenario: First run with no data directory
- **WHEN** the app is run for the first time with no `data/` directory
- **THEN** all storage functions create the required directories automatically before operating

---

### Requirement: Invoice data files are excluded from version control
The system SHALL not commit invoice JSON files or the counter to the repository.

#### Scenario: .gitignore excludes invoice data
- **WHEN** the repository is committed
- **THEN** `data/invoices/*.json` is excluded via `.gitignore` while `data/invoices/.gitkeep` is tracked to preserve the directory structure

---

### Requirement: Invoice dashboard is accessible at /invoices
The system SHALL provide a dashboard page listing all created invoices.

#### Scenario: Dashboard with invoices
- **WHEN** the user visits `/invoices`
- **THEN** a table is rendered showing all invoices with: INV-001 number, client name, client email, project description (truncated), total (IDR), due date, payment status badge, and a "Lihat →" link per row

#### Scenario: Dashboard empty state
- **WHEN** no invoices exist
- **THEN** the dashboard shows a friendly empty state message with a CTA to create the first invoice
