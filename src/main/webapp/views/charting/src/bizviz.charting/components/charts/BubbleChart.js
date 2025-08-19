/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: BubbleChart.js
 * @description BubbleChart
 **/
function BubbleChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();

	this.m_x = 680;
	this.m_y = 20;
	this.m_width = 300;
	this.m_height = 260;
	this.m_radius = 2;
	this.minRadius = 2;
	this.maxRadius = 26;
	this.m_axisToChartMargin = this.maxRadius;
	this.m_axistodrawingareamargin = this.maxRadius;
	this.m_bubbleSeries = {};
	this.m_colorNames = [];
	this.m_pointSeries = [];

	this.m_categoryNames = [];
	this.m_seriesNames = [];
	this.m_seriesarr = [];
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_updateSeriesValue = [];

	this.m_feild = "";
	this.m_bandcolors = "";
	this.m_bandalphas = "";
	this.m_banddisplaynames = "";
	this.m_rangesofseries = "";
	this.m_rangedseriescolors = "";
	this.m_rangedseriesdisplaynames = "";
	this.m_colorbandranges = "";
	this.color = "";
	this.m_xPositionArray = [];
	this.m_yPositionArray = [];

	this.m_calculation = new BubbleCalculation();
	this.m_xAxis = new Xaxis();
	this.m_yAxis = new Yaxis();

	this.m_rangeenabledseries = "false";
	this.BubbleSeriesColor = [];
	this.m_showcolorbands = "false";
	this.m_showcolorbandlegends = "false";
	this.m_showcheckboxwithlegend = "false";

	this.m_maximumaxisvalue = "";
	this.m_minimumaxisvalue = "";
	this.m_updateSeriesValue = [];
	this.m_seriesactualdatafordatalabel = [];
	this.m_flag = "false";
	this.xPositions = "";
	this.yPositions = "";

	this.m_chartbase = "plane";
	this.m_luminance = "0.4";
	this.m_shadowvisible = "false";
	//this.m_transparency = "1";
	this.noOfRows = 1; //used for set x-axis text into two rows in non tilted case.
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_gradientfill = true;
	this.m_defaultfillcolor = "#e0dfdf";
	this.m_solidcolorfill = false;
	this.enableDrillHighlighter = false;
	this.m_drilltoggle = true;
};
/** @description Making prototype of chart class to inherit its properties and methods into area chart **/
BubbleChart.prototype = new Chart();
/** @description This method will parse the chart JSON and create a container **/
BubbleChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas(); //create draggable div
};
/** @description Setter Method of Fields according to fieldType **/
BubbleChart.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	var categoryJson = [];
	var seriesJson = [];

	for (var i = 0, length = fieldsJson.length; i < length ; i++) {
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
/** @description Setter Method of Category iterate for all category. **/
BubbleChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryFieldColor = [];
	this.m_categoryDisplayNames = [];
	this.m_allCategoryNames = [];
	this.m_allCategoryDisplayNames = [];
	this.m_categoryVisibleArr = {};
	var count = 0;
	// only one category can be set for line chart, preference to first one
	for (var i = 0, length = categoryJson.length; i < length ; i++) {
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(categoryJson[i], "DisplayName"));
		this.m_allCategoryDisplayNames[i] = m_formattedDisplayName;
		this.m_allCategoryNames[i] = this.getProperAttributeNameValue(categoryJson[i], "Name");
		this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]] = this.getProperAttributeNameValue(categoryJson[i], "visible");
		if (IsBoolean(this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]])) {
			this.m_categoryNames[count] = this.getProperAttributeNameValue(categoryJson[i], "Name");
			this.m_categoryDisplayNames[count] = m_formattedDisplayName;
			this.m_categoryFieldColor[count] = this.getProperAttributeNameValue(categoryJson[i], "Color");
			count++;
		}
	}
};
/** @description Iterate through chart JSON and set class variable values with JSON values **/
BubbleChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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
/** @description Getter Method of DataProvider **/
BubbleChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};
/** @description Getter Method of Category Names. **/
BubbleChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};
/** @description Getter Method of Category DisplayName. **/
BubbleChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};
/** @description creating array for each property of fields and storing in arrays **/
BubbleChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = [];
	this.m_seriesDataLabelProperty = [];
	this.m_legendNames = [];
	this.m_radiusField = [];
	this.m_seriesVisibleArray = [];
	this.m_seriesVisibleArr = {};
	this.m_allSeriesDisplayNames = [];
	this.m_allSeriesNames = [];
	this.m_colorField = [];
	this.m_transparency = [];
	//this.m_seriesNameWithColorField = [];
	var count = 0;
	this.legendMap = {};
	var tra = 0.3;
	for (var i = 0, length = seriesJson.length; i < length ; i++) {
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.m_allSeriesDisplayNames[i] = m_formattedDisplayName;
		this.m_allSeriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		this.m_seriesVisibleArray[i] = this.getProperAttributeNameValue(seriesJson[i], "visible");
		this.m_seriesVisibleArr[this.m_allSeriesNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");

		if (IsBoolean(this.m_seriesVisibleArr[this.m_allSeriesNames[i]])) {
			this.m_seriesDisplayNames[count] = m_formattedDisplayName;
			this.m_seriesNames[count] = this.getProperAttributeNameValue(seriesJson[i], "Name");
			this.m_legendNames[count] = m_formattedDisplayName;
			this.m_seriesColors[count] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));
			this.m_seriesDataLabelProperty[count] = this.getProperAttributeNameValue(seriesJson[i], "DataLabelCustomProperties");
			if (this.m_seriesDataLabelProperty[count] !== undefined) {
			    if (IsBoolean(this.m_seriesDataLabelProperty[count].useFieldColor)) {
			        this.m_seriesDataLabelProperty[count].dataLabelFontColor = this.m_seriesColors[count];
			    }
			    if(IsBoolean(this.m_seriesDataLabelProperty[count].dataLabelUseComponentFormater)){
			    	this.m_seriesDataLabelProperty[count].datalabelFormaterCurrency = this.m_unit;
			    	this.m_seriesDataLabelProperty[count].datalabelFormaterPrecision = this.m_precision;
			    	this.m_seriesDataLabelProperty[count].datalabelFormaterPosition = this.m_signposition;
			    	this.m_seriesDataLabelProperty[count].datalabelFormaterUnit = this.m_secondaryunit;
			    }
			} else {
			    this.m_seriesDataLabelProperty[count] = this.getDataLabelProperties();
			}
			var radius = this.getProperAttributeNameValue(seriesJson[i], "RadiusField");
			this.m_radiusField[count] = ((radius != undefined && radius !== null && radius !== "") && (radius != this.m_categoryNames[0])) ? (radius) : this.m_seriesNames[count];
			//var colorField = (this.isHexaColor(this.getProperAttributeNameValue(seriesJson[i], "ColorField"))?(""):(this.getProperAttributeNameValue(seriesJson[i], "ColorField")));	  //get color from drop-down
			var colorField = this.getProperAttributeNameValue(seriesJson[i], "ColorField");
			this.m_colorField[this.m_seriesNames[count]] = (colorField != undefined && colorField !== null && colorField !== "") ? colorField : ""; 
			var transparency = this.getProperAttributeNameValue(seriesJson[i], "PlotTransparency");
			this.m_transparency[count] = (transparency != undefined && transparency !== null && transparency !== "") ? transparency : tra;
			var tempMap = {
				"seriesName" : this.m_seriesNames[count],
				"displayName" : this.m_seriesDisplayNames[count],
				"color" : this.m_seriesColors[count],
				"shape" : "point",
				"index": count
			};
			this.legendMap[this.m_seriesNames[count]] = tempMap;
			count++;
		}
	}
	this.setLegendsIntialLoad(this.m_defaultlegendfields);
};

BubbleChart.prototype.isHexaColor=function(sNum){
	return (typeof sNum === "string") && isNaN( parseInt(sNum, 16) );
};
/** @description Getter Method of LegendInfo . **/
BubbleChart.prototype.getLegendInfo = function () {
	return this.legendMap;
};
/** @description Getter Method of AllSeriesNames. **/
BubbleChart.prototype.getAllSeriesNames = function () {
	return this.m_allSeriesNames;
};
/** @description Getter for All Category names**/
BubbleChart.prototype.getAllCategoryNames = function () {
	return this.m_allCategoryNames;
};
/** @description Getter Method of SeriesNames. **/
BubbleChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};
/** @description Getter Method of Series DisplayName. **/
BubbleChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};
/** @description Getter Method of SeriesColors. **/
BubbleChart.prototype.getSeriesColors = function () {
	return this.m_seriesColors;
};

BubbleChart.prototype.setPlotRadiusData = function () {
	this.m_plotRadiusData = [];
	for (var i = 0, length = this.m_radiusField.length; i < length ; i++) {
		this.m_plotRadiusData[i] = this.getRadiusFromJSON(this.m_radiusField[i], this.getSeriesNames()[i]);
	}
};

BubbleChart.prototype.getPlotRadiusData = function () {
	return this.m_plotRadiusData;
};

