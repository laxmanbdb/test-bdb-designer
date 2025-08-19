/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: SVGLineChart.js
 * @description SVGLineChart
 **/
var NS = 'http://www.w3.org/2000/svg';
function drawSVGText(x, y, text, fillColor, hAlign, Valign) {
	var newText = document.createElementNS(NS, 'text');
	newText.setAttribute('x', x);
	newText.setAttribute('y', y);
	newText.setAttribute('fill', fillColor);
	//newText.setAttribute('transform','rotate('+rotate+' '+x+','+y+')');
	newText.textContent = text;
	newText.setAttribute("text-anchor", getSVGAlignment(hAlign));
	newText.setAttribute("alignment-baseline", Valign);
	return newText;
}
function drawSVGLine(x1, y1, x2, y2, lineWidth, fillColor) {
	var newLine = document.createElementNS(NS, 'line');
	//newLine.setAttribute('id','line2');
	newLine.setAttribute('x1', x1);
	newLine.setAttribute('y1', y1);
	newLine.setAttribute('x2', x2);
	newLine.setAttribute('y2', y2);
	newLine.setAttribute('stroke', fillColor);
	newLine.setAttribute('stroke-width', lineWidth);
	return newLine;
}

function drawSVGRect(x, y, width, height, fillColor) {
	var newRect = document.createElementNS(NS, 'rect');
	newRect.setAttributeNS(null, 'x', x);
	newRect.setAttributeNS(null, 'y', y);
	newRect.setAttributeNS(null, 'height', height);
	newRect.setAttributeNS(null, 'width', width);
	newRect.setAttributeNS(null, 'fill', fillColor);
	//newRect.setAttributeNS(null, 'stroke', fillColor);
	//newRect.setAttributeNS(null, 'stroke-width', fillColor);
	return newRect;

}
function drawSVGCircle(x, y, radius, strokeWidth, fillColor) {}
function pathString(xPixelArr, yPixelArr) {
	var path = "";
	for (var i = 0; i < xPixelArr.length; i++) {
		if (i == 0 || i == xPixelArr.length - 1) {
			if (i == 0)
				path += "M " + xPixelArr[i] + " " + yPixelArr[i];
			else {
				path += " L " + xPixelArr[i] + " " + yPixelArr[i];
				path += " M " + xPixelArr[i] + " " + yPixelArr[i];
			}
		} else {
			path += " L " + xPixelArr[i] + " " + yPixelArr[i];
		}
	}
	return path;

}
function getSVGAlignment(align) {
	if (align.toLowerCase() == "left")
		return "start";
	if (align.toLowerCase() == "center")
		return "middle";
	if (align.toLowerCase() == "right")
		return "end";
	else
		return align;
}
function SVGLineChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();

	this.m_x = 680;
	this.m_y = 20;
	this.m_width = 300;
	this.m_height = 260;
	this.m_radius = 2;
	this.m_lineSeries = [];
	this.m_colorNames = [];
	this.m_pointSeries = [];

	this.m_categoryNames = [];
	this.m_seriesNames = [];
	this.m_seriesarr = [];
	this.m_categoryData = [];
	this.m_seriesData = [];

	this.m_yPositionArray = [];
	//this.m_calculation=new SVGLineCalculation();
	this.m_xAxis = new svgXAxis();
	this.m_yAxis = new svgYAxis();
	this.m_title = new svgTitle(this);
	this.m_subTitle = new svgSubTitle();

	this.m_util = new Util();
	this.noOfRows = 1; //used for set x-axis text into two rows in non tilted case.
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;

	// for time series project
	this.m_lineCalculation = [];
	this.m_yaxisArr = [];
	this.m_marginXArray = [];
	this.count = 0;

};

SVGLineChart.prototype = new Chart();

SVGLineChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas(); //create draggable div
};

SVGLineChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "Chart") {
			for (var chartKey in jsonObject[key]) {
				switch (chartKey) {
				case "xAxis":
					for (var xAxisKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(xAxisKey);
						nodeObject.m_xAxis[propertyName] = jsonObject[key][chartKey][xAxisKey];
					}
					break;
				case "yAxis":
					for (var yAxisKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(yAxisKey);
						nodeObject.m_yAxis[propertyName] = jsonObject[key][chartKey][yAxisKey];
					}
					break;
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

SVGLineChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

SVGLineChart.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	var categoryJson = [];
	var seriesJson = [];

	for (var i = 0; i < fieldsJson.length; i++) {
		var fieldType = this.getProperAttributeNameValue(fieldsJson[i], "Type");
		switch (fieldType) {
		case "Category":
			categoryJson.push(fieldsJson[i]);
			break;
		case "Series":
			seriesJson.push(fieldsJson[i]);
			break;
		case "CalculatedField":
			seriesJson.push(fieldsJson[i]);
			break;
		default:
			break;
		}
	}
	this.setCategory(categoryJson);
	this.setSeries(seriesJson);
};
SVGLineChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	// only one category can be set for line chart, preference to first one
	for (var i = 0; i < 1; i++) {
		this.m_categoryNames[i] = this.getProperAttributeNameValue(categoryJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(categoryJson[i], "DisplayName"));
		this.m_categoryDisplayNames[i] = m_formattedDisplayName;
	}
};
SVGLineChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = [];
	this.m_legendNames = [];
	this.m_seriesVisibleArr = []; // added for checklist
	for (var i = 0; i < seriesJson.length; i++) {
		this.m_seriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.m_seriesDisplayNames[i] = m_formattedDisplayName;
		this.m_seriesColors[i] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));
		this.m_legendNames[i] = m_formattedDisplayName;
		this.m_seriesVisibleArr[this.m_seriesDisplayNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
	}
};
SVGLineChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};
SVGLineChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};
SVGLineChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};
SVGLineChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};
SVGLineChart.prototype.getSeriesColors = function () {
	return this.m_seriesColors;
};
SVGLineChart.prototype.setSeriesColor = function (m_seriesColor) {
	this.m_seriesColor = m_seriesColor;
};
SVGLineChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};
SVGLineChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};
SVGLineChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
	this.CatData = this.m_categoryData;
};
SVGLineChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0; i < this.getSeriesNames().length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
	this.SerData = this.m_seriesData;
};
SVGLineChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};
SVGLineChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

SVGLineChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getCategoryNames()[i]);
	}
	for (var j = 0; j < this.getSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getSeriesNames()[j]);
	}
};
SVGLineChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};
SVGLineChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};
SVGLineChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

SVGLineChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};
SVGLineChart.prototype.createSVG = function () {
	var temp = this;
	$('#svg' + temp.m_objectid).remove();
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
	svg.setAttribute('width', this.m_width);
	svg.setAttribute('height', this.m_height);
	svg.setAttribute('id', 'svg' + temp.m_objectid);

	$("#draggableDiv" + temp.m_objectid).append(svg);
};
SVGLineChart.prototype.initMouseClickEvent = function () {
	var temp = this;
	var canvas = $("#svg" + this.m_objectid);
	if (canvas != null) {
		$(canvas)[0].addEventListener("mousemove", function () {
			onMouseMove(temp);
		}, false);
		$(canvas)[0].addEventListener("click", function () {
			OnMouseClick(temp);
		}, false);
		$(canvas)[0].addEventListener("touchstart", function (event) {
			OnMouseClick(temp);
		}, false);
		$(canvas)[0].addEventListener("gestureend", function (event) {
			if (temp.m_showmaximizebutton
				 && temp.m_showmaximizebutton != undefined
				 && temp.m_showmaximizebutton != "") {
				if (event.scale < 1.0) {
					$("#MaximizeDiv").remove();
					temp.minimize();
				} else if (event.scale > 1.0) {
					$("#MaximizeDiv").remove();
					temp.maximize();
				}
			}
		}, false);
	}
	this.initContextMenuEvent();
};
SVGLineChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.createSVG();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/****************************For manage series /axes  separately for manage time based graph ************************************/
SVGLineChart.prototype.calculateSeriesMap = function (seriesData) {
	this.seriesMap = [];
	this.seriesMap[0] = seriesData;
};
SVGLineChart.prototype.initializeCalculationClass = function () {
	this.m_lineCalculation = [];
	this.m_lineCalculation[0] = new SVGLineCalculation();
	this.m_lineCalculation[0].init(this, this.m_categoryData[0], this.seriesMap[0], this.seriesMap, 0, this.m_categoryData);

};
SVGLineChart.prototype.initializeYAxis = function () {

	this.m_yaxis = [];
	for (var i = 0; i < this.seriesMap.length; i++) {
		this.m_yaxis[i] = new svgYAxis();
		this.m_yaxis[i].init(this, this.m_lineCalculation[i], this.getColorsForSeries()[i]);
		//here color using for set marker color according to series color.
	}
	this.m_xAxis.init(this, this.m_lineCalculation[0]);

};

SVGLineChart.prototype.initializeLineSeries = function () {
	/*	for(var i=0,k=0; i<this.seriesMap.length; i++){
	this.m_yPositionArray=this.m_lineCalculation[i].getYPosition();
	//this.m_xaxis.init(this,this.m_lineCalculation[i]);
	//this.m_yaxis[i].init(this,this.m_lineCalculation[i],this.m_colorManager.getColor(i)[0]);
	for(var j=0; j<this.m_yPositionArray.length; j++){
	this.m_lineSeries[k]=new SVGLineSeries();
	this.m_lineSeries[k].init(this.getColorsForSeries()[j],this.m_lineCalculation[i].getXPosition(),this.m_yPositionArray[j],this);

	this.m_pointSeries[k]=new SVGPointSeries();
	this.m_pointSeries[k].init(this.getColorsForSeries()[j],"3",this.m_lineCalculation[i].getXPosition(),this.m_yPositionArray[j],this);

	k++;
	}
	}*/
	//pathString(this.m_lineCalculation[0].getXPosition(),this.m_lineCalculation[0].getXPosition());
	//	console.log(this.m_lineCalculation[0].getXPosition());//87834.2349726776, 88180.90163934426, 88351.39344262295, 88527.56830601093
};
SVGLineChart.prototype.calculateStartXMarginForYAxes = function () {
	var marginXArray = [];
	this.LabelAlignment = [];
	var textmargin = 50;
	for (var i = 0; i < this.seriesMap.length; i++) {
		//this.m_yPositionArray=this.m_lineCalculation[i].getYPosition();
		if ((i * 1 + 1) <= Math.ceil(this.seriesMap.length / 2)) {
			//marginXArray[i]=this.m_lineCalculation[i].textWidth +descriptionTextWidth;
			marginXArray[i] = (1 * this.m_x) + (textmargin * (i * 1 + 1)) - 5;
			this.LabelAlignment[i] = 'right';
		} else {
			marginXArray[i] = (1 * this.m_x) + (1 * this.m_width) - (textmargin * ((i * 1 + 1) - (Math.ceil(this.seriesMap.length / 2)))) + 5;
			this.LabelAlignment[i] = 'left';
		}
	}
	this.m_marginXArray = marginXArray;
};
/*********************************************************************************/

SVGLineChart.prototype.init = function () {
	this.createSVG();
	if (this.count == 0) {
		this.setCategoryData();
		this.setSeriesData();
	}
	this.setAllFieldsName();
	this.setAllFieldsDisplayName();
	this.setColorsForSeries();

	this.calculateSeriesMap(this.m_seriesData);
	this.initializeCalculationClass();
	this.initializeYAxis();
	this.calculateStartXMarginForYAxes();

	this.isSeriesDataEmpty();
	//this.setShowSeries(this.getAllFieldsDisplayName());

	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);

	if (!IsBoolean(this.m_isEmptySeries)) {
		this.initializeLineSeries();
	}
};

SVGLineChart.prototype.updateSeriesData = function (min, max) {
	var cat = [];
	var ser = [];
	cat[0] = [];
	for (var i = 0; i < this.SerData.length; i++) {
		ser[i] = [];
		for (var j = min; j <= max; j++) {
			if (i == 0)
				cat[i].push(this.CatData[i][j]);
			ser[i].push(this.SerData[i][j]);
		}
	}
	this.m_categoryData = cat;
	this.m_seriesData = ser;
};

