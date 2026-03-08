# System Architecture Diagram

```mermaid
graph TB
    subgraph "Entry Points"
        UI["React UI<br/>(Browser / Tauri / PWA)"]
        CLI["CLI<br/>(Node.js)"]
    end

    subgraph "UI Layer"
        Scene3D["3D Scene<br/>(React Three Fiber)"]
        Panels["Control Panels<br/>(React + Tailwind)"]
        Charts["Elevation Charts<br/>(React)"]
    end

    subgraph "Domain Layer (Pure Logic)"
        Elevation["Elevation Service<br/>RGB decode, grade calc"]
        GPX["GPX Service<br/>Parse, process routes"]
        Difficulty["Difficulty Service<br/>Scoring algorithms"]
        Geo["Geo Utils<br/>Coordinate math, projections"]
    end

    subgraph "Infrastructure Layer"
        MapboxReal["Mapbox Provider<br/>(Real API)"]
        MapboxStub["Mapbox Stub<br/>(In-Memory)"]
        Storage["Storage Provider<br/>(localStorage / File)"]
    end

    subgraph "External Services"
        MapboxAPI["Mapbox Terrain-RGB API"]
        MapboxSat["Mapbox Satellite API"]
        FileSystem["File System<br/>(GPX files)"]
    end

    UI --> Scene3D
    UI --> Panels
    UI --> Charts
    CLI --> Elevation
    CLI --> GPX
    CLI --> Difficulty

    Scene3D --> Elevation
    Scene3D --> Geo
    Panels --> GPX
    Charts --> Elevation
    Charts --> GPX

    Elevation --> Geo
    Difficulty --> Elevation
    Difficulty --> GPX

    Elevation --> MapboxReal
    Elevation --> MapboxStub
    GPX --> Storage
    MapboxReal --> MapboxAPI
    MapboxReal --> MapboxSat
    Storage --> FileSystem
```

## Key Principles

1. **Domain layer is pure** — no IO, no side effects, fully testable
2. **Infrastructure is swappable** — real Mapbox or in-memory stub via provider pattern
3. **Entry points are thin** — UI and CLI both delegate to domain layer
4. **CLI has feature parity** — every domain operation accessible via CLI for agent validation
