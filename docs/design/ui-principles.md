# TruTravel — UI Design Principles (Locked v1.0)

**Owner:** P2 (Technocratic UI Designer) · **Ticket:** TKT-004 · **Milestone:** M0
**Status:** Proposed for lock — pairs with G3's `docs/design/brand-voice-principles.md` (TKT-003)
to form the M0 "brand/UI principles lock." WM1 marks the milestone gate closed once both land
coherently.

**Scope note:** This document sets *principles* — the rules a designer or engineer applies when
building any screen. It does not build screens. Key screens and full component specs are TKT-009,
which is blocked on the first-slice PRD (TKT-007, P1) because layout decisions need a real
corridor × segment to be concrete rather than speculative. Anything here that looks like a
component sketch is illustrative only, not a locked spec.

**Boundary with G3 (TKT-003):** P2 owns visual system — layout, hierarchy, color/type/grid,
iconography, motion, information density. G3 owns voice, tone, microcopy, and content rituals.
Where the two meet (e.g., how a trust badge's *label text* reads vs. how it's *visually
positioned*), G3 owns the words and P2 owns the placement/weight. This doc does not prescribe
copy.

---

## 1. Core stance: systems over vibes

TruTravel is not a mood board. It's a marketplace with money, safety, and group composition on
the line, wrapped in a product that six very different traveler types need to trust *and* enjoy.
The UI has to hold both. Concretely, this means:

1. **Hierarchy is explicit, not implied by decoration.** Every screen has a stated primary action,
   a stated secondary action, and everything else is reference information. We do not use size,
   color, or imagery alone to imply importance — we use a consistent hierarchy system (type scale
   + spacing + placement) so hierarchy is legible even in a screenshot with no color.
2. **Data density without clutter.** TruTravel screens carry real decision-grade information —
   price bands, seat counts, verification status, group composition, dates, cancellation terms.
   The instinct to "simplify" by hiding this is wrong for this product; the instinct to dump it
   all in undifferentiated blocks is also wrong. Density is managed through **progressive
   disclosure with a stable default view**, not by deletion: a card shows the 5–7 facts a user
   needs to decide "worth a closer look," a detail view shows everything, nothing is hidden behind
   a hover-only affordance on mobile-first surfaces.
3. **Explicit states, always.** Every stateful object in the product (a trip, a seat, a booking, a
   partner, a payment, a match) has a finite, named state set, and the UI renders the *current
   state as a labeled, visually distinct element* — never inferred from absence of information or
   from color alone (color is a reinforcement, not the sole encoding, for accessibility). Examples
   of state sets that must always be visible where relevant: trip departure state (Open /
   Filling / Waitlist / Locked / Cancelled), booking state (Pending / Confirmed / Refund pending /
   Refunded), operator verification state (Unverified / Under review / Verified / Suspended),
   payment state (Authorized / Captured / Failed / Refunded).
4. **Trust surfaces are first-class, never buried.** Verification status, group composition, and
   policies (cancellation, refund, safety, code-of-conduct where segment-relevant) are rendered
   in the **same layer of attention as price and dates** — not in a collapsed accordion, not in a
   separate "About" tab reached by a secondary nav, not in footer-weight type. If a design pass
   trims a screen for space and the first thing cut is a trust element, that's the wrong cut.
   Concretely: trust elements appear on the trip card itself (compact form) and are structurally
   guaranteed a slot above the fold on any detail screen — not competing for space with marketing
   imagery.
5. **Community is instrumental, not a social feed.** Community/social surfaces (captain profiles,
   group chat, past-trip stories) exist to *support the booking decision and the trip experience*,
   never as an open-ended feed competing for attention with core marketplace tasks. Visually, this
   means community content is scoped to context (a specific trip, a specific segment) rather than
   given its own top-level infinite-scroll surface.

---

## 2. Typography — direction (not final spec)

Final ramp values land in TKT-009 once real screens exist, but the direction is locked:

- **One typeface family, systematic weight/size scale — not per-segment fonts.** Segment identity
  is carried by color, iconography, and motif (§4), never by swapping typefaces. A different font
  per segment would fragment the system and undermine "one product, six product lines."
- **A small, disciplined scale** (target: ~6–7 steps covering display/H1 down to caption/label),
  reused everywhere. No screen invents a one-off size. This is what makes density legible: users
  learn the scale once and can scan any screen fast.
- **Numerals and state labels get a distinct treatment** (e.g., tabular figures for prices/dates/
  seat counts, a consistent label/badge type style for states) so the "decision-grade data" reads
  as data, not as prose. This directly supports density-without-clutter — numbers should look
  like numbers, not like flavor text.
- **Line length and weight favor scan-ability over editorial elegance.** This is a product for
  fast comparison decisions (which of six segments, which of N departures), not a long-form
  reading experience. Body copy stays short; when G3's voice needs room to breathe (segment
  storytelling, captain notes), it gets a clearly bounded content zone rather than stretching
  core UI type.