BubbleChart.prototype.getRadiusFromJSON = function (fieldName, seriesName) {
	var data = [];
	for (var i = 0, length = this.getDataProvider().length; i < length ; i++) {
		if (this.getDataProvider()[i][fieldName] == undefined || this.getDataProvider()[i][fieldName] == "undefined")
			data[i] = this.getDataProvider()[i][seriesName];
		else
			data[i] = this.getDataProvider()[i][fieldName];
	}
	return data;
};
/** @description Setter Method of Category and Series Data **/
BubbleChart.prototype.setCategorySeriesData = function() {
    this.m_categoryData = [];
    this.m_seriesData = [];
    this.m_seriesDataForToolTip = [];
    this.m_displaySeriesDataFlag = [];
    this.m_seriesDataForDataLabel = [];
    this.m_plotRadiusData = [];
    this.m_colorFieldData = [];
    this.m_transparencyarr =[];
    for (var k = 0, length = this.getDataProvider().length; k < length; k++) {
        var record = this.getDataProvider()[k];
        this.isEmptyCategory = true;
        if (this.getCategoryNames().length > 0) {
            this.isEmptyCategory = false;
            for (var i = 0; i < this.getCategoryNames().length; i++) {
                if (!this.m_categoryData[i])
                    this.m_categoryData[i] = [];
                var data = this.getValidFieldDataFromRecord(record, this.getCategoryNames()[i]);
                this.m_categoryData[i][k] = data;
            }
        }

        this.m_displaySeriesDataFlag[k] = [];
        for (var j = 0, innerlength = this.getSeriesNames().length; j < innerlength; j++) {
            if (!this.m_seriesData[j]) {
                this.m_seriesData[j] = [];
                this.m_seriesDataForToolTip[j] = [];
                this.m_seriesDataForDataLabel[j] = [];
                this.m_transparencyarr[j] = [];
            }
            var data = this.getValidFieldDataFromRecord(record, this.getSeriesNames()[j]);
            var dataFordatalabel = this.getValidFieldDataFromRecord(record, this.m_seriesDataLabelProperty[j].datalabelField);
            this.m_displaySeriesDataFlag[k][j] = true;
            if (isNaN(data)) {
                this.m_displaySeriesDataFlag[k][j] = false;
                data = getNumericComparableValue(data);
            }
            this.m_seriesData[j][k] = data;
            this.m_seriesDataForToolTip[j][k] = data;
            this.m_seriesDataForDataLabel[j][k] = dataFordatalabel;
            this.m_transparencyarr[j][k] = this.m_transparency[j];
        }
        for (var m = 0, innerlength = this.getSeriesNames().length; m < innerlength; m++) {
            if (!this.m_colorFieldData[m]) {
                this.m_colorFieldData[m] = [];
            }
            var serName = (this.m_colorField[this.getSeriesNames()[m]] != "") ? (this.m_colorField[this.getSeriesNames()[m]]) : this.getSeriesNames()[m];
            var data = this.getValidFieldDataFromRecord(record, serName);
            if (data == "" || data == "null")
                data = 0;
            if (isNaN(data)) {
                data = getNumericComparableValue(data);
            }
            this.m_colorFieldData[m][k] = data;
        }
        for (var l = 0, innerlength = this.m_radiusField.length; l < innerlength; l++) {
            if (!this.m_plotRadiusData[l])
                this.m_plotRadiusData[l] = [];
            var data = (this.getValidAltFieldDataFromRecord(record, this.m_radiusField[l], this.getSeriesNames()[l]));
            this.m_plotRadiusData[l][k] = ((!this.isCheckRadiusWithDataSet(this.m_radiusField[l]) && !IsBoolean(this.m_designMode))) ? (this.m_radiusField[l] * 1) : (data);
            /**Added for fixed radius, for null or garbage data bubble should not draw.*/
            if (IsBoolean(isNaN(data) || (data === ""))) {
                if (data == undefined)
                    this.m_plotRadiusData[l][k] = 0;
                else
                    this.m_plotRadiusData[l][k] = getNumericComparableValue(data);
            }
        }
    }
    /**Added to get actual value for data label*/
    this.m_seriesactualdatafordatalabel = this.m_seriesData;
};

BubbleChart.prototype.isCheckRadiusWithDataSet = function (field) {
	var isAvailabelRadiusFieldOnDataSet = false;
	for(var i = 0, length = this.allDataSetFieldNameArray.length; i < length; i++) {
		if(this.allDataSetFieldNameArray[i] == field)
			isAvailabelRadiusFieldOnDataSet = true;
	}
	return isAvailabelRadiusFieldOnDataSet;
};
/** @description Setter Method of Category Data. **/
BubbleChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	this.isEmptyCategory = true;
	if (this.getCategoryNames().length > 0) {
		this.isEmptyCategory = false;
		for (var i = 0, length = this.getCategoryNames().length; i < length; i++) {
			this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
		}
	}
};
/** @description Getter Method of Category Data. **/
BubbleChart.prototype.getCategoryData = function () {
	return convertArrayType(this.m_categoryData);
};
/** @description Setter Method of Series Data. **/
BubbleChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0, length = this.getSeriesNames().length; i < length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
};
/** @description Getter Method of Series Data. **/
BubbleChart.prototype.getSeriesData = function () {
	return convertArrayType(this.m_seriesData);
};
/** @description Setter Method of All FieldsName. **/
BubbleChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0, len = this.getAllCategoryNames().length; i < len; i++) {
		this.m_allfieldsName.push(this.getAllCategoryNames()[i]);
	}
	for (var j = 0, length = this.getAllSeriesNames().length; j < length; j++) {
		this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
	}
};
/** @description Setter Method for set All Fields DisplayName. **/
BubbleChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0, len = this.getCategoryDisplayNames().length; i < len; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0, length = this.getSeriesDisplayNames().length; j < length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};
/** @description Getter Method of All FieldsDisplayName. **/
BubbleChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};
/** @description Getter Method of All FieldsName. **/
BubbleChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

BubbleChart.prototype.setSeriesColor = function (m_seriesColor) {
	this.m_seriesColor = m_seriesColor;
};
/** @description getter Method of SeriesColor. **/
BubbleChart.prototype.getSeriesColor = function () {
	return this.m_seriesColor;
};
/** @description Setter Method of LegendNames. **/
BubbleChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};
/** @description Getter Method of LegendNames. **/
BubbleChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};

BubbleChart.prototype.setAllDataSetFeildsName = function () {
	var arr = this.getDataProvider();
	this.allDataSetFieldNameArray = [];
	/** Added to resolve the problem of empty series value 
	 * when any series contains any empty value that selected as radius field then bubble radius should be zero */
 	try {
		var val = _.chain(arr).map(_.keys).flatten().unique().value();
 		this.allDataSetFieldNameArray = val;
 	}catch (e){
		for(var key in arr[0]){
			this.allDataSetFieldNameArray.push(key);
		}
	}
};

