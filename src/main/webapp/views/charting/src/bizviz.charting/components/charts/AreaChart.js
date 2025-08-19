/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: AreaChart.js
 * @description AreaChart
 **/
function AreaChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();

	this.m_x = 20;
	this.m_y = 320;
	this.m_width = 300;
	this.m_height = 260;
	this.m_radius = 1;
	this.m_areaSeries = [];
	this.m_colorNames = [];
	this.m_areaPointSeries = [];
	this.m_categoryNames = [];
	this.m_seriesNames = [];
	this.m_seriesarr = [];
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_linewidth = "1";

	this.m_fillopacity = 0.5;
	this.m_xPositionArray = [];
	this.m_yPositionArray = [];
	this.m_calculation = new AreaCalculation();
	this.m_xAxis = new Xaxis();
	this.m_yAxis = new Yaxis();
	this.noOfRows = 1; //used for set x-axis text into two rows in non tilted case.
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_seriesDataForDataLabel = [];
};

/** @description Making prototype of chart class to inherit its properties and methods into area chart **/
AreaChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
AreaChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
AreaChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "Chart") {
			for (var chartKey in jsonObject[key]) {
				switch (chartKey) {
				case "xAxis":
					this.parseSubJsonAttributes(jsonObject[key][chartKey], nodeObject.m_xAxis);
					break;
				case "yAxis":
					this.parseSubJsonAttributes(jsonObject[key][chartKey], nodeObject.m_yAxis);
					break;
				case "Title":
					this.parseSubJsonAttributes(jsonObject[key][chartKey], nodeObject.m_title);
					break;
				case "SubTitle":
					this.parseSubJsonAttributes(jsonObject[key][chartKey], nodeObject.m_subTitle);
					break;
				default:
					this.setAttributesValue(jsonObject[key], nodeObject, chartKey);
					break;
				}
			}
		} else {
			this.setAttributesValue(jsonObject, nodeObject, key);
		}
	}
};

/** @description Getter Method of DataProvider **/
AreaChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description Setter Method of Fields according to fieldType **/
AreaChart.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	var categoryJson = [];
	var seriesJson = [];

	for (var i = 0 ,length=fieldsJson.length; i <length; i++) {
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
AreaChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	this.m_allCategoryNames = [];
	this.m_allCategoryDisplayNames = [];
	this.m_categoryVisibleArr = {};
	this.m_categoryFieldColor = [];
	var count = 0;
	// only one category can be set for line chart, preference to first one
	for (var i = 0,length=categoryJson.length; i <length; i++) {
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

/** @description Getter Method of Category Names. **/
AreaChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};

/** @description Getter Method of Category DisplayName. **/
AreaChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

/** @description Getter Method of SeriesColors. **/
AreaChart.prototype.getSeriesColors = function () {
	return this.m_seriesColors;
};

/** @description creating array for each property of fields and storing in arrays **/
AreaChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = [];
	this.m_legendNames = [];
	this.m_seriesVisibleArr = {};
	this.m_plotRadiusArray = [];
	this.m_plotTrasparencyArray = [];
	this.m_plotShapeArray = [];
	this.m_allSeriesDisplayNames = [];
	this.m_allSeriesNames = [];
	this.m_seriesDataLabelProperty = [];
	this.m_lineTypeArray = [];
	this.m_lineWidthArray = [];
	this.legendMap = {};
	var count = 0;
	for (var i = 0; i < seriesJson.length; i++) {
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.m_allSeriesDisplayNames[i] = m_formattedDisplayName;
		this.m_allSeriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		this.m_seriesVisibleArr[this.m_allSeriesNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
		if (IsBoolean(this.m_seriesVisibleArr[this.m_allSeriesNames[i]])) {
			this.m_seriesDisplayNames[count] = m_formattedDisplayName;
			this.m_legendNames[count] = m_formattedDisplayName;
			this.m_seriesNames[count] = this.getProperAttributeNameValue(seriesJson[i], "Name");
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
			var radius = this.getProperAttributeNameValue(seriesJson[i], "PlotRadius");
			this.m_plotRadiusArray[count] = (radius != undefined && radius !== null && radius !== "") ? radius : 2;
			var lineWidth = this.getProperAttributeNameValue(seriesJson[i],"LineWidth");
			this.m_lineWidthArray[count] = (lineWidth != undefined && lineWidth !== null && lineWidth !== "") ? lineWidth : 2 ;
			var lineType = this.getProperAttributeNameValue(seriesJson[i],"LineType");
			this.m_lineTypeArray[count] = (lineType != undefined && lineType !== null && lineType !== "") ? lineType : "simple" ;
			var transparency = this.getProperAttributeNameValue(seriesJson[i], "PlotTransparency");
			this.m_plotTrasparencyArray[count] = (transparency != undefined && transparency !== null && transparency !== "") ? transparency : 1;
			var shape = this.getProperAttributeNameValue(seriesJson[i], "PlotType");
			this.m_plotShapeArray[count] = (shape != undefined && shape !== null && shape !== "") ? shape : "point";
			var tempMap = {
					"seriesName" : this.m_seriesNames[count],
					"displayName" : this.m_seriesDisplayNames[count],
					"color" : this.m_seriesColors[count],
					"shape" : this.m_plotShapeArray[count],
					"transparency" : this.m_plotTrasparencyArray[count],
					"radius" : this.m_plotRadiusArray[count],
					"index": count
			};
			this.legendMap[this.m_seriesNames[count]] = tempMap;
			count++;
		}
	}
	this.setLegendsIntialLoad(this.m_defaultlegendfields);
};
/** @description Getter Method of LegendInfo . **/
AreaChart.prototype.getLegendInfo = function () {
	return this.legendMap;
};

/** @description Getter Method of AllSeriesNames. **/
AreaChart.prototype.getAllSeriesNames = function () {
	return this.m_allSeriesNames;
};

/** @description Getter for All Category names. **/
AreaChart.prototype.getAllCategoryNames = function () {
	return this.m_allCategoryNames;
};

/** @description Getter Method of ToolTip SeriesData . **/
AreaChart.prototype.getToolTipSeriesData = function () {
	return this.m_toolTipSeriesData;
};
/** @description Getter Method of SeriesNames. **/
AreaChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};

/** @description Getter Method of Series DisplayName. **/
AreaChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};

/** @description Setter Method of Category and Series Data **/
AreaChart.prototype.setCategorySeriesData = function () {
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_seriesDataForDataLabel = [];
	this.m_seriesDataForToolTip = [];
	this.m_displaySeriesDataFlag = [];
	for (var k = 0, length=this.getDataProvider().length ; k < length; k++) {
		var record = this.getDataProvider()[k];
		this.isEmptyCategory = true;
		if (this.getCategoryNames().length > 0) {
			this.isEmptyCategory = false;
			for (var i = 0,catlength=this.getCategoryNames().length ; i < catlength ; i++) {
				if( !this.m_categoryData[i] )
					this.m_categoryData[i] = [];
				var data = this.getValidFieldDataFromRecord(record,this.getCategoryNames()[i]);
				this.m_categoryData[i][k] = data;
			}
		}
	
		this.m_displaySeriesDataFlag[k] = [];
		for (var j = 0,serlength=this.getSeriesNames().length ; j < serlength ; j++) {
			if( !this.m_seriesData[j] ){
				this.m_seriesData[j] = [];
				this.m_seriesDataForDataLabel[j] = [];
				this.m_seriesDataForToolTip[j] = [];
			}
			var data = this.getValidFieldDataFromRecord(record,this.getSeriesNames()[j]);
			var dataFordatalabel = this.getValidFieldDataFromRecord(record,this.m_seriesDataLabelProperty[j].datalabelField);
			this.m_displaySeriesDataFlag[k][j] = true;
			if (isNaN(data)) {
				this.m_displaySeriesDataFlag[k][j] = false;
				data = getNumericComparableValue(data);
			}			
			this.m_seriesData[j][k] = data;
			this.m_seriesDataForDataLabel[j][k] = dataFordatalabel;
			this.m_seriesDataForToolTip[j][k] = data;
		}
		
	}
};

