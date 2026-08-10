# TruTravel — Segment Cards (v1.0)

**Owner:** A3 (Segment Insight Analyst) · **Ticket:** TKT-002 · **Milestone:** M0
**Status:** Draft for consumption — ready for P1 (TKT-007), P3 (TKT-008), G1, G3 (TKT-003)
**Source:** Shared Context §1.1–§1.4 (`docs/agents/shared-context.md`), synthesized psychographic
analysis. No primary user research yet — treat quantitative claims as directional hypotheses to
validate in corridor pilots, not survey-backed fact. Flagged inline where relevant.

> **How to use this doc**
> - Each of the six cards uses an identical field structure — diff across cards freely.
> - **Matching tags** are written as `tag_key: value` or `tag_key: [enum options]` so P3 can lift
>   them directly into a tag schema without re-deriving vocabulary. Tags marked **(hard)** are
>   candidate hard constraints (eligibility gates); tags marked **(soft)** are candidate
>   soft-score inputs (compatibility weighting). P3 owns the actual rubric/weights — this is
>   input vocabulary, not the scoring design.
> - **Messaging angles / words-to-avoid** are angle-level, not copy — G3 owns final voice and
>   landing-page copy; P2 owns in-UI microcopy tone applying G3's system.
> - **Guardrail framing** is repeated verbatim in the two segments where TruTravel has an explicit
>   product non-goal (Trippy, Couple Getaways) so no downstream agent can miss it by only reading
>   one card.

---

## 1. Trippy Tours

**One-line positioning:** Free-spirited, conscious-vibe group travel for people who want to
loosen their grip on routine with others who get it — **not** a drug marketplace.

### Core motivation / JTBD
- "Help me find people who won't judge my chaotic, curious, unscheduled way of exploring."
- Escape from over-optimized urban/corporate life; craving spontaneity, novelty, and low-friction
  social bonding with strangers who share an open, non-judgmental worldview.
- JTBD: *When I want to travel loose and unplanned, help me find a crew with compatible energy
  and pace so I don't have to either travel alone or negotiate vibe-mismatch with strangers.*
- Secondary JTBD: signal-safe identity expression (music taste, subculture, alt-lifestyle) without
  having to vet a whole group manually.

### Psychographics
- Skews younger (20s–early 30s), digitally native, backpacker/gap-year or "digital bohemian"
  mindset even if employed full-time.
- Values: authenticity over itinerary-perfection, present-moment experience, community over
  consumption, low hierarchy/leader-less group dynamics.
- Distrustful of overly corporate or sanitized travel brands; will bounce off anything that reads
  as "package tour" energy.
- Often has some travel experience already (not a first-timer segment); TruTravel's job is
  curation/matching, not hand-holding.

### Fears / objections
- **"Is this secretly a drug tourism / party marketplace?"** — biggest brand-risk fear for
  TruTravel itself, not just the traveler. Ambiguous "free-spirited" framing invites this
  assumption; must be pre-empted, not just avoided.
- Fear of ending up with a group that's actually a rigid "influencer content shoot" crew or a
  loud party-bro crew misfiled under "trippy."
- Fear of unsafe or unlicensed operators cutting corners because the segment feels "loose" or
  informal.
- Fear of judgment or unwanted pressure (substance use, spiritual practices) from either overly
  strait-laced or overly permissive group-mates — mismatch anxiety runs both directions.
- Trust/safety specific: legal risk perception around India state-level substance laws; travelers
  worry platform association could create legal exposure for them personally.

### Group norms / unwritten rules
- Consent-first culture: ask before photographing, ask before touching down on someone's plans,
  no unsolicited advice-giving.
- Non-hierarchical decision-making within the group; group leader/captain facilitates, doesn't
  dictate itinerary.
- Radical acceptance of diverse expression (dress, music, spiritual practice) but *zero tolerance*
  for pushiness, proselytizing, or pressuring others into substances or activities.
- Shared-cost, shared-chores mentality on multi-day legs (splitting food, campsite setup) even
  though it's a paid product — captains reinforce this norm.
