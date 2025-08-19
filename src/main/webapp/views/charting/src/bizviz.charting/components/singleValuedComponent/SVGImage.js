/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: SVGImage.js
 * @description SVGImage
 **/
function SVGImage(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();
	this.m_objectID = [];
	this.m_componentid = "";

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;

	this.m_color = "#ff0000";
	this.m_stroke = "none";

	this.m_tooltip = "";

	this.m_value = 0;
	this.m_symbol = "happy";
	this.m_defaultimg = svg_set["happy"];
	this.m_imgdata = "";
	this.m_opacity = "1";
	this.checkToolTipDesc = "";
	this.m_cursortype = "pointer";
};

SVGImage.prototype = new Widget();

SVGImage.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

SVGImage.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "SVGImage") {
			for (var labelKey in jsonObject[key]) {
				this.setAttributeValueToNode(labelKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

SVGImage.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};
SVGImage.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

SVGImage.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
};
SVGImage.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	this.m_componentid = "svgImageContainer" + this.m_objectid;
};
SVGImage.prototype.draw = function () {
	this.drawObject();
};

SVGImage.prototype.drawObject = function () {
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback!="")
		onAfterRender(this.m_onafterrendercallback);
};

SVGImage.prototype.init = function () {
	this.createSubContainer();
};
/**@description  This subcontainer will be used instead of mainContainer div to reset the width/heights of svg **/
SVGImage.prototype.createSubContainer = function () {
	var temp = this;
	var div = document.createElement("div");
	$("#" + temp.m_componentid).remove();
	div.setAttribute("id", temp.m_componentid);
	div.style.width = ((this.m_width > this.m_height) ? this.m_height : this.m_width) + "px";
	div.style.height = ((this.m_width > this.m_height) ? this.m_height : this.m_width) + "px";
	$("#draggableDiv" + temp.m_objectid).append(div);
};

SVGImage.prototype.drawChart = function () {
	this.drawSVGImage();
};
SVGImage.prototype.getImage = function () {
	var img;
	for (var key in svg_set) {
		if (key.toLowerCase() == this.m_symbol.toLowerCase()) {
			img = svg_set[key];
			break;
		}
	}
	var pt = (img != undefined && this.m_symbolcategory != "none") ? img : (this.m_imgdata != undefined || this.m_imgdata != "" ? this.m_imgdata : this.m_defaultimg);

	return pt;
};
 
SVGImage.prototype.drawSVGImage = function () {
	var temp = this;
	var container = $("#" + temp.m_componentid);
	$(container).css("cursor", this.m_cursortype);
	$(container).empty();
	var img = this.getImage();
	try {
		var str = img;
		var index = 4;
		for (var i = 0; i < $(img).length; i++) {
			if ($(img)[i].tagName != undefined && ($(img)[i].tagName).toLowerCase() == "svg") {
				index = i;
				break;
			}
		}
		if ($(img)[index] != undefined) {
			var attrs = $(img)[index].attributes;

			var viewBox;
			var height;
			var width;
			for (var i = 0; i < attrs.length; i++) {
				if (attrs[i].name == "height")
					height = attrs[i].value;
				if (attrs[i].name == "width")
					width = attrs[i].value;
				if ((attrs[i].name).toLowerCase() == "viewbox")
					viewBox = attrs[i].value;
			}
			if (viewBox == undefined) {
				viewBox = "0 0 " + height * 1 + " " + width * 1;
				str = img.replace('height="' + height + '"', 'viewBox="' + viewBox + '"');
				str = str.replace('width="' + width + '"', "");
			} else {
				str = str.replace('width="' + width + '"', "");
				str = str.replace('height="' + height + '"', "");
			}
		}
		//Removed SVG.js draw
	var svg = $.parseHTML(str);
		$(svg).attr("id", "svgImg" + temp.m_objectid);
		$(svg).attr("class", "svgPointer");
		$(svg).css("opacity", this.m_opacity);
		$(svg).attr("width",this.m_width); // Set the desired width
		$(svg).attr("height", this.m_height); // Set the desired height
		$(container).append(svg);	
		
//			var draw = SVG("svgImg" + temp.m_objectid)
//			var store = draw.svg(str);
	} catch (e) {
		console.log(e);
		console.log("Invalid SVG Image");
	}
	//this.initMouseAndTouchEvent("#" + temp.m_componentid);
	this.initMouseAndTouchEventSVC("#" + temp.m_componentid);
};
SVGImage.prototype.initMouseAndTouchEvent = function (comp) {
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
				var lt =  e.pageX - e.offsetX + (wd/2) - PageLeft - (tooltipDiv.offsetWidth/2) - 16 + "px";
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
			OnMouseClick(temp);
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
/** Called from OnMouseClick in Widget.js **/
SVGImage.prototype.getDataPointAndUpdateGlobalVariable = function () {
	var fieldNameValueMap = {};
	var fieldname = (this.m_fieldname == "" || this.m_fieldname == undefined) ? "Value" : this.m_fieldname;
	fieldNameValueMap[fieldname] = this.m_fieldvalue;
	this.updateDataPoints(fieldNameValueMap);
};
//# sourceURL=SVGImage.js