/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: ImageComponent.js
 * @description ImageComponent
 **/
function ImageComponent(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();

	this.m_rolloverglowcolor = "#3333FF";
	this.m_maintainaspectratio = false;
	this.m_tooltip = "ImageComponent Component";
	this.m_valuefield = "Value";
	this.m_alpha = 0.9;
	this.m_datarownumber = "";
	this.m_rolloverglowenable = true;
	this.m_virtualdataid = "";
	this.m_virtualdatafield = "";
	this.m_imagePath = this.m_span = "images/imageComponent.png";
	this.m_imageSource = "";
	this.m_borderradius = 0;
	//this.imageComponentObj=new Image();
	this.imageComponentObj = new Image();
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_datapointtoupdate = "";
	this.checkToolTipDesc = "";
	this.m_cursortype = "pointer";
};

ImageComponent.prototype = new Widget();

ImageComponent.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

ImageComponent.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "NividhImage" || key == "Image") {
			for (var imageKey in jsonObject[key]) {
				switch (imageKey) {
				case "imageSource":
					for (var imageSourceKey in jsonObject[key][imageKey])
						this.setAttributeValueToNode(imageSourceKey, jsonObject[key][imageKey], nodeObject);
					break;
				default:
					this.setAttributeValueToNode(imageKey, jsonObject[key], nodeObject);
				}
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

ImageComponent.prototype.setDataProvider = function (data) {
	this.m_imageSource = this.m_span = this.m_cdata = data;
};

ImageComponent.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

ImageComponent.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
//	this.createImage(this.m_draggableDiv);
	/* This image is removed after successfully drawing of canvas.. */
	this.setCanvasContext();
	//this.initMouseAndTouchEvent("#img" + this.m_objectid);
	this.initMouseAndTouchEventSVC("#img" + this.m_objectid);
};
ImageComponent.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "img" + this.m_objectid;
};

ImageComponent.prototype.createImage = function (container) {
	var temp = this;
	$("#" + temp.m_componentid).remove();
	var img = document.createElement("img");
	img.id = temp.m_componentid;
	$(img).css({
		"width":  this.m_width + "px",
		"height": this.m_height + "px",
		"top": "0px",
		"left": "0px",
		"position": "absolute",
		"opacity": this.m_alpha,
		"filter": "alpha(opacity=" + this.m_alpha + ")",
		"border-radius": this.m_borderradius + "px",
	});
	$("#draggableDiv" + temp.m_objectid).append(img);
};

ImageComponent.prototype.updateWidgetsDataSetValues = function () {
	this.m_imagePath = this.m_span;
	if (this.m_virtualdataid != "" && this.m_virtualdatafield != "" && this.m_datarownumber != "") {
		if (this.m_virtualdatafield != "" && this.m_datarownumber != "")
			if (this.m_fieldSetValue.m_fieldNameValues[this.m_datarownumber] != undefined)
				if (this.m_fieldSetValue.m_fieldNameValues[this.m_datarownumber][this.m_virtualdatafield] != undefined)
					this.m_imagePath = this.m_fieldSetValue.m_fieldNameValues[this.m_datarownumber][this.m_virtualdatafield];
	}
	this.drawObject();
};

ImageComponent.prototype.draw = function () {
	this.drawObject();
};

ImageComponent.prototype.drawObject = function () {
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback!="") {
		onAfterRender(this.m_onafterrendercallback);
	}
};

ImageComponent.prototype.init = function () {
	if (this.m_virtualdataid == "" || this.m_virtualdatafield == "" || this.m_datarownumber == ""){
		this.m_imagePath = this.m_span;
	}else{
		this.m_imagePath = this.m_imageSource;
	}
};

ImageComponent.prototype.drawChart = function () {
	var temp = this;
	var container = $("#draggableDiv" + temp.m_objectid);
	if (IsBoolean(this.m_isActive)) {
		this.createImage(container);
		this.drawImage(container);
	}
};

ImageComponent.prototype.drawImage = function (container) {
	var temp = this;
	var img = $("#" + temp.m_componentid);
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
	    temp.ctx.beginPath();
	    //temp.initMouseAndTouchEvent("#" + temp.m_componentid);
	    temp.initMouseAndTouchEventSVC("#" + temp.m_componentid);
	    img.onload = function() {
	        temp.ctx.clearRect(temp.m_x, temp.m_y, temp.m_width, temp.m_height);
	        temp.ctx.drawImage(img, temp.m_x, temp.m_y, widthHeight[0], widthHeight[1]);
	    };
	    temp.ctx.closePath();
	}, 0);
};

