# Influence Network Tags (Local)

Content-script-only Chrome MV3 extension. Adds a neutral **“Listed in OSINT dataset”** label next to X/Twitter accounts that appear in this repo’s public datasets (MEK, White-Internet; IR-X-Network when present). The badge links to the dataset README and responsible-use disclaimer.

**Not a watchlist or targeting tool.** Wording and link follow the upstream README: research/journalism only; no harassment or targeting.

## Build and load

From this directory:

```bash
bun install
bun run build
```

Then in Chrome: `chrome://extensions` → Developer mode → **Load unpacked** → select `extension/dist`.

## Scripts

- **`bun run build:handles`** – Regenerates `src/data/handles.json` from `../Data/*.json` (skips missing files).
- **`bun run build`** – Builds handles then Vite bundle.
- **`bun run dev`** – Builds handles then Vite in watch mode.

## Customization

- **Repo link:** Edit `REPO_README_URL` in `src/content/index.tsx` to point at your fork’s README (e.g. `https://github.com/OWNER/Islamic-Republic-Influence-Networks#responsible-use-required`).
- **Datasets:** Edit the `files` array in `scripts/build-handles.ts` to include or drop JSON sources. Handles are normalized (lowercase, `@` stripped).

## Notes

- X’s DOM changes often; selectors (e.g. `data-testid="User-Name"`) may need updates.
- Matching uses the first profile-like `/username` link in each tweet article; false positives/negatives are possible.
