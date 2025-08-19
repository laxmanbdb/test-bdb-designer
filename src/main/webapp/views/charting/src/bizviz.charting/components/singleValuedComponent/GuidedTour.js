/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: GuidedTour.js
 * @description GuidedTour
 **/
function GuidedTour(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_toursteps = [];
	this.m_associatedtour = {};
	this.m_associatedtourlist = [];
	this.m_associatedtourbuttonlist = {};
	this.m_tourname = "dashboardTour";
	
	this.m_alpha = 0.9;
	this.m_maintainaspectratio = false;
	this.m_tourevents = {
			"start":"",
			"end":"",
			"pause":""};
};

GuidedTour.prototype = new Widget();

GuidedTour.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

GuidedTour.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "GuidedTour") {
			for (var tourKey in jsonObject[key]) {
				switch (tourKey) {
				case "imageSource":
					for (var imageSourceKey in jsonObject[key][tourKey])
						this.setAttributeValueToNode(imageSourceKey, jsonObject[key][tourKey], nodeObject);
					break;
				default:
					this.setAttributeValueToNode(tourKey, jsonObject[key], nodeObject);
				}
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

GuidedTour.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

GuidedTour.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
};
GuidedTour.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2){
		this.m_objectid = this.m_objectid.split(".")[1];
	}
	this.m_componentid = "GuidedTourDiv" + this.m_objectid;
};

GuidedTour.prototype.draw = function () {
	this.drawObject();
};

GuidedTour.prototype.drawObject = function () {
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback!=""){
		onAfterRender(this.m_onafterrendercallback);
	}
};
/**updating tour events before click**/
GuidedTour.prototype.setTourMethods = function (config) {
	if(this.m_tourevents["start"]!=""){
		config.onStart = this.m_tourevents["start"];
	}
	if(this.m_tourevents["end"]!=""){
		config.onEnd = this.m_tourevents["end"];
	}
	if(this.m_tourevents["pause"]!=""){
		config.onPause = this.m_tourevents["pause"];
	}
	return config;
};
GuidedTour.prototype.init = function () {
	if(!IsBoolean(this.m_designMode)) {
		var temp = this;
		var enableTour = $("#draggableDiv" + temp.m_objectid);
		var stepData = [];
		for (var i = 0; i < this.m_associatedtourlist.length; i++) {
			var tourprop = {};
			tourprop["element"] = "#" + sdk.getDivIdFromComponetId(this.m_associatedtourlist[i].compName);
			tourprop["title"] = this.m_associatedtourlist[i].title;
			tourprop["content"] = this.m_associatedtourlist[i].content;
			tourprop["placement"] = this.m_associatedtourlist[i].placement;
			tourprop["duration"] = this.m_associatedtourlist[i].duration;
			stepData.push(tourprop);
		}
		var config = {
				"name" : temp.m_tourname,
				"steps" : stepData,
				onStart: function(){},
				onEnd: function(){},
				onPause: function(){}
		};
		config = temp.setTourMethods(config);
		$(enableTour).click({"config": config}, function(e){
			//OnMouseClick(temp);
			/*this.updateDataPoints(config);*/
			if ((config.steps).length < 1) {
				alertPopUpModal({
					type: "error",
					message: "Tour is not configured",
					timeout: '3000'
				});
			} else {
				if (config) {
					try {
						var preserveStyle = {
							'WatermarkDivOverflow': $("#WatermarkDiv").css('overflow'),
							'draggablesParentDivOverflow': $(".draggablesParentDiv").css('overflow')
						};
						var tourConfig = {
							name: config.name,
							steps: config.steps,
							storage: false,
							backdrop: true,
							animation: false,
							onStart: function(tour) {
								/** To make autoscroll work in portal #BDD-621 **/
								$('#WatermarkDiv').css('overflow', '');
								if (dGlobals.layoutType !== "AbsoluteLayout") {
									$(".draggablesParentDiv").css('overflow', '').removeClass("iPhoneScrollBar").removeClass("mobileViewCSS");
								}
								config.onStart && config.onStart();
							},
							onEnd: function(tour) {
								$('#WatermarkDiv').css('overflow', preserveStyle.WatermarkDivOverflow);
								if (dGlobals.layoutType !== "AbsoluteLayout") {
									$('.draggablesParentDiv').css('overflow', preserveStyle.draggablesParentDivOverflow).addClass("iPhoneScrollBar").addClass("mobileViewCSS");
								}
								config.onEnd && config.onEnd();
							},
							onPause: function (tour) {
								$('#WatermarkDiv').css('overflow', '');
								if (dGlobals.layoutType !== "AbsoluteLayout") {
									$(".draggablesParentDiv").css('overflow', '').removeClass("iPhoneScrollBar").removeClass("mobileViewCSS");
								}
								config.onPause && config.onPause();
							},
							template: '<div class="popover tour"><div class="arrow">&nbsp;</div><h3 class="popover-title">&nbsp;</h3><div class="popover-content">&nbsp;</div><div class="popover-navigation"><button class="btn btn-default" data-role="prev">&laquo; Prev</button> <button class="btn btn-default" data-role="next">Next &raquo;</button><button class="btn btn-default" data-role="pause-resume">Pause</button> <button class="btn btn-default" data-role="end">End tour</button></div></div>'
						};

						/** update Additional Configuration **/
						for (var key in config) {
							if (config.hasOwnProperty(key)) {
								if (key == 'onStart' || key == 'onEnd') {
									// Do nothing, as these CallBacks are added in the above tourConfig
								} else {
									tourConfig[key] = config[key];
								}
							}
						}

						// Instance the tour
						var tour = new Tour(tourConfig);

						if (tour.ended()) {
							// Restart the tour
							tour.restart();
						} else {
							// Initialize the tour
							tour.init();
							// Start the tour after page loaded
							tour.start();
						}
					} catch (e) {
						console.log(e);
					}
				}
			}
		});
	}
};

