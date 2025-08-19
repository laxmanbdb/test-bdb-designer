/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: Bullet.js
 * @description Bullet
 **/
function Bullet(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();

	this.m_actualvalue = "";
	this.m_targetvalue = "";
	this.m_tickscolor = "";
	this.m_markertextcolor = "";
	this.m_showtext = "";
	this.m_showvalue = "";
	this.m_showtargetvalue = "";
	this.m_labeltext = "";
	this.m_facecolor = "";
	this.m_width = "";
	this.m_height = "";
	this.m_bullettype = "";
	this.m_fontsize = "";
	this.m_labelfontfamily = "";

	this.m_id = "";
	this.bracesRemovedStr = "";
	this.m_fontcolor = "";
	this.m_targetcolor = "";
	this.m_bordercolor = "";
	this.m_minValue = "";
	this.m_maxValue = "";
	this.m_globalValueOperation = "";
	this.m_globalValueStr = "";

	this.m_actualmetersize = "";
	this.m_targetmetersize = "";

	this.m_rangesofseries = "";
	this.m_rangedcolors = "";
	this.m_rangedseriesdisplaynames = "";
	this.m_alphas = "";
	this.m_orientation = "normal";

	this.m_xpositionArray = [];
	this.m_ypositionArray = [];
	this.m_widthArray = [];
	this.m_heightArray = [];
	this.m_bulletCalculation = new BulletCalculation();

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_showticks = true;
};

/** @description Using prototype inheriting the variable and method of Widget into Bullet. **/
Bullet.prototype = new Widget();

/** @description This method will parse the chart JSON and create a container. **/
Bullet.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Getter for Object Type. **/
Bullet.prototype.getObjectName = function () {
	return this.getObjectType();
};

/** @description Iterate through chart JSON and set class variable values with JSON values. **/
Bullet.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "Bullet") {
			for (var bulletKey in jsonObject[key]) {
				this.setAttributeValueToNode(bulletKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

/** @description Setting DataProvider and actualvalue. **/
Bullet.prototype.setDataProvider = function (data) {
	this.m_actualvalue = data;
};

/** @description Getter Method for DataProvider. **/
Bullet.prototype.getDataProvider = function () {
	return this.m_actualvalue;
};

/** @description Setter Method for TargetValue. **/
Bullet.prototype.setTargetValue = function (data) {
	this.m_targetvalue = data;
};

/** @description Getter Method for TargetValue. **/
Bullet.prototype.getTargetValue = function () {
	return this.m_targetvalue;
};

/** @description Canvas Initialization **/
Bullet.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description Creating Draggable Div and Canvas **/
Bullet.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseClickEvent();
};

/** @description Creating component ID **/
Bullet.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "BulletDiv" + this.m_objectid;
};

/** @description Starting of Bullet Drawing **/
Bullet.prototype.draw = function () {
	this.drawObject();
};

/** @description Starting of Bullet Drawing **/
Bullet.prototype.drawObject = function () {
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback!="")
		onAfterRender(this.m_onafterrendercallback);
};

/** @description Calling bullet Calculation init and set actual value. **/
Bullet.prototype.init = function () {
	if (IsBoolean(this.m_isVirtualDataSetavailable)) {
		if (this.m_actualvalue == "" || isNaN(this.m_actualvalue))
			this.m_actualvalue = 0;
	} else if (this.m_actualvalue == "" || isNaN(this.m_actualvalue)) {
		this.m_actualvalue = 0;
	}else{
		// do nothing
	}
	this.m_formattedDisplayName = this.formattedDescription(this, this.m_labeltext);
	this.m_bulletCalculation.init(this);
};

/** @description Drawing of Bullet, Target, Marking and Title. **/
Bullet.prototype.drawChart = function () {
	this.ctx.clearRect(this.m_x, this.m_y, this.m_width, this.m_height);
	this.m_minValue = this.m_bulletCalculation.getMin();
	this.m_maxValue = this.m_bulletCalculation.getMax();
	this.m_xpositionArray = this.m_bulletCalculation.getXpositionArray();
	this.m_ypositionArray = this.m_bulletCalculation.getYpositionArray();
	this.m_widthArray = this.m_bulletCalculation.getWidthArray();
	this.m_heightArray = this.m_bulletCalculation.getHeightArray();
	this.m_range = this.m_bulletCalculation.getRange();
	this.m_colorRange = this.m_bulletCalculation.getcolors();
	this.m_ratio = this.m_bulletCalculation.getRatio();
	for (var i = 0; i < this.m_range.length; i++) {
		if (this.m_bullettype == "horizontal")
			this.drawBulletRange(this.m_xpositionArray[i], this.m_ypositionArray[i], this.m_widthArray[i], this.m_heightArray[i], this.m_colorRange[i]);
		else
			this.drawBulletRange(this.m_xpositionArray[i], this.m_ypositionArray[i] - this.m_heightArray[i], this.m_widthArray[i], this.m_heightArray[i], this.m_colorRange[i]);

	}
	this.drawActual_TargetValue();
	this.drawTitle_Value();
	if (IsBoolean(this.m_showticks))
		this.drawMarking();

	this.drawBorderBullet();
};

/** @description Drawing TargetValue according to the bullet type. **/
Bullet.prototype.drawActual_TargetValue = function () {
	if (this.m_bullettype == "horizontal")
		this.drawHorizontalBullet();
	else
		this.drawVerticalBullet();
};

