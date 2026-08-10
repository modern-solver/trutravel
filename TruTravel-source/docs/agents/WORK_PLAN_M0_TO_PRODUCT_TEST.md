# TruTravel Work Plan — Kickoff → Product Testing

**Owner:** WM1 (assigns & tracks) · **Horizon:** ~12 weeks · **End state:** Product testing complete (staging E2E + closed-beta UAT) with go/no-go for public MVP  
**Pipeline:** Analytical → Product → Design/Match → Eng → QA → Supply/Growth → Product Test  
**Law:** Shared Context · margin guards · trust over vanity speed  

Use with: `WM1_WORKLOAD_MANAGER.md`, milestone exits in `docs/strategy/04_swot_and_milestones.md`.

---

## How to read this plan

| Column | Meaning |
|--------|---------|
| **Ticket** | ID WM1 opens on the board |
| **Owner** | Primary agent (others = support) |
| **Depends on** | Must be Done before start |
| **Output path** | Where the artifact lands |
| **DoD** | Definition of done |

**Statuses:** `Todo` → `In progress` → `Review` → `Done` · Blocked tickets need owner + ask in WM1 digest.

**WIP limits (recommended):** Eng slices ≤ 2 · Open analytical briefs ≤ 4 · Live supply expansion ≤ 1 unpaid wave.

---

## Phase map (beginning → product testing)

```
W0–1   PHASE 0  Foundation & founder locks          M0
W1–2   PHASE 1  Economics, risk, first PRD          M1
W2–4   PHASE 2  Design system + matching            M2
W3–7   PHASE 3  Platform build (parallel w/ tail of 2)  M3
W4–8   PHASE 4  Supply + captains (parallel w/ 3)   M4
W7–9   PHASE 5  Product testing (staging → UAT)     TEST  ← plan ends here
W8–10  PHASE 6  Closed beta (live product test)     M5    (starts inside TEST)
W10–12 PHASE 7  Public MVP (after go/no-go)         M6    (out of scope of this plan’s “end”)
```

**This plan’s finish line:** **TEST-GATE** — staging E2E green + closed-beta test protocol executed + founder go/no-go for broader public launch prep.

---

# PHASE 0 — Foundation (M0 · Weeks 0–1)

**Exit:** Founder sign-off on corridors + six segment cards + brand/UI principles.

| Ticket | Owner | Support | Depends on | Output path | DoD |
|--------|-------|---------|------------|-------------|-----|
| **WM-000** Board + backlog live | WM1 | Founder | — | board / `docs/agents/` | All Phase 0–TEST tickets created; owners set |
| **A1-001** Corridor shortlist + demand hypothesis | A1 | G2 | WM-000 | `docs/ops/01_corridor_shortlist.md` (update) | L1 + L2a/L2b ranked; confidence notes |
| **A3-001** Six segment cards (JTBD, norms, tags, tone) | A3 | G3 | WM-000 | `docs/prd/segment_cards.md` (create) | All 6 segments; usable by P/G |
| **A1-002** Competitor delta one-pager (India) | A1 | — | WM-000 | `docs/strategy/02_competitor_analysis.md` (delta note) | Steal/avoid actionable for P1 |
| **P1-001** MVP scope freeze checklist | P1 | WM1 | A3-001 | `docs/prd/01_mvp_product_brief.md` | In/out confirmed vs Shared Context |
| **G3-001** Brand one-pager (voice per segment) | G3 | A3 | A3-001 | `docs/design/brand_one_pager.md` | Founder can approve tone |
| **P2-001** Technocratic UI principles lock | P2 | G3 | G3-001 | `docs/design/01_technocratic_ui_principles.md` | Principles accepted by Founder |
| **G2-001** Operator lead list (target T1s per corridor) | G2 | A1 | A1-001 | `docs/ops/operator_pipeline.md` | ≥5 leads/corridor drafted |
| **FND-001** Founder corridor + segment sign-off | Founder | WM1 | A1-001, A3-001, P2-001 | decision log | Written yes on corridors + cards |

**Agents active:** WM1, A1, A3, P1, P2, G2, G3 · **Idle OK:** A2, A4, P3, T*, G1, G4 (prep only).

---

