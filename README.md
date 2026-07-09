# Solid Hello World

A simple starter app for the [Solid](https://solidproject.org/) decentralized
web platform. **Zero build step, zero dependencies** — one HTML file, one JS
file, served as-is.

[Demo](https://melvincarvalho.github.io/helloworld/)

## Features

- Login with any Solid Identity Provider
- Display your WebID
- Fetch and display your profile name
- Green debug panel showing each step of the auth + profile flow

## Tech Stack

- [solid-oidc](https://github.com/JavaScriptSolidServer/solid-oidc) — single-file,
  zero-dependency Solid-OIDC auth (~4kb gzipped, Web Crypto, DPoP)
- [Bulma](https://bulma.io/) — CSS framework (CDN)

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
