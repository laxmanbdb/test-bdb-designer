/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: TimeColumnStackChart.js
 * @description TimeColumnStackChart
 **/
function TimeAreaChart(m_chartContainer, m_zIndex) {
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
	//this.m_calculation=new TimeAreaCalculation();
	this.m_xAxis = new TimeAreaXAxis();
	this.m_yAxis = new TimeAreaYAxis();
	this.m_title = new TimeAreaTitle(this);
	this.m_subTitle = new TimeAreaSubTitle();
	this.m_util = new Util();
	this.noOfRows = 1; //used for set x-axis text into two rows in non tilted case.
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;

	// for time series project
	this.m_lineCalculation = [];
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
	this.isSeriesValueWithComma = false;
};

TimeAreaChart.prototype = new Chart();

TimeAreaChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas(); //create draggable div
};

TimeAreaChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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

/***************************************** Setter Methods ******************************************************/

TimeAreaChart.prototype.setFields = function (fieldsJson) {
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

TimeAreaChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	// only one category can be set for line chart, preference to first one
	for (var i = 0; i < 1; i++) {
		this.m_categoryNames[i] = this.getProperAttributeNameValue(categoryJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(categoryJson[i], "DisplayName"));
		this.m_categoryDisplayNames[i] = m_formattedDisplayName;
	}
};

TimeAreaChart.prototype.setSeries = function (seriesJson) {
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

TimeAreaChart.prototype.setSeriesColor = function (m_seriesColor) {
	this.m_seriesColor = m_seriesColor;
};

TimeAreaChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};

TimeAreaChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
	if (this.m_charttype == "timeseries")
		this.m_categoryData = this.setDateFormatForCategory(this.m_categoryData);
	this.CatData = this.m_categoryData;
};

TimeAreaChart.prototype.setDateFormatForCategory = function (categoryData) {
	var tempData = [];
	for (var i = 0; i < categoryData[0].length; i++) {
		if (categoryData[0][i] != "" && categoryData[0][i] != undefined)
			tempData.push(this.getFormattedDate(categoryData[0][i]));
	}
	categoryData[0] = tempData;
	return categoryData;
};

TimeAreaChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0; i < this.getSeriesNames().length; i++) {
		this.m_seriesData[i] = getCommaSeparateSeriesData(this.getDataFromJSON(this.getSeriesNames()[i]));
	}
	this.SerData = this.m_seriesData;
};

TimeAreaChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getCategoryNames()[i]);
	}
	for (var j = 0; j < this.getSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getSeriesNames()[j]);
	}
};

TimeAreaChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

TimeAreaChart.prototype.setColorsForSeries = function () {
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

/***************************************** Getter Methods ******************************************************/

TimeAreaChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

TimeAreaChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};

TimeAreaChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

TimeAreaChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};

TimeAreaChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};

TimeAreaChart.prototype.getSeriesColors = function () {
	return this.m_seriesColors;
};

TimeAreaChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};

TimeAreaChart.prototype.getDataFromJSON = function (fieldName) {
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

TimeAreaChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

TimeAreaChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

TimeAreaChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

TimeAreaChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

TimeAreaChart.prototype.getColorsForSeries = function () {
	return this.m_seriesColorsArray;
};

/**********************************************************************************************************/

TimeAreaChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

TimeAreaChart.prototype.createSVG = function () {
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
	} else {
		$('#svgTimeScaleDiv' + temp.m_objectid).remove();
	}
};

TimeAreaChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.createSVG();
	$("#draggableCanvas" + this.m_objectid).hide();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

TimeAreaChart.prototype.initMouseMoveEvent = function (parentDivObject) {
	if (!IsBoolean(this.m_designMode)) {
		var temp = this;
		parentDivObject = this.m_chartContainer;
		if ('ontouchstart' in document.documentElement) {
			$("#draggableDiv" + temp.m_objectid).bind('touchstart', function (e) {
				var touches = e.originalEvent.touches[0];

				var parentOffsetLeft = $(this)[0].offsetLeft - $(this)[0].scrollLeft;
				var parentOffsetTop = $(this)[0].offsetTop - $(this)[0].scrollTop;

				 mouseX = touches.pageX - parentOffsetLeft;
				 mouseY = touches.pageY - parentOffsetTop;
				 pageX = touches.pageX;
				 pageY = touches.pageY;

			}).bind('touchend', function () {});
		} else {
			$("#draggableDiv" + temp.m_objectid).mousemove(function (e) {
				var offset = $(parentDivObject).offset();

				//tooltip is distorted when border is given for dashboard or dashboard is scrollable

				var parentOffsetLeft = offset.left + $(parentDivObject)[0].clientLeft - $(parentDivObject)[0].scrollLeft;
				var parentOffsetTop = offset.top + $(parentDivObject)[0].clientTop - $(parentDivObject)[0].scrollTop;

				mouseX = e.pageX - ($(this)[0].offsetLeft) * 1 - parentOffsetLeft;
				mouseY = e.pageY - ($(this)[0].offsetTop) * 1 - parentOffsetTop;
				pageX = e.pageX;
				pageY = e.pageY;
			});
		}
	}
};

TimeAreaChart.prototype.initMouseClickEvent = function () {
	if (!IsBoolean(this.m_designMode)) {
		var temp = this;
		var canvas = $('#' + temp.svgContainerId);
		if (canvas != null) {
			if (!IsBoolean(isScaling)) {
				$(canvas)[0].addEventListener("mousemove", function (e) {
					onMouseMove(temp);
				}, false);
			}
			$(canvas)[0].addEventListener("click", function () {
				temp.hideToolTip();
				OnMouseClick(temp);
			}, false);
			$(canvas)[0].addEventListener("touchstart", function (event) {
				OnMouseClick(temp);
			}, false);
			$(canvas)[0].addEventListener("gestureend", function (event) {
				if (IsBoolean(temp.m_showmaximizebutton)
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

			$("#draggableCanvas" + this.m_objectid).bind("taphold", function (e) {
				onMouseMove(temp);
			});
		}
		this.initContextMenuEvent();
	}
};

/***************************************** Initialize Methods ******************************************8************/

TimeAreaChart.prototype.init = function () {
	this.createSVG();
	if (IsBoolean(!this.timeLineSliderFlag)) {
		this.setCategoryData();
		this.setSeriesData();
		this.firstIndex = 0;
		this.lastIndex = this.m_categoryData[0].length - 1;
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

	if (!IsBoolean(this.m_isEmptySeries) && IsBoolean(this.isVisibleSeries())) {
		this.initializeLineSeries();
		this.initializePointSeries();
	}
};

TimeAreaChart.prototype.initializeCalculationClass = function () {
	this.m_lineCalculation = [];
	this.m_lineCalculation[0] = new TimeAreaCalculation();
	this.m_lineCalculation[0].init(this, this.m_categoryData[0], this.seriesMap[0], this.seriesMap, 0, this.m_categoryData);
};

TimeAreaChart.prototype.initializeYAxis = function () {
	this.m_yAxis.init(this, this.m_lineCalculation[0]);
	this.m_xAxis.init(this, this.m_lineCalculation[0]);
};

TimeAreaChart.prototype.initializeLineSeries = function () {
	this.m_lineSeries = [];
	for (var i = 0, k = 0; i < this.seriesMap.length; i++) {
		this.m_yPositionArray = this.m_lineCalculation[i].getYPosition();
		for (var j = 0; j < this.m_seriesDisplayNames.length; j++) {
			if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesDisplayNames[j]])) {
				this.m_lineSeries[this.m_seriesDisplayNames[j]] = new TimeAreaSeries();
				this.m_lineSeries[this.m_seriesDisplayNames[j]].init(this.getColorsForSeries()[j], this.m_lineCalculation[i].getXPosition(), this.m_yPositionArray[k], this.m_linewidth, this);
				k++;
			}
		}
	}
};

TimeAreaChart.prototype.initializePointSeries = function () {
	this.m_pointSeries = [];
	if (IsBoolean(this.getShowPoint()) && this.m_lineCalculation[0].getXPosition().length < 200) {
		for (var i = 0, k = 0; i < this.seriesMap.length; i++) {
			this.m_yPositionArray = this.m_lineCalculation[i].getYPosition();
			for (var j = 0; j < this.m_seriesDisplayNames.length; j++) {
				if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesDisplayNames[j]])) {
					this.m_pointSeries[this.m_seriesDisplayNames[j]] = new TimeAreaPointSeries();
					this.m_pointSeries[this.m_seriesDisplayNames[j]].init(this.m_PointsColorsArray[j], this.m_plotRadiusArray[j], this.m_lineCalculation[i].getXPosition(), this.m_yPositionArray[k], this);
					k++;
				}
			}
		}
	}
};

