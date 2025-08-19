/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: Rectangle.js
 * @description Box component
 **/
function Rectangle(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();
	/** @description Creating Global Variables which will be used in further processing**/
	this.m_borderthickness = "";
	this.m_width = "";
	this.m_bordercolor = "";
	this.m_alpha = "";
	this.m_height = "";
	this.m_x;
	this.m_y;
	this.m_gradients = "";
	this.m_borderalpha = "1";
	this.m_gradientrotation = "";
	this.m_globalkey = "";
	this.m_fieldvalue = "";
	this.m_borderradius = 0;

	this.m_gradientColorArr = [];
	this.gradientCoords = [];

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
};

/** @description Using Prototype , inheriting the class variable and methods of Widget class into the Rectangle Class**/
Rectangle.prototype = new Widget();

/** @description This method will parse the chart JSON and create a container **/
Rectangle.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Iterate through Rectangle JSON and set class variable values with JSON values **/
Rectangle.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "Rectangle") {
			for (var rectangleKey in jsonObject[key]) {
				this.setAttributeValueToNode(rectangleKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

/** @description if already present remove and create new canvas**/
Rectangle.prototype.initCanvas = function () {
	var temp = this;
	$("#" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description Creating DraggableDiv ,canvas and initializing mouse click event**/
Rectangle.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseClickEvent();
};

/** @description Creating Component ID**/
Rectangle.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = this.m_objectid;
};

/** @description Initializing Rectangle and creating Gradient color**/
Rectangle.prototype.init = function () {
	if (this.m_gradients != undefined) {
		this.m_GradientColors = this.m_gradients.split(",");
		for (var i = 0; i < this.m_GradientColors.length; i++) {
			var hexColor = convertColorToHex(this.m_GradientColors[i]);
			this.m_GradientColors[i] = hex2rgb(hexColor, this.m_alpha);
		}
	}
	this.gradientCoords = this.calculateGradientCoordinates(this.m_gradientrotation);
};

/** @description Calculating Gradient Coordinates **/
Rectangle.prototype.calculateGradientCoordinates = function (GradientAngle) {
	var gradientCoords = [];

	var x1 = this.m_x;
	var y1 = this.m_y;
	var x2 = this.m_width;
	var y2 = this.m_y;

	var angle = GradientAngle;

	if (angle < 0) {
		angle = GradientAngle % 360;
		angle = angle * 1 + 360;
	}
	if (angle >= 0 && angle <= 45) {
		var sinAngle = angle - 0;
		x1 = this.m_x;
		y1 = this.m_y;
		x2 = this.m_x * 1 + this.m_width * 1;
		y2 = this.m_y * 1 + this.m_height * 1 * Math.sin(sinAngle * Math.PI / 180 * 2);
	} else if (angle > 45 && angle <= 90) {
		var sinAngle = angle - 45;
		x1 = this.m_x;
		y1 = this.m_y;
		x2 = this.m_x * 1 + this.m_width * 1 - this.m_width * 1 * Math.sin(sinAngle * Math.PI / 180 * 2);
		y2 = this.m_height;
	} else if (angle > 90 && angle <= 135) {
		var sinAngle = angle - 90;
		x1 = this.m_x * 1 + this.m_width * 1 * Math.sin(sinAngle * Math.PI / 180 * 2);
		y1 = this.m_y;
		x2 = this.m_x;
		y2 = this.m_height;
	} else if (angle > 135 && angle <= 180) {
		var sinAngle = angle - 135;
		x1 = this.m_width;
		y1 = this.m_y;
		x2 = this.m_x;
		y2 = this.m_y * 1 + this.m_height * 1 - this.m_height * 1 * Math.sin(sinAngle * Math.PI / 180 * 2);
	} else if (angle > 180 && angle <= 225) {
		var sinAngle = angle - 180;
		x1 = this.m_width;
		y1 = this.m_y * 1 + this.m_height * Math.sin(sinAngle * Math.PI / 180 * 2);
		x2 = this.m_x;
		y2 = this.m_y;
	} else if (angle > 225 && angle <= 270) {
		var sinAngle = angle - 225;
		x1 = this.m_x * 1 + this.m_width * 1 - this.m_width * 1 * Math.sin(sinAngle * Math.PI / 180 * 2);
		y1 = this.m_y * 1 + this.m_height * 1;
		x2 = this.m_x;
		y2 = this.m_y;
	} else if (angle > 270 && angle <= 325) {
		var sinAngle = angle - 270;
		x1 = this.m_x;
		y1 = this.m_y * 1 + this.m_height * 1;
		x2 = this.m_x * 1 + this.m_width * Math.sin(sinAngle * Math.PI / 180 * 2);
		y2 = this.m_y;
	} else if (angle > 325 && angle <= 360) {
		var sinAngle = angle - 325;
		x1 = this.m_x;
		y1 = this.m_y * 1 + this.m_height * 1 - this.m_height * Math.sin(sinAngle * Math.PI / 180 * 2);
		x2 = this.m_x * 1 + this.m_width * 1;
		y2 = this.m_y * 1;
	}
	gradientCoords[0] = x1;
	gradientCoords[1] = y1;
	gradientCoords[2] = x2;
	gradientCoords[3] = y2;
	return gradientCoords;
};

/** @description Starting of draw method calling**/
Rectangle.prototype.draw = function () {
	this.drawObject();
};

/** @description Calling init and drawchart**/
Rectangle.prototype.drawObject = function () {
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback!="")
		onAfterRender(this.m_onafterrendercallback);
};

/** @description Start Drawing**/
Rectangle.prototype.drawChart = function () {
	this.drawRectangle();
};

/** @description Creating Rectangle **/
Rectangle.prototype.drawRectangle = function () {
	var temp = this;
	this.ctx.clearRect(0, 0, this.m_width * 1, this.m_height * 1);
	this.ctx.beginPath();
	//this.ctx.fillStyle = hex2rgb(convertColorToHex(this.m_bordercolor), this.m_borderalpha);
	this.ctx.lineWidth = this.m_borderthickness;
	/**DAS-743 not showing gradient color in designmode */
	this.ctx.fillStyle=this.m_GradientColors[0];
	if (!IsBoolean(this.m_designMode)){
		this.ctx.fillStyle = this.getBackgroundGradient();
	}
	this.ctx.rect(this.m_x, this.m_y, this.m_width * 1, this.m_height * 1);
	this.ctx.fill();
	this.ctx.closePath();
	$("#draggableDiv"+temp.m_componentid).css({
		"border-radius": this.m_borderradius+"px", 
		"border": this.m_borderthickness+"px solid "+this.m_bordercolor
	});
};

/** @description Filling Horizontal Gradient**/
Rectangle.prototype.fillHorizontalByPercentage = function (widthPercentage) {
	this.ctx.clearRect(0, 0, this.m_width * 1, this.m_height * 1);
	this.ctx.beginPath();
	this.ctx.fillStyle = this.getBackgroundGradient();
	this.ctx.lineWidth = this.m_borderthickness;
	this.ctx.strokeStyle = convertColorToHex(this.m_bordercolor);
	var currentWidth = parseInt(this.m_width);
	var wd = (widthPercentage / 100) * currentWidth;

	this.ctx.rect(this.m_x, this.m_y, wd * 1, this.m_height * 1);
	this.ctx.fill();
	this.ctx.stroke();
	this.ctx.closePath();
};

/** @description Filling Vertical Gradient **/
Rectangle.prototype.fillVerticalByPercentage = function (heightPercentage) {
	this.ctx.clearRect(0, 0, this.m_width * 1, this.m_height * 1);
	this.ctx.beginPath();
	this.ctx.fillStyle = this.getBackgroundGradient();
	this.ctx.lineWidth = this.m_borderthickness;
	this.ctx.strokeStyle = convertColorToHex(this.m_bordercolor);
	var currentHeight = parseInt(this.m_height);
	var ht = (heightPercentage / 100) * currentHeight;

	this.ctx.rect(this.m_x, this.m_height - ht, this.m_width * 1, ht);
	this.ctx.fill();
	this.ctx.stroke();
	this.ctx.closePath();
};

/** @description Divided the Area into vertical stacks filling one by one stack**/
Rectangle.prototype.fillVerticalStack = function (values, colors) {
	this.ctx.clearRect(0, 0, this.m_width * 1, this.m_height * 1);
	this.createVSlices(values, colors);
};

/** @description Divided the Area into Horizontal Stack and filling one by one Stack **/
Rectangle.prototype.fillHorizontalStack = function (values, colors) {
	this.ctx.clearRect(0, 0, this.m_width * 1, this.m_height * 1);
	this.createHSlices(values, colors);
};

/** @description filling vertical stacks**/
Rectangle.prototype.createVSlices = function (values, colors) {
	var slices = [];
	var sum = 0;
	$.each(values, function () {
		sum += parseInt(this) || 0;
	});
	var cy = 0;
	for (var i = 0; i < values.length; i++) {
		var val = parseInt(values[i]);
		var cht = val * this.m_height / sum;
		this.ctx.fillStyle = colors[i];
		this.ctx.fillRect(this.m_x, cy, this.m_width, cht * 1);
		cy += cht * 1;
	}
	return slices;
};

/** @description filling Horizontal stacks**/
Rectangle.prototype.createHSlices = function (values, colors) {
	var slices = [];
	var sum = 0;
	$.each(values, function () {
		sum += parseInt(this) || 0;
	});
	var cx = 0;
	for (var i = 0; i < values.length; i++) {
		var val = parseInt(values[i]);
		var cwd = val * this.m_width / sum;
		this.ctx.fillStyle = colors[i];
		this.ctx.fillRect(cx, this.m_y, cwd * 1, this.m_height);
		cx += cwd * 1;
	}
	return slices;
};

/** @description Getter for Background Gradient**/
Rectangle.prototype.getBackgroundGradient = function () {
	var grd = this.ctx.createLinearGradient(this.gradientCoords[0], this.gradientCoords[1], this.gradientCoords[2], this.gradientCoords[3] * 2);
	for (var i = 0; i < this.m_GradientColors.length; i++) {
		var color = this.m_GradientColors[i];
		var colorStop = i / (this.m_GradientColors.length);
		grd.addColorStop(colorStop, color);
	}
	return grd;
};

/** @description Creating Map and storing fieldvalue and called for update data points**/
Rectangle.prototype.getDataPointAndUpdateGlobalVariable = function () {
	//	if(this.m_fieldvalue!=""){
	var fieldNameValueMap = {};
	var fieldname = (this.m_fieldname == "" || this.m_fieldname == undefined) ? "Value" : this.m_fieldname;
	fieldNameValueMap[fieldname] = this.m_fieldvalue;
	this.updateDataPoints(fieldNameValueMap);
	//	}
};
//# sourceURL=Rectangle.js