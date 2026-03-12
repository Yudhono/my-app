## ADDED Requirements

### Requirement: System creates a Mayar payment link on invoice submission
The system SHALL call the Mayar API server-side to generate a payment link when a new invoice is created.

#### Scenario: Successful payment link creation
- **WHEN** the invoice form is submitted with valid data
- **THEN** the system calls the Mayar payment link API with the invoice total, client email, and description, and stores the returned payment URL with the invoice

#### Scenario: Mayar API failure
- **WHEN** the Mayar API returns an error during invoice creation
- **THEN** the invoice is still saved but without a payment link, and the invoice view shows a fallback message instead of a "Pay Now" button

### Requirement: Mayar API key is never exposed to the client
The system SHALL only call the Mayar API from server-side code.

#### Scenario: API key stays server-side
- **WHEN** the invoice form is submitted
- **THEN** the Mayar API call is made inside a Next.js Server Action using `MAYAR_API_KEY` from environment variables, not from client-side code

### Requirement: Payment link is tied to invoice amount
The system SHALL create the Mayar payment link with the exact invoice grand total.

#### Scenario: Payment amount matches invoice total
- **WHEN** the Mayar payment link is created
- **THEN** the amount passed to the Mayar API equals the sum of all line item (quantity × unit price) values in the invoice