ImageComponent.prototype.initMouseAndTouchEvent = function (comp) {
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
				});
				$(tooltipDiv).css(tooltipObjCss);*/
				
				var wd = temp.m_width*1,
				ht = temp.m_height*1;
				var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
					"top": e.pageY - e.offsetY + ht  - PageTop - offsetTop - 11 + "px",
					"left": e.pageX - e.offsetX - PageLeft - offsetLeft + 10 + "px"
				});
				//"top": temp.m_top + ht  - PageTop - offsetTop - 11 + "px",
				//"left": temp.m_left  - PageLeft - offsetLeft + 10 + "px"
				$(tooltipDiv).css(tooltipObjCss);
				//var lt =  temp.m_left + (wd/2) - (tooltipDiv.offsetWidth/2) - PageLeft - offsetLeft +5+ "px";
				var lt = e.pageX - e.offsetX + (wd/2) - PageLeft - (tooltipDiv.offsetWidth/2) - 16 + "px";
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
			if (!temp.m_designMode && IsBoolean(temp.m_rolloverglowenable)) {
				$(this).css({
					"padding": "0px",
					"-moz-box-shadow": "0px 0px 0px " + hex2rgb(convertColorToHex(temp.m_rolloverglowcolor), 1),
					"-webkit-box-shadow": "0px 0px 0px " + hex2rgb(convertColorToHex(temp.m_rolloverglowcolor), 1),
					"box-shadow": "0px 0px 0px " + hex2rgb(convertColorToHex(temp.m_rolloverglowcolor), 1),
					"left": "0px",
					"top": "0px"
				});
				temp.setWidthHeightWithAspectRatio($("#" + temp.m_componentid), 0);
			}
			temp.removeToolTipDiv();
		};
		var clickFn = function(e){
			OnMouseClick(temp);
		};
		var hoverFn = function(e){
			if (!temp.m_designMode && IsBoolean(temp.m_rolloverglowenable)) {
				$(this).css({
					"padding": "1px",
					"-moz-box-shadow": "1px 1px 6px " + hex2rgb(convertColorToHex(temp.m_rolloverglowcolor), 1),
					"-webkit-box-shadow": "1px 1px 6px " + hex2rgb(convertColorToHex(temp.m_rolloverglowcolor), 1),
					"box-shadow": "1px 1px 6px " + hex2rgb(convertColorToHex(temp.m_rolloverglowcolor), 1),
					"left": "2px",
					"top": "2px"
				});
				temp.setWidthHeightWithAspectRatio($("#" + temp.m_componentid), 8);
			}
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
					mouseoutFn.bind($("#img" + temp.m_objectid))(e);
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
ImageComponent.prototype.hideToolTip = function() {
	this.setCursorStyle("default");
	this.removeToolTipDiv();
};

ImageComponent.prototype.setImageSource = function () {
	this.m_imageSource = this.m_imageSource.split("CDATA[")[1].split("]]")[0];
};
ImageComponent.prototype.getToolTipData = function (mouseX, mouseY) {
	return "";
};

ImageComponent.prototype.setWidthHeightWithAspectRatio = function (imageObj, glowMargin) {
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
	$("#" + temp.m_componentid).css({
		"width": width - glowMargin + "px",
		"height": height - glowMargin + "px"
	});
};
ImageComponent.prototype.setDataPointToUpdate = function (datapointtoupdate) {
	this.m_datapointtoupdate = datapointtoupdate;
};
ImageComponent.prototype.getDataPointToUpdate = function () {
	return this.m_datapointtoupdate;
};
ImageComponent.prototype.getDataPointAndUpdateGlobalVariable = function (mouseX, mouseY) {
	var fieldNameValueMap = {};
	if (this.getDataPointToUpdate() != undefined && this.getDataPointToUpdate() != "") {
		fieldNameValueMap[this.m_valuefield] = this.getDataPointToUpdate();
	}
	var fieldname = (this.m_fieldname == "" || this.m_fieldname == undefined) ? "Value" : this.m_fieldname;
	fieldNameValueMap[fieldname] = this.m_fieldvalue;
	this.updateDataPoints(fieldNameValueMap);
};
//# sourceURL=ImageComponent.js