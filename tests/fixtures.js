const geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 1,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              -0.273284912109375,
              51.60437164681676,
            ],
            [
              -0.30212402343749994,
              51.572802100290254,
            ],
            [
              -0.276031494140625,
              51.57194856482396,
            ],
            [
              -0.267791748046875,
              51.587309751245456,
            ],
            [
              -0.273284912109375,
              51.60437164681676,
            ],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 4,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              -0.25543212890625,
              51.600959780448626,
            ],
            [
              -0.2581787109375,
              51.57621608189101,
            ],
            [
              -0.22247314453125,
              51.6001067737997,
            ],
            [
              -0.24032592773437497,
              51.613752957501,
            ],
            [
              -0.25543212890625,
              51.600959780448626,
            ],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 2,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          0.031585693359375,
          51.4428807236673,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 3,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              0.06866455078125,
              51.59584150020809,
            ],
            [
              0.06866455078125,
              51.61034179610212,
            ],
            [
              0.10162353515625,
              51.61034179610212,
            ],
            [
              0.10162353515625,
              51.59584150020809,
            ],
            [
              0.06866455078125,
              51.59584150020809,
            ],
          ],
        ],
      },
    },
  ],
};

const fixtures = {
  get polygon() {
    return L.polygon([
      [51.509, -0.08],
      [51.503, -0.06],
      [51.51, -0.047],
    ]);
  },

  get longPolygon() {
    return L.polygon([
      [51.503, -0.06],
      [51.509, -0.06],
      [51.509, -0.12],
      [51.503, -0.12],
    ]);
  },

  get marker() {
    return L.marker([51.509, -0.08]);
  },

  get circle() {
    return L.circle([51.505, -0.09], { radius: 100 });
  },

  get geojson() {
    return L.geoJson(geojson);
  },
};

module.exports = fixtures;
