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

OSeaM.views.vesselpage = OSeaM.View.extend({
    modalDialog:null,
	events : {
		'change .vesseltype' : 'onChangeVesselType',
		'change #loa' : 'replaceLoa',
       	'change #breadth' : 'replaceBreadth'
	},
	render: function() {
	var language = OSeaM.frontend.getLanguage();
		var template = OSeaM.loadTemplate('vesselgeneric-' + language);
        

        this.renderParams =  {
        		loa   : this.model.get('loa'),
        		breadth   : this.model.get('breadth'),
        		draft   : this.model.get('draft'),
        		displacement   : this.model.get('displacement'),
        		height   : this.model.get('height'),
        		manufacturer   : this.model.get('manufacturer'),
        		model   : this.model.get('model')
        };
        var content = $(template(this.renderParams));
        OSeaM.frontend.translate(content);
        this.$el.html(content);
		this.$el.find("#vesseltype option[value=" + this.model.get('vesselType') + "]").attr("selected", "selected");
        return this;
    },
    
	    validate: function() {

	  this.removeAlerts();
        var errors = [];
		
						// length required for the next step 
				if (!this.model.get('loa')) {
								
					this.markInvalid($('#loa'),	'1105:Please enter the vessel length');
				}
				
				// beam required for the next step 
				if (!this.model.get('breadth')) {
								
					this.markInvalid($('#breadth'),	'1106:Please enter the beam');
				}
        		
		if (OSeaM.utils.Validation.loa(this.model.get('loa')) !== true){
			this.markInvalid($('#loa'), '1103:Please enter a decimal (e.g. 5.5)');
            }
			
		if (OSeaM.utils.Validation.breadth(this.model.get('breadth')) !== true){
			this.markInvalid($('#breadth'), '1103:Please enter a decimal (e.g. 5.5)');
                    }
		if (OSeaM.utils.Validation.draft(this.model.get('draft')) !== true){
			this.markInvalid($('#draft'), '1103:Please enter a decimal (e.g. 5.5)');
            }
				if (OSeaM.utils.Validation.displacement(this.model.get('displacement')) !== true){
			this.markInvalid($('#displacement'), '1103:Please enter a decimal (e.g. 5.5)');
            }
		if (OSeaM.utils.Validation.height(this.model.get('height')) !== true){
			this.markInvalid($('#height'), '1103:Please enter a decimal (e.g. 5.5)');
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
    onChangeVesselType : function() {
		this.model.set('vesselType', $("#vesseltype").val());
	},
	removeAlerts: function() {
        this.$el.find('.alert').remove();
        this.$el.find('.control-group').removeClass('error');
        this.$el.find('.help-inline').removeAttr('data-trt');
        this.$el.find('.help-inline').html('');
        this.isValid = true;
    },
			replaceLoa : function(){
var value = $("#loa").val();
value = value.replace(/,/g, '.');
$("#loa").val(value);
	} ,
		replaceBreadth : function(){
var value = $("#breadth").val();
value = value.replace(/,/g, '.');
$("#breadth").val(value);
	} 
});