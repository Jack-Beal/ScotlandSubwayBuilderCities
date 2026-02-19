# Subway Builder — Scotland Cities Pack

A data pack for [Kronifer's Subway Builder patcher](https://github.com/Kronifer/subwaybuilder-patcher/tree/main) containing map tiles and processed city data for Scottish cities.

This repository is a **file store** — drop your generated `.pmtiles` and processed-data folders in here, then follow `instructions.txt` to wire them into the patcher.

---

## Quick Start

Read **[instructions.txt](instructions.txt)** for full Windows install steps.

---

## Active Cities

| Code | City | Status |
|------|------|--------|
| DND  | Dundee | 🟡 Placeholder — files not yet generated |
| EDI  | Edinburgh | 🟡 Placeholder — files not yet generated |
| GLA  | Glasgow | 🟡 Placeholder — files not yet generated |

### Metro Extent Notes

Cities use a **commuter-belt scale**, not just the city core. Edinburgh's intended extent includes the city out to roughly the ring road **and** Inverkeithing on the north side of the Forth. See [docs/metro_extent_notes.md](docs/metro_extent_notes.md) for full intent notes.

---

## Planned Cities (not yet active)

Aberdeen (ABD), Inverness (INV), Stirling (STL), Perth (PTH) — stubs only; see [planned/](planned/).

Want to contribute a city? See [docs/adding_a_city.md](docs/adding_a_city.md).

---

## Where Files Go in the Patcher

| This repo path | Patcher destination |
|---|---|
| `map_tiles/<CODE>.pmtiles` | `map_files/<CODE>.pmtiles` |
| `processed_data/<CODE>/` | patcher processed-data directory |

---

## Large Files and `.gitignore`

By default, `.gitignore` excludes `*.pmtiles`, `*.mbtiles`, large GeoJSON archives, etc., to keep the repo lightweight. If you want to commit binaries, remove the relevant lines from `.gitignore` or consider using [Git LFS](https://git-lfs.github.com/) or GitHub Releases to host them.

---

## Documentation

- [docs/overview.md](docs/overview.md) — purpose and pack structure
- [docs/file_layout.md](docs/file_layout.md) — expected file names per city
- [docs/adding_a_city.md](docs/adding_a_city.md) — how to add a new city
- [docs/metro_extent_notes.md](docs/metro_extent_notes.md) — commuter-belt extent intent per city

---

## Credits

Data generated from public OSM and public population/jobs datasets; methodology to be documented.

License: MIT — see [LICENSE](LICENSE).
