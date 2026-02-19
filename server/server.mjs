/**
 * Scotland Cities — local tile and data server
 *
 * Serves on http://localhost:8081
 *
 *   /data/**           → ../data/  (processed city data files)
 *   /<file>.pmtiles    → tiles/<file>.pmtiles  (raw PMTiles archives)
 *
 * PMTiles are served as raw binary so the game can fetch individual tiles
 * via HTTP range requests (the PMTiles spec requires range support).
 *
 * Usage:
 *   cd server && npm install && npm start
 * Or use the provided server.bat / server.sh scripts from the repo root.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8081;

// Directories to serve
const DATA_DIR = path.resolve(__dirname, "..", "data");
const TILES_DIR = path.resolve(__dirname, "tiles");

function mimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".pmtiles": "application/octet-stream",
    ".gz": "application/octet-stream",
    ".json": "application/json",
    ".geojson": "application/geo+json",
    ".mvt": "application/vnd.mapbox-vector-tile",
    ".html": "text/html",
  };
  return map[ext] || "application/octet-stream";
}

function serveFile(filePath, req, res) {
  fs.stat(filePath, (err, stat) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }

    const totalSize = stat.size;
    const rangeHeader = req.headers["range"];

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Range",
      "Content-Type": mimeType(filePath),
      "Accept-Ranges": "bytes",
    };

    if (rangeHeader) {
      const [, rangeValue] = rangeHeader.split("=");
      const [startStr, endStr] = rangeValue.split("-");
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : totalSize - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        ...headers,
        "Content-Range": `bytes ${start}-${end}/${totalSize}`,
        "Content-Length": chunkSize,
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        ...headers,
        "Content-Length": totalSize,
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Range",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    });
    res.end();
    return;
  }

  const urlPath = decodeURIComponent(req.url.split("?")[0]);

  // Prevent path traversal
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");

  if (safePath.startsWith("/data/")) {
    const relative = safePath.slice("/data/".length);
    const filePath = path.join(DATA_DIR, relative);
    // Ensure the resolved path stays inside DATA_DIR
    if (!filePath.startsWith(DATA_DIR + path.sep) && filePath !== DATA_DIR) {
      res.writeHead(403, { "Content-Type": "text/plain" });
      res.end("Forbidden");
      return;
    }
    serveFile(filePath, req, res);
    return;
  }

  // Serve PMTiles from tiles/
  if (safePath.endsWith(".pmtiles")) {
    const filename = path.basename(safePath);
    const filePath = path.join(TILES_DIR, filename);
    if (!filePath.startsWith(TILES_DIR + path.sep)) {
      res.writeHead(403, { "Content-Type": "text/plain" });
      res.end("Forbidden");
      return;
    }
    serveFile(filePath, req, res);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[ScotlandCities] Server listening on http://localhost:${PORT}`);
  console.log(`[ScotlandCities]   data  → ${DATA_DIR}`);
  console.log(`[ScotlandCities]   tiles → ${TILES_DIR}`);
});
