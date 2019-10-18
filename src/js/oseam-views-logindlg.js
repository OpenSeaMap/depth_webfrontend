// -------------------------------------------------------------------------------------------------
// OpenSeaMap Water Depth - Web frontend for depth data handling.
//
// Written in 2019 by Thomas Goerner
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain
// worldwide. This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along
// with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
// -------------------------------------------------------------------------------------------------

OSeaM.views.Logindlg = OSeaM.View.extend({
	/*
	prepareRender: function( template )
	{
        var renderParams = {
            idUsername         : OSeaM.id(),										//RKu: transfer Handlebars "{{idUsername}}" from file toolbar.handlebares to a variable
            idPassword         : OSeaM.id(),										//RKu: transfer Handlebars "{{idPassword}}" from file toolbar.handlebares to a variable
            idSubmit           : OSeaM.id(),										//RKu: transfer Handlebars "{{idSubmit}}" from file toolbar.handlebares to a variable
            idUsernameReadOnly : OSeaM.id()											//RKu: transfer Handlebars "{{idUsernameReadOnly}}" from file toolbar.handlebares to a variable
        };
        var content = $(template(renderParams));
        OSeaM.frontend.translate(content);
		return renderParams;
	},
	*/
    validateForm: function() {
        this.removeAlerts();
        var errors = [];															//RKu: create a new error field variable
		
        if (OSeaM.utils.Validation.username(this.fieldUsername.val()) !== true) {	//RKu: username valid
            this.markInvalid(this.fieldUsername, '1010:Invalid Email format.');
			errors.push('1010:Invalid Email format.');								//RKu: add this error
        }
        if (this.fieldPassword.val().length < 8) {									//RKu: password length valid
            this.markInvalid(this.fieldPassword, '1012:At least 8 characters.');
            errors.push('1017:Password verification', '1012:At least 8 characters.');	//RKu: add this error
        }
        if (this.isValid !== true) {												//RKu: ++
            var template = OSeaM.loadTemplate('alert');
            var content  = $(template({
                title:'1027:Validation error occured',
                errors:errors
            }));
            OSeaM.frontend.translate(content);
            this.$el.find('legend').after(content);									//RKu: send the collected errors to the terminal
        }																			//RKu --
        return this.isValid;
	},
    markInvalid: function(field, text) {
        field.parents('.control-group').addClass('error');
        field.next('.help-inline').attr('data-trt', text);
        OSeaM.frontend.translate(this.$el);
        this.isValid = false;
    },
    removeAlerts: function() {
        this.$el.find('.control-group').removeClass('error');
        this.isValid = true;
    },
    onLanguageSelect: function(evt) {
        var language = $(evt.target).attr('data-target');							//RKu: get selected language "en" or "de"
        OSeaM.frontend.setLanguage(language);
    },
    onProfileSelect: function(evt) {
        var item = $(evt.target).attr('data-target');
        if (item === 'logout') {
            this.model.logout();
        }
    },
    onFormSubmit: function(evt) {													//RKu: Event submit (button "Login") in toolbar.handlebars wurde ausgelöst
        evt.preventDefault();
        this.buttonSubmit.button('loading');										//RKu: anzeigen, das die Eingabe bearbeitet wird
        if (this.validateForm() !== true) {											//RKu: ist der username (e-Mail Format) richtig und hat das password mehr als 8 Zeichen
            this.buttonSubmit.button('reset');										//RKu:
            return;
        }
        var params = {																//RKu: Parameter für den POST an TomCat setzen
            username : this.fieldUsername.val(),
            password : this.fieldPassword.val()
        };
        // params.password = jQuery.encoding.digests.hexSha1Str(params.password).toLowerCase();	//RKu: Password verschlüsseln, ganz wichtig: "toLowerCase()", da die PW so in der DB gespeichert sind.
																								// NO! this pwd is sent by basic auth.
        this.model.login(params);													//RKu: ruft in oseam-models-auth.js die funktion login auf
        this.buttonSubmit.button('reset');
        return false;
    }
});