/** @description Will Drawing Horizontal Bullet. **/
Bullet.prototype.drawHorizontalBullet = function () {
	var newActualValue = this.getActualValue();
	var actualMeterheight = this.m_bulletCalculation.getAvailableHeight() * this.m_actualmetersize * 1;
	var startAndWidth = this.getActualStartX(this.m_bulletCalculation.startX, newActualValue);
	var actualYPosition = this.m_ypositionArray[0] + this.m_heightArray[0] / 2 - actualMeterheight / 2;
	this.drawBulletRange(startAndWidth.start, actualYPosition, startAndWidth.width, actualMeterheight, convertColorToHex(this.m_facecolor));

	var targetValueWidth = 20 * this.m_targetmetersize * 1;
	var targetValue = this.getTargetValue() * 1;
	var targetValueheight = this.m_bulletCalculation.getAvailableHeight() * 3 / 5;
	var startValue = this.getTargetStartX(this.m_bulletCalculation.startX, targetValue);
	var targetYPosition = this.m_ypositionArray[0] * 1 + this.m_heightArray[0] * 1 / 5;

	this.drawBulletRange(startValue.x - targetValueWidth / 2, targetYPosition, targetValueWidth, targetValueheight, convertColorToHex(this.m_targetcolor));
	if (IsBoolean(this.m_showtargetvalue))
		this.drawText(this.m_targetvalue, startValue.x - targetValueWidth / 2, this.m_bulletCalculation.topmargin - 4, this.m_fontcolor, "false");
};

/** @description Getter Method for actual startX position and width of Bullet. **/
Bullet.prototype.getActualStartX = function (startPosition, value) {
	var start, diff, width;
	if (this.m_minValue > 0 && this.m_maxValue > 0) {
		start = startPosition;
		diff = Math.abs(Math.abs(value) - (Math.abs(this.m_minValue)));
		width = diff * this.m_ratio;
	} else if (this.m_minValue < 0 && this.m_maxValue <= 0) {
		if (this.m_orientation == "normal") {
			diff = Math.abs(Math.abs(this.m_maxValue) - Math.abs(value));
			width = diff * this.m_ratio;
			start = this.m_bulletCalculation.endX - width;
		} else {
			start = this.m_bulletCalculation.endX;
			diff = Math.abs(Math.abs(this.m_maxValue) - Math.abs(value));
			width = diff * this.m_ratio;
		}

	} else if (this.m_minValue < 0 && this.m_maxValue > 0) {
		if (this.m_orientation == "normal") {
			start = startPosition + Math.abs(this.m_minValue) * this.m_ratio * 1;
			width = value * this.m_ratio;
		} else {
			start = startPosition - Math.abs(this.m_minValue) * this.m_ratio * 1;
			if (value >= 0){
				width =  - (value) * this.m_ratio;
			}else{
				width = Math.abs(value) * this.m_ratio;
			}
		}
	} else {
		width = value * this.m_ratio;
		if (this.m_orientation == "normal"){
			start = startPosition;
		}else{
			start = startPosition - width;
		}
	}
	return {
		"width" : width,
		"start" : start
	};
};

/** @description Getter Method for target startX position. **/
Bullet.prototype.getTargetStartX = function (startPosition, value) {
	var start, x, diff;
	if (this.m_minValue > 0 && this.m_maxValue > 0) {
		start = startPosition;
		x = startPosition - (Math.abs(this.m_minValue) * this.m_ratio) + (value * 1 * this.m_ratio);
	} else if (this.m_minValue < 0 && this.m_maxValue > 0) {
		if (this.m_orientation == "normal") {
			start = startPosition;
			x = startPosition + (Math.abs(this.m_minValue) * this.m_ratio) + (value * 1 * this.m_ratio);
		} else {
			start = startPosition;
			if (value * 1 >= 0){
				value = -value * 1;
			}else{
				value = Math.abs(value);
			}
			x = startPosition - (Math.abs(this.m_minValue) * this.m_ratio) + (value * 1 * this.m_ratio);
		}
	} else if (this.m_minValue < 0 && this.m_maxValue <= 0) {
		start = startPosition * 1;
		diff = Math.abs(Math.abs(this.m_minValue) - Math.abs(value))
			if (this.m_orientation == "normal"){
				x = startPosition + diff * this.m_ratio;
			}else{
				x = startPosition - diff * this.m_ratio;
			}
	} else {
		start = startPosition - (Math.abs(this.m_minValue));
		if (this.m_orientation == "normal"){
			x = start + (value * 1 * this.m_ratio);
		}else{
			x = start - (value * 1 * this.m_ratio);
		}
	}
	return {
		"x" : x,
		"start" : start
	};
};

/** @description Getter Method for target startY position. **/
Bullet.prototype.getTargetStartY = function (startPosition, value) {
	var diff, start, y, height;
	if (this.m_minValue > 0 && this.m_maxValue > 0) {
		start = startPosition;
		y = (start - (value * 1 * this.m_ratio)) + (Math.abs(this.m_minValue) * this.m_ratio);
	} else if (this.m_minValue < 0 && this.m_maxValue > 0) {
		if (this.m_orientation == "normal") {
			start = startPosition;
			y = start - (Math.abs(this.m_minValue) * this.m_ratio) - (value * 1 * this.m_ratio);
		} else {
			start = startPosition;
			y = start + (Math.abs(this.m_minValue) * this.m_ratio) + (value * 1 * this.m_ratio);
		}
	} else if (this.m_minValue < 0 && this.m_maxValue < 0) {
		if (this.m_orientation == "normal") {
			diff = Math.abs(Math.abs(this.m_maxValue) - Math.abs(value));
			height = diff * this.m_ratio;
			y = this.m_bulletCalculation.endY + height;
		} else {
			diff = Math.abs(Math.abs(this.m_maxValue) - Math.abs(value));
			height = diff * this.m_ratio;
			y = this.m_bulletCalculation.endY - height;
		}

	} else {
		if (this.m_orientation == "normal") {
			start = startPosition - (Math.abs(this.m_minValue));
			y = start - (value * 1 * this.m_ratio);
		} else {
			start = startPosition + (Math.abs(this.m_minValue));
			y = start + (value * 1 * this.m_ratio);
		}
	}
	return {
		"y" : y
	};
};

