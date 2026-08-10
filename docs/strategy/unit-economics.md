# TruTravel — Seat-Level Unit Economics (TKT-005, extended by TKT-014)

**Author:** A2 (Unit Economics Analyst)
**Date:** 2026-08-09 (TKT-005 baseline) · **updated 2026-08-09 (TKT-014 — Trippy Tours waterfall +
insurance bundling-model cost impact)**
**Status:** Modeled baseline for founder pricing decision — feeds T2's payout/ledger logic, the
weekly margin & trust review (A2 + A4 + T2 + G2), and now the founder's insurance-bundling
decision (G4, TKT-013)
**Inputs:** `docs/agents/shared-context.md` (guardrail, glossary), `docs/strategy/corridor-shortlist.md`
(A1, corridor/pricing context), `docs/strategy/segment-cards.md` (A3, segment cost/behavior drivers),
`docs/prd/himachal-trippy.md` (P1 — Trippy scope: Manali+Bir only, no Kasol/Parvati, no
`substance_stance` cost/ops implications — TKT-014 input), `docs/ops/partnerships/insurance.md`
(G4 — insurance sourcing + three bundling-model options — TKT-014 input)

---

## 0. How to read this doc

- **Every rupee figure below is a modeled assumption, not measured data.** No TruTravel booking,
  refund, or CAC data exists yet (pre-launch). Treat this as the starting pricing/payout policy
  to stress-test against real corridor data in the first 90 days, not as ground truth.
- Guardrail (Shared Context §3, restated): **platform contribution after variable incentives must
  be ≥18%**, target band 18–25%. Any scenario below 18% is explicitly labeled a **stress-test /
  do-not-launch-as-is** case, never presented as a baseline plan.
- **Contribution formula used throughout:**
  `Net platform contribution % = Platform gross take % − Affiliate/Captain bounty % − CAC allocation % − Refund/cancellation drag %`
  (all as % of gross seat price; "platform gross take" = gross price − Anchor Operator payout).
- Segments modeled: **Thrilling Tours** (guide/permit/gear-cost-heavy), **CodeHouses**
  (infra/curation-cost-heavy), **Music + Art Festivals** (pass-through/CAC-heavy) — chosen per
  ticket brief for structurally distinct cost drivers — and, as of TKT-014, **Trippy Tours**
  (§1.4), confirmed for September launch alongside Thrilling in the same Himachal corridor.
  Wellness and Couple Getaways can be modeled on request using the same template.
- Corridor grounding: Thrilling, Trippy, and CodeHouses figures assume the Himachal Adventure Belt.
  Thrilling and CodeHouses use the full corridor (Manali–Kasol–Tosh–Bir); **Trippy is scoped to
  Manali + Bir only** per P1's PRD (Kasol/Parvati excluded pending A4's legal review — not this
  doc's call, see §1.4). Festival figures assume Goa (Sunburn/Vagator window), A1's #6-ranked-but-
  most-saturated Music+Art pick — A1 flagged Goa's take-rate compression risk directly; this doc
  quantifies it.
- **TKT-014 addition:** §1.4 models Trippy Tours' own seat-level waterfall (previously unmodeled —
  flagged as an open item in P1's PRD §8/§12). §6 prices G4's three insurance-bundling options
  (per-seat add-on, mandatory bundled cost, Anchor-Operator-side requirement) into both Thrilling's
  and Trippy's waterfalls — this is a decision input for the founder's bundling-model call, not a
  decision made by this doc.

---

## 1. Seat-level revenue waterfalls (baseline)

### 1.1 Thrilling Tours — Himachal 5D/4N trek package

| Line | % of gross | ₹ (gross seat price ₹14,000) |
|---|---|---|
| Gross seat price | 100% | ₹14,000 |
| − Anchor Operator payout (guide, permits, gear, stay, food, local transport) | 68% | ₹9,520 |
| **= Platform gross take** | **32%** | **₹4,480** |
| − Affiliate/Captain bounty (in-corridor referral) | 5% | ₹700 |
| − CAC allocation (blended paid+organic, amortized over 1.4 lifetime trips/traveler) | 4% | ₹560 |
| − Refund/cancellation drag (baseline refund rate 8%, see §3.1 for model) | 3.2% | ₹448 |
| **= Net platform contribution** | **19.8%** | **₹2,772** |

Status: **within guardrail (18–25%)**, but thin cushion — see §3.1, breaches floor above ~12.5%
refund rate, which is plausible for Himachal's weather-driven trek season (Apr–Jun / Sep–Nov).

### 1.2 CodeHouses — Bir/Dharamkot 7-night workation

| Line | % of gross | ₹ (gross seat price ₹22,000) |
|---|---|---|
| Gross seat price | 100% | ₹22,000 |
| − Anchor Operator payout (property, wifi/desk infra, meals, house-lead ops) | 62% | ₹13,640 |
| **= Platform gross take** | **38%** | **₹8,360** |
| − Affiliate/Captain bounty (house-lead / peer referral) | 4% | ₹880 |
| − CAC allocation (blended, amortized over 2.2 lifetime trips/traveler) | 7% | ₹1,540 |
| − Refund/cancellation drag (baseline refund rate 5%) | 2% | ₹440 |
| **= Net platform contribution** | **25%** | **₹5,500** |

