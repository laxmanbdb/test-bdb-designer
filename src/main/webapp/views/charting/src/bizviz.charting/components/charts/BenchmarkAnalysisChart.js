/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: BenchmarkAnalysisChart.js
 * @description BenchmarkAnalysisChart
 **/
function BenchmarkAnalysisChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();
	this.m_x = 400;
	this.m_y = 20;
	this.m_width = 300;
	this.m_height = 200;

	this.m_candleWidth = "";
	this.m_generatexml = "";
	this.m_candleColor = "";
	this.m_seriesNames = [];
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_xPixelArray = [];
	this.m_yPixelArray = [];
	this.m_medianLinePixelArray = [];
	this.m_outlierPixelArray = [];
	this.m_linePixelArray = [];
	this.m_candleHeightArray = [];
	this.m_candlesArray = [];
	this.undrawableCategories = [];
	this.m_lowerboxfillcolors = "#4183d7,#663399";
	this.m_upperboxfillcolors = "#f7ca18,#2ecc71";
	this.m_boxfillopacity = "0.8,0.8";
	this.m_boxgroupnames = "Male,Female";

	this.m_benchMarkCalculation = new BenchMarkCalculation();
	this.m_xAxis = new BenchXaxis();
	this.m_yAxis = new Yaxis();
	this.m_labelfontsize = 16;

	this.noOfRows = 1;
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_fieldtypes = ["Max", "Min", "Q3", "Q1", "Median", "Outlier"];
	this.isValidConfig = true;
	this.m_designModeDrawingFlag = true;
	this.m_scrollviewlimit = "0";
	
	this.m_colHeadersFieldName = [];
	this.m_gridheaderDisplayNames = [];
	this.m_widthArr = [];
	this.m_textAlignArr = [];
	this.m_sortingColumnsArr = [];
	
	this.m_rollovercolor = "#E7E7E7";
	this.m_rowopacity = 0.6;
    this.m_headerrowopacity = 0.6;
    this.m_rowhoveropacity = 0.4;
    this.m_rowselectedopacity = 0.4;
	this.m_columnrearrange = true;
    this.m_headerfontsize= 16;
	this.m_headerfontcolor = "#000000";
	this.m_headerchromecolor = "#E7E7E7";
	this.m_headerfontweight = "bold";
    this.m_gridlabelFontColor = "#000000"
    this.m_gridlabelfontsize = 14;
    this.m_gridlabelfontweight = "normal"
	this.m_textWrap = false;
	this.m_fitcolumns = "false";
	this.m_showdatavalidation = true;
};

/** @description Making prototype of chart class to inherit its properties and methods into BoxPlot chart **/
BenchmarkAnalysisChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
BenchmarkAnalysisChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
BenchmarkAnalysisChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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

/** @description Setter Method to setStartX position for draw the Chart. **/
BenchmarkAnalysisChart.prototype.setStartX = function () {
	this.yaxisLabelFont = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
	this.yaxisDescriptionFont = this.m_yAxis.m_fontstyle + " " + this.m_yAxis.m_fontweight + " " + this.fontScaling(this.m_yAxis.m_fontsize) + "px " + selectGlobalFont(this.m_yAxis.m_fontfamily);
	var btdm = this.getBorderToDescriptionMargin();
	var dm = this.getYAxisDescriptionMargin();
	var dtlm = this.getDescriptionToLabelMargin();
	var ltam = this.getLabelToAxisMargin();
	this.setMaxMinSeriesValue();
	var lm = this.getYAxisLabelMargin();
	this.m_startX = this.m_x * 1 + btdm * 1 + dm * 1 + dtlm * 1 + lm * 1 + ltam * 1;
};

/** @description Getter Method of YAxisLabelMargin. **/
BenchmarkAnalysisChart.prototype.getYAxisLabelMargin = function () {
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

/** @description Getter Method of LabelFormatterMargin. **/
BenchmarkAnalysisChart.prototype.getLabelFormatterMargin = function () {
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

/** @description Getter Method of LabelWidth. **/
BenchmarkAnalysisChart.prototype.getLabelWidth = function () {
	return this.m_labelwidth;
};

/** @description Setter Method to set LabelWidth. **/
BenchmarkAnalysisChart.prototype.setLabelWidth = function() {
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
						if (this.m_precision !== "default")
							maxSeriesVal = this.m_yAxis.setPrecision(maxSeriesVal, this.m_precision);
					}
					this.ctx.beginPath();
					this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
					maxSeriesVal = getFormattedNumberWithCommas(maxSeriesVal, this.m_numberformatter);
					maxSeriesVals[i] = this.ctx.measureText(maxSeriesVal).width;
					this.ctx.closePath();
				}
			}
		}
		this.m_labelwidth = getMaxValueFromArray(maxSeriesVals);
	}
};

/** @description Getter Method of LabelSignMargin. **/
BenchmarkAnalysisChart.prototype.getLabelSignMargin = function () {
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

/** @description Getter Method of LabelPrecisionMargin. **/
BenchmarkAnalysisChart.prototype.getLabelPrecisionMargin = function () {
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

/** @description Getter Method of MinimumSeriesValue. **/
BenchmarkAnalysisChart.prototype.getMinimumSeriesValue = function () {
	return this.m_minimumseriesvalue;
};

/** @description Getter Method of MaximumSeriesValue. **/
BenchmarkAnalysisChart.prototype.getMaximumSeriesValue = function () {
	return this.m_maximumSeriesValue;
};

/** @description Setter Method of MaxMinSeriesValue. **/
BenchmarkAnalysisChart.prototype.setMaxMinSeriesValue = function () {
	this.m_maximumSeriesValue = 0;
	this.m_minimumseriesvalue = 0;
	for (var i = 0, length=this.m_seriesData.length; i < length; i++) {
		for (var j = 0; j < this.m_seriesData[i].length; j++) {
			for (var k = 0; k < this.m_seriesData[i][j].length; k++) {
				var data = this.m_seriesData[i][j][k];
				data = (isNaN(data) || data == undefined || data == "") ? 0 : data;
				if (i == 0 && j == 0 && k == 0) {
	this.max_maximumSeriesValue = data;
					this.m_minimumseriesvalue = data;
				}
				if (this.m_maximumSeriesValue * 1 <= data * 1) {
					this.m_maximumSeriesValue = data;
				}
				if (this.m_minimumseriesvalue * 1 >= data * 1) {
					this.m_minimumseriesvalue = data;
				}
			}
		}
	}
};

/** @description Getter Method of LabelSecond FormatterMargin. **/
BenchmarkAnalysisChart.prototype.getLabelSecondFormatterMargin = function () {
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

/** @description Getter Method of FormatterMargin. **/
BenchmarkAnalysisChart.prototype.getFormatterMargin = function () {
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

/** @description Setter Method to setEndX for BenchmarkAnalysisChart. **/
BenchmarkAnalysisChart.prototype.setEndX = function () {
	var blm = this.getBorderToLegendMargin();
	var vlm = this.getVerticalLegendMargin();
	var vlxm = this.getVerticalLegendToXAxisMargin();
	var rightSideMargin = blm * 1 + vlm * 1 + vlxm * 1;

	this.m_endX = (this.m_x * 1 + this.m_width * 1 - rightSideMargin * 1);
};

/** @description Setter Method to setStartY for BenchmarkAnalysisChart. **/
BenchmarkAnalysisChart.prototype.setStartY = function () {
	var cm = this.getChartMargin();
	var xlbm = this.getXAxisLabelMargin();
	var xdm = this.getXAxisDescriptionMargin();
	var bottomMargin = cm * 1 + xlbm * 1 + xdm * 1;
	this.m_startY = (this.m_y * 1 + ((this.m_height* 1 ) * 0.65)- bottomMargin * 1);
	//this.m_startY = this.m_startY * 0.65;
};

/** @description Getter Method of XAxisLabelMargin **/
BenchmarkAnalysisChart.prototype.getXAxisLabelMargin = function () {
	var xAxislabelDescMargin = this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.8;
	var radians = this.m_xAxis.m_labelrotation * (Math.PI / 180);
	this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
	if (IsBoolean(this.m_xAxis.getLabelTilted())) {
		for (var i = 0, length=this.m_categoryData.length; i < length; i++) {
			for (var j = 0; j < this.m_categoryData[i].length; j++) {
				var markerWidth =  Math.abs(this.ctx.measureText(this.m_categoryData[i][j]).width * radians);
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

/** @description Setter Method of NoOfRows for draw x-axis labels. **/
BenchmarkAnalysisChart.prototype.setNoOfRows = function () {
	this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
	var textWidth = this.ctx.measureText(this.m_categoryData[0][0]).width;
	var xDivision = (this.getEndX() - this.getStartX()) / this.m_categoryData[0].length;
	var noOfRow = 1;
	for (var i = 1, length=this.m_categoryData[0].length; i < length; i++) {
		if (this.ctx.measureText(this.m_categoryData[0][i]).width > xDivision)
			noOfRow = 2;
	}
	return noOfRow;
};

/** @description Setter Method of setEndY. **/
BenchmarkAnalysisChart.prototype.setEndY = function () {
	this.m_endY = (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};

/** @description Getter Method of DataProvider **/
BenchmarkAnalysisChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description Getter Method of CategoryNames **/
BenchmarkAnalysisChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};

/** @description Getter Method of SubCategoryNames **/
BenchmarkAnalysisChart.prototype.getSubCategoryNames = function () {
	return this.m_subCategoryNames;
};

/** @description Getter Method of SubCategory DisplayNames **/
BenchmarkAnalysisChart.prototype.getSubCategoryDisplayNames = function () {
	return this.m_subCategoryDisplayNames;
};

/** @description Getter Method of Category DisplayNames **/
BenchmarkAnalysisChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

/** @description Setter Method of Fields according to fieldType **/
BenchmarkAnalysisChart.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	var categoryJson = [];
	var subCategoryJson = [];
	var seriesJson = [];
	for (var i = 0, length=fieldsJson.length; i < length; i++) {
		var fieldType = this.getProperAttributeNameValue(fieldsJson[i], "Type");
		switch (fieldType) {
		case "Category":
			categoryJson.push(fieldsJson[i]);
			break;
		case "SubCategory":
			subCategoryJson.push(fieldsJson[i]);
			break;
		case "CalculatedField":
			seriesJson.push(fieldsJson[i]);
			break;
		default:
			seriesJson.push(fieldsJson[i]);
			break;
		}
	}
	this.setCategory(categoryJson);
	this.setSubCategory(subCategoryJson);
	this.setChartTypeAccordingToSubCategory();
	this.setSeries(seriesJson);
};

/** @description Setter Method of Category iterate for all category. **/
BenchmarkAnalysisChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	this.m_allCategoryNames = [];
	this.m_allCategoryDisplayNames = [];
	this.m_categoryVisibleArr = {};
	this.m_categoryFieldColor = [];
	this.m_widthArr = [];
	this.m_textAlignArr = [];
	this.m_sortingColumnsArr = [];
	var count = 0;
	// only one category can be set for chart, preference to first visible one
	this.m_widthArr.push(this.getProperAttributeNameValue(categoryJson[0], "width"));
	for (var i = 0, length=categoryJson.length; i < length; i++) {
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

/** @description Setter Method of ChartType AccordingTo SubCategory. **/
BenchmarkAnalysisChart.prototype.setChartTypeAccordingToSubCategory = function () {
	this.m_chartType = "clustered";
	if (this.m_categoryNames.length == 0 || this.m_subCategoryNames.length == 0) {
		this.m_chartType = "stacked";
	}
};

/** @description Setter Method to set SubCategory. **/
BenchmarkAnalysisChart.prototype.setSubCategory = function (subCategoryJson) {
	this.m_subCategoryNames = [];
	this.m_subCategoryDisplayNames = [];
	this.m_allSubCategoryNames = [];
	this.m_allSubCategoryDisplayNames = [];
	this.m_subCategoryVisibleArr = {};
	this.m_subCategoryFieldColor = [];
	var count = 0;
	// only one category can be set for chart, preference to first visible one
	for (var i = 0, length=subCategoryJson.length; i < length; i++) {
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(subCategoryJson[i], "DisplayName"));
		this.m_allSubCategoryDisplayNames[i] = m_formattedDisplayName;
		this.m_allSubCategoryNames[i] = this.getProperAttributeNameValue(subCategoryJson[i], "Name");
		this.m_subCategoryVisibleArr[this.m_allSubCategoryDisplayNames[i]] = this.getProperAttributeNameValue(subCategoryJson[i], "visible");
		if (IsBoolean(this.m_subCategoryVisibleArr[this.m_allSubCategoryDisplayNames[i]])) {
			this.m_subCategoryNames[count] = this.getProperAttributeNameValue(subCategoryJson[i], "Name");
			this.m_subCategoryDisplayNames[count] = m_formattedDisplayName;
			this.m_subCategoryFieldColor[count] = this.getProperAttributeNameValue(subCategoryJson[i], "Color");
			count++;
		}
	}
};

/** @description creating array for each property of fields and storing in arrays **/
BenchmarkAnalysisChart.prototype.setSeries = function (seriesJson) {
	// this order has to be maintained  types array cannot be changed
	var types = this.m_fieldtypes;
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = [];
	this.m_legendNames = [];

	this.m_outlierShapes = [];
	this.m_outlierColors = [];
	this.m_outlierOpacity = [];
	this.m_outlierRadius = [];
	this.m_outlierDataSeperator = [];

	this.m_allSeriesDisplayNames = [];
	this.m_allSeriesNames = [];
	this.m_seriesVisibleArr = {};
	this.m_reqSeriesVisibleArr = {};
/*
	this.m_colHeadersFieldName = [];
	this.m_gridheaderDisplayNames = [];
	this.m_widthArr = [];
	this.m_textAlignArr = [];
	this.m_sortingColumnsArr = [];*/
	
	for (var j = 0, length=this.m_fieldtypes.length; j < length; j++) {
		this.m_reqSeriesVisibleArr[this.m_fieldtypes[j]] = {};
		this.m_reqSeriesVisibleArr[this.m_fieldtypes[j]]["visible"] = (this.m_fieldtypes[j] != "Outlier") ? false : true;
		for (var i = 0; i < seriesJson.length; i++) {
			var type = this.getProperAttributeNameValue(seriesJson[i], "Type");
			var visiblity = this.getProperAttributeNameValue(seriesJson[i], "visible");
			var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
			this.m_allSeriesDisplayNames[i] = m_formattedDisplayName;
			
			//this.m_gridheaderDisplayNames[i] = m_formattedDisplayName;
			//this.m_widthArr[i] = this.getProperAttributeNameValue(seriesJson[i], "width");
			//this.m_textAlignArr[i] = this.getProperAttributeNameValue(seriesJson[i], "textAlign");
			//var sorting = this.getProperAttributeNameValue(seriesJson[i], "sorting");
			//this.m_sortingColumnsArr[i] = (sorting == undefined) ? true : IsBoolean(sorting)
			
			this.m_seriesVisibleArr[this.m_allSeriesNames[i]] = visiblity;
			this.m_allSeriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
			if (IsBoolean(visiblity)) {
				if (this.m_fieldtypes[j] == type) {
					this.m_reqSeriesVisibleArr[this.m_fieldtypes[j]]["visible"] = true;
					this.m_seriesNames.push(this.getProperAttributeNameValue(seriesJson[i], "Name"));
					this.m_legendNames.push(m_formattedDisplayName);
					this.m_seriesDisplayNames.push(m_formattedDisplayName);
					this.m_seriesColors.push(convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color")));

					this.m_outlierShapes.push(this.getProperAttributeNameValue(seriesJson[i], "PlotType"));
					this.m_outlierColors.push(this.getProperAttributeNameValue(seriesJson[i], "Color"));
					this.m_outlierOpacity.push(this.getProperAttributeNameValue(seriesJson[i], "PlotTransparency"));
					this.m_outlierRadius.push(this.getProperAttributeNameValue(seriesJson[i], "PlotRadius"));

					var dataSeperator = this.getProperAttributeNameValue(seriesJson[i], "DataSeperator");
					this.m_outlierDataSeperator.push( (dataSeperator != undefined && dataSeperator !== null && dataSeperator !== "") ? dataSeperator : "~" );
					if (type != "Outlier"){
						break;
					}
				}
			}
		}
	}
};

/** @description Getter Method of SeriesNames. **/
BenchmarkAnalysisChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};

/** @description Getter Method of SeriesDisplayNames. **/
BenchmarkAnalysisChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};

/** @description Getter Method of SeriesColors. **/
BenchmarkAnalysisChart.prototype.getSeriesColors = function () {
	return this.m_seriesColors;
};

/** @description Getter Method of BoxFillColors. **/
BenchmarkAnalysisChart.prototype.getBoxFillColors = function () {
	return this.m_boxFillColors;
};

/** @description Setter Method to set BoxFillColors. **/
BenchmarkAnalysisChart.prototype.setBoxFillColors = function () {
	this.m_boxFillColors = [];
	if (this.m_lowerboxfillcolors.length > 0) {
		var lower = this.m_lowerboxfillcolors.split(",");
		var upper = this.m_upperboxfillcolors.split(",");
		var opacity = this.m_boxfillopacity.split(",");
		var names = this.m_boxgroupnames.split(",");
		for (var i = 0, length=lower.length; i < length; i++) {
			this.m_boxFillColors[i] = [];
			this.m_boxFillColors[i][0] = lower[i];
			this.m_boxFillColors[i][1] = upper[i];
			this.m_boxFillColors[i][2] = opacity[i];
		}
	}
};

/** @description Setter Method to set LegendNames. **/
BenchmarkAnalysisChart.prototype.setLegendNames = function (m_legendNames) {
	if (this.m_chartType == "clustered") {
		this.m_legendNames = this.m_subCateogryData;
	} else {
		this.m_legendNames = [this.m_seriesDisplayNames[3], this.m_seriesDisplayNames[2]];
	}
};

/** @description Getter Method of LegendNames. **/
BenchmarkAnalysisChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};

/** @description Setter Method to set AllFieldsName. **/
BenchmarkAnalysisChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getCategoryNames()[i]);
	}
	for (var j = 0; j < this.getSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getSeriesNames()[j]);
	}
};

/** @description Getter Method of AllFieldsName. **/
BenchmarkAnalysisChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

/** @description Setter Method to set AllFieldsDisplayName. **/
BenchmarkAnalysisChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

/** @description Getter Method of AllFieldsDisplayName. **/
BenchmarkAnalysisChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

/** @description Setter Method to set CategorySeriesData. **/
BenchmarkAnalysisChart.prototype.setCategorySeriesData = function () {
	this.m_categoryData = [];
	this.m_subCategoryData = [];
	this.m_seriesData = [];
	this.m_seriesDataForToolTip = [];
	this.m_displaySeriesDataFlag = [];
	for (var k = 0, length=this.getDataProvider().length; k < length; k++) {
		var record = this.getDataProvider()[k];
		this.isEmptyCategory = true;
		if (this.getCategoryNames().length > 0) {
			this.isEmptyCategory = false;
			for (var i = 0 ,innerlength= this.getCategoryNames().length ; i <innerlength ; i++) {
				if( !this.m_categoryData[i] )
					this.m_categoryData[i] = [];
				var data = this.getValidFieldDataFromRecord(record,this.getCategoryNames()[i]);
				this.m_categoryData[i][k] = data;
			}
		}
		
		this.isEmptySubCategory = true;
		if (this.getSubCategoryNames().length > 0){
			this.isEmptySubCategory = false;
			for (var l = 0,innerlength= this.getSubCategoryNames().length ; l <innerlength; l++) {
				if( !this.m_subCategoryData[l] )
					this.m_subCategoryData[l] = [];
				var data = this.getValidFieldDataFromRecord(record,this.getSubCategoryNames()[l]);
				this.m_subCategoryData[l][k] = data;
			}
		}
	
		this.m_displaySeriesDataFlag[k] = [];
		for (var j = 0, innerlength=this.getSeriesNames().length ; j <innerlength; j++) {
			if( !this.m_seriesData[j] ){
				this.m_seriesData[j] = [];
				this.m_seriesDataForToolTip[j] = [];
			}
			var data = this.getValidFieldDataFromRecord(record,this.getSeriesNames()[j]);
			this.m_displaySeriesDataFlag[k][j] = true;
			if (isNaN(data)) {
				this.m_displaySeriesDataFlag[k][j] = false;
				data = getNumericComparableValue(data);
			}			
			this.m_seriesData[j][k] = data;
			this.m_seriesDataForToolTip[j][k] = data;
		}
		
	}
};

/** @description Setter Method to set CategoryData. **/
BenchmarkAnalysisChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	this.isEmptyCategory = true;
	for (var i = 0, length= this.getCategoryNames().length ; i <length ; i++) {
		this.isEmptyCategory = false;
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
};

/** @description Getter Method of CategoryData. **/
BenchmarkAnalysisChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

/** @description Setter Method to set SubCategoryData. **/
BenchmarkAnalysisChart.prototype.setSubCategoryData = function () {
	this.m_subCategoryData = [];
	this.isEmptySubCategory = true;
	for (var i = 0, length=this.getSubCategoryNames().length ; i < length; i++) {
		this.isEmptySubCategory = false;
		this.m_subCategoryData[i] = this.getDataFromJSON(this.getSubCategoryNames()[i]);
	}
};

/** @description Getter Method of SubCategoryData. **/
BenchmarkAnalysisChart.prototype.getSubCategoryData = function () {
	return this.m_subCategoryData;
};

/** @description Method will convert 2D Array to 1D Array. **/
BenchmarkAnalysisChart.prototype.convert2DTo1D = function (data) {
	var temp = [];
	for (var i = 0, length= data.length ; i <length; i++) {
		for (var j = 0, innerlength=data[i].length ; j <innerlength ; j++) {
			temp.push(data[i][j]);
		}
	}
	return temp;
};

/** @description Method will provide the unique data. **/
BenchmarkAnalysisChart.prototype.unique = function (data) {
	var outputArray = [];
	for (var i = 0, length= data.length ; i <length; i++) {
		if (($.inArray(data[i], outputArray)) == -1) {
			outputArray.push(data[i]);
		}
	}
	return outputArray;
};

/** @description Setter Method to set  SeriesData. **/
BenchmarkAnalysisChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0, length= this.getSeriesNames().length ; i <length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
};
/** @description Getter Method of  SeriesData. **/
BenchmarkAnalysisChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

