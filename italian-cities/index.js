(function () {
  const api = window.SubwayBuilderAPI;

  const DEFAULTS = {
    tiles: {
      baseUrl: "http://localhost:8081",
      maxZoom: 15,
    },
    dataRoot: "/data",
    defaultLayerVisibility: {
      oceanFoundations: false,
    },
    tab: {
      id: "italy",
      label: "Italy",
      emoji: "🇮🇹",
    },
  };

  /**
   * CityConfig:
   * - code: string (es. "BOL")
   * - name: string
   * - description: string
   * - population: number
   * - initialViewState: { zoom, latitude, longitude, bearing }
   * Opzionali:
   * - tilesBaseUrl: override per la base URL dei tile server
   * - maxZoom: override max zoom
   * - dataFiles: override completo dei path, se vuoi non usare lo schema standard
   * - layerVisibility: override visibilità layer
   */

  const ITALY_CITIES = [
    {
      name: "Bari",
      code: "BAR",
      description: "Bridge Adriatic port life and southern resilience with sun-drenched coastal transit",
      population: 510000,
      initialViewState: {
        zoom: 13,
        latitude: 41.1171,
        longitude: 16.8719,
        bearing: 0,
      },
    },
    {
      name: "Bologna",
      code: "BOL",
      description: "Thread medieval arcades and Italy’s rail crossroads with precision transit engineering",
      population: 605200,
      initialViewState: {
        zoom: 13.5,
        latitude: 44.4949,
        longitude: 11.3426,
        bearing: 0,
      },
    },
    {
      name: "Cagliari",
      code: "CAG",
      description: "Weave transit through Sardinia’s coastal capital, balancing island charm with modern mobility",
      population: 440000,
      initialViewState: {
        zoom: 13,
        latitude: 39.2238,
        longitude: 9.1217,
        bearing: 0,
      },
    },
    {
      name: "Catania",
      code: "CAT",
      description: "Harness volcanic energy to connect dense neighborhoods beneath Mount Etna",
      population: 718100,
      initialViewState: {
        zoom: 13,
        latitude: 37.5027, 
        longitude: 15.0872,
        bearing: 0,
      },
    },
    {
      name: "Firenze",
      code: "FIR",
      description: "Protect Renaissance beauty while moving crowds beneath a living open-air museum",
      population: 642500,
      initialViewState: {
        zoom: 13.5,
        latitude: 43.7696,
        longitude: 11.2558,
        bearing: 0,
      },
    },
    {
      name: "Genova",
      code: "GEN",
      description: "Carve vertical transit through Italy’s steep maritime labyrinth",
      population: 580000,
      initialViewState: {
        zoom: 13,
        latitude: 44.4056,
        longitude: 8.9463,
        bearing: 0,
      },
    },
    {
      name: "Milano",
      code: "MIL",
      description: "Drive high-capacity transit through Italy’s financial engine and fashion capital",
      population: 1952500,
      initialViewState: {
        zoom: 12.5,
        latitude: 45.4642,
        longitude: 9.1900,
        bearing: 0,
      },
    },
    {
      name: "Modena",
      code: "MOD",
      description: "Drive transit innovation through Italy’s motor city, blending speed with historic streets",
      population: 553000,
      initialViewState: {
        zoom: 13,
        latitude: 44.6471,
        longitude: 10.9252,
        bearing: 0,
      },
    },
    {
      name: "Napoli",
      code: "NAP",
      description: "Harness volcanic energy to connect dense neighborhoods beneath Vesuvius",
      population: 967000,
      initialViewState: {
        zoom: 13,
        latitude: 40.8518,
        longitude: 14.2681,
        bearing: 0,
      },
    },
    {
      name: "Padova",
      code: "PAD",
      description: "Connect university life and historic squares with efficient transit in Padua",
      population: 440000,
      initialViewState: {
        zoom: 13,
        latitude: 45.4064,
        longitude: 11.8767,
        bearing: 0,
      },
    },
    {
      name: "Palermo",
      code: "PAL",
      description: "Stitch together Arab-Norman heritage and sprawling Sicilian districts with modern rails",
      population: 704000,
      initialViewState: {
        zoom: 13,
        latitude: 38.1188,
        longitude: 13.3629,
        bearing: 0,
      },
    },
    {
      name: "Roma",
      code: "ROM",
      description: "Layer cutting-edge transit beneath millennia of history in the Eternal City",
      population: 2837500,
      initialViewState: {
        zoom: 12.5,
        latitude: 41.9028,
        longitude: 12.4964,
        bearing: 0,
      },
    },
    
    {
      name: "Torino",
      code: "TOR",
      description: "Power elegant boulevards and industrial legacy with disciplined northern transit",
      population: 1208200,
      initialViewState: {
        zoom: 13,
        latitude: 45.0703,
        longitude: 7.6869,
        bearing: 0,
      },
    },
    {
      name: "Venezia",
      code: "VEN",
      description: "Reinvent mobility across canals and lagoon islands where roads cannot exist",
      population: 550000,
      initialViewState: {
        zoom: 13,
        latitude: 45.4408,
        longitude: 12.3155,
        bearing: 0,
      },
    },
    {
      name: "Verona",
      code: "VER",
      description: "Link Roman grandeur and operatic charm with transit fit for a timeless crossroads",
      population: 530000,
      initialViewState: {
        zoom: 13,
        latitude: 45.4384,
        longitude: 10.9916,
        bearing: 0,
      },
    },
    /*
    
    */ 
  ];

  function buildStandardDataFiles(cityCode) {
    const root = `${DEFAULTS.dataRoot}/${cityCode}`;
    return {
      buildingsIndex: `${root}/buildings_index.json.gz`,
      demandData: `${root}/demand_data.json.gz`,
      roads: `${root}/roads.geojson.gz`,
      runwaysTaxiways: `${root}/runways_taxiways.geojson.gz`,
    };
  }

  function buildTileUrls(cityCode, tilesBaseUrl) {
    const base = tilesBaseUrl ?? DEFAULTS.tiles.baseUrl;
    const tilesUrl = `${base}/${cityCode}/{z}/{x}/{y}.mvt`;
    const foundationTilesUrl = "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png";
    return { tilesUrl, foundationTilesUrl };
  }

  function registerConfiguredCity(city) {
    const { code } = city;

    api.registerCity({
      name: city.name,
      code,
      description: city.description,
      population: city.population,
      initialViewState: city.initialViewState,
      // mapImageUrl: `${DEFAULTS.tiles.baseUrl}/${code}/thumbnail.svg`,
    });

    const tileUrls = buildTileUrls(code, city.tilesBaseUrl);
    api.map.setTileURLOverride({
      cityCode: code,
      maxZoom: city.maxZoom ?? DEFAULTS.tiles.maxZoom,
      ...tileUrls,
    });

    api.cities.setCityDataFiles(code, city.dataFiles ?? buildStandardDataFiles(code));

    api.map.setDefaultLayerVisibility(code, city.layerVisibility ?? DEFAULTS.defaultLayerVisibility);

    console.log(`[MoreItalyCities] ${city.name} registered`);
  }

  for (const city of ITALY_CITIES) {
    registerConfiguredCity(city);
  }

  api.map.setLayerOverride({
    layerId: "parks-large",
    sourceLayer: "landuse",
    filter: ["==", ["get", "kind"], "park"],
  });

  api.map.setLayerOverride({
    layerId: 'airports',
    sourceLayer: 'landuse',
    filter: ['==', ['get', 'kind'], 'aerodrome']
  });

  api.map.setLayerOverride({
    layerId: 'water',
    paint: {
      'fill-extrusion-height': 0.1
    }
  });

  api.cities.registerTab({
    id: DEFAULTS.tab.id,
    label: DEFAULTS.tab.label,
    cityCodes: ITALY_CITIES.map((c) => c.code),
  });
})();
