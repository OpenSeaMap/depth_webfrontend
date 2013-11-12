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

OSeaM.views.Tracks = OSeaM.View
		.extend({
			events : {
				'change .oseam-upload-wrapper input' : 'onFileSelected',
				'click .trackradios' : 'onWaterTypeSelected',
				'change .meta_lake_river' : 'onValidateMeta',
				'change .configId' : 'onChangeConfigId'
			},
			initialize : function() {
				this.listenTo(this.collection, 'add', this.onAddItem);
				// this.listenTo(this.collection, 'change', this.render);
				this.listenTo(this.collection, 'remove', this.render);
				// this.listenTo(this.collection, 'reset', this.render);
				OSeaM.frontend.on("change:language", this.render, this);
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
				this.collection.forEach(this.onAddItem, this);
				this.collection.fetch();
				$("#trackBtn").hide();
				$("#meta_lake_river").hide();

				this.listElMeta = this.$el.find('tbody2');
				// does not work properly
				this.listElMeta
						.append(this
								.addMetadataList(function(response) {

									var language = OSeaM.frontend.getLanguage();

									switch (language) {
									case 'en':
										selection = '<p><strong>Please choose the associated Vessel Configuration for the Upload of the Tracks</strong></p><form class="configId"><p><select id="selection" name="selection"><option value="" disabled selected>Select your Vessel Config</option>';
										break;
									case 'de':
										selection = '<p><strong>Bite wählen Sie die entsprechende Fahrzeugkonfiguration aus für das Hochladen der Tracks</strong></p><form class="configId"><p><select id="selection" name="selection"><option value="" disabled selected>Fahrzeugkonfiguration</option>';
										break;
									}

									// selection = '<p><strong>Please choose the
									// associated Vessel Configuration for the
									// Upload of the Tracks</strong></p><form
									// class="configId"><p><select
									// id="selection" name="selection"><option
									// value="" disabled selected>Select your
									// Vessel Config</option>';

									entrees = response.length;
									if (response.length === 1) {
										singleConf = response[0].name
										// save in local storage
										localStorage.setItem('configId',
												response[0].id);

									}

									for ( var i = 0; i < response.length; i++) {
										// alert(data[i].name);
										selection += '<option>'
												+ response[i].name
												+ '</option>'
									}
									selection += '</select></p></form>';
									wait = 1;
									return selection;
								}));

				waitForElement();

				function waitForElement() {

					if (wait === 1) {

						// alert('anzahl '+entrees);
						if (entrees === 0) {
							var language = OSeaM.frontend.getLanguage();

							switch (language) {
							case 'en':
								selection = '<h3><font color="#990000">Please create a Vessel Configuration first: <a href="#vessels">here</a></font><h3>';
								break;
							case 'de':
								selection = '<h3><font color="#990000">Bitte erstellen Sie zunächst eine Fahrzeugkonfiguration: <a href="#vessels">hier klicken</a></font><h3>';
								break;
							}

						}

						if (entrees === 1) {
							var language = OSeaM.frontend.getLanguage();

							switch (language) {
							case 'en':
								selection = '<p><strong>Vessel Configuration: '
										+ singleConf + '<strong><p>';
								break;
							case 'de':
								selection = '<p><strong>Fahrzeugkonfiguration: '
										+ singleConf + '<strong><p>';
								break;
							}

						}

						// return renderer.this;
						$('#tbody2').append(selection);
					} else {
						setTimeout(function() {
							waitForElement();
						}, 250);
					}
				}

			},

			onFileSelected : function(evt) {
				// alert('onFileSelected');
				for ( var i = 0; i < evt.target.files.length; i++) {
					this.collection.uploadFile(evt.target.files[i]);
				}
			},
			onAddItem : function(model) {
				// alert('additem');
				var view = new OSeaM.views.Track({
					model : model
				});
				this.listEl.append(view.render().el);
				return this;
			},
			addMetadataList : function(callback) {

				jQuery
						.ajax({
							type : 'GET',
							url : OSeaM.apiUrl + 'vesselconfig',
							dataType : 'json',
							// data: JSON.stringify(params),
							contentType : "application/json; charset=utf-8",
							context : this,
							xhrFields : {
								withCredentials : true
							},
							success : function(response) {
								callback(response);
							},

							error : function() {
								alert('error');
							}

						});

			},
			onWaterTypeSelected : function(a) {
				if (!$("#trackBtn").is(":visible")) {
					$("#trackBtn").show();
				}

				if (!$("#ocean").is(':checked')) {
					$("#meta_lake_river").show();
				} else {
					$("#meta_lake_river").hide();
				}

			},

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

			onChangeConfigId : function() {

				localStorage.setItem('configId', $("#selection").val());
				//alert(localStorage.getItem('configId'));
			}
		});
