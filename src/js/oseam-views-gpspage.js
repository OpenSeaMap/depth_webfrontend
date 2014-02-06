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
    	"mouseenter #vesselsize_gps": "dragAndDrop",
    	"change #gps_distanceFromCenter" : "replaceCenter",
       	"change #gps_distanceFromStern" : "replaceStern"
    },
    
    render: function() {
		var language = OSeaM.frontend.getLanguage();
		var template = OSeaM.loadTemplate('gpsoffset-' + language);
        //var template = OSeaM.loadTemplate('gpsoffset');
        var sbasoffset = this.model.get('sbasoffset'); 
        
				var width = 150;
		var height = 250;
		var centerline = width/2;
		var widthM = this.model.get('breadth');
		var heightM = this.model.get('loa');
		// x 
		if (!sbasoffset.get('distanceFromCenter')) {
		var leftX = '10px';			
		} else {		

		var factorX = widthM / (width - 20);	
		var GpsX = sbasoffset.get('distanceFromCenter');
		var transBX = GpsX / factorX;
		var leftX =  transBX + (centerline -10) + "px";
		}		
		// y
		if (!sbasoffset.get('distanceFromStern')){
		var topY = '10px';			
		} else {		
		var factorY = heightM / (height - 20);	
		var stern = sbasoffset.get('distanceFromStern');
		stern = stern / factorY;
		stern = (stern - height) * -1;
		stern = stern - 20;
		var topY = stern + "px";
		}		
		
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
	
	
	dragAndDrop: function(e){
	
		//console.log('drag');
		var widthM = this.model.get('breadth');
		var heightM = this.model.get('loa');
		sbasoffset = this.model.get('sbasoffset');
			
		$("#draggableGps").draggable({ 
		
		stop: function(event, ui) {
		var Stoppos = $(this).position();
		
		// width:150px; height:250px; border:5px
		// Start bei 0 / 0 --> 130 bis 230 
		//alert ('left = '+ Stoppos.left+ 'top = '+Stoppos.top); 
		
		// 250 * 150 px
		var width = $("#vesselsize_gps").width();
		var height = $("#vesselsize_gps").height();
		
		var centerline = width/2;
		var factorX = widthM / (width - 20);	
		var factorY = heightM / (height - 20);	
		
		
		// centerline zero
		if ((centerline - 10) === Stoppos.left){
		//$("#positionGPSCenterline").text(0);
		sbasoffset.set({distanceFromCenter: 0});
		}
		
		// backboard links - left
		if (Stoppos.left < (centerline -10)){
		
		var transBX = Stoppos.left - (centerline -10);
		
		//var transBX = Stoppos.left - (centerline -10);
		transBX = transBX * factorX; 
		//alert(transBX);
		
		sbasoffset.set({distanceFromCenter: transBX.toFixed(2)});
		}
	
		
		// steuerboard rechts - right
		if (Stoppos.left > (centerline -10)){
		var transSX = Stoppos.left - (centerline -10);
		transSX = transSX * factorX;
		//$("#positionGPSCenterline").val(transSX.toFixed(2));
		sbasoffset.set({distanceFromCenter: transSX.toFixed(2)});
		}

		// from stern
		var stern = Stoppos.top;
		//alert('stern '+ stern+ ' factoy '+ factorY);
		stern = stern * (factorY);
		stern = (stern - heightM) * -1;
		if (stern < 0){
		stern = 0;
		}
		//	$("#positionGPSStern").val(stern.toFixed(2));
		sbasoffset.set({distanceFromStern: stern.toFixed(2)});
	
		
		
    },
		containment: "#vesselsize_gps",
		scroll: false });
	  },
    
	validate: function() {
	  
		var sbasoffset = this.model.get('sbasoffset');
     				
	  this.removeAlerts();
        var errors = [];
       
	try {	   
		if (OSeaM.utils.Validation.gps_distanceFromStern(sbasoffset.get('distanceFromStern')) !== true){
			this.markInvalid($('#gps_distanceFromStern'), '1107:Please enter a decimal');
            }}
		catch(e) {
			}
	try {		
		if (OSeaM.utils.Validation.gps_distanceFromCenter(sbasoffset.get('distanceFromCenter')) !== true){
			this.markInvalid($('#gps_distanceFromCenter'), '1107:Please enter a decimal');
            }}
		catch(e) {
			}
	try {		
		if (OSeaM.utils.Validation.gps_distanceWaterline(sbasoffset.get('distanceWaterline')) !== true){
			this.markInvalid($('#gps_distanceWaterline'), '1107:Please enter a decimal');
            }}
		catch(e) {
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
    },
			replaceCenter : function(){
var value = $("#gps_distanceFromCenter").val();
value = value.replace(/,/g, '.');
$("#gps_distanceFromCenter").val(value);
	} ,
		replaceStern : function(){
var value = $("#gps_distanceFromStern").val();
value = value.replace(/,/g, '.');
$("#gps_distanceFromStern").val(value);
	} 
	
});