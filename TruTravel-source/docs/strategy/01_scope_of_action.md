# TruTravel — Scope of Action

## Mission (north star)

Build a trust-first group-travel community where users discover **like-minded co-travelers** and **book curated group trips** across **six segments**, starting in India, with a partner ecosystem (locals, affiliates, volunteers) that scales without destroying margin.

## Segment OS (v1.1)

| # | Segment | One-line job |
|---|---------|----------------|
| 1 | Trippy Tours | Free-spirited group travel with conscious vibe culture |
| 2 | Thrilling Tours | Adrenaline / adventure skill-challenge groups |
| 3 | Wellness Tours | Reset, yoga, mind-body curated groups |
| 4 | Couple Getaways | Privacy-first dual-traveler packages (not dating) |
| 5 | CodeHouses | Builder/creative co-living workations + local exploration |
| 6 | Music + Art Festivals | Festival/art-circuit crew travel + logistics (+ pass attach) |

## In scope (Phase 0–2, ~0–6 months)

| Layer | Deliverables |
|--------|----------------|
| **Product / UX** | Segment-first home (6 categories); trip cards; traveler profile + psychographic tags; join/request-to-join flow; group chat (MVP); safety basics (verified badge, emergency contacts) |
| **Supply** | Curated inventory for India corridors (Himalayas, Goa/Konkan, Rajasthan, Kerala, Northeast, Andamans); local operator onboarding; volunteer trip hosts |
| **Demand** | Waitlist → invite cohorts; content loops per segment; referral program |
| **Commerce** | Booking + payment (INR first); cancellation policy engine; partner payout ledger |
| **Trust & ops** | KYC lite for hosts; trip QA checklist; incident playbook; review system |
| **Tech foundation** | Web-first responsive app; auth; trip catalog API; matching v0 (rules + tags); analytics events |
| **Strategy docs** | This package formalized into `docs/` artifacts the swarm can own |

## Explicitly out of scope (first 6 months)

- Full hotel/flight OTA  
- Own ground fleet or insured tour-operating license depth beyond partner model  
- Global multi-currency multi-locale beyond English + INR  
- AI chat “travel agent” as primary surface (assistive later)  
- Dating-first positioning (Couple Getaways = trip type, not a dating app)  
- Building physical CodeHouse real estate (package/partner co-living inventory; not landlord day-1)  
- Becoming a primary festival ticket seller (affiliate/partner passes first)  
- Heavy native apps before product-market fit signals  

## Primary user jobs-to-be-done

1. “Find people who travel like I do.”  
2. “Join a trip that matches my energy (trippy / thrill / wellness / couple / codehouse / festival).”  
3. “Trust the group and the operator enough to pay.”  
4. “Hosts/partners: fill seats without race-to-bottom discounting.”

## Success metrics (90 days post-launch MVP)

| Metric | Target |
|--------|--------|
| Activated travelers (profile + segment prefs) | 2,000 |
| Completed bookings | 150–300 seats |
| Trip GMV | ₹40–80L |
| Repeat intent (NPS / “would rebook”) | NPS ≥ 40 |
| Partner contribution margin after incentives | ≥ 18–22% of trip take |
| Safety incidents unresolved > 48h | 0 |

## Workstreams

```
W0 Strategy & Brand     → positioning, segments, tone, legal shell
W1 Product & Design     → technocratic UI system, flows, design tokens
W2 Supply Ops           → corridors, partners, trip SKUs, QA
W3 Platform Engineering → app, APIs, payments, matching v0
W4 Growth & Community   → cohorts, content, referrals, volunteers
W5 Revenue & Finance    → take rates, partner tiers, unit economics
W6 Trust & Compliance   → KYC, policies, insurance partnerships
```

## Decision rights (lightweight RACI)

- **Founder:** brand, category definitions, pricing floor, partner exclusivity  
- **Architect (swarm lead):** technical boundaries, agent prompts, milestone gating  
- **Ops:** supply QA, incident response  
- **Product:** UX specs within brand rails  
