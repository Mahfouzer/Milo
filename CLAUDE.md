# CLAUDE.md — Project Documentation

## Project Overview

**Milo** (a.k.a. *Millionair Millionair*) is a web application that answers one question: **"In how many countries are you a millionaire?"**

Given a user's net worth and base currency, it fetches live exchange rates and calculates whether that amount exceeds 1,000,000 units of each country's local currency. Results are visualized on an interactive world map.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Routing | TanStack Router v1 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS v3 |
| Animation | GSAP 3 |
| Map rendering | D3 + TopoJSON |
| i18n | react-i18next (EN, AR, ES) |
| Testing | Vitest + Testing Library |
| PWA | Workbox service worker |

---

## Project Structure

```
src/
├── components/
│   ├── footer/         # Footer (transparent, outside the app card)
│   ├── header/         # AppHeader (transparent, outside the app card)
│   ├── input/          # NetWorthInput — pill-style input dock
│   ├── map/            # MillionaireMap — D3 interactive world map
│   ├── results/        # CountryList — scrollable results panel
│   ├── share/          # ShareButtons (currently unused)
│   └── ui/             # LanguageSwitcher, ProgressBar, FallingMoneyOverlay
├── data/
│   ├── countries.json  # ISO country records (code, name, currency)
│   └── currencies.json # Currency code → symbol + name map
├── features/
│   ├── calculator/     # Core calculation logic
│   ├── currency/       # Exchange-rate fetching (with caching)
│   └── sharing/        # Canvas-based image generation for sharing
├── hooks/
│   ├── useDebounce.ts
│   └── useMillionaireCalculator.ts  # Main orchestration hook
├── lib/
│   ├── d3/             # country-name-mapping.ts, map-utils.ts
│   ├── i18n/           # i18next config
│   ├── service-worker/ # PWA registration
│   └── utils/          # flag-emoji.ts
├── locales/            # en / ar / es translation JSON files
├── routes/
│   ├── __root.tsx      # TanStack Router root
│   └── index.tsx       # Main page — app shell, layout, mobile bottom sheet
├── types/
│   └── index.ts        # Shared TypeScript interfaces
└── index.css           # Global styles + .glass-card utility
public/
└── world-110m.json     # Local TopoJSON file for the world map
```

---

## Key Architecture Decisions

### Layout (`src/routes/index.tsx`)
- Full-screen glassmorphism design: `h-screen w-screen overflow-hidden`.
- A colorful radial-gradient mesh fills the background.
- The main app is wrapped in a 1.5px gradient border frame, then a `bg-white/80 backdrop-blur-xl` card.
- `AppHeader` and `Footer` render **outside** the card, directly on the gradient background with transparent styles.
- Desktop: two-column grid `[380px_1fr]` — left panel (country list) + right map stage. The left panel is hidden until a result exists.
- Mobile: map fills screen, results appear as a **bottom sheet** with three snap states: `collapsed`, `half`, `expanded`.
- The `NetWorthInput` floats as a pill overlay anchored to the bottom of the map (`absolute left-1/2 -translate-x-1/2 bottom-4 z-20`).

### Calculator (`src/features/calculator/calculator.ts`)
- `calculateMillionaireStatus(netWorth, baseCurrency)` → `MillionaireCalculation`
- **Millionaire**: `localAmount >= 1,000,000`
- **Almost millionaire**: `localAmount >= 900,000` (and not a millionaire)
- Results are sorted descending by local amount.
- Relies on `currencyService.getRates()` which caches exchange rates.

### Map (`src/components/map/MillionaireMap.tsx`)
- Loads `world-110m.json` from `public/` (local file, avoids CDN dependency).
- Uses `d3-geo` (Mercator projection) + `topojson-client`.
- Country fill colors:
  - Millionaire: blue (`#3b82f6`)
  - Almost millionaire (≥ 900k): orange (`#f97316`)
  - Not millionaire: gray (`#eef2f7`)
- Hover shows a glass-card tooltip with the country name, local amount, and status.
- When no result exists, renders a centered empty-state prompt with the headline *"🗺️ How many countries are you millionaire 🧐 at?"*.
- Country name → ISO code mapping lives in `src/lib/d3/country-name-mapping.ts`. Add entries there when TopoJSON names don't match.

### Input Dock (`src/components/input/NetWorthInput.tsx`)
- Accepts a `variant?: 'default' | 'dock'` prop.
- In `dock` mode: renders as a flat borderless pill with no labels, loading indicator only on the Calculate button.
- Disabled state: `loading || !netWorth || isNaN(parseFloat(netWorth))` — allows `0` as valid input.

### Country List (`src/components/results/CountryList.tsx`)
- Sticky header with animated count and search input.
- Each row is a "chip card" with the country flag (inside a rounded tile), name, local amount, and a status badge.
- Internal scroll managed via `flex-1 min-h-0 overflow-y-auto`.

### i18n
- Languages: English (`en`), Arabic (`ar`, RTL), Spanish (`es`).
- Translation files: `src/locales/<lang>/translation.json`.
- Config: `src/lib/i18n/config.ts`.
- Language switcher: `src/components/ui/LanguageSwitcher.tsx`.

---

## Data Files

### `src/data/countries.json`
Array of country objects:
```json
{ "code": "US", "name": "United States", "currency": "USD" }
```
To add a country: append an entry with the ISO 3166-1 alpha-2 `code`, display `name`, and ISO 4217 `currency` code.

### `src/data/currencies.json`
Maps currency codes to display info:
```json
{ "USD": { "symbol": "$", "name": "US Dollar" } }
```
Add an entry here when adding a country with a new currency.

### `src/lib/d3/country-name-mapping.ts`
Maps TopoJSON country name strings to ISO alpha-2 codes. Add entries here when a country appears on the map but is not being colored (check the browser console for unmatched names).

---

## Common Dev Commands

```bash
# Start dev server
npm run dev

# Type-check + build
npm run build

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Lint
npm run lint
```

---

## Coding Conventions

- **TypeScript strict mode** — no `any`, interfaces defined in `src/types/index.ts`.
- **Tailwind only** — avoid inline `style={}` except for dynamic values (e.g. GSAP transforms, SVG attributes).
- **No comments narrating code** — only explain non-obvious constraints or trade-offs.
- **Component props** — use explicit interfaces, not inline types.
- **Currency rates** are fetched once per session and cached by `currencyService`.
- **GSAP** is used for the millionaire counter animation, map fill transitions, hover effects, and the falling-money overlay.

---

## Deployment

The app is a static SPA. Build with `npm run build` and deploy the `dist/` folder to any static host (Vercel, Netlify, GitHub Pages, etc.).

GitHub repository: `git@github.com:Mahfouzer/Milo.git` (branch: `main`)