/** @description initialization of BubbleChart **/
BubbleChart.prototype.init = function () {
	// this.setCategoryData();
	// this.setSeriesData();
	this.setAllDataSetFeildsName();
	this.setCategorySeriesData();
	// this.setPlotRadiusData();
	// this.setRadiusField();
	this.setAllFieldsName();
	this.setAllFieldsDisplayName();
	this.isSeriesDataEmpty();
	this.setShowSeries(this.getAllFieldsName());
	this.visibleSeriesInfo=this.getVisibleSeriesData(this.getSeriesData());
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);
	if (!IsBoolean(this.m_isEmptySeries) && IsBoolean(this.isVisibleSeries()) && (!IsBoolean(this.isEmptyCategory))) {
		this.m_categoryData = this.getCatDataInFormat(this.m_categoryData);
		var tooltipDataArr = getDuplicateArray(this.m_seriesData);/**Added to show Garbage Data in tool tip*/
		this.m_tooltipseriesdata = this.getSerDataInFormat(tooltipDataArr, false);
		this.m_seriesData = this.getSerDataInFormat(this.m_seriesData, true);
		this.setColorsForSeries();
		this.updateSeriesDataForCalculation();
		this.initializeCalculation();
		this.initializeBubble();
		this.m_xAxis.init(this, this.m_calculation);
		this.m_yAxis.init(this, this.m_calculation);
	}
    /**Old Dashboard directly previewing without opening in designer*/
	this.initializeToolTipProperty();
	this.m_tooltip.init(this);
};
/** @description Setter Method of PlotRadiusData. **/
BubbleChart.prototype.setRadiusField = function () {
	for (var i = 0, length = this.m_plotRadiusData.length; i < length ; i++){
		for (var j = 0, innerlength = this.m_plotRadiusData[0].length; j < innerlength; j++){
			if (isNaN(this.m_plotRadiusData[i][j])) {
				if (this.m_plotRadiusData[i][j] == undefined)
					this.m_plotRadiusData[i][j] = 0;
				else
					this.m_plotRadiusData[i][j] = getNumericComparableValue(this.m_plotRadiusData[i][j]);
			}
		}
	}
};
/** @description Getter Method to Get Data in Category Format. **/
BubbleChart.prototype.getCatDataInFormat = function (data) {
	var arr = [];
	for (var i = 0, length = data[0].length; i < length ; i++) {
		arr[i] = [];
		for (var j = 0, innerlength = data.length; j < innerlength; j++) {
			arr[i][j] = data[j][i];
		}
	}
	return arr;
};
/** @description Getter Method to Get Data in Series Format. **/
BubbleChart.prototype.getSerDataInFormat = function (data, dataFlag) {
	var arr = [];
	this.m_displaySeriesDataFlag = [];
	for (var i = 0, length = data[0].length; i < length ; i++) {
		arr[i] = [];
		this.m_displaySeriesDataFlag[i] = [];
		for (var j = 0, innerlength = data.length; j < innerlength; j++) {
			this.m_displaySeriesDataFlag[i][j] = true;
			if (isNaN(data[j][i]) && IsBoolean(dataFlag)) {
				this.m_displaySeriesDataFlag[i][j] = false;
				arr[i][j] = getNumericComparableValue(data[j][i]);
				if (isNaN(arr[i][j]))
					arr[i][j] = 0;
			} else {
				arr[i][j] = (data[j][i]);
			}
			//arr[i][j] = data[j][i];
		}
	}
	return arr;
};
/** @description Drawing of chart started by drawing different parts of chart like ChartFrame,Title,SubTitle **/
BubbleChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	var map = this.IsDrawingPossible();
	if (IsBoolean(map.permission)) {
		this.drawXAxis();
		this.drawYAxis();
		this.drawColorBands();
		this.drawBubbleChart();
		this.drawDataLabel();
	} else {
		this.drawMessage(map.message);
	}
};
/** @description Will Draw Legend  if showLegend set to true **/
BubbleChart.prototype.drawLegends = function () {
	this.drawChartLegends();
	if (IsBoolean(this.m_legendFlag) || this.m_legendFlag == undefined) {
		this.drawLegendComponent();
//		this.m_legendFlag = false;
	} else {
		this.m_legendFlag = true;
	}
};
/** @description Will Draw Legend Content div if showLegend set to true and remove if it is already there **/
BubbleChart.prototype.drawChartLegends = function () {
	var temp = this;
	if (IsBoolean(this.getShowLegends()) || IsBoolean(this.m_showcolorbandlegends)) {
		this.drawLegendIcon();
		if (!IsBoolean(this.m_designMode))
			this.drawLegendContentDiv();
	} else {
		$("#legendIcon" + temp.m_objectid).remove();
	}
};
/** @description Create Legend Content Div **/
BubbleChart.prototype.drawLegendContentDiv = function () {
	var temp = this;
	var legendDisplayNames;
	var legendColor;
	var rangeDisplayNames = (!IsBoolean(this.m_showdynamicrange)) ? (this.m_rangedseriesdisplaynames.split(",")) : (["Min","Max"]);
	var rangeSeriesColorForLegends = (!IsBoolean(this.m_showdynamicrange)) ? (this.m_rangedseriescolors.split(",")) : ([this.m_minrangecolor,this.m_maxrangecolor]);
	var rangeSeriesColorForLegendsInHexadecimal = [];
	for (var i = 0, length = rangeSeriesColorForLegends.length; i < length ; i++){
		rangeSeriesColorForLegendsInHexadecimal[i] = convertColorToHex(rangeSeriesColorForLegends[i]);
	}

	if ((IsBoolean(this.m_showcolorbandlegends)) && (rangeDisplayNames[0] !="") && (rangeSeriesColorForLegends[0] !="")) {
		legendDisplayNames = rangeDisplayNames;
		legendColor = rangeSeriesColorForLegendsInHexadecimal;
	} else {
		legendDisplayNames = this.getLegendNames();
		legendColor = this.getSeriesColors();
	}

	var div = this.getLegendContentDiv();
	var legendTable = "<table class=\"legend\">";
	for (var j = 0, len = legendDisplayNames.length; j < len ; j++) {
		var shape = "point";
		var orgShape = this.getHTMLShape(shape);
		legendTable += "<tr style=\"font-style:" + this.m_legendfontstyle + ";color:" + convertColorToHex(this.m_legendfontcolor) + ";text-decoration:" + this.m_legendtextdecoration + ";font-weight:" + this.m_legendfontweight + ";font-family:" + selectGlobalFont(this.m_legendfontfamily) + "\">"+
							"<td>"+this.drawLegendShape(orgShape,legendColor[j])+ "<span  style=\"display:inline;\">" + legendDisplayNames[j] + "</span></td></tr>";
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
		$(div).toggle("hide");
	}
};
/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
BubbleChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};
/** @description  initialization of draggable div and its inner Content **/
BubbleChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};
/** @description Getter Method of Series Data **/
BubbleChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};
/** @description Edit in Series Data for Calculation **/
BubbleChart.prototype.updateSeriesDataForCalculation = function () {
	for (var i = 0, length = this.m_seriesNames.length; i < length ; i++) {
		this.m_updateSeriesValue[i] = [];
		for (var j = 0, innerlength = this.m_seriesData.length; j < innerlength; j++) {
			var val = (checkNumeric(this.m_seriesData[j][i]) * 1);
			if (isNaN(val) || val == "" || val == "null") {
				this.m_updateSeriesValue[i][j] = 0;
			} else {
				this.m_updateSeriesValue[i][j] = val;
			}
		}
	}
};
/** @description initialize the calculation  of the BubbleChart. **/
BubbleChart.prototype.initializeCalculation = function () {
	/** Added for enable common marker for repeater chart */
	var seriesData = (IsBoolean(this.m_isRepeaterPart) && IsBoolean(this.m_parentObj.m_repeatercommonmarker)) ? this.getAllSeriesDataForRepeater() : this.getVisibleSeriesData(this.m_updateSeriesValue).seriesData;
	this.calculateMinMax(seriesData);
	this.calculateFinalMinMax();
	this.setChartDrawingArea();
	this.m_calculation.init(this.m_calculation, this.m_categoryData, this.m_updateSeriesValue,this.m_colorFieldData, this);
	this.m_xPositionArray = this.m_calculation.getXPosition();
	this.m_yPositionArray = this.m_calculation.getYPosition();
	this.m_radius = this.m_calculation.getBubbleRadius();
	var color = this.m_calculation.getBubbleSeriesColor();
	this.setColor(color);
//	this.color = this.m_calculation.getBubbleSeriesColor();
//	for (var k = 0, i1 = 0; i1 < this.m_seriesNames.length; i1++) {
//		if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i1]])) {
//			this.m_bubbleSeries[this.m_seriesNames[i1]] = new BubbleSeries();
//			this.m_bubbleSeries[this.m_seriesNames[i1]].init(this.color[i1], this.m_radius[i1], this.m_xPositionArray, this.m_yPositionArray[k], this.m_updateSeriesValue[k],this.m_transparency[i1], this);
//			k++;
//		}
//	}
};

BubbleChart.prototype.calculateMinMax = function (yAxisData) {
	
	this.calculateMax = yAxisData[0][0];
	this.calculateMin = yAxisData[0][0];
	var data = [];
	for (var i = 0, k = 0, length = yAxisData.length; i < length ; i++) {
		for (var j = 0; j < yAxisData[i].length; j++) {
			data[k++] = (yAxisData[i][j]);
		}
	}
	var sortedData = data.sort(numOrdA);
	this.calculateMin = sortedData[0];
	for (var i = 0, length = yAxisData.length ; i < length; i++) {
		for (var j = 0, datalength = yAxisData[i].length ; j < datalength; j++) {
			if (1 * (yAxisData[i][j]) > this.calculateMax) {
				this.calculateMax = 1 * (yAxisData[i][j]);
			}
			if (1 * (yAxisData[i][j]) < this.calculateMin) {
				this.calculateMin = 1 * (yAxisData[i][j]);
			}
		}
	}
};

BubbleChart.prototype.calculateFinalMinMax = function () {
	var calculatedMin = this.calculateMin;
	var calculatedMax = this.calculateMax;

	var obj=this.getCalculateNiceScale(calculatedMin,calculatedMax,this.m_basezero,this.m_autoaxissetup,this.m_minimumaxisvalue,this.m_maximumaxisvalue,(this.m_height));
	this.min=obj.min;
	this.max=obj.max;
	this.yAxisNoOfMarker=obj.markerArray.length;
	this.m_yAxisText=obj.step;
	this.m_yAxisMarkersArray=obj.markerArray;
};


BubbleChart.prototype.getColor = function () {
	return this.m_updateSeriesColorsArray;
};

BubbleChart.prototype.setColor = function (serColor) {
	this.m_updateSeriesColorsArray = [];
	if(IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)){
		this.m_updateSeriesColorsArray = serColor;
	}else{
		if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && this.getCategoryColors().getCategoryColor().length > 0 && IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName())) {
			var categoryColors = this.getCategoryColors().getCategoryColorsForCategoryNames(this.getCategoryData()[0], this.m_categoryFieldColor);
			for (var i = 0, outerLength = serColor.length; i < outerLength; i++) {
				this.m_updateSeriesColorsArray[i] = [];
				for (var j = 0, innerLength = serColor[0].length; j < innerLength; j++) {
					this.m_updateSeriesColorsArray[i][j] = categoryColors[j];
				}
			}
		}
		else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && (!IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName()) || this.getCategoryColors().getCategoryColor().length == 0) && this.getConditionalColors() != "" && this.getConditionalColors() != undefined && this.getConditionalColors().getConditionalColor().length > 0) {
			var conditionalColors = this.getConditionalColors().getBubbleConditionalColorsForConditions(this.getSeriesNames(), serColor, this.m_seriesData, this);
			this.m_updateSeriesColorsArray = conditionalColors;
		}
		else {
			this.m_updateSeriesColorsArray = serColor;
		}
	}
};

/** @Description Will return all series data for repeater chart **/
BubbleChart.prototype.getAllSeriesDataForRepeater = function () {
	var repeaterSeriesData = [];
	for (var j = 0; j < this.m_parentObj.m_seriesNames.length; j++) {
		repeaterSeriesData[j] = []
		if (IsBoolean(this.m_parentObj.m_seriesVisibleArr[this.m_parentObj.m_seriesNames[j]])) {
			for (var k = 0; k < this.m_parentObj.m_dataProvider.length; k++) {
				var val = removeCommaFromSrting(this.m_parentObj.m_dataProvider[k][this.m_parentObj.m_seriesNames[j]]);
				repeaterSeriesData[j][k] = val;
			}
		}
	}
	return repeaterSeriesData;
};

