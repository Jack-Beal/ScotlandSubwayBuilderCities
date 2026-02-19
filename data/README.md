# Data Folder

This folder contains the per-city processed data files served by the local server.

## Layout

```
data/
  DND/   ← Dundee
  EDI/   ← Edinburgh
  GLA/   ← Glasgow
```

## Files required per city

Place the following four files inside each city folder.  
Download them from the [GitHub Releases](https://github.com/Jack-Beal/ScotlandSubwayBuilderCities/releases) page.

| File | Description |
|------|-------------|
| `buildings_index.json.gz` | Building footprint index |
| `demand_data.json.gz` | Population/employment demand by zone |
| `roads.geojson.gz` | Road network for routing and display |
| `runways_taxiways.geojson.gz` | Airport runway/taxiway geometry |

## How files are used

When the local server is running (`server.bat` / `server.sh`), the game mod
fetches these files from `http://localhost:8081/data/<CODE>/<file>`.

The large data files are **not committed to this repository** — they are
distributed via GitHub Releases to keep the repo size small.

## Generating data yourself

See the guides in [`docs/`](../docs/):

- [Fast path — no Docker](../docs/data_generation_fast.md)
- [Accurate path — Docker + OSRM](../docs/data_generation_osrm_docker.md)
