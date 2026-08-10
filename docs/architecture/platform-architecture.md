# TruTravel — Platform Architecture (TKT-010)

**Author:** T1 (Platform Engineer) · **Ticket:** TKT-010 · **Milestone:** M3
**Status:** Architecture, domain model, matching data model, and booking state-machine skeleton
implemented in an earlier session (verified complete, not re-written). **This session (retry 2)
completed the two items that earlier session was stopped mid-way through: the `@trutravel/domain`
barrel export and the entire `apps/web` Next.js scaffold** (real route handlers wired to
`packages/domain`/`packages/db`, not placeholders) — see §13 (File map) and §12 (Handoff notes).
Ready for T2 (payments/ledger),
T3 (analytics), T4 (devops/security), T5 (QA) to build on.
**Scope:** Himachal (Manali + Bir) × Thrilling Tours + Himachal (Manali + Bir) × Trippy Tours —
one shared domain model, two segment catalogs, per P1's companion PRDs.

**Inputs read (in order):** `docs/agents/shared-context.md` · `docs/prd/himachal-thrilling.md` (P1)
· `docs/prd/himachal-trippy.md` (P1) · `docs/design/matching-v0.md` (P3) · `docs/design/key-screens.md`
(P2) · `docs/design/ui-principles.md` (P2) · `docs/strategy/unit-economics.md` (A2, read for
booking-state/refund-shape context only — pricing/refund numbers are T2's to set) ·
`docs/ops/risk-register.md` (A4)

---

## 0. Coordination check (required before locking the data model): P3 vs P2 on group-composition preview

P2's `key-screens.md` §6.6 reserves a slot on the Trip detail trust strip for a "group-composition
preview" — an aggregated, privacy-respecting summary of who's coming — and explicitly deferred its
visual format pending P3's matching output, asking P3 to "confirm the rubric's user-facing output
shape back to P2."

**Finding: the shapes are compatible, with one gap — P3 never sent the confirmation P2 asked for.**
Flagging that gap here rather than silently picking a format on P3/P2's behalf.

- P3's `matching-v0.md` §3 already computes exactly the data structure P2's slot needs: soft-score
  is calculated against "the **live group profile** of the Departure's currently-confirmed roster —
  the modal (most common) value per soft tag among confirmed seats." That's a per-tag mode +
  distribution over the confirmed roster — i.e. an aggregate, non-individually-identifying summary.
  It satisfies P2's stated constraints verbatim: privacy-respecting aggregate (no per-traveler data
  leaves the roster-level computation), and for Trippy, P3's own §6 audit already confirms no
  `substance_stance`-equivalent signal exists anywhere in the tag set that could leak into this
  aggregate.
- What P3's doc does **not** do is propose the P2-requested output *format* (bar / tag-cloud /
  summary sentence / etc.) — its two "why you matched" example strings (§3.1, §3.2) are
  personalized-to-a-specific-traveler explanations, not the pre-commitment, viewer-agnostic
  aggregate P2's slot is for. That's a real, if narrow, gap: P2 is still owed a format confirmation.
- **T1's resolution for this ticket:** implement the *data layer* now (it's unambiguous and
  needed regardless of final visual format — see `packages/domain/src/matching/composition-preview.ts`),
  and flag the format decision back to P3/P2 rather than guessing at bar-vs-chip-vs-sentence myself.
  The computed shape is:

  ```ts
  interface CompositionPreview {
    departureId: string;
    confirmedSeatCount: number;
    tagSummaries: {
      tagKey: string;            // segment-namespaced, e.g. "trippy_tours.pace_preference"
      modalValue: string;
      distribution: { value: string; count: number }[];
    }[];
  }
  ```

  This is populated only from tags each segment's rubric actually scores (matching-v0 §3.1/§3.2) —
  it never includes `gear_ownership` or non-hard-gate `certification_held` (informational-only per
  P3 §3.1), and for Trippy it can never surface a `substance_stance`-shaped dimension because no
  such tag exists in the schema (§6 below).

**Flag to P3/P2 (not resolved by T1):** please confirm whether this `CompositionPreview` shape is
what P2 should design against, or whether P3 wants a different aggregate (e.g. only the top-1 modal
value per tag vs. full distribution) — the data layer supports either without a schema change, this
is a rendering/API-shape decision, not a re-architecture.