/** @description Will Drawing Vertical Bullet chart according to calculation. **/
Bullet.prototype.drawVerticalBullet = function () {
	var actualMeterWidth = this.m_bulletCalculation.getAvailableWidth() * this.m_actualmetersize * 1;
	var newActualValue = this.getActualValue();
	var startAndHeight = this.getActualStartY(this.m_bulletCalculation.startY, newActualValue);
	var actualXPosition = this.m_bulletCalculation.startX * 1 + this.m_bulletCalculation.getAvailableWidth() / 2 - actualMeterWidth / 2;
	this.drawBulletRange(actualXPosition, startAndHeight.start, actualMeterWidth, startAndHeight.height, convertColorToHex(this.m_facecolor));

	var targetValue = this.getTargetValue() * 1;
	var targetValueWidth = this.m_bulletCalculation.getAvailableWidth() * 3 / 5;
	var targetValueheight = 20 * this.m_targetmetersize * 1;
	var startValue = this.getTargetStartY(this.m_bulletCalculation.startY, targetValue);
	var targetXposition = (this.m_bulletCalculation.startX * 1 + this.m_bulletCalculation.getAvailableWidth() * 1 / 2) - targetValueWidth / 2;
	this.drawBulletRange(targetXposition, startValue.y - targetValueheight / 2, targetValueWidth, targetValueheight, convertColorToHex(this.m_targetcolor));
	if (IsBoolean(this.m_showtargetvalue))
		this.drawText(this.m_targetvalue, this.m_width * 1 - this.m_bulletCalculation.rigthmargin * 1, startValue.y + targetValueheight * 4 / 5, this.m_fontcolor, "");
};

/** @description Getter Method for actual startY position. **/
Bullet.prototype.getActualStartY = function (startPosition, value) {
	var diff, start, height;
	if (this.m_minValue > 0 && this.m_maxValue > 0) {
		start = startPosition;
		diff = Math.abs(Math.abs(value) - (Math.abs(this.m_minValue)));
		height = diff * this.m_ratio;
	} else if (this.m_minValue < 0 && this.m_maxValue <= 0) {
		if (this.m_orientation == "normal") {
			diff = Math.abs(Math.abs(this.m_maxValue) - Math.abs(value));
			height = diff * this.m_ratio;
			start = this.m_bulletCalculation.endY;
		} else {
			diff = Math.abs(Math.abs(this.m_maxValue) - Math.abs(value));
			height = diff * this.m_ratio;
			start = this.m_bulletCalculation.endY - height;
		}
	} else if (this.m_minValue < 0 && this.m_maxValue > 0) {
		if (this.m_orientation == "normal") {
			if (value >= 0){
				value = -value * 1;
			}else{
				value = Math.abs(value);
			}
			start = startPosition - Math.abs(this.m_minValue) * this.m_ratio * 1;
			height = (value) * this.m_ratio;
		} else {
			start = startPosition + Math.abs(this.m_minValue) * this.m_ratio * 1;
			height = value * this.m_ratio;
		}
	} else {
		height = value * this.m_ratio;
		if (this.m_orientation == "normal"){
			start = startPosition - height;
		}else{
			start = startPosition;
		}
	}
	return {
		"height" : height,
		"start" : start
	};
};

/** @description Will Drawing border of the Bullet. **/
Bullet.prototype.drawBorderBullet = function () {
	var x = this.m_bulletCalculation.leftmargin * 1;
	var y = this.m_bulletCalculation.topmargin * 1;
	var width = this.m_bulletCalculation.getAvailableWidth() * 1;
	var height = this.m_bulletCalculation.getAvailableHeight() * 1;
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.strokeStyle = convertColorToHex(this.m_bordercolor);
	this.ctx.translate(0.5, 0.5);
	this.ctx.strokeRect(x, y, width, height);
	this.ctx.restore();
	this.ctx.closePath();
};

/** @description Will Drawing Bullet Range slices according to the range. **/
Bullet.prototype.drawBulletRange = function (x, y, width, height, color) {
	this.ctx.beginPath();
	this.ctx.save();
	var fillColor = color;
	this.ctx.fillStyle = fillColor;
	this.ctx.fillRect(x, y, width, height);
	this.ctx.restore();
	this.ctx.closePath();
};

/** @description Will drawing bullet marking according to the bullettype. **/
Bullet.prototype.drawMarking = function () {
	var markXPosition = this.m_bulletCalculation.getXPosMarkingArray();
	var markYPosition = this.m_bulletCalculation.getYPosMarkingArray();
	var markartext = this.m_bulletCalculation.getMarkingText();
	for (var i = 0; i < markXPosition.length; i++) {
		if (this.m_bullettype == "horizontal") {
			this.drawMarkingLine(markXPosition[i], markYPosition[i], markXPosition[i], markYPosition[i] + 5)
			this.drawMarkingText(markartext[i], markXPosition[i], (this.m_height * 1 - (this.m_bulletCalculation.buttommargin * 1) / 2) + 5, this.m_markertextcolor);
		} else {
			this.drawMarkingLine(markXPosition[i], markYPosition[i], markXPosition[i] - 5, markYPosition[i]);
			this.drawMarkingText(markartext[i], markXPosition[i] - 17, markYPosition[i] + 5, this.m_markertextcolor);
		}
	}
};

