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

OSeaM.views.Track = OSeaM.View.extend({
    tagName: 'tr',
    events: {
        'click .icon-trash' : 'onDelete'
    },
    initialize: function() {
        this.listenTo(this.model, 'change:id',       this.render);
        this.listenTo(this.model, 'change:status',   this.render);
        this.listenTo(this.model, 'change:progress', this.onProgressChange);
    },
    render: function() {
        var template = OSeaM.loadTemplate('track');
        var content = $(template({
            id         : this.model.get('id'),
            fileName   : this.model.get('fileName'),
            progress   : this.model.get('progress'),
            status     : this.model.getStatusText()
        }));
        OSeaM.frontend.translate(content);
        this.$el.html(content);
        this.barEl = this.$el.find('.bar');
        return this;
    },
    onProgressChange: function(model, progress) {
        this.barEl.css('width', progress + '%');
    },
    onDelete: function() {
    	this.model.destroy();
    }
});
