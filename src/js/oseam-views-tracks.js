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
OSeaM.views.Tracks = OSeaM.View
		.extend({
			events : {
				'change .oseam-upload-wrapper input' : 'onFileSelected',
				'change .licenseId' : 'onChangeLicenseConfigId',
				'change .vesselId' : 'onChangeVesselConfigId'
			},
			initialize : function() {
				this.listenTo(this.collection, 'add', this.onAddItem);
				// this.listenTo(this.collection, 'change', this.render);
//				this.listenTo(this.collection, 'remove', this.onRemoveItem);
				// this.listenTo(this.collection, 'reset', this.render);
				OSeaM.frontend.on("change:language", this.render, this);

   		        // stores the item views for this view
				this._views = [];
				this.candidateTrack = new OSeaM.models.Track();

			},
			render : function() {
				var wait = '';
				var selection = '';
				var entrees = '';
				var singleConf = '';
				var language = OSeaM.frontend.getLanguage();
				var template = OSeaM.loadTemplate('tracks-' + language);
				var content = $(template());
				OSeaM.frontend.translate(content);
				this.$el.html(content);
				this.listEl = this.$el.find('tbody');
//				this.vesselEl = this.$el.find('#selection');

				this.collection.forEach(this.onAddItem, this);
				this.collection.fetch();

				var vessels = OSeaM.frontend.getVessels()
				this.vesselviews = new OSeaM.views.Selection({el : $("#vesselselection"), collection : vessels});
				vessels.fetch();
				
				var licenses = OSeaM.frontend.getLicenses()
				this.licenseviews = new OSeaM.views.Selection({el : $("#licenseselection"), collection : licenses});
				licenses.fetch();
			},

			onFileSelected : function(evt) {
				// alert('onFileSelected');
				for ( var i = 0; i < evt.target.files.length; i++) {
					// get vesselconfig from somewhere
					this.candidateTrack.set({
			            fileName : evt.target.files[i].name,
			            status : this.STATUS_STARTING_UPLOAD
			        });
					this.collection.add(this.candidateTrack); 

					// issue a post request
					var jqXHR = this.candidateTrack.save({}, {
						// TODO: do something with the error
						error: function(candidateTrack, xhr, options) {
							this.collection.remove(candidateTrack);
					        console.log(xhr);            
					    },
					    // on success start the progress of upload
					    success: function(candidateTrack, response, options) {
					    	candidateTrack.onReaderLoad(null, evt.target.files[i], candidateTrack.id);
					    }
					});
				}
				// free next new track
				this.candidateTrack = new OSeaM.models.Track();
			},
			onAddItem : function(model) {
				// alert('additem');
				var view = new OSeaM.views.Track({
					model : model
				});
		        // Adding project item view to the list
		        this._views.push(view);
				
				this.listEl.append(view.render().el);
				return this;
			},
//		    // remove the view from being rendered
//		    onRemoveItem: function(model) {
//		    	// a vessel item is removed and the appropriate view is added and rendered
//		        var view = _(this._views).select(function(cv) { return cv.model === model; })[0];
//		        $(view.el).remove();
//		        return this;
//		    },
			onValidateMeta : function() {

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
			markInvalid : function(field, text) {
				field.parents('.control-group').addClass('error');
				// field.next('.help-inline').attr('data-trt', text);
				this.$el.find('.help-inline').attr('data-trt', text);
				OSeaM.frontend.translate(this.$el);
				this.isValid = false;
			},
			removeAlerts : function() {
				this.$el.find('.alert').remove();
				this.$el.find('.control-group').removeClass('error');
				this.$el.find('.help-inline').removeAttr('data-trt');
				this.$el.find('.help-inline').html('');
				this.isValid = true;
			},

			onChangeVesselConfigId : function() {
				this.candidateTrack.set('vesselconfigid', $("#vesselselection").val());
			},
			onChangeLicenseConfigId : function() {
				this.candidateTrack.set('license', $("#licenseselection").val());
			}
		});
