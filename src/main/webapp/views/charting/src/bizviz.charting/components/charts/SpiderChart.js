/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: SpiderChart.js
 * @description SpiderChart
 **/
function SpiderChart(m_chartContainer, m_zIndex) {
	//console.log("inside SpiderChart() constructor");
	this.base = Chart;
	this.base();
	this.m_x = 350;
	this.m_y = 20;
	this.m_width = 300;
	this.m_height = 260;

	this.m_generatexml = "";
	this.m_seriesNames = [];
	this.m_categoryData = [];
	this.m_seriesData = [];

	this.m_charttype = "polygon";
	this.m_spiderChartCalculation = new SpiderChartCalculation();
	this.m_textUtil = new TextUtil();
	this.m_xAxis = new Xaxis();
	this.m_yAxis = new Yaxis();
	this.m_title = new svgTitle(this);
	this.m_subTitle = new svgSubTitle();

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;

	this.m_spiderwebstyle = "stroke";
	this.m_canvastype = "svg";
	
	this.m_enableanimation = "false";
	this.m_animationduration = 0.5;
	this.m_hovershape = 2;/**Hover on Point radius can be increase or decrease*/
};

SpiderChart.prototype = new Chart();

SpiderChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas(); //create draggable div
};

SpiderChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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

SpiderChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

SpiderChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.createSVG();
	$("#draggableCanvas" + this.m_objectid).hide();
	this.initMouseMoveEvent(this.m_chartContainer);
	//this.initMouseClickEvent();
	this.initMouseClickEventForSVG(this.svgContainerId);
};

/** @description createSVG Method used for create SVG element for Chart **/
SpiderChart.prototype.createSVG = function () {
	var temp = this;
	this.svgContainerId = "svgContainer" + temp.m_objectid;
	$("#" + temp.svgContainerId).remove();
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("xlink", "http://www.w3.org/1999/xlink");
	svg.setAttribute("width", this.m_width);
	svg.setAttribute("height", this.m_height);
	svg.setAttribute("id", this.svgContainerId);
	$(svg).css({
		"width": this.m_width,
		"height": this.m_height
	});
	//svg.setAttribute("class", "svg_chart_container");
	$("#draggableDiv" + temp.m_objectid).append(svg);
};

SpiderChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

SpiderChart.prototype.setFields = function (fieldsJson) {
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
SpiderChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	this.m_allCategoryNames = [];
	this.m_allCategoryDisplayNames = [];
	this.m_categoryVisibleArr = {};
	this.m_categoryFieldColor = [];
	var count = 0;
	// only one category can be set for line chart, preference to first one
	for (var i = 0; i < categoryJson.length; i++) {
		this.m_allCategoryNames[i] = this.getProperAttributeNameValue(categoryJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(categoryJson[i], "DisplayName"));
		this.m_allCategoryDisplayNames[i] = m_formattedDisplayName;
		this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]] = this.getProperAttributeNameValue(categoryJson[i], "visible");
		if (IsBoolean(this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]])) {
			this.m_categoryNames[count] = this.getProperAttributeNameValue(categoryJson[i], "Name");
			this.m_categoryDisplayNames[count] = m_formattedDisplayName;
			this.m_categoryFieldColor[count] = this.getProperAttributeNameValue(categoryJson[i], "Color");
			count++;
		}
	}
};
SpiderChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = [];
	this.m_legendNames = [];
	this.m_seriesVisibleArr = {};
	this.m_allSeriesDisplayNames = [];
	this.m_allSeriesNames = [];
	this.m_plotRadiusArray = [];
	this.m_plotTrasparencyArray = [];
	this.m_plotShapeArray = [];
	this.legendMap = {};
	var count=0;
	for (var i = 0; i < seriesJson.length; i++) {
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.m_allSeriesDisplayNames[i] = m_formattedDisplayName;
		this.m_allSeriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		this.m_seriesVisibleArr[this.m_allSeriesNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
		if (IsBoolean(this.m_seriesVisibleArr[this.m_allSeriesNames[i]])) {
			this.m_seriesNames[count] = this.getProperAttributeNameValue(seriesJson[i], "Name");
			this.m_seriesDisplayNames[count] = m_formattedDisplayName;
			this.m_seriesColors[count] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));
			this.m_legendNames[count] = m_formattedDisplayName;
			var radius = this.getProperAttributeNameValue(seriesJson[i], "PlotRadius");
			this.m_plotRadiusArray[count] = (radius != undefined && radius !== null && radius !== "") ? radius : 2;
			var transparency = this.getProperAttributeNameValue(seriesJson[i], "PlotTransparency");
			this.m_plotTrasparencyArray[count] = (transparency != undefined && transparency !== null && transparency !== "") ? transparency : 1;
			var shape = this.getProperAttributeNameValue(seriesJson[i], "PlotType");
			this.m_plotShapeArray[count] = (shape != undefined && shape !== null && shape !== "") ? shape : "point";
			var tempMap = {
				"seriesName" : this.m_seriesNames[count],
				"displayName" : this.m_seriesDisplayNames[count],
				"color" : this.m_seriesColors[count],
				"shape" : this.m_plotShapeArray[count],
				"index": count
			};
			this.legendMap[this.m_seriesNames[count]] = tempMap;
			count++;
		}

	}
	this.setLegendsIntialLoad(this.m_defaultlegendfields);
};
SpiderChart.prototype.getLegendInfo = function () {
	return this.legendMap;
};
SpiderChart.prototype.getAllSeriesNames = function () {
	return this.m_allSeriesNames;
};
SpiderChart.prototype.getAllCategoryNames = function () {
	return this.m_allCategoryNames;
};
SpiderChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};
SpiderChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};
SpiderChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};
SpiderChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};
SpiderChart.prototype.getSeriesColors = function () {
	return this.m_seriesColors;
};

/** @description Getter for Category Colors**/
SpiderChart.prototype.getCategoryColorsForAction = function () {
	return this.m_categoryFieldColor;
};
/** @description Getter for Series Colors**/
SpiderChart.prototype.getSeriesColorsForAction = function () {
	return this.m_seriesColors;
};

SpiderChart.prototype.setSeriesColor = function (m_seriesColor) {
	this.m_seriesColor = m_seriesColor;
};
SpiderChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};
SpiderChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};
SpiderChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
};
SpiderChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0; i < this.getSeriesNames().length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
};
SpiderChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};
SpiderChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

SpiderChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getAllCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getAllCategoryNames()[i]);
	}
	for (var j = 0; j < this.getAllSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
	}
};

SpiderChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

SpiderChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

SpiderChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

SpiderChart.prototype.getStartX = function () {
	var marginForYAxisLabels = 0;
	return (this.m_x + marginForYAxisLabels);
};

SpiderChart.prototype.getStartY = function () {
	var marginForXAxisLabels = this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.5;
	return (this.m_y + this.m_height - marginForXAxisLabels);
};

