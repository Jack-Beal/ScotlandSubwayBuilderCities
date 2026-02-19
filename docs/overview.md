# Overview

## What is this repository?

This is a **data pack** for [Kronifer's Subway Builder patcher](https://github.com/Kronifer/subwaybuilder-patcher/tree/main). It provides map tiles and processed city data for Scottish cities so that players can explore Scotland in the Subway Builder game.

This repository does **not** contain the patcher itself — link above.

## Relationship to the patcher

The patcher takes city data files and tiles and injects them into Subway Builder. This pack provides the Scotland-specific inputs:

1. **Map tiles** (`.pmtiles`) — raster/vector tiles for each city's geographic area.
2. **Processed data files** — four JSON/GeoJSON files per city that the patcher uses to populate demand, roads, buildings, and runway data.
3. **City registry** (`city_data.txt`) — a snippet you paste into the patcher's `config.js`.

## The four processed-data files

| File | Purpose |
|------|---------|
| `buildings_index.json(.gz)` | Index of building footprints for the city |
| `demand_data.json(.gz)` | Population and employment demand by zone |
| `roads.geojson(.gz)` | Road network for routing and display |
| `runways_taxiways.geojson(.gz)` | Airport runway/taxiway geometry (optional) |

## Why large files are not committed by default

`.pmtiles` files and processed-data files can be tens or hundreds of megabytes. The `.gitignore` excludes these by default so the repository stays lightweight. Distribute large files via:

- **GitHub Releases** (recommended for end-users)
- **Git LFS** (if your team prefers it)
- Direct download links documented in `instructions.txt`

To commit them directly, remove the relevant lines from `.gitignore`.
