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
        'maptracks'    : 'maptracks',
        'license'      : 'license',
        'attributions' : 'attributions',
        '*default'     : 'home'
    },
    renderTopAndNavBar: function(activeItem) {
        if (this.toolBar === null) {
            this.toolBar = new OSeaM.views.ToolBar({
                el : $('body')
            });
            this.toolBar.render();
        }
        if (this.navBar === null) {
            this.navBar = new OSeaM.views.NavBar({
                el : $('.oseam-navbar')
            });
            this.navBar.render();
        }
        this.toolBar.setActive(activeItem);
        this.navBar.setActive(activeItem);
    },
    home: function() {
        this.renderTopAndNavBar('home');
        OSeaM.frontend.startView('Home');
    },
    about: function() {
        this.renderTopAndNavBar('about');
        OSeaM.frontend.startView('About');
    },
    maptracks: function() {
        this.renderTopAndNavBar('maptracks');
        OSeaM.frontend.startView('MapTracks');
    },
    license: function() {
        this.renderTopAndNavBar('license');
        OSeaM.frontend.startView('License');
    },
    attributions: function() {
        this.renderTopAndNavBar('attributions');
        OSeaM.frontend.startView('Attributions');
    }
});
