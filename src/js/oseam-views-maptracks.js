// -------------------------------------------------------------------------------------------------
// OpenSeaMap Water Depth - Web frontend for depth data handling.
//
// Written in 2012 by Dominik Fässler dfa@bezono.org
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain
// worldwide. This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along
// with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
// -------------------------------------------------------------------------------------------------

OSeaM.views.MapTracks = OSeaM.View.extend({
    render: function() {
        var template = OSeaM.loadTemplate('maptracks');
        var content = $(template());
        OSeaM.frontend.translate(content);
        this.$el.html(content);
        this.initOpenLayers();
        return this;
    },
    initOpenLayers: function() {

        this.projectionWGS84    = new OpenLayers.Projection('EPSG:4326');
        this.projectionMercator = new OpenLayers.Projection('EPSG:900913');
        this.maxExtent          = new OpenLayers.Bounds(-180, -89, 180, 89).transform(
                                          this.projectionWGS84,
                                          this.projectionMercator
                                      );

        this.map = new OpenLayers.Map(this.$el.find('.oseam-map-tracks')[0], {
            projection: this.projectionMercator,
            displayProjection: this.projectionWGS84,
			maxExtent: this.maxExtent,
			numZoomLevels: 19,
            maxResolution: 156543.0399,
			units: 'meters'
        });

        this.layerBase = new OpenLayers.Layer.XYZ('OpenStreetMap',
            'http://osm1.wtnet.de/tiles/base/${z}/${x}/${y}.png', {
                attribution: 'Data CC-By-SA by <a href="http://openstreetmap.org/">OpenStreetMap</a>',
                numZoomLevels: 19,
                sphericalMercator: true
            }
        );
        this.layerTrackPoints = new OpenLayers.Layer.WMS('Track Points',
            'http:///osm.franken.de:8080/geoserver/wms', {
                layers: 'gebco:trackpoints_cor1',
                projection: this.projectionMercator,
                type: 'png',
                transparent: true
            },{
                isBaseLayer: false,
                maxResolution: 76.44
            }
        );
        this.layerZoom10 = this.createLayer('Zoom 10', 'gebco:zoom_10_cor_1_points',    76.44,   152.88);
        this.layerZoom9  = this.createLayer('Zoom 9',  'gebco:zoom_9_cor_1_points',    152.88,   305.75);
        this.layerZoom8  = this.createLayer('Zoom 8',  'gebco:zoom_8_cor_1_points',    305.75,   611.50);
        this.layerZoom7  = this.createLayer('Zoom 7',  'gebco:zoom_7_cor_1_points',    611.50,  1223.00);
        this.layerZoom6  = this.createLayer('Zoom 6',  'gebco:zoom_6_cor_1_points',   1223.00,  2446.00);
        this.layerZoom5  = this.createLayer('Zoom 5',  'gebco:zoom_5_cor_1_points',   2446.00,  4892.00);
        this.layerZoom4  = this.createLayer('Zoom 4',  'gebco:zoom_4_cor_1_points',   4892.00,  9784.00);
        this.layerZoom3  = this.createLayer('Zoom 3',  'gebco:zoom_3_cor_1_points',   9784.00, 19568.00);
        this.layerZoom2  = this.createLayer('Zoom 2',  'gebco:zoom_2_cor_1_points',  19568.00, 39136.00);

        this.map.addLayers([
            this.layerBase,
            this.layerTrackPoints,
            this.layerZoom2,
            this.layerZoom3,
            this.layerZoom4,
            this.layerZoom5,
            this.layerZoom6,
            this.layerZoom7,
            this.layerZoom8,
            this.layerZoom9,
            this.layerZoom10
        ]);
        this.map.addControls([
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.KeyboardDefaults()
        ]);
        this.map.setCenter(new OpenLayers.LonLat(0.0, 40.0).transform(
            this.projectionWGS84,
            this.projectionMercator
          ), 3
        );
    },
    createLayer: function(name, layerName, minResolution, maxResolution) {
        layer = new OpenLayers.Layer.WMS(name,
            'http:///osm.franken.de:8080/geoserver/wms', {
                layers: layerName,
                projection: this.projectionWGS84,
                type: 'png',
                transparent: true
            },{
                isBaseLayer: false,
                minResolution: minResolution,
                maxResolution: maxResolution
            }
        );
        return layer;
    }
});