GuidedTour.prototype.drawChart = function () {
	this.drawTour();
};

GuidedTour.prototype.drawTour = function () {
	var temp = this;
	var container = $("#draggableDiv" + temp.m_objectid);
	
	if ($("#" + temp.m_componentid) != null)
		$("#" + temp.m_componentid).remove();
	
	if (this.m_tourtype === "text") {
		/**DAS-881 */
		if ($("#img" + temp.m_objectid) != null)
		$("#img" + temp.m_objectid).remove();
		this.drawLabel();
	} else {
		this.createImage(container);
		this.drawImage(container);
	}
	
};

GuidedTour.prototype.drawLabel = function () {
	var temp = this;
	var container = $("#draggableDiv" + temp.m_objectid);

	if ($("#" + temp.m_componentid) != null)
		$("#" + temp.m_componentid).remove();

	var temp1 = this.m_text + "";
	var newString = "";
	for (var z = 0; z < temp1.length; z++) {
		if (temp1[z] == " " && temp1[z + 1] == " ")
			newString += "&nbsp;";
		else
			newString += temp1[z];
	}
	this.m_text = newString;

	var labelObj = document.createElement("span");
	labelObj.setAttribute("id", temp.m_componentid);
	labelObj.setAttribute("class", "LabelComponent");
	//labelObj.setAttribute("style","width: "+this.m_width+"px;height: "+this.m_height+"px;border: 1px solid black;POSITION: RELATIVE;DISPLAY: TABLE-CELL;VERTICAL-ALIGN: middle;TEXT-ALIGN: CENTER;BACKGROUND-COLOR: antiquewhite;COLOR: black;FONT-FAMILY: cursive;FONT-SIZE: 14PX;width: 150px;height: 100px;border: 1px solid black;POSITION: RELATIVE;DISPLAY: TABLE-CELL;VERTICAL-ALIGN: middle;TEXT-ALIGN: CENTER;BACKGROUND-COLOR: antiquewhite;COLOR: black;FONT-FAMILY: cursive;FONT-SIZE: 14PX;")
	$(labelObj).css({
		"width": this.m_width + "px",
		"height": this.m_height + "px",
		"text-decoration": this.m_textdecoration,
		"font-weight": this.m_fontweight,
		"font-style": this.m_fontstyle,
		"font-size": this.fontScaling(this.m_fontsize * 1) + 'px',
		"font-family": selectGlobalFont(this.m_fontfamily),
		"color": convertColorToHex(temp.m_color),
		"vertical-align": this.m_verticalalign,
		"cursor": this.m_cursortype,
		"text-align": this.m_textalign,
		"background-color": hex2rgb(convertColorToHex(temp.m_backgroundcolor), this.m_backgroundalpha),
		"display": "TABLE-CELL",
		"position": "relative",
		"border-radius": this.m_borderradius + "px",
		"padding-left" : this.m_labelpadding + "px",
		"padding-right" : this.m_labelpadding + "px"
	});
	labelObj.innerHTML = this.m_text;
	/**Added to rotate label vertical and horizontal positions */
	if (this.m_labeltextrotation == "vertical") {
		$(labelObj).css({
		    "width": this.m_height + "px",
		    "transform-origin": "left top",
		    "transform": "rotate(-90deg) translate(-" + this.m_height + "px, 0px)",
		    "height": this.m_width + "px",
		});
		$(container).css("width", this.m_height);
	}
	$(container).append(labelObj);
};

