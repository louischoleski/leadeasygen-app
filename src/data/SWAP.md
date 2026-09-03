# Backend swap points

The frontend is complete and demo-wired. When the Fonderie backend and Stripe are
live, create `src/lib/api.ts` with the real client and replace the implementations
below. The component layer needs zero changes — every consumer observes the stores.

## Jobs (`src/data/jobs.ts`)
- `createJob` — replace the local job construction + `startEngine()` with the
  create-job API call; keep the `CreateJobResult` contract.
- The tick loop (`tick`/`startEngine`/`stopEngine`) — replace with polling or a
  socket feeding the same `setJobs` updates.
- `cancelJob` / `retryJob` — API calls; keep refund semantics server-side.
- `makeLead` and the name-generator tables die with the simulation.

## Billing (`src/data/billing.ts`)
- `addCredits` / `spendCredits` / `refundCredits` — become server-truth; local
  state (balance + ledger) becomes a cache of the server's.
- Buy-pack flow: the buy button sets `CHECKOUT_INTENT_KEY` in sessionStorage and
  navigates to `/billing/success?pack=<id>`. Real version: buy button creates a
  Stripe Checkout Session and redirects; `/billing/success` and
  `/billing/cancelled` are the `success_url`/`cancel_url`. The success page then
  verifies the session server-side (`?session_id=...`) instead of consuming the
  intent/done sessionStorage flags — both flags die with the swap.
- Subscribe actions (currently toasts in `pages/Billing.tsx`) — Stripe payment
  intents behind the same buttons.
- `billingHistory` demo array — replace with the invoices endpoint; the credit
  ledger seed — replace with the credit-transactions endpoint.

## Auth (`src/pages/`, `src/data/auth.ts`)
- `src/data/auth.ts` — the session store. Demo `login()` trusts the form input;
  the real version sets the user from Fonderie's session response and `logout()`
  calls the sign-out endpoint. Guards (`RouteGuards.tsx`) and consumers (navbar
  account menu, settings prefill) need no changes.
- Submit handlers in `Login`, `Register`, `ForgotPassword`, `ResetPassword`,
  `VerifyEmail` — each becomes one API call that resolves into `login()`. The
  MFA challenge step slots into the login handler's response branch.
- Google OAuth buttons — redirect to `GET /auth/google`; callback route needs a
  spinner-only handler.
- Settings profile/password/MFA handlers (`pages/Settings.tsx`) — `PUT /users/*`.

## Conventions to keep
- Demo fallbacks toast "not wired up yet" — replace the toast with the call, never
  leave both.
- Stores stay on the `useSyncExternalStore` + localStorage pattern; the API layer
  writes through the existing `update`/`setJobs` functions.
