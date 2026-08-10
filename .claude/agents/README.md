# TruTravel Agentic Swarm — Claude Code subagents

Generated from `TruTravel_Shared_Context_and_Agentic_Swarm.pdf` (Agent Brief v1.1, 2026-07-26).
Hierarchy (A/P/T/G IDs), collaboration protocol, and milestone structure are design-locked —
do not add/rename agents without Orchestrator (founder) approval; only the segment taxonomy
may evolve.

Full shared context, glossary, and hierarchy: [`docs/agents/shared-context.md`](../../docs/agents/shared-context.md)

Invoke any of these with the Agent tool via `subagent_type: "<id>-<slug>"`, or just ask for
the agent by ID/name (e.g. "have A2 run the take-rate sensitivity") and let the session
dispatch to the right file.

| ID | Subagent file | Mission |
|---|---|---|
| A1 | `a1-market-analyst.md` | Sizing, corridors, competitor watch, pricing bands |
| A2 | `a2-unit-economics-analyst.md` | Contribution margin, CAC/LTV, take-rate scenarios |
| A3 | `a3-segment-insight-analyst.md` | Psychographics, JTBD, messaging per segment |
| A4 | `a4-risk-trust-analyst.md` | Safety, fraud, regulatory (India tourism, payments) |
| P1 | `p1-product-architect.md` | PRDs, IA, MVP scope cuts |
| P2 | `p2-technocratic-ui-designer.md` | Design system, segment visual OS, key screens |
| P3 | `p3-matching-systems-designer.md` | Tags, scoring v0, group composition rules |
| T1 | `t1-platform-engineer.md` | App architecture, APIs, auth, catalog |
| T2 | `t2-payments-ledger-engineer.md` | Bookings, refunds, partner payouts |
| T3 | `t3-data-analytics-engineer.md` | Event taxonomy, funnels, margin dashboards |
| T4 | `t4-devops-security.md` | Env, secrets, CI, basic hardening |
| T5 | `t5-qa-agent.md` | Test plans, acceptance criteria, regression |
| G1 | `g1-community-growth.md` | Cohorts, captains, campus/creator loops |
| G2 | `g2-supply-ops.md` | Operator onboarding, trip QA, corridor packs |
| G3 | `g3-brand-content.md` | Segment voice, landing pages, ritual content |
| G4 | `g4-partnerships.md` | Tourism boards, gear brands, insurance |

There is no separate "Orchestrator" subagent file — that role is the human founder/lead
architect (or the top-level Claude Code session dispatching to these agents), per the brief.

**Artifacts convention:** `docs/strategy/`, `docs/prd/`, `docs/design/`, `docs/ops/`,
`docs/agents/` (already scaffolded in this repo).
