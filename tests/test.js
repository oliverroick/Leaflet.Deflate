describe('Leaflet.Deflate', function() {
    var map;

    beforeEach(function() {
        map = L.map("map").setView([51.505, -0.09], 13);
    });

    afterEach(function () {
        map.remove();
    });

    describe('Applied to map', function () {
        var polygon, circle;
        beforeEach(function() {
            L.Deflate({minSize: 20}).addTo(map);

            polygon = L.polygon([
                [51.509, -0.08],
                [51.503, -0.06],
                [51.51, -0.047]
            ]).addTo(map);

            circle = L.circle([51.508, -0.11], 500, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5
            }).addTo(map);
        });

        it('polygon should not be on map', function () {
            map.setZoom(11, {animate: false});

            var onMap = false;

            map.eachLayer(function (layer) {
                if (polygon === layer) {
                        onMap = true;
                }
            });
            onMap.should.equal(false);
        });

        it('polygon and circle should not be on map', function () {
            map.setZoom(10, {animate: false});

            var onMap = false;

            map.eachLayer(function (layer) {
                if (polygon === layer || circle === layer) {
                        onMap = true;
                }
            });
            onMap.should.equal(false);
        });
    });

    describe('Applied to layergroup', function () {
        var polygon, circle;

        beforeEach(function() {
            var featureGroup = L.featureGroup().addTo(map);
            L.Deflate({minSize: 20, featureGroup: featureGroup}).addTo(map);

            polygon = L.polygon([
                [51.509, -0.08],
                [51.503, -0.06],
                [51.51, -0.047]
            ]);
            featureGroup.addLayer(polygon);

            circle = L.circle([51.508, -0.11], 500, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5
            }).addTo(map);
        });

        it('polygon should not be on map', function () {
            map.setZoom(10, {animate: false});

            var onMap = false;

            map.eachLayer(function (layer) {
                if (polygon === layer) {
                        onMap = true;
                }
            });
            onMap.should.equal(false);
        });

        it('circle should be on map', function () {
            map.setZoom(10, {animate: false});

            var onMap = false;

            map.eachLayer(function (layer) {
                if (circle === layer) {
                    onMap = true;
                }
            });
            onMap.should.equal(true);
        }); 
    });

    describe('GeoJSON', function () {
        beforeEach(function() {
            L.Deflate({minSize: 20}).addTo(map);

            var json = {
              "type": "FeatureCollection",
              "features": [
                {
                  "type": "Feature",
                  "properties": {
                    "id": 1
                  },
                  "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                      [
                        [
                          -0.273284912109375,
                          51.60437164681676
                        ],
                        [
                          -0.30212402343749994,
                          51.572802100290254
                        ],
                        [
                          -0.276031494140625,
                          51.57194856482396
                        ],
                        [
                          -0.267791748046875,
                          51.587309751245456
                        ],
                        [
                          -0.273284912109375,
                          51.60437164681676
                        ]
                      ]
                    ]
                  }
                },
                {
                  "type": "Feature",
                  "properties": {
                    "id": 4
                  },
                  "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                      [
                        [
                          -0.25543212890625,
                          51.600959780448626
                        ],
                        [
                          -0.2581787109375,
                          51.57621608189101
                        ],
                        [
                          -0.22247314453125,
                          51.6001067737997
                        ],
                        [
                          -0.24032592773437497,
                          51.613752957501
                        ],
                        [
                          -0.25543212890625,
                          51.600959780448626
                        ]
                      ]
                    ]
                  }
                },
                {
                  "type": "Feature",
                  "properties": {
                    "id": 2
                  },
                  "geometry": {
                    "type": "Point",
                    "coordinates": [
                      0.031585693359375,
                      51.4428807236673
                    ]
                  }
                },
                {
                  "type": "Feature",
                  "properties": {
                    "id": 3
                  },
                  "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                      [
                        [
                          0.06866455078125,
                          51.59584150020809
                        ],
                        [
                          0.06866455078125,
                          51.61034179610212
                        ],
                        [
                          0.10162353515625,
                          51.61034179610212
                        ],
                        [
                          0.10162353515625,
                          51.59584150020809
                        ],
                        [
                          0.06866455078125,
                          51.59584150020809
                        ]
                      ]
                    ]
                  }
                }
              ]
            }

            L.geoJson(json).addTo(map);
        });

        it('zoom == 9: 2 polygons should be on the map', function () {
            map.setZoom(10, {animate: false});

            var count = 0;

            map.eachLayer(function (layer) {
                if (layer.zoomThreshold && layer.getBounds) { count++; }
            });
            count.should.equal(2);
        });

        it('zoom == 10: 3 polygons should be on the map', function () {
            map.setZoom(11, {animate: false});

            var count = 0;

            map.eachLayer(function (layer) {
                if (layer.zoomThreshold && layer.getBounds) { count++; }
            });
            count.should.equal(3);
        }); 
    });

    describe('Events', function () {
        it('passes event listeners to marker', function () {
            L.Deflate({minSize: 20}).addTo(map);
            var callback = function() {}
            
            polygon = L.polygon([
                [51.509, -0.08],
                [51.503, -0.06],
                [51.51, -0.047]
            ]);
            polygon.on('click', callback);
            polygon.addTo(map);

            polygon.marker._leaflet_events.should.have.property('click');
            polygon.marker._leaflet_events['click'][0].action.should.equal(callback);
        });
    });
});
