# Leaflet.Deflate


[![Build Status](https://travis-ci.org/oliverroick/Leaflet.Deflate.svg?branch=master)](https://travis-ci.org/oliverroick/Leaflet.Deflate)
[![Greenkeeper](https://badges.greenkeeper.io/oliverroick/Leaflet.Deflate.svg)](https://greenkeeper.io/)

Substitutes polygons and lines with markers when their screen size falls below a defined threshold.

![Example](https://cloud.githubusercontent.com/assets/159510/7164588/090c06fe-e399-11e4-956d-0283ef7e69cf.gif)

(**NOTE:** The following refence reflects pre-release version 1.0-alpha.6. If you're looking to use the latest stable release, please refer to the [maintenance/0.3 branch](https://github.com/oliverroick/Leaflet.Deflate/tree/maintenance/0.3).)

## Installation

### Using a hosted version

Include the source into the `head` section of your document.

```html
<script src="https://unpkg.com/Leaflet.Deflate@1.0.0-alpha.6/dist/L.Deflate.js"></script>
```

### Install via NPM

If you use the [npm package manager](https://www.npmjs.com/), you can fetch a local copy by running:

```bash
npm install Leaflet.Deflate@1.0.0-alpha.6
```

You will find a copy of the release files in `node_modules/Leaflet.Deflate/dist`.

## API

### `L.Deflate`

The central class of the `Leaflet.Deflate`. It is used to create a feature group that deflates all layers added to the group.

#### Usage example

Initialize a new `L.Deflate` feature group, add it too your map and add layers you want to deflate.

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

You can change the appearance of markers representing deflated features either by providing a [marker options object](http://leafletjs.com/reference-1.3.0.html#marker-option) of a function that returns a marker options object. Usually providing a marker options objects is sufficient for most use cases, you would typically choose to provide a function if you want to base to marker appearance on the feature's properties.

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

## Authors

- [Lindsey Jacks](https://github.com/linzjax)
- [Loic Lacroix](https://github.com/loclac)
- [Oliver Roick](http://github.com/oliverroick)

## License

Apache 2.0
