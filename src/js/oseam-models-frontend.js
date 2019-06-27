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

OSeaM.models.Frontend = Backbone.Model.extend({
    actualView:null,
    
    translations: {},
    
    getAuth: function() {
        if (this.has('auth') === false) {
            this.set({
                auth: new OSeaM.models.Auth()
            });
        }
        return this.get('auth');
    },
    getTracks: function() {
        if (this.has('tracks') === false) {
            this.set({
                tracks: new OSeaM.models.Tracks()
            });
        }
        return this.get('tracks');
    },
    getVessels: function() {
        if (this.has('vessels') === false) {
            this.set({
                vessels: new OSeaM.models.Vessels()
            });
        }
        return this.get('vessels');
    },
    getLicenses: function() {
        if (this.has('licenses') === false) {
            this.set({
                licenses: new OSeaM.models.Licenses()
            });
        }
        return this.get('licenses');
    },
    getGauges: function() {
        if (this.has('gauges') === false) {
            this.set({
                gauges: new OSeaM.models.Gauges()
            });
        }
        return this.get('gauges');
    },
    getGaugeMeasurements: function() {
        if (this.has('gaugemeasurements') === false) {
            this.set({
            	gaugemeasurements: new OSeaM.models.GaugeMeasurements()
            });
        }
        return this.get('gaugemeasurements');
    },
    getUser: function() {
        if (this.has('user') === false) {
            this.set({
            	user: new OSeaM.models.User()
            });
        }
        return this.get('user');
    },
    
    startView: function(name, settings) {
        if (this.actualView) {
//RKu            this.actualView.close();						// delete current view from html "span9 oseam-container" nein, nicht mehr
        }
        var cfg = settings || {};
        this.actualView = new OSeaM.views[name](jQuery.extend({
            el: OSeaM.container
        }, cfg));
        this.actualView.render();
    },
    
    setLanguage: function(language) {
        this.set({language: language});
        if (this.translations[language] === undefined) {
            var me = this;
            jQuery.ajax({
                url: 'translations/' + language + '.json',						//RKu: at pressent we have 2 languages (en and de)
                dataType: 'json',
                success: function(data, success, jqXHR) {
                    me.translations[language] = data;
                    me.translate($('body'));
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert('Unable to load language.'  + errorThrown);
                }
            });
        } else {
            this.set({language: language});
            this.translate($('body'));
        }
        localStorage.language = language;
    },
    
    getLanguage: function() {
        return this.get('language');
    },
    
    translate: function(el) {
        // Seach in children
        elements = el.find('[data-trt], [data-trt-placeholder], [title]');
        for (var i = 0; i < elements.length; i++) {
            this.translateEl(elements[i]);
        }
        // Seach on top level
        elements = el.filter('[data-trt], [data-trt-placeholder], [title]');
        for (var i = 0; i < elements.length; i++) {
            this.translateEl(elements[i]);
        }
    },
    translateEl: function(el) {
        var jEl = $(el);
        var dataTrt = jEl.data('trt') || '0000:Unknown';
        dataTrt = dataTrt.split(':', 2);
        jEl.html(this.getPhrase(dataTrt[0]));
        if(el.title) {
            var dataTrt2 = el.title.split(':', 2);
            jEl.attr('title',this.getPhrase(dataTrt2[0]));
        }
        var dataTrt = jEl.data('trt-placeholder') || null;
        if (dataTrt) {
            dataTrt = dataTrt.split(':', 2);
            jEl.attr('placeholder', this.getPhrase(dataTrt[0]));
        }
    },
    translateAttr: function(jEl, attr, text) {
        dataTrt = text.split(':', 2);
        jEl.attr(attr, this.getPhrase(dataTrt[0]));
    },
    getPhrase: function(id) {
        var language = this.getLanguage();
        if (this.translations[language] === undefined) {
            return '';
        }
        if (this.translations[language][id] === undefined) {
            return '::unknown::';
        }
        return this.translations[language][id];
    }
});
