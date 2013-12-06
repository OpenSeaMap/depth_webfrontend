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
        var template = OSeaM.loadTemplate('gpsoffset');
        var sbasoffset = this.model.get('sbasoffset'); 
        var relativeY = sbasoffset.get('distanceFromStern') / this.model.get('loa');
        var relativeX = sbasoffset.get('distanceFromCenter') / this.model.get('breadth');
        var topY = (((-1) * (relativeY * 250)) + 250)- 10 + "px";
        var leftX = (((relativeX * 150)) + 75) - 10 + "px";
        var content = $(template({
        	gps_distanceFromStern : sbasoffset.get('distanceFromStern'),
        	gps_distanceFromCenter : sbasoffset.get('distanceFromCenter'),
        	gps_distanceWaterline : sbasoffset.get('distanceWaterline'),
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
    	return true;
    }
});