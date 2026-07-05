# Deployment Notes

Forge is a static Vite application.

## Build

```bash
pnpm install
pnpm build
```

The production output is written to `dist/`.

## Static Hosting

Forge can be hosted on static platforms such as Cloudflare Pages, Netlify,
Vercel, GitHub Pages, Azure Static Web Apps, or any web server that can serve
the built files.

## SPA Fallback

Forge uses client-side routing. Configure your host so unknown paths fall back
to `index.html`.

This is required for routes such as:

- `/tools/json-formatter`
- `/tools/jwt-decoder`
- `/privacy`
- `/terms`

## Environment Variables

Client-exposed values should use the `VITE_` prefix.

Example:

```env
VITE_APP_NAME=Forge
VITE_APP_URL=https://your-forge-domain.example
```

The app should avoid hardcoding temporary deployment domains. Put deployment
URLs in environment files or host configuration instead.

## Cloudflare Pages

Recommended defaults:

- Build command: `pnpm build`
- Output directory: `dist`
- Node.js version: 22 or newer
- Package manager: pnpm 10 or newer

Forge includes `public/_redirects`, which Vite copies into `dist/`. Cloudflare
Pages uses this file to serve `index.html` for client-side routes:

```text
/* /index.html 200
```

If route refreshes return 404 on another host, add the equivalent SPA fallback
rule in that platform's configuration.
