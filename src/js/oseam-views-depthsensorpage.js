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

OSeaM.views.depthsensorpage = OSeaM.View.extend({
    modalDialog:null,
    initialize : function() {
        var depthoffset = this.model.get('depthoffset');
        this.listenTo(depthoffset, 'change', this.render);
    },
    events : {
    	"mouseenter #vesselsize_depth": "dragAndDrop",
    	"change #depth_distanceFromCenter" : "replaceCenter",
       	"change #depth_distanceFromStern" : "replaceStern"
    },
    
    render: function() {
        //var template = OSeaM.loadTemplate('depthsensoroffset');
		var language = OSeaM.frontend.getLanguage();
		var template = OSeaM.loadTemplate('depthsensoroffset-' + language);
        var depthoffset = this.model.get('depthoffset');
		
        // does not work cause this is not available while stepping back	
		//var width = $("#vesselsize_depth").width();
		//var height = $("#vesselsize_depth").height();
		
		var width = 150;
		var height = 250;
		var centerline = width/2;
		var widthM = this.model.get('breadth');
		var heightM = this.model.get('loa');
		// x 
		if (!depthoffset.get('distanceFromCenter')) {
		var leftX = '10px';			
		} else {		

		var factorX = widthM / (width - 20);	
		var SounderX = depthoffset.get('distanceFromCenter');
		var transBX = SounderX / factorX;
		var leftX =  transBX + (centerline -10) + "px";
		}		
		// y
		if (!depthoffset.get('distanceFromStern')){
		var topY = '10px';			
		} else {		
		var factorY = heightM / (height - 20);	
		var stern = depthoffset.get('distanceFromStern');
		stern = stern / factorY;
		stern = (stern - height) * -1;
		stern = stern - 20;
		var topY = stern + "px";
		}
		
        var content = $(template({
        	depth_distanceFromStern : depthoffset.get('distanceFromStern'),
        	depth_distanceFromCenter : depthoffset.get('distanceFromCenter'),
        	depth_distanceWaterline : depthoffset.get('distanceWaterline'),
			depth_offsetKeel : depthoffset.get('offsetKeel'),
			depth_manufacturer : depthoffset.get('manufacturer'),
			depth_model : depthoffset.get('model'),
			depth_offsetType : depthoffset.get('offsetType'),
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
		depthoffset = this.model.get('depthoffset');
			
		$("#draggableSounder").draggable({ 
		
		stop: function(event, ui) {
		var Stoppos = $(this).position();
		
		// width:150px; height:250px; border:5px
		// Start bei 0 / 0 --> 130 bis 230 
		//alert ('left = '+ Stoppos.left+ 'top = '+Stoppos.top); 
		
		// 250 * 150 px
		var width = $("#vesselsize_depth").width();
		var height = $("#vesselsize_depth").height();
		
		var centerline = width/2;
		var factorX = widthM / (width - 20);	
		var factorY = heightM / (height - 20);	
		
		
		// centerline zero
		if ((centerline - 10) === Stoppos.left){
		//$("#positionGPSCenterline").text(0);
		depthoffset.set({distanceFromCenter: 0});
		}
		
		// backboard links - left
		if (Stoppos.left < (centerline -10)){
		
		var transBX = Stoppos.left - (centerline -10);
		
		//var transBX = Stoppos.left - (centerline -10);
		transBX = transBX * factorX; 
		//alert(transBX);
		
		depthoffset.set({distanceFromCenter: transBX.toFixed(2)});
		}
			
		// steuerboard rechts - right
		if (Stoppos.left > (centerline -10)){
		var transSX = Stoppos.left - (centerline -10);
		transSX = transSX * factorX;
		//$("#positionGPSCenterline").val(transSX.toFixed(2));
		depthoffset.set({distanceFromCenter: transSX.toFixed(2)});
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
		depthoffset.set({distanceFromStern: stern.toFixed(2)});
		
    },
		containment: "#vesselsize_depth",
		scroll: false });
	  },
	  
	  validate: function() {
	  
		var depthoffset = this.model.get('depthoffset');
     				
	  this.removeAlerts();
        var errors = [];
        
	try {			
		if (OSeaM.utils.Validation.depth_distanceFromStern(depthoffset.get('distanceFromStern')) !== true){
			this.markInvalid($('#depth_distanceFromStern'), '1107:Please enter a decimal');
            }}
		catch(e) {
			}	
	try {				
			if (OSeaM.utils.Validation.depth_distanceFromCenter(depthoffset.get('distanceFromCenter')) !== true){
			this.markInvalid($('#depth_distanceFromCenter'), '1107:Please enter a decimal');
            }}
		catch(e) {
			}	
	try {			
		if (OSeaM.utils.Validation.depth_distanceWaterline(depthoffset.get('distanceWaterline')) !== true){
			this.markInvalid($('#depth_distanceWaterline'), '1107:Please enter a decimal');
            }}
		catch(e) {
			}	
	try {			
		if (OSeaM.utils.Validation.depth_offsetKeel(depthoffset.get('offsetKeel')) !== true){
			this.markInvalid($('#depth_offsetKeel'), '1107:Please enter a decimal');
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
var value = $("#depth_distanceFromCenter").val();
value = value.replace(/,/g, '.');
$("#depth_distanceFromCenter").val(value);
	} ,
		replaceStern : function(){
var value = $("#depth_distanceFromStern").val();
value = value.replace(/,/g, '.');
$("#depth_distanceFromStern").val(value);
	} 
});