# processed_data/

Each active city has its own subfolder here. Once data files are generated, place them in the appropriate city subfolder.

## Active city folders

| Folder | City |
|--------|------|
| `DND/` | Dundee |
| `EDI/` | Edinburgh |
| `GLA/` | Glasgow |

## Expected files per city folder

```
<CODE>/
  buildings_index.json   (or buildings_index.json.gz)
  demand_data.json       (or demand_data.json.gz)
  roads.geojson          (or roads.geojson.gz)
  runways_taxiways.geojson  (or runways_taxiways.geojson.gz)
```

Large JSON and GeoJSON files are excluded from git by default (see `.gitignore`). Use GitHub Releases or Git LFS, or remove the relevant ignore rules, to commit them directly.

See [../docs/file_layout.md](../docs/file_layout.md) for more detail.
