// -------------------------------------------------------------------------------------------------
// OpenSeaMap Water Depth - Web frontend for depth data handling.
//
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain
// worldwide. This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along
// with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
// -------------------------------------------------------------------------------------------------

OSeaM.views.ResetPassword = OSeaM.View.extend({
  isValid: true,
  events: {
    'click .btn-link': 'renewCaptcha',
    'submit form': 'onFormSubmit'
  },
  initialize: function() {
    this.model.bind('passwordResetSuccess', this.onPasswordResetSuccess, this);
    this.model.bind('passwordResetFailure', this.onPasswordResetFailure, this);
    OSeaM.frontend.once('change:language', this.render, this);					//RKu: this line was missing, as no refresh happend after language change ... however 
  },																			//RKu: "once" is why it continues to fire change Language, even we work on different tabs
        																		//RKu: so we see a posible alert only once on a different working tab on language change. Did not jet find a better solution to solve this  
  render: function() {
    var language = OSeaM.frontend.getLanguage();
    var template = OSeaM.loadTemplate('reset-password');
    
    this.renderParams = {
      captchaUrl: this.model.getCaptchaUrl(),
      idUsername: OSeaM.id(),
      idCaptcha: OSeaM.id(),
      idSubmit: OSeaM.id()
    };
    
    var content = $(template(this.renderParams));
    OSeaM.frontend.translate(content);
    this.$el.html(content);
    
    this.fieldUsername = this.$el.find('#' + this.renderParams.idUsername);
    this.fieldCaptcha = this.$el.find('#' + this.renderParams.idCaptcha);
    this.buttonSubmit = this.$el.find('#' + this.renderParams.idSubmit);
    var fn = function(data) {
      this.replaceCaptcha(data);
    };
    
    var that = this;															//RKu: save me the right context
    jQuery.ajax({																//RKu: request a captcha from server
      type: 'POST',
      url: OSeaM.apiUrl + 'users/captcha',
      contentType: "application/json",
      dataType: 'json',
      
      success:	jQuery.proxy(fn, this),
      error:	function(xhr, textStatus, error){								//RKu: implement error handling
            				xhr.status;
            				xhr.responseText;
							that.NoCaptchaError(xhr); }
    });
    return this;
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
  
  validateForm: function() {
    this.removeAlerts();
    var errors = [];
    if (OSeaM.utils.Validation.username(this.fieldUsername.val()) !== true) {
      this.markInvalid(this.fieldUsername, '1010:Invalid Email format.');
      errors.push('1004:Email');
    }
    if (this.fieldCaptcha.val().length !== 6) {
      this.markInvalid(this.fieldCaptcha, '1013:Invalid captcha.');
      errors.push('1007:Captcha');
    }
    if (this.isValid !== true) {
      var template = OSeaM.loadTemplate('alert');
      var content = $(template({
        title: '1027:Validation error occured',
        errors: errors
      }));
      OSeaM.frontend.translate(content);
      this.$el.find('legend').after(content);
    }
    return this.isValid;
  },
  
  markInvalid: function(field, text) {
    field.parents('.control-group').addClass('error');
    field.next('.help-inline').attr('data-trt', text);
    OSeaM.frontend.translate(this.$el);
    this.isValid = false;
  },
  
  removeAlerts: function() {
    this.$el.find('.alert').remove();
    this.$el.find('.control-group').removeClass('error');
    this.$el.find('.help-inline').removeAttr('data-trt');
    this.$el.find('.help-inline').html('');
    this.isValid = true;
  },
  
  onFormSubmit: function(evt) {
    evt.preventDefault();
    this.buttonSubmit.button('loading');
    if (this.validateForm() !== true) {
      this.buttonSubmit.button('reset');
      return;
    }
    var params = {
      username: this.fieldUsername.val(),
      captcha: this.fieldCaptcha.val()
    };
    this.model.requestNewPassword(params);										// RKu: this function is placed in "oseam-models-auth.js"
    return false;
  },
  
  onPasswordResetSuccess: function(data) {
    var template = OSeaM.loadTemplate('alert-success');
    var content = $(template({
      title: '1402:Password requested',
      msg: '1403:A new password was sent to your mail address.'
    }));
    OSeaM.frontend.translate(content);
    this.$el.find('form').remove();
    this.$el.find('legend').after(content);
  },
  onPasswordResetFailure: function(jqXHR) {
    var template = OSeaM.loadTemplate('alert');
    var msg = '';
    if (jqXHR.status === 404) {
      this.markInvalid(this.fieldUsername, '1404:Username does not exists.');
      this.fieldUsername.focus();
    } else if (jqXHR.status === 200 && response.code === 400) {
      this.markInvalid(this.fieldCaptcha, '1013:Invalid captcha.');
      this.fieldCaptcha.val('').focus();
    } else {
      msg = '1031:Unknown error. Please try again.'
    }
    var content = $(template({
      title: '1030:Server error occured',
      msg: msg
    }));
    OSeaM.frontend.translate(content);
    this.$el.find('legend').after(content);
    this.buttonSubmit.button('reset');
  },
  
  renewCaptcha: function(evt) {
    this.$el.find('img').attr('src', this.model.getCaptchaUrl())
  }
});
