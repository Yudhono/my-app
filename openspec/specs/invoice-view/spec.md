# Spec: Invoice View

## Purpose
The invoice view page at `/invoice/[id]` is a shareable, public-facing page that displays the full invoice and provides all sharing and payment actions. It is designed for both the freelancer (to send/share) and the client (to review and pay).

---

## Requirements

### Requirement: Invoice is accessible via unique public URL
The system SHALL render a professional invoice page at `/invoice/[id]` without requiring login.

#### Scenario: Valid invoice ID
- **WHEN** a user visits `/invoice/[id]` with a valid ID
- **THEN** the page renders the full invoice: freelancer name, invoice number (INV-001), client name, client email, project description, notes (if present), line items table with subtotals, grand total, due date, and a QR code + "Bayar Sekarang" button

#### Scenario: Invalid or missing invoice ID
- **WHEN** a user visits `/invoice/[id]` with an ID that does not exist
- **THEN** the system renders a 404 not found page

---

### Requirement: Invoice displays sequential invoice number
The system SHALL show a human-readable invoice number instead of the raw ID.

#### Scenario: Invoice with a stored invoiceNumber
- **WHEN** the invoice has an `invoiceNumber` field
- **THEN** the page displays it as `INV-001`, `INV-002`, etc. (zero-padded to 3 digits)

#### Scenario: Legacy invoice without invoiceNumber
- **WHEN** the invoice does not have an `invoiceNumber` field
- **THEN** the page falls back to displaying `#<id>`

---

### Requirement: Invoice page provides payment and sharing actions
The system SHALL display an action bar with all sharing and payment options.

#### Scenario: WhatsApp share button
- **WHEN** the invoice has a Mayar payment URL
- **THEN** a "Kirim via WhatsApp" button is shown that opens WhatsApp with a pre-formatted message containing: client name, project description, invoice number, total (IDR), due date, and the Mayar payment URL

#### Scenario: Copy invoice link button
- **WHEN** the user clicks "Salin Link Invoice"
- **THEN** the current page URL (`/invoice/[id]`) is copied to clipboard and the button briefly shows "✓ Link Tersalin!"

#### Scenario: Print / PDF button
- **WHEN** the user clicks "Cetak / PDF"
- **THEN** the browser print dialog opens; action bar and footer are hidden in the print layout

#### Scenario: Pay Now button
- **WHEN** the invoice has a Mayar payment URL
- **THEN** a "Bayar Sekarang →" button in the action bar links to the Mayar payment page

---

### Requirement: Invoice page shows QR code for payment
The system SHALL render a scannable QR code for the Mayar payment link.

#### Scenario: QR code visible when payment URL exists
- **WHEN** the invoice has a Mayar payment URL
- **THEN** a QR code encoding the payment URL is rendered at the bottom of the invoice card alongside the payment link text

---

### Requirement: Invoice displays optional notes
The system SHALL render the notes field if present.

#### Scenario: Notes field is populated
- **WHEN** the invoice has a non-empty `notes` field
- **THEN** the invoice view renders a "Catatan" block with the notes text (preserving line breaks)

#### Scenario: Notes field is empty
- **WHEN** the invoice has no notes
- **THEN** the Catatan block is not rendered

---

### Requirement: Invoice is print/share friendly
The system SHALL render the invoice in a clean layout suitable for printing and sharing.

#### Scenario: Print layout hides interactive elements
- **WHEN** the page is printed
- **THEN** the action bar, copy/print buttons, and footer navigation are hidden; the payment URL text and QR code remain visible

---

### Requirement: Invoice page links to dashboard and creation form
The system SHALL provide navigation to other parts of the app.

#### Scenario: Footer navigation links
- **WHEN** the invoice page renders
- **THEN** the footer shows "← Buat Invoice Baru" (linking to `/`) and "Semua Invoice →" (linking to `/invoices`)
