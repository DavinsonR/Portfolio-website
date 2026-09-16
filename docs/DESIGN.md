---
name: Davirson Novoa — Research Tear Sheet
description: A candidate read the way an analyst reads an asset: verdict first, figures in a band, evidence below, disclosures at the foot.
colors:
  paper: "#ffffff"
  band: "#f4f6f8"
  band2: "#e9edf1"
  rule: "#d8dde3"
  rulesoft: "#e8ecf0"
  ink: "#14181d"
  body: "#454e57"
  muted: "#626c76"
  cold: "#0f4c81"
  coldsoft: "#e6eef7"
  coldline: "#b9cfe4"
  warm: "#96551a"
  warmsoft: "#f7efe5"
  pos: "#1a6b48"
  neg: "#9c2b2b"
  building: "#805f0f"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(30px, 4.4vw, 44px)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  verdict:
    fontFamily: "Source Serif 4, ui-serif, Georgia, serif"
    fontSize: "clamp(27px, 3.8vw, 38px)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "normal"
  figure:
    fontFamily: "Source Serif 4, ui-serif, Georgia, serif"
    fontSize: "clamp(34px, 4.4vw, 46px)"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "\"tnum\" 1"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(23px, 2.9vw, 31px)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  lede:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(19px, 2.2vw, 23px)"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16.5px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.7
    fontFeature: "\"tnum\" 1, \"cv05\" 1"
  bodySmall:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12.5px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.09em"
rounded:
  control: "3px"
  focus: "2px"
  pill: "9999px"
spacing:
  hairline: "4px"
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "28px"
  xl: "44px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.cold}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    typography: "{typography.bodySmall}"
  button-primary-hover:
    backgroundColor: "{colors.cold}"
    textColor: "{colors.paper}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
  button-outline-hover:
    textColor: "{colors.cold}"
  lang-switch:
    backgroundColor: "{colors.coldsoft}"
    textColor: "{colors.cold}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "36px"
  icon-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.body}"
    rounded: "{rounded.control}"
    height: "36px"
    width: "36px"
  chip-stack:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.body}"
    rounded: "{rounded.control}"
    padding: "4px 10px"
    typography: "{typography.label}"
  status-pill-live:
    textColor: "{colors.pos}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  figure-band:
    backgroundColor: "{colors.coldsoft}"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "16px 24px 24px"
  availability-block:
    backgroundColor: "{colors.warmsoft}"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "20px 20px"
  navbar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.body}"
    rounded: "0"
    padding: "14px 24px"
    height: "61px"
---

# Design System: Davirson Novoa — Research Tear Sheet

## Overview

**Creative North Star: "The Research Tear Sheet"**

This is a document, not an interface. The reader is a hiring analyst who reads assets for a living: verdict at the top, figures in a ruled band, evidence below, disclosures at the foot. Everything the system does follows from that arrangement. Structure is carried by hairline rules and banded rows — the sheet's own grammar — and never by boxes floating over a ground. Light is the home state because the audience reads in a bright office and prints; dark is a real second theme re-stepped against its own ground (#0e1216), not an inversion of the light one.

The palette is a two-voice instrument on a paper ground. Institutional blue owns whole bands and every technical claim; amber marks human and purpose content only, and nothing else. Type is two faces, committed: Archivo for all UI and prose, Source Serif 4 reserved for figures set large and for the one verdict line. Figures are tabular everywhere, wired at the body so every column of numbers aligns without per-element work.

The build refuses, explicitly and by name, the dark developer-portfolio arrangement it replaced: mono type, neon accents, terminal chrome, and a terminal-styled navigation bar. It also refuses ornament that would make it feel like a product page — no cards, no shadows, no gradients, no glow.

**Key Characteristics:**
- Paper-white ground with near-black ink; dark theme re-stepped, never inverted
- Hairline rules and full-bleed tinted bands as the only structural devices
- Institutional blue for data and technical claims; amber for human/purpose content only
- Two faces: Archivo everywhere, Source Serif 4 for large figures and the verdict
- Tabular figures at the body level; every number aligns
- Zero shadows, zero cards, 3px radius on controls and nothing else
- Motion in the register of print — rules drawn, rows settled, figures counted — disabled entirely under reduced-motion

## Colors

A paper-and-ink base with exactly two accent voices, each with a jurisdiction it never leaves.

