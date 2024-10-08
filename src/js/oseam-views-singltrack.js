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

class SingleTrackController
{
	constructor()
	{
		var track_id = parseInt( new URLSearchParams( window.location.search ).get( "track_id" ) );
		console.log( "track_id %d", track_id );
		if ( isNaN( track_id ) )
			this.trackId = 0;
		else
			this.trackId = track_id;
		
		var lat = parseFloat( new URLSearchParams( window.location.search ).get( "lat" ) );
		console.log( "lat %d", lat );
		if ( isNaN( lat ) )
			this.lat = 40;
		else
			this.lat = lat;
		
		var lon = parseFloat( new URLSearchParams( window.location.search ).get( "lon" ) );
		console.log( "lon %d", lon );
		if ( isNaN( lon ) )
			this.lon = 0;
		else
			this.lon = lon;
		
		var zoom = parseInt( new URLSearchParams( window.location.search ).get( "zoom" ) );
		console.log( "zoom %d", zoom );
		if ( isNaN( zoom ) )
			this.zoom = 3;
		else
			this.zoom = zoom;
		
		console.log( "lat %f lon %f", this.lat, this.lon, this.zoom );
		
	}
	
    mapEventMove( view ) 
	{
        var fn = function(data) 
		{
//            this.attributionControl.updateAttribution();
            this.layerBase.attribution = 'Data CC-By-SA by <a href="http://openstreetmap.org/">OpenStreetMap</a>',
            this.layerTrackPoints10.attribution = data;
            this.layerTrackPoints.attribution = data;
            this.layerTrackPointsSingle10.attribution = data;
            this.layerTrackPointsSingle100.attribution = data;
            this.layerTrackPointsMerged10.attribution = data;
            this.layerTrackPointsMerged100.attribution = data;
            this.layerTrackPointsTemp100.attribution = data;
            this.attributionControl.draw();
//            this.attributionControl = new OpenLayers.Control.Attribution();
            this.attributionControl.updateAttribution();
        };
		
		/*
        if( this.map != null ) 
		{
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
		*/
	}

    initOpenLayers() 
	{
        this.projectionWGS84    = new OpenLayers.Projection('EPSG:4326');
        this.projectionMercator = new OpenLayers.Projection('EPSG:900913');
        this.maxExtent          = new OpenLayers.Bounds(-180, -89, 180, 89).transform(
                                          this.projectionWGS84,
                                          this.projectionMercator
                                      );

        this.map = new OpenLayers.Map( document.getElementById( "map" ), {
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
                    0.5971642833948135, 0.2985821416974060, 0.1492910708487030, 0.0746455354243516
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
 
        this.layerTrackPointsSingle100 = new OpenLayers.Layer.WMS('100m',
            'https://depth.openseamap.org/geoserver/openseamap/wms', {
                layers: 'openseamap:trackpoints_single_track_100',
                numZoomLevels: 20,
                projection: this.projectionMercator,
                type: 'png',
                transparent: true,
				CQL_FILTER: 'track_id="'+this.trackId+'"'
				
            },{
                isBaseLayer: false,
                tileSize: new OpenLayers.Size(1024,1024),
                visibility : false
            }
        );

        this.layerTrackPointsSingle10 = new OpenLayers.Layer.WMS('10m',
            'https://depth.openseamap.org/geoserver/openseamap/wms', {
                layers: 'openseamap:trackpoints_single_track_10',
                numZoomLevels: 20,
                projection: this.projectionMercator,
                type: 'png',
                transparent: true,
				CQL_FILTER: 'track_id="'+this.trackId+'"'
				
            },{
                isBaseLayer: false,
                tileSize: new OpenLayers.Size(1024,1024),
                visibility : false
            }
        );
 
        this.map.addLayers([
            this.layerBase,
			this.layerTrackPointsSingle100,
			this.layerTrackPointsSingle10
			//this.layerTrackPointsMerged100,
			//this.layerTrackPointsMerged10,
            //this.triangulation,
            //this.layerTrackPoints,
            //this.layerTrackPoints10,
            //this.layerTrackPoints_filter1,
            //this.layerTrackPoints_filter2,
            //this.layerContours,
            //this.msl2lat
        ]);
        this.attributionControl = new OpenLayers.Control.Attribution();
        this.map.addControls([
            this.attributionControl,
            new OpenLayers.Control.KeyboardDefaults(),
            new OpenLayers.Control.LayerSwitcher(),
            new OpenLayers.Control.MousePosition(),
            new OpenLayers.Control.Scale(),
            new OpenLayers.Control.Permalink()
        ]);
        this.map.setCenter(new OpenLayers.LonLat( this.lon, this.lat ).transform(
            this.projectionWGS84,
            this.projectionMercator
          ), this.zoom
        );
        this.map.events.register( 'moveend', this, this.mapEventMove);
        
        this.mapEventMove(this);
    }
	
    plusfacteur (a) {
        return a * (20037508.34 / 180);
    }

    moinsfacteur (a) {
        return a / (20037508.34 / 180);
    }

    y2lat (a) {
        return 180/Math.PI * (2 * Math.atan(Math.exp(this.moinsfacteur(a)*Math.PI/180)) - Math.PI/2);
    }

    lat2y (a) {
        return this.plusfacteur(180/Math.PI * Math.log(Math.tan(Math.PI/4+a*(Math.PI/180)/2)));
    }

    x2lon (a) {
        return this.moinsfacteur(a);
    }

    lon2x (a) {
        return this.plusfacteur(a);
    }
}