/** @description Setter Method to set  SeriesColor. **/
BenchmarkAnalysisChart.prototype.setSeriesColor = function (m_seriesColor) {
	this.m_seriesColor = m_seriesColor;
};

/** @description Getter Method of SeriesColor. **/
BenchmarkAnalysisChart.prototype.getSeriesColor = function () {
	return this.m_seriesColor;
};

/** @description Method to checking  Valid Configuration and returning true and false accordingly. **/
BenchmarkAnalysisChart.prototype.checkValidConfiguration = function () {
	this.isValidConfig = true;
	for (var j = 0,length=this.m_fieldtypes.length ; j < length; j++) {
		if (!IsBoolean(this.m_reqSeriesVisibleArr[this.m_fieldtypes[j]]["visible"]))
			this.isValidConfig = false;
	}
};

/** @description Method will update Data For BoxPlot accordingly for category/subCategory/Series/tooltip. **/
BenchmarkAnalysisChart.prototype.updateDataForBoxPlot = function () {
	if (this.m_chartType == "clustered") {
		var cat = this.unique(this.convert2DTo1D(this.m_categoryData));
		var subCat = this.m_subCateogryData = this.unique(this.convert2DTo1D(this.m_subCategoryData));

		var seriesData = [];
		for (var i = 0,length=cat.length ; i < length; i++) {
			seriesData[i] = [];
			for (var j = 0,innerlength=subCat.length ; j < innerlength; j++) {
				var data = [];
				for (var k = 0, datalength=this.getDataProvider().length ; k <datalength ; k++) {
					if (this.getDataProvider()[k][this.getCategoryNames()] == cat[i] && this.getDataProvider()[k][this.getSubCategoryNames()] == subCat[j]) {
						for (var l = 0; l < this.getSeriesNames().length; l++) {
							var FieldData = this.getDataProvider()[k][this.getSeriesNames()[l]];
							if (l < 5)
								data[l] = FieldData;
							else {
								var seperator = this.m_outlierDataSeperator[l];
								if (FieldData && ("" + FieldData).indexOf(seperator) > -1) {
									var arr = ("" + FieldData).split(seperator);
									data[l] = arr;
								} else {
									data[l] = [FieldData];
								}
							}
						}
					}
				}
				seriesData[i][j] = data;
			}
		}
	} else {
		var cat = (this.m_categoryNames.length != 0) ? this.convert2DTo1D(this.m_categoryData) : this.convert2DTo1D(this.m_subCategoryData);
		var subCat = [];
		this.m_subCateogryData = [[]];
		var seriesData = [];
		for (var i = 0,length= cat.length ; i <length; i++) {
			seriesData[i] = [];
			for (var j = 0; j < 1; j++) {
				var data = [];
				for (var l = 0,innerlength= this.getSeriesNames().length ; l <innerlength; l++) {
					var FieldData = this.getDataProvider()[i][this.getSeriesNames()[l]];
					if (l < 5)
						data[l] = FieldData;
					else {
						var seperator = this.m_outlierDataSeperator[l];
						if (FieldData && ("" + FieldData).indexOf(seperator) > -1) {
							var arr = ("" + FieldData).split(seperator);
							data[l] = arr;
						} else {
							data[l] = [FieldData];
						}
					}
				}
				seriesData[i][j] = data;
			}
		}
	}
	this.m_categoryData = [cat];
	this.m_subCategoryData = [subCat];
	this.m_seriesData = seriesData;
	this.m_seriesDataForToolTip = JSON.parse(JSON.stringify(this.m_seriesData));

	this.m_seriesData = this.getUpdateSeriesData(this.m_seriesData);
};
/** @description creation of Div and Table ,Table is appended into div and setting CSS property **/
BenchmarkAnalysisChart.prototype.createDatagrid = function() {
    var temp = this;
    if (this.m_designModeDrawingFlag) {
        $("#dataGridDiv" + this.m_componentid).remove();
        var dataGridDiv = document.createElement("div");
        dataGridDiv.setAttribute("id", this.m_componentid);
        $("#draggableDiv" + temp.m_objectid).append(dataGridDiv);

        var tableObj = document.createElement("table");
        tableObj.setAttribute("id", "datagridTable" + this.m_objectid);
        $("#draggableDiv" + temp.m_objectid).append(tableObj);
        dataGridDiv.appendChild(tableObj);
    }
    var border = (IsBoolean(this.m_showborder)) ? (this.m_borderthickness) : 0;
    /*adobe new chart styles*/
    var subtitleFontMargin = (IsBoolean(this.m_subTitle.m_showsubtitle) && this.m_subTitle.getDescription() != "") ? 16 : 0 ; /**Added 4 to resolve subtitle font size less then 17 underline does not visible because header overlap the underline.*/
	$("#" + temp.m_componentid).css({
    	"top": 1 * (this.m_y) + 1 * (this.m_titleHeight) + 1 * (this.m_subTitleHeight) + 1 * (subtitleFontMargin) + "px",
    	"left": 1 * (this.m_x) + 1 * border + "px",
    	"position": "absolute"
    });

    $("#datagridTable" + temp.m_objectid).css({
    	"width": this.m_width - border * 2 + "px",
    	"height": 1 * (this.m_height) - 1 * (this.m_titleHeight) - 1 * this.m_subTitleHeight - 1 * (this.m_DGFilterHeight) - 2 * border - subtitleFontMargin + "px"
    });
    this.m_gridFilterCondition = "";
};
/** @description initialization of BenchmarkAnalysisChart **/
BenchmarkAnalysisChart.prototype.init = function () {
	this.setCategorySeriesData();
	this.checkValidConfiguration();

	this.setAllFieldsName();
	this.setAllFieldsDisplayName();

	this.isSeriesDataEmpty();

	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);

	if (!IsBoolean(this.m_isEmptySeries)) {
		if (IsBoolean(this.isValidConfig)) {
			this.updateDataForBoxPlot();
			this.initializeCalculation();
			this.m_xAxis.init(this, this.m_benchMarkCalculation);
			this.m_yAxis.init(this, this.m_benchMarkCalculation);
			this.createDivForDataGrid();			
		}
	}
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};

