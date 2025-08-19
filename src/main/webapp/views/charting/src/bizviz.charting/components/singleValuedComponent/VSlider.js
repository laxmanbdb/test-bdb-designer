/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: VSlider.js
 * @description VSlider
 **/
function VSlider(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;

	this.m_showticks = "";
	this.m_minimum = "";
	this.m_snapinterval = "";
	this.m_tickalpha = "";
	this.m_labelfontfamily = "";
	this.m_numberofticks = "";
	this.m_labelcolor = "";
	this.m_maximum = "";
	this.m_globalkey = "";
	this.m_chromecolor = "";
	this.m_tickscolor = "";
	this.m_fieldname = "";
	this.m_labelfontstyle = "";
	this.m_labelfontweight = "";
	this.m_labelfontsize = "";

	this.m_showmarkers = "true";

	this.m_fieldNameValueMap = new Object();
	this.m_value;
	this.m_defaultvalue = "0";
	this.m_objectID = [];
	this.m_componentid = "";
	this.m_sliderId = "";
	this.scaleHeight = "10";
	this.m_scalewidth = "10";
	this.m_handlecolor = "#ff0000";
	this._handleColorOpacity = "1";
	this.handleCenterX = "20";
	this.handleCenterY = "40";
	this.m_handleradius = "10";
	this.scaleTopPadding = "40";
	this._scaleRightPadding = "20";
	this.scaleBottomPadding = "40";
	this.scaleLeftPadding = "20";
	this.containerOffsetTop = 0;
	this.containerOffsetLeft = 0;
	this.onValueChange = function (m_defaultvalue) {};
	this.unitFactor = 0;
	this.m_cursortype = "pointer";
	this.m_backgroundcolor = "#FFFFFF";
	this.m_backgroundalpha = 0;
	this.m_freezehandle = false;
	this.m_handlecursor = "move";
	this.m_unit = "auto";
	/** Added the following variables for BDD-920_Update_UI_of_Sliders **/
	this.m_enhancedVSlider = "";
	this.m_circleshadowopacity = 0.5;
	this.m_dx = 0;
	this.m_dy = 3.5;
	this.stdDeviation = 2.5;
	this.m_floodColor = "#a3a3a3";
	this.m_scaleborder= 5;
	this.m_scalebgcolor = "#eff0f0";
};

/** @description Using prototype inheriting the variable and method of Widget into VSlider. **/
VSlider.prototype = new Widget();

/** @description Starting of VSlider Drawing. **/
VSlider.prototype.draw = function () {
	this.drawObject();
};

/** @description Calling init function. **/
VSlider.prototype.drawObject = function () {
	this.init();
	if(this.m_onafterrendercallback!="")
		onAfterRender(this.m_onafterrendercallback);
};

/** @description Setter Method for DataProvider and default value. **/
VSlider.prototype.setDataProvider = function (data) {
	this.m_defaultvalue = data;
};

/** @description Creating Draggable Div and Canvas **/
VSlider.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
};

/** @description Getter Method for updated value according to the min and max limit. **/
VSlider.prototype.getValue = function () {
	var temp = this;
	if (isIE = /*@cc_on!@*/
			false || !!document.documentMode) // If Internet Explorer
	{
		var splitValue = $("#sliderHandle" + temp.m_objectid).attr("transform").split("");
		var str = "";
		for (var i = 0; i < splitValue.length; i++) {
			if (!isNaN(splitValue[i] * 1) || splitValue[i] === ".") {
				if (splitValue[i] === " ")
					str = "";
				else
					str = str + splitValue[i];
			}
		}
		var yCo = str * 1;
	} else {
		var yCo = $("#sliderHandle" + temp.m_objectid).attr("transform").split(" ")[2] * 1;
	}

	var value = (yCo * temp.unitFactor + temp.m_minimum * 1);

	if (this.m_snapinterval % 1 != 0) {
		var mod = value % this.m_snapinterval;
		if (mod != 0)
			value = this.roundNumber(value, 1);
		value = this.checkNumberMuliplierOrNot(value);
	} else {
		value = Math.round(value);
	}

	if (value * 1 > temp.m_maximum)
		return temp.m_maximum;
	else
		return value;
};

