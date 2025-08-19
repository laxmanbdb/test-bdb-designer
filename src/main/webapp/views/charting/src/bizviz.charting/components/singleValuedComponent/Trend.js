/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: Trend.js
 * @description Trend
 **/
function Trend(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();

	/** Creating Class Variables and arrays that will be used in processing**/
	this.m_text = "";
	this.m_virtualdatafield = "";
	this.m_datarownumber = "";
	this.m_virtualdataid = "";
	this.m_textdecoration = "";
	this.m_fontweight = "";
	this.m_fontstyle = "";
	this.m_verticalalign = "";
	this.m_fontsize = "";
	this.m_isdynamic = "";
	this.m_backgroundalpha = "";
	this.m_alignmentbaseline = "";
	this.m_fontfamily = "";
	this.m_color = "";
	this.m_textalign = "";
	this.m_backgroundcolor = "";
	this.m_editable = false;
	this.m_labelText = "";

	this.m_objectID = [];
	this.m_componentid = "";
	this.m_positivetrendcolor = "#1bcc07";
	this.m_positivesymbolcolor = "#d3ffe4";
	this.m_negativetrendcolor = "#fd0101";
	this.m_negativesymbolcolor = "#f4dcad";
	this.m_zerotrendcolor = "#d1d911";
	this.m_zerosymbolcolor = "#fbfbdb";
	this.m_virtualdataid = "";
	this.m_virtualdatafield = "";
	this.m_datarownumber = "";
	this.m_baserange = "0,0";
	this.m_enabletooltip = false;
	this.m_fielddisplayname = "Trend";

	this.m_value = "-1";
	this.m_trendValue = "1";
	this.m_maxValue = "";
	this.m_minValue = "";

	this.m_globalkey = "";
	this.m_fieldvalue = "";

	this.trend = "";
	this.trendColorMap = new Object();
	this.m_tooltip = new Tooltip();
	this.m_isEmptySeries = false;

	this.m_innerRadius = "";
	this.m_outerRadius = "";

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
};

/** @description Using Prototype inheriting Widget Class variables and methods into Trend Class**/
Trend.prototype = new Widget();

/** @description This method will parse the Trend JSON and create a container **/
Trend.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Getter for Start X**/
Trend.prototype.getStartX = function () {
	return 0;
};

/** @description Getter for Start Y**/
Trend.prototype.getStartY = function () {
	return 0;
};

/** @description Getter for End X **/
Trend.prototype.getEndX = function () {
	return this.m_width;
};

/** @description Getter for End Y **/
Trend.prototype.getEndY = function () {
	return this.m_height;
};

