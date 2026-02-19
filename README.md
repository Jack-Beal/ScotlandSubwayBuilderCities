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
2. **Install the mod** — copy the `mods/dnd-localhost/` folder into the game's
   mods directory (see [Mod Installation](#mod-installation) below).
3. **Place data files** — unzip each `data-<CODE>.zip` into the matching
   `data/<CODE>/` folder.
4. **Place tile files** — copy each `<CODE>.pmtiles` file into `server/tiles/`.
5. **Start the server** — see [Starting the Server](#starting-the-server) below.
6. **Play** — launch the game; enable the **Dundee (DND) Localhost** mod and
   restart — a "Dundee (local)" tab will appear in the city picker.

---

## Mod Installation

The mod folder to copy into the game is `mods/dnd-localhost/`.

### Finding the game's mods directory

1. In Subway Builder, open **Settings → System → Open Saves Folder**.
2. Navigate **up one level** from the saves folder; you should see a `mods/`
   directory (create it if it does not exist).

On macOS this is usually:

```
/Users/<you>/Library/Application Support/Subway Builder/mods/
```

### Copy the mod

Copy `mods/dnd-localhost/` into the game `mods/` folder so the result is:

```
<game mods directory>/
  dnd-localhost/
    manifest.json
    index.js
```

### Enable the mod in the game

1. Launch Subway Builder.
2. Open **Settings → Mods**.
3. Find **Dundee (DND) Localhost** and toggle it **on**.
4. Restart the game when prompted.

---

## Starting the Server

### macOS — one-click launcher (recommended)

Double-click `launcher/Start DND.command` in Finder.

> If macOS shows a security warning, right-click the file → **Open** → **Open**
> the first time to grant permission.

The Terminal window will open, install dependencies automatically, start the
server, and display instructions for enabling the mod.

### Windows

Double-click `server.bat` at the repo root.

### Mac / Linux (terminal)

```bash
./server.sh
```

### npm

```bash
npm run serve
```

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
  mods/
    dnd-localhost/    ← copy into game mods directory for DND localhost mod
      manifest.json
      index.js
  launcher/
    Start DND.command ← macOS double-click launcher (starts server automatically)
  data/               ← place downloaded data files here
    DND/
    EDI/
    GLA/
  server/             ← local tile/data server
    server.mjs
    tiles/            ← place <CODE>.pmtiles files here
  tools/              ← Node.js generator scripts
    generate_buildings_index.mjs
    generate_demand_data.mjs
    validate_outputs.mjs
    package.json
  package.json        ← npm run gen:* convenience scripts
  server.bat          ← Windows: start the server
  server.sh           ← Mac/Linux: start the server
  docs/               ← data generation and release guides
```

---

## Generating Data Yourself

Two paths are available:

| Path | Guide | Requirements |
|------|-------|--------------|
| **Node.js generators** (recommended) | [docs/generators.md](docs/generators.md) | Node.js ≥ 18, OSM building GeoJSON |
| **Fast** (approximate, Python) | [docs/data_generation_fast.md](docs/data_generation_fast.md) | Python, osmium-tool, GDAL |
| **Accurate** (OSRM routing) | [docs/data_generation_osrm_docker.md](docs/data_generation_osrm_docker.md) | + Docker |

---

## Documentation

| File | Contents |
|------|----------|
| [docs/generators.md](docs/generators.md) | Node.js generator scripts (recommended) |
| [docs/bbox_and_extents.md](docs/bbox_and_extents.md) | Bounding boxes and metro scopes |
| [docs/data_generation_fast.md](docs/data_generation_fast.md) | Fast data generation (no Docker) |
| [docs/data_generation_osrm_docker.md](docs/data_generation_osrm_docker.md) | Accurate routing with OSRM + Docker |
| [docs/release_process.md](docs/release_process.md) | How to publish a release |
| [server/README.md](server/README.md) | Local server setup |
| [data/README.md](data/README.md) | Data folder layout |
| [mods/dnd-localhost/README.md](mods/dnd-localhost/README.md) | DND localhost mod setup |

---

## Credits

Data generated from public OSM and public population/jobs datasets.

License: MIT — see [LICENSE](LICENSE).
