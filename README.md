# Arman & Elen — Moonshine wedding invitation

A pixel-faithful clone of the **Moonshine** template from belleame.am, with:

- Names: **Արման & Էլեն** (ARMAN & ELEN)
- Date: **23.07.2026**
- Slightly lighter "soft charcoal cream" palette (warm dark `#4a4239` instead of pure black)

## Stack
- Plain HTML / CSS / JS — no build step, no frameworks
- Mobile-first; centered max-width 540 column on desktop

## Files
- `index.html` — markup
- `styles.css` — all styling + animations
- `script.js` — cover open, scroll reveals, parallax moons, countdown, form
- `assets/svg/moon_from_uploaded_photo.svg` — original moon SVG (unused at runtime)
- `assets/img/moon-1024.webp` / `moon-600.webp` — moon raster (extracted, optimized)
- `assets/img/*-placeholder.svg` — see "Photos to replace" below

## Run locally
```bash
python3 -m http.server 5500
```
Then open <http://127.0.0.1:5500>.

Dev URL helpers:
- `?open` — auto-opens the cover (skips the click step)
- `?seeall` — auto-opens cover **and** force-reveals every section (for visual QA)

## Photos to replace
The placeholder SVGs are intentionally muted gradients. Drop your real photos in `assets/img/` with the same filenames or update the `<img src="…">` paths in `index.html`.

| File | Where it appears | Suggested aspect |
| --- | --- | --- |
| `assets/img/cover-placeholder.svg` | The big tap-to-open cover photo | portrait, ~3:4 |
| `assets/img/couple-detail-placeholder.svg` | Framed photo floating in the cosmic section | portrait, ~3:4 |
| `assets/img/dress-1-placeholder.svg` | Top-left dress-code tile (white dress) | portrait, ~3:4 |
| `assets/img/dress-2-placeholder.svg` | Right tall dress-code tile (black dress) | portrait, ~2:3 |
| `assets/img/dress-3-placeholder.svg` | Bottom-left dress-code tile (groom) | portrait, ~3:4 |

## Sections
1. **Cover** — frame + click-to-open with photo expansion + names/date fade-in
2. **Welcome** — "Հարգելի՛ հյուրեր" greeting + July 2026 calendar with the 23rd marked by a glowing heart
3. **Wedding Program** — framed couple photo floats over a starfield with two moons; a cream curve sweeps in revealing the church and restaurant blocks
4. **Timeline** — 10:00 / 12:00 / 14:00 / 15:00 / 17:00 schedule with vertical line + dots
5. **Dress code** — DRESS CODE / Cocktail title + 3-image grid + preferred-tones swatches
6. **Details** — DETAILS heading + Telegram-group CTA
7. **RSVP** — cream→dark curved transition, italic-serif RSVP, form with attendance + side fields
8. **Countdown** — orbit-lined moons + days/hours/minutes/seconds counting to 23 Jul 2026, 14:00 (UTC+4)
9. **Finale** — "LOVE YOU TO THE MOON AND BACK" + Belle ame mark + contact icons + copyright

## Animations
- Reveal-on-scroll via `IntersectionObserver` (`.reveal` / `.reveal-parent` with `.is-in`)
- Two slow-drifting starfield layers with reverse parallax moons
- `floatY` ease-in-out vertical bob on every moon
- `heartPulse` glow on the calendar marker
- Cover opens via `inset` transition (1.4 s soft-cubic) + delayed names/date fade
- Countdown uses `requestAnimationFrame`-friendly 1 s setInterval
- All durations & easings tuned to mimic the reference video's pacing
