# Subway Builder — Scotland Cities Mod

API v1.0.0 mod for [Subway Builder](https://store.steampowered.com/app/1499710/Subway_Builder/)
that adds Scottish metro areas: **Dundee**, **Edinburgh**, and **Glasgow**.

> **Large files (tiles + data) are distributed via
> [GitHub Releases](https://github.com/Jack-Beal/ScotlandSubwayBuilderCities/releases)
> — the repo itself stays small.**

---

## Quick Install

1. **Download the latest release** from
   [Releases](https://github.com/Jack-Beal/ScotlandSubwayBuilderCities/releases).
2. **Install the mod** — copy the `scotland-cities/` folder into the game's
   mods directory.
3. **Place data files** — unzip each `data-<CODE>.zip` into the matching
   `data/<CODE>/` folder.
4. **Place tile files** — copy each `<CODE>.pmtiles` file into `server/tiles/`.
5. **Start the server** — run `server.bat` (Windows) or `./server.sh`
   (Mac/Linux) to start the local tile/data server at `http://localhost:8081`.
6. **Play** — launch the game; a "Scotland" tab should appear in the city picker.

---

## Active Cities

| Code | City | Population | Status |
|------|------|-----------|--------|
| DND  | Dundee | ~250 000 | 🟡 Data files not yet generated |
| EDI  | Edinburgh | ~900 000 | 🟡 Data files not yet generated |
| GLA  | Glasgow | ~1 100 000 | 🟡 Data files not yet generated |

Edinburgh's extent includes **Inverkeithing** across the Firth of Forth.

### Planned Cities (not yet active)

Aberdeen (ABD), Inverness (INV), Stirling (STL), Perth (PTH) are planned
for future releases.

---

## Repository Layout

```
/
  scotland-cities/    ← copy into game mods directory
    manifest.json
    index.js
  data/               ← place downloaded data files here
    DND/
    EDI/
    GLA/
  server/             ← local tile/data server
    server.mjs
    tiles/            ← place <CODE>.pmtiles files here
  server.bat          ← Windows: start the server
  server.sh           ← Mac/Linux: start the server
  docs/               ← data generation and release guides
```

---

## Generating Data Yourself

Two paths are available:

| Path | Guide | Requirements |
|------|-------|--------------|
| **Fast** (approximate) | [docs/data_generation_fast.md](docs/data_generation_fast.md) | Python, osmium-tool, GDAL |
| **Accurate** (OSRM routing) | [docs/data_generation_osrm_docker.md](docs/data_generation_osrm_docker.md) | + Docker |

---

## Documentation

| File | Contents |
|------|----------|
| [docs/bbox_and_extents.md](docs/bbox_and_extents.md) | Bounding boxes and metro scopes |
| [docs/data_generation_fast.md](docs/data_generation_fast.md) | Fast data generation (no Docker) |
| [docs/data_generation_osrm_docker.md](docs/data_generation_osrm_docker.md) | Accurate routing with OSRM + Docker |
| [docs/release_process.md](docs/release_process.md) | How to publish a release |
| [server/README.md](server/README.md) | Local server setup |
| [data/README.md](data/README.md) | Data folder layout |

---

## Credits

Data generated from public OSM and public population/jobs datasets.

License: MIT — see [LICENSE](LICENSE).
