import * as L from 'leaflet';
import 'L.Deflate';

const l = L.deflate({minSize: 20});

// Polygon
const polygon = L.polygon([
  [51.509, -0.08],
  [51.503, -0.06],
  [51.51, -0.047],
]);

l.addLayer(polygon);
l.prepLayer(polygon);

// GeoJSON
const json: GeoJSON.FeatureCollection<any>  = {
  "type": "FeatureCollection",
  "features": [{
      "type": "Feature",
      "properties": {
          "id": 1
      },
      "geometry": {
          "type": "Polygon",
          "coordinates": [
              [
                  [-0.144624, 51.551088],
                  [-0.143648, 51.550818],
                  [-0.143718, 51.550701],
                  [-0.142398, 51.550351],
                  [-0.142060, 51.550861],
                  [-0.143160, 51.551155],
                  [-0.143213, 51.551091],
                  [-0.144410, 51.551408]
              ]
          ]
      }
  }]
};
const geoJson = L.geoJSON(json);
l.addLayer(geoJson);

// Marker
L.deflate({
  markerOptions: {
    icon: L.icon({
      iconUrl: 'img/marker.png',
      iconSize: [24, 24]
    })
  }
});


// CircleMarker
L.deflate({
  markerType: L.circleMarker,
  markerOptions: {
    radius: 12
  }
});

// Custom marker function
L.deflate({ 
  markerOptions: () => {
    return {
      icon: L.icon({
          iconUrl: 'img/marker.png',
          iconSize: [24, 24]
      })
    };
  }
});

L.deflate({ 
  markerOptions: () => {
    return {
      radius: 12
    };
  }
});

// MarkerCluster
L.deflate({ 
  markerCluster: true
});