/** @description Setter Method of Category Data. **/
AreaChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	this.isEmptyCategory = true;
	if (this.getCategoryNames().length > 0) {
		this.isEmptyCategory = false;
		for (var i = 0,length=this.getCategoryNames().length ; i <length ; i++) {
			this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
		}
	}
};

/** @description Getter Method of Category Data. **/
AreaChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

/** @description Setter Method of Series Data. **/
AreaChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	this.m_seriesDataForToolTip = [];
	for (var i = 0,length=this.getSeriesNames().length ; i < length ; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
		this.m_seriesDataForToolTip[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
};

/** @description Getter Method of SeriesData For ToolTip. **/
AreaChart.prototype.getSeriesDataForToolTip = function () {
	return this.m_seriesDataForToolTip;
};

/** @description Getter Method of Series Data. **/
AreaChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

/** @description Setter Method of All FieldsName. **/
AreaChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getAllCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getAllCategoryNames()[i]);
	}
	for (var j = 0; j < this.getAllSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
	}
};

/** @description Getter Method of All FieldsName. **/
AreaChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

/** @description Setter Method for set All Fields DisplayName. **/
AreaChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

/** @description Getter Method of All FieldsDisplayName. **/
AreaChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

/** @description Setter Method of LegendNames. **/
AreaChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};

/** @description Getter Method of LegendNames. **/
AreaChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};

/** @description Getter for Category Colors**/
AreaChart.prototype.getCategoryColorsForAction = function () {
	return this.m_categoryFieldColor;
};
/** @description Getter for Series Colors**/
AreaChart.prototype.getSeriesColorsForAction = function () {
	return this.m_seriesColors;
};
/** @description will update SeriesValues in case of null and "". **/
AreaChart.prototype.initializeSeriesValues = function () {
	var arr = [];
	for (var i = 0,length=this.m_seriesData[0].length ; i <length ; i++) {
		arr[i] = [];
		for (var j = 0,serLength= this.m_seriesData.length ; j <serLength ; j++) {
			var val = (checkNumeric(this.m_seriesData[j][i]) * 1);
			if (isNaN(val) || val == "" || val == "null") {
				arr[i][j] = 0;
			} else
				arr[i][j] = val;
		}
	}
	this.m_seriesData = arr;
};

/** @description initialization of AreaChart **/
AreaChart.prototype.init = function () {
	this.setCategorySeriesData();
	this.setAllFieldsName();
	this.setAllFieldsDisplayName();
	this.isSeriesDataEmpty();
	this.setShowSeries(this.getAllFieldsName());
	this.visibleSeriesInfo=this.getVisibleSeriesData(this.getSeriesData());

	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);
	if (!IsBoolean(this.m_isEmptySeries) && IsBoolean(this.isVisibleSeries()) && (!IsBoolean(this.isEmptyCategory))) {
		this.initializeCalculation();
		this.setPercentageForHundred();
		this.m_xAxis.init(this, this.m_calculation);
		this.m_yAxis.init(this, this.m_calculation);
		this.basePoint = this.m_calculation.basePoint;
	}
	/**Old Dashboard directly previewing without opening in designer*/
	this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};

/** @description update seriesData if Data having comma separated value. **/
AreaChart.prototype.updateSeriesDataWithCommaSeperators = function () {
	this.m_displaySeriesDataFlag = [];
	for (var i = 0,length= this.m_seriesData.length ; i <length ; i++) {
		this.m_displaySeriesDataFlag[i] = [];
		for (var j = 0,dataLength=this.m_seriesData[i].length ; j < dataLength; j++) {
			this.m_displaySeriesDataFlag[i][j] = true;
			if (isNaN(this.m_seriesData[i][j])) {
				this.m_displaySeriesDataFlag[i][j] = false;
				this.m_seriesData[i][j] = getNumericComparableValue(this.m_seriesData[i][j]);
				this.m_seriesDataForToolTip[i][j] = getNumericComparableValue(this.m_seriesDataForToolTip[i][j]);
			}
		}
	}
};

/** @description Setter method for update value for 100% . **/
AreaChart.prototype.setPercentageForHundred = function () {
	var serData = this.getUpdateSeriesDataWithCategory(this.visibleSeriesInfo.seriesData);
	this.m_SeriesDataInPerForHundredChart;
	var updateValue = [];
	for (var i = 0,length=serData.length ; i <length ; i++) {
		var totalSerData = this.getArraySUM(serData[i]);
		updateValue[i] = [];
		for (var j = 0,datalength=serData[i].length ; j <datalength ; j++) {
			if (serData[i][j] !== "" && (!isNaN(serData[i][j])))
				updateValue[i][j] = (serData[i][j] / totalSerData) * 100;
			else
				updateValue[i][j] = 0;
		}
	}
	if (updateValue.length > 0)
		this.m_SeriesDataInPerForHundredChart = this.getUpdateSeriesDataForHundredPercentageChart(updateValue);
};

/** @description Getter method for get UpdateSeriesData For 100% Chart. **/
AreaChart.prototype.getUpdateSeriesDataForHundredPercentageChart = function (arr) {
	var updatArray = [];
	for (var i = 0,length=arr[0].length ; i <length ; i++) {
		updatArray[i] = [];
		for (var j = 0,arrLength=arr.length ; j <arrLength; j++) {
			updatArray[i][j] = arr[j][i];
		}
	}
	return updatArray;
};

/** @description will return converted array . **/
AreaChart.prototype.getUpdateSeriesDataWithCategory = function (arr) {
	var updateArray = [];
	for (var i = 0,length=arr[0].length ; i <length ; i++) {
		updateArray[i] = [];
		for (var j = 0,arrLength=arr.length ; j <arrLength; j++) {
			updateArray[i][j] = arr[j][i];
		}
	}
	return updateArray;
};

/** @description will return sum of all element of array. **/
AreaChart.prototype.getArraySUM = function (arr) {
	var sum = 0;
	for (var i = 0,length=arr.length ; i <length; i++) {
		if (arr[i] < 0)
			arr[i] = arr[i] * (-1);
		if (!isNaN(arr[i]))
			sum = sum * 1 + arr[i] * 1;
	}
	return sum;
};

/** @description setter method for update isSeriesVisible Array  **/
AreaChart.prototype.setSeriesVisibility = function (isSeriesVisibilityArray) {
	this.isSeriesVisibleArray = isSeriesVisibilityArray;
};

/** @description Drawing of chart started by drawing different parts of chart like ChartFrame,Title,SubTitle **/
AreaChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	var map = this.IsDrawingPossible();
	if (IsBoolean(map.permission)) {
		this.drawXAxis();
		this.drawYAxis();
		this.drawAreaChart();
		this.drawDataLabel();
	} else {
		this.drawMessage(map.message);
	}
};

/** @description  initialization of draggable div and its inner Content **/
AreaChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
AreaChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description will draw the ChartFrame  of the AreaChart. **/
AreaChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

/** @description will draw the XAxis  of the AreaChart. **/
AreaChart.prototype.drawXAxis = function () {
	this.m_xAxis.drawTickMarks();
	this.m_xAxis.drawVerticalLine();
	this.m_xAxis.markXaxis();
	this.m_xAxis.drawXAxis();
};

