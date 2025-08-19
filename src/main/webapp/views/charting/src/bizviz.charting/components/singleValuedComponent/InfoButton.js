/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: InfoButton.js
 * @description InfoButton
 **/
function InfoButton(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();

	this.m_tooltip = "";
	this.checkToolTipDesc = "";
	this.m_label = "";
	this.m_radius = "";
	this.m_darkcolor = "";
	this.m_windowchromecolor = "";
	this.m_lightcolor = "";
	this.m_informationwindowwidth = "";
	this.m_informationwindowheight = "";
	this.m_informationtitle = "";
	this.m_information = "";
	this.m_infoButtonId = "";
	this.m_updatetitle = "";
	this.m_color = "#000000";
	this.m_textcolor = "#fef4e9";
	this.m_fontstyle = "normal";
	this.m_fontweight = "normal";
	this.m_fontfamily = "Roboto";
	this.m_textdecoration = "none";
	this.m_fontsize = "12";
	this.m_titlefontcolor = "#ffffff";
	this.m_titlefontsize = "12";

	this.m_objectID = [];
	this.m_componentid = "";
	this.m_height = this.m_width;
	this.m_radius = this.m_width / 2;

	this.m_objectID = [];
	this.m_componentid = "";
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	
	this.m_windowbackgroundcolor = "#FFFFFF";
	this.m_windowbordercolor = "#fafafa";
	this.m_windowborderradius = "0";
	
	this.m_updateddesign ="true";
};

InfoButton.prototype = new Widget();

InfoButton.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

InfoButton.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "InfoButton") {
			for (var labelKey in jsonObject[key]) {
				this.setAttributeValueToNode(labelKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

InfoButton.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

InfoButton.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
};
InfoButton.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "InfoDiv" + this.m_objectid;
};

InfoButton.prototype.draw = function () {
	this.drawObject();
};

InfoButton.prototype.drawObject = function () {
	//this.callDrawInit();
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback!="")
		onAfterRender(this.m_onafterrendercallback);
};

InfoButton.prototype.init = function () {
	this.m_darkcolor = convertColorToHex(this.m_darkcolor);
	this.m_windowchromecolor = convertColorToHex(this.m_windowchromecolor);
	this.m_lightcolor = convertColorToHex(this.m_lightcolor);
};

InfoButton.prototype.drawChart = function () {
	var temp = this;
	if (IsBoolean(this.m_isActive)) {
		var contaier = $("#draggableDiv" + temp.m_objectid);
		this.drawInfoButton(contaier);
		//this.initMouseAndTouchEvent("#infoButton" + this.m_componentid);
		this.initMouseAndTouchEventSVC("#infoButton" + this.m_componentid);
	}
};

InfoButton.prototype.calculateTitleWidth = function (font, width) {
	var res = font.split("");
	var titlewidth = width - 45;
	var w = 0;
	var str = "";
	var count = 0;
	var fontProp = (this.m_titlefontsize * 1) + "px " + selectGlobalFont(this.m_fontfamily);
	for (var i = 0; i < res.length; i++) {
		if (titlewidth > w) {
			str = str + res[i];
			var o = $("<div>" + str + "</div>").css({
					"position" : "absolute", "float" : "left",
					"white-space" : "nowrap", "visibility" : "hidden",
					"font" : fontProp
				}).appendTo($("body"));
			w = o.width();
			o.remove();
		} else {
			count++;
		}
	}
	return (count != 0) ? (str + "..") : str;
};

