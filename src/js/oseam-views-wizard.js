OSeaM.views.Wizard = OSeaM.View.extend({
  
  id: 'wizard',
 
  events: {
    'click #next_step_button' : 'nextStep',
    'click #prev_step_button' : 'prevStep',
   'click .oseam-cancel'             : 'onCancel',
   'click .oseam-save'               : 'onSave'
  },
  
  initialize: function() {
    _.bindAll(this, 'render');
    this.currentStep = 0;
  },
 
  render: function() {
    var template = OSeaM.loadTemplate('wizard');
    var t = $(template());
    this.$el.html( t);
    
    this.progressIndicator = this.$("#progress_indicator");
    this.title = this.$("h2#step_title");
    this.instructions = this.$("p#step_instructions");
    this.currentStepContainer = this.$(".current_step_container");
    this.nextStepButton = this.$("#next_step_button");
    this.prevStepButton = this.$("#prev_step_button");
    
    this.renderCurrentStep();
    return this;
  },
  
  renderProgressIndicator: function() {
//    this.progressIndicator.empty();
//    _.each(this.options.steps, _.bind(function(step) {
//      var text =  "(" + step.step_number + ") " + step.title + ">>> ";
//      var el = this.make('span', {}, text);
//      if (step.step_number == this.currentStep + 1) $(el).addClass('active');
//      this.progressIndicator.append(el);
//    }, this));
  },
  
  renderCurrentStep: function() {
    var currentStep = this.options.steps[this.currentStep];
    if (!this.isFirstStep()) var prevStep = this.options.steps[this.currentStep - 1];
    var nextStep = this.options.steps[this.currentStep + 1];
 
//    this.title.html(currentStep.title);
//    this.instructions.html(currentStep.instructions);
    this.currentView = currentStep.view;
    this.currentStepContainer.html(this.currentView.render().el);
 
    this.renderProgressIndicator();
    
//    if (prevStep) {
//      this.prevStepButton.html("Prev: " + prevStep.title).show()
//    } else {
//      this.prevStepButton.hide();
//    };
//    if (nextStep) {
//      this.nextStepButton.html("Next: " + nextStep.title);
//    } else {
//      this.nextStepButton.html("Finish");
//    };
  },
  
  nextStep: function() {
    if (this.currentView.validate()) {
      if (!this.isLastStep()) {
        this.currentView.validate();
        this.currentStep += 1;
        this.renderCurrentStep();
      } else {
        this.save();
      };
    };
  },
  
  prevStep: function() {
    if (!this.isFirstStep()) {
      this.currentStep -= 1;
      this.renderCurrentStep();
    };
  },
  
  isFirstStep: function() {
    return (this.currentStep == 0);
  },
  
  isLastStep: function() {
    return (this.currentStep == this.options.steps.length - 1);
  },
  onCancel: function(evt) {
//      this.el.modal('hide');
  },
  onSave: function(evt) {
	  alert("save");
  }
  
});