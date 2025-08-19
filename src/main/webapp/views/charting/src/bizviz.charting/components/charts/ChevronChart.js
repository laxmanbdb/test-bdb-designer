/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: ChevronChart.js
 * @description ChevronChart
 **/
function ChevronChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();

	this.m_x = 400;
	this.m_y = 20;
	this.m_width = 300;
	this.m_height = 200;
	this.m_barWidth = 10;

	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_chevronSeriesArray = [];
	this.m_cheveronSeriesColor = [];
	this.m_xPositionArray = [];
	this.m_yPositionArray = [];
	this.m_barWidth = "";
	this.m_barHeightArray = [];

	this.m_xAxis = new Xaxis();
	this.m_yAxis = new Yaxis();

	this.m_calculation = new ChevronCalculation();
	this.m_differenceDate = [];
	this.m_startdate = [];
	this.m_enddate = [];
	this.m_flag = [];
	this.m_isInCurrentDate = [];
	this.m_categoryNames = "";
	this.m_seriesNames = "";

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_isValidConfiguration = false;
	this.isValidStartEndDate=true;
};

/** @description Making prototype of chart class to inherit its properties and methods into ChevronChart. **/
ChevronChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
ChevronChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
ChevronChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "Chart") {
			for (var chartKey in jsonObject[key]) {
				switch (chartKey) {
				case "xAxis":
					for (var xAxisKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(xAxisKey.toLowerCase());
						nodeObject.m_xAxis[propertyName] = jsonObject[key][chartKey][xAxisKey];
					}
					break;
				case "yAxis":
					for (var yAxisKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(yAxisKey.toLowerCase());
						nodeObject.m_yAxis[propertyName] = jsonObject[key][chartKey][yAxisKey];
					}
					break;
				case "Title":
					for (var titleKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(titleKey.toLowerCase());
						nodeObject.m_title[propertyName] = jsonObject[key][chartKey][titleKey];
					}
					break;
				case "SubTitle":
					for (var subTitleKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(subTitleKey.toLowerCase());
						nodeObject.m_subTitle[propertyName] = jsonObject[key][chartKey][subTitleKey];
					}
					break;
				default:
					var propertyName = this.getNodeAttributeName(chartKey.toLowerCase());
					nodeObject[propertyName] = jsonObject[key][chartKey];
					break;
				}
			}
		} else {
			var propertyName = this.getNodeAttributeName(key.toLowerCase());
			nodeObject[propertyName] = jsonObject[key];
		}
	}
};

/** @description Getter Method of DataProvider **/
ChevronChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description Setter Method of Fields according to fieldType **/
ChevronChart.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	var categoryJson = [];
	var seriesJson = [];
	var startValueJson = [];
	var endValueJson = [];
	this.m_fieldsType = [];
	var visibleMap = {
			"Category":false,
			"Series":false,
			"startvalue":false,
			"endvalue":false
			};
	for (var i = 0; i < fieldsJson.length; i++) {
	//	if(IsBoolean(fieldsJson[i].visible)){
			var fieldType = this.getProperAttributeNameValue(fieldsJson[i], "Type");
			this.m_fieldsType[i] = fieldType;
			switch (fieldType) {
			case "Category":
				categoryJson.push(fieldsJson[i]);
				visibleMap["Category"]=(IsBoolean(fieldsJson[i].visible))?true:false;
				break;
			case "Series":
				seriesJson.push(fieldsJson[i]);
				visibleMap["Series"]=(IsBoolean(fieldsJson[i].visible))?true:false;
				break;
			case "startvalue":
				startValueJson.push(fieldsJson[i]);
				visibleMap["startvalue"]=(IsBoolean(fieldsJson[i].visible))?true:false;
				break;
			case "endvalue":
				endValueJson.push(fieldsJson[i]);
				visibleMap["endvalue"]=(IsBoolean(fieldsJson[i].visible))?true:false;
				break;
			case "CalculatedField":
				seriesJson.push(fieldsJson[i]);
				break;
			default:
				break;
			}
		//}
	}
	this.m_visibleMap=visibleMap;
	this.setCategory(categoryJson);
	this.setSeries(seriesJson);
	this.setStartValue(startValueJson);
	this.setEndValue(endValueJson);
	this.setValidConfiguration(categoryJson, seriesJson, startValueJson, endValueJson);
};

/** @description Setter Method to set ValidConfiguration. **/
ChevronChart.prototype.setValidConfiguration = function (categoryJson, seriesJson, startValueJson, endValueJson) {
	if (categoryJson.length !== 0 && IsBoolean(this.m_visibleMap["Category"]) && seriesJson.length !== 0 && IsBoolean(this.m_visibleMap["Series"]) && startValueJson.length !== 0 && IsBoolean(this.m_visibleMap["startvalue"]) && endValueJson.length !== 0 && IsBoolean(this.m_visibleMap["endvalue"]))
		this.m_isValidConfiguration = true;
	else
		this.m_isValidConfiguration = false;
};

/** @description Setter Method of Category iterate for all category. **/
ChevronChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	this.m_allCategoryNames = [];
	this.m_allCategoryDisplayNames = [];
	this.m_categoryVisibleArr = [];
	/** only one category can be set for line chart, preference to first visible field **/
	for (var i = 0; i < 1; i++) {
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(categoryJson[i], "DisplayName"));
		this.m_allCategoryDisplayNames[i] = m_formattedDisplayName;
		this.m_allCategoryNames[i] = this.getProperAttributeNameValue(categoryJson[i], "Name");
		this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]] = this.getProperAttributeNameValue(categoryJson[i], "visible");
		this.m_categoryNames[i] = this.getProperAttributeNameValue(categoryJson[i], "Name");
		this.m_categoryDisplayNames[i] = m_formattedDisplayName;
	}
};

/** @description Getter Method of Category Names **/
ChevronChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};

