# Spec: Invoice Form

## Purpose
The invoice creation form is the primary entry point of FreelanceKit. It is rendered on the landing page (`/`) below a marketing hero section and allows a freelancer to fill in all invoice details and trigger invoice + Mayar payment link creation.

---

## Requirements

### Requirement: Landing page presents the product before the form
The system SHALL render a marketing landing page at `/` that introduces FreelanceKit before showing the form.

#### Scenario: Hero and how-it-works sections are visible
- **WHEN** a user visits `/`
- **THEN** the page renders: a navbar with a "Semua Invoice" link, a hero section with headline and CTA, a "Cara Kerjanya" 3-step section, a feature strip, and the invoice creation form below

---

### Requirement: Freelancer can fill invoice creation form
The system SHALL provide a form on the home page (`/`) where a freelancer can enter all invoice details.

#### Scenario: Form renders all required fields
- **WHEN** the user visits `/`
- **THEN** the form displays sections for: freelancer name/business name, client name, client email, client phone, project description, due date, notes (optional), and at least one line item row (name, quantity, unit price)

#### Scenario: Freelancer adds multiple line items
- **WHEN** the user clicks "+ Tambah Item"
- **THEN** a new line item row (name, quantity, unit price) is appended to the list

#### Scenario: Freelancer removes a line item
- **WHEN** the user clicks "×" on a line item row
- **THEN** that row is removed (minimum 1 row must remain; button is disabled when only 1 row exists)

#### Scenario: Line item inputs retain focus while typing
- **WHEN** the user types into any line item input field
- **THEN** the input retains focus throughout typing (no remount on each keystroke)

---

### Requirement: Form calculates invoice total automatically
The system SHALL compute and display a running total based on line items.

#### Scenario: Total updates on input change
- **WHEN** the user changes quantity or unit price of any line item
- **THEN** the subtotal for that item and the grand total update immediately in the UI, formatted as Indonesian Rupiah (IDR)

---

### Requirement: Form validates required fields before submission
The system SHALL prevent submission if required fields are missing or invalid.

#### Scenario: Submission with empty required field
- **WHEN** the user submits the form with any missing required field (client name, client email, client phone, project description, due date, or at least one line item with name and price)
- **THEN** the system displays inline validation errors per field and does not submit

#### Scenario: Submission with valid data
- **WHEN** all required fields are filled and the user submits
- **THEN** the submit button shows "Membuat Invoice..." and is disabled, and the system creates the invoice and redirects to `/invoice/[id]`

---

### Requirement: Form submission triggers invoice and payment link creation
The system SHALL call the `createInvoice` Server Action on valid form submission.

#### Scenario: Server Action receives all form data
- **WHEN** the form is submitted successfully
- **THEN** the Server Action receives: freelancerName, clientName, clientEmail, clientPhone, projectDescription, notes, dueDate, and all itemName/itemQty/itemPrice fields
