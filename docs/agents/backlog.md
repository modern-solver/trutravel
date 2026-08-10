# TruTravel — Live Backlog

Maintained by **WM1 (Workload Manager)**. Single source of work truth — every active ticket maps
to exactly one primary owner agent ID. No orphan work.

Last updated: 2026-08-09 (WM1, turn 4)

---

## Milestone map — PROPOSED, needs founder confirmation

The Agent Brief (v1.1) freezes "milestone structure M0–M6" but does not spell out exit criteria.
WM1 has inferred the following from the R8 starter backlog in `WM1_WORKLOAD_MANAGER.md`. Treat
as a draft until the founder confirms or edits (see Founder decisions needed, this turn's digest).

| Milestone | Theme | Rough exit criteria |
|---|---|---|
| M0 | Foundations | Corridor×segment shortlist exists, six segment cards done, brand voice + UI principles locked |
| M1 | Specs & guardrails | Unit-economics waterfall modeled, MVP risk register done, first-slice PRD approved |
| M2 | Design | Matching v0 rubric frozen, design tokens + key screens specced |
| M3 | Build | Platform vertical slice booking flow live in staging |
| M4 | Supply | 8–12 trips + captains onboarded for the chosen corridor |
| M5 | Launch | **Target: September 2026 (founder-set).** QA-gated go-live for Himachal × Thrilling AND Himachal × Trippy, sold from Sept 2026. |
| M6 | Scale *(undefined)* | Proposed: second corridor/segment slice kicked off without collapsing India depth |

---

## Tickets

| ID | Title | Milestone | Owner | Status | Inputs | Output path | Handoff to | Blocker |
|---|---|---|---|---|---|---|---|---|
| TKT-001 | Corridor shortlist | M0 | A1 | **DONE** | Shared Context §1 | `docs/strategy/corridor-shortlist.md` | Founder (decision), P1 | — |
| TKT-002 | Six segment cards | M0 | A3 | **DONE** | Shared Context §1.1 | `docs/strategy/segment-cards.md` | P1, G1, G3 | — |
| TKT-003 | Brand voice principles | M0 | G3 | **DONE** | Shared Context §1.4 | `docs/design/brand-voice-principles.md` | P2, WM1 (lock) | — |
| TKT-004 | UI design principles | M0 | P2 | **DONE** | Shared Context §1.4 | `docs/design/ui-principles.md` | G3, WM1 (lock) | — |
| TKT-005 | Seat waterfall + refund matrix | M1 | A2 | **DONE** | Shared Context §1.3 | `docs/strategy/unit-economics.md` | T2 | — |
| TKT-006 | Risk register (MVP must-haves) | M1 | A4 | **DONE** | Shared Context §1.5, A1 risk flags (Kasol/Parvati) | `docs/ops/risk-register.md` | P1, T4, G2 | — |
| TKT-007 | Himachal × Thrilling PRD | M1 | P1 | **DONE** | TKT-001, TKT-002, founder decision (2026-08-09) | `docs/prd/himachal-thrilling.md` | T1–T5, P3 | — |
| TKT-012 | Himachal × Trippy PRD | M1 | P1 | **DONE** | TKT-001, TKT-002, founder decision (2026-08-09) | `docs/prd/himachal-trippy.md` | T1–T5, P3 | — |
| TKT-013 | High-altitude insurance partner sourcing | M4 | G4 | **DONE** | TKT-006 (risk register), founder corridor decision | `docs/ops/partnerships/insurance.md` | T4, G2, Founder (go-live) | — |
| TKT-014 | Trippy seat-level economics + insurance cost line | M1 | A2 | **DONE** | TKT-012 (Trippy PRD), TKT-013 (insurance options) | `docs/strategy/unit-economics.md` (addendum) | T2, Founder | — |
| TKT-008 | Matching v0 rubric freeze (both segments) | M2 | P3 | **DONE** | TKT-007, TKT-012, TKT-002 | `docs/design/matching-v0.md` | T1 | — |
| TKT-009 | Design tokens + key screens (both segments) | M2 | P2 | **DONE** | TKT-003, TKT-004, TKT-007, TKT-012 | `docs/design/key-screens.md` | T1 | — |
| TKT-010 | Platform architecture + domain models (staging booking) | M3 | T1 | **DONE** | TKT-007, TKT-012, TKT-008, TKT-009 | `docs/architecture/platform-architecture.md`, `packages/db/`, `packages/domain/`, `apps/web/` | T2, T3, T4, T5 | — |
| TKT-015 | Ruling: does per-seat-optional insurance satisfy MVP proof-of-coverage? | M1 | A4 | **SUPERSEDED** | TKT-014 (A2 finding), founder's per-seat-add-on decision, TKT-006 (own prior risk register) | `docs/ops/risk-register.md` (addendum) | — | Founder rejected the fix (operator-mandate philosophy objection); see TKT-016 |
| TKT-016 | Revised ruling: traveler opt-in + mandatory strong disclosure/waiver as MVP answer | M1 | A4 | **DONE** | TKT-015 (superseded ruling), founder's philosophical objection to operator mandates | `docs/ops/risk-register.md` §3.1 (addendum, replaces TKT-015's fix) | T2, P2, G2, Founder | — |
| TKT-011 | Supply pack: Thrilling + Trippy operators/trips | M4 | G2 + G1 | QUEUED | TKT-007, TKT-012 | `docs/ops/supply-pack.md` | G3, Founder (go-live) | Founder held for M3-complete sequencing (not lead-time-critical like insurance) |