/** @description Getter Method of SeriesColors  **/
ChevronChart.prototype.getSeriesColors = function () {
	var SeriesColor = this.m_cheveronSeriesColor;
	for (var i = 0; i < SeriesColor.length; i++)
		this.m_seriesColors[i] = convertColorToHex(SeriesColor[i]);
	return this.m_seriesColors;
};

/** @description Setter method for startX Position. **/
ChevronChart.prototype.setStartX = function () {
	var btdm = this.getBorderToDescriptionMargin();
	var dm = this.getYAxisDescriptionMargin();
	var dtlm = this.getDescriptionToLabelMargin();
	var ltam = this.getLabelToAxisMargin();
	var lm = 0;
	if(this.fontScaling(this.m_yAxis.m_labelfontsize) > 0){
		this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
		var lm = this.ctx.measureText(this.m_categoryData[0]).width;
		for (var i = 1; i < this.m_categoryData.length; i++) {
			if (lm < this.ctx.measureText(this.m_categoryData[i]).width) {
				lm = this.ctx.measureText(this.m_categoryData[i]).width;
			}
		}
		if (lm > this.m_width / 4)
			lm = this.m_width / 4;
	}
	this.m_startX = this.m_x * 1 + btdm * 1 + dm * 1 + dtlm * 1 + lm * 1 + ltam * 1;
};
/** @description Setter method for EndY Position. **/
ChevronChart.prototype.setEndY = function () {
	this.m_endY = (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};

/** @description Setter method for StartY Position. **/
ChevronChart.prototype.setStartY = function () {
	var marginForXAxisLabels = 20;
	this.m_startY = (this.m_y + this.m_height - marginForXAxisLabels);
};

/** @description Setter method for EndX Position. **/
ChevronChart.prototype.setEndX = function () {
	var rightSideMargin = 20;
	this.m_endX = (this.m_x + this.m_width - rightSideMargin);
};

/** @description Getter Method of Category DisplayNames **/
ChevronChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

/** @description creating array for each property of fields and storing in arrays **/
ChevronChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = [];
	this.m_legendNames = [];
	this.m_seriesVisibleArr = [];
	this.m_allSeriesDisplayNames = [];
	this.m_allSeriesNames = [];
	var count = 0;	
	for (var i = 0; i < seriesJson.length; i++) {
		this.m_allSeriesDisplayNames[i] = this.getProperAttributeNameValue(seriesJson[i], "DisplayName");
		this.m_allSeriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		/** Visibility map should be created with series names **/
		this.m_seriesVisibleArr[this.m_allSeriesNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
		if (IsBoolean(this.m_seriesVisibleArr[this.m_allSeriesNames[i]])) {
			var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
			this.m_seriesDisplayNames[count] = m_formattedDisplayName;
			this.m_seriesNames[count] = this.getProperAttributeNameValue(seriesJson[i], "Name");
			this.m_legendNames[count] = m_formattedDisplayName;
			this.m_seriesColors[count] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));
			count++;
		}
	}
};

/** @description method will return the data for show in grid. **/
ChevronChart.prototype.showGridData = function () {
	var seriesArray = [];
	var startValueArray = [];
	var endValueArray = [];
	var categoryData = [];
	this.catData = [];
	for (var i = 0; i < this.m_seriesData.length; i++) {
		for (var j = 0; j < this.m_seriesData[0].length; j++) {
			categoryData.push(this.m_categoryData[i]);
			seriesArray.push(this.m_seriesData[i][j]);
			startValueArray.push(this.m_startValues[i][j]);
			endValueArray.push(this.m_endValues[i][j]);
		}
	}
	this.catData = categoryData;
	var chevronDataMap = [];
	for (var i = 0; i < this.m_allfieldsName.length; i++) {
		if (this.m_fieldsType[i] == "Category")
			chevronDataMap[this.m_categoryNames] = categoryData;
		else if (this.m_fieldsType[i] == "Series")
			chevronDataMap[this.m_seriesNames] = seriesArray; //this.m_chart.m_chevrondata.getSeriesData();
		else if (this.m_fieldsType[i] == "endvalue")
			chevronDataMap[this.m_endValueNames] = endValueArray; //this.m_chart.m_chevrondata.getEndValueData();
		else if (this.m_fieldsType[i] == "startvalue")
			chevronDataMap[this.m_startValueNames] = startValueArray; //this.m_chart.m_chevrondata.getStartValueData();
	}
	return chevronDataMap;
};

/** @description Setter method for set StartValue. **/
ChevronChart.prototype.setStartValue = function (startvalueJson) {
	this.m_startValueDisplayNames = [];
	this.m_startValueNames = [];
	// only one startvalue field can be set for chevron chart, preference to first one
	for (var i = 0; i < 1; i++) {
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(startvalueJson[i], "DisplayName"));
		this.m_startValueDisplayNames[i] = m_formattedDisplayName;
		this.m_startValueNames[i] = this.getProperAttributeNameValue(startvalueJson[i], "Name");
	}
};

/** @description Setter method for set EndValue. **/
ChevronChart.prototype.setEndValue = function (endValueJson) {
	this.m_endValueDisplayNames = [];
	this.m_endValueNames = [];
	// only one endvalue field can be set for chevron chart, preference to first one
	for (var i = 0; i < 1; i++) {
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(endValueJson[i], "DisplayName"));
		this.m_endValueDisplayNames[i] = m_formattedDisplayName;
		this.m_endValueNames[i] = this.getProperAttributeNameValue(endValueJson[i], "Name");
	}
};

/** @description Getter method of StartValueNames. **/
ChevronChart.prototype.getStartValueNames = function () {
	return this.m_startValueNames;
};

/** @description Getter method of EndValueNames. **/
ChevronChart.prototype.getEndValueNames = function () {
	return this.m_endValueNames;
};

/** @description Getter method of SeriesNames. **/
ChevronChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};
/** @description Getter method of All CategoryNames. **/
ChevronChart.prototype.getAllCategoryNames = function () {
	return this.m_allCategoryNames;
};
/** @description Getter method of All SeriesNames. **/
ChevronChart.prototype.getAllSeriesNames = function () {
	return this.m_allSeriesNames;
};