/** @description Will drawing marking text. **/
Bullet.prototype.drawMarkingText = function (text, x, y, color) {
	this.ctx.beginPath();
	this.ctx.fillStyle = convertColorToHex(color);
	this.ctx.font = this.fontScaling(this.m_fontsize * 1) + "px " + selectGlobalFont(this.m_labelfontfamily);
	this.ctx.textAlign = "left";
	var textWidth = this.ctx.measureText(text).width;
	this.ctx.fillText(text, x - textWidth / 2, y);
	this.ctx.fill();
	this.ctx.closePath();
};

/** @description Will drawing marking line. **/
Bullet.prototype.drawMarkingLine = function (x1, y1, x2, y2) {
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.lineWidth = "0.9";
	this.ctx.translate(0.5, 0.5);
	this.ctx.strokeStyle = convertColorToHex(this.m_tickscolor);
	this.ctx.moveTo(x1, y1);
	this.ctx.lineTo(x2, y2);
	this.ctx.stroke();
	this.ctx.restore();
	this.ctx.closePath();
};

/** @description Getter Method for actual value. **/
Bullet.prototype.getActualValue = function () {
	var actualValue;
	if (this.m_actualvalue * 1 > this.m_maxValue * 1)
		actualValue = this.m_maxValue * 1;
	else if (this.m_actualvalue * 1 < this.m_minValue * 1)
		actualValue = this.m_minValue * 1;
	else
		actualValue = this.m_actualvalue * 1;
	return actualValue;
};

/** @description Getter Method for target value. **/
Bullet.prototype.getTargetValue = function () {
	var targetValue;
	if (this.m_targetvalue * 1 > this.m_maxValue * 1)
		targetValue = this.m_maxValue * 1;
	else if (this.m_targetvalue * 1 < this.m_minValue * 1)
		targetValue = this.m_minValue * 1;
	else
		targetValue = this.m_targetvalue * 1;
	return targetValue;
};

/** @description Getter Method for title value according to the bullet type. **/
Bullet.prototype.drawTitle_Value = function () {
	var xPos, yPos;
	if (IsBoolean(this.m_showtext)) {
		if (this.m_bullettype == "horizontal") {
			this.drawText(this.m_formattedDisplayName, this.m_bulletCalculation.leftmargin, (this.m_height * 1 - this.m_bulletCalculation.buttommargin - 10) / 2 + 12, this.m_fontcolor, "true");
		} else {
			xPos = (this.m_width * 1 - this.m_bulletCalculation.leftmargin - this.m_bulletCalculation.rigthmargin) / 2 + this.m_bulletCalculation.leftmargin;
			this.drawText(this.m_formattedDisplayName, xPos, this.m_height * 1 - 8, this.m_fontcolor, "false");
		}
	}

	if (IsBoolean(this.m_showvalue)) {
		if (this.m_bullettype == "horizontal") {
			yPos = (this.m_height * 1 - this.m_bulletCalculation.buttommargin) / 2 + 12;
			xPos = this.m_width - (this.m_bulletCalculation.rigthmargin);
			this.drawText(this.m_actualvalue, xPos, yPos, this.m_fontcolor, "");
		} else {
			xPos = this.m_bulletCalculation.leftmargin + this.m_bulletCalculation.getAvailableWidth() * 1 / 2;
			this.drawText(this.m_actualvalue, xPos, 15, this.m_fontcolor, "false");
		}
	}
};

/** @description Will draw text according to the position. **/
Bullet.prototype.drawText = function (text, x, y, color, flag) {
	var xpos = "";
	this.ctx.beginPath();
	this.ctx.font = this.fontScaling(this.m_fontsize * 1) + "px " + selectGlobalFont(this.m_labelfontfamily);
	this.ctx.textAlign = "left";
	this.ctx.fillStyle = convertColorToHex(color);
	var textWidth = this.ctx.measureText(text).width;
	if (flag == "true")
		xpos = x - textWidth - 2;
	else if (flag == "")
		xpos = x + 2;
	else
		xpos = x - textWidth / 2;
	this.ctx.fillText(text, xpos, y);
	this.ctx.fill();
	this.ctx.closePath();
};

/** @description Creating Map and setting field name,actualValue,targetValue Data in Map **/
Bullet.prototype.getDataPointAndUpdateGlobalVariable = function () {
	//	if(this.m_fieldvalue!=""){
	var fieldNameValueMap = {};
	var fieldname = (this.m_fieldname == "" || this.m_fieldname == undefined) ? "Value" : this.m_fieldname;
	fieldNameValueMap["ActualValue"] = this.m_actualvalue * 1;
	fieldNameValueMap["TargetValue"] = this.m_targetvalue * 1;
	fieldNameValueMap[fieldname] = this.m_fieldvalue;
	this.updateDataPoints(fieldNameValueMap);
	//	}
};

/** @description Constructor function  of BulletCalculation class. **/
function BulletCalculation() {
	this.m_bulletRef;
	this.ctx;
	this.calculatedRatio;
	this.leftmargin;
	this.rigthmargin;
	this.topmargin;
	this.buttommargin;
	this.availablewidth;
	this.availableheight;
	this.widthArray = [];
	this.xpositionArray = [];
	this.ypositionArray = [];
	this.heightArray = [];

	this.startX = "";
	this.startY = "";
	this.endX = "";
	this.endY = "";

	this.rangesofseries;
	this.markartext = [];
	this.xpositionmarkerArray = [];
	this.ypositionMarker = [];
	this.rangeRatio;
	this.rangedcolors = [];
};