**Status legend:** IN PROGRESS (dispatched this turn) · QUEUED (ready, held for milestone discipline)
· BLOCKED (real dependency unmet) · DONE · STALE (flag if untouched > SLA).

---

## Decision log

- 2026-08-09 — WM1 stood up. Backlog seeded from `WM1_WORKLOAD_MANAGER.md` §R8 starter list.
  M0 tickets (001–004) dispatched immediately as they have no dependencies. M1 tickets (005–006)
  held to QUEUED rather than dispatched in parallel, per R2 milestone discipline.
- 2026-08-09 — Founder confirmed the M0–M6 milestone map as drafted (WM1 to draft M5/M6 exit
  criteria later, bring for sign-off as we approach them). Founder confirmed: hold TKT-005/006
  for M0 gate close rather than running as a parallel spike.
- 2026-08-09 — **M0 gate CLOSED.** All four M0 tickets (001–004) landed. WM1 reconciled
  `docs/design/brand-voice-principles.md` (G3) against `docs/design/ui-principles.md` (P2) —
  no contradictions found; trust-surface, explicit-states, and equal-segment-weight rules align
  across voice and visual docs. Brand/UI principles lock is DONE.
  Per founder decision, TKT-005 (A2) and TKT-006 (A4) released from QUEUED to IN PROGRESS.
  TKT-007 (P1 first-slice PRD) remains BLOCKED — needs founder's corridor×segment pick from
  TKT-001's recommendation (Himachal × Thrilling primary; Rishikesh × Wellness runner-up).
- 2026-08-09 — TKT-005 (A2) landed. **Margin guardrail flag (escalated, not resolved by WM1):**
  Thrilling Tours (the segment A1 recommended) breaches the 18% contribution floor above ~12.5%
  refund rate — a real exposure given weather-driven trek cancellations. Music + Art Festivals
  breaches the floor outright in the naive/current-market scenario (7% vs 18% floor); only clears
  it under a "fixed" scenario with zero margin of error. CodeHouses is the strongest economics
  case (25% contribution, most refund/CAC-resilient). WM1 is not altering the corridor
  recommendation or the take-rate floor — surfacing to founder alongside the pending
  corridor×segment decision per escalation duty.
- 2026-08-09 — TKT-006 (A4) landed. Himachal × Thrilling has **no legal blocker** (the
  Kasol/Parvati cannabis-adjacency risk A1 flagged is scoped to Trippy Tours in that sub-corridor,
  not Thrilling) but carries the heaviest MVP safety lift (high-altitude trek package: emergency
  contacts, 18+ gate, waivers, insurance). A4 declined to unilaterally clear the `substance_stance`
  matching tag (NDPS exposure) — escalated as founder decision, not resolved leniently. **Roster
  gap surfaced:** no agent currently owns India ToS/waiver legal drafting — flagged to founder,
  not self-assigned by WM1 (topology decisions are founder-only per design lock). Four founder
  decisions now consolidated for the corridor call: substance_stance tag, Parvati Valley go/no-go,
  ToS drafting ownership, high-altitude insurance partner sourcing (G4).
