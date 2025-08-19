/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: HistogramChart.js
 * @description HistogramChart
 **/
function HistogramChart(m_chartContainer, m_zIndex) {
    this.base = Chart;
    this.base();
    this.m_x = 400;
    this.m_y = 20;
    this.m_width = 50;
    this.m_height = 200;
    /** Array Creation for storing the calculated Values**/
    this.m_stackWidth = "";
    this.m_generatexml = "";
    this.m_seriesNames = [];
    this.m_categoryData = [];
    this.m_seriesData = [];
    this.m_ShowToolTipData = [];
    this.m_xPixelArray = [];
    this.m_yPixelArray = [];
    this.m_stackHeightArray = [];
    this.m_percentageArray = [];
    this.m_columnsArray = {};
    this.m_calculation = new HistogramColumnCalculation();
    this.m_seriesVisiblityPosition;
    this.m_showpercentvalue = false;
    this.m_showmarkingorpercentvalue = false;
    this.noOfRows = 1;
    this.m_chartContainer = m_chartContainer;
    this.m_zIndex = m_zIndex;
    this.m_valueTextSeries = {};
    /** Creating object of X Axis and Y Axis**/
    this.m_xAxis = new Xaxis();
    this.m_yAxis = new Yaxis();
    this.m_maxbarwidth = 1500;
    this.m_maximumrange = "";
    this.m_range = true;
    this.RangeFlag = true;
    this.m_aggregation = "";
    this.m_borderstrokecolor = "";
};

