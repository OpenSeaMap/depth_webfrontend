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


// this views shows the list of vessels given by the model. 
// provides a dialog for editing vessels
OSeaM.views.Vessels = OSeaM.View.extend({
    modalDialog:null,
    events: {
        'click .oseam-add' : 'addNewVessel'
    },
    // initialized with the collections of vessels via constructor
    initialize: function() {
	 OSeaM.frontend.on('change:language', this.render, this);
	 // a vessel is added to the collection
     this.collection.on('add', this.onAddItem, this);
	 // a vessel is added to the collection
     this.collection.on('remove', this.onRemoveItem, this);

     // stores the item views for this view
     this._vesselviews = []; 

    },
    // translates the page and attaches listener for added vessels
    render: function() {
        var language = OSeaM.frontend.getLanguage();
        var template = OSeaM.loadTemplate('vessels-' + language);
        var content = $(template());
        OSeaM.frontend.translate(content);
        this.$el.html(content);
        this.listEl = this.$el.find('tbody');
        
        this.collection.forEach(this.onAddItem, this);
        this.collection.fetch();
        return this;
    },
    // listner for button push on adding new vessels. shows the dialog modal
    addNewVessel: function(evt) {
        if (this.modalDialog) {
            return;
        }
	    view = new OSeaM.views.Vessel({
	        el: this.$el,
	        model : new OSeaM.models.Vessel(),
	    	collection : this.collection
	    });
	    this.modalDialog = view.render();
	    this.modalDialog.modal('show');
    },
    // adds this item to the list views, if the model collection adds a vessel
    onAddItem: function(model) {
    	// a new vessel item is added and the appropriate view is added and rendered
        var vesselview = new OSeaM.views.Vesselitem({
            model: model
        });
        // Adding project item view to the list
        this._vesselviews.push(vesselview);

        this.listEl.append(vesselview.render().el);
        return this;
    },
    // remove the view from being rendered
    onRemoveItem: function(model) {
    	// a vessel item is removed and the appropriate view is added and rendered
        var view = _(this._vesselviews).select(function(cv) { return cv.model === model; })[0];
        $(view.el).remove();
        return this;
    }
});