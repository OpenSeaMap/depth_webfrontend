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

function GetApiUrl()
{
	var apiUrl = 'APIURL_PLACEHOLDER';

	if ( apiUrl == 'APIURL' + '_' + 'PLACEHOLDER' ) // must assemble here so jenkins does NOT replace it
	{
		// your debug api url goes here. You need not change it before checking in this file,
		// because the above placeholder will be replaced by jenkins during rollout.
		return '/org.osm.depth.upload/api2/';
	}
	else
		return apiUrl;
}

OSeaM = {
    models: {},
    routers: {},
    views: {},
    utils: {},
    container: null,
    frontend: null,
    router: null,
//	apiUrl: 'http://localhost:8000/org.osm.depth.upload/api2/',
	apiUrl: GetApiUrl(),
    autoId: 0,
    mapServerUrl: 'http://osm.franken.de/cgi-bin/mapserv.fcgi?',
    
    init: function() {
		// alert ( "apiUrl: " + this.apiUrl );
//		$.ajaxSetup({ beforeSend: addCredsToRequest })							// function in oseam-models-auth
        OSeaM.configureBackboneSync();											//RKu: set up the server communication defaults
        this.frontend = new OSeaM.models.Frontend();							//RKu: define the business logic of the initial frontend functions (oseam-models-frontend.js)
        if(localStorage.language == null) {
        	localStorage.language = 'en';										//RKu: set default language to "en"
        }
        this.frontend.setLanguage(localStorage.language);
        this.container = $('.oseam-container');									//RKu: set up the place, where all the displays go to
        this.router = new OSeaM.routers.Router();								//RKu: set up the Routing functions
        Backbone.history.start();												//RKu: start monitoring events and dispatching routes
        
        // helper for setting default option
        window.Handlebars.registerHelper('select', function( value, options ){
            var $el = $('<select />').html( options.fn(this) );
            $el.find('[value="' + value + '"]').attr({'selected':'selected'});
            return $el.html();
        });
        //RKu: this might be a good place to check the backend status if it is reachable and up and running
        //RKu: not jet implemented
    },
    
    configureBackboneSync: function() {
        var originalSync = Backbone.sync;
        Backbone.sync = function(method, model, options) {
            options = options || {};
            options.crossDomain = true;
            options.xhrFields   = {
                withCredentials: true
            };
            return originalSync(method, model, options);
        };
    },
    
    loadTemplate: function(template) {
        return Handlebars.templates[template];
    },
    
    id: function(prefix) {
        prefix = prefix || 'oseam-';
        this.autoId++;
        return prefix + this.autoId;
    }
};


OSeaM.View = Backbone.View.extend({
    close: function() {
        this.$el.empty();
        this.undelegateEvents();
    }
});
