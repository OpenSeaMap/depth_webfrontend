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
    events : {																	//RKu neu:
        'click #profile-update'  : 'onProfileUpdate',
        'click #password-update' : 'onPasswordUpdate'
        },
    
    initialize: function() {
        OSeaM.frontend.on('change:language', this.render, this);
        this.listenTo(this.model, 'change', this.render);
        this.model.fetch();
    },
    render: function() {
        var language = OSeaM.frontend.getLanguage();
        var template = OSeaM.loadTemplate('user-' + language);					// default language is "en"
        var content = $(template( {
            user_name      : this.model.get('user_name'),						//RKu:
            forename       : this.model.get('forname'),
            surname        : this.model.get('surname'),
            organisation   : this.model.get('organisation'),
            phone          : this.model.get('phone'),							//RKu: this is just a temporary solution as long bfhphone is not really working
            acceptedEmailContact   : this.model.get('acceptedEmailContact')
        }));
        OSeaM.frontend.translate(content);
        this.$el.html(content);
        
        // RKu: das Captcha soll nur einmal abgefragt werde ... durch die verschiedenen Events kommt es vor, dass es mehrfach erscheint
        // RKu: das muss ic noch besser machen bzw ganz weg lassen, da der PW Change ohnehin nur in eingeloggten Zustand möglich ist
        var that = this;														//RKu: save me the right context
        jQuery.ajax({															//RKu: request a captcha from server
            type: 'POST',
            url: OSeaM.apiUrl + 'users/captcha',
            contentType: "application/json",
            dataType: 'json',

            success:	function(data){											//RKu: show requested Captcha
                            that.removeCaptcha(data);
                            that.replaceCaptcha(data) },
            error:		function(xhr, textStatus, error){						//RKu: implement error handling
            				xhr.status;
            				xhr.responseText;
							that.NoCaptchaError(xhr); }
        });
        
        $('#countries').bfhcountries({country: this.model.get('country')});
        $('#languages').bfhlanguages({language: this.model.get('language')});

//        if(this.model.get('phone') == null) {									//RKu: there might be a bug in bfhphone as it is not workin as expected
//        	$('#phones').bfhphone({country: 'countries'});
//        } else {
//        	$('#phones').bfhphone({country: 'countries', phone : this.model.get('phone')});
//        }

        return this;
    },
    
    onProfileUpdate: function () {												//RKu neu:
        
        this.model.set({														//RKu: set the new Data into the current user profile model
            forname: document.getElementById("forename").value,
            surname: document.getElementById("surname").value,
            organisation:document.getElementById("organisation").value,
            country     :document.getElementById("countries").value,
            language    :document.getElementById("languages").value,
            phone       :document.getElementById("phones").value
            });
            
        var params = this.model.attributes;
        
        this.model.save(params,{
            url: OSeaM.apiUrl + 'users/update',
            type: 'PUT',														//RKu: PUT means update data at an existing server model
            success: function (model,response){console.log('Profile erfolgreich gespeichert')},
            error:   function (model,error){console.log('look at error.responseText')}
            });																	//RKu: ... so we can send the new Data to the server Database
            
        console.log('Profile update ' +											//RKu: only for testing purpes
               '\nVorname : '  + this.model.attributes.forname +
               '\nNachname : ' + this.model.attributes.surname +
               '\nTelefon : '  + this.model.attributes.phone);
    },
    
    onPasswordUpdate: function () {												//RKu neu:
        this.removeCaptcha();
        console.log('Password update ' +
               '\n... aber soweit sind wir noch nicht ...');
    },
    
    NoCaptchaError: function(xhr) {												//RKu: ++ this error message handler was missing
        this.removeAlerts();
        var errors = [];

        if ((xhr.status) == 0) {errors.push('2000:Could not find a server with the given host name')}
        if ((xhr.status) == 400) {errors.push('2400:Status 0 Server understood the request, but request content was invalid.')}
        if ((xhr.status) == 401) {errors.push('2401:Status 401 Unauthorized access.')}
        if ((xhr.status) == 403) {errors.push('2403:Status 403 Forbidden resource cannot be accessed.')}
        if ((xhr.status) == 404) {errors.push('2404:Status 404 This service is unavailable.')}
        if ((xhr.status) == 500) {errors.push('2500:Status 500 Internal server error.')}
        if ((xhr.status) == 503) {errors.push('2503:Status 503 This service is unavailable.')}
//		wenn nicht dann {errors.push('2510: Unknown error.')}
        errors.push('1410:no Captcha received from Server');
			
        var template = OSeaM.loadTemplate('alert');
        var content  = $(template({
            title:'1030:Server error occured.',
            errors:errors
        }));
        OSeaM.frontend.translate(content);
        this.$el.find('legend').after(content);
    },																			//RKu: -- this error message handler was missing
    
    replaceCaptcha: function(data) {
    	this.$el.find('#captcha').removeClass('loading').append('<img id="captcha" src="data:image/png;base64,' + data.imageBase64 + '"/>')
    },
    
    removeCaptcha: function() {
    	this.$el.find('#captcha').removeClass('loading')
    },
    
    removeAlerts: function() {
        this.$el.find('.alert').remove();
        this.$el.find('.control-group').removeClass('error');
        this.$el.find('.help-inline').removeAttr('data-trt');
        this.$el.find('.help-inline').html('');
        this.isValid = true;
    }


});