BubbleChart.prototype.initializeBubble = function () {
	this.m_valueTextSeries = {};
	this.color = this.getColor();
	for (var k = 0, i1 = 0, length = this.m_seriesNames.length; i1 < length; i1++) {
		if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i1]])) {
			this.m_bubbleSeries[this.m_seriesNames[i1]] = new BubbleSeries();
			this.m_bubbleSeries[this.m_seriesNames[i1]].init(this.color[i1], this.m_radius[i1], this.m_xPositionArray, this.m_yPositionArray[k], this.m_updateSeriesValue[k],this.m_transparencyarr[i1], this);//this.m_transparency[i1]
			 /**@Description of initialize data label */
            if (IsBoolean(this.m_seriesDataLabelProperty[i1].showDataLabel)) {
                this.m_valueTextSeries[this.m_seriesNames[i1]] = new ValueTextSeries();
                this.m_valueTextSeries[this.m_seriesNames[i1]].init(this.m_xPositionArray, this.m_yPositionArray[k], this, this.m_seriesDataForDataLabel[i1], this.m_seriesDataLabelProperty[i1],this.m_seriesactualdatafordatalabel[i1]);
            };
			k++;
		}
	}
};
/** @Description getter method of ColorsForSeries  **/
BubbleChart.prototype.getColorsForSeries = function () {
	return this.m_seriesColorsArray;
};
/** @Description Setter method of Colors For Series  **/
BubbleChart.prototype.setColorsForSeries = function () {
	this.m_seriesColorsArray = [];
	if (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) {
		for (var i = 0, length = this.m_seriesData[0].length; i < length ; i++) {
			this.m_seriesColorsArray[i] = [];
			for (var j = 0, innerlength = this.m_seriesData.length; j < innerlength; j++)
				this.m_seriesColorsArray[i][j] = this.m_drillColor;
		}
	} else {
		var seriesColors = this.getSeriesColors();
		for (var i = 0, length = this.m_seriesData[0].length; i < length ; i++) {
			this.m_seriesColorsArray[i] = [];
			for (var j = 0, innerlength = this.m_seriesData.length; j < innerlength; j++) {
				this.m_seriesColorsArray[i][j] = seriesColors[i];
			}
		}
	}
};
/** @description will draw the title of the BubbleChart. **/
BubbleChart.prototype.drawTitle = function () {
	this.m_title.draw();
};
/** @description will draw the SubTitle of the BubbleChart. **/
BubbleChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};
/** @description will draw the XAxis  of the BubbleChart. **/
BubbleChart.prototype.drawXAxis = function () {
	this.m_xAxis.drawTickMarks();
	this.m_xAxis.drawVerticalLine();
	this.m_xAxis.markXaxis();
	this.m_xAxis.drawXAxis();
};
/** @description will draw the YAxis  of the BubbleChart. **/
BubbleChart.prototype.drawYAxis = function () {
	if (IsBoolean(this.m_showmarkerline))
		this.m_yAxis.horizontalMarkerLines();
	if (IsBoolean(this.m_zeromarkerline) && !IsBoolean(this.m_basezero) && IsBoolean(this.m_yAxis.hasNegativeAxisMarker(this.m_yAxisMarkersArray)))
		this.m_yAxis.zeroMarkerLine();
	this.m_yAxis.markYaxis();
	this.m_yAxis.drawYAxis();
};
/** @description will draw the YAxis  of the BubbleChart. **/
BubbleChart.prototype.drawColorBands = function () {
	if (IsBoolean(this.m_showcolorbands)) {
		this.getBandColors();
	}
};
/** @Description getter method of BandColors and will be draw Band Colors  **/
BubbleChart.prototype.getBandColors = function () {

	var startX = this.m_calculation.startX;
	var startY = this.m_calculation.startY;
	var endX = this.m_calculation.endX;
	var endY = this.m_calculation.endY;
	var bandcolors = this.m_bandcolors.split(",");
	var bandalphas = this.m_bandalphas.split(",");
	this.bandcolors = [];
	for (var j = 0, length = bandcolors.length; j < length ; j++) {
		var hexcolor = convertColorToHex(bandcolors[j]);
		this.bandcolors[j] = hex2rgb(hexcolor, bandalphas[j]);
	}
	var bandrange = this.m_colorbandranges.split(",");
	this.bandRangeArr = [];
	for (var i = 0, length = bandrange.length; i < length ; i++) {
		var temp;
		if (i == 0) {
			temp = bandrange[i] - this.m_calculation.minValue() * 1;
			this.bandRangeArr[i] = (temp < 0) ? 0 : temp;
		} else{
			/**DAS-1291 */
			var minVal = this.m_calculation.minValue() * 1;
			temp =  bandrange[i] - bandrange[i - 1];
			this.bandRangeArr[i] = (temp < minVal) ? minVal : temp;
		}
			
	}
	var avilableHeight = this.m_calculation.getMaxValue() - this.m_calculation.minValue();
	this.newBandRange = this.getDisplayBandRange(this.bandRangeArr, avilableHeight);
	for (var k = 0, length = this.bandcolors.length; k < length ; k++) {
		this.ctx.beginPath();
		this.ctx.rect(startX, (startY - this.newBandRange[k] * this.m_calculation.getEachBubblePix()), endX - startX, (this.newBandRange[k] * this.m_calculation.getEachBubblePix()));
		this.ctx.fillStyle = this.bandcolors[k];
		this.ctx.fill();
		this.ctx.linewidth = "0.2";
		this.ctx.strokeStyle = "#ccc";
		this.ctx.stroke();
		this.ctx.closePath();
		startY = startY - (this.newBandRange[k] * this.m_calculation.getEachBubblePix());
	}
};
/** @Description getter method of Band Range **/
BubbleChart.prototype.getDisplayBandRange = function (bandrangeArray, height) {
	var remainingHeight = height;
	for (var i = 0, length = bandrangeArray.length; i < length ; i++) {
		if (remainingHeight > bandrangeArray[i])
			remainingHeight = remainingHeight - bandrangeArray[i];
		else {
			if (remainingHeight != 0) {
				bandrangeArray[i] = remainingHeight;
				remainingHeight = 0;
			} else
				bandrangeArray[i] = 0;
		}
	}
	return bandrangeArray;
};

BubbleChart.prototype.getNewBandRange = function (bandrangeArray, flagForNegativeValue) {
	for (var i = 0, length = bandrangeArray.length; i < length ; i++) {
		if ((IsBoolean(flagForNegativeValue)) && (!IsBoolean(this.m_basezero))) {
			if (i == 0) {
				bandrangeArray[i] = bandrangeArray[i] - this.m_minimumaxisvalue * 1;
			}
		} else {
			if ((this.m_minimumaxisvalue != 0) && (!IsBoolean(this.m_basezero))) {
				if ((bandrangeArray[i] >= this.m_minimumaxisvalue) && (i == 0)) {
					bandrangeArray[i] = bandrangeArray[i] - this.m_minimumaxisvalue * 1;
				} else if ((bandrangeArray[i] <= this.m_minimumaxisvalue) && (i == 1)) {
					var a = this.m_minimumaxisvalue * 1 - bandrangeArray[i - 1];
					bandrangeArray[i - 1] = 0;
					bandrangeArray[i] = bandrangeArray[i] - a;
				}
			}
		}
	}
	return bandrangeArray;
};
/** @Description getter method of Array of Sum  **/
BubbleChart.prototype.getSumOfArray = function (arr) {
	var sum = 0;
	for (var i = 0, length = arr.length; i < length ; i++) {
		sum = sum * 1 + arr[i];
	}
	return sum;
};
/** @Description Getter method to set Negative Value On YAxis **/
BubbleChart.prototype.getFlagForNegativeValueOnYAxis = function (yAxisMarkingArray) {
	var flag = false;
	for (var i = 0, length = yAxisMarkingArray.length; i < length ; i++) {
		if (yAxisMarkingArray[i] < 0)
			flag = true;
	}
	return flag;
};
/** @description will draw the ChartFrame  of the BubbleChart. **/
BubbleChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

