/**
 * Mod for Subway Builder — minimal DND (Dundee) local test snippet.
 *
 * Paste this into your mod's index.js (or use it as a standalone mod file)
 * while the local server is running at http://127.0.0.1:8081.
 *
 * Start the server:
 *   npm run serve           (from repo root)
 *   ./server.sh             (Mac/Linux)
 *   server.bat              (Windows)
 */

const LOCAL_SERVER = "http://127.0.0.1:8081";
const CODE = "DND";

export default function (api) {
  // Register the city
  api.registerCity({
    code: CODE,
    name: "Dundee",
    description:
      "Connect the city centre, waterfront, and surrounding commuter belt of Tayside",
    population: 250000,
    initialViewState: {
      longitude: -2.97,
      latitude: 56.462,
      zoom: 11,
    },
  });

  // Point the map at the local Z/X/Y MVT tile endpoint
  api.map.setTileURLOverride(CODE, `${LOCAL_SERVER}/${CODE}/{z}/{x}/{y}.mvt`);

  // Point the city data files at the local data server
  api.cities.setCityDataFiles(CODE, {
    buildingsIndex: `${LOCAL_SERVER}/data/${CODE}/buildings_index.json.gz`,
    demandData: `${LOCAL_SERVER}/data/${CODE}/demand_data.json.gz`,
    roads: `${LOCAL_SERVER}/data/${CODE}/roads.geojson.gz`,
    runwaysTaxiways: `${LOCAL_SERVER}/data/${CODE}/runways_taxiways.geojson.gz`,
  });

  // Register a tab so the city appears in the city picker
  api.cities.registerTab({
    id: "scotland-local",
    label: "Scotland (local)",
    cityCodes: [CODE],
  });

  console.log(`[DND local mod] Registered ${CODE} pointing at ${LOCAL_SERVER}`);
}