SVGLineChart.prototype.drawChart = function () {
	var temp = this;
	//$('svg'+temp.m_objectid).empty();
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();

	if (!IsBoolean(this.m_isEmptySeries)) {
		this.drawXAxis();
		this.drawYAxis();
		//this.drawLineChart();
		this.drawLegends();
		this.drawSVGLines();
	} else {
		this.drawMessage(this.m_status.noData);
	}
	if (this.count == 0) {
		this.drawslider();
	}
	this.count++;
};
SVGLineChart.prototype.drawSVGLines = function () {
	var temp = this;
	var x_pixel = this.m_lineCalculation[0].getXPosition();
	var y_pixel = this.m_lineCalculation[0].getYPosition();
	for (var i = 0; i < y_pixel.length; i++) {
		var path = pathString(x_pixel, y_pixel[i]);
		var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		newLine.setAttribute('d', path);
		newLine.setAttribute('style', 'stroke:' + temp.getColorsForSeries()[i] + '; stroke-width:2;fill:none;');
		$("#svg" + temp.m_objectid).append(newLine);
	}
};
SVGLineChart.prototype.drawslider = function () {
	var temp = this;

	var categoryData = this.m_categoryData[0];
	var minDate = 0;
	var maxDate = categoryData.length - 1;

	var div = document.createElement('div');
	div.setAttribute("id", "rangeslider");
	var top = $("#draggableDiv" + temp.m_objectid).css("height").split('p')[0] - 25;
	var left = 90;
	var width = this.m_width - 2 * left;
	div.setAttribute("style", " left:90px; top:" + top + "px; width:" + width + "px; height:15px; position:absolute;");
	//div.setAttribute("style"," left:"+left+"px; top:"+top+"px; width:"+width+"px; height:15px; position:absolute;");
	$("#draggableDiv" + temp.m_objectid).append(div);

	var input = document.createElement("input");
	input.setAttribute("type", "text");
	input.setAttribute("id", "minRange");
	//input.setAttribute("value",new Date(minDate).toLocaleDateString());
	input.setAttribute("value", categoryData[minDate]);
	input.setAttribute("style", "position:absolute; width:80px; height:20px; text-align:center; top:" + (top - 3) + "px; left:2px; border:0px solid; background-color:#ccc;");
	$("#draggableDiv" + temp.m_objectid).append(input);

	var input = document.createElement("input");
	input.setAttribute("type", "text");
	input.setAttribute("id", "maxRange");
	//input.setAttribute("value",new Date(maxDate).toLocaleDateString());
	input.setAttribute("value", categoryData[maxDate]);
	input.setAttribute("style", "position:absolute;  width:80px; height:20px; text-align:center; top:" + (top - 3) + "px; right:2px;border:0px solid; background-color:#ccc;");
	$("#draggableDiv" + temp.m_objectid).append(input);

	$("#rangeslider").slider({
		range : true,
		min : minDate,
		max : maxDate,
		step : 1,
		values : [minDate, maxDate],
		slide : function (event, ui) {
			//$( "#minRange" ).val( (new Date(ui.values[ 0 ])).toLocaleDateString());
			//$( "#maxRange" ).val( (new Date(ui.values[ 1 ])).toLocaleDateString());
			$("#minRange").val(categoryData[(ui.values[0])]);
			$("#maxRange").val(categoryData[(ui.values[1])]);
			temp.updateSeriesData(ui.values[0], ui.values[1]);
			temp.init();
			temp.drawChart();
		}
		/* stop: function( event, ui ) {
		$( "#minRange" ).val( categoryData[(ui.values[ 0 ])]);
		$( "#maxRange" ).val( categoryData[(ui.values[ 1 ])]);
		temp.updateSeriesData(ui.values[ 0 ],ui.values[ 1 ]);
		temp.init();
		temp.drawChart();
		}*/
	});
	var values = $("#rangeslider").slider("option", "values");
};

SVGLineChart.prototype.getColorsForSeries = function () {
	return this.m_seriesColorsArray;
};
SVGLineChart.prototype.setColorsForSeries = function () {
	this.m_seriesColorsArray = [];
	if (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) {
		for (var i = 0; i < this.m_seriesData.length; i++) {
			this.m_seriesColorsArray[i] = this.m_drillColor;
		}
	} else {
		var seriesColors = this.getSeriesColors();
		for (var i = 0; i < this.m_seriesData.length; i++) {
			this.m_seriesColorsArray[i] = seriesColors[i];
		}
	}
};
SVGLineChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

SVGLineChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};
SVGLineChart.prototype.drawXAxis = function () {
	this.m_xAxis.drawXAxis();
	this.m_xAxis.markXaxis();
};

SVGLineChart.prototype.drawYAxis = function () {
	//this.m_yAxis.drawYAxis();
	//this.m_yAxis.markYaxis();
	this.m_yaxis[0].drawYAxis();
	this.m_yaxis[0].horizontalMarkerLines();
	if (this.m_yaxis.length > 1) {
		this.m_yaxis[0].drawRightYAxis();
	}
	for (var i = 0; i < this.m_yaxis.length; i++) {
		this.m_yaxis[i].markYaxis(i);
	}
};
SVGLineChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};
SVGLineChart.prototype.drawLineChart = function () {
	for (var i = 0; i < this.m_lineSeries.length; i++) {
		this.m_pointSeries[i].drawPointSeries(i);
		this.m_lineSeries[i].drawLineSeries();
	}
};

SVGLineChart.prototype.getStartX = function () {
	var textmargin = 50;
	var yAxislabelDescMargin;
	var chartXMargin = textmargin * (Math.ceil(this.seriesMap.length / 2));
	var yAxisDescriptionMargin = 5;
	if (this.m_yAxis.m_description != '')
		yAxisDescriptionMargin = this.m_yAxis.m_fontsize * 1.5 + 3 * 1;

	var formatterMargin = 5;
	//var startX=(this.m_x*1)+(chartXMargin*1)+(formatterMargin*1)+(yAxisDescriptionMargin*1);
	var startX = (this.m_x * 1) + (chartXMargin * 1);
	return startX;
};
SVGLineChart.prototype.getEndX = function () {
	var textmargin = 50;
	var chartXMargin = textmargin * (Math.floor(this.seriesMap.length / 2));
	var endX = (this.m_x * 1) + (this.m_width * 1) - (chartXMargin) - 30;

	return endX;
};

