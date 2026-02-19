# Bounding Boxes and Metro Extents

This document records the bounding boxes and geographic scope intended for
each active city in the Scotland Cities mod.

All bounding boxes are in the format `[west, south, east, north]` (WGS84).

---

## Active Cities

### Dundee (DND)

**Scope:** Dundee city centre and the Tay estuary corridor, including
Broughty Ferry and Monifieth to the east, and the Lochee area to the northwest.

| Key areas | Notes |
|-----------|-------|
| City centre and waterfront (V&A area) | Core demand zone |
| Broughty Ferry | East corridor |
| Monifieth | Eastern suburb |
| Lochee | Northwest |

**Bounding box (placeholder — refine before generating tiles):**
```
[-3.18, 56.38, -2.78, 56.58]
```

**Map centre (approximate):** longitude `-2.97`, latitude `56.462`

---

### Edinburgh (EDI)

**Scope:** City out to roughly the A720 ring road, plus Inverkeithing on the
north side of the Firth of Forth via the Forth Bridge corridor.

| Key areas | Notes |
|-----------|-------|
| City centre and Old Town | Core demand zone |
| Western employment (Gyle, Edinburgh Park) | Major commuter destination |
| Leith and the waterfront | North |
| Portobello | East |
| Inverkeithing / North Queensferry | North of the Forth |

**Bounding box (placeholder — refine before generating tiles):**
```
[-3.60, 55.82, -3.00, 56.10]
```

**Map centre (approximate):** longitude `-3.19`, latitude `55.953`

---

### Glasgow (GLA)

**Scope:** City centre and the main satellite towns of the Clyde corridor,
including East Kilbride, Paisley, Clydebank, and Rutherglen/Cambuslang.

| Key areas | Notes |
|-----------|-------|
| City centre and West End | Core demand zone |
| Clyde riverside (Pacific Quay, Govan, Partick) | Regeneration zone |
| Paisley | West |
| East Kilbride | Southeast |
| Clydebank | Northwest |

**Bounding box (placeholder — refine before generating tiles):**
```
[-4.50, 55.72, -3.95, 55.98]
```

**Map centre (approximate):** longitude `-4.25`, latitude `55.864`

---

## Planned Cities (not yet active)

These cities are documented here for future reference. They are **not**
registered in the mod yet.

| Code | City | Placeholder bbox |
|------|------|-----------------|
| ABD | Aberdeen | `[-2.30, 57.05, -2.00, 57.25]` |
| INV | Inverness | `[-4.35, 57.40, -3.95, 57.55]` |
| STL | Stirling | `[-3.98, 56.05, -3.85, 56.18]` |
| PTH | Perth | `[-3.55, 56.30, -3.35, 56.50]` |

---

## Generating tiles from a bounding box

Once bounding boxes are finalised, use [Planetiler](https://github.com/onthegomap/planetiler)
or [tilemaker](https://github.com/systemed/tilemaker) to produce a `.pmtiles`
file for each city, then place it in `server/tiles/`.

See [release_process.md](release_process.md) for how to distribute the
generated files.
