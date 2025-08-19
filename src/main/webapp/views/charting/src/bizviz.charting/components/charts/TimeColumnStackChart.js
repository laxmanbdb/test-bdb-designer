/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: TimeColumnStackChart.js
 * @description TimeColumnStackChart
 **/
function TimeColumnStackChart(m_chartContainer, m_zIndex) {
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
	this.m_alertData = [];

	this.m_showslider = true;
	this.m_showslidermarker = true;
	this.m_sliderhandlerbgcolor = "#ccffff";
	this.m_sliderselectbgcolor = "#cccccc";
	this.m_slidercontainerbgcolor = "#ccffff";
	this.m_slidercontainerbordercolor = "#bbbbbb";
	//this.m_charttype="";
	this.m_sliderbordercolor = "#cccccc";
	this.m_sliderbghandle = "#ffffff";
	this.m_slideropacityhandle = "0.0";
	this.m_sliderbgselection = "#cccccc";
	this.m_slideropacityselection = "0.5";
	this.m_sliderbgcontainer = "#ecf0f1";
	this.m_slideropacitycontainer = "0.0";
	this.m_sliderbgscrollbar = "#b0b0b0";
	this.m_slideropacityscrollbar = "0.7";

	this.m_sourcedateformat = "mm/dd/yyyy";
	this.m_yPositionArray = [];
	//this.m_calculation=new SVGLineCalculation();
	this.m_xAxis = new svgXAxisColumn();
	this.m_yAxis = new svgYAxisColumn();
	this.m_title = new svgTitleColumn(this);
	this.m_subTitle = new svgSubTitleColumn();
	//this.m_timeLineAlert=new TimelineAlert();
	this.m_util = new Util();
	this.noOfRows = 1; //used for set x-axis text into two rows in non tilted case.
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;

	// for time series project
	//this.m_lineCalculation=[];
	this.m_calculation = new ColumnCalculationLatest();
	this.m_yaxisArr = [];
	this.m_marginXArray = [];
	this.count = 0;
	this.timeLineSliderFlag = false;
	this.svgContainerId = "";
	this.sliderMargin = 70;
	this.rangedSelectorMargin = 27;

	this.m_rangeselectoropacity = "1.0";
	this.m_rangeselectorbgcolor = "#cccddd";
	this.m_showrangeselector = "true";

	this.m_showmarkingorpercentvalue = false;
	this.m_percentageArray = [];
	this.m_columnsArray = [];
};

TimeColumnStackChart.prototype = new Chart();

TimeColumnStackChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas(); //create draggable div
};

TimeColumnStackChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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
				case "CategoryColors":
					var categoryColorsObject = new CategoryColors();
					this.setCategoryColors(categoryColorsObject);
					for (var CategoryColorsKey in jsonObject[key][chartKey]) {
						switch (CategoryColorsKey) {
						case "CategoryColor":
							var CategoryColorArray = this.getArrayOfSingleLengthJson(jsonObject[key][chartKey][CategoryColorsKey]);
							categoryColorsObject.cateogryNameColorMap = new Object();
							for (var i = 0; i < CategoryColorArray.length; i++) {
								var categoryColorObject = new CategoryColor();
								categoryColorsObject.setCategoryColor(categoryColorObject);
								for (var CategoryColorKey in CategoryColorArray[i]) {
									var propertyName = this.getNodeAttributeName(CategoryColorKey);
									categoryColorObject[propertyName] = CategoryColorArray[i][CategoryColorKey];
								}
								categoryColorsObject.cateogryNameColorMap[categoryColorObject.getCategoryName()] = categoryColorObject.getColor();
							}
							break;
						default:
							var propertyName = this.getNodeAttributeName(CategoryColorsKey);
							nodeObject.m_categoryColors[propertyName] = jsonObject[key][chartKey][CategoryColorsKey];
							break;
						}
					}
					categoryColorsObject.setCategoryDefaultColorSet();
					break;
				case "ConditionalColors":
					if (jsonObject[key][chartKey] != "") {
						var conditionalColorsObject = new ConditionalColors();
						this.setConditionalColors(conditionalColorsObject);
						var ConditionalColorArray = this.getArrayOfSingleLengthJson(jsonObject[key][chartKey]["ConditionalColor"]);
						for (var i = 0; i < ConditionalColorArray.length; i++) {
							var conditionalColorObject = new ConditionalColor();
							conditionalColorsObject.setConditionalColor(conditionalColorObject);
							for (var conditionalColorKey in ConditionalColorArray[i]) {
								var propertyName = this.getNodeAttributeName(conditionalColorKey);
								conditionalColorObject[propertyName] = ConditionalColorArray[i][conditionalColorKey];
							}
						}
					}
					break;
				case "TimelineAlert":
					for (var alertKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(alertKey);
						nodeObject.m_timeLineAlert[propertyName] = jsonObject[key][chartKey][alertKey];
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

TimeColumnStackChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

TimeColumnStackChart.prototype.setFields = function (fieldsJson) {
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
TimeColumnStackChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	// only one category can be set for line chart, preference to first one
	for (var i = 0; i < 1; i++) {
		this.m_categoryNames[i] = this.getProperAttributeNameValue(categoryJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(categoryJson[i], "DisplayName"));
		this.m_categoryDisplayNames[i] = m_formattedDisplayName;
	}
};
TimeColumnStackChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = [];
	this.m_legendNames = [];
	this.m_seriesVisibleArr = [];
	this.m_plotRadiusArray = [];
	this.m_plotTrasparencyArray = [];
	this.m_plotShapeArray = [];
	this.m_allSeriesDisplayNames = [];
	this.m_allSeriesNames = [];
	var count = 0;
	for (var i = 0; i < seriesJson.length; i++) {
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.m_allSeriesDisplayNames[i] = m_formattedDisplayName;
		this.m_allSeriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		this.m_seriesVisibleArr[this.m_allSeriesDisplayNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
		if (IsBoolean(this.m_seriesVisibleArr[this.m_allSeriesDisplayNames[i]])) {
			this.m_seriesDisplayNames[count] = m_formattedDisplayName;
			this.m_legendNames[count] = m_formattedDisplayName;
			this.m_seriesNames[count] = this.getProperAttributeNameValue(seriesJson[i], "Name");
			this.m_seriesColors[count] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));
			var radius = this.getProperAttributeNameValue(seriesJson[i], "PlotRadius");
			this.m_plotRadiusArray[count] = (radius != undefined && radius !== null && radius !== "") ? radius : 3;
			var transparency = this.getProperAttributeNameValue(seriesJson[i], "PlotTransparency");
			this.m_plotTrasparencyArray[count] = (transparency != undefined && transparency !== null && transparency !== "") ? transparency : 1;
			var shape = this.getProperAttributeNameValue(seriesJson[i], "PlotType");
			this.m_plotShapeArray[count] = (shape != undefined && shape !== null && shape !== "") ? shape : 'point';
			count++;
		}
	}

};
TimeColumnStackChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};
TimeColumnStackChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};
TimeColumnStackChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};
TimeColumnStackChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};
TimeColumnStackChart.prototype.getSeriesColors = function () {
	return this.m_seriesColors;
};
TimeColumnStackChart.prototype.setSeriesColor = function (m_seriesColor) {
	this.m_seriesColor = m_seriesColor;
};
TimeColumnStackChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};
TimeColumnStackChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};
TimeColumnStackChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
	if (this.m_charttype == "timeseries")
		this.m_categoryData = this.setDateFormatForCategory(this.m_categoryData);
	this.CatData = this.m_categoryData;
};

TimeColumnStackChart.prototype.setDateFormatForCategory = function (categoryData) {
	var tempData = [];
	for (var i = 0; i < categoryData[0].length; i++) {
		tempData.push(this.getFormattedDate(categoryData[0][i]));
	}
	categoryData[0] = tempData;
	return categoryData;
};

TimeColumnStackChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0; i < this.getSeriesNames().length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
	this.SerData = this.m_seriesData;
};
TimeColumnStackChart.prototype.setAlertData = function () {
	this.m_alertData = [];
	this.m_alertData[0] = this.getDataFromJSON(this.m_timeLineAlert.m_fieldname);
	this.alertData = this.m_alertData;
};

TimeColumnStackChart.prototype.getDataFromJSON = function (fieldName) {
	var data = [];
	if (IsBoolean(!this.timeLineSliderFlag)) {
		for (var i = 0; i < this.getDataProvider().length; i++) {
			if (this.getDataProvider()[i][fieldName] == undefined)
				data[i] = "";
			else
				data[i] = this.getDataProvider()[i][fieldName];
		}
	} else {
		for (var i = this.firstIndex, k = 0; i <= this.lastIndex; i++) {
			if (this.getDataProvider()[i][fieldName] == undefined)
				data[k] = "";
			else
				data[k] = this.getDataProvider()[i][fieldName];
			k++;
		}
	}
	return data;
};
TimeColumnStackChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};
TimeColumnStackChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

TimeColumnStackChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getCategoryNames()[i]);
	}
	for (var j = 0; j < this.getSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getSeriesNames()[j]);
	}
};
TimeColumnStackChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};
TimeColumnStackChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};
TimeColumnStackChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

TimeColumnStackChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};
TimeColumnStackChart.prototype.createSVG = function () {
	var temp = this;
	this.svgContainerId = 'svgContainer' + temp.m_objectid;
	$('#' + temp.svgContainerId).remove();
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
	svg.setAttribute('width', this.m_width);
	svg.setAttribute('height', this.m_height - ((IsBoolean(this.m_showslider)) ? this.sliderMargin : 0));
	//svg.setAttribute('style','background-color:'+ hex2rgb(convertColorToHex(this.getBgGradients().split(',')[0]),this.m_bgalpha)+';');
	svg.setAttribute('id', this.svgContainerId);
	svg.setAttribute('class', 'svg_chart_container');

	$("#draggableDiv" + temp.m_objectid).append(svg);

	$("#legendIcon" + temp.m_objectid).css("z-index", "1");
	$("#legendContent" + temp.m_objectid).css("z-index", "1");
	/*******************************this.m_chart.getBgGradients(),this.m_chart.m_bgalpha, this.m_chart.m_bggradientrotation*/
	if (IsBoolean(this.m_showslider)) {
		if (IsBoolean(!this.timeLineSliderFlag)) {
			$('#svgTimeScaleDiv' + temp.m_objectid).remove();
			var div = document.createElement('div');
			div.setAttribute('id', 'svgTimeScaleDiv' + temp.m_objectid);
			div.style.position = 'absolute';
			div.style.top = this.m_height - this.sliderMargin + "px";
			$("#draggableDiv" + temp.m_objectid).append(div);
			$('#svgTimeScaleDiv' + temp.m_objectid).css("top", this.m_height - this.sliderMargin + "px");
			/*******************************/
			this.svgTimeScaleId = 'svgTimeScale' + temp.m_objectid;
			$('#' + temp.svgTimeScaleId).remove();
			var svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg1.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
			svg1.setAttribute('width', this.m_width);
			svg1.setAttribute('height', this.sliderMargin);
			//svg1.setAttribute('top',this.m_y+(this.m_height-50));
			//svg1.setAttribute('style','background-color:'+hex2rgb(convertColorToHex(this.getBgGradients().split(',')[0]),this.m_bgalpha)+';');
			svg1.setAttribute('id', this.svgTimeScaleId);
			svg1.setAttribute('class', 'svg_chart_container');
			$('#svgTimeScaleDiv' + temp.m_objectid).append(svg1);
		}
	} else
		$('#svgTimeScaleDiv' + temp.m_objectid).remove();
};
TimeColumnStackChart.prototype.initMouseClickEvent = function () {
	var temp = this;
	var canvas = $("#" + temp.svgContainerId);
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
TimeColumnStackChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.createSVG();
	$("#draggableCanvas" + this.m_objectid).hide();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/****************************For manage series /axes  separately for manage time based graph ************************************/
TimeColumnStackChart.prototype.calculateSeriesMap = function (seriesData) {
	this.seriesMap = [];
	this.seriesMap[0] = seriesData;
};
TimeColumnStackChart.prototype.initializeCalculationClass = function () {
	this.m_lineCalculation = [];
	this.m_lineCalculation[0] = new SVGColumnCalculation();
	this.m_lineCalculation[0].init(this, this.m_categoryData[0], this.seriesMap[0], this.seriesMap, 0, this.m_categoryData);

};
TimeColumnStackChart.prototype.initializeYAxis = function () {
	this.m_yAxis.init(this, this.m_lineCalculation[0]);
	this.m_xAxis.init(this, this.m_lineCalculation[0]);

};

TimeColumnStackChart.prototype.calculateStartXMarginForYAxes = function () {
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
TimeColumnStackChart.prototype.draw = function () {
	this.timeLineSliderFlag = false;
	this.init();
	this.drawChart();
	if (this.plugin != undefined && this.plugin != null) {
		this.plugin.initPlugin(this);
	}

	this.scaleFlag = true;
	var oldObject = this;
	var newObject = $.extend(true, {}, oldObject);
	this.init1(newObject);
	this.drawChart1(newObject, this.svgTimeScaleId);
	this.scaleFlag = false;
};
TimeColumnStackChart.prototype.init1 = function (temp) {
	temp.m_y = 0;
	this.tempTitle = temp.m_title.m_showtitle;
	this.tempSubTitle = temp.m_subTitle.m_showsubtitle;

	temp.m_height = this.sliderMargin;
	temp.m_linewidth = 1;
	temp.m_title.m_showtitle = false;
	temp.m_subTitle.m_showsubtitle = false;
	temp.m_showmaximizebutton = false;
	temp.m_showgradient = false;
	temp.m_showrangeselector = false;
	temp.setCategoryData();
	temp.setSeriesData();

	temp.setAllFieldsName();
	temp.setAllFieldsDisplayName();
	//temp.setColorsForSeries();
	temp.calculateSeriesMap(this.m_seriesData);
	temp.initializeCalculationClass();
	if (!IsBoolean(temp.m_isEmptySeries))
		temp.initializeCalculation();
};
TimeColumnStackChart.prototype.getFullYear = function (yy) {
	return ((yy * 1) > 50) ? '19' + yy : '20' + yy;
};

TimeColumnStackChart.prototype.drawChart1 = function (temp) {
	if (!IsBoolean(this.m_isEmptySeries)) {
		if ((new Date(this.CatData[0][0]) == "Invalid Date") && this.m_charttype == "timeseries") {}
		else
			temp.drawSVGCoulmns();
		//temp.drawSVGLines();
	} else {
		//this.drawMessage(this.m_status.noData);
	}
	this.m_title.m_showtitle = this.tempTitle;
	this.m_subTitle.m_showsubtitle = this.tempSubTitle;

};
TimeColumnStackChart.prototype.init = function () {
	this.createSVG();
	if (IsBoolean(!this.timeLineSliderFlag)) {
		this.setCategoryData();
		this.setSeriesData();
		this.firstIndex = 0;
		this.lastIndex = this.m_categoryData[0].length - 1;
	}
	this.setAllFieldsName();
	this.setAllFieldsDisplayName();

	//this.setColorsForSeries();
	this.calculateSeriesMap(this.m_seriesData);
	this.initializeCalculationClass();

	this.isSeriesDataEmpty();
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);

	if (!IsBoolean(this.m_isEmptySeries)) {
		this.initializeCalculation();
		this.initializeYAxis();
		this.calculateStartXMarginForYAxes();
		//this.initializeLineSeries();
		//this.initializePointSeries();
	}
};

TimeColumnStackChart.prototype.getCounterFlagForSeriesVisiblity = function () {
	var count = 0;
	for (var i = 0; i < this.m_seriesData.length; i++) {
		if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesDisplayNames[i]])) {
			count++;
			this.m_seriesVisiblityPosition = i;
		}

	}
	if (count == 1)
		return true;
	else
		return false;
};

