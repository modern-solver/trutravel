# PRD — Himachal Adventure Belt × Thrilling Tours (First Vertical Slice)

**Author:** P1 (Product Architect) · **Tickets:** TKT-007 · **Milestone:** M1
**Status:** Draft for Engineering feasibility review (T1–T5) and founder sign-off
**Launch target:** September 2026 (founder-set)
**Companion doc:** `docs/prd/himachal-trippy.md` — launching the same month, same corridor.
Read together; they share one domain model (§2) so T1 does not have to reconcile two schemas.

**Inputs (read, not re-derived):**
- `docs/agents/shared-context.md` — segment taxonomy, glossary, working agreements
- `docs/strategy/corridor-shortlist.md` (A1) — corridor ranking, competitor watch, demand hypotheses
- `docs/strategy/segment-cards.md` (A3) — Thrilling Tours card (JTBD, psychographics, matching tags, voice angles)
- `docs/strategy/unit-economics.md` (A2) — Thrilling seat-level waterfall, refund-rate sensitivity, tier model
- `docs/ops/risk-register.md` (A4) — cross-cutting risks, §3 high-altitude trek block, §10 go-live blocking list
- `docs/design/brand-voice-principles.md` (G3) — Thrilling voice card, redlines
- `docs/design/ui-principles.md` (P2) — trust-surface, state-model, segment-token principles

---

## 1. Problem statement

Solo and small-group adventure travelers in India currently self-assemble trekking/adventure
groups through ad hoc WhatsApp/Instagram coordination with strangers whose actual fitness,
skill level, and gear readiness are unverified until the trailhead — creating real safety risk
(pace mismatch, undertrained hikers on technical terrain) and a poor experience (dragging or
being dragged) even when the trip itself is well-run operationally (A1 §3, demand hypothesis 1).
Existing supply-side operators (Indiahikes, Bikat Adventures) are credible on safety/logistics
but do not solve the *group composition* problem — they fill seats first-come, not by
compatibility. TruTravel's wedge: **skill/pace/fitness-based matching on top of a verified,
credentialed Anchor Operator layer**, so travelers get a group that can actually keep pace and
a trip they can trust wasn't sold as "extreme" and delivered as tame (A3, Thrilling fears/objections).

JTBD (lifted from A3): *When I want to attempt something physically demanding I can't or don't
want to do alone, help me find a competent, similarly-capable group and a vetted operator so
risk is managed, not avoided.*

## 2. Target corridor × segment

**Corridor:** Himachal Adventure Belt, scoped narrowly per A1's handoff note to **Manali and Bir**
sub-corridors for the September 2026 launch (not the full Manali–Kasol–Tosh–Bir–Spiti span).

**Why Manali + Bir, not the whole corridor:**
- Both have existing certified-guide/operator density (Indiahikes, Bikat Adventures-class supply
  per A1) — lowers cold-start risk.
- Both offer activity variety without requiring the highest-altitude, highest-liability terrain
  on day one (see §7 — altitude scope cut).
- Kasol/Tosh are excluded from *this* PRD's scope not for Thrilling-specific legal reasons (A4's
  Parvati flag is a Trippy-specific NDPS concern — see the companion Trippy PRD) but to keep the
  vertical slice geographically tight per the shared working agreement. If Engineering finds
  meaningful Thrilling-only operator supply in Kasol/Tosh that's cheap to onboard alongside
  Manali/Bir, flag it back to P1 — it's not excluded for a hard reason here, just not in scope
  by default.
- Spiti is out of scope entirely for September: higher altitude, thinner operator density, later
  season window — natural fast-follow, not MVP.

**Segment:** Thrilling Tours only, in this PRD. (Trippy Tours launches in the same corridor,
same month — see companion PRD — but is a separate product surface, separate Trip catalog, and
must never be presented as a variant/filter of Thrilling or vice versa, per shared-context §2
"segments are not filters.")

## 3. Domain model (shared with the Trippy PRD — T1 should implement once)

Both Himachal PRDs use this vocabulary. Do not invent parallel terms per segment.

