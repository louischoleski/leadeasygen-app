# Backend swap points & divergence charter

The frontend is complete and demo-wired. When the Fonderie backend and Stripe are
live, create `src/lib/api.ts` with the real client and replace the implementations
below. The component layer needs zero changes — every consumer observes the stores.

The reference client (`microservices/client`) is the contract truth **only for
shared services**. Where this SaaS deliberately diverges, the divergence is a
requirement on the backend, not a bug in the frontend — see "SaaS requirements".

## Shared contracts (adopt server truth)

- **Credit transactions** — `GET /v1/credits/transactions` rows
  `{amount, type, description, createdAt}` with types
  `purchase | usage | refund | bonus`. The frontend ledger uses these type ids
  (display labels are frontend copy). **Requirement:** the server adds
  `balanceAfter` per row — it is the trust feature of the ledger UI; if it never
  lands, the Balance column drops at swap.
- **Lead payload** — the scraper returns
  `{name, category, rating, reviews, phone, website, emails[], address}`
  regardless of how the job was requested. The frontend adopts this shape fully
  (see jobs section).
- **Balance** — `GET /v1/credits/balance` → `{credits}` remains the cache source
  for `creditBalance`.
- **Forgot password** — `/auth/email/forgot` never reveals whether an email
  exists; the frontend keeps the always-success UX.

## SaaS requirements (server must be extended)

These are intentional premium divergences from the reference client. Build the
API toward them; do not "reconcile" the frontend back to the reference.

1. **Structured scrape creation.** The reference takes a raw Maps URL + limit.
   The SaaS form submits structured input:
   `POST /v1/tasks/create {location, radiusKm, keywords[], category}`.
   Credit cost is **server-computed** (today's client formula, which the server
   takes over as pricing truth: `10 + 2·keywords + ceil(radiusKm/5)`), and a
   quote endpoint (e.g. `POST /v1/tasks/quote` with the same body) backs the
   form's live estimate so pricing math leaves the client entirely.
2. **Redirect checkout.** The reference opens Stripe in a new tab and waits for
   the webhook. The SaaS uses a server-created Checkout Session with
   `success_url=/billing/success?session_id={CHECKOUT_SESSION_ID}` and
   `cancel_url=/billing/cancelled`. The success page verifies the session
   server-side and shows the credited receipt; the sessionStorage
   `CHECKOUT_INTENT_KEY`/`CHECKOUT_DONE_KEY` handshake dies with the swap.
   Credits are still granted by webhook — session verification is read-only.
3. **Auth with identity.** Register accepts `name` (the reference is
   email+password only). `/auth/me` returns
   `{id, email, displayName, createdAt}`; `AuthUser` gains `id`/`createdAt` at
   swap and `displayName` maps to `name`. Terms acceptance at signup is recorded
   server-side.
4. **Subscriptions.** Free/Unlimited tiers, billing cycle, and the monthly
   credit grant (`bonus` transaction) have no reference counterpart — they need
   first-class backend support (tier on the user, grant scheduling, Stripe
   subscription objects behind the Subscribe buttons).

### Status mapping

The engine keeps its internal names; the API layer translates at the boundary:

| server     | frontend    |
| ---------- | ----------- |
| `pending`  | `queued`    |
| `scraping` | `running`   |
| `complete` | `completed` |
| `error`    | `failed`    |

`errorMessage` maps to the failed job's error detail.

## Jobs (`src/data/jobs.ts`)

- `createJob` — replace the local job construction + `startEngine()` with the
  structured create-task call (requirement 1); keep the `CreateJobResult`
  contract.
- The tick loop (`tick`/`startEngine`/`stopEngine`) — replace with polling or a
  socket feeding the same `setJobs` updates (the reference polls at 3s).
- `cancelJob` / `retryJob` — API calls; keep refund semantics server-side.
- `makeLead` and the name-generator tables die with the simulation.
- Every list needs a loading skeleton and a failed-to-load state when data goes
  async — deferred on purpose; meaningless against synchronous demo stores.

## Billing (`src/data/billing.ts`)

- `addCredits` / `spendCredits` / `refundCredits` — become server-truth; local
  state (balance + ledger) becomes a cache of the server's.
- Buy-pack flow — requirement 2 above replaces the sessionStorage handshake.
- Subscribe actions (currently toasts in `pages/Billing.tsx`) — requirement 4.
- `billingHistory` demo array — the invoices endpoint; the ledger seed — the
  transactions endpoint (shared contract above).

## Auth (`src/pages/`, `src/data/auth.ts`)

- `src/data/auth.ts` — the session store. Demo `login()` trusts the form input;
  the real version sets the user from `/auth/me` (requirement 3) and `logout()`
  calls the sign-out endpoint. Guards (`RouteGuards.tsx`) and consumers (navbar
  account menu, settings prefill) need no changes.
- Submit handlers in `Login`, `Register`, `ForgotPassword`, `ResetPassword`,
  `VerifyEmail` — each becomes one API call that resolves into `login()`. The
  MFA challenge step slots into the login handler's response branch.
- Google OAuth buttons — redirect to `GET /auth/google`; callback route needs a
  spinner-only handler.
- Settings profile/password/MFA handlers (`pages/Settings.tsx`) — `PUT /users/*`
  (the reference uses `PATCH /v1/users/me {displayName}`).

## Conventions to keep

- Demo fallbacks toast "not wired up yet" — replace the toast with the call,
  never leave both.
- Stores stay on the `useSyncExternalStore` + localStorage pattern; the API
  layer writes through the existing `update`/`setJobs` functions.