/** @description Setter method for setting the ratio according to the bullet type. **/
BulletCalculation.prototype.setRatio = function (availablewidth) {
	var drawArea;
	if (this.m_bulletRef.m_bullettype == "horizontal")
		drawArea = this.getAvailableWidth();
	else
		drawArea = this.getAvailableHeight();
	if (this.getMax() > 0 && this.getMin() < 0)
		this.calculatedRatio = drawArea * 1 / Math.abs(Math.abs(this.getMax() * 1) + Math.abs(this.getMin() * 1));
	else
		this.calculatedRatio = drawArea * 1 / Math.abs(Math.abs(this.getMax() * 1) - Math.abs(this.getMin() * 1));
};

/** @description Getter method for Ratio. **/
BulletCalculation.prototype.getRatio = function () {
	return this.calculatedRatio;
};

/** @description Getter method for XpositionArray. **/
BulletCalculation.prototype.getXpositionArray = function () {
	return this.xpositionArray;
};

/** @description Getter method for YpositionArray. **/
BulletCalculation.prototype.getYpositionArray = function () {
	return this.ypositionArray;
};

/** @description Getter method for HeightArray. **/
BulletCalculation.prototype.getHeightArray = function () {
	return this.heightArray;
};

/** @description Getter method for WidthArray. **/
BulletCalculation.prototype.getWidthArray = function () {
	return this.widthArray;
};

/** @description Getter method for range colors. **/
BulletCalculation.prototype.getcolors = function () {
	return this.rangedcolors;
};

/** @description Getter method for range. **/
BulletCalculation.prototype.getRange = function () {
	return this.rangeRatio;
};

/** @description Setter method for available Width Height. **/
BulletCalculation.prototype.setAvailableWidthHeight = function () {
	this.availablewidth = this.m_bulletRef.m_width * 1 - this.leftmargin - this.rigthmargin;
	this.availableheight = this.m_bulletRef.m_height * 1 - this.topmargin - this.buttommargin;
};

/** @description Getter method for AvailableWidth. **/
BulletCalculation.prototype.getAvailableWidth = function () {
	return this.availablewidth;
};

/** @description Getter method for AvailableHeight. **/
BulletCalculation.prototype.getAvailableHeight = function () {
	return this.availableheight;
};

/** @description BulletCalculation class initialization **/
BulletCalculation.prototype.init = function (bulletRef) {
	this.m_bulletRef = bulletRef;
	this.ctx = bulletRef.ctx;
	this.rangesofseries = (this.m_bulletRef.m_rangesofseries).split(",");
	this.setColor();
	this.rangedseriesdisplaynames = (this.m_bulletRef.m_rangedseriesdisplaynames).split(",");
	this.setMinMax();
	this.initMargin();
	this.setAvailableWidthHeight();
	this.setRatio();
	this.setStartPostion();
	this.setDiffRatio();
	this.rangeRatio = this.rangesofseries;
	this.set_XYWH_Position();
	this.initMarking();
};

/** @description Setter method for color according to the range. **/
BulletCalculation.prototype.setColor = function () {
	var bandalphas = [];
	if (this.m_bulletRef.m_alphas != null){
		bandalphas = this.m_bulletRef.m_alphas.split(",");
	}
	var color = (this.m_bulletRef.m_rangedcolors).split(",");
	for (var i = 0; i < this.rangesofseries.length; i++) {
		var col =  (color[i] != undefined) ? convertColorToHex(color[i]) : convertColorToHex("16777215");
		var alpha = (bandalphas[i] != undefined) ? bandalphas[i] : 1;
		this.rangedcolors[i] = hex2rgb(col, alpha);
	}
};

/** @description Setter method for Start Postions. **/
BulletCalculation.prototype.setStartPostion = function () {
	if (this.getBulletType() == "horizontal") {
		if (this.m_bulletRef.m_orientation == "normal") {
			this.startX = this.leftmargin;
			this.startY = this.topmargin;
			this.endX = this.m_bulletRef.m_width * 1 - this.rigthmargin * 1;
			this.endY = this.m_bulletRef.m_height * 1 - this.buttommargin * 1;
		} else {
			this.startX = this.m_bulletRef.m_width * 1 - this.rigthmargin * 1;
			this.startY = this.topmargin;
			this.endX = this.leftmargin;
			this.endY = this.m_bulletRef.m_height * 1 - this.buttommargin * 1;
		}
	} else {
		if (this.m_bulletRef.m_orientation == "normal") {
			this.startX = this.leftmargin;
			this.startY = this.m_bulletRef.m_height * 1 - this.buttommargin * 1;
			this.endX = this.m_bulletRef.m_width * 1 - this.rigthmargin * 1;
			this.endY = this.topmargin;
		} else {
			this.startX = this.leftmargin;
			this.startY = this.topmargin;
			this.endX = this.m_bulletRef.m_width * 1 - this.rigthmargin * 1;
			this.endY = this.m_bulletRef.m_height * 1 - this.buttommargin * 1;
		}

	}
};

/** @description Setter method for Difference in Ratio. **/
BulletCalculation.prototype.setDiffRatio = function () {
	this.differenceRatioArray = [];
	var diff = 0;
	for (var i = 0; i < this.rangesofseries.length; i++) {
		diff = (this.rangesofseries[i].split("~")[1] * 1) - (this.rangesofseries[i].split("~")[0] * 1);
		this.differenceRatioArray.push(diff);
	}
};