SpiderChart.prototype.getEndX = function () {
	//var rightSideMargin = 50 ;
	return (this.m_x + this.m_width);
};

SpiderChart.prototype.getEndY = function () {
	return (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};

SpiderChart.prototype.getMarginForSubTitle = function () {
	var margin;
	if (IsBoolean(this.m_subTitle.m_showsubtitle))
		margin = (this.m_subTitle.getDescription() != "") ? (this.fontScaling(this.m_subTitle.getFontSize() * this.m_subTitle.m_formattedDescription.length * 1) * 1.2) : 10;
	else
		margin = 0;
	return margin;
};

SpiderChart.prototype.init = function () {
	this.createSVG();
	this.setCategoryData();
	this.setSeriesData();
	this.setAllFieldsName();
	this.setAllFieldsDisplayName();

	this.setColorsForSeries();
	this.isSeriesDataEmpty();
	this.visibleSeriesInfo=this.getVisibleSeriesData(this.getSeriesData());
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);

	if (!IsBoolean(this.m_isEmptySeries)) {
		this.initializeCalculation();
	}
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
    this.initMouseClickEventForSVG(this.svgContainerId);
};

SpiderChart.prototype.setColorsForSeries = function () {
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
SpiderChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	var map = this.IsDrawingPossible();
	if (IsBoolean(map.permission)) {
		this.drawSpiderWebs();
	} else {
		this.drawSVGMessage(map.message);
	}
	/*if(this.m_categoryData.length < 3){
	this.drawMessage("Minimum three categories required to show this chart");
	}
	else if(!IsBoolean(this.m_isEmptySeries )){
	if( IsBoolean(this.isVisibleSeries()) ){
	this.drawSpiderWebs();
	}
	else{
	this.drawMessage("No visible Series Available");
	}
	this.drawLegends();
	}
	else{
	this.drawMessage(this.m_status.noData);
	}*/
};

SpiderChart.prototype.IsDrawingPossible = function () {
	var map = {};
	if (this.m_categoryData.length < 3) {
		map = {
			"permission" : "false",
			message : this.m_status.noMinCategory
		};
	} else if (!IsBoolean(this.isEmptyCategory)) {
		if (!IsBoolean(this.m_isEmptySeries)) {
			if (IsBoolean(this.isVisibleSeries()))
				map = {
					"permission" : "true",
					message : this.m_status.success
				};
			else
				map = {
					"permission" : "false",
					message : this.m_status.noSeries
				};
		}
	} else
		map = {
			"permission" : "false",
			message : this.m_status.noData
		};

	return map;
};

SpiderChart.prototype.drawSpiderWebs = function () {
	this.drawSpiderArms();
	if (this.m_charttype == "polygon") {
		this.drawPolygonWeb();
	} else if (this.m_charttype == "circle") {
		this.drawCircularWeb();
	}
	this.drawCategoryMarking();
	this.drawSeriesMarking();
	this.drawSeries();
	if (IsBoolean(this.getShowPoint()))
		this.drawPoint();
};

SpiderChart.prototype.drawObject = function () {
	this.drawSVGObject();
};

SpiderChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

SpiderChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

SpiderChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawSVGFrame();
	this.getBGGradientColorToContainer();
};

/** @description Will generate the gradient and fill in background of chart  **/
SpiderChart.prototype.getBGGradientColorToContainer = function () {
	var temp = this;
	var defsElement = document.createElementNS('http://www.w3.org/2000/svg', "defs");
	defsElement.setAttribute("id", "defsElement"+temp.m_objectid);
	$("#" + temp.svgContainerId).append(defsElement);
};

SpiderChart.prototype.initializeCalculation = function () {
	this.m_categoryData = this.updateCategoryData(this.m_categoryData);
	this.m_seriesData = this.updateSeriesData(this.m_seriesData);
	this.m_spiderChartCalculation.init(this, this.m_categoryData, this.m_seriesData);
	this.m_yAxis.init(this, this.m_spiderChartCalculation);
};

SpiderChart.prototype.updateSeriesData = function (arr) {
	this.m_displaySeriesDataFlag = [];
	//arr=[];
	for (var i = 0; i < arr.length; i++) {
		this.m_displaySeriesDataFlag[i] = [];
		//arr[i]=[];
		for (var j = 0; j < arr[i].length; j++) {
			this.m_displaySeriesDataFlag[i][j] = true;
			if (isNaN(arr[i][j])) {
				this.m_displaySeriesDataFlag[i][j] = false;
				arr[i][j] = getNumericComparableValue(arr[i][j]);
			}
		}
	}
	return arr;
};

SpiderChart.prototype.updateCategoryData = function (array) {
	var arr = [];
	if ((array != undefined && array !== null && array !== "") && array.length != 0){
		for (var i = 0; i < array[0].length; i++) {
			arr[i] = [];
			for (var j = 0; j < array.length; j++) {
				arr[i][j] = array[j][i];
			}
		}
	}
	return arr;
};

SpiderChart.prototype.drawSpiderArms = function () {
	// number of arms will always greater than 3 , it shows category data.
	var lineWidth = 0.5;
	var x1 = this.m_spiderChartCalculation.getCenterX();
	var y1 = this.m_spiderChartCalculation.getCenterY();
	for (var i = 0; i < this.m_spiderChartCalculation.m_numberOfArms; i++) {
		var x2 = this.m_spiderChartCalculation.m_armXCordinates[i];
		var y2 = this.m_spiderChartCalculation.m_armYCordinates[i];
		var yAxisLine = drawSVGLine(x1,y1,x2,y2,"0.5",this.m_axiscolor);
		$("#" + this.svgContainerId).append(yAxisLine);
	}
};

SpiderChart.prototype.drawPolygonWeb = function () {
	var lineWidth = 0.3;
	this.createHorizontalLineGroup('polygonwebgrp');
	for (var i = this.m_spiderChartCalculation.m_markerTextArray.length; i > 0; i--) {
		var path = "";
		var x1 =  this.m_spiderChartCalculation.m_armMarkerXCordinates[0][i];
		var startX = this.m_spiderChartCalculation.m_armMarkerXCordinates[0][i];
		var y1 = this.m_spiderChartCalculation.m_armMarkerYCordinates[0][i];
		var startY = this.m_spiderChartCalculation.m_armMarkerYCordinates[0][i];
		for (var j = 1; j < this.m_spiderChartCalculation.m_numberOfArms; j++) {
			var x2 = this.m_spiderChartCalculation.m_armMarkerXCordinates[j][i];
			var y2 = this.m_spiderChartCalculation.m_armMarkerYCordinates[j][i];
			if (j == 1) {
                path += "M" + x1 + "," + y1 + "L" + x2 + "," + y2;
            } else if (j == (this.m_spiderChartCalculation.m_armMarkerXCordinates.length - 1))
                path += "L" + x2 + "," + y2 + "L" + startX + "," + startY;
            else {
                path += "L" + x2 + "," + y2;
            }
		}
		
	    var svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
	    svgPath.setAttribute('d', path);
	    if (this.m_spiderwebstyle === "fill") {
	    	/**Filling color on alternate web **/
	    	if (i % 2 === 0) {
		    	svgPath.setAttribute("style", "stroke-width:" + lineWidth + "px; stroke:" + convertColorToHex(this.m_axiscolor) + "; fill:" + hex2rgb("#ffffff","1") + ";");
		    } else {
		    	svgPath.setAttribute("style", "stroke-width:" + lineWidth + "px; stroke:" + convertColorToHex(this.m_axiscolor) + "; fill:" + hex2rgb(this.m_axiscolor,"0.1") + ";");
		    }
	    } else {
	    	svgPath.setAttribute("style", "stroke-width:" + lineWidth + "px; stroke:" + convertColorToHex(this.m_axiscolor) + "; fill:none;");
	    }
	    $("#polygonwebgrp" + this.m_objectid).append(svgPath);
	}
};

