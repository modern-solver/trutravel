# Segment Visual OS (v0.1)

Six product lines share one grid/type system; tokens differ by segment.

| Segment | Code | Hue intent (placeholder) | Tone keywords | Icon metaphor (not final art) |
|---------|------|--------------------------|---------------|-------------------------------|
| Trippy Tours | `trippy` | Magenta / violet | freestyle, conscious, artful | Prism / waveform |
| Thrilling Tours | `thrill` | Amber / high-contrast | sharp, kinetic, altitude | Peak / bolt |
| Wellness Tours | `wellness` | Sage / soft teal | calm, breath, reset | Leaf / circle |
| Couple Getaways | `couple` | Deep rose / charcoal | private, intimate, dual | Twin node |
| CodeHouses | `codehouse` | Electric blue / slate | builder, focus, terminal | Grid / bracket |
| Music + Art Festivals | `festival` | Neon accent on dark | lineup, night, crew | Stage / frame |

## Shared components (must accept `segment` prop)

- `SegmentChip`  
- `TripCard`  
- `MatchPanel`  
- `DepartureStatus`  
- `PriceBand`  
- `TrustRow`  

## Home layout (IA)

```
[ Logo | Search | Profile ]
[ Segment rail: 6 equal tabs/cards ]
[ Featured departures in active segment ]
[ Match suggestions (explainable) ]
[ Corridor packs ]
```

## Content rituals (G3 alignment)

Each segment gets a short “how we travel” blurb on first entry—never moralizing, always operational (pace, group norms, packing, safety).
