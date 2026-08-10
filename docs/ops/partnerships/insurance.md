# TruTravel — Insurance Partner Sourcing: Himachal Adventure Belt Launch (TKT-013)

**Author:** G4 (Partnerships) · **Milestone:** M1 pre-launch
**Status:** Draft for founder decision on bundling model; feeds T4 (integration/security), G2 (Anchor
Operator onboarding requirements), A2 (unit-economics — cost-model decision point flagged, not resolved
here)
**Inputs:** `docs/agents/shared-context.md`, `docs/strategy/corridor-shortlist.md` (A1),
`docs/ops/risk-register.md` (A4, §3 + §10 item 4 — "Source a high-altitude/adventure-sports insurance
partner (G4) if Thrilling × Himachal is the launch pick"), `docs/strategy/segment-cards.md` (A3,
Thrilling `activity_type` tag list), live web research (cited inline)

---

## 0. How to read this doc

- A4's risk register already made the safety-requirement call: proof of adventure-sports-rated
  insurance (or a bundled compliant policy) is an **MVP must-have** for any Himachal high-altitude
  Thrilling SKU. I am **not** relitigating that — this doc is about *which partner(s)* can satisfy
  it and *how it plugs into the product*, not *whether* it's required.
- Confidence tags (low/med/high) reflect how much a claim would survive a direct sales call with the
  provider, not how many sources repeated it. Pricing figures especially are **directional, not
  contractual** — none of this is a locked quote.
- Scope per A3's Thrilling `activity_type` tag list and the Himachal corridor's known activity mix:
  **trek/climb** (Manali–Kasol–Tosh–Bir–Spiti core), plus corridor-relevant secondary activities —
  **paragliding** (Bir is one of India's top paragliding sites), **river rafting** (Kullu stretch of
  the Beas), and **winter sports** (seasonal, Manali/Solang). Motorsport and wildlife-expedition tags
  exist in A3's schema but aren't part of this corridor's near-term SKU mix — out of scope for this
  sourcing pass.
- Trippy Tours shares the Himachal corridor and launches alongside Thrilling per the founder's brief.
  Trippy trips in this corridor are lower-altitude/lower-activity-risk (café culture, valley walks,
  music — not summit attempts), so their insurance need is closer to standard trip-cancellation/travel
  medical than adventure-sports-rated cover. Section 4 below addresses whether one partner can serve
  both.

---

## 1. Candidate partners

### 1.1 ASC360 (Adventure Sports Cover 360) — specialist, **primary recommendation**

