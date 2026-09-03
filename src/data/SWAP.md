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
- `addCredits` / `spendCredits` — become server-truth; local state becomes a cache
  of the server balance.
- Buy-package and subscribe actions (currently toasts in `pages/Billing.tsx`) —
  Stripe payment intents behind the same buttons.
- `billingHistory` demo array — replace with the invoices endpoint.

## Auth (`src/pages/`)
- Submit handlers in `Login`, `Register`, `ForgotPassword`, `ResetPassword`,
  `VerifyEmail` — currently `preventDefault` + toast/navigate; each becomes one
  API call. The MFA challenge step slots into the login handler's response branch.
- Google OAuth buttons — redirect to `GET /auth/google`; callback route needs a
  spinner-only handler.
- Settings profile/password/MFA handlers (`pages/Settings.tsx`) — `PUT /users/*`.

## Conventions to keep
- Demo fallbacks toast "not wired up yet" — replace the toast with the call, never
  leave both.
- Stores stay on the `useSyncExternalStore` + localStorage pattern; the API layer
  writes through the existing `update`/`setJobs` functions.
