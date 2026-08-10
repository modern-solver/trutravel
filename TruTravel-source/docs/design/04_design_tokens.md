# Design Tokens (v0.1 placeholder)

Concrete hex values to be locked in M2 prototype. Structure is fixed now.

## Typography

| Token | Role | Suggestion |
|-------|------|------------|
| `font.sans` | UI | Inter / system UI |
| `font.mono` | Codes, IDs, ledgers | JetBrains Mono / system mono |
| `text.xs`–`text.2xl` | Scale | 12 / 14 / 16 / 20 / 24 / 32 |

## Spacing & grid

- Base unit: **4px**  
- Page max width: **1200px**  
- Card radius: **8px** (technocratic: low radius, not bubbly)  

## Neutral palette

| Token | Use |
|-------|-----|
| `bg.app` | App background |
| `bg.surface` | Cards |
| `border.subtle` | Dividers |
| `text.primary` | Body |
| `text.muted` | Secondary |
| `state.success` / `warn` / `danger` | Status |

## Segment color tokens

`segment.trippy`, `segment.thrill`, `segment.wellness`, `segment.couple`, `segment.codehouse`, `segment.festival`  
Each exposes: `fg`, `bg`, `border`, `chip`.

## Motion

- Duration short: 120–180ms  
- Prefer opacity/position; avoid gratuitous parallax  
