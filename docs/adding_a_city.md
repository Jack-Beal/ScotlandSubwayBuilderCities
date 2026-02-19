# Adding a New City

Follow this checklist to add a new city to the Scotland pack.

## Checklist

- [ ] **Choose a 3-letter city code** (uppercase, unique, matches the Canada pack convention — e.g. `ABD` for Aberdeen).

- [ ] **Generate the map tile file**
  - Produce `<CODE>.pmtiles` for the city's commuter-belt bounding box.
  - Copy it into `map_tiles/<CODE>.pmtiles`.
  - See [metro_extent_notes.md](metro_extent_notes.md) for bbox intent guidance.

- [ ] **Generate the four processed-data files** and place them in `processed_data/<CODE>/`:
  - `buildings_index.json` (or `.json.gz`)
  - `demand_data.json` (or `.json.gz`)
  - `roads.geojson` (or `.geojson.gz`)
  - `runways_taxiways.geojson` (or `.geojson.gz`)

- [ ] **Add an entry to `city_data.txt`**
  - Copy the format of an existing entry (DND/EDI/GLA).
  - Include a `// TODO: refine bbox` comment if the bounding box is not yet finalised.
  - No trailing comma on the last entry in the list.

- [ ] **Update `README.md`**
  - Add the city to the Active Cities table.
  - If promoting a planned city, remove it from the Planned Cities list.

- [ ] **If this was a planned city**, remove or archive its stub from `planned/processed_data/<CODE>/`.

- [ ] **Open a pull request** with the new data files (or a link to where they can be downloaded).

## Tips

- Bbox should be `[minLon, minLat, maxLon, maxLat]` in decimal degrees.
- Population value is a metro-area estimate; approximate is fine — add a `// TODO` comment.
- Test by following `instructions.txt` locally before merging.