- 2026-08-09 — **Founder decisions received, four tickets unblocked/opened:**
  1. **Corridor: Himachal × Thrilling AND Himachal × Trippy, both sold from September 2026.**
     This is an explicit founder-directed exception to the "one corridor × one segment before
     expanding" working agreement — logged here for traceability, not a WM1-initiated scope
     expansion. TKT-007 (Thrilling PRD) unblocked; new TKT-012 opened for the Trippy PRD. All
     downstream M2–M4 tickets (008–011) updated to cover both segments. M5 milestone now has a
     concrete date target (September 2026) instead of "undefined."
  2. **`substance_stance` will NOT be built as a matching-tag field.** Ruled out entirely, not
     deferred. P3 (TKT-008) and T1/T3 (schema work) must exclude it; substance-stance mismatch
     handled via captain training / code-of-conduct instead, per A4's alternative option.
  3. **ToS/waiver legal drafting ownership: deferred, revisit closer to M5** — as recommended.
     **WM1 flag:** given M5 now has a hard September target (~4 weeks out), "closer to M5" is a
     short runway for legal drafting lead time. Recommend founder revisit this within 1–2 weeks
     rather than leaving it fully open-ended — will resurface at the M2 gate review.
  4. **Kasol/Parvati Valley: approved for Trippy pending legal review** (not yet run — see ToS
     ownership gap above; no one is currently tasked to conduct that review). **WM1 routing
     decision to avoid a silent blocker:** TKT-012 (Trippy PRD) and the future TKT-011 supply-pack
     work are instructed to scope Himachal × Trippy sourcing to sub-corridors other than
     Kasol/Parvati (e.g. Manali, Bir) for the September launch, treating Parvati as a later
     addition once legal review actually happens. This keeps the Sept timeline unblocked without
     quietly dropping the "pending legal review" condition. Flagging back to founder for override
     if a different approach is preferred.
  **WM1 timeline flag:** two parallel PRDs → matching rubric → design → build → QA → supply pack,
  for two segments, in ~4 weeks is an aggressive critical path. Not blocking dispatch — proceeding
  now — but flagging that scope cuts or parallel eng capacity may be needed to hit September; will
  report concretely once TKT-007/012 land and T1–T5 capacity can be estimated.
- 2026-08-09 — TKT-007, TKT-012, TKT-013 landed. Both PRDs share one domain model and both
  independently arrived at the same sub-corridor scoping WM1 instructed (Manali + Bir only,
  Trippy hard-excludes Kasol/Parvati). **Gap surfaced by P1:** A2's TKT-005 modeled Thrilling,
  CodeHouses, and Festival, but never Trippy — opened TKT-014 (A2) to close this now that Trippy
  is confirmed in Sept scope, bundling in G4's insurance cost/bundling-model question so A2 can
  price it into both segments' waterfalls in one pass. **Cross-ticket tension flagged, not
  resolved by WM1:** P1 deferred Thrilling's high-altitude routes from the Sept MVP specifically
  *pending insurance*, but G4's TKT-013 (landed same turn) found a referral/group-policy insurance
  path could plausibly be ready by September if outreach starts immediately — meaning P1's
  scope cut may be more conservative than G4's timeline supports. Routed to founder rather than
  WM1 picking a side (see digest). TKT-008 (P3) and TKT-009 (P2) dispatched — both only needed the
  PRD, not TKT-014, so released to keep the critical path moving.
- 2026-08-09 — **Founder decisions received:** keep P1's high-altitude cut (fast-follow, not Sept);
  insurance bundles as a **per-seat optional add-on**; supply sourcing (TKT-011) **held** for M3
  completion, not paralleled like insurance was; **independent launch gates** — Thrilling and
  Trippy each ship in September when individually ready, no combined go/no-go.
