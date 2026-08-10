# Key Screens & Information Architecture (v0.1)

## Primary nav

1. Discover (segment home)  
2. Matches  
3. Trips (my bookings)  
4. Community / Group (post-book)  
5. Profile  

Partner/Captain modes: secondary shell or role switch.

## Screen list (MVP)

| Screen | Purpose | P0 |
|--------|---------|----|
| Segment Home | Choose archetype + browse | Yes |
| Trip Detail | Itinerary, group, trust, price | Yes |
| Departure Seat Map / roster summary | Who’s joining | Yes |
| Profile & Prefs | Tags + constraints | Yes |
| Match Panel | Ranked departures + reasons | Yes |
| Checkout | Pay INR, policy accept | Yes |
| Booking Confirmation | Next steps, group access | Yes |
| Group Space | Chat / pins / docs | Soft |
| Captain Roster | Host tools | Yes |
| Operator Dashboard (lite) | Departures + seats | Yes |
| Admin QA | Approve trips | Yes |

## Critical flow: book

```
Segment Home → Trip Detail → Match/Eligibility check
  → Request or Instant Join → Checkout → Paid
  → Group unlock → Pre-trip checklist → Complete → Review
```

## Empty & error states (design must specify)

- No trips in segment for corridor  
- Hard constraint fail (with fix CTA)  
- Payment fail  
- Waitlist only  
