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

OSeaM.models.Tracks = Backbone.Collection.extend({
    model: OSeaM.models.Track,
    url: OSeaM.apiUrl + '/track/getall',
    uploadFile: function(file) {
        var track = new OSeaM.models.Track();
        this.add(track);
        track.uploadFile(file);
    },
    parse: function(response) {
        for (var i = 0; i < response.length; i++) {
            this.add({
                id       : response[i][0],
                fileName : response[i][1],
                status   : response[i][2]
            });
        }
    }
});
