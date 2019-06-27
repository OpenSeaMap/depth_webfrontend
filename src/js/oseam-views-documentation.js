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

OSeaM.views.Documentation = OSeaM.View.extend({
    initialize: function() {
        OSeaM.frontend.on('change:language', this.render, this);
    },
    render: function() {
		var language = OSeaM.frontend.getLanguage();							//
        var template = OSeaM.loadTemplate('documentation-' + language);			//RKu: defined in "oseam.js"  -  load the function, that may load the content of the file e.g. "documentation-de" to the variable template
        var content = $(template());											//RKu: call jQuery to compile context and load the content of the whole file to the variable "content"
        OSeaM.frontend.translate(content);										//RKu: make sure language sensitiv tags become the right language strings.
        this.$el.html(content);													//RKu: load the "text" of content to the <div class="span9 oseam-container"> but not the attributes we need to jump to anchor inside this document
        return this;
    }
});