TimeColumnStackChart.prototype.initializeCalculation = function () {
	var categoryData = this.updateCategoryData(this.m_categoryData);
	this.m_calculation.init(this, categoryData, this.m_seriesData);
	this.m_xPixelArray = this.m_calculation.getxPixelArray();
	this.m_yPixelArray = this.m_calculation.getyPixelArray();
	this.m_stackWidth = this.m_calculation.getBarWidth();
	this.m_stackHeightArray = this.m_calculation.getstackHeightArray();
	//console.log(this.m_seriesData.length)

	if ((IsBoolean(this.getCounterFlagForSeriesVisiblity())) && IsBoolean(this.m_showmarkingorpercentvalue)) {
		this.m_percentageArray = IsBoolean(this.m_showpercentvalue) ? (IsBoolean(this.getCheckedAllPosContainigZero()) ? (this.getPercentage()) : (this.getRoundValue(this.getPercentage(), 100))) : (this.getPercentage());
		this.m_showPerCentageFlag = true;
	}
	this.setColorsForSeries();
	this.initializeColumns();
};

TimeColumnStackChart.prototype.updateCategoryData = function (array) {
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

TimeColumnStackChart.prototype.initializeColumns = function () {
	/*for(var i=0;i<this.m_yPixelArray.length;i++){
	this.m_columnsArray[i]=new SVGColumns();
	this.m_columnsArray[i].init(this.m_xPixelArray[i],this.m_yPixelArray[i],this.m_stackWidth,this.m_stackHeightArray[i],this.m_percentageArray,this.getColorsForSeries()[i],this.m_strokecolor,this.m_showgradient,this.m_showPerCentageFlag,this.m_showpercentvalue,this.m_plotTrasparencyArray[i],this);
	}*/

	this.m_yPositionArray = this.m_lineCalculation[0].getYPosition();
	for (var k = 0, i = 0; i < this.m_seriesDisplayNames.length; i++) {
		if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesDisplayNames[i]])) {
			this.m_columnsArray[i] = new SVGColumns();
			this.m_columnsArray[i].init(this.m_lineCalculation[0].getXPosition(), this.m_yPixelArray[i], this.m_stackWidth, this.m_stackHeightArray[i], this.m_percentageArray, this.getColorsForSeries()[i], this.m_strokecolor, this.m_showgradient, this.m_showPerCentageFlag, this.m_showpercentvalue, this.m_plotTrasparencyArray[i], this);
			k++;
		}
	}
};

TimeColumnStackChart.prototype.updateSeriesData = function (min, max) {
	var cat = [];
	var ser = [];
	var alert = [];
	cat[0] = [];
	alert[0] = [];
	for (var i = 0; i < this.SerData.length; i++) {
		ser[i] = [];
		for (var j = min; j <= max; j++) {
			if (i == 0) {
				cat[i].push(this.CatData[i][j]);
				//if(IsBoolean(this.m_timeLineAlert.m_showalert))
				//	alert[i].push(this.alertData[i][j]);
			}
			ser[i].push(this.SerData[i][j]);
		}
	}
	this.firstIndex = min;
	this.lastIndex = max;
	this.m_categoryData = cat;
	this.m_seriesData = ser;
	//this.m_alertData=alert;
};
TimeColumnStackChart.prototype.drawChartFrame = function () {
	var temp = this;
	if (IsBoolean(this.m_showborder)) {
		$("#draggableDiv" + temp.m_objectid).css('border', '1px solid #BDC3C7');
	}
	$('#' + temp.svgContainerId).empty();
	$('#' + temp.svgContainerId).css('background-color', hex2rgb(convertColorToHex(this.getBgGradients().split(',')[0]), this.m_bgalpha));
	$('#' + temp.svgTimeScaleId).css('background-color', hex2rgb(convertColorToHex(this.getBgGradients().split(',')[0]), this.m_bgalpha));
};

TimeColumnStackChart.prototype.drawChart = function () {
	this.drawChartFrame();

	this.drawTitle();
	this.drawSubTitle();
	if ((new Date(this.CatData[0][0]) == "Invalid Date") && this.m_charttype == "timeseries") {
		this.drawMessage("Data is not valid to show in date time scale");
	} else {
		if (!IsBoolean(this.m_isEmptySeries)) {
			this.drawXAxis();
			this.drawYAxis();
			this.drawSVGCoulmns();
			/*this.drawSVGLines();
			this.drawSVGPoints();
			if(IsBoolean(this.m_timeLineAlert.m_showalert) && IsBoolean(!this.m_designMode))
			this.m_timeLineAlert.draw();*/
		} else {
			this.drawMessage(this.m_status.noData);
		}
		if (IsBoolean(!this.timeLineSliderFlag)) {
			this.drawLegends();
			this.drawslider();
			this.drawRangeSelector();
		}
		if (!this.m_designMode)
			this.timeLineSliderFlag = true;
	}
};
TimeColumnStackChart.prototype.drawMessage = function (text) {
	var x = this.m_x * 1 + this.m_width / 2;
	var y = this.m_y * 1 + this.m_height / 2;
	var text = drawSVGText(x, y, text, this.m_statuscolor, "center", "middle", 0);
	text.setAttribute("style", "font-family:"+this.m_statuscolor+";font-style:none;font-size:"+this.m_statussize+"px;font-weight:normal;text-decoration:none;");
	$('#' + this.svgContainerId).append(text);
};

/***************  RangeSelector drawing in Chart.js ********************/
/***************  Slider drawing in Chart.js ********************/

TimeColumnStackChart.prototype.getColorsForSeries = function () {
	return this.m_seriesColorsArray;
};
TimeColumnStackChart.prototype.setColorsForSeries = function () {
	this.m_seriesColorsArray = [];
	this.m_PointsColorsArray = [];
	if (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) {
		for (var i = 0; i < this.m_seriesData.length; i++) {
			this.m_seriesColorsArray[i] = [];
			this.m_PointsColorsArray[i] = [];
			for (var j = 0; j < this.m_seriesData[i].length; j++) {
				this.m_seriesColorsArray[i][j] = this.m_drillColor;
				this.m_PointsColorsArray[i][j] = this.m_drillColor;
			}
		}
	} else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && this.getCategoryColors().getCategoryColor().length > 0 && IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName())) {
		var categoryColors = this.getCategoryColors().getCategoryColorsForCategoryNames(this.getCategoryData()[0], this.m_categoryFieldColor);
		var seriesColors = this.getSeriesColors();
		for (var i = 0; i < this.m_seriesData.length; i++) {
			this.m_seriesColorsArray[i] = [];
			this.m_PointsColorsArray[i] = [];
			for (var j = 0; j < this.m_seriesData[i].length; j++) {
				this.m_seriesColorsArray[i][j] = seriesColors[i];
				this.m_PointsColorsArray[i][j] = categoryColors[j];
			}
		}
	} else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && (!IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName()) || this.getCategoryColors().getCategoryColor().length == 0) && this.getConditionalColors() != "" && this.getConditionalColors() != undefined && this.getConditionalColors().getConditionalColor().length > 0) {
		var conditionalColors = this.getConditionalColors().getConditionalColorsForConditions(this.getSeriesNames(), this.getSeriesColors(), this.m_seriesData, this);
		var seriesColors = this.getSeriesColors();
		for (var i = 0; i < this.m_seriesData.length; i++) {
			this.m_seriesColorsArray[i] = [];
			this.m_PointsColorsArray[i] = [];
			for (var j = 0; j < this.m_seriesData[i].length; j++) {
				this.m_seriesColorsArray[i][j] = seriesColors[i];
				this.m_PointsColorsArray[i][j] = conditionalColors[i][j];
			}
		}
	} else {
		var seriesColors = this.getSeriesColors();
		for (var i = 0; i < this.m_seriesData.length; i++) {
			this.m_seriesColorsArray[i] = [];
			this.m_PointsColorsArray[i] = [];
			for (var j = 0; j < this.m_seriesData[i].length; j++) {
				this.m_seriesColorsArray[i][j] = seriesColors[i];
				this.m_PointsColorsArray[i][j] = seriesColors[i];
			}
		}
	}
};
TimeColumnStackChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

TimeColumnStackChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};
TimeColumnStackChart.prototype.drawXAxis = function () {
	this.m_xAxis.drawVerticalLine();
	this.m_xAxis.markXaxis();
	this.m_xAxis.drawXAxis();
};

TimeColumnStackChart.prototype.drawYAxis = function () {
	if (IsBoolean(this.m_showmarkerline))
		this.m_yAxis.horizontalMarkerLines();
	this.m_yAxis.markYaxis(0);
	this.m_yAxis.drawYAxis();
};

TimeColumnStackChart.prototype.drawSVGCoulmns = function () {
	for (var i = 0; i < this.m_yPixelArray.length; i++) {
		if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesDisplayNames[i]]))
			this.m_columnsArray[i].drawColumns(i);
	}
};

