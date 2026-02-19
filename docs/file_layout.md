# File Layout

This document describes the expected directory and file structure for the Scotland Cities Pack.

## Repository root

```
/
  README.md          — project overview and quickstart
  city_data.txt      — paste-ready patcher config snippet (active cities only)
  instructions.txt   — Windows install steps
  .gitignore
  LICENSE
```

## map_tiles/

```
map_tiles/
  DND.pmtiles        — Dundee map tiles
  EDI.pmtiles        — Edinburgh map tiles
  GLA.pmtiles        — Glasgow map tiles
```

Filenames must match the `code` field in `city_data.txt` exactly (uppercase, 3 letters).

## processed_data/

```
processed_data/
  DND/
    buildings_index.json    (or .json.gz)
    demand_data.json        (or .json.gz)
    roads.geojson           (or .geojson.gz)
    runways_taxiways.geojson  (or .geojson.gz)
  EDI/
    (same four files)
  GLA/
    (same four files)
```

The folder name must match the `code` field in `city_data.txt` exactly (uppercase, 3 letters).

Both plain JSON and gzipped (`.gz`) variants are accepted by the patcher. Do not include both forms of the same file.

## planned/

```
planned/
  README.md
  processed_data/
    ABD/.gitkeep
    INV/.gitkeep
    STL/.gitkeep
    PTH/.gitkeep
  map_tiles/
    .gitkeep
```

Stub folders for future cities. No data files here yet.

## docs/

```
docs/
  overview.md           — purpose and structure
  file_layout.md        — this file
  adding_a_city.md      — contributor checklist
  metro_extent_notes.md — commuter-belt extent intent per city
```
