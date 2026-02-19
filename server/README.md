# Local Server

Node.js server that provides tiles and data to the Scotland Cities mod at `http://localhost:8081`.

## Requirements

- [Node.js](https://nodejs.org/) v18 or later

## Quick start

Use the provided scripts from the **repo root** (they install dependencies and start the server):

- **Windows:** double-click `server.bat` or run it in a terminal
- **Mac / Linux:** run `./server.sh` in a terminal

## Manual start

```bash
cd server
npm install
npm start
```

## URL scheme

| URL | Served from |
|-----|-------------|
| `http://localhost:8081/data/<CODE>/<file>` | `data/<CODE>/<file>` in repo root |
| `http://localhost:8081/<NAME>.pmtiles` | `server/tiles/<NAME>.pmtiles` |

## Directory layout

```
server/
  server.mjs      ← Node HTTP server (no framework, pure Node built-ins)
  package.json
  pmtiles/        ← place the pmtiles CLI binary here (not served)
  tiles/          ← place <CODE>.pmtiles files here
  README.md
```

## Placing tile files

Download `<CODE>.pmtiles` from the
[GitHub Releases](https://github.com/Jack-Beal/ScotlandSubwayBuilderCities/releases)
page and place them in `server/tiles/`.

## CORS

The server adds `Access-Control-Allow-Origin: *` and supports HTTP range
requests, which are required by the PMTiles client library.
