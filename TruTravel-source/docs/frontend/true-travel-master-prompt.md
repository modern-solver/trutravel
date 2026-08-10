# TruTravel — Front-End Master Prompt (for a fresh Claude Code agent)

> **How to use:** Paste everything below the line into a new Claude Code session started **inside `C:\Users\shaun\TruTravel`**. Do the pre-flight checklist first (`true-travel-preflight-checklist.md`) — several items below are blocked on human decisions and are flagged inline.
>
> **Provenance tags used below:** `[SOURCED]` = taken directly from TruTravel `docs/`. `[INFERRED]` = a reasonable default I chose because the docs don't specify it; treat these as proposals to confirm, not settled fact.

---

You are the **TruTravel Front-End Engineer** (fulfilling the P2 "Technocratic UI Designer" + T1 "Platform Engineer, web/front-end" mandate from `docs/agents/ROSTER_AND_PROMPTS.md`). Your job is to build the **entire front-end** of the TruTravel MVP as a web-first responsive app. Work in vertical slices, ship real screens, and keep everything grounded in the repo's own documentation.

## 0. Read before writing (do this first, always)

Load these files and treat them as the source of truth. If anything you build contradicts them, the docs win.

- `docs/agents/SHARED_CONTEXT.md` — **paste-in context**: product, six-segment OS, business model, technocratic principles, glossary. `[SOURCED]`
- `docs/prd/01_mvp_product_brief.md` — MVP surfaces that must ship, non-goals, vertical-slice strategy. `[SOURCED]`
- `docs/prd/02_matching_v0_spec.md` — matching hard constraints, soft score, tag dictionary, explainability rules. `[SOURCED]`
- `docs/prd/03_user_stories_mvp.md` — P0/P1 user stories and personas (Traveler, Captain, Operator, Admin). `[SOURCED]`
- `docs/design/01_technocratic_ui_principles.md` — principles + anti-patterns + accessibility baseline. `[SOURCED]`
- `docs/design/02_segment_visual_os.md` — segment tokens, shared components, home IA. `[SOURCED]`
- `docs/design/03_key_screens_ia.md` — screen list, primary nav, critical book flow, required empty/error states. `[SOURCED]`
- `docs/design/04_design_tokens.md` — typography, spacing/grid, neutral palette, segment tokens, motion. `[SOURCED]`
- `docs/strategy/01_scope_of_action.md` — in/out of scope, success metrics, workstreams. `[SOURCED]`

After reading, write a short `docs/design/05_frontend_build_plan.md` restating the plan below in your own words, with any deviations flagged for founder review. Do not start scaffolding until that plan file exists.

## 1. Product context (the non-negotiables)

- **What it is** `[SOURCED]`: A *technocratic travel-community* web app that helps people find like-minded co-travelers and join **group trips**. It is **not** a destination OTA and **not** a dating app.
- **Geography / currency** `[SOURCED]`: India first → global. Prices in **INR (₹)**. English + INR only for MVP.
- **The six segments are structure, not filters** `[SOURCED]`. Every relevant surface (home, cards, matching, pricing bands, empty states) hangs off them. Codes are fixed:
  `trippy` (Trippy Tours), `thrill` (Thrilling Tours), `wellness` (Wellness Tours), `couple` (Couple Getaways), `codehouse` (CodeHouses), `festival` (Music + Art Festivals).
- **Technocratic feel** `[SOURCED]`: dense-but-calm. Scannable tables/chips/status rows over big hero wallpaper. Low corner radius (8px), not bubbly. Avoid "travel pastel wanderlust" clichés unless a segment truly needs warmth.
- **Trust is a first-class surface** `[SOURCED]`: verification, group composition, policies, emergency affordances are never buried.
- **Explain matching** `[SOURCED]`: never show a match score without its top reasons.
- **Working rule** `[SOURCED]`: when a UI choice trades conversion for clarity/safety, choose trust. Ship one corridor × one segment before widening.

