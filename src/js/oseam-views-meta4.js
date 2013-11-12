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

OSeaM.views.meta4 = OSeaM.View.extend({
    modalDialog:null,
    render: function() {
			var language = OSeaM.frontend.getLanguage();
		var template = OSeaM.loadTemplate('meta4-' + language);
        
        var content = $(template({
		 idDepthMeasured:this.model.get('idDepthMeasured'),
      	 idDepthDisplayed:this.model.get('idDepthDisplayed')
				  }));
        OSeaM.frontend.translate(content);
        this.$el.html(content);
        return this;
    },
    validate: function() {
        this.removeAlerts();
        var errors = [];
        
		if (OSeaM.utils.Validation.idDepthMeasured(this.model.get('idDepthMeasured')) !== true){
			this.markInvalid($('#idDepthMeasured'), '1103:Please enter a decimal (e.g. 5.5)');
            //what is this for?
			//errors.push('1004:Email');
        }
		
				if (OSeaM.utils.Validation.idDepthDisplayed(this.model.get('idDepthDisplayed')) !== true){
			this.markInvalid($('#idDepthDisplayed'), '1103:Please enter a decimal (e.g. 5.5)');
            //what is this for?
			//errors.push('1004:Email');
        }
        return this.isValid;
    
    },
	    markInvalid: function(field, text) {
        field.parents('.control-group').addClass('error');
        //field.next('.help-inline').attr('data-trt', text);
		// if addon span exists
		this.$el.find('.help-inline').attr('data-trt', text);
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