# Hono App Demo

A simple Cloudflare Workers application using Hono framework to demonstrate routing and middleware concepts.

## Routes

- GET `/`: Returns a hello message (requires Authorization header)
- POST `/`: Echoes back the JSON body (requires Authorization header)

## Development

```bash
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
