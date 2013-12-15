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

OSeaM.views.meta1 = OSeaM.View.extend({
			modalDialog : null,
			render : function() {
				var language = OSeaM.frontend.getLanguage();
				var template = OSeaM.loadTemplate('meta1-' + language);
	
				var content = $(template({
					name : this.model.get('name'),
					description : this.model.get('description')
				}));
				this.$el.html(content);
				return this;
			},
			validate : function() {
			
			
				this.removeAlerts();
				var errors = [];
				
				console.log('meta1 '+this.model.get('name'));
				// get the names in the model 
				//alert(this.collection.toSource());
				//alert(this.model.toSource());
				//alert(vessel.getCollection());
				
				
				// a name is required 
				if (!this.model.get('name')) {
								
					this.markInvalid($('#name'),
							'1100:Please enter a name');
					//what is this for?
					//errors.push('1004:Email');
				}
				if (OSeaM.utils.Validation.configname(this.model.get('name')) !== true) {
					this
							.markInvalid($('#name'),
									'1101:Please do not use any special character (only 0-9 and A-Z)');
					//what is this for?
					//errors.push('1004:Email');
				}

//				if (OSeaM.utils.Validation.confignames(this.model.get('name')) !== true) {
//					this
//							.markInvalid($('#name'),
//									'1102:The Configuration Name already exist, choose a new One');
//					//what is this for?
//					//errors.push('1004:Email');
//				}

				/*
				if (this.fieldPassword1.val() !== this.fieldPassword2.val()) {
				    this.markInvalid(this.fieldPassword2, '1011:Verification is different.');
				    errors.push('1017:Password verification');
				}
				if (this.fieldPassword1.val().length < 8) {
				    this.markInvalid(this.fieldPassword1, '1012:At least 8 characters.');
				    errors.push('1005:Password');
				}
				if (this.fieldPassword2.val().length < 8) {
				    this.markInvalid(this.fieldPassword2, '1012:At least 8 characters.');
				    errors.push('1017:Password verification');
				}
				if (this.fieldCaptcha.val().length !== 6) {
				    this.markInvalid(this.fieldCaptcha, '1013:Invalid captcha.');
				    errors.push('1007:Captcha');
				}
				if (this.fieldLicense.is(':checked') !== true) {
				    this.markInvalid(this.fieldLicense, '');
				    errors.push('1014:License');
				}
				if (this.isValid !== true) {
				    var template = OSeaM.loadTemplate('alert');
				    var content  = $(template({
				        title:'1027:Validation error occured',
				        errors:errors
				    }));
				    OSeaM.frontend.translate(content);
				    this.$el.find('legend').after(content);
				}*/
				
				console.log('this.isvalid= '+this.isValid);
				return this.isValid;
				//return true;
			},
			markInvalid : function(field, text) {
				field.parents('.control-group').addClass('error');
				field.next('.help-inline').attr('data-trt', text);
				OSeaM.frontend.translate(this.$el);
				this.isValid = false;
			},
			removeAlerts : function() {
				this.$el.find('.alert').remove();
				this.$el.find('.control-group').removeClass('error');
				this.$el.find('.help-inline').removeAttr('data-trt');
				this.$el.find('.help-inline').html('');
				this.isValid = true;
			}

		});