SVGLineChart.prototype.getStartY = function () {
	var chartYMargin = 15;
	var sliderMargin = 25;
	this.m_startY = parseInt(this.m_y) + parseInt(this.m_height) - chartYMargin - this.getXAxisLabelMargin() - this.getXAxisDescriptionMargin() - this.getHorizontalLegendMargin() - sliderMargin;

	return this.m_startY;
};
SVGLineChart.prototype.getXAxisLabelMargin = function () {
	var xAxislabelDescMargin = 15;
	if (IsBoolean(this.m_xAxis.getLabelTilted())) {
		this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.m_xAxis.getLabelFontSize() + "px " + this.m_xAxis.getLabelFontFamily();
		xAxislabelDescMargin = this.ctx.measureText(this.m_categoryData[0][0]).width;
		for (var i = 1; i < this.m_categoryData.length; i++) {
			if (xAxislabelDescMargin < this.ctx.measureText(this.m_categoryData[0][i]).width)
				xAxislabelDescMargin = this.ctx.measureText(this.m_categoryData[0][i]).width;
		}
		if (xAxislabelDescMargin > this.m_height / 4) {
			xAxislabelDescMargin = (this.m_xAxis.getLabelrotation() <= 70) ? (this.m_height / 4 - 15) : this.m_height / 4;
		}
	} else {
		this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.m_xAxis.getLabelFontSize() + "px " + this.m_xAxis.getLabelFontFamily();
		var xlm = this.m_xAxis.m_labelfontsize * 1.8;
		this.noOfRows = this.setNoOfRows();
		xAxislabelDescMargin = (xlm) * this.noOfRows;
	}
	return xAxislabelDescMargin;
};

SVGLineChart.prototype.setNoOfRows = function () {
	this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.m_xAxis.m_labelfontsize + "px " + this.m_xAxis.m_labelfontfamily;
	var textWidth = this.ctx.measureText(this.m_categoryData[0][0]).width;
	var xDivision = (this.getEndX() - this.getStartX()) / this.m_categoryData[0].length;
	var noOfRow = 1;
	for (var i = 1; i < this.m_categoryData[0].length; i++) {
		if (this.ctx.measureText(this.m_categoryData[0][i]).width > xDivision)
			noOfRow = 2;
	}
	return noOfRow;
};

SVGLineChart.prototype.getXAxisDescriptionMargin = function () {
	var xAxisDescriptionMargin = 2;
	if (this.m_xAxis.getDescription() != "") {
		xAxisDescriptionMargin = this.m_xAxis.getFontSize() * 1.5;
	}
	return xAxisDescriptionMargin;
};

SVGLineChart.prototype.getEndY = function () {
	var marginForTitle = 50;
	return (this.m_y + marginForTitle);
};

SVGLineChart.prototype.getToolTipData = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries)) {
		var toolTipData;
		this.xPositions = this.m_lineCalculation[0].getXPosition();
		this.yPositions = this.m_lineCalculation[0].getYPosition();

		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			for (var i = 0; i < this.xPositions.length; i++) {
				if (mouseX <= (this.xPositions[i] + 3) && (mouseX >= this.xPositions[i] - 3)) {
					toolTipData = {
						cat : "",
						data : []
					};
					var seriesData = (this.getSeriesData());
					toolTipData.cat = "";
					toolTipData["data"] = new Array();
					toolTipData.cat = this.getCategoryData()[0][i];
					//			   this.m_yAxis.getFormattedText(seriesData);
					for (var j = 0; j < this.getSeriesData().length; j++) {
						var data = [];
						data[0] = this.getSeriesDisplayNames()[j];
						data[1] = seriesData[j][i];
						toolTipData.data[j] = data;
					}
					break;
				}
			}
		} else {
			this.hideToolTip();
		}
		// alert(toolTipData);
		return toolTipData;
	}
};
SVGLineChart.prototype.getDataPointAndUpdateGlobalVariable = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries)) {
		var xPositionArr = this.m_calculation.getXPosition();
		var yAxisDataArray = this.m_calculation.getYPosition();
		var seriesColors = this.getSeriesColors();
		var dataPointRadius = 3;
		if ((mouseX >= this.getStartX() && mouseX <= this.getEndX()) && (mouseY <= this.getStartY() && mouseY >= this.getEndY())) {
			for (var i = 0; i < xPositionArr.length; i++) {
				if (mouseX <= (xPositionArr[i] * 1 + dataPointRadius) && mouseX >= (xPositionArr[i] * 1 - dataPointRadius)) {
					for (var j = 0; j < yAxisDataArray.length; j++) {
						if (mouseY <= (yAxisDataArray[j][i] + dataPointRadius) && mouseY >= (yAxisDataArray[j][i] - dataPointRadius)) {
							if (this.getGlobalKey() != "") {
								var fieldNameValueMap = this.getFieldNameValueMap(i);
								var drillColor = seriesColors[j];
								this.updateDataPoints(fieldNameValueMap, drillColor);
								break;
							}
						}
					}
				}
			}
		}
	}
};

//---------------------------Line Calculation--------------------------------------------------


function SVGLineCalculation() {
	this.startX;
	this.startY;
	this.endX;
	this.endY;
	this.marginX;

	this.xAxisData = [];
	this.yAxisData = [];
	this.xPositionArray = [];
	this.yPositionArray = [];
	this.m_yAxisMarkersArray = [];
	this.m_numberOfMarkers = 6;
	this.basePoint = "";

	this.minDate = '';
	this.maxDate = '';
};

SVGLineCalculation.prototype.init = function (lineRef, xAxisData, yAxisData, allSeriesMap, index, allCategories) {
	this.m_chart = lineRef;
	this.index = index;
	this.m_allSeriesMap = allSeriesMap;
	this.startX = this.m_chart.getStartX();
	this.endX = this.m_chart.getEndX();
	this.startY = this.m_chart.getStartY();
	this.endY = this.m_chart.getEndY();

	this.xAxisData = xAxisData;
	this.yAxisData = yAxisData;

	this.calculateMinimumMaximum();
	this.calculateMinMaxCategory(allCategories);
};

SVGLineCalculation.prototype.calculateMinimumMaximum = function () {
	var minMax = this.m_chart.calculateMinMaxValue(this.yAxisData);
	var calculatedMin = minMax.min;
	var calculatedMax = minMax.max;
	this.min = this.m_chart.getMinValue(calculatedMin, calculatedMax, this.m_chart.m_basezero, this.m_chart.m_autoaxissetup, this.m_chart.m_minimumaxisvalue, this.m_chart.m_maximumaxisvalue);
	var max = this.m_chart.getMaxValue(calculatedMin, calculatedMax, this.m_chart.m_basezero, this.m_chart.m_autoaxissetup, this.m_chart.m_minimumaxisvalue, this.m_chart.m_maximumaxisvalue, this.min);
	this.max = max.max;
	this.yAxisText = max.yAxisText;
	this.yAxisNoOfMarker = max.numberOfMarkers;

	this.m_yAxisMarkersArray = this.m_chart.setYAxisMarkersArray(this.m_chart.m_basezero, this.m_chart.m_autoaxissetup, this.min, this.max, this.yAxisNoOfMarker, this.yAxisText);

};

