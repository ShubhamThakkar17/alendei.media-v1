# Alendei Media Website

The marketing site for **Alendei Media** (360° media and marketing from Bharat). It follows the
[Agenius Framer template](https://agenius.framer.website/): cream canvas, condensed Oswald display type,
pastel sections with scalloped edges, spinning sticker badges, doodle illustrations, a showreel that grows
out of concentric rings, and scroll animations throughout.

There are two pages: the home page (`index.html`) and a careers page (`careers.html`).

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
index.html              Home page content and markup (edit copy here)
careers.html            Careers page
partials/               Shared nav, footer and icon sprite, inlined into both pages at build time
vite.config.js          Builds both pages and handles the <!-- include:partials/... --> tags
src/main.js             Animations, smooth scroll, menu, FAQ, dialogs, forms
src/cases.js            Case study modal content
src/styles/base.css     Design tokens, buttons, stickers, scallops, keyframes
src/styles/sections.css Section layouts, careers page and responsive rules
public/assets/          Images (webp), team photos, doodles (svg), sticker shapes, showreel video, logo
```

The nav and footer live in `partials/` so a change there updates both pages.

### Home page sections (in order)

1. Hero: wordmark with four stickers, and a showreel that grows from a ring to full screen
2. Promise cards (3)
3. Brands: industry tiles riding a wave
4. Why Alendei exists: five vendor cards collapse into one "One roof. Every channel." circle
5. Numbers: 8 stats that count up
6. Services: 4 stacking cards that pile up as you scroll
7. Media Network: animated Metro to Tier 3 radar and 6 animated stat cards
8. Ticker bands
9. Benefits: 6 card bento
10. Work: 4 case cards with a popup
11. Process: 4 steps, held on screen while you scroll on desktop
12. Built different: comparison table
13. Testimonials: video tiles and a quote rail
14. Engagement models (no pricing)
15. Founders' message, About, and Leadership (Priyang Patel, Prinsal Parikh, Pinak Agrawal) with a link to Careers
16. FAQs
17. Contact form, office details and a map
18. Footer

### Writing style

Site copy avoids em dashes, en dashes and hyphens used as dashes. Keep that going when you edit: use a comma,
a full stop or "and" instead.

## Before launch: content still to supply or confirm

| Item | Where | What to do |
| --- | --- | --- |
| **Testimonials** | `index.html` → `#reviews` | Placeholder quotes with role-only attributions. **Replace them with real, approved client quotes. Never ship invented ones.** The two video tiles currently open the showreel; swap in real testimonial videos. |
| **Case studies** | `index.html` → `#work`, `src/cases.js` | Example campaigns based on the content deck. Swap in real campaigns, visuals and outcomes. |
| **Client logos** | `index.html` → `.wave__tile` | Industry tiles stand in for logos. Replace them with 8 to 15 real client logos, or plain wordmarks for clients under NDA. |
| **Network numbers** | `#numbers`, `#network` | 125+, 1,200+, 200+, 400+, 600+, 4,000+ influencers and 15+ years. Check each against real inventory. |
| **Founders' quote** | `#about .leader` | Signed "The founding team, Alendei Media". Put one founder's name on it if you prefer. |
| **Showreel** | `public/assets/video/` | A 20 second montage of licensed stock footage. Replace it with the real reel. Keep `showreel.mp4` (720p), `showreel-sm.mp4` (360p) and the poster. |
| **Socials** | `partials/footer.html` | LinkedIn, Instagram and Facebook link to the handles on alendei.com. Add YouTube and X once confirmed. |

## Contact details used

- Business enquiries: **pinak@alendei.com**, +91 91270 70912, WhatsApp +91 95128 58588
- Careers: **hr@alendei.com**
- Office: Iscon Atria-2, 302, Gotri Rd, opp. GETRI, Gotri, Vadodara, Gujarat 390007

## Forms

Both forms check their fields, then open the visitor's email app with a ready-to-send message. The contact form
goes to `pinak@alendei.com` and the careers form goes to `hr@alendei.com` (set by `data-to` on each `<form>`).
Applicants are asked to attach their CV before sending, since a mailto link can't carry attachments.

To post submissions to a form service instead (Formspree, Basin, a serverless function and so on), set
`FORM_ENDPOINT` at the top of `src/main.js`. It sends JSON with the form fields plus `_to` and `_subject`.

## Theming

Colours are CSS variables at the top of `src/styles/base.css`. The ink colour (`--ink`) is a deep green that goes
with the logo. Set it to `#3B001B` for the original Agenius maroon.

## Accessibility & performance

- Respects `prefers-reduced-motion`: smooth scroll, pinning and reveals switch off, and every section shows in its final state.
- Headings keep readable `aria-label`s when split into letters for animation. The FAQ uses `aria-expanded`. Dialogs are native `<dialog>`.
- If the script fails to load, a 4 second failsafe reveals all content.
- Images are WebP and lazy loaded. The hero video pauses when off screen, and phones get a 360p version.

## Credits & licences

- Illustrations: [Open Doodles](https://www.opendoodles.com) by Pablo Stanley (CC0), rendered from `react-open-doodles`
- Photos: [Unsplash](https://unsplash.com) (Unsplash License)
- Showreel footage: [Mixkit](https://mixkit.co) (Mixkit Stock Video Free License)
- Logo and leadership photos: Alendei brand assets
- Layout and motion reference: Agenius Framer template
