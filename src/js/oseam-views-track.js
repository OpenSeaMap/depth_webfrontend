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
    tagName: 'tr', // indicates a tr should wrap a single item
    events: {
        'click .icon-trash' : 'onDelete'
    },
    initialize: function(options) {
        this.listenTo(this.model, 'change:id',       this.render);
        this.listenTo(this.model, 'change:upload_state',   this.render);
        this.listenTo(this.model, 'change:progress', this.onProgressChange);
        this.licenses = options.licenses;
        this.vessels = options.vessels;
    },
    render: function() {
        var template = OSeaM.loadTemplate('track');
        var date = new Date(this.model.get('uploadDate'));
        var fileTypeOrig = "undefined";
        var serverFileType = this.model.get('fileType');
        if(!!serverFileType) {
        	fileTypeOrig = serverFileType.replace("/", "_");
        }
        var licenseName = "-";
        if(!!this.licenses) {
        	var licenseId = this.model.get('license')
        	var license = this.licenses.get(licenseId);
        	if((license)) {
        		licenseName = license.get('shortName'); 
        	} 
        }
        var vesselName = "?";
        if(!!this.vessels) {
        	var vesselId = this.model.get('vesselconfigid')
        	var vessel = this.vessels.get(vesselId);
        	if((vessel)) {
        		vesselName = vessel.get('name'); 
        	} 
        }
        var content = $(template({
            id         : this.model.get('id'),
            fileName   : this.model.get('fileName'),
            progress   : this.model.get('progress'),
            fileType   : fileTypeOrig,
            compression   : this.model.get('compression'),
            containertrack   : this.model.get('containertrack'),
            license   : licenseName, //license.get('name'),
            vesselconfigid : vesselName,
            uploadDate : date.getUTCFullYear() +"-"+
            ("0" + (date.getMonth()+1)).slice(-2) +"-"+
            ("0" + date.getDate()).slice(-2),
            status     : this.model.getStatusText(),
            statustooltip     : this.model.getStatusTooltip()
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
    	if(confirm('Do you really want to delete that track ?')) {
    		this.model.destroy();
    	}
    }
});
