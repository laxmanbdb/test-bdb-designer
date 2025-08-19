/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: DecompositionChart.js
 * @description DecompositionChart
 **/
function DecompositionChart(m_chartContainer, m_zIndex) {
    this.base = Chart;
    this.base();
    this.m_x = 680;
    this.m_y = 320;
    this.m_width = 300;
    this.m_height = 260;
    this.m_barWidth = 10;

    /** Array Creation for storing the calculated positions**/
    this.m_categoryData = [];
    this.m_seriesData = [];
    this.m_categoryNames = [];
    this.m_seriesNames = [];
    this.m_barSeriesArray = [];
    this.m_xPositionArray = [];
    this.m_yPositionArray = [];
    this.m_barWidth = "";
    this.m_barHeightArray = [];
    this.m_seriesVisiblityPosition;
    this.m_showpercentvalue = false;
    this.m_showmarkingorpercentvalue = false;
    this.m_showPercentValueFlag = true;
    this.m_seriesInitializeFlag = true;
    //this.m_calculation = new BarCalculation();
    this.noOfRows = 1;
    this.borderToChartMargin = 50;

    //this.m_xAxis = new BarXAxis();
    //this.m_yAxis = new BarYAxis();
    this.m_title = new svgTitle(this);
    this.m_subTitle = new svgSubTitle();
    this.m_showcontextlevels = "false";
    this.m_showpercentage = "true";
    this.m_aggregationtype = "sum";
    this.m_maxnodes = "10";
    this.m_nodecolor = "#f5f5f5";
    this.m_fillcolor = "#0d78bf";
    this.m_strokecolor = "#000000";
    this.m_nodeheight = 30;
    this.m_labelfontcolor = "#000000";
    this.m_labelfontsize = "12";
    this.m_labelfontstyle = "normal";
    this.m_labelfontweight = "normal";
    this.m_labelfontfamily = "BizvizFont";
    this.m_labelvaluefontcolor = "#000000";
    this.m_labelvaluefontsize = "12";
    this.m_labelvaluefontstyle = "normal";
    this.m_labelvaluefontweight = "normal";
    this.m_labelvaluefontfamily = "BizvizFont";
    this.m_arrowstrokewidth = "1";
    this.m_arrowstrokecolor = "";
    this.m_arrowsize = "10";
    this.m_isvalidconfiguration = false;
    this.m_contextseriesfields = [];
    this.m_updatedhierarchylevel = {};
    this.uparrow = {};
    this.lastLevel = {};
    this.m_drawnode = {};

    this.m_chartContainer = m_chartContainer;
    this.m_zIndex = m_zIndex;
    this.m_showhorizontalmarkerline = false;
    this.m_maxbarwidth = 40;
    this.m_enableanimation = "true";
    this.m_baranimationduration = 0.5;
    this.m_stackborderwidth = "0";
    this.m_stackbordercolor = "#ffffff";
    this.m_enablestackshadow = "false";
    this.m_stackshadowcolor = "#000000";
    this.m_stackshadowopacity = "0.3";
    this.m_canvastype = "svg";
    this.m_stacksvgtype = "rect";
    this.m_showpercentage = "false";
    // added for controlling uniform bar widths using script
    this.m_controlbarwidth = "auto";
    this.m_stackborderradius = "0";
    this.m_yaxislabellines = "2";
    this.enableDrillHighlighter = "false";
    this.m_drilltoggle = true;
    this.m_lineform = "curve";
    this.m_type = "Line";
    this.leftAxisInfo = {
        "max": 350,
        "min": 0
    }
};