GuidedTour.prototype.drawImage = function (container) {
	var temp = this;
	var img = $("#img" + temp.m_objectid);
	if (this.m_alpha != 0) {
	    if (this.m_cdata != "" && this.m_cdata != undefined && this.m_cdata.indexOf("http") == -1) {
	        if (this.m_cdata.indexOf("data:image/png;") == 0 || this.m_cdata.indexOf("data:image/jpg;") == 0 || this.m_cdata.indexOf("data:image/jpeg;") == 0)
	            $(img).attr("src", this.m_cdata);
	        else
	            $(img).attr("src", "data:image/png;base64," + this.m_cdata);
	    } else if (this.m_cdata.indexOf("http") != -1) {
	        $(img).attr("src", this.m_cdata);
	    } else {
	        $(img).attr("src", this.m_imagePath);
	    }
	}
	setTimeout(function() {
	    temp.setWidthHeightWithAspectRatio(img, 0);
	}, 0);
};

GuidedTour.prototype.createImage = function (container) {
	var temp = this;
	$("#img" + temp.m_objectid).remove();
	var img = document.createElement("img");
	img.id = "img" + this.m_objectid;
	$(img).css({
		"width": this.m_width + "px",
		"height": this.m_height + "px",
		"top": "0px",
		"left": "0px",
		"position": "absolute",
		"opacity": this.m_alpha,
		"filter": "alpha(opacity=" + this.m_alpha + ")",
		"borderRadius": this.m_borderradius + "px",
		"cursor": this.m_cursortype
	});
	$("#draggableDiv" + temp.m_objectid).append(img);
};

GuidedTour.prototype.setWidthHeightWithAspectRatio = function (imageObj, glowMargin) {
	var temp = this;
	var imageObject = $(imageObj).get(0) != undefined ? imageObj[0] : imageObj;
	var width = this.m_width;
	var height = this.m_height;
	if (IsBoolean(this.m_maintainaspectratio)) {
		var m_imageAspectRatio = (imageObject.naturalWidth) / (imageObject.naturalHeight);
		var m_divAspectRatio = this.m_width / this.m_height;
		if (m_divAspectRatio > m_imageAspectRatio) {
			width = m_imageAspectRatio * this.m_height;
			height = this.m_height;
		} else {
			width = this.m_width;
			height = this.m_width / m_imageAspectRatio;
		}
	}
	$("#img" + temp.m_objectid).css("width", width - glowMargin + "px");
	$("#img" + temp.m_objectid).css("height", height - glowMargin + "px");
};
//# sourceURL=GuidedTour.js