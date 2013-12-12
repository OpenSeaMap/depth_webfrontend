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

OSeaM.models.Vessels = Backbone.Collection.extend({
    model: OSeaM.models.Vessel,
    url: OSeaM.apiUrl + 'vesselconfig',
    parse: function(response) {
    	var vessels = new Array();
        for (var i = 0; i < response.length; i++) {
        	var responseObject = response[i];
        	
        	var newsbasoffset = new OSeaM.models.Offset();  
        	var x = responseObject.sbasoffset;
        	newsbasoffset.set('distanceFromStern', x['distanceFromStern']);
        	newsbasoffset.set('distanceFromCenter', x['distanceFromCenter']);
        	newsbasoffset.set('distanceWaterline', x['distanceWaterline']);

        	var newdepthoffset = new OSeaM.models.Offset();  
        	var y = responseObject.depthoffset;
        	newdepthoffset.set('distanceFromStern', y['distanceFromStern']);
        	newdepthoffset.set('distanceFromCenter', y['distanceFromCenter']);
        	newdepthoffset.set('distanceWaterline', y['distanceWaterline']);
        	
        	var vessel = new OSeaM.models.Vessel({
                id       : responseObject.id,
                name : responseObject.name,
                description : responseObject.description,
                manufacturer : responseObject.manufacturer,
                model : responseObject.model,
                loa : responseObject.loa,
                breadth : responseObject.breadth,
                draft : responseObject.draft,
                height : responseObject.height,
                displacement : responseObject.displacement,
                maximumspeed : responseObject.maximumspeed,
                sbasoffset : newsbasoffset,
                depthoffset : newdepthoffset
            });
        	vessels[i] = vessel;
        }
    	return vessels;
    }
});
