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

OSeaM.views.gpspage = OSeaM.View.extend({
    modalDialog:null,
    render: function() {
        var template = OSeaM.loadTemplate('gpsoffset');
        var content = $(template());
        OSeaM.frontend.translate(content);
        this.$el.html(content);
        return this;
    },
    validate: function() {
    	return true;
    }
});