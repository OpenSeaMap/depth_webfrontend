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

OSeaM.views.Login = OSeaM.views.Logindlg.extend({
	
   initialize: function() {
	    OSeaM.frontend.on('change:language', this.render, this);					//RKu: refresh view if user changes language
	},

    events: {
        'submit form'           : 'onFormSubmit'									//RKu: event triggered from submit button in toolbar.handlebares
    },
    render: function() 
	{
        var language = OSeaM.frontend.getLanguage();								//RKu: get current display language
        var template = OSeaM.loadTemplate('login-' + language);						//RKu: load the right handlebar language template						  
		/*
        this.renderParams =  {
            title : '1009:Sign in!',
            msg   : '1032:Please sign in proper to use this part.'
        };
		*/
        var renderParams = {
            idUsername         : OSeaM.id(),										//RKu: transfer Handlebars "{{idUsername}}" from file toolbar.handlebares to a variable
            idPassword         : OSeaM.id(),										//RKu: transfer Handlebars "{{idPassword}}" from file toolbar.handlebares to a variable
            idSubmit           : OSeaM.id(),										//RKu: transfer Handlebars "{{idSubmit}}" from file toolbar.handlebares to a variable
        };

        var content = $(template(renderParams));
        OSeaM.frontend.translate(content);
        this.$el.html(content);

        this.fieldUsername        = this.$el.find('#' + renderParams.idUsername);
        this.fieldPassword        = this.$el.find('#' + renderParams.idPassword);
        this.buttonSubmit         = this.$el.find('#' + renderParams.idSubmit);
		
//        this.$el.find('legend').after(content);
        return this;
    }
});
