===============
Leaflet.Deflate
===============

.. image:: https://travis-ci.org/oliverroick/Leaflet.Deflate.svg
    :target: https://travis-ci.org/oliverroick/Leaflet.Deflate

Extends `Leaflet.Map <http://leafletjs.com/reference.html#map-class>`_ to automatically substitute polygons and lines with markers when their screen size falls below a defined threshold.

.. image:: https://cloud.githubusercontent.com/assets/159510/7164588/090c06fe-e399-11e4-956d-0283ef7e69cf.gif

Usage
=====

Initialize along with the `minSize`. `minSize` defines the minimum width and height in pixels for a Path to be displayed in its actual shape.

.. code-block:: javascript

    var map = L.map("map");
    L.Deflate(map, {minSize: 20});

All options and methods from Leaflet.Map are inherited.

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
