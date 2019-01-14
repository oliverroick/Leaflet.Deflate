L.Deflate = L.FeatureGroup.extend({
    options: {
        minSize: 10,
        markerCluster: false,
        markerOptions: {},
        markerClusterOptions: {}
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
        this._layers = [];
        this._needsPrepping = [];

        this._featureLayer = options.markerCluster ? L.markerClusterGroup(this.options.markerClusterOptions) : L.featureGroup(options);
    },

    _getBounds: function(path) {
        // L.Circle defines the radius in metres. If you want to calculate
        // the bounding box of a circle, it needs to be projected on the map.
        // The only way to do that at present is to add it to the map. We're
        // removing the circle after computing the bounds because we haven't
        // figured out wether to display the circle or the deflated marker.
        // It's a terribly ugly solution but ¯\_(ツ)_/¯

        if (path instanceof L.Circle) {
            path.addTo(this._map);
            var bounds = path.getBounds();
            this._map.removeLayer(path);
            return bounds;
        }
        return path.getBounds();
    },

    _isCollapsed: function(path, zoom) {
        var bounds = path.computedBounds;

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

        var marker = L.marker(layer.computedBounds.getCenter(), markerOptions);
        this._bindEvents(marker, layer);

        if (layer.feature) {
            var markerFeature = marker.toGeoJSON();
            markerFeature.properties = layer.feature.properties;
            marker.feature = markerFeature;
        }

        return marker
    },

    _prepLayer: function(layer) {
        if (layer.getBounds && !layer.zoomThreshold && !layer.marker) {
            layer.computedBounds = this._getBounds(layer);

            var zoomThreshold = this._getZoomThreshold(layer);

            layer.zoomThreshold = zoomThreshold;
            layer.marker = this._makeMarker(layer);
            layer.zoomState = this._map.getZoom();
        }
    },

    _addToMap: function(layer) {
        var layerToAdd = this._map.getZoom() <= layer.zoomThreshold ? layer.marker : layer;
        this._featureLayer.addLayer(layerToAdd);
    },

    addLayer: function (layer) {
        if (layer instanceof L.FeatureGroup) {
            for (var i in layer._layers) {
                this.addLayer(layer._layers[i]);
            }
        } else {
            if (this._map) {
                this._prepLayer(layer);
                this._addToMap(layer);
            } else {
                this._needsPrepping.push(layer);
            }
            var id = this.getLayerId(layer);
            this._layers[id] = layer;
        }
    },

    removeLayer: function(layer) {
        if (layer instanceof L.FeatureGroup) {
            for (var i in layer._layers) {
                this.removeLayer(layer._layers[i]);
            }
        } else {
            var id = layer in this._layers ? layer : this.getLayerId(layer);

            this._featureLayer.removeLayer(this._layers[id]);
            if (this._layers[id].marker) { this._featureLayer.removeLayer(this._layers[id].marker); }

            delete this._layers[id];

            var index = this._needsPrepping.indexOf(this._layers[id]);
            if (index !== -1) { this._needsPrepping.splice(index, 1); }
        }
    },

    clearLayers: function() {
        this._featureLayer.clearLayers();
        this._layers = [];
    },

    _switchDisplay: function(layer, showMarker) {
        if (showMarker) {
            this._featureLayer.addLayer(layer.marker);
            this._featureLayer.removeLayer(layer);
        } else {
            this._featureLayer.addLayer(layer);
            this._featureLayer.removeLayer(layer.marker);
        }
    },

    _deflate: function() {
        var bounds = this._map.getBounds();
        var endZoom = this._map.getZoom();

        this.eachLayer(function(layer) {
            if (layer.marker && layer.zoomState !== endZoom && layer.computedBounds.intersects(bounds)) {
                this._switchDisplay(layer, endZoom <= layer.zoomThreshold);
                layer.zoomState = endZoom;
            }
        }, this);
    },

    onAdd: function(map) {
        this._featureLayer.addTo(map);
        this._map.on("zoomend", this._deflate, this);
        this._map.on("moveend", this._deflate, this);

        var i, len;
        for (i = 0, len = this._needsPrepping.length; i < len; i++) {
            var layer = this._needsPrepping[i];
            this.addLayer(layer);
        }
        this._needsPrepping = [];
        this._deflate();
    },

    onRemove: function(map) {
        map.removeLayer(this._featureLayer);
        this._map.off("zoomend", this._deflate, this);
        this._map.off("moveend", this._deflate, this);
    }
});

L.deflate = function (options) {
    return new L.Deflate(options);
};
