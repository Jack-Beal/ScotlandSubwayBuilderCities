# planned/

This directory contains stubs for **future** cities that are planned but not yet active.

**Do not copy anything from this directory into the patcher.** These folders contain no real data and will cause errors if added to `city_data.txt` or the patcher before data has been generated.

## Planned cities

| Code | City |
|------|------|
| ABD  | Aberdeen |
| INV  | Inverness |
| STL  | Stirling |
| PTH  | Perth |

## When a planned city becomes active

1. Generate tile and processed-data files for the city.
2. Move/copy the city folder from `planned/processed_data/<CODE>/` to `processed_data/<CODE>/`.
3. Move/copy the tile file from `planned/map_tiles/<CODE>.pmtiles` to `map_tiles/<CODE>.pmtiles` (once generated).
4. Add the city entry to `city_data.txt`.
5. Update `README.md`'s active cities table.

See [../docs/adding_a_city.md](../docs/adding_a_city.md) for the full checklist.
