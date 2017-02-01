L.Deflate = L.LayerGroup.extend({
    options: {
        minSize: 10,
        markerCluster: false
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
        this._allLayers = [];
        this._featureGroup = this.options.markerCluster ? L.markerClusterGroup() : L.featureGroup();
    },

    _isCollapsed: function(path, zoom) {
        var bounds = path.getBounds();

        var ne_px = this._map.project(bounds.getNorthEast(), zoom);
        var sw_px = this._map.project(bounds.getSouthWest(), zoom);

        var width = ne_px.x - sw_px.x;
        var height = sw_px.y - ne_px.y;
        return (height < this.options.minSize || width < this.options.minSize);
    },

    _getZoomThreshold: function(path) {
        var zoomThreshold = null;
        var zoom = this._map.getZoom();
        if (this._isCollapsed(path, this._map.getZoom())) {
            while (!zoomThreshold) {
                zoom += 1;
                if (!this._isCollapsed(path, zoom)) {
                    zoomThreshold = zoom - 1;
                }
            }
        } else {
            while (!zoomThreshold) {
                zoom -= 1;
                if (this._isCollapsed(path, zoom)) {
                    zoomThreshold = zoom;
                }
            }
        }
        return zoomThreshold;
    },

    addLayer: function (layer) {
        if (layer instanceof L.FeatureGroup) {
            for (var i in layer._layers) {
                this.addLayer(layer._layers[i]);
            }
        } else {
            var layerToAdd = layer;
            if (layer.getBounds && !layer.zoomThreshold && !layer.marker) {
                var zoomThreshold = this._getZoomThreshold(layer);
                var marker = L.marker(layer.getBounds().getCenter());

                if (layer._popupHandlersAdded) {
                    marker.bindPopup(layer._popup._content);
                }

                var events = layer._events;
                for (var event in events) {
                    if (events.hasOwnProperty(event)) {
                        var listeners = events[event];
                        for (var i = 0, len = listeners.length; i < len; i++) {
                            marker.on(event, listeners[i].fn);
                        }
                    }
                }

                layer.zoomThreshold = zoomThreshold;
                layer.marker = marker;
                layer.zoomState = this._map.getZoom();

                if (this._map.getZoom() <= zoomThreshold) {
                    layerToAdd = layer.marker;
                }
                this._allLayers.push(layer);
            }

            this._featureGroup.addLayer(layerToAdd);    
        }
    },

    removeLayer: function(layer) {
        if (layer instanceof L.FeatureGroup) {
            for (var i in layer._layers) {
                this.removeLayer(layer._layers[i]);
            }
        } else {
            this._featureGroup.removeLayer(layer.marker);
            this._featureGroup.removeLayer(layer);

            const index = this._allLayers.indexOf(layer);
            if (index !== -1) { this._allLayers.splice(index, 1); }
        }
    },

    _switchDisplay: function(layer, showMarker) {
        if (showMarker) {
            this._featureGroup.addLayer(layer.marker);
            this._featureGroup.removeLayer(layer);    
        } else {
            this._featureGroup.addLayer(layer);
            this._featureGroup.removeLayer(layer.marker);    
        }
    },

    _deflate: function() {
        const bounds = this._map.getBounds();
        const endZoom = this._map.getZoom();
        var markersToAdd = [];
        var markersToRemove = [];

        for (var i = 0, len = this._allLayers.length; i < len; i++) {
            if (this._allLayers[i].zoomState !== endZoom && this._allLayers[i].getBounds().intersects(bounds)) {
                this._switchDisplay(this._allLayers[i], endZoom <= this._allLayers[i].zoomThreshold);
                this._allLayers[i].zoomState = endZoom;
            }
        }
    },

    getBounds: function() {
        return this._featureGroup.getBounds();
    },

    onAdd: function(map) {
        this._featureGroup.addTo(map);
        this._map.on("zoomend", this._deflate, this);
        this._map.on("moveend", this._deflate, this);
    },

    onRemove: function(map) {
        map.removeLayer(this._featureGroup);
        this._map.off("zoomend", this._deflate, this);
        this._map.off("moveend", this._deflate, this);
    }
});

L.deflate = function (options) {
    return new L.Deflate(options);
};