/** @description Getter Method of UpdateSeriesData **/
BenchmarkAnalysisChart.prototype.getUpdateSeriesData = function (data) {
	for (var i = 0,length=data.length ; i < length; i++) {
		data[i] = this.getUpdateSeriesDataWithCommaSeperators(data[i]);
	}
	return data;
};

/** @description Getter Method to get Update SeriesData With CommaSeperators **/
BenchmarkAnalysisChart.prototype.getUpdateSeriesDataWithCommaSeperators = function (data) {
	for (var i = 0,length= data.length ; i <length; i++) {
		for (var j = 0,innerlength= data[i].length ; j <innerlength; j++) {
			if (isNaN(data[i][j]) && (typeof data[i][j]) != "object") {
				data[i][j] = (data[i][j] == undefined) ? 0 : getNumericComparableValue(data[i][j]);
			} else {
				data[i][j] = data[i][j];
			}
		}
	}
	return data;
};

/** @description Drawing of component started by drawing different parts of component like Title,Subtitle, Axes, legends etc... **/
BenchmarkAnalysisChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	
	if (!(IsBoolean(this.isEmptyCategory)) || !(IsBoolean(this.isEmptySubCategory))) {
		if (!IsBoolean(this.m_isEmptySeries)) {
			if (IsBoolean(this.isValidConfig)) {
				this.drawXAxis();
				this.drawYAxis();
				this.drawBenchmarkCandleChart();
				if (this.undrawableCategories.length > 0 && !IsBoolean(this.m_designMode)) {
					var text = "*If the median or other values are incorrect, the chart or candle may not display correctly."
					this.ctx.beginPath();
					this.ctx.fillStyle ="#b80202";
					this.ctx.font = this.m_statusfontsize + "px " + selectGlobalFont(this.m_statusfontfamily);
					this.ctx.textAlign = "left";
				    var textWidth = this.ctx.measureText(text).width;
					var margin = this.m_width - textWidth;
					this.ctx.fillText(text, this.m_x * 1 + margin / 2, (((this.m_height* 1 ) * 0.65) - 12));
					this.ctx.fill();
					this.ctx.closePath();
				}
				this.drawBenchmarkGrid();
			} else {
				this.drawMessage("Invalid chart configuration");
			}
		} else {
			this.drawMessage(this.m_status.noData);
		}
	} else {
		this.drawMessage("No Visible Category Or SubCategory Field Available");
	}
};

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
BenchmarkAnalysisChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description  initialization of draggable div and its inner Content **/
BenchmarkAnalysisChart.prototype.initializeDraggableDivAndCanvas = function () {
	var temp = this;
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDivForCanvas();
	$("#draggableCanvas" + this.m_objectid).remove();
	var draggableCanvas = document.createElement("canvas");
	draggableCanvas.id = "draggableCanvas" + this.m_objectid;
	$("#divForCanvas" + temp.m_objectid).append(draggableCanvas);
	draggableCanvas.width = this.m_width;
	draggableCanvas.height = this.m_height;
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};
/** @description  initialization of draggable div and its inner Content **/
BenchmarkAnalysisChart.prototype.createDivForCanvas = function () {
	var temp = this;
	$("#divForCanvas" + this.m_objectid).remove();
	var draggableCanvas = document.createElement("div");
	draggableCanvas.id = "divForCanvas" + this.m_objectid;
	$("#draggableDiv"+ temp.m_objectid).append(draggableCanvas);
};
/** @description  initialization of draggable div and its inner Content **/
BenchmarkAnalysisChart.prototype.createDivForDataGrid = function() {
	var temp = this;
	$("#dataGridDiv" + temp.m_objectid).remove();
	var dataGridDiv = document.createElement("div");
	dataGridDiv.setAttribute("id", "dataGridDiv" + temp.m_objectid);
	var tableObj = document.createElement("table");
	tableObj.setAttribute("id", "datagridTable" + this.m_objectid);
	dataGridDiv.appendChild(tableObj);
	$("#draggableDiv" + temp.m_objectid).append(dataGridDiv);

	$("#dataGridDiv" + temp.m_objectid).css({
		"position": "absolute",
		"top":(((this.m_height* 1 ) * 0.65) - 2 )+"px",
		"width":this.m_width + "px"
	});

	$("#datagridTable" + temp.m_objectid).css({
		"width": this.m_width + "px",
		"height": 1 * (this.m_height / 2) + "px"
	});
};
/** @description  draw the Title of chart if showTitle is set to true. **/
BenchmarkAnalysisChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

/** @description  draw the subTitle of chart if showSubTitle is set to true. **/
BenchmarkAnalysisChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

/** @description  draw the x-axis of chart. **/
BenchmarkAnalysisChart.prototype.drawXAxis = function () {
	this.m_xAxis.drawTickMarks();
	this.m_xAxis.drawVerticalLine();
	this.m_xAxis.markXaxis();
	this.m_xAxis.drawXAxis();
};

/** @description  draw the y-axis of chart. **/
BenchmarkAnalysisChart.prototype.drawYAxis = function () {
	if (IsBoolean(this.m_showmarkerline))
		this.m_yAxis.horizontalMarkerLines();
	if (IsBoolean(this.m_zeromarkerline) && !IsBoolean(this.m_basezero) && IsBoolean(this.m_yAxis.hasNegativeAxisMarker(this.m_yAxisMarkersArray)))
		this.m_yAxis.zeroMarkerLine();
	this.m_yAxis.markYaxis();
	this.m_yAxis.drawYAxis();
};

/** @description  draw the ChartFrame of chart. **/
BenchmarkAnalysisChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

/** @description  method will initialize the calculation parts. **/
BenchmarkAnalysisChart.prototype.initializeCalculation = function () {
	this.calculateMaxMinValue(this.m_seriesData);
	this.calculateMinMax();
	this.setChartDrawingArea();
	this.m_benchMarkCalculation.initGlobalCalculation(this);
	this.setBoxFillColors();
	this.setLegendNames(this.m_legendNames);
	var categoryData = this.updateSeriesData(this.m_categoryData);
	this.m_benchMarkCalculation.init(this, categoryData, this.m_seriesData);
	this.m_xPixelArray = this.m_benchMarkCalculation.getxPixelArray();
	this.m_yPixelArray = this.m_benchMarkCalculation.getyPixelArray();
	this.m_candleWidth = this.m_benchMarkCalculation.getcandleWidth();
	this.m_linePixelArray = this.m_benchMarkCalculation.getLinePixelArray();
	this.m_medianLinePixelArray = this.m_benchMarkCalculation.getMedianLinePixelArray();

	this.m_outlierPixelArray = this.m_benchMarkCalculation.getOutlierPixelArray();
	this.m_outlierShapeArray = this.m_benchMarkCalculation.getOutlierShapeArray();
	this.m_outlierColorsArray = this.m_benchMarkCalculation.getOutlierColorsArray();
	this.m_outlierOpacityArray = this.m_benchMarkCalculation.getOutlierOpacityArray();
	this.m_outlierRadiusArray = this.m_benchMarkCalculation.getOutlierRadiusArray();

	this.m_candleHeightArray = this.m_benchMarkCalculation.getcandleHeightArray();
	this.m_candleColor = this.m_benchMarkCalculation.getCandleColor();
	var lineStrokeColor = convertColorToHex(this.m_strokecolor);
	this.initializeCandles(lineStrokeColor);
};

/** @description  method will calculate the minimum and maximum value of the Chart. **/
BenchmarkAnalysisChart.prototype.calculateMaxMinValue = function (m_seriesdata) {
	this.calculateMax = 0;
	this.calculateMin = 0;
	var data = [];
	for (var i = 0, l = 0,length=m_seriesdata.length ; i < length; i++) {
		for (var j = 0,innerlength=m_seriesdata[i].length ; j < innerlength; j++) {
			for (var k = 0,datalength=m_seriesdata[i][j].length ; k <datalength ; k++) {
				if (k > 4) {
					if (m_seriesdata[i][j][k] && typeof m_seriesdata[i][j][k] == "object") {
						for (var ii = 0; ii < m_seriesdata[i][j][k].length; ii++) {
							if (!isNaN(m_seriesdata[i][j][k][ii]))
								data[l++] = (m_seriesdata[i][j][k][ii] * 1);
						}
					} else {
						if (!isNaN(m_seriesdata[i][j][k]))
							data[l++] = (m_seriesdata[i][j][k] * 1);
					}
				} else {
					if (!isNaN(m_seriesdata[i][j][k]))
						data[l++] = (m_seriesdata[i][j][k] * 1);
				}
			}
		}
	}
	var sortedData = data.sort(numOrdA);
	this.calculateMin = sortedData[0];
	this.calculateMax = sortedData[sortedData.length - 1];
};

/** @Description used calculated  Min/Max value and get required ScaleInfo of The Axis **/
BenchmarkAnalysisChart.prototype.calculateMinMax = function () {
	var calculatedMin = this.calculateMin;
	var calculatedMax = this.calculateMax;

	var niceScaleObj=this.getCalculateNiceScale(calculatedMin,calculatedMax,this.m_basezero,this.m_autoaxissetup,this.m_minimumaxisvalue,this.m_maximumaxisvalue,(this.m_height));
	this.min=niceScaleObj.min;
	this.max=niceScaleObj.max;
	this.yAxisNoOfMarker=niceScaleObj.markerArray.length;
	this.yAxisText=niceScaleObj.step;
	this.m_yAxisMarkersArray=niceScaleObj.markerArray;
};

/** @Description  method used for initialize BenchCandles. **/
BenchmarkAnalysisChart.prototype.initializeCandles = function (lineColor) {
	for (var i = 0,length= this.m_yPixelArray.length ; i <length; i++) {
		this.m_candlesArray[i] = [];
		for (var j = 0,innerlength= this.m_yPixelArray[i].length ; j <innerlength; j++) {
			this.m_candlesArray[i][j] = new BenchCandles();
			this.m_candlesArray[i][j].init(this.m_xPixelArray[i][j], this.m_yPixelArray[i][j], this.m_candleWidth, this.m_candleHeightArray[i][j], this.m_linePixelArray[i][j], this.m_medianLinePixelArray[i][j], this.m_outlierPixelArray[i][j], this.m_outlierShapeArray[i][j], this.m_outlierColorsArray[i][j], this.m_outlierOpacityArray[i][j], this.m_outlierRadiusArray[i][j], this.m_candleColor[i][j], lineColor, this.ctx);
		}
	}
};

/** @Description used to update SeriesData. **/
BenchmarkAnalysisChart.prototype.updateSeriesData = function (array) {
	var arr = [];
	if ((array != undefined && array !== null && array !== "") && array.length != 0){
		for (var i = 0,length= array[0].length ; i <length; i++) {
			arr[i] = [];
			for (var j = 0,innerlength=array.length ; j <innerlength ; j++) {
				arr[i][j] = array[j][i];
			}
		}
	}
	return arr;
};

