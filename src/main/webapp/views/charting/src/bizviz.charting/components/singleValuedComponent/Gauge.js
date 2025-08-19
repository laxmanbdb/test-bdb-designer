/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: Gauge.js
 * @description Gauge
 **/
function Gauge(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();
	/** Creating Global variables which will be used in Processing and creating object of Movement() class and ChartFrame() class**/
	this.m_requiredData = "";
	this.value = [];
	this.m_valuevariable = "";
	this.m_tickscolor = "";
	this.m_minvalue = "";
	this.m_facecolor = "";
	this.m_maxvalue = "";
	this.m_bezelcolor = "";
	this.m_datarownumber = "";
	this.m_width = "";
	this.m_virtualdataid = "";
	this.m_virtualdatafield = "";
	this.m_height = "";
	this.m_ratios = "";
	this.m_poitcolor = "";
	this.m_showminmax = "";
	this.m_fontsize = "";
	this.m_alphas = "0";
	this.m_id = "";
	this.m_colors = "";
	this.m_showtitle = "false";
	this.m_title = "";
	this.m_valuefontfamily = "";
	this.m_titlefontfamily = "";
	this.m_titlefontsize = "";
	this.m_titlefontcolor = "";
	this.m_rangefontcolor = "";
	this.m_markerfontsize = "";
	this.m_targetvalue = "";
	this.m_targetcolor = "#000000";	
	this.m_bggradientrotation = "0";
	this.m_bgalpha = "0";
	this.m_bggradients = "#ffffff";
	this.m_coloropacity = "";
	this.bracesRemovedStr = "";
	this.m_fontcolor = "";
	this.m_centercolor = "";
	this.m_faceshadowcolor = "";
	this.m_globalValueOperation = "";
	this.m_globalValueStr = "";
	
	this.m_showticks = true;
	this.m_tickcount = 8;
	this.m_precision = 2;
	
	this.updateFlag = false;
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_niddleMovement = new Movement(this);
	this.m_chartFrame = new ChartFrame();
};

/** @description Using prototype inheriting the variable and method of Widget into Gauge**/
Gauge.prototype = new Widget();

