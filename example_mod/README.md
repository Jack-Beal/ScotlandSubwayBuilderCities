# Example Mod — Local Test Setup for DND (Dundee)

This directory contains a minimal mod snippet you can use to point
**Subway Builder** at your locally running Scotland Cities server while
testing the Dundee (DND) city.

## Prerequisites

1. Generate the data files (if you haven't already):
   ```bash
   npm run gen:all
   ```
   This produces:
   - `data/DND/buildings_index.json.gz`
   - `data/DND/demand_data.json.gz`
   - `data/DND/roads.geojson.gz`
   - `data/DND/runways_taxiways.geojson.gz`

2. Place your PMTiles archive at `server/tiles/DND.pmtiles`.

3. Start the local server:
   ```bash
   npm run serve
   # or: ./server.sh   (Mac/Linux)
   # or: server.bat    (Windows)
   ```
   Verify it is running:
   ```
   curl http://127.0.0.1:8081/health
   # → {"status":"ok","server":"ScotlandCities","port":8081}
   ```

## Endpoints served by the local server

| Endpoint | Description |
|---|---|
| `GET /health` | Health check |
| `GET /data/DND/buildings_index.json.gz` | Building footprint index |
| `GET /data/DND/demand_data.json.gz` | Demand data |
| `GET /data/DND/roads.geojson.gz` | Road network |
| `GET /data/DND/runways_taxiways.geojson.gz` | Runways / taxiways |
| `GET /DND/{z}/{x}/{y}.mvt` | Vector map tiles (MVT) |
| `GET /server/tiles/DND.pmtiles` | Raw PMTiles archive (range requests) |

## Using the mod in Subway Builder

The full mod lives in `scotland-cities/` and is already configured to use
`http://localhost:8081`. Copy that folder into your game's mods directory.

If you need to test a **single city** without the full mod, paste the
snippet from [`dnd_snippet.js`](./dnd_snippet.js) into a minimal mod file.