- Off-platform WhatsApp/Signal groups pre-trip are expected; captain sets tone early.

### Matching tags (for P3)
- `segment: trippy_tours` **(hard)**
- `pace_preference: [unplanned, loosely_planned, structured]` **(soft)**
- `group_size_pref: [micro_4-6, standard_8-12, large_12+]` **(soft)**
- `substance_stance: [substance_free, tolerant_no_pressure, actively_social]` **(soft, sensitive —
  see A4 for consent/disclosure handling; never a public-facing filter, internal compatibility
  signal only)**
- `noise_energy: [chill, moderate, high_energy]` **(soft)**
- `spiritual_openness: [none, curious, practicing]` **(soft)**
- `photography_comfort: [private, ask_first, open]` **(soft)**
- `prior_trippy_trips: integer` **(soft, loyalty/experience weighting)**
- `age_band` **(soft, legal minimum is hard — see A4)**

### Messaging angles
- "Find your unscheduled crew." "Travel loose, not alone." "Same wavelength, different playlist."
- Lean into curiosity, spontaneity, and low-ego community — not escapism-as-excess.
- Show real trip photos/testimonials emphasizing conversation, nature, shared meals, music — not
  nightlife imagery that could be read as party marketing.
- Captain recruiting (G1): look for hosts who are naturally inclusive, low-drama, good at reading
  group energy and de-escalating — not "life of the party" personas.

### Words to avoid
- "Party," "rager," "get lit," "no rules," "wild," anything implying substance procurement or
  access, "escape reality" (reads as evasive/illegal-adjacent), any wink-wink drug-code language.
- Avoid "hippie" as a caricature — respect the segment's self-image; use "free-spirited,"
  "conscious," "unscripted" instead.

### Guardrail (verbatim, repeat everywhere Trippy appears)
> **Trippy Tours is explicitly NOT a drug marketplace.** Product surfaces, matching questions,
> captain guidance, and marketing must never imply TruTravel facilitates, sources, or condones
> substance use/procurement. Any copy, tag, or feature that could be read as such should be
> flagged to A4 (Risk & Trust) and Orchestrator before shipping.

---

## 2. Thrilling Tours

**One-line positioning:** Adventure, adrenaline, and skill-challenge trips for people who want to
push a physical or outdoor edge — with a group that can actually keep up.

### Core motivation / JTBD
- "Match me with people at my skill/fitness level so the trip is actually fun, not a bottleneck
  or a liability."
- Mastery-seeking: bragging-rights achievement (summit, rapid, jump) combined with camaraderie of
  shared hardship/exertion.
- JTBD: *When I want to attempt something physically demanding I can't or don't want to do alone,
  help me find a competent, similarly-capable group and a vetted operator so risk is managed, not
  avoided.*

### Psychographics
- Fitness-identified; may already own gear, follow adventure athletes/content, track performance
  (Strava-adjacent mindset).
- Risk-tolerant but not reckless — wants *managed* risk, credible operators, real safety
  standards, not bureaucratic over-caution either.
- Competitive-but-collaborative: enjoys pushing peers and being pushed, but group success matters
  more than individual glory.
- Gear- and skill-level literate; will notice and distrust vague or hand-wavy safety claims.

