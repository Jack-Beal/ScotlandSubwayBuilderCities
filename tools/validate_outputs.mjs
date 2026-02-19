#!/usr/bin/env node
/**
 * validate_outputs.mjs
 *
 * Loads generated data files for a city code and validates their structure
 * against the Subway Builder API v1.0.0 schemas.
 *
 * Validates:
 *   data/<CODE>/buildings_index.json.gz  →  OptimizedBuildingIndex schema
 *   data/<CODE>/demand_data.json.gz      →  DemandData schema
 *
 * Exits with code 0 on success, 1 on validation failure.
 *
 * Usage:
 *   node validate_outputs.mjs --code DND
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
  .parse();

const { code } = program.opts();

const DATA_DIR = path.join(REPO_ROOT, "data", code);
const BUILDINGS_PATH = path.join(DATA_DIR, "buildings_index.json.gz");
const DEMAND_PATH = path.join(DATA_DIR, "demand_data.json.gz");

let errors = 0;

function fail(msg) {
  console.error(`  ✗ ${msg}`);
  errors++;
}

function pass(msg) {
  console.log(`  ✓ ${msg}`);
}

function check(condition, msg) {
  if (condition) {
    pass(msg);
  } else {
    fail(msg);
  }
}

function loadGz(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`File not found: ${filePath}`);
    return null;
  }
  try {
    const buf = fs.readFileSync(filePath);
    const json = zlib.gunzipSync(buf).toString("utf8");
    return JSON.parse(json);
  } catch (e) {
    fail(`Failed to decompress/parse ${filePath}: ${e.message}`);
    return null;
  }
}

// ── Validate buildings_index.json.gz ─────────────────────────────────────────

console.log(`\n[validate] buildings_index.json.gz (${code})`);
const bi = loadGz(BUILDINGS_PATH);

if (bi !== null) {
  check(typeof bi.cs === "number" && bi.cs > 0, "cs is a positive number");
  check(
    Array.isArray(bi.bbox) &&
      bi.bbox.length === 4 &&
      bi.bbox.every((v) => typeof v === "number"),
    "bbox is [minLon, minLat, maxLon, maxLat]"
  );
  check(
    Array.isArray(bi.grid) &&
      bi.grid.length === 2 &&
      bi.grid.every((v) => Number.isInteger(v) && v > 0),
    "grid is [cols, rows] (positive integers)"
  );
  check(typeof bi.cells === "object" && bi.cells !== null && !Array.isArray(bi.cells),
    "cells is a plain object (sparse map)");

  if (bi.cells && typeof bi.cells === "object") {
    const firstKey = Object.keys(bi.cells)[0];
    if (firstKey !== undefined) {
      const sample = bi.cells[firstKey];
      check(
        Array.isArray(sample) && sample.every((v) => Number.isInteger(v)),
        "cells values are arrays of integer building indices"
      );
    }
  }

  check(Array.isArray(bi.buildings) && bi.buildings.length > 0,
    `buildings is a non-empty array (${bi.buildings?.length ?? 0} items)`);

  if (Array.isArray(bi.buildings) && bi.buildings.length > 0) {
    const b = bi.buildings[0];
    check(
      Array.isArray(b.b) && b.b.length === 4 && b.b.every((v) => typeof v === "number"),
      "building[0].b is bbox [minLon,minLat,maxLon,maxLat]"
    );
    check(typeof b.f === "number" && b.f < 0, "building[0].f is a negative number (foundation depth stored as negative metres)");
    check(Array.isArray(b.p) && b.p.length >= 3, "building[0].p is polygon ring (≥3 coords)");
  }

  check(
    bi.stats &&
      typeof bi.stats.count === "number" &&
      typeof bi.stats.maxDepth === "number",
    "stats has { count, maxDepth }"
  );

  if (bi.stats && bi.buildings) {
    check(bi.stats.count === bi.buildings.length,
      `stats.count (${bi.stats.count}) matches buildings.length (${bi.buildings.length})`);
  }
}

// ── Validate demand_data.json.gz ──────────────────────────────────────────────

console.log(`\n[validate] demand_data.json.gz (${code})`);
const dd = loadGz(DEMAND_PATH);

if (dd !== null) {
  check(Array.isArray(dd.points) && dd.points.length > 0,
    `points is a non-empty array (${dd.points?.length ?? 0} items)`);

  if (Array.isArray(dd.points) && dd.points.length > 0) {
    const p = dd.points[0];
    check(typeof p.id === "string" && p.id.length > 0, "points[0].id is a non-empty string");
    check(
      Array.isArray(p.location) && p.location.length === 2 &&
        p.location.every((v) => typeof v === "number"),
      "points[0].location is [lon, lat]"
    );
    check(typeof p.jobs === "number" && p.jobs >= 0, "points[0].jobs ≥ 0");
    check(typeof p.residents === "number" && p.residents >= 0, "points[0].residents ≥ 0");
    check(Array.isArray(p.popIds), "points[0].popIds is an array");
  }

  check(Array.isArray(dd.pops) && dd.pops.length > 0,
    `pops is a non-empty array (${dd.pops?.length ?? 0} items)`);

  if (Array.isArray(dd.pops) && dd.pops.length > 0) {
    const pop = dd.pops[0];
    check(typeof pop.id === "string" && pop.id.length > 0, "pops[0].id is a non-empty string");
    check(typeof pop.size === "number" && pop.size >= 1, "pops[0].size ≥ 1");
    check(typeof pop.residenceId === "string", "pops[0].residenceId is a string");
    check(typeof pop.jobId === "string", "pops[0].jobId is a string");
    check(typeof pop.drivingSeconds === "number" && pop.drivingSeconds >= 0,
      "pops[0].drivingSeconds ≥ 0");
    check(typeof pop.drivingDistance === "number" && pop.drivingDistance >= 0,
      "pops[0].drivingDistance ≥ 0");
  }

  // Cross-reference: every pop's residenceId and jobId should exist in points
  if (Array.isArray(dd.pops) && Array.isArray(dd.points)) {
    const pointIds = new Set(dd.points.map((p) => p.id));
    const badPops = dd.pops.filter(
      (pop) => !pointIds.has(pop.residenceId) || !pointIds.has(pop.jobId)
    );
    check(badPops.length === 0,
      `all pop residenceId/jobId reference valid point ids (${badPops.length} bad)`);

    // Check popIds back-references
    const popIdSet = new Set(dd.pops.map((p) => p.id));
    let badRefs = 0;
    for (const pt of dd.points) {
      for (const pid of pt.popIds) {
        if (!popIdSet.has(pid)) badRefs++;
      }
    }
    check(badRefs === 0,
      `all point.popIds reference valid pop ids (${badRefs} bad references)`);
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────

console.log("");
if (errors === 0) {
  console.log(`[validate] ✅ All checks passed for ${code}.`);
  process.exit(0);
} else {
  console.error(`[validate] ❌ ${errors} check(s) failed for ${code}.`);
  process.exit(1);
}
