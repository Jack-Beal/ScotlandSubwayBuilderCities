# map_tiles/

Place generated `.pmtiles` tile files here, one per city.

Expected filenames:
- `DND.pmtiles` — Dundee
- `EDI.pmtiles` — Edinburgh
- `GLA.pmtiles` — Glasgow

These files are excluded from git by default (see `.gitignore`). Use GitHub Releases or Git LFS to distribute them, or remove the `*.pmtiles` line from `.gitignore` if you prefer to commit them directly.

See [../docs/file_layout.md](../docs/file_layout.md) for full file layout documentation.