BubbleChart.prototype.drawBubbleChart = function () {
	for (var i = 0, length = this.m_seriesNames.length; i < length ; i++) {
		if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
			this.m_bubbleSeries[this.m_seriesNames[i]].drawBubbleSeries();
		}
	}
};
/** @description Will Draw BubbleChart Data Label on canvas for visibleSeries **/
BubbleChart.prototype.drawDataLabel = function() {
	/**Added for Data Label Overlap issue*/
	this.m_overlappeddatalabelarrayY = [];
	this.m_overlappeddatalabelarrayX = [];
    for (var i = 0, length = this.m_seriesNames.length; i < length; i++) {
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
            if (IsBoolean(this.m_seriesDataLabelProperty[i].showDataLabel)) {
                this.m_valueTextSeries[this.m_seriesNames[i]].drawValueTextSeries();
            }
        }
    }
};
/** @description Setter Method for set StartX position of BubbleChart **/
BubbleChart.prototype.setStartX = function () {
	this.yaxisLabelFont = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
	this.yaxisDescriptionFont = this.m_yAxis.m_fontstyle + " " + this.m_yAxis.m_fontweight + " " + this.fontScaling(this.m_yAxis.m_fontsize) + "px " + selectGlobalFont(this.m_yAxis.m_fontfamily);
	var btdm = this.getBorderToDescriptionMargin();
	var dm = this.getYAxisDescriptionMargin();
	var dtlm = this.getDescriptionToLabelMargin();
	var ltam = this.getLabelToAxisMargin();
	var lm = this.getYAxisLabelMargin();
	this.m_startX = this.m_x * 1 + btdm * 1 + dm * 1 + dtlm * 1 + lm * 1 + ltam * 1 + this.m_axisToChartMargin ;
};
/** @description Getter Method return YAxis LabelMargin of AreaChart **/
BubbleChart.prototype.getYAxisLabelMargin = function () {
	var lm = 0;
	var lfm = this.getLabelFormatterMargin();
	this.setLabelWidth();
	var lw = this.getLabelWidth();
	var lsm = this.getLabelSignMargin();
	var lpm = this.getLabelPrecisionMargin();
	var lsfm = this.getLabelSecondFormatterMargin();
	lm = lfm * 1 + lw * 1 + lsm * 1 + lpm * 1 + lsfm * 1;
	return lm;
};
/** @description  return Label Formatter Margin  **/
BubbleChart.prototype.getLabelFormatterMargin = function () {
	var lfm = 0;
	if (!IsBoolean(this.m_fixedlabel)) {
		if (IsBoolean(this.m_yAxis.getLeftaxisFormater())) {
			if (this.m_formater != "none" && this.m_formater != "")
				if (this.m_unit != "none" && this.m_unit != "") {
					var unit = this.m_util.getFormatterSymbol(this.m_formater, this.m_unit);
					this.ctx.beginPath();
					this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
					lfm = this.ctx.measureText(unit).width;
					this.ctx.closePath();
				}
		}
	}
	return lfm;
};
/** @description  getter method of LabelWidth  **/
BubbleChart.prototype.getLabelWidth = function () {
	return this.m_labelwidth;
};
/** @description  Setter method of LabelWidth  **/
BubbleChart.prototype.setLabelWidth = function () {
	this.m_labelwidth = 0;
	var maxSeriesVals = [];
	if (this.fontScaling(this.m_yAxis.m_labelfontsize) > 0) {
		for(var i = 0, length = this.m_yAxisMarkersArray.length; i < length; i++) {
	    	var maxSeriesVal = this.m_yAxisMarkersArray[i];
			if (!IsBoolean(this.m_fixedlabel)) {
				if (IsBoolean(this.m_yAxis.getLeftaxisFormater())) {
					if (this.getSecondaryFormater() != "none" && this.getSecondaryFormater() != "") {
						if (this.getSecondaryUnit() != "none" && this.getSecondaryUnit() != "") {
							var secondunit = this.m_util.getFormatterSymbol(this.getSecondaryFormater(), this.getSecondaryUnit());
							if (this.getSecondaryUnit() == "auto" && this.m_unit == "Rupees") {
								maxSeriesVal = getNumberFormattedNumericValue(maxSeriesVal * 1, this.m_precision, this.m_unit);
							} else if (this.getSecondaryUnit() == "auto") {
								maxSeriesVal = getNumberFormattedNumericValue(maxSeriesVal * 1);
							} else if (this.getSecondaryUnit() !== "none") {
								maxSeriesVal = this.m_util.updateTextWithFormatter(maxSeriesVal, secondunit, this.m_precision);
							}
						}
					}
					if(maxSeriesVal !== 0){
						if(this.m_precision !== "default")
						maxSeriesVal = this.m_yAxis.setPrecision(maxSeriesVal, this.m_precision);
					}
				}
				maxSeriesVal = getFormattedNumberWithCommas(maxSeriesVal, this.m_numberformatter);
				this.ctx.beginPath();
				this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
				maxSeriesVals[i] =  this.ctx.measureText(maxSeriesVal).width;
				this.ctx.closePath();
			}
		}
	    this.m_labelwidth = getMaxValueFromArray(maxSeriesVals);	
	}
};
/** @description  getter method of Label's SignMargin  **/
BubbleChart.prototype.getLabelSignMargin = function () {
	var lsm = 0;
	var msvw = 0;
	var minSeriesValue = this.min;
	if (minSeriesValue < 0) {
		this.ctx.beginPath();
		this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
		var msvw = this.ctx.measureText(minSeriesValue).width;
		this.ctx.closePath();
	}

	if (this.getLabelWidth() < msvw)
		lsm = this.ctx.measureText("-").width;

	return lsm;
};
/** @description  getter method of Label's PrecisionMargin  **/
BubbleChart.prototype.getLabelPrecisionMargin = function () {
	//var lpm = 5;
	var lpm = 0;
	/**
	 * When axis is set as Auto, min marker is 500M and max marker is 3B, 
	 */
	if (this.getSecondaryUnit() == "auto") {
		this.ctx.beginPath();
		this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
		var precisionText = ".0";
		lpm = this.ctx.measureText(precisionText).width;
		this.ctx.closePath();
	}
	return lpm;
};
/** @description  getter method of Label SecondFormatter Margin  **/
BubbleChart.prototype.getLabelSecondFormatterMargin = function () {
	var lsfm = 0;
	if (!IsBoolean(this.m_fixedlabel)) {
		if (IsBoolean(this.m_yAxis.getLeftaxisFormater())) {
			if (this.getSecondaryFormater() != "none" && this.getSecondaryFormater() != "") {
				if (this.getSecondaryUnit() != "none" && this.getSecondaryUnit() != "") {
					if (this.getSecondaryUnit() != "auto") {
						var secondunit = this.m_util.getFormatterSymbol(this.getSecondaryFormater(), this.getSecondaryUnit());
					} else if (this.getSecondaryUnit() == "auto" && this.m_unit == "Rupees") {
						var secondunit = getNumberFormattedSymbol(this.max * 1, this.m_unit);
					} else {
						var secondunit = "K";
					}
					this.ctx.font = this.m_yAxis.m_fontstyle + " " + this.m_yAxis.m_fontweight + " " + this.fontScaling(this.m_yAxis.m_fontsize) + "px " + selectGlobalFont(this.m_yAxis.m_fontfamily);
					lsfm = this.ctx.measureText(secondunit).width;
				}
			}
		}
	}
	return lsfm;
};
/** @description  getter method of Formatter Margin  **/
BubbleChart.prototype.getFormatterMargin = function () {
	var unitwidth = 0;
	var secondunitwidth = 0;
	var precisionMargin = 4;
	if (!IsBoolean(this.m_fixedlabel)) {
		if (IsBoolean(this.m_yAxis.getLeftaxisFormater())) {
			if (this.m_formater != "none" && this.m_formater != "")
				if (this.m_unit != "" && this.m_unit != "none") {
					var unit = this.m_util.getFormatterSymbol(this.m_formater, this.m_unit);
					unitwidth = this.ctx.measureText(unit).width;
				}
			if (this.getSecondaryFormater() != "none" && this.getSecondaryFormater() != "")
				if (this.getSecondaryUnit() != "" && this.getSecondaryUnit() != "none") {
					secondunit = this.m_util.getFormatterSymbol(this.getSecondaryFormater(), this.getSecondaryUnit());
					secondunitwidth = this.ctx.measureText(secondunit).width;
				}
		}
	}
	return (unitwidth * 1 + secondunitwidth * 1 + precisionMargin * 1);
};
/** @description  Setter method of AreaChart for set EndX position.**/
BubbleChart.prototype.setEndX = function () {
	var blm = this.getBorderToLegendMargin();
	var vlm = this.getVerticalLegendMargin();
	var vlxm = this.getVerticalLegendToXAxisMargin();
	var rightSideMargin = blm * 1 + vlm * 1 + vlxm * 1;
	this.m_endX = (this.m_x * 1 + this.m_width * 1 - rightSideMargin * 1 - this.m_axisToChartMargin);
};
/** @description  Setter method of AreaChart for set StartY position.**/
BubbleChart.prototype.setStartY = function () {
	var cm = this.getChartMargin();
	var xlbm = this.getXAxisLabelMargin();
	var xdm = this.getXAxisDescriptionMargin();
	var bottomMargin = cm * 1 + xlbm * 1 + xdm * 1;
	this.m_startY = (this.m_y * 1 + this.m_height * 1 - bottomMargin * 1 - this.m_axisToChartMargin);
};
/** @description  getter method of XAxis Label Margin  **/
BubbleChart.prototype.getXAxisLabelMargin = function () {
	var xAxislabelDescMargin = this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.8;;
	var radians = this.m_xAxis.m_labelrotation * (Math.PI / 180);
	if (IsBoolean(this.m_xAxis.getLabelTilted())) {
		this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
		//xAxislabelDescMargin = this.ctx.measureText(this.m_categoryData[0][0]).width;
		for (var i = 0, length = this.m_categoryData.length; i < length; i++) {
			/*if(xAxislabelDescMargin<this.ctx.measureText(this.m_categoryData[0][i]).width)
			xAxislabelDescMargin=this.ctx.measureText(this.m_categoryData[0][i]).width;*/
			if (xAxislabelDescMargin <  Math.abs(this.ctx.measureText(this.m_categoryData[i][0]).width * radians))
				xAxislabelDescMargin =  Math.abs(this.ctx.measureText(this.m_categoryData[i][0]).width * radians);
		}
		if (xAxislabelDescMargin > this.m_height / 4) {
			xAxislabelDescMargin = (this.m_xAxis.getLabelrotation() <= 70) ? (this.m_height / 4 - 15) : this.m_height / 4;
		}
	} else {
		this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
		var xlm = this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.8;
		this.noOfRows = this.setNoOfRows();
		xAxislabelDescMargin = (xlm) * this.noOfRows;
	}
	return xAxislabelDescMargin;
};
/** @description Setter method for set no of rows for draw x-axis labels. **/
BubbleChart.prototype.setNoOfRows = function () {
	this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
	var noOfRow = 1;
	if (!IsBoolean(this.isEmptyCategory)) {
		var textWidth = this.ctx.measureText(this.m_categoryData[0][0]).width;
		var xDivision = (this.getEndX() - this.getStartX()) / this.m_categoryData.length;
		for (var i = 0, length = this.m_categoryData.length; i < length ; i++) {
			for (var j= 0, datalength = this.m_categoryData[i].length; j < datalength ; j++) {
				if (this.ctx.measureText(this.m_categoryData[i][j]).width > xDivision) {
					noOfRow = 2;
					break;
				}
			}
		}
	}
	return noOfRow;
};
/** @description Setter method for set EndY position. **/
BubbleChart.prototype.setEndY = function () {
	this.m_endY = (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1 + this.getRadiusMargin() * 1 + this.m_axisToChartMargin);
};
/** @description Getter method for Radius Margin. **/
BubbleChart.prototype.getRadiusMargin = function () {
	return (this.maxRadius / 2);
};
/** @description Getter method for Bubble Series Color Tooltip. **/
BubbleChart.prototype.getBubbleSeriesColorForTooltip = function () {
	var ColorMangerForTooltip = [];
	for (var i = 0, length = this.m_seriesData.length; i < length ; i++) {
		ColorMangerForTooltip[i] = [];
		for (var j = 0, datalength = this.m_seriesData[i].length; j < datalength ; j++) {
			ColorMangerForTooltip[i][j] = this.color[j][i];
		}
	}
	return ColorMangerForTooltip;
};
/** @description Getter method For Tooltip Data. **/
BubbleChart.prototype.getToolTipData = function (mouseX, mouseY) {
	var toolTipData;
	var radiusArr = this.getVisibleRadiusArr().RadiusArray;
	if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory) && IsBoolean(this.isVisibleSeries()) && IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None") && (radiusArr.length > 0)) {
		var data = [];
		var isNaNValue;
		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			var seriesData = this.m_tooltipseriesdata;
			for (var i = 0, length = this.m_xPositionArray.length; i < length ; i++) {
				for (var k = 0, datalength = this.m_yPositionArray.length; k < datalength ; k++) {
					if (mouseX <= (this.m_xPositionArray[i] * 1 + radiusArr[k][i] * 1) && (mouseX >= this.m_xPositionArray[i] * 1 - radiusArr[k][i] * 1) && mouseY <= (this.m_yPositionArray[k][i] * 1 + radiusArr[k][i] * 1) && (mouseY >= this.m_yPositionArray[k][i] * 1 - radiusArr[k][i] * 1)) {
						toolTipData = {};
						toolTipData.cat = "";
						toolTipData["data"] = new Array();
						toolTipData.cat = this.getCategoryData()[0][i];
						if (this.m_customtextboxfortooltip.dataTipType == "Default"){
							for (var l = 0, j = 0, innerLength = this.getSeriesNames().length; j < innerLength; j++) {
							  isNaNValue = false;
							  var newVal;
								if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[j]])) {
									var data = [];
									//data[0] = this.getBubbleSeriesColorForTooltip()[i][j];
									data[0] = {"color":this.getBubbleSeriesColorForTooltip()[i][j],"shape":this.legendMap[this.getSeriesNames()[j]].shape};
									data[1] = this.getSeriesDisplayNames()[j];
									if (seriesData[i][j] == "" || isNaN(seriesData[i][j]) || seriesData[i][j] == null || seriesData[i][j] == "null") {
										newVal = seriesData[i][j];
										isNaNValue = true;
									} else {
										var num = seriesData[i][j] * 1;
										if (num % 1 != 0 && this.m_tooltipprecision !== "default") {
											newVal = num.toFixed(this.m_tooltipprecision);
										} else {
											newVal = seriesData[i][j] * 1;
										}
									}
									var FormterData = this.getUpdatedFormatterForToolTip(newVal, this.getSeriesNames()[j]);
									data[2] = FormterData;
									toolTipData.data[l] = data;
									l++;
								}
							}
							toolTipData.highlightIndex = this.getDrillColor(mouseX, mouseY, radiusArr);
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
		}
		else {
			this.hideToolTip();
		}
		return toolTipData;
	}
};
/***Added to resolve visible color & radius issue*/
BubbleChart.prototype.getVisibleRadiusArr = function (){
	var tooltipObj = {
		"RadiusArray" : [],
		"ColorArray" : []
	};
	var RadiusArray = [];
	var ColorArray = [];
	for (var i = 0; i < this.m_seriesNames.length; i++) {
		if (this.m_seriesVisibleArr[this.m_seriesNames[i]]) {
			RadiusArray.push(this.m_radius[i]);
			ColorArray.push(this.getColor()[i]);
		}
	}
	tooltipObj["RadiusArray"] = RadiusArray;
	tooltipObj["ColorArray"] = ColorArray;
	return tooltipObj;
}
/** @description Getter method For DrillColor. **/
BubbleChart.prototype.getDrillColor = function (mouseX, mouseY, radiusArray) {
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory)))) {
		var xPositions = this.m_calculation.getXPosition();
		var yPositions = this.m_calculation.getYPosition();

		if ((mouseX >= this.getStartX() && mouseX <= this.getEndX()) && (mouseY <= this.getStartY() && mouseY >= this.getEndY())) {
			for (var i = 0, length = xPositions.length; i < length ; i++) {
				for (var k = yPositions.length - 1; k >= 0; k--) {
					if (mouseX <= (xPositions[i] * 1 + radiusArray[k][i] * 1) && (mouseX >= xPositions[i] * 1 - radiusArray[k][i] * 1) && mouseY <= (yPositions[k][i] * 1 + radiusArray[k][i] * 1) && (mouseY >= yPositions[k][i] * 1 - radiusArray[k][i] * 1)) {
						return k;
					}
				}
			}
		}
	}
};
/** @description Getter method For DrillDataPoints. **/
BubbleChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory))) && IsBoolean(this.isVisibleSeries())) {
		var xPositions = this.m_calculation.getXPosition();
		var yPositions = this.m_calculation.getYPosition();
		var radiusArr = this.getVisibleRadiusArr().RadiusArray;
		var VisibleColorArr = this.getVisibleRadiusArr().ColorArray;
		if ((mouseX >= this.getStartX() && mouseX <= this.getEndX()) && (mouseY <= this.getStartY() && mouseY >= this.getEndY())) {
			/**Updated for proper indexing from right to left*/
			for (var i =  xPositions.length-1; i >= 0 ; i--) {
				for (var k = yPositions.length - 1; k >= 0; k--) {
					if (mouseX <= (xPositions[i] * 1 + radiusArr[k][i] * 1) && (mouseX >= xPositions[i] * 1 - radiusArr[k][i] * 1) && mouseY <= (yPositions[k][i] * 1 + radiusArr[k][i] * 1) && (mouseY >= yPositions[k][i] * 1 - radiusArr[k][i] * 1)) {
						if(IsBoolean(this.enableDrillHighlighter)){
							for(var a = 0; a < this.m_transparencyarr.length; a++){
								for(var b = 0; b < this.m_transparencyarr[0].length; b++){
									if(IsBoolean(this.m_drilltoggle)){
										this.m_transparencyarr[a][b] = 0.5;//this.m_transparencyarr[a][b] = 0.5;
									} else {
										this.m_transparencyarr[a][b] = 1;
									}
								}
								this.m_transparencyarr[a][i] = 1;//this.m_transparency[a];
							}
							this.initializeBubble();
							this.drawChart();
						}
						/*if(IsBoolean(this.m_drilltoggle)){
							this.m_drilltoggle = false;
						} else {
							this.m_drilltoggle = true;
						}*/
						this.m_drilltoggle = false;
						var fieldNameValueMap = this.getFieldNameValueMap(i);
						/**Clicked color drills as the bubble-fill-color not series color.*/
						var drillColor = VisibleColorArr[k][i];
						var drillCategory = this.m_categoryNames;
						var drillCategoriesValue = [];
						for(var a=0;a<drillCategory.length;a++){
							drillCategoriesValue.push(fieldNameValueMap[drillCategory[a]]);
						}
						var drillField = this.visibleSeriesInfo.seriesName[k];
						var drillDisplayField = this.visibleSeriesInfo.seriesDisplayName[k];
						var drillValue = fieldNameValueMap[drillField];
						fieldNameValueMap.drillField = drillField;
						fieldNameValueMap.drillDisplayField = drillDisplayField;
						fieldNameValueMap.drillValue = drillValue;
						fieldNameValueMap.drillIndex = i;
						fieldNameValueMap.drillCategoriesNames = drillCategory;
						fieldNameValueMap.drillCategory = drillCategoriesValue;
						return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
					}
				}
			}
		}
	}
};

