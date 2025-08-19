/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: GroupColumnChart.js
 * @description GroupColumnChart
 **/
function GroupColumnChart(m_chartContainer, m_zIndex) {
    this.base = Chart;
    this.base();
    this.m_x = 680;
    this.m_y = 320;
    this.m_width = 300;
    this.m_height = 260;
    this.m_barWidth = 10;
    /** Array Creation for storing the Values which will use in drawing of chart and object creation of X,Y Axis **/
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
    this.m_calculation = new GroupColumnCalculation();
    this.noOfRows = 1;
    this.m_xAxis = new GroupColumnXAxis();
    this.m_yAxis = new GroupColumnYAxis();
    this.m_title = new svgTitle(this);
    this.m_subTitle = new svgSubTitle();
    this.m_chartContainer = m_chartContainer;
    this.m_zIndex = m_zIndex;
    this.m_showhorizontalmarkerline = false;
    this.m_subcategoryorientation = "left";
    this.m_mergesubcategory = "false";
    this.dataMap = {};
    this.m_aggroperation = "avg";
    this.m_showcatsubcatpartitioner = "true";
    this.m_showcatpartitioner = "true";
    this.m_enableanimation = "false";
    this.m_baranimationduration = 0.5;
    this.m_stackborderwidth = "0";
    this.m_stackbordercolor = "#ffffff";
    this.m_enablestackshadow = "false";
    this.m_stackshadowcolor = "#000000";
    this.m_stackshadowopacity = "0.3";
    this.m_canvastype = "svg";
    this.m_stacksvgtype = "rect";
    // added for controlling uniform bar widths using script
    this.m_controlbarwidth = "auto";
    this.m_stackborderradius = "0";
    this.enableDrillHighlighter = "false";
	this.m_drilltoggle = false;
	
	/*DAS-760*/
	this.m_xaxiscategorytextwrap = false;
	this.m_xaxissubcategorytextwrap = false;
};

/** @description Making prototype of chart class to inherit its properties and methods into Bar chart **/
GroupColumnChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
GroupColumnChart.prototype.setProperty = function(chartJson) {
    this.ParseJsonAttributes(chartJson.Object, this);
    this.initCanvas();
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
GroupColumnChart.prototype.ParseJsonAttributes = function(jsonObject, nodeObject) {
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
                    case "SubCategoryColors":
                        var subCategoryColorsObject = new SubCategoryColors();
                        this.setSubCategoryColors(subCategoryColorsObject);
                        for (var SubCategoryColorsKey in jsonObject[key][chartKey]) {
                            switch (SubCategoryColorsKey) {
                                case "subCategoryColor":
                                    var SubCategoryColorArray = this.getArrayOfSingleLengthJson(jsonObject[key][chartKey][SubCategoryColorsKey]);
                                    subCategoryColorsObject.subcateogryNameColorMap = new Object();
                                    for (var i = 0; i < SubCategoryColorArray.length; i++) {
                                        var subCategoryColorObject = new SubCategoryColor();
                                        subCategoryColorsObject.setSubCategoryColor(subCategoryColorObject);
                                        for (var SubCategoryColorKey in SubCategoryColorArray[i]) {
                                            var propertyName = this.getNodeAttributeName(SubCategoryColorKey);
                                            subCategoryColorObject[propertyName] = SubCategoryColorArray[i][SubCategoryColorKey];
                                        }
                                        subCategoryColorsObject.subcateogryNameColorMap[subCategoryColorObject.getSubCategoryName()] = subCategoryColorObject.getColor();
                                    }
                                    break;
                                default:
                                    var propertyName = this.getNodeAttributeName(SubCategoryColorsKey);
                                    nodeObject.m_subCategoryColors[propertyName] = jsonObject[key][chartKey][SubCategoryColorsKey];
                                    break;
                            }
                        }
                        subCategoryColorsObject.setSubCategoryDefaultColorSet();
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

/** @description Getter for DataProvider **/
GroupColumnChart.prototype.getDataProvider = function() {
    return this.m_dataProvider;
};

/** @description Getter for categoryNames **/
GroupColumnChart.prototype.getCategoryNames = function() {
    return this.m_categoryNames;
};

/** @description Getter for Category Display Name **/
GroupColumnChart.prototype.getCategoryDisplayNames = function() {
    return this.m_categoryDisplayNames;
};

/** @description Getter for SubCategory Names **/
GroupColumnChart.prototype.getSubCategoryNames = function() {
    return this.m_subCategoryNames;
};

/** @description Setter for StartX **/
GroupColumnChart.prototype.setStartX = function() {
    this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
    var btdm = this.getBorderToDescriptionMargin();
    var dm = this.getYAxisDescriptionMargin();
    var dtlm = this.getDescriptionToLabelMargin();
    var ltam = this.getLabelToAxisMargin();
    var lm = this.getYAxisLabelMargin();
    this.m_startX = this.m_x * 1 + btdm * 1 + dm * 1 + dtlm * 1 + lm * 1 + ltam * 1;
};

GroupColumnChart.prototype.getYAxisLabelMargin = function() {
	var lm = 0;
	var lfm = this.getLabelFormatterMargin();
	this.setLabelWidth();
	var lw = this.getLabelWidth();
	var lsm = this.getLabelSignMargin();
	var lpm = this.getLabelPrecisionMargin();
	lm = lfm * 1 + lw * 1 + lsm * 1 + lpm * 1;
	return lm;
};

/** @description Getter for category Text Margin **/
GroupColumnChart.prototype.getCatTextMargin = function() {
    this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
    var lm = 0;
    if(this.fontScaling(this.m_xAxis.m_labelfontsize) > 0){
    	if (!IsBoolean(this.isEmptyCategory))
            for (var i = 0; i < this.m_categoryData[0].length; i++) {
                if (lm < this.ctx.measureText(this.m_categoryData[0][i]).width) {
                    lm = this.ctx.measureText(this.m_categoryData[0][i]).width;
                }
            }
        lm = lm + 10 * 1;
        if (lm > this.m_height / 5)
            lm = this.m_height / 5;
    }
    return lm;
};

/** @description Getter for Sub Category Text Margin **/
GroupColumnChart.prototype.getSubCatTextMargin = function() {
    this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_subcategoryfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
    var scm = 0;
    if(this.fontScaling(this.m_xAxis.m_subcategoryfontsize) >= 0){
    	if (!IsBoolean(this.isEmptySubCategory)){
            for (var j = 0; j < this.m_subCategoryData[0].length; j++) {
                if (scm < this.ctx.measureText(this.m_subCategoryData[0][j]).width) {
                    scm = this.ctx.measureText(this.m_subCategoryData[0][j]).width;
                }
            }
         }else{
    		/*DAS-325 When Subcategory is there and visibility is false */
    	 	/*scm = this.getCatTextMargin()*/
    	 	/*DAS-728*/
    	 	scm = 0
    	 }
        scm = scm + 10 * 1;
        if (scm > this.m_height / 5)
            scm = this.m_height / 5;
    }
    return scm;
};

/** @description Setter for Start Y **/
GroupColumnChart.prototype.setStartY = function() {
    var cm = this.getChartMargin();
    var xlbm = this.getXAxisLabelMarginForBar();
    var xdm = this.getXAxisDescriptionMargin();
    var bottomMargin = cm * 1 + xlbm * 1 + xdm * 1;
    var cm = this.getCatTextMargin();
    var scm = this.getSubCatTextMargin();
    this.m_startY = (this.m_y * 1 + this.m_height * 1 - bottomMargin * 1 - cm * 1 - scm * 1);
};

/** @description Getter for X Axis Label Margin **/
GroupColumnChart.prototype.getXAxisLabelMarginForBar = function() {
    var lm = 0;
    this.noOfRows = 1;
    this.noOfRows = this.setNumberOfRows();
    var lfm = 0;
    var lw = this.fontScaling(this.m_xAxis.getLabelFontSize()) * 1.5 * this.noOfRows;
    var lsm = 0;
    var lpm = 0;
    var lsfm = 0;
    var dm = 0;
    lm = lfm * 1 + lw * 1 + lsm * 1 + lpm * 1 + lsfm * 1 + dm * 1;
    return lm;
};

/** @description Calculating text margin after applying the formatter on text**/
GroupColumnChart.prototype.getLabelFormatterMargin = function() {
    var lfm = 0;
    if (!IsBoolean(this.m_fixedlabel)) {
    	if (this.m_formater != "none" && this.m_formater != "") {
    		if (this.m_unit != "none" && this.m_unit != "") {
                var unit = this.m_util.getFormatterSymbol(this.m_formater, this.m_unit);
                this.ctx.beginPath();
                this.ctx.font = this.m_yAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_yAxis.getLabelFontSize()) + "px " + this.m_yAxis.getLabelFontFamily();
                lfm = this.ctx.measureText(unit).width;
                this.ctx.closePath();
            }
    	}
    }
    return lfm;
};

/** @description Getter for LabelWidth **/
GroupColumnChart.prototype.getLabelWidth = function() {
    return this.m_labelwidth;
};

/** @description formatter will apply on mark X Axis text and calculating width**/
GroupColumnChart.prototype.setLabelWidth = function() {
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
/* 
GroupColumnChart.prototype.setLabelWidth = function() {
    this.m_labelwidth = 0;
    //var maxSeriesVal = (("" + this.min).length <= ("" + this.max).length) ? this.max : this.min;
    var maxSeriesVal = [];
    if (this.m_charttype == "100%") {
        maxSeriesVal = 100;
    }
    var maxSeriesValDecimal = maxSeriesVal;
    this.ctx.beginPath();
    this.ctx.font = this.m_yAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_yAxis.getLabelFontSize()) + "px " + this.m_yAxis.getLabelFontFamily();
    this.m_labelwidth = this.ctx.measureText(maxSeriesValDecimal).width;
    this.ctx.closePath();
    if (!IsBoolean(this.m_fixedlabel)) {
        if (IsBoolean(this.m_yAxis.getLeftaxisFormater())) {
            if (this.getSecondaryFormater() != "none" && this.getSecondaryFormater() != "") {
                if (this.getSecondaryUnit() != "none" && this.getSecondaryUnit() != "") {
                    var secondunit = this.m_util.getFormatterSymbol(this.getSecondaryFormater(), this.getSecondaryUnit());
                    if (this.getSecondaryUnit() == "auto" && this.m_unit == "Rupees") {
                        maxSeriesVal = getNumberFormattedNumericValue(maxSeriesVal * 1, this.m_precision, this.m_unit);
                    } else if (this.getSecondaryUnit() == "auto") {
                        maxSeriesVal = getNumberFormattedValue(maxSeriesVal * 1);
                    } else if (this.getSecondaryUnit() == "none") {
                        maxSeriesVal = this.m_util.updateTextWithFormatter(maxSeriesVal, secondunit, this.m_precision);
                    }
                }
            }
            if (this.m_formater != "none" && this.m_formater != "") {
                if (this.m_unit != "none" && this.m_unit != "") {
                    var unit = this.m_util.getFormatterSymbol(this.m_formater, this.m_unit);
                    maxSeriesVal = maxSeriesVal + "" + unit;
                }
            }
            this.ctx.beginPath();
            this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
            maxSeriesVal = getFormattedNumberWithCommas(maxSeriesVal, this.m_numberformatter);
            this.m_labelwidth = this.ctx.measureText(maxSeriesVal).width;
            this.ctx.closePath();
        }
    }
};
*/

/** @description Getter for label sign margin **/
GroupColumnChart.prototype.getLabelSignMargin = function() {
    var lsm = 0;
    var msvw = 0;
    var minSeriesValue = this.min;
    if (minSeriesValue < 0) {
        this.ctx.beginPath();
        this.ctx.font = this.m_yAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_yAxis.getLabelFontSize()) + "px " + this.m_yAxis.getLabelFontFamily();
        var msvw = this.ctx.measureText(minSeriesValue).width;
        this.ctx.closePath();
    }

    if (this.getLabelWidth() < msvw)
        lsm = this.ctx.measureText("-").width;

    return lsm;
};

/** @description Getter for precision margin**/
GroupColumnChart.prototype.getLabelPrecisionMargin = function() {
    var lpm = 5;
    if (!IsBoolean(this.m_fixedlabel)) {
    	if (this.m_precision != "none" && this.m_precision != "" && this.m_precision != 0) {
            this.ctx.beginPath();
            this.ctx.font = this.m_yAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_yAxis.getLabelFontSize()) + "px " + this.m_yAxis.getLabelFontFamily();
            var precisionText = ".";
            for (var i = 0; i < this.m_precision; i++)
                precisionText = precisionText + "" + "0";
            lpm = this.ctx.measureText(precisionText).width;
            this.ctx.closePath();
        }
    }
    return lpm;
};

