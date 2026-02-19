#!/usr/bin/env bash
# macOS double-click launcher for the Dundee (DND) local server.
# Place this file anywhere inside the repository; it resolves the repo root
# relative to its own location.

set -e

# ── Resolve repo root ─────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "============================================================"
echo "  Subway Builder — Dundee (DND) Local Server"
echo "============================================================"
echo ""
echo "  Repo root : $REPO_ROOT"
echo ""

# ── Dependency check ──────────────────────────────────────────────────────────
if ! command -v node >/dev/null 2>&1; then
  echo "  ERROR: Node.js is not installed."
  echo ""
  echo "  Please install Node.js 18 or later from https://nodejs.org/"
  echo "  then double-click this launcher again."
  echo ""
  read -rp "Press Enter to close..."
  exit 1
fi

NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "  WARNING: Node.js $NODE_MAJOR detected; v18+ is recommended."
  echo "  Some features may not work correctly."
  echo ""
fi

# ── Install server dependencies ───────────────────────────────────────────────
echo "  Installing / verifying server dependencies..."
cd "$REPO_ROOT/server"
npm install --prefer-offline --silent
echo "  Dependencies OK."
echo ""

# ── Start server ──────────────────────────────────────────────────────────────
echo "------------------------------------------------------------"
echo "  Server starting on http://127.0.0.1:8081"
echo "------------------------------------------------------------"
echo ""
echo "  Next steps:"
echo "    1. Launch Subway Builder."
echo "    2. Open Settings → Mods."
echo "    3. Enable the 'Dundee (DND) Localhost' mod."
echo "    4. Restart the game when prompted."
echo "    5. A 'Dundee (local)' tab will appear in the city picker."
echo ""
echo "  Keep this window open while you play."
echo "  Press Ctrl-C to stop the server."
echo ""

node server.mjs --port 8081 --host 127.0.0.1

# ── Keep window open if server exits unexpectedly ─────────────────────────────
echo ""
echo "  Server stopped."
read -rp "Press Enter to close..."
