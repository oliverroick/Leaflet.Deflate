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
});
