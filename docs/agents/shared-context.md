# TruTravel — SHARED CONTEXT (v1.1 · 2026-07-26)

> Load this before any TruTravel task. Agent hierarchy (A/P/T/G) and milestone DAG are
> design-locked; only the segment taxonomy evolves. Source: `TruTravel_Shared_Context_and_Agentic_Swarm.pdf`.

## 1. What we're building

TruTravel is a technocratic travel-community product that helps people find like-minded
co-travelers and join group trips. We launch in India, then expand globally.

## 2. Product moat — six first-class segments

1. **Trippy Tours** — free-spirited / conscious vibe group travel (not a drug marketplace)
2. **Thrilling Tours** — adventure, adrenaline, outdoors, skill-challenge
3. **Wellness Tours** — yoga, recovery, nature reset, mind-body curated groups
4. **Couple Getaways** — dual-traveler privacy-first packages (not a dating app)
5. **CodeHouses** — builder/founder/creative co-living workations + deep work + local exploration
6. **Music + Art Festivals** — festival/art-circuit crew travel + lodging; tickets via affiliate/pass

**Segment rule:** these are not filters; they are product lines. UI, matching, pricing bands,
partner incentives, and content rituals all hang off this taxonomy. Home surfaces all six
archetypes with equal structural weight.

## 3. Business model — hierarchical marketplace

- Local partners (**Anchor Operators**) deliver trips.
- Affiliates drive demand / add-ons (festival passes, cowork gear, stays).
- Volunteers (**Community Captains**) create culture and fill seats.
- Platform take stays healthy — target **~18–25% contribution** after variable incentives.
- Never race to the bottom on price; win on match quality + trust.

## 4. Technocratic UI principles

- Systems over vibes-only chaos: hierarchy, data density without clutter, explicit states, segment tokens.
- Trust surfaces first-class: verification, group composition, policies.
- Community is instrumental to booking, not a separate social network.
- Home surfaces all six archetypes with equal structural weight.

## 5. Working agreements

- Prefer India corridor depth over shallow global sprawl.
- Cite assumptions; flag legal/safety risks early (festivals, CodeHouses, Trippy policy).
- Ship vertical slices: one corridor × one segment before expanding.
- Reuse shared glossary, design tokens, and event names.
- When uncertain between growth and trust, choose trust.
- Write outputs so another agent can continue without re-briefing.
- Do not invent new agent roles without Orchestrator (the human founder) approval.

## 6. Glossary

| Term | Meaning |
|---|---|
| Segment | One of the six trip archetypes |
| Corridor | Geographic product cluster (e.g. Himachal adventure belt) |
| Seat | One traveler booking on a departure |
| Captain | Community host (volunteer to pro path) |
| Anchor Operator | Licensed T1 local partner |
| CodeHouse | Multi-day co-living workation SKU |
| Festival pack | Travel+stay (+ optional pass) SKU |
| Take rate | Platform share of trip price |

## 7. Swarm hierarchy (frozen)

```
Orchestrator (human founder + lead architect)
├── Analytical: A1 A2 A3 A4
├── Product:    P1 P2 P3
├── Technical:  T1 T2 T3 T4 T5
└── Growth/Ops: G1 G2 G3 G4
```

| ID | Name | Mission |
|---|---|---|
| A1 | Market Analyst | Sizing, corridors, competitor watch, pricing bands |
| A2 | Unit Economics Analyst | Contribution margin, CAC/LTV, take-rate scenarios |
| A3 | Segment Insight Analyst | Psychographics, JTBD, messaging per segment |
| A4 | Risk & Trust Analyst | Safety, fraud, regulatory (India tourism, payments) |
| P1 | Product Architect | PRDs, IA, MVP scope cuts |
| P2 | Technocratic UI Designer | Design system, segment visual OS, key screens |
| P3 | Matching Systems Designer | Tags, scoring v0, group composition rules |
| T1 | Platform Engineer | App architecture, APIs, auth, catalog |
| T2 | Payments & Ledger Engineer | Bookings, refunds, partner payouts |
| T3 | Data / Analytics Engineer | Event taxonomy, funnels, margin dashboards |
| T4 | DevOps & Security | Env, secrets, CI, basic hardening |
| T5 | QA Agent | Test plans, acceptance criteria, regression |
| G1 | Community Growth | Cohorts, captains, campus/creator loops |
| G2 | Supply Ops | Operator onboarding, trip QA, corridor packs |
| G3 | Brand & Content | Segment voice, landing pages, ritual content |
| G4 | Partnerships | Tourism boards, gear brands, insurance |

**Collaboration protocol:**
- Orchestrator assigns milestone tickets by agent ID.
- Flow: Analytical briefs → Product PRD → Eng implements → QA gates → Growth plays.
- Artifacts live under: `docs/strategy/`, `docs/prd/`, `docs/design/`, `docs/ops/`, `docs/agents/`.
- Weekly margin & trust review: A2 + A4 + T2 + G2.
- Do not invent new agent roles without Orchestrator approval.

## 8. How to invoke these agents in Claude Code

Each roster agent is registered as a Claude Code subagent under `.claude/agents/<id>-<slug>.md`
(e.g. `.claude/agents/a1-market-analyst.md`). Invoke via the Agent tool with
`subagent_type: "<id>-<slug>"`, or just ask by ID/name (e.g. "have A2 model the take-rate
sensitivity") and the orchestrating session will dispatch to the right one.