TimeColumnStackChart.prototype.getStartX = function () {
	/*	var textmargin=50;
	var yAxislabelDescMargin;
	var chartXMargin=textmargin*(Math.ceil(this.seriesMap.length/2));
	yAxisDescriptionMargin = 5 ;
	if(this.m_yAxis.m_description != '' )
	yAxisDescriptionMargin = this.m_yAxis.m_fontsize*1.5 +3*1;

	var formatterMargin = 5;
	var startX=(this.m_x*1)+(chartXMargin*1);
	return startX;
	 */

	this.yaxisLabelFont = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.m_yAxis.m_labelfontsize + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
	this.yaxisDescriptionFont = this.m_yAxis.m_fontstyle + " " + this.m_yAxis.m_fontweight + " " + this.m_yAxis.m_fontsize + "px " + selectGlobalFont(this.m_yAxis.m_fontfamily);
	var btdm = this.getBorderToDescriptionMargin();
	var dm = this.getYAxisDescriptionMargin();
	var dtlm = this.getDescriptionToLabelMargin();
	var ltam = this.getLabelToAxisMargin();
	var lm = this.getYAxisLabelMargin();

	var testStartX = this.m_x * 1 + btdm * 1 + dm * 1 + dtlm * 1 + lm * 1 + ltam * 1;
	//console.log(testStartX +"==m_x:"+this.m_x*1 +"==btdm:"+ btdm*1 +"==dm:"+ dm*1 +"==dtlm:"+ dtlm*1 +"==lm:"+ lm*1 +"==ltam:"+ ltam*1) ;
	this.m_startX = 1 * testStartX;
	if (this.m_startX < 40)
		this.m_startX = 40;
	return this.m_startX;
};

TimeColumnStackChart.prototype.getYAxisLabelMargin = function () {
	var lm = 0;
	var lfm = this.getLabelFormatterMargin();
	var lw = this.getLabelWidth();
	var lsm = this.getLabelSignMargin();
	var lpm = this.getLabelPrecisionMargin();
	var lsfm = this.getLabelSecondFormatterMargin();
	//console.log( lfm*1 +"="+ lw*1 +"="+ lsm*1 +"="+lpm*1 +"="+ lsfm*1 );
	lm = lfm * 1 + lw * 1 + lsm * 1 + lpm * 1 + lsfm * 1;
	return lm;
};

TimeColumnStackChart.prototype.getLabelFormatterMargin = function () {
	var lfm = 0;

	if (!IsBoolean(this.m_fixedlabel)) {
		if (IsBoolean(this.m_yAxis.getLeftaxisFormater())) {
			if (this.m_formater != 'none' && this.m_formater != '')
				if (this.m_unit != 'none' && this.m_unit != '') {
					var unit = this.m_util.getFormatterSymbol(this.m_formater, this.m_unit);
					this.ctx.beginPath();
					this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.m_yAxis.m_labelfontsize + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
					lfm = this.ctx.measureText(unit).width;
					this.ctx.closePath();
				}
		}
	}
	return lfm;
};
TimeColumnStackChart.prototype.getLabelWidth = function () {
	var lw = 0;
	var maxSeriesVal = this.getMaximumSeriesValue();
	var maxSeriesValDecimal = maxSeriesVal;
	if (this.m_charttype == "100%") {
		maxSeriesVal = 100;
		maxSeriesValDecimal = maxSeriesVal ;
	} else {
		var maxDivisor = getMax(maxSeriesVal);
		maxSeriesVal = maxDivisor[0];
		maxSeriesValDecimal = (maxDivisor[2] < 1) ? maxSeriesVal + ".00" : maxSeriesVal;
	}
	this.ctx.beginPath();
	this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.m_yAxis.m_labelfontsize + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
	lw = this.ctx.measureText(maxSeriesValDecimal).width;
	this.ctx.closePath();
	if (!IsBoolean(this.m_fixedlabel)) {
		if (IsBoolean(this.m_yAxis.getLeftaxisFormater())) {
			if (this.getSecondaryFormater() != 'none' && this.getSecondaryFormater() != '') {
				if (this.getSecondaryUnit() != 'none' && this.getSecondaryUnit() != '') {
					var secondunit = this.m_util.getFormatterSymbol(this.getSecondaryFormater(), this.getSecondaryUnit());
					if (this.getSecondaryUnit() == 'auto')
						maxSeriesVal = getNumberFormattedValue(maxSeriesVal * 1);
					else if (this.getSecondaryUnit() == 'none')
						maxSeriesVal = this.m_util.updateTextWithFormatter(maxSeriesVal, secondunit, this.m_precision);
				}
			}
			if (this.m_formater != 'none' && this.m_formater != '') {
				if (this.m_unit != 'none' && this.m_unit != '') {
					var unit = this.m_util.getFormatterSymbol(this.m_formater, this.m_unit);
					maxSeriesVal = maxSeriesVal + "" + unit;
				}
			}
			this.ctx.beginPath();
			this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.m_yAxis.m_labelfontsize + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
			lw = this.ctx.measureText(maxSeriesVal).width;
			this.ctx.closePath();
		}
	}
	return lw;
};

TimeColumnStackChart.prototype.getLabelSignMargin = function () {
	var lsm = 0;
	var msvw = 0;
	var minSeriesValue = this.getMinimumSeriesValue();
	if (minSeriesValue < 0) {
		this.ctx.beginPath();
		this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.m_yAxis.m_labelfontsize + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
		var msvw = this.ctx.measureText(minSeriesValue).width;
		this.ctx.closePath();
	}

	if (this.getLabelWidth() < msvw)
		lsm = this.ctx.measureText("-").width;

	return lsm;
};

TimeColumnStackChart.prototype.getLabelPrecisionMargin = function () {
	var lpm = 5;
	if (!IsBoolean(this.m_fixedlabel)) {
		if (IsBoolean(this.m_yAxis.getLeftaxisFormater())) {
			if (this.m_precision != 'none' && this.m_precision != '' && this.m_precision != 0) {
				this.ctx.beginPath();
				this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.m_yAxis.m_labelfontsize + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
				var precisionText = ".";
				for (var i = 0; i < this.m_precision; i++)
					precisionText = precisionText + "" + "0";
				lpm = this.ctx.measureText(precisionText).width;
				this.ctx.closePath();
			}
		}
	}
	return lpm;
};
TimeColumnStackChart.prototype.getMinimumSeriesValue = function () {
	var minSeriesVal = 0;
	for (var i = 0; i < this.m_seriesData.length; i++) {
		for (var j = 0; j < this.m_seriesData[i].length; j++) {
			var data = this.m_seriesData[i][j];
			data = (isNaN(data) || data == undefined || data == "") ? 0 : data;
			if (i == 0 && j == 0) {
				minSeriesVal = data;
			}
			if (minSeriesVal * 1 >= data * 1) {
				minSeriesVal = data;
			}
		}
	}
	return minSeriesVal;
};
TimeColumnStackChart.prototype.getMaximumSeriesValue = function () {
	var maxSeriesVal = 0;
	for (var i = 0; i < this.m_seriesData.length; i++) {
		for (var j = 0; j < this.m_seriesData[i].length; j++) {
			var data = this.m_seriesData[i][j];
			data = (isNaN(data) || data == undefined || data == "") ? 0 : data;
			if (i == 0 && j == 0) {
				maxSeriesVal = data;
			}
			if (maxSeriesVal * 1 <= data * 1) {
				maxSeriesVal = data;
			}
		}
	}
	return maxSeriesVal;
};
TimeColumnStackChart.prototype.getLabelSecondFormatterMargin = function () {
	var lsfm = 0;

	if (!IsBoolean(this.m_fixedlabel)) {
		if (IsBoolean(this.m_yAxis.getLeftaxisFormater())) {
			if (this.getSecondaryFormater() != 'none' && this.getSecondaryFormater() != '') {
				if (this.getSecondaryUnit() != 'none' && this.getSecondaryUnit() != '') {
					if (this.getSecondaryUnit() != 'auto') {
						var secondunit = this.m_util.getFormatterSymbol(this.getSecondaryFormater(), this.getSecondaryUnit());
					} else {
						var secondunit = "K";
					}
					this.ctx.font = this.m_yAxis.m_fontstyle + " " + this.m_yAxis.m_fontweight + " " + this.m_yAxis.m_fontsize + "px " + selectGlobalFont(this.m_yAxis.m_fontfamily);
					lsfm = this.ctx.measureText(secondunit).width;
				}
			}
		}
	}
	return lsfm;
};

TimeColumnStackChart.prototype.getEndX = function () {
	var textmargin = 50;
	var chartXMargin = textmargin * (Math.floor(this.seriesMap.length / 2));
	var endX = (this.m_x * 1) + (this.m_width * 1) - (chartXMargin) - 30;

	return endX;
};

TimeColumnStackChart.prototype.getStartY = function () {
	var chartYMargin = 5;
	this.m_startY = (this.m_y * 1) + (this.m_height * 1) - chartYMargin - this.getXAxisLabelMargin() - this.getXAxisDescriptionMargin() - this.getHorizontalLegendMargin() - ((IsBoolean(this.m_showslider)) ? this.sliderMargin : 0);
	if (this.scaleFlag)
		return parseInt(this.m_y) + parseInt(this.m_height) - 18;
	else
		return this.m_startY;
};
TimeColumnStackChart.prototype.getXAxisLabelMargin = function () {
	var xAxislabelDescMargin = 15;
	this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.m_xAxis.getLabelFontSize() + "px " + this.m_xAxis.getLabelFontFamily();
	var xlm = this.m_xAxis.m_labelfontsize * 1.5;
	this.noOfRows = 1;
	xAxislabelDescMargin = (xlm) * this.noOfRows;
	return xAxislabelDescMargin;
};

TimeColumnStackChart.prototype.setNoOfRows = function () {
	this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.m_xAxis.m_labelfontsize + "px " + this.m_xAxis.m_labelfontfamily;
	var textWidth = this.ctx.measureText(this.m_categoryData[0][0]).width;
	var xDivision = (this.getEndX() - this.getStartX()) / this.m_categoryData[0].length;
	var noOfRow = 1;
	for (var i = 1; i < this.m_categoryData[0].length; i++) {
		if (this.ctx.measureText(this.m_categoryData[0][i]).width > xDivision)
			noOfRow = 2;
	}
	if (IsBoolean(this.m_xAxis.getLabelTilted()))
		noOfRow = 1;
	return noOfRow;
};

TimeColumnStackChart.prototype.getXAxisDescriptionMargin = function () {
	var xAxisDescriptionMargin = 2;
	if (this.m_xAxis.getDescription() != "") {
		xAxisDescriptionMargin = this.m_xAxis.getFontSize() * 1.5;
	}
	return xAxisDescriptionMargin;
};

TimeColumnStackChart.prototype.getEndY = function () {
	return (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1 + this.getRangeSelectorMargin() * 1);
};
TimeColumnStackChart.prototype.getMarginForTitle = function () {
	var margin;

	if ((!IsBoolean(this.getShowGradient())) && (!IsBoolean(this.m_showmaximizebutton)) && (!IsBoolean(this.getTitle().m_showtitle)))
		margin = 15;
	else
		margin = 40;
	return margin;
};
TimeColumnStackChart.prototype.getMarginForSubTitle = function () {
	var margin;
	if (IsBoolean(this.m_subTitle.m_showsubtitle))
		margin = (this.m_subTitle.getDescription() != "") ? (this.m_subTitle.getFontSize() * 1.5) : 10;
	else
		margin = 0;
	return margin;
};
TimeColumnStackChart.prototype.getRangeSelectorMargin = function () {
	if (IsBoolean(this.m_showrangeselector) && this.m_charttype == "timeseries")
		return this.rangedSelectorMargin;
	else
		return 0;
};

TimeColumnStackChart.prototype.getDataPointAndUpdateGlobalVariable = function (seriesColors, categoryIndex, seriesData, categoryData, seriesName, catName, seriesIndex, seriesDisplayName) {
	if (!IsBoolean(this.m_isEmptySeries)) {
		if (this.getGlobalKey() != "") {
			var fieldNameValueMap = this.getFieldNameValueMap(categoryIndex);
			var drillColor = seriesColors;
			var drillField = seriesName[seriesIndex];
			var drillDisplayField = seriesDisplayName[seriesIndex];
			var drillValue = fieldNameValueMap[drillField];
			fieldNameValueMap.drillField = drillField;
			fieldNameValueMap.drillDisplayField = drillDisplayField;
			fieldNameValueMap.drillValue = drillValue;
			this.updateDataPoints(fieldNameValueMap, drillColor);
		}
	}
};
TimeColumnStackChart.prototype.getFieldNameValueMap = function (i) {
	var m_fieldNameValueMap = new Object();
	for (var l = 0; l < this.getAllFieldsName().length; l++) {
		m_fieldNameValueMap[this.getAllFieldsName()[l]] = this.getDataProvider()[i][this.getAllFieldsName()[l]];
	}
	return m_fieldNameValueMap;
};

