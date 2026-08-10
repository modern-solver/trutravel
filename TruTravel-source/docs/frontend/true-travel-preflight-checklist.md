# TruTravel Front-End — Pre-Flight Checklist (before running the Claude Code agent)

Do these before pasting the master prompt into a fresh Claude Code session. Items are grouped by how hard they **block** the build.

Legend: 🔴 hard blocker (agent can't meaningfully proceed) · 🟡 needed early (agent can start but will stall) · 🟢 nice-to-have / can decide during build.

---

## A. Environment & repo

- [ ] 🔴 **Node.js + package manager installed.** Node 20 LTS recommended; decide npm / pnpm / yarn. (This machine has Node.js installed — confirm the version.)
- [ ] 🔴 **Start the Claude Code session inside `C:\Users\shaun\TruTravel`** so it can read `docs/` directly.
- [ ] 🟡 **Git initialized + first commit** of the current docs, so the agent's scaffolding is a clean, reviewable diff. (Repo currently has `docs/` only — confirm whether it's already a git repo.)
- [ ] 🟢 Decide hosting/deploy target (Vercel / Netlify / other) — affects framework config but not core build.

## B. Decisions the agent needs from you (it cannot invent these safely)

- [ ] 🔴 **Confirm the tech stack.** Docs say only "web-first responsive app" and defer stack choice to constraints. Master prompt's default is **Next.js (App Router) + React + TypeScript + Tailwind + Radix**. Approve or override.
- [ ] 🔴 **First vertical slice.** Master prompt recommends **Himachal/Uttarakhand · Thrilling · 1 departure** (from the MVP brief). Confirm or pick a different corridor × segment.
- [ ] 🟡 **Brand hex values (M2 lock).** `04_design_tokens.md` says concrete hex is locked in M2 and is currently placeholder. Either provide the six segment palettes + neutrals now, or approve WCAG-AA placeholders that the agent centralizes for a one-file swap later.
- [ ] 🟡 **Typography licensing.** Inter + JetBrains Mono are both free/open — confirm you're happy using them (or name a licensed brand font and supply the files).
- [ ] 🟡 **Group Space scope for MVP.** Real-time chat vs. async board for v0 (docs mark this "soft" priority).
- [ ] 🟢 **Logo / wordmark / favicon.** If you have brand assets, drop them in the repo; otherwise the agent will use a text wordmark placeholder.
- [ ] 🟢 **Copy tone per segment.** The "how we travel" blurbs can be agent-drafted, but founder voice (or G3/A3 input) improves them.

## C. Accounts / API keys (front-end MVP needs very few — by design)

The MVP front-end runs against **mock data**, so most integrations are **not** required to start. Set these up only when you reach the relevant phase:

- [ ] 🟢 **Analytics** (e.g. PostHog/GA) — optional; the agent wires a typed event helper that can log to console until a key exists. Events must carry a `segment` property.
- [ ] 🟢 **Error monitoring** (e.g. Sentry) — optional for MVP.
- [ ] ⛔ **Payments (Razorpay/UPI) — do NOT wire a live gateway yet.** Checkout is a UI flow against mocks. Real payments belong to the backend "T2 Payments & Ledger Engineer", not this front-end pass. No live keys should be added by the agent.
- [ ] ⛔ **KYC / maps / real APIs** — out of scope for the front-end MVP; leave as mock/stub.

> If any account setup is required, **you** create the account and add keys to `.env.local` yourself — the agent must not create accounts, accept terms, or handle live secrets.

## D. Design assets & content (helps quality, not strictly blocking)

- [ ] 🟢 Placeholder trip imagery per segment (or approve the agent using neutral placeholders).
- [ ] 🟢 A realistic sample departure for the first slice (route, dates, price in ₹, capacity, captain/operator names) — or let the agent generate fixtures.
- [ ] 🟢 Cancellation/refund policy text to display at checkout (US-T05 requires it be shown before pay). Agent can draft, but real policy should come from you/legal.

---

## Human dependencies the agent will have (call these out to whoever runs it)

The front-end agent **depends on a human** for:

1. **Stack + slice sign-off** (Section B) — it should not scaffold until these are confirmed.
2. **Brand hex + fonts** — otherwise it ships flagged placeholders that need a later swap.
3. **Real cancellation/refund + segment policy copy** — legally sensitive; agent-drafted text must be reviewed.
4. **Any live integration** (payments, KYC, analytics keys) — agent stops at the mock boundary; a human provides accounts/keys.
5. **The absent backend/API contract** — there is no backend and no API spec yet (see blockers). The agent will invent a mock interface; when the real T1/T2 backend exists, someone must reconcile the two.

## Blockers & open questions (flag before/at kickoff)

- 🔴 **No code and no chosen framework exist** — the repo is documentation-only (`docs/` + a PDF + one Python helper). This is a true greenfield build; the stack decision gates everything.
- 🔴 **No backend / API contract** — front-end must be built against a typed mock layer, with the expectation that a real API replaces it later. Risk: mock shape may diverge from the eventual backend.
- 🟡 **Design tokens are placeholders** — hex values are explicitly "to be locked in M2." Building now means provisional colors.
- 🟡 **Matching v0 is specified but untuned** — weights are "tune in beta." The UI must show explainability regardless; scoring numbers are provisional.
- 🟡 **Segment scope is broad (6 product lines)** — equal structural weight is required, but only the first slice needs full depth. Confirm you want all six stubbed in the shell from day one (recommended) vs. one-at-a-time.
- 🟢 **Two unrelated Grok chats exist on grok.com** ("WhatsApp POS Agents…") — these are a *different* project (a restaurant/rental WhatsApp POS backend) and were **excluded** from this front-end context. Confirm that's correct if you expected them to be relevant.
