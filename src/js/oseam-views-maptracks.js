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
    mapEventMove: function (view) {
        var fn = function(data) {
//            this.attributionControl.updateAttribution();
            this.layerBase.attribution = 'Data CC-By-SA by <a href="http://openstreetmap.org/">OpenStreetMap</a>',
            this.layerTrackPoints10.attribution = data;
            this.layerTrackPoints.attribution = data;
            this.attributionControl.draw();
//            this.attributionControl = new OpenLayers.Control.Attribution();
            this.attributionControl.updateAttribution();
        };
        if(this.map != null) {
        var bounds = this.map.getExtent().toArray();
        var b = this.y2lat(bounds[1]).toFixed(5);
        var t = this.y2lat(bounds[3]).toFixed(5);
        var l = this.x2lon(bounds[0]).toFixed(5);
        var r = this.x2lon(bounds[2]).toFixed(5);
        
        jQuery.ajax({
            type: 'GET',
            url: OSeaM.apiUrl + 'license/bbox?lat1=' + b + '&lon1=' + l + '&lat2=' + t + '&lon2=' + r  ,
            dataType: 'text',
            success: jQuery.proxy(fn, this)
        });
            
        }

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
//        	events: {
//        		moveend     : this.mapEventMove(this),
//        		zoomend     : this.mapEventMove(this)
//        	},
            units: 'meters'
        });

 
        this.layerBase = new OpenLayers.Layer.XYZ('OpenStreetMap', [
                'http://a.tile.openstreetmap.org/${z}/${x}/${y}.png',
                'http://b.tile.openstreetmap.org/${z}/${x}/${y}.png',
                'http://c.tile.openstreetmap.org/${z}/${x}/${y}.png'], {
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
        this.layerTrackPoints = new OpenLayers.Layer.WMS('100m',
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
        this.layerTrackPoints10 = new OpenLayers.Layer.WMS('10m',
                'http:///osm.franken.de/cgi-bin/mapserv.fcgi?', {
                    layers: 'trackpoints_cor1_test_dbs_10,trackpoints_cor1_test_10,test_zoom_10_cor_1_points_10,test_zoom_9_cor_1_points_10,test_zoom_8_cor_1_points_10,test_zoom_7_cor_1_points_10,test_zoom_6_cor_1_points_10,test_zoom_5_cor_1_points_10,test_zoom_4_cor_1_points_10,test_zoom_3_cor_1_points_10,test_zoom_2_cor_1_points_10',
                    numZoomLevels: 22,
                    projection: this.projectionMercator,
                    type: 'png',
                    transparent: true
                },{
                    isBaseLayer: false,
                    tileSize: new OpenLayers.Size(1024,1024),
                    visibility : false
                }
            );
        this.layerTrackPoints_filter1 = new OpenLayers.Layer.WMS('100m Filter 1',
                'http:///osm.franken.de/cgi-bin/mapserv.fcgi?', {
                    layers: 'trackpoints_filter1_0,trackpoints_filter1_1',
                    numZoomLevels: 22,
                    projection: this.projectionMercator,
                    type: 'png',
                    transparent: true
                },{
                    isBaseLayer: false,
                    tileSize: new OpenLayers.Size(1024,1024),
                visibility : false
                }
            );
//            this.layerTrackPoints10_filter1 = new OpenLayers.Layer.WMS('10m Filter 1',
//                    'http:///osm.franken.de/cgi-bin/mapserv.fcgi?', {
//                        layers: 'trackpoints_cor1_test_dbs_10,trackpoints_cor1_test_10,test_zoom_10_cor_1_points_10,test_zoom_9_cor_1_points_10,test_zoom_8_cor_1_points_10,test_zoom_7_cor_1_points_10,test_zoom_6_cor_1_points_10,test_zoom_5_cor_1_points_10,test_zoom_4_cor_1_points_10,test_zoom_3_cor_1_points_10,test_zoom_2_cor_1_points_10',
//                        numZoomLevels: 22,
//                        projection: this.projectionMercator,
//                        type: 'png',
//                        transparent: true
//                    },{
//                        isBaseLayer: false,
//                        tileSize: new OpenLayers.Size(1024,1024),
//                        visibility : false
//                    }
//                );
            this.layerTrackPoints_filter2 = new OpenLayers.Layer.WMS('100m Filter 2',
                    'http:///osm.franken.de/cgi-bin/mapserv.fcgi?', {
                        layers: 'trackpoints_filter2_0,trackpoints_filter2_1',
                        numZoomLevels: 22,
                        projection: this.projectionMercator,
                        type: 'png',
                        transparent: true
                    },{
                        isBaseLayer: false,
                        tileSize: new OpenLayers.Size(1024,1024),
                    	visibility : false
                    }
                );
//             this.layerTrackPoints10_filter2 = new OpenLayers.Layer.WMS('10m Filter 2',
//                        'http:///osm.franken.de/cgi-bin/mapserv.fcgi?', {
//                            layers: 'trackpoints_cor1_test_dbs_10,trackpoints_cor1_test_10,test_zoom_10_cor_1_points_10,test_zoom_9_cor_1_points_10,test_zoom_8_cor_1_points_10,test_zoom_7_cor_1_points_10,test_zoom_6_cor_1_points_10,test_zoom_5_cor_1_points_10,test_zoom_4_cor_1_points_10,test_zoom_3_cor_1_points_10,test_zoom_2_cor_1_points_10',
//                            numZoomLevels: 22,
//                            projection: this.projectionMercator,
//                            type: 'png',
//                            transparent: true
//                        },{
//                            isBaseLayer: false,
//                            tileSize: new OpenLayers.Size(1024,1024),
//                            visibility : false
//                        }
//                    );
         this.triangulation = new OpenLayers.Layer.WMS("Triangulation",
                    "http://osm.franken.de/cgi-bin/mapserv.fcgi?", {
        	 			layers: ['triangulation'], 
        	 			projection: new OpenLayers.Projection("EPSG:900913"), 
        	 			type: 'png', 
        	 			transparent: true
        	 		}, {
        	 			visibility: false, 
        	 			isBaseLayer: false, 
        	 			tileSize: new OpenLayers.Size(1024,1024)
        	 		});
         
         this.msl2lat = new OpenLayers.Layer.WMS("Mean Sea Level to LAT Difference",
                 "http://osm.franken.de/cgi-bin/mapserv.fcgi", {
        	 			layers: "lat", 
        	 			projection: new OpenLayers.Projection("EPSG:900913"), 
        	 			type: 'png', 
        	 			transparent: true
        	 	  },{
        	 		  visibility: false, 
        	 		  isBaseLayer: false, 
        	 		  tileSize: new OpenLayers.Size(1024,1024)
        	 	  });
        this.layerContours = new OpenLayers.Layer.WMS("Contours",
                'http:///osm.franken.de/cgi-bin/mapserv.fcgi?', {
            layers: ['contour','contour2'],
            numZoomLevels: 22,
            projection: this.projectionMercator,
            type: 'png',
            
            transparent: true
        },{
            isBaseLayer: false,
            tileSize: new OpenLayers.Size(1024,1024),
            visibility : true
        }
    );

        
        this.map.addLayers([
            this.layerBase,
            this.triangulation,
            this.layerTrackPoints,
            this.layerTrackPoints10,
            this.layerTrackPoints_filter1,
            this.layerTrackPoints_filter2,
            this.layerContours,
            this.msl2lat
        ]);
        this.attributionControl = new OpenLayers.Control.Attribution();
        this.map.addControls([
            this.attributionControl,
            new OpenLayers.Control.KeyboardDefaults(),
            new OpenLayers.Control.LayerSwitcher(),
            new OpenLayers.Control.MousePosition()
        ]);
        this.map.setCenter(new OpenLayers.LonLat(0.0, 40.0).transform(
            this.projectionWGS84,
            this.projectionMercator
          ), 3
        );
        this.map.events.register( 'moveend', this, this.mapEventMove);
        
        this.mapEventMove(this);
    },
    plusfacteur : function (a) {
        return a * (20037508.34 / 180);
    },

    moinsfacteur: function (a) {
        return a / (20037508.34 / 180);
    },

    y2lat: function (a) {
        return 180/Math.PI * (2 * Math.atan(Math.exp(this.moinsfacteur(a)*Math.PI/180)) - Math.PI/2);
    },

    lat2y: function (a) {
        return this.plusfacteur(180/Math.PI * Math.log(Math.tan(Math.PI/4+a*(Math.PI/180)/2)));
    },

    x2lon: function (a) {
        return this.moinsfacteur(a);
    },

    lon2x: function (a) {
        return this.plusfacteur(a);
    }
});