/** @description Making prototype of chart class to inherit its properties and methods into Histogram chart **/
HistogramChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
HistogramChart.prototype.setProperty = function(chartJson) {
    this.ParseJsonAttributes(chartJson.Object, this);
    this.initCanvas();
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
HistogramChart.prototype.ParseJsonAttributes = function(jsonObject, nodeObject) {
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
HistogramChart.prototype.getDataProvider = function() {
    return this.m_dataProvider;
};

/** @description Getter for category field names **/
HistogramChart.prototype.getCategoryNames = function() {
    return this.m_categoryNames;
};

/** @description Getter for category field Display Name **/
HistogramChart.prototype.getCategoryDisplayNames = function() {
    return this.m_categoryDisplayNames;
};

/** @description Setter for Start X **/
HistogramChart.prototype.setStartX = function() {
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
HistogramChart.prototype.getYAxisLabelMargin = function() {
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

/** @description Finding largest text with formatter and calculating width **/
HistogramChart.prototype.getLabelFormatterMargin = function() {
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

/** @description Getter for Y Axis Label width **/
HistogramChart.prototype.getLabelWidth = function() {
    return this.m_labelwidth;
};

/** @description Adding formatter in y Axis markers and calculating largest width of the marker and setting into global variable this.m_labelwidth**/
HistogramChart.prototype.setLabelWidth = function() {
    this.m_labelwidth = 0;
    var maxSeriesVals = [];
    if (this.fontScaling(this.m_yAxis.m_labelfontsize) > 0) {
    	for (var i = 0; i < this.m_yAxisMarkersArray.length; i++) {
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
                    if (maxSeriesVal !== 0) {
                    	  if(this.m_precision !== "default")
                        maxSeriesVal = this.m_yAxis.setPrecision(maxSeriesVal, this.m_precision);
                    }
                }
                maxSeriesVal = getFormattedNumberWithCommas(maxSeriesVal, this.m_numberformatter);
                this.ctx.beginPath();
                this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
                maxSeriesVals[i] = this.ctx.measureText(maxSeriesVal).width;
                this.ctx.closePath();
            }
        }
        this.m_labelwidth = getMaxValueFromArray(maxSeriesVals);
    }
};

/** @description Getter method Calculating Label Sign Margin and returning margin value**/
HistogramChart.prototype.getLabelSignMargin = function() {
    var lsm = 0;
    var msvw = 0;
    var minSeriesValue = this.min; // this.getMinimumSeriesValue();
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
HistogramChart.prototype.getLabelPrecisionMargin = function() {
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

/** @description Calculating second formatter margin**/
HistogramChart.prototype.getLabelSecondFormatterMargin = function() {
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

/** @description Calculating Formatter Margin**/
HistogramChart.prototype.getFormatterMargin = function() {
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

/** @description Setter for End X**/
HistogramChart.prototype.setEndX = function() {
    var blm = this.getBorderToLegendMargin();
    var vlm = this.getVerticalLegendMargin();
    var vlxm = this.getVerticalLegendToXAxisMargin();
    var rightSideMargin = blm * 1 + vlm * 1 + vlxm * 1;
    this.m_endX = (this.m_x * 1 + this.m_width * 1 - rightSideMargin * 1);
};

/** @description Setter for Start Y**/
HistogramChart.prototype.setStartY = function() {
    var cm = this.getChartMargin();
    var xlbm = this.getXAxisLabelMargin();
    var xdm = this.getXAxisDescriptionMargin();
    var bottomMargin = cm * 1 + xlbm * 1 + xdm * 1;
    this.m_startY = (this.m_y * 1 + this.m_height * 1 - bottomMargin * 1);
};

/** @description Calculating X Axis Label Margin, X Axis will contain the Category Values**/
HistogramChart.prototype.getXAxisLabelMargin = function() {
    var xAxislabelDescMargin = this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.8;
    var radians = this.m_xAxis.m_labelrotation * (Math.PI / 180); 
    if (IsBoolean(this.m_xAxis.getLabelTilted())) {
        this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
        //xAxislabelDescMargin = this.ctx.measureText(this.m_categoryData[0][0]).width;
        for (var i = 1, length = this.m_categoryData[0].length; i < length; i++) {
            if (xAxislabelDescMargin < Math.abs(this.ctx.measureText(this.m_categoryData[0][i]).width * radians))
                xAxislabelDescMargin = Math.abs(this.ctx.measureText(this.m_categoryData[0][i]).width * radians);
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
HistogramChart.prototype.setNoOfRows = function() {
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

/** @description Setter for End Y**/
HistogramChart.prototype.setEndY = function() {
	if(this.m_chartbase == "rectangle"){
		this.m_endY = (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1  + this.getSpaceForShowText() * 1);
	    var x = this.m_height - this.m_startY;
		this.m_endY = (this.m_height*1 <= 600)?this.m_endY + x/2 : this.m_endY + x + this.m_stackWidth/4;
	}else{
		this.m_endY = (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1 + this.getSpaceForShowText() * 1);
	}
};

/** @description Calculating text space for subtitle Text**/
HistogramChart.prototype.getSpaceForShowText = function() {
    if (((IsBoolean(this.getCounterFlagForSeriesVisiblity())) && IsBoolean(this.m_showmarkingorpercentvalue)) && (IsBoolean(this.m_subTitle.m_showsubtitle) || IsBoolean(this.getShowGradient())))
        return 15;
    else
        return 0;
};

/** @description Calculating Series Visibility and returning is any series is visible or not**/
HistogramChart.prototype.getCounterFlagForSeriesVisiblity = function() {
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

/** @description Getting field JSON , according to the field type categorize into 3 arrays**/
HistogramChart.prototype.setFields = function(fieldsJson) {
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
HistogramChart.prototype.setCategory = function(categoryJson) {
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
HistogramChart.prototype.setSeries = function(seriesJson) {
    this.m_seriesNames = [];
    this.m_seriesDisplayNames = [];
    this.m_seriesColors = [];
    this.m_legendNames = [];
    this.m_seriesVisibleArr = {};
    this.m_allSeriesDisplayNames = [];
    this.m_allSeriesNames = [];
    this.m_plotTrasparencyArray = [];
    this.m_seriesDataLabelProperty = [];
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

            this.m_aggregation = this.getProperAttributeNameValue(seriesJson[i], "Aggregation");
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

/** @description Getter for Legend info**/
HistogramChart.prototype.getLegendInfo = function() {
    return this.legendMap;
};

/** @description Getter for all series Names**/
HistogramChart.prototype.getAllSeriesNames = function() {
    return this.m_allSeriesNames;
};

/** @description Getter for visible series names**/
HistogramChart.prototype.getSeriesNames = function() {
    return this.m_seriesNames;
};

/** @description Getter for Series DisplayName**/
HistogramChart.prototype.getSeriesDisplayNames = function() {
    return this.m_seriesDisplayNames;
};

/** @description Getter for Series Color**/
HistogramChart.prototype.getSeriesColors = function() {
    return this.m_seriesColors;
};

/** @description Setter for Legend Names**/
HistogramChart.prototype.setLegendNames = function(m_legendNames) {
    this.m_legendNames = m_legendNames;
};

/** @description Getter for Legend Names**/
HistogramChart.prototype.getLegendNames = function() {
    return this.m_legendNames;
};

/** @description Setting all fields Name into single array**/
HistogramChart.prototype.setAllFieldsName = function() {
    this.m_allfieldsName = [];
    for (var i = 0, length = this.getCategoryNames().length; i < length; i++) {
        this.m_allfieldsName.push(this.getCategoryNames()[i]);
    }
    for (var j = 0, length = this.getAllSeriesNames().length; j < length; j++) {
        this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
    }
};

/** @description Getter for All Field Name**/
HistogramChart.prototype.getAllFieldsName = function() {
    return this.m_allfieldsName;
};

/** @description Setter for All field display Name into single array**/
HistogramChart.prototype.setAllFieldsDisplayName = function() {
    this.m_allfieldsDisplayName = [];
    for (var i = 0, length = this.getCategoryDisplayNames().length; i < length; i++) {
        this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
    }
    for (var j = 0, length = this.getSeriesDisplayNames().length; j < length; j++) {
        this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
    }
};

/** @description Getter for All Field Display Name**/
HistogramChart.prototype.getAllFieldsDisplayName = function() {
    return this.m_allfieldsDisplayName;
};

/** @description Setter for category Data**/
HistogramChart.prototype.setCategoryData = function() {
    this.m_categoryData = [];
    this.isEmptyCategory = true;
    if (this.getCategoryNames().length > 0) {
        this.isEmptyCategory = false;
        for (var i = 0, length = this.getCategoryNames().length; i < length; i++) {
            this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
        }
    }
};

/** @description Common method -> being used in child classes **/
HistogramChart.prototype.getDataFromJSON = function(fieldName) {
	var data = [];
	for (var i = 0; i < this.getDataProvider().length; i++) {
		if (this.getDataProvider()[i][fieldName] === undefined || this.getDataProvider()[i][fieldName] === "undefined")
			data[i] = "";
		else
			data[i] = 1*this.getDataProvider()[i][fieldName];
	}
	return data;
};

/** @description Getter for Category Data**/
HistogramChart.prototype.getCategoryData = function() {
    return this.m_categoryData;
};

/** @description Setter for Series Data**/
HistogramChart.prototype.setSeriesData = function() {
    this.m_seriesData = [];
    this.m_ShowToolTipData = [];
    for (var i = 0, length = this.getSeriesNames().length; i < length; i++) {
        this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
        this.tickCategory = this.drawBin(this.getCategoryNames()[0]);
        this.tickSeries = this.drawBin(this.getSeriesNames()[0]);
        this.allseriesData = this.updateSeriesData(this.m_seriesData, this.m_categoryData, this.tickCategory);
        this.arrayvalues = this.simpleSeriesData(this.allseriesData);
        this.simpleseriesData = this.getDataFromJSONseries(this.arrayvalues);
        this.m_ShowToolTipData[i] = this.simpleseriesData;
    }
};

/** @description Getter for Series Data**/
HistogramChart.prototype.getSeriesData = function() {
    return this.m_seriesData;
};

/** @description Getter for series tooltip data**/
HistogramChart.prototype.getSeriesToolTipData = function() {
    return this.m_ShowToolTipData;
};

/** @description Setter for series color**/
HistogramChart.prototype.setSeriesColor = function(m_seriesColor) {
    this.m_seriesColor = m_seriesColor;
};

/** @description Getter for Series color**/
HistogramChart.prototype.getSeriesColor = function() {
    return this.m_seriesColor;
};

/** @description Chart Data,Chart Frame,XAxis,YAxis initialization **/
HistogramChart.prototype.init = function() {
    this.setCategoryData();
    this.setSeriesData();
    this.setDrillData();
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
        this.setPercentageForHundred();
        this.initializeCalculation();
        this.m_xAxis.init(this, this.m_calculation);
        this.m_yAxis.init(this, this.m_calculation);
    }
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};

/**calculation for data to drill**/
HistogramChart.prototype.setDrillData = function() {
	var drillDataObject = {};
	this.m_drilldata = [];
	for(var i = 0; i < this.simpleseriesData.length; i++){
		drillDataObject = {};
		drillDataObject[this.getSeriesNames()[0]] = this.simpleseriesData[i];
		drillDataObject[this.getCategoryNames()[0]] = this.simpleseriesData[i];
		this.m_drilldata.push(drillDataObject);
	}
};

/**getter method of drill data**/
HistogramChart.prototype.getDrillData = function() {
	return this.m_drilldata;
};

HistogramChart.prototype.getVisibleSeriesData = function(yAxisData) {
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

/** @description Update Series Data With Comma Seperators**/
HistogramChart.prototype.updateSeriesDataWithCommaSeperators = function() {
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

/** @description Changing data order of array**/
HistogramChart.prototype.getUpdateSeriesDataWithCategory = function(arr) {
    var updateArray = [];
    for (var i = 0, length = arr[0].length; i < length; i++) {
        updateArray[i] = [];
        for (var j = 0, innerlength = arr.length; j < innerlength; j++) {
            updateArray[i][j] = arr[j][i];
        }
    }
    return updateArray;
};

/** @description In Hundred percent Chart ,each bar value is represented in % form, so it is calculating here**/
HistogramChart.prototype.setPercentageForHundred = function() {
    var serData = this.getUpdateSeriesDataWithCategory(this.visibleSeriesInfo.seriesData);
    this.m_SeriesDataInPerForHundredChart;
    var updateValue = [];
    for (var i = 0, length = serData.length; i < length; i++) {
        var totalSerData = this.getArraySUM(serData[i]);
        updateValue[i] = [];
        for (var j = 0, innerlength = serData[i].length; j < innerlength; j++) {
            if (serData[i][j] !== "" && (!isNaN(serData[i][j])))
                updateValue[i][j] = (serData[i][j] / totalSerData) * 100;
            else
                updateValue[i][j] = 0;
        }
    }
    if (updateValue.length > 0)
        this.m_SeriesDataInPerForHundredChart = this.getUpdateSeriesDataForHundredPercentageChart(updateValue);
};

/** @description Getter for percent data for hundred percent chart**/
HistogramChart.prototype.getUpdateSeriesDataForHundredPercentageChart = function(arr) {
    var updatArray = [];
    for (var i = 0, length = arr[0].length; i < length; i++) {
        updatArray[i] = [];
        for (var j = 0, innerlength = arr.length; j < innerlength; j++) {
            updatArray[i][j] = arr[j][i];
        }
    }

    for (var i = 0, length = this.visibleSeriesInfo.seriesData.length; i < length; i++) {
        for (var j = 0, innerlength = this.visibleSeriesInfo.seriesData[i].length; j < innerlength; j++) {
            if (!isNaN(this.visibleSeriesInfo.seriesData[i][j])) {
                if (this.visibleSeriesInfo.seriesData[i][j] * 1 < 0)
                    updatArray[i][j] = updatArray[i][j] * (-1);
            }
        }
    }
    return updatArray;
};

/** @description Calculating sum of array values**/
HistogramChart.prototype.getArraySUM = function(arr) {
    var sum = 0;
    for (var i = 0, length = arr.length; i < length; i++) {
        if (arr[i] < 0)
            arr[i] = arr[i] * (-1);
        if (!isNaN(arr[i]))
            sum = sum * 1 + arr[i] * 1;
    }
    return sum;
};

/** @description Getter for Hundred Percent chart percentage**/
HistogramChart.prototype.getPercentageForHundred = function() {
    return this.m_SeriesDataInPerForHundredChart;
};

/** @description Drawing of Chart Frame,Title,SubTitle,XAxis,YAxis,Legends and chart**/
HistogramChart.prototype.drawChart = function() {
    this.drawChartFrame();
    this.drawTitle();
    this.drawSubTitle();
    this.drawLegends();
    var map = this.IsDrawingPossible();
    var mapRange = this.IsRangePossible();
    if (IsBoolean(map.permission) && IsBoolean(this.RangeFlag)) {
        this.drawXAxis();
        this.drawYAxis();
        this.drawColumnChart();
        this.drawDataLabel();
    } else {
        if (!IsBoolean(this.RangeFlag)) {
            this.drawMessage(mapRange.message);
        } else
            this.drawMessage(map.message);
    }
};

/** @description Chart calculation initialization**/
HistogramChart.prototype.initializeCalculation = function() {
    var finalseriesData = [];
    var categoryData = this.updateCategoryData(this.m_categoryData);
    this.calculateMaxValue(this.simpleseriesData);
    this.calculateFinalMinMax();
    this.setChartDrawingArea();
    finalseriesData[0] = this.simpleseriesData;
    this.m_calculation.init(this, this.tickCategory, finalseriesData);
    this.m_xPixelArray = this.m_calculation.getxPixelArray();
    this.m_yPixelArray = this.m_calculation.getyPixelArray();
    this.m_stackWidth = this.m_calculation.getBarWidth();
    this.m_stackHeightArray = this.m_calculation.getstackHeightArray();

    if ((IsBoolean(this.getCounterFlagForSeriesVisiblity())) && IsBoolean(this.m_showmarkingorpercentvalue)) {
        this.m_percentageArray = IsBoolean(this.m_showpercentvalue) ? (IsBoolean(this.getCheckedAllPosContainigZero()) ? (this.getPercentage()) : (this.getRoundValue(this.getPercentage(), 100))) : (this.getPercentage());
        this.m_showPerCentageFlag = true;
    }
    this.setColorsForSeries();
    this.initializeColumns();
};
HistogramChart.prototype.simpleSeriesData = function(simple) {
    var simpleData = [];
    var k = 0;
    for (var i = 0; i < simple.length; i++) {
        for (var j = 0; j < simple[i].length; j++)
            simpleData[k++] = simple[i][j];
    }
    return simpleData;
};
HistogramChart.prototype.updateSeriesData = function(seriesData, categoryData, tickCategory) {
    var sdata = [];
    var min = 0;
    for (var i = 0; i < seriesData[0].length; i++) {
        if (1 * seriesData[0][i] < 1 * min)
            min = seriesData[0][i];
    }
    for (var i = 0; i < tickCategory.length - 1; i++) {
        var freq = [];
        var k = 0;
        for (var j = 0; j < categoryData[0].length; j++) {
            if ((seriesData[0][j] > tickCategory[i] || (seriesData[0][j] == tickCategory[i] && seriesData[0][j] == min)) && seriesData[0][j] <= tickCategory[i + 1]) {
                freq[k++] = seriesData[0][j];
            }
        }
        sdata[i] = freq;
    }
    return sdata;
};

/** @description Calculating Max Value from the series data on the basis of selected chart type in Column chart**/
HistogramChart.prototype.calculateMaxValue = function(seriesData) {
    this.m_chartType = this.getChartType();
    var max = 0;
    var min = 0;
    var yAxisData = this.visibleSeriesInfo.seriesData;
    this.calculateMax = 0;
    this.calculateMin = 0;
    for (var i = 0; i < seriesData.length; i++) {
        if (1 * seriesData[i] > 1 * max)
            max = seriesData[i];
    }
    for (var i = 0; i < seriesData.length; i++) {
        if (1 * seriesData[i] < 1 * min)
            min = seriesData[i];
    }
    this.calculateMin = min;
    this.calculateMax = max;
};

/** @Description used calculated  Min/Max value and get required ScaleInfo of The Axis **/
HistogramChart.prototype.calculateFinalMinMax = function() {
    var calculatedMin = this.calculateMin;
    var calculatedMax = this.calculateMax;

    var obj = this.getCalculateNiceScale(calculatedMin, calculatedMax, this.m_basezero, this.m_autoaxissetup, this.m_minimumaxisvalue, this.m_maximumaxisvalue, (this.m_height));
    this.min = obj.min;
    this.max = obj.max;
    this.yAxisNoOfMarker = obj.markerArray.length;
    this.yAxisText = obj.step;
    this.m_yAxisMarkersArray = obj.markerArray;
};




/** @description Checking, is all series data value contains zero**/
HistogramChart.prototype.getCheckedAllPosContainigZero = function() {
    var flag = true;
    for (var i = 0, length = this.m_seriesData[this.m_seriesVisiblityPosition].length; i < length; i++) {
        if (this.m_seriesData[this.m_seriesVisiblityPosition][i] != 0)
            flag = false;
    }
    return flag;
};

/** @description Calculating percentage of data**/
HistogramChart.prototype.getPercentage = function() {
    var per = [];
    var sumOfSeries = this.getSumOfSeriesData();
    for (var i = 0, length = this.m_seriesData[this.m_seriesVisiblityPosition].length; i < length; i++) {
        if (IsBoolean(this.m_showpercentvalue))
            per[i] = (this.m_seriesData[this.m_seriesVisiblityPosition][i] == 0) ? 0 : ((this.m_seriesData[this.m_seriesVisiblityPosition][i] / sumOfSeries) * 100);
        else
            per[i] = this.m_seriesData[this.m_seriesVisiblityPosition][i];
    }
    return per;
};

/** @description Calculating all series data summation**/
HistogramChart.prototype.getSumOfSeriesData = function() {
    var sum = 0;
    for (var i = 0, length = this.m_seriesData[this.m_seriesVisiblityPosition].length; i < length; i++) {
        sum = sum * 1 + this.m_seriesData[this.m_seriesVisiblityPosition][i] * 1;
    }
    return sum;
};

/** @description Creating object of Columns class and initializing the values**/
HistogramChart.prototype.initializeColumns = function() {
    for (var i = 0, length = this.visibleSeriesInfo.seriesName.length; i < length; i++) {
        this.m_columnsArray[this.visibleSeriesInfo.seriesName[i]] = new ColumnsHistrogram();
        this.m_columnsArray[this.visibleSeriesInfo.seriesName[i]].init(this.m_xPixelArray[i], this.m_yPixelArray[i], this.m_stackWidth, this.m_stackHeightArray[i], this.m_percentageArray, this.getColorsForSeries()[i], this.m_strokecolor, this.m_showgradient, this.m_showPerCentageFlag, this.m_showpercentvalue, this.m_plotTrasparencyArray[i], this);
        if (IsBoolean(this.m_seriesDataLabelProperty[i].showDataLabel)) {
            this.m_valueTextSeries[this.visibleSeriesInfo.seriesName[i]] = new ValueTextSeries();
            this.m_valueTextSeries[this.visibleSeriesInfo.seriesName[i]].init(this.m_xPixelArray[i], this.m_yPixelArray[i], this, this.simpleseriesData, this.m_seriesDataLabelProperty[i],this.simpleseriesData, this.m_stackWidth, this.m_stackHeightArray[i],"column");
        };
    }
};
/** @description Getter for series color which will be used for column**/
HistogramChart.prototype.getSeriesColorforColumn = function(pos) {
    var sercolor = this.getSeriesColors();
    var temparr = [];
    for (var i = 0, length = this.m_seriesData[pos].length; i < length; i++) {
        temparr.push(sercolor[pos]);
    }
    return temparr;
};

/** @description Getter for All Series color**/
HistogramChart.prototype.getColorsForSeries = function() {
    return this.m_seriesColorsArray;
};

/** @description Creating this.m_seriesColorsArray and storing color according to the selected chart type**/
HistogramChart.prototype.setColorsForSeries = function() {
    this.m_seriesColorsArray = [];
    if (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) {
        for (var i = 0, length = this.visibleSeriesInfo.seriesData.length; i < length; i++) {
            this.m_seriesColorsArray[i] = [];
            for (var j = 0, innerlength = this.visibleSeriesInfo.seriesData[i].length; j < innerlength; j++) {
                this.m_seriesColorsArray[i][j] = this.m_drillColor;
            }
        }
    } else if ((this.m_charttype == "overlaid" || this.m_charttype == "Overlaid")) {
        this.m_seriesColorsArray = this.m_calculation.getSeriesColorForOverlaid();
    } else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && this.getCategoryColors().getCategoryColor().length > 0 && IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName())) {
        var categoryColors = this.getCategoryColors().getCategoryColorsForCategoryNames(this.getCategoryData()[0], this.m_categoryFieldColor);
        for (var i = 0, length = this.visibleSeriesInfo.seriesData.length; i < length; i++) {
            this.m_seriesColorsArray[i] = [];
            for (var j = 0, innerlength = this.visibleSeriesInfo.seriesData[i].length; j < innerlength; j++) {
                this.m_seriesColorsArray[i][j] = categoryColors[j];
            }
        }
    } else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && (!IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName()) || this.getCategoryColors().getCategoryColor().length == 0) && this.getConditionalColors() != "" && this.getConditionalColors() != undefined && this.getConditionalColors().getConditionalColor().length > 0) {
        var conditionalColors = this.getConditionalColors().getConditionalColorsForConditions(this.visibleSeriesInfo.seriesName, this.visibleSeriesInfo.seriesColor, this.visibleSeriesInfo.seriesData, this);
        for (var i = 0, length = this.visibleSeriesInfo.seriesData.length; i < length; i++) {
            this.m_seriesColorsArray[i] = [];
            for (var j = 0; j < this.visibleSeriesInfo.seriesData[i].length; j++) {
                this.m_seriesColorsArray[i][j] = conditionalColors[i][j];
            }
        }
    } else {
        var seriesColors = this.visibleSeriesInfo.seriesColor;
        var seriesColorsBin = this.tickCategory;
        for (var i = 0; i < this.visibleSeriesInfo.seriesData.length; i++) {
            this.m_seriesColorsArray[i] = [];
            for (var j = 0, innerlength = seriesColorsBin.length; j < innerlength; j++) {
                this.m_seriesColorsArray[i][j] = seriesColors[i];
            }
        }
    }
};

/** @description Category data array transformation**/
HistogramChart.prototype.updateCategoryData = function(array) {
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

/** @description Canvas Initialization**/
HistogramChart.prototype.initCanvas = function() {
    var temp = this;
    $("#draggableDiv" + temp.m_objectid).remove();
    this.initializeDraggableDivAndCanvas();
};

/** @description Initialization of Draggable Div and Canvas**/
HistogramChart.prototype.initializeDraggableDivAndCanvas = function() {
    this.setDashboardNameAndObjectId();
    this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
    this.createDraggableCanvas(this.m_draggableDiv);
    this.setCanvasContext();
    this.initMouseMoveEvent(this.m_chartContainer);
    this.initMouseClickEvent();
};

/** @description Drawing of Title**/
HistogramChart.prototype.drawTitle = function() {
    this.m_title.draw();
};

/** @description Drawing of Subtitle**/
HistogramChart.prototype.drawSubTitle = function() {
    this.m_subTitle.draw();
};

/** @description Drawing of XAxis line and XAxis markers**/
HistogramChart.prototype.drawXAxis = function() {
    this.drawTickMarks();
    this.drawVerticalLine();
    this.markXaxis();
    this.m_xAxis.drawXAxis();
};
HistogramChart.prototype.getXaxisDivison = function() {
	var data = [];
    if (!IsBoolean(this.m_range)) {
        return ((1 * this.m_endX - 1 * this.m_startX) / (1 * ((this.tickCategory).length - 1)));

    } else {
        data = this.simpleseriesData;
        var length = data.length;
        var formattedLength = data.length;
        for (var l = length - 1; l > 0; l--) {
            if (data[l] == 0) {
                formattedLength--;
            } else {
                break;
            }
        }
        return ((1 * this.m_endX - 1 * this.m_startX) / (1 * formattedLength));
    }
};
HistogramChart.prototype.drawTickMarks = function() {
    if (!IsBoolean(this.m_range)) {
        var tickData = [];
        tickData = this.tickCategory;
        if (IsBoolean(this.m_xAxis.m_tickmarks)) {
            var tickMarkerHeight = 8;
            for (var i = 0; i < tickData.length; i++) {
                var lineWidth = 0.5;
                var antiAliasing = 0.5;
                var strokeColor = this.m_xAxis.m_categorymarkingcolor; // modification NikhilVerma
                var x1 = this.m_startX * 1 + ((1 * this.getXaxisDivison()) * i);
                var y1 = this.m_startY * 1;
                var x2 = this.m_startX * 1 + ((1 * this.getXaxisDivison()) * i);
                var y2 = this.m_startY * 1 + tickMarkerHeight * 1;
                this.m_xAxis.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
            }
        }
    } else {
        var data = [];
        data = this.simpleseriesData;
        var length = data.length;
        var formattedLength = data.length;
        for (var l = length - 1; l > 0; l--) {
            if (data[l] == 0) {
                formattedLength--;
            } else {
                break;
            }
        }
        if (IsBoolean(this.m_xAxis.m_tickmarks)) {
            var tickMarkerHeight = 8;
            for (var i = 0; i <= formattedLength; i++) {
                var lineWidth = 0.5;
                var antiAliasing = 0.5;
                var strokeColor = this.m_xAxis.m_categorymarkingcolor; // modification NikhilVerma
                var x1 = this.m_startX * 1 + ((1 * this.getXaxisDivison()) * i);
                var y1 = this.m_startY * 1;
                var x2 = this.m_startX * 1 + ((1 * this.getXaxisDivison()) * i);
                var y2 = this.m_startY * 1 + tickMarkerHeight * 1;
                this.m_xAxis.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
            }
        }
    }
};
HistogramChart.prototype.drawVerticalLine = function() {
    var tickData = [];
    var data = [];
    tickData = this.tickSeries;
    data = this.simpleseriesData;
    var length = data.length;
    var formattedLength = data.length;
    for (var l = length - 1; l > 0; l--) {
        if (data[l] == 0) {
            formattedLength--;
        } else {
            break;
        }
    }
    if (IsBoolean(this.m_showverticalmarkerline)) {
        for (var i = 0; i < ((!IsBoolean(this.m_range)) ? tickData.length : formattedLength); i++) {
            var lineWidth = 0.5;
            var antiAliasing = 0.5;
            var strokeColor = hex2rgb(this.m_markercolor, this.m_markertransparency);
            var x1 = this.m_startX * 1 + ((1 * this.getXaxisDivison()) * i);
            var y1 = this.m_startY * 1;
            var x2 = this.m_startX * 1 + ((1 * this.getXaxisDivison()) * i);
            var y2 = this.m_endY * 1;
            this.m_xAxis.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
        }
    }
};
HistogramChart.prototype.markXaxis = function() {
    this.drawAxisLabels();
    /*if (this.m_xAxis.getDescription() != "") {
        this.m_xAxis.drawDescription();
    }*/
    this.m_xAxis.drawDescription();
};
HistogramChart.prototype.drawAxisLabels = function() {
	var bin = [];
	var data = [];
    if (!IsBoolean(this.m_range)) {
        bin = this.tickCategory;
        for (var i = 0; i < bin.length; i++) {
            this.ctx.beginPath();
            this.ctx.save();
            this.drawLabel(bin[i], i, this.getSeriesNames()[0]);
            this.ctx.restore();
            this.ctx.closePath();
        }
    } else {
        bin = this.tickCategory;
        data = this.simpleseriesData;
        var length = data.length;
        var formattedLength = data.length;
        for (var l = length - 1; l > 0; l--) {
            if (data[l] == 0) {
                formattedLength--;
            } else {
                break;
            }
        }
        for (var i = 0; i <= formattedLength; i++) {
            this.ctx.beginPath();
            this.ctx.save();
            this.drawLabel(bin[i], i, this.getSeriesNames()[0]);
            this.ctx.restore();
            this.ctx.closePath();
        }
    }
};
/** @description Drawing of Y Axis line and Y Axis Markers**/
HistogramChart.prototype.drawYAxis = function() {
    if (IsBoolean(this.m_showmarkerline))
        this.m_yAxis.horizontalMarkerLines();
    if (IsBoolean(this.m_zeromarkerline) && !IsBoolean(this.m_basezero) && IsBoolean(this.m_yAxis.hasNegativeAxisMarker(this.m_yAxisMarkersArray)))
		this.m_yAxis.zeroMarkerLine();
    this.m_yAxis.markYaxis();
    this.m_yAxis.drawYAxis();
};

/** @description drawing of Chart Frame**/
HistogramChart.prototype.drawChartFrame = function() {
    this.m_chartFrame.drawFrame();
};
/** @description drawing of column Chart**/
HistogramChart.prototype.drawColumnChart = function() {
    for (var i = 0, length = this.visibleSeriesInfo.seriesName.length; i < length; i++) {
        this.m_columnsArray[this.visibleSeriesInfo.seriesName[i]].drawColumns();
    }
};
/** @description drawing Data Label for Histogram **/
HistogramChart.prototype.drawDataLabel = function() {
    for (var i = 0, length = this.visibleSeriesInfo.seriesName.length; i < length; i++) {
    	if (IsBoolean(this.m_seriesDataLabelProperty[i].showDataLabel)) {
        this.m_valueTextSeries[this.visibleSeriesInfo.seriesName[i]].drawValueTextSeries();
    	}
    }
};
/** @description Putting All Bar X Position into one Array **/
HistogramChart.prototype.getXPositionforToolTip = function() {
    var xPosArray = [];
    var xPosDataArray = this.m_calculation.getxPixelArray();
    for (var n = 0, length = xPosDataArray[0].length; n < length; n++) {
        xPosArray.push(xPosDataArray[0][n]);
    }
    return xPosArray;
};

/** @description Calculating TooltTip Data according to selected chart type and return hover bar details **/
HistogramChart.prototype.getToolTipData = function(mouseX, mouseY) {
    var toolTipData;
    if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory) && IsBoolean(this.isVisibleSeries()) && IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")) {
        var newVal = "";
        var isNaNValue;
        this.xPositions = this.getXPositionforToolTip();
        var seriesData = this.getSeriesToolTipData(); //this.getVisibleSeriesData(this.getSeriesToolTipData()).seriesData;
        var totalColumnWidth = this.m_calculation.getBarWidth() * this.m_xPixelArray.length;
        var bin = [];
        bin = this.tickCategory;
        if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
            for (var i = 0, length = this.xPositions.length; i < length; i++) {
                if (mouseX <= (this.xPositions[i] * 1 + totalColumnWidth * 1) && (mouseX >= this.xPositions[i] * 1)) {
                    toolTipData = {};
                    toolTipData.cat = "";
                    toolTipData["data"] = new Array();
                    for (var j = 0, k = 0, innerlength = seriesData.length - (seriesData.length - 1); j < innerlength; j++) {
                        isNaNValue = false;
                        var data = [];
                        toolTipData.cat = "Range: (" + bin[i] + ") - (" + bin[i + 1] + ")";
                        data[0] = {
                            "color": this.visibleSeriesInfo.seriesColor[j],
                            "shape": this.legendMap[this.getSeriesNames()[j]].shape
                        };
                        data[1] = this.visibleSeriesInfo.seriesDisplayName[j];
                        if ((seriesData[j][i] == "" || isNaN(seriesData[j][i]) || seriesData[j][i] == null || seriesData[j][i] == "null")) {
                            newVal = seriesData[j][i];
                            isNaNValue = true;
                        } else {
                            var num = seriesData[j][i] * 1;
                            if (num % 1 != 0 && this.m_tooltipprecision !== "default") {
                                newVal = num.toFixed(this.m_tooltipprecision);
                            } else {
                                newVal = seriesData[j][i];
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
                }
            }
        } else {
            this.hideToolTip();
        }
        return toolTipData;
    }
};

/** @description Getting Drill Bar Color**/
HistogramChart.prototype.getDrillColor = function(mouseX, mouseY) {
    if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory)))) {
        for (var k = 0, length = this.m_xPixelArray.length; k < length; k++) {
            for (var i = 0, innerlength = this.m_xPixelArray[k].length; i < innerlength; i++) {
                if (mouseX <= (this.m_xPixelArray[k][i] * 1 + this.m_calculation.getBarWidth() * 1) && mouseX >= this.m_xPixelArray[k][i] * 1) {
                    if (this.m_charttype != "overlaid") {
                        for (var j = 0, subInnerlength = this.m_yPixelArray.length; j < subInnerlength; j++) {
                            if (mouseY <= this.getStartY() && mouseY >= Math.ceil(this.m_yPixelArray[j][i] * 1)) {
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
HistogramChart.prototype.getDrillDataPoints = function(mouseX, mouseY) {
    if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory))) && IsBoolean(this.isVisibleSeries())) {
        for (var k = 0, length = this.m_xPixelArray.length; k < length; k++) {
            for (var i = 0, innerlength = this.m_xPixelArray[k].length; i < innerlength; i++) {
                if (mouseX <= (this.m_xPixelArray[k][i] * 1 + this.m_calculation.getBarWidth() * 1) && mouseX >= this.m_xPixelArray[k][i] * 1) {
                    if (this.m_charttype != "overlaid") {
                        for (var j = 0, sunInnerlength = this.m_yPixelArray.length; j < sunInnerlength; j++) {
                            if (mouseY <= this.getStartY() && mouseY >= Math.ceil(this.m_yPixelArray[j][i] * 1)) {
                                var fieldNameValueMap = this.getFieldNameValueMap(i);
                                var drillColor = this.visibleSeriesInfo.seriesColor[k];
                                var drillField = this.visibleSeriesInfo.seriesName[k];
                                var drillDisplayField = this.visibleSeriesInfo.seriesDisplayName[k];
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
                    } else {
                        for (var j = this.m_yPixelArray.length - 1; j >= 0; j--) {
                            if (mouseY <= this.getStartY() && mouseY >= Math.ceil(this.m_yPixelArray[j][i] * 1)) {
                                var fieldNameValueMap = this.getFieldNameValueMap(i);
                                var drillColor = this.getSeriesColors()[this.m_calculation.m_originalindexforoverlaiddata[2][j][i]];
                                var drillField = this.getSeriesNames()[this.m_calculation.m_originalindexforoverlaiddata[2][j][i]];
                                var drillValue = fieldNameValueMap[drillField];
                                var drillValue = fieldNameValueMap[drillField];
                                fieldNameValueMap.drillField = drillField;
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
    }
};
HistogramChart.prototype.getFieldNameValueMap = function(i) {
	var m_fieldNameValueMap = new Object();
	var afn = this.getAllFieldsName();
	for (var l = 0; l < afn.length; l++) {
		m_fieldNameValueMap[afn[l]] = this.getDrillData()[i][afn[l]];
	}
	return m_fieldNameValueMap;
};

/** @description Creating HistogramColumnCalculation Class and assigning default values to the variables and creating arrays which will be used in calculation **/
function HistogramColumnCalculation() {
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
    this.m_maxbarwidth = 40;
};

/** @description Column Calculation initialization**/
HistogramColumnCalculation.prototype.init = function(m_chart, m_categoryData, m_seriesData) {
    this.m_chart = m_chart;
    this.m_xAxisData = m_categoryData;
    this.m_yAxisData = m_seriesData;
    this.m_maxbarwidth = this.m_chart.m_maxbarwidth * (1 + (this.m_yAxisData.length - 1) * 0.5);
    this.m_startX = this.m_chart.getStartX();
    this.m_startY = this.m_chart.getStartY();
    this.m_endX = this.m_chart.getEndX();
    this.m_endY = this.m_chart.getEndY();

    this.m_chartType = this.m_chart.getChartType();
    this.setDrawHeight();
    this.setDrawWidth();
    this.m_columnGap = 0;

    this.calculateBarWidth();
    this.setRatio();
    this.setxPixelArray();
    this.setstackHeightArray();
    this.setyPixelArray();
};

/** @description Getter for Max Value**/
HistogramColumnCalculation.prototype.getMaxValue = function() {
    return this.m_chart.max;
};

/** @description Getter for Min Value**/
HistogramColumnCalculation.prototype.minValue = function() {
    return this.m_chart.min;
};

/** @description Getter for Y Axis Text**/
HistogramColumnCalculation.prototype.getYAxisText = function() {
    return this.m_chart.m_yAxisText;
};

/** @description Getter for Calculating Percentile of the value**/
HistogramColumnCalculation.prototype.getPercentile = function(value) {
    var percentileValue = value % 10;
    if (percentileValue !== 10) {
        percentileValue = 10 - percentileValue;
    }
    return percentileValue;
};

/** @description Getter for Y Axis Marker Array**/
HistogramColumnCalculation.prototype.getYAxisMarkersArray = function() {
    return this.m_chart.m_yAxisMarkersArray;
};

/** @description Getter for DrawHeight**/
HistogramColumnCalculation.prototype.getDrawHeight = function() {
    return this.drawHeight;
};

/** @description Setter for Draw Height**/
HistogramColumnCalculation.prototype.setDrawHeight = function() {

    this.drawHeight = (this.m_startY - this.m_endY);
};

/** @description Getter for Draw Width**/
HistogramColumnCalculation.prototype.getDrawWidth = function() {
    return this.drawWidth;
};

/** @description Setter for draw Width**/
HistogramColumnCalculation.prototype.setDrawWidth = function() {
    this.drawWidth = 1 * (this.m_endX) - 1 * (this.m_startX);
};

/** @description Getter for Ratio**/
HistogramColumnCalculation.prototype.getRatio = function() {
    return this.ratio;
};

/** @description Setter for Ratio**/
HistogramColumnCalculation.prototype.setRatio = function() {
    var diff = this.getMaxValue() - this.minValue();
    if (diff > 0)
        this.ratio = this.getDrawHeight() / (diff);
    else
        this.ratio = 1;
};

/** @description Calculating Bar Width according to the given data**/
HistogramColumnCalculation.prototype.calculateBarWidth = function() {
	var data = [];
    if (!IsBoolean(this.m_chart.m_range)) {
        var numberOfColumns = (this.m_chart.tickCategory).length - 1;
        var totalGap = (1 * (numberOfColumns)) * this.m_columnGap;
        var availableDrawWidth = (this.getDrawWidth() * 1 - totalGap * 1);
        var barWidth = (availableDrawWidth / numberOfColumns);
        if (barWidth > this.m_maxbarwidth) {
            this.setBarWidth(this.m_maxbarwidth);
            this.setColumnGap(this.m_maxbarwidth);
        } else if (barWidth < 9) {
            this.setBarWidth(9);
            this.setColumnGap(9);
        } else {
            this.setBarWidth(barWidth);
        }
    } else {
        data = this.m_chart.simpleseriesData;
        var length = data.length;
        var formattedLength = data.length;
        for (var l = length - 1; l > 0; l--) {
            if (data[l] == 0) {
                formattedLength--;
            } else {
                break;
            }
        }
        var numberOfColumns = formattedLength;
        var totalGap = (1 * (numberOfColumns)) * this.m_columnGap;
        var availableDrawWidth = (this.getDrawWidth() * 1 - totalGap * 1);
        var barWidth = (availableDrawWidth / numberOfColumns);
        if (barWidth > this.m_maxbarwidth) {
            this.setBarWidth(this.m_maxbarwidth);
            this.setColumnGap(this.m_maxbarwidth);
        } else if (barWidth < 9) {
            this.setBarWidth(9);
            this.setColumnGap(9);
        } else {
            this.setBarWidth(barWidth);
        }
    }
};

/** @description Setter for Bar Width**/
HistogramColumnCalculation.prototype.setBarWidth = function(barwidth) {
    this.barWidth = barwidth;
    this.setBarWidthForClustered();
};

/** @description Calculating Column Gap**/
HistogramColumnCalculation.prototype.setColumnGap = function(barWidth) {
    var totalBarwidth = barWidth * this.m_xAxisData.length;
    var totalGap = this.getDrawWidth() - totalBarwidth;
    this.m_columnGap = totalGap / (this.m_xAxisData.length);
};

/** @description Calculating BarWidth for Clustered**/
HistogramColumnCalculation.prototype.setBarWidthForClustered = function() {
    this.barWidth /= this.m_yAxisData.length;
};

/** @description Getter for Bar Width**/
HistogramColumnCalculation.prototype.getBarWidth = function() {
    return this.barWidth;
};

/** @description Getter for Column Gap**/
HistogramColumnCalculation.prototype.getColumnGap = function() {
    return this.m_columnGap;
};

/** @description Getter for X Pixel Array**/
HistogramColumnCalculation.prototype.getxPixelArray = function() {
    return this.m_xPixelArray;
};

/** @description Setter for X Pixel Array**/
HistogramColumnCalculation.prototype.setxPixelArray = function() {
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

/** @description Transformation in the given Array**/
HistogramColumnCalculation.prototype.transformXPixelArray = function(m_xAxisPixelArray) {
    var xPixelsarr = [];
    for (var i1 = 0, length = this.m_yAxisData.length; i1 < length; i1++) {
        xPixelsarr[i1] = [];
        for (var j1 = 0, innerlength = this.m_yAxisData[0].length; j1 < innerlength; j1++) {
            xPixelsarr[i1][j1] = m_xAxisPixelArray[j1][i1];
        }
    }
    return xPixelsarr;
};

/** @description Getter for All Series color**/
HistogramColumnCalculation.prototype.getRatioForHundredPercent = function(index) {
    return this.m_hundredPercentsRatios[index] * 1;
};

/** @description Calculating Y Pixel Array  **/
HistogramColumnCalculation.prototype.setyPixelArray = function() {
    this.m_ypixelArray = this.getYPixelArrayForClustered();
};

/** @description Calculating Y Pixel Array For Clustered **/
HistogramColumnCalculation.prototype.getYPixelArrayForClustered = function() {
    var yparray = [];
    for (var i = 0, length = this.m_yAxisData.length; i < length; i++) {
        yparray[i] = [];
        for (var j = 0, innerlength = this.m_yAxisData[i].length; j < innerlength; j++) {
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

/** @description Setting Series Color for overlaid **/
HistogramColumnCalculation.prototype.setSeriesColorForOverlaid = function(seriesColor) {
    this.SeriesColorForOverlaid = seriesColor;
};

/** @description Getting Series Color for overlaid **/
HistogramColumnCalculation.prototype.getSeriesColorForOverlaid = function() {
    return this.SeriesColorForOverlaid;
};

/** @description Getter for Y Pixel Array when chart Type is Overlaid**/
HistogramColumnCalculation.prototype.getYPixelArrayForOverlaid = function() {
    var newYAxisData = this.arrangeDataForOverlaid();
    this.setSeriesColorForOverlaid(newYAxisData[1]);
    this.m_yAxisData = newYAxisData[0];
    var yparray = [];
    for (var i = 0, length = this.m_yAxisData.length; i < length; i++) {
        yparray[i] = [];
        for (var j = 0, innerlength = this.m_yAxisData[i].length; j < innerlength; j++) {
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

/** @description Calculating Series data along with color **/
HistogramColumnCalculation.prototype.arrangeDataForOverlaid = function() {
    this.m_originalindexforoverlaiddata = [];
    var seriesColor = this.m_chart.visibleSeriesInfo.seriesColor;
    var arrangeArray = [];
    var colorArray = [];
    var originalIndexArray = [];
    for (var i = 0, length = this.m_yAxisData[0].length; i < length; i++) {
        arrangeArray[i] = [];
        colorArray[i] = [];
        originalIndexArray[i] = [];
        for (var j = 0, innerlength = this.m_yAxisData.length; j < innerlength; j++) {
            arrangeArray[i][j] = (isNaN(this.m_yAxisData[j][i])) ? 0 : this.m_yAxisData[j][i] * 1;
            colorArray[i][j] = seriesColor[j];
            originalIndexArray[i][j] = j;
        }
    }
    var sortedData = this.sortingDataWithColor(arrangeArray, colorArray, originalIndexArray);
    var arrengeSeriesDataandColor = this.arrengeSeriesDataandColor(sortedData);
    this.m_originalindexforoverlaiddata = arrengeSeriesDataandColor;
    return arrengeSeriesDataandColor;
};

/** @description When Performing sort on data,data and color combination should not be change  **/
HistogramColumnCalculation.prototype.sortingDataWithColor = function(arrangeArray, colorArray, originalIndexArray) {
    var m_seriesDataAndColor = [];
    for (var i = 0, length = arrangeArray.length; i < length; i++) {
        m_seriesDataAndColor[i] = [];
        for (var j = 0, innerlength = arrangeArray[i].length; j < innerlength; j++) {
            m_seriesDataAndColor[i][j] = [];
            m_seriesDataAndColor[i][j][0] = arrangeArray[i][j] * 1;
            m_seriesDataAndColor[i][j][1] = colorArray[i][j];
            m_seriesDataAndColor[i][j][2] = originalIndexArray[i][j];
        }
    }

    for (var k = 0, length = m_seriesDataAndColor.length; k < length; k++) {
        m_seriesDataAndColor[k].sort(function(a, b) {
            return b[0] - a[0];
        });
    }

    /** only for manage negative value sorting(increasing order) if series have -ve value **/
    var negative = [];
    for (var m = 0, length = m_seriesDataAndColor.length; m < length; m++) {
        var count = 0;
        negative[m] = [];
        for (var n = 0, innerlength = m_seriesDataAndColor[m].length; n < innerlength; n++) {
            if (m_seriesDataAndColor[m][n][0] * 1 < 0)
                negative[m][count++] = ((m_seriesDataAndColor[m][n]));
        }

        negative[m].sort(function(a, b) {
            return a[0] - b[0];
        });

        var count1 = 0;
        for (var n = 0, len = m_seriesDataAndColor[m].length; n < len; n++) {
            if (m_seriesDataAndColor[m][n][0] * 1 < 0)
                m_seriesDataAndColor[m][n] = negative[m][count1++];
        }
    }
    return m_seriesDataAndColor;
};

/** @description Arranging Series data with color  **/
HistogramColumnCalculation.prototype.arrengeSeriesDataandColor = function(sortedData) {
    var seriesArr = [];
    var colorArr = [];
    var indexArr = [];
    for (var i = 0, length = sortedData.length; i < length; i++) {
        seriesArr[i] = [];
        colorArr[i] = [];
        indexArr[i] = [];
        for (var j = 0, innerlength = sortedData[i].length; j < innerlength; j++) {
            seriesArr[i][j] = sortedData[i][j][0];
            colorArr[i][j] = sortedData[i][j][1];
            indexArr[i][j] = sortedData[i][j][2];
        }
    }

    var finalSeriesData = [];
    var finalColor = [];
    var finalIndex = [];
    for (var k = 0, length = seriesArr[0].length; k < length; k++) {
        finalSeriesData[k] = [];
        finalColor[k] = [];
        finalIndex[k] = [];
        for (var l = 0, innerlength = seriesArr.length; l < innerlength; l++) {
            finalSeriesData[k][l] = seriesArr[l][k] * 1;
            finalColor[k][l] = colorArr[l][k];
            finalIndex[k][l] = indexArr[l][k];
        }
    }
    return [finalSeriesData, finalColor, finalIndex];
};

/** @description Getter for Y Pixel Array**/
HistogramColumnCalculation.prototype.getyPixelArray = function() {
    return this.m_ypixelArray;
};

HistogramColumnCalculation.prototype.calculationYpixcelForClusterTypeChart = function() {};

/** @description Getter for Stack Height Array  **/
HistogramColumnCalculation.prototype.getstackHeightArray = function() {
    return this.m_stackHeightArray;
};

/** @description Setting each bar height into this.m_stackHeightArray **/
HistogramColumnCalculation.prototype.setstackHeightArray = function() {
    var stackHeightArray = [];
    var value;
    var ratio = this.getRatio();
    var min = this.minValue();
    var max = this.getMaxValue();
    for (var i = 0, length = this.m_yAxisData.length; i < length; i++) {
        stackHeightArray[i] = [];
        for (var j = 0, innerlength = this.m_yAxisData[i].length; j < innerlength; j++) {
            stackHeightArray[i][j] = this.getRatio();
            if (min < 0) {
                value = (1*this.m_yAxisData[i][j]>max)?0:this.m_yAxisData[i][j];
                if(1*this.m_yAxisData[i][j]<0){value = 0;}
            } else {
                value = (1*this.m_yAxisData[i][j]>max)?0:(this.m_yAxisData[i][j] - min);
                if(1*this.m_yAxisData[i][j]<0){value = 0;}
            }

            if ((value * 1 < 0) && (!IsBoolean(this.m_chart.isAxisSetup())) && (this.m_chart.m_minimumaxisvalue * 1 > 0))
                value = 0;
            stackHeightArray[i][j] = (ratio * (value));
        }
    }
    this.m_stackHeightArray = stackHeightArray;
};

/** @description Calculating sum of array values **/
HistogramColumnCalculation.prototype.calculateSum = function(stacksDataArr) {
    var sum = 0;
    for (var i = 0, length = stacksDataArr.length; i < length; i++) {
        sum = (sum * 1) + (stacksDataArr[i] * 1);
    }
    return sum;
};

/** @description Creation of Column Class and initializing global arrays**/
function ColumnsHistrogram() {
    this.m_xPixel = [];
    this.m_yPixelArray = [];
    this.m_stackHeightArray = [];
    this.m_stackColorArray = [];
    this.m_stackArray = [];
};

/** @description Columns class initialization with the values which are passed from HistogramChart Class**/
ColumnsHistrogram.prototype.init = function(xPixel, yPixelArray, stackWidth, stackHeightArray, stackPercentage, stackColorArray, strokeColor, showgradient, showPercentageFlag, percentvalueFlag, plotTrasparencyArray, chart) {
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
        this.m_stackArray[i].init(this.m_xPixel[i], this.m_yPixelArray[i], this.m_stackWidth, this.m_stackHeightArray[i], this.m_stackColorArray[i], this.m_strokeColor, this.m_showGradient, this.m_chart.ctx, this.m_chart.m_chartbase, this.m_stackPercentageArray[i], this.m_showPercentFlag, this.m_percentvalueFlag, this.m_plotTrasparencyArray, this.m_chart.simpleseriesData[i], this.m_chart);
    }
};

/** @description Calling draw stack method to the lenght of category**/
ColumnsHistrogram.prototype.drawColumns = function() {
    for (var i = 0, length = this.m_yPixelArray.length; i < length; i++) {
        if (!this.isInRange(i))
            this.m_stackArray[i].drawStack();
    }
};

/** @description Checking, is calculated X,Y pixel inside the draw width and Height .**/
ColumnsHistrogram.prototype.isInRange = function(i) {
    if (this.m_yPixelArray[i] >= this.m_chart.getStartY() && this.m_yPixelArray[i] <= this.m_chart.getEndY())
        return true;
    else
        return false;
};

HistogramChart.prototype.translateTextPosition = function(m_axisLineToTextGap, i, text) {
    var labelRotation = this.m_xAxis.getLabelrotation();
    var axisToLabelMargin = this.m_xAxis.calculateAxisToLabelMargin(i);
    var y = this.m_startY * 1 + m_axisLineToTextGap / 2 + axisToLabelMargin * 1 + this.m_xAxis.calculateAxisLineToTextGap() / 2;
    var textWidth = this.m_xAxis.getLabelTextWidth(text);
    if (this.m_xAxis.m_xAxisData.length == 1) {
        var x = this.m_startX * 1 + (this.m_endX - this.m_startX) / 2;
    } else {
        var x = (this.m_startX) * 1 + (this.getXaxisDivison() * i);
    }
    this.m_xAxis.translateText(labelRotation, x, y, text, textWidth);
};

HistogramChart.prototype.drawLabel = function(text, i, fieldName) {
    var bin = [];
    bin = this.tickSeries;
    var m_axisLineToTextGap = 5;
    if (IsBoolean(this.m_xAxis.getLabelTilted())) {
        var dm = (this.m_xAxis.getDescription() != "") ? this.fontScaling(this.m_fontsize) : 5;
        var avlblheight = this.m_height / 4 - m_axisLineToTextGap / 2 - dm - this.m_xAxis.calculateAxisLineToTextGap() / 2;
        var rotation = this.m_xAxis.getLabelrotation();
        this.ctx.font = this.m_xAxis.getLabelFontProperties();
        if (this.ctx.measureText(text).width > avlblheight) {
            text = this.m_xAxis.getText("" + text, avlblheight, this.m_xAxis.getLabelFontProperties());
        }
    } else {
        var avlblheight = ((this.m_endX - this.m_startX) / this.getDataProvider().length) * 2;
        var rotation = 0;
        if (this.m_xAxis.m_chart.noOfRows == 2) {
            text = this.m_xAxis.getText("" + text, avlblheight, this.m_xAxis.getLabelFontProperties());
        }
    }
    this.translateTextPosition(m_axisLineToTextGap, i, text);
    this.ctx.rotate(rotation * Math.PI / 180);

    if (IsBoolean(this.m_xAxis.isLabelDecoration())) {
        this.m_xAxis.drawUnderLine(text, 0, this.fontScaling(this.m_xAxis.m_labelfontsize) / 2, this.m_xAxis.m_labelfontcolor, this.fontScaling(this.m_xAxis.getLabelFontSize()), this.m_xAxis.m_labeltextalign);
    }
    this.m_textUtil.drawText(this.ctx, text, 0, 0, this.m_xAxis.getLabelFontProperties(), this.m_xAxis.m_labeltextalign, this.m_xAxis.m_labelfontcolor);
};

HistogramChart.prototype.getDataFromJSONseries = function(fieldName) {
    var seriesData = [];
    var sdata = [];
    var fname = fieldName;
    sdata = this.tickCategory;
    var min = 0;
    for (var i = 0; i < sdata.length; i++) {
        if (1 * sdata[i] < 1 * min)
            min = sdata[i];
    }
    if (this.m_aggregation == "count") {
        for (var i = 0; i < sdata.length - 1; i++) {
            var frequency = 0;
            for (var j = 0; j < fname.length; j++) {
                if ((fname[j] > sdata[i] || (fname[j] == sdata[i] && fname[j] == min)) && fname[j] <= sdata[i + 1])
                    frequency++;
            }
            seriesData[i] = frequency;
        }
        return seriesData;
    } else if (this.m_aggregation == "average") {
        for (var i = 0; i < sdata.length - 1; i++) {
            var frequency = 0;
            var averageData = 0;
            for (var j = 0; j < fname.length; j++) {
                if ((fname[j] > sdata[i] || (fname[j] == sdata[i] && fname[j] == min)) && fname[j] <= sdata[i + 1]) {
                    frequency++;
                    averageData = (1 * averageData) + (1 * fname[j]);
                }
            }
            seriesData[i] = (frequency == 0) ? 0 : averageData / frequency;
        }
        return seriesData;
    } else if (this.m_aggregation == "min") {
        for (var i = 0; i < sdata.length - 1; i++) {
            var minData = [];
            for (var j = 0; j < fname.length; j++) {
                if ((fname[j] > sdata[i] || (fname[j] == sdata[i] && fname[j] == min)) && fname[j] <= sdata[i + 1]) {
                    minData[j] = fname[j];
                }
            }
            var sortedData = minData.sort(numOrdA);
            var min = (sortedData.length > 0) ? sortedData[0] : 0;
            seriesData[i] = min;
        }
        return seriesData;
    } else if (this.m_aggregation == "max") {
        for (var i = 0; i < sdata.length - 1; i++) {
            var maxData = [];
            for (var j = 0; j < fname.length; j++) {
                if ((fname[j] > sdata[i] || (fname[j] == sdata[i] && fname[j] == min)) && fname[j] <= sdata[i + 1]) {
                    maxData[j] = fname[j];
                }
            }
            var sortedData = maxData.sort(numOrdD);
            var max = (sortedData.length > 0) ? sortedData[0] : 0;
            seriesData[i] = max;
        }
        return seriesData;
    } else {
        for (var i = 0; i < sdata.length - 1; i++) {
            var frequency = 0;
            for (var j = 0; j < fname.length; j++) {
                if ((fname[j] > sdata[i] || (fname[j] == sdata[i] && fname[j] == min)) && fname[j] <= sdata[i + 1])
                    frequency = (1 * frequency) + (1 * fname[j]);
            }
            seriesData[i] = frequency;
        }
        return seriesData;
    }
};
HistogramChart.prototype.drawBin = function(fname) {
    if (this.m_maximumrange == "" || this.m_maximumrange == 0 || this.m_maximumrange == "0" || this.m_maximumrange == null || this.m_maximumrange == undefined || this.m_maximumrange == "undefined") {
        this.m_range = true;
    }
    var max = 0;
    var min = 0;
    var data = [];
    for (var i = 0; i < this.getDataProvider().length; i++) {
        if (1 * this.getDataProvider()[i][fname] > max)
            max = this.getDataProvider()[i][fname];
    }
    for (var i = 0; i < this.getDataProvider().length; i++) {
        if (1 * this.getDataProvider()[i][fname] < min)
            min = this.getDataProvider()[i][fname];
    }
    if (!IsBoolean(this.m_range)) {
        var interval = ((1 * max)-(min*1)) / (1 * this.m_maximumrange);
        data[0] = min;
        this.RangeFlag = (interval > 50) ? false : true;
        for (var i = 1; i < interval; i++) {
            data[i] = 1 * data[i - 1] + (1 * this.m_maximumrange);
        }
        data[i] = 1 * data[i - 1] + (1 * this.m_maximumrange);
        return data;
    } else {
        var obj = this.getCalculateNiceScales(min, max, this.m_basezero, this.m_autoaxissetup, min, max, (this.m_height));
        return obj.markerArray;
    }

};
HistogramChart.prototype.getCalculateNiceScales = function (calculatedMin, calculatedMax, baseZero, autoAxisSetup, minimumAxisValue, maximumAxisValue,chartHeight) {
	var min, max;
	if(calculatedMin === calculatedMax){
		if(calculatedMin > 0){
			/** decrease 40% from min and add 40% in max **/
			calculatedMin = calculatedMin*3/5;
			calculatedMax = calculatedMax*7/5;
		}
		else{
			calculatedMin = calculatedMin*7/5;
			calculatedMax = calculatedMax*3/5;
		}
	}
	if(IsBoolean(baseZero) && IsBoolean(autoAxisSetup)){
		min=calculatedMin;
		max=calculatedMax*1;
	}
	else if(IsBoolean(baseZero) && !IsBoolean(autoAxisSetup)){
		min=calculatedMin;
		max=(isNaN(maximumAxisValue)||(maximumAxisValue===""))?0:maximumAxisValue*1;
	}
	else if(!IsBoolean(baseZero) && IsBoolean(autoAxisSetup)){
		min=calculatedMin*1;
		max=calculatedMax*1;
	}
	else if(!IsBoolean(baseZero) && !IsBoolean(autoAxisSetup)){
		min=(isNaN(minimumAxisValue)||(maximumAxisValue===""))?0:minimumAxisValue*1;
		max=(isNaN(maximumAxisValue)||(maximumAxisValue===""))?0:maximumAxisValue*1;
	}
	if(max <= min){
		max = (min + 4);
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
HistogramChart.prototype.IsRangePossible = function() {
    return {
        "permission": "false",
        "message": "Increase Range!"
    };
};
//# sourceURL=HistogramChart.js