/** @description Making prototype of chart class to inherit its properties and methods into Bar chart **/
DecompositionChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
DecompositionChart.prototype.setProperty = function(chartJson) {
    this.ParseJsonAttributes(chartJson.Object, this);
    this.initCanvas();
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
DecompositionChart.prototype.ParseJsonAttributes = function(jsonObject, nodeObject) {
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

/** @description getter for DataProvider**/
DecompositionChart.prototype.getDataProvider = function() {
    return this.m_dataProvider;
};

/** @description getter for Category field Name**/
DecompositionChart.prototype.getCategoryNames = function() {
    return this.m_categoryNames;
};

/** @description getter for category field display name**/
DecompositionChart.prototype.getCategoryDisplayNames = function() {
    return this.m_categoryDisplayNames;
};

/** @description calcluating mark text margin and than start point from where chart x,y will draw **/
DecompositionChart.prototype.setStartX = function() {
    this.m_startX = this.m_x * 1 + this.borderToChartMargin * 1;
};

/** @description calculating y Axis text formatter margin**/
DecompositionChart.prototype.getLeftSpace = function() {
    var unit = this.getUnitValue();
    var us = this.getCalculatedSpace(unit);
    var ps = this.getPrecisionSpace();
    var sp = (ps * 1 + us * 1) / 2;
    return sp;
};

/** @description calculating y axis text margin**/
DecompositionChart.prototype.getLeftLabelSpace = function() {
    var labelTextSpace = 0;
    this.setLabelWidth();
    if (IsBoolean(this.m_xAxis.getLabelTilted())) {
        if (this.m_xAxis.m_labelrotation * 1 > -70 && this.m_xAxis.m_labelrotation < 0) {
            var lw = this.getLabelWidth() / 2;
            var lpm = this.getLabelPrecisionMargin() / 2;
            var lsfm = this.getLabelSecondFormatterMargin() / 2;
            labelTextSpace = lw * 1 + lpm * 1 + lsfm * 1;
        }
    }
    return labelTextSpace;
};

/** @description calculating biggest text size in pixels**/
DecompositionChart.prototype.getYAxisLabelMargin = function() {
    var lm = 0;
    this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
    if (!IsBoolean(this.isEmptyCategory)) {
        lm = this.ctx.measureText(this.m_categoryData[0][0]).width;
        for (var i = 1, length = this.m_categoryData[0].length; i < length; i++) {
            if (lm < this.ctx.measureText(this.m_categoryData[0][i]).width) {
                lm = this.ctx.measureText(this.m_categoryData[0][i]).width;
            }
        }
        if (lm > this.m_width / 4)
            lm = this.m_width / 4;
    }
    return lm;
};

/** @description Calculating start Y**/
DecompositionChart.prototype.setStartY = function() {
    var chartYMargin = this.getChartMargin();
    var xlbm = 0; //this.getXAxisLabelMarginForBar();
    this.m_startY = this.m_y * 1 + this.m_height * 1 - chartYMargin * 1 - xlbm * 1;
};

/** @description Calculating x Axis Margin For Bar**/
DecompositionChart.prototype.getXAxisLabelMarginForBar = function() {
    var lm = 0;
    this.noOfRows = 1;
    if (!IsBoolean(this.m_xAxis.getLabelTilted())) {
        this.noOfRows = this.setNumberOfRows();
        var lfm = 0;
        var lw = this.fontScaling(this.m_xAxis.getLabelFontSize()) * 1.5 * this.noOfRows;
        var lsm = 0;
        var lpm = 0;
        var lsfm = 0;
        var dm = this.getXAxisDescriptionMargin();
    } else {
        var lfm = this.getLabelFormatterMargin();
        //this.setLabelWidth();
        var lw = this.getLabelWidth();
        var lsm = this.getLabelSignMargin();
        var lpm = this.getLabelPrecisionMargin();
        var lsfm = this.getLabelSecondFormatterMargin();
        var dm = this.getXAxisDescriptionMargin();
    }
    lm = lfm * 1 + lw * 1 + lsm * 1 + lpm * 1 + lsfm * 1 + dm * 1;
    return lm;
};

/** @description if series names are big than break into 2 rows to prevent from overlapping **/
DecompositionChart.prototype.setNumberOfRows = function() {
    this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
    var noOfRow = 1;
    var max = (("" + this.min).length <= ("" + this.max).length) ? this.max : this.min;
    if (!IsBoolean(this.isEmptySeries)) {
        var maxSeriesVal = (this.m_charttype == "100%") ? 100 : max;
        var markerLength = this.m_xAxisMarkersArray.length;
        var xDivision = (this.getEndX() - this.getStartX()) / (markerLength);
        var val = this.m_util.updateTextWithFormatter(maxSeriesVal, "", this.m_precision);
        var unit = this.getUnitValue();
        var secondUnit = this.getSecondUnitValue();
        if (secondUnit == "auto") {
            secondUnit = "K";
        }
        val = val + "" + unit + "" + secondUnit;
        if (this.ctx.measureText(val).width > xDivision) {
            noOfRow = (this.m_skipxaxislabels == "auto") ? 2 : 1;
            //noOfRow = 2;
        }
    }
    return noOfRow;
};

/** @description Getter for second unit formatter**/
DecompositionChart.prototype.getSecondUnitValue = function() {
    var secondunit = "";
    if (!IsBoolean(this.m_fixedlabel)) {
        if (IsBoolean(this.m_xAxis.getLeftaxisFormater()))
            if (this.getSecondaryFormater() != "none" && this.getSecondaryFormater() != "")
                if (this.getSecondaryUnit() != "none" && this.getSecondaryUnit() != "")
                    secondunit = this.m_util.getFormatterSymbol(this.getSecondaryFormater(), this.getSecondaryUnit());
    }
    return secondunit;
};

/** @description getter for unit formatter**/
DecompositionChart.prototype.getUnitValue = function() {
    var unit = "";
    if (!IsBoolean(this.m_fixedlabel)) {
        if (IsBoolean(this.m_xAxis.getLeftaxisFormater()))
            if (this.m_formater != "none" && this.m_formater != "")
                if (this.m_unit != "none" && this.m_unit != "")
                    unit = this.m_util.getFormatterSymbol(this.m_formater, this.m_unit);
    }

    return unit;
};

/** @description calculating formatter margin**/
DecompositionChart.prototype.getLabelFormatterMargin = function() {
    var lfm = 0;
    if (!IsBoolean(this.m_fixedlabel)) {
        if (IsBoolean(this.m_xAxis.getLeftaxisFormater())) {
            if (this.m_formater != "none" && this.m_formater != "")
                if (this.m_unit != "none" && this.m_unit != "") {
                    var unit = this.m_util.getFormatterSymbol(this.m_formater, this.m_unit);
                    this.ctx.beginPath();
                    this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.m_xAxis.getLabelFontSize() + "px " + this.m_xAxis.getLabelFontFamily();
                    lfm = this.ctx.measureText(unit).width;
                    this.ctx.closePath();
                }
        }
    }
    return lfm;
};

/** @description Getter for max label width**/
DecompositionChart.prototype.getLabelWidth = function() {
    return this.m_labelwidth;
};

/** @description Calculating text size with formatter and calculating label width**/
DecompositionChart.prototype.setLabelWidth = function() {
    this.m_labelwidth = 0;
    var maxSeriesVals = [];
    for (var i = 0; i < this.m_xAxisMarkersArray.length; i++) {
        var maxSeriesVal = (this.m_charttype == "100%") ? 100 : this.m_xAxisMarkersArray[i];
        if (!IsBoolean(this.m_fixedlabel)) {
            if (IsBoolean(this.m_xAxis.getLeftaxisFormater())) {
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
                    if (this.m_precision !== "default")
                        maxSeriesVal = this.m_xAxis.setPrecision(maxSeriesVal, this.m_precision);
                }
            }
            maxSeriesVal = getFormattedNumberWithCommas(maxSeriesVal, this.m_numberformatter);
            this.ctx.beginPath();
            this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
            maxSeriesVals[i] = this.ctx.measureText(maxSeriesVal).width;
            this.ctx.closePath();
        }
    }
    this.m_labelwidth = getMaxValueFromArray(maxSeriesVals);
};

/** @description Getter for Label SignMargin**/
DecompositionChart.prototype.getLabelSignMargin = function() {
    var lsm = 0;
    var msvw = 0;
    var minSeriesValue = this.min;
    if (minSeriesValue < 0) {
        this.ctx.beginPath();
        this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
        var msvw = this.ctx.measureText(minSeriesValue).width;
        this.ctx.closePath();
    }

    if (this.getLabelWidth() < msvw)
        lsm = this.ctx.measureText("-").width;

    return lsm;
};

/** @description Getter for label precision margin**/
DecompositionChart.prototype.getLabelPrecisionMargin = function() {
    var lpm = 5;
    if (!IsBoolean(this.m_fixedlabel)) {
        if (IsBoolean(this.m_xAxis.getLeftaxisFormater())) {
            if (this.m_precision != "none" && this.m_precision != "" && this.m_precision != 0) {
                this.ctx.beginPath();
                this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
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

/** @description Getter for Secondary Formatter Margin**/
DecompositionChart.prototype.getLabelSecondFormatterMargin = function() {
    var lsfm = 0;
    if (!IsBoolean(this.m_fixedlabel)) {
        if (IsBoolean(this.m_xAxis.getLeftaxisFormater())) {
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

/** @description Setter for chart EndX Position**/
DecompositionChart.prototype.setEndX = function() {
    var blm = this.getBorderToLegendMargin();
    var vlm = this.getVerticalLegendMargin();
    var vlxm = this.getVerticalLegendToXAxisMargin();
    var rlts = 0; //this.getRightLabelTextSpace();
    var sp = 0; //this.getRightSpace();
    var rightSideMargin = blm * 1 + vlm * 1 + vlxm * 1 + rlts * 1 + sp * 1;

    this.m_endX = (this.m_x * 1 + this.m_width * 1 - rightSideMargin * 1);
};

/** @description Getter for Right side margin which is calculated on the basis of right side formatter**/
DecompositionChart.prototype.getRightSpace = function() {
    var space;
    var ps = this.getPrecisionSpace();
    var unit = this.getUnitValue();
    var secondUnit = this.getSecondUnitValue();
    var us = this.getCalculatedSpace(unit);
    var sus = this.getCalculatedSpace(secondUnit);
    space = (ps * 1 + us * 1 + sus * 1) / 2;
    return space;
};

/** @description Generic function which takes input and calculating the width of input in pixels**/
DecompositionChart.prototype.getCalculatedSpace = function(str) {
    return (this.ctx.measureText(str).width);
};

/** @description Getter for precision space**/
DecompositionChart.prototype.getPrecisionSpace = function() {
    var str = "";
    for (var i = 0; i < this.m_precision; i++) {
        var x = 0;
        str += x;
    }
    return (this.ctx.measureText(str).width);
};

/** @description calculating space when text rotation is apply**/
DecompositionChart.prototype.getRightLabelTextSpace = function() {
    var labelTextSpace = 0;
    if (IsBoolean(this.m_xAxis.getLabelTilted())) {
        if (this.m_xAxis.m_labelrotation * 1 > 0 && this.m_xAxis.m_labelrotation < 80) {
            var lw = this.getLabelWidth();
            var lpm = this.getLabelPrecisionMargin();
            var lsfm = this.getLabelSecondFormatterMargin() / 2;
            labelTextSpace = lw * 1 + lpm * 1 + lsfm * 1;
        }
    }
    return labelTextSpace;
};

/** @description Setter for end Y**/
DecompositionChart.prototype.setEndY = function() {
    this.m_endY = (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1 + this.getMarginForTooltip());
};

/** @description Getter for Series Visibility**/
DecompositionChart.prototype.getCounterFlagForSeriesVisiblity = function() {
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

/** @description Setting Category,Series,Calculatedfields into seriesJSON array**/
DecompositionChart.prototype.setFields = function(fieldsJson) {
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

/** @description Setting category Name,display Name**/
DecompositionChart.prototype.setCategory = function(categoryJson) {
    this.m_categoryNames = [];
    this.m_categoryFieldColor = [];
    this.m_categoryDisplayNames = [];
    this.m_allCategoryNames = [];
    this.m_allCategoryDisplayNames = [];
    this.m_categoryVisibleArr = {};
    var count = 0;
    //only one category can be set for line chart, preference to first one
    for (var i = 0, length = categoryJson.length; i < length; i++) {
        this.m_allCategoryNames[i] = this.getProperAttributeNameValue(categoryJson[i], "Name");
        var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(categoryJson[i], "DisplayName"));
        this.m_allCategoryDisplayNames[i] = m_formattedDisplayName;
        this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]] = this.getProperAttributeNameValue(categoryJson[i], "visible");
        if (IsBoolean(this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]])) {
            if (this.m_categoryNames.length == 0) {
                this.m_categoryNames[count] = this.getProperAttributeNameValue(categoryJson[i], "Name");
                this.m_categoryDisplayNames[count] = m_formattedDisplayName;
                this.m_categoryFieldColor[count] = this.getProperAttributeNameValue(categoryJson[i], "Color");
                count++;
            }
        }
    }
};

/** @description Setting Series Property into arrays**/
DecompositionChart.prototype.setSeries = function(seriesJson) {
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
        //this.m_seriesNames[i] = this.getProperAttributeNameValue(seriesJson[i],"Name");
        this.m_allSeriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
        this.m_seriesVisibleArr[this.m_allSeriesNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
        if (IsBoolean(this.m_seriesVisibleArr[this.m_allSeriesNames[i]])) {
            this.m_seriesDisplayNames[count] = m_formattedDisplayName;
            this.m_seriesNames[count] = this.getProperAttributeNameValue(seriesJson[i], "Name");
            this.m_legendNames[count] = m_formattedDisplayName;
            this.m_seriesColors[count] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));
            /*this.m_seriesDataLabelProperty[count] = this.getProperAttributeNameValue(seriesJson[i], "DataLabelCustomProperties");
            if (this.m_seriesDataLabelProperty[count] !== undefined) {
                if (IsBoolean(this.m_seriesDataLabelProperty[count].useFieldColor)) {
                    this.m_seriesDataLabelProperty[count].dataLabelFontColor = this.m_seriesColors[count];
                }
                if ((this.m_seriesDataLabelProperty[count].showPercentValue !== undefined) && IsBoolean(this.m_seriesDataLabelProperty[count].showPercentValue) && (this.m_charttype == "100%")) {
                    this.m_seriesDataLabelProperty[count].datalabelField = this.m_seriesNames[count];
                }
                if (IsBoolean(this.m_seriesDataLabelProperty[count].dataLabelUseComponentFormater)) {
                    this.m_seriesDataLabelProperty[count].datalabelFormaterCurrency = this.m_unit;
                    this.m_seriesDataLabelProperty[count].datalabelFormaterPrecision = this.m_precision;
                    this.m_seriesDataLabelProperty[count].datalabelFormaterPosition = this.m_signposition;
                    this.m_seriesDataLabelProperty[count].datalabelFormaterUnit = this.m_secondaryunit;
                }
            } else {
                this.m_seriesDataLabelProperty[count] = this.getDataLabelProperties();
            }
            var transparency = this.getProperAttributeNameValue(seriesJson[i], "PlotTransparency");
            this.m_plotTrasparencyArray[count] = (transparency != undefined && transparency !== null && transparency !== "") ? transparency : 1;
            */
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
    this.setLegendsIntialLoad(this.m_defaultlegendfields);
    this.m_seriesfields = [this.m_allSeriesNames[0]];
    //this.m_contextseriesfields.push(this.m_seriesDisplayNames[0]);
};

/** @description Getter for Legend Information**/
DecompositionChart.prototype.getLegendInfo = function() {
    return this.legendMap;
};

/** @description Getter for All Series names**/
DecompositionChart.prototype.getAllSeriesNames = function() {
    return this.m_allSeriesNames;
};
/** @description Getter for All Category names **/
DecompositionChart.prototype.getAllCategoryNames = function() {
    return this.m_allCategoryNames;
};

/** @description Getter for Series Names**/
DecompositionChart.prototype.getSeriesNames = function() {
    return this.m_seriesNames;
};

/** @description Getter for Series Display Names**/
DecompositionChart.prototype.getSeriesDisplayNames = function() {
    return this.m_seriesDisplayNames;
};

/** @description Getter for Series Colors**/
DecompositionChart.prototype.getSeriesColors = function() {
    return this.m_seriesColors;
};

/** @description Setter for Legend Names**/
DecompositionChart.prototype.setLegendNames = function(m_legendNames) {
    this.m_legendNames = m_legendNames;
};

/** @description Getter for Legend Names**/
DecompositionChart.prototype.getLegendNames = function() {
    return this.m_legendNames;
};

/** @description Getter for Category Colors**/
DecompositionChart.prototype.getCategoryColorsForAction = function() {
    return this.m_categoryFieldColor;
};
/** @description Getter for Series Colors**/
DecompositionChart.prototype.getSeriesColorsForAction = function() {
    return this.m_seriesColors;
};

/** @description Setter for All Field Names**/
DecompositionChart.prototype.setAllFieldsName = function() {
    this.m_allfieldsName = [];
    for (var i = 0, len = this.getAllCategoryNames().length; i < len; i++) {
        this.m_allfieldsName.push(this.getAllCategoryNames()[i]);
    }
    for (var j = 0, length = this.getAllSeriesNames().length; j < length; j++) {
        this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
    }
};

/** @description Getter for all field Name**/
DecompositionChart.prototype.getAllFieldsName = function() {
    return this.m_allfieldsName;
};

/** @description Moving series,category display name in allfieldDisplayName array**/
DecompositionChart.prototype.setAllFieldsDisplayName = function() {
    this.m_allfieldsDisplayName = [];
    for (var i = 0, len = this.getCategoryDisplayNames().length; i < len; i++) {
        this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
    }
    for (var j = 0, length = this.getSeriesDisplayNames().length; j < length; j++) {
        this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
    }
};

/** @description Getter for All Field Display Name**/
DecompositionChart.prototype.getAllFieldsDisplayName = function() {
    return this.m_allfieldsDisplayName;
};

/** @description Fetching data from category,series and moving into category,series array**/
DecompositionChart.prototype.setCategorySeriesData = function() {
    this.m_categoryData = [];
    this.m_seriesData = [];
    this.m_seriesDataForToolTip = [];
    this.m_displaySeriesDataFlag = [];
    this.m_seriesDataForDataLabel = [];
    this.m_seriesDataLabelPropertyOverlaid = [];
    for (var k = 0, length = this.getDataProvider().length; k < length; k++) {
        var record = this.getDataProvider()[k];
        this.isEmptyCategory = true;
        if (this.getCategoryNames().length > 0) {
            this.isEmptyCategory = false;
            for (var i = 0, innerLength = this.getCategoryNames().length; i < innerLength; i++) {
                if (!this.m_categoryData[i])
                    this.m_categoryData[i] = [];
                var data = this.getValidFieldDataFromRecord(record, this.getCategoryNames()[i]);
                this.m_categoryData[i][k] = data;
            }
        }

        this.m_displaySeriesDataFlag[k] = [];
        for (var j = 0, l = 0, innerLength1 = this.getSeriesNames().length; j < innerLength1; j++) {
            if (!this.m_seriesData[j]) {
                this.m_seriesData[j] = [];
                this.m_seriesDataForToolTip[j] = [];
            }
            var data = this.getValidFieldDataFromRecord(record, this.getSeriesNames()[j]);
            this.m_displaySeriesDataFlag[k][j] = true;
            if (isNaN(data)) {
                this.m_displaySeriesDataFlag[k][j] = false;
                data = getNumericComparableValue(data);
            }
            if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[j]])) {
                if (!this.m_seriesDataForDataLabel[l]) {
                    this.m_seriesDataForDataLabel[l] = [];
                }
                this.m_seriesDataLabelPropertyOverlaid[l] = this.m_seriesDataLabelProperty[j];
                var dataFordatalabel = this.getValidFieldDataFromRecord(record, this.m_seriesDataLabelProperty[j].datalabelField);
                this.m_seriesDataForDataLabel[l][k] = dataFordatalabel;
                l++;
            }
            this.m_seriesData[j][k] = data;
            this.m_seriesDataForToolTip[j][k] = data;
        }

    }
};

/** @description Setter for Category Data**/
DecompositionChart.prototype.setCategoryData = function() {
    this.m_categoryData = [];
    this.isEmptyCategory = true;
    if (this.getCategoryNames().length > 0) {
        this.isEmptyCategory = false;
        for (var i = 0, length = this.getCategoryNames().length; i < length; i++) {
            this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
        }
    }
};

/** @description Getter for Category Data**/
DecompositionChart.prototype.getCategoryData = function() {
    return this.m_categoryData;
};

/** @description Setter for Series Data**/
DecompositionChart.prototype.setSeriesData = function() {
    this.m_seriesData = [];
    for (var i = 0, length = this.getSeriesNames().length; i < length; i++) {
        //if(IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]]))
        this.m_seriesData.push(this.getDataFromJSON(this.getSeriesNames()[i]));
    }
};

/** @description Getter for Series Data**/
DecompositionChart.prototype.getSeriesData = function() {
    return this.m_seriesData;
};

/** @description Setting Series Color**/
DecompositionChart.prototype.setSeriesColor = function(m_seriesColor) {
    this.m_seriesColor = m_seriesColor;
};

/** @description Getter for Series Color**/
DecompositionChart.prototype.getSeriesColor = function() {
    return this.m_seriesColor;
};
DecompositionChart.prototype.setSeriesdata = function() {
    this.m_seriesData = this.getDataProvider();
};
DecompositionChart.prototype.IsDrawingPossible = function() {
		var map = {};
		if (!IsBoolean(this.isEmptyCategory)) {
			if (!IsBoolean(this.m_isEmptySeries)) {
				if (IsBoolean(this.isVisibleSeries())){
					if(IsBoolean(this.m_isvalidconfiguration)){
						map = { "permission" : "true", message : this.m_status.success };
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
/** @description chart Frame,title,subtitle,xAxis,yAxis initialization**/
DecompositionChart.prototype.init = function() {
	this.setAllFieldsName();
	this.setCategoryData();
    this.getAggregatedMeasureValue();
    this.manageNodeData();
    this.createSVG();
    //this.initMouseClickEventForSVG(this.svgContainerId);
    this.m_chartFrame.init(this);
    this.m_title.init(this);
    this.m_subTitle.init(this);
    this.setChartDrawingArea();
    this.setPosition();
    this.setSeriesdata();
    this.isSeriesDataEmpty();
    this.m_tooltip.init(this);
};


DecompositionChart.prototype.getAggregatedMeasureValue = function() {
    var temp = this;
    var filteredData = (this.m_dataProvider).filter(function(value) {
        return (!isNaN(value[temp.m_categoryNames[0]]) && value[temp.m_categoryNames[0]] != "undefined" && value[temp.m_categoryNames[0]].toString().trim() != "" && value[temp.m_categoryNames[0]] != "null");
    });
    if (filteredData.length > 0) {
        if (!isNaN(filteredData[0][temp.m_categoryNames[0]])) {
            this.m_isvalidconfiguration = true;
            var data = JSON.parse(JSON.stringify(filteredData)),
                sum = 0,
                count, measureArr = [],
                id = 0,
                pid = -1,
                decompositionTree = [],
                measureField = this.m_categoryNames[0];
            var parentIds = {};
            this.m_seriesNames = this.m_allSeriesNames.slice(0,7);
            var seriesFields = this.m_seriesNames;
            this.m_seriesDNames = this.m_seriesDisplayNames.slice(0,7);
            var seriesDisplayNames = this.m_seriesDNames;
            if(IsBoolean(this.m_showcontextlevels)){           	 
            	seriesFields = this.m_seriesfields;
            	seriesDisplayNames = [];
            	seriesFields.map(function(ser){
            		seriesDisplayNames.push(temp.m_seriesDNames[(temp.m_seriesNames).indexOf(ser)]);
            	})
            };
            var updatedSeriesFields = JSON.parse(JSON.stringify(seriesFields));
            data.map(function(obj, ind, arr) {
              updatedSeriesFields.map(function(val, i, a) {
                 obj[val] = (obj[val] === undefined) ? "" : obj[val];
              });
            });
            updatedSeriesFields.splice(updatedSeriesFields.length - 1, 1);
            var childNodesObj = {},
                nodeData = {},
                childNodesArr = [];
            var rootNode = {};
            rootNode["nodeName"] = measureField;
            rootNode["fieldName"] = measureField;
            rootNode["fieldDisplayName"] = temp.m_categoryDisplayNames[0];
            rootNode["children"] = [];
            rootNode["childrenObjArr"] = [];
            rootNode["parent"] = "null";
            rootNode["parentid"] = "null";
            rootNode["showChildren"] = "false";
            rootNode["nodeValue"] = [];
            rootNode["value"] = 1;
            rootNode["percentage"] = [];
            rootNode["childid"] = [];
            rootNode["id"] = id++;
            data.map(function(obj, ind, arr) {
                if (!isNaN(obj[measureField]) || obj[measureField] !== null || obj[measureField] !== "") {
                    sum = sum + (obj[measureField] * 1);
                }
                updatedSeriesFields.map(function(val, i, a) {
                    if (childNodesObj[val] == undefined) {
                        childNodesObj[val] = [];
                    }
                    if (childNodesObj[val].indexOf(obj[val]) < 0) {
                        childNodesObj[val].push(obj[val]);
                    }
                })
                measureArr.push(obj[measureField]);
            });
            var nodedataset = {};
            updatedSeriesFields.map(function(val, i, a) {
                objdata = (i == 0) ? data : nodedataset[i - 1];
                nodedataset[i] = {};
                var uniq = 0;
                var len = (i == 0) ? 1 : Object.keys(nodedataset[i - 1]).length;
                for (var a = 0; a < len; a++) {
                    mapdata = (i == 0) ? data : nodedataset[i - 1][a];
                    childNodesObj[val].map(function(innerval, inneri) {
                        arrset = mapdata.filter(function(arr) {
                            return (arr[val] === innerval);
                        });
                        if (arrset.length > 0) {
                            nodedataset[i][uniq] = arrset;
                            uniq++;
                        }
                    })
                }
            });
            for (var i = 0; i < seriesFields.length; i++) {
                var par = (i == 1) ? "root" : seriesFields[i - 2];
                if (i == 0) {
                    rootNode["childfieldname"] = seriesFields[0];
                    rootNode["displayname"] = seriesDisplayNames[0];
                    data.map(function(val, ind, a) {
                        if (rootNode["children"].indexOf(val[seriesFields[0]]) < 0) {
                            rootNode["children"].push(val[seriesFields[0]]);
                        }
                    });
                    var values = []
                    for (var j = 0; j < rootNode["children"].length; j++) {
                        values[j] = [];
                        data.map(function(val, ind, a) {
                            if (val[seriesFields[0]] === rootNode["children"][j]) {
                                values[j].push(val[measureField]);
                            }
                        });
                    }
                    var rsm = [];
                    var rtotal = [];
                    for (var l = 0; l < rootNode["children"].length; l++) {
                        rootNode["nodeValue"][l] = [];
                        rsm[l] = values[l].reduce(function(a, b) {
                            return ((a * 1) + (b * 1))
                        }, 0);
                        rtotal = rsm.reduce(function(a, b) {
                            return ((a * 1) + (b * 1))
                        }, 0);
                        if (temp.m_aggregationtype == "mean") {
                            rootNode["nodeValue"][l] = rsm[l] / values[l].length;
                        } else if (temp.m_aggregationtype == "count") {
                            rootNode["nodeValue"][l] = data.filter(function(obj){return obj[rootNode.childfieldname] === rootNode["children"][l]}).length;
                            rootNode["value"] = data.length;
                        } else if (temp.m_aggregationtype == "min") {
                            rootNode["nodeValue"][l] = Math.min.apply(null, values[l]);
                            rootNode["value"] = Math.min.apply(null, rootNode["nodeValue"]);
                        } else if (temp.m_aggregationtype == "max") {
                            rootNode["nodeValue"][l] = Math.max.apply(null, values[l]);
                            rootNode["value"] = Math.max.apply(null, rootNode["nodeValue"]);
                        } else if (temp.m_aggregationtype == "perc" || temp.m_aggregationtype == "sum") {
                            rootNode["nodeValue"] = rsm;
                            rootNode["value"] = rtotal;
                        } else {}
                    }
                    for (var l = 0; l < rootNode["children"].length; l++) {
                        rootNode["percentage"][l] = ((rsm[l] / Math.abs(rtotal)) * 100);
                    }
                    if (temp.m_aggregationtype == "mean") {
                    	var mean = rootNode["nodeValue"].reduce(function(a, b) {
                            return ((a * 1) + (b * 1))
                        }, 0);
                    	rootNode["value"] = mean/rootNode["nodeValue"].length;
                    }
                    parentIds["root"] = 0;
                    childNodesArr.push(rootNode);
                } else {
                    var len = Object.keys(nodedataset[i - 1]).length;//(i == 1) ? 1 : 
                    for (var a = 0; a < len; a++) {
                        var currentChildarr = childNodesObj[seriesFields[i - 1]];
                        currentChildarr.map(function(val) {
                            var index = childNodesArr.length;
                            childNodesArr[index] = {};
                            childNodesArr[index]["nodeName"] = val;
                            childNodesArr[index]["children"] = [];
                            childNodesArr[index]["childrenObjArr"] = [];
                            childNodesArr[index]["parent"] = par;
                            childNodesArr[index]["fieldName"] = seriesFields[i - 1];
                            childNodesArr[index]["fieldDisplayName"] = seriesDisplayNames[i - 1];
                            childNodesArr[index]["id"] = id;
                            childNodesArr[index]["showChildren"] = "false";
                            childNodesArr[index]["nodeValue"] = [];
                            childNodesArr[index]["value"] = 1;
                            childNodesArr[index]["percentage"] = [];
                            childNodesArr[index]["childid"] = [];
                            childNodesArr[index]["childfieldname"] = seriesFields[i];
                            childNodesArr[index]["displayname"] = seriesDisplayNames[i];
                            var childObj = childNodesArr[index];
                            //par = (par == 'root') ? par : '';
                            var mappingdata = nodedataset[i - 1][a];//(i == 1) ? data : 
                            if (mappingdata !== undefined && mappingdata.length > 0) {
                                mappingdata.map(function(child) {
                                    if (child[seriesFields[i - 1]] === val && childObj["children"].indexOf(child[seriesFields[i]]) < 0) {
                                        childObj["children"].push(child[seriesFields[i]]);
                                    }
                                    /*if (child[seriesFields[i - 1]] == val && par == '' && par != 'root') {
                                        par = child[seriesFields[i - 2]];
                                    }*/
                                });
                                var parentfetch ='root' , parentprovide='root';
								for(var abc = 0;abc < i; abc++){
									var parentval = (mappingdata[0][seriesFields[abc]].toString().trim() == "") ? (mappingdata[0][seriesFields[abc]]).split(" ").length-1 + "&" : mappingdata[0][seriesFields[abc]];
									parentprovide =  parentprovide + "_" + parentval;
									if(abc < i-1)
										parentfetch = parentfetch + "_" + parentval;
								}
                                var values = []
                                for (var j = 0; j < childObj["children"].length; j++) {
                                    values[j] = [];
                                    mappingdata.map(function(val, ind, a) {
                                        if (val[seriesFields[i]] === childObj["children"][j]) {
                                            values[j].push(val[measureField]);
                                        }
                                    });
                                }
                                var csum = [];
                                var ctotal = [];
                                for (var l = 0; l < childObj["children"].length; l++) {
                                    childObj["nodeValue"][l] = [];
                                    csum[l] = values[l].reduce(function(a, b) {
                                        return ((a * 1) + (b * 1))
                                    }, 0);
                                    ctotal = csum.reduce(function(a, b) {
                                        return ((a * 1) + (b * 1))
                                    }, 0);
                                    if (temp.m_aggregationtype == "mean") {
                                        childObj["nodeValue"][l] = csum[l] / values[l].length;
                                    } else if (temp.m_aggregationtype == "count") {
                                    	childObj["nodeValue"][l] = values[l].length;
                                    	childObj["value"] = mappingdata.length;
                                    } else if (temp.m_aggregationtype == "min") {
                                        childObj["nodeValue"][l] = Math.min.apply(null, values[l]);
                                        childObj["value"] = Math.min.apply(null, childObj["nodeValue"]);
                                    } else if (temp.m_aggregationtype == "max") {
                                        childObj["nodeValue"][l] = Math.max.apply(null, values[l]);
                                        childObj["value"] = Math.max.apply(null, childObj["nodeValue"]);
                                    } else if (temp.m_aggregationtype == "perc" || temp.m_aggregationtype == "sum") {
                                        childObj["nodeValue"] = csum;
                                        childObj["value"] = ctotal;
                                    } else {}
                                }
                                for (var l = 0; l < childObj["children"].length; l++) {
                                	var percentage = Number(((csum[l] / Math.abs(ctotal)) * 100));
                                    childObj["percentage"][l] = isNaN(percentage) ? "0" : percentage;
                                }
                                if (temp.m_aggregationtype == "mean") {
			                    	var mean = childObj["nodeValue"].reduce(function(a, b) {
			                            return ((a * 1) + (b * 1))
			                        }, 0);
			                    	childObj["value"] = mean/childObj["nodeValue"].length;
			                    }
                                if (childObj["children"].length > 0) {
                                    childNodesArr[index]["parentid"] = parentIds[parentfetch];
                                    parentIds[parentprovide] = id;
                                    childNodesArr[parentIds[parentfetch]]["childid"].push(id)
                                    id++;
                                } else {
                                    childNodesArr.splice(childNodesArr.length - 1, 1);
                                }
                            } else {
                                childNodesArr.splice(childNodesArr.length - 1, 1);
                            }
                        });
                    }
                }
            }
            for (var id in childNodesArr) {
                if (childNodesArr.hasOwnProperty(id)) {
                    var elem = childNodesArr[id];
                    if (elem.parentid != "null") {
                        childNodesArr[elem["parentid"]]["childrenObjArr"].push(elem);
                    } else {
                        decompositionTree.push(elem);
                    }
                }
            }
            //  rootNode["value"] = sum;             this.m_aggreagatedvalue = sum;
            this.m_childnodesobj = childNodesObj;
            this.m_childdata = childNodesArr;
            /**DAS-1103 updating mean for root node only */
            if (temp.m_aggregationtype == "mean") {
				var mean=0;
				for (var i=0; i<this.m_childdata[0].childrenObjArr.length; i++){
					mean=mean+this.m_childdata[0].childrenObjArr[i]['value'];
				}
	        	this.m_childdata[0]['value'] = mean/this.m_childdata[0].childrenObjArr.length;
			}
            this.m_decompositiontree = decompositionTree;
        } else {
            this.m_isvalidconfiguration = false;
        }
    }
};

DecompositionChart.prototype.manageNodeData = function() {
	this.m_limitedslicesdisable = true;
    if (this.m_maxnodes != "" && this.m_childdata != undefined) {
		for(var k = 0; k < this.m_childdata.length; k++){
			var data = this.sortDataInDescOrder(this.m_childdata[k].nodeValue, this.m_childdata[k].children, this.m_childdata[k].childrenObjArr, this.m_childdata[k].percentage, this.m_maxnodes, this.m_childdata[k].childid, k);
    		if (this.m_maxnodes < this.m_childdata[k].children.length) {
            	this.m_sorteddataarr = [];
            	this.m_limitedslicesdisable = false;
            	this.m_seriesDataLabel = [];
                this.remainingData = {};/***Map for tool tip Others*/
                this.remainingPerc = {};
                //var data = "";
                if (this.m_maxnodes == 1) {
                    data = this.sortDataInDescOrder(this.m_childdata[k].nodeValue, this.m_childdata[k].children, this.m_maxnodes);
                  //  this.m_seriesDataLabel[0] = IsBoolean(this.m_showslicevalue) ? getDuplicateArray(this.m_childdata[k].nodeValue) : [data.seriesDataSum];
                    this.m_childdata[k].nodeValue = [data.seriesDataSum];
                    this.m_childdata[k].children = ["Sum"];
                } else {
                    //data = this.sortDataInDescOrder(this.m_childdata[k].nodeValue, this.m_childdata[k].children, this.m_childdata[k].childrenObjArr, this.m_childdata[k].percentage, this.m_maxnodes, this.m_childdata[k].childid);
                    var categoryName = "Others" + "(" + Object.keys(data.remainingData).length + ")";
                    this.m_sorteddataarr = data.DataMapArray;
                    /*for (var i = 0, length = this.m_sorteddataarr.length; i < length; i++) {
                    	this.m_childdata[k].children[i] = data.DataMapArray[i].childrenData;
                    	this.m_childdata[k].nodeValue[i] = data.DataMapArray[i].nodeValueData;
                    	this.m_childdata[k].childid[i] = data.DataMapArray[i].id;
                    	if(data.DataMapArray[i].childrenObjArrData != undefined){
                    		this.m_childdata[k].childrenObjArr[i] = data.DataMapArray[i].childrenObjArrData;
                    	}
                    	this.m_childdata[k].percentage[i] = data.DataMapArray[i].percentageData;
                    }*/
                    this.remainingData = data.remainingData;
                    this.remainingPerc = data.remainingPerc;
                    /*if (IsBoolean(this.allCategoryValuesSame(this.m_noofslices - 1, this.m_categoryData[0]))) {
                        this.remainingData[this.m_categoryData[0][this.m_noofslices - 1]] = data.seriesDataSum;
                    }*/
                    var newChildren = [];
                    var newNodevalue = [];
                    var newPercentage = [];
                    var newChildrenObjArr = [];
                    var newChildId = [];
                    var strnum = this.uparrow[k] != undefined ? this.uparrow[k] == 0 ? 0 : this.uparrow[k]*this.m_maxnodes - 1 : 0;
                    var maxnodes = this.uparrow[k] > 0 ? (this.m_maxnodes*1) + strnum : (this.m_maxnodes*1) + strnum - 1;
                    this.lastLevel[k] = maxnodes > this.m_childdata[k].children.length - 1 ? true : false;
                    for (var j = strnum, length1 = maxnodes; j < length1; j++) {
                    	if(this.m_childdata[k].children[j] != undefined){
                    		newChildren.push(this.m_childdata[k].children[j]);
                            newNodevalue.push(this.m_childdata[k].nodeValue[j]);
                            newPercentage.push(this.m_childdata[k].percentage[j]);
                            newChildId.push(this.m_childdata[k].childid[j]);
                            if(this.m_childdata[k].childrenObjArr[j] != undefined){
                            	newChildrenObjArr.push(this.m_childdata[k].childrenObjArr[j]);
                        	} 
                    	}        
                    }
                    if(this.uparrow[k] == undefined || this.uparrow[k] == 0){
                    	newChildren.push(categoryName);
                        newNodevalue.push(data.seriesDataSum);
                        newPercentage.push(data.seriesPercSum);
                    }
                    this.m_childdata[k].nodeValue = newNodevalue;
                    this.m_childdata[k].children = newChildren;
                    this.m_childdata[k].percentage = newPercentage;
                    this.m_childdata[k].childid = newChildId;
                    this.m_childdata[k].childrenObjArr = newChildrenObjArr;                   
                }
            }
    	}      
    }
};
DecompositionChart.prototype.sortDataInDescOrder = function(m_nodeValue, m_children, m_childrenObjArr, m_percentage, noOfNode, nodeChildId, ind) {
    var nodeValueData = m_nodeValue;
    var childrenData = m_children;
    var childrenObjArrData = m_childrenObjArr;
    var percentageData = m_percentage
    var swapped;
    var currentData = ""; 
    var lastData = "";
    var DataMapArray = [];
    var ObjDataMap = {};
    var DataArryNumeric = [];
    var worstDataArray = [];
    var fladremainingData = false;
    var remainingData = {};
    var remainingPerc = {};
    var seriesDataSum = 0;
    var seriesPercSum = 0;
	if(this.m_maxnodes < m_children.length){
	    for (var i = 0, length = nodeValueData.length; i < length; i++) {
	        currentData = getNumericComparableValue(nodeValueData[i]) * 1;
	        if (isNaN(currentData) || (nodeValueData[i] === "")) {
	            ObjDataMap = {
	                "childrenData": childrenData[i],
	                "index": i,
	                "id":nodeChildId[i],
	                "nodeValueData": nodeValueData[i],
	                "childrenObjArrData": childrenObjArrData[i],
	                "percentageData": percentageData[i],
	                "value": nodeValueData[i]
	            };
	            worstDataArray.push(ObjDataMap);/**Array contains all type of garbage data*/
	        } else {
	            ObjDataMap = {
	                "childrenData": childrenData[i],
	                "index": i,
	                "id":nodeChildId[i],
	                "nodeValueData": nodeValueData[i],
	                "childrenObjArrData": childrenObjArrData[i],
	                "percentageData": percentageData[i],
	                "value": nodeValueData/**Data without comma for sorting and summation*/
	            };
	            childrenObjArrData = childrenObjArrData[i] == undefined ? [] : childrenObjArrData;
	            DataMapArray.push(ObjDataMap);/***Array Object contains key value pairs of series and category data but only valid numeric data*/
	        }
	    }
	    /**Added for sorting operation on valid data*/
	    DataMapArray.sort(function(obj1, obj2) {
	        return obj2["nodeValueData"] - obj1["nodeValueData"];
	    });
	    for (var j = 0, length = worstDataArray.length; j < length; j++) {
	        DataMapArray.push(worstDataArray[j]);/**Push worst data after sorting at last index values*/
	    }
	    for (var k = noOfNode - 1, length = DataMapArray.length; k < length; k++) {
			remainingData[DataMapArray[k].childrenData+"-"+DataMapArray[k].index] = DataMapArray[k].nodeValueData;
			remainingPerc[DataMapArray[k].childrenData+"-"+DataMapArray[k].index] = DataMapArray[k].percentageData;
			currentData = isNaN(DataMapArray[k].nodeValueData) ? 0 : DataMapArray[k].nodeValueData;
			currentPerc = isNaN(DataMapArray[k].percentageData) ? 0 : DataMapArray[k].percentageData;
			seriesDataSum += currentData;
			seriesPercSum += currentPerc*1;
		}
		if(m_childrenObjArr.length > 0){
			/*order childrenObjArr as DataMapArray to sort it properly when many nodes have same values*/
			var nameToIndexMap = DataMapArray.reduce(function(acc, item, index){
				  acc[item.childrenData] = index;
				  return acc;
			}, {});
			m_childrenObjArr.sort(function(a, b){return nameToIndexMap[a.nodeName] - nameToIndexMap[b.nodeName]});
			m_childrenObjArr.sort(function(obj1, obj2) {
		        return obj2["value"] - obj1["value"];
		    });
		    for (var i = 0, length = m_childrenObjArr.length; i < length; i++) {
	        	this.m_childdata[ind].children[i] = m_childrenObjArr[i].nodeName;
	        	this.m_childdata[ind].nodeValue[i] = m_childrenObjArr[i].value;
	        	this.m_childdata[ind].childid[i] = m_childrenObjArr[i].id;
	        }
	        this.m_childdata[ind].childrenObjArr = m_childrenObjArr;
	        this.m_childdata[ind].percentage.sort(function(a, b) {
		        return b - a;
		    });
		} else {
			for (var i = 0, length = DataMapArray.length; i < length; i++) {
	        	this.m_childdata[ind].children[i] = DataMapArray[i].childrenData;
	        	this.m_childdata[ind].nodeValue[i] = DataMapArray[i].nodeValueData;
	        	this.m_childdata[ind].percentage[i] = DataMapArray[i].percentageData;
	        }
		}
		
	    return {
	        "DataMapArray": DataMapArray,
	        "seriesDataSum": seriesDataSum,
	        "remainingData": remainingData,
	        "seriesPercSum": seriesPercSum,
	        "remainingPerc": remainingPerc
	    };
	} else {
		for (var i = 0, length = nodeValueData.length; i < length; i++) {
	        currentData = getNumericComparableValue(nodeValueData[i]) * 1;
	        if (isNaN(currentData) || (nodeValueData[i] === "")) {
	            ObjDataMap = {
	                "childrenData": childrenData[i],
	                "index": i,
	                "id":nodeChildId[i],
	                "nodeValueData": nodeValueData[i],
	                "childrenObjArrData": childrenObjArrData[i],
	                "percentageData": percentageData[i],
	                "value": nodeValueData[i]
	            };
	            worstDataArray.push(ObjDataMap);/**Array contains all type of garbage data*/
	        } else {
	            ObjDataMap = {
	                "childrenData": childrenData[i],
	                "index": i,
	                "id":nodeChildId[i],
	                "nodeValueData": nodeValueData[i],
	                "childrenObjArrData": childrenObjArrData[i],
	                "percentageData": percentageData[i],
	                "value": nodeValueData/**Data without comma for sorting and summation*/
	            };
	            childrenObjArrData = childrenObjArrData[i] == undefined ? [] : childrenObjArrData;
	            DataMapArray.push(ObjDataMap);/***Array Object contains key value pairs of series and category data but only valid numeric data*/
	        }
	    }
	    /**Added for sorting operation on valid data*/
	    DataMapArray.sort(function(obj1, obj2) {
	        return obj2["nodeValueData"] - obj1["nodeValueData"];
	    });
		if(m_childrenObjArr.length > 0){
			m_childrenObjArr.sort(function(obj1, obj2) {
		        return obj2["value"] - obj1["value"];
		    });
		    for (var i = 0, length = m_childrenObjArr.length; i < length; i++) {
	        	this.m_childdata[ind].children[i] = m_childrenObjArr[i].nodeName;
	        	this.m_childdata[ind].nodeValue[i] = m_childrenObjArr[i].value;
	        	this.m_childdata[ind].childid[i] = m_childrenObjArr[i].id;
	        }
	        this.m_childdata[ind].childrenObjArr = m_childrenObjArr;
	        this.m_childdata[ind].percentage.sort(function(a, b) {
		        return b - a;
		    });
		} else {
			for (var i = 0, length = DataMapArray.length; i < length; i++) {
	        	this.m_childdata[ind].children[i] = DataMapArray[i].childrenData;
	        	this.m_childdata[ind].nodeValue[i] = DataMapArray[i].nodeValueData;
	        	this.m_childdata[ind].percentage[i] = DataMapArray[i].percentageData;
	        }
		}
	}
};
DecompositionChart.prototype.setPosition = function() {
    var startx = this.getStartX();
    var starty = (this.m_height * 1) / 2;
    var width = 100;       
    this.m_startx = startx;
    this.m_starty = starty;
    this.m_nodewidth = width;
};

/** @description Getting series data and moving into arrays **/
DecompositionChart.prototype.updateSeriesDataWithCommaSeperators = function() {
    this.m_displaySeriesDataFlag = [];
    for (var i = 0, length = this.m_seriesData.length; i < length; i++) {
        this.m_displaySeriesDataFlag[i] = [];
        for (var j = 0, dataLength = this.m_seriesData[i].length; j < dataLength; j++) {
            this.m_displaySeriesDataFlag[i][j] = true;
            if (isNaN(this.m_seriesData[i][j])) {
                this.m_displaySeriesDataFlag[i][j] = false;
                this.m_seriesData[i][j] = getNumericComparableValue(this.m_seriesData[i][j]);
            }
        }
    }
};

/** @description Drawing of chartFrame,Title,SubTitle,XAxis,YAxis,DecompositionChart,Legend**/
DecompositionChart.prototype.drawChart = function() {
    this.drawChartFrame();
    this.drawTitle();
    this.drawSubTitle();    
    var map = this.IsDrawingPossible();
    if (IsBoolean(map.permission)) {
    	this.setSVGDimension();
        this.createStackGroup("", "nodegrp", "", "Node");
        this.createStackGroup("", "linkgrp", "", "link");
        this.drawNode();
    } else {
        this.drawSVGMessage(map.message);
    }
};
/* Check if animation should be enabled for particular hierarchy*/
DecompositionChart.prototype.isAnimation = function(nodeChildFieldName) {
	var temp = this;
	if (IsBoolean(temp.m_showcontextlevels)) {
		if (IsBoolean(temp.contextclick)) {
			if (nodeChildFieldName == temp.m_contextseriesfields[temp.m_contextseriesfields.length - 1]) {
				return true;
			}
		} else {
			if (!IsBoolean(temp.contextclick) && !IsBoolean(temp.arrowclicked)) {
				return true;
			}
		}
	} else {
		if (!IsBoolean(temp.arrowclicked)) {
			return true;
		}
	}
};
DecompositionChart.prototype.drawNode = function() {
    var temp = this;
    var renderedchildfield = [];
    this.m_rstarty = ($("#chartSvgContainer"+this.m_objectId).height()*1)/2;
    this.m_decompositiontree[0].starty = this.m_rstarty;
    this.m_decompositiontree[0].startx = this.m_startx;
    var rect = drawSVGRect(this.m_startx, this.m_rstarty, this.m_nodewidth, this.m_nodeheight, this.m_fillcolor);
    $(rect).attr("id", "rectMeasure" + temp.m_objectid);
//    $(rect).attr("stroke", this.m_strokecolor);
    this.m_rvalue = (temp.m_aggregationtype == "perc") ? "100" : this.m_decompositiontree[0]["value"];
    var formattedValue = this.getFormattedText(this.m_rvalue, this.m_precision);
    var rnameText = this.drawSVGText(this.trimText(this.m_decompositiontree[0]["fieldDisplayName"], this.m_nodewidth, this.m_labelfontsize, this.m_labelfontfamily), this.m_startx+50, this.m_rstarty+20+(this.m_nodeheight*1), this.m_startx, this.m_rstarty, "30", "x", "y", this.m_labelfontcolor, "middle", this.m_labelfontweight, this.m_labelfontsize, this.m_labelfontfamily, this.m_labelfontstyle);
    var rvalueText = this.drawSVGText(this.trimText(formattedValue, this.m_nodewidth, this.m_labelvaluefontsize, this.m_labelvaluefontfamily), this.m_startx+50, this.m_rstarty+25+(this.m_nodeheight*1)+(this.m_labelvaluefontsize * 1), this.m_startx, this.m_rstarty, "30", "x", "y", this.m_labelvaluefontcolor, "middle", this.m_labelvaluefontweight, this.m_labelvaluefontsize, this.m_labelvaluefontfamily, this.m_labelvaluefontstyle);
    $("#" + "nodegrp" + this.m_objectid).append(rect,rnameText,rvalueText);
    var startx = this.m_startx;
    var a2barr = [];
    var a = 0;
    if(!IsBoolean(this.m_designMode)){

		$(rect).on("click", function(evt) {	
			/* DAS-618:added below condition to avoid multiple clicks on node */
			if (!evt.detail || evt.detail == 1) {
			    evt.preventDefault();
			    evt.stopPropagation();
			    if (!IsBoolean(temp.m_decompositiontree[0].showChildren)) {
			        if (!IsBoolean(temp.m_showcontextlevels) || (IsBoolean(temp.m_showcontextlevels) && temp.m_contextseriesfields.length > 0))
			            temp.childRendering(temp.m_decompositiontree[0], renderedchildfield, 0, a2barr, startx);
			    } else if (IsBoolean(temp.m_decompositiontree[0].showChildren)) {
			        if (IsBoolean(temp.m_enableanimation)) {
			            temp.closex = temp.m_decompositiontree[0].startx;
			            temp.closey = temp.m_decompositiontree[0].starty;
			            temp.setNodeAnimation(temp.m_decompositiontree[0]);
			        } else {
			            temp.clickEvents(temp.m_childdata[0].childfieldname, temp.m_childdata);
			        }
			        temp.m_childdata[0].showChildren = "false";
			    }
			}		
	    }).on("contextmenu", function (event) {
	    	if (IsBoolean(temp.m_showcontextlevels)) {
	    	    event.preventDefault();
	    	    event.stopPropagation();
	    	    var position = {
	    	        "left": event.pageX,
	    	        "top": event.pageY
	    	    };
	    	    temp.contextclick = "true";
	    	    var id = this.id;
	    	    temp.m_contexthierarchy = Array.from(temp.m_seriesDNames);
	    	    //temp.m_contextseriesfields = [];
	    	    // temp.m_updatedhierarchylevel = {};
	    	    temp.createContexLevels(position,temp.m_decompositiontree[0]);
	    	};
        }).on("mouseover", function(e) {
        	var nodeVal = temp.getFormattedText(temp.m_rvalue, temp.m_tooltipprecision);
            var toolTipData = {
                data: [
                    [{
                            shape: 'cube',
                            color: temp.m_fillcolor
                        },
                        temp.m_categoryDisplayNames[0],
                        nodeVal
                    ]
                ],
                highlightIndex: 0
            }
            temp.m_tooltip.drawDecompositionToolTip(toolTipData);
        }).on("mouseout", function(e) {
            temp.hideToolTip();
        });
	}
    if (IsBoolean(temp.m_showcontextlevels)) {
        if (temp.m_contextseriesfields.length > 0)
            this.childRendering(this.m_decompositiontree[0], renderedchildfield, 0, a2barr, startx);
    } else {
        this.childRendering(this.m_decompositiontree[0], renderedchildfield, 0, a2barr, startx);
    }
    
    
    /*for(var i = 0; i < temp.m_childdata.length; i++){
    	var node = temp.m_childdata[i];
    	if(renderedchildfield.indexOf(node["childfieldname"])< 0){
    		var start = (i == 0) ? this.m_startx + 100 : startx + 100;
    		startx = startx + 200;
    		var end = startx;
    		a2barr.push(node);
    		var ystart = (i == 0 ) ? this.m_starty + 15 : ($("#rect" + a2barr[a2barr.length-2]["children"][0] + temp.m_objectid)[0].getBBox()["y"] * 1) + 15;
    	}
    		
    	var initstarty = this.m_height / (node["children"].length + 1);
    	step = initstarty;
    		for(var c = 0;c < node["children"].length; c++){
    			if(renderedchildfield.indexOf(node["childfieldname"])< 0){
    				
    				starty = initstarty + (c * step) + 30;
    				var yend = starty + 15;
    					var connectingline = new SVGLineSeries();
    					var xarray = [start , end];//[this.m_startx+100, startx];
    					var yarray = [ystart, yend];//[this.m_starty+15, starty+15];
    					
    					var arcPts = temp.generateControlPoints(xarray, yarray);
    					connectingline.init(["#0d78bf","#0d78bf"],[start, end], [ystart, yend], undefined, this,1,"Population","2","straight","1");
    					temp.drawLinespath(0,connectingline, arcPts);
    				a++;
    				var rect = drawSVGRect(startx, starty, this.m_nodewidth, this.m_nodeheight , "");
    				$(rect).attr("id", "rect" + node["children"][c] + temp.m_objectid);
    				$(rect).attr("fill", temp.m_nodecolor);
    				$("#" + "nodegrp"+this.m_objectid).append(rect);
    			} else {
    				break;
    			}
    		}
    		if(renderedchildfield.indexOf(node["childfieldname"]) < 0){
    			renderedchildfield.push(node["childfieldname"]);
    		}
    }*/
};
DecompositionChart.prototype.childRendering = function(node, renderedchildfield, i, a2barr, startx) {
    var temp = this;
    var margin = 100;
    var prev;
    node.showChildren = "true";
    this.parentyvalue = node.starty;
    // if (renderedchildfield.indexOf(node["childfieldname"]) < 0) {
    var start = (i == 0) ? this.m_startx + 100 : startx + 100;
    startx = startx + 200;
    var end = startx;
    a2barr.push(node);
    //var nodeName = (node.nodeName + node.fieldName + node.id).toString().replace(/[^a-zA-Z0-9]/g, '');
    var nodeName = (node.id).toString().replace(/[^a-zA-Z0-9]/g, '');
    // var ystart = (i == 0) ? this.m_rstarty + (this.m_nodeheight / 2) : ($("#rect" + nodeName + temp.m_objectid)[0].getBBox()["y"] * 1) + (this.m_nodeheight / 2);
    //   }
    var ystart = (i == 0) ? this.m_rstarty + (this.m_nodeheight / 2) : (this.parentyvalue * 1) + (this.m_nodeheight / 2);
    var id = (node.childfieldname).toString().replace(/[^a-zA-Z0-9]/g, '');
    var group = this.createStackGroup("", "group" + id, "", "Group");
    var headerId = "headergroup" + temp.m_seriesNames.indexOf(node.childfieldname);
    var hierarchyGroup = this.createStackGroup("", headerId, "", "Group");
    //var hierarchyText = this.drawSVGText(this.trimText(node.displayname, (this.m_nodewidth - 20)), startx, "35", 0, 0, "30", "x", "y", this.m_labelfontcolor, "", "600", this.m_labelfontsize, this.m_labelfontfamily, this.m_labelfontstyle);
 	if(node.displayname != temp.trimText(node.displayname, (this.m_nodewidth - 20), this.m_labelfontsize, this.m_labelfontfamily)){
		var hierarchyText = this.drawSVGText(this.trimText(node.displayname, (this.m_nodewidth - 20), this.m_labelfontsize, this.m_labelfontfamily), startx, "35", 0, 0, "30", "x", "y", this.m_labelfontcolor, "", "600", this.m_labelfontsize, this.m_labelfontfamily, this.m_labelfontstyle);
	} else {
		var hierarchyText = this.drawSVGText(this.trimText(node.displayname, (this.m_nodewidth - 20), this.m_labelfontsize, this.m_labelfontfamily), startx + 50, "35", 0, 0, "30", "x", "y", this.m_labelfontcolor, "middle", "600", this.m_labelfontsize, this.m_labelfontfamily, this.m_labelfontstyle);
	}
 	var hierarchyLine = this.drawSVGLine(startx, "45", startx + 100, "45", "x", "y", "1", "2", this.m_fillcolor, "1");
    var hierarchyhoverText = this.drawSVGText('', startx + 50, "35", 0, 0, "30", "x", "y", this.m_labelfontcolor, "middle", "600", (this.m_labelfontsize * 1) + 2, this.m_labelfontfamily, this.m_labelfontstyle);
 	
    if(IsBoolean(temp.m_showcontextlevels)){
		var crossbutton = this.drawSVGCross(startx + (this.m_nodewidth - 10), 25, 10, "x", "y", "1", "2", this.m_fillcolor, node.childfieldname);
    	$("#" + headerId + temp.m_objectid).append($("#" +"crossgroup" + node.childfieldname + temp.m_objectid));
	}
	$("#" + headerId + temp.m_objectid).append(hierarchyText, hierarchyLine, hierarchyhoverText)
    $("#group" + id + this.m_objectid).append($("#" + headerId + temp.m_objectid));
    if (!IsBoolean(this.m_designMode)) {
        /*$("#" + headerId + temp.m_objectid).hover(function(e) {
            this.children[3].style.fontSize = temp.m_labelfontsize * 1 + 2 + "px";
            prev = $(this).text();
            $(this)[0].children[3].children[0].innerHTML = node.displayname;
        }, function() {
            //this.children[4].style.fontSize = temp.m_labelfontsize;
            $(this)[0].children[3].children[0].innerHTML = '';
        });*/
        $(hierarchyText).hover(function(e) {
            //prev = $(this).text();
            $(this).hide();
            $(hierarchyhoverText).show();
            $(hierarchyhoverText)[0].children[0].innerHTML =  node.displayname;
            $("#" +"crossgroup" + node.childfieldname + temp.m_objectid).hide();
        }, function() {
            $(hierarchyhoverText).hide();
            $(this).show();
            $("#" +"crossgroup" + node.childfieldname + temp.m_objectid).show();
            $(hierarchyhoverText)[0].children[0].innerHTML = '';
            //$(this)[0].children[0].innerHTML = prev;
        });
        $(hierarchyhoverText).hover(function(e) {
            //prev = $(hierarchyText).text();
            $(hierarchyText).hide();
            $(this).show();
            $(this)[0].children[0].innerHTML =  node.displayname;
            $("#" +"crossgroup" + node.childfieldname + temp.m_objectid).hide();
        }, function() {
            $(hierarchyText).show();
            $(this).hide();
            $("#" +"crossgroup" + node.childfieldname + temp.m_objectid).show();
            $(this)[0].children[0].innerHTML = '';
            //$(hierarchyText)[0].children[0].innerHTML = prev;
        });
    }
    if(node.parentid != "null"){
    	if(node.nodeName != temp.trimText(node.nodeName, this.m_nodewidth, (this.m_labelfontsize * 1) - 2, this.m_labelfontfamily)){
    		var clickedNodeText = this.drawSVGText(this.trimText(node.nodeName, this.m_nodewidth, (this.m_labelfontsize * 1) - 2, this.m_labelfontfamily), node.startx, "60", 0, 0, "30", "x", "y", this.m_labelfontcolor, "", "600", (this.m_labelfontsize * 1) - 2, this.m_labelfontfamily, this.m_labelfontstyle);
    	} else {
    		var clickedNodeText = this.drawSVGText(this.trimText(node.nodeName, this.m_nodewidth, (this.m_labelfontsize * 1) - 2, this.m_labelfontfamily), node.startx + 50, "60", 0, 0, "30", "x", "y", this.m_labelfontcolor, "middle", "600", (this.m_labelfontsize * 1) - 2, this.m_labelfontfamily, this.m_labelfontstyle);
    	}
    	var clickedNodeHoverText = this.drawSVGText('', node.startx + 50, "60", 0, 0, "30", "x", "y", this.m_labelfontcolor, "middle", "600", (this.m_labelfontsize * 1), this.m_labelfontfamily, this.m_labelfontstyle);    	
    	$("#group" + id + this.m_objectid).append(clickedNodeText,clickedNodeHoverText);
       /* $(clickedNodeText).hover(function() {
    		prev = $(this).text();
    		this.style.fontSize = temp.m_labelfontsize * 1 + "px";
    		$(this)[0].innerHTML = node.nodeName;
    	}, function() {
    		this.style.fontSize = (temp.m_labelfontsize * 1) - 2 + "px";
    		$(this)[0].innerHTML = prev;
    	});  */
    	$(clickedNodeText).hover(function(e) {
            $(this).hide();
            $(clickedNodeHoverText).show();
            $(clickedNodeHoverText)[0].children[0].innerHTML =  node.nodeName;
        }, function() {
            $(clickedNodeHoverText).hide();
            $(this).show();           
            $(clickedNodeHoverText)[0].children[0].innerHTML = '';
        });
        $(clickedNodeHoverText).hover(function(e) {
            $(clickedNodeText).hide();
            $(this).show();
            $(this)[0].children[0].innerHTML =  node.nodeName;
        }, function() {
            $(clickedNodeText).show();
            $(this).hide();
            $(this)[0].children[0].innerHTML = '';
        });
    } 
    $("#line" + node.id + temp.m_objectid).attr("stroke",node.alertcolor);
    $("#rect" + node.id + temp.m_objectid).attr("stroke",node.alertcolor);
    // var initstarty = this.m_height / (node["children"].length + 1);
    // step = initstarty;   
    var sp = ystart - (this.m_nodeheight / 2)
    var initstarty = ((node["children"].length - 1) / 2) * (this.m_nodeheight * 1 + 40);
    if (sp - initstarty < margin) {
        initstarty = -(margin - sp);
    }
    step = (this.m_nodeheight * 1 + 40);
    this.arrowmargin = -initstarty + sp - 20;

    if (node.children.length > 0) {
        for (var c = 0; c < node["children"].length; c++) {
            var childId = "";
            /*if (node["childrenObjArr"].length == 0) {
                childId = "";
            } else {
                for (var j = 0; j < node["children"].length; j++) {
                    if (node["children"][c] == node["childrenObjArr"][j].nodeName)
                    	childId = node["childrenObjArr"][j].id;
                }
            }*/
            // if (renderedchildfield.indexOf(node["childfieldname"]) < 0) {
            var alertcolor = this.getRangeColorNode(node, c);
            /*if (node.childid[c] == undefined && (isNaN(node.childid[c])) && (node["childid"].length < 1 || node["childid"].length < node.children.length)) {*/
            if (node.childid[c] == undefined && (isNaN(node.childid[c])) || (node["childid"].length < 1) || node.children[c].toString().indexOf("Others(") > -1) {
                var index = this.m_childdata.length;
                this.m_childdata[index] = {};
                this.m_childdata[index]["nodeName"] = node["children"][c];
                this.m_childdata[index]["children"] = [];
                this.m_childdata[index]["childrenObjArr"] = [];
                this.m_childdata[index]["parent"] = node["fieldName"];
                this.m_childdata[index]["fieldName"] = node["childfieldname"];
                this.m_childdata[index]["fieldDisplayName"] = node["displayname"];
                this.m_childdata[index]["id"] = this.m_childdata.length - 1;
                this.m_childdata[index]["showChildren"] = "false";
                this.m_childdata[index]["nodeValue"] = [];
                this.m_childdata[index]["value"] = node["nodeValue"][c];;
                this.m_childdata[index]["percentage"] = [];
                this.m_childdata[index]["childid"] = [];
                this.m_childdata[index]["childfieldname"] = '';
                this.m_childdata[index]["parentid"] = node['id'];
                this.m_childdata[index]["alertcolor"] = alertcolor;
                node["childid"][c] = this.m_childdata[index]["id"];
            }
            var nodeId = (node["childid"][c]).toString().replace(/[^a-zA-Z0-9]/g, '');
            var childGroup = this.createStackGroup("", nodeId, "", "Group");
            if (c === 0) {
                this.fontsize = -(this.fontScaling(this.m_labelfontsize * 1) * c);
            } else {
                this.fontsize = this.fontScaling(this.m_labelfontsize * 1) * c;
            }
            starty = -initstarty + (c * step) + sp + this.fontsize;
            var yend = starty + (this.m_nodeheight / 2);
            if (node["childrenObjArr"].length > 0 && node["childrenObjArr"][c] != undefined){
            	node["childrenObjArr"][c].alertcolor = alertcolor;
            	node["childrenObjArr"][c].starty = starty;
                node["childrenObjArr"][c].startx = startx;
            }                
            var rectstart = IsBoolean(this.m_enableanimation) ? startx - 200 : startx;
            var rectend = IsBoolean(this.m_enableanimation) ? this.parentyvalue : starty;
            var textstart = IsBoolean(this.m_enableanimation) ? startx - 150 : startx + 50;
            var textend = IsBoolean(this.m_enableanimation) ? this.parentyvalue : starty;
            var connectingline = new DSLineSeries();
            $(connectingline).attr("id", "line" + nodeId + temp.m_objectid);
            var xarray = [start, end]; //[this.m_startx+100, startx];
            var yarray = [ystart, yend]; //[this.m_starty+15, starty+15];

            var arcPts = temp.generateControlPoints(xarray, yarray);
            connectingline.init([this.m_nodecolor, this.m_nodecolor], [start, end], [ystart, yend], undefined, this, 1, "Population", "1", "straight", "1");
            temp.drawLinespath(0, connectingline, arcPts, id);
            if(IsBoolean(this.m_showpercentage) && (temp.m_aggregationtype != "perc")){
            	var percentText = this.drawSVGText(Number(node["percentage"][c]).toFixed(0) + "%", rectstart - 20, rectend + ((this.m_nodeheight * 1)/2 - 7), start, end, "30", "x", "y", alertcolor, "middle", this.m_labelfontweight, "12", this.m_labelfontfamily, this.m_labelfontstyle);
            	$("#" + nodeId + this.m_objectid).append(percentText);
            }
            var rect1 = drawSVGRect(rectstart, rectend, this.m_nodewidth, this.m_nodeheight, this.m_nodecolor);
            var widthpercentage = (node["percentage"][c] * 1) / 100;
            widthpercentage = (widthpercentage < 0) ? 0 : ((widthpercentage > 1) ? 1 : widthpercentage);
            var rect2 = drawSVGRect(rectstart, rectend, this.m_nodewidth * widthpercentage, this.m_nodeheight, alertcolor);
            $(rect1).attr("id", "rect" + nodeId + this.m_objectid);
            //$(rect1).attr("stroke", this.m_strokecolor);
            var value = (temp.m_aggregationtype == "perc") ? this.getFormattedText(node["percentage"][c], this.m_precision) : this.getFormattedText(node["nodeValue"][c], this.m_precision);
            var nameText = this.drawSVGText(this.trimText(node["children"][c], this.m_nodewidth, this.m_labelfontsize, this.m_labelfontfamily), textstart, textend + 20 + (this.m_nodeheight * 1), start, end, "30", "x", "y", this.m_labelfontcolor, "middle", this.m_labelfontweight, this.m_labelfontsize, this.m_labelfontfamily, this.m_labelfontstyle);
            var valueText = this.drawSVGText(this.trimText(value, this.m_nodewidth, this.m_labelvaluefontsize, this.m_labelvaluefontfamily), textstart, textend + 25 + (this.m_nodeheight * 1) + (this.m_labelvaluefontsize * 1), start, end, "30", "x", "y", this.m_labelvaluefontcolor, "middle", this.m_labelvaluefontweight, this.m_labelvaluefontsize, this.m_labelvaluefontfamily, this.m_labelvaluefontstyle, value);
            $("#" + nodeId + this.m_objectid).append(rect1, rect2, nameText, valueText);
            $("#group" + id + this.m_objectid).append($("#" + nodeId + this.m_objectid));
            if (IsBoolean(this.m_enableanimation)) {
                var animateYvalue = starty - this.parentyvalue;
                if(temp.isAnimation(node.childfieldname)){
                //if ((!IsBoolean(temp.m_showcontextlevels) && temp.m_allSeriesNames.indexOf(node.childfieldname) > temp.m_allSeriesNames.indexOf(Object.keys(temp.m_drawnode)[0])) || (IsBoolean(temp.m_showcontextlevels) && !IsBoolean(temp.contextclick)) || (IsBoolean(temp.m_showcontextlevels) && (IsBoolean(temp.contextclick) && node.childfieldname == temp.m_contextseriesfields[temp.m_contextseriesfields.length - 1]))) {
                    this.setLineAnimation(this.m_path);
                    $("#" + nodeId + this.m_objectid).css("transition", "transform 0.5s");
                }
                $("#" + nodeId + this.m_objectid).css("transform", "translate(200px, " + animateYvalue + "px)");
            }
            if (!IsBoolean(this.m_designMode)) {
                $("#" + nodeId + this.m_objectid).on("click", function(evt) {
                	/** DAS-618:added below condition to avoid multiple clicks on node**/
                	if (!evt.detail || evt.detail == 1) {
                	    event.preventDefault();
                	    event.stopPropagation();
                	    var id = this.id;
                	    var name = id.replace("rect", "").replace(temp.m_objectid, "");
                	    var node = temp.m_childdata.find(function(node) {
                	        return (node.id).toString().replace(/[^a-zA-Z0-9]/g, '') === name;
                	    });
                	    if ((node.nodeName).toString().indexOf("Others(") < 0) {
                	        if (node.children.length > 0) {
                	        	var dupNodeObj = Object.keys(temp.m_drawnode)
                	        	  .slice(0, Object.keys(temp.m_drawnode).indexOf(node.fieldName))
                	        	  .reduce(function (acc, key) {
                	        	    acc[key] = temp.m_drawnode[key];
                	        	    return acc;
                	        	 }, {});
                	        	temp.m_drawnode = dupNodeObj;
                	        	temp.m_drawnode[node.fieldName] = node.nodeName;
                	            if (IsBoolean(temp.m_showcontextlevels)) {
                	                function updateHierarchy(node) {
                	                    temp.m_updatedhierarchylevel[node.fieldName]['id'] = node.nodeName;
                	                    temp.m_updatedhierarchylevel[node.fieldName]['nodeid'] = node.id;
                	                    if (temp.m_updatedhierarchylevel[node.childfieldname] != undefined && node.childrenObjArr.length > 0) {
                	                        updateHierarchy(node.childrenObjArr[0])
                	                    }
                	                }
                	                updateHierarchy(node);
                	            }
                	            temp.contextclick = "false";
                	            temp.arrowclicked = "false";
                	            if (!IsBoolean(node.showChildren) && node != undefined) {
                	                var index = node.parentid;
                	                var parentnode = temp.m_childdata.find(function(node) {
                	                    return (node.id === index);
                	                });
                	                for (var i = 0; i < parentnode.children.length; i++) {
                	                    if (parentnode.children[i] != name && parentnode.childrenObjArr[i] != undefined) {
                	                        if (IsBoolean(parentnode.childrenObjArr[i].showChildren)) {
                	                            $("#line" + parentnode.childrenObjArr[i].id + temp.m_objectid).attr("stroke", temp.m_nodecolor);
                	                            $("#rect" + parentnode.childrenObjArr[i].id + temp.m_objectid).attr("stroke", "none");
                	                            parentnode.childrenObjArr[i].showChildren = "false";
                	                            temp.clickEvents(parentnode.childrenObjArr[i].childfieldname, parentnode.childrenObjArr);
                	                            break;
                	                        }
                	                    }
                	                }
                	                temp.childRendering(node, renderedchildfield, 1, a2barr, startx);
                	            } else if (IsBoolean(node.showChildren)) {
                	                $("#line" + node.id + temp.m_objectid).attr("stroke", temp.m_nodecolor);
                	                $("#rect" + node.id + temp.m_objectid).attr("stroke", "none");
                	                if (IsBoolean(temp.m_enableanimation)) {
                	                    temp.closex = node.startx;
                	                    temp.closey = node.starty;
                	                    temp.setNodeAnimation(node);
                	                } else {
                	                    temp.clickEvents(node.childfieldname, temp.m_childdata);
                	                }
                	                node.showChildren = "false";
                	            }
                	            temp.updateDataPoints(node);
                	        } else {
                	            if (!IsBoolean(node.showChildren)) {
                	                $("#line" + node.id + temp.m_objectid).attr("stroke", node.alertcolor);
                	                $("#rect" + node.id + temp.m_objectid).attr("stroke", node.alertcolor);
                	                node.showChildren = "true";
                	                temp.m_childdata.map(function(map) {
                	                    if (!IsBoolean(map.showChildren)) {
                	                        $("#" + map.id + temp.m_objectid).css({
                	                            "opacity": "0.4",
                	                            "pointer-events": "none"
                	                        });
                	                    }
                	                })
                	            } else {
                	                $("#line" + node.id + temp.m_objectid).attr("stroke", temp.m_nodecolor);
                	                $("#rect" + node.id + temp.m_objectid).attr("stroke", "none");
                	                node.showChildren = "false";
                	                temp.m_childdata.map(function(map) {
                	                    if (!IsBoolean(map.showChildren)) {
                	                        $("#" + map.id + temp.m_objectid).css({
                	                            "opacity": "1",
                	                            "pointer-events": "all"
                	                        });
                	                    }
                	                })
                	            }
                	        }
                	    }
                	}               	               	
                }).on("mouseover", function(e) {
                    var id = this.id;
                    var name = id.replace("rect", "").replace(temp.m_objectid, "");
                    var node = temp.m_childdata.find(function(node) {
                        return (node.id).toString().replace(/[^a-zA-Z0-9]/g, '') === name;
                    });
                    //var value = temp.getFormattedText(node.value, temp.m_tooltipprecision)
                    /*DAS-671 && DAS-673*/
                    if (temp.m_aggregationtype == "perc") {
                        var percentage = temp.m_childdata[node.parentid].percentage[temp.m_childdata[node.parentid].childid.indexOf(node.id)];
                        var value = temp.getFormattedText(percentage, temp.m_tooltipprecision);
                    } else {
                        var value = temp.getFormattedText(node.value, temp.m_tooltipprecision);
                    }                   
			        //var value = (temp.m_aggregationtype == "perc") ? this.children[3].textContent : temp.getFormattedText(node.value, temp.m_tooltipprecision);
                    var toolTipData = {
                        cat: node.nodeName,
                        data: [
                            [{
                                    shape: 'cube',
                                    color: node.alertcolor
                                },
                                temp.m_categoryDisplayNames[0],
                                value
                            ]
                        ],
                        highlightIndex: 0
                    }
                    temp.m_tooltip.drawDecompositionToolTip(toolTipData);
                }).on("mouseout", function(e) {
                    temp.hideToolTip();
                }).on("contextmenu", function(event) {
                    if (IsBoolean(temp.m_showcontextlevels)) {
                    	$("#contexleveldiv").remove();
                    	event.preventDefault();
                    	event.stopPropagation();
                    	var id = this.id;
                    	var position = {
                    		"left": event.pageX,
                    		"top": event.pageY
                    	};
                    	temp.contextclick = "true";
                    	var name = id.replace(temp.m_objectid, "");
                    	var node = temp.m_childdata.find(function(node) {
                    		return (node.id).toString().replace(/[^a-zA-Z0-9]/g, '') === name;
                    	});
                    	if ((node.nodeName).toString().indexOf("Others(") < 0) {
                    		//                            temp.m_contexthierarchy = (temp.m_updatedhierarchylevel[node.fieldName] == undefined) ? ((temp.m_contexthierarchy == undefined) ? Array.from(temp.m_seriesDNames) : temp.m_contexthierarchy) : temp.m_updatedhierarchylevel[node.fieldName]["levels"];              
                    		//                            if (temp.m_contexthierarchy.indexOf(node.fieldDisplayName) >= 0) {
                    		//                                temp.m_contexthierarchy.splice(temp.m_contexthierarchy.indexOf(node.fieldDisplayName), 1);
                    		//                            }
                    		if (Object.keys(temp.m_updatedhierarchylevel).length == 0) {
                    			temp.m_contexthierarchy = Array.from(temp.m_seriesDNames);
                    			if (temp.m_contexthierarchy.indexOf(node.fieldDisplayName) >= 0) {
                    				temp.m_contexthierarchy.splice(temp.m_contexthierarchy.indexOf(node.fieldDisplayName), 1);
                    			}
                    		} else if (Object.keys(temp.m_updatedhierarchylevel).length > 0 && temp.m_updatedhierarchylevel[node.fieldName] == undefined) {
                    			temp.m_contexthierarchy = Array.from(temp.m_updatedhierarchylevel[temp.m_contextseriesfields[temp.m_contextseriesfields.indexOf(node.fieldName) - 1]]["levels"]);
                    			if (temp.m_contexthierarchy.indexOf(node.fieldDisplayName) >= 0) {
                    				temp.m_contexthierarchy.splice(temp.m_contexthierarchy.indexOf(node.fieldDisplayName), 1);
                    			}
                    		} else {
                    			temp.m_contexthierarchy = temp.m_updatedhierarchylevel[node.fieldName]["levels"];
                    		}
                    		//                            if (temp.m_updatedhierarchylevel[node.fieldName] == undefined) {
                    		//                                temp.m_updatedhierarchylevel[node.fieldName] = [];
                    		//                                temp.m_updatedhierarchylevel[node.fieldName]["levels"] = [];
                    		//                                temp.m_updatedhierarchylevel[node.fieldName]["id"];
                    		//                                temp.m_updatedhierarchylevel[node.fieldName]["nodeid"];
                    		//                            }
                    		//                            temp.m_updatedhierarchylevel[node.fieldName]["levels"] = Array.from(temp.m_contexthierarchy);
                    		//                            temp.m_updatedhierarchylevel[node.fieldName]["id"] = node.nodeName;
                    		//                            temp.m_updatedhierarchylevel[node.fieldName]["nodeid"] = node.id;
                    		//                    	    temp.m_contextseriesfields.splice(temp.m_contextseriesfields.indexOf(node.fieldName) + 1);
                    		if (temp.m_contexthierarchy.length > 0)
                    			temp.createContexLevels(position, node);
                    	}
                    }
                });
            }
            //            } else {
            //                break;
            //            }
        }
        setTimeout(function() {
            $("#" + "nodegrp" + temp.m_objectid).append($("#group" + id + temp.m_objectid));
        }, 400);
        if (renderedchildfield.indexOf(node["childfieldname"]) < 0) {
            renderedchildfield.push(node["childfieldname"]);
        }
    }
    if((node.children[node.children.length - 1]).toString().indexOf("Others(") == 0 || temp.uparrow[node.id] != undefined){
    	var y = starty + (this.m_nodeheight * 1) + (this.m_labelfontsize*1) + (this.m_labelvaluefontsize*1) + 25;
    	var arrow = this.drawSVGArrow(startx + (this.m_nodewidth/2 * 1), y, 5, "x", "y", "1", "2", this.m_arrowstrokecolor, nodeId, this.m_arrowstrokewidth, this.m_arrowsize);
    	$("#group" + id + this.m_objectid).append($("#" +"arrowgroup" + nodeId + temp.m_objectid));
      //  temp.uparrow[node.id] = 0;
    }
    if (node.childrenObjArr.length > 0) {
        if (IsBoolean(temp.m_showcontextlevels) && temp.m_updatedhierarchylevel[node['childfieldname']] != undefined) {
            var dataobj = node.childrenObjArr;
            var property = node["childfieldname"];
            var drawnode;
            dataobj.map(function(val) {
                if (val.nodeName === temp.m_updatedhierarchylevel[property]["id"])
                    drawnode = val;
            });
            temp.m_obj = (drawnode != undefined) ? drawnode : node.childrenObjArr[0];
            //    dataobj = temp.m_obj.childrenObjArr;
        } else if (temp.m_drawnode[node['childfieldname']] != undefined) {
            var dataobj = node.childrenObjArr;
            var property = node["childfieldname"];
            var drawnode;
            dataobj.map(function(val) {
                if (val.nodeName === temp.m_drawnode[property])
                    drawnode = val;
            });
            temp.m_obj = (drawnode != undefined) ? drawnode : node.childrenObjArr[0];
        } else {
            temp.m_obj = temp.m_childdata[node["childid"][0]];
        }
        if(temp.m_updatedhierarchylevel != undefined && temp.m_updatedhierarchylevel[temp.m_obj.fieldDisplayName] != undefined){
        	temp.m_updatedhierarchylevel[temp.m_obj.fieldDisplayName].id = temp.m_obj.nodeName;
        	temp.m_updatedhierarchylevel[temp.m_obj.fieldDisplayName].nodeid = temp.m_obj.id;
        }
        temp.m_drawnode[temp.m_obj.fieldName] =  temp.m_obj.nodeName;
        this.childRendering(temp.m_obj, renderedchildfield, 1, a2barr, startx)
    }
    temp.contextclick = "false";
    temp.arrowclicked = "false";
    $("#dcloaderImage" + temp.m_objectid).hide();
    setTimeout(function() {
        var coordinates = $("#" + "nodegrp" + temp.m_objectid)[0].getBBox();
        $("#chartSvg" + temp.m_objectid).css("width", coordinates.width + temp.m_startx);
        $("#chartSvg" + temp.m_objectid).css("height", coordinates.height);

       // $("#rectMeasure" + temp.m_objectid).attr("disabled", false);
    }, 500);
};
/** @description Get custom Marker Icon for series alert indicator of Leaflet map. DAS-292**/
DecompositionChart.prototype.getRangeColorNode = function (node, c) {
	if(IsBoolean(this.m_designMode)){
		return this.m_fillcolor;
	}
	var rangeColor;
	var series=this.m_seriesData;
	var seriesName=this.m_seriesNames;
	var seriesColor=this.m_conditionalColors.m_ConditionalColor;
	if((seriesColor != undefined && seriesColor !== null && seriesColor !== "") ) {
		for (var i = 0; i < seriesColor.length; i++) {
			var operator = (seriesColor[i].m_operator == "=") ? "==" : "" + seriesColor[i].m_operator;
			if(seriesColor[i].m_flag === true){
				/*if(seriesColor[i].m_otherfield === seriesColor[i].m_comparedfield){*/
					/*fixed value comparison*/
					if(seriesColor[i].m_seriesname === node.childfieldname){
						if(seriesColor[i].m_seriesname === seriesColor[i].m_comparedfield){
							eval("result= '" + node.children[c] + "'" + operator + "'" + seriesColor[i].m_compareto + "'");
						} else {
							eval("result = " + parseFloat(node.nodeValue[c]) + "" + operator + "" + parseFloat(seriesColor[i].m_compareto) + "");
						}
						if (IsBoolean(result)) {
							rangeColor = seriesColor[i].m_color;
						} 
					}
				/*}*/	
			}
			else{
				/*Nothing*/
			}
		}
		rangeColor = rangeColor ? rangeColor : this.m_fillcolor;
	} else {
		rangeColor = this.m_fillcolor;
	}
	return rangeColor;
};

DecompositionChart.prototype.clickEvents = function(id, childdata) {
    var temp = this;
    var obj = [];
    var name = id.replace("rect", "").replace(this.m_objectid, "").replace(/[^a-zA-Z0-9]/g, '');
    var clickid = name + this.m_objectid;
    $("#group" + clickid).remove();
    childdata.map(function(val, ind, a) {
        if (val.childfieldname == id && val.childrenObjArr.length > 0) {
            var obj = val.childrenObjArr[0].childfieldname;
            (val.childrenObjArr).forEach(function(element, index) {
            	element.showChildren = "false";
            });
            temp.clickEvents(obj, val.childrenObjArr);
        }
    });
};
DecompositionChart.prototype.setNodeAnimation = function(child) {
    var temp = this;
    function animation(k, children) {
        $("#line" + children.childid[k] + temp.m_objectid).remove();
        var closex = temp.closex - children.startx;
        var closey = temp.closey - children.starty;
        $("#" + children.childid[k] + temp.m_objectid).css("transform", "translate(" + closex + "px, " + closey + "px)");
        $("#" + children.childid[k] + temp.m_objectid).css("transition", "transform 0.5s");
        children.showChildren = "false";
        if (k < children.childid.length - 1) {
            animation(k + 1, children);
        } else {
            setTimeout(function() {
                var clickid = (children.childfieldname).replace(/[^a-zA-Z0-9]/g, '') + temp.m_objectid;
                $("#group" + clickid).remove();
            }, 400);
        }
    }
    if (child.childrenObjArr.length > 0) {
        child.childrenObjArr.map(function(objArr) {
            if (IsBoolean(objArr.showChildren)) {
                if (objArr.childrenObjArr.length > 0)
                    temp.setNodeAnimation(objArr);
                else
                    animation(0, objArr);
            }
        });
        animation(0, child);
    } else {
        animation(0, child);
    }
};
DecompositionChart.prototype.updateArrowInfo = function(hname){
	var temp = this;
	var nmindx = Object.keys(temp.m_updatedhierarchylevel).indexOf(hname);
	if ((nmindx > 0 && Object.keys(temp.m_updatedhierarchylevel).length > 0) || (Object.keys(temp.uparrow).length > 0 && Object.keys(temp.m_updatedhierarchylevel).length > 0) && temp.m_updatedhierarchylevel[hname] != undefined) {
		var delId = nmindx == 0 ? Object.keys(temp.uparrow)[0] : temp.m_updatedhierarchylevel[Object.keys(temp.m_updatedhierarchylevel)[nmindx-1]].nodeid;
		var dup = Object.keys(temp.uparrow);
		if(dup.indexOf(delId.toString()) > -1){
			dup.splice(dup.indexOf(delId.toString()));
		}
		for (var key in temp.uparrow) {
			if (!dup.includes(key)) {
				delete temp.uparrow[key];
			}
		}
	} else if(Object.keys(temp.m_updatedhierarchylevel).length == 0){
		temp.uparrow = {};
	}
};
DecompositionChart.prototype.createContexLevels = function(pos, node) {
    var temp = this;
    var contextMenuData = temp.m_contexthierarchy;
    temp.field = node.fieldName;
    temp.clickednodeinfo = node;
    $("#contexleveldiv").remove();
    var contentTable = "";
    for (var i = 0, length = contextMenuData.length; i < length; i++) {
        contentTable += "<tr style=\"font-style:" + this.m_labelfontstyle + ";color:#000000;font-weight:" + this.m_labelfontweight + ";font-family:" + selectGlobalFont(this.m_labelfontfamily) + "\">" +
            "<td>" + contextMenuData[i] + "</td></tr>";
    }
    var Table = "<table id=\"contexleveldiv\">" + contentTable + "</table>";
    if (!temp.m_designMode) {
    	$("body").append(Table);
    }
    $("#contexleveldiv").css({
    	"display": "block",
        "position": "absolute",
        "left": pos.left + 10 + "px",
        "top": pos.top + 10 + "px",
        "background": "#ffffff"
    })
    temp.hideToolTip();
    $(".dropdown-menu-context-menu").remove();

    $("#contexleveldiv tr").click(function() {
        var sf = $(this).children("td").html(); 
        var node = temp.clickednodeinfo;
        if (temp.m_updatedhierarchylevel[node.fieldName] == undefined) {
            temp.m_updatedhierarchylevel[node.fieldName] = [];
            temp.m_updatedhierarchylevel[node.fieldName]["levels"] = [];
            temp.m_updatedhierarchylevel[node.fieldName]["id"];
            temp.m_updatedhierarchylevel[node.fieldName]["nodeid"];
        }
        temp.m_updatedhierarchylevel[node.fieldName]["levels"] = Array.from(temp.m_contexthierarchy);
        temp.m_updatedhierarchylevel[node.fieldName]["id"] = node.nodeName;
        temp.m_updatedhierarchylevel[node.fieldName]["nodeid"] = node.id;
        temp.m_contextseriesfields.splice(temp.m_contextseriesfields.indexOf(temp.field) + 1);
        var hierarchylevels = {};
        for(j = 0; j < temp.m_contextseriesfields.length; j++){
          var val = temp.m_contextseriesfields[j];
          hierarchylevels[val] = temp.m_updatedhierarchylevel[val];
        }
        temp.m_updatedhierarchylevel = hierarchylevels;
        var series = temp.m_seriesNames[temp.m_seriesDNames.indexOf(sf)];
        if (temp.m_contextseriesfields.indexOf(series) < 0) {
            temp.m_contextseriesfields.push(series);
        }
        temp.m_seriesfields = temp.m_contextseriesfields;
        if(temp.uparrow != undefined && Object.keys(temp.uparrow).length > 0){
        	temp.updateArrowInfo(sf);
        }
        $("#contexleveldiv").remove();
        temp.init();
        temp.drawChart();
    });
    $(".draggablesParentDiv").click(function(){
    	 $("#contexleveldiv").remove();
    });
};

/** @description will trim text which is drawing out of given width.*/
DecompositionChart.prototype.trimText = function(text, maxWidth, fontsize, fontfamily) {
	text = (isNaN(text)) ? text.replace(/\s*$/,"") : text.toString();
	this.ctx.font = fontsize + "px " + selectGlobalFont(fontfamily);
	var txtWidth = this.ctx.measureText(text).width;
	if (txtWidth > maxWidth) {
		var words = text.split("");
		var newTxt = "";
		for (var j = 0; j < words.length; j++) {
			if (maxWidth > this.ctx.measureText(newTxt + words[j]).width) {
				newTxt += words[j];
			} else {
				newTxt += "..";
				break;
			}
		}
		return newTxt;
	}
	return text;
};
DecompositionChart.prototype.getFormattedText = function(text, precision) {
    this.setFormatter();
    this.setSecondaryFormatter();
    var precision = precision;
    if (text % 1 != 0 && precision < 1) {
        text = this.setPrecision(text, 0);
    } else {
        if (precision !== "default")
            text = this.setPrecision(text, precision);
    }
    if ((this.m_formater == "none" || this.m_formater == "") && (this.m_secondaryformater == "none" || this.m_secondaryformater == "")) {
        text = this.setPrecision(text, precision);
    }
    text = this.m_util.updateTextWithFormatter(text, this.m_secondaryUnitSymbol, precision);

    if (this.m_secondaryUnitSymbol != "auto") {
        if (precision != 0 && precision != null) {
            text = this.setPrecision(text, precision);
        } else if (text < 1 && text % 1 != 0) {
            text = this.setPrecision(text, 2);
        }
        text = (text % 1 === 0 && precision === "default") ? (text * 1) : text;
        text = this.addSecondaryFormater(text, this.m_secondaryUnitSymbol);
    } else {
        var symbol = getNumberFormattedSymbol(text * 1, this.m_unit);
        var val = getNumberFormattedNumericValue(text * 1, precision, this.m_unit);
        text = this.setPrecision(val, precision);
        if (precision != 0 && precision != null) {
            text = this.setPrecision(text, precision);
        } else if (text < 1 && text % 1 != 0) {
            text = this.setPrecision(text, 2);
        }
        text = (text % 1 === 0 && precision === "default") ? (text * 1) : text;
        text = this.addSecondaryFormater(text, symbol);
    }
    text = getFormattedNumberWithCommas(text, this.m_numberformatter, this.m_unit);
    if (this.m_unitSymbol != undefined) {
        text = this.m_util.addFormatter(text, this.m_unitSymbol, this.m_formatterPosition, precision);
    }
    return text;
};
DecompositionChart.prototype.setPrecision = function(text, precision) {
    var text = text * 1;
    if (text !== 0) {
        if (precision !== "default") {
            return text.toFixed(precision);
        } else {
            return (text * 1);
        }
    } else {
        return text * 1;
    }
};
DecompositionChart.prototype.addSecondaryFormater = function (text, secondaryUnitSymbol) {
	var textValue = text;
	try {
		eval("var formattedText = this.m_util.addUnitAs" + this.m_secondaryFormatterPosition + "(textValue,secondaryUnitSymbol);");
	} catch (e) {
		return formattedText.toString();
	}
	return formattedText.toString();
};
DecompositionChart.prototype.setFormatter = function() {
    this.m_unitSymbol = "";
    this.m_formatterPosition = "";

    if (this.m_formater != "none" && this.m_formater != "") {
        var unit = this.getUnit();
        var formatter = this.getFormater();
        if (unit != "none" && unit != "") {
            this.m_unitSymbol = this.m_util.getFormatterSymbol(formatter, unit);
            this.m_formatterPosition = this.getSignPosition();
        }
    }
};
DecompositionChart.prototype.setSecondaryFormatter = function() {
    this.m_secondaryUnitSymbol = "";
    this.m_secondaryFormatterPosition = "";

    if (this.m_secondaryformater != "none" && this.m_secondaryformater != "" && this.getUnit() != "Percent") {
        var secondaryUnit = this.getSecondaryUnit();
        var secondaryFormatter = this.getSecondaryFormater();
        if (secondaryUnit != "" && secondaryUnit != "none" && secondaryUnit != undefined) {
            this.m_secondaryUnitSymbol = this.m_util.getFormatterSymbol(secondaryFormatter, secondaryUnit);
        }
        this.m_secondaryFormatterPosition = "suffix";
    }
};

/** @description to generate two additional points with start and end for creatign curve line**/
DecompositionChart.prototype.generateControlPoints = function(xArr, yArr) {
    var x1, x2, y1, y2, cx1, cx2, cy1, cy2;
    var cpts = [];
    x1 = xArr[0] * 1;
    x2 = xArr[1] * 1;
    y1 = yArr[0] * 1;
    y2 = yArr[1] * 1;

    if (x2 > x1) {
        cx1 = x1 + ((x2 - x1) / 2);
        cy1 = y1;
        cx2 = x2 - ((x2 - x1) / 2);
        cy2 = y2;
        cpts.push(cx1);
        cpts.push(cy1);
        cpts.push(cx2);
        cpts.push(cy2);
        return cpts;
    }
};

DecompositionChart.prototype.drawLinespath = function(index, cl, pts, id) {
    var temp = this
    var id = "#group" + id + this.m_objectid;
    var attributeD = "";
    var xposArrLength = pts.length;
    for (var i = 0; i < xposArrLength; i++) { //(i == 0 || i == 1) && 
        if (cl.yPositionArray[i + 1] != undefined) {
            var path = temp.createBezierPath(cl.xPositionArray[i], cl.yPositionArray[i], pts[0], pts[1], pts[2], pts[3], cl.xPositionArray[i + 1], cl.yPositionArray[i + 1]);
            if (path != undefined)
                attributeD += path;
        }
    }
    if (attributeD != undefined) {
        var strokeDashArray = cl.getLineDashArray(cl.lineType, cl.lineWidth);
        var path = cl.createPath(cl.color[0], cl.lineWidth, strokeDashArray);
        path.setAttributeNS(null, "d", attributeD);
        path.setAttributeNS(null,"id",cl.id);
        this.m_path = path;
        $(id).append(path);       
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;
//        if (IsBoolean(cl.m_chart.m_enableanimation) && IsBoolean(!cl.m_chart.scaleFlag) && !isIE) {
//            cl.setLineAnimation(path);
//        }
    }
}
/** @description draw link between nodes with start, end and connecting points**/
DecompositionChart.prototype.createBezierPath = function(x1, y1, px1, py1, px2, py2, x2, y2) {
    if (x1 !== "" && y1 !== "" && px1 !== "" && py1 !== "" && px2 !== "" && py2 !== "" && x2 !== "" && y2 !== "")
        return "M " + x1 + " " + y1 + " C " + px1 + " " + py1 + " " + px2 + " " + py2 + " " + x2 + " " + y2;
    else
        return;
};
/** @description creating dummy series info for using svg line method**/
DecompositionChart.prototype.getSeriesInfo = function() {
    return {
        "axis": "left",
        "chart": "line",
        "data": ["300", "100"]
    };
};
/** @description if already present remove and create new canvas**/
DecompositionChart.prototype.initCanvas = function() {
    var temp = this;
    $("#draggableDiv" + temp.m_objectid).remove();
    this.initializeDraggableDivAndCanvas();
};

/** @description initializing DraggableDiv And Canvas by calling multiple methods**/
DecompositionChart.prototype.initializeDraggableDivAndCanvas = function() {
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
DecompositionChart.prototype.createStackGroup = function (barSeriesArray, name , index, seriesName) {
	//"barSeriesArray" parameter has been added in parameter to use it's property if required
	var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.setAttribute('id', name+index+this.m_objectid);
	group.setAttribute('class', name);
	group.setAttribute('data-fieldIndex', index);
	group.setAttribute('data-fieldName', seriesName);
	$("#" + this.chartSvg).append(group);
};
/** @description createSVG Method used for create SVG element for Chart **/
DecompositionChart.prototype.createSVG = function() {
    var temp = this;
    this.svgContainerId = "svgContainer" + temp.m_objectid;
    $("#" + temp.svgContainerId).remove();
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xlink", "http://www.w3.org/1999/xlink");
    svg.setAttribute("width", this.m_width);
    svg.setAttribute("height", this.m_height);
    svg.setAttribute("id", this.svgContainerId);
    //svg.setAttribute("class", "svg_chart_container");
    $("#draggableDiv" + temp.m_objectid).append(svg);
    this.chartDiv();
};

DecompositionChart.prototype.createChartSVG = function() {
    var temp = this;
    this.chartSvg = "chartSvg" + temp.m_objectid;
    $("#" + temp.chartSvg).remove();
    var svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg1.setAttribute("xlink", "http://www.w3.org/1999/xlink");
    svg1.setAttribute("width", this.m_width);
    svg1.setAttribute("height", this.m_height);
    svg1.setAttribute("id", this.chartSvg);
    $("#chartSvgContainer" + temp.m_objectid).append(svg1);
};

DecompositionChart.prototype.chartDiv = function() {
    var temp = this;
    this.chartSvgContainerId = "chartSvgContainer" + temp.m_objectid;    
    $("#" + temp.chartSvgContainerId).remove();
    var svgdiv = document.createElement("div");
    svgdiv.style.width = this.m_width + "px";
    svgdiv.style.height = this.m_height + "px";   
    svgdiv.style.position = "absolute";
    svgdiv.style.top = this.m_height;
    svgdiv.style.overflow = "auto";
    svgdiv.setAttribute("id", this.chartSvgContainerId);
    //svg.setAttribute("class", "svg_chart_container");
    $("#draggableDiv" + temp.m_objectid).append(svgdiv);
    if(temp.getBgGradients().split(",").length == 1){
    	$("#draggableDiv" + temp.m_objectid).css("background", temp.getBgGradients());
    }else{
    	$("#draggableDiv" + temp.m_objectid).css("background-image","linear-gradient("+temp.m_bggradientrotation+" , "+temp.getBgGradients()+")");
    }  
    this.createChartSVG();
};
/** @description Calculation initialization**/
DecompositionChart.prototype.initializeCalculation = function() {
    var seriesData = this.updateSeriesData(this.visibleSeriesInfo.seriesData);
    var categoryData = this.updateSeriesData(this.m_categoryData);
    this.calculateMinimumMaximum(seriesData);
    this.setChartDrawingArea();
    this.m_calculation.init(this, categoryData, this.visibleSeriesInfo.seriesData);
    this.m_xPositionArray = this.m_calculation.getXPositionArray();
    this.m_yPositionArray = this.m_calculation.getYPositionArray();
    this.m_barWidth = this.m_calculation.getbarWidth();
    this.m_noofseries = this.m_calculation.xAxisData.length;
    this.m_barGap = this.m_calculation.getBarGap();
    this.m_barWidthArray = this.m_calculation.getstackHeightArray();
    if ((IsBoolean(this.getCounterFlagForSeriesVisiblity())) && IsBoolean(this.m_showmarkingorpercentvalue)) {
        this.m_percentageArray = IsBoolean(this.m_showpercentvalue) ? (IsBoolean(this.getCheckedAllPosContainigZero()) ? (this.getPercentage()) : (this.getRoundValue(this.getPercentage(), 100))) : (this.getPercentage());

        //this.m_percentageArray = this.getPercentage();
        this.m_showPerCentageFlag = true;
    } else {
        this.m_percentageArray = this.getArrayWhenPercentFlagIsFalse();
        this.m_seriesInitializeFlag = false;
    }
    this.setColorsForSeries();
    this.initializeBars();
    this.initializeDataLabel();
};

/** @Description calculate the Min/Max value and get required ScaleInfo of The Axis **/
DecompositionChart.prototype.calculateMinimumMaximum = function(seriesdata) {
    //this.xAxisData = this.getVisibleSeriesData(convertArrayType(seriesdata));
    var minMax;
    /** Added for enable common marker for repeater chart */
    var seriesData = (IsBoolean(this.m_isRepeaterPart) && IsBoolean(this.m_parentObj.m_repeatercommonmarker)) ? this.getAllSeriesDataForRepeater() : seriesdata;
    if (this.m_charttype.toLowerCase() == "clustered" || this.m_charttype.toLowerCase() == "overlaid") {
        minMax = this.calculateMinMaxValue(seriesData);
    } else {
        if ((this.m_charttype.toLowerCase() == "stacked") && (seriesdata[0].length === 1)) {
            minMax = this.calculateMinMaxValue((seriesData)); //convertArrayType(seriesdata)
        } else {
            minMax = this.calculateFinalMinMaxValue(seriesdata);
        }
    }

    var calculatedMin = minMax.min;
    var calculatedMax = minMax.max;

    var niceScaleObj = this.getCalculateNiceScale(calculatedMin, calculatedMax, this.m_basezero, this.m_autoaxissetup, this.m_minimumaxisvalue, this.m_maximumaxisvalue, (this.m_width));
    this.min = niceScaleObj.min;
    this.max = niceScaleObj.max;
    this.m_numberOfMarkers = niceScaleObj.markerArray.length;
    this.m_xAxisText = niceScaleObj.step;
    this.m_xAxisMarkersArray = niceScaleObj.markerArray;
};

/** @description calculate max,min from series data*/
DecompositionChart.prototype.calculateFinalMinMaxValue = function(xAxisData) {
    var calculateMax = 0;
    var calculateMin = 0;
    if (this.m_charttype.toLowerCase() == "stacked" || this.m_charttype.toLowerCase() == "") {
        for (var i = 0, length = xAxisData.length; i < length; i++) {
            var height = 0;
            var negheight = 0;
            for (var j = 0, dataLength = xAxisData[i].length; j < dataLength; j++) {
                if (xAxisData[i][j] >= 0) {
                    height = (height * 1) + ((!isNaN(xAxisData[i][j]) ? xAxisData[i][j] : 0) * 1);
                } else {
                    negheight = (negheight * 1) + ((!isNaN(xAxisData[i][j]) ? xAxisData[i][j] : 0) * 1);
                }
            }
            if ((height) >= (calculateMax)) {
                calculateMax = height * 1;
            }
            /**Added for negative values*/
            if ((negheight * 1) < (calculateMin)) {
                calculateMin = negheight * 1;
            }
        }
    } else if (this.m_charttype == "100%") {
        var negFlag = false;
        for (var i = 0, length = xAxisData.length; i < length; i++) {
            for (var j = 0, innerlength = xAxisData[i].length; j < innerlength; j++) {
                if (xAxisData[i][j] < 0) {
                    negFlag = true;
                    break;
                }
            }
        }
        calculateMax = 100;
        calculateMin = (IsBoolean(negFlag)) ? -100 : 0;
    }
    return {
        max: calculateMax,
        min: calculateMin
    };
};

/** @description checking is all series data zero**/
DecompositionChart.prototype.getCheckedAllPosContainigZero = function() {
    var flag = true;
    for (var i = 0, length = this.m_seriesData[this.m_seriesVisiblityPosition].length; i < length; i++) {
        if (this.m_seriesData[this.m_seriesVisiblityPosition][i] != 0)
            flag = false;
    }

    return flag;
};

/** @description get array with 0 values**/
DecompositionChart.prototype.getArrayWhenPercentFlagIsFalse = function() {
    var per = [];
    for (var i = 0, length = this.m_seriesData.length; i < length; i++) {
        per[i] = 0;
    }
    return per;
};

/** @description calculating percentage in between selected series**/
DecompositionChart.prototype.getPercentage = function() {
    var per = [];
    var sumOfSeries = this.getSumOfSeriesData();
    for (var i = 0, length = this.m_seriesData[this.m_seriesVisiblityPosition].length; i < length; i++) {
        if (IsBoolean(this.m_showpercentvalue)) {
            if (this.m_seriesData[this.m_seriesVisiblityPosition][i] > 0)
                per[i] = (this.m_seriesData[this.m_seriesVisiblityPosition][i] / sumOfSeries) * 100;
            else
                per[i] = 0;
            this.m_showPercentValueFlag = true;
        } else
            per[i] = this.m_seriesData[this.m_seriesVisiblityPosition][i];
    }
    return per;

};

/** @description Calculating series data sum**/
DecompositionChart.prototype.getSumOfSeriesData = function() {
    var sum = 0;
    for (var i = 0, length = this.m_seriesData[this.m_seriesVisiblityPosition].length; i < length; i++) {
        if (this.m_seriesData[this.m_seriesVisiblityPosition][i] == "NaN")
            this.m_seriesData[this.m_seriesVisiblityPosition][i] = 0;
        if (this.m_seriesData[this.m_seriesVisiblityPosition][i] > 0)
            sum = sum * 1 + this.m_seriesData[this.m_seriesVisiblityPosition][i] * 1;
    }
    return sum;
};

/** @Description Will return all series data for repeater chart **/
DecompositionChart.prototype.getAllSeriesDataForRepeater = function() {
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
    repeaterSeriesData = this.getUpdateSeriesDataWithCategory(repeaterSeriesData);
    return repeaterSeriesData;
};

/** @description Data Label for BarSeries Initialization**/
DecompositionChart.prototype.initializeDataLabel = function() {
    this.m_valueTextSeries = {};
    for (var k = 0, i1 = 0; i1 < this.m_seriesNames.length; i1++) {
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i1]])) {
            if ((this.m_charttype.toLowerCase() == "overlaid") || IsBoolean(this.m_seriesDataLabelProperty[i1].showDataLabel)) {
                this.m_datalablebackgroundrect = (IsBoolean(this.m_seriesDataLabelProperty[i1].datalabelBackgroundRect)) ? true : this.m_datalablebackgroundrect;
                this.m_valueTextSeries[this.m_seriesNames[i1]] = new ValueTextSeries();
                if ((this.m_charttype == "100%") && (this.m_seriesDataLabelProperty[k].showPercentValue !== undefined) && IsBoolean(this.m_seriesDataLabelProperty[k].showPercentValue)) {
                    this.m_seriesDataForDataLabel[k] = this.getPercentageForHundred()[k];
                }
                var datalabelProp = (this.m_charttype.toLowerCase() == "overlaid") ? this.m_seriesDataLabelPropertyOverlaid[k] : this.m_seriesDataLabelProperty[i1];
                var dataActual = (this.m_charttype.toLowerCase() == "overlaid") ? this.m_actualseriesdatamap[k] : this.m_seriesData[i1];
                this.m_valueTextSeries[this.m_seriesNames[i1]].init(this.m_xPositionArray[k], this.m_yPositionArray[k], this, this.m_seriesDataForDataLabel[k], datalabelProp, dataActual, this.m_barWidth, this.m_barWidthArray[k]);
            };

            k++;
        }
    }
};
/** @description Getter for series color**/
DecompositionChart.prototype.getColorsForSeries = function() {
    return this.m_seriesColorsArray;
};

/** @description Setter for series color**/
DecompositionChart.prototype.setColorsForSeries = function() {
    this.m_seriesColorsArray = [];
    if (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) {
        for (var i = 0, length = this.visibleSeriesInfo.seriesData.length; i < length; i++) {
            this.m_seriesColorsArray[i] = [];
            for (var j = 0, dataLength = this.visibleSeriesInfo.seriesData[i].length; j < dataLength; j++) {
                this.m_seriesColorsArray[i][j] = this.m_drillColor;
            }
        }
    } else if ((this.m_charttype == "overlaid" || this.m_charttype == "Overlaid")) {
        this.m_seriesColorsArray = this.m_calculation.getSeriesColorForOverlaid();
    } else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && this.getCategoryColors().getCategoryColor().length > 0 && IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName())) {
        var categoryColors = this.getCategoryColors().getCategoryColorsForCategoryNames(this.getCategoryData()[0], this.m_categoryFieldColor);
        for (var i = 0, length = this.visibleSeriesInfo.seriesData.length; i < length; i++) {
            this.m_seriesColorsArray[i] = [];
            for (var j = 0, dataLength = this.visibleSeriesInfo.seriesData[i].length; j < dataLength; j++) {
                this.m_seriesColorsArray[i][j] = categoryColors[j];
            }
        }
        //	} else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && !IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName()) && this.getConditionalColors() != "" && this.getConditionalColors() != undefined && this.getConditionalColors().getConditionalColor().length > 0) {
    } else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && (!IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName()) || this.getCategoryColors().getCategoryColor().length == 0) && this.getConditionalColors() != "" && this.getConditionalColors() != undefined && this.getConditionalColors().getConditionalColor().length > 0) {
        var conditionalColors = this.getConditionalColors().getConditionalColorsForConditions(this.visibleSeriesInfo.seriesName, this.visibleSeriesInfo.seriesColor, this.visibleSeriesInfo.seriesData, this);
        for (var i = 0, length = this.visibleSeriesInfo.seriesData.length; i < length; i++) {
            this.m_seriesColorsArray[i] = [];
            for (var j = 0, dataLength = this.visibleSeriesInfo.seriesData[i].length; j < dataLength; j++) {
                this.m_seriesColorsArray[i][j] = conditionalColors[i][j];
            }
        }
    } else {
        var seriesColors = this.visibleSeriesInfo.seriesColor;
        for (var i = 0, length = this.visibleSeriesInfo.seriesData.length; i < length; i++) {
            this.m_seriesColorsArray[i] = [];
            for (var j = 0, dataLength = this.visibleSeriesInfo.seriesData[i].length; j < dataLength; j++) {
                this.m_seriesColorsArray[i][j] = seriesColors[i];
            }
        }
    }
};

