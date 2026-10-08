# Maryland Waterways Explorer

Browse Maryland waterways by county, view photos and maps, and sort places by name or distance.

## Run locally

Use Node.js 22 or newer. No API key is required.

```sh
npm ci
npm run dev
```

## Validate and build

```sh
npm run lint
npm run build
npm run preview
```

Deploy the `dist` directory to a static host. Relative asset paths support both domain roots and subdirectories such as `/water/`. County links use hash routes (for example, `/water/#/frederick`) so refreshing a county page does not require server rewrite rules.

Maps require access to OpenStreetMap tiles; weather uses Open-Meteo. Distance sorting requires browser location permission and HTTPS (or localhost).
