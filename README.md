# Solid Hello World

A simple starter app for the [Solid](https://solidproject.org/) decentralized
web platform. **Zero build step, zero dependencies** — one HTML file, one JS
file, served as-is.

[Demo](https://melvincarvalho.github.io/helloworld/)

## Features

- Login with any Solid Identity Provider (defaults to
  [solidweb.app](https://solidweb.app), with solidcommunity.net,
  login.inrupt.com, or a custom URL a click away)
- Display your name, photo, and WebID from your pod profile
- "What just happened?" explainer — makes the demo self-narrating for
  first-time audiences
- Green debug terminal showing every step of the auth + profile flow live
- Polished, responsive UI with light/dark mode — no CSS framework

## Tech Stack

- [solid-oidc](https://github.com/JavaScriptSolidServer/solid-oidc) — single-file,
  zero-dependency Solid-OIDC auth (~4kb gzipped, Web Crypto, DPoP)
- Hand-rolled CSS (~250 lines, inline) — no framework

## Getting Started

### Prerequisites

- A Solid Pod ([get one here](https://solidproject.org/users/get-a-pod))

### Run

No install, no build. Serve the directory statically:

```bash
npx serve .
# or
python3 -m http.server 3000
```

and open the printed URL. (Solid-OIDC needs a real origin, so serve over
`http://` — opening `index.html` directly from `file://` won't work.)

## How it works

`main.js` creates a solid-oidc `Session`, handles the redirect back from the
identity provider, and restores previous sessions from IndexedDB. Once logged
in it fetches your WebID document with an authenticated request
(`Accept: text/turtle`) and pulls out `foaf:name`. Every step is logged to the
debug panel on the page.

## License

MIT
