# Explorador de Terreno 3D — Puerto Varas

Interactive 3D terrain explorer for Puerto Varas / Lake District, Chile. Visualize real-world terrain, import trekking routes (GPX), analyze route difficulty from elevation data, and track visited places.

## Features (Planned)
- 🏔️ 3D terrain rendering with satellite imagery (Mapbox)
- 🥾 GPX route import with difficulty analysis
- 📊 Elevation profiles and route statistics
- 📍 Place markers and visited locations
- 🏞️ National parks overlay

## Tech Stack
- React + TypeScript + Vite
- React Three Fiber + drei (3D rendering)
- Mapbox (terrain elevation + satellite tiles)
- Tailwind CSS
- Tauri (desktop) / PWA (mobile)

## Getting Started

```bash
npm install
npm run dev
```

## Testing

```bash
npm test              # Unit tests
npm run test:coverage # With coverage
npm run e2e           # E2E tests (Playwright)
npm run typecheck     # TypeScript check
```

## Architecture
See [docs/system-diagram.md](docs/system-diagram.md) for the system architecture diagram.

## ADRs
Architecture Decision Records are in [docs/adrs/](docs/adrs/).