### Primary
- **Institutional Blue** (`cold`, 8.1:1 on paper): The technical voice. It owns the figures band as a full-bleed tint (`coldsoft`) capped by a 2px rule, the primary action buttons, the verdict line, section labels that carry a data claim, the skill indicator segments, the chart series, the focus ring, and the selection highlight. When blue appears, the content is a measurement or a technical claim.
- **Blue Wash** (`coldsoft`) / **Blue Hairline** (`coldline`): The band tint and its internal column dividers. These are the blue's structural form, used when a whole region is technical rather than a single phrase.

### Secondary
- **Reserved Amber** (`warm`, 6.0:1 on paper): The human voice, and nothing else. Three places in the shipped build carry it: the availability block in the first viewport (2px top rule plus `warmsoft` ground), the hiring/contact section's 2px top rule, and the CV's career-transition passage label. Data and technical claims never wear amber.
- **Amber Wash** (`warmsoft`): The availability block's ground; the only tinted surface that isn't blue.

### Tertiary
- **Verdict Green** (`pos`, also `live`): Positive standing — remote-mode tags, the live pipeline dot, the pipeline status pill.
- **Verdict Red** (`neg`): Negative standing in figures. Present in the token set and reserved for it.
- **Caution Ochre** (`building`, 5.9:1 on paper): The one status that is neither settled nor technical — work in progress. Its value is set by the *tinted* pill, not by the plain text: at the previous `#8a6a10` the 10%-ground pill measured 4.44:1 and failed AA in the only place the colour is ever used.

### Neutral
- **Paper** (`paper`): The page ground, and the text color on filled buttons. In dark it is #0e1216, a cool near-black chosen against its own ramp.
- **Band** (`band`) / **Band Deep** (`band2`): Full-bleed neutral bands that separate a region without drawing a box; the disclosures section rides on `band`.
- **Rule** (`rule`) / **Soft Rule** (`rulesoft`): The 1px hairlines that carry all structure. `rule` divides content rows and outlines controls; `rulesoft` divides metadata from content and separates sections at lower contrast.
- **Ink** (`ink`, 15.8:1): Headings, figure values, and any phrase the reader must not miss. Also the fill of the secondary dark button.
- **Body** (`body`, 8.4:1): Running prose.
- **Muted** (`muted`, 5.4:1): Metadata — dates, periods, tracked-caps labels, chart axis text.

### Named Rules

**The Amber Reservation Rule.** Amber marks human and purpose content only: availability, hiring, the career-transition passage. Every data point, metric, and technical claim wears institutional blue or ink. This rule is binding, it predates the redesign, and getting it backwards was a live review finding — an amber number is a bug.

**The Two-Voice Rule.** A surface has exactly two accents. If a new state needs a color, it takes one of the four verdict/status hues (`pos`, `neg`, `live`, `building`) — it does not invent a third accent.

**The Re-Stepped Dark Rule.** The dark theme is authored against #0e1216 with its own ink ramp and its own accent steps (blue lightens to #74b0e4, amber to #d9a05b). Never derive dark by inverting or filtering the light values; each step is chosen for contrast on its own ground.

**The Band, Not the Box Rule.** A region is set apart by a full-bleed tint (`coldsoft`, `warmsoft`, `band`) capped with a 1–2px rule. It is never set apart by a bordered, rounded, floating container.

## Typography