/** @description Getter for second formatter margin**/
GroupColumnChart.prototype.getLabelSecondFormatterMargin = function() {
    var lsfm = 0;
    if (!IsBoolean(this.m_fixedlabel)) {
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
    return lsfm;
};

/** @description Calculating number of rows for x Axis marking(if x axis text are big than it will break into 2 lines) **/
GroupColumnChart.prototype.setNumberOfRows = function() {
    this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
    var noOfRow = 1;
    var max = (("" + this.min).length <= ("" + this.max).length) ? this.max : this.min;
    if (!IsBoolean(this.isEmptySeries)) {
        var maxSeriesVal = (this.m_charttype == "100%") ? 100 : max;
        var markerLength = this.m_yAxisMarkersArray.length;

        var xDivision = (this.getEndX() - this.getStartX()) / markerLength;
        var secondUnit = this.getSecondUnitValue();
        var val = this.m_util.updateTextWithFormatter(maxSeriesVal, secondUnit, this.m_precision);
        var unit = this.getUnitValue();
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
GroupColumnChart.prototype.getSecondUnitValue = function() {
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
GroupColumnChart.prototype.getUnitValue = function() {
    var unit = "";
    if (!IsBoolean(this.m_fixedlabel)) {
        if (IsBoolean(this.m_xAxis.getLeftaxisFormater()))
            if (this.m_formater != "none" && this.m_formater != "")
                if (this.m_unit != "none" && this.m_unit != "")
                    unit = this.m_util.getFormatterSymbol(this.m_formater, this.m_unit);
    }

    return unit;
};
/** @description Calculating end X and setting into this.m_endX variable**/
GroupColumnChart.prototype.setEndX = function() {
    var blm = this.getBorderToLegendMargin();
    var vlm = this.getVerticalLegendMargin();
    var vlxm = this.getVerticalLegendToXAxisMargin();
    var rightSideMargin = blm * 1 + vlm * 1 + vlxm * 1;
    this.m_endX = (this.m_x * 1 + this.m_width * 1 - rightSideMargin * 1);
};

/** @description Calculating End Y and setting into this.m_endY variable**/
GroupColumnChart.prototype.setEndY = function() {
    this.m_endY = (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};

/** @description Checking is only one series visible **/
GroupColumnChart.prototype.getCounterFlagForSeriesVisiblity = function() {
    var count = 0;
    for (var i = 0; i < this.m_seriesData.length; i++) {
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

/** @description Getting Field JSON and pusing into category,subcategory,series array according to field type**/
GroupColumnChart.prototype.setFields = function(fieldsJson) {
    this.m_fieldsJson = fieldsJson;
    var categoryJson = [];
    this.m_categoryJSON = [];
    this.m_subCategoryJSON = [];
    var seriesJson = [];
    var subCategoryJson = [];

    for (var i = 0; i < fieldsJson.length; i++) {
        //if (IsBoolean(fieldsJson[i].visible)) {
        var fieldType = this.getProperAttributeNameValue(fieldsJson[i], "Type");
        switch (fieldType) {
            case "Category":
                categoryJson.push(fieldsJson[i]);
                this.m_categoryJSON.push(fieldsJson[i]);
                break;
            case "SubCategory":
                subCategoryJson.push(fieldsJson[i]);
                this.m_subCategoryJSON.push(fieldsJson[i]);
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
        //}
    }
    if ((subCategoryJson.length > 0 && categoryJson.length > 0)) {
        if (subCategoryJson[0].Name == categoryJson[0].Name) {
            subCategoryJson = categoryJson;
            categoryJson = [];
        }
    }
    if ((subCategoryJson.length == 0 && categoryJson.length != 0)) {
        this.m_subcategoryorientation = "left";
       /* DAS-734*/
        /*subCategoryJson = categoryJson;*/
		subCategoryJson = []
		 		 
    }
    this.setCategory(categoryJson);
    this.setSubCategory(subCategoryJson);
    this.setSeries(seriesJson);
};

/** @description From category JSON getting the Name,Display Name and setting into categoryName,categoryDisplayName array**/
GroupColumnChart.prototype.setCategory = function(categoryJson) {
    this.m_categoryNames = [];
    this.m_categoryFieldColor = [];
    this.m_categoryDisplayNames = [];
    this.m_allCategoryNames = [];
    this.m_allCategoryDisplayNames = [];
    this.m_categoryVisibleArr = {};
    var count = 0;
    //only one category can be set for line chart, preference to first one
    for (var i = 0; i < categoryJson.length; i++) {
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

/** @description  From Subcategory JSON getting the name.displayName and setting into subCategoryName,subCategoryDisplayName Array**/
GroupColumnChart.prototype.setSubCategory = function(subCategoryJson) {
    this.m_subCategoryNames = [];
	this.m_subCategoryFieldColor = [];
    this.m_subCategoryDisplayNames = [];
    this.m_allSubCategoryNames = [];
    this.m_allSubCategoryDisplayNames = [];
    this.m_subCategoryVisibleArr = {};
    var count = 0;
    for (var i = 0; i < subCategoryJson.length; i++) {
        this.m_allSubCategoryNames[i] = this.getProperAttributeNameValue(subCategoryJson[i], "Name");
        var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(subCategoryJson[i], "DisplayName"));
        this.m_allSubCategoryDisplayNames[i] = m_formattedDisplayName;
        this.m_subCategoryVisibleArr[this.m_allSubCategoryDisplayNames[i]] = this.getProperAttributeNameValue(subCategoryJson[i], "visible");
        if (IsBoolean(this.m_subCategoryVisibleArr[this.m_allSubCategoryDisplayNames[i]])) {
            this.m_subCategoryNames[count] = this.getProperAttributeNameValue(subCategoryJson[i], "Name");
            this.m_subCategoryDisplayNames[count] = m_formattedDisplayName;
			this.m_subCategoryFieldColor[count] = this.getProperAttributeNameValue(subCategoryJson[i], "Color");
        }
    }
};

/** @description Getting series fields and storing series field attribute into different-2 series attribute array **/
GroupColumnChart.prototype.setSeries = function(seriesJson) {
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
    for (var i = 0; i < seriesJson.length; i++) {
        //this.m_seriesNames[i] = this.getProperAttributeNameValue(seriesJson[i],"Name");
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
            var tempMap = {
                "seriesName": this.m_seriesNames[count],
                "displayName": this.m_seriesDisplayNames[count],
                "color": this.m_seriesColors[count],
                "shape": "cube"
            };
            this.legendMap[this.m_seriesNames[count]] = tempMap;
            count++;
        }
    }
    this.setLegendsIntialLoad(this.m_defaultlegendfields);
};

/** @description Getter for legend information**/
GroupColumnChart.prototype.getLegendInfo = function() {
    return this.legendMap;
};

/** @description Getter for All Series Names **/
GroupColumnChart.prototype.getAllSeriesNames = function() {
    return this.m_allSeriesNames;
};

/** @description Getter for All Category Names **/
GroupColumnChart.prototype.getAllCategoryNames = function() {
    return this.m_allCategoryNames;
};

/** @description Getter for All Sub Category Names **/
GroupColumnChart.prototype.getAllSubCategoryNames = function() {
    return this.m_allSubCategoryNames;
};

/** @description Getter for series Names**/
GroupColumnChart.prototype.getSeriesNames = function() {
    return this.m_seriesNames;
};

/** @description Getter for series display Names **/
GroupColumnChart.prototype.getSeriesDisplayNames = function() {
    return this.m_seriesDisplayNames;
};

/** @description Getter for series colors **/
GroupColumnChart.prototype.getSeriesColors = function() {
    return this.m_seriesColors;
};

/** @description Setter for legend Names **/
GroupColumnChart.prototype.setLegendNames = function(m_legendNames) {
    this.m_legendNames = m_legendNames;
};

/** @description Getter for legend Names**/
GroupColumnChart.prototype.getLegendNames = function() {
    return this.m_legendNames;
};

/** @description Pushing all field name into this.m_allFieldsName array  **/
GroupColumnChart.prototype.setAllFieldsName = function() {
    this.m_allfieldsName = [];
    for (var i = 0; i < this.getAllCategoryNames().length; i++) {
        this.m_allfieldsName.push(this.getAllCategoryNames()[i]);
    }
    for (var i = 0; i < this.getAllSubCategoryNames().length; i++) {
        this.m_allfieldsName.push(this.getAllSubCategoryNames()[i]);
    }
    for (var j = 0; j < this.getAllSeriesNames().length; j++) {
        this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
    }
};

/** @description Getter for All Fields Name **/
GroupColumnChart.prototype.getAllFieldsName = function() {
    return this.m_allfieldsName;
};

/** @description Setter for All fields Display Name **/
GroupColumnChart.prototype.setAllFieldsDisplayName = function() {
    this.m_allfieldsDisplayName = [];
    for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
        this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
    }
    for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
        this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
    }
};

/** @description Getter for All Fields DisplayName **/
GroupColumnChart.prototype.getAllFieldsDisplayName = function() {
    return this.m_allfieldsDisplayName;
};

/** @description Setting Category Data into this.m_categoryData Array **/
GroupColumnChart.prototype.setCategoryData = function() {
    this.m_categoryData = [];
    this.isEmptyCategory = true;
    for (var i = 0; i < this.getCategoryNames().length; i++) {
        this.isEmptyCategory = false;
        this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
    }
};

/** @description Setting subcategory Data into this.m_subcategoryData **/
GroupColumnChart.prototype.setSubCategoryData = function() {
    this.m_subCategoryData = [];
    this.isEmptySubCategory = true;
    for (var i = 0; i < this.getSubCategoryNames().length; i++) {
        this.isEmptySubCategory = false;
        this.m_subCategoryData[i] = this.getDataFromJSON(this.getSubCategoryNames()[i]);
    }
};

/** @description Getter for SubCategory Data **/
GroupColumnChart.prototype.getSubCategoryData = function() {
    return this.m_subCategoryData;
};

/** @description Getter for Category Data**/
GroupColumnChart.prototype.getCategoryData = function() {
    return this.m_categoryData;
};

/** @description Setter for Series Data **/
GroupColumnChart.prototype.setSeriesData = function() {
    this.m_seriesData = [];
    for (var i = 0; i < this.getSeriesNames().length; i++) {
        this.m_seriesData.push(this.getDataFromJSON(this.getSeriesNames()[i]));
    }
};

/** @description Getter for Series Data **/
GroupColumnChart.prototype.getSeriesData = function() {
    return this.m_seriesData;
};

/** @description Setter for Series Color **/
GroupColumnChart.prototype.setSeriesColor = function(m_seriesColor) {
    this.m_seriesColor = m_seriesColor;
};

/** @description Getter for Series Color **/
GroupColumnChart.prototype.getSeriesColor = function() {
    return this.m_seriesColor;
};

/** @description GroupColumnChart initialization of title,subtitle,chartFrame,XAxis,YAxis class **/
GroupColumnChart.prototype.init = function() {
    this.setCategoryData();
    this.setSubCategoryData();
    this.setSeriesData();
    this.visibleSeriesInfo = this.getVisibleSeriesData(this.getSeriesData());
    this.setColorsForSeries();
    if (this.getCategoryNames().length != 0 && this.getSubCategoryNames()[0] != undefined) {
        this.manageRepeatedSubCategory();
    }
    this.setAllFieldsName();
    this.setAllFieldsDisplayName();
    this.isSeriesDataEmpty();
    this.setShowSeries(this.getAllFieldsName());
    this.updateSeriesDataWithCommaSeperators();

    this.visibleSeriesInfo = this.getVisibleSeriesData(this.getSeriesData());
    this.createSVG();
    this.initMouseClickEventForSVG(this.svgContainerId);
    this.m_chartFrame.init(this);
    this.m_title.init(this);
    this.m_subTitle.init(this);
    if (!IsBoolean(this.m_isEmptySeries) && IsBoolean(this.isVisibleSeries()) && ((!IsBoolean(this.isEmptyCategory)) || (!IsBoolean(this.isEmptySubCategory)))) {
        this.setPercentageForHundred();
        this.initializeCalculation();
        this.m_xAxis.init(this, this.m_calculation);
        this.m_yAxis.init(this, this.m_calculation);
    }
    /**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};

/** @description If a category contains duplicate SubCategory than performing aggrigation and assigning to subcategory values**/
GroupColumnChart.prototype.manageRepeatedSubCategory = function() {
    /**Map Creation of Data**/
    var mapData = {};
    var mapDataLabel = {};
    var mapColor = {};
    for (var i = 0; i < this.m_categoryData[0].length; i++) {
        if (mapData[this.m_categoryData[0][i]] == undefined) {
            mapData[this.m_categoryData[0][i]] = {};
            mapDataLabel[this.m_categoryData[0][i]] = {};
            mapColor[this.m_categoryData[0][i]] = {};
        }
        if (mapData[this.m_categoryData[0][i]][this.m_subCategoryData[0][i]] == undefined) {
            mapData[this.m_categoryData[0][i]][this.m_subCategoryData[0][i]] = [];
            mapDataLabel[this.m_categoryData[0][i]][this.m_subCategoryData[0][i]] = [];
            mapColor[this.m_categoryData[0][i]][this.m_subCategoryData[0][i]] = [];
        }
        var arr = [];
        var arrDataLabel = [];
        var seriesColor = [];
        this.setSeriesDataLabel();
        for (var k = 0; k < this.m_seriesData.length; k++) {
            arr.push(this.m_seriesData[k][i]);
        }
        for (var k = 0; k < this.m_seriesDataForDataLabel.length; k++) {
            arrDataLabel.push(this.m_seriesDataForDataLabel[k][i]);
        }
        for (var k = 0; k < this.m_seriesColorsArray.length; k++) {
            seriesColor.push(this.m_seriesColorsArray[k][i]);
        }
        mapData[this.m_categoryData[0][i]][this.m_subCategoryData[0][i]].push(arr);
        mapDataLabel[this.m_categoryData[0][i]][this.m_subCategoryData[0][i]].push(arrDataLabel);
        mapColor[this.m_categoryData[0][i]][this.m_subCategoryData[0][i]].push(seriesColor);
    }
    /**ending of map creation**/
    /**starting of setting average of repeated subcategory in category**/
    for (var key in mapData) {
        for (var key1 in mapData[key]) {
            var SumArry = [];
            var SumArryDataLabel = [];
            var colorArry = [];
            for (var j = 0; j < mapData[key][key1][0].length; j++) {
                var processArr = [];
                var processArrDataLabel = [];
                var processColorArry = [];
                for (var i = 0; i < mapData[key][key1].length; i++) {
                    if (isNaN(mapData[key][key1][i][j])) {
                        /**To support comma values (eg. "12,345.97","-12,345.97") **/
                        var RemovedCommaData = removeCommaFromSrting(mapData[key][key1][i][j]);
                        if (RemovedCommaData !== "") {
                            processArr.push(RemovedCommaData);
                        } else {
                            processArr.push(mapData[key][key1][i][j]);
                        }
                    } else {
                        processArr.push(mapData[key][key1][i][j]);
                    }
                    processArrDataLabel.push(mapDataLabel[key][key1][i][j]);
                    processColorArry.push(mapColor[key][key1][i][j]);
                }
                /**Added
                 * To check weather sub category contain same name, if it is then it shows the average of all that values.
                 * If all the values are string then after apply aggregation it will return empty string and nothing will display in tooltip in the place of value.
                 * If any of the value is numeric there then it will display that.
                 */
                if (processArr.length === 1) {
                    SumArry.push(processArr[0]);
                    SumArryDataLabel.push(processArrDataLabel[0]);
                    colorArry.push(processColorArry[0]);
                } else {
                    var AggregatedValue = getAggregationOperatedData(processArr, this.m_aggroperation);
                    if (AggregatedValue === "") {
                        for (var l = 0; processArr.length > l; l++) {
                            if (processArr[l] == 0) {
                                AggregatedValue = 0;
                                break;
                            }
                        }
                    }
                    SumArry.push(AggregatedValue);
                    SumArryDataLabel.push(getAggregationOperatedData(processArrDataLabel, this.m_aggroperation));
                    colorArry.push(processColorArry[0]);
                }
            }
            mapData[key][key1] = SumArry;
            mapDataLabel[key][key1] = SumArryDataLabel;
            mapColor[key][key1] = colorArry;
        }
    }
    /**reinitialize the category,subcategory,seriesData array**/
    this.m_categoryData[0] = [];
    this.m_subCategoryData[0] = [];
    this.m_seriesData = [];
    this.m_seriesDataForDataLabel = [];
    this.m_seriesColorsArray = [];
    for (var key in mapData) {
        for (var key1 in mapData[key]) {
            for (var i = 0; i < mapData[key][key1].length; i++) {
                this.m_seriesData[i] = [];
                this.m_seriesDataForDataLabel[i] = [];
                this.m_seriesColorsArray[i] = [];
            }
        }
    }
    /**reset the category,subcategory,seriesData**/
    for (var key in mapData) {
        for (var key1 in mapData[key]) {
            this.m_categoryData[0].push(key);
            this.m_subCategoryData[0].push(key1);
            for (var i = 0; i < mapData[key][key1].length; i++) {
                this.m_seriesData[i].push(mapData[key][key1][i]);
                this.m_seriesDataForDataLabel[i].push(mapDataLabel[key][key1][i]);
                this.m_seriesColorsArray[i].push(mapColor[key][key1][i]);
            }
        }
    }
};

/** @description Getting series data from comma seperator values **/
GroupColumnChart.prototype.updateSeriesDataWithCommaSeperators = function() {
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

/** @description Drawing of chartFrame,Title,Subtitle,XAxis,YAxis,BarChart **/
GroupColumnChart.prototype.drawChart = function() {
    this.drawChartFrame();
    this.drawTitle();
    this.drawSubTitle();
    this.drawLegends();
    if ((!IsBoolean(this.isEmptyCategory)) || (!IsBoolean(this.isEmptySubCategory))) {
        if (!IsBoolean(this.m_isEmptySeries)) {
            if (IsBoolean(this.isVisibleSeries())) {
                this.drawXAxis();
                this.drawYAxis();
                this.drawGroupColumnChart();
                this.drawDataLabel();
            } else {
                this.drawSVGMessage("No visible Series Available");
            }
        } else {
            this.drawSVGMessage(this.m_status.noData);
        }
    } else {
        this.drawSVGMessage("No Visible Category OR SubCategory Field Available");
    }
};

/** @description drawing line accroding to the passed parameter value**/
GroupColumnChart.prototype.drawLine = function(startX, StartY, endX, endY) {
    var temp = this;
    var newLine = drawSVGLine(startX, StartY, endX, endY, "0.5", hex2rgb(this.m_markercolor, this.m_markertransparency));
    $("#horizontallinegrp" + temp.m_objectid).append(newLine);
};

/** @description Canvas Initialization and removing already present canvas which have same id **/
GroupColumnChart.prototype.initCanvas = function() {
    var temp = this;
    $("#draggableDiv" + temp.m_objectid).remove();
    this.initializeDraggableDivAndCanvas();
};

/** @description Initialization of Draggable Div and Canvas **/
GroupColumnChart.prototype.initializeDraggableDivAndCanvas = function() {
    this.setDashboardNameAndObjectId();
    this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
    this.createDraggableCanvas(this.m_draggableDiv);
    this.setCanvasContext();
    this.createSVG();
    $("#draggableCanvas" + this.m_objectid).hide();
    this.initMouseMoveEvent(this.m_chartContainer);
    this.initMouseClickEventForSVG(this.svgContainerId);
};

/** @description createSVG Method used for create SVG element for Chart **/
GroupColumnChart.prototype.createSVG = function() {
    var temp = this;
    this.svgContainerId = "svgContainer" + temp.m_objectid;
    $("#" + temp.svgContainerId).remove();
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xlink", "http://www.w3.org/1999/xlink");
    svg.setAttribute("width", this.m_width);
    svg.setAttribute("height", this.m_height);
    svg.setAttribute("id", this.svgContainerId);
    $("#draggableDiv" + temp.m_objectid).append(svg);
};

/** @description Calculating required parameters which will use in further processing inside this function **/
GroupColumnChart.prototype.initializeCalculation = function() {
    var seriesData = this.updateSeriesData(this.visibleSeriesInfo.seriesData);
    var categoryData = this.updateSeriesData(this.m_categoryData);
    var subCategoryData = this.updateSeriesData(this.m_subCategoryData);

    this.calculateMinimumMaximum(seriesData);

    this.setChartDrawingArea();
    //create map Array
    this.dataMap = {};
    if (IsBoolean(this.isEmptyCategory) && !IsBoolean(this.isEmptySubCategory)) {
        this.m_calculation.init(this, subCategoryData, this.visibleSeriesInfo.seriesData, this.dataMap);
    } else if (!IsBoolean(this.isEmptyCategory) && IsBoolean(this.isEmptySubCategory)) {
        this.m_calculation.init(this, categoryData, this.visibleSeriesInfo.seriesData, this.dataMap);
    } else {
        for (var i = 0; i < categoryData.length; i++) {
            if (this.dataMap[categoryData[i][0]] == undefined) {
                this.dataMap[categoryData[i][0]] = {};
            }
            this.dataMap[categoryData[i][0]][subCategoryData[i][0]] = seriesData[i];
        }
        this.m_calculation.init(this, subCategoryData, this.visibleSeriesInfo.seriesData, this.dataMap);
    }
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
    //this.setColorsForSeries();
    this.initializeBars();
    this.initializeDataLabel();
};

/** @Description calculate the Min/Max value and get required ScaleInfo of The Axis **/
GroupColumnChart.prototype.calculateMinimumMaximum = function(seriesdata) {
    var minMax;
    if (this.m_charttype.toLowerCase() == "clustered") {
		minMax = this.calculateMinMaxValue(seriesdata);
	} else {
		if((this.m_charttype.toLowerCase() == "stacked") && (seriesdata[0].length === 1)) {
			minMax = this.calculateMinMaxValue(seriesdata);
		} 	else {
			minMax = this.calculateFinalMinMaxValue(seriesdata);
		}
	}

    var calculatedMin = minMax.min;
    var calculatedMax = minMax.max;

    var niceScaleObj = this.getCalculateNiceScale(calculatedMin, calculatedMax, this.m_basezero, this.m_autoaxissetup, this.m_minimumaxisvalue, this.m_maximumaxisvalue, (this.m_height));
    this.min = niceScaleObj.min;
    this.max = niceScaleObj.max;
    this.m_numberOfMarkers = niceScaleObj.markerArray.length;
    this.m_yAxisText = niceScaleObj.step;
    this.m_yAxisMarkersArray = niceScaleObj.markerArray;
};

/** @description calculate max,min from series data**/
GroupColumnChart.prototype.calculateFinalMinMaxValue = function(xAxisData) {
    var calculateMax = (isNaN(xAxisData[0][0] * 1)) ? 0 : xAxisData[0][0] * 1;
    var calculateMin = (isNaN(xAxisData[0][0] * 1)) ? 0 : xAxisData[0][0] * 1;
    if (this.m_charttype == "100%") {
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
    } else {
        for (var i = 0, length = xAxisData.length; i < length; i++) {
            var height = 0;
            var negHeight = 0;
            var stackLength = xAxisData[i].length;
            for (var j = 0; j < stackLength; j++) { // number of stacks in one rectangle
                if (!isNaN(xAxisData[i][j] * 1)) {
                    if (xAxisData[i][j] * 1 > 0)
                        height = (height) * 1 + (xAxisData[i][j] * 1) * 1;
                    else
                        negHeight = (xAxisData[i][j] * 1) * 1 + (negHeight) * 1;
                }
            }
            if ((height) >= (calculateMax))
                calculateMax = height * 1;
            if ((negHeight * 1) < (calculateMin))
                calculateMin = negHeight * 1;
        }
    }
    return {
        max: calculateMax,
        min: calculateMin
    };
};

/** @description Calculating box division for each category with respect to the number of category and chart width , height **/
GroupColumnChart.prototype.calculateCategoryBoxSize = function() {
    var boxWidth = {};
    var y = this.getEndX() - this.m_barGap / 2;
    var i = Object.keys(this.dataMap).length - 1;
    for (Object.keys(this.dataMap)[i] in this.dataMap) {
        var count = 0;
        for (var subCat in this.dataMap[Object.keys(this.dataMap)[i]]) {
            count++;
        }
        if (IsBoolean(this.m_mergesubcategory) && this.m_categoryNames[0] != undefined) {
            y = y - (count * this.m_barWidth) - (this.m_barGap / 2);
        } else {
            y = y - (count * this.m_barWidth + this.m_barGap * count - this.m_barGap / 2);
        }
        boxWidth[Object.keys(this.dataMap)[i]] = y;

        y = y - this.m_barGap / 2;
        i--;
    }
    return boxWidth;
};

/** @description Checking is all series data conatin zero **/
GroupColumnChart.prototype.getCheckedAllPosContainigZero = function() {
    var flag = true;
    for (var i = 0; i < this.m_seriesData[this.m_seriesVisiblityPosition].length; i++) {
        if (this.m_seriesData[this.m_seriesVisiblityPosition][i] != 0)
            flag = false;
    }
    return flag;
};

/** @description Initializing percent array with Zero **/
GroupColumnChart.prototype.getArrayWhenPercentFlagIsFalse = function() {
    var per = [];
    for (var i = 0; i < this.m_seriesData.length; i++) {
        per[i] = 0;
    }
    return per;
};

/** @description Calculating Percentage of series values **/
GroupColumnChart.prototype.getPercentage = function() {
    var per = [];
    var sumOfSeries = this.getSumOfSeriesData();
    for (var i = 0; i < this.m_seriesData[this.m_seriesVisiblityPosition].length; i++) {
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

/** @description Calculating sum of series data**/
GroupColumnChart.prototype.getSumOfSeriesData = function() {
    var sum = 0;
    for (var i = 0; i < this.m_seriesData[this.m_seriesVisiblityPosition].length; i++) {
        if (this.m_seriesData[this.m_seriesVisiblityPosition][i] == "NaN")
            this.m_seriesData[this.m_seriesVisiblityPosition][i] = 0;
        if (this.m_seriesData[this.m_seriesVisiblityPosition][i] > 0)
            sum = sum * 1 + this.m_seriesData[this.m_seriesVisiblityPosition][i] * 1;
    }
    return sum;
};

/** @description BarSeries Initialization**/
GroupColumnChart.prototype.initializeBars = function() {
    this.m_barSeriesArray = {};
    for (var i = 0; i < this.visibleSeriesInfo.seriesName.length; i++) {
        this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[i]] = new GroupColumnSeries();
        var barWidth = (this.m_charttype == "clustered") ? this.m_barWidth / this.visibleSeriesInfo.seriesName.length : this.m_barWidth;
        /**Added for bar drawing position issue*/
        if (this.m_charttype == "clustered") {
            barWidth = barWidth * this.clusteredbarpadding;
        }
        this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[i]].init(this.m_xPositionArray[i], this.m_yPositionArray[i], barWidth, this.m_barWidthArray[i], this.m_percentageArray, this.getColorsForSeries()[i], this.m_strokecolor, this.m_showmarkingorpercentvalue, this.m_showPercentValueFlag, this.m_seriesInitializeFlag, this.m_plotTrasparencyArray[i], this);
    }
};
/** @description Data Label for BarSeries Initialization**/
GroupColumnChart.prototype.initializeDataLabel = function() {
    this.m_valueTextSeries = {};
    if (!(this.getCategoryNames().length != 0 && this.getSubCategoryNames()[0] != undefined)) {
        this.m_seriesDataForDataLabel = [];
    }
    /**Added when subcategory is not there in the chart*/
    if ((this.m_seriesDataForDataLabel.length === undefined) || IsBoolean(this.isEmptySubCategory) || (this.m_seriesDataForDataLabel.length === 0)) {
        this.setSeriesDataLabel();
    }
    for (var k = 0, i1 = 0; i1 < this.m_seriesNames.length; i1++) {
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i1]])) {
            if (IsBoolean(this.m_seriesDataLabelProperty[i1].showDataLabel)) {
                if ((this.m_charttype == "100%") && (this.m_seriesDataLabelProperty[k].showPercentValue !== undefined) && IsBoolean(this.m_seriesDataLabelProperty[k].showPercentValue)) {
                    this.m_seriesDataForDataLabel[k] = this.getPercentageForHundred()[k];
                    var value = k;
                } else {
                    var value = i1;
                }
                var barWidth = (this.m_charttype == "clustered") ? this.m_barWidth / this.visibleSeriesInfo.seriesName.length : this.m_barWidth;
                this.m_valueTextSeries[this.m_seriesNames[i1]] = new SVGValueTextSeries();
                this.m_valueTextSeries[this.m_seriesNames[i1]].init(this.m_xPositionArray[k], this.m_yPositionArray[k], this, this.m_seriesDataForDataLabel[value], this.m_seriesDataLabelProperty[i1], this.m_seriesData[i1], barWidth, this.m_barWidthArray[k], "column");
            };
            k++;
        }
    }
};

/** @description creating series data for data label**/
GroupColumnChart.prototype.setSeriesDataLabel = function() {
    this.m_seriesDataForDataLabel = [];
    for (var k = 0, length = this.getDataProvider().length; k < length; k++) {
        var record = this.getDataProvider()[k];
        for (var j = 0, serlength = this.getSeriesNames().length; j < serlength; j++) {
            if (!this.m_seriesDataForDataLabel[j]) {
                this.m_seriesDataForDataLabel[j] = [];
            }
            var dataFordatalabel = this.getValidFieldDataFromRecord(record, this.m_seriesDataLabelProperty[j].datalabelField);
            this.m_seriesDataForDataLabel[j][k] = dataFordatalabel;
        }
    }
};
/** @description Getter for Series Color **/
GroupColumnChart.prototype.getColorsForSeries = function() {
    return this.m_seriesColorsArray;
};

/** @description Setter for Series Color **/
GroupColumnChart.prototype.setColorsForSeries = function() {

	this.m_seriesColorsArray = [];
	var isemptyCat = true;//DAS-1122
	for (var i = 0; i < this.m_categoryData.length && isemptyCat; i++) {
		isemptyCat = Array.isArray(this.m_categoryData[i]) && this.m_categoryData[i].length === 0;
	}

	if (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) {
        for (var i = 0; i < this.visibleSeriesInfo.seriesData.length; i++) {
            this.m_seriesColorsArray[i] = [];
            for (var j = 0; j < this.visibleSeriesInfo.seriesData[i].length; j++) {
                this.m_seriesColorsArray[i][j] = this.m_drillColor;
            }
        }
    } else if (!IsBoolean(this.m_designMode) && (this.getCategoryColors() != undefined) && this.getCategoryColors() != "" && this.getCategoryColors().getCategoryColor().length > 0 && IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName()) && this.m_categoryJSON.length > 0) {
        var categoryColors = [];
        if (this.m_subCategoryNames.length > 0 && this.m_categoryNames.length == 0) {
            categoryColors = this.getCategoryColors().getCategoryColorsForCategoryNames(this.getSubCategoryData()[0], this.m_categoryFieldColor);
        } else {
            categoryColors = this.getCategoryColors().getCategoryColorsForCategoryNames(this.getCategoryData()[0], this.m_categoryFieldColor);
        }
        for (var i = 0; i < this.visibleSeriesInfo.seriesData.length; i++) {
            this.m_seriesColorsArray[i] = [];
            for (var j = 0; j < this.visibleSeriesInfo.seriesData[i].length; j++) {
                this.m_seriesColorsArray[i][j] = categoryColors[j];
            }
        }
    } else if (!IsBoolean(this.m_designMode) && (this.getSubCategoryColors() != undefined) && this.getSubCategoryColors() != "" && this.getSubCategoryColors().getSubCategoryColor().length > 0 && IsBoolean(this.getSubCategoryColors().getshowColorsFromSubCategoryName()) && this.m_subCategoryJSON.length > 0) {
        var categoryColors = this.getSubCategoryColors().getSubCategoryColorsForSubCategoryNames(this.getSubCategoryData()[0], this.m_categoryFieldColor);
        for (var i = 0; i < this.visibleSeriesInfo.seriesData.length; i++) {
            this.m_seriesColorsArray[i] = [];
            for (var j = 0; j < this.visibleSeriesInfo.seriesData[i].length; j++) {
                this.m_seriesColorsArray[i][j] = categoryColors[j];
            }
        }
    } else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && (!IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName()) || this.getCategoryColors().getCategoryColor().length == 0) && this.getConditionalColors() != "" && this.getConditionalColors() != undefined && this.getConditionalColors().getConditionalColor().length > 0 && !IsBoolean(isemptyCat)) {
        var conditionalColors = this.getConditionalColors().getConditionalColorsForConditions(this.visibleSeriesInfo.seriesName, this.visibleSeriesInfo.seriesColor, this.visibleSeriesInfo.seriesData, this);
        for (var i = 0; i < this.visibleSeriesInfo.seriesData.length; i++) {
            this.m_seriesColorsArray[i] = [];
            for (var j = 0; j < this.visibleSeriesInfo.seriesData[i].length; j++) {
                this.m_seriesColorsArray[i][j] = conditionalColors[i][j];
            }
        }
    } else {
        var seriesColors = this.visibleSeriesInfo.seriesColor;
        for (var i = 0; i < this.visibleSeriesInfo.seriesData.length; i++) {
            this.m_seriesColorsArray[i] = [];
            for (var j = 0; j < this.visibleSeriesInfo.seriesData[i].length; j++) {
                this.m_seriesColorsArray[i][j] = seriesColors[i];
            }
        }
    }
};

/** @description Tranforming dimension of 2D array **/
GroupColumnChart.prototype.updateSeriesData = function(array) {
    var arr = [];
    if ((array != undefined && array !== null && array !== "") && array.length != 0) {
        for (var i = 0; i < array[0].length; i++) {
            arr[i] = [];
            for (var j = 0; j < array.length; j++) {
                arr[i][j] = array[j][i];
            }
        }
    }
    return arr;
};

/** @description Drawing of Title **/
GroupColumnChart.prototype.drawTitle = function() {
    this.m_title.draw();
};

/** @description Drawing of SubTitle **/
GroupColumnChart.prototype.drawSubTitle = function() {
    this.m_subTitle.draw();
};

/** @description Drawing of XAxis**/
GroupColumnChart.prototype.drawXAxis = function() {
    this.createHorizontalLineGroup('horizontallinegrp');
    if (IsBoolean(this.m_showverticalmarkerline))
        this.drawPartitionLine();
    if (IsBoolean(this.m_showcatpartitioner))
        this.drawCategoryPartitionLine();
    this.createXAxisMarkerLabelGroup('xaxislabelgrp');
    this.createXAxisCategoryMarkerLabelGroup('xaxiscategorylabelgrp');
    this.createXAxisSubCategoryMarkerLabelGroup('xaxissubcategorylabelgrp');
    this.drawHorizontalPartLine();
    this.m_xAxis.markXaxis();
    this.m_xAxis.drawXAxis();
    this.m_xAxis.drawSubCategory();
    this.m_xAxis.drawCategory();
};

/** @description Drawing Vertical Partiton line between category and subcategory**/
GroupColumnChart.prototype.drawHorizontalPartLine = function() {
    var startY = this.getStartY() + this.getSubCatTextMargin() + 10;
    this.drawLine(this.getStartX(), startY, this.getEndX(), startY);
};

/** @description centralized method to create group for xaxis , yaxis , data label, etc  **/
GroupColumnChart.prototype.createXAxisCategoryMarkerLabelGroup = function(name) {
    var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute('id', name + this.m_objectid);
    group.setAttribute('class', name);
    $(group).css({
        "font-family": selectGlobalFont(this.m_xAxis.getLabelFontFamily()),
        "font-style": this.m_xAxis.getLabelFontStyle(),
        "font-size": this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px",
        "font-weight": this.m_xAxis.getLabelFontWeight(),
        "text-decoration": this.m_xAxis.getLabelTextDecoration()
    });
    $("#" + this.svgContainerId).append(group);
    //return group;
};

GroupColumnChart.prototype.createXAxisSubCategoryMarkerLabelGroup = function(name) {
    var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute('id', name + this.m_objectid);
    group.setAttribute('class', name);
    $(group).css({
        "font-family": selectGlobalFont(this.m_xAxis.getLabelFontFamily()),
        "font-style": this.m_xAxis.getLabelFontStyle(),
        "font-size": this.fontScaling(this.m_xAxis.m_subcategoryfontsize) + "px",
        "font-weight": this.m_xAxis.getLabelFontWeight(),
        "text-decoration": this.m_xAxis.getLabelTextDecoration()
    });
    $("#" + this.svgContainerId).append(group);
    //return group;
};

/** @description Calculating StartX,StartY,EndX,EndY for partition line**/
GroupColumnChart.prototype.drawCategoryPartitionLine = function() {
    var startPoint = this.getStartY() + this.getSubCatTextMargin() + this.m_yAxis.m_axislinetotextgap;
    if (this.m_subcategoryorientation == "left")
        startPoint = this.getStartY() + this.getCatTextMargin() + this.getSubCatTextMargin() + this.m_yAxis.m_axislinetotextgap;
    else
        startPoint = this.getStartY() + this.getCatTextMargin() + this.m_yAxis.m_axislinetotextgap;

    var boxSize = this.calculateCategoryBoxSize();
    for (var key in boxSize) {
        this.drawLine(boxSize[key], this.getStartY() * 1, boxSize[key], startPoint);
    }
};

/** @description Drawing Line which will create partition between the category Data**/
GroupColumnChart.prototype.drawPartitionLine = function() {
    var startPoint = this.getStartX();
    this.drawLine(startPoint, this.getStartY() * 1 + 1 * 1, this.getEndX() * 1 - 1 * 1, this.getStartY() * 1 + 1 * 1);
    var boxSize = this.calculateCategoryBoxSize();
    for (var key in boxSize) {
        this.drawLine(boxSize[key], this.getStartY() * 1, boxSize[key], this.getEndY() * 1);
    }
};

/** @description Drawing Y Axis**/
GroupColumnChart.prototype.drawYAxis = function() {
    if (IsBoolean(this.m_showhorizontalmarkerline))
        this.m_yAxis.horizontalMarkerLines();
    if (IsBoolean(this.m_zeromarkerline) && !IsBoolean(this.m_basezero) && IsBoolean(this.m_yAxis.hasNegativeAxisMarker(this.m_yAxisMarkersArray)))
        this.m_yAxis.zeroMarkerLine();
    this.createYAxisMarkerLabelGroup('yaxislabelgrp');
    this.m_yAxis.drawYAxis();
    this.m_yAxis.markYaxis();
};

/** @description Drawing Vertical Partiton line between category and subcategory**/
GroupColumnChart.prototype.drawVerticalPartLine = function() {
    var startX = this.getStartX() - this.getSubCatTextMargin();
    this.drawLine(startX, this.getStartY(), startX, this.getEndY());
};

/** @description Will Draw ChartFrame and gradient if given any, default is #ffffff **/
GroupColumnChart.prototype.drawChartFrame = function() {
    this.m_chartFrame.drawSVGFrame();
    this.getBGGradientColorToContainer();
};

/** @description Will generate the gradient and fill in background of chart  **/
GroupColumnChart.prototype.getBGGradientColorToContainer = function() {
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

/** @description overrite drawObject Method  because of ChartFrame and Titles are drawn on SVG  **/
GroupColumnChart.prototype.drawObject = function() {
    this.drawSVGObject();
};

/** @description Draw Bar Chart**/
GroupColumnChart.prototype.drawGroupColumnChart = function() {
    if (this.m_chartbase == "gradient1") {
        for (var j = 0, outerLength = this.visibleSeriesInfo.seriesName.length; j < outerLength; j++) {
            for (var i = 0, innerLength = this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[j]].xPixel.length; i < innerLength; i++) {
                this.createGradient1(this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[j]].barStackArray[i].stackColor, j, i);
            }
        }
    } else if (this.m_chartbase == "gradient2") {
        for (var j = 0, length = this.visibleSeriesInfo.seriesName.length; j < length; j++) {
            for (var i = 0, innerLength = this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[j]].xPixel.length; i < innerLength; i++) {
                this.createGradient2(this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[j]].barStackArray[i].stackColor, j, i);
            }
        }
    } else if (this.m_chartbase == "gradient3") {
        for (var j = 0, length = this.visibleSeriesInfo.seriesName.length; j < length; j++) {
            for (var i = 0, innerLength = this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[j]].xPixel.length; i < innerLength; i++) {
                this.createGradient3(this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[j]].barStackArray[i].stackColor, j, i);
            }
        }
    }
    for (var k = 0; k < this.visibleSeriesInfo.seriesName.length; k++) {
        var barSeriesArray = this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[k]];
        this.createStackGroup(barSeriesArray, "stackgrp", k, this.visibleSeriesInfo.seriesName[k]);
        barSeriesArray.drawBarSeries(k);
    }
};

