===============
Leaflet.Deflate
===============

.. image:: https://travis-ci.org/oliverroick/Leaflet.Deflate.svg
    :target: https://travis-ci.org/oliverroick/Leaflet.Deflate

Extends `Leaflet.Map <http://leafletjs.com/reference.html#map-class>`_ to automatically substitute polygons and lines with markers when their screen size falls below a defined threshold.

.. image:: https://cloud.githubusercontent.com/assets/159510/7164588/090c06fe-e399-11e4-956d-0283ef7e69cf.gif

Usage
=====

Initialize with the `minSize` option and add to map. `minSize` defines the minimum width and height in pixels for a Path to be displayed in its actual shape. It defaults to `20`.

.. code-block:: javascript

    var map = L.map("map");
    L.Deflate({minSize: 10}).addTo(map);

FeatureGroup
------------

You can apply deflating to one `FeatureGroup`—only features inside that feature group will be affected by `Leaflet.Deflate`. 

.. code-block:: javascript

    var map = L.map("map");

    var featureGroup = L.featureGroup().addTo(map)
    L.Deflate({minSize: 10, featureGroup: featureGroup}).addTo(map);

    // The polygon will be deflated
    var polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ]);
    featureGroup.addLayer(polygon);

    // The circle will NOT be deflated
    var circle = L.circle([51.508, -0.11], 500).addTo(map);



Developing
==========

You'll need to install the dev dependencies to test and write the distribution file.

.. code-block::

    npm install
    
To run tests:

.. code-block::

    gulp test
    
To write a minified JS into dist:

.. code-block::

    gulp dist

Author
======

`Oliver Roick <http://github.com/oliverroick>`_

License
=======

Apache 2.0
