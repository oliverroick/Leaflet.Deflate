# Leaflet.Deflate


[![Build Status](https://travis-ci.org/oliverroick/Leaflet.Deflate.svg?branch=master)](https://travis-ci.org/oliverroick/Leaflet.Deflate)
[![npm version](https://badge.fury.io/js/Leaflet.Deflate.svg)](https://badge.fury.io/js/Leaflet.Deflate)

Substitutes polygons and lines with markers when their screen size falls below a defined threshold.

![Example](https://user-images.githubusercontent.com/159510/52898557-a491d700-31df-11e9-86c4-7a585dc50372.gif)

## Installation

### Using a hosted version

Include the source into the `head` section of your document.

```html
<script src="https://unpkg.com/Leaflet.Deflate/dist/L.Deflate.js"></script>
```

### Install via NPM

If you use the [npm package manager](https://www.npmjs.com/), you can fetch a local copy by running:

```bash
npm install Leaflet.Deflate
```

You will find a copy of the release files in `node_modules/Leaflet.Deflate/dist`.

## API

### `L.deflate`

The central class of the `Leaflet.Deflate`. It is used to create a feature group that deflates all layers added to the group.

#### Usage example

Initialize a new `L.deflate` feature group and add it to your map. Then add layers you want to deflate.

```javascript
var map = L.map("map");
var features = L.deflate({minSize: 10})
features.addTo(map);

// add layers
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
])
.addTo(features);

// works with GeoJSONLayer too
L.geoJson(json).addTo(features);
```

#### Creation

Factory                       | Description
----------------------------  | -------------
`L.deflate(<Object> options)` | Creates a new deflatable feature group, optionally given an options object.

#### Options

Option          | Type      | Default | Description
--------------- | --------- | ------- | -------------
`minSize`       | `int`     | `20`    | Defines the minimum width and height in pixels for a path to be displayed in its actual shape.
`markerOptions` | `object` or `function`  | `{}`    | Optional. Customize the markers of deflated features using [Leaflet marker options](http://leafletjs.com/reference-1.3.0.html#marker).
`markerCluster` | `boolean` | `false` | Indicates whether markers should be clustered. Requires `Leaflet.MarkerCluser`.
`markerClusterOptions` | `object` | `{}`    | Optional. Customize the appearance and behaviour of clustered markers using [`Leaflet.markercluster` options](https://github.com/Leaflet/Leaflet.markercluster#options).

## Examples

### Basic

To create a basic deflatable layer, you have to

1. Create an `L.Deflate` feature group and add it to your map.
2. Add features to the `L.Deflate` feature group.

```javascript
var map = L.map("map").setView([51.505, -0.09], 12);

var deflate_features = L.deflate({minSize: 20});
deflate_features.addTo(map);

var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]);
deflate_features.addLayer(polygon);

var polyline = L.polyline([
    [51.52, -0.05],
    [51.53, -0.10],
], {color: 'red'});
deflate_features.addLayer(polyline);
```

### GeoJSON

Also works with [`GeoJSON` layers](http://leafletjs.com/reference-1.3.0.html#geojson).

```javascript
var map = L.map("map").setView([51.505, -0.09], 12);

var deflate_features = L.deflate({minSize: 20});
deflate_features.addTo(map);

var json = {
    "type": "FeatureCollection",
    "features": [{}]
}

L.geoJson(json, {style: {color: '#0000FF'}}).addTo(features);
```

### Custom markers

You can change the appearance of markers representing deflated features either by providing a [marker-options object](http://leafletjs.com/reference-1.3.0.html#marker-option) or a function that returns a marker-options object. Providing a marker-options object is usually sufficient, you would typically choose to provide a function if you want to base to marker appearance on the feature's properties.

Provide the object or function to the `markerOption` property when initializing `L.deflate`.

#### Define custom markers using a marker options object

```javascript
var map = L.map("map").setView([51.550406, -0.140765], 16);

var myIcon = L.icon({
  iconUrl: 'img/marker.png',
  iconSize: [24, 24]
});

var features = L.deflate({minSize: 20, markerOptions: {icon: myIcon}});
features.addTo(map);
```

#### Define custom markers using a function

```javascript
var map = L.map("map").setView([51.550406, -0.140765], 16);

function options(f) {
    // Use custom marker only for buildings
    if (f.feature.properties.type === 'building') {
        return {
            icon: L.icon({
                iconUrl: 'img/marker.png',
                iconSize: [24, 24]
            })
        }
    }

    return {};
}

var features = L.deflate({minSize: 20, markerOptions: options});
features.addTo(map);
```

### Cluster Markers

With a little help from [Leaflet.Markercluster](https://github.com/Leaflet/Leaflet.markercluster>) you can cluster markers. Add the Leaflet.Markercluster libraries to the `head` section of your document as [described in the docs](https://github.com/Leaflet/Leaflet.markercluster#using-the-plugin>). Then enable clustering by adding `markerCluster: true` to the options when initializing `L.deflate`.

```javascript
var map = L.map("map").setView([51.505, -0.09], 12);

var deflate_features = L.deflate({minSize: 20, markerCluster: true});
deflate_features.addTo(map);

var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]);
deflate_features.addLayer(polygon);

var polyline = L.polyline([
    [51.52, -0.05],
    [51.53, -0.10],
], {color: 'red'});
deflate_features.addLayer(polyline);
```

### Leaflet.Draw

[Leaflet.Draw](https://github.com/Leaflet/Leaflet.draw) is a plugin that adds support for drawing and editing vector features on Leaflet maps. Leaflet.Deflate integrates with Leaflet.Draw.

Initialize the [`Leaflet.draw` control](https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest#l-draw), instructing it to use the `L.deflate` instance to draw and edit features and add it to the map. 

To ensure that newly added or edited features are deflated at the correct zoom level and show the marker at the correct location, you need call `prepLayer` with the edited layer on every change. In the example below, we call `prepLayer` inside the handler function for the [`L.Draw.Event.EDITED`](https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest#l-draw-event-draw:editstop) event.

```javascript
var map = L.map("map").setView([51.505, -0.09], 12);

var deflate_features = L.deflate({minSize: 20, markerCluster: true});
deflate_features.addTo(map);

var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: deflate_features
    }
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;
    deflate_features.addLayer(layer);
});

map.on(L.Draw.Event.EDITED, function(event) {
    const editedLayers = event.layers;
    editedLayers.eachLayer(function(l) {
        deflate_features.prepLayer(l);
    });
});

```


## Developing

You'll need to install the dev dependencies to test and write the distribution file.

```
npm install
```
    
To run tests:

```
npm test
```

To write a minified JS into dist:

```
npm run dist
```

## Releasing

[`npm version`](https://docs.npmjs.com/cli/version.html) is set up to take it all the way to npm. 

## Authors

- [Lindsey Jacks](https://github.com/linzjax)
- [Loic Lacroix](https://github.com/loclac)
- [Oliver Roick](http://github.com/oliverroick)

## License

Apache 2.0
