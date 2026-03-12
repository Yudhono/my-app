## ADDED Requirements

### Requirement: Invoice is accessible via unique public URL
The system SHALL render a professional invoice page at `/invoice/[id]` without requiring login.

#### Scenario: Valid invoice ID
- **WHEN** a user visits `/invoice/[id]` with a valid ID
- **THEN** the page renders the full invoice: client name, project description, line items, total, due date, and a "Pay Now" button linked to the Mayar payment URL

#### Scenario: Invalid or missing invoice ID
- **WHEN** a user visits `/invoice/[id]` with an ID that does not exist
- **THEN** the system renders a 404 not found page

### Requirement: Invoice page shows payment status indicator
The system SHALL display a clear call-to-action for payment.

#### Scenario: Invoice with Mayar payment link
- **WHEN** the invoice page loads and a Mayar payment URL is stored
- **THEN** a prominent "Pay Now" button is displayed linking to the Mayar payment page

### Requirement: Invoice is print/share friendly
The system SHALL render the invoice in a clean layout suitable for sharing.

#### Scenario: Invoice layout is professional
- **WHEN** the invoice page renders
- **THEN** it displays: freelancer label, client details, itemized table with subtotals, grand total, due date, and payment link — all in a clean readable layout
