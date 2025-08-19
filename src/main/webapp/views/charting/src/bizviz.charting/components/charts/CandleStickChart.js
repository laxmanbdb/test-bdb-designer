/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: CandleStickChart.js
 * @description CandleStickChart
 **/
function CandleStickChart(m_chartContainer, m_zIndex) {
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
	this.m_linePixelArray = [];
	this.m_candleHeightArray = [];
	this.m_candlesArray = [];

	this.m_candleCalculation = new CandleStickCalculation();
	this.m_xAxis = new Xaxis();
	this.m_yAxis = new Yaxis();

	this.noOfRows = 1;
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_fieldtypes = ["High", "Low", "Close", "Open"];
	this.isValidConfig = true;
	this.m_showtooltipcategory = "true";
};

/** @description Making prototype of chart class to inherit its properties and methods into CandleStick chart **/
CandleStickChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
CandleStickChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
CandleStickChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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

/** @description Getter Method of DataProvider **/
CandleStickChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description Getter Method of CategoryNames **/
CandleStickChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};

/** @description Getter Method of Category DisplayNames **/
CandleStickChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

/** @description Setter Method to setStartX position for draw the Chart. **/
CandleStickChart.prototype.setStartX = function () {
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
CandleStickChart.prototype.getYAxisLabelMargin = function () {
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
CandleStickChart.prototype.getLabelFormatterMargin = function () {
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
CandleStickChart.prototype.getLabelWidth = function () {
	return this.m_labelwidth;
};

/** @description Setter Method to set LabelWidth. **/
CandleStickChart.prototype.setLabelWidth = function () {
	this.m_labelwidth = 0;
	var maxSeriesVals = [];
	if (this.fontScaling(this.m_yAxis.m_labelfontsize) > 0) {
		for(var i = 0; i < this.m_yAxisMarkersArray.length; i++){
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
CandleStickChart.prototype.getLabelSignMargin = function () {
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
CandleStickChart.prototype.getLabelPrecisionMargin = function () {
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
CandleStickChart.prototype.getMinimumSeriesValue = function () {
	return this.m_minimumseriesvalue;
};

/** @description Getter Method of MaximumSeriesValue. **/
CandleStickChart.prototype.getMaximumSeriesValue = function () {
	return this.m_maximumSeriesValue;
};

/** @description Setter Method of MaxMinSeriesValue. **/
CandleStickChart.prototype.setMaxMinSeriesValue = function () {
	this.m_maximumSeriesValue = 0;
	this.m_minimumseriesvalue = 0;
	for (var i = 0; i < this.m_seriesData.length; i++) {
		for (var j = 0; j < this.m_seriesData[i].length; j++) {
			var data = this.m_seriesData[i][j];
			data = (isNaN(data) || data == undefined || data == "") ? 0 : data;
			if (i == 0 && j == 0) {
				this.m_maximumSeriesValue = data;
				this.m_minimumseriesvalue = data;
			}
			if (this.m_maximumSeriesValue * 1 <= data * 1) {
				this.m_maximumSeriesValue = data;
			}
			if (this.m_minimumseriesvalue * 1 > data * 1) {
				this.m_minimumseriesvalue = data;
			}
		}
	}
};

/** @description Getter Method of LabelSecond FormatterMargin. **/
CandleStickChart.prototype.getLabelSecondFormatterMargin = function () {
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
CandleStickChart.prototype.getFormatterMargin = function () {
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

/** @description Setter Method to setEndX for CandleStickChart. **/
CandleStickChart.prototype.setEndX = function () {
	var blm = this.getBorderToLegendMargin();
	var vlm = this.getVerticalLegendMargin();
	var vlxm = this.getVerticalLegendToXAxisMargin();
	var rightSideMargin = blm * 1 + vlm * 1 + vlxm * 1;
	this.m_endX = (this.m_x * 1 + this.m_width * 1 - rightSideMargin * 1);
};

/** @description Setter Method to setStartY for CandleStickChart. **/
CandleStickChart.prototype.setStartY = function () {
	var cm = this.getChartMargin();
	var xlbm = this.getXAxisLabelMargin();
	var xdm = this.getXAxisDescriptionMargin();
	var bottomMargin = cm * 1 + xlbm * 1 + xdm * 1;
	this.m_startY = (this.m_y * 1 + this.m_height * 1 - bottomMargin * 1);
};

/** @description Getter Method of XAxisLabelMargin **/
CandleStickChart.prototype.getXAxisLabelMargin = function () {
	var xAxislabelDescMargin = this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.8;
	var radians = this.m_xAxis.m_labelrotation * (Math.PI / 180); 
	if (IsBoolean(this.m_xAxis.getLabelTilted())) {
		this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
		//xAxislabelDescMargin = this.ctx.measureText(this.m_categoryData[0][0]).width;
		for (var i = 1; i < this.m_categoryData[0].length; i++) {
			if (xAxislabelDescMargin <  Math.abs(this.ctx.measureText(this.m_categoryData[0][i]).width * radians)){
				xAxislabelDescMargin =  Math.abs(this.ctx.measureText(this.m_categoryData[0][i]).width * radians);
			}
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

/** @description Setter Method of NoOfRows for draw x-axis labels. **/
CandleStickChart.prototype.setNoOfRows = function () {
	this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
	var noOfRow = 1;
	if (!IsBoolean(this.isEmptyCategory)) {
		var textWidth = this.ctx.measureText(this.m_categoryData[0][0]).width;
		var xDivision = (this.getEndX() - this.getStartX()) / this.m_categoryData[0].length;
		for (var i = 1; i < this.m_categoryData[0].length; i++) {
			if (this.ctx.measureText(this.m_categoryData[0][i]).width > xDivision)
				noOfRow = 2;
		}
	}
	return noOfRow;
};

/** @description Setter Method of setEndY. **/
CandleStickChart.prototype.setEndY = function () {
	this.m_endY = (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};

/** @description Setter Method of Fields according to fieldType **/
CandleStickChart.prototype.setFields = function (fieldsJson) {
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
			seriesJson.push(fieldsJson[i]);
			break;
		}
	}
	this.setCategory(categoryJson);
	this.setSeries(seriesJson);
};

/** @description Setter Method of Category iterate for all category. **/
CandleStickChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	this.m_allCategoryNames = [];
	this.m_allCategoryDisplayNames = [];
	this.m_categoryVisibleArr = {};
	this.m_categoryFieldColor = [];
	var count = 0;
	// only one category can be set for chart, preference to first visible one
	for (var i = 0; i < categoryJson.length; i++) {
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

/** @description creating array for each property of fields and storing in arrays **/
CandleStickChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = [];
	this.m_legendNames = [];
	this.m_reqSeriesVisibleArr = {};
	this.m_seriesVisibleArr = {};
	this.m_allSeriesDisplayNames = [];
	this.m_allSeriesNames = [];
	this.m_plotTrasparencyArray = [];
	var count = 0;
	this.legendMap = {};

	for (var j = 0; j < this.m_fieldtypes.length; j++) {
		this.m_reqSeriesVisibleArr[this.m_fieldtypes[j]] = {};
		this.m_reqSeriesVisibleArr[this.m_fieldtypes[j]]["visible"] = false;
		for (var i = 0; i < seriesJson.length; i++) {
			var type = this.getProperAttributeNameValue(seriesJson[i], "Type");
			if (this.m_fieldtypes[j] == type) {
				var visiblity = this.getProperAttributeNameValue(seriesJson[i], "visible");
				var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
				this.m_allSeriesDisplayNames[i] = m_formattedDisplayName;
				this.m_allSeriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
				this.m_seriesVisibleArr[this.m_allSeriesNames[i]] = visiblity;
				if (IsBoolean(visiblity)) {
					this.m_reqSeriesVisibleArr[this.m_fieldtypes[j]]["visible"] = true;
					this.m_seriesDisplayNames[j] = m_formattedDisplayName;
					this.m_seriesNames[j] = this.getProperAttributeNameValue(seriesJson[i], "Name");
					this.m_legendNames[j] = m_formattedDisplayName;
					this.m_seriesColors[j] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));
					var tempMap = {
						"seriesName" : this.m_seriesNames[j],
						"displayName" : this.m_seriesDisplayNames[j],
						"color" : this.m_seriesColors[j],
						"shape" : "cube",
						"index": j
					};
					this.legendMap[this.m_seriesNames[j]] = tempMap;
					break;
				}
			}
		}
	}
};

/** @description Getter Method of LegendInfo. **/
CandleStickChart.prototype.getLegendInfo = function () {
	this.legendMap = {};
	var arr = ["Rise", "Decline"];
	var color = [this.m_fillcolor, this.m_declinefillcolor];
	if (this.m_legendNames != undefined && this.m_legendNames != null && this.m_legendNames.length != 0)
		for (var i = 0; i < arr.length; i++) {
			var tempMap = {
				"seriesName" : arr[i],
				"displayName" : arr[i],
				"color" : color[i],
				"shape" : "cube"
			};
			this.legendMap[arr[i]] = tempMap;
		}
	return this.legendMap;
};

/** @description Getter Method of SeriesNames. **/
CandleStickChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};

/** @description Getter Method of SeriesDisplayNames. **/
CandleStickChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};

/** @description Getter Method of SeriesColors. **/
CandleStickChart.prototype.getSeriesColors = function () {
	return this.m_seriesColors;
};

/** @description Setter Method to set LegendNames. **/
CandleStickChart.prototype.setLegendNames = function (m_legendNames) {
	var arr = [];
	if ((m_legendNames != undefined && m_legendNames !== null && m_legendNames !== "") && m_legendNames.length != 0) {
		for (var i = 0; i < 1; i++) {
			arr[i] = [];
			arr[i][0] = "Rise"; //m_legendNames[m_legendNames.length-1];
			arr[i][1] = "Decline"; //m_legendNames[m_legendNames.length-1];
		}
	}
	this.m_legendNames = arr[0];
};

/** @description Getter Method of LegendNames. **/
CandleStickChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};

/** @description Setter Method to set AllFieldsName. **/
CandleStickChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getCategoryNames()[i]);
	}
	for (var j = 0; j < this.getSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getSeriesNames()[j]);
	}
};

/** @description Getter Method of AllFieldsName. **/
CandleStickChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

/** @description Setter Method to set AllFieldsDisplayName. **/
CandleStickChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

/** @description Getter Method of AllFieldsDisplayName. **/
CandleStickChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

/** @description Setter Method to set CategorySeriesData. **/
CandleStickChart.prototype.setCategorySeriesData = function () {
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_seriesDataForToolTip = [];
	this.m_displaySeriesDataFlag = [];
	for (var k = 0; k < this.getDataProvider().length; k++) {
		var record = this.getDataProvider()[k];
		this.isEmptyCategory = true;
		if (this.getCategoryNames().length > 0) {
			this.isEmptyCategory = false;
			for (var i = 0; i < this.getCategoryNames().length; i++) {
				if( !this.m_categoryData[i] )
					this.m_categoryData[i] = [];
				var data = this.getValidFieldDataFromRecord(record,this.getCategoryNames()[i]);
				this.m_categoryData[i][k] = data;
			}
		}
	
		this.m_displaySeriesDataFlag[k] = [];
		for (var j = 0; j < this.getSeriesNames().length; j++) {
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
CandleStickChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	this.isEmptyCategory = true;
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.isEmptyCategory = false;
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
};

/** @description Getter Method of CategoryData. **/
CandleStickChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

/** @description Setter Method to set  SeriesData. **/
CandleStickChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0; i < this.getSeriesNames().length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
};
/** @description Getter Method of  SeriesData. **/
CandleStickChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

/** @description Setter Method to set  SeriesColor. **/
CandleStickChart.prototype.setSeriesColor = function (m_seriesColor) {
	this.m_seriesColor = m_seriesColor;
};

/** @description Getter Method of SeriesColor. **/
CandleStickChart.prototype.getSeriesColor = function () {
	return this.m_seriesColor;
};

/** @description Method to checking  Valid Configuration and returning true and false accordingly. **/
CandleStickChart.prototype.checkValidConfiguration = function () {
	this.isValidConfig = true;
	for (var j = 0; j < this.m_fieldtypes.length; j++) {
		if (!IsBoolean(this.m_reqSeriesVisibleArr[this.m_fieldtypes[j]]["visible"]))
			this.isValidConfig = false;
	}
};

/** @description initialization of CandleStickChart **/
CandleStickChart.prototype.init = function () {
	// this.setCategoryData();
	// this.setSeriesData();
	// this.updateSeriesDataWithCommaSeperators();
	this.setCategorySeriesData();
	this.checkValidConfiguration();
	this.setAllFieldsName();
	this.setAllFieldsDisplayName();
	this.isSeriesDataEmpty();
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);
	if ((!IsBoolean(this.m_isEmptySeries)) && (!IsBoolean(this.isEmptyCategory))) {
		if (IsBoolean(this.isValidConfig)) {
			this.initializeCalculation();
			this.m_xAxis.init(this, this.m_candleCalculation);
			this.m_yAxis.init(this, this.m_candleCalculation);
		}
	}
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};

/** @description Getter Method to get Update SeriesData With CommaSeperators **/
CandleStickChart.prototype.updateSeriesDataWithCommaSeperators = function () {
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

/** @description Drawing of component started by drawing different parts of component like Title,Subtitle, Axes, legends etc... **/
CandleStickChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	
	var map = this.IsDrawingPossible();
	if (IsBoolean(map.permission)) {
		if (IsBoolean(this.isValidConfig)) {
			this.drawXAxis();
			this.drawYAxis();
			this.drawCandleChart();
		} else {
			this.drawMessage("Invalid chart configuration");
		}
	} else {
		this.drawMessage(map.message);
	}
};

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
CandleStickChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description  initialization of draggable div and its inner Content **/
CandleStickChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/** @description  draw the Title of chart if showTitle is set to true. **/
CandleStickChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

/** @description  draw the subTitle of chart if showSubTitle is set to true. **/
CandleStickChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

/** @description  draw the x-axis of chart. **/
CandleStickChart.prototype.drawXAxis = function () {
	this.m_xAxis.drawTickMarks();
	this.m_xAxis.drawVerticalLine();
	this.m_xAxis.markXaxis();
	this.m_xAxis.drawXAxis();
};

/** @description  draw the y-axis of chart. **/
CandleStickChart.prototype.drawYAxis = function () {
	if (IsBoolean(this.m_showmarkerline))
		this.m_yAxis.horizontalMarkerLines();
	if (IsBoolean(this.m_zeromarkerline) && !IsBoolean(this.m_basezero) && IsBoolean(this.m_yAxis.hasNegativeAxisMarker(this.m_yAxisMarkersArray)))
		this.m_yAxis.zeroMarkerLine();
	this.m_yAxis.markYaxis();
	this.m_yAxis.drawYAxis();
};

/** @description  draw the ChartFrame of chart. **/
CandleStickChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

/** @description  method will initialize the calculation parts. **/
CandleStickChart.prototype.initializeCalculation = function () {
	this.calculateMaxMinValue(convertArrayType(this.m_seriesData));
	this.calculateMinMax();
	this.setChartDrawingArea();
	this.m_candleCalculation.initGlobalCalculation(this);
	this.setLegendNames(this.m_legendNames);
	var categoryData = this.updateSeriesData(this.m_categoryData);
	this.m_candleCalculation.init(this, categoryData, this.m_seriesData);
	this.m_xPixelArray = this.m_candleCalculation.getxPixelArray();
	this.m_yPixelArray = this.m_candleCalculation.getyPixelArray();
	this.m_candleWidth = this.m_candleCalculation.getcandleWidth();
	this.m_linePixelArray = this.m_candleCalculation.getLinePixelArray();
	this.m_candleHeightArray = this.m_candleCalculation.getcandleHeightArray();
	this.m_candleColor = this.m_candleCalculation.getCandleColor();
	var lineStrokeColor = convertColorToHex(this.m_strokecolor);
	this.initializeCandles(lineStrokeColor);
};

/** @Description used calculated  Min/Max value and get required ScaleInfo of The Axis **/
CandleStickChart.prototype.calculateMinMax = function () {
	var calculatedMin = this.calculateMin;
	var calculatedMax = this.calculateMax;

	var niceScaleObj=this.getCalculateNiceScale(calculatedMin,calculatedMax,this.m_basezero,this.m_autoaxissetup,this.m_minimumaxisvalue,this.m_maximumaxisvalue,(this.m_height));
	this.min=niceScaleObj.min;
	this.max=niceScaleObj.max;
	this.yAxisNoOfMarker=niceScaleObj.markerArray.length;
	this.yAxisText=niceScaleObj.step;
	this.m_yAxisMarkersArray=niceScaleObj.markerArray;
};

/** @Description calculate the min/max value from available series data. **/
CandleStickChart.prototype.calculateMaxMinValue = function (m_seriesdata) {
	this.calculateMax = 0;
	this.calculateMin = 0;
	var data = [];
	for (var i = 0, k = 0; i < m_seriesdata.length; i++) {
		for (var j = 0; j < m_seriesdata[i].length; j++) {
			data[k++] = (m_seriesdata[i][j]);
		}
	}
	var sortedData = data.sort(numOrdA);
	this.calculateMin = sortedData[0];
	for (i = 0; i < m_seriesdata.length; i++) {
		for (j = 0; j < m_seriesdata[i].length; j++) {
			if (1 * (m_seriesdata[i][j]) >= this.calculateMax) {
				this.calculateMax = 1 * (m_seriesdata[i][j]);
			}
			if (1 * (m_seriesdata[i][j]) <= this.calculateMin) {
				this.calculateMin = 1 * (m_seriesdata[i][j]);
			}
		}
	}
};

/** @Description  method used for initialize Candles. **/
CandleStickChart.prototype.initializeCandles = function (lineColor) {
	for (var i = 0; i < this.m_yPixelArray.length; i++) {
		this.m_candlesArray[i] = new Candles();
		this.m_candlesArray[i].init(this.m_xPixelArray[i], this.m_yPixelArray[i], this.m_candleWidth, this.m_candleHeightArray[i], this.m_linePixelArray[i], this.m_candleColor[i], lineColor, this.ctx);
	}
};

/** @Description used to update SeriesData. **/
CandleStickChart.prototype.updateSeriesData = function (array) {
	var arr = [];
	if ((array != undefined && array !== null && array !== "") && array.length != 0)
		for (var i = 0; i < array[0].length; i++) {
			arr[i] = [];
			for (var j = 0; j < array.length; j++) {
				arr[i][j] = array[j][i];
			}
		}
	return arr;
};

/** @Description  iterate for all candles and draw which is is Range. **/
CandleStickChart.prototype.drawCandleChart = function () {
	for (var i = 0; i < this.m_yPixelArray.length; i++) {
		if (!this.isInRange(i))
			this.m_candlesArray[i].drawCandle();
	}
};

/** @Description  will check a point is in range or not. **/
CandleStickChart.prototype.isInRange = function (i) {
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
CandleStickChart.prototype.getLegendTableContent = function () {
	//over-ridden
	var legendTable = "";
	for (var i = 0; i < this.getLegendNames().length; i++) {
		var color = (i == 0) ? convertColorToHex(this.m_fillcolor) : convertColorToHex(this.m_declinefillcolor);
		legendTable += "<tr style=\"font-style:" + this.m_legendfontstyle + ";color:" + convertColorToHex(this.m_legendfontcolor) + ";text-decoration:" + this.m_legendtextdecoration + ";font-weight:" + this.m_legendfontweight + ";font-family:" + selectGlobalFont(this.m_legendfontfamily) + "\">"+
							"<td><span style=\"background-color:" + color + "; width:10px;height:10px;\"></span><span style=\"display:inline;\">" + this.getLegendNames()[i] + "</span></td></tr>";
	}
	return legendTable;
};

/** @Description  getter Method  for XPositionforToolTip . **/
CandleStickChart.prototype.getXPositionforToolTip = function () {
	var xPosArray = [];
	var xPosDataArray = this.m_candleCalculation.getxPixelArray();
	for (var n = 0; n < xPosDataArray.length; n++) {
		xPosArray.push(xPosDataArray[0][n]);
	}
	return xPosArray;
};

/** @Description  getter Method  for get data For Tooltip. **/
CandleStickChart.prototype.getToolTipData = function (mouseX, mouseY) {
	var toolTipData;
	if ((!IsBoolean(this.m_isEmptySeries)) && (IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")) & (!IsBoolean(this.isEmptyCategory))) {
		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			for (var i = 0; i < this.m_xPixelArray.length; i++) {
				if (mouseX <= (this.m_xPixelArray[i] * 1 + this.m_candleWidth * 1) && (mouseX >= this.m_xPixelArray[i] * 1)) {
					toolTipData = {};
					var seriesData = (this.getSeriesData());
					toolTipData.cat = "";
					toolTipData.color = "";
					toolTipData["data"] = new Array();
					toolTipData.cat = this.getCategoryData()[0][i];
					toolTipData.color = this.m_candleCalculation.getCandleColor()[i];
					for (var j = 0; j < this.getSeriesData().length; j++) {
						var data = [];
						var newVal;
						data[0] = this.m_fieldtypes[j];
						data[1] = this.getSeriesDisplayNames()[j];
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

						var FormterData = this.getFormatterForToolTip(newVal);
						data[2] = FormterData;
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

/** @Description  method for draw Tooltip for BoxPlotChart. **/
CandleStickChart.prototype.drawTooltip = function (mouseX, mouseY) {
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
CandleStickChart.prototype.drawTooltipContent=function(toolTipData){
	this.m_tooltip.draw(toolTipData, this.m_componenttype);
};

/** @Description Getter method for get DrillDataPoints. **/
CandleStickChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries)) {
		for (var i = 0; i < this.m_xPixelArray.length; i++) {
			if (mouseX <= (this.m_xPixelArray[i] * 1 + this.m_candleCalculation.getcandleWidth() * 1) && mouseX >= this.m_xPixelArray[i] * 1) {
				for (var j = 0; j < this.m_yPixelArray.length; j++) {
					if (mouseY <= this.getStartY() && mouseY >= Math.ceil(this.m_yPixelArray[j] * 1)) {
						var fieldNameValueMap = this.getDataProvider()[i];
						var drillColor = this.m_candleCalculation.getCandleColor()[i];
						return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
					}
				}
			}
		}
	}
};

/** @Description Constructor method for CandleStickCalculation. **/
function CandleStickCalculation() {
	this.m_xAxisPixelArray = [];
	this.m_yAxisPixelArray = [];
	this.m_max = 0;
	this.m_candleGap;
	this.m_numberOfMarkers = 6;
	this.m_percentileValue;
	this.m_yAxisText;
	this.m_xpixelArray = [];
	this.m_ypixelArray = [];
	this.m_candleHeightArray = [];
	this.m_yAxisMarkersArray = [];
	this.m_linepixelArray = [];
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

/** @Description Method To Initialize CandleStickCalculation with initialization of some variable. **/
CandleStickCalculation.prototype.init = function (m_chart, m_categoryData, m_seriesData) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	var seriesData = convertArrayType(m_seriesData);
	this.m_globalCalculation = this.m_chart;
	this.m_xAxisData = m_categoryData;
	this.data = this.setDataForCandle(seriesData);

	this.m_yAxisData = this.data.candleHighdata;
	this.m_startX = this.m_globalCalculation.getStartX();
	this.m_startY = this.m_globalCalculation.getStartY();
	this.m_endX = this.m_globalCalculation.getEndX();
	this.m_endY = this.m_globalCalculation.getEndY();
	this.m_chartType = this.m_chart.getChartType();
	this.setDrawHeight();
	this.setDrawWidth();
	this.m_candleGap = 10;
	this.calculateCandleWidth();
	//  this.calculateMinMax() and this.calculateMaxMinValue(seriesData); these methods move to CandleStickChart class because we need min/max value for set startX.
	this.setRatio();
	this.setxPixelArray();
	this.setyPixelArray();
	this.setcandleHeightArray(seriesData, this.data);
	this.setlinePixelArray(this.m_lineData, this.data);
};

/** @Description Setter method for set Data For Candle. **/
CandleStickCalculation.prototype.setDataForCandle = function (m_seriesData) {
	var arrSeries = [];
	var arrseriesMin = [];
	var candlecolor = [];
	var declinefillcolor = convertColorToHex(this.m_chart.m_declinefillcolor);
	var fillcolor = convertColorToHex(this.m_chart.m_fillcolor);
	for (var i = 0; i < m_seriesData.length; i++) {
		if ((m_seriesData[i][3]) * 1 > (m_seriesData[i][2]) * 1) {
			arrSeries.push(m_seriesData[i][3] * 1);
			arrseriesMin.push(m_seriesData[i][2] * 1);
			candlecolor.push(declinefillcolor);
		} else {
			arrSeries.push(m_seriesData[i][2] * 1);
			arrseriesMin.push(m_seriesData[i][3] * 1);
			candlecolor.push(fillcolor);
		}
	}
	this.m_lineData = this.setDataForCandleLine(m_seriesData);
	this.m_candleColor = candlecolor;
	return {
		candleHighdata : arrSeries,
		candleLowdata : arrseriesMin
	};
};

/** @Description Setter method for set Data For CandleLine. **/
CandleStickCalculation.prototype.setDataForCandleLine = function (m_seriesData) {
	//h l c o
	var linearr = [];
	for (var i = 0; i < m_seriesData.length; i++) {
		linearr[i] = [];
		if (m_seriesData[i][2] > m_seriesData[i][3]) {
			linearr[i][0] = (m_seriesData[i][0]);
			linearr[i][1] = (m_seriesData[i][1]);
		} else {
			linearr[i][0] = (m_seriesData[i][0]);
			linearr[i][1] = (m_seriesData[i][1]);
		}
	}
	return linearr;
};

/** @Description initialize initGlobalCalculation with some chart information. **/
CandleStickCalculation.prototype.initGlobalCalculation = function (m_chart) {
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

/** @Description method will return the minimum value of Chart. **/
CandleStickCalculation.prototype.minValue = function () {
	return this.m_chart.min;
};

/** @Description method will return the maximum value of Chart. **/
CandleStickCalculation.prototype.getMaxValue = function () {
	return this.m_chart.max;
};

/** @Description method will return the pixel Ratio . **/
CandleStickCalculation.prototype.getRatio = function () {
	return this.ratio;
};

/** @Description method will set the pixel Ratio . **/
CandleStickCalculation.prototype.setRatio = function () {
	var diff = this.getMaxValue() - this.minValue();
	if (diff > 0)
		this.ratio = this.getDrawHeight() / (diff);
	else
		this.ratio = 1;
};

/** @Description Getter method of DrawHeight. **/
CandleStickCalculation.prototype.getDrawHeight = function () {
	return this.drawHeight;
};

/** @Description Setter method of DrawHeight. **/
CandleStickCalculation.prototype.setDrawHeight = function () {
	this.drawHeight = (this.m_startY - this.m_endY);
};

/** @Description Getter method of DrawWidth. **/
CandleStickCalculation.prototype.getDrawWidth = function () {
	return this.drawWidth;
};

/** @Description Setter method of DrawWidth. **/
CandleStickCalculation.prototype.setDrawWidth = function () {
	this.drawWidth = 1 * (this.m_endX) - 1 * (this.m_startX);
};

/** @Description Method for calculate the CandleWidth. **/
CandleStickCalculation.prototype.calculateCandleWidth = function () {
	var numberOfCandle = this.m_xAxisData.length;
	var totalGap = (1 * (numberOfCandle) + 1) * this.m_candleGap;
	var availableDrawWidth = (this.getDrawWidth() * 1 - totalGap * 1);
	var candleWidth = (availableDrawWidth / numberOfCandle);
	if (candleWidth > 40) {
		this.setCandleWidth(40);
		this.setCandleGap(40);
	} else if (candleWidth < 9) {
		this.setCandleWidth(9);
		this.setCandleGap(9);
	} else {
		this.setCandleWidth(candleWidth);
	}
};

/** @Description Getter method of xPixelArray. **/
CandleStickCalculation.prototype.getxPixelArray = function () {
	return this.m_xPixelArray;
};

/** @Description Setter method of xPixelArray. **/
CandleStickCalculation.prototype.setxPixelArray = function () {
	var m_xAxisPixelArray = [];
	for (var i = 0; i < this.m_yAxisData.length; i++) {
		m_xAxisPixelArray[i] = (this.m_startX) * 1 + (this.getcandleWidth() * 1) * i + (this.getcandleGap() / 2) + (this.getcandleGap() * 1) * (i);
	}
	this.m_xPixelArray = m_xAxisPixelArray;
};

/** @Description Getter method of yPixelArray. **/
CandleStickCalculation.prototype.getyPixelArray = function () {
	return this.m_ypixelArray;
};

/** @Description Setter method of yPixelArray. **/
CandleStickCalculation.prototype.setyPixelArray = function () {
	var yparray = [];
	for (var i = 0; i < this.m_yAxisData.length; i++) {
		if (this.m_yAxisData[i] >= this.max)
			this.m_yAxisData[i] = this.max;
		var ratio = this.getRatio();
		if (IsBoolean(this.m_chart.isAxisSetup()) && (!IsBoolean(this.m_chart.isBaseZero()))) {
			yparray[i] = ((this.m_startY) - ((ratio * (this.m_yAxisData[i]))) + (ratio) * this.minValue());
		} else {
			if (IsBoolean(this.m_chart.isBaseZero())) {
				yparray[i] = ((this.m_startY) - (ratio * (this.m_yAxisData[i])));
			} else {
				yparray[i] = ((this.m_startY) - (ratio * (this.m_yAxisData[i])) + (ratio) * this.minValue());
			}
		}
	}
	this.m_ypixelArray = yparray;
};

/** @Description Getter method of candleHeightArray. **/
CandleStickCalculation.prototype.getcandleHeightArray = function () {
	return this.m_candleHeightArray;
};

/** @Description Setter method for set the candleHeightArray. **/
CandleStickCalculation.prototype.setcandleHeightArray = function (seriesdata, data) {
	var candleHeightArray = [];
	for (var i = 0; i < data.candleHighdata.length; i++) {
		var ratio = this.getRatio();
		var candlehigh = data.candleHighdata[i];
		var candlelow = data.candleLowdata[i];
		if (candlehigh >= this.max)
			candlehigh = this.max;
		if (candlelow <= this.min)
			candlelow = this.min;

		var candleheight = 0;
		if (candlelow <= candlehigh && candlehigh != this.min && candlelow != this.max) {
			candleheight = (candlehigh - candlelow);
			if (candleheight != 0)
				candleHeightArray[i] = Math.abs(candleheight * ratio);
			else
				candleHeightArray[i] = ((this.getMaxValue() * 1) / 100) * ratio;
		} else {
			candleHeightArray[i] = 0;
		}
	}
	this.m_candleHeightArray = candleHeightArray;
};

/** @Description Getter method of LinePixelArray. **/
CandleStickCalculation.prototype.getLinePixelArray = function () {
	return this.m_linePixelArray;
};

/** @Description Getter method of CandleColor. **/
CandleStickCalculation.prototype.getCandleColor = function () {
	return this.m_candleColor;
};

/** @Description Setter method for set the linePixelArray. **/
CandleStickCalculation.prototype.setlinePixelArray = function (arrline, data) {
	var linePixelArray = [];
	var updatelinedata = this.updateCandleLinedata(arrline, data.candleHighdata, data.candleLowdata);
	arrline = updatelinedata;
	for (var i = 0; i < arrline.length; i++) {
		linePixelArray[i] = [];
		for (var j = 0; j < arrline[i].length; j++) {
			var ratio = this.getRatio();
			if (IsBoolean(this.m_chart.isAxisSetup()) && (!IsBoolean(this.m_chart.isBaseZero()))) {
				linePixelArray[i][j] = (this.m_startY) - (arrline[i][j] * ratio) + (ratio) * this.minValue();
			} else {
				var newline = arrline[i][j];
				if (j == 1) {
					if ((arrline[i][1] >= this.max * 1))
						newline = this.max * 1;
				} else if (j == 3) {
					if ((arrline[i][3] <= this.min * 1))
						newline = this.min * 1;
				}
				if (IsBoolean(this.m_chart.isBaseZero())) {
					if (j == 1 || j == 3)
						linePixelArray[i][j] = (this.m_startY) - (newline * ratio);
					else
						linePixelArray[i][j] = (this.m_startY) - (arrline[i][j] * ratio);
				} else {
					if (j == 1 || j == 3)
						linePixelArray[i][j] = (this.m_startY) - (newline * ratio) + (ratio) * this.minValue();
					else
						linePixelArray[i][j] = (this.m_startY) - (arrline[i][j] * ratio) + (ratio) * this.minValue();
				}
			}
		}
	}
	this.m_linePixelArray = linePixelArray;
};

/** @Description method will return the updated  CandleLinedata. **/
CandleStickCalculation.prototype.updateCandleLinedata = function (highlowvalue, topvalue, downvalue) {
	var high = highlowvalue;
	var close = topvalue;
	var open = downvalue;
	var arr = [];
	for (var i = 0; i < close.length; i++) {
		arr[i] = [];
		var candlehigh = close[i];
		var candlelow = open[i];
		if (candlehigh >= this.max)
			candlehigh = this.max;
		if (candlelow <= this.min)
			candlelow = this.min;
		else if (candlelow > high[i][1] * 1 && candlelow > this.max)
			candlelow = high[i][1] * 1;

		var highlinepoint = high[i][0] * 1;
		var lowlinepoint = high[i][1] * 1;

		if (highlinepoint > this.max)
			highlinepoint = this.max;
		else if (highlinepoint < this.min)
			highlinepoint = this.min;

		if (lowlinepoint > this.max)
			lowlinepoint = this.max;
		else if (lowlinepoint < this.min)
			lowlinepoint = this.min;

		arr[i][0] = candlehigh;
		arr[i][1] = highlinepoint;
		arr[i][2] = candlelow;
		arr[i][3] = lowlinepoint;
	}
	return arr;
};

/** @Description Getter method of  YAxisMarkersArray. **/
CandleStickCalculation.prototype.getYAxisMarkersArray = function () {
	return this.m_chart.m_yAxisMarkersArray;
};

/** @Description Getter method of  YAxisText. **/
CandleStickCalculation.prototype.getYAxisText = function () {
	return this.m_chart.m_yAxisText;
};

/** @Description Getter method of  CandleWidth. **/
CandleStickCalculation.prototype.getcandleWidth = function () {
	return this.candleWidth;
};

/** @Description Setter method of  CandleWidth. **/
CandleStickCalculation.prototype.setCandleWidth = function (candlewidth) {
	this.candleWidth = candlewidth;
};

/** @Description Getter method of  candleGap. **/
CandleStickCalculation.prototype.getcandleGap = function () {
	return this.m_candleGap;
};

/** @Description Setter method of  CandleGap. **/
CandleStickCalculation.prototype.setCandleGap = function (candleWidth) {
	var totalCandlewidth = candleWidth * this.m_xAxisData.length;
	var totalGap = this.getDrawWidth() - totalCandlewidth;
	this.m_candleGap = totalGap / (this.m_xAxisData.length);
};

function Candles() {
	this.m_xPixel = [];
	this.m_yPixelArray = [];
	this.m_candleHeightArray = [];
	this.m_candleWidth = [];
	this.m_linePixelArray = [];
	this.m_candleColor = "";
	this.m_strokeColor = "";
	this.ctx = "";
};

/** @Description initialize the BoxCandles and assign argument value to variables. **/
Candles.prototype.init = function (xPixel, yPixelArray, candleWidth, candleHeightArray, linePixelArray, candleColor, strokecolor, ctx) {
	this.ctx = ctx;
	this.m_xPixel = xPixel;
	this.m_yPixelArray = yPixelArray;
	this.m_candleWidth = candleWidth;
	this.m_candleHeightArray = candleHeightArray;
	this.m_linePixelArray = linePixelArray;
	this.m_candleColor = candleColor;
	this.m_strokeColor = strokecolor;
};

/** @Description method for draw the CandlesStick. **/
Candles.prototype.drawCandles = function () {
	for (var i = 0; i < this.m_yPixelArray.length; i++) {
		this.drawCandle(this.m_xPixel[i] * 1, this.m_yPixelArray[i] * 1, this.m_candleWidth * 1, this.m_candleHeightArray[i] * 1);
	}
};

/** @Description method for draw the Candle on Canvas. **/
Candles.prototype.drawCandle = function () {
	this.drawline();
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.fillStyle = this.m_candleColor;
	this.ctx.rect(this.m_xPixel, this.m_yPixelArray, this.m_candleWidth, this.m_candleHeightArray);
	this.ctx.fill();
	this.ctx.strokeStyle = this.m_strokeColor; //"#FF8D70";
	this.ctx.stroke();
	this.ctx.restore();
	this.ctx.closePath();
};

/** @Description method for draw the Line on Canvas. **/
Candles.prototype.drawline = function () {
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
//# sourceURL=CandleStickChart.js
