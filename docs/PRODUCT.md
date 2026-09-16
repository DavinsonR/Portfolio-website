# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: hiring managers and recruiters for finance-adjacent data roles**, at remote-friendly companies in the US, Canada and Latin America. They arrive from a LinkedIn profile, an application, or a direct email, usually on a desktop in an office, and they scan for 30–60 seconds before deciding whether to open the CV. Many are non-technical HR screeners who need to classify the candidate fast; a smaller group are finance or analytics leads who will judge the actual work.

**Secondary: peers in the same transition** (finance/economics people moving toward data), who arrive through shared links and treat the site as a reference for how to do it.

Their job: decide in under a minute whether this person fits an open role, and at what level.

## Product Purpose

A personal site that converts a scan into an interview for **Finance Data Analyst** roles — positions at the intersection of financial analysis and data engineering — read as a specialist in that crossover rather than as someone starting over in a new field.

Success is not traffic. Success is: the visitor understands the crossover in seconds, believes it (the work is verifiable), downloads the CV or writes.

## Positioning

**The crossover already exists and is demonstrable.** Davirson is an economist and FP&A consultant (Neoris/EPAM, operations across 15+ countries) who built and operates a production data platform on his own: daily ingestion of 48 assets, a PostgreSQL medallion warehouse with dbt, automated data-quality tests, CI/CD, and a Power BI semantic model.

A neighboring candidate cannot truthfully copy this claim: finance people rarely ship pipelines, and data engineers rarely read a P&L. The site's job is to make that pairing legible and credible — a scarce specialist, not a beginner in a new field.

## Operating Context

- Shared as a link from LinkedIn, job applications and email; frequently opened in a bright office, sometimes screen-shared or printed.
- Read in English by most decision-makers; Spanish matters for Latin American employers and for the peer audience.
- The CV PDF is the artifact that survives the visit — it gets forwarded internally.
- Judged next to conventional CVs and templated portfolios.

## Capabilities and Constraints

- Next.js 16 + Tailwind v4 + TypeScript, fully static (SSG), deployed on Vercel. Zero backend, zero database, $0 hosting.
- Bilingual ES/EN through `/[lang]/` routes and `lib/content/` as the single source of truth for every string; the CV PDFs are generated from that same file.
- A live project page (`/projects/trading-sim`) reads JSON published by the `market-data-medallion` repository, refreshed daily by a GitHub Actions cron. The site stays static.
- Open decision: the CV PDF may be regenerated in LaTeX/Overleaf for a more conventional format (peer feedback), replacing the current script-generated version.
- **The public hostname is `davirson.com`** (registered September 2026, Cloudflare Registrar, ~$10.44/year flat). It replaces `proyecto-davirson-git.vercel.app`, which carried two costs beyond authority for a name query: `*.vercel.app` is categorised as personal hosting by some corporate web filters, so the page could fail to load for the exact reader it is written for; and the `-git` infix is Vercel's branch-alias shape, which reads as a preview deployment. The old host stays alive and redirects — it is in sent emails, on LinkedIn and inside CV PDFs already in circulation, and turning it off would break all three. The hostname is baked into every canonical, every hreflang, the sitemap, the OG cards and the header of both CV PDFs, so it lives in exactly one constant (`lib/config/site.ts`) and the PDFs must be regenerated whenever it changes.

## Brand Commitments

- Name shown publicly: **Davirson Novoa Ramírez** (Davirson on legal documents; online accounts use "Davinson" — both are correct in their own place).
- **The amber rule**: the warm accent (`#D9A05B`) is reserved for human/purpose content. Technical content uses the cold accent. This separation is binding and predates this redesign.
- **Build in public, honestly**: status and progress indicators must reflect reality, including unfinished work. No heroic filter.
- Voice: direct, specific, no marketing inflation. Claims are backed by artifacts.
- Rejected in an earlier round and still rejected: a terminal-styled navigation bar.

## Evidence on Hand

Real, verifiable — none of this may be fabricated or inflated:

- **market-data-medallion** (github.com/DavinsonR/market-data-medallion): 48 assets, ~55k daily candles, 1,347 strategy variants with out-of-sample validation, 161 unit tests, 100 dbt data-quality checks, daily automated refresh, Power BI semantic model. Public repo.
- Findings from that project: only 11.5% of in-sample winning strategies survived out-of-sample; requiring five confirming signals produced zero trades; Ecopetrol's +96.9% USD return decomposed into +53.6% company and +43.4pp currency.
- FP&A consultant at Neoris/EPAM with operations across 15+ countries.
- Winner, BodyTech Trends data analytics hackathon (2024).
- Ecopetrol scholar — Mario Galán Gómez merit program (2018).
- Stanford Machine Learning Specialization (Coursera, 2024).
- M.Sc. Economics in progress, Pontificia Universidad Javeriana (2025–2026); B.Sc. Economics (2020–2024).
- Languages: native Spanish, English B2, Portuguese A2. GMT-5, full overlap with US hours.
- **Hiring terms, confirmed by the candidate (Sept 2026) and now published in the hero**: level claimed is **Senior Analyst**; start is **15 days' notice** (currently employed); a US/CA company can engage him as a **direct contractor (B2B, own invoice) or through an EOR**, and **no visa sponsorship is required** — he works remotely from Colombia. These three answer the questions a recruiter settles before opening the CV, and the site answered none of them before.
- **No photograph available yet** — the hero must work without one and accept one later without a redesign.
- No testimonials, no client references, no employer logos cleared for use.

## Product Principles

1. **Price the crossover, don't apologize for the transition.** Every claim frames finance + data as one existing capability, never as a work in progress toward data.
2. **A project is a problem solved, not a technique demonstrated.** Lead with the question answered and who would care; the stack is supporting evidence.
3. **Decide in one minute.** Anything that does not help a scanning recruiter classify and act belongs on a secondary page or nowhere.
4. **Verifiable over impressive.** Every number links to the artifact that proves it.
5. **Legible before beautiful.** Contrast, type size and hierarchy are functional requirements — the audience reads in bright rooms and is often over 40.

## Accessibility & Inclusion

- Body text must meet WCAG AA contrast in both themes; the previous dark-only build failed this for a non-technical reader (real feedback: "some letters are super small and you can barely see them with that color").
- Minimum 14px for any prose a visitor is expected to read; 11–12px reserved for true metadata labels with sufficient contrast.
- Light and dark themes both first-class, following the visitor's system preference with a visible manual toggle.
- The language switcher must be obvious — the previous placement was invisible against the dark background.

## Validation on Hand

Structured feedback from four real reviewers (August 2026), scored 1–10:

| Reviewer | Profile | Visual | Ease | Clarity | Trust | Overall |
|---|---|---|---|---|---|---|
| Simón | Engineer → data, M.Sc. Data Analytics | **5** | 8 | 8 | 8 | 7 |
| Nicol (15) | Non-technical, outside fresh eyes | 8 | — | 7 | **10** | 9 |
| Mateo | Economist, same transition path | 7 | 10 | 7 | **10** | 8 |
| Felix | Data engineer, extensive HR screening experience | qualitative | qualitative | qualitative | qualitative | qualitative |

The pattern: **content earns trust (8–10), design does not carry it (5–7).**

Recurring, independent complaints: too dark · too much content, "you get lost" · projects don't show the problem they solved, "it disconnects from the value it can bring to a person or a company" · text too small and low-contrast · language switcher invisible · should be English-first · CV page too long, leave the PDF download · add a photo · add personality (books, philosophy).