### Fears / objections
- Getting grouped with people wildly below their skill/fitness level (drags pace, raises risk) or
  wildly above (embarrassment, can't keep up, holds group back).
- Operator/guide credibility: "Are these guides actually certified? Is the gear inspected?"
- Injury/liability exposure — insurance clarity, emergency evacuation protocol, medical support
  on remote legs.
- Weather/seasonal risk not being communicated transparently before booking.
- Fear of a trip being marketed as "thrilling" but actually being a tame, photo-op version of the
  activity (bait-and-switch on intensity).

### Group norms / unwritten rules
- Skill/fitness self-assessment expected to be honest — social sanction (and safety risk) for
  overstating ability.
- Gear checks and safety briefings are respected rituals, not skippable red tape.
- Encouragement culture: cheering each other through the hard parts, but no forcing anyone past
  their stated limit.
- Post-activity debrief/bonding (campfire, shared meal) is part of the product, not an afterthought.
- Captains here often double as informal safety leads — expectation of competence, not just charisma.

### Matching tags (for P3)
- `segment: thrilling_tours` **(hard)**
- `activity_type: [trek, climb, water_sports, motorsport, wildlife_expedition, winter_sports, multi_activity]` **(hard/soft depending on trip SKU)**
- `skill_level: [beginner, intermediate, advanced, expert]` **(hard — pace/safety-critical)**
- `fitness_level: [low, moderate, high, athlete]` **(hard for physically demanding SKUs)**
- `risk_appetite: [cautious, moderate, high]` **(soft)**
- `certification_held: [none, basic, advanced, professional]` **(soft, activity-specific — e.g. dive/climb certs)**
- `gear_ownership: [none, partial, full]` **(soft — informs operator gear-rental logistics)**
- `prior_thrilling_trips: integer` **(soft)**

### Messaging angles
- "Match by skill, not just seat." "Push your edge with people who can push theirs."
- Lead with credibility: certified guides, real safety protocols, transparent difficulty grading.
- Use specific, honest intensity descriptors (grade/difficulty ratings) rather than superlatives.
- Captain recruiting (G1): recruit for demonstrated competence/certification first, charisma
  second — this segment's trust currency is technical credibility.

### Words to avoid
- "Extreme" without substantiation, "no experience needed" for genuinely technical activities
  (sets unsafe expectations and erodes trust when reality doesn't match), vague safety language
  ("we've got you covered" with no specifics).

---

## 3. Wellness Tours

**One-line positioning:** Yoga, recovery, and nature-reset trips for people who want a curated
mind-body pause with a group that respects their pace and privacy.

### Core motivation / JTBD
- "Help me actually disconnect and recover, with structure I don't have to build myself, among
  people who won't drain my energy."
- Restoration-seeking: burnout recovery, nervous-system reset, gentle self-improvement without
  performance pressure.
- JTBD: *When I need to step back from stimulation/overwork, help me find a low-friction,
  structured retreat and a group whose energy supports rest rather than competing with it.*

### Psychographics
- Often mid-career professionals, caregivers, or anyone post-burnout; skews toward people
  actively managing stress, sleep, or health conditions.
- Values: intentionality, quiet, routine (early mornings, movement, nourishing food), low ego,
  minimal small talk pressure.
- Wary of "wellness-washing" — very sensitive to whether practices (yoga, meditation, breathwork)
  are led by credible practitioners vs. performative Instagram staging.
- Comfortable spending for quality/privacy; not necessarily budget-first buyers.

### Fears / objections
- Getting placed with a loud, extroverted, "networking on vacation" crowd that undermines the
  point of the trip.
- Facilitator credibility: "Is the yoga/meditation teacher actually qualified?"
- Health/dietary needs not being taken seriously (allergies, injuries, mobility limits).
- Feeling pressured to perform social energy or participate in every group activity ("forced fun").
- Privacy concerns around sharing health/mental-health context needed for good matching.

### Group norms / unwritten rules
- Quiet hours and phone-light/no-phone blocks are respected without negotiation.
- Opt-in, not opt-out, participation — nobody is shamed for skipping a session or eating alone.
- Non-comparative culture: no flexing on flexibility, weight, or spiritual "advancement."
- Facilitator-led structure (schedule of sessions) but personal time is protected and expected.
- Sharing personal struggles (if it happens) stays confidential within the group by default.

### Matching tags (for P3)
- `segment: wellness_tours` **(hard)**
- `modality: [yoga, meditation, ayurveda, spa_recovery, nature_immersion, digital_detox, fitness_reset]` **(hard/soft by SKU)**
- `social_energy_pref: [solo_leaning, small_group, community_oriented]` **(soft — key differentiator vs. other segments)**
- `experience_level: [beginner, practicing, advanced]` **(soft, for yoga/meditation-specific SKUs)**
- `dietary_needs: [vegetarian, vegan, allergy_flagged, no_restriction]` **(hard — safety/logistics)**
- `noise_energy: [silent_retreat, quiet, moderate]` **(soft)**
- `digital_detox_pref: [full, partial, none]` **(soft)**
- `prior_wellness_trips: integer` **(soft)**

### Messaging angles
- "A reset, not a to-do list." "Curated quiet, real practitioners."
- Foreground facilitator credentials and program structure transparently.
- Emphasize permission to opt out, not obligation to participate — reduces "forced fun" fear.
- Captain recruiting (G1): recruit calm, low-ego hosts and credentialed practitioners; this
  segment's captains function closer to program leads than social hype-people.

### Words to avoid
- "Hustle your wellness," "biohack," "grind" framing (contradicts rest-seeking motivation),
  overuse of "transform your life" hyperbole, spiritual-bypassing language, anything implying
  participation is mandatory ("full-day itinerary, no breaks").

---

## 4. Couple Getaways

**One-line positioning:** Dual-traveler, privacy-first packages for existing couples who want a
seamless trip built for two — **not** a dating app or matchmaking product.

### Core motivation / JTBD
- "Plan a trip for the two of us without the logistics burden, and protect our privacy from
  strangers, algorithms, or public group dynamics."
- Relationship investment: quality time, romance, milestone celebration (anniversary, proposal,
  babymoon), or simple stress-free logistics offload.
- JTBD: *When we want a trip together, remove planning friction and unwanted third-party exposure
  (no forced group mixing, no public profile) while still getting curated,
  vetted experiences and light-touch local/community context if we want it.*

### Psychographics
- Established couples (dating, engaged, married, long-term partners) — **explicitly not singles
  seeking to meet people.**
- Values: privacy, control over their own itinerary, minimal unsolicited social obligation,
  reliability (this is often a higher-stakes, higher-emotion trip — anniversaries, proposals).
- Willing to pay a premium for privacy, discretion, and reduced decision fatigue.
- Two sub-modes: "romance/escape" (minimal itinerary, max privacy) vs. "shared-experience seeking"
  (want some curated activities/community touchpoints, but always as a unit, never split up or
  matched with other singles).

### Fears / objections
- **"Is this going to try to match/mix us with other people, like a dating or social app?"** —
  core brand-risk fear; must be pre-empted structurally, not just in copy.
- Privacy leakage: photos, location, or booking details being visible to a wider community feed.
- Being pushed into group activities/icebreakers when they wanted a private trip.
- Trust/safety specific: accommodation discretion (shared vs. private rooms defaults), data
  privacy on relationship-status fields, safety for LGBTQ+ couples in certain corridors (needs A4
  input on which corridors/operators are verified-inclusive).
- Fear of mismatched expectations between the two partners not being surfaced before booking
  (one wants adventure, other wants rest) — an internal-to-couple UX problem, not external matching.

### Group norms / unwritten rules
- Default is *unit privacy*: the couple is the atomic unit, never split, never auto-mixed with
  other travelers unless they explicitly opt into an optional shared-experience add-on.
- Community/captain touchpoints (if any) are light, opt-in, and framed around amenities/local tips
  — never framed as "meet other couples to socialize with."
- Discretion by default on any public-facing trip content (no auto-posting couple photos to
  community feed without explicit consent).
- Milestone-trip service expectations: attention to detail, personalization, no generic group-tour
  energy.

### Matching tags (for P3)
- `segment: couple_getaways` **(hard)**
- `trip_purpose: [anniversary, honeymoon, proposal, babymoon, general_escape, first_trip_together]` **(soft — personalization signal, never public)**
- `privacy_mode: [full_privacy, opt_in_light_community]` **(hard — gates whether any cross-couple matching/content features apply at all)**
- `pace_alignment_flag: adventure_vs_rest_mismatch` **(soft — internal nudge, not cross-couple matching; surfaces itinerary options to reconcile two partners' preferences)**
- `accommodation_pref: [private_room_only, flexible]` **(hard)**
- `inclusive_verified_required: boolean` **(hard where applicable — routes to A4-vetted inclusive-friendly operators/corridors)**
- `prior_couple_trips: integer` **(soft)**

> Note to P3: unlike the other five segments, Couple Getaways matching is **intra-couple
> personalization**, not inter-traveler group matching. Most tags here inform itinerary curation
> and operator selection, not "who else is in your group." Any feature that would surface a
> couple's profile to other couples/travelers needs explicit opt-in and A4 sign-off.

### Messaging angles
- "A trip built for two, planned for you." "Your getaway, your privacy."
- Emphasize logistics-offload and curation quality, not social/community framing.
- Use milestone-aware language (anniversaries, proposals) without being presumptuous about
  relationship stage — keep fields optional, not required.
- Captain recruiting (G1): this segment barely needs traditional "captains" — recruit
  local-knowledge concierge-style hosts or none at all; community loop is minimal by design.

### Words to avoid
- "Meet," "match," "connect," "singles," "mingle," any language borrowed from dating-app
  vocabulary. Avoid "group trip" framing entirely for this segment's core flow. Avoid implying
  the community feed or captain will know relationship details.

### Guardrail (verbatim, repeat everywhere Couple Getaways appears)
> **Couple Getaways is explicitly NOT a dating app.** It does not match individuals with other
> individuals, does not build romantic-compatibility profiles, and does not surface couples to
> other users without explicit opt-in. Matching logic (P3) and UI (P2) must treat the couple as
> a single atomic unit. Any feature resembling profile browsing, swiping, or cross-couple social
> discovery should be flagged to A4 and Orchestrator before shipping.

---

## 5. CodeHouses

**One-line positioning:** Multi-day co-living workations for builders, founders, and creatives who
want deep-work structure plus real local exploration — not a generic "digital nomad hostel."

### Core motivation / JTBD
- "Get me out of my routine environment into a house full of people building things, with enough
  structure that I actually get work done and enough exploration that it doesn't feel like a
  remote-work prison."
- Productivity + serendipity: wants focused work blocks *and* high-signal peer network (potential
  collaborators, cofounders, investors, friends) *and* real local culture, not a resort bubble.
- JTBD: *When I want to break routine without breaking momentum on my work, help me find a house
  of similarly-driven people, reliable infra (wifi, workspace), and a schedule that balances deep
  work with local exploration.*

### Psychographics
- Founders, indie hackers, remote employees, freelancers, creatives (writers, designers,
  artists) — self-directed, often solo-operators used to structuring their own time.
- Values: signal density of peers (who else is in the house matters as much as the location),
  infra reliability (wifi, desk ergonomics, quiet hours), intellectual stimulation (demo nights,
  skill-shares), low tolerance for wasted time.
- Often has disposable income/expense-account mindset (self-funded founder, funded startup,
  remote salary) — price-sensitive on obvious rip-offs but not bargain-hunting first.
- Reputation- and network-conscious: who they're seen co-living with is part of the value prop.

### Fears / objections
- Weak wifi/workspace infra killing the entire premise of the trip.
- House composition mismatch: ending up with a house of tourists/vacationers rather than genuine
  builders — dilutes the peer-signal value.
- Time-zone/schedule chaos undermining actual work output (loud house during calls, no quiet space).
- Vetting/trust: "Who are these strangers I'm living with for 1-2 weeks? Are they legit?" —
  identity/professional verification matters more here than in other segments.
- IP/confidentiality anxiety for founders discussing sensitive work in a shared space.
- Fear of it being marketed as "workation" but actually being all vacation, no infra/structure
  (or the inverse — all grind, no local exploration, defeating the "getaway" premise).

### Group norms / unwritten rules
- Respect for stated work blocks/quiet hours — interrupting someone's deep work window is a
  social foul.
- Show-and-tell / demo-night culture: sharing what you're building is expected, not optional
  performance.
- Reciprocal networking norms: intros, feedback, and collaboration offered generously but without
  pressure or pitching-at-everyone energy.
- Chores/house logistics split fairly, similar to co-living norms generally.
- Confidentiality assumed by default for anything discussed about others' work/business — an
  informal NDA culture.
- Balanced FOMO: local exploration outings are scheduled as a group ritual (not left purely
  optional), because isolation-in-a-house-with-just-a-laptop defeats the product's purpose.

### Matching tags (for P3)
- `segment: codehouses` **(hard)**
- `professional_track: [founder, indie_hacker, remote_employee, freelancer_creative, student_builder, investor]` **(soft — house-composition signal)**
- `work_domain: [tech_swe, design, writing_content, marketing_growth, hardware, other_creative]` **(soft)**
- `stage: [idea, building, revenue, funded, employed]` **(soft, founder-specific)**
- `wifi_dependency: [high, moderate]` **(hard — infra-critical trips)**
- `quiet_hours_need: [strict, flexible]` **(soft)**
- `networking_intent: [low, moderate, high]` **(soft — signals demo-night/collab enthusiasm)**
- `identity_verification_level: [basic, professional_verified]` **(hard — trust gate, feeds A4)**
- `prior_codehouse_trips: integer` **(soft)**

### Messaging angles
- "Ship by day, explore by evening." "A house full of people building things."
- Lead with infra credibility (real wifi specs, desk setup) and house-composition curation, not
  just location aesthetics.
- Showcase peer signal — who's been in past houses (with consent) — as social proof.
- Captain recruiting (G1): recruit house leads who are themselves credible builders/creatives —
  peer-respect matters more than hosting charisma here; consider recruiting from founder
  communities, hacker houses, creator meetups.

### Words to avoid
- "Digital nomad hostel," "vacation with wifi" (undersells the work-seriousness), "grind 24/7"
  (oversells it, ignores the exploration half), vague infra claims ("great wifi" without specs).

---

## 6. Music + Art Festivals

**One-line positioning:** Festival- and art-circuit crew travel plus lodging, with tickets/passes
handled via affiliate — for people who want to go with a crew instead of scrambling solo logistics.

### Core motivation / JTBD
- "Get me to the festival with people who are actually going for the same reasons I am, and take
  the logistics nightmare (tickets, stay, transport) off my plate."
- Belonging to a scene/subculture; shared-fandom bonding; the festival itself is the anchor, the
  crew and logistics are the value-add.
- JTBD: *When I want to attend a festival/art event, help me find a compatible crew and bundle
  reliable logistics (stay, transport, and pass access) so I don't have to solve it all solo or
  rely on an unreliable friend group.*

### Psychographics
- Passionate fandom/scene identity (specific genres, artists, art movements) — often knows the
  lineup/circuit better than TruTravel does; expects the platform to respect that expertise, not
  explain the festival to them.
- Values: logistics reliability *especially* around crowded/chaotic events (stay proximity, safe
  transport, crash space), crew chemistry (who you experience a set/exhibit with matters), FOMO
  management (multiple stages/events, don't want to miss out).
- Wide age/income range depending on specific festival/art circuit — segment card should note
  sub-segmentation by event type is likely needed later (EDM/festival crowd vs. gallery/art-circuit
  crowd have different norms) — **flag for future refinement, not solved in this v1 card.**

### Fears / objections
- Ticket/pass scams or unreliable affiliate fulfillment — this segment has a known history of
  festival ticket fraud; trust bar is high specifically on pass/ticket delivery.
- Ending up crashing with a mismatched crew (different stages/genres/pace) at a multi-day event.
- Accommodation proximity/safety to the venue, especially for late-night/overnight events.
- Overcrowding, lost-group logistics (no signal, chaotic venue) — fear of getting separated with
  no plan.
- Substance-adjacent perception risk similar to Trippy Tours in some festival contexts (e.g. EDM) —
  needs the same non-marketplace discipline even though it's not explicitly named as a guardrail
  segment; flag to A4/G3 for consistent handling.

### Group norms / unwritten rules
- Crew check-in rituals during the event (meet points, buddy system) are expected and valued, not
  seen as hand-holding.
- Shared enthusiasm expression (singing along, moshing, discussing sets/exhibits) is the bonding
  currency — low tolerance for a crew-mate who's checked out/negative.
- Flexible splintering norm: it's normal and accepted for sub-groups to peel off for different
  stages/artists/exhibits and reconverge later — crew isn't expected to move as one block at all
  times, unlike other segments.
- Gear/prep culture (comfortable footwear, hydration, camping gear if applicable) — captains often
  share prep checklists pre-trip.

### Matching tags (for P3)
- `segment: music_art_festivals` **(hard)**
- `event_type: [music_festival_edm, music_festival_indie_rock, music_festival_folk, art_circuit, mixed_arts]` **(hard — genre/scene fit is high-stakes for satisfaction)**
- `genre_artist_affinity: freetext_or_tag_list` **(soft)**
- `pass_status: [need_pass_via_affiliate, have_own_pass]` **(hard — logistics/inventory gate)**
- `stamina_pace: [full_send_all_days, mix_rest_days, day_visitor]` **(soft)**
- `accommodation_pref: [on_site_camping, nearby_stay, offsite_commute]` **(hard — logistics gate)**
- `crew_splinter_comfort: [stays_together, comfortable_splitting]` **(soft)**
- `prior_festival_trips: integer` **(soft)**

### Messaging angles
- "Your crew, your lineup, sorted logistics." "Don't scramble for tickets and a crash pad — roll
  with a crew."
- Lead with logistics reliability and ticket/pass legitimacy (affiliate trust) as much as vibe —
  this segment's biggest objection is fraud/reliability, not vibe-fit.
- Respect scene expertise in copy — don't over-explain festivals to people who live in that scene.
- Captain recruiting (G1): recruit from within specific fan communities/scenes per event (genre-
  authentic hosts), not generalist travel captains; consider creator/scene-influencer loops as a
  distinct recruiting channel from other segments.

### Words to avoid
- Overpromising "guaranteed" ticket access if affiliate supply isn't confirmed (fraud-adjacent
  trust risk), generic festival clichés that signal inauthenticity to a scene-literate audience,
  and — per the Trippy-adjacent risk above — avoid substance-marketplace-coded language in EDM/
  festival contexts specifically.

---

## Cross-segment notes for downstream agents

**For P1 (TKT-007, first-slice PRD):** Each card's JTBD line is written to be liftable directly
into a PRD problem statement. Couple Getaways and CodeHouses have the most complex trust-gating
requirements (identity verification, privacy defaults) — factor into MVP scope-cut risk if either
is the launch segment.

**For P3 (TKT-008, matching v0):** Tag vocabularies above are a starting input list, not a final
schema — expect to consolidate overlapping tags (e.g. `noise_energy` appears in Trippy and
Wellness with different semantics; `prior_X_trips` repeats per segment and could generalize to a
single `loyalty_trips_count` + `segment` compound key). Couple Getaways is structurally different
(intra-couple personalization vs. inter-traveler matching) — don't force it into the same
group-composition algorithm as the other five without adjustment.

**For G1 (community growth, captains):** Captain archetype differs meaningfully by segment —
vibe-facilitator (Trippy), competence-first (Thrilling), calm program-lead (Wellness),
minimal/concierge (Couple Getaways), peer-builder (CodeHouses), scene-authentic (Festivals). Don't
run one generic "become a captain" funnel — recruiting messages and vetting criteria should branch
by segment.

**For G3 (TKT-003, brand voice; segment landing pages):** Words-to-avoid lists above are
starting guardrails for copy review, not exhaustive. The two explicit non-goal guardrails (Trippy
≠ drug marketplace, Couple Getaways ≠ dating app) should be treated as standing review criteria
for every piece of content touching those segments, not a one-time note.

**Open flag for A4 (Risk & Trust):** Several tags above are marked sensitive (substance_stance,
inclusive_verified_required, identity_verification_level) and touch consent, disclosure, and
legal-exposure questions this card does not resolve. A4's risk register (TKT-006) should treat
these as inputs requiring explicit handling policy before P3/T1 build them into live schema.
