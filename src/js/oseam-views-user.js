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
//
// With major rework plus addons from Richard Kunzmann
//

OSeaM.views.User = OSeaM.View.extend({
    events : {																	//RKu neu:
        'click #profile-update'  : 'onProfileUpdate',
        'click #password-update' : 'onPasswordUpdate'
        },
    
    initialize: function() {
        OSeaM.frontend.on('change:language', this.render, this);
        this.listenTo(this.model, 'change', this.render);
        this.model.fetch();
        this.countProfile = 0;
        this.countPasswd = 0;
    },
    render: function() {
        var language = OSeaM.frontend.getLanguage();
        var template = OSeaM.loadTemplate('user-' + language);					//RKu: default language is "en"
        var checked = this.model.get('acceptedEmailContact');                   //RKu: look at the model if the user wants to get eMails
        if (checked == true){checked = 'checked'}else{checked = 'null'}         //RKu: update the view according the user expectation
        var content = $(template( {
            user_name      : this.model.get('user_name'),						//RKu:
            forename       : this.model.get('forename'),
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
        if (this.countProfile <= 2){											//RKu for security reason only three profile updates per use of the 'user profile' function
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
                error:   function (model,error){
                    if (error.status == 200){
//                        console.log('Profile erfolgreich gespeichert');
                        var element1 = document.getElementById("profile-update");
                        element1.innerHTML = OSeaM.frontend.getPhrase('1205:Benutzer Profil erfolgreich abgeändert');
                        element1.className = 'btn btn-success';
                    }else{
                        console.log('look at error.responseText');
                        }
                    }
            });																	//RKu: ... so we can send the new Data to the server Database

        this.countProfile += 1;

        console.log('Profile update ' +											//RKu: only for testing purpes
               '\nVorname : '  + this.model.attributes.forname +
               '\nNachname : ' + this.model.attributes.surname +
               '\nacceptEmail : ' + this.model.attributes.acceptedEmailContact +
               '\nTelefon : '  + this.model.attributes.phone);
        }else{
//                console.log('Die Funktion geht einmal pro Aufruf des UserProfiles');
                this.removeAlerts();
                var template = OSeaM.loadTemplate('alert');
                var content  = $(template({
                    title:'1210:Hinweis:',
                    msg:'1211:Der Profile update kann nur dreimal pro Aufruf des UserProfiles durchgeführt werden'
                }));
                OSeaM.frontend.translate(content);
                this.$el.find('legend').after(content);
             }
    },
    
    onPasswordUpdate: function () {												//RKu neu:
        if (this.countPasswd <= 1){											//RKu for security reason only two password updates per use of the 'user profile' function
//            console.log('Password update ' +
//                   '\n... aber soweit sind wir noch nicht ...');

            var params ={
                        oldPassword  : document.getElementById("oldPassword").value,
                        neuPassword1 : document.getElementById("newPassword").value,
                        neuPassword2 : document.getElementById("newPassword2").value
                        };

            this.checkPassword(params);

            if (this.isValid){
//                console.log('Password valid');

                params.oldPassword  = jQuery.encoding.digests.hexSha1Str(params.oldPassword).toLowerCase();		    // password encryption
                params.neuPassword1 = jQuery.encoding.digests.hexSha1Str(params.neuPassword1).toLowerCase();		// password encryption
                params.neuPassword2 = jQuery.encoding.digests.hexSha1Str(params.neuPassword2).toLowerCase();		// password encryption

                console.log('Old Password : ' + params.oldPassword +
                         '\nNew Password1 : ' + params.neuPassword1 +
                         '\nNew Password2 : ' + params.neuPassword2);

                var data = {oldPassword:params.oldPassword, newPassword:params.neuPassword1};
                jQuery.ajax({
                    type: 'POST',
                    url: OSeaM.apiUrl + 'users/changepass',
                    contentType: "application/x-www-form-urlencoded",
                    data: data,
                    datatype: 'json',
                    context: this,
//                    xhrFields: {
//                        withCredentials: true
//                    },
                    success: function(data){ this.trigger('passwordResetSuccess', data);
                            var element2 = document.getElementById("password-update");
                            element2.innerHTML = OSeaM.frontend.getPhrase('1207:Benutzer Password erfolgreich abgeändert');
                            element2.className = 'btn btn-success';
                    },
                    error: function(xhr, data, error){ this.trigger('passwordResetFailure', data);
							console.log('PW reset Fehler:', xhr.getResponseHeader('Error') );
							if ( xhr.getResponseHeader('Error') == '102:Old Password mismatch'){
								this.removeAlerts();
								var template = OSeaM.loadTemplate('alert');
								var content  = $(template({
									title:'1210:Hinweis:',
									msg:'1208:Das alte Passwort stimmt nicht !'
								}));
								OSeaM.frontend.translate(content);
								this.$el.find('legend').after(content);
							}
					}
                });
            };
        this.countPasswd += 1;
        }else{
//                console.log('Die Funktion geht einmal pro Aufruf des UserProfiles');
                this.removeAlerts();
                var template = OSeaM.loadTemplate('alert');
                var content  = $(template({
                    title:'1210:Hinweis:',
                    msg:'1212:Die Password Änderung kann nur zweimal pro Aufruf des UserProfiles durchgeführt werden'
                }));
                OSeaM.frontend.translate(content);
                this.$el.find('legend').after(content);
             }
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


