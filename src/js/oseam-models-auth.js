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

OSeaM.models.Auth = Backbone.Model.extend({
    setAuthenticated: function(value) {
        this.set({
            authenticated : value
        });
        if (value === true) {
            this.trigger('loggedIn', this.get('username'));
        } else {
            this.trigger('loggedOut');
        }
    },
    isAuthenticated: function() {
        if (this.has('authenticated') && this.get('authenticated') === true) {
            return true;
        } else {
            return false;
        }
    },
    getUsername: function() {
        return this.get('username');
    },
    getCaptchaUrl: function() {
        return OSeaM.apiUrl + '/auth/captcha#' + new Date().getTime();
    },
    create: function(params) {
        this.set({username : params.username});
        jQuery.ajax({
            type: 'POST',
            url: OSeaM.apiUrl + '/auth/create',
            dataType: 'json',
            data: params,
            context: this,
            xhrFields: {
                withCredentials: true
            },
            success: this.onCreateSuccess,
            error: this.onCreateError
        });
    },
    onCreateSuccess: function(data, success, jqXHR) {
        this.trigger('createSuccess', data);
        this.setAuthenticated(true);
    },
    onCreateError: function(jqXHR, textStatus, errorThrown) {
        this.trigger('createFailure', jqXHR);
    },
    login: function(params) {
        this.set({username : params.username});
        jQuery.ajax({
            type: 'POST',
            url: OSeaM.apiUrl + '/auth/login',
            dataType: 'json',
            data: params,
            context: this,
            xhrFields: {
                withCredentials: true
            },
            success: this.onLoginSuccess,
            error: this.onLoginError
        });
    },
    onLoginSuccess: function(data, success, jqXHR) {
        this.trigger('loginSuccess', data);
        this.setAuthenticated(true);
    },
    onLoginError: function(jqXHR, textStatus, errorThrown) {
        this.trigger('loginFailure', jqXHR);
    },
    logout: function() {
        jQuery.ajax({
            type: 'POST',
            url: OSeaM.apiUrl + '/auth/logout',
            dataType: 'json',
            context: this,
            xhrFields: {
                withCredentials: true
            },
            success: this.onLogoutSuccess,
            error: this.onLogoutError
        });
    },
    onLogoutSuccess: function(data, success, jqXHR) {
        this.trigger('logoutSuccess', data);
        this.setAuthenticated(false);
    },
    onLogoutError: function(jqXHR, textStatus, errorThrown) {
        this.trigger('logoutFailure', jqXHR);
    }
});