| Entity | Definition | Key states / attributes |
|---|---|---|
| **Corridor** | Geographic product cluster. `Himachal Adventure Belt`, with a `sub_location` attribute (`manali`, `bir`, `kasol_parvati` [locked, see Trippy PRD], `spiti` [future]). | — |
| **Trip** | A bookable SKU template: one activity concept at one sub_location, owned/delivered by one Anchor Operator. Not date-specific. | `segment`, `sub_location`, `activity_type`, `skill_level`, `fitness_level`, `duration_days`, `max_altitude_m`, `anchor_operator_id`, `guide_certification_ref` |
| **Departure** | A specific scheduled instance of a Trip (dates, seats, assigned Captain). | State: `Open / Filling / Waitlist / Locked / Cancelled` (per P2 §1.3) |
| **Seat** | One traveler's booking on a Departure. | State: `Pending / Confirmed / Refund pending / Refunded / Cancelled` (per P2 §1.3) |
| **Captain** | TruTravel-recruited community host assigned to a Departure. For Thrilling, distinct from the Anchor Operator's certified technical guide (see §6) — Captain owns group culture/coordination, guide owns on-route technical safety. | Identity-verified (basic tier, A4 §1) before hosting any live Departure |
| **Anchor Operator** | Licensed T1/T2/T3-tier local partner (A2 §2) delivering the Trip. Must pass A4 §1–§2 onboarding checklist before any Trip goes live. | Verification state: `Unverified / Under review / Verified / Suspended` (P2 §1.3) |

**Segment-specific extension for Thrilling:** every Trip carries an `altitude_tier` derived
from `max_altitude_m` (`standard` <3,000m / `high_altitude` ≥3,000m) — this single field is what
gates the A4 §3 safety package (§7 below) on or off for that Trip. This is the load-bearing
field for the scope cut in §7; T1/T3 should treat it as first-class, not a display label.

## 4. Reference summary (not re-derived — see source docs for detail)

- **A1:** Himachal is A1's #1-ranked corridor for Thrilling (high confidence), with Indiahikes/
  Bikat Adventures named as plausible Anchor Operator candidates. WanderOn's fresh Series A into
  "adventure travel, sports-led trips" is the most direct competitive collision in the shortlist
  — timing urgency is real, feeds the September target, not a reason to cut safety scope.
- **A3:** Full Thrilling segment card (JTBD, psychographics, fears, group norms, matching tags,
  voice) at `docs/strategy/segment-cards.md` §2 — this PRD does not restate it, only the
  operational implications.
- **A2:** Thrilling baseline unit economics: 19.8% net contribution at an assumed 8% refund rate,
  within the 18–25% guardrail but with thin cushion — breaches the floor above ~12.5% refund
  rate (plausible given Apr–Jun/Sep–Nov weather-driven trek-season cancellations). A2 recommends
  a non-refundable operator deposit of 30–40% of trip cost as the primary lever; exact % and
  cancellation-window timing are A2/T2's to finalize (see §8 — this PRD specifies the *shape* of
  the policy the booking flow must support, not final numbers).
- **A4:** Full cross-cutting risk register at `docs/ops/risk-register.md`. This PRD treats §1
  (cross-cutting, all MVP must-haves), §2 (KYC/operator verification), and §3 (high-altitude
  trek liability) as binding constraints, not suggestions, per A4's own handoff note to P1.

## 5. User stories

**Traveler (booking a Thrilling trip)**
- As a solo trekker, I want to see a Trip's skill/fitness requirements and my own self-assessed
  level side by side before I book, so I don't end up in a group I can't keep pace with (or that
  can't keep pace with me).
- As a traveler, I want to see the assigned guide's certification and the Anchor Operator's
  verification state on the same screen as the price and dates, so I can trust the trip before
  committing money (A4 §2, P2 §5).
- As a traveler, I want to see a clear cancellation/refund policy (deposit terms, refund windows)
  before I pay, not buried in a ToS I have to go find (G3 §2.1 rule 7, P2 §5).
- As a traveler booking a `high_altitude` Trip, I want to be told upfront what insurance coverage
  is required/bundled and what the emergency evacuation plan is, so I'm not discovering a coverage
  gap after I've already committed (A4 §3).
- As a traveler, I want to declare emergency contact and relevant medical info once at booking,
  not per-trip, so the friction of re-entering it doesn't make me skip it.
- As an 18-year-old-or-older traveler, I want the platform to have already gated out anyone under
  18 at signup, not per-booking, so I'm not repeatedly asked to prove my age.

**Captain**
- As a Captain, I want to see my assigned Departure's roster (skill levels, gear ownership) before
  the trip starts, so I can set expectations and coordinate pre-trip logistics (gear rental, meet
  point) with the group.
- As a Captain, I want a clear boundary between my role (group culture, coordination) and the
  Anchor Operator's guide's role (technical/safety leadership on-route), so travelers aren't
  confused about who to trust for what.

**Anchor Operator**
- As an Anchor Operator, I want to list a Trip only after my business registration, insurance,
  and guide certification are verified, so the platform's trust badge actually means something
  when a traveler sees it next to my listing (A4 §1–§2).
- As an Anchor Operator, I want to see my own verification/standing status with the same
  prominence a traveler sees it (P2 §5), so I know exactly what's blocking me from going live.
- As an Anchor Operator running a `high_altitude` Trip, I want a clear, structured place to file
  my evacuation plan (nearest hospital, helicopter-evac contact, comms plan for no-signal zones)
  before that Trip can be published, so I'm not guessing what "compliant" means.

**Ops / Platform**
- As Ops (G2), I want every Anchor Operator's verification checklist (registration, insurance,
  guide cert, permit proof where applicable) tracked in one place with a clear pass/fail state,
  so onboarding Indiahikes/Bikat-class operators is a checklist, not a judgment call.
