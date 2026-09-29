# Ingex QR

Admin portal for Ingex product QR codes. Screens run on mock data until an API is connected.

## Run

```bash
npm install
npm run dev
```

## Data

Axios lives in `src/lib/axios.ts`. Screens call functions in `src/services`. When `VITE_USE_MOCKS=true`, those requests are answered by `src/mocks` instead of the network.

Set `VITE_USE_MOCKS=false` and point `VITE_API_BASE_URL` at the real API when it exists. See `.env.example`.

The login form is prefilled while mocks are on.

## Where things go

- `src/app` — providers and routes
- `src/components/ui` — shadcn components
- `src/components/common` — shared page pieces
- `src/components/layout` — admin shell and the customer page shell
- `src/features` — screens
- `src/services` — requests
- `src/mocks` — sample data and handlers
- `src/types` — shared types

Login and the dashboard are wired through. The other admin routes, and the customer page at `/p/:code`, are placeholders taken from the screen notes in `documentation`.
