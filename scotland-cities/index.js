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
      id: "scotland",
      label: "Scotland",
      emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    },
  };

  /**
   * CityConfig:
   * - code: string (e.g. "DND")
   * - name: string
   * - description: string
   * - population: number
   * - initialViewState: { zoom, latitude, longitude, bearing }
   * Optional:
   * - tilesBaseUrl: override for the tile server base URL
   * - maxZoom: override max zoom
   * - dataFiles: full path override, if you don't want to use the standard schema
   * - layerVisibility: layer visibility override
   */

  const SCOTLAND_CITIES = [
    {
      name: "Dundee",
      code: "DND",
      description: "Build fast, reliable transit across Dundee — from the Waterfront and city centre to outer neighbourhoods like Lochee and Broughty Ferry.",
      population: 148000,
      initialViewState: {
        zoom: 12.2,
        latitude: 56.4620,
        longitude: -2.9707,
        bearing: 0,
      },
    },
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

    console.log(`[ScotlandCities] ${city.name} registered`);
  }

  for (const city of SCOTLAND_CITIES) {
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
    cityCodes: SCOTLAND_CITIES.map((c) => c.code),
  });
})();
