/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: ProgressChart.js
 * @description ProgressChart
 **/
function ProgressChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();
	this.m_x = 400;
	this.m_y = 240;
	this.m_width = 300;
	this.m_height = 240;
	this.m_radius = 0;
	this.m_centerX = 0;
	this.m_centerY = 0;

	this.m_showtext = true;
	this.m_percent = "70";
	this.m_basecolor = "#C8F7C5";
	this.m_valuecolor = "#663399";
	this.m_linewidth = "10";
	this.m_linecap = "round";
	this.m_charttype = "circle";
	this.m_tooltiptitle = "Percent";

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
};
/** @description Making prototype of chart class to inherit its properties and methods into ProgressChart chart **/
ProgressChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
ProgressChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Setter Method of DataProvider **/
ProgressChart.prototype.setDataProvider = function (m_dataProvider) {
	if (typeof(m_dataProvider) != "Array")
		this.m_dataProvider = this.m_percent = m_dataProvider;
	else
		this.m_dataProvider = m_dataProvider;
};

/** @description  initialization of draggable div and its inner Content **/
ProgressChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
ProgressChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description This method will set class variable values with JSON values **/
ProgressChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "Chart") {
			for (var chartKey in jsonObject[key]) {
				switch (chartKey) {
				case "Title":
					for (var titleKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(titleKey);
						nodeObject.m_title[propertyName] = jsonObject[key][chartKey][titleKey];
					}
					break;
				case "SubTitle":
					for (var subTitleKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(subTitleKey);
						nodeObject.m_subTitle[propertyName] = jsonObject[key][chartKey][subTitleKey];
					}
					break;
				default:
					var propertyName = this.getNodeAttributeName(chartKey);
					nodeObject[propertyName] = jsonObject[key][chartKey];
					break;
				}
			}
		} else {
			var propertyName = this.getNodeAttributeName(key);
			nodeObject[propertyName] = jsonObject[key];
		}
	}
};

/** @description Starting of ProgressChart Drawing **/
ProgressChart.prototype.drawObject = function () {
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback != ""){
		onAfterRender(this.m_onafterrendercallback);
	}
};

/** @description Calling init and calculating radius **/
ProgressChart.prototype.init = function () {
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);

	this.centerXCalcalculation();
	this.centerYCalcalculation();
	this.radiusCalculation();

	this.m_isEmptySeries = false;
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};
/** @description Getter Method of StartX. **/
ProgressChart.prototype.getStartX = function () {
	return this.m_x;
};
/** @description Getter Method of StartY. **/
ProgressChart.prototype.getStartY = function () {
	return this.m_y * 1 + this.m_height;
};
/** @description Getter Method of EndX. **/
ProgressChart.prototype.getEndX = function () {
	return this.m_x * 1 + this.m_width / 2;
};
/** @description Getter Method of EndY. **/
ProgressChart.prototype.getEndY = function () {
	return this.m_y;
};
/** @description This method is calculating centerX point. **/
ProgressChart.prototype.centerXCalcalculation = function () {
	this.availableWidth = this.m_width;
	this.centerX = (this.m_width) / 2;
};
/** @description This method is calculating centerY point according to the height. **/
ProgressChart.prototype.centerYCalcalculation = function () {
	this.availableHeight = this.m_height - this.getTotalMarginForTitleSubtitle();
	this.centerY = (this.availableHeight) / 2 + this.getTotalMarginForTitleSubtitle();
};

/** @description Getter Method of Margin For Title. **/
ProgressChart.prototype.getMarginForTitle = function () {
	return (IsBoolean(this.getShowGradient()) || IsBoolean(this.getTitle().m_showtitle)) ? (this.getTitleBarHeight() * 1 + 15) : 0;
};
/** @description Getter Method of Margin For ProgressChart. **/
ProgressChart.prototype.getMarginForProgressChart = function () {
	return 10;
};

