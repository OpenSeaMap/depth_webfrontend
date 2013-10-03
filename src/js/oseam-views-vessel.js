// -------------------------------------------------------------------------------------------------
// OpenSeaMap Water Depth - Web frontend for depth data handling.
//
// Written in 2013 by Dominik Fässler dfa@bezono.org
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain
// worldwide. This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along
// with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
// -------------------------------------------------------------------------------------------------

OSeaM.views.Vessel = OSeaM.View.extend({
    sensorPositions:null,
    events: {
        'click [name=echoSounderInFront]' : 'onEchoSounderInFront',
        'click [name=echoSounderRightOf]' : 'onEchoSounderRightOf',
        'change [name=distanceY]'         : 'onChangeDistanceY',
        'change [name=distanceX]'         : 'onChangeDistanceX',
        'click #oseam-cancel'             : 'onCancel',
        'click #oseam-save'               : 'onSave',
        "click #next_step_button" : "nextStep",
        "click #prev_step_button" : "prevStep"
    },
    render: function() {
    	new OSeaM.views.Wizard();
        var template = OSeaM.loadTemplate('vessel');
        this.renderParams =  {
            idTitle          : OSeaM.id(),
            idVesselName     : OSeaM.id(),
            idDepthMeasured  : OSeaM.id(),
            idDepthDisplayed : OSeaM.id()
        };
        var content = $(template(this.renderParams));
        OSeaM.frontend.translate(content);
        this.$el.append(content);
        this.el = content;
        
        var vessel = new OSeaM.models.Vessel();
        var steps = [
                {
                  step_number :       1,
                  title :             "Title of Step 1",
                  instructions :      "Instructions or description of what the user needs to do for this step",
                  view :              new OSeaM.views.vesselpage({ model : vessel })
                },
                {
                  step_number :       2,
                  title :             "Title of Step 2",
                  instructions :      "Instructions or description of what the user needs to do for this step",
                  view :              new OSeaM.views.gpspage({ model : vessel })
                },
                {
                  step_number :       3,
                  title :             "Title of Step 3",
                  instructions :      "Instructions or description of what the user needs to do for this step",
                  view :              new OSeaM.views.depthsensorpage({ model : vessel })
                }
              ];
              
        wizard = new OSeaM.views.Wizard({ 
          model : vessel, 
          steps : steps 
        });
        $("#current_step").html(wizard.render().el);
        
//        this.addSensorPosition();
        return content;
    },
    addSensorPosition: function() {
        this.sensorPositions = new OSeaM.views.VesselWizard({
            el: this.el.find('.oseam-canvas')
        });
        this.sensorPositions.render();
    },
    onEchoSounderInFront: function(evt) {
        if ($(evt.target).is(':checked') === true) {
            this.sensorPositions.setTopDevice('gps');
        } else {
            this.sensorPositions.setTopDevice('echo');
        }
    },
    onEchoSounderRightOf: function(evt) {
        if ($(evt.target).is(':checked') === true) {
            this.sensorPositions.setLeftDevice('gps');
        } else {
            this.sensorPositions.setLeftDevice('echo');
        }
    },
    onChangeDistanceY: function(evt) {
        var value = parseFloat($(evt.target).val()) * 100;
        this.sensorPositions.setVerticalDistance(value);
    },
    onChangeDistanceX: function(evt) {
        var value = parseFloat($(evt.target).val()) * 100;
        this.sensorPositions.setHorizontalDistance(value);
    },
    onCancel: function(evt) {
        this.el.modal('hide');
    },
    onSave: function(evt) {
        this.el.modal('hide');
    },
    nextStep: function() {
    	wizard.nextStep();
      },
    prevStep: function() {
    	wizard.prevStep();
      }
});