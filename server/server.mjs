/**
 * Scotland Cities — local tile and data server
 *
 * Serves on http://localhost:8081 (configurable via --port / --host)
 *
 *   GET /health                   → JSON health check
 *   GET /data/**                  → ../data/  (processed city data files)
 *   GET /server/tiles/<file>      → tiles/<file>  (raw PMTiles archives, range-request capable)
 *   GET /<CODE>/<z>/<x>/<y>.mvt   → individual MVT tile from server/tiles/<CODE>.pmtiles
 *   GET /<file>.pmtiles           → tiles/<file>.pmtiles  (raw PMTiles archive)
 *
 * Usage:
 *   cd server && npm install && npm start [-- --port 8081 --host 127.0.0.1]
 * Or from repo root:
 *   npm run serve [-- --port 8081 --host 127.0.0.1]
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PMTiles } from "pmtiles";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── CLI args ─────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  let port = 8081;
  let host = "127.0.0.1";
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--port" && argv[i + 1]) port = parseInt(argv[i + 1], 10);
    if (argv[i] === "--host" && argv[i + 1]) host = argv[i + 1];
  }
  return { port, host };
}

const { port: PORT, host: HOST } = parseArgs(process.argv.slice(2));

// ─── Directories ──────────────────────────────────────────────────────────────

const DATA_DIR = path.resolve(__dirname, "..", "data");
const TILES_DIR = path.resolve(__dirname, "tiles");

// City code used as fallback when the game requests /data/<filename> directly
// (without a city subfolder).  Change this to switch the default city.
const DEFAULT_CITY_CODE = "DND";

// ─── Node.js file source for PMTiles ─────────────────────────────────────────

/**
 * Implements the PMTiles Source interface for local Node.js file access.
 * The pmtiles npm package's built-in FileSource uses the browser File API;
 * this class uses Node's fs module instead.
 */
class NodeFileSource {
  constructor(filePath) {
    this._path = filePath;
  }

  getKey() {
    return this._path;
  }

  async getBytes(offset, length) {
    const fh = await fs.promises.open(this._path, "r");
    try {
      const buffer = Buffer.alloc(length);
      const { bytesRead } = await fh.read(buffer, 0, length, offset);
      // Return only the bytes that were actually read (handles end-of-file)
      const ab = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + bytesRead);
      return { data: ab };
    } finally {
      await fh.close();
    }
  }
}


// ─── PMTiles cache ────────────────────────────────────────────────────────────

/** @type {Map<string, PMTiles>} */
const pmtilesCache = new Map();

function getPMTiles(code) {
  const key = code.toUpperCase();
  if (!pmtilesCache.has(key)) {
    const filePath = path.join(TILES_DIR, `${key}.pmtiles`);
    pmtilesCache.set(key, new PMTiles(new NodeFileSource(filePath)));
  }
  return pmtilesCache.get(key);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Range",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
};

function mimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".pmtiles": "application/octet-stream",
    ".gz": "application/octet-stream",
    ".json": "application/json",
    ".geojson": "application/geo+json",
    ".mvt": "application/x-protobuf",
    ".html": "text/html",
  };
  return map[ext] || "application/octet-stream";
}

function send404(res, url) {
  console.warn(`[ScotlandCities] 404 Not Found: ${url}`);
  res.writeHead(404, { "Content-Type": "text/plain", ...CORS_HEADERS });
  res.end("Not found");
}

function serveFile(filePath, req, res) {
  fs.stat(filePath, (err, stat) => {
    if (err) {
      send404(res, filePath);
      return;
    }

    const totalSize = stat.size;
    const rangeHeader = req.headers["range"];

    const headers = {
      ...CORS_HEADERS,
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
      res.writeHead(200, { ...headers, "Content-Length": totalSize });
      fs.createReadStream(filePath).pipe(res);
    }
  });
}

// ─── Server ───────────────────────────────────────────────────────────────────

// Matches /<CODE>/<z>/<x>/<y>.mvt  e.g. /DND/12/2047/1365.mvt
const MVT_RE = /^\/([A-Za-z]{2,4})\/(\d+)\/(\d+)\/(\d+)\.mvt$/;

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  const urlPath = decodeURIComponent(req.url.split("?")[0]);

  // Normalise the URL path (URLs always use forward slashes) and reject
  // any path that still contains '..' after normalisation.
  const safePath = path.posix.normalize(urlPath);
  if (safePath.split("/").some((seg) => seg === "..")) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
    return;
  }

  // ── Health check ────────────────────────────────────────────────────────────
  if (safePath === "/health") {
    res.writeHead(200, { "Content-Type": "application/json", ...CORS_HEADERS });
    res.end(JSON.stringify({ status: "ok", server: "ScotlandCities", port: PORT }));
    return;
  }

  // ── Static data files (/data/**) ────────────────────────────────────────────
  if (safePath.startsWith("/data/")) {
    const relative = safePath.slice("/data/".length);
    const filePath = path.join(DATA_DIR, relative);
    if (!filePath.startsWith(DATA_DIR + path.sep)) {
      res.writeHead(403, { "Content-Type": "text/plain" });
      res.end("Forbidden");
      return;
    }
    // If the resolved path doesn't exist and the relative portion is a bare
    // filename (no sub-directory), try the default city folder as a fallback.
    // This lets the game request /data/buildings_index.json.gz and still find
    // data/DND/buildings_index.json.gz without duplicating files.
    if (path.basename(relative) === relative && !fs.existsSync(filePath)) {
      const fallback = path.join(DATA_DIR, DEFAULT_CITY_CODE, relative);
      if (fallback.startsWith(DATA_DIR + path.sep) && fs.existsSync(fallback)) {
        serveFile(fallback, req, res);
        return;
      }
    }
    serveFile(filePath, req, res);
    return;
  }

  // ── Static PMTiles archives (/server/tiles/<file>) ───────────────────────────
  if (safePath.startsWith("/server/tiles/")) {
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

  // ── Z/X/Y MVT tile endpoint (/<CODE>/<z>/<x>/<y>.mvt) ───────────────────────
  const mvtMatch = MVT_RE.exec(safePath);
  if (mvtMatch) {
    const [, code, zStr, xStr, yStr] = mvtMatch;
    const [z, x, y] = [zStr, xStr, yStr].map(Number);

    try {
      const pm = getPMTiles(code);
      const tile = await pm.getZxy(z, x, y);

      if (!tile || !tile.data) {
        send404(res, safePath);
        return;
      }

      const tileHeaders = {
        ...CORS_HEADERS,
        "Content-Type": "application/x-protobuf",
        "Content-Length": tile.data.byteLength,
      };

      res.writeHead(200, tileHeaders);
      res.end(Buffer.from(tile.data));
    } catch (err) {
      console.error(`[ScotlandCities] Error serving tile ${safePath}:`, err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal server error");
    }
    return;
  }

  // ── Raw PMTiles archive (/<file>.pmtiles) ────────────────────────────────────
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

  send404(res, safePath);
});

server.listen(PORT, HOST, () => {
  console.log(`[ScotlandCities] Server listening on http://${HOST}:${PORT}`);
  console.log(`[ScotlandCities]   data      → ${DATA_DIR}`);
  console.log(`[ScotlandCities]   tiles     → ${TILES_DIR}`);
  console.log(`[ScotlandCities]   health    → http://${HOST}:${PORT}/health`);
  console.log(`[ScotlandCities]   MVT tiles → http://${HOST}:${PORT}/<CODE>/{z}/{x}/{y}.mvt`);
});