Status: **top of guardrail band, best-cushioned segment.** Lower operator payout % is
justified because TruTravel's differentiator here is curation/identity-verification (per A3's
CodeHouses card), not just logistics — the platform is doing more of the value-add work than in
Thrilling, so a higher take is defensible.

### 1.3 Music + Art Festivals — Goa 3D/2N travel+stay+pass bundle

Two scenarios shown because A1 flagged Goa as the most competitively saturated corridor and this
segment's naive/current-market economics genuinely fail the guardrail.

**(a) Naive / current-market baseline — STRESS-TEST, DO NOT LAUNCH AS-IS**

| Line | % of gross | ₹ (gross seat price ₹18,000) |
|---|---|---|
| Gross seat price | 100% | ₹18,000 |
| − Anchor Operator payout (stay, local transport, crew; pass cost pass-through at thin ~8% affiliate commission captured) | 70% | ₹12,600 |
| **= Platform gross take** | **25%** | **₹4,500** |
| − Bounty (scene-authentic captain) | 6% | ₹1,080 |
| − CAC allocation (paid-social-driven, seasonal FOMO ad costs, amortized over 1.6 lifetime trips) | 7% | ₹1,260 |
| − Refund/fraud drag (refund rate ~12.5%, includes pass-delivery dispute overhead) | 5% | ₹900 |
| **= Net platform contribution** | **7%** | **₹1,260** |

**FLAG: 11 points below the 18% floor.** This is the segment's default trajectory if launched
without structural fixes — matches A1's independent flag that Goa is likely to compress take
rate below target.

**(b) Recommended / fixed baseline — requires 3 structural changes before launch**

