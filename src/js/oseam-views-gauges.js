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
    events: {
        'click .oseam-add' : 'addNewGauge',
    },
	initialize: function() {
        OSeaM.frontend.on('change:language', this.render, this);			//RKu: added, as this function was simply missing
		this.listenTo(this.collection, 'reset', this.refreshGauges);
		this.render();
		this.collection.fetch();
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
    addNewGauge: function(evt) {
    	var gauge = new OSeaM.models.Gauge();
    	view = new OSeaM.views.GaugeDialog({
    		el: this.$el,
    		model : gauge,
    		collection : this.collection
    	});
    	view.render().modal('show');
    },
    initOpenLayers: function() {
    	var self = this;

        this.projectionWGS84    = new OpenLayers.Projection('EPSG:4326');
        this.projectionMercator = new OpenLayers.Projection('EPSG:900913');
        this.maxExtent          = new OpenLayers.Bounds(-180, -89, 180, 89).transform(
                                          this.projectionWGS84,
                                          this.projectionMercator
                                      );

 
        this.layerBase = new OpenLayers.Layer.XYZ('OpenStreetMap',[
                 'http://a.tile.openstreetmap.org/${z}/${x}/${y}.png',
                 'http://b.tile.openstreetmap.org/${z}/${x}/${y}.png',
                 'http://c.tile.openstreetmap.org/${z}/${x}/${y}.png'], {
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
            projection: wgs84
//            ,
//            strategies: [new OpenLayers.Strategy.Fixed()]
        });
        
        this.map = new OpenLayers.Map(this.$el.find('.oseam-map-tracks')[0], {
//        	eventListeners: {
//                moveend     : this.mapEventMove(self)
//            },
            projection: this.projectionMercator,
            displayProjection: this.projectionWGS84,
            maxExtent: this.maxExtent,
            numZoomLevels: 22,
            maxResolution: 156543.0399,
            units: 'meters'
        });

        this.map.addLayers([
            this.layerBase,
            this.layerGaugeVector
        ]);
        this.map.addControls([
        	new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.MousePosition()
        ]);
        this.map.setCenter(new OpenLayers.LonLat(0.0, 40.0).transform(
            this.projectionWGS84,
            this.projectionMercator
          ), 3
        );
		this.layerGaugeVector.events.on({
                'featureselected': function(feature) {
                	// shows the details view
				    this.detailView = new OSeaM.views.Gauge({ model: feature.feature.data.model });
          			$("#detail").append(this.detailView.render().el);
                },
                'featureunselected': function(feature) {
                	// removes the details view
					$("#detail").empty();
                }
            });

		// this makes the gauge selectable
		var sf = new OpenLayers.Control.SelectFeature( this.layerGaugeVector);
		this.map.addControl(sf);
		sf.activate();

    },
    mapEventMove: function (event, collection) {
//        // Set cookie for remembering lat lon values
//        setCookie("lat", y2lat(map.getCenter().lat).toFixed(5));
//        setCookie("lon", x2lon(map.getCenter().lon).toFixed(5));
        // Update tidal scale layer
    	event.collection.fetch(this.layerGaugeVector);
    },
    // show a gauge icon for each view in the map
    refreshGauges: function (event) {
		this.layerGaugeVector.removeAllFeatures();
        var layer_poi_icon_style = OpenLayers.Util.extend({});
		for(var i=0; i<event.models.length; i++) {
	        layer_poi_icon_style.externalGraphic = './images/tidal_scale_24.png';
	        layer_poi_icon_style.graphicWidth = 24;
	        layer_poi_icon_style.graphicHeight = 24;
	        this.layerGaugeVector.addFeatures([new OpenLayers.Feature.Vector(
				new OpenLayers.Geometry.Point(
					this.lon2x(event.models[i].get('longitude')), 
					this.lat2y(event.models[i].get('latitude'))
					),
					{
						model: event.models[i],
						view : this
					} ,
					layer_poi_icon_style
				)]);
		}
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
    
