## ADDED Requirements

### Requirement: Invoice data is persisted with a unique ID
The system SHALL save each invoice as a JSON file at `data/invoices/<id>.json` using a nanoid-generated 10-character ID.

#### Scenario: Invoice is saved on creation
- **WHEN** the invoice form is submitted successfully
- **THEN** a JSON file is written to `data/invoices/<id>.json` containing all invoice fields and the Mayar payment URL

#### Scenario: Invoice ID is unique
- **WHEN** a new invoice is created
- **THEN** the system generates a unique nanoid that does not collide with existing invoice files

### Requirement: Invoice data is retrievable by ID
The system SHALL read and return invoice data from the filesystem given a valid invoice ID.

#### Scenario: Read existing invoice
- **WHEN** the invoice view page at `/invoice/[id]` is rendered server-side
- **THEN** the system reads `data/invoices/<id>.json` and passes the parsed data to the page

#### Scenario: Invoice file not found
- **WHEN** no file exists at `data/invoices/<id>.json`
- **THEN** the system returns null and the page renders a 404

### Requirement: Invoice JSON schema is well-defined
The system SHALL store invoices in a consistent schema.

#### Scenario: Invoice JSON contains required fields
- **WHEN** an invoice is saved
- **THEN** the JSON file contains: `id`, `clientName`, `clientEmail`, `projectDescription`, `dueDate`, `items` (array of `{name, quantity, unitPrice}`), `total`, `mayarPaymentUrl`, `createdAt`
