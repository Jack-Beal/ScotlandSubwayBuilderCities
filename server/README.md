# Local Server

Node.js server that provides tiles and data to the Scotland Cities mod at `http://localhost:8081`.

## Requirements

- [Node.js](https://nodejs.org/) v18 or later

## Quick start

Use the provided scripts from the **repo root** (they install dependencies and start the server):

- **Windows:** double-click `server.bat` or run it in a terminal
- **Mac / Linux:** run `./server.sh` in a terminal
- **npm:** `npm run serve` (from repo root)

Optional flags:

```bash
./server.sh --port 9090 --host 0.0.0.0
npm run serve -- --port 9090 --host 0.0.0.0
```

## Manual start

```bash
cd server
npm install
npm start
# or: node server.mjs --port 8081 --host 127.0.0.1
```

## URL scheme

| URL | Served from |
|-----|-------------|
| `GET /health` | JSON health check (`{"status":"ok"}`) |
| `GET /data/<CODE>/<file>` | `data/<CODE>/<file>` in repo root |
| `GET /server/tiles/<file>` | `server/tiles/<file>` (range-request capable) |
| `GET /<CODE>/<z>/<x>/<y>.mvt` | Individual MVT tile read from `server/tiles/<CODE>.pmtiles` |
| `GET /<NAME>.pmtiles` | `server/tiles/<NAME>.pmtiles` (range-request capable) |

### MVT tile endpoint

The `/<CODE>/<z>/<x>/<y>.mvt` route uses the
[`pmtiles`](https://www.npmjs.com/package/pmtiles) npm library to read
individual tiles directly from the PMTiles archive.  This means you do
**not** need the `pmtiles serve` CLI — the Node server handles everything.

```
http://localhost:8081/DND/12/2047/1365.mvt
```

Configure Subway Builder to use this URL pattern:
```
http://127.0.0.1:8081/DND/{z}/{x}/{y}.mvt
```

## Directory layout

```
server/
  server.mjs      ← Node HTTP server (no framework)
  package.json
  pmtiles/        ← place the pmtiles CLI binary here (not served)
  tiles/          ← place <CODE>.pmtiles files here
  README.md
```

## Placing tile files

Download `<CODE>.pmtiles` from the
[GitHub Releases](https://github.com/Jack-Beal/ScotlandSubwayBuilderCities/releases)
page and place them in `server/tiles/`.

Or generate your own — see the guides in [`docs/`](../docs/).

## CORS

The server adds `Access-Control-Allow-Origin: *` and supports HTTP range
requests, which are required by the PMTiles client library.
