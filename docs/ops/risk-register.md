# TruTravel — MVP Risk Register (TKT-006)

**Author:** A4 (Risk & Trust Analyst) · **Milestone:** M1
**Status:** Draft for P1 (TKT-007), T4, G2 to act on; also feeds weekly margin & trust review (A2+A4+T2+G2)
**Inputs:** `docs/agents/shared-context.md`, `docs/strategy/corridor-shortlist.md` (A1 — Kasol/Parvati
flag, high-altitude trek flag), `docs/strategy/segment-cards.md` (A3 — sensitive tag flags),
`docs/design/brand-voice-principles.md` (G3), `docs/design/ui-principles.md` (P2)

---

## 0. How to read this doc

- **Severity** = worst-case impact if the risk materializes (low/med/high/critical), independent
  of how likely it is.
- **Likelihood** = how probable this is to occur at MVP scale/behavior if unmitigated (low/med/high).
- **MVP must-have vs. later** = whether the mitigation must exist before the first vertical slice
  goes live, or can be phased in after launch with monitoring.
- I do **not** unilaterally clear anything that trades safety for speed. Where a real policy
  tradeoff exists (not just an engineering task), I've marked it **FOUNDER DECISION** instead of
  picking the lenient path myself, per my scope boundary.
- Corridor/segment context assumes A1's leading candidate (**Himachal Adventure Belt × Thrilling
  Tours**, with Trippy/CodeHouses as same-corridor follow-on segments) unless noted, since that's
  the live recommendation pending founder sign-off. Rows are still useful verbatim if the founder
  picks the runner-up (Rishikesh × Wellness) — see notes inline where corridor choice changes the
  risk profile materially.

---

## 1. Cross-cutting risks (apply to every segment / the whole platform)

