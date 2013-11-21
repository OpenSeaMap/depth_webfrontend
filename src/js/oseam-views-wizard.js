OSeaM.views.Wizard = OSeaM.View.extend({

	id : 'wizard',

	events : {
		// is in views-vessel ! delete?
		'click #next_step_button' : 'nextStep',
		'click #prev_step_button' : 'prevStep',
		'click .oseam-cancel' : 'onCancel',
		'click .oseam-save' : 'onSave'

	},

	initialize : function() {
		OSeaM.frontend.on('change:language', this.render, this);
		_.bindAll(this, 'render');
		this.currentStep = 0;
	},

	render : function() {
		var template = OSeaM.loadTemplate('wizard');
		var t = $(template());
		this.$el.html(t);

		this.progressIndicator = this.$("#progress_indicator");
		this.title = this.$("h2#step_title");
		this.instructions = this.$("p#step_instructions");
		this.currentStepContainer = this.$(".current_step_container");
		this.nextStepButton = this.$("#next_step_button");
		this.prevStepButton = this.$("#prev_step_button");

		this.renderCurrentStep();
		return this;
	},

	renderProgressIndicator : function() {

		this.progressIndicator.empty();
		// alert(this.progressIndicator.toSource());
		_.each(this.options.steps, _.bind(function(step) {
			var text = "(" + step.step_number + ") " + step.title + ">>> ";
			switch (this.currentStep) {
			case 0:
				var language = OSeaM.frontend.getLanguage();
				if (language === 'en') {
					$('#vesselTitle').text(
							"Add Vessel Configuration - Step 1/4");
				}
				if (language === 'de') {
					$('#vesselTitle').text(
							"Fahrzeugkonfiguration - Schritt 1/4");
				}
				$('#prev_step_button').hide();
				break;
			case 1:
				var language = OSeaM.frontend.getLanguage();
				if (language === 'en') {
					$('#vesselTitle').text(
							"Add Vessel Configuration - Step 2/4");
				}
				if (language === 'de') {
					$('#vesselTitle').text(
							"Fahrzeugkonfiguration - Schritt 2/4");
				}
				$('#prev_step_button').show();
				$('#next_step_button').show();
				break;
			case 2:
				var language = OSeaM.frontend.getLanguage();
				if (language === 'en') {
					$('#vesselTitle').text(
							"Add Vessel Configuration - Step 3/4");
				}
				if (language === 'de') {
					$('#vesselTitle').text(
							"Fahrzeugkonfiguration - Schritt 3/4");
				}

				$('#prev_step_button').show();
				$('#next_step_button').show();
				break;
			case 3:
				var language = OSeaM.frontend.getLanguage();
				if (language === 'en') {
					$('#vesselTitle').text(
							"Add Vessel Configuration - Finished");
				}
				if (language === 'de') {
					$('#vesselTitle').text("Fahrzeugkonfiguration - Fertig");
				}
				$('#next_step_button').hide();
				break;
			}

		}, this));
	},

	renderCurrentStep : function() {
	    var currentStep = this.options.steps[this.currentStep];
    if (!this.isFirstStep()) var prevStep = this.options.steps[this.currentStep - 1];
    var nextStep = this.options.steps[this.currentStep + 1];
 
    this.title.html(currentStep.title);
//    this.instructions.html(currentStep.instructions);
    this.currentView = currentStep.view;
    //this.currentStepContainer.html(this.currentView.render().el);
    
	this.currentView.setElement(this.currentStepContainer);
	this.currentView.render();
	this.renderProgressIndicator();	

	},

	nextStep : function() {

		this.setModel();

		if (this.currentView.validate()) {
			if (!this.isLastStep()) {
				this.currentView.validate();
				this.currentStep += 1;
				this.renderCurrentStep();
			} else {
				this.save();
			}
			;
		}
		;
	},

	thisStep : function() {

		this.setModel();
	},

	prevStep : function() {

		this.setModel();

		if (this.currentView.validate()) {
			if (!this.isFirstStep()) {
				this.currentView.validate();
				this.currentStep -= 1;
				this.renderCurrentStep();
			} else {
				this.save();
			}
			;
		}
		;
	},

	setModel : function() {

		var currentStep = this.options.steps[this.currentStep];

		switch (currentStep.step_number) {
		case 1:
			this.model.set({
				name : $('#configname').val()
			});
			this.model.set({
				description : $('#description').val()
			});
			break;
		case 2:
			if ($('#echoSounderRightOf').prop("checked") == true) {
				this.model.set({
					echoSounderRightOf : 'checked'
				});
			} else {
				this.model.set({
					echoSounderRightOf : ''
				});
			}
			if ($('#echoSounderInFront').prop("checked") == true) {
				this.model.set({
					echoSounderInFront : 'checked'
				});
			} else {
				this.model.set({
					echoSounderInFront : ''
				});
			}
			this.model.set({
				distanceY : $('#distanceY').val()
			});
			this.model.set({
				distanceX : $('#distanceX').val()
			});

			break;
		case 3:
			this.model.set({
				slidingspeed : $('#slidingspeed').val()
			});

			if ($('#sailingYacht').prop("checked") == true) {
				this.model.set({
					sailingYacht : 'checked'
				});
			} else {
				this.model.set({
					sailingYacht : ''
				});
			}
			if ($('#motorYacht').prop("checked") == true) {
				this.model.set({
					motorYacht : 'checked'
				});
			} else {
				this.model.set({
					motorYacht : ''
				});
			}
			if ($('#motorYachtDisplacer').prop("checked") == true) {
				this.model.set({
					motorYachtDisplacer : 'checked'
				});
			} else {
				this.model.set({
					motorYachtDisplacer : ''
				});
			}
			break;
		case 4:

			this.model.set({
				idDepthMeasured : $('#idDepthMeasured').val()
			});
			this.model.set({
				idDepthDisplayed : $('#idDepthDisplayed').val()
			});
			break;
		}

	},

	isFirstStep : function() {
		return (this.currentStep == 0);
	},

	isLastStep : function() {
		return (this.currentStep == this.options.steps.length - 1);
	},
	onCancel : function(evt) {
		// this.el.modal('hide');
	},
	onSave : function(evt) {
		alert("save");
	}

});