## 3. Grid — direction (not final spec)

- **One responsive grid system, shared across all six segments.** Segment pages are not
  redesigns of the layout system — they are the same grid, same card system, same list/detail
  patterns, restyled with segment tokens (§4). This is what "equal structural weight" (§5)
  actually enforces: if every segment sits on the same grid with the same slot sizes, none can be
  visually favored by getting a bigger hero or an extra module.
- **Card-based density as the default unit.** Trips, matches, partners, and captains are all
  represented as cards in list contexts and expand to a structured detail layout on drill-in. The
  card grid adapts column count by breakpoint but not card anatomy — a trip card has the same
  slots (image, title, segment token, price/date, seat state, trust strip) whether it's 1-up on
  mobile or 4-up on desktop.
- **A fixed "trust strip" slot is part of the grid contract, not an optional module.** Any
  component spec that includes a trip, operator, or booking entity reserves grid space for
  verification + composition + policy signaling as a non-optional row/region, so future component
  authors (T1, TKT-009) can't accidentally spec it away under space pressure.
- **Home's grid gives all six segments identical module footprint.** Whatever the Home layout
  turns out to be at TKT-009 (rail, grid-of-six, tabs+grid, etc.), the principle is: same size
  slot, same position weight (no segment defaults to "above the fold, larger" while another is
  "below the fold, smaller"), same interaction cost to reach. Order may need to be
  personalized/rotated for a signed-in user, but the *default, logged-out order and sizing* is
  structurally equal across all six.

---

## 4. Segment visual tokens — direction

The six segments need to feel distinct enough that a user instantly knows which world they're in,
while staying unmistakably "TruTravel" — one system, six accents, not six sub-brands.

**Token approach (locked direction, values to be finalized against real content in TKT-009):**

Each segment gets a **token triad**, applied consistently wherever segment identity needs to
surface (segment tag/chip, card accent, section header, iconography):

1. **A segment accent color** — one distinct hue per segment, drawn from a shared,
   accessibility-checked palette (consistent saturation/lightness range so no segment reads as
   "premium" or "budget" relative to another — a known cliché risk, see §6). Accent color is used
   sparingly: a tag/chip, a thin card edge or icon fill, a header underline — never a full-bleed
   background wash that would compete with photography or reduce text contrast.
2. **A segment iconographic motif** — one consistent glyph/icon family member per segment, used
   in the segment chip, filters, and nav — not decorative illustration. Icons should read as
   functional wayfinding (like a metro line color+icon system), not as mood illustration.
3. **A segment content frame, not a segment "vibe."** Photography/imagery style is guided by
   segment reality (§6 — e.g., Thrilling can show real terrain/activity shots, CodeHouses can
   show real workspaces) but is cropped, sized, and captioned using the *same* image module across
   all segments. The system prevents one segment's photography budget/style from making its cards
   visually heavier than another's.

**Where this shows up (illustrative, not final):**
- Home: six equal-weight segment entry modules, each carrying its accent + icon + label.
- Trip card: a compact segment chip (accent + icon + segment name) in a fixed position — same
  position across all six.
- Filters/nav: segment selector uses the same six accents/icons as a legend, reinforcing that
  they are peer categories, not a hierarchy.
