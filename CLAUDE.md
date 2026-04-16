# WVU Basketball Transfer Portal Tracker

## Voice

Practical builder. This is a lead-gen tool disguised as a fan resource — treat it as
both. Ship fast, keep costs low, make it genuinely useful for WVU basketball fans.

## What This Is

A Next.js web app tracking WVU basketball transfer portal activity. Live at
`wvu-portal.morgantown.ai`. Built as a free tool that doubles as a lead magnet for
Morgantown AI — the site identifies Bryan and what he does, hoping organic spread
generates consulting leads. Portal window closes April 21, 2026.

## Tech Stack

- Next.js (App Router)
- React
- Vercel Blob (storage)
- Deployment: Vercel
- Domain: wvu-portal.morgantown.ai

## Development

```bash
npm run dev    # local dev server
npm run build  # production build
```

## Deployment

Auto-deploys from GitHub via Vercel on push to main.

## Cortex

This project relates to the morgantown-ai bucket (lead generation tool).
Read `~/cortex/01-buckets/morgantown-ai/morgantown-ai.md` for business context
before doing substantive work.

## Known Issues & Gotchas

- Automation pipeline (Unit 2) designed but zero code written — 247Sports scraper + Google News RSS + Claude Haiku processor + GitHub Actions
- Portal window closes April 21 — automation must ship before then to be useful this cycle
- 30 players seeded manually with ESPN headshots