SpiderChart.prototype.drawCircularWeb = function () {
	var smallestCircleRadius = (this.m_spiderChartCalculation.getArmLength() / this.m_spiderChartCalculation.m_markerTextArray.length);
	var centerX = this.m_spiderChartCalculation.getCenterX();
	var centerY = this.m_spiderChartCalculation.getCenterY();
	this.createHorizontalLineGroup('circularwebgrp');
	for (var i = this.m_spiderChartCalculation.m_markerTextArray.length; i > 0; i--) {
		if (this.m_spiderwebstyle == "fill") {
			var fillColor = "#FFFFFF";
			if (i % 2 != 0) {
				fillColor = hex2rgb(convertColorToHex(this.m_axiscolor), 0.1);
			}
			var arc = drawSVGCircle(centerX, centerY, smallestCircleRadius * i, "0.4", fillColor, convertColorToHex(this.m_axiscolor));
		} else {
			var arc = drawSVGCircle(centerX, centerY, smallestCircleRadius * i, "0.4", "none", convertColorToHex(this.m_axiscolor));
		}
		$("#circularwebgrp" + this.m_objectid).append(arc);
	}
};

SpiderChart.prototype.drawCategoryMarking = function () {
	this.createXAxisMarkerLabelGroup('categorymark');
	//var fontProperties = this.m_textUtil.getFontProperties(this.m_xAxis.m_labelfontstyle, this.m_xAxis.m_labelfontweight, this.fontScaling(this.m_xAxis.m_labelfontsize * 1), selectGlobalFont(this.m_xAxis.m_labelfontfamily));
	for (var j = 0; j < this.m_spiderChartCalculation.m_numberOfArms; j++) //8
	{
		var text = "" + this.m_categoryData[j];
		var x1 = this.m_spiderChartCalculation.m_armXCordinatesForLabel[j];
		var y1 = this.m_spiderChartCalculation.m_armYCordinatesForLabel[j];
		if ((x1 == this.m_spiderChartCalculation.getCenterX()) || ((x1 >= (this.m_spiderChartCalculation.getCenterX() * 1 - 1)) && (x1 <= (this.m_spiderChartCalculation.getCenterX() * 1 + 1)))) {
			var availableWidthAtC = this.m_width - 15 - 15;
			if (availableWidthAtC < this.ctx.measureText(text).width) {
				for (var i = 0; i < text.length; i++) {
					var textString = text.substring(0, text.length - i);
					if (availableWidthAtC > this.ctx.measureText(textString).width) {
						text = textString.substring(0, textString.length - 2) + "...";
						break;
					}
				}
			}
			x1 = x1 - this.ctx.measureText(text).width / 2;
		} else if ((x1 < this.m_spiderChartCalculation.getCenterX())) {

			var availableWidthAtLSC = x1 - this.m_x * 1 - 15;
			if (availableWidthAtLSC < this.ctx.measureText(text).width) {
				for (var i = 0; i < text.length; i++) {
					textString = text.substring(0, text.length - i);
					if (availableWidthAtLSC > this.ctx.measureText(textString).width) {
						text = textString.substring(0, textString.length - 2) + "...";
						break;
					}
				}
			}

			//if((Math.round(y1) ==  parseInt(this.m_spiderChartCalculation.getCenterY())) || (y1 == this.m_spiderChartCalculation.getCenterY()))
			//	x1 = x1 - this.ctx.measureText(text).width;
			//	else
			x1 = x1 - this.ctx.measureText(text).width;

		}
		/*if(y1 > this.m_spiderChartCalculation.getCenterY()){
		y1 = y1*1 + 10;
		}

		if(x1 == this.m_spiderChartCalculation.getCenterX()){
		var availableWidthAtC = this.m_width-15-15;
		if(availableWidthAtC < this.ctx.measureText(text).width){
		for(var i=0 ; i <text.length ;i++){
		textString = text.substring(0,text.length - i);
		if(availableWidthAtC > this.ctx.measureText(textString).width){
		text = textString.substring(0,textString.length - 2) + "...";
		break;
		}
		}
		}
		x1 = x1 - this.ctx.measureText(text).width/2;
		}
		else if(x1 < this.m_spiderChartCalculation.getCenterX()){
		var availableWidthAtLSC = x1 - this.m_x*1-15;
		if(availableWidthAtLSC < this.ctx.measureText(text).width){
		for(var i=0 ; i <text.length ;i++){
		textString = text.substring(0,text.length - i);
		if(availableWidthAtLSC > this.ctx.measureText(textString).width ){
		text = textString.substring(0,textString.length - 2) + "...";
		break;
		}
		}
		}
		x1 = x1 - this.ctx.measureText(text).width;
		}
		else if(x1 > this.m_spiderChartCalculation.getCenterX()){
		var availableWidthAtRSC = (this.m_x*1 + this.m_width*1) - x1*1 -15;
		if(availableWidthAtRSC < this.ctx.measureText(text).width ){
		for(var i=0 ; i <text.length ;i++){
		textString = text.substring(0,text.length - i);
		if(availableWidthAtRSC > this.ctx.measureText(textString).width ){
		text = textString.substring(0,textString.length - 2) + "...";
		break;
		}
		}
		}
		}*/
		var fillStyle = convertColorToHex(this.m_xAxis.m_labelfontcolor);
		//this.m_textUtil.drawText(this.ctx, text, x1, y1, fontProperties, "left");
		var text = drawSVGText(x1, y1, text, fillStyle, "left", "start", "0");
		$("#categorymark" + this.m_objectid).append(text);
	}
};