/** @description Getter method of SeriesDisplayNames. **/
ChevronChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};

/** @description Setter method for set CategoryData. **/
ChevronChart.prototype.setCategoryData = function () {
	var m_categoryData = [];
	this.m_categoryData = [];
	this.isEmptyCategory = true;
	if(this.getCategoryNames().length > 0) {
		this.isEmptyCategory = false;
		for (var i = 0; i < this.getCategoryNames().length; i++) {
			m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
		}
		this.m_categoryData = this.unique(m_categoryData);
	}
};

/** @description Getter method of CategoryData. **/
ChevronChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

/** @description Setter method for set the SeriesData. **/
ChevronChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var j = 0; j < this.getCategoryData().length; j++) {
		for (var i = 0; i < this.getSeriesNames().length; i++) {
			this.m_seriesData[j] = this.getARSCDataFromJSON(this.getSeriesNames()[i], this.getCategoryNames()[0], this.getCategoryData()[j]);
		}
	}
};

/** @description Getter method of SeriesData. **/
ChevronChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

/** @description Setter method for set the StartValues. **/
ChevronChart.prototype.setStartValues = function () {
	this.m_startValues = [];
	for (var j = 0; j < this.getCategoryData().length; j++) {
		for (var i = 0; i < this.getStartValueNames().length; i++) {
			var startValue=this.getARSCDataFromJSON(this.getStartValueNames()[i], this.getCategoryNames()[0], this.getCategoryData()[j]);
			var tempArr=[];
			for(var k=0;k<startValue.length;k++){
				if(this.getFormatedDate(startValue[k])!==""){
					tempArr[k] = this.getFormatedDate(startValue[k]);
				}
				else{
					this.isValidStartEndDate=false;
					break;
				}
			}
			this.m_startValues[j]=tempArr;
		}
	}
};

/** @description Getter method of StartValues. **/
ChevronChart.prototype.getStartValues = function () {
	return this.m_startValues;
};

/** @description Setter method for set the EndValues. **/
ChevronChart.prototype.setEndValues = function () {
	this.m_endValues = [];
	for (var j = 0; j < this.getCategoryData().length; j++) {
		for (var i = 0; i < this.getEndValueNames().length; i++) {
			var endDate=this.getARSCDataFromJSON(this.getEndValueNames()[i], this.getCategoryNames()[0], this.getCategoryData()[j]);
			var tempArr=[];
			for(var k=0;k<endDate.length;k++){
				if(this.getFormatedDate(endDate[k])!==""){
					tempArr[k] = this.getFormatedDate(endDate[k]);
				}
				else{
					this.isValidStartEndDate=false;
					break;
				}
			}
			this.m_endValues[j]=tempArr;
		}
	}
};

/** @description Getter method of EndValues. **/
ChevronChart.prototype.getEndValues = function () {
	return this.m_endValues;
};

/** @description Setter method for set AllFieldsName. **/
ChevronChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getAllCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getAllCategoryNames()[i]);
	}
	for (var j = 0; j < this.getAllSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
	}
	for (var j = 0; j < this.getStartValueNames().length; j++) {
		this.m_allfieldsName.push(this.getStartValueNames()[j]);
	}
	for (var j = 0; j < this.getEndValueNames().length; j++) {
		this.m_allfieldsName.push(this.getEndValueNames()[j]);
	}
};

/** @description Getter method of AllFieldsName. **/
ChevronChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

/** @description Setter method for set AllFieldsDisplayName. **/
ChevronChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getStartValueNames()[j]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getEndValueNames()[j]);
	}
};

/** @description Getter method of AllFieldsDisplayName. **/
ChevronChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

/** @description Getter method of LegendNames. **/
ChevronChart.prototype.getLegendNames = function () {
	var legendSeriesData = "";
	if(this.m_seriesData.length !== 0) {
	legendSeriesData = this.unique(this.m_seriesData);
	}
	return legendSeriesData;
};

/** @description Getter method to get the data from JSON1. **/
ChevronChart.prototype.getARSCDataFromJSON = function (fieldName, catName, catvalue) {
	var data = [];
	for (var i = 0; i < this.getDataProvider().length; i++) {
		if ((""+this.getDataProvider()[i][catName]).replace(/ /g, "") == (""+catvalue).replace(/ /g, "")){
			data.push(this.getDataProvider()[i][fieldName]);
		}
	}
	return data;
};

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
ChevronChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description  initialization of draggable div and its inner Content **/
ChevronChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/** @description initialization of ChevronChart with Title, SubTitle, ChartFrame and Axes. **/
ChevronChart.prototype.init = function () {
	if (IsBoolean(this.m_isValidConfiguration)) {
		this.setCategoryData();
		this.setSeriesData();
		this.setStartValues();
		this.setEndValues();
	}
	this.setAllFieldsName();
	this.setAllFieldsDisplayName();

	this.isSeriesDataEmpty();

	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);
	if (!IsBoolean(this.m_isEmptySeries) && IsBoolean(this.isValidStartEndDate)) {
		this.initializeCalculation();
		this.m_yAxis.init(this, this.m_calculation);
		this.setMapForLegend();
	}
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};