/** @description Setter method for Min Max value. **/
BulletCalculation.prototype.setMinMax = function () {
	this.minValue = this.rangesofseries[0].split("~")[0];
	this.maxValue = this.rangesofseries[this.rangesofseries.length - 1].split("~")[1];
};

/** @description Getter method for min value. **/
BulletCalculation.prototype.getMin = function () {
	return this.minValue;
};

/** @description Getter method for max value. **/
BulletCalculation.prototype.getMax = function () {
	return this.maxValue;
};

/** @description Getter method for Bullet type. **/
BulletCalculation.prototype.getBulletType = function () {
	if (this.m_bulletRef.m_bullettype == "horizontal")
		return "horizontal";
	else
		return "vertical";
};

/** @description Getter method for XPosition Marking Array. **/
BulletCalculation.prototype.getXPosMarkingArray = function () {
	return this.xpositionmarkerArray;
};

/** @description Getter method for YPosition Marking Array. **/
BulletCalculation.prototype.getYPosMarkingArray = function () {
	return this.ypositionMarker;
};

/** @description Getter method for Marking text. **/
BulletCalculation.prototype.getMarkingText = function () {
	return this.markartext;
};

/** @description Setter method for position of x,y and set width,height. **/
BulletCalculation.prototype.set_XYWH_Position = function () {
	this.widthArray = [];
	this.xpositionArray = [];
	this.ypositionArray = [];
	this.heightArray = [];
	var ratioMinMax;
	if (this.getBulletType() == "horizontal") {
		//if(this.m_bulletRef.m_width*1-this.rigthmargin*1)
		if (this.m_bulletRef.m_orientation == "normal") {
			for (var i = 0; i < this.rangeRatio.length; i++) {
				ratioMinMax = this.rangesofseries[i].split("~");
				if (i == 0)
					this.xpositionArray.push(this.leftmargin);
				else if (this.minValue < 0 && this.maxValue > 0) {
					if (ratioMinMax[0] * 1 > 0 && ratioMinMax[1] * 1 > 0)
						this.xpositionArray.push(this.startX * 1 + Math.abs(Math.abs(this.rangesofseries[i].split("~")[0] * 1) + (Math.abs(this.minValue * 1))) * this.calculatedRatio * 1);
					else
						this.xpositionArray.push(this.startX * 1 + Math.abs(Math.abs(this.rangesofseries[i].split("~")[0] * 1) - (Math.abs(this.minValue * 1))) * this.calculatedRatio * 1);
				} else{
					this.xpositionArray.push(this.startX * 1 + Math.abs(Math.abs(this.rangesofseries[i].split("~")[0] * 1) - (Math.abs(this.minValue * 1))) * this.calculatedRatio * 1);
				}
				this.widthArray.push(this.differenceRatioArray[i] * this.calculatedRatio);
				this.ypositionArray.push(this.topmargin);
				this.heightArray.push(this.availableheight);
			}
		} else {
			for (var i = 0; i < this.rangeRatio.length; i++) {
				ratioMinMax = this.rangesofseries[i].split("~");
				if (i == 0)
					this.xpositionArray.push(this.startX - this.differenceRatioArray[i] * this.calculatedRatio);
				else if (this.minValue < 0 && this.maxValue > 0) {
					if (ratioMinMax[0] * 1 > 0 && ratioMinMax[1] * 1 > 0)
						this.xpositionArray.push(this.startX * 1 - Math.abs(Math.abs(this.rangesofseries[i].split("~")[1] * 1) + (Math.abs(this.minValue * 1))) * this.calculatedRatio * 1);
					else {
						if (this.rangesofseries[i].split("~")[1] * 1 >= 0)
							this.xpositionArray.push(this.startX * 1 - Math.abs(Math.abs(this.rangesofseries[i].split("~")[1] * 1) + (Math.abs(this.minValue * 1))) * this.calculatedRatio * 1);
						else
							this.xpositionArray.push(this.startX * 1 - Math.abs(Math.abs(this.rangesofseries[i].split("~")[1] * 1) - (Math.abs(this.minValue * 1))) * this.calculatedRatio * 1);
					}
				} else{
					this.xpositionArray.push(this.startX * 1 - Math.abs(Math.abs(this.rangesofseries[i].split("~")[1] * 1) - (Math.abs(this.minValue * 1))) * this.calculatedRatio * 1);
				}
				this.widthArray.push(this.differenceRatioArray[i] * this.calculatedRatio);
				this.ypositionArray.push(this.topmargin);
				this.heightArray.push(this.availableheight);
			}
		}
	} else {
		if (this.m_bulletRef.m_orientation == "normal") {
			for (var i = 0; i < this.rangeRatio.length; i++) {
				ratioMinMax = this.rangesofseries[i].split("~");
				if (i == 0)
					this.ypositionArray.push(this.startY);
				else if (this.minValue < 0 && this.maxValue > 0) {
					if (ratioMinMax[0] * 1 > 0 && ratioMinMax[1] * 1 > 0)
						this.ypositionArray.push(this.startY * 1 - Math.abs(Math.abs(this.rangesofseries[i].split("~")[0] * 1) + (Math.abs(this.minValue * 1))) * this.calculatedRatio * 1);
					else
						this.ypositionArray.push(this.startY * 1 - Math.abs(Math.abs(this.rangesofseries[i].split("~")[0] * 1) - (Math.abs(this.minValue * 1))) * this.calculatedRatio * 1);
				} else{
					this.ypositionArray.push(this.startY * 1 - Math.abs(Math.abs(this.rangesofseries[i].split("~")[0] * 1) - (Math.abs(this.minValue * 1))) * this.calculatedRatio * 1);
				}
				this.xpositionArray.push(this.leftmargin);
				this.heightArray.push(this.differenceRatioArray[i] * this.calculatedRatio);
				this.widthArray.push(this.availablewidth);
			}
		} else {
			for (var i = 0; i < this.rangeRatio.length; i++) {
				ratioMinMax = this.rangesofseries[i].split("~");
				if (i == 0)
					this.ypositionArray.push(this.startY + this.differenceRatioArray[i] * this.calculatedRatio);
				else if (this.minValue < 0 && this.maxValue > 0) {
					if (ratioMinMax[0] * 1 > 0 && ratioMinMax[1] * 1 > 0)
						this.ypositionArray.push(this.startY * 1 + Math.abs(Math.abs(this.rangesofseries[i].split("~")[1] * 1) + (Math.abs(this.minValue * 1))) * this.calculatedRatio * 1);
					else {
						if (this.rangesofseries[i].split("~")[1] * 1 >= 0)
							this.ypositionArray.push(this.startY * 1 + Math.abs(Math.abs(this.rangesofseries[i].split("~")[1] * 1) + (Math.abs(this.minValue * 1))) * this.calculatedRatio * 1);
						else
							this.ypositionArray.push(this.startY * 1 + Math.abs(Math.abs(this.rangesofseries[i].split("~")[1] * 1) - (Math.abs(this.minValue * 1))) * this.calculatedRatio * 1);
					}
				} else{
					this.ypositionArray.push(this.startY * 1 + Math.abs(Math.abs(this.rangesofseries[i].split("~")[1] * 1) - (Math.abs(this.minValue * 1))) * this.calculatedRatio * 1);
				}
				this.xpositionArray.push(this.leftmargin);
				this.heightArray.push(this.differenceRatioArray[i] * this.calculatedRatio);
				this.widthArray.push(this.availablewidth);
			}
		}
	}
};

