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

OSeaM.routers.Router = Backbone.Router.extend({
    toolBar: null,
    navBar: null,
    routes: {
        'home'				: 'home',
        'about'				: 'about',
        'register'			: 'register',
        'reset-password'	: 'resetPassword',
        'introduction'		: 'introduction',
        'tracks'			: 'tracks',
        'vessels'			: 'vessels',
        'gauges'			: 'gauges',
        'user'				: 'user',
        'maptracks'			: 'maptracks',
        'instructions'		: 'instructions',
        'license'			: 'license',
        'contribute'		: 'contribute',
        'documentation'		: 'documentation',
        'attributions'		: 'attributions',
        'contact'			: 'contact',									//RKu: add this new function
        'welcome'			: 'welcome',									//RKu: add this new function
        'goodby'			: 'goodby',										//RKu: add this new function
        '*default'			: 'nix'											//RKu: just do nothing has replaced home to allow that "table of contens" will work
    },
    renderTopAndNavBar: function(activeItem) {
        if (this.toolBar === null) {
            this.toolBar = new OSeaM.views.ToolBar({
                el    : $('body'),
                model : OSeaM.frontend.getAuth()
            });
            this.toolBar.render();
        }
        if (this.navBar === null) {
            this.navBar = new OSeaM.views.NavBar({
                el    : $('.oseam-navbar'),
                model : OSeaM.frontend.getAuth()
            });
            this.navBar.render();
        }
        this.toolBar.setActive(activeItem);
        this.navBar.setActive(activeItem);
    },
    checkAuthenticated: function() {
        if (OSeaM.frontend.getAuth().isAuthenticated() === true) {
            return true;
        } else {
//            OSeaM.frontend.startView('Login');					//RKu: View 'Login' == show error message !!! needed as soon we have a proper login procedure
			return false;
        }
    },
	activateRestricted: function()
	{
        if (this.checkAuthenticated() === true) 
		{
			return true;
        }														//RKu: das auch
		else
		{
			alert( "please log in to use this function!" );
			history.back();
			return false;
		}
	},
    nix: function() {											//RKu: do nothing function will to allow that "table of contens" will work
        this.renderTopAndNavBar('home');
    },
    home: function() {
        this.renderTopAndNavBar('home');
        OSeaM.frontend.startView('Home');
    },
    about: function() {
        this.renderTopAndNavBar('about');
        OSeaM.frontend.startView('About');
    },
    
    user: function() {
        if (this.activateRestricted() === true) {				//RKu: muss mit Login wieder aktiviert werden
			this.renderTopAndNavBar('user');						//RKu: mit Login  zus. Abfrage und Änderungen speichern einbauen
			OSeaM.frontend.startView('User', {
				model: OSeaM.frontend.getUser()
			});
		}
    },
    
    register: function() {
        this.renderTopAndNavBar('register');
        OSeaM.frontend.startView('Register', {
            model: OSeaM.frontend.getAuth()
        });
    },
    resetPassword: function() {
        this.renderTopAndNavBar('resetPassword');				//RKu: Eintrag war falsch: 'ResetPassword' => 'resetPassword'
        OSeaM.frontend.startView('ResetPassword', {
            model: OSeaM.frontend.getAuth()
        });
    },
    introduction: function() {
        this.renderTopAndNavBar('introduction');
        OSeaM.frontend.startView('Introduction');
    },
    
    tracks: function() {
        if (this.activateRestricted() === true) {				//RKu: muss mit Login wieder aktiviert werden
			this.renderTopAndNavBar('tracks');
            OSeaM.frontend.startView('Tracks', {
                collection : OSeaM.frontend.getTracks(),
                vessels: OSeaM.frontend.getVessels(),
                licenses: OSeaM.frontend.getLicenses()
            });
        }														//RKu: das auch
	},
	
    vessels: function() {
        if (this.activateRestricted() === true) {				//RKu: muss mit Login wieder aktiviert werden
			this.renderTopAndNavBar('vessels');
			OSeaM.frontend.startView('Vessels', {
					collection : OSeaM.frontend.getVessels()
					});
    	}														//RKu: das auch
    },
    gauges: function() {
//        if (this.activateRestricted() === true) {				//RKu: muss mit Login wieder aktiviert werden
			this.renderTopAndNavBar('gauges');
			OSeaM.frontend.startView('Gauges', {
				collection : OSeaM.frontend.getGauges()
			});
//    	}														//RKu: das auch
    },
    maptracks: function() {
        this.renderTopAndNavBar('maptracks');
        OSeaM.frontend.startView('MapTracks');
    },
    instructions: function() {
        this.renderTopAndNavBar('instructions');
        OSeaM.frontend.startView('Instructions');
    },
    license: function() {
        this.renderTopAndNavBar('license');
        OSeaM.frontend.startView('License');
    },
    contribute: function() {
        this.renderTopAndNavBar('contribute');
        OSeaM.frontend.startView('Contribute');
    },
    documentation: function() {
        this.renderTopAndNavBar('documentation');
        OSeaM.frontend.startView('Documentation');
    },
    attributions: function() {
        this.renderTopAndNavBar('attributions');
        OSeaM.frontend.startView('Attributions');
    },
    contact: function() {										//RKu: add this new function
        this.renderTopAndNavBar('contact');
        OSeaM.frontend.startView('Contact');					//RKu: call OSeaM.views.Contact (new .js)
    },
    welcome: function() {										//RKu: add this new function
        this.renderTopAndNavBar('welcome');
        OSeaM.frontend.startView('Welcome');					//RKu: call OSeaM.views.Contact (new .js)
    },
    goodby: function() {										//RKu: add this new function
        this.renderTopAndNavBar('goodby');
        OSeaM.frontend.startView('Goodby');						//RKu: call OSeaM.views.Contact (new .js)
    }
});
