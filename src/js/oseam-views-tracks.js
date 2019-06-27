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


// this view lists the tracks
OSeaM.views.Tracks = OSeaM.View.extend({
    events: {
      'change .oseam-upload-wrapper input': 'onFileSelected',
      'change .licenseId': 'onChangeLicenseConfigId',
      'change .vesselId': 'onChangeVesselConfigId',
      "click th": "headerClick"
    },
    sortUpIcon: 'icon-arrow-up',
    sortDnIcon: 'icon-arrow-down',
    initialize: function() {
      this.listenTo(this.collection, 'add', this.onAddItem);
      this.listenTo(this.collection, 'reset', this.addAndRenderViews);
      OSeaM.frontend.on("change:language", this.render, this);
      // stores the item views for this view
      this._views = [];
      this.candidateTrack = new OSeaM.models.Track();

      var that = this;
      this.collection.fetch().done(function() {
        that.addAndRenderViews();
      });
      this.listenTo(this.collection, 'remove', this.onRemoveItem);
      //			   this.listenTo(this.collection, "sort", this.render);

      this.vessels = new OSeaM.models.Vessels();
      this.vessels.fetch().done(function() {
        that.renderVesselSelection();
      });

      this.licenses = new OSeaM.models.Licenses();
      this.licenses.fetch().done(function() {
        that.renderLicenceSelection();
      });

    },
    addAndRenderViews: function() {
      this.addViews();
      this.render();
    },
    
    //RKu: this function does add each track-entry, already stored on the servers database, to the current view
    addViews: function() {
      this.listEl.empty();
      this._views = [];
      var self = this;
      this.collection.each(function(model) {		// loop until "collection.length" has reached
        self._views.push(new OSeaM.views.Track({	// .push: add the next track entry to the array "_views" 
          model: model,
          vessels: self.vessels,
          licenses: self.licenses
        }));
      });
    },
    
    renderContent: function() {
      this.listEl = this.$el.find('tbody');			// find the root of "tbody" in the html (for example "tracks-de.handlebars")
      this.listEl.empty();							// make sure the list is empty
      var container = document.createDocumentFragment();

      _.each(this._views, function(subview) {		// fill in each table element
        container.appendChild(subview.render().el)
      });
      this.listEl.append(container);				// append the final table to html "tbody" 
    },
    
    // update the vessel config
    renderVesselSelection: function() {
      this.vesselviews = new OSeaM.views.Selection({
        el: $("#vesselselection"),
        collection: this.vessels
      });
      $("#vesselselection option[value=" + localStorage.lastvessel + "]").attr("selected", "selected");
      this.candidateTrack.set('vesselconfigid', localStorage.lastvessel);
    },
    
    // update the track licences
    renderLicenceSelection: function() {
      this.licenseviews = new OSeaM.views.Selection({
        el: $("#licenseselection"),
        collection: this.licenses
      });
      $("#licenseselection option[value=" + localStorage.lastlicense + "]").attr("selected", "selected");
      this.candidateTrack.set('license', localStorage.lastlicense);
    },
    
    render: function() {
      var self = this;
      var wait = '';
      var selection = '';
      var entrees = '';
      var singleConf = '';
      this.$el.empty();
      var language = OSeaM.frontend.getLanguage();
      var template = OSeaM.loadTemplate('tracks-' + language);		// load for example "tracks-de.handlebars" ( html tabel)
      var content = $(template());
      OSeaM.frontend.translate(content);							// 1. view the static html "tracks-de.handlebars"
      this.$el.html(content);
      this.renderContent();											// 2. view the table of already stored tracks
      //		        this.collection.forEach(this.onAddItem, this);
      if (this.vessels)
        this.renderVesselSelection();								// 3. view vessel config

      if (this.licenses)
        this.renderLicenceSelection();								// 4. view vessel Licence
    },
    
    
    onFileSelected: function(evt) {
      if (typeof this.candidateTrack.get('vesselconfigid') === "undefined" || typeof this.candidateTrack.get('license') === "undefined") {
//        alert('You have to select a vessel configuration and a license in order to upload tracks');
//RKu:+ 
        this.removeAlerts();										//RKu: clear alerts if there are any
        var template = OSeaM.loadTemplate('alert');					//RKu: set up a proper error message if vessel and license not valid      
        this.renderParams =  {
            title : '1027:Validation error occured!',
            msg   : '1308:You have to select a vessel configuration and a license in order to upload tracks.'
        };
        var content = $(template(this.renderParams));
        OSeaM.frontend.translate(content);
        this.$el.find('legend').after(content);
//RKu:-        
        return;
      }
	  console.log( evt.target.files );
	  var files = $.extend( true,{},evt.target.files );
	  console.log( files );
	  evt.target.value = "";
	  console.log( files );
      for (var i = 0; i < files.length; i++) {
        var storeTrack = function(newTrack, self) {
          // get vesselconfig from somewhere
          newTrack.set({
            fileName: files[i].name,
            status: self.STATUS_STARTING_UPLOAD,
            license: self.candidateTrack.get('license'),
            progress: 1,
            vesselconfigid: self.candidateTrack.get('vesselconfigid')
          });
          self.collection.add(newTrack);
          var fn = function(track, evt) {
              newTrack.onReaderLoad(evt, track, newTrack.id);
            }
            // issue a post request
          var jqXHR = newTrack.save({}, {
            // TODO: do something with the error
            error: function(newTrack, xhr, options) {
              self.collection.remove(newTrack);
              console.log(xhr);										//RKu: I need to simulate this case first in order to develop a proper error message
            },
            // on success start the progress of upload
            success: jQuery.proxy(fn, self, evt.target.files[i])
          });
        }
        storeTrack(new OSeaM.models.Track(), this);
      }
    },
    // Now the part that actually changes the sort order
    headerClick: function(e) {
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
      this._views = [];
      this.listEl.empty();
      this.collection.sortTracks(ns);
      this.addViews();
      this.renderContent();

      //			      _.invoke(this._views, 'remove');
      //			      this.collection.forEach(this.onAddItem, this);
    },
    onAddItem: function(model) {
      // alert('additem');
      var view = new OSeaM.views.Track({
        model: model,
        vessels: this.vessels,
        licenses: this.licenses
      });
      // Adding project item view to the list
      this._views.push(view);

      this.listEl.append(view.render().el);
      return this;
    },
    // // remove the view from being rendered
    onRemoveItem: function(model) {
      // a vessel item is removed and the appropriate view is added
      // and rendered
      var view = _(this._views).select(function(cv) {
        return cv.model === model;
      })[0];
      $(view.el).remove();
      return this;
    },
    onValidateMeta: function() {

      this.removeAlerts();
      var errors = [];

      if (OSeaM.utils.Validation.gauge($("#gauge").val()) !== true) {

        this.markInvalid($('#gauge'),
          '1103:Please enter a decimal (e.g. 5.5)');
        // what is this for?
        // errors.push('1004:Email');
      }

      return this.isValid;

    },
    markInvalid: function(field, text) {
      field.parents('.control-group').addClass('error');
      // field.next('.help-inline').attr('data-trt', text);
      this.$el.find('.help-inline').attr('data-trt', text);
      OSeaM.frontend.translate(this.$el);
      this.isValid = false;
    },
    removeAlerts: function() {
      this.$el.find('.alert').remove();
      this.$el.find('.control-group').removeClass('error');
      this.$el.find('.help-inline').removeAttr('data-trt');
      this.$el.find('.help-inline').html('');
      this.isValid = true;
    },
    onChangeVesselConfigId: function() {
      this.candidateTrack.set('vesselconfigid', $("#vesselselection").val());
      localStorage.lastvessel = $("#vesselselection").val();
    },
    onChangeLicenseConfigId: function() {
      this.candidateTrack.set('license', $("#licenseselection").val());
      localStorage.lastlicense = $("#licenseselection").val();
    }
  });