/** @description Intialize margin for bullet drawing. **/
BulletCalculation.prototype.initMargin = function (text, x, y) {
	if (this.getBulletType() == "horizontal") {
		this.buttommargin = this.getButtomMargin();
		this.leftmargin = this.getLeftMargin();
		this.rigthmargin = this.getRightMargin();
		this.topmargin = this.getTopMargin();
	} else {
		this.topmargin = this.getTopMargin();
		this.buttommargin = this.getButtomMargin();
		this.leftmargin = this.getLeftMargin();
		this.rigthmargin = this.getRightMargin();
	}
};

/** @description Getter method for Top Margin. **/
BulletCalculation.prototype.getTopMargin = function () {
	var topMargin = 10;
	if (this.getBulletType() == "horizontal") {
		if (IsBoolean(this.m_bulletRef.m_showtargetvalue)) {
			var font = this.m_bulletRef.m_fontsize * 1 + 'px ' + selectGlobalFont(this.m_bulletRef.m_labelfontfamily);
			var h = this.getTextHeight(font);
			topMargin = topMargin + h.height * 1 / 2;
		}
	} else {
		if (IsBoolean(this.m_bulletRef.m_showvalue)) {
			this.ctx.beginPath();
			this.ctx.font = this.m_bulletRef.m_fontsize * 1 + 'px ' + selectGlobalFont(this.m_bulletRef.m_labelfontfamily);
			this.ctx.textAlign = "left";
			this.ctx.closePath();
			topMargin = 20;
		}
	}
	return this.m_bulletRef.fontScaling(topMargin);
};

/** @description Getter method for Left Margin. **/
BulletCalculation.prototype.getLeftMargin = function () {
	var leftMargin = 10;
	var textWidth;
	if (this.getBulletType() == "horizontal") {
		if (IsBoolean(this.m_bulletRef.m_showtext)) {
			this.ctx.beginPath();
			this.ctx.font = this.m_bulletRef.m_fontsize * 1 + 'px ' + selectGlobalFont(this.m_bulletRef.m_labelfontfamily);
			this.ctx.textAlign = "left";
			textWidth = this.ctx.measureText(this.m_bulletRef.m_formattedDisplayName).width;
			this.ctx.closePath();
			leftMargin = leftMargin + textWidth * 1;
		}
	} else {
		if (IsBoolean(this.m_bulletRef.m_showticks)) {
			this.ctx.beginPath();
			this.ctx.font = this.m_bulletRef.m_fontsize * 1 + 'px ' + selectGlobalFont(this.m_bulletRef.m_labelfontfamily);
			this.ctx.textAlign = "left";
			textWidth = this.ctx.measureText(this.maxValue).width;
			this.ctx.closePath();
			leftMargin = leftMargin + textWidth * 1 + 10;
		}
	}
	return this.m_bulletRef.fontScaling(leftMargin);
};

/** @description Getter method for Buttom Margin. **/
BulletCalculation.prototype.getButtomMargin = function () {
	var buttomMargin = 10;
	var font, h;
	if (this.getBulletType() == "horizontal") {
		if (IsBoolean(this.m_bulletRef.m_showticks)) {
			font = this.m_bulletRef.m_fontsize * 1 + 'px ' + selectGlobalFont(this.m_bulletRef.m_labelfontfamily);
			h = this.getTextHeight(font);
			buttomMargin = buttomMargin + h.height * 1;
		}
	} else {
		if (IsBoolean(this.m_bulletRef.m_showtext)) {
			font = this.m_bulletRef.m_fontsize * 1 + 'px ' + selectGlobalFont(this.m_bulletRef.m_labelfontfamily);
			h = this.getTextHeight(font);
			buttomMargin = buttomMargin + (h.height * 1) * 4 / 5;
		}
	}
	return this.m_bulletRef.fontScaling(buttomMargin);
};