/** @description will draw the YAxis  of the AreaChart. **/
AreaChart.prototype.drawYAxis = function () {
	if (IsBoolean(this.m_showmarkerline))
		this.m_yAxis.horizontalMarkerLines();
	if (IsBoolean(this.m_zeromarkerline) && !IsBoolean(this.m_basezero) && IsBoolean(this.m_yAxis.hasNegativeAxisMarker(this.m_yAxisMarkersArray)))
		this.m_yAxis.zeroMarkerLine();
	this.m_yAxis.markYaxis();
	this.m_yAxis.drawYAxis();
};

/** @description initialize the calculation  of the AreaChart. **/
AreaChart.prototype.initializeCalculation = function () {
	this.calculateMinimumMaximum();
	this.setChartDrawingArea();
	this.m_calculation.init(this);
	this.m_radius = this.m_lineWidthArray;
	this.m_xPositionArray = this.m_calculation.getXPosition(); //we got here x axis position array
	this.m_yPositionArray = this.m_calculation.getYPosition(); //we got here y axis position array
	this.setColorsForSeries();
	this.initializeTypeCalculation();
	
};

/** @Description calculate the Min/Max value and get required ScaleInfo of The Axis **/
AreaChart.prototype.calculateMinimumMaximum = function () {
	var minMax;
	/** Added for enable common marker for repeater chart */
	var seriesData = (IsBoolean(this.m_isRepeaterPart) && IsBoolean(this.m_parentObj.m_repeatercommonmarker)) ? this.getAllSeriesDataForRepeater() : this.visibleSeriesInfo.seriesData;
	if (this.m_charttype.toLowerCase() == "clustered" || this.m_charttype.toLowerCase() == "overlaid" || this.m_charttype.toLowerCase() == "")
		minMax = this.calculateMinMaxValue(seriesData);
	else
		minMax = this.calculateMinMaxForStack(seriesData);
	var calculatedMin = minMax.min;
	var calculatedMax = minMax.max;

	var niceScaleObj=this.getCalculateNiceScale(calculatedMin,calculatedMax,this.m_basezero,this.m_autoaxissetup,this.m_minimumaxisvalue,this.m_maximumaxisvalue,(this.m_height));
	this.min=niceScaleObj.min;
	this.max=niceScaleObj.max;
	this.yAxisNoOfMarker=niceScaleObj.markerArray.length;
	this.yAxisText=niceScaleObj.step;
	this.m_yAxisMarkersArray=niceScaleObj.markerArray;
};

/** @Description calculate the Min/Max value For Stack **/
AreaChart.prototype.calculateMinMaxForStack = function (yAxisData) {
	var calculateMin,
		calculateMax;
	if (this.m_charttype.toLowerCase() == "stacked") {
		calculateMax = 0;
		calculateMin = 0;
		var data = [];
		for (var i = 0,length=yAxisData[0].length, k = 0; i <length ; i++) {
			var height = 0;
			var negHeight = 0;
			for (var j = 0,dataLength=yAxisData.length; j < dataLength; j++) {
				data[k++] = (yAxisData[j][i] * 1);
				if (yAxisData[j][i] * 1 > 0) {
					height = (height) * 1 + (yAxisData[j][i] * 1) * 1;
				} else {
					negHeight = (yAxisData[j][i] * 1) * 1 + (negHeight) * 1;
				}
			}
			if ((height) >= (calculateMax)) {
				calculateMax = height * 1;
			}
			if ((negHeight * 1) < (calculateMin)) {
				calculateMin = negHeight * 1;
			}
		}
	} else if (this.m_charttype == "100%") {
		calculateMin = 0; 
		calculateMax = 100; 
	}
	return {
		min:calculateMin,
		max:calculateMax
	};
};

/** @Description Will return all series data for repeater chart **/
AreaChart.prototype.getAllSeriesDataForRepeater = function () {
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

/** @Description initialize TypeCalculation of the Area chart **/
AreaChart.prototype.initializeTypeCalculation = function() {
    this.m_areaSeries = {};
    this.m_areaPointSeries = {};
    this.m_valueTextSeries = {};
    if (this.m_charttype.toLowerCase() == "stacked" || this.m_charttype == "100%") {
        for (var k = 0, i1 = 0; i1 < this.m_seriesNames.length; i1++) {

            /** @Description included conditional control statement for removing the mismatch between the series and its parameter **/
            if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i1]])) {

                this.m_areaSeries[this.m_seriesNames[i1]] = new SeriesClass();
                this.m_areaSeries[this.m_seriesNames[i1]].init(this.getColorsForSeries()[k], this.m_xPositionArray, this.m_yPositionArray, this, this.m_plotTrasparencyArray[i1], this.m_lineWidthArray[i1], this.m_lineTypeArray[i1]);

                this.m_areaPointSeries[this.m_seriesNames[i1]] = new AreaPointSeries();
                this.m_areaPointSeries[this.m_seriesNames[i1]].init(this.getColorsForSeries()[k], (this.m_radius[i1] * 1) + 1, this.m_xPositionArray, this.m_yPositionArray[k], this, this.m_plotTrasparencyArray[i1], this.m_plotShapeArray[i1], this.m_plotRadiusArray[i1]);

                /**@Description of initialize data label */
                if (IsBoolean(this.m_seriesDataLabelProperty[i1].showDataLabel)) {
                    this.m_valueTextSeries[this.m_seriesNames[i1]] = new ValueTextSeries();
                    this.m_valueTextSeries[this.m_seriesNames[i1]].init(this.m_xPositionArray, this.m_yPositionArray[k], this, this.m_seriesDataForDataLabel[i1], this.m_seriesDataLabelProperty[i1],this.m_seriesData[i1]);
                };

                k++;
            }

        }
    } else {
        for (var k = 0, i1 = 0; i1 < this.m_seriesNames.length; i1++) {
            /** @Description included conditional control statement for removing the mismatch between the series and its parameter **/
            if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i1]])) {

                this.m_areaSeries[this.m_seriesNames[i1]] = new SeriesClass();
                this.m_areaSeries[this.m_seriesNames[i1]].init(this.getColorsForSeries()[k], this.m_xPositionArray, this.m_yPositionArray[k], this, this.m_plotTrasparencyArray[i1], this.m_lineWidthArray[i1], this.m_lineTypeArray[i1]);

                this.m_areaPointSeries[this.m_seriesNames[i1]] = new AreaPointSeries();
                this.m_areaPointSeries[this.m_seriesNames[i1]].init(this.getColorsForSeries()[k], (this.m_radius[i1] * 1) + 1, this.m_xPositionArray, this.m_yPositionArray[k], this, this.m_plotTrasparencyArray[i1], this.m_plotShapeArray[i1], this.m_plotRadiusArray[i1]);

                /**@Description of initialize data label */
                if (IsBoolean(this.m_seriesDataLabelProperty[i1].showDataLabel)) {
                    this.m_valueTextSeries[this.m_seriesNames[i1]] = new ValueTextSeries();
                    this.m_valueTextSeries[this.m_seriesNames[i1]].init(this.m_xPositionArray, this.m_yPositionArray[k], this, this.m_seriesDataForDataLabel[i1], this.m_seriesDataLabelProperty[i1],this.m_seriesData[i1]);
                };

                k++;
            }
        }
    }
};
/** @Description getter method of ColorsForSeries  **/
AreaChart.prototype.getColorsForSeries = function () {
	return this.m_seriesColorsArray;
};

/** @description get series Radius for only visible series **/
AreaChart.prototype.getVisibleRadiusArr = function() {
	var RadiusArr = [];
	for (var i = 0; i < this.m_seriesNames.length; i++) {
		if (this.m_seriesVisibleArr[this.m_seriesNames[i]]) {
			RadiusArr.push(this.m_plotRadiusArray[i]);
		}
	}
	return RadiusArr;
};

