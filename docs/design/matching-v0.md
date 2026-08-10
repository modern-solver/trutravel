# TruTravel — Matching v0: Himachal × Thrilling & Himachal × Trippy

**Author:** P3 (Matching Systems Designer) · **Ticket:** TKT-008 · **Milestone:** M1
**Status:** Draft for T1 (TKT-010, implementation) and P2 (TKT-009, visual treatment — coordinate
on tag vocabulary only, not visuals)
**Scope:** This doc covers only the two segments/corridor slices currently PRD'd —
**Himachal (Manali + Bir) × Thrilling Tours** and **Himachal (Manali + Bir) × Trippy Tours** —
per `docs/prd/himachal-thrilling.md` and `docs/prd/himachal-trippy.md` (P1, TKT-007/TKT-012).
P3's broader mission (all six segments) is not built out here; the framework below is written to
generalize, and §7 notes what would need to change per-segment when Wellness, Couple Getaways,
CodeHouses, and Festivals get their own PRDs.

**Inputs (read, not re-derived):**
- `docs/agents/shared-context.md` — segment taxonomy, glossary
- `docs/prd/himachal-thrilling.md` (P1) — domain model, §9 matching tag handoff, altitude/scope cuts
- `docs/prd/himachal-trippy.md` (P1) — domain model, §6 substance-stance exclusion (binding), §7 matching tag handoff
- `docs/strategy/segment-cards.md` (A3) — source tag vocabulary, §"Cross-segment notes for P3"
- `docs/ops/risk-register.md` (A4) — §9.1 `substance_stance` ruling, §1/§2/§3 hard safety gates

---

## 0. The one non-negotiable constraint, stated up front

**No `substance_stance` field, and no field that reconstructs the same signal under a different
name, exists anywhere in this design.** The founder ruled this out (Trippy PRD §6); A4's risk
register (§9.1) offered a narrowly-constrained build-it option and the founder selected "don't
build it as a stored field at all." This doc treats that as a hard constraint on the schema, not
a suggestion. §6 below gives the explicit audit confirming no proxy exists among the tags actually
used here.

---

## 1. Tag vocabulary — reused from A3, gaps filled explicitly

Per A3's segment-cards.md instruction ("Tags are written as `tag_key: value`... so P3 can lift
them directly"), the tag sets below are **lifted, not re-derived**, with two documented
exceptions: (a) Trippy's `substance_stance` is dropped per the founder ruling — P1's Trippy PRD
§7 explicitly warns not to lift it from segment-cards.md verbatim, since that source doc predates
the ruling; (b) a small set of transactional/structural fields A3's cards don't cover at all
(dates, capacity, price) are added as gap-fills, called out below.

### 1.1 Thrilling Tours (from A3 §2, unmodified — Thrilling is unaffected by the substance_stance ruling)

| Tag | Values | Hard/Soft |
|---|---|---|
| `segment` | `thrilling_tours` | Hard |
| `activity_type` | `trek, climb, water_sports, motorsport, wildlife_expedition, winter_sports, multi_activity` | Hard/soft by SKU |
| `skill_level` | `beginner, intermediate, advanced, expert` | Hard |
| `fitness_level` | `low, moderate, high, athlete` | Hard for physically demanding SKUs |
| `risk_appetite` | `cautious, moderate, high` | Soft |
| `certification_held` | `none, basic, advanced, professional` (activity-specific) | Soft |
| `gear_ownership` | `none, partial, full` | Soft — **informational, see §3** |
| `prior_thrilling_trips` | integer | Soft |

### 1.2 Trippy Tours (from A3 §1, with `substance_stance` removed per founder ruling)

| Tag | Values | Hard/Soft |
|---|---|---|
| `segment` | `trippy_tours` | Hard |
| `pace_preference` | `unplanned, loosely_planned, structured` | Soft |
| `group_size_pref` | `micro_4-6, standard_8-12, large_12+` | Soft |
| `noise_energy` | `chill, moderate, high_energy` | Soft — **see disambiguation below** |
| `spiritual_openness` | `none, curious, practicing` | Soft |
| `photography_comfort` | `private, ask_first, open` | Soft |
| `prior_trippy_trips` | integer | Soft |

