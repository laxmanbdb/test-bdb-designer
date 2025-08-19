/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: HeatMapChart.js
 * @description HeatMapChart
 **/
function HeatMapChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();

	this.m_x = 20;
	this.m_y = 320;
	this.m_width = 300;
	this.m_height = 260;
	this.m_radius = 1;
	this.m_seriesNames = [];
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_max = [];
	this.m_range1 = [];
	this.m_range2 = [];
	this.m_color = [];
	this.m_CategoryDataSum = [];
	this.m_displayname = [];
	this.m_heatMapCell = [];
	this.m_rangeForLegend = [];
	this.m_range = [];
	this.m_ranges = "";
	this.m_colorArray = [];
	this.m_seriesColorArray = [];
	this.m_color = [];
	this.m_displayname = "ES,MS";
	this.m_ranges = "0-20,20-100";
	this.m_colors = "#cccccc,26265";
	this.m_legendDisplayNames = "";
	this.m_showcelltext = false;
	this.m_celltextcolor = "#000000";
	this.m_celltextfontstyle = "normal";
	this.m_celltextfontweight = "normal";
	this.m_celltextfontsize = "12";
	this.m_celltextfontfamily = "Roboto";

	this.m_highervaluesaregood = "true";
	this.m_titleBarHeight = 25;
	this.m_subTitleBarHeight = 25;

	this.m_xAxis = new HeatMapXaxis();
	this.m_yAxis = new HeatMapYaxis();
	this.m_title = new svgTitle(this);
	this.m_subTitle = new svgSubTitle();

	this.m_colorMap = new Object();
	this.noOfRows = 1; //used for set x-axis text into two rows in non tilted case.
	this.m_leftSideSpace = 65;
	this.m_heatMapCalculation = new HeatMapCalculation();
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_objectid = "";
	
	this.m_defaultfillcolor = "#e0dfdf";
	this.m_solidcolorfill = false;
	this.m_heatanimationduration = '0.5';
	this.m_animationoption = "growFromCenter";
	this.m_canvastype = "svg";
	this.m_luminance = "0.5";
	this.m_xaxislabellines = 3;
};
HeatMapChart.prototype = new Chart();

HeatMapChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};
HeatMapChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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
				case "Legend":
					for (var legendKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(legendKey);
						nodeObject[propertyName] = jsonObject[key][chartKey][legendKey];
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
HeatMapChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};
HeatMapChart.prototype.initializeDraggableDivAndCanvas = function () {
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
HeatMapChart.prototype.createSVG = function () {
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
HeatMapChart.prototype.setFields = function (fieldsJson) {
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
HeatMapChart.prototype.setCategory = function (categoryJson) {
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
			this.m_categoryFieldColor = this.getProperAttributeNameValue(categoryJson[i], "Color");
			this.m_categoryDisplayNames[count] = m_formattedDisplayName;
			count++;
		}
	}
};
HeatMapChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_allSeriesNames = [];
	this.m_visibleSeriesDisplayNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = [];
	this.m_allSeriesDisplayNames = [];
	this.m_legendNames = [];
	this.m_seriesVisibleArr = {};
	this.m_additionalField = [];
	var count = 0;
	this.legendMap = {};
	for (var i = 0; i < seriesJson.length; i++) {
		this.m_allSeriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.m_seriesDisplayNames[i] = m_formattedDisplayName;
		this.m_allSeriesDisplayNames[i] = this.m_seriesDisplayNames[i];
		this.m_seriesVisibleArr[this.m_allSeriesNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
		if (IsBoolean(this.m_seriesVisibleArr[this.m_allSeriesNames[i]])) {
			this.m_seriesNames[count] = this.getProperAttributeNameValue(seriesJson[i], "Name");
			this.m_additionalField[count] = (this.getProperAttributeNameValue(seriesJson[i], "AdditionalField") !== undefined)?this.getProperAttributeNameValue(seriesJson[i], "AdditionalField"):this.m_seriesNames[count];
			this.m_visibleSeriesDisplayNames[count] = m_formattedDisplayName;
			this.m_legendNames[count] = m_formattedDisplayName;
			this.m_seriesColors[count] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));
			var tempMap = {
				"seriesName" : this.m_seriesNames[count],
				"displayName" : this.m_visibleSeriesDisplayNames[count],
				"color" : this.m_seriesColors[count],
				"shape" : "cube",
				"index": count
			};
			this.legendMap[this.m_seriesNames[count]] = tempMap;
			count++;
		}
	}
	this.setLegendsIntialLoad(this.m_defaultlegendfields);
};
HeatMapChart.prototype.getLegendInfo = function () {
	return this.legendMap;
};
HeatMapChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};
HeatMapChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};
HeatMapChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};
HeatMapChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};
HeatMapChart.prototype.getVisibleSeriesDisplayNames = function () {
	return this.m_visibleSeriesDisplayNames;
};
HeatMapChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};
HeatMapChart.prototype.getAllSeriesNames = function () {
	return this.m_allSeriesNames;
};
HeatMapChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};
HeatMapChart.prototype.getSeriesColors = function () {
	return this.m_seriesColors;
};
HeatMapChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};
/** @description Getter for Category Colors**/
HeatMapChart.prototype.getCategoryColorsForAction = function () {
	return this.m_categoryFieldColor;
};
/** @description Getter for Series Colors**/
HeatMapChart.prototype.getSeriesColorsForAction = function () {
	return this.m_seriesColors;
};
HeatMapChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	this.isEmptyCategory = true;
	if (this.getCategoryNames().length > 0) {
		this.isEmptyCategory = false;
		for (var i = 0; i < this.getCategoryNames().length; i++) {
			this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
		}
	}
	var arr = [];
	if (this.m_categoryData[0]) {
		for (var i = 0; i < this.m_categoryData[0].length; i++) {
			arr[i] = [];
			for (var j = 0; j < this.m_categoryData.length; j++) {
				arr[i][j] = this.m_categoryData[j][i];
			}
		}
	}
	this.m_categoryData = arr;
};
HeatMapChart.prototype.getCategoryData = function () {
	var arr = convertArrayType(this.m_categoryData);
	return arr;
};
HeatMapChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	this.m_additionalFieldData = [];
	for (var i = 0; i < this.getSeriesNames().length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
		this.m_additionalFieldData[i] = this.getDataFromJSON(this.m_additionalField[i]);
	}
};
HeatMapChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};
HeatMapChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getCategoryNames()[i]);
	}
	for (var j = 0; j < this.getAllSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
	}
};
HeatMapChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};
HeatMapChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};
HeatMapChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};
HeatMapChart.prototype.init = function () {
	this.createSVG();
	this.setCategoryData();
	this.getCategoryData();
	this.setSeriesData();
	this.setAllFieldsName();
	this.setAllFieldsDisplayName();
	this.isSeriesDataEmpty();
	this.setShowSeries(this.getAllFieldsName());
	this.setSeriesDataValue();
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);

	if (!IsBoolean(this.m_isEmptySeries) && IsBoolean(this.isVisibleSeries()) && (!IsBoolean(this.isEmptyCategory))) {
		this.initializeSeriesValues();
		/** comma separator data should be updated before the series min/ max calculation **/
		this.updateSeriesDataWithCommaSeperators();
		this.setMinMaxValueFromSeriesData();
		this.setRangeForLegends();
		this.setDisplayNameForLegend();
		this.getRanges();
		this.setChartDrawingArea();
		this.m_heatMapCalculation.init(this, this.m_categoryData, this.m_seriesData);
		this.m_xAxis.init(this, this.m_heatMapCalculation);
		this.m_yAxis.init(this, this.m_heatMapCalculation);
		this.initializeChartUIProperties();
		this.initializeHeatMapChartFrequencyProperties();
	}
	/**Old Dashboard directly previewing without opening in designer*/
	this.initializeToolTipProperty();
	this.m_tooltip.init(this);
	this.initMouseClickEventForSVG(this.svgContainerId);
};
HeatMapChart.prototype.updateSeriesDataWithCommaSeperators = function () {
	this.m_displaySeriesDataFlag = [];
	for (var i = 0; i < this.m_seriesData.length; i++) {
		this.m_displaySeriesDataFlag[i] = [];
		for (var j = 0; j < this.m_seriesData[i].length; j++) {
			this.m_displaySeriesDataFlag[i][j] = true;
			if (isNaN(this.m_seriesData[i][j])) {
				this.m_displaySeriesDataFlag[i][j] = false;
				this.m_seriesData[i][j] = getNumericComparableValue(this.m_seriesData[i][j]);
			}
		}
	}
};
HeatMapChart.prototype.getYPosofFrequency = function (height) {
	var calHeight = [];
	for (var i = 0; i < this.getFrequencyRagne().length; i++) {
		if (i == 0)
			calHeight[i] = this.getEndY() * 1;
		else
			calHeight[i] = calHeight[i - 1] * 1 + height * 1;
	}
	return calHeight;
};
HeatMapChart.prototype.setRangeForLegends = function () {
	this.m_rangeForLegend = (!IsBoolean(this.m_showdynamicrange)) ? (this.m_ranges.split(",")) : ([this.serMinVal*1,this.serMaxVal]);
};
HeatMapChart.prototype.setDisplayNameForLegend = function () {
	this.m_legendDisplayNames = (!IsBoolean(this.m_showdynamicrange)) ? (this.m_displayname.split(",")) :(["Min","Max"]);
};
HeatMapChart.prototype.getDisplayNameForLegend = function () {
	return this.m_legendDisplayNames;
};
HeatMapChart.prototype.getRanges = function () {
	this.m_range = this.m_ranges.split(",");
	for (var i = 0; i < this.m_range.length; i++) {
		var splitter = this.m_range[i].indexOf("~") > -1 ? "~" : "-";
		var m_rangeForLegend = (this.m_range[i].split(splitter));
		this.m_range1[i] = m_rangeForLegend[0];
		this.m_range2[i] = m_rangeForLegend[1];
	}

	Array.prototype.max = function () {
		return Math.max.apply(null, this);
	};

	Array.prototype.min = function () {
		return Math.min.apply(null, this);
	};

	this.m_minRangeValue = [this.m_range1.min(), this.m_range2.min()].min();
	this.m_maxRangeValue = [this.m_range1.max(), this.m_range2.max()].max();
};
HeatMapChart.prototype.setSeriesDataValue = function () {
	var arr = [];
	if (this.m_seriesData[0] != undefined) {
		for (var i = 0; i < this.m_seriesData[0].length; i++) {
			arr[i] = [];
			for (var j = 0; j < this.m_seriesData.length; j++) {
				if (this.m_seriesData[j][i] != undefined)
					arr[i][j] = this.m_seriesData[j][i];
				else
					arr[i][j] = null;
			}
		}
	}
	this.m_seriesData = arr;
};
HeatMapChart.prototype.initializeSeriesValues = function () {
	var arr = [];
	if (this.m_seriesData[0] != undefined) {
		for (var i = 0; i < this.m_seriesData[0].length; i++) {
			arr[i] = [];
			for (var j = 0; j < this.m_seriesData.length; j++) {
				arr[i][j] = this.m_seriesData[j][i];
			}
		}
	}
	this.m_seriesData = arr;
};
HeatMapChart.prototype.initializeChartUIProperties = function () {
	this.m_startX = this.getStartX();
	this.m_startY = this.getStartY();
	var frequencyBarSpace = this.getFrequencyBarSpace() * 1;
	this.m_heatWidth = this.getEndX() - this.m_startX - frequencyBarSpace*1;
	this.m_heatHeight = this.getStartY() - this.getEndY();

	this.initializeColor();
	this.createColorRange();
	this.setHeatMapCellColor();
	this.setHeatMapCells();
};
HeatMapChart.prototype.getFrequencyBarSpace = function () {
	var countLength = [];
	var space = 0;
	var legendspace = 2;
	var range = this.getSplitRange();
	if (IsBoolean(this.m_showfrequencybar)) {
		for (var i = 0; i < range.length; i++) {
			countLength[i] = this.ctx.measureText(range[i]).width;
		}
		space = (IsBoolean(this.getShowLegends())) ? (countLength.max() * 1 + legendspace * 1 + 1) : (countLength.max() * 1);
	}
	return space;
};
HeatMapChart.prototype.initializeHeatMapChartFrequencyProperties = function () {
	var spaceBetweenMapAndBar = 10;
	this.m_xPosofFrequency = this.m_startX*1 + this.m_heatWidth*1 + spaceBetweenMapAndBar*1;
	this.m_widthofFrequency = 12;
	this.m_frequencyRange = this.getFrequencyRagne();
	this.m_heightofFrequency = (this.m_heatHeight * 1) /((!IsBoolean(this.m_showdynamicrange))? this.m_range.length : (this.m_frequencyRange.length-1));
	this.m_yPosofFrequency = this.getYPosofFrequency(this.m_heightofFrequency);
	this.m_colorofFrequency = this.m_color;
	
};
HeatMapChart.prototype.getFrequencyRagne = function () {
	var newRange = this.getSplitRange();
	return newRange;
};
HeatMapChart.prototype.getSplitRange = function () {
	var arr = [];
	if(!IsBoolean(this.m_showdynamicrange)){
		for (var i = 0; i < this.m_range.length; i++) {
			arr[i] = [];
			var range1 = this.m_range[i].split("~");
			for (var j = 0; j < range1.length; j++) {
				arr[i][j] = range1[j];
			}
		}
		return this.getUniqueArray(arr);
	}
	else{
		arr[0] = this.serMinVal;
		arr[1] = this.serMaxVal;
		return arr;
	}
	
};
HeatMapChart.prototype.getUniqueArray = function (arr) {
	var UniqueArr = [];
	var count = 0;
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr[i].length; j++) {
			if (UniqueArr.indexOf(arr[i][j]) != -1) {
				//UniqueArr[count] = arr[i][j];
				//count++;
			} else {
				UniqueArr[count] = arr[i][j];
				count++;
			}
		}
	}
	return UniqueArr;
};
HeatMapChart.prototype.initializeColor = function () {
	var color = this.m_colors.split(",");
	if(!IsBoolean(this.m_showdynamicrange)){
		for (var i = 0; i < this.m_range.length; i++) {
			if (color[i] != undefined)
				this.m_color[i] = convertColorToHex(color[i]);
			else
				this.m_color[i] = this.m_color[i - 1];
		}
	}
	else{
		this.m_color[0] = this.m_minrangecolor;
		this.m_color[1] = this.m_maxrangecolor;
	}
};
HeatMapChart.prototype.createColorRange = function () {
	var crWidth = this.m_heatWidth;
	this.m_minRange = (!IsBoolean(this.m_showdynamicrange)) ?([this.m_range1.min(), this.m_range2.min()].min()) : (this.serMinVal*1);
	this.m_maxRange =  (!IsBoolean(this.m_showdynamicrange)) ?([this.m_range1.max(), this.m_range2.max()].max()) : (this.serMaxVal*1);
	var grad = this.ctx.createLinearGradient(0, 0, crWidth, 0);
	if(IsBoolean(this.m_showdynamicrange)){
		/** Dynamic color range will have min and max colors only **/
		var color =[];
		color[0] = this.m_minrangecolor;
		color[1] = this.m_maxrangecolor;
		for (var i = 0; i < color.length; i++) {
			if(i==0){
				var mark = 0;
			}else if(i == color.length-1){
				mark = 1;
			}else{
				mark = i/(color.length-1);
			}
			grad.addColorStop(mark, color[i]);
		}
	}else{
		if (this.m_range.length > 1) {
			var rangeDiff = this.m_maxRange - this.m_minRange;
			for (var i = 0; i < this.m_range.length; i++) {
				if (i == 0)
					grad.addColorStop(0, this.m_color[i]);
				else if (i == this.m_range.length - 1)
					grad.addColorStop(1, this.m_color[i]);
				else {
					var stop = this.m_range1[i] - this.m_minRange;
					mark = stop / rangeDiff;
					if(!isNaN(mark)){
						grad.addColorStop( mark, this.m_color[i]);
					}
				}
			}
		} else {
			if (IsBoolean(this.m_highervaluesaregood)) {
				grad.addColorStop(0, "#FFFFFF");
				grad.addColorStop(1, this.m_color[0]);
			} else {
				grad.addColorStop(0, this.m_color[0]);
				grad.addColorStop(1, "#FFFFFF");
			}
		}
	}
	this.ctx.beginPath();
	this.ctx.fillStyle = grad;
	this.ctx.fillRect(0, 0, crWidth, this.m_height * 1);
	this.ctx.fill();
	this.ctx.closePath();
};
HeatMapChart.prototype.setMinMaxValueFromSeriesData = function () {
	this.serMaxVal = this.serMinVal = 0;
	var singletonFlag = true;
	for(var i = 0; i < this.m_seriesData.length ; i++){
		for(var j = 0 ; j < this.m_seriesData[i].length ; j++ ){
			if(this.m_seriesData[i][j] != undefined && !isNaN(this.m_seriesData[i][j]*1) && this.m_seriesData[i][j] != null && this.m_seriesData[i][j] !== ""){
				if(singletonFlag){
					this.serMaxVal = this.serMinVal = this.m_seriesData[i][j]*1;
					singletonFlag = false;
				}
				if(this.serMaxVal*1 <= this.m_seriesData[i][j]*1)
					this.serMaxVal = this.m_seriesData[i][j]*1;
				if(this.serMinVal*1 >= this.m_seriesData[i][j]*1)
					this.serMinVal = this.m_seriesData[i][j]*1; 
			}
		}
	}
};
/** @description set the color for each cell according to data, range and fill type **/
HeatMapChart.prototype.setHeatMapCellColor = function () {
	this.m_heatMapCellColor = [];
	for (var i = 0; i < this.m_seriesData.length; i++) {
		this.m_heatMapCellColor[i] = [];
		for (var j = 0; j < this.m_seriesData[i].length; j++) {
			if (this.m_seriesData[i][j] != null &&  this.m_seriesData[i][j] !== "" && this.m_seriesData[i][j] != undefined && !isNaN(this.m_seriesData[i][j])) {
				if(IsBoolean(this.m_showdynamicrange) || !IsBoolean(this.m_solidcolorfill)){
					/** Gradient fill for dynamic-range and gradient fill for user defined range**/
					if ((this.m_seriesData[i][j] * 1 < this.m_minRange ) || (this.m_seriesData[i][j] * 1 > this.m_maxRange)){
						this.m_heatMapCellColor[i][j] = this.m_defaultfillcolor;
					}else{
						var percent = ((this.m_seriesData[i][j] - this.m_minRange) / (this.m_maxRange - this.m_minRange)) * this.m_heatWidth * this.getDevicePixelRatio();
						if (this.m_seriesData[i][j] * 1 < this.m_minRange){
							percent = 0.01;
						}else if(this.m_seriesData[i][j] * 1 >= this.m_maxRange){
							percent = (this.m_heatWidth * this.getDevicePixelRatio()) - this.m_adjustpixel;
						}
						var col = this.ctx.getImageData(percent | 0, this.m_height / 2, 1, 1).data;
						var rgbColor = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
						this.m_heatMapCellColor[i][j] = rgb2hex(rgbColor);
					}
				}else{
					/* Solid fill for user defined range*/
					var percent = this.m_seriesData[i][j] * 1;
					for (var k = 0; k < this.m_range.length; k++) {
						if ((k == 0 && percent < this.m_range1[k]) || (k == this.m_range.length - 1 && percent >= this.m_range2[k])){
							this.m_heatMapCellColor[i][j] = this.m_defaultfillcolor;
						}
						if (percent >= this.m_range1[k] && percent < this.m_range2[k]){
							this.m_heatMapCellColor[i][j] = this.m_color[k];
							break;
						} else {
							this.m_heatMapCellColor[i][j] = this.m_defaultfillcolor;
						}
					}
				}
			} else {
				this.m_heatMapCellColor[i][j] = this.m_defaultfillcolor;
			}
		}
	}
};
HeatMapChart.prototype.getRangeColorForData = function (data) {
	for (var i = 0; i < this.m_range.length; i++) {
		if (this.m_range1[i] * 1 <= data * 1 && data * 1 < this.m_range2[i] * 1){
			return this.m_color[i];
		}
	}
	if (data * 1 < this.m_range1[0] * 1){
		return this.m_color[i];
	}else if (data * 1 >= this.m_range1[this.m_range.length - 1] * 1){
		return this.m_color[this.m_range.length - 1];
	}else{
		return this.m_defaultfillcolor;
	}
};
HeatMapChart.prototype.setHeatMapCells = function () {
	var xPosition = this.m_startX;
	var yPosition = this.m_startY;
	var cellWidth;
	var cellHeight;
	this.m_HeatMapCellWidth = cellWidth = this.m_heatWidth / this.m_seriesData[0].length;
	this.m_HeatMapCellHeight = cellHeight = this.m_heatHeight / this.m_seriesData.length;

	for (var i = 0; i < this.m_seriesData.length; i++) {
		this.m_heatMapCell[i] = [];
		for (var j = 0; j < this.m_seriesData[i].length; j++) {
			this.m_heatMapCell[i][j] = new HeatMapCell();
			if (this.m_seriesData[i][j] != null) {
				//if(!IsBoolean(this.m_displaySeriesDataFlag[i][j]))
				// this.m_seriesData[i][j] = this.getNumberWithCommas(this.m_seriesData[i][j]);
				this.m_heatMapCell[i][j].init(xPosition * 1 + cellWidth * j, yPosition - cellHeight * (i + 1), cellWidth, cellHeight, this.m_heatMapCellColor[i][j], this.m_additionalFieldData[i][j], this.m_displaySeriesDataFlag[i][j], this);
			} else {
				console.log("No data for this cell");
			}
		}
	}
};
HeatMapChart.prototype.getHeatMapCellWidth = function () {
	return this.m_HeatMapCellWidth;
};
HeatMapChart.prototype.getHeatMapCellHeight = function () {
	return this.m_HeatMapCellHeight;
};
/*
HeatMapChart.prototype.draw = function () {
	this.init();
	this.drawChart();
	if (this.plugin != undefined && this.plugin != null) {
		this.plugin.initPlugin(this);
	}
};*/
HeatMapChart.prototype.drawChart = function () {
	//this.ctx.clearRect(this.m_x, this.m_y, this.m_width, this.m_height);
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	var map = this.IsDrawingPossible();
	if (IsBoolean(map.permission)) {
		this.drawXAxis();
		this.drawYAxis();
		if (IsBoolean(this.m_showfrequencybar))
			this.drawFrequencyBar();
		this.drawHeatMap();
	} else {
		this.drawSVGMessage(map.message);
	}
};