- **What it is:** India-focused, IRDAI-approved adventure/sports insurance specialist. Policies cover
  550+ sports/adventure activities across air, water, land, and mountaineering categories — treks,
  climbing, paragliding, rafting, and winter sports all fall inside their standard activity list, not
  as a bolt-on exclusion carve-out like most general travel policies. [ASC360](https://asc360.com/)
- **Validation signal specific to this corridor:** ASC360 is **Indiahikes' insurance partner**
  [Indiahikes blog](https://indiahikes.com/blog/trek-insurance-safety) — Indiahikes is one of A1's
  two named candidate Anchor Operators for this exact corridor. This is a strong "already proven in
  the field we're launching in" signal, med-high confidence.
- **Coverage scope:** Cashless medical evacuation reported up to 8,000m altitude; policies configurable
  from single-day to annual; can insure individuals, groups, or events; coverage limits reportedly
  customizable up to ₹25 crore. [ASC360](https://asc360.com/), [Himalayan Hikers trek insurance
  guide](https://himalayanhikers.in/blog/trekking-insurance-in-india)
- **Cost structure (directional, unverified against a quote):** General adventure-travel insurance
  cost references in the ₹85–350 (USD-equivalent) range per trip for comparable products were surfaced
  in research — **treat as a ballpark only, not a quote**; ASC360 does not publish a public per-day
  rate card. **Action: get an actual quote before any commitment.**
- **Integration complexity:** ASC360 explicitly solicits **B2B collaborations with trek leaders,
  guides, and tour operators** [ASC360 partners page](https://asc360.com/partners/) — this is a
  business-development/API-or-portal relationship, not a public self-serve API today (no published
  developer docs found in this research pass). Likely model: either (a) a bulk/group policy purchased
  by the Anchor Operator or TruTravel and issued per departure roster, or (b) a referral/white-label
  purchase flow where the traveler completes a policy purchase on ASC360's system, linked from
  TruTravel's checkout. **Confirm which integration model ASC360 actually supports in the first sales
  call — this materially changes T1/T4's build scope.**
- **Booking-flow plug-in point:** Either (a) roster-based group policy — TruTravel or the Anchor
  Operator submits the traveler list per departure and pays a bulk premium (cleanest UX, least
  per-traveler friction, but requires a payment/reconciliation flow between TruTravel and ASC360), or
  (b) per-traveler referral link at checkout — traveler is redirected/deep-linked to complete an ASC360
  policy purchase as a required step before booking confirmation (lower engineering lift, but adds a
  drop-off point and a "did they actually complete it" verification gap that T1 needs to close, e.g.
  requiring a policy-number field before the booking is marked confirmed).

### 1.2 Symbo Insurance — embedded insurance API aggregator

- **What it is:** Embedded-insurance infrastructure company serving OTAs, travel fintechs, and mobility
  platforms with a unified API sitting on top of multiple underlying insurers; issues policies and
  handles claims through the same API surface. [Symbo](https://www.symbo.co/travel/)
- **Coverage scope:** Standard travel-protection stack — medical, trip cancellation, visa rejection,
  flight delay, baggage loss — explicitly travel/OTA-oriented. **Adventure-sports/high-altitude-trek
  rating is not confirmed as a standard line item** in this research pass; would need to be confirmed
  directly whether their underlying insurer panel includes an adventure-sports-rated product, or
  whether this is better suited to the Trippy-side general travel cover only (see §4).
- **Cost structure:** Not publicly disclosed; API/platform-fee + per-policy premium model typical of
  this category.
- **Integration complexity:** This is the most "built for exactly this problem" option on the list —
  REST APIs, SDKs, webhooks, white-label checkout flows, published sandbox environment. **Reported
  partner go-live timeline: 2–4 weeks** using pre-built insurer integrations and configurable product
  templates for standard programs (custom/complex programs take longer). [Symbo
  sandbox](https://www.symbo.co/sandbox), [Symbo technology](https://www.symbo.co/technology)
- **Booking-flow plug-in point:** True embedded checkout — insurance quote/purchase happens inside
  TruTravel's own booking flow via API call, no redirect. This is the cleanest long-term integration
  pattern for T1/T2's build, **if** the adventure-sports coverage question above resolves favorably.
  **Action: first outreach call should specifically ask whether their insurer panel covers
  high-altitude trek/paragliding/rafting, not just generic trip insurance — this is the single fact
  that determines whether Symbo is a Thrilling-segment fit or a Trippy/general-travel-only fit.**

### 1.3 Riskcovry — embedded insurance-in-a-box (secondary API option)

- **What it is:** Mumbai-based insurance distribution infrastructure platform; single API access to
  150+ insurance products (life, health, motor, credit-linked, sachet insurance) across multiple
  distribution models (cross-sell, embed-with-transaction, white-label). [IBS
  Intelligence](https://ibsintelligence.com/ibsi-news/4-embedded-insurance-platforms-transforming-the-insurtech-landscape-in-india/)
- **Coverage scope:** Broad product catalog, but **travel/adventure-sports depth specifically is
  unconfirmed** in this research pass — appears more health/motor/credit-insurance weighted than
  travel-specialist. Worth a scoping call, but currently a lower-confidence fit than Symbo or ASC360
  for this specific need.
- **Integration complexity:** Single unified API per their pitch, similar "insurance-in-a-box"
  positioning to Symbo. No specific onboarding-timeline figure surfaced.
- **Booking-flow plug-in point:** Same embedded-API pattern as Symbo, pending confirmation of adventure
  product availability.
- **Recommendation:** Keep as a **backup/comparison quote** to Symbo, not a lead candidate, unless
  their travel-product depth turns out to be stronger than this research pass found.

### 1.4 Traditional general insurers with an adventure-sports rider (fallback / benchmark tier)

These are large, well-capitalized IRDAI-licensed general insurers already selling travel insurance in
India, with adventure sports available as a **paid add-on rider** rather than a core specialization.
Useful as a fallback or a second-source comparison, but structurally weaker fit than ASC360 for this
specific need:

| Insurer | Product | Adventure-sports fit | Note |
|---|---|---|---|
| **ICICI Lombard** | TripSecure+ | Adventure Sports Cover is an explicit optional add-on rider; base policy excludes injury from "dangerous or adventure sports" unless the rider is purchased | [ICICI Lombard](https://www.icicilombard.com/travel-insurance), [Media Infoline](https://www.mediainfoline.com/advertising/icici-lombards-new-campaign-unveils-tripsecure-as-the-ultimate-travel-buddy) |
| **Bajaj Allianz** | Group Personal Accident Insurance | Coverage explicitly includes adventure sports, hospitalization, fracture cases, emergency ambulance, travel expenses — this is a **group/bulk policy product**, which maps well to an Anchor-Operator-side or per-departure-roster model | [Pazcare](https://www.pazcare.com/group-personal-accident-insurance/bajaj-allianz) |
| Digit / Tata AIG / Care Health (not deep-researched this pass) | Various | Most mainstream Indian travel/PA insurers offer an adventure-sports rider at extra premium; treat as a long list of fallback options, not differentiated picks | Flag for a follow-up sourcing pass only if ASC360/Symbo negotiations stall |

**Read on this tier:** these are credible, well-capitalized fallback options (especially Bajaj
Allianz's group PA product, which is structurally close to a "bulk Anchor-Operator policy" model) but
none of them specialize in adventure/altitude the way ASC360 does, and none showed a self-serve API in
this research pass — likely slower to integrate than Symbo, less altitude-specific than ASC360.

### 1.5 International adventure-insurance specialists (reference only, not recommended as primary)

Global Rescue, World Nomads, and similar international adventure-travel insurers were not
deep-researched this pass because they are priced/structured for outbound travelers and are a weaker
fit for an India-first, India-resident traveler base at this stage. Worth a second look only if
TruTravel later serves inbound foreign travelers on Himachal treks at scale — noting as a future
research flag, not a current-launch candidate.

---

## 2. Regulatory note — how TruTravel is legally allowed to sell/attach insurance

This matters directly for the September timeline, so flagging it here rather than letting it surface
late in T4's build:

- Under IRDAI rules, an entity that actively sells/solicits insurance on its platform generally needs
  to be a registered **corporate agent** (tied to up to 9 insurers per line of business) or an
  **insurance broker** (represents the customer, can access the whole market) — this is a real
  registration process with its own lead time, not something TruTravel can assume it already has
  standing to do. [IRDAI corporate agents](https://irdai.gov.in/corporate-agents1), [Compliance
  Calendar](https://www.compliancecalendar.in/learn/difference-between-insurance-broker-and-corporate-agent)
- **Three practical paths, in order of speed-to-launch:**
  1. **Referral / proof-of-purchase model (fastest, lowest regulatory lift):** TruTravel requires
     travelers to hold a qualifying policy and either (a) links out to ASC360 (or another insurer) to
     purchase directly — TruTravel never touches underwriting or premium flow — or (b) the Anchor
     Operator purchases a group policy and TruTravel simply verifies proof exists before confirming the
     booking. This avoids TruTravel needing its own IRDAI registration at all, at the cost of a
     referral-flow drop-off point.
  2. **Embedded API via an already-licensed intermediary (Symbo/Riskcovry):** these platforms already
     hold the compliance/licensing layer as a corporate agent or work under an insurer's/broker's
     license; TruTravel integrates as their client, not as a separately-licensed entity. Faster than
     TruTravel self-registering, still requires a commercial agreement and technical integration.
  3. **TruTravel becomes its own registered corporate agent/broker:** slowest path, real regulatory
     lead time (registration, compliance filings, "Board Approved Policy" on how insurance is
     solicited), not realistic for a 4-week launch runway. **Do not pursue this path for the September
     2026 launch** — flag as a possible later-stage move if TruTravel wants to own more of the
     insurance economics once volume justifies it.
- **Recommendation for the September timeline:** pursue **path 1 (referral/proof-of-purchase)** as the
  MVP mechanism, with **path 2 (Symbo/Riskcovry embedded API)** as the fast-follow upgrade once there's
  time to properly integrate and confirm adventure-sports coverage depth. This directly satisfies A4's
  §3 requirement ("require proof of adventure-sports-rated insurance at booking OR offer/bundle a
  compliant policy") without creating a new regulatory dependency on the critical path.

---

## 3. Recommendation snapshot — for founder/A2 decision, not decided here

Per my scope boundary, I am not deciding whether insurance is a per-seat add-on, a mandatory bundled
cost, or an Anchor-Operator-side requirement — this changes the unit-economics model A2 owns
(`docs/strategy/unit-economics.md`) and needs founder/A2 sign-off. Laying out the three options with
tradeoffs:

| Option | How it works | Pros | Cons / A2 impact |
|---|---|---|---|
| **A. Per-seat purchasable add-on** | Traveler is offered ASC360 (or Symbo-sourced) coverage as an optional line item at checkout, priced and shown separately | No forced cost increase on the base trip price; traveler choice; cleanest "trust surface" story (P2's existing state-model language could show insurance status like verification badges) | A4's risk register treats proof-of-coverage as an MVP must-have, not optional — an "optional" add-on model needs a companion hard gate (can't confirm booking without *either* proof of the traveler's own qualifying policy *or* purchase of this add-on). Doesn't solve it alone. |
| **B. Mandatory bundled cost** | Insurance premium is baked into the trip price for any Himachal Thrilling SKU above the altitude threshold; traveler can't opt out | Cleanest compliance story (100% coverage, no verification-gap edge cases), simplest booking-flow build (no branch logic) | Directly raises the traveler-facing price on every high-altitude SKU — A2 needs to model whether this compresses the 18–25% contribution target or whether it's cleanly passed through; also removes traveler choice, which the segment's psychographic profile (fitness-identified, gear-literate, "wants managed risk not bureaucratic over-caution") may or may not tolerate well — worth an A3 gut-check too. |
| **C. Anchor-Operator-side requirement** | Operator is contractually required to hold a group/blanket policy (e.g. Bajaj Allianz Group PA or an ASC360 group product) covering all travelers on a departure, priced into the operator's trip cost, not itemized to the traveler | Matches A4's §2 KYC framing (operator liability insurance is already part of the onboarding checklist) — extends an existing control rather than building a new consumer-facing one; simplest traveler-facing UX (nothing to buy, nothing to verify at checkout beyond the operator's own verification badge) | Puts insurance-quality control fully in the operator's hands — TruTravel loses direct visibility into whether coverage is adequate per-traveler (altitude cap, pre-existing condition handling) unless it also audits the operator's policy terms as part of onboarding, which is more G2 diligence work, not less. Also a real cost pass-through question for A2 (does it show up in operator margin negotiation or in TruTravel's take rate). |

**G4's read (not a decision, a framing note):** Option C (Anchor-Operator-side blanket policy) is the
**fastest to operationalize by September** because it reuses A4's existing operator-insurance-checklist
control (§1/§2 of the risk register) rather than building new consumer checkout logic, and Bajaj
Allianz's Group PA product is a plausible off-the-shelf fit for it. Option A (per-seat add-on via
ASC360 referral) is the **best trust/UX fit** long-term given the segment's psychographics but adds a
verification-gap risk if not paired with a hard gate. A hybrid — **operator must carry a baseline group
policy (C) as the go-live-blocking floor, with ASC360-sourced individual add-on coverage (A) offered
as a higher-limit optional upgrade at checkout once the API/referral integration is ready** — is worth
putting in front of the founder and A2 as a fourth option that sequences B or C's speed against A's
long-term UX quality. Final call is theirs.

---

## 4. Does one partner cover both Thrilling (Himachal high-altitude) and Trippy (same-corridor, lower
risk-profile) at launch?

- **Short answer: plausibly yes for a bundled program, but the two segments have different coverage
  needs and this should be modeled as two policy tiers under one partner relationship, not one
  identical product.**
- Thrilling SKUs need altitude-rated, activity-specific adventure-sports cover (ASC360's core
  specialty). Trippy SKUs in this corridor (Kasol/Tosh café-and-valley-culture trips, not summit
  attempts) need standard trip-cancellation/travel-medical cover — closer to what Symbo or a
  traditional insurer's base travel policy already provides without an adventure rider.
- **ASC360** can very plausibly write both (a general trip policy plus an adventure-activity rider) as
  a single relationship, since they already do custom/configurable policies — worth asking directly in
  the first sales call rather than assuming a second vendor is needed.
- **Symbo** is a stronger fit for the Trippy-side general travel cover specifically, given their
  explicit OTA/travel-platform positioning, but (per §1.2) their adventure-sports depth for the
  Thrilling side is unconfirmed.
- **Practical recommendation:** open the ASC360 conversation asking for both a Thrilling-tier
  (adventure-rated) and a Trippy-tier (standard travel) quote under one relationship first — this is
  the shortest path to a single vendor negotiation instead of two. Keep Symbo in parallel as the
  API-integration fast-follow and as leverage in the ASC360 negotiation.

---

## 5. Timeline assessment for a September 2026 launch (from 2026-08-09, ~4 weeks out)

**Verdict: tight but plausible for the "must-have" bar A4 set — proof-of-coverage requirement — if the
referral/group-policy path (not a full embedded API) is the launch mechanism. Real risk if the founder
wants embedded API checkout live for day one.**

| Milestone | Realistic timing | Risk if compressed |
|---|---|---|
| First outreach + scoping calls (ASC360, Symbo, Bajaj Allianz) | Week 1 (start now — this doc is the trigger) | None if started immediately; every week of delay eats directly into the 4-week runway |
| Confirm coverage scope, get real pricing quotes, decide bundling model (§3) with founder/A2 | Week 1–2 | Needs founder/A2 input fast — this is the single biggest schedule dependency, not a G4-side delay |
| Contract/commercial terms finalized (referral or group-policy path) | Week 2–3 | Group/bulk policy agreements (Option C) are typically faster to paper than a full API integration contract — favors Option C or a referral-link Option A for the September date |
| Technical integration | Referral link / proof-upload field: **days, not weeks** (T1 can build a "policy proof required before confirm" gate quickly). Full embedded API (Symbo-style): **2–4 weeks minimum per Symbo's own stated onboarding window**, starting only after commercial terms are signed — this alone likely doesn't fit inside a 4-week total runway if commercial terms take 2 weeks first | **This is the real risk flag: full embedded-checkout insurance is unlikely to be genuinely ready for a September ship date if commercial negotiation eats the first 2 weeks.** Recommend the referral/proof-gate MVP mechanism (§2, path 1) for launch, with embedded API as an explicit fast-follow, not a launch blocker. |
| Operator-side group policy (if Option C chosen) rolled into G2's Anchor Operator onboarding checklist | Week 2–4, parallel to G2's existing operator onboarding work | Achievable if G2 treats this as an addition to the onboarding checklist they're already building per A4's §2 handoff, not a separate new workstream |

**Bottom line risk flag for the founder:** a fully embedded, API-driven insurance purchase flow
inside TruTravel's checkout is **not realistically achievable by September 2026** if partner selection
and commercial terms aren't locked within the next 1–2 weeks. The **referral-link or Anchor-Operator
group-policy path is achievable** and satisfies A4's actual MVP requirement (proof of coverage exists,
enforced as a hard gate) without needing the embedded API to be done in time. Recommend treating
embedded checkout as a T1/T2 fast-follow milestone, not a go-live blocker.

---

## 6. Weekly-runnable playbook (for another agent to execute without re-briefing)

**Cadence: weekly, owned by G4, reviewed at the weekly margin & trust sync (A2+A4+T2+G2) when insurance
terms are live.**

1. **This week (launch-prep sprint, do first):**
   - Outreach call/email to ASC360 — request (a) confirmation of integration model (bulk group policy
     vs. per-traveler referral vs. API), (b) real pricing for both a Thrilling-tier adventure policy and
     a Trippy-tier standard travel policy under one relationship, (c) minimum lead time to have a live
     agreement.
   - Parallel outreach to Symbo — confirm whether their insurer panel includes adventure-sports/
     high-altitude-trek cover; if yes, get onboarding-timeline and pricing; if no, deprioritize for
     Thrilling and evaluate only for Trippy-side general travel cover.
   - Parallel outreach to Bajaj Allianz (or via a broker) for a Group Personal Accident quote sized to
     a typical Himachal departure roster (~10–15 travelers), as the Option C fallback/comparison.
   - Bring §3's three-option framing (plus the hybrid) to the founder + A2 for a bundling-model
     decision — do not proceed to contracting until this is decided, since it changes which partner
     conversation to prioritize (group-policy negotiation vs. per-seat API integration).
2. **Week 2:** Get quotes in writing from at least 2 of the 3 primary candidates (ASC360, Symbo, Bajaj
   Allianz). Cross-check quoted terms against A4's §3 requirements verbatim (altitude cap must exceed
   the corridor's highest-altitude SKU, evacuation coverage, pre-existing-condition handling) — do not
   accept a quote that has a lower altitude cap than the actual route roster without flagging it back
   to A4/P1 for SKU-scoping review.
3. **Week 3:** Finalize commercial terms for the launch-mechanism path decided in step 1 (referral link
   or group policy). Hand the confirmed partner + integration model to T1/T4 with this doc's §1 (booking-
   flow plug-in point) as the spec input, and to G2 to fold into the Anchor Operator onboarding checklist
   if Option C is chosen.
4. **Week 4 (pre-launch):** Verify the proof-of-coverage gate is actually enforced in the booking flow
   (T5/QA should test this as an explicit acceptance criterion) before any Himachal Thrilling SKU goes
   live for real bookings.
5. **Ongoing (post-launch, weekly):** Track claims experience and traveler friction at the insurance
   step as a funnel metric (hand to T3 for event taxonomy); revisit the referral-vs-embedded-API
   decision once volume justifies the API integration cost; re-quote annually or when route/altitude
   mix changes.

---

## 7. Handoff

- **To T4 (integration/security):** §1's "booking-flow plug-in point" per candidate and §2's
  regulatory-path analysis are your primary build-scope inputs. Recommend building the "proof-of-
  coverage required before booking confirmation" hard gate first (works for any of the three bundling
  options in §3), before investing in a full embedded-API integration.
- **To G2 (Anchor Operator onboarding):** If the founder picks Option C (Anchor-Operator-side group
  policy) or the hybrid in §3, this becomes a new line item in the operator onboarding checklist A4
  already assigned you (risk register §2) — Bajaj Allianz Group PA or an ASC360 group product are the
  two candidates to quote against a real departure roster size.
- **To founder + A2:** §3 (bundling-model decision) is the one explicit "don't decide without them"
  item in this doc — it changes the unit-economics model A2 owns. §5's timeline risk flag (embedded
  checkout unlikely to be ready by September; referral/group-policy path is) is the other item needing
  a fast founder read, since it affects what "launch-ready" means for the insurance requirement.
- **To A4:** No disagreement with the risk register's §3 requirement — this doc is scoped as execution
  on top of it, not a review of it. One addition worth A4's eyes: §2's regulatory-path note (TruTravel
  itself becoming an IRDAI-registered corporate agent is not realistic pre-September) is a new
  regulatory-timeline fact this register didn't have when it was written; worth folding into a future
  revision if useful.
