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

    _addToMap(layer) {
        var layerToAdd = layer;

        if (this._map.getZoom() <= layer.zoomThreshold) {
           layerToAdd = layer.marker;
        }

        if (this.clusterLayer) {
            this.clusterLayer.addLayer(layerToAdd);
        } else {
            L.FeatureGroup.prototype.addLayer.call(this, layerToAdd);
        }
    },

    addLayer: function (layer) {
        if (layer instanceof L.FeatureGroup) {
            for (var i in layer._layers) {
                this.addLayer(layer._layers[i]);
            }
        } else {
            if (layer.getBounds && !layer.zoomThreshold && !layer.marker) {
                layer.computedBounds = this._getBounds(layer);

                var zoomThreshold = this._getZoomThreshold(layer);

                layer.zoomThreshold = zoomThreshold;
                layer.marker = this._makeMarker(layer);
                layer.zoomState = this._map.getZoom();
            }

            this._allLayers.push(layer);
            this._addToMap(layer);
        }
    },

    _removeFromMap(layer) {
        var markerLayer = this.clusterLayer ? this.clusterLayer : this._map;
        markerLayer.removeLayer(layer);
        if (layer.marker) { markerLayer.removeLayer(layer.marker); }
    },

    removeLayer: function(layer) {
        if (layer instanceof L.FeatureGroup) {
            for (var i in layer._layers) {
                this.removeLayer(layer._layers[i]);
            }
        } else {
            this._removeFromMap(layer);

            var index = this._allLayers.indexOf(layer);
            if (index !== -1) { this._allLayers.splice(index, 1); }
        }
    },

    clearLayers: function() {
        if (this.clusterLayer) {
            this.clusterLayer.clearLayers();
            
        } else {
            // return this.eachLayer(this.removeLayer, this);
            for (i = 0, len = this._allLayers.length; i < len; i++) {
                this._removeFromMap(this._allLayers[i]);
            }
        }
        this._allLayers = [];
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
            if (this._allLayers[i].marker && this._allLayers[i].zoomState !== endZoom && this._allLayers[i].computedBounds.intersects(bounds)) {
                this._switchDisplay(this._allLayers[i], endZoom <= this._allLayers[i].zoomThreshold);
                this._allLayers[i].zoomState = endZoom;
            }
        }
    },

    onAdd: function(map) {
        var i, len;
        if (this.clusterLayer) {this.clusterLayer.addTo(map)};
        this._map.on("zoomend", this._deflate, this);
        this._map.on("moveend", this._deflate, this);
        for (i = 0, len = this._allLayers.length; i < len; i++) {
            this._addToMap(this._allLayers[i]);
        }
    },

    onRemove: function(map) {
        var i, len;
        if (this.clusterLayer) {map.removeLayer(this.clusterLayer)};
        this._map.off("zoomend", this._deflate, this);
        this._map.off("moveend", this._deflate, this);
        for (i = 0, len = this._allLayers.length; i < len; i++) {
            this._removeFromMap(this._allLayers[i]);
        }
    }
});

L.deflate = function (options) {
    return new L.Deflate(options);
};