- As Ops (T2/A2), I want the incentive-cap guardrail (`bounty% + CAC% + refund-drag% ≤
  platform_gross_take% − 18`, A2 §2) enforced at payout-confirmation time, so a bad refund month
  can't silently breach the 18% floor.

## 6. Captain vs. Guide — explicit role split

Per A3's group-norms note ("Captains here often double as informal safety leads") and A4's guide
certification gate, this PRD makes an explicit product decision: **for Thrilling MVP, the
TruTravel Captain and the Anchor Operator's technical guide are distinct roles, potentially the
same person but not required to be.**

- **Captain** (TruTravel layer): community host, identity-verified (basic tier), sets pre-trip
  tone, coordinates the group chat, present in the trust-strip as "your Captain."
- **Guide** (Anchor Operator layer): certified technical lead, credential displayed on the Trip
  listing per A4 §2, responsible for on-route safety calls (pace, weather aborts, evacuation
  triggers).

This avoids conflating TruTravel's identity-verification system with the Operator's professional
credentialing system, and keeps liability lines clean for legal review. **Flag for A4/legal:**
confirm this split doesn't create an ambiguous liability gap (e.g., who's accountable if a
Captain who is *not* the guide makes an unsafe call) — needs a ToS clause, not a product decision
alone.

## 7. High-altitude safety package — scope cut (the single biggest MVP risk)

A4 §3 makes the high-altitude trek safety package (evacuation plan, insurance proof, health
disclosure/waiver, guide certification) an **MVP must-have for any route above ~3,000m** — and
flags that the insurance-partner side of this (G4 sourcing an adventure-sports-rated policy) is
not yet in place. This PRD makes an explicit scope cut rather than silently deferring it:

**IN for September launch:** Trips with `altitude_tier: standard` (max altitude <3,000m) —
e.g. moderate day/multi-day treks around Bir and lower Manali-adjacent routes, and non-altitude
adventure activities (e.g. Bir paragliding, river-based activities where applicable). These still
require the full cross-cutting safety package (§1 of A4: emergency contact, medical disclosure,
18+ gate, waiver, guide certification, Anchor Operator verification) — the *only* thing being cut
is the incremental high-altitude package (evac-plan filing, altitude-specific insurance-proof
gate), because that package's own dependency (a sourced insurance partner, A4 §3/§10 founder
decision 4) is not confirmed ready.

**OUT for September, fast-follow once G4 sources an insurance partner:** Any Trip with
`altitude_tier: high_altitude` (≥3,000m) — this excludes some of Manali's more iconic high
passes (if their max altitude clears the threshold) from the September catalog. This is a real
demand tradeoff, not a free cut — flag to A1/G2 that the September Thrilling catalog may skew
toward lower-drama routes than the corridor's most differentiated content.

**Why this cut, not the alternative (build the full high-altitude package anyway):** the
insurance-proof requirement in A4 §3 is explicitly gated on a G4 dependency ("FOUNDER/G4: need an
actual insurance partner sourced before this can be enforced as 'bundle'") with no committed
timeline as of this PRD. Shipping `high_altitude` Trips without it would mean either (a) silently
weakening a stated MVP-must-have, which this PRD's instructions explicitly forbid, or (b)
blocking the whole Thrilling launch on an external partnership with unknown lead time. Scoping
the September catalog to `standard` altitude only avoids both bad options and is honest about
what's shipping.

**Open feasibility question for T1/A4/G4:** what's the realistic lead time to source and
integrate an adventure-sports-rated insurance partner? If it's inside the September window, this
cut may be unnecessary — P1 should be looped back in before the catalog is finalized.

## 8. Refund / cancellation policy — shape, not final numbers

A2 flagged Thrilling's 8% baseline refund-rate assumption leaves thin cushion (breaches the 18%
contribution floor above ~12.5%) and recommended a non-refundable deposit of 30–40% of trip cost.
This PRD specifies the booking-flow and policy-UX shape the deposit structure must support;
**A2/T2 own the final deposit %, cancellation-window day-thresholds, and refund-percentage
tiers** — nothing below is a locked number.

