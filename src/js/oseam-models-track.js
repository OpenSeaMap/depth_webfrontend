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

OSeaM.models.Track = Backbone.Model.extend({
    // The API returns:
    // 0 = not started yes (but id requested)
    // 1 = upload done
    STATUS_STARTING_UPLOAD : 97,
    STATUS_REQUESTING_ID   : 98,
    STATUS_UPLOADING       : 99,
    STATUS_UPLOADED        : 1,
    STATUS_FILECORRUPT     : 2,
    STATUS_PREPROCESSED    : 3,
    STATUS_CONTENT_UNKNOWN    : 4,
    STATUS_DUPLICATE    : 5,
    STATUS_PROCESSED    : 6,
    STATUS_NODATA    : 7,
    defaults: {
    	id : null,
        fileName   : null,
        fileType   : null,
        compression   : null,
        containertrack   : null,
        license   : 'PDDL',
        progress   : null,
        upload_state     : null,
        vesselconfigid : null,
        uploadDate : new Date()
    },
    urlRoot: function() {
//    	return OSeaM.apiUrl + 'track/' + this.get("id");
    	return OSeaM.apiUrl + 'track';
    },
//    url: function() {
//    	return OSeaM.apiUrl + 'track/' + this.get("id");
////    	return OSeaM.apiUrl + 'track';
//    },
    getStatusText: function() {
        switch (this.get('upload_state')) {
            case this.STATUS_STARTING_UPLOAD:
                return '1038:Starting upload ...';
            case this.STATUS_REQUESTING_ID:
                return '1039:Requesting track id ...';
            case this.STATUS_UPLOADING:
                return '1044:Upload in progress ...';
            case this.STATUS_UPLOADED:
                return '1045:Upload done.';
            case this.STATUS_FILECORRUPT:
                return '1050:File Corrupt.';
            case this.STATUS_PREPROCESSED:
                return '1051:Preprocessed';
            case this.STATUS_CONTENT_UNKNOWN:
                return '1052:Content Unknown.';
            case this.STATUS_DUPLICATE:
                return '1053:Duplicate';
            case this.STATUS_PROCESSED:
                return '1054:Processed';
            case this.STATUS_NODATA:
                return '1055:No usable data';
            default:
                return '-';
        }
    },
    getStatusTooltip: function() {
        switch (this.get('upload_state')) {
            case this.STATUS_STARTING_UPLOAD:
                return '1038:Starting upload ...';
            case this.STATUS_REQUESTING_ID:
                return '1039:Requesting track id ...';
            case this.STATUS_UPLOADING:
                return '1044:Upload in progress ...';
            case this.STATUS_UPLOADED:
                return '1300:';
            case this.STATUS_FILECORRUPT:
                return '1301:File Corrupt.';
            case this.STATUS_PREPROCESSED:
                return '1302:Preprocessed';
            case this.STATUS_CONTENT_UNKNOWN:
                return '1301:Content Unknown.';
            case this.STATUS_DUPLICATE:
                return '1303:Duplicate';
            case this.STATUS_PROCESSED:
                return '1304:Processed';
            case this.STATUS_NODATA:
                return '1305:No usable data';
            default:
                return '-';
        }
    },    onReaderLoad: function(evt, file, id) {
        this.set('upload_state', this.STATUS_UPLOADING);
        var fd = new FormData();
        fd.append('track', file);
        fd.append('id' , id)

        var xmlRequest = new XMLHttpRequest();
        xmlRequest.open('PUT', OSeaM.apiUrl + 'track', true);
        xmlRequest.withCredentials = true;
        xmlRequest.responseType = 'text';
        var fnProgress = function(evt) {
            this.onReaderProgress(evt);
        };
        xmlRequest.upload.addEventListener('progress', jQuery.proxy(fnProgress, this));
        var fnDone = function(evt) {
            this.onUploadDone(xmlRequest, evt);
        };
        xmlRequest.addEventListener('load', jQuery.proxy(fnDone, this));
        xmlRequest.send(fd);
    },
    onReaderProgress:function(evt) {
        if (evt.lengthComputable) {
            var percentComplete = Math.round(evt.loaded / evt.total * 100);
            this.set('progress', percentComplete);
        }
    },
    uploadFile: function(file) {
        this.set({
            fileName : file.name,
            status   : this.STATUS_STARTING_UPLOAD
        });
        this.requestNewId(file);
    },
    requestNewId: function(file) {
        this.set('status', this.STATUS_REQUESTING_ID);
        var fn = function(data) {
            this.onNewId(file, data);
        };
//		// issue a post request
		var jqXHR = this.save({}, {
			// TODO: do something with the error
			error: function(newTrack, xhr, options) {
				this.collection.remove(newTrack);
		        console.log(xhr);            
		    },
		    // on success start the progress of upload
            success: jQuery.proxy(fn, this)
		});

//        jQuery.ajax({
//            type: 'POST',
//            url: OSeaM.apiUrl + 'track',
//            contentType: "application/json",
//            dataType: 'json',
//            xhrFields: {
//                withCredentials: true
//            },
//            success: jQuery.proxy(fn, this)
//        });
    },
    onNewId: function(file, data) {
        this.set({
            id       : data.id,
            progress : 1
        });
        this.onReaderLoad(null, file, data.id);
    },
    onUploadDone:function(request, evt) {
//    	console.log("uploadDone" + this.get('upload_state'));
        if (request.status == 200) {
            this.set({
            	upload_state : this.STATUS_UPLOADED,
                progress : null
            });
        }
//    	console.log("uploadDone" + this.get('upload_state'));
    }
});
