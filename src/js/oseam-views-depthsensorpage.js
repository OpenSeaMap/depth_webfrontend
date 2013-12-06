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
    	"mousedown #draggableSounder": "dragStartEvent",
    	"mouseup #vesselsize_depth": "dragStopEvent",
    	"dragver #vesselsize_depth" : "dragOver"
//    	"change #gps_distanceFromStern" : "changeY",
//       	"change #gps_distanceFromCenter" : "changeX"
    },
    dragOver : function(e) {
        e.preventDefault(); 
        return false; 
    },
    dragStartEvent : function(e) {
    	position =  new Object();
    	position.x = e.clientX - parseInt($("#draggableSounder").css("left"),10);
    	position.y = e.clientY - parseInt($("#draggableSounder").css("top"), 10);
    },
    dragStopEvent : function(e) {
//    	$("#draggableGps").css("left", (e.clientX - position.x) + "px");
//    	$("#draggableGps").css("top", (e.clientY - position.y) + "px");
    },
    render: function() {
        var template = OSeaM.loadTemplate('depthsensoroffset');
        var depthoffset = this.model.get('depthoffset');
        var relativeY = depthoffset.get('distanceFromStern') / this.model.get('loa');
        var relativeX = depthoffset.get('distanceFromCenter') / this.model.get('breadth');
        var topY = (((-1) * (relativeY * 250)) + 250) - 10 + "px";
        var leftX = (((relativeX * 150)) + 75) - 10 + "px";
        var content = $(template({
        	depth_distanceFromStern : depthoffset.get('distanceFromStern'),
        	depth_distanceFromCenter : depthoffset.get('distanceFromCenter'),
        	depth_distanceWaterline : depthoffset.get('distanceWaterline'),
        	top : topY,		
        	left : leftX
		}));
        OSeaM.frontend.translate(content);
        this.$el.html(content);
        return this;
    },
    validate: function() {
    	return true;
    }
});