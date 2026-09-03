# Luna

React port of the Luna admin landing pages (dashboard, login, register, forgot password),
built with Vite, Tailwind CSS, Phosphor Icons, and Recharts.

## Development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build      # outputs static files to dist/
npm run preview    # serve the build locally
```

Deploy `dist/` to any static host. Configure a SPA fallback (all routes -> `index.html`)
so deep links like `/login` resolve. Redirects for the legacy `*.html` URLs are handled
in the router.