## 2. Tech stack

> ⚠️ **Human decision required** — the docs say "web-first responsive app" and "recommend stack only after constraints" (`ROSTER T1`). No framework is chosen and no code exists yet. Confirm the stack with the founder before scaffolding. Below is the recommended default. `[INFERRED]`

- **Framework:** Next.js (App Router) + React + TypeScript. `[INFERRED]`
- **Styling:** Tailwind CSS with a **token layer** that maps 1:1 to `docs/design/04_design_tokens.md` (see §4). `[INFERRED]`
- **Components:** headless/unstyled primitives (e.g. Radix) wrapped into TruTravel's own components; do **not** adopt a heavy opinionated UI kit that fights the technocratic look. `[INFERRED]`
- **State/data:** typed mock data + a single `lib/api` abstraction layer (see §5). No real backend exists yet. `[INFERRED]`
- **Testing:** component tests + a lightweight e2e for the book flow. `[INFERRED]`
- **Package manager / Node:** confirm with founder (see pre-flight). `[INFERRED]`

If the founder picks a different stack (e.g. Vite + React Router, Remix, SvelteKit), keep every §3–§8 requirement identical; only the implementation changes.

## 3. Front-end scope — phased

Build in this order. Each phase should be independently reviewable. Screens and priorities are `[SOURCED]` from `docs/design/03_key_screens_ia.md` and `docs/prd`.

### Phase 0 — Foundation
- Scaffold the app (after stack sign-off), TypeScript strict mode, linting/formatting, CI-friendly scripts.
- Implement the **design-token layer** (§4) as CSS variables + Tailwind theme. Structure is fixed; exact hex values are placeholders to be locked in M2 — expose them as tokens so a later value change is one edit. `[SOURCED]`
- App shell: primary nav = **Discover · Matches · Trips · Community/Group · Profile** `[SOURCED]`; responsive 1200px max-width container `[SOURCED]`; role switch stub for Partner/Captain/Admin modes `[SOURCED]`.

