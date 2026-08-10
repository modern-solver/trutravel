# Matching v0 Spec

**Owner:** P3 Matching Systems Designer  
**Principle:** Explainable rules + tags. No black-box magic without explanation.

## Hard constraints (must pass)

| Constraint | Applies to | Rule |
|------------|------------|------|
| Dates overlap | All | Traveler availability intersects departure window |
| Budget max | All | Seat price ≤ traveler max budget |
| Segment preference | All | Trip segment ∈ traveler interested segments (or explicit “explore”) |
| Capacity | All | Remaining seats ≥ requested seats |
| Fitness / difficulty | Thrilling | Traveler level ≥ trip minimum |
| Couple-only | Couple Getaways | Booking unit = 2; no solo seat sales |
| Work-style tags | CodeHouses | Quiet hours / cowork intensity compatibility (hard or soft—see below) |
| Event date lock | Music + Art Festivals | Departure must cover festival dates |

## Soft score (rank only; never hide hard fails)

Suggested weights (tune in beta):

| Signal | Weight |
|--------|--------|
| Shared interest tags | 0.30 |
| Age band proximity (if disclosed) | 0.10 |
| Pace preference (chill / balanced / packed) | 0.15 |
| Group size preference | 0.10 |
| Prior completed trips / reviews | 0.15 |
| Corridor interest | 0.10 |
| Language | 0.10 |

**Explainability:** UI shows top 3 reasons (“shared tags: hiking, sunrise; pace: balanced”).

## Profile tag dictionary (starter)

**Cross-segment:** chill · social · early-riser · night-owl · budget · mid · premium · photo-heavy · digital-detox  

**Thrilling:** trek · raft · climb · beginner · intermediate · advanced  

**Wellness:** yoga · meditation · detox · nature-walks  

**Trippy:** music · art · freestyle · conscious-community  

**CodeHouses:** deep-work · pair-programming · founder · designer · no-meeting-mornings  

**Festivals:** EDM · indie · classical · visual-arts · multi-day-camping  

## Edge cases

1. Solo tries Couple Getaway → hard block + CTA for dual invite.  
2. CodeHouse “loud nightlife” + “deep-work only” → soft penalty or hard house-rule conflict.  
3. Festival pack sold out stay but pass available → show logistics-only alternative if any.  
4. Oversubscribed departure → waitlist, no soft-score override of capacity.  

## Analytics events

`match_viewed`, `match_explained`, `join_requested`, `join_accepted`, `join_rejected` — always include `segment`.