HeatMapChart.prototype.drawFrequencyBar = function () {
	this.drawFrequencyBarCell();
	this.drawFrquencyText();
};
HeatMapChart.prototype.drawFrquencyText = function () {
	var temp = this;
	var xPos = this.m_xPosofFrequency * 1 + this.m_widthofFrequency * 1 ;
	var yPos = this.getYPositionForFrequencyMarking();
	for (var i = 0; i < this.m_frequencyRange.length; i++) {
	var text = drawSVGText(xPos+(IsBoolean(this.m_updateddesign) ? 10 : 0), yPos[i]+5, this.m_frequencyRange[i], "black", "", "start");
	$(text).css({
		"font-family": selectGlobalFont(temp.m_celltextfontfamily),
		"font-style": temp.m_celltextfontstyle,
		"font-size": temp.fontScaling(temp.m_celltextfontsize) +"px",
		"font-weight": temp.m_celltextfontweight
	});
	$("#" + temp.svgContainerId).append(text);
	}
};
HeatMapChart.prototype.getYPositionForFrequencyMarking = function () {
	var yPos = [];
	for (var i = 0; i < this.m_frequencyRange.length; i++) {
		yPos[i] = this.m_yPosofFrequency[i];
	}
	//if(!IsBoolean(this.m_showdynamicrange))
		//yPos[this.m_frequencyRange.length - 1] = this.m_yPosofFrequency[this.m_yPosofFrequency.length - 1] * 1 + this.m_heightofFrequency * 1;
	return yPos;
};
HeatMapChart.prototype.drawFrequencyBarCell = function () {
	if (IsBoolean(this.m_showdynamicrange)) {
	    this.dynamicFrequencyColors();
	} else {
	    this.rangeFrequencyColors();
	}
};
/** @description overrite drawObject Method  because of ChartFrame and Titles are drawn on SVG  **/
HeatMapChart.prototype.drawObject = function () {
	this.drawSVGObject();
};
/** @description calculate and draw frequency bar color when dynamic color is true **/
HeatMapChart.prototype.dynamicFrequencyColors = function () {
	var temp = this;
	for (var i = 0; i < this.m_frequencyRange.length - 1; i++) {
	    var linearGradient = document.createElementNS(NS, "linearGradient");
	    linearGradient.setAttribute("id", "freqgradient" + i + temp.m_objectid);
	    linearGradient.setAttribute("gradientTransform", "rotate(90)");
	    $("#" + temp.svgContainerId).append(linearGradient);

	    var colors = [];
	    colors.push(this.m_minrangecolor);
	    colors.push(this.m_maxrangecolor);
	    var step = (100 / (((colors.length - 1) != 0) ? (colors.length - 1) : 1));
	    for (var k = 0; k < colors.length; k++) {
	        stop = document.createElementNS(NS, "stop");
	        stop.setAttribute("offset", (k * step) + "%");
	        stop.setAttribute("stop-color", colors[k]);
	        stop.setAttribute("stop-opacity", this.m_bgalpha);
	        $(linearGradient).append(stop);
	    }

	    var rect = drawSVGRect(this.m_xPosofFrequency, this.m_yPosofFrequency[i], this.m_widthofFrequency, this.m_heightofFrequency, "#000000");
	    $(rect).attr("id", "GradientRect" + temp.m_objectid);
	    $(rect).attr("fill", "url(#freqgradient" + i + temp.m_objectid + ")");
	    $("#" + temp.svgContainerId).append(rect);
	}
};
/** @description calculate and draw frequency bar color when dynamic color is false **/
HeatMapChart.prototype.rangeFrequencyColors = function () {
	var temp = this;
	for (var i = 0; i < this.m_range.length; i++) {
	    var linearGradient = document.createElementNS(NS, "linearGradient");
	    linearGradient.setAttribute("id", "freqgradient" + i + temp.m_objectid);
	    linearGradient.setAttribute("gradientTransform", "rotate(90)");
	    $("#" + temp.svgContainerId).append(linearGradient);

	    var colors = [];
	    if (i == 0) {
	        colors.push("#ffffff");
	        colors.push(this.m_color[i]);
	    } else {
	        colors.push(this.m_color[i - 1]);
	        colors.push(this.m_color[i]);
	    }
	    var step = (100 / (((colors.length - 1) != 0) ? (colors.length - 1) : 1));
	    for (var k = 0; k < colors.length; k++) {
	        stop = document.createElementNS(NS, "stop");
	        stop.setAttribute("offset", (k * step) + "%");
	        stop.setAttribute("stop-color", colors[k]);
	        stop.setAttribute("stop-opacity", this.m_bgalpha);
	        $(linearGradient).append(stop);
	    }

	    var rect = drawSVGRect(this.m_xPosofFrequency, this.m_yPosofFrequency[i], this.m_widthofFrequency, this.m_heightofFrequency, "#000000");
	    $(rect).attr("id", "GradientRect" + temp.m_objectid);
	    $(rect).attr("fill", "url(#freqgradient" + i + temp.m_objectid + ")");
	    $("#" + temp.svgContainerId).append(rect);
	}
};

HeatMapChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawSVGFrame();
};

HeatMapChart.prototype.drawTitle = function () {
	this.m_title.draw();
};
HeatMapChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};
HeatMapChart.prototype.drawXAxis = function () {
	this.m_xAxis.markXaxis();
	this.drawXAxisLine();
};
/** @description drawing X axis line **/
HeatMapChart.prototype.drawXAxisLine = function() {
	var temp = this;
	if (IsBoolean(this.m_xAxis.m_showlinexaxis)) {
		var msfx = 1;
		/** msfx = margin space from x - axis 1 px **/
		var lineWidth = 0.5;
		var x1 = this.m_startX * 1 - this.m_axistodrawingareamargin;
		var y1 = this.m_startY * 1 + msfx * 1 + this.m_axistodrawingareamargin;
		var x2 = this.m_endX * 1 + msfx * 1;
		var y2 = this.m_startY * 1 + msfx * 1 + this.m_axistodrawingareamargin;
		var xAxisLine = drawSVGLine(x1,y1,x2,y2,lineWidth,this.m_xAxis.m_linexaxiscolor);
		$("#" + temp.svgContainerId).append(xAxisLine);
	}
};

HeatMapChart.prototype.drawYAxis = function () {
	this.createYAxisMarkerLabelGroup('yaxislabelgrp');
	this.m_yAxis.markYaxiss();
	this.m_yAxis.drawYAxis();
};
HeatMapChart.prototype.drawHeatMap = function () {
	for (var i = 0; i < this.m_seriesData.length; i++) {
		if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
			this.createHeatMapRectBoxGroup(this.m_heatMapCell[i],"rectboxgrp", i ,this.m_seriesNames[i]);
			this.createHeatMapBoxLabelGroup(this.m_heatMapCell[i],"datalabelgrp", i ,this.m_seriesNames[i]);
			for (var j = 0; j < this.m_seriesData[i].length; j++) {
				if (this.m_seriesData[i][j] != null) {
					this.m_heatMapCell[i][j].createCell(i,j);
					this.m_heatMapCell[i][j].drawText(i);
				} else {
					console.log("for empty string");
				}
			}
		}
	}
};

