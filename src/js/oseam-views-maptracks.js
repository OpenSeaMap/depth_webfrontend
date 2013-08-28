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
            numZoomLevels: 22,
            maxResolution: 156543.0399,
            units: 'meters'
        });

        this.layerBase = new OpenLayers.Layer.XYZ('OpenStreetMap',
            'http://osm1.wtnet.de/tiles/base/${z}/${x}/${y}.png', {
                attribution: 'Data CC-By-SA by <a href="http://openstreetmap.org/">OpenStreetMap</a>',
                resolutions: [
                    156543.03390625, 78271.516953125, 39135.7584765625,
                    19567.87923828125, 9783.939619140625, 4891.9698095703125,
                    2445.9849047851562, 1222.9924523925781, 611.4962261962891,
                    305.74811309814453, 152.87405654907226, 76.43702827453613,
                    38.218514137268066, 19.109257068634033, 9.554628534317017,
                    4.777314267158508, 2.388657133579254, 1.194328566789627,
                    0.5971642833948135, 0.25, 0.1, 0.05
                ],
                serverResolutions: [
                    156543.03390625, 78271.516953125, 39135.7584765625,
                    19567.87923828125, 9783.939619140625, 4891.9698095703125,
                    2445.9849047851562, 1222.9924523925781, 611.4962261962891,
                    305.74811309814453, 152.87405654907226, 76.43702827453613,
                    38.218514137268066, 19.109257068634033, 9.554628534317017,
                    4.777314267158508, 2.388657133579254, 1.194328566789627,
                    0.5971642833948135
                ],
                transitionEffect: 'resize',
                sphericalMercator: true
            }
        );
        this.layerTrackPoints = new OpenLayers.Layer.WMS('Track Points',
            'http:///osm.franken.de/cgi-bin/mapserv.fcgi?', {
                layers: 'trackpoints_cor1_test_dbs,trackpoints_cor1_test,test_zoom_10_cor_1_points,test_zoom_9_cor_1_points,test_zoom_8_cor_1_points,test_zoom_7_cor_1_points,test_zoom_6_cor_1_points,test_zoom_5_cor_1_points,test_zoom_4_cor_1_points,test_zoom_3_cor_1_points,test_zoom_2_cor_1_points',
                numZoomLevels: 22,
                projection: this.projectionMercator,
                type: 'png',
                transparent: true
            },{
                isBaseLayer: false,
                tileSize: new OpenLayers.Size(1024,1024)
            }
        );

        this.map.addLayers([
            this.layerBase,
            this.layerTrackPoints
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
    }
});
