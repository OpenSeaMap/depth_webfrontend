// -------------------------------------------------------------------------------------------------
// OpenSeaMap Water Depth - Web frontend for depth data handling.
//
// Written in 2013 by Dominik Fässler dfa@bezono.org
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain
// worldwide. This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along
// with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
// -------------------------------------------------------------------------------------------------

OSeaM.views.GaugeMeasurement = OSeaM.View.extend({
    tagName: 'tr',
    events: {
        'click .icon-trash' : 'onDelete'
    },
    initialize: function() {
        this.model.on('change:id',       this.render,           this);
    },
    render: function() {
        var template = OSeaM.loadTemplate('gaugemeasurement');
        var dateX = new Date(this.model.get('timestamp'));
        var content = $(template({
        	date : dateX.getUTCFullYear() +"-"+
            ("0" + (dateX.getMonth()+1)).slice(-2) +"-"+
            ("0" + dateX.getDate()).slice(-2) + " " +
            ("0" + dateX.getHours()).slice(-2) + ":" +
            ("0" + dateX.getMinutes()).slice(-2),
        	value : this.model.get('value')
        }));
        OSeaM.frontend.translate(content);
        this.$el.html(content);
        return this;
    },
    onDelete: function() {
    	if(confirm('Do you really want to delete that value ?')) {
    		this.model.destroy();
    	}
    }
});