/** @description Will check the value or next number is multiplier or not according too the interval. **/
VSlider.prototype.checkNumberMuliplierOrNot = function (number) {
	var num = number;
	var seriesNumber = [];
	var sum = this.m_minimum * 1;
	var position;
	if (num % this.m_snapinterval != 0) {
		seriesNumber.push(sum);
		while (sum < this.m_maximum) {
			sum = sum + this.m_snapinterval;
			seriesNumber.push(this.roundNumber(sum, 1));
		};
		for (var i = 0; i < seriesNumber.length; i++) {
			if (seriesNumber[i] > num) {
				position = i;
				break;
			}
		}
		var prvValue = seriesNumber[position - 1];
		var nextValue = seriesNumber[position];
		var midValue = (prvValue + nextValue) / 2;
		if (midValue < num)
			num = nextValue;
		else
			num = prvValue;

		if (number > this.m_maximum)
			num = this.m_maximum;
	}
	return num;
};

/** @description Method Will return the round number according to the coming value. **/
VSlider.prototype.roundNumber = function (number, precision) {
	precision = Math.abs(parseInt(precision)) || 0;
	var multiplier = Math.pow(10, precision);
	return (Math.round(number * multiplier) / multiplier);
};

/** @description Setter Method for position of slider like x and update value. **/
VSlider.prototype.setValue = function (value) {
	var temp = this;
	var yCo = null;
	try {
		yCo = temp.getYCo(value);
		temp.moveHandleTo(yCo);
		temp.updateValue(yCo);
		return true;
	} catch (error) {
		console.error(error.message);
		return false;
	}
};

/** @description This Method will set the x,y position and Slider new value. **/
VSlider.prototype.updateValue = function (yCo) {
	var temp = this;
	var newSliderValueX = temp.m_width / 2 + temp.fontScaling(temp.m_handleradius * 1) * 1.1;
	if (temp.fontScaling(temp.m_handleradius * 1) * 2 < temp.m_scalewidth) {
		newSliderValueX = newSliderValueX + (temp.m_scalewidth * 1 - temp.fontScaling(temp.m_handleradius * 1) * 2) / 2;
	}
	$("#sliderValue" + temp.m_objectid).text(temp.getValue());
	$("#sliderValue" + temp.m_objectid).attr({
		y : yCo + temp.scaleTopPadding * 1,
		x : newSliderValueX,
		"visibility" : "visible"
	});
};

/** @description This method will update the slider point. **/
VSlider.prototype.moveHandleTo = function (yCo) {
	var temp = this;
	$("#sliderHandle" + temp.m_objectid).attr({"transform": "translate( 0, " + yCo + " )", "visibility" : "visible"});
};

/** @description This Method calculate the value and update according to the its position. **/
VSlider.prototype.doStepFilter = function (yCo) {
	var temp = this;
	var lastValue = temp.getValue();
	var newValue = temp.getValueOf(yCo);
	var valueDiff = Math.abs(lastValue - newValue);
	var stepDiff = newValue % (temp.m_snapinterval * 1);
	if (valueDiff >= temp.m_snapinterval * 1) {
		newValue -= stepDiff;
		yCo = temp.getYCo(newValue);
		temp.moveHandleTo(yCo);
		/** Added the following code for BDD-928-Enhanced sliders are not working correctly if dashboard have multiple sliders **/
		/**updated sliderPosition value from temp.getValue() & commented below conditions for BDD-928**/
		var sliderPosition = ((newValue*1)/(temp.m_maximum*1 - temp.m_minimum*1))*100;//temp.getValue();
		var newMaximum, diffPosition, cutOffVal, minRangeVal;
		/*if(sliderPosition == temp.m_minimum){
			sliderPosition = 0;
		}
		else if(temp.m_minimum > 0 && temp.m_maximum == 100){
			newMaximum = temp.m_maximum - temp.m_minimum;
			diffPosition = (sliderPosition * temp.m_maximum)/newMaximum;
			minRangeVal = (temp.m_minimum * temp.m_maximum)/newMaximum;
			cutOffVal = minRangeVal - temp.m_minimum;
			sliderPosition = (diffPosition - temp.m_minimum) - cutOffVal;	
		}
		else if(temp.m_maximum < 100){
			diffPosition = 100 / temp.m_maximum;
			sliderPosition = sliderPosition * diffPosition;	
		}*/
		/** Added the following code for BDD-920_Update_UI_of_Sliders **/
		if(IsBoolean(this.m_enhancedVSlider)){
			$("#initialVerticalValue" + temp.m_objectid).attr({offset : sliderPosition + "%"});
			$("#handleVerticalPosValue" + temp.m_objectid).attr({offset : sliderPosition + "%"});
			$("#differenceVerticalValue" + temp.m_objectid).attr({offset : "100%"});//attr({offset : temp.m_maximum + "%"})
			//$("#sliderScale" + temp.m_objectid).attr({stroke: "url(#verticalScaleHighlight"+temp.m_objectid+")", style : "fill : url(#verticalScaleHighlight"+temp.m_objectid+")"});
			$("#sliderScale" + temp.m_objectid).attr({stroke: "", style : "fill : url(#verticalScaleHighlight"+temp.m_objectid+")"});
		}
		temp.updateValue(yCo);
		temp.m_defaultvalue = temp.getValue();
		temp.m_value = temp.getValue();
		temp.onValueChange(temp.m_defaultvalue);
	}
};