/** @description Drawing of chart started by drawing different parts of chart like ChartFrame,Title,SubTitle **/
ChevronChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();

	this.drawLegends();
	var map = this.IsDrawingPossible();
	if (IsBoolean(map.permission)) {
		this.drawYAxis();
		this.drawChevronChart();
	} else {
		this.drawMessage(map.message);
	}
};
ChevronChart.prototype.IsDrawingPossible = function () {
	var map = {};
	if (!IsBoolean(this.isEmptyCategory)) {
		if (!IsBoolean(this.m_isEmptySeries)) {
			if (IsBoolean(this.isVisibleSeries())){
				if(IsBoolean(this.m_isValidConfiguration)){
					if(IsBoolean(this.isValidStartEndDate)){
						map = { "permission" : "true", message : this.m_status.success };
					}else{
						map = { "permission" : "false", message : this.m_status.invalidDate };
					}
				}else{
					map = { "permission" : "false", message : this.m_status.invalidConfig};					
				}
			}else{
				map = { "permission" : "false", message : this.m_status.noSeries };
			}
		} else {
				map = { "permission" : "false", message : this.m_status.noData };
		}
	} else{
		map = { "permission" : "false", message : this.m_status.noCategory };
	}
	return map;
};
/** @description initialize the calculation and seriesClass of the ChevronChart. **/
ChevronChart.prototype.initializeCalculation = function () {
	this.setChartDrawingArea();
	this.setStartEndDate();
	this.m_cheveronSeriesColor = this.getSeriesColor().split(",");
	this.m_calculation.init(this, this.m_categoryData, this.m_differenceDate, this);
	this.m_xPositionArray = this.m_calculation.getXPositionArray();
	this.m_yPositionArray = this.m_calculation.getYPositionArray();
	this.m_barWidth = this.m_calculation.getbarWidth();
	this.m_barGap = this.m_calculation.getBarGap();
	this.m_barHeightArray = this.m_calculation.getstackHeightArray();
	this.initializeChevrons();
};
ChevronChart.prototype.setMapForLegend = function () {
	this.legendMap = {};
	for(var i = 0; i < this.getLegendNames().length ; i++){
	var tempMap = {
					"seriesName" : this.getLegendNames()[i],
					//"displayName" : this.m_seriesDisplayNames[count],
					"color" : this.m_cheveronSeriesColor[i],
					"shape" : "chevron",
					"index": i
				};
			this.legendMap[this.getLegendNames()[i]] = tempMap;
	}
};
/** @description Will Draw Title on canvas if showTitle set to true **/
ChevronChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

/** @description Will Draw SubTitle on canvas if showSubTitle set to true **/
ChevronChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

/** @description Will Draw XAxis on canvas with x-axis labels **/
ChevronChart.prototype.drawXAxis = function () {
	this.m_xAxis.drawXAxis();
	this.m_xAxis.markXaxis();
};

/** @description Will Draw YAxis on canvas with y-axis labels **/
ChevronChart.prototype.drawYAxis = function () {
	this.m_yAxis.markYaxis();
	this.m_yAxis.drawYAxis();
};

/** @description Will Draw ChartFrame on canvas . **/
ChevronChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

/** @description Method Will convert year from "yy" format to "yyyy" and  return. **/
ChevronChart.prototype.getFullYear = function (yy) {
	return ((yy * 1) > 50) ? "19" + yy : "20" + yy;
};

/** @description method will return the formatted Date. **/
ChevronChart.prototype.getFormatedDate = function (dateString) {
	if (dateString != undefined) {
		var dateFormate = this.m_sourcedateformat;
		if (this.m_designMode)
			dateFormate = "mm/dd/yyyy";
		var updatedDate = "";
		switch (dateFormate) {
		case "dd-mm-yy":
			var arr = (""+dateString).split("-");
			if(arr.length==3)
				updatedDate = arr[1] + "/" + arr[0] + "/" + this.getFullYear(arr[2]);
			break;
		case "mm-dd-yy":
			var arr = (""+dateString).split("-") ;
			if(arr.length==3)
				updatedDate = arr[0] + "/" + arr[1] + "/" + this.getFullYear(arr[2]);
			break;
		case "dd-mm-yyyy":
			var arr = (""+dateString).split("-");
			if(arr.length==3)
				updatedDate = arr[1] + "/" + arr[0] + "/" + arr[2];
			break;
		case "mm-dd-yyyy":
			var arr = (""+dateString).split("-");
			if(arr.length==3)
				updatedDate = arr[0] + "/" + arr[1] + "/" + arr[2];
			break;
		case "yyyy-mm-dd":
			var arr =(""+dateString).split("-");
			if(arr.length==3)
				updatedDate = arr[1] + "/" + arr[2] + "/" + arr[0];
			break;

		case "dd/mm/yy":
			var arr = (""+dateString).split("/");
			if(arr.length==3)
				updatedDate = arr[1] + "/" + arr[0] + "/" + this.getFullYear(arr[2]);
			break;
		case "mm/dd/yy":
			var arr = (""+dateString).split("/");
			if(arr.length==3)
				updatedDate = arr[0] + "/" + arr[1] + "/" + this.getFullYear(arr[2]);
			break;
		case "dd/mm/yyyy":
			var arr = (""+dateString).split("/");
			if(arr.length==3)
				updatedDate = arr[1] + "/" + arr[0] + "/" + arr[2];
			break;
		case "mm/dd/yyyy":
			var arr = (""+dateString).split("/");
			if(arr.length==3)
				updatedDate = arr[0] + "/" + arr[1] + "/" + ((arr[2]*1<=99)?this.getFullYear(arr[2]):arr[2]);
			break;
		default:
			updatedDate = "";
			break;
		}
		if (updatedDate.split("/")[0] * 1 <= 12 && updatedDate.split("/")[1] * 1 <= 31 && updatedDate.split("/")[2] * 1 >= 1700)
			return updatedDate;
		else {
			return "";
		}
	} else {
		return "";
	}
};

