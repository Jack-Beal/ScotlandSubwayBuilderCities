# Release Process

This document explains how to publish a new release of the Scotland Cities
mod so that end-users can download and install it.

The repository itself stays **small** — large binary files (`.pmtiles`,
`.json.gz`, `.geojson.gz`) are distributed through GitHub Releases.

---

## What goes in a release?

Each GitHub Release should contain:

| Asset | Description |
|-------|-------------|
| `DND.pmtiles` | Vector tiles for Dundee |
| `EDI.pmtiles` | Vector tiles for Edinburgh |
| `GLA.pmtiles` | Vector tiles for Glasgow |
| `data-DND.zip` | Data files for Dundee (four `.gz` files) |
| `data-EDI.zip` | Data files for Edinburgh |
| `data-GLA.zip` | Data files for Glasgow |
| `scotland-cities-vX.Y.Z.zip` | The mod folder (`scotland-cities/`) |

> You can also bundle all data files into a single `data-all.zip` if you prefer.

---

## Step-by-step

### 1. Generate data and tiles

Follow the guides in:

- [data_generation_fast.md](data_generation_fast.md) — for data files
- The tool of your choice (Planetiler / tilemaker) — for `.pmtiles`

Place the output files in:

```
server/tiles/DND.pmtiles   (etc.)
data/DND/buildings_index.json.gz   (etc.)
```

### 2. Test locally

Start the server and load the mod in the game:

```bash
./server.sh       # Mac/Linux
server.bat        # Windows
```

Verify each city loads with tiles and data before publishing.

### 3. Bundle release assets

```bash
# Zip each city's data folder
zip data-DND.zip data/DND/*.gz
zip data-EDI.zip data/EDI/*.gz
zip data-GLA.zip data/GLA/*.gz

# Zip the mod folder
zip -r scotland-cities-v0.1.0.zip scotland-cities/
```

### 4. Create a GitHub Release

1. Go to the repository → **Releases** → **Draft a new release**.
2. Create a new tag (e.g. `v0.1.0`).
3. Write release notes (cities included, data generation method, known issues).
4. Upload the assets listed above.
5. Publish the release.

### 5. Update installation instructions

Update the download links in `README.md` to point to the new release tag.

---

## Version numbering

Use [Semantic Versioning](https://semver.org/):

- **MAJOR** — breaking change to the mod API or data format
- **MINOR** — new city or significant new feature
- **PATCH** — data refresh or bug fix

---

## Keeping the repo small

The following are excluded from git (see `.gitignore`):

- `*.pmtiles`
- `*.json.gz`
- `*.geojson.gz`
- `*.osm.pbf`
- `server/node_modules/`

Never commit these files directly. Always distribute them via Releases.