/** @description calling the setter method for dashboard name and object Id. **/
VSlider.prototype.calculateFromJson = function () {
	var temp = this;
	temp.setDashboardNameAndObjectId();
	if (temp.m_width * 1 < 50)
		temp.m_width = 50;
};

/** @description Method will initialize the calculation of VSlider. **/
VSlider.prototype.initCalculation = function () {
	var temp = this;
	temp.initContainerOffset();
	temp.scaleLeftPadding = temp.calculateAndGetScaleLeftPadding();
	temp.scaleHeight = temp.m_height - (temp.scaleTopPadding * 1 + temp.scaleBottomPadding * 1);
	temp.unitFactor = Math.abs(temp.m_maximum - temp.m_minimum) / temp.scaleHeight;
	temp.handleCenterX = temp.m_width / 2;
};

/** @description Drawing of VSlider according to the min and max value. **/
VSlider.prototype.createComponent = function (minValue, maxValue) {
	this.m_handlecursor = (IsBoolean(this.m_freezehandle)) ? "not-allowed" : "move";
	this.m_cursortype = (IsBoolean(this.m_freezehandle)) ? "default" : this.m_cursortype;
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).append( "<svg id=\"slider" + temp.m_objectid + "\">" +
		"<defs>"+
		"<filter id=\"verticalHandleShadow" + temp.m_objectid + "\" x=\"-0.07"+"\" y=\"-0.03"+"\">"+
		"<feDropShadow id=\"dVerticalShadow" + temp.m_objectid + "\"/>"+//flood-opacity=\"0.5"+"\"
		"</filter>"+
		"<linearGradient id=\"verticalScaleHighlight" + temp.m_objectid + "\" x1=\"0"+"\" x2=\"0"+"\" y1=\"0"+"\" y2=\"1"+"\">"+
		"<stop id=\"initialVerticalValue" + temp.m_objectid + "\"/>"+
		"<stop id=\"handleVerticalPosValue" + temp.m_objectid + "\"/>"+
		"<stop id=\"differenceVerticalValue" + temp.m_objectid + "\"/>"+
		"</linearGradient>"+
		"</defs>"+
		"<rect id=\"sliderBG" + temp.m_objectid + "\"></rect>" +
		"<rect id=\"sliderScale" + temp.m_objectid + "\" style=\"cursor:"+temp.m_cursortype+"\"></rect>" +
		"<circle id=\"sliderHandle" + temp.m_objectid + "\" style=\"cursor:"+temp.m_handlecursor+"\"></circle>" +
		"<text id=\"sliderValue" + temp.m_objectid + "\">" +
			(temp.m_defaultvalue * 1 + temp.m_minimum * 1) +
		"</text>" +

		"<text id=\"sliderMinValue" + temp.m_objectid + "\">" +
			(minValue) +
		"</text>" +

		"<text id=\"sliderMaxValue" + temp.m_objectid + "\">" +
			(maxValue) +
		"</text>" +

		"</svg>");
	this.setCSS();
};