/** @description Setter method for set startDate and endDate values. **/
ChevronChart.prototype.setStartEndDate = function () {
	for (var i = 0; i < this.m_startValues.length; i++) {
		this.m_differenceDate[i] = [];
		this.m_startdate[i] = [];
		this.m_enddate[i] = [];
		this.m_flag[i] = [];
		this.m_isInCurrentDate[i] = [];
		for (var j = 0; j < this.m_startValues[i].length; j++) {
			var start = new XDate(this.m_startValues[i][j]);
			var end = new XDate(this.m_endValues[i][j]);
			var difference = start.diffDays(end);

			var td = new Date();
			var todayDateString = (td.getMonth() * 1 + 1) + "/" + td.getDate() + "/" + (td.getYear() - 100);
			var today = new XDate(todayDateString);

			if (isNaN(difference) || difference < 0) {
				this.m_differenceDate[i][j] = 0;
				this.m_flag[i][j] = false;
				this.m_isInCurrentDate[i][j] = false;
			} else {
				this.m_differenceDate[i][j] = difference * 1 + 20;
				this.m_flag[i][j] = true;
				this.m_isInCurrentDate[i][j] = (start <= today && end >= today) ? true : false;
			}
			if (this.m_startValues[i][j] != undefined)
				this.m_startdate[i][j] = this.m_startValues[i][j].substring(0, 10);
			if (this.m_endValues[i][j] != undefined)
				this.m_enddate[i][j] = this.m_endValues[i][j].substring(0, 10);
		}
	}
};

/** @description method will instantiate ChevronSeries and initialize for set startDate and endDate values. **/
ChevronChart.prototype.initializeChevrons = function () {
	for (var i = 0; i < this.m_xPositionArray.length; i++) {
		this.m_chevronSeriesArray[i] = new ChevronSeries();
		this.m_chevronSeriesArray[i].init(this.m_xPositionArray[i], this.m_yPositionArray[i], this.m_barWidth, this.m_barHeightArray[i], this.m_cheveronSeriesColor, this.m_flag[i], this.m_isInCurrentDate[i], this);
	}
};

/** @description method will iterate for all categories and draw the chevron corresponding to Category. **/
ChevronChart.prototype.drawChevronChart = function () {
	for (var i = 0; i < this.getCategoryData().length; i++) {
		this.m_chevronSeriesArray[i].draw();
	}
};

