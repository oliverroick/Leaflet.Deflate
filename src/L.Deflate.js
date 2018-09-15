L.Deflate = L.FeatureGroup.extend({
    options: {
        minSize: 10,
        markerCluster: false,
        markerOptions: {},
        markerClusterOptions: {}
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
        this._allLayers = [];
        L.FeatureGroup.prototype.initialize.call(this, [], options);

        if (options.markerCluster) {
            this.clusterLayer = L.markerClusterGroup(this.options.markerClusterOptions);
        }
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

    _bindInfoTools: function(marker, parentLayer) {
        if (parentLayer._popupHandlersAdded) {
            marker.bindPopup(parentLayer._popup._content, parentLayer._popup.options);
        }

        if (parentLayer._tooltipHandlersAdded) {
            marker.bindTooltip(parentLayer._tooltip._content, parentLayer._tooltip.options);
        }
    },

    _bindEvents: function(marker, parentLayer) {
        this._bindInfoTools(marker, parentLayer);

        var events = parentLayer._events;
        for (var event in events) {
            if (events.hasOwnProperty(event)) {
                var listeners = events[event];
                for (var i = 0, len = listeners.length; i < len; i++) {
                    marker.on(event, listeners[i].fn);
                }
            }
        }

        // For FeatureGroups we need to bind all events, tooltips and popups
        // from the FeatureGroup to each marker
        if (!parentLayer._eventParents) { return; }

        for (var key in parentLayer._eventParents) {
            if (parentLayer._eventParents.hasOwnProperty(key)) {
                if (parentLayer._eventParents[key]._map) { continue; }
                this._bindEvents(marker, parentLayer._eventParents[key]);

                // We're copying all layers of a FeatureGroup, so we need to bind
                // all tooltips and popups to the original feature.
                this._bindInfoTools(parentLayer, parentLayer._eventParents[key]);
            }
        }
    },

    _makeMarker: function(layer) {
        var markerOptions;

        if (typeof this.options.markerOptions === 'function') {
            markerOptions = this.options.markerOptions(layer);
        } else {
            markerOptions = this.options.markerOptions;
        }

        var marker = L.marker(layer.getBounds().getCenter(), markerOptions);
        this._bindEvents(marker, layer);

        return marker
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

                layer.zoomThreshold = zoomThreshold;
                layer.marker = this._makeMarker(layer);
                layer.zoomState = this._map.getZoom();

                if (this._map.getZoom() <= zoomThreshold) {
                    layerToAdd = layer.marker;
                }
                this._allLayers.push(layer);
            }

            if (this.clusterLayer) {
                this.clusterLayer.addLayer(layerToAdd);
            } else {
                L.FeatureGroup.prototype.addLayer.call(this, layerToAdd);
            }
        }
    },

    removeLayer: function(layer) {
        if (layer instanceof L.FeatureGroup) {
            for (var i in layer._layers) {
                this.removeLayer(layer._layers[i]);
            }
        } else {
            var markerLayer = this.clusterLayer ? this.clusterLayer : this._map;
            markerLayer.removeLayer(layer.marker);
            markerLayer.removeLayer(layer);

            var index = this._allLayers.indexOf(layer);
            if (index !== -1) { this._allLayers.splice(index, 1); }
        }
    },

    _switchDisplay: function(layer, showMarker) {
        var markerLayer = this.clusterLayer ? this.clusterLayer : this._map;
        if (showMarker) {
            markerLayer.addLayer(layer.marker);
            markerLayer.removeLayer(layer);
        } else {
            markerLayer.addLayer(layer);
            markerLayer.removeLayer(layer.marker);
        }
    },

    _deflate: function() {
        var bounds = this._map.getBounds();
        var endZoom = this._map.getZoom();

        for (var i = 0, len = this._allLayers.length; i < len; i++) {
            if (this._allLayers[i].zoomState !== endZoom && this._allLayers[i].getBounds().intersects(bounds)) {
                this._switchDisplay(this._allLayers[i], endZoom <= this._allLayers[i].zoomThreshold);
                this._allLayers[i].zoomState = endZoom;
            }
        }
    },

    onAdd: function(map) {
        if (this.clusterLayer) {this.clusterLayer.addTo(map)};
        this._map.on("zoomend", this._deflate, this);
        this._map.on("moveend", this._deflate, this);
    },

    onRemove: function(map) {
        if (this.clusterLayer) {map.removeLayer(this.cluster)};
        this._map.off("zoomend", this._deflate, this);
        this._map.off("moveend", this._deflate, this);
    }
});

L.deflate = function (options) {
    return new L.Deflate(options);
};
