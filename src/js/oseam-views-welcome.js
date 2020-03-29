// -------------------------------------------------------------------------------------------------
// OpenSeaMap Water Depth - Web frontend for depth data handling.
//
// Written in 2018 by Richard Kunzmann
//			  2020 add autologout
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain
// worldwide. This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along
// with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
// -------------------------------------------------------------------------------------------------

//RKu ++ new function "welcome a user after successful login"

OSeaM.views.Welcome = OSeaM.View.extend({

    initialize: function() {
		var sessionTimerID;												//RKu: TimerID to stop timer later
		var logoutTimerID;												//RKu: TimerID to stop timer later

        OSeaM.frontend.on('change:language', this.render, this);
    },

    render: function() {
		var usermodel = OSeaM.frontend.getUser();
        var language = OSeaM.frontend.getLanguage();
        var template = OSeaM.loadTemplate('welcome-' + language);
        var content = $(template({
			firstname: usermodel.attributes.forname }));
        OSeaM.frontend.translate(content);
        this.$el.html(content);
//        var elements = document.getElementById("oseam-4");				//RKu: {{idUsernameReadOnly}}
//        elements.innerHTML = usermodel.attributes.user_name;				//RKu:


		var corr_lang = usermodel.attributes.language;					//RKu: test for supported corrospondens languages
		if (corr_lang !== 'de'&& corr_lang !== 'en'){
//			this.removeAlerts();
            var template = OSeaM.loadTemplate('alert');
            var content  = $(template({
                title:'1036:Warnung!',
                msg:'1213:Deine gewählte Korrospondenz-Sprache wird nicht unterstützt. Bitte pass Dein Profile entsprechend an'
            }));
            OSeaM.frontend.translate(content);
            this.$el.find('legend').after(content);
		}

		var self = this;												// RKu: save context
		document.addEventListener("mousemove", function() {self.resetTimer(self);}, false);	// RKu: aktivate Event Listener to detect user activities
		document.addEventListener("mousedown", function() {self.resetTimer(self);}, false);	// RKu:
		document.addEventListener("keypress", function() {self.resetTimer(self);}, false);	// RKu:
//		document.getElementById("rk-body").addEventListener("touchmove", function() {self.resetTimer(self);}, false);	// RKu:
//		document.getElementById("rk-body").addEventListener("onscroll", function() {self.resetTimer(self);}, false);	// RKu:
		this.sessionTimerStart();										// RKu:

        return this;
    },

    removeAlerts: function() {											// RKu: remove possible alerts from display
        this.$el.find('.alert').remove();
        this.$el.find('.alert-info').remove();
        this.$el.find('.control-group').removeClass('error');
        this.$el.find('.help-inline').removeAttr('data-trt');
        this.$el.find('.help-inline').html('');
        this.isValid = true;
    },

	resetTimer: function(that) {
		window.clearTimeout(this.sessionTimerID);						// RKu: reset timer, user is still working
		window.clearTimeout(this.logoutTimerID);
		that.sessionTimerStart();

	},
	
	sessionTimerStart: function () {									// RKu: start the first timer for 14 minutes
		var that = this;
		var sessionTimer = 900000;										// RKu: set session timer to 15 minute = 900000 ms
        if (OSeaM.frontend.getAuth().isAuthenticated() === true) {		// RKu: test if we are logged in bevor timer get startet. Otherwise do nothing
			that.sessionTimerID = window.setTimeout(this.sessionInactive, sessionTimer, that);	//RKu: window.setTimeout returns an Id. It may be used to start or stop a timer
		}
	},

	sessionInactive: function (that) {									// RKu: this is your first warnung after 14 minutes, that your session will expire
		var logoutTimer = 60000;										// RKu: set final logout timer to 60 seconds = 60000 ms
		window.clearTimeout(that.sessionTimerID);
		that.logoutTimerID = window.setTimeout(that.sessionLogout, logoutTimer, that); // RKu: you will get another 60 seconds to do something, otherwise you get logged out.
		that.removeAlerts();
        var template = OSeaM.loadTemplate('alert-info');
        var content  = $(template({
            title:'1210:Sicherheitshinweis!',
            msg:'1214:Deine Session ist nun xxx min. inaktiv. Falls keine weiter aktion erfolgt wird Deine Session in 60 sec. ausgelogged !'
        }));
        OSeaM.frontend.translate(content);
        that.$el.find('legend').after(content);
	},
	
	sessionLogout: function (that) {
        var template = OSeaM.loadTemplate('alert');
        var content  = $(template({
            title:'1210:Sicherheitshinweis!',
            msg:'1215:Deine Session ist nun aus Sicherheitsgründen ausgelogged worden !'
        }));
        OSeaM.frontend.translate(content);
        that.$el.find('legend').after(content);
		
		document.getElementById("rk-logout").click();					// RKu: trigger a button click to logout the user !!! a click will start the backend logout process
		window.clearTimeout(that.sessionTimerID);						// RKu: clear all Timers
		window.clearTimeout(that.logoutTimerID);						// RKu:

		document.removeEventListener("mousemove", function() {that.resetTimer(that);}, false);	// RKu: make sure all Event Listener are removed
		document.removeEventListener("mousedown", function() {that.resetTimer(that);}, false);	// RKu:
		document.removeEventListener("keypress", function() {that.resetTimer(that);}, false);	// RKu:
//		document.getElementById("rk-body").removeEventListener("touchmove", function() {that.resetTimer(that);}, false);	// RKu:
//		document.getElementById("rk-body").removeEventListener("onscroll", function() {that.resetTimer(that);}, false);		// RKu:

	}
});

//RKu --