/** @Description  iterate for all candles and draw which is is Range. **/
BenchmarkAnalysisChart.prototype.drawBenchmarkCandleChart = function () {
	this.undrawableCategories = [];
	for (var i = 0 ,length= this.m_yPixelArray.length ; i <length; i++) {
		for (var j = 0 ,innerlength=this.m_yPixelArray[i].length ; j <innerlength ; j++) {
			//Chart showing the alert message when the chart size is small DAS-1089
			const Q1 = this.m_seriesData[i][0][3];
			const Q3 = this.m_seriesData[i][0][2];
			const median = this.m_seriesData[i][0][4];
			const InRange = Q1 < Q3 && median > Q1 && median < Q3;
			if (!IsBoolean(InRange)) {
				this.undrawableCategories.push(this.m_categoryData[0][i])
			}
			if (!this.isInRange(i) && IsBoolean(InRange)) {
				this.m_candlesArray[i][j].drawCandle();
			}
		}
	}
};
/** @description Setter for DataGrid fields with events and styling **/
BenchmarkAnalysisChart.prototype.getStringARSC = function (str) {
	return (str) ? (str.toString()).replace(/[^a-z0-9\s]/gi, "").replace(/[_\s]/g, "_") : str;
};
BenchmarkAnalysisChart.prototype.setColumnHeads = function(data) {
    this.columnHeads = [];
    this.frozenColumns = [];
	this.m_colHeadersFieldName = Object.keys(data[0]);
	var alignments = Object.values(data[0]);
    for (var i = 0; i <  this.m_colHeadersFieldName.length; i++) {
		if(isNaN(alignments[i])){
			this.m_textAlignArr.push("Left");			
		}else{
			this.m_textAlignArr.push("Right");	
		}
		this.m_sortingColumnsArr.push("true");
	}
    for (var i = 0, length = this.m_colHeadersFieldName.length; i < length; i++) {
        var tempObject = {
			field:this.m_colHeadersFieldName[i],//replace this if specialcharecters need to be checked-this.getStringARSC(this.m_colHeadersFieldName[i])
			title: this.m_colHeadersFieldName[i],
			width: this.m_widthArr[i],
			halign: this.m_textAlignArr[i],
	        align: this.m_textAlignArr[i],
	        sortable: this.m_sortingColumnsArr[i]
		};
		tempObject.nowrap = false;
		tempObject.autoRowHeight = true;
		tempObject.align = (this.m_textAlignArr[i] == "") ? ((this.m_isNumericArr[i] == "Numeric") ? "right" : "left") : this.m_textAlignArr[i];
       this.columnHeads.push(tempObject);
    }
    this.columnHeads.push({
        field: "gridHiddenField",
        title: "gridHiddenField",
        width: "0px",
        hidden: true,
        nowrap: true,
        autoRowHeight: false
    });
};
/** @description setter method to set the width of each column  **/
BenchmarkAnalysisChart.prototype.setColumnWidth = function(data) {
	this.m_colHeadersFieldName = Object.keys(data[0]);
	var definedWidth = 0;
	var count = 0;
	this.m_fitRemainingColumns = false;
	for (var i = 0, len = this.m_colHeadersFieldName.length; i < len; i++) {
	    if (this.m_widthArr[0] != undefined && this.m_widthArr[0] != "") {
	        definedWidth = definedWidth * 1 + (parseInt(this.m_widthArr[0]) * 1);
	        count++;
	    }
	}
	var remainingWidth = this.m_width - definedWidth;
	var otherColumnWidth = remainingWidth / (((this.m_colHeadersFieldName.length - count) !== 0) ? (this.m_colHeadersFieldName.length - count) : 1);
	var widthArray = [];
	    if (IsBoolean(this.m_fitcolumns)) {
	        for (var i = 0, length = this.m_colHeadersFieldName.length; i < length; i++) {
	            if (this.m_widthArr[0] != undefined && this.m_widthArr[0] != "") {
	            	widthArray[i] = this.m_width * (this.m_widthArr[0]/definedWidth);
	            } else {
	                widthArray[i] = parseInt(otherColumnWidth);
	            }
	        }
	        this.m_fitRemainingColumns = true;
	    } else {
	    	var len = this.m_colHeadersFieldName.length;
	    	for (var i = 0; i < len; i++) {
	    	    if (this.m_widthArr[0] != undefined && this.m_widthArr[0] != "") {
	    	    	// Added below if block for BDD-798 Grids column width should be adjusted while Maximize the grid when fit column disabled.
	    	        if ((this.isMaximized) && remainingWidth > 0) {
	    	            widthArray[i] = this.m_width * (this.m_widthArr[0] / definedWidth);
	    	        } else {
	    	            widthArray[i] = parseInt(this.m_widthArr[0] * 1);
	    	        }
	    	    } else {
	    	        widthArray[i] = parseInt(otherColumnWidth);
	    	    }
	    	}
	    	this.m_fitRemainingColumns = ((this.isMaximized) && remainingWidth > 0) ? true : false;
	    }
	this.m_widthArr = widthArray;
};
BenchmarkAnalysisChart.prototype.setGridCss = function() {
	var temp = this;
	var comp = $("#dataGridDiv" + temp.m_objectid);
	comp.find(".panel.datagrid").css({
		"height": temp.m_height * 1 - (((temp.m_height * 1) * 0.65)) + "px",
	});
	comp.find(".datagrid-header").css({ 
		"background": temp.m_headerchromecolor ,
	});
	comp.find(".datagrid-header-row span").css({
		"color":temp.m_headerfontcolor,
		"font-weight": temp.m_headerfontweight,
        "font-size":temp.m_headerfontsize+"px"
	})
	comp.find(".datagrid-body tbody").css({
		"color": temp.m_gridlabelfontcolor,
		"font-size": temp.m_gridlabelfontsize + "px",
		"font-weight": temp.m_gridlabelfontweight
	});
	if (IsBoolean(this.m_textwrap)) {
		comp.find(".datagrid-body").css("overflow-y", "auto");
		comp.find("td div.datagrid-cell").addClass("datagridTextwrapTrue");
		comp.find(".datagrid-header td span").css({
			"white-space": "normal",
			"word-wrap": "break-word"
		});
	}
	setTimeout(function() {
		var headerHeight = comp.find(".datagrid-header").height();//DAS-1059 grid horizontal scroll bar position
		comp.find(".datagrid-body").css({
			"height": (temp.m_height * 1 - (((temp.m_height * 1) * 0.65))) - headerHeight + "px",
		},0);
	});

	temp.setGridColors();
	
}
/** @description setting CSS for selected row **/
BenchmarkAnalysisChart.prototype.setSelectedRowCSS = function(obj) {
	var temp = this;
	if (obj && obj.isMouseOut) {
		var gradientColors = temp.m_bgGradientColors.join(', ');
		var linearGradient = `linear-gradient(to right, ${gradientColors})`;

		if (temp.m_bgGradientColors.length > 1) {
			$("#dataGridDiv" + temp.m_objectid).find(".datagrid-row",).css("background", linearGradient);
		} else {
			$("#dataGridDiv" + temp.m_objectid).find(".datagrid-row",).css("background-color", linearGradient);
		}
	}
};
BenchmarkAnalysisChart.prototype.showBackgroundGradientColor = function(gradientColors,colorAlpha, rotation) {
	if (this.m_canvastype == "svg") {
	    this.showBackgroundGradientColorForSvg(gradientColors, colorAlpha, rotation);
	} else {
	    this.m_bgGradientColors = gradientColors.split(",");
	    for (var i = 0; i < this.m_bgGradientColors.length; i++) {
	        var hexColor = convertColorToHex(this.m_bgGradientColors[i]);
	        this.m_bgGradientColors[i] = hex2rgb(hexColor, colorAlpha);
	    }
	}
};
/**@description setting rows alternative and header color**/
BenchmarkAnalysisChart.prototype.setGridColors = function() {
	var temp = this;
	if (temp.getBgGradients() !== undefined) {
		this.showBackgroundGradientColor(this.getBgGradients(), this.m_bgalpha, this.m_bggradientrotation);
	}
	//temp.setSelectedRowCSS();
	var gradientColors = temp.m_bgGradientColors.join(', ');
	var linearGradient = `linear-gradient(to right, ${gradientColors})`;

	var selectors = [
		".datagrid-row",
		".datagrid-row-alt",
		".datagrid-view2",
		".datagrid-view1",
		".datagrid-view",
	];
	if (temp.m_bgGradientColors.length > 1) {
		selectors.forEach(selector => {
			$("#dataGridDiv" + temp.m_objectid).find(selector).css("background", linearGradient);
		});
	} else {
		selectors.forEach(selector => {
			$("#dataGridDiv" + temp.m_objectid).find(selector).css("background-color", linearGradient);
		});
	}
	$("#dataGridDiv" + temp.m_objectid).find(".datagrid-row").hover(
		function() {
			$(this).css("background", hex2rgb(temp.m_rollovercolor, temp.m_rowhoveropacity));
		},
		function() {
			temp.setSelectedRowCSS({ "isMouseOut": true });
		});
};
/**Desc fromatter precison for grid data */
BenchmarkAnalysisChart.prototype.setGridformatter = function(Tdata) {
	for (var i = 0; i < Tdata.length; i++) {
		var keys = Object.keys(Tdata[i]);
		for (var j = 0; j < keys.length; j++) {
			var key = keys[j];
			var value = Tdata[i][key];
			if (key !== this.m_categoryNames[0] && typeof value === 'number' && !isNaN(value)) {
				Tdata[i][key] = this.m_yAxis.setPrecision(value, this.m_precision);
			}
		}
	}
}
BenchmarkAnalysisChart.prototype.drawBenchmarkGrid = function() {
	var temp = this;
	var alldata = this.m_dataProvider;
	var Tdata = alldata;
	temp.setGridformatter(Tdata);//Precision for benchmark grid
	//DAS-1102 Additional column for DataValidation in Benchmark chart
	if (!IsBoolean(temp.m_designMode) && IsBoolean(temp.m_showdatavalidation)) {
		for (var k = 0; k < Tdata.length; k++) {
			Tdata[k].ValidityStatus = "valid"
		}
		for (var i = 0; i < this.undrawableCategories.length; i++) {
			for (var j = 0; j < Tdata.length; j++) {
				if (this.undrawableCategories[i] == Tdata[j][this.m_categoryNames[0]]) {
					Tdata[j].ValidityStatus = "invalid"
				}
			}
		}
	}
	temp.setColumnWidth(Tdata);
	temp.setColumnHeads(Tdata);
	temp.frozenColumns = [];
	var scrollbarSize = 7;
	temp.m_designModeDrawingFlag = IsBoolean(temp.m_designMode) ? false : true;
	var config = {
		view: temp.getDataGridView((Tdata) ? Tdata.length : 0),
		pageSize: temp.m_scrollviewlimit * 1,
		columns: [temp.columnHeads],
		data: Tdata,
		singleSelect: !IsBoolean(temp.m_allowmultipleselection),
		isEmptyRowsAdded: true,
		scrollOnSelect: false,
		isNumericArrMap: temp.m_isNumericArrMapForSorting,
		collapsible: true,
		rownumbers: false,
		remoteSort: false,
		showHeader: true,
		showFooter: false,
		scrollbarSize: scrollbarSize,
		striped: true,
		nowrap: !IsBoolean(temp.m_textwrap),
		loadMsg: "",
		loading: false,
		loaded: false,
		onAfterRender: function(target) {
			temp.setGridCss();
		}
	};
	config.fitColumns = IsBoolean(this.m_fitRemainingColumns);
	try {
		jqEasyUI("#datagridTable" + this.m_objectid).datagrid(config);
	} catch (e) {
		console.log(e);
	}
};

BenchmarkAnalysisChart.prototype.getScrollBarSize = function(Tabledata) {
	var rowHeight =40;
    var height = (1 * (this.m_height));
    return ((Tabledata.length + 1) * rowHeight) < height ? 0 : this.m_scrollbarsize;
};
BenchmarkAnalysisChart.prototype.getDataGridView = function(TdataLength) {
	return (this.m_scrollviewlimit*1 !== 0 && TdataLength > this.m_scrollviewlimit*1) ? 
				scrollview : 
					$.fn.datagrid.defaults.view;
};
/** @Description  will check a point is in range or not. **/
BenchmarkAnalysisChart.prototype.isInRange = function (i) {
	if (i == 0) {
		if (this.m_yPixelArray[i] > this.getStartY() || this.m_yPixelArray[i] < this.getEndY())
			return true;
		else
			return false;
	} else {
		if (this.m_yPixelArray[i - 1] > this.getStartY() || this.m_yPixelArray[i - 1] < this.getEndY() || this.m_yPixelArray[i] > this.getStartY() || this.m_yPixelArray[i] < this.getEndY())
			return true;
		else
			return false;
	}
};

/** @Description  getter method to get  LegendTableContent . **/
BenchmarkAnalysisChart.prototype.getLegendTableContent = function () {
	//over-ridden
	var legendTable = "";
	if (this.m_chartType == "clustered") {
		for (var i = 0,length= this.getLegendNames().length ; i <length; i++) {
			var grad = this.getLegendGradient(this.m_candleColor[0][i][0], this.m_candleColor[0][i][1]);
			legendTable += "<tr style=\"font-style:" + this.m_legendfontstyle + ";color:" + convertColorToHex(this.m_legendfontcolor) + ";text-decoration:" + this.m_legendtextdecoration + ";font-weight:" + this.m_legendfontweight + ";font-family:" + selectGlobalFont(this.m_legendfontfamily) + "\">"+
								"<td><span style=\"background-image:" + grad + "; width:10px;height:10px;\"></span><span style=\"display:inline;\">" + this.getLegendNames()[i] + "</span></td></tr>";
		}
	} else {
		for (var i = 0,length= this.getLegendNames().length ; i <length; i++) {
			var color = this.m_candleColor[0][0][i];
			legendTable += "<tr style=\"font-style:" + this.m_legendfontstyle + ";color:" + convertColorToHex(this.m_legendfontcolor) + ";text-decoration:" + this.m_legendtextdecoration + ";font-weight:" + this.m_legendfontweight + ";font-family:" + selectGlobalFont(this.m_legendfontfamily) + "\">"+
								"<td><span style=\"background-color:" + color + "; width:10px;height:10px;\"></span><span style=\"display:inline;\">" + this.getLegendNames()[i] + "</span></td></tr>";
		}
	}
	return legendTable;
};

/** @Description  getter Method  for LegendGradient. **/
BenchmarkAnalysisChart.prototype.getLegendGradient = function (lowerColor, upperColor) {
	if(lowerColor !== upperColor){
		if (typeof InstallTrigger !== "undefined")
			var grad = "-moz-linear-gradient(to top, " + lowerColor + ", " + upperColor + ");";
		else if (false || !!document.documentMode)
			var grad = "-ms-linear-gradient(bottom, " + lowerColor + " 0%, " + upperColor + " 100%)";
		else
			var grad = "-webkit-linear-gradient(" + upperColor + ", " + upperColor + ", " + lowerColor + ", " + lowerColor + ");";
	}else{
		var grad = lowerColor;
	}
	return grad;
};

/** @Description  getter Method  for XPositionforToolTip . **/
BenchmarkAnalysisChart.prototype.getXPositionforToolTip = function () {
	var xPosArray = [];
	for (var n = 0,length=this.m_xPixelArray.length ; n <length ; n++) {
		xPosArray.push(this.m_xPixelArray[0][n]);
	}
	return xPosArray;
};

