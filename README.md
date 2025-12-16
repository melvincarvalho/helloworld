# Solid Hello World

A simple starter app for the [Solid](https://solidproject.org/) decentralized web platform.

[Demo](https://melvincarvalho.github.io/helloworld/)

## Features

- Login with any Solid Identity Provider
- Display your WebID
- Fetch and display your profile name

## Tech Stack

- [@inrupt/solid-client-authn-browser](https://www.npmjs.com/package/@inrupt/solid-client-authn-browser) - Authentication
- [@inrupt/solid-client](https://www.npmjs.com/package/@inrupt/solid-client) - Data access
- [Vite](https://vitejs.dev/) - Build tool
- [Bulma](https://bulma.io/) - CSS framework

## Getting Started

### Prerequisites

- Node.js 18+
- A Solid Pod ([get one here](https://solidproject.org/users/get-a-pod))

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at http://localhost:3000

### Build

```bash
npm run build
```

Output is in `dist/` folder.

## License

MIT
