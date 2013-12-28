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

OSeaM.views.Vesselitem = OSeaM.View.extend({
    tagName: 'tr',
    events: {
        'click .icon-trash' : 'onDelete',
        'dblclick .vessel': 'edit',
        'click .icon-pencil' : 'edit'
    },
    initialize: function() {
        this.model.on('change:id',       this.render,           this);
    },
    render: function() {
        var template = OSeaM.loadTemplate('vesselitem');
        var content = $(template({
            id : this.model.get('id'),
            name : this.model.get('name'),
            description : this.model.get('description')
        }));
        OSeaM.frontend.translate(content);
        this.$el.html(content);
        return this;
    },
    edit: function(model) {
    	view = new OSeaM.views.Vessel({
	        el: this.$el,
	        model: this.model	
	    });
	    view.render().modal('show');

    },
    onDelete: function() {
    	this.model.destroy();
    }
});