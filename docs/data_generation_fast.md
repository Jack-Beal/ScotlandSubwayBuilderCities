# Data Generation — Fast Path (no Docker)

This guide shows how to generate the four city data files using only
freely-available command-line tools — no Docker required.

The results are **approximate**: routing distances/times use a simple
Euclidean or network-distance heuristic rather than a full routing engine.
For higher accuracy, see [data_generation_osrm_docker.md](data_generation_osrm_docker.md).

---

## Prerequisites

| Tool | Install |
|------|---------|
| Python 3.10+ | https://www.python.org/ |
| `osmium-tool` | `brew install osmium-tool` / `apt install osmium-tool` / [Windows](https://osmcode.org/osmium-tool/) |
| `ogr2ogr` (GDAL) | `brew install gdal` / `apt install gdal-bin` |
| Python packages | see below |

```bash
pip install osmium shapely pyproj geopandas requests tqdm
```

---

## Step 1 — Download OSM extract

Download a regional OSM extract for Scotland from Geofabrik:

```bash
wget https://download.geofabrik.de/europe/great-britain/scotland-latest.osm.pbf
```

---

## Step 2 — Clip to city bounding box

Use the bounding boxes from [bbox_and_extents.md](bbox_and_extents.md).

```bash
# Example for Edinburgh
osmium extract --bbox=-3.60,55.82,-3.00,56.10 \
  scotland-latest.osm.pbf -o EDI.osm.pbf
```

Repeat for DND and GLA with their respective bounding boxes.

---

## Step 3 — Generate roads.geojson

```bash
ogr2ogr -f GeoJSON roads_raw.geojson EDI.osm.pbf lines \
  -where "highway IS NOT NULL"

# Compress
gzip -k roads_raw.geojson
mv roads_raw.geojson.gz data/EDI/roads.geojson.gz
```

---

## Step 4 — Generate buildings_index.json

```python
# save as build_buildings.py and run: python build_buildings.py EDI EDI.osm.pbf
import sys, json, gzip, osmium

city_code, pbf_path = sys.argv[1], sys.argv[2]

class BuildingHandler(osmium.SimpleHandler):
    def __init__(self):
        super().__init__()
        self.buildings = []

    def way(self, w):
        if "building" in w.tags:
            lons = [n.lon for n in w.nodes if n.location.valid()]
            lats = [n.lat for n in w.nodes if n.location.valid()]
            if lons and lats:
                cx = sum(lons) / len(lons)
                cy = sum(lats) / len(lats)
                self.buildings.append({
                    "id": w.id,
                    "lon": round(cx, 6),
                    "lat": round(cy, 6),
                    "tags": dict(w.tags),
                })

h = BuildingHandler()
h.apply_file(pbf_path, locations=True)

out_path = f"data/{city_code}/buildings_index.json.gz"
with gzip.open(out_path, "wt", encoding="utf-8") as f:
    json.dump(h.buildings, f)
print(f"Wrote {len(h.buildings)} buildings → {out_path}")
```

---

## Step 5 — Generate demand_data.json (heuristic)

The demand model assigns a population score to each 500 m grid cell based
on building density, weighted by building type (residential > commercial >
other).

```python
# save as build_demand.py and run: python build_demand.py EDI
import sys, json, gzip
from pathlib import Path

city_code = sys.argv[1]
buildings_path = Path(f"data/{city_code}/buildings_index.json.gz")

with gzip.open(buildings_path, "rt") as f:
    buildings = json.load(f)

# 500 m grid cell key function (very rough WGS84 approximation)
def cell_key(lon, lat):
    return (round(lat * 200) / 200, round(lon * 200) / 200)

WEIGHTS = {"residential": 3, "apartments": 5, "commercial": 2,
           "retail": 2, "office": 2, "industrial": 1}

cells = {}
for b in buildings:
    key = cell_key(b["lon"], b["lat"])
    btype = b["tags"].get("building", "yes")
    weight = WEIGHTS.get(btype, 1)
    cells[key] = cells.get(key, 0) + weight

demand = [{"lat": k[0], "lon": k[1], "score": v} for k, v in cells.items()]

out_path = f"data/{city_code}/demand_data.json.gz"
with gzip.open(out_path, "wt", encoding="utf-8") as f:
    json.dump(demand, f)
print(f"Wrote {len(demand)} demand cells → {out_path}")
```

> **Note on drivingSeconds / drivingDistance:** The fast path does not
> compute per-cell routing. If the game requires these fields, set
> `drivingSeconds` to `0` and `drivingDistance` to `0` as placeholders,
> or use a simple straight-line distance approximation. For real values
> use the [OSRM Docker path](data_generation_osrm_docker.md).

---

## Step 6 — Generate runways_taxiways.geojson (optional)

```bash
ogr2ogr -f GeoJSON runways_raw.geojson EDI.osm.pbf lines \
  -where "aeroway IN ('runway','taxiway')"

gzip -k runways_raw.geojson
mv runways_raw.geojson.gz data/EDI/runways_taxiways.geojson.gz
```

If the city has no airport within its bbox, create an empty GeoJSON file:

```bash
echo '{"type":"FeatureCollection","features":[]}' | \
  gzip > data/EDI/runways_taxiways.geojson.gz
```

---

## Step 7 — Verify

After generating all four files per city, check:

```bash
ls -lh data/EDI/
# Should show:
#   buildings_index.json.gz
#   demand_data.json.gz
#   roads.geojson.gz
#   runways_taxiways.geojson.gz
```

Start the server and load the game — the city should appear with map tiles
and populated data.