# PHASE 1 — Economics, risk, first slice PRD (M1 · Weeks 1–2)

**Exit:** Unit economics greenlit · risk MVP must-haves owned · slice #1 PRD approved.

| Ticket | Owner | Support | Depends on | Output path | DoD |
|--------|-------|---------|------------|-------------|-----|
| **A2-001** Seat waterfall v1 + sensitivity | A2 | — | FND-001 | `docs/strategy/03_revenue_model.md` + model sheet | Contribution ≥18% scenarios shown |
| **A2-002** Refund / cancel matrix | A2 | A4, T2 | A2-001 | `docs/ops/refund_matrix.md` | Partner vs platform split clear |
| **A4-001** Risk register (MVP must vs later) | A4 | G2 | FND-001 | `docs/ops/risk_register.md` | S1–S4; segment-specific risks |
| **A4-002** Legal / marketplace checklist (India) | A4 | Founder | A4-001 | `docs/ops/legal_checklist.md` | Owner per item; no silent gaps |
| **G2-002** Partner tier contract outline | G2 | A2 | A2-001 | `docs/ops/06_partner_tier_outline.md` | T1–T4 terms stub ready for counsel |
| **P1-002** PRD slice #1: Thrilling × launch corridor | P1 | A3, G2 | FND-001, A4-001 | `docs/prd/slice_01_thrilling.md` | Template complete; founder Review |
| **P1-003** User stories freeze (P0 only) | P1 | T5 | P1-002 | `docs/prd/03_user_stories_mvp.md` | P0 list locked for M3 |
| **G4-001** Insurance / trust attach options scan | G4 | A4 | A4-001 | `docs/ops/insurance_options.md` | 2–3 vendors or “defer” decision |
| **FND-002** Economics + slice #1 approve | Founder | WM1, A2, P1 | A2-001, A2-002, P1-002 | decision log | Greenlight build path |

**Agents active:** WM1, A2, A4, P1, G2, G4 · **Support:** A3, T5 (story testability).

---

# PHASE 2 — Design system & matching (M2 · Weeks 2–4)

**Exit:** Design tokens + key screens · matching v0 rubric · 5-user usability walkthrough.

| Ticket | Owner | Support | Depends on | Output path | DoD |
|--------|-------|---------|------------|-------------|-----|
| **P3-001** Matching v0 hard/soft rules | P3 | A3 | A3-001, P1-003 | `docs/prd/02_matching_v0_spec.md` | Edge cases listed; explainable |
| **P2-002** Segment visual OS (6 tokens) | P2 | A3, G3 | P2-001, A3-001 | `docs/design/02_segment_visual_os.md` | Chip/card specs per segment |
| **P2-003** Design tokens + type/spacing | P2 | T1 | P2-002 | `docs/design/04_design_tokens.md` | Implementable values |
| **P2-004** Key screens + IA (flows) | P2 | P1 | P1-002, P2-003 | `docs/design/03_key_screens_ia.md` + prototype link | Home → trip → match → checkout |
| **P2-005** Captain + operator lite screens | P2 | G1, G2 | P2-004 | prototype / design notes | Roster + departure admin |
| **P1-004** Acceptance criteria from screens | P1 | T5 | P2-004 | `docs/prd/acceptance_m3.md` | Given/when/then for P0 flows |
| **G3-002** Segment microcopy pack | G3 | A3 | P2-002 | `docs/design/microcopy_segments.md` | Home + empty states for 6 segments |
| **P2-006** Usability walkthrough (5 users) | P2 | P1, G1 | P2-004 | `docs/design/usability_m2.md` | 5 sessions; top 5 issues; fixes listed |
| **FND-003** Design + matching freeze for build | Founder | WM1 | P3-001, P2-006 | decision log | Eng may implement without redesign thrash |

**Agents active:** WM1, P2, P3, P1, A3, G3, G1 · **Note:** T1 may spike stack choice in parallel (T1-000).

---

# PHASE 3 — Platform vertical slice (M3 · Weeks 3–7)

**Exit:** One paid test booking end-to-end in **staging**.