/** @description Method will handle the event for slider and make slider smooth. **/
VSlider.prototype.makeSlidable = function () {
	var temp = this;
	temp.m_updateflag = true;
	if (!temp.m_designMode) {
		if ("ontouchstart" in document.documentElement) {
			$("#draggableDiv" + temp.m_objectid).bind("touchstart", function(e) {
			    $("body").css("cursor", temp.m_cursortype);
			    var touches = e.originalEvent.touches[0];
			    var offset;
			    var parentOffsetTop = $(this).offset().top - $(this)[0].scrollTop;
			    var yCo = touches.pageY - parentOffsetTop;
			    var topBoundary = temp.containerOffsetTop*1;
			    var bottomBoundary = temp.scaleHeight*1 + topBoundary;
			    if (yCo >= topBoundary && yCo <= bottomBoundary) {
			        temp.doStepFilter(yCo);
			        if (!IsBoolean(temp.m_designMode)) {
			            temp.getDataPointAndUpdateGlobalVariable();
			        }
			    }
			}).bind("touchend", function() {});
		} else {
			$("#sliderHandle" + temp.m_objectid).on("mousedown", function () {
				$(document).on("mousemove", function (event) {
					$("body").css("cursor", temp.m_cursortype);
					var scrollTop = $("#WatermarkDiv").scrollTop();
					temp.m_updateflag = true;
					var Top = ((event.pageY * 1 + scrollTop * 1) >= temp.m_y * 1) ? event.pageY * 1 : (temp.m_y * 1 + event.offsetY);
					var yCo = Top * 1 - (temp.m_y * 1 + temp.scaleTopPadding * 1) - temp.containerOffsetTop + scrollTop * 1,
					topBoundary = temp.containerOffsetTop*1,
					bottomBoundary = topBoundary + temp.scaleHeight*1;
					if (yCo >= topBoundary && yCo <= bottomBoundary) {
						temp.doStepFilter(yCo);
					}
				});
				$(document).on("mouseup", function (event) {
					console.log("mouseup VSlider");
					$(document).off("mousemove");
					$("body").css("cursor", "auto");
					if (!IsBoolean(temp.m_designMode) && IsBoolean(temp.m_updateflag)) {
						temp.getDataPointAndUpdateGlobalVariable();
						temp.m_updateflag = false;
					}
					$(document).off("mouseup");
					$(document).off("mousemove");
				});
			});

			$("#sliderHandle" + temp.m_objectid).on("mouseup", function (event) {
				$(document).off("mousemove");
				$("body").css("cursor", "auto");
				var scrollTop = $("#WatermarkDiv").scrollTop();
				var Top = ((event.pageY * 1 + scrollTop * 1) >= temp.m_y * 1) ? event.pageY * 1 : (temp.m_y * 1 + event.offsetY);
				var yCo = Top * 1 - (temp.m_y * 1 + temp.scaleTopPadding * 1) - temp.containerOffsetTop + scrollTop * 1,
				topBoundary = temp.containerOffsetTop*1,
				bottomBoundary = topBoundary + temp.scaleHeight*1;
				if (yCo >= topBoundary && yCo <= bottomBoundary) {
					temp.doStepFilter(yCo);
					if (!IsBoolean(temp.m_designMode) && IsBoolean(temp.m_updateflag)) {
						temp.getDataPointAndUpdateGlobalVariable();
						temp.m_updateflag = false;
					}
				}
				$(document).off("mouseup");
				$(document).off("mousemove");
			});
			$("#sliderScale" + temp.m_objectid).on("click", function (event) {
				var scrollTop = $("#WatermarkDiv").scrollTop();
				var Top = ((event.pageY * 1 + scrollTop * 1) >= temp.m_y * 1) ? event.pageY * 1 : (temp.m_y * 1 + event.offsetY);
				var yCo = Top * 1 - (temp.m_y * 1 + temp.scaleTopPadding * 1) - temp.containerOffsetTop + scrollTop * 1;
				temp.doStepFilter(yCo);
				if (!IsBoolean(temp.m_designMode)) {
					temp.getDataPointAndUpdateGlobalVariable();
				}
			});
		}
	}
};

/** @description Creating Map and setting field name,required Data in Map **/
VSlider.prototype.getDataPointAndUpdateGlobalVariable = function () {
	if (this.m_value !== "") {
		var fieldNameValueMap = {};
		var fieldname = (this.m_fieldname == "" || this.m_fieldname == undefined) ? "Value" : this.m_fieldname;
		fieldNameValueMap[fieldname] = (this.m_value === undefined)?this.m_minimum:this.m_value;
		this.updateDataPoints(fieldNameValueMap);
	}
};