/** @description method will return the Tooltip Data according to mouse pointer. **/
ChevronChart.prototype.getToolTipData = function (mouseX, mouseY) {
	var map = this.IsDrawingPossible();
	if (IsBoolean(map.permission) && (IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None"))) {
		var toolTipData;
		var startDate = this.m_startdate;
		var endDate = this.m_enddate;
		
		var totalbarWidth = this.m_barWidth * this.m_yPositionArray.length;
		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			for (var i = 0; i < this.m_yPositionArray.length; i++) {
				if (mouseY <= (this.m_yPositionArray[i][0] * 1 + this.m_barWidth * 1) && (mouseY >= this.m_yPositionArray[i][0] * 1)) {
					toolTipData = {};
					toolTipData.cat = "";
					toolTipData["data"] = new Array();
					toolTipData.cat = this.getCategoryData()[i];
					for (var j = 0; j < this.getSeriesData()[i].length; j++) {
						var data = [];
						//data[0] = this.getSeriesColors()[j];
						data[0] = {"color":this.getSeriesColors()[j],"shape":this.legendMap[this.getLegendNames()[j]].shape};
						data[1] = this.getSeriesData()[i][j];
						data[2] = startDate[i][j];
						data[3] = endDate[i][j];
						toolTipData.highlightIndex = this.getDrillColor(mouseX, mouseY);
						toolTipData.data[j] = data;
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

/** @description Get Drill Color**/
ChevronChart.prototype.getDrillColor = function (mouseX, mouseY) {
	if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
		for (var i = 0; i < this.m_yPositionArray.length; i++) {
			if (mouseY <= (this.m_yPositionArray[i][0] * 1 + this.m_barWidth * 1) && (mouseY >= this.m_yPositionArray[i][0] * 1)) {
				for (var j=0; j<this.m_xPositionArray[i].length; j++) {
					if (mouseX >= this.m_xPositionArray[i][j] * 1 && mouseX <= this.m_xPositionArray[i][j]*1 + this.m_barHeightArray[i][j] * 1){
						return j;
					}
				}
			}
		}
	}
};
/** @description method will return the converted sate string according to given formate. **/
ChevronChart.prototype.getFormatDate = function (date, m_formatstring) {
	var dateArray = [];
	var convertedDateFormatString;
	var flag = null;
	for (var i = 0; i < m_formatstring.length; i++) {
		if (m_formatstring[i] == "/") {
			flag = 1;
			break;
		}
		if (m_formatstring[i] == "-") {
			flag = 2;
			break;
		}
		if (m_formatstring[i] == " ") {
			flag = 3;
			break;
		}
	}
	if (flag == 1) {
		dateArray = m_formatstring.split("/");
		convertedDateFormatString = this.getConvertedDateFormatString(date, dateArray, flag);
	} else if (flag == 2) {
		dateArray = m_formatstring.split("-");
		convertedDateFormatString = this.getConvertedDateFormatString(date, dateArray, flag);
	} else {
		dateArray = m_formatstring.split(" ");
		convertedDateFormatString = this.getConvertedDateFormatString(date, dateArray, flag);
	}
	return convertedDateFormatString;
};

/** @description Getter method of Converted DateFormatString. **/
ChevronChart.prototype.getConvertedDateFormatString = function (date, dateArray, FormatFlag) {
	var formatArray = [];
	var str = null;
	for (var i = 0; i < dateArray.length; i++) {
		formatArray[i] = this.getConvertFormatArray(date, dateArray[i]);
	}
	if (FormatFlag == 1)
		str = formatArray[0] + "/" + formatArray[1] + "/" + formatArray[2];
	if (FormatFlag == 2)
		str = formatArray[0] + "-" + formatArray[1] + "-" + formatArray[2];
	if (FormatFlag == 3)
		str = formatArray[0] + " " + formatArray[1] + " " + formatArray[2];

	return str;
};

/** @description Getter method of ConvertFormatArray. **/
ChevronChart.prototype.getConvertFormatArray = function (date, val) {
	if (val == "mm") {
		var getmonth = date.getMonth() + 1;
		if (getmonth >= 10)
			return getmonth;
		else
			return ("0" + getmonth);
	}
	if (val == "dd") {
		var getdate = date.getDate();
		if (getdate >= 10)
			return getdate;
		else
			return ("0" + getdate);
	}
	if (val == "yyyy" || val == "yy")
		return date.getFullYear();
};

/** @description Getter method for get the unique value array. **/
ChevronChart.prototype.unique = function (data) {
	var outputArray = [];
	for (var i = 0; i < data[0].length; i++) {
		if (($.inArray(data[0][i], outputArray)) == -1) {
			outputArray.push(data[0][i]);
		}
	}
	return outputArray;
};

/** @description Getter method to get DrillDataPoints . **/
ChevronChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries)) {
		this.mouseX = mouseX;
		this.mouseY = mouseY;
		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			for (var i = 0; i < this.m_xPositionArray.length; i++) {
				for (var j = 0; j < this.m_xPositionArray[i].length; j++) {
					if (mouseX <= ((this.m_xPositionArray[i][j] * 1) + (this.m_barHeightArray[i][j] * 1)) && (mouseX >= this.m_xPositionArray[i][j] * 1) && mouseY <= ((this.m_yPositionArray[i][j] * 1) + (this.m_barWidth * 1)) && (mouseY >= this.m_yPositionArray[i][j] * 1)) {
						var fieldNameValueMap = this.getFieldNameValueMap(this.getCategoryData()[i], j);
						var drillColor = this.getSeriesColors()[j];
						return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
					}
				}
			}
		}
	}
};

/** @description Getter method to get FieldNameValueMap . **/
ChevronChart.prototype.getFieldNameValueMap = function (cat, i) {
	var m_fieldNameValueMap = new Object();
	var dataArr = [];
	for (var p = 0; p < this.getDataProvider().length; p++) {
		for (var key in this.getDataProvider()[p]) {
			if (this.getDataProvider()[p][key] == cat)
				dataArr.push(this.getDataProvider()[p]);
		}
	}
	for (var l = 0; l < this.getAllFieldsName().length; l++) {
		m_fieldNameValueMap[this.getAllFieldsName()[l]] = dataArr[i][this.getAllFieldsName()[l]];
	}
	return m_fieldNameValueMap;
};

function ChevronCalculation() {
	this.m_chart = "";
	this.yAxisData = [];
	this.xAxisData = [];
	this.xPositionArray = [];
	this.yAxisPixelArray = [];
	this.barGap = 10;
	this.m_xAxisText = "";
	this.m_numberOfMarkers = 6;
	this.m_max = 0;
};

/** @description Initialize the  ChevronCalculation. **/
ChevronCalculation.prototype.init = function (globalCal, categorydata, seriesdata, chart) {
	this.globalCalculation = globalCal;
	this.yAxisData = categorydata;
	this.xAxisData = seriesdata;
	this.m_chart = chart;
	this.barGap = 10;
	this.startX = this.globalCalculation.getStartX();
	this.startY = this.globalCalculation.getStartY();
	this.endX = this.globalCalculation.getEndX();
	this.endY = this.globalCalculation.getEndY();
	this.calculateBarWidth();

	this.calculateMaxValue();
	this.setXAxisMarkersArray();
};

/** @description method to calculate the  BarWidth. **/
ChevronCalculation.prototype.calculateBarWidth = function () {
	var numberOfColumns = this.yAxisData.length;
	var totalGap = ((numberOfColumns * 1) + 1) * this.barGap;
	var availableDrawWidth = (this.getDrawHeight() * 1 - totalGap * 1);
	var barWidth = (availableDrawWidth / numberOfColumns);

	if (barWidth > 40) {
		this.setBarWidth(40);
		this.setColumnGap(40);
	} else if (barWidth < 9) {
		this.setBarWidth(7);
		this.setColumnGap(7);
	} else {
		this.setBarWidth(barWidth);
	}
};

/** @description Setter method for set BarWidth. **/
ChevronCalculation.prototype.setBarWidth = function (barwidth) {
	this.barWidth = barwidth;
};

/** @description Setter method for set ColumnGap. **/
ChevronCalculation.prototype.setColumnGap = function (barWidth) {
	var totalBarwidth = barWidth * this.yAxisData.length;
	var totalGap = this.getDrawHeight() - totalBarwidth;
	this.barGap = totalGap / ((this.yAxisData.length * 1) + 1);
};

/** @description method will calculate the maximum value of the data. **/
ChevronCalculation.prototype.calculateMaxValue = function () {
	var xAxisData = this.xAxisData;
	if (xAxisData.length > 0) {
		this.m_max = xAxisData[0][0] * 1;

		for (var i = 0; i < xAxisData.length; i++) {
			var height = 0;
			for (var j = 0; j < xAxisData[i].length; j++) {
				if (xAxisData[i][j] != undefined)
					height = (height * 1) + (xAxisData[i][j] * 1);
			}
			if (height > this.m_max) {
				this.m_max = height;
			}
		}
		if (this.m_max > 5) {
			var maxDivisor = getMax(this.m_max);
			this.m_numberOfMarkers = maxDivisor[1] * 1 + 1 * 1;
			this.m_xAxisText = maxDivisor[2];
			this.m_max = maxDivisor[0];
		} else {
			this.setYAxisText();
		}
	}
};

/** @description Setter method for set YAxisText. **/
ChevronCalculation.prototype.setYAxisText = function () {
	this.m_numberOfMarkers = 5;
	this.percentileValue = 0;
	this.m_xAxisText = this.getMaxValue() / 4;
	if (this.max > 1 && this.max <= 5) {
		this.percentileValue = this.m_xAxisText % 2;
		if (this.percentileValue !== 2) {
			this.percentileValue = 2 - this.percentileValue;
		}
		this.m_xAxisText = (this.m_xAxisText * 1) + (this.percentileValue * 1);
		this.max = this.m_xAxisText * this.m_numberOfMarkers;
	} else {
		var text = Math.ceil((this.m_xAxisText * 100));
		this.m_xAxisText = (text / 100).toFixed(2);
		this.max = this.m_xAxisText * 4;
	}
};

/** @description Getter method of XAxisText. **/
ChevronCalculation.prototype.getXAxisText = function () {
	return this.m_xAxisText;
};

/** @description Getter method of MaxValue. **/
ChevronCalculation.prototype.getMaxValue = function () {
	return this.m_max;
};

/** @description Getter method of XAxisMarkersArray. **/
ChevronCalculation.prototype.getXAxisMarkersArray = function () {
	return this.m_xAxisMarkersArray;
};

/** @description Setter method for set XAxisMarkersArray. **/
ChevronCalculation.prototype.setXAxisMarkersArray = function () {
	this.m_xAxisMarkersArray = [];
	for (var i = 0; i < this.m_numberOfMarkers; i++) {
		this.m_xAxisMarkersArray[i] = (this.getXAxisText() * i);
	}
};

/** @description Getter method of DrawHeight. **/
ChevronCalculation.prototype.getDrawHeight = function () {
	this.drawHeight = (this.startY - this.endY);
	return this.drawHeight;
};

/** @description Getter method of DrawWidth. **/
ChevronCalculation.prototype.getDrawWidth = function () {
	this.drawWidth = (this.endX * 1) - (this.startX * 1);
	return this.drawWidth;
};

/** @description Getter method of Ratio. **/
ChevronCalculation.prototype.getRatio = function () {
	this.ratio = this.getDrawWidth() / (this.getMaxValue());
	return this.ratio;
};

/** @description Getter method of BarGap. **/
ChevronCalculation.prototype.getBarGap = function () {
	return this.barGap;
};

/** @description Getter method of barWidth. **/
ChevronCalculation.prototype.getbarWidth = function () {
	return this.barWidth;
};

/** @description Getter method of XPositionArray. **/
ChevronCalculation.prototype.getXPositionArray = function () {
	var xPositionArray = [];
	this.stackHeightArray = [];
	for (var i = 0; i < this.xAxisData.length; i++) {
		xPositionArray[i] = [];
		this.stackHeightArray[i] = [];
		for (var j = 0; j < this.xAxisData[i].length; j++) {
			if (j == 0) {
				xPositionArray[i][j] = (this.startX) * 1;
				this.stackHeightArray[i][j] = (this.xAxisData[i][j] * 1) * this.getRatio();
			} else {
				xPositionArray[i][j] = (xPositionArray[i][j - 1]) * 1 + ((this.getRatio()) * ((this.xAxisData[i][j - 1])) * 1);
				this.stackHeightArray[i][j] = (this.xAxisData[i][j] * 1) * this.getRatio();
			}
		}
	}
	return xPositionArray;
};

/** @description Getter method of YPositionArray. **/
ChevronCalculation.prototype.getYPositionArray = function () {
	var yPositionArray = [];
	for (var i = 0; i < this.xAxisData.length; i++) {
		yPositionArray[i] = [];
		for (var j = 0; j < this.xAxisData[i].length; j++) {
			yPositionArray[i][j] = this.startY - (this.getBarGap()) * (i * 1 + 1) - (this.getbarWidth() * (i * 1 + 1));
		}
	}
	return yPositionArray;
};

/** @description Getter method of stackHeightArray. **/
ChevronCalculation.prototype.getstackHeightArray = function () {
	return this.stackHeightArray;
};

/** @description Getter method of YAxisText. **/
ChevronCalculation.prototype.getYAxisText = function () {
	return this.yAxisData;
};

/** @description Getter method of AxisMarkersArray. **/
ChevronCalculation.prototype.getYAxisMarkersArray = function () {
	return this.yAxisData;
};

function ChevronSeries() {
	this.xPixel = [];
	this.yPixelArray = [];
	this.stackHeightArray = [];
	this.stackColorArray = [];
	this.chevronStackArray = [];
	this.stackDrawFlag = [];
	this.stackBorderArray = [];
};

/** @description initialize method of ChevronSeries. **/
ChevronSeries.prototype.init = function (xPixel, yPixelArray, stackWidth, stackHeightArray, stackColorArray, stackFlag, stackBorderArray, chart) {
	this.xPixel = xPixel;
	this.yPixelArray = yPixelArray;
	this.stackWidth = stackWidth;
	this.stackHeightArray = stackHeightArray;
	this.stackColorArray = this.setChevronSeriesColor(stackColorArray);
	this.stackDrawFlag = stackFlag;
	this.stackBorderArray = stackBorderArray;
	for (var i = 0; i < this.xPixel.length; i++) {
		this.chevronStackArray[i] = new ChevronStack();
		this.chevronStackArray[i].init(this.xPixel[i], this.yPixelArray[i], this.stackWidth, this.stackHeightArray[i], this.stackColorArray[i], this.stackDrawFlag[i], this.stackBorderArray[i], chart);
	}
};

/** @description Setter method of ChevronSeriesColor. **/
ChevronSeries.prototype.setChevronSeriesColor = function (stackColorArray) {
	var ChevronSeriesColor = stackColorArray;
	if (stackColorArray.length < this.xPixel.length) {
		for (var i = 0; i < this.xPixel.length; i++) {
			if (stackColorArray[i] == undefined)
				ChevronSeriesColor[i] = "000";
			else
				ChevronSeriesColor[i] = stackColorArray[i];
		}
	}
	return ChevronSeriesColor;
};

/** @description method will draw the Chevron Series. **/
ChevronSeries.prototype.draw = function () {
	for (var i = 0; i < this.xPixel.length; i++) {
		this.chevronStackArray[i].draw();
	}
};

function ChevronStack() {
	this.startX;
	this.startY;
	this.endX;
	this.endY;
	this.xIncrease;
	this.yIncrease;
	this.stackColor;
	this.stackWidth;
	this.ctx;
	this.m_isChevronInCurrentDate = false;
	this.m_currentphasebordercolor;
};

/** @description method will initialize the ChevronStack. **/
ChevronStack.prototype.init = function (stackXPixel, stackYPixel, stackWidth, stackHeight, stackColor, flag, isChevronInCurrentDate, chart) {
	var chevronGap = 5;
	this.stackWidth = stackWidth;
	this.m_chartbase = chart.m_chartbase;
	this.ctx = chart.ctx;
	this.stackHeight = stackHeight;
	this.startX = stackXPixel;
	this.startY = stackYPixel;
	this.endX = this.startX * 1 + stackHeight * 1 - chevronGap;
	this.endY = this.startY * 1 + stackWidth * 1;
	this.xIncrease = stackWidth / 2;
	this.yIncrease = stackWidth / 2;
	this.m_isChevronInCurrentDate = isChevronInCurrentDate;
	this.m_currentphasebordercolor = chart.m_currentphasebordercolor;
	this.stackColor = convertColorToHex(stackColor);
	this.flag = flag;
};

/** @description method will draw the ChevronStack. **/
ChevronStack.prototype.draw = function () {
	if (!IsBoolean(isNaN(this.stackHeight))) {
		if (IsBoolean(this.flag)) {
			this.ctx.beginPath();
			this.ctx.fillStyle = this.getFillColor();
			this.ctx.moveTo(this.startX, this.startY);
			this.ctx.lineTo(this.endX, this.startY);
			this.ctx.lineTo(((this.endX * 1) + (this.xIncrease * 1)), (this.endY - this.yIncrease));

			this.ctx.lineTo(this.endX, this.endY);
			this.ctx.lineTo(this.startX, this.endY);
			this.ctx.lineTo(((this.startX * 1) + (this.xIncrease * 1)), ((this.startY * 1) + (this.yIncrease * 1)));
			this.ctx.lineTo(this.startX, this.startY);
			this.ctx.fill();
			this.ctx.closePath();
			this.drawBorderOnChevron();
		}
	}
};

/** @description method will draw the border of ChevronStack. **/
ChevronStack.prototype.drawBorderOnChevron = function () {
	if (this.m_isChevronInCurrentDate) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.m_currentphasebordercolor;
		this.ctx.lineWidth = 0.75;
		var gap = 1;
		this.ctx.moveTo(this.startX - gap, this.startY);
		this.ctx.lineTo(this.endX - gap, this.startY);
		this.ctx.lineTo(((this.endX * 1 - gap) + (this.xIncrease * 1)), (this.endY - this.yIncrease));

		this.ctx.lineTo(this.endX - gap, this.endY);
		this.ctx.lineTo(this.startX - gap, this.endY);
		this.ctx.lineTo(((this.startX * 1 - gap) + (this.xIncrease * 1)), ((this.startY * 1) + (this.yIncrease * 1)));
		this.ctx.lineTo(this.startX - gap, this.startY);
		this.ctx.stroke();
		this.ctx.closePath();
	}
};