InfoButton.prototype.drawInfoButton = function (contaier) {
	var temp = this;
	$("#" + temp.m_componentid).remove();
	var infoButtonDiv = document.createElement("div");
	infoButtonDiv.setAttribute("id", this.m_componentid);
	$("#draggableDiv" + temp.m_objectid).append(infoButtonDiv);
	infoButtonDiv.style.position = "absolute";

	var infoButton = document.createElement("input");
	infoButton.type = "button";
	this.m_infoButtonId = "infoButton" + this.m_componentid;
	infoButton.setAttribute("id", this.m_infoButtonId);
	infoButton.setAttribute("class", "infoButton");
	infoButton.value = this.m_label;
	infoButtonDiv.appendChild(infoButton);
	this.setInfoButtonCSS(infoButton);
	
	temp.m_informationtitle = (temp.m_informationtitle == "") ? " " : temp.m_informationtitle;
	this.m_updatetitle = this.calculateTitleWidth(temp.m_informationtitle, temp.m_informationwindowwidth);
};

InfoButton.prototype.initMouseAndTouchEvent = function (comp) {
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
					"top":  e.pageY - e.offsetY + ht  - PageTop - offsetTop - 11 + "px",
					"left":  e.pageX - e.offsetX  - PageLeft - offsetLeft + 10 + "px"
				});
				//"top": temp.m_top + ht  - PageTop - offsetTop - 11 + "px",
				//"left": temp.m_left  - PageLeft - offsetLeft + 10 + "px"
				$(tooltipDiv).css(tooltipObjCss);
				//var lt =  temp.m_left + (wd/2) - (tooltipDiv.offsetWidth/2) - PageLeft - offsetLeft +5+ "px";
				var lt = e.pageX - e.offsetX + (wd/2) - PageLeft - (tooltipDiv.offsetWidth/2) - 8 +  "px";
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
			if ($("#PopUp" + temp.m_componentid) != null){
				$("#PopUp" + temp.m_componentid).remove();
			}
			var popupdiv = document.createElement("popupdiv");
			var popupID = "PopUp" + temp.m_componentid;
			popupdiv.setAttribute("id", popupID);
			popupdiv.style.width = temp.m_informationwindowwidth + "px";
			popupdiv.style.height = temp.m_informationwindowheight + "px";
			popupdiv.style.padding = "0px";
			temp.m_windowbackgroundcolor = (IsBoolean(this.m_updateddesign) ? "#000000" : "#FFFFFF");
			temp.m_windowbordercolor = (IsBoolean(this.m_updateddesign) ? "#434344" : "#fafafa");
			
			var content = '<pre style="color:' + convertColorToHex(temp.m_color) + '; font-style:' + temp.m_fontstyle + '; font-family:' + selectGlobalFont(temp.m_fontfamily) + '; font-weight:' + temp.m_fontweight + '; background-color:' + convertColorToHex(temp.m_windowbackgroundcolor) + ';border: 1px solid ' + convertColorToHex(temp.m_windowbordercolor) + '; font-size:' + temp.m_fontsize * 1 + 'px; overflow-x:hidden; white-space: pre-wrap; word-wrap: break-word; margin-top:auto; height:' + (temp.m_informationwindowheight - 70) + 'px;">' + temp.m_information + '</pre>';
			if(temp.m_textdecoration.toLowerCase() == "underline"){
				content = '<u style="color:' + convertColorToHex(temp.m_color) + ';">' + content + '</u>';
			}
			popupdiv.innerHTML =  content;
			$("#draggableDiv" + temp.m_objectid).append(popupdiv);
			
			jqEasyUI("#" + popupID).dialog({
				title : temp.m_updatetitle,
				width : temp.m_informationwindowwidth + "px",
				closed : false,
				cache : false,
				modal : true
			});
			temp.setInfoDialogCSS();
			temp.getDataPointAndUpdateGlobalVariable();
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

InfoButton.prototype.setTooltipCSS = function (infoButton, y, heightlimit, x) {
	if (y >= (infoButton.parentElement.clientHeight-this.m_height*1)){
		/**Added to show tool tip when Info Button at the bottom of the dashboard .*/
		y = y - (infoButton.clientHeight*1 + 10*1);
	}else{
		var width = $("#TooltipDivInfo" + this.m_objectid).width();
		x = x + width*0.5;
	}
	$("#TooltipDivInfo" + this.m_objectid).css("top", y+"px");
	$("#TooltipDivInfo" + this.m_objectid).css("left", x+"px");
};