/** @Description  getter Method  for get data For Tooltip. **/
BenchmarkAnalysisChart.prototype.getToolTipData = function (mouseX, mouseY) {
	var toolTipData;
	if ((!IsBoolean(this.m_isEmptySeries)) && (!IsBoolean(this.isEmptyCategory)) && (IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None"))) {
		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			for (var i = 0,length= this.m_xPixelArray.length ; i <length; i++) {
				for (var ii = 0,innerlength= this.m_xPixelArray[i].length ; ii <innerlength; ii++) {
					if (mouseX <= (this.m_xPixelArray[i][ii] * 1 + this.m_benchMarkCalculation.getcandleWidth() * 1) && (mouseX >= this.m_xPixelArray[i][ii] * 1)) {
						toolTipData = {};
						toolTipData.cat = "";
						toolTipData.color = "";
						toolTipData["data"] = new Array();
						toolTipData.cat = this.getCategoryData()[0][i];
						toolTipData.data[0] = [];
						if (this.m_chartType == "clustered") {
							toolTipData.color = this.getLegendGradient(this.m_candleColor[i][ii][0], this.m_candleColor[i][ii][1]);
							/** SubCategory Row added in Tooltip **/
							toolTipData.data[0][0] = "SubCategory";
							toolTipData.data[0][1] = this.getSubCategoryDisplayNames()[0];
							toolTipData.data[0][2] = this.getSubCategoryData()[0][ii];

							for (var j = 0; j < this.m_fieldtypes.length; j++) {
								if (j < 5) {
									toolTipData.data[j + 1] = [];
									toolTipData.data[j + 1][0] = this.m_fieldtypes[j];
									/** Field Types **/
									toolTipData.data[j + 1][1] = this.m_seriesDisplayNames[j];
									/** Field Display Name **/
									toolTipData.data[j + 1][2] = (this.m_seriesDataForToolTip[i][ii][j]) ? this.getFormatterForToolTip(this.m_seriesDataForToolTip[i][ii][j]) : ""; /**Removed "*1", Converted String to NaN in tool tip */
									/** Field Value **/
								} else {
									var outlierYPix = this.m_benchMarkCalculation.getOutlierPixelArray()[i][ii];
									for (var iii = 0; iii < outlierYPix.length; iii++) {
										for (var iiii = 0; iiii < outlierYPix[iii].length; iiii++) {
											if (mouseY <= (outlierYPix[iii][iiii] * 1 + 5) && mouseY >= (outlierYPix[iii][iiii] - 5)) {
												toolTipData.data[j + 1] = [];
												toolTipData.data[j + 1][0] = this.m_fieldtypes[j * 1];
												/** Field Name **/
												toolTipData.data[j + 1][1] = this.m_seriesDisplayNames[j * 1 + iii];
												/** Field Display Name **/
												toolTipData.data[j + 1][2] = (this.m_seriesDataForToolTip[i][ii][j * 1 + iii] && this.m_seriesDataForToolTip[i][ii][j * 1 + iii][iiii]) ? this.getFormatterForToolTip(this.m_seriesDataForToolTip[i][ii][j * 1 + iii][iiii]) : "";
												/** Field Value **/
												break;
											}
										}
									}
								}
							}
						} else {
							toolTipData.color = this.getLegendGradient(this.m_candleColor[i][ii][0], this.m_candleColor[i][ii][1]);
							for (var j = 0; j < this.m_fieldtypes.length; j++) {
								if (j < 5) {
									toolTipData.data[j] = [];
									toolTipData.data[j][0] =  this.m_seriesDisplayNames[j];
									toolTipData.data[j][1] = (this.m_seriesDataForToolTip[i][ii][j]) ? this.getFormatterForToolTip(this.m_seriesDataForToolTip[i][ii][j] * 1) : "";
								} else {
									var outlierYPix = this.m_benchMarkCalculation.getOutlierPixelArray()[i][ii];
									for (var iii = 0; iii < outlierYPix.length; iii++) {
										for (var iiii = 0; iiii < outlierYPix[iii].length; iiii++) {
											if (mouseY <= (outlierYPix[iii][iiii] * 1 + 5) && mouseY >= (outlierYPix[iii][iiii] - 5)) {
												toolTipData.data[5] = [];
												toolTipData.data[5][0] = this.m_fieldtypes[j * 1];
												toolTipData.data[5][1] = this.m_seriesDisplayNames[j * 1 + iii];
												toolTipData.data[5][2] = (this.m_seriesDataForToolTip[i][ii][j * 1 + iii] && this.m_seriesDataForToolTip[i][ii][j * 1 + iii][iiii]) ? this.getFormatterForToolTip(this.m_seriesDataForToolTip[i][ii][j * 1 + iii][iiii]) : "";
												break;
											}
										}
									}
								}
							}
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

/** @Description  method for draw Tooltip for BenchmarkAnalysisChart. **/
BenchmarkAnalysisChart.prototype.drawTooltip = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && !this.m_designMode) {
		var toolTipData = this.getToolTipData(mouseX, mouseY);
		if(this.m_hovercallback && this.m_hovercallback != ""){
			this.drawCallBackContent(mouseX,mouseY,toolTipData);
		}
		else{
			this.drawTooltipContent(toolTipData);
		}
	}
};

/** @Description  method for draw TooltipContent in Table. **/
BenchmarkAnalysisChart.prototype.drawTooltipContent=function(toolTipData){
	this.m_tooltip.draw(toolTipData,"box_plot_chart");//added box_plot_chart to draw using box_plot_chart function for tooltip
};

/** @Description Getter method for get DrillDataPoints. **/
BenchmarkAnalysisChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
	if ((!IsBoolean(this.m_isEmptySeries))) {
		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			for (var i = 0,length=this.m_xPixelArray.length ; i < length; i++) {
				for (var ii = 0,innerlength=this.m_xPixelArray[i].length ; ii <innerlength ; ii++) {
					if (mouseX <= (this.m_xPixelArray[i][ii] + this.m_benchMarkCalculation.getcandleWidth()) && (mouseX >= this.m_xPixelArray[i][ii])) {
						var map = {};
						for (var iii = 0; iii < this.m_fieldtypes.length - 1; iii++) {
							map[this.m_fieldtypes[iii]] = this.m_seriesData[i][ii][iii];
						}
						map[this.getCategoryNames()[0]] = this.getCategoryData()[0][i];
						if (this.m_chartType == "clustered") {
							map[this.getSubCategoryNames()[0]] = this.getSubCategoryData()[0][i];
						}
						var fieldNameValueMap = map;
						var drillColor = "";
						return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
					}
				}
			}
		}
	}
};

/** @Description Constructor method for BenchMarkCalculation. **/
function BenchMarkCalculation() {
	this.m_xAxisPixelArray = [];
	this.m_yAxisPixelArray = [];
	this.max = 0;
	this.m_candleGap;
	this.m_numberOfMarkers = 6;
	this.m_percentileValue;
	this.m_yAxisText;
	this.m_xpixelArray = [];
	this.m_ypixelArray = [];
	this.m_candleHeightArray = [];
	this.m_yAxisMarkersArray = [];
	this.m_linepixelArray = [];
	//this.m_chart;
	this.m_startX;
	this.m_startY;
	this.m_endX;
	this.m_endY;
	this.m_chartYMargin;
	this.m_chartEndXMargin;
	this.m_chartTitleMargin = 0;
	this.m_chartSubTitleMargin = 0;
	this.data = "";
	this.m_util = new Util();
	this.noOfRows = 1; //used for set x-axis text into two rows in non tilted case.
};

/** @Description Method To Initialize GlobalCalculation. **/
BenchMarkCalculation.prototype.initGlobalCalculation = function (m_chart) {
	this.m_chart = m_chart;
	this.m_x = this.m_chart.m_x;
	this.m_y = this.m_chart.m_y;
	this.m_width = this.m_chart.m_width;
	this.m_height = this.m_chart.m_height/2;
	//this.m_seriesNames = this.m_chart.m_legendNames;
	this.m_seriesData = this.m_chart.m_seriesData;
	this.m_categoryData = this.m_chart.m_categoryData;
	this.m_chartYMargin = 5;
	this.m_chartEndXMargin = 35;
	this.m_verticalLegendMargin = 60;
	this.m_chartTitleMargin = this.m_chart.m_title.getFontSize();
	this.m_chartSubTitleMargin = this.m_chart.m_subTitle.getFontSize();
};

/** @Description Method To Initialize BenchMarkCalculation with initialization of some variable. **/
BenchMarkCalculation.prototype.init = function (m_chart, m_categoryData, m_seriesData) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	//	var seriesData=convertArrayType(m_seriesData);
	var seriesData = (m_seriesData);
	this.m_xAxisData = m_categoryData;
	this.data = this.setDataForCandle(seriesData);

	this.m_yAxisData = this.data.candleHighdata;

	this.m_startX = this.m_chart.getStartX();
	this.m_startY = this.m_chart.getStartY();
	this.m_endX = this.m_chart.getEndX();
	this.m_endY = this.m_chart.getEndY();
	this.m_chartType = this.m_chart.getChartType();

	this.setDrawHeight();
	this.setDrawWidth();
	this.m_candleGap = 10;
	this.calculateCandleWidth();

	// this.calculateMinMax() and this.calculateMaxMinValue(seriesData); these methods move to CandleStickChart class because we need min/max value for set startX.
	this.max=this.m_chart.max;
	this.min=this.m_chart.min;
	this.setRatio();

	this.setxPixelArray();
	this.setyPixelArray();
	this.setcandleHeightArray(seriesData, this.data);
	this.setlinePixelArray(this.m_lineData, this.data);
	this.setMedianLinePixelArray();
	this.setOutlierPixelArray();
};

/** @Description Setter Method To set Data For Candle. **/
BenchMarkCalculation.prototype.setDataForCandle = function (m_seriesData) {
	var arrSeries = [];
	var arrseriesMin = [];
	var candlecolor = [];
	var arrSeriesCandleMax = [];
	var arrSeriesCandleMin = [];
	var arrSeriesCandleHeight = [];
	var arrSeriesCandleMedian = [];
	var arrSeriesCandleOutliers = [];
	var arrSeriesCandleQ3Value = [];
	var arrSeriesCandleQ1Value = [];

	var arrOutlierShapes = [];
	var arrOutlierColors = [];
	var arrOutlierOpacity = [];
	var arrOutlierRadius = [];

	var declinefillcolor = convertColorToHex(this.m_chart.m_declinefillcolor);
	var fillcolor = convertColorToHex(this.m_chart.m_fillcolor);
	for (var i = 0,length=m_seriesData.length ; i <length ; i++) {
		arrSeries[i] = [];
		arrseriesMin[i] = [];
		candlecolor[i] = [];
		arrSeriesCandleMax[i] = [];
		arrSeriesCandleMin[i] = [];
		arrSeriesCandleHeight[i] = [];
		arrSeriesCandleMedian[i] = [];
		arrSeriesCandleOutliers[i] = [];
		arrSeriesCandleQ3Value[i] = [];
		arrSeriesCandleQ1Value[i] = [];

		arrOutlierShapes[i] = [];
		arrOutlierColors[i] = [];
		arrOutlierOpacity[i] = [];
		arrOutlierRadius[i] = [];

		for (var j = 0,innerlength=m_seriesData[i].length ; j < innerlength; j++) {
			var max = 0;
			var min = 0;
			arrSeriesCandleOutliers[i][j] = [];
			arrOutlierShapes[i][j] = [];
			arrOutlierColors[i][j] = [];
			arrOutlierOpacity[i][j] = [];
			arrOutlierRadius[i][j] = [];
			for (var k = 0, outlierCount = 0; k < m_seriesData[i][j].length; k++) {
				if (k == 0) {
					var max = m_seriesData[i][j][k];
					var min = m_seriesData[i][j][k];
				}
				if ((m_seriesData[i][j][k]) * 1 >= max) {
					max = m_seriesData[i][j][k] * 1;
				}
				if ((m_seriesData[i][j][k]) * 1 <= min) {
					min = m_seriesData[i][j][k] * 1;
				}
				if (k < 4) {
					var candleMax = max;
					var candleMin = min;
				}
				if (k > 4) {
					arrSeriesCandleOutliers[i][j][outlierCount] = [];
					arrOutlierShapes[i][j][outlierCount] = [];
					arrOutlierColors[i][j][outlierCount] = [];
					arrOutlierOpacity[i][j][outlierCount] = [];
					arrOutlierRadius[i][j][outlierCount] = [];
					if (m_seriesData[i][j][k] && typeof m_seriesData[i][j][k] == "object") {
						for (var o = 0; o < m_seriesData[i][j][k].length; o++) {
							arrSeriesCandleOutliers[i][j][outlierCount].push(m_seriesData[i][j][k][o]);
							arrOutlierShapes[i][j][outlierCount].push((m_seriesData[i][j][k][o] * 1) ? this.m_chart.m_outlierShapes[k] : "NA");
							arrOutlierColors[i][j][outlierCount].push(this.m_chart.m_outlierColors[k]);
							arrOutlierOpacity[i][j][outlierCount].push(this.m_chart.m_outlierOpacity[k]);
							arrOutlierRadius[i][j][outlierCount].push(this.m_chart.m_outlierRadius[k]);
						}
					} else {
						arrSeriesCandleOutliers[i][j][outlierCount].push(m_seriesData[i][j][k] * 1);
						arrOutlierShapes[i][j][outlierCount].push((m_seriesData[i][j][k] * 1) ? this.m_chart.m_outlierShapes[k] : "NA");
						arrOutlierColors[i][j][outlierCount].push(this.m_chart.m_outlierColors[k]);
						arrOutlierOpacity[i][j][outlierCount].push(this.m_chart.m_outlierOpacity[k]);
						arrOutlierRadius[i][j][outlierCount].push(this.m_chart.m_outlierRadius[k]);
					}
					outlierCount++;
				}
			}
			arrSeries[i][j] = (max);
			arrseriesMin[i][j] = (min);
			candlecolor[i][j] = ([this.getBoxFillColorMap(j).lower, this.getBoxFillColorMap(j).upper]);
			arrSeriesCandleMax[i][j] = candleMax;
			arrSeriesCandleMin[i][j] = candleMin;
			arrSeriesCandleHeight[i][j] = m_seriesData[i][j][2] - m_seriesData[i][j][3];
			arrSeriesCandleMedian[i][j] = m_seriesData[i][j][4];
			arrSeriesCandleQ3Value[i][j] = m_seriesData[i][j][2];
			arrSeriesCandleQ1Value[i][j] = m_seriesData[i][j][3];
		}
	}

	this.m_lineData = this.setDataForCandleLine(m_seriesData);
	this.m_candleColor = candlecolor;
	return {
		candleHighdata : arrSeries,
		candleLowdata : arrseriesMin,
		candleMaxCandledata : arrSeriesCandleMax,
		candleMinCandledata : arrSeriesCandleMin,
		candleHeightCandledata : arrSeriesCandleHeight,
		candleMedianCandledata : arrSeriesCandleMedian,
		candleOutlierCandledata : arrSeriesCandleOutliers,
		candleQ3Candledata : arrSeriesCandleQ3Value,
		candleQ1Candledata : arrSeriesCandleQ1Value,
		candleOutlierShapes : arrOutlierShapes,
		candleOutlierColors : arrOutlierColors,
		candleOutlierOpacity : arrOutlierOpacity,
		candleOutlierRadius : arrOutlierRadius
	};
};

/** @Description Getter Method of BoxFillColorMap. **/
BenchMarkCalculation.prototype.getBoxFillColorMap = function (index) {
	var opacity = 0.8;
	var map = {
		"lower" : hex2rgb("#F89406", opacity),
		"upper" : hex2rgb("#6C7A89", opacity)
	};
	if (this.m_chart.getBoxFillColors()[index]) {
		map.lower = hex2rgb(this.m_chart.getBoxFillColors()[index][0], this.m_chart.getBoxFillColors()[index][2]);
		map.upper = hex2rgb(this.m_chart.getBoxFillColors()[index][1], this.m_chart.getBoxFillColors()[index][2]);
	}
	return map;
};

/** @Description Setter Method to set Data for CandleLine. **/
BenchMarkCalculation.prototype.setDataForCandleLine = function (m_seriesData) {
	//h l c o
	var linearr = [];
	for (var i = 0,length= m_seriesData.length ; i <length; i++) {
		linearr[i] = [];
		for (var j = 0,innerlength= m_seriesData[i].length ; j <innerlength; j++) {
			linearr[i].push([m_seriesData[i][j][0], m_seriesData[i][j][1]]);
		}
	}
	return linearr;
};

/** @Description Method will return the minimum value of Chart. **/
BenchMarkCalculation.prototype.minValue = function () {
	return this.m_chart.min;
};

/** @Description Method will return the maximum value of Chart. **/
BenchMarkCalculation.prototype.getMaxValue = function () {
	return this.m_chart.max;
};

/** @Description Getter Method to get the Ratio. **/
BenchMarkCalculation.prototype.getRatio = function () {
	return this.ratio;
};

/** @Description Setter Method for set the Ratio. **/
BenchMarkCalculation.prototype.setRatio = function () {
	var diff = this.getMaxValue() - this.minValue();
	if (diff > 0)
		this.ratio = this.getDrawHeight() / (diff);
	else
		this.ratio = 1;
};

/** @Description Getter Method to get DrawHeight of the Chart . **/
BenchMarkCalculation.prototype.getDrawHeight = function () {
	return this.drawHeight;
};

/** @Description Setter Method for set DrawHeight of the Chart . **/
BenchMarkCalculation.prototype.setDrawHeight = function () {
	this.drawHeight = (this.m_startY - this.m_endY);
};

/** @Description Getter Method to get DrawWidth  of the Chart . **/
BenchMarkCalculation.prototype.getDrawWidth = function () {
	return this.drawWidth;
};

/** @Description Setter Method for set DrawWidth of the Chart . **/
BenchMarkCalculation.prototype.setDrawWidth = function () {
	this.drawWidth = 1 * (this.m_endX) - 1 * (this.m_startX);
};

/** @Description Method for calculate DrawWidth the CandleWidth . **/
BenchMarkCalculation.prototype.calculateCandleWidth = function () {
	var numberOfCandle = this.m_xAxisData.length;
	var totalGap = (1 * (numberOfCandle) + 1) * this.m_candleGap;
	var availableDrawWidth = (this.getDrawWidth() * 1 - totalGap * 1);
	var candleWidth = (availableDrawWidth / numberOfCandle);
	if (candleWidth > 100) {
		this.setCandleWidth(100);
		this.setCandleGap(100);
	} else if (candleWidth < 9) {
		this.setCandleWidth(9);
		this.setCandleGap(9);
	} else {
		this.setCandleWidth(candleWidth);
	}
};

/** @Description Getter Method to get xPixelArray  of the Chart . **/
BenchMarkCalculation.prototype.getxPixelArray = function () {
	return this.m_xPixelArray;
};

/** @Description Setter Method for set xPixelArray  of the Chart . **/
BenchMarkCalculation.prototype.setxPixelArray = function () {
	var m_xAxisPixelArray = [];
	for (var i = 0,length=this.m_yAxisData.length ; i <length ; i++) {
		m_xAxisPixelArray[i] = [];
		for (var j = 0,innerlength= this.m_yAxisData[i].length ; j < innerlength; j++) {
			m_xAxisPixelArray[i][j] = (this.m_startX) * 1 + (this.getcandleWidth() * 1) * i * this.m_chart.m_subCateogryData.length + this.getcandleWidth() * j + (this.getcandleGap() / 2) + (this.getcandleGap() * 1) * (i);
		}
	}
	this.m_xPixelArray = m_xAxisPixelArray;
};

/** @Description Getter Method for get yPixelArray . **/
BenchMarkCalculation.prototype.getyPixelArray = function () {
	return this.m_ypixelArray;
};

/** @Description Setter Method for set xPixelArray . **/
BenchMarkCalculation.prototype.setyPixelArray = function () {
	var yparray = [];
	for (var i = 0,length=this.data.candleQ3Candledata.length ; i <length ; i++) {
		yparray[i] = [];
		for (var j = 0,innerlength=this.data.candleQ3Candledata[i].length ; j <innerlength; j++) {
			if (this.data.candleQ3Candledata[i][j] >= this.max)
				this.data.candleQ3Candledata[i][j] = this.max;
			var ratio = this.getRatio();
			if (IsBoolean(this.m_chart.isAxisSetup()) && (!IsBoolean(this.m_chart.isBaseZero()))) {
				yparray[i][j] = ((this.m_startY) - ((ratio * (this.data.candleQ3Candledata[i][j]))) + (ratio) * this.minValue());
			} else {
				if (IsBoolean(this.m_chart.isBaseZero())) {
					yparray[i][j] = ((this.m_startY) - (ratio * (this.data.candleQ3Candledata[i][j])));
				} else {
					yparray[i][j] = ((this.m_startY) - (ratio * (this.data.candleQ3Candledata[i][j])) + (ratio) * this.minValue());
				}
			}
		}
	}
	this.m_ypixelArray = yparray;
};

/** @Description Getter Method to get candleHeightArray . **/
BenchMarkCalculation.prototype.getcandleHeightArray = function () {
	return this.m_candleHeightArray;
};

/** @Description Setter Method for set candleHeightArray . **/
BenchMarkCalculation.prototype.setcandleHeightArray = function (seriesdata, data) {
	var candleHeightArray = [];
	for (var i = 0,length= data.candleHeightCandledata.length ; i <length; i++) {
		candleHeightArray[i] = [];
		for (var j = 0,innerlength= data.candleHeightCandledata[i].length ; j <innerlength ; j++) {
			var ratio = this.getRatio();
			var candleheight = data.candleHeightCandledata[i][j];
			if (candleheight != 0)
				candleHeightArray[i][j] = Math.abs(candleheight * ratio);
			else
				candleHeightArray[i][j] = ((this.getMaxValue() * 1) / 100) * ratio;
		}
	}
	this.m_candleHeightArray = candleHeightArray;
};

/** @Description Getter Method to get LinePixelArray . **/
BenchMarkCalculation.prototype.getLinePixelArray = function () {
	return this.m_linePixelArray;
};

/** @Description Getter Method to get CandleColor . **/
BenchMarkCalculation.prototype.getCandleColor = function () {
	return this.m_candleColor;
};

/** @Description Setter Method for set linePixelArray . **/
BenchMarkCalculation.prototype.setlinePixelArray = function (arrline, data) {
	var linePixelArray = [];
	var updatelinedata = this.updateCandleLinedata(arrline, data.candleQ3Candledata, data.candleQ1Candledata);
	arrline = updatelinedata;
	for (var i = 0,length=arrline.length ; i <length ; i++) {
		linePixelArray[i] = [];
		for (var j = 0,innerlength= arrline[i].length ; j <innerlength; j++) {
			linePixelArray[i][j] = [];
			for (var k = 0,datalength= arrline[i][j].length ; k <datalength; k++) {
				var ratio = this.getRatio();
				if (IsBoolean(this.m_chart.isAxisSetup()) && (!IsBoolean(this.m_chart.isBaseZero()))) {
					linePixelArray[i][j][k] = (this.m_startY) - (arrline[i][j][k] * ratio) + (ratio) * this.minValue();
				} else {
					var newline = arrline[i][j][k];
					if (j == 1) {
						if ((arrline[i][j][1] >= this.max * 1))
							newline = this.max * 1;
					} else if (j == 3) {
						if ((arrline[i][j][3] <= this.min * 1))
							newline = this.min * 1;
					}
					if (IsBoolean(this.m_chart.isBaseZero())) {
						if (j == 1 || j == 3)
							linePixelArray[i][j][k] = (this.m_startY) - (newline * ratio);
						else
							linePixelArray[i][j][k] = (this.m_startY) - (arrline[i][j][k] * ratio);
					} else {
						if (j == 1 || j == 3)
							linePixelArray[i][j][k] = (this.m_startY) - (newline * ratio) + (ratio) * this.minValue();
						else
							linePixelArray[i][j][k] = (this.m_startY) - (arrline[i][j][k] * ratio) + (ratio) * this.minValue();
					}
				}
			}
		}
	}
	this.m_linePixelArray = linePixelArray;
};

/** @Description Getter Method of MedianLinePixelArray . **/
BenchMarkCalculation.prototype.getMedianLinePixelArray = function () {
	return this.m_medianLinePixelArray;
};

/** @Description Setter Method for MedianLinePixelArray . **/
BenchMarkCalculation.prototype.setMedianLinePixelArray = function (arrline, data) {
	var yparray = [];
	for (var i = 0,length=this.data.candleMedianCandledata.length ; i <length ; i++) {
		yparray[i] = [];
		for (var j = 0,innerlength=this.data.candleMedianCandledata[i].length ; j < innerlength; j++) {
			var ratio = this.getRatio();
			if (IsBoolean(this.m_chart.isAxisSetup()) && (!IsBoolean(this.m_chart.isBaseZero()))) {
				yparray[i][j] = ((this.m_startY) - ((ratio * (this.data.candleMedianCandledata[i][j]))) + (ratio) * this.minValue());
			} else {
				if (IsBoolean(this.m_chart.isBaseZero())) {
					yparray[i][j] = ((this.m_startY) - (ratio * (this.data.candleMedianCandledata[i][j])));
				} else {
					yparray[i][j] = ((this.m_startY) - (ratio * (this.data.candleMedianCandledata[i][j])) + (ratio) * this.minValue());
				}
			}
		}
	}
	this.m_medianLinePixelArray = yparray;
};

/** @Description Getter Method of OutlierPixelArray . **/
BenchMarkCalculation.prototype.getOutlierPixelArray = function () {
	return this.m_outlierPixelArray;
};

/** @Description Setter Method for OutlierPixelArray . **/
BenchMarkCalculation.prototype.setOutlierPixelArray = function () {
	var yparray = [];
	for (var i = 0,length=this.data.candleOutlierCandledata.length ; i <length ; i++) {
		yparray[i] = [];
		for (var j = 0,innerlength= this.data.candleOutlierCandledata[i].length ; j <innerlength ; j++) {
			yparray[i][j] = [];
			for (var k = 0,datalength= this.data.candleOutlierCandledata[i][j].length ; k <datalength; k++) {
				yparray[i][j][k] = [];
				for (var l = 0; l < this.data.candleOutlierCandledata[i][j][k].length; l++) {
					var ratio = this.getRatio();
					if (IsBoolean(this.m_chart.isAxisSetup()) && (!IsBoolean(this.m_chart.isBaseZero()))) {
						yparray[i][j][k].push(((this.m_startY) - ((ratio * (this.data.candleOutlierCandledata[i][j][k][l]))) + (ratio) * this.minValue()));
					} else {
						if (IsBoolean(this.m_chart.isBaseZero())) {
							yparray[i][j][k].push(((this.m_startY) - (ratio * (this.data.candleOutlierCandledata[i][j][k][l]))));
						} else {
							yparray[i][j][k].push(((this.m_startY) - (ratio * (this.data.candleOutlierCandledata[i][j][k][l])) + (ratio) * this.minValue()));
						}
					}
				}
			}
		}
	}
	this.m_outlierPixelArray = yparray;
};

/** @Description Getter Method of OutlierShapeArray . **/
BenchMarkCalculation.prototype.getOutlierShapeArray = function () {
	return this.data.candleOutlierShapes;
};

/** @Description Getter Method of OutlierColorsArray . **/
BenchMarkCalculation.prototype.getOutlierColorsArray = function () {
	return this.data.candleOutlierColors;
};

/** @Description Getter Method of OutlierOpacityArray . **/
BenchMarkCalculation.prototype.getOutlierOpacityArray = function () {
	return this.data.candleOutlierOpacity;
};

/** @Description Getter Method of OutlierRadiusArray . **/
BenchMarkCalculation.prototype.getOutlierRadiusArray = function () {
	return this.data.candleOutlierRadius;
};

/** @Description Method will return the updated CandleLinedata. **/
BenchMarkCalculation.prototype.updateCandleLinedata = function (highlowvalue, topvalue, downvalue) {
	var high = highlowvalue;
	var close = topvalue;
	var open = downvalue;
	var arr = [];
	for (var i = 0,length=close.length; i <length ; i++) {
		arr[i] = [];
		for (var j = 0,innerlength=close[i].length ; j <innerlength ; j++) {
			arr[i][j] = [];
			var candlehigh = close[i][j];
			var candlelow = open[i][j];
			if (candlehigh >= this.max)
				candlehigh = this.max;
			if (candlelow <= this.min)
				candlelow = this.min;
			else if (candlelow > high[i][j][1] * 1 && candlelow > this.max)
				candlelow = high[i][j][1] * 1;

			var highlinepoint = high[i][j][0] * 1;
			var lowlinepoint = high[i][j][1] * 1;

			if (highlinepoint > this.max)
				highlinepoint = this.max;
			else if (highlinepoint < this.min)
				highlinepoint = this.min;

			if (lowlinepoint > this.max)
				lowlinepoint = this.max;
			else if (lowlinepoint < this.min)
				lowlinepoint = this.min;

			arr[i][j][0] = candlehigh;
			arr[i][j][1] = highlinepoint;
			arr[i][j][2] = candlelow;
			arr[i][j][3] = lowlinepoint;
		}
	}
	return arr;
};

/** @Description Getter Method of YAxisMarkersArray . **/
BenchMarkCalculation.prototype.getYAxisMarkersArray = function () {
	return this.m_chart.m_yAxisMarkersArray;
};

/** @Description Getter Method of YAxisText . **/
BenchMarkCalculation.prototype.getYAxisText = function () {
	return this.m_chart.m_yAxisText;
};

/** @Description Getter Method of candleWidth . **/
BenchMarkCalculation.prototype.getcandleWidth = function () {
	return this.candleWidth;
};

/** @Description Setter Method for CandleWidth . **/
BenchMarkCalculation.prototype.setCandleWidth = function (candlewidth) {
	this.candleWidth = candlewidth;
	if (this.m_chart.m_subCateogryData.length > 1)
		this.candleWidth /= this.m_chart.m_subCateogryData.length;
};

/** @Description Getter Method of candleGap . **/
BenchMarkCalculation.prototype.getcandleGap = function () {
	return this.m_candleGap;
};

/** @Description Setter Method for CandleGap . **/
BenchMarkCalculation.prototype.setCandleGap = function (candleWidth) {
	var totalCandlewidth = candleWidth * this.m_xAxisData.length;
	var totalGap = this.getDrawWidth() - totalCandlewidth;
	this.m_candleGap = totalGap / (this.m_xAxisData.length);
};

/** @Description Constructor Method for BenchCandles . **/
function BenchCandles() {
	this.m_xPixel = [];
	this.m_yPixelArray = [];
	this.m_candleHeightArray = [];
	this.m_candleWidth = [];
	this.m_linePixelArray = [];
	this.m_candleColor = "";
	this.m_strokeColor = "";
	this.medianLinePixelArray = "";
	this.ctx = "";
	this.m_outlierfillcolor = "#cccccc";
};

/** @Description initialize the BenchCandles and assign argument value to variables. **/
BenchCandles.prototype.init = function (xPixel, yPixelArray, candleWidth, candleHeightArray, linePixelArray, medianLinePixelArray, outlierPixelArray, outlierShapeArray, outlierColorsArray, outlierOpacityArray, outlierRadiusArray, candleColor, strokecolor, ctx) {
	this.ctx = ctx;
	this.m_xPixel = xPixel;
	this.m_yPixelArray = yPixelArray;
	this.m_candleWidth = candleWidth;
	this.m_candleHeightArray = candleHeightArray;
	this.m_linePixelArray = linePixelArray;
	this.m_medianLinePixelArray = medianLinePixelArray;
	this.m_outlierPixelArray = outlierPixelArray;
	this.m_plotShapeArray = outlierShapeArray;
	this.m_outlierColorsArray = outlierColorsArray;
	this.m_outlierOpacityArray = outlierOpacityArray;
	this.m_plotRadiusArray = outlierRadiusArray;
	this.m_candleColor = candleColor;
	this.m_strokeColor = strokecolor;
};

/** @Description method for draw the BenchCandles. **/
BenchCandles.prototype.BenchCandles = function () {
	for (var i = 0,length=this.m_yPixelArray.length ; i <length ; i++) {
		this.drawCandle(this.m_xPixel[i] * 1, this.m_yPixelArray[i] * 1, this.m_candleWidth * 1, this.m_candleHeightArray[i] * 1);
	}
};

/** @Description method for draw the Candle on Canvas. **/
BenchCandles.prototype.drawCandle = function () {
	this.drawline();
	this.drawOutliers();
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.fillStyle = this.m_candleColor[1];
	this.ctx.rect(this.m_xPixel, this.m_yPixelArray, this.m_candleWidth, this.m_candleHeightArray);
	this.ctx.fill();
	this.ctx.strokeStyle = this.m_strokeColor; //"#FF8D70";
	this.ctx.stroke();
	this.ctx.closePath();
	this.ctx.beginPath();
	this.ctx.fillStyle = this.m_candleColor[0];
	this.ctx.rect(this.m_xPixel, this.m_medianLinePixelArray, this.m_candleWidth, this.m_candleHeightArray - (this.m_medianLinePixelArray - this.m_yPixelArray));
	this.ctx.fill();
	this.ctx.strokeStyle = this.m_strokeColor; //"#FF8D70";
	this.ctx.stroke();
	this.ctx.restore();
	this.ctx.closePath();
};

/** @Description method for draw the Line on Canvas. **/
BenchCandles.prototype.drawline = function () {
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.moveTo(this.m_xPixel + (this.m_candleWidth * 1 / 2), this.m_linePixelArray[0] * 1);
	this.ctx.lineTo(this.m_xPixel + (this.m_candleWidth * 1 / 2), this.m_linePixelArray[1] * 1);
	this.ctx.lineWidth = "2.2";
	this.ctx.strokeStyle = this.m_strokeColor;
	this.ctx.stroke();
	this.ctx.restore();
	this.ctx.closePath();

	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.moveTo(this.m_xPixel + (this.m_candleWidth * 1 / 2), this.m_linePixelArray[2] * 1);
	this.ctx.lineTo(this.m_xPixel + (this.m_candleWidth * 1 / 2), this.m_linePixelArray[3] * 1);
	this.ctx.lineWidth = "2.2";
	this.ctx.strokeStyle = this.m_strokeColor;
	this.ctx.stroke();
	this.ctx.restore();
	this.ctx.closePath();
};

/** @Description method for draw the Outerlines on Canvas. **/
BenchCandles.prototype.drawOutliers = function () {
	this.ctx.save();
	for (var i = 0,length= this.m_outlierPixelArray.length ; i <length; i++) {
		for (var j = 0,innerlength=this.m_outlierPixelArray[i].length; j < innerlength; j++) {
			this.ctx.beginPath();
			var x2 = this.m_xPixel * 1 + (this.m_candleWidth * 1 / 2);
			var y2 = this.m_outlierPixelArray[i][j];

			switch (this.m_plotShapeArray[i][j]) {
			case "cube":
				this.ctx.rect(x2 * 1 - this.m_plotRadiusArray[i][j] * 1, y2 - this.m_plotRadiusArray[i][j] * 1, this.m_plotRadiusArray[i][j] * 1 * 2, this.m_plotRadiusArray[i][j] * 1 * 2);
				break;
			case "cross":
				this.ctx.moveTo(x2 * 1 - this.m_plotRadiusArray[i][j] * 1, y2 * 1 - this.m_plotRadiusArray[i][j] * 1 * 1);
				this.ctx.lineTo(x2 * 1 + this.m_plotRadiusArray[i][j] * 1, y2 * 1 + this.m_plotRadiusArray[i][j] * 1);
				this.ctx.moveTo(x2 * 1 + this.m_plotRadiusArray[i][j] * 1, y2 * 1 - this.m_plotRadiusArray[i][j] * 1);
				this.ctx.lineTo(x2 * 1 - this.m_plotRadiusArray[i][j] * 1, y2 * 1 + this.m_plotRadiusArray[i][j] * 1);
				break;
			case "quad":
				this.ctx.moveTo(x2 * 1, y2 * 1 - this.m_plotRadiusArray[i][j] * 1);
				this.ctx.lineTo(x2 * 1 + this.m_plotRadiusArray[i][j] * 1, y2 * 1);
				this.ctx.lineTo(x2 * 1, y2 * 1 + this.m_plotRadiusArray[i][j] * 1);
				this.ctx.lineTo(x2 * 1 - this.m_plotRadiusArray[i][j] * 1, y2 * 1);
				this.ctx.lineTo(x2 * 1, y2 * 1 - this.m_plotRadiusArray[i][j] * 1);
				break;
			case "triangle":
				this.ctx.moveTo(x2 * 1, y2 * 1 - this.m_plotRadiusArray[i][j] * 1);
				this.ctx.lineTo(x2 * 1 + this.m_plotRadiusArray[i][j] * 1, y2 * 1 + this.m_plotRadiusArray[i][j] * 1);
				this.ctx.lineTo(x2 * 1 - this.m_plotRadiusArray[i][j] * 1, y2 * 1 + this.m_plotRadiusArray[i][j] * 1);
				this.ctx.lineTo(x2 * 1, y2 * 1 - this.m_plotRadiusArray[i] * 1);
				break;
			case "point":
				this.ctx.arc(x2 * 1, y2 * 1, this.m_plotRadiusArray[i][j] * 1, 0, Math.PI * 2, false);
				this.ctx.arc(x2 * 1, y2 * 1, this.m_plotRadiusArray[i][j] * 1, 0, Math.PI * 2, false);
				this.ctx.lineTo(x2 * 1 + this.m_plotRadiusArray[i][j] * 1, y2 * 1);
				break;
			case "polygon":
				this.drawPolygon(this.ctx, x2, y2, this.m_plotRadiusArray[i][j] * 1, 6, Math.PI / 2, false);
				break;
			case "star":
				this.drawStar(this.ctx, x2, y2, this.m_plotRadiusArray[i][j] * 1, this.m_plotRadiusArray[i][j] * 2 / 5, 5);
				break;
			case "NA":
				break;
			case "default":
				this.ctx.arc(x2 * 1, y2 * 1, this.m_plotRadiusArray[i][j] * 1, 0, Math.PI * 2, false);
				this.ctx.arc(x2 * 1, y2 * 1, this.m_plotRadiusArray[i][j] * 1, 0, Math.PI * 2, false);
				this.ctx.lineTo(x2 * 1, y2 * 1);
				break;
			}
			this.ctx.fillStyle = hex2rgb(this.m_outlierColorsArray[i][j], this.m_outlierOpacityArray[i][j]);
			this.ctx.fill();
			this.ctx.lineWidth = "0.3";
			this.ctx.strokeStyle = this.m_strokeColor;
			this.ctx.stroke();
			this.ctx.closePath();
		}
	}
	this.ctx.restore();
};

/** @Description method for draw the Polygons shape on Canvas. **/
BenchCandles.prototype.drawPolygon = function (ctx, x, y, radius, sides, startAngle, anticlockwise) {
	if (sides < 3)
		return;
	var a = (Math.PI * 2) / sides;
	a = anticlockwise ? -a : a;
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(startAngle);
	ctx.moveTo(radius, 0);
	for (var i = 1; i < sides; i++) {
		ctx.lineTo(radius * Math.cos(a * i), radius * Math.sin(a * i));
	}
	ctx.closePath();
	ctx.restore();
};

/** @Description method for draw the Star shape on Canvas. **/
BenchCandles.prototype.drawStar = function (ctx, cx, cy, r1, r0, spikes) {
	var rot = Math.PI / 2 * 3;
	var x = cx;
	var y = cy;
	var step = Math.PI / spikes;

	ctx.beginPath();
	ctx.moveTo(cx, cy - r0);
	for (var i = 0; i < spikes; i++) {
		x = cx * 1 + Math.cos(rot) * r0;
		y = cy * 1 + Math.sin(rot) * r0;
		ctx.lineTo(x, y);
		rot = rot * 1 + step * 1;

		x = cx * 1 + Math.cos(rot) * r1;
		y = cy * 1 + Math.sin(rot) * r1;
		ctx.lineTo(x, y);
		rot = rot * 1 + step * 1;
	}
	ctx.lineTo(cx, cy - r0);
	ctx.closePath();
};
/***************************** XAxis *********************************/
function BenchXaxis() {
	this.base = Axes;
	this.base();

	this.m_chart;

	this.m_startX;
	this.m_startY;
	this.m_endX;
	this.m_endY;

	this.m_xAxisData = [];
	this.m_axiscolor;

	this.m_showlinexaxis = "true";
	this.m_linexaxiscolor = "";

	this.m_textUtil = new TextUtil();
	this.ctx = "";
};

BenchXaxis.prototype = new Axes;

BenchXaxis.prototype.init = function(m_chart) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.m_startX = this.m_chart.getStartX();
	this.m_startY = this.m_chart.getStartY();
	this.m_endX = this.m_chart.getEndX();
	this.m_endY = this.m_chart.getEndY();

	this.m_xAxisData = this.m_chart.getCategoryData()[0];
	this.m_axiscolor = convertColorToHex(this.m_chart.getAxisColor());
	this.m_linexaxiscolor = (this.m_linexaxiscolor !== "") ? convertColorToHex(this.m_linexaxiscolor) : this.m_axiscolor;
	this.m_labelfontcolor = convertColorToHex(this.getLabelFontColor());
};

BenchXaxis.prototype.drawXAxis = function() {
	if (IsBoolean(this.m_showlinexaxis)) {
		var msfx = 1;
		/** msfx = margin space from x - axis 1 px **/
		var lineWidth = 0.5;
		var antiAliasing = 0.5;
		var strokeColor = this.m_linexaxiscolor;
		var x1 = this.m_startX * 1 - msfx * 1 - this.m_chart.m_axistodrawingareamargin;
		var y1 = this.m_startY * 1 + msfx * 1 + this.m_chart.m_axistodrawingareamargin;
		var x2 = this.m_endX * 1;
		var y2 = this.m_startY * 1 + msfx * 1 + this.m_chart.m_axistodrawingareamargin;
		this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
	}
};

BenchXaxis.prototype.drawTickMarks = function() {
	if (IsBoolean(this.m_tickmarks)) {
		var tickMarkerHeight = 8;
		/** BDD - 744_showing tickmark in place of vertical line **/
		if(IsBoolean(this.m_chart.m_tickmarksatstart)){
			for (var i = 0; i < this.m_xAxisData.length; i++) {
				var lineWidth = 0.5;
				var antiAliasing = 0.5;
				var strokeColor = this.m_categorymarkingcolor;
				var x1 = this.m_startX * 1 + this.getXaxisDivison() * i + this.getXaxisDivison()/2;
				var y1 = this.m_startY * 1 + this.m_chart.m_axistodrawingareamargin;
				var x2 = this.m_startX * 1 + this.getXaxisDivison() * i + this.getXaxisDivison()/2;
				var y2 = this.m_startY * 1 + tickMarkerHeight * 1 + this.m_chart.m_axistodrawingareamargin;
				this.drawLineBetweenPoints(lineWidth, antiAliasing,strokeColor, x1, y1, x2, y2);
			}
		}
		else
		{
			for (var i = 0; i < this.m_xAxisData.length + 1; i++) {
				
				var lineWidth = 0.5;
				var antiAliasing = 0.5;
				var strokeColor = this.m_categorymarkingcolor;
				var x1 = this.m_startX * 1 + this.getXaxisDivison() * i - 1;
				var y1 = this.m_startY * 1 + this.m_chart.m_axistodrawingareamargin;
				var x2 = this.m_startX * 1 + this.getXaxisDivison() * i - 1;
				var y2 = this.m_startY * 1 + tickMarkerHeight * 1 + this.m_chart.m_axistodrawingareamargin;
				this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
			}
		}
	}
};

BenchXaxis.prototype.drawVerticalLine = function() {
	if (IsBoolean(this.m_chart.m_showverticalmarkerline)) {
		for (var i = 0; i < this.m_xAxisData.length; i++) {
			var lineWidth = 0.5;
			var antiAliasing = 0.5;
			var strokeColor = hex2rgb(this.m_chart.m_markercolor, this.m_chart.m_markertransparency);
			var x1 = this.m_startX * 1 + (this.getXaxisDivison() / 2 + this.getXaxisDivison() * i);
			var y1 = this.m_startY * 1 + this.m_chart.m_axistodrawingareamargin;
			var x2 = this.m_startX * 1 + (this.getXaxisDivison() / 2 + this.getXaxisDivison() * i);
			var y2 = this.m_endY * 1;
			this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
		}
	}
};

BenchXaxis.prototype.markXaxis = function() {
	var checkLabelFont = parseInt(this.m_chart.m_xAxis.m_labelfontsize);
	var checkFont = parseInt(this.m_chart.m_xAxis.m_fontsize);
	if(checkLabelFont>0){
		this.drawAxisLabels();
	}
	if (checkFont>0) {
		this.drawDescription();
	}
};
BenchXaxis.prototype.drawAxisLabels = function() {
	for (var i = 0; i < this.m_xAxisData.length; i++) {
		if ((i % this.m_chart.m_skipxaxislabels) == 0 || this.m_chart.m_skipxaxislabels == "auto") {
			this.ctx.beginPath();
			this.ctx.save();
			if (this.m_chart.m_type == "Plot") {
				this.drawAxisLabelsForScatterPlotChart(this.m_xAxisData[i], i);
			} else {
				this.drawLabel(this.m_xAxisData[i], i);
			}
			this.ctx.restore();
			this.ctx.closePath();
		}
	}
};
BenchXaxis.prototype.drawLabel = function(text, i) {
	var m_axisLineToTextGap = (IsBoolean(this.m_chart.m_updateddesign) ? 15 : 5);
	if (IsBoolean(this.getLabelTilted())) {
		var dm = (this.getDescription() !== "") ? this.m_fontsize : 5;
		var avlblheight = this.m_chart.m_height / 4 - m_axisLineToTextGap / 2 - dm - this.calculateAxisLineToTextGap() / 2;
		var rotation = this.getLabelrotation();
		this.ctx.font = this.getLabelFontProperties();
		if (this.ctx.measureText(text).width > avlblheight) {
			text = this.getText("" + text, avlblheight, this.getLabelFontProperties());
		}
	} else {
		/**commented if else statement since first and lastvalue not displaying properly even with enough space.**/
/*		if (i == 0 || i == this.m_xAxisData.length - 1) {
			var avlblheight = ((this.m_endX - this.m_startX) / this.m_xAxisData.length);
		}
		else {
			var avlblheight = ((this.m_endX - this.m_startX) / this.m_xAxisData.length) * 2;
		}   */
		var avlblheight = ((this.m_endX - this.m_startX) / this.m_xAxisData.length) * 2;
		var rotation = 0;
		if (this.m_chart.noOfRows == 2) {
			text = this.getText("" + text, avlblheight, this.getLabelFontProperties());
		}
	}
	this.translateTextPosition(m_axisLineToTextGap, i, text);
	this.ctx.rotate(rotation * Math.PI / 180);

	if (IsBoolean(this.isLabelDecoration())) {
		this.drawUnderLine(text, 0, this.m_labelfontsize / 2, this.m_labelfontcolor, this.m_chart.fontScaling(this.getLabelFontSize()), this.m_labeltextalign);
	}
	this.m_textUtil.drawText(this.ctx, text, 0, 0, this.getLabelFontProperties(), this.m_labeltextalign, this.m_labelfontcolor);
};

BenchXaxis.prototype.drawLabelUnderLine = function() {
	if (this.isLabelDecoration()) {
		for (var i = 0; i < this.m_xAxisData.length; i++) {
			this.drawUnderLine(this.m_xAxisData[i], parseInt(this.m_startX) + (parseInt(this.getXaxisDivison()) * i), parseInt(this.m_startY) + 15, this.m_labelfontcolor, this.m_chart.fontScaling(this.getLabelFontSize()), this.m_labeltextalign);
		}
	}
};

BenchXaxis.prototype.drawDescription = function() {
	//	this.m_textUtil.drawText( this.ctx ,this.getDescription(),this.getXDesc(), this.getYDesc() , this.getFontProperties() , this.m_descriptiontextalign ,this.m_fontcolor);
	var dsDec=this.m_chart.m_allCategoryDisplayNames.join("");
	var description=(IsBoolean(this.m_chart.m_xAxis.m_showdatasetdescription)) ? this.m_chart.formattedDescription(this.m_chart, dsDec) : this.m_chart.formattedDescription(this.m_chart, this.m_description);
	if(description !== ""){
		this.ctx.beginPath();
		this.ctx.font = this.getFontProperties();
		this.ctx.textAlign = this.m_descriptiontextalign;
		this.ctx.fillStyle = convertColorToHex(this.m_fontcolor);
		this.ctx.fillText(description, this.getXDesc(), this.getYDesc());
		this.ctx.closePath();
		if (this.isDescriptionDecoration()) {
			this.drawUnderLine(description, this.getXDesc(), (this.getYDesc() * 1 + this.m_fontsize / 2), convertColorToHex(this.m_fontcolor), this.m_chart.fontScaling(this.getFontSize()), this.m_descriptiontextalign);
		}	
	}
};

BenchXaxis.prototype.drawUnderLine = function(text, startX, startY, color, fontSize, align) {
	this.m_chart.underLine(text, startX, startY, color, fontSize, align);
};

BenchXaxis.prototype.getXaxisDivison = function() {
	return ((this.m_endX - this.m_startX) / (this.m_xAxisData.length));
};

BenchXaxis.prototype.getFontProperties = function() {
	return this.m_textUtil.getFontProperties(this.getFontStyle(), this.getFontWeight(), this.m_chart.fontScaling(this.getFontSize()), this.getFontFamily());
};

BenchXaxis.prototype.getLabelFontProperties = function() {
	return this.m_textUtil.getFontProperties(this.getLabelFontStyle(), this.getLabelFontWeight(), this.m_chart.fontScaling(this.getLabelFontSize()), this.getLabelFontFamily());
};

BenchXaxis.prototype.calculateAxisLineToTextGap = function() {
	return this.m_chart.fontScaling(this.getLabelFontSize()) + (this.m_chart.m_chartpaddings.bottomMarkersToLine*1 || 0);
};
BenchXaxis.prototype.calculateAxisToLabelMargin = function(i) {
	var axisToLabelMargin = 0;
	if(this.m_chart.noOfRows == 2 && !IsBoolean(this.getLabelTilted())){
		if(i % 2 != 0) {
			axisToLabelMargin = this.m_chart.fontScaling(this.getLabelFontSize() * 1.5);
		}
	}
	return axisToLabelMargin*1;
};
BenchXaxis.prototype.getLabelTextWidth = function(text) {
	this.ctx.font = this.getLabelFontProperties();
	var textWidth = this.ctx.measureText(text).width;
	if (textWidth > this.m_chart.m_height * 0.25) {
		textWidth = this.m_chart.m_height * 0.25;
	}
	return textWidth;
};

BenchXaxis.prototype.translateTextPosition = function(m_axisLineToTextGap, i, text) {
	var labelRotation = this.getLabelrotation();
	var axisToLabelMargin = this.calculateAxisToLabelMargin(i);
	var y = this.m_startY * 1 + m_axisLineToTextGap / 2 + axisToLabelMargin * 1 + this.calculateAxisLineToTextGap() / 2 + this.m_chart.m_axistodrawingareamargin;
	switch (this.m_chart.m_type) {
		case "HeatMap":
			var barWidth = this.m_chart.getHeatMapCellWidth();
			var x = (this.m_startX) * 1 + (barWidth * i * 1 + barWidth * 1 / 2);
			var textWidth = this.getLabelTextWidth(text);
			break;
		case "Plot":
			var maxSerText = this.getMaxSeriesValue();
			var textWidth = this.getLabelTextWidth(maxSerText);
			if (this.m_xAxisData.length == 1) {
				var x = this.m_startX * 1 + (this.m_endX - this.m_startX) / 2;
			} else {
				//			var x = this.m_startX * 1 + ((this.m_endX - this.m_startX) / (this.m_xAxisData.length * 1 + 1)) * (i * 1 + 1);
				var x = this.m_startX * 1 + ((this.m_endX - this.m_startX) / (this.m_xAxisData.length * 1 - 1)) * (i * 1); // remove extra space from both side on x-axis.
			}
			break;
		default:
			var textWidth = this.getLabelTextWidth(text);
			if (this.m_xAxisData.length == 1) {
				var x = this.m_startX * 1 + (this.m_endX - this.m_startX) / 2;
			} else {
				var x = (this.m_startX) * 1 + (this.getXaxisDivison() / 2) * 1 + (this.getXaxisDivison() * i);
			}
			break;
	}
	this.translateText(labelRotation, x, y, text, textWidth);
};

BenchXaxis.prototype.getMaxSeriesValue = function() {
	var max = this.m_xAxisData[0];
	for (var i = 0; i < this.m_xAxisData.length; i++) {
		if (max < this.m_xAxisData[i]) {
			max = this.m_xAxisData[i];
		}
	}
	return max;
};

BenchXaxis.prototype.translateText = function(labelRotation, x, y, text, textWidth) {
	this.m_labeltextalign = "center";
	if (IsBoolean(this.m_chart.m_xAxis.getLabelTilted())) {
		if (labelRotation > 0 && labelRotation <= 90) {
			this.m_labeltextalign = "left";
		} else if (labelRotation < 0 && labelRotation >= -90) {
			this.m_labeltextalign = "right";
		} else {
			this.m_labeltextalign = "center";
		}

		this.ctx.translate(x, y);
	} else {
		this.ctx.translate(x, y * 1 + 10);
	}
};
BenchXaxis.prototype.getXDesc = function() {
	return this.m_chart.m_x * 1 + this.m_chart.m_width / 2;
};

BenchXaxis.prototype.getYDesc = function() {
	this.m_chart.m_chartpaddings["bottomBorderToDescription"] = (IsBoolean(this.m_chart.m_updateddesign) ? 40 :this.m_chart.m_chartpaddings["bottomBorderToDescription"]);
	var yPosition = this.m_chart.m_y * 1 + ((this.m_chart.m_height* 1 ) * 0.65) - this.m_fontsize - this.m_chart.m_chartpaddings.bottomBorderToDescription*1/2;
	return yPosition;
};
//# sourceURL=BenchmarkAnalysisChart.js
