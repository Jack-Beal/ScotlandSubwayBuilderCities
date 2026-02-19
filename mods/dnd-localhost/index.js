/**
 * Dundee (DND) Localhost Mod — Subway Builder API v1.0.0
 *
 * Registers the Dundee city and points the game at a local tile/data server.
 * Start the server first:
 *   cd server && npm install && npm start -- --port 8081 --host 127.0.0.1
 */

(function () {
  if (!window.SubwayBuilderAPI) {
    console.warn("[DND Localhost Mod] window.SubwayBuilderAPI not found — mod not loaded");
    return;
  }

  var api = window.SubwayBuilderAPI;
  var LOCAL_SERVER = "http://127.0.0.1:8081";
  var CODE = "DND";

  // Register the city
  api.registerCity({
    code: CODE,
    name: "Dundee",
    description: "Connect the city centre, waterfront, and surrounding commuter belt of Tayside",
    population: 250000,
    initialViewState: {
      longitude: -3.004761,
      latitude: 56.495859,
      zoom: 13.5,
      bearing: 0,
    },
  });

  // Point the map at the local Z/X/Y MVT tile endpoint
  api.map.setTileURLOverride(CODE, {
    tilesUrl: LOCAL_SERVER + "/" + CODE + "/{z}/{x}/{y}.mvt",
    foundationTilesUrl: LOCAL_SERVER + "/" + CODE + "/{z}/{x}/{y}.mvt",
    maxZoom: 15,
  });

  // Point the city data files at the local data server
  api.cities.setCityDataFiles(CODE, {
    buildingsIndex: LOCAL_SERVER + "/data/buildings_index.json.gz",
    demandData: LOCAL_SERVER + "/data/demand_data.json.gz",
    roads: LOCAL_SERVER + "/data/roads.geojson.gz",
    runwaysTaxiways: LOCAL_SERVER + "/data/runways_taxiways.geojson.gz",
  });

  // Disable layers that are not available locally
  api.map.setDefaultLayerVisibility(CODE, {
    oceanFoundations: false,
  });

  // Register a tab so the city appears in the city picker
  api.cities.registerTab({
    id: "dnd-localhost",
    label: "Dundee (local)",
    cityCodes: [CODE],
  });

  console.log("[DND Localhost Mod] Loaded — " + CODE + " pointing at " + LOCAL_SERVER);
})();
