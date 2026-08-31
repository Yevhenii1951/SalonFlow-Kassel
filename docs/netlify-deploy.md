# Netlify Deployment

This project is configured to deploy on Netlify. Everything in the repo is ready; the
only manual steps are the ones that require access to your Netlify account.

## What is already configured in the repo

- `netlify.toml` — build command `npm run build`, publish directory `dist`, Node 20.
- `public/admin/config.yml` — Decap CMS using `git-gateway` backend (Netlify Identity).
- `public/admin/index.html` — includes the Netlify Identity widget.
- `npm run build` runs tests first, then `astro check`, then `astro build`.

## Deploy steps (one-time)

1. Push the repo to GitHub (see below) or confirm it is already there:
   `git push -u origin main`.

2. In Netlify dashboard (https://app.netlify.com): **Add new site → Import from existing
   project → GitHub**, and select the `Yevhenii1951/SalonFlow-Kassel` repository.

3. Netlify auto-detects the framework. No build settings are needed because
   `netlify.toml` already defines them. Click **Deploy**.

4. After the first deploy succeeds, your site is live at a random Netlify URL such as
   `https://<random>.netlify.app`. You can set a custom subdomain under
   **Site settings → Domain management**.

## Enable Decap CMS editing (Identity)

The CMS admin is at `/admin/`. To let editors sign in:

1. In the Netlify site: **Site configuration → Identity → Enable Identity** (one-click).
2. Under **Identity → Registration** choose who can register (for a single editor, send
   an invite instead).
3. Send an **Invite user** with the editor's email.
4. Open `https://<your-site>.netlify.app/admin/`. The editor signs in via the Netlify
   Identity widget (email link). Changes are committed straight to the GitHub repo.

> Git Gateway is enabled automatically once Identity is on. It is what lets Decap write
> to GitHub without exposing a GitHub token.

## Booking provider

The booking link is configured in `src/content/settings/salon.json` (field `booking`).
To point to a real booking system, edit that file (or via CMS at `/admin/`) and set e.g.:

```json
"booking": {
  "provider": "StudioBookr",
  "url": "https://your-real-booking.example/book",
  "mode": "link"
}
```

Environment overrides (set in Netlify **Site settings → Environment variables**):
`PUBLIC_BOOKING_PROVIDER`, `PUBLIC_BOOKING_URL`, `PUBLIC_BOOKING_EMBED_URL`.

Use `mode: "link"` for a clean external redirect, or `mode: "embed"` + `embedUrl` to embed
a widget as an iframe (check cookies/tracking/privacy first).

## Verification

- Site loads: open the deploy URL.
- Check `/sitemap-index.xml` and `/robots.txt`.
- SEO structured data (HairSalon JSON-LD) is injected on every page.
- Run `npm test` and `npm run build` locally to confirm the same checks that gate deploys.
