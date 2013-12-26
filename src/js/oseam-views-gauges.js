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

OSeaM.views.Gauges = OSeaM.View.extend({
	initialize: function() {
		this.listenTo(this.collection, 'reset', this.refreshGauges);
	},
	render: function() {
		var language = OSeaM.frontend.getLanguage();
		var template = OSeaM.loadTemplate('gauges-' + language);
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
        	eventListeners: {
                moveend     : this.mapEventMove
            },
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
        var wgs84 = new OpenLayers.Projection("EPSG:4326");
        this.layerGaugeVector = new OpenLayers.Layer.Vector("Gauges", {
            style: {
                strokeColor: "blue",
                strokeWidth: 3,
                cursor: "pointer"
            },
            projection: wgs84,
            strategies: [new OpenLayers.Strategy.Fixed()]
        });
        
        this.layerGauge = new OpenLayers.Layer.WMS('Gauge',
            'http:///osm.franken.de/cgi-bin/mapserv.fcgi?', {
                layers: 'gauge',
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
            this.layerGaugeVector
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
    mapEventMove: function (event) {
//        // Set cookie for remembering lat lon values
//        setCookie("lat", y2lat(map.getCenter().lat).toFixed(5));
//        setCookie("lon", x2lon(map.getCenter().lon).toFixed(5));
        // Update tidal scale layer
    	this.collection.fetch();
    },
    refreshGauges: function (event) {
        var layer_poi_icon_style = OpenLayers.Util.extend({});
        var gaugePoint = new OpenLayers.Geometry.Point(x, y);

        layer_poi_icon_style.externalGraphic = './images/tidal_scale_24.png';
        layer_poi_icon_style.graphicWidth = 24;
        layer_poi_icon_style.graphicHeight = 24;
        var pointFeature = new OpenLayers.Feature.Vector(gaugePoint, null, layer_poi_icon_style);
        this.layerGaugeVector.addFeatures([pointFeature]);
    },
    plusfacteur : function (a) {
        return a * (20037508.34 / 180);
    },

    moinsfacteur: function (a) {
        return a / (20037508.34 / 180);
    },

    y2lat: function (a) {
        return 180/Math.PI * (2 * Math.atan(Math.exp(moinsfacteur(a)*Math.PI/180)) - Math.PI/2);
    },

    lat2y: function (a) {
        return plusfacteur(180/Math.PI * Math.log(Math.tan(Math.PI/4+a*(Math.PI/180)/2)));
    },

    x2lon: function (a) {
        return moinsfacteur(a);
    },

    lon2x: function (a) {
        return plusfacteur(a);
    }
});
    