/****************    Line Calculation   ************************/

function SVGColumnCalculation() {
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

SVGColumnCalculation.prototype.init = function (lineRef, xAxisData, yAxisData, allSeriesMap, index, allCategories) {
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

SVGColumnCalculation.prototype.calculateMinimumMaximum = function () {
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

SVGColumnCalculation.prototype.getMaxValue = function () {
	return this.max;
};

SVGColumnCalculation.prototype.getMinValue = function () {
	return this.min;
};
SVGColumnCalculation.prototype.getYAxisText = function () {
	this.getMaxValue();
	return this.yAxisText;
};

SVGColumnCalculation.prototype.isInt = function (n) {
	return typeof n === 'number' && n % 1 == 0;
};

SVGColumnCalculation.prototype.getYAxisMarkersArray = function () {
	return this.m_yAxisMarkersArray;
};
SVGColumnCalculation.prototype.getEachLinePix = function () {
	this.eachLinePix = (this.startY * 1 - this.endY * 1) / (this.getMaxValue() - this.getMinValue());
	return this.eachLinePix;
};
SVGColumnCalculation.prototype.getXAxisDiv = function () {
	this.xAxisDiv = (this.endX - this.startX) / (this.xAxisData.length - 1);
	return this.xAxisDiv;
};

SVGColumnCalculation.prototype.setMarginX = function () {
	if (this.index <= Math.ceil(this.m_allSeriesMap.length / 2)) {
		this.marginX = this.index;
	} else {}
};
SVGColumnCalculation.prototype.calculateMinMaxCategory = function (allCategories) {
	var dates = [];
	for (var i = 0; i < allCategories.length; i++) {
		for (var j = 0; j < allCategories[i].length; j++) {
			if (allCategories[i][j] != "")
				dates.push(new Date(allCategories[i][j]));
		}
	}
	this.maxDate = new Date(Math.max.apply(null, dates));
	this.minDate = new Date(Math.min.apply(null, dates));
};

SVGColumnCalculation.prototype.getYPosition = function () {
	var yparray = [];
	for (var i = 0; i < this.yAxisData.length; i++) {
		yparray[i] = [];
		for (var j = 0; j < this.yAxisData[i].length; j++) {
			if (this.yAxisData[i][j] === "" || isNaN(this.yAxisData[i][j]) || this.yAxisData[i][j] == null || this.yAxisData[i][j] == "null") {
				yparray[i][j] = "";
			} else
				yparray[i][j] = (this.startY) - ((this.getEachLinePix()) * (this.yAxisData[i][j] - this.getMinValue()));
		}
	}
	this.yPositionArray = yparray;
	return this.yPositionArray;
};

/**************************** X-Position *************************************/
SVGColumnCalculation.prototype.getXAxisPixelRatio = function () {
	if (this.m_chart.m_charttype == "timeseries")
		var xaxisRatio = (this.endX - this.startX - 1 * ((this.endX - this.startX) / this.xAxisData.length)) / (new Date(this.maxDate).getTime() - new Date(this.minDate).getTime());
	else
		var xaxisRatio = (this.endX - this.startX) / (this.xAxisData.length - 1);

	return xaxisRatio;
};

SVGColumnCalculation.prototype.getXPosition = function () {
	this.xPositionArray = [];
	for (var i = 0; i < this.xAxisData.length; i++) {
		if (this.m_chart.m_charttype == "timeseries") {
			if (this.xAxisData.length == 1) {
				this.xPositionArray[i] = (this.startX * 1) + (this.endX - this.startX) / 2;
			} else {
				if (this.xAxisData[i] != "")
					this.xPositionArray[i] = this.startX * 1 + 1 * ((this.endX - this.startX) / this.xAxisData.length) / 2 + ((new Date(this.xAxisData[i]).getTime() - new Date(this.minDate).getTime()) * this.getXAxisPixelRatio());
			}
		} else {
			if (this.xAxisData.length == 1) {
				this.xPositionArray[i] = (this.startX * 1) + (this.endX - this.startX) / 2;
			} else
				this.xPositionArray[i] = this.startX * 1 + this.getXAxisPixelRatio() * i;
		}
	}
	return this.xPositionArray;
};

SVGColumnCalculation.prototype.getXAxisMarkersArray = function () {
	if (this.m_chart.m_charttype == "timeseries") {
		this.setXAxisMarkerForTimeLine();
	} else {
		this.setXAxisMarkerforAdvanceLine();
	}
	return this.m_xAxisMarkersArray;
};
SVGColumnCalculation.prototype.setXAxisMarkerforAdvanceLine = function () {
	var stepValue = 1;
	if (this.xAxisData.length > 10)
		stepValue = Math.ceil(this.xAxisData.length / 10);
	var stepWidth = (this.endX - this.startX) / (this.xAxisData.length);

	this.m_xAxisMarkersArray = [];
	this.xPositionForMarker = [];
	var noOfMarker = this.xAxisData.length;
	for (var i = 0; i < noOfMarker; ) {
		if (noOfMarker.length == 1)
			var x = parseInt(this.startX) + (this.endX - this.startX) / 2;
		else
			var x = parseInt(this.startX) + 1 * ((this.endX - this.startX) / this.xAxisData.length) / 2 + (stepWidth * (i));

		this.m_xAxisMarkersArray.push(this.xAxisData[i]);
		this.xPositionForMarker.push(x);
		i = ((i * 1) + stepValue);
	}
};
SVGColumnCalculation.prototype.getXAxisPositionForMarkers = function () {
	return this.xPositionForMarker;
};
/*******Calculation for TimeSeries Scale**********/
SVGColumnCalculation.prototype.setXAxisMarkerForTimeLine = function () {
	if (this.xAxisData.length == 1) {
		this.m_xAxisMarkersArray = [];
		this.xPositionForMarker = [];
		this.m_xAxisMarkersArray[0] = this.xAxisData[0];
		this.xPositionForMarker[0] = (this.startX * 1) + (this.endX - this.startX) / 2;
	} else {
		this.dataFrequency = this.getDataFrequency(this.xAxisData[0], this.xAxisData[1]);
		var totalNoOfDay = this.getDateData();
		var scaleFormate = this.getTimeLineMarkerFormateAndStep(totalNoOfDay);
		var firstDate = new Date(this.xAxisData[0]).getTime();
		var lastDate = this.xAxisData[this.xAxisData.length - 1];
		for (var i = this.xAxisData.length - 1; i > 0; i--) {
			if (this.xAxisData[i] != "") {
				lastDate = this.xAxisData[i];
				break;
			}
		}
		lastDate = new Date(lastDate).getTime();
		var xAxisArr = [];
		var xPositionArr = [];
		for (i = firstDate; i <= lastDate; ) {
			var data = this.getFormattedDateTime(i, scaleFormate.formate, scaleFormate.step);
			if (data.textData != "") {
				xAxisArr.push(data.textData);
				xPositionArr.push(this.startX * 1 + 1 * ((this.endX - this.startX) / this.xAxisData.length) / 2 + ((i - new Date(this.minDate).getTime()) * this.getXAxisPixelRatio()));
			}
			i = data.index;
		}
		this.m_xAxisMarkersArray = xAxisArr;
		this.xPositionForMarker = xPositionArr;
		//var Data=(this.getFormattedDateTime(this.m_xAxisData[i], scaleFormate.formate, scaleFormate.step, i));
	}
};
SVGColumnCalculation.prototype.getDateData = function () {
	this.xAxisData.length;
	var startDay = new Date(isNaN(this.xAxisData[0]) ? this.xAxisData[0] : this.xAxisData[0] * 1);
	var endIndex = this.xAxisData.length - 1;
	for (var i = this.xAxisData.length - 1; i > 0; i--) {
		if (this.xAxisData[i] != "") {
			endIndex = i;
			break;
		}
	}
	var endDay = new Date(isNaN(this.xAxisData[endIndex]) ? this.xAxisData[endIndex] : this.xAxisData[endIndex] * 1);
	var millisecondsPerDay = 1000 * 60 * 60 * 24;

	var millisBetween = endDay.getTime() - startDay.getTime();
	var days = millisBetween / millisecondsPerDay;
	return (Math.floor(days));
};
SVGColumnCalculation.prototype.getDataFrequency = function (date1, date2) {
	var date1 = new Date(isNaN(date1) ? date1 : date1 * 1);
	var date2 = new Date(isNaN(date2) ? date2 : date2 * 1);
	var diff = Math.abs(Math.floor(date1.getTime() - date2.getTime()));
	var day = 1000 * 60 * 60 * 24;
	var hour = 1000 * 60 * 60;
	var minute = 1000 * 60;

	var days = Math.floor(diff / day);
	var months = Math.floor(days / 31);
	var years = Math.floor(months / 12);
	var hours = Math.floor(diff / hour);
	var minutes = (diff / minute) - 60 * hours;

	var message = {};
	message['year'] = years;
	message['month'] = months;
	message['day'] = days;
	message['hour'] = hours;
	message['minute'] = minutes;

	if (years > 0)
		return "year";
	if (months > 0)
		return "month";
	if (days > 0)
		return "day";
	if (hours > 0)
		return "hour";
	if (minutes > 0)
		return "minute";
};
SVGColumnCalculation.prototype.getTimeLineMarkerFormateAndStep = function (days) {
	if (this.dataFrequency == "minute")
		return this.getFormateAndStepsforMin(days);
	else if (this.dataFrequency == "hour")
		return this.getFormateAndStepsforHour(days);
	else if (this.dataFrequency == "day")
		return this.getFormateAndStepsforDay(days);
	else if (this.dataFrequency == "month")
		return this.getFormateAndStepsforMonth(days);
	else if (this.dataFrequency == "year")
		return this.getFormateAndStepsforYear(days);
};
SVGColumnCalculation.prototype.getFormateAndStepsforYear = function (days) {
	if (days < 2920)
		return {
			formate : "year",
			step : 1
		};
	else if (days >= 2920 && days < 7300)
		return {
			formate : "year",
			step : 2
		};
	else if (days >= 7300 && days < 14600)
		return {
			formate : "year",
			step : 4
		};
	else
		return {
			formate : "year",
			step : 10
		};
};
SVGColumnCalculation.prototype.getFormateAndStepsforMonth = function (days) {
	if (days < 240) {
		return {
			formate : "month",
			step : 1
		};
	} else if (days >= 240 && days < 365) {
		return {
			formate : "month",
			step : 2
		};
	} else if (days >= 365 && days < 730) {
		return {
			formate : "month",
			step : 3
		};
	} else if (days >= 730 && days < 1460) {
		return {
			formate : "month",
			step : 6
		};
	} else if (days >= 1460 && days < 2920) {
		return {
			formate : "year",
			step : 1
		};
	} else
		return {
			formate : "year",
			step : 4
		};
};
SVGColumnCalculation.prototype.getFormateAndStepsforDay = function (days) {
	if (days < 10) {
		return {
			formate : "day",
			step : 1
		};
	} else if (days >= 10 && days < 20) {
		return {
			formate : "day",
			step : 2
		};
	} else if (days >= 20 && days < 28) {
		return {
			formate : "day",
			step : 3
		};
	} else if (days >= 28 && days < 70) {
		return {
			formate : "day",
			step : 7
		};
	} else if (days >= 70 && days < 140) {
		return {
			formate : "day",
			step : 14
		};
	} else if (days >= 140 && days < 280) {
		return {
			formate : "month",
			step : 1
		};
	} else if (days >= 280 && days < 365) {
		return {
			formate : "month",
			step : 2
		};
	} else if (days >= 365 && days < 730) {
		return {
			formate : "month",
			step : 3
		};
	} else if (days >= 730 && days < 1460) {
		return {
			formate : "month",
			step : 6
		};
	} else if (days >= 1460 && days < 2920) {
		return {
			formate : "year",
			step : 1
		};
	} else
		return {
			formate : "year",
			step : 4
		};
};
SVGColumnCalculation.prototype.getFormateAndStepsforHour = function (days) {
	if (days < 1) {
		return {
			formate : "hour",
			step : 3
		};
	} else if (days >= 1 && days < 2) {
		return {
			formate : "hour",
			step : 6
		};
	} else if (days >= 2 && days < 4) {
		return {
			formate : "hour",
			step : 10
		};
	} else if (days < 28) {
		var step = (days > 7) ? 2 : 1;
		if (days > 20)
			step = 3;
		return {
			formate : "day",
			step : step
		};
	} else if (days >= 28 && days < 70) {
		return {
			formate : "day",
			step : 7
		};
	} else if (days >= 70 && days < 140) {
		return {
			formate : "day",
			step : 14
		};
	} else if (days >= 140 && days < 280) {
		return {
			formate : "month",
			step : 1
		};
	} else if (days >= 280 && days < 365) {
		return {
			formate : "month",
			step : 2
		};
	} else if (days >= 365 && days < 730) {
		return {
			formate : "month",
			step : 3
		};
	} else if (days >= 730 && days < 1460) {
		return {
			formate : "month",
			step : 6
		};
	} else if (days >= 1460 && days < 2920) {
		return {
			formate : "year",
			step : 1
		};
	} else
		return {
			formate : "year",
			step : 4
		};
};
SVGColumnCalculation.prototype.getFormateAndStepsforMin = function (days) {
	if (days < 1) {
		return {
			formate : "hour",
			step : 3
		};
	} else if (days >= 1 && days < 2) {
		return {
			formate : "hour",
			step : 6
		};
	} else if (days >= 2 && days < 4) {
		return {
			formate : "hour",
			step : 10
		};
	} else if (days < 28) {
		var step = (days > 7) ? 2 : 1;
		if (days > 20)
			step = 3;
		return {
			formate : "day",
			step : step
		};
	} else if (days >= 28 && days < 70) {
		return {
			formate : "day",
			step : 7
		};
	} else if (days >= 70 && days < 140) {
		return {
			formate : "day",
			step : 14
		};
	} else if (days >= 140 && days < 280) {
		return {
			formate : "month",
			step : 1
		};
	} else if (days >= 280 && days < 365) {
		return {
			formate : "month",
			step : 2
		};
	} else if (days >= 365 && days < 730) {
		return {
			formate : "month",
			step : 3
		};
	} else if (days >= 730 && days < 1460) {
		return {
			formate : "month",
			step : 6
		};
	} else if (days >= 1460 && days < 2920) {
		return {
			formate : "year",
			step : 1
		};
	} else
		return {
			formate : "year",
			step : 4
		};
};

SVGColumnCalculation.prototype.getNextMonthIndex = function (date, index, steps) {
	var month = (date.getMonth() + 1);
	var year = date.getFullYear();
	var day = 1000 * 60 * 60 * 24;
	for (var i = 1; i <= steps; i++) {
		var days = (new Date(year, month, 0).getDate());
		month++;
		index = index + (days * day);
	}
	return index;
};

SVGColumnCalculation.prototype.getNextYearIndex = function (year, index, steps) {
	var day = 1000 * 60 * 60 * 24;
	for (var i = 0; i < steps; i++) {
		index = (index * 1) + (((IsBoolean(isLeapYear(year * 1 + i * 1))) ? 366 : 365) * day);
	}
	return index;
};
SVGColumnCalculation.prototype.getFormattedDateTime = function (data, formate, steps) {
	var monthArr = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var dayArr = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	var date = new Date(isNaN(data) ? data : data * 1);
	if (formate == "hour" && (this.dataFrequency == "hour" || this.dataFrequency == "minute")) {
		var hour = 1000 * 60 * 60;{
			var date = new Date(data * 1);
			var textData = date.getDate() + ". " + monthArr[date.getMonth() + 1] + " " + date.getHours() + ":00";
			return {
				textData : textData,
				index : (data * 1 + steps * hour)
			};
		}
	} else if (formate == "day" && (this.dataFrequency == "day" || this.dataFrequency == "hour" || this.dataFrequency == "minute")) {
		var day = 1000 * 60 * 60 * 24;
		var date = new Date(data * 1);
		var textData = date.getDate() + ". " + monthArr[date.getMonth() + 1];
		return {
			textData : textData,
			index : (data * 1 + steps * day)
		};
	} else if (formate == "month" && (this.dataFrequency == "day" || this.dataFrequency == "hour" || this.dataFrequency == "month" || this.dataFrequency == "minute")) {
		var date = new Date(data * 1);
		var day = 1000 * 60 * 60 * 24;

		if (date.getDate() == 1) {
			var textData = (monthArr[date.getMonth() + 1] + " \'" + ("" + date.getFullYear()).substring(2, 4));
			return {
				textData : textData,
				index : (this.getNextMonthIndex(date, data, steps))
			};
		} else
			return {
				textData : "",
				index : ((data * 1) + day)
			};
	} else {
		var day = 1000 * 60 * 60 * 24;
		var date = new Date(data * 1);
		var month = (date.getMonth() + 1);
		var year = date.getFullYear();
		var days = new Date(year, month, 0).getDate();
		if ((date.getMonth() + 1) == 1) {
			var textData = date.getFullYear();
			return {
				textData : textData,
				index : (this.getNextYearIndex(textData, data, steps))
			};
		} else
			return {
				textData : "",
				index : (days * day)
			};
	}
};

/************************* Title ************************************/
function svgTitleColumn(m_chart) {
	this.base = Title;
	this.base(m_chart);
};
svgTitleColumn.prototype = new Title;

svgTitleColumn.prototype.drawTitleBox = function () {
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
	$("#" + temp.m_chart.svgContainerId).append(rect);
};
svgTitleColumn.prototype.drawText = function () {
	var temp = this.m_chart;
	this.startY = this.m_chart.m_y * 1 + (this.m_titleBarHeight) / 2;
	var text = drawSVGText(this.startX, this.startY, this.m_formattedDescription, this.m_fontColor, this.getAlign(), "middle");
	text.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.getFontSize() + "px;font-weight:" + this.getFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$('#' + temp.svgContainerId).append(text);
};

/*************************** SubTitle **************************/
function svgSubTitleColumn() {
	this.base = SubTitle;
	this.base();
};
svgSubTitleColumn.prototype = new SubTitle;
svgSubTitleColumn.prototype.drawText = function () {
	var temp = this.m_chart;
	var text = drawSVGText(this.startX, this.startY, this.m_formattedDescription, this.m_fontColor, this.getAlign(), "middle");
	text.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.getFontSize() + "px;font-weight:" + this.getFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$('#' + temp.svgContainerId).append(text);
};

function svgYAxisColumn() {
	this.base = Yaxis;
	this.base();
	this.m_showlineyaxis = "true";
	this.m_lineyaxiscolor = "";
};
svgYAxisColumn.prototype = new Yaxis;
svgYAxisColumn.prototype.drawYAxis = function () {
	var temp = this;
	if (IsBoolean(this.m_showlineyaxis)) {
		var newLine = drawSVGLine(this.m_startX, this.m_startY, this.m_startX, this.m_endY, "1", temp.m_lineyaxiscolor);
		$("#" + temp.m_chart.svgContainerId).append(newLine);
	}
};

svgYAxisColumn.prototype.horizontalMarkerLines = function () {
	var temp = this;
	for (var i = 0; i < this.m_yAxisMarkersArray.length; i++) {
		var newLine = drawSVGLine(this.m_startX, this.m_startY - (i * this.getYAxisDiv()), this.m_endX, this.m_startY - (i * this.getYAxisDiv()), "0.9", hex2rgb(temp.m_chart.m_markercolor, temp.m_chart.m_markertransparency));
		$("#" + temp.m_chart.svgContainerId).append(newLine);
	}
};

svgYAxisColumn.prototype.drawRightYAxis = function () {
	this.ctx.beginPath();
	this.ctx.lineWidth = "1.0";
	this.ctx.strokeStyle = this.m_chart.getAxisColor();
	this.ctx.moveTo(this.m_endX, this.m_startY);
	this.ctx.lineTo(this.m_endX, this.m_endY);
	this.ctx.stroke();
	this.ctx.closePath();

	var temp = this;
	var newLine = drawSVGLine(this.m_endX, this.m_startY, this.m_endX, (this.m_endY * 1), "1", temp.m_chart.m_axiscolor);
	$("#" + temp.m_chart.svgContainerId).append(newLine);
};
svgYAxisColumn.prototype.markYaxis = function (index) {
	for (var i = 0; i < this.m_yAxisMarkersArray.length; i++) {
		var text = this.m_yAxisMarkersArray[i];
		if (IsBoolean(this.m_isSecodaryAxis))
			text = this.getSecondaryAxisFormattedText(text);
		else
			text = this.getFormattedText(text);

		this.drawSVGText(this.m_chart.getStartX() - this.m_axislinetotextgap, ((this.m_startY * 1) - (i * (this.getYAxisDiv()))), "", this.m_labelfontcolor, text);
	}
	if (this.getDescription() != "" && this.getDescription() != null)
		this.drawDescription();
};
svgYAxisColumn.prototype.drawDescription = function () {
	var temp = this;
	var fontColor = convertColorToHex(this.getFontColor());
	var description = this.getDescription();

	var text = drawSVGText(this.getXDesc(), this.getYDesc(), description, fontColor, "middle", "middle", 270);
	text.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getFontSize()) + "px;font-weight:" + this.getFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$('#' + temp.m_chart.svgContainerId).append(text);
};
svgYAxisColumn.prototype.drawSVGText = function (x, y, rotate, color, text1) {
	var temp = this;
	var text = drawSVGText(x, y, text1, color, "right", "middle");
	text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.getLabelFontSize() + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getLabelTextDecoration() + ";");
	$('#' + temp.m_chart.svgContainerId).append(text);
};

function svgXAxisColumn() {
	this.base = Xaxis;
	this.base();
	this.m_showlinexaxis = "true";
	this.m_linexaxiscolor = "";
};
svgXAxisColumn.prototype = new Xaxis;

svgXAxisColumn.prototype.init = function (m_chart) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.m_startX = this.m_chart.getStartX();
	this.m_startY = this.m_chart.getStartY();
	this.m_endX = this.m_chart.getEndX();
	this.m_endY = this.m_chart.getEndY();

	this.m_xAxisData = this.m_chart.m_lineCalculation[0].getXAxisMarkersArray();
	this.m_xPositionData = this.m_chart.m_lineCalculation[0].getXAxisPositionForMarkers();
	this.m_axiscolor = convertColorToHex(this.m_chart.getAxisColor());
	this.m_linexaxiscolor = (this.m_linexaxiscolor != "") ? convertColorToHex(this.m_linexaxiscolor) : this.m_axiscolor;

	this.m_labelfontcolor = convertColorToHex(this.getLabelFontColor());
};
svgXAxisColumn.prototype.drawXAxis = function () {
	var temp = this;
	if (IsBoolean(this.m_showlinexaxis)) {
		var newLine = drawSVGLine(this.m_startX, this.m_startY, this.m_endX, (this.m_startY * 1), "1", temp.m_linexaxiscolor);
		$("#" + temp.m_chart.svgContainerId).append(newLine);
	}
};
svgXAxisColumn.prototype.drawVerticalLine = function () {
	var temp = this;
	if (IsBoolean(temp.m_chart.m_showverticalmarkerline)) {
		for (var i = 0; i < this.m_xAxisData.length; i++) {
			var x = this.m_xPositionData[i];
			var newLine = drawSVGLine(x, this.m_startY, x, this.m_endY, "0.9", hex2rgb(temp.m_chart.m_markercolor, temp.m_chart.m_markertransparency));
			$("#" + temp.m_chart.svgContainerId).append(newLine);
		}
	}
};
svgXAxisColumn.prototype.markXaxis = function () {
	this.drawAxisLabels();
	if (this.getDescription() != "") {
		this.drawDescription();
	}
};
svgXAxisColumn.prototype.drawAxisLabels = function () {
	var temp = this;
	var m_axisLineToTextGap = this.calculateAxisLineToTextGap();
	for (var i = 0; i < this.m_xAxisData.length; i++) {
		var x = this.m_xPositionData[i];
		var axisToLabelMargin = 0;
		var y = this.m_startY * 1 + m_axisLineToTextGap * 1 + (axisToLabelMargin) * 1 + (this.m_labelfontsize) * 1.0;

		var tick = drawSVGLine(x, this.m_startY, x, this.m_startY * 1 + 8, "0.9", this.m_labelfontcolor);
		$('#' + temp.m_chart.svgContainerId).append(tick);
		var text = drawSVGText(x, y, this.m_xAxisData[i], this.m_labelfontcolor, "center", "start", this.getLabelrotation());
		text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.getLabelFontSize() + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getLabelTextDecoration() + ";");
		$('#' + temp.m_chart.svgContainerId).append(text);
	}
};
svgXAxisColumn.prototype.drawDescription = function () {
	var temp = this;
	var text = drawSVGText(this.getXDesc(), this.getYDesc() - ((IsBoolean(this.m_chart.m_showslider)) ? this.m_chart.sliderMargin : 0), this.getDescription(), convertColorToHex(this.m_fontcolor), "middle", "middle", 0);
	text.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.getFontSize() + "px;font-weight:" + this.getFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$('#' + temp.m_chart.svgContainerId).append(text);
};
svgXAxisColumn.prototype.drawAxisTick = function () {
	var temp = this;
	var tickMakrerHeight = 8;
	if (IsBoolean(this.m_tickmarks)) {
		for (var i = 0; i < this.m_xAxisData.length; i++) {
			var x = parseInt(this.m_startX) + (this.getXaxisDivison() * i);
			var newLine = drawSVGLine(x, this.m_startY, x, (this.m_startY * 1 + tickMakrerHeight * 1), "0.9", temp.m_chart.m_categorymarkingcolor);
			$("#" + temp.m_chart.svgContainerId).append(newLine);
		}
	}
};

