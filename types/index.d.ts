import * as L from 'leaflet';
import 'leaflet.markercluster';

type MarkerFactory = (latlng: L.LatLngExpression, options?: L.MarkerOptions) => L.Marker;
type CircleMarkerFactory = (latlng: L.LatLngExpression, options?: L.CircleMarkerOptions) => L.CircleMarker;
type MarkerOptionsFunction = (layer: L.Layer) => L.MarkerOptions | L.CircleMarkerOptions;

declare module 'leaflet' {
    interface DeflateOptions extends LayerOptions {
        minSize?: number;
        markerCluster?: boolean;
        markerOptions?: MarkerOptions | CircleMarkerOptions | MarkerOptionsFunction;
        markerClusterOptions?: MarkerClusterGroupOptions;
        markerType?: MarkerFactory | CircleMarkerFactory;
    }

    class DeflateLayer extends FeatureGroup {
        constructor(options: DeflateOptions);
        prepLayer(layer: Layer): void;
    }

    function deflate(options: DeflateOptions): DeflateLayer;
}
export {};
