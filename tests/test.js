var map = L.map.deflate('map', {minSize: 20}).setView([51.505, -0.09], 13);

describe('Leaflet.Conflate', function() {
    afterEach(function () {
        map.setZoom(13, {animate: false});
        map.eachLayer(function (layer) {
            map.removeLayer(layer);
        });
        map.removedPaths = [];
    });

    describe('isCollapsed', function () {

        it('should be false', function () {
            var path = L.polygon([
                [51.509, -0.08],
                [51.503, -0.06],
                [51.51, -0.047]
            ]).addTo(map);

            map.isCollapsed(path, map.getZoom()).should.equal(false);
        });

        it('should be true', function () {
            var path = L.polygon([
                [51.509, -0.08],
                [51.503, -0.06],
                [51.51, -0.047]
            ]).addTo(map);

            map.zoomOut(5);

            map.isCollapsed(path, map.getZoom()).should.equal(true);
        });

    });

    describe('getZoomThreshold', function () {

        it('should return 11', function () {
            var path = L.polygon([
                [51.509, -0.08],
                [51.503, -0.06],
                [51.51, -0.047]
            ]).addTo(map);

            map.getZoomThreshold(path).should.equal(11);
        });

        it('should return 11', function () {
            map.setZoom(10, {animate: false});
            var path = L.polygon([
                [51.509, -0.08],
                [51.503, -0.06],
                [51.51, -0.047]
            ]).addTo(map);

            map.getZoomThreshold(path).should.equal(11);
        });
    });

    describe('map', function () {
        var polygon, circle;
        beforeEach(function() {
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

            map.removedPaths.length.should.equal(1);
            map.removedPaths[0]._latlngs.should.eql(polygon._latlngs);
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

            map.removedPaths.length.should.equal(2);
            map.eachLayer(function (layer) {
                if (polygon === layer || circle === layer) {
                        onMap = true;
                }
            });
            onMap.should.equal(false);
        });
    });

});