/** @description changing the array data order**/
DecompositionChart.prototype.updateSeriesData = function(array) {
    var arr = [];
    if ((array != undefined && array !== null && array !== "") && array.length != 0)
        for (var i = 0, length = array[0].length; i < length; i++) {
            arr[i] = [];
            for (var j = 0, dataLength = array.length; j < dataLength; j++) {
                arr[i][j] = array[j][i];
            }
        }
    return arr;
};

/** @description overrite drawObject Method  because of ChartFrame and Titles are drawn on SVG  **/
DecompositionChart.prototype.drawObject = function() {
    this.drawSVGObject();
};

/** @description drawing of Title**/
DecompositionChart.prototype.drawTitle = function() {
    this.m_title.draw();
};

/** @description drawing of subtitle**/
DecompositionChart.prototype.drawSubTitle = function() {
    this.m_subTitle.draw();
};
/** @description to show loader when click on arrows to show other nodes**/
DecompositionChart.prototype.drawLoaderIcon = function(x, y) {
	var temp = this;
	var image = document.createElement("div");
	image.setAttribute("id", "dcloaderImage" + temp.m_objectid);
	image.setAttribute("class", "loaderImage");
	$("#chartSvgContainer" + temp.m_objectid).append(image);
	$("#dcloaderImage" + temp.m_objectid).css({
		"z-index": (temp.m_zIndex + 2),
		"left": x + "px",
		"top": y + "px"
	}).on("click", function() {
		$("#loaderImageContent" + temp.m_objectid).toggle("slide", {
			direction: "up"
		}, 200);
		$("#loaderImageContentArrow" + temp.m_objectid).toggle();
	}).append('<div style="position:absolute;height:100%;width:100%;left:0px;top:0px;" class="la-ball-clip-rotate la-dark la-lg loaderImageRotation"><div style="border-width:2px;height:80%;width:80%;"></div></div>');
	$("#dcloaderImage" + temp.m_objectid).show();
};
/** @description set height and width of svg**/
DecompositionChart.prototype.setSVGDimension = function() {
	//var ht = (this.getTitleBarHeight() * 1) + (IsBoolean(this.m_subTitle.m_showsubtitle) ? this.m_subTitle.m_subtitleText.getBBox().height * 1 + this.m_subTitle.m_titleMargin : 0);
	var ht = this.m_subTitle.m_titleMargin + (IsBoolean(this.m_subTitle.m_showsubtitle) ? this.m_subTitle.m_subtitleText != undefined ? this.m_subTitle.m_subtitleText.getBBox().height * 1  : this.m_subTitle.m_subTitleBarHeight*1 : 0);
	//$("#" + this.svgContainerId).css("height", ht+"px");
	$("#GradientRect" + this.m_objectid).css("height", ht+"px");
    $("#" + this.chartSvgContainerId).css("top", ht+"px");
    $("#" + this.chartSvgContainerId).css("height", this.m_height-ht + "px");
    $("#" + this.chartSvg).css("height", this.m_height-ht-10 + "px");
}
/** @description drawing of chart frame**/
DecompositionChart.prototype.drawChartFrame = function() {
    this.m_chartFrame.drawSVGFrame();
    this.getBGGradientColorToContainer();
};