/** @description This method will parse the chart JSON and create a container **/
Gauge.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Getter for Object Type **/
Gauge.prototype.getObjectName = function () {
	return this.getObjectType();
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
Gauge.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	for (var key in jsonObject) {
		if (key == "Gauge") {
			for (var gaugeKey in jsonObject[key]) {
				this.setAttributeValueToNode(gaugeKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

/** @description Setting DataProvider and requiredData **/
Gauge.prototype.setDataProvider = function (data) {
	this.updateFlag = true;
	this.m_requiredData = isNaN(data) ? this.getValueFromGlobalVariable(data, "curly") : data;
};

/** @description Setter Method for Target value. **/
Gauge.prototype.setTargetValue = function (str) {
	this.m_targetvalue = isNaN(str) ? this.getValueFromGlobalVariable(str, "curly") : str;
};

/** @description Getter for DataProvider **/
Gauge.prototype.getDataProvider = function () {
	return this.m_requiredData;
};

/** @description Canvas Initialization **/
Gauge.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description Creating Draggable Div and Canvas **/
Gauge.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/** @description Creating component ID **/
Gauge.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "GaugeDiv" + this.m_objectid;
};

/** @description Starting of Gauge Drawing **/
Gauge.prototype.draw = function () {
	this.drawObject();
};

/** @description Calling init and drawChart function **/
Gauge.prototype.drawObject = function () {
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback!="")
		onAfterRender(this.m_onafterrendercallback);
};

/** @description Gauge initialization **/
Gauge.prototype.init = function () {
	var variableValue = this.getValueFromGlobalVariable(this.m_valuevariable, "curly");
	if (IsBoolean(this.m_isVirtualDataSetavailable)) {
		if (this.m_requiredData == "" || isNaN(this.m_requiredData))
			this.m_requiredData = 0;
	} else if (this.m_valuevariable !== "" && this.updateFlag === false && this.m_valuevariable !== undefined) {
		variableValue = ("" + this.getValueFromGlobalVariable(this.m_valuevariable, "curly") );
		if (variableValue !== "" && !isNaN(variableValue)) {
			var splitValue = variableValue.split("");
			if (splitValue[splitValue.length - 1] == ".")
				variableValue = variableValue.replace(".", "");
			else {
				var splitValue1 = variableValue.split(".");
				if (splitValue1[1] * 1 == 0) {
					var val;
					var zeroSplit = splitValue1[1].split("");
					if (zeroSplit.length <= 1)
						val = splitValue1[0] + "." + "0";
					else
						val = splitValue1[0] + "." + "00";
					variableValue = val;
				}
			}
			this.m_requiredData = variableValue;
		} else{
			this.m_requiredData = 0;
		}
	} else if(IsBoolean(this.updateFlag)) {
		this.m_requiredData = this.m_requiredData;
	} 
	else if (this.m_requiredData == "" || isNaN(this.m_requiredData) || isNaN(variableValue) || variableValue == "") {
		this.m_requiredData = 0;
	}else{
		// Do nothing
	}
	this.m_targetvalue = this.getValueFromGlobalVariable(this.m_targetvalue, "curly");
	this.m_niddleMovement.init(this);
	this.m_chartFrame.init(this);
};

/** @description Drawing of chart frame and niddle Movement**/
Gauge.prototype.drawChart = function () {
	this.m_chartFrame.drawFrame();
	this.m_niddleMovement.m_loop;
	this.m_niddleMovement.draw();
};

/** @description Creating Map and setting field name,required Data in Map **/
Gauge.prototype.getDataPointAndUpdateGlobalVariable = function () {
	//	if(this.m_fieldvalue!=""){
	var fieldNameValueMap = {};
	var fieldname = (this.m_fieldname == "" || this.m_fieldname == undefined) ? "Value" : this.m_fieldname;
	fieldNameValueMap[fieldname] = this.m_fieldvalue;
	fieldNameValueMap["drillValue"] = this.m_requiredData;
	this.updateDataPoints(fieldNameValueMap);
	//	}
};

/** @description Getter for Background Gradient **/
Gauge.prototype.getBgGradients = function () {
	return this.m_bggradients;
};

/** @description Getter for Background Alpha **/
Gauge.prototype.getBGAlpha = function () {
	return this.m_bgalpha;
};

/** @description Setter for Background Alpha **/
Gauge.prototype.setBGAlpha = function (m_bgalpha) {
	this.m_bgalpha = m_bgalpha;
};

//------------------------------------all calculation part----------------------------------------------------------

/** @description Creating Movement class **/
function Movement() {
	this.m_newDegrees = 0;
	this.m_degrees = 0;
	this.m_difference = 0;
	this.valueInDegree;
	this.targetvalueInDegree;
	this.m_gaugeRef;
	this.m_data;
	this.m_targetvalue;
	this.m_drawGauge = new DrawGauge();
	this.m_gaugeText = new GaugeText();
};

/** @description Movement class initialization **/
Movement.prototype.init = function (gaugeRef) {
	this.m_gaugeRef = gaugeRef;
	this.m_x = this.m_gaugeRef.m_x;
	this.m_y = this.m_gaugeRef.m_y;
	this.m_width = this.m_gaugeRef.m_width;
	this.m_height = this.m_gaugeRef.m_height;
	this.m_data = this.m_gaugeRef.m_requiredData;
	this.m_targetvalue = this.m_gaugeRef.m_targetvalue;
	this.m_degrees = this.m_gaugeRef.m_minvalue * 1;
	this.m_drawGauge.init(this);
	this.m_gaugeText.init(this);
};

/** @description Creating Min,Max Radio Button**/
Movement.prototype.draw = function () {
	this.generateDegree();

	if (IsBoolean(this.m_gaugeRef.m_showminmax)) {
		$("#maxtext" + this.m_gaugeRef.m_objectid).remove();
		$("#mintext" + this.m_gaugeRef.m_objectid).remove();
		this.m_gaugeText.drawMinRadioButton();
		this.m_gaugeText.drawMaxRadioButton();
	} else {
		$("#maxtext" + this.m_gaugeRef.m_objectid).remove();
		$("#mintext" + this.m_gaugeRef.m_objectid).remove();
	}
};

/** @description Generate Degree on the basis of given data **/
Movement.prototype.generateDegree = function () {
	this.minvalue = this.m_gaugeRef.m_minvalue * 1;
	this.maxvalue = this.m_gaugeRef.m_maxvalue * 1;
	var eachNumberIndegree = (this.maxvalue !== this.minvalue) ? (240 / (this.maxvalue - this.minvalue)) : 0; //240 for available degree area in the gauge where niddle movement
	this.valueInDegree = this.getValue() * eachNumberIndegree + 150;
	this.targetvalueInDegree = this.getTargetValue() * eachNumberIndegree + 150;

	var m_data = this.m_data;
	if (m_data > this.m_gaugeRef.m_maxvalue) {
		m_data = this.m_gaugeRef.m_maxvalue;
	}
	if (this.m_gaugeRef.m_maxvalue > 100) {
		var l = this.m_gaugeRef.m_maxvalue / 100;
		m_data = m_data / l;
	}
	m_data = (m_data) / 5;

	this.m_newDegrees = Math.round((m_data * 0.65));
	this.difference = this.m_degrees - this.m_newDegrees;
	this.animate_to();
};

/** @description Getter for Value **/
Movement.prototype.getValue = function () {
	if (this.m_data >= this.minvalue && this.m_data <= this.maxvalue)
		return this.m_data - this.minvalue;
	else if (this.m_data >= this.maxvalue)
		return this.maxvalue - this.minvalue;
	else if (this.m_data <= this.minvalue)
		return 0;
};

/** @description Getter for Target Value **/
Movement.prototype.getTargetValue = function () {
	if (this.m_targetvalue >= this.minvalue && this.m_targetvalue <= this.maxvalue)
		return this.m_targetvalue - this.minvalue;
	else if (this.m_targetvalue >= this.maxvalue)
		return this.m_targetvalue - this.minvalue;
	else if (this.m_targetvalue <= this.minvalue)
		return 0;
};

/** @description Start niddle Animation  **/
Movement.prototype.animate_to = function () {
	if (this.m_degrees * 1 == this.m_newDegrees * 1)
		this.m_degrees * 1;
	if ((this.m_degrees * 1) < (this.m_newDegrees * 1))
		this.m_degrees++;
	else
		this.m_degrees--;
	this.m_drawGauge.drawWithNewDegree(this.m_degrees, this.valueInDegree, this.targetvalueInDegree);
	this.m_gaugeText.drawText(this.m_degrees, this.m_data);
};

//-------------------------------------------------------------------------------------------

/** @description Creation of DrawGauge Class**/
function DrawGauge() {
	this.m_x;
	this.m_y;
	this.m_width;
	this.m_height;
	this.m_degrees;
	this.m_niddleMovementRef;
	this.m_colors = [];
	this.m_radius;
	this.m_newValueInDegree;
};

/** @description DrawGauge initialization  **/
DrawGauge.prototype.init = function (niddleMovementRef) {
	this.ctx = niddleMovementRef.m_gaugeRef.ctx;
	this.m_niddleMovementRef = niddleMovementRef;
	this.m_x = this.m_niddleMovementRef.m_x;
	this.m_y = this.m_niddleMovementRef.m_y;
	this.m_width = this.m_niddleMovementRef.m_width;
	this.m_height = this.m_niddleMovementRef.m_height;
	this.m_radiusmargin = 5;
	this.m_degrees = "";
	this.m_newValueInDegree = this.m_niddleMovementRef.valueInDegree;

	var bandalphas = [];
	if (this.m_niddleMovementRef.m_gaugeRef.m_alphas != null){
		bandalphas = this.m_niddleMovementRef.m_gaugeRef.m_alphas.split(",");
	}
	if (this.m_niddleMovementRef.m_gaugeRef.m_ratios != null){
		this.ratio = this.m_niddleMovementRef.m_gaugeRef.m_ratios.split(",");
	}
	var color = [];
	if (this.m_niddleMovementRef.m_gaugeRef.m_colors != null){
		color = this.m_niddleMovementRef.m_gaugeRef.m_colors.split(",");
	}
	for (var i = 0; i < this.ratio.length; i++) {
		var col =  (color[i] != undefined) ? convertColorToHex(color[i]) : convertColorToHex("16777215");
		var alpha = (bandalphas[i] != undefined) ? bandalphas[i] : 1;
		this.m_colors[i] = hex2rgb(col, alpha);
	}

	if (this.m_width * 1 >= this.m_height * 1) {
		this.m_radius = this.m_height / 2;
	} else {
		this.m_radius = this.m_width / 2;
	}
	this.m_radius = this.m_radius - this.m_radiusmargin;
};

/** @description Draw whole Gauge with New Degree **/
DrawGauge.prototype.drawWithNewDegree = function (degrees, valueInDegree, targetInDegree) {
	this.m_degrees = degrees;
	this.radians = (degrees * Math.PI) / 180;
	this.m_newValueInDegree = valueInDegree;
	this.m_targetValueInDegree = targetInDegree;
	this.Outercircle();
	this.drawWatchStick();
	this.drawTarget();
	this.drawneedle();
	this.Innercircle();
};

/** @description Creating outer circle for Gauge **/
DrawGauge.prototype.Outercircle = function () {
	this.maxvalue = this.m_niddleMovementRef.m_gaugeRef.m_maxvalue;
	var opacity = (this.m_niddleMovementRef.m_gaugeRef.m_coloropacity==="") ? 1 : this.m_niddleMovementRef.m_gaugeRef.m_coloropacity;
	var faceColor = hex2rgb( convertColorToHex(this.m_niddleMovementRef.m_gaugeRef.m_facecolor), opacity);
	var faceshadowcolor = hex2rgb(convertColorToHex(this.m_niddleMovementRef.m_gaugeRef.m_faceshadowcolor), (opacity*1===0)?0:0.1);
	var bezelColor = convertColorToHex(this.m_niddleMovementRef.m_gaugeRef.m_bezelcolor, opacity);
	this.drawCircle(this.m_x * 1 + this.m_width / 2 * 1, this.m_y * 1 + this.m_height / 2 * 1, this.m_radius - this.m_radius / 40, 0, Math.PI * 2, false, bezelColor,this.m_radius / 20); // bezel circle
	this.drawCircle(this.m_x * 1 + this.m_width / 2 * 1, this.m_y * 1 + this.m_height / 2 * 1, this.m_radius - this.m_radius / 20, 0, 2 * Math.PI, false, faceColor); // "this.m_radius-this.m_radius/10" is the linewidth of bezel circle // face Shadow cirle
	this.drawCircle(this.m_x * 1 + this.m_width / 2 * 1, this.m_y * 1 + this.m_height / 2 * 1, this.m_radius - this.m_radius / 20, 0, 2 * Math.PI, false, faceshadowcolor);
	this.drawRatioMeter();
};

/** @description Creating Ratio Meter which will draw with 240 degree only**/
DrawGauge.prototype.drawRatioMeter = function () {
	var startangle = [];
	var endAngle = [];
	var space = this.m_radius * 2.5 / 10;
	var eachNumberIndegree = (this.m_niddleMovementRef.maxvalue !== this.m_niddleMovementRef.minvalue) ? (240 / (this.m_niddleMovementRef.maxvalue - this.m_niddleMovementRef.minvalue)) : 0;
	for (var i = 0; i < this.ratio.length; i++) {
		if (i == 0)
			startangle[i] = Math.PI - (32 * Math.PI / 180);
		else
			startangle[i] = endAngle[i - 1];

		if (i == (this.ratio.length - 1))
			endAngle[i] = 2 * Math.PI + (32 * Math.PI / 180);
		else
			endAngle[i] = ((this.getRatioValue(this.ratio[i] * 1)) * eachNumberIndegree + 150) * Math.PI / 180;
		this.drawCircle(this.m_x * 1 + this.m_width / 2 * 1, this.m_y * 1 + this.m_height / 2 * 1, this.m_radius - space, startangle[i], endAngle[i], false, this.m_colors[i], this.m_radius / 5.2);
	}
};

/** @description Calculate Ratio **/
DrawGauge.prototype.getRatioValue = function (ratio) {
	if (ratio >= this.m_niddleMovementRef.minvalue && ratio <= this.m_niddleMovementRef.maxvalue) {
		return ratio - this.m_niddleMovementRef.minvalue;
	} else if (ratio >= this.m_niddleMovementRef.maxvalue) {
		return this.m_niddleMovementRef.maxvalue - this.m_niddleMovementRef.minvalue;
	} else if (ratio <= this.m_niddleMovementRef.minvalue) {
		return 0;
	}
};

/** @description Circle Drawing **/
DrawGauge.prototype.drawCircle = function (centeX, centerY, m_radius, startAngle, endAngle, dir, strokeStyle, lineWidth) {
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.strokeStyle = strokeStyle;
	this.ctx.fillStyle = strokeStyle;
	this.ctx.lineWidth = lineWidth;
	this.ctx.arc(centeX, centerY, m_radius, startAngle, endAngle, dir);
	if (lineWidth == null){
		this.ctx.fill();
	}
	this.ctx.stroke();
	this.ctx.closePath();
	this.ctx.restore();
};

/** @description Inner Circle Drawing **/
DrawGauge.prototype.Innercircle = function () {
	var colorMiddle = hex2rgb("#A2A4A4", 0.9);
	var color = convertColorToHex(this.m_niddleMovementRef.m_gaugeRef.m_centercolor);
	var rad = this.ctx.createLinearGradient(this.m_x + this.m_width / 2 - 5, this.m_y + this.m_height / 2 - 5, this.m_x + this.m_width / 2 + 2, parseInt(this.m_y) + parseInt(this.m_height) / 2 + 5);
	rad.addColorStop(0, color);
	rad.addColorStop(0.5, colorMiddle);
	rad.addColorStop(1, color);

	this.drawCircle(this.m_x * 1 + this.m_width / 2 * 1, this.m_y * 1 + this.m_height / 2 * 1, this.m_radius / 20, 0, Math.PI * 2, false, color, this.m_radius / 6);
	this.drawCircle(this.m_x * 1 + this.m_width / 2 * 1, this.m_y * 1 + this.m_height / 2 * 1, this.m_radius / 25, 0, Math.PI * 2, false, "#ffffff", this.m_radius / 6);
	this.drawCircle(this.m_x * 1 + this.m_width / 2 * 1, this.m_y * 1 + this.m_height / 2 * 1, this.m_radius / 30, 0, Math.PI * 2, false, color, this.m_radius / 6);
	//this.ctx.stroke();
};

/** @description Creating Watch Stick **/
DrawGauge.prototype.drawWatchStick = function () {
	if (IsBoolean(this.m_niddleMovementRef.m_gaugeRef.m_showticks) && this.m_niddleMovementRef.m_gaugeRef.m_tickcount > 0) {
		var angle = 150;
		for (var i = 0; i <= this.m_niddleMovementRef.m_gaugeRef.m_tickcount; i++) {
			this.drawWatchStickMarker(angle * Math.PI / 180);
			angle = angle * 1 + (240/this.m_niddleMovementRef.m_gaugeRef.m_tickcount);
		}
	}
};

/** @description Creating Target Mark on the Ratio Meter**/
DrawGauge.prototype.drawWatchStickMarker = function (angle) {
	this.ctx.beginPath();
	this.ctx.lineWidth = (this.m_radius * 2) / 100;
	this.ctx.strokeStyle = "";
	var stickStartPoint = this.m_radius * 11 / 32.55; // it is same as the start point of the alerts color.
	var stickEndPoint = stickStartPoint + this.m_radius / 5 - this.m_radius / 2.7; // " this.m_radius/5 " is the width of the alerts color
	this.ctx.strokeStyle = convertColorToHex(this.m_niddleMovementRef.m_gaugeRef.m_tickscolor);
	this.ctx.moveTo(this.m_x * 1 + this.m_width / 2 * 1 + (this.m_radius - stickStartPoint) * Math.cos(angle), (this.m_radius - stickStartPoint) * Math.sin(angle) + this.m_y * 1 + this.m_height / 2 * 1);
	this.ctx.lineTo(this.m_x * 1 + this.m_width / 2 * 1 + (this.m_radius - stickEndPoint) * Math.cos(angle), (this.m_radius - stickEndPoint) * Math.sin(angle) + this.m_y * 1 + this.m_height / 2 * 1);
	this.ctx.stroke();
	this.ctx.closePath();
};

/** @description Creating Target Mark on the Ratio Meter**/
DrawGauge.prototype.drawTarget = function () {
	if (this.m_targetValueInDegree !== "" && !isNaN(this.m_targetValueInDegree) && this.m_niddleMovementRef.m_gaugeRef.m_targetvalue !== "") {
		if (this.m_niddleMovementRef.minvalue * 1 <= this.m_niddleMovementRef.m_gaugeRef.m_targetvalue * 1 && this.m_niddleMovementRef.maxvalue * 1 >= this.m_niddleMovementRef.m_gaugeRef.m_targetvalue * 1) {
			var targetAngle = this.m_targetValueInDegree * Math.PI / 180;
			var t1Angle = (this.m_targetValueInDegree + this.m_targetValueInDegree * 0.01) * Math.PI / 180;
			var t2Angle = (this.m_targetValueInDegree - this.m_targetValueInDegree * 0.01) * Math.PI / 180;
			var stickStartPoint = this.m_radius * 11 / 32.55;
			var stickEndPoint = stickStartPoint + this.m_radius / 5 - this.m_radius / 2.7;
			var x1 = this.m_x * 1 + this.m_width / 2 * 1 + (this.m_radius - stickStartPoint) * Math.cos(targetAngle);
			var y1 = (this.m_radius - stickStartPoint) * Math.sin(targetAngle) + this.m_y * 1 + this.m_height / 2 * 1;
			var x2 = this.m_x * 1 + this.m_width / 2 * 1 + (this.m_radius - stickEndPoint) * Math.cos(targetAngle);
			var y2 = (this.m_radius - stickEndPoint) * Math.sin(targetAngle) + this.m_y * 1 + this.m_height / 2 * 1;
			var midX = ( x1 + x2 ) / 2;
			var midY = ( y1 + y2 ) / 2;
			var t1X = this.m_x * 1 + this.m_width / 2 * 1 + (this.m_radius - stickEndPoint) * Math.cos(t1Angle);
			var t1Y = (this.m_radius - stickEndPoint) * Math.sin(t1Angle) + this.m_y * 1 + this.m_height / 2 * 1;
			var t2X = this.m_x * 1 + this.m_width / 2 * 1 + (this.m_radius - stickEndPoint) * Math.cos(t2Angle);
			var t2Y = (this.m_radius - stickEndPoint) * Math.sin(t2Angle) + this.m_y * 1 + this.m_height / 2 * 1;
			
			this.ctx.beginPath();
			this.ctx.lineDashOffset = 2;
			this.ctx.lineWidth = (this.m_radius * 1) / 100;
			this.ctx.fillStyle = convertColorToHex(this.m_niddleMovementRef.m_gaugeRef.m_targetcolor);
			this.ctx.moveTo(midX, midY);
			this.ctx.lineTo(t1X, t1Y);
			this.ctx.lineTo(t2X, t2Y);
			this.ctx.lineTo(midX, midY);
			this.ctx.fill();
			this.ctx.closePath();
			
			/*var targetAngle = this.m_targetValueInDegree * Math.PI / 180;
			var stickStartPoint = this.m_radius * 11 / 32.55;
			var stickEndPoint = stickStartPoint + this.m_radius / 5 - this.m_radius / 2.7;
			this.ctx.beginPath();
			this.ctx.setLineDash([2, 2]);
			this.ctx.lineDashOffset = 2;
			this.ctx.lineWidth = (this.m_radius * 3) / 100;
			this.ctx.strokeStyle = convertColorToHex(this.m_niddleMovementRef.m_gaugeRef.m_targetcolor);
			this.ctx.moveTo(this.m_x  1 + this.m_width / 2  1 + (this.m_radius - stickStartPoint)  Math.cos(targetAngle), (this.m_radius - stickStartPoint)  Math.sin(targetAngle) + this.m_y  1 + this.m_height / 2  1);
			this.ctx.lineTo(this.m_x  1 + this.m_width / 2  1 + (this.m_radius - stickEndPoint)  Math.cos(targetAngle), (this.m_radius - stickEndPoint)  Math.sin(targetAngle) + this.m_y  1 + this.m_height / 2  1);
			this.ctx.stroke();
			this.ctx.closePath();
			this.ctx.setLineDash([]);*/
		}
	}
};

/** @description Drawing Needle**/
DrawGauge.prototype.drawneedle = function () {
	//getting the points according to the new Degree
	var x = ((this.m_radius - 0 - this.m_radius * 2 / 5.5) * (Math.cos(this.m_newValueInDegree * Math.PI / 180)) + this.m_x * 1 + this.m_width / 2 * 1);
	var y = ((this.m_radius - 0 - this.m_radius * 2 / 5.5) * (Math.sin(this.m_newValueInDegree * Math.PI / 180)) + this.m_x * 1 + this.m_height / 2 * 1);

	var x1 = ((this.m_radius - 0 - this.m_radius * 2 / 3) * (Math.cos((this.m_newValueInDegree + 180) * Math.PI / 180)) + this.m_x * 1 + this.m_width / 2 * 1);
	var y1 = ((this.m_radius - 0 - this.m_radius * 2 / 3) * (Math.sin((this.m_newValueInDegree + 180) * Math.PI / 180)) + this.m_x * 1 + this.m_height / 2 * 1);

	var x2 = ((this.m_radius - 0 - this.m_radius * 2 / 2.2) * (Math.cos((this.m_newValueInDegree + 150) * Math.PI / 180)) + this.m_x * 1 + this.m_width / 2 * 1);
	var y2 = ((this.m_radius - 0 - this.m_radius * 2 / 2.2) * (Math.sin((this.m_newValueInDegree + 150) * Math.PI / 180)) + this.m_x * 1 + this.m_height / 2 * 1);

	var x3 = ((this.m_radius - 0 - this.m_radius * 2 / 2.2) * (Math.cos((this.m_newValueInDegree + 210) * Math.PI / 180)) + this.m_x * 1 + this.m_width / 2 * 1);
	var y3 = ((this.m_radius - 0 - this.m_radius * 2 / 2.2) * (Math.sin((this.m_newValueInDegree + 210) * Math.PI / 180)) + this.m_x * 1 + this.m_height / 2 * 1);

	this.ctx.beginPath();
	this.ctx.moveTo(x, y);
	this.ctx.lineTo(x2, y2);
	this.ctx.lineTo(x1, y1);
	this.ctx.lineTo(x3, y3);
	this.ctx.lineTo(x, y);
	this.ctx.fillStyle = convertColorToHex(this.m_niddleMovementRef.m_gaugeRef.m_pointercolor);
	this.ctx.strokeStyle = convertColorToHex(this.m_niddleMovementRef.m_gaugeRef.m_pointercolor);
	this.ctx.stroke();
	this.ctx.fill();
};

//---------------------------------------------------------------------------------------------

/** @description Creating Gauge Text Class**/
function GaugeText() {
	this.m_degrees = "";
	this.m_xArray = [];
	this.m_maxvalue = [];
	this.m_minvalue = [];
	this.m_niddleMovementRef;
	this.fontratio;
};

/** @description Initializing GaugeText class**/
GaugeText.prototype.init = function (niddleMovementRef) {
	this.ctx = niddleMovementRef.m_gaugeRef.ctx;
	this.m_objectid = niddleMovementRef.m_gaugeRef.m_objectid;
	this.m_niddleMovementRef = niddleMovementRef;
	this.m_x = this.m_niddleMovementRef.m_x;
	this.m_y = this.m_niddleMovementRef.m_y;
	this.m_width = this.m_niddleMovementRef.m_width;
	this.m_height = this.m_niddleMovementRef.m_height;
	this.m_maxvalue = this.m_niddleMovementRef.m_gaugeRef.m_maxvalue;
	this.m_minvalue = this.m_niddleMovementRef.m_gaugeRef.m_minvalue;
	this.fontratio = this.getFontSizeAccordingWidth();
	this.m_circleArc = "";
	this.radiobuttonPosition();
	this.rangeFontColor = convertColorToHex(this.m_niddleMovementRef.m_gaugeRef.m_rangefontcolor);
	this.m_fontColor = convertColorToHex(this.m_niddleMovementRef.m_gaugeRef.m_fontcolor);
};

/** @description Drawing of Value Text**/
GaugeText.prototype.drawText = function (degrees, data) {
	var temp = this;
	this.ctx.save();
	this.ctx.beginPath();
	this.m_degrees = degrees;

	var originalVal = data * 1;
	var x = this.m_x * 1 + this.m_width / 2 * 1 - this.m_niddleMovementRef.m_drawGauge.m_radius / 3.5 * 1;
	var y = this.m_y * 1 + this.m_height / 2 * 1 + this.m_niddleMovementRef.m_drawGauge.m_radius / 2.75;
	var width = this.m_niddleMovementRef.m_drawGauge.m_radius * 1 / 2;
	var height = this.m_niddleMovementRef.m_drawGauge.m_radius * 1 / 4;
	var id = "showValue" + this.m_objectid;
	var valuefontsize = this.m_niddleMovementRef.m_gaugeRef.m_fontsize * 1;
	var fontFamily = this.m_niddleMovementRef.m_gaugeRef.m_valuefontfamily;
	var valuefontColor = this.m_fontColor;
	var valueBox = this.setBox(x, y - 8, id, width, height, this.textformatter(data), fontFamily, valuefontsize, valuefontColor, originalVal);
	$("#draggableDiv" + temp.m_objectid).append(valueBox);

	var targetId = "TargetValue" + this.m_objectid;	
	var targetVal = (this.m_niddleMovementRef.m_gaugeRef.m_targetvalue !== "") ? this.m_niddleMovementRef.m_gaugeRef.m_targetvalue * 1 : " ";
	
	var targetBox = this.setBox(x, (y + width / 2) - 5, targetId, width, height, this.textformatter(targetVal), fontFamily, this.m_niddleMovementRef.m_gaugeRef.m_markerfontsize, this.m_niddleMovementRef.m_gaugeRef.m_rangefontcolor, "Target Value");
	$("#draggableDiv" + temp.m_objectid).append(targetBox);

	var titleId = "showTitle" + this.m_objectid;
	if (IsBoolean(this.m_niddleMovementRef.m_gaugeRef.m_showtitle)) {
		var x = this.m_x * 1 + this.m_width / 2 * 1 - this.m_niddleMovementRef.m_drawGauge.m_radius * 3 / 5 * 1;
		var y = this.m_y * 1 + this.m_height / 2 * 1 - this.m_niddleMovementRef.m_drawGauge.m_radius * 1 / 2 * 1;
		var width = this.m_niddleMovementRef.m_drawGauge.m_radius * 1 + this.m_niddleMovementRef.m_drawGauge.m_radius * 1 / 5;
		var height = this.m_niddleMovementRef.m_drawGauge.m_radius * 1 / 4;
		var titlefontsize = this.m_niddleMovementRef.m_gaugeRef.m_titlefontsize * 1;
		var titleText = this.m_niddleMovementRef.m_gaugeRef.formattedDescription(this.m_niddleMovementRef.m_gaugeRef, this.m_niddleMovementRef.m_gaugeRef.m_title);
		var titlefontfamily = this.m_niddleMovementRef.m_gaugeRef.m_titlefontfamily;
		var titlefontColor = convertColorToHex(this.m_niddleMovementRef.m_gaugeRef.m_titlefontcolor);
		var titleBox = this.setBox(x, y, titleId, width, height, titleText, titlefontfamily, titlefontsize, titlefontColor);
		$("#draggableDiv" + temp.m_objectid).append(titleBox);
	} else
		$("#" + titleId).remove();
	this.ctx.restore();
};

/** @description Creating Box inside which value will be display**/
GaugeText.prototype.setBox = function (x, y, id, width, height, data, fontfamily, fontsize, fontcolor, tooltipData) {
	$("#" + id).remove();
	var obj = document.createElement("div");
	obj.setAttribute("id", id);
	obj.style.position = "absolute";
	obj.style.zIndex = "1";
	obj.style.top = y + "px";
	obj.style.left = x + "px";
	obj.style.align = "center";

	var valueObj = document.createElement("span");
	/*if (tooltipData != undefined)
		valueObj.setAttribute("title", tooltipData);*/
	valueObj.style.width = width + "px";
	valueObj.style.height = height + "px";
	valueObj.style.fontSize = this.m_niddleMovementRef.m_gaugeRef.fontScaling(fontsize) + "px";
	valueObj.style.fontFamily = selectGlobalFont(fontfamily);
	valueObj.style.color = fontcolor;
	valueObj.style.verticalAlign = "middle";
	valueObj.style.textAlign = "center";
	valueObj.style.display = "TABLE-CELL";
	valueObj.style.position = "relative";
	valueObj.innerHTML = data;
	obj.appendChild(valueObj);
	obj = document.body.appendChild(obj);
	if(id.indexOf("TargetValue")>-1){
		//this.m_niddleMovementRef.m_gaugeRef.initMouseAndTouchEvent("#" + id);
		this.m_niddleMovementRef.m_gaugeRef.initMouseAndTouchEventSVC("#" + id);
	}
	return obj;
};

/** @description For displaying tool tip PLAT-112**/
Gauge.prototype.initMouseAndTouchEvent = function (comp){
	if (!IsBoolean(this.m_designMode)) {
		var temp = this;
		this.checkToolTipDesc = "Target Value";
		var mousemoveFn = function (e) {
			if (!temp.m_designMode && temp.m_tooltip != "" && temp.m_tooltip != " ") {
				e.stopPropagation();
				temp.removeToolTipDiv();
				//var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
				var parentDiv = document.body;
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
				//$(".draggablesParentDiv").append(tooltipDiv);
				$(document.body).append(tooltipDiv);
				
				/*	var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
					"top": divTop + "px",
					"left": divLeft + "px"
				});
				$(tooltipDiv).css(tooltipObjCss);*/
				
				var wd = temp.m_width * 1,
				ht = temp.m_height * 1;
				var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
					"top": e.pageY - e.offsetY + ht - PageTop - offsetTop - (temp.m_height/6) + "px",
					"left": e.pageX - e.offsetX - PageLeft - offsetLeft + 10 + "px"
				});
				//"top": temp.m_top + ht  - PageTop - offsetTop - 11 + "px",
				//"left": temp.m_left  - PageLeft - offsetLeft + 10 + "px"
				$(tooltipDiv).css(tooltipObjCss);
				//var lt =  temp.m_left + (wd/2) - (tooltipDiv.offsetWidth/2) - PageLeft - offsetLeft +5+ "px";
				var lt =  e.pageX - e.offsetX - (tooltipDiv.offsetWidth/2) + ($(comp)[0].offsetWidth/2 ) - PageLeft - 16 + "px";
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

/** @description Calculating FontSize according to the Gauge width height**/
GaugeText.prototype.getFontSizeAccordingWidth = function () {
	var containerWidth = this.m_niddleMovementRef.m_gaugeRef.m_width;
	var containerheight = this.m_niddleMovementRef.m_gaugeRef.m_height;
	var fontratio;
	if (containerWidth > containerheight)
		fontratio = containerheight / containerWidth;
	else
		fontratio = containerWidth / containerheight;
	return fontratio;
};

/** @description Calculating Radio Button Position**/
GaugeText.prototype.radiobuttonPosition = function () {
	if (this.m_width > this.m_height)
		this.m_circleArc = this.m_height / 2;
	else
		this.m_circleArc = this.m_width / 2;
};

/** @description Draw Min Radio Button**/
GaugeText.prototype.drawMinRadioButton = function () {
	this.setMintextPos();
	this.drawMinText(this, this.m_minvalue, this.m_objectid + "minradio");
};

/** @description Calculating Min Text Value position**/
GaugeText.prototype.setMintextPos = function () {
	var temp = this;
	var stickStartPoint = this.m_niddleMovementRef.m_drawGauge.m_radius - this.m_niddleMovementRef.m_drawGauge.m_radius * 1 / 4;
	var left = this.m_x * 1 + this.m_width / 2 * 1 + (stickStartPoint) * Math.cos(148 * Math.PI / 180);
	var top = this.m_y * 1 + this.m_height / 2 * 1 + (stickStartPoint) * Math.sin(148 * Math.PI / 180);
	var id = "mintext" + this.m_objectid;
	var obj = this.createDiv(left, top, id);
	obj.style.textAlign = "left";
	$("#draggableDiv" + temp.m_objectid).append(obj);
};

/** @description Drawing of Min Text**/
GaugeText.prototype.drawMinText = function (thisradio, val, id) {
	var temp = this;
	var fontColor = (this.m_niddleMovementRef.m_gaugeRef.m_rangefontcolor !== "") ? temp.rangeFontColor : temp.m_fontColor;
	var newtext = this.textformatter(val);
	document.getElementById("mintext" + this.m_objectid).innerHTML = "<font color='" + fontColor + "'>" + " " + newtext + "</font>";
};

/** @description Drawing of Max Radio Button**/
GaugeText.prototype.drawMaxRadioButton = function () {
	var x = this.m_x * 1 + this.m_width / 2 * 1 + this.m_niddleMovementRef.m_drawGauge.m_radius / 2 * 1;
	this.setMaxtextPos();
	this.Maxvalue(this, this.m_maxvalue, this.m_objectid + "maxradio", x);
};

/** @description Calculating Max Value Text position**/
GaugeText.prototype.setMaxtextPos = function () {
	var temp = this;
	var stickStartPoint = this.m_niddleMovementRef.m_drawGauge.m_radius - this.m_niddleMovementRef.m_drawGauge.m_radius * 1 / 4;
	var right = this.m_x * 1 + this.m_width / 2 * 1 - (stickStartPoint) * Math.cos(32 * Math.PI / 180);
	var top = this.m_y * 1 + this.m_height / 2 * 1 + (stickStartPoint) * Math.sin(32 * Math.PI / 180);
	var id = "maxtext" + this.m_objectid;
	var obj2 = this.createDiv("", top, id);
	obj2.style.right = right + "px";
	$("#draggableDiv" + temp.m_objectid).append(obj2);
};

/** @description Formatted the value and appended to the Max Value Containing Div **/
GaugeText.prototype.Maxvalue = function (thisradio, val, id, x) {
	var temp = this;
	var fontColor = (this.m_niddleMovementRef.m_gaugeRef.m_rangefontcolor !== "") ? temp.rangeFontColor : temp.m_fontColor;
	var newtext = this.textformatter(val);
	$("#maxtext" + this.m_objectid).css("text-align", "right");
	document.getElementById("maxtext" + this.m_objectid).innerHTML = "<font color='" + fontColor + "'>" + " " + newtext + "</font>";
};

/** @description Create Div**/
GaugeText.prototype.createDiv = function (x, y, id) {
	var width = this.m_niddleMovementRef.m_drawGauge.m_radius * 7 / 10;
	var height = this.m_niddleMovementRef.m_drawGauge.m_radius * 1 / 4;
	var fontSize = (this.m_niddleMovementRef.m_gaugeRef.m_markerfontsize !== "") ? this.m_niddleMovementRef.m_gaugeRef.m_markerfontsize * 1 : this.m_niddleMovementRef.m_gaugeRef.m_fontsize * 1;
	var fontFamily = this.m_niddleMovementRef.m_gaugeRef.m_valuefontfamily;
	$("#" + id).remove();
	if (fontSize * 1 > 15)
		y = y - 5;
	var obj = document.createElement("div");
	obj.setAttribute("id", id);
	obj.style.position = "absolute";
	obj.style.zIndex = "1";
	obj.style.top = y + "px";
	obj.style.left = x + "px";
	obj.style.width = width + "px";
	obj.style.height = height + "px";
	obj.style.fontFamily = fontFamily;
	obj.style.fontSize = this.m_niddleMovementRef.m_gaugeRef.fontScaling(fontSize) + "px";
	return obj;
};

/** @description Adding Formatter to the text**/
GaugeText.prototype.textformatter = function (text) {
	this.setFormatter();
	this.setSecondaryFormatter();	
	return this.getFormattedText(text);
};

GaugeText.prototype.setFormatter = function () {
	this.m_unitSymbol = "";
	this.m_formatterPosition = "";
	this.m_isFormatter = false;
	if (this.m_niddleMovementRef.m_gaugeRef.m_formater != "none" && this.m_niddleMovementRef.m_gaugeRef.m_formater != "") {
		var formatter = this.m_niddleMovementRef.m_gaugeRef.m_formater;
		var unit = this.m_niddleMovementRef.m_gaugeRef.m_unit;
		if (unit != "none" && unit != "") {
			this.m_isFormatter = true;
			this.m_unitSymbol = this.getFormatterSymbol(formatter, unit);
			this.m_formatterPosition = this.m_niddleMovementRef.m_gaugeRef.m_signposition;
			if (this.m_formatterPosition == "") {
				this.m_formatterPosition = "suffix";
			}
		}
	}
};
GaugeText.prototype.setSecondaryFormatter = function () {
	this.m_secondaryUnitSymbol = "";
	this.m_secondaryFormatterPosition = "";
	this.m_isSecondaryFormatter = false;
//	if(this.m_chart.m_secondaryformater != "none" && this.m_chart.m_secondaryformater != "" && this.m_chart.getSecondaryUnit() != "Percent")
	if (this.m_niddleMovementRef.m_gaugeRef.m_secondaryformater  != "none" && this.m_niddleMovementRef.m_gaugeRef.m_secondaryformater  != ""){
		/** remove condition for Percent because secondary formatter is not working for % **/
		var secondaryFormatter = this.m_niddleMovementRef.m_gaugeRef.m_secondaryformater;
		var secondaryUnit = this.m_niddleMovementRef.m_gaugeRef.m_secondaryunit;
		if (secondaryUnit != "" && secondaryUnit != "none" && secondaryUnit != undefined) {
			this.m_isSecondaryFormatter = true;
			this.m_secondaryUnitSymbol = this.getFormatterSymbol(secondaryFormatter, secondaryUnit);
		}
		this.m_secondaryFormatterPosition = "suffix";
	}	
};
GaugeText.prototype.getFormattedText = function (text) {
	var precision = (this.m_niddleMovementRef.m_gaugeRef.m_precision == "undefined" || this.m_niddleMovementRef.m_gaugeRef.m_precision == undefined) ? this.m_niddleMovementRef.m_gaugeRef.m_precision :this.m_niddleMovementRef.m_gaugeRef.m_precision;
	if (text % 1 != 0 && precision < 1) {
		text = this.setPrecision(text, 0);
	} else if (!IsBoolean(this.m_isFormatter) && !IsBoolean(this.m_isSecondaryFormatter)) {
		if(precision !== "default")
		text = this.setPrecision(text, precision);
	}
	if ((this.m_niddleMovementRef.m_gaugeRef.m_formater == "none" || this.m_niddleMovementRef.m_gaugeRef.m_formater == "") && (this.m_niddleMovementRef.m_gaugeRef.m_secondaryformater == "none" || this.m_niddleMovementRef.m_gaugeRef.m_secondaryformater == "")) {
		text = this.setPrecision(text, precision);
	}
	if (IsBoolean(this.m_isFormatter)) {
		text = this.updateTextWithFormatter(text, this.m_unitSymbol, precision);
	}
	if (IsBoolean(this.m_isSecondaryFormatter) && this.m_niddleMovementRef.m_gaugeRef.m_secondaryformater == "Number") {
		text = this.updateTextWithFormatter(text, this.m_secondaryUnitSymbol, precision);
	}
	if (IsBoolean(this.m_isSecondaryFormatter)) {
		if (this.m_secondaryUnitSymbol != "auto") {
			text = this.addSecondaryFormater(text, this.m_secondaryUnitSymbol);
		} else {
			var symbol = getNumberFormattedSymbol(text * 1);
			var val = getNumberFormattedNumericValue(text * 1, precision);
			text = this.setPrecision(val, precision);
			text = this.addSecondaryFormater(text, symbol);
		}
	}
	if (IsBoolean(this.m_isFormatter) && this.m_unitSymbol != undefined) {
		text = this.addFormatter(text, this.m_unitSymbol, this.m_formatterPosition, precision);
	}

	return text;
};
GaugeText.prototype.setPrecision = function (text, precision) {
	if(text !== 0){
		if(precision !== "default") {
			return (text * 1).toFixed(precision);
		} else {
			return (text * 1);
		}
	}else{
		return (text * 1);
	}
};
GaugeText.prototype.getFormatterSymbol = function (formatter, unit) {
	var unitSymbol = "";
	try {
		eval("unitSymbol = this.get" + formatter + "Symbol(unit);");
	} catch (e) {
		return unitSymbol;
	}
	return unitSymbol;
};
GaugeText.prototype.getCurrencySymbol = function (unit) {
	switch (unit.toLowerCase()) {
	case "cent":
		return "\u00A2";
	case "euro":
		return "\u20ac";
	case "ind":
		return "Rs.";
	case "rupees":
		return "\u20B9";
	case "pound":
		return "\u00A3";
	case "usd":
		return "\u0024";
	case "yen":
		return "\u00a5";
	default:
		return "";
	}
	return "";
};
GaugeText.prototype.getNumberSymbol = function (unit) {
	switch (unit.toLowerCase()) {
	case "percent":
		return "%";
	case "auto":
		return "auto";
	case "thousand":
		return "K";
	case "thousands":
		return "K";
	case "million":
		return "M";
	case "millions":
		return "M";
	case "billion":
		return "B";
	case "billions":
		return "B";
	case "trillion":
		return "T";
	case "trillions":
		return "T";
	case "quadrillion":
		return "Q";
	case "quadrillions":
		return "Q";
	case "lac":
		return "Lacs";
	case "crore":
		return "Cr";
	default:
		return "";
	}
	return "";
};
GaugeText.prototype.updateTextWithFormatter = function (text, unit, precision) {
	var value = text;
	switch (unit) {
	case "K":
		value = text * 1 / 1000;
		break;
	case "M":
		value = text * 1 / 1000000;
		break;
	case "B":
		value = text * 1 / 1000000000;
		break;
	case "T":
		value = text * 1 / 1000000000000;
		break;
	case "Q":
		value = text * 1 / 1000000000000000;
		break;
	case "Lacs":
		value = text * 1 / 100000;
		break;
	case "Cr":
		value = text * 1 / 10000000;
		break;
	default:
		value = text * 1;
		break;
	}
	if(value !== 0){
		if (precision !== "default") {
		    return (value * 1).toFixed(precision);
		} else {
		    return value * 1;
		}
	}else{
		return value * 1 ;
	}
};
GaugeText.prototype.addSecondaryFormater = function (text, secondaryUnitSymbol) {
	var textValue = text;
	if (this.m_niddleMovementRef.m_gaugeRef.m_precision != 0 && this.m_niddleMovementRef.m_gaugeRef.m_precision != null){
		textValue = this.setPrecision(textValue, this.m_niddleMovementRef.m_gaugeRef.m_precision);
	}else if (textValue < 1 && textValue % 1 != 0){
		textValue = this.setPrecision(textValue, 2);
	}
	var formattedText = this.getSecondaryFormaterAddedText(textValue, secondaryUnitSymbol);
	return formattedText.toString();
};
GaugeText.prototype.getSecondaryFormaterAddedText = function (textValue, secondaryUnitSymbol) {
	var formattedText = textValue;
	try {
		eval("var formattedText = this.addUnitAs" + this.m_secondaryFormatterPosition + "(textValue,secondaryUnitSymbol);");
	} catch (e) {
		return formattedText;
	}
	return formattedText;
};
GaugeText.prototype.addUnitAssuffix = function (text, unitSymbol) {
	return text + unitSymbol;
};
GaugeText.prototype.addUnitAsprefix = function (text, unitSymbol) {
	return unitSymbol + text;
};
GaugeText.prototype.addFormatter = function (text, unitSymbol, signPosition) {
	try {
		eval("text = this.addUnitAs" + signPosition + "( text , unitSymbol )");
	} catch (e) {
		return text;
	}
	return text;
};
//# sourceURL=Gauge.js