| Ticket | Owner | Support | Depends on | Output path | DoD |
|--------|-------|---------|------------|-------------|-----|
| **T1-000** Stack + architecture ADR | T1 | T4 | FND-002 | `docs/prd/adr_stack.md` | Founder/T1 agreed stack |
| **T4-001** Envs, secrets, CI skeleton | T4 | T1 | T1-000 | repo + runbooks | staging + local up |
| **T1-001** Domain models + APIs (User, Profile, Segment, Trip, Departure, Booking, Partner, Captain) | T1 | — | T4-001, P1-002 | codebase | Migrations + CRUD for catalog |
| **T1-002** Auth + profiles + segment prefs | T1 | — | T1-001 | codebase | Signup/login; prefs saved |
| **T3-001** Event taxonomy + instrumentation plan | T3 | A2 | P1-003 | `docs/prd/events_taxonomy.md` | segment required on events |
| **T3-002** Implement core events | T3 | T1 | T3-001, T1-002 | codebase | activation, match, book, complete |
| **P3-002** Matching service v0 (rules engine) | T1* | P3 | P3-001, T1-001 | codebase | *T1 implements; P3 reviews rubric compliance |
| **T2-001** Booking state machine | T2 | T1 | T1-001, A2-002 | codebase | draft→paid→cancel states |
| **T2-002** Payments test mode (INR rail) | T2 | T4 | T2-001 | codebase | test payment success/fail |
| **T2-003** Ledger stubs (partner, captain, affiliate) | T2 | A2 | T2-002, A2-001 | codebase | no payout before completion rules |
| **T1-003** Trip detail + checkout UI (web) | T1 | P2 | P2-004, T2-002 | codebase | P0 flow clickable in staging |
| **T1-004** Admin: create departure, assign partner | T1 | G2 | T1-001 | codebase | ops can seed inventory |
| **T4-002** Baseline security + privacy notes | T4 | A4 | T1-002 | `docs/ops/security_baseline.md` | couples/CodeHouse/festival pins considered |
| **T5-001** Test plan for vertical slice | T5 | P1 | P1-004 | `docs/prd/test_plan_slice01.md` | cases mapped to P0 stories |
| **T5-002** Automated + manual staging suite | T5 | T1, T2 | T5-001, T1-003, T2-002 | CI + checklist | critical path green in staging |

**Agents active:** WM1, T1–T5, P2/P3 (review), A2 (ledger rules), G2 (seed data needs).

---

# PHASE 4 — Supply pack & captains (M4 · Weeks 4–8, parallel with Phase 3)

**Exit:** 8–12 QA’d trips across 6 segments · ≥10 captains · 30-day beta calendar.