/** @description Will generate the gradient and fill in background of chart  **/
DecompositionChart.prototype.getBGGradientColorToContainer = function() {
    var temp = this;
    // code for creating shadow of strokeline width
    var defsElement = document.createElementNS('http://www.w3.org/2000/svg', "defs");
    var filterElement = document.createElementNS(NS, "filter");
    filterElement.setAttribute("id", "stackShadow" + temp.m_objectid);
    // offset is the element we're going to use to create the dropshadow.
    // we want drop shadow directly underneath element offset is 0,0
    var feOffset = document.createElementNS(NS, "feOffset");
    feOffset.setAttribute("dx", "0");
    feOffset.setAttribute("dy", "0");
    feOffset.setAttribute("result", "offOut");
    feOffset.setAttribute("in", "SourceGraphic");
    var feGaussianBlur = document.createElementNS(NS, "feGaussianBlur");
    feGaussianBlur.setAttribute("result", "blurOut");
    feGaussianBlur.setAttribute("in", "offOut");
    feGaussianBlur.setAttribute("stdDeviation", "1");
    var feColorMatrix = document.createElementNS(NS, "feColorMatrix");
    feColorMatrix.setAttribute("in", "blurOut");
    feColorMatrix.setAttribute("result", "color-out");
    feColorMatrix.setAttribute("type", "matrix");
    feColorMatrix.setAttribute("values", hex2Matrix(this.m_stackshadowcolor, this.m_stackshadowopacity));
    var feBlend = document.createElementNS(NS, "feBlend");
    feBlend.setAttribute("in", "SourceGraphic");
    feBlend.setAttribute("in2", "color-out");
    feBlend.setAttribute("mode", "normal");
    filterElement.appendChild(feOffset);
    filterElement.appendChild(feGaussianBlur);
    filterElement.appendChild(feColorMatrix);
    filterElement.appendChild(feBlend);
    defsElement.appendChild(filterElement);
    $("#" + temp.svgContainerId).append(defsElement);
};