**Display Font:** Archivo (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Archivo (same face; the system runs on one grotesque)
**Figure Font:** Source Serif 4 (with ui-serif, Georgia, serif)

**Character:** Archivo is the grotesque of American financial print — tight, high-contrast at weight, unglamorous. Source Serif 4 enters only where a printed sheet would set a number large, which makes every serif appearance read as a figure the reader is meant to weigh. Two faces, no third.

### Hierarchy
- **Display** (800, clamp 30–44px, 1.08, -0.03em): The name at the top of the sheet. Once per document.
- **Verdict** (Source Serif 4, **600**, clamp 27–38px, 1.1, blue): What this asset is, stated once, large, in the serif. The single most important line in the build — and it is set at 600 because at 400 it carried 29% of the name's ink mass and lost the first fixation to an 800-weight grotesque. Under it, the two other names a posting gives the same role, at the Body Small step in `muted`.
- **Figure** (Source Serif 4, 400, clamp 34–46px, 1.0, tabular): The four values in the figures band and any number set large. Ink at rest, blue on hover of its own proof link.
- **Headline** (700, clamp 23–31px, 1.15, -0.02em): Section titles.
- **Lede** (600, clamp 19–23px, 1.35, -0.015em, balanced): The thesis line under the name; one per surface.
- **Title** (600–700, 16.5–21px): Row and article headings inside a section.
- **Body** (400, 15–15.5px, 1.7, max 62–70ch): Running prose.
- **Body Small** (400, 14–14.5px, 1.55–1.65): Dense rows, capability details, the availability block, footer.
- **Label** (600, 12–12.5px, 0.08–0.09em, uppercase, muted or blue): Tracked-caps metadata — the classification line, field labels (`PROBLEM`, `BUILT`, `WHY IT MATTERS`), the figures band label, section eyebrow labels on the CV. Muted by default; blue when the field carries a technical claim.

### Named Rules

**The 14px Floor Rule.** No prose is set below 14px. This answered a real accessibility complaint. The 12–12.5px step exists only for tracked-caps metadata labels — never for a sentence a reader has to read.

**The Serif-Is-A-Figure Rule.** Source Serif 4 appears only on numbers set large and on the single verdict line. A serif paragraph, a serif heading, or a serif button does not exist in this system.

**The Tabular Everywhere Rule.** `font-variant-numeric: tabular-nums` with `"tnum" 1, "cv05" 1` is wired at the body. Numbers align in columns across the whole document by default; nothing opts out.

**The Label-Is-A-Field Rule.** Tracked caps label a field, a band, or the document itself (the classification line, which is native to the form). They do not sit above a headline as a decorative kicker.

## Layout

One centered column, `max-w-[1080px]` with `px-6` gutters on the home surface; the CV re-derives the same rhythm at `max-w-[980px]` and the project surface at the same measure. Sections are separated by `border-b border-rule` and breathe on `py-14` to `py-16` (56–64px); the CV uses `py-14` with `border-t border-rulesoft` for lower-contrast internal separation.

The document header is a two-column grid at `lg` (`minmax(0,1fr)_300px`): the verdict column and the availability block, which sits `self-start` so it aligns to the top of the ink rather than stretching. Below it, the figures band runs full-bleed at the viewport while its contents stay in the 1080px measure — the band is the only element allowed to break the column.

Figures are a 2-up grid on mobile, 4-up at `lg`, divided by `border-l border-coldline` with the first column's border and padding suppressed. Content grids elsewhere are 2-up (`sm`) to 3-up (`lg`) for capabilities and a 1.35:1 split for track record versus the skill scale.

Measures are capped in `ch`, not px: 40ch for the lede, 62–70ch for prose, 58ch for dense disclosure text, 46ch for sidebar notes, 24ch for the closing headline. Vertical rhythm runs on a 4px base with the working steps at 8/12/20/28/44/64px.

The navigation is `sticky top-0 z-50` at 61px with a 95%-opacity paper ground and a light backdrop blur, capped by a hairline. A `no-print` class removes the nav and theme control from print, and print forces pure white ground with black text — the sheet is expected to be printed.

## Elevation & Depth

**This system has no shadows.** Not one `box-shadow` ships in the build. Depth is entirely tonal and linear: a hairline rule, a heavier 2px rule to open a band, and a tinted ground to mark a region's jurisdiction. The three-level vocabulary is: page ground (`paper`), banded region (`band`, `coldsoft`, `warmsoft`), and rule (`rulesoft` → `rule` → 2px `ink`/`cold`/`warm`). Weight of rule signals importance of boundary; nothing lifts.

The only surface effect anywhere is the navbar's translucent ground with `backdrop-blur-sm`, which exists so text passing under the bar doesn't collide with the nav text — not to suggest a floating plane.

### Named Rules

**The Flat Sheet Rule.** No shadow, no glow, no gradient, no elevation of any kind. If a region needs to separate, it takes a rule or a band. A drop shadow anywhere in this system is a defect.

**The Rule-Weight Rule.** 1px `rulesoft` divides metadata; 1px `rule` divides content rows; 2px in `ink`, `cold`, or `warm` opens a major band and declares its voice.

## Shapes

The form language is rectangular. Bands, rows, blocks, and the availability aside all have square corners (0 radius) — a tear sheet does not round its columns. Radius exists only on interactive controls at **3px**, just enough to read as pressable, plus 2px on the focus ring and full-round on two elements whose meaning is roundness: the status pill and the live-pipeline dot. The skill-scale segments carry a 1px radius so ten adjacent bars don't read as one solid rail.

Borders are 1px by default and 2px when opening a band. Underlines are structural too: figure labels carry a 1.5px blue underline at 4px offset that thickens to 2.5px on hover, and links in the availability block underline in amber at 50% opacity.

Icons are inline SVG drawn at a single 1.3px stroke weight on a 16px box. No icon font, no emoji, no third-party icon package.

## Components

### Buttons
- **Shape:** Barely-rounded rectangle (3px), no shadow, no transform on hover.
- **Primary:** Institutional blue ground, paper text, 600 weight, `px-5 py-3` at 14.5px (`px-4 py-2.5` at 14px in dense contexts). Hover fades to 90% opacity.
- **Ink:** Same geometry filled with `ink` — used for the secondary strong action on a surface that already spent its blue (the live-demo link).
- **Outline:** Paper ground, `rule` hairline border, ink text. Hover moves both border and text to blue. This is the download/secondary pair to every primary.
- **Text link:** Blue, 500–600 weight, underline on hover; the closing section's social links are this.
- **Focus:** Global — 2px blue outline at 2px offset with a 2px radius. Never removed, never restyled per component.

### Chips
- **Style:** `rule` hairline border, transparent or `band` ground, body text at 12.5–13px, 3px radius, `px-2.5 py-1`. Used for stack tags. No fill, no accent — a stack tag is not a claim.
- **Status Pill:** Fully rounded, 11px tracked caps, tinted from its own status hue (10% ground, 35% border, full-strength text) so it stays legible on paper and on the dark ground alike.

### Cards / Containers
**There are no cards.** Cards were removed from all three surfaces during review. A grouping is expressed as: a top rule of the appropriate weight and color, optional tinted ground, and internal padding of `px-5 py-4`/`py-5`. The availability block and the "why it matters" callout are the canonical examples — both are open blocks, not enclosed boxes.

### Navigation
Sticky hairline-capped bar on a 95% paper ground. Wordmark in Archivo 600 at 15px in ink; links at 14px 500 in body, hovering to blue; no underline, no active-state pill. The right cluster is three controls at 36px height: a **labelled** language switch (blue-on-blue-wash with a `coldline` border — labelled because a dim glyph in the previous build went unfound by reviewers), an outlined icon-only theme toggle, and a blue contact button **present at every width**. Mobile drops the center links entirely rather than collapsing them into a menu, but never the contact button: it is the site's only conversion control, and hiding it below `sm` removed it from the one device where the link arrives from LinkedIn. The wordmark truncates before the button is dropped.

### Figures Band
The signature component. A full-bleed `coldsoft` region opened by a 2px blue rule, carrying a tracked-caps blue label, a live pipeline stamp on the same baseline, a note line, and a 2-up/4-up row of figures divided by `coldline` verticals. Each figure is a serif value over an ink label with a blue underline, and each is a link to its own proof; hovering moves the value to blue and thickens the underline. The band is where the reader verifies the verdict.

### Pipeline Stamp
A 2px green dot (two stacked round spans, the lower at 60% opacity) followed by 13px muted text carrying the pipeline's own published timestamp. It falls back to static wording when the fetch fails and never to a fabricated date.

### Skill Scale
**Removed from this document.** It specified ten 6px segments filled to a declared level; no such component ever shipped, `ProofRow` has no `level` field, and `bar-in` appears only in the charts. A spec for a component that is not in the build is how the shadows, the cards and the 13px prose below went unnoticed for three sessions. What ships in its place is the toolkit list: a tool name over the artifact that backs it, linked where the artifact is public.

### Atlas Figure
The sheet's second figure and the only picture in the build. Two departmental choropleths — 2018 and 2025 — on **one shared scale**, opened by a 2px `cold` rule on the paper ground, with the argument set beside them and a 7-step legend beneath. It is not ornament: the index is standardised against 2018, so the pair shows every department rising off that baseline, which is exactly why the coefficient dies once time effects enter. Scaling each panel against itself would hide the finding, so the domain is pooled.

It is **static SVG generated at build time** (`npm run atlas` → `lib/atlas-figure.ts`), not the interactive atlas: the live one costs 258 KB of JSON plus d3 and topojson. Fills are `var(--atlas-*)` — the same tokens the interactive map reads — so a static figure still follows the theme, still prints under the exact-colour rule, and cannot drift from the map it links to. The geometry is declared once in `<defs>` and each panel references it with `<use>`, because Next serialises the server tree twice; without that the figure cost 26.7 KB gzip instead of 14.1. Department outlines are stroked in `coldline`, never paper: the neutral ramp step and a light ground differ by about 1.05:1, and a mostly-neutral panel disappears without the line.

**The band does not wear `coldsoft`.** The figures band directly above it already does, and two identical tints in sequence read as one 500px blue mass.

### Charts
Line only, on paper ground: series in blue at 2px solid, benchmark in muted at 2px dashed (`5 6`), gridlines in `rule` at 1px. Series are distinguished by dash pattern and end-point label as well as hue, so the chart survives grayscale printing and color-vision deficiency. All chart text wears text tokens (`ink`, `body`, `muted`), never the series color.

### Motion
**Register: print, not web-app.** Every animated thing is something a sheet does — a pen crosses the page, a row settles into place, a figure is counted to its reading. Nothing bounces, parallaxes, or scales on hover.

Four primitives, all keyed off one document-level `IntersectionObserver` in `components/Motion.tsx`:

| Class | Motion | Timing |
|---|---|---|
| `.settle` / `.reveal` | opacity 0 → 1, 10–14px up, 3px blur → none | 620–700ms `cubic-bezier(0.16, 1, 0.3, 1)` |
| `.rule-in` | `scaleX(0) → 1` from the left edge — a rule is drawn, not faded in | 760ms `cubic-bezier(0.22, 1, 0.36, 1)` |
| `.bar-in` | `scaleX(0) → 1` — an indicator segment fills to its reading | 820ms, staggered 55ms per segment |
| `CountUp` | integer counts to the printed value on `easeOutExpo`; prefix and suffix (`15+`, `10+ hrs/mo`) are preserved verbatim | 1100ms |

Stagger is always reading order, carried by a `--d` custom property so a server component can set it without becoming a client component. Chart series are drawn left to right with the Web Animations API inside `components/trading/Charts.tsx` (benchmark first at 0ms, strategy at 180ms) because a path's length is only known at run time.

**Three guarantees the system must keep.** The hidden states are scoped to `.js`, set pre-paint by the boot script, so a reader without JS never meets an invisible page. A 3-second boot timer reveals everything if the bundle never runs. And `@media print` forces every reveal state visible, because paper has no scroll and nothing would ever intersect — a printed sheet must not come out blank. Under `prefers-reduced-motion: reduce` the observer marks everything visible immediately and every animation and transition is cut to 0.01ms.

### Theming
Theme follows system preference by default, with a manual toggle persisted in `localStorage` and applied pre-paint by an inline script so a reload never flashes the wrong ground. Browser surfaces wear the palette too: selection is blue-on-paper, scrollbars are thin `rule`-on-transparent with a paper-bordered thumb, and `color-scheme: light dark` is declared.

## Do's and Don'ts

### Do:
- **Do** carry structure with hairline rules (1px `rule`/`rulesoft`) and full-bleed bands, and open a major band with a 2px rule in `ink`, `cold`, or `warm`.
- **Do** reserve amber for human and purpose content — availability, hiring, the career-transition passage — and give every data point and technical claim to institutional blue or ink.
- **Do** set every large figure in Source Serif 4, tabular, with its label and a note underneath.
- **Do** keep prose at 14px or larger; use the 12–12.5px tracked-caps step only for metadata labels.
- **Do** author the dark theme against its own ground (#0e1216) with re-chosen steps, and keep light as the default reading state.
- **Do** link every figure to the artifact that proves it.
- **Do** state a claim once, large, and let the band below verify it.
- **Do** keep motion in the print register — draw a rule, settle a row, count a figure — and make every animated element readable at rest, in print, and under reduced-motion.

### Don't:
- **Don't** add a shadow, glow, or gradient. The system is flat; a `box-shadow` here is a defect.
- **Don't** wrap content in a card. Removing cards was a review decision on all three surfaces; use a top rule plus optional tint instead.
- **Don't** put amber on a number, a metric, a stack tag, or any technical claim.
- **Don't** introduce a third accent hue; extend with the existing verdict/status tokens.
- **Don't** ship mono type, neon accents, terminal chrome, or a terminal-styled navigation bar — this world was chosen specifically against them.
- **Don't** set a paragraph, heading, or button in the serif; the serif means "this is a figure."
- **Don't** derive the dark theme by inverting or filtering light values.
- **Don't** hide a control behind a bare dim glyph where a short label would work — the language switch is labelled for exactly this reason.
- **Don't** let a reveal state be the only thing standing between a reader and the content: if it can't be seen without JS, without motion, or on paper, it is a defect, not an effect.
- **Don't** publish a self-assessment on one surface and a lower one on another. The skill scale is declared once and both the front page and the CV read it from the same rows.
- **Don't** round a band, row, or block; radius belongs to controls (3px) and to the two elements whose meaning is round.
- **Don't** use an icon font, emoji, or a third-party icon package; icons are inline SVG at a 1.3px stroke on a 16px box.
