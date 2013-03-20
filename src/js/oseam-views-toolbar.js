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
    events: {
        'click .oseam-language' : 'onLanguageSelect'
    },
    render: function() {
        var template = OSeaM.loadTemplate('toolbar');
        var content = $(template());
        OSeaM.frontend.translate(content);
        this.$el.prepend(content);
        return this;
    },
    setActive: function(name) {
        this.$el.find('li').removeClass('active');
        this.$el.find('[href=#' + name + ']').parent('li').addClass('active');
    },
    onLanguageSelect: function(evt) {
        var language = $(evt.target).attr('data-target');
        OSeaM.frontend.setLanguage(language);
    }
});
