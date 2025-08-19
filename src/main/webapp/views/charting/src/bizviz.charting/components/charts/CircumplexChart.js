/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: CircumplexChart.js
 * @description CircumplexChart
 **/
function CircumplexChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;

	this.m_seriesNames = [];
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_calculation = new CircumplexChartCalculation();
	this.m_textUtil = new TextUtil();
	this.m_xAxis = new Xaxis();
	this.m_yAxis = new Yaxis();
	this.m_title = new Title(this);
	this.m_subTitle = new SubTitle();
	this.m_useseriescolors = "true";
	this.m_canvastype = "svg";
	this.m_webtype = "polygon";
	this.m_charttype = "overlaid";
	this.m_strokecolor = "#FFFFFF";
	this.m_axiscolor = "#999999";
	this.m_axisstrokecolor = "#000000";
	this.m_strokewidth = 1;
	this.m_showdoughnut = false;
	this.m_linewidth = 100;
	this.m_axislinewidth = 0.5;
	this.m_categorylinewidth = 2;
	this.m_overlaidspacing = 10;
	/**Added for animation property*/	
	this.m_enableanimation = "false";
	/**Added for polygon web line width*/
	this.m_polylinewidth = 0.3;
	this.m_animationduration = 10;
};
/** @description Making prototype of chart class to inherit its properties and methods into Circumplex Chart **/
CircumplexChart.prototype = new Chart();
/** @description This method will parse the chart JSON and create a container 
* @params(Object) chartJson
**/
CircumplexChart.prototype.setProperty = function(chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas(); //create draggable div
};
/** @description Making prototype of Title and SubTitle according to canvas or svg**/
CircumplexChart.prototype.updateSvgClassRef = function() {
	if (this.m_canvastype == "canvas") {
		this.m_title = new Title(this);
		this.m_subTitle = new SubTitle();
	} else {
		this.m_title = new svgTitle(this);
		this.m_subTitle = new svgSubTitle();
	}
};
/** @description Iterate through chart JSON and set class variable values with JSON values 
* @params(Object) jsonObject
* @params(Object) nodeObject
**/
CircumplexChart.prototype.ParseJsonAttributes = function(jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	this.updateSvgClassRef();
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
/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
CircumplexChart.prototype.initCanvas = function() {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};
/** @description  Will create DraggableDiv and DraggableCanvas and initialize mouse event for component .**/
CircumplexChart.prototype.initializeDraggableDivAndCanvas = function() {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	if (this.m_canvastype === "canvas") {
		this.removeSVG();
		this.initMouseMoveEvent(this.m_chartContainer);
		this.initMouseClickEvent();
	} else {
		this.createSVG();
		$("#draggableCanvas" + this.m_objectid).hide();
		this.initMouseMoveEvent(this.m_chartContainer);
		this.initMouseClickEventForSVG(this.svgContainerId);
	}
};
/** @description createSVG Method used for create SVG element for Chart and Scale **/
CircumplexChart.prototype.createSVG = function() {
	var temp = this;
	this.svgContainerId = "svgContainer" + temp.m_objectid;
	this.removeSVG();
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("xlink", "http://www.w3.org/1999/xlink");
	svg.setAttribute("width", this.m_width);
	svg.setAttribute("height", this.m_height);
	svg.setAttribute("id", this.svgContainerId);
	svg.setAttribute("class", "svg_chart_container");
	$("#draggableDiv" + temp.m_objectid).append(svg);
};
/** @description removeSVG method removes the already present svg **/
CircumplexChart.prototype.removeSVG = function() {
	var temp = this;
	$("#" + temp.svgContainerId).remove();
};
/** @description Getter Method of DataProvider **/
CircumplexChart.prototype.getDataProvider = function() {
	return this.m_dataProvider;
};
/** @description Iterate Fields JSON and set field according to their fieldType 
* @params(ArrayObject) fieldsJson
 **/
CircumplexChart.prototype.setFields = function(fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	var categoryJson = [];
	var subCategoryJson = [];
	var seriesJson = [];
	for (var i = 0; i < fieldsJson.length; i++) {
		var fieldType = this.getProperAttributeNameValue(fieldsJson[i], "Type");
		switch (fieldType) {
			case "Category":
				categoryJson.push(fieldsJson[i]);
				break;
			case "SubCategory":
				subCategoryJson.push(fieldsJson[i]);
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
	this.setSubCategory(subCategoryJson);
	this.setSeries(seriesJson);
};
/** @description Setter Method of Category 
* @params(ArrayObject) categoryJson
**/
CircumplexChart.prototype.setCategory = function(categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryFieldColor = [];
	this.m_categoryDisplayNames = [];
	this.m_allCategoryNames = [];
	this.m_allCategoryDisplayNames = [];
	this.m_categoryVisibleArr = {};
	var count = 0;
	for (var i = 0; i < categoryJson.length; i++) {
		var name = this.getProperAttributeNameValue(categoryJson[i], "Name");
		this.m_allCategoryNames[i] = name;
		var dName = this.getProperAttributeNameValue(categoryJson[i], "DisplayName");
		this.m_allCategoryDisplayNames[i] = dName;
		var visible = this.getProperAttributeNameValue(categoryJson[i], "visible");
		this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]] = visible;
		if (IsBoolean(visible)) {
			this.m_categoryNames[count] = name;
			this.m_categoryDisplayNames[count] = dName;
			this.m_categoryFieldColor[count] = this.getProperAttributeNameValue(categoryJson[i], "Color");
			count++;
		}
	}
};
/** @description Setter Method of SubCategory 
* @params(ArrayObject) subCategoryJson
**/
CircumplexChart.prototype.setSubCategory = function(subCategoryJson) {
	this.m_subCategoryNames = [];
	this.m_subCategoryFieldColor = [];
	this.m_subCategoryDisplayNames = [];
	this.m_allSubCategoryNames = [];
	this.m_allSubCategoryDisplayNames = [];
	this.m_subCategoryVisibleArr = [];
	var count = 0;
	for (var i = 0; i < subCategoryJson.length; i++) {
		var name = this.getProperAttributeNameValue(subCategoryJson[i], "Name");
		this.m_allSubCategoryNames[i] = name;
		var dName = this.getProperAttributeNameValue(subCategoryJson[i], "DisplayName");
		this.m_allSubCategoryDisplayNames[i] = dName;
		var visible = this.getProperAttributeNameValue(subCategoryJson[i], "visible");
		this.m_subCategoryVisibleArr[this.m_subCategoryDisplayNames[i]] = visible;
		if (IsBoolean(visible)) {
			this.m_subCategoryNames[count] = name;
			this.m_subCategoryDisplayNames[count] = dName;
			this.m_subCategoryFieldColor[count] = this.getProperAttributeNameValue(subCategoryJson[i], "Color");
			count++;
		}
	}
};
/** @description creating array for each property of fields and storing in arrays 
* @params(ArrayObject) seriesJson
**/
CircumplexChart.prototype.setSeries = function(seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = [];
	this.m_legendNames = [];
	this.m_categoryUniqueNames = [];
	this.m_seriesVisibleArr = {};
	this.m_allSeriesDisplayNames = [];
	this.m_allSeriesNames = [];
	this.m_plotTrasparencyArray = [];
	this.legendMap = {};
	var count = 0;
	for (var i = 0; i < seriesJson.length; i++) {
		var name = this.getProperAttributeNameValue(seriesJson[i], "Name");
		this.m_allSeriesNames[i] = name;
		var dName = this.getProperAttributeNameValue(seriesJson[i], "DisplayName");
		this.m_allSeriesDisplayNames[i] = dName;
		var visible = this.getProperAttributeNameValue(seriesJson[i], "visible");
		this.m_seriesVisibleArr[this.m_allSeriesNames[i]] = visible;
		if (IsBoolean(visible)) {
			this.m_seriesNames[count] = name;
			this.m_seriesDisplayNames[count] = dName;
			this.m_legendNames[count] = dName;
			this.m_seriesColors[count] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));
			var transparency = this.getProperAttributeNameValue(seriesJson[i], "PlotTransparency");
			this.m_plotTrasparencyArray[count] = (transparency != undefined && transparency !== null && transparency !== "") ? transparency : 1;
			var tempMap = {
				"seriesName": this.m_seriesNames[count],
				"displayName": this.m_seriesDisplayNames[count],
				"color": this.m_seriesColors[count],
				"shape": "point",
				"index": count
			};
			this.legendMap[name] = tempMap;
			count++;
		}
	}
	this.setLegendsIntialLoad(this.m_defaultlegendfields);
};
/** @description Getter Method of LegendInfo **/
CircumplexChart.prototype.getLegendInfo = function() {
	/** BP-4716 show seriescolor when legendcheckbox is false for story **/
	if(IsBoolean(this.m_useseriescolors)){
		var legendObj = this.getLegendComponentObj();
		if (legendObj != undefined && !IsBoolean(legendObj.m_legendcheckbox)){
			return this.legendMapForSeriesColors;			
		}else {
			return this.legendMap;
		}
	}else {
		return this.legendMap;
	}
};
/** @description Getter Method of CategoryNames **/
CircumplexChart.prototype.getCategoryNames = function() {
	return this.m_categoryNames;
};
/** @description Getter Method of CategoryDisplayNames **/
CircumplexChart.prototype.getCategoryDisplayNames = function() {
	return this.m_categoryDisplayNames;
};
/** @description Getter Method of SubCategoryNames **/
CircumplexChart.prototype.getSubCategoryNames = function() {
	return this.m_subCategoryNames;
};
/** @description Getter Method of SubCategoryDisplayNames **/
CircumplexChart.prototype.getSubCategoryDisplayNames = function() {
	return this.m_subCategoryDisplayNames;
};
/** @description Getter Method of SeriesNames **/
CircumplexChart.prototype.getSeriesNames = function() {
	return this.m_seriesNames;
};
/** @description Getter Method of SeriesDisplayNames **/
CircumplexChart.prototype.getSeriesDisplayNames = function() {
	return this.m_seriesDisplayNames;
};
/** @description Getter Method of SeriesColor **/
CircumplexChart.prototype.getSeriesColors = function() {
	if(IsBoolean(this.m_useseriescolors)){
		if(this.m_legendSeriesColorsArray && this.m_legendSeriesColorsArray.length > 0){
			return this.m_legendSeriesColorsArray;
		}else{
			return this.m_seriescolor.split(",");
		}
	}else{
		return this.m_seriesColors;
	}
};
/** @description Setter Method of Series Colors **/
CircumplexChart.prototype.setSeriesColor = function(m_seriesColor) {
	this.m_seriesColor = m_seriesColor;
};
/** @description Setter Method of LegendNames **/
CircumplexChart.prototype.setLegendNames = function(m_legendNames) {
	this.m_legendNames = m_legendNames;
};
/** @description Getter Method of LegendNames **/
CircumplexChart.prototype.getLegendNames = function() {
   if(IsBoolean(this.m_useseriescolors) && !IsBoolean(this.m_isEmptySeries)) {
	    return this.m_categoryUniqueNames;
	} else {
	    return this.m_legendNames;
	}
};
/** @description Getter Method for AllSeriesNames **/
CircumplexChart.prototype.getAllSeriesNames = function() {
	return this.m_allSeriesNames;
};
/** @description Getter for All Category names**/
CircumplexChart.prototype.getAllCategoryNames = function () {
	return this.m_allCategoryNames;
};
/** @description Getter for All SubCategory names**/
CircumplexChart.prototype.getAllSubCategoryNames = function () {
	return this.m_allSubCategoryNames;
};
/** @description Getter Method for AllSeriesDisplayNames **/
CircumplexChart.prototype.getAllSeriesDisplayNames = function() {
	return this.m_allSeriesDisplayNames;
};
/** @description Setter Method for AllFieldsName **/
CircumplexChart.prototype.setAllFieldsName = function() {
	this.m_allfieldsName = [];
	/*	for (var i = 0; i < this.getCategoryNames().length; i++) {
			this.m_allfieldsName.push(this.getCategoryNames()[i]);
		}
		for (var i1 = 0; i1 < this.getSubCategoryNames().length; i1++) {
			this.m_allfieldsName.push(this.getSubCategoryNames()[i1]);
		}
		for (var j = 0; j < this.getAllSeriesNames().length; j++) {
			this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
		}
	*/
	this.m_allfieldsName = this.getAllCategoryNames().
	concat(this.getAllSubCategoryNames()).
	concat(this.getAllSeriesNames());
};
/** @description Getter Method for AllFieldsName **/
CircumplexChart.prototype.getAllFieldsName = function() {
	return this.m_allfieldsName;
};
/** @description Setter Method for AllFieldsDisplayName **/
CircumplexChart.prototype.setAllFieldsDisplayName = function() {
	this.m_allfieldsDisplayName = [];
	/*	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
			this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
		}
		for (var i = 0; i < this.getSubCategoryDisplayNames().length; i++) {
			this.m_allfieldsDisplayName.push(this.getSubCategoryDisplayNames()[i]);
		}
		for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
			this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
		}
	*/
	this.m_allfieldsDisplayName = this.getCategoryDisplayNames().
	concat(this.getSubCategoryDisplayNames()).
	concat(this.getSeriesDisplayNames());
};
/** @description Getter Method for AllFieldsDisplayName **/
CircumplexChart.prototype.getAllFieldsDisplayName = function() {
	return this.m_allfieldsDisplayName;
};
/** @description Setter Method of Category Data. **/
CircumplexChart.prototype.setCategoryData = function() {
	this.m_categoryData = [];
	this.isEmptyCategory = true;
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.isEmptyCategory = false;
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
};
/** @description Setter Method of SubCategory Data. **/
CircumplexChart.prototype.setSubCategoryData = function() {
	this.m_subCategoryData = [];
	this.isEmptySubCategory = true;
	for (var i = 0; i < this.getSubCategoryNames().length; i++) {
		this.isEmptySubCategory = false;
		this.m_subCategoryData[i] = this.getDataFromJSON(this.getSubCategoryNames()[i]);
	}
};
/** @description Setter Method of Series Data. **/
CircumplexChart.prototype.setSeriesData = function() {
	this.m_seriesData = [];
	for (var i = 0; i < this.getSeriesNames().length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
};
/** @description Getter Method of Category Data. **/
CircumplexChart.prototype.getCategoryData = function() {
	return this.m_categoryData;
};
/** @description Getter Method of SubCategory Data. **/
CircumplexChart.prototype.getSubCategoryData = function() {
	return this.m_subCategoryData;
};
/** @description Getter Method of Series Data. **/
CircumplexChart.prototype.getSeriesData = function() {
	return this.m_seriesData;
};
/** @description Getter Method of StartX. **/
CircumplexChart.prototype.getStartX = function() {
	var marginForYAxisLabels = 0;
	return (this.m_x + marginForYAxisLabels);
};
/** @description Getter Method of StartY. **/
CircumplexChart.prototype.getStartY = function() {
	var marginForXAxisLabels = this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.5;
	return (this.m_y + this.m_height - marginForXAxisLabels);
};
/** @description Getter Method of EndX. **/
CircumplexChart.prototype.getEndX = function() {
	return (this.m_x + this.m_width);
};
/** @description Getter Method of EndY. **/
CircumplexChart.prototype.getEndY = function() {
	return (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};

/** @description Transforming dimension of 2D array 
* @params(Array) array
* @returns(Array) arr,after transforming the dimension of 2D array.
**/
CircumplexChart.prototype.transformSeriesData = function(array) {
	var arr = [];
	if (array !== undefined && array !== null && array.length !== 0) {
		for (var i = 0; i < array[0].length; i++) {
			arr[i] = [];
			for (var j = 0; j < array.length; j++) {
				arr[i][j] = array[j][i];
			}
		}
	}
	return arr;
};
/** @description Getter Method for finding unique value 
* @params(Array) arr
* @returns r,unique from the array
**/
CircumplexChart.prototype.getUniqueFromArray = function(arr) {
	Array.prototype.unique = function() {
		var o = {},
			i, l = this.length,
			r = [];
		for (i = 0; i < l; i += 1) o[this[i]] = this[i];
		for (i in o) r.push(o[i]);
		return r;
	};
	return arr.unique();
};
/** @description Setter Method of SeriesColor according to drill/categoryColor/conditionalColor **/
CircumplexChart.prototype.setColorsForSeries = function() {
	this.m_seriesColorsArray = [];
	this.m_legendSeriesColorsArray = [];
	if (IsBoolean(this.m_useseriescolors)) {
		var categoryData = this.transformSeriesData(this.m_categoryData);
		var colors = this.m_seriescolor.split(",");
		var uniqueCat = this.getUniqueFromArray(categoryData);
		this.m_categoryUniqueNames = uniqueCat;
		/** When repeater applied by category field, it has only one unique category - it should display legend by category names **/
		if(uniqueCat.length >= 1){
			if (uniqueCat && colors.length < uniqueCat.length) {
				colors = Array.apply(null, {
					length: uniqueCat.length
				}).map(function(context, index) {
					return colors[index % colors.length];
				});
			}
			this.legendMapForSeriesColors = {};
			for (var k = 0; k < this.m_seriesNames.length; k++) {
				this.m_seriesColorsArray[k] = [];
				for (var j = 0; j < uniqueCat.length; j++) {
					for (var i = 0; i < categoryData.length; i++) {
						if (categoryData[i][0] == uniqueCat[j][0]) {
							this.m_seriesColorsArray[k][i] = convertColorToHex(colors[j]);
							if(this.legendMapForSeriesColors[ uniqueCat[j][0] ] == undefined){
								this.legendMapForSeriesColors[ uniqueCat[j][0] ] = {
									"seriesName": uniqueCat[j][0],
									"displayName": uniqueCat[j][0],
									"color": hex2rgb(colors[j], this.m_plotTrasparencyArray[k]),
									"shape": "point"
								}
								this.m_legendSeriesColorsArray.push( colors[j] );
							}
						}
					}
				}
				//this.legendMapForSeriesColors[this.m_categoryUniqueNames[k]]["color"] = hex2rgb(colors[0], this.m_plotTrasparencyArray[k]);
			}
		}else{
			var categoryData = this.transformSeriesData(this.m_subCategoryData);
			var uniqueCat = this.getUniqueFromArray(categoryData);
			if (uniqueCat && colors.length < uniqueCat.length) {
				colors = Array.apply(null, {
					length: uniqueCat.length
				}).map(function(context, index) {
					return colors[index % colors.length];
				});
			}
			this.legendMapForSeriesColors = {};
			for (var k = 0; k < this.m_seriesNames.length; k++) {
				this.m_seriesColorsArray[k] = [];
				for (var j = 0; j < uniqueCat.length; j++) {
					for (var i = 0; i < categoryData.length; i++) {
						if (categoryData[i][0] == uniqueCat[j][0]) {
							this.m_seriesColorsArray[k][i] = convertColorToHex(colors[j]);
							if(this.legendMapForSeriesColors[ uniqueCat[j][0] ] == undefined){
								this.legendMapForSeriesColors[ uniqueCat[j][0] ] = {
									"seriesName": uniqueCat[j][0],
									"displayName": uniqueCat[j][0],
									"color": hex2rgb(colors[j], this.m_plotTrasparencyArray[k]),
									"shape": "point"
								}
								this.m_legendSeriesColorsArray.push( colors[j] );
							}
						}
					}
				}
			}
		}
	} else {
		for (var i = 0; i < this.m_seriesData.length; i++) {
			this.m_seriesColorsArray[i] = [];
			var color = (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) ? this.m_drillColor : this.getSeriesColors()[i];
			for (var j = 0; j < this.m_seriesData[i].length; j++) {
				this.m_seriesColorsArray[i][j] = color;
			}
			//commented below line for BDD-605 as it is returning rgb colors
			//this.legendMap[this.m_seriesNames[i]]["color"] = hex2rgb(color, this.m_plotTrasparencyArray[i])
		}
	}
};
/***************************************** Initialize Methods ******************************************************/
/** @description initialization of CircumplexChart **/
CircumplexChart.prototype.init = function() {
	if (this.m_canvastype !== "canvas") {
		this.createSVG();
	}
	this.setCategoryData();
	this.setSubCategoryData();
	this.setSeriesData();
	this.setAllFieldsName();
	this.setAllFieldsDisplayName();

	this.setShowSeries(this.getAllFieldsName());
	this.isSeriesDataEmpty();
	this.visibleSeriesInfo = this.getVisibleSeriesData(this.getSeriesData());
	
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);
	if (!IsBoolean(this.isEmptyCategory) && !IsBoolean(this.isEmptySubCategory) && !IsBoolean(this.m_isEmptySeries) && IsBoolean(this.isVisibleSeries())) {
		this.setColorsForSeries();
		this.initializeCalculation();
	}
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};
/** @description initialize the calculation  of the CircumplexChart. **/
CircumplexChart.prototype.initializeCalculation = function() {
	this.m_categoryData = this.updateCategoryData(this.m_categoryData);
	this.m_subCategoryData = this.updateCategoryData(this.m_subCategoryData);
	this.m_seriesData = this.updateSeriesData(this.m_seriesData);
	this.m_calculation.init(this, this.m_categoryData, this.m_seriesData);
	this.m_yAxis.init(this, this.m_calculation);
};
/** @description This method will Update CategoryData. 
* @params(Array) array
* returns arr, array after updatig the  CategoryData
**/
CircumplexChart.prototype.updateCategoryData = function(array) {
	var arr = [];
	if (array !== undefined && array !== null && array.length !== 0)
		for (var i = 0; i < array[0].length; i++) {
			arr[i] = [];
			for (var j = 0; j < array.length; j++) {
				arr[i][j] = array[j][i];
			}
		}
	return arr;
};
/** @description This method update the series data according to the calculation. 
* @params(Array) arr
* @returns arr,array after updating the seriesData
**/
CircumplexChart.prototype.updateSeriesData = function(arr) {
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
/** description drawing of chart started by drawing  different parts of chart like Chartframe,Title,Subtitle,drawspiderwebs **/
CircumplexChart.prototype.drawChart = function() {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	var map = this.IsDrawingPossible();
	if (IsBoolean(map.permission)) {
		this.drawSpiderWebs();
		if (this.m_canvastype !== "canvas") {
			this.initMouseClickEventForSVG(this.svgContainerId);
		}
	} else {
		this.drawMessage(map.message);
	}
};
/** @description Will Draw message according to canvas/svg 
* @params(String) text 
**/
CircumplexChart.prototype.drawMessage = function(text) {
	if (this.m_canvastype === "canvas") {
		Chart.prototype.drawMessage.call(this, text);
	} else {
		this.getBGGradientColorToContainer();
		this.drawMessageOnSvg(text);
	}
};
/** @description Will Draw message (error) 
* @params(String) text
**/
CircumplexChart.prototype.drawMessageOnSvg = function(text) {
	var x = this.m_x * 1 + this.m_width / 2;
	var y = this.m_y * 1 + this.m_height / 2;
	var txt = drawSVGText(x, y, text, this.m_statuscolor, "center", "middle", 0);
	txt.setAttribute("style", "font-family:"+this.m_statusfontfamily+";font-style:none;font-size:"+this.m_statusfontsize+"px;font-weight:normal;text-decoration:none;");
	$("#" + this.svgContainerId).append(txt);
};
/**@description will Draw Chartframe according to canvas/svg **/
CircumplexChart.prototype.drawChartFrame = function() {
	if (this.m_canvastype === "canvas") {
		this.m_chartFrame.drawFrame();
	} else {
		this.m_chartFrame.drawSVGFrame();
		this.getBGGradientColorToContainer();
	}
};
/** @description Will generate the gradient and fill in background of chart  **/
CircumplexChart.prototype.getBGGradientColorToContainer = function() {
	var temp = this;
	var defsElement = document.createElementNS('http://www.w3.org/2000/svg', "defs");
	defsElement.setAttribute("id", "defsElement"+temp.m_objectid);
	$("#" + temp.svgContainerId).append(defsElement);
};
/** @description will Draw Title on canvas if showTitle set to true.**/
CircumplexChart.prototype.drawTitle = function() {
	this.m_title.draw();
};
/** @description will Draw Title on canvs if showSubtitle set to true. **/
CircumplexChart.prototype.drawSubTitle = function() {
	this.m_subTitle.draw();
};
/** @description will check drawing is possible or not **/
CircumplexChart.prototype.IsDrawingPossible = function() {
	var map = {};
	if (!IsBoolean(this.isEmptyCategory)) {
		if (!IsBoolean(this.isEmptySubCategory)) {
			if (!IsBoolean(this.m_isEmptySeries)) {
				if (IsBoolean(this.isVisibleSeries())) {
					map = {
						"permission": "true",
						message: this.m_status.success
					};
				} else {
					map = {
						"permission": "false",
						message: this.m_status.noSeries
					};
				}
			} else {
				map = {
					"permission": "false",
					message: this.m_status.noData
				};
			}
		} else {
			map = {
				"permission": "false",
				message: this.m_status.noSubCategory
			};
		}
	} else {
		map = {
			"permission": "false",
			message: this.m_status.noCategory
		};
	}
	return map;
};
/** @description will draw Arms,web and Filling according to doughnut is set to true/false. **/
CircumplexChart.prototype.drawSpiderWebs = function() {
    this.drawCategoryMarking();
	if( IsBoolean( this.m_showdoughnut ) ){
	    this.drawDSpiderArms();
	    if(this.m_webtype == "polygon"){
	       this.drawDPolygonWeb();
	       this.drawPolygonSeries();
	    }
	    else if (this.m_webtype == "circle"){
		   this.drawDCircularWeb();
		   this.drawCircleSeries();
	    }
	    this.drawDSeriesMarking();
		this.drawDSpiderStrokeArms();
	}else{
		this.drawSpiderArms();
		if (this.m_webtype == "polygon") {
			this.drawPolygonWeb();
		} else if (this.m_webtype == "circle") {
			this.drawCircularWeb();
		}
		this.drawSeries();
		this.drawSeriesMarking();
		this.drawSpiderStrokeArms();
	}
};
/** @description Will draw spider arms for polygon & circle,if showdoughnut is set to true. **/
CircumplexChart.prototype.drawDSpiderArms = function() {
	/** number of arms will always greater than 3 , it shows category data **/
	if (this.m_canvastype === "canvas") {
		this.ctx.beginPath();
		this.ctx.strokeStyle = convertColorToHex(this.m_axiscolor);
		this.ctx.lineWidth = this.m_axislinewidth;
		for (var i = 0; i < this.m_calculation.m_armSXCordinates.length ; i++) {
		for (var j = 0; j < this.m_seriesNames.length; j++) {
			var x1 = this.m_calculation.m_armSXCordinates[i][j];
			var y1 = this.m_calculation.m_armSYCordinates[i][j];
			this.ctx.moveTo(x1, y1);
			var x2 = this.m_calculation.m_armXCordinates[i][j];
			var y2 = this.m_calculation.m_armYCordinates[i][j];
			this.ctx.lineTo(x2, y2);
		}
		}
		this.ctx.stroke();
		this.ctx.closePath();
	}else{
		var temp = this;
		var id = temp.svgContainerId;
		var color = convertColorToHex(temp.m_axiscolor);
		for (var i = 0; i < temp.m_calculation.m_armSXCordinates.length; i++) {
		    for (var j = 0; j < temp.m_seriesNames.length; j++) {
		    	if((temp.m_calculation.m_armSXCordinates[i][j] !== undefined)&&(temp.m_calculation.m_armSYCordinates[i][j] !== undefined)&&(temp.m_calculation.m_armXCordinates[i][j] !== undefined)&&(temp.m_calculation.m_armYCordinates[i][j] !== undefined)){
		    		var path = [
			    	            "M", temp.m_calculation.m_armSXCordinates[i][j], temp.m_calculation.m_armSYCordinates[i][j],
			    	            "L", temp.m_calculation.m_armXCordinates[i][j], temp.m_calculation.m_armYCordinates[i][j]
			    	        ].join(" ");
			    	        var svgPath = drawSVGPath();
			    	        svgPath.setAttribute('d', path);
			    	        svgPath.setAttribute("style", "stroke-width:" + temp.m_axislinewidth + "px; stroke:" + color + ";");
			    	        $("#" + id).append(svgPath);
		    	}
		    }
		}
	}
};
/** @description Will draw spider arms for polygon & circle,if showdoughnut is set to false. **/
CircumplexChart.prototype.drawSpiderArms = function() {
	/** number of arms will always greater than 3 , it shows category data **/
	if (this.m_canvastype === "canvas") {
		this.ctx.beginPath();
		this.ctx.strokeStyle = convertColorToHex(this.m_axiscolor);
		this.ctx.lineWidth = this.m_axislinewidth;
		var x1 = this.m_calculation.getCenterX();
		var y1 = this.m_calculation.getCenterY();
		for (var i = 0; i < this.m_calculation.m_armXCordinates.length; i++) {
			if (this.m_charttype === "clustered") {
				for (var j = 0; j < this.m_calculation.m_armXCordinates[i].length; j++) {
					this.ctx.moveTo(x1, y1);
					var x2 = this.m_calculation.m_armXCordinates[i][j];
					var y2 = this.m_calculation.m_armYCordinates[i][j];
					var opacity = (j === 0) ? 1 : 0.5;
					this.ctx.lineTo(x2, y2);
				}
			} else {
				this.ctx.moveTo(x1, y1);
				var x2 = this.m_calculation.m_armXCordinates[i][0];
				var y2 = this.m_calculation.m_armYCordinates[i][0];
				this.ctx.lineTo(x2, y2);
			}
		}
		this.ctx.stroke();
		this.ctx.closePath();
	} else {
		var temp = this;
		var x1 = this.m_calculation.getCenterX();
		var y1 = this.m_calculation.getCenterY();
		for (var i = 0; i < this.m_calculation.m_armXCordinates.length; i++) {
			if (this.m_charttype === "clustered") {
				for (var j = 0; j < this.m_calculation.m_armXCordinates[i].length; j++) {
					var x2 = this.m_calculation.m_armXCordinates[i][j];
					var y2 = this.m_calculation.m_armYCordinates[i][j];
					var opacity = (j === 0) ? 1 : 0.5;
					$("#" + temp.svgContainerId).append(drawSVGLine(x1, y1, x2, y2, opacity, convertColorToHex(this.m_axiscolor)));
				}
			} else {
				var x2 = this.m_calculation.m_armXCordinates[i][0];
				var y2 = this.m_calculation.m_armYCordinates[i][0];
				$("#" + temp.svgContainerId).append(drawSVGLine(x1, y1, x2, y2, "0.5", convertColorToHex(this.m_axiscolor)));
			}
		}
	}
};
/** @description Will draw spider stroke arms(category divison) for polygon & circle,if showdoughnut is set to false. **/
CircumplexChart.prototype.drawSpiderStrokeArms = function() {
	var uniqueCat = this.getUniqueFromArray(this.m_categoryData);
	var temp = this;
	var x1 = this.m_calculation.getCenterX();
	var y1 = this.m_calculation.getCenterY();
	for (var j = 0; j < uniqueCat.length; j++) {
		for (var i = 0; i < this.m_calculation.m_armXCordinates.length; i++) {
			if (this.m_categoryData[i][0] == uniqueCat[j][0]) {
				var x2 = this.m_calculation.m_armXCordinates[i][0];
				var y2 = this.m_calculation.m_armYCordinates[i][0];
				if (this.m_canvastype === "canvas") {
					this.ctx.beginPath();
					this.ctx.strokeStyle = convertColorToHex(this.m_axisstrokecolor);
					this.ctx.lineWidth = this.m_categorylinewidth;
					this.ctx.moveTo(x1,y1);
					this.ctx.lineTo(x2, y2);
					this.ctx.stroke();
					this.ctx.closePath();
				}else{
					var path = [
			    	            "M", x1, y1,
			    	            "L", x2, y2
			    	        ].join(" ");
			    	        var svgPath = drawSVGPath();
			    	        svgPath.setAttribute('d', path);
			    	        svgPath.setAttribute("style", "stroke-width:" + this.m_categorylinewidth + "px; stroke:" + convertColorToHex(this.m_axisstrokecolor) + ";");
			    	        $("#" + temp.svgContainerId).append(svgPath);
				}
				break;
			}
		}
	}
};
/** @description Will draw spider stroke arms(category divison) for polygon & circle,if showdoughnut is set to true. **/
CircumplexChart.prototype.drawDSpiderStrokeArms = function() {
	var uniqueCat = this.getUniqueFromArray(this.m_categoryData);
	var temp = this;
	for (var j = 0; j < uniqueCat.length; j++) {
		for (var i = 0; i < this.m_calculation.m_armXCordinates.length; i++) {
			if (this.m_categoryData[i][0] == uniqueCat[j][0]) {
				var x1 = this.m_calculation.m_armSXCordinates[i][0];
				var y1 = this.m_calculation.m_armSYCordinates[i][0];
				var x2 = this.m_calculation.m_armXCordinates[i][0];
				var y2 = this.m_calculation.m_armYCordinates[i][0];
				if (this.m_canvastype === "canvas") {
					this.ctx.beginPath();
					this.ctx.strokeStyle = convertColorToHex(this.m_axisstrokecolor);
					this.ctx.lineWidth = this.m_categorylinewidth;
					this.ctx.moveTo(x1,y1);
					this.ctx.lineTo(x2, y2);
					this.ctx.stroke();
					this.ctx.closePath();
				}else{
					var path = [
			    	            "M", x1, y1,
			    	            "L", x2, y2
			    	        ].join(" ");
			    	        var svgPath = drawSVGPath();
			    	        svgPath.setAttribute('d', path);
			    	        svgPath.setAttribute("style", "stroke-width:" + this.m_categorylinewidth + "px; stroke:" + convertColorToHex(this.m_axisstrokecolor) + ";");
			    	        $("#" + temp.svgContainerId).append(svgPath);
				}
				break;
			}
		}
	}
};
/** @description will draw Polygonweb for polygon case,if showdoughnut is set to false**/
CircumplexChart.prototype.drawPolygonWeb = function() {
	if (this.m_canvastype === "canvas") {
		for (var i = this.m_calculation.m_markerTextArray.length - 1; i >= 0; i--) {
			if (this.m_charttype === "clustered") {
				for (var j = 0; j < this.m_calculation.m_numberOfArms; j++) {
					var x1 = this.m_calculation.m_armMarkerXCordinates[j][i];
					var y1 = this.m_calculation.m_armMarkerYCordinates[j][i];

					var armLength = (this.m_calculation.getArmLength() / (this.m_calculation.m_markerTextArray.length*1 - 1) ) * i;

					for (var k = 0; k < this.m_seriesNames.length; k++) {
						var theta = IsBoolean(this.m_clockwisedirection) ?
							(Math.PI / 2) * 1 - (this.m_calculation.m_angleBetweenArms * (j + 1)) + (this.m_calculation.m_angleBetweenArms * (this.m_seriesNames.length - 1 - k) / this.m_seriesNames.length) :
							(Math.PI / 2) * 1 + this.m_calculation.m_angleBetweenArms * (j + 1) - (this.m_calculation.m_angleBetweenArms * (this.m_seriesNames.length - k - 1) / this.m_seriesNames.length);

						x2 = this.m_calculation.getCenterX() * 1 + armLength * Math.cos(theta);
						y2 = this.m_calculation.getCenterY() * 1 - armLength * Math.sin(theta);
						
						this.ctx.beginPath();
						this.ctx.lineWidth = 0.3;
						this.ctx.strokeStyle = convertColorToHex(this.m_axiscolor);
						this.ctx.lineTo(x2, y2);
						this.ctx.lineTo(x1, y1);
						this.ctx.stroke();
						this.ctx.closePath();
						x1 = x2;
						y1 = y2;
					}
				}
			} else {
				this.ctx.beginPath();
				this.ctx.lineWidth = 0.3;
				this.ctx.strokeStyle = convertColorToHex(this.m_axiscolor);
				var x1 = this.m_calculation.m_armMarkerXCordinates[0][i];
				var y1 = this.m_calculation.m_armMarkerYCordinates[0][i];
				this.ctx.moveTo(x1, y1);
				for (var j = 1; j < this.m_calculation.m_numberOfArms; j++) {
					var x2 = this.m_calculation.m_armMarkerXCordinates[j][i];
					var y2 = this.m_calculation.m_armMarkerYCordinates[j][i];
					this.ctx.lineTo(x2, y2);
				}
				this.ctx.lineTo(x1, y1);
				this.ctx.stroke();
				this.ctx.closePath();
			}
		}
	} else {
		var temp = this;
		for (var i = this.m_calculation.m_markerTextArray.length - 1; i >= 0; i--) {
			for (var j = 0; j < this.m_calculation.m_numberOfArms; j++) {
				if (this.m_charttype === "clustered") {
					var x1 = this.m_calculation.m_armMarkerXCordinates[j][i];
					var y1 = this.m_calculation.m_armMarkerYCordinates[j][i];

					armLength = (this.m_calculation.getArmLength() / (this.m_calculation.m_markerTextArray.length*1 - 1)) * i;

					for (var k = 0; k < this.m_seriesNames.length; k++) {
						var theta = IsBoolean(this.m_clockwisedirection) ?
							(Math.PI / 2) * 1 - (this.m_calculation.m_angleBetweenArms * (j + 1)) + (this.m_calculation.m_angleBetweenArms * (this.m_seriesNames.length - 1 - k) / this.m_seriesNames.length) :
							(Math.PI / 2) * 1 + this.m_calculation.m_angleBetweenArms * (j + 1) - (this.m_calculation.m_angleBetweenArms * (this.m_seriesNames.length - k - 1) / this.m_seriesNames.length);

						x2 = this.m_calculation.getCenterX() * 1 + armLength * Math.cos(theta);
						y2 = this.m_calculation.getCenterY() * 1 - armLength * Math.sin(theta);

						$("#" + temp.svgContainerId).append(drawSVGLine(x1, y1, x2, y2, "1", convertColorToHex(this.m_axiscolor)));
						x1 = x2;
						y1 = y2;
					}
				} else {
					var x1 = this.m_calculation.m_armMarkerXCordinates[j][i];
					var y1 = this.m_calculation.m_armMarkerYCordinates[j][i];
					var x = (j == this.m_calculation.m_numberOfArms - 1) ? 0 : j + 1;
					var x2 = this.m_calculation.m_armMarkerXCordinates[x][i];
					var y2 = this.m_calculation.m_armMarkerYCordinates[x][i];
					$("#" + temp.svgContainerId).append(drawSVGLine(x1, y1, x2, y2, "1", convertColorToHex(this.m_axiscolor)));
				}
			}
		}
	}
};
/** @description will draw Polygonweb for polygon case,if showdoughnut is set to true**/
CircumplexChart.prototype.drawDPolygonWeb = function() {
	var id = this.svgContainerId;
		for (var i = this.m_calculation.m_markerTextArray.length - 1; i >= 0; i--) {
			if (this.m_charttype === "clustered") {
				for (var j = 0; j < this.m_calculation.m_numberOfArms; j++) {
					var x1 = this.m_calculation.m_armMarkerXCordinates1[j][i];
					var y1 = this.m_calculation.m_armMarkerYCordinates1[j][i];

					var armLength = (this.m_calculation.m_doughnutWidth / (this.m_calculation.m_markerTextArray.length*1 - 1)) * i;

					for (var k = 0; k < this.m_seriesNames.length; k++) {
						var theta = IsBoolean(this.m_clockwisedirection) ?
							(Math.PI / 2) * 1 - (this.m_calculation.m_angleBetweenArms * (j + 1)) + (this.m_calculation.m_angleBetweenArms * (this.m_seriesNames.length - 1 - k) / this.m_seriesNames.length) :
							(Math.PI / 2) * 1 + this.m_calculation.m_angleBetweenArms * (j + 1) - (this.m_calculation.m_angleBetweenArms * (this.m_seriesNames.length - k - 1) / this.m_seriesNames.length);

						x2 = this.m_calculation.getCenterX() * 1 + (armLength + (this.m_calculation.getArmLength() - this.m_calculation.m_doughnutWidth)) * Math.cos(theta);
						y2 = this.m_calculation.getCenterY() * 1 - (armLength + (this.m_calculation.getArmLength() - this.m_calculation.m_doughnutWidth)) * Math.sin(theta);
						if (this.m_canvastype === "canvas") {
						this.ctx.beginPath();
						this.ctx.lineWidth = this.m_polylinewidth;
						this.ctx.strokeStyle = convertColorToHex(this.m_axiscolor);
						this.ctx.lineTo(x2, y2);
						this.ctx.lineTo(x1, y1);
						this.ctx.stroke();
						this.ctx.closePath();
						}else{
							var path = [
					    	            "M", x1, y1,
					    	            "L", x2, y2
					    	        ].join(" ");
					    	        var svgPath = drawSVGPath();
					    	        svgPath.setAttribute('d', path);
					    	        svgPath.setAttribute("style", "stroke-width:" + this.m_polylinewidth + "px; stroke:" + convertColorToHex(this.m_axiscolor) + ";");
					    	        $("#" + id).append(svgPath);
						}
						x1 = x2;
						y1 = y2;
					}
				}
			} else {
				var x1 = this.m_calculation.m_armMarkerXCordinates1[0][i];
				var y1 = this.m_calculation.m_armMarkerYCordinates1[0][i];
				if (this.m_canvastype === "canvas") {
					this.ctx.beginPath();
					this.ctx.lineWidth = this.m_polylinewidth;
					this.ctx.strokeStyle = convertColorToHex(this.m_axiscolor);
					this.ctx.moveTo(x1, y1);
					for (var j = 1; j < this.m_calculation.m_numberOfArms; j++) {
						var x2 = this.m_calculation.m_armMarkerXCordinates1[j][i];
						var y2 = this.m_calculation.m_armMarkerYCordinates1[j][i];
						this.ctx.lineTo(x2, y2);
					}
					this.ctx.lineTo(x1, y1);
					this.ctx.stroke();
					this.ctx.closePath();
				}else{
					for (var j = 1; j < this.m_calculation.m_numberOfArms; j++) {
						var x2 = this.m_calculation.m_armMarkerXCordinates1[j][i];
						var y2 = this.m_calculation.m_armMarkerYCordinates1[j][i];
						var path = [
				    	            "M", x1, y1,
				    	            "L", x2, y2
				    	        ].join(" ");
				    	        var svgPath = drawSVGPath();
				    	        svgPath.setAttribute('d', path);
				    	        svgPath.setAttribute("style", "stroke-width:" + this.m_polylinewidth + "px; stroke:" + convertColorToHex(this.m_axiscolor) + ";");
				    	        $("#" + id).append(svgPath);
				    	        x1 = x2;
								y1 = y2;
					}
					var path = [
			    	            "M", x1, y1,
			    	            "L", this.m_calculation.m_armMarkerXCordinates1[0][i], this.m_calculation.m_armMarkerYCordinates1[0][i]
			    	        ].join(" ");
			    	        var svgPath = drawSVGPath();
			    	        svgPath.setAttribute('d', path);
			    	        svgPath.setAttribute("style", "stroke-width:" + this.m_polylinewidth + "px; stroke:" + convertColorToHex(this.m_axiscolor) + ";");
			    	        $("#" + id).append(svgPath);
				}
			}
		}
};
/** @description will draw circleweb for circle case,if showdoughnut is set to false**/
CircumplexChart.prototype.drawCircularWeb = function() {
	var centerX = this.m_calculation.getCenterX();
	var centerY = this.m_calculation.getCenterY();
	var smallestCircleRadius = (this.m_calculation.getArmLength() / (this.m_calculation.m_markerTextArray.length*1 - 1));
	if (this.m_canvastype === "canvas") {
		for (var i = this.m_calculation.m_markerTextArray.length - 1; i >= 0; i--) {
			this.ctx.beginPath();
			this.ctx.strokeStyle = convertColorToHex(this.m_axiscolor);
			this.ctx.lineWidth = 0.4;
			this.ctx.arc(centerX, centerY, smallestCircleRadius * i, 0, Math.PI * 2, false);
			this.ctx.stroke();
			this.ctx.closePath();
		}
	} else {
		var temp = this;
		for (var i = this.m_calculation.m_markerTextArray.length - 1; i >= 0; i--) {
			$("#" + temp.svgContainerId).append(drawSVGCircle(centerX, centerY, smallestCircleRadius * i, "0.4", "none", convertColorToHex(this.m_axiscolor)));
		}
	}
};
/** @description will draw circleweb for circle case,if showdoughnut is set to true**/
CircumplexChart.prototype.drawDCircularWeb = function() {
    var centerX = this.m_calculation.getCenterX();
    var centerY = this.m_calculation.getCenterY();
    var Radius = this.m_calculation.getArmLength() - this.m_calculation.m_doughnutWidth;
    var ratio = this.m_calculation.m_doughnutWidth / (this.m_calculation.m_markerTextArray.length * 1 - 1);
    if (this.m_canvastype === "canvas") {
        for (var i = 0; i < this.m_calculation.m_markerTextArray.length; i++) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = convertColorToHex(this.m_axiscolor);
            this.ctx.lineWidth = 0.4;
            this.ctx.arc(centerX, centerY, Radius + (ratio * i), 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    } else {
        var temp = this;
        for (var i = this.m_calculation.m_markerTextArray.length - 1; i >= 0; i--) {
            $("#" + temp.svgContainerId).append(drawSVGCircle(centerX, centerY, Radius + (ratio * i), "0.4", "none", convertColorToHex(this.m_axiscolor)));
        }
    }
};
/** @description will draw Category names  to display them according to their category wise **/
CircumplexChart.prototype.drawCategoryMarking = function() {
	if (this.m_canvastype === "canvas") {
		var fontProperties = this.m_textUtil.getFontProperties(this.m_xAxis.m_labelfontstyle, this.m_xAxis.m_labelfontweight, this.fontScaling(this.m_xAxis.m_labelfontsize * 1), selectGlobalFont(this.m_xAxis.m_labelfontfamily));
		for (var j = 0; j < this.m_calculation.m_numberOfArms; j++) {
			var text = "" + this.m_subCategoryData[j];
			var x1 = this.m_calculation.m_armXCordinatesForLabel[j];
			var y1 = this.m_calculation.m_armYCordinatesForLabel[j];
			if ((x1 == this.m_calculation.getCenterX()) || ((x1 >= (this.m_calculation.getCenterX() * 1 - 1)) && (x1 <= (this.m_calculation.getCenterX() * 1 + 1)))) {
				var availableWidthAtC = this.m_width - 15 - 15;
				if (availableWidthAtC < this.ctx.measureText(text).width) {
					var textString;
					for (var i = 0; i < text.length; i++) {
						textString = text.substring(0, text.length - i);
						if (availableWidthAtC > this.ctx.measureText(textString).width) {
							text = textString.substring(0, textString.length - 2) + "...";
							break;
						}
					}
				}
				x1 = x1 - this.ctx.measureText(text).width / 2;
			} else if ((x1 < this.m_calculation.getCenterX())) {
				var availableWidthAtLSC = x1 - this.m_x * 1 - 15;
				if (availableWidthAtLSC < this.ctx.measureText(text).width) {
					var textString;
					for (var i = 0; i < text.length; i++) {
						textString = text.substring(0, text.length - i);
						if (availableWidthAtLSC > this.ctx.measureText(textString).width) {
							text = textString.substring(0, textString.length - 2) + "...";
							break;
						}
					}
				}
				x1 = x1 - this.ctx.measureText(text).width;
			}
			this.ctx.fillStyle = convertColorToHex(this.m_xAxis.m_labelfontcolor);
			this.m_textUtil.drawText(this.ctx, text, x1, y1, fontProperties, "left");
		}
	} else {
		var temp = this;
		for (var j = 0; j < this.m_calculation.m_numberOfArms; j++) {
			var text = "" + this.m_subCategoryData[j];
			var x1 = this.m_calculation.m_armXCordinatesForLabel[j];
			var y1 = this.m_calculation.m_armYCordinatesForLabel[j];

			var text = "" + this.m_subCategoryData[j];
			var x1 = this.m_calculation.m_armXCordinatesForLabel[j];
			var availableWidth, textAnchor;
			if ((x1 == this.m_calculation.getCenterX()) || ((x1 >= (this.m_calculation.getCenterX() * 1 - 1)) && (x1 <= (this.m_calculation.getCenterX() * 1 + 1)))) {
				textAnchor = "middle";
				availableWidth = this.m_width - 15 - 15;
			} else if (x1 < this.m_calculation.getCenterX()) {
				textAnchor = "end";
				availableWidth = x1 - this.m_x * 1;
			} else {
				textAnchor = "start";
				availableWidth = this.getEndX() * 1 - x1;
			}
			var textString = text;
			var categoryLabelfontRatio = this.fontScaling(this.m_xAxis.m_labelfontsize) * 7 / 10;
			if (availableWidth < (text.length) * categoryLabelfontRatio) {
				for (var i = 0; i < text.length; i++) {
					textString = text.substring(0, text.length - i);
					if (availableWidth > (textString.length) * categoryLabelfontRatio) {
						text = textString.substring(0, textString.length) + "...";
						break;
					}
				}
			}
			var y1 = this.m_calculation.m_armYCordinatesForLabel[j];
			var txt = drawSVGText(x1, y1, text, convertColorToHex(this.m_xAxis.m_labelfontcolor), textAnchor, "middle", 0);
			txt.setAttribute("style", "font-family:" + selectGlobalFont(this.m_xAxis.m_labelfontfamily) + "; font-style:" + this.m_xAxis.m_labelfontstyle + "; font-size:" + this.fontScaling(this.m_xAxis.m_labelfontsize * 1) + "px; font-weight:" + this.m_xAxis.m_labelfontweight + "; text-decoration:none; text-shadow:none;");
			$("#" + temp.svgContainerId).append(txt);
		}
	}
};
/** @description will draw series values for each web/circle,if showdoughnut is set to false **/
CircumplexChart.prototype.drawSeriesMarking = function() {
	var armLength = parseInt(this.m_calculation.getArmLength() / (this.m_calculation.m_markerTextArray.length*1 - 1));
	/** All properties of series marking are same as category marking except FontSize **/
	
	var markerArray = this.m_calculation.m_markerTextArray;
	var markerLength = this.m_calculation.m_markerTextArray.length;
	var plottedAxisMarkers = [];
	for (var i = 0; i < markerLength; i++) {
		var text = markerArray[i];
		text = this.getFormatterText(text, this.m_yAxis.m_precision);
		plottedAxisMarkers.push(text);
	}
	if(!isUniqueArray(plottedAxisMarkers)){
		/** if the markers has the duplicates, re-set them with one precision **/
		var map = getDuplicatesFromArray(plottedAxisMarkers);
		for (var i = 0; i < markerLength; i++) {
			var text = markerArray[i];
			/** returns formatted value on second y-axis markers **/
			var tempText = this.getFormatterText(text, this.m_yAxis.m_precision);
			if(this.m_yAxis.m_precision == "default" && this.m_yAxis.m_secondaryUnitSymbol == "auto" && Object.keys(map).length > 0){
				/** if Same marker already exist in array, set a precision to 1 **/
				text = this.getFormatterText(text, 1);
			}else{
				text = tempText;
			}
			plottedAxisMarkers[i] = text;
		}
	}
	if (this.m_canvastype === "canvas") {
		var fontProperties = this.m_textUtil.getFontProperties(this.m_xAxis.m_labelfontstyle, this.m_xAxis.m_labelfontweight, this.fontScaling(this.m_yAxis.m_labelfontsize * 1), selectGlobalFont(this.m_xAxis.m_labelfontfamily));
		for (var i = 0; i < this.m_calculation.m_markerTextArray.length; i++) {
			var y1 = this.m_calculation.getCenterY() * 1 - armLength * i * Math.sin(Math.PI / 2) + 6;
			var x1 = this.m_calculation.getCenterX() - 4;
			this.ctx.fillStyle = convertColorToHex(this.m_xAxis.m_labelfontcolor);
			this.m_textUtil.drawText(this.ctx, plottedAxisMarkers[i], x1, y1, fontProperties, "right");
		}
	} else {
		var temp = this;
		for (var i = 0; i < this.m_calculation.m_markerTextArray.length; i++) {
			y1 = this.m_calculation.getCenterY() * 1 - armLength * i * Math.sin(Math.PI / 2) + 6;
			var text = plottedAxisMarkers[i];
			x1 = this.m_calculation.getCenterX() - 4;
			var text = drawSVGText(x1, y1, text, convertColorToHex(this.m_xAxis.m_labelfontcolor), "right", "middle", 0);
			text.setAttribute("style", "font-family:" + selectGlobalFont(this.m_xAxis.m_labelfontfamily) + "; font-style:" + this.m_xAxis.m_labelfontstyle + "; font-size:" + this.fontScaling(this.m_yAxis.m_labelfontsize * 1) + "px; font-weight:" + this.m_xAxis.m_labelfontweight + "; text-decoration:none; text-shadow:none;");
			$("#" + temp.svgContainerId).append(text);
		}
	}
};

/** @description will draw series values for each web/circle,if showdoughnut is set to true **/
CircumplexChart.prototype.drawDSeriesMarking = function() {
	var armLength = parseInt(this.m_calculation.m_doughnutWidth / (this.m_calculation.m_markerTextArray.length*1 - 1));
	/** All properties of series marking are same as category marking except FontSize **/
	var markerArray = this.m_calculation.m_markerTextArray;
	var markerLength = this.m_calculation.m_markerTextArray.length;
	var plottedAxisMarkers = [];
	for (var i = 0; i < markerLength; i++) {
		var text = markerArray[i];
		text = this.getFormatterText(text, this.m_yAxis.m_precision);
		plottedAxisMarkers.push(text);
	}
	if(!isUniqueArray(plottedAxisMarkers)){
		/** if the markers has the duplicates, re-set them with one precision **/
		var map = getDuplicatesFromArray(plottedAxisMarkers);
		for (var i = 0; i < markerLength; i++) {
			var text = markerArray[i];
			/** returns formatted value on second y-axis markers **/
			var tempText = this.getFormatterText(text, this.m_yAxis.m_precision);
			if(this.m_yAxis.m_precision == "default" && this.m_yAxis.m_secondaryUnitSymbol == "auto" && Object.keys(map).length > 0){
				/** if Same marker already exist in array, set a precision to 1 **/
				text = this.getFormatterText(text, 1);
			}else{
				text = tempText;
			}
			plottedAxisMarkers[i] = text;
		}
	}
	if (this.m_canvastype === "canvas") {
		var fontProperties = this.m_textUtil.getFontProperties(this.m_xAxis.m_labelfontstyle, this.m_xAxis.m_labelfontweight, this.fontScaling(this.m_yAxis.m_labelfontsize * 1), selectGlobalFont(this.m_xAxis.m_labelfontfamily));
		for (var i = 0; i < this.m_calculation.m_markerTextArray.length; i++) {
			y1 = this.m_calculation.m_armSYCordinates[0][0];
			var y2 = y1 * 1 - armLength * i * Math.sin(Math.PI / 2) + 6;
			x1 = this.m_calculation.m_armSXCordinates[0][0];
			var x2 = x1 - 4;
			this.ctx.fillStyle = convertColorToHex(this.m_xAxis.m_labelfontcolor);
			this.m_textUtil.drawText(this.ctx, getFormattedNumberWithCommas(plottedAxisMarkers[i], this.m_numberformatter), x2, y2, fontProperties, "right");
		}
	} else {
		var temp = this;
		for (var i = 0; i < this.m_calculation.m_markerTextArray.length; i++) {
			y1 = this.m_calculation.m_armSYCordinates[0][0] * 1 - armLength * i * Math.sin(Math.PI / 2) + 6;
			var text = plottedAxisMarkers[i];
			x1 = this.m_calculation.m_armSXCordinates[0][0] - 4;
			var text = drawSVGText(x1, y1, text, convertColorToHex(this.m_xAxis.m_labelfontcolor), "right", "middle", 0);
			text.setAttribute("style", "font-family:" + selectGlobalFont(this.m_xAxis.m_labelfontfamily) + "; font-style:" + this.m_xAxis.m_labelfontstyle + "; font-size:" + this.fontScaling(this.m_yAxis.m_labelfontsize * 1) + "px; font-weight:" + this.m_xAxis.m_labelfontweight + "; text-decoration:none; text-shadow:none;");
			$("#" + temp.svgContainerId).append(text);
		}
	}
};
/** @description will draw series according to series value for polygon & circle,if showdoughnut is set to false **/
CircumplexChart.prototype.drawSeries = function() {
	var cx = this.m_calculation.getCenterX();
	var cy = this.m_calculation.getCenterY();
	var ratio = this.m_calculation.getArmLength() / this.m_calculation.getMaxValue();
	if (this.m_canvastype === "canvas") {
		for (var k = 0, i = 0; i < this.m_seriesNames.length; i++) {
			if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
				this.ctx.lineWidth = this.m_strokewidth;
				this.ctx.strokeStyle = this.m_strokecolor;
				for (var j = 0; j < this.m_calculation.m_seriesSXCordinates[k].length; j++) {
					this.ctx.beginPath();
					this.ctx.fillStyle = hex2rgb(this.m_seriesColorsArray[i][j], this.m_plotTrasparencyArray[i]);
					this.ctx.moveTo(cx, cy);
					
					if (this.m_webtype == "polygon") {
						var x1 = this.m_calculation.m_seriesSXCordinates[k][j];
						var y1 = this.m_calculation.m_seriesSYCordinates[k][j];
						this.ctx.lineTo(x1, y1);
						var x2 = this.m_calculation.m_seriesEXCordinates[k][j];
						var y2 = this.m_calculation.m_seriesEYCordinates[k][j];
						this.ctx.lineTo(x2, y2);
					} else {
						var sa, ea;
						var armLength = ratio * this.m_calculation.getAxisSetupDataValue(this.m_seriesData[i][j]);
						if (this.m_charttype == "clustered") {
							if (IsBoolean(this.m_clockwisedirection)) {
								sa = this.m_calculation.m_angleBetweenArms * (j) - (Math.PI / 2) * 1 + (this.m_calculation.m_angleBetweenArms / this.m_calculation.m_seriesData.length) * k;
								ea = this.m_calculation.m_angleBetweenArms * (j + 1) - (Math.PI / 2) * 1 - (this.m_calculation.m_angleBetweenArms * (this.m_calculation.m_seriesData.length - 1 - k) / this.m_calculation.m_seriesData.length);
								if (!isNaN(armLength) && armLength >= 0) {
									this.ctx.arc(cx, cy, armLength, sa, ea, false);
								}
							} else {
								sa = 0 - this.m_calculation.m_angleBetweenArms * (j) - (Math.PI / 2) * 1 - (this.m_calculation.m_angleBetweenArms / this.m_calculation.m_seriesData.length) * k;
								ea = 0 - this.m_calculation.m_angleBetweenArms * (j + 1) - (Math.PI / 2) * 1 + (this.m_calculation.m_angleBetweenArms * (this.m_calculation.m_seriesData.length - 1 - k) / this.m_calculation.m_seriesData.length);
								if (!isNaN(armLength) && armLength >= 0) {
									this.ctx.arc(cx, cy, armLength, sa, ea, true);
								}
							}
						} else {
							var overlaidMargin = 0;
							if (IsBoolean(this.m_clockwisedirection)) {
								sa = this.m_calculation.m_angleBetweenArms * (j) - (Math.PI / 2) * 1 + (this.m_calculation.m_angleBetweenArms / this.m_overlaidspacing) * (k + overlaidMargin);
								ea = this.m_calculation.m_angleBetweenArms * (j + 1) - (Math.PI / 2) * 1 - (this.m_calculation.m_angleBetweenArms / this.m_overlaidspacing) * (k + overlaidMargin);
								if (!isNaN(armLength) && armLength >= 0) {
									this.ctx.arc(cx, cy, armLength, sa, ea, false);
								}
							} else {
								sa = 0 - this.m_calculation.m_angleBetweenArms * (j) - (Math.PI / 2) * 1 - (this.m_calculation.m_angleBetweenArms / this.m_overlaidspacing) * (k + overlaidMargin);
								ea = 0 - this.m_calculation.m_angleBetweenArms * (j + 1) - (Math.PI / 2) * 1 + (this.m_calculation.m_angleBetweenArms / this.m_overlaidspacing) * (k + overlaidMargin);
								if (!isNaN(armLength) && armLength >= 0) {
									this.ctx.arc(cx, cy, armLength, sa, ea, true);
								}
							}
						}
					}
					this.ctx.lineTo(cx, cy);
					this.ctx.stroke();
					this.ctx.fill();
					this.ctx.closePath();
				}
				k++;
			}
		}
	} else {
		var temp = this;
		for (var k = 0, i = 0; i < this.m_seriesNames.length; i++) {
			if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
				for (var j = 0; j < this.m_calculation.m_seriesSXCordinates[k].length; j++) {
					var armLength = ratio * this.m_calculation.getAxisSetupDataValue(this.m_seriesData[i][j]);
					var x1 = this.m_calculation.m_seriesSXCordinates[k][j];
					var y1 = this.m_calculation.m_seriesSYCordinates[k][j];
					var x2 = this.m_calculation.m_seriesEXCordinates[k][j];
					var y2 = this.m_calculation.m_seriesEYCordinates[k][j];
					var path = "M" + cx + "," + cy + " ";
					path += "L" + x1 + "," + y1 + " ";
					if (this.m_calculation.m_seriesSXCordinates[k].length == 1) {
					    var X = (Math.abs(x2 - x1) < 1) ? 1 : (x2 - x1);
					    if (this.m_charttype == "clustered") {
					        var direction = "1,0" + " ";
					    } else {
					        direction = (Math.abs(x2 - x1) < 1) ? "1,0" + " " : "1,1" + " ";
					    }
					} else {
					    X = x2 - x1;
					    direction = (IsBoolean(this.m_clockwisedirection)) ? "0,1" + " " : "0,0" + " ";
					}
					if (this.m_webtype == "polygon") {
						path += x2 + "," + y2 + " ";
						path += cx + "," + cy + " ";
					} else {
						path += "a" + armLength + "," + armLength + " ";
						path += "0" + " ";
						path += direction;
						path += X + "," + (y2 - y1) + " ";
					}
					path += "z";
					var FillColor = hex2rgb(this.m_seriesColorsArray[i][j], this.m_plotTrasparencyArray[i]);
	                var colorArr = [FillColor, "transparent"];
	                /**Internet Explorer does not support svg animation.*/
	                var isIE = /*@cc_on!@*/false || !!document.documentMode;
	                if (IsBoolean(temp.m_enableanimation) && (temp.m_animationduration > 0) && !isIE) {
	                	FillColor = temp.circumplexEnableAnimatio(temp.m_objectid, j, k, armLength, temp.m_animationduration, colorArr);
	                }
					var svgPath = drawSVGPath();
					try {
						svgPath.setAttribute("d", path);
					} catch (e) {
						console.log(e);
					}
					svgPath.setAttribute("style", "stroke-width:" + this.m_strokewidth + "px; stroke:" + hex2rgb(convertColorToHex(this.m_strokecolor), 0.2) + "; fill:" + FillColor + ";");
					$("#" + temp.svgContainerId).append(svgPath);
				}
				k++;
			}
		}
	}
};
/** @description will draw series according to series value for  circle,if showdoughnut is set to true **/
CircumplexChart.prototype.drawCircleSeries = function() {
	var cx = this.m_calculation.getCenterX();
	var cy = this.m_calculation.getCenterY();
	var ratio = this.m_calculation.m_doughnutWidth / this.m_calculation.getMaxValue();
	if (this.m_canvastype === "canvas") {
	for (var k = 0, i = 0; i < this.m_seriesNames.length; i++) {
			if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
				for (var j = 0; j < this.m_calculation.m_seriesSXCordinates[k].length; j++) {
					this.ctx.beginPath();
					this.ctx.fillStyle = hex2rgb(this.m_seriesColorsArray[i][j], this.m_plotTrasparencyArray[i]);
					this.ctx.strokeStyle = 	this.ctx.fillStyle;
					var armLength = ratio * this.m_calculation.getAxisSetupDataValue(this.m_seriesData[i][j]);
						var sa, ea;
						if (this.m_charttype == "clustered") {
							if (IsBoolean(this.m_clockwisedirection)) {
								sa = this.m_calculation.m_angleBetweenArms * (j) - (Math.PI / 2) * 1 + (this.m_calculation.m_angleBetweenArms / this.m_calculation.m_seriesData.length) * k;
								ea = this.m_calculation.m_angleBetweenArms * (j + 1) - (Math.PI / 2) * 1 - (this.m_calculation.m_angleBetweenArms * (this.m_calculation.m_seriesData.length - 1 - k) / this.m_calculation.m_seriesData.length);
								this.ctx.lineWidth = armLength;
								if (!isNaN(armLength) && armLength > 0) {
									this.ctx.arc(cx, cy, ((this.m_calculation.getArmLength() - this.m_calculation.m_doughnutWidth) + armLength/2) , sa, ea, false);
								}
							} else {
								this.ctx.lineWidth = armLength;
								sa = 0 - this.m_calculation.m_angleBetweenArms * (j) - (Math.PI / 2) * 1 - (this.m_calculation.m_angleBetweenArms / this.m_calculation.m_seriesData.length) * k;
								ea = 0 - this.m_calculation.m_angleBetweenArms * (j + 1) - (Math.PI / 2) * 1 + (this.m_calculation.m_angleBetweenArms * (this.m_calculation.m_seriesData.length - 1 - k) / this.m_calculation.m_seriesData.length);
								if (!isNaN(armLength) && armLength > 0) {
									this.ctx.arc(cx, cy, ((this.m_calculation.getArmLength() - this.m_calculation.m_doughnutWidth) + armLength/2), sa, ea, true);
								}
							}
						} else {
							var overlaidMargin = 0;
							if (IsBoolean(this.m_clockwisedirection)) {
								sa = this.m_calculation.m_angleBetweenArms * (j) - (Math.PI / 2) * 1 + (this.m_calculation.m_angleBetweenArms / this.m_overlaidspacing) * (k + overlaidMargin);
								ea = this.m_calculation.m_angleBetweenArms * (j + 1) - (Math.PI / 2) * 1 - (this.m_calculation.m_angleBetweenArms / this.m_overlaidspacing) * (k + overlaidMargin);
								this.ctx.lineWidth = armLength;
								if (!isNaN(armLength) && armLength > 0) {
									this.ctx.arc(cx, cy, ((this.m_calculation.getArmLength() - this.m_calculation.m_doughnutWidth) + armLength/2), sa, ea, false);
								}
							} else {
								this.ctx.lineWidth = armLength;
								sa = 0 - this.m_calculation.m_angleBetweenArms * (j) - (Math.PI / 2) * 1 - (this.m_calculation.m_angleBetweenArms / this.m_overlaidspacing) * (k + overlaidMargin);
								ea = 0 - this.m_calculation.m_angleBetweenArms * (j + 1) - (Math.PI / 2) * 1 + (this.m_calculation.m_angleBetweenArms / this.m_overlaidspacing) * (k + overlaidMargin);
								if (!isNaN(armLength) && armLength > 0) {
									this.ctx.arc(cx, cy, ((this.m_calculation.getArmLength() - this.m_calculation.m_doughnutWidth) + armLength/2), sa, ea, true);
								}
							}
						}
						this.ctx.stroke();
						this.ctx.closePath();
					
				}
				k++;
			}
		}
	} else {
	    var temp = this;
	    var Radius = this.m_calculation.getArmLength() - this.m_calculation.m_doughnutWidth;
	    for (var k = 0, i = 0; i < this.m_seriesNames.length; i++) {
	        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
	            for (var j = 0; j < this.m_calculation.m_seriesSXCordinates[k].length; j++) {
	                var armLength = ratio * this.m_calculation.getAxisSetupDataValue(this.m_seriesData[i][j]);
	                if(this.m_charttype == "clustered"){
	                	var x1 = this.m_calculation.m_seriesSDXCordinates[k][j];
	 	                var y1 = this.m_calculation.m_seriesSDYCordinates[k][j];
	 	                var x2 = this.m_calculation.m_seriesEDXCordinates[k][j];
	 	                var y2 = this.m_calculation.m_seriesEDYCordinates[k][j];
	 	                var x3 = this.m_calculation.m_armSXCordinates[j][k];
	 	                var y3 = this.m_calculation.m_armSYCordinates[j][k];
	 	                if (this.m_seriesNames.length == 1) {
	 	                   var j1 = (j == this.m_calculation.m_seriesSXCordinates[k].length - 1) ? 0 : j + 1;
	 	                    var x4 = this.m_calculation.m_armSXCordinates[j1][k];
	 	                    var y4 = this.m_calculation.m_armSYCordinates[j1][k];
	 	                } else {
	 	                    var k1 = (k == this.m_calculation.m_seriesSXCordinates.length - 1) ? 0 : k + 1;
	 	                    j1 = (k == this.m_calculation.m_seriesSXCordinates.length - 1) ? ((j == this.m_calculation.m_seriesSXCordinates[k].length - 1) ? 0 : j + 1) : j;
	 	                    var x4 = this.m_calculation.m_armSXCordinates[j1][k1];
	 	                    var y4 = this.m_calculation.m_armSYCordinates[j1][k1];
	 	                }
	                }else{
	                	if(this.m_seriesNames.length == 1){
							var x3 = this.m_calculation.m_armSXCordinates[j][k];
							var y3 = this.m_calculation.m_armSYCordinates[j][k];
							var x1 = this.m_calculation.m_seriesSDXCordinates[k][j];
							var y1 = this.m_calculation.m_seriesSDYCordinates[k][j];
							var x2 = this.m_calculation.m_seriesEDXCordinates[k][j];
							var y2 = this.m_calculation.m_seriesEDYCordinates[k][j];
							j1 = (j ==  this.m_calculation.m_seriesSXCordinates[k].length - 1) ?  0   : j + 1 ;
							var x4 = this.m_calculation.m_armSXCordinates[j1][k];
							var y4 = this.m_calculation.m_armSYCordinates[j1][k];
						}
						else{
							var x3 = this.m_calculation.m_armSOXCordinates[j][k];
							var y3 = this.m_calculation.m_armSOYCordinates[j][k];
							var x1 = this.m_calculation.m_seriesSDXCordinates[k][j];
							var y1 = this.m_calculation.m_seriesSDYCordinates[k][j];
							var x2 = this.m_calculation.m_seriesEDXCordinates[k][j];
							var y2 = this.m_calculation.m_seriesEDYCordinates[k][j];
				            j1 = (j ==  this.m_calculation.m_seriesSXCordinates[k].length - 1) ?  0   : j + 1 ;
							k1 = (j == this.m_calculation.m_seriesSXCordinates.length - 1) ? ((k ==  this.m_calculation.m_seriesSXCordinates[k].length - 1) ?  k + 1   : 0) : k;
						    var x4 = this.m_calculation.m_armEOXCordinates[j1][k1];
							var y4 = this.m_calculation.m_armEOYCordinates[j1][k1];
						}
	                }
	               
	                if (this.m_calculation.m_seriesSXCordinates[k].length == 1) {
	                    var flag = 1;
	                    var padding = 1;
	                } else {
	                    var flag = 0;
	                    var padding = 0;
	                }
	                if (IsBoolean(this.m_clockwisedirection)) {
	                    var clock_1 = 1;
	                    var clock_2 = 0;
	                } else {
	                    var clock_1 = 0;
	                    var clock_2 = 1;
	                }
	                var path = [
	                    "M", x3, y3,
	                    "L", x1, y1,
	                    "A", armLength + Radius, armLength + Radius, 0, flag, clock_1, x2 - padding, y2,
	                    "L", x4 - padding, y4,
	                    "A", (Radius), (Radius), 0, flag, clock_2, x3, y3
	                ].join(" ");
	                var svgPath = drawSVGPath();
	                try {
	                    svgPath.setAttribute("d", path);
	                } catch (e) {
	                    console.log(e);
	                }
	                var FillColor = hex2rgb(this.m_seriesColorsArray[i][j], this.m_plotTrasparencyArray[i]);
	                var colorArr = [FillColor, "transparent"];
	                /**Internet Explorer does not support svg animation.*/
	                var isIE = /*@cc_on!@*/false || !!document.documentMode;
	                if (IsBoolean(temp.m_enableanimation) && (temp.m_animationduration > 0) && !isIE) {
	                	FillColor = temp.circumplexEnableAnimatio(temp.m_objectid, j, k, armLength, temp.m_animationduration, colorArr);
	                }
	                svgPath.setAttribute("style", "stroke-width:" + this.m_strokewidth + "px; stroke:" + hex2rgb(convertColorToHex(this.m_strokecolor), 0.2) + "; fill:" + FillColor + ";");
	                $("#" + temp.svgContainerId).append(svgPath);
	            }
	            k++;
	        }
	    }
	}
};
/**Added to apply Animation in the component*/
CircumplexChart.prototype.circumplexEnableAnimatio = function(ObjId,  j, k, armLength, animationduration, colorArr) {
	var content = document.createElementNS(NS, "linearGradient");
    content.setAttribute("id", "LinearGradient" + ObjId + j + k);
    for (var m = 0; m < 2; m++) {
        var stop = document.createElementNS(NS, "stop");
        stop.setAttribute("offset", "0");
        stop.setAttribute("stop-color", colorArr[m]);
        var Animate = drawSVGStackAnimation(0, "offset", armLength, animationduration);
        $(stop).append(Animate);
        $(stop).attr("class", "pointShapeColorAnimation");
        $(content).append(stop);
    }
    $("#defsElement" + ObjId).append(content);
    var FillColor = "url(#LinearGradient" + ObjId + j + k + ")";
    return FillColor;
};
/** @description will draw series according to series value for  polygon,if showdoughnut is set to true **/
CircumplexChart.prototype.drawPolygonSeries = function() {
	var ratio = this.m_calculation.m_doughnutWidth / this.m_calculation.getMaxValue();
	if (this.m_canvastype === "canvas") {
	for (var k = 0, i = 0; i < this.m_seriesNames.length; i++) {
			if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
				for (var j = 0; j < this.m_calculation.m_seriesSXCordinates[k].length; j++) {
					this.ctx.beginPath();
					this.ctx.fillStyle = hex2rgb(this.m_seriesColorsArray[i][j], this.m_plotTrasparencyArray[i]);
					this.ctx.strokeStyle = 	this.ctx.fillStyle;
					var armLength = ratio * this.m_calculation.getAxisSetupDataValue(this.m_seriesData[i][j]);
					    if(this.m_charttype == "clustered"){
                          var x1 = this.m_calculation.m_armSXCordinates[j][k];
						  var y1 = this.m_calculation.m_armSYCordinates[j][k];
						  this.ctx.moveTo(x1, y1);	
				          var x2 = this.m_calculation.m_seriesSDXCordinates[k][j];
					      var y2 = this.m_calculation.m_seriesSDYCordinates[k][j];
					      this.ctx.lineTo(x2, y2);
					      var x3 = this.m_calculation.m_seriesEDXCordinates[k][j];
					      var y3 = this.m_calculation.m_seriesEDYCordinates[k][j];
						  this.ctx.lineTo(x3, y3);
						   if(this.m_seriesNames.length == 1){
							   j1 = (j ==  this.m_calculation.m_seriesSXCordinates[k].length - 1) ?  0   : j + 1 ;
						       var x4 = this.m_calculation.m_armSXCordinates[j1][k];
							   var y4 = this.m_calculation.m_armSYCordinates[j1][k];
							   this.ctx.lineTo(x4,y4);
							  }
							else{
							   k1 = (k == this.m_calculation.m_seriesSXCordinates.length - 1) ? 0 : k + 1;	
							   j1 = (k == this.m_calculation.m_seriesSXCordinates.length - 1) ? ((j ==  this.m_calculation.m_seriesSXCordinates[k].length - 1) ?  0   : j + 1) : j;
							   var x4 = this.m_calculation.m_armSXCordinates[j1][k1];
							   var y4 = this.m_calculation.m_armSYCordinates[j1][k1];
							   this.ctx.lineTo(x4,y4);
								}
					        }
					        else{
						        if(this.m_seriesNames.length == 1){
									var x1 = this.m_calculation.m_armSXCordinates[j][k];
									var y1 = this.m_calculation.m_armSYCordinates[j][k];
									this.ctx.moveTo(x1, y1);	
									var x2 = this.m_calculation.m_seriesSDXCordinates[k][j];
									var y2 = this.m_calculation.m_seriesSDYCordinates[k][j];
									this.ctx.lineTo(x2, y2);
									var x3 = this.m_calculation.m_seriesEDXCordinates[k][j];
									var y3 = this.m_calculation.m_seriesEDYCordinates[k][j];
									this.ctx.lineTo(x3, y3);
									j1 = (j ==  this.m_calculation.m_seriesSXCordinates[k].length - 1) ?  0   : j + 1 ;
									var x4 = this.m_calculation.m_armSXCordinates[j1][k];
									var y4 = this.m_calculation.m_armSYCordinates[j1][k];
									this.ctx.lineTo(x4,y4);
								}
								else{
									var x1 = this.m_calculation.m_armSOXCordinates[j][k];
									var y1 = this.m_calculation.m_armSOYCordinates[j][k];
									this.ctx.moveTo(x1, y1);	
									var x2 = this.m_calculation.m_seriesSDXCordinates[k][j];
									var y2 = this.m_calculation.m_seriesSDYCordinates[k][j];
									this.ctx.lineTo(x2, y2);
									var x3 = this.m_calculation.m_seriesEDXCordinates[k][j];
									var y3 = this.m_calculation.m_seriesEDYCordinates[k][j];
									this.ctx.lineTo(x3, y3);
						            j1 = (j ==  this.m_calculation.m_seriesSXCordinates[k].length - 1) ?  0   : j + 1 ;
									k1 = (j == this.m_calculation.m_seriesSXCordinates.length - 1) ? ((k ==  this.m_calculation.m_seriesSXCordinates[k].length - 1) ?  k + 1   : 0) : k;
								    var x4 = this.m_calculation.m_armEOXCordinates[j1][k1];
									var y4 = this.m_calculation.m_armEOYCordinates[j1][k1];
								    this.ctx.lineTo(x4,y4);
								}
					        }
					this.ctx.fill();
					this.ctx.closePath();
				}
				k++;
			}
		}
	} else {
	    var id = this.svgContainerId;
	    for (var k = 0, i = 0; i < this.m_seriesNames.length; i++) {
	        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
	            for (var j = 0; j < this.m_calculation.m_seriesSXCordinates[k].length; j++) {
	                var FillColor = hex2rgb(this.m_seriesColorsArray[i][j], this.m_plotTrasparencyArray[i]);
	                var colorArr = [FillColor, "transparent"];
	                var armLength = ratio * this.m_calculation.getAxisSetupDataValue(this.m_seriesData[i][j]);
	                if (this.m_charttype == "clustered") {
	                    var x1 = this.m_calculation.m_armSXCordinates[j][k];
	                    var y1 = this.m_calculation.m_armSYCordinates[j][k];
	                    var x2 = this.m_calculation.m_seriesSDXCordinates[k][j];
	                    var y2 = this.m_calculation.m_seriesSDYCordinates[k][j];
	                    var x3 = this.m_calculation.m_seriesEDXCordinates[k][j];
	                    var y3 = this.m_calculation.m_seriesEDYCordinates[k][j];
	                    if (this.m_seriesNames.length == 1) {
	                        j1 = (j == this.m_calculation.m_seriesSXCordinates[k].length - 1) ? 0 : j + 1;
	                        var x4 = this.m_calculation.m_armSXCordinates[j1][k];
	                        var y4 = this.m_calculation.m_armSYCordinates[j1][k];
	                    } else {
	                        k1 = (k == this.m_calculation.m_seriesSXCordinates.length - 1) ? 0 : k + 1;
	                        j1 = (k == this.m_calculation.m_seriesSXCordinates.length - 1) ? ((j == this.m_calculation.m_seriesSXCordinates[k].length - 1) ? 0 : j + 1) : j;
	                        var x4 = this.m_calculation.m_armSXCordinates[j1][k1];
	                        var y4 = this.m_calculation.m_armSYCordinates[j1][k1];
	                    }
	                    var path = [
	                        "M", x1, y1,
	                        "L", x2, y2,
	                        "L", x3, y3,
	                        "L", x4, y4
	                    ].join(" ");
	                    /**Internet Explorer does not support svg animation.*/
	                    var isIE = /*@cc_on!@*/ false || !!document.documentMode;
	                    if (IsBoolean(this.m_enableanimation) && (this.m_animationduration > 0) && !isIE) {
	                        FillColor = this.circumplexEnableAnimatio(this.m_objectid, j, k, armLength, this.m_animationduration, colorArr);
	                    }
	                    var svgPath = drawSVGPath();
	                    svgPath.setAttribute('d', path);
	                    svgPath.setAttribute("style", "stroke-width:" + this.m_polylinewidth + "px; stroke:" + FillColor + ";fill:" + FillColor + ";");
	                    $("#" + id).append(svgPath);
	                } else {
	                    if (this.m_seriesNames.length == 1) {
	                        var x1 = this.m_calculation.m_armSXCordinates[j][k];
	                        var y1 = this.m_calculation.m_armSYCordinates[j][k];
	                        var x2 = this.m_calculation.m_seriesSDXCordinates[k][j];
	                        var y2 = this.m_calculation.m_seriesSDYCordinates[k][j];
	                        var x3 = this.m_calculation.m_seriesEDXCordinates[k][j];
	                        var y3 = this.m_calculation.m_seriesEDYCordinates[k][j];
	                        j1 = (j == this.m_calculation.m_seriesSXCordinates[k].length - 1) ? 0 : j + 1;
	                        var x4 = this.m_calculation.m_armSXCordinates[j1][k];
	                        var y4 = this.m_calculation.m_armSYCordinates[j1][k];
	                    } else {
	                        var x1 = this.m_calculation.m_armSOXCordinates[j][k];
	                        var y1 = this.m_calculation.m_armSOYCordinates[j][k];
	                        var x2 = this.m_calculation.m_seriesSDXCordinates[k][j];
	                        var y2 = this.m_calculation.m_seriesSDYCordinates[k][j];
	                        var x3 = this.m_calculation.m_seriesEDXCordinates[k][j];
	                        var y3 = this.m_calculation.m_seriesEDYCordinates[k][j];
	                        j1 = (j == this.m_calculation.m_seriesSXCordinates[k].length - 1) ? 0 : j + 1;
	                        k1 = (j == this.m_calculation.m_seriesSXCordinates.length - 1) ? ((k == this.m_calculation.m_seriesSXCordinates[k].length - 1) ? k + 1 : 0) : k;
	                        var x4 = this.m_calculation.m_armEOXCordinates[j1][k1];
	                        var y4 = this.m_calculation.m_armEOYCordinates[j1][k1];
	                    }
	                    var path = [
	                        "M", x1, y1,
	                        "L", x2, y2,
	                        "L", x3, y3,
	                        "L", x4, y4
	                    ].join(" ");
	                    /**Internet Explorer does not support svg animation.*/
	                    var isIE = /*@cc_on!@*/ false || !!document.documentMode;
	                    if (IsBoolean(this.m_enableanimation) && (this.m_animationduration > 0) && !isIE) {
	                        FillColor = this.circumplexEnableAnimatio(this.m_objectid, j, k, armLength, this.m_animationduration, colorArr);
	                    }
	                    var svgPath = drawSVGPath();
	                    svgPath.setAttribute('d', path);
	                    svgPath.setAttribute("style", "stroke-width:" + this.m_polylinewidth + "px; stroke:" + FillColor + ";fill:" + FillColor + ";");
	                    $("#" + id).append(svgPath);
	                }
	            }
	            k++;
	        }
	    }
	}
	};
