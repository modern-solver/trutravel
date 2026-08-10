# PRD — Himachal Adventure Belt × Trippy Tours (First Vertical Slice)

**Author:** P1 (Product Architect) · **Tickets:** TKT-012 · **Milestone:** M1
**Status:** Draft for Engineering feasibility review (T1–T5) and founder sign-off
**Launch target:** September 2026 (founder-set), launching alongside Thrilling Tours in the same
corridor — an explicit founder-directed exception to the default "one corridor × one segment"
working agreement.
**Companion doc:** `docs/prd/himachal-thrilling.md` — read together; both share one domain model
(§3, identical to the Thrilling PRD's §3) so T1 does not have to reconcile two schemas.

**Inputs (read, not re-derived):**
- `docs/agents/shared-context.md` — segment taxonomy, glossary, working agreements
- `docs/strategy/corridor-shortlist.md` (A1) — corridor ranking, Kasol/Parvital demand hypothesis + risk flag
- `docs/strategy/segment-cards.md` (A3) — Trippy Tours card (JTBD, psychographics, matching tags, voice angles, guardrail)
- `docs/strategy/unit-economics.md` (A2) — Thrilling/CodeHouses/Festival modeled (Trippy not separately modeled — see §8 flag)
- `docs/ops/risk-register.md` (A4) — §4 Trippy substance/legal risk, §9.1 substance_stance ruling, §10 go-live blocking list
- `docs/design/brand-voice-principles.md` (G3) — Trippy voice card §3.1, redline
- `docs/design/ui-principles.md` (P2) — trust-surface, state-model, segment-token principles

---

## 1. Problem statement

Free-spirited, conscious-vibe travelers currently self-assemble "loose" group trips through
informal networks (Instagram, backpacker-hostel chat) with real vibe-mismatch risk in both
directions — ending up with a rigid content-shoot crew or a loud party-bro crew misfiled under
"trippy," or facing unwanted pressure from either overly strait-laced or overly permissive
group-mates (A3 §1, fears/objections). TruTravel's wedge: **curated, pace/energy-matched group
travel with a real trust layer (verified operators, named captains, code of conduct)** — while
structurally avoiding the single biggest brand and legal risk this segment carries: any
perception that TruTravel facilitates, sources, or condones substance use (A3's guardrail, A4 §4).

JTBD (lifted from A3): *When I want to travel loose and unplanned, help me find a crew with
compatible energy and pace so I don't have to either travel alone or negotiate vibe-mismatch
with strangers.*

**This PRD is written under two explicit, non-negotiable scope constraints, stated here as
decisions this PRD makes — not omissions someone should notice later:**

1. **No `substance_stance` field anywhere in the Trippy data model.** The founder has ruled this
   out. A4's risk register (§9.1) offered the founder two options (build it narrowly-constrained
   with legal sign-off, or don't build it as a stored field at all); the founder has selected the
   equivalent of option 2. Pressure-mismatch avoidance (A3's stated purpose for the tag) is
   handled entirely through **captain training, a published code of conduct, and Anchor Operator
   policy** — never a stored user or trip attribute, public or internal. See §6.
2. **Parvati Valley (Kasol/Tosh/Malana) is excluded from the September 2026 launch geography.**
   A4 flagged this specific sub-zone (not "Trippy in Himachal" generally) as carrying NDPS Act
   abetment-optics exposure with no legal owner currently assigned to review it (A4 §4, §10). WM1
   routed this PRD to scope Trippy's launch sub-corridor(s) to other parts of Himachal instead.
   See §2.

## 2. Target corridor × segment

**Corridor:** Himachal Adventure Belt, scoped to **Manali and Bir** for the September 2026
launch — the same two sub-corridors as the companion Thrilling PRD, chosen independently for
Trippy's own reasons below (not merely copied from Thrilling):

- **Manali:** established backpacker/traveler density (Old Manali, Vashisht) with the kind of
  laid-back, nature-adjacent, café-and-community culture that fits Trippy's positioning without
  Parvati Valley's specific cannabis-culture association (A4 §4 draws this distinction explicitly
  — the risk is Parvati-specific, not Himachal-wide).
- **Bir:** paragliding-and-slow-travel culture, Dharamkot-adjacent coworking/backpacker scene
  (also relevant to CodeHouses per A1, though CodeHouses is out of scope for this PRD) — offers a
  genuinely different Trippy flavor (mountain-village, artsy, unhurried) than Manali's, giving
  the segment real sub-corridor variety without touching Parvati.

**Explicitly excluded for September, and why (stated as a scope decision, not a silent gap):**

> **Parvati Valley (Kasol/Tosh/Malana) is out of scope for Trippy Tours at launch.** A4's risk
> register flags this specific sub-zone as an active NDPS Act enforcement area with real
> abetment-liability exposure if TruTravel runs Trippy content, marketing, or Anchor Operator
> partnerships there — independent of and in addition to the segment-wide "not a drug
> marketplace" guardrail (A3, A4 §4). No legal review of this sub-zone exists yet, and A4 does
> not clear it unilaterally (correctly — it's marked FOUNDER DECISION in A4 §4/§10). This is not
> a permanent product decision: **Parvati Valley is a plausible future Trippy expansion inside
> the same Himachal corridor, contingent on a dedicated legal review (NDPS abetment exposure)
> that has not yet been commissioned.** P1 recommends this review be requested explicitly, not
> assumed to happen organically — see §12.

**Segment:** Trippy Tours only, in this PRD. Trippy and Thrilling are separate product surfaces,
separate Trip catalogs, sharing only the corridor and the domain model — never presented as
variants of each other (shared-context §2, "segments are not filters").

## 3. Domain model (identical to the Thrilling PRD's §3 — shared, not re-derived)

| Entity | Definition | Key states / attributes |
|---|---|---|
| **Corridor** | Geographic product cluster. `Himachal Adventure Belt`, with a `sub_location` attribute (`manali`, `bir`, `kasol_parvati` [locked — see §2], `spiti` [future, unrelated to Trippy]). | — |
| **Trip** | A bookable SKU template: one trip concept at one sub_location, owned/delivered by one Anchor Operator. Not date-specific. | `segment`, `sub_location`, `pace_preference`, `group_size_pref`, `anchor_operator_id` |
| **Departure** | A specific scheduled instance of a Trip (dates, seats, assigned Captain). | State: `Open / Filling / Waitlist / Locked / Cancelled` (per P2 §1.3) |
| **Seat** | One traveler's booking on a Departure. | State: `Pending / Confirmed / Refund pending / Refunded / Cancelled` (per P2 §1.3) |
| **Captain** | TruTravel-recruited community host assigned to a Departure. For Trippy, the Captain *is* the safety/culture lead (no separate "guide" role — see §6 for the contrast with Thrilling). | Identity-verified (basic tier, A4 §1) before hosting any live Departure; completes Trippy-specific code-of-conduct training (§6) |
| **Anchor Operator** | Licensed T1/T2/T3-tier local partner (A2 §2 tiering model) delivering the Trip. Must pass A4 §1–§2 onboarding checklist before any Trip goes live. | Verification state: `Unverified / Under review / Verified / Suspended` (P2 §1.3) |

`kasol_parvati` exists in the `sub_location` enum for domain-model consistency across the
corridor (Thrilling may plausibly reference it too, in future), but **no Trippy Trip may be
created with `sub_location: kasol_parvati` until the legal review in §2 clears it** — this
should be an enforced constraint (allow-list, not a UI-only warning), not a convention T1/G2
have to remember manually. Flag to T1/T4 as a real validation rule, not documentation.

## 4. Reference summary (not re-derived — see source docs for detail)

- **A1:** Himachal is A1's #1-ranked corridor for Trippy (medium confidence), specifically citing
  "Kasol/Tosh/Parvati Valley free-spirit culture" as the natural fit — which is precisely the
  sub-zone this PRD excludes for September (§2). This PRD deliberately launches Trippy in the
  *rest* of the corridor first, treating Parvati as a higher-risk, higher-upside fast-follow.
- **A3:** Full Trippy segment card (JTBD, psychographics, fears, group norms, matching tags,
  voice, guardrail) at `docs/strategy/segment-cards.md` §1 — this PRD does not restate it, only
  the operational implications, and explicitly does not carry forward the `substance_stance` tag.
- **A2:** Trippy Tours was not separately modeled in A2's unit-economics doc (Thrilling,
  CodeHouses, and Festival were the three segments chosen "for structurally distinct cost
  drivers"). **Flag to A2:** Trippy needs its own seat-level waterfall before or shortly after
  launch — this PRD assumes Trippy's cost structure is closer to CodeHouses' curation-heavy
  profile than Thrilling's guide/permit-heavy profile (lighter operator logistics, more
  platform-side curation/matching value-add), but that is a P1 hypothesis, not a modeled number.
  See §8.
- **A4:** Full cross-cutting risk register at `docs/ops/risk-register.md`. This PRD treats §1
  (cross-cutting, all MVP must-haves), §4 (Trippy substance/legal risk, in full), and §9.1
  (substance_stance ruling) as binding constraints.

## 5. User stories

**Traveler (booking a Trippy trip)**
- As a free-spirited traveler, I want to declare my pace preference (unplanned / loosely planned
  / structured) and group-size preference before booking, so I land in a group whose rhythm
  actually matches mine.
- As a traveler, I want to see a real code of conduct and my Captain's name/identity-verification
  badge on the same screen as the trip pitch, so "free-spirited" doesn't read as "unsupervised"
  (A3 fears, G3 §3.1 redline).
- As a traveler, I want it to be obvious from the trip content itself that this is not a
  substance-facilitation product — not because I'm looking for that, but because I want the
  platform to have clearly thought about it, which builds trust in everything else it claims
  (A3's "biggest brand-risk fear for TruTravel itself" framing).
- As a traveler who wants zero substance exposure, I want a way to signal that expectation to my
  Captain and group without the platform storing a structured "substance preference" profile on
  me (see §6 for how this is handled without the excluded tag).
- As a traveler, I want to see the same emergency contact / 18+ / waiver flow as any other
  TruTravel booking, so safety basics aren't treated as optional just because the segment feels
  informal (A4 §1 applies platform-wide, not selectively).

**Captain**
- As a Captain, I want structured training and a published code of conduct I can point to (and
  enforce) with my group, so "non-hierarchical, consent-first" group norms (A3) aren't just a
  vibe I'm expected to intuit — they're a documented standard I was trained on.
- As a Captain, I want a clear, documented incident-response protocol for a substance-related
  medical or legal incident on a trip (A4 §4's last row), so I know exactly what my role is
  (duty-of-care coordination) and isn't (intervening in law enforcement, providing legal defense).

**Anchor Operator**
- As an Anchor Operator, I want to go through the same A4 §1–§2 verification checklist as any
  other segment's operator, so there's no separate, lighter-weight bar for Trippy that could be
  read as the platform treating this segment as less serious about safety (explicitly counter to
  A3's own fear that "the segment feels loose or informal" invites corner-cutting).

**Ops / Content / Platform**
- As G3 (Brand & Content), I want every piece of Trippy-facing content to pass an explicit A4
  sign-off gate before shipping (A4 §4, standing requirement, not one-time), so this PRD's
  guardrails survive past launch week.
- As Ops (G2), I want the `kasol_parvati` sub-location to be structurally blocked from Trippy
  Trip creation, not just a policy everyone remembers, so a well-meaning operator-onboarding
  mistake can't accidentally ship a Parvati Trippy listing.

## 6. Substance-adjacent trust — handled via people and policy, not data

This is the PRD's most important design decision, stated explicitly per the task's instruction
to treat it as a decision, not an omission.

**What is NOT in the data model:** any field capturing a traveler's substance stance, tolerance,
or preference — soft, hard, internal-only, or otherwise. No `substance_stance` tag, no renamed
equivalent, no adjacent field that reconstructs the same signal (e.g., a generic "openness" tag
that's really substance-coded). P3, when designing the matching rubric (TKT-008, out of this
PRD's scope), should treat this as a hard constraint on the tag schema, not a suggestion to
work around.

**What replaces it — the actual mitigation for the pressure-mismatch risk A3 identified:**

1. **Published code of conduct** (G3/P1-owned copy, A4-reviewed): explicit "zero tolerance for
   pushiness, proselytizing, or pressuring others into substances or activities" language (lifted
   directly from A3's group-norms section), shown to every traveler pre-booking and every Captain
   during training.
2. **Captain training module** (G1-owned, this PRD specifies the requirement not the curriculum):
   every Captain assigned to a Trippy Departure completes training on reading group energy,
   de-escalating pressure dynamics, and enforcing the code of conduct — before hosting their
   first live Departure. This is the operational answer to A3's "mismatch anxiety runs both
   directions" fear.
3. **Anchor Operator policy requirement:** operator onboarding checklist (A4 §1–§2, applied to
   Trippy like every other segment) includes acknowledgment of the code of conduct and the
   platform's zero-facilitation stance as a condition of listing.
4. **Incident-response protocol** (A4 §4, last row, already specified there): written protocol
   for a substance-related medical/legal incident — platform provides duty-of-care coordination
   (emergency contact, medical response via operator) and explicitly does not intervene in law
   enforcement, post bail, or provide legal defense. This ships as a Captain-facing protocol doc
   + a ToS clause, not a product feature.
5. **Standing content-review gate** (A4 §4, first row): every Trippy-facing surface — trip
   listings, matching-question copy, marketing — gets an A4 sign-off pass before shipping, for
   the life of the segment. This PRD does not resolve this gate; it confirms the gate exists and
   applies to this slice.

**Net effect:** the compatibility signal A3 wanted (avoid grouping a zero-exposure traveler with
an actively-social group) is *not* achieved algorithmically at MVP. It is achieved by culture,
training, and a Captain empowered to actually manage group composition/tone in real time. This is
a real capability tradeoff (less precise than a matching signal) accepted deliberately in exchange
for removing the highest-severity legal/brand attack surface in A4's entire register. Flag to P3:
do not attempt to recover this signal indirectly through some other tag's semantics.

## 7. Matching tags (input vocabulary for P3 — P1 does not design the scoring rubric)

Per A3's Trippy card, **with `substance_stance` removed per §6 above**, the remaining input
vocabulary for P3's TKT-008:
`segment: trippy_tours` (hard) · `pace_preference` (soft) · `group_size_pref` (soft) ·
`noise_energy` (soft) · `spiritual_openness` (soft) · `photography_comfort` (soft) ·
`prior_trippy_trips` (soft).

`age_band`/18+ is a **hard platform-wide gate at signup** (A4 §1), not a segment-level soft
matching tag — same treatment as the Thrilling PRD, consistent across both.

**Note to P3, flagged explicitly here so it isn't lost:** A3's original card listed
`substance_stance` in this same vocabulary block. Do not lift it from the segment-cards.md source
document directly without cross-checking this PRD — the segment-cards.md doc predates this
scoping decision and has not been retroactively edited. This PRD (and A4 §9.1) supersede it on
this specific point.

## 8. Economics and refund policy — open item, not solved here

Unlike Thrilling, A2's unit-economics doc did not model Trippy Tours (§4 of this PRD). This PRD
does **not** invent Trippy pricing, take-rate, or refund-percentage numbers — that would violate
this PRD's own scope boundary and A2's ownership. What this PRD does specify:

- **Booking-flow shape should mirror Thrilling's** (split deposit/balance capture, tiered
  cancellation windows, policy summary visible pre-payment, per the companion PRD §8) so T2 can
  build one general-purpose refund/cancellation mechanism parameterized per segment, rather than
  two bespoke ones. The actual deposit %/window values for Trippy are A2/T2's to set once A2
  models this segment.
- **Flag to A2, explicit ask:** please produce a Trippy seat-level waterfall (mirroring §1 of
  `docs/strategy/unit-economics.md`) before or shortly after September launch. P1's working
  hypothesis (stated as a hypothesis, not a number) is that Trippy's cost structure is
  curation-heavy rather than logistics-heavy (lighter permits/gear/guide costs than Thrilling,
  but real Anchor Operator costs for stays/local transport/shared meals per A3's group-norms
  section) — closer to CodeHouses' profile than Thrilling's, but this needs A2's actual modeling,
  not P1's guess, before it drives pricing decisions.
- **No refund-rate red flag equivalent to Thrilling's 12.5% breakeven exists yet for Trippy**
  because no baseline model exists. This is a real open risk (the 18% contribution floor still
  applies platform-wide, per shared-context §3), just not one this PRD can quantify.

## 9. Scope — IN vs OUT (September 2026 MVP)

**IN**
- Manali + Bir sub-corridors only (§2)
- Trip catalog: 2–4 Trip templates at launch (recommend: one Manali-based and one Bir-based
  loosely-structured multi-day trip, varying pace/group-size to give real matching signal) —
  exact count is a G2/A1 supply-sourcing call, not fixed here
- Anchor Operator onboarding against the **same** A4 §1–§2 checklist as Thrilling — no
  segment-specific relaxation of registration/insurance/KYC requirements
- Captain role: basic identity verification + Trippy-specific code-of-conduct training (§6) —
  required before hosting any live Departure
- Booking flow: pace/group-size/noise-energy/etc. self-declaration (§7 tag set), split
  deposit/balance payment structure mirroring Thrilling's shape (§8), emergency contact +
  waiver + 18+ gate (A4 §1 must-haves, platform-wide)
- Trust surfaces on Trip card and detail view per P2 §5: operator verification state, Captain
  identity + training status, code of conduct, policy summary, group composition/fill state
- Departure/Seat state machines exactly as defined in P2 §1.3 (identical to Thrilling PRD — no
  new states invented here)
- Matching tag vocabulary (§7, `substance_stance`-free) available for P3
- `kasol_parvati` present in the `sub_location` enum but hard-blocked from Trip creation (§3, §2)

**OUT (explicit cuts, not silent omissions)**
- **Parvati Valley (Kasol/Tosh/Malana) sub-location** — excluded pending legal review, not a
  permanent exclusion (§2). Flagged to A4/founder as a future workstream, §12.
- **`substance_stance` field or any equivalent** — permanently out of this PRD's data model per
  founder ruling (§6), not a "later" item — different category of cut than the Parvati exclusion.
- Algorithmic pressure-mismatch avoidance — replaced by people/policy mitigation (§6); a future
  version of this feature (if the founder later chooses A4's option 1, a legally-reviewed
  narrowly-constrained field) would be a distinct future PRD, not an MVP fast-follow assumed here.
- Trippy-specific pricing/refund model — A2 to produce; this PRD only specifies flow shape (§8)
- Any high-altitude trekking legs as a *primary* Trippy Trip anchor — if a Trippy itinerary
  incidentally includes moderate hiking, the Thrilling PRD's `standard`/`high_altitude` gating
  logic (companion PRD §7) applies identically; Trippy Trips should default to non-technical
  terrain and are not expected to need the high-altitude package at MVP, but the same
  `altitude_tier` field exists on every Trip regardless of segment for consistency
- Off-platform WhatsApp/Signal group tooling — A3 notes this is expected culturally but it's an
  off-platform behavior, not a TruTravel product surface to build
- Multi-operator Trips (same rule as Thrilling PRD — one Trip = one Anchor Operator at MVP)

## 10. Feasibility / effort flags for Engineering (P1's best call — T1 to confirm)

| Item | P1's rough read | Why flagged |
|---|---|---|
| Departure/Seat state machine + trust-surface rendering | **Standard build, MVP-realistic** | Same underlying system as Thrilling PRD — no segment-specific novelty here |
| `kasol_parvati` hard-block on Trip creation (§3) | **Low effort, high importance** | A simple allow-list/validation rule, but must not be treated as optional — this is the enforcement mechanism for a founder-level legal risk decision, not a nice-to-have |
| Captain code-of-conduct training + completion tracking (§6) | **Low-medium, mostly G1/G2 process** | Engineering need is just a completion-status flag gating Departure assignment; the actual training content is G1's build, not T1's |
| Booking-flow parameterization to share mechanics with Thrilling (§8) | **Medium, and worth doing once** | Recommend T2 build one segment-parameterized refund/deposit mechanism rather than two bespoke Thrilling/Trippy flows — flag this explicitly as a build-order suggestion, not just a scope note |
| Matching tag capture (pace/group-size/noise-energy/etc.) | **Low-medium** | Capture is simple; P3's scoring logic is out of this PRD's scope |
| Content-review gate workflow (A4 §4, standing requirement) | **Low engineering, real ops-process build** | Likely a lightweight approval-state field on content objects (G3-authored, A4-approved) rather than a complex workflow engine — confirm with T1/T3 |

**Open feasibility questions for T1 to confirm:**
1. Can the `sub_location` allow-list/hard-block (§3) be implemented as a straightforward
   server-side validation rule, or does the Trip-creation flow's current design make this harder
   than it sounds? Flag now if so — this is a must-have, not negotiable on timeline grounds.
2. Does sharing one parameterized refund/deposit mechanism across Thrilling and Trippy (§8, §10)
   actually save build time, or does segment-specific policy divergence (once A2 models Trippy)
   make a shared mechanism more complex than two simpler ones? P1's instinct is share-first, but
   defers to T2's read.
3. Realistic timeline check: does adding a second segment (Trippy) to the same September launch
   window meaningfully increase QA/build surface area beyond what Thrilling alone would take, or
   is the marginal cost low because the domain model (§3) is shared? Flag honestly — if the
   two-segment simultaneous launch is genuinely tight for September, that's exactly the kind of
   thing this PRD is supposed to surface rather than pad over.

## 11. Legal / safety risk flagged to A4 (not silently deferred)

- **§2 Parvati Valley legal review** — this PRD does not resolve A4's flagged NDPS
  abetment-exposure question, it scopes around it. Flagging explicitly: **no one has been
  assigned to commission this legal review yet** (same unassigned-legal-counsel gap A4 named in
  §10 for the platform-wide ToS/waiver workstream — this may be the same workstream or a distinct
  one; founder should clarify). Without an owner, "future addition contingent on legal review"
  risks becoming indefinite by default.
- **§6 substance-adjacent incident-response protocol** — this PRD assumes A4's already-specified
  protocol (§4, last row of the risk register) is being drafted into an actual Captain-facing
  document and ToS clause; flagging to confirm this isn't just a register entry but an actual
  artifact that exists before launch.
- **§6 content-review gate** — this PRD depends on A4's standing sign-off gate (§4, first row)
  actually being operationalized (who reviews, what SLA, what happens if a piece of content is
  rejected close to a launch deadline) — flagging that "standing gate" needs a concrete owner and
  process, not just a principle, given the September timeline pressure.
- **App-store policy risk** (A4 §4, third row) — flagging forward to A4/G3 that this PRD's
  content (trip listings, matching-question copy) should go through the pre-submission app-store
  policy review A4 specifies before any Trippy-inclusive app-store submission, given the
  platform-wide blast radius A4 describes.

## 12. Open questions for WM1 / founder

1. Who commissions and owns the Parvati Valley legal review (§2, §11)? This PRD treats the
   exclusion as temporary-pending-review, but that framing only holds if a review is actually
   scheduled — otherwise it's a permanent exclusion in practice. Recommend WM1 assign this
   explicitly rather than let it default to "someday."
2. Does the founder want A2 to prioritize modeling Trippy's unit economics (§8) before or after
   September launch? Launching without a modeled contribution-margin baseline is a real (if
   common at pre-launch stage) risk the founder should consciously accept, not one this PRD
   should paper over.
3. Confirm: is the founder's `substance_stance` ruling (§6) intended to be permanent product
   policy, or a launch-time decision revisitable once the segment has real trust/track record?
   This PRD treats it as a firm decision either way for September, but the framing (§9's "OUT"
   list) matters for how P3/G1 talk about it going forward.
4. Given Trippy and Thrilling now share one September launch window in one corridor (a founder
   exception to the default one-corridor-one-segment rule), does the founder want a single
   combined go/no-go gate (both ship together or neither does) or independent go/no-go per
   segment if one segment's build/legal/supply readiness lags the other?