/** @description VSlider initialization **/
VSlider.prototype.init = function () {
	var temp = this;
	var valueUnit = this.m_util.getNumberSymbol("percent")
	var minValue = (this.m_unit == "auto") ? this.textformatter(this.m_minimum) : this.m_util.addUnitAssuffix(this.m_minimum, valueUnit);
	var maxValue = (this.m_unit == "auto") ? this.textformatter(this.m_maximum) : this.m_util.addUnitAssuffix(this.m_maximum, valueUnit);
	this.m_enhancedVSlider = this.chartJson.VSlider.enhancedVSlider;
	this.initcolors();
	this.calculateFromJson();
	this.initCalculation();
	$("#slider" + temp.m_objectid).remove();
	this.createComponent(minValue, maxValue);
	if (!IsBoolean(this.m_freezehandle)){
		this.makeSlidable();
	} else {
		//nothing
	}
	/** Added the following code for BDD-920_Update_UI_of_Sliders **/
	/**commented below methods and added that as a condition in setCSS method for DK_BDD-928**/
	/*if(IsBoolean(this.m_enhancedVSlider)){
		this.enhanceVerticalSlider();
	}else if(!IsBoolean(this.m_enhancedVSlider)){
		this.removeEnhancedVerticalSlider();
	}*/
};

/** @description Will initialization of colors properties **/
VSlider.prototype.initcolors = function () {
	this.m_labelcolor = convertColorToHex(this.m_labelcolor);
	this.m_chromecolor = convertColorToHex(this.m_chromecolor);
	this.m_handlecolor = convertColorToHex(this.m_handlecolor);
	this.m_alphaChromecolor = hex2rgb(this.m_chromecolor, 0.5);
	var hexTickscolor = convertColorToHex(this.m_tickscolor);
	this.m_tickscolor = hex2rgb(hexTickscolor, this.m_tickalpha);
};