---

## 1. Repo state at ticket start

Confirmed via directory scan before writing any code: this repo contained only `docs/`, `.claude/`,
and the shared-context PDF — no application code, no package manifests, no existing stack. This is
a **greenfield build**, not an integration into existing code. Everything under `apps/` and
`packages/` below is new as of this ticket.

---

## 2. Stack decision (proposed only after confirming the above)

| Layer | Choice | Why |
|---|---|---|
| Language | TypeScript everywhere (frontend, API, domain, DB layer) | One language across the whole stack for a small team; type-safety carries the domain model (Segment/Trip/Departure/Seat/tags) from DB → domain logic → API → UI without re-declaration drift — directly useful given how tag-vocabulary-precise P3's rubric and P1's `substance_stance` exclusion are. |
| Web app | Next.js 14 (App Router), one deployable | Web-first per Shared Context §5; App Router gives SSR for segment landing pages (P2 §7) — real for discovery/CAC given A2's CAC sensitivity — and colocates API route handlers, so a 5-person eng org isn't running two deployables (separate API + separate SPA) for zero MVP benefit. |
| Database | PostgreSQL via Prisma | Relational fits this domain tightly: Corridor→Trip→Departure→Seat is a real referential chain, `sub_location`/state enums need enforceable constraints (not app-only validation), and Prisma gives typed queries that mirror the domain types 1:1. |
| Architecture | **Modular monolith**, npm workspaces (`apps/web`, `packages/domain`, `packages/db`) | Fast MVP, small team, one corridor × two segments — microservices from day 1 would be premature complexity with no present payoff. Module boundaries are *logical* (folders/packages with clear ownership) not physical, so T2 can own `packages/domain/src/booking` + a future payments module without owning deploy/infra for a separate service, and it can be split into real services later (e.g. payments) without a rewrite, since `packages/domain` has zero framework dependencies and isn't coupled to Next.js. |
| Auth | Custom session auth (not a third-party IdP) — see §8 | This product's auth requirements are unusual enough (platform-wide 18+ hard gate at signup, not per-segment; phone/OTP-first for the India market; Captain/Operator-staff/Traveler roles) that a generic consumer-IdP (e.g. NextAuth's default providers) would need as much custom glue as building the primitive directly, and a custom module keeps the 18+ gate and role model first-class rather than bolted onto a third-party session shape. |
| Package manager | npm workspaces | Already present in this environment (npm 9.6.6 confirmed); avoids adding a pnpm/yarn dependency the team may not have standardized on yet. |

**Rejected alternatives, briefly:**
- *Two deployables (separate API service + separate SPA):* adds CORS/auth-token complexity and a
  second deploy pipeline for a corridor×segment MVP with one client (web). Revisit once a native
  mobile client exists.
- *Microservices per domain module:* right instinct for module *boundaries* (see §3), wrong choice
  for deployment topology at this team size/stage — this is exactly the "fast MVP, small team"
  constraint from the Shared Context.
- *NoSQL/document store:* the domain is relational and constraint-heavy (hard eligibility gates,
  segment-scoped partner tiers, a legal-risk sub_location exclusion that must be enforced at the
  data layer) — Postgres's constraint system is doing real work here, not decoration.

---

## 3. Module boundaries

| Module | Location | Owns | Primary agent |
|---|---|---|---|
| Identity & auth | `packages/domain/src/identity`, `apps/web/app/api/auth` | User, Profile, 18+ age gate, session issuance | T1 (this ticket); T4 hardens (rate limiting, secrets, OTP provider integration) |
| Catalog | `packages/domain/src/catalog`, `apps/web/app/api/trips`, `apps/web/app/api/segments` | Segment metadata, Corridor, Trip, Departure, sub_location/altitude publish policy | T1 |
| Matching | `packages/domain/src/matching` | Tag vocabulary, hard gates, soft score, composition preview | T1 implements against P3's frozen spec; P3 owns future rubric changes |
| Booking | `packages/domain/src/booking`, `apps/web/app/api/departures/*/seats` | Seat/Departure state machines, refund-policy *interface* (not values) | T1 scaffolds; **T2 owns implementation + real refund numbers + payment capture** |
| Trust/verification | Partner, Guide, Captain models (`packages/db/prisma/schema.prisma`) | Verification states, tiering (segment-scoped) | T1 schema; G2/A4 own process; T4 owns any KYC-document handling hardening |
| Events contract | `packages/domain/src/events/event-catalog.ts` | Event **names + payload types only**, no emission | T1 defines the contract; **T3 owns implementation** |

