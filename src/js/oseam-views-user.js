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

OSeaM.views.User = OSeaM.View.extend({
    initialize: function() {
        OSeaM.frontend.on('change:language', this.render, this);
        this.listenTo(this.model, 'change', this.render);
        this.model.fetch();
    },
    render: function() {
        var language = OSeaM.frontend.getLanguage();
        var template = OSeaM.loadTemplate('user-' + language);
        var content = $(template( {
            user_name         : this.model.get('user_name'),
            forename   : this.model.get('forname'),
            surname   : this.model.get('surname'),
            organisation   : this.model.get('organisation'),
            acceptedEmailContact   : this.model.get('acceptedEmailContact')
        }));
        OSeaM.frontend.translate(content);
        this.$el.html(content);
        $('#countries').bfhcountries({country: this.model.get('country')});
        $('#countries2').bfhcountries({country: this.model.get('country'), flags : true});
        $('#languages').bfhlanguages({language: this.model.get('language')});
        if(this.model.get('phone') == null) {
        	$('#phones').bfhphone({country: 'countries'});
        } else {
        	$('#phones').bfhphone({country: 'countries', phone : this.model.get('phone')});
        }
        return this;
    }
});