/** @description method will fill the gradient in chevron. **/
ChevronStack.prototype.getFillColor = function () {
	var grd = this.stackColor;

	if (this.m_chartbase == "plane") {
		grd = this.createGradient3();
	} else if (this.m_chartbase == "gradient1") {
		grd = this.createGradient1();
	} else if (this.m_chartbase == "gradient2") {
		grd = this.createGradient2();
	} else if (this.m_chartbase == "gradient3") {
		grd = this.createGradient3();
	}
	return grd;
};

/** @description method will retrun the Gradient1 **/
ChevronStack.prototype.createGradient1 = function () {
	var grd = this.ctx.createLinearGradient(this.startX, this.startY, this.startX * 1 + this.endX, this.startY);
	var color0 = this.hex2rgb(this.stackColor, 0.65);
	var color1 = this.hex2rgb(this.stackColor, 0.85);
	grd.addColorStop(0, color0);
	grd.addColorStop(0.5, color1);
	grd.addColorStop(0.7, this.stackColor);
	grd.addColorStop(1, this.stackColor);
	return grd;
};

/** @description method will retrun the Gradient2 **/
ChevronStack.prototype.createGradient2 = function () {
	var grd = this.ctx.createLinearGradient(this.startX, this.startY, this.startX, (this.startY * 1 + this.stackWidth * 1));
	var color0 = this.hex2rgb(this.stackColor, 0.70);
	var color1 = this.hex2rgb(this.stackColor, 0.25);
	grd.addColorStop(0, this.stackColor);
	grd.addColorStop(0.1, color0);
	grd.addColorStop(0.49, this.stackColor);
	grd.addColorStop(0.5, "#000");
	grd.addColorStop(0.51, this.stackColor);
	grd.addColorStop(0.99, color1);
	grd.addColorStop(1, this.stackColor);
	return grd;
};

