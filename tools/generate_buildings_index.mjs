#!/usr/bin/env node
/**
 * generate_buildings_index.mjs
 *
 * Reads build/<CODE>/geojson/buildings.geojson (streamed, memory-efficient)
 * and writes data/<CODE>/buildings_index.json.gz in the OptimizedBuildingIndex
 * format required by Subway Builder API v1.0.0.
 *
 * OptimizedBuildingIndex schema:
 *   cs        – cell size in degrees
 *   bbox      – [minLon, minLat, maxLon, maxLat] of all buildings
 *   grid      – [cols, rows] number of grid cells
 *   cells     – sparse object keyed by cell-index string → array of building indices
 *               (only cells with ≥1 building are present)
 *   buildings – array of { b, f, p }
 *                 b: bbox [minLon, minLat, maxLon, maxLat]
 *                 f: foundation depth (negative metres, heuristic from area)
 *                 p: outer polygon ring coordinates [[lon,lat],…]
 *   stats     – { count, maxDepth }
 *
 * Foundation depth heuristic:
 *   area_deg² is converted to approximate m² using 111 000 m/degree.
 *   depth = −(1.5 + sqrt(area_m2) * 0.002), clamped to [−1.5, −15].
 *   This is a purely synthetic approximation with no real-world data.
 *
 * Usage:
 *   node generate_buildings_index.mjs --code DND [--cell-size 0.002]
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { program } from "commander";
import chainPkg from "stream-chain";
import streamJsonPkg from "stream-json";
import pickPkg from "stream-json/filters/Pick.js";
import streamArrayPkg from "stream-json/streamers/StreamArray.js";

const { chain } = chainPkg;
const { parser } = streamJsonPkg;
const { pick } = pickPkg;
const { streamArray } = streamArrayPkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

program
  .requiredOption("--code <CODE>", "City code, e.g. DND")
  .option("--cell-size <degrees>", "Grid cell size in degrees", "0.002")
  .parse();

const { code, cellSize: cellSizeStr } = program.opts();
const CELL_SIZE = parseFloat(cellSizeStr);

const INPUT_PATH = path.join(REPO_ROOT, "build", code, "geojson", "buildings.geojson");
const OUTPUT_DIR = path.join(REPO_ROOT, "data", code);
const OUTPUT_PATH = path.join(OUTPUT_DIR, "buildings_index.json.gz");

if (!fs.existsSync(INPUT_PATH)) {
  console.error(`[gen:buildings] Input file not found: ${INPUT_PATH}`);
  process.exit(1);
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ── helpers ──────────────────────────────────────────────────────────────────

/** Compute the bounding box of a polygon ring */
function ringBbox(ring) {
  let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;
  for (const [lon, lat] of ring) {
    if (lon < minLon) minLon = lon;
    if (lat < minLat) minLat = lat;
    if (lon > maxLon) maxLon = lon;
    if (lat > maxLat) maxLat = lat;
  }
  return [minLon, minLat, maxLon, maxLat];
}

/** Area of a polygon ring in degrees² (shoelace) */
function ringAreaDeg2(ring) {
  let area = 0;
  const n = ring.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    area += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return Math.abs(area) / 2;
}

/** Foundation depth heuristic (metres, negative) */
function foundationDepth(areaDeg2) {
  const DEG_TO_M = 111000;
  const areaM2 = areaDeg2 * DEG_TO_M * DEG_TO_M;
  const depth = -(1.5 + Math.sqrt(areaM2) * 0.002);
  // Clamp to [-15, -1.5] range (most negative = deepest, least negative = shallowest)
  return Math.max(-15, Math.min(-1.5, depth));
}

// ── stream buildings ──────────────────────────────────────────────────────────

console.log(`[gen:buildings] Reading ${INPUT_PATH} …`);

const buildings = [];
let globalMinLon = Infinity, globalMinLat = Infinity;
let globalMaxLon = -Infinity, globalMaxLat = -Infinity;

await new Promise((resolve, reject) => {
  const pipe = chain([
    fs.createReadStream(INPUT_PATH),
    parser(),
    pick({ filter: "features" }),
    streamArray(),
  ]);

  pipe.on("data", ({ value: feature }) => {
    if (!feature || feature.type !== "Feature") return;
    const geom = feature.geometry;
    if (!geom) return;

    let ring;
    if (geom.type === "Polygon" && geom.coordinates?.length > 0) {
      ring = geom.coordinates[0];
    } else if (geom.type === "MultiPolygon" && geom.coordinates?.length > 0) {
      ring = geom.coordinates[0][0];
    } else {
      return;
    }

    if (!ring || ring.length < 3) return;

    const bbox = ringBbox(ring);
    const areaDeg2 = ringAreaDeg2(ring);
    const f = parseFloat(foundationDepth(areaDeg2).toFixed(2));

    if (bbox[0] < globalMinLon) globalMinLon = bbox[0];
    if (bbox[1] < globalMinLat) globalMinLat = bbox[1];
    if (bbox[2] > globalMaxLon) globalMaxLon = bbox[2];
    if (bbox[3] > globalMaxLat) globalMaxLat = bbox[3];

    buildings.push({ b: bbox, f, p: ring });
  });

  pipe.on("end", resolve);
  pipe.on("error", reject);
});

console.log(`[gen:buildings] Parsed ${buildings.length} buildings.`);

if (buildings.length === 0) {
  console.error("[gen:buildings] No buildings found — aborting.");
  process.exit(1);
}

// ── build grid index ──────────────────────────────────────────────────────────

const bbox = [globalMinLon, globalMinLat, globalMaxLon, globalMaxLat];
const cols = Math.ceil((globalMaxLon - globalMinLon) / CELL_SIZE) + 1;
const rows = Math.ceil((globalMaxLat - globalMinLat) / CELL_SIZE) + 1;

// Map cell index → array of building indices (sparse — only non-empty cells)
const cells = {};
let maxDepth = 0;

for (let i = 0; i < buildings.length; i++) {
  const b = buildings[i];
  const bboxB = b.b;
  const depth = Math.abs(b.f);
  if (depth > maxDepth) maxDepth = depth;

  // A building may span multiple cells — index all cells its bbox touches
  const colMin = Math.floor((bboxB[0] - globalMinLon) / CELL_SIZE);
  const rowMin = Math.floor((bboxB[1] - globalMinLat) / CELL_SIZE);
  const colMax = Math.floor((bboxB[2] - globalMinLon) / CELL_SIZE);
  const rowMax = Math.floor((bboxB[3] - globalMinLat) / CELL_SIZE);

  for (let r = rowMin; r <= rowMax; r++) {
    for (let c = colMin; c <= colMax; c++) {
      const idx = (r * cols + c).toString();
      if (!cells[idx]) cells[idx] = [];
      cells[idx].push(i);
    }
  }
}

const index = {
  cs: CELL_SIZE,
  bbox,
  grid: [cols, rows],
  cells,
  buildings,
  stats: { count: buildings.length, maxDepth: parseFloat(maxDepth.toFixed(2)) },
};

// ── write gzipped output ──────────────────────────────────────────────────────

console.log(`[gen:buildings] Writing ${OUTPUT_PATH} …`);

const json = JSON.stringify(index);
const compressed = zlib.gzipSync(Buffer.from(json, "utf8"));
fs.writeFileSync(OUTPUT_PATH, compressed);

const kb = (compressed.length / 1024).toFixed(1);
console.log(
  `[gen:buildings] Done — ${buildings.length} buildings, ${Object.keys(cells).length} cells, ${kb} KB gzipped.`
);
