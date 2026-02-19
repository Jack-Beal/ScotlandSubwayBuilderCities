/**
 * Scotland Cities Mod — Subway Builder API v1.0.0
 * Registers Dundee, Edinburgh and Glasgow under a "Scotland" tab.
 *
 * Requires a local tile/data server running at http://localhost:8081
 * Start it with server.bat (Windows) or server.sh (Mac/Linux).
 */

// ─── Defaults ────────────────────────────────────────────────────────────────

const TILES_BASE_URL = "http://localhost:8081";
const TILES_MAX_ZOOM = 15;
const DATA_ROOT = "http://localhost:8081/data";

const DEFAULT_LAYER_VISIBILITY = {
  oceanFoundations: false,
};

const SCOTLAND_TAB = {
  id: "scotland",
  label: "Scotland",
};

// ─── City definitions ─────────────────────────────────────────────────────────

const SCOTLAND_CITIES = [
  {
    code: "DND",
    name: "Dundee",
    description:
      "Connect the city centre, waterfront, and surrounding commuter belt of Tayside",
    population: 250000,
    initialViewState: {
      longitude: -2.97,
      latitude: 56.462,
      zoom: 11,
    },
  },
  {
    code: "EDI",
    name: "Edinburgh",
    description:
      "Connect the historic core, western employment, and Leith waterfront across the commuter belt — including Inverkeithing across the Forth",
    population: 900000,
    initialViewState: {
      longitude: -3.19,
      latitude: 55.953,
      zoom: 11,
    },
  },
  {
    code: "GLA",
    name: "Glasgow",
    description:
      "Connect the city centre, riverside regeneration, and the wider Clydeside commuter belt",
    population: 1100000,
    initialViewState: {
      longitude: -4.25,
      latitude: 55.864,
      zoom: 11,
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildStandardDataFiles(code) {
  return {
    buildingsIndex: `${DATA_ROOT}/${code}/buildings_index.json.gz`,
    demandData: `${DATA_ROOT}/${code}/demand_data.json.gz`,
    roads: `${DATA_ROOT}/${code}/roads.geojson.gz`,
    runwaysTaxiways: `${DATA_ROOT}/${code}/runways_taxiways.geojson.gz`,
  };
}

function buildTileUrls(code) {
  return {
    tilesUrl: `${TILES_BASE_URL}/${code}/{z}/{x}/{y}.mvt`,
    // Carto dark-matter basemap for the map background (same approach as Italian mod)
    foundationTilesUrl:
      "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
  };
}

// ─── Registration ─────────────────────────────────────────────────────────────

function registerConfiguredCity(api, city) {
  const { code, name, description, population, initialViewState } = city;
  const { tilesUrl, foundationTilesUrl } = buildTileUrls(code);
  const dataFiles = buildStandardDataFiles(code);

  console.log(`[ScotlandCities] Registering city: ${name} (${code})`);

  api.registerCity({
    code,
    name,
    description,
    population,
    initialViewState,
  });

  api.map.setTileURLOverride(code, tilesUrl);

  api.cities.setCityDataFiles(code, dataFiles);

  api.map.setDefaultLayerVisibility(code, DEFAULT_LAYER_VISIBILITY);
}

// ─── Entry point ──────────────────────────────────────────────────────────────

export default function (api) {
  console.log("[ScotlandCities] Mod initialising (API v1.0.0)");

  // Layer overrides shared across all Scotland cities
  api.map.setLayerOverride("parks-large", {
    minzoom: 10,
  });

  api.map.setLayerOverride("airports", {
    minzoom: 9,
  });

  // Register each active city
  for (const city of SCOTLAND_CITIES) {
    registerConfiguredCity(api, city);
  }

  // Register the Scotland tab in the city picker
  api.cities.registerTab({
    id: SCOTLAND_TAB.id,
    label: SCOTLAND_TAB.label,
    cityCodes: SCOTLAND_CITIES.map((c) => c.code),
  });

  console.log(
    `[ScotlandCities] Registered ${SCOTLAND_CITIES.length} cities under tab "${SCOTLAND_TAB.label}"`
  );
}