/** @description Iterate through jsonObject and set class variable values with JSON values **/
VSlider.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "VSlider") {
			for (var HSliderKey in jsonObject[key]) {
				this.setAttributeValueToNode(HSliderKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

/** @description This method will parse the chart JSON and create a container **/
VSlider.prototype.setProperty = function (json) {
	this.ParseJsonAttributes(json.Object, this);
	this.initCanvas();
};

/** @description Draggable div Initialization **/
VSlider.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description Getter Method for Slider type. **/
VSlider.prototype.getSliderType = function (jsonObject) {
	var
	sliderType = null;
	Boolean(jsonObject["Object"]["HSlider"]) ? sliderType = "HSlider" : sliderType = "VSlider";
	return sliderType;
};

/** @description Initialization of container for VSlider. **/
VSlider.prototype.initContainerOffset = function () {
	var temp = this;
	temp.containerOffsetLeft = $(temp.m_chartContainer)[0].offsetLeft;
	temp.containerOffsetTop = $(temp.m_chartContainer)[0].offsetTop;
};

/** @description Method will calculate and getting the top padding. **/
VSlider.prototype.calculateAndGetScaleTopPadding = function () {
	var temp = this;
	var totalHeight = temp.m_height;
	var scaleHeight = temp.scaleHeight;
	var scaleTopPadding = (totalHeight / 2) - (scaleHeight / 2);
	return scaleTopPadding;
};

/** @description Method will calculate and getting the left padding. **/
VSlider.prototype.calculateAndGetScaleLeftPadding = function () {
	var temp = this;
	var totalWidth = temp.m_width;
	var scaleWidth = temp.m_scalewidth;
	var scaleLeftPadding = (totalWidth / 2) - (scaleWidth / 2);
	return scaleLeftPadding;
};

/** @description Getter Method for X position. **/
VSlider.prototype.getXCo = function (value) {
	var temp = this;
	return value / temp.unitFactor;
};

/** @description Getter Method for Y position. **/
VSlider.prototype.getYCo = function (value) {
	var temp = this;
	return value / temp.unitFactor;
};

/** @description Creating component ID **/
VSlider.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "Parent" + this.m_objectid;
	this.m_sliderId = this.m_objectid;
};

/** @description Getter Method for updated value according to the position and unitFactor. **/
VSlider.prototype.getValueOf = function (position) {
	var temp = this;
	return (position * temp.unitFactor);
};

/** @description Setter Method for CSS. **/
VSlider.prototype.setCSS = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).css({"background-color": hex2rgb(convertColorToHex(this.m_backgroundcolor), this.m_backgroundalpha)});
	$("#slider" + temp.m_objectid).attr({
		width : temp.m_width,
		height : temp.m_height
	});
	$("#sliderBG" + temp.m_objectid).attr({
		width : temp.m_width,
		height : temp.m_height,
		x : "0",
		y : "0",
		fill : hex2rgb(convertColorToHex(temp.m_backgroundcolor), temp.m_backgroundalpha)
	});
	$("#sliderScale" + temp.m_objectid).attr({
		width : temp.m_scalewidth,
		height : temp.scaleHeight,
		rx : temp.m_scaleborder,
		ry : temp.m_scaleborder,
		x : temp.scaleLeftPadding,
		y : temp.scaleTopPadding,
		stroke : temp.m_chromecolor,
		fill : temp.m_chromecolor
	});
	/**Added to hide circle when setvalue is out of the range*/
	var displayVal = temp.m_defaultvalue * 1 + temp.m_minimum * 1;
	$("#sliderHandle" + temp.m_objectid).attr({
	    cx: temp.handleCenterX,
	    cy: temp.handleCenterY,
	    r: temp.fontScaling(temp.m_handleradius * 1),
	    stroke: "gray",
	    "stroke-width": "1",
	    fill: temp.m_handlecolor,
	    transform: "translate( 0, " + temp.getYCo(temp.m_defaultvalue) + " )",
	    opacity: temp._handleColorOpacity
	});
	/**Added below condition by commenting methods in createcomponent() for DK_BDD-928**/
	if (IsBoolean(this.m_enhancedVSlider)) {
	    $("#sliderHandle" + temp.m_objectid).attr({
	        stroke: "#e3e3e3",
	        style: "filter: url(#verticalHandleShadow" + temp.m_objectid + ")"
	    });
	    $("#sliderScale" + temp.m_objectid).attr({
	        stroke: temp.m_scalebgcolor,
	        fill: temp.m_scalebgcolor
	    });
	}

	var sliderValueX = temp.m_width / 2 + temp.fontScaling(temp.m_handleradius * 1) * 1.1;
	if (temp.fontScaling(temp.m_handleradius * 1) * 2 < temp.m_scalewidth) {
	    sliderValueX = sliderValueX + (temp.m_scalewidth * 1 - temp.fontScaling(temp.m_handleradius * 1) * 2) / 2;
	}

	$("#sliderValue" + temp.m_objectid).attr({
	    y: temp.getYCo(temp.m_defaultvalue) + temp.scaleTopPadding * 1,
	    x: sliderValueX,
	    "font-size": temp.fontScaling(temp.m_labelfontsize * 1) + "px",
	    "font-family": selectGlobalFont(temp.m_labelfontfamily),
	    "font-weight": temp.m_labelfontweight,
	    "font-style": temp.m_labelfontstyle,
	    "fill": temp.m_labelcolor,
	    "display": "intial"
	});
	if ((displayVal < temp.m_minimum * 1) || (displayVal > temp.m_maximum * 1)) {
	    $("#sliderHandle" + temp.m_objectid).attr({
	        "visibility": "hidden"
	    });
	    $("#sliderValue" + temp.m_objectid).attr({
	        "visibility": "hidden"
	    });
	}
	if (!IsBoolean(temp.m_showticks)) {
		$("#sliderValue" + temp.m_objectid).attr({
			"display" : "none"
		});
	}

	$("#sliderMinValue" + temp.m_objectid).attr({
		y : temp.fontScaling(temp.scaleTopPadding * 1 - temp.m_handleradius * 1 - 3),
		x : temp.m_width / 2,
		"font-size" : temp.fontScaling(temp.m_labelfontsize * 1) + "px",
		"font-family" : selectGlobalFont(temp.m_labelfontfamily),
		"font-weight" : temp.m_labelfontweight,
		"font-style" : temp.m_labelfontstyle,
		"text-anchor" : "middle",
		"alignment-baseline" : "baseline",
		"fill" : temp.m_labelcolor,
		"display":((IsBoolean(temp.m_showmarkers))?"block":"none")

	});

	$("#sliderMaxValue" + temp.m_objectid).attr({
		y : temp.scaleTopPadding * 1 + temp.scaleHeight * 1 + temp.fontScaling(temp.m_handleradius * 1) +3,
		x : temp.m_width / 2,
		"font-size" : temp.fontScaling(temp.m_labelfontsize * 1) + "px",
		"font-family" : selectGlobalFont(temp.m_labelfontfamily),
		"font-weight" : temp.m_labelfontweight,
		"font-style" : temp.m_labelfontstyle,
		"text-anchor" : "middle",
		"alignment-baseline" : "hanging",
		"fill" : temp.m_labelcolor,
		"display":((IsBoolean(temp.m_showmarkers))?"block":"none")
	});
	/** Added the following code for BDD-920_Update_UI_of_Sliders **/
	$("#dVerticalShadow" + temp.m_objectid).attr({
		dx : temp.m_dx,
		dy : temp.m_dy,
		stdDeviation : temp.m_stdDeviation,
		"flood-color" : temp.m_floodColor,
		"flood-opacity" : temp.m_circleshadowopacity
	});
	/*$("#initialVerticalValue" + temp.m_objectid).attr({style : "stop-opacity: 1; stop-color:" + temp.m_chromecolor + ";"});
	$("#handleVerticalPosValue" + temp.m_objectid).attr({style : "stop-opacity: 1; stop-color: #eff0f0;"});
	$("#differenceVerticalValue" + temp.m_objectid).attr({style : "stop-opacity: 1; stop-color: #eff0f0"});
	*/
	$("#initialVerticalValue" + temp.m_objectid).attr({style : "stop-opacity: 1; stop-color:" + temp.m_chromecolor + ";"});
	$("#handleVerticalPosValue" + temp.m_objectid).attr({style : "stop-opacity: 1; stop-color:" + temp.m_scalebgcolor + ";"});
	$("#differenceVerticalValue" + temp.m_objectid).attr({style : "stop-opacity: 1; stop-color:" + temp.m_scalebgcolor + ";"});
	
	if (temp.m_defaultvalue > temp.m_minimum  && temp.m_defaultvalue <= temp.m_maximum && IsBoolean(this.m_enhancedVSlider)){
		var defaultVsliderPosition = ((temp.m_defaultvalue*1)/(temp.m_maximum*1 - temp.m_minimum*1))*100;
		$("#initialVerticalValue" + temp.m_objectid).attr({offset : defaultVsliderPosition + "%"});
		$("#handleVerticalPosValue" + temp.m_objectid).attr({offset : defaultVsliderPosition + "%"});
		$("#differenceVerticalValue" + temp.m_objectid).attr({offset : "100%"});//attr({offset : temp.m_maximum + "%"})
		//$("#sliderScale" + temp.m_objectid).attr({stroke: "url(#verticalScaleHighlight"+temp.m_objectid+")", style : "fill : url(#verticalScaleHighlight"+temp.m_objectid+")"});
		$("#sliderScale" + temp.m_objectid).attr({stroke: "", style : "fill : url(#verticalScaleHighlight"+temp.m_objectid+")"});
	}
};

/** @description Will calling the getNumberFormattedValue method for formatting the text value. **/
VSlider.prototype.textformatter = function (text) {
	return getNumberFormattedValue(text);
};

/** @description Add enhancement to slider **/
VSlider.prototype.enhanceVerticalSlider = function(){
	var temp = this;
	$("#sliderHandle" + temp.m_objectid).attr({
		stroke : "#e3e3e3",
		style: "filter: url(#verticalHandleShadow"+temp.m_objectid+")"
	});
	$("#sliderScale" + temp.m_objectid).attr({
		stroke : "#eff0f0",
		fill : "#eff0f0"
	});
}

/** @description Remove slider enhancement**/
VSlider.prototype.removeEnhancedVerticalSlider = function(){
	var temp = this;
	$("#sliderHandle" + temp.m_objectid).attr({
		stroke : "gray",
		style: "none"
	});
	$("#sliderScale" + temp.m_objectid).attr({
		stroke : temp.m_chromecolor,
		fill : temp.m_chromecolor
	});
}
//# sourceURL=VSlider.js