/***************************************** Drawing Methods ******************************************************/

TimeAreaChart.prototype.draw = function () {
	this.timeLineSliderFlag = false;
	this.init();
	this.drawChart();
	if (this.plugin != undefined && this.plugin != null) {
		this.plugin.initPlugin(this);
	}
};

TimeAreaChart.prototype.drawChart = function () {
	this.drawChartFrame();

	this.drawTitle();
	this.drawSubTitle();
	if ((new Date(this.CatData[0][0]) == "Invalid Date") && this.m_charttype == "timeseries") {
		this.drawMessage("Data is not valid to show in date time scale");
	} else {
		if (!IsBoolean(this.m_isEmptySeries)) {
			if (IsBoolean(this.isVisibleSeries())) {
				this.drawXAxis();
				this.drawYAxis();
				this.drawSVGLines();
				if (IsBoolean(this.getShowPoint()) && this.m_lineCalculation[0].getXPosition().length < 200)
					this.drawSVGPoints();
			} else {
				this.drawMessage("No visible Series Available");
			}
		} else {
			this.drawMessage(this.m_status.noData);
		}
		if (IsBoolean(!this.timeLineSliderFlag)) {
			this.drawLegends();
			this.drawslider();
			this.drawRangeSelector();
			/********* Scale Chart Drawing *****/
			this.scaleFlag = true;
			var oldObject = this;
			var newObject = $.extend(true, {}, oldObject);
			this.init1(newObject);
			this.drawChart1(newObject, this.svgTimeScaleId);
			this.scaleFlag = false;
		}
		if (!this.m_designMode)
			this.timeLineSliderFlag = true;
	}
	this.initMouseClickEvent();
};

TimeAreaChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

TimeAreaChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

TimeAreaChart.prototype.drawXAxis = function () {
	this.m_xAxis.drawVerticalLine();
	this.m_xAxis.markXaxis();
	this.m_xAxis.drawXAxis();
};

TimeAreaChart.prototype.drawYAxis = function () {
	if (IsBoolean(this.m_showmarkerline))
		this.m_yAxis.horizontalMarkerLines();
	this.m_yAxis.markYaxis(0);
	this.m_yAxis.drawYAxis();
};

TimeAreaChart.prototype.drawSVGPoints = function () {
	for (var i = 0; i < this.m_seriesDisplayNames.length; i++) {
		if (this.m_seriesVisibleArr[this.m_seriesDisplayNames[i]]) {
			this.m_pointSeries[this.m_seriesDisplayNames[i]].drawPointSeries(i);
		}
	}
};

TimeAreaChart.prototype.drawSVGLines = function () {
	for (var i = 0; i < this.m_seriesDisplayNames.length; i++) {
		if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesDisplayNames[i]])) {
			this.m_lineSeries[this.m_seriesDisplayNames[i]].drawLineSeries();
		}
	}
};

TimeAreaChart.prototype.drawChartFrame = function () {
	var temp = this;
	if (IsBoolean(this.m_showborder)) {
		$("#draggableDiv" + temp.m_objectid).css('border', '1px solid #BDC3C7');
	}
	$('#' + temp.svgContainerId).empty();
	this.getBGGradientColorToContainer();
};

TimeAreaChart.prototype.drawMessage = function (text) {
	var x = this.m_x * 1 + this.m_width / 2;
	var y = this.m_y * 1 + this.m_height / 2;
	var text = drawSVGText(x, y, text, this.m_statuscolor, "center", "middle", 0);
	text.setAttribute("style", "font-family:"+this.m_statusfontfamily+";font-style:none;font-size:"+this.m_statusfontsize+"px;font-weight:normal;text-decoration:none;");
	$('#' + this.svgContainerId).append(text);
};

TimeAreaChart.prototype.getBGGradientColorToContainer = function () {
	var temp = this;
	var linearGradient = document.createElementNS(NS, 'linearGradient');
	linearGradient.setAttribute("id", "gradient");
	linearGradient.setAttribute("gradientTransform", "rotate(" + this.m_bggradientrotation + ")");
	$('#' + temp.svgContainerId).append(linearGradient);
	var colors = this.getBgGradients().split(',');
	for (var i = 0; i < colors.length; i++) {
		var stop = document.createElementNS(NS, 'stop');
		stop.setAttribute("offset", i * (100 / colors.length) + "%");
		stop.setAttribute("stop-color", colors[i]);
		stop.setAttribute("stop-opacity", this.m_bgalpha);
		$(linearGradient).append(stop);
	}
	var rect = drawSVGRect(0, 0, this.m_width, this.m_height - ((IsBoolean(this.m_showslider)) ? this.sliderMargin : 0), "");
	$(rect).attr("fill", "url(#gradient)");
	$('#' + temp.svgContainerId).append(rect);
};

TimeAreaChart.prototype.getBGGradientColorToScale = function () {
	var temp = this;
	$('#' + temp.svgTimeScaleId).empty();
	var linearGradient1 = document.createElementNS(NS, 'linearGradient');
	linearGradient1.setAttribute("id", "gradient1");
	linearGradient1.setAttribute("gradientTransform", "rotate(" + this.m_bggradientrotation + ")");
	$('#' + temp.svgTimeScaleId).append(linearGradient1);
	var colors1 = this.getBgGradients().split(',');
	for (var i = 0; i < colors1.length; i++) {
		var stop = document.createElementNS(NS, 'stop');
		stop.setAttribute("offset", i * (100 / colors1.length) + "%");
		stop.setAttribute("stop-color", colors1[i]);
		stop.setAttribute("stop-opacity", this.m_bgalpha);
		$(linearGradient1).append(stop);
	}
	var rect1 = drawSVGRect(0, 0, this.m_width, this.sliderMargin, "");
	$(rect1).attr("fill", "url(#gradient1)");
	$('#' + temp.svgTimeScaleId).append(rect1);
};

/***************************************** End Drawing  ******************************************8************/