InfoButton.prototype.setInfoButtonCSS = function (infoButton) {
	var temp = this;
	var padding = ((this.m_height - this.fontScaling(this.m_fontsize * 1) * 1.5)/2);
	var border = (IsBoolean(this.m_updateddesign) ? "1px solid #434344" : "0px");
	$("#" + temp.m_infoButtonId).css({"width": temp.m_width,
		"height": temp.m_height,
		"overflow-wrap": "break-word",
		"border": border,
		"border-radius": (temp.m_radius * 3 / 10) + "px",
		"color": convertColorToHex(temp.m_textcolor),
		"padding": padding+"px 2px "+padding+"px 2px"
	});
	this.setBackgroundGradient(temp.m_darkcolor, temp.m_lightcolor);
};

InfoButton.prototype.setBackgroundGradient = function (darkcolor, lightcolor) {
	var temp = this;
	$("#" + temp.m_infoButtonId).css({"background": lightcolor,
		"background": "-webkit-gradient(linear, left top, left bottom, from(" + lightcolor + "), to(" + darkcolor + "))",
		"background": "-moz-linear-gradient(top,  " + lightcolor + ",  " + darkcolor + ")",
		"background": "-o-linear-gradient(top,  " + lightcolor + ",  " + darkcolor + ")",
		"background": "linear-gradient(top,  " + lightcolor + ",  " + darkcolor + ")",
		"background-color": "-ms-linear-gradient(top,  " + lightcolor + ",  " + darkcolor + ")"});
};

InfoButton.prototype.setInfoDialogCSS = function() {
    var temp = this;
    $("#PopUp" + temp.m_componentid).find(".panel div").css("height", temp.m_informationwindowheight + "px");
    jqEasyUI(".panel-title").css({
        "line-height": "26px",
        "padding-left": "2px",
        "background-color": temp.m_windowchromecolor,
        "color": convertColorToHex(temp.m_titlefontcolor),
        "font-family": selectGlobalFont(temp.m_fontfamily),
        "font-size": temp.m_titlefontsize * 1 + "px",
        "font-weight": temp.m_fontweight,
        "font-style": temp.m_fontstyle,
        "text-decoration": (temp.m_textdecoration.toLowerCase() == "underline") ? "underline" : "none"
    });
    /**DAS-157 added below conditions to handle dialog when scaling is enabled**/
    if (IsBoolean(!temp.m_dashboard.m_scalingenabled)) {
        jqEasyUI(".window-mask").css({
            "background": "#000",
            "left": $(".draggablesParentDiv")[0].offsetLeft * 1 + "px",
            "width": (temp.m_dashboard.m_AbsoluteLayout.m_width * 1 + 2) + "px",
            "height": temp.m_dashboard.m_AbsoluteLayout.m_height * 1 + "px"
        });
    } else {
        jqEasyUI(".window-mask").css({
            "background": "#000"
        });
    }

    jqEasyUI(".window").css({
        "background": "#FFFFFF",
        "border-radius": this.m_windowborderradius + "px"
    });
    jqEasyUI(".panel-header-noborder").css("border-width", "0px");
    jqEasyUI(".panel-body").css("border-style", "hidden");
    jqEasyUI(".panel").css("text-align", "left");
    jqEasyUI(".window-shadow").remove();
};
InfoButton.prototype.getDataPointAndUpdateGlobalVariable = function () {
	//	if(this.m_fieldvalue!=""){
	var fieldNameValueMap = {};
	var fieldname = (this.m_fieldname == "" || this.m_fieldname == undefined) ? "Value" : this.m_fieldname;
	fieldNameValueMap[fieldname] = this.m_fieldvalue;
	this.updateDataPoints(fieldNameValueMap);
	//	}
};
//# sourceURL=InfoButton.js