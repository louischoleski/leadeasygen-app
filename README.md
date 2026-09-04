# Luna

React port of the Luna admin landing pages (dashboard, login, register, forgot password),
built with Vite, Tailwind CSS, Phosphor Icons, and Recharts.

## Theming

Design tokens live in the `@theme` block of `src/index.css` — the single source of truth
for colors, radii, and type. Light values are the `:root` base; the `.dark` block overrides
color tokens only. The app defaults to dark, honors `prefers-color-scheme` on first visit,
and persists an explicit choice under the `theme` localStorage key. A pre-paint script in
`index.html` applies the class before first render; `src/hooks/useTheme.ts` manages it at
runtime. Charts read colors via CSS custom properties, so they re-theme automatically.

## Development

```sh
npm install
npm run dev
```

### Google Places autocomplete (optional)

The "New scrape job" location field suggests places as you type when a Google
Maps API key is configured. Copy `.env.example` to `.env.local` and set
`VITE_GOOGLE_MAPS_API_KEY` to a key with the **Places API (New)** enabled.
Without a key the field works as a plain text input.

## Production build

```sh
npm run build      # outputs static files to dist/
npm run preview    # serve the build locally
```

Deploy `dist/` to any static host. Configure a SPA fallback (all routes -> `index.html`)
so deep links like `/login` resolve. Redirects for the legacy `*.html` URLs are handled
in the router.
