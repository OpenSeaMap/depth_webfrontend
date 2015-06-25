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
        'home'         : 'home',
        'about'        : 'about',
        'register'     : 'register',
        'introduction' : 'introduction',
        'tracks'       : 'tracks',
        'vessels'      : 'vessels',
        'gauges'      : 'gauges',
        'user'      : 'user',
        'maptracks'    : 'maptracks',
        'license'      : 'license',
        'instructions' : 'instructions',
        'attributions' : 'attributions',
        'contribute'   : 'contribute',
        '*default'     : 'home'
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
            OSeaM.frontend.startView('Login');
        }
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
        this.renderTopAndNavBar('user');
        OSeaM.frontend.startView('User', {
            model: OSeaM.frontend.getUser()
        });
    },
    register: function() {
        this.renderTopAndNavBar('register');
        OSeaM.frontend.startView('Register', {
            model: OSeaM.frontend.getAuth()
        });
    }, 
    introduction: function() {
        this.renderTopAndNavBar('introduction');
        OSeaM.frontend.startView('Introduction');
    },
    tracks: function() {
        this.renderTopAndNavBar('tracks');
//        if (this.checkAuthenticated() === true) {
            OSeaM.frontend.startView('Tracks', {
                collection : OSeaM.frontend.getTracks(),
                vessels: OSeaM.frontend.getVessels(),
                licenses: OSeaM.frontend.getLicenses()
            });
//        }
    },
    vessels: function() {
    	this.renderTopAndNavBar('vessels');
//    	if (this.checkAuthenticated() === true) {
    	OSeaM.frontend.startView('Vessels', {
    			collection : OSeaM.frontend.getVessels()
    			});
//    	} 
    },
    gauges: function() {
    	this.renderTopAndNavBar('gauges');
//    	if (this.checkAuthenticated() === true) {
    	OSeaM.frontend.startView('Gauges', {
			collection : OSeaM.frontend.getGauges()
		});
//    	}
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
    attributions: function() {
        this.renderTopAndNavBar('attributions');
        OSeaM.frontend.startView('Attributions');
    }
});
