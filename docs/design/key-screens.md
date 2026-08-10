# TruTravel — Key Screens & Design Tokens (Himachal × Thrilling / Trippy, First Slice)

**Owner:** P2 (Technocratic UI Designer) · **Ticket:** TKT-009 · **Milestone:** M1
**Status:** Ready for T1 implementation (TKT-010)
**Extends:** `docs/design/ui-principles.md` (TKT-004, locked) — that doc is *principles*, this doc is
the concrete spec against real content. Anything here that conflicts with the principles doc is a
bug in this doc, not a supersession — flag back to P2 if found.

**Built against:**
- `docs/prd/himachal-thrilling.md` (P1, TKT-007) — domain model, states, refund-policy shape, matching
  tag vocabulary, altitude/Captain-Guide split
- `docs/prd/himachal-trippy.md` (P1, TKT-012) — same domain model, Parvati exclusion, `substance_stance`
  exclusion, code-of-conduct/Captain-training mitigation
- `docs/ops/risk-register.md` (A4, TKT-006) — verification-state taxonomy, trust-badge triggers
- `docs/design/brand-voice-principles.md` (G3, TKT-003) — vocabulary banks, CTA grammar, redlines

**Explicitly out of scope here (do not build against this doc for these):**
- Matching *scoring* logic, group-composition preview visualization — P3's TKT-008 has not landed.
  Where this doc needs that content, it reserves the slot and states what's pending (see §6).
- Final microcopy — every string below marked "(draft — G3 to confirm)" is a placeholder pulled
  from G3's vocabulary banks/grammar rules to keep the spec buildable, not final copy.
- Wellness, Couple Getaways, CodeHouses, Music+Art Festivals detailed screens — only their Home
  "coming soon" tile treatment is specified here (§5.1), since no PRD exists for them yet.

---

## 1. Type scale

One family, one scale, everywhere (per ui-principles §2). Recommend a geometric/grotesque sans
with a genuine tabular-figure OpenType feature (`tnum`) — exact font license is T1/G3's call, not
specified here.

Seven steps. No screen invents an eighth.

| Step | Size / line-height | Weight | Letter-spacing | Usage |
|---|---|---|---|---|
| Display | 32 / 40 | 600 | 0 | Segment landing headline only. Rare — most screens never use this step. |
| H1 | 24 / 32 | 600 | 0 | Screen title (Home section header, Trip detail title, booking-flow step title) |
| H2 | 18 / 26 | 600 | 0 | Section header within a screen (e.g. "Trust & policy," "Itinerary") |
| H3 | 16 / 22 | 600 | 0 | Card title, modal title |
| Body | 15 / 22 | 400 | 0 | Primary copy — descriptions, itinerary text, policy summaries |
| Meta | 13 / 18 | 500 | 0.01em | Secondary/supporting text — sub-location, duration, timestamps |
| Micro/Badge | 11 / 14 | 600 | 0.02em, uppercase | State badges, chips, labels — never used for anything except a labeled state or tag |

**Numeral treatment (cross-cutting, not an 8th step):** anywhere a number is decision-grade data —
price, date, seat count, deposit %, refund %, ledger amount — apply `tabular-nums` + weight 600 at
whichever size step the surrounding context uses (usually Body or Meta). This is what makes "6 of 12
seats" or "₹8,400 deposit" read as data, not prose, per ui-principles §2. Do not invent a separate
"Data" type size — it's a feature flag on Body/Meta, not a new step.

---

## 2. Grid & breakpoints

| Breakpoint | Range | Container max-width | Gutter | Trip-card columns | Home segment-tile grid |
|---|---|---|---|---|---|
| Mobile | 0–599px | 100% | 16px | 1 (stacked list) | 2 columns × 3 rows |
| Tablet | 600–1023px | 100% | 24px | 2 | 3 columns × 2 rows |
| Desktop | 1024–1439px | 1120px | 32px | 3 | 3 columns × 2 rows |
| Wide | 1440px+ | 1280px | 32px | 4 | 3 columns × 2 rows |

12-column grid at tablet+; 4-column grid at mobile. Spacing scale (8px base unit): **4, 8, 12, 16,
24, 32, 48, 64px** — 4 is reserved for icon-to-label micro-gaps only, everything else uses the 8px
family.

**Home segment-tile grid is intentionally a fixed 3×2 matrix at ≥600px, and 2×3 at <600px, never a
scroll rail.** This is the concrete implementation of the "Home layout pattern" open item from
ui-principles §7. Reasoning, since this was explicitly undecided at TKT-004:

- **Rejected: rail-per-segment.** A horizontally-scrolling rail structurally implies an order —
  first-visible reads as "primary" even if the underlying array is randomized, and randomizing
  order every load adds engineering complexity to solve a problem the grid avoids for free.
- **Rejected: tabs+grid.** Hiding five of six segments behind a tab click means a user has to take
  an extra action just to *discover* five of the six product lines exist — this contradicts
  ui-principles §3's "same interaction cost to reach" rule for Home specifically.
- **Chosen: grid-of-six.** All six segments are visible with zero taps, in identical-size cells, at
  every breakpoint. A 3×2 matrix (not 6×1 or 1×6) was chosen over a single row/column because a
  single row at wide viewports gets visually thin and a single column at narrow viewports gets too
  tall before the fold — 3×2/2×3 keeps every tile a similar visual weight and keeps the whole
  module close to one screen height.

**Default logged-out order** (fixed, not arbitrary) follows the shared-context §2 canonical list:
Trippy, Thrilling, Wellness, Couple Getaways, CodeHouses, Music+Art Festivals — reading left-to-right,
top-to-bottom in the 3×2 matrix. Personalized reordering for signed-in returning users may change
this order but must preserve identical tile size/shape (ui-principles §6.4) — personalization is a
sort applied *on top of* the equal-weight grid, never a redesign of it.

---

## 3. Segment accent colors

**Locked now (this ticket): Thrilling, Trippy.** The other four are given placeholder values in the
same formula so the Home grid (§5.1) renders coherently today — but those four hues are **not
final** and should be re-confirmed when each segment's own PRD lands, per the same TKT-009→real-content
dependency that unblocked Thrilling/Trippy this round.

### 3.1 Shared formula (the "consistent saturation/lightness" rule from ui-principles §4)

Every segment accent is generated from **the same HSL recipe, hue-only variation** — this is what
guarantees no segment reads as more premium/cheap than another:

- **S = 55%** for every segment, every shade, no exceptions.
- **`-ink` shade, L = 32%** — used for text/icon color on light surfaces (chip label, icon fill on
  white). This is the only shade contrast-checked against white text-background use.
- **`-mid` shade, L = 48%** — used for decorative, non-text elements only (card edge line, filter
  legend swatch). Target ≥3:1 vs. white per WCAG non-text contrast guidance, not required to hit
  4.5:1 since it never carries text.
- **`-tint` shade, L = 93%** — used as chip/tag background fill, always paired with the `-ink` shade
  for its label text/icon (never `-ink` text on white directly inside a filled chip — always on
  `-tint`).

**Never a full-bleed background wash at any shade** — accents are chip fills, thin edges, icon fills,
underlines only, per ui-principles §4.1. This also means accent color is never load-bearing for body
text color; body copy stays neutral ink/gray regardless of segment.

### 3.2 Finalized: Thrilling Tours

| Shade | Hue | Hex | Contrast vs. white |
|---|---|---|---|
| `thrilling-ink` | 25° | `#7E4A25` | **7.3:1** — passes AA and AAA for normal text |
| `thrilling-mid` | 25° | `#BE6F37` | ~3.9:1 non-text use only |
| `thrilling-tint` | 25° | `#F7ECE3` | — (background fill only) |