SVGLineCalculation.prototype.getMaxValue = function () {
	return this.max;
};

SVGLineCalculation.prototype.getMinValue = function () {
	return this.min;
};
SVGLineCalculation.prototype.getYAxisText = function () {
	this.getMaxValue();
	return this.yAxisText;
};

SVGLineCalculation.prototype.isInt = function (n) {
	return typeof n === 'number' && n % 1 == 0;
};

SVGLineCalculation.prototype.getYAxisMarkersArray = function () {
	return this.m_yAxisMarkersArray;
};
SVGLineCalculation.prototype.getEachLinePix = function () {
	this.eachLinePix = (this.startY * 1 - this.endY * 1) / (this.getMaxValue() - this.getMinValue());
	return this.eachLinePix;
};
SVGLineCalculation.prototype.getXAxisDiv = function () {
	this.xAxisDiv = (this.endX - this.startX) / (this.xAxisData.length - 1);
	return this.xAxisDiv;
};

SVGLineCalculation.prototype.setMarginX = function () {
	//this.marginX//this.index
	if (this.index <= Math.ceil(this.m_allSeriesMap.length / 2)) {
		this.marginX = this.index;
	} else {}
};
SVGLineCalculation.prototype.calculateMinMaxCategory = function (allCategories) {
	var dates = [];
	for (var i = 0; i < allCategories.length; i++) {
		for (var j = 0; j < allCategories[i].length; j++) {
			dates.push(new Date(allCategories[i][j]));
		}
	}
	this.maxDate = new Date(Math.max.apply(null, dates));
	this.minDate = new Date(Math.min.apply(null, dates));
};

SVGLineCalculation.prototype.getYPosition = function () {
	var yparray = [];
	for (var i = 0; i < this.yAxisData.length; i++) {
		yparray[i] = [];
		for (var j = 0; j < this.yAxisData[i].length; j++) {
			yparray[i][j] = (this.startY) - ((this.getEachLinePix()) * (this.yAxisData[i][j] - this.getMinValue()));
		}
	}
	this.yPositionArray = yparray;
	return this.yPositionArray;
};

/**************************** X-Position *************************************/
SVGLineCalculation.prototype.getXPosition = function () {
	this.xPositionArray = [];
	for (var i = 0; i < this.xAxisData.length; i++) {
		//this.xPositionArray[i] = this.startX*1+((new Date(this.xAxisData[i]).getTime()-new Date(this.minDate).getTime())*this.getXAxisPixelRatio());
		this.xPositionArray[i] = this.startX * 1 + this.getXAxisPixelRatio() * i;
	}
	return this.xPositionArray;
};
SVGLineCalculation.prototype.getXAxisMarkersArray = function () {
	this.m_xAxisMarkersArray = [];
	var noOfMarker = this.xAxisData.length;
	for (var i = 0; i < noOfMarker; i++) {
		this.m_xAxisMarkersArray[i] = this.xAxisData[i];
	}
	//	var noOfMarker=10;
	//	for(var i=0;i<noOfMarker;i++)
	//	{
	//		this.m_xAxisMarkersArray[i]=this.getXAxisMarker((new Date(this.minDate).getTime()+(i*this.getXAxisText())),((new Date(this.maxDate).getTime()-new Date(this.minDate).getTime())));
	//	}
	//	//  4/12/2012, 11:30:00 AM =>.toLocaleString()
	//	//  Sat Jun 02 2012 03:30:00 GMT+0530 (In =>.toString()
	//	//  7/22/2012 => toLocaleDateString()
	//	//  Thu, 12 Apr 2012 06:00:00 GMT = toUTCString()
	//	// Thu Apr 12 2012 =>toDateString()
	//	// 11:30:00 AM => toLocaleTimeString();

	return this.m_xAxisMarkersArray;
};

SVGLineCalculation.prototype.getXAxisPixelRatio = function () {
	//var xaxisRatio = (this.endX-this.startX)/(new Date(this.maxDate).getTime()-new Date(this.minDate).getTime());
	var xaxisRatio = (this.endX - this.startX) / (this.xAxisData.length - 1);
	return xaxisRatio;
};
SVGLineCalculation.prototype.getXAxisText = function () {
	//console.log((new Date(this.maxDate).getTime()-new Date(this.minDate).getTime()));
	var xaxisText = (new Date(this.maxDate).getTime() - new Date(this.minDate).getTime()) / 9;
	return xaxisText;
};

SVGLineCalculation.prototype.getXAxisMarker = function (text, diff) {

	var numberDuration = 1;
	var yearDuration = 1000 * 60 * 60 * 24 * 364;
	var monthDuration = 1000 * 60 * 60 * 24 * 30;
	var weekDuration = 1000 * 60 * 60 * 24 * 7;
	var dayDuration = 1000 * 60 * 60 * 24;
	var hourDuration = 1000 * 60 * 60;
	var minuteDuration = 1000 * 60;
	var secondDuration = 1000;
	var millisecondDuration = 1;
	var dayOfWeekFromInt = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	if (diff > yearDuration)
		return (new Date(text)).toLocaleDateString();
	else if (diff > monthDuration)
		return (new Date(text)).toLocaleDateString();
	else if (diff > weekDuration)
		return (new Date(text)).toLocaleDateString();
	else if (diff > dayDuration)
		return (new Date(text)).toLocaleDateString();
	else if (diff > hourDuration)
		return (new Date(text)).toLocaleTimeString();
	else if (diff > minuteDuration)
		return (new Date(text)).toLocaleTimeString();
	else if (diff > secondDuration)
		return (new Date(text)).toLocaleTimeString();
	else
		return (new Date(text)).toLocaleTimeString();

};
//--------------------------------------------Line Series--------------------------------

function SVGLineSeries() {
	this.color;
	this.xPositionArray = [];
	this.yPositionArray = [];
	this.line = [];
	this.ctx = "";
	this.m_chart = "";
};

SVGLineSeries.prototype.init = function (color, xPositionArray, yPositionArray, m_chart) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.color = color;
	this.xPositionArray = xPositionArray;
	this.yPositionArray = yPositionArray;
	/*Line Break*/
	for (var i = 0; i < this.xPositionArray.length; i++) {
		this.line[i] = new svgLine();
		if (this.xPositionArray[i] != "" && this.yPositionArray[i] != "") {
			if (i == 0) {
				this.line[i].init(this.color, this.xPositionArray[i], this.yPositionArray[i], this.xPositionArray[i], this.yPositionArray[i], this.m_chart);
			} else {
				this.line[i].init(this.color, this.xPositionArray[i - 1], this.yPositionArray[i - 1], this.xPositionArray[i], this.yPositionArray[i], this.m_chart);
			}
		}
	}
};