/** @description will calculate and return tooltip data for CircumplexChart
* @params(Number) mouseX
* @params(Number) mouseY
* @returns(Object) toolTipData (or) false
**/
CircumplexChart.prototype.getToolTipData = function(mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory) && IsBoolean(this.isVisibleSeries()) && IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")) {
        if (IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")) {
            var armLength = this.m_calculation.getArmLength();
            var deltaX = mouseX - this.m_calculation.getCenterX();
            var deltaY = mouseY - this.m_calculation.getCenterY();

            var angle;
            if (deltaY < 0) {
                if (deltaX > 0) {
                    // 1st Quad
                    angle = (IsBoolean(this.m_clockwisedirection)) ? Math.PI / 2 - Math.atan2(-deltaY, deltaX) : Math.PI * 3 / 2 + Math.atan2(-deltaY, deltaX);
                }
                if (deltaX < 0) {
                    // 2nd Quad
                    angle = (IsBoolean(this.m_clockwisedirection)) ? Math.PI * 5 / 2 + Math.atan2(deltaY, deltaX) : -Math.atan2(deltaY, deltaX) - Math.PI / 2;
                }
            } else {
                if (deltaX < 0) {
                    // 3rd Quad
                    angle = (IsBoolean(this.m_clockwisedirection)) ? Math.PI * 3 / 2 - Math.atan2(deltaY, -deltaX) : Math.PI + Math.atan2(deltaY, -deltaX) - Math.PI / 2;
                }
                if (deltaX > 0) {
                    // 4th Quad
                    angle = (IsBoolean(this.m_clockwisedirection)) ? Math.PI * 3 / 2 - Math.atan2(deltaY, -deltaX) : Math.PI * 2 - Math.atan2(deltaY, deltaX) - Math.PI / 2;
                }
            }
            /** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2 **/
            var toolTipData;
            var Radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
            if (Radius <= armLength && Radius >= (this.m_calculation.getArmLength() - this.m_calculation.m_doughnutWidth)) {
                for (var j = 0; j < this.m_seriesData[0].length; j++) {
                    if (angle >= this.m_calculation.m_angleBetweenArms * (j) && angle <= this.m_calculation.m_angleBetweenArms * (j + 1)) {
                        if (IsBoolean(this.m_customtextboxfortooltip.dataTipType == "Default")) {
                            toolTipData = {
                                cat: "",
                                subCat: "",
                                subCatData: "",
                                data: []
                            };
                            for (var i = 0; i < this.m_seriesData.length; i++) {
                            	var newVal;
                                if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
                                	if ((this.m_seriesData[i][j] == "" || isNaN(this.m_seriesData[i][j]) || this.m_seriesData[i][j] == null || this.m_seriesData[i][j] == "null")) {
    									newVal = this.m_seriesData[i][j];
    								} else {
	                                    var num = this.m_seriesData[i][j] * 1;
	                                    if (num % 1 != 0 && this.m_tooltipprecision !== "default") {
	                                        newVal = num.toFixed(this.m_tooltipprecision);
	                                    } else {
	                                        newVal = this.m_seriesData[i][j] * 1;
	                                    }
    								}
                                    toolTipData.cat = this.m_categoryData[j][0];
                                    toolTipData.subCat = this.m_subCategoryDisplayNames[0];
                                    toolTipData.subCatData = this.m_subCategoryData[j][0];
                                    var FormterData = this.getFormatterForToolTip(newVal);
                                    var data = new Array();
                                    data[0] = hex2rgb(this.m_seriesColorsArray[i][j], this.m_plotTrasparencyArray[i]);
                                    data[1] = this.m_seriesDisplayNames[i];
                                    data[2] = FormterData;
                                    toolTipData.data.push(data);
                                }
                            }
                            toolTipData.highlightIndex = this.getDrillColor(angle, Radius);
                        } else {
                            toolTipData = this.getDataProvider()[j];
                        }
                    } else {
                        this.hideToolTip();
                    }
                }
            }
            return toolTipData;
        } else {
            return false;
        }
    }
};
/** @description Getter method for getDrillColor for clustered/overlaid 
* @params(Number) angle
* @returns(Number) i,value will used for highlightIndex
**/
CircumplexChart.prototype.getDrillColor = function(angle, Radius){
	if((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory)))){
		var armLength = this.m_calculation.getArmLength();
		for (var j = 0; j < this.visibleSeriesInfo.seriesData[0].length; j++) {
			if (this.m_charttype == "clustered"){
				for (var i = 0,count = 0; i < this.visibleSeriesInfo.seriesData.length; i++) {
					if (IsBoolean(this.m_seriesVisibleArr[this.visibleSeriesInfo.seriesName[i]])) {
						var ratio = this.m_calculation.m_doughnutWidth / this.m_calculation.getMaxValue();
						var range = ratio * this.m_calculation.getAxisSetupDataValue(this.visibleSeriesInfo.seriesData[i][j]);
						if (Radius <= ((armLength - this.m_calculation.m_doughnutWidth) + range) && Radius >= (armLength - this.m_calculation.m_doughnutWidth)) {
							if (angle >= (this.m_calculation.m_angleBetweenArms * (j) + this.m_calculation.m_angleBetweenArms*(count)/this.m_calculation.m_seriesData.length) && angle <= (this.m_calculation.m_angleBetweenArms * (j) + this.m_calculation.m_angleBetweenArms*(count+1)/this.m_calculation.m_seriesData.length) ) {
								return count;
							}
						}
						count++;
					}
				}
			} else {
				for (var k = 0; k < this.visibleSeriesInfo.seriesData[0].length; k++) {
				    for (var i = this.visibleSeriesInfo.seriesData.length - 1; i >= 0; i--) {
				        if (IsBoolean(this.m_seriesVisibleArr[this.visibleSeriesInfo.seriesName[i]])) {
				            var ratio = this.m_calculation.m_doughnutWidth / this.m_calculation.getMaxValue();
				            var range = ratio * this.m_calculation.getAxisSetupDataValue(this.visibleSeriesInfo.seriesData[i][k]);
				            if (Radius <= ((armLength - this.m_calculation.m_doughnutWidth) + range) && Radius >= (armLength - this.m_calculation.m_doughnutWidth)) {
				                if (angle >= (this.m_calculation.m_angleBetweenArms * (k) + this.m_calculation.m_angleBetweenArms / (2 * this.m_overlaidspacing) * (i)) && angle <= (this.m_calculation.m_angleBetweenArms * (k + 1) - this.m_calculation.m_angleBetweenArms / (2 * this.m_overlaidspacing) * (i))) {
				                    return i;
				                }
				            }
				        }
				    }
				}
			}
		}
	}
};
/** @description Getter method for formatting  the text values 
* @params(Number) data
* @returns(Number) dataWithFormatter
**/
CircumplexChart.prototype.getFormatterText = function(data, prec) {
	var dataWithFormatter = data;
	if (!IsBoolean(this.getFixedLabel())){
		dataWithFormatter = this.m_yAxis.getFormattedText(data, prec);
	}
	return dataWithFormatter;
};
/** @description Calculate drill data points and return required data
* @params(Number) mouseX
* @params(Number) mouseY
* @returns(Object) drillRecord
* @returns(String) drillColor
**/
CircumplexChart.prototype.getDrillDataPoints = function(mouseX, mouseY) {
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory))) && IsBoolean(this.isVisibleSeries())) {
		var armLength = this.m_calculation.getArmLength();
		var deltaX = mouseX - this.m_calculation.getCenterX();
		var deltaY = mouseY - this.m_calculation.getCenterY();
		var angle;
		if (deltaY < 0) {
			if (deltaX > 0) {
				// 1st Quad
				angle = (IsBoolean(this.m_clockwisedirection)) ? Math.PI / 2 - Math.atan2(-deltaY, deltaX) : Math.PI * 3 / 2 + Math.atan2(-deltaY, deltaX);
			}
			if (deltaX < 0) {
				// 2nd Quad
				angle = (IsBoolean(this.m_clockwisedirection)) ? Math.PI * 5 / 2 + Math.atan2(deltaY, deltaX) : -Math.atan2(deltaY, deltaX) - Math.PI / 2;
			}
		} else {
			if (deltaX < 0) {
				// 3rd Quad
				angle = (IsBoolean(this.m_clockwisedirection)) ? Math.PI * 3 / 2 - Math.atan2(deltaY, -deltaX) : Math.PI + Math.atan2(deltaY, -deltaX) - Math.PI / 2;
			}
			if (deltaX > 0) {
				// 4th Quad
				angle = (IsBoolean(this.m_clockwisedirection)) ? Math.PI * 3 / 2 - Math.atan2(deltaY, -deltaX) : Math.PI * 2 - Math.atan2(deltaY, deltaX) - Math.PI / 2;
			}
		}
		/** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2 **/
		var drillColor, drillField, drillDisplayField;
		var Radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
		if (Radius <= armLength && Radius >= (this.m_calculation.getArmLength() - this.m_calculation.m_doughnutWidth)) {
			for (var j = 0; j < this.m_seriesData[0].length; j++) {
				if (angle >= this.m_calculation.m_angleBetweenArms * (j) && angle <= this.m_calculation.m_angleBetweenArms * (j + 1)) {
					var i = this.getDrillColor(angle, Radius);
					if(i !== undefined){
						drillColor = this.m_seriesColorsArray[i][j];
						drillField = this.visibleSeriesInfo.seriesName[i];
						drillDisplayField = this.visibleSeriesInfo.seriesDisplayName[i];
					}else{
						break;
						/*for (var i = 0; i < this.m_seriesData.length; i++) {
							if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
								drillColor = this.m_seriesColorsArray[i][j];
								drillField = this.getSeriesNames()[i];
								drillDisplayField = this.getSeriesDisplayNames()[i];
							}
						}*/
					}
					var fieldNameValueMap = this.getFieldNameValueMap(j);
					var drillValue = fieldNameValueMap[drillField];
					fieldNameValueMap.drillField = drillField;
					fieldNameValueMap.drillDisplayField = drillDisplayField;
					fieldNameValueMap.drillValue = drillValue;
					return {
						"drillRecord": fieldNameValueMap,
						"drillColor": drillColor
					};
				}
			}
		}
	}
};
/** description method will return required shape for drawing legend. **/
CircumplexChart.prototype.getLegendShape = function (i) {
	var shape;
	if(IsBoolean(this.m_useseriescolors) && !IsBoolean(this.m_isEmptySeries)) {
	   shape = this.legendMapForSeriesColors[this.m_categoryUniqueNames[i][0]].shape;
	} else {
		shape = this.legendMap[this.getSeriesNames()[i]].shape;
	}
	return shape;
};
/** @description constructor  method CircumplexChart  **/
function CircumplexChartCalculation() {
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
	this.m_seriesSXCordinates = [];
	this.m_seriesSXCordinates = [];
	this.m_seriesEXCordinates = [];
	this.m_seriesEYCordinates = [];
};
/** @description initialize the CircumplexChartCalculation  **/
CircumplexChartCalculation.prototype.init = function(circumplexChart, m_categoryData, m_seriesData) {
	this.m_chart = circumplexChart;
	this.m_categoryData = m_categoryData;
	this.m_numberOfArms = m_categoryData.length;
	this.m_angleBetweenArms = (Math.PI * 2) / this.m_numberOfArms;
	this.m_seriesData = this.m_chart.getVisibleSeriesData(m_seriesData).seriesData;
	this.m_webtype = this.m_chart.m_webtype;

	this.setDrawHeight();
	this.setDrawWidth();
	this.setArmLength();
	this.setDoughnutWidth();
	this.setCenterX();
	this.setCenterY();
     
	this.setArmsStartCoordinates();
	this.setArmsEndCoordinates();
	this.setArmsEndCoordinatesForCategoryLabel();
	this.calculateMinimumMaximum();
//	this.setMaxValue();
//	this.setArmMarkers();
	this.setArmMarkersCoordinates();
	this.setSeriesStartCoordinates();
	this.setSeriesEndCoordinates();

	if( IsBoolean(this.m_chart.m_showdoughnut)){
		this.setArmMarkersCoordinates1();
		this.setArmsStartOCoordinates();
		this.setArmsEndOCoordinates();
		this.setSeriesStartDCoordinates();
		this.setSeriesEndDCoordinates();
	}
};
/** @description Setter method for required drawing height for CircumplexChart**/
CircumplexChartCalculation.prototype.setDrawHeight = function() {
	this.drawHeight = this.m_chart.getStartY() * 1 - this.m_chart.getEndY() * 1;
};
/** @description Getter method for returning drawHeight**/
CircumplexChartCalculation.prototype.getDrawHeight = function() {
	return this.drawHeight;
};
/** @description Setter method for required drawing width for CircumplexChart**/
CircumplexChartCalculation.prototype.setDrawWidth = function() {
	this.drawWidth = this.m_chart.getEndX() * 1 - this.m_chart.getStartX() * 1;
};
/** @description Getter method for returning drawWidth **/
CircumplexChartCalculation.prototype.getDrawWidth = function() {
	return this.drawWidth;
};
/** @description Setter Method for Complete Armlength required.**/
CircumplexChartCalculation.prototype.setArmLength = function() {
	this.m_armLength = Math.min(this.getDrawHeight() / 2, this.getDrawWidth() / 2);
	this.m_armLength = this.m_armLength * 8 / 10;
};
/** @description finding  the value of doughnutwidth,if showdoughnut is set to true.**/
CircumplexChartCalculation.prototype.setDoughnutWidth = function() {
	this.m_doughnutWidth = this.getArmLength() * this.m_chart.m_linewidth / 100;
	this.m_chart.m_showdoughnut = (this.m_chart.m_linewidth == 100 ) ? false : true;
	if(this.m_seriesData.length > 5){
		this.m_chart.m_overlaidspacing = (this.m_seriesData.length * 2) + 1;
	}
};
/** @description Getter method for for finding armLength. **/
CircumplexChartCalculation.prototype.getArmLength = function() {
	return this.m_armLength;
};
/** @description Setter method for CenterX value.**/
CircumplexChartCalculation.prototype.setCenterX = function() {
	this.m_centerX = (this.m_chart.m_x) * 1 + (this.getDrawWidth() / 2) * 1;
};
/** @description Getter method for   centerX. **/
CircumplexChartCalculation.prototype.getCenterX = function() {
	return this.m_centerX;
};
/** @description Setter method for CenterY value.**/
CircumplexChartCalculation.prototype.setCenterY = function() {
	this.m_centerY = this.m_chart.getEndY() * 1 + (this.getDrawHeight() / 2);
};
/** @description Getter method for for  centerY. **/
CircumplexChartCalculation.prototype.getCenterY = function() {
	return this.m_centerY;
};
/** @description finding  Start Coordinate arrays of Arms for cricle/polygon **/
CircumplexChartCalculation.prototype.setArmsStartCoordinates = function() {
	this.m_armSXCordinates = [];
	this.m_armSYCordinates = [];
	for (var i = 0; i < this.m_numberOfArms; i++) {
		this.m_armSXCordinates[i] = [];
		this.m_armSYCordinates[i] = [];
		for (var j = 0; j < this.m_seriesData.length; j++) {
			var theta;
			if (IsBoolean(this.m_chart.m_clockwisedirection)) {
				theta = (Math.PI / 2) * 1 - this.m_angleBetweenArms * (i);
			} else {
				theta = this.m_angleBetweenArms * (i) + (Math.PI / 2) * 1;
			}
			if (this.m_chart.m_charttype == "clustered") {
				theta = (IsBoolean(this.m_chart.m_clockwisedirection)) ?
					theta - (this.m_angleBetweenArms / this.m_seriesData.length) * j :
					theta + (this.m_angleBetweenArms / this.m_seriesData.length) * j;
			}
			this.m_armSXCordinates[i][j] = this.getCenterX() * 1 + (this.getArmLength() - this.m_doughnutWidth) * Math.cos(theta);
			this.m_armSYCordinates[i][j] = this.getCenterY() * 1 - (this.getArmLength() - this.m_doughnutWidth) * Math.sin(theta);
		}
	}
};
/** @description finding End Coordinate arrays of Arms for cricle/polygon **/
CircumplexChartCalculation.prototype.setArmsEndCoordinates = function() {
	this.m_armXCordinates = [];
	this.m_armYCordinates = [];
	for (var i = 0; i < this.m_numberOfArms; i++) {
		this.m_armXCordinates[i] = [];
		this.m_armYCordinates[i] = [];
		for (var j = 0; j < this.m_seriesData.length; j++) {
			var theta;
			if (IsBoolean(this.m_chart.m_clockwisedirection)) {
				theta = (Math.PI / 2) * 1 - this.m_angleBetweenArms * (i);
			} else {
				theta = this.m_angleBetweenArms * (i) + (Math.PI / 2) * 1;
			}
			if (this.m_chart.m_charttype == "clustered") {
				theta = (IsBoolean(this.m_chart.m_clockwisedirection)) ?
					theta - (this.m_angleBetweenArms / this.m_seriesData.length) * j :
					theta + (this.m_angleBetweenArms / this.m_seriesData.length) * j;
			}
			this.m_armXCordinates[i][j] = this.getCenterX() * 1 + this.getArmLength() * Math.cos(theta);
			this.m_armYCordinates[i][j] = this.getCenterY() * 1 - this.getArmLength() * Math.sin(theta);
		}
	}
};
/** @description finding Start Coordinate arrays of Series for polygon - Overlaid **/
CircumplexChartCalculation.prototype.setArmsStartOCoordinates = function() {
	this.m_armSOXCordinates = [];
	this.m_armSOYCordinates = [];
	for (var i = 0; i < this.m_numberOfArms; i++) {
		this.m_armSOXCordinates[i] = [];
		this.m_armSOYCordinates[i] = [];
		for (var j = 0; j < this.m_seriesData.length; j++) {
			var theta;
			if (IsBoolean(this.m_chart.m_clockwisedirection)) {
				theta = (Math.PI / 2) * 1 - this.m_angleBetweenArms * (i) - (this.m_angleBetweenArms *j / (2 * this.m_chart.m_overlaidspacing) );
			} else {
				theta = this.m_angleBetweenArms * (i) + (Math.PI / 2) * 1 + (this.m_angleBetweenArms *j / (2 * this.m_chart.m_overlaidspacing) );
			}
			if (this.m_chart.m_charttype == "clustered") {
				theta = (IsBoolean(this.m_chart.m_clockwisedirection)) ?
					theta - (this.m_angleBetweenArms / this.m_seriesData.length) * j :
					theta + (this.m_angleBetweenArms / this.m_seriesData.length) * j;
			}
			this.m_armSOXCordinates[i][j] = this.getCenterX() * 1 + (this.getArmLength() - this.m_doughnutWidth) * Math.cos(theta);
			this.m_armSOYCordinates[i][j] = this.getCenterY() * 1 - (this.getArmLength() - this.m_doughnutWidth) * Math.sin(theta);
		}
	}
};
/** @description finding End Coordinate arrays of Series for polygon - Overlaid **/
CircumplexChartCalculation.prototype.setArmsEndOCoordinates = function() {
	this.m_armEOXCordinates = [];
	this.m_armEOYCordinates = [];
	for (var i = 0; i < this.m_numberOfArms; i++) {
		this.m_armEOXCordinates[i] = [];
		this.m_armEOYCordinates[i] = [];
		for (var j = 0; j < this.m_seriesData.length; j++) {
			var theta;
			if (IsBoolean(this.m_chart.m_clockwisedirection)) {
				theta = (Math.PI / 2) * 1 - this.m_angleBetweenArms * (i) + (this.m_angleBetweenArms *j / (2 * this.m_chart.m_overlaidspacing) );
			} else {
				theta = this.m_angleBetweenArms * (i) + (Math.PI / 2) * 1 - (this.m_angleBetweenArms *j / (2 * this.m_chart.m_overlaidspacing) );
			}
			if (this.m_chart.m_charttype == "clustered") {
				theta = (IsBoolean(this.m_chart.m_clockwisedirection)) ?
					theta - (this.m_angleBetweenArms / this.m_seriesData.length) * j :
					theta + (this.m_angleBetweenArms / this.m_seriesData.length) * j;
			}
			this.m_armEOXCordinates[i][j] = this.getCenterX() * 1 + (this.getArmLength() - this.m_doughnutWidth) * Math.cos(theta);
			this.m_armEOYCordinates[i][j] = this.getCenterY() * 1 - (this.getArmLength() - this.m_doughnutWidth) * Math.sin(theta);
		}
	}
};
/** @description will calculate X & Y coordinates arrays for Category Label **/
CircumplexChartCalculation.prototype.setArmsEndCoordinatesForCategoryLabel = function() {
	this.m_armXCordinatesForLabel = [];
	this.m_armYCordinatesForLabel = [];
	var margin = 2;
	var radius = this.getArmLength() * 1 + (this.m_chart.fontScaling(this.m_chart.m_xAxis.m_labelfontsize * 1) / 2) + margin * 1;
	for (var i = 1; i <= this.m_numberOfArms; i++) {
		//clockwise and centre of the arm arc
		var theta;
		if (IsBoolean(this.m_chart.m_clockwisedirection)) {
			theta = (Math.PI / 2) * 1 - this.m_angleBetweenArms * (i - 1) - this.m_angleBetweenArms / 2;
		} else {
			theta = this.m_angleBetweenArms * (i - 1) + (Math.PI / 2) * 1 + this.m_angleBetweenArms / 2;
		}
		this.m_armXCordinatesForLabel[i - 1] = this.getCenterX() * 1 + radius * Math.cos(theta);
		this.m_armYCordinatesForLabel[i - 1] = this.getCenterY() * 1 - radius * Math.sin(theta);
	}
};
/** @description will find the maximum value  from all the series values. **/
CircumplexChartCalculation.prototype.setMaxValue = function() {
	this.m_max = 0;
	this.m_min = 0;
	for (var j = 0; j < this.m_seriesData.length; j++) {
		var seriesMaxMin = this.getMaxMinFromArr(this.m_seriesData[j]);
		if (this.m_max * 1 < seriesMaxMin.max * 1) {
			this.m_max = seriesMaxMin.max * 1;
		}
		if (this.m_min * 1 < seriesMaxMin.min * 1) {
			this.m_min = seriesMaxMin.min * 1;
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

/** @description calculates the Min/Max value and get required ScaleInfo of The Axis **/
CircumplexChartCalculation.prototype.calculateMinimumMaximum=function(){
	var minMax = this.m_chart.calculateMinMaxValue(this.m_seriesData);
	var calculatedMin = minMax.min;
	var calculatedMax = minMax.max;
	/** Chart height can be 400 but if doughnut is 20 only, we should not show more than 4 markers **/
	var niceScaleObj = this.m_chart.getCalculateNiceScale(calculatedMin,calculatedMax,this.m_chart.m_basezero,this.m_chart.m_autoaxissetup,this.m_chart.m_minimumaxisvalue,this.m_chart.m_maximumaxisvalue,(this.m_doughnutWidth*2));
	this.m_min = niceScaleObj.min;
	this.m_max = niceScaleObj.max;
	this. m_markerTextArray = [];
	this.m_markerTextArray = niceScaleObj.markerArray;
	this.m_numberOfMarkers = niceScaleObj.markerArray.length;
	/*
	this.yAxisText=niceScaleObj.step;
	this.m_yAxisMarkersArray=niceScaleObj.markerArray;
	*/
};
/** @description will find and return the minimum & maximum from the array
 * @param {Number} array
 * @returns {Number} max and min value in array
 **/
CircumplexChartCalculation.prototype.getMaxMinFromArr = function(array) {
	var max = 0;
	var min = 0;
	for (var i = 0; i < array.length; i++) {
		if(i == 0){
			max = array[i];
			min = array[i];
		}else{
			if (max * 1 <= array[i] * 1) {
				max = array[i];
			}
			if (min * 1 >= array[i] * 1) {
				min = array[i];
			}
		}
	}
	return {"max": max, "min":min};
};
/** Getter method for returning maxvalue**/
CircumplexChartCalculation.prototype.getMaxValue = function() {
	return this.m_max - this.m_min;
};
/** @description will set the axis according to min and max value. 
* @param {Number} value
* @returns {Number} data ,after checking axis setup properties 
**/
CircumplexChartCalculation.prototype.getAxisSetupDataValue = function( value ) {
	var data = value;
	if(value > this.m_max){
		data = 0;
	}else if(value < this.m_min){
		data = 0;
	}else{
		data = value - this.m_min;
	}
	return data;
};
/** @description finding the marker array values for displaying in categorymarking drawing.**/
CircumplexChartCalculation.prototype.setArmMarkers = function() {
	this.m_markerTextArray = [];
	for (var i = 0; i < this.m_numberOfMarkers; i++) {
		var marker = (this.getMaxValue() / (this.m_numberOfMarkers)) * (i + 1);
		if (marker % 1 !== 0) {
			marker = marker.toFixed(1);
		}
		this.m_markerTextArray[i] = marker;
	}
};
/** @description finding Marker Coordinate arrays for polygonweb/circleweb,if showdoughnut is set to false.**/
CircumplexChartCalculation.prototype.setArmMarkersCoordinates = function() {
	this.m_armMarkerXCordinates = [];
	this.m_armMarkerYCordinates = [];
	for (var j = 0; j < this.m_numberOfArms; j++) {
		this.m_armMarkerXCordinates[j] = [];
		this.m_armMarkerYCordinates[j] = [];
		for (var i = 0; i < this.m_markerTextArray.length; i++) {
			var armLength = (this.getArmLength() / (this.m_markerTextArray.length*1 - 1)) * i;
			var theta;
			if (IsBoolean(this.m_chart.m_clockwisedirection)) {
				theta = (Math.PI / 2) * 1 - this.m_angleBetweenArms * (j);
			} else {
				theta = this.m_angleBetweenArms * (j) + (Math.PI / 2) * 1;
			}
			this.m_armMarkerXCordinates[j][i] = this.getCenterX() * 1 + armLength * Math.cos(theta);
			this.m_armMarkerYCordinates[j][i] = this.getCenterY() * 1 - armLength * Math.sin(theta);
		}
	}
};
/** @description finding Marker Coordinates for polygonweb/circleweb,if showdoughnut is set to true.**/
CircumplexChartCalculation.prototype.setArmMarkersCoordinates1 = function() {
	this.m_armMarkerXCordinates1 = [];
	this.m_armMarkerYCordinates1 = [];
	for (var j = 0; j < this.m_numberOfArms; j++) {
		this.m_armMarkerXCordinates1[j] = [];
		this.m_armMarkerYCordinates1[j] = [];
		for (var i = 0; i < this.m_markerTextArray.length; i++) {
			var armLength = (this.m_doughnutWidth / (this.m_markerTextArray.length*1 - 1)) * i;
			var theta;
			if (IsBoolean(this.m_chart.m_clockwisedirection)) {
				theta = (Math.PI / 2) * 1 - this.m_angleBetweenArms * (j);
			} else {
				theta = this.m_angleBetweenArms * (j) + (Math.PI / 2) * 1;
			}
			this.m_armMarkerXCordinates1[j][i] = this.getCenterX() * 1 + (armLength + (this.m_armLength - this.m_doughnutWidth)) * Math.cos(theta);
			this.m_armMarkerYCordinates1[j][i] = this.getCenterY() * 1 - (armLength + (this.m_armLength - this.m_doughnutWidth)) * Math.sin(theta);
		}
	}
};
/** @description: to calculate proper arm length array when polygon overlaid is used 
* @param {Number} index
**/
CircumplexChartCalculation.prototype.getPolygonSeriesArmLength = function( index ) {
	//http://math.stackexchange.com/questions/497327/find-point-on-line-that-has-integer-coordinates
	var x1 = this.m_armMarkerXCordinates1[0][0];
	var y1 = this.m_armMarkerYCordinates1[0][0];
	var x2 = this.m_armMarkerXCordinates1[1][0];
	var y2 = this.m_armMarkerYCordinates1[1][0];
	var m = (y2 - y1) / (x2 - x1);
	var yDiff = y2 - y1 ;
	var armLengthArr = [];
	for (var i = 0; i < this.m_seriesData.length; i++) {
		var y = y2 - i * (yDiff / this.m_chart.m_overlaidspacing);
		var x = x1 + (y - y1)/m;		
		armLengthArr[i] = Math.sqrt( Math.pow((this.getCenterY() - y), 2) + Math.pow((this.getCenterX() - x), 2) );
	}
	console.log(armLengthArr);
};
/** @description finding Start Coordinates of series for cricle/polygon. **/
CircumplexChartCalculation.prototype.setSeriesStartCoordinates = function() {
	this.m_seriesSXCordinates = [];
	this.m_seriesSYCordinates = [];
	var ratio = this.getArmLength() / this.getMaxValue();
	for (var i = 0; i < this.m_seriesData.length; i++) {
		this.m_seriesSXCordinates[i] = [];
		this.m_seriesSYCordinates[i] = [];
		for (var j = 0; j < this.m_seriesData[i].length; j++) {
			var armLength = ratio * this.getAxisSetupDataValue(this.m_seriesData[i][j]);
			var theta;
			if (this.m_chart.m_charttype == "clustered") {
				theta = (IsBoolean(this.m_chart.m_clockwisedirection)) ?
					(Math.PI / 2) * 1 - this.m_angleBetweenArms * (j) - (this.m_angleBetweenArms / this.m_seriesData.length) * i :
					this.m_angleBetweenArms * (j) + (Math.PI / 2) * 1 + (this.m_angleBetweenArms / this.m_seriesData.length) * i;
			} else {
				theta = (IsBoolean(this.m_chart.m_clockwisedirection)) ?
					(Math.PI / 2) * 1 - this.m_angleBetweenArms * (j) - (this.m_angleBetweenArms / this.m_chart.m_overlaidspacing) * i :
					this.m_angleBetweenArms * (j) + (Math.PI / 2) * 1 + (this.m_angleBetweenArms / this.m_chart.m_overlaidspacing) * i;
			}
			this.m_seriesSXCordinates[i][j] = this.getCenterX() * 1 + armLength * Math.cos(theta);
			this.m_seriesSYCordinates[i][j] = this.getCenterY() * 1 - armLength * Math.sin(theta);
		}
	}
};
/** @description finding End Coordinates for series for cricle/polygon.**/
CircumplexChartCalculation.prototype.setSeriesEndCoordinates = function() {
	this.m_seriesEXCordinates = [];
	this.m_seriesEYCordinates = [];
	var ratio = this.getArmLength() / this.getMaxValue();
	for (var i = 0; i < this.m_seriesData.length; i++) {
		this.m_seriesEXCordinates[i] = [];
		this.m_seriesEYCordinates[i] = [];
		for (var j = 0; j < this.m_seriesData[i].length; j++) {
			var armLength = ratio * this.getAxisSetupDataValue(this.m_seriesData[i][j]);
			var theta;
			if (this.m_chart.m_charttype == "clustered") {
				theta = (IsBoolean(this.m_chart.m_clockwisedirection)) ?
					(Math.PI / 2) * 1 - (this.m_angleBetweenArms * (j + 1)) + (this.m_angleBetweenArms * (this.m_seriesData.length - 1 - i) / this.m_seriesData.length) :
					(Math.PI / 2) * 1 + this.m_angleBetweenArms * (j + 1) - (this.m_angleBetweenArms * (this.m_seriesData.length - i - 1) / this.m_seriesData.length);
			} else {
				theta = (IsBoolean(this.m_chart.m_clockwisedirection)) ?
					(Math.PI / 2) * 1 - (this.m_angleBetweenArms * (j + 1)) + (this.m_angleBetweenArms / this.m_chart.m_overlaidspacing) * i :
					this.m_angleBetweenArms * (j + 1) + (Math.PI / 2) * 1 - (this.m_angleBetweenArms / this.m_chart.m_overlaidspacing) * i;
			}
			this.m_seriesEXCordinates[i][j] = this.getCenterX() * 1 + armLength * Math.cos(theta);
			this.m_seriesEYCordinates[i][j] = this.getCenterY() * 1 - armLength * Math.sin(theta);
		}
	}
};
/** @description finding Start Coordinates of series for cricle/polygon,if showdoughnut is set to true.**/
CircumplexChartCalculation.prototype.setSeriesStartDCoordinates = function() {
	this.m_seriesSDXCordinates = [];
	this.m_seriesSDYCordinates = [];
	var ratio = this.m_doughnutWidth / this.getMaxValue();
	for (var i = 0; i < this.m_seriesData.length; i++){
		this.m_seriesSDXCordinates[i] = [];
		this.m_seriesSDYCordinates[i] = [];
		for (var j = 0; j < this.m_seriesData[i].length; j++) {
			var armLength = ( ratio * this.getAxisSetupDataValue(this.m_seriesData[i][j]) ) + (this.m_armLength - this.m_doughnutWidth);
			var theta;
			if (this.m_chart.m_charttype == "clustered") {
				theta = (IsBoolean(this.m_chart.m_clockwisedirection)) ?
					(Math.PI / 2) * 1 - this.m_angleBetweenArms * (j) - (this.m_angleBetweenArms / this.m_seriesData.length) * i :
					this.m_angleBetweenArms * (j) + (Math.PI / 2) * 1 + (this.m_angleBetweenArms / this.m_seriesData.length) * i;
			} else {
				theta = (IsBoolean(this.m_chart.m_clockwisedirection)) ?
					(Math.PI / 2) * 1 - this.m_angleBetweenArms * (j) - (this.m_angleBetweenArms / (2*this.m_chart.m_overlaidspacing)) * i :
					this.m_angleBetweenArms * (j) + (Math.PI / 2) * 1 + (this.m_angleBetweenArms / (2*this.m_chart.m_overlaidspacing)) * i;
			}
			this.m_seriesSDXCordinates[i][j] = this.getCenterX() * 1 + armLength * Math.cos(theta);
			this.m_seriesSDYCordinates[i][j] = this.getCenterY() * 1 - armLength * Math.sin(theta);

		}
		
	}
};
/** @description finding End Coordinates of series for cricle/polygon, if showdoughnut is set to true. **/
CircumplexChartCalculation.prototype.setSeriesEndDCoordinates = function() {
	this.m_seriesEDXCordinates = [];
	this.m_seriesEDYCordinates = [];
	var ratio = this.m_doughnutWidth / this.getMaxValue();
	for (var i = 0; i < this.m_seriesData.length; i++) {
		this.m_seriesEDXCordinates[i] = [];
		this.m_seriesEDYCordinates[i] = [];
		for (var j = 0; j < this.m_seriesData[i].length; j++) {
			var armLength = ( ratio * this.getAxisSetupDataValue(this.m_seriesData[i][j]) ) + (this.m_armLength - this.m_doughnutWidth);
			var theta;
			if (this.m_chart.m_charttype == "clustered") {
				theta = (IsBoolean(this.m_chart.m_clockwisedirection)) ?
					(Math.PI / 2) * 1 - (this.m_angleBetweenArms * (j + 1)) + (this.m_angleBetweenArms * (this.m_seriesData.length - 1 - i) / this.m_seriesData.length) :
					(Math.PI / 2) * 1 + this.m_angleBetweenArms * (j + 1) - (this.m_angleBetweenArms * (this.m_seriesData.length - i - 1) / this.m_seriesData.length);
			} else {
				theta = (IsBoolean(this.m_chart.m_clockwisedirection)) ?
					(Math.PI / 2) * 1 - (this.m_angleBetweenArms * (j + 1)) + (this.m_angleBetweenArms / (2*this.m_chart.m_overlaidspacing)) * i :
					this.m_angleBetweenArms * (j + 1) + (Math.PI / 2) * 1 - (this.m_angleBetweenArms / (2*this.m_chart.m_overlaidspacing)) * i;
			}
			this.m_seriesEDXCordinates[i][j] = this.getCenterX() * 1 + armLength * Math.cos(theta);
			this.m_seriesEDYCordinates[i][j] = this.getCenterY() * 1 - armLength * Math.sin(theta);
		}
	}
};

/** @description Getter For Y Axis Text**/
CircumplexChartCalculation.prototype.getYAxisText = function() {
	return this.m_categoryData;
};
/** @description Getter For Y Axis Marker Array**/
CircumplexChartCalculation.prototype.getYAxisMarkersArray = function() {
	return this.yAxisData;
};
//# sourceURL=CircumplexChart.js