| Line | % of gross | ₹ (gross seat price ₹18,000) | Fix applied |
|---|---|---|---|---|
| Gross seat price | 100% | ₹18,000 | — |
| − Anchor Operator payout | 68% | ₹12,240 | Renegotiate festival-pass affiliate commission from ~8% → ~15%, folded into platform take |
| **= Platform gross take** | **32%** | **₹5,760** | |
| − Bounty (scene-authentic captain) | 6% | ₹1,080 | unchanged |
| − CAC allocation | 5% | ₹900 | Shift majority of demand-gen from paid social to scene/captain-led recruiting (per A3's Festival captain guidance) |
| − Refund/fraud drag | 3% | ₹540 | Stricter pass-delivery SLA + partial non-refundable pass fee, refund rate target 7.5% |
| **= Net platform contribution** | **18%** | **₹3,240** | |

Status: **meets the floor exactly, zero cushion.** See §3 — this segment has no headroom on
either refund rate or CAC before breaching guardrail. Treat as an actively-managed segment, not
a "set and forget" one.

### 1.4 Trippy Tours — Manali/Bir 4D/3N loosely-structured group trip (TKT-014)

Grounded in P1's Himachal×Trippy PRD (`docs/prd/himachal-trippy.md`): **Manali + Bir sub-corridors
only** for September (no Kasol/Parvati — legally excluded pending A4's review, a scope constraint
this doc inherits, not relitigates). The PRD also rules out any `substance_stance` field or
cost/ops line — pressure-mismatch mitigation is 100% people/policy (code of conduct, Captain
training, incident-response protocol), so there is no distinct "substance risk" line item in this
model; its cost shows up entirely inside the Captain bounty line below.

P1's working hypothesis (PRD §8, explicitly flagged there as a hypothesis pending this model) was
that Trippy sits closer to CodeHouses' curation-heavy profile than Thrilling's guide/permit-heavy
profile. **This model partially confirms that, with one correction:** Trippy's Anchor Operator
payout is lighter than Thrilling's (no guide/permit/technical-gear costs — Trippy Trips default to
non-technical terrain per the PRD's scope cuts), but it is not as light as CodeHouses' infra-only
model, because a real Anchor Operator is still running stays, local transport, and shared group
activities across two sub-corridors — closer to Thrilling's cost shape than CodeHouses'.

**One structural difference from every other segment modeled:** the Captain bounty line here is
not a pure referral fee. Per the PRD (§3, §6), the Trippy Captain *is* the safety/culture lead —
no separate guide role exists — trained on de-escalation, group-energy reading, and code-of-conduct
enforcement (PRD §6, G1-owned training content). That is real operational responsibility beyond
Thrilling's/CodeHouses' in-corridor referral bounty, so this model prices it as a **bounty/stipend
hybrid at 7%** (vs Thrilling's 5% pure-referral bounty). **This 7% figure is an A2 assumption, not
a number G1/A4 have signed off on** — reconcile against G1's actual Captain stipend/training-program
design before it drives real payout terms.

| Line | % of gross | ₹ (gross seat price ₹12,000) |
|---|---|---|
| Gross seat price | 100% | ₹12,000 |
| − Anchor Operator payout (stay, local transport, shared meals/group activities across Manali+Bir — no guide/permit/technical-gear costs per PRD scope) | 64% | ₹7,680 |
| **= Platform gross take** | **36%** | **₹4,320** |
| − Captain bounty/stipend (expanded safety+culture-lead role, not pure referral — see note above) | 7% | ₹840 |
| − CAC allocation (blended, community/word-of-mouth-leaning per A3's psychographic profile, amortized over 1.8 lifetime trips/traveler — modeled, not measured) | 4.5% | ₹540 |
| − Refund/cancellation drag (baseline refund rate 7%, same `× 0.4` model as §3.1) | 2.8% | ₹336 |
| **= Net platform contribution** | **21.7%** | **₹2,604** |

**Status: within guardrail, safer cushion than Thrilling — this is the lower-risk segment of the
two launching together in September, on unit economics specifically.** 3.7-point buffer above the
18% floor vs Thrilling's 1.8-point buffer. Breakeven refund rate ~16.25% (vs Thrilling's ~12.5%,
§3.1) and breakeven CAC multiplier ~1.82x (vs Thrilling's ~1.45x, §3.2) — both give Trippy
meaningfully more room before breaching the floor than Thrilling has, driven by Trippy's lighter
operator-payout % (64% vs 68%) more than offsetting its heavier Captain bounty (7% vs 5%). Worth
stating explicitly since Trippy carries *more* open non-economic risk than Thrilling (Parvati
exclusion, substance-adjacent legal/brand exposure, per A4's risk register) even though its unit
economics are comparatively clean — the two risk profiles are not correlated, and shouldn't be
conflated in the go/no-go conversation.

**Partner-tier flag — do not reuse Thrilling's §2 tier payout bands for Trippy as-is.** Because
Trippy's bounty (7%) is structurally less compressible than a pure referral fee — it compensates
real per-departure Captain labor, not just demand generation an established operator brings — the
combined incentive stack (bounty + CAC + refund drag ≈ 14.3% at baseline) is meaningfully heavier
than Thrilling's (≈12.2%). Applying Thrilling's exact tier bands to Trippy stress-tests badly:

| Tier (Thrilling's bands, applied to Trippy unchanged) | Payout | Bounty | CAC | Refund drag | Net contribution |
|---|---|---|---|---|---|
| T1 (74–76%, 2–3% bounty, 2–3% CAC) | 75% | 2.5% | 2.5% | 2.8% | **17.2% ⚠ breaches floor** |
| T2 (68–70%, 4–6% bounty, 4–6% CAC) | 69% | 5% | 5% | 2.8% | 18.2% (borderline, ~0pt cushion) |
| T3 (62–65%, 4–6% bounty, 7–9% CAC +2pt refund buffer) | 63.5% | 5% | 8% | 4.8% | 18.7% (borderline, ~0.7pt cushion) |

None of these carry the same cushion Thrilling gets at its own tiers (§2: 18–21%+ ranges with real
headroom) — T1 breaches outright, T2/T3 pass by a sliver. **Recommend G2/founder adopt dedicated
Trippy tier payout bands instead of inheriting Thrilling's:**

| Tier (Trippy-specific, recommended) | Payout | Bounty/stipend | CAC | Refund drag | Net contribution range |
|---|---|---|---|---|---|
| T1 | 66–68% | 4–5% | 2–3% | 2.8% | ~22–24% |
| T2 (this section's baseline) | 63–65% | 7% | 4.5% | 2.8% | ~21–23% |
| T3 | 58–61% | 8% | 7–9% | 4.8% (+2pt buffer) | ~18–21% (low end thin, monitor closely) |

Practical implication for G2: an Indiahikes/Bikat-scale operator that qualifies as **T1 on
Thrilling** does not automatically get T1-equivalent Trippy payout terms — Trippy tier
qualification should run on Trippy's own departure history (per §2's qualification criteria,
applied per-segment, per the PRD's own framing of Trippy and Thrilling as separate product
surfaces sharing only the corridor).

---

## 2. Partner tier model

Tiering exists so operator payout % reflects both the platform's actual cost-to-serve
(onboarding, QA, refund risk exposure) and negotiating leverage — not a flat rate across all
supply.

| Tier | Profile | Qualification bar | Operator payout | Platform gross take | Bounty cap | CAC allocation | Net contribution range | Rationale |
|---|---|---|---|---|---|---|---|---|
| **T1 — Anchor Operator** | Established, multi-corridor, own demand channel (e.g. Indiahikes/Bikat-scale for Thrilling, NomadGao-scale for CodeHouses) | ≥20 departures/quarter, ≥4.5★, <2% safety-incident rate | 74–76% | 24–26% | 2–3% (low — partner brings own audience) | 2–3% (low — organic pull) | 18–21% | Platform trades take-rate % for reliability, proven ops, and reduced onboarding/QA cost; thin take rate is offset by a much thinner incentive stack |
| **T2 — Established Regional Operator** | Solid local operator, 1–2 corridors, growing track record | 5–19 departures/quarter, ≥4.0★, <5% incident rate | 68–70% | 30–32% | 4–6% (standard) | 4–6% (standard — platform drives majority of demand) | 19–23% | **This is the default profile used in the §1 baseline waterfalls above.** |
| **T3 — Emerging / Probationary Operator** | New corridor entrant, unverified at scale | <5 departures completed, no rating history | 62–65% | 35–38% | 4–6% (standard) | 7–9% (higher — 100% platform-driven demand) + 2pt refund-drag buffer (QA-unproven) | 20–24% | Higher take rate is not punitive — it prices in the platform's extra trust/QA cost per A4's onboarding review. Graduates to T2 after 5 clean departures + ≥4.2★. |

**Note (TKT-014):** the bands above are Thrilling's (and, by extension, the general template used
for CodeHouses/Festival). **Do not apply them to Trippy unchanged** — see §1.4's dedicated Trippy
tier table, which lowers each band ~7–8 points to protect the floor against Trippy's heavier
Captain bounty.

**Guardrail rule for T2 (Payments & Ledger) to implement:** combined variable incentive stack
(bounty % + CAC allocation % + refund-drag reserve %) must never exceed
`platform_gross_take % − 18`. If a proposed bounty/CAC/refund combination would breach this at
booking or payout-confirmation time, the system should flag it before confirming operator payout
terms rather than silently absorbing the loss.

---

## 3. Sensitivity tables

### 3.1 Refund rate vs. net contribution

Refund/cancellation drag is modeled as `refund_rate × 0.4` (i.e. the platform absorbs ~40% of
refunded booking value net of a non-refundable operator deposit/cancellation fee retained on the
rest — **this multiplier is an assumption to validate with A4's actual refund policy design, not
a measured figure**). Baseline refund-rate assumptions per segment are marked with a border.

| Refund rate | Thrilling (take 32%, bounty 5%, CAC 4%) | CodeHouses (take 38%, bounty 4%, CAC 7%) | Festival — recommended (take 32%, bounty 6%, CAC 5%) | Trippy (take 36%, bounty 7%, CAC 4.5%) |
|---|---|---|---|---|
| 2% | 22.2% | 26.2% | 20.2% | 23.7% |
| 5% | 21.0% | 25.0% | 19.0% | 22.5% |
| **5% (CodeHouses baseline)** | — | **25.0%** | — | 22.5% |
| **7% (Trippy baseline)** | 20.2% | — | — | **21.7%** |
| **7.5% (Festival recommended baseline)** | 20.0% | — | **18.0% (exact floor)** | 21.5% |
| **8% (Thrilling baseline)** | **19.8%** | 23.8% | 17.8% ⚠ | 21.3% |
| 10% | 19.0% | 23.0% | 17.0% ⚠ | 20.5% |
| 12% | 18.2% | 22.2% | 16.2% ⚠ | 19.7% |
| 15% | 17.0% ⚠ | 21.0% | 15.0% ⚠ | 18.5% |
| **16.25% (Trippy breakeven)** | 16.5% ⚠ | — | — | **18.0% (exact floor)** |
| 20% | 15.0% ⚠ | 19.0% | 13.0% ⚠ | 16.5% ⚠ |

⚠ = below 18% guardrail floor.

**Breakeven refund rates (where net contribution = 18%):**
- Thrilling: **~12.5%** refund rate — plausible risk given trek-season weather cancellations.
- CodeHouses: **~22.5%** refund rate — large cushion, low urgency.
- Festival: **~7.5%** refund rate — **this equals the recommended baseline itself.** Zero cushion;
  any refund-rate uptick (weather, event postponement, pass disputes) immediately breaches the
  floor. Highest-priority segment for A4's refund-policy design.
- **Trippy: ~16.25%** refund rate (TKT-014) — meaningfully more cushion than Thrilling despite
  launching in the same corridor and month; Trippy's lighter operator-payout % more than offsets
  its heavier Captain bounty.

### 3.2 CAC swing vs. net contribution

CAC multiplier applied to each segment's baseline CAC-allocation %, refund drag held at each
segment's own baseline.

| CAC multiplier | Thrilling (base CAC 4%) | CodeHouses (base CAC 7%) | Festival — recommended (base CAC 5%) | Trippy (base CAC 4.5%) |
|---|---|---|---|---|
| 0.5x | 21.8% | 28.5% | 20.5% | 24.0% |
| 0.75x | 20.8% | 26.75% | 19.25% | 22.8% |
| **1.0x (baseline)** | **19.8%** | **25.0%** | **18.0% (exact floor)** | **21.7%** |
| 1.25x | 18.8% | 23.25% | 16.75% ⚠ | 20.6% |
| **1.45x (Thrilling breakeven)** | **18.0% (exact floor)** | — | — | 19.4% |
| 1.5x | 17.8% ⚠ | 21.5% | 15.5% ⚠ | 19.5% |
| **1.82x (Trippy breakeven)** | 16.5% ⚠ | — | — | **18.0% (exact floor)** |
| 2.0x | 15.8% ⚠ | 18.0% (exact floor) | 13.0% ⚠ | 17.2% ⚠ |
| 2.5x | — | 14.5% ⚠ | — | 15.0% ⚠ |

Same pattern as §3.1: **CodeHouses has the deepest CAC cushion** (2x CAC before breaching);
**Festival has zero cushion at baseline** — any CAC increase (e.g. a paid-social bidding war
against WanderOn/Zo World in the same festival window) breaches the floor immediately. **Trippy
(TKT-014) sits between Thrilling and CodeHouses** — breakeven CAC multiplier ~1.82x, more
resilient than Thrilling (~1.45x) but less than CodeHouses (2.0x); middle-of-the-pack CAC
resilience among all four modeled segments.

### 3.3 LTV : CAC by segment (baseline, contribution-based LTV)

`LTV = net contribution per seat × avg lifetime trips/traveler (24-month horizon, modeled)`
`Total CAC = CAC-allocation per seat × avg lifetime trips/traveler`

| Segment | Net contribution/seat | Avg lifetime trips (modeled) | LTV | CAC-alloc/seat | Total CAC | LTV : CAC |
|---|---|---|---|---|---|---|
| Thrilling | ₹2,772 | 1.4 | ₹3,881 | ₹560 | ₹784 | **4.95x** |
| CodeHouses | ₹5,500 | 2.2 | ₹12,100 | ₹1,540 | ₹3,388 | **3.57x** |
| Festival (recommended) | ₹3,240 | 1.6 | ₹5,184 | ₹900 | ₹1,440 | **3.60x** |
| **Trippy (TKT-014)** | **₹2,604** | **1.8** | **₹4,687** | **₹540** | **₹972** | **4.82x** |

Read: Thrilling and Trippy are the two most **capital-efficient** segments (best ratios, cheapest
CAC via captain/community channels) — consistent with both being launched in the same
community-dense Himachal corridor. CodeHouses generates the most **absolute contribution dollars
per customer** but is the least CAC-efficient of the four because founder/builder acquisition is
inherently paid-channel-heavy. Festival sits in the middle on the ratio but carries the least
margin-of-error (§3.1–3.2). Lifetime-trip counts are directional hypotheses (no primary retention
data) — flag for A3/G1 to validate against real repeat-booking behavior once corridor data exists;
Trippy's 1.8 figure is a TKT-014 assumption, not yet validated.

---

## 4. Recommendations for the founder

1. **Lock tiered payout bands as policy, not case-by-case negotiation.** T1 74–76% / T2 68–70% /
   T3 62–65% operator payout (§2, Thrilling/CodeHouses/Festival). Feed directly to T2's payout
   logic and G2's operator onboarding conversations (Indiahikes/Bikat likely enter as T1 or
   fast-track T2 given existing scale). **Trippy uses its own, lower bands — see §1.4 and
   recommendation 9.**
2. **Implement the incentive-cap guardrail in the booking/payout system now, pre-launch:**
   `bounty% + CAC% + refund-drag% ≤ platform_gross_take% − 18`. This turns the 18% floor from a
   spreadsheet rule into a system-enforced check before any partner payout or bounty is confirmed.
3. **CodeHouses is the strongest unit-economics case of the three originally modeled segments** —
   25% baseline contribution, cushion to 2x CAC or ~22.5% refund rate before breaching floor. If
   A1's phased Himachal plan proceeds, CodeHouses is a low-risk fast-follow on the margin side —
   the open questions are product/trust complexity, not unit economics.
4. **Thrilling (Himachal) is launch-viable but refund-rate sensitive.** Recommend a
   non-refundable operator deposit of at least 30–40% of trip cost in the cancellation policy to
   keep realized refund drag under the ~12.5% breakeven threshold — trek-season weather
   cancellation risk should go to A4 for a formal policy design before launch, not be left to
   default terms. **This is now Thrilling's single biggest margin-fragility point given it's also
   the segment most exposed to insurance-bundling cost risk (§6.4) — the two risks compound.**
5. **Do not launch Music + Art Festivals (Goa) on naive current-market terms** — 7% modeled
   contribution, 11 points under floor. If pursued, it requires all three fixes simultaneously to
   reach the 18% floor — and even then, cushion is zero. Recommend treating Festival as a
   **third-priority segment** behind Thrilling and CodeHouses/Trippy.
6. **Replace modeled refund rate, CAC, and lifetime-trip assumptions with real data within the
   first 90 days** of the first corridor launch. Every number in this doc is a pre-launch
   estimate; the weekly margin & trust review should track realized-vs-modeled variance on these
   inputs, since §3 shows they are the levers most likely to silently break the 18% floor.
7. **A4 follow-up needed:** refund-policy design (deposit %, cancellation windows) directly
   determines whether Thrilling and Festival stay inside the guardrail — this is a top open item.
8. **Trippy Tours (Himachal, Manali+Bir) is unit-economics-safe for September launch** (TKT-014)
   — 21.7% baseline contribution, 3.7-point cushion (vs Thrilling's 1.8-point), breakeven refund
   rate ~16.25% and CAC multiplier ~1.82x. **Of the two segments launching together, Trippy is the
   lower unit-economics risk** — Thrilling's exposure is refund-rate and (per §6) insurance-cost
   driven, and Trippy is comparatively insulated from both. Trippy's real risk is non-economic
   (Parvati exclusion, substance-adjacent legal/brand exposure, per A4) — a founder go/no-go on
   Trippy should weigh that risk on its own terms, not read a clean margin number as "low risk
   overall."
9. **Do not apply Thrilling's tier payout bands (T1 74–76%, T2 68–70%) to Trippy Anchor Operators
   as-is** (§1.4). Trippy's heavier, less-compressible Captain bounty (7%, a real safety/culture-
   lead role, not a referral fee) means Thrilling's T1 band breaches the floor outright (17.2%)
   and T2/T3 bands pass only by a sliver. Recommend G2/founder adopt dedicated Trippy tier payout
   bands before any Trippy Anchor Operator tier-based payout negotiation — suggested starting
   point in §1.4 (T1 66–68% / T2 63–65% / T3 58–61%).
10. **Insurance bundling-model choice (G4's TKT-013, §6) materially affects both segments'
    guardrail cushion, most acutely Thrilling's.** Recommend the founder read §6 before finalizing
    G4's bundling decision — Option C (Anchor-Operator-side, if TruTravel compensates the operator
    for the cost) breaches Thrilling's floor above a **~₹252/seat** group-policy cost, a plausible
    real premium level; Trippy has more room (~₹444/seat).
11. **If Option B (mandatory bundled insurance) is chosen for either segment, T2 must scope
    affiliate/Captain bounty and CAC-allocation commission calculations against the pre-insurance
    trip price, not the insurance-inflated total** (§6.3) — this single build decision is the
    difference between a floor-neutral outcome and a near-floor-breach (Thrilling, 18.1% at a
    plausible ₹800 premium) or worse (9.1% at G4's own flagged stress figure).
12. **Replace Trippy's assumptions (Captain bounty %, refund rate, lifetime-trip count, CAC) with
    real data within Trippy's first 90 days**, same discipline as recommendation 6 — Trippy has
    zero operating track record, more so than any previously modeled segment.

---

## 5. Handoff notes

- **For T2 (Payments & Ledger):** §1 waterfalls (including §1.4's Trippy waterfall) give concrete
  per-seat line items to build the payout/ledger schema against. §2's incentive-cap formula should
  become a pre-payout validation check. Tier (§2, §1.4 for Trippy's dedicated bands) should be a
  first-class Anchor Operator attribute driving payout % at booking time, **scoped per segment, not
  inherited across an operator's segments.** **New (TKT-014):** if Option B insurance bundling is
  chosen (§6.3), the commission-base scoping rule (bounty/CAC/refund-drag computed on pre-insurance
  trip price; insurance premium treated as non-refundable) must be a tested acceptance criterion,
  not an implicit default — §6.3 shows the quantified cost of getting this wrong.
- **For A4 (Risk & Trust):** refund/cancellation policy design is a top open dependency — see
  Recommendation 7. Please validate or correct the `refund_rate × 0.4` platform-loss-share
  assumption used throughout §3.1 (now including Trippy) against whatever deposit/cancellation-
  window policy you design.
- **For G2 (Supply Ops):** §2 tier bar is the proposed Thrilling/CodeHouses/Festival
  operator-graduation criteria. **§1.4's dedicated Trippy tier table is the one to use for Trippy
  operators** — do not carry an operator's Thrilling tier status over to Trippy sourcing/payout
  conversations. **New (TKT-014):** if Option C insurance bundling is chosen (§6.4), the group-
  policy cost becomes a new line in the Anchor Operator onboarding checklist (already flagged to
  you by G4) — coordinate with A2 on which segment's premium tier (Thrilling adventure-rated vs
  Trippy standard) applies to which operator relationship, and flag back to A2 if real vendor
  quotes land outside the ₹100–500/seat range modeled in §6.1.
- **For G4 (Partnerships):** §6 is the cost-model decision input you flagged as owed to A2 in
  `docs/ops/partnerships/insurance.md` §3/§7 — this closes that loop. §6.1's premium assumptions
  are placeholders pending your real quotes; please send updated figures back to A2 as soon as
  ASC360/Symbo/Bajaj Allianz pricing is confirmed so §6's tables can be re-run against real numbers
  before contracting.
- **For the founder / Orchestrator:** this doc does not pick a corridor, segment, or insurance-
  bundling model — those are still founder calls (Trippy's Parvati/legal questions sit with A4;
  the bundling-model choice sits with §6.5's framed options). It does tell you which segments and
  which insurance structures have the healthiest and least healthy unit-economics profile, to
  weigh alongside A1's market-size input, A4's risk/trust input, and G4's UX/timeline input.

---

## 6. Insurance bundling-model cost impact (TKT-014)

### 6.0 Scope and inputs

- Per G4's insurance-sourcing doc (`docs/ops/partnerships/insurance.md`), three bundling options
  are on the table, each satisfying A4's MVP proof-of-coverage requirement differently:
  **(A) per-seat purchasable add-on, (B) mandatory bundled cost, (C) Anchor-Operator-side
  requirement.** G4 explicitly did not pick one (`insurance.md` §3, §7) — that is the founder's
  call, informed by this section. **This section does not make that call either.**
- G4's own pricing research is directional, not quoted (G4's own words: "treat as ballpark only,
  not a quote"). This section models a **Low / Mid (working assumption) / stress-test-High**
  premium range per segment rather than asserting one number, consistent with the rest of this
  doc's "modeled assumption, not measured data" discipline (§0).
- Segment-tiering follows `insurance.md` §4: Thrilling needs adventure/altitude-rated cover
  (ASC360-class); Trippy (lower-risk, café/valley-culture activities per the PRD, not summit
  attempts) needs standard travel/medical cover (Symbo-class), which should be meaningfully
  cheaper — modeled as such below.

### 6.1 Premium assumptions used below

| Segment | Product tier | Low | Mid (working assumption) | Stress-test High |
|---|---|---|---|---|
| Thrilling — per-seat individual policy (Options A/B) | Adventure-rated (ASC360-class) | ₹300 | ₹800 | ₹7,000 (G4's own flagged $85-equivalent low end, `insurance.md` §1.1 — explicitly unverified against a quote) |
| Trippy — per-seat individual policy (Options A/B) | Standard travel/medical (Symbo-class) | ₹150 | ₹300 | not modeled — G4 did not flag a stress figure for standard cover |
| Thrilling — group/blanket policy (Option C) | Bajaj Allianz Group PA-class, adventure rider | ₹100/seat | ₹250/seat | ₹500/seat |
| Trippy — group/blanket policy (Option C) | Bajaj Allianz Group PA-class, standard | ₹100/seat | ₹200/seat | ₹300/seat |

**None of these are quotes.** G4's own doc flags the ASC360 range as unverified; G4's own action
item (already in their doc) is to get real pricing before contracting. Treat the Low/Mid columns
as the working planning assumption and the High column as the stress case to pressure-test
against, not as the launch number.

### 6.2 Option A — Per-seat purchasable add-on (referral model, `insurance.md` §2 Path 1)

Per G4's regulatory read, the fastest-to-launch mechanism is a **pure referral link** — the
traveler completes the insurance purchase directly with ASC360/Symbo; TruTravel never touches the
premium.

- **Direct contribution-margin impact: 0%.** No premium ₹ flows through TruTravel's books, so
  neither segment's waterfall changes — Thrilling stays at 19.8%, Trippy at 21.7%, regardless of
  which premium tier applies.
- **What it does NOT solve on its own:** A4's proof-of-coverage requirement is an MVP must-have,
  not optional — an "optional" add-on needs a companion hard gate (booking can't confirm without
  either the traveler's own qualifying policy proof, or a completed add-on purchase). That gate is
  a real T1/T4 build item (already flagged in G4's doc), not modeled here as a ₹ cost, but it is
  real engineering effort with its own timeline risk (`insurance.md` §5).
- **Unmodeled upside:** if TruTravel later negotiates a referral commission from ASC360/Symbo (not
  confirmed anywhere in G4's doc — worth G4 asking explicitly in the first sales call), that
  becomes new, near-zero-cost margin. Not included in any figure in this doc; a genuine follow-up
  ask for G4.
- **Unmodeled risk:** referral-link drop-off (traveler starts checkout, is redirected to buy
  insurance, abandons) could raise realized CAC-per-confirmed-booking if it reduces conversion —
  no funnel data exists yet to quantify this; flag for A1/G1 to track post-launch as a distinct
  funnel metric (per `insurance.md` §6, step 5).
- **Guardrail status: safest of the three options for the 18% floor — by construction, not by
  careful implementation.** This is the structural reason it's the lowest-risk starting point.

### 6.3 Option B — Mandatory bundled cost (baked into trip price)

This is where **how** T2 builds it matters more than **which** premium tier is chosen.

**Correct implementation (recommended convention):** the insurance premium is a pure pass-through
line, added to the price the traveler pays but excluded from (a) the bounty/CAC commission base —
Captains/affiliates are compensated for driving the trip booking, not for insurance sold on top —
and (b) the refund-drag calculation, since insurance premiums are standard-practice non-refundable
once a policy is issued (the insurer keeps it regardless of trip cancellation). **Under this
convention, contribution margin is unchanged at any premium level** — Thrilling stays 19.8%,
Trippy stays 21.7% — because the added revenue and added cost net to zero and never touch the
incentive-stack calculations.

**Naive implementation (a real risk if this isn't specified to T2 explicitly):** if
bounty/CAC/refund-drag percentages are calculated against the insurance-inflated total price (the
more "default" behavior of a percentage-of-transaction commission engine if nobody flags this),
margin leaks in proportion to premium size:

| Premium tier | Thrilling: naive-implementation net contribution | Trippy: naive-implementation net contribution |
|---|---|---|
| Low (₹300 Thrilling / ₹150 Trippy) | 19.1% | 21.3% |
| Mid (₹800 Thrilling / ₹300 Trippy) | **18.1% — effectively zero cushion left** | 20.8% |
| Stress-test High (₹7,000 Thrilling / n/a Trippy) | **9.1% ⚠ — 8.9 points below floor** | n/a |

**FLAG:** at the Mid premium (₹800, a plausible real Thrilling adventure-policy price), naive
commission-base implementation eats Thrilling's entire remaining cushion. At G4's own flagged
stress figure (₹7,000), it doesn't just breach the floor, it collapses margin by nearly 9 points.
**This is a specific, testable build instruction, not a vague caution: T2 must scope
bounty/CAC/refund-drag calculations to the pre-insurance trip price, and treat the insurance
premium as non-refundable regardless of trip-cancellation outcome.** Trippy is far less exposed to
this failure mode (its lower standard-cover premium means even naive implementation only costs
~0.4–0.9 points) — one more reason Option B is structurally safer for Trippy than for Thrilling.

- **Guardrail status: floor-neutral if correctly implemented (both segments); Thrilling-specific
  near-breach/breach risk if implemented naively, scaling directly with premium size.**

### 6.4 Option C — Anchor-Operator-side requirement (group/blanket policy)

Two sub-cases, because "the operator is required to hold a policy" doesn't by itself say who bears
the cost:

**C1 — Operator absorbs the cost within their existing payout %** (no change to the ₹ TruTravel
pays the operator; the operator's own margin inside their payout % shrinks). **Zero impact on
TruTravel's contribution margin in either segment** — the floor risk moves entirely to the
operator relationship, not TruTravel's P&L. The real risk is operator pushback/retention, not a
margin-guardrail breach — and per §2/§1.4's tier logic, **T3/probationary operators (already the
thinnest-margin tier — 62–65% Thrilling payout / 58–61% recommended Trippy payout) are least able
to absorb this without renegotiating up.** That's a live G2 negotiation risk to flag, not an A2
modeling problem.

**C2 — TruTravel compensates the operator for the group-policy cost via increased payout %** (the
operationally more likely outcome if operators push back on C1, especially T3 partners). This
directly compresses platform gross take:

| Group-policy cost/seat | Thrilling: net contribution | Trippy: net contribution |
|---|---|---|
| ₹100 | 19.1% | 20.9% |
| ₹200 | 18.4% | 20.0% |
| **₹252 (Thrilling breakeven)** | **18.0% (exact floor)** | 19.6% |
| ₹300 | 17.7% ⚠ | 19.2% |
| ₹400 | 16.9% ⚠ | 18.4% |
| **₹444 (Trippy breakeven)** | 16.6% ⚠ | **18.0% (exact floor)** |
| ₹500 | 16.2% ⚠ | 17.5% ⚠ |

**FLAG:** under C2, Thrilling breaches the floor above a **~₹252/seat** group-policy cost — a
genuinely plausible price point for a Himachal adventure-rated group PA product (Bajaj Allianz's
Group PA line, `insurance.md` §1.4, is priced per-roster and could land anywhere in this range
pending a real quote). Trippy has meaningfully more room (~₹444/seat breakeven). **Thrilling is
the segment to stress-test hardest before committing to C2** — its 1.8-point baseline cushion
(§1.1) leaves almost no room to absorb a per-seat operator-side cost increase on top of its
existing refund-rate sensitivity (§3.1).

- **Guardrail status: C1 (operator-absorbed) is floor-neutral for TruTravel but carries operator-
  retention risk, concentrated in T3 partners; C2 (TruTravel-compensated) has real, quantified
  floor risk for Thrilling above ~₹252/seat, more room for Trippy above ~₹444/seat.**

### 6.5 Recommendation on bundling model — framed as input to the founder's decision, not a pick

This is explicitly the founder's call (per G4's own scope boundary, `insurance.md` §3) — the
analysis below is the cost/margin lens on the same three options G4 already laid out for
trust/UX/timeline in `insurance.md` §3 and §5.

- **Purely on guardrail protection, Option A (per-seat referral add-on) is the safest** — it
  structurally cannot breach the floor because it never touches TruTravel's P&L. Its costs are
  elsewhere: it needs the hard proof-of-coverage gate (real, unquantified build effort) and leaves
  an unmodeled conversion-drop-off/CAC risk.
- **Option B (mandatory bundled) is floor-neutral only if T2 builds the commission-base scoping
  correctly** (§6.3) — this makes it a **process/build-discipline risk, not a structural one.** If
  the founder wants B for its cleaner compliance story (G4's own framing in `insurance.md` §3),
  this doc's recommendation is: make "commission base excludes insurance premium" an explicit,
  tested T2/T5 acceptance criterion — the naive-implementation numbers above (18.1% Thrilling at
  Mid premium, a near-breach) show the cost of getting this wrong.
- **Option C carries the most segment-differentiated risk.** If chosen, this doc recommends
  **C1 (operator-absorbed)** over C2 specifically for Thrilling, given its thin baseline cushion —
  but that recommendation is conditional on G2 confirming operators (especially T1/T2 Thrilling
  partners, who already run tight incentive stacks per §2) will actually accept the cost without
  demanding a payout increase. If G2's operator conversations surface real resistance, C2's
  ₹252/seat Thrilling breakeven (§6.4) should come back to the founder/A2 before finalizing, not be
  absorbed silently into take rate.
- **G4's own suggested hybrid** (`insurance.md` §3: operator-side blanket policy as the go-live
  floor, ASC360 per-seat add-on as a later optional upgrade) is, from a pure margin lens, **the
  option that sequences best against this doc's findings** — it uses C1/C2 only as a floor-meeting
  minimum (where the ₹252/₹444 breakeven numbers above should directly inform what "acceptable"
  group-policy cost looks like in G2's vendor negotiation) while deferring Option A's UX upside to
  a fast-follow that carries zero guardrail risk.
- **Either way, Trippy has more absorption capacity than Thrilling for any insurance-cost option
  modeled here** (§6.2–6.4) — if the founder wants to sequence the bundling-model decision by
  segment risk, Thrilling is the one to get right first.
