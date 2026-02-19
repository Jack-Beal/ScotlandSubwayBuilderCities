# Generator Scripts

This document describes the Node.js generator scripts that produce the two
city data files required by the Subway Builder mod API v1.0.0.

---

## Quick start

```bash
# Install dependencies once
cd tools && npm install && cd ..

# Generate both files for Dundee
npm run gen:all -- --code DND

# Validate the outputs
npm run validate -- --code DND
```

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js     | ≥ 18 (ESM support) |
| OSM building GeoJSON | `build/<CODE>/geojson/buildings.geojson` |

The building GeoJSON is produced by exporting OSM data for the city bbox (see
[data_generation_fast.md](data_generation_fast.md) Steps 1–2 and the ogr2ogr
command for buildings polygons, or any GeoJSON export from Overpass/JOSM).

---

## Scripts

### `tools/generate_buildings_index.mjs`

**Input:** `build/<CODE>/geojson/buildings.geojson`  
**Output:** `data/<CODE>/buildings_index.json.gz`

Creates a grid-based spatial index over all buildings for collision detection.

```bash
node tools/generate_buildings_index.mjs --code DND [--cell-size 0.002]
# or via npm:
npm run gen:buildings -- --code DND
```

| Option | Default | Description |
|--------|---------|-------------|
| `--code` | *required* | City code (e.g. `DND`) |
| `--cell-size` | `0.002` | Grid cell size in degrees (≈ 200 m at Scottish latitudes) |

The script streams the GeoJSON using `stream-json` so it handles large
files without loading everything into memory at once. Each feature is
processed as it arrives and appended to an in-memory array; only the
final index write requires the full dataset in memory.

#### Output format (OptimizedBuildingIndex)

```jsonc
{
  "cs": 0.002,                          // cell size in degrees
  "bbox": [-3.0, 56.4, -2.9, 56.5],    // [minLon, minLat, maxLon, maxLat]
  "grid": [50, 50],                     // [cols, rows]
  "cells": {                            // sparse: only occupied cells present
    "42": [0, 3, 7],                    // cell index → building indices
    "43": [1, 2]
  },
  "buildings": [                        // one entry per OSM building polygon
    {
      "b": [-2.97, 56.46, -2.96, 56.47], // bbox
      "f": -3.5,                          // foundation depth (metres, negative)
      "p": [[-2.97, 56.46], ...]          // outer polygon ring
    }
  ],
  "stats": { "count": 12345, "maxDepth": 15.0 }
}
```

#### Foundation depth approximation

Real foundation depths are unavailable from OSM data. The script uses a
heuristic based on building footprint area:

```
area_m² = area_deg² × (111 000 m/degree)²
depth   = −(1.5 + √area_m² × 0.002)   clamped to [−1.5, −15] m
```

A tiny shed gets ≈ −1.5 m; a large warehouse may reach −15 m. These are
**synthetic approximations** intended to give plausible relative depths for
the game's collision system.

---

### `tools/generate_demand_data.mjs`

**Input:** `data/<CODE>/buildings_index.json.gz` (must already exist)  
**Output:** `data/<CODE>/demand_data.json.gz`

Generates procedural commuter demand data by placing a regular grid of demand
points across the city bbox and deriving residents/jobs from building density.

```bash
node tools/generate_demand_data.mjs --code DND \
  [--grid-size 8] [--max-pops 2000] [--pairs-per-point 3]
# or via npm:
npm run gen:demand -- --code DND
```

| Option | Default | Description |
|--------|---------|-------------|
| `--code` | *required* | City code |
| `--grid-size` | `8` | Grid divisions per axis (produces n×n demand points) |
| `--max-pops` | `2000` | Maximum number of commuter pops to generate |
| `--pairs-per-point` | `3` | Max job-centre pairings per residential point |

#### Output format (DemandData)

```jsonc
{
  "points": [
    {
      "id": "pt_0",
      "location": [-2.97, 56.46],   // [lon, lat]
      "jobs": 120,
      "residents": 340,
      "popIds": ["pop_0", "pop_1"]  // commuter groups using this point
    }
  ],
  "pops": [
    {
      "id": "pop_0",
      "size": 113,                  // commuter group size
      "residenceId": "pt_0",
      "jobId": "pt_5",
      "drivingSeconds": 720,
      "drivingDistance": 8000       // metres
    }
  ]
}
```

#### Driving distance / time approximation

No routing engine is required. Distances are estimated with:

```
drivingDistance = haversine(origin, dest) × 1.25   (metres)
drivingSeconds  = drivingDistance ÷ 11.11           (≈ 40 km/h)
```

The **detour factor 1.25** accounts for road network path length exceeding
the straight-line distance. The **speed 11.11 m/s (40 km/h)** is a
conservative average urban speed including stops and junctions. Both values
can be changed in the script if needed.

#### Resident / job allocation

1. A building density score is taken from the buildings index for each grid
   cell (number of buildings in the nearest cell).
2. **Residents** are allocated proportionally to building density
   (`BASE_RESIDENTS × densityRatio`).
3. **Jobs** get an additional **centre-weighting**
   (`BASE_JOBS × densityRatio × centreWeight × 3`) so that downtown grid
   cells attract more employment, mimicking a typical urban jobs distribution.
4. Commuter pops pair each residential point with up to `--pairs-per-point`
   job-rich points sorted by distance.

---

### `tools/validate_outputs.mjs`

Validates both generated files against the schema expectations.

```bash
node tools/validate_outputs.mjs --code DND
# or via npm:
npm run validate -- --code DND
```

Exits with code `0` if all checks pass, `1` if any fail. Checks include:

- Required keys and correct types for every field
- Non-empty arrays for `buildings`, `points`, and `pops`
- Cross-reference integrity (`pop.residenceId` / `pop.jobId` exist in
  `points`; `point.popIds` all exist in `pops`)
- `stats.count` matches `buildings.length`

---

## Running all generators

```bash
npm run gen:all -- --code DND
```

This is equivalent to:

```bash
npm run gen:buildings -- --code DND
npm run gen:demand -- --code DND
```

The `gen:demand` script depends on `buildings_index.json.gz` being present, so
`gen:buildings` must run first (which `gen:all` ensures).

---

## File paths

| Path | Description |
|------|-------------|
| `build/<CODE>/geojson/buildings.geojson` | Input — OSM building polygons |
| `data/<CODE>/buildings_index.json.gz` | Output — grid-indexed buildings |
| `data/<CODE>/demand_data.json.gz` | Output — commuter demand data |

The `data/<CODE>/` directory is created automatically if it does not exist.
Generated `.json.gz` files are excluded from version control via `.gitignore`;
distribute them via GitHub Releases.