---

## 4. Domain model

Implemented in `packages/db/prisma/schema.prisma`. Key modeling decisions, beyond a literal
transcription of P1's entity table:

### 4.1 `Segment` is a first-class table, not a bolted-on tag

Per the Shared Context ("segments are not filters") and P2's Home spec (all six segments visible
with equal structural weight, only two "live"), `Segment` is a reference table with a `catalogLive`
flag and `sortOrder` — not just a Postgres enum used inline on `Trip`. `SegmentKey` is still a
proper enum (for referential integrity on `Trip.segment`), but the `Segment` table is what P2's Home
tile grid and G3's copy hang off, and what makes "segment X has no catalog yet" a **data fact**
(zero rows in `catalogLive`/zero Trips), never a UI-only conditional. Six rows are seeded; only
`thrilling_tours` and `trippy_tours` have `catalogLive: true` for this slice.

### 4.2 `Trip` is base + segment-specific extension tables, not one wide table or an EAV blob

`Trip` carries the fields common to every segment (corridor, segment, sub_location, price, partner,
publish state). Segment-specific requirement fields live in `ThrillingTripDetail` /
`TrippyTripDetail` (1:1 extension tables), matching the pattern P1 uses in both PRDs' §3. This does
two things at once:
- Keeps the "T1 implements the domain model once" instruction from both PRDs true — one `Trip`/
  `Departure`/`Seat` lifecycle, one set of states, shared everywhere.
- Makes each segment's actual attribute set **grep-able and literal** — `ThrillingTripDetail` has a
  fixed column list (`skillLevelMin`, `fitnessLevelMin`, `maxAltitudeM`, `altitudeTier`,
  `guideId`, ...), `TrippyTripDetail` has a different fixed column list
  (`pacePreference`, `groupSizePref`). This is the same reasoning P1/A4 apply to the
  `substance_stance` exclusion (§6.2 below) — an explicit, enumerable schema beats an implicit one
  when the thing you need to prove is "this field does not exist."

Traveler-side self-declared tags get the identical pattern: `ThrillingTravelerProfile` and
`TrippyTravelerProfile`, not a shared key-value tag table. See §6.

### 4.3 `Partner` tiering is segment-scoped, per A2's explicit flag

A2's unit-economics doc (TKT-014) flags that Trippy's payout tier bands must **not** inherit from
an operator's Thrilling tier — the incentive stack is structurally different (Trippy's Captain
bounty is a stipend for a real safety/culture role, not a pure referral fee). `PartnerSegmentTier`
is `@@unique([partnerId, segment])`, not a single `tier` field on `Partner` — an operator can be
T1 on Thrilling and T3 (or absent) on Trippy simultaneously. This is a direct build-time
implementation of A2's recommendation 9, not something T2 has to retrofit later.

### 4.4 Captain vs. Guide are separate entities, per the Thrilling PRD §6 role split

