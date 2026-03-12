# Spec: Mayar Payment Integration

## Purpose
FreelanceKit integrates with the Mayar Headless API to automatically generate a payment link each time an invoice is created. The payment link is stored with the invoice and surfaced throughout the UI (pay button, QR code, WhatsApp message).

---

## Requirements

### Requirement: System creates a Mayar payment link on invoice submission
The system SHALL call the Mayar API server-side to generate a payment link when a new invoice is created.

#### Scenario: Successful payment link creation
- **WHEN** the invoice form is submitted with valid data
- **THEN** the system calls the Mayar invoice creation API (`POST /hl/v1/invoice/create`) with the client name, email, mobile, project description, and line items, and stores the returned payment URL with the invoice

#### Scenario: Mayar API failure
- **WHEN** the Mayar API returns an error or non-OK response during invoice creation
- **THEN** the invoice is still saved with `mayarPaymentUrl: null`, the error is logged to the console, and the invoice view shows a fallback message instead of a "Pay Now" button

---

### Requirement: Mayar API key is never exposed to the client
The system SHALL only call the Mayar API from server-side code.

#### Scenario: API key stays server-side
- **WHEN** the invoice form is submitted
- **THEN** the Mayar API call is made inside a Next.js Server Action using `process.env.MAYAR_API_KEY`, not from client-side code or exposed in any client bundle

---

### Requirement: Payment link is tied to invoice line items
The system SHALL pass all invoice line items to the Mayar API.

#### Scenario: Line items passed to Mayar
- **WHEN** the Mayar payment link is created
- **THEN** each line item is sent as `{ name, description, quantity, rate }` to the Mayar API, matching the invoice items exactly

---

### Requirement: Sandbox and production environments are configurable
The system SHALL use the Mayar sandbox API by default for development.

#### Scenario: Sandbox base URL used
- **WHEN** the app is running with a sandbox API key
- **THEN** the Mayar API calls are made to `https://api.mayar.club/hl/v1`

#### Scenario: Environment variable controls the key
- **WHEN** `MAYAR_API_KEY` is set in `.env.local`
- **THEN** all Mayar API calls use that key in the `Authorization: Bearer <key>` header

---

### Requirement: Payment URL is surfaced across all sharing surfaces
The system SHALL embed the Mayar payment URL in every sharing mechanism.

#### Scenario: Pay Now button
- **WHEN** the invoice view renders with a valid payment URL
- **THEN** a "Bayar Sekarang →" button links directly to the Mayar payment page

#### Scenario: QR code encodes payment URL
- **WHEN** the invoice has a payment URL
- **THEN** the QR code on the invoice page encodes the Mayar payment URL so it can be scanned to pay

#### Scenario: WhatsApp message includes payment URL
- **WHEN** the freelancer clicks "Kirim via WhatsApp"
- **THEN** the generated WhatsApp message includes the Mayar payment URL as the payment link