**~~`substance_stance`~~ — removed.** Not present, not renamed, not reconstructed via another
field. See §6.

### 1.3 Gaps I filled (not in A3's cards — A3's cards are psychographic/compatibility vocabulary,
not transactional vocabulary; someone has to define these for matching to actually run)

| Gap-fill field | Segment | Hard/Soft | Why it's needed |
|---|---|---|---|
| `departure_id` / `departure_date` | Both | Hard (structural) | A3's tags describe *who* travelers are; they say nothing about *when*. Matching only ever runs within one Departure's roster — a traveler is never cross-date-matched. This is closer to a routing key than a compatibility tag, but it's the first gate everything else sits behind. |
| `sub_location` | Both | Hard | PRD-scoped to `manali`/`bir` only for September; `kasol_parvati` is enum-present but hard-blocked for Trippy (PRD §3) and simply not in the September Thrilling catalog. |
| `seat_capacity_remaining` | Both | Hard (structural) | Binary — a Departure with 0 open seats cannot be matched into, independent of tag compatibility. |
| `price_band` (informational, not a scoring input) | Both | N/A | Both PRDs specify **flat pricing per Departure at MVP** (Thrilling PRD §10, Trippy PRD §8/§9) — there is no dynamic pricing to match against. "Budget" at v0 is a simple afford/don't-book binary the traveler resolves themselves at the price they see; it is **not** a compatibility-scoring dimension. Flagging this explicitly so T1 doesn't build budget-matching logic that doesn't correspond to anything in the PRDs. |
| `altitude_tier` | Thrilling only | Hard (catalog-level) | Already defined in the Thrilling PRD's domain model (§3) as `standard`/`high_altitude`. For September, every published Trip is `standard` by construction (PRD §7) — so this behaves as a *catalog gate*, not a per-traveler match variable, at launch. Flagging so T1 doesn't build traveler-facing altitude-preference matching that has nothing to differentiate against yet. |

**`noise_energy` semantic disambiguation:** A3's own cross-segment note flags that `noise_energy`
appears in both Trippy and Wellness with different meanings. Wellness isn't in scope for this
doc, but T1 should **not** implement `noise_energy` as one global enum shared across segments —
implement tags as **segment-namespaced** (keyed by `segment + tag_key`, not a shared tag
dictionary), so Trippy's `noise_energy` (social/expressive energy — how loud, exuberant, or
performative a traveler is in a group) never collides with a future Wellness definition (ambient
quiet/silence tolerance). This is a schema recommendation to T1, not a new tag.

**`prior_X_trips` consolidation:** A3 also suggested `prior_thrilling_trips` /
`prior_trippy_trips` could generalize to a single `loyalty_trips_count` + `segment` compound key.
I'm adopting that recommendation — T1 should implement one `loyalty_trips_count` field scoped by
`segment`, not two parallel integer columns. This is a storage simplification, not a scoring
change (see §3 — used identically either way).

---

## 2. Hard constraints per segment

Hard constraints are **eligibility gates, not scored** — a traveler either clears them or is not
shown/matched into that Departure at all. No hard constraint is ever "relaxed" to fill a group
(see §5, edge case 2). Hard constraints are also **explainable**: every rejection has a
plain-language reason ("this trip requires intermediate skill or above").

### 2.1 Thrilling — hard gates, in evaluation order

