'use strict';

describe('Leaflet.Deflate', function () {
  let map;
  let l;

  beforeEach(function () {
    map = L.map('map').setView([51.505, -0.09], 10);
  });

  afterEach(function () {
    map.remove();
  });

  describe('FeatureLayer', function () {
    let polygon;
    beforeEach(function () {
      l = L.deflate({ minSize: 20 });

      polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
      ]);
    });

    it('adds all features', function () {
      l.addTo(map);
      polygon.addTo(l);
      map.setZoom(13, { animate: false });
      map.hasLayer(polygon).should.equal(true);
    });

    it('adds all features when the layer is added', function () {
      polygon.addTo(l);
      l.addTo(map);
      map.setZoom(13, { animate: false });
      map.hasLayer(polygon).should.equal(true);
    });

    it('removes all features from the map', function () {
      polygon.addTo(l);
      l.addTo(map);
      map.setZoom(13, { animate: false });
      map.removeLayer(l);
      map.hasLayer(polygon).should.equal(false);
    });

    it('adds additional features when the layer is re-added', function () {
      const otherPolygon = L.polygon([
        [52.509, -1.08],
        [52.503, -1.06],
        [52.51, -1.047],
      ]);

      l.addTo(map);
      polygon.addTo(l);
      map.setZoom(13, { animate: false });
      map.hasLayer(polygon).should.equal(true);

      map.removeLayer(l);
      map.hasLayer(polygon).should.equal(false);

      otherPolygon.addTo(l);
      l.addTo(map);
      map.hasLayer(polygon).should.equal(true);
      map.hasLayer(otherPolygon).should.equal(true);
    });
  });

  describe('Polygon', function () {
    let polygon;
    beforeEach(function () {
      l = L.deflate({ minSize: 20 }).addTo(map);

      polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
      ]).addTo(l);
    });

    it('should be on map', function () {
      map.setZoom(13, { animate: false });
      map.hasLayer(polygon).should.equal(true);
    });

    it('should not be on map', function () {
      map.setZoom(10, { animate: false });
      map.hasLayer(polygon).should.equal(false);
    });

    it('should not be on map when outside bbox', function () {
      map.panTo([0, 0]);
      map.setZoom(13, { animate: false });
      map.hasLayer(polygon).should.equal(false);
    });

    it('should on map when dragged inside bbox', function () {
      map.panTo([0, 0], { animate: false });
      map.setZoom(13, { animate: false });
      map.panTo([51.505, -0.09], { animate: false });
      map.hasLayer(polygon).should.equal(true);
    });

    it('should remove marker', function () {
      map.setZoom(10, { animate: false });
      l.removeLayer(polygon);
      map.hasLayer(polygon).should.equal(false);
      map.hasLayer(polygon.marker).should.equal(false);
    });

    it('should remove polygon', function () {
      map.setZoom(13, { animate: false });
      l.removeLayer(polygon);
      map.hasLayer(polygon).should.equal(false);
      map.hasLayer(polygon.marker).should.equal(false);
    });
  });

  describe('Circle', function () {
    let circle;
    beforeEach(function () {
      l = L.deflate({ minSize: 20 }).addTo(map);

      circle = L.circle([51.505, -0.09], { radius: 100 }).addTo(l);
    });

    it('should be on map', function () {
      map.setZoom(14, { animate: false });
      map.hasLayer(circle).should.equal(true);
    });

    it('should not be on map', function () {
      map.setZoom(10, { animate: false });
      map.hasLayer(circle).should.equal(false);
    });

    it('should not be on map when outside bbox', function () {
      map.panTo([0, 0]);
      map.setZoom(13, { animate: false });
      map.hasLayer(circle).should.equal(false);
    });

    it('should be on map when dragged inside bbox', function () {
      map.panTo([0, 0], { animate: false });
      map.setZoom(14, { animate: false });
      map.panTo([51.505, -0.09], { animate: false });
      map.hasLayer(circle).should.equal(true);
    });

    it('should remove marker', function () {
      map.setZoom(10, { animate: false });
      l.removeLayer(circle);
      map.hasLayer(circle).should.equal(false);
      map.hasLayer(circle.marker).should.equal(false);
    });

    it('should remove circle', function () {
      map.setZoom(13, { animate: false });
      l.removeLayer(circle);
      map.hasLayer(circle).should.equal(false);
      map.hasLayer(circle.marker).should.equal(false);
    });
  });

  describe('clearLayers', function () {
    beforeEach(function () {
      l = L.deflate({ minSize: 20 }).addTo(map);
    });

    it('should remove polygon', function () {
      const polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
      ]).addTo(l);

      map.setZoom(13, { animate: false });
      l.clearLayers();

      map.hasLayer(polygon).should.equal(false);
      map.hasLayer(polygon.marker).should.equal(false);
    });

    it('should remove polygon marker', function () {
      const polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
      ]).addTo(l);

      map.setZoom(8, { animate: false });
      l.clearLayers();

      map.hasLayer(polygon).should.equal(false);
      map.hasLayer(polygon.marker).should.equal(false);
    });

    it('should remove point', function () {
      const marker = L.marker([51.509, -0.08]).addTo(l);

      map.setZoom(13, { animate: false });
      l.clearLayers();
      map.hasLayer(marker).should.equal(false);
    });
  });

  describe('removeLayer', function () {
    beforeEach(function () {
      l = L.deflate({ minSize: 20 }).addTo(map);
    });

    it('should remove polygon', function () {
      const polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
      ]).addTo(l);

      map.setZoom(13, { animate: false });
      map.removeLayer(l);

      map.hasLayer(polygon).should.equal(false);
      map.hasLayer(polygon.marker).should.equal(false);
    });

    it('should remove polygon marker', function () {
      const polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
      ]).addTo(l);

      map.setZoom(10, { animate: false });
      map.removeLayer(l);

      map.hasLayer(polygon).should.equal(false);
      map.hasLayer(polygon.marker).should.equal(false);
    });

    it('should remove point', function () {
      const marker = L.marker([51.509, -0.08]).addTo(l);

      map.setZoom(13, { animate: false });
      map.removeLayer(l);

      map.hasLayer(marker).should.equal(false);
    });
  });

  describe('GeoJSON', function () {
    let json;
    beforeEach(function () {
      json = {
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

      l = L.deflate({ minSize: 20 }).addTo(map);
      L.geoJson(json).addTo(l);
    });

    it('zoom == 10: 2 polygons should be on the map', function () {
      let count = 0;
      map.setZoom(10, { animate: false });
      map.eachLayer(function (layer) {
        if (layer.zoomThreshold && layer.getBounds) { count += 1; }
      });
      count.should.equal(2);
    });

    it('zoom == 11: 3 polygons should be on the map', function () {
      let count = 0;
      map.setZoom(11, { animate: false });
      map.eachLayer(function (layer) {
        if (layer.zoomThreshold && layer.getBounds) { count += 1; }
      });
      count.should.equal(3);
    });

    it('passed feature properties to marker', function () {
      const layer = l.getLayers()[0];
      layer.marker.feature.geometry.should.deepEqual(layer.marker.toGeoJSON().geometry);
      layer.marker.feature.properties.should.deepEqual(layer.feature.properties);
    });
  });

  describe('Events', function () {
    const json = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {
          id: 1,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-0.273284912109375, 51.60437164681676],
              [-0.30212402343749994, 51.572802100290254],
              [-0.276031494140625, 51.57194856482396],
              [-0.267791748046875, 51.587309751245456],
              [-0.273284912109375, 51.60437164681676],
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
              [-0.25543212890625, 51.600959780448626],
              [-0.2581787109375, 51.57621608189101],
              [-0.22247314453125, 51.6001067737997],
              [-0.24032592773437497, 51.613752957501],
              [-0.25543212890625, 51.600959780448626],
            ],
          ],
        },
      }],
    };

    it('passes event listeners to marker', function () {
      const callback = function () {};
      const polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
      ]);

      l = L.deflate({ minSize: 20 }).addTo(map);
      polygon.on('click', callback);
      polygon.addTo(l);

      polygon.marker._events.should.have.property('click');
      polygon.marker._events.click[0].fn.should.equal(callback);
    });

    it('passes popup to marker', function () {
      const polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
      ]);
      l = L.deflate({ minSize: 20 }).addTo(map);
      polygon.bindPopup('Click');
      polygon.addTo(l);

      polygon.marker._popupHandlersAdded.should.equal(true);
      polygon.marker._popup._content.should.equal('Click');
    });

    it('passes popup options to marker', function () {
      const polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
      ]);
      l = L.deflate({ minSize: 20 }).addTo(map);
      polygon.bindPopup('Click', { closeButton: false });
      polygon.addTo(l);

      polygon.marker._popupHandlersAdded.should.equal(true);
      polygon.marker._popup._content.should.equal('Click');
      polygon.marker._popup.options.closeButton.should.equal(false);
    });

    it('passes tooltip to marker', function () {
      const polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
      ]);

      l = L.deflate({ minSize: 20 }).addTo(map);
      polygon.bindTooltip('Click');
      polygon.addTo(l);

      polygon.marker._tooltipHandlersAdded.should.equal(true);
      polygon.marker._tooltip._content.should.equal('Click');
    });

    it('passes tooltip options to marker', function () {
      const polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
      ]);

      l = L.deflate({ minSize: 20 }).addTo(map);
      polygon.bindTooltip('Click', { direction: 'bottom' });
      polygon.addTo(l);

      polygon.marker._tooltipHandlersAdded.should.equal(true);
      polygon.marker._tooltip._content.should.equal('Click');
      polygon.marker._tooltip.options.direction.should.equal('bottom');
    });

    it('passes events from GeoJSON to marker', function () {
      const callback = function () {};
      l = L.deflate({ minSize: 20 }).addTo(map);
      L.geoJson(json).on('click', callback).addTo(l);

      map.eachLayer(function (layer) {
        if (layer.marker) {
          layer.marker._events.should.have.property('click');
          layer.marker._events.click[0].fn.should.equal(callback);
        }
      });
    });

    it('passes popup from GeoJSON to marker', function () {
      l = L.deflate({ minSize: 20 }).addTo(map);

      L.geoJson(json).bindPopup('Click').addTo(l);

      map.eachLayer(function (layer) {
        if (layer.marker) {
          layer._popupHandlersAdded.should.equal(true);
          layer._popup._content.should.equal('Click');
          layer.marker._popupHandlersAdded.should.equal(true);
          layer.marker._popup._content.should.equal('Click');
        }
      });
    });

    it('passes tooltip from GeoJSON to marker', function () {
      l = L.deflate({ minSize: 20 }).addTo(map);

      L.geoJson(json).bindTooltip('Click').addTo(l);

      map.eachLayer(function (layer) {
        if (layer.marker) {
          layer._tooltipHandlersAdded.should.equal(true);
          layer._tooltip._content.should.equal('Click');
          layer.marker._tooltipHandlersAdded.should.equal(true);
          layer.marker._tooltip._content.should.equal('Click');
        }
      });
    });
  });

  describe('Marker', function () {
    const iconPath = '../example/img/marker.png';

    it('should allow L.marker as markerType', function () {
      l = L.deflate({
        minSize: 20,
        markerType: L.marker,
      }).addTo(map);

      const polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
      ]);
      should.doesNotThrow(() => { polygon.addTo(l); });
    });

    it('should allow L.circleMarker as markerType', function () {
      l = L.deflate({
        minSize: 20,
        markerType: L.circleMarker,
      }).addTo(map);

      const polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
      ]);
      should.doesNotThrow(() => { polygon.addTo(l); });
    });

    it('should not allow L.polygon as markerType', function () {
      l = L.deflate({
        minSize: 20,
        markerType: L.polygon,
      }).addTo(map);

      const polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
      ]);
      should.throws(() => { polygon.addTo(l); });
    });

    it('should use icon', function () {
      const myIcon = L.icon({
        iconUrl: iconPath,
        iconSize: [24, 24],
      });
      const polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
      ]);
      l = L.deflate({
        minSize: 20,
        markerOptions: { icon: myIcon },
      }).addTo(map);

      polygon.addTo(l);
      polygon.marker.options.icon.options.iconUrl.should.equal(iconPath);
    });

    it('should use marker function', function () {
      const polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
      ]);
      function options() {
        return {
          icon: L.icon({
            iconUrl: iconPath,
            iconSize: [24, 24],
          }),
        };
      }

      l = L.deflate({ minSize: 20, markerOptions: options }).addTo(map);
      polygon.addTo(l);
      polygon.marker.options.icon.options.iconUrl.should.equal(iconPath);
    });
  });
});