SVGLineSeries.prototype.isInRange = function (i) {
	if (i == 0) {
		if (this.yPositionArray[i] > this.m_chart.getStartY() || this.yPositionArray[i] < this.m_chart.getEndY())
			return true;
		else
			return false;
	} else {
		if (this.yPositionArray[i - 1] > this.m_chart.getStartY() || this.yPositionArray[i - 1] < this.m_chart.getEndY() || this.yPositionArray[i] > this.m_chart.getStartY() || this.yPositionArray[i] < this.m_chart.getEndY())
			return true;
		else
			return false;
	}
};

SVGLineSeries.prototype.drawLineSeries = function () {
	for (var i = 0; i < this.xPositionArray.length; i++) {
		if (!this.isInRange(i))
			this.line[i].drawLine();
	}
};
//-----------------------------------------------------------------------------------------------------------


function SVGPointSeries() {
	this.color;
	this.radius;
	this.xPositionArray = [];
	this.yPositionArray = [];
	this.point = [];
	this.ctx = "";
	this.m_chart = "";
};

SVGPointSeries.prototype.init = function (color, radius, xPositionArray, yPositionArray, m_chart) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.color = color;
	this.m_chart = m_chart;
	this.radius = radius;
	this.xPositionArray = xPositionArray;
	this.yPositionArray = yPositionArray;
	for (var i = 0; i < this.xPositionArray.length; i++) {
		this.point[i] = new Point();
		this.point[i].init(this.color, this.radius, this.xPositionArray[i], this.yPositionArray[i], this.ctx, this.m_chart);
	}
};

SVGPointSeries.prototype.isInRange = function (i) {
	if (this.yPositionArray[i] > this.m_chart.getStartY() || this.yPositionArray[i] < this.m_chart.getEndY())
		return true;
	else
		return false;
};

SVGPointSeries.prototype.drawPointSeries = function (seriesIndex) {
	for (var i = 0; i < this.xPositionArray.length; i++) {
		if (!this.isInRange(i))
			this.point[i].drawPoint(i, seriesIndex);
	}
};

/*************************************************************************/

function svgLine() {
	this.base = Line;
	this.base();
};
svgLine.prototype = new Line;
svgLine.prototype.drawCurveLine = function () {
	var temp = this;
	var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	newLine.setAttribute('x1', this.startXPosition);
	newLine.setAttribute('y1', this.startYPosition);
	newLine.setAttribute('x2', this.endXPosition);
	newLine.setAttribute('y2', this.endYPosition);
	newLine.setAttribute('style', 'stroke:' + this.color + '; stroke-width:2;');

	//$("#map").append(newLine);
	$("#svg" + temp.m_chart.m_objectid).append(newLine);
};

function svgPoint() {
	this.base = Point;
	this.base();
};
svgPoint.prototype = new Point;

Point.prototype.drawPoint = function (categoryIndex, seriesIndex) {

	var temp = this;
	var svgCircle = document.createElementNS('http://www.w3.org/2000/svg', "circle");
	svgCircle.setAttributeNS(null, "cx", this.xPosition);
	svgCircle.setAttributeNS(null, "cy", this.yPosition);
	svgCircle.setAttributeNS(null, "r", this.radius);
	svgCircle.setAttributeNS(null, "stroke", this.color);
	svgCircle.setAttributeNS(null, "fill", this.color);

	var seriesData = temp.m_chart.seriesMap[0][seriesIndex][categoryIndex];
	var categoryData = temp.m_chart.m_categoryData[0][categoryIndex];
	var seriesName = this.m_chart.m_legendNames[seriesIndex];
	var catName = this.m_chart.getCategoryNames()[0];
	/* for(var i=0;i<temp.m_chart.seriesMap[0].length;i++){
	seriesData.push(temp.m_chart.seriesMap[0][i][categoryIndex]);
	categoryData=temp.m_chart.m_categoryData[0][categoryIndex];
	}*/

	var id = "svg" + temp.m_chart.m_objectid;
	svgCircle.setAttributeNS(null, 'onmousemove', "ShowTooltip(evt," + seriesData + "," + categoryData + ",'" + seriesName + "','" + catName + "','" + id + "','" + temp.m_chart.m_width + "')");
	svgCircle.setAttributeNS(null, 'onmouseout', "HideTooltip(evt)");

	$("#svg" + temp.m_chart.m_objectid).append(svgCircle);
};

function HideTooltip(evt, id) {
	var tooltip = document.getElementById("tooltip");
	tooltip.setAttributeNS(null, "visibility", "hidden");

	var tooltip_bg = document.getElementById("tooltip_bg");
	tooltip_bg.setAttributeNS(null, "visibility", "hidden");
};

