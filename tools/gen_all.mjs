#!/usr/bin/env node
/**
 * gen_all.mjs — runs both generators in sequence, forwarding all CLI args.
 *
 * Usage:
 *   node tools/gen_all.mjs --code DND [--grid-size 8] [--max-pops 2000]
 */

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Forward all arguments (strip the node + script path from argv)
const args = process.argv.slice(2);

function run(script) {
  const result = spawnSync(process.execPath, [path.join(__dirname, script), ...args], {
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("generate_buildings_index.mjs");
run("generate_demand_data.mjs");
