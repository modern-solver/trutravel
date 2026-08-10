# TruTravel — Inventory & Findings Note

_Prepared as prep for a front-end build. No Claude Code agent was launched. Date: 2026-07-29._

## TL;DR

- The **relevant context is the TruTravel repo** (`C:\Users\shaun\TruTravel`), which a **Grok 4.5 CLI agent running in your terminal** generated. It's a **documentation/planning repo only — no code yet.**
- **TruTravel** is a *technocratic travel-community web app*: find like-minded co-travelers and join **group trips** across **six segments**, India-first, prices in **INR**. Not an OTA, not a dating app.
- The two **grok.com website chats** ("WhatsApp POS Agents…") are a **different, unrelated project** (a WhatsApp restaurant/dine-in/rental POS backend) and were **excluded** from the front-end work per your correction.
- The front-end has **solid v0.1 design + PRD specs** to build from, but **no framework is chosen and no backend/API exists** — it's a greenfield build against mock data.

---

## 1. What I checked

| Source | Result |
|--------|--------|
| grok.com chat history (via browser) | Only 2 chats, both "WhatsApp POS Agents for Multi-Service Business / Dine-In Delivery Rentals" (Jun 3). Searched history for "travel" → **no results**. **Not TruTravel.** |
| Your **terminal** (Grok 4.5 CLI, cwd `C:\Users\shaun`) | Active session titled "TruTravel: Scope Competitor…" — the Grok CLI agent that authored the repo docs. Confirmed the folder name is **TruTravel** (no "e" in "Tru"), which is why early folder lookups failed. |
| Folder `C:\Users\shaun\TruTravel` | Mounted and fully read. Documentation only. |

## 2. Grok website chats — why they're out

Both grok.com conversations describe a **Python/FastAPI + LangGraph multi-agent WhatsApp POS** for a restaurant with dine-in, takeaway/delivery, and vehicle rentals (INR, Razorpay, calendar-booking-bot). This is a **backend agent system for a different business** — no front-end, no "TruTravel," no six-segment travel model. Excluded from this deliverable. (Flagged in the pre-flight checklist in case you disagree.)

## 3. TruTravel repo inventory

Path: `C:\Users\shaun\TruTravel` — **23 files, all documentation** (Markdown + 1 PDF + 1 Python helper). No `package.json`, no app code, no framework.

```
README.md                         # product overview + doc index
docs/
├── agents/
│   ├── SHARED_CONTEXT.md          # * paste-in context: product, 6 segments, model, principles, glossary
│   ├── ROSTER_AND_PROMPTS.md      # * frozen agent swarm (A1-A4, P1-P3, T1-T5, G1-G4), origin prompts
│   ├── generate_agent_brief_pdf.py
│   └── TruTravel_Shared_Context_and_Agentic_Swarm.pdf
├── strategy/
│   ├── 01_scope_of_action.md      # * in/out scope, success metrics, workstreams, RACI
│   ├── 02_competitor_analysis.md
│   ├── 03_revenue_model.md
│   └── 04_swot_and_milestones.md
├── prd/
│   ├── 00_prd_template.md
│   ├── 01_mvp_product_brief.md    # * MVP surfaces, non-goals, vertical-slice strategy
│   ├── 02_matching_v0_spec.md     # * hard constraints, soft score, tag dictionary, explainability
│   ├── 03_user_stories_mvp.md     # * P0/P1 stories: Traveler / Captain / Operator / Admin
│   └── README.md
├── design/                        # * the core front-end source
│   ├── 01_technocratic_ui_principles.md   # principles, anti-patterns, a11y baseline
│   ├── 02_segment_visual_os.md            # segment tokens, 6 shared components, home IA
│   ├── 03_key_screens_ia.md               # screen list, nav, book flow, empty/error states
│   ├── 04_design_tokens.md                # type, spacing, neutrals, segment tokens, motion
│   └── README.md
└── ops/                           # corridors, operator onboarding, trip QA, captains, incidents, partner tiers
    ├── 01_corridor_shortlist.md ... 06_partner_tier_outline.md, README.md
```
(*) = directly used to write the master prompt.

## 4. What the docs give the front-end (exists)

- **Six-segment OS** with fixed codes: `trippy, thrill, wellness, couple, codehouse, festival`.
- **UI principles**: technocratic / dense-but-calm, explicit states, progressive disclosure, trust first-class, explain matching, a11y (WCAG AA, keyboard, no color-only encoding), and a concrete **anti-pattern list**.
- **Design tokens** (structure fixed, hex placeholder): Inter + JetBrains Mono, 4px base, 1200px max, 8px radius, neutral + segment token sets, 120-180ms motion.
- **6 shared components** (all take a `segment` prop): `SegmentChip, TripCard, MatchPanel, DepartureStatus, PriceBand, TrustRow`.
- **Screen list (P0)**: Segment Home, Trip Detail, Departure roster, Profile & Prefs, Match Panel, Checkout (INR + policy), Booking Confirmation, Group Space (soft), Captain Roster, Operator Dashboard lite, Admin QA.
- **Critical book flow** end-to-end, plus required **empty/error states**.
- **Matching v0**: explainable hard constraints + weighted soft score + starter tag dictionary + edge cases + analytics event names.
- **User stories** with priorities and personas; **success metrics**; **domain entities** (User, Profile, Segment, Trip, Departure, Booking, Partner, Captain).

## 5. What's missing (gaps -> drove the pre-flight checklist)

- **No code / no framework chosen** (docs defer stack choice). Greenfield.
- **No backend or API contract** -> build against a typed mock layer.
- **Design hex values are placeholders** (locked in "M2").
- **Matching weights untuned** ("tune in beta").
- **No brand assets** (logo/fonts) in the repo.
- **No per-slice PRD yet** (the recommended first slice — Himachal × Thrilling — is named but its `slice_*.md` isn't written).

## 6. Deliverables produced

1. `true-travel-master-prompt.md` — paste-ready master prompt for a fresh Claude Code session to build the entire front-end, grounded in the repo docs, with `[SOURCED]` vs `[INFERRED]` tags and explicit guardrails.
2. `true-travel-preflight-checklist.md` — human setup/decisions + dependencies + blockers before running the agent.
3. `true-travel-inventory-findings.md` — this note.

## 7. Note on access

The isolated Linux shell was unavailable this session (host disk space), so the repo was read via the file tools directly against `C:\Users\shaun\TruTravel`. This did not affect completeness — all 23 files were enumerated and the key docs read in full.
