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

//RKu ++ new function "welcome a user after successful login"

OSeaM.views.Welcome = OSeaM.View.extend({
    initialize: function() {
        OSeaM.frontend.on('change:language', this.render, this);
    },

    render: function() {
		var usermodel = OSeaM.frontend.getUser();
        var language = OSeaM.frontend.getLanguage();
        var template = OSeaM.loadTemplate('welcome-' + language);
        var content = $(template({
			firstname: usermodel.attributes.forname }));
        OSeaM.frontend.translate(content);
        this.$el.html(content);
//        var elements = document.getElementById("oseam-4");				//RKu: {{idUsernameReadOnly}}
//        elements.innerHTML = usermodel.attributes.user_name;				//RKu:


		var corr_lang = usermodel.attributes.language;					//RKu: test for supported corrospondens languages
		if (corr_lang !== 'de'&& corr_lang !== 'en'){
			this.removeAlerts();
            var template = OSeaM.loadTemplate('alert');
            var content  = $(template({
                title:'1036:Warnung!',
                msg:'1213:Deine gewählte Korrospondenz-Sprache wird nicht unterstützt. Bitte pass Dein Profile entsprechend an'
            }));
            OSeaM.frontend.translate(content);
            this.$el.find('legend').after(content);
		}

        return this;
    },

    removeAlerts: function() {
        this.$el.find('.alert').remove();
        this.$el.find('.control-group').removeClass('error');
        this.$el.find('.help-inline').removeAttr('data-trt');
        this.$el.find('.help-inline').html('');
        this.isValid = true;
    }
	
});

//RKu --