SpiderChart.prototype.drawSeriesMarking = function () {
	this.createXAxisMarkerLabelGroup('seriesmark');
	var armLength = parseInt(this.m_spiderChartCalculation.getArmLength() / this.m_spiderChartCalculation.m_markerTextArray.length);
	//var fontProperties = this.m_textUtil.getFontProperties(this.m_xAxis.m_labelfontstyle, this.m_xAxis.m_labelfontweight, this.fontScaling(this.m_xAxis.m_labelfontsize * 1), selectGlobalFont(this.m_xAxis.m_labelfontfamily));
	var markerArray = this.m_spiderChartCalculation.m_markerTextArray;
	var markerLength = this.m_spiderChartCalculation.m_markerTextArray.length;
	var plottedAxisMarkers = [];
	for (var i = 0; i < markerLength; i++) {
		var text = markerArray[i];
		text = this.getFormatterText(text, this.m_precision);
		plottedAxisMarkers.push(text);
	}
	if(!isUniqueArray(plottedAxisMarkers)){
		/** if the markers has the duplicates, re-set them with one precision **/
		var map = getDuplicatesFromArray(plottedAxisMarkers);
		for (var i = 0; i < markerLength; i++) {
			var text = markerArray[i];
			/** returns formatted value on second y-axis markers **/
			var tempText = this.getFormatterText(text, this.m_precision);
			if(this.m_precision == "default" && this.m_yAxis.m_secondaryUnitSymbol == "auto" && Object.keys(map).length > 0){
				/** if Same marker already exist in array, set a precision to 1 **/
				text = this.getFormatterText(text, 1);
			}else{
				text = tempText;
			}
			plottedAxisMarkers[i] = text;
		}
	}
	for (var i = 0; i <= markerLength; i++) {
		var marker;
		y1 = this.m_spiderChartCalculation.getCenterY() * 1 - armLength * i * Math.sin(Math.PI / 2) + 6;
		if (i == 0) {
			y1 = this.m_spiderChartCalculation.getCenterY() * 1 - armLength * i * Math.sin(theta) + 5;
			 marker = 0;
		} else {
			marker = plottedAxisMarkers[i - 1];
		}
		var x1 = this.m_spiderChartCalculation.getCenterX() - this.ctx.measureText(marker).width - 4;
		var fillStyle = convertColorToHex(this.m_xAxis.m_labelfontcolor);
		//this.m_textUtil.drawText(this.ctx, getFormattedNumberWithCommas(marker, this.m_numberformatter), x1, y1, fontProperties, "left");
		var text = drawSVGText(x1, y1, getFormattedNumberWithCommas(marker, this.m_numberformatter), fillStyle, "left", "start", "0");
		$("#seriesmark" + this.m_objectid).append(text);
	}
};


SpiderChart.prototype.drawSeries = function() {
    var temp = this;
    for (var k = 0, i = 0; i < this.m_seriesNames.length; i++) //2 ==> number of series
    {
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
            var lineWidth = 0.5;
            var strokeColor = this.m_seriesColorsArray[i];
            var startX = this.m_spiderChartCalculation.m_seriesXCordinates[k][0];
            var startY = this.m_spiderChartCalculation.m_seriesYCordinates[k][0];
            var path = "";
            var str = "";
            this.createStackGroup(this.m_spiderChartCalculation,'seriesgrp', k, this.m_seriesNames[i]);
            for (var j = 0; j < this.m_spiderChartCalculation.m_seriesXCordinates[k].length - 1; j++) {
                var x1 = this.m_spiderChartCalculation.m_seriesXCordinates[k][j];
                var y1 = this.m_spiderChartCalculation.m_seriesYCordinates[k][j];
                var x2 = this.m_spiderChartCalculation.m_seriesXCordinates[k][j + 1];
                var y2 = this.m_spiderChartCalculation.m_seriesYCordinates[k][j + 1];
                if (x1 != "" && y1 != "" && x2 != "" && y2 != "") {
                	if (j == 0) {
                        str += "M" + x1 + "," + y1 + "L" + x2 + "," + y2;
                    } else if (j == (this.m_spiderChartCalculation.m_seriesXCordinates[k].length - 2))
                        str += "L" + x2 + "," + y2 + "L" + startX + "," + startY;
                    else {
                        str += "L" + x2 + "," + y2;
                    }
                }
            }
            path = str;
            if (path != undefined || path != "") {
                var newLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
                newLine.setAttribute("d", path);
                newLine.setAttribute("style", "stroke:" + strokeColor + "; stroke-width:" + lineWidth + ";fill:" + hex2rgb(strokeColor, this.m_plotTrasparencyArray[i]) + ";");
                $("#seriesgrp" + k + this.m_objectid).append(newLine);
                k++;
            }
        }
    }
};

SpiderChart.prototype.drawPoint = function() {
    for (var k = 0, i = 0; i < this.m_seriesNames.length; i++) //2 ==> number of series
    {
    	this.createShapeGroup("pointshape", i , this.m_seriesNames[i]);
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
            for (var j = 0; j < this.m_spiderChartCalculation.m_seriesXCordinates[k].length; j++) //8
            {
                var x2 = this.m_spiderChartCalculation.m_seriesXCordinates[k][j];
                var y2 = this.m_spiderChartCalculation.m_seriesYCordinates[k][j];
                var strokeColor = this.m_seriesColorsArray[i];
                var fillStyle = hex2rgb(strokeColor, this.m_plotTrasparencyArray[i]);
                var strokeStyle = hex2rgb(strokeColor, 0.4);
                var lineWidth = 2;
                switch (this.m_plotShapeArray[i]) {
                    case "cube":
                        this.drawCube(i, j, x2 * 1, y2 * 1, this.m_plotRadiusArray[i] * 1, fillStyle);
                        break;
                    case "cross":
                        this.drawCross(i, j, x2 * 1, y2 * 1, this.m_plotRadiusArray[i] * 1, fillStyle);
                        break;
                    case "quad":
                        this.drawQuad(i, j, x2 * 1, y2 * 1, this.m_plotRadiusArray[i] * 1, fillStyle);
                        break;
                    case "triangle":
                        this.drawTriangle(i, j, x2 * 1, y2 * 1, this.m_plotRadiusArray[i] * 1, fillStyle);
                        break;
                    case "point":
                        this.drawCircle(i, j, x2 * 1, y2 * 1, this.m_plotRadiusArray[i] * 1, fillStyle);
                        break;
                    case "polygon":
                        this.drawPolygon(i, j, x2 * 1, y2 * 1, this.m_plotRadiusArray[i] * 1, fillStyle);
                        break;
                    case "star":
                        this.drawStar(i, j, x2 * 1, y2 * 1, this.m_plotRadiusArray[i] * 1, fillStyle);
                        break;
                    case "default":
                        this.drawCircle(i, j, x2 * 1, y2 * 1, this.m_plotRadiusArray[i] * 1, fillStyle);
                        break;
                }
            }
            k++;
        }
    }
};

