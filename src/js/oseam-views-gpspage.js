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

OSeaM.views.gpspage = OSeaM.View.extend({
    modalDialog:null,
    initialize : function() {
        var sbasoffset = this.model.get('sbasoffset');
        this.listenTo(sbasoffset, 'change', this.render);
    },
    events : {
    	"mousedown #draggableGps": "dragStartEvent",
    	"mouseup #vesselsize_gps": "dragStopEvent",
    	"dragver #vesselsize_gps" : "dragOver"
//    	"change #gps_distanceFromStern" : "changeY",
//       	"change #gps_distanceFromCenter" : "changeX"
    },
    dragOver : function(e) {
        e.preventDefault(); 
        return false; 
    },
    dragStartEvent : function(e) {
    	position =  new Object();
    	position.x = e.clientX - parseInt($("#draggableGps").css("left"),10);
    	position.y = e.clientY - parseInt($("#draggableGps").css("top"), 10);
    },
    dragStopEvent : function(e) {
//    	$("#draggableGps").css("left", (e.clientX - position.x) + "px");
//    	$("#draggableGps").css("top", (e.clientY - position.y) + "px");
    },
    render: function() {
			var language = OSeaM.frontend.getLanguage();
		var template = OSeaM.loadTemplate('gpsoffset-' + language);
        //var template = OSeaM.loadTemplate('gpsoffset');
        var sbasoffset = this.model.get('sbasoffset'); 
        var relativeY = sbasoffset.get('distanceFromStern') / this.model.get('loa');
        var relativeX = sbasoffset.get('distanceFromCenter') / this.model.get('breadth');
        var topY = (((-1) * (relativeY * 250)) + 250)- 10 + "px";
        var leftX = (((relativeX * 150)) + 75) - 10 + "px";
        var content = $(template({
        	gps_distanceFromStern : sbasoffset.get('distanceFromStern'),
        	gps_distanceFromCenter : sbasoffset.get('distanceFromCenter'),
        	gps_distanceWaterline : sbasoffset.get('distanceWaterline'),
			gps_OffsetKeel : sbasoffset.get('distanceKeel'),
			gps_manufacturer : sbasoffset.get('manufacturer'),
			gps_model : sbasoffset.get('model'),
        	top : topY,		
        	left : leftX
		}));
        OSeaM.frontend.translate(content);
        this.$el.html(content);
        return this;
    },
//    changeX : function(e) {
//        var sbasoffset = this.model.get('sbasoffset'); 
//        var relativeX = sbasoffset.get('distanceFromCenter') / this.model.get('breadth');
//        var leftX = (((-1) * (relativeX * 37)) + 75) + "px";
//    	$("#draggableGps").css("left", leftX + "px");
//
//    },
//    changeY : function(e) {
//        var sbasoffset = this.model.get('sbasoffset'); 
//        var relativeY = sbasoffset.get('distanceFromStern') / this.model.get('loa');
//        var topY = (((-1) * (relativeY * 250)) + 250) + "px";
//    	$("#draggableGps").css("top", topY + "px");
//    },
    
	validate: function() {

	  
		var sbasoffset = this.model.get('sbasoffset');
     		
			
	  this.removeAlerts();
        var errors = [];
        		
		if (OSeaM.utils.Validation.gps_distanceFromStern(sbasoffset.get('distanceFromStern')) !== true){
			this.markInvalid($('#gps_distanceFromStern'), '1107:Please enter a decimal');
            }
				if (OSeaM.utils.Validation.gps_distanceFromCenter(sbasoffset.get('distanceFromCenter')) !== true){
			this.markInvalid($('#gps_distanceFromCenter'), '1107:Please enter a decimal');
            }
		if (OSeaM.utils.Validation.gps_distanceWaterline(sbasoffset.get('distanceWaterline')) !== true){
			this.markInvalid($('#gps_distanceWaterline'), '1107:Please enter a decimal');
            }
			
							
				
        return this.isValid;
    
    },
	    markInvalid: function(field, text) {
        field.parents('.control-group').addClass('error');
	    field.nextAll('.help-inline').attr('data-trt', text);
		  
		// alles wird markliert
		//this.$el.find('.help-inline').attr('data-trt', text);  
        OSeaM.frontend.translate(this.$el);
        this.isValid = false;
    },
    removeAlerts: function() {
        this.$el.find('.alert').remove();
        this.$el.find('.control-group').removeClass('error');
        this.$el.find('.help-inline').removeAttr('data-trt');
        this.$el.find('.help-inline').html('');
        this.isValid = true;
    }
	
});