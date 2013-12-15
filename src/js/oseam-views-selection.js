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

OSeaM.views.Selection = OSeaM.View.extend({
	initialize : function() {
		_.bindAll(this, 'addOne', 'addAll');
		this.addAll();
		this.listenTo(this.collection, 'add', this.addOne);
		
	},
	addOne : function(model) {
		$(this.el).append(new OSeaM.views.SelectionItem({
			model : model
		}).render().el);
	},
	addAll : function() {
		this.collection.each(this.addOne);
	}
});
