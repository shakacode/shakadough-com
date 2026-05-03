# shakadough.com

The static marketing site for **ShakaDough — The Aloha Sourdough**, a small
naturally-leavened bakery on the north shore of Maui.

## Stack

- Plain static HTML / CSS / JS — no build step, no framework runtime
- Google Fonts (Pacifico, Sacramento, Work Sans, JetBrains Mono)
- Deploys to Cloudflare Pages

## Local preview

Any static server works. Easiest:

```sh
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy to Cloudflare Pages

This site has no build step, so Cloudflare Pages deploys the repo root
directly.

1. Push this repo to GitHub as `shakacode/shakadough-com`.
2. In Cloudflare → Pages → **Create project → Connect to Git**, pick the repo.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
4. Add the custom domain `shakadough.com` under **Custom domains**.

`_headers` configures cache and security response headers; Cloudflare Pages
honors it automatically.

## Layout

```
index.html       — single-page site
styles.css       — all styles
script.js        — nav toggle, ticker, subscribe form
assets/          — logo (cached long-term)
img/             — web-optimized JPEGs (resized from photos/)
photos/          — original-resolution sources, gitignored
```

## Updating photos

The originals in `photos/` are big phone shots (3–5 MB each). The web copies
in `img/` are 1600px JPEGs at quality 80. To regenerate after dropping new
photos in `photos/`:

```sh
mkdir -p img
for f in photos/*.jpeg; do
  out="img/$(basename "${f%.jpeg}.jpg")"
  sips -Z 1600 -s format jpeg -s formatOptions 80 "$f" --out "$out"
done
```

## Design provenance

The visual direction is the **v3 logo-led** mockup from the Claude Design
handoff bundle (chat transcript: see `chats/chat1.md` if archived). Palette
and typography are pulled from the ShakaDough logo:

- `--cream #f4ebd6` `--teal #2d7a8f` `--tan #b88450` `--ink #2a3a40`
- Pacifico for the wordmark, Sacramento for warm asides, Work Sans for body,
  JetBrains Mono for meta labels.

## Placeholders

Pickup spots, delivery zones, prices, and bake days are intentionally not
listed yet — the in-page callout (and the form copy) explains that.