/** @description Getter method For calculate the total margin. **/
ProgressChart.prototype.getTotalMarginForTitleSubtitle = function () {
	return (this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};

/** @description Getter method For Margin subTitle. **/
ProgressChart.prototype.getMarginForSubTitle = function () {
	return (IsBoolean(this.m_subTitle.m_showsubtitle) && (this.m_subTitle.getDescription() != "")) ? (this.m_subTitle.getFontSize() * 1.5) + ((this.m_subTitle.m_formattedDescription.length == 3) ? 20 : 0) : 0;
};

/** @description Calculating the radius for progress chaart. **/
ProgressChart.prototype.radiusCalculation = function () {
	this.radius = Math.abs(((this.availableWidth >= this.availableHeight) ? this.availableHeight / 2 : this.availableWidth / 2) - this.m_linewidth);
};

/** @description will draw the ChartFrame  of the progress chaart. **/
ProgressChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};
/** @description Will Draw Title on canvas if showTitle set to true. **/
ProgressChart.prototype.drawTitle = function () {
	this.m_title.draw();
};
/** @description Will Draw SubTitle on canvas. **/
ProgressChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};
/** @description Drawing of chart started by drawing different parts of chart like ChartFrame,Title,SubTitle. **/
ProgressChart.prototype.drawChart = function () {
	this.ctx.clearRect(this.m_x, this.m_y, this.m_width, this.m_height);
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();

	this.checkInValidPercent();
	this.setTextWidth();
	switch (this.m_charttype) {
	case "HBar":
		this.setBarHeightYPosition();
		this.drawHProgressBar();
		break;
	case "VBar":
		this.setBarHeightYPosition();
		this.drawVProgressBar();
		break;
	default:
		this.drawProgressCircle();
		break;
	}
};
/** @description This method will set Bar Height and Y position. **/
ProgressChart.prototype.setBarHeightYPosition = function () {
	var topMargin = this.getTotalMarginForTitleSubtitle() - this.getMarginForProgressChart() * 0;
	this.m_barHeight = this.m_height - topMargin;
	this.yPos = this.m_y + topMargin;
};
/** @description This method will check percent valid or not. **/
ProgressChart.prototype.checkInValidPercent = function () {
	if (isNaN(this.m_percent) || this.m_percent === null || this.m_percent === "null" || this.m_percent === undefined || this.m_percent === "" || this.m_percent === "none" || this.m_percent === "None") {
		this.m_percent = NaN;
	}
};
/** @description This method will check percent valid or not. **/
ProgressChart.prototype.setTextWidth = function () {
	var text = (this.m_percent * 1).toFixed(this.m_precision * 1) + "%";
	this.ctx.font = this.m_fontstyle + " " + this.m_fontweight + " " + this.fontScaling(this.m_fontsize * 1) + "px " + selectGlobalFont(this.m_fontfamily);
	this.m_textWidth = this.ctx.measureText(text).width;
};
/** @description Will draw HProgressBar. **/
ProgressChart.prototype.drawHProgressBar = function () {
	this.drawRect(this.m_x, this.yPos, this.m_width, this.m_barHeight, this.m_basecolor);
	this.drawRect(this.m_x, this.yPos, this.m_width * this.m_percent / 100, this.m_barHeight, this.m_valuecolor);
	this.drawText(this.m_x + this.m_width / 2 - this.m_textWidth / 2, this.yPos + this.m_barHeight / 2);
};
/** @description Will draw VProgressBar. **/
ProgressChart.prototype.drawVProgressBar = function () {
	this.drawRect(this.m_x, this.yPos, this.m_width, this.m_barHeight, this.m_basecolor);
	this.drawRect(this.m_x, this.yPos + this.m_barHeight * (100 - this.m_percent) / 100, this.m_width, this.m_barHeight, this.m_valuecolor);
	this.drawText(this.m_x + this.m_width / 2 - this.m_textWidth / 2, this.yPos + this.m_barHeight / 2);
};
/** @description Will draw Rectangle. **/
ProgressChart.prototype.drawRect = function (x, y, w, h, color) {
	this.ctx.beginPath();
	this.ctx.fillStyle = hex2rgb(color,this.m_coloropacity);
	this.ctx.rect(x, y, w, h);
	this.ctx.fill();
	this.ctx.closePath();
};
/** @description Will draw Progress Circle. **/
ProgressChart.prototype.drawProgressCircle = function () {
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.translate(this.centerX, this.centerY); // change center
	this.ctx.rotate((-1 / 2 + 0 / 180) * Math.PI); // rotate -90 deg
	this.drawCircle(this.m_basecolor, 1);
	if (!isNaN(this.m_percent) && this.m_percent >= 0)
		this.drawCircle(this.m_valuecolor, this.m_percent / 100);
	else
		console.log("Percent number is not valid")
	this.ctx.restore();
	this.drawText((this.centerX - this.m_textWidth / 2), (this.centerY * 1));
	this.ctx.closePath();
};
/** @description Will draw Text. **/
ProgressChart.prototype.drawText = function (x, y) {
	try {
		if (IsBoolean(this.m_showtext)) {
			var text = (this.m_percent * 1).toFixed(this.m_precision * 1) + ((!isNaN(this.m_percent)) ? "%" : "");
			this.ctx.beginPath();
			this.ctx.textAlign = "left";
			this.ctx.fillStyle = convertColorToHex(this.m_fontcolor);
			this.ctx.font = this.m_fontstyle + " " + this.m_fontweight + " " + this.fontScaling(this.m_fontsize * 1) + "px " + selectGlobalFont(this.m_fontfamily);
			this.ctx.fillText(text, x, y);
			this.ctx.closePath();
		}
	} catch (e) {
		console.log(e);
	}
};
/** @description Will draw Circle. **/
ProgressChart.prototype.drawCircle = function (color, m_percent) {
	var percent = Math.min(Math.max(0, m_percent || 0.00001), 1);
	this.ctx.beginPath();
	this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2 * percent, false);
	this.ctx.strokeStyle = hex2rgb(color,this.m_coloropacity);
	this.ctx.lineCap = this.m_linecap; // butt, round or square
	this.ctx.lineWidth = this.m_linewidth;
	this.ctx.stroke();
};
/** @description Getter Method of ToolTip Data according to the mouseX,mouseY position. **/
ProgressChart.prototype.getToolTipData = function (mouseX, mouseY) {
	var toolTipData;
	if (!this.m_designMode) {
		if ((this.m_percent != undefined && this.m_percent != null && this.m_percent > 0) && (IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None"))) {
			if (this.m_charttype == "circle") {
				var Radius = Math.sqrt(Math.pow( mouseX - this.centerX , 2) + Math.pow( mouseY - this.centerY , 2));
				if (Radius <= this.radius * 1 + this.m_linewidth / 2 && Radius >= this.radius - this.m_linewidth / 2) {
					toolTipData = {};
					toolTipData.cat = this.m_tooltiptitle ;
					toolTipData.data = new Array();
					var data = [];
					//data[0] = this.m_valuecolor;
					data[0] = {"color":this.m_valuecolor,"shape":"cube"};
					data[1] = this.m_percent;
					toolTipData.data.push(data);
					return toolTipData ;
				}
			} else if (mouseX <= this.m_width * 1 - this.m_width / 10 && mouseX >= this.m_x * 1 + this.m_width / 10 && mouseY <= this.m_height - this.m_height / 10 && mouseY >= this.m_y * 1 + this.m_height / 10) {
				toolTipData = {};
				toolTipData.cat = this.m_tooltiptitle ;
				toolTipData.data = new Array();
				var data = [];
				//data[0] = this.m_valuecolor;
				data[0] = {"color":this.m_valuecolor,"shape":"cube"};
				data[1] = this.m_percent;
				toolTipData.data.push(data);
				return toolTipData ;
			}
		}
	}
};
/** @description Getter method For DrillDataPoints. **/
ProgressChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
	if (!this.m_designMode) {
		if ((this.m_percent != undefined && this.m_percent != null && this.m_percent > 0) && (IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None"))) {
			var deltaX = mouseX - this.centerX;
			var deltaY = mouseY - this.centerY;
			var Angle = Math.atan2(deltaY, deltaX);
			var Radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
			if (this.m_charttype == "circle") {
				if (Radius <= this.radius * 1 + this.m_linewidth / 2 && Radius >= this.radius - this.m_linewidth / 2) {
					var fieldNameValueMap = {};
					fieldNameValueMap["Value"] = this.m_percent;
					var drillColor = this.m_valuecolor;
					return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
				}
			} else {
				var fieldNameValueMap = {};
				fieldNameValueMap["Value"] = this.m_percent;
				var drillColor = this.m_valuecolor;
				return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
			}
		}
	}
};
//# sourceURL=ProgressChart.js