/** @description Constructor function  of BubbleCalculation class. **/
function BubbleCalculation() {
	this.startX;
	this.startY;
	this.endX;
	this.endY;
	this.xAxisData = [];
	this.yAxisData = [];
	this.xPositionArray = [];
	this.yPositionArray = [];
	this.ratio = [];
	this.radius = [];
	this.m_bubbleSeriesColor = [];
	this.m_yAxisMarkersArray = [];
	this.m_numberOfMarkers = 6;
	this.rangeSeries = "";
	this.bubbleColorMap = new Object();
	this.m_Mid = [];
	this.m_Low = [];
	this.m_High = [];
	this.colorManager = "";
	this.rangeSeriesColor = [];
	this.rangeOfSeries = [];
	this.lowColor = "";
	this.midColor = "";
	this.highColor = "";
	this.spaceFromYAxis = "";
	this.m_range = [];
	this.m_range1 = [];
	this.m_range2 = [];
};
/** @description initialization of  BubbleCalculation. **/
BubbleCalculation.prototype.init = function (globalCalculation, xAxisData, yAxisData, colorFieldData, chartRef) {
	this.startX = chartRef.getStartX();
	this.startY = chartRef.getStartY();
	this.endX = chartRef.getEndX();
	this.endY = chartRef.getEndY();
	this.xAxisData = xAxisData;
	this.allYAxisData = yAxisData;
	this.m_colorfielddata = colorFieldData;
	this.yAxisData = chartRef.getVisibleSeriesData(yAxisData).seriesData;
	this.spaceFromYAxis = (this.endX - this.startX) / (this.xAxisData.length * 2);

	this.m_chart = chartRef;
	this.minRadius = this.m_chart.minRadius;
	this.maxRadius = this.m_chart.maxRadius;
	this.calculateBubbleRadius();
	this.setRangeSeriesColor();
	this.setMaxMinFormSeriesData();
	this.setRanges();
	this.createColorRange();
	this.updateColorManager();
	this.setXPosition();
	this.setYPosition();
};
/** @description Setter method For Set Max and Min value from Series Data. **/
BubbleCalculation.prototype.setMaxMinFormSeriesData = function () {
	this.serMaxVal = this.serMinVal = 0;
	var singletonFlag = true;
	for(var i = 0, outerLength = this.m_colorfielddata.length; i < outerLength; i++){
		for(var j = 0, innerLength = this.m_colorfielddata[i].length; j < innerLength; j++ ){
			if(this.m_colorfielddata[i][j] != undefined || this.m_colorfielddata[i][j] !=null || this.m_colorfielddata[i][j] !=""){
				if(singletonFlag){
					this.serMaxVal = this.serMinVal = this.m_colorfielddata[i][j]*1;
					singletonFlag = false;
				}
				if(this.serMaxVal*1 <= this.m_colorfielddata[i][j]*1)
					this.serMaxVal = this.m_colorfielddata[i][j]*1;
				if(this.serMinVal*1 >= this.m_colorfielddata[i][j]*1)
					this.serMinVal = this.m_colorfielddata[i][j]*1; 
			}
		}
	}
};
/** @description Getter method For MaxValue. **/
BubbleCalculation.prototype.getMaxValue = function () {
	return this.m_chart.max;
};
/** @description Getter method For MinValue. **/
BubbleCalculation.prototype.minValue = function () {
	return this.m_chart.min;
};
/** @description Getter method For SeriesRadiusField. **/
BubbleCalculation.prototype.getSeriesRadiusField = function () {
	return this.m_chart.m_radiusField;
};
/** @description calculateBubbleRadius method For calculating bubble radius.Calculating radius between min radius and max radius. **/
BubbleCalculation.prototype.calculateBubbleRadius = function() {
    var seriesDataArray = this.m_chart.getPlotRadiusData();
    var duplicateSeriesDataArray = seriesDataArray.slice(0); // creates the duplicate of seriesdata
    for (var k = 0, length = this.m_chart.m_radiusField.length; k < length; k++) {
        if ((!this.m_chart.isCheckRadiusWithDataSet(this.m_chart.m_radiusField[k]) && !IsBoolean(this.m_chart.m_designMode))) {
            var newArray = duplicateSeriesDataArray.splice(k, 1); // removes the series data which are having radius field as numeric
        }
    }
    var array = duplicateSeriesDataArray;
    var list = _.reduceRight(array, function(a, b) { //  this method for merging into single array
        return a.concat(b);
    }, []);
    var max = _.max(list, function(val) { // underscore method for max value
        return (val === "" || val === undefined || val == null) ? undefined : val * 1;
    });
    var min = _.min(list, function(val) { // underscore method for min value
        return (val === "" || val === undefined || val == null) ? undefined : val * 1;
    });
    this.radius = [];
    for (var i = 0, length = this.m_chart.m_radiusField.length; i < length; i++) {
        this.radius[i] = [];
        var arr = this.m_chart.getPlotRadiusData()[i];
        for (var j = 0; j < arr.length; j++) {
            if ((!this.m_chart.isCheckRadiusWithDataSet(this.m_chart.m_radiusField[i]) && !IsBoolean(this.m_chart.m_designMode))) {
            	/**Added for fixed radius, for null or garbage data bubble should not draw.*/
                if (IsBoolean(isNaN(arr[j]) || arr[j] === "")) {
                    this.radius[i][j] = 0;
                } else {
                    this.radius[i][j] = (this.m_chart.m_radiusField[i] > this.maxRadius) ? this.maxRadius : this.m_chart.m_radiusField[i];
                }

            } else {
                var rad = 0;
                if (arr[j] !== "" && arr[j] !== undefined && arr[j] !== null && arr[j] !== 'null' && !isNaN(arr[j] * 1)) {
                    var ratio = (this.maxRadius - this.minRadius) / (max * 1 - min * 1);
                    if (ratio == Infinity) {
                        rad = this.maxRadius;
                    } else {
                        rad = this.minRadius + (arr[j] * 1 - min * 1) * ratio;
                    }
                }
                this.radius[i][j] = (rad > this.maxRadius) ? this.maxRadius : rad;
            }
        }
    }
};
/** @description Getter method to get max value from given array. **/
BubbleCalculation.prototype.getMaxFromArray = function (arr) {
	var max = 0;
	for (var i = 0, datalength = arr.length; i < datalength; i++) {
		if (max <= arr[i])
			max = arr[i];
	}
	return max;
};
/** @description Setter method For Set Range Series Color. **/
BubbleCalculation.prototype.setRangeSeriesColor = function () {
	var rangeSeriesColorArray = this.m_chart.m_rangedseriescolors.split(",");
	for (var i = 0, datalength = rangeSeriesColorArray.length; i < datalength; i++) {
		this.rangeSeriesColor[i] = convertColorToHex(rangeSeriesColorArray[i]);
	}
};
/** @description Setter method For set range and min range value and max range value. **/
BubbleCalculation.prototype.setRanges = function () {
	this.m_range = this.m_chart.m_rangesofseries.split(",");
	for (var i = 0, length = this.m_range.length; i < length; i++) {
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
/** @description createColorRange method For create color range and make a gradient on canvas area. **/
BubbleCalculation.prototype.createColorRange = function () {
	this.m_drawingWidth= this.endX*1 - this.startX*1;
	this.m_minRange = (!IsBoolean(this.m_chart.m_showdynamicrange)) ?([this.m_range1.min(), this.m_range2.min()].min()) : (this.serMinVal);
	this.m_maxRange =  (!IsBoolean(this.m_chart.m_showdynamicrange)) ?([this.m_range1.max(), this.m_range2.max()].max()) : (this.serMaxVal);
	var grad = this.m_chart.ctx.createLinearGradient(0, 0, this.m_drawingWidth, 0);
	if(IsBoolean(this.m_chart.m_showdynamicrange)){
		var color = [];
		color[0] = this.m_chart.m_minrangecolor;
		color[1] = this.m_chart.m_maxrangecolor;
		for (var i = 0; i < color.length; i++) {
			var mark;
			if(i==0){
				mark = 0;
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
					grad.addColorStop(0, this.rangeSeriesColor[i]);
				else if (i == this.m_range.length - 1)
					grad.addColorStop(1, this.rangeSeriesColor[i]);
				else {
					var stop = this.m_range1[i] - this.m_minRange;
					mark = stop / rangeDiff;
					if(!isNaN(mark)){
						grad.addColorStop( mark, this.rangeSeriesColor[i]);
					}
				}
			}
		} else {
			if (IsBoolean(this.m_highervaluesaregood)) {
				grad.addColorStop(0, "#FFFFFF");
				grad.addColorStop(1, this.rangeSeriesColor[0]);
			} else {
				grad.addColorStop(0, this.rangeSeriesColor[0]);
				grad.addColorStop(1, "#FFFFFF");
			}
		}
	}
	this.m_chart.ctx.beginPath();
	this.m_chart.ctx.fillStyle = grad;
	this.m_chart.ctx.fillRect(0, 0, this.m_drawingWidth, this.m_chart.m_height * 1);
	this.m_chart.ctx.fill();
	this.m_chart.ctx.closePath();
};
/** @description updateColorManager method for update series color with series color or range color....**/
BubbleCalculation.prototype.updateColorManager = function () {
	this.m_bubbleSeriesColor = [];
	for (var i = 0, outerLength = this.m_colorfielddata.length; i < outerLength; i++) {
		this.m_bubbleSeriesColor[i] = [];
		for (var j = 0, innerLength = this.m_colorfielddata[i].length; j < innerLength; j++) {
			if(IsBoolean(this.m_chart.m_enablecolorfromdrill) && IsBoolean(this.m_chart.m_startDrill)){
				this.m_bubbleSeriesColor[i][j] = this.m_chart.m_seriesColorsArray[i][j];
			}else {
				if (this.m_colorfielddata[i][j] != null &&  this.m_colorfielddata[i][j] !== "" && this.m_colorfielddata[i][j] != undefined && !isNaN(this.m_colorfielddata[i][j])) {
					if(IsBoolean(this.m_chart.m_showdynamicrange) || !IsBoolean(this.m_chart.m_solidcolorfill) || this.m_chart.m_colorField[this.m_chart.getSeriesNames()[i]] == ""){
						/** Gradient fill for dynamic-range and gradient fill for user defined range**/
						if(this.m_chart.m_colorField[this.m_chart.getSeriesNames()[i]] == ""){
							this.m_bubbleSeriesColor[i][j] = this.m_chart.m_seriesColors[i];
						}else{
							if ((this.m_colorfielddata[i][j] * 1 < this.m_minRange ) || (this.m_colorfielddata[i][j] * 1 > this.m_maxRange)){
								this.m_bubbleSeriesColor[i][j] = this.m_chart.m_defaultfillcolor;
							}else{
								var percent = ((this.m_colorfielddata[i][j] - this.m_minRange) / (this.m_maxRange - this.m_minRange)) * this.m_drawingWidth * this.m_chart.getDevicePixelRatio();
								if (this.m_colorfielddata[i][j] * 1 < this.m_minRange){
									percent = 0.01;
								}else if(this.m_colorfielddata[i][j] * 1 >= this.m_maxRange){
									percent = (this.m_drawingWidth * this.m_chart.getDevicePixelRatio())- this.m_adjustpixel;
								}
								var col = this.m_chart.ctx.getImageData(percent | 0, this.m_chart.m_height / 2, 1, 1).data;
								var rgbColor = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
								this.m_bubbleSeriesColor[i][j] = rgb2hex(rgbColor);
							}
						}
					}else{
						/* Solid fill for user defined range*/
						var percent = this.m_colorfielddata[i][j] * 1;
						for (var k = 0; k < this.m_range.length; k++) {
							if ((k == 0 && percent < this.m_range1[k]) || (k == this.m_range.length - 1 && percent >= this.m_range2[k])){
								this.m_bubbleSeriesColor[i][j] = this.m_chart.m_defaultfillcolor;
							}
							if (percent >= this.m_range1[k] && percent < this.m_range2[k]){
								this.m_bubbleSeriesColor[i][j] = this.rangeSeriesColor[k];
								break;
							}
						}
					}
				}else {
					this.m_bubbleSeriesColor[i][j] = this.m_chart.m_defaultfillcolor;
				}
			}
		}
	}		
};
/** @description Getter method For BubbleSeriesColor. **/
BubbleCalculation.prototype.getBubbleSeriesColor = function () {
	return this.m_bubbleSeriesColor;
};
/** @description Setter setRadiusForDefaultCase method for set radius in default case...**/
BubbleCalculation.prototype.setRadiusForDefaultCase = function () {
	for (var i = 0, length = this.yAxisData.length; i < length; i++) {
		this.radius[i] = [];
		for (var j = 0, datalength = this.yAxisData[i].length; j < datalength; j++) {
			if (this.yAxisData[i][j] == 0) {
				this.radius[i][j] = this.minRadius;
			} else {
				this.ratio = (this.getMaxValue()) / this.yAxisData[i][j];
				this.radius1 = ((this.maxRadius - this.minRadius)) / this.ratio;
				this.radius[i][j] = this.minRadius + this.radius1;
			}
		}
	}
};
/** @description Getter method for get max value from given array. **/
BubbleCalculation.prototype.getgetMaxValueFromArray = function (dataArray) {
	var max = 0;
	for (var i = 0,length=dataArray.length; i < length; i++)
		if (max * 1 < dataArray[i] * 1)
			max = dataArray[i];
	return max;
};
/** @description Getter method for get BubbleRadius. **/
BubbleCalculation.prototype.getBubbleRadius = function () {
	return this.radius;
};
/** @description Getter method for yAxis text **/
BubbleCalculation.prototype.getYAxisText = function () {
	return this.m_chart.m_yAxisText;
};
/** @description Getter method for XAxis Div**/
BubbleCalculation.prototype.getXAxisDiv = function () {
	if (this.xAxisData.length > 1)
		this.xAxisDiv = (this.endX - this.startX) / (this.xAxisData.length - 1);
	else
		this.xAxisDiv = (this.endX - this.startX) / (this.xAxisData.length);
	return this.xAxisDiv;
};
/** @description Getter method for EachBubblePix**/
BubbleCalculation.prototype.getEachBubblePix = function () {
	return (this.startY - this.endY) / (this.getMaxValue() * 1 - this.minValue() * 1);
};
/** @description Getter method for YAxisMarkersArray**/
BubbleCalculation.prototype.getYAxisMarkersArray = function () {
	return this.m_chart.m_yAxisMarkersArray;
};
/** @description Getter method for XPosition**/
BubbleCalculation.prototype.getXPosition = function () {
	return this.xPositionArray;
};
/** @description Setter method for XPosition**/
BubbleCalculation.prototype.setXPosition = function () {
	this.xPositionArray = [];
	for (var i = 0, length = this.xAxisData.length; i < length; i++) {
		this.xPositionArray[i] = this.startX * 1 + (2 * i + 1) * (this.spaceFromYAxis);
	}
};
/** @description Getter method for YPosition**/
BubbleCalculation.prototype.getYPosition = function () {
	return this.yPositionArray;
};
/** @description Setter method for YPosition**/
BubbleCalculation.prototype.setYPosition = function () {
	this.yPositionArray = [];
	for (var i = 0, length = this.yAxisData.length ; i < length; i++) {
		this.yPositionArray[i] = [];
		for (var j = 0, datalength = this.yAxisData[i].length ; j < datalength; j++) {
			if (this.yAxisData[i][j] === "" || isNaN(this.yAxisData[i][j]) || this.yAxisData[i][j] == null || this.yAxisData[i][j] == "null") {
				this.yPositionArray[i][j] = "";
			} else {
				this.yPositionArray[i][j] = (this.startY) - ((this.getEachBubblePix()) * (this.yAxisData[i][j] - this.minValue()));
			}
		}
	}
};

/** @description Constructor function  of BubbleSeries class. **/
function BubbleSeries() {
	this.color;
	this.xPositionArray = [];
	this.yPositionArray = [];
	this.m_bubble = [];
	this.ctx = "";
	this.m_chart = "";
};
/** @description initialization of  BubbleSeries. **/
BubbleSeries.prototype.init = function (color, radius, xPositionArray, yPositionArray, seriesData,transparency, m_chart) {
	this.m_color = color;
	this.m_radius = radius;
	this.m_xPositionArray = xPositionArray;
	this.m_yPositionArray = yPositionArray;
	this.m_seriesData = seriesData;
	this.m_transparency = transparency;
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;

	for (var i = 0, length = this.m_seriesData.length ; i < length; i++) {
		this.m_bubble[i] = new Bubble();
		this.m_bubble[i].init(this.m_color[i], this.m_radius[i], this.m_xPositionArray[i], this.m_yPositionArray[i],this.m_transparency[i], this.ctx, this.m_chart);
	}
};
/** @description check the point that is in Range or not. **/
BubbleSeries.prototype.isInRange = function (i) {
	if (this.m_yPositionArray[i] > this.m_chart.getStartY() || this.m_yPositionArray[i] <= this.m_chart.getEndY() - 0.1)
		return true;
	else
		return false;
};
/** @description draw bubble series for bubble chart **/
BubbleSeries.prototype.drawBubbleSeries = function () {
	for (var i = 0, length = this.m_seriesData.length ; i < length; i++) {
		if (!this.isInRange(i))
			this.m_bubble[i].drawBubble();
	}
};

/** @description Constructor function  of Bubble class. **/
function Bubble() {
	this.color;
	this.radius;
	this.xPosition;
	this.yPosition;
	this.ctx = "";
};
/** @description initialization of  Bubble. **/
Bubble.prototype.init = function (color, radius, xPosition, yPosition,m_transparency, ctx, chartRef) {
	this.ctx = ctx;
	this.color = color;
	this.radius = radius;
	this.xPosition = xPosition;
	this.yPosition = yPosition;
	this.transparency = m_transparency;
	this.m_chart = chartRef;
	if (this.yPosition == "")
		this.radius = 0;

};
/** @description draw Bubble on canvas **/
Bubble.prototype.drawBubble = function () {
	if (this.m_chart.m_chartbase == undefined || this.m_chart.m_chartbase == "plane")
		this.drawPlainBubble();
	else if (this.m_chart.m_chartbase == "ring")
		this.drawRingBubble();
	else
		this.drawGradientBubble();
};
/** @description draw PlainBubble on canvas **/
Bubble.prototype.drawPlainBubble = function () {
	this.ctx.beginPath();
	this.drawBubbleShadow();
	this.radius = (this.radius < 0) ? this.m_chart.minRadius : this.radius;

	var luminanceColor = this.getColorValue();
	this.ctx.fillStyle = hex2rgb(this.color, this.transparency);
	this.ctx.arc(this.xPosition, this.yPosition, this.radius, 0, Math.PI * 2, false);
	this.ctx.fill();
	this.ctx.closePath();
};
/** @description draw RingBubble  on canvas **/
Bubble.prototype.drawRingBubble = function () {
	this.ctx.beginPath();
	this.drawBubbleShadow();
	this.radius = (this.radius < 0) ? this.m_chart.minRadius : this.radius;
	this.ctx.lineWidth = "5";
	this.ctx.strokeStyle = hex2rgb(this.color, this.transparency);
	this.ctx.arc(this.xPosition, this.yPosition, this.radius, 0, Math.PI * 2, false);
	this.ctx.stroke();
	this.ctx.closePath();
};
/** @description draw GradientBubble  on canvas **/
Bubble.prototype.drawGradientBubble = function () {
	//	this.ctx.beginPath();
	//	this.drawBubbleShadow();
	//	this.radius = (this.radius < 0) ? this.m_chart.minRadius : this.radius ;
	//
	//	var luminanceColor = this.getColorValue();
	//	var gradient = this.ctx.createRadialGradient(this.xPosition+this.radius/4,this.yPosition, this.radius/10, this.xPosition,this.yPosition, this.radius);
	//	gradient.addColorStop(0.1, luminanceColor);
	//	gradient.addColorStop(0.8, hex2rgb(this.color,this.m_chart.m_transparency));
	//	this.ctx.fillStyle = gradient;
	//	this.ctx.strokeStyle = this.color;
	//	this.ctx.arc(this.xPosition,this.yPosition,this.radius,0,Math.PI*2,false);
	//	this.ctx.fill();
	//	this.ctx.stroke();
	//	this.ctx.closePath();

	this.ctx.beginPath();
	this.drawBubbleShadow();
	this.radius = (this.radius < 0) ? this.m_chart.minRadius : this.radius;

	var luminanceColor = this.getColorValue();
	var gradient = hex2rgb(this.color, this.transparency);
	try {
		gradient = this.ctx.createRadialGradient(this.xPosition - this.radius / 2, this.yPosition - this.radius / 2, this.radius / 10, this.xPosition, this.yPosition, this.radius);
		gradient.addColorStop(0.1, hex2rgb(luminanceColor, this.transparency));
		gradient.addColorStop(0.8, hex2rgb(this.color, this.transparency));
	} catch (e) {
		console.log(e);
	}
	this.ctx.fillStyle = gradient;
	this.ctx.arc(this.xPosition, this.yPosition, this.radius, 0, Math.PI * 2, false);
	this.ctx.fill();
	this.ctx.closePath();
};
/** @description draw BubbleShadow on canvas **/
Bubble.prototype.drawBubbleShadow = function () {
	if (IsBoolean(this.m_chart.m_shadowvisible)) {
		var radius = (this.radius > 0) ? this.radius : 0;
		this.ctx.save(); // Save the state of the context
		this.ctx.fillStyle = ColorLuminance(this.color,  - 0.1); // Sets the fill color
		this.ctx.shadowOffsetX = 1; // Sets the shadow offset x, positive number is right
		this.ctx.shadowOffsetY = 1; // Sets the shadow offset y, positive number is down
		this.ctx.shadowBlur = 3; // Sets the shadow blur size
		this.ctx.shadowColor = ColorLuminance(this.color, -0.5); // Sets the shadow color
		this.ctx.arc(this.xPosition, this.yPosition, radius, 0, Math.PI * 2, false);
		this.ctx.fill(); // Fills the path
		this.ctx.restore(); // Restore the state of the context
	}
};
/** @description Getter method for color value with color luminance **/
Bubble.prototype.getColorValue = function () {
	this.color = (this.color == undefined) ? "#993366" : this.color;
	var luminanceColor = ColorLuminance(this.color, this.m_chart.m_luminance);
	//	creating issue with color like #ff0000
	//	luminanceColor = (this.color == luminanceColor) ? hex2rgb(this.color,0.5) : luminanceColor ;
	return luminanceColor;
};
//# sourceURL=BubbleChart.js
