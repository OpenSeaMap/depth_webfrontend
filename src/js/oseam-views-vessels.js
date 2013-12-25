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
        'click .oseam-add' : 'addNewVessel',
			"click th": "headerClick"
    },
    sortUpIcon: 'icon-arrow-up',
    sortDnIcon: 'icon-arrow-down',
    // initialized with the collections of vessels via constructor
    initialize: function() {
	 OSeaM.frontend.on('change:language', this.render, this);
	 // a vessel is added to the collection
	 this.listenTo(this.collection, 'reset', this.render);
//	 this.listenTo(this.collection, 'sort', this.render);

     this.collection.on('add', this.onAddItem, this);
	 // a vessel is added to the collection
     this.collection.on('remove', this.onRemoveItem, this);

     // stores the item views for this view
     this._vesselviews = []; 
     this.collection.fetch();

    },
    // translates the page and attaches listener for added vessels
    render: function() {
        var language = OSeaM.frontend.getLanguage();
        var template = OSeaM.loadTemplate('vessels-' + language);
        var content = $(template());
        this._vesselviews = []; 
        OSeaM.frontend.translate(content);
        this.$el.html(content);
        this.listEl = this.$el.find('tbody');
        
        this.collection.forEach(this.onAddItem, this);
        return this;
    },
    // listner for button push on adding new vessels. shows the dialog modal
    addNewVessel: function(evt) {
    	var vessel = new OSeaM.models.Vessel();
    	vessel.sbasoffset = new OSeaM.models.Offset();
    	vessel.depthoffset = new OSeaM.models.Offset();
    	view = new OSeaM.views.Vessel({
    		el: this.$el,
    		model : vessel,
    		collection : this.collection
    	});
    	view.render().modal('show');
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
//    // remove the view from being rendered
    onRemoveItem: function(model) {
    	// a vessel item is removed and the appropriate view is added and rendered
        var view = _(this._vesselviews).select(function(cv) { 
        	return cv.model === model; })[0];
        $(view.el).remove();
        return this;
    },
	   // Now the part that actually changes the sort order
	   headerClick: function( e ) {
	      var $el = $(e.currentTarget),
	          ns = $el.attr('column'),
	          cs = this.collection.sortAttribute;
	       
	      // Toggle sort if the current column is sorted
	      if (ns == cs) {
	         this.collection.sortDirection *= -1;
	      } else {
	         this.collection.sortDirection = 1;
	      }
	       
	      // Adjust the indicators. Reset everything to hide the
			// indicator
	      $el.closest('thead').find('span').attr('class', 'icon-none');
	       
	      
	      // Now show the correct icon on the correct column
	      if (this.collection.sortDirection == 1) {
	    	  $el.find('span').removeClass('icon-none').addClass(this.sortDnIcon);
	      } else {
	    	  $el.find('span').removeClass('icon-none').addClass(this.sortUpIcon);
	      }
	       
	      // Now sort the collection
	      this.collection.sortVessels(ns);
	      _.invoke(this._vesselviews, 'remove');
	      this.collection.forEach(this.onAddItem, this);
	   }
});