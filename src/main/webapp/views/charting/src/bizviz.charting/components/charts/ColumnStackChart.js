/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: ColumnStackChart.js
 * @description ColumnStackChart
 **/
function ColumnStackChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();
	this.m_x = 400;
	this.m_y = 20;
	this.m_width = 300;
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
	this.m_valueTextSeries = {};
	this.m_calculation = new ColumnCalculation();
	this.m_seriesVisiblityPosition;
	this.m_showpercentvalue = false;
	this.m_showmarkingorpercentvalue = false;
	this.noOfRows = 1; //used for set x-axis text into two rows in non tilted case.
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	/** Creating object of X Axis and Y Axis**/
	this.m_xAxis = new Xaxis();
	this.m_yAxis = new Yaxis();
	this.m_maxbarwidth = 40;
	this.enableDrillHighlighter = false;
	this.m_drilltoggle = true;
};

/** @description Making prototype of chart class to inherit its properties and methods into Column Stack chart **/
ColumnStackChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
ColumnStackChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
ColumnStackChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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
						for (var i = 0, length = ConditionalColorArray.length; i < length ; i++) {
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
ColumnStackChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description Getter for category field names **/
ColumnStackChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};

/** @description Getter for category field Display Name **/
ColumnStackChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

/** @description Setter for Start X **/
ColumnStackChart.prototype.setStartX = function () {
	this.yaxisLabelFont = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
	this.yaxisDescriptionFont = this.m_yAxis.m_fontstyle + " " + this.m_yAxis.m_fontweight + " " + this.fontScaling(this.m_yAxis.m_fontsize) + "px " + selectGlobalFont(this.m_yAxis.m_fontfamily);
	var btdm = this.getBorderToDescriptionMargin();
	var dm = this.getYAxisDescriptionMargin();
	var dtlm = this.getDescriptionToLabelMargin();
	var ltam = this.getLabelToAxisMargin();
	//this.setMaxMinSeriesValue();
	var lm = this.getYAxisLabelMargin();
	this.m_startX = this.m_x * 1 + btdm * 1 + dm * 1 + dtlm * 1 + lm * 1 + ltam * 1;
};

