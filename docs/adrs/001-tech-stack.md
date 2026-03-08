# ADR-001: Tech Stack Selection

## Status
Accepted

## Context
We need to build an interactive 3D terrain explorer for Puerto Varas / Lake District, Chile. The tool must render real-world terrain in 3D, import GPX trekking routes, analyze route difficulty, and work both as a desktop app and a mobile-accessible web app. Development will be AI-agent-assisted, so the stack must be well-documented and AI-friendly.

## Decision

### Core
- **Vite + React + TypeScript** — Fast HMR, modern bundling, strong type safety. Excellent AI-agent support due to widespread training data.
- **React Three Fiber + drei** — Declarative 3D rendering via React. Preferred over raw Three.js for component composability and React ecosystem integration.
- **Three.js** — Underlying 3D engine. WebGL-based, battle-tested, enormous community.

### Data & Maps
- **Mapbox Terrain-RGB tiles** — Elevation data encoded in RGB values. Free tier: 200k tile requests/month. Decode formula: `height = -10000 + ((R × 256 × 256 + G × 256 + B) × 0.1)`.
- **Mapbox Satellite tiles** — Satellite imagery overlay on terrain mesh.
- **@tmcw/togeojson** — GPX/KML to GeoJSON conversion. Lightweight, well-maintained.

### UI
- **Tailwind CSS** — Utility-first styling. Fast iteration, no CSS file management overhead.

### Desktop & Mobile
- **Tauri** — Desktop wrapper using system webview. Lighter than Electron, native file system access for GPX files.
- **PWA** — Progressive Web App for mobile access. Use in the field while hiking.

### Testing
- **Vitest** — Unit testing with 90% coverage threshold. Compatible with Vite's config.
- **Playwright** — E2E testing across browsers.
- **@testing-library/react** — Component testing with user-centric queries.

### Architecture
- **Domain Logic Separation** — Pure domain functions (elevation math, difficulty scoring, GPX processing) isolated from UI and infrastructure.
- **In-Memory Stubs** — Every external service (Mapbox) has an in-memory stub for offline development and testing.
- **CLI** — Command-line interface with feature parity for agent-driven validation.

## Consequences
- Mapbox dependency requires an API key (free tier is generous).
- Tauri requires Rust toolchain for desktop builds.
- Three.js/R3F learning curve for 3D rendering, but declarative API mitigates this.
- Domain separation adds initial structure overhead but enables TDD and CLI parity.
