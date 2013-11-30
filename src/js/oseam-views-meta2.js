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

OSeaM.views.meta2 = OSeaM.View
		.extend({
			sensorPositions : null,
			modalDialog : null,
			events : {
				// 'click [name=echoSounderInFront]' : 'onEchoSounderInFront',
				// 'click [name=echoSounderRightOf]' : 'onEchoSounderRightOf',
				'change [name=vesselLength]' : 'onChangeVesselLength',
				'change [name=vesselWidth]' : 'onChangeVesselWidth',
				'change [name=positionGPSCenterline]' : 'onChangePositionGPSCenterlineKey',
				'change [name=positionSounderCenterline]' : 'onChangePositionSounderCenterlineKey',
				'change [name=positionGPSStern]' : 'onChangePositionGPSSternKey',
				'change [name=positionSounderStern]' : 'onChangePositionSounderSternKey'
			},
			render : function() {

				var language = OSeaM.frontend.getLanguage();
				var template = OSeaM.loadTemplate('meta2-' + language);
				var content = $(template({

					loa : this.model.get('loa'),
					breadth : this.model.get('breadth'),
					gps_distanceFromCenter : this.model.sbasoffset.get('distanceFromCenter'),
					gps_distanceFromStern : this.model.sbasoffset.get('distanceFromStern'),
					depth_distanceFromCenter : this.model.depthoffset.get('distanceFromCenter'),
					depth_distanceFromStern : this.model.depthoffset.get('distanceFromStern')
				}));

				OSeaM.frontend.translate(content);
				this.$el.html(content);

				if (!this.model.get('loa')
						|| !this.model.get('breadth')) {
					// undefined
				} else {
					this.computeSize();
				}
				if (!this.model.sbasoffset.get('distanceFromCenter')
						|| !this.model.sbasoffset.get('distanceFromStern')) {
					// undefined
				} else {
					$('#draggableGps').css("left",
							this.model.get('distanceFromCenter'));
					$('#draggableGps').css("top",
							this.model.get('distanceFromStern'))
				}
				if (!this.model.get('positionSounderCenterlineC')
						|| !this.model.get('positionSounderSternC')) {
					// undefined
				} else {
					$('#draggableSounder').css("left",
							this.model.depthoffset.get('distanceFromCenter'));
					$('#draggableSounder').css("top",
							this.model.depthoffset.get('distanceFromStern'))
				}
				return this;

			},

			onChangeVesselLength : function(evt) {

				if ($("#vesselWidth").val()) {
					this.computeSize();
				}

			},
			vesselLength : function() {
				// var value = parseFloat($('#vesselLength').val()) * 100;
				// this.sensorPositions.setVerticalDistance(value);
			},
			vesselWidth : function() {
				// var value = parseFloat($('#vesselWidth').val()) * 100;
				// this.sensorPositions.setHorizontalDistance(value);
				// $('#vesselWidth').val();
				$('#vesselsize').attr("width", "50%");
			},

			onChangeVesselWidth : function(evt) {

				// $("#vesselsize").width( 100 );
				// this.validate();
				// alert('change');

				if ($("#vesselLength").val()) {
					this.computeSize();
				}

				// $('#vesselsize').prop("width","100px");
				// var value = parseFloat($(evt.target).val()) * 100;
				// this.sensorPositions.setHorizontalDistance(value);
			},
			computeSize : function() {

				var x = parseFloat(($("#vesselWidth").val()));
				var y = parseFloat(($("#vesselLength").val()));
				// alert($("#vesselLength").val());
				if (y > x) {
					x = (200 / y) * x;
					$("#vesselsize").width(x);
					y = 200;
				}

				if (x > y) {
					y = (200 / x) * y;
					$("#vesselsize").height(y);
					x = 200;
				}

				if (x === y) {
					$("#vesselsize").width(200);
					$("#vesselsize").height(200);
					x = 200;
					y = 200;
				}

				// $('#draggableGps').remove();
				// $('#draggableSounder').remove();
				$('#vesselsize')
						.append(
								'<div id="draggableGps" style="width: 20px; height: 20px; border-radius:10px; background:#000></div>');
				$('#vesselsize')
						.append(
								'<div id="draggableSounder" style="width: 20px; height: 20px; border-radius:10px; background:#FF0000></div>');

				// gps
				$("#draggableGps").draggable(
						{

							// Show dropped position.
							stop : function(event, ui) {
								var Stoppos = $(this).position();
								var width = $("#vesselsize").width();
								var height = $("#vesselsize").height();
								var widthM = parseFloat(($("#vesselWidth")
										.val()));
								var heightM = parseFloat(($("#vesselLength")
										.val()));
								var centerline = width / 2;
								var factorX = widthM / (x - 20);
								var factorY = heightM / (y - 20);

								// save html div coords
								// this.model.set({positionGPSCenterlineC:
								// Stoppos.left});
								// this.model.set({positionGPSSternC:
								// Stoppos.top});

								// centerline zero
								if ((centerline - 10) === Stoppos.left) {
									$("#positionGPSCenterline").text(0);
								}
								// backboard links - left
								if (Stoppos.left < (centerline - 10)) {
									var transBX = Stoppos.left
											- (centerline - 10);
									transBX = transBX * factorX;
									$("#positionGPSCenterline").val(
											transBX.toFixed(2));
								}
								// steuerboard rechts - right
								if (Stoppos.left > (centerline - 10)) {
									var transSX = Stoppos.left
											- (centerline - 10);
									transSX = transSX * factorX;
									$("#positionGPSCenterline").val(
											transSX.toFixed(2));
								}

								// from stern
								var stern = Stoppos.top;
								// alert('stern '+ stern+ ' factoy '+ factorY);
								stern = stern * (factorY);
								stern = (stern - heightM) * -1;
								if (stern < 0) {
									stern = 0;
								}
								$("#positionGPSStern").val(stern.toFixed(2));
							},

							containment : "#vesselsize",
							scroll : false
						});
				// sounder
				$("#draggableSounder").draggable(
						{
							stop : function(event, ui) {
								var Stoppos = $(this).position();
								var width = $("#vesselsize").width();
								var height = $("#vesselsize").height();
								var widthM = parseFloat(($("#vesselWidth")
										.val()));
								var heightM = parseFloat(($("#vesselLength")
										.val()));
								var centerline = width / 2;
								var factorX = widthM / (x - 20);
								var factorY = heightM / (y - 20);

								// save html div coords
								// this.model.set({positionSounderCenterlineC:
								// Stoppos.left});
								// this.model.set({positionSounderSternC:
								// Stoppos.top});

								// centerline zero
								if ((centerline - 10) === Stoppos.left) {
									$("#positionSounderCenterline").text(0);
								}
								// backboard links - left
								if (Stoppos.left < (centerline - 10)) {
									var transBX = Stoppos.left
											- (centerline - 10);
									transBX = transBX * factorX;
									$("#positionSounderCenterline").text(
											transBX.toFixed(2));
								}
								// steuerboard rechts - right
								if (Stoppos.left > (centerline - 10)) {
									var transSX = Stoppos.left
											- (centerline - 10);
									transSX = transSX * factorX;
									$("#positionSounderCenterline").text(
											transSX.toFixed(2));
								}

								// from stern
								var stern = Stoppos.top;
								// alert('stern '+ stern+ ' factoy '+ factorY);
								stern = stern * (factorY);
								stern = (stern - heightM) * -1;
								if (stern < 0) {
									stern = 0;
								}
								$("#positionSounderStern").text(
										stern.toFixed(2));

								// $("#positionSounderCenterline").text(Stoppos.left);
								// $("#positionSounderStern").text(Stoppos.top);

							},
							containment : "#vesselsize",
							scroll : false
						});

				// $('#draggableGps').attr("display") = "block";
				// $("#draggableGps").css("visibility","visible");
				// $("#draggableSounder").css("visibility","visible");
				// alert($("#draggableGps").css("display"));
				// document.getElementById("Navi1").style.visibility =
				// "visible";
				// $("#draggableGps").show();

			},
			onChangePositionGPSCenterlineKey : function(evt) {
				this.model.sbasoffset.set('distanceFromCenter', $(evt.target).val());
			},
			onChangePositionSounderCenterlineKey : function(evt) {
				this.model.depthoffset.set('distanceFromCenter', $(evt.target).val());
			},
			onChangePositionGPSSternKey : function(evt) {
				this.model.sbasoffset.set('distanceFromStern', $(evt.target).val());
			},
			onChangePositionSounderSternKey : function(evt) {
				this.model.depthoffset.set('distanceFromCenter', $(evt.target).val());
			},
			validate : function() {
				this.removeAlerts();
				var errors = [];

				if (OSeaM.utils.Validation.vesselLength(this.model
						.get('loa')) !== true) {
					this.markInvalid($('#vesselLength'),
							'1103:Please enter a decimal (e.g. 5.5)');
				}
				if (OSeaM.utils.Validation.vesselWidth(this.model
						.get('breadth')) !== true) {
					this.markInvalid($('#vesselWidth'),
							'1103:Please enter a decimal (e.g. 5.5)');
				}

				return this.isValid;

			},
			markInvalid : function(field, text) {
				field.parents('.control-group').addClass('error');
				// field.next('.help-inline').attr('data-trt', text);
				this.$el.find('.help-inline').attr('data-trt', text);
				OSeaM.frontend.translate(this.$el);
				this.isValid = false;
			},
			removeAlerts : function() {
				this.$el.find('.alert').remove();
				this.$el.find('.control-group').removeClass('error');
				this.$el.find('.help-inline').removeAttr('data-trt');
				this.$el.find('.help-inline').html('');
				this.isValid = true;
			}
		});