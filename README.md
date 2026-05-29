---
title: Reachy Mini
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: static
hf_oauth: true
pinned: true
short_description: All about Reachy Mini, from building to getting started
---

# Reachy Mini website

Showcase website for Reachy Mini (static single-page app). The app
catalog and dynamic data come from the separate Reachy Mini API
(`VITE_API_BASE`); this Space ships only the built frontend.

## Deploy

CI (`.github/workflows/deploy.yml`) builds the site on push to `main`
and pushes the built `dist/` (plus this README and a `404.html` SPA
fallback) to the Hugging Face Space. The `VITE_API_BASE` build variable
points the frontend at the API Space.

## Local dev

```bash
npm install
npm run dev   # Vite dev server; /api is proxied to http://localhost:3001
```

Run the API locally on port 3001 (see the `reachy_mini_api` repo) so the
dev proxy resolves catalog calls.