| Ticket | Owner | Support | Depends on | Output path | DoD |
|--------|-------|---------|------------|-------------|-----|
| **G2-003** Operator onboarding live run | G2 | A4 | G2-002, A4-002 | `docs/ops/02_operator_onboarding_checklist.md` | ≥2 T1 onboarded for L1 |
| **G2-004** Trip QA wave 1 (slice #1 + 3 more) | G2 | A4 | G2-003, trip QA checklist | inventory sheet | ≥4 trips Approved |
| **G2-005** Trip QA wave 2 (fill all 6 segments) | G2 | G1 | G2-004 | inventory sheet | ≥8–12 trips; ≥1/segment if possible |
| **G1-001** Captain recruiting campaign | G1 | G3 | FND-001 | `docs/ops/04_captain_program.md` | ≥10 captains signed CoC |
| **G1-002** Assign captains to first departures | G1 | G2 | G1-001, G2-004 | roster | Each live departure has captain or T-7 TBA rule |
| **A4-003** Safety review on high-risk trips | A4 | G2 | G2-004 | risk notes on inventory | Risk ≥4 signed |
| **G2-006** Seed staging + prod-ready catalog | G2 | T1 | T1-004, G2-005 | admin data | Catalog matches QA sheet |
| **G4-002** Soft partner intros (gear/pass if festival) | G4 | G2 | G2-005 | partnership log | Optional attach documented or deferred |
| **G3-003** Beta landing + invite waitlist copy | G3 | G1 | FND-003 | landing / docs | Ready for invite wave |

**Agents active:** WM1, G1, G2, G3, G4, A4 · **Depends on eng** only for G2-006.

---

# PHASE 5 — Product testing (TEST · Weeks 7–9)

**Purpose:** Prove the product works before/while closed beta. This is the plan’s primary finish line.

## 5A — Staging product test (internal)

| Ticket | Owner | Support | Depends on | Output path | DoD |
|--------|-------|---------|------------|-------------|-----|
| **TEST-001** Staging E2E script (happy path) | T5 | P1 | T5-002, G2-006 | `docs/prd/e2e_staging_script.md` | Step list with expected results |
| **TEST-002** E2E: register → prefs → match → book → pay (test) | T5 | T1, T2 | TEST-001 | test report | Pass on staging |
| **TEST-003** E2E: payment fail + retry | T5 | T2 | TEST-002 | test report | Correct states; no ghost seats |
| **TEST-004** E2E: cancel/refund matrix cases | T5 | T2, A2 | A2-002, TEST-002 | test report | Matrix cases pass or filed bugs |
| **TEST-005** Matching constraints (couple, fitness, capacity) | T5 | P3 | P3-002, TEST-002 | test report | Hard blocks work; soft rank explained |
| **TEST-006** Admin seed → public listing integrity | T5 | T1, G2 | G2-006 | test report | Only QA-approved trips visible |
| **TEST-007** Captain roster + emergency fields | T5 | G1 | T1 + G1-002 | test report | Captain sees roster post-book |
| **TEST-008** Analytics events present | T3 | T5 | T3-002, TEST-002 | event QA sheet | segment on all core events |
| **TEST-009** Security smoke (authz, PII) | T4 | A4, T5 | T4-002 | security notes | No open admin; no address leaks |
| **TEST-010** Bug bash + P0 fix wave | T1, T2 | T5 | TEST-002–009 | bug tracker | Zero open **P0** bugs |
| **TEST-011** Staging sign-off | WM1 | Founder, T5 | TEST-010 | decision log | **Staging GO** |

## 5B — UAT / closed-beta product test (external-lite)

| Ticket | Owner | Support | Depends on | Output path | DoD |
|--------|-------|---------|------------|-------------|-----|
| **TEST-012** UAT protocol (scripts, NPS, incident) | T5 | G1, A4 | TEST-011 | `docs/prd/uat_protocol.md` | Roles, severity, feedback form |
| **TEST-013** Invite 25–50 dogfood users | G1 | G3 | TEST-012, G3-003 | invite list | Confirmed participants |
| **TEST-014** Dogfood week (real staging or limited prod) | G1 | All | TEST-013 | feedback log | ≥20 activated profiles |
| **TEST-015** Observed booking tests (not only self-serve) | T5 | G2 | TEST-014 | UAT report | ≥5 successful test bookings |
| **TEST-016** Margin dry-run on test bookings | A2 | T2 | TEST-015 | margin sheet | Waterfall matches A2-001 |
| **TEST-017** Incident drill (tabletop S2) | A4 | G2, G1 | TEST-012 | drill notes | <2h acknowledge simulated |
| **TEST-018** Usability delta vs M2 | P2 | P1 | TEST-014 | `docs/design/usability_uat.md` | Top issues triaged |
| **TEST-019** P0/P1 fix gate after UAT | T1–T5 | WM1 | TEST-015–018 | release notes | P0 = 0; P1 plan dated |
| **TEST-020** Product testing GO / NO-GO | Founder | WM1, T5, A2, A4 | TEST-019 | decision log | Written decision + conditions |

### Product testing exit criteria (TEST-GATE)

- [ ] Staging E2E happy path green  
- [ ] Payment fail + refund matrix covered  
- [ ] Matching hard constraints verified  
- [ ] Zero open P0 defects  
- [ ] ≥5 UAT bookings observed  
- [ ] Margin dry-run coherent  
- [ ] Incident drill done  
- [ ] Founder **GO** (or NO-GO with fix list)

---

# PHASE 6 — Closed beta launch track (M5 · starts after TEST-011, full after TEST-020)

*Assigned here so agents know what follows testing; WM1 does not start broad invites until TEST-GATE.*

| Ticket | Owner | Support | Depends on | DoD |
|--------|-------|---------|------------|-----|
| **M5-001** Invite 200–500 users | G1 | G3 | TEST-020 GO | Invites sent; activation tracked |
| **M5-002** Live support rota | G2, G1 | A4 | M5-001 | On-call published |
| **M5-003** NPS + margin dashboard live | A2, T3 | — | M5-001, T3-002 | Dashboard weekly |
| **M5-004** 30–50 seat target tracking | WM1 | G1, G2 | M5-001 | Weekly seat report |
| **M5-005** Expand vs deepen decision | Founder | WM1, A1, A2 | M5-003 | Written decision |

---

# Agent-by-agent assignment summary

| Agent | Phase 0 | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 (TEST) |
|-------|---------|---------|---------|---------|---------|----------------|
| **WM1** | Board, gates | Gates | Gates | Gates, WIP | Gates | TEST-011/020, triage |
| **A1** | Corridors, competitors | — | — | — | — | Support M5 later |
| **A2** | — | Waterfall, refunds | — | Ledger rules | — | TEST-016 margin |
| **A3** | Segment cards | Support PRD | Tags/voice | — | — | — |
| **A4** | — | Risk, legal | — | Privacy review | High-risk QA | Drill TEST-017 |
| **P1** | MVP freeze | Slice PRD, stories | Acceptance | Spec questions | — | UAT criteria |
| **P2** | UI principles | — | System, prototype, usability | UI review | — | TEST-018 |
| **P3** | — | — | Matching spec | Rubric review | — | TEST-005 support |
| **T1** | — | — | Stack spike | Core platform + UI | Seed support | P0 fixes |
| **T2** | — | — | — | Pay + ledger | — | Pay/refund tests |
| **T3** | — | — | — | Events | — | TEST-008 |
| **T4** | — | — | — | Env/security | — | TEST-009 |
| **T5** | — | Story testability | — | Test plan + suite | — | **Leads all TEST-*** |
| **G1** | — | — | Usability recruit | — | Captains | Dogfood invites |
| **G2** | Operator leads | Contracts | — | Inventory needs | **Supply pack** | Catalog integrity |
| **G3** | Brand | — | Microcopy | — | Waitlist | Invite creative |
| **G4** | — | Insurance scan | — | — | Soft partners | — |
| **Founder** | FND-001 | FND-002 | FND-003 | Stack if needed | — | TEST-020 |

---

# Critical path (do not parallel-break)

```
FND-001 → A2-001/A2-002 + A4-001 + P1-002 → FND-002
       → P3-001 + P2-004 → P2-006 → FND-003
       → T1-000 → T4-001 → T1-001… → T2-002 → T1-003 → T5-002
G2-003 → G2-004/005 → G2-006 ──┐
                                 ├→ TEST-001…011 → TEST-012…020 → TEST-GATE
T5-002 ──────────────────────────┘
```

If **supply** slips: thin to slice #1 + 3 segments for first UAT; do not block TEST-002 on full 6-segment inventory.  
If **eng** slips: freeze design (FND-003) and cut P1 stories—not matching correctness or payment states.

---

# WM1 weekly operating rhythm

| Day | Action |
|-----|--------|
| Start of week | Confirm phase, WIP limits, critical-path tickets |
| Daily/session | Digest: done / WIP / blocked / next 72h |
| Mid-week | Unblock eng↔ops (catalog, credentials, content) |
| End of week | Milestone % complete; founder asks only |
| At phase exit | Formal gate checklist before opening next phase tickets |

---

# Definition of “product testing complete”

WM1 may mark **WORK_PLAN complete through product testing** when:

1. **TEST-011** Staging GO  
2. **TEST-020** Founder GO (or NO-GO with dated fix plan—not silent drift)  
3. All **P0** bugs closed  
4. Artifacts filed: E2E report, UAT report, margin dry-run, incident drill notes  

Public MVP (M6) is a **separate** plan extension after TEST-GATE.

---

## Ticket ID legend

| Prefix | Domain |
|--------|--------|
| WM | Workload Manager |
| A1–A4 | Analytical |
| P1–P3 | Product / design systems |
| T1–T5 | Technical |
| G1–G4 | Growth / ops |
| FND | Founder decision |
| TEST | Product testing |
| M5 | Closed beta (post-test) |
