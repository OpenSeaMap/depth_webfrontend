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

OSeaM.utils.Validation = {
	username : function(value) {
		return OSeaM.utils.Validation.email(value);
	},

	email : function(value) {
//		var reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		var reg = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9_\-\+])+\.)+([a-zA-Z0-9]{2,4})+$/;		RKu:
		return reg.test(value);
	},

	configname : function(value) {
		// test for special characters
		var reg = /^[a-z A-Z0-9]+$/;
		return reg.test(value);
	},

		distanceY: function(value) {
		// test for decimal
		var reg = /^\d*(,|\.)?\d*$/;		
        return reg.test(value);
	},
	
		loa: function(value) {
		// test for decimal
		// old, only . not ,
		//var reg = /^\d*\.?\d*$/;
		var reg = /^\d*(,|\.)?\d*$/;
		return reg.test(value);	
	},

	depth_distanceFromStern: function(value) {
	// test for decimal
	var reg = /^-?\d*(,|\.)?\d*$/;
     return reg.test(value);
	},

	depth_distanceFromCenter: function(value) {
	// test for decimal
	var reg = /^-?\d*(,|\.)?\d*$/;
    return reg.test(value);
	},

	depth_distanceWaterline: function(value) {
	// test for decimal
	var reg = /^\d*(,|\.)?\d*$/;
    return reg.test(value);
		},
		
		
	depth_offsetKeel: function(value) {
		// test for decimal
	var reg = /^\d*(,|\.)?\d*$/;
        return reg.test(value);
	},
	
	gps_distanceFromStern: function(value) {
	// test for decimal
	var reg = /^-?\d*(,|\.)?\d*$/;
      return reg.test(value);
	},

	gps_distanceFromCenter: function(value) {
	// test for decimal
	var reg = /^-?\d*(,|\.)?\d*$/;
        return reg.test(value);
	},
	
	gps_distanceWaterline: function(value) {
	// test for decimal
	var reg = /^\d*(,|\.)?\d*$/;	
    return reg.test(value);
	},

	gauge: function(value) {
	// test for decimal
	var reg = /^\d*(,|\.)?\d*$/;
    return reg.test(value);
	},
	
	distanceX: function(value) {
	// test for decimal
	var reg = /^\d*(,|\.)?\d*$/;
    return reg.test(value);
		},
		
	breadth: function(value) {
	// test for decimal
	var reg = /^\d+(,|\.)?\d*$/;
        return reg.test(value);
	},
	
	draft: function(value) {	
	// test for decimal
	var reg = /^\d*(,|\.)?\d*$/;
    return reg.test(value);
	},
	
	displacement: function(value) {
	// test for decimal
	var reg = /^\d*(,|\.)?\d*$/;
        return reg.test(value);
	},
	
	height: function(value) {
	// test for decimal
	var reg = /^\d*(,|\.)?\d*$/;
    return reg.test(value);
	},
	
	slidingspeed: function(value) {
	// test for decimal
	var reg = /^\d*(,|\.)?\d*$/;
    return reg.test(value);
	},
	
	idDepthMeasured: function(value) {
	// test for decimal
	var reg = /^\d*(,|\.)?\d*$/;
    return reg.test(value);
	},

	idDepthDisplayed: function(value) {
	// test for decimal
	var reg = /^\d*(,|\.)?\d*$/;
    return reg.test(value);
	}

};
