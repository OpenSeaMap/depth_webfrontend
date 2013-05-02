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
        'click .oseam-profile'  : 'onProfileSelect',
        'submit form'           : 'onFormSubmit'
    },
    initialize: function() {
        this.model.bind('loggedIn', this.onLoggedIn, this);
        this.model.bind('loggedOut', this.onLoggedOut, this);
    },
    render: function() {
        var template = OSeaM.loadTemplate('toolbar');
        var renderParams = {
            idUsername         : OSeaM.id(),
            idPassword         : OSeaM.id(),
            idSubmit           : OSeaM.id(),
            idUsernameReadOnly : OSeaM.id()
        };
        var content = $(template(renderParams));
        OSeaM.frontend.translate(content);
        this.$el.prepend(content);
        this.fieldUsername        = this.$el.find('#' + renderParams.idUsername);
        this.fieldPassword        = this.$el.find('#' + renderParams.idPassword);
        this.buttonSubmit         = this.$el.find('#' + renderParams.idSubmit);
        this.displayFieldUsername = this.$el.find('#' + renderParams.idUsernameReadOnly);
        this.formAuthenticated    = $(this.$el.find('.pull-right')[0]);
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
        if (OSeaM.utils.Validation.username(this.fieldUsername.val()) !== true) {
            this.markInvalid(this.fieldUsername, '1010:Invalid Email format.');
        }
        if (this.fieldPassword.val().length < 8) {
            this.markInvalid(this.fieldPassword, '1012:At least 8 characters.');
        }
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
        var language = $(evt.target).attr('data-target');
        OSeaM.frontend.setLanguage(language);
    },
    onProfileSelect: function(evt) {
        var item = $(evt.target).attr('data-target');
        if (item === 'logout') {
            this.model.logout();
        }
    },
    onFormSubmit: function(evt) {
        evt.preventDefault();
        this.buttonSubmit.button('loading');
        if (this.validateForm() !== true) {
            this.buttonSubmit.button('reset');
            return;
        }
        var params = {
            username : this.fieldUsername.val(),
            password : this.fieldPassword.val()
        };
        params.password = jQuery.encoding.digests.hexSha1Str(params.password);
        this.model.login(params);
        this.buttonSubmit.button('reset');
        return false;
    },
    onLoggedIn: function(username) {
        this.displayFieldUsername.html(this.model.getUsername());
        this.formAuthenticated.show();
        this.formNotAuthenticated.hide();
    },
    onLoggedOut: function() {
        this.formAuthenticated.hide();
        this.formNotAuthenticated.show();
    }
});
