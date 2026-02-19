# Dundee (DND) Localhost Mod

A Subway Builder mod that registers the **Dundee (DND)** city and points the
game at a locally-running tile/data server (`http://127.0.0.1:8081`).

---

## Prerequisites

- [Subway Builder](https://store.steampowered.com/app/1499710/Subway_Builder/) installed.
- [Node.js](https://nodejs.org/) ≥ 18 installed.
- The tile and data files for DND placed under `server/tiles/DND.pmtiles` and
  `data/DND/` respectively (see the repo root [README](../../README.md) for how
  to obtain them).

---

## 1. Start the local server

### macOS — one-click launcher (recommended)

Double-click `launcher/Start DND.command` from the repository root in Finder.

> If macOS shows a security warning, right-click → **Open** → **Open** the first
> time to grant permission.

The Terminal window will install dependencies automatically, start the server,
and display further instructions.

### Windows

Double-click `server.bat` at the repo root.

### Mac / Linux (terminal)

```bash
./server.sh
```

Verify the server is up:

```
GET http://127.0.0.1:8081/health              → 200 OK
GET http://127.0.0.1:8081/DND/15/…           → MVT tile
GET http://127.0.0.1:8081/data/DND/…         → compressed data file (full path)
GET http://127.0.0.1:8081/data/buildings_index.json.gz → same file (alias)
```

---

## 2. Copy the mod into the game's mods directory

1. In the game, open **Settings → System → Open Saves Folder**.
2. Navigate **up one level** from the saves folder; you should see a `mods/`
   folder (create it if it does not exist).
3. Copy the entire `mods/dnd-localhost/` folder from this repository into that
   game `mods/` directory.

The result should look like:

```
<game mods directory>/
  dnd-localhost/
    manifest.json
    index.js
```

---

## 3. Enable the mod in the game

1. Launch Subway Builder.
2. Open **Settings → Mods**.
3. Find **Dundee (DND) Localhost** and toggle it **on**.
4. Restart the game when prompted.
5. A **"Dundee (local)"** tab should now appear in the city picker.

---

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Mod metadata (id, name, version, author) |
| `index.js` | IIFE that registers the DND city and wires up localhost URLs |