/** @description drawing Data Label on bar chart**/
DecompositionChart.prototype.drawDataLabel = function() {
    for (var i = 0, length = this.m_seriesNames.length; i < length; i++) {
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
            var valueText = this.m_valueTextSeries[this.m_seriesNames[i]];
            if ((this.m_charttype.toLowerCase() == "overlaid") || IsBoolean(this.m_seriesDataLabelProperty[i].showDataLabel)) {
                this.createDataLabelGroup(valueText, 'datalabelgrp', i, this.m_seriesNames[i]);
                valueText.drawValueTextSeries();
            }
        }
    }
};

/*@description DAS-514 added below method create cross icon through svg line elements */
DecompositionChart.prototype.drawSVGCross = function (x1, y1, fontsize, xAttribute, yAttribute, first, second, strokeColor, id) {	
	var temp = this;
	var line1 = this.drawSVGLine(x1,y1,x1+fontsize,y1+fontsize, xAttribute, yAttribute, first, second, strokeColor, "1");	
	var line2 = this.drawSVGLine(x1+fontsize,y1,x1,y1+fontsize, xAttribute, yAttribute, first, second, strokeColor, "1");
	var crossrect = drawSVGRect(x1, y1, fontsize, fontsize, this.m_fillcolor);
	crossrect.setAttributeNS(null, "fill-opacity", "0");
    	
	var crossgroup = this.createStackGroup("", "crossgroup" + id, "", "Group");
	$("#crossgroup" + id + this.m_objectid).append(line1, line2, crossrect);
	$("#crossgroup" + id + this.m_objectid).on("click", function(evt) {
		evt.preventDefault();
	    evt.stopPropagation();
	    var val = this.id.split("crossgroup")[1].split(temp.m_objectid)[0];
	    var ind = temp.m_contextseriesfields.indexOf(val);
	    if (temp.uparrow != undefined) {
	    	temp.updateArrowInfo(val);
	    }
	    temp.m_contextseriesfields.splice(ind,1);
	    //temp.m_seriesfields = Array.from(temp.m_contextseriesfields);
	    var tempseriesnames = Array.from(temp.m_seriesDNames);
	    var hierarchylevel = {};
	    var seriesfields = Array.from(temp.m_contextseriesfields);
	    var seriesDfields = Array.from(temp.m_seriesNames);
	    var indval = temp.m_contextseriesfields.length - 1;
	    //seriesfields.splice(indval,1)
	    seriesfields.map(function(ele, k ){
			tempseriesnames.splice(seriesDfields.indexOf(ele),1);
			seriesDfields.splice(seriesDfields.indexOf(ele),1);
			hierarchylevel[ele] = {};
			hierarchylevel[ele]["levels"] = Array.from(tempseriesnames);
			hierarchylevel[ele]['id'] = (temp.m_updatedhierarchylevel[ele] == undefined) ? undefined : temp.m_updatedhierarchylevel[ele]['id'];
			hierarchylevel[ele]['nodeid'] = (temp.m_updatedhierarchylevel[ele] == undefined) ? undefined : temp.m_updatedhierarchylevel[ele]['nodeid'];
		});
		temp.m_updatedhierarchylevel = hierarchylevel;
		$("#contexleveldiv").remove();
		if(temp.m_seriesfields.length == 0){
			var m_seriesfields = Array.from(temp.m_seriesfields);
			m_seriesfields.push(temp.m_seriesNames[0]);
			temp.m_seriesfields = m_seriesfields;
			temp.m_contexthierarchy = undefined
		}
        temp.init();
        temp.drawChart(); 	
    })
	return crossgroup;
};
/*@description DAS-607 added below method to create arrow icon through svg line elements */
DecompositionChart.prototype.drawSVGArrow = function(x1, y1, fontsize, xAttribute, yAttribute, first, second, strokeColor, id, strokeWidth, size) {
    var temp = this;    
    var arrowgroup = this.createStackGroup("", "arrowgroup" + id, "", "Group");
    var strokecolor = strokeColor != "" ? strokeColor : this.m_fillcolor;
   
    if (this.uparrow[temp.m_childdata[id].parentid] == undefined || !IsBoolean(this.lastLevel[temp.m_childdata[id].parentid])) {  	
    	var uline1 = this.drawSVGLine(x1-(size*1), y1, x1 , y1+(size*1), xAttribute, yAttribute, first, second, strokecolor, strokeWidth);
        var uline2 = this.drawSVGLine(x1, y1+(size*1), x1+(size*1), y1, xAttribute, yAttribute, first, second, strokecolor, strokeWidth);
        var uarrowrect = drawSVGRect(x1-(size*1)-5, y1-5, (size*2)+10, (size*1)+10, this.m_fillcolor);
        uarrowrect.setAttributeNS(null, "fill-opacity", "0");
        var uparrowgroup = this.createStackGroup("", "uparrowgroup" + id, "", "Group");
        $("#uparrowgroup" + id + this.m_objectid).append(uline1, uline2, uarrowrect);
        $("#arrowgroup" + id + this.m_objectid).append($("#uparrowgroup" + id + this.m_objectid));
    }

    if (temp.uparrow[temp.m_childdata[id].parentid] > 0) {
    	var y = this.arrowmargin;
        var dline1 = this.drawSVGLine(x1-(size*1), y, x1, y-(size*1), xAttribute, yAttribute, first, second, strokecolor, strokeWidth);
        var dline2 = this.drawSVGLine(x1, y-(size*1), x1+(size*1), y, xAttribute, yAttribute, first, second, strokecolor, strokeWidth);
        var darrowrect = drawSVGRect(x1-(size*1)-5, y-(size*1)-5, (size*2)+10, (size*1)+10, this.m_fillcolor);
        darrowrect.setAttributeNS(null, "fill-opacity", "0");
        var downarrowgroup = this.createStackGroup("", "downarrowgroup" + id, "", "Group");
        $("#downarrowgroup" + id + this.m_objectid).append(dline1, dline2, darrowrect);
        $("#arrowgroup" + id + this.m_objectid).append($("#downarrowgroup" + id + this.m_objectid));
    }
    $("#uparrowgroup" + id + this.m_objectid).on("click", function(evt) {
     	evt.preventDefault();
     	evt.stopPropagation();
     	temp.arrowclicked = "true";
     	var val = this.id.split("arrowgroup")[1].split(temp.m_objectid)[0];
     	if (IsBoolean(temp.m_showcontextlevels) && temp.m_childdata[val].childfieldname != "") {
     		temp.updateArrowInfo(temp.m_childdata[val].childfieldname);
     	}
     	if (temp.uparrow[temp.m_childdata[val].parentid] != undefined) {
     		temp.uparrow[temp.m_childdata[val].parentid] = temp.uparrow[temp.m_childdata[val].parentid] + 1;
     	} else {
     		temp.uparrow[temp.m_childdata[val].parentid] = 1;
     	}
     	// temp.m_drawnode = {};
     	// temp.m_drawnode[temp.m_childdata[val].parent] = temp.m_childdata[temp.m_childdata[val].parentid].nodeName;
     	var index = Object.keys(temp.m_drawnode).indexOf(temp.m_childdata[val].fieldName);
     	if (index !== -1) {
     		var keysToRemove = Object.keys(temp.m_drawnode).slice(index);
     		keysToRemove.forEach(function(key) {
     			delete temp.m_drawnode[key];
     		});
     	}
     	temp.drawLoaderIcon($(this)[0].childNodes[1].getBBox().x, $(this)[0].childNodes[1].getBBox().y);
     	$(this).remove();
     	setTimeout(function() {
     		temp.init();
     		temp.drawChart();
     	}, 100)
     });
     $("#downarrowgroup" + id + this.m_objectid).on("click", function(evt) {
     	evt.preventDefault();
     	evt.stopPropagation();
     	temp.arrowclicked = "true";
     	var val = this.id.split("arrowgroup")[1].split(temp.m_objectid)[0];
     	if (temp.uparrow[temp.m_childdata[val].parentid] != undefined) {
     		temp.uparrow[temp.m_childdata[val].parentid] = temp.uparrow[temp.m_childdata[val].parentid] - 1;
     	}
     	var index = Object.keys(temp.m_drawnode).indexOf(temp.m_childdata[val].fieldName);
     	if (index !== -1) {
     		var keysToRemove = Object.keys(temp.m_drawnode).slice(index);
     		keysToRemove.forEach(function(key) {
     			delete temp.m_drawnode[key];
     		});
     	}
     	temp.drawLoaderIcon($(this)[0].childNodes[1].getBBox().x, $(this)[0].childNodes[1].getBBox().y);
     	$(this).remove();
     	setTimeout(function() {
     		temp.init();
     		temp.drawChart();
     	}, 100)
     });
    return arrowgroup;
};
DecompositionChart.prototype.drawSVGLine = function (x1, y1, x2, y2, xAttribute, yAttribute, first, second, strokeColor, strokeWidth) {	
	var line = document.createElementNS(NS, "line");	
	//this.DTGROUP.appendChild(line);	
	line.style.stroke = strokeColor;	
	line.style.opacity = 1;	
	line.setAttribute("stroke-width", strokeWidth);	
	line.setAttribute(xAttribute + first, x1 + "px");	
	line.setAttribute(yAttribute + first, y1 + "px");	
	line.setAttribute(xAttribute + second, x2 + "px");	
	line.setAttribute(yAttribute + second, y2 + "px");	
//	line.setAttribute("marker-end", "url(#arrowHead)");	
	return line;	
};
DecompositionChart.prototype.drawSVGText = function (word, x, y, w, h, labellinespacing, xAttribute, yAttribute, textStrokeColor, textAnchor, fontWeight, fontSize, fontFamily, fontStyle, id, dy) {
	var text = document.createElementNS(NS, "text");
	//this.DTGROUP.appendChild(text);
	text.setAttribute("text-anchor", textAnchor);
	text.setAttribute("fill", textStrokeColor);
	text.setAttribute("font-size", fontSize + "px");
	text.setAttribute("font-weight", fontWeight);
	text.setAttribute("font-family", selectGlobalFont(fontFamily));
	text.setAttribute("font-style", fontStyle);
	text.setAttribute("stroke-width", 0.1);
	text.setAttribute("alignment-baseline", "baseline");
	text.setAttribute(xAttribute, x + "px");
	text.setAttribute(yAttribute, y + "px");
	if(id !== undefined){
		text.setAttribute("id", id);
	}	
	if(dy!==undefined){
		this.getLayoutText(text, word, x, w, h, labellinespacing, dy);
	} else {
		this.getLayoutText(text, word, x, w, h, labellinespacing);
	}
	return text;
};
DecompositionChart.prototype.getLayoutText = function (textNode, word, x, width, height, labellinespacing, dy) {
	var newText = word;
	var tspan = document.createElementNS(NS, "tspan");
	tspan.setAttributeNS(null, "x", x);
	if(dy!==undefined){
		tspan.setAttributeNS(null, "dy", dy);
	}
	tspan.setAttribute("title", word);
	textNode.appendChild(tspan);
	tspan.textContent = "..";
	var dotWidth = tspan.getComputedTextLength();
	tspan.textContent = word;
	var newTextLength = tspan.getComputedTextLength();
	while ((newTextLength > (width - dotWidth))) {
		newText = newText.slice(0, -1);
		tspan.textContent = newText;
		newTextLength = tspan.getComputedTextLength();
	}
	if (newText != word)
		newText += "..";
	else
		newText = word;
	tspan.textContent = newText;
};
/** @description Get Sum of Array**/
DecompositionChart.prototype.getArraySUM = function(arr) {
    var sum = 0;
    for (var i = 0, length = arr.length; i < length; i++) {
        if (arr[i] < 0)
            arr[i] = arr[i] * (-1);
        if (!isNaN(arr[i]))
            sum = sum * 1 + arr[i] * 1;
    }
    return sum;
};

/** @description Get Update Series Data With Category**/
DecompositionChart.prototype.getUpdateSeriesDataWithCategory = function(arr) {
    var updateArray = [];
    for (var i = 0, length = arr[0].length; i < length; i++) {
        updateArray[i] = [];
        for (var j = 0, dataLength = arr.length; j < dataLength; j++) {
            updateArray[i][j] = arr[j][i];
        }
    }
    return updateArray;
};

/** @description Calaculated Sum of Data and Percentage of Data from total sum of data **/
DecompositionChart.prototype.setPercentageForHundred = function() {
    var serData = this.getUpdateSeriesDataWithCategory(this.visibleSeriesInfo.seriesData);
    this.m_SeriesDataInPerForHundredChart;
    var updateValue = [];
    for (var i = 0, length = serData.length; i < length; i++) {
        var totalSerData = this.getArraySUM(serData[i]);
        updateValue[i] = [];
        for (var j = 0, dataLength = serData[i].length; j < dataLength; j++) {
            if (serData[i][j] !== "" && (!isNaN(serData[i][j])))
                updateValue[i][j] = (serData[i][j] / totalSerData) * 100;
            else
                updateValue[i][j] = 0;
        }
    }
    if (updateValue.length > 0)
        this.m_SeriesDataInPerForHundredChart = this.getUpdateSeriesDataForHundredPercentageChart(updateValue);
};

/** @description Changing Array Data sequence for Hundred Percent Chart **/
DecompositionChart.prototype.getUpdateSeriesDataForHundredPercentageChart = function(arr) {
    var updatArray = [];
    for (var i = 0, length = arr[0].length; i < length; i++) {
        updatArray[i] = [];
        for (var j = 0, dataLength = arr.length; j < dataLength; j++) {
            updatArray[i][j] = arr[j][i];
        }
    }
    /**Added for updating updatArray for negative values*/
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

/** @description Get percentage of data from total data**/
DecompositionChart.prototype.getPercentageForHundred = function() {
    return this.m_SeriesDataInPerForHundredChart;
};
DecompositionChart.prototype.getVisibleActualSeriesData = function() {
    var seriesData = [];
    for (var k = 0, i1 = 0; this.m_seriesData.length > i1; i1++) {
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i1]])) {
            seriesData[k] = [];
            seriesData[k] = this.m_seriesDataForToolTip[i1];
            k++;
        }
    }
    return seriesData;
};

/** @description Creation of ToolTip Data**/
DecompositionChart.prototype.getToolTipData = function(mouseX, mouseY) {
    var toolTipData;
    if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory) && IsBoolean(this.isVisibleSeries()) && IsBoolean(this.m_customtextboxfortooltip.dataTipType !== "None")) {
        var totalbarWidth = (this.m_charttype == "clustered") ? this.m_barWidth * this.m_yPositionArray.length : this.m_barWidth;
        var isNaNValue;
        var newVal = "";
        if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
            var seriesData = this.getVisibleActualSeriesData();
            this.yPositions = this.m_calculation.getYPositionforToolTip();
            var percentageData = this.getPercentageForHundred();
            for (var i = 0, length = this.yPositions.length; i < length; i++) {
                if (mouseY <= (this.yPositions[i] * 1 + totalbarWidth * 1) && (mouseY >= this.yPositions[i] * 1)) {
                    toolTipData = {};
                    toolTipData.cat = "";
                    toolTipData["data"] = new Array();
                    toolTipData.cat = this.getCategoryData()[0][i];
                    if (this.m_customtextboxfortooltip.dataTipType == "Default") {
                        for (var j = 0, k = 0, datalength = seriesData.length; j < datalength; j++) {
                            isNaNValue = false;
                            var data = [];
                            data[0] = {
                                "shape": this.legendMap[this.getSeriesNames()[j]].shape
                            };
                            /*Added to show drill color or indicator color in the tooltip*/
                            if (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) {
                                data[0]["color"] = (this.m_charttype != "overlaid") ? this.getColorsForSeries()[j][i] : this.m_drillColor;
                            } else {
                                data[0]["color"] = (this.m_charttype != "overlaid") ? this.getColorsForSeries()[j][i] : this.visibleSeriesInfo.seriesColor[j];
                            }
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
                                if (this.m_tooltipproperties.tooltippercentprecision == "auto") {
                                    if (countDecimal((percentageData[j][i]).toString()) == 0) {
                                        data[3] = (percentageData[j][i]) + "%";
                                    } else {
                                        data[3] = (percentageData[j][i]).toFixed(2);
                                        if (data[3] % 1 == 0) {
                                            data[3] = (data[3] * 1).toFixed() + "%";
                                        } else {
                                            data[3] = data[3] + "%";
                                        }
                                    }
                                } else {
                                    data[3] = (percentageData[j][i]).toFixed(this.m_tooltipproperties.tooltippercentprecision) + "%";
                                }
                                var cumSum = 0;
                                for (var m = 0; m <= j; m++) {
                                    if (!isNaN(seriesData[m][i]))
                                        cumSum += seriesData[m][i] * 1;
                                }
                                /** ADDING CUMULATIVE PERCENTAGE FOR 100% chart **/
                                var cumpec = 0;
                                for (var n = 0; n <= j; n++) {
                                    if (!isNaN(percentageData[n][i]))
                                        cumpec += (percentageData[n][i]);
                                }

                                if (IsBoolean(this.m_tooltipproperties.showcummulativesum)) {
                                    data[4] = this.getNumberWithCommas(cumSum);
                                }
                                if (IsBoolean(this.m_tooltipproperties.showcummulativepercent)) {
                                    data[5] = cumpec.toFixed(2) + "%";
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

/** @description Get Drill Color**/
DecompositionChart.prototype.getDrillColor = function(mouseX, mouseY) {
    if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory)))) {
        this.xPositionArr = this.m_calculation.getXPositionArray();
        this.yAxisDataArray = this.m_calculation.getYPositionArray();
        this.m_barWidthArray = this.m_calculation.getstackHeightArray();

        if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
            var barWidth;
            /**Added to resolve BDD-682 issue*/
            var drillMinStackHeight = (this.m_charttype == "stacked") ? 0 : this.m_drillminstackheight;
            if (IsBoolean(this.m_basezero)) {
                var seriesData = this.getVisibleActualSeriesData();
            }
            if (this.m_charttype != "overlaid") {
                for (var i = 0, length = this.yAxisDataArray.length; i < length; i++) {
                    for (var j = 0, datalength = this.yAxisDataArray[i].length; j < datalength; j++) {
                        if (this.m_barWidthArray[i][j] * 1 < 0) {
                            barWidth = (this.m_barWidthArray[i][j] * 1 < -drillMinStackHeight) ? this.m_barWidthArray[i][j] * 1 : -drillMinStackHeight;
                            var range1 = this.xPositionArr[i][j] * 1;
                            var range2 = this.xPositionArr[i][j] * 1 + barWidth
                        } else {
                            barWidth = (IsBoolean(this.m_basezero) && (seriesData[i][j] * 1 < 0)) ? 0 : (this.m_barWidthArray[i][j] * 1 > drillMinStackHeight) ? this.m_barWidthArray[i][j] * 1 : drillMinStackHeight;
                            var range1 = this.xPositionArr[i][j] * 1 + barWidth;
                            var range2 = this.xPositionArr[i][j] * 1;
                        }
                        if (mouseX <= range1 && mouseX >= range2 && mouseY <= (this.yAxisDataArray[i][j] * 1 + this.m_barWidth * 1) && (mouseY >= this.yAxisDataArray[i][j] * 1)) {
                            return i;
                        }
                    }
                }
            } else {
                for (var i = this.yAxisDataArray.length - 1; i >= 0; i--) {
                    for (var j = this.yAxisDataArray[i].length - 1; j >= 0; j--) {
                        if (this.m_barWidthArray[i][j] * 1 < 0) {
                            barWidth = (this.m_barWidthArray[i][j] * 1 < -drillMinStackHeight) ? this.m_barWidthArray[i][j] * 1 : -drillMinStackHeight;
                            var range1 = this.xPositionArr[i][j] * 1;
                            var range2 = this.xPositionArr[i][j] * 1 + barWidth
                        } else {
                            barWidth = (IsBoolean(this.m_basezero) && (seriesData[i][j] * 1 < 0)) ? 0 : (this.m_barWidthArray[i][j] * 1 > drillMinStackHeight) ? this.m_barWidthArray[i][j] * 1 : drillMinStackHeight;
                            var range1 = this.xPositionArr[i][j] * 1 + barWidth;
                            var range2 = this.xPositionArr[i][j] * 1;
                        }
                        if (mouseX <= range1 && mouseX >= range2 && mouseY <= (this.yAxisDataArray[i][j] * 1 + this.m_barWidth * 1) && (mouseY >= this.yAxisDataArray[i][j] * 1)) {
                            return this.m_calculation.m_originalindexforoverlaiddata[2][i][j];
                        }
                    }
                }
            }
        }
    }
};

/** @description Drilled Bar Data points**/
DecompositionChart.prototype.getDrillDataPoints = function(mouseX, mouseY) {
    if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory))) && IsBoolean(this.isVisibleSeries())) {
        this.xPositionArr = this.m_calculation.getXPositionArray();
        this.yAxisDataArray = this.m_calculation.getYPositionArray();
        this.m_barWidthArray = this.m_calculation.getstackHeightArray();

        if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
            var barWidth;
            var isDrillIndexFound = false;
            var drillMinStackHeight = (this.m_charttype == "stacked") ? 0 : this.m_drillminstackheight;
            if (IsBoolean(this.m_basezero)) {
                var seriesData = this.getVisibleActualSeriesData();
            }
            if (this.m_charttype != "overlaid") {
                for (var i = 0, length = this.yAxisDataArray.length; i < length; i++) {
                    for (var j = 0, dataLength = this.yAxisDataArray[i].length; j < dataLength; j++) {
                        if (this.m_barWidthArray[i][j] * 1 < 0) {
                            barWidth = (this.m_barWidthArray[i][j] * 1 < -drillMinStackHeight) ? this.m_barWidthArray[i][j] * 1 : -drillMinStackHeight;
                            var range1 = this.xPositionArr[i][j] * 1;
                            var range2 = this.xPositionArr[i][j] * 1 + barWidth;
                        } else {
                            barWidth = (IsBoolean(this.m_basezero) && (seriesData[i][j] * 1 < 0)) ? 0 : (this.m_barWidthArray[i][j] * 1 > drillMinStackHeight) ? this.m_barWidthArray[i][j] * 1 : drillMinStackHeight;
                            var range1 = this.xPositionArr[i][j] * 1 + barWidth;
                            var range2 = this.xPositionArr[i][j] * 1;
                        }
                        if (mouseX <= range1 && mouseX >= range2 && mouseY <= (this.yAxisDataArray[i][j] * 1 + this.m_barWidth * 1) && (mouseY >= this.yAxisDataArray[i][j] * 1)) {
                            var fieldNameValueMap = this.getFieldNameValueMap(j);
                            /**Clicked color drills as the drill-color not series color.*/
                            var drillColor = this.getColorsForSeries()[i][j];
                            var drillField = this.visibleSeriesInfo.seriesName[i];
                            var drillDisplayField = this.visibleSeriesInfo.seriesDisplayName[i];
                            var drillValue = fieldNameValueMap[drillField];
                            fieldNameValueMap.drillField = drillField;
                            fieldNameValueMap.drillDisplayField = drillDisplayField;
                            fieldNameValueMap.drillValue = drillValue;

                            isDrillIndexFound = true;
                            fieldNameValueMap.drillIndex = j;
                            var drillCategory = this.m_categoryNames;
                            var drillCategoriesValue = []
                            for (var j = 0; j < drillCategory.length; j++) {
                                drillCategoriesValue.push(fieldNameValueMap[drillCategory[j]]);
                            }
                            fieldNameValueMap.drillCategoryNames = drillCategory;
                            fieldNameValueMap.drillCategory = drillCategoriesValue;
                            if (IsBoolean(this.m_drilltoggle)) {
                                this.m_drilltoggle = false;
                            } else {
                                this.m_drilltoggle = true;
                            }

                            return {
                                "drillRecord": fieldNameValueMap,
                                "drillColor": drillColor
                            };
                        }
                    }
                }
                if (this.m_charttype == "stacked" && !isDrillIndexFound) {
                    for (var k = 0, length = this.yPositions.length; k < length; k++) {
                        if (mouseY <= (this.yPositions[k] * 1 + this.m_barWidth * 1) && (mouseY >= this.yPositions[k] * 1)) {
                            for (var l = 0, innerlength = this.xPositionArr.length; l < innerlength; l++) {
                                if (((mouseX >= this.xPositionArr[l][k]) && (mouseX <= this.xPositionArr[l][k] + this.m_drillminstackheight)) || ((mouseX <= this.xPositionArr[l][k] + this.m_barWidthArray[l][k]) && (mouseX >= this.xPositionArr[l][k] - this.m_drillminstackheight))) {
                                    var fieldNameValueMap = this.getFieldNameValueMap(k);
                                    var drillColor = this.m_drillColor;
                                    var drillField = "";
                                    var drillDisplayField = "";
                                    var drillValue = "";
                                    fieldNameValueMap.drillField = drillField;
                                    fieldNameValueMap.drillDisplayField = drillDisplayField;
                                    fieldNameValueMap.drillValue = drillValue;
                                    isDrillIndexFound = true;
                                    return {
                                        "drillRecord": fieldNameValueMap,
                                        "drillColor": drillColor
                                    };
                                }
                            }
                        }
                    }
                }
            } else {
                for (var i = this.yAxisDataArray.length - 1; i >= 0; i--) {
                    for (var j = this.yAxisDataArray[i].length - 1; j >= 0; j--) {
                        if (this.m_barWidthArray[i][j] * 1 < 0) {
                            barWidth = (this.m_barWidthArray[i][j] * 1 < -drillMinStackHeight) ? this.m_barWidthArray[i][j] * 1 : -drillMinStackHeight;
                            var range1 = this.xPositionArr[i][j] * 1;
                            var range2 = this.xPositionArr[i][j] * 1 + barWidth;
                        } else {
                            barWidth = (IsBoolean(this.m_basezero) && (seriesData[i][j] * 1 < 0)) ? 0 : (this.m_barWidthArray[i][j] * 1 > drillMinStackHeight) ? this.m_barWidthArray[i][j] * 1 : drillMinStackHeight;
                            var range1 = this.xPositionArr[i][j] * 1 + barWidth;
                            var range2 = this.xPositionArr[i][j] * 1;
                        }
                        if (mouseX <= range1 && mouseX >= range2 && mouseY <= (this.yAxisDataArray[i][j] * 1 + this.m_barWidth * 1) && (mouseY >= this.yAxisDataArray[i][j] * 1)) {
                            var fieldNameValueMap = this.getFieldNameValueMap(j);
                            /**Clicked color drills as the drill-color not series color.*/
                            var drillColor = this.getColorsForSeries()[i][j];
                            var drillField = this.visibleSeriesInfo.seriesName[this.m_calculation.m_originalindexforoverlaiddata[2][i][j]];
                            var drillDisplayField = this.visibleSeriesInfo.seriesDisplayName[this.m_calculation.m_originalindexforoverlaiddata[2][i][j]];
                            var drillValue = fieldNameValueMap[drillField];
                            fieldNameValueMap.drillField = drillField;
                            fieldNameValueMap.drillDisplayField = drillDisplayField;
                            fieldNameValueMap.drillValue = drillValue;
                            fieldNameValueMap.drillIndex = j;
                            if (IsBoolean(this.m_drilltoggle)) {
                                this.m_drilltoggle = false;
                            } else {
                                this.m_drilltoggle = true;
                            }
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
DecompositionChart.prototype.setLineAnimation = function(path) {
    path.style.strokeDashoffset = '0';
    var length = path.getTotalLength();
    var duration = "0.5";
    path.style.transition = path.style.WebkitTransition = 'none';
    var dashArray = path.style.strokeDasharray || path.getAttribute("stroke-dasharray");
    if (dashArray != '') {
        var dashLength = dashArray.split(/[\s,]/).map(function(a) {
            return parseFloat(a) || 0
        }).reduce(function(a, b) {
            return a + b
        })
        var dashCount = length / dashLength;
        var a = new Array(Math.ceil(dashCount)).join(dashArray + " ")
        path.style.strokeDasharray = a + '0, ' + dashLength;
        path.style.strokeDashoffset = dashLength * dashLength;
        path.getBoundingClientRect();
        path.style.transition = path.style.WebkitTransition =
            'stroke-dashoffset ' + duration + 's linear';
        path.style.strokeDashoffset = "0";
    } else {
        path.style.strokeDasharray = length + " " + length;
        path.style.strokeDashoffset = length;
        path.getBoundingClientRect();
        path.style.transitionDelay = "0.2s";
        path.style.transition = path.style.WebkitTransition =
            'stroke-dashoffset ' + duration + 's linear';
        path.style.strokeDashoffset = "0";
    }
};

function DSLineSeries() {
    this.color;
    this.width;
    this.xPositionArray = [];
    this.yPositionArray = [];
    this.line = [];
    this.ctx = "";
    this.m_chart = "";
    this.seriesName = "";
    this.basePoint = "";
};
/** @description initialize SVGLineSeries with their properties. **/
DSLineSeries.prototype.init = function(color, xPositionArray, yPositionArray, width, m_chart, plotTrasparency, seriesName, lineWidth, lineType, fillTrasparency) {
    this.m_chart = m_chart;
    this.seriesName = seriesName;
    this.ctx = this.m_chart.ctx;
    this.color = color;
    this.width = width;
    this.xPositionArray = xPositionArray;
    this.yPositionArray = yPositionArray;
    this.plotTrasparency = plotTrasparency;
    this.fillTrasparency = fillTrasparency;
    this.lineWidth = lineWidth;
    this.lineType = lineType;
    var seriesInfo = this.m_chart.getSeriesInfo(this.seriesName);
    var AxisInfo = (seriesInfo.axis == "left") ? this.m_chart.leftAxisInfo : this.m_chart.rightAxisInfo;
    this.basePoint = this.getBasePoint(AxisInfo);
};
/** @description will return basepoint value.  **/
DSLineSeries.prototype.getBasePoint = function(AxisInfo) {
    var basePoint;
    if (AxisInfo.min < 0 && AxisInfo.max < 0) {
        basePoint = this.m_chart.getEndY();
    } else if (AxisInfo.min < 0 && AxisInfo.max > 0) {
        basePoint = this.m_chart.getStartY() - Math.abs((this.m_chart.getStartY() - this.m_chart.getEndY()) / (AxisInfo.max - AxisInfo.min) * AxisInfo.min);
    } else {
        basePoint = this.m_chart.getStartY();
    }
    return basePoint;
};
/** @description will draw LineSeries according to lineform.  **/
DSLineSeries.prototype.drawLineSeries = function(i) {
    if (this.m_chart.m_lineform == "curve" && this.xPositionArray.length < 500) {
        if (IsBoolean(this.m_chart.m_fillarea) && (this.m_chart.getSeriesFillAreaMap()[this.m_chart.getSeriesNames()[i]])) {
            this.drawSplinesArea(i);
        } else {
            this.drawSplines(i);
        }
    } else {
        if (IsBoolean(this.m_chart.m_fillarea) && (this.m_chart.getSeriesFillAreaMap()[this.m_chart.getSeriesNames()[i]])) {
            this.drawSegmentArea(i);
        } else {
            this.drawSegmentLines(i);
        }
    }
};
/** @description will create and return  Bezier path.  **/
DSLineSeries.prototype.createBezierPathArea = function(x1, y1, px1, py1, px2, py2, x2, y2, index, startY, last) {
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

/** @description will drawn segment line and fill area.  **/
DSLineSeries.prototype.drawSegmentArea = function(index) {
    var temp = this;
    var x_pixel = this.xPositionArray;
    var y_pixel = this.yPositionArray;
    var id = (!temp.m_chart.scaleFlag) ? "#linestackgrp" + index + temp.m_chart.m_objectid : "#linegrpslider" + index + temp.m_chart.m_objectid;
    /*clip fillArea path which is drawing out of chart drawing area*/
    this.clipFillArea();

    var path = this.getAreaPath(x_pixel, y_pixel, temp.basePoint); // also need to set fill css
    var strokeDashArray = this.getLineDashArray(this.lineType, this.lineWidth);
    for (var j = 0; j < path.length; j++) {
        var newLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
        newLine.setAttribute("d", path[j]);
        newLine.setAttribute("clip-path", "url(#clipPath" + temp.m_chart.m_objectid + ")");
        newLine.setAttribute("stroke-dasharray", strokeDashArray);
        newLine.setAttribute("style", "stroke:" + temp.color[0] + "; stroke-width:" + temp.lineWidth + ";fill:" + hex2rgb(temp.m_chart.m_fillareacolor, this.fillTrasparency) + ";");
        $(id).append(newLine);
    }
};
/** @description will drawn segment line .  **/
DSLineSeries.prototype.drawSegmentLines = function(index) {
    var temp = this;
    var x_pixel = this.xPositionArray;
    var y_pixel = this.yPositionArray;
    var id = (!temp.m_chart.scaleFlag) ? "#linestackgrp" + index + temp.m_chart.m_objectid : "#linegrpslider" + index + temp.m_chart.m_objectid;

    var path = this.pathString(x_pixel, y_pixel, temp.m_chart.getStartY(), temp.m_chart.getEndY());
    var path1 = (IsBoolean(this.m_chart.m_continuousline)) ? this.pathStringContinuous(x_pixel, y_pixel, temp.m_chart.getStartY(), temp.m_chart.getEndY()) : undefined;
    if (path != undefined && path != "") {
        var strokeDashArray = this.getLineDashArray(this.lineType, this.lineWidth);
        var newLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
        newLine.setAttribute("d", path);
        newLine.setAttribute("stroke-dasharray", strokeDashArray);
        newLine.setAttribute("style", "stroke:" + temp.color[0] + "; stroke-width:" + temp.lineWidth + ";fill:none;");
        $(id).append(newLine);
        // Internet Explorer not support svg animation
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;
        if (IsBoolean(this.m_chart.m_enableanimation) && IsBoolean(!this.m_chart.scaleFlag) && !isIE) {
            this.setLineAnimation(newLine);
        }
    }
    //added below condition for plotting continuous line
    if (path1 != undefined && path1 != "") {
        var strokeDashArray1 = this.getLineDashArray(this.m_chart.getLineType(this.lineType), this.lineWidth);
        var newLine1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        newLine1.setAttribute("d", path1);
        newLine1.setAttribute("stroke-dasharray", strokeDashArray1);
        newLine1.setAttribute("style", "stroke:" + temp.color[0] + "; stroke-width:" + temp.lineWidth + ";fill:none;");
        $(id).append(newLine1);
        // Internet Explorer not support svg animation
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;
        if (IsBoolean(this.m_chart.m_enableanimation) && IsBoolean(!this.m_chart.scaleFlag) && !isIE) {
            this.setLineAnimation(newLine1);
        }
    }
};

/** @description creates and adds an SVG path without defining the nodes  **/
DSLineSeries.prototype.createPath = function(color, width, strokeDashArray) {
    width = (typeof width == "undefined" ? "3" : width);
    var P = document.createElementNS("http://www.w3.org/2000/svg", "path");
    P.setAttributeNS(null, "fill", "none");
    P.setAttribute("stroke-dasharray", strokeDashArray);
    P.setAttributeNS(null, "stroke", color);
    P.setAttributeNS(null, "stroke-width", width);
    return P;
};

/** @description computes spline control points and draw path  **/
DSLineSeries.prototype.drawSplines = function(index) {
    /*computes control points p1 and p2 for x and y direction*/
    var temp = this;
    px = this.computeControlPoints(this.xPositionArray);
    py = this.computeControlPoints(this.yPositionArray);
    var id = (!temp.m_chart.scaleFlag) ? "#linestackgrp" + index + temp.m_chart.m_objectid : "#linegrpslider" + index + temp.m_chart.m_objectid;

    /*updates path settings, the browser will draw the new spline*/
    var attributeD = "";
    var attributeD1 = "";
    var xposArrLength = px.p1.length;
    for (var i = 0; i < xposArrLength; i++) {
        if (this.yPositionArray[i] <= temp.m_chart.getStartY() && this.yPositionArray[i] >= temp.m_chart.getEndY() && this.yPositionArray[i + 1] <= temp.m_chart.getStartY() && this.yPositionArray[i + 1] >= temp.m_chart.getEndY()) {
            var path = this.createBezierPath(this.xPositionArray[i], this.yPositionArray[i], px.p1[i], py.p1[i], px.p2[i], py.p2[i], this.xPositionArray[i + 1], this.yPositionArray[i + 1]);
            if (path != undefined)
                attributeD += path;
        }
        /*BDD-837 Added below condition for plotting continuous line when data is discontinuous*/
        else if (IsBoolean(this.m_chart.m_continuousline)) {
            var count = 0;
            var count1 = 0;
            for (var a = i; a >= 0; a--) {
                if (this.yPositionArray[a] == "" || this.yPositionArray[a] == null || isNaN(this.yPositionArray[a])) {
                    //do nothing
                } else {
                    count = a;
                    break;
                }
            }
            //for end x & end y
            for (var b = i + 1; b <= this.xPositionArray.length; b++) {
                if (this.yPositionArray[b] == "" || this.yPositionArray[b] == null || isNaN(this.yPositionArray[b])) {
                    //do nothing
                } else {
                    count1 = b;
                    break;
                }
            }
            if ((this.yPositionArray[count] == "" || this.yPositionArray[count] == null || isNaN(this.yPositionArray[count])) || count1 == 0) {
                //do nothing
            } else
                var path1 = this.createBezierPath(this.xPositionArray[count], this.yPositionArray[count], px.p1[count], py.p1[count], px.p2[count], py.p2[count], this.xPositionArray[count1], this.yPositionArray[count1]);
            var flag = true;
            for (var c = i; c > 0; c--) {
                var dup = "M" + attributeD1.split("M")[c];
                if (path1 == dup) {
                    flag = false;
                    break;
                }
            }
            if (path1 != undefined && IsBoolean(flag))
                attributeD1 += path1;
        }
    }
    if (attributeD != undefined) {
        var strokeDashArray = this.getLineDashArray(this.lineType, this.lineWidth);
        var path = this.createPath(this.color[0], this.lineWidth, strokeDashArray);
        path.setAttributeNS(null, "d", attributeD);
        $(id).append(path);
        // Internet Explorer not support svg animation
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;
        if (IsBoolean(this.m_chart.m_enableanimation) && IsBoolean(!this.m_chart.scaleFlag) && !isIE) {
            this.setLineAnimation(path);
        }
    }
    //added below condition for plotting continuous line
    if (attributeD1 != undefined) {
        var strokeDashArray1 = this.getLineDashArray(this.m_chart.getLineType(this.lineType), this.lineWidth);
        var path1 = this.createPath(this.color[0], this.lineWidth, strokeDashArray1);
        path1.setAttributeNS(null, "d", attributeD1);
        $(id).append(path1);
        // Internet Explorer not support svg animation
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;
        if (IsBoolean(this.m_chart.m_enableanimation) && IsBoolean(!this.m_chart.scaleFlag) && !isIE) {
            this.setLineAnimation(path1);
        }
    }
};
/** @description Get line dash array **/
DSLineSeries.prototype.getLineDashArray = function(lineType, lineWidth) {
    /**An Array of first two numbers which specify line width and a gap and last two for line patterns **/
    if (lineType === "dot")
        return [lineWidth * 1, (lineWidth * 2) + 1, 0, 0];
    else if (lineType === "dash1")
        return [lineWidth * 1, (lineWidth * 1), (lineWidth * 4), (lineWidth * 1)];
    else if (lineType === "dash")
        return [(lineWidth * 2), (lineWidth * 2) + 1, 0, 0];
    else
        return [];
};
/** @description creates formated path string for SVG cubic path element  **/
DSLineSeries.prototype.createBezierPath = function(x1, y1, px1, py1, px2, py2, x2, y2) {
    if (x1 !== "" && y1 !== "" && px1 !== "" && py1 !== "" && px2 !== "" && py2 !== "" && x2 !== "" && y2 !== "")
        return "M " + x1 + " " + y1 + " C " + px1 + " " + py1 + " " + px2 + " " + py2 + " " + x2 + " " + y2;
    else
        return;
};

/** @description computes control points given knots K, this is the brain of the operation  **/
DSLineSeries.prototype.computeControlPoints = function(K) {
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
        p1: p1,
        p2: p2
    };
};

/** @description computes control points for segment Line. **/
DSLineSeries.prototype.pathString = function(xPixelArr, yPixelArr, startY, endY) {
    var str = "";
    var k = 0;
    var xPixelArrLength = xPixelArr.length;
    for (var i = 0; i < xPixelArrLength; i++) {
        /**Math.floor & Math.ceil added to draw which is having very small difference*/
        if (Math.floor(yPixelArr[i]) <= Math.ceil(startY) && Math.ceil(yPixelArr[i]) >= Math.floor(endY)) {
            if (yPixelArr[i] == "") {
                k = 0;
            }
            if (k == 0) {
                if (yPixelArr[i] != "") {
                    str += "M" + xPixelArr[i] + "," + yPixelArr[i];
                    k++;
                }
            } else {
                str += "L" + xPixelArr[i] + "," + yPixelArr[i];
            }
        } else
            k = 0;
    }
    /*BDD-837 Added "m_continuousline" condition for plotting continuous line when data is discontinuous*/
    return str;
};

/**@decription added below method for plotting conitnous line path string BDD-837**/
DSLineSeries.prototype.pathStringContinuous = function(xPixelArr, yPixelArr, startY, endY) {
    var str = "";
    var k = 0;
    var xPixelArrLength = xPixelArr.length;
    for (var i = 0; i < xPixelArrLength; i++) {
        /**Math.floor & Math.ceil added to draw which is having very small difference*/
        if (yPixelArr[i] == "" && k == 0) {
            var count = 0;
            var count1 = 0;
            for (var a = i - 1; a >= 0; a--) {
                if (this.yPositionArray[a] == "" || this.yPositionArray[a] == null || isNaN(this.yPositionArray[a])) {
                    //do nothing
                } else {
                    count = a;
                    break;
                }
            }
            for (var b = i + 1; b <= this.xPositionArray.length; b++) {
                if (this.yPositionArray[b] == "" || this.yPositionArray[b] == null || isNaN(this.yPositionArray[b])) {
                    //do nothing
                } else {
                    count1 = b;
                    break;
                }
            }
            if ((this.yPositionArray[count] == "" || this.yPositionArray[count] == null || isNaN(this.yPositionArray[count])) || count1 == 0) {
                //do nothing
            } else {
                str += "M" + xPixelArr[count] + "," + yPixelArr[count];
                str += "L" + xPixelArr[count1] + "," + yPixelArr[count1];
            }
        }
    }
    /*BDD-837 Added "m_continuousline" condition for plotting continuous line when data is discontinuous*/
    return str;
};

//# sourceURL=DecompositionChart.js