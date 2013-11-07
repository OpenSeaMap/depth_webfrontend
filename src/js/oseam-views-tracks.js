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

OSeaM.views.Tracks = OSeaM.View.extend({
    events: {
        'change .oseam-upload-wrapper input' : 'onFileSelected'
    },
    initialize: function() {
        this.listenTo(this.collection, 'add', this.onAddItem);
//        this.listenTo(this.collection, 'change', this.render);
        this.listenTo(this.collection, 'remove', this.render);
//        this.listenTo(this.collection, 'reset', this.render);
    },
    render: function() {
        var template = OSeaM.loadTemplate('tracks');
        var content = $(template());
        OSeaM.frontend.translate(content);
        this.$el.html(content);
        this.listEl = this.$el.find('tbody');
        this.collection.forEach(this.onAddItem, this);
        this.collection.fetch();
        return this;
    },
    onFileSelected: function(evt) {
        for (var i = 0; i < evt.target.files.length; i++) {
            this.collection.uploadFile(evt.target.files[i]);
        }
    },
    onAddItem: function(model) {
        var view = new OSeaM.views.Track({
            model: model
        });
        this.listEl.append(view.render().el);
        return this;
    }
});
