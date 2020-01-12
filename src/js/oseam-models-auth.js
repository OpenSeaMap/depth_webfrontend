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

/*
function addCredsToRequest( xhr )
{
	var sessionUser = sessionStorage.getItem( "oseam_username" );
	var sessionPassword = sessionStorage.getItem( "oseam_password" );
	if ( sessionUser && sessionPassword )
		xhr.setRequestHeader( 'Authorization', 'Basic '.concat( btoa( sessionUser + ":" + sessionPassword ) ) );
	/ *
	var basicCredentials = sessionStorage.getItem( "basicCredentials" );
	if ( basicCredentials )
		xhr.setRequestHeader( 'Authorization', 'Basic '.concat( basicCredentials ));
	* /
}
*/

OSeaM.models.Auth = Backbone.Model.extend({
	/*
	constructor: function ( options )
	{
		console.log( 'constructor' );
		Backbone.Model.prototype.constructor.call(this, options);
	},
	*/
	initialize : function()
	{
		console.log( 'init' );
		var sessionUser = sessionStorage.getItem( "oseam_username" );
		if ( sessionUser )
		{
			this.set({username : sessionUser});
			this.set({authenticated : true});
		}
	},
	
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
        return OSeaM.apiUrl + 'users/captcha';
    },
    
    create: function(params) {
        this.set({username : params.username});
        jQuery.ajax({
            type: 'POST',
            url: OSeaM.apiUrl + 'users',
            contentType: "application/x-www-form-urlencoded",
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
//        this.setAuthenticated(true);
    },
    
    onCreateError: function(jqXHR, textStatus, errorThrown) {
        this.trigger('createFailure', jqXHR);
    },
    
    requestNewPassword: function(params) {
        jQuery.ajax({
            type: 'POST',
            url: OSeaM.apiUrl + 'users/reset',
            contentType: "application/x-www-form-urlencoded",
            data: params,
            context: this,
            xhrFields: {
                withCredentials: true
            },
            success: function(data){ this.trigger('passwordResetSuccess', data); },
            error: function(data){ this.trigger('passwordResetFailure', data); },
        });
    },
	
	//RKu: this is the first step of a "form based authentication" login procedure as described at Java EE tutorial
	//request of a protected server resource
	
    login: function(params) {
		
        var params2 = 
		{																//RKu: Parameter für den POST an TomCat setzen
        };
		
		var self=this;
		
        jQuery.ajax({
            type: 'GET',
            url: OSeaM.apiUrl + 'auth/logindummy',
//            data: params2,
            context: this,
//            xhrFields: {
//                withCredentials: true
//            },
            success: function(data){ self.logon( params ) },
            error: function(data){ this.trigger('passwordResetFailure', data); },
        });
    },
	
	
    logon: function(params) {
		
        var params2 = {																//RKu: Parameter für den POST an TomCat setzen
            j_username : params.username,
            j_password : params.password
        };

		var self=this;
		
        jQuery.ajax({
            type: 'POST',
            url: OSeaM.apiUrl + 'j_security_check',
            contentType: "application/x-www-form-urlencoded",
            data: params2,
            context: this,
            xhrFields: {
                withCredentials: true
            },
            success: function(data, success, jqXHR)
			{ 	
				if ( data == "ok" )
				{
					self.onLoginSuccess(); 
					sessionStorage.setItem( "oseam_username", params.username );
				}
				else
					self.onLoginError( jqXHR, "error", "error" ); 
			},
            error: function(jqXHR, textStatus, errorThrown)
			{ 
				self.onLoginError(jqXHR, textStatus, errorThrown); 
			},
        });
    },

    
    oldloginlogin: function(params) {												//RKu: um zu sehen warum der Server nicht positiv antwortet
        this.set({username : params.username});								//RKu: muss das zusammen mit dem TomCat debugged werden

		/*
		sessionStorage.setItem( "oseam_username", params.username );
		sessionStorage.setItem( "oseam_password", params.password );
		$.ajaxSetup({ beforeSend: addCredsToRequest })		
		*/
		
        jQuery.ajax({
            type: 'GET',
			
//			url: OSeaM.apiUrl + 'auth/login',								//RKu: apiUrl: 'http://depth.openseamap.org/org.osm.depth.upload/api2/'
			url: OSeaM.apiUrl + 'vesselconfig',											// TG call any dummy url just to login
            dataType: 'json',												//RKu: Datatyp expected back from the server
//            data: params,													//RKu: enthält username: "xxx.yyy@zzz.de" + password: "converted to MD5"
            context: this,
            xhrFields: {
                withCredentials: true
            },
			password: params.password,
			username: params.username,
            success: this.onLoginSuccess,
            error: this.onLoginError
        });
    },
    
    onLoginSuccess: function(data, success, jqXHR) {
        var usermodel = OSeaM.frontend.getUser();							//RKu: get the Data of the user profile
        var r1 = usermodel.fetch();											//RKu: ... so we can get the forname
        jQuery.when(r1).done(function(){									//RKu: ... as fetch only work async. --> we need to wait a short while until the fetch has completed
            if ( !OSeaM.router.loginSuccess() )								//RKu: ... now we should have a forname 
                OSeaM.frontend.startView('Welcome');						//RKu: ... and can call a 'nice welcome'
        });
        this.setAuthenticated(true);										//RKu: we have to make sure that all UserData are loaded to the model bevor we can "setAuth=true" and trigger "loggedIN"
        this.trigger('loginSuccess', data);									//RKu: the corresponding event handler can be fount at "oseam-routers-router"
    },
    
    onLoginError: function(jqXHR, textStatus, errorThrown) {
        this.trigger('loginFailure', jqXHR);								//RKu: the corresponding event handler does not jet exist
		sessionStorage.removeItem( 'oseam_username' );
		sessionStorage.removeItem( 'oseam_password' );
		/*
        var elements = document.getElementById("oseam-1");					//RKu: {{idUsername}}
        elements.style.backgroundColor = '#FF4500';							//RKu:
        var elements = document.getElementById("oseam-2");					//RKu: {{idPassword}}
        elements.style.backgroundColor = '#FF4500';							//RKu:
		*/
        alert("Login error: " +jqXHR.status + " " + errorThrown + "\nPlease check username and password.");	//RKu: vorübergehend
//        window.location.reload();											//RKu: reload the frontend from the beginning
			$( "#dropdown_login" ).removeClass( "open" );
            OSeaM.frontend.startView('Login', {
				model: OSeaM.frontend.getAuth()
			});					//RKu: View 'Login' == show error message !!! needed as soon we have a proper login procedure
    },
    
    logout: function() {
		/*  4 the time being, there is no logout url on the server. 
			Since the server does not hold sessions anyway, this is not necessary.
			so simply invalidate the cached credentials and re-load the page */
		/*
		sessionStorage.removeItem( 'oseam_username' );
		sessionStorage.removeItem( 'oseam_password' );
		
		this.onLogoutSuccess();
		*/
		
        jQuery.ajax({
            type: 'POST',
            url: OSeaM.apiUrl + 'auth/logout',
//            dataType: 'json',
            context: this,
            xhrFields: {
                withCredentials: true
            },
            success: this.onLogoutSuccess,
            error: this.onLogoutError			// Original Zeile
        });
    },
    
    onLogoutSuccess: function(data, success, jqXHR) {
		sessionStorage.removeItem( 'oseam_username' );
        this.trigger('logoutSuccess', data);
        this.setAuthenticated(false);
        OSeaM.frontend.startView('Goodby');									//RKu: call OSeaM.views.Contact (new .js)
    },
    
    onLogoutError: function(jqXHR, textStatus, errorThrown) {
        this.trigger('logoutFailure', jqXHR);
        alert("Fehlermeldung von TomCat nach Logout: "   +jqXHR.status + " " + errorThrown + "\nZur Sicherheit starte bitte Deinen Browser neu.");	//RKu: vorübergehend
        window.location.reload();											//RKu: reload the frontend from the beginning
    }
});
