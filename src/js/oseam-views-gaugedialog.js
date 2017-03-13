OSeaM.views.GaugeDialog = OSeaM.View.extend({

	events : {
		'click #oseam-cancel' : 'onCancel',
		'click #close' : 'onCancel',
		'click #oseam-save' : 'onSave',
		'change input' : 'modify',
		'change select' : 'modify',
	},
	initialize : function() {
		OSeaM.frontend.on("change:language", this.render, this);
	},
	render : function() {
		var language = OSeaM.frontend.getLanguage();
		var template = OSeaM.loadTemplate('gaugedialog-' + language);
		//var template = OSeaM.loadTemplate('vessel');
		this.renderParams = {
			name : this.model.get('name')
		};
		var content = $(template(this.renderParams));
		OSeaM.frontend.translate(content);
		this.$el.append(content);
		this.el = content;
		return content;
	},
	onCancel : function(evt) {
		// removes the inserted dialog div and stops listening for events
		//        this.wizard.remove();
		this.el.remove();
		this.undelegateEvents();
	},
	onSave : function(evt) {
		/*
		 * If this is new project it won't have the ID attribute defined
		 */
		if (null == this.model.id) {
			/*
			 * We are creating our model through its collection (this way we'll automatically update its views and persist it to DB)
			 */
			this.model.save();
			this.collection.add(this.model);
		} else {
			/*
			 * Simple save will persist the model to the DB and update its view
			 */
			this.model.save();
		}
		/*
		 * Hiding modal dialog window
		 * removes the inserted dialog div and stops listening for events
		 */
		// 
		//        this.wizard.remove();
		this.el.remove();
		this.undelegateEvents();
	},
	modify: function(e) {
		var attribute = {};
    	attribute[e.currentTarget.name] = e.currentTarget.value;
    	this.model.set(attribute);
	}

});