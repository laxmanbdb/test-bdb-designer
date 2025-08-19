/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: InputButton.js
 * @description InputButton
 **/
function InputButton(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();
	
	this.m_fontsize = "";
	this.m_fontcolor = "";
	this.m_hovercolor = "";
	this.m_chromecolor = "";
	this.m_height = "";
	this.m_fontfamily = "Roboto";
	this.m_encode = "";
	this.m_width = "";
//	this.m_tooltip = "";
	this.m_fontstyle = "";
	this.m_opendoc = "";
	this.m_fontweight = "";
	this.m_label = "";
	this.m_globalkey = "";
	this.m_fieldvalue = "";
	this.m_buttoncategory = "";
	this.m_usecustomcolor = false;
	this.m_useoutlinedbuttons = false;

	this.m_objectID = [];
	this.m_componentid = "";
//	this.checkToolTipDesc = "";

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_cursortype = "pointer";
};

InputButton.prototype = new Widget();

InputButton.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

InputButton.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "InputButton") {
			for (var urlKey in jsonObject[key]) {
				this.setAttributeValueToNode(urlKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

InputButton.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

InputButton.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
};
InputButton.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "inputDiv" + this.m_objectid;
};

InputButton.prototype.draw = function () {
	this.drawObject();
};

InputButton.prototype.drawObject = function () {
	//this.callDrawInit();
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback!="")
		onAfterRender(this.m_onafterrendercallback);
};

InputButton.prototype.init = function () {
	//Do Nothing
};

InputButton.prototype.drawChart = function () {
	if (IsBoolean(this.m_isActive)) {
		this.drawInputButton();
		this.initMouseAndTouchEvent("#InputButton" + this.m_objectid);
	}
};

InputButton.prototype.removeInputButtonDiv = function () {
	$("#urlDiv" + this.m_objectid).remove();
};

InputButton.prototype.drawInputButton = function () {
	var temp = this;
	if ($("#urlDiv" + this.m_objectid) != null){
		$("#urlDiv" + this.m_objectid).remove();
	}

	var obj = document.createElement("div");
	obj.setAttribute("id", "urlDiv" + this.m_objectid);

	$("#draggableDiv" + temp.m_objectid).append(obj);
	obj.style.position = "absolute";
	var padding = ((this.m_height - this.fontScaling(this.m_fontsize * 1) * 1.5)/2);
	var button = document.createElement("input");
	button.type = "button";
	button.setAttribute("id", "InputButton" + temp.m_objectid);
	button.setAttribute("class", "InputButton");
	button.value = this.formattedDescription(this, this.m_label);
	obj.appendChild(button);
	$(button).css({
		"width": this.m_width + "px",
		"height": this.m_height + "px",
		"border-radius": this.m_borderradius + "px",
		"font-style": this.m_fontstyle,
		"font-weight": this.m_fontweight,
		"font-size": this.fontScaling(this.m_fontsize),
		"font-family": selectGlobalFont(this.m_fontfamily),
		"padding": padding+"px 2px "+padding+"px 2px",
		"border" : "none"
	});
	$("#draggableDiv" + this.m_objectid).css("border-radius", this.m_borderradius + "px");
	if(temp.m_buttoncategory){
		switch(temp.m_buttoncategory){
			case "Primary":
				$(button).css({
					"border": (temp.m_usecustomcolor) ? "1px solid " + temp.m_chromecolor : "1px solid #0d6efd",
					"background-color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor) ? temp.m_chromecolor : "#0d6efd",
					"color": (temp.m_useoutlinedbuttons) ? "#0d6efd" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#ffffff"
				});
				break;
			case "Secondary":
				$(button).css({
					"background-color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor)? temp.m_chromecolor : "#6c757d",
					"border": (temp.m_usecustomcolor) ? "1px solid " + temp.m_chromecolor : "1px solid #6c757d",
					"color": (temp.m_useoutlinedbuttons) ? "#6c757d" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#ffffff"
				});
				break;
			case "Success":
				$(button).css({
					"background-color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor)? temp.m_chromecolor : "#198754",
					"border": (temp.m_usecustomcolor) ? "1px solid " + temp.m_chromecolor : "1px solid #198754",
					"color": (temp.m_useoutlinedbuttons) ? "#198754" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#ffffff"
				});
				break;
			case "Danger":
				$(button).css({
					"background-color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor)? temp.m_chromecolor : "#dc3545",
					"border": (temp.m_usecustomcolor) ? "1px solid " + temp.m_chromecolor : "1px solid #dc3545",
					"color": (temp.m_useoutlinedbuttons) ? "#dc3545" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#ffffff"
				});
				break;
			case "Warning":
				$(button).css({
					"background-color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor)? temp.m_chromecolor : "#ffc107",
					"border": (temp.m_usecustomcolor) ? "1px solid " + temp.m_chromecolor : "1px solid #ffc107",
					"color": (temp.m_useoutlinedbuttons) ? "#ffc107" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#ffffff"
				});
				break;
			case "Info":
				$(button).css({
					"background-color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor)? temp.m_chromecolor : "#0dcaf0",
					"border": (temp.m_usecustomcolor) ? "1px solid " + temp.m_chromecolor : "1px solid #0dcaf0",
					"color": (temp.m_useoutlinedbuttons) ? "#0dcaf0" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#000000"
				});
				break;
			case "Light":
				$(button).css({
					"background-color": (temp.m_usecustomcolor)? temp.m_chromecolor : "#f8f9fa",
					"border": "1px solid " + (temp.m_usecustomcolor)? temp.m_chromecolor : "#f8f9fa",
					"color": (temp.m_usecustomcolor)? temp.m_fontcolor : "#000000"
				});
				break;
			case "Dark":
				$(button).css({
					"background-color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor)? temp.m_chromecolor : "#212529",
					"border": (temp.m_usecustomcolor) ? "1px solid " + temp.m_chromecolor : "1px solid #212529",
					"color": (temp.m_useoutlinedbuttons) ? "#212529" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#ffffff"
				});
				break;
		}
	}
};

