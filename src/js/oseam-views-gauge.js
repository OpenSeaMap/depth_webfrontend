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

OSeaM.views.Gauge = OSeaM.View.extend({
    events: {
        'click .icon-trash' : 'onDelete'
    },
    initialize: function() {
		this._views = [];
        this.model.on('change:id',       this.render,           this);
		this.gaugemeasurements = new OSeaM.models.GaugeMeasurements();
		this.gaugemeasurements.url = OSeaM.apiUrl + 'gauge/' + this.model.get('id') + '/measurement';
       this.listenTo(this.gaugemeasurements, 'reset', this.addAndRenderViews);
       this.gaugemeasurements.fetch({wait:true});

    },
    render: function() {
        var template = OSeaM.loadTemplate('gauge');
        var content = $(template({
            id : this.model.get('id'),
            name : this.model.get('name'),
            gaugeType : this.model.get('gaugeType'),
            latitude : this.model.get('latitude'),
            longitude : this.model.get('longitude'),
            waterlevel : this.model.get('waterlevel')
        }));
        OSeaM.frontend.translate(content);
        this.$el.html(content);
		this.renderContent();
        return this;
    },
	addAndRenderViews : function() {
		this.addViews();
	    this.render();
	},
	addViews : function() {
	 this.listEl.empty();
	 var self = this;
	    this.gaugemeasurements.each(function(model) {
	    	self._views.push(new OSeaM.views.GaugeMeasurement({
				model : model
			}));
	      });
	},
    onDelete: function() {
    	this.model.destroy();
    },
	onAddItem : function(model) {
		var view = new OSeaM.views.GaugeMeasurement({
			model : model
		});
        this._views.push(view);
		
		this.listEl.append(view.render().el);
		return this;
	},
    onRemoveItem: function(model) {
        var view = _(this._views).select(function(cv) { 
        	return cv.model === model; })[0];
        $(view.el).remove();
        return this;
    },
	renderContent : function() {
		this.listEl = this.$el.find('tbody');
		this.listEl.empty();
		var container = document.createDocumentFragment();
		
		_.each(this._views, function(subview) {
		    container.appendChild(subview.render().el)
		  });
		 this.listEl.append(container);
	}
});