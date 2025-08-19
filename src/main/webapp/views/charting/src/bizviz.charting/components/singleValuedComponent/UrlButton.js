/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: UrlButton.js
 * @description UrlButton
 **/
function UrlButton(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();

	this.m_param = [];
	this.m_fontsize = "";
	this.m_color = "";
	this.m_height = "";
	this.m_fontfamily = "Roboto";
	this.m_encode = "";
	this.m_width = "";
	this.m_chromecolor = "";
	this.m_url = "www.bdbizviz.com";
	this.m_tooltip = "";
	this.m_fontstyle = "";
	this.m_opendoc = "";
	this.m_fontweight = "";
	this.m_label = "";
	this.m_globalkey = "";
	this.m_fieldvalue = "";
	this.m_borderradius = 0;

	this.m_objectID = [];
	this.m_componentid = "";
	this.checkToolTipDesc = "";

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_cursortype = "pointer";
};

UrlButton.prototype = new Widget();

UrlButton.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

UrlButton.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	this.m_param = [];
	for (var key in jsonObject) {
		if (key == "URLButton") {
			for (var urlKey in jsonObject[key]) {
				if (urlKey == "Params") {
					var paramArr = jsonObject[key][urlKey]["Param"];
					for (var i = 0; i < paramArr.length; i++) {
						var param = new UrlButtonParam();
						for (var paramKey in paramArr[i]) {
							this.setAttributeValueToNode(paramKey, paramArr[i], param);
						}
						this.setParam(param);
					}
				} else{
					this.setAttributeValueToNode(urlKey, jsonObject[key], nodeObject);
				}
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

UrlButton.prototype.setDataProvider = function (data) {
	this.m_url = data;
};
UrlButton.prototype.getDataProvider = function () {
	return this.m_url;
};
UrlButton.prototype.setTargetValue = function (paramArr) {
	if (typeof paramArr == "object") {
		for (var paramKey in paramArr) {
			var isNewParam = true;
			for (var j = 0; j < this.getParam().length; j++) {
				if (paramKey == this.m_param[j].m_name) {
					isNewParam = false;
					this.m_param[j].m_name = paramKey;
					this.m_param[j].m_value = paramArr[paramKey];
					break;
				}
			}
			if (isNewParam) {
				var param = new UrlButtonParam();
				param.m_name = paramKey;
				param.m_value = paramArr[paramKey];
				this.setParam(param);
			}
		}
	}
};

UrlButton.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

UrlButton.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
};
UrlButton.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "urlDiv" + this.m_objectid;
};

UrlButton.prototype.draw = function () {
	this.drawObject();
};

UrlButton.prototype.drawObject = function () {
	//this.callDrawInit();
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback!="")
		onAfterRender(this.m_onafterrendercallback);
};

UrlButton.prototype.init = function () {
	this.setUrl();
	this.m_chromecolor = convertColorToHex(this.m_chromecolor);
	this.m_color = convertColorToHex(this.m_color);
};

UrlButton.prototype.setUrl = function () {
	if(this.m_url && this.m_url !== ""){
		if( (""+this.m_url).indexOf("://") == -1 && (""+this.m_url).indexOf("//") != 0){
			this.m_url = "//" + this.m_url;
		}else{
			this.m_url = (""+this.m_url).substr( (""+this.m_url).indexOf("://") + 1);
		}
	}
};

UrlButton.prototype.drawChart = function () {
	if (IsBoolean(this.m_isActive)) {
		this.drawUrlButton();
		//this.initMouseAndTouchEvent("#urlButton" + this.m_objectid);
		this.initMouseAndTouchEventSVC("#urlButton" + this.m_objectid);
	}
};

UrlButton.prototype.removeUrlButtonDiv = function () {
	$("#urlDiv" + this.m_objectid).remove();
};

UrlButton.prototype.drawUrlButton = function () {
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
	button.setAttribute("id", "urlButton" + temp.m_objectid);
	button.setAttribute("class", "URLbutton");
	button.value = this.formattedDescription(this, this.m_label);
	obj.appendChild(button);
	$(button).css({
		"width": this.m_width + "px",
		"height": this.m_height + "px",
		"border-radius": this.m_borderradius+"px",
		"border": "0px",
		"font-style": this.m_fontstyle,
		"font-weight": this.m_fontweight,
		"font-size": this.fontScaling(this.m_fontsize),
		"font-family": selectGlobalFont(this.m_fontfamily),
		"background-color": this.m_chromecolor,
		"color": this.m_color,
		"padding": padding+"px 2px "+padding+"px 2px"
	});
};

