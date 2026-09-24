# Alendei Media — Website

A one-page marketing site for **Alendei Media** (360° media & marketing, from Bharat). It follows the
[Agenius Framer template](https://agenius.framer.website/): cream canvas, condensed Oswald display type,
pastel sections with scalloped edges, spinning sticker badges, doodle illustrations, a showreel that grows
out of concentric rings, and scroll-driven reveals throughout.

Copy comes from the *Alendei × Agenius content mapping deck (v2)*, mapped section by section.

## Stack

- [Vite](https://vite.dev) for the static build (plain HTML/CSS/JS, no framework)
- [GSAP](https://gsap.com) + ScrollTrigger for the scroll animations
- [Lenis](https://lenis.darkroom.engineering) for smooth scrolling
- Oswald + Inter, self-hosted via Fontsource

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # serve the production build
```

`dist/` is a static site. It deploys as-is to Vercel, Netlify, Cloudflare Pages, GitHub Pages or any web host.

## Structure

```
index.html              All page content and markup (edit copy here)
src/main.js             Animations, smooth scroll, menu, accordions, dialogs, contact form
src/cases.js            Case-study modal content
src/styles/base.css     Design tokens, buttons, stickers, scallops, keyframes
src/styles/sections.css Section layouts + responsive rules
public/assets/          Images (webp), doodles (svg), sticker shapes, showreel video, logo
```

### Sections (in page order)

1. Hero: wordmark, rotating stickers, and a showreel that expands from a ring into full screen
2. Promise cards (3)
3. Brands: sector tiles riding a sine wave
4. Why Alendei exists: five vendor cards collapse into "one roof" (pinned, scroll-scrubbed)
5. Numbers: 8-stat grid with count-up
6. Services: 4-pillar accordion
7. Media Network: animated Metro → Tier-3 radar and 6 animated stat cards
8. Ticker bands
9. Benefits: 6-card bento
10. Work: 4 case cards with a modal
11. Process: 4 steps, pinned step-through on desktop
12. Built different: comparison table
13. Testimonials: video tiles and a quote rail
14. Engagement models (no pricing)
15. Leadership message, About, and team crews
16. FAQs
17. Contact form, office details and a map
18. Footer

## Before launch: content to supply or confirm

The deck flags several items as **SUPPLY** / **CONFIRM**. These are placeholders in the build:

| Item | Where | What to do |
| --- | --- | --- |
| **Testimonials** | `index.html` → `#reviews` | Placeholder quotes with role-only attributions. **Replace them with real, approved client quotes. Never ship invented ones.** Replace the two video tiles with real testimonial videos (they currently open the showreel). |
| **Case studies** | `index.html` → `#work`, `src/cases.js` | Illustrative campaigns from the deck's suggested mix. Swap in real campaigns, visuals and outcomes. |
| **Client logos** | `index.html` → `.wave__tile` | Sector tiles stand in for logos. Replace them with 8–15 real client logos, or anonymised wordmarks for NDA clients. |
| **Network numbers** | `#numbers`, `#network` | 125+, 1,200+, 200+, 400+, 600+, 800+ and 15+ come from the deck. Verify each against real inventory. |
| **Leadership quote** | `#about .leader` | Attributed to "Leadership, Alendei Media". Add the founder's name and title. |
| **Team** | `#about .crew` | Department cards with doodles. Replace them with real team photos, names and roles if you want people shown. |
| **Showreel** | `public/assets/video/` | A 20s montage of licensed stock footage. Replace it with the real 30–60s reel. Keep `showreel.mp4` (720p) and `showreel-sm.mp4` (360p) plus the poster. |
| **Socials** | Footer | LinkedIn, Instagram and Facebook link to the handles on alendei.com. Add YouTube and X once confirmed. |
| **Phone / email** | Contact, menu, footer | Currently care@alendei.com and +91 91270 70912, from alendei.com. Confirm these are the public contacts for Media. |

## Contact form

By default the form checks its fields, then opens the visitor's email app with the brief addressed to
`care@alendei.com`. To post submissions to a form service instead (Formspree, Basin, a serverless function and so on),
set `FORM_ENDPOINT` at the top of `src/main.js`. It sends JSON: `{ name, email, phone, message }`.

## Theming

Colours are CSS variables at the top of `src/styles/base.css`. The ink colour (`--ink`) is a deep Alendei green to match
the logo. Set it to `#3B001B` for the original Agenius maroon.

## Accessibility & performance

- Respects `prefers-reduced-motion`: smooth scroll, pinning and reveals switch off, and every section shows in its final state.
- Headings keep readable `aria-label`s when split into letters for animation. Accordions use `aria-expanded`. Dialogs are native `<dialog>`.
- If the script fails to load, a 4-second failsafe reveals all content.
- Images are WebP and lazy-loaded. The hero video pauses when off-screen, and phones get a 360p version.

## Credits & licences

- Illustrations: [Open Doodles](https://www.opendoodles.com) by Pablo Stanley (CC0), rendered from `react-open-doodles`
- Photos: [Unsplash](https://unsplash.com) (Unsplash License)
- Showreel footage: [Mixkit](https://mixkit.co) (Mixkit Stock Video Free License)
- Logo: Alendei brand asset
- Layout and motion reference: Agenius Framer template
