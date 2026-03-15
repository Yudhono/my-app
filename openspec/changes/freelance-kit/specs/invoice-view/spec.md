## ADDED Requirements

### Requirement: Invoice is accessible via unique URL
The system SHALL render a professional invoice page at `/invoice/[id]` without requiring login.

#### Scenario: Valid invoice URL with `?d=` param
- **WHEN** a user visits `/invoice/[id]?d=<encoded>`
- **THEN** the page decodes the base64url invoice data and renders the full invoice: freelancer name, invoice number (INV-001), client name, client email, project description, notes (if present), line items table, grand total, due date, and (if `mayarPaymentUrl` is set) QR code + "Bayar Sekarang" button

#### Scenario: Invalid or missing invoice data
- **WHEN** neither the `?d=` param nor the filesystem has data for the given ID
- **THEN** the system renders a 404 not found page

### Requirement: Invoice data is saved to localStorage on view
The system SHALL persist the invoice to browser localStorage when the page is viewed.

#### Scenario: InvoiceSaver runs on page load
- **WHEN** the invoice page renders in the browser
- **THEN** `InvoiceSaver` saves the invoice to localStorage under `fk_invoices`, deduping by ID

### Requirement: Invoice page shows payment status indicator
The system SHALL display a clear call-to-action for payment.

#### Scenario: Invoice with Mayar payment link
- **WHEN** the invoice page loads and a Mayar payment URL is stored
- **THEN** a "Bayar Sekarang →" button links to the Mayar payment page, and a QR code encoding the payment URL is rendered

### Requirement: Invoice page provides sharing actions
The system SHALL display an action bar with sharing options.

#### Scenario: Copy invoice link button
- **WHEN** the user clicks "Salin Link Invoice"
- **THEN** `window.location.href` (full URL including `?d=`) is copied to clipboard and the button briefly shows "✓ Link Tersalin!"

#### Scenario: WhatsApp share button
- **WHEN** the invoice has a Mayar payment URL
- **THEN** a "Kirim via WhatsApp" button opens WhatsApp with a pre-formatted message including client name, project, total, due date, and payment URL

### Requirement: Invoice is print/share friendly
The system SHALL render the invoice in a clean layout suitable for sharing.

#### Scenario: Invoice layout is professional
- **WHEN** the invoice page renders
- **THEN** it displays: freelancer name, client details, itemized table with subtotals, grand total, due date, and payment section — all in a clean readable layout

#### Scenario: Print layout hides interactive elements
- **WHEN** the page is printed
- **THEN** the action bar, copy/print buttons, and footer navigation are hidden; payment URL text and QR code remain visible