TimeAreaChart.prototype.getDataPointAndUpdateGlobalVariable = function (mouseX, mouseY) {
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory)))) {
		var xPositionArr = this.m_lineCalculation[0].getXPosition();
		var yAxisDataArray = this.m_lineCalculation[0].getYPosition();
		var seriesColors = this.getSeriesColors();
		var dataPointRadius = 5;
		if ((mouseX >= this.getStartX() && mouseX <= this.getEndX()) && (mouseY <= this.getStartY() && mouseY >= this.getEndY())) {
			for (var i = 0; i < xPositionArr.length; i++) {
				if (mouseX <= (xPositionArr[i] * 1 + dataPointRadius * 1) && mouseX >= (xPositionArr[i] * 1 - dataPointRadius * 1)) {
					for (var j = 0; j < yAxisDataArray.length; j++) {
						if (mouseY <= (yAxisDataArray[j][i] * 1 + dataPointRadius * 1) && mouseY >= (yAxisDataArray[j][i] * 1 - dataPointRadius * 1)) {
							var fieldNameValueMap = this.getFieldNameValueMap(i);
							var drillColor = seriesColors[j];
							var drillField = this.getSeriesNames()[j];
							var drillDisplayField = this.getSeriesDisplayNames()[j];
							var drillValue = fieldNameValueMap[drillField];
							fieldNameValueMap.drillField = drillField;
							fieldNameValueMap.drillDisplayField = drillDisplayField;
							fieldNameValueMap.drillValue = drillValue;
							this.updateDataPoints(fieldNameValueMap, drillColor);
							break;
						}
					}
				}
			}
		}
	}
};

TimeAreaChart.prototype.drawTooltip = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && !this.m_designMode) {
		var chart_data = this.getToolTipData(mouseX, mouseY);
		if (((chart_data || "") != "") && (chart_data != {}) && chart_data.data.length > 0) {
			var tooltipContent = "<table class=\" chart-tooltip toolTip\">";
			tooltipContent += "<tr>";
			tooltipContent += "<td colspan=\"2\" class=\"chart-tooltip-head\">";
			tooltipContent += chart_data.cat;
			tooltipContent += "</td>";
			tooltipContent += "</tr>";
			for (var i = 0; i < chart_data.data.length; i++) {
				tooltipContent += "<tr>";
				tooltipContent += "<td><span style=\"background-color:" + chart_data.data[i][2] + "; width:10px;height:10px;\"></span>" + chart_data.data[i][0] + "</td>";
				tooltipContent += "<td align=\"right\">" + chart_data.data[i][1] + "</td>";
				tooltipContent += "</tr>";
			}
			tooltipContent += "</table>";
			this.getToolTip(tooltipContent);
		} else {
			this.hideToolTip();
		}
	}
};

TimeAreaChart.prototype.getToolTipData = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && (IsBoolean(this.m_showtooltip)) && (!IsBoolean(this.isEmptyCategory))) {
		var toolTipData;
		this.xPositions = this.m_lineCalculation[0].getXPosition();
		this.yPositions = this.m_lineCalculation[0].getYPosition();
		var flag1 = false;
		var m_precision = (this.m_precision == 0) ? 4 : this.m_precision;
		var dataPointRadius = 5;
		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			for (var i = 0; i < this.xPositions.length; i++) {

				if (mouseX <= (this.xPositions[i] * 1 + dataPointRadius) && (mouseX >= this.xPositions[i] * 1 - dataPointRadius)) {
					toolTipData = {
						cat : "",
						data : []
					};
					var seriesData = (this.getSeriesData());
					toolTipData.cat = "";
					toolTipData["data"] = new Array();
					toolTipData.cat = this.getCategoryData()[0][i];
					//this.m_yAxis.getFormattedText(seriesData);
					for (var j = 0, k = 0; j < this.getSeriesData().length; j++) {
						var newVal;
						if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesDisplayNames[j]])) {
							var data = [];
							data[0] = this.getSeriesDisplayNames()[j];
							if (seriesData[j][i] == "" || isNaN(seriesData[j][i]) || seriesData[j][i] == null || seriesData[j][i] == "null") {
								newVal = seriesData[j][i];
								flag1 = true;
							} else {
								var num = seriesData[j][i] * 1;
								if (num % 1 != 0) {
									newVal = num.toFixed(m_precision);
								} else {
									newVal = seriesData[j][i];
								}
							}
							var FormterData = (IsBoolean(flag1)) ? (newVal) : (this.getFormatterForToolTip(newVal));
							//if(!IsBoolean(this.m_displaySeriesDataFlag[j][i]))
							//   FormterData = this.getNumberWithCommas(FormterData);

							data[1] = FormterData;
							data[2] = this.getSeriesColors()[j];

							if (IsBoolean(this.m_controlledtooltip)) {
								if (FormterData !== "")
									toolTipData.data.push(data);
							} else {
								toolTipData.data[k] = data;
								k++;
							}
						}
					}
					break;
				}
			}
		} else {
			this.hideToolTip();
		}
		return toolTipData;
	}
};

TimeAreaChart.prototype.getFormatterForToolTip = function (data) {
	var dataWithFormatter = data;
	if (IsBoolean(this.m_yAxis.getLeftaxisFormater()))
		dataWithFormatter = this.m_yAxis.getFormattedText(data);
	if ((IsBoolean(this.m_secondaryaxisshow)) && (IsBoolean(this.m_yAxis.getRightAxisFormater())))
		dataWithFormatter = this.m_yAxis.getSecondaryAxisFormattedText(data);
	return dataWithFormatter;

};

/**************************** Drawing for Scale Chart ******************************************/

TimeAreaChart.prototype.init1 = function (temp) {
	temp.m_y = 0;
	this.tempTitle = temp.m_title.m_showtitle;
	this.tempSubTitle = temp.m_subTitle.m_showsubtitle;
	temp.m_height = this.sliderMargin;
	temp.m_linewidth = 2;
	temp.m_title.m_showtitle = false;
	temp.m_subTitle.m_showsubtitle = false;
	temp.m_showmaximizebutton = false;
	temp.m_showgradient = false;
	temp.m_showrangeselector = false;
	temp.setCategoryData();
	temp.setSeriesData();

	temp.setAllFieldsName();
	temp.setAllFieldsDisplayName();
	temp.setColorsForSeries();
	temp.calculateSeriesMap(this.SerData);
	temp.initializeCalculationClass();
	if (!IsBoolean(temp.m_isEmptySeries))
		temp.initializeScaleLine();
};

TimeAreaChart.prototype.drawChart1 = function (temp) {
	this.getBGGradientColorToScale();
	if (!IsBoolean(this.m_isEmptySeries)) {
		if ((new Date(this.CatData[0][0]) == "Invalid Date") && this.m_charttype == "timeseries") {}
		else
			temp.drawScaleLines();
	} else {
		//this.drawMessage(this.m_status.noData);
	}
	this.m_title.m_showtitle = this.tempTitle;
	this.m_subTitle.m_showsubtitle = this.tempSubTitle;
};

TimeAreaChart.prototype.initializeScaleLine = function () {
	this.m_lineSeries = [];
	for (var i = 0, k = 0; i < this.seriesMap.length; i++) {
		this.m_yPositionArray = this.m_lineCalculation[i].getYPosition();
		for (var j = 0; j < this.m_seriesDisplayNames.length; j++) {
			if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesDisplayNames[j]])) {
				this.m_lineSeries[this.m_seriesDisplayNames[j]] = new TimeAreaSeries();
				this.m_lineSeries[this.m_seriesDisplayNames[j]].init(this.getColorsForSeries()[j], this.m_lineCalculation[i].getXPosition(), this.m_yPositionArray[k], this.m_linewidth, this);
				k++;
			}
		}
	}
};