/** @description Iterate through Trend JSON and set class variable values with JSON values **/
Trend.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "Trend") {
			for (var labelKey in jsonObject[key]) {
				this.setAttributeValueToNode(labelKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

/** @description Setter for Data Provider **/
Trend.prototype.setDataProvider = function (data) {
	this.m_trendValue = this.m_value = data;
};

/** @description if already present remove and create new canvas**/
Trend.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description Initializing Draggable Div and Canvas**/
Trend.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent();
	this.initMouseClickEvent();
};

/** @description Getting Trend value and setting into the this.m_trendValue global variable**/
Trend.prototype.updateWidgetsDataSetValues = function () {
	this.m_trendValue = this.m_value;
	if (this.m_virtualdatafield != "" && this.m_datarownumber != "") {
		if (this.m_fieldSetValue.m_fieldNameValues[this.m_datarownumber] != undefined) {
			if (this.m_fieldSetValue.m_fieldNameValues[this.m_datarownumber][this.m_virtualdatafield] != undefined) {
				this.m_trendValue = this.m_fieldSetValue.m_fieldNameValues[this.m_datarownumber][this.m_virtualdatafield];
			}
		}
	}
	this.drawObject();
};

/** @description Setting the Max,Min Range*/
Trend.prototype.setRangeArray = function () {
	var baserange = this.m_baserange.split(",");
	if (baserange.length == 2) {
		this.m_minValue = baserange[0];
		this.m_maxValue = baserange[1];
	} else {
		this.m_minValue = 0;
		this.m_maxValue = 0;
	}
};

/** @description Setting color for Positive,Negative,Zero trend**/
Trend.prototype.setColorMap = function () {
	this.trendColorMap["Positive"] = [convertColorToHex(this.m_positivetrendcolor), convertColorToHex(this.m_positivesymbolcolor)];
	this.trendColorMap["Negative"] = [convertColorToHex(this.m_negativetrendcolor), convertColorToHex(this.m_negativesymbolcolor)];
	this.trendColorMap["Zero"] = [convertColorToHex(this.m_zerotrendcolor), convertColorToHex(this.m_zerosymbolcolor)];
};

/** @description Start of Drawing**/
Trend.prototype.drawObject = function () {
	this.setRangeArray();
	this.setColorMap();
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback!="")
		onAfterRender(this.m_onafterrendercallback);
};

/** @description Trend Initialization**/
Trend.prototype.init = function () {
	this.m_trendValue = this.m_value;
	this.m_startX = 1 * (this.m_x) + 1 * (this.m_width / 2);
	this.m_startY = 1 * (this.m_y) + 1 * (this.m_height / 2);
	this.CalculateRadius();
	this.Calculation();
    this.m_tooltip.init(this);
};

/** @description Calling of Trend Initialization and drawing**/
Trend.prototype.draw = function () {
	this.drawObject();
};

/** @description Calling for Trend Drawing**/
Trend.prototype.drawChart = function () {
	this.drawTrend();
};

/** @description Draw Trend on the basis of trend value**/
Trend.prototype.drawTrend = function () {
	var color = this.trendColorMap[this.trend];
	this.drawouterCircle(color[0]);
	//this.drawinnerCircle(color[0]);
	eval("this.draw" + this.trend + "Symbol(color[1]);");
};

/** @description Getter for object Name**/
Trend.prototype.getObjectName = function () {
	return this.getObjectType();
};

/** @description Drawing of Outer Circle**/
Trend.prototype.drawouterCircle = function (color) {
	var grd = color;
	try {
		grd = this.ctx.createRadialGradient(1 * (this.m_x) + 1 * (this.m_width / 2), 1 * (this.m_y) + 1 * (this.m_height / 2), (this.m_width / 2) - 1 * (this.m_width * .2), 1 * (this.m_x) + 1 * (this.m_width / 2), 1 * (this.m_y) + 1 * (this.m_height / 2), (this.m_width / 2));
		grd.addColorStop(0, color);
		grd.addColorStop(1, color);
	} catch (e) {
		console.log(e);
	}
	this.clearCircle(this.m_startX, this.m_startY, this.m_outerRadius);
	this.drawCircle(this.m_startX, this.m_startY, (this.m_outerRadius - (this.m_outerRadius * 2) / 100), grd);
};

/** @description Calculating Radius of Trend**/
Trend.prototype.CalculateRadius = function () {
	var trendmargin = 1;
	this.m_outerRadius = this.m_width / 2 - trendmargin;
	if (this.m_height * 1 > this.m_width * 1)
		this.m_outerRadius = this.m_width / 2 - trendmargin;
	else
		this.m_outerRadius = this.m_height / 2 - trendmargin;

	this.m_innerRadius = this.m_outerRadius * 3 / 4;
};

/** @description Circle Drawing**/
Trend.prototype.drawCircle = function (x, y, radius, grd) {
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.strokeStyle = grd;
	this.ctx.fillStyle = grd;
	this.ctx.lineWidth = "1";
	this.ctx.arc(x, y, radius, 0, Math.PI * 2, false);
	this.ctx.fill();
	this.ctx.stroke();
	this.ctx.closePath();
	this.ctx.restore();
};

/** @description Clearing Area**/
Trend.prototype.clearCircle = function (x, y, radius) {
	this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
	this.ctx.clearRect(x - radius - 1, y - radius - 1, radius * 2 + 2, radius * 2 + 2);
};

/** @description Drawing of inner Circle**/
Trend.prototype.drawinnerCircle = function (color) {
	var grd = color;
	try {
		grd = this.ctx.createRadialGradient(1 * (this.m_x) + 1 * (this.m_width / 2), 1 * (this.m_y) + 1 * (this.m_height / 2), (this.m_width / 2) - 1 * (this.m_width / 4), 1 * (this.m_x) + 1 * (this.m_width / 2), 1 * (this.m_y) + 1 * (this.m_height / 2), (this.m_width / 2) - 1 * (this.m_width / 8));
		grd.addColorStop(0, color);
		grd.addColorStop(1, color);
	} catch (e) {
		console.log(e);
	}
	this.drawCircle(this.m_startX, this.m_startY, this.innerRadius, grd);
};

/** @description Calculating which trend has to draw (Positive,Negative,Zero)**/
Trend.prototype.Calculation = function () {
	if ((this.m_trendValue * 1 >= this.m_minValue * 1) && (this.m_trendValue * 1 <= this.m_maxValue * 1)) {
		this.trend = "Zero";
	} else if (1 * (this.m_trendValue) < 1 * (this.m_minValue)) {
		this.trend = "Negative";
	} else if (1 * (this.m_trendValue) > 1 * (this.m_maxValue)) {
		this.trend = "Positive";
	} else {
		// Do nothing
	}
};

/** @description Draw Positive Trend Symbol**/
Trend.prototype.drawPositiveSymbol = function (symbolcolor) {
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.strokeStyle = "#ffffff";
	this.ctx.fillStyle = symbolcolor;
	this.ctx.lineWidth = "1";

	this.ctx.moveTo(this.m_startX - 1 * (this.m_innerRadius / 5), this.m_startY);
	this.ctx.lineTo(this.m_startX - 1 * (this.m_innerRadius / 5), this.m_startY + 1 * (this.m_innerRadius * .7));
	this.ctx.lineTo(this.m_startX + 1 * (this.m_innerRadius / 5), this.m_startY + 1 * (this.m_innerRadius * .7));
	this.ctx.lineTo(this.m_startX + 1 * (this.m_innerRadius / 5), this.m_startY);
	this.ctx.lineTo(this.m_startX + 1 * (this.m_innerRadius / 2), this.m_startY);
	this.ctx.lineTo(this.m_startX, this.m_startY - 1 * (this.m_innerRadius * .7));
	this.ctx.lineTo(this.m_startX - 1 * (this.m_innerRadius / 2), this.m_startY);
	this.ctx.lineTo(this.m_startX - 1 * (this.m_innerRadius / 5), this.m_startY);
	this.ctx.fill();
	this.ctx.stroke();
	this.ctx.closePath();
	this.ctx.restore();
};

/** @description Draw Zero Trend Symbol**/
Trend.prototype.drawZeroSymbol = function (symbolcolor) {
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.strokeStyle = "#ffffff";
	this.ctx.lineWidth = "1";
	this.ctx.fillStyle = symbolcolor;
	this.ctx.rect(this.m_startX - this.m_innerRadius, this.m_startY - this.m_innerRadius / 3.5, this.m_innerRadius * 2, this.m_innerRadius / 2);
	this.ctx.fill();
	this.ctx.stroke();
	this.ctx.closePath();
	this.ctx.restore();
};

/** @description Draw Negative Trend Symbol**/
Trend.prototype.drawNegativeSymbol = function (symbolcolor) {
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.strokeStyle = "#ffffff";
	this.ctx.lineWidth = "1";
	this.ctx.fillStyle = symbolcolor;
	this.ctx.moveTo(this.m_startX - 1 * (this.m_innerRadius / 5), this.m_startY);
	this.ctx.lineTo(this.m_startX - 1 * (this.m_innerRadius / 5), this.m_startY - 1 * (this.m_innerRadius * .7));
	this.ctx.lineTo(this.m_startX + 1 * (this.m_innerRadius / 5), this.m_startY - 1 * (this.m_innerRadius * .7));
	this.ctx.lineTo(this.m_startX + 1 * (this.m_innerRadius / 5), this.m_startY);
	this.ctx.lineTo(this.m_startX + 1 * (this.m_innerRadius / 2), this.m_startY);
	this.ctx.lineTo(this.m_startX, this.m_startY + 1 * (this.m_innerRadius * .7));
	this.ctx.lineTo(this.m_startX - 1 * (this.m_innerRadius / 2), this.m_startY);
	this.ctx.lineTo(this.m_startX - 1 * (this.m_innerRadius / 5), this.m_startY);
	this.ctx.fill();
	this.ctx.stroke();
	this.ctx.closePath();
	this.ctx.restore();
};

/** @description Creating Table for showing Trend Data **/
Trend.prototype.drawTooltip = function (mouseX, mouseY) {
	if (!this.m_designMode) {
		var toolTipData = this.getToolTipData(mouseX, mouseY);
		this.drawTooltipContent(toolTipData);
	}
};
/** @description this methods draws the tooltip content in table - overrided in some sub classes **/
Trend.prototype.drawTooltipContent = function(toolTipData) {
	this.m_tooltip.draw(toolTipData, this.m_componenttype);
};

/** @description Getter for Trend tooltipdata**/
Trend.prototype.getToolTipData = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_designMode)) {
		var toolTipData;
		var deltaX = mouseX - (this.m_x * 1 + this.m_width / 2);
		var deltaY = mouseY - (this.m_y * 1 + this.m_height / 2);
		var Radius = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
		if (Radius <= this.m_outerRadius - 5 && IsBoolean(this.m_enabletooltip)) {
			toolTipData = {
				cat : this.m_fielddisplayname,
				data : [this.m_trendValue]
			};
		} else {
			this.hideToolTip();
		}
		return toolTipData;
	}
};

/** @description Creating Map and storing fieldValue into field Name and pass for updating the data points**/
Trend.prototype.getDataPointAndUpdateGlobalVariable = function () {
	//	if(this.m_fieldvalue!=""){
	var fieldNameValueMap = {};
	var fieldname = (this.m_fieldname == "" || this.m_fieldname == undefined) ? "Value" : this.m_fieldname;
	fieldNameValueMap[fieldname] = this.m_fieldvalue;
	this.updateDataPoints(fieldNameValueMap);
	//	}
};
//# sourceURL=Trend.js