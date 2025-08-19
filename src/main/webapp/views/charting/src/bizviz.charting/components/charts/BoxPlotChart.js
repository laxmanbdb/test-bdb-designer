/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: BoxPlotChart.js
 * @description BoxPlotchart
 **/
function BoxPlotChart(m_chartContainer, m_zIndex) {
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

	this.m_lowerboxfillcolors = "#4183d7,#663399";
	this.m_upperboxfillcolors = "#f7ca18,#2ecc71";
	this.m_boxfillopacity = "0.8,0.8";
	this.m_boxgroupnames = "Male,Female";

	this.m_boxPlotCalculation = new BoxPlotCalculation();
	this.m_xAxis = new Xaxis();
	this.m_yAxis = new Yaxis();

	this.noOfRows = 1;
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_fieldtypes = ["Max", "Min", "Q3", "Q1", "Median", "Outlier"];
	this.isValidConfig = true;
};

/** @description Making prototype of chart class to inherit its properties and methods into BoxPlot chart **/
BoxPlotChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
BoxPlotChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
BoxPlotChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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
BoxPlotChart.prototype.setStartX = function () {
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
BoxPlotChart.prototype.getYAxisLabelMargin = function () {
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
BoxPlotChart.prototype.getLabelFormatterMargin = function () {
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
BoxPlotChart.prototype.getLabelWidth = function () {
	return this.m_labelwidth;
};

/** @description Setter Method to set LabelWidth. **/
BoxPlotChart.prototype.setLabelWidth = function() {
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
BoxPlotChart.prototype.getLabelSignMargin = function () {
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
BoxPlotChart.prototype.getLabelPrecisionMargin = function () {
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
BoxPlotChart.prototype.getMinimumSeriesValue = function () {
	return this.m_minimumseriesvalue;
};

/** @description Getter Method of MaximumSeriesValue. **/
BoxPlotChart.prototype.getMaximumSeriesValue = function () {
	return this.m_maximumSeriesValue;
};

/** @description Setter Method of MaxMinSeriesValue. **/
BoxPlotChart.prototype.setMaxMinSeriesValue = function () {
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
BoxPlotChart.prototype.getLabelSecondFormatterMargin = function () {
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
BoxPlotChart.prototype.getFormatterMargin = function () {
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

/** @description Setter Method to setEndX for BoxPlotChart. **/
BoxPlotChart.prototype.setEndX = function () {
	var blm = this.getBorderToLegendMargin();
	var vlm = this.getVerticalLegendMargin();
	var vlxm = this.getVerticalLegendToXAxisMargin();
	var rightSideMargin = blm * 1 + vlm * 1 + vlxm * 1;

	this.m_endX = (this.m_x * 1 + this.m_width * 1 - rightSideMargin * 1);
};

/** @description Setter Method to setStartY for BoxPlotChart. **/
BoxPlotChart.prototype.setStartY = function () {
	var cm = this.getChartMargin();
	var xlbm = this.getXAxisLabelMargin();
	var xdm = this.getXAxisDescriptionMargin();
	var bottomMargin = cm * 1 + xlbm * 1 + xdm * 1;
	this.m_startY = (this.m_y * 1 + this.m_height * 1 - bottomMargin * 1);
};

/** @description Getter Method of XAxisLabelMargin **/
BoxPlotChart.prototype.getXAxisLabelMargin = function () {
	var xAxislabelDescMargin = 15;
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
BoxPlotChart.prototype.setNoOfRows = function () {
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
BoxPlotChart.prototype.setEndY = function () {
	this.m_endY = (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};

/** @description Getter Method of DataProvider **/
BoxPlotChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description Getter Method of CategoryNames **/
BoxPlotChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};

/** @description Getter Method of SubCategoryNames **/
BoxPlotChart.prototype.getSubCategoryNames = function () {
	return this.m_subCategoryNames;
};

/** @description Getter Method of SubCategory DisplayNames **/
BoxPlotChart.prototype.getSubCategoryDisplayNames = function () {
	return this.m_subCategoryDisplayNames;
};

/** @description Getter Method of Category DisplayNames **/
BoxPlotChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

/** @description Setter Method of Fields according to fieldType **/
BoxPlotChart.prototype.setFields = function (fieldsJson) {
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
BoxPlotChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	this.m_allCategoryNames = [];
	this.m_allCategoryDisplayNames = [];
	this.m_categoryVisibleArr = {};
	this.m_categoryFieldColor = [];
	var count = 0;
	// only one category can be set for chart, preference to first visible one
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
BoxPlotChart.prototype.setChartTypeAccordingToSubCategory = function () {
	this.m_chartType = "clustered";
	if (this.m_categoryNames.length == 0 || this.m_subCategoryNames.length == 0) {
		this.m_chartType = "stacked";
	}
};

/** @description Setter Method to set SubCategory. **/
BoxPlotChart.prototype.setSubCategory = function (subCategoryJson) {
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
BoxPlotChart.prototype.setSeries = function (seriesJson) {
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

	for (var j = 0, length=this.m_fieldtypes.length; j < length; j++) {
		this.m_reqSeriesVisibleArr[this.m_fieldtypes[j]] = {};
		this.m_reqSeriesVisibleArr[this.m_fieldtypes[j]]["visible"] = (this.m_fieldtypes[j] != "Outlier") ? false : true;
		for (var i = 0; i < seriesJson.length; i++) {
			var type = this.getProperAttributeNameValue(seriesJson[i], "Type");
			var visiblity = this.getProperAttributeNameValue(seriesJson[i], "visible");
			var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
			this.m_allSeriesDisplayNames[i] = m_formattedDisplayName;
			this.m_allSeriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
			this.m_seriesVisibleArr[this.m_allSeriesNames[i]] = visiblity;
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
BoxPlotChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};

/** @description Getter Method of SeriesDisplayNames. **/
BoxPlotChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};

/** @description Getter Method of SeriesColors. **/
BoxPlotChart.prototype.getSeriesColors = function () {
	return this.m_seriesColors;
};

/** @description Getter Method of BoxFillColors. **/
BoxPlotChart.prototype.getBoxFillColors = function () {
	return this.m_boxFillColors;
};

/** @description Setter Method to set BoxFillColors. **/
BoxPlotChart.prototype.setBoxFillColors = function () {
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
BoxPlotChart.prototype.setLegendNames = function (m_legendNames) {
	if (this.m_chartType == "clustered") {
		this.m_legendNames = this.m_subCateogryData;
	} else {
		this.m_legendNames = ["LowerBox", "UpperBox"];
	}
};

/** @description Getter Method of LegendNames. **/
BoxPlotChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};

/** @description Setter Method to set AllFieldsName. **/
BoxPlotChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getCategoryNames()[i]);
	}
	for (var j = 0; j < this.getSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getSeriesNames()[j]);
	}
};

/** @description Getter Method of AllFieldsName. **/
BoxPlotChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

/** @description Setter Method to set AllFieldsDisplayName. **/
BoxPlotChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

/** @description Getter Method of AllFieldsDisplayName. **/
BoxPlotChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

/** @description Setter Method to set CategorySeriesData. **/
BoxPlotChart.prototype.setCategorySeriesData = function () {
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
BoxPlotChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	this.isEmptyCategory = true;
	for (var i = 0, length= this.getCategoryNames().length ; i <length ; i++) {
		this.isEmptyCategory = false;
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
};

/** @description Getter Method of CategoryData. **/
BoxPlotChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

/** @description Setter Method to set SubCategoryData. **/
BoxPlotChart.prototype.setSubCategoryData = function () {
	this.m_subCategoryData = [];
	this.isEmptySubCategory = true;
	for (var i = 0, length=this.getSubCategoryNames().length ; i < length; i++) {
		this.isEmptySubCategory = false;
		this.m_subCategoryData[i] = this.getDataFromJSON(this.getSubCategoryNames()[i]);
	}
};

/** @description Getter Method of SubCategoryData. **/
BoxPlotChart.prototype.getSubCategoryData = function () {
	return this.m_subCategoryData;
};

/** @description Method will convert 2D Array to 1D Array. **/
BoxPlotChart.prototype.convert2DTo1D = function (data) {
	var temp = [];
	for (var i = 0, length= data.length ; i <length; i++) {
		for (var j = 0, innerlength=data[i].length ; j <innerlength ; j++) {
			temp.push(data[i][j]);
		}
	}
	return temp;
};

/** @description Method will provide the unique data. **/
BoxPlotChart.prototype.unique = function (data) {
	var outputArray = [];
	for (var i = 0, length= data.length ; i <length; i++) {
		if (($.inArray(data[i], outputArray)) == -1) {
			outputArray.push(data[i]);
		}
	}
	return outputArray;
};

/** @description Setter Method to set  SeriesData. **/
BoxPlotChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0, length= this.getSeriesNames().length ; i <length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
};
/** @description Getter Method of  SeriesData. **/
BoxPlotChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

/** @description Setter Method to set  SeriesColor. **/
BoxPlotChart.prototype.setSeriesColor = function (m_seriesColor) {
	this.m_seriesColor = m_seriesColor;
};

/** @description Getter Method of SeriesColor. **/
BoxPlotChart.prototype.getSeriesColor = function () {
	return this.m_seriesColor;
};

/** @description Method to checking  Valid Configuration and returning true and false accordingly. **/
BoxPlotChart.prototype.checkValidConfiguration = function () {
	this.isValidConfig = true;
	for (var j = 0,length=this.m_fieldtypes.length ; j < length; j++) {
		if (!IsBoolean(this.m_reqSeriesVisibleArr[this.m_fieldtypes[j]]["visible"]))
			this.isValidConfig = false;
	}
};

/** @description Method will update Data For BoxPlot accordingly for category/subCategory/Series/tooltip. **/
BoxPlotChart.prototype.updateDataForBoxPlot = function () {
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

/** @description initialization of BoxPlotChart **/
BoxPlotChart.prototype.init = function () {
	// this.setCategoryData();
	// this.setSubCategoryData();
	// this.setSeriesData();
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
			this.m_xAxis.init(this, this.m_boxPlotCalculation);
			this.m_yAxis.init(this, this.m_boxPlotCalculation);
		}
	}
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};

/** @description Getter Method of UpdateSeriesData **/
BoxPlotChart.prototype.getUpdateSeriesData = function (data) {
	for (var i = 0,length=data.length ; i < length; i++) {
		data[i] = this.getUpdateSeriesDataWithCommaSeperators(data[i]);
	}
	return data;
};

/** @description Getter Method to get Update SeriesData With CommaSeperators **/
BoxPlotChart.prototype.getUpdateSeriesDataWithCommaSeperators = function (data) {
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
BoxPlotChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	
	if (!(IsBoolean(this.isEmptyCategory)) || !(IsBoolean(this.isEmptySubCategory))) {
		if (!IsBoolean(this.m_isEmptySeries)) {
			if (IsBoolean(this.isValidConfig)) {
				this.drawXAxis();
				this.drawYAxis();
				this.drawCandleChart();
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
BoxPlotChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description  initialization of draggable div and its inner Content **/
BoxPlotChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/** @description  draw the Title of chart if showTitle is set to true. **/
BoxPlotChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

/** @description  draw the subTitle of chart if showSubTitle is set to true. **/
BoxPlotChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

/** @description  draw the x-axis of chart. **/
BoxPlotChart.prototype.drawXAxis = function () {
	this.m_xAxis.drawTickMarks();
	this.m_xAxis.drawVerticalLine();
	this.m_xAxis.markXaxis();
	this.m_xAxis.drawXAxis();
};

/** @description  draw the y-axis of chart. **/
BoxPlotChart.prototype.drawYAxis = function () {
	if (IsBoolean(this.m_showmarkerline))
		this.m_yAxis.horizontalMarkerLines();
	if (IsBoolean(this.m_zeromarkerline) && !IsBoolean(this.m_basezero) && IsBoolean(this.m_yAxis.hasNegativeAxisMarker(this.m_yAxisMarkersArray)))
		this.m_yAxis.zeroMarkerLine();
	this.m_yAxis.markYaxis();
	this.m_yAxis.drawYAxis();
};

/** @description  draw the ChartFrame of chart. **/
BoxPlotChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

/** @description  method will initialize the calculation parts. **/
BoxPlotChart.prototype.initializeCalculation = function () {
	this.calculateMaxMinValue(this.m_seriesData);
	this.calculateMinMax();
	this.setChartDrawingArea();
	this.m_boxPlotCalculation.initGlobalCalculation(this);
	this.setBoxFillColors();
	this.setLegendNames(this.m_legendNames);
	var categoryData = this.updateSeriesData(this.m_categoryData);
	this.m_boxPlotCalculation.init(this, categoryData, this.m_seriesData);
	this.m_xPixelArray = this.m_boxPlotCalculation.getxPixelArray();
	this.m_yPixelArray = this.m_boxPlotCalculation.getyPixelArray();
	this.m_candleWidth = this.m_boxPlotCalculation.getcandleWidth();
	this.m_linePixelArray = this.m_boxPlotCalculation.getLinePixelArray();
	this.m_medianLinePixelArray = this.m_boxPlotCalculation.getMedianLinePixelArray();

	this.m_outlierPixelArray = this.m_boxPlotCalculation.getOutlierPixelArray();
	this.m_outlierShapeArray = this.m_boxPlotCalculation.getOutlierShapeArray();
	this.m_outlierColorsArray = this.m_boxPlotCalculation.getOutlierColorsArray();
	this.m_outlierOpacityArray = this.m_boxPlotCalculation.getOutlierOpacityArray();
	this.m_outlierRadiusArray = this.m_boxPlotCalculation.getOutlierRadiusArray();

	this.m_candleHeightArray = this.m_boxPlotCalculation.getcandleHeightArray();
	this.m_candleColor = this.m_boxPlotCalculation.getCandleColor();
	var lineStrokeColor = convertColorToHex(this.m_strokecolor);
	this.initializeCandles(lineStrokeColor);
};

/** @description  method will calculate the minimum and maximum value of the Chart. **/
BoxPlotChart.prototype.calculateMaxMinValue = function (m_seriesdata) {
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
BoxPlotChart.prototype.calculateMinMax = function () {
	var calculatedMin = this.calculateMin;
	var calculatedMax = this.calculateMax;

	var niceScaleObj=this.getCalculateNiceScale(calculatedMin,calculatedMax,this.m_basezero,this.m_autoaxissetup,this.m_minimumaxisvalue,this.m_maximumaxisvalue,(this.m_height));
	this.min=niceScaleObj.min;
	this.max=niceScaleObj.max;
	this.yAxisNoOfMarker=niceScaleObj.markerArray.length;
	this.yAxisText=niceScaleObj.step;
	this.m_yAxisMarkersArray=niceScaleObj.markerArray;
};

/** @Description  method used for initialize BoxCandles. **/
BoxPlotChart.prototype.initializeCandles = function (lineColor) {
	for (var i = 0,length= this.m_yPixelArray.length ; i <length; i++) {
		this.m_candlesArray[i] = [];
		for (var j = 0,innerlength= this.m_yPixelArray[i].length ; j <innerlength; j++) {
			this.m_candlesArray[i][j] = new BoxCandles();
			this.m_candlesArray[i][j].init(this.m_xPixelArray[i][j], this.m_yPixelArray[i][j], this.m_candleWidth, this.m_candleHeightArray[i][j], this.m_linePixelArray[i][j], this.m_medianLinePixelArray[i][j], this.m_outlierPixelArray[i][j], this.m_outlierShapeArray[i][j], this.m_outlierColorsArray[i][j], this.m_outlierOpacityArray[i][j], this.m_outlierRadiusArray[i][j], this.m_candleColor[i][j], lineColor, this.ctx);
		}
	}
};

/** @Description used to update SeriesData. **/
BoxPlotChart.prototype.updateSeriesData = function (array) {
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
BoxPlotChart.prototype.drawCandleChart = function () {
	for (var i = 0 ,length= this.m_yPixelArray.length ; i <length; i++) {
		for (var j = 0 ,innerlength=this.m_yPixelArray[i].length ; j <innerlength ; j++) {
			if (!this.isInRange(i))
				this.m_candlesArray[i][j].drawCandle();
		}
	}
};

/** @Description  will check a point is in range or not. **/
BoxPlotChart.prototype.isInRange = function (i) {
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
BoxPlotChart.prototype.getLegendTableContent = function () {
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
								"<td><span style=\"background-color:" + color + "; width:10px;height:10px;\"><span style=\"display:inline;\">" + this.getLegendNames()[i] + "</span></td></tr>";
		}
	}
	return legendTable;
};

/** @Description  getter Method  for LegendGradient. **/
BoxPlotChart.prototype.getLegendGradient = function (lowerColor, upperColor) {
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
BoxPlotChart.prototype.getXPositionforToolTip = function () {
	var xPosArray = [];
	for (var n = 0,length=this.m_xPixelArray.length ; n <length ; n++) {
		xPosArray.push(this.m_xPixelArray[0][n]);
	}
	return xPosArray;
};

/** @Description  getter Method  for get data For Tooltip. **/
BoxPlotChart.prototype.getToolTipData = function (mouseX, mouseY) {
	var toolTipData;
	if ((!IsBoolean(this.m_isEmptySeries)) && (!IsBoolean(this.isEmptyCategory)) && (IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None"))) {
		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			for (var i = 0,length= this.m_xPixelArray.length ; i <length; i++) {
				for (var ii = 0,innerlength= this.m_xPixelArray[i].length ; ii <innerlength; ii++) {
					if (mouseX <= (this.m_xPixelArray[i][ii] * 1 + this.m_boxPlotCalculation.getcandleWidth() * 1) && (mouseX >= this.m_xPixelArray[i][ii] * 1)) {
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
									var outlierYPix = this.m_boxPlotCalculation.getOutlierPixelArray()[i][ii];
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
									toolTipData.data[j][0] = this.m_fieldtypes[j];
									toolTipData.data[j][1] = this.m_seriesDisplayNames[j];
									toolTipData.data[j][2] = (this.m_seriesDataForToolTip[i][ii][j]) ? this.getFormatterForToolTip(this.m_seriesDataForToolTip[i][ii][j] * 1) : "";
								} else {
									var outlierYPix = this.m_boxPlotCalculation.getOutlierPixelArray()[i][ii];
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

/** @Description  method for draw Tooltip for BoxPlotChart. **/
BoxPlotChart.prototype.drawTooltip = function (mouseX, mouseY) {
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
BoxPlotChart.prototype.drawTooltipContent=function(toolTipData){
	this.m_tooltip.draw(toolTipData, this.m_componenttype);
};

/** @Description Getter method for get DrillDataPoints. **/
BoxPlotChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
	if ((!IsBoolean(this.m_isEmptySeries))) {
		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			for (var i = 0,length=this.m_xPixelArray.length ; i < length; i++) {
				for (var ii = 0,innerlength=this.m_xPixelArray[i].length ; ii <innerlength ; ii++) {
					if (mouseX <= (this.m_xPixelArray[i][ii] + this.m_boxPlotCalculation.getcandleWidth()) && (mouseX >= this.m_xPixelArray[i][ii])) {
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

/** @Description Constructor method for BoxPlotCalculation. **/
function BoxPlotCalculation() {
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
BoxPlotCalculation.prototype.initGlobalCalculation = function (m_chart) {
	this.m_chart = m_chart;
	this.m_x = this.m_chart.m_x;
	this.m_y = this.m_chart.m_y;
	this.m_width = this.m_chart.m_width;
	this.m_height = this.m_chart.m_height;
	//this.m_seriesNames = this.m_chart.m_legendNames;
	this.m_seriesData = this.m_chart.m_seriesData;
	this.m_categoryData = this.m_chart.m_categoryData;
	this.m_chartYMargin = 5;
	this.m_chartEndXMargin = 35;
	this.m_verticalLegendMargin = 60;
	this.m_chartTitleMargin = this.m_chart.m_title.getFontSize();
	this.m_chartSubTitleMargin = this.m_chart.m_subTitle.getFontSize();
};

/** @Description Method To Initialize BoxPlotCalculation with initialization of some variable. **/
BoxPlotCalculation.prototype.init = function (m_chart, m_categoryData, m_seriesData) {
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
BoxPlotCalculation.prototype.setDataForCandle = function (m_seriesData) {
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
BoxPlotCalculation.prototype.getBoxFillColorMap = function (index) {
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
BoxPlotCalculation.prototype.setDataForCandleLine = function (m_seriesData) {
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
BoxPlotCalculation.prototype.minValue = function () {
	return this.m_chart.min;
};

/** @Description Method will return the maximum value of Chart. **/
BoxPlotCalculation.prototype.getMaxValue = function () {
	return this.m_chart.max;
};

/** @Description Getter Method to get the Ratio. **/
BoxPlotCalculation.prototype.getRatio = function () {
	return this.ratio;
};

/** @Description Setter Method for set the Ratio. **/
BoxPlotCalculation.prototype.setRatio = function () {
	var diff = this.getMaxValue() - this.minValue();
	if (diff > 0)
		this.ratio = this.getDrawHeight() / (diff);
	else
		this.ratio = 1;
};

/** @Description Getter Method to get DrawHeight of the Chart . **/
BoxPlotCalculation.prototype.getDrawHeight = function () {
	return this.drawHeight;
};

/** @Description Setter Method for set DrawHeight of the Chart . **/
BoxPlotCalculation.prototype.setDrawHeight = function () {
	this.drawHeight = (this.m_startY - this.m_endY);
};

/** @Description Getter Method to get DrawWidth  of the Chart . **/
BoxPlotCalculation.prototype.getDrawWidth = function () {
	return this.drawWidth;
};

/** @Description Setter Method for set DrawWidth of the Chart . **/
BoxPlotCalculation.prototype.setDrawWidth = function () {
	this.drawWidth = 1 * (this.m_endX) - 1 * (this.m_startX);
};

/** @Description Method for calculate DrawWidth the CandleWidth . **/
BoxPlotCalculation.prototype.calculateCandleWidth = function () {
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
BoxPlotCalculation.prototype.getxPixelArray = function () {
	return this.m_xPixelArray;
};

/** @Description Setter Method for set xPixelArray  of the Chart . **/
BoxPlotCalculation.prototype.setxPixelArray = function () {
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
BoxPlotCalculation.prototype.getyPixelArray = function () {
	return this.m_ypixelArray;
};

/** @Description Setter Method for set xPixelArray . **/
BoxPlotCalculation.prototype.setyPixelArray = function () {
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
BoxPlotCalculation.prototype.getcandleHeightArray = function () {
	return this.m_candleHeightArray;
};

/** @Description Setter Method for set candleHeightArray . **/
BoxPlotCalculation.prototype.setcandleHeightArray = function (seriesdata, data) {
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
BoxPlotCalculation.prototype.getLinePixelArray = function () {
	return this.m_linePixelArray;
};

/** @Description Getter Method to get CandleColor . **/
BoxPlotCalculation.prototype.getCandleColor = function () {
	return this.m_candleColor;
};

/** @Description Setter Method for set linePixelArray . **/
BoxPlotCalculation.prototype.setlinePixelArray = function (arrline, data) {
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
BoxPlotCalculation.prototype.getMedianLinePixelArray = function () {
	return this.m_medianLinePixelArray;
};

/** @Description Setter Method for MedianLinePixelArray . **/
BoxPlotCalculation.prototype.setMedianLinePixelArray = function (arrline, data) {
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
BoxPlotCalculation.prototype.getOutlierPixelArray = function () {
	return this.m_outlierPixelArray;
};

/** @Description Setter Method for OutlierPixelArray . **/
BoxPlotCalculation.prototype.setOutlierPixelArray = function () {
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
BoxPlotCalculation.prototype.getOutlierShapeArray = function () {
	return this.data.candleOutlierShapes;
};

/** @Description Getter Method of OutlierColorsArray . **/
BoxPlotCalculation.prototype.getOutlierColorsArray = function () {
	return this.data.candleOutlierColors;
};

/** @Description Getter Method of OutlierOpacityArray . **/
BoxPlotCalculation.prototype.getOutlierOpacityArray = function () {
	return this.data.candleOutlierOpacity;
};

/** @Description Getter Method of OutlierRadiusArray . **/
BoxPlotCalculation.prototype.getOutlierRadiusArray = function () {
	return this.data.candleOutlierRadius;
};

/** @Description Method will return the updated CandleLinedata. **/
BoxPlotCalculation.prototype.updateCandleLinedata = function (highlowvalue, topvalue, downvalue) {
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
BoxPlotCalculation.prototype.getYAxisMarkersArray = function () {
	return this.m_chart.m_yAxisMarkersArray;
};

/** @Description Getter Method of YAxisText . **/
BoxPlotCalculation.prototype.getYAxisText = function () {
	return this.m_chart.m_yAxisText;
};

/** @Description Getter Method of candleWidth . **/
BoxPlotCalculation.prototype.getcandleWidth = function () {
	return this.candleWidth;
};

/** @Description Setter Method for CandleWidth . **/
BoxPlotCalculation.prototype.setCandleWidth = function (candlewidth) {
	this.candleWidth = candlewidth;
	if (this.m_chart.m_subCateogryData.length > 1)
		this.candleWidth /= this.m_chart.m_subCateogryData.length;
};

/** @Description Getter Method of candleGap . **/
BoxPlotCalculation.prototype.getcandleGap = function () {
	return this.m_candleGap;
};

/** @Description Setter Method for CandleGap . **/
BoxPlotCalculation.prototype.setCandleGap = function (candleWidth) {
	var totalCandlewidth = candleWidth * this.m_xAxisData.length;
	var totalGap = this.getDrawWidth() - totalCandlewidth;
	this.m_candleGap = totalGap / (this.m_xAxisData.length);
};

/** @Description Constructor Method for BoxCandles . **/
function BoxCandles() {
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

/** @Description initialize the BoxCandles and assign argument value to variables. **/
BoxCandles.prototype.init = function (xPixel, yPixelArray, candleWidth, candleHeightArray, linePixelArray, medianLinePixelArray, outlierPixelArray, outlierShapeArray, outlierColorsArray, outlierOpacityArray, outlierRadiusArray, candleColor, strokecolor, ctx) {
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

/** @Description method for draw the BoxCandles. **/
BoxCandles.prototype.drawBoxCandles = function () {
	for (var i = 0,length=this.m_yPixelArray.length ; i <length ; i++) {
		this.drawCandle(this.m_xPixel[i] * 1, this.m_yPixelArray[i] * 1, this.m_candleWidth * 1, this.m_candleHeightArray[i] * 1);
	}
};

/** @Description method for draw the Candle on Canvas. **/
BoxCandles.prototype.drawCandle = function () {
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
BoxCandles.prototype.drawline = function () {
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
BoxCandles.prototype.drawOutliers = function () {
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
BoxCandles.prototype.drawPolygon = function (ctx, x, y, radius, sides, startAngle, anticlockwise) {
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
BoxCandles.prototype.drawStar = function (ctx, cx, cy, r1, r0, spikes) {
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
//# sourceURL=BoxPlotChart.js
