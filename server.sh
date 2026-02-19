#!/usr/bin/env sh
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "[ScotlandCities] Installing server dependencies..."
cd "$SCRIPT_DIR/server"
npm install
echo "[ScotlandCities] Starting server on http://localhost:8081 ..."
node server.mjs "$@"
