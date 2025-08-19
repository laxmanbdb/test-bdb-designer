/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: SVGShape.js
 * @description SVGShape
 **/
function SVGShape(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();
	this.m_objectID = [];
	this.m_componentid = "";

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;

	this.m_color = "#ff0000";
	this.m_stroke = "none";
	this.m_symbol = "Question";
	this.m_tooltip = "";
	this.m_symbolcategory = "Others";
	this.m_defaultpath = svg_path_set["warning"];
	this.m_value = 0;
	this.m_opacity = "1";
	this.m_rolloveropacity = "1";
	this.m_cursortype = "pointer";
};

SVGShape.prototype = new Widget();

SVGShape.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

SVGShape.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "SVGShape") {
			for (var labelKey in jsonObject[key]) {
				this.setAttributeValueToNode(labelKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

SVGShape.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};
SVGShape.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

SVGShape.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
};
SVGShape.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	this.m_componentid = "shapeDiv" + this.m_objectid;
};
SVGShape.prototype.draw = function () {
	this.drawObject();
};

SVGShape.prototype.drawObject = function () {
	//this.callDrawInit();
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback!="")
		onAfterRender(this.m_onafterrendercallback);
};

SVGShape.prototype.init = function () {
	if (this.m_symbolcategory == "" || this.m_symbolcategory == undefined || this.m_symbolcategory == "none"){
		this.m_symbol = "none";
	}
	this.createSubContainer();
};
/**@description  This subcontainer will be used instead of mainContainer div to reset the width/heights of svg **/
SVGShape.prototype.createSubContainer = function () {
	var temp = this;
	var div = document.createElement("div");
	$("#svgShapeContainer" + temp.m_objectid).remove();
	div.setAttribute("id", "svgShapeContainer" + temp.m_objectid);
	div.style.width = (this.m_width) + "px";
	div.style.height = (this.m_height) + "px";
	$("#draggableDiv" + temp.m_objectid).append(div);
};

SVGShape.prototype.drawChart = function () {
	if (this.getPath().indexOf("bd-") == -1) {
		this.drawSVGShape();
		//this.initMouseAndTouchEvent("#svgShapeContainer" + this.m_objectid);
		this.initMouseAndTouchEventSVC("#svgShapeContainer" + this.m_objectid);
	} else {
		this.drawSpanWithfontIcon();
		//this.initMouseAndTouchEvent("#bdFontSpan" + this.m_objectid);
		//this.initMouseAndTouchEvent("#svgShapeContainer" + this.m_objectid);
		this.initMouseAndTouchEventSVC("#svgShapeContainer" + this.m_objectid);
	}
};
SVGShape.prototype.getPath = function () {
	var path;
	if(this.m_symbol !== "none"){
		for (var key in svg_path_set) {
			if (key.toLowerCase() == this.m_symbol.toLowerCase()) {
				path = svg_path_set[key];
				break;
			}
		}
	}
	var pt = (path != undefined && this.m_symbolcategory != "none") ? path : ((this.m_pathdata != undefined || this.m_pathdata != "") ? this.m_pathdata : this.m_defaultpath);

	return pt;
}
SVGShape.prototype.drawSVGShape = function () {
	var temp = this;
	var container = $("#svgShapeContainer" + temp.m_objectid);
	$(container).css("cursor", this.m_cursortype);
	$(container).empty();
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	$(svg).attr("id", "shape" + temp.m_objectid);
	$(svg).attr("class", "svgPointer");
	svg.style.opacity = this.m_opacity;
	container.append(svg);
	var draw = SVG("shape" + temp.m_objectid);
	draw.size(this.m_width, this.m_height); // Set the width to 200 and the height to 150
	try{
		var pathElement = draw.path(this.getPath());
		this.setVisualProperties(pathElement);
	}catch(e){
		console.log(e);
	}
};

SVGShape.prototype.drawSpanWithfontIcon = function () {
	var temp = this;
	var size = (this.m_width <= this.m_height) ? this.m_width : this.m_height
	var container = $("#svgShapeContainer" + temp.m_objectid);
	$(container).css("cursor", this.m_cursortype);
	$(container).empty();
	var span = document.createElement("span");
	span.id = "bdFontSpan" + temp.m_objectid;
	var path = this.getPath();
	if(path.startsWith("glyphicon", 3)){
		pathElement = path.slice(3);//to remove 'bd-' from path
	} else {
		pathElement = path;
	}
	try {
		/*span.setAttribute("class", "icon " + this.getPath()+ " svgPointer");*/
		span.setAttribute("class", pathElement);
	} catch (e) {
		span.setAttribute("class", "icon bd-stop svgPointer");
	}
	span.style.opacity = this.m_opacity;
	span.style.color = this.m_color;
	span.style.fontSize = size + "px";
	container.append(span);
};
SVGShape.prototype.setVisualProperties = function (pathElement) {
	pathElement.attr({
		fill : this.m_color
	});
	pathElement.attr({
		stroke : this.m_stroke
	})
	//DAS-540
	pathElement.size((this.m_width * 1) - 10, (this.m_height * 1) - 10);
};
SVGShape.prototype.initMouseAndTouchEvent = function (comp) {
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
				
				/*var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
					"top": divTop + "px",
					"left": divLeft + "px"
				});*/
				var wd = temp.m_width * 1,
				ht = temp.m_height * 1;
				var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
					"top": e.pageY - e.offsetY + ht  - PageTop - offsetTop - 20 + "px",
					"left": e.pageX - e.offsetX - PageLeft - offsetLeft + 10 + "px"
				});
				//"top": temp.m_top + ht  - PageTop - offsetTop - 20 + "px",
				//"left": temp.m_left  - PageLeft - offsetLeft + 10 + "px"
				$(tooltipDiv).css(tooltipObjCss);
				//var lt =  temp.m_left + (wd/2) - (tooltipDiv.offsetWidth/2) - PageLeft - offsetLeft + 5 + "px";
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

SVGShape.prototype.getDataPointAndUpdateGlobalVariable = function () {
	//	if(this.m_fieldvalue!=""){
	var fieldNameValueMap = {};
	var fieldname = (this.m_fieldname == "" || this.m_fieldname == undefined) ? "Value" : this.m_fieldname;
	fieldNameValueMap[fieldname] = this.m_fieldvalue;
	this.updateDataPoints(fieldNameValueMap);
	//}
};
//# sourceURL=SVGShape.js