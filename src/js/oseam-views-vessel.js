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
		'click #close'             : 'onCancel',
        'click #oseam-save'               : 'onSave',
        "click #next_step_button" : "nextStep",
        "click #prev_step_button" : "prevStep",
        'change input': 'modify',
        'change textarea': 'modify'
    },
    render: function() {
		// initialize : {OSeaM.frontend.on('change:language', this.render, this);}
	 
//    	new OSeaM.views.Wizard();
	//	var language = OSeaM.frontend.getLanguage();
	//	var template = OSeaM.loadTemplate('vessel-' + language);
        var template = OSeaM.loadTemplate('vessel');
        this.renderParams =  {
        		name   : this.model.get('name')
        };
        var content = $(template(this.renderParams));
        OSeaM.frontend.translate(content);
        this.$el.append(content);
		
		 //this.addSensorPosition();
		
        this.el = content;
        
//        var vessel = new OSeaM.models.Vessel();
        var steps = [
                {
                  step_number :       1,
                  view :              new OSeaM.views.meta1({ model : this.model })
                },
                {
                  step_number :       2,
                  view :              new OSeaM.views.vesselpage({ model : this.model }) 
                },
                {
                  step_number :       3,
                  view :              new OSeaM.views.depthsensorpage({ model : this.model }) 
                },
                {
                  step_number :       4,
                  view :              new OSeaM.views.gpspage({ model : this.model })
                }
              ];
              
        wizard = new OSeaM.views.Wizard({ 
          model : this.model, 
          steps : steps 
        });
        $("#current_step").html(wizard.render().el);
        
       // this.addSensorPosition();
        return content;
    },
	 addSensorPosition: function() {
        this.sensorPositions = new OSeaM.views.SensorPositions({
            el: this.el.find('.oseam-canvas')
			//el: this.$el.find('.oseam-canvas')
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
	onSave : function(evt) {
        /*
         * If this is new project it won't have the ID attribute defined
         */
        if (null == this.model.id) {
            /*
             * We are creating our model through its collection (this way we'll automatically update its views and persist it to DB)
             */
        	this.model.save();
        	this.collection.add(this.model);
        } else {
            /*
             * Simple save will persist the model to the DB and update its view
             */
            this.model.save();
        }
        /*
         * Hiding modal dialog window
         */
        this.remove();
    },
    nextStep: function() {
    	wizard.nextStep();
      },
    prevStep: function() {
    	wizard.prevStep();
      },
    /*
     * We listen to every change on forms input elements and as they have the same name as the model attribute we can easily update our model
     */
    modify: function(e) {
        var attribute = {};
//    	alert(e.currentTarget.name + ":" +e.currentTarget.value);

        /*
         * We'll fetch name and value from element that triggered "change" event
         */
        if(e.currentTarget.name.indexOf("gps_") == 0) {
        	var name = e.currentTarget.name.replace("gps_","");
        	var sbasOffset = this.model.get('sbasoffset');
        	if(sbasOffset == null) {
        		sbasOffset = new OSeaM.models.Offset();
        	}
            attribute[name] = e.currentTarget.value;
        	sbasOffset.set(attribute)
            this.model.set('sbasoffset', depthOffset);
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
        
    }

	 
});