/** @description method will retrun the Gradient3 **/
ChevronStack.prototype.createGradient3 = function () {
	var grd = this.ctx.createLinearGradient(this.startX, this.startY, this.startX, this.startY * 1 + this.yIncrease * 2);
	var color0 = this.hex2rgb(this.stackColor, 0.85);
	var color1 = this.hex2rgb(this.stackColor, 0.95);
	grd.addColorStop(0, this.stackColor);
	grd.addColorStop(0.25, this.stackColor);
	grd.addColorStop(0.45, color0);
	grd.addColorStop(0.65, color1);
	grd.addColorStop(0.85, this.stackColor);
	grd.addColorStop(1, this.stackColor);
	return grd;
};

/** @description method will convert hexadecimal to RGBA and return. **/
ChevronStack.prototype.hex2rgb = function (hex, opacity) {
	var rgb = hex.replace("#", "").match(/(.{2})/g);
	var i = 3;
	while (i--) {
		rgb[i] = parseInt(rgb[i], 16);
	}
	if (typeof opacity === "undefined") {
		return "rgb(" + rgb.join(", ") + ")";
	}
	return "rgba(" + rgb.join(", ") + ", " + opacity + ")";
};
/** description method will return required shape for drawing legend. **/
ChevronChart.prototype.getLegendShape = function (i) {
	var shape = this.legendMap[this.getLegendNames()[i]].shape;
	return shape;
};
//# sourceURL=ChevronChart.js