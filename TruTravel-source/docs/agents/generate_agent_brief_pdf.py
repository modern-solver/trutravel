"""Generate printable TruTravel Shared Context + Agentic Swarm PDF (A4)."""
from pathlib import Path
from datetime import date

from fpdf import FPDF


OUT = Path(__file__).with_name("TruTravel_Shared_Context_and_Agentic_Swarm.pdf")
VERSION = f"v1.1 · {date.today().isoformat()}"


class AgentBriefPDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(40, 40, 40)
        self.cell(0, 6, "TruTravel - Agent Brief", align="L")
        self.set_font("Helvetica", "", 8)
        self.set_text_color(100, 100, 100)
        self.cell(0, 6, VERSION, align="R", new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(180, 180, 180)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(4)

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, f"Confidential · Mini-Grok swarm handoff · Page {self.page_no()}/{{nb}}", align="C")

    def h1(self, text):
        self.set_font("Helvetica", "B", 16)
        self.set_text_color(20, 20, 20)
        self.multi_cell(0, 8, text)
        self.ln(2)

    def h2(self, text):
        self.ln(2)
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 7, text)
        self.ln(1)

    def h3(self, text):
        self.ln(1)
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(40, 40, 40)
        self.multi_cell(0, 6, text)

    def body(self, text):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "", 9)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 5, text)
        self.ln(1)

    def bullet(self, text):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "", 9)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 5, f"  - {text}")

    def mono_block(self, text):
        self.set_x(self.l_margin)
        self.set_fill_color(245, 245, 247)
        self.set_font("Courier", "", 7.5)
        self.set_text_color(25, 25, 25)
        x = self.l_margin
        w = self.w - self.l_margin - self.r_margin
        lines = text.splitlines() or [""]
        line_h = 3.8
        block_h = max(12, len(lines) * line_h + 4)
        if self.get_y() + block_h > self.h - 18:
            self.add_page()
        y0 = self.get_y()
        self.rect(x, y0, w, block_h, style="F")
        self.set_xy(x + 2, y0 + 2)
        for line in lines:
            safe = line.encode("latin-1", "replace").decode("latin-1")
            self.set_x(x + 2)
            self.cell(w - 4, line_h, safe[:115], new_x="LMARGIN", new_y="NEXT")
        self.set_xy(self.l_margin, y0 + block_h + 2)

    def table_row(self, cols, widths, header=False):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B" if header else "", 8)
        self.set_text_color(20, 20, 20)
        if header:
            self.set_fill_color(230, 230, 235)
        max_h = 6
        for i, c in enumerate(cols):
            n = max(1, int((len(c) * 1.6) // max(widths[i], 1)) + 1)
            max_h = max(max_h, n * 4 + 2)
        if self.get_y() + max_h > self.h - 16:
            self.add_page()
        x0 = self.l_margin
        y0 = self.get_y()
        for i, c in enumerate(cols):
            cx = x0 + sum(widths[:i])
            self.set_xy(cx, y0)
            if header:
                self.rect(cx, y0, widths[i], max_h, style="F")
            safe = c.encode("latin-1", "replace").decode("latin-1")
            self.multi_cell(widths[i], 4, safe, border=0)
        self.set_xy(self.l_margin, y0 + max_h)


def build():
    pdf = AgentBriefPDF(orientation="P", unit="mm", format="A4")
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=16)
    pdf.set_margins(14, 16, 14)
    pdf.add_page()

    pdf.h1("TruTravel Shared Context + Agentic Swarm")
    pdf.body(
        "Printable handoff for mini-Grok agents. Load SHARED CONTEXT before any task. "
        "Agent hierarchy (A/P/T/G) and milestone DAG are design-locked; only segment taxonomy evolves."
    )

    # --- SHARED CONTEXT ---
    pdf.h2("1. Shared Context Monologue")
    pdf.body(
        "We are building TruTravel: a technocratic travel-community product that helps people "
        "find like-minded co-travelers and join group trips. We launch in India, then expand globally."
    )

    pdf.h3("1.1 Product moat - six first-class segments")
    for i, s in enumerate(
        [
            "Trippy Tours - free-spirited / conscious vibe group travel (not a drug marketplace)",
            "Thrilling Tours - adventure, adrenaline, outdoors, skill-challenge",
            "Wellness Tours - yoga, recovery, nature reset, mind-body curated groups",
            "Couple Getaways - dual-traveler privacy-first packages (not a dating app)",
            "CodeHouses - builder/founder/creative co-living workations + deep work + local exploration",
            "Music + Art Festivals - festival/art-circuit crew travel + lodging; tickets via affiliate/pass",
        ],
        1,
    ):
        pdf.bullet(f"{i}) {s}")

    pdf.h3("1.2 Segment rule")
    pdf.body(
        "These are not filters; they are product lines. UI, matching, pricing bands, partner "
        "incentives, and content rituals all hang off this taxonomy."
    )

    pdf.h3("1.3 Business model - hierarchical marketplace")
    for b in [
        "Local partners deliver trips.",
        "Affiliates drive demand / add-ons (festival passes, cowork gear, stays).",
        "Volunteers (Community Captains) create culture and fill seats.",
        "Platform take stays healthy (target ~18-25% contribution after variable incentives).",
        "Never race to the bottom on price; win on match quality + trust.",
    ]:
        pdf.bullet(b)

    pdf.h3("1.4 Technocratic UI principles")
    for b in [
        "Systems over vibes-only chaos: hierarchy, data density without clutter, explicit states, segment tokens.",
        "Trust surfaces first-class: verification, group composition, policies.",
        "Community is instrumental to booking, not a separate social network.",
        "Home surfaces all six archetypes with equal structural weight.",
    ]:
        pdf.bullet(b)

    pdf.h3("1.5 Working agreements")
    for b in [
        "Prefer India corridor depth over shallow global sprawl.",
        "Cite assumptions; flag legal/safety risks early (festivals, CodeHouses, Trippy policy).",
        "Ship vertical slices: one corridor x one segment before expanding.",
        "Reuse shared glossary, design tokens, and event names.",
        "When uncertain between growth and trust, choose trust.",
        "Write outputs so another agent can continue without re-briefing.",
    ]:
        pdf.bullet(b)

    pdf.h3("1.6 Glossary")
    pdf.table_row(["Term", "Meaning"], [40, 140], header=True)
    for term, meaning in [
        ("Segment", "One of the six trip archetypes"),
        ("Corridor", "Geographic product cluster (e.g. Himachal adventure belt)"),
        ("Seat", "One traveler booking on a departure"),
        ("Captain", "Community host (volunteer to pro path)"),
        ("Anchor Operator", "Licensed T1 local partner"),
        ("CodeHouse", "Multi-day co-living workation SKU"),
        ("Festival pack", "Travel+stay (+ optional pass) SKU"),
        ("Take rate", "Platform share of trip price P"),
    ]:
        pdf.table_row([term, meaning], [40, 140])

    # --- SWARM ---
    pdf.add_page()
    pdf.h2("2. Agentic Swarm Design (hierarchy frozen)")
    pdf.body(
        "Design lock: Agent IDs A1-A4, P1-P3, T1-T5, G1-G4, collaboration protocol, and "
        "milestone structure M0-M6 are frozen. Segment expansion updates shared context only."
    )

    pdf.h3("2.1 Topology")
    pdf.mono_block(
        "Orchestrator\n"
        "├── Analytical: A1 A2 A3 A4\n"
        "├── Product:    P1 P2 P3\n"
        "├── Technical:  T1 T2 T3 T4 T5\n"
        "└── Growth/Ops: G1 G2 G3 G4"
    )

    pdf.h3("2.2 Collaboration protocol")
    for b in [
        "Orchestrator (founder + lead architect) assigns milestone tickets.",
        "Analytical briefs -> Product PRD -> Eng implements -> QA gates -> Growth plays.",
        "Artifacts: docs/strategy/, docs/prd/, docs/design/, docs/ops/, docs/agents/.",
        "Weekly margin & trust review: A2 + A4 + T2 + G2.",
    ]:
        pdf.bullet(b)

    # Analytical
    pdf.h2("3. Analytical agents")
    pdf.table_row(["ID", "Name", "Mission"], [18, 50, 112], header=True)
    for row in [
        ("A1", "Market Analyst", "Sizing, corridors, competitor watch, pricing bands"),
        ("A2", "Unit Economics Analyst", "Contribution margin, CAC/LTV, take-rate scenarios"),
        ("A3", "Segment Insight Analyst", "Psychographics, JTBD, messaging per segment"),
        ("A4", "Risk & Trust Analyst", "Safety, fraud, regulatory (India tourism, payments)"),
    ]:
        pdf.table_row(list(row), [18, 50, 112])

    prompts = {
        "A1": (
            "You are TruTravel Market Analyst. Use the SHARED CONTEXT.\n"
            "Produce corridor shortlists, competitor deltas, and demand hypotheses for India.\n"
            "Output: ranked corridor x segment matrix, sources, confidence, next research questions.\n"
            "Do not invent funding numbers; mark estimates clearly."
        ),
        "A2": (
            "You are TruTravel Unit Economics Analyst. Use the SHARED CONTEXT and revenue hierarchy.\n"
            "Model seat-level waterfalls, partner tiers, and sensitivity to refunds/CAC.\n"
            "Guardrail: platform contribution after variable incentives >= 18% unless stress-test.\n"
            "Output: tables + recommendations founders can decide on."
        ),
        "A3": (
            "You are TruTravel Segment Insight Analyst. Use the SHARED CONTEXT.\n"
            "Deep-dive all six segments - Trippy / Thrilling / Wellness / Couple Getaways /\n"
            "CodeHouses / Music + Art Festivals: motivations, fears, group norms, tags.\n"
            "Output: segment cards usable by Product and Growth agents."
        ),
        "A4": (
            "You are TruTravel Risk & Trust Analyst. Use the SHARED CONTEXT.\n"
            "Map safety, KYC, operator verification, couples privacy, Trippy substance policy,\n"
            "CodeHouse co-living risks, festival crowd/ticket-fraud risks, payment escrow in India.\n"
            "Output: risk register with severity, mitigations, MVP must-haves vs later."
        ),
    }
    for k, v in prompts.items():
        pdf.h3(f"Origin prompt - {k}")
        pdf.mono_block(v)

    # Product
    pdf.h2("4. Product / design agents")
    pdf.table_row(["ID", "Name", "Mission"], [18, 50, 112], header=True)
    for row in [
        ("P1", "Product Architect", "PRDs, IA, MVP scope cuts"),
        ("P2", "Technocratic UI Designer", "Design system, segment visual OS, key screens"),
        ("P3", "Matching Systems Designer", "Tags, scoring v0, group composition rules"),
    ]:
        pdf.table_row(list(row), [18, 50, 112])

    p_prompts = {
        "P1": (
            "You are TruTravel Product Architect. Use the SHARED CONTEXT.\n"
            "Write crisp PRDs and user stories for vertical slices (corridor x segment x booking).\n"
            "Ruthlessly cut scope; prefer shippable MVPs. Coordinate with Engineering on feasibility."
        ),
        "P2": (
            "You are TruTravel Technocratic UI Designer. Use the SHARED CONTEXT.\n"
            "Define a dense-but-calm design system: typography, grids, segment tokens,\n"
            "trip cards, matching panels, partner dashboards. Avoid generic wanderlust cliches\n"
            "unless segment demands it. Output component specs and flows."
        ),
        "P3": (
            "You are TruTravel Matching Systems Designer. Use the SHARED CONTEXT.\n"
            "Design matching v0: tags + hard constraints (dates, budget, couple-only, fitness,\n"
            "CodeHouse work-style, festival dates/crew size) + soft score. Explainable only.\n"
            "Output scoring rubric and edge cases."
        ),
    }
    for k, v in p_prompts.items():
        pdf.h3(f"Origin prompt - {k}")
        pdf.mono_block(v)

    # Technical
    pdf.h2("5. Technical / development agents")
    pdf.table_row(["ID", "Name", "Mission"], [18, 55, 107], header=True)
    for row in [
        ("T1", "Platform Engineer", "App architecture, APIs, auth, catalog"),
        ("T2", "Payments & Ledger Engineer", "Bookings, refunds, partner payouts"),
        ("T3", "Data / Analytics Engineer", "Event taxonomy, funnels, margin dashboards"),
        ("T4", "DevOps & Security", "Env, secrets, CI, basic hardening"),
        ("T5", "QA Agent", "Test plans, acceptance criteria, regression"),
    ]:
        pdf.table_row(list(row), [18, 55, 107])

    t_prompts = {
        "T1": (
            "You are TruTravel Platform Engineer. Use the SHARED CONTEXT.\n"
            "Propose and implement web-first architecture (stack after constraints),\n"
            "domain models: User, Profile, Segment, Trip, Departure, Booking, Partner, Captain.\n"
            "Optimize for clear boundaries and fast MVP."
        ),
        "T2": (
            "You are TruTravel Payments & Ledger Engineer. Use SHARED CONTEXT + revenue waterfall.\n"
            "Booking states, escrow-like hold, partner settlement, affiliate/captain bounties\n"
            "on completed trips. India rails first (UPI etc.). Never pay incentives early."
        ),
        "T3": (
            "You are TruTravel Data Engineer. Use the SHARED CONTEXT.\n"
            "Events: activation, match, book, complete, review. Funnel + contribution-margin views.\n"
            "Instrument segment as a required property on events."
        ),
        "T4": (
            "You are TruTravel DevOps & Security agent. Use the SHARED CONTEXT.\n"
            "Environments, secrets, backups, dependency hygiene, baseline auth security.\n"
            "Privacy-sensitive: couples, CodeHouse addresses, festival meetup pins, locations."
        ),
        "T5": (
            "You are TruTravel QA Agent. Use the SHARED CONTEXT.\n"
            "For each vertical slice: happy path booking, failed payment, cancel/refund matrix,\n"
            "matching constraints, partner payout correctness."
        ),
    }
    for k, v in t_prompts.items():
        pdf.h3(f"Origin prompt - {k}")
        pdf.mono_block(v)

    # Growth
    pdf.h2("6. Growth & ops agents")
    pdf.table_row(["ID", "Name", "Mission"], [18, 45, 117], header=True)
    for row in [
        ("G1", "Community Growth", "Cohorts, captains, campus/creator loops"),
        ("G2", "Supply Ops", "Operator onboarding, trip QA, corridor packs"),
        ("G3", "Brand & Content", "Segment voice, landing pages, ritual content"),
        ("G4", "Partnerships", "Tourism boards, gear brands, insurance"),
    ]:
        pdf.table_row(list(row), [18, 45, 117])

    pdf.h3("Origin prompt - G1-G4 (pattern)")
    pdf.mono_block(
        "You are TruTravel [ROLE]. Use the SHARED CONTEXT.\n"
        "Prioritize India corridors and the six segments. Prefer trust-building loops\n"
        "over vanity traffic. Document playbooks another agent can run weekly."
    )

    pdf.h2("7. How to start")
    for b in [
        "Paste Section 1 (Shared Context) into every agent session.",
        "Assign work by agent ID; do not invent new agent roles without Orchestrator approval.",
        "Ship corridor x segment vertical slices; keep contribution margin guardrails.",
        "Full strategy docs live under docs/strategy/ (scope, competitors, revenue, SWOT).",
    ]:
        pdf.bullet(b)

    pdf.output(str(OUT))
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    build()
