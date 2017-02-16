# Leaflet.Deflate


[![Build Status](https://travis-ci.org/oliverroick/Leaflet.Deflate.svg?branch=master)](https://travis-ci.org/oliverroick/Leaflet.Deflate)

Substitutes polygons and lines with markers when their screen size falls below a defined threshold.

![Example](https://cloud.githubusercontent.com/assets/159510/7164588/090c06fe-e399-11e4-956d-0283ef7e69cf.gif)

## Usage

Include `L.Deflate.js` from UNPKG:

```html
<script src="https://unpkg.com/Leaflet.Deflate@0.4.0/dist/L.Deflate.js"></script>
```

Initialize with the `minSize` option and add to map. `minSize` defines the minimum width and height in pixels for a path to be displayed in its actual shape. It defaults to `20`. Add features to the layer as you please.

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


### Cluster Markers

With a little help from [Leaflet.Markercluster](https://github.com/Leaflet/Leaflet.markercluster>) you can cluster markers. Add the Leaflet.Markercluster libraries to your page as [described in the docs](https://github.com/Leaflet/Leaflet.markercluster#using-the-plugin>). Then enable clustering by adding `markerCluster: true` to the options when initializing `L.deflate`.

```javascript
var map = L.map("map").setView([51.505, -0.09], 12);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var features = L.deflate({minSize: 20, markerCluster: true});
features.addTo(map);

var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]);
features.addLayer(polygon);

var polyline = L.polyline([
    [51.52, -0.05],
    [51.53, -0.10],
], {color: 'red'});
features.addLayer(polyline);
```

##Developing

You'll need to install the dev dependencies to test and write the distribution file.

```
npm install
```
    
To run tests:

```
gulp test
```

To write a minified JS into dist:

```
gulp dist
```

## Authors

- [Lindsey Jacks](https://github.com/linzjax>)
- [Oliver Roick](http://github.com/oliverroick>)

## License

Apache 2.0