/** @description calculate and draw the path for Triangle. **/
SpiderChart.prototype.drawTriangle = function(categoryIndex, seriesIndex, x, y, radius, fillStyle) {
    var temp = this;
    var FillColor = fillStyle;
    var colorArr = [FillColor, "transparent"];
    var d = "M" + (x * 1) + " " + (y * 1 - radius * 1) +
        " L" + (x * 1 + radius * 1) + " " + (y * 1 + radius * 1) +
        " L" + (x * 1 - radius * 1) + " " + (y * 1 + radius * 1) +
        " L" + (x * 1) + " " + (y * 1 - radius * 1);
    var newLine = document.createElementNS(NS, "path");
    newLine.setAttribute("d", d);
    /**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if (IsBoolean(this.m_enableanimation) && (this.m_animationduration > 0) && !isIE) {
        var content = document.createElementNS(NS, "linearGradient");
        content.setAttribute("id", "LinearGradient" + temp.m_objectid + seriesIndex + categoryIndex);
        for (var i = 0; i < 2; i++) {
            var stop = document.createElementNS(NS, "stop");
            stop.setAttribute("offset", "0");
            stop.setAttribute("stop-color", colorArr[i]);
            var Animate = drawSVGStackAnimation(0, "offset", radius, temp.m_animationduration * 10);
            $(stop).append(Animate);
            $(stop).attr("class", "pointShapeColorAnimation");
            $(content).append(stop);
        }
        $("#defsElement" + temp.m_objectid).append(content);
        FillColor = "url(#LinearGradient" + temp.m_objectid + seriesIndex + categoryIndex + ")";
        $(newLine).attr("class", "timeSeries-pointShapeHighlighter");
    }
    newLine.setAttributeNS(null, "fill", FillColor);
    newLine.setAttributeNS(null, "stroke", FillColor);
    $("#pointshape" + categoryIndex + this.m_objectid).append(newLine);
};

/** @description calculate and draw the path for Quad. **/
SpiderChart.prototype.drawQuad = function (categoryIndex, seriesIndex, x, y, radius, fillStyle) {
	var temp = this;
	var angle = 45;
	//this.ctx.lineTo(this.xPosition * 1, this.yPosition * 1 - this.m_plotradius * 1);

	var newRect = document.createElementNS(NS, "rect");
	newRect.setAttributeNS(null, "x", x - radius);
	newRect.setAttributeNS(null, "y", y - radius);
	newRect.setAttributeNS(null, "height", 2 * radius);
	newRect.setAttributeNS(null, "width", 2 * radius);
	newRect.setAttribute("transform", "rotate(" + angle + " " + x + "," + y + ")");
	newRect.setAttributeNS(null, "stroke", fillStyle);
	newRect.setAttributeNS(null, "fill", fillStyle);
	/**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if (IsBoolean(this.m_enableanimation)  && (this.m_animationduration > 0) && !isIE) {
		var Animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        Animate.setAttribute("attributeName", "height");
        Animate.setAttribute("from", "1");
        Animate.setAttribute("to", radius*2);
        Animate.setAttribute("dur", temp.m_animationduration + "s");
        $(newRect).append(Animate);
        $(newRect).attr("class", "pointShapeAnimation");
        //var radius = this.radius;
        newRect.addEventListener("mouseover", function (evt) {
        	newRect.setAttributeNS(null, "height", (2*radius + temp.m_hovershape));
        	newRect.setAttributeNS(null, "width", (2*radius + temp.m_hovershape));
        	newRect.setAttributeNS(null, "opacity", 0.8);
		});
        newRect.addEventListener("mouseout", function () {
        	newRect.setAttributeNS(null, "height", 2*radius);
        	newRect.setAttributeNS(null, "width", 2*radius);
        	newRect.setAttributeNS(null, "opacity", temp.m_plotTrasparencyArray[categoryIndex]);
		});
    }
	$("#pointshape" + categoryIndex + this.m_objectid).append(newRect);
};

/** @description calculate and draw the path for Cross. **/
SpiderChart.prototype.drawCross = function (categoryIndex, seriesIndex, x, y, radius, fillStyle) {
	var temp = this;
	var FillColor = fillStyle;
    var colorArr = [FillColor, "transparent"];
	var d = "M" + (x * 1 - radius * 1) + " " + (y * 1 - radius * 1) +
		" L" + (x * 1 + radius * 1) + " " + (y * 1 + radius * 1) +
		" M" + (x * 1 + radius * 1) + " " + (y * 1 - radius * 1) +
		" L" + (x * 1 - radius * 1) + " " + (y * 1 + radius * 1);
	var newLine = document.createElementNS(NS, "path");
	newLine.setAttribute("d", d);
	newLine.setAttributeNS(null, "stroke-width", 3);
	/**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if (IsBoolean(this.m_enableanimation) && (this.m_animationduration > 0) && !isIE) {
        var content = document.createElementNS(NS, "linearGradient");
        content.setAttribute("id", "LinearGradient" + temp.m_objectid + seriesIndex + categoryIndex);
        for (var i = 0; i < 2; i++) {
            var stop = document.createElementNS(NS, "stop");
            stop.setAttribute("offset", "0");
            stop.setAttribute("stop-color", colorArr[i]);
            var Animate = drawSVGStackAnimation(0, "offset", radius, temp.m_animationduration * 10);
            $(stop).append(Animate);
            $(stop).attr("class", "pointShapeColorAnimation");
            $(content).append(stop);
        }
        $("#defsElement" + temp.m_objectid).append(content);
        FillColor = "url(#LinearGradient" + temp.m_objectid + seriesIndex + categoryIndex + ")";
        $(newLine).attr("class", "timeSeries-pointShapeHighlighter");
    }
    newLine.setAttributeNS(null, "fill", FillColor);
    newLine.setAttributeNS(null, "stroke", FillColor);
	
    $("#pointshape" + categoryIndex + this.m_objectid).append(newLine);
};

/** @description calculate and draw the path for Cube. **/
SpiderChart.prototype.drawCube = function (categoryIndex, seriesIndex, x, y, radius, fillStyle) {
	var temp = this;
	var newRect = document.createElementNS(NS, "rect");
	newRect.setAttributeNS(null, "x", x - radius);
	newRect.setAttributeNS(null, "y", y - radius);
	newRect.setAttributeNS(null, "height", 2 * radius);
	newRect.setAttributeNS(null, "width", 2 * radius);
	newRect.setAttributeNS(null, "stroke", fillStyle);
	newRect.setAttributeNS(null, "fill", fillStyle);
	/**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if (IsBoolean(this.m_enableanimation) && (this.m_animationduration > 0) && !isIE) {
		var Animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        Animate.setAttribute("attributeName", "width");
        Animate.setAttribute("from", "1");
        Animate.setAttribute("to", radius*2);
        Animate.setAttribute("dur", temp.m_animationduration + "s");
        $(newRect).append(Animate);
        $(newRect).attr("class", "pointShapeAnimation");
        newRect.addEventListener("mouseover", function (evt) {
        	newRect.setAttributeNS(null, "height", (2*radius + temp.m_hovershape));
        	newRect.setAttributeNS(null, "width", (2*radius + temp.m_hovershape));
        	newRect.setAttributeNS(null, "opacity", 0.8);
		});
        newRect.addEventListener("mouseout", function () {
        	newRect.setAttributeNS(null, "height", 2*radius);
        	newRect.setAttributeNS(null, "width", 2*radius);
        	newRect.setAttributeNS(null, "opacity", temp.m_plotTrasparencyArray[categoryIndex]);
		});
    }
	
	$("#pointshape" + categoryIndex + this.m_objectid).append(newRect);
};

SpiderChart.prototype.drawCircle = function (categoryIndex, seriesIndex, x, y, radius, fillStyle) {
	var temp = this;
	var svgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	svgCircle.setAttributeNS(null, "cx", x);
	svgCircle.setAttributeNS(null, "cy", y);
	svgCircle.setAttributeNS(null, "r", radius);
	svgCircle.setAttributeNS(null, "stroke", fillStyle);
	svgCircle.setAttributeNS(null, "fill", fillStyle);
	/**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if (IsBoolean(this.m_enableanimation) && (this.m_animationduration > 0) && !isIE) {
	//if (IsBoolean(true) && !isIE) {
		var Animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        Animate.setAttribute("attributeName", "r");
        Animate.setAttribute("from", "1");
        Animate.setAttribute("to", radius);
        Animate.setAttribute("dur", this.m_animationduration+"s");
        $(svgCircle).append(Animate);
        $(svgCircle).attr("class", "pointShapeAnimation");
        //var radius = radius;
        svgCircle.addEventListener("mouseover", function (evt) {
        	svgCircle.setAttributeNS(null, "r", radius*1 + temp.m_hovershape);
		});
        svgCircle.addEventListener("mouseout", function () {
        	svgCircle.setAttributeNS(null, "r", radius*1);
		});
    }
	
	$("#pointshape" + categoryIndex + this.m_objectid).append(svgCircle);
	//$("#" + temp.m_chart.svgContainerId).append(svgCircle);
};

SpiderChart.prototype.drawPolygon = function (categoryIndex, seriesIndex, x, y, radius, fillStyle) {
	var temp = this;
	var x = x;
	var y = y;
	var radius = radius;
	var sides = 6;
	var FillColor = fillStyle;
    var colorArr = [FillColor, "transparent"];
	var a = (Math.PI * 2) / sides;
	var d = "M" + (radius * 1) + " " + (0);
	for (var i = 1; i <= sides; i++) {
		d += " L" + (radius * Math.cos(a * i)) + " " + (radius * Math.sin(a * i));
	}
	var newLine = document.createElementNS(NS, "path");
	newLine.setAttribute("transform", "translate(" + x + "," + y + ")");
	newLine.setAttribute("d", d);
	newLine.setAttributeNS(null, "stroke-width", 3);
	/**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if (IsBoolean(this.m_enableanimation) && (this.m_animationduration > 0) && !isIE) {
        var content = document.createElementNS(NS, "linearGradient");
        content.setAttribute("id", "LinearGradient" + temp.m_objectid + seriesIndex + categoryIndex);
        for (var i = 0; i < 2; i++) {
            var stop = document.createElementNS(NS, "stop");
            stop.setAttribute("offset", "0");
            stop.setAttribute("stop-color", colorArr[i]);
            var Animate = drawSVGStackAnimation(0, "offset", radius, temp.m_animationduration * 10);
            $(stop).append(Animate);
            $(stop).attr("class", "pointShapeColorAnimation");
            $(content).append(stop);
        }
        $("#defsElement" + temp.m_objectid).append(content);
        FillColor = "url(#LinearGradient" + temp.m_objectid + seriesIndex + categoryIndex + ")";
        $(newLine).attr("class", "timeSeries-pointShapeHighlighter");
    }
    newLine.setAttributeNS(null, "fill", FillColor);
    newLine.setAttributeNS(null, "stroke", FillColor);
	
    $("#pointshape" + categoryIndex + this.m_objectid).append(newLine);
};
/** @description calculate the path for Star. **/
SpiderChart.prototype.drawStar = function (categoryIndex, seriesIndex, x, y, radius, fillStyle) {
	var temp = this;
	var cx = x;
	var cy = y;
	var r1 = radius;
	var r0 = radius / 2;
	var spikes = 5;

	var rot = Math.PI / 2 * 3;
	var x = cx;
	var y = cy;
	var step = Math.PI / spikes;
	var FillColor = fillStyle;
    var colorArr = [FillColor, "transparent"];

	var d = "M" + (cx * 1) + " " + (cy - r0);
	for (var i = 0; i < spikes; i++) {
		x = cx * 1 + Math.cos(rot) * r0;
		y = cy * 1 + Math.sin(rot) * r0;
		d += " L" + (x) + " " + (y);
		rot = rot * 1 + step * 1;

		x = cx * 1 + Math.cos(rot) * r1;
		y = cy * 1 + Math.sin(rot) * r1;
		d += " L" + (x) + " " + (y);
		rot = rot * 1 + step * 1;
	}
	d += " L" + (cx) + " " + (cy - r0);
	var newLine = document.createElementNS(NS, "path");
	newLine.setAttribute("d", d);

	newLine.setAttributeNS(null, "stroke-width", 3);
	/**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if (IsBoolean(this.m_enableanimation) && (this.m_animationduration > 0) && !isIE) {
        var content = document.createElementNS(NS, "linearGradient");
        content.setAttribute("id", "LinearGradient" + temp.m_objectid + seriesIndex + categoryIndex);
        for (var i = 0; i < 2; i++) {
            var stop = document.createElementNS(NS, "stop");
            stop.setAttribute("offset", "0");
            stop.setAttribute("stop-color", colorArr[i]);
            var Animate = drawSVGStackAnimation(0, "offset", radius, temp.m_animationduration * 10);
            $(stop).append(Animate);
            $(stop).attr("class", "pointShapeColorAnimation");
            $(content).append(stop);
        }
        $("#defsElement" + temp.m_objectid).append(content);
        FillColor = "url(#LinearGradient" + temp.m_objectid + seriesIndex + categoryIndex + ")";
        $(newLine).attr("class", "timeSeries-pointShapeHighlighter");
    }
    newLine.setAttributeNS(null, "fill", FillColor);
    newLine.setAttributeNS(null, "stroke", FillColor);
    $("#pointshape" + categoryIndex + this.m_objectid).append(newLine);
};

SpiderChart.prototype.getToolTipData = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory) && IsBoolean(this.isVisibleSeries()) && IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")) {
		this.xPositionArr = this.m_spiderChartCalculation.m_seriesXCordinates; //[[6][6]]
		this.yAxisDataArray = this.m_spiderChartCalculation.m_seriesYCordinates; //[[6][6]]

		var centerX = this.m_spiderChartCalculation.getCenterX();
		var centerY = this.m_spiderChartCalculation.getCenterY();
		var armLength = this.m_spiderChartCalculation.getArmLength();
		var m_plotRadius = 5;
		var toolTipData;

		if ((mouseX >= centerX - armLength) && (mouseX <= centerX + armLength) && (mouseY <= centerY + armLength) && (mouseY >= centerY - armLength)) {
			for (var i = 0; i < this.xPositionArr.length; i++) {
				for (var j = 0; j < this.xPositionArr[i].length; j++) {
					m_plotRadius = this.m_plotRadiusArray[i] * 1;
					if ((mouseX <= this.xPositionArr[i][j] * 1 + m_plotRadius) && (mouseX >= this.xPositionArr[i][j] * 1 - m_plotRadius) && (mouseY <= this.yAxisDataArray[i][j] * 1 + m_plotRadius) && (mouseY >= this.yAxisDataArray[i][j] * 1 - m_plotRadius)) {
						toolTipData = {};
						if (IsBoolean(this.m_customtextboxfortooltip.dataTipType == "Default")) {
							toolTipData.cat = "";
							toolTipData["data"] = new Array();
							toolTipData.cat = this.m_categoryData[j];
							
							for(var k=0,l=0;k<this.m_seriesData.length;k++){
								if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[k]])) {
									var data = [];
									//data[0] = this.m_seriesColorsArray[k];
									data[0] = {"color":this.m_seriesColorsArray[k],"shape":this.legendMap[this.getSeriesNames()[k]].shape};
									data[1] = this.m_legendNames[k];
									var num = this.m_seriesData[k][j] * 1;
									if (num % 1 != 0 && this.m_tooltipprecision !== "default") {
										var newVal = num.toFixed(this.m_tooltipprecision);
									} else {
										newVal = this.m_seriesData[k][j] * 1;
									}
									var FormterData = this.getFormatterForToolTip(newVal);
									data[2] = FormterData;
									toolTipData.data[l] = data;
									l++;
								}
							}
							toolTipData.highlightIndex = this.getDrillColor(mouseX, mouseY);
							if (IsBoolean(this.m_controlledtooltip)) {
								toolTipData = this.updateTooltipData(toolTipData);
							}
							break;
						}else{
							toolTipData = this.getDataProvider()[i];
						}
					}
				}
			}
		} else {
			this.hideToolTip();
		}
		return toolTipData;
	}
};

SpiderChart.prototype.getDrillColor = function (mouseX, mouseY) {
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory)))) {
		this.xPositionArr = this.m_spiderChartCalculation.m_seriesXCordinates;
		this.yAxisDataArray = this.m_spiderChartCalculation.m_seriesYCordinates;

		var centerX = this.m_spiderChartCalculation.getCenterX();
		var centerY = this.m_spiderChartCalculation.getCenterY();
		var armLength = this.m_spiderChartCalculation.getArmLength();
		var m_plotRadius = 5;
		if ((mouseX >= centerX - armLength) && (mouseX <= centerX + armLength) && (mouseY <= centerY + armLength) && (mouseY >= centerY - armLength)) {
			for (var i = this.xPositionArr.length - 1; i >= 0; i--) {
				for (var j = 0; j < this.xPositionArr[i].length; j++) {
					m_plotRadius = this.m_plotRadiusArray[i] * 1;
					if ((mouseX <= this.xPositionArr[i][j] * 1 + m_plotRadius) && (mouseX >= this.xPositionArr[i][j] * 1 - m_plotRadius) && (mouseY <= this.yAxisDataArray[i][j] * 1 + m_plotRadius) && (mouseY >= this.yAxisDataArray[i][j] * 1 - m_plotRadius)) {
						return i;
					}
				}
			}
		}
	}
};

SpiderChart.prototype.getFormatterText = function (data, prec) {
	var dataWithFormatter = data;
	if (!IsBoolean(this.getFixedLabel())){
		dataWithFormatter = this.m_yAxis.getFormattedText(data, prec);
	}
	return dataWithFormatter;
};

SpiderChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory))) && IsBoolean(this.isVisibleSeries())) {
		this.mouseX = mouseX;
		this.mouseY = mouseY;
		this.xPositionArr = this.m_spiderChartCalculation.m_seriesXCordinates;
		this.yAxisDataArray = this.m_spiderChartCalculation.m_seriesYCordinates;

		var centerX = this.m_spiderChartCalculation.getCenterX();
		var centerY = this.m_spiderChartCalculation.getCenterY();
		var armLength = this.m_spiderChartCalculation.getArmLength();
		var m_plotRadius = 5;
		if ((this.mouseX >= centerX - armLength) && (this.mouseX <= centerX + armLength) && (this.mouseY <= centerY + armLength) && (this.mouseY >= centerY - armLength)) {
			for (var i = this.xPositionArr.length - 1; i >= 0; i--) {
				for (var j = 0; j < this.xPositionArr[i].length; j++) {
					m_plotRadius = this.m_plotRadiusArray[i] * 1;
					if ((this.mouseX <= this.xPositionArr[i][j] * 1 + m_plotRadius) && (this.mouseX >= this.xPositionArr[i][j] * 1 - m_plotRadius) && (this.mouseY <= this.yAxisDataArray[i][j] * 1 + m_plotRadius) && (this.mouseY >= this.yAxisDataArray[i][j] * 1 - m_plotRadius)) {
						var fieldNameValueMap = this.getFieldNameValueMap(j);
						var drillColor = this.m_seriesColorsArray[i];
						var drillField = this.visibleSeriesInfo.seriesName[i];
						var drillDisplayField = this.visibleSeriesInfo.seriesDisplayName[i];
						var drillValue = fieldNameValueMap[drillField];
						fieldNameValueMap.drillField = drillField;
						fieldNameValueMap.drillDisplayField = drillDisplayField;
						fieldNameValueMap.drillValue = drillValue;
						return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
					}
				}
			}
		}
	}
};

function SpiderChartCalculation() {
	this.m_max = 0;
	this.m_armLength = 0;
	this.m_centerX = 0;
	this.m_centerY = 0;
	this.m_numberOfMarkers = 5;
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_armXCordinates = [];
	this.m_armYCordinates = [];
	this.m_markerTextArray = [];
	this.m_armXCordinatesForLabel = [];
	this.m_armYCordinatesForLabel = [];

	this.m_seriesXCordinates = [];
	this.m_seriesYCordinates = [];
};

SpiderChartCalculation.prototype.init = function (spiderChart, m_categoryData, m_seriesData) {
	this.m_chart = spiderChart;
	this.m_globalCalculation = this.m_chart;
	this.m_categoryData = m_categoryData;
	this.m_seriesData = this.m_chart.getVisibleSeriesData(m_seriesData).seriesData;

	this.m_startX = this.m_globalCalculation.getStartX();
	this.m_startY = this.m_globalCalculation.getStartY();
	this.m_endX = this.m_globalCalculation.getEndX();
	this.m_endY = this.m_globalCalculation.getEndY();
	this.m_chartType = this.m_chart.getChartType(); // circle/polygon...

	this.setDrawHeight();
	this.setDrawWidth();
	this.calculateArmLength();
	this.calculateCenterX();
	this.calculateCenterY();
	this.m_numberOfArms = m_categoryData.length;
	this.m_angleBetweenArms = (Math.PI * 2) / this.m_numberOfArms;

	this.calculateArmsEndCoordinates();
	this.calculateArmsEndCoordinatesForCategoryLabel();
	this.calculateMaxValue();
	this.calculateArmMarkers();
	this.calculateArmMarkersCoordinates();
	this.setSeriesCoordinates();
};

SpiderChartCalculation.prototype.getDrawHeight = function () {
	return this.drawHeight;
};
SpiderChartCalculation.prototype.setDrawHeight = function () {
	this.drawHeight = this.m_startY * 1 - this.m_endY * 1;
};

SpiderChartCalculation.prototype.getDrawWidth = function () {
	return this.drawWidth;
};
SpiderChartCalculation.prototype.setDrawWidth = function () {
	this.drawWidth = this.m_endX * 1 - this.m_startX * 1;
};

SpiderChartCalculation.prototype.calculateArmLength = function () {
	this.m_armLength = ((this.getDrawHeight() >= this.getDrawWidth()) ? (this.getDrawWidth()) / 2 : (this.getDrawHeight()) / 2) - 10;
};

SpiderChartCalculation.prototype.getArmLength = function () {
	return this.m_armLength;
};

SpiderChartCalculation.prototype.calculateCenterX = function () {
	//this.m_centerX = (this.m_endX) - (this.getDrawWidth()/2);
	this.m_centerX = (this.m_chart.m_x) * 1 + (this.getDrawWidth() / 2) * 1;
};

SpiderChartCalculation.prototype.getCenterX = function () {
	return this.m_centerX;
};

SpiderChartCalculation.prototype.calculateCenterY = function () {
	this.m_centerY = (this.m_endY) + (this.getDrawHeight() / 2);
};

SpiderChartCalculation.prototype.getCenterY = function () {
	return this.m_centerY;
};

SpiderChartCalculation.prototype.calculateArmsEndCoordinates = function () {
	for (var i = 1; i <= this.m_numberOfArms; i++) {
		var theta = this.m_angleBetweenArms * (i - 1) + (Math.PI / 2) * 1;
		var coordinateX = this.getCenterX() * 1 + this.getArmLength() * Math.cos(theta);
		var coordinateY = this.getCenterY() * 1 - this.getArmLength() * Math.sin(theta);
		this.m_armXCordinates[i - 1] = coordinateX;
		this.m_armYCordinates[i - 1] = coordinateY;
	}
};

SpiderChartCalculation.prototype.calculateArmsEndCoordinatesForCategoryLabel = function () {
	var margin = 2;
	var radius = this.getArmLength() * 1 + (this.m_chart.fontScaling(this.m_chart.m_xAxis.m_labelfontsize * 1) / 2) + margin * 1;
	for (var i = 1; i <= this.m_numberOfArms; i++) {
		theta = this.m_angleBetweenArms * (i - 1) + (Math.PI / 2) * 1;
		coordinateX = this.getCenterX() * 1 + radius * Math.cos(theta);
		coordinateY = this.getCenterY() * 1 - radius * Math.sin(theta);
		this.m_armXCordinatesForLabel[i - 1] = coordinateX;
		this.m_armYCordinatesForLabel[i - 1] = coordinateY;
	}
};

SpiderChartCalculation.prototype.calculateMaxValue = function () {
	this.m_max = 0;
	for (var j = 0; j < this.m_seriesData.length; j++) {
		var seriesMax = this.calculateMax(this.m_seriesData[j]);
		if (this.m_max * 1 < seriesMax * 1) {
			this.m_max = seriesMax;
		}
	}

	var modValue = 10;
	if (this.m_max < 10)
		modValue = 5;
	else if (this.m_max < 100)
		modValue = 10;
	else if (this.m_max < 500)
		modValue = 50;
	else if (this.m_max < 1000)
		modValue = 100;
	else if (this.m_max < 5000)
		modValue = 500;
	else if (this.m_max < 10000)
		modValue = 1000;

	var mod = this.m_max % modValue;
	if (mod > 0) {
		var precision = modValue - mod;
		this.m_max = this.m_max * 1 + precision * 1;
	}
};

SpiderChartCalculation.prototype.calculateMax = function (array) {
	/*DAS-401 @dec check null values at start of array*/
	var max = (isNaN(array[0])) ? 0 : array[0];
	for (var i = 1; i < array.length; i++) {
		if (max * 1 < array[i] * 1) {
			max = array[i];
		}
	}
	return max;
};

SpiderChartCalculation.prototype.getMaxValue = function () {
	return this.m_max;
};

SpiderChartCalculation.prototype.calculateArmMarkers = function () {
	this.m_markerTextArray = [];
	for (var i = 0; i < this.m_numberOfMarkers; i++) {
		var marker = (this.getMaxValue() / (this.m_numberOfMarkers)) * (i + 1);
		if (marker % 1 != 0) {
			marker = marker.toFixed(1);
		}
		this.m_markerTextArray[i] = marker;
	}
};

SpiderChartCalculation.prototype.calculateArmMarkersCoordinates = function () {
	this.m_armMarkerXCordinates = [];
	this.m_armMarkerYCordinates = [];
	for (var j = 0; j < this.m_numberOfArms; j++) {
		this.m_armMarkerXCordinates[j] = [];
		this.m_armMarkerYCordinates[j] = [];
		for (var i = 0; i <= this.m_markerTextArray.length; i++) {
			var armLength = (this.getArmLength() / this.m_markerTextArray.length) * i;
			theta = this.m_angleBetweenArms * (j) + (Math.PI / 2) * 1;
			coordinateX = this.getCenterX() * 1 + armLength * Math.cos(theta);
			coordinateY = this.getCenterY() * 1 - armLength * Math.sin(theta);
			this.m_armMarkerXCordinates[j][i] = coordinateX;
			this.m_armMarkerYCordinates[j][i] = coordinateY;
		}
	}
};

SpiderChartCalculation.prototype.setSeriesCoordinates = function () {
	this.m_seriesXCordinates = [];
	this.m_seriesYCordinates = [];
	var ratio = this.getArmLength() / this.getMaxValue();
	for (var i = 0; i < this.m_seriesData.length; i++) //2
	{
		//Math.max.apply( Math, array) ;
		this.m_seriesXCordinates[i] = [];
		this.m_seriesYCordinates[i] = [];
		for (var j = 0; j < this.m_seriesData[i].length; j++) //8
		{
			/*DAS-401*/
			armLength = ratio * ((isNaN(this.m_seriesData[i][j])) ? 0 : this.m_seriesData[i][j]);
			theta = this.m_angleBetweenArms * (j) + (Math.PI / 2) * 1;
			coordinateX = this.getCenterX() * 1 + armLength * Math.cos(theta);
			coordinateY = this.getCenterY() * 1 - armLength * Math.sin(theta);
			this.m_seriesXCordinates[i][j] = coordinateX;
			this.m_seriesYCordinates[i][j] = coordinateY;
		}
	}
};
//# sourceURL=SpiderChart.js