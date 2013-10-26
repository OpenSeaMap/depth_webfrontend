OSeaM.views.VesselWizard = OSeaM.View.extend({
 
  initialize: function() {
    _.bindAll(this, 'render', 'wizardMethod');
  },
  render: function() {
    this.wizardMethod();
    return this;
  },
  wizardMethod: function() {
    var vessel = new OSeaM.models.Vessel();
    var steps = [
            {
              step_number :       1,
              view :              new OSeaM.views.meta1({ model : vessel })
            },
            {
              step_number :       2,
              view :              new OSeaM.views.meta2({ model : vessel })
            },
            {
              step_number :       3,
              view :              new OSeaM.views.meta3({ model : vessel })
            }
          ];
          
    var view = new OSeaM.views.Wizard({ 
      model : vessel, 
      steps : steps 
    });
    $("#current_step").html(view.render().el);
  }
});