/** @description Getter method for Text Height. **/
BulletCalculation.prototype.getTextHeight = function (font) {
	var text = $("<span>Hg</span>").css({
			fontFamily : font
		});
	var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');
	var div = $("<div></div>");
	div.append(text, block);
	var body = $("body");
	body.append(div);
	try {
		var result = {};
		block.css({
			verticalAlign : "baseline"
		});
		result.ascent = block.offset().top - text.offset().top;
		block.css({
			verticalAlign : "bottom"
		});
		result.height = block.offset().top - text.offset().top;
		result.descent = result.height - result.ascent;
	}
	finally {
		div.remove();
	}
	return result;
};

/** @description Getter method for Right Margin according to the bullet type. **/
BulletCalculation.prototype.getRightMargin = function () {
	var rightMargin = 10;
	var textWidth;
	if (this.getBulletType() == "horizontal") {
		if (IsBoolean(this.m_bulletRef.m_showvalue)) {
			this.ctx.beginPath();
			this.ctx.font = this.m_bulletRef.m_fontsize * 1 + 'px ' + selectGlobalFont(this.m_bulletRef.m_labelfontfamily);
			this.ctx.textAlign = "left";
			textWidth = this.ctx.measureText(this.m_bulletRef.m_actualvalue).width;
			this.ctx.closePath();
			rightMargin = rightMargin + textWidth * 1;
		} else if (IsBoolean(this.m_bulletRef.m_showticks)) {
			rightMargin = 15;
		}else{
			// do nothing
		}
	} else {
		if (IsBoolean(this.m_bulletRef.m_showtargetvalue)) {
			this.ctx.beginPath();
			this.ctx.font = this.m_bulletRef.m_fontsize * 1 + 'px ' + selectGlobalFont(this.m_bulletRef.m_labelfontfamily);
			this.ctx.textAlign = "left";
			textWidth = this.ctx.measureText(this.m_bulletRef.m_targetvalue).width;
			this.ctx.closePath();
			rightMargin = rightMargin + textWidth * 1;
		}
	}
	return this.m_bulletRef.fontScaling(rightMargin);
};

/** @description This method will Intialization of Marking. **/
BulletCalculation.prototype.initMarking = function () {
	this.markartext = [];
	this.xpositionmarkerArray = [];
	this.ypositionMarker = [];
	var sum, sumX, maxDivisor, yposition;
	if (this.getBulletType() == "horizontal") {
		if (this.m_bulletRef.m_orientation == "normal") {
			sum = this.minValue * 1;
			sumX = this.leftmargin;
			maxDivisor = getMax(this.maxValue * 1 - this.minValue * 1);
			this.markartext.push(sum);
			yposition = this.topmargin + this.getAvailableHeight() * 1;
			this.xpositionmarkerArray.push(this.leftmargin);
			this.ypositionMarker.push(yposition);

			for (var i = 0; i < maxDivisor[1]; i++) {
				sum = sum + maxDivisor[2] * 1;
				sumX = sumX + (maxDivisor[2] * 1) * this.calculatedRatio;
				this.markartext.push(sum);
				this.xpositionmarkerArray.push(sumX);
				this.ypositionMarker.push(yposition);
			}
		} else {
			sum = this.minValue * 1;
			sumX = this.startX;
			maxDivisor = getMax(this.maxValue * 1 - this.minValue * 1);
			this.markartext.push(sum);
			yposition = this.topmargin + this.getAvailableHeight() * 1;
			this.xpositionmarkerArray.push(this.startX);
			this.ypositionMarker.push(yposition);

			for (var i = 0; i < maxDivisor[1]; i++) {
				sum = sum + maxDivisor[2] * 1;
				sumX = sumX - (maxDivisor[2] * 1) * this.calculatedRatio;
				this.markartext.push(sum);
				this.xpositionmarkerArray.push(sumX);
				this.ypositionMarker.push(yposition);
			}
		}
	} else {
		if (this.m_bulletRef.m_orientation == "normal") {
			sum = this.minValue * 1;
			maxDivisor = getMax(this.maxValue * 1 - this.minValue * 1);
			this.markartext.push(sum);
			this.xpositionmarkerArray.push(this.leftmargin);
			this.ypositionMarker.push(this.startY);

			for (var i = 0; i < maxDivisor[1]; i++) {
				sum = sum + maxDivisor[2] * 1;
				this.markartext.push(sum);
				this.xpositionmarkerArray.push(this.leftmargin);
				if (i == 0)
					this.ypositionMarker.push(this.startY * 1 - (Math.abs(maxDivisor[2] * 1) * this.calculatedRatio));
				else
					this.ypositionMarker.push(this.ypositionMarker[i] * 1 - (Math.abs(maxDivisor[2] * 1) * this.calculatedRatio));
			}
		} else {
			sum = this.minValue * 1;
			maxDivisor = getMax(this.maxValue * 1 - this.minValue * 1);
			this.markartext.push(sum);
			this.xpositionmarkerArray.push(this.leftmargin);
			this.ypositionMarker.push(this.startY);

			for (var i = 0; i < maxDivisor[1]; i++) {
				sum = sum + maxDivisor[2] * 1;
				this.markartext.push(sum);
				this.xpositionmarkerArray.push(this.leftmargin);
				if (i == 0)
					this.ypositionMarker.push(this.startY * 1 + (Math.abs(maxDivisor[2] * 1) * this.calculatedRatio));
				else
					this.ypositionMarker.push(this.ypositionMarker[i] * 1 + (Math.abs(maxDivisor[2] * 1) * this.calculatedRatio));
			}
		}
	}
};
//# sourceURL=Bullet.js