TimeAreaChart.prototype.drawScaleLines = function () {
	for (var i = 0; i < this.m_seriesDisplayNames.length; i++) {
		if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesDisplayNames[i]]))
			this.m_lineSeries[this.m_seriesDisplayNames[i]].drawLineSeries();
	}
};

/**************************** End Scale Chart ******************************************/

TimeAreaChart.prototype.updateSeriesData = function (min, max) {
	var cat = [];
	var ser = [];
	cat[0] = [];
	for (var i = 0; i < this.SerData.length; i++) {
		ser[i] = [];
		for (var j = min; j <= max; j++) {
			if (i == 0) {
				cat[i].push(this.CatData[i][j]);
			}
			ser[i].push(this.SerData[i][j]);
		}
	}
	this.firstIndex = min;
	this.lastIndex = max;
	this.m_categoryData = cat;
	this.m_seriesData = ser;
};
/***************  RangeSelector drawing in Chart.js ********************/
/***************  Slider drawing in Chart.js ********************/

/****************************Some Initial Calculation*****************************/

TimeAreaChart.prototype.calculateSeriesMap = function (seriesData) {
	this.seriesMap = [];
	this.seriesMap[0] = seriesData;
};

TimeAreaChart.prototype.calculateStartXMarginForYAxes = function () {
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

TimeAreaChart.prototype.getStartX = function () {
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

TimeAreaChart.prototype.getYAxisLabelMargin = function () {
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

TimeAreaChart.prototype.getLabelFormatterMargin = function () {
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

TimeAreaChart.prototype.getLabelWidth = function () {
	var lw = 0;
	var maxSeriesVal = this.getMaximumSeriesValue();

	if (this.m_charttype == "100%") {
		maxSeriesVal = 100;
	} else {
		var maxDivisor = getMax(maxSeriesVal);
		maxSeriesVal = maxDivisor[0];
	}
	this.ctx.beginPath();
	this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.m_yAxis.m_labelfontsize + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
	lw = this.ctx.measureText(maxSeriesVal).width;
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

TimeAreaChart.prototype.getLabelSignMargin = function () {
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

TimeAreaChart.prototype.getLabelPrecisionMargin = function () {
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

TimeAreaChart.prototype.getMinimumSeriesValue = function () {
	var minSeriesVal = 0;
	for (var i = 0; i < this.m_seriesData.length; i++) {
		for (var j = 0; j < this.m_seriesData[i].length; j++) {
			var data = this.m_seriesData[i][j];
			data = (isNaN(data) || data == undefined || data == "") ? 0 : data;
			if (i == 0 && j == 0) {
				minSeriesVal = data;
			}
			if (minSeriesVal * 1 > data * 1) {
				minSeriesVal = data;
			}
		}
	}
	return minSeriesVal;
};

TimeAreaChart.prototype.getMaximumSeriesValue = function () {
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

TimeAreaChart.prototype.getLabelSecondFormatterMargin = function () {
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

TimeAreaChart.prototype.getEndX = function () {
	var textmargin = 50;
	var chartXMargin = textmargin * (Math.floor(this.seriesMap.length / 2));
	var endX = (this.m_x * 1) + (this.m_width * 1) - (chartXMargin) - 30;

	return endX;
};

TimeAreaChart.prototype.getStartY = function () {
	var chartYMargin = 5;
	this.m_startY = (this.m_y * 1) + (this.m_height * 1) - chartYMargin - this.getXAxisLabelMargin() - this.getXAxisDescriptionMargin() - this.getHorizontalLegendMargin() - ((IsBoolean(this.m_showslider)) ? this.sliderMargin : 0);
	if (this.scaleFlag)
		return parseInt(this.m_y) + parseInt(this.m_height) - 18;
	else
		return this.m_startY;
};

TimeAreaChart.prototype.getXAxisLabelMargin = function () {
	var xAxislabelDescMargin = 15;
	this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.m_xAxis.getLabelFontSize() + "px " + this.m_xAxis.getLabelFontFamily();
	var xlm = this.m_xAxis.m_labelfontsize * 1.5;
	this.noOfRows = 1;
	xAxislabelDescMargin = (xlm) * this.noOfRows;
	return xAxislabelDescMargin;
};

TimeAreaChart.prototype.setNoOfRows = function () {
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

TimeAreaChart.prototype.getXAxisDescriptionMargin = function () {
	var xAxisDescriptionMargin = 2;
	if (this.m_xAxis.getDescription() != "") {
		xAxisDescriptionMargin = this.m_xAxis.getFontSize() * 1.5;
	}
	return xAxisDescriptionMargin;
};

TimeAreaChart.prototype.getEndY = function () {
	return (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1 + this.getRangeSelectorMargin() * 1);
};

TimeAreaChart.prototype.getMarginForTitle = function () {
	var margin;

	if ((!IsBoolean(this.getShowGradient())) && (!IsBoolean(this.m_showmaximizebutton)) && (!IsBoolean(this.getTitle().m_showtitle)))
		margin = 15;
	else
		margin = 40;
	return margin;
};

TimeAreaChart.prototype.getMarginForSubTitle = function () {
	var margin;
	if (IsBoolean(this.m_subTitle.m_showsubtitle))
		margin = (this.m_subTitle.getDescription() != "") ? (this.m_subTitle.getFontSize() * 1.5) : 10;
	else
		margin = 0;
	return margin;
};

TimeAreaChart.prototype.getRangeSelectorMargin = function () {
	if (IsBoolean(this.m_showrangeselector) && this.m_charttype == "timeseries")
		return this.rangedSelectorMargin;
	else
		return 0;
};

/******************************************************************************************************/

TimeAreaChart.prototype.getFieldNameValueMap = function (i) {
	var m_fieldNameValueMap = new Object();
	for (var l = 0; l < this.getAllFieldsName().length; l++) {
		m_fieldNameValueMap[this.getAllFieldsName()[l]] = this.getDataProvider()[i][this.getAllFieldsName()[l]];
	}
	return m_fieldNameValueMap;
};

/**************** *************************   Line Calculation   ************************/

function TimeAreaCalculation() {
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

TimeAreaCalculation.prototype.init = function (lineRef, xAxisData, yAxisData, allSeriesMap, index, allCategories) {
	this.m_chart = lineRef;
	this.index = index;
	this.m_allSeriesMap = allSeriesMap;
	this.startX = this.m_chart.getStartX();
	this.endX = this.m_chart.getEndX();
	this.startY = this.m_chart.getStartY();
	this.endY = this.m_chart.getEndY();

	this.xAxisData = xAxisData;
	this.yAxisData = this.m_chart.getVisibleSeriesData(yAxisData);

	this.calculateMinimumMaximum();
	this.calculateMinMaxCategory(allCategories);
};

TimeAreaCalculation.prototype.calculateMinimumMaximum = function () {
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

TimeAreaCalculation.prototype.getMaxValue = function () {
	return this.max;
};

TimeAreaCalculation.prototype.getMinValue = function () {
	return this.min;
};

TimeAreaCalculation.prototype.getYAxisText = function () {
	this.getMaxValue();
	return this.yAxisText;
};

TimeAreaCalculation.prototype.getYAxisMarkersArray = function () {
	return this.m_yAxisMarkersArray;
};

TimeAreaCalculation.prototype.getEachLinePix = function () {
	this.eachLinePix = (this.startY * 1 - this.endY * 1) / (this.getMaxValue() - this.getMinValue());
	return this.eachLinePix;
};
TimeAreaCalculation.prototype.getXAxisDiv = function () {
	this.xAxisDiv = (this.endX - this.startX) / (this.xAxisData.length - 1);
	return this.xAxisDiv;
};

TimeAreaCalculation.prototype.setMarginX = function () {
	if (this.index <= Math.ceil(this.m_allSeriesMap.length / 2)) {
		this.marginX = this.index;
	} else {}
};

TimeAreaCalculation.prototype.calculateMinMaxCategory = function (allCategories) {
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

TimeAreaCalculation.prototype.getYPosition = function () {
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

TimeAreaCalculation.prototype.getXAxisPixelRatio = function () {
	if (this.m_chart.m_charttype == "timeseries")
		var xaxisRatio = (this.endX - this.startX) / (new Date(this.maxDate).getTime() - new Date(this.minDate).getTime());
	else
		var xaxisRatio = (this.endX - this.startX) / (this.xAxisData.length - 1);

	return xaxisRatio;
};

TimeAreaCalculation.prototype.getXPosition = function () {
	this.xPositionArray = [];
	for (var i = 0; i < this.xAxisData.length; i++) {
		if (this.m_chart.m_charttype == "timeseries") {
			if (this.xAxisData.length == 1) {
				this.xPositionArray[i] = (this.startX * 1) + (this.endX - this.startX) / 2;
			} else {
				if (this.xAxisData[i] != "")
					this.xPositionArray[i] = this.startX * 1 + ((new Date(this.xAxisData[i]).getTime() - new Date(this.minDate).getTime()) * this.getXAxisPixelRatio());
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

TimeAreaCalculation.prototype.getXAxisMarkersArray = function () {
	if (this.m_chart.m_charttype == "timeseries") {
		this.setXAxisMarkerForTimeLine();
	} else {
		this.setXAxisMarkerforAdvanceLine();
	}
	return this.m_xAxisMarkersArray;
};

TimeAreaCalculation.prototype.setXAxisMarkerforAdvanceLine = function () {
	if (this.xAxisData.length == 1) {
		this.m_xAxisMarkersArray = [];
		this.xPositionForMarker = [];
		this.m_xAxisMarkersArray[0] = this.xAxisData[0];
		this.xPositionForMarker[0] = (this.startX * 1) + (this.endX - this.startX) / 2;
	} else {
		var stepValue = 1;
		if (this.xAxisData.length > 10)
			stepValue = Math.ceil(this.xAxisData.length / 10);
		var stepWidth = (this.endX - this.startX) / (this.xAxisData.length - 1);

		this.m_xAxisMarkersArray = [];
		this.xPositionForMarker = [];
		var noOfMarker = this.xAxisData.length;
		for (var i = 0; i < noOfMarker; ) {
			var x = parseInt(this.startX) + (stepWidth * (i));
			this.m_xAxisMarkersArray.push(this.xAxisData[i]);
			this.xPositionForMarker.push(x);
			i = ((i * 1) + stepValue);
		}
	}
};

TimeAreaCalculation.prototype.getXAxisPositionForMarkers = function () {
	return this.xPositionForMarker;
};

/*******Calculation for TimeSeries Scale**********/

TimeAreaCalculation.prototype.setXAxisMarkerForTimeLine = function () {
	if (this.xAxisData.length == 1) {
		this.m_xAxisMarkersArray = [];
		this.xPositionForMarker = [];
		this.m_xAxisMarkersArray[0] = this.xAxisData[0];
		this.xPositionForMarker[0] = (this.startX * 1) + (this.endX - this.startX) / 2;
	} else {

		this.dataFrequency = (this.xAxisData.length > 1) ? this.getDataFrequency(this.xAxisData[0], this.xAxisData[1]) : "year";
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
				xPositionArr.push(this.startX * 1 + ((i - new Date(this.minDate).getTime()) * this.getXAxisPixelRatio()));
			}
			i = data.index;
		}
		this.m_xAxisMarkersArray = xAxisArr;
		this.xPositionForMarker = xPositionArr;
	}
};

TimeAreaCalculation.prototype.getDateData = function () {
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
	return (Math.floor((days > 0) ? days : 1));
};

TimeAreaCalculation.prototype.getDataFrequency = function (date1, date2) {
	var date1 = new Date(isNaN(date1) ? date1 : date1 * 1);
	var date2 = new Date(isNaN(date2) ? date2 : date2 * 1);
	var diff = Math.abs(Math.floor(date1.getTime() - date2.getTime()));
	var day = 1000 * 60 * 60 * 24;
	var hour = 1000 * 60 * 60;
	var minute = 1000 * 60;

	var days = Math.floor(diff / day);
	var months = Math.floor(days / 28);
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

TimeAreaCalculation.prototype.getTimeLineMarkerFormateAndStep = function (days) {
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

TimeAreaCalculation.prototype.getFormateAndStepsforYear = function (days) {
	if (days < 2920)
		return {
			formate : "year",
			step : 1
		};
	else if (days >= 2920 && days < 5840) {
		return {
			formate : "year",
			step : 2
		};
	} else if (days >= 5840 && days < 14600) {
		return {
			formate : "year",
			step : 5
		};
	} else if (days >= 14600 && days < 29200) {
		return {
			formate : "year",
			step : 10
		};
	} else
		return {
			formate : "year",
			step : 25
		};
};

TimeAreaCalculation.prototype.getFormateAndStepsforMonth = function (days) {
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
	} else if (days >= 2920 && days < 5840) {
		return {
			formate : "year",
			step : 2
		};
	} else if (days >= 5840 && days < 14600) {
		return {
			formate : "year",
			step : 5
		};
	} else
		return {
			formate : "year",
			step : 10
		};
};

TimeAreaCalculation.prototype.getFormateAndStepsforDay = function (days) {
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

TimeAreaCalculation.prototype.getFormateAndStepsforMin = function (days) {
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

TimeAreaCalculation.prototype.getFormateAndStepsforHour = function (days) {
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
			step : 5
		};
};

TimeAreaCalculation.prototype.getNextMonthIndex = function (date, index, steps) {
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

TimeAreaCalculation.prototype.getNextYearIndex = function (year, index, steps) {
	var day = 1000 * 60 * 60 * 24;
	for (var i = 0; i < steps; i++) {
		index = (index * 1) + (((IsBoolean(isLeapYear(year * 1 + i * 1))) ? 366 : 365) * day);
	}
	return index;
};

TimeAreaCalculation.prototype.getFormattedDateTime = function (data, formate, steps) {
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
			if (data * 1 < 0)
				return {
					textData : "",
					index : (data * 1 + days * day)
				};
			else
				return {
					textData : "",
					index : (days * day)
				};
	}
};

/**************************Dynamic Scale for TimeSeries****************************************/

/********************** TimeAreaSeries *********************************/

function TimeAreaSeries() {
	this.color;
	this.width;
	this.xPositionArray = [];
	this.yPositionArray = [];
	this.line = [];
	this.ctx = "";
	this.m_chart = "";
};

TimeAreaSeries.prototype.init = function (color, xPositionArray, yPositionArray, width, m_chart) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.color = color;
	this.width = width;
	this.xPositionArray = xPositionArray;
	this.yPositionArray = yPositionArray;
};

TimeAreaSeries.prototype.drawLineSeries = function () {
	if (this.m_chart.m_lineform == "curve" && this.xPositionArray.length < 500)
		this.drawSplines();
	else
		this.drawSegmentLines();
};

TimeAreaSeries.prototype.drawSegmentLines = function () {
	var temp = this;
	var x_pixel = this.xPositionArray;
	var y_pixel = this.yPositionArray;
	var id = (!temp.m_chart.scaleFlag) ? temp.m_chart.svgContainerId : temp.m_chart.svgTimeScaleId;

	var path = this.pathString(x_pixel, y_pixel, temp.m_chart.getStartY());
	for (var j = 0; j < path.length; j++) {
		var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		newLine.setAttribute('d', path[j]);
		newLine.setAttribute('style', 'stroke:' + temp.color[0] + '; stroke-width:' + temp.width + ';fill:' + hex2rgb(temp.color[0], 0.6) + ';');
		$('#' + id).append(newLine);
	}
};

/*creates and adds an SVG path without defining the nodes*/

TimeAreaSeries.prototype.createPath = function (color, width) {
	width = (typeof width == 'undefined' ? "2" : width);
	var P = document.createElementNS("http://www.w3.org/2000/svg", "path");
	P.setAttributeNS(null, "fill", hex2rgb(color, 0.6));
	P.setAttributeNS(null, "stroke", color);
	P.setAttributeNS(null, "stroke-width", width);
	return P;
};

/*computes spline control points*/

TimeAreaSeries.prototype.drawSplines = function () {
	/*computes control points p1 and p2 for x and y direction*/
	var temp = this;
	var px = this.computeControlPoints(this.xPositionArray);
	var py = this.computeControlPoints(this.yPositionArray);
	var id = (!temp.m_chart.scaleFlag) ? temp.m_chart.svgContainerId : temp.m_chart.svgTimeScaleId;

	/*updates path settings, the browser will draw the new spline*/
	var attributeD = "";
	for (var i = 0; i < (px.p1.length); i++) {
		attributeD += this.createBezierPath(this.xPositionArray[i], this.yPositionArray[i], px.p1[i], py.p1[i], px.p2[i], py.p2[i], this.xPositionArray[i + 1], this.yPositionArray[i + 1], i, temp.m_chart.getStartY(), (px.p1.length - 1));
	}
	if (attributeD != undefined || attributeD != "") {
		//		var path=this.createPath(this.color[0],this.width);
		//		path.setAttributeNS(null,"d",attributeD);
		//		$("#"+id).append(path);
		var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		newLine.setAttribute('d', attributeD);
		newLine.setAttribute('style', 'stroke:' + temp.color[0] + '; stroke-width:' + temp.width + ';fill:' + hex2rgb(temp.color[0], 0.6) + ';');
		$('#' + id).append(newLine);
	}
};

/*creates formated path string for SVG cubic path element*/

TimeAreaSeries.prototype.createBezierPath = function (x1, y1, px1, py1, px2, py2, x2, y2, index, startY, last) {
	if (x1 != "" && y1 != "" && px1 != "" && py1 != "" && px2 != "" && py2 != "" && x2 != "" && y2 != "") {
		if (index == 0)
			return "M " + x1 + " " + startY + "L " + x1 + " " + y1 + " C " + px1 + " " + py1 + " " + px2 + " " + py2 + " " + x2 + " " + y2;
		else if (index == last)
			return "L " + x1 + " " + y1 + " C " + px1 + " " + py1 + " " + px2 + " " + py2 + " " + x2 + " " + y2 + "L " + x2 + " " + startY;
		else
			return "L " + x1 + " " + y1 + " C " + px1 + " " + py1 + " " + px2 + " " + py2 + " " + x2 + " " + y2;
	} else
		return;
};

/*computes control points given knots K, this is the brain of the operation*/

TimeAreaSeries.prototype.computeControlPoints = function (K) {
	var p1 = new Array();
	var p2 = new Array();
	var n = K.length - 1;

	/*rhs vector*/
	var a = new Array();
	var b = new Array();
	var c = new Array();
	var r = new Array();

	/*left most segment*/
	a[0] = 0;
	b[0] = 2;
	c[0] = 1;
	r[0] = K[0] + 2 * K[1];

	/*internal segments*/
	for (var i = 1; i < n - 1; i++) {
		a[i] = 1;
		b[i] = 4;
		c[i] = 1;
		r[i] = 4 * K[i] + 2 * K[i + 1];
	}

	/*right segment*/
	a[n - 1] = 2;
	b[n - 1] = 7;
	c[n - 1] = 0;
	r[n - 1] = 8 * K[n - 1] + K[n];

	/*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
	for (var i = 1; i < n; i++) {
		var m = a[i] / b[i - 1];
		b[i] = b[i] - m * c[i - 1];
		r[i] = r[i] - m * r[i - 1];
	}

	p1[n - 1] = r[n - 1] / b[n - 1];
	for (var i = n - 2; i >= 0; --i)
		p1[i] = (r[i] - c[i] * p1[i + 1]) / b[i];

	/*we have p1, now compute p2*/
	for (var i = 0; i < n - 1; i++)
		p2[i] = 2 * K[i + 1] - p1[i + 1];

	p2[n - 1] = 0.5 * (K[n] + p1[n - 1]);

	return {
		p1 : p1,
		p2 : p2
	};
};

TimeAreaSeries.prototype.pathString = function (xPixelArr, yPixelArr, startY) {
	var path = [];
	var str = "";
	var k = 0;
	for (var i = 0; i < xPixelArr.length; i++) {
		if (yPixelArr[i] == "") {
			k = 0;
			if (str != "")
				path.push(str);
			str = "";
		}
		if (k == 0) {
			if (yPixelArr[i] != "") {
				str += "M" + xPixelArr[i] + "," + startY + "L" + xPixelArr[i] + "," + yPixelArr[i];
				//str+="M"+xPixelArr[i]+","+ yPixelArr[i];
				k++;
			}

		} else if (i == (xPixelArr.length - 1))
			str += "L" + xPixelArr[i] + "," + yPixelArr[i] + "L" + xPixelArr[i] + "," + startY;
		else {
			str += "L" + xPixelArr[i] + "," + yPixelArr[i];
		}
	}
	if (str != "")
		path.push(str);
	return path;
};

/**********************TimeAreaPointSeries*********************************/

function TimeAreaPointSeries() {
	this.color;
	this.radius;
	this.xPositionArray = [];
	this.yPositionArray = [];
	this.point = [];
	this.ctx = "";
	this.m_chart = "";
};

TimeAreaPointSeries.prototype.init = function (color, radius, xPositionArray, yPositionArray, m_chart) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.color = color;
	this.m_chart = m_chart;
	this.radius = radius;
	this.xPositionArray = xPositionArray;
	this.yPositionArray = yPositionArray;
	for (var i = 0; i < this.xPositionArray.length; i++) {
		this.point[i] = new TimeAreaPoint();
		this.point[i].init(this.color[i], this.radius, this.xPositionArray[i], this.yPositionArray[i], this.ctx, this.m_chart);
	}
};

TimeAreaPointSeries.prototype.isInRange = function (i) {
	if (this.yPositionArray[i] > this.m_chart.getStartY() || this.yPositionArray[i] < this.m_chart.getEndY())
		return true;
	else
		return false;
};

TimeAreaPointSeries.prototype.drawPointSeries = function (seriesIndex) {
	for (var i = 0; i < this.xPositionArray.length; i++) {
		if (!this.isInRange(i))
			this.point[i].drawPoint(i, seriesIndex);
	}
};

/*************************** TimeAreaPoint**********************************************/

function TimeAreaPoint() {
	this.base = Point;
	this.base();
};

TimeAreaPoint.prototype = new Point;

TimeAreaPoint.prototype.getSeriesDataForTooltip = function (seriesData, categoryIndex, seriesIndex) {
	var serArr = [];
	for (var i = 0; i < seriesData.length; i++) {
		serArr.push(seriesData[i][categoryIndex]);
	}
	return serArr;
};

TimeAreaPoint.prototype.drawPoint = function (categoryIndex, seriesIndex) {
	switch (this.m_chart.m_plotShapeArray[seriesIndex]) {
	case "point":
		this.drawCircle(categoryIndex, seriesIndex);
		break;
	case "cross":
		this.drawCross(categoryIndex, seriesIndex);
		break;
	case "cube":
		this.drawCube(categoryIndex, seriesIndex);
		break;
	case "star":
		this.drawStar(categoryIndex, seriesIndex);
		break;
	case "triangle":
		this.drawTriangle(categoryIndex, seriesIndex);
		break;
	case "quad":
		this.drawQuad(categoryIndex, seriesIndex);
		break;
	case "polygon":
		this.drawHexagon(categoryIndex, seriesIndex);
		break;
	default:
		this.drawCircle(categoryIndex, seriesIndex);
		break;
	}
};

TimeAreaPoint.prototype.drawStar = function (categoryIndex, seriesIndex) {
	var temp = this;
	var cx = this.xPosition;
	var cy = this.yPosition;
	var r1 = this.radius;
	var r0 = this.radius / 2;
	var spikes = 5;

	var rot = Math.PI / 2 * 3;
	var x = cx;
	var y = cy;
	var step = Math.PI / spikes;

	var d = 'M' + (cx * 1) + ' ' + (cy - r0);
	for (var i = 0; i < spikes; i++) {
		x = cx * 1 + Math.cos(rot) * r0;
		y = cy * 1 + Math.sin(rot) * r0;
		d += ' L' + (x) + ' ' + (y);
		rot = rot * 1 + step * 1;

		x = cx * 1 + Math.cos(rot) * r1;
		y = cy * 1 + Math.sin(rot) * r1;
		d += ' L' + (x) + ' ' + (y);
		rot = rot * 1 + step * 1;
	}
	d += ' L' + (cx) + ' ' + (cy - r0);
	var newLine = document.createElementNS(NS, 'path');
	newLine.setAttribute('d', d);

	newLine.setAttributeNS(null, "stroke", this.color);
	newLine.setAttributeNS(null, "stroke-width", 3);
	newLine.setAttributeNS(null, "fill", this.color);
	$("#" + temp.m_chart.svgContainerId).append(newLine);
};

TimeAreaPoint.prototype.drawHexagon = function (categoryIndex, seriesIndex) {
	var temp = this;
	var x = this.xPosition;
	var y = this.yPosition;
	var radius = this.radius;
	var sides = 6;
	var a = (Math.PI * 2) / sides;
	var d = 'M' + (radius * 1) + ' ' + (0);
	for (var i = 1; i <= sides; i++) {
		d += ' L' + (radius * Math.cos(a * i)) + ' ' + (radius * Math.sin(a * i));
	}
	var newLine = document.createElementNS(NS, 'path');
	newLine.setAttribute('transform', 'translate(' + x + ',' + y + ')');
	newLine.setAttribute('d', d);
	newLine.setAttributeNS(null, "stroke", this.color);
	newLine.setAttributeNS(null, "stroke-width", 3);
	newLine.setAttributeNS(null, "fill", this.color);

	$("#" + temp.m_chart.svgContainerId).append(newLine);
};

TimeAreaPoint.prototype.drawCross = function (categoryIndex, seriesIndex) {
	var temp = this;
	var d = 'M' + (this.xPosition * 1 - this.radius * 1) + ' ' + (this.yPosition * 1 - this.radius * 1) +
		' L' + (this.xPosition * 1 + this.radius * 1) + ' ' + (this.yPosition * 1 + this.radius * 1) +
		' M' + (this.xPosition * 1 + this.radius * 1) + ' ' + (this.yPosition * 1 - this.radius * 1) +
		' L' + (this.xPosition * 1 - this.radius * 1) + ' ' + (this.yPosition * 1 + this.radius * 1);
	var newLine = document.createElementNS(NS, 'path');
	newLine.setAttribute('d', d);
	newLine.setAttributeNS(null, "stroke", this.color);
	newLine.setAttributeNS(null, "stroke-width", 3);
	newLine.setAttributeNS(null, "fill", this.color);

	$("#" + temp.m_chart.svgContainerId).append(newLine);
};

TimeAreaPoint.prototype.drawTriangle = function (categoryIndex, seriesIndex) {
	var temp = this;
	var d = 'M' + (this.xPosition * 1) + ' ' + (this.yPosition * 1 - this.radius * 1) +
		' L' + (this.xPosition * 1 + this.radius * 1) + ' ' + (this.yPosition * 1 + this.radius * 1) +
		' L' + (this.xPosition * 1 - this.radius * 1) + ' ' + (this.yPosition * 1 + this.radius * 1) +
		' L' + (this.xPosition * 1) + ' ' + (this.yPosition * 1 - this.radius * 1);
	var newLine = document.createElementNS(NS, 'path');
	newLine.setAttribute('d', d);
	newLine.setAttributeNS(null, "stroke", this.color);
	newLine.setAttributeNS(null, "fill", this.color);

	$("#" + temp.m_chart.svgContainerId).append(newLine);
};

TimeAreaPoint.prototype.drawQuad = function (categoryIndex, seriesIndex) {
	var temp = this;
	var angle = 45;
	this.ctx.lineTo(this.xPosition * 1, this.yPosition * 1 - this.m_plotradius * 1);

	var newRect = document.createElementNS(NS, "rect");
	newRect.setAttributeNS(null, 'x', this.xPosition - this.radius);
	newRect.setAttributeNS(null, 'y', this.yPosition - this.radius);
	newRect.setAttributeNS(null, 'height', 2 * this.radius);
	newRect.setAttributeNS(null, 'width', 2 * this.radius);
	newRect.setAttribute('transform', 'rotate(' + angle + ' ' + this.xPosition + ',' + this.yPosition + ')');
	newRect.setAttributeNS(null, "stroke", this.color);
	newRect.setAttributeNS(null, "fill", this.color);

	$("#" + temp.m_chart.svgContainerId).append(newRect);
};

TimeAreaPoint.prototype.drawCube = function (categoryIndex, seriesIndex) {
	var temp = this;
	var newRect = document.createElementNS(NS, "rect");
	newRect.setAttributeNS(null, 'x', this.xPosition - this.radius);
	newRect.setAttributeNS(null, 'y', this.yPosition - this.radius);
	newRect.setAttributeNS(null, 'height', 2 * this.radius);
	newRect.setAttributeNS(null, 'width', 2 * this.radius);
	newRect.setAttributeNS(null, 'fill', this.color);
	newRect.setAttributeNS(null, "stroke", this.color);
	newRect.setAttributeNS(null, "fill", this.color);

	$("#" + temp.m_chart.svgContainerId).append(newRect);
};

TimeAreaPoint.prototype.drawCircle = function (categoryIndex, seriesIndex) {
	var temp = this;
	var svgCircle = document.createElementNS('http://www.w3.org/2000/svg', "circle");
	svgCircle.setAttributeNS(null, "cx", this.xPosition);
	svgCircle.setAttributeNS(null, "cy", this.yPosition);
	svgCircle.setAttributeNS(null, "r", this.radius);
	svgCircle.setAttributeNS(null, "stroke", this.color);
	svgCircle.setAttributeNS(null, "fill", this.color);

	$("#" + temp.m_chart.svgContainerId).append(svgCircle);
};

TimeAreaPoint.prototype.drawTooltip = function (evt, seriesData, catData, serName, CatName, id, componentWidth, seriesColor) {
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
					tooltipContent += "<td align=\"right\">" + (1 * seriesData[i]).toFixed(2) + "</td>";
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

/************************* Title ************************************/

function TimeAreaTitle(m_chart) {
	this.base = Title;
	this.base(m_chart);
};

TimeAreaTitle.prototype = new Title;

TimeAreaTitle.prototype.drawTitleBox = function () {
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

TimeAreaTitle.prototype.drawText = function () {
	var temp = this.m_chart;
	this.startY = this.m_chart.m_y * 1 + (this.m_titleBarHeight) / 2;
	var text = drawSVGText(this.startX, this.startY, this.m_formattedDescription, this.m_fontColor, this.getAlign(), "middle");
	text.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.getFontSize() + "px;font-weight:" + this.getFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$('#' + temp.svgContainerId).append(text);
};

/*************************** SubTitle **************************/

function TimeAreaSubTitle() {
	this.base = SubTitle;
	this.base();
};

TimeAreaSubTitle.prototype = new SubTitle;

TimeAreaSubTitle.prototype.drawText = function () {
	var temp = this.m_chart;
	var text = drawSVGText(this.startX, this.startY, this.m_formattedDescription, this.m_fontColor, this.getAlign(), "middle");
	text.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.getFontSize() + "px;font-weight:" + this.getFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$('#' + temp.svgContainerId).append(text);
};

function TimeAreaYAxis() {
	this.base = Yaxis;
	this.base();
	this.m_showlineyaxis = "true";
	this.m_lineyaxiscolor = "";
};

TimeAreaYAxis.prototype = new Yaxis;

TimeAreaYAxis.prototype.drawYAxis = function () {
	var temp = this;
	if (IsBoolean(this.m_showlineyaxis)) {
		var newLine = drawSVGLine(this.m_startX, this.m_startY, this.m_startX, this.m_endY, "1", temp.m_lineyaxiscolor);
		$("#" + temp.m_chart.svgContainerId).append(newLine);
	}
};

TimeAreaYAxis.prototype.horizontalMarkerLines = function () {
	var temp = this;
	for (var i = 0; i < this.m_yAxisMarkersArray.length; i++) {
		var newLine = drawSVGLine(this.m_startX, this.m_startY - (i * this.getYAxisDiv()), this.m_endX, this.m_startY - (i * this.getYAxisDiv()), "0.9", hex2rgb(temp.m_chart.m_markercolor, temp.m_chart.m_markertransparency));
		$("#" + temp.m_chart.svgContainerId).append(newLine);
	}
};

TimeAreaYAxis.prototype.drawRightYAxis = function () {
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

TimeAreaYAxis.prototype.markYaxis = function (index) {
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

TimeAreaYAxis.prototype.drawDescription = function () {
	var temp = this;
	var fontColor = convertColorToHex(this.getFontColor());
	var description = this.getDescription();

	var text = drawSVGText(this.getXDesc(), this.getYDesc(), description, fontColor, "middle", "middle", 270);
	text.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getFontSize()) + "px;font-weight:" + this.getFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$('#' + temp.m_chart.svgContainerId).append(text);
};

TimeAreaYAxis.prototype.drawSVGText = function (x, y, rotate, color, text1) {
	var temp = this;
	var text = drawSVGText(x, y, text1, color, "right", "middle");
	text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.getLabelFontSize() + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$('#' + temp.m_chart.svgContainerId).append(text);
};

function TimeAreaXAxis() {
	this.base = Xaxis;
	this.base();
	this.m_showlinexaxis = "true";
	this.m_linexaxiscolor = "";
};

TimeAreaXAxis.prototype = new Xaxis;

TimeAreaXAxis.prototype.init = function (m_chart) {
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

TimeAreaXAxis.prototype.drawXAxis = function () {
	var temp = this;
	if (IsBoolean(this.m_showlinexaxis)) {
		var newLine = drawSVGLine(this.m_startX, this.m_startY, this.m_endX, (this.m_startY * 1), "1", temp.m_linexaxiscolor);
		$("#" + temp.m_chart.svgContainerId).append(newLine);
	}
};

TimeAreaXAxis.prototype.drawVerticalLine = function () {
	var temp = this;
	if (IsBoolean(temp.m_chart.m_showverticalmarkerline)) {
		for (var i = 0; i < this.m_xAxisData.length; i++) {
			var x = this.m_xPositionData[i];
			var newLine = drawSVGLine(x, this.m_startY, x, this.m_endY, "0.9", hex2rgb(temp.m_chart.m_markercolor, temp.m_chart.m_markertransparency));
			$("#" + temp.m_chart.svgContainerId).append(newLine);
		}
	}
};

TimeAreaXAxis.prototype.markXaxis = function () {
	this.drawAxisLabels();
	if (this.getDescription() != "") {
		this.drawDescription();
	}
};

TimeAreaXAxis.prototype.drawAxisLabels = function () {
	var temp = this;
	var m_axisLineToTextGap = this.calculateAxisLineToTextGap();
	for (var i = 0; i < this.m_xAxisData.length; i++) {
		var x = this.m_xPositionData[i];
		var axisToLabelMargin = 0;
		var y = this.m_startY * 1 + m_axisLineToTextGap * 1 + (axisToLabelMargin) * 1 + (this.m_labelfontsize) * 1.0;
		if (IsBoolean(this.m_tickmarks)) {
			var tick = drawSVGLine(x, this.m_startY, x, this.m_startY * 1 + 8, "0.9", temp.m_categorymarkingcolor);
			$('#' + temp.m_chart.svgContainerId).append(tick);
		}
		var text = drawSVGText(x, y, this.m_xAxisData[i], this.m_labelfontcolor, "center", "start", this.getLabelrotation());
		text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.getLabelFontSize() + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getLabelTextDecoration() + ";");
		$('#' + temp.m_chart.svgContainerId).append(text);
	}
};

TimeAreaXAxis.prototype.drawDescription = function () {
	var temp = this;
	var text = drawSVGText(this.getXDesc(), this.getYDesc() - ((IsBoolean(this.m_chart.m_showslider)) ? this.m_chart.sliderMargin : 0), this.getDescription(), convertColorToHex(this.m_fontcolor), "middle", "middle", 0);
	text.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.getFontSize() + "px;font-weight:" + this.getFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$('#' + temp.m_chart.svgContainerId).append(text);
};

TimeAreaXAxis.prototype.drawAxisTick = function () {
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

TimeAreaXAxis.prototype.getXaxisDivison = function () {
	return ((this.m_endX - this.m_startX) / (this.m_xAxisData.length - 1));
};

TimeAreaXAxis.prototype.calculateAxisLineToTextGap = function () {
	var m_axisLineToTextGap = 10;
	return m_axisLineToTextGap;
};

TimeAreaXAxis.prototype.drawSVGText = function (x, y, rotate, color, text1) {
	var temp = this.m_chart;
	var text = drawSVGText(x, y, text1, color, "middle", "middle", rotate);
	text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.getLabelFontSize() + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$('#' + temp.svgContainerId).append(text);
};
//# sourceURL=TimeAreaChart.js