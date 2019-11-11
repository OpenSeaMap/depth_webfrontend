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
        var template = OSeaM.loadTemplate('user-' + language);					//RKu: default language is "en"
        var checked = this.model.get('acceptedEmailContact');                   //RKu: look at the model if the user wants to get eMails
        if (checked == true){checked = 'checked'}else{checked = 'null'}         //RKu: update the view according the user expectation
        var content = $(template( {
            user_name      : this.model.get('user_name'),						//RKu:
            forename       : this.model.get('forname'),
            surname        : this.model.get('surname'),
            organisation   : this.model.get('organisation'),
            phone          : this.model.get('phone'),							//RKu: this is just a temporary solution as long bfhphone is not really working
            acceptedEmailContact   : checked                                    //RKu: set 'checked' or 'null' at the handlebars template to show the status of the tickbox 
        }));
        OSeaM.frontend.translate(content);
        this.$el.html(content);
        
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
            phone       :document.getElementById("phones").value,
            acceptedEmailContact :document.getElementById("acceptedEmailContact").checked
            });
            
        var params = this.model.attributes;
        
        this.model.save(params,{
            url: OSeaM.apiUrl + 'users/update',
            type: 'PUT',														//RKu: PUT means update data at an existing server model
            success: function (model,response){console.log('Profile erfolgreich gespeichert')},
            error:   function (model,error){console.log('look at error.responseText');
                    var element1 = document.getElementById("profile-update");
                    element1.innerHTML = 'erledigt';
                    element1.style.backgroundColor = '#01DF01';
                }
            });																	//RKu: ... so we can send the new Data to the server Database
            
        console.log('Profile update ' +											//RKu: only for testing purpes
               '\nVorname : '  + this.model.attributes.forname +
               '\nNachname : ' + this.model.attributes.surname +
               '\nacceptEmail : ' + this.model.attributes.acceptedEmailContact +
               '\nTelefon : '  + this.model.attributes.phone);
               
    },
    
    onPasswordUpdate: function () {												//RKu neu:
        console.log('Password update ' +
               '\n... aber soweit sind wir noch nicht ...');
        
        var params ={
                    oldPassword  : document.getElementById("oldPassword").value,
                    neuPassword1 : document.getElementById("newPassword").value,
                    neuPassword2 : document.getElementById("newPassword2").value
                    };

        this.checkPassword(params);
        
        if (this.isValid){
            console.log('Password valid');

            params.oldPassword  = jQuery.encoding.digests.hexSha1Str(params.oldPassword).toLowerCase();		    // password encryption
            params.neuPassword1 = jQuery.encoding.digests.hexSha1Str(params.neuPassword1).toLowerCase();		// password encryption
            params.neuPassword2 = jQuery.encoding.digests.hexSha1Str(params.neuPassword2).toLowerCase();		// password encryption
            
            console.log('Old Password : ' + params.oldPassword +
                     '\nNew Password1 : ' + params.neuPassword1 +
                     '\nNew Password2 : ' + params.neuPassword2);

            var data = {oldPassword:params.oldPassword, newPassword:params.neuPassword1};
//            var data = [params.oldPassword, params.neuPassword1];
            jQuery.ajax({
                type: 'POST',
                url: OSeaM.apiUrl + 'users/changepass',
                contentType: "application/x-www-form-urlencoded",
                data: data,
                datatype: 'json',
                context: this,
//                xhrFields: {
//                    withCredentials: true
//                },
                success: function(data){ this.trigger('passwordResetSuccess', data);
                        var element2 = document.getElementById("password-update");
                        element2.innerHTML = 'erledigt';
                        element2.style.backgroundColor = '#01DF01';
                },
                error: function(data){ this.trigger('passwordResetFailure', data); }
            });
        };
    },
    
    checkPassword: function(params){
        this.removeAlerts();
        var errors = [];
        if (params.neuPassword1 !== params.neuPassword2){
            errors.push('1017:Password verification');
            this.isValid = false;
            };

        if ((params.neuPassword1.length < 8) || (params.neuPassword2.length < 8)){
            errors.push('1012:At least 8 characters');
            this.isValid = false;
            };
            
        if (this.isValid !== true) {
            var template = OSeaM.loadTemplate('alert');
            var content  = $(template({
                title:'1027:Validation error occured',
                errors:errors
            }));
            OSeaM.frontend.translate(content);
            this.$el.find('legend').after(content);
            };
    },
    
    removeAlerts: function() {
        this.$el.find('.alert').remove();
        this.$el.find('.control-group').removeClass('error');
        this.$el.find('.help-inline').removeAttr('data-trt');
        this.$el.find('.help-inline').html('');
        this.isValid = true;
    }

});