Required shape:
1. **Split payment capture at booking:** a non-refundable deposit portion + a refundable balance
   portion, captured together but tracked as two distinct ledger lines (feeds T2's payout logic,
   consistent with A4 §8's fund-release-trigger requirement).
2. **Tiered cancellation windows** (traveler-initiated): refund of the balance decreasing as
   departure approaches, deposit never refunded on traveler-initiated cancellation. Exact
   day-thresholds and percentages: A2/T2 to set.
3. **Operator/platform-initiated cancellation** (weather abort, permit issue, insufficient
   minimum group size): full refund including deposit, or a credit/reschedule option — this is
   not the traveler's cancellation and should never be penalized like one. This distinction must
   be structurally visible in the Seat/Booking state model (a `Refunded` state reached via
   operator-cancellation should be distinguishable in reporting from one reached via
   traveler-cancellation, even if the user-facing label is similar) — flag to T2/T3.
4. **Policy summary visible pre-payment**, not just in ToS — per P2 §5 "guaranteed, non-collapsed
   summary slot" and G3 §2.1 rule 7. The traveler must see deposit %, refund tiers, and the
   weather-abort exception before entering payment, not discover it after.
5. **Incentive-cap guardrail enforcement** (A2 §2 formula) at payout-confirmation time is a T2
   build item this PRD assumes exists; not re-specified here.

## 9. Matching tags (input vocabulary for P3 — P1 does not design the scoring rubric)

Per A3's Thrilling card, lifted verbatim as input vocabulary for P3's TKT-008:
`segment: thrilling_tours` (hard) · `activity_type` (hard/soft by SKU) · `skill_level` (hard) ·
`fitness_level` (hard for physically demanding SKUs) · `risk_appetite` (soft) ·
`certification_held` (soft) · `gear_ownership` (soft) · `prior_thrilling_trips` (soft).

No Thrilling-specific tag is affected by the `substance_stance` exclusion (that's a Trippy-only
concern) — flagging here only so P3 doesn't need to cross-reference the Trippy PRD to confirm
Thrilling's tag set is unaffected. `age_band`/18+ is a **hard platform-wide gate at signup**, not
a segment-level matching tag (A4 §1) — P3 should not re-derive it as a soft compatibility field.

## 10. Scope — IN vs OUT (September 2026 MVP)

**IN**
- Manali + Bir sub-corridors, `standard` altitude tier only (§7)
- Trip catalog: 2–4 Trip templates at launch (recommend: 1 moderate multi-day trek per
  sub-location + Bir paragliding as a low-liability, high-appeal anchor activity) — exact count
  is a G2/A1 supply-sourcing call, not fixed here; this PRD sets the ceiling low deliberately
- Anchor Operator onboarding against A4 §1–§2 checklist (registration, insurance, guide cert,
  merchant KYC) — hard gate before any Trip goes live
- Captain role: basic identity verification, assigned per Departure, distinct from Guide (§6)
- Booking flow: skill/fitness self-declaration at signup or first Thrilling booking, split
  deposit/balance payment, tiered cancellation policy per §8 shape, emergency contact + medical
  disclosure + waiver + 18+ gate (all A4 §1 must-haves) at checkout
- Trust surfaces on Trip card and detail view per P2 §5: operator verification state, guide
  certification, policy summary, group composition/fill state
- Departure/Seat state machines exactly as defined in P2 §1.3 (no new states invented here)
- Matching tag vocabulary (§9) available for P3 to build scoring against

**OUT (explicit cuts, not silent omissions)**
- `high_altitude` (≥3,000m) Trips — deferred pending G4 insurance-partner sourcing (§7)
- Spiti and Kasol/Tosh sub-locations — deferred, not this slice's geography (§2)
- Guide "professional_verified" deep-background-check tier — A4 rules basic tier sufficient
  for MVP; deeper tiers later
- In-app crew-separation / "find my crew" style features — not flagged as MVP-relevant for
  Thrilling by A4 (that's a Festival-segment note); no equivalent need identified here
- Gear-rental marketplace/logistics beyond a `gear_ownership` soft tag informing operator
  planning — actual rental fulfillment is an Anchor Operator responsibility, not a TruTravel
  product surface at MVP
- Dynamic/algorithmic pricing — flat price per Departure at launch; pricing-model sophistication
  is out of this PRD's scope entirely
- Multi-operator Trips (one Trip = one Anchor Operator at MVP; co-run Trips are a later
  complexity, not needed for September)
- Waitlist-to-confirmed automated seat promotion logic beyond the state existing — treat as a
  manual/simple-rule op for MVP, not a sophisticated allocation system

## 11. Feasibility / effort flags for Engineering (P1's best call — T1 to confirm)

| Item | P1's rough read | Why flagged |
|---|---|---|
| Departure/Seat state machine + trust-surface rendering (P2 §1.3, §5) | **Standard build, MVP-realistic** | Core marketplace CRUD + state model; no novel mechanics |
| Split deposit/balance payment + tiered refund policy (§8) | **Medium — real T2 build, timeline-sensitive** | Depends on A2/T2 finalizing exact %/windows soon; the split-ledger-line requirement is new, not a trivial toggle |
| Anchor Operator onboarding checklist + verification-state gating (A4 §1–§2) | **Medium, mostly ops process + moderate build** | Checklist logic is straightforward; the risk is G2's operator-onboarding *throughput* against a September deadline, not the engineering itself |
| Emergency contact / medical disclosure / 18+ gate / waiver capture | **Low — cheap, A4 confirms this explicitly** | Flagged by A4 as cheap; agree |
| `altitude_tier` gating logic (§7) | **Low engineering effort, but real content/ops effort** | The field itself is trivial; the actual constraint is sourcing enough `standard`-tier Trip supply to make a credible September catalog |
| Insurance-proof enforcement for `high_altitude` Trips | **Deferred — do not build for September** (§7) | Blocked on G4 partner sourcing with no committed date; building the enforcement mechanism before the partner exists is wasted effort |
| Matching tag capture (skill/fitness/gear self-declaration) | **Low-medium** | Capture is simple; P3's scoring logic against these tags is the real complexity, and is explicitly out of this PRD's scope |
| Incentive-cap guardrail check at payout (A2 §2 formula) | **Medium, T2-owned** | Not novel, but must not be treated as optional given the thin 19.8% cushion |

**Open feasibility questions for T1 to confirm:**
1. Is the split deposit/balance payment model (two ledger lines per booking) compatible with the
   licensed Payment Aggregator route A4 §8 mandates, or does it add integration complexity T2
   should flag now rather than at build time?
2. Can the Captain/Guide role split (§6) be modeled cleanly in whatever auth/identity system T1
   is building, or does it need a data-model adjustment now to avoid rework?
3. Realistic timeline check: does a September 2026 launch genuinely fit Anchor Operator
   onboarding (A4's full checklist) + booking flow + trust surfaces + QA, given operator
   onboarding is as much a G2 process bottleneck as an engineering one?

## 12. Legal / safety risk flagged to A4 (not silently deferred)

- **§6 Captain/Guide liability split** — needs explicit legal review on accountability lines
  before launch, not just a product-level role definition. Flagging to A4/legal counsel workstream
  (still unassigned per A4 §10 founder decision 3).
- **§7 high-altitude deferral** — this PRD is not solving the insurance-partner gap, only scoping
  around it. If the founder wants `high_altitude` Trips in the September catalog anyway, that
  requires either an expedited G4 insurance-partner decision or an explicit founder-accepted risk
  exception documented by A4 — not a default the product silently absorbs.
- **§8 weather-abort vs. traveler-cancellation distinction** — flagging to A4/T2 that this needs
  to be enforceable, not just described, so a pattern of operators mislabeling weather-aborts as
  traveler-cancellations to avoid the non-refundable-deposit optics doesn't emerge as a fraud
  vector.

## 13. Open questions for WM1 / founder

1. Is the Manali + Bir (excluding Spiti, excluding Kasol/Tosh) sub-corridor scope acceptable, or
   does the founder want Kasol/Tosh Thrilling-only supply considered despite the geographic
   tightening in §2?
2. Does the founder want to accept the `high_altitude` deferral (§7) as-is, or push G4 to
   expedite insurance-partner sourcing specifically to unlock higher-altitude routes for the
   September catalog?
3. Who owns the India-specific ToS/waiver legal drafting (A4 §10, still unassigned)? This PRD's
   waiver/consent flow and the Captain/Guide liability split both depend on that workstream
   existing before launch, not just being drafted informally.
4. A2's exact deposit %/refund-window numbers are not yet finalized — should A2/T2 treat this
   PRD's September timeline as forcing function to lock those numbers on an accelerated schedule?