/** @description Calculating Y Axis Label Margin and returning margin value **/
ColumnStackChart.prototype.getYAxisLabelMargin = function () {
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
ColumnStackChart.prototype.getLabelFormatterMargin = function () {
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
ColumnStackChart.prototype.getLabelWidth = function () {
	return this.m_labelwidth;
};

/** @description Adding formatter in y Axis markers and calculating largest width of the marker and setting into global variable this.m_labelwidth**/
ColumnStackChart.prototype.setLabelWidth = function() {
    this.m_labelwidth = 0;
    var maxSeriesVals = [];
    if (this.fontScaling(this.m_yAxis.m_labelfontsize) > 0) {
        for (var i = 0; i < this.m_yAxisMarkersArray.length; i++) {
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
                    if (maxSeriesVal !== 0) {
                        if (this.m_precision !== "default")
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
ColumnStackChart.prototype.getLabelSignMargin = function () {
	var lsm = 0;
	var msvw = 0;
	var minSeriesValue =this.min;// this.getMinimumSeriesValue();
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
ColumnStackChart.prototype.getLabelPrecisionMargin = function () {
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
ColumnStackChart.prototype.getLabelSecondFormatterMargin = function () {
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
ColumnStackChart.prototype.getFormatterMargin = function () {
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
ColumnStackChart.prototype.setEndX = function () {
	var blm = this.getBorderToLegendMargin();
	var vlm = this.getVerticalLegendMargin();
	var vlxm = this.getVerticalLegendToXAxisMargin();
	var rightSideMargin = blm * 1 + vlm * 1 + vlxm * 1;
	this.m_endX = (this.m_x * 1 + this.m_width * 1 - rightSideMargin * 1);
};

/** @description Setter for Start Y**/
ColumnStackChart.prototype.setStartY = function () {
	var cm = this.getChartMargin();
	var xlbm = this.getXAxisLabelMargin();
	var xdm = this.getXAxisDescriptionMargin();
	var bottomMargin = cm * 1 + xlbm * 1 + xdm * 1;
	this.m_startY = (this.m_y * 1 + this.m_height * 1 - bottomMargin * 1);
};

/** @description Calculating X Axis Label Margin, X Axis will contain the Category Values**/
ColumnStackChart.prototype.getXAxisLabelMargin = function () {
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
ColumnStackChart.prototype.setNoOfRows = function () {
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
ColumnStackChart.prototype.setEndY = function () {
	if(this.m_chartbase == "rectangle"){
		this.m_endY = (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1 + this.getSpaceForShowText() * 1);
	    var x = this.m_height - this.m_startY;
		this.m_endY = this.m_endY = (this.m_height*1 <= 600)?this.m_endY + x/4:this.m_endY + x/4 + this.m_stackWidth/4;
	}else{
		this.m_endY = (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1 + this.getSpaceForShowText() * 1);
	}
};

/** @description Calculating text space for subtitle Text**/
ColumnStackChart.prototype.getSpaceForShowText = function () {
	if (((IsBoolean(this.getCounterFlagForSeriesVisiblity())) && IsBoolean(this.m_showmarkingorpercentvalue)) && (IsBoolean(this.m_subTitle.m_showsubtitle) || IsBoolean(this.getShowGradient())))
		return 15;
	else
		return 0;
};

/** @description Calculating Series Visibility and returning is any series is visible or not**/
ColumnStackChart.prototype.getCounterFlagForSeriesVisiblity = function () {
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
ColumnStackChart.prototype.setFields = function (fieldsJson) {
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
ColumnStackChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryFieldColor = [];
	this.m_categoryDisplayNames = [];
	this.m_allCategoryNames = [];
	this.m_allCategoryDisplayNames = [];
	this.m_categoryVisibleArr = {};
	var count = 0;
	// only one category can be set for line chart, preference to first one
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
ColumnStackChart.prototype.setSeries = function (seriesJson) {
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
		// for automanupulator "visible" not there so i (suraj) set default true.
		// suraj , this is not correct to add here... update the json in datamanager and add required fields
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
			this.m_plotTrasparencyArray[count] = (transparency != undefined && transparency !== null && transparency !== "") ? transparency : 1;
			var tempMap = {
				"seriesName" : this.m_seriesNames[count],
				"displayName" : this.m_seriesDisplayNames[count],
				"color" : this.m_seriesColors[count],
				"shape" : "cube",
				"index": count
			};
			this.legendMap[this.m_seriesNames[count]] = tempMap;
			count++;
		}
	}
	this.setLegendsIntialLoad(this.m_defaultlegendfields);
};

/** @description Getter for Legend info**/
ColumnStackChart.prototype.getLegendInfo = function () {
	return this.legendMap;
};

/** @description Getter for all series Names**/
ColumnStackChart.prototype.getAllSeriesNames = function () {
	return this.m_allSeriesNames;
};

/** @description Getter for All Category names **/
ColumnStackChart.prototype.getAllCategoryNames = function () {
	return this.m_allCategoryNames;
};

/** @description Getter for visible series names**/
ColumnStackChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};

/** @description Getter for Series DisplayName**/
ColumnStackChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};

/** @description Getter for Series Color**/
ColumnStackChart.prototype.getSeriesColors = function () {
	return this.m_seriesColors;
};

/** @description Setter for Legend Names**/
ColumnStackChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};

/** @description Getter for Legend Names**/
ColumnStackChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};

/** @description Setting all fields Name into single array**/
ColumnStackChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0, length = this.getAllCategoryNames().length; i < length; i++) {
		this.m_allfieldsName.push(this.getAllCategoryNames()[i]);
	}
	for (var j = 0, length = this.getAllSeriesNames().length; j < length; j++) {
		this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
	}
};

/** @description Getter for All Field Name**/
ColumnStackChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

/** @description Setter for All field display Name into single array**/
ColumnStackChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0, length = this.getCategoryDisplayNames().length; i < length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0, length = this.getSeriesDisplayNames().length; j < length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

/** @description Getter for All Field Display Name**/
ColumnStackChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

/** @description Setter for category Data**/
ColumnStackChart.prototype.setCategoryData = function () {
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
ColumnStackChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

/** @description Setter for Series Data**/
ColumnStackChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	this.m_ShowToolTipData = [];
	for (var i = 0, length = this.getSeriesNames().length; i < length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
		this.m_ShowToolTipData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
};

/** @description Getter for Series Data**/
ColumnStackChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

/** @description Getter for series tooltip data**/
ColumnStackChart.prototype.getSeriesToolTipData = function () {
	return this.m_ShowToolTipData;
};

/** @description Setter for series color**/
ColumnStackChart.prototype.setSeriesColor = function (m_seriesColor) {
	this.m_seriesColor = m_seriesColor;
};

/** @description Getter for Series color**/
ColumnStackChart.prototype.getSeriesColor = function () {
	return this.m_seriesColor;
};

/** @description Chart Data,Chart Frame,XAxis,YAxis initialization **/
ColumnStackChart.prototype.init = function () {
	this.setCategoryData();
	this.setSeriesData();
	this.setAllFieldsName();
	this.setAllFieldsDisplayName();
	this.isSeriesDataEmpty();
	this.setShowSeries(this.getAllFieldsName());
	this.updateSeriesDataWithCommaSeperators();
	this.visibleSeriesInfo=this.getVisibleSeriesData(this.getSeriesData());
	
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

/** @description Update Series Data With Comma Seperators**/
ColumnStackChart.prototype.updateSeriesDataWithCommaSeperators = function () {
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
ColumnStackChart.prototype.getUpdateSeriesDataWithCategory = function (arr) {
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
ColumnStackChart.prototype.setPercentageForHundred = function () {
	var serData = this.getUpdateSeriesDataWithCategory(this.visibleSeriesInfo.seriesData);
	this.m_SeriesDataInPerForHundredChart;
	this.m_SeriesDataInPerForHundredChartForToolTip; //Added this array for tooltip for 100%
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
		this.m_SeriesDataInPerForHundredChartForToolTip = this.getUpdateSeriesDataForHundredPercentageChart(updateValue);
};

/** @description Getter for percent data for hundred percent chart**/
ColumnStackChart.prototype.getUpdateSeriesDataForHundredPercentageChart = function (arr) {
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
ColumnStackChart.prototype.getArraySUM = function (arr) {
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
ColumnStackChart.prototype.getPercentageForHundred = function () {
	return this.m_SeriesDataInPerForHundredChart;
};

/** @description Getter for Hundred Percent chart tooltip percentage**/
ColumnStackChart.prototype.getPercentageForHundredForToolTip = function () {
	return this.m_SeriesDataInPerForHundredChartForToolTip;
};

/** @description Drawing of Chart Frame,Title,SubTitle,XAxis,YAxis,Legends and chart**/
ColumnStackChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	var map = this.IsDrawingPossible();
	if (IsBoolean(map.permission)) {
		this.drawXAxis();
		this.drawYAxis();
		this.drawColumnChart();
		this.drawDataLabel();
	} else {
		this.drawMessage(map.message);
	}
};

/** @description Chart calculation initialization**/
ColumnStackChart.prototype.initializeCalculation = function () {
	this.calculateMaxValue();
	this.calculateFinalMinMax();
	this.setChartDrawingArea();
	var categoryData = this.updateCategoryData(this.m_categoryData);
    this.setSeriesDataLabel();
	this.m_calculation.init(this, categoryData, this.m_seriesData);
	this.m_xPixelArray = this.m_calculation.getxPixelArray();
	this.m_yPixelArray = this.m_calculation.getyPixelArray();
	this.m_stackWidth = this.m_calculation.getBarWidth();
	this.m_stackHeightArray = this.m_calculation.getstackHeightArray();

	if ((IsBoolean(this.getCounterFlagForSeriesVisiblity())) && IsBoolean(this.m_showmarkingorpercentvalue)) {
		this.m_percentageArray = IsBoolean(this.m_showpercentvalue) ? (IsBoolean(this.getCheckedAllPosContainigZero()) ? (this.getPercentage()) : (this.getRoundValue(this.getPercentage(), 100))) : (this.getPercentage());
		this.m_showPerCentageFlag = true;
	}
	this.setColorsForSeries();
	this.settransparency();
	this.initializeColumns();
};

/** @description Calculating Max Value from the series data on the basis of selected chart type in Column chart**/
ColumnStackChart.prototype.calculateMaxValue = function () {
	this.m_chartType=this.getChartType();
	var yAxisData = this.visibleSeriesInfo.seriesData;
	if (this.m_chartType.toLowerCase() == "clustered" || this.m_chartType.toLowerCase() == "overlaid") {
		this.calculateMax = 0;
		this.calculateMin = 0;
		var data = [];
		for (var i = 0, k = 0, length = yAxisData.length; i < length; i++) {
			for (var j = 0, innerlength = yAxisData[i].length; j < innerlength; j++) {
				if (!isNaN(yAxisData[i][j] * 1)) {
				    data[k++] = (yAxisData[i][j]);
				}
			}
		}
		var sortedData = data.sort(numOrdA);
		this.calculateMin = sortedData[0];
		for (i = 0, length = yAxisData.length; i < length; i++) {
			for (j = 0, innerlength = yAxisData[i].length; j < innerlength; j++) {
				if (1 * (yAxisData[i][j]) >= this.calculateMax) {
					this.calculateMax = 1 * (yAxisData[i][j]);
				}
				if (1 * (yAxisData[i][j]) <= this.calculateMin) {
					this.calculateMin = 1 * (yAxisData[i][j]);
				}
			}
		}
	}
	if (this.m_chartType.toLowerCase() == "stacked" || this.m_chartType == "") {
		this.calculateMax = 0;
		this.calculateMin = 0;
		var data = [];
		for (var i = 0, k = 0, length = yAxisData[0].length; i < length; i++) {
			var height = 0;
			var negHeight = 0;
			for (var j = 0, innerlength = yAxisData.length; j < innerlength; j++) {
				data[k++] = (yAxisData[j][i] * 1);
				if (yAxisData[j][i] * 1 > 0) {
					height = (height) * 1 + (yAxisData[j][i] * 1) * 1;
				} else {
					negHeight = (yAxisData[j][i] * 1) * 1 + (negHeight) * 1;
				}
			}
			if ((height) >= (this.calculateMax)) {
				this.calculateMax = height * 1;
			}
			if ((negHeight * 1) < (this.calculateMin)) {
				this.calculateMin = negHeight * 1;
			}
		}
	}
	if (this.m_chartType == "100%" ) {
		var negFlag = false;
		for (var i = 0, length = yAxisData.length; i < length; i++) {
			for (var j = 0, innerlength = yAxisData[i].length; j < innerlength; j++) {
				if (yAxisData[i][j] < 0) {
					negFlag = true;
					break;
				}
			}
		}
		this.calculateMax = 100;
		this.calculateMin = (IsBoolean(negFlag)) ? -100 : 0;
	}
};

/** @Description used calculated  Min/Max value and get required ScaleInfo of The Axis **/
ColumnStackChart.prototype.calculateFinalMinMax = function () {
	var calculatedMin = this.calculateMin;
	var calculatedMax = this.calculateMax;

	var obj=this.getCalculateNiceScale(calculatedMin,calculatedMax,this.m_basezero,this.m_autoaxissetup,this.m_minimumaxisvalue,this.m_maximumaxisvalue,(this.m_height));
	this.min=obj.min;
	this.max=obj.max;
	this.yAxisNoOfMarker=obj.markerArray.length;
	this.yAxisText=obj.step;
	this.m_yAxisMarkersArray=obj.markerArray;
};




/** @description Checking, is all series data value contains zero**/
ColumnStackChart.prototype.getCheckedAllPosContainigZero = function () {
	var flag = true;
	for (var i = 0, length = this.m_seriesData[this.m_seriesVisiblityPosition].length; i < length; i++) {
		if (this.m_seriesData[this.m_seriesVisiblityPosition][i] != 0)
			flag = false;
	}
	return flag;
};

/** @description Calculating percentage of data**/
ColumnStackChart.prototype.getPercentage = function () {
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
ColumnStackChart.prototype.getSumOfSeriesData = function () {
	var sum = 0;
	for (var i = 0, length = this.m_seriesData[this.m_seriesVisiblityPosition].length; i < length; i++) {
		sum = sum * 1 + this.m_seriesData[this.m_seriesVisiblityPosition][i] * 1;
	}
	return sum;this.m_valueTextSeries
};

/** @description added below method for supporting drill highlighter enhancment**/
ColumnStackChart.prototype.settransparency=function(){
	this.m_transparencyarr = {};
	for(var a=0;a<this.m_seriesNames.length;a++){
		this.m_transparencyarr[this.m_seriesNames[a]]=[];
		for(var b=0;b<this.m_seriesData[0].length;b++){
			this.m_transparencyarr[this.m_seriesNames[a]][b] = this.m_plotTrasparencyArray[a];
		}
	}
}

/** @description Creating object of Columns class and initializing the values**/
ColumnStackChart.prototype.initializeColumns = function() {
    if (this.m_charttype == "clustered") {
        this.m_stackWidth = this.m_stackWidth * this.clusteredbarpadding;
    }
    for (var i = 0, k = 0, length = this.m_seriesNames.length; i < length; i++) {
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
            this.m_columnsArray[this.m_seriesNames[i]] = new Columns();
            this.m_columnsArray[this.m_seriesNames[i]].init(this.m_xPixelArray[k], this.m_yPixelArray[k], this.m_stackWidth, this.m_stackHeightArray[k], this.m_percentageArray, this.getColorsForSeries()[k], this.m_strokecolor, this.m_showgradient, this.m_showPerCentageFlag, this.m_showpercentvalue, this.m_transparencyarr[this.m_seriesNames[i]], this);//this.m_plotTrasparencyArray[i]
            if ((this.m_charttype.toLowerCase() == "overlaid") || IsBoolean(this.m_seriesDataLabelProperty[i].showDataLabel)) {
                this.m_valueTextSeries[this.m_seriesNames[i]] = new ValueTextSeries();
                var datalabelProp = (this.m_charttype.toLowerCase() == "overlaid") ? this.m_seriesDataLabelPropertyOverlaid[k] : this.m_seriesDataLabelProperty[i];
                var dataActual = (this.m_charttype.toLowerCase() == "overlaid") ? this.m_calculation.m_yAxisData[k] : this.m_seriesData[i];
                this.m_valueTextSeries[this.m_seriesNames[i]].init(this.m_xPixelArray[k], this.m_yPixelArray[k], this, this.m_seriesDataForDataLabel[k], datalabelProp, dataActual, this.m_stackWidth, this.m_stackHeightArray[k], this.m_shortname);
            };
            k++;
        }
    }
};
/** @description set series data for data label**/
ColumnStackChart.prototype.setSeriesDataLabel = function() {
    this.m_seriesDataForDataLabel = [];
    this.m_seriesDataLabelPropertyOverlaid = [];
    for (var k = 0, length = this.getDataProvider().length; k < length; k++) {
        var record = this.getDataProvider()[k];
        for (var j = 0, l = 0, serlength = this.getSeriesNames().length; j < serlength; j++) {
            if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[j]])) {
                if (!this.m_seriesDataForDataLabel[l]) {
                    this.m_seriesDataForDataLabel[l] = [];
                }
                this.m_seriesDataLabelPropertyOverlaid[l] = this.m_seriesDataLabelProperty[j];
                var dataFordatalabel = this.getValidFieldDataFromRecord(record, this.m_seriesDataLabelProperty[j].datalabelField);
                this.m_seriesDataForDataLabel[l][k] = dataFordatalabel;
                l++;
            }

        }
    }
};
/** @description Getter for series color which will be used for column**/
ColumnStackChart.prototype.getSeriesColorforColumn = function (pos) {
	var sercolor = this.getSeriesColors();
	var temparr = [];
	for (var i = 0, length = this.m_seriesData[pos].length; i < length; i++) {
		temparr.push(sercolor[pos]);
	}
	return temparr;
};

/** @description Getter for All Series color**/
ColumnStackChart.prototype.getColorsForSeries = function () {
	return this.m_seriesColorsArray;
};

/** @description Creating this.m_seriesColorsArray and storing color according to the selected chart type**/
ColumnStackChart.prototype.setColorsForSeries = function () {
	this.m_seriesColorsArray = [];
	if (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) {
		for (var i = 0, length = this.visibleSeriesInfo.seriesData.length; i < length; i++) {
			this.m_seriesColorsArray[i] = [];
			for (var j = 0, innerlength = this.visibleSeriesInfo.seriesData[i].length; j < innerlength; j++) {
				this.m_seriesColorsArray[i][j] = this.m_drillColor;
			}
		}
	}/* else if ((this.m_charttype == "overlaid" || this.m_charttype == "Overlaid")) {
		this.m_seriesColorsArray = this.m_calculation.getSeriesColorForOverlaid();
	}*/else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && this.getCategoryColors().getCategoryColor().length > 0 && IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName())) {
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
		for (var i = 0; i < this.visibleSeriesInfo.seriesData.length; i++) {
			this.m_seriesColorsArray[i] = [];
			for (var j = 0, innerlength = this.visibleSeriesInfo.seriesData[i].length; j < innerlength; j++) {
				this.m_seriesColorsArray[i][j] = seriesColors[i];
			}
		}
	}
};

/** @description Category data array transformation**/
ColumnStackChart.prototype.updateCategoryData = function (array) {
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
ColumnStackChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description Initialization of Draggable Div and Canvas**/
ColumnStackChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/** @description Drawing of Title**/
ColumnStackChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

/** @description Drawing of Subtitle**/
ColumnStackChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

/** @description Drawing of XAxis line and XAxis markers**/
ColumnStackChart.prototype.drawXAxis = function () {
	this.m_xAxis.drawTickMarks();
	this.m_xAxis.drawVerticalLine();
	this.m_xAxis.markXaxis();
	this.m_xAxis.drawXAxis();
};

/** @description Drawing of Y Axis line and Y Axis Markers**/
ColumnStackChart.prototype.drawYAxis = function () {
	if (IsBoolean(this.m_showmarkerline))
		this.m_yAxis.horizontalMarkerLines();
	if (IsBoolean(this.m_zeromarkerline) && !IsBoolean(this.m_basezero) && IsBoolean(this.m_yAxis.hasNegativeAxisMarker(this.m_yAxisMarkersArray)))
		this.m_yAxis.zeroMarkerLine();
	this.m_yAxis.markYaxis();
	this.m_yAxis.drawYAxis();
};

/** @description drawing of Chart Frame**/
ColumnStackChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

/** @description drawing of column Chart**/
ColumnStackChart.prototype.drawColumnChart = function () {
	for (var i = 0, length = this.visibleSeriesInfo.seriesName.length; i < length; i++) {
		this.m_columnsArray[this.visibleSeriesInfo.seriesName[i]].drawColumns();
	}
};
/** @description drawing Data Label**/
ColumnStackChart.prototype.drawDataLabel = function() {
	this.m_overlappeddatalabelarrayX = [];
	this.m_overlappeddatalabelarrayY = [];
    for (var i = 0, length = this.m_seriesNames.length; i < length; i++) {
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
            if ((this.m_charttype.toLowerCase() == "overlaid") || IsBoolean(this.m_seriesDataLabelProperty[i].showDataLabel)) {
                this.m_valueTextSeries[this.m_seriesNames[i]].drawValueTextSeries();
            }
        }
    }
};
/** @description Putting All Bar X Position into one Array **/
ColumnStackChart.prototype.getXPositionforToolTip = function () {
	var xPosArray = [];
	var xPosDataArray = this.m_calculation.getxPixelArray();
	for (var n = 0, length = xPosDataArray[0].length; n < length; n++) {
		xPosArray.push(xPosDataArray[0][n]);
	}
	return xPosArray;
};

/** @description Calculating TooltTip Data according to selected chart type and return hover bar details **/
ColumnStackChart.prototype.getToolTipData = function (mouseX, mouseY) {
	var toolTipData;
	if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory) && IsBoolean(this.isVisibleSeries()) && IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")) {
		var newVal = "";
		var isNaNValue;
		var seriesData = this.getVisibleSeriesData(this.getSeriesToolTipData()).seriesData;//this.getSeriesToolTipData();
		var totalColumnWidth = this.m_calculation.getBarWidth() * this.m_xPixelArray.length;

		if ((this.m_charttype.toLowerCase() == "clustered") && (mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			this.xPositions = this.getXPositionforToolTip();
			for (var i = 0, length = this.xPositions.length; i < length; i++) {
				if (mouseX <= (this.xPositions[i] * 1 + totalColumnWidth * 1) && (mouseX >= this.xPositions[i] * 1)) {
					toolTipData = {};
					toolTipData.cat = "";
					toolTipData["data"] = new Array();
					toolTipData.cat = this.getCategoryData()[0][i];
					if (IsBoolean(this.m_customtextboxfortooltip.dataTipType == "Default")){
						for (var j = 0, k = 0, innerlength = seriesData.length; j < innerlength; j++) {
							isNaNValue = false;
								var data = [];
								//data[0] = this.visibleSeriesInfo.seriesColor[j];
								data[0] = {"color":this.getColorsForSeries()[j][i],"shape":this.legendMap[this.getSeriesNames()[j]].shape};
								data[1] =this.visibleSeriesInfo.seriesDisplayName[j];
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
								var FormterData = this.getUpdatedFormatterForToolTip(newVal, this.visibleSeriesInfo.seriesName[j]);
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
						toolTipData = this.getDataProvider()[i];
					}
				}
			}
		} else if (((this.m_charttype.toLowerCase() == "stacked"|| this.m_charttype.toLowerCase() == "")) && (mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			this.xPositions = this.getXPositionforToolTip();
			for (var i = 0, length = this.xPositions.length; i < length; i++) {
				if (mouseX <= (this.xPositions[i] * 1 + this.m_calculation.getBarWidth() * 1) && (mouseX >= this.xPositions[i] * 1)) {
					toolTipData = {};
					toolTipData.cat = "";
					toolTipData["data"] = new Array();
					toolTipData.cat = this.getCategoryData()[0][i];
					if (IsBoolean(this.m_customtextboxfortooltip.dataTipType == "Default")){
						for (var j = 0, k = 0, innerlength = seriesData.length; j < innerlength; j++) {
							isNaNValue = false;
								var data = [];
								//data[0] = this.visibleSeriesInfo.seriesColor[j];
								data[0] = {"color":this.getColorsForSeries()[j][i],"shape":this.legendMap[this.getSeriesNames()[j]].shape};
								data[1] =this.visibleSeriesInfo.seriesDisplayName[j];
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
								toolTipData.data[k] = data;
								k++;
						}
						toolTipData.highlightIndex = this.getDrillColor(mouseX, mouseY);
						if (IsBoolean(this.m_controlledtooltip)) {
							toolTipData = this.updateTooltipData(toolTipData);
						}
						break;
					}else{
						toolTipData = this.getDataProvider()[i];
					}
				}
			}
		} else if (((this.m_charttype.toLowerCase() == "overlaid") || (this.m_charttype == "100%")) && (mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			this.xPositions = this.getXPositionforToolTip();
			for (var i = 0, length = this.xPositions.length; i < length; i++) {
				if (mouseX <= (this.xPositions[i] * 1 + this.m_calculation.getBarWidth() * 1) && (mouseX >= this.xPositions[i] * 1)) {
					toolTipData = {};
					var percentageData = this.getPercentageForHundredForToolTip();
					toolTipData.cat = "";
					toolTipData["data"] = new Array();
					toolTipData.cat = this.getCategoryData()[0][i];
					var seriesData=this.visibleSeriesInfo.seriesData;
					if (IsBoolean(this.m_customtextboxfortooltip.dataTipType == "Default")){
						for (var j = 0, k = 0,l=0, innerlength = seriesData.length; j < innerlength; j++) {
							isNaNValue = false;
								var data = [];
								//data[0] = this.visibleSeriesInfo.seriesColor[j];
								data[0] = {"shape":this.legendMap[this.getSeriesNames()[j]].shape};
								/*Added to show drill color or indicator color in the tooltip*/
								if (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) {
									data[0]["color"] = (this.m_charttype == "overlaid") ?  this.m_drillColor : this.getColorsForSeries()[j][i];
								}else{
									data[0]["color"] = (this.m_charttype == "overlaid") ? this.visibleSeriesInfo.seriesColor[j] : this.getColorsForSeries()[j][i];
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
									/** ADDING CUMULATIVE PERCENTAGE FOR 100% chart **/
								    var cumpec = 0;
								       for(var n = 0; n <= j; n++){
									     if (!isNaN(percentageData[n][i]))
									    cumpec += percentageData[n][i];
								}
								if(IsBoolean(this.m_tooltipproperties.showcummulativesum)) {
										data[4] = this.getNumberWithCommas(cumSum);
									}
								      if(IsBoolean(this.m_tooltipproperties.showcummulativepercent)) {
									     data[5] =cumpec.toFixed(2) + "%";
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
					}else{
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

/** @description Getting Drill Bar Color**/
ColumnStackChart.prototype.getDrillColor = function (mouseX, mouseY) {
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory)))) {
		/**Added to resolve BDD-682 issue*/
		var drillMinStackHeight = (this.m_charttype == "stacked") ? 0 : this.m_drillminstackheight;
		if(IsBoolean(this.m_basezero)){
			var seriesData = this.getVisibleSeriesData(this.getSeriesToolTipData()).seriesData;
		}
	    for (var k = 0, length = this.m_xPixelArray.length; k < length; k++) {
	        for (var i = 0, innerlength = this.m_xPixelArray[k].length; i < innerlength; i++) {
	            if (mouseX <= (this.m_xPixelArray[k][i] * 1 + this.m_calculation.getBarWidth() * 1) && mouseX >= this.m_xPixelArray[k][i] * 1) {
	                if (this.m_charttype != "overlaid") {
	                    for (var j = 0, subInnerlength = this.m_yPixelArray.length; j < subInnerlength; j++) {
	                    	var stackHeight = 0;
	                    	if(!IsBoolean(this.m_basezero) && (Math.abs(this.m_stackHeightArray[j][i] * 1) < drillMinStackHeight)){
	                    		stackHeight = (this.m_stackHeightArray[j][i] * 1 < 0) ? drillMinStackHeight : -drillMinStackHeight;
	                    	}else if(IsBoolean(this.m_basezero)){
								stackHeight = (seriesData[j][i] * 1 < 0) ? 0 : - drillMinStackHeight;
							}
	                    		if (this.m_stackHeightArray[j][i] * 1 < 0) {
		                            var range1 = this.m_yPixelArray[j][i] * 1 + this.m_stackHeightArray[j][i] * 1 ;
		                            var range2 = this.m_yPixelArray[j][i] * 1 + stackHeight;
		                        }else if(isNaN(this.m_stackHeightArray[j][i] * 1 )){
							    	var range1 = this.getGarbageDrillPoints().range1;
							    	var range2 = this.getGarbageDrillPoints().range2;
							    } else {
		                            var range1 = this.m_yPixelArray[j][i] * 1 + stackHeight;
		                            var range2 = this.m_yPixelArray[j][i] * 1 + this.m_stackHeightArray[j][i] * 1 ;
		                        }
	                        
	                        if (mouseY <= range2 && mouseY >= range1) {
	                            if (this.m_charttype.toLowerCase() == "clustered") {
	                                if (mouseX <= (this.m_xPixelArray[j][i] * 1 + this.m_stackWidth * 1) && mouseX >= this.m_xPixelArray[j][i] * 1)
	                                    return k;
	                            } else {
	                                return j;
	                            }
	                        }
	                    }
	                } else {
	                    for (var j = this.m_yPixelArray.length - 1; j >= 0; j--) {
	                    	var stackHeight = 0;
	                    	if (!IsBoolean(this.m_basezero) && (Math.abs(this.m_stackHeightArray[j][i] * 1) < drillMinStackHeight)) {
	                    		stackHeight = (this.m_stackHeightArray[j][i] * 1 < 0) ? drillMinStackHeight : -drillMinStackHeight;
	                    	}else if(IsBoolean(this.m_basezero)){
								stackHeight = (seriesData[j][i] * 1 < 0) ? 0 : - drillMinStackHeight;
							}
	                    	    if (this.m_stackHeightArray[j][i] * 1 < 0) {
	                    	        var range1 = this.m_yPixelArray[j][i] * 1 + this.m_stackHeightArray[j][i] * 1 ;
	                    	        var range2 = this.m_yPixelArray[j][i] * 1 + stackHeight;
	                    	    }else if(isNaN(this.m_stackHeightArray[j][i] * 1 )){
							    	var range1 = this.getGarbageDrillPoints().range1;
							    	var range2 = this.getGarbageDrillPoints().range2;
							    } else {
	                    	        var range1 = this.m_yPixelArray[j][i] * 1 + stackHeight;
	                    	        var range2 = this.m_yPixelArray[j][i] * 1 + this.m_stackHeightArray[j][i] * 1 ;
	                    	    }
    	                        if (mouseY <= range2 && mouseY >= range1) {
	                            return this.m_calculation.m_originalindexforoverlaiddata[2][j][i];
	                        }
	                    }
	                }
	            }
	        }
	    }
	}
};
/**Added to support drill for garbage data too*/
ColumnStackChart.prototype.getGarbageDrillPoints = function () {
	var MarkerArray = [];
	var obj = {};
	var drillMinStackHeight = (this.m_charttype == "stacked") ? 0 : this.m_drillminstackheight;
    MarkerArray = this.m_yAxisMarkersArray;
    var ZeroIndex = (MarkerArray.indexOf("0") == -1) ? ((MarkerArray.indexOf(0) == -1) ? "" : MarkerArray.indexOf(0)) : MarkerArray.indexOf("0");
    if (ZeroIndex !== "") {
        var ZeroAxisPosition = this.m_startY * 1 - this.m_calculation.m_chart.m_yAxis.getYAxisDiv() * ZeroIndex;
        var ZeroAxisAvail = true;
    } else {
        var ZeroAxisAvail = false;
    }
    if (ZeroAxisAvail) {
		var stackHeight = - drillMinStackHeight;
        var range1 = ZeroAxisPosition * 1  + stackHeight;
        var range2 = ZeroAxisPosition * 1  ;
    } else {
    	var Ypixel = (MarkerArray[0]*1 > 0) ? this.getStartY() : this.getEndY();
        var StackHeight1 = (MarkerArray[0]*1 > 0) ? 0 : drillMinStackHeight;
        var StackHeight2 = (MarkerArray[0]*1 > 0) ? drillMinStackHeight : 0;
        var range1 = Ypixel - StackHeight2;
        var range2 = Ypixel + StackHeight1;
    }
    return obj = {"range1" : range1, "range2" : range2 };
}
/** @description Getting Drilled Bar Details**/
ColumnStackChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory))) && IsBoolean(this.isVisibleSeries())) {
		var drillMinStackHeight = (this.m_charttype == "stacked") ? 0 : this.m_drillminstackheight;
		var isDrillIndexFound = false;
		if(IsBoolean(this.m_basezero)){
			var seriesData = this.getVisibleSeriesData(this.getSeriesToolTipData()).seriesData;
		}
		
		if (this.m_charttype != "overlaid") {
			for (var k = 0, length = this.m_xPixelArray.length; k < length; k++) {
			    for (var i = 0, innerlength = this.m_xPixelArray[k].length; i < innerlength; i++) {
			        if (mouseX <= (this.m_xPixelArray[k][i] * 1 + this.m_calculation.getBarWidth() * 1) && mouseX >= this.m_xPixelArray[k][i] * 1) {

			            for (var j = 0, sunInnerlength = this.m_yPixelArray.length; j < sunInnerlength; j++) {
			                var stackHeight = 0;
			                if (!IsBoolean(this.m_basezero) && (Math.abs(this.m_stackHeightArray[j][i] * 1) < drillMinStackHeight)) {
			                    stackHeight = (this.m_stackHeightArray[j][i] * 1 < 0) ? drillMinStackHeight : -drillMinStackHeight;
			                } else if (IsBoolean(this.m_basezero)) {
			                    stackHeight = (seriesData[j][i] * 1 < 0) ? 0 : -drillMinStackHeight;
			                }
			                if (this.m_stackHeightArray[j][i] * 1 < 0) {
			                    var range1 = this.m_yPixelArray[j][i] * 1 + this.m_stackHeightArray[j][i] * 1;
			                    var range2 = this.m_yPixelArray[j][i] * 1 + stackHeight;
			                } else if (isNaN(this.m_stackHeightArray[j][i] * 1)) {
			                    var range1 = this.getGarbageDrillPoints().range1;
			                    var range2 = this.getGarbageDrillPoints().range2;
			                } else {
			                    var range1 = this.m_yPixelArray[j][i] * 1 + stackHeight;
			                    var range2 = this.m_yPixelArray[j][i] * 1 + this.m_stackHeightArray[j][i] * 1;
			                }
			                if (mouseY <= range2 && mouseY >= range1 && mouseX <= (this.m_xPixelArray[j][i] * 1 + this.m_stackWidth * 1) && mouseX >= this.m_xPixelArray[j][i] * 1) {
			                    var fieldNameValueMap = this.getFieldNameValueMap(i);
			                    if (this.m_charttype.toLowerCase() == "clustered") {
			                        /**Clicked color drills as the drill-color not series color.*/
			                        var drillColor = this.getColorsForSeries()[j][i];
			                        var drillField = this.visibleSeriesInfo.seriesName[k];
			                        var drillDisplayField = this.visibleSeriesInfo.seriesDisplayName[k];
			                    } else if (isNaN(this.m_stackHeightArray[j][i] * 1)) {
			                        /** These lines commented bcz below lines of code unnecessary written*/
			                    	/*if (ZeroAxisAvail) {
			                            stackHeight = -drillMinStackHeight;
			                            var range1 = ZeroAxisPosition * 1 + stackHeight;
			                            var range2 = ZeroAxisPosition * 1;
			                        } else {
			                            var Ypixel = (MarkerArray[0] * 1 > 0) ? this.getStartY() : this.getEndY();
			                            StackHeight1 = (MarkerArray[0] * 1 > 0) ? 0 : drillMinStackHeight;
			                            StackHeight2 = (MarkerArray[0] * 1 > 0) ? drillMinStackHeight : 0;
			                            var range1 = Ypixel + StackHeight1;
			                            var range2 = Ypixel - StackHeight2;
			                        }*/
			                    	var drillColor = this.getColorsForSeries()[j][i];
			                        var drillField = this.visibleSeriesInfo.seriesName[j];
			                        var drillDisplayField = this.visibleSeriesInfo.seriesDisplayName[j];
			                    } else {
			                        var drillColor = this.getColorsForSeries()[j][i];
			                        var drillField = this.visibleSeriesInfo.seriesName[j];
			                        var drillDisplayField = this.visibleSeriesInfo.seriesDisplayName[j];
			                    }
			                    if(IsBoolean(this.enableDrillHighlighter)){
									for(var a = 0; a < this.m_seriesNames.length; a++){
										for(var b = 0; b < this.m_transparencyarr[this.m_seriesNames[a]].length; b++){
											if(IsBoolean(this.m_drilltoggle)){
												this.m_transparencyarr[this.m_seriesNames[a]][b] = 0.5;//this.m_transparencyarr[this.m_seriesNames[a]][b] = 0.5;
											} else {
												this.m_transparencyarr[this.m_seriesNames[a]][b] = 1;
											}
										}
										this.m_transparencyarr[this.m_seriesNames[a]][i] = 1;
									}
									this.m_stackWidth = this.m_calculation.getBarWidth();
									this.initializeColumns();
									this.drawChart();
								}
				        	  	/*if(IsBoolean(this.m_drilltoggle)){
									this.m_drilltoggle = false;
								} else {
									this.m_drilltoggle = true;
								}*/
			                    this.m_drilltoggle = false;
			                    var drillValue = fieldNameValueMap[drillField];
			                    var drillCategory = this.m_categoryNames;
								var drillCategoriesValue = [];
								for(var a=0;a<drillCategory.length;a++){
									drillCategoriesValue.push(fieldNameValueMap[drillCategory[a]]);
								}
			                    fieldNameValueMap.drillField = drillField;
			                    fieldNameValueMap.drillDisplayField = drillDisplayField;
			                    fieldNameValueMap.drillValue = drillValue;
			                    isDrillIndexFound = true;
			                    fieldNameValueMap.drillIndex = i;
								fieldNameValueMap.drillCategoriesNames = drillCategory;
								fieldNameValueMap.drillCategory = drillCategoriesValue;
			                    return {
			                        "drillRecord": fieldNameValueMap,
			                        "drillColor": drillColor
			                    };
			                }
			            }
			        }
			    }
			}
			if (this.m_charttype == "stacked" && !isDrillIndexFound) {
			    for (var k = 0, length = this.xPositions.length; k < length; k++) {
			        if (mouseX <= (this.xPositions[k] * 1 + this.m_calculation.getBarWidth() * 1) && (mouseX >= this.xPositions[k] * 1)) {
			            for (var l = 0, innerlength = this.m_yPixelArray.length; l < innerlength; l++) {
			                if (((mouseY >= this.m_yPixelArray[l][k]) && (mouseY <= this.m_yPixelArray[l][k] + this.m_drillminstackheight)) || ((mouseY <= this.m_yPixelArray[l][k] + this.m_stackHeightArray[l][k]) && (mouseY >= this.m_yPixelArray[l][k] - this.m_drillminstackheight))) {
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
			for (var k = 0, length = this.m_xPixelArray.length; k < length; k++) {
			    for (var i = 0, innerlength = this.m_xPixelArray[k].length; i < innerlength; i++) {
			        if (mouseX <= (this.m_xPixelArray[k][i] * 1 + this.m_calculation.getBarWidth() * 1) && mouseX >= this.m_xPixelArray[k][i] * 1) {
			            for (var j = this.m_yPixelArray.length - 1; j >= 0; j--) {
			                var stackHeight = 0;
			                if ((!IsBoolean(this.m_basezero) && Math.abs(this.m_stackHeightArray[j][i] * 1) < drillMinStackHeight)) {
			                    stackHeight = (this.m_stackHeightArray[j][i] * 1 < 0) ? drillMinStackHeight : -drillMinStackHeight;
			                } else if (IsBoolean(this.m_basezero)) {
			                    stackHeight = (seriesData[j][i] * 1 < 0) ? 0 : -drillMinStackHeight;
			                }
			                if (this.m_stackHeightArray[j][i] * 1 < 0) {
			                    var range1 = this.m_yPixelArray[j][i] * 1 + this.m_stackHeightArray[j][i] * 1;
			                    var range2 = this.m_yPixelArray[j][i] * 1 + stackHeight;
			                } else if (isNaN(this.m_stackHeightArray[j][i] * 1)) {
			                    var range1 = this.getGarbageDrillPoints().range1;
			                    var range2 = this.getGarbageDrillPoints().range2;
			                } else {
			                    var range1 = this.m_yPixelArray[j][i] * 1 + stackHeight;
			                    var range2 = this.m_yPixelArray[j][i] * 1 + this.m_stackHeightArray[j][i] * 1;
			                }
			                if (mouseY <= range2 && mouseY >= range1) {
			                    var fieldNameValueMap = this.getFieldNameValueMap(i);
			                    /**Clicked color drills as the drill-color not series color.*/
			                    var drillColor = this.getColorsForSeries()[j][i];
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

/** @description Creating ColumnCalculation Class and assigning default values to the variables and creating arrays which will be used in calculation **/
function ColumnCalculation() {
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
ColumnCalculation.prototype.init = function (m_chart, m_categoryData, m_seriesData) {
	this.m_chart = m_chart;
	this.m_xAxisData = m_categoryData;
	this.m_yAxisData = this.m_chart.visibleSeriesInfo.seriesData;
	if (this.m_chart.m_charttype.toLowerCase() == "clustered") {
		this.m_maxbarwidth = this.m_chart.m_maxbarwidth * (1 + (this.m_yAxisData.length - 1) * 0.5);
	} else {
		this.m_maxbarwidth = this.m_chart.m_maxbarwidth;
	}
	this.m_startX = this.m_chart.getStartX();
	this.m_startY = this.m_chart.getStartY();
	this.m_endX = this.m_chart.getEndX();
	this.m_endY = this.m_chart.getEndY();

	this.m_chartType = this.m_chart.getChartType();
	this.setDrawHeight();
	this.setDrawWidth();
	this.m_columnGap = 10;

	this.calculateBarWidth();
	this.setRatio();
	this.setxPixelArray();
	if (this.m_chartType.toLowerCase() == "stacked" || this.m_chartType.toLowerCase() == "100%" ||this.m_chartType.toLowerCase() == "") {
		this.setstackHeightArray();
		this.setyPixelArray();
	} else {
		this.setyPixelArray();
		this.setstackHeightArray();
	}
};

/** @description Getter for Max Value**/
ColumnCalculation.prototype.getMaxValue = function () {
	return this.m_chart.max;
};

/** @description Getter for Min Value**/
ColumnCalculation.prototype.minValue = function () {
	return this.m_chart.min;
};

/** @description Getter for Y Axis Text**/
ColumnCalculation.prototype.getYAxisText = function () {
	return this.m_chart.m_yAxisText;
};

/** @description Getter for Calculating Percentile of the value**/
ColumnCalculation.prototype.getPercentile = function (value) {
	var percentileValue = value % 10;
	if (percentileValue !== 10) {
		percentileValue = 10 - percentileValue;
	}
	return percentileValue;
};

/** @description Getter for Y Axis Marker Array**/
ColumnCalculation.prototype.getYAxisMarkersArray = function () {
	return this.m_chart.m_yAxisMarkersArray;
};

/** @description Getter for DrawHeight**/
ColumnCalculation.prototype.getDrawHeight = function () {
	return this.drawHeight;
};

/** @description Setter for Draw Height**/
ColumnCalculation.prototype.setDrawHeight = function () {

	this.drawHeight = (this.m_startY - this.m_endY);
};

/** @description Getter for Draw Width**/
ColumnCalculation.prototype.getDrawWidth = function () {
	return this.drawWidth;
};

/** @description Setter for draw Width**/
ColumnCalculation.prototype.setDrawWidth = function () {
	this.drawWidth = 1 * (this.m_endX) - 1 * (this.m_startX);
};

/** @description Getter for Ratio**/
ColumnCalculation.prototype.getRatio = function () {
	return this.ratio;
};

/** @description Setter for Ratio**/
ColumnCalculation.prototype.setRatio = function () {
	var diff = this.getMaxValue() - this.minValue();
	if (diff > 0)
		this.ratio = this.getDrawHeight() / (diff);
	else
		this.ratio = 1;
};

/** @description Calculating Bar Width according to the given data**/
ColumnCalculation.prototype.calculateBarWidth = function () {
	var numberOfColumns = this.m_xAxisData.length;
	var totalGap = (1 * (numberOfColumns)) * this.m_columnGap;
	var availableDrawWidth = this.getDrawWidth() * 1;     /*(this.getDrawWidth() * 1 - totalGap * 1);*/
	var barWidth = (availableDrawWidth / numberOfColumns);
	barWidth = (barWidth * this.m_chart.m_barwidth)/100;
	/*if (barWidth > this.m_maxbarwidth) {
		this.setBarWidth(this.m_maxbarwidth);
		this.setColumnGap(this.m_maxbarwidth);
	} else if (barWidth < 9) {
		this.setBarWidth(9);
		this.setColumnGap(9);
	} else {*/
		this.setBarWidth(barWidth);
		this.setColumnGap(barWidth);
//	}
};

/** @description Setter for Bar Width**/
ColumnCalculation.prototype.setBarWidth = function (barwidth) {
	this.barWidth = barwidth;
	if (this.m_chartType.toLowerCase() == "clustered") {
		this.setBarWidthForClustered();
	}
};

/** @description Calculating Column Gap**/
ColumnCalculation.prototype.setColumnGap = function (barWidth) {
	var totalBarwidth = barWidth * this.m_xAxisData.length;
	var totalGap = this.getDrawWidth() - totalBarwidth;
	this.m_columnGap = totalGap / (this.m_xAxisData.length);
};

/** @description Calculating BarWidth for Clustered**/
ColumnCalculation.prototype.setBarWidthForClustered = function () {
	this.barWidth /= this.m_yAxisData.length;
};

/** @description Getter for Bar Width**/
ColumnCalculation.prototype.getBarWidth = function () {
	return this.barWidth;
};

/** @description Getter for Column Gap**/
ColumnCalculation.prototype.getColumnGap = function () {
	return this.m_columnGap;
};

/** @description Getter for X Pixel Array**/
ColumnCalculation.prototype.getxPixelArray = function () {
	return this.m_xPixelArray;
};

/** @description Setter for X Pixel Array**/
ColumnCalculation.prototype.setxPixelArray = function () {
	var m_xAxisPixelArray = [];
	/**Added padding between two column Stack in clustered*/
	var clusteredBarPadding = (this.getBarWidth() - this.getBarWidth()*this.m_chart.clusteredbarpadding)/2;
	for (var i = 0, length = this.m_yAxisData[0].length; i < length; i++) {
		m_xAxisPixelArray[i] = [];
		for (var j = 0, innerlength = this.m_yAxisData.length; j < innerlength; j++) {
			if (this.m_chartType.toLowerCase() == "clustered") {
				m_xAxisPixelArray[i][j] = (this.m_startX) * 1 + (this.getBarWidth()) * 1 * j + (this.getColumnGap() / 2) + ((this.getBarWidth()) * 1 * this.m_yAxisData.length + (this.getColumnGap()) * 1) * i + clusteredBarPadding;
			} else {
				m_xAxisPixelArray[i][j] = (this.m_startX) * 1 + (this.getBarWidth() * 1) * i + (this.getColumnGap() / 2) + (this.getColumnGap() * 1) * (i);
			}
		}
	}
	// re-transforming 2d array of 5X2
	this.m_xPixelArray = this.transformXPixelArray(m_xAxisPixelArray);
};

/** @description Transformation in the given Array**/
ColumnCalculation.prototype.transformXPixelArray = function (m_xAxisPixelArray) {
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
ColumnCalculation.prototype.getRatioForHundredPercent = function (index) {
	return this.m_hundredPercentsRatios[index] * 1;
};

/** @description Calculating Y Pixel Array  **/
ColumnCalculation.prototype.setyPixelArray = function () {
	if (this.m_chartType.toLowerCase() == "clustered") {
		this.m_ypixelArray = this.getYPixelArrayForClustered();
	} else if (this.m_chartType.toLowerCase() == "overlaid") {
		this.m_ypixelArray = this.getYPixelArrayForOverlaid();
	}
	else if (this.m_chartType.toLowerCase() == "stacked" || this.m_chartType == "100%" || this.m_chartType == "") {
		this.m_ypixelArray = this.setyPixelArrayForStackedOrHundredPercent();
	}
};

/** @description Calculating Y Pixel Array For Clustered **/
ColumnCalculation.prototype.getYPixelArrayForClustered = function () {
	var yparray = [];
	for (var i = 0, length = this.m_yAxisData.length; i < length; i++) {
		yparray[i] = [];
		for (var j = 0, innerlength = this.m_yAxisData[i].length; j < innerlength; j++) {
			var ratio = this.getRatio();
			var min = this.minValue();
			var max = this.getMaxValue();

			if (this.m_yAxisData[i][j] > max)
				this.m_yAxisData[i][j] = max;
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
ColumnCalculation.prototype.setSeriesColorForOverlaid = function (seriesColor) {
	this.SeriesColorForOverlaid = seriesColor;
};

/** @description Getting Series Color for overlaid **/
ColumnCalculation.prototype.getSeriesColorForOverlaid = function () {
	return this.SeriesColorForOverlaid;
};

/** @description Getter for Y Pixel Array when chart Type is Overlaid**/
ColumnCalculation.prototype.getYPixelArrayForOverlaid = function () {
	var newYAxisData = this.arrangeDataForOverlaid();
	this.setSeriesColorForOverlaid(newYAxisData[1]);
	this.m_yAxisData = newYAxisData[0];
	this.m_chart.m_seriesDataForDataLabel = newYAxisData[3];
	this.m_chart.m_seriesDataLabelPropertyOverlaid = newYAxisData[4];
	var yparray = [];
	for (var i = 0, length = this.m_yAxisData.length; i < length; i++) {
		yparray[i] = [];
		for (var j = 0, innerlength = this.m_yAxisData[i].length; j < innerlength; j++) {
			var ratio = this.getRatio();
			var ratio = this.getRatio();
			var min = this.minValue();
			var max = this.getMaxValue();

			if (this.m_yAxisData[i][j] > max)
				this.m_yAxisData[i][j] = max;
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
ColumnCalculation.prototype.arrangeDataForOverlaid = function () {
	this.m_originalindexforoverlaiddata = [];
	var seriesColor = this.m_chart.visibleSeriesInfo.seriesColor;
	var arrangeArray = [];
	var arrangeDataLabelArr = [];
	var arrangeDataLabelProp = [];
	var colorArray = [];
	var originalIndexArray = [];
	for (var i = 0, length = this.m_yAxisData[0].length; i < length; i++) {
		arrangeArray[i] = [];
		colorArray[i] = [];
		originalIndexArray[i] = [];
		arrangeDataLabelArr[i] = [];
		arrangeDataLabelProp[i] = [];
		for (var j = 0, innerlength = this.m_yAxisData.length; j < innerlength; j++) {
			arrangeArray[i][j] = (isNaN(this.m_yAxisData[j][i])) ? 0 : this.m_yAxisData[j][i] * 1;
			arrangeDataLabelArr[i][j] = this.m_chart.m_seriesDataForDataLabel[j][i];
			arrangeDataLabelProp[i][j] = this.m_chart.m_seriesDataLabelPropertyOverlaid[j];
			colorArray[i][j] = seriesColor[j];
			originalIndexArray[i][j] = j;
		}
	}
	var sortedData = this.sortingDataWithColor(arrangeArray, colorArray, originalIndexArray, arrangeDataLabelArr, arrangeDataLabelProp);
	var arrengeSeriesDataandColor = this.arrengeSeriesDataandColor(sortedData);
	this.m_originalindexforoverlaiddata = arrengeSeriesDataandColor;
	return arrengeSeriesDataandColor;
};

/** @description When Performing sort on data,data and color combination should not be change  **/
ColumnCalculation.prototype.sortingDataWithColor = function (arrangeArray, colorArray, originalIndexArray, arrangeDataLabelArr, arrangeDataLabelProp) {
	var m_seriesDataAndColor = [];
	for (var i = 0, length = arrangeArray.length; i < length; i++) {
		m_seriesDataAndColor[i] = [];
		for (var j = 0, innerlength = arrangeArray[i].length; j < innerlength; j++) {
			m_seriesDataAndColor[i][j] = [];
			m_seriesDataAndColor[i][j][0] = arrangeArray[i][j]*1;
			m_seriesDataAndColor[i][j][1] = colorArray[i][j];
			m_seriesDataAndColor[i][j][2] = originalIndexArray[i][j];
			m_seriesDataAndColor[i][j][3] = arrangeDataLabelArr[i][j];
			m_seriesDataAndColor[i][j][4] = arrangeDataLabelProp[i][j];
		}
	}

	for (var k = 0, length = m_seriesDataAndColor.length; k < length; k++) {
		m_seriesDataAndColor[k].sort(function (a, b) {
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

		negative[m].sort(function (a, b) {
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
ColumnCalculation.prototype.arrengeSeriesDataandColor = function (sortedData) {
	var seriesArr = [];
	var colorArr = [];
	var indexArr = [];
	var datalabelArr = [];
	var datalabelpropArr = [];
	for (var i = 0, length = sortedData.length; i < length; i++) {
		seriesArr[i] = [];
		colorArr[i] = [];
		indexArr[i] = [];
		datalabelArr[i] = [];
		datalabelpropArr[i] = [];
		for (var j = 0, innerlength = sortedData[i].length; j < innerlength; j++) {
			seriesArr[i][j] = sortedData[i][j][0];
			colorArr[i][j] = sortedData[i][j][1];
			indexArr[i][j] = sortedData[i][j][2];
			datalabelArr[i][j] = sortedData[i][j][3];
			datalabelpropArr[i][j] = sortedData[i][j][4];
		}
	}

	var finalSeriesData = [];
	var finalColor = [];
	var finalIndex = [];
	var finaldatalabel = [];
	var finaldatalabelProp = [];
	for (var k = 0, length = seriesArr[0].length; k < length; k++) {
		finalSeriesData[k] = [];
		finalColor[k] = [];
		finalIndex[k] = [];
		finaldatalabel[k] = [];
		finaldatalabelProp[k] = [];
		for (var l = 0, innerlength = seriesArr.length; l < innerlength; l++) {
			finalSeriesData[k][l] = seriesArr[l][k] * 1;
			finalColor[k][l] = colorArr[l][k];
			finalIndex[k][l] = indexArr[l][k];
			finaldatalabel[k][l] = datalabelArr[l][k];
			finaldatalabelProp[k][l] = datalabelpropArr[l][k];
		}
	}
	return [finalSeriesData, finalColor, finalIndex, finaldatalabel, finaldatalabelProp];
};

/** @description Calculating the Y Pixel Array when chart Type is Stacked or Hundred Percent**/
ColumnCalculation.prototype.setyPixelArrayForStackedOrHundredPercent = function () {
	var yparray = [];
	var positivePointerArray = [];
	var negativePointerArray = [];
	var yAxisData = (this.m_chartType === "100%") ? this.m_chart.getPercentageForHundred() : this.m_yAxisData;
	for (var i = 0, length = yAxisData.length; i < length; i++) {
		yparray[i] = [];
		positivePointerArray[i] = [];
		negativePointerArray[i] = [];
		for (var j = 0, innerlength = yAxisData[i].length; j < innerlength; j++) {
			if (isNaN(yAxisData[i][j]))
				yAxisData[i][j] = "";
			var ratio = this.getRatio();

			if (i == 0) {
				if (yAxisData[i][j] * 1 >= 0) {
					if ((this.m_chart.m_minimumaxisvalue * 1 > 0) && (!IsBoolean(this.m_chart.isAxisSetup())))
						yparray[i][j] = ((this.m_startY) - (ratio) * ((yAxisData[i][j])));
					else
						yparray[i][j] = ((this.m_startY) - (ratio) * ((yAxisData[i][j]))) + (ratio) * this.minValue();
					positivePointerArray[i][j] = yparray[i][j];
					negativePointerArray[i][j] = (this.m_startY) * 1 + (ratio) * this.minValue();
				} else {
					yparray[i][j] = ((this.m_startY) - (ratio) * ((yAxisData[i][j]))) + (ratio) * this.minValue();
					negativePointerArray[i][j] = yparray[i][j];
					positivePointerArray[i][j] = (this.m_startY) * 1 + (ratio) * this.minValue();
				}
			} else {
				if (this.m_yAxisData[i][j] >= 0) {
					positivePointerArray[i][j] = positivePointerArray[i - 1][j];
					negativePointerArray[i][j] = negativePointerArray[i - 1][j];
					yparray[i][j] = (positivePointerArray[i][j] * 1 - (ratio) * ((yAxisData[i][j])));
					positivePointerArray[i][j] = yparray[i][j] * 1;
				} else {
					negativePointerArray[i][j] = negativePointerArray[i - 1][j];
					positivePointerArray[i][j] = positivePointerArray[i - 1][j];
					yparray[i][j] = (negativePointerArray[i][j] * 1 - (ratio) * ((yAxisData[i][j])));
					negativePointerArray[i][j] = yparray[i][j] * 1;
				}
			}
		}
	}
	return yparray;
};

/** @description Getter for Y Pixel Array**/
ColumnCalculation.prototype.getyPixelArray = function () {
	return this.m_ypixelArray;
};

ColumnCalculation.prototype.calculationYpixcelForClusterTypeChart = function () {};

/** @description Getter for Stack Height Array  **/
ColumnCalculation.prototype.getstackHeightArray = function () {
	return this.m_stackHeightArray;
};

/** @description Setting each bar height into this.m_stackHeightArray **/
ColumnCalculation.prototype.setstackHeightArray = function () {
	var stackHeightArray = [];
	if (this.m_chartType.toLowerCase() == "stacked" || this.m_chartType.toLowerCase() == "100%" || this.m_chartType.toLowerCase() == "") {
		this.arrangeStackHeight();
	} else {
		var value;
		var ratio = this.getRatio();
		var min = this.minValue();
		for (var i = 0, length = this.m_yAxisData.length; i < length; i++) {
			stackHeightArray[i] = [];
			for (var j = 0, innerlength = this.m_yAxisData[i].length; j < innerlength; j++) {
				stackHeightArray[i][j] = this.getRatio();
				if (this.m_chartType.toLowerCase() === "clustered" || this.m_chartType.toLowerCase() === "overlaid") {

					if (min < 0) {
						value = this.m_yAxisData[i][j];
					} else {
						value = (this.m_yAxisData[i][j] - min);
					}

					if ((value * 1 < 0) && (!IsBoolean(this.m_chart.isAxisSetup())) && (this.m_chart.m_minimumaxisvalue * 1 > 0))
						value = 0;
					stackHeightArray[i][j] = (ratio * (value));
				}
			}
		}
		this.m_stackHeightArray = stackHeightArray;
	}
};

/** @description For Different-2 Chart Type calculating stack height**/
ColumnCalculation.prototype.arrangeStackHeight = function() {
    var stackHeightArray = [];
    var remainingStackHeight = [];
    var data = [];
    var min = this.minValue();
    var yAxisData = (this.m_chartType === "100%") ? this.m_chart.getPercentageForHundred() : this.m_yAxisData;
    for (var i = 0, length = yAxisData[0].length; i < length; i++) {
        var count = 0;
        remainingStackHeight[i] = [];
        var sum = 0;
        var flag1 = true;
        var positiveValueSum = 0;
        var negativeValueSum = 0;
        for (var j = 0, innerlength = yAxisData.length; j < innerlength; j++) {
            var ratio = this.getRatio();
            if (yAxisData[j][i] * 1 >= 0) {
                if ((yAxisData[j][i] * 1 > this.getMaxValue() * 1) && (IsBoolean(this.m_chart.isAxisSetup()))) {
                    yAxisData[j][i] = 0;
                } else if ((!IsBoolean(this.m_chart.isAxisSetup()))) {
                    sum = sum * 1 + yAxisData[j][i] * 1;
                    if (sum * 1 > this.getMaxValue() * 1 && count == 0) {
                        var remainedHeight = (remainingStackHeight[i][j - 1] !== undefined) ? remainingStackHeight[i][j - 1] : 0;
                        yAxisData[j][i] = this.getMaxValue() - remainedHeight;
                        sum = 0;
                        count++;
                        flag1 = false;
                    } else {
                        if (!IsBoolean(flag1))
                            yAxisData[j][i] = 0;
                    }
                }
                positiveValueSum = positiveValueSum + yAxisData[j][i];
                remainingStackHeight[i][j] = positiveValueSum;
            } else {
                if (yAxisData[j][i] * 1 <= this.minValue() * 1) {
                    yAxisData[j][i] = this.minValue() - negativeValueSum;
                } else if ((yAxisData[j][i] * 1 >= this.minValue() * 1) && j !== 0 && yAxisData[j][i] > negativeValueSum && this.m_chartType !== "100%") {
                    yAxisData[j][i] = (negativeValueSum <= this.minValue()) ? 0 : yAxisData[j][i];
                }
                if (this.m_chartType == "100%" && (yAxisData[j][i] * 1 + negativeValueSum < this.minValue()))
                    yAxisData[j][i] = 0;
                negativeValueSum = negativeValueSum + yAxisData[j][i];
                remainingStackHeight[i][j] = Math.abs(negativeValueSum);
            }
        }
    }
    for (var i = 0, length = yAxisData.length; i < length; i++) {
        stackHeightArray[i] = [];
        for (var j = 0, innerlength = yAxisData[i].length; j < innerlength; j++) {
            var ratio = this.getRatio();
            stackHeightArray[i][j] = this.getRatio();
            stackHeightArray[i][j] = (ratio * yAxisData[i][j]);
        }

    }
    this.m_stackHeightArray = stackHeightArray;
};

/** @description Calculating sum of array values **/
ColumnCalculation.prototype.calculateSum = function (stacksDataArr) {
	var sum = 0;
	for (var i = 0, length = stacksDataArr.length; i < length; i++) {
		sum = (sum * 1) + (stacksDataArr[i] * 1);
	}
	return sum;
};

/** @description Creation of Column Class and initializing global arrays**/
function Columns() {
	this.m_xPixel = [];
	this.m_yPixelArray = [];
	this.m_stackHeightArray = [];
	this.m_stackColorArray = [];
	this.m_stackArray = [];
};

/** @description Columns class initialization with the values which are passed from ColumnStackChart Class**/
Columns.prototype.init = function (xPixel, yPixelArray, stackWidth, stackHeightArray, stackPercentage, stackColorArray, strokeColor, showgradient, showPercentageFlag, percentvalueFlag, plotTrasparencyArray, chart) {
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
		this.m_stackArray[i].init(this.m_xPixel[i], this.m_yPixelArray[i], this.m_stackWidth, this.m_stackHeightArray[i], this.m_stackColorArray[i], this.m_strokeColor, this.m_showGradient, this.m_chart.ctx, this.m_chart.m_chartbase, this.m_stackPercentageArray[i], this.m_showPercentFlag, this.m_percentvalueFlag, this.m_plotTrasparencyArray[i], this.m_chart.visibleSeriesInfo.seriesData, this.m_chart);
	}
};

/** @description Calling draw stack method to the lenght of category**/
Columns.prototype.drawColumns = function () {
	for (var i = 0, length = this.m_yPixelArray.length; i < length; i++) {
		if (!this.isInRange(i)){
		var stackHeight = this.m_stackArray[i].m_stackHeight;
		if(stackHeight == null || stackHeight == "null" || stackHeight == "" || (isNaN(stackHeight)) || stackHeight ==0){
			//do nothing
		}else{
			this.m_stackArray[i].drawStack();
		}
		
		}
	}
};

/** @description Checking, is calculated X,Y pixel inside the draw width and Height .**/
Columns.prototype.isInRange = function (i) {
	if (this.m_yPixelArray[i] >= this.m_chart.getStartY() && this.m_yPixelArray[i] <= this.m_chart.getEndY())
		return true;
	else
		return false;
};
//# sourceURL=ColumnStackChart.js