UrlButton.prototype.initMouseAndTouchEvent = function (comp) {
	if (!IsBoolean(this.m_designMode)) {
		var temp = this;
		this.checkToolTipDesc = this.updateToolTipInfo(this.m_tooltip);
		var mousemoveFn = function (e) {
			if (!temp.m_designMode && temp.m_tooltip != "" && temp.m_tooltip != " ") {
				e.stopPropagation();
				temp.removeToolTipDiv();
				var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
				var scrollLeft =  parentDiv.scrollLeft;
				var scrollTop =  parentDiv.scrollTop;
				var offset = $(parentDiv).offset();
				var PageTop =  offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
				var PageLeft = offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft; 
				var offsetLeft = $(this)[0].offsetLeft;
				var offsetTop = $(this)[0].offsetTop;
				var divTop = e.pageY - PageTop - offsetTop + 5;
				var divLeft = e.pageX - PageLeft - offsetLeft + 5;
				var tooltipDiv = document.createElement("div");
				tooltipDiv.innerHTML = temp.checkToolTipDesc;
				tooltipDiv.setAttribute("id", "toolTipDiv");
				tooltipDiv.setAttribute("class", "settingIcon");
				tooltipDiv.setAttribute("placement", "bottom");
				$(".draggablesParentDiv").append(tooltipDiv);
				
				/*	var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
					"top": divTop + "px",
					"left": divLeft + "px"
				});
				$(tooltipDiv).css(tooltipObjCss);*/
				
				var wd = temp.m_width * 1,
				ht = temp.m_height * 1;
				var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
					"top": e.pageY - e.offsetY + ht  - PageTop - offsetTop - 11 + "px",
					"left": e.pageX - e.offsetX - PageLeft - offsetLeft + 10 + "px"
				});
				//"top": temp.m_top + ht  - PageTop - offsetTop - 11 + "px",
				//"left": temp.m_left  - PageLeft - offsetLeft + 10 + "px"
				$(tooltipDiv).css(tooltipObjCss);
				//var lt =  temp.m_left + (wd/2) - (tooltipDiv.offsetWidth/2) - PageLeft - offsetLeft +5+ "px";
				var lt =  e.pageX - e.offsetX + (wd/2) - PageLeft - (tooltipDiv.offsetWidth/2) - 8 + "px";
				$(tooltipDiv).css("left",lt);
				$(tooltipDiv).css("box-shadow","0 5px 15px -5px rgb(0 0 0 / 50%)");
				
				/** Adjust if going out of boundary **/
				if (divTop * 1 + 10 * 1 + $(tooltipDiv).height() * 1 > temp.m_dashboard.m_AbsoluteLayout.m_height*1 + scrollTop) {
					divTop = PageTop * 1 - 10 + scrollTop * 1 - $(tooltipDiv).height() * 1;
					$(tooltipDiv).css("top", divTop);
				}
				if (divLeft * 1 + 10 * 1 + $(tooltipDiv).width() * 1 > temp.m_dashboard.m_AbsoluteLayout.m_width*1 + scrollLeft) {
					divLeft = divLeft - $(tooltipDiv).width() * 1;
					$(tooltipDiv).css("left", divLeft);   
				}
			}
		};
		var mouseoutFn = function(e){
			temp.removeToolTipDiv();
		};
		var clickFn = function(e){
			temp.getDataPointAndUpdateGlobalVariable();
			if (temp.m_url) {
				try {
					temp.loadURL( temp.getURLToCall(temp.m_url) );
				} catch (e) {
					console.log("Error Occured - " + temp.getURLToCall(temp.m_url) + "\n" + e.message)
				}
			}
		};
		var hoverFn = function(e){
			$(this).css("cursor", temp.m_cursortype);
		};
		var touchstartFn = function(e){
			e.stopImmediatePropagation();
			if (!temp.m_designMode && temp.m_tooltip != "" && temp.m_tooltip != " ") {
				if($(".draggablesParentDiv").find("#" + "toolTipDiv").length === 0 ){
					var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
					var scrollLeft =  parentDiv.scrollLeft;
					var scrollTop =  parentDiv.scrollTop;
					var PageTop = e.originalEvent.touches[0].pageY; 
					var PageLeft = e.originalEvent.touches[0].pageX;
					var divTop = PageTop * 1 + scrollTop * 1 + 20 * 1 ;
					var divLeft = (((PageLeft * 1 + scrollLeft * 1) - 150) < 0) ? (PageLeft * 1 + scrollLeft * 1) : (PageLeft * 1 + scrollLeft * 1) - 160;
					var tooltipDiv = document.createElement("div");
					tooltipDiv.innerHTML = temp.checkToolTipDesc;
					tooltipDiv.setAttribute("id", "toolTipDiv");
					tooltipDiv.setAttribute("class", temp.m_objecttype + "ToolTipDiv");
					$(".draggablesParentDiv").append(tooltipDiv);
					var tStyles = $.extend(temp.getTooltipStyles(), {
						"top": divTop + "px",
						"left": divLeft + "px"
					});
					$(tooltipDiv).css(tStyles);
					
					/** Adjust if going out of boundary **/
					if (divTop * 1 + 20 * 1 + $(tooltipDiv).height() * 1 > temp.m_dashboard.m_AbsoluteLayout.m_height + scrollTop) {
						divTop = PageTop * 1 - 20 + scrollTop * 1 - $(tooltipDiv).height() * 1;
						$(tooltipDiv).css("top", divTop);
					}
					if (divLeft * 1 + 10 * 1 + $(tooltipDiv).width() * 1 > temp.m_dashboard.m_AbsoluteLayout.m_width + scrollLeft) {
						divLeft = PageTop * 1 - 10 + scrollLeft * 1 - $(tooltipDiv).width() * 1;
						$(tooltipDiv).css("left", divLeft);
					}
				}else{
					temp.removeToolTipDiv();
				}
			}
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
			temp.hideToolTip();
		});

		$(".draggablesParentDiv").on("scroll", function(e) {
			temp.hideToolTip();
		});
		$("#WatermarkDiv").on("scroll", function(e) {
			temp.hideToolTip();
		});
	}
};
UrlButton.prototype.getURLToCall = function (url) {
	var len = this.m_param.length;
	var params = (len > 0) ? "?" : "";
	for (var i = 0; i < len; i++) {
		params += this.m_param[i].m_name + "=" + this.getFormattedValue(this.m_param[i].m_value);
		if (i < (len - 1)){
			params += "&amp;";
		}
	}
	return url + params;
};
UrlButton.prototype.loadURL = function (url) {
	window.open( url );
};
UrlButton.prototype.getFormattedValue = function (value) {
	var key = value;
	var str = key;
	var re = /\{(.*?)\}/g;
	for (var m = re.exec(key); m; m = re.exec(key)) {
		if (this.m_dashboard != "" && this.m_dashboard != undefined) {
			var globalVariableObj = this.m_dashboard.getGlobalVariable();
			if (globalVariableObj != "" && globalVariableObj != undefined) {
				var globalVarValue = globalVariableObj.getFieldValue(m[1]);
				str = str.replace(m[0], globalVarValue);
			}
		}
	}
	return str;
};

UrlButton.prototype.setParam = function (paramObject) {
	this.m_param.push(paramObject);
};

UrlButton.prototype.getParam = function () {
	return this.m_param;
};
UrlButton.prototype.getDataPointAndUpdateGlobalVariable = function () {
	//	if(this.m_fieldvalue!=""){
	var fieldNameValueMap = {};
	var fieldname = (this.m_fieldname == "" || this.m_fieldname == undefined) ? "Value" : this.m_fieldname;
	fieldNameValueMap[fieldname] = this.m_fieldvalue;
	this.updateDataPoints(fieldNameValueMap);
	//	}
};
function UrlButtonParam() {
	this.m_name;
	this.m_value;
};

UrlButtonParam.prototype.getName = function () {
	return this.m_name;
};
UrlButtonParam.prototype.setName = function (m_name) {
	this.m_name = m_name;
};
UrlButtonParam.prototype.getValue = function () {
	return this.m_value;
};
UrlButtonParam.prototype.setValue = function (m_value) {
	this.m_value = m_value;
};
//# sourceURL=UrlButton.js