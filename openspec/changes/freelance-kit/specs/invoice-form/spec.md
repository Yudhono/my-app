## ADDED Requirements

### Requirement: Freelancer can fill invoice creation form
The system SHALL provide a form on the home page (`/`) where a freelancer can enter all invoice details.

#### Scenario: Form renders all required fields
- **WHEN** the user visits `/`
- **THEN** the form displays fields for: client name, client email, project description, due date, and at least one line item (name, quantity, unit price)

#### Scenario: Freelancer adds multiple line items
- **WHEN** the user clicks "Add Item"
- **THEN** a new line item row (name, quantity, unit price) is appended to the list

#### Scenario: Freelancer removes a line item
- **WHEN** the user clicks "Remove" on a line item row
- **THEN** that row is removed from the list (minimum 1 row must remain)

### Requirement: Form calculates invoice total automatically
The system SHALL compute and display a running total based on line items.

#### Scenario: Total updates on input change
- **WHEN** the user changes quantity or unit price of any line item
- **THEN** the subtotal for that item and the grand total update immediately in the UI

### Requirement: Form validates required fields before submission
The system SHALL prevent submission if required fields are missing or invalid.

#### Scenario: Submission with empty required field
- **WHEN** the user submits the form with a missing required field (client name, at least one line item with name and price)
- **THEN** the system displays an inline validation error and does not submit

#### Scenario: Submission with valid data
- **WHEN** all required fields are filled and the user submits
- **THEN** the system creates the invoice and redirects to `/invoice/[id]`