1. `segment = thrilling_tours` (routing)
2. `sub_location ∈ {manali, bir}` (September catalog scope)
3. `altitude_tier = standard` (catalog-level for September; see §1.3 — every live Trip already satisfies this, so it's a build-time gate, not a runtime traveler-facing one, for now)
4. Platform-wide `18+` age gate at signup (not a per-segment tag — A4 §1, PRD §9 both confirm this is not P3's field to re-derive)
5. `departure.state ∈ {Open, Filling}` and `seat_capacity_remaining > 0`
6. `skill_level` — traveler's self-declared level must be ≥ the Trip's minimum required band. No override at v0 (see §5, edge case 2).
7. `fitness_level` — same logic, only enforced for Trips flagged physically demanding (per A3, "hard for physically demanding SKUs" — not every Thrilling SKU needs this, e.g. Bir paragliding is lower physical-demand than a multi-day trek)
8. `certification_held` — hard **only** where the specific activity SKU legally/operationally requires proof of a credential (e.g., a technical climb requiring a basic climbing cert); soft everywhere else. This is an SKU-level flag Anchor Operators set at listing time, not a blanket rule.
9. `activity_type` — structurally hard at the point of booking (you're booking a specific Trip template, so you've already selected the activity); becomes a **soft recommendation input** only when suggesting alternate Trips to a traveler who doesn't clear gates 6–8 on their first choice.

### 2.2 Trippy — hard gates, in evaluation order

1. `segment = trippy_tours` (routing)
2. `sub_location ∈ {manali, bir}` — `kasol_parvati` is **structurally hard-blocked**, not a soft exclusion (Trippy PRD §3: enforced as an allow-list validation rule, not a UI-only warning)
3. Platform-wide `18+` age gate at signup
4. `departure.state ∈ {Open, Filling}` and `seat_capacity_remaining > 0`
5. **No skill/fitness/certification gates** — Trippy has none in A3's tag set, and the PRD confirms Trippy Trips default to non-technical terrain (Trippy PRD §9 "OUT" list)

Trippy notably has **no hard compatibility gate at all** beyond routing/capacity/age/geography —
every A3-sourced Trippy tag is soft. This is a deliberate reflection of the segment: Trippy's
core risk (pressure/vibe mismatch) is handled by people and policy, not data-driven hard gates
(§6). Don't invent a hard gate here to "solve" that risk with a tag — that's exactly the
mistake §6 forbids.

---

## 3. Soft-score rubric — explainable only, no black-box weighting

**Model:** a traveler is not scored 1:1 against other individual travelers. They're scored
against the **live group profile** of the Departure's currently-confirmed roster — the modal
(most common) value per soft tag among confirmed seats at the moment of scoring. This is
recalculated as the roster fills. Every score component maps to one plain-language sentence a
traveler can be shown; there is no dimension in this rubric a user couldn't understand by reading
its label.

**Match tiers, used identically across all ordinal tags (skill_level, fitness_level,
risk_appetite, certification_held, pace_preference, noise_energy, spiritual_openness,
photography_comfort — all of these have an inherent order):**
- **Exact match** to group mode → full points for that dimension
- **Adjacent** (one step away on the ordinal scale, e.g. `cautious` vs `moderate`) → half points
- **Distant** (two+ steps away, e.g. `cautious` vs `high`) → zero points

Non-ordinal/free-text tags (none remain in-scope after `gear_ownership` and `prior_X_trips` are
reclassified below as non-scoring) don't need a separate similarity rule at v0 — avoiding that
is deliberate, since "semantic similarity" scoring is exactly the kind of soft judgment call that
tips into non-explainable territory.

### 3.1 Thrilling soft-score (100 pts, only applies among travelers who already cleared §2.1's hard gates)

| Dimension | Weight | Why this weight |
|---|---|---|
| `risk_appetite` alignment to group mode | 35 | A3 names pace/capability mismatch as the segment's #1 fear — risk appetite is the closest soft proxy to "will this group push each other at a compatible intensity" |
| `skill_level` closeness within the trip's allowed band | 25 | Already hard-gated at the band boundary (§2.1.6); this scores *where within the allowed band* a traveler sits relative to the group, since "everyone is technically eligible" still leaves room for pace mismatch inside the band |
| `loyalty_trips_count` (experience banding: `0`, `1-3`, `4+`) | 20 | First-timers grouped predominantly with first-timers, or with a seasoned majority, changes group dynamics in ways A3's psychographics flag (competitive-but-collaborative culture assumes rough experience parity) |
| `fitness_level` closeness within the allowed band | 20 | Same logic as skill_level — hard-gated at the boundary, scored for within-band fit |

**Not scored (informational only, surfaced to Captain/Operator, not to the compatibility
algorithm):**
- `gear_ownership` — A3 itself marks this "informs operator gear-rental logistics," not a
  traveler-to-traveler compatibility signal. Two travelers both owning full gear doesn't make
  them a better-matched pair; it's an operator planning input. Scoring it as compatibility would
  be inventing a correlation the tag was never designed to carry.
- `certification_held`, where not already a hard gate (§2.1.8) — same reasoning: it's a
  credibility/eligibility signal, not a group-fit signal, once past the hard-gate threshold.

**Example "why you matched" string (user-facing language, P2 to style):**
> "You're grouped with 5 other travelers on this trek. 4 of them share your 'moderate' risk
> appetite, your skill level (intermediate) is the most common in this group, and most of the
> group has done 1–3 prior Thrilling trips like you."

### 3.2 Trippy soft-score (100 pts, all travelers clear §2.2's minimal hard gates so this rubric does the real compatibility work)

| Dimension | Weight | Why this weight |
|---|---|---|
| `pace_preference` alignment to group mode | 30 | A3's #1 named fear is pace mismatch (rigid content-shoot crew vs. loud party-bro crew both misfiled under "trippy" — the underlying complaint is pace/planning-style mismatch); this is the single highest-leverage soft signal available without the excluded tag |
| `noise_energy` alignment to group mode | 25 | Directly maps to A3's "ending up with a loud crew when you wanted chill" fear — this is Trippy's semantic use specifically (social/expressive energy), see §1.3 disambiguation |
| `group_size_pref` alignment to the Departure's actual roster-size band | 20 | Structural/logistics fit — someone who wants `micro_4-6` seated in a `large_12+` departure has a real experience mismatch even if every other tag matches |
| `spiritual_openness` alignment to group mode | 15 | A3's group-norms section flags "radical acceptance of diverse expression... but zero tolerance for pushiness" — some diversity here is fine and expected, this dimension is deliberately weighted lower than pace/energy so the algorithm doesn't over-homogenize a segment whose value proposition includes diverse expression |
| `photography_comfort` alignment to group mode | 10 | Real but lower-stakes friction point (A3's group norms: "ask before photographing" is a stated norm, not just a preference) — weighted lowest because it's the easiest of the five to resolve via in-trip norm-setting rather than pre-trip matching |

**Not scored:** `loyalty_trips_count` (Trippy) — same reasoning as Thrilling: informational
signal for the Captain ("this traveler has done 3 Trippy trips before, may want less onboarding
hand-holding"), not a compatibility axis. Trippy's psychographic profile (A3: "often has some
travel experience already... TruTravel's job is curation, not hand-holding") doesn't suggest
experienced/inexperienced travelers need to be clustered together the way Thrilling's safety
logic does.

**Example "why you matched" string:**
> "You're grouped with 7 other travelers on this Bir trip. Most of the group shares your
> 'loosely_planned' pace, your energy level ('moderate') fits the group's overall vibe, and your
> group-size preference matches this departure's size. The group has a mix of spiritual-openness
> levels and photography comfort — that's normal for Trippy groups, and your Captain's code of
> conduct covers how the group handles that mix respectfully."

That last sentence is deliberate: it's the explainability bridge to §6 — where the algorithm
*doesn't* fully resolve compatibility (diversity is allowed on purpose), the explanation should
say so plainly rather than implying a false precision.

---

## 4. Group composition rules

### 4.1 Thrilling — composition optimizes for safety-relevant homogeneity

- **Skill/fitness banding cap:** no more than one adjacent band's worth of spread should exist
  within a confirmed roster wherever avoidable (e.g. don't let a roster end up 80% `intermediate`
  and 20% `advanced` bleeding into a beginner-adjacent Trip's edge case) — enforced as a soft
  scoring pressure (§3.1), not a hard rule, since the hard skill/fitness gate (§2.1) already
  bounds the extremes.
- **First-timer concentration cap:** no more than ~50% of a confirmed roster should be
  `loyalty_trips_count = 0` (first Thrilling trip ever) on any Trip **not** explicitly marketed
  as beginner-friendly, to avoid the "undertrained majority drags pace" risk A1/A4 both flag for
  this segment. This is a soft-score nudge (bias new-roster matching toward filling the
  experienced-traveler seats first once the cap is close), not a hard block — a Departure should
  never be prevented from filling just because too many first-timers want in; it should just be
  more aggressively offered to experienced travelers first once near the cap.
- **Min/max group size:** operator/G2-set per Trip template (this is a supply/ops decision, not
  P3's to set) — matching operates within whatever capacity the Departure defines; P3 does not
  propose specific numbers here.
- **Diversity is not optimized for** in Thrilling — unlike Trippy, there's no product value in
  spreading risk-appetite or experience diversity across a roster; homogeneity on safety-adjacent
  axes is the explicit goal (A3: "competitive-but-collaborative... group success matters more
  than individual glory" assumes a roughly matched group, not a deliberately varied one).

### 4.2 Trippy — composition optimizes for pace/logistics homogeneity, allows expression diversity

- **Pace/energy clustering is the primary sort key** — travelers should be steered toward
  Departures/roster-fill order that keeps `pace_preference` and `noise_energy` as tight as
  practical (this is what the 30+25=55 combined weight in §3.2 is doing structurally).
- **Group-size-band fit is a hard-adjacent structural rule:** a Departure's actual capacity
  should stay within one band of its majority `group_size_pref` value where the catalog allows
  choice between multiple Trip templates — this is a G2/catalog-design recommendation more than
  an algorithmic one, since Trippy's September catalog is only 2–4 templates (PRD §9).
- **Spiritual-openness and photography-comfort diversity is expected and not suppressed** — per
  A3's explicit value framing ("radical acceptance of diverse expression"), the algorithm should
  not try to homogenize a roster on these axes the way it does for pace/energy. This is a
  deliberate asymmetry from Thrilling's rules, and worth stating plainly to T1: don't apply the
  same "minimize spread" logic uniformly across all soft tags — some tags are supposed to stay
  mixed.
- **Min/max group size:** same as Thrilling — operator/G2-set per Trip template, not P3's number.

---

## 5. Edge cases

### 5.1 Near-empty Departure approaching its date

**Resolution rule:** matching never loosens a **hard** constraint to fill a Departure — skill
gates, altitude/geography gates, and age gates are never relaxed under fill pressure, at any
point. What *can* happen as a Departure nears its date while under-filled:
- Soft-score match thresholds may be relaxed (a traveler who scores lower on §3's rubric than
  usual can still be shown/booked into the Departure), but the traveler-facing explanation
  changes accordingly — the UI should show something like "This departure is filling up — your
  match with this specific group may be less tailored than usual" rather than silently presenting
  a lower-quality match as if it were a normal high-confidence one. This is an explainability
  requirement, not optional polish (flag to P2 — §7).
- Below whatever minimum viable roster size G2/T2 set (not a P3-owned number), the standard
  operator-initiated-cancellation path applies (Thrilling PRD §8 item 3 / Trippy PRD §8, mirrored
  shape): full refund including deposit, never treated as a traveler-initiated cancellation. This
  is a booking-flow/state-machine resolution (T1/T2), not a matching-algorithm one — matching's
  only job here is to not misrepresent match quality on the way there.
- Matching may **suggest a same-Trip-template, nearby-date Departure** to travelers on a
  near-empty Departure if one exists and hard constraints still clear — this is a soft nudge
  shown to the traveler, never an automatic reassignment.

### 5.2 Hard-constraint conflict (traveler doesn't clear a gate)

**Resolution rule:** hard constraints are non-negotiable at v0 — **no in-algorithm override
path.** A traveler who doesn't clear a hard gate (e.g., self-declares `beginner` on a Trip
requiring `intermediate+`, or is under 18) is shown a clear, specific, plain-language reason
("This trip requires intermediate skill or higher — based on your profile, you're marked
beginner") and, where possible, redirected to Trips that do match their profile. There is
**no algorithmic waiver mechanism.**

The one exception is a **human, out-of-band override**: an Anchor Operator or Captain may
manually admit a traveler who fails a self-declared gate based on real-world judgment (e.g., a
traveler has a relevant certification that isn't in the tag taxonomy yet). This is explicitly a
human decision, must be logged (who overrode, when, why — feeds T3's event taxonomy), and is
never silent or automatic. Flag to T1: build the override as an explicit, audited action, not a
back-door schema flag.

### 5.3 Solo traveler booking vs. a group booking together

Neither Thrilling nor Trippy is couple-only or otherwise structurally group-locked (that's a
Couple Getaways-specific rule — A3's card treats the couple as an atomic unit; out of scope here,
but flagging the answer forward since the ticket names this exact edge-case shape: if a solo
traveler ever tries to book a Couple Getaways slot in the future, that segment's hard
`privacy_mode`/atomic-couple-unit gate blocks it outright — not this doc's problem to solve, just
noting the pattern exists elsewhere).

For Thrilling/Trippy specifically:
- **Solo travelers** are a first-class, default case — scored individually against the group
  profile exactly as described in §3, no special handling needed.
- **A group booking together** (e.g., 3 friends booking the same Departure in one transaction) is
  treated as a **locked sub-unit for placement** — they've already chosen each other, so the
  algorithm doesn't re-score them against one another or split them across Departures. But **each
  individual seat still clears hard constraints independently.** If one of the three friends is
  `beginner` on a trip requiring `intermediate+`, that friend's seat is blocked while the other
  two can proceed — the booking flow must surface this per-seat, before payment, not silently
  admit the whole group or silently reject the whole group. This is the direct answer to the
  "mismatched fitness levels" scenario: **the hard gate is never waived because the mismatched
  traveler is part of an otherwise-compatible group.** Flag to T1/T2: this needs to be a
  per-seat-line-item check in the booking flow, not a single pass/fail on the transaction.
- **Soft-score explanations for a group-booking sub-unit** should be shown once for the group as
  a whole where their tags are similar enough to make one explanation sensible, but each member
  still has their own underlying score — don't collapse three people's explanations into one
  falsely-uniform sentence if their tags actually diverge.

### 5.4 (Bonus, directly tied to §6) Trippy "zero substance exposure" preference

Not a matching-algorithm edge case by design — flagging explicitly so it isn't mistaken for an
oversight. A traveler who wants to signal "I want zero exposure to X" has **no structured field to
declare that against**, per the founder ruling (§6). The Trippy PRD (§6) already specifies the
resolution: the traveler communicates this directly to their Captain (in-trip, human channel), the
Captain is trained on pressure-mismatch de-escalation, and the code of conduct is the enforcement
mechanism. Matching v0 does not attempt to solve this algorithmically, and should not be extended
later to solve it indirectly (§6).

### 5.5 Self-declared skill/fitness honesty (Thrilling-specific)

A3 flags this as a known group-norms tension ("social sanction... for overstating ability").
Matching v0 has no verification mechanism for self-declared tags — it trusts what the traveler
enters. The mitigating control is human, not algorithmic: the Thrilling PRD's Captain user story
already asks for roster visibility (skill levels, gear ownership) pre-trip specifically so a
Captain can catch a mismatch before the trailhead. **Flag to P2:** self-declared tags should be
visually labeled as self-declared (not implied-verified) wherever they render, so travelers and
Captains calibrate trust correctly — this is the one place P2's visual treatment materially
affects trust, not just aesthetics.

---

## 6. Explicit confirmation — no `substance_stance`-equivalent tag exists

Per the task's requirement, here is the audit, walking through every soft tag actually used in
this design to confirm none of them reconstructs the excluded signal:

| Tag | What it actually measures | Why it is not a substance-stance proxy |
|---|---|---|
| `pace_preference` | Planning style (unplanned/loosely-planned/structured) | Pure itinerary-structure preference; has no correlation implied or encoded to substance behavior |
| `noise_energy` (Trippy) | Social/expressive energy level in a group setting | Describes volume/exuberance of social interaction (talkative vs. quiet), not activity content; explicitly scoped this way in §1.3 to avoid drift toward an "atmosphere" euphemism |
| `spiritual_openness` | Interest in/practice of spiritual activities (meditation, ritual, etc.) | A distinct psychographic axis about belief/practice, not a substance-adjacent code — kept exactly as A3 defined it, not reinterpreted |
| `photography_comfort` | Comfort with being photographed/photographing others | Privacy/consent axis, unrelated to substance content |
| `risk_appetite` (Thrilling) | Physical/activity risk tolerance (route difficulty, exposure) | Segment-specific to Thrilling's physical-safety context, not applicable to or reused in Trippy — no cross-segment leakage |
| `group_size_pref` | Preferred group size band | Logistics preference only |
| `loyalty_trips_count` | Count of prior trips in-segment | Experience/loyalty signal, informational, not scored as compatibility |

**No dimension in §3's rubric, individually or in combination, is capable of reconstructing a
substance-stance signal** — there is no tag whose values map to "how open is this person to
substance use," and no combination of the above tags was designed with that correlation in mind.
The mitigation for Trippy's actual pressure-mismatch risk (A3's stated concern) is entirely
outside the matching algorithm: published code of conduct, Captain training, Anchor Operator
policy acknowledgment, and an incident-response protocol (Trippy PRD §6, items 1–4). This design
does not attempt to recover that signal indirectly, now or as a documented non-goal for future
versions — if a future version wants to revisit this, that requires the same founder/legal
decision path A4's §9.1 already laid out, not a quiet reintroduction through matching-rubric
weight changes.

---

## 7. Handoff notes

### To T1 (TKT-010, implementation)
- Implement tags **segment-namespaced** (§1.3) — do not build one shared global tag dictionary;
  `noise_energy` in particular must not collide across segments even though only Trippy's is
  built now.
- Consolidate `prior_thrilling_trips`/`prior_trippy_trips` into one `loyalty_trips_count` field
  scoped by `segment` (§1.3), per A3's own suggested simplification.
- Hard gates (§2) are boolean eligibility checks, evaluated in the stated order, before any soft
  scoring runs — fail-fast, not scored-then-filtered.
- Soft score (§3) is a live recalculation against the current confirmed-roster mode per tag, not
  a one-time score at signup — needs to be recomputed as a Departure's roster changes.
- Per-seat hard-gate checking for group bookings (§5.3) is a real booking-flow requirement, not
  optional — a group booking must never pass/fail as a single unit when members have divergent
  skill/fitness levels.
- Manual override path (§5.2) must be an explicit, logged, audited action (feeds T3's event
  taxonomy) — never a silent schema bypass.
- `gear_ownership` and non-hard-gate `certification_held` are informational fields surfaced to
  Captain/Operator views — do not feed them into the compatibility scoring function (§3.1).
- Budget/price is **not** a matching dimension at v0 (flat pricing per Departure, §1.3) — don't
  build price-compatibility logic; it doesn't correspond to anything in either PRD.
- `altitude_tier` is currently a catalog-level gate, not a per-traveler runtime one, since every
  live September Trip is `standard` by construction — don't build traveler-facing altitude
  preference-matching yet; there's nothing to differentiate against.

### To P2 (TKT-009, visual treatment — coordinating on tags, not visuals)
- Every match should be explainable in one short, plain-language sentence or two (examples in
  §3.1/§3.2) — no raw numeric score should be the primary user-facing artifact; the score exists
  to *generate* the explanation, not to be displayed as a bare number.
- Self-declared tags (skill_level, fitness_level, all Trippy tags) should be visually
  distinguishable from any future verified-tag state — travelers and Captains need to calibrate
  trust correctly (§5.5); this materially affects trust, so it's more than a style note.
- When a match is shown under relaxed-threshold conditions near a fill deadline (§5.1), the UI
  needs a visible "less-tailored match" indicator — don't let a lower-confidence match render
  identically to a normal one.
- For Trippy specifically, where diversity on spiritual_openness/photography_comfort is
  *intentional* (§4.2), the copy should say so rather than implying an unresolved mismatch — see
  the example explanation string in §3.2's closing sentence.
- Nothing in the tag set or its rendering should ever surface substance-adjacent language,
  imagery, or implied signal (§6) — this is a standing constraint on any UI built against these
  tags, not a one-time review item.

### Open questions for WM1 / founder
1. Confirm the min-viable-roster-size threshold and the specific day-count trigger for §5.1's
   near-empty-Departure path are being set by G2/T2, not defaulting to an unowned gap.
2. Confirm the manual-override path (§5.2) is an acceptable v0 mechanism, or whether the founder
   wants zero human overrides at launch (stricter than what's proposed here).
3. When Wellness/Couple Getaways/CodeHouses/Festivals get their own PRDs, this doc's framework
   (hard gate → soft score against live group mode → explainable output) is intended to
   generalize — but Couple Getaways needs the intra-couple-personalization adjustment A3 already
   flagged (segment-cards.md, Couple Getaways matching tags note), and Festivals needs its own
   crew-size/date/lineup-specific hard-gate design. Neither is attempted here; flagging so it's
   not assumed solved by extension.
