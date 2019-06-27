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

OSeaM.views.ToolBar = OSeaM.View.extend({
    isValid: true,
    events: {
        'click .oseam-language' : 'onLanguageSelect',
        'click .oseam-profile'  : 'onProfileSelect',								//RKu: event triggered from dropdown Logout button in toolbar.handlebares
        'submit form'           : 'onFormSubmit'									//RKu: event triggered from submit button in toolbar.handlebares
    },
    initialize: function() {														//RKu: bind trigger events to function
        this.model.bind('loggedIn', this.onLoggedIn, this);
        this.model.bind('loggedOut', this.onLoggedOut, this);
    },
    render: function() {
        var template = OSeaM.loadTemplate('toolbar');
        var renderParams = {
            idUsername         : OSeaM.id(),										//RKu: transfer Handlebars "{{idUsername}}" from file toolbar.handlebares to a variable
            idPassword         : OSeaM.id(),										//RKu: transfer Handlebars "{{idPassword}}" from file toolbar.handlebares to a variable
            idSubmit           : OSeaM.id(),										//RKu: transfer Handlebars "{{idSubmit}}" from file toolbar.handlebares to a variable
            idUsernameReadOnly : OSeaM.id()											//RKu: transfer Handlebars "{{idUsernameReadOnly}}" from file toolbar.handlebares to a variable
        };
        var content = $(template(renderParams));
        OSeaM.frontend.translate(content);
        this.$el.prepend(content);
        this.fieldUsername        = this.$el.find('#' + renderParams.idUsername);
        this.fieldPassword        = this.$el.find('#' + renderParams.idPassword);
        this.buttonSubmit         = this.$el.find('#' + renderParams.idSubmit);
        this.displayFieldUsername = this.$el.find('#' + renderParams.idUsernameReadOnly);
        this.formAuthenticated    = $(this.$el.find('.pull-right')[0]);				//RKu: see toolbar.handlebars line 23 and 31
        this.formNotAuthenticated = $(this.$el.find('.pull-right')[1]);
        if (this.model.isAuthenticated() === true) {
            this.onLoggedIn();
        } else {
            this.onLoggedOut();
        }
        return this;
    },
    setActive: function(name) {
        this.$el.find('li').removeClass('active');
        this.$el.find('[href=#' + name + ']').parent('li').addClass('active');
    },
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
    },
    
    onLoggedIn: function(username) {												//RKu: toolbar umbauen => alle Felder und Buttons weg; nur noch username anzeigen
        this.displayFieldUsername.html(this.model.getUsername());
        this.formAuthenticated.show();												//RKu: toggel visability: see toolbar.handlebars line 23 and 31
        this.formNotAuthenticated.hide();
    },
    onLoggedOut: function() {														//RKu: toolbar umbauen => username weg und alle Felder und Buttons wieder anzeigen
        this.formAuthenticated.hide();												//RKu: toggel visability: see toolbar.handlebars line 23 and 31
        this.formNotAuthenticated.show();
    }
});