function ShowTooltip(evt, seriesData, catData, serName, CatName, id, componentWidth) {
	var tag = document.getElementById("tooltip");
	if (tag != null)
		tag.remove();

	var tag2 = document.getElementById("tooltip_bg");
	if (tag2 != null)
		tag2.remove();

	var leftMargin = document.getElementById("mainDiv").style.left;
	var leftMargin2 = parseInt(leftMargin, 10);

	var newRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	newRect.setAttributeNS(null, 'id', "tooltip_bg");
	newRect.setAttributeNS(null, 'class', "tooltip_bg");
	newRect.setAttributeNS(null, 'x', evt.clientX - leftMargin2);
	newRect.setAttributeNS(null, 'y', evt.clientY);
	newRect.setAttributeNS(null, 'height', 70);
	newRect.setAttributeNS(null, 'visibility', "visible");

	$("#" + id).append(newRect);

	var newText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	newText.setAttribute('x', evt.clientX - leftMargin2);
	newText.setAttribute('y', evt.clientY);
	newText.setAttribute('fill', "grey");
	newText.setAttribute('id', "tooltip");

	var newTspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
	newTspan1.setAttribute('fill', "black");
	newTspan1.setAttribute('x', evt.clientX - leftMargin2);
	newTspan1.setAttribute('y', evt.clientY);
	newTspan1.setAttribute('dy', "1.2em");
	newTspan1.textContent = CatName + ": " + catData;
	newText.appendChild(newTspan1);

	var newTspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
	newTspan2.setAttribute('fill', "black");
	newTspan2.setAttribute('x', evt.clientX - leftMargin2);
	newTspan2.setAttribute('y', evt.clientY + 20);
	newTspan2.setAttribute('dy', "1.2em");
	newTspan2.textContent = serName + ": " + seriesData;

	newText.appendChild(newTspan2);

	$("#" + id).append(newText);
	length = (newTspan1.getComputedTextLength() > newTspan2.getComputedTextLength()) ? newTspan1.getComputedTextLength() : newTspan2.getComputedTextLength();
	newRect.setAttributeNS(null, "width", length + 8);

	if (evt.clientX - leftMargin2 * 1 + length > componentWidth) {

		newRect.setAttributeNS(null, 'x', evt.clientX - leftMargin2 * 1 - length * 1 - 20);
		newText.setAttribute('x', evt.clientX - leftMargin2 * 1 - length * 1 - 20);
		newTspan1.setAttribute('x', evt.clientX - leftMargin2 * 1 - length * 1 - 20);
		newTspan2.setAttribute('x', evt.clientX - leftMargin2 * 1 - length * 1 - 20);
	}

	/*	 if(evt.clientX < toolTipX ){
	newRect.setAttributeNS(null, 'x',evt.clientX);
	newText.setAttribute('x', evt.clientX);
	newTspan1.setAttribute('x',  evt.clientX);
	newTspan2.setAttribute('x', evt.clientX);
	}*/
};

function svgTitle(m_chart) {
	this.base = Title;
	this.base(m_chart);
};
svgTitle.prototype = new Title;

svgTitle.prototype.drawTitleBox = function () {
	var temp = this;
	var x = this.m_chart.m_x * 1 + 0.5 * 1;
	var y = this.m_chart.m_y * 1 + 1 * 1;
	var w = this.m_chart.m_width * 1 - 1 * 1;
	var h = this.m_titleBarHeight * heightRatio;

	var xmlns = "http://www.w3.org/2000/svg";
	var rect = document.createElementNS(xmlns, 'rect');
	rect.setAttributeNS(null, 'x', x);
	rect.setAttributeNS(null, 'y', y);
	rect.setAttributeNS(null, 'height', h);
	rect.setAttributeNS(null, 'width', w);
	rect.setAttributeNS(null, 'fill', this.m_gradientcolorsArray[0]);
	$("#svg" + temp.m_chart.m_objectid).append(rect);
};
svgTitle.prototype.drawText = function () {
	var temp = this.m_chart;
	var text = drawSVGText(this.startX, this.startY, this.m_formattedDescription, this.m_fontColor, this.getAlign(), "end");
	text.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.getFontSize() + "px;font-weight:" + this.getFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$("#svg" + temp.m_objectid).append(text);
};

/*****************************************************/
function svgSubTitle() {
	this.base = SubTitle;
	this.base();
};
svgSubTitle.prototype = new SubTitle;
svgSubTitle.prototype.drawText = function () {
	var temp = this.m_chart;
	var text = drawSVGText(this.startX, this.startY, this.m_formattedDescription, this.m_fontColor, this.getAlign(), "end");
	text.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.getFontSize() + "px;font-weight:" + this.getFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$("#svg" + temp.m_objectid).append(text);
};

function svgYAxis() {
	this.base = Yaxis;
	this.base();
};
svgYAxis.prototype = new Yaxis;
svgYAxis.prototype.drawYAxis = function () {
	var temp = this;
	/*var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
	newLine.setAttribute('id','line2');
	newLine.setAttribute('x1',this.m_startX);
	newLine.setAttribute('y1',this.m_startY);
	newLine.setAttribute('x2',this.m_startX);
	newLine.setAttribute('y2',this.m_endY);
	newLine.setAttribute('style','stroke:black; stroke-width:2;');*/
	//$("#map").append(newLine);
	var newLine = drawSVGLine(this.m_startX, this.m_startY, this.m_startX, this.m_endY, "2", "#000000");
	$("#svg" + temp.m_chart.m_objectid).append(newLine);
};

svgYAxis.prototype.horizontalMarkerLines = function () {
	var temp = this;
	for (var i = 0; i < this.m_yAxisMarkersArray.length; i++) {
		/*var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
		//newLine.setAttribute('id','line2');
		newLine.setAttribute('x1',this.m_startX-5);
		newLine.setAttribute('y1',this.m_startY-(i*this.getYAxisDiv()));
		newLine.setAttribute('x2',this.m_endX);
		newLine.setAttribute('y2',this.m_startY-(i*this.getYAxisDiv()));
		newLine.setAttribute('style','stroke:black; stroke-width:0.25;');*/
		//$("#map").append(newLine);
		var newLine = drawSVGLine(this.m_startX - 5, this.m_startY - (i * this.getYAxisDiv()), this.m_endX, this.m_startY - (i * this.getYAxisDiv()), "0.25", "#000000");
		$("#svg" + temp.m_chart.m_objectid).append(newLine);
	}
};
svgYAxis.prototype.drawRightYAxis = function () {
	this.ctx.beginPath();
	this.ctx.lineWidth = "1.0";
	this.ctx.strokeStyle = this.m_chart.getAxisColor();
	this.ctx.moveTo(this.m_endX, this.m_startY);
	this.ctx.lineTo(this.m_endX, this.m_endY);
	this.ctx.stroke();
	this.ctx.closePath();

	var temp = this;
	/*var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
	newLine.setAttribute('id','line2');
	newLine.setAttribute('x1',this.m_endX);
	newLine.setAttribute('y1',this.m_startY);
	newLine.setAttribute('x2',this.m_endX);
	newLine.setAttribute('y2',this.m_endY);
	newLine.setAttribute('style','stroke:black; stroke-width:2;');*/
	//$("#map").append(newLine);
	var newLine = drawSVGLine(this.m_endX, this.m_startY, this.m_endX, (this.m_endY * 1), "2", "#000000");
	$("#svg" + temp.m_chart.m_objectid).append(newLine);
};
svgYAxis.prototype.markYaxis = function (index) {
	for (var i = 0; i < this.m_yAxisMarkersArray.length; i++) {
		var text = this.m_yAxisMarkersArray[i];
		if (IsBoolean(this.m_isSecodaryAxis))
			text = this.getSecondaryAxisFormattedText(text);
		else
			text = this.getFormattedText(text);

		this.drawSVGText(this.m_chart.m_marginXArray[index] - this.m_axislinetotextgap, ((this.m_startY * 1) - (i * (this.getYAxisDiv()))), "", "", text);
	}
	if (this.getDescription() != "") {
        this.drawDescription();
    }
};
svgYAxis.prototype.drawSVGText = function (x, y, rotate, color, text1) {
	var temp = this.m_chart;
	var text = drawSVGText(x, y, text1, color, "right", "middle");
	text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.getLabelFontSize() + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$("#svg" + temp.m_objectid).append(text);
};

