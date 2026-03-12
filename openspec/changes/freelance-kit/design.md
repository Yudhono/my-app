## Context

FreelanceKit is a greenfield Next.js 15 app for Indonesian freelancers. The goal is a zero-friction invoice generator: fill a form, get a shareable invoice URL, client pays via Mayar. No database, no auth, minimal dependencies. Built solo for a vibecoding competition — simplicity and demo-ability are first-class concerns.

## Goals / Non-Goals

**Goals:**
- Simple form → invoice → payment link flow completable in under 2 minutes
- Invoices accessible via unique URL without login
- Mayar payment link embedded in invoice view
- Works on mobile (responsive)

**Non-Goals:**
- User accounts, login, or sessions
- Invoice editing or deletion
- Email delivery
- PDF generation
- External database

## Decisions

### 1. Invoice Storage: JSON files on server (`/data/invoices/`)

**Decision**: Store each invoice as a JSON file at `data/invoices/<id>.json` on the server filesystem.

**Rationale**: No database setup needed, zero dependencies, works on Vercel (within function execution) for demo. Simple `fs.writeFileSync` / `fs.readFileSync` via Next.js Server Actions.

**Alternatives considered**:
- `localStorage` (client-side only, not shareable via URL)
- SQLite (needs a driver, more complexity)
- Vercel KV (requires account setup, overkill for MVP)

### 2. Unique Invoice ID: `nanoid` (short, URL-safe)

**Decision**: Use `nanoid` to generate a short 10-character URL-safe ID per invoice.

**Rationale**: Short enough for URLs, collision-resistant enough for MVP scale, zero config.

### 3. Mayar Integration: Server Action calls Mayar Payment Link API

**Decision**: Mayar payment link is created server-side via a Next.js Server Action when the invoice is submitted. The returned payment URL is stored alongside invoice data and displayed on the invoice view page.

**Rationale**: Keeps the Mayar API key server-side only, never exposed to the client.

### 4. Routing

- `/` — Invoice creation form (Home page)
- `/invoice/[id]` — Public invoice view with payment link

### 5. Styling: Tailwind CSS utility classes, no component library

**Decision**: Plain Tailwind, no shadcn/ui or other libraries.

**Rationale**: Fewer dependencies, faster build, easier to customize for demo polish.

## Risks / Trade-offs

- **File storage on Vercel**: Vercel's serverless functions have ephemeral storage — files written during one request may not persist across requests on production. → **Mitigation**: Acceptable for competition demo. Can swap to Vercel KV post-competition.
- **No validation on invoice ID**: Malformed URLs return a 404. → **Mitigation**: Simple `notFound()` call in the page.
- **Mayar API rate limits**: Unknown limits during demo. → **Mitigation**: One payment link per invoice creation is well within any reasonable limit.

## Migration Plan

N/A — greenfield app, no existing data.

## Open Questions

- Does Mayar API require webhook setup for this use case, or is a simple payment link sufficient? → Assuming simple payment link is sufficient for MVP.
