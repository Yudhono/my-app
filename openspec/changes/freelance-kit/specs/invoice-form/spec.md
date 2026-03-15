## ADDED Requirements

### Requirement: Freelancer can fill invoice creation form
The system SHALL provide a form on the home page (`/`) where a freelancer can enter all invoice details.

#### Scenario: Form renders all required fields
- **WHEN** the user visits `/`
- **THEN** the form displays fields for: freelancer name, client name, client email, client phone, project description, due date, notes (optional), and at least one line item (name, quantity, unit price)

#### Scenario: Freelancer adds multiple line items
- **WHEN** the user clicks "+ Tambah Item"
- **THEN** a new line item row (name, quantity, unit price) is appended to the list

#### Scenario: Freelancer removes a line item
- **WHEN** the user clicks "×" on a line item row
- **THEN** that row is removed (minimum 1 row must remain; button is disabled when only 1 row exists)

### Requirement: Form calculates invoice total automatically
The system SHALL compute and display a running total based on line items.

#### Scenario: Total updates on input change
- **WHEN** the user changes quantity or unit price of any line item
- **THEN** the subtotal for that item and the grand total update immediately in the UI, formatted as IDR

### Requirement: Form validates required fields before submission
The system SHALL prevent submission if required fields are missing or invalid.

#### Scenario: Submission with empty required field
- **WHEN** the user submits the form with a missing required field
- **THEN** the system displays an inline validation error and does not submit

#### Scenario: Submission with valid data
- **WHEN** all required fields are filled and the user submits
- **THEN** the submit button shows "Membuat Invoice..." and is disabled, then the system creates the invoice and redirects to `/invoice/[id]?d=<base64url_encoded_invoice>`

### Requirement: Redirect includes encoded invoice data
The system SHALL encode the full invoice in the redirect URL for serverless compatibility.

#### Scenario: Server Action redirect includes `?d=` param
- **WHEN** the `createInvoice` Server Action completes
- **THEN** it redirects to `/invoice/[id]?d=<base64url>` where `d` is the full invoice JSON encoded with `Buffer.from(JSON.stringify(invoice)).toString("base64url")`