- 2026-08-09 — TKT-008 (P3), TKT-009 (P2), TKT-014 (A2) landed. **M2 gate CLOSED** (matching v0 +
  design tokens/key screens both done) — TKT-010 unblocked and dispatched to T1 (platform
  architecture first; T2/T4/T5 to follow once T1's architecture lands, standard eng sequencing).
  P3 confirmed no substance_stance-equivalent tag exists anywhere in the rubric (explicit audit).
  P2 locked real segment-accent colors for Thrilling/Trippy (Trippy's hue deliberately chosen to
  avoid cannabis color-coding, per A4's redline) and implemented the Parvati exclusion structurally
  (data absence, not a suppression rule) so it can't leak into the UI. Minor open coordination item
  (not reopening M2): P2's group-composition-preview slot was reserved pending P3's output, which
  has now landed — T1 should confirm the shapes match when implementing TKT-010, no dedicated
  agent turn needed for this.
  **A2 surfaced a real conflict, escalated below, not resolved by WM1:** the founder's chosen
  insurance model (per-seat optional add-on) is the margin-safest option, but A2's numbers show it
  does **not alone satisfy A4's MVP-must-have proof-of-coverage requirement**, since coverage would
  depend on traveler opt-in rather than being guaranteed. Also flagged: Thrilling's payout tier
  bands don't transfer to Trippy (A2's existing T1 band breaches the floor for Trippy) — A2
  proposed Trippy-specific bands, held for G2 whenever TKT-011 unblocks.
- 2026-08-09 — Founder routed the insurance proof-of-coverage gap back to A4 for a formal ruling
  rather than WM1 or the founder picking a fix. Opened TKT-015 (A4) to either confirm per-seat-
  optional can satisfy the MVP bar as-is, or specify the minimum fix (e.g. an operator-side floor).
  Founder's per-seat-add-on pricing decision stands regardless of A4's ruling — A4 is being asked
  to solve the coverage guarantee, not to relitigate the bundling economics.
- 2026-08-09 — **TKT-015 ruling: CONDITIONAL PASS.** Per-seat-optional alone does not satisfy the
  MVP must-have (a traveler can decline and board uninsured with no platform visibility). Minimum
  fix: mandatory Anchor-Operator-side baseline group policy (G4's Option C1, A2-confirmed
  floor-neutral) covering every seat on every high-altitude departure by default; the founder's
  per-seat add-on becomes a coverage *upgrade* on top of that floor, not the sole source of
  coverage. No new payment/ledger line for T2 — this is operator-onboarding compliance data, same
  mechanism as the evacuation-plan gate already in the risk register. Folds into G2's onboarding
  checklist once TKT-011 unblocks. **New founder sign-off needed:** this adds an operator-onboarding
  requirement layered under the already-locked pricing decision — pricing itself is untouched.
- 2026-08-09 — **Founder rejected A4's operator-mandate fix** — not on cost-burden grounds but on
  principle: TruTravel shouldn't mandate operator-side insurance requirements as platform policy.
  Founder's direction: traveler opt-in stands as originally priced, closed instead by **mandatory
  strong disclosure/waiver language** (accepted-risk path, not a coverage guarantee). TKT-015
  marked SUPERSEDED; opened TKT-016 for A4 to finalize this specific path, explicitly briefed not
  to re-propose an operator-side mandate. **WM1 dependency flag:** this path only works if the
  waiver is actually real and legally sound — ties directly to the still-unassigned India ToS/
  waiver legal-drafting ownership gap (deferred earlier to "closer to M5"). Recommend founder
  revisit that ownership question sooner now that the accepted-risk safety path depends on it,
  not just go-live paperwork.
- 2026-08-09 — **TKT-010 (T1) stopped by founder mid-task** (was mid-way through the group-booking
  module and events contract, domain package index not yet reached). WM1 has not resumed or
  reassigned this — holding for founder direction rather than assuming why it was stopped.
- 2026-08-09 — Founder confirmed: resume T1 and finish TKT-010. The original stopped agent could
  not be resumed directly (killed sessions can't be re-entered), so WM1 launched a fresh T1 agent
  briefed to inspect and complete the existing partial work rather than restart. WM1 then directly
  verified (file timestamps + content read, not assumption) that the original session's output was
  genuinely complete and non-truncated: `docs/architecture/platform-architecture.md`, full Prisma
  schema + seed + hard-constraints SQL, and all domain modules (booking, catalog, events, identity,
  matching) — confirmed missing only `packages/domain/src/index.ts` and the `apps/web/` scaffold
  the architecture doc calls for. The fresh T1 retry then failed immediately: session hit its
  monthly spend limit before writing anything (confirmed via timestamps — zero files changed).
  TKT-016 (A4) failed the same way in the same window.
- 2026-08-09 — Founder raised the spend limit. Retried both. **TKT-016 (A4) was actually already
  correct** — WM1's earlier "zero progress" conclusion for TKT-016 was a timestamp inference, not a
  direct content check, and it was wrong: the original attempt's edit had in fact landed in
  `risk-register.md` §3.1 before the process failed (the failure evidently occurred after the
  tool-use edit but before the agent's final summary). The retry agent read the file end-to-end,
  confirmed every definition-of-done item was already met, and made zero further edits — ruling
  formally closed. **Process correction for WM1:** timestamp-only checks aren't sufficient to
  confirm a failed agent's progress; verify content directly, as was correctly done for T1.
  TKT-010 (T1) retry still running.
- 2026-08-09 — **TKT-010 (T1) retry 2 was killed again mid-task** (last message: "Now let's update
  the file map section and append the new completion section with handoff notes"). WM1 verified
  directly rather than trust the kill or the founder's "I guess complete": `packages/domain/src/index.ts`
  (barrel export) exists and is well-formed; the full `apps/web/` Next.js scaffold exists with all 8
  API routes from the architecture doc's plan, real (not stub) auth/session/signup/login logic,
  seed data, README, .env.example; §12 handoff notes for T2/T3/T4/T5 are complete and substantive.
  **One real gap found and fixed by WM1 directly (clerical, not domain work):** the doc referenced
  a "§14" completion section three times that was never written — the kill caught it exactly at
  that point. Patched the three dangling references (now point to existing §12/§13) rather than
  redispatch T1 for a cosmetic fix. **TKT-010 is DONE** — M3 first engineering ticket closed.
  **Cross-agent gap T1 flagged, not yet actioned:** P3 (TKT-008) never sent P2 (TKT-009) the
  composition-preview shape confirmation P2's own doc asked for — narrow, didn't block T1's build
  (T1 designed the data layer to support either shape), but P2's visual spec for that slot may still
  need reconciling against what P3/T1 actually built. Not urgent, noting for a future light-touch
  ticket rather than blocking M3's close.
