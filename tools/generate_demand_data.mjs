#!/usr/bin/env node
/**
 * generate_demand_data.mjs
 *
 * Generates procedural demand data for Subway Builder API v1.0.0 and writes
 * data/<CODE>/demand_data.json.gz.
 *
 * Algorithm:
 *   1. Read data/<CODE>/buildings_index.json.gz (already generated) to obtain
 *      the city bbox and a per-cell building density.
 *   2. Place a regular grid of demand points across the bbox.
 *   3. Allocate residents proportionally to cell building density.
 *   4. Allocate jobs with an additional centre-weighting (downtown bias).
 *   5. Generate commuter-group pops: pair each residential point with up to
 *      MAX_PAIRS_PER_POINT job points; compute haversine-based approximate
 *      driving distance and time.
 *
 * Output schema (DemandData):
 *   points[]  – { id, location: [lon, lat], jobs, residents, popIds[] }
 *   pops[]    – { id, size, residenceId, jobId, drivingSeconds, drivingDistance }
 *
 * Driving approximation:
 *   drivingDistance = haversine(origin, dest) * DETOUR_FACTOR  (metres)
 *   drivingSeconds  = drivingDistance / SPEED_MS
 *   DETOUR_FACTOR = 1.25  (road network vs. straight line)
 *   SPEED_MS      = 11.11 m/s  (≈ 40 km/h average urban speed)
 *
 * Usage:
 *   node generate_demand_data.mjs --code DND \
 *     [--grid-size 8] [--max-pops 2000] [--pairs-per-point 3]
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { program } from "commander";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

program
  .requiredOption("--code <CODE>", "City code, e.g. DND")
  .option("--grid-size <n>", "Grid divisions per axis (n×n points)", "8")
  .option("--max-pops <n>", "Maximum number of commuter pops", "2000")
  .option("--pairs-per-point <n>", "Max job-point pairings per residential point", "3")
  .parse();

const opts = program.opts();
const code = opts.code;
const GRID_SIZE = Math.max(2, parseInt(opts.gridSize, 10));
const MAX_POPS = parseInt(opts.maxPops, 10);
const PAIRS_PER_POINT = parseInt(opts.pairsPerPoint, 10);

const DETOUR_FACTOR = 1.25;
const SPEED_MS = 11.11; // ~40 km/h

const BUILDINGS_PATH = path.join(REPO_ROOT, "data", code, "buildings_index.json.gz");
const OUTPUT_DIR = path.join(REPO_ROOT, "data", code);
const OUTPUT_PATH = path.join(OUTPUT_DIR, "demand_data.json.gz");

if (!fs.existsSync(BUILDINGS_PATH)) {
  console.error(`[gen:demand] buildings_index not found: ${BUILDINGS_PATH}`);
  console.error(`[gen:demand] Run generate_buildings_index.mjs --code ${code} first.`);
  process.exit(1);
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ── load buildings index ──────────────────────────────────────────────────────

console.log(`[gen:demand] Loading ${BUILDINGS_PATH} …`);
const compressed = fs.readFileSync(BUILDINGS_PATH);
const buildingsIndex = JSON.parse(zlib.gunzipSync(compressed).toString("utf8"));

const [minLon, minLat, maxLon, maxLat] = buildingsIndex.bbox;
const [cols] = buildingsIndex.grid;
const CELL_SIZE = buildingsIndex.cs;
const cells = buildingsIndex.cells; // { cellIdx: [buildingIdx, …] }

// ── helpers ──────────────────────────────────────────────────────────────────

/** Haversine distance in metres between two [lon, lat] points */
function haversine([lon1, lat1], [lon2, lat2]) {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Centre distance weight: closer to city centre → higher value */
function centreWeight(lon, lat) {
  const cLon = (minLon + maxLon) / 2;
  const cLat = (minLat + maxLat) / 2;
  const dist = haversine([lon, lat], [cLon, cLat]);
  const maxDist = haversine([minLon, minLat], [cLon, cLat]);
  return Math.max(0.05, 1 - dist / maxDist);
}

/** Building density count for the cell containing lon/lat */
function cellDensity(lon, lat) {
  const c = Math.floor((lon - minLon) / CELL_SIZE);
  const r = Math.floor((lat - minLat) / CELL_SIZE);
  const idx = (r * cols + c).toString();
  return cells[idx] ? cells[idx].length : 0;
}

// ── generate demand points on regular grid ────────────────────────────────────

console.log(`[gen:demand] Building ${GRID_SIZE}×${GRID_SIZE} grid of demand points …`);

const lonStep = (maxLon - minLon) / (GRID_SIZE - 1 || 1);
const latStep = (maxLat - minLat) / (GRID_SIZE - 1 || 1);

const points = [];
let ptId = 0;

// Gather raw densities first for normalisation
const rawPoints = [];
for (let r = 0; r < GRID_SIZE; r++) {
  for (let c = 0; c < GRID_SIZE; c++) {
    const lon = parseFloat((minLon + c * lonStep).toFixed(6));
    const lat = parseFloat((minLat + r * latStep).toFixed(6));
    const density = cellDensity(lon, lat);
    const cw = centreWeight(lon, lat);
    rawPoints.push({ lon, lat, density, cw });
  }
}

const maxDensity = Math.max(1, ...rawPoints.map((p) => p.density));
const BASE_RESIDENTS = 500;
const BASE_JOBS = 200;

for (const rp of rawPoints) {
  const densityRatio = rp.density / maxDensity;
  const residents = Math.round(BASE_RESIDENTS * densityRatio);
  const jobs = Math.round(BASE_JOBS * densityRatio * rp.cw * 3);

  points.push({
    id: `pt_${ptId++}`,
    location: [rp.lon, rp.lat],
    jobs,
    residents,
    popIds: [],
  });
}

// ── generate commuter pops ────────────────────────────────────────────────────

console.log(`[gen:demand] Generating commuter pops (max ${MAX_POPS}) …`);

// Sort points by residents descending to prefer high-density residences
const resPts = [...points].sort((a, b) => b.residents - a.residents);
// Sort points by jobs descending for job lookup; limit pool to avoid O(n²) pairing
const JOB_POOL_SIZE = GRID_SIZE * 2;
const jobPts = [...points].sort((a, b) => b.jobs - a.jobs).slice(0, JOB_POOL_SIZE);

const pops = [];
let popId = 0;

outer: for (const resPt of resPts) {
  if (resPt.residents === 0) continue;

  // Pick the nearest PAIRS_PER_POINT job points (excluding self)
  const candidates = jobPts
    .filter((jp) => jp.id !== resPt.id && jp.jobs > 0)
    .map((jp) => ({
      pt: jp,
      dist: haversine(resPt.location, jp.location),
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, PAIRS_PER_POINT);

  for (const { pt: jobPt, dist } of candidates) {
    if (pops.length >= MAX_POPS) break outer;

    const drivingDistance = Math.round(dist * DETOUR_FACTOR);
    const drivingSeconds = Math.round(drivingDistance / SPEED_MS);
    const size = Math.max(1, Math.round(resPt.residents / PAIRS_PER_POINT));
    const id = `pop_${popId++}`;

    pops.push({
      id,
      size,
      residenceId: resPt.id,
      jobId: jobPt.id,
      drivingSeconds,
      drivingDistance,
    });

    resPt.popIds.push(id);
  }
}

// ── write output ──────────────────────────────────────────────────────────────

const demandData = { points, pops };

console.log(`[gen:demand] Writing ${OUTPUT_PATH} …`);

const json = JSON.stringify(demandData);
const out = zlib.gzipSync(Buffer.from(json, "utf8"));
fs.writeFileSync(OUTPUT_PATH, out);

const kb = (out.length / 1024).toFixed(1);
console.log(
  `[gen:demand] Done — ${points.length} demand points, ${pops.length} pops, ${kb} KB gzipped.`
);