svgXAxisColumn.prototype.getXaxisDivison = function () {
	return ((this.m_endX - this.m_startX) / (this.m_xAxisData.length - 1));
};

svgXAxisColumn.prototype.calculateAxisLineToTextGap = function () {
	var m_axisLineToTextGap = 10;
	return m_axisLineToTextGap;
};

svgXAxisColumn.prototype.drawSVGText = function (x, y, rotate, color, text1) {
	var temp = this.m_chart;
	var text = drawSVGText(x, y, text1, color, "middle", "middle", rotate);
	text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.getLabelFontSize() + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getLabelTextDecoration() + ";");
	$('#' + temp.svgContainerId).append(text);

};

//----------------------------------------ColumnCalculationLatest----------------------------------------

function ColumnCalculationLatest() {
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
	this.m_toolTipDataForStacked;

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

ColumnCalculationLatest.prototype.init = function (m_chart, m_categoryData, m_seriesData) {
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
	if (this.m_chartType == "Stacked" || this.m_chartType == "stacked" || this.m_chartType == "timeseries") {
		this.setstackHeightArray();
		this.setyPixelArray();
	} else {
		this.setyPixelArray();
		this.setstackHeightArray();
	}
	//this.setYAxisText();
	this.setYAxisMarkersArray();
};

ColumnCalculationLatest.prototype.calculateMaxValue = function () {
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
	if (this.m_chartType == "Stacked" || this.m_chartType == "stacked" || this.m_chartType == "timeseries") {
		this.calculateMax = this.m_yAxisData[0][0] * 1;
		this.calculateMin = this.m_yAxisData[0][0] * 1;
		var data = [];
		for (var i = 0, k = 0; i < this.m_yAxisData[0].length; i++) // number of rectangles
		{
			var height = 0;
			var negHeight = 0;
			for (var j = 0; j < this.m_yAxisData.length; j++) // number of stacks in one rectangle
			{
				data[k++] = (this.m_yAxisData[j][i] * 1);
				if (this.m_yAxisData[j][i] * 1 > 0) {
					height = (height) * 1 + (this.m_yAxisData[j][i] * 1) * 1;
				} else {
					negHeight = (this.m_yAxisData[j][i] * 1) * 1 + (negHeight) * 1;
				}
			}
			if ((height) >= (this.calculateMax)) {
				this.calculateMax = height * 1;
			}
			if ((negHeight * 1) < (this.calculateMin)) {
				this.calculateMin = negHeight * 1;
			}
		}
	}
	if (this.m_chartType == "100%" || this.m_chartType == "") {
		this.calculateMax = this.m_yAxisData[0][0] * 1;
		var data = [];
		for (var i = 0, k = 0; i < this.m_yAxisData[0].length; i++) // number of rectangles
		{
			var height = 0;
			for (var j = 0; j < this.m_yAxisData.length; j++) // number of stacks in one rectangle
			{
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

ColumnCalculationLatest.prototype.getMaxValue = function () {
	var maxDivisor;
	if (IsBoolean(this.m_chart.isAxisSetup())) {
		maxDivisor = getMax(this.calculateMax - this.minValue());
		this.max = maxDivisor[0] * 1 + this.minValue() * 1;
	} else {
		if (this.m_chart.m_maximumaxisvalue == "") {
			maxDivisor = getMax(this.calculateMax * 1);
			this.max = maxDivisor[0];
		} else {
			maxDivisor = getMax(this.m_chart.m_maximumaxisvalue - this.minValue());
			this.max = maxDivisor[0] * 1 + this.minValue() * 1;
		}
	}

	if ((this.m_chartType == "100%")) {
		this.m_yAxisText = 20;
		this.m_numberOfMarkers = 6;
		this.max = 100;
	} else {
		this.m_numberOfMarkers = maxDivisor[1] * 1 + 1 * 1;
		this.m_yAxisText = maxDivisor[2];
	}

	return this.max;
};

ColumnCalculationLatest.prototype.minValue = function () {
	if (IsBoolean(this.m_chart.isBaseZero())) {
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
	if ((this.m_chartType == "100%"))
		this.min = 0;

	return this.min;
};

ColumnCalculationLatest.prototype.getYAxisText = function () {
	return this.m_yAxisText;
};
ColumnCalculationLatest.prototype.setYAxisText = function () {
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
ColumnCalculationLatest.prototype.getPercentile = function (value) {
	var percentileValue = value % 10;
	if (percentileValue !== 10) {
		percentileValue = 10 - percentileValue;
	}
	return percentileValue;
};

ColumnCalculationLatest.prototype.getYAxisMarkersArray = function () {
	return this.m_yAxisMarkersArray;
};

ColumnCalculationLatest.prototype.setYAxisMarkersArray = function () {
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

ColumnCalculationLatest.prototype.isInt = function (n) {
	return typeof n === 'number' && n % 1 == 0;
};

ColumnCalculationLatest.prototype.getDrawHeight = function () {
	return this.drawHeight;
};
ColumnCalculationLatest.prototype.setDrawHeight = function () {
	this.drawHeight = (this.m_startY - this.m_endY);
};

ColumnCalculationLatest.prototype.getDrawWidth = function () {
	return this.drawWidth;
};
ColumnCalculationLatest.prototype.setDrawWidth = function () {
	this.drawWidth = 1 * (this.m_endX) - 1 * (this.m_startX);
};

ColumnCalculationLatest.prototype.getRatio = function () {
	return this.ratio;
};
ColumnCalculationLatest.prototype.setRatio = function () {
	var diff = this.getMaxValue() - this.minValue();
	if (diff > 0)
		this.ratio = this.getDrawHeight() / (diff);
	else
		this.ratio = 1;
	if (this.m_chartType == '100%')
		this.setRatioForHundredPercent();
};

ColumnCalculationLatest.prototype.setRatioForHundredPercent = function () {
	this.m_hundredPercentsRatios = [];
	for (var i = 0; i < this.m_yAxisData[0].length; i++) // number of rectangles
	{
		var sum = 0;
		for (var j = 0; j < this.m_yAxisData.length; j++) // number of stacks in one rectangle
		{
			if (this.m_yAxisData[j][i] * 1 < 0)
				this.m_yAxisData[j][i] = (Math.abs(this.m_yAxisData[j][i] * 1));
			sum = (sum) * 1 + (Math.abs(this.m_yAxisData[j][i] * 1));
		}
		this.m_hundredPercentsRatios[i] = (this.getDrawHeight() * 1 / sum * 1);
	}
};

ColumnCalculationLatest.prototype.calculateBarWidth = function () {
	var numberOfColumns = this.m_xAxisData.length;
	var totalGap = (1 * (numberOfColumns)) * this.m_columnGap;
	var availableDrawWidth = (this.getDrawWidth() * 1 - totalGap * 1);
	var barWidth = (availableDrawWidth / numberOfColumns);
	if (barWidth > 40) {
		//this.setBarWidth(40);
		//this.setColumnGap(40);
		this.setBarWidth(15);
		this.setColumnGap(15);
	} else if (barWidth < 9) {
		this.setBarWidth(9);
		this.setColumnGap(9);
	} else {
		this.setBarWidth(barWidth);
	}
};

ColumnCalculationLatest.prototype.setBarWidth = function (barwidth) {
	this.barWidth = barwidth;
	if (this.m_chartType == "Clustered" || this.m_chartType == "clustered") {
		this.setBarWidthForClustered();
	}
};

ColumnCalculationLatest.prototype.setColumnGap = function (barWidth) {
	var totalBarwidth = barWidth * this.m_xAxisData.length;
	var totalGap = this.getDrawWidth() - totalBarwidth;
	this.m_columnGap = totalGap / (this.m_xAxisData.length);
};

ColumnCalculationLatest.prototype.setBarWidthForClustered = function () {
	this.barWidth /= this.m_yAxisData.length;
};

ColumnCalculationLatest.prototype.getBarWidth = function () {
	return this.barWidth;
};

ColumnCalculationLatest.prototype.getColumnGap = function () {
	return this.m_columnGap;
};

ColumnCalculationLatest.prototype.getxPixelArray = function () {
	return this.m_xPixelArray;
};

ColumnCalculationLatest.prototype.setxPixelArray = function () {
	var m_xAxisPixelArray = [];

	for (var i = 0; i < this.m_yAxisData[0].length; i++) {
		m_xAxisPixelArray[i] = [];
		for (var j = 0; j < this.m_yAxisData.length; j++) {
			if (this.m_chartType == "Clustered" || this.m_chartType == "clustered") {
				m_xAxisPixelArray[i][j] = (this.m_startX) * 1 + (this.getBarWidth()) * 1 * j + (this.getColumnGap() / 2) + ((this.getBarWidth()) * 1 * this.m_yAxisData.length + (this.getColumnGap()) * 1) * i;
			} else {
				m_xAxisPixelArray[i][j] = (this.m_startX) * 1 + (this.getBarWidth() * 1) * i + (this.getColumnGap() / 2) + (this.getColumnGap() * 1) * (i);
			}
		}
	}
	// re-transforming 2d array of 5X2
	this.m_xPixelArray = this.transformXPixelArray(m_xAxisPixelArray);
};

ColumnCalculationLatest.prototype.transformXPixelArray = function (m_xAxisPixelArray) {
	var xPixelsarr = [];
	for (var i1 = 0; i1 < this.m_yAxisData.length; i1++) {
		xPixelsarr[i1] = [];
		for (var j1 = 0; j1 < this.m_yAxisData[0].length; j1++) {
			xPixelsarr[i1][j1] = m_xAxisPixelArray[j1][i1];
		}
	}
	return xPixelsarr;
};

ColumnCalculationLatest.prototype.getRatioForHundredPercent = function (index) {
	return this.m_hundredPercentsRatios[index] * 1;
};

ColumnCalculationLatest.prototype.setyPixelArray = function () {
	if (this.m_chartType == "Clustered" || this.m_chartType == "clustered") {
		this.m_ypixelArray = this.getYPixelArrayForClustered();
	} else if (this.m_chartType == "Overlaid" || this.m_chartType == "overlaid") {
		this.m_ypixelArray = this.getYPixelArrayForOverlaid();
	} else if (this.m_chartType == "100%") {
		this.m_ypixelArray = this.setyPixelArrayForHundredPercent();
	}
	if (this.m_chartType == "stacked" || this.m_chartType == "Stacked" || this.m_chartType == "timeseries") {
		this.m_ypixelArray = this.setyPixelArrayForStacked();
	}
};

ColumnCalculationLatest.prototype.getYPixelArrayForClustered = function () {
	var yparray = [];
	for (var i = 0; i < this.m_yAxisData.length; i++) // number of stacks in one rectangle
	{
		yparray[i] = [];
		for (var j = 0; j < this.m_yAxisData[i].length; j++) {
			var ratio = this.getRatio();
			var min = this.minValue();
			var max = this.getMaxValue();

			if (this.m_yAxisData[i][j] > max)
				this.m_yAxisData[i][j] = 0;
			if (this.m_yAxisData[i][j] < min)
				this.m_yAxisData[i][j] = min;

			if (min < 0) {
				var starty = this.m_startY - (Math.abs(min) * ratio);
				var value = this.m_yAxisData[i][j];
			} else {
				var starty = this.m_startY;
				var value = (this.m_yAxisData[i][j] - min);
			}

			if ((value * 1 < 0) && (!IsBoolean(this.m_chart.isAxisSetup())) && (this.m_chart.m_minimumaxisvalue * 1 > 0))
				value = 0;

			yparray[i][j] = (starty - (ratio * value) - 1);

		}
	}
	return yparray;
};

ColumnCalculationLatest.prototype.setSeriesColorForOverlaid = function (seriesColor) {
	this.SeriesColorForOverlaid = seriesColor;
};

ColumnCalculationLatest.prototype.getSeriesColorForOverlaid = function () {
	return this.SeriesColorForOverlaid;
};

ColumnCalculationLatest.prototype.getYPixelArrayForOverlaid = function () {
	var newYAxisData = this.arrangeDataForOverlaid();
	this.setSeriesColorForOverlaid(newYAxisData[1]);
	this.m_yAxisData = newYAxisData[0];
	var yparray = [];
	for (var i = 0; i < this.m_yAxisData.length; i++) // number of stacks in one rectangle
	{
		yparray[i] = [];
		for (var j = 0; j < this.m_yAxisData[i].length; j++) {
			var ratio = this.getRatio();
			var ratio = this.getRatio();
			var min = this.minValue();
			var max = this.getMaxValue();

			if (this.m_yAxisData[i][j] > max)
				this.m_yAxisData[i][j] = 0;
			if (this.m_yAxisData[i][j] < min)
				this.m_yAxisData[i][j] = min;

			if (min < 0) {
				var starty = this.m_startY - (Math.abs(min) * ratio);
				var value = this.m_yAxisData[i][j];
			} else {
				var starty = this.m_startY;
				var value = (this.m_yAxisData[i][j] - min);
			}

			if ((value * 1 < 0) && (!IsBoolean(this.m_chart.isAxisSetup())) && (this.m_chart.m_minimumaxisvalue * 1 > 0))
				value = 0;

			yparray[i][j] = (starty - (ratio * value) - 1);

		}
	}
	return yparray;
};

ColumnCalculationLatest.prototype.arrangeDataForOverlaid = function () {
	this.m_originalindexforoverlaiddata = [];
	var seriesColor = this.m_chart.getSeriesColors();
	var arrangeArray = [];
	var colorArray = [];
	var originalIndexArray = [];
	for (var i = 0; i < this.m_yAxisData[0].length; i++) {
		arrangeArray[i] = [];
		colorArray[i] = [];
		originalIndexArray[i] = [];
		for (var j = 0; j < this.m_yAxisData.length; j++) {
			arrangeArray[i][j] = this.m_yAxisData[j][i] * 1;
			colorArray[i][j] = seriesColor[j];
			originalIndexArray[i][j] = j;
		}
	}
	var sortedData = this.sortingDataWithColor(arrangeArray, colorArray, originalIndexArray);
	var arrengeSeriesDataandColor = this.arrengeSeriesDataandColor(sortedData);
	this.m_originalindexforoverlaiddata = arrengeSeriesDataandColor;
	return arrengeSeriesDataandColor;
};

ColumnCalculationLatest.prototype.sortingDataWithColor = function (arrangeArray, colorArray, originalIndexArray) {
	var m_seriesDataAndColor = [];
	for (var i = 0; i < arrangeArray.length; i++) {
		m_seriesDataAndColor[i] = [];
		for (var j = 0; j < arrangeArray[i].length; j++) {
			m_seriesDataAndColor[i][j] = [];
			m_seriesDataAndColor[i][j][0] = arrangeArray[i][j] * 1;
			m_seriesDataAndColor[i][j][1] = colorArray[i][j];
			m_seriesDataAndColor[i][j][2] = originalIndexArray[i][j];
		}
	}

	for (var k = 0; k < m_seriesDataAndColor.length; k++) {
		m_seriesDataAndColor[k].sort(function (a, b) {
			return b[0] - a[0];
		});
	}

	// only for manage negative value sorting(increasing order) if series have -ve value
	var negative = [];
	for (var m = 0; m < m_seriesDataAndColor.length; m++) {
		var count = 0;
		negative[m] = [];
		for (var n = 0; n < m_seriesDataAndColor[m].length; n++) {
			if (m_seriesDataAndColor[m][n][0] * 1 < 0)
				negative[m][count++] = ((m_seriesDataAndColor[m][n]));
		}

		negative[m].sort(function (a, b) {
			return a[0] - b[0];
		});

		var count1 = 0;
		for (var n = 0; n < m_seriesDataAndColor[m].length; n++) {
			if (m_seriesDataAndColor[m][n][0] * 1 < 0)
				m_seriesDataAndColor[m][n] = negative[m][count1++];
		}
	}
	return m_seriesDataAndColor;
};

ColumnCalculationLatest.prototype.arrengeSeriesDataandColor = function (sortedData) {
	var seriesArr = [];
	var colorArr = [];
	var indexArr = [];
	for (var i = 0; i < sortedData.length; i++) {
		seriesArr[i] = [];
		colorArr[i] = [];
		indexArr[i] = [];
		for (var j = 0; j < sortedData[i].length; j++) {
			seriesArr[i][j] = sortedData[i][j][0];
			colorArr[i][j] = sortedData[i][j][1];
			indexArr[i][j] = sortedData[i][j][2];
		}
	}

	var finalSeriesData = [];
	var finalColor = [];
	var finalIndex = [];
	for (var k = 0; k < seriesArr[0].length; k++) {
		finalSeriesData[k] = [];
		finalColor[k] = [];
		finalIndex[k] = [];
		for (var l = 0; l < seriesArr.length; l++) {
			finalSeriesData[k][l] = seriesArr[l][k] * 1;
			finalColor[k][l] = colorArr[l][k];
			finalIndex[k][l] = indexArr[l][k];
		}
	}
	return [finalSeriesData, finalColor, finalIndex];
};

ColumnCalculationLatest.prototype.setyPixelArrayForHundredPercent = function () {
	var yparray = [];
	for (var i = 0; i < this.m_yAxisData.length; i++) // number of stacks in one rectangle
	{
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

ColumnCalculationLatest.prototype.setyPixelArrayForStacked = function () {
	var yparray = [];
	var positivePointerArray = [];
	var negativePointerArray = [];
	for (var i = 0; i < this.m_yAxisData.length; i++) {
		yparray[i] = [];
		positivePointerArray[i] = [];
		negativePointerArray[i] = [];
		for (var j = 0; j < this.m_yAxisData[i].length; j++) {
			if (isNaN(this.m_yAxisData[i][j]))
				this.m_yAxisData[i][j] = "";
			var ratio = this.getRatio();

			if (i == 0) {
				if (this.m_yAxisData[i][j] * 1 >= 0) {
					if ((this.m_chart.m_minimumaxisvalue * 1 > 0) && (!IsBoolean(this.m_chart.isAxisSetup())))
						yparray[i][j] = ((this.m_startY) - (ratio) * ((this.m_yAxisData[i][j])));
					else
						yparray[i][j] = ((this.m_startY) - (ratio) * ((this.m_yAxisData[i][j]))) + (ratio) * this.minValue();
					positivePointerArray[i][j] = yparray[i][j];
					negativePointerArray[i][j] = (this.m_startY) * 1 + (ratio) * this.minValue();
				} else {
					yparray[i][j] = ((this.m_startY) - (ratio) * ((this.m_yAxisData[i][j]))) + (ratio) * this.minValue();
					negativePointerArray[i][j] = yparray[i][j];
					positivePointerArray[i][j] = (this.m_startY) * 1 + (ratio) * this.minValue();
				}
			} else {
				if (this.m_yAxisData[i][j] >= 0) {
					positivePointerArray[i][j] = positivePointerArray[i - 1][j];
					negativePointerArray[i][j] = negativePointerArray[i - 1][j];
					yparray[i][j] = (positivePointerArray[i][j] * 1 - (ratio) * ((this.m_yAxisData[i][j])));
					positivePointerArray[i][j] = yparray[i][j] * 1;
				} else {
					negativePointerArray[i][j] = negativePointerArray[i - 1][j];
					positivePointerArray[i][j] = positivePointerArray[i - 1][j];
					yparray[i][j] = (negativePointerArray[i][j] * 1 - (ratio) * ((this.m_yAxisData[i][j])));
					negativePointerArray[i][j] = yparray[i][j] * 1;
				}
			}
		}
	}
	return yparray;
};

ColumnCalculationLatest.prototype.getyPixelArray = function () {
	return this.m_ypixelArray;
};

ColumnCalculationLatest.prototype.calculationYpixcelForClusterTypeChart = function () {};

ColumnCalculationLatest.prototype.getstackHeightArray = function () {
	return this.m_stackHeightArray;
};

ColumnCalculationLatest.prototype.setstackHeightArray = function () {
	var stackHeightArray = [];
	if (this.m_chartType == "Stacked" || this.m_chartType == "stacked" || this.m_chartType == "timeseries") {
		this.arrangeStackHeight();
	} else {
		var value;
		var ratio = this.getRatio();
		var min = this.minValue();
		//var max=this.getMaxValue();
		for (var i = 0; i < this.m_yAxisData.length; i++) {
			stackHeightArray[i] = [];
			for (var j = 0; j < this.m_yAxisData[i].length; j++) {
				stackHeightArray[i][j] = this.getRatio();
				if (this.m_chartType === "Clustered" || this.m_chartType === "clustered" || this.m_chartType === "Overlaid" || this.m_chartType === "overlaid") {

					if (min < 0) {
						value = this.m_yAxisData[i][j];
					} else {
						value = (this.m_yAxisData[i][j] - min);
					}

					if ((value * 1 < 0) && (!IsBoolean(this.m_chart.isAxisSetup())) && (this.m_chart.m_minimumaxisvalue * 1 > 0))
						value = 0;
					stackHeightArray[i][j] = (ratio * (value));
				} else if (this.m_chartType === "100%") {
					var ratio = this.getRatioForHundredPercent(j) * 1;
					stackHeightArray[i][j] = Math.ceil(ratio * (Math.abs(this.m_yAxisData[i][j] * 1)));
				}

			}
		}
		this.m_stackHeightArray = stackHeightArray;
	}
};

ColumnCalculationLatest.prototype.arrangeStackHeight = function () {
	var stackHeightArray = [];
	var data = [];
	var min = this.minValue();
	for (var i = 0; i < this.m_yAxisData[0].length; i++) {
		var count = 0;
		var sum = 0;
		var flag1 = true;
		for (var j = 0; j < this.m_yAxisData.length; j++) {
			var ratio = this.getRatio();
			if (this.m_yAxisData[j][i] * 1 >= 0) {
				if ((this.m_yAxisData[j][i] * 1 > this.getMaxValue() * 1) && (IsBoolean(this.m_chart.isAxisSetup()))) {
					this.m_yAxisData[j][i] = 0;
				} else if ((!IsBoolean(this.m_chart.isAxisSetup()))) {
					sum = sum * 1 + this.m_yAxisData[j][i] * 1;
					if (sum * 1 > this.getMaxValue() * 1 && count == 0) {
						this.m_yAxisData[j][i] = 0;
						sum = 0;
						count++;
						flag1 = false;
					} else {
						if (!IsBoolean(flag1))
							this.m_yAxisData[j][i] = 0;
					}
				}
			} else {
				if (this.m_yAxisData[j][i] * 1 < this.minValue() * 1)
					this.m_yAxisData[j][i] = 0;
			}
		}
	}
	for (var i = 0; i < this.m_yAxisData.length; i++) {
		stackHeightArray[i] = [];
		for (var j = 0; j < this.m_yAxisData[i].length; j++) {
			var ratio = this.getRatio();
			stackHeightArray[i][j] = this.getRatio();
			stackHeightArray[i][j] = (ratio * this.m_yAxisData[i][j]);
		}
	}
	this.m_stackHeightArray = stackHeightArray;
};

ColumnCalculationLatest.prototype.calculateSum = function (stacksDataArr) {
	var sum = 0;
	for (var i = 0; i < stacksDataArr.length; i++) {
		sum = (sum * 1) + (stacksDataArr[i] * 1);
	}
	return sum;
};

//--------------------------------------SVGColumns-----------------------------------------

function SVGColumns() {
	this.m_xPixel = [];
	this.m_yPixelArray = [];
	this.m_stackHeightArray = [];
	this.m_stackColorArray = [];
	this.m_svgStackArray = [];
};

SVGColumns.prototype.init = function (xPixel, yPixelArray, stackWidth, stackHeightArray, stackPercentage, stackColorArray, strokeColor, showgradient, showPercentageFlag, percentvalueFlag, plotTrasparencyArray, chart) {
	this.m_showGradient = showgradient;
	this.m_xPixel = xPixel;
	this.m_yPixelArray = yPixelArray;
	this.m_stackWidth = stackWidth;
	this.m_stackHeightArray = stackHeightArray;
	this.m_stackPercentageArray = stackPercentage;
	this.m_stackColorArray = stackColorArray;
	this.m_strokeColor = strokeColor;
	this.m_showPercentFlag = showPercentageFlag;
	this.m_percentvalueFlag = percentvalueFlag;
	this.m_plotTrasparencyArray = plotTrasparencyArray;
	this.m_chart = chart;
	for (var i = 0; i < this.m_yPixelArray.length; i++) {
		this.m_svgStackArray[i] = new SVGStack();
		this.m_svgStackArray[i].init(this.m_xPixel[i], this.m_yPixelArray[i], this.m_stackWidth, this.m_stackHeightArray[i], this.m_stackColorArray[i], this.m_strokeColor, this.m_showGradient, this.m_chart.ctx, this.m_chart.m_chartbase, this.m_stackPercentageArray[i], this.m_showPercentFlag, this.m_percentvalueFlag, this.m_plotTrasparencyArray, this.m_chart);
	}
};

SVGColumns.prototype.drawColumns = function (seriesIndex) {
	for (var i = 0; i < this.m_yPixelArray.length; i++) {
		if (!this.isInRange(i))
			this.m_svgStackArray[i].drawSVGStack(i, seriesIndex);
	}
};

SVGColumns.prototype.isInRange = function (i) {
	//	if(i==0)
	//	{
	if (this.m_yPixelArray[i] >= this.m_chart.getStartY() && this.m_yPixelArray[i] <= this.m_chart.getEndY())
		return true;
	else
		return false;
	//	}
	//	else
	//	{
	//		if(this.m_yPixelArray[i-1]>this.m_chart.getStartY() ||this.m_yPixelArray[i-1]<this.m_chart.getEndY()||this.m_yPixelArray[i]>this.m_chart.getStartY() || this.m_yPixelArray[i]<this.m_chart.getEndY())
	//			return true;
	//		else
	//			return false;
	//	}
};

//------------------------SVGStack----------------------------------------------

function SVGStack() {
	this.m_stackXPixel;
	this.m_stackYPixel;
	this.m_stackWidth;
	this.m_stackHeight;
	this.m_stackColor = [];
	this.m_showGradient;
	this.ctx = "";
}

SVGStack.prototype.init = function (stackXPixel, stackYPixel, stackWidth, stackHeight, stackColor, strokeColor, showGradient, ctx, m_chartbase, stackPercentage, stackShowPercentFlag, stackPercentValueFlag, plotTrasparency, chatRef) {
	this.ctx = ctx;
	this.m_chartbase = m_chartbase;
	this.m_stackXPixel = stackXPixel;
	this.m_stackYPixel = stackYPixel;
	this.m_stackWidth = stackWidth;
	this.m_stackHeight = stackHeight;
	if (this.m_stackColor != undefined)
		this.m_stackColor = stackColor;
	this.m_strokeColor = strokeColor;
	this.m_showGradient = showGradient;
	this.m_stackPercentage = stackPercentage;
	this.m_showPercentageFlag = stackShowPercentFlag;
	this.m_stackPercentValueFlag = stackPercentValueFlag;
	this.m_stackPlotTrasparency = plotTrasparency;
	this.m_chart = chatRef;
};

SVGStack.prototype.getSeriesDataForTooltip = function (seriesData, categoryIndex, seriesIndex) {
	var serArr = [];
	for (var i = 0; i < seriesData.length; i++) {
		serArr.push(seriesData[i][categoryIndex]);
	}
	return serArr;
};

SVGStack.prototype.drawSVGStack = function (categoryIndex, seriesIndex) {
	var temp = this;
	if (IsBoolean(isNaN(this.m_stackYPixel))) {
		this.m_stackYPixel = 0;
		this.m_stackHeight = 0;
	}

	if (this.m_chartbase == "cylinder") {
		this.makeCylinder(this.m_stackXPixel, this.m_stackYPixel, this.m_stackWidth, this.m_stackHeight, this.m_stackColor);
	}

	var fillColor = this.getFillColor();
	var id = (!temp.m_chart.scaleFlag) ? temp.m_chart.svgContainerId : temp.m_chart.svgTimeScaleId;
	var svgStack = drawSVGRect(this.m_stackXPixel, this.m_stackYPixel, this.m_stackWidth, this.m_stackHeight, fillColor);
	$('#' + id).append(svgStack);

	var seriesData = this.getSeriesDataForTooltip(temp.m_chart.seriesMap[0], categoryIndex, seriesIndex);
	var categoryData = temp.m_chart.m_categoryData[0][categoryIndex];
	var seriesName = this.m_chart.m_legendNames;
	var originalSeriesNames = this.m_chart.getSeriesNames();
	var catName = this.m_chart.getCategoryNames()[0];
	var colorArr = this.m_chart.getColorsForSeries();
	if (IsBoolean(this.m_chart.m_showtooltip) && IsBoolean(!this.m_chart.m_designMode)) {
		var id = temp.m_chart.m_objectid;
		svgStack.addEventListener("mouseover", function (evt) {
			temp.drawTooltip(evt, seriesData, categoryData, seriesName, catName, id, temp.m_chart.m_width, colorArr);
		});
		svgStack.addEventListener("mouseout", function () {
			temp.m_chart.hideToolTip();
		});
		svgStack.addEventListener("click", function () {
			temp.m_chart.getDataPointAndUpdateGlobalVariable(temp.color, categoryIndex, seriesData, categoryData, originalSeriesNames, catName, seriesIndex, seriesName);
		});
	}
};

SVGStack.prototype.drawTooltip = function (evt, seriesData, catData, serName, CatName, id, componentWidth, seriesColor) {
	if (!IsBoolean(this.m_chart.m_isEmptySeries) && !this.m_chart.m_designMode) {
		//var chart_data = this.getToolTipData(mouseX, mouseY);
		if (seriesData != undefined) {
			var tooltipContent = "<table class=\" chart-tooltip toolTip\">";
			tooltipContent += "<tr>";
			tooltipContent += "<td colspan=\"2\" class=\"chart-tooltip-head\">";
			tooltipContent += catData;
			tooltipContent += "</td>";
			tooltipContent += "</tr>";
			for (var i = 0; i < seriesData.length; i++) {
				if (this.m_chart.m_seriesVisibleArr[serName[i]]) {
					tooltipContent += "<tr>";
					tooltipContent += "<td><span style=\"background-color:" + seriesColor[i][0] + "; width:10px;height:10px;\"></span>" + serName[i] + "</td>";
					tooltipContent += "<td align=\"right\">" + seriesData[i] + "</td>";
					tooltipContent += "</tr>";
				}
			}
			tooltipContent += "</table>";

			this.m_chart.getToolTip(tooltipContent);
		} else {
			this.m_chart.hideToolTip();
		}
	}
};

SVGStack.prototype.drawText = function () {
	var xspace = 5;
	var yspace = 10;
	if (IsBoolean(this.m_showPercentageFlag)) {
		this.ctx.fillStyle = 'black';
		if (IsBoolean(this.m_stackPercentValueFlag))
			this.ctx.fillText(parseInt(this.m_stackPercentage) + "%", (this.m_stackXPixel * 1 + (this.m_stackWidth * 2 / 3) + xspace * 1), (this.m_stackYPixel * 1 - yspace * 1));
		else
			this.ctx.fillText(parseInt(this.m_stackPercentage), (this.m_stackXPixel * 1 + (this.m_stackWidth * 2 / 3) + xspace * 1), (this.m_stackYPixel * 1 - yspace * 1));
	}
};

SVGStack.prototype.shadow = function () {
	var grd = this.createGradient();
	this.ctx.beginPath();
	this.ctx.fillStyle = grd;
	this.ctx.strokeStyle = "#000000";
	this.ctx.save();
	this.ctx.rect(this.m_stackXPixel, this.m_stackYPixel, this.m_stackWidth, this.m_stackHeight);
	this.ctx.shadowColor = '#ccc';
	this.ctx.shadowBlur = 5;
	this.ctx.shadowOffsetX = 1;
	this.ctx.shadowOffsetY = 0;
	this.ctx.fill();
	this.ctx.restore();
};

SVGStack.prototype.getFillColor = function () {
	var grd = this.m_stackColor;
	if (this.m_chartbase == 'rectangle') {
		this.makeCuboid(this.m_stackXPixel, this.m_stackYPixel, this.m_stackWidth, this.m_stackHeight, this.m_stackColor);
	} else if (this.m_chartbase == 'gradient1') {
		grd = this.createGradient1(this.m_stackXPixel, this.m_stackYPixel, this.m_stackWidth, this.m_stackHeight, this.m_stackColor);
	} else if (this.m_chartbase == 'gradient2') {
		grd = this.createGradient2(this.m_stackXPixel, this.m_stackYPixel, this.m_stackWidth, this.m_stackHeight, this.m_stackColor);
	} else if (this.m_chartbase == 'gradient3') {
		grd = this.createGradient3(this.m_stackXPixel, this.m_stackYPixel, this.m_stackWidth, this.m_stackHeight, this.m_stackColor);
	}
	return grd;
};

SVGStack.prototype.createGradient1 = function (x, y, w, h, color) {
	var gradient = this.ctx.createLinearGradient(x, y, (x * 1 + w * 1), y);
	var color0 = hex2rgb(color, this.m_stackPlotTrasparency);
	gradient.addColorStop(0.1, color0);
	gradient.addColorStop(0.5, ColorLuminance(color, 0.5));
	gradient.addColorStop(1, color0);
	return gradient;
};

SVGStack.prototype.createGradient2 = function (x, y, w, h, color) {
	var gradient = this.ctx.createLinearGradient(x, y, (x * 1 + w * 1), y);
	var color0 = hex2rgb(color, this.m_stackPlotTrasparency);
	gradient.addColorStop(0, color0);
	gradient.addColorStop(0.15, color0);
	gradient.addColorStop(0.5, ColorLuminance(color, -0.15));
	gradient.addColorStop(0.85, color0);
	gradient.addColorStop(1, color0);
	return gradient;
};
SVGStack.prototype.createGradient3 = function (x, y, w, h, color) {
	var gradient = this.ctx.createLinearGradient(x, y, (x * 1 + w * 1), y);
	var color0 = hex2rgb(color, this.m_stackPlotTrasparency);
	gradient.addColorStop(0.1, color0);
	gradient.addColorStop(0.15, color0);
	gradient.addColorStop(0.5, ColorLuminance(color, 0.3));
	gradient.addColorStop(0.85, color0);
	gradient.addColorStop(1, color0);
	return gradient;
};

SVGStack.prototype.makeCuboid = function (x, y, w, h, color) {
	var slant = 0;
	if (h > 0)
		slant = w / 4;
	this.ctx.beginPath();
	this.ctx.moveTo(x, y - 1);
	this.ctx.lineTo(x + slant, y - slant);
	this.ctx.lineTo(x + slant + w, y - slant);
	this.ctx.lineTo(x + slant + w, y - slant + h + 1);
	this.ctx.lineTo(x + w, y + h + 1);
	this.ctx.fillStyle = hex2rgb(color, this.m_stackPlotTrasparency);
	this.ctx.fill();
	this.ctx.lineWidth = '0.2';
	this.ctx.lineTo(x + w, y + h + 1);
	this.ctx.lineTo(x + w, y + 1);
	this.ctx.moveTo(x, y);
	this.ctx.lineTo(x + w, y);
	this.ctx.lineTo(x + w + 1 + slant, y - slant);
	this.ctx.strokeStyle = hex2rgb(color, this.m_stackPlotTrasparency);
	this.ctx.stroke();
	this.ctx.closePath();
};
SVGStack.prototype.makeCylinder = function (x, y, w, h, color) {
	var xpick = 3;
	var ypick = 5;
	var strokeColor = hex2rgb(color, this.m_stackPlotTrasparency);

	this.ctx.beginPath();
	this.ctx.strokeStyle = "#fff";
	this.ctx.fillStyle = strokeColor;
	this.ctx.moveTo(x, y);
	this.ctx.bezierCurveTo((x * 1 + w / xpick), (y * 1 + ypick), (x * 1 + w * 2 / xpick), (y * 1 + ypick), (x * 1 + w * 1), y);
	this.ctx.stroke();

	this.ctx.strokeStyle = hex2rgb(color, this.m_stackPlotTrasparency);
	this.ctx.moveTo(x, y);
	this.ctx.bezierCurveTo((x * 1 + w / xpick), (y * 1 - ypick), (x * 1 + w * 2 / xpick), (y * 1 - ypick), (x * 1 + w * 1), y);
	this.ctx.fill();
	this.ctx.stroke();
	this.ctx.closePath();
};
//# sourceURL=TimeColumnStackChart.js