- Matching panel, partner dashboard: segment token appears as metadata tagging (e.g., "this
  operator runs Wellness + CodeHouses"), never restyling the whole surface — dashboards and
  matching panels stay in neutral system chrome so operators/ops staff working across segments
  aren't visually context-switching every screen.

**Explicitly rejected approach:** per-segment sub-themes (different layout, different type scale,
different card anatomy per segment). Rejected because it (a) breaks "equal structural weight" by
making comparison across segments harder, (b) multiplies design/engineering surface area, and
(c) risks exactly the sub-brand fragmentation the shared context warns against.

---

## 5. Trust / verification surface — principles

Trust content (verification, group composition, policies) is not a "detail page feature." It's a
system-wide contract:

- **Verification status is always rendered as a labeled state, in the same visual layer as price
  and date**, on both card and detail views. Never a mystery checkmark with no label — the label
  itself (copy) is G3's, but the guarantee that a label-bearing element exists and is positioned
  prominently is P2's.
- **Group composition is surfaced before commitment, not after booking.** Any trip/matching
  surface where a user is deciding whether to join a group must show composition signal (e.g.,
  group size, fill state, and whatever composition signal the matching system — P3, TKT-008 —
  defines as user-facing) in the same view as the CTA to join/book, not one tap deeper.
- **Policies (cancellation, refund, safety/code-of-conduct where segment-relevant) get a
  guaranteed, non-collapsed summary slot on the booking-relevant screen**, with an expand-to-full
  affordance for the legal-grade detail. "Guaranteed slot" means: even a dense, data-forward trip
  detail screen budgets space for a policy summary — it does not get cut when the layout is tight.
- **Partner/operator trust signals (Anchor Operator tier, verification, track record) appear
  wherever an operator is represented** — trip card, trip detail, partner dashboard header — using
  the same badge system so a user or ops reviewer never has to hunt across surfaces to find out
  who they're dealing with.
- **This applies symmetrically to the partner dashboard.** Operators should see their own
  verification/standing status with the same first-class prominence a traveler sees it — this is
  a trust *relationship*, not a one-way disclosure to consumers only.

---

## 6. Explicit anti-patterns

These are deliberate rejections, stated so future designers/engineers don't reintroduce them.

1. **No generic wanderlust cliches by default** — no default-state hero imagery of "sunset over
   infinity pool," no stock "passport and camera flatlay," no italic script overlay type, no
   full-bleed motivational travel-quote treatments. This product is decision-support for a
   marketplace with real trust stakes, not a mood board; imagery that only decorates and adds no
   scannable information is deprioritized against imagery that shows the real thing (real terrain,
   real workspace, real group). **Segment-justified exception:** Music + Art Festivals is
   genuinely a visually maximalist, high-saturation, energy-driven category by nature of the
   content itself (festival photography, art/crowd energy) — a flattened, muted treatment there
   would misrepresent the product and underperform with the actual audience. The exception is
   scoped narrowly: imagery/photography style for this segment can run hotter/denser than the
   others, but it still sits inside the same card anatomy, same type system, same trust-strip
   contract as every other segment — the *system* doesn't bend, only the *photography energy*
   does, and only for this one segment where the content genuinely demands it.
2. **No treating segments as filters.** A segment is not a facet in a generic search-and-filter
   travel UI ("all trips, filter by category"). Each segment is a first-class product line with
   its own entry point, its own token identity, and (later, at PRD/matching level) its own rules.
   The UI must never collapse to "one big trip list with a segment dropdown" — that would
   contradict the shared-context product moat directly.
3. **No hiding trust/verification/policy info behind secondary navigation, accordions-by-default,
   tooltips-only, or "read more" walls.** If it affects money, safety, or who a user will be
   traveling with, it does not require an extra tap to *discover it exists* — it may require a tap
   to read full legal detail, but the summary and its existence are always visible.
4. **No segment visually "winning."** No segment gets a larger hero, a permanently pinned top
   position, a richer card treatment, or a more premium-coded color (e.g., gold/black-tie palette
   for one segment vs. flat/cheap-coded palette for another) by default. Any personalization that
   reorders segments for a returning user must be clearly a personalization layer on top of an
   equal-weight default, not a redesign of the default.
5. **No color-only state encoding.** Every state (verification, booking, seat availability,
   payment) is label + icon + color, minimum, so the system holds up in grayscale, for
   colorblind users, and in dense list contexts where color alone gets lost.
6. **No infinite-scroll social feed as a top-level surface.** Community content stays scoped to
   booking/trip context (§1.5) — TruTravel does not compete with itself by growing a
   general-purpose social feed that pulls attention away from the marketplace core.
7. **No per-segment sub-theming of layout, type, or card anatomy.** (See §4 rejected approach.)
   Segment distinctiveness is carried by token accent/icon/photography-energy only, never by
   forking the system.

---

## 7. Open items for TKT-009 (design tokens + key screens)

Flagging explicitly so P2's next ticket has a clean starting list, and so P1/T1 know what's
still undecided at the principles layer:

- Exact color values for the six segment accents (need corridor/segment PRD content — TKT-007 —
  to sanity-check against real photography and against G3's finalized voice/tone per segment).
- Exact type scale steps and grid breakpoints (need real screen inventory from TKT-007).
- Final trust-badge iconography and the precise verification state taxonomy (depends on A4's
  risk register, TKT-006, and P3's matching v0 rubric, TKT-008, for what "group composition
  signal" actually contains).
- Home layout pattern selection (grid-of-six vs. rail-per-segment vs. tabs+grid) — needs the
  first-slice PRD to know what real content density looks like per segment at launch.

---

## 8. Handoff

- **To G3 (TKT-003):** please confirm no overlap/conflict — this doc intentionally says nothing
  about tone, microcopy, or segment naming conventions; flag anything here that constrains your
  voice work in a way you didn't expect (e.g., §1.3 "labeled state" requirement means every state
  needs a short copy label from you, and §6.5 requires label text to exist for every state, not
  just color).
- **To WM1:** this document is ready for the M0 "brand/UI principles lock" review alongside
  `docs/design/brand-voice-principles.md`. No blockers on P2's side.
- **To P1 (future TKT-007) / T1 (future TKT-009/010):** treat §1, §5, and §6 as binding
  constraints when the first-slice PRD and key screens are built — trust surfaces and equal
  segment weight are not up for renegotiation at implementation time without an explicit
  Orchestrator-level decision.
