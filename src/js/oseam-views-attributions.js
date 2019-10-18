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

OSeaM.views.Attributions = OSeaM.View.extend({

    initialize: function() {
        OSeaM.frontend.on('change:language', this.render, this);
    },
    
    render: function() {
		var language = OSeaM.frontend.getLanguage();						//RKu: add language diversification
		var template = OSeaM.loadTemplate('attributions-' + language);		//RKu: add language selection
        var content = $(template({
            javascript:[{
                name:'Bootstrap',
                url:'http://twitter.github.com/bootstrap'
            },{
                name:'BACKBONE.JS',
                url:'http://backbonejs.org'
            },{
                name:'handlebars',
                url:'http://handlebarsjs.com'
            },{
                name:'jQuery',
                url:'http://jquery.com'
            },{
                name:'jQuery SHA1 (plugin)',
                url:'http://jquery.tiddlywiki.org/encoding.digests.sha1.html'
            }],
            images:[{
                name:'GLYPHICONS',
                url:'http://glyphicons.com'
            }]
        }));
        OSeaM.frontend.translate(content);
        this.$el.html(content);
        return this;
    }
});
