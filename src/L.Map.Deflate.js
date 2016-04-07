L.Deflate = function(map, options){
    var removedPaths = [];
    var minSize = options.minSize || 10;

    function isCollapsed(path, zoom) {
        var bounds = path.getBounds();

        var ne_px = map.project(bounds.getNorthEast(), zoom);
        var sw_px = map.project(bounds.getSouthWest(), zoom);

        var width = ne_px.x - sw_px.x;
        var height = sw_px.y - ne_px.y;
        return (height < minSize || width < minSize);
    }

    function getZoomThreshold(path) {
        var zoomThreshold = null;
        var zoom = map.getZoom();
        if (isCollapsed(path, map.getZoom())) {
            while (!zoomThreshold) {
                zoom += 1;
                if (!isCollapsed(path, zoom)) {
                    zoomThreshold = zoom - 1;
                }
            }
        } else {
            while (!zoomThreshold) {
                zoom -= 1;
                if (isCollapsed(path, zoom)) {
                    zoomThreshold = zoom;
                }
            }
        }
        return zoomThreshold;
    }

    map.on('layeradd', function(event) {
        var feature = event.layer;
        if (feature.getBounds && !feature.zoomThreshold && !feature.marker) {
            var zoomThreshold = getZoomThreshold(feature);
            var marker = L.marker(feature.getBounds().getCenter());

            feature.zoomThreshold = zoomThreshold;
            feature.marker = marker;

            if (map.getZoom() <= zoomThreshold) {
                map.removeLayer(feature);
                map.addLayer(feature.marker);
            }
        }
    });

    map.on('zoomend', function () {
        var removedTemp = [];

        map.eachLayer(function (feature) {
            if (map.getZoom() <= feature.zoomThreshold) {
                map.removeLayer(feature);
                map.addLayer(feature.marker);
                removedTemp.push(feature);
            }
        });

        for (var i = 0; i < removedPaths.length; i++) {
            var feature = removedPaths[i];
            if (map.getZoom() > feature.zoomThreshold) {
                map.removeLayer(feature.marker);
                map.addLayer(feature);
                removedPaths.splice(i, 1);
                i = i - 1;
            }
        }

        removedPaths = removedPaths.concat(removedTemp);
    });

}