InputButton.prototype.initMouseAndTouchEvent = function (comp) {
	if (!IsBoolean(this.m_designMode)) {
		var temp = this;
//		this.checkToolTipDesc = this.updateToolTipInfo(this.m_tooltip);
		var mousemoveFn = function (e) {
			if(temp.m_buttoncategory){
				switch(temp.m_buttoncategory){
					case "Primary":
						$(this).css({
							"background-color": (temp.m_usecustomcolor)? temp.m_hovercolor : "#0b5ed7",
							"border": "1px solid " + (temp.m_usecustomcolor)? temp.m_hovercolor : "#0a58ca",
							"color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#ffffff"
						});
						break;
					case "Secondary":
						$(this).css({
							"background-color": (temp.m_usecustomcolor)? temp.m_hovercolor : "#5c636a",
							"border": "1px solid " + (temp.m_usecustomcolor)? temp.m_hovercolor : "#565e64",
							"color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#ffffff"
						});
						break;
					case "Success":
						$(this).css({
							"background-color": (temp.m_usecustomcolor)? temp.m_hovercolor : "#157347",
							"border": "1px solid " + (temp.m_usecustomcolor)? temp.m_hovercolor : "#146c43",
							"color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#ffffff"
						});
						break;
					case "Danger":
						$(this).css({
							"background-color": (temp.m_usecustomcolor)? temp.m_hovercolor : "#bb2d3b",
							"border": "1px solid " + (temp.m_usecustomcolor)? temp.m_hovercolor : "#b02a37",
							"color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#ffffff"
						});
						break;
					case "Warning":
						$(this).css({
							"background-color": (temp.m_usecustomcolor)? temp.m_hovercolor : "#ffca2c",
							"border": "1px solid " + (temp.m_usecustomcolor)? temp.m_hovercolor : "#ffc720",
							"color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#ffffff"
						});
						break;
					case "Info":
						$(this).css({
							"background-color": (temp.m_usecustomcolor)? temp.m_hovercolor : "#31d2f2",
							"border": "1px solid " + (temp.m_usecustomcolor)? temp.m_hovercolor : "#25cff2",
							"color": (temp.m_useoutlinedbuttons) ? "#000000" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#000000"
						});
						break;
					case "Light":
						$(this).css({
							"background-color": (temp.m_usecustomcolor)? temp.m_hovercolor : "#d3d4d5",
							"border": "1px solid " + (temp.m_usecustomcolor)? temp.m_hovercolor : "#c6c7c8",
							"color": (temp.m_useoutlinedbuttons) ? "#000000" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#000000"
						});
						break;
					case "Dark":
						$(this).css({
							"background-color": (temp.m_usecustomcolor)? temp.m_hovercolor : "#424649",
							"border": "1px solid " + (temp.m_usecustomcolor)? temp.m_hovercolor : "#373b3e",
							"color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#ffffff"
						});
						break;
				}
			}
		};
		var mouseoutFn = function(e){
			if(temp.m_buttoncategory){
				switch(temp.m_buttoncategory){
					case "Primary":
					$(this).css({
						"border": (temp.m_usecustomcolor) ? "1px solid " + temp.m_chromecolor : "1px solid #0d6efd",
						"background-color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor) ? temp.m_chromecolor : "#0d6efd",
						"color": (temp.m_useoutlinedbuttons) ? "#0d6efd" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#ffffff"
					});
					break;
					case "Secondary":
						$(this).css({
							"background-color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor)? temp.m_chromecolor : "#6c757d",
							"border": (temp.m_usecustomcolor) ? "1px solid " + temp.m_chromecolor : "1px solid #6c757d",
							"color": (temp.m_useoutlinedbuttons) ? "#6c757d" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#ffffff"
						});
						break;
					case "Success":
						$(this).css({
							"background-color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor)? temp.m_chromecolor : "#198754",
							"border": (temp.m_usecustomcolor) ? "1px solid " + temp.m_chromecolor : "1px solid #198754",
							"color": (temp.m_useoutlinedbuttons) ? "#198754" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#ffffff"
						});
						break;
					case "Danger":
						$(this).css({
							"background-color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor)? temp.m_chromecolor : "#dc3545",
							"border": (temp.m_usecustomcolor) ? "1px solid " + temp.m_chromecolor : "1px solid #dc3545",
							"color": (temp.m_useoutlinedbuttons) ? "#dc3545" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#ffffff"
						});
						break;
					case "Warning":
						$(this).css({
							"background-color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor)? temp.m_chromecolor : "#ffc107",
							"border": (temp.m_usecustomcolor) ? "1px solid " + temp.m_chromecolor : "1px solid #ffc107",
							"color": (temp.m_useoutlinedbuttons) ? "#ffc107" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#ffffff"
						});
						break;
					case "Info":
						$(this).css({
							"background-color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor)? temp.m_chromecolor : "#0dcaf0",
							"border": (temp.m_usecustomcolor) ? "1px solid " + temp.m_chromecolor : "1px solid #0dcaf0",
							"color": (temp.m_useoutlinedbuttons) ? "#0dcaf0" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#000000"
						});
						break;
					case "Light":
						$(this).css({
							"background-color": (temp.m_usecustomcolor)? temp.m_chromecolor : "#f8f9fa",
							"border": "1px solid " + (temp.m_usecustomcolor)? temp.m_chromecolor : "#f8f9fa",
							"color": (temp.m_usecustomcolor)? temp.m_fontcolor : "#000000"
						});
						break;
					case "Dark":
						$(this).css({
							"background-color": (temp.m_useoutlinedbuttons) ? "#ffffff" : (temp.m_usecustomcolor)? temp.m_chromecolor : "#212529",
							"border": (temp.m_usecustomcolor) ? "1px solid " + temp.m_chromecolor : "1px solid #212529",
							"color": (temp.m_useoutlinedbuttons) ? "#212529" : (temp.m_usecustomcolor)? temp.m_fontcolor : "#ffffff"
						});
						break;
				}
			}
		};
		var clickFn = function(e){
			if (!IsBoolean(this.m_designMode)) {
				temp.getDataPointAndUpdateGlobalVariable();
			}
		};
		var hoverFn = function(e){
			$(this).css("cursor", temp.m_cursortype);
		};
		var touchstartFn = function(e){
			//DO NOTHING
		};
		if ("ontouchstart" in document.documentElement) {
			/** captures touch event on container div **/
			$("#draggableDiv" + temp.m_objectid).bind("touchstart", function(e) {
				e.stopImmediatePropagation();
				if($("." + temp.m_objecttype + "ToolTipDiv").length){
					mouseoutFn.bind($(comp))(e);
				}else{
					touchstartFn.bind(this)(e);
				}
				clickFn.bind(this)(e);
			}).bind("touchend", function(e) {
				/** Do Nothing **/
			});
		}else{
			$(comp).click(function (e) {
				mouseoutFn.bind(this)(e);
				clickFn.bind(this)(e);
			})
			.hover(function (e) {
				hoverFn.bind(this)(e);
			})
			.mousemove(function (e) {
				mousemoveFn.bind(this)(e);
			})
			.mouseout(function (e) {
				mouseoutFn.bind(this)(e);
			});
		}
		
		/** captures swipe events on division **/
		$("#draggableDiv" + temp.m_objectid).on("swipeleft", function(e) {
			onSwipeLeft(temp, e);
		}).on("swiperight", function(e) {
			onSwipeRight(temp, e);
		}).on("mousewheel", function(e) {
//			temp.hideToolTip();
		});

		$(".draggablesParentDiv").on("scroll", function(e) {
//			temp.hideToolTip();
		});
		$("#WatermarkDiv").on("scroll", function(e) {
//			temp.hideToolTip();
		});
	}
};

InputButton.prototype.getDataPointAndUpdateGlobalVariable = function () {
	//	if(this.m_fieldvalue!=""){
	var fieldNameValueMap = {};
	var fieldname = (this.m_fieldname == "" || this.m_fieldname == undefined) ? "Value" : this.m_fieldname;
	fieldNameValueMap[fieldname] = this.m_fieldvalue;
	this.updateDataPoints(fieldNameValueMap);
	//	}
};
//# sourceURL=InputButton.js