`Captain` is a TruTravel-layer identity (linked 1:1 to a `User`, carries `identityVerificationLevel`
and — for Trippy — `CaptainTraining` completion records). `Guide` is an Anchor-Operator-layer
credential (belongs to a `Partner`, carries `certificationRef`), assigned to a Thrilling
`Departure` independently of the Captain. This directly answers P1's open feasibility question 2
("can the Captain/Guide split be modeled cleanly?") — yes, as two distinct tables with independent
foreign keys onto `Departure`, no shared identity system conflation, satisfying A4's flagged
liability-line-cleanliness concern at the schema level (the legal-review question itself is still
unresolved and stays with A4/legal, per PRD §12 — this only confirms the *data model* doesn't
create an ambiguity that isn't already in the product decision).

---

## 5. `sub_location` structural enforcement — Kasol/Parvati (Trippy) vs. Manali/Bir-only (Thrilling)

The ticket's DoD requires this be a **real data/query-level constraint**, since P2 already built the
UI side as pure data absence (`key-screens.md` §7.3, §11.5) and explicitly warned T1 not to build a
UI suppression rule. Two distinct mechanisms are implemented, because the two exclusions are
*different in kind* (the PRDs themselves draw this distinction and I've mirrored it rather than
flattening it):

**Trippy × `kasol_parvati` — a founder/legal exclusion, enforced at the database layer, not just
application code.** `packages/db/prisma/sql/hard_constraints.sql`:

```sql
ALTER TABLE "Trip"
  ADD CONSTRAINT trip_trippy_no_parvati
  CHECK (NOT (segment = 'trippy_tours' AND "subLocation" = 'kasol_parvati'));
```

Prisma's schema DSL doesn't emit arbitrary `CHECK` constraints, so this ships as a companion raw-SQL
file applied immediately after `prisma migrate dev` creates the base tables (documented in
`packages/db/README.md`) — **T4 should fold this into the CI migration pipeline** so it's never a
manual step someone can skip in a fresh environment. This constraint holds regardless of any bug in
application code, matches, or future admin tooling — exactly the "not a UI-layer filter" requirement.

The application layer mirrors the same rule (`packages/domain/src/catalog/policy.ts`,
`assertSubLocationAllowed`) for fast, well-labeled errors before a DB round-trip, and gates it behind
an explicit `PARVATI_LEGAL_BLOCK_TRIPPY = true` constant with a comment that the only legitimate way
to flip it is the founder+legal decision path both PRDs describe (Trippy PRD §2, risk-register §4) —
not a catalog config change, and not something G2/ops can toggle by editing data.

**Thrilling × Manali/Bir-only — a catalog-scope decision, enforced as application-layer config, not
a schema constraint.** Both PRDs are explicit this is different: Thrilling's exclusion of Kasol/Tosh
is "not for a hard reason... flag back to P1 if cheap supply exists" (Thrilling PRD §2), so it's
modeled as a plain allow-list (`THRILLING_CATALOG_SUBLOCATIONS`) in the same policy module, changeable
by G2/P1 without a migration. Putting a DB `CHECK` on this one would be *over*-enforcing a decision
the PRD itself says may change.

`assertSubLocationAllowed` is the single source of truth called from both Trip-creation and any
future admin tooling, so there's exactly one place this logic lives.

---

## 6. Matching data model (P3's TKT-008 rubric, implemented)

`packages/domain/src/matching/` implements P3's spec directly, not a reinterpretation:

- **`tags.ts`** — tag vocabulary, **segment-namespaced** per P3's explicit instruction (§1.3: "do
  not build one shared global tag dictionary" — `noise_energy` must never collide across segments).
  Implemented as `Record<'thrilling_tours' | 'trippy_tours', TagDefinition[]>`, each tag carrying
  its `hard`/`soft` classification and, for ordinal tags, an explicit order array used for the
  adjacent/distant scoring logic. `loyalty_trips_count` is one field scoped by segment (P3's
  consolidation recommendation), not two parallel `prior_X_trips` columns.
- **`hard-gates.ts`** — `evaluateThrillingHardGates` / `evaluateTrippyHardGates`, each running gates
  **in P3's stated evaluation order**, fail-fast (not scored-then-filtered), returning a structured,
  plain-language `reason` per rejection (matching-v0 §2's explainability requirement). Trippy's
  evaluator intentionally has no skill/fitness/certification checks — P3 §2.2 is explicit that
  Trippy has no hard compatibility gate beyond routing/capacity/age/geography, and the code doesn't
  invent one.
- **`soft-score.ts`** — implements the exact-match/adjacent/distant tiering (§3) against the live
  confirmed-roster mode, with each segment's weighted dimension table transcribed verbatim from
  matching-v0 §3.1/§3.2 (including which tags are explicitly **not** scored — `gear_ownership`,
  non-hard-gate `certification_held`, `loyalty_trips_count` — surfaced as Captain/Operator-only
  informational fields instead, per P3's instruction not to feed them into compatibility scoring).
- **`composition-preview.ts`** — the aggregate data structure discussed in §0.
- **`group-booking.ts`** — implements matching-v0 §5.3: a group booking is a locked placement unit,
  but every seat still clears hard gates **independently**; the function returns a per-seat
  pass/fail array, never a single boolean for the transaction, so the booking API can block one
  mismatched friend's seat without blocking the other two.
- **`overrides.ts`** — the manual human-override path (§5.2) as an explicit, audited action: it
  requires `overriddenBy`, `gateFailed`, and `reason`, persists to `MatchOverride`, and emits the
  `match_override_applied` event (contract only — T3 implements the pipeline). There is no
  code path that bypasses a hard gate silently; every bypass is this one function.

### 6.1 Explicit confirmation: no `substance_stance` field, or equivalent, exists in this schema

The ticket asks T1 to confirm this **in T1's own schema**, not defer to P3/A4's prior audits. Done —
walking `packages/db/prisma/schema.prisma` and `packages/domain/src/matching/tags.ts` field by field:

| Model / constant | Fields present | Substance-adjacent? |
|---|---|---|
| `TrippyTravelerProfile` | `pacePreference`, `groupSizePref`, `noiseEnergy`, `spiritualOpenness`, `photographyComfort` | No — this is the complete, exhaustive column list. No `substance_stance`, no renamed variant (e.g. `openness_level`, `vibe_tolerance`), no free-text field wide enough to reconstruct the same signal. |
| `TRIPPY_TAGS` (`tags.ts`) | Same five tags, `segment`/`age_band` handled as platform-wide hard gates elsewhere, not soft tags | No |
| `Seat`, `MatchOverride`, `CompositionPreview` | No traveler-authored free-text fields anywhere in the booking/matching path that could carry an unstructured proxy | No |

`TrippyTravelerProfile` carries an inline code comment pointing back to this section and to Trippy
PRD §6 / risk-register §9.1, so a future PR adding a field here is a visible, reviewable decision,
not a quiet drift. This is the mechanism, not just a promise: the exhaustive-column-list pattern in
§4.2 is what makes this audit actually checkable by grep rather than by trust.

---

## 7. Booking state machine (skeleton — refund numbers are T2's)

`packages/domain/src/booking/state-machine.ts` implements the two state machines exactly as P2/PRD
specify (no new states invented):

- `DEPARTURE_TRANSITIONS`: `Open → {Filling, Locked, Cancelled}`, `Filling → {Open, Waitlist, Locked,
  Cancelled}`, `Waitlist → {Filling, Locked, Cancelled}`, `Locked → {Cancelled}`, `Cancelled → {}`.
- `SEAT_TRANSITIONS`: `Pending → {Confirmed, Cancelled}`, `Confirmed → {Refund pending, Cancelled}`,
  `Refund pending → {Refunded}`, `Refunded/Cancelled → {}`.

**Refund shape (`refund-policy.ts`) — deliberately not populated with real numbers:**

```ts
export interface RefundPolicy {
  segment: SegmentKey;
  depositPercent: number;                    // non-refundable on traveler-initiated cancellation
  cancellationWindows: {
    daysBeforeDeparture: number;
    balanceRefundPercent: number;
  }[];
}

export const REFUND_POLICY_BY_SEGMENT: Record<SegmentKey, RefundPolicy | null> = {
  thrilling_tours: null, // A2 recommends 30-40% non-refundable deposit; exact %/windows: T2 to set
  trippy_tours: null,    // mirrors Thrilling's shape structurally; A2 has not yet modeled Trippy-specific numbers (Trippy PRD §8, unit-economics.md §8)
  // remaining four segments: no PRD, no policy
};
```

`resolveRefund()` throws a clearly-labeled error if called against a `null` policy, rather than
silently defaulting to some number — this is intentional: **T1 is not going to guess at a deposit
percentage.** The function does encode the one shape rule both PRDs are explicit about regardless of
final numbers: **operator-initiated cancellation (weather abort, permit issue, min-group-size)
always resolves to a full refund including deposit and is tagged with a distinct
`CancellationReasonCode`**, never the traveler-cancellation path — this satisfies both PRDs' §8
requirement that the two be *structurally* distinguishable in the data even if the traveler-facing
badge stays "Refunded" (per P2's `key-screens.md` §6.5 recommendation).

`Seat.depositAmountINR` / `balanceAmountINR` / `totalAmountINR` are nullable ints on the schema —
present as the two-line-item contract the PRDs require (§8 item 1: split ledger lines), but T1 does
not populate them with real values; that's T2's booking/payment-capture build.

---

## 8. Auth

- **Signup:** email or phone (India-first, phone is treated as primary), `dateOfBirth` required at
  signup. `isAgeGatePassed()` (`packages/domain/src/identity/age-gate.ts`) computes the 18+ check
  **once, at signup** — per both PRDs' explicit instruction that this is a platform-wide hard gate,
  not re-asked per booking and not a matching tag P3 should re-derive (matching-v0 §9 confirms this
  explicitly). A user who fails the gate cannot complete signup at all.
- **Session:** signed, httpOnly cookie holding a session token (implementation stub in
  `apps/web/app/api/auth/signup/route.ts`). No real OTP/SMS provider is wired up — `OtpProvider` is
  defined as an interface with a stub implementation; **T4 owns wiring a real SMS/OTP vendor, secret
  management, and rate limiting** (this is explicitly flagged as a T4 handoff, not silently deferred).
- **Roles:** `traveler` (default, every `User`), `captain` (`Captain` record linked to a `User`),
  `operator_staff` (`PartnerStaff` linking a `User` to a `Partner`), and an `admin` role reserved for
  ops tooling not built in this ticket. Role checks are plain functions against these relations, not
  a separate RBAC engine — deliberately simple for MVP scope.
- **Sensitive fields:** `Profile.medicalDisclosure` is flagged in-schema (`packages/db/prisma/schema.prisma`
  comment) as needing encryption-at-rest and access scoping to "captain/operator of the traveler's
  active trip only" per risk-register §1 — **this is a T4 handoff, not implemented as encryption in
  this ticket.** Couples-privacy (`privacy_mode` server-side enforcement) and CodeHouse address-reveal
  timing are out of scope for this slice (no PRD yet for either segment) but are called out in §11 so
  T4 has them on the radar for when those segments' PRDs land.

---

## 9. Catalog structure

- `GET /api/segments` returns all six `Segment` rows (id, name, `catalogLive`, `sortOrder`,
  `accentTokenKey`) — this is what P2's Home six-tile grid renders against; segment identity is a
  first-class row, not a derived filter value.
- `GET /api/trips?segment=&subLocation=` is **data-driven**, per P2's explicit instruction
  (`key-screens.md` §7.3, §11.5): it queries live, published `Trip` rows and returns only the
  `sub_location` values that actually have published trips for that segment. For Trippy this can
  never surface `kasol_parvati` — not because the API filters it out, but because no `Trip` row with
  that combination can exist (§5). This is the same "correct by construction" pattern P2 asked for,
  implemented on the read path, not just the write path.
- Segment is a **required** query parameter with no "all segments" default — there is no generic
  "one big trip list with a segment dropdown" endpoint, per ui-principles §6.2's explicit anti-pattern
  ("no treating segments as filters").

---

## 10. API surface (this vertical slice)

| Method | Path | Purpose | Notes |
|---|---|---|---|
| POST | `/api/auth/signup` | Create account, enforce 18+ gate | Blocks entirely on gate failure |
| POST | `/api/auth/login` | OTP-stub session issuance | Stub `OtpProvider`; T4 to harden |
| GET | `/api/segments` | Six-segment metadata for Home | Includes `catalogLive` |
| GET | `/api/trips?segment=&subLocation=` | Catalog browse, segment required | Data-driven sub_location filter |
| GET | `/api/trips/:tripId` | Trip detail incl. segment extension | Joins Thrilling/Trippy detail table |
| GET | `/api/trips/:tripId/departures` | Departure list for a Trip | Includes state, seat counts |
| GET | `/api/departures/:departureId/composition-preview` | Aggregate group-composition data | §0/§6 — data layer for P2's reserved slot |
| POST | `/api/departures/:departureId/seats` | Booking initiate (1 or many seats) | Runs per-seat hard gates (§6), creates `Pending` seats, **does not capture payment** |

Not built in this ticket (explicitly out of scope, see §11): payment capture/confirmation, refund
execution, partner payout, any analytics event emission, admin/ops tooling, CI/deploy config, React
UI components implementing P2's key-screens (the API surface above is what those screens will call).

---

## 11. Explicitly out of scope (and who owns it next)

| Area | Why out of scope here | Owner |
|---|---|---|
| Payment capture, deposit/balance ledger lines, real refund %, partner payout, incentive-cap guardrail enforcement | T2's ticket, per WM1's sequencing (T1 architecture first) | **T2** |
| Analytics event emission/pipeline, funnels, margin dashboards | `event-catalog.ts` is a contract only, no emission code | **T3** |
| Secrets, OTP/SMS vendor integration, rate limiting, encryption-at-rest for `medicalDisclosure`, CI, migration-pipeline hardening (incl. applying `hard_constraints.sql` automatically), infra/deploy | Flagged throughout §5/§8 | **T4** |
| Test plans, acceptance criteria, regression suite | Not attempted | **T5** |
| React implementation of P2's key-screens (trip card, detail screen, booking flow UI) | This ticket builds the API surface those screens call; visual implementation is a separate build item | Next T1 ticket (or dedicated FE ticket) |
| Couple Getaways `privacy_mode` server-side enforcement, CodeHouse address-reveal timing | No PRD exists yet for either segment | Future T1 ticket, flagged now per risk-register §5/§6 |

---

## 12. Handoff notes

**To T2 (Payments & Ledger):**
- `packages/domain/src/booking/refund-policy.ts` is the contract to implement against —
  `REFUND_POLICY_BY_SEGMENT` is `null` for both segments; do not hardcode numbers into `packages/domain`
  itself, wire them from wherever T2's config/admin layer lives so they can change without a code
  deploy once A2 finalizes them.
- `Seat.depositAmountINR`/`balanceAmountINR`/`totalAmountINR` exist on the schema as nullable —
  populate at booking-confirmation time, not before.
- The `CancellationReasonCode` enum already distinguishes `traveler_initiated` from three
  operator-initiated reasons — use it; don't collapse operator-cancellation into a generic
  "cancelled" without the reason code, per both PRDs' §8 requirement.
- A2's unit-economics doc §6.3 flags a specific, testable failure mode if insurance bundling
  (Option B) is chosen: bounty/CAC/refund-drag must be computed against the **pre-insurance** trip
  price. There's no insurance line in this schema yet (out of scope) — when you add it, scope the
  commission-base calculation accordingly from day one, not as a fix-up later.
- A2 flags Partner tiering must be segment-scoped for payout (§4.3 above already implements this in
  the schema) — your payout logic should read `PartnerSegmentTier` per-segment, never a single
  operator-wide tier.
- Incentive-cap guardrail (`bounty% + CAC% + refund-drag% ≤ platform_gross_take% − 18`, A2 §2) has no
  enforcement point in this scaffold yet — that's your build, at payout-confirmation time.

**To T3 (Data/Analytics Engineer):**
- `packages/domain/src/events/event-catalog.ts` is a **type-only contract** — names, trigger points
  (in comments), and payload shapes. No emission exists anywhere in this codebase yet; wire it in at
  the call sites noted in the comments (signup, hard-gate failures, match overrides, state
  transitions, composition-preview renders).
- `match_override_applied` (matching-v0 §5.2) must be captured — P3 explicitly ties the audit
  requirement to your event taxonomy, not just the `MatchOverride` DB row.
- `hard_gate_failed` events are the raw material for understanding catalog/demand mismatch (e.g. how
  many travelers hit Thrilling's skill gate) — useful for A1/G2, wire early.

**To T4 (DevOps & Security):**
- Apply `packages/db/prisma/sql/hard_constraints.sql` as part of the migration pipeline, not a manual
  step — this is the Parvati legal-exclusion enforcement (§5), it must not be skippable in any
  environment including local dev seeded from a fresh migration.
- `Profile.medicalDisclosure` needs encryption-at-rest and captain/operator-scoped access control
  (risk-register §1) — not implemented in this ticket, schema comment flags it.
- OTP/SMS provider, session-secret management, rate limiting on `/api/auth/*` — all stubbed, all
  yours.
- Payments must route through a licensed Payment Aggregator (risk-register §8) — no payment code
  exists yet in this scaffold to audit, but flagging now so it's on your radar before T2 builds it:
  do not let a bespoke fund-holding mechanism get built.
- Merchant KYC as a hard gate before first operator payout (risk-register §2/§8) has no
  implementation here — `Partner.verificationState` exists but there's no `MerchantAccount`/payout
  model yet; that arrives with T2's ticket, flag it in review when it does.

**To T5 (QA):**
- `packages/db/prisma/seed.ts` gives a concrete, referentially-valid fixture set (6 segments, 1
  corridor, 2 partners, sample Thrilling + Trippy trips/departures) — a reasonable starting point for
  test data, not a substitute for a real test plan.
- The two structural constraints worth explicit regression coverage: (1) a Trippy Trip can never be
  created with `sub_location: kasol_parvati` (should fail at both the app layer and, if that's
  bypassed, the DB layer — test both), (2) a group booking with one hard-gate-failing member must
  block only that member's seat, never the whole transaction (matching-v0 §5.3).
- `packages/domain` has zero framework dependencies — the matching/booking logic (`hard-gates.ts`,
  `soft-score.ts`, `state-machine.ts`) is unit-testable in isolation without spinning up Next.js or a
  real database.

**To P2 / P3 (coordination, §0):** please confirm the `CompositionPreview` shape in §0 is what P2
should design the group-composition-preview visual against, or propose a different aggregate — the
data layer supports either.

**To WM1:** No blockers found in P1/P2/P3's docs that would change this ticket's scope. One
cross-agent gap surfaced (§0: P3 never sent P2 the confirmation P2's own doc asked for) — narrow,
doesn't block T1's build, but worth a line in the backlog digest so it doesn't silently drop.
Architecture, domain model, matching data model, booking state machine skeleton, auth, and catalog
structure are implemented per this ticket's DoD; payments/analytics/CI/test-plan work is explicitly
handed off per §11/§12 above, not attempted here.

---

## 13. File map

Everything below now exists on disk (checked ✅ = created/verified this retry-2 session; unmarked =
built in the earlier session and verified by direct read, not re-written).

```
package.json                              — npm workspaces root
tsconfig.base.json
.env.example                              — ✅ DATABASE_URL, SESSION_SECRET
README.md                                 — ✅ setup/run instructions, real-vs-stubbed auth notes
packages/db/
  package.json
  prisma/schema.prisma                    — full domain model
  prisma/sql/hard_constraints.sql         — Parvati CHECK constraint (§5)
  prisma/seed.ts                          — fixture data
  src/client.ts                           — Prisma client singleton
  src/index.ts
packages/domain/
  package.json
  src/identity/age-gate.ts
  src/identity/otp-provider.ts            — ✅ OtpProvider interface + dev-only ConsoleOtpProvider stub
  src/catalog/policy.ts                   — sub_location + altitude publish policy (§5)
  src/catalog/errors.ts
  src/matching/tags.ts                    — P3 tag vocabulary, segment-namespaced (§6)
  src/matching/hard-gates.ts
  src/matching/soft-score.ts
  src/matching/composition-preview.ts     — §0/§6
  src/matching/overrides.ts
  src/matching/types.ts
  src/booking/state-machine.ts            — §7
  src/booking/refund-policy.ts            — §7
  src/booking/group-booking.ts            — §5.3 (matching-v0)
  src/events/event-catalog.ts             — T3 contract, no emission (§12)
  src/index.ts                            — ✅ public barrel export (was missing before retry 2)
apps/web/                                 — ✅ entire tree built this retry-2 session
  package.json
  next.config.mjs
  tsconfig.json
  app/layout.tsx
  app/page.tsx                            — functional placeholder, not P2's designed Home screen
  app/api/auth/signup/route.ts            — real signup + 18+ gate + session cookie
  app/api/auth/login/route.ts             — real email/password + OTP-stub phone login
  app/api/segments/route.ts
  app/api/trips/route.ts
  app/api/trips/[tripId]/route.ts
  app/api/trips/[tripId]/departures/route.ts
  app/api/departures/[departureId]/composition-preview/route.ts
  app/api/departures/[departureId]/seats/route.ts — real per-seat hard-gate booking (§5.3)
  lib/session.ts                          — real HMAC-signed session cookie (not a placeholder)
  lib/get-session.ts                      — reads/verifies the session cookie server-side
  lib/otp.ts                              — dev-only OTP provider singleton (T4 replaces)
```
