/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: WaterfallChart.js
 * @description WaterfallChart
 **/
function WaterfallChart(m_chartContainer, m_zIndex) {
    this.base = Chart;
    this.base();

    this.m_showmarkingorpercentvalue = false;
    this.m_showpercentvalue = false;
    this.m_columnsArray = {};
    this.m_percentageArray = [];
    this.m_calculation = new WaterfallCalculation();

    this.m_chartContainer = m_chartContainer;
    this.m_zIndex = m_zIndex;
    this.m_xAxis = new Xaxis();
    this.m_yAxis = new Yaxis();
    this.m_maxbarwidth = 30;
    this.m_x = 400;
    this.m_y = 35;
    this.m_negativecolor = "";
    this.m_positivecolor = "";
    this.m_totalcolor = "";
    this.m_calculatedname = "";
};

/** @description Making prototype of chart class to inherit its properties and methods into Waterfall chart **/
WaterfallChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
WaterfallChart.prototype.setProperty = function(chartJson) {
    this.ParseJsonAttributes(chartJson.Object, this);
    this.initCanvas();
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
WaterfallChart.prototype.ParseJsonAttributes = function(jsonObject, nodeObject) {
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
                                    for (var i = 0, length = CategoryColorArray.length; i < length; i++) {
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
                            for (var i = 0, length = ConditionalColorArray.length; i < length; i++) {
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

/** @description Getter For DataProvider **/
WaterfallChart.prototype.getDataProvider = function() {
    return this.m_dataProvider;
};

/** @description Getter for category field names **/
WaterfallChart.prototype.getCategoryNames = function() {
    return this.m_categoryNames;
};

/** @description Getter for series field names **/
WaterfallChart.prototype.getSeriesNames = function() {
	if(this.m_seriesNames.length > 0){
		var seriesNames = [];
	    seriesNames = this.m_seriesNames[0];
	    return seriesNames;
	}else{
		return this.m_seriesNames;
	}
    
};

/** @description Getter for all series Names**/
WaterfallChart.prototype.getAllSeriesNames = function() {
    /*var allSeriesNames = [];
    allSeriesNames = this.m_allSeriesNames[0];*/
    return this.m_allSeriesNames;
};
/** @description Getter for All Category names **/
WaterfallChart.prototype.getAllCategoryNames = function () {
	return this.m_allCategoryNames;
};
/** @description Getter for category field Display Name **/
WaterfallChart.prototype.getCategoryDisplayNames = function() {
    return this.m_categoryDisplayNames;
};

/** @description Getter for Series DisplayName**/
WaterfallChart.prototype.getSeriesDisplayNames = function() {
    var seriesDisplayNames = [];
    seriesDisplayNames = this.m_seriesDisplayNames[0];
    return seriesDisplayNames;
};

/** @description Getter for All Field Name**/
WaterfallChart.prototype.getAllFieldsName = function() {
    return this.m_allfieldsName;
};

/** @description Getter for Series Data**/
WaterfallChart.prototype.getSeriesData = function() {
    var seriesData = [];
    seriesData = this.m_seriesData[0];
    return seriesData;
};

/** @description Getter for series tooltip data**/
WaterfallChart.prototype.getSeriesToolTipData = function() {
    return this.m_ShowToolTipData;
};

/** @description Setter for Legend Names**/
WaterfallChart.prototype.setLegendNames = function(m_legendNames) {
    this.m_legendNames = m_legendNames;
};

/** @description Getter for Legend Names**/
WaterfallChart.prototype.getLegendNames = function() {
    /*return this.m_categoryData[0];*/
    var name = [];
    name[0] = "Positive";
    name[1] = "Negative";
    name[2] = this.m_calculatedname;
    return name;
};

/** @description Setter for series color**/
WaterfallChart.prototype.setSeriesColor = function(m_seriesColor) {
    this.m_seriesColor = m_seriesColor;
};

/** @description Getter for Series color**/
WaterfallChart.prototype.getSeriesColor = function() {
    return this.m_seriesColor;
};

/** @description Getter for Series Color**/
WaterfallChart.prototype.getSeriesColors = function() {
    this.m_seriesDataLegendColor = [];
    for (var i = 0, length = this.getSeriesNames().length; i < length; i++) {
        this.m_seriesDataLegendColor[i] = this.getLegendSeriesColor();
    }
    return this.m_seriesDataLegendColor;
    /*return this.m_seriesColors;*/
};

/** @description Getter for Legend Color**/
WaterfallChart.prototype.getLegendSeriesColor = function() {
    var data = [];
    data[0] = this.m_positivecolor;
    data[1] = this.m_negativecolor;
    data[2] = this.m_totalcolor;
    return data;
};

/** @description draw the table in legend division **/
WaterfallChart.prototype.getLegendTableContent = function() {
    var legendTable = "";
    if(this.getSeriesNames().length > 0){
    	for (var i = 0; i < this.getLegendNames().length; i++) {
            legendTable += "<tr style=\"font-style:" + this.m_legendfontstyle + ";color:" + convertColorToHex(this.m_legendfontcolor) + ";text-decoration:" + this.m_legendtextdecoration + ";font-weight:" + this.m_legendfontweight + ";font-family:" + selectGlobalFont(this.m_legendfontfamily) + "\">"+
            					"<td><span style=\"background-color:" + this.getSeriesColors()[0][i] + "; width:10px;height:10px;\"></span><span style=\"display:inline;\">" + this.getLegendNames()[i] + "</span></td></tr>";
        }
    }
    return legendTable;
};

/** @description Canvas Initialization**/
WaterfallChart.prototype.initCanvas = function() {
    var temp = this;
    $("#draggableDiv" + temp.m_objectid).remove();
    this.initializeDraggableDivAndCanvas();
};

/** @description initializes a component container and its events **/
WaterfallChart.prototype.initializeDraggableDivAndCanvas = function() {
    this.setDashboardNameAndObjectId();
    this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
    this.createDraggableCanvas(this.m_draggableDiv);
    this.setCanvasContext();
    this.initMouseMoveEvent(this.m_chartContainer);
    this.initMouseClickEvent();
};

/** @description This method providing the informations like- Min, Max, MarkerArray, markerText, NoOfMarker for the Chart Y-axis Marking **/
WaterfallChart.prototype.getCalculateNiceScale = function(calculatedMin, calculatedMax, baseZero, autoAxisSetup, minimumAxisValue, maximumAxisValue, chartHeight) {
    var min, max;
    if (calculatedMin === calculatedMax) {
        if (calculatedMin > 0) {
            /** decrease 40% from min and add 40% in max **/
            calculatedMin = calculatedMin * 3 / 5;
            calculatedMax = calculatedMax * 7 / 5;
        } else {
            calculatedMin = calculatedMin * 7 / 5;
            calculatedMax = calculatedMax * 3 / 5;
        }
    }
    if (IsBoolean(baseZero) && IsBoolean(autoAxisSetup)) {
        min = 0;
        max = calculatedMax * 1;
    } else if (IsBoolean(baseZero) && !IsBoolean(autoAxisSetup)) {
        min = 0;
        max = (isNaN(maximumAxisValue) || (maximumAxisValue === "")) ? 0 : maximumAxisValue * 1;
    } else if (!IsBoolean(baseZero) && IsBoolean(autoAxisSetup)) {
        min = calculatedMin * 1;
        max = calculatedMax * 1;
    } else if (!IsBoolean(baseZero) && !IsBoolean(autoAxisSetup)) {
        min = (isNaN(minimumAxisValue) || (maximumAxisValue === "")) ? 0 : minimumAxisValue * 1;
        max = (isNaN(maximumAxisValue) || (maximumAxisValue === "")) ? 0 : maximumAxisValue * 1;
    }
    if (max <= min) {
        /*max = (min + 4);*/
        min = calculatedMin * 1;
        max = 0;
    }
    var scaleConfigObj = {
	    	"minPoint": min,
	    	"maxPoint": max,
	    	"compHeight": chartHeight,
	    	"isMaxYaxis": this.m_ismaxyaxis,
	    	"isMinYaxis": this.m_isminyaxis,
	    	"noOfMarkers": this.m_noofmarkers
	};
    var obj = new NiceScale(scaleConfigObj);
    return (obj.getScaleInfo());
};

/** @description Getting field JSON , according to the field type categorize into 3 arrays**/
WaterfallChart.prototype.setFields = function(fieldsJson) {
    this.m_fieldsJson = fieldsJson;
    var categoryJson = [];
    var seriesJson = [];
    for (var i = 0, length = fieldsJson.length; i < length; i++) {
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

/** @description Setting Category Name,Display,Color into three arrays this.m_categoryNames,this.m_categoryDisplayNames,this.m_categoryFieldColor**/
WaterfallChart.prototype.setCategory = function(categoryJson) {
    this.m_categoryNames = [];
    this.m_categoryFieldColor = [];
    this.m_categoryDisplayNames = [];
    this.m_allCategoryNames = [];
    this.m_allCategoryDisplayNames = [];
    this.m_categoryVisibleArr = {};
    var count = 0;
    for (var i = 0, length = categoryJson.length; i < length; i++) {
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

/** @description Putting Series field property into respective property array**/
WaterfallChart.prototype.setSeries = function(seriesJson) {
    this.m_seriesNames = [];
    this.m_seriesDisplayNames = [];
    this.m_seriesColors = [];
    this.m_legendNames = [];
    this.m_seriesVisibleArr = {};
    this.m_allSeriesDisplayNames = [];
    this.m_allSeriesNames = [];
    this.m_plotTrasparencyArray = [];
    var count = 0;
    this.legendMap = {};
    for (var i = 0, length = seriesJson.length; i < length; i++) {
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
        this.m_allSeriesDisplayNames[i] = m_formattedDisplayName;
       	this.m_allSeriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
        this.m_seriesVisibleArr[this.m_allSeriesNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
        if (IsBoolean(this.m_seriesVisibleArr[this.m_allSeriesNames[i]])) {
            this.m_seriesDisplayNames[count] = m_formattedDisplayName;
            this.m_seriesNames[count] = this.getProperAttributeNameValue(seriesJson[i], "Name");
            this.m_legendNames[count] = m_formattedDisplayName;
            this.m_seriesColors[count] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));
            var transparency = this.getProperAttributeNameValue(seriesJson[i], "PlotTransparency");
            this.m_plotTrasparencyArray[count] = (transparency != undefined && transparency !== null && transparency !== "") ? transparency : 1;
            var tempMap = {
                "seriesName": this.m_seriesNames[count],
                "displayName": this.m_seriesDisplayNames[count],
                "color": this.m_seriesColors[count],
                "shape": "cube",
                "index": count
            };
            this.legendMap[this.m_seriesNames[count]] = tempMap;
            count++;
        }
    }
};

/** @description Chart Data,Chart Frame,XAxis,YAxis initialization **/
WaterfallChart.prototype.init = function() {
    this.setCategoryData();
    this.setSeriesData();
    this.setAllFieldsName();
    this.setAllFieldsDisplayName();
    this.isSeriesDataEmpty();
    this.setShowSeries(this.getAllFieldsName());
    this.updateSeriesDataWithCommaSeperators();
    this.visibleSeriesInfo = this.getVisibleSeriesData(this.getSeriesData());

    this.m_chartFrame.init(this);
    this.m_title.init(this);
    this.m_subTitle.init(this);
    if (!IsBoolean(this.m_isEmptySeries) && IsBoolean(this.isVisibleSeries()) && (!IsBoolean(this.isEmptyCategory))) {
        this.initializeCalculation();
        this.m_xAxis.init(this, this.m_calculation);
        this.m_yAxis.init(this, this.m_calculation);
    }
    /**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};

/** @description check for data is empty or not **/
WaterfallChart.prototype.isSeriesDataEmpty = function() {
	this.m_isEmptySeries = false;
	if (this.m_seriesData == "") {
		this.m_isEmptySeries = true;
	}
};

/** @description get series data for only visible series **/
WaterfallChart.prototype.getVisibleSeriesData = function(yAxisData) {
    var tempMap = {
        "seriesData": [],
        "seriesColor": [],
        "seriesDisplayName": [],
        "seriesName": []
    };
    if (this.m_seriesVisibleArr[this.m_seriesNames[0]]) {
        tempMap.seriesData.push(yAxisData);
        tempMap.seriesColor.push(this.m_seriesColors[0]);
        tempMap.seriesDisplayName.push(this.m_seriesDisplayNames[0]);
        tempMap.seriesName.push(this.m_seriesNames[0]);
    }
    return tempMap;
};

/** @description Setter for category Data**/
WaterfallChart.prototype.setCategoryData = function() {
    this.m_categoryData = [];
    this.isEmptyCategory = true;
    if (this.getCategoryNames().length > 0) {
        this.isEmptyCategory = false;
        for (var i = 0, length = this.getCategoryNames().length; i < length; i++) {
            this.m_categoryData[i] = this.getDataFromJSONCategory(this.getCategoryNames()[i]);
        }
    }
};

/** @description Setter for Series Data**/
WaterfallChart.prototype.setSeriesData = function() {
	this.m_seriesData = [];
    this.m_ShowToolTipData = [];
	if(this.getSeriesNames().length > 0){
	    this.m_seriesData[0] = this.getDataFromJSONSeries(this.getSeriesNames());
	    this.m_ShowToolTipData[0] = this.getDataFromJSONSeries(this.getSeriesNames());
	}
};

/** @description Getter for JSON Category Data**/
WaterfallChart.prototype.getDataFromJSONCategory = function(fieldName) {
    var data = [];
    for (var i = 0; i < this.getDataProvider().length; i++) {
        if (this.getDataProvider()[i][fieldName] === undefined || this.getDataProvider()[i][fieldName] === "undefined")
            data[i] = "";
        else
            data[i] = this.getDataProvider()[i][fieldName];
    }
    data[i] = this.m_calculatedname;
    return data;
};

/** @description Getter for JSON Series Data**/
WaterfallChart.prototype.getDataFromJSONSeries = function(fieldName) {
    var data = [];
    var count = 0;
    var total = 0;
    /**DAS-1158 check if data is empty or not then only proceed */
    if(this.getDataProvider().length > 0){
    for (var i = 0; i < this.getDataProvider().length; i++) {
        var a = getNumericComparableValue(this.getDataProvider()[i][fieldName]);
        if (a === undefined || isNaN(a) || a === "undefined")
            data[i] = "";
        else {
            data[i] = a;
            total = 1 * total + 1 * data[i];
        }
    }
    data[i] = total;
    }
    return data;
};

/** @description Setting all fields Name into single array**/
WaterfallChart.prototype.setAllFieldsName = function() {
    this.m_allfieldsName = [];
    for (var i = 0, length = this.getAllCategoryNames().length; i < length; i++) {
        this.m_allfieldsName.push(this.getAllCategoryNames()[i]);
    }
    for (var i = 0, length = this.getAllSeriesNames().length; i < length; i++) {
        this.m_allfieldsName.push(this.getAllSeriesNames()[i]);
    }
};

/** @description Setter for All field display Name into single array**/
WaterfallChart.prototype.setAllFieldsDisplayName = function() {
    this.m_allfieldsDisplayName = [];
    for (var i = 0, length = this.getCategoryDisplayNames().length; i < length; i++) {
        this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
    }
    this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames());
};

/** @description Update Series Data With Comma Seperators**/
WaterfallChart.prototype.updateSeriesDataWithCommaSeperators = function() {
    this.m_displaySeriesDataFlag = [];
    for (var i = 0, length = this.m_ShowToolTipData.length; i < length; i++) {
        this.m_displaySeriesDataFlag[i] = [];
        for (var j = 0, innerlength = this.m_ShowToolTipData[i].length; j < innerlength; j++) {
            this.m_displaySeriesDataFlag[i][j] = true;
            if (isNaN(this.m_ShowToolTipData[i][j])) {
                this.m_displaySeriesDataFlag[i][j] = false;
                this.m_ShowToolTipData[i][j] = getNumericComparableValue(this.m_ShowToolTipData[i][j]);
                this.m_seriesData[i][j] = getNumericComparableValue(this.m_seriesData[i][j]);
            }
        }
    }
};

/** @description Chart calculation initialization**/
WaterfallChart.prototype.initializeCalculation = function() {
    this.calculateMaxValue();
    this.calculateFinalMinMax();

    this.setChartDrawingArea();
    var categoryData = this.updateCategoryData(this.m_categoryData);
    var seriesData = this.updateSeriesData(this.m_seriesData);
    this.m_calculation.init(this, categoryData, seriesData);
    this.m_xPixelArray = this.m_calculation.getxPixelArray();
    this.m_yPixelArray = this.m_calculation.getyPixelArray();
    this.m_stackWidth = this.m_calculation.getBarWidth();
    this.m_stackHeightArray = this.m_calculation.getstackHeightArray();

    /*if ((IsBoolean(this.getCounterFlagForSeriesVisiblity())) && IsBoolean(this.m_showmarkingorpercentvalue)) {
        this.m_percentageArray = IsBoolean(this.m_showpercentvalue) ? (IsBoolean(this.getCheckedAllPosContainigZero()) ? (this.getPercentage()) : (this.getRoundValue(this.getPercentage(), 100))) : (this.getPercentage());
        this.m_showPerCentageFlag = true;
    }*/
    this.setColorsForSeries();
    this.initializeColumns();
};

/** @description removes the NaN values and filter the numeric data **/
WaterfallChart.prototype.updateSeriesData = function(array) {
    var arr = [];
    if ((array != undefined && array !== null && array !== "") && array.length != 0) {
        for (var i = 0, length = array[0].length; i < length; i++) {
            arr[i] = [];
            for (var j = 0, innerlength = array.length; j < innerlength; j++) {
                arr[i][j] = array[j][i];
            }
        }
    }
    return arr;
};

/** @description Creating object of Columns class and initializing the values**/
WaterfallChart.prototype.initializeColumns = function() {
    for (var i = 0, length = this.visibleSeriesInfo.seriesName.length; i < length; i++) {
        this.m_columnsArray[this.visibleSeriesInfo.seriesName[i]] = new WaterfallColumns();
        this.m_columnsArray[this.visibleSeriesInfo.seriesName[i]].init(this.m_xPixelArray[i], this.m_yPixelArray[i], this.m_stackWidth, this.m_stackHeightArray[i], this.m_percentageArray, this.getColorsForSeries()[i], this.m_strokecolor, this.m_showgradient, this.m_showPerCentageFlag, this.m_showpercentvalue, this.m_plotTrasparencyArray[i], this);
    }
};


/** @description Creating this.m_seriesColorsArray and storing color according to the selected chart type**/
WaterfallChart.prototype.setColorsForSeries = function() {
    this.m_seriesColorsArray = [];
    var seriesColors = this.visibleSeriesInfo.seriesColor;
    for (var i = 0; i < this.visibleSeriesInfo.seriesData.length; i++) {
        this.m_seriesColorsArray[i] = [];
        for (var j = 0, innerlength = this.visibleSeriesInfo.seriesData[i].length - 1; j < innerlength; j++) {
            if (this.visibleSeriesInfo.seriesData[i][j] > 0)
                this.m_seriesColorsArray[i][j] = this.m_positivecolor;
            else
                this.m_seriesColorsArray[i][j] = this.m_negativecolor;
        }
        this.m_seriesColorsArray[i][j] = this.m_totalcolor;
    }
};

/** @description Checking, is all series data value contains zero**/
WaterfallChart.prototype.getCheckedAllPosContainigZero = function() {
    var flag = true;
    for (var i = 0, length = this.m_seriesData[this.m_seriesVisiblityPosition].length; i < length; i++) {
        if (this.m_seriesData[this.m_seriesVisiblityPosition][i] != 0)
            flag = false;
    }
    return flag;
};

/** @description Calculating percentage of data**/
/*WaterfallChart.prototype.getPercentage = function() {
    var per = [];
    var sumOfSeries = this.getSumOfSeriesData();
    for (var i = 0, length = this.m_seriesData[this.m_seriesVisiblityPosition].length; i < length; i++) {
        if (IsBoolean(this.m_showpercentvalue))
            per[i] = (this.m_seriesData[this.m_seriesVisiblityPosition][i] == 0) ? 0 : ((this.m_seriesData[this.m_seriesVisiblityPosition][i] / sumOfSeries) * 100);
        else
            per[i] = this.m_seriesData[this.m_seriesVisiblityPosition][i];
    }
    return per;
};*/

/** @description Calculating Max Value from the series data on the basis of selected chart type in Waterfall chart**/
WaterfallChart.prototype.calculateMaxValue = function() {
    this.m_chartType = this.getChartType();
    var yAxisData = this.visibleSeriesInfo.seriesData;
    this.calculateMax = 0;
    this.calculateMin = 0;
    this.count = 0;
    this.max = 0;
    this.min = 0;
    var data = [];
    for (var i = 0, k = 0, length = yAxisData.length; i < length; i++) {
        for (var j = 0, innerlength = yAxisData[i].length; j < innerlength - 1; j++) {
            data[k++] = (yAxisData[i][j]);
        }
    }
    this.calculateMin = 0;
    for (i = 0, length = yAxisData.length; i < length; i++) {
        for (j = 0, innerlength = yAxisData[i].length; j < innerlength - 1; j++) {
            this.count = this.count + 1 * (yAxisData[i][j]);
            if (this.count > this.max)
                this.max = this.count;
            if (this.count < this.min)
                this.min = this.count;

            this.calculateMax = 1 * this.max;
            this.calculateMin = 1 * this.min;
        }
    }
};

/** @Description used calculated  Min/Max value and get required ScaleInfo of The Axis **/
WaterfallChart.prototype.calculateFinalMinMax = function() {
    var calculatedMin = this.calculateMin;
    var calculatedMax = this.calculateMax;

    var obj = this.getCalculateNiceScale(calculatedMin, calculatedMax, this.m_basezero, this.m_autoaxissetup, this.m_minimumaxisvalue, this.m_maximumaxisvalue, (this.m_height));
    this.min = obj.min;
    this.max = obj.max;
    this.yAxisNoOfMarker = obj.markerArray.length;
    this.yAxisText = obj.step;
    this.m_yAxisMarkersArray = obj.markerArray;
};

/** @description Setter for Start X **/
WaterfallChart.prototype.setStartX = function() {
    this.yaxisLabelFont = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
    this.yaxisDescriptionFont = this.m_yAxis.m_fontstyle + " " + this.m_yAxis.m_fontweight + " " + this.fontScaling(this.m_yAxis.m_fontsize) + "px " + selectGlobalFont(this.m_yAxis.m_fontfamily);
    var btdm = this.getBorderToDescriptionMargin();
    var dm = this.getYAxisDescriptionMargin();
    var dtlm = this.getDescriptionToLabelMargin();
    var ltam = this.getLabelToAxisMargin();
    var lm = this.getYAxisLabelMargin();
    this.m_startX = this.m_x * 1 + btdm * 1 + dm * 1 + dtlm * 1 + lm * 1 + ltam * 1;
};

/** @description Calculating Y Axis Label Margin and returning margin value **/
WaterfallChart.prototype.getYAxisLabelMargin = function() {
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

/** @description Calculating Y Axis Label Margin and returning margin value **/
WaterfallChart.prototype.getLabelFormatterMargin = function() {
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

/** @description Adding formatter in y Axis markers and calculating largest width of the marker and setting into global variable this.m_labelwidth**/
WaterfallChart.prototype.setLabelWidth = function() {
	this.m_labelwidth = 0;
	var maxSeriesVals = [];
	if (this.fontScaling(this.m_yAxis.m_labelfontsize) > 0) {
		for(var i = 0;i < this.m_yAxisMarkersArray.length ;i++ ) {
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

/** @description Getter method Calculating Label Sign Margin and returning margin value**/
WaterfallChart.prototype.getLabelSignMargin = function() {
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

/** @description Calculating Label precision margin **/
WaterfallChart.prototype.getLabelPrecisionMargin = function() {
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

/** @description Getter for Y Axis Label width **/
WaterfallChart.prototype.getLabelWidth = function() {
    return this.m_labelwidth;
};

/** @description Getter for Category Data**/
WaterfallChart.prototype.getCategoryData = function() {
    return this.m_categoryData;
};

/** @description Calculating second formatter margin**/
WaterfallChart.prototype.getLabelSecondFormatterMargin = function() {
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

/** @description Setter for End X**/
WaterfallChart.prototype.setEndX = function() {
    var blm = this.getBorderToLegendMargin();
    var vlm = this.getVerticalLegendMargin();
    var vlxm = this.getVerticalLegendToXAxisMargin();
    var rightSideMargin = blm * 1 + vlm * 1 + vlxm * 1;
    this.m_endX = (this.m_x * 1 + this.m_width * 1 - rightSideMargin * 1);
};

/** @description Setter for Start X**/
WaterfallChart.prototype.setStartY = function() {
    var cm = this.getChartMargin();
    var xlbm = this.getXAxisLabelMargin();
    var xdm = this.getXAxisDescriptionMargin();
    var bottomMargin = cm * 1 + xlbm * 1 + xdm * 1;
    this.m_startY = (this.m_y * 1 + this.m_height * 1 - bottomMargin * 1);
};

/** @description Setter for End Y**/
WaterfallChart.prototype.setEndY = function() {
    this.m_endY = (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1 + this.getSpaceForShowText() * 1);
};

/** @description Calculating X Axis Label Margin, X Axis will contain the Category Values**/
WaterfallChart.prototype.getXAxisLabelMargin = function() {
    var xAxislabelDescMargin = this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.8;
    var radians = this.m_xAxis.m_labelrotation * (Math.PI / 180); 
    if (IsBoolean(this.m_xAxis.getLabelTilted())) {
        this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
       // xAxislabelDescMargin = this.ctx.measureText(this.m_categoryData[0][0]).width;
        for (var i = 1, length = this.m_categoryData[0].length; i < length; i++) {
			var markerWidth = Math.abs(this.ctx.measureText(this.m_categoryData[0][i]).width * radians);
            if (xAxislabelDescMargin < markerWidth)
                xAxislabelDescMargin = markerWidth;
        }
        if (xAxislabelDescMargin > this.m_height / 4) {
            xAxislabelDescMargin = (this.m_xAxis.getLabelrotation() <= 70) ? (this.m_height / 4 - 5) : this.m_height / 4;
        }
    } else {
        this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
        var xlm = this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.8;
        this.noOfRows = this.setNoOfRows();
        xAxislabelDescMargin = (xlm) * this.noOfRows;
    }
    return xAxislabelDescMargin;
};

/** @description If the Category Values are greater than the given width than it will break into two rows**/
WaterfallChart.prototype.setNoOfRows = function() {
    this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
    var noOfRow = 1;
    if (!IsBoolean(this.isEmptyCategory)) {
        var textWidth = this.ctx.measureText(this.m_categoryData[0][0]).width;
        var xDivision = (this.getEndX() - this.getStartX()) / this.m_categoryData[0].length;
        for (var i = 1, length = this.m_categoryData[0].length; i < length; i++) {
            if (this.ctx.measureText(this.m_categoryData[0][i]).width > xDivision)
                noOfRow = 2;
        }
    }
    return noOfRow;
};

/** @description Calculating text space for subtitle Text**/
WaterfallChart.prototype.getSpaceForShowText = function() {
    if (((IsBoolean(this.getCounterFlagForSeriesVisiblity())) && IsBoolean(this.m_showmarkingorpercentvalue)) && (IsBoolean(this.m_subTitle.m_showsubtitle) || IsBoolean(this.getShowGradient())))
        return 15;
    else
        return 0;
};

/** @description Calculating Series Visibility and returning is any series is visible or not**/
WaterfallChart.prototype.getCounterFlagForSeriesVisiblity = function() {
    var count = 0;
    for (var i = 0, length = this.m_seriesData.length; i < length; i++) {
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
            count++;
            this.m_seriesVisiblityPosition = i;
        }
    }
    if (count == 1)
        return true;
    else
        return false;
};

/** @description Category data array transformation**/
WaterfallChart.prototype.updateCategoryData = function(array) {
    var arr = [];
    if ((array != undefined && array !== null && array !== "") && array.length != 0) {
        for (var i = 0, length = array[0].length; i < length; i++) {
            arr[i] = [];
            for (var j = 0, innerlength = array.length; j < innerlength; j++) {
                arr[i][j] = array[j][i];
            }
        }
    }
    return arr;
};

/** @description Getter for All Series color**/
WaterfallChart.prototype.getColorsForSeries = function() {
    return this.m_seriesColorsArray;
};

/** @description Putting All Bar X Position into one Array **/
WaterfallChart.prototype.getXPositionforToolTip = function() {
    var xPosArray = [];
    var xPosDataArray = this.m_calculation.getxPixelArray();
    for (var n = 0, length = xPosDataArray[0].length; n < length; n++) {
        xPosArray.push(xPosDataArray[0][n]);
    }
    return xPosArray;
};


/** @description Calculating TooltTip Data according to selected chart type and return hover bar details **/
WaterfallChart.prototype.getToolTipData = function(mouseX, mouseY) {
    var toolTipData;
    if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory) && IsBoolean(this.isVisibleSeries()) && IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")) {
        var newVal = "";
        var isNaNValue;
        this.xPositions = this.getXPositionforToolTip();
        var seriesData = this.getSeriesToolTipData(); /*this.getVisibleSeriesData(this.getSeriesToolTipData()).seriesData;*/
        var totalColumnWidth = this.m_calculation.getBarWidth() * this.m_xPixelArray.length;

        if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
            for (var i = 0, length = this.xPositions.length; i < length; i++) {
                if (mouseX <= (this.xPositions[i] * 1 + totalColumnWidth * 1) && (mouseX >= this.xPositions[i] * 1)) {
                    toolTipData = {};
                    if (IsBoolean(this.m_customtextboxfortooltip.dataTipType == "Default")) {
                    	toolTipData.cat = "";
                        toolTipData["data"] = new Array();
                        toolTipData.cat = this.getCategoryData()[0][i];
                        for (var j = 0, k = 0, innerlength = seriesData.length; j < innerlength; j++) {
                            isNaNValue = false;
                            var data = [];
                            if (this.getCategoryData()[0][i] == this.m_calculatedname) {
                                data[0] = {"color":this.m_totalcolor,"shape":this.legendMap[this.getSeriesNames()].shape};
                            } else {
                                if (seriesData[j][i] > 0) {
                                    data[0] = {"color":this.m_positivecolor,"shape":this.legendMap[this.getSeriesNames()].shape};
                                } else {
                                    data[0] = {"color":this.m_negativecolor,"shape":this.legendMap[this.getSeriesNames()].shape};
                                }
                            }
                            /*data[0] = this.visibleSeriesInfo.seriesColor[j];*/
                            data[1] = this.visibleSeriesInfo.seriesDisplayName[j];
                            if ((seriesData[j][i] == "" || isNaN(seriesData[j][i]) || seriesData[j][i] == null || seriesData[j][i] == "null")) {
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
                            var FormterData = this.getFormatterForToolTip(newVal);
                            data[2] = FormterData;
                            toolTipData.data[k] = data;
                            k++;
                        }
                        toolTipData.highlightIndex = this.getDrillColor(mouseX, mouseY);
                        if (IsBoolean(this.m_controlledtooltip)) {
							toolTipData = this.updateTooltipData(toolTipData);
						}
                        break;
                    }else{
                    	if(i == this.xPositions.length-1){
                    		var toolTipForTotal = {};
                    		toolTipForTotal[this.m_fieldsJson[0].Name] = this.m_categoryData[0][i];
                    		toolTipForTotal[this.m_fieldsJson[1].Name] = this.m_seriesData[0][i];
                            toolTipData = toolTipForTotal;
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

/** @description Getting Drill Bar Color**/
WaterfallChart.prototype.getDrillColor = function(mouseX, mouseY) {
    if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory)))) {
        for (var k = 0, length = this.m_xPixelArray.length; k < length; k++) {
            for (var i = 0, innerlength = this.m_xPixelArray[k].length; i < innerlength; i++) {
                if (mouseX <= (this.m_xPixelArray[k][i] * 1 + this.m_calculation.getBarWidth() * 1) && mouseX >= this.m_xPixelArray[k][i] * 1) {
                    if (this.m_charttype != "overlaid") {
                    	for (var j = 0, subInnerlength = this.m_yPixelArray.length; j < subInnerlength; j++) {
                    	    if (this.m_stackHeightArray[j][i] * 1 < 0) {
                    	        var range1 = this.m_yPixelArray[j][i] * 1 + this.m_stackHeightArray[j][i] * 1;
                    	        var range2 = this.m_yPixelArray[j][i] * 1;
                    	    } else {
                    	        var range1 = this.m_yPixelArray[j][i] * 1;
                    	        var range2 = this.m_yPixelArray[j][i] * 1 + this.m_stackHeightArray[j][i] * 1;
                    	    }
                    	    if (mouseY <= range2 && mouseY >= range1) {
                    	        return k;
                    	    }
                    	}
                    } else {
                        for (var j = this.m_yPixelArray.length - 1; j >= 0; j--) {
                            if (mouseY <= this.getStartY() && mouseY >= Math.ceil(this.m_yPixelArray[j][i] * 1)) {
                                return this.m_calculation.m_originalindexforoverlaiddata[2][j][i];
                            }
                        }
                    }
                }
            }
        }
    }
};

/** @description Getting Drilled Bar Details**/
WaterfallChart.prototype.getDrillDataPoints = function(mouseX, mouseY) {
    if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory))) && IsBoolean(this.isVisibleSeries())) {
        for (var k = 0, length = this.m_xPixelArray.length; k < length; k++) {
            for (var i = 0, innerlength = this.m_xPixelArray[k].length; i < innerlength; i++) {
                if (mouseX <= (this.m_xPixelArray[k][i] * 1 + this.m_calculation.getBarWidth() * 1) && mouseX >= this.m_xPixelArray[k][i] * 1) {
                    for (var j = 0, sunInnerlength = this.m_yPixelArray.length; j < sunInnerlength; j++) {
                    	if (this.m_stackHeightArray[j][i] * 1 < 0) {
                    	    var range1 = this.m_yPixelArray[j][i] * 1 + this.m_stackHeightArray[j][i] * 1;
                    	    var range2 = this.m_yPixelArray[j][i] * 1;
                    	} else {
                    	    var range1 = this.m_yPixelArray[j][i] * 1;
                    	    var range2 = this.m_yPixelArray[j][i] * 1 + this.m_stackHeightArray[j][i] * 1;
                    	}
                        if (mouseY <= range2 && mouseY >= range1) {
                            var fieldNameValueMap = this.getFieldNameValueMap(i);
                            if (this.visibleSeriesInfo.seriesData[k][i] > 0) {
                                var drillColor = (this.getCategoryData()[0][i] == this.m_calculatedname) ? this.m_totalcolor : this.m_positivecolor;
                                var drillField = this.visibleSeriesInfo.seriesName[k];
                                var drillDisplayField = this.visibleSeriesInfo.seriesDisplayName[k];
                            } else {
                                var drillColor = (this.getCategoryData()[0][i] == this.m_calculatedname) ? this.m_totalcolor : this.m_negativecolor;
                                var drillField = this.visibleSeriesInfo.seriesName[k];
                                var drillDisplayField = this.visibleSeriesInfo.seriesDisplayName[k];
                            }
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
        }
    }
};

/** @description returns the fields and values in a hash when drill happens on a data point **/
WaterfallChart.prototype.getFieldNameValueMap = function(i) {
    var m_fieldNameValueMap = new Object();
    for (var k = 0, length = this.getAllCategoryNames().length; k < length; k++) {
        m_fieldNameValueMap[this.getAllCategoryNames()[k]] = this.getDataFromJSONCategory(this.getAllCategoryNames()[k])[i];
    }
    for (var j = 0, length = this.getAllSeriesNames().length; j < length; j++) {
        m_fieldNameValueMap[this.getAllSeriesNames()[j]] = this.getDataFromJSONSeries(this.getAllSeriesNames()[j])[i];
    }
    return m_fieldNameValueMap;
};
/** @description Creating ColumnCalculation Class and assigning default values to the variables and creating arrays which will be used in calculation **/
function WaterfallCalculation() {
    this.m_xAxisPixelArray = [];
    this.m_columnGap;
    this.m_yAxisText;
    this.m_ypixelArray = [];
    this.m_stackHeightArray = [];
    this.m_yAxisMarkersArray = [];

    this.m_startX;
    this.m_startY;
    this.m_endX;
    this.m_endY;
    this.m_util = new Util();
    this.ctx = "";
    this.m_maxbarwidth = 40;
};

/** @description Waterfall Chart's Column Calculation initialization**/
WaterfallCalculation.prototype.init = function(m_chart, m_categoryData, m_seriesData) {
    this.m_chart = m_chart;
    this.m_xAxisData = m_categoryData;
    this.m_yAxisData = this.m_chart.visibleSeriesInfo.seriesData;
    this.m_maxbarwidth = this.m_chart.m_maxbarwidth * (1 + (this.m_yAxisData.length - 1) * 0.5);
    this.m_startX = this.m_chart.getStartX();
    this.m_startY = this.m_chart.getStartY();
    this.m_endX = this.m_chart.getEndX();
    this.m_endY = this.m_chart.getEndY();

    this.m_chartType = this.m_chart.getChartType();
    this.setDrawHeight();
    this.setDrawWidth();
    this.m_columnGap = 10;
    /*this.setCount();*/
    this.calculateBarWidth();
    this.setRatio();
    this.setxPixelArray();
    this.setyPixelArray();
    this.setstackHeightArray();
};

/** @description Setter for draw Height**/
WaterfallCalculation.prototype.setDrawHeight = function() {
    this.drawHeight = (this.m_startY - this.m_endY);
};

/** @description Setter for draw Width**/
WaterfallCalculation.prototype.setDrawWidth = function() {
    this.drawWidth = 1 * (this.m_endX) - 1 * (this.m_startX);
};

/** @description Calculating Bar Width according to the given data**/
WaterfallCalculation.prototype.calculateBarWidth = function() {
    var numberOfColumns = this.m_xAxisData.length;
    var totalGap = (1 * (numberOfColumns)) * this.m_columnGap;
    var availableDrawWidth = this.getDrawWidth() * 1; /*(this.getDrawWidth() * 1 - totalGap * 1);*/
    var barWidth = (availableDrawWidth / numberOfColumns);
    barWidth = (barWidth * this.m_chart.m_barwidth)/100;
/*    if (barWidth > this.m_maxbarwidth) {
        this.setBarWidth(this.m_maxbarwidth);
        this.setColumnGap(this.m_maxbarwidth);
    } else if (barWidth < 9) {
        this.setBarWidth(9);
        this.setColumnGap(9);
    } else {
        this.setBarWidth(barWidth);
    }*/
    this.setBarWidth(barWidth);
	this.setColumnGap(barWidth);
};

/** @description Getter for Draw Width**/
WaterfallCalculation.prototype.getDrawWidth = function() {
    return this.drawWidth;
};

/** @description Setter for Bar Width**/
WaterfallCalculation.prototype.setBarWidth = function(barwidth) {
    this.barWidth = barwidth;
    this.setBarWidthForClustered();
};

/** @description Calculating BarWidth for Clustered**/
WaterfallCalculation.prototype.setBarWidthForClustered = function() {
    this.barWidth /= this.m_yAxisData.length;
};

/** @description Calculating Column Gap**/
WaterfallCalculation.prototype.setColumnGap = function(barWidth) {
    var totalBarwidth = barWidth * this.m_xAxisData.length;
    var totalGap = this.getDrawWidth() - totalBarwidth;
    this.m_columnGap = totalGap / (this.m_xAxisData.length);
};

/** @description Setter for Ratio**/
WaterfallCalculation.prototype.setRatio = function() {
    var diff = this.getMaxValue() - this.minValue();
    if (diff > 0)
        this.ratio = this.getDrawHeight() / (diff);
    else
        this.ratio = 1;
};
/** @description Getter for Ratio**/
WaterfallCalculation.prototype.getRatio = function() {
    return this.ratio;
};

/** @description Getter for Max Value**/
WaterfallCalculation.prototype.getMaxValue = function() {
    return this.m_chart.max;
};

/** @description Getter for Min Value**/
WaterfallCalculation.prototype.minValue = function() {
    return this.m_chart.min;
};

/** @description Getter for DrawHeight**/
WaterfallCalculation.prototype.getDrawHeight = function() {
    return this.drawHeight;
};

/** @description Setter for X Pixel Array**/
WaterfallCalculation.prototype.setxPixelArray = function() {
    var m_xAxisPixelArray = [];
    for (var i = 0, length = this.m_yAxisData[0].length; i < length; i++) {
        m_xAxisPixelArray[i] = [];
        for (var j = 0, innerlength = this.m_yAxisData.length; j < innerlength; j++) {
            m_xAxisPixelArray[i][j] = (this.m_startX) * 1 + (this.getBarWidth()) * 1 * j + (this.getColumnGap() / 2) + ((this.getBarWidth()) * 1 * this.m_yAxisData.length + (this.getColumnGap()) * 1) * i;
        }
    }
    // re-transforming 2d array of 5X2
    this.m_xPixelArray = this.transformXPixelArray(m_xAxisPixelArray);
};

/** @description Getter for Bar Width**/
WaterfallCalculation.prototype.getBarWidth = function() {
    return this.barWidth;
};

/** @description Getter for Column Gap**/
WaterfallCalculation.prototype.getColumnGap = function() {
    return this.m_columnGap;
};

/** @description Transformation in the given Array**/
WaterfallCalculation.prototype.transformXPixelArray = function(m_xAxisPixelArray) {
    var xPixelsarr = [];
    for (var i1 = 0, length = this.m_yAxisData.length; i1 < length; i1++) {
        xPixelsarr[i1] = [];
        for (var j1 = 0, innerlength = this.m_yAxisData[0].length; j1 < innerlength; j1++) {
            xPixelsarr[i1][j1] = m_xAxisPixelArray[j1][i1];
        }
    }
    return xPixelsarr;
};

/** @description Calculating Y Pixel Array  **/
WaterfallCalculation.prototype.setyPixelArray = function() {
    this.m_ypixelArray = this.getYPixelArrayForWaterfall();
};

/** @description Calculating Y Pixel Array For Clustered **/
WaterfallCalculation.prototype.getYPixelArrayForWaterfall = function() {
    var yparray = [];
    var base = 0;
    var value = 0;
    var pos = false;
    var neg = false;
    var posCount = 0;
    var negCount = 0;

    for (var i = 0, length = this.m_yAxisData.length; i < length; i++) {
        for (var j = 0, innerlength = this.m_yAxisData[i].length; j < innerlength; j++) {
            if (this.m_yAxisData[i][j] > 0)
                posCount++;
            if (posCount == this.m_yAxisData[i].length)
                pos = true;

            if (this.m_yAxisData[i][j] < 0)
                negCount++;
            if (negCount == this.m_yAxisData[i].length)
                neg = true;
        }
    }

    var ratio = this.getRatio();
    var min = this.minValue();
    var max = this.getMaxValue();
    this.total = 0;
    var firstMixNegBar;
    var firstNegativeBarFlag = true;
    var firstMixNegBarMax;
    var firstMixNegBarMin;
    for (var i = 0, length = this.m_yAxisData.length; i < length; i++) {
        yparray[i] = [];
        for (var j = 0, innerlength = this.m_yAxisData[i].length; j < innerlength; j++) {
            this.total = this.total + (1 * this.m_yAxisData[i][j]);
            if (IsBoolean(this.m_chart.isAxisSetup())) {
                if (IsBoolean(this.m_chart.isBaseZero())) { //when axis + base +
                    if (pos == true) {
                        if (j == innerlength - 1) {
                            var starty = this.m_startY;
                            value = this.total - this.m_yAxisData[i][j];
                            yparray[i][j] = (starty - (ratio * value));
                        } else {
                            var starty = this.m_startY;
                            value = (1 * this.m_yAxisData[i][j]) + (1 * base);
                            base = value;
                            yparray[i][j] = (starty - (ratio * value));
                        }
                    } else if (neg == true) {
                        if (j == innerlength - 1) {
                            var starty = this.m_startY - (Math.abs(min) * ratio);
                            value = max;
                            yparray[i][j] = (starty - (ratio * value));
                        } else {
                            var starty = this.m_startY - (Math.abs(min) * ratio);
                            value = base;
                            base = (1 * base) - (1 * this.m_yAxisData[i][j]);
                            yparray[i][j] = (1 * starty) + (ratio * value);
                        }
                    } else {
                        if (j == innerlength - 1) {
                            if (min < 0) {
                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                value = max;
                                yparray[i][j] = (starty - (ratio * value));
                            } else {
                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                if ((1 * this.m_yAxisData[i][j]) > 0) {
                                    value = this.total - this.m_yAxisData[i][j];
                                    yparray[i][j] = (starty - (ratio * value));
                                } else {
                                    value = (this.total < min) ? min : max;
                                    yparray[i][j] = (starty - (ratio * value));
                                }
                            }
                        } else {
                            var starty = this.m_startY - (Math.abs(min) * ratio);
                            if ((1 * this.m_yAxisData[i][j]) > 0) {
                                value = (1 * this.m_yAxisData[i][j]) + base;
                                base = this.total;
                                yparray[i][j] = (starty - (ratio * value));
                            } else {
                                value = base;
                                base = this.total;
                                yparray[i][j] = (starty - (ratio * value));
                            }
                        }
                    }
                } else {
                    if (pos == true) { //when axis + base -
                        if (j == innerlength - 1) {
                            var starty = this.m_startY;
                            value = this.total - this.m_yAxisData[i][j];
                            yparray[i][j] = (starty - (ratio * value));
                        } else {
                            var starty = this.m_startY;
                            value = (1 * this.m_yAxisData[i][j]) + (1 * base);
                            base = value;
                            yparray[i][j] = (starty - (ratio * value));
                        }
                    } else if (neg == true) {
                        if (j == innerlength - 1) {
                            var starty = this.m_startY - (Math.abs(min) * ratio);
                            value = max;
                            yparray[i][j] = (1 * starty) + (ratio * value);
                        } else {
                            var starty = this.m_startY - (Math.abs(min) * ratio);
                            value = base;
                            base = (1 * base) - (1 * this.m_yAxisData[i][j]);
                            yparray[i][j] = (1 * starty) + (ratio * value);
                        }
                    } else {
                        var starty = this.m_startY - (Math.abs(min) * ratio);
                        if (j == innerlength - 1) {
                            if ((1 * this.m_yAxisData[i][j]) > 0) {
                                value = this.total - this.m_yAxisData[i][j];
                                yparray[i][j] = (starty - (ratio * value));
                            } else {
                                value = this.m_yAxisData[i][j] - (this.total - this.m_yAxisData[i][j]);
                                yparray[i][j] = (starty - (ratio * value));
                            }
                        } else {
                            if ((1 * this.m_yAxisData[i][j]) > 0) {
                                value = (1 * this.m_yAxisData[i][j]) + base;
                                base = this.total;
                                yparray[i][j] = (starty - (ratio * value));
                            } else {
                                value = base;
                                base = this.total;
                                yparray[i][j] = (starty - (ratio * value));
                            }
                        }
                    }
                }
            } else {
                if (IsBoolean(this.m_chart.isBaseZero())) {
                    if (pos == true) { //when axis - base +
                        if (j == innerlength - 1) {
                            if (this.total > max) {
                                var starty = this.m_startY;
                                value = (this.total - this.m_yAxisData[i][j] > max) ? (1 * max) : this.total - this.m_yAxisData[i][j];
                                yparray[i][j] = (starty - (ratio * value));
                            } else {
                                var starty = this.m_startY;
                                value = this.total - this.m_yAxisData[i][j];
                                yparray[i][j] = (starty - (ratio * value));
                            }
                        } else {
                            if (this.total > max) {
                                var starty = this.m_startY;
                                value = (1 * max);
                                base = this.total;
                                yparray[i][j] = (starty - (ratio * value));
                            } else {
                                var starty = this.m_startY;
                                value = (1 * this.m_yAxisData[i][j]) + (1 * base);
                                base = this.total;
                                yparray[i][j] = (starty - (ratio * value));
                            }
                        }
                    } else if (neg == true) {
                        //base is true. therefore no use of this code.
                        var starty = this.m_startY - (Math.abs(min) * ratio);
                        value = base;
                        base = (1 * base) - (1 * this.m_yAxisData[i][j]);
                        yparray[i][j] = (1 * starty) + (ratio * value);
                    } else {
                        if (j == innerlength - 1) {
                            var starty = this.m_startY;
                            if (this.total <= max) {
                                if (this.total >= min) {
                                    value = this.total - this.m_yAxisData[i][j];
                                    yparray[i][j] = (starty - (ratio * value));
                                } else {
                                    value = min;
                                    yparray[i][j] = (starty - (ratio * value));
                                }
                            } else {
                                if (this.total >= min) {
                                    value = ((this.total - this.m_yAxisData[i][j]) < max) ? this.total - this.m_yAxisData[i][j] : max;
                                    yparray[i][j] = (starty - (ratio * value));
                                } else {

                                }
                            }
                        } else {
                            var starty = this.m_startY;
                            if (this.total <= max) {
                                if (this.total >= min) {
                                    if (this.m_yAxisData[i][j] > 0) {
                                        value = (1 * this.m_yAxisData[i][j]) + base;
                                        base = this.total;
                                        yparray[i][j] = (starty - (ratio * value));
                                    } else {
                                        value = (IsBoolean(firstMixNegBarMax)) ? max : base;
                                        firstMixNegBarMax = false;

                                        base = this.total;
                                        yparray[i][j] = (starty - (ratio * value));
                                    }
                                } else {
                                    if (this.m_yAxisData[i][j] > 0) {

                                    } else {
                                        value = (IsBoolean(firstMixNegBarMin)) ? max : base;
                                        base = this.total;
                                        yparray[i][j] = (starty - (ratio * value));
                                    }
                                }
                            } else {
                                if (this.total >= min) {
                                    if (this.m_yAxisData[i][j] > 0) {
                                        value = max;
                                        base = this.total;
                                        yparray[i][j] = (starty - (ratio * value));
                                        firstMixNegBarMax = true;
                                        firstMixNegBarMin = true;
                                    } else {
                                        value = max;
                                        base = this.total;
                                        yparray[i][j] = (starty - (ratio * value));
                                        firstMixNegBarMax = true;
                                        firstMixNegBarMin = true;
                                    }
                                } else {

                                }
                            }
                        }
                    }
                } else { //when axis - base -
                    if (pos == true) {
                        if (j == innerlength - 1) {
                            if (min < 0) {
                                if (this.total <= max) {
                                    if (this.total >= min) {
                                        var starty = this.m_startY - (Math.abs(min) * ratio);
                                        value = this.total - this.m_yAxisData[i][j];
                                        yparray[i][j] = (starty - (ratio * value));
                                    } else {
                                        var starty = this.m_startY - (Math.abs(min) * ratio);
                                        value = (IsBoolean(firstMixNegBarMin)) ? base : min;
                                        base = this.total;
                                        firstMixNegBarMin = false;
                                        yparray[i][j] = (starty - (ratio * value));
                                    }
                                } else {
                                    if (this.total >= min) {
                                        var starty = this.m_startY - (Math.abs(min) * ratio);
                                        value = ((this.total - this.m_yAxisData[i][j]) < max) ? base : max;
                                        base = this.total;
                                        firstMixNegBarMax = true;
                                        firstMixNegBarMin = true;
                                        yparray[i][j] = (starty - (ratio * value));
                                    } else {

                                    }
                                }
                            } else {
                                if (this.total <= max) {
                                    if (this.total >= min) {
                                        var starty = this.m_startY + (Math.abs(min) * ratio);
                                        value = (1 * this.m_yAxisData[i][j]) + (1 * base);
                                        base = this.total;
                                        yparray[i][j] = (starty - (ratio * value));
                                    } else {
                                        var starty = this.m_startY + (Math.abs(min) * ratio);
                                        value = (1 * this.m_yAxisData[i][j]) + (1 * base);
                                        base = this.total;
                                        yparray[i][j] = (starty - (ratio * value));
                                    }
                                } else {
                                    if (this.total >= min) {
                                        var starty = this.m_startY + (Math.abs(min) * ratio);
                                        value = ((this.total - this.m_yAxisData[i][j]) < max) ? base : max;
                                        base = this.total;
                                        yparray[i][j] = (starty - (ratio * value));
                                    } else {

                                    }
                                }
                            }
                        } else {
                            if (min < 0) {
                                if (this.total <= max) {
                                    if (this.total >= min) {
                                        var starty = this.m_startY - (Math.abs(min) * ratio);
                                        value = (1 * this.m_yAxisData[i][j]) + (1 * base);
                                        base = this.total;
                                        yparray[i][j] = (starty - (ratio * value));
                                    } else {
                                        var starty = this.m_startY - (Math.abs(min) * ratio);
                                        value = (IsBoolean(firstMixNegBarMin)) ? base : min;
                                        base = this.total;
                                        firstMixNegBarMin = false;
                                        yparray[i][j] = (starty - (ratio * value));
                                    }
                                } else {
                                    if (this.total >= min) {
                                        var starty = this.m_startY - (Math.abs(min) * ratio);
                                        value = max;
                                        base = this.total;
                                        firstMixNegBarMax = true;
                                        firstMixNegBarMin = true;
                                        yparray[i][j] = (starty - (ratio * value));
                                    } else {

                                    }
                                }
                            } else {
                                if (this.total <= max) {
                                    if (this.total >= min) {
                                        var starty = this.m_startY + (Math.abs(min) * ratio);
                                        value = (1 * this.m_yAxisData[i][j]) + (1 * base);
                                        base = this.total;
                                        yparray[i][j] = (starty - (ratio * value));
                                    } else {
                                        var starty = this.m_startY + (Math.abs(min) * ratio);
                                        value = (1 * this.m_yAxisData[i][j]) + (1 * base);
                                        base = this.total;
                                        yparray[i][j] = (starty - (ratio * value));
                                    }
                                } else {
                                    if (this.total >= min) {
                                        var starty = this.m_startY + (Math.abs(min) * ratio);
                                        value = max;
                                        base = this.total;
                                        yparray[i][j] = (starty - (ratio * value));
                                    } else {

                                    }
                                }
                            }
                        }
                    } else if (neg == true) {
                        if (j == innerlength - 1) {
                            if (max >= 0) {
                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                value = base - this.m_yAxisData[i][j];
                                yparray[i][j] = (starty - (ratio * value));
                            } else {
                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                value = max;
                                yparray[i][j] = (starty - (ratio * value));
                            }
                        } else {
                            if (max >= 0) {
                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                value = (1 * base);
                                base = this.total;
                                yparray[i][j] = (starty - (ratio * value));
                            } else {
                                if (this.total > max) {
                                    var starty = this.m_startY - (Math.abs(min) * ratio);
                                    value = max; //firstMixNegBarMax
                                    firstNegativeBarFlag = true;
                                    base = this.total;
                                    yparray[i][j] = (starty - (ratio * value));
                                } else {
                                    var starty = this.m_startY - (Math.abs(min) * ratio);
                                    value = (IsBoolean(firstNegativeBarFlag)) ? max : base; //firstMixNegBarMax
                                    firstNegativeBarFlag = false;
                                    base = this.total;
                                    yparray[i][j] = (starty - (ratio * value));
                                }
                            }
                        }
                    } else {
                        if (j == innerlength - 1) {
                            if (max > 0) {
                                if (min >= 0) {
                                    if (this.total - this.m_yAxisData[i][j] <= max) {
                                        if (this.total - this.m_yAxisData[i][j] >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                var starty = this.m_startY; //when max>0 min>=0 total<=max total>min
                                                value = base - min;
                                                base = this.total;
                                                yparray[i][j] = (starty - (ratio * value));
                                            } else {
                                                var starty = this.m_startY;
                                                value = (!IsBoolean(firstMixNegBar)) ? max - min : (1 * base) - (1 * min);
                                                firstMixNegBar = true;
                                                base = this.total;
                                                yparray[i][j] = (starty - (ratio * value));
                                            }
                                        } else {
                                            var starty = this.m_startY; //when max>0 min>0 total<=max total<min
                                            value = (!IsBoolean(firstMixNegBar)) ? max : ((1 * this.total) - (1 * min)) - (1 * this.m_yAxisData[i][j]); //modified (min)
                                            base = this.total;
                                            yparray[i][j] = (starty - (ratio * value));
                                        }
                                    } else {
                                        if (this.total - this.m_yAxisData[i][j] > min) {
                                            var starty = this.m_startY; //when max>0 min>=0 total>max total>min
                                            value = max - min;
                                            base = this.total;
                                            yparray[i][j] = (starty - (ratio * value));
                                            firstMixNegBar = false;
                                        } else {
                                            //Not possible
                                        }
                                    }
                                } else {
                                    //max>0 min<0
                                    if (this.total - this.m_yAxisData[i][j] <= max) {
                                        if (this.total - this.m_yAxisData[i][j] >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                value = base;
                                                base = this.total;
                                                yparray[i][j] = (starty - (ratio * value));
                                            } else {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                /*value = (firstMixNegBar == true)?max:base;*/
                                                value = 1 * base - (1 * this.total - 1 * this.m_yAxisData[i][j]);
                                                base = this.total;
                                                /*firstMixNegBar = false;*/
                                                yparray[i][j] = (starty - (ratio * value));
                                            }
                                        } else {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                value = base;
                                                base = this.total;
                                                yparray[i][j] = (starty - (ratio * value));
                                            } else {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                value = 1 * base - this.m_yAxisData[i][j];
                                                base = this.total;
                                                yparray[i][j] = (starty - (ratio * value));
                                            }
                                        }
                                    } else {
                                        if (this.total >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                value = ((this.total - this.m_yAxisData[i][j]) > max) ? max : base;
                                                base = this.total;
                                                firstMixNegBar = true;
                                                yparray[i][j] = (starty - (ratio * value));
                                            } else {

                                            }
                                        } else {

                                        }
                                    }
                                }
                            } else {
                                if (min > 0) {
                                    //max<0 min>0
                                } else {
                                    //max<0 min<0
                                    if (this.total - this.m_yAxisData[i][j] <= max) {
                                        if (this.total - this.m_yAxisData[i][j] >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                value = (1 * this.m_yAxisData[i][j]) + (1 * base);
                                                base = this.total;
                                                yparray[i][j] = (starty - (ratio * value));
                                            } else {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                /*value = ((Math.abs(this.total) - Math.abs(max))>Math.abs(this.m_yAxisData[i][j]))?base:max;*/
                                                value = max;
                                                base = this.total;
                                                firstMixNegBar = true;
                                                yparray[i][j] = (starty - (ratio * value));
                                            }
                                        } else {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                value = (1 * this.m_yAxisData[i][j]) + (1 * base);
                                                base = this.total;
                                                yparray[i][j] = (starty - (ratio * value));
                                            } else {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                value = max;
                                                base = this.total;
                                                yparray[i][j] = (starty - (ratio * value));
                                            }
                                        }
                                    } else {
                                        if (this.total - this.m_yAxisData[i][j] >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                value = (IsBoolean(firstMixNegBar)) ? max : base;
                                                firstMixNegBar = false;
                                                base = this.total;
                                                yparray[i][j] = (starty - (ratio * value));
                                            } else {

                                            }
                                        } else {

                                        }
                                    }
                                }
                            }
                        } else {
                            if (max > 0) {
                                if (min >= 0) {
                                    if (this.total <= max) {
                                        if (this.total >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                var starty = this.m_startY; //when max>0 min>=0 total<=max total>min
                                                value = ((1 * this.m_yAxisData[i][j]) + (1 * base)) - (1 * min);
                                                base = this.total;
                                                firstMixNegBarMin = true;
                                                yparray[i][j] = (starty - (ratio * value));
                                            } else {
                                                var starty = this.m_startY;
                                                value = (!IsBoolean(firstMixNegBar)) ? max - min : (1 * base) - (1 * min);
                                                firstMixNegBar = true;
                                                base = this.total;
                                                yparray[i][j] = (starty - (ratio * value));
                                            }
                                        } else {
                                            if (firstMixNegBarMin == true) {
                                                var starty = this.m_startY;
                                                value = base - min;
                                                base = this.total;
                                                firstMixNegBarMin = false;
                                                yparray[i][j] = (starty - (ratio * value));
                                            } else {
                                                var starty = this.m_startY; //when max>0 min>0 total<=max total<min
                                                value = (!IsBoolean(firstMixNegBar)) ? max : ((1 * this.total) - (1 * min)) - (1 * this.m_yAxisData[i][j]); //modified (min)
                                                base = this.total;
                                                yparray[i][j] = (starty - (ratio * value));
                                            }
                                        }
                                    } else {
                                        if (this.total > min) {
                                            var starty = this.m_startY; //when max>0 min>=0 total>max total>min
                                            value = max - min;
                                            base = this.total;
                                            yparray[i][j] = (starty - (ratio * value));
                                            firstMixNegBar = false;
                                        } else {
                                            //Not possible
                                        }
                                    }
                                } else {
                                    //max>0 min<0
                                    if (this.total <= max) {
                                        if (this.total >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                value = (1 * this.m_yAxisData[i][j]) + (1 * base);
                                                base = this.total;
                                                yparray[i][j] = (starty - (ratio * value));
                                            } else {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                value = (IsBoolean(firstMixNegBar)) ? max : base;
                                                base = this.total;
                                                firstMixNegBar = false;
                                                yparray[i][j] = (starty - (ratio * value));
                                            }
                                        } else {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                value = base;
                                                base = this.total;
                                                yparray[i][j] = (starty - (ratio * value));
                                            } else {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                value = (IsBoolean(firstMixNegBar)) ? max : base;
                                                firstMixNegBar = false;
                                                base = this.total;
                                                yparray[i][j] = (starty - (ratio * value));
                                            }
                                        }
                                    } else {
                                        if (this.total >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                value = max;
                                                base = this.total;
                                                firstMixNegBar = true;
                                                yparray[i][j] = (starty - (ratio * value));
                                            } else {

                                            }
                                        } else {

                                        }
                                    }
                                }
                            } else {
                                if (min > 0) {
                                    //max<0 min>0
                                } else {
                                    //max<0 min<0
                                    if (this.total <= max) {
                                        if (this.total >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                value = (1 * this.m_yAxisData[i][j]) + (1 * base);
                                                base = this.total;
                                                yparray[i][j] = (starty - (ratio * value));
                                            } else {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                value = ((Math.abs(this.total) - Math.abs(max)) > Math.abs(this.m_yAxisData[i][j])) ? base : max;
                                                base = this.total;
                                                firstMixNegBar = true;
                                                yparray[i][j] = (starty - (ratio * value));
                                            }
                                        } else {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                value = (1 * this.m_yAxisData[i][j]) + (1 * base);
                                                base = this.total;
                                                yparray[i][j] = (starty - (ratio * value));
                                            } else {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                value = base;
                                                base = this.total;
                                                yparray[i][j] = (starty - (ratio * value));
                                            }
                                        }
                                    } else {
                                        if (this.total >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                var starty = this.m_startY - (Math.abs(min) * ratio);
                                                value = (IsBoolean(firstMixNegBar)) ? max : base;
                                                firstMixNegBar = false;
                                                base = this.total;
                                                yparray[i][j] = (starty - (ratio * value));
                                            } else {

                                            }
                                        } else {

                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return yparray;
};

/** @description Setting each bar height into this.m_stackHeightArray **/
WaterfallCalculation.prototype.setstackHeightArray = function() {
    var stackHeightArray = [];
    var yparray = [];
    var value = 0;
    this.total = 0;
    var pos = false;
    var neg = false;
    var posCount = 0;
    var negCount = 0;
    var mixFirstBar = false;
    var hidePositiveValue = false;

    for (var i = 0, length = this.m_yAxisData.length; i < length; i++) {
        for (var j = 0, innerlength = this.m_yAxisData[i].length; j < innerlength; j++) {
            if (this.m_yAxisData[i][j] > 0)
                posCount++;
            if (posCount == this.m_yAxisData[i].length)
                pos = true;

            if (this.m_yAxisData[i][j] < 0)
                negCount++;
            if (negCount == this.m_yAxisData[i].length)
                neg = true;
        }
    }

    var ratio = this.getRatio();
    var min = this.minValue();
    var max = this.getMaxValue();
    var firstMixNegative; //for checking mix bar axis
    var firstMixPositive;
    var firstMixPositiveMax;
    var firstMixNegativeMax;
    var firstMixNegativeMin;
    var firstNegativeBarFlag = true;
    var negMixBar;
    var mixLastBar;

    for (var i = 0, length = this.m_yAxisData.length; i < length; i++) {
        stackHeightArray[i] = [];
        for (var j = 0, innerlength = this.m_yAxisData[i].length; j < innerlength; j++) {
            this.total = this.total + (1 * this.m_yAxisData[i][j]);
            if (IsBoolean(this.m_chart.isAxisSetup())) {
                if (IsBoolean(this.m_chart.isBaseZero())) {
                    if (pos == true) { //when axis + and base +
                        value = this.m_yAxisData[i][j];
                        stackHeightArray[i][j] = (ratio * (value));
                    } else if (neg == true) {
                        value = this.m_yAxisData[i][j];
                        stackHeightArray[i][j] = (ratio * Math.abs(value));
                    } else {
                        if (j == innerlength - 1) {
                            if (this.total - this.m_yAxisData[i][j] > 0) {
                                value = (IsBoolean(firstMixPositive)) ? ((1 * this.m_yAxisData[i][j]) - (1 * this.m_yAxisData[i][j] - 1 * this.total)) : (1 * this.m_yAxisData[i][j]);
                                firstMixPositive = false;
                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                            } else {
                                if (min < 0) {
                                    value = this.m_yAxisData[i][j];
                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                } else {
                                    value = (this.total - this.m_yAxisData[i][j] < min) ? 0 : (1 * this.m_yAxisData[i][j]);
                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                    firstMixPositive = true;
                                }
                            }
                        } else {
                            if (this.total > 0) {
                                value = (IsBoolean(firstMixPositive)) ? ((1 * this.m_yAxisData[i][j]) - (1 * this.m_yAxisData[i][j] - 1 * this.total)) : (1 * this.m_yAxisData[i][j]);
                                firstMixPositive = false;
                                firstMixNegativeMin = false;
                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                            } else {
                                if (min < 0) {
                                    value = this.m_yAxisData[i][j];
                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                } else {
                                    if (IsBoolean(firstMixNegativeMin)) {
                                        value = 0;
                                        stackHeightArray[i][j] = (ratio * Math.abs(value));
                                    } else {
                                        value = (this.total < min) ? (1 * this.m_yAxisData[i][j] - 1 * this.total) : (1 * this.m_yAxisData[i][j]);
                                        stackHeightArray[i][j] = (ratio * Math.abs(value));
                                        firstMixPositive = true;
                                        firstMixNegativeMin = true;
                                    }
                                }
                            }
                        }
                    }
                } else { //when axis + and base -
                    if (pos == true) {
                        value = this.m_yAxisData[i][j];
                        stackHeightArray[i][j] = (ratio * (value));
                    } else if (neg == true) {
                        value = this.m_yAxisData[i][j];
                        stackHeightArray[i][j] = (ratio * Math.abs(value));
                    } else {
                        value = (1 * this.m_yAxisData[i][j]);
                        stackHeightArray[i][j] = (ratio * Math.abs(value));
                    }
                }
            } else {
                if (IsBoolean(this.m_chart.isBaseZero())) { // when axis - and base +
                    if (pos == true) {
                        if (j == innerlength - 1) {
                            if (this.total > max) {
                                value = ((this.total - this.m_yAxisData[i][j]) > max) ? max : (this.total - this.m_yAxisData[i][j]);
                                stackHeightArray[i][j] = (ratio * (value));
                            } else {
                                value = this.total - this.m_yAxisData[i][j];
                                stackHeightArray[i][j] = (ratio * (value));
                            }
                        } else {
                            if (this.total > max) {
                                if (!IsBoolean(hidePositiveValue)) {
                                    value = (1 * this.m_yAxisData[i][j]) - (this.total - max);
                                    /*value = (1*max) - (1*this.m_yAxisData[i][j]);*/
                                    stackHeightArray[i][j] = (ratio * (value));
                                    hidePositiveValue = true;
                                } else {
                                    value = 0;
                                    stackHeightArray[i][j] = (ratio * (value));
                                }
                            } else {
                                value = this.m_yAxisData[i][j];
                                stackHeightArray[i][j] = (ratio * (value));
                            }
                        }
                    } else if (neg == true) {
                        //base is true. therefore no use of this code.
                        value = 0;
                        stackHeightArray[i][j] = (ratio * Math.abs(value));
                    } else {
                        if (j == innerlength - 1) {
                            if (this.total <= max) {
                                if (this.total >= min) {
                                    value = this.total - this.m_yAxisData[i][j];
                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                    firstMixPositiveMax = true;
                                } else {
                                    value = 0 /*this.m_yAxisData[i][j] - this.total*/ ;
                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                }
                            } else {
                                if (this.total >= min) {
                                    value = (IsBoolean(firstMixPositiveMax)) ? this.m_yAxisData[i][j] - ((this.total - this.m_yAxisData[i][j]) - this.m_yAxisData[i][j]) : 0;
                                    firstMixPositiveMax = false;
                                    firstMixNegativeMax = true;
                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                } else {

                                }
                            }
                        } else {
                            if (this.total <= max) {
                                if (this.total >= min) {
                                    if (this.m_yAxisData[i][j] > 0) {
                                        value = (IsBoolean(firstMixPositive)) ? (this.m_yAxisData[i][j] - (this.m_yAxisData[i][j] - this.total)) : this.m_yAxisData[i][j];
                                        stackHeightArray[i][j] = (ratio * Math.abs(value));
                                        firstMixNegative = true;
                                        firstMixPositiveMax = true;
                                    } else {
                                        value = (IsBoolean(firstMixNegativeMax)) ? ((1 * this.m_yAxisData[i][j]) - (1 * this.m_yAxisData[i][j] + 1 * max)) : this.m_yAxisData[i][j];
                                        stackHeightArray[i][j] = (ratio * Math.abs(value));
                                        firstMixNegative = true;
                                        firstMixNegativeMax = false;
                                    }
                                } else {
                                    if (this.m_yAxisData[i][j] > 0) {

                                    } else {
                                        if (IsBoolean(firstMixNegativeMin) && Math.abs(this.m_yAxisData[i][j]) > (max - min)) {
                                            value = max - min;
                                            firstMixNegativeMin = false;
                                            firstMixPositive = true;
                                            stackHeightArray[i][j] = (ratio * Math.abs(value));
                                        } else {
                                            value = (IsBoolean(firstMixNegative)) ? (1 * this.m_yAxisData[i][j] - 1 * this.total) : 0;
                                            stackHeightArray[i][j] = (ratio * Math.abs(value));
                                            firstMixNegative = false;
                                            firstMixPositive = true;
                                        }
                                    }
                                }
                            } else {
                                if (this.total >= min) {
                                    if (this.m_yAxisData[i][j] > 0) {
                                        value = (IsBoolean(firstMixPositiveMax)) ? (this.m_yAxisData[i][j] - (this.total - max)) : 0;
                                        stackHeightArray[i][j] = (ratio * Math.abs(value));
                                        firstMixPositiveMax = false;
                                        firstMixNegativeMax = true;
                                        firstMixNegativeMin = true;
                                    } else {
                                        value = 0;
                                        stackHeightArray[i][j] = (ratio * Math.abs(value));
                                        firstMixNegativeMin = true;
                                    }
                                } else {

                                }
                            }
                        }
                    }
                } else { //when axis - and base -
                    if (pos == true) {
                        if (j == innerlength - 1) {
                            if (min < 0) {
                                if (this.total <= max) {
                                    if (this.total >= min) {
                                        value = this.total - this.m_yAxisData[i][j];
                                        stackHeightArray[i][j] = (ratio * Math.abs(value));
                                    } else {

                                    }
                                } else {
                                    value = ((this.total - this.m_yAxisData[i][j]) > max) ? max : this.m_yAxisData[i][j] - ((this.total - this.m_yAxisData[i][j]) - this.m_yAxisData[i][j]);
                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                }
                            } else {
                                if (this.total <= max) {
                                    if (this.total > min) {
                                        value = this.m_yAxisData[i][j];
                                        firstMixPositiveMax = true;
                                        stackHeightArray[i][j] = (ratio * Math.abs(value));
                                    } else {

                                    }
                                } else {
                                    if (this.total > min) {
                                        value = (IsBoolean(firstMixPositiveMax)) ? ((this.total - this.m_yAxisData[i][j]) - min) : (max - min);
                                        firstMixPositiveMax = false;
                                        stackHeightArray[i][j] = (ratio * Math.abs(value));
                                    } else {

                                    }
                                }
                            }
                        } else {
                            if (min < 0) {
                                if (this.total <= max) {
                                    if (this.total >= min) {
                                        value = this.m_yAxisData[i][j];
                                        firstMixPositiveMax = true;
                                        stackHeightArray[i][j] = (ratio * Math.abs(value));
                                    } else {

                                    }
                                } else {
                                    value = (IsBoolean(firstMixPositiveMax)) ? this.m_yAxisData[i][j] - (this.total - max) : 0;
                                    firstMixPositiveMax = false;
                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                }
                            } else { //// positive
                                if (this.total <= max) {
                                    if (this.total > min) {
                                        value = ((1 * this.total) - (1 * min) >= this.m_yAxisData[i][j]) ? this.m_yAxisData[i][j] : ((1 * this.total) - (1 * min));
                                        firstMixPositiveMax = true;
                                        stackHeightArray[i][j] = (ratio * Math.abs(value));
                                    } else {

                                    }
                                } else {
                                    if (this.total > min) {
                                        value = (IsBoolean(firstMixPositiveMax)) ? this.m_yAxisData[i][j] - (this.total - max) : 0;
                                        firstMixPositiveMax = false;
                                        stackHeightArray[i][j] = (ratio * Math.abs(value));
                                    } else {

                                    }
                                }
                            }
                        }
                    } else if (neg == true) {
                        if (j == innerlength - 1) {
                            if (max >= 0) {
                                value = (!IsBoolean(firstMixNegativeMin)) ? (1 * min) : this.m_yAxisData[i][j];
                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                            } else {
                                value = (!IsBoolean(firstMixNegativeMin)) ? (min - max) : ((this.m_yAxisData[i][j]) - (1 * max));
                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                            }
                        } else {
                            if (max >= 0) {
                                if (this.total < min) {
                                    value = (!IsBoolean(firstMixNegativeMin)) ? 0 : (1 * this.m_yAxisData[i][j] - ((1 * this.total) - (1 * min)));
                                    firstMixNegativeMin = false;
                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                } else {
                                    value = this.m_yAxisData[i][j];
                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                    firstMixNegativeMin = true;
                                }
                            } else {
                                if (this.total > max) {
                                    value = (IsBoolean(firstNegativeBarFlag)) ? 0 : ((this.m_yAxisData[i][j]) - (1 * max));
                                    stackHeightArray[i][j] = (ratio * Math.abs(value));

                                } else {
                                    if (this.total < min) {
                                        value = (IsBoolean(firstMixNegativeMin)) ? this.m_yAxisData[i][j] - ((1 * this.total) - (1 * min)) : 0;
                                        firstMixNegativeMin = false;
                                        stackHeightArray[i][j] = (ratio * Math.abs(value));
                                    } else {
                                        value = (IsBoolean(firstNegativeBarFlag)) ? ((this.total) - (1 * max)) : this.m_yAxisData[i][j];
                                        firstNegativeBarFlag = false;
                                        firstMixNegativeMin = true;
                                        stackHeightArray[i][j] = (ratio * Math.abs(value));
                                    }
                                }
                            }
                        }
                    } else {
                        if (j == innerlength - 1) {
                            if (max > 0) {
                                if (min >= 0) { //max>0 min>0
                                    if (this.total - this.m_yAxisData[i][j] <= max) {
                                        if (this.total - this.m_yAxisData[i][j] >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                value = ((1 * this.total - 1 * this.m_yAxisData[i][j]) - (1 * min) >= this.m_yAxisData[i][j]) ? this.m_yAxisData[i][j] : ((1 * this.total - this.m_yAxisData[i][j]) - (1 * min));
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                            } else {
                                                if (!IsBoolean(negMixBar) && this.m_yAxisData[i][j] < 0) {
                                                    value = (1 * this.m_yAxisData[i][j]) + ((1 * this.total) - ((1 * max) + 1 * this.m_yAxisData[i][j]));
                                                    negMixBar = true;
                                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                                } else {
                                                    value = (!IsBoolean(firstMixNegative)) ? 0 : this.m_yAxisData[i][j];
                                                    firstMixNegative = true;
                                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                                }
                                            }
                                        } else {
                                            value = (this.total < min) ? 0 : ((1 * this.total) - (1 * min)) - 1 * this.m_yAxisData[i][j];
                                            stackHeightArray[i][j] = (ratio * Math.abs(value));
                                        }
                                    } else {
                                        if (this.m_yAxisData[i][j] > 0) {
                                            if ((max - min) < this.m_yAxisData[i][j]) {
                                                if (IsBoolean(mixLastBar)) {
                                                    value = (max - min);
                                                    mixFirstBar = true;
                                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                                    firstMixNegative = false;
                                                } else {
                                                    value = (!IsBoolean(mixFirstBar)) ? (max - min) : 0;
                                                    mixFirstBar = true;
                                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                                    firstMixNegative = false;
                                                }

                                            } else {
                                                value = ((((1 * this.total) - (1 * max)) - this.m_yAxisData[i][j]) < this.m_yAxisData[i][j]) ? (1 * this.m_yAxisData[i][j] - (1 * this.total - 1 * max)) : (((1 * this.total) - (1 * max)) - this.m_yAxisData[i][j]);
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                                negMixBar = false;
                                            }
                                        } else {
                                            value = 0;
                                            stackHeightArray[i][j] = (ratio * Math.abs(value));
                                        }
                                    }
                                } else {
                                    //max>0 min<0
                                    if (this.total <= max) {
                                        if (this.total >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                value = (IsBoolean(firstMixPositive)) ? (1 * min) - (1 * this.total) : this.m_yAxisData[i][j];
                                                firstMixPositive = false;
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                            } else {
                                                value = (IsBoolean(firstMixNegative)) ? (max - this.total) : this.m_yAxisData[i][j];
                                                firstMixNegative = false;
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                            }
                                        } else {
                                            if (this.m_yAxisData[i][j] > 0) {

                                            } else {
                                                value = (this.m_yAxisData[i][j] > min) ? this.m_yAxisData[i][j] : min; /*Math.abs(this.total)>Math.abs(min)?(1*this.m_yAxisData[i][j]) + (Math.abs(this.total)-Math.abs(min)):this.m_yAxisData[i][j]*/ ;
                                                value = Math.abs(value);
                                                if (value >= (max - min))
                                                    value = (max - min);
                                                firstMixPositive = true;
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                            }
                                        }
                                    } else {
                                        if (this.total >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                value = ((this.total - this.m_yAxisData[i][j]) > max) ? (1 * this.m_yAxisData[i][j]) - ((1 * this.total - 1 * this.m_yAxisData[i][j]) - (1 * max)) : this.m_yAxisData[i][j];
                                                /*value = ((this.total - max) < this.m_yAxisData[i][j])?(1*this.m_yAxisData[i][j]) - ((1*this.total) - (1*max)):0;*/
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                                firstMixNegative = true;
                                            } else {

                                            }
                                        } else {

                                        }
                                    }
                                }
                            } else {
                                if (min >= 0) {
                                    //max<0 min>0
                                } else {
                                    //max<0 min<0
                                    if (this.total - this.m_yAxisData[i][j] <= max) {
                                        if (this.total - this.m_yAxisData[i][j] >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                value = (IsBoolean(firstMixPositive)) ? (this.total - min) : this.m_yAxisData[i][j];
                                                firstMixPositive = false;
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                            } else {
                                                /*value = ((Math.abs(this.total) - Math.abs(max))>Math.abs(this.m_yAxisData[i][j]))?this.m_yAxisData[i][j]:(this.total - max);*/
                                                value = this.m_yAxisData[i][j] - max;
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                                firstMixNegative = true;
                                            }
                                        } else {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                value = this.m_yAxisData[i][j];
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                            } else {
                                                value = (max < this.m_yAxisData[i][j]) ? 0 : this.m_yAxisData[i][j] - max;
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                                firstMixPositive = true;
                                            }
                                        }
                                    } else {
                                        if (this.total >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                value = (IsBoolean(firstMixNegative)) ? (1 * this.m_yAxisData[i][j] + (1 * max - 1 * this.total)) : 0;
                                                firstMixNegative = false;
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                            } else {

                                            }
                                        } else {

                                        }
                                    }
                                }
                            }
                        } else {
                            if (max > 0) {
                                if (min >= 0) { //max>0 min>0
                                    if (this.total <= max) {
                                        if (this.total >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                value = ((1 * this.total) - (1 * min) >= this.m_yAxisData[i][j]) ? this.m_yAxisData[i][j] : ((1 * this.total) - (1 * min));
                                                mixFirstBar = true;
                                                firstMixNegativeMin = true;
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                            } else {
                                                if (!IsBoolean(negMixBar) && this.m_yAxisData[i][j] < 0) {
                                                    value = (1 * this.m_yAxisData[i][j]) + ((1 * this.total) - ((1 * max) + 1 * this.m_yAxisData[i][j]));
                                                    negMixBar = true;
                                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                                } else {
                                                    /*value = (firstMixNegative == false)?0:this.m_yAxisData[i][j];*/
                                                    value = (!IsBoolean(firstMixNegative)) ? (max - this.total) : this.m_yAxisData[i][j];
                                                    firstMixNegative = true;
                                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                                }
                                            }
                                        } else {
                                            if (IsBoolean(firstMixNegativeMin)) {
                                                value = 1 * this.m_yAxisData[i][j] + (1 * min - 1 * this.total);
                                                firstMixNegativeMin = false;
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                            } else {
                                                value = (this.total < min) ? 0 : ((1 * this.total) - (1 * min)) - 1 * this.m_yAxisData[i][j];
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                            }
                                        }
                                    } else {
                                        if (this.m_yAxisData[i][j] > 0) {
                                            if ((max - min) < this.m_yAxisData[i][j]) {
                                                value = (!IsBoolean(mixFirstBar)) ? (max - min) : 0;
                                                mixFirstBar = true;
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                                firstMixNegative = false;
                                            } else {
                                                if (IsBoolean(mixFirstBar)) {
                                                    value = this.m_yAxisData[i][j] - (this.total - max);
                                                    mixLastBar = true;
                                                    firstMixNegative = false;
                                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                                } else {
                                                    value = ((((1 * this.total) - (1 * max)) - this.m_yAxisData[i][j]) < this.m_yAxisData[i][j]) ? (1 * this.m_yAxisData[i][j] - (1 * this.total - 1 * max)) : (((1 * this.total) - (1 * max)) - this.m_yAxisData[i][j]);
                                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                                    negMixBar = false;
                                                }
                                            }
                                        } else {
                                            value = 0;
                                            stackHeightArray[i][j] = (ratio * Math.abs(value));
                                        }
                                    }
                                } else {
                                    //max>0 min<0
                                    if (this.total <= max) {
                                        if (this.total >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                value = (IsBoolean(firstMixPositive)) ? (1 * min) - (1 * this.total) : this.m_yAxisData[i][j];
                                                firstMixPositive = false;
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                            } else {
                                                value = (IsBoolean(firstMixNegative)) ? (max - this.total) : this.m_yAxisData[i][j];
                                                firstMixNegative = false;
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                            }
                                        } else {
                                            if (this.m_yAxisData[i][j] > 0) {

                                            } else {
                                                value = Math.abs(this.total) > Math.abs(min) ? (1 * this.m_yAxisData[i][j]) + (Math.abs(this.total) - Math.abs(min)) : this.m_yAxisData[i][j];
                                                value = Math.abs(value);
                                                if (value >= (max - min))
                                                    value = (max - min);
                                                firstMixPositive = true;
                                                firstMixPositiveMax = true;
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                            }
                                        }
                                    } else {
                                        if (this.total >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                if (IsBoolean(firstMixPositiveMax)) {
                                                    value = ((this.total - max) < this.m_yAxisData[i][j]) ? max - min : 0;
                                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                                    firstMixPositiveMax = false;
                                                } else {
                                                    value = ((this.total - max) < this.m_yAxisData[i][j]) ? (1 * this.m_yAxisData[i][j]) - ((1 * this.total) - (1 * max)) : 0;
                                                    stackHeightArray[i][j] = (ratio * Math.abs(value));
                                                    firstMixNegative = true;
                                                }
                                            } else {

                                            }
                                        } else {

                                        }
                                    }
                                }
                            } else {
                                if (min >= 0) {
                                    //max<0 min>0
                                } else {
                                    //max<0 min<0
                                    if (this.total <= max) {
                                        if (this.total >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                value = (IsBoolean(firstMixPositive)) ? (this.total - min) : this.m_yAxisData[i][j];
                                                firstMixPositive = false;
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                            } else {
                                                value = ((Math.abs(this.total) - Math.abs(max)) > Math.abs(this.m_yAxisData[i][j])) ? this.m_yAxisData[i][j] : (this.total - max);
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                                firstMixNegative = true;
                                            }
                                        } else {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                value = this.m_yAxisData[i][j];
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                            } else {
                                                value = (this.total < min) ? (this.m_yAxisData[i][j] - (this.total - min)) : this.m_yAxisData[i][j];
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                                firstMixPositive = true;
                                            }
                                        }
                                    } else {
                                        if (this.total >= min) {
                                            if (this.m_yAxisData[i][j] > 0) {
                                                value = (IsBoolean(firstMixNegative)) ? (1 * this.m_yAxisData[i][j] + (1 * max - 1 * this.total)) : 0;
                                                firstMixNegative = false;
                                                stackHeightArray[i][j] = (ratio * Math.abs(value));
                                            } else {

                                            }
                                        } else {

                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    this.m_stackHeightArray = stackHeightArray;
};

/** @description Getter for X Pixel Array**/
WaterfallCalculation.prototype.getxPixelArray = function() {
    return this.m_xPixelArray;
};

/** @description Getter for Y Pixel Array**/
WaterfallCalculation.prototype.getyPixelArray = function() {
    return this.m_ypixelArray;
};

/** @description Getter for Stack Height Array  **/
WaterfallCalculation.prototype.getstackHeightArray = function() {
    return this.m_stackHeightArray;
};

/** @description Getter for Y Axis Text**/
WaterfallCalculation.prototype.getYAxisText = function() {
    return this.m_chart.m_yAxisText;
};

/** @description Getter for Y Axis Marker Array**/
WaterfallCalculation.prototype.getYAxisMarkersArray = function() {
    return this.m_chart.m_yAxisMarkersArray;
};

/** @description Creation of Column Class and initializing global arrays**/
function WaterfallColumns() {
    this.m_xPixel = [];
    this.m_yPixelArray = [];
    this.m_stackHeightArray = [];
    this.m_stackColorArray = [];
    this.m_stackArray = [];
};

/** @description Columns class initialization with the values which are passed from ColumnStackChart Class**/
WaterfallColumns.prototype.init = function(xPixel, yPixelArray, stackWidth, stackHeightArray, stackPercentage, stackColorArray, strokeColor, showgradient, showPercentageFlag, percentvalueFlag, plotTrasparencyArray, chart) {
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
    for (var i = 0, length = this.m_yPixelArray.length; i < length; i++) {
        this.m_stackArray[i] = new Stack();
        this.m_stackArray[i].init(this.m_xPixel[i], this.m_yPixelArray[i], this.m_stackWidth, this.m_stackHeightArray[i], this.m_stackColorArray[i], this.m_strokeColor, this.m_showGradient, this.m_chart.ctx, this.m_chart.m_chartbase, this.m_stackPercentageArray[i], this.m_showPercentFlag, this.m_percentvalueFlag, this.m_plotTrasparencyArray, this.m_chart.visibleSeriesInfo.seriesData, this.m_chart);
    }
};
/** @description Calling draw stack method to the length of category**/
WaterfallColumns.prototype.drawColumns = function() {
    for (var i = 0, length = this.m_yPixelArray.length; i < length; i++) {
        if (!this.isInRange(i))
            this.m_stackArray[i].drawStack();
    }
};
/** @description Checking, is calculated X,Y pixel inside the draw width and Height .**/
WaterfallColumns.prototype.isInRange = function(i) {
    if (this.m_yPixelArray[i] >= this.m_chart.getStartY() && this.m_yPixelArray[i] <= this.m_chart.getEndY())
        return true;
    else
        return false;
};




/** @description Drawing of Chart Frame,Title,SubTitle,XAxis,YAxis,Legends and chart**/
WaterfallChart.prototype.drawChart = function() {
    this.drawChartFrame();
    this.drawTitle();
    this.drawSubTitle();
    this.drawLegends();
    var map = this.IsDrawingPossible();
    if (IsBoolean(map.permission)) {
        this.drawXAxis();
        this.drawYAxis();
        this.drawWaterfallChart();
    } else {
        this.drawMessage(map.message);
    }
};

/** @description drawing of Chart Frame**/
WaterfallChart.prototype.drawChartFrame = function() {
    this.m_chartFrame.drawFrame();
};

/** @description Drawing of Title**/
WaterfallChart.prototype.drawTitle = function() {
    this.m_title.draw();
};

/** @description Drawing of Subtitle**/
WaterfallChart.prototype.drawSubTitle = function() {
    this.m_subTitle.draw();
};

/** @description Drawing of XAxis line and XAxis markers**/
WaterfallChart.prototype.drawXAxis = function() {
    this.m_xAxis.drawTickMarks();
    this.m_xAxis.drawVerticalLine();
    this.m_xAxis.markXaxis();
    this.m_xAxis.drawXAxis();
};
/** @description Drawing of Y Axis line and Y Axis Markers**/
WaterfallChart.prototype.drawYAxis = function() {
    if (IsBoolean(this.m_showmarkerline))
        this.m_yAxis.horizontalMarkerLines();
    if (IsBoolean(this.m_zeromarkerline) && !IsBoolean(this.m_basezero) && IsBoolean(this.m_yAxis.hasNegativeAxisMarker(this.m_yAxisMarkersArray)))
		this.m_yAxis.zeroMarkerLine();
    this.m_yAxis.markYaxis();
    this.m_yAxis.drawYAxis();
};

/** @description drawing of waterfall Chart**/
WaterfallChart.prototype.drawWaterfallChart = function() {
    for (var i = 0, length = this.visibleSeriesInfo.seriesName.length; i < length; i++) {
        this.m_columnsArray[this.visibleSeriesInfo.seriesName[i]].drawColumns();
    }
};
//# sourceURL=WaterfallChart.js