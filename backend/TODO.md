# Pending / Parked Work

## OAuth (Google/GitHub Login) — PARKED
Status: Not started. Confirmed on 2026-07-11 — zero OAuth code exists anywhere
in the backend (`Select-String` across all .py files returned nothing).

Buttons exist in `Login.tsx` (`lp-social-btn` for Google/GitHub) but have
no `onClick` — fully decorative right now.

To actually build this later, needed:
1. Register app on Google Cloud Console → get OAuth client ID + secret
2. Register app on GitHub Developer Settings → get client ID + secret
3. Add backend routes: `/auth/google/login`, `/auth/google/callback`,
   `/auth/github/login`, `/auth/github/callback` (in `auth.py`)
4. Store client secrets in `.env`, never commit them
5. Wire frontend buttons to redirect to those backend routes
6. Handle the callback → issue JWT same way normal login does

Blocked on: you creating the two developer console apps yourself
(requires your own Google/GitHub account access — I can't do this part).
```







## Membership Subscription Flow — PARKED
Status: Not started. Confirmed on 2026-07-11 by reading `backend/routers/membership.py`.

### Current state
- `GET /api/membership/tiers` — real, no auth needed, ready to wire (next task).
- `POST /api/membership/subscribe` — real, but requires a logged-in user
  (`get_current_user` dependency) and only accepts `{ tier_id }`. It creates
  a `UserMembership` record with a start/end date based on the tier's
  `duration_months`. It does NOT accept or store any payment/card details.
- `GET /api/membership/status` — real, requires logged-in user, returns
  their active membership if one exists.

### The problem
The current frontend `Membership.tsx` "Apply for Membership" modal collects:
institution name, website domain, contact name, email, and raw card number/
expiry/CVV — directly in our own form. `handleSubmit` is currently fake
(a `setTimeout` that never calls any backend). None of this data matches
what `/subscribe` expects, and collecting raw card numbers ourselves is a
real liability (PCI compliance) we should avoid entirely.

### Correct design (backend is already built for this — do NOT change it)
1. User must be logged in first (reuses the Login fix already shipped).
2. User picks a tier (from the now-real `GET /api/membership/tiers` list).
3. Frontend opens Razorpay's checkout/SDK for actual payment — Razorpay
   handles all card entry themselves, we never see raw card data.
4. On Razorpay success callback, frontend calls
   `POST /api/membership/subscribe` with just `{ tier_id }`.
5. Backend creates the `UserMembership` record (already implemented, no
   backend changes needed for this part).

### What needs to happen to build this
1. Remove the multi-step institution/contact/card form entirely — replace
   with a simple "must be logged in" gate + tier selection + Razorpay button.
2. Register a Razorpay account, get API key/secret (blocked on user — same
   as OAuth, needs external account setup only they can do).
3. Add Razorpay's checkout script/SDK to the frontend.
4. Wire the Razorpay success callback to call `/api/membership/subscribe`.
5. Test the full loop: login → pick tier → pay → membership record created
   → confirm via `GET /api/membership/status`.

Blocked on: user creating a Razorpay account and providing API keys.






## Events & Awards — Remaining Work (Deferred, not blocked)

Status: Browse, eligibility display, and application submission are DONE
and verified working end-to-end (commit a6caf5e). The following are
deferred by choice, not blocked by any external dependency:

### 1. Application Status Tracker
No login/dashboard exists yet to tie an application to a specific user.
Decided: applicant will see their `application_id` after successful
submission, with a separate "check status" lookup by ID against the
existing `GET /api/events-awards/applications/{application_id}` endpoint.
Not yet built.

### 2. "Shortlisted" status
Original spec workflow: Submitted → Under Review → Shortlisted →
Winner/Rejected. Current backend only transitions between
submitted/under_review/winner/rejected — "shortlisted" doesn't exist
anywhere yet. Needs a new admin action + status value.

### 3. Judge scoring frontend
Backend fully exists (`POST /applications/{id}/score`,
`GET /applications/{id}/final-score`) using the admin-enters-scores
approach (not judge login — decided 2026-07-11 as the pragmatic,
already-built option). No frontend UI for admins to enter scores yet.

### 4. Publish + Winners Showcase
Backend `PATCH /applications/{id}/publish` exists. No public-facing
"Winners" page exists yet to display published results.







## Admin Console — Planned Rebuild (NOT YET DONE — reverted, needs team sign-off first)

Current AdminConsole.tsx is fully mock ("Intelligence Command" themed UI, 
fake user directory, fake data override engine) — zero real backend behind it.
Real backend endpoints already exist in backend/routers/admin.py:
  - POST /admin/upload
  - POST /admin/publish
  - PATCH /admin/university/{id}
  - GET /admin/audit-log
  - GET /admin/data-quality

Decided plan (pending team approval before implementing):
1. Rebuild AdminConsole.tsx from scratch — old mock UI cannot be incrementally wired,
   doesn't correspond to any real functionality.
2. Scope: Dataset Upload + Publish first (functional heartbeat), then:
   - Audit Log tab (GET /admin/audit-log) — filter by user, table view
   - Data Quality tab (GET /admin/data-quality) — null-score counts dashboard
   - University Editor (PATCH /admin/university/{id}) — field edit form with audit trail
3. Publish should be gated (disabled until an upload succeeds in-session) — safer default.

Known bugs to fix as part of this work:
- /admin/upload: universities_loaded/skipped/errors are hardcoded zeros, not real 
  (silent try/except: pass around the reseed subprocess).
- /admin/upload triggers database.seed, but seed.py has a HARDCODED DATA_PATH 
  (qs_asia_2026.xlsx) — the actually uploaded file is saved to disk but never read.
  Upload appears to work but silently does nothing with the new file.
  Fix: seed.py should read the most recently uploaded dataset_*.xlsx.

NOTE: seed.py uses upsert logic (checks existing rows by slug/year before inserting),
so re-running it is safe — does NOT create duplicates.

Auth note: current admin user is urvipal106@gmail.com, promoted from role="user" 
to role="admin" directly via DB script for testing. Re-login needed for fresh JWT.