/** @Description Setter method of Colors For Series  **/
AreaChart.prototype.setColorsForSeries = function () {
	this.m_seriesColorsArray = [];
	if (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) {
		for (var i = 0,length=this.visibleSeriesInfo.seriesData.length ; i <length ; i++) {
			this.m_seriesColorsArray[i] = this.m_drillColor;
		}
	} else {
		var seriesColors = this.visibleSeriesInfo.seriesColor;
		for (var i = 0,length= this.visibleSeriesInfo.seriesData.length ; i < length; i++) {
			this.m_seriesColorsArray[i] = seriesColors[i];
		}
	}
};

/** @description Will Draw Title on canvas if showTitle set to true **/
AreaChart.prototype.drawTitle = function () {
	this.m_title.draw(this.m_globalCalculation, this);
};

/** @description Will Draw SubTitle on canvas if showSubTitle set to true **/
AreaChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw(this.m_globalCalculation, this);
};

/** @description Will Draw AreaChart on canvas for visibleSeries **/
AreaChart.prototype.drawAreaChart = function() {
    for (var i = 0, length = this.visibleSeriesInfo.seriesName.length; i < length; i++) {
        if (IsBoolean(this.getShowPoint())) {
            this.m_areaPointSeries[this.visibleSeriesInfo.seriesName[i]].drawAreaPointSeries();
        }
        this.m_areaSeries[this.visibleSeriesInfo.seriesName[i]].drawArea(i);
    }
};
/** @description Will Draw AreaChart Data Label on canvas for visibleSeries **/
AreaChart.prototype.drawDataLabel = function() {
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
/** @description Setter Method for set StartX position of AreaChart **/
AreaChart.prototype.setStartX = function () {
	this.yaxisLabelFont = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
	this.yaxisDescriptionFont = this.m_yAxis.m_fontstyle + " " + this.m_yAxis.m_fontweight + " " + this.fontScaling(this.m_yAxis.m_fontsize) + "px " + selectGlobalFont(this.m_yAxis.m_fontfamily);
	var btdm = this.getBorderToDescriptionMargin();
	var dm = this.getYAxisDescriptionMargin();
	var dtlm = this.getDescriptionToLabelMargin();
	var ltam = this.getLabelToAxisMargin();
	var lm = this.getYAxisLabelMargin();
	this.m_startX = this.m_x * 1 + btdm * 1 + dm * 1 + dtlm * 1 + lm * 1 + ltam * 1;
};

/** @description Getter Method return YAxis LabelMargin of AreaChart **/
AreaChart.prototype.getYAxisLabelMargin = function () {
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
AreaChart.prototype.getLabelFormatterMargin = function () {
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
AreaChart.prototype.getLabelWidth = function () {
	return this.m_labelwidth;
};

/** @description  Setter method of LabelWidth  **/
AreaChart.prototype.setLabelWidth = function () {
	this.m_labelwidth = 0;
	var maxSeriesVals = [];
	if (this.fontScaling(this.m_yAxis.m_labelfontsize) > 0) {
		for(var i = 0;i < this.m_yAxisMarkersArray.length ;i++ ){
			var maxSeriesVal = (this.m_charttype == "100%") ? 100 : this.m_yAxisMarkersArray[i];
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
AreaChart.prototype.getLabelSignMargin = function () {
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
AreaChart.prototype.getLabelPrecisionMargin = function () {
	var lpm = 5;
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
AreaChart.prototype.getLabelSecondFormatterMargin = function () {
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
AreaChart.prototype.getFormatterMargin = function () {
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
AreaChart.prototype.setEndX = function () {
	var blm = this.getBorderToLegendMargin();
	var vlm = this.getVerticalLegendMargin();
	var vlxm = this.getVerticalLegendToXAxisMargin();
	var rightSideMargin = blm * 1 + vlm * 1 + vlxm * 1;

	this.m_endX = (this.m_x * 1 + this.m_width * 1 - rightSideMargin * 1);
};

/** @description  Setter method of AreaChart for set StartY position.**/
AreaChart.prototype.setStartY = function () {
	var cm = this.getChartMargin();
	var xlbm = this.getXAxisLabelMargin();
	var xdm = this.getXAxisDescriptionMargin();
	var bottomMargin = cm * 1 + xlbm * 1 + xdm * 1;
	this.m_startY = (this.m_y * 1 + this.m_height * 1 - bottomMargin * 1);
};

/** @description  getter method of XAxis Label Margin  **/
AreaChart.prototype.getXAxisLabelMargin = function () {
	var xAxislabelDescMargin = this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.8;
    var radians = this.m_xAxis.m_labelrotation * (Math.PI / 180); 
	this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
	if (IsBoolean(this.m_xAxis.getLabelTilted())) {
		for (var i = 0,length=this.m_categoryData.length; i <length ; i++) {
			for (var j = 0,dataLength=this.m_categoryData[i].length; j <dataLength ; j++) {
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

/** @description Setter method for set no of rows for draw x-axis labels. **/
AreaChart.prototype.setNoOfRows = function () {
	this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
	var noOfRow = 1;
	if (!IsBoolean(this.isEmptyCategory)) {
		var textWidth = this.ctx.measureText(this.m_categoryData[0][0]).width;
		var xDivision = (this.getEndX() - this.getStartX()) / this.m_categoryData[0].length;
		for (var i = 1,length=this.m_categoryData[0].length; i <length ; i++) {
			if (this.ctx.measureText(this.m_categoryData[0][i]).width > xDivision)
				noOfRow = 2;
		}
	}
	return noOfRow;
};

/** @description Setter method for set EndY position. **/
AreaChart.prototype.setEndY = function () {
	this.m_endY = (this.m_y * 1 + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1 + this.getMarginForCurveLine() * 1);
};

/** @description Getter method of CurveLine margin. **/
AreaChart.prototype.getMarginForCurveLine = function () {
	return ((this.m_lineform == "curve") && (this.m_charttype == "overlaid")) ? this.fontScaling((this.m_subTitle.getFontSize()) / 2) : 0;
};

/** @description Getter method For HundredPercentage seriesData. **/
AreaChart.prototype.getPercentageForHundred = function () {
	return this.m_SeriesDataInPerForHundredChart;
};

/** @description Getter method For Tooltip Data. **/
AreaChart.prototype.getToolTipData = function(mouseX, mouseY) {
    var toolTipData;
    if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory) && IsBoolean(this.isVisibleSeries()) && IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")) {
        var isNaNValue;
        var m_plotRadius = this.m_calculation.getOnePartWidth() / 2; //var m_plotRadius = 3;
        var newVal = "";
        if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
            var seriesData = this.getVisibleSeriesData(this.getSeriesDataForToolTip()).seriesData;
            var percentageData = this.getPercentageForHundred();
            for (var i = 0, length = this.m_xPositionArray.length; i < length; i++) {
                if (mouseX <= (this.m_xPositionArray[i] * 1 + m_plotRadius) && (mouseX >= this.m_xPositionArray[i] * 1 - m_plotRadius)) {
                    toolTipData = {};
                    if (IsBoolean(this.m_customtextboxfortooltip.dataTipType == "Default")) {
                        toolTipData.cat = "";
                        toolTipData.data = new Array();

                        toolTipData.cat = this.getCategoryData()[0][i];
                        for (var j = 0, dataLength = this.visibleSeriesInfo.seriesData.length, k = 0; j < dataLength; j++) {
                            isNaNValue = false;
                            var data = [];
                            data[0] = {
                                "color": this.getColorsForSeries()[j],
                                "shape": this.legendMap[this.visibleSeriesInfo.seriesName[j]].shape
                            };
                            data[1] = this.visibleSeriesInfo.seriesDisplayName[j];
                            if (seriesData[j][i] == "" || isNaN(seriesData[j][i]) || seriesData[j][i] == null || seriesData[j][i] == "null") {
                                newVal = seriesData[j][i];
                                isNaNValue = true;
                            } else {
                                var num = seriesData[j][i] * 1;
                                if (num % 1 != 0 && this.m_tooltipprecision !== "default") {
                                    newVal = num.toFixed(this.m_tooltipprecision);
                                } else {
                                    newVal = seriesData[j][i] * 1;
                                }
                            }
                            var FormterData = this.getUpdatedFormatterForToolTip(newVal, this.visibleSeriesInfo.seriesName[j]);
                            data[2] = FormterData;
                            if (this.m_charttype == "100%" && this.getSeriesDisplayNames().length > 1) {
                                var num = (seriesData[j][i] * 1 < 0) ? -1 : 1;
                                if (this.m_tooltipproperties.tooltippercentprecision == "auto") {
								    if (countDecimal((percentageData[j][i] * num).toString()) == 0) {
								        data[3] = (percentageData[j][i] * num) + "%";
								    } else {
								    	data[3] = (percentageData[j][i] * num).toFixed(2);
								        if(data[3] % 1 == 0) {
								        	data[3] = (data[3] * 1).toFixed() + "%";
								        } else {
								        	data[3] = data[3] + "%";
								        }
								    }
								} else {
										data[3] = (percentageData[j][i] * num).toFixed(this.m_tooltipproperties.tooltippercentprecision) + "%";
								}
                                var cumSum = 0;
                                for (var m = 0; m <= j; m++) {
                                    if (!isNaN(seriesData[m][i]))
                                        cumSum += seriesData[m][i] * 1;
                                }
                                if(IsBoolean(this.m_tooltipproperties.showcummulativesum)) {
                                	data[4] = this.getNumberWithCommas(cumSum);
                                }
                            }

                            toolTipData.data[k] = data;
                            k++;
                        }
                        toolTipData.highlightIndex = this.getDrillColor(mouseX, mouseY);
                        if (IsBoolean(this.m_controlledtooltip)) {
							toolTipData = this.updateTooltipData(toolTipData);
						}
                        break;
                    } else {
                        toolTipData = this.getDataProvider()[i];
                    }
                }
            }
        } else {
            this.hideToolTip();
        }
        return toolTipData;
    }
    return toolTipData;
};

/** @description Getter method For DrillColor. **/
AreaChart.prototype.getDrillColor = function (mouseX, mouseY) {
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory)))) {
	    var m_plotRadius = 5;
	    var m_plotRadius = this.getVisibleRadiusArr();/**Will set array of visible Radius*/
	    if ((mouseX >= this.getStartX() && mouseX <= this.getEndX()) && (mouseY <= this.getStartY() && mouseY >= this.getEndY())) {
	        for (var i = 0, length = this.m_xPositionArray.length; i < length; i++) {
	            for (var j = this.m_yPositionArray.length - 1; j >= 0; j--) {
	                
	                if (mouseX <= (this.m_xPositionArray[i] * 1 + m_plotRadius[j] * 1) && mouseX >= (this.m_xPositionArray[i] * 1 - m_plotRadius[j] * 1)) {
	                    if (mouseY <= (this.m_yPositionArray[j][i] * 1 + m_plotRadius[j] * 1) && mouseY >= (this.m_yPositionArray[j][i] * 1 - m_plotRadius[j] * 1)) {
	                        return j;
	                    }
	                }
	            }
	        }
	    }
	}
};

/** @description Getter method For DrillDataPoints. **/
AreaChart.prototype.getDrillDataPoints = function(mouseX, mouseY) {
    if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory))) && IsBoolean(this.isVisibleSeries())) {
        var m_plotRadius = this.m_calculation.getOnePartWidth() / 2;
        var Yposition = [];
        var Yposition1 = [];
        var ZeroIndex = (this.m_yAxisMarkersArray.indexOf("0") == -1) ? ((this.m_yAxisMarkersArray.indexOf(0) == -1) ? "" : this.m_yAxisMarkersArray.indexOf(0)) : this.m_yAxisMarkersArray.indexOf("0");
        if (ZeroIndex !== "") {
            var ZeroAxisPosition = this.m_startY * 1 - this.m_calculation.m_chart.m_yAxis.getYAxisDiv() * ZeroIndex;
        }else{
        	var ZeroAxisPosition = true;
        }
        if ((mouseX >= this.getStartX() && mouseX <= this.getEndX()) && (mouseY <= this.getStartY() && mouseY >= this.getEndY())) {
        	var m_plotRadiusPoint = this.getVisibleRadiusArr();/**Will set array of visible Radius*/
            for (var i = 0, length = this.m_xPositionArray.length; i < length; i++) {
                if (mouseX <= (this.m_xPositionArray[i] * 1 + m_plotRadius * 1) && mouseX >= (this.m_xPositionArray[i] * 1 - m_plotRadius * 1)) {
                	Yposition1[i] = true;
                	for (var k = this.m_yPositionArray.length - 1; k >= 0; k--) {
                		if (mouseY <= (this.m_yPositionArray[k][i] * 1 + m_plotRadiusPoint[k] * 1) && mouseY >= (this.m_yPositionArray[k][i] * 1 - m_plotRadiusPoint[k] * 1)) {
                			Yposition1[i] = false;
                			var DrillData = this.getDrillData(k,i);
                			return DrillData;
                        }
                	}
                	if(Yposition1[i]){
                		for (var j = this.m_yPositionArray.length - 1; j >= 0; j--) {
                            Yposition[j] = [];
                            Yposition[j][i] = false;
                            if ((IsBoolean(this.m_basezero) || (ZeroAxisPosition === true))  && (mouseY >= this.m_yPositionArray[j][i] * 1)) {
                                Yposition[j][i] = true;
                            } else if (!IsBoolean(this.m_basezero) && (!isNaN(this.visibleSeriesInfo.seriesData[j][i] * 1)) && (this.visibleSeriesInfo.seriesData[j][i] * 1 >= 0) && (ZeroAxisPosition >= mouseY) && (mouseY >= this.m_yPositionArray[j][i] * 1)) {
                                Yposition[j][i] = true;
                            } else if (!IsBoolean(this.m_basezero) && (!isNaN(this.visibleSeriesInfo.seriesData[j][i] * 1)) && (this.visibleSeriesInfo.seriesData[j][i] * 1 < 0) && (ZeroAxisPosition < mouseY) && (mouseY <= this.m_yPositionArray[j][i] * 1)) {
                                Yposition[j][i] = true;
                            };
                            if (Yposition[j][i]) {
                            	var DrillData = this.getDrillData(j,i);
                    			return DrillData;
                                break;
                            }
                        }
                	}
                }
            }
        }
    }
};

/** @description Getter method For Drilled Data. **/
AreaChart.prototype.getDrillData = function(j,i){
	 var fieldNameValueMap = this.getFieldNameValueMap(i);
     /**Clicked color drills as the drill-color not series color.*/
     var drillColor = this.getColorsForSeries()[j];
     var drillField = this.visibleSeriesInfo.seriesName[j];
     var drillDisplayField = this.visibleSeriesInfo.seriesDisplayName[j];
     var drillValue = fieldNameValueMap[drillField];
     fieldNameValueMap.drillField = drillField;
     fieldNameValueMap.drillDisplayField = drillDisplayField;
     fieldNameValueMap.drillValue = drillValue;
     return {
         "drillRecord": fieldNameValueMap,
         "drillColor": drillColor
     };
}
/** @description Constructor function  of AreaCalculation class. **/
function AreaCalculation() {
	this.startX;
	this.startY;
	this.endX;
	this.endY;

	this.xAxisData = [];
	this.yAxisData = [];
	this.xPositionArray = [];
	this.yPositionArray = [];
	this.m_yAxisMarkersArray = [];
	this.m_numberOfMarkers = 6;
	this.basePoint = "";
	this.spaceFromYAxis = "";
};

/** @description initialization of  AreaCalculation. **/
AreaCalculation.prototype.init = function (m_chart) {
	this.m_chart = m_chart;
	this.startX = m_chart.getStartX();
	this.startY = m_chart.getStartY();
	this.endX = m_chart.getEndX();
	this.endY = m_chart.getEndY();
	this.m_chartType = this.m_chart.getChartType();
	this.xAxisData = m_chart.getCategoryData()[0];
	this.yAxisData = this.m_chart.visibleSeriesInfo.seriesData;
	
	this.setDrawHeight();
	this.setXAxisOnePart();
	this.setRatio();
	this.setEachLinePix();
	this.setXPosition();
	this.setYPosition();
};

/** @description Setter method of  DrawHeight. **/
AreaCalculation.prototype.setDrawHeight = function () {
	this.drawHeight = (this.startY - this.endY);
};

/** @description Setter method of  XAxisOnePart. **/
AreaCalculation.prototype.setXAxisOnePart= function () {
	this.onePartWidth = (this.endX - this.startX) / (this.xAxisData.length);
};

/** @description Setter method of  Ratio. **/
AreaCalculation.prototype.setRatio = function () {
	var diff = this.getMaxValue() - this.getMinValue();
	if (diff > 0)
		this.ratio = this.getDrawHeight() / (diff);
	else
		this.ratio = 1;
	if (this.m_chartType == "100%")
		this.setRatioForHundredPercent();
};

/** @description Setter method of  Ratio For HundredPercent. **/
AreaCalculation.prototype.setRatioForHundredPercent = function () {
	this.m_hundredPercentsRatios = [];
	for (var i = 0,length=this.yAxisData[0].length; i < length; i++) {
		var sum = 0;
		for (var j = 0,dataLength=this.yAxisData.length ; j < dataLength; j++) {
			if (this.yAxisData[j][i] * 1 < 0)
				this.yAxisData[j][i] = 0;
			//    this.yAxisData[j][i] = (Math.abs(this.yAxisData[j][i]*1));
			if (this.yAxisData[j][i] != "" && !isNaN(this.yAxisData[j][i]) && this.yAxisData[j][i] != null && this.yAxisData[j][i] != "null")
				sum = (sum) * 1 + (Math.abs(this.yAxisData[j][i] * 1));
		}
		if (sum == 0)
			this.m_hundredPercentsRatios[i] = 0;
		else
			this.m_hundredPercentsRatios[i] = (this.getDrawHeight() * 1 / sum * 1);
	}
};

/** @description Setter method  For set EachLinePix. **/
AreaCalculation.prototype.setEachLinePix = function () {
	this.eachLinePix = (this.startY * 1 - this.endY * 1) / (this.getMaxValue() - this.getMinValue());
};

/** @description Setter method  For set XPosition Array. **/
AreaCalculation.prototype.setXPosition = function () {
	this.xPositionArray = [];
	for (var i = 0,length=this.xAxisData.length ; i <length ; i++) {
		if (this.xAxisData.length == 1)
			this.xPositionArray[i] = (this.startX * 1) + (this.endX - this.startX) / 2;
		else
			this.xPositionArray[i] = this.startX * 1 + (this.getOnePartWidth() / 2) + (i * this.getOnePartWidth());
	}
};

/** @description Setter method  For set YPosition Array. **/
AreaCalculation.prototype.setYPosition = function () {
	this.basePoint = (this.getMinValue() < 0) ? this.startY - Math.abs(this.getEachLinePix() * this.getMinValue()) : this.startY;
	var yparray = [];
    if(this.basePoint < 0){
    	this.basePoint = this.m_chart.m_endY;
    }
	if ((this.m_chart.m_lineform == "curve" || this.m_chart.m_lineform == "segment") && (this.m_chart.m_charttype.toLowerCase() == "stacked")) {
		this.yAxisData = this.updateYaxisData(this.yAxisData);
		for (var i = 0,length=this.yAxisData.length ; i <length ; i++) {
			yparray[i] = [];
			for (var j = 0,dataLength=this.yAxisData[i].length ; j <dataLength ; j++) {
				if (this.getMaxValue() * 1 < this.yAxisData[i][j])
					this.yAxisData[i][j] = this.getMaxValue() * 1;

				if (this.yAxisData[i][j] * 1 < 0)
					if (this.yAxisData[i][j] * 1 < this.getMinValue() * 1)
						this.yAxisData[i][j] = this.getMinValue() * 1;

				if (this.yAxisData[i][j] === "" || isNaN(this.yAxisData[i][j]) || this.yAxisData[i][j] == null || this.yAxisData[i][j] == "null") {
					yparray[i][j] = (this.startY * 1) - ((this.getEachLinePix()) * (0 - this.getMinValue()));
				} else {
					yparray[i][j] = (this.startY * 1) - ((this.getEachLinePix()) * (this.yAxisData[i][j] - this.getMinValue()));
				}
			}
		}
		this.yPositionArray = yparray;
	} 
	else if ((this.m_chart.m_lineform == "curve" || this.m_chart.m_lineform == "segment") && (this.m_chart.m_charttype == "100%")) {
		this.yPositionArray = this.setyPixelArrayForHundredPercent();
	} 
	else {
		var yAxisData = this.yAxisData;
		for (var i = 0,length=yAxisData.length ; i <length ; i++) {
			yparray[i] = [];
			for (var j = 0,dataLength=yAxisData[i].length ; j <dataLength ; j++) {

//				if(this.m_chart.m_lineform == "curve"){
//					if (this.getMaxValue() * 1 < yAxisData[i][j])
//						yAxisData[i][j] = (this.getMaxValue() * 1);
//
//					if (this.yAxisData[i][j] * 1 < 0)
//						if (yAxisData[i][j] * 1 < this.getMinValue() * 1)
//							yAxisData[i][j] = this.getMinValue() * 1 ;
//
//				}
				if (yAxisData[i][j] ==="" || isNaN(yAxisData[i][j]) || yAxisData[i][j] == null || yAxisData[i][j] == "null") {
					yparray[i][j] = (this.startY * 1) - ((this.getEachLinePix()) * this.getMinValue());
				} else {
					yparray[i][j] = (this.startY * 1) - ((this.getEachLinePix()) * (yAxisData[i][j] - this.getMinValue()));
				}
			}
		}
		this.yPositionArray = yparray;
	}
};

/** @description Setter method  For set yPixelArray For HundredPercent. **/
AreaCalculation.prototype.setyPixelArrayForHundredPercent = function () {
	var yparray = [];
	this.yAxisData = this.updateYaxisDataForHundredPercent(this.yAxisData);
	for (var i = 0, length=this.yAxisData.length; i <length ; i++) {
		yparray[i] = [];
		for (var j = 0,dataLength=this.yAxisData[i].length ; j <dataLength ; j++) {
			var ratio = this.getRatioForHundredPercent(j) * 1;

			if (i > 0)
				yparray[i][j] = (yparray[i - 1][j] * 1) - (ratio) * ((this.yAxisData[i][j] * 1));
			else
				yparray[i][j] = ((this.startY * 1) - (((this.yAxisData[i][j] * 1)) * ratio));
		}
	}
	return yparray;
};

/** @description Getter method  For getRatio . **/
AreaCalculation.prototype.getRatio = function () {
	return this.ratio;
};

/** @description Getter method  For getDrawHeight . **/
AreaCalculation.prototype.getDrawHeight = function () {
	return this.drawHeight;
};

/** @description Getter method  For getMaxValue . **/
AreaCalculation.prototype.getMaxValue = function () {
	return this.m_chart.max;
};

/** @description Getter method  For getMinValue . **/
AreaCalculation.prototype.getMinValue = function () {
	return this.m_chart.min;
};

/** @description Getter method  For getYAxisText . **/
AreaCalculation.prototype.getYAxisText = function () {
	return this.m_chart.yAxisText;
};

/** @description Getter method  For getYAxisMarkersArray . **/
AreaCalculation.prototype.getYAxisMarkersArray = function () {
	return this.m_chart.m_yAxisMarkersArray;
};

/** @description Getter method  For getOnePartWidth . **/
AreaCalculation.prototype.getOnePartWidth = function () {
	return this.onePartWidth;
};

/** @description Getter method  For getEachLinePix . **/
AreaCalculation.prototype.getEachLinePix = function () {
	return this.eachLinePix;
};
/** @description Getter method  For getXPosition . **/
AreaCalculation.prototype.getXPosition = function () {
	return this.xPositionArray;
};

/** @description Getter method  For getYPosition . **/
AreaCalculation.prototype.getYPosition = function () {
	return this.yPositionArray;
};

AreaCalculation.prototype.getRatioForHundredPercent = function (index) {
	return this.m_hundredPercentsRatios[index] * 1;
};

/** @description update YaxisData For HundredPercent . **/
AreaCalculation.prototype.updateYaxisDataForHundredPercent = function (yAxisData) {
	var arr = [];
	for (var i = 0,length=yAxisData.length; i <length ; i++) {
		arr[i] = [];
		for (var j = 0,dataLength=yAxisData[i].length ; j <dataLength ; j++) {
			if (yAxisData[i][j] == "" || isNaN(yAxisData[i][j]) || yAxisData[i][j] == null || yAxisData[i][j] == "null")
				arr[i][j] = 0;
			else
				arr[i][j] = yAxisData[i][j] * 1;
		}
	}
	return arr;
};

/** @description will update YaxisData  . **/
AreaCalculation.prototype.updateYaxisData = function (yAxisData) {
	var arr = [];
	for (var i = 0,length= yAxisData.length; i < length; i++) {
		arr[i] = [];
		for (var j = 0,dataLength=yAxisData[i].length; j <dataLength ; j++) {
			if (i != 0)
				arr[i][j] = (yAxisData[i][j] * 1 < 0) ? (yAxisData[i][j] * 1) : (arr[i - 1][j] * 1) + ((isNaN(yAxisData[i][j])) ? 0 : yAxisData[i][j] * 1);
			else
				arr[i][j] = (isNaN(yAxisData[i][j])) ? 0 : yAxisData[i][j] * 1;
		}
	}
	return arr;
};

function AreaSeries() {
	this.color;
	this.xPositionArray = [];
	this.yPositionArray = [];
	this.line = [];
	this.ctx = "";
	this.m_chart = "";
};

/** @description initialization of Series for AreaChart. **/
AreaSeries.prototype.init = function (color, xPositionArray, yPositionArray, m_chart) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.color = color;
	this.xPositionArray = xPositionArray;
	this.yPositionArray = yPositionArray;
	for (var i = 0,length=this.xPositionArray.length; i <length ; i++) {
		this.line[i] = new Line();
		if (i == 0) {
			this.line[i].init(this.color, this.xPositionArray[i], this.yPositionArray[i], this.xPositionArray[i], this.yPositionArray[i], this.m_chart);
		} else {
			this.line[i].init(this.color, this.xPositionArray[i - 1], this.yPositionArray[i - 1], this.xPositionArray[i], this.yPositionArray[i], this.m_chart);
		}
	}
};

/** @description will check the Range. **/
AreaSeries.prototype.isInRange = function (i) {
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
/** @description will draw series if points isInRange. **/
AreaSeries.prototype.drawAreaSeries = function () {
	for (var i = 0,length=this.xPositionArray.length ; i <length ; i++) {
		if (!this.isInRange(i))
			this.line[i].drawLine();
	}
};

function AreaPointSeries() {
	this.color;
	this.radius;
	this.xPositionArray = [];
	this.yPositionArray = [];
	this.AreaPoint = [];
	this.ctx = "";
	this.m_chart = "";
};

/** @description initialization of PointSeries for AreaChart. **/
AreaPointSeries.prototype.init = function (color, radius, xPositionArray, yPositionArray, m_chart, plotTrasparencyArray, plotTypeArray, plotRadiusArray) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.color = color;
	this.m_chart = m_chart;
	this.radius = radius;
	this.xPositionArray = xPositionArray;
	this.yPositionArray = yPositionArray;
	this.m_plotTrasparency = plotTrasparencyArray;
	this.m_plotType = plotTypeArray;
	this.m_plotRadius = plotRadiusArray;

	for (var i = 0,length=this.xPositionArray.length; i <length ; i++) {
		this.AreaPoint[i] = new Point();
		this.AreaPoint[i].init(this.color, this.radius, this.xPositionArray[i], this.yPositionArray[i], this.ctx, this, this.m_plotTrasparency, this.m_plotType, this.m_plotRadius);
	}
};

/** @description will check point is in range or not. **/
AreaPointSeries.prototype.isInRange = function (i) {
	if (this.yPositionArray[i] > this.m_chart.getStartY() || this.yPositionArray[i] <= this.m_chart.getEndY() - 0.1) // -0.1 bucause of yposition data outof chart area, but point(drawpoint) is the maximum value and ratio*current value negligible difference between calculated point with the endY so we can substract sum minner value to arrenge the drawing.
		return true;
	else
		return false;
};

/** @description will draw the PointSeries for AreaChart. **/
AreaPointSeries.prototype.drawAreaPointSeries = function () {
	try {
		this.drawAreaPointSeriesPoints(0);
	} catch (e) {
		console.log("error in calculation of Points");
	}
};

/** @description will draw the points for AreaChart. **/
AreaPointSeries.prototype.drawAreaPointSeriesPoints = function (indexLimit) {
	var temp = this;
	var xPositionArray = this.xPositionArray;
	for (var i = indexLimit*temp.m_chart.m_chunkdatalimit,length=xPositionArray.length ; i <length ; i++) {
		if(i<(indexLimit+1)*temp.m_chart.m_chunkdatalimit){
			if (!temp.isInRange(i))
				temp.AreaPoint[i].drawPoint();
		} else {
			setTimeout(function () {
				if(++indexLimit*temp.m_chart.m_chunkdatalimit < xPositionArray.length)
					temp.drawAreaPointSeriesPoints(indexLimit);
			}, temp.m_chart.m_chunkdatatimeout);
			break;
		}
	}
};

function SeriesClass() {
	this.color;
	this.xPositionArray = [];
	this.yPositionArray = [];
	this.AreaLine = [];
	this.ctx = "";
	this.storePreviousPositionArray = [];
};

/** @description Setter Method for store previous y-positions. **/
SeriesClass.prototype.setPrevious = function (yPositionArray) {
	this.storePreviousPositionArray = yPositionArray;
};

/** @description initialize SeriesClass properties. **/
SeriesClass.prototype.init = function (color, xPositionArray, yPositionArray, m_chart, plotTrasparency, lineWidth, lineType) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.color = color;
	this.xPositionArray = xPositionArray;
	this.yPositionArray = yPositionArray;
	this.m_startX = this.m_chart.getStartX();
	this.m_startY = this.m_chart.getStartY();
	this.m_plotTrasparency = plotTrasparency;
	this.lineWidth = lineWidth;
	this.lineType = lineType;
};

/** @description iterate till x-position and draw Area. **/
SeriesClass.prototype.drawArea = function (j) {
	if ((this.m_chart.m_charttype == "overlaid") && (this.m_chart.getLineForm() === "curve" && this.xPositionArray.length >= 2)) {
		var pts = [];
		var count = 0;
		pts[count] = [];
		var lineDashArray = this.getLineDashArray(this.lineType, this.lineWidth);
		for (var i = 0,length=this.xPositionArray.length; i <length ; i++) {
			if (this.xPositionArray[i] != null && this.xPositionArray[i] != "" && this.yPositionArray[i] != null && this.yPositionArray[i] != "") {
				//	if(this.m_chart.m_calculation.getMaxValue()*1 < this.yPositionArray[i])
				//{
				pts[count].push(this.xPositionArray[i]);
				pts[count].push(this.yPositionArray[i]);
				//}
			} else {
				count++;
				pts[count] = [];
			}
		}
		for (var j = 0; j <= count; j++) {
			if (pts[j].length > 0) {
				this.ctx.beginPath();
				this.ctx.save();
				this.ctx.lineWidth = this.lineWidth * 1; ;
				this.ctx.strokeStyle =  hex2rgb(this.color, this.m_plotTrasparency);
				this.ctx.fillStyle = hex2rgb(this.color, this.m_plotTrasparency);
				this.ctx.moveTo(pts[j][0], pts[j][1]);
				this.ctx.curve(pts[j], 0.5, 25, this);
				if (this.lineWidth > 0) {
					this.ctx.setLineDash(lineDashArray);
					this.ctx.stroke();
				}
				this.ctx.fill();
				this.ctx.restore();
				this.ctx.closePath();
			}
		}
	} else if ((this.m_chart.m_lineform == "curve" || this.m_chart.m_lineform == "segment") && (this.m_chart.m_charttype.toLowerCase() == "stacked" || this.m_chart.m_charttype == "100%")) {
		this.drawAreaStacked(j);
	} else {
		for (var i = 0,length=this.xPositionArray.length; i < this.xPositionArray.length; i++) {
			if (!this.isInRange(i)) {
				if (i == 0) {
					this.drawAreaLine(this.xPositionArray[i], this.yPositionArray[i], this.xPositionArray[i], this.yPositionArray[i], i);
					this.fillArea(this.xPositionArray[i], this.yPositionArray[i], this.xPositionArray[i], this.yPositionArray[i], i);
				} else {
					this.drawAreaLine(this.xPositionArray[i - 1], this.yPositionArray[i - 1], this.xPositionArray[i], this.yPositionArray[i], i);
					this.fillArea(this.xPositionArray[i - 1], this.yPositionArray[i - 1], this.xPositionArray[i], this.yPositionArray[i], i);
				}
			} else {
				//this.xPositionArray[i] = this.xPositionArray[i - 1];
				//this.yPositionArray[i] = this.yPositionArray[i - 1];
			}
		}
	}
};
/** @description Get line dash array **/
SeriesClass.prototype.getLineDashArray = function(lineType, lineWidth) {
	/**An Array of first two numbers which specify line width and a gap and last two for line patterns **/
	if (lineType === "dot")
		return [lineWidth * 1,(lineWidth * 2) + 1,0,0];
	else if (lineType === "dash1")
		return [lineWidth * 1,(lineWidth * 1),(lineWidth * 4),(lineWidth * 1)];
	else if (lineType === "dash")
		return [(lineWidth * 2) + 1,(lineWidth * 2) + 1,0,0];
	else
		return [];
};
/** @description Will Draw stacked Area.  **/
SeriesClass.prototype.drawAreaStacked = function (j) {
	if (j != 0) {
		for (var i = 0,length=this.xPositionArray.length; i <length ; i++) {
			if (this.xPositionArray[i] != null && this.xPositionArray[i] != "" && this.yPositionArray[j][i] != null && this.yPositionArray[j][i] != "") {
				if (!this.isInRange(i)) {
					if (i == 0)
						this.drawAreaLine(this.xPositionArray[i], this.yPositionArray[j][i], this.xPositionArray[i], this.yPositionArray[j][i], i);
					else {
						this.drawAreaLine(this.xPositionArray[i - 1], this.yPositionArray[j][i - 1], this.xPositionArray[i], this.yPositionArray[j][i], this.xPositionArray[i], this.yPositionArray[j - 1][i], this.xPositionArray[i - 1], this.yPositionArray[j - 1][i - 1], i);
						this.fillAreaStacked(this.xPositionArray[i - 1], this.yPositionArray[j][i - 1], this.xPositionArray[i], this.yPositionArray[j][i], this.xPositionArray[i], this.yPositionArray[j - 1][i], this.xPositionArray[i - 1], this.yPositionArray[j - 1][i - 1], i);
					}
				} else {
					this.xPositionArray[i] = this.xPositionArray[i - 1];
					this.yPositionArray[i] = this.yPositionArray[i - 1];
				}
			}
		}
	} else {
		for (var i = 0,length=this.xPositionArray.length; i <length; i++) {
			if (!this.isInRange(i)) {
				if (i == 0) {
					this.drawAreaLine(this.xPositionArray[i], this.yPositionArray[j][i], this.xPositionArray[i], this.yPositionArray[j][i], i);
					this.fillArea(this.xPositionArray[i], this.yPositionArray[j][i], this.xPositionArray[i], this.yPositionArray[i], i);
				} else {
					this.drawAreaLine(this.xPositionArray[i - 1], this.yPositionArray[j][i - 1], this.xPositionArray[i], this.yPositionArray[j][i], i);
					this.fillArea(this.xPositionArray[i - 1], this.yPositionArray[j][i - 1], this.xPositionArray[i], this.yPositionArray[j][i], i);
				}
			} else {
				this.xPositionArray[i] = this.xPositionArray[i - 1];
				this.yPositionArray[j][i] = this.yPositionArray[j][i - 1];
			}
		}
	}
};

/** @description check the point that is in Range or not. **/
SeriesClass.prototype.isInRange = function (i) {
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

/** @description Will Draw outer Line for area  **/
SeriesClass.prototype.drawAreaLine = function (startX, startY, endX, endY, j) {
	var lineDashArray = this.getLineDashArray(this.lineType, this.lineWidth);
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.lineWidth = this.lineWidth * 1;
	this.ctx.strokeStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.moveTo(startX, startY);
	this.ctx.lineTo(endX, endY);
	if (this.lineWidth > 0) {
		this.ctx.setLineDash(lineDashArray);
		this.ctx.stroke();
	}
	this.ctx.restore();
	this.ctx.closePath();
};

/** @description fill the area covered by given points. **/
SeriesClass.prototype.fillArea = function (startX, startY, endX, endY, j) {
	this.ctx.beginPath();
	this.ctx.fillStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.moveTo(startX, this.m_chart.basePoint);
	this.ctx.lineTo(startX, startY);
	this.ctx.lineTo(endX, endY);
	this.ctx.lineTo(endX, this.m_chart.basePoint);
	this.ctx.fill();
	this.ctx.closePath();
};

/** @description fill the area for Stacked AreaChart. **/
SeriesClass.prototype.fillAreaStacked = function (startX, startY, x1, y1, x2, y2, x3, y3, j) {
	this.ctx.beginPath();
	this.ctx.fillStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.moveTo(startX, startY);
	this.ctx.lineTo(x1, y1);
	this.ctx.lineTo(x2, y2);
	this.ctx.lineTo(x3, y3);
	this.ctx.lineTo(startX, startY);
	this.ctx.fill();
	this.ctx.closePath();
};
//# sourceURL=AreaChart.js