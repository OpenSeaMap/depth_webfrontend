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
  },
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
    jQuery.ajax({
      type: 'POST',
      url: OSeaM.apiUrl + 'users/captcha',
      contentType: "application/json",
      dataType: 'json',
      success: jQuery.proxy(fn, this)
    });

    return this;
  },
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
    this.model.requestNewPassword(params);
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
