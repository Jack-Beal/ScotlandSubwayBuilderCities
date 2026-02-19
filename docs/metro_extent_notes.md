# Metro Extent Notes

This document records the **intended geographic extents** for each city in the pack. These are intent notes, not hard constraints — refine the bounding boxes when generating actual tiles.

## Guiding principle

Use a **commuter-belt scale**, not just the administrative city boundary or the dense urban core. The goal is that a player can build a metro system that serves the realistic daily-travel catchment of each city.

---

## Active Cities

### Edinburgh (EDI)

**Intent:** Include the city out to roughly the ring road (A720 corridor) as the southern/western/eastern limit. On the north side of the Firth of Forth, include **Inverkeithing** (and ideally Rosyth/North Queensferry) since these are natural metro candidates across the Forth Bridge corridor.

Key areas to include:
- City centre and Old Town
- Western employment areas (Gyle, South Gyle, Edinburgh Park / Hermiston Gait)
- Leith and the waterfront
- Portobello to the east
- Inverkeithing / North Queensferry across the Forth (north)

**Placeholder bbox (TODO — refine):** `[-3.60, 55.82, -3.00, 56.10]`

---

### Glasgow (GLA)

**Intent:** Include the city centre and the main satellite towns of the Clyde corridor. Key commuter destinations include East Kilbride, Paisley, Clydebank, and Rutherglen/Cambuslang.

Key areas to include:
- City centre and West End
- Clyde riverside (Pacific Quay, Govan, Partick)
- Paisley (west)
- East Kilbride (southeast)
- Clydebank (northwest)

**Placeholder bbox (TODO — refine):** `[-4.50, 55.72, -3.95, 55.98]`

---

### Dundee (DND)

**Intent:** Include the city and the Tay estuary corridor. Key commuter areas include Broughty Ferry to the east and Monifieth. The Tay Rail Bridge makes Perth direction a potential extension.

Key areas to include:
- City centre and waterfront (V&A area)
- Broughty Ferry (east)
- Monifieth (east)
- Lochee (northwest)

**Placeholder bbox (TODO — refine):** `[-3.18, 56.38, -2.78, 56.58]`

---

## Planned Cities (intent only)

### Aberdeen (ABD)

Commuter belt includes Dyce (airport), Bridge of Don (north), Portlethen (south), and Westhill (west). Consider the Aberdeen Western Peripheral Route as an approximate outer limit.

**Placeholder bbox (TODO):** `[-2.30, 57.05, -2.00, 57.25]`

---

### Inverness (INV)

Smaller city; commuter belt is more compact. Include Culloden (east), Merkinch/Crown (city zones), and Millburn (industrial east). Consider extending to Nairn direction for rail corridor.

**Placeholder bbox (TODO):** `[-4.35, 57.40, -3.95, 57.55]`

---

### Stirling (STL)

Bridge town and university city. Key commuter areas: Bridge of Allan (north), Bannockburn (south), Cambusbarron (west). The M9/A9 corridor is the approximate outer limit.

**Placeholder bbox (TODO):** `[-3.98, 56.05, -3.85, 56.18]`

---

### Perth (PTH)

Gateway city at the head of the Tay estuary. Commuter belt: Scone (northeast), Kinross (south, via M90), Crieff direction (west). Consider the A9/M90 interchange as a reasonable outer limit.

**Placeholder bbox (TODO):** `[-3.55, 56.30, -3.35, 56.50]`