A warm burnt-orange/terracotta, not a hazard-red. Reads as energy/competence rather than the
"danger" register that a truer red would risk (and a true red is reserved as a system state color —
see §6.1, don't collide with it).

### 3.3 Finalized: Trippy Tours

| Shade | Hue | Hex | Contrast vs. white |
|---|---|---|---|
| `trippy-ink` | 165° | `#257E68` | **4.9:1** — passes AA for normal text |
| `trippy-mid` | 165° | `#37BE9C` | ~3.2:1 non-text use only |
| `trippy-tint` | 165° | `#E3F7F2` | — (background fill only) |

**Deliberate choice, stated explicitly:** hue 165° is a teal-leaning green, not a true leaf-green
(120–140°). This is intentional and directly tied to A4/G3's redline that Trippy must never read as
drug-marketplace-adjacent — a literal leaf-green accent risks an unintended cannabis-culture visual
association given the segment's actual risk profile (`docs/ops/risk-register.md` §4). Teal reads
"grounded/calm" (matches G3's vocabulary: grounded, unplugged, present) without the leaf connotation.
See §7.3 for the same reasoning applied to the icon motif.

**Contrast math note:** computed via the standard HSL→sRGB→relative-luminance/WCAG-contrast formula
in this session (no live contrast-checker tool available here). T1 should run these hex values
through an automated a11y check (axe, Stark, or browser devtools contrast checker) as a final gate
before ship — treat the ratios above as P2's calculated estimate, not a substitute for that check.

### 3.4 Placeholder (not final) — Wellness, Couple Getaways, CodeHouses, Festivals

Same formula (S=55%, ink L=32% / mid L=48% / tint L=93%), hue-only placeholders so Home renders
consistently:

| Segment | Hue (placeholder) | `-ink` hex (placeholder) |
|---|---|---|
| Wellness Tours | 205° | `#25587E` |
| Couple Getaways | 300° | `#7E257C` |
| CodeHouses | 245° | `#38257E` |
| Music + Art Festivals | 340° | `#7E2545` |

**Do not treat these as locked.** Re-derive/confirm against each segment's own PRD content and G3's
tone dial when that ticket lands — the formula (§3.1) is locked, the specific hue assignment per
segment is not, for these four.

### 3.5 Known adjacency risk — segment hue vs. system state hue

Two segment hues sit fairly close to a system semantic-state hue (§6.1): Thrilling's 25° is ~15°
from the Warning/amber state color (~40°), and Trippy's 165° is ~20° from the Verified/green state
color (~145°). At this S/L recipe this is a real but *secondary* risk — because ui-principles §6.5
already forbids color-only state encoding, every segment chip and every state badge carries a label
and a distinct icon shape regardless of hue, so hue proximity alone can't cause a misread. Two
structural mitigations beyond that baseline:

1. **Segment chips and state badges never sit immediately adjacent** in any component spec below —
   there's always a label, spacing, or a different chip shape (segment chip = rounded pill;
   state badge = square-cornered tag) between them.
2. If T1's implementation surfaces real user confusion in testing, nudge the segment hue (not the
   state hue — state colors are shared infrastructure across all six segments and shouldn't move for
   one segment's sake) and re-run the contrast check in §3.2/§3.3.

---

## 4. Component spec — Trip card (Thrilling & Trippy)

One card anatomy, same slots, same order, in both segments — restyled only by the segment token
(§3), never re-architected (ui-principles §3, §4 rejected-approach). This card renders 1-up (mobile)
through 4-up (wide) per §2's column counts; the anatomy below is per-card, independent of column
count.

**Fixed aspect ratio content-frame:** 4:3, real terrain/group photography (not stock/generic —
see §7.1 anti-pattern notes), same crop/caption module across both segments.

| # | Slot | Content | Type/treatment |
|---|---|---|---|
| 1 | Content-frame | Trip photo | 4:3, real content |
| 2 | Segment chip | Accent + icon + segment name, fixed top-left over image | Micro/Badge, `-ink` text on `-tint` fill |
| 3 | Trip title | e.g. "Bir Paragliding — Tandem + Solo Progression" / "Old Manali Slow Circuit" (draft — G3 to confirm titles) | H3 |
| 4 | Location/duration meta | e.g. "Bir · 1 day" / "Manali · 4 days" | Meta, tabular-nums for numerals |
| 5 | Price/date block | Price band + next open Departure date | Body, tabular-nums |
| 6 | Departure state badge | `Open / Filling / Waitlist / Locked / Cancelled` (P2 §1.3 / PRD §3, unchanged) | Micro/Badge, label + icon + color, never color-only |
| 7 | **Trust strip row (mandatory, not optional — grid contract per ui-principles §3)** | See below | — |
| 8 | CTA | Verb + concrete object, pulled from G3 grammar (§2.1 rule 4) | H3-weight button label |

**Slot 7 — Trust strip row, segment-conditional content, same position/weight in both segments:**

- **Thrilling:** Anchor Operator verification badge (icon+label, e.g. "Verified Operator") · Guide
  certification chip (e.g. "Guide certified — Grade III") · seat fill-state ("6 of 12 confirmed",
  tabular-nums)
- **Trippy:** Anchor Operator verification badge (same badge system) · Captain identity + training
  chip (e.g. "Captain trained · Code of Conduct") · seat fill-state ("4 of 10 confirmed",
  tabular-nums)

This row never collapses under space pressure — if a card genuinely can't fit all three elements at
the narrowest breakpoint, the fix is to allow the row to wrap to two lines within the card, never to
drop one of the three elements (ui-principles §1.4, §5.1).

**Slot 8 CTA — draft strings, G3 to confirm:**
- Thrilling: **"See the route"** (route is in G3's Thrilling vocabulary bank)
- Trippy: **"See the gathering"** (gathering is in G3's Trippy vocabulary bank)

Both follow the brand grammar's verb+concrete-object rule (G3 §2.1 rule 4) and are drawn directly
from each segment's vocabulary bank — flagged as draft per this ticket's scope boundary (P2 pulls
labels, doesn't invent voice).

---

## 5. Home screen

### 5.1 Six-segment module

3×2 (≥600px) / 2×3 (<600px) fixed grid, per §2. Every tile identical footprint, identical internal
anatomy, regardless of whether the segment has live content:

| Element | Live segments (Thrilling, Trippy) | Pending segments (Wellness, Couple Getaways, CodeHouses, Festivals) |
|---|---|---|
| Accent + icon + segment name | Full-strength, same as everywhere else | **Full-strength, identical treatment — never grayed out, desaturated, or reduced-opacity.** Graying out a pending segment would visually demote it relative to the live two, directly violating ui-principles §6.4 ("no segment visually winning"). |
| One-line JTBD subhead | G3's segment copy (draft — G3 to confirm per-corridor line) | G3's segment copy, same treatment |
| Stat row | Real, live number pulled from catalog, tabular-nums — e.g. **"2 departures open · Manali + Bir"** (draft — G3 to confirm exact phrasing; number must be live, not hardcoded, per G3's "no manufactured urgency, real numbers only" rule) | Replaced with a functional, non-demoting status line — e.g. **"Coming to Himachal — get notified"** (draft — G3 to confirm). Not "Coming soon" alone with no action — per brand grammar CTA rule, pair status with a concrete next action. |
| CTA | "Explore [segment]" → segment landing page (draft) | "Get notified" → waitlist capture, **not a dead end and not disabled** — tile remains fully tappable, leads to a real (if content-light) segment landing page in its "coming soon" state, per §5.2 below |

**Explicit anti-pattern check:** this tile pattern is the direct implementation of ui-principles
§6.4 (no segment visually winning) applied to a real asymmetric-content situation — two segments
have real data, four don't, and the tile system still guarantees equal size, equal position weight,
equal visual strength, equal reach (zero extra taps for any of the six). Only the *content* inside
the tile differs (a stat vs. a waitlist prompt), never the *frame*.

### 5.2 Segment landing page state for pending segments

Since the "coming soon" tile is tappable (equal reach requirement), it must lead somewhere real, not
a broken link or a modal apology. Minimum viable landing state for a pending segment: segment
header (accent+icon+name, same H1 treatment as a live segment landing page), one-line JTBD copy,
waitlist/notify capture form, no trip-card grid (none exists yet) replaced by a single bounded
content block explaining what's coming — not a fake/mocked trip card grid, which would misrepresent
inventory that doesn't exist (a G3 grammar violation: "every persuasive claim sits next to a
verifiable fact").

---

## 6. Trust badge iconography & verification-state taxonomy

Scope note per this ticket: P3's TKT-008 (matching v0 rubric) has not landed as of this writing. This
section specs everything that's fully unblocked — operator/guide/captain verification, all
platform-wide state sets, and seat fill-state — and explicitly marks the group-composition
*preview* (beyond raw fill-state) as **pending P3**, reserving its slot without designing its
visualization.

### 6.1 System state colors — separate palette from segment accents

State colors are **shared infrastructure, not segment-owned**, and must never reuse a segment hue
(see §3.5's adjacency note — this is why they're specified as a separate fixed palette rather than
derived per-segment):

| State family | Hue | `-ink` hex | Icon shape |
|---|---|---|---|
| Success / Verified / Confirmed / Open | ~145° | `#1E7A4E` | Filled shield + check |
| Warning / Under review / Filling / Pending | ~40° | `#8A5A00` | Half-filled shield / hourglass |
| Danger / Suspended / Cancelled / Failed | ~5° | `#8A2A1E` | Outline shield + X / stop-octagon |
| Neutral / Unverified / Locked / Waitlist | 0% sat (gray) | `#5A5A5A` | Hollow/outline shield |

Same S/L discipline as §3.1 applies here too (fixed recipe, hue signals meaning) — but this is a
**distinct token set from the six segment accents**, used only for state badges, never for segment
identity, and vice versa (ui-principles §4: "dashboards/matching panels stay in neutral system
chrome").

### 6.2 Operator verification state (A4 risk register §1–§2; ui-principles §1.3)

`Unverified / Under review / Verified / Suspended`

- **Unverified / Under review** are primarily **partner-dashboard-facing**, not traveler-facing —
  per the PRDs, no live bookable Trip should exist for an operator below "Verified," so a traveler
  browsing the catalog should essentially never see these two states attached to a bookable Trip.
  They still need full visual specs for the partner dashboard (operator's own view of their status,
  ui-principles §5's "symmetric" trust requirement) and for internal ops tooling.
- **Verified** is the only state a traveler sees on a live Trip card/detail — rendered as: Success
  icon + "Verified Operator" label (Micro/Badge), always paired with the operator name.
- **Suspended** — if an operator is suspended mid-catalog-life, associated Trips must be pulled from
  the live catalog (a T1/T3 data concern, not a P2 rendering concern), so "Suspended" should rarely
  if ever render on a traveler-facing surface either — it's a dashboard/ops state.

### 6.3 Guide certification (Thrilling-specific credential, not a binary state)

Not a state toggle — a factual credential slot, always populated when a Guide is assigned (PRD §6):
icon (certificate/badge glyph, distinct from the shield family used for verification states) +
short cert reference, e.g. **"Guide certified — Grade III"** (draft — G3/A4 to confirm exact cert
naming convention against real Anchor Operator credentials). Rendered in the trust strip on both
card (compact) and detail (full) views.

### 6.4 Captain identity + training-status (both segments, Trippy-specific training gate per PRD §6)

- **Both segments:** Captain identity badge — name, photo, basic identity-verification checkmark
  (government-ID tier per A4 §1) — this is the same identity-verification system used platform-wide,
  not a segment-specific mechanism.
- **Trippy-specific addition:** code-of-conduct training-completion status. Since an untrained
  Captain shouldn't be assigned to a live Departure per the PRD, this is effectively a **binary,
  positive-only traveler-facing signal** — when true: "Captain trained · Code of Conduct" chip
  (draft copy); when a Captain hasn't completed training, they simply shouldn't appear on a live
  Departure at all (no "untrained" badge needs to exist on a traveler-facing surface — that's an
  ops/dashboard-only state, same logic as §6.2's Unverified/Under review).

### 6.5 Seat / fill-state (both segments, PRD §3 — unchanged from ui-principles)

`Pending / Confirmed / Refund pending / Refunded / Cancelled` — standard state badge treatment.

**PRD-flagged nuance (Thrilling §8.3, applies identically to Trippy's mirrored refund shape):**
operator-initiated cancellation (weather abort, permit issue, min-group-size) must be
*structurally* distinguishable from traveler-initiated cancellation in the data/reporting layer,
even though the traveler-facing **badge** can stay the same ("Refunded"). P2's recommendation
(non-mandatory UX nicety, not a new badge/color): show a one-line explanatory sub-label under the
badge sourced from the reason code, e.g. "Refunded — trip cancelled by operator" vs. "Refunded —
cancelled by you." This satisfies the PRD's distinguishability requirement without inventing a new
visual state family. Flag to T2/T3 for the underlying reason-code field.

### 6.6 Group fill-state (specced now) vs. composition preview (pending P3)

- **Specced now — fill-state:** "X of Y seats confirmed," tabular-nums, appears in the trust strip
  on both card and detail views (slot 7/§4, and detail §7 below). This is a simple count, no
  matching logic involved, fully unblocked.
- **Pending P3 — composition preview:** G3's content-ritual doc (§4.4) names a "group-composition
  preview ritual" (aggregated, privacy-respecting preview of who's coming) as a target format, and
  ui-principles §5 requires composition *signal* (beyond raw headcount) to be visible before
  commitment. **P3's TKT-008 has not landed**, so this doc reserves the slot and states the
  constraint without designing the visualization:
  - **Reserved location:** immediately below the fill-state count, inside the trust strip, on the
    Trip detail screen only (not the compact card — card stays fill-state-only per §4's card
    density budget).
  - **Known constraints for whatever P3 designs:** must never expose individually-identifying
    traveler data (privacy-respecting aggregate only, per G3 §4.4's own framing); for Trippy, must
    never reconstruct a `substance_stance`-equivalent signal even indirectly (PRD §6 — explicit
    instruction to P3, not P2's call to soften); format (bar/tag-cloud/summary sentence/etc.) is
    P3's to propose since it depends on what the scoring rubric actually outputs.
  - **Coordination note to P3 (TKT-008):** please confirm back to P2 once the rubric's user-facing
    output shape is decided, so this reserved slot's actual visual treatment can be specced in a
    follow-up pass — this doc intentionally does not guess at it.

### 6.7 "Your profile vs. this trip" comparison module — specced now (not a P3 dependency)

Distinct from the matching/composition preview above: a simple, non-algorithmic **factual
side-by-side** of the traveler's self-declared tags against the Trip's stated requirements, using
only fields already defined in the PRDs (not P3's scoring output):

- **Thrilling:** `skill_level`, `fitness_level` (self-declared) vs. the Trip's stated requirement —
  e.g. a two-column or two-row layout: "Your skill level: Intermediate" / "This trip needs:
  Intermediate–Advanced." No score, no color-coded "match %" — just the two facts placed adjacent,
  consistent with ui-principles §1.1 ("hierarchy legible in a screenshot with no color") and G3's
  "state things as they are" rule.
- **Trippy:** `pace_preference`, `group_size_pref` (self-declared) vs. the Trip's stated
  `pace_preference`/`group_size_pref`, same side-by-side treatment.

This is safe to spec now because it's descriptive, not a ranking/score — it becomes a *scored* match
panel only if/when P3's rubric defines that, which is out of scope here.

---

## 7. Segment landing pages (Thrilling, Trippy)

Same template, restyled by segment token — not a redesign per segment (ui-principles §3, §4).

**Structure (both segments, identical order):**
1. H1 segment name + accent chip
2. One-line JTBD subhead (bounded content zone, G3 copy — draft, to be confirmed)
3. Sub-location filter row — **data-driven off actually-live `sub_location` values, not a
   hardcoded chip list.** For Thrilling this naturally renders `manali` and `bir` only (Kasol/Tosh
   simply isn't in the live enum for September, PRD §2). For Trippy this naturally renders `manali`
   and `bir` only as well — `kasol_parvati` exists in the domain enum (PRD §3) but is hard-blocked
   at Trip-creation, so no Trip ever carries that value and the filter never surfaces it. **This is
   the correct implementation pattern specifically because it requires no special-case "hide this
   one chip" logic** — T1 should not build a Parvati-specific UI suppression rule; the absence falls
   out naturally from there being no live data, which is more robust than a rule someone could
   forget to apply consistently.
4. Trust/matching-tag filter row — plain text labels (not icon-only), per state-labeling rule:
   Thrilling: skill level, fitness level, activity type. Trippy: pace preference, group size
   preference.
5. Trip card grid (§4 anatomy), using the breakpoint column counts in §2.
6. Hero content-frame: bounded, same module size as any other segment would get — **no full-bleed
   hero image larger than the standard content-frame module**, even though real photography now
   exists for both. Applying extra visual real estate here because content happens to be ready
   would itself be a §6.4 violation (no segment gets a bigger hero than another by default).

**Anti-cliché notes (both explicitly required by this ticket):**
- **Thrilling:** no "epic summit silhouette at golden hour" default hero. Photography should show
  real terrain/activity content (per ui-principles §6.1's "real thing over decoration" rule) —
  actual route/trail imagery, actual paragliding-launch content, not stock adventure-brand imagery.
- **Trippy:** no "hazy golden-hour festival-lounge crowd" or generic backpacker-flatlay hero. Real
  group/location photography (Old Manali café culture, Bir's unhurried village character per PRD
  §2), never imagery that could be read as substance-culture-coded (no smoke/haze effects, no
  imagery implying an unsupervised gathering) — this is a direct extension of the redline in
  G3 §3.1 and A4 §4 into the imagery layer, which those docs don't cover but this one must.

---

## 8. Trip detail screen

Above-the-fold order is fixed (this order is itself a hierarchy decision, per ui-principles §1.1 —
not left to per-screen judgment):

1. **Header:** Trip title, segment chip, sub-location breadcrumb (e.g. "Himachal Adventure Belt ›
   Bir")
2. **Hero content-frame** — bounded gallery module, same size regardless of segment (§7's anti-cliché
   rule applies here too)
3. **Price/date + Departure state badge** — same visual layer of attention as step 4, not
   subordinate to it (ui-principles §1.3/§5)
4. **Trust strip — guaranteed slot, non-collapsed, structurally reserved above the fold** (the grid
   contract from ui-principles §3). Contains, in this fixed sub-order:
   - Anchor Operator verification badge + operator name + tier (T1/T2/T3 per A2's model)
   - Guide certification (Thrilling) **or** Captain identity + training-status (Trippy) — the row
     is segment-conditional in content but occupies the identical slot position/weight in both
   - Group fill-state ("X of Y confirmed," tabular-nums) + reserved composition-preview slot
     (§6.6, pending P3)
   - **Policy summary** — deposit %, refund-window tiers (preview, e.g. "up to 7 days: 80% of
     balance refunded"), and the weather-abort/operator-cancellation exception stated explicitly
     as distinct from traveler-cancellation (PRD §8.3) — expand-to-full-detail affordance present,
     but the summary itself is never collapsed by default (ui-principles §5, §6.3)
5. **"Your profile vs. this trip" comparison module** (§6.7) — descriptive, not a score
6. Below the fold: full itinerary, full policy/legal detail (expand target from step 4), Guide/
   Captain bio, code of conduct (Trippy — full text, linked from the policy summary), emergency/
   safety info block
7. **Persistent CTA:** **"Reserve your seat"** (pulled verbatim from G3 §2.1 rule 4's own example —
   this is about as close to "confirmed final copy" as this doc gets, since G3 used it as their own
   worked example)

**Altitude/insurance module — conditionally absent, not conditionally hidden:** since the September
catalog is `altitude_tier: standard` only (Thrilling PRD §7), no live Trip should ever need the
high-altitude insurance-proof module at launch. Don't build a "hidden unless needed" toggle for it
now — build the trust-strip and detail template to be extensible so a future `high_altitude` Trip
can add that module into the same guaranteed-slot region without a redesign, per the PRD's own
framing of this as a fast-follow, not a permanent absence.

---

## 9. Booking flow

Reflects the split-deposit/tiered-refund shape from Thrilling PRD §8 (Trippy PRD §8 mirrors it
structurally, pending A2's numbers). Steps are explicit, labeled, and shown as a stated progress
sequence (never dots-only — ui-principles §1.3 "explicit states, always" applies to flow position
too).

| Step | Content | Notes |
|---|---|---|
| 1. Self-declaration | Thrilling: skill level, fitness level. Trippy: pace preference, group-size preference, noise/energy. Only shown if not already on file per PRD's "declare once" requirement. | Uses the same tag vocabulary as §6.7's comparison module — this step is what populates that module for future bookings. |
| 2. Safety basics | Emergency contact, medical disclosure, waiver acknowledgment. **Not** an 18+ prompt — that's a platform-wide signup-time hard gate (A4 §1), never re-asked per booking. | All A4 §1 must-haves; identical fields regardless of segment. |
| 3. Policy review | Full deposit %, refund-tier table, and the weather-abort/operator-cancellation exception, shown as structured content (not a ToS link-out) — explicit checkbox acknowledgment required before proceeding (state: unacknowledged/acknowledged, labeled) | Same content as the detail screen's policy summary, expanded to full detail — no new numbers invented here. |
| 4. Payment | Two distinct line items shown: non-refundable deposit + refundable balance (per PRD §8's split-ledger-line requirement) — surfaced to the *traveler* as two clear amounts, not just to the ledger. UPI as a first-class, prominent payment option (A4 §8 payment-rail note). | P2 doesn't design the payment-processor integration itself — only that the UI must show the two-line split, not a single blended total. |
| 5. Confirmation | Booking/Seat state renders as `Pending` → `Confirmed`; "what happens next" summary; Captain intro placeholder (content itself is G1/G3's ritual work, not designed here) | State badge same treatment as everywhere else in the system. |

**Persistent trust visibility through the funnel:** every step above carries a compact order-summary
region (sidebar on desktop, sticky footer on mobile) showing price/dates + a mini trust strip
(operator verification badge, minimum) — trust doesn't disappear once a user enters the booking flow
just because the detail screen isn't visible anymore (direct extension of ui-principles §1.4/§5 into
a multi-step flow, which the principles doc didn't explicitly cover).

---

## 10. Icon motif direction (concept-level; final glyph files are implementation)

Functional wayfinding glyphs, not mood illustration (ui-principles §4.2):

- **Thrilling (locked direction):** a route/zigzag-path glyph — reinforces "route, difficulty grade,
  skill level" (G3 vocabulary), not a generic flame/lightning-bolt adrenaline cliché.
- **Trippy (locked direction):** an open-circle / pathway-dot glyph — reinforces "circle, gathering,
  shared journey" (G3 vocabulary). **Explicitly not a leaf, not a peace-sign, not a flame** — same
  reasoning as the hue choice in §3.3: sidesteps unintended substance-culture visual coding.
- **Wellness / Couple Getaways / CodeHouses / Festivals:** not specced here (no PRD content yet).
  One placeholder note each so a future pass isn't starting from zero: Wellness should avoid an
  overused lotus/om-symbol default; Couples should avoid a heart icon (direct dating-app collision
  with G3's redline); CodeHouses and Festivals have no strong anti-pattern flag yet, TBD when those
  PRDs land.

---

## 11. Explicit compliance notes — anti-patterns and the Kasol/Parvati exclusion

Restating deliberately, per this ticket's instructions, rather than assuming it's implicit:

1. **No generic wanderlust hero imagery on either segment landing page** (§7) — real terrain/group
   content only, bounded to the standard content-frame module.
2. **No segment visually winning** — the Home tile system (§5.1) keeps all six tiles identical in
   size/position/strength even though only two have live content; the "coming soon" four are never
   grayed out or reduced in visual weight.
3. **No color-only state encoding anywhere in this spec** — every state badge (§6.1–§6.5) is
   icon+label+color, and segment chips are icon+label+color, satisfying ui-principles §6.5 in every
   component above.
4. **No trust content behind an extra tap** — the trust strip (§4 slot 7, §8 step 4) is
   non-collapsed by default everywhere it appears, including through the booking flow (§9).
5. **Kasol/Parvati exclusion — handled as a *data absence*, not a UI suppression rule, and treated
   as a categorically different case from the four "pending" Home segments:**
   - The four pending Home segments (Wellness, Couples, CodeHouses, Festivals) get a **positive,
     discoverable "coming soon" treatment** (§5.1–5.2) — because their absence is a build-sequencing
     fact, not a risk exclusion, and equal-reach still applies to them.
   - **Kasol/Parvati is not a "coming soon" case.** It is a live legal-risk exclusion (A4 §4, PRD
     §2). It gets **no UI surface at all** — no grayed-out chip, no "coming soon to Kasol" tile, no
     map pin, nothing that could read as TruTravel signaling intent to bring Trippy content there.
     The sub-location filter (§7.3) achieves this correctly by construction (data-driven off live
     Trips, and no Trip can exist with that `sub_location` per the PRD's hard-block), not by a
     manual UI rule someone has to remember — flagged explicitly so T1 doesn't accidentally build a
     "friendly placeholder" for Parvati by analogy with the Home pattern, which would be the wrong
     move for a legal-risk exclusion.
   - This distinction (pending-content vs. risk-exclusion) is the single most important thing in
     this document for T1 to get right — the two look superficially similar ("a location/segment
     that isn't bookable yet") but require opposite UI treatments.

---

## 12. Handoff

- **To T1 (TKT-010):** this doc is written to be implementable without re-briefing P2 — every
  component has slots, states, sizes, and hex values. Draft copy is marked as such; treat those
  strings as placeholders that compile/render correctly but should be swapped for G3-confirmed
  final copy before ship, not blocked on. Run the §3.2/§3.3 contrast values through an automated
  a11y checker as a final gate. Build the sub-location filter (§7.3) as data-driven, not
  hardcoded — this is both the correct Parvati-exclusion mechanism and the correct pattern for
  Kasol/Tosh's fast-follow-possible status on the Thrilling side (PRD §2's "flag back to P1 if cheap
  supply exists" note) without a code change.
- **To P3 (TKT-008, in progress):** §6.6 reserves the group-composition-preview slot on the Trip
  detail trust strip and states the known constraints (privacy-respecting aggregate,
  `substance_stance`-safe for Trippy). Please confirm the rubric's user-facing output shape back to
  P2 so that slot's actual visualization can be specced in a follow-up pass — this doc does not
  guess at bar/tag/summary format since it depends on what you're scoring.
- **To G3:** every string in this doc marked "(draft — G3 to confirm)" is pulled from your
  vocabulary banks/grammar rules (brand-voice-principles.md §2.1, §3.1, §3.2), not invented — please
  review §4 (CTAs), §5.1 (Home tile copy), §7 (JTBD subheads), §8 (policy summary framing) for tone
  fit and finalize.
- **To WM1:** TKT-009 deliverable is complete against its definition of done — segment tokens for
  Thrilling/Trippy finalized and accessibility-checked, type scale and grid breakpoints finalized,
  Home layout pattern selected and justified, all named key screens specced, trust-badge/
  verification taxonomy complete, group-composition-preview explicitly flagged pending P3 (not
  silently designed around), Kasol/Parvati exclusion given an explicit and structurally-sound
  treatment distinct from the "pending segment" pattern. No blockers on P2's side for T1 to begin
  TKT-010.
