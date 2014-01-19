
// this is a wizard configured with wizard pages and a model
// it has a container that is used to render content
OSeaM.views.Wizard = OSeaM.View.extend({
	initialize : function() {
		OSeaM.frontend.on('change:language', this.render, this);
		_.bindAll(this, 'render');
		this.currentStep = 0;
	},
	render : function() {
		var template = OSeaM.loadTemplate('wizard');
        // show the name of vesselconfig in headline
        this.renderParams =  {
        		name   : this.model.get('name')
        };
        var content = $(template(this.renderParams));
        OSeaM.frontend.translate(content);
		this.$el.html(content);

        this.el = content;

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
//			var text = "(" + step.step_number + ") " + step.title + ">>> ";
			switch (this.currentStep) {
			case 0:
//				var language = OSeaM.frontend.getLanguage();
//				if (language === 'en') {
//					$('#vesselTitle').text(
//							"Add Vessel Configuration - Step 1/4");
//				}
//				if (language === 'de') {
//					$('#vesselTitle').text(
//							"Fahrzeugkonfiguration - Schritt 1/4");
//				}
				$('#prev_step_button').hide();
				break;
			case 1:
//				var language = OSeaM.frontend.getLanguage();
//				if (language === 'en') {
//					$('#vesselTitle').text(
//							"Add Vessel Configuration - Step 2/4");
//				}
//				if (language === 'de') {
//					$('#vesselTitle').text(
//							"Fahrzeugkonfiguration - Schritt 2/4");
//				}
				$('#prev_step_button').show();
				$('#next_step_button').show();
				break;
			case 2:
//				var language = OSeaM.frontend.getLanguage();
//				if (language === 'en') {
//					$('#vesselTitle').text(
//							"Add Vessel Configuration - Step 3/4");
//				}
//				if (language === 'de') {
//					$('#vesselTitle').text(
//							"Fahrzeugkonfiguration - Schritt 3/4");
//				}
//
				$('#prev_step_button').show();
				$('#next_step_button').show();
				break;
			case 3:
//				var language = OSeaM.frontend.getLanguage();
//				if (language === 'en') {
//					$('#vesselTitle').text(
//							"Add Vessel Configuration - Finished");
//				}
//				if (language === 'de') {
//					$('#vesselTitle').text("Fahrzeugkonfiguration - Fertig");
//				}
				$('#next_step_button').hide();
				break;
			}

		}, this));
	},


	
	renderCurrentStep : function() {
		// get current step
		var currentStep = this.options.steps[this.currentStep];
		
		if (!this.isFirstStep())
			var prevStep = this.options.steps[this.currentStep - 1];
		var nextStep = this.options.steps[this.currentStep + 1];
//		alert(this.currentStep);
		
		this.title.html(currentStep.title);
		// this.instructions.html(currentStep.instructions);
		this.currentView = currentStep.view;
		
		//this.currentStepContainer.html(this.currentView.render().el);

		// important to register the events
		this.currentView.setElement(this.currentStepContainer);
		this.currentView.render();
		
		this.renderProgressIndicator();

	},
	nextStep : function() {
	
	
	
	//alert('next step aus wizzard');
	var currentStep = this.options.steps[this.currentStep];
	this.currentView = currentStep.view;
	//alert('next wizzrad');
	
		if (this.currentView.validate()) {
	
			if (!this.isLastStep()) {
				this.currentView.validate();
				this.currentStep += 1;
				this.renderCurrentStep();
			}
		}
	},
	prevStep : function() {
		if (this.currentView.validate()) {
			if (!this.isFirstStep()) {
				this.currentView.validate();
				this.currentStep -= 1;
				this.renderCurrentStep();
			}
		}
	},
	isFirstStep : function() {
		return (this.currentStep == 0);
	},

	isLastStep : function() {
		return (this.currentStep == this.options.steps.length - 1);
	},
	onCancel : function(evt) {
		this.remove();
	}
    /*
     * We listen to every change on forms input elements and as they have the same name as the model attribute we can easily update our model
     */
/*    modify: function(e) {
	
		 alert('modify');
	
        var attribute = {};

        if(e.currentTarget.name.indexOf("gps_") == 0) {
        	var name = e.currentTarget.name.replace("gps_","");
        	var sbasOffset = this.model.get('sbasoffset');
        	if(sbasOffset == null) {
        		sbasOffset = new OSeaM.models.Offset();
        	}
            attribute[name] = e.currentTarget.value;
        	sbasOffset.set(attribute)
            this.model.set('sbasoffset', sbasOffset);
        }
        else if(e.currentTarget.name.indexOf("depth_") == 0) {
        	var name = e.currentTarget.name.replace("depth_","");
        	var depthOffset = this.model.get('depthoffset');
        	if(depthOffset == null) {
        		depthOffset = new OSeaM.models.Offset();
        	}
            attribute[name] = e.currentTarget.value;
            depthOffset.set(attribute)
            this.model.set('depthoffset', depthOffset);
        } else {
        	attribute[e.currentTarget.name] = e.currentTarget.value;
        	this.model.set(attribute);
        }
    }*/

});