===============
Leaflet.Deflate
===============

Extends `Leaflet.Map <http://leafletjs.com/reference.html#map-class>`_ to automatically substitute polygons and lines with markers when their screen size falls below a defined threshold.

Usage
=====

Initialize along with the `minSize`. `minSize` defines the minimum width and height in pixels for a Path to be displayed in its actual shape.

.. code-block:: javascript

    var map = L.map.deflate('map', {minSize: 20})

All options and methods from Leaflet.Map are inherited.

Author
======

`Oliver Roick <http://github.com/oliverroick>`_

License
=======

Apache 2.0