function svgXAxis() {
	this.base = Xaxis;
	this.base();
};
svgXAxis.prototype = new Xaxis;

svgXAxis.prototype.init = function (m_chart) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.m_startX = this.m_chart.getStartX();
	this.m_startY = this.m_chart.getStartY();
	this.m_endX = this.m_chart.getEndX();
	this.m_endY = this.m_chart.getEndY();

	this.m_xAxisData = this.m_chart.m_lineCalculation[0].getXAxisMarkersArray();
	this.m_axiscolor = convertColorToHex(this.m_chart.getAxisColor());
	this.m_labelfontcolor = convertColorToHex(this.getLabelFontColor());
};
svgXAxis.prototype.drawXAxis = function () {
	var temp = this;
	/*var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
	newLine.setAttribute('id','line2');
	newLine.setAttribute('x1',this.m_startX);
	newLine.setAttribute('y1',this.m_startY);
	newLine.setAttribute('x2',this.m_endX);
	newLine.setAttribute('y2',this.m_startY);
	newLine.setAttribute('style','stroke:black; stroke-width:2;');*/
	//$("#map").append(newLine);
	var newLine = drawSVGLine(this.m_startX, this.m_startY, this.m_endX, (this.m_startY * 1), "2", "#000000");
	$("#svg" + temp.m_chart.m_objectid).append(newLine);
};
svgXAxis.prototype.markXaxis = function () {
	this.drawAxisLabels();
	if (this.getDescription() != "") {
		this.drawDescription();
	}
};
svgXAxis.prototype.drawAxisLabels = function () {
	this.drawAxisTick();
	for (var i = 0; i < this.m_xAxisData.length; i++) {
		this.ctx.beginPath();
		this.ctx.save();
		this.drawLabel(this.m_xAxisData[i], i);
		this.ctx.restore();
		this.ctx.closePath();
	}
};

svgXAxis.prototype.drawAxisTick = function () {
	var temp = this;
	for (var i = 0; i < this.m_xAxisData.length; i++) {
		var x = parseInt(this.m_startX) + (this.getXaxisDivison() * i);
		/*var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
		newLine.setAttribute('id','line2');
		newLine.setAttribute('x1',x);
		newLine.setAttribute('y1',this.m_startY);
		newLine.setAttribute('x2',x);
		newLine.setAttribute('y2',this.m_startY+5);
		newLine.setAttribute('style','stroke:black; stroke-width:2;');*/
		//$("#map").append(newLine);
		var newLine = drawSVGLine(x, this.m_startY, x, (this.m_startY * 1 + 5), "2", "#000000");
		$("#svg" + temp.m_chart.m_objectid).append(newLine);
	}
};

svgXAxis.prototype.drawLabel = function (text, i) {
	var m_axisLineToTextGap = this.calculateAxisLineToTextGap();
	if (IsBoolean(this.getLabelTilted())) {
		this.ctx.font = this.getLabelFontProperties();
		if (this.ctx.measureText(text).width > this.m_chart.m_height / 4) {
			text = this.getText("" + text, this.m_chart.m_height / 4, this.getLabelFontProperties());
		}
		this.translateTextPosition(m_axisLineToTextGap, i, text);
	} else {
		if (this.m_chart.noOfRows == 2) {
			text = this.getText("" + text, ((this.m_endX - this.m_startX) / this.m_xAxisData.length) * 2, this.getLabelFontProperties());
		}
		this.translateTextPosition(m_axisLineToTextGap, i, text);
	}
};

svgXAxis.prototype.drawDescription = function () {
	//this.m_textUtil.drawText( this.ctx ,this.getDescription(),this.getXDesc(), this.getYDesc() , this.getFontProperties() , this.m_descriptiontextalign ,this.m_fontcolor);
	this.ctx.beginPath();
	this.ctx.font = this.getFontProperties();
	this.ctx.textAlign = this.m_descriptiontextalign;
	this.ctx.fillStyle = this.m_fontcolor;
	this.ctx.fillText(this.getDescription(), this.getXDesc(), this.getYDesc());
	this.ctx.closePath();
};

svgXAxis.prototype.getXaxisDivison = function () {
	return ((this.m_endX - this.m_startX) / (this.m_xAxisData.length - 1));
};

svgXAxis.prototype.calculateAxisLineToTextGap = function () {
	var m_axisLineToTextGap = 10;
	return m_axisLineToTextGap;
};

svgXAxis.prototype.translateTextPosition = function (m_axisLineToTextGap, i, text) {
	var labelRotation = this.getLabelrotation();
	this.calculateXYAndTranslate(m_axisLineToTextGap, i, text, labelRotation);
};

svgXAxis.prototype.calculateXYAndTranslate = function (m_axisLineToTextGap, i, text, labelRotation) {
	if (this.m_xAxisData.length == 1) {
		var x = parseInt(this.m_startX) + (this.m_endX - this.m_startX) / 2;
	} else {
		var x = parseInt(this.m_startX) + (this.getXaxisDivison() * i);
	}
	//var y=parseInt(this.m_startY)+m_axisLineToTextGap;
	var axisToLabelMargin = 0;
	if (this.m_chart.noOfRows == 2)
		axisToLabelMargin = (i % 2 != 0) ? (this.m_chart.fontScaling(this.m_chart.m_xAxis.m_labelfontsize) * 1.5) : 0;
	var y = this.m_startY * 1 + m_axisLineToTextGap * 1 + (axisToLabelMargin) * 1 + (this.m_chart.m_xAxis.m_labelfontsize) * 1.0;

	this.drawSVGText(x, y, labelRotation, "", text);
};

svgXAxis.prototype.drawSVGText = function (x, y, rotate, color, text1) {
	var temp = this.m_chart;
	var text = drawSVGText(x, y, text1, color, "center", "start");
	text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.getLabelFontSize() + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$("#svg" + temp.m_objectid).append(text);

};
//# sourceURL=SVGLineChart.js