/** @description drawing Data Label on bar chart**/
GroupColumnChart.prototype.drawDataLabel = function() {
	this.m_overlappeddatalabelarrayX=[];
	this.m_overlappeddatalabelarrayY=[];
    for (var i = 0, length = this.m_seriesNames.length; i < length; i++) {
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
            var valueText = this.m_valueTextSeries[this.m_seriesNames[i]];
            if (IsBoolean(this.m_seriesDataLabelProperty[i].showDataLabel)) {
                this.createDataLabelGroup(valueText, 'datalabelgrp', i, this.m_seriesNames[i]);
                this.m_valueTextSeries[this.m_seriesNames[i]].drawSVGValueTextSeries();
            }
        }
    }
};
/** @description Get Sum of Array**/
GroupColumnChart.prototype.getArraySUM = function(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] < 0)
            arr[i] = arr[i] * (-1);
        if (!isNaN(arr[i]))
            sum = sum * 1 + arr[i] * 1;
    }
    return sum;
};

/** @description Transforming array values and assigning into new Array **/
GroupColumnChart.prototype.getUpdateSeriesDataWithCategory = function(arr) {
    var updateArray = [];
    for (var i = 0; i < arr[0].length; i++) {
        updateArray[i] = [];
        for (var j = 0; j < arr.length; j++) {
            updateArray[i][j] = arr[j][i];
        }
    }
    return updateArray;
};

/** @description Converting series data value into percent value**/
GroupColumnChart.prototype.setPercentageForHundred = function() {
    var serData = this.getUpdateSeriesDataWithCategory(this.visibleSeriesInfo.seriesData);
    this.m_SeriesDataInPerForHundredChart;
    var updateValue = [];
    for (var i = 0; i < serData.length; i++) {
        var totalSerData = this.getArraySUM(serData[i]);
        updateValue[i] = [];
        for (var j = 0; j < serData[i].length; j++) {
            if (serData[i][j] !== "" && (!isNaN(serData[i][j])))
                updateValue[i][j] = (serData[i][j] / totalSerData) * 100;
            else
                updateValue[i][j] = 0;
        }
    }
    if (updateValue.length > 0)
        this.m_SeriesDataInPerForHundredChart = this.getUpdateSeriesDataForHundredPercentageChart(updateValue);
};

/** @description Getter for series data when chart type is hundred percent**/
GroupColumnChart.prototype.getPercentageForHundred = function() {
    return this.m_SeriesDataInPerForHundredChart;
};

/** @description Updating series data and converting it into percentage when chart type is hundred percent chart**/
GroupColumnChart.prototype.getUpdateSeriesDataForHundredPercentageChart = function(arr) {
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

/** @description Get bar details on which mouse hovered currently **/
GroupColumnChart.prototype.getToolTipData = function(mouseX, mouseY) {
    var toolTipData;
    var seriesData = [];
    /**Remove this.isEmptyCategory because tooltip was not drawing for the data with no subcategory.*/
    if (!IsBoolean(this.m_isEmptySeries) && IsBoolean(this.isVisibleSeries()) && IsBoolean(this.m_customtextboxfortooltip.dataTipType !== "None")) {
        if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
            this.xPositions = this.m_calculation.getXPositionforToolTip();
            seriesData = this.visibleSeriesInfo.seriesData;
            var percentageData = this.getPercentageForHundred();
            for (var i = 0; i < this.xPositions.length; i++) {
                if (mouseX <= (this.xPositions[i] * 1 + this.m_barWidth * 1) && (mouseX >= this.xPositions[i] * 1)) {
                    toolTipData = {};
                    toolTipData.cat = "";
                    toolTipData.subcat = "";
                    toolTipData["data"] = new Array();

                    if (!IsBoolean(this.isEmptyCategory))
                        toolTipData.cat = this.getCategoryData()[0][i];
                    if (!IsBoolean(this.isEmptySubCategory))
                        toolTipData.subcat = this.getSubCategoryData()[0][i];
                    if (IsBoolean(this.m_customtextboxfortooltip.dataTipType == "Default")) {
                        for (var j = 0, k = 0; j < this.visibleSeriesInfo.seriesData.length; j++) {
                            var data = [];
                            var newVal;
                            //data[0] = this.visibleSeriesInfo.seriesColor[j];
                            data[1] = this.visibleSeriesInfo.seriesDisplayName[j];
                            /*Added to show drill color or indicator color in the tooltip*/
                            if (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) {
                                data[0] = this.m_drillColor;
                            } else {
                                data[0] = this.visibleSeriesInfo.seriesColor[j];
                            }
                            if (seriesData[j][i] == "" || isNaN(seriesData[j][i]) || seriesData[j][i] == null || seriesData[j][i] == "null") {
                                newVal = seriesData[j][i];
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
                                if (IsBoolean(this.m_tooltipproperties.showcummulativesum)) {
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
};

/** @description Get Drill Color on which bar it is clicked**/
GroupColumnChart.prototype.getDrillColor = function(mouseX, mouseY) {
    if (!IsBoolean(this.m_isEmptySeries)) {
        if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
            var barWidth;
            /**Added to resolve BDD-682 issue*/
            var drillMinStackHeight = (this.m_charttype == "stacked") ? 0 : this.m_drillminstackheight;
            for (var i = 0; i < this.m_xPositionArray.length; i++) {
                for (var j = 0; j <= this.m_xPositionArray[i].length; j++) {
                    if (this.m_barWidthArray[i][j] * 1 < 0) {
                        barWidth = (this.m_barWidthArray[i][j] * 1 < -drillMinStackHeight) ? this.m_barWidthArray[i][j] * 1 : -drillMinStackHeight;
                        var range1 = this.m_yPositionArray[i][j] * 1;
                        var range2 = this.m_yPositionArray[i][j] * 1 - barWidth;
                    } else {
                        barWidth = (IsBoolean(this.m_basezero) && (this.visibleSeriesInfo.seriesData[i][j] * 1 < 0)) ? 0 : (this.m_barWidthArray[i][j] * 1 > drillMinStackHeight) ? this.m_barWidthArray[i][j] * 1 : drillMinStackHeight;
                        var range1 = this.m_yPositionArray[i][j] * 1;
                        var range2 = this.m_yPositionArray[i][j] * 1 + barWidth;
                    }
                    if(this.m_charttype == "clustered"){
						if(mouseY >= range1 && mouseY <= range2 && mouseX >= this.m_xPositionArray[i][j] * 1 && mouseX <= (this.m_xPositionArray[i][j] * 1 + (this.m_barWidth * 1/this.m_xPositionArray.length))){
							return i;
						}
					}else{
                    if (mouseY >= range1 && mouseY <= range2 && mouseX >= this.m_xPositionArray[i][j] * 1 && mouseX <= (this.m_xPositionArray[i][j] * 1 + this.m_barWidth * 1)) {
                        return i;
                    }
                }
                }
            }
        }
    }
};

/** @description Calling DrawToolTip method when series is not empty**/
GroupColumnChart.prototype.drawTooltip = function(mouseX, mouseY) {
    if (!IsBoolean(this.m_isEmptySeries) && !this.m_designMode) {
        var toolTipData = this.getToolTipData(mouseX, mouseY);
        if (this.m_hovercallback && this.m_hovercallback != "") {
            this.drawCallBackContent(mouseX, mouseY, toolTipData);
        } else {
            this.drawTooltipContent(toolTipData);
        }
    }
};

/** @description Converting selected bar details into DOM element for tooltip**/
GroupColumnChart.prototype.drawTooltipContent = function(toolTipData) {
    this.m_tooltip.draw(toolTipData, this.m_componenttype);
};

/** @description Getting Drilled bar and fetching bar information**/
GroupColumnChart.prototype.getDrillDataPoints = function(mouseX, mouseY) {
    if (!IsBoolean(this.m_isEmptySeries) && IsBoolean(this.isVisibleSeries())) {
        if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
            var barWidth;
            var isDrillIndexFound = false;
            var drillMinStackHeight = (this.m_charttype == "stacked") ? 0 : this.m_drillminstackheight;
            for (var i = 0; i < this.m_xPositionArray.length; i++) {
                for (var j = 0; j < this.m_xPositionArray[i].length; j++) {
                    if (this.m_barWidthArray[i][j] * 1 < 0) {
                        barWidth = (this.m_barWidthArray[i][j] * 1 < -drillMinStackHeight) ? this.m_barWidthArray[i][j] * 1 : -drillMinStackHeight;
                        var range1 = this.m_yPositionArray[i][j] * 1 + barWidth;
                        var range2 = this.m_yPositionArray[i][j] * 1;
                    } else {
                        barWidth = (IsBoolean(this.m_basezero) && (this.visibleSeriesInfo.seriesData[i][j] * 1 < 0)) ? 0 : (this.m_barWidthArray[i][j] * 1 > drillMinStackHeight) ? this.m_barWidthArray[i][j] * 1 : drillMinStackHeight;
                        var range1 = this.m_yPositionArray[i][j] * 1;
                        var range2 = this.m_yPositionArray[i][j] * 1 + barWidth;
                    }
                    if (mouseY >= range1 && mouseY <= range2 && mouseX >= this.m_xPositionArray[i][j] * 1 && mouseX <= (this.m_xPositionArray[i][j] * 1 + (this.m_barWidth * 1))) {
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
                        return {
                            "drillRecord": fieldNameValueMap,
                            "drillColor": drillColor
                        };
                    }
                }
            }
            if (this.m_charttype == "stacked" && !isDrillIndexFound) {
                for (var k = 0, length = this.xPositions.length; k < length; k++) {
                    if (mouseY <= (this.xPositions[k] * 1 + this.m_barWidth * 1) && (mouseY >= this.xPositions[k] * 1)) {
                        for (var l = 0, innerlength = this.m_xPositionArray.length; l < innerlength; l++) {
                            if (((mouseX >= this.m_xPositionArray[l][k]) && (mouseX <= this.m_xPositionArray[l][k] + this.m_drillminstackheight)) || ((mouseX <= this.m_xPositionArray[l][k] + this.m_barWidthArray[l][k]) && (mouseX >= this.m_xPositionArray[l][k] - this.m_drillminstackheight))) {
                                var fieldNameValueMap = this.getFieldNameValueMap(k);
                                var drillColor = this.m_drillColor;
                                var drillField = "";
                                var drillDisplayField = "";
                                var drillValue = "";
                                fieldNameValueMap.drillField = drillField;
                                fieldNameValueMap.drillDisplayField = drillDisplayField;
                                fieldNameValueMap.drillValue = drillValue;
                                isDrillIndexFound = true;
                                fieldNameValueMap.drillIndex = j;
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

/** @description Creating FieldValue Map where key is category,subcategory,series field name and values will be respective category,subcategory,series 
 * Can not use chart.js method as groupbar chart data is re-shuffled and mapped as per category/ subcategory
 * which might break in the drill and pass wrong data **/
/*GroupColumnChart.prototype.getFieldNameValueMap = function(j) {
    var fieldNameValueMap = {};
    for (var i = 0; i < this.getCategoryNames().length; i++) {
        fieldNameValueMap[this.getCategoryNames()[i]] = this.getCategoryData()[i][j];
    }
    for (var i = 0; i < this.getSubCategoryNames().length; i++) {
        fieldNameValueMap[this.getSubCategoryNames()[i]] = this.getSubCategoryData()[i][j];
    }
    for (var i = 0; i < this.getSeriesNames().length; i++) {
        fieldNameValueMap[this.getSeriesNames()[i]] = this.getSeriesData()[i][j];
    }
    if(IsBoolean(this.m_drilltoggle)){
		this.m_drilltoggle = false;
	} else {
		this.m_drilltoggle = true;
	}
    return fieldNameValueMap;
};*/

/** @description Creating GroupColumnCalculation class**/
function GroupColumnCalculation() {
    this.xPositionArray = [];
    this.yAxisPixelArray = [];
    this.barGap = 10;
    this.m_yAxisText = "";
    this.m_numberOfMarkers = 6;
};

/** @description Initialization of GroupColumnCalculation **/
GroupColumnCalculation.prototype.init = function(chart, subcategorydata, seriesdata, completeData) {
    this.m_chart = chart;
    this.m_chartData = completeData;
    this.yAxisData = seriesdata;
    this.xAxisData = subcategorydata; //this.m_chart.getVisibleSeriesData(convertArrayType(seriesdata));
    this.m_chartType = this.m_chart.getChartType();

    this.barGap = 10;
    this.dataMap = this.m_chart.dataMap;
    this.startX = this.m_chart.getStartX();
    this.startY = this.m_chart.getStartY();
    this.endX = this.m_chart.getEndX();
    this.endY = this.m_chart.getEndY();

    this.calculateBarWidth();
    this.setRatio();
    this.setXPositionArray();
    this.setstackHeightArray();
    this.setYPositionArray();
};

/** @description Getter for start X**/
GroupColumnCalculation.prototype.getStartX = function() {
    return this.startX * 1;
};

/** @description Getter for Max Value**/
GroupColumnCalculation.prototype.getMaxValue = function() {
    return this.m_chart.max;
};

/** @description Getter for Min Value**/
GroupColumnCalculation.prototype.getMinValue = function() {
    return this.m_chart.min;
};

/** @description Getter for Y Axis Text**/
GroupColumnCalculation.prototype.getYAxisText = function() {
    return this.m_chart.m_yAxisText;
};

/** @description Getter for X Axis Marker Array**/
GroupColumnCalculation.prototype.getXAxisMarkersArray = function() {
    return this.m_chart.m_yAxisMarkersArray;
};

/** @description Calculating Bar Width when chart type is different-2**/
GroupColumnCalculation.prototype.calculateBarWidth = function() {
    var numberOfColumns = this.xAxisData.length;
    if (IsBoolean(this.m_chart.m_mergesubcategory) && (this.m_chart.m_categoryNames[0] != undefined) && (this.m_chart.m_subCategoryNames[0] != undefined)) {
        var count = 0;
        var i;
        for (i in this.dataMap) {
            if (this.dataMap.hasOwnProperty(i)) {
                count++;
            }
        }
        numberOfColumns = count;
    }
    var totalGap = ((numberOfColumns * 1)) * this.barGap;
    var availableDrawWidth = this.getDrawWidth() * 1;
    if (this.m_chart.m_controlbarwidth == "auto") {
        var barWidth = (availableDrawWidth / this.xAxisData.length);
        barWidth = (barWidth * this.m_chart.m_barwidth) / 100;
    } else {
        if (this.m_chart.m_controlbarwidth < (availableDrawWidth / numberOfColumns)) {
            var barWidth = this.m_chart.m_controlbarwidth;
        } else {
            var barWidth = (availableDrawWidth / numberOfColumns);
            barWidth = (barWidth * this.m_chart.m_barwidth) / 100;
        }
    }
    this.setBarWidth(barWidth);
    this.setColumnGap(barWidth, numberOfColumns);
};

/** @description Setter for Bar Width**/
GroupColumnCalculation.prototype.setBarWidth = function(barwidth) {
    this.barWidth = barwidth;
};

/** @description Setter for Column Gap**/
GroupColumnCalculation.prototype.setColumnGap = function(barWidth, numberOfColumns) {
    var totalBarwidth = barWidth * this.xAxisData.length;
    var totalGap = this.getDrawWidth() - totalBarwidth;
    this.barGap = totalGap / ((numberOfColumns * 1));
};

/** @description Draw Base line**/
GroupColumnCalculation.prototype.drawBaseLine = function() {
    ctx.beginPath();
    ctx.lineWidth = "0.4";
    ctx.strokeStyle = "#000";
    ctx.moveTo(this.getStartX(), this.startY);
    ctx.lineTo(this.getStartX(), this.endY);
    ctx.stroke();
    ctx.closePath();
};

/** @description Setter for Ratio**/
GroupColumnCalculation.prototype.setRatio = function() {
    var diff = this.getMaxValue() - this.getMinValue();
    if (diff > 0)
        this.ratio = this.getDrawHeight() / (diff);
    else
        this.ratio = 1;
    //this.ratio = this.getDrawWidth() / (this.getMaxValue() - this.getMinValue());
};

/** @description Getter for Draw Height**/
GroupColumnCalculation.prototype.getDrawHeight = function() {
    this.drawHeight = (this.startY - this.endY);
    return this.drawHeight;
};

/** @description Getter for Draw Width**/
GroupColumnCalculation.prototype.getDrawWidth = function() {
    this.drawWidth = (this.endX * 1) - (this.startX * 1);
    return this.drawWidth;
};

/** @description Getter for Bar Gap**/
GroupColumnCalculation.prototype.getBarGap = function() {
    return this.barGap;
};

/** @description Getter for Bar Width**/
GroupColumnCalculation.prototype.getbarWidth = function() {
    return this.barWidth;
};

/** @description Getter for Ratio**/
GroupColumnCalculation.prototype.getRatio = function() {
    return this.ratio;
};

/** @description Getter for X Position Array**/
GroupColumnCalculation.prototype.getXPositionArray = function() {
    return this.xPositionArray;
};

/** @description Setter for X Position Array**/
GroupColumnCalculation.prototype.setXPositionArray = function() {
    var xPositionArray = [];
    var clusteredBarPadding = (this.getbarWidth() - this.getbarWidth()*this.m_chart.clusteredbarpadding)/2;
    if (IsBoolean(this.m_chart.m_mergesubcategory) && (this.m_chart.m_categoryNames[0] != undefined) && (this.m_chart.m_subCategoryNames[0] != undefined)) {
		//when mergeSubcategory is ON
		var CountArray = [];
		var count = 0;
		var a = 0;
		for (Object.keys(this.dataMap)[a] in this.dataMap) {
			if(a < Object.keys(this.dataMap).length){
			for (var key1 in this.dataMap[Object.keys(this.dataMap)[a]]) {
				count++;
			}
			a++;
			}
			CountArray.push(count);
		}
		var startPoint = 0;
		var barGap = (this.getBarGap() * 1)/2;
		var startX = this.startX;
		for (var k = 0; k < CountArray.length; k++) {
			startX = startX + barGap;
			for (var i = startPoint; i < CountArray[k]; i++) {
				xPositionArray[i] = [];
				for (var j = 0,x=0; j < this.yAxisData.length; j++) {
					if(this.m_chart.m_charttype == "clustered"){
						xPositionArray[i][j] = (startX) * 1+((this.getbarWidth() * 1) * i) + (this.getbarWidth()/this.yAxisData.length)*x + clusteredBarPadding;
						x++;
					}
					else
					{
						xPositionArray[i][j] = (startX) * 1 + ((this.getbarWidth() * 1) * i) + (this.getbarWidth()/this.xAxisData.length)*x + clusteredBarPadding;//+ (this.getBarGap() / 2) + (this.getBarGap() * 1) * (i);//
				    }
				}
				//xPositionArray[i] = xPositionArray[i].reverse();
			}
			startPoint = CountArray[k];
			barGap = this.getBarGap();
		}
		//xPositionArray = xPositionArray.reverse();
		this.xPositionArray = this.transformXPixelArray(xPositionArray);
	}
    else{
    for (var i = 0; i < this.yAxisData[0].length; i++) {
    	xPositionArray[i] = [];
		for (var j = 0,k=0; j < this.yAxisData.length; j++) {
			if(this.m_chart.m_charttype == "clustered"){
				xPositionArray[i][j] = (this.startX) * 1 + (this.getbarWidth()/this.yAxisData.length)*k + (this.getBarGap() / 2) + ((this.getBarGap() * 1) * (i))+((this.getbarWidth() * 1) * i)+ clusteredBarPadding;
				k++;
			}
			else{
			xPositionArray[i][j] = (this.startX) * 1 + (this.getbarWidth() * 1) * i + (this.getBarGap() / 2) + (this.getBarGap() * 1) * (i);//(this.getbarWidth()/this.xAxisData.length)*k + clusteredBarPadding
			}
		}
	  }
    }
    this.xPositionArray = this.transformXPixelArray(xPositionArray);
};

GroupColumnCalculation.prototype.transformXPixelArray = function(m_xAxisPixelArray) {
    var xPixelsarr = [];
    for (var i1 = 0, length = this.yAxisData.length; i1 < length; i1++) {
        xPixelsarr[i1] = [];
        for (var j1 = 0, innerlength = this.yAxisData[0].length; j1 < innerlength; j1++) {
            xPixelsarr[i1][j1] = m_xAxisPixelArray[j1][i1];
        }
    }
    return xPixelsarr;
};

/** @description Getter for Y Position Array**/
GroupColumnCalculation.prototype.getYPositionArray = function() {
    return this.yPositionArray;
};

/** @description Setting each bar height into this.m_stackHeightArray **/
GroupColumnCalculation.prototype.setstackHeightArray = function() {
    var stackHeightArray = [];
    if (this.m_chartType.toLowerCase() == "stacked" || this.m_chartType.toLowerCase() == "100%" || this.m_chartType.toLowerCase() == "") {
        this.arrangeStackHeight();
    } else {
        var value;
        var ratio = this.getRatio();
        var min = this.getMinValue();
        for (var i = 0, length = this.yAxisData.length; i < length; i++) {
            stackHeightArray[i] = [];
            for (var j = 0, innerlength = this.yAxisData[i].length; j < innerlength; j++) {
                stackHeightArray[i][j] = this.getRatio();
            }
        }
        this.stackHeightArray = stackHeightArray;
    }
};

/** @description Setter for Y Position Array**/
GroupColumnCalculation.prototype.setYPositionArray = function() {
    this.yPositionArray = [];
    if (this.m_chartType.toLowerCase() == "stacked" || this.m_chartType == "100%" || this.m_chartType == "") {
        this.yPositionArray = this.setyPixelArrayForStackedOrHundredPercent();
    }
    //this.yPositionArray = convertArrayType(this.yPositionArray);
    else{
    	for (var i = 0; i < this.yAxisData.length; i++) {
    		this.yPositionArray[i] = [];
    		this.stackHeightArray[i] = [];
    		for (var j = 0; j < this.yAxisData[i].length; j++) {
    			var ratio1 = this.getRatio();
    			var min = this.getMinValue();
    			var max = this.getMaxValue();
    			if(this.m_chart.m_charttype == "clustered"){
    				if(max<0){
    					/**Added for condition when auto axes true & base zero false and dataset contains all negative values.*/
    					this.stackHeightArray[i][j] = (this.yAxisData[i][j]-max) * ratio1;
    					this.yPositionArray[i][j] = (this.yAxisData[i][j]>0)?((this.startY) * 1+(min-max)*ratio1-this.stackHeightArray[i][j]):((this.startY) * 1+(min-max)*ratio1);
    				}else if(min<0){
    					this.stackHeightArray[i][j] = (this.yAxisData[i][j]) * ratio1;
    					this.yPositionArray[i][j] = (this.yAxisData[i][j]>0)?((this.startY) * 1+min*ratio1-this.stackHeightArray[i][j]):((this.startY) * 1+min*ratio1);
    				}
    				else{
    					this.stackHeightArray[i][j] = (this.yAxisData[i][j] - min) * ratio1;
    					this.yPositionArray[i][j] = (this.yAxisData[i][j]>0)?((this.startY) * 1-this.stackHeightArray[i][j]):((this.startY) * 1);
    					/**Added for when subcategory is not their drawing were differing*/
    				}
    			}
    			this.stackHeightArray[i][j] = Math.abs(this.stackHeightArray[i][j]);
    		}
    		}
    	 this.mangeStackHeightLimit();
    	}
};

/* @description added this method for calculating stackheight & yposition in clustered*/
GroupColumnCalculation.prototype.mangeStackHeightLimit = function(){
	for(var i=0;i<this.yPositionArray.length;i++)
	{
		for(var j=0;j<this.yPositionArray[i].length;j++)
		{
			if(this.yPositionArray[i][j]>this.m_chart.getStartY())
			{
				this.yPositionArray[i][j] = this.m_chart.getStartY();
			}
			if(this.yPositionArray[i][j]<this.m_chart.getEndY())
			{
				this.stackHeightArray[i][j] = this.stackHeightArray[i][j]-(this.m_chart.getEndY()-this.yPositionArray[i][j] );
				this.yPositionArray[i][j] = this.m_chart.getEndY();
			}
			var stackWidth = this.yPositionArray[i][j]-this.stackHeightArray[i][j];
			if(this.m_chart.getStartY()<this.stackHeightArray[i][j])
			{
				this.stackHeightArray[i][j] = (this.m_chart.getStartY());//this.stackHeightArray[i][j] - 
			}
			if(stackWidth>this.m_chart.getStartY())
			{
				this.stackHeightArray[i][j] = this.stackHeightArray[i][j] + (stackWidth-this.m_chart.getStartY());
			}
		}
	}
};

/** @description Calculating the Y Pixel Array when chart Type is Stacked or Hundred Percent**/
GroupColumnCalculation.prototype.setyPixelArrayForStackedOrHundredPercent = function() {
    var yparray = [];
    var positivePointerArray = [];
    var negativePointerArray = [];
    var ratio = this.getRatio();
    var minAxis = this.getMinValue() * 1;
    var maxAxis = this.getMaxValue() * 1;
    var yAxisData = (this.m_chartType === "100%") ? this.m_chart.getPercentageForHundred() : this.yAxisData;
    var yAxisTotData = getDuplicateArray(yAxisData);
    for (var i = 0, length = yAxisData.length; i < length; i++) {
        yparray[i] = [];
        positivePointerArray[i] = [];
        negativePointerArray[i] = [];
        for (var j = 0, innerlength = yAxisData[i].length; j < innerlength; j++) {
            if (isNaN(yAxisData[i][j])) {
                yAxisData[i][j] = "";
            }
            if (i === 0) {
                if (yAxisData[i][j] >= 0) {
                    if (minAxis > 0 && maxAxis > 0) {
                        if (maxAxis < yAxisData[i][j] * 1) {
                            yparray[i][j] = (this.startY * 1) - (ratio * (maxAxis - minAxis));
                        } else {
                            yparray[i][j] = (this.startY * 1) - (ratio * yAxisData[i][j]) + (ratio * minAxis);
                        }
                    } else {
                        if (maxAxis < yAxisData[i][j] * 1) {
                            yparray[i][j] = (this.startY * 1) - (ratio * maxAxis) + (ratio * minAxis);
                        } else {
                            yparray[i][j] = (this.startY * 1) - (ratio * yAxisData[i][j]) + (ratio * minAxis);
                        }
                    }
                    positivePointerArray[i][j] = yparray[i][j];
                    negativePointerArray[i][j] = this.startY * 1 + (ratio * this.getMinValue());
                } else {
                	if ((minAxis > 0 && maxAxis > 0) || (minAxis < 0 && maxAxis < 0) ){
                        yparray[i][j] = this.startY * 1 - (ratio * (maxAxis - minAxis));
                	}
                	else{
                		 yparray[i][j] = this.startY * 1 +(ratio * (minAxis));//this.startY * 1 - (ratio * (maxAxis - minAxis));
                	}
                	//yparray[i][j] = this.startY * 1 +(ratio * (minAxis));
                	positivePointerArray[i][j] = yparray[i][j];
                    negativePointerArray[i][j] = yparray[i][j] - (ratio * yAxisData[i][j]);
                }
            } else {
                yAxisTotData[i][j] = ((yAxisTotData[i - 1][j] * 1) > 0) ? ((yAxisTotData[i - 1][j] * 1) + (yAxisData[i][j] * 1)) : (yAxisData[i][j] * 1);//yAxisTotData[i - 1][j] + yAxisData[i][j];
                if (yAxisData[i][j] >= 0) {
                	if (maxAxis < yAxisTotData[i][j] * 1) {
                        yparray[i][j] = (positivePointerArray[i - 1][j] * 1) - (ratio * yAxisData[i][j]) + (ratio * (yAxisTotData[i][j] - maxAxis));
                    } else {
                        yparray[i][j] = (positivePointerArray[i - 1][j] * 1) - (ratio * yAxisData[i][j]);
                    }
                    /*if (minAxis > 0 && maxAxis > 0) {
                        if (maxAxis < yAxisTotData[i][j] * 1) {
                            yparray[i][j] = (positivePointerArray[i - 1][j] * 1) - (ratio * yAxisData[i][j]) + (ratio * (yAxisTotData[i][j] - maxAxis));
                        } else {
                            yparray[i][j] = (positivePointerArray[i - 1][j] * 1) - (ratio * yAxisData[i][j]);
                        }
                    } else {
                        if (maxAxis < yAxisTotData[i][j] * 1) {
                            yparray[i][j] = (positivePointerArray[i - 1][j] * 1) - (ratio * yAxisData[i][j]) + (ratio * (yAxisTotData[i][j] - maxAxis));
                        } else {
                            yparray[i][j] = (positivePointerArray[i - 1][j] * 1) - (ratio * yAxisData[i][j]);
                        }
                    }*/
                    positivePointerArray[i][j] = yparray[i][j];
                    negativePointerArray[i][j] = negativePointerArray[i-1][j];//this.startY * 1 + (ratio * this.getMinValue());
                } else {
                    yparray[i][j] = negativePointerArray[i - 1][j];
                    negativePointerArray[i][j] = this.startY * 1 + (ratio * this.getMinValue()) - (ratio * yAxisData[i][j]);
                    positivePointerArray[i][j] = positivePointerArray[i-1][j];
                }
            }
        }
    }
    return yparray;
};

/** @description For Different-2 Chart Type calculating stack height**/
GroupColumnCalculation.prototype.arrangeStackHeight = function() {
    var stackHeightArray = [];
    var minAxis = this.getMinValue() * 1;
    var maxAxis = this.getMaxValue() * 1;
    var ratio = this.getRatio();
    var yAxisData = (this.m_chartType === "100%") ? this.m_chart.getPercentageForHundred() : this.yAxisData;
    var yAxisTotData = getDuplicateArray(yAxisData);
    var yAxisTotNegData = [];
    for (var i = 0, length = yAxisData.length; i < length; i++) {
        stackHeightArray[i] = [];
        yAxisTotNegData[i] = [];
        for (var j = 0, innerlength = yAxisData[i].length; j < innerlength; j++) {
            if (i === 0) {
                yAxisTotNegData[i][j] = (yAxisData[i][j] < 0) ? yAxisData[i][j] : 0;
                if (yAxisData[i][j] >= 0) {
                    if (minAxis > 0 && maxAxis > 0) {
                        if (maxAxis < yAxisData[i][j] * 1) {
                            stackHeightArray[i][j] = (ratio * (maxAxis - minAxis));
                        } else {
                            stackHeightArray[i][j] = (yAxisData[i][j] < minAxis) ? 0 : (ratio * yAxisData[i][j]) - (ratio * minAxis);
                        }
                    } else {
                        if (maxAxis < yAxisData[i][j] * 1) {
                            stackHeightArray[i][j] = (ratio * yAxisData[i][j]) - (ratio * (yAxisData[i][j] * 1 - maxAxis));
                        } else {
                            stackHeightArray[i][j] = (ratio * yAxisData[i][j]);
                        }
                    }
                } else {
                	if (maxAxis < 0 && maxAxis >= yAxisData[i][j] * 1) {
                        stackHeightArray[i][j] = (ratio * yAxisData[i][j]) - (ratio * (maxAxis));
                    } /*else {
                        stackHeightArray[i][j] = (ratio * yAxisData[i][j]);
                    }*/ else if (minAxis > yAxisData[i][j] * 1) {
                        stackHeightArray[i][j] = (ratio * yAxisData[i][j]) - (ratio * (yAxisData[i][j] - minAxis)) ;
                    } else{
                    	stackHeightArray[i][j] = (ratio * yAxisData[i][j]);
                    }
                }
            } else {
                yAxisTotData[i][j] = ((yAxisTotData[i - 1][j] * 1) > 0) ? ((yAxisTotData[i - 1][j] * 1) + (yAxisData[i][j] * 1)) : (yAxisData[i][j] * 1);
                yAxisTotNegData[i][j] = (yAxisData[i][j] < 0) ? (yAxisTotNegData[i - 1][j] + yAxisData[i][j]) : 0;
                if (yAxisData[i][j] >= 0) {
                    if (minAxis > 0 && maxAxis > 0) {
                        if (maxAxis < yAxisTotData[i][j] * 1) {
                            stackHeightArray[i][j] = ((yAxisTotData[i][j] - maxAxis) < yAxisData[i][j] * 1) ? (ratio * yAxisData[i][j]) - ratio * (yAxisTotData[i][j] - maxAxis) : 0;
                        } else {
                            stackHeightArray[i][j] = ((yAxisTotData[i][j] * 1 - minAxis) < 0) ? 0 : ratio * (yAxisTotData[i][j] * 1 - minAxis);
                        }
                    } else {
                        if (maxAxis < yAxisTotData[i][j] * 1) {
                            stackHeightArray[i][j] = ((yAxisTotData[i][j] - maxAxis) < yAxisData[i][j] * 1) ? (ratio * yAxisData[i][j]) - ratio * (yAxisTotData[i][j] - maxAxis) : 0;
                        } else {
                            stackHeightArray[i][j] = (ratio * yAxisData[i][j]);
                        }
                    }
                } else {
                   /* if (minAxis <= yAxisTotNegData[i][j] * 1) {
                        stackHeightArray[i][j] = (ratio * Math.abs(yAxisData[i][j]));
                    } else {
                        stackHeightArray[i][j] = 0;
                    }*/
                	if (maxAxis < 0 && maxAxis >= yAxisData[i][j] * 1 && minAxis <= yAxisTotNegData[i][j] * 1) {
                        stackHeightArray[i][j] = (ratio * yAxisData[i][j]) - (ratio * (maxAxis));
                    } else if (minAxis > yAxisData[i][j] * 1 && minAxis <= yAxisTotNegData[i][j] * 1) {
                        stackHeightArray[i][j] = (ratio * yAxisData[i][j]) - (ratio * (minAxis-yAxisData[i][j])) ;
                    } else if(minAxis <= yAxisTotNegData[i][j] * 1){
                    	stackHeightArray[i][j] = (ratio * Math.abs(yAxisData[i][j]));
                    } else {
                        stackHeightArray[i][j] = 0;
                    }
                }
            }
            stackHeightArray[i][j] = Math.abs(stackHeightArray[i][j]);
        }

    }
    this.stackHeightArray = stackHeightArray;
};

/** @description Getter for X Position Data which will be used in tooltip**/
GroupColumnCalculation.prototype.getXPositionforToolTip = function() {
    var xPosArray = [];
    var xPosDataArray = this.getXPositionArray();
    for (var n = 0; n < xPosDataArray[0].length; n++) {
        xPosArray.push(xPosDataArray[0][n]);
    }
    return xPosArray;
};

/** @description Getter for Stack Height Array**/
GroupColumnCalculation.prototype.getstackHeightArray = function() {
    return this.stackHeightArray;
};

/** @description Getter for Y Axis Text**/
GroupColumnCalculation.prototype.getYAxisText = function() {
    return this.yAxisData;
};

/** @description Getter for Y Axis Marker Array**/
GroupColumnCalculation.prototype.getYAxisMarkersArray = function() {
    return this.yAxisData;
};

/** @description Creation of GroupColumnSeries Class**/
function GroupColumnSeries() {
    this.xPixel = [];
    this.yPixelArray = [];
    this.stackHeightArray = [];
    this.stackColorArray = [];
    this.barStackArray = [];
    this.ctx = "";
    this.m_chart = "";
    this.m_chartbase = "";
};

/** @description initialization of GroupColumnSeries class and creating object of GroupColumnStack **/
GroupColumnSeries.prototype.init = function(xPixel, yPixelArray, stackWidth, stackHeightArray, stackPercentArray, stackColorArray, strokeColor, stackMarkingOnTopBarFlag, showPercentValueFlag, m_seriesInitializeFlag, plotTrasparency, chart) {
    this.m_chart = chart;
    this.ctx = this.m_chart.ctx;
    this.m_chartbase = this.m_chart.m_chartbase;
    this.xPixel = xPixel;
    this.yPixelArray = yPixelArray;
    this.stackWidth = stackWidth;
    this.stackHeightArray = stackHeightArray;
    this.stackPercentArray = stackPercentArray;
    this.stackColorArray = stackColorArray;
    this.strokecolor = strokeColor;
    this.m_stackMarkingOnTopOfBarFlag = stackMarkingOnTopBarFlag;
    this.m_stackShowPercentValueFlag = showPercentValueFlag;
    this.m_stackSeriesInitializeFlag = m_seriesInitializeFlag;
    this.m_plotTrasparency = plotTrasparency;
    for (var i = 0; i < this.xPixel.length; i++) {
        this.barStackArray[i] = new GroupColumnStack();
        this.barStackArray[i].init(this.xPixel[i], this.yPixelArray[i], this.stackWidth, this.stackHeightArray[i], this.stackPercentArray[i], this.stackColorArray[i], this.strokecolor, this.ctx, chart, this.m_chartbase, this.m_stackMarkingOnTopOfBarFlag, this.m_stackShowPercentValueFlag, this.m_stackSeriesInitializeFlag, this.m_plotTrasparency);
    }
};

/** @description Drawing of Bar Stack **/
GroupColumnSeries.prototype.drawBarSeries = function(k) {
    for (var i = 0; i < this.xPixel.length; i++) {
        this.barStackArray[i].drawBarStack(k, i);
    }
};

/** @description Creation of GroupColumnStack class **/
function GroupColumnStack() {
    this.stackXPixel;
    this.stackYPixel;
    this.stackWidth;
    this.stackHeight;
    this.stackColor;
    this.strokeColor;
    this.ctx = "";
    this.m_chartbase = "";
};

/** @description initializing GroupColumnStack **/
GroupColumnStack.prototype.init = function(stackXPixel, stackYPixel, stackWidth, stackHeight, stackPercentValue, stackColor, strokeColor, ctx, ref, chartbase, showPercentageFlag, stackShowPercentValueFlag, m_stackSeriesInitializeFlag, plotTrasparency) {
    this.ctx = ctx;
    this.m_chart = ref;
    this.m_chartbase = chartbase;
    this.stackXPixel = stackXPixel;
    this.stackYPixel = stackYPixel;
    this.stackWidth = stackWidth;
    this.stackHeight = stackHeight;
    this.stackPercentValue = stackPercentValue;
    this.strokeColor = strokeColor || "#cccccc";
    this.stackColor = convertColorToHex(stackColor);
    this.m_showPercentageFlag = showPercentageFlag;
    this.m_stackShowPercentValueFlag = stackShowPercentValueFlag;
    this.m_stackSeriesInitializeFlag = m_stackSeriesInitializeFlag;
    this.m_stackPlotTrasparency = plotTrasparency;
};

/** @description drawing bar stack on the basis of selected chartBase**/
GroupColumnStack.prototype.drawBarStack = function(k, i) {
    var temp = this;
    var id = temp.m_chart.svgContainerId;
    this.ctx.beginPath();
    this.ctx.save();
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = 0.5;
    var strokeWidth = 0.5;
    switch (this.m_chartbase) {
        case "rectangle":
            if (this.stackHeight < 0) {
                this.stackXPixel = this.stackXPixel + this.stackHeight;
                this.stackHeight = Math.abs(this.stackHeight);
            }
            this.makeCuboid(this.stackXPixel, this.stackYPixel, this.stackWidth, this.stackHeight, this.stackColor);
            this.ctx.fillStyle = hex2rgb(this.stackColor, this.m_stackPlotTrasparency);
            var svgStack = drawSVGRect(this.stackXPixel, this.stackYPixel, this.stackHeight, this.stackWidth, hex2rgb(this.stackColor, this.m_stackPlotTrasparency));
            svgStack.setAttribute("style", "stroke-width:" + strokeWidth + "px; stroke:" + this.strokeColor + ";");
            $("#stackgrp" + k + temp.m_chart.m_objectid).append(svgStack);
            break;
        case "chevron":
            if (this.stackHeight !== 0) {
                this.makeChevron(this.stackXPixel, this.stackYPixel, this.stackHeight, this.stackWidth, hex2rgb(this.stackColor, this.m_stackPlotTrasparency), this.strokeColor, k);
            }
            break;
        case "gradient1":
            if (this.stackHeight < 0) {
                this.stackXPixel = this.stackXPixel + this.stackHeight;
            }
            var ah = this.stackHeight;
            if (ah > 0) {
                this.stackHeight = this.stackHeight - ((this.stackHeight > this.m_chart.m_stackborderwidth * 2) ? (this.m_chart.m_stackborderwidth * 1) : 0);
                this.stackXPixel = ((Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2)) ? this.stackXPixel + (this.m_chart.m_stackborderwidth * 0.5) : this.stackXPixel);
            } else {
                this.stackHeight = (Math.abs(this.stackHeight) > this.m_chart.m_stackborderwidth * 2) ? this.stackHeight + (this.m_chart.m_stackborderwidth * 1) : this.stackHeight;
                this.stackXPixel = ((Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2)) ? this.stackXPixel + (this.m_chart.m_stackborderwidth * 0.5) : this.stackXPixel)
            }
            var aw = this.stackWidth;
            this.stackWidth = this.stackWidth - ((this.stackWidth > this.m_chart.m_stackborderwidth * 2) ? (this.m_chart.m_stackborderwidth * 1) : 0);
            if (temp.m_chart.m_stacksvgtype === "path") {
                this.drawSVGPathBar(this, id, "url(#gradient" + temp.m_chart.m_objectid + k + i + ")", ah, aw);
            } else {
                var svgStack = drawSVGRect(this.stackXPixel, this.stackYPixel, Math.abs(this.stackHeight), this.stackWidth, "");
                svgStack.setAttribute("fill", "url(#gradient" + temp.m_chart.m_objectid + k + i + ")");
                if (Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2) && Math.abs(aw) > (this.m_chart.m_stackborderwidth * 2)) {
                    svgStack.setAttribute("style", "stroke-width:" + this.m_chart.m_stackborderwidth + "px; stroke:" + this.m_chart.m_stackbordercolor + "; stroke-opacity : 1;");
                    if (IsBoolean(this.m_chart.m_enablestackshadow) && !IsBoolean(this.m_chart.isPropertyBrowserCompatible()) && this.stackWidth > 2 && Math.abs(this.stackHeight) > 2) {
                        $(svgStack).attr("filter", "url(#stackShadow" + temp.m_chart.m_objectid + ")");
                        svgStack.setAttribute("shape-rendering", "crispEdges");
                    }
                }
                /** Added for add radius on stack*/
                $(svgStack).attr("rx", this.m_chart.m_stackborderradius);
                $(svgStack).attr("ry", this.m_chart.m_stackborderradius);
                var isIE = /*@cc_on!@*/ false || !!document.documentMode;
                if (IsBoolean(this.m_chart.m_enableanimation) && (this.m_chart.m_baranimationduration > 0) && !isIE) {
                    var animate1 = drawSVGStackAnimation(0, "width", Math.abs(this.stackHeight), this.m_chart.m_baranimationduration);
                    var animate2 = drawSVGStackAnimation((Math.abs(this.stackHeight) + this.stackXPixel), "x", this.stackXPixel, this.m_chart.m_baranimationduration);
                    $(svgStack).append(animate1);
                    if (this.stackHeight < 0) {
                        $(svgStack).append(animate2);
                    }
                }
                $(svgStack).attr("class", "timeSeries-stackHighlighter");
                $("#stackgrp" + k + temp.m_chart.m_objectid).append(svgStack);
            }
            break;
        case "gradient2":
            if (this.stackHeight < 0) {
                this.stackXPixel = this.stackXPixel + this.stackHeight;
            }
            var ah = this.stackHeight;
            if (ah > 0) {
                this.stackHeight = this.stackHeight - ((this.stackHeight > this.m_chart.m_stackborderwidth * 2) ? (this.m_chart.m_stackborderwidth * 1) : 0);
                this.stackXPixel = ((Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2)) ? this.stackXPixel + (this.m_chart.m_stackborderwidth * 0.5) : this.stackXPixel);
            } else {
                this.stackHeight = (Math.abs(this.stackHeight) > this.m_chart.m_stackborderwidth * 2) ? this.stackHeight + (this.m_chart.m_stackborderwidth * 1) : this.stackHeight;
                this.stackXPixel = ((Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2)) ? this.stackXPixel + (this.m_chart.m_stackborderwidth * 0.5) : this.stackXPixel)
            }
            var aw = this.stackWidth;
            this.stackWidth = this.stackWidth - ((this.stackWidth > this.m_chart.m_stackborderwidth * 2) ? (this.m_chart.m_stackborderwidth * 1) : 0);
            if (temp.m_chart.m_stacksvgtype === "path") {
                this.drawSVGPathBar(this, id, "url(#gradient" + temp.m_chart.m_objectid + k + i + ")", ah, aw);
            } else {
                var svgStack = drawSVGRect(this.stackXPixel, this.stackYPixel, Math.abs(this.stackHeight), this.stackWidth, "");
                svgStack.setAttribute("fill", "url(#gradient" + temp.m_chart.m_objectid + k + i + ")");
                if (Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2) && Math.abs(aw) > (this.m_chart.m_stackborderwidth * 2)) {
                    svgStack.setAttribute("style", "stroke-width:" + this.m_chart.m_stackborderwidth + "px; stroke:" + this.m_chart.m_stackbordercolor + "; stroke-opacity : 1;");
                    if (IsBoolean(this.m_chart.m_enablestackshadow) && !IsBoolean(this.m_chart.isPropertyBrowserCompatible()) && this.stackWidth > 2 && Math.abs(this.stackHeight) > 2) {
                        $(svgStack).attr("filter", "url(#stackShadow" + temp.m_chart.m_objectid + ")");
                        svgStack.setAttribute("shape-rendering", "crispEdges");
                    }
                }
                /** Added for add radius on stack*/
                $(svgStack).attr("rx", this.m_chart.m_stackborderradius);
                $(svgStack).attr("ry", this.m_chart.m_stackborderradius);
                var isIE = /*@cc_on!@*/ false || !!document.documentMode;
                if (IsBoolean(this.m_chart.m_enableanimation) && (this.m_chart.m_baranimationduration > 0) && !isIE) {
                    var animate1 = drawSVGStackAnimation(0, "width", Math.abs(this.stackHeight), this.m_chart.m_baranimationduration);
                    var animate2 = drawSVGStackAnimation((Math.abs(this.stackHeight) + this.stackXPixel), "x", this.stackXPixel, this.m_chart.m_baranimationduration);
                    $(svgStack).append(animate1);
                    if (this.stackHeight < 0) {
                        $(svgStack).append(animate2);
                    }
                }
                $(svgStack).attr("class", "timeSeries-stackHighlighter");
                $("#stackgrp" + k + temp.m_chart.m_objectid).append(svgStack);
            }
            break;
        case "gradient3":
            if (this.stackHeight < 0) {
                this.stackXPixel = this.stackXPixel + this.stackHeight;
            }
            var ah = this.stackHeight;
            if (ah > 0) {
                this.stackHeight = this.stackHeight - ((this.stackHeight > this.m_chart.m_stackborderwidth * 2) ? (this.m_chart.m_stackborderwidth * 1) : 0);
                this.stackXPixel = ((Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2)) ? this.stackXPixel + (this.m_chart.m_stackborderwidth * 0.5) : this.stackXPixel);
            } else {
                this.stackHeight = (Math.abs(this.stackHeight) > this.m_chart.m_stackborderwidth * 2) ? this.stackHeight + (this.m_chart.m_stackborderwidth * 1) : this.stackHeight;
                this.stackXPixel = ((Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2)) ? this.stackXPixel + (this.m_chart.m_stackborderwidth * 0.5) : this.stackXPixel)
            }
            var aw = this.stackWidth;
            this.stackWidth = this.stackWidth - ((this.stackWidth > this.m_chart.m_stackborderwidth * 2) ? (this.m_chart.m_stackborderwidth * 1) : 0);
            if (temp.m_chart.m_stacksvgtype === "path") {
                this.drawSVGPathBar(this, id, "url(#gradient" + temp.m_chart.m_objectid + k + i + ")", ah, aw);
            } else {
                var svgStack = drawSVGRect(this.stackXPixel, this.stackYPixel, Math.abs(this.stackHeight), this.stackWidth, "");
                svgStack.setAttribute("fill", "url(#gradient" + temp.m_chart.m_objectid + k + i + ")");
                if (Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2) && Math.abs(aw) > (this.m_chart.m_stackborderwidth * 2)) {
                    svgStack.setAttribute("style", "stroke-width:" + this.m_chart.m_stackborderwidth + "px; stroke:" + this.m_chart.m_stackbordercolor + "; stroke-opacity : 1;");
                    if (IsBoolean(this.m_chart.m_enablestackshadow) && !IsBoolean(this.m_chart.isPropertyBrowserCompatible()) && this.stackWidth > 2 && Math.abs(this.stackHeight) > 2) {
                        $(svgStack).attr("filter", "url(#stackShadow" + temp.m_chart.m_objectid + ")");
                        svgStack.setAttribute("shape-rendering", "crispEdges");
                    }
                }
                /** Added for add radius on stack*/
                $(svgStack).attr("rx", this.m_chart.m_stackborderradius);
                $(svgStack).attr("ry", this.m_chart.m_stackborderradius);
                var isIE = /*@cc_on!@*/ false || !!document.documentMode;
                if (IsBoolean(this.m_chart.m_enableanimation) && (this.m_chart.m_baranimationduration > 0) && !isIE) {
                    var animate1 = drawSVGStackAnimation(0, "width", Math.abs(this.stackHeight), this.m_chart.m_baranimationduration);
                    var animate2 = drawSVGStackAnimation((Math.abs(this.stackHeight) + this.stackXPixel), "x", this.stackXPixel, this.m_chart.m_baranimationduration);
                    $(svgStack).append(animate1);
                    if (this.stackHeight < 0) {
                        $(svgStack).append(animate2);
                    }
                }
                $(svgStack).attr("class", "timeSeries-stackHighlighter");
                $("#stackgrp" + k + temp.m_chart.m_objectid).append(svgStack);
            }
            break;
        default:
            /*if (this.stackHeight < 0) {
                this.stackXPixel = this.stackXPixel + this.stackHeight;
            }*/
            var ah = this.stackHeight;
            if (ah > 0) {
                this.stackHeight = this.stackHeight - ((this.stackHeight > this.m_chart.m_stackborderwidth * 2) ? (this.m_chart.m_stackborderwidth * 1) : 0);
                this.stackXPixel = ((Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2)) ? this.stackXPixel + (this.m_chart.m_stackborderwidth * 0.5) : this.stackXPixel);
            } else {
                this.stackHeight = (Math.abs(this.stackHeight) > this.m_chart.m_stackborderwidth * 2) ? this.stackHeight + (this.m_chart.m_stackborderwidth * 1) : this.stackHeight;
                this.stackXPixel = ((Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2)) ? this.stackXPixel + (this.m_chart.m_stackborderwidth * 0.5) : this.stackXPixel)
            }
            var aw = this.stackWidth;
            this.stackWidth = this.stackWidth - ((this.stackWidth > this.m_chart.m_stackborderwidth * 2) ? (this.m_chart.m_stackborderwidth * 1) : 0);
            if (temp.m_chart.m_stacksvgtype === "path") {
                this.drawSVGPathBar(this, id, hex2rgb(this.stackColor, this.m_stackPlotTrasparency), ah, aw);
            } else {
                var svgStack = drawSVGRect(this.stackXPixel, this.stackYPixel, this.stackWidth, Math.abs(this.stackHeight), hex2rgb(this.stackColor, this.m_stackPlotTrasparency));
                if (Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2) && Math.abs(aw) > (this.m_chart.m_stackborderwidth * 2)) {
                    svgStack.setAttribute("style", "stroke-width:" + this.m_chart.m_stackborderwidth + "px; stroke:" + this.m_chart.m_stackbordercolor + "; stroke-opacity : 1;");
                    if (IsBoolean(this.m_chart.m_enablestackshadow) && !IsBoolean(this.m_chart.isPropertyBrowserCompatible()) && this.stackWidth > 2 && Math.abs(this.stackHeight) > 2) {
                        $(svgStack).attr("filter", "url(#stackShadow" + temp.m_chart.m_objectid + ")");
                        svgStack.setAttribute("shape-rendering", "crispEdges");
                    }
                }
                /** Added for add radius on stack*/
                $(svgStack).attr("rx", this.m_chart.m_stackborderradius);
                $(svgStack).attr("ry", this.m_chart.m_stackborderradius);
                var isIE = /*@cc_on!@*/ false || !!document.documentMode;
                if (IsBoolean(this.m_chart.m_enableanimation) && (this.m_chart.m_baranimationduration > 0) && !isIE) {
                	var animate1 = drawSVGStackAnimation(0, "height", Math.abs(this.stackHeight), this.m_chart.m_baranimationduration);
                    var animate2 = drawSVGStackAnimation((Math.abs(this.stackHeight) + this.stackYPixel), "y", this.stackYPixel, this.m_chart.m_baranimationduration);
                    $(svgStack).append(animate1);
                    if (this.stackHeight < 0) {
                        $(svgStack).append(animate2);
                    }
                }
                $(svgStack).attr("class", "timeSeries-stackHighlighter");
                $("#stackgrp" + k + temp.m_chart.m_objectid).append(svgStack);
                $(svgStack).attr("id", "stackgrp"+temp.m_chart.m_objectid+k+i);
                
				
				svgStack.addEventListener("click", function(evt) {
		        	var id = this.id;
		        	var serIndex= k,
		        	catIndex = i;
		        	for(var n=0;n<temp.m_chart.m_seriesData.length; n++){
						var seriesName = temp.m_chart.m_allSeriesNames[n];
		        		for(var j=0;j<temp.m_chart.m_categoryData[0].length; j++){
		        			if(IsBoolean(temp.m_chart.enableDrillHighlighter)){
		        			//var clickid = "topRoundedStack" + temp.m_chart.svgContainerId + i + j;
							if(temp.m_chart.m_barSeriesArray[seriesName] !== undefined){
		        				var clickid = "stackgrp" + temp.m_chart.m_objectid +n+ j;
		        			}else{
		        				//var clickid = "linestack" + temp.m_chart.m_objectid +n+ j;
		        			}
		        			if(catIndex == j){
		        			$("#"+clickid).css("opacity","1");
		        			}/*else if(($("#"+clickid).css("opacity") == "1") && IsBoolean( temp.m_chart.m_drilltoggle)) {
		        				$("#"+clickid).css("opacity","0.5");//$("#"+clickid).css("opacity","0.5");
		        			}*/ else {
		        				$("#"+clickid).css("opacity","0.5");
		        			}
		        		  }
		        		}
		        	}
		        });
            }
            break;
    }
    if (IsBoolean(this.m_stackSeriesInitializeFlag))
        this.drawText();
    this.ctx.restore();
    this.ctx.closePath();
};

/** @description will draw bar using path on SVG.  **/
GroupColumnStack.prototype.drawSVGPathBar = function(temp, id, fillColor, actualHeight, actualWidth) {
    var
        spc = " ", // path drawing instruction letters with readable names
        moveTo = "M",
        horizLineTo = "h",
        vertLineTo = "v",
        arcTo = "a",
        closePath = "z",
        r = (Math.abs(actualHeight) > (temp.m_chart.m_stackborderradius * 1)) ? temp.m_chart.m_stackborderradius * 1 : 0,
        dStr = ""; // the "d" path for the svg path
    if ((temp.stackHeight) * 1 > 0) { // for positive value
        dStr =
            moveTo + spc + temp.stackXPixel + spc + (temp.stackYPixel) + spc +
            horizLineTo + spc + (temp.stackHeight - r) + spc +
            arcTo + spc + (r) + spc + (r) + spc + 0 + spc + 0 + spc + 1 + spc + (r) + spc + (r) + spc +
            vertLineTo + spc + (temp.stackWidth - (2 * r)) + spc +
            arcTo + spc + (r) + spc + (r) + spc + 0 + spc + 0 + spc + 1 + spc + (-r) + spc + (r) + spc +
            horizLineTo + spc + (r - temp.stackHeight) + spc +
            closePath;
    } else { // for Negative value
        dStr =
            moveTo + spc + Math.abs(temp.stackXPixel + Math.abs(temp.stackHeight)) + spc + (temp.stackYPixel) + spc +
            horizLineTo + spc + (temp.stackHeight + r) + spc +
            arcTo + spc + (r) + spc + (r) + spc + 0 + spc + 0 + spc + 0 + spc + (-r) + spc + (r) + spc +
            vertLineTo + spc + (temp.stackWidth - (2 * r)) + spc +
            arcTo + spc + (r) + spc + (r) + spc + 0 + spc + 0 + spc + 0 + spc + (r) + spc + (r) + spc +
            horizLineTo + spc + (Math.abs(temp.stackHeight) - r) + spc +
            vertLineTo + spc + (-temp.stackWidth) + spc;
    }
    if (dStr != "" && Math.abs(temp.stackHeight) > 0) { // Added for remove path drawing when value is 0 or path is empty.
        var g1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var g2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "path");
        rect.setAttribute("d", dStr);
        /**Internet Explorer does not support svg animation.*/
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;
        if (IsBoolean(temp.m_chart.m_enableanimation) && (temp.m_chart.m_baranimationduration > 0) && !isIE) {
            /**Added for animation in svg path stack */
            rect.setAttribute("class", "barchart-rounded-bar");
            var sx = ((temp.stackHeight) * 1 > 0) ? (temp.stackXPixel) : (temp.stackXPixel + (Math.abs(temp.stackHeight)));
            rect.setAttribute("style", "animation: barchart-rounded-bar " + temp.m_chart.m_baranimationduration + "s linear forwards; transform-origin: " + (sx) + "px center;");
        }
        //If stackHeight value is more than stackBorderWidth then given borderWidth apply else stackHeight value become borderWidth
        if (Math.abs(actualHeight) > (temp.m_chart.m_stackborderwidth * 2) && Math.abs(actualWidth) > (temp.m_chart.m_stackborderradius * 1)) {
            g1.setAttribute("style", "stroke:" + temp.m_chart.m_stackbordercolor + "; stroke-width:" + temp.m_chart.m_stackborderwidth + ";fill:" + fillColor + ";");
        } else {
            g1.setAttribute("style", "stroke:" + temp.m_chart.m_stackbordercolor + "; stroke-width:" + 0 + ";fill:" + fillColor + ";");
        }
        $(g2).attr("class", "timeSeries-stackHighlighter");
        $(g2).append(rect);
        $(g1).append(g2);
        $("#" + id).append(g1);
    }
};

/** @description drawing of text **/
GroupColumnStack.prototype.drawText = function() {
    var space = 15;
    var txt;
    if (IsBoolean(this.m_stackShowPercentValueFlag))
        txt = parseInt(this.stackPercentValue) + "%";
    else
        txt = parseInt(this.stackPercentValue);
    if (IsBoolean(this.m_showPercentageFlag)) {
        this.ctx.fillStyle = "black";
        this.ctx.fillText(txt, (this.stackXPixel * 1 + (this.stackHeight * 1) + space * 1), (this.stackYPixel * 1 + (this.stackWidth / 2) * 1 + 1));
    }
};

/** @description Gradient Creation**/
GroupColumnStack.prototype.createGradient = function() {
    var grd = this.ctx.createLinearGradient(this.stackXPixel, this.stackYPixel, this.stackXPixel, this.stackYPixel * 1 + this.stackWidth * 1);
    var color0 = hex2rgb(this.stackColor, 0.6);
    var color = hex2rgb(this.stackColor, 0.7);
    grd.addColorStop(0, this.stackColor);
    grd.addColorStop(0.3, color0);
    grd.addColorStop(0.7, color);
    grd.addColorStop(1, this.stackColor);
    return grd;
};

/** @description Creating Gradient when chart Base is Gradient1**/
GroupColumnChart.prototype.createGradient1 = function(color, j, i) {
    var temp = this;
    var id = temp.svgContainerId;
    var linearGradient = document.createElementNS(NS, 'linearGradient');
    linearGradient.setAttribute("x1", "0%");
    linearGradient.setAttribute("x2", "0%");
    linearGradient.setAttribute("y1", "0%");
    linearGradient.setAttribute("y2", "100%");
    linearGradient.setAttribute("id", "gradient" + temp.m_objectid + j + i);
    $('#' + temp.svgContainerId).append(linearGradient);
    var color0 = hex2rgb(color, this.m_stackPlotTrasparency);
    var colors = [color0, ColorLuminance(color, 0.2), color0];
    var step = (100 / (((colors.length - 1) != 0) ? (colors.length - 1) : 1));
    for (var i = 0, Length = colors.length; i <= (Length - 1); i++) {
        var stop = document.createElementNS(NS, 'stop');
        stop.setAttribute("offset", (i * step) + "%");
        stop.setAttribute("stop-color", colors[i]);
        stop.setAttribute("stop-opacity", 1);
        $(linearGradient).append(stop);
    }

    /*var gradient = this.ctx.createLinearGradient(x, y, x, (y * 1 + w * 1));
    var color0 = hex2rgb(color, this.m_stackPlotTrasparency);
    gradient.addColorStop(0.1, color0);
    gradient.addColorStop(0.5, ColorLuminance(color, 0.2));
    gradient.addColorStop(1, color0);
    return gradient;*/
};

/** @description Creating Gradient when chart base is Gradient2**/
GroupColumnChart.prototype.createGradient2 = function(color, j, i) {
    var temp = this;
    var id = temp.svgContainerId;
    var linearGradient = document.createElementNS(NS, 'linearGradient');
    linearGradient.setAttribute("x1", "0%");
    linearGradient.setAttribute("x2", "0%");
    linearGradient.setAttribute("y1", "0%");
    linearGradient.setAttribute("y2", "100%");
    linearGradient.setAttribute("id", "gradient" + temp.m_objectid + j + i);
    $('#' + temp.svgContainerId).append(linearGradient);
    var color0 = hex2rgb(color, this.m_stackPlotTrasparency);
    var colors = [color0, color0, ColorLuminance(color, -0.15), color0, color0];
    var step = (100 / (((colors.length - 1) != 0) ? (colors.length - 1) : 1));
    for (var i = 0, Length = colors.length; i <= (Length - 1); i++) {
        var stop = document.createElementNS(NS, 'stop');
        stop.setAttribute("offset", (i * step) + "%");
        stop.setAttribute("stop-color", colors[i]);
        stop.setAttribute("stop-opacity", 1);
        $(linearGradient).append(stop);
    }
    /*var gradient = this.ctx.createLinearGradient(x, y, x, (y * 1 + w * 1));
    var color0 = hex2rgb(color, this.m_stackPlotTrasparency);
    gradient.addColorStop(0, color0);
    gradient.addColorStop(0.15, color0);
    gradient.addColorStop(0.5, ColorLuminance(color, -0.15));
    gradient.addColorStop(0.85, color0);
    gradient.addColorStop(1, color0);
    return gradient;*/
};

/** @description Creating Gradient when chart Base is Gradient3**/
GroupColumnChart.prototype.createGradient3 = function(color, j, i) {
    var temp = this;
    var id = temp.svgContainerId;
    var linearGradient = document.createElementNS(NS, 'linearGradient');
    linearGradient.setAttribute("x1", "0%");
    linearGradient.setAttribute("x2", "0%");
    linearGradient.setAttribute("y1", "0%");
    linearGradient.setAttribute("y2", "100%");
    linearGradient.setAttribute("id", "gradient" + temp.m_objectid + j + i);
    $('#' + temp.svgContainerId).append(linearGradient);
    var color0 = hex2rgb(color, 0.35);
    var colors = [color, color, color0, color, color];
    var step = (100 / (((colors.length - 1) != 0) ? (colors.length - 1) : 1));
    for (var i = 0, Length = colors.length; i <= (Length - 1); i++) {
        var stop = document.createElementNS(NS, 'stop');
        stop.setAttribute("offset", (i * step) + "%");
        stop.setAttribute("stop-color", colors[i]);
        stop.setAttribute("stop-opacity", 1);
        $(linearGradient).append(stop);
    }
    /*var grd = this.ctx.createLinearGradient(x, y, x, (y * 1 + w * 1));
    //var color0 = hex2rgb(color, this.m_stackPlotTrasparency);
    var color0 = hex2rgb(color, 0.35);
    grd.addColorStop(0, color);
    grd.addColorStop(0.15, color);
    grd.addColorStop(0.5, color0);
    grd.addColorStop(0.85, color);
    grd.addColorStop(1, color);
    return grd;*/
};

/** @description Creating Gradient when chart Base is Gradient3**/
GroupColumnStack.prototype.createGradient3 = function(x, y, w, h, color) {
    /*var grd=this.ctx.createLinearGradient(x,y,x,(y*1+w*1));
    var color0=hex2rgb(color,0.35);
    grd.addColorStop(0,color);
    grd.addColorStop(0.15,color);
    grd.addColorStop(0.5,color0);
    grd.addColorStop(0.85,color);
    grd.addColorStop(1,color);
    return grd;*/
    var gradient = this.ctx.createLinearGradient(x, y, x, (y * 1 + w * 1));
    var color0 = hex2rgb(color, this.m_stackPlotTrasparency);
    gradient.addColorStop(0.1, color0);
    gradient.addColorStop(0.15, color0);
    gradient.addColorStop(0.5, ColorLuminance(color, 0.3));
    gradient.addColorStop(0.85, color0);
    gradient.addColorStop(1, color0);
    return gradient;
};

/** @description Make Bar to Cylinderical**/
GroupColumnStack.prototype.makeCylinder = function(x, y, w, h, color) {
    var xpick = 3;
    var ypick = 3;
    var strokeColor = hex2rgb(color, 0.6);

    this.ctx.beginPath();
    this.ctx.strokeStyle = "#fff";
    this.ctx.fillStyle = strokeColor;
    this.ctx.moveTo(x + h, y);
    this.ctx.bezierCurveTo((x * 1 + h * 1 + w / xpick), (y * 1 + ypick), (x * 1 + h * 1 + w * 2 / xpick), (y * 1 + 2 * ypick), (x * 1 + h * 1), y * 1 + w * 1);
    this.ctx.stroke();
    this.ctx.strokeStyle = color;
    this.ctx.moveTo(x, y);
    this.ctx.bezierCurveTo((x * 1 + h * 1 - w / xpick), (y * 1 + ypick), (x * 1 + h * 1 - w * 2 / xpick), (y * 1 + 2 * ypick), (x * 1 + h * 1), y * 1 + w * 1);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();
};

/** @description Make Bar to Cuboid**/
GroupColumnStack.prototype.makeCuboid = function(x, y, w, h, color) {
    var temp = this;
    var id = temp.m_chart.svgContainerId;
    var slant = w / 4;
    var strokeColor = "#cccccc";
    var strokeWidth = 0.5;
    var fillColor = hex2rgb(color, this.m_stackPlotTrasparency);
    var path = [
        "M", x, y,
        "L", x + slant, y - 5,
        "L", x + slant + h, y - 5,
        "L", x + slant + h, y - 5 + w,
        "L", x + h, y + w,
        "L", x + h, y,
        "L", x, y
    ].join(" ");
    var svgPath = drawSVGPath();
    svgPath.setAttribute('d', path);
    svgPath.setAttribute("style", "stroke-width:" + strokeWidth + "px; stroke:" + strokeColor + "; fill:" + fillColor + ";");
    $("#" + id).append(svgPath);
    /*this.ctx.beginPath();
    this.ctx.fillStyle = hex2rgb(color, this.m_stackPlotTrasparency);
    this.ctx.strokeStyle = "#ccc";
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + slant, y - 5);
    this.ctx.lineTo(x + slant + h, y - 5);
    this.ctx.lineTo(x + slant + h, y - 5 + w);
    this.ctx.lineTo(x + h, y + w);
    this.ctx.lineTo(x + h, y);
    this.ctx.lineTo(x, y);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();*/
};

/** @description Make Chevron type**/
GroupColumnStack.prototype.makeChevron = function(x, y, w, h, color, stroke, index) {
    var temp = this;
    var id = temp.m_chart.svgContainerId;
    var space = h / 6;
    var strokeWidth = 0.5;
    if (w * 1 < h / 2) {
        w = h / 2;
    }
    var path = [
        "M", x, y,
        "L", x * 1 + w * 1 - h / 2, y,
        "L", x * 1 + w * 1, y * 1 + h / 2,
        "L", x * 1 + w * 1 - h / 2, y * 1 + h * 1,
        "L", x, y * 1 + h * 1,
        "L", x * 1 + h / 2, y * 1 + h / 2,
        "L", x, y
    ].join(" ");
    // commented old chevron shape drawing for BDD-589(1)
    /*	var path = [
    	        	"M", x, y, 
    	        	"L", x * 1 + w * 1 - space * 1, y,
    	        	"L", x * 1 + w * 1 + h / 2, y * 1 + h / 2,
    	        	"L", x * 1 + w * 1 - space, y * 1 + h * 1,
    	        	"L", x, y * 1 + h * 1,
    	        	"L", x * 1 + h / 2 + space * 1, y * 1 + h / 2,
    	        	"L", x, y
    	   			].join(" ");*/
    var svgPath = drawSVGPath();
    svgPath.setAttribute('d', path);
    svgPath.setAttribute("style", "stroke-width:" + strokeWidth + "px; stroke:" + stroke + "; fill:" + color + ";");
    $("#stackgrp" + index + temp.m_chart.m_objectid).append(svgPath);
};

/** @description Creating GroupColumnXAxis class**/
function GroupColumnXAxis() {
    this.base = Xaxis;
    this.base();
    this.m_textUtil = new TextUtil();
    this.m_util = new Util();
    this.ctx = "";
};

/** @description Inheriting Xaxis class property into GroupColumnXAxis class using the prototype**/
GroupColumnXAxis.prototype = new Xaxis;

GroupColumnXAxis.prototype.init = function(m_chart) {
    this.m_chart = m_chart;
    this.ctx = this.m_chart.ctx;
    this.m_startX = this.m_chart.getStartX();
    this.m_startY = this.m_chart.getStartY();
    this.m_endX = this.m_chart.getEndX();
    this.m_endY = this.m_chart.getEndY();
    this.m_labeltilted = true;
    this.m_categorymarkingcolor = "#cccccc";
    this.m_axislinetotextgap = 5;
    this.m_labeltextalign = "left";
    this.m_mapData = this.m_chart.m_calculation.m_chartData
    this.m_xAxisData = this.m_chart.m_calculation.xAxisData;
    this.m_xPositionData = this.m_chart.m_calculation.getXPositionArray();
};

/** @description will draw x-axis marker and description . **/
GroupColumnXAxis.prototype.markXaxis = function() {
	 if (!IsBoolean(this.m_chart.m_mergesubcategory)) {
		 this.drawAxisLabels();
	    }
   /*if (this.getDescription() != "") {
        this.drawDescription();
    }*/
    this.drawDescription();
};
GroupColumnXAxis.prototype.drawXAxis = function() {
	if (IsBoolean(this.m_showlinexaxis)) {
		var temp = this;
		var msfx = 1;
		/** msfx = margin space from x - axis 1 px **/
		var lineWidth = 0.5;
		var antiAliasing = 0.5;
		var strokeColor = this.m_linexaxiscolor;
		var x1 = this.m_startX * 1 - msfx * 1 - this.m_chart.m_axistodrawingareamargin;
		var y1 = this.m_startY * 1 + msfx * 1 + this.m_chart.m_axistodrawingareamargin;
		var x2 = this.m_endX * 1;
		var y2 = this.m_startY * 1 + msfx * 1 + this.m_chart.m_axistodrawingareamargin;
		//this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
		var newLine = drawSVGLine(x1, y1, x2, y2, lineWidth, strokeColor);
		$("#" + temp.m_chart.svgContainerId).append(newLine);
	}
};
/** @description Calling drawLabel function**/
GroupColumnXAxis.prototype.drawSubCategory = function() {
    for (var i = 0; i < this.m_xAxisData.length; i++) {
        this.ctx.beginPath();
        this.ctx.save();
        this.drawLabel(this.m_xAxisData[i][0], i);
        this.ctx.restore();
        this.ctx.closePath();
    }
};

/** @description Calling drawLabel function**/
GroupColumnXAxis.prototype.drawCategory = function() {
    var temp = this;
    var cm = this.m_chart.getCatTextMargin();
    var scm = 0;
    if (this.m_chart.m_subcategoryorientation == "left") {
        scm = this.m_chart.getSubCatTextMargin();
    }
    var data = this.m_chart.calculateCategoryBoxSize();
    for (var key in data) {
        var subCatCount = Object.keys(this.m_chart.dataMap[key]).length;
        if (IsBoolean(this.m_chart.m_mergesubcategory)) {
            var boxHeight = (subCatCount * this.m_chart.m_barWidth) + this.m_chart.m_barGap;
        } else {
            var boxHeight = subCatCount * (this.m_chart.m_barWidth + this.m_chart.m_barGap);
        }
        var x = data[key] + boxHeight / 2;
        var y = this.m_chart.getStartY() + (cm / 2) + scm * 1 + 10;
        var textData = this.getText("" + key, this.m_chart.m_height / 5, this.getLabelFontProperties());
        
        /*DAS-760 textwrap for category*/
		var nooflines = this.calculateLabelBoxSize(key);
		var radians = Math.abs(this.getLabelrotation() * (Math.PI / 180));
		var height = Math.abs(this.m_chart.m_height / 5) * Math.sin(radians);
		var avlblheight = Math.max(this.getLabelFontSize(), height);
		var adjustedX = x;
		if(IsBoolean(this.m_xaxiscategorytextwrap)){
			
			if (this.getTexts("" + key, avlblheight, this.getLabelFontProperties()).length > 1){
				adjustedX = this.getLabelrotation() < 0 ? x - 30 : x + 30;				
			}
			var text = this.drawSVGTextForCategory(x, y, key, this.m_labelfontcolor, "center", "middle", this.getLabelrotation(), avlblheight, nooflines, this.getLabelFontProperties(), this.getLabelFontSize(),adjustedX);			
		}else{
        	var text = drawSVGText((x), y, textData, this.m_labelfontcolor, "center", "start", this.getLabelrotation());			
		}
        $("#xaxiscategorylabelgrp" + temp.m_chart.m_objectid).append(text);
    }
};
GroupColumnXAxis.prototype.calculateLabelBoxSize = function(text) {
	var boxSize = this.m_chart.calculateCategoryBoxSize();
	var x = boxSize[text];
	var index = Object.keys(boxSize).indexOf(text);
	if (index > 0) {
		var y = boxSize[Object.keys(boxSize)[index - 1]];
	} else {
		var y = this.m_chart.getEndX();
	}
	var noOfLines = this.calculateLabelLength(text, (y - x));
	return noOfLines;
};
GroupColumnXAxis.prototype.calculateLabelLength = function(text, availableHeight) {
	var textBoxSize = availableHeight;
	var textSize = this.ctx.measureText(text).actualBoundingBoxAscent +  this.ctx.measureText(text).actualBoundingBoxDescent; ;
	textSize = textSize * 1.3;
	var lines = (textBoxSize / textSize).toFixed(0);
	return lines;
};
/** @description SVG drawing methods for TextWrap category and subcategory DAS-760**/
GroupColumnXAxis.prototype.drawSVGTextForCategory = function(x, y, text, fillColor, hAlign, Valign, angle, avlblWidth, nooflines, labelFontproperties, labelFontSize,transformx) {
	var newText = document.createElementNS(NS, "text");
	// set the below method to return the 3 lines label arrays
	var labelText1 = this.getTexts("" + text, avlblWidth, labelFontproperties);
	var labelText = labelText1.slice(0, 3);
	var extraDot = (labelText1.length > 3) ? "....." : "";

	var labelText = labelText1.slice(0, nooflines);
	labelText = labelText.slice(0, 3);
	var extraDot = (labelText1.length > labelText.length) ? "..." : "";
	if (labelText.length == 1) {
		if (!isNaN(x) && !isNaN(y)) {
			newText.setAttribute("x",transformx);
			newText.setAttribute("y", y);
			newText.setAttribute("fill", fillColor);
			if (angle !== "" && angle !== undefined && angle !== 0)
				newText.setAttribute("transform", "rotate(" + angle + " " + x + "," + y + ")");
			newText.textContent = labelText[0] + extraDot;
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
			for (var i = 0; i < labelText.length; i++) {
				var spanElement = document.createElementNS(NS, "tspan");
				if (i == 0) {
					spanElement.setAttribute("x", x);
				} else {
					spanElement.setAttribute("x", x);
					spanElement.setAttribute("dy", this.m_chart.fontScaling(labelFontSize) * 1);
				}
				spanElement.textContent = labelText[i];
				spanElement.textContent += (i == labelText.length - 1) ? extraDot : "";
				newText.appendChild(spanElement);
			}
		}
		return newText;
	}
};
/** @description methods for getting text with TextWrap category and subcategory DAS-760**/
GroupColumnXAxis.prototype.getTexts = function(text1, textWidth, ctxFont) {
	var text = "" + text1;
	var lines = [];
	var currentLine = "";
	this.ctx.font = ctxFont;

	for (var i = 0; i < text.length; i++) {
		var testLine = currentLine + text[i];
		var lineWidth = this.ctx.measureText(testLine).width;

		if (lineWidth > textWidth && currentLine) {
			lines.push(currentLine); 
			currentLine = text[i];   
		} else {
			currentLine = testLine;
		}
	}
	
	if (currentLine) {
		lines.push(currentLine);
	}

	return lines;

}
/** @description Drawing of label**/
GroupColumnXAxis.prototype.drawLabel = function(text, i) {
	if (this.m_chart.m_subcategoryorientation == "left") {
		var scm = this.m_chart.getSubCatTextMargin();
		/*DAS-728*/
		var cm = this.m_chart.getCatTextMargin();

	}
	var temp = this;
	var startX = (this.m_chart.m_xPositionArray[0][i] * 1 + this.m_chart.m_barWidth / 2);
	var addGap = (this.m_chart.m_subcategoryorientation == "right" && this.m_chart.m_chartbase == "rectangle") ? 12 : (this.m_chart.m_subcategoryorientation == "right") ? 5 : 0;
	/*DAS-728*/
	if (!IsBoolean(this.m_xaxiscategorytextwrap)) {/*DAS-760 text wrap for subcategory*/
		var fontProperties = this.m_chart.isEmptySubCategory ? this.getLabelFontProperties() : this.getSubCatLabelFontProperties();
		text = this.getText("" + text, this.m_chart.m_height / 5 - this.calculateAxisLineToTextGap(), fontProperties);
	}
	
	if (this.m_chart.m_subcategoryorientation == "right") {
		var text = drawSVGText((this.m_chart.getEndX() * 1 + addGap * 1), this.m_startY, text, this.m_labelfontcolor, "left", "middle", this.getLabelrotation());
	} else {
		/*DAS-760 text wrap for subcategory*/
		var radians = Math.abs(this.getLabelrotation() * (Math.PI / 180));
		var subcatboxwidth = (Math.abs(this.getXaxisDivison()) / 1.2);
		var nooflines = this.calculateLabelLength(text, subcatboxwidth);
		var height = Math.abs(this.m_chart.m_height / 5) * Math.sin(radians);
		var avlblheight = Math.max(this.m_subcategoryfontsize * 1, height);
		/*DAS-728*/
		if (this.m_chart.isEmptySubCategory) {
			if (IsBoolean(this.m_xaxiscategorytextwrap)) {
				var text = this.drawSVGTextForCategory(startX, this.m_startY + 2 * this.m_axislinetotextgap + cm / 2, text, this.m_labelfontcolor, "center", "start", this.getLabelrotation(),avlblheight, nooflines, this.getSubCatLabelFontProperties(), this.m_subcategoryfontsize, startX);
			} else {
				var text = drawSVGText(startX, this.m_startY + 2 * this.m_axislinetotextgap + cm / 2, text, this.m_labelfontcolor, "center", "start", this.getLabelrotation());
			}
		} else {
			if (IsBoolean(this.m_xaxissubcategorytextwrap)) {
				var text = this.drawSVGTextForCategory(startX, this.m_startY + 2 * this.m_axislinetotextgap + scm / 2, text, this.m_labelfontcolor, "center", "start", this.getLabelrotation(),avlblheight, nooflines, this.getSubCatLabelFontProperties(), this.m_subcategoryfontsize, startX);
			} else {
				var text = drawSVGText(startX, this.m_startY + 2 * this.m_axislinetotextgap + scm / 2, text, this.m_labelfontcolor, "center", "start", this.getLabelrotation());
			}
		}
	}
	/**DAS-531 when subactegory visible is false then append category label text into categorylabelgrp*/
	if (!IsBoolean(this.m_chart.isEmptySubCategory)) {
		$("#xaxissubcategorylabelgrp" + temp.m_chart.m_objectid).append(text);
	} else {
		$("#xaxiscategorylabelgrp" + temp.m_chart.m_objectid).append(text);
	}

};	

GroupColumnXAxis.prototype.getSubCatLabelFontProperties = function() {
    return this.m_textUtil.getFontProperties(this.getLabelFontStyle(), this.getLabelFontWeight(), this.m_chart.fontScaling(this.m_subcategoryfontsize), this.getLabelFontFamily());
};

GroupColumnXAxis.prototype.drawDescription = function() {
    var temp = this;
    var dsDec=this.m_chart.m_allCategoryDisplayNames.join("");
	var description=(IsBoolean(this.m_chart.m_xAxis.m_showdatasetdescription)) ? this.m_chart.formattedDescription(this.m_chart, dsDec) : this.m_chart.formattedDescription(this.m_chart, this.m_description);
	if (description != "") {
		var text = drawSVGText(this.getXDesc(), this.getYDesc(), this.m_chart.formattedDescription(this.m_chart, description), convertColorToHex(this.m_fontcolor), "middle", "middle");
	    $(text).css({
	        "font-family": selectGlobalFont(temp.getFontFamily()),
	        "font-style": temp.getFontStyle(),
	        "font-size": temp.m_chart.fontScaling(temp.getFontSize()) + "px",
	        "font-weight": temp.getFontWeight(),
	        "text-decoration": temp.getTextDecoration()
	    });
	    $("#" + temp.m_chart.svgContainerId).append(text);
	}
};

/** @description Getter for YAxisDivision width**/
GroupColumnXAxis.prototype.getXaxisDivison = function() {
    return ((this.m_endX - this.m_startX) / (this.m_xAxisData.length));
};

/** @description will draw x-axis labels  with their text properties. **/
GroupColumnXAxis.prototype.drawAxisLabels = function() {
    var temp = this;
    var tickMakrerHeight = 8;
    for (var i = 0; i < this.m_xAxisData.length + 1; i++) {
        var x1 = parseInt(this.m_startX * 1 + (this.getXaxisDivison()) * (i));
        var y1 = parseInt(this.m_startY);
        var x2 = parseInt(this.m_startX + (this.getXaxisDivison()) * (i));
        var y2 = parseInt(this.m_startY + tickMakrerHeight * 1);
        var tick = drawSVGLine(x1, y1, x2, y2, "0.9", temp.m_categorymarkingcolor);
        $("#xaxislabelgrp" + temp.m_chart.m_objectid).append(tick);
    }
};

/** @description Creating class for GroupColumnY Axis**/
function GroupColumnYAxis() {
    this.base = Yaxis;
    this.base();
    this.m_textUtil = new TextUtil();
    this.ctx;
    this.m_labeltilted = true;
    this.m_labelrotation = "0";
    this.m_axislinetotextgap = 5;
};

/** @description Making YAxis to the parent of GroupColumnYAxis using the prototype**/
GroupColumnYAxis.prototype = new Yaxis;

/** @description GroupColumnYAxis initialization**/
GroupColumnYAxis.prototype.init = function(m_chart, barCalculation) {
    this.m_chart = m_chart;
    this.ctx = this.m_chart.ctx;
    this.m_startX = this.m_chart.getStartX();
    this.m_startY = this.m_chart.getStartY();
    this.m_endX = this.m_chart.getEndX();
    this.m_endY = this.m_chart.getEndY();
    this.m_axisformater = true;
    this.setAxisFormatters();
};

GroupColumnYAxis.prototype.setAxisFormatters = function() {
	this.m_isFormatter = false;
	this.m_isSecondaryFormatter = false;
	if (!IsBoolean(this.m_chart.getFixedLabel())) {
		if (IsBoolean(this.getaxisFormater())) {
			this.setFormatter();
			this.setSecondaryFormatter();
		}
	}
};

GroupColumnYAxis.prototype.setSecondaryFormatter = function() {
	this.m_secondaryUnitSymbol = "";
	this.m_secondaryFormatterPosition = "";
	this.m_isSecondaryFormatter = false;
	//	if(this.m_chart.m_secondaryformater != "none" && this.m_chart.m_secondaryformater != "" && this.m_chart.getSecondaryUnit() != "Percent")
	if (this.m_chart.m_secondaryformater != "none" && this.m_chart.m_secondaryformater != "") {
		/** remove condition for Percent because secondary formatter is not working for % **/
		var secondaryFormatter = this.m_chart.getSecondaryFormater();
		var secondaryUnit = this.m_chart.getSecondaryUnit();
		if (secondaryUnit != "" && secondaryUnit != "none" && secondaryUnit != undefined) {
			this.m_isSecondaryFormatter = true;
			this.m_secondaryUnitSymbol = this.m_util.getFormatterSymbol(secondaryFormatter, secondaryUnit);
		}
		this.m_secondaryFormatterPosition = "suffix";
	}
};

GroupColumnYAxis.prototype.setFormatter = function() {
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

GroupColumnYAxis.prototype.getaxisFormater = function() {
	return this.m_axisformater;
};

GroupColumnYAxis.prototype.horizontalMarkerLines = function() {
    var temp = this;
    var markerArray = this.m_chart.m_yAxisMarkersArray;
    for (var i = 0; i < markerArray.length; i++) {
        if (markerArray.length > 1) {
            var newLine = drawSVGLine(this.m_startX, this.m_startY - (i * this.getYAxisDiv(markerArray)), this.m_endX, this.m_startY - (i * this.getYAxisDiv(markerArray)), "1", hex2rgb(temp.m_chart.m_markercolor, temp.m_chart.m_markertransparency));
            $("#horizontallinegrp" + temp.m_chart.m_objectid).append(newLine);
        }
    }
};

/** @description return one part height on y-axis. **/
GroupColumnYAxis.prototype.getYAxisDiv = function(markerArray) {
    return (this.m_startY - this.m_endY) / (markerArray.length - 1);
};

/** @description will draw zero Marker Line on SVG. **/
GroupColumnYAxis.prototype.zeroMarkerLine = function() {
    var temp = this;
    var markerArray = this.m_chart.m_yAxisMarkersArray;
    for (var i = 0; i < markerArray.length; i++) {
        if (markerArray.length > 0 && markerArray[i] == 0) {
            var newLine = drawSVGLine(this.m_startX * 1, this.m_startY * 1 - (this.getYAxisDiv(markerArray) * i), this.m_endX * 1, this.m_startY * 1 - (this.getYAxisDiv(markerArray) * i), "1", hex2rgb(temp.m_chart.m_zeromarkercolor, temp.m_chart.m_markertransparency));
            $("#" + temp.m_chart.svgContainerId).append(newLine);
            break;
        }
    }
};
GroupColumnYAxis.prototype.drawYAxis = function() {
	var temp = this;
	if (IsBoolean(this.m_showlineyaxis)) {
		var msfy = 1;
		/** msfy = margin space from y - axis 1 px **/
		var lineWidth = 0.5;
		var antiAliasing = 0.5;
		var strokeColor = this.m_lineyaxiscolor;
		var x1 = (this.m_startX * 1 - this.m_chart.m_axistodrawingareamargin) - msfy;
		var y1 = this.m_startY * 1 + msfy * 1 + this.m_chart.m_axistodrawingareamargin;
		var x2 = (this.m_startX * 1 - this.m_chart.m_axistodrawingareamargin) - msfy;
		var y2 = this.m_endY * 1;
		var temp = this;
		var newLine = drawSVGLine(x1, y1, x2, y2, lineWidth, strokeColor);
		$("#" + temp.m_chart.svgContainerId).append(newLine);
		//this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
	}
};
/** @description will draw zero Marker Line on SVG. **/
GroupColumnYAxis.prototype.markYaxis = function() {
    var temp = this;
    var markerArray = this.m_chart.m_yAxisMarkersArray;
    var dm = (this.getDescription() !== "") ? this.m_fontsize : 5;
    var avlblheight = this.m_chart.m_height / 4 - this.m_axislinetotextgap - dm;
    for (var i = 0; i < markerArray.length; i++) {
        var text = markerArray[i];
        text = this.getFormattedText(text, this.m_chart.m_precision);
        text = this.getText("" + text, avlblheight, this.getLabelFontProperties());
        var x = this.m_startX - 10;
        var y = this.m_startY - (i * this.getYAxisDiv(markerArray));
        text = drawSVGText(x, y, text, this.m_labelfontcolor, "end", "middle", this.getLabelrotation());
        $("#yaxislabelgrp" + temp.m_chart.m_objectid).append(text);
    }
    /*if (this.getDescription() != "") {
        this.drawDescription();
    }*/
    this.drawDescription();
};

/** @description If formatter is on than formatting the original text and return the text**/
GroupColumnYAxis.prototype.getFormattedText = function (text, prec) {
	var precision = (prec == "undefined" || prec == undefined) ? this.m_chart.m_precision : prec;
	if (text % 1 != 0 && precision < 1) {
		text = this.setPrecision(text, 0);
	} else if (!IsBoolean(this.m_isFormatter) && !IsBoolean(this.m_isSecondaryFormatter)) {
		if (precision !== "default") {
			text = this.setPrecision(text, precision);
		}
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
		if (this.m_secondaryUnitSymbol != "auto"){
			if (precision != 0 && precision != null){
				text = this.setPrecision(text, precision);
			}else if (text < 1 && text % 1 != 0){
				text = this.setPrecision(text, 2);
			}
			text = (text%1 === 0 && this.m_precision === "default") ? (text*1) : text;
			text = this.addSecondaryFormater(text, this.m_secondaryUnitSymbol);
		} else {
			var symbol = getNumberFormattedSymbol(text * 1, this.m_chart.m_unit);
			var val = getNumberFormattedNumericValue(text * 1, precision, this.m_chart.m_unit);
			text = this.setPrecision(val, precision);
			if (precision != 0 && precision != null){
				text = this.setPrecision(text, precision);
			}else if (text < 1 && text % 1 != 0){
				text = this.setPrecision(text, 2);
			}
			text = (text%1 === 0 && this.m_precision === "default") ? (text*1) : text;
			text = this.addSecondaryFormater(text, symbol);
		}
	}
	text = getFormattedNumberWithCommas(text, this.m_chart.m_numberformatter, this.m_chart.m_unit);
	if (IsBoolean(this.m_isFormatter) && this.m_unitSymbol != undefined) {
		text = this.m_util.addFormatter(text, this.m_unitSymbol, this.m_formatterPosition, precision);
	}
	return text;
};

GroupColumnYAxis.prototype.drawDescription = function() {
    var temp = this;
    var fontColor = convertColorToHex(this.getFontColor());
	var fontSize = temp.m_chart.fontScaling(temp.getFontSize()) * 1;
	var serDec = this.m_chart.m_allSeriesDisplayNames.reduce(function(acc, item) { return item !== "" ? (acc === "" ? item : acc + ", " + item) : acc; }, "");
	var m_formattedDescription=(IsBoolean(this.m_chart.m_yAxis.m_showdatasetdescription)) ? this.m_chart.formattedDescription(this.m_chart, serDec) : this.m_chart.formattedDescription(this.m_chart, this.getDescription());
	if (m_formattedDescription != "") {
		var separatorSign = (IsBoolean(this.m_chart.m_enablehtmlformate.xaxis)) ? "<br>" : "\\n";
		var descTextArr = m_formattedDescription.split(separatorSign);
		/**Removing array element When its length more then 3 bcz we are providing max three lines for axis desription*/
		if(descTextArr.length > 3) {
			descTextArr.splice(3, descTextArr.length-3);
		}

		var x = this.getXDesc();
		
		var y = this.getYDesc()+50;
	    /*old*/
		//var text = drawSVGText(this.getXDesc(), this.getYDesc(), this.m_chart.formattedDescription(this.m_chart, this.getDescription()), convertColorToHex(this.getFontColor()), "middle", "middle", 270);
		//var text = drawSVGText(x,y, this.m_chart.formattedDescription(this.m_chart, ""), convertColorToHex(this.m_fontcolor), "middle", "middle", 270);
		var text = drawSVGText(x, y, "", fontColor, "middle", "end", 270);
	    wrapSVGText(temp, x,y, descTextArr, text, fontSize, (this.m_startY * 1) - (this.m_endY * 1)+100);
	    
	    $(text).css({
	        "font-family": selectGlobalFont(temp.getFontFamily()),
	        "font-style": temp.getFontStyle(),
	        "font-size": temp.m_chart.fontScaling(temp.getFontSize()) + "px",
	        "font-weight": temp.getFontWeight(),
	        "text-decoration": temp.getTextDecoration()
	    });
	    $("#" + temp.m_chart.svgContainerId).append(text);
	}
};

//# sourceURL=GroupColumnChart.js