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

OSeaM.models.Licenses = Backbone.Collection.extend({
    model: OSeaM.models.License,
    url: OSeaM.apiUrl + 'license',
    parse: function(response) {
    	var licenses = new Array();
        for (var i = 0; i < response.length; i++) {
        	var responseObject = response[i];
        	var license = new OSeaM.models.License({
                id       : responseObject.id,
                name : responseObject.name,
                shortName : responseObject.shortName,
                text : responseObject.text
            });
        	licenses[i] = license;
        }
        return licenses;
    }
});