HeatMapChart.prototype.getYAxisLabelMargin = function () {
	var lm = 0;
	var lw = this.getLabelWidth();
	lm = lw * 1;
	return lm;
};
HeatMapChart.prototype.getLabelWidth = function () {
	var lw = 0;
	var series = this.getSeriesDisplayNames();
	if(this.fontScaling(this.m_yAxis.m_labelfontsize) > 0){
		for (var i = 0; i < series.length; i++) {
			if (series[i].length > 25) {
			    series[i] = series[i].substring(0, 24) + "...";
			}
			this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
			var width = this.ctx.measureText(series[i]).width;

			if (width > lw)
				lw = width;
		}
	}
	return lw;
};
HeatMapChart.prototype.getMinimumSeriesValue = function () {
	return this.m_minimumseriesvalue;
};
HeatMapChart.prototype.getMaximumSeriesValue = function () {
	return this.m_maximumSeriesValue;
};
HeatMapChart.prototype.setMaxMinSeriesValue = function () {
	this.m_maximumSeriesValue = 0;
	this.m_minimumseriesvalue = 0;
	for (var i = 0; i < this.m_seriesData.length; i++) {
		for (var j = 0; j < this.m_seriesData[i].length; j++) {
			var data = this.m_seriesData[i][j];
			data = (isNaN(data) || data == undefined || data == "") ? 0 : data;
			if (i == 0 && j == 0) {
				this.m_maximumSeriesValue = data;
				this.m_minimumseriesvalue = data;
			}
			if (this.m_maximumSeriesValue * 1 <= data * 1) {
				this.m_maximumSeriesValue = data;
			}
			if (this.m_minimumseriesvalue * 1 > data * 1) {
				this.m_minimumseriesvalue = data;
			}
		}
	}
};
HeatMapChart.prototype.setEndX = function () {
	var blm = this.getBorderToLegendMargin();
	var vlm = this.getVerticalLegendMargin();
	var vsm = this.getVerticalLegendToXAxisMargin();
	this.m_endX = 1 * (this.m_x) + 1 * (this.m_width) - blm * 1 - vlm * 1 - vsm * 1;
};
HeatMapChart.prototype.getVerticalLegendMargin = function () {
	return (IsBoolean(this.getShowLegends())) ? 40 : 20;
};
HeatMapChart.prototype.setStartY = function () {
	var cm = this.getChartMargin();
	this.m_startY = (this.m_y * 1 + this.m_height * 1) - cm - this.getXAxisLabelMargin() - this.getXAxisDescriptionMargin();
};
HeatMapChart.prototype.getXAxisLabelMargin = function () {
	var xAxislabelDescMargin = this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.8;
	var radians = this.m_xAxis.m_labelrotation * (Math.PI / 180); 
	this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
	if (IsBoolean(this.m_xAxis.getLabelTilted())) {
		for (var i = 0; i < this.m_categoryData.length; i++) {
			for (var j = 0; j < this.m_categoryData[i].length; j++) {
				var markerWidth = Math.abs(this.ctx.measureText(this.m_categoryData[i][j]).width * radians);
				xAxislabelDescMargin = (xAxislabelDescMargin <= markerWidth) ? markerWidth : xAxislabelDescMargin;
			}
		}
		if (xAxislabelDescMargin > (this.m_height / 4 - this.getXAxisDescriptionMargin())) {
			xAxislabelDescMargin = this.m_height / 4 - this.getXAxisDescriptionMargin();
		}
	} else {
		var xlm = this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.8;
		this.noOfRows = this.setNoOfRows();
		xAxislabelDescMargin = (xlm) * this.noOfRows;
	}
	return xAxislabelDescMargin;
};
HeatMapChart.prototype.setNoOfRows = function () {
	this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
	var noOfRow = 1;
	if (!IsBoolean(this.isEmptyCategory)) {
		var textWidth = this.ctx.measureText(this.m_categoryData[0][0]).width;
		var xDivision = (this.getEndX() - this.getStartX()) / this.m_categoryData.length;
		for (var i = 1; i < this.m_categoryData.length; i++) {
			if (this.ctx.measureText(this.m_categoryData[i][0]).width > xDivision){
				noOfRow = 2;
				if(IsBoolean(this.m_xAxis.m_xaxistextwrap) && this.m_xAxis.getDescription() !== ""){
					noOfRow = 3;
				}
				/*added above condition to improve label visibility on maximize mode and for lengthy x-axis labels @BDD-678 */
				break;
			}
		}
	}
	return noOfRow;
};
HeatMapChart.prototype.getStartX = function () {
	return this.m_startX;
};
HeatMapChart.prototype.setStartX = function () {
	this.yaxisLabelFont = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
	this.yaxisDescriptionFont = this.m_yAxis.m_fontstyle + " " + this.m_yAxis.m_fontweight + " " + this.fontScaling(this.m_yAxis.m_fontsize) + "px " + selectGlobalFont(this.m_yAxis.m_fontfamily);
	var btdm = this.getBorderToDescriptionMargin();
	var dm = this.getYAxisDescriptionMargin();
	var dtlm = this.getDescriptionToLabelMargin();
	var ltam = this.getLabelToAxisMargin();
	this.setMaxMinSeriesValue();
	var lm = this.getYAxisLabelMargin();
	this.m_startX = this.m_x * 1 + btdm * 1 + dm * 1 + dtlm * 1 + lm * 1 + ltam * 1;
};
HeatMapChart.prototype.setEndY = function () {
	this.m_endY = (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1) + this.getMarginForTooltip();
};
HeatMapChart.prototype.setDataInOneDArray = function () {
	this.m_data = [];
	for (var i = 0; i < this.m_categoryNames.length; i++) {
		for (var j = 0; j < this.m_categoryData.length; j++) {
			this.m_data[j] = this.m_seriesData[i][j] * 1;
		}
	}
	this.m_sortedData = this.m_data.sort(numOrdD);
};
HeatMapChart.prototype.drawLegendContentDiv = function () {
	var temp = this;
	var div = this.getLegendContentDiv();
	var legendTable = "<table class=\"legend\">";
	for (var i = 0; i < this.getDisplayNameForLegend().length; i++) {
		legendTable += "<tr style=\"font-style:" + this.m_legendfontstyle + ";color:" + convertColorToHex(this.m_legendfontcolor) + ";text-decoration:" + this.m_legendtextdecoration + ";font-weight:" + this.m_legendfontweight + ";font-family:" + selectGlobalFont(this.m_legendfontfamily) + "\">"+
							"<td><span style=\"background-color:" + this.m_color[i] + "; width:10px;height:10px;\"></span></td>"+
							"<td><span style=\"display:inline;\">" + this.m_rangeForLegend[i] + "</span></td><td><span style=\"display:inline;\">" + this.getDisplayNameForLegend()[i] + "</span></td></tr>";
	}
	legendTable += "</table>";
	$(div).append(legendTable);
	
	/**Set component legend container background css property object*/
	var legendBGColor = convertColorToHex(temp.m_legendbackgroundcolor);
	$(div).find(".legend").css("background-color", hex2rgb(legendBGColor, temp.m_legendbackgroundtransparency));
	$(div).find("td").each(function () {
		$(this).css({
			"background-color": hex2rgb(legendBGColor, temp.m_legendbackgroundtransparency),
			"font-size" : temp.m_legendfontsize + "px"
		})
	});
	
	var legendsDivheight = $("#legendContent" + this.m_objectid).height();
	if (legendsDivheight * 1 > (this.m_height * 1 - 35)) {
		$("#legendContent" + this.m_objectid).css("height", (this.m_height * 1 - 35) + "px");
		$("#legendContent" + this.m_objectid).css("overflow-x", "hidden");
	}
	var tbl = div.getElementsByTagName("table");
	var divwidth = tbl[0].offsetWidth;
	if (divwidth == 0) {
		divwidth = 119;
	} else {
		if (legendsDivheight * 1 > (this.m_height * 1 - 35)){
			divwidth = divwidth + 20;
		}else{
			divwidth = divwidth + 10;
		}
	}
	div.style.width = divwidth + "px";
	div.style.left = (this.m_width - divwidth - 25) + "px";
	if(IsBoolean(this.m_hidelegendonstart)) {
		/*LKD - BBSS-886 legend coming and goes off issue*/
		$(div).css("display","none");
	}
};
HeatMapChart.prototype.getToolTipData = function (mouseX, mouseY) {
	var toolTipData;
	if ((IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None"))) {
		if (mouseX >= this.m_startX && mouseX <= this.getEndX()) {
			if (mouseY >= this.getEndY() && mouseY <= this.m_startY) {
				for (var count = 0; count < this.m_seriesData.length; count++) {
					/** visibility is set according to series-names - use getSeriesNames instead of getVisibleSeriesDisplayNames **/ 
					if (IsBoolean(this.m_seriesVisibleArr[this.getSeriesNames()[count]])) {
						for (var count1 = 0; count1 < this.m_seriesData[0].length; count1++) {
							if (mouseX >= this.m_heatMapCell[count][count1].m_xPosition && mouseX <= this.m_heatMapCell[count][count1].m_xPosition + this.m_heatMapCell[count][count1].m_cellWidth) {
								if (mouseY >= this.m_heatMapCell[count][count1].m_yPosition && mouseY <= this.m_heatMapCell[count][count1].m_yPosition + this.m_heatMapCell[count][count1].m_cellHeight) {
									toolTipData = {};
									if (IsBoolean(this.m_customtextboxfortooltip.dataTipType == "Default")) {
										toolTipData.cat = "";
										toolTipData["data"] = new Array();
										toolTipData.cat = this.m_categoryData[count1];
										var data = [];
										var newVal;
										//data[0] = this.m_heatMapCell[count][count1].m_cellColor;
										data[0] = {"color":this.m_heatMapCell[count][count1].m_cellColor,"shape":this.legendMap[this.getSeriesNames()[count]].shape};
										data[1] = this.getVisibleSeriesDisplayNames()[count];
										var check = this.m_seriesData[count][count1];
										var num = (isNaN(check))?check:this.m_seriesData[count][count1] * 1;
										if (num % 1 != 0 && this.m_tooltipprecision !== "default") {
											newVal = num.toFixed(this.m_tooltipprecision);
										} else {
											newVal = (isNaN(check))?check:this.m_seriesData[count][count1] * 1;
										}
										var FormterData = this.getUpdatedFormatterForToolTip(newVal, this.getSeriesNames()[count]);
										data[2] = FormterData;
										toolTipData.data.push(data);
										break;
									}else{
										toolTipData = this.getDataProvider()[count1];
									}
								}
							}
						}
					}
				}
			}
		} else {
			this.hideToolTip();
		}
	}
	return toolTipData;
};
HeatMapChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory))) && IsBoolean(this.isVisibleSeries())) {
		if (mouseX >= this.m_startX && mouseX <= this.getEndX()) {
			if (mouseY >= this.getEndY() && mouseY <= this.m_startY) {
				for (var count = 0; count < this.m_seriesData.length; count++) {
					for (var count1 = 0; count1 < this.m_seriesData[0].length; count1++) {
						if (IsBoolean(this.m_seriesVisibleArr[this.getSeriesNames()[count]])) {
							if (mouseX >= this.m_heatMapCell[count][count1].m_xPosition && mouseX <= this.m_heatMapCell[count][count1].m_xPosition + this.m_heatMapCell[count][count1].m_cellWidth) {
								if (mouseY >= this.m_heatMapCell[count][count1].m_yPosition && mouseY <= this.m_heatMapCell[count][count1].m_yPosition + this.m_heatMapCell[count][count1].m_cellHeight) {
									var fieldNameValueMap = this.getFieldNameValueMap(count1);
									var drillColor = this.m_heatMapCell[count][count1].m_cellColor;
									var drillField = this.getSeriesNames()[count];
									var drillDisplayField = this.getVisibleSeriesDisplayNames()[count];
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
			}
		}
	}
};
HeatMapChart.prototype.getFormatterText = function (data) {
	return (!IsBoolean(this.getFixedLabel())) ? this.m_yAxis.getFormattedText(data) : data;
};

function HeatMapCalculation() {
	this.m_xAxisPixelArray = [];
	this.m_yAxisPixelArray = [];
	this.SeriesColorForOverlaid = [];
	this.m_max = 0;
	this.m_columnGap;
	this.m_numberOfMarkers = 6;
	this.m_percentileValue;
	this.m_yAxisText;
	this.m_xpixelArray = [];
	this.m_ypixelArray = [];
	this.m_stackHeightArray = [];
	this.m_yAxisMarkersArray = [];

	this.m_startX;
	this.m_startY;
	this.m_endX;
	this.m_endY;
	this.m_chartYMargin;
	this.m_chartEndXMargin;
	this.m_chartTitleMargin = 0;
	this.m_chartSubTitleMargin = 0;
	this.m_util = new Util();

	this.ctx = "";
};
HeatMapCalculation.prototype.init = function (m_chart, m_categoryData, m_seriesData) {
	this.m_chart = m_chart;
	this.m_globalCalculation = m_chart;
	this.m_xAxisData = m_categoryData;
	this.m_yAxisData = m_seriesData;

	this.m_startX = this.m_globalCalculation.getStartX();
	this.m_startY = this.m_globalCalculation.getStartY();
	this.m_endX = this.m_globalCalculation.getEndX();
	this.m_endY = this.m_globalCalculation.getEndY();

	this.m_chartType = this.m_chart.getChartType();
	this.setDrawHeight();
	this.setDrawWidth();
	this.m_columnGap = 10;
	this.calculateBarWidth();
	this.calculateMaxValue();
	this.setRatio();
	this.setxPixelArray();
	this.setyPixelArray();
	this.setstackHeightArray();
	//this.setYAxisText();
	this.setYAxisMarkersArray();
};
HeatMapCalculation.prototype.calculateMaxValue = function () {
	if (this.m_chartType == "Clustered" || this.m_chartType == "clustered" || this.m_chartType == "Overlaid" || this.m_chartType == "overlaid") {
		this.calculateMax = 0;
		this.calculateMin = 0;
		var data = [];
		for (var i = 0, k = 0; i < this.m_yAxisData.length; i++) {
			for (var j = 0; j < this.m_yAxisData[i].length; j++) {
				data[k++] = (this.m_yAxisData[i][j]);
			}
		}
		var sortedData = data.sort(numOrdA);
		this.calculateMin = sortedData[0];
		for (i = 0; i < this.m_yAxisData.length; i++) {
			for (j = 0; j < this.m_yAxisData[i].length; j++) {
				if (1 * (this.m_yAxisData[i][j]) >= this.calculateMax) {
					this.calculateMax = 1 * (this.m_yAxisData[i][j]);
				}
				if (1 * (this.m_yAxisData[i][j]) <= this.calculateMin) {
					this.calculateMin = 1 * (this.m_yAxisData[i][j]);
				}
			}
		}
	}
	if (this.m_chartType == "Stacked" || this.m_chartType == "stacked" || this.m_chartType == "100%" || this.m_chartType == "") {
		this.calculateMax = this.m_yAxisData[0][0] * 1;
		var data = [];
		for (var i = 0, k = 0; i < this.m_yAxisData[0].length; i++) {
			var height = 0;
			for (var j = 0; j < this.m_yAxisData.length; j++) {
				data[k++] = (this.m_yAxisData[j][i] * 1);
				height = (height) * 1 + (this.m_yAxisData[j][i] * 1) * 1;
			}
			if ((height) >= (this.calculateMax)) {
				this.calculateMax = height * 1;
			}
		}
		var sortedData = data.sort(numOrdA);
		this.calculateMin = sortedData[0] * 1;
	}
};
HeatMapCalculation.prototype.getMaxValue = function () {
	var maxDivisor;
	if (IsBoolean(this.m_chart.isAxisSetup())) {
		maxDivisor = getMax(this.calculateMax - this.minValue());
		this.max = maxDivisor[0] * 1 + this.minValue() * 1;

	} else {
		if (IsBoolean(this.m_chart.isBaseZero())) {
			maxDivisor = getMax(this.calculateMax * 1);
			this.max = maxDivisor[0];
		} else {
			maxDivisor = getMax(this.m_chart.m_maximumaxisvalue - this.minValue());
			this.max = maxDivisor[0] * 1 + this.minValue() * 1;
		}
	}

	if ((this.m_chartType == "100%") && IsBoolean(this.m_chart.isAxisSetup()) && !IsBoolean(this.m_chart.isBaseZero())) {
		this.m_yAxisText = 20;
		this.m_numberOfMarkers = 6;
	} else {
		this.m_numberOfMarkers = maxDivisor[1] * 1 + 1 * 1;
		this.m_yAxisText = maxDivisor[2];
	}
	return this.max;
};
HeatMapCalculation.prototype.minValue = function () {
	if (IsBoolean(this.m_chart.isBaseZero()) && !IsBoolean(this.m_chart.isAxisSetup())) {
		this.min = 0;
	} else if (IsBoolean(this.m_chart.isAxisSetup())) {
		if ((this.calculateMin * 1 < 0) && (this.m_chartType != "100%"))
			this.min = this.calculateMin * 1;
		else
			this.min = 0;
	} else {
		this.min = this.m_chart.m_minimumaxisvalue;
	}
	if (this.min >= 0) {
		this.min = getMin(this.min);
	} else {
		if (Math.abs(this.min) > 1) {
			this.min = -getMax(Math.abs(this.min))[0];
		} else if (this.calculateMax > 1) {
			this.min = Math.floor(this.min);
		} else {
			this.min = this.min;
		}
	}
	return this.min;
};
HeatMapCalculation.prototype.getYAxisText = function () {
	return this.m_yAxisText;
};
HeatMapCalculation.prototype.setYAxisText = function () {
	if (this.getMaxValue() <= 5) {
		var value = (this.getMaxValue());

		if (value == 1)
			this.m_numberOfMarkers = 2;
		if (value == 2)
			this.m_numberOfMarkers = 3;
		if (value == 3)
			this.m_numberOfMarkers = 4;
		if (value == 4)
			this.m_numberOfMarkers = 5;
		if (value == 5)
			this.m_numberOfMarkers = 6;
		if (value == 6)
			this.m_numberOfMarkers = 7;

		var markers = this.m_numberOfMarkers - 1;

		var text = (value / markers);

		if (text < 1)
			text = text.toFixed(2);
		else
			text = (text);

		this.m_yAxisText = text;
	}
};
HeatMapCalculation.prototype.getPercentile = function (value) {
	var percentileValue = value % 10;
	if (percentileValue !== 10) {
		percentileValue = 10 - percentileValue;
	}
	return percentileValue;
};
HeatMapCalculation.prototype.getYAxisMarkersArray = function () {
	return this.m_yAxisMarkersArray;
};
HeatMapCalculation.prototype.setYAxisMarkersArray = function () {
	this.m_yAxisMarkersArray = [];
	var min = this.minValue();
	if (IsBoolean(this.m_chart.isAxisSetup())) {
		for (var i = 0; i < this.m_numberOfMarkers; i++) {
			var temp = (min * 1 + (this.getYAxisText() * i));
			this.m_yAxisMarkersArray[i] = IsBoolean(this.isInt(temp)) ? temp : temp.toFixed(4);
		}
	} else {
		if (IsBoolean(this.m_chart.isBaseZero())) {
			for (var i = 0; i < this.m_numberOfMarkers; i++) {
				if (this.yAxisText > 1) {
					var temp = (this.getYAxisText() * i);
					this.m_yAxisMarkersArray[i] = IsBoolean(this.isInt(temp)) ? temp : temp.toFixed(4);
				} else {
					var temp = (this.getYAxisText() * i);
					this.m_yAxisMarkersArray[i] = IsBoolean(this.isInt(temp)) ? temp : temp.toFixed(2);
				}
			}
		} else {
			for (var i = 0; i < this.m_numberOfMarkers; i++) {
				var temp = (min * 1 + (this.getYAxisText() * i));
				this.m_yAxisMarkersArray[i] = IsBoolean(this.isInt(temp)) ? temp : temp.toFixed(4);
			}
		}
	}
};
HeatMapCalculation.prototype.isInt = function (n) {
	return typeof n === "number" && n % 1 == 0;
};
HeatMapCalculation.prototype.getDrawHeight = function () {
	return this.drawHeight;
};
HeatMapCalculation.prototype.setDrawHeight = function () {

	this.drawHeight = (this.m_startY - this.m_endY);
};

HeatMapCalculation.prototype.getDrawWidth = function () {
	return this.drawWidth;
};
HeatMapCalculation.prototype.setDrawWidth = function () {
	this.drawWidth = 1 * (this.m_endX) - 1 * (this.m_startX);
};
HeatMapCalculation.prototype.getRatio = function () {
	return this.ratio;
};
HeatMapCalculation.prototype.setRatio = function () {
	var diff = this.getMaxValue() - this.minValue();
	if (diff > 0)
		this.ratio = this.getDrawHeight() / (diff);
	else
		this.ratio = 1;
	if (this.m_chartType == "100%")
		this.setRatioForHundredPercent();
};
HeatMapCalculation.prototype.setRatioForHundredPercent = function () {
	this.m_hundredPercentsRatios = [];
	for (var i = 0; i < this.m_yAxisData[0].length; i++) {
		var sum = 0;
		for (var j = 0; j < this.m_yAxisData.length; j++) {
			if (this.m_yAxisData[j][i] * 1 < 0)
				this.m_yAxisData[j][i] = (Math.abs(this.m_yAxisData[j][i] * 1));
			sum = (sum) * 1 + (Math.abs(this.m_yAxisData[j][i] * 1));
		}
		this.m_hundredPercentsRatios[i] = (this.getDrawHeight() * 1 / sum * 1);
	}
};
HeatMapCalculation.prototype.calculateBarWidth = function () {
	var numberOfColumns = this.m_xAxisData.length;
	var totalGap = (1 * (numberOfColumns) + 1) * this.m_columnGap;
	var availableDrawWidth = (this.getDrawWidth() * 1 - totalGap * 1);
	var barWidth = (availableDrawWidth / numberOfColumns);
	if (barWidth > 40) {
		this.setBarWidth(40);
		this.setColumnGap(40);
	} else if (barWidth < 9) {
		this.setBarWidth(9);
		this.setColumnGap(9);
	} else {
		this.setBarWidth(barWidth);
	}
};
HeatMapCalculation.prototype.setBarWidth = function (barwidth) {
	this.barWidth = barwidth;
	if (this.m_chartType == "Clustered" || this.m_chartType == "clustered") {
		this.setBarWidthForClustered();
	}
};
HeatMapCalculation.prototype.setColumnGap = function (barWidth) {
	var totalBarwidth = barWidth * this.m_xAxisData.length;
	var totalGap = this.getDrawWidth() - totalBarwidth;
	this.m_columnGap = totalGap / (this.m_xAxisData.length + 1);
};
HeatMapCalculation.prototype.setBarWidthForClustered = function () {
	this.barWidth /= this.m_yAxisData.length;
};
HeatMapCalculation.prototype.getBarWidth = function () {
	return this.barWidth;
};
HeatMapCalculation.prototype.getColumnGap = function () {
	return this.m_columnGap;
};
HeatMapCalculation.prototype.getxPixelArray = function () {
	return this.m_xPixelArray;
};
HeatMapCalculation.prototype.setxPixelArray = function () {
	var m_xAxisPixelArray = [];
	for (var i = 0; i < this.m_yAxisData[0].length; i++) {
		m_xAxisPixelArray[i] = [];
		for (var j = 0; j < this.m_yAxisData.length; j++) {
			if (this.m_chartType == "Clustered" || this.m_chartType == "clustered") {
				m_xAxisPixelArray[i][j] = (this.m_startX) * 1 + (this.getBarWidth()) * 1 * j + (this.getColumnGap()) * 1 + ((this.getBarWidth()) * 1 * this.m_yAxisData.length + (this.getColumnGap()) * 1) * i;
			} else {
				m_xAxisPixelArray[i][j] = (this.m_startX) * 1 + (this.getBarWidth() * 1) * i + (this.getColumnGap() * 1) * (i + 1);
			}
		}
	}
	this.m_xPixelArray = this.transformXPixelArray(m_xAxisPixelArray);
};
HeatMapCalculation.prototype.transformXPixelArray = function (m_xAxisPixelArray) {
	var xPixelsarr = [];
	for (var i1 = 0; i1 < this.m_yAxisData.length; i1++) {
		xPixelsarr[i1] = [];
		for (var j1 = 0; j1 < this.m_yAxisData[0].length; j1++) {
			xPixelsarr[i1][j1] = m_xAxisPixelArray[j1][i1];
		}
	}
	return xPixelsarr;
};
HeatMapCalculation.prototype.getRatioForHundredPercent = function (index) {
	return this.m_hundredPercentsRatios[index] * 1;
};
HeatMapCalculation.prototype.setyPixelArray = function () {
	if (this.m_chartType == "Clustered" || this.m_chartType == "clustered") {
		this.m_ypixelArray = this.setyPixelArrayForClustered();
	} else if (this.m_chartType == "Overlaid" || this.m_chartType == "overlaid") {
		this.m_ypixelArray = this.setyPixelArrayForOverlaid();
	} else if (this.m_chartType == "100%") {
		this.m_ypixelArray = this.setyPixelArrayForHundredPercent();
	}
	if (this.m_chartType == "stacked" || this.m_chartType == "Stacked") {
		this.m_ypixelArray = this.setyPixelArrayForStacked();
	}
};
HeatMapCalculation.prototype.setyPixelArrayForClustered = function () {
	var yparray = [];
	for (var i = 0; i < this.m_yAxisData.length; i++) {
		yparray[i] = [];
		for (var j = 0; j < this.m_yAxisData[i].length; j++) {
			var ratio = this.getRatio();
			if (IsBoolean(this.m_chart.isAxisSetup())) {
				yparray[i][j] = ((this.m_startY) - (ratio) * ((this.m_yAxisData[i][j]))) + (ratio) * this.minValue();
			} else {
				if (IsBoolean(this.m_chart.isBaseZero())) {
					if (this.m_yAxisData[i][j] < 0)
						this.m_yAxisData[i][j] = 0;
					if (this.m_yAxisData[i][j] >= this.getMaxValue())
						this.m_yAxisData[i][j] = 0;
					yparray[i][j] = ((this.m_startY) - (ratio) * ((this.m_yAxisData[i][j]))) + (ratio) * this.minValue();
				} else {
					if ((this.m_yAxisData[i][j] >= this.m_chart.m_maximumaxisvalue * 1) || (this.m_yAxisData[i][j] < this.m_chart.m_minimumaxisvalue * 1))
						this.m_yAxisData[i][j] = 0;
					yparray[i][j] = ((this.m_startY) - (ratio) * ((this.m_yAxisData[i][j]))) + (ratio) * this.minValue();
				}
			}
		}
	}
	return yparray;
};
HeatMapCalculation.prototype.setSeriesColorForOverlaid = function (seriesColor) {
	this.SeriesColorForOverlaid = seriesColor;
};
HeatMapCalculation.prototype.getSeriesColorForOverlaid = function () {
	return this.SeriesColorForOverlaid;
};
HeatMapCalculation.prototype.setyPixelArrayForOverlaid = function () {
	var newYAxisData = this.arrangeDataForOverlaid();
	this.setSeriesColorForOverlaid(newYAxisData[1]);
	this.m_yAxisData = newYAxisData[0];
	var yparray = [];
	for (var i = 0; i < this.m_yAxisData.length; i++) {
		yparray[i] = [];
		for (var j = 0; j < this.m_yAxisData[i].length; j++) {
			var ratio = this.getRatio();
			if (IsBoolean(this.m_chart.isAxisSetup())) {
				yparray[i][j] = ((this.m_startY) - (ratio) * ((this.m_yAxisData[i][j]))) + (ratio) * this.minValue();
			} else {
				if (IsBoolean(this.m_chart.isBaseZero())) {
					if (this.m_yAxisData[i][j] < 0)
						this.m_yAxisData[i][j] = 0;
					if (this.m_yAxisData[i][j] > this.getMaxValue())
						this.m_yAxisData[i][j] = 0;
					yparray[i][j] = ((this.m_startY) - (ratio) * ((this.m_yAxisData[i][j]))) + (ratio) * this.minValue();
				} else {
					if ((this.m_yAxisData[i][j] > this.m_chart.m_maximumaxisvalue * 1) || (this.m_yAxisData[i][j] < this.m_chart.m_minimumaxisvalue * 1))
						this.m_yAxisData[i][j] = 0;
					yparray[i][j] = ((this.m_startY) - (ratio) * ((this.m_yAxisData[i][j]))) + (ratio) * this.minValue();
				}
			}
		}
	}
	return yparray;
};
HeatMapCalculation.prototype.arrangeDataForOverlaid = function () {
	var seriesColor = this.m_chart.getSeriesColors();
	var arrangeArray = [];
	var colorArray = [];
	for (var i = 0; i < this.m_yAxisData[0].length; i++) {
		arrangeArray[i] = [];
		colorArray[i] = [];
		for (var j = 0; j < this.m_yAxisData.length; j++) {
			arrangeArray[i][j] = this.m_yAxisData[j][i] * 1;
			colorArray[i][j] = seriesColor[j];
		}
	}
	var sortedData = this.sortingDataWithColor(arrangeArray, colorArray);
	var arrengeSeriesDataandColor = this.arrengeSeriesDataandColor(sortedData);
	return arrengeSeriesDataandColor;
};
HeatMapCalculation.prototype.sortingDataWithColor = function (arrangeArray, colorArray) {
	var m_seriesDataAndColor = [];
	for (var i = 0; i < arrangeArray.length; i++) {
		m_seriesDataAndColor[i] = [];
		for (var j = 0; j < arrangeArray[i].length; j++) {
			m_seriesDataAndColor[i][j] = [];
			m_seriesDataAndColor[i][j][0] = arrangeArray[i][j] * 1;
			m_seriesDataAndColor[i][j][1] = colorArray[i][j];
		}
	}

	for (var k = 0; k < m_seriesDataAndColor.length; k++) {
		m_seriesDataAndColor[k].sort(function (a, b) {
			return b[0] - a[0];
		});
	}
	return m_seriesDataAndColor;
};
HeatMapCalculation.prototype.arrengeSeriesDataandColor = function (sortedData) {
	var seriesArr = [];
	var colorArr = [];
	for (var i = 0; i < sortedData.length; i++) {
		seriesArr[i] = [];
		colorArr[i] = [];
		for (var j = 0; j < sortedData[i].length; j++) {
			seriesArr[i][j] = sortedData[i][j][0];
			colorArr[i][j] = sortedData[i][j][1];
		}
	}

	var finalSeriesData = [];
	var finalColor = [];
	for (var k = 0; k < seriesArr[0].length; k++) {
		finalSeriesData[k] = [];
		finalColor[k] = [];
		for (var l = 0; l < seriesArr.length; l++) {
			finalSeriesData[k][l] = seriesArr[l][k] * 1;
			finalColor[k][l] = colorArr[l][k];
		}
	}
	return [finalSeriesData, finalColor];
};
HeatMapCalculation.prototype.setyPixelArrayForHundredPercent = function () {
	var yparray = [];
	for (var i = 0; i < this.m_yAxisData.length; i++) {
		yparray[i] = [];
		for (var j = 0; j < this.m_yAxisData[i].length; j++) {
			var ratio = this.getRatioForHundredPercent(j) * 1;
			if (i > 0) {
				yparray[i][j] = (yparray[i - 1][j] * 1) - (ratio) * ((Math.abs(this.m_yAxisData[i][j])) * 1 - ratio / 100);
			} else {
				yparray[i][j] = ((this.m_startY * 1) - ((Math.abs(this.m_yAxisData[i][j] * 1)) * ratio));
			}
		}
	}
	return yparray;
};
HeatMapCalculation.prototype.setyPixelArrayForStacked = function () {
	var yparray = [];
	for (var i = 0; i < this.m_yAxisData.length; i++) {
		yparray[i] = [];
		for (var j = 0; j < this.m_yAxisData[i].length; j++) {
			if (isNaN(this.m_yAxisData[i][j]))
				this.m_yAxisData[i][j] = "";
			if (i > 0) {
				if (((this.m_yAxisData[i][j] * 1 < 0) && (this.m_yAxisData[i - 1][j] * 1 > 0)) || ((this.m_yAxisData[i][j] * 1 > 0) && (this.m_yAxisData[i - 1][j] * 1 < 0))) {
					if ((this.m_yAxisData[i][j] * 1 < 0))
						this.m_yAxisData[i][j] = 0;
					yparray[i][j] = (this.m_startY) * 1 - ((this.getRatio()) * ((this.m_yAxisData[i][j] * 1)) * 1) + (this.getRatio() * (this.minValue()));
				} else if (this.m_yAxisData[i][j] * 1 < 0) {
					this.m_yAxisData[i][j] = 0;
					yparray[i][j] = (this.m_startY) * 1 - ((this.getRatio()) * ((this.m_yAxisData[i][j] * 1)) * 1) + (this.getRatio() * (this.minValue()));
				} else {
					if ((this.m_yAxisData[i - 1][j] * 1 + this.m_yAxisData[i][j] * 1 >= this.getMaxValue()))
						this.m_yAxisData[i][j] = this.m_yAxisData[i][j] * 1 - this.m_yAxisData[i - 1][j] * 1;
					yparray[i][j] = (yparray[i - 1][j]) * 1 - ((this.getRatio() * 1) * ((this.m_yAxisData[i][j] * 1) * 1) * 1);
				}
			} else {
				if (this.m_yAxisData[i][j] * 1 < 0)
					this.m_yAxisData[i][j] = 0;
				if ((this.m_yAxisData[i][j] * 1 < this.minValue()) && (this.m_yAxisData[i][j] * 1 < 0) || (this.m_yAxisData[i][j] * 1 > this.getMaxValue()))
					this.m_yAxisData[i][j] = 0;
				yparray[i][j] = ((this.m_startY) - (this.getRatio() * 1) * ((this.m_yAxisData[i][j]) * 1)) + (this.getRatio()) * this.minValue();
			}
		}
	}
	return yparray;
};
HeatMapCalculation.prototype.getyPixelArray = function () {
	return this.m_ypixelArray;
};
HeatMapCalculation.prototype.calculationYpixcelForClusterTypeChart = function () {};

HeatMapCalculation.prototype.getstackHeightArray = function () {
	return this.m_stackHeightArray;
};
HeatMapCalculation.prototype.setstackHeightArray = function () {
	var stackHeightArray = [];
	for (var i = 0; i < this.m_yAxisData.length; i++) {
		stackHeightArray[i] = [];
		for (var j = 0; j < this.m_yAxisData[i].length; j++) {
			stackHeightArray[i][j] = this.getRatio();
			if (this.m_chartType === "Clustered" || this.m_chartType === "clustered" || this.m_chartType == "Stacked" || this.m_chartType == "stacked") {
				var ratio = this.getRatio();
				stackHeightArray[i][j] = (ratio * this.m_yAxisData[i][j]);
			} else if (this.m_chartType === "100%") {
				ratio = this.getRatioForHundredPercent(j) * 1;
				stackHeightArray[i][j] = Math.ceil(ratio * (Math.abs(this.m_yAxisData[i][j] * 1)));
			} else if (this.m_chartType === "Overlaid" || this.m_chartType === "overlaid") {
				var ratio = this.getRatio();
				stackHeightArray[i][j] = (ratio * this.m_yAxisData[i][j]);
			}
		}
	}
	this.m_stackHeightArray = stackHeightArray;
};
HeatMapCalculation.prototype.calculateSum = function (stacksDataArr) {
	var sum = 0;
	for (var i = 0; i < stacksDataArr.length; i++) {
		sum = (sum * 1) + (stacksDataArr[i] * 1);
	}
	return sum;
};

function HeatMapXaxis() {
	this.base = Xaxis;
	this.base();

	this.m_chart;
	this.m_chartCalculation;

	this.m_startX;
	this.m_startY;
	this.m_endX;
	this.m_endY;

	this.m_yAxisText = [];
	this.m_yAxisMarkersArray = [];

	this.m_labeltextalign = "right";
	this.m_axislinetotextgap = 2;

	this.m_unitSymbol;
	this.m_textUtil = new TextUtil();
	this.m_util = new Util();
	this.m_isSecondAxisFormatter = false;
	this.ctx = "";
};

HeatMapXaxis.prototype = new Xaxis;

HeatMapXaxis.prototype.markXaxis = function () {
	this.m_chart.createXAxisMarkerLabelGroup('xaxislabelgrp');
	this.drawAxisLabels();
	/*if (this.getDescription() != "") {
		this.drawDescription();
	}*/
	this.drawDescription();
};

/** @description will draw x-axis labels  with their text properties. **/
HeatMapXaxis.prototype.drawAxisLabels = function () {
	var temp = this;
	var m_axisLineToTextGap = this.calculateAxisLineToTextGap();
	var xAxisdatalength=this.m_xAxisData.length;
	for (var i = 0; i < xAxisdatalength; i++) {
		var barWidth = this.m_chart.getHeatMapCellWidth();
		var x = (this.m_startX) * 1 + (barWidth * (i) + (barWidth / 2));
		var axisToLabelMargin = 10;
		if(IsBoolean(this.m_updateddesign))
			var y = this.m_startY * 1 + m_axisLineToTextGap / 2 + axisToLabelMargin / 4 + this.calculateAxisLineToTextGap() / 2 ;
		else
			var y = this.m_startY * 1 + m_axisLineToTextGap / 2 + axisToLabelMargin * 1 + this.calculateAxisLineToTextGap() / 2 ;
		if (IsBoolean(this.m_chart.m_tickmarks)) {
			var tick = drawSVGLine(x, this.m_startY, x, this.m_startY * 1 + 8, "1", temp.m_chart.m_categorymarkingcolor);
			$("#xaxistickgrp" + temp.m_chart.m_objectid).append(tick);
		}
		var avlblheight, labelText, text;
		var dm = (this.getDescription() !== "") ? this.m_fontsize : 5;
		if (IsBoolean(this.getLabelTilted()) && this.m_labelrotation > 0) {
		    avlblheight = this.m_chart.m_height / 4 - m_axisLineToTextGap / 2 - dm - this.calculateAxisLineToTextGap() / 2;
		    if (IsBoolean(this.m_xaxistextwrap)) {
		    	//textwrap is true
		        labelText = this.m_xAxisData[i];
		        text = this.drawSVGTextForCategory(x, y, labelText, this.m_labelfontcolor, "center", "start", this.getLabelrotation(), avlblheight);
		    } else {
		        this.ctx.font = this.getLabelFontProperties();
		        labelText = this.getText("" + this.m_xAxisData[i], avlblheight, this.getLabelFontProperties());
		        text = drawSVGText(x, y, labelText, this.m_labelfontcolor, "center", "start", this.getLabelrotation());
		    }
		} else {
			avlblheight = ((this.m_chart.m_endX - this.m_chart.m_startX) / this.m_xAxisData.length);
		    if (IsBoolean(this.m_xaxistextwrap)) {
		    	//textwrap is true
		        labelText = this.m_xAxisData[i];
		        text = this.drawSVGTextForCategory(x, y, labelText, this.m_labelfontcolor, "center", "start", this.getLabelrotation(), avlblheight);
		    } else {
		        labelText = this.getText("" + this.m_xAxisData[i], avlblheight, this.getLabelFontProperties());
		        text = drawSVGText(x, y, labelText, this.m_labelfontcolor, "center", "start", this.getLabelrotation());
		    }
		}
		//text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getLabelFontSize()) + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getLabelTextDecoration() + ";");
		$("#xaxislabelgrp" + temp.m_chart.m_objectid).append(text);
	}
};

/*@description added below method to calculate text wrap and plot text for x-axis labels*/
HeatMapXaxis.prototype.drawSVGTextForCategory= function(x, y, text, fillColor, hAlign, Valign, angle,avlblWidth) {
	var newText = document.createElementNS(NS, "text");
	// set the below method to return the 3 lines label arrays
	var labelText = this.getTexts("" + text, avlblWidth, this.getLabelFontProperties());
	if(labelText.length == 1) {
		if (!isNaN(x) && !isNaN(y)) {
			newText.setAttribute("x", x);
			newText.setAttribute("y", y);
			newText.setAttribute("fill", fillColor);
			if (angle !== "" && angle !== undefined && angle !== 0)
				newText.setAttribute("transform", "rotate(" + angle + " " + x + "," + y + ")");
			newText.textContent = labelText[0];
			newText.setAttribute("text-anchor", getSVGAlignment(hAlign));
			newText.setAttribute("alignment-baseline", Valign);
		}
		return newText;
	} else {
		if (!isNaN(x) && !isNaN(y)) {
			//newText.setAttribute("x", x);
			newText.setAttribute("y", y);
			newText.setAttribute("fill", fillColor);
			if (angle !== "" && angle !== undefined && angle !== 0)
				newText.setAttribute("transform", "rotate(" + angle + " " + x + "," + y + ")");
			newText.setAttribute("text-anchor", getSVGAlignment(hAlign));
			newText.setAttribute("alignment-baseline", Valign);
			for(var i = 0; i < labelText.length; i++) {
				var spanElement = document.createElementNS(NS, "tspan");
				if(i == 0){
					spanElement.setAttribute("x", x);
				} else {
					spanElement.setAttribute("x", x);
					spanElement.setAttribute("dy", this.m_chart.fontScaling(this.getLabelFontSize()) * 1);
				}
				spanElement.textContent = labelText[i];
				newText.appendChild(spanElement);
			}
		}
		return newText;
	}
};

/*@description added below method to split x-axis label text to multiple lines when textwrap is enabled*/
HeatMapXaxis.prototype.getTexts = function(text1, textWidth, ctxFont) {
	var text = "" + text1;
	var labelTexts = [];
	this.ctx.font = ctxFont;
	var strWidth = this.ctx.measureText(text).width;

	var words = text.split(' ');
	var line = '';
	if (strWidth > textWidth) {
	    for (var j = 0; j <= words.length; j++) {
	        var testLine = line + words[j] + ' ';
	        var metrics = this.ctx.measureText(testLine);
	        var testWidth = metrics.width;
	        this.m_chart.m_xaxislabellines =(this.m_chart.getHeatMapCellWidth() < textWidth && IsBoolean(this.getLabelTilted())) ? 2 : 3;
	        if (labelTexts.length == this.m_chart.m_xaxislabellines) {
	            break;
	        }
	        var fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
	        var actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
	        if (testWidth > textWidth && j > 0) {
	        	if(this.ctx.measureText(line).width > textWidth){
	        		labelTexts.push(this.getText(line, textWidth, ctxFont));
	        	} else if(line.replace(/\s/g,"") !== ""){
	            	labelTexts.push(line);
	        	}
	        	line = words[j] + ' ';
	        } else if ((j == words.length) && (testWidth < textWidth)) {
	            labelTexts.push(line);
	        } else {
	            line = testLine;
	        }
	    }
	    if ((labelTexts[this.m_chart.m_xaxislabellines - 1]) && (this.ctx.measureText(labelTexts[this.m_chart.m_xaxislabellines - 1]).width >= textWidth)) {	       
	        labelTexts[this.m_chart.m_xaxislabellines - 1] = this.getText(labelTexts[this.m_chart.m_xaxislabellines - 1], textWidth, ctxFont);
	    }
	} else {
	    labelTexts.push(text);
	}
	return labelTexts;
};

HeatMapXaxis.prototype.drawDescription = function () {
	var temp = this;
	var fontSize = temp.m_chart.fontScaling(temp.getFontSize()) * 1;
	var dsDec=this.m_chart.m_allCategoryDisplayNames.join("");
	var description=(IsBoolean(this.m_chart.m_xAxis.m_showdatasetdescription)) ? this.m_chart.formattedDescription(this.m_chart, dsDec) : this.m_chart.formattedDescription(this.m_chart, this.m_description);
	if (description != "") {
		var m_formattedDescription = this.m_chart.formattedDescription(this.m_chart, description);
		var separatorSign = (IsBoolean(this.m_chart.m_enablehtmlformate.xaxis)) ? "<br>" : "\\n";
		var descTextArr = m_formattedDescription.split(separatorSign);
		/**Removing array element When its length more then 3 bcz we are providing max three lines for axis desription*/
		if(descTextArr.length > 3) {
			descTextArr.splice(3, descTextArr.length-3);
		}
		var descTextSpace = (descTextArr.length > 0) ? fontSize * (descTextArr.length -1) : 0;
		var x = this.getXDesc();
		var y = this.getYDesc();
		//Added for support html format text in xaxis description 
		if (IsBoolean(this.m_chart.m_enablehtmlformate.xaxis)) {
			this.drawDescriptionInHTML(y, m_formattedDescription, fontSize);
		} else {
			var text = drawSVGText(x, y, this.m_chart.formattedDescription(this.m_chart, ""), convertColorToHex(this.m_fontcolor), "middle", "middle", 0);
			/** This method will wrap text*/
			wrapSVGText(temp, x, y, descTextArr, text, fontSize, (temp.m_endX * 1) - (temp.m_startX * 1));
			
			$(text).css({
				"font-family": selectGlobalFont(temp.getFontFamily()),
				"font-style": temp.getFontStyle(),
				"font-size": fontSize + "px" ,
				"font-weight": temp.getFontWeight(),
				"text-decoration": temp.getTextDecoration()
			});
			$("#" + temp.m_chart.svgContainerId).append(text);
		}
	}
};

function HeatMapYaxis() {
	this.base = Yaxis;
	this.base();

	this.m_chart;
	this.m_chartCalculation;

	this.m_startX;
	this.m_startY;
	this.m_endX;
	this.m_endY;

	this.m_yAxisText = [];
	this.m_yAxisMarkersArray = [];

	this.m_labeltextalign = "right";
	this.m_axislinetotextgap = 2;

	this.m_unitSymbol;
	this.m_textUtil = new TextUtil();
	this.m_util = new Util();
	this.m_isSecondAxisFormatter = false;
	this.ctx = "";
};
HeatMapYaxis.prototype = new Yaxis;

HeatMapYaxis.prototype.init = function (m_chart, chartCalculation) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.m_chartCalculation = chartCalculation;

	this.m_startX = this.m_chart.getStartX();
	this.m_startY = this.m_chart.getStartY();
	this.m_endX = this.m_chart.getEndX();
	this.m_endY = this.m_chart.getEndY();

	this.m_yAxisText = this.m_chartCalculation.getYAxisText();
	this.m_yAxisMarkersArray = this.m_chartCalculation.getYAxisMarkersArray();

	this.setLeftAxisFormatters();
	this.setRightAxisFormatters();
	this.m_isSecodaryAxis = false;
	this.m_axiscolor = convertColorToHex(this.m_chart.getAxisColor());
	this.m_labelfontcolor = convertColorToHex(this.getLabelFontColor());
};
HeatMapYaxis.prototype.setLeftAxisFormatters = function () {
	this.setFormatter();
	this.setSecondaryFormatter();
	this.m_precision = this.m_chart.getPrecision();
};
HeatMapYaxis.prototype.markYaxiss = function () {
	var temp = this;
	this.ctx = this.m_chart.ctx;
	this.m_yAxisMarkersArray = this.m_chart.getSeriesDisplayNames();
	var col = this.getLabelFontColor();
	var starty = this.m_startY * 1;
	for (var i = 0; i < this.m_chart.getVisibleSeriesDisplayNames().length; i++) {
		var description = this.m_chart.getVisibleSeriesDisplayNames()[i];
		if (description.length > 25) {
		    description = description.substring(0, 24) + "...";
		}
		var labelAlign = "right";
		var text = drawSVGText(parseInt(this.m_chart.m_startX - 5), (parseInt(starty) - this.m_chart.getHeatMapCellHeight() * 1 / 2), description, this.m_labelfontcolor, labelAlign, "start");
		/*$(text).css({
			"font-family": selectGlobalFont(temp.getLabelFontFamily()),
			"font-style": temp.getLabelFontStyle(),
			"font-size": temp.m_chart.fontScaling(temp.getLabelFontSize()) +"px" ,
			"font-weight": temp.getLabelFontWeight(),
			"text-decoration": temp.getLabelTextDecoration()
		});*/
		$("#yaxislabelgrp" + temp.m_chart.m_objectid).append(text);
		starty = starty - this.m_chart.getHeatMapCellHeight() * 1;
	}
	/*if (this.getDescription() != "") {
        this.drawDescription();
    }*/
    this.drawDescription();
};
HeatMapYaxis.prototype.setFormatter = function () {
	this.m_unitSymbol = "";
	this.m_formatterPosition = "";
	this.m_isFormatter = false;
	if (this.m_chart.m_formater != "none" && this.m_chart.m_formater != "") {
		var formatter = this.m_chart.getFormater();
		var unit = this.m_chart.getUnit();
		if (unit != "none" && unit != "") {
			this.m_isFormatter = true;
			this.m_unitSymbol = this.m_util.getFormatterSymbol(formatter, unit);
			this.m_formatterPosition = this.m_chart.getSignPosition();
			if (this.m_formatterPosition == "") {
				this.m_formatterPosition = "suffix";
			}
		}
	}
};
HeatMapYaxis.prototype.setSecondaryFormatter = function () {
	this.m_secondaryUnitSymbol = "";
	this.m_secondaryFormatterPosition = "";
	this.m_isSecondaryFormatter = false;
	if (this.m_chart.m_secondaryformater != "none" && this.m_chart.m_secondaryformater != "" && this.m_chart.getUnit() != "Percent") {
		var secondaryFormatter = this.m_chart.getSecondaryFormater();
		var secondaryUnit = this.m_chart.getSecondaryUnit();
		if (secondaryUnit != "" && secondaryUnit != "none" && secondaryUnit != undefined) {
			this.m_isSecondaryFormatter = true;
			this.m_secondaryUnitSymbol = this.m_util.getFormatterSymbol(secondaryFormatter, secondaryUnit);
		}
		this.m_secondaryFormatterPosition = "suffix";
	}
};
HeatMapYaxis.prototype.setRightAxisFormatters = function () {
	if (IsBoolean(this.m_chart.m_secondaryaxisshow)) {
		if (IsBoolean(this.getRightAxisFormater())) {
			this.setSecondAxisFormatter();
		}
	}
	this.m_secondaryAxisPrecision = this.m_chart.m_secondaryaxisprecision;
};
HeatMapYaxis.prototype.setSecondAxisFormatter = function () {
	this.m_secondAxisUnitSymbol = "";
	this.m_secondAxisFormatterPosition = "";
	this.m_isSecondAxisFormatter = false;

	if (this.m_chart.m_secondaryaxisformater != "none" || this.m_chart.m_secondaryaxisformater != "") {
		var secondAxisunit = this.m_chart.m_secondaryaxisunit;
		var secondAxisFormatter = this.m_chart.m_secondaryaxisformater;
		if (secondAxisunit != "none" && secondAxisunit != "") {
			this.m_isSecondAxisFormatter = true;
			this.m_secondAxisUnitSymbol = this.m_util.getFormatterSymbol(secondAxisFormatter, secondAxisunit);
			this.m_secondAxisFormatterPosition = this.m_chart.m_secondaryaxissignposition;
		}
	}
};
/** @description drawing y axis zero marker line **/
HeatMapYaxis.prototype.drawYAxis = function () {
	var temp = this;
	if (IsBoolean(this.m_showlineyaxis)) {
		var lineWidth = 0.5;
		var x1 = this.m_startX;
		var y1 = this.m_startY;
		var x2 = this.m_startX;
		var y2 = this.m_endY;
		var yAxisLine = drawSVGLine(x1,y2,x2,y1,lineWidth,this.m_lineyaxiscolor);
		$("#" + temp.m_chart.svgContainerId).append(yAxisLine);
	}
};
HeatMapYaxis.prototype.horizontalMarkerLines = function () {
	for (var i = 0; i < this.m_yAxisMarkersArray.length; i++) {
		this.ctx.beginPath();
		this.ctx.lineWidth = "0.1";
		this.ctx.strokeStyle = "#000";
		this.ctx.moveTo(this.m_startX, this.m_startY - (i * this.getYAxisDiv()));
		this.ctx.lineTo(this.m_endX, this.m_startY - (i * this.getYAxisDiv()));
		this.ctx.stroke();
		this.ctx.closePath();
	}
};
HeatMapYaxis.prototype.markYaxis = function () {
	if (this.m_chart.m_type == "Bar" || this.m_chart.m_type == "bar" || this.m_chart.m_type == "Chevron" || this.m_chart.m_type == "chevron") {
		this.markYaxisForBarOrChevron();
	} else {
		for (var i = 0; i < this.m_yAxisMarkersArray.length; i++) {
			var text = this.m_yAxisMarkersArray[i];
			if (IsBoolean(this.m_isSecodaryAxis))
				text = this.getSecondaryAxisFormattedText(text);
			else
				text = this.getFormattedText(text);

			this.m_textUtil.drawText(this.ctx, text, (this.m_startX * 1) - this.m_axislinetotextgap, ((this.m_startY * 1) - (i * (this.getYAxisDiv()))), this.getLabelFontProperties(), this.m_labeltextalign, this.m_labelfontcolor);
			if (this.isLabelDecoration()) {
				this.textDecoration(text, this.m_startX, (this.m_startY * 1) - (i * (this.getYAxisDiv())), this.m_labelfontcolor, this.m_chart.fontScaling(this.getLabelFontSize()), this.m_labeltextalign);
			}
		}
	}
	/*if (this.getDescription() != "") {
        this.drawDescription();
    }*/
    this.drawDescription();
};
HeatMapYaxis.prototype.descriptionDecoration = function (text, x, y, color, textSize, align) {
	this.ctx.beginPath();
	this.ctx.font = this.m_fontstyle + " " + this.m_fontweight + " " + this.m_chart.fontScaling(this.m_fontsize) + "px " + selectGlobalFont(this.m_fontfamily);
	var textWidth = this.ctx.measureText(text).width;
	this.ctx.closePath();
	x = x * 1 + 2; ;
	var startY = y * 1 + textWidth / 2;
	var endY = y * 1 - textWidth / 2;
	this.ctx.beginPath();
	this.ctx.strokeStyle = color;
	this.ctx.lineWidth = "0.5pt";
	this.ctx.moveTo(x, startY);
	this.ctx.lineTo(x, endY);
	this.ctx.stroke();
	this.ctx.closePath();
};
/** @description drawing y-axis description **/
HeatMapYaxis.prototype.drawDescription = function () {
	var temp = this;
	var serDec = this.m_chart.m_allSeriesDisplayNames.reduce(function(acc, item) { return item !== "" ? (acc === "" ? item : acc + ", " + item) : acc; }, "");
	var description=(IsBoolean(this.m_chart.m_yAxis.m_showdatasetdescription)) ? this.m_chart.formattedDescription(this.m_chart, serDec) : this.m_chart.formattedDescription(this.m_chart, this.getDescription());
	if (description != "") {
		var text = drawSVGText(this.getXDesc(), this.getYDesc(), this.m_chart.formattedDescription(this.m_chart, description), convertColorToHex(this.getFontColor()), "middle", "middle", 270);
		$(text).css({
			"font-family": selectGlobalFont(temp.getFontFamily()),
			"font-style": temp.getFontStyle(),
			"font-size": temp.m_chart.fontScaling(temp.getFontSize()) +"px",
			"font-weight": temp.getFontWeight(),
			"text-decoration": temp.getTextDecoration()
		});
		$("#" + temp.m_chart.svgContainerId).append(text);
	}
};
HeatMapYaxis.prototype.textDecoration = function (text, startX, startY, color, fontSize, align) {
	this.m_chart.underLine(text, startX, startY, color, fontSize, align);
};
HeatMapYaxis.prototype.getFormattedText = function (text) {
	var precision = (this.m_precision == "undefined" || this.m_precision == undefined) ? this.m_chart.m_precision : this.m_precision;
	if (text % 1 != 0 && precision < 1) {
		text = this.setPrecision(text, 0);
	} else if (!IsBoolean(this.m_isFormatter) && !IsBoolean(this.m_isSecondaryFormatter)) {
		text = this.setPrecision(text, precision);
	}
	if ((this.m_chart.m_formater == "none" || this.m_chart.m_formater == "") && (this.m_chart.m_secondaryformater == "none" || this.m_chart.m_secondaryformater == "")) {
		text = this.setPrecision(text, precision);
	}
	if (IsBoolean(this.m_isFormatter)) {
		text = this.m_util.updateTextWithFormatter(text, this.m_unitSymbol, precision);
	}
	if (IsBoolean(this.m_isSecondaryFormatter) && this.m_chart.m_secondaryformater == "Number") {
		text = this.m_util.updateTextWithFormatter(text, this.m_secondaryUnitSymbol, precision);
	}
	if (IsBoolean(this.m_isSecondaryFormatter)) {
		if (this.m_secondaryUnitSymbol != "auto")
			text = this.addSecondaryFormater(text, this.m_secondaryUnitSymbol);
		else {
			var symbol = getNumberFormattedSymbol(text * 1, this.m_chart.m_unit);
			var val = getNumberFormattedNumericValue(text * 1, precision, this.m_chart.m_unit);
			text = this.setPrecision(val, precision);
			text = this.addSecondaryFormater(text, symbol);
		}
	}
	text = getFormattedNumberWithCommas(text, this.m_chart.m_numberformatter);
	if (IsBoolean(this.m_isFormatter) && this.m_unitSymbol != undefined) {
		text = this.m_util.addFormatter(text, this.m_unitSymbol, this.m_formatterPosition, precision);
	}

	return text;
};
HeatMapYaxis.prototype.getSecondaryAxisFormattedText = function (text) {
	if (IsBoolean(this.m_isSecondAxisFormatter)) {
		text = this.m_util.addFormatter((text * 1).toFixed(2), this.m_secondAxisUnitSymbol, this.m_secondAxisFormatterPosition);
	}
	return text;
};
HeatMapYaxis.prototype.setPrecision = function (text, precision) {
	if (text !== 0) {
	    if (precision !== "default") {
	        return (text * 1).toFixed(precision);
	    } else {
	        return (text * 1);
	    }
	} else {
	    return (text * 1);
	}
};
HeatMapYaxis.prototype.addSecondaryFormater = function (text, secondaryUnitSymbol) {
	var textValue = text;
	if (this.m_precision != 0 && this.m_precision != null)
		textValue = this.setPrecision(textValue, this.m_precision);
	else if (textValue < 1 && textValue % 1 != 0)
		textValue = this.setPrecision(textValue, 2);
	try {
		eval("var formattedText = this.m_util.addUnitAs" + this.m_secondaryFormatterPosition + "(textValue,secondaryUnitSymbol);");
	} catch (e) {
		return formattedText.toString();
	}
	return formattedText.toString();
};
HeatMapYaxis.prototype.markYaxisForBarOrChevron = function () {
	for (var i = 0; i < this.m_yAxisText.length; i++) {
		var startY = (1 * (this.m_startY) - 1 * (this.m_chart.m_barGap) * (1 * (i) + 1) - this.m_chart.m_barWidth * 1 * (i) - 1 * (this.m_chart.m_barWidth) / 2 + 5);
		var text = this.getText("" + this.m_yAxisText[i], this.m_chart.m_width / 4, this.getLabelFontProperties());
		this.m_textUtil.drawText(this.ctx, text, 1 * (this.m_startX) - this.m_axislinetotextgap, startY - 4, this.getLabelFontProperties(), this.m_labeltextalign, this.m_labelfontcolor);
		if (this.isLabelDecoration()) {
			this.textDecoration(text, this.m_startX, startY - 3, this.m_labelfontcolor, this.m_chart.fontScaling(this.getLabelFontSize()), this.m_labeltextalign);
		}
	}
};
HeatMapYaxis.prototype.getFontProperties = function () {
	return this.m_textUtil.getFontProperties(this.getFontStyle(), this.getFontWeight(), this.m_chart.fontScaling(this.getFontSize()), this.getFontFamily());
};
HeatMapYaxis.prototype.getLabelFontProperties = function () {
	return this.m_textUtil.getFontProperties(this.getLabelFontStyle(), this.getLabelFontWeight(), this.m_chart.fontScaling(this.getLabelFontSize()), this.getLabelFontFamily());
};
HeatMapYaxis.prototype.getYAxisDiv = function () {
	return (this.m_startY - this.m_endY) / (this.m_yAxisMarkersArray.length - 1);
};
HeatMapYaxis.prototype.formatToCurrency = function (num) {
	num = num.toString().replace(/\$|\,/g, "");
	if (isNaN(num))
		num = "0";
	var sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * 100 + 0.50000000001);
	var cents = num % 100;
	num = Math.floor(num / 100).toString();
	if (cents < 10)
		cents = "0" + cents;
	for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substring(0, num.length - (4 * i + 3)) + "," + num.substring(num.length - (4 * i + 3));
	if (cents > 0)
		return (((sign) ? "" : "-") + "$ " + num + "." + cents);
	else
		return (((sign) ? "" : "-") + "$ " + num);
};

HeatMapYaxis.prototype.getText = function (text1, textWidth, ctxFont) {
	var text = text1;
	var newText = "";
	this.ctx.font = ctxFont;
	var strWidth = this.ctx.measureText(text).width;
	if (text.length > 0) {
		var appendedTextWidth = (strWidth / text.length) * 3;
	}
	for (var i = 0; i < text.length; i++) {
		if (this.ctx.measureText(newText).width < (textWidth - appendedTextWidth)) {
			newText += text[i];
		} else {
			newText = newText + "..";
			break;
		}
	}
	return newText;
};

function HeatMapCell() {
	this.m_xPosition;
	this.m_yPosition;
	this.m_cellWidth;
	this.m_cellHeight;
	this.m_cellColor;
	this.m_data;
	this.m_chart;
	this.ctx;
};
HeatMapCell.prototype.init = function (xPosition, yPosition, width, height, color, data, commaOperatorFlag, m_chart) {
	this.m_xPosition = xPosition;
	this.m_yPosition = yPosition;
	this.m_cellWidth = width;
	this.m_cellHeight = height;
	this.m_cellColor = color;
	this.m_data = data;
	this.m_commaOperatorFlag = commaOperatorFlag;
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
};
/**Creating heat map svg cell**/
HeatMapCell.prototype.createCell = function (i,j) {
	var Color = hex2rgb(this.m_cellColor,this.m_chart.m_coloropacity);
	if (this.m_chart.m_chartbase === 'plane') {
		var rect = IsBoolean(this.m_chart.m_yAxis.m_showlineyaxis)?
				drawSVGRect(this.m_xPosition+1, this.m_yPosition, this.m_cellWidth, this.m_cellHeight, Color)
				:drawSVGRect(this.m_xPosition, this.m_yPosition, this.m_cellWidth, this.m_cellHeight, Color);
	} else {
		var rect = this.createGradient(Color,i,j);
	}
	$(rect).attr("class", "timeSeries-stackHighlighter");
	var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if(IsBoolean(this.m_chart.m_enableanimation) && (this.m_chart.m_heatanimationduration > 0) && !isIE) {
		switch (this.m_chart.m_animationoption) {
		case 'growFromCenter':
			$(rect).animate({
				   width:this.m_cellWidth,
				   height:this.m_cellHeight
			},(this.m_chart.m_heatanimationduration*1000));
			/*var rect = drawSVGRect(0, this.m_yPosition, this.m_cellWidth, this.m_cellHeight, this.m_cellColor);
			$(rect).animate({
				   x:this.m_xPosition
			},(this.m_chart.m_heatanimationduration*1000));*/
			break;
		case 'growFromTop':
			var animate = drawSVGStackAnimation(0, "height", this.m_cellHeight, this.m_chart.m_heatanimationduration);
			$(rect).append(animate);
			break;
		case 'growFromLeft':
			var animate = drawSVGStackAnimation(0, "width", this.m_cellWidth, this.m_chart.m_heatanimationduration);
			$(rect).append(animate);
			break;
		default:
			break;
		}
	}
	$("#rectboxgrp" + i + this.m_chart.m_objectid).append(rect);
	return rect;
};
/** @description create gradient for chartBase Gradient1**/
HeatMapCell.prototype.createGradient = function (color, i, j) {
	var temp = this;
	var linearGradient = document.createElementNS(NS, "linearGradient");
	linearGradient.setAttribute("id", "gradientcell" + temp.m_chart.m_objectid+i+j);
	switch (this.m_chart.m_chartbase) {
	case 'gradient1':
		linearGradient.setAttribute("gradientTransform", "rotate(90)");
		break;
	case 'gradient2':
		linearGradient.setAttribute("gradientTransform", "rotate(0)");
		break;
	case 'gradient3':
		linearGradient.setAttribute("gradientTransform", "rotate(45)");
		break;
	case 'gradient4':
		linearGradient.setAttribute("gradientTransform", "rotate(135)");
		break;
	default:
		break;
	}
	
	$("#" + temp.m_chart.svgContainerId).append(linearGradient);
	
	/**Adding white luminosity in the middle of respective cell color**/
	var colors = [color, hex2rgb(ColorLuminance("#ffffff", this.m_chart.m_luminance),this.m_chart.m_coloropacity), color];
	var step=(100 / (((colors.length-1)!=0)?(colors.length-1):1));
	for (var k = 0,Length= colors.length; k <=(Length-1); k++) {
		var stop = document.createElementNS(NS, "stop");
		stop.setAttribute("offset", (k *step) + "%");
		stop.setAttribute("stop-color", (colors[k]));
		$(linearGradient).append(stop);
	}
	
	var rect = drawSVGRect(this.m_xPosition, this.m_yPosition, this.m_cellWidth, this.m_cellHeight, "#ffffff");
	$(rect).attr("id", "GradientRect" + temp.m_chart.m_objectid);
	$(rect).attr("fill", "url(#gradientcell" + temp.m_chart.m_objectid+i+j + ")");
	return rect;
};

/**Drawing text on each svg cell**/
HeatMapCell.prototype.drawText = function (index) {
	if (IsBoolean(this.m_chart.m_showcelltext)){
		var reg = /\S/g;
		this.m_data=(reg.test(this.m_data))?this.m_data:"";
		/**DAS-593 0 =="" always return true , so === added for checking empty */
		var data = (this.m_data == null || this.m_data === "") ? "" : (isNaN(getNumericComparableValue(this.m_data))?this.m_data:this.m_chart.getFormatterText(getNumericComparableValue(this.m_data)));
		/*added getNumericComparableValue() method to check for comma included numeric values and add formatters*/
		data = this.getCalculatedDescription(data,(this.m_cellWidth - this.m_cellWidth/3));
		var x = (this.m_xPosition) + (this.m_cellWidth / 2);
		var y = (this.m_yPosition) + (this.m_cellHeight / 2);
		var text = drawSVGText(x, y, data, convertColorToHex(this.m_chart.m_celltextcolor), "center", "middle");
		/*$(text).css({
			"font-family": selectGlobalFont(this.m_chart.m_celltextfontfamily),
			"font-style": this.m_chart.m_celltextfontstyle,
			"font-size": this.m_chart.fontScaling(this.m_chart.m_celltextfontsize * 1)+"px",
			"font-weight": this.m_chart.m_celltextfontweight
		});*/
		$("#datalabelgrp" + index + this.m_chart.m_objectid).append(text);
	}
};
HeatMapCell.prototype.getCalculatedDescription = function (description, cellwidth) {
	var str = description;
	this.ctx.beginPath();
	var textWidth = this.ctx.measureText(str).width;
		if (textWidth > cellwidth*1) {
			var newText = "";
			if (str.length > 0)
				var appendedTextWidth = (textWidth / str.length) * 3 ;
			for (var i = 0; i < str.length; i++) {
				if (this.ctx.measureText(newText).width < (cellwidth - appendedTextWidth * 1)) {
					newText += str[i];
				} else {
					var dotText = "..";
					var dotTextWidth = this.ctx.measureText(dotText).width;
					if (dotTextWidth > cellwidth) {
						newText = "";
					} else {
						newText = newText + "..";
					}
					break;
				}
			}
			str = newText;
		}
	this.ctx.closePath();
	return str;
};
//# sourceURL=HeatMapChart.js