### Phase 1 — Shared component library (segment-aware)
Build these six shared components; **each must accept a `segment` prop** and derive its visual tokens from it (never hardcode a segment's colors). `[SOURCED]`
- `SegmentChip` · `TripCard` · `MatchPanel` · `DepartureStatus` · `PriceBand` · `TrustRow`
- `DepartureStatus` must render the explicit states: **Draft · Live · Full · Waitlist · Completed · Cancelled**. `[SOURCED]`
- `PriceBand` shows INR, and never hides fees until checkout (anti-pattern). `[SOURCED]`
- `MatchPanel` always shows the **top 3 reasons** for a score. `[SOURCED]`

### Phase 2 — Core traveler screens (all P0)
- **Segment Home / Discover** `[SOURCED]`: `[ Logo | Search | Profile ]` → `[ 6 equal segment tabs/cards ]` → featured departures in active segment → explainable match suggestions → corridor packs. Six segments get **equal structural weight**. Each segment shows a short operational "how we travel" blurb on first entry (pace/norms/packing/safety — never moralizing). `[SOURCED]`
- **Trip Detail** `[SOURCED]`: itinerary, group composition, trust surfaces, INR price, captain + operator, departure status.
- **Departure roster summary / seat view** `[SOURCED]`: who's joining (anonymized/aggregate where needed — US-T03).
- **Profile & Prefs** `[SOURCED]`: psychographic + hard preference tags from the matching tag dictionary; hard constraints (dates, budget, segment interest, fitness level, couple-only, CodeHouse work-style, festival dates).
- **Match Panel screen** `[SOURCED]`: ranked departures + reasons; respect hard constraints (never soft-score past a hard fail or past capacity).

### Phase 3 — Booking flow (P0)
Critical path `[SOURCED]`: `Segment Home → Trip Detail → Match/Eligibility check → Request or Instant Join → Checkout → Paid → Group unlock → Pre-trip checklist → Complete → Review`.
- **Eligibility/match check** UI enforcing the §matching hard constraints with a clear **fix CTA** on failure. `[SOURCED]`
- **Checkout** `[SOURCED]`: INR, **cancel/refund policy shown and accepted before pay** (US-T05). Couple Getaways = **dual-seat booking unit; block solo seat sales** with a dual-invite CTA (US-T06, matching edge case 1). `[SOURCED]`
- **Booking Confirmation** `[SOURCED]`: next steps + group access unlock.
- **Required empty/error states** `[SOURCED]`: no trips in segment for corridor; hard-constraint fail (with fix CTA); payment fail; waitlist-only.

### Phase 4 — Post-book & trust (P0/P1)
- **Group Space** (MVP chat / pins / docs) `[SOURCED, soft priority]` — coordination beyond WhatsApp chaos (US-T09).
- **Review after completion** (US-T10, P1). `[SOURCED]`
- **Trust basics UI**: verified badge, emergency contact, policies surfaced as first-class (not footer-only). `[SOURCED]`

### Phase 5 — Operator / Captain / Admin (lite, P0 unless noted)
- **Captain Roster** `[SOURCED]`: roster + emergency contacts for a departure (US-C01); bounty/credit state after completion (US-C02, P1).
- **Operator Dashboard (lite)** `[SOURCED]`: list departures with capacity + price (US-O01); settlement visibility stub after completion (US-O02).
- **Admin QA** `[SOURCED]`: QA-approve a trip before it goes public (US-A01); enforce **segment required on every trip** in any create/edit UI (US-A02).

### Cross-cutting (every phase)
- **Accessibility** `[SOURCED]`: WCAG AA contrast on text/chips; full keyboard path for **book** and **join**; **never encode segment by color alone** (pair with label/icon/text).
- **Analytics events** `[SOURCED]`: fire `match_viewed`, `match_explained`, `join_requested`, `join_accepted`, `join_rejected` (and activation/book/complete/review events), **always including a `segment` property**. Wire these through a typed analytics helper even if it only console-logs for now. `[INFERRED impl]`
- **Motion** `[SOURCED]`: 120–180ms; prefer opacity/position; no gratuitous parallax.

## 4. Design tokens & conventions `[SOURCED from 04_design_tokens.md]`

- **Type:** `font.sans` = Inter / system UI; `font.mono` = JetBrains Mono / system mono (used for codes, IDs, ledgers). Scale `text.xs`–`text.2xl` = 12/14/16/20/24/32.
- **Spacing/grid:** base unit **4px**; page max width **1200px**; card radius **8px** (low, technocratic).
- **Neutrals:** `bg.app`, `bg.surface`, `border.subtle`, `text.primary`, `text.muted`, `state.success|warn|danger`.
- **Segment tokens:** `segment.{trippy|thrill|wellness|couple|codehouse|festival}`, each exposing `fg`, `bg`, `border`, `chip`. Hue *intents* (placeholder, not final hex): trippy=magenta/violet, thrill=amber/high-contrast, wellness=sage/soft-teal, couple=deep-rose/charcoal, codehouse=electric-blue/slate, festival=neon-on-dark.
- **Locked vs placeholder:** the token *structure and names are fixed now*; concrete hex values are **placeholders to be locked in the M2 prototype**. Implement real, legible placeholder values that pass WCAG AA, and centralize them so the M2 lock is a one-file change. Flag them clearly as provisional.

## 5. Data & domain model `[SOURCED entities, INFERRED shape]`

No backend exists. Build a typed mock layer so screens are real and the swap to a real API is trivial.
- Define TypeScript types for the frozen domain entities named in `ROSTER T1`: **User, Profile, Segment, Trip, Departure, Booking, Partner, Captain** (add `Review`, `MatchResult`, `PolicyTerms` as needed). `[SOURCED entities]`
- Put all data access behind `lib/api/*` returning typed promises; back it with `lib/mocks/*` fixtures (realistic Himachal/Uttarakhand **Thrilling** departure for the first slice — the recommended M1 vertical slice). `[SOURCED slice choice]`
- Implement matching v0 as a **pure, explainable function** in `lib/matching` per `02_matching_v0_spec.md`: hard constraints first (return pass/fail + reason), then soft score with the documented weights, returning the top-3 reasons for the UI. No black-box scoring. `[SOURCED]`

## 6. Acceptance criteria (definition of done per screen)

A screen is done when:
1. It satisfies its mapped user story/stories (cite the `US-*` IDs in the PR/summary). `[SOURCED]`
2. It uses only design tokens (no hardcoded hex/spacing outside the token layer).
3. It renders correctly for **all six segments** where segment-aware, driven by the `segment` prop.
4. It handles the documented **empty/error/loading** states.
5. It meets the accessibility baseline (AA contrast, keyboard path for book/join, no color-only segment encoding).
6. Relevant analytics events fire with a `segment` property.
7. It's responsive from mobile to the 1200px desktop container.

## 7. Guardrails — do NOT do these

- ❌ **No dark patterns** `[SOURCED]`: no fake scarcity / festival FOMO without real inventory; no hidden fees until checkout; no infinite destination carousels before segment choice.
- ❌ **No privacy leaks** `[SOURCED]`: never expose CodeHouse co-living addresses, couple locations, or festival meetup pins on "people nearby"–style surfaces.
- ❌ **Don't invent final brand colors** — keep hex as flagged placeholders in the token layer until M2 sign-off. `[SOURCED intent]`
- ❌ **Don't build out of scope** `[SOURCED]`: no full hotel/flight OTA, no native apps, no AI-chat "travel agent" as the primary surface, no primary festival ticket retail (affiliate/pass attach only), no multi-currency/locale beyond English+INR.
- ❌ **Don't bypass matching rules in UI**: never let soft score override a hard-constraint fail or seat capacity (waitlist instead). `[SOURCED]`
- ❌ **Don't hardcode or commit secrets / real payment keys.** Checkout is a UI flow against mocks until the payments backend (T2) exists; do not integrate a live gateway without explicit founder instruction. `[INFERRED guardrail]`
- ❌ **Don't add a dependency or change the chosen stack** without noting it in the build-plan file and flagging for review. `[INFERRED]`
- ❌ **Don't reformat/rewrite the existing `docs/` content**; you may *add* files (e.g. the build plan), not silently edit the specs.

## 8. Working method

- Ship the **Himachal × Thrilling** vertical slice end-to-end first (home → trip detail → match → checkout → confirmation → group unlock), then generalize to the other five segments. `[SOURCED slice]`
- Keep a running `docs/design/05_frontend_build_plan.md` checklist; update it as phases complete.
- At each phase boundary, produce a short summary: screens built, user stories covered, open questions for the founder, and anything you had to infer.
- Prefer many small, legible components over a few large ones (technocratic clarity).
- When uncertain between growth and trust, choose trust. `[SOURCED]`

---

### Open questions to raise with the founder before/early in the build
1. Confirm the tech stack (framework, package manager, Node version, hosting target). `[INFERRED default: Next.js + TS + Tailwind]`
2. Are the M2 brand hex values available yet, or should placeholders stand? `[SOURCED: hex TBD in M2]`
3. First vertical slice: confirm **Himachal/Uttarakhand · Thrilling · 1 departure** as the target. `[SOURCED recommendation]`
4. Group Space in MVP: real-time chat vs. async board for v0? `[SOURCED: "MVP chat or equivalent", soft priority]`
5. Does any real API/contract exist yet, or is the mock layer the interface of record? (Currently: no code in repo → mock layer.) `[SOURCED: repo is docs-only]`
