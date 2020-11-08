const L = require('leaflet');
const fixtures = require('./fixtures');

const target = process.env.TARGET || 'src';

require(`../${target}/L.Deflate`); // eslint-disable-line import/no-dynamic-require

const tests = (options) => () => {
  let map;
  let deflateLayer;
  let polygon;
  let marker;
  let circle;
  let json;

  beforeEach(() => {
    const container = document.createElement('div');
    Object.defineProperty(container, 'clientHeight', { configurable: true, value: 600 });
    Object.defineProperty(container, 'clientWidth', { configurable: true, value: 800 });

    map = L.map(container, { renderer: new L.SVG(), center: [51.505, -0.09], zoom: 10 });

    polygon = fixtures.polygon;
    marker = fixtures.polygon;
    circle = fixtures.circle;
    json = fixtures.geojson;
  });

  afterEach(() => {
    map.remove();
  });

  describe('add layer', () => {
    beforeEach(() => {
      deflateLayer = L.deflate(options);
    });

    test('using Map.addLayer', () => {
      polygon.addTo(deflateLayer);
      map.addLayer(deflateLayer);
      map.setZoom(13, { animate: false });
      expect(map.hasLayer(polygon)).toBeTruthy();
    });

    test('using L.Deflate.addTo(Map)', () => {
      polygon.addTo(deflateLayer);
      deflateLayer.addTo(map);
      map.setZoom(13, { animate: false });
      expect(map.hasLayer(polygon)).toBeTruthy();
    });

    test('using L.Deflate.addLayer(Layer)', () => {
      deflateLayer.addTo(map);
      deflateLayer.addLayer(polygon);
      map.setZoom(13, { animate: false });
      expect(map.hasLayer(polygon)).toBeTruthy();
    });

    test('using Layer.addTo(L.Deflate)', () => {
      deflateLayer.addTo(map);
      polygon.addTo(deflateLayer);
      map.setZoom(13, { animate: false });
      expect(map.hasLayer(polygon)).toBeTruthy();
    });
  });

  describe('remove layer', () => {
    beforeEach(() => {
      deflateLayer = L.deflate(options);
      deflateLayer.addTo(map);
      deflateLayer.addLayer(polygon);
    });

    test('Map.removeLayer(L.deflate) removes layer', () => {
      map.setZoom(13, { animate: false });
      map.removeLayer(deflateLayer);
      expect(map.hasLayer(polygon)).toBeFalsy();
      expect(map.hasLayer(polygon.marker)).toBeFalsy();
    });

    test('Map.removeLayer(L.deflate) removes marker', () => {
      map.setZoom(10, { animate: false });
      map.removeLayer(deflateLayer);
      expect(map.hasLayer(polygon)).toBeFalsy();
      expect(map.hasLayer(polygon.marker)).toBeFalsy();
    });

    test('Map.removeLayer(Layer) removes layer', () => {
      map.setZoom(13, { animate: false });
      map.removeLayer(polygon);
      expect(map.hasLayer(polygon)).toBeFalsy();
      expect(map.hasLayer(polygon.marker)).toBeFalsy();
    });

    it.skip('Map.removeLayer(Layer) removes marker', () => {
      map.setZoom(10, { animate: false });
      map.removeLayer(polygon);
      expect(map.hasLayer(polygon)).toBeFalsy();
      expect(map.hasLayer(polygon.marker)).toBeFalsy();
    });

    test('L.Deflate.removeLayer(Layer) removes layer', () => {
      map.setZoom(13, { animate: false });
      deflateLayer.removeLayer(polygon);
      expect(map.hasLayer(polygon)).toBeFalsy();
      expect(map.hasLayer(polygon.marker)).toBeFalsy();
    });

    test('L.Deflate.removeLayer(Layer) removes marker', () => {
      map.setZoom(10, { animate: false });
      deflateLayer.removeLayer(polygon);
      expect(map.hasLayer(polygon)).toBeFalsy();
      expect(map.hasLayer(polygon.marker)).toBeFalsy();
    });

    test('Layer.remove() removes layer', () => {
      map.setZoom(13, { animate: false });
      polygon.remove();
      expect(map.hasLayer(polygon)).toBeFalsy();
      expect(map.hasLayer(polygon.marker)).toBeFalsy();
    });

    it.skip('Layer.remove() removes marker', () => {
      map.setZoom(10, { animate: false });
      polygon.remove();
      expect(map.hasLayer(polygon)).toBeFalsy();
      expect(map.hasLayer(polygon.marker)).toBeFalsy();
    });
  });

  describe('clear layers', () => {
    beforeEach(() => {
      deflateLayer = L.deflate(options);
      deflateLayer.addTo(map);
      deflateLayer.addLayer(polygon);
    });

    test('should remove polygon', function () {
      map.setZoom(13, { animate: false });
      deflateLayer.clearLayers();

      expect(map.hasLayer(polygon)).toBeFalsy();
      expect(map.hasLayer(polygon.marker)).toBeFalsy();
    });

    test('should remove polygon marker', function () {
      map.setZoom(8, { animate: false });
      deflateLayer.clearLayers();

      expect(map.hasLayer(polygon)).toBeFalsy();
      expect(map.hasLayer(polygon.marker)).toBeFalsy();
    });

    test('should remove point', function () {
      map.setZoom(13, { animate: false });
      deflateLayer.clearLayers();
      expect(map.hasLayer(marker)).toBeFalsy();
    });
  });

  describe('Event listeners', () => {
    beforeEach(() => {
      deflateLayer = L.deflate(options);
      deflateLayer.addTo(map);
    });

    test('passed from layer to marker', () => {
      const callback = jest.fn();
      polygon.on('click', callback);
      deflateLayer.addLayer(polygon);

      expect(polygon.marker).toHaveProperty(['_events', 'click', 0, 'fn'], callback);
    });

    test('passed from GeoJSON to marker', function () {
      const callback = jest.fn();
      json.on('click', callback);
      deflateLayer.addLayer(json);

      map.eachLayer(function (layer) {
        if (layer.marker) {
          expect(layer.marker).toHaveProperty(['_events', 'click', 0, 'fn'], callback);
        }
      });
    });
  });

  describe('Popup', () => {
    beforeEach(() => {
      deflateLayer = L.deflate(options);
      deflateLayer.addTo(map);
    });

    test('passed from layer to marker', () => {
      polygon.bindPopup('Click', { closeButton: false });
      deflateLayer.addLayer(polygon);

      expect(polygon.marker).toHaveProperty('_popupHandlersAdded', true);
      expect(polygon.marker).toHaveProperty('_popup._content', 'Click');
      expect(polygon.marker).toHaveProperty('_popup.options.closeButton', false);
    });

    test('passed from GeoJson to marker', () => {
      json.bindPopup('Click', { closeButton: false });
      deflateLayer.addLayer(json);

      map.eachLayer(function (layer) {
        if (layer.marker) {
          expect(layer).toHaveProperty('_popupHandlersAdded', true);
          expect(layer).toHaveProperty('_popup._content', 'Click');
          expect(layer).toHaveProperty('_popup.options.closeButton', false);
          expect(layer.marker).toHaveProperty('_popupHandlersAdded', true);
          expect(layer.marker).toHaveProperty('_popup._content', 'Click');
          expect(layer.marker).toHaveProperty('_popup.options.closeButton', false);
        }
      });
    });
  });

  describe('Tooltip', () => {
    beforeEach(() => {
      deflateLayer = L.deflate(options);
      deflateLayer.addTo(map);
    });

    test('passed from layer to marker', () => {
      polygon.bindTooltip('Click', { direction: 'bottom' });
      deflateLayer.addLayer(polygon);

      expect(polygon.marker).toHaveProperty('_tooltipHandlersAdded', true);
      expect(polygon.marker).toHaveProperty('_tooltip._content', 'Click');
      expect(polygon.marker).toHaveProperty('_tooltip.options.direction', 'bottom');
    });

    test('passed from GeoJson to marker', () => {
      json.bindTooltip('Click', { direction: 'bottom' });
      deflateLayer.addLayer(json);

      map.eachLayer(function (layer) {
        if (layer.marker) {
          expect(layer).toHaveProperty('_tooltipHandlersAdded', true);
          expect(layer).toHaveProperty('_tooltip._content', 'Click');
          expect(layer).toHaveProperty('_tooltip.options.direction', 'bottom');
          expect(layer.marker).toHaveProperty('_tooltipHandlersAdded', true);
          expect(layer.marker).toHaveProperty('_tooltip._content', 'Click');
          expect(layer.marker).toHaveProperty('_tooltip.options.direction', 'bottom');
        }
      });
    });
  });

  describe('Deflate marker', () => {
    const iconPath = '../example/img/marker.png';

    test('can be L.marker', () => {
      deflateLayer = L.deflate({ ...options, markerType: L.marker });
      deflateLayer.addTo(map);
      expect(() => polygon.addTo(deflateLayer)).not.toThrow();
    });

    test('can be L.circleMarker', () => {
      deflateLayer = L.deflate({ ...options, markerType: L.circleMarker });
      deflateLayer.addTo(map);
      expect(() => polygon.addTo(deflateLayer)).not.toThrow();
    });

    test('can be L.polygon', () => {
      deflateLayer = L.deflate({ ...options, markerType: L.polygon });
      deflateLayer.addTo(map);
      expect(() => polygon.addTo(deflateLayer)).toThrow();
    });

    test('uses icon', () => {
      const myIcon = L.icon({
        iconUrl: iconPath,
        iconSize: [24, 24],
      });
      deflateLayer = L.deflate({ ...options, markerOptions: { icon: myIcon } });
      deflateLayer.addTo(map);
      polygon.addTo(deflateLayer);

      expect(polygon.marker).toHaveProperty('options.icon.options.iconUrl', iconPath);
    });

    test('uses function', () => {
      const markerOptions = () => ({
        icon: L.icon({
          iconUrl: iconPath,
          iconSize: [24, 24],
        }),
      });
      deflateLayer = L.deflate({ ...options, markerOptions });
      deflateLayer.addTo(map);
      polygon.addTo(deflateLayer);

      expect(polygon.marker).toHaveProperty('options.icon.options.iconUrl', iconPath);
    });
  });

  describe('Deflating polygon', () => {
    beforeEach(() => {
      deflateLayer = L.deflate(options);
      deflateLayer.addTo(map);
      deflateLayer.addLayer(polygon);
    });

    test('polygon is not deflated', () => {
      map.setZoom(13, { animate: false });
      expect(map.hasLayer(polygon)).toBeTruthy();
      expect(map.hasLayer(polygon.marker)).toBeFalsy();
    });

    test('polygon is deflated after zooming out', () => {
      map.setZoom(10, { animate: false });
      expect(map.hasLayer(polygon)).toBeFalsy();
      expect(map.hasLayer(polygon.marker)).toBeTruthy();
    });

    test('polygon is not inflated after zooming in when outside map bbox', () => {
      map.setZoom(10, { animate: false });
      map.panTo([0, 0]);
      map.setZoom(13, { animate: false });
      expect(map.hasLayer(polygon)).toBeFalsy();
      expect(map.hasLayer(polygon.marker)).toBeTruthy();
    });

    test('polygon is inflated after zooming in when dragged inside map bbox', () => {
      map.setZoom(10, { animate: false });
      map.panTo([0, 0]);
      map.setZoom(13, { animate: false });
      map.panTo([51.505, -0.09], { animate: false });
      expect(map.hasLayer(polygon)).toBeTruthy();
      expect(map.hasLayer(polygon.marker)).toBeFalsy();
    });
  });

  describe('Deflating circle', () => {
    beforeEach(() => {
      deflateLayer = L.deflate(options);
      deflateLayer.addTo(map);
      deflateLayer.addLayer(circle);
    });

    test('circle is not deflated', () => {
      map.setZoom(14, { animate: false });
      expect(map.hasLayer(circle)).toBeTruthy();
      expect(map.hasLayer(circle.marker)).toBeFalsy();
    });

    test('circle is deflated after zooming out', () => {
      map.setZoom(10, { animate: false });
      expect(map.hasLayer(circle)).toBeFalsy();
      expect(map.hasLayer(circle.marker)).toBeTruthy();
    });

    test('circle is not inflated after zooming in when outside map bbox', () => {
      map.setZoom(10, { animate: false });
      map.panTo([0, 0]);
      map.setZoom(14, { animate: false });
      expect(map.hasLayer(circle)).toBeFalsy();
      expect(map.hasLayer(circle.marker)).toBeTruthy();
    });

    test('circle is inflated after zooming in when dragged inside map bbox', () => {
      map.setZoom(10, { animate: false });
      map.panTo([0, 0]);
      map.setZoom(14, { animate: false });
      map.panTo([51.505, -0.09], { animate: false });
      expect(map.hasLayer(circle)).toBeTruthy();
      expect(map.hasLayer(circle.marker)).toBeFalsy();
    });
  });

  describe('Deflating GeoJSON', () => {
    const countLayers = (m) => {
      let numberLayers = 0;
      m.eachLayer((layer) => {
        if (layer.zoomThreshold && layer.getBounds) { numberLayers += 1; }
      });
      return numberLayers;
    };

    beforeEach(() => {
      deflateLayer = L.deflate(options);
      deflateLayer.addTo(map);
      deflateLayer.addLayer(json);
    });

    test('2 polygons inflated at zoom 10', () => {
      map.setZoom(10, { animate: false });
      expect(countLayers(map)).toEqual(2);
    });

    test('3 polygons inflated at zoom 11', () => {
      map.setZoom(11, { animate: false });
      expect(countLayers(map)).toEqual(3);
    });
  });

  describe('GeoJSON', () => {
    beforeEach(() => {
      deflateLayer = L.deflate(options);
      deflateLayer.addTo(map);
      deflateLayer.addLayer(json);
    });

    test('passed feature properties to marker', () => {
      const layer = deflateLayer.getLayers()[0];
      expect(layer.marker.feature.geometry).toEqual(layer.marker.toGeoJSON().geometry);
      expect(layer.marker.feature.properties).toEqual(layer.feature.properties);
    });
  });
};

describe(`Test ${target}`, () => {
  describe('using internal deflate layer', tests({ minSize: 20 }));
  describe('using injected deflate layer', tests({ minSize: 20, deflateLayer: L.featureGroup() }));
});