| Risk | Segment/Area | Severity | Likelihood | Mitigation | MVP must-have vs. later |
|---|---|---|---|---|---|
| Anchor Operator has no real business registration, insurance, or guide/staff certification — platform lists an unverified/unsafe operator | All segments | **Critical** | High (thin operator density in India adventure/wellness market; onboarding pressure to fill supply fast) | Mandatory onboarding checklist before any operator can list a live departure: business registration (state tourism dept. registration or equivalent + GST), general liability insurance certificate, activity-specific staff certification (see §3 for trekking), tourist-vehicle permit if transport included. Render verification state (Unverified / Under review / Verified / Suspended) per P2's existing state model, visible on every trip card. | **MVP must-have** — this is the baseline trust surface P2/G3 already assume exists. Ongoing spot-audits (G2) can be phased. |
| No traveler emergency contact / medical-disclosure capture at booking | All segments | High | High if not built (nobody adds this by default) | Mandatory emergency contact + basic medical-disclosure (allergies, conditions relevant to the activity) field at checkout for every booking, encrypted at rest, visible to captain/operator only for the specific active trip. | **MVP must-have** — cheap to build, load-bearing for every other physical-safety mitigation below. |
| No age gate — minors booking segments with alcohol-adjacent, romantic, or co-living exposure | Trippy, Couple Getaways, CodeHouses, Festivals | High | Med | Hard 18+ age gate at account signup (platform-wide), not per-segment. India's legal age of majority is 18. | **MVP must-have** — single hard constraint, trivial to build, high downside if skipped. |
| Captains (volunteer-to-pro hosts) have no identity verification despite close, sometimes overnight, contact with travelers | All segments (esp. Trippy, CodeHouses, Thrilling multi-day) | High | Med | Minimum government-ID verification for any Captain role before they can host a live trip; align with `identity_verification_level` tag mechanics being built for CodeHouses (§4) rather than inventing a parallel system. | **MVP must-have** at "basic" tier. Deeper background-check tiers: later. |
| Fake/fraudulent operator or trip listings used to harvest payment info or run chargeback fraud | All segments | High | Med | Tie to Anchor Operator KYC (row 1) and payment-side merchant KYC (§5) — these are the same control from two angles; don't build separately. | **MVP must-have** (via §5's merchant-KYC control). |
| Platform ToS/liability waiver not legally sound for India (activity risk, co-living risk, cancellation terms) | All segments | Critical | High if skipped | Legal counsel (outside A4's scope to draft) must produce India-specific ToS + activity waivers before launch; A4 flags this as a hard launch dependency, does not draft it. **§3.1 (TKT-016) makes this gap concretely load-bearing for high-altitude Thrilling specifically** — see that section for the content spec the drafter needs to work from. | **MVP must-have — FOUNDER: assign legal counsel, not currently owned by any agent on the roster.** |

---

## 2. KYC & Anchor Operator verification (deep-dive)

| Risk | Segment/Area | Severity | Likelihood | Mitigation | MVP must-have vs. later |
|---|---|---|---|---|---|
| Operator running high-risk activity (trekking, water sports, motorsport) without certified guides | Thrilling | Critical | High in Himachal specifically — thin certified-guide supply outside Indiahikes/Bikat-tier operators | Require proof of guide certification (basic mountaineering / activity-specific cert) as a listing gate for any Thrilling SKU rated above "beginner" difficulty. | **MVP must-have** |
| No restricted-area / permit compliance (Inner Line Permit zones, forest/wildlife permits in parts of Himachal/Ladakh) | Thrilling (esp. any route touching restricted zones) | High | Med | Operator onboarding checklist includes permit proof for any route requiring one; P1/T1 should scope first-slice routes to permit-free zones if permit-verification tooling isn't ready at launch. | **MVP must-have for any route requiring a permit; scope around it if not ready.** |
| Foreign guests staying at partner accommodation (CodeHouses, homestays) without required FRRO/C-Form registration | CodeHouses, any multi-night stay with foreign travelers | Med | Med | Anchor Operator onboarding checklist requires operators confirm they handle FRRO C-Form registration for foreign guests as part of normal compliance (this is an existing hotel/homestay legal obligation, not new to TruTravel) — platform should not host operators who can't confirm this. | **MVP must-have (contractual confirmation, not platform-built tooling).** |
| Operator payout enabled before merchant KYC complete → platform pays an unverified entity, creates RBI Payment Aggregator compliance exposure | All segments | Critical | High if payments and operator-verification workstreams aren't explicitly linked | Merchant KYC (PAN, GST, bank account + cancelled cheque) is a **hard gate on first payout**, not just a trust nice-to-have — this is also an RBI PA/PG regulatory requirement (see §5). | **MVP must-have — hand off to T2/T4 as a blocking gate in the payout flow, not a soft warning.** |

---

## 3. High-altitude trek liability & insurance (A1 flag, Himachal/Thrilling)

| Risk | Segment/Area | Severity | Likelihood | Mitigation | MVP must-have vs. later |
|---|---|---|---|---|---|
| Acute Mountain Sickness (AMS) or other altitude-related medical emergency with no evacuation plan | Thrilling — any route above ~3,000m (Bir/Kasol-adjacent high routes, Spiti-adjacent extensions) | **Critical** | Med-High (real, recurring failure mode in Himalayan trekking generally) | Mandatory operator-provided emergency evacuation plan per route (nearest hospital, helicopter-evac contact, satellite/comms plan for no-signal zones) filed before the route can go live as a bookable SKU. | **MVP must-have for any route above the altitude threshold — block that specific SKU from going live without it.** |
| Traveler has an undisclosed pre-existing condition (cardiac/respiratory) that's dangerous at altitude | Thrilling | High | Med | Mandatory health-disclosure + waiver at booking (ties to §1 cross-cutting row), explicit altitude-risk acknowledgment separate from generic ToS. | **MVP must-have** |
| Standard travel insurance excludes high-altitude/adventure-sports activity (common exclusion above ~3,500m or for "adventure sports" category) — traveler believes they're covered and isn't | Thrilling | High | High (this is a very common gap, not an edge case) | Require proof of adventure-sports-rated insurance at booking OR offer/bundle a compliant policy via a G4-sourced insurance partner. Do not let a traveler book a high-altitude SKU with silent insurance ambiguity. | **MVP must-have** — **FOUNDER/G4: need an actual insurance partner sourced before this can be enforced as "bundle," but the disclosure/proof requirement itself must exist at launch regardless.** See §3.1 (TKT-016, supersedes TKT-015) for the ruling on whether the founder's chosen model — traveler opt-in insurance plus mandatory disclosure/waiver, no operator-side mandate — satisfies this row. |
| Guide/operator not certified for the specific terrain grade sold | Thrilling | Critical | Med | Covered by §2 row 1 (guide certification gate) — don't duplicate control. | **MVP must-have** (via §2) |

**Corridor note:** if the founder instead picks the Rishikesh–Uttarakhand × Wellness runner-up, this
entire §3 block mostly drops out (A1 already flags Wellness as the lowest-legal-exposure option) —
worth weighing given how much MVP-blocking surface area §3 alone adds to a Himachal-first launch.

### 3.1 Ruling: does per-seat-optional insurance satisfy the proof-of-coverage must-have? (TKT-016 — supersedes TKT-015)

**Status: this section replaces the TKT-015 ruling below in full. TKT-015 required a mandatory
Anchor-Operator-side baseline group policy as an additive fix. The founder rejected that requirement
— explicitly not on cost-burden grounds (A2's own modeling in `unit-economics.md` §6.4 found Option
C1 floor-neutral for TruTravel's contribution margin) but on principle: TruTravel should not mandate
operator-side insurance requirements as platform policy. That is a firm philosophical boundary, not a
negotiable implementation detail. This ruling does not re-propose any variant of an operator-side or
platform-side insurance mandate, and this boundary should not be revisited for cost reasons later —
only a genuine change in circumstance (not a cost re-run) would be grounds to reopen it.**

**Inputs:** the founder's original pricing decision (insurance attaches as a **per-seat optional
add-on** at checkout, unchanged and not reopened by this ruling); the founder's TKT-015 rejection
and confirmed direction that the proof-of-coverage gap closes via **mandatory strong
disclosure/waiver language** at the point of decision — the "accepted-risk path" the TKT-015 ruling
itself sketched as an alternative to the operator-side mandate, now confirmed as the actual MVP
direction, not a fallback.

**Ruling: PASS — traveler opt-in insurance, exactly as originally priced, is the accepted MVP path.
No operator-side or platform-side coverage mandate exists in this register. This pass is conditional
on the disclosure/waiver content requirements below existing as real, legally reviewed text before
any high-altitude Thrilling SKU goes live — not conditional on any operator-side mechanism.**

The dividing line this register has used throughout (§0, and TKT-015's own framing) still holds: a
**disclosed** accepted risk is a legitimate MVP posture; a **silent** gap is not. What changes under
this ruling is the mechanism that does the disclosing. TKT-015 closed the gap by guaranteeing a
coverage floor (operator-side baseline) so that even a silent traveler was covered by default. That
mechanism is now off the table on principle, not on cost. With no guaranteed floor, the entire weight
of closing the §3 must-have ("do not let a traveler book a high-altitude SKU with silent insurance
ambiguity") shifts onto the disclosure/waiver itself. It has to actually do that job — a weak,
generic, or buried waiver would recreate exactly the silent gap §3 was written to prevent, just with
a signature on it instead of nothing. That is why the content requirements below are specific and
non-negotiable as a *content spec*, even though the pricing/bundling mechanism is settled.

**What the mandatory disclosure/waiver must cover for this to be a legitimate accepted-risk path
rather than a liability gap (content spec for the legal drafter — not the drafting itself):**

1. **What TruTravel does and does not guarantee.** Explicit statement that TruTravel does not
   include any medical, evacuation, or trip-cancellation insurance coverage by default for this
   booking. Scope this precisely — it should not read as disclaiming the platform's *other*
   guarantees elsewhere in this register (Anchor Operator verification, guide certification,
   operator-filed evacuation plan per this route per §3 row 1). Those remain platform guarantees;
   only insurance coverage of the traveler's own medical/evacuation cost is what's being disclaimed
   here. Conflating the two would either overstate the disclaimer (scaring travelers off a safe
   product) or understate it (burying the actual gap) — neither is acceptable.
2. **What's specifically excluded that a traveler might reasonably assume is covered.** Name, in
   plain terms, that standard travel insurance commonly excludes high-altitude/adventure-sports
   activity above the route's altitude threshold, and that AMS/altitude-illness hospitalization and
   helicopter evacuation cost are the two highest-cost, highest-likelihood gaps for this specific
   activity category. This has to be named explicitly, not left for the traveler to infer from a
   general "coverage may vary" statement.
3. **An affirmative acknowledgment step at the point of declining the add-on**, not a passive
   "by booking you agree" clause folded into general ToS. A traveler who skips or declines the
   per-seat insurance product must take an explicit action (e.g., a checkbox distinct from the
   general booking-confirmation checkbox) that states, in plain language, that they are proceeding
   without confirmed coverage for this risk category unless they hold their own qualifying policy.
   Passive/implied consent is not sufficient for a risk category this severe (Critical/Med-High per
   the §3 table).
4. **A prompt to check existing coverage, framed honestly.** The traveler may already hold a
   qualifying policy. Ask them to confirm whether their own travel insurance covers high-altitude
   adventure activity specifically — self-attested, not platform-verified (per TKT-015's earlier,
   still-valid reasoning: TruTravel has no real-time insurer verification at MVP, so a "policy
   number" field would create false audit-trail confidence rather than real assurance). Frame this
   step as a prompt to check, not as platform verification, so it doesn't imply a guarantee that
   doesn't exist.
5. **Timing/placement: at the point of decision, not after.** This must appear on the same
   screen/step where the traveler is actively choosing to add or skip the per-seat insurance
   product — not in a post-booking confirmation email, not behind a generic "Terms & Conditions"
   link agreed to at account signup, not buried several steps earlier in the funnel. This is a
   concrete UI requirement for whoever builds the insurance add-on step (flagged to T2/P2 below).
6. **Plain language at the decision point, with fuller legal text as backing, not as the only
   version.** The substance above must be legible to a non-lawyer traveler in the moment they
   decide — short, specific to this route/activity, not generic boilerplate. A complete legally
   binding version can and should live in the ToS/waiver document proper, but the booking-flow
   copy itself cannot rely on the traveler having read that separate document; it must stand on
   its own.
7. **Route/altitude-specific, not generic.** Reuse the actual altitude and route data this
   register already requires operators to file (§3 row 1's evacuation plan, the altitude threshold
   itself) so the waiver names the real risk of the real SKU being booked — a generic
   "adventure activities carry risk" clause is not sufficient for a route-specific, Critical-severity
   exposure.

**This is a content spec, not legal text — and the gap behind it is not closed.** Everything above
describes what legally sound waiver/disclosure language needs to *contain*. None of it exists yet as
actual reviewed legal text. As already flagged in §1's cross-cutting ToS row (and carried forward,
unresolved, through TKT-015's own "spec, not full drafting" caveat) — **no agent on the current
roster owns India ToS/waiver legal drafting.** This was a gap A4 flagged and implicitly relied on in
both TKT-006 and TKT-015. It is now the single most load-bearing unresolved dependency in this
register, and it needs to be stated plainly: with the operator-side baseline removed from the
design, the disclosure/waiver is no longer one layer of protection sitting on top of a guaranteed
floor — it is the *entire* mechanism standing between "a traveler made an informed, accepted-risk
decision" and "a traveler had no real idea they were uncovered." A content spec, however complete, is
not enforceable, is not legally reviewed for India-specific waiver-enforceability limits (personal-
injury waiver enforceability under Indian law has real limits a qualified drafter needs to navigate —
that is not something A4 can rule on), and is not actually protective of either the traveler or the
platform until a qualified drafter turns it into real text and it clears legal review. **Regardless
of how sound the principles in this ruling are, this accepted-risk path is not actually safe to ship
until that drafting happens.** This is a harder, more direct blocker than it was under TKT-015 —
under TKT-015 a late or weak waiver would have still left the operator-side baseline as a backstop;
under this ruling there is no backstop.

**MVP status:** traveler opt-in insurance, unchanged from the founder's original pricing decision,
plus mandatory disclosure/waiver at the point of decision (content spec above) is the confirmed MVP
path for the §3 must-have. This supersedes TKT-015's operator-side baseline requirement in full — no
operator-side or platform-side insurance mandate exists in this register going forward, and none
should be re-proposed on cost grounds absent a genuine change in circumstance. The content
requirements above are ready to hand to a legal drafter. The drafting and legal review itself remains
an unresolved go-live blocker (§10), tied directly to the unowned ToS/waiver-drafting gap.

<details>
<summary>Superseded: original TKT-015 ruling (kept for audit trail — no longer in effect)</summary>

**Original TKT-015 ruling: CONDITIONAL PASS**, requiring a mandatory Anchor-Operator-side baseline
group policy (G4's Option C1) layered underneath the optional per-seat traveler product, on the
reasoning that per-seat-optional insurance alone could not guarantee coverage for every traveler and
therefore could not, by itself, close the §3 silent-ambiguity must-have. Full reasoning, the C1 vs.
self-attestation vs. C2 comparison, and the original waiver-language spec are preserved in version
history; they are superseded by the TKT-016 ruling above and should not be treated as current
guidance. The founder rejected the operator-side mandate on principle (see TKT-016 ruling above),
not on the cost grounds TKT-015's own risk analysis anticipated as the likely objection.

</details>

---

## 4. Trippy Tours — substance policy, legal framing, Kasol/Parvati flag

| Risk | Segment/Area | Severity | Likelihood | Mitigation | MVP must-have vs. later |
|---|---|---|---|---|---|
| Any product surface, marketing copy, captain behavior, or matching logic reads as facilitating/condoning illegal substance use | Trippy Tours (all corridors) | **Critical** | Med (real risk given the segment's core positioning tension, already flagged by A3/G3) | G3's redline (never reads as drug-marketplace) + P2's trust-strip requirement give the structural guardrails; A4 requirement on top: **every piece of Trippy content and every Trippy-adjacent product surface gets an explicit A4 sign-off pass before shipping** — not a one-time review, a standing gate per G3's own note in the brand-voice doc. | **MVP must-have — content/feature review gate before any Trippy surface ships, for the life of the segment, not just at launch.** |
| Kasol/Tosh/Malana (Parvati Valley) specifically has an active, well-known cannabis-culture association (NDPS Act enforcement zone, not a gray area) — running Trippy Tours here specifically amplifies both legal exposure (abetment optics) and brand risk beyond generic Trippy risk | Trippy Tours × Himachal corridor, Parvati Valley sub-zone specifically | **Critical** | Med — only materializes if/when Trippy expands into this specific sub-corridor, which A1's roadmap contemplates as segment #2 in the same corridor | Do **not** greenlight Trippy Tours content, marketing, or Anchor Operator partnerships in the Kasol/Tosh/Malana sub-zone without a dedicated legal review (NDPS exposure, abetment liability) — this is narrower than "don't do Trippy in Himachal," it's specifically the Parvati Valley micro-corridor. Alternative: launch Trippy (if/when scoped) in other parts of the Himachal corridor (Bir, Manali proper) that don't carry the same cultural/legal association, or defer Trippy expansion in this corridor entirely pending review. | **FOUNDER DECISION — this is a go/no-go call on a specific sub-corridor, not something A4 can clear unilaterally.** Does **not** block the first vertical slice if that slice is Thrilling (per A1's primary recommendation) — only blocks *Trippy Tours specifically landing in Parvati Valley* until resolved. |
| App-store policy risk: Google Play / Apple App Store both prohibit facilitating illegal drug access; if Trippy content is ever perceived as drug-marketplace-adjacent by store reviewers, the entire app (all six segments) risks removal, not just the Trippy surface | All segments (blast radius from one segment's failure) | **Critical** | Low-med, but the blast radius makes this worth calling out explicitly — this isn't just a Trippy problem, it's an existential platform-availability problem | Same content-review gate as above; additionally, pre-submission app-store policy review specifically for Trippy Tours copy/imagery before any app-store submission. | **MVP must-have** (review step, cheap; the underlying content discipline is already required above) |
| Traveler substance-related incident on a trip (medical emergency, arrest) with no clear platform response protocol | Trippy Tours (any corridor) | High | Med | Written incident-response protocol: platform does not intervene in law enforcement matters beyond standard duty-of-care (emergency contact, medical response coordination via operator), does not post-bail or provide legal defense, ToS explicitly disclaims facilitation. Captain training includes de-escalation, not enabling. | **MVP must-have** (protocol + ToS clause; cheap, high downside if absent) |

---

## 5. Couple Getaways — privacy

| Risk | Segment/Area | Severity | Likelihood | Mitigation | MVP must-have vs. later |
|---|---|---|---|---|---|
| Any feature (even accidental) surfaces one couple's profile/activity to another user — violates the "not a dating app" guardrail structurally, not just in copy | Couple Getaways | **Critical** | Low-med if `privacy_mode` isn't enforced as a true hard gate at the data/access-control layer (not just a UI toggle) | `privacy_mode: full_privacy` must be enforced server-side as a hard access-control constraint — no API path should be able to return one couple's data to another couple's session, regardless of UI state. This is a T1/T4 engineering requirement A4 is flagging, not something A4 builds. | **MVP must-have** |
| Relationship-status / trip-purpose / accommodation-preference data is sensitive personal data under India's DPDP Act 2023 and is collected without adequate consent/purpose limitation | Couple Getaways | High | Med (easy to under-scope if treated as "just a form field") | Explicit consent capture at collection, purpose-limitation (used only for itinerary personalization and operator routing, never for external sharing/marketing without separate opt-in), data minimization (don't collect more than the segment card's optional fields), retention limits. | **MVP must-have** — DPDP compliance for sensitive fields isn't a "later" item; the collection itself is what creates the obligation. |
| "Verified inclusive" operator claim is inaccurate — an LGBTQ+ couple is routed to an operator/corridor that is actually unsafe or discriminatory, based on a badge that wasn't really vetted | Couple Getaways — `inclusive_verified_required` | **Critical** | High if the tag ships before a real accreditation process exists (see §6 ruling) | See §6 explicit ruling — schema can be built, but the badge must default to unverified/hidden until G2 runs a real accreditation process. | **MVP must-have is the *default-safe* behavior (badge withheld until verified); the accreditation process itself can be phased, but must precede the badge ever showing "verified" for any operator.** |
| Physical/accommodation discretion failure — couple defaults to shared visibility instead of private room, or booking details visible to operator staff beyond what's needed | Couple Getaways | Med | Med | `accommodation_pref: private_room_only` as default, not opt-in; operator-facing booking data scoped to only what's needed for fulfillment (dates, headcount, dietary/accessibility needs) — not full relationship-purpose fields. | **MVP must-have** |

---

## 6. CodeHouses — co-living risk

| Risk | Segment/Area | Severity | Likelihood | Mitigation | MVP must-have vs. later |
|---|---|---|---|---|---|
| Exact house address exposed pre-booking → stalking/safety risk, especially for solo/female travelers | CodeHouses | High | Med-High if not deliberately withheld (default behavior for most listing products is to show the address) | Show neighborhood/area only pre-booking; reveal exact address only after booking is confirmed and payment captured. | **MVP must-have** — cheap to build, high safety value. |
| Guest identity unknown to other guests until check-in — "who am I living with for 1–2 weeks" trust gap A3 flagged as this segment's top fear | CodeHouses — `identity_verification_level` | High | Med | See §6 ruling below — "basic" tier (government ID verification) as a hard gate before booking confirmation / address reveal. | **MVP must-have at "basic" tier.** "professional_verified" tier: later. |
| Theft, property damage, or interpersonal conflict/harassment between co-living guests, with unclear platform liability | CodeHouses | High | Med | ToS liability clause limiting platform liability for inter-guest disputes while requiring Anchor Operators to carry premises liability insurance, provide functioning locks/safes, and have a documented incident-escalation process. | **MVP must-have** (ToS clause + operator insurance requirement); dedicated dispute-resolution tooling: later. |
| Sensitive business/IP discussion in shared space leaks (informal "NDA culture" per A3 isn't legal protection) | CodeHouses | Low-Med | Low | Written community guidelines reinforcing confidentiality norm; not a legal NDA. Flag to founders that this is accepted residual risk, not something a consumer product can fully close. | **Accepted/monitored risk — not a blocker.** |
| Harassment or unsafe roommate composition disproportionately affecting solo women | CodeHouses | High | Med | Tie to Captain vetting (§1) + identity verification (this section) + a clear in-product reporting/escalation path to the house Captain and to platform support. | **MVP must-have** (reporting path); deeper composition controls (e.g. gender-aware room defaults): later, flag to G2/P1. |

---

## 7. Music + Art Festivals — crowd safety & ticket/pass fraud

| Risk | Segment/Area | Severity | Likelihood | Mitigation | MVP must-have vs. later |
|---|---|---|---|---|---|
| Affiliate-sourced festival pass doesn't materialize (oversold, fraudulent affiliate) — traveler shows up with no valid pass | Festivals | **Critical** (fraud + duty-of-care failure at the worst possible moment — traveler already on-site) | Med-High — this segment "has a known history of festival ticket fraud" per A3's own card | Never use "guaranteed" pass language unless affiliate inventory is contractually confirmed (G3 already redlines the copy side); on the payment side, don't release affiliate-pass funds until inventory/confirmation is received from the affiliate partner — hold, don't forward-pay blind. | **MVP must-have** — copy discipline is near-zero cost; payment-hold mechanic is a real T2 build but should gate this SKU. |
| Overcrowding / stampede-type crowd-safety failure at a festival TruTravel bundled travel around | Festivals | **Critical** | Low-med (rare but catastrophic; India has real precedent for mass-gathering crowd incidents) | Only bundle travel/stay around events with verifiable local permits/licensed organizers — don't wrap unlicensed or informal gatherings; capture emergency contact (already cross-cutting §1) plus basic on-ground safety info (nearest hospital, local emergency numbers) per event in the trip detail. | **MVP must-have** (permit-verification as a listing gate; on-ground safety info as a content requirement). |
| Crew gets separated at a crowded venue with no plan | Festivals | Med | High (very common, low severity per-incident but high frequency) | Buddy-system / meet-point norm reinforced in pre-trip content (G1/G3); a dedicated in-app "find my crew" feature is a nice-to-have, not required at MVP. | **Later** — norm/content-level mitigation is MVP; product feature can wait. |
| Substance-adjacent perception risk in EDM/festival contexts (flagged by A3 as needing the same discipline as Trippy without being a named guardrail segment) | Festivals | Med-High | Med | Apply the same content-review discipline as Trippy (§4) to festival marketing/captain guidance in EDM-heavy contexts specifically — don't treat this as solved just because Festivals isn't one of the two officially-named guardrail segments. | **MVP must-have** (extend the existing review gate; no new mechanism needed). |

---

## 8. Payment escrow / hold mechanics in India (hand-off to T2)

*A4's role here is to flag the regulatory constraint and safety-relevant mechanics; T2 (TKT-005
counterpart) owns the actual ledger/escrow design.*

| Risk | Segment/Area | Severity | Likelihood | Mitigation | MVP must-have vs. later |
|---|---|---|---|---|---|
| TruTravel holds customer funds directly (bespoke wallet/bank account) instead of routing through an RBI-authorized Payment Aggregator — violates RBI PA/PG guidelines on fund co-mingling and escrow/nodal-account structure | All segments (platform-wide) | **Critical** (regulatory — real risk of penalty or forced shutdown of payment flow, not just a fraud risk) | Route all traveler payments through a licensed PA (e.g. Razorpay/Cashfree-class provider) using its marketplace/escrow or route-split product rather than building an in-house fund-holding mechanism. UPI must be a first-class rail given India payment-rail dominance. | **MVP must-have — this is a build-vs-buy call T2 should not relitigate; do not build a bespoke escrow.** |
| Operator payout enabled before merchant KYC (PAN, GST, bank details) is verified | All segments | Critical | High if not explicitly gated | Same control as §2's last row — merchant KYC hard-gates first payout. Not duplicated here, just re-flagged as the payments-side view of the same control. | **MVP must-have** |
| No clear fund-release trigger — money paid to operator before trip risk (departure, cancellation, no-show) is resolved, or held so long travelers can't get timely refunds | All segments | High | Med | Define a hold-until-trigger (e.g., release at T-minus-X days pre-departure or post-completion) as part of the payment state machine (Authorized/Captured/Refunded per P2's existing state model) — exact timing is A2/T2's refund-matrix call (TKT-005), A4 is flagging that *some* explicit trigger must exist, not endorsing a specific timing. | **MVP must-have** (that a trigger exists); exact timing parameters: A2/T2 to finalize. |
| High-value/frequent transactions attract PMLA (Prevention of Money Laundering Act) scrutiny without adequate transaction monitoring | All segments | Med | Low at MVP transaction volumes, rises with scale | Rely on the licensed PA's built-in KYC/AML tooling rather than building custom monitoring at MVP; revisit if/when TruTravel's own volume or structure changes (e.g., considering becoming its own PA). | **Later — accepted at MVP scale, monitor as volume grows.** |

---

## 9. Explicit ruling on A3's flagged sensitive matching tags

A3's segment cards (`docs/strategy/segment-cards.md`) named three tags requiring A4 policy sign-off
before P3/T1 build them into live schema. Rulings below.

### 9.1 `substance_stance` (Trippy Tours — soft, sensitive)

**Ruling: hold — not cleared for build as-is. Requires an explicit founder/legal decision before
P3/T1 implement it, even internally.**

Reasoning: this field sits directly on top of the highest-severity risk in this whole register
(§4 — NDPS Act exposure, "not a drug marketplace" guardrail). Even framed as an internal-only,
never-public-facing compatibility signal (as A3 already scoped it), storing and using a structured
`substance_stance` field creates a discoverable data trail that a journalist, litigant, or regulator
could point to as evidence the platform sorts, scores, or facilitates substance-related grouping —
regardless of how defensively it's framed internally. That's a fundamentally different risk profile
from the other two tags below, which is why I'm not just adding constraints and clearing it.

Two real options for the founder, not a recommendation from me:
1. **Build it, narrowly constrained:** internal-only, never surfaced to any user/captain/operator,
   access-restricted to the matching algorithm alone, framed purely as a "pressure-mismatch
   avoidance" signal (prevents grouping someone who wants zero exposure with a group skewed
   toward `actively_social`), with legal counsel sign-off on the data-retention/discoverability
   question before it goes live.
2. **Don't build it as a stored field at all.** Handle pressure-mismatch avoidance entirely through
   product/culture controls that already exist in A3's card — code-of-conduct, captain training on
   zero-pressure norms, consent-first group culture — with no structured data footprint. Removes
   the attack surface entirely at the cost of a less precise matching signal.

**MVP status: neither option is cleared for P3/T1 to build yet — this is a founder decision
point, flagged here, not resolved here.**

### 9.2 `identity_verification_level` (CodeHouses — hard, trust gate)

**Ruling: cleared for build now.** This is a standard KYC/trust control with no sensitive-category
legal exposure comparable to §9.1 — it's the same class of control already required for Anchor
Operators and Captains (§1, §2). Build the "basic" tier (government ID capture + verification) as
a hard gate before CodeHouse booking confirmation and exact-address reveal (§6). The
"professional_verified" tier (employer/founder-status verification) is a legitimate later
enhancement, not an MVP requirement. Standard PII handling applies: DPDP-compliant consent,
encrypted storage, retention limits, no sharing of underlying ID documents with other guests —
only a verified/unverified badge should ever be visible to other travelers.

**MVP status: build "basic" tier now; "professional_verified" tier later.**

### 9.3 `inclusive_verified_required` (Couple Getaways — hard, routes to A4-vetted operators)

**Ruling: schema is cleared for build now; the badge itself is not cleared to ever show "verified"
until a real accreditation process exists.** The failure mode to design against is a false-positive
badge — a couple relying on "verified inclusive" and encountering discrimination or an unsafe
situation on the ground is a severe trust and safety failure, arguably worse than not having the
feature at all. P3/T1 can build the tag and the routing logic now, but:

- Every operator must default to `inclusive_verified: false` / hidden until explicitly certified.
- Certification requires an actual G2-run accreditation process (signed non-discrimination policy,
  any available track-record check, staff awareness) — this process itself is **not yet defined**
  and is a real gap this register is surfacing, not resolving. G2 should treat "define the
  inclusive-operator accreditation process" as a dependency of this tag going live with any
  `true` values, not an afterthought.
- Until that process exists, the tag can safely exist in schema with zero operators marked
  verified — that's a safe, honest MVP state (routing simply won't have inclusive-verified options
  yet, which is preferable to a fake signal).

**MVP status: schema cleared now; accreditation process (G2) required before any operator is
actually marked verified; badge defaults to unverified/absent until then.**

---

## 10. Go-live blocking vs. accepted/monitored — summary

**Blocks go-live entirely (first vertical slice cannot ship without these, regardless of which
corridor/segment the founder picks):**
- Anchor Operator baseline verification + visible verification state (§1, §2)
- Traveler emergency contact/medical disclosure capture (§1)
- Platform-wide 18+ age gate (§1)
- Legal counsel-drafted India-specific ToS + activity waivers (§1) — **no current owner on the
  roster; founder needs to assign this.** **Per TKT-016 (§3.1): if Thrilling × Himachal is the
  launch pick, this gap is no longer a background item — the high-altitude insurance
  disclosure/waiver is now the sole mechanism closing that segment's proof-of-coverage requirement
  (no operator-side backstop), which makes assigning a drafter more urgent, not less.**
- Payments routed through a licensed Payment Aggregator with proper escrow/nodal structure, not a
  bespoke fund-holding mechanism (§8)
- Merchant KYC (Anchor Operator) as a hard gate before first payout (§2, §8)

**Blocks go-live for the specific segment/corridor slice chosen (conditional):**
- If **Thrilling × Himachal** is the launch pick: high-altitude trek evacuation plan, guide
  certification, and health disclosure/waiver for any SKU above the altitude threshold (§3) — this
  is a real, non-trivial build-out, not a checkbox. **Per the TKT-016 ruling (§3.1, supersedes
  TKT-015): there is no operator-side or platform-side insurance mandate — the founder's per-seat-
  optional insurance pricing model stands exactly as originally decided. The proof-of-coverage
  requirement is satisfied via a mandatory disclosure/waiver at the point of decision, with content
  requirements fully specified in §3.1. That content spec is ready for a legal drafter, but the
  actual drafting has not happened, and no agent on the roster currently owns it — so this specific
  SKU category cannot safely go live until that drafting is complete and legally reviewed,
  independent of how settled the pricing/policy decision itself is.**
- If **Trippy Tours** is in the first slice or an early follow-on in the same corridor: content
  review gate (§4) must exist before any Trippy surface ships; **Parvati Valley specifically is a
  founder go/no-go decision**, not cleared by default (§4).
- If **Couple Getaways** is in the first slice: server-side `privacy_mode` hard enforcement (§5)
  and DPDP-compliant consent capture for sensitive fields (§5).
- If **CodeHouses** is in the first slice: address-reveal-on-confirmation and "basic" identity
  verification (§6).
- If **Music + Art Festivals** is in the first slice: no-guaranteed-pass copy discipline + payment
  hold until affiliate inventory confirmed, permit-verification as a listing gate (§7).

**Accepted / monitored risk (launch with these open, revisit as volume/evidence grows):**
- Full Anchor Operator spot-audit program beyond initial onboarding checklist (§1) — phase in via G2.
- CodeHouse informal "NDA culture" for confidentiality (§6) — accepted residual risk, not fully
  closeable by a consumer product.
- In-app "find my crew" festival feature (§7) — norm-level mitigation is sufficient at MVP.
- PMLA/AML transaction monitoring beyond the licensed PA's built-in tooling (§8) — revisit at scale.
- `identity_verification_level` "professional_verified" tier (§9.2) — basic tier is sufficient at MVP.
- **Per-seat optional insurance upgrade going unpurchased by a given traveler (§3.1, TKT-016)** —
  this is now the *designed* accepted-risk outcome, not a gap to be closed by a coverage floor. It
  becomes a legitimate monitored/accepted risk **only once** the mandatory disclosure/waiver
  (content spec in §3.1) exists as real, legally reviewed text and is actually presented at the
  point of decision in the booking flow. Until that drafting happens, a traveler declining the
  add-on with no equivalent disclosure is a **silent gap, not an accepted one**, and this item
  belongs in the blocking list above, not here.

**Founder decisions needed (not resolvable by A4 alone):**
1. `substance_stance` tag — build narrowly-constrained-and-legally-reviewed, or don't build as a
   stored field at all (§9.1).
2. Trippy Tours in Parvati Valley (Kasol/Tosh/Malana) specifically — legal review before any
   greenlight, independent of whether Trippy launches elsewhere in the Himachal corridor (§4).
3. Own the ToS/waiver legal-drafting workstream — currently no agent on the roster is assigned
   this. **Per TKT-016, this is now the single open dependency blocking the high-altitude
   insurance accepted-risk path specifically (§3.1) — closing this unblocks Thrilling × Himachal's
   insurance requirement outright, with no other design work pending on A4's side.**
4. Source a high-altitude/adventure-sports insurance partner (G4) if Thrilling × Himachal is the
   launch pick — needed so travelers who opt in actually have a real product to buy; independent of
   the waiver/drafting dependency above.
5. **Resolved (TKT-016): traveler opt-in insurance, exactly as originally priced, stands as the
   final MVP mechanism. No operator-side or platform-side insurance mandate. This was a principled
   rejection of TKT-015's proposed operator-side requirement, not a cost-driven one, and should not
   be revisited on cost grounds absent a real change in circumstance.** No further founder sign-off
   needed on the mechanism itself — the only remaining action item is #3 above (assign a legal
   drafter for the waiver content).

---

## 11. Handoff

- **To P1 (TKT-007):** §10's "blocks go-live entirely" and "conditional on segment/corridor" lists
  are written to be scope-cut inputs directly — treat them as PRD constraints, not suggestions.
  **Per TKT-016: the §3 high-altitude block no longer carries a new operator-onboarding
  requirement (TKT-015's operator-side baseline is rescinded). It does carry one hard dependency —
  legal drafting of the insurance disclosure/waiver (§3.1) — that has no owner yet. Worth an
  explicit PRD line flagging that this SKU category cannot ship without it, regardless of how far
  along the rest of the Thrilling build is.**
- **To T4 (DevOps & Security):** §1 (merchant KYC gate, ToS dependency), §5 (server-side
  `privacy_mode` enforcement — this is an access-control requirement, not a UI toggle), §8
  (route through a licensed PA, don't build bespoke escrow) are your primary action items.
- **To G2 (Supply Ops):** §2's Anchor Operator onboarding checklist is yours to operationalize
  against Indiahikes/Bikat Adventures (A1's named candidates) before outreach converts to signed
  operators. §9.3's inclusive-operator accreditation process is a new, currently-undefined
  workstream this register is assigning to you — it has no other owner. **Per TKT-016: the
  TKT-015 ask to fold an operator-side group/blanket insurance policy into that onboarding
  checklist is rescinded — do not raise this with operators as a requirement.** Nothing new is
  added to the onboarding checklist by this ruling.
- **To T2 (Payments & Ledger, TKT-005 counterpart):** §8 is written as constraints on your design,
  not a competing spec — the fund-release trigger timing and refund matrix remain yours to finalize.
  **Per TKT-016: no new traveler-facing payment/ledger line item is required by this ruling** (this
  was already true under TKT-015 and remains true — the only checkout item is the existing optional
  per-seat add-on, unchanged). **New, load-bearing action item: the mandatory disclosure/waiver
  (§3.1) needs an actual UI moment at the point of decision in the insurance add-on step** — not a
  passive clause, an affirmative acknowledgment distinct from general booking confirmation. Flagging
  this jointly to you and P2 since it sits at the payments/UI boundary — whoever implements the
  insurance add-on step owns building this moment; A4 owns the content requirements it must satisfy
  (§3.1), not the legal text itself (still unowned, see below).
- **To P2 (UI/Product):** same flag as above, from the design side — the point-of-decision
  disclosure/waiver (§3.1) is a real screen moment in the booking flow, not a checkbox bolted onto
  an existing form. It needs to be visually distinct enough that a traveler reads it before deciding
  on the insurance add-on, per the plain-language/timing requirements in §3.1 items 3, 5, and 6.
- **To weekly margin & trust review (A2+A4+T2+G2):** §8 (escrow mechanics vs. A2's take-rate/refund
  model) and §2/§9.3 (Anchor Operator and inclusive-operator accreditation costs vs. G2's onboarding
  capacity) are the two items most likely to need cross-agent negotiation, not just sign-off.
  **Per TKT-016: §3.1's former agenda item (operator baseline-policy cost/negotiation) is closed —
  remove it from this review's standing agenda. Nothing to negotiate with G2 on this front going
  forward.**
- **To founder:** thank you for the clarity on TKT-015 — the philosophical boundary (no
  operator-side insurance mandate, regardless of cost) is recorded in §3.1 and will not be
  relitigated on cost grounds. Traveler opt-in insurance, as originally priced, is now final. **One
  open dependency remains before this path is actually safe to ship: the disclosure/waiver content
  requirements are fully specified (§3.1), but nobody on the current roster is assigned to draft the
  actual legally-reviewed text.** This was already an unowned gap (§1, since TKT-006) but it's now
  squarely on the critical path for Thrilling × Himachal specifically, with no other mechanism
  standing behind it. Requesting an owner be assigned for India ToS/waiver legal drafting.
