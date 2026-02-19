# Data Generation — Accurate Path (Docker + OSRM)

This guide produces **accurate routing-based** `drivingSeconds` and
`drivingDistance` values using [OSRM](http://project-osrm.org/) inside
Docker. Follow the [fast path](data_generation_fast.md) first to get the
other three files; this guide upgrades `demand_data.json.gz` only.

---

## Prerequisites

- Docker Desktop (or Docker Engine on Linux)
- The clipped city `.osm.pbf` file produced in the fast path (Step 2)
- Python packages: `requests`, `tqdm`, `geopandas` (same as fast path)

---

## Step 1 — Pre-process OSM data for OSRM

```bash
# Example for Edinburgh — adapt CODE and BBOX for other cities
CODE=EDI
PBF=${CODE}.osm.pbf

docker run --rm -v "$(pwd):/data" \
  ghcr.io/project-osrm/osrm-backend:v5.27.1 \
  osrm-extract -p /opt/car.lua /data/${PBF}

docker run --rm -v "$(pwd):/data" \
  ghcr.io/project-osrm/osrm-backend:v5.27.1 \
  osrm-partition /data/${CODE}.osrm

docker run --rm -v "$(pwd):/data" \
  ghcr.io/project-osrm/osrm-backend:v5.27.1 \
  osrm-customize /data/${CODE}.osrm
```

---

## Step 2 — Start the OSRM routing server

```bash
docker run --rm -d -p 5000:5000 \
  -v "$(pwd):/data" \
  --name osrm-${CODE} \
  ghcr.io/project-osrm/osrm-backend:v5.27.1 \
  osrm-routed --algorithm mld /data/${CODE}.osrm
```

The server is now available at `http://localhost:5000`.

---

## Step 3 — Enrich demand_data.json with routing

The script below loads the heuristic demand file (from the fast path),
picks the city centre as the routing destination, and queries OSRM for
each cell centroid.

```python
# save as enrich_demand.py and run: python enrich_demand.py EDI 55.9533 -3.1883
import sys, json, gzip, requests
from tqdm import tqdm

city_code = sys.argv[1]
dest_lat = float(sys.argv[2])   # city centre latitude
dest_lon = float(sys.argv[3])   # city centre longitude

demand_path = f"data/{city_code}/demand_data.json.gz"
with gzip.open(demand_path, "rt") as f:
    demand = json.load(f)

OSRM_URL = "http://localhost:5000/route/v1/driving"

for cell in tqdm(demand, desc="Routing"):
    origin = f"{cell['lon']},{cell['lat']}"
    dest = f"{dest_lon},{dest_lat}"
    try:
        r = requests.get(
            f"{OSRM_URL}/{origin};{dest}",
            params={"overview": "false"},
            timeout=10,
        )
        r.raise_for_status()
        route = r.json()["routes"][0]
        cell["drivingSeconds"] = round(route["duration"])
        cell["drivingDistance"] = round(route["distance"])
    except Exception as e:
        cell["drivingSeconds"] = 0
        cell["drivingDistance"] = 0

with gzip.open(demand_path, "wt", encoding="utf-8") as f:
    json.dump(demand, f)
print(f"Enriched {len(demand)} cells → {demand_path}")
```

---

## Step 4 — Stop the OSRM container

```bash
docker stop osrm-${CODE}
```

---

## Notes

- OSRM pre-processing is CPU-intensive for large extracts. For the full
  Scotland extract (~200 MB), expect several minutes.
- The clipped city `.osm.pbf` from Step 2 of the fast path is small enough
  to process in under a minute on a modern laptop.
- If a cell centroid falls outside the road network, OSRM may return no
  route. The script above defaults such cells to `0` rather than failing.
- You can use a different routing profile (e.g. `foot.lua`) if you want
  walking-time demand instead of driving-time demand.
