/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: BarChart.js
 * @description Barchart
 **/
function BarChart(m_chartContainer, m_zIndex) {
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
	this.m_calculation = new BarCalculation();
	this.noOfRows = 1;

	this.m_xAxis = new BarXAxis();
	this.m_yAxis = new BarYAxis();
	this.m_title = new svgTitle(this);
	this.m_subTitle = new svgSubTitle();

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_showhorizontalmarkerline = false;
	this.m_maxbarwidth = 40;
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
	this.m_yaxislabellines = "2";
	this.enableDrillHighlighter = "false";
	this.m_drilltoggle = true;
	/**DAS-564 slider properties */
	this.origonalXposition = "";
	this.updateflag=false;
	this.m_showslider = false;
	this.timeLineSliderFlag = false;
	this.m_showslidermarker = true;
	this.m_showslidertext = false;
	this.m_sliderhandlerbgcolor = "#ccffff";
	this.m_sliderselectbgcolor = "#cccccc";
	this.m_slidercontainerbgcolor = "#ccffff";
	this.m_slidercontainerbordercolor = "#bbbbbb";
	this.m_sliderbordercolor = "#cccccc";
	this.m_sliderbghandle = "#ffffff";
	
	this.m_slideropacityhandle = "0.0";
	this.m_sliderbgselection = "#cccccc";
	this.m_slideropacityselection = "0.5";
	this.m_sliderbgcontainer = "#ecf0f1";
	this.m_slideropacitycontainer = "0.0";
	this.m_sliderbgscrollbar = "#b0b0b0";
	this.m_slideropacityscrollbar = "0.7";
	this.m_sliderLastIndex = 0;
	this.m_sliderposition = "default"
	this.m_sliderheightratio = 7;
	this.m_sliderrangeflag = true;
    this.m_sliderrangevalue = 10;
	this.m_sliderheight = 63;
	this.sliderMargin = 70;
	this.m_slideronmaxmize = false;
	
	/*threshold properties*/
	this.m_showxaxisthreshold = false;
	this.m_minimumxaxisthreshold = "0";
	this.m_maximumxaxisthreshold = "50";
	this.m_minimumxaxisthresholdline = true;
	this.m_xaxisthresholdlinewidth = "1";
	this.m_minimumthresholdstrokecolor = "#00FF00";
	this.m_maximumthresholdstrokecolor = "#FF0000";
	this.m_xaxisthresholdstrokecolor = "#000000";
	this.m_thresholdlinetype = "straight"; //dot,dash1,dash
	
	this.m_enablethresholdfill = false;
	
	this.m_fillBelowLowerThreshold = "#ffea00";
	this.m_fillBetweenThreshold = "#00FF00";
	this.m_fillAboveUpperThreshold = "#ff0000";

	this.m_thresholdfillcolor = "#ffea00,#00FF00,#ff0000";
	this.m_thresholdfilllevel = "low,middle,top";
	this.m_thresholdfillopacity = "0.3,0.3,0.3";
	this.m_thresholdfilllabel = "Low,Middle,Top";
	this.m_thresholdfilllabelcolor = "#000000,#000000,#000000";

	this.m_fillBelowThresholdOpacity = 0.3;
	this.m_fillBetweenThresholdOpacity = 0.3;
	this.m_fillUpperThresholdOpacity = 0.3;

	this.m_BelowThresholdLabel = "Low";
	this.m_BetweenThresholdLabel = "Middle";
	this.m_UpperThresholdLabel = "Top";
	
	this.m_BelowThresholdLabelColor = "#000000";
	this.m_BetweenThresholdLabelColor = "#000000";
	this.m_UpperThresholdLabelColor = "#000000";
};

/** @description Making prototype of chart class to inherit its properties and methods into Bar chart **/
BarChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
BarChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
BarChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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
BarChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description getter for Category field Name**/
BarChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};

/** @description getter for category field display name**/
BarChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

/** @description calcluating mark text margin and than start point from where chart x,y will draw **/
BarChart.prototype.setStartX = function () {
	var btdm = this.getBorderToDescriptionMargin();
	var dm = this.getYAxisDescriptionMargin();
	var dtlm = this.getDescriptionToLabelMargin();
	var ltam = this.getLabelToAxisMargin();
	var lm = this.getYAxisLabelMargin();
	var lls   = this.getLeftLabelSpace();
	var lsp = this.getLeftSpace();
	//DAS-564 Added to support slider in BarChart 
	var sliderwidth = (IsBoolean(this.m_showslider))?this.m_sliderheight:0;
	if(IsBoolean(this.scaleFlag)) {
		this.m_startX = this.m_x * 1;
	}else{
		this.m_startX = this.m_x * 1 + btdm * 1 + dm * 1 + dtlm * 1 + lm * 1 + ltam * 1 + lls*1 + lsp*1;
	}
	
};

/** @description calculating y Axis text formatter margin**/
BarChart.prototype.getLeftSpace = function () {
	var unit = this.getUnitValue();
	var us = this.getCalculatedSpace(unit);
	var ps  = this.getPrecisionSpace();
	var sp = (ps*1 + us*1)/2;
	return sp;
};

/** @description calculating y axis text margin**/
BarChart.prototype.getLeftLabelSpace = function () {
	var labelTextSpace = 0;
	this.setLabelWidth();
	if (IsBoolean(this.m_xAxis.getLabelTilted())) {
		if(this.m_xAxis.m_labelrotation*1 > -70 && this.m_xAxis.m_labelrotation < 0){
			var lw = this.getLabelWidth()/2;
			var lpm = this.getLabelPrecisionMargin()/2;
			var lsfm = this.getLabelSecondFormatterMargin()/2;
			labelTextSpace = lw*1 + lpm*1 + lsfm*1;
		}
	}
	return labelTextSpace;
};

/** @description calculating biggest text size in pixels**/
BarChart.prototype.getYAxisLabelMargin = function () {
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
BarChart.prototype.setStartY = function () {
	var chartYMargin = this.getChartMargin();
	var xlbm = this.getXAxisLabelMarginForBar();
	this.m_startY = this.m_y * 1 + this.m_height * 1 - chartYMargin * 1 - xlbm * 1;
};

/** @description Calculating x Axis Margin For Bar**/
BarChart.prototype.getXAxisLabelMarginForBar = function () {
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
		var radians = this.m_xAxis.m_labelrotation * (Math.PI / 180);
		var lfm = this.getLabelFormatterMargin();
		var lw = this.fontScaling(this.m_xAxis.getLabelFontSize()) * 1.5 * this.noOfRows;
		//this.setLabelWidth();
		var markerWidth = this.getLabelWidth() * Math.abs(radians);
		lw = (lw <= markerWidth) ? markerWidth : lw;
		var lsm = this.getLabelSignMargin();
		var lpm = this.getLabelPrecisionMargin();
		var lsfm = this.getLabelSecondFormatterMargin();
		var dm = this.getXAxisDescriptionMargin();
	}
	lm = lfm * 1 + lw * 1 + lsm * 1 + lpm * 1 + lsfm * 1 + dm * 1;
	return lm;
};

/** @description if series names are big than break into 2 rows to prevent from overlapping **/
BarChart.prototype.setNumberOfRows = function () {
	this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
	var noOfRow = 1;
	var max= ((""+this.min).length <= (""+this.max).length)?this.max:this.min;
	if (!IsBoolean(this.isEmptySeries)) {
		var maxSeriesVal = (this.m_charttype == "100%") ? 100 : max;
		var markerLength = this.m_xAxisMarkersArray.length;
		var xDivision = (this.getEndX() - this.getStartX()) / (markerLength);
		var val = this.m_util.updateTextWithFormatter(maxSeriesVal, "", this.m_precision);
		var unit = this.getUnitValue();
		var secondUnit = this.getSecondUnitValue();
		if(secondUnit == "auto"){
			secondUnit="K";
		}
		val = val +""+ unit +""+ secondUnit;
		if (this.ctx.measureText(val).width > xDivision) {
			noOfRow = (this.m_skipxaxislabels == "auto") ? 2 : 1;
			noOfRow = 1;//DAS-564 aligning slider chart
		}
	}
	return noOfRow;
};

/** @description Getter for second unit formatter**/
BarChart.prototype.getSecondUnitValue = function () {
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
BarChart.prototype.getUnitValue = function () {
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
BarChart.prototype.getLabelFormatterMargin = function () {
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
BarChart.prototype.getLabelWidth = function () {
	return this.m_labelwidth;
};

/** @description Calculating text size with formatter and calculating label width**/
BarChart.prototype.setLabelWidth = function () {
	this.m_labelwidth = 0;
	var maxSeriesVals = [];
    for(var i = 0;i < this.m_xAxisMarkersArray.length ;i++ ){
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
				if(maxSeriesVal !== 0){
					if(this.m_precision !== "default")
					maxSeriesVal = this.m_xAxis.setPrecision(maxSeriesVal, this.m_precision);
				}
			}
			maxSeriesVal = getFormattedNumberWithCommas(maxSeriesVal, this.m_numberformatter);
			this.ctx.beginPath();
			this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
			maxSeriesVals[i] =  this.ctx.measureText(maxSeriesVal).width;
			this.ctx.closePath();
		}
	}
	this.m_labelwidth = getMaxValueFromArray(maxSeriesVals);
};
/*BarChart.prototype.setLabelWidth = function () {
	this.m_labelwidth = 0;
	var maxSeriesVal = ((""+this.min).length <= (""+this.max).length)?this.max:this.min;
	if (this.m_charttype == "100%") {
		maxSeriesVal = 100;
	} 
	var maxSeriesValDecimal = maxSeriesVal;
	this.ctx.beginPath();
	this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
	this.m_labelwidth = this.ctx.measureText(maxSeriesValDecimal).width;
	this.ctx.closePath();
	if (!IsBoolean(this.m_fixedlabel)) {
		if (IsBoolean(this.m_xAxis.getLeftaxisFormater())) {
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
			maxSeriesVal = getFormattedNumberWithCommas(maxSeriesVal, this.m_numberformatter);
			this.ctx.beginPath();
			this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
			this.m_labelwidth = this.ctx.measureText(maxSeriesVal).width;
			this.ctx.closePath();
		}
	}
};*/



/** @description Getter for Label SignMargin**/
BarChart.prototype.getLabelSignMargin = function () {
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
BarChart.prototype.getLabelPrecisionMargin = function () {
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
BarChart.prototype.getLabelSecondFormatterMargin = function () {
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
BarChart.prototype.setEndX = function () {
	var blm = this.getBorderToLegendMargin();
	var vlm = this.getVerticalLegendMargin();
	var vlxm = this.getVerticalLegendToXAxisMargin();
	var rlts  = this.getRightLabelTextSpace();
	var sp = this.getRightSpace();
	var rightSideMargin = blm * 1 + vlm * 1 + vlxm * 1 + rlts*1 + sp*1;
	var sliderwidth = (IsBoolean(this.m_showslider))?this.m_sliderheight:0;//DAS-564 Added to support slider in Barchart 
	this.m_endX = (this.m_x * 1 + this.m_width * 1 - rightSideMargin * 1 - sliderwidth * 1);
	this.m_endX = (IsBoolean(this.scaleFlag)) ? sliderwidth : this.m_endX;//DAS-564 Added to support slider in Barchart 
};

/** @description Getter for Right side margin which is calculated on the basis of right side formatter**/
BarChart.prototype.getRightSpace = function () {
	var space;
	var ps = this.getPrecisionSpace();
	var unit = this.getUnitValue();
	var secondUnit = this.getSecondUnitValue();
	var us = this.getCalculatedSpace(unit);
	var sus = this.getCalculatedSpace(secondUnit);
	space = (ps*1 + us*1 + sus*1)/2;
	return space;
};

/** @description Generic function which takes input and calculating the width of input in pixels**/
BarChart.prototype.getCalculatedSpace = function (str) {
	return (this.ctx.measureText(str).width);
};

/** @description Getter for precision space**/
BarChart.prototype.getPrecisionSpace = function () {
	var str = "";
	for(var i = 0 ; i < this.m_precision ; i++){
		var x = 0 ;
		str +=x;
	}
	return (this.ctx.measureText(str).width);
};

/** @description calculating space when text rotation is apply**/
BarChart.prototype.getRightLabelTextSpace = function () {
	var labelTextSpace = 0;
	if (IsBoolean(this.m_xAxis.getLabelTilted())) {
		if(this.m_xAxis.m_labelrotation*1 > 0 && this.m_xAxis.m_labelrotation < 80){
			var lw = this.getLabelWidth();
			var lpm = this.getLabelPrecisionMargin();
			var lsfm = this.getLabelSecondFormatterMargin()/2;
			labelTextSpace = lw*1 + lpm*1 + lsfm*1;
		}
	}
	return labelTextSpace;
};

/** @description Setter for end Y**/
BarChart.prototype.setEndY = function () {
	this.m_endY = (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1  + this.getMarginForTooltip());
};

/** @description Getter for Series Visibility**/
BarChart.prototype.getCounterFlagForSeriesVisiblity = function () {
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
BarChart.prototype.setFields = function (fieldsJson) {
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
BarChart.prototype.setCategory = function (categoryJson) {
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
			if(this.m_categoryNames.length == 0){
				this.m_categoryNames[count] = this.getProperAttributeNameValue(categoryJson[i], "Name");
				this.m_categoryDisplayNames[count] = m_formattedDisplayName;
				this.m_categoryFieldColor[count] = this.getProperAttributeNameValue(categoryJson[i], "Color");
				count++;
		    }
		}
	}
};

/** @description Setting Series Property into arrays**/
BarChart.prototype.setSeries = function(seriesJson) {
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
                "shape": "cube",
                "index": count
            };
            this.legendMap[this.m_seriesNames[count]] = tempMap;
            count++;
        }
    }
    this.setLegendsIntialLoad(this.m_defaultlegendfields);
};

/** @description Getter for Legend Information**/
BarChart.prototype.getLegendInfo = function () {
	return this.legendMap;
};

/** @description Getter for All Series names**/
BarChart.prototype.getAllSeriesNames = function () {
	return this.m_allSeriesNames;
};
/** @description Getter for All Category names **/
BarChart.prototype.getAllCategoryNames = function () {
	return this.m_allCategoryNames;
};

/** @description Getter for Series Names**/
BarChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};

/** @description Getter for Series Display Names**/
BarChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};

/** @description Getter for Series Colors**/
BarChart.prototype.getSeriesColors = function () {
	return this.m_seriesColors;
};

/** @description Setter for Legend Names**/
BarChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};

/** @description Getter for Legend Names**/
BarChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};

/** @description Getter for Category Colors**/
BarChart.prototype.getCategoryColorsForAction = function () {
	return this.m_categoryFieldColor;
};
/** @description Getter for Series Colors**/
BarChart.prototype.getSeriesColorsForAction = function () {
	return this.m_seriesColors;
};

/** @description Setter for All Field Names**/
BarChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0, len = this.getAllCategoryNames().length; i < len; i++) {
		this.m_allfieldsName.push(this.getAllCategoryNames()[i]);
	}
	for (var j = 0, length = this.getAllSeriesNames().length; j < length; j++) {
		this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
	}
};

/** @description Getter for all field Name**/
BarChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

/** @description Moving series,category display name in allfieldDisplayName array**/
BarChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0, len = this.getCategoryDisplayNames().length; i < len; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0, length = this.getSeriesDisplayNames().length; j < length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

/** @description Getter for All Field Display Name**/
BarChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

/** @description Fetching data from category,series and moving into category,series array**/
BarChart.prototype.setCategorySeriesData = function () {
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_seriesDataForToolTip = [];
	this.m_displaySeriesDataFlag = [];
	this.m_seriesDataForDataLabel = [];
	this.m_seriesDataLabelPropertyOverlaid = [];
	for (var k = 0, length = this.getDataProvider().length; k < length ; k++) {
		var record = this.getDataProvider()[k];
		this.isEmptyCategory = true;
		if (this.getCategoryNames().length > 0) {
			this.isEmptyCategory = false;
			for (var i = 0, innerLength = this.getCategoryNames().length; i < innerLength; i++) {
				if( !this.m_categoryData[i] )
					this.m_categoryData[i] = [];
				var data = this.getValidFieldDataFromRecord(record,this.getCategoryNames()[i]);
				this.m_categoryData[i][k] = data;
			}
		}
	
		this.m_displaySeriesDataFlag[k] = [];
		for (var j = 0, l=0, innerLength1 = this.getSeriesNames().length; j < innerLength1; j++) {
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
	/**DAS-564 */
	this.CatData = this.m_categoryData;
    this.SerData = this.m_seriesData;
    this.SerDataLabel = this.m_seriesDataLabel;
};

/** @description Setter for Category Data**/
BarChart.prototype.setCategoryData = function () {
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
BarChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

/** @description Setter for Series Data**/
BarChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0, length = this.getSeriesNames().length; i < length; i++) {
		//if(IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]]))
		this.m_seriesData.push(this.getDataFromJSON(this.getSeriesNames()[i]));
	}
};

/** @description Getter for Series Data**/
BarChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

/** @description Setting Series Color**/
BarChart.prototype.setSeriesColor = function (m_seriesColor) {
	this.m_seriesColor = m_seriesColor;
};
/** @description getter Method for get DataFromJSON according to fieldName **/
BarChart.prototype.getDataFromJSON = function (fieldName) {
	var data = [];
	var dataProviderData = this.getDataProvider();
	if (IsBoolean(!this.timeLineSliderFlag)) {
		var arrayLength = this.getDataProvider().length;
		for (var i = 0; i < arrayLength; i++) {
			if (dataProviderData[i][fieldName] == undefined)
				data[i] = "";
			else
				data[i] = dataProviderData[i][fieldName];
		}
	} else {
		for (var i = this.firstIndex, k = 0; i <= this.lastIndex; i++) {
			if (dataProviderData[i] && dataProviderData[i][fieldName] != undefined && dataProviderData[i][fieldName] !== "undefined")
				data[k] = dataProviderData[i][fieldName];
			else
				data[k] = "";
			k++;
		}
	}
	return data;
};

/** @description Getter for Series Color**/
BarChart.prototype.getSeriesColor = function () {
	return this.m_seriesColor;
};

/** @description chart Frame,title,subtitle,xAxis,yAxis initialization**/
BarChart.prototype.init = function () {
	this.updateSeriesDataWithCommaSeperators();

		if (IsBoolean(!this.timeLineSliderFlag)) {
		//this.setCategoryData();
		//this.setSeriesData();
		this.updateflag=false;
		this.setCategorySeriesData();
		this.firstIndex = 0;
		if (this.m_categoryData.length > 0){//DAS-1122
			this.lastIndex = this.m_categoryData[0].length - 1;
			/**Added to calculate conditional colors for complete values of series*/
			this.m_conditionalcolorswithoutslider = this.getConditionalColors().getConditionalColorsForConditionsForMixedTime(this.getSeriesNames(), this.getSeriesColors(), this.m_seriesData, this);
			/**Added for slider window move*/
			this.m_conditionalcolorswithslider = this.m_conditionalcolorswithoutslider;
		}
	}
	this.setAllFieldsName();
	this.setAllFieldsDisplayName();
	this.isSeriesDataEmpty();
	this.setShowSeries(this.getAllFieldsName());
	this.visibleSeriesInfo=this.getVisibleSeriesData(this.getSeriesData());
	this.createSVG();
	this.initMouseClickEventForSVG(this.svgContainerId);
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);
	if (!IsBoolean(this.m_isEmptySeries) && IsBoolean(this.isVisibleSeries())) {
		this.setPercentageForHundred();
		this.initializeCalculation();
		this.m_xAxis.init(this, this.m_calculation);
		this.m_yAxis.init(this, this.m_calculation);
	}
    /**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};

/** @description Getting series data and moving into arrays **/
BarChart.prototype.updateSeriesDataWithCommaSeperators = function () {
	this.m_displaySeriesDataFlag = [];
	for (var i = 0, length = this.m_seriesData.length; i < length; i++) {
		this.m_displaySeriesDataFlag[i] = [];
		for (var j = 0, dataLength = this.m_seriesData[i].length; j < dataLength ; j++) {
			this.m_displaySeriesDataFlag[i][j] = true;
			if (isNaN(this.m_seriesData[i][j])) {
				this.m_displaySeriesDataFlag[i][j] = false;
				this.m_seriesData[i][j] = getNumericComparableValue(this.m_seriesData[i][j]);
			}
		}
	}
};
/** @description Drawing of chartFrame,Title,SubTitle,XAxis,YAxis,BarChart,Legend**/
BarChart.prototype.drawChart = function () {
	this.drawChartFrame();
	var temp = this;
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	var map = this.IsDrawingPossible();
	if (IsBoolean(map.permission)) {
		this.drawXAxis();
		this.drawYAxis();
		this.drawBarChart();
		this.drawDataLabel();
		this.drawThreshold();
				/**DAS-564 barchart slider */
		if (IsBoolean(!this.timeLineSliderFlag)) {
		if(IsBoolean(this.m_showslider)){   
			this.getBGGradientColorToScale();
				if (IsBoolean(this.m_sliderrangeflag)) {
						var data = this.m_dataProvider.length;
						var l = this.m_sliderrangevalue;
						if (data >= l) {
						    this.m_sliderrange = ((l * 100) / data);
						}else{
							/*DAS-727 slider range not working when number of data less than the updated range value.*/
								this.m_sliderrange = 100;
							}	
				}
				this.setMinMaxSliderIndex();
				this.drawslider();
				this.drawRangeSelector();
				/********* Scale Chart Drawing *****/
				this.scaleFlag = true;
				var oldObject = this;
				var newObject = getDuplicateObject( oldObject );
				this.initScaleChart(newObject);
				this.drawScaleChart(newObject, this.svgTimeScaleId);
				this.scaleFlag = false;
				if (!this.m_designMode){
						this.timeLineSliderFlag = true;
					/*	this.updatechart(this.getStartX(),((this.getStartX()*1)+((this.getEndX()-this.getStartX())*3/10)));*/
						var width = this.getStartY()-this.getEndY();
						var slectedWidth = (temp.m_sliderwidthperc != undefined) ? (temp.m_sliderwidthperc * width):((this.m_sliderrange == "auto") ? width * 3 / 10 : (this.m_sliderrange * 1) * width / 100);
					/** To update slider position left/right side or according to current Date index*/
					/*  this.updatechart(this.getStartX(),((this.getStartX()*1) + slectedWidth));*/
						if(IsBoolean(!temp.m_slideronmaxmize) || this.m_sliderleftperc == undefined){
							if (this.m_sliderposition == "left") {
								this.updatechart(this.getEndY(), ((this.getEndY()*1) + slectedWidth));
							} else if (this.m_sliderposition == "right") {
							    this.updatechart((this.getEndY() * 1) + (width - slectedWidth),this.getStartY());
							} else {
								if (IsBoolean(this.m_isCurrentDate) && this.currentDateIndex < this.lastIndex) {
								    var templeft = (this.currentDateIndex == 0) ? this.tempLeft : (this.getStartY() * 1) + this.tempLeft - 0.01;
								    this.updatechart(templeft, (templeft + slectedWidth));
								} else {
									 this.updatechart((this.getEndY() * 1) + (width - slectedWidth),this.getStartY());
								}
							}
						}else{
							/**DAS-564 barchart slider */
							var startvalue = (this.getEndY() * 1) + (temp.m_sliderleftperc * width);
							this.updatechart(startvalue, startvalue + slectedWidth);
						}
					}
				}	
			}
	} else {
		this.drawSVGMessage(map.message);
	}
};
/**DAS-564 @description Will generate the gradient and fill in background of Scale chart  **/
BarChart.prototype.getBGGradientColorToScale = function () {
	var temp = this;
	$("#" + temp.svgTimeScaleId).empty();
	var linearGradient1 = document.createElementNS(NS, "linearGradient");
	linearGradient1.setAttribute("id", "gradient1" + temp.m_objectid);
	linearGradient1.setAttribute("gradientTransform", "rotate(" + this.m_bggradientrotation + ")");
	$("#" + temp.svgTimeScaleId).append(linearGradient1);
	var colors1 = this.getBgGradients().split(",");
	var step=(100 / (((colors1.length-1)!=0)?(colors1.length-1):1));
	for (var i = 0,Length= colors1.length; i <=(Length-1); i++) {
		var stop = document.createElementNS(NS, "stop");
		stop.setAttribute("offset", (i *step) + "%");
		stop.setAttribute("stop-color", (hex2rgb(convertColorToHex(colors1[i]),this.m_bgalpha)));
		stop.setAttribute("stop-opacity", this.m_bgalpha);
		$(linearGradient1).append(stop);
	}
	var rect1 = drawSVGRect(0, 0, this.sliderMargin, this.m_width, "");
	$(rect1).attr("id", "GradientScaleRect" + temp.m_objectid);
	$(rect1).css("opacity","0");
	$(rect1).attr("fill", "url(#gradient1" + temp.m_objectid + ")");
	$("#" + temp.svgTimeScaleId).append(rect1);
};
/**DAS-564 @description Update slider position according to current Date or right side **/
BarChart.prototype.sliderAxisCalculation = function(sliderTotalWidth, slectedWidth) {
    this.tempLeft = sliderTotalWidth - slectedWidth;
    var currentDateObj = new Date();
    for (var i = 0, length = this.CatData[0].length; i < length; i++) {
        var dateObj = new Date(this.CatData[0][i]);
        if (currentDateObj.setHours(0, 0, 0, 0) === dateObj.setHours(0, 0, 0, 0)) {
            this.m_isCurrentDate = true;
            this.currentDateIndex = i;
            var key;
            for (var j = 0; j < this.m_seriesNames.length; j++) {
            	if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[j]])) {
            		key = this.m_seriesNames[j];
            		break;
            	}
            }
            this.tempLeft = this.m_calculation.xPositionMap[key][i] - this.getStartY() * 1;
            if ((this.tempLeft + slectedWidth) > sliderTotalWidth || this.currentDateIndex == this.lastIndex) {
                this.tempLeft = sliderTotalWidth - slectedWidth;
            } else if (this.tempLeft < this.getStartY() || this.currentDateIndex == 0) {
                this.tempLeft = this.getStartY() * 1;
            }
            break;
        }
    }
    return this.tempLeft;
};
/**DAS-564 @description Setter Method of MinMaxSlider Index  **/
BarChart.prototype.setMinMaxSliderIndex = function () {
	this.minSliderIndex=this.m_calculation.minSliderIndex;
	this.maxSliderIndex=this.m_calculation.maxSliderIndex;
};
/** @description Initialize ScaleChart  **/
BarChart.prototype.initScaleChart = function (temp) {
	temp.m_y = 0;
	this.tempTitle = temp.m_title.m_showtitle;
	this.tempSubTitle = temp.m_subTitle.m_showsubtitle;
	//temp.m_height = this.sliderMargin;
	temp.m_title.m_showtitle = false;
	//temp.m_subTitle.m_showsubtitle = false;
	temp.m_showmaximizebutton = true;
	temp.m_showgradient = false;
	temp.m_showrangeselector = false;
	
	temp.setCategorySeriesData();
	temp.setAllFieldsName();
	temp.setAllFieldsDisplayName();
	temp.setColorsForSeries();
    temp.m_tooltip.init(temp);
    if (!IsBoolean(temp.m_isEmptySeries)) {
		this.setPercentageForHundred();
		temp.initializeCalculation();
	}
};
/** @description This method use for Filter the data according to Selected Range (Slider) **/
BarChart.prototype.updateDragChartFromSlider = function (starty,endy) {
	if(!IsBoolean(this.updateflag)) {
		for(var index = 0, length = this.m_seriesNames.length; index < length; index++) {
			if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[index]])) {
				break;
			}
		}
		for(var i = 0 ;i < this.m_calculation.getYPositionArray().length ;i++){//on legend checkbox chart visible data was breaking on tooltip.
			this.origonalXposition = this.m_calculation.getYPositionArray()[i];			
		}
		this.updateflag = true;
	}
	var newcategory =[];
	var newseries = [];
	/**Added for data label and conditional color calculation*/
	var newseriesDataLabel = [];
	var newseriesConditionalColor = {};
	var newplotradiusarray = {};
	newcategory[0]=[];
	this.m_sliderindexes =[];
	for(var j = 0, serDataLength = this.SerData.length; j < serDataLength; j++) {
		newseries[j] = [];
		newseriesDataLabel[j]=[];
		newseriesConditionalColor[this.m_seriesNames[j]]=[];
		newplotradiusarray[this.m_seriesNames[j]]=[];
		this.m_sliderindexes[j] = [];
	}
	/** Update slider index value when chart associated with filters*/
	this.m_sliderLastIndex = (this.origonalXposition.length > 0) ? this.origonalXposition.length - 1 : this.origonalXposition.length;
	for(var i = 0, outerLength = this.origonalXposition.length; i < outerLength; i++) {

		if(starty<this.origonalXposition[i]*1 && endy>this.origonalXposition[i]*1) {
			newcategory[0].push(this.CatData[0][i]);
			for(var j = 0, innerLength = this.SerData.length;j < innerLength; j++) {
				newseries[j].push(this.SerData[j][i]);
				/*
				newseriesDataLabel[j].push(this.SerDataLabel[j][i]);
				newseriesConditionalColor[this.m_seriesNames[j]].push(this.m_conditionalcolorswithoutslider[this.m_seriesNames[j]][i]);
				newplotradiusarray[this.m_seriesNames[j]].push(this.PlotRadius[this.m_seriesNames[j]][i]);
				*/
				this.m_sliderLastIndex = i;
				this.m_sliderindexes[j].push(i);
			}
		}else if(this.origonalXposition[i]*1>endy){
			break;
		}
	}
	if(newcategory[0].length>=1){
		this.m_afterslider = true;
		this.m_categoryData = newcategory;
		this.m_seriesData = newseries;
		this.m_seriesDataLabel = newseriesDataLabel;
		this.m_conditionalcolorswithslider = newseriesConditionalColor;
		this.m_plotradiusarray = newplotradiusarray;
		this.startDate = newcategory[0][0];
		this.endDate = newcategory[0][newcategory[0].length-1];
		this.m_overlappeddatalabelarrayY = [];
		this.m_overlappeddatalabelarrayX = [];
		this.init();
		this.drawChart();
		this.m_afterslider = false;
	}
	else{
		this.startDate = newcategory[0][0];
		this.endDate = newcategory[0][0];
	}
};
/** @description Will draw the ScaleChart  **/
BarChart.prototype.drawScaleChart = function (temp) {
	temp.drawScaleBar();
	this.m_title.m_showtitle = this.tempTitle;
	this.m_subTitle.m_showsubtitle = this.tempSubTitle;
};
/** @description drawing of bar chart**/
BarChart.prototype.drawScaleBar = function() {
	//DAS-959 slider implimentation for gradients base type
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
	for (var k = 0, length = this.visibleSeriesInfo.seriesName.length; k < length; k++) {
		var barSeriesArray = this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[k]];
		this.createStackGroupForSlider(barSeriesArray, "stackgrpslider", k, this.visibleSeriesInfo.seriesName[k]);
		barSeriesArray.drawBarSeries(k);
	}
};
/***************************** Start Slider Implementation *****************************/
BarChart.prototype.updatechart = function(start, end) {
	var temp = this;
	this.updateDragChartFromSlider(start, end);
};
BarChart.prototype.sliderTextBox = function() {
    var temp = this;
    var left = this.getEndY();
    var width = this.getStartY() - this.getEndY();
    var textwidth = width/6 ;
    if (this.m_sliderTextField == "" || this.m_sliderTextField == undefined) {
        var startData = temp.CatData[0][0];
        var endData = temp.CatData[0][temp.CatData[0].length - 1];
    } else {
    	var startData = temp.m_dataProvider[0][this.m_sliderTextField];
    	var endData = temp.m_dataProvider[temp.m_dataProvider.length - 1][this.m_sliderTextField];
    }
    var sliderTextDiv = document.createElement("div");
    sliderTextDiv.setAttribute("id", "textdiv" + temp.m_objectid);
    sliderTextDiv.setAttribute("style", "top:" + (left-this.fontScaling(this.m_yAxis.getLabelFontSize()))+ "px;height:" + ((this.fontScaling(this.m_yAxis.getLabelFontSize())*2)+width)+ "px; width:0px"+"18px; position:absolute; display:flex; flex-direction:column;");
    $(sliderTextDiv).css({
        "font-family": selectGlobalFont(this.m_yAxis.getLabelFontFamily()),
        "color": convertColorToHex(this.m_yAxis.getLabelFontColor()),
        "font-style": this.m_yAxis.getLabelFontStyle(),
        "font-size": this.fontScaling(this.m_yAxis.getLabelFontSize()) + "px",
        "font-weight": this.m_yAxis.getLabelFontWeight(),
        "text-decoration": this.m_yAxis.getLabelTextDecoration()
    })
	//DAS-564 when slider width ratio is less tah 5,slider text is not visible
    if(this.m_sliderheightratio<5){
		$(sliderTextDiv).css({
			"display":"none"
		});
	}
    var input1 = document.createElement("div");
    var input2 = document.createElement("div");
    input1.setAttribute("style","width:" + this.m_sliderheightratio*7 + "px;overflow:hidden; white-space:nowrap;position: absolute;top: -4px;text-overflow:ellipsis;");
    input2.setAttribute("style","width:" + this.m_sliderheightratio*7 + "px;overflow:hidden; white-space:nowrap;text-overflow:ellipsis;position: absolute;bottom: -6px");
    sliderTextDiv.append(input1);
    sliderTextDiv.append(input2);
    if (this.m_sliderStartText == "" && this.m_sliderEndText == "") {
        input1.innerHTML = startData + ":";
        input2.innerHTML = endData + ":";
    } else {
        input1.innerHTML = this.m_sliderStartText + startData;
        input2.innerHTML = this.m_sliderEndText + endData;
    }
    $("#svgTimeScaleDiv" + temp.m_objectid).append(sliderTextDiv);
    
   /*DAS-411 */
	/*if (IsBoolean(this.m_showslidertext)) {
		   height = this.m_sliderheight;
		   $("#textdiv" + temp.m_objectid).css("bottom",height+ 18 + "px");
	    }*/
}
/**DAS-564 @description draw slider */
BarChart.prototype.drawslider = function() {
	var temp = this;
	$("#rangeslider" + temp.m_objectid).remove();
	if (IsBoolean(this.m_showslider)) {
		this.jquerySliderImplementation();
	}
};
/**DAS-564 @description jquery slider implentation */
BarChart.prototype.jquerySliderImplementation = function() {
	var temp = this;
	var top = this.getStartY();
	var width = this.getStartY() - this.getEndY();
	var slectedWidth = (temp.m_sliderwidthperc != undefined) ? (temp.m_sliderwidthperc * width):((this.m_sliderrange == "auto") ? width * 3 / 10 : (this.m_sliderrange * 1) * width / 100);
	/** To update slider position left to right side or according to current Date index*/
	var tempLeft;
	if(IsBoolean(!temp.m_slideronmaxmize) || this.m_sliderleftperc == undefined){
		if (this.m_sliderposition == "left") {
			tempLeft = this.getStartY()*1;
		} else if (this.m_sliderposition == "right") {
			tempLeft = width - slectedWidth;
		} else {
			tempLeft = this.sliderAxisCalculation(width, slectedWidth);
			if (this.currentDateIndex === 0) {
			    tempLeft = (this.sliderAxisCalculation(width, slectedWidth)) - (this.getStartY() * 1);
			}
		}
	} else {
		tempLeft = (this.m_sliderleftperc * width);//this.getStartX()*1 + 
	}
	
	var sliderContainerDiv = document.createElement("div");
	sliderContainerDiv.setAttribute("id", "newSilderBody" + temp.m_objectid);
	sliderContainerDiv.setAttribute("class", "newSilderBody");
	sliderContainerDiv.setAttribute("style", "height:" + width + "px; width:" + this.m_sliderheight + "px; position:relative;"+"top:"+this.getEndY()+"px;");
	$(sliderContainerDiv).css({
		"background": hex2rgb(this.m_sliderbordercolor, this.m_slideropacitycontainer),
		"border": "1px solid " + hex2rgb(this.m_sliderbordercolor, this.m_sliderborderopacity)
	});
	$("#svgTimeScaleDiv" + temp.m_objectid).append(sliderContainerDiv);

	var silderSelecterdiv = document.createElement("div");
	silderSelecterdiv.setAttribute("id", "silderSelecterdiv" + temp.m_objectid);
	silderSelecterdiv.setAttribute("class", "easyui-draggable");
	var bgColor = hex2rgb(this.m_sliderbordercolor, this.m_slideropacityselection);
	silderSelecterdiv.setAttribute("style", "position:absolute;top:0px; height:" + slectedWidth + "px; width:" + this.m_sliderheight + "px;  background:" + bgColor + ";cursor:move;");
	$(silderSelecterdiv).css({
		"border-left": "1px solid " + hex2rgb(this.m_sliderbordercolor, this.m_sliderborderopacity),
		"border-right": "1px solid " + hex2rgb(this.m_sliderbordercolor, this.m_sliderborderopacity)
	});
	if (temp.m_sliderposition != "left") { // || temp.m_sliderleftperc != undefined
		$(silderSelecterdiv).css({
			 "top" : tempLeft + "px"
		});
	}
	$(sliderContainerDiv).append(silderSelecterdiv);

	var leftHandle = document.createElement("div");
	leftHandle.setAttribute("id", "leftHandle" + temp.m_objectid);
	$(silderSelecterdiv).append(leftHandle);
	var leftbordercolor = hex2rgb(this.m_sliderbordercolor, this.m_sliderborderopacity);
	$("#leftHandle" + temp.m_objectid).attr("style", "position:absolute;top:-2px;left:" + this.m_sliderheight / 4 + "px;height:5px;width:" + this.m_sliderheight / 2.5 + "px;border:1px solid " + leftbordercolor + ";background:#F6F7F2;");

	var rightHandle = document.createElement("div");
	rightHandle.setAttribute("id", "rightHandle" + temp.m_objectid);
	$(silderSelecterdiv).append(rightHandle);
	var rightbordercolor = hex2rgb(this.m_sliderbordercolor, this.m_sliderborderopacity);
	$("#rightHandle" + temp.m_objectid).attr("style", "position:absolute;left:" + this.m_sliderheight / 4 + "px;bottom:-2px;height:5px;width:" + this.m_sliderheight / 2.5 + "px;border:1px solid " + rightbordercolor + ";background:#F6F7F2;");

	/** start, drag, stop and resize events for other modules **/
	$("#silderSelecterdiv" + temp.m_objectid).draggable({
		axis: "y",
		containment: ("#newSilderBody" + temp.m_objectid),
		start: function(event, ui) {
			slectedWidth = ($(this).height());
		},
		drag: function(event, ui) {
			tempLeft = ($(this).position().top * 1);
			temp.updatechart(tempLeft, ((tempLeft * 1) + (1 * slectedWidth)));
		},
		stop: function(event, ui) {
			tempLeft = ($(this).position().top * 1);
			temp.updatechart(tempLeft, ((tempLeft * 1) + (1 * slectedWidth)));
			//console.log(templeft+" <==> "+((tempLeft*1)+(1*slectedWidth)))
		}
	});
	$("#silderSelecterdiv" + temp.m_objectid).resizable({
		axis: "y",
		containment: ("#newSilderBody" + temp.m_objectid),
		handles: "n,s",
		start: function(e, ui) {
			console.log("resizing started");
		},
		resize: function(e, ui) {
			tempLeft = (ui.position.top * 1);
			slectedWidth = ui.size.height;
			if (slectedWidth > 15) {
				temp.updatechart(tempLeft, ((tempLeft * 1) + (1 * slectedWidth)));
			}
		},
		stop: function(e, ui) {
			tempLeft = (ui.position.top * 1);
			slectedWidth = ui.size.height;
			temp.updatechart(tempLeft, ((tempLeft * 1) + (1 * slectedWidth)));
			temp.resetSelectorToNormal();
		}
	});

	$("#silderSelecterdiv" + temp.m_objectid).draggable({
		axis: "v",
		containment: ("#newSilderBody" + temp.m_objectid),

		onStartDrag: function(event, ui) {
			slectedWidth = $(event.data.target).outerHeight();
			temp.updatechart(tempLeft, ((tempLeft * 1) + (1 * slectedWidth)));
		},
		onDrag: function(event, ui) {
			constrain(event);
			tempLeft =(temp.getEndY() * 1) + ($(this).position().top * 1);
			temp.updatechart(tempLeft, ((tempLeft * 1) + (1 * slectedWidth)));
		},
		onStopDrag: function(event, ui) {
			constrain(event);
			tempLeft = (temp.getEndY() * 1)+($(this).position().top * 1);
			temp.m_sliderleftperc = ($(this).position().top * 1)/((temp.getStartY()*1)-(temp.getEndY()*1));
			temp.updatechart(tempLeft, ((tempLeft * 1) + (1 * slectedWidth)));
			//console.log(templeft+" <==> "+((tempLeft*1)+(1*slectedWidth)));
		}
	});

	$("#silderSelecterdiv" + temp.m_objectid).resizable({
		minHeight: 15,
		fit: true,
		axis: "v",
		containment: ("#newSilderBody" + temp.m_objectid),
		maxHeight: width,
		handles: "n,s",
		onStartResize: function(e, ui) {
			//console.log($(this).width()*1);
		},
		onResize: function(e, ui) {
			constrainResizable(e);
			tempLeft = (temp.getEndY() * 1) + ($(this).position().top * 1);
			slectedWidth = e.data.height; //$(this).width()*1;
			if (slectedWidth > 15) {
				temp.updatechart(tempLeft, ((tempLeft * 1) + (1 * slectedWidth)));
			}
			//console.log("slectedWidth="+slectedWidth);
		},
		onStopResize: function(e, ui) {
			//console.log("slectedWidth onStopResize="+slectedWidth);
			constrainResizable(e);
			$(this).css({
				"top": e.data.top,
				"height": e.data.height
			});
			tempLeft = (temp.getEndY() * 1) +  ($(this).position().top * 1);
			slectedWidth = e.data.height; //$(this).width()*1;;
			temp.m_sliderleftperc = ($(this).position().top * 1)/((temp.getStartY()*1)-(temp.getEndY()*1));
			temp.m_sliderwidthperc = slectedWidth / ((temp.getStartY()*1)-(temp.getEndY()*1));
			temp.updatechart(tempLeft, ((tempLeft * 1) + (1 * slectedWidth)));
			temp.resetSelectorToNormal();
		}
	});
	if (IsBoolean(this.m_showslidertext))
	    this.sliderTextBox();
};

/** @description if already present remove and create new canvas**/
BarChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description initializing DraggableDiv And Canvas by calling multiple methods**/
BarChart.prototype.initializeDraggableDivAndCanvas = function () {
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
/** @description createSVG Method used for create SVG element for Chart **/
BarChart.prototype.createSVG = function () {
	var temp = this;
	this.svgContainerId = "svgContainer" + temp.m_objectid;
	$("#" + temp.svgContainerId).remove();
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("xlink", "http://www.w3.org/1999/xlink");
	svg.setAttribute("width", this.m_width);
	/**DAS-564 Slider */
	var height = 0;
	this.m_sliderheight = this.m_height/4;
	var marginForFloatingLegends = (IsBoolean(this.getShowLegends())) ? (10 * this.minWHRatio()): 0;
	if(IsBoolean(this.m_showslider)&& (IsBoolean(this.m_designMode)||IsBoolean(this.m_isDataSetavailable))) {
		height = this.m_height/4;
		height = (height < this.m_sliderheightratio*7) ? ((height < 40) ? this.m_sliderheightratio*3 : this.m_sliderheightratio*6) : this.m_sliderheightratio*7;
		this.sliderMargin = height;
		if (IsBoolean(this.getShowLegends()) && !IsBoolean(this.m_fixedlegend) && (this.m_legendposition == "horizontalBottomLeft" || this.m_legendposition == "horizontalBottomCenter" || this.m_legendposition == "horizontalBottomRight")) {
			this.m_sliderheight = height;
		} else {
			this.m_sliderheight = height - 2; // 2px deducted for border height of slider 
		}
	}
	/**	DAS-1282 */
	if(IsBoolean(this.m_showslider)){
		svg.setAttribute("width", this.m_width-this.m_sliderheight-10);	
	}
	svg.setAttribute("height", this.m_height);
	svg.setAttribute("id", this.svgContainerId);
	//svg.setAttribute("class", "svg_chart_container");
	$("#draggableDiv" + temp.m_objectid).append(svg);
	/**vertical slider append or remove */
	if (IsBoolean(this.m_showslider) && (IsBoolean(this.m_isDataSetavailable)|| IsBoolean(this.m_designMode))) {
		if (IsBoolean(!this.timeLineSliderFlag)) {
			$("#svgTimeScaleDiv" + temp.m_objectid).remove();
			/**title/subtitle margin */
			var titlemargin = this.getMarginForTitle() * 1 + (IsBoolean(this.m_subTitle.m_showsubtitle) ? this.m_subTitle.m_titleMargin : 0);
			var div = document.createElement("div");
			div.setAttribute("id", "svgTimeScaleDiv" + temp.m_objectid);
			div.style.position = "absolute";
			div.style.zIndex = temp.m_zIndex ;
			div.style.right = "0px";
			div.style.top = "0px";
			$("#draggableDiv" + temp.m_objectid).append(div);
			//$("#svgTimeScaleDiv" + temp.m_objectid).css("top", this.sliderMargin - marginForFloatingLegends - 1 + "px");
			/*******************************/
			this.svgTimeScaleId = "svgTimeScale" + temp.m_objectid;
			$("#" + temp.svgTimeScaleId).remove();
			var svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg1.setAttribute("xlink", "http://www.w3.org/1999/xlink");
			/**replace height and width for verticla slider */
			var svgheight = this.getStartY() - this.getEndY();
			svg1.setAttribute("height", this.m_height);
			svg1.setAttribute("width", this.m_sliderheight);
			if(this.m_sliderheightratio <= 2){
				/** hide the svg slider when height is less then 15px **/
				svg1.setAttribute("display", "none");
			}
			svg1.setAttribute("id", this.svgTimeScaleId);
			svg1.setAttribute("class", "svg_chart_container");
			$("#svgTimeScaleDiv" + temp.m_objectid).append(svg1);
		}
	} else {
		$("#svgTimeScaleDiv" + temp.m_objectid).remove();
		$("#rangeSelector" + temp.m_objectid).remove();
	}
};
/** @description Calculation initialization**/
BarChart.prototype.initializeCalculation = function () {
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
	this.setThresholdFillColors();
};

/** @Description calculate the Min/Max value and get required ScaleInfo of The Axis **/
BarChart.prototype.calculateMinimumMaximum = function (seriesdata) {
	//this.xAxisData = this.getVisibleSeriesData(convertArrayType(seriesdata));
	var minMax;
	/** Added for enable common marker for repeater chart */
	var seriesData = (IsBoolean(this.m_isRepeaterPart) && IsBoolean(this.m_parentObj.m_repeatercommonmarker)) ? this.getAllSeriesDataForRepeater() : seriesdata;
	if (this.m_charttype.toLowerCase() == "clustered" || this.m_charttype.toLowerCase() == "overlaid") {
		minMax = this.calculateMinMaxValue(seriesData);
	} else {
		if((this.m_charttype.toLowerCase() == "stacked") && (seriesdata[0].length === 1)) {
			minMax = this.calculateMinMaxValue((seriesData));//convertArrayType(seriesdata)
		} else {
			minMax = this.calculateFinalMinMaxValue(seriesdata);
		}
	}

	var calculatedMin = minMax.min;
	var calculatedMax = minMax.max;
	
	var niceScaleObj=this.getCalculateNiceScale(calculatedMin,calculatedMax,this.m_basezero,this.m_autoaxissetup,this.m_minimumaxisvalue,this.m_maximumaxisvalue,(this.m_width));
	this.min=niceScaleObj.min;
	this.max=niceScaleObj.max;
	this.m_numberOfMarkers=niceScaleObj.markerArray.length;
	this.m_xAxisText=niceScaleObj.step;
	this.m_xAxisMarkersArray=niceScaleObj.markerArray;
};

/** @description calculate max,min from series data*/
BarChart.prototype.calculateFinalMinMaxValue = function(xAxisData) {
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
BarChart.prototype.getCheckedAllPosContainigZero = function () {
	var flag = true;
	for (var i = 0, length = this.m_seriesData[this.m_seriesVisiblityPosition].length; i < length; i++) {
		if (this.m_seriesData[this.m_seriesVisiblityPosition][i] != 0)
			flag = false;
	}

	return flag;
};

/** @description get array with 0 values**/
BarChart.prototype.getArrayWhenPercentFlagIsFalse = function () {
	var per = [];
	for (var i = 0, length = this.m_seriesData.length; i < length; i++) {
		per[i] = 0;
	}
	return per;
};

/** @description calculating percentage in between selected series**/
BarChart.prototype.getPercentage = function () {
	var per = [];
	var sumOfSeries = this.getSumOfSeriesData();
	for (var i = 0, length = this.m_seriesData[this.m_seriesVisiblityPosition].length; i < length ; i++) {
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
BarChart.prototype.getSumOfSeriesData = function () {
	var sum = 0;
	for (var i = 0, length = this.m_seriesData[this.m_seriesVisiblityPosition].length; i < length ; i++) {
		if (this.m_seriesData[this.m_seriesVisiblityPosition][i] == "NaN")
			this.m_seriesData[this.m_seriesVisiblityPosition][i] = 0;
		if (this.m_seriesData[this.m_seriesVisiblityPosition][i] > 0)
			sum = sum * 1 + this.m_seriesData[this.m_seriesVisiblityPosition][i] * 1;
	}
	return sum;
};

/** @Description Will return all series data for repeater chart **/
BarChart.prototype.getAllSeriesDataForRepeater = function () {
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

/** @description initialization of bars**/
BarChart.prototype.initializeBars = function () {
	this.m_barSeriesArray = {};
	if(this.m_charttype=="clustered"){
		this.m_barWidth = this.m_barWidth*this.clusteredbarpadding;
	}
	for (var i = 0, length = this.visibleSeriesInfo.seriesName.length; i < length ; i++) {
		this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[i]] = new BarSeries();
		this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[i]].init(this.m_xPositionArray[i], this.m_yPositionArray[i], this.m_barWidth, this.m_barWidthArray[i], this.m_percentageArray, this.getColorsForSeries()[i], this.m_strokecolor, this.m_showmarkingorpercentvalue, this.m_showPercentValueFlag, this.m_seriesInitializeFlag, this.m_plotTrasparencyArray[i], this);
	}
};

/** @description Data Label for BarSeries Initialization**/
BarChart.prototype.initializeDataLabel = function() {
    this.m_valueTextSeries = {};
    for (var k = 0, i1 = 0; i1 < this.m_seriesNames.length; i1++) {
    this.m_seriesDataForDataLabel[i1] = this.visibleSeriesInfo.seriesData[i1];
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i1]])) {
            if ((this.m_charttype.toLowerCase() == "overlaid") || IsBoolean(this.m_seriesDataLabelProperty[i1].showDataLabel)) {
				this.m_datalablebackgroundrect = (IsBoolean(this.m_seriesDataLabelProperty[i1].datalabelBackgroundRect)) ? true : this.m_datalablebackgroundrect;
                this.m_valueTextSeries[this.m_seriesNames[i1]] = new ValueTextSeries();
                if((this.m_charttype == "100%") && (this.m_seriesDataLabelProperty[k].showPercentValue !== undefined) && IsBoolean(this.m_seriesDataLabelProperty[k].showPercentValue)){
                	this.m_seriesDataForDataLabel[k] = this.getPercentageForHundred()[k];
                }
                var datalabelProp = (this.m_charttype.toLowerCase() == "overlaid") ? this.m_seriesDataLabelPropertyOverlaid[k] : this.m_seriesDataLabelProperty[i1];
                var dataActual = (this.m_charttype.toLowerCase() == "overlaid") ? this.m_actualseriesdatamap[k] : this.m_seriesData[i1];
                this.m_valueTextSeries[this.m_seriesNames[i1]].init(this.m_xPositionArray[k], this.m_yPositionArray[k], this, this.m_seriesDataForDataLabel[k], datalabelProp,dataActual, this.m_barWidth, this.m_barWidthArray[k]);
            };

            k++;
        }
    }
};
/** @description Getter for series color**/
BarChart.prototype.getColorsForSeries = function () {
	return this.m_seriesColorsArray;
};

/** @description Setter for series color**/
BarChart.prototype.setColorsForSeries = function () {
	this.m_seriesColorsArray = [];
	if (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) {
		for (var i = 0, length = this.visibleSeriesInfo.seriesData.length; i < length ; i++) {
			this.m_seriesColorsArray[i] = [];
			for (var j = 0, dataLength = this.visibleSeriesInfo.seriesData[i].length; j < dataLength ; j++) {
				this.m_seriesColorsArray[i][j] = this.m_drillColor;
			}
		}
	}
	 else if ((this.m_charttype == "overlaid" || this.m_charttype == "Overlaid")) {
			this.m_seriesColorsArray = this.m_calculation.getSeriesColorForOverlaid();
	 }
	 else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && this.getCategoryColors().getCategoryColor().length > 0 && IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName())) {
		var categoryColors = this.getCategoryColors().getCategoryColorsForCategoryNames(this.getCategoryData()[0], this.m_categoryFieldColor);
		for (var i = 0, length = this.visibleSeriesInfo.seriesData.length ; i < length; i++) {
			this.m_seriesColorsArray[i] = [];
			for (var j = 0, dataLength = this.visibleSeriesInfo.seriesData[i].length; j < dataLength ; j++) {
				this.m_seriesColorsArray[i][j] = categoryColors[j];
			}
		}
//	} else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && !IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName()) && this.getConditionalColors() != "" && this.getConditionalColors() != undefined && this.getConditionalColors().getConditionalColor().length > 0) {
	} else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && (!IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName()) || this.getCategoryColors().getCategoryColor().length == 0) && this.getConditionalColors() != "" && this.getConditionalColors() != undefined && this.getConditionalColors().getConditionalColor().length > 0) {
		var conditionalColors = this.getConditionalColors().getConditionalColorsForConditions(this.visibleSeriesInfo.seriesName, this.visibleSeriesInfo.seriesColor, this.visibleSeriesInfo.seriesData, this);
		for (var i = 0, length = this.visibleSeriesInfo.seriesData.length ; i < length; i++) {
			this.m_seriesColorsArray[i] = [];
			for (var j = 0, dataLength = this.visibleSeriesInfo.seriesData[i].length; j < dataLength ; j++) {
				this.m_seriesColorsArray[i][j] = conditionalColors[i][j];
			}
		}
	} else {
		var seriesColors = this.visibleSeriesInfo.seriesColor;
		for (var i = 0, length = this.visibleSeriesInfo.seriesData.length ; i < length; i++) {
			this.m_seriesColorsArray[i] = [];
			for (var j = 0, dataLength = this.visibleSeriesInfo.seriesData[i].length; j < dataLength ; j++) {
				this.m_seriesColorsArray[i][j] = seriesColors[i];
			}
		}
	}
};

/** @description changing the array data order**/
BarChart.prototype.updateSeriesData = function (array) {
	var arr = [];
	if ((array != undefined && array !== null && array !== "") && array.length != 0)
		for (var i = 0, length = array[0].length; i < length; i++) {
			arr[i] = [];
			for (var j = 0, dataLength = array.length; j <dataLength; j++) {
				arr[i][j] = array[j][i];
			}
		}
	return arr;
};

/** @description overrite drawObject Method  because of ChartFrame and Titles are drawn on SVG  **/
BarChart.prototype.drawObject = function () {
	this.drawSVGObject();
	if (IsBoolean(!this.timeLineSliderFlag)){
		this.getBGGradientColorToScale();
	}
};

/** @description overrite draw Method  because of we need to initialize timeLineSliderFlag variable  **/
BarChart.prototype.draw = function () {
	this.timeLineSliderFlag = false;
	Chart.prototype.draw.call(this);
	/*
	this.init();
	this.drawChart();
	if (this.plugin != undefined && this.plugin != null) {
		this.plugin.initPlugin(this);
	}*/
};

/** @description drawing of Title**/
BarChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

/** @description drawing of subtitle**/
BarChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

/** @description drawing of X Axis and marking**/
BarChart.prototype.drawXAxis = function () {
	this.createXAxisMarkerLabelGroup('xaxislabelgrp');
	this.m_xAxis.markXaxis();
	this.m_xAxis.drawXAxis();
};

/** @description drawing of Y Axis**/
BarChart.prototype.drawYAxis = function () {
	if (IsBoolean(this.m_showhorizontalmarkerline)) {
		this.createHorizontalLineGroup('horizontallinegrp');
		this.m_yAxis.horizontalMarkerLines();
	}
	if (IsBoolean(this.m_showmarkerline)) {
		this.createVerticalLineGroup('verticallinegrp');
		this.m_yAxis.drawVerticalLine();
	}
	if (IsBoolean(this.m_zeromarkerline) && !IsBoolean(this.m_basezero) && IsBoolean(this.m_yAxis.hasNegativeXaxisMarker(this.m_xAxisMarkersArray)))
		this.m_yAxis.zeroMarkerLine();
	this.createTickGroup('yaxistickgrp');
	this.m_yAxis.drawTickMarks();
	this.createYAxisMarkerLabelGroup('yaxislabelgrp');
	this.m_yAxis.markYaxis();
	this.m_yAxis.drawYAxis();
};

/** @description drawing of chart frame**/
BarChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawSVGFrame();
	this.getBGGradientColorToContainer();
};

/** @description Will generate the gradient and fill in background of chart  **/
BarChart.prototype.getBGGradientColorToContainer = function() {
	var temp = this;
	// code for creating shadow of strokeline width
	var defsElement = document.createElementNS('http://www.w3.org/2000/svg', "defs");
	var filterElement = document.createElementNS(NS, "filter");
	filterElement.setAttribute("id", "stackShadow"+temp.m_objectid);
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

/** @description drawing of bar chart**/
BarChart.prototype.drawBarChart = function () {
	if(this.m_chartbase == "gradient1") {
		for (var j = 0, outerLength = this.visibleSeriesInfo.seriesName.length; j < outerLength; j++) {
			for(var i = 0, innerLength = this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[j]].xPixel.length; i < innerLength; i++) {
				this.createGradient1(this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[j]].barStackArray[i].stackColor, j, i);
			}
		}
	} else if(this.m_chartbase == "gradient2") {
		for (var j = 0, length = this.visibleSeriesInfo.seriesName.length; j < length; j++) {
			for(var i = 0, innerLength = this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[j]].xPixel.length; i < innerLength; i++) {
				this.createGradient2(this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[j]].barStackArray[i].stackColor, j, i);
			}
		}
	} else if(this.m_chartbase == "gradient3") {
		for (var j = 0, length = this.visibleSeriesInfo.seriesName.length; j < length; j++) {
			for(var i = 0, innerLength = this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[j]].xPixel.length; i < innerLength; i++) {
				this.createGradient3(this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[j]].barStackArray[i].stackColor, j, i);
			}
		}
	}
	for (var k = 0, length = this.visibleSeriesInfo.seriesName.length; k < length; k++) {
		var barSeriesArray = this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[k]];
		this.createStackGroup(barSeriesArray, "stackgrp", k, this.visibleSeriesInfo.seriesName[k]);
		barSeriesArray.drawBarSeries(k);
	}
};

/** @description drawing Data Label on bar chart**/
BarChart.prototype.drawDataLabel = function() {
	for (var i = 0, length = this.m_seriesNames.length; i < length; i++) {
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
        	var valueText = this.m_valueTextSeries[this.m_seriesNames[i]];
            if ((this.m_charttype.toLowerCase() == "overlaid") || IsBoolean(this.m_seriesDataLabelProperty[i].showDataLabel)) {
            	this.createDataLabelGroup(valueText, 'datalabelgrp' , i, this.m_seriesNames[i]);
            	valueText.drawValueTextSeries();
            }
        }
    }
};
/** @description drawing line on Bar chart DAS-950**/
BarChart.prototype.drawThreshold = function() {
	if (IsBoolean(this.m_showxaxisthreshold)) {
		var lineWidth = 0.5;
		var antiAliasing = 0.5;
		var fData = getNumericComparableValue(this.m_xAxis.m_chart.m_xAxisMarkersArray[0]) * 1;
		var lData = getNumericComparableValue(this.m_xAxis.m_chart.m_xAxisMarkersArray[this.m_xAxis.m_chart.m_xAxisMarkersArray.length - 1]) * 1;

		//&& !IsBoolean(this.m_horizontalaxisbasezero)
		this.m_minimumxaxisthreshold = (IsBoolean(this.m_minimumxaxisthresholdline)) ?
			this.m_minimumxaxisthreshold : this.m_xAxis.m_chart.m_xAxis.m_xAxisActualMarkersArray[0];

		var ratio = 1 / (lData - fData);
		var perXPixel = ratio * (this.m_endX * 1 - this.m_startX * 1);
		var pixelValue = {};
		if (IsBoolean(this.m_autoaxissetup) && IsBoolean(this.m_basezero)){
			/*if ((this.m_minimumxaxisthreshold * 1) <= (this.m_maximumxaxisthreshold * 1)) {*/
				if (this.m_minimumxaxisthreshold * 1 < fData) {
					this.m_minimumxaxisthreshold = fData;
				}
				if ((this.m_maximumxaxisthreshold * 1) > lData) {
					this.m_maximumxaxisthreshold = lData;
				}
				if (this.m_maximumxaxisthreshold * 1 < fData) {
					this.m_maximumxaxisthreshold = fData;
				}
				if (this.m_minimumxaxisthreshold * 1 > lData) {
					this.m_minimumxaxisthreshold = lData;
				}
				if ((this.m_minimumxaxisthreshold * 1) < (fData * 1) && (this.m_maximumxaxisthreshold * 1) > (lData * 1)) {
					pixelValue["x1"] = this.m_startX * 1;
					pixelValue["y1"] = this.m_startY * 1;
					pixelValue["x2"] = this.m_startX * 1;
					pixelValue["y2"] = this.m_endY * 1;

					pixelValue["X1"] = this.m_endX * 1;
					pixelValue["Y1"] = this.m_startY * 1;
					pixelValue["X2"] = this.m_endX * 1;
					pixelValue["Y2"] = this.m_endY * 1;
				} else if ((this.m_minimumxaxisthreshold * 1) < (fData * 1)) {
					pixelValue["x1"] = this.m_startX * 1;
					pixelValue["y1"] = this.m_startY * 1;
					pixelValue["x2"] = this.m_startX * 1;
					pixelValue["y2"] = this.m_endY * 1;

					pixelValue["X1"] = this.m_startX * 1 + (this.m_maximumxaxisthreshold * perXPixel);
					pixelValue["Y1"] = this.m_startY * 1;
					pixelValue["X2"] = this.m_startX * 1 + (this.m_maximumxaxisthreshold * perXPixel);
					pixelValue["Y2"] = this.m_endY * 1;
				} else if ((this.m_maximumxaxisthreshold * 1) > (lData * 1)) {
					pixelValue["x1"] = this.m_startX * 1 + (this.m_minimumxaxisthreshold * perXPixel);
					pixelValue["y1"] = this.m_startY * 1;
					pixelValue["x2"] = this.m_startX * 1 + (this.m_minimumxaxisthreshold * perXPixel);
					pixelValue["y2"] = this.m_endY * 1;

					pixelValue["X1"] = this.m_endX * 1;
					pixelValue["Y1"] = this.m_startY * 1;
					pixelValue["X2"] = this.m_endX * 1;
					pixelValue["Y2"] = this.m_endY * 1;
				} else {
					pixelValue["x1"] = this.m_startX * 1 + (this.m_minimumxaxisthreshold * perXPixel);
					pixelValue["y1"] = this.m_startY * 1;
					pixelValue["x2"] = this.m_startX * 1 + (this.m_minimumxaxisthreshold * perXPixel);
					pixelValue["y2"] = this.m_endY * 1;

					pixelValue["X1"] = this.m_startX * 1 + (this.m_maximumxaxisthreshold * perXPixel);
					pixelValue["Y1"] = this.m_startY * 1;
					pixelValue["X2"] = this.m_startX * 1 + (this.m_maximumxaxisthreshold * perXPixel);
					pixelValue["Y2"] = this.m_endY * 1;
				}
			/*} else {
				this.drawSVGMessage(this.m_status.notValidthresholdValues);
			}*/
		} else {
			pixelValue = this.thresholdXAxisCalculation(fData, lData, perXPixel);
		}
		this.m_fillcolorarray = [];
		var strokeStyle = hex2rgb(this.m_markercolor, this.m_markertransparency);
		if (IsBoolean(this.m_minimumxaxisthresholdline)) {
			this.drawLineBetweenPoints(fData,lData,this.m_minimumxaxisthreshold,this.m_xaxisthresholdlinewidth, antiAliasing, this.m_minimumthresholdstrokecolor, pixelValue.x1, pixelValue.y1, pixelValue.x2, pixelValue.y2);
		}
		this.drawLineBetweenPoints(fData,lData,this.m_maximumxaxisthreshold,this.m_xaxisthresholdlinewidth, antiAliasing, this.m_maximumthresholdstrokecolor, pixelValue.X1, pixelValue.Y1, pixelValue.X2, pixelValue.Y2);
		this.fillColorBetweenPoints(this.m_fillcolorarray,lineWidth, antiAliasing, "#ffffff", pixelValue.x1, pixelValue.y2, (pixelValue.X2 - pixelValue.x1), (pixelValue.Y1 - pixelValue.Y2));
	}
};
/** @description x-axis threshold pixel calculation BarChart chart DAS-950**/
BarChart.prototype.thresholdXAxisCalculation = function(fData , lData , perXPixel) {
	var pixelMap = {};
	if (fData < 0) {		// Left Axis is -ve
		if (lData < 0) {		// Left Axis is -ve && Right Axis is -ve
			if ( (this.m_minimumxaxisthreshold*1) < (fData*1) && (this.m_maximumxaxisthreshold*1) > (lData*1) ) {
				pixelMap["x1"] = this.m_startX * 1;
				pixelMap["y1"] = this.m_startY * 1;
				pixelMap["x2"] = this.m_startX * 1;
				pixelMap["y2"] = this.m_endY * 1;
				
				pixelMap["X1"] = this.m_endX * 1;
				pixelMap["Y1"] = this.m_startY * 1;
				pixelMap["X2"] = this.m_endX * 1;
				pixelMap["Y2"] = this.m_endY * 1;
			} else if ( (this.m_minimumxaxisthreshold*1) < (fData*1) ) {
				pixelMap["x1"] = this.m_startX * 1;
				pixelMap["y1"] = this.m_startY * 1;
				pixelMap["x2"] = this.m_startX * 1;
				pixelMap["y2"] = this.m_endY * 1;
				
				pixelMap["X1"] = this.m_startX * 1 + (this.m_maximumxaxisthreshold * perXPixel) - (fData * perXPixel);
				pixelMap["Y1"] = this.m_startY * 1;
				pixelMap["X2"] = this.m_startX * 1 + (this.m_maximumxaxisthreshold * perXPixel) - (fData * perXPixel);
				pixelMap["Y2"] = this.m_endY * 1;
			} else if ( (this.m_maximumxaxisthreshold*1) > (lData*1) ) {
				pixelMap["x1"] = this.m_startX * 1 + (this.m_minimumxaxisthreshold * perXPixel) - (fData * perXPixel);
				pixelMap["y1"] = this.m_startY * 1;
				pixelMap["x2"] = this.m_startX * 1 + (this.m_minimumxaxisthreshold * perXPixel) - (fData * perXPixel);
				pixelMap["y2"] = this.m_endY * 1;
				
				pixelMap["X1"] = this.m_endX * 1;
				pixelMap["Y1"] = this.m_startY * 1;
				pixelMap["X2"] = this.m_endX * 1;
				pixelMap["Y2"] = this.m_endY * 1;
			} else {
				pixelMap["x1"] = this.m_startX * 1 + (this.m_minimumxaxisthreshold * perXPixel) - (fData * perXPixel);
				pixelMap["y1"] = this.m_startY * 1;
				pixelMap["x2"] = this.m_startX * 1 + (this.m_minimumxaxisthreshold * perXPixel) - (fData * perXPixel);
				pixelMap["y2"] = this.m_endY * 1;
				
				pixelMap["X1"] = this.m_startX * 1 + (this.m_maximumxaxisthreshold * perXPixel) - (fData * perXPixel);
				pixelMap["Y1"] = this.m_startY * 1;
				pixelMap["X2"] = this.m_startX * 1 + (this.m_maximumxaxisthreshold * perXPixel) - (fData * perXPixel);
				pixelMap["Y2"] = this.m_endY * 1;
			}
		} else {		// Left Axis is -ve && Right Axis is +ve
			/*if ((this.m_minimumxaxisthreshold * 1) <= (this.m_maximumxaxisthreshold * 1)) {*/
				if (this.m_minimumxaxisthreshold * 1 < fData) {
					this.m_minimumxaxisthreshold = fData;
				}
				if ((this.m_maximumxaxisthreshold * 1) > lData) {
					this.m_maximumxaxisthreshold = lData;
				}
				if (this.m_maximumxaxisthreshold * 1 < fData) {
					this.m_maximumxaxisthreshold = fData;
				}
				if (this.m_minimumxaxisthreshold * 1 > lData) {
					this.m_minimumxaxisthreshold = lData;
				}
				if ((this.m_minimumxaxisthreshold * 1) < (fData * 1) && (this.m_maximumxaxisthreshold * 1) > (lData * 1)) {
					pixelMap["x1"] = this.m_startX * 1;
					pixelMap["y1"] = this.m_startY * 1;
					pixelMap["x2"] = this.m_startX * 1;
					pixelMap["y2"] = this.m_endY * 1;

					pixelMap["X1"] = this.m_endX * 1;
					pixelMap["Y1"] = this.m_startY * 1;
					pixelMap["X2"] = this.m_endX * 1;
					pixelMap["Y2"] = this.m_endY * 1;
				} else if ((this.m_minimumxaxisthreshold * 1) < (fData * 1)) {
					pixelMap["x1"] = this.m_startX * 1;
					pixelMap["y1"] = this.m_startY * 1;
					pixelMap["x2"] = this.m_startX * 1;
					pixelMap["y2"] = this.m_endY * 1;

					pixelMap["X1"] = this.m_startX * 1 + (this.m_maximumxaxisthreshold * perXPixel) - (fData * perXPixel);
					pixelMap["Y1"] = this.m_startY * 1;
					pixelMap["X2"] = this.m_startX * 1 + (this.m_maximumxaxisthreshold * perXPixel) - (fData * perXPixel);
					pixelMap["Y2"] = this.m_endY * 1;
				} else if ((this.m_maximumxaxisthreshold * 1) > (lData * 1)) {
					pixelMap["x1"] = this.m_startX * 1 + (this.m_minimumxaxisthreshold * perXPixel) - (fData * perXPixel);
					pixelMap["y1"] = this.m_startY * 1;
					pixelMap["x2"] = this.m_startX * 1 + (this.m_minimumxaxisthreshold * perXPixel) - (fData * perXPixel);
					pixelMap["y2"] = this.m_endY * 1;

					pixelMap["X1"] = this.m_endX * 1;
					pixelMap["Y1"] = this.m_startY * 1;
					pixelMap["X2"] = this.m_endX * 1;
					pixelMap["Y2"] = this.m_endY * 1;
				} else {
					pixelMap["x1"] = this.m_startX * 1 + (this.m_minimumxaxisthreshold * perXPixel) - (fData * perXPixel);
					pixelMap["y1"] = this.m_startY * 1;
					pixelMap["x2"] = this.m_startX * 1 + (this.m_minimumxaxisthreshold * perXPixel) - (fData * perXPixel);
					pixelMap["y2"] = this.m_endY * 1;

					pixelMap["X1"] = this.m_startX * 1 + (this.m_maximumxaxisthreshold * perXPixel) - (fData * perXPixel);
					pixelMap["Y1"] = this.m_startY * 1;
					pixelMap["X2"] = this.m_startX * 1 + (this.m_maximumxaxisthreshold * perXPixel) - (fData * perXPixel);
					pixelMap["Y2"] = this.m_endY * 1;
				}
			/*} else {
				this.drawSVGMessage(this.m_status.notValidthresholdValues);
			}*/
		}
	} else {
		if (lData < 0){		// Left Axis is +ve && Right Axis is -ve
//			console.log("C");
		} else {		// Left Axis is +ve && Right Axis is +ve
	/*		if ((this.m_minimumxaxisthreshold * 1) <= (this.m_maximumxaxisthreshold * 1)) {*/
				if (this.m_minimumxaxisthreshold * 1 < fData) {
					this.m_minimumxaxisthreshold = fData;
				}
				if ((this.m_maximumxaxisthreshold * 1) > lData) {
					this.m_maximumxaxisthreshold = lData;
				}
				if (this.m_maximumxaxisthreshold * 1 < fData) {
					this.m_maximumxaxisthreshold = fData;
				}
				if (this.m_minimumxaxisthreshold * 1 > lData) {
					this.m_minimumxaxisthreshold = lData;
				}
				if ((this.m_minimumxaxisthreshold * 1) < (fData * 1) && (this.m_maximumxaxisthreshold * 1) > (lData * 1)) {
					pixelMap["x1"] = this.m_startX * 1;
					pixelMap["y1"] = this.m_startY * 1;
					pixelMap["x2"] = this.m_startX * 1;
					pixelMap["y2"] = this.m_endY * 1;

					pixelMap["X1"] = this.m_endX * 1;
					pixelMap["Y1"] = this.m_startY * 1;
					pixelMap["X2"] = this.m_endX * 1;
					pixelMap["Y2"] = this.m_endY * 1;
				} else if ((this.m_minimumxaxisthreshold * 1) < (fData * 1)) {
					pixelMap["x1"] = this.m_startX * 1;
					pixelMap["y1"] = this.m_startY * 1;
					pixelMap["x2"] = this.m_startX * 1;
					pixelMap["y2"] = this.m_endY * 1;

					pixelMap["X1"] = this.m_startX * 1 + (this.m_maximumxaxisthreshold * perXPixel) - (fData * perXPixel);
					pixelMap["Y1"] = this.m_startY * 1;
					pixelMap["X2"] = this.m_startX * 1 + (this.m_maximumxaxisthreshold * perXPixel) - (fData * perXPixel);
					pixelMap["Y2"] = this.m_endY * 1;
				} else if ((this.m_maximumxaxisthreshold * 1) > (lData * 1)) {
					pixelMap["x1"] = this.m_startX * 1 + (this.m_minimumxaxisthreshold * perXPixel) - (fData * perXPixel);
					pixelMap["y1"] = this.m_startY * 1;
					pixelMap["x2"] = this.m_startX * 1 + (this.m_minimumxaxisthreshold * perXPixel) - (fData * perXPixel);
					pixelMap["y2"] = this.m_endY * 1;

					pixelMap["X1"] = this.m_endX * 1;
					pixelMap["Y1"] = this.m_startY * 1;
					pixelMap["X2"] = this.m_endX * 1;
					pixelMap["Y2"] = this.m_endY * 1;
				} else {
					pixelMap["x1"] = this.m_startX * 1 + (this.m_minimumxaxisthreshold * perXPixel) - (fData * perXPixel);
					pixelMap["y1"] = this.m_startY * 1;
					pixelMap["x2"] = this.m_startX * 1 + (this.m_minimumxaxisthreshold * perXPixel) - (fData * perXPixel);
					pixelMap["y2"] = this.m_endY * 1;

					pixelMap["X1"] = this.m_startX * 1 + (this.m_maximumxaxisthreshold * perXPixel) - (fData * perXPixel);
					pixelMap["Y1"] = this.m_startY * 1;
					pixelMap["X2"] = this.m_startX * 1 + (this.m_maximumxaxisthreshold * perXPixel) - (fData * perXPixel);
					pixelMap["Y2"] = this.m_endY * 1;

				}
			/*} else {
				this.drawSVGMessage(this.m_status.notValidthresholdValues);
			}*/
		}
	}
	return pixelMap;
};
/** @description joining line on  Bar chart DAS-950**/
BarChart.prototype.drawLineBetweenPoints = function(fdata,ldata,thresholdvalue,lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2, opacity) {
	if ((x1 && x1 != Infinity) && (x2 != Infinity && x2)) {
		var fillcolor = hex2rgb(strokeColor, opacity);
		var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line.setAttribute('x1', x1);
		line.setAttribute('y1', y1);
		line.setAttribute('x2', x2);
		line.setAttribute('y2', y2);
		line.setAttribute('stroke', fillcolor);
		line.setAttribute('stroke-width', lineWidth);
		$("#" + this.svgContainerId).append(line);
		//points to fill theshold lines
		if (thresholdvalue > fdata && thresholdvalue < ldata) {
			var lines = { "X1": x1, "Y1": y1, "X2": x2, "Y2": y2 };
			this.m_fillcolorarray.push(lines);
		}
	}
};

/** @description filling color for threshold range on Scattered Plot chart**/
BarChart.prototype.fillColorBetweenPoints = function(fillArray, lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2) {
	if (IsBoolean(this.m_enablethresholdfill) && fillArray.length > 0) {
		var minX, maxX;
		minX = fillArray[0].X1;
		maxX = fillArray[0].X1;

		for (var i = 1; i < fillArray.length; i++) {
			var point = fillArray[i];
			if (point.X1 < minX) {
				minX = point.X1;
			}
			if (point.X1 > maxX) {
				maxX = point.X1;
			}
		}

		var point = fillArray[0];
		var Y1 = point.Y1;
		var Y2 = point.Y2;

		var minY = Math.min(Y1, Y2);
		var maxY = Math.max(Y1, Y2);

		// Fill color between minX and startX
		var minX1 = Math.min(maxX, this.m_startX);
		var maxX1 = Math.max(maxX, this.m_startX);
		var width1 = minX - minX1;
		var height1 = maxY - minY;

		var centerX = minX1 + width1 / 2;/*label*/
		var centerY = minY + height1 / 2;/*label*/

		var fillStyle = hex2rgb(this.m_fillBelowLowerThreshold, this.m_fillBelowThresholdOpacity * 1);
		var rect1 = drawSVGRect(minX1, minY, width1, height1, fillStyle);
		$("#" + this.svgContainerId).append(rect1)

		/*label drawing*/
		var text1 = drawSVGText(centerX, centerY, this.m_BelowThresholdLabel, hex2rgb(this.m_BelowThresholdLabelColor, 1), "center", "middle", 0);
		text1.setAttribute("style", "font-family:" + selectGlobalFont(this.m_statusfontfamily) + ";font-style:none;font-size:16px;font-weight:normal;text-decoration:none;");
		var metrics = this.ctx.measureText(this.m_BelowThresholdLabel);
		if (metrics.width <= width1) {
			$("#" + this.svgContainerId).append(text1);
		}

		// Fill color between minX and maxX
		var minX2 = minX;
		var maxX2 = maxX;
		var width2 = maxX2 - minX2;
		var fillStyle = hex2rgb(this.m_fillBetweenThreshold, this.m_fillBetweenThresholdOpacity * 1);
		var rect2 = drawSVGRect(minX2, minY, width2, height1, fillStyle);
		$("#" + this.svgContainerId).append(rect2)

		/*label drawing*/
		var centerX2 = minX2 + width2 / 2;/*label*/
		if (width2 > 0) {
			var text2 = drawSVGText(centerX2, centerY, this.m_BetweenThresholdLabel, hex2rgb(this.m_BetweenThresholdLabelColor, 1), "center", "middle", 0);
			text2.setAttribute("style", "font-family:" + selectGlobalFont(this.m_statusfontfamily) + ";font-style:none;font-size:16px;font-weight:normal;text-decoration:none;");
			var metrics2 = this.ctx.measureText(this.m_BetweenThresholdLabel);
			if (metrics2.width <= width2) {
				$("#" + this.svgContainerId).append(text2);
			}
		}

		// Fill color between maxX and endX
		var minX3 = Math.min(maxX, this.m_endX);
		var maxX3 = Math.max(maxX, this.m_endX);
		var width3 = maxX3 - minX3;

		var centerX3 = minX3 + width3 / 2/*label*/

		var fillStyle = hex2rgb(this.m_fillAboveUpperThreshold, this.m_fillUpperThresholdOpacity * 1);
		var rect3 = drawSVGRect(minX3, minY, width3, height1, fillStyle);
		$("#" + this.svgContainerId).append(rect3);
		// label drawing
		var text3 = drawSVGText(centerX3, centerY, this.m_UpperThresholdLabel, hex2rgb(this.m_UpperThresholdLabelColor, 1), "center", "middle", 0);
		text3.setAttribute("style", "font-family:" + selectGlobalFont(this.m_statusfontfamily) + ";font-style:none;font-size:16px;font-weight:normal;text-decoration:none;");
		var metrics3 = this.ctx.measureText(this.m_UpperThresholdLabel);
		if (metrics3.width <= width3) {
			$("#" + this.svgContainerId).append(text3);
		}

	}

};
/** @description Setter Method to set ThresholdFillColors. **/
BarChart.prototype.setThresholdFillColors = function() {
	if (this.m_thresholdfillcolor.length > 0) {
		var color = this.m_thresholdfillcolor.split(",");
		var level = this.m_thresholdfilllevel.split(",");
		var opacity = this.m_thresholdfillopacity.split(",");
		var label = this.m_thresholdfilllabel.split(",");
		var labelColor = this.m_thresholdfilllabelcolor.split(",");
		this.m_fillBelowLowerThreshold = color[0];
		this.m_fillBetweenThreshold = color[1];
		this.m_fillAboveUpperThreshold = color[2];

		this.m_fillBelowThresholdOpacity = opacity[0];
		this.m_fillBetweenThresholdOpacity = opacity[1];
		this.m_fillUpperThresholdOpacity = opacity[2];

		this.m_BelowThresholdLabel = label[0];
		this.m_BetweenThresholdLabel = label[1];
		this.m_UpperThresholdLabel = label[2];

		this.m_BelowThresholdLabelColor = labelColor[0];
		this.m_BetweenThresholdLabelColor = labelColor[1];
		this.m_UpperThresholdLabelColor = labelColor[2];
	}
};
/** @description Get Sum of Array**/
BarChart.prototype.getArraySUM = function (arr) {
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
BarChart.prototype.getUpdateSeriesDataWithCategory = function (arr) {
	var updateArray = [];
	for (var i = 0, length = arr[0].length; i < length ; i++) {
		updateArray[i] = [];
		for (var j = 0, dataLength = arr.length; j < dataLength ; j++) {
			updateArray[i][j] = arr[j][i];
		}
	}
	return updateArray;
};

/** @description Calaculated Sum of Data and Percentage of Data from total sum of data **/
BarChart.prototype.setPercentageForHundred = function () {
	var serData = this.getUpdateSeriesDataWithCategory(this.visibleSeriesInfo.seriesData);
	this.m_SeriesDataInPerForHundredChart;
	var updateValue = [];
	for (var i = 0, length = serData.length; i < length; i++) {
		var totalSerData = this.getArraySUM(serData[i]);
		updateValue[i] = [];
		for (var j = 0, dataLength = serData[i].length ; j < dataLength; j++) {
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
BarChart.prototype.getUpdateSeriesDataForHundredPercentageChart = function (arr) {
	var updatArray = [];
	for (var i = 0, length = arr[0].length; i < length; i++) {
		updatArray[i] = [];
		for (var j = 0, dataLength = arr.length; j < dataLength ; j++) {
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
BarChart.prototype.getPercentageForHundred = function () {
	return this.m_SeriesDataInPerForHundredChart;
};
BarChart.prototype.getVisibleActualSeriesData = function () {
	var seriesData = [];
	for (var k = 0, i1 = 0;this.visibleSeriesInfo.seriesData.length > i1; i1++) {
		this.m_seriesDataForToolTip[i1] = this.visibleSeriesInfo.seriesData[i1]
	   /* if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i1]])) {*///on legend checkbox chart visible data was breaking on tooltip.
	        seriesData[k] = [];
	        seriesData[k] = this.m_seriesDataForToolTip[i1];
	        k++;
	    //}
	}
	return seriesData;
};

/** @description Creation of ToolTip Data**/
BarChart.prototype.getToolTipData = function (mouseX, mouseY) {
	var toolTipData;
	if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory) && IsBoolean(this.isVisibleSeries()) && IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")) {
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
					if (this.m_customtextboxfortooltip.dataTipType == "Default"){
						for (var j = 0, k = 0, datalength = seriesData.length; j < datalength; j++) {
							isNaNValue = false;
							var data = [];
							data[0] = {"shape":this.legendMap[this.getSeriesNames()[j]].shape};
							/*Added to show drill color or indicator color in the tooltip*/
							if (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) {
								data[0]["color"] = (this.m_charttype != "overlaid") ? this.getColorsForSeries()[j][i] : this.m_drillColor;
							}else{
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
								if (this.m_tooltipproperties.tooltippercentprecision== "auto") {
								    if (countDecimal((percentageData[j][i]).toString()) == 0) {
								        data[3] = (percentageData[j][i]) + "%";
								    } else {
								    	data[3] = (percentageData[j][i]).toFixed(2);
								        if(data[3] % 1 == 0) {
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
								for(var n = 0; n <= j; n++){
									if (!isNaN(percentageData[n][i]))
									  cumpec += (percentageData[n][i]);
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
	return toolTipData;
};

/** @description Get Drill Color**/
BarChart.prototype.getDrillColor = function (mouseX, mouseY) {
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory)))) {
		this.xPositionArr = this.m_calculation.getXPositionArray();
		this.yAxisDataArray = this.m_calculation.getYPositionArray();
		this.m_barWidthArray = this.m_calculation.getstackHeightArray();

		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			var barWidth;
			/**Added to resolve BDD-682 issue*/
			var drillMinStackHeight = (this.m_charttype == "stacked") ? 0 : this.m_drillminstackheight;
			if(IsBoolean(this.m_basezero)){
				var seriesData = this.getVisibleActualSeriesData();
			}
			if (this.m_charttype != "overlaid") {
				for (var i = 0, length = this.yAxisDataArray.length; i < length ; i++) {
					for (var j = 0, datalength = this.yAxisDataArray[i].length; j < datalength; j++) {
						if (this.m_barWidthArray[i][j] * 1 < 0) {
							barWidth = (this.m_barWidthArray[i][j] * 1 < -drillMinStackHeight ) ? this.m_barWidthArray[i][j] * 1 : -drillMinStackHeight;
							var range1 = this.xPositionArr[i][j] * 1;
							var range2 = this.xPositionArr[i][j] * 1 + barWidth
						} else {
							barWidth = (IsBoolean(this.m_basezero)&&(seriesData[i][j] * 1 < 0)) ? 0 : (this.m_barWidthArray[i][j] * 1 > drillMinStackHeight ) ? this.m_barWidthArray[i][j] * 1 : drillMinStackHeight;
							var range1 = this.xPositionArr[i][j] * 1 + barWidth;
							var range2 = this.xPositionArr[i][j] * 1;
						}
						if (mouseX <= range1 && mouseX >= range2 && mouseY <= (this.yAxisDataArray[i][j] * 1 + this.m_barWidth * 1) && (mouseY >= this.yAxisDataArray[i][j] * 1)) {
							return i;
						}
					}
				}
			} else {
				for (var i = this.yAxisDataArray.length-1; i >=0 ; i--) {
					for (var j = this.yAxisDataArray[i].length-1; j>=0; j--) {
						if (this.m_barWidthArray[i][j] * 1 < 0) {
							barWidth = (this.m_barWidthArray[i][j] * 1 < -drillMinStackHeight ) ? this.m_barWidthArray[i][j] * 1 : -drillMinStackHeight;
							var range1 = this.xPositionArr[i][j] * 1;
							var range2 = this.xPositionArr[i][j] * 1 + barWidth
						} else {
							barWidth = (IsBoolean(this.m_basezero)&&(seriesData[i][j] * 1 < 0)) ? 0 : (this.m_barWidthArray[i][j] * 1 > drillMinStackHeight ) ? this.m_barWidthArray[i][j] * 1 : drillMinStackHeight;
							var range1 = this.xPositionArr[i][j] * 1 + barWidth;
							var range2 = this.xPositionArr[i][j]* 1;
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
BarChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory))) && IsBoolean(this.isVisibleSeries())) {
		this.xPositionArr = this.m_calculation.getXPositionArray();
		this.yAxisDataArray = this.m_calculation.getYPositionArray();
		this.m_barWidthArray = this.m_calculation.getstackHeightArray();

		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			var barWidth;
			var isDrillIndexFound = false;
			var drillMinStackHeight = (this.m_charttype == "stacked") ? 0 : this.m_drillminstackheight;
			if(IsBoolean(this.m_basezero)){
				var seriesData = this.getVisibleActualSeriesData();
			}
			if(this.m_charttype != "overlaid"){
				for (var i = 0, length = this.yAxisDataArray.length; i < length; i++) {
					for (var j = 0, dataLength = this.yAxisDataArray[i].length; j < dataLength; j++) {
						if (this.m_barWidthArray[i][j] * 1 < 0) {
							barWidth = (this.m_barWidthArray[i][j] * 1 < -drillMinStackHeight ) ? this.m_barWidthArray[i][j] * 1 : -drillMinStackHeight;
							var range1 = this.xPositionArr[i][j] * 1;
							var range2 = this.xPositionArr[i][j] * 1 + barWidth;
						} else {
							barWidth = (IsBoolean(this.m_basezero)&&(seriesData[i][j] * 1 < 0)) ? 0 : (this.m_barWidthArray[i][j] * 1 > drillMinStackHeight ) ? this.m_barWidthArray[i][j] * 1 : drillMinStackHeight;
							var range1 = this.xPositionArr[i][j] * 1 + barWidth;
							var range2 = this.xPositionArr[i][j] * 1;
						}
						if (mouseX <= range1 && mouseX >= range2 && mouseY <= (this.yAxisDataArray[i][j] * 1 + this.m_barWidth * 1) && (mouseY >= this.yAxisDataArray[i][j] * 1)) {
							var fieldNameValueMap = this.getFieldNameValueMap(j);
							/**Clicked color drills as the drill-color not series color.*/
							var drillColor = this.getColorsForSeries()[i][j];
							var drillField =this.visibleSeriesInfo.seriesName[i];
							var drillDisplayField = this.visibleSeriesInfo.seriesDisplayName[i];
							var drillValue = fieldNameValueMap[drillField];
							fieldNameValueMap.drillField = drillField;
							fieldNameValueMap.drillDisplayField = drillDisplayField;
							fieldNameValueMap.drillValue = drillValue;
							
							isDrillIndexFound = true;
							fieldNameValueMap.drillIndex = j;
							 var drillCategory = this.m_categoryNames;
							    var drillCategoriesValue=[]
							    for(var j=0;j<drillCategory.length;j++){
							    	drillCategoriesValue.push(fieldNameValueMap[drillCategory[j]]);
							    }
							    fieldNameValueMap.drillCategoryNames = drillCategory; 
								fieldNameValueMap.drillCategory = drillCategoriesValue;
								if(IsBoolean(this.m_drilltoggle)){
									this.m_drilltoggle = false;
								} else {
									this.m_drilltoggle = true;
								}
								
							return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
						}
					}
				}
				if(this.m_charttype == "stacked" && !isDrillIndexFound) {
					for (var k = 0, length = this.yPositions.length; k < length; k++) {
						if (mouseY <= (this.yPositions[k] * 1 + this.m_barWidth * 1) && (mouseY >= this.yPositions[k] * 1)) {
							for(var l = 0,innerlength = this.xPositionArr.length; l < innerlength; l++){
								if(((mouseX >= this.xPositionArr[l][k]) && (mouseX <= this.xPositionArr[l][k] + this.m_drillminstackheight)) || ((mouseX <= this.xPositionArr[l][k] + this.m_barWidthArray[l][k])  && (mouseX >= this.xPositionArr[l][k] - this.m_drillminstackheight))) {
									var fieldNameValueMap = this.getFieldNameValueMap(k);
									var drillColor = this.m_drillColor;
									var drillField = "";
									var drillDisplayField = "";
									var drillValue = "";
									fieldNameValueMap.drillField = drillField;
									fieldNameValueMap.drillDisplayField = drillDisplayField;
									fieldNameValueMap.drillValue = drillValue;
									isDrillIndexFound = true;
									return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
								}
							}
						}
					}
				}
			} else {
				for (var i = this.yAxisDataArray.length-1; i >= 0; i--) {
					for (var j = this.yAxisDataArray[i].length-1; j >= 0; j--) {
						if (this.m_barWidthArray[i][j] * 1 < 0) {
							barWidth = (this.m_barWidthArray[i][j] * 1 < -drillMinStackHeight) ? this.m_barWidthArray[i][j] * 1 : -drillMinStackHeight;
							var range1 = this.xPositionArr[i][j] * 1;
							var range2 = this.xPositionArr[i][j] * 1 + barWidth;
						} else {
							barWidth = (IsBoolean(this.m_basezero)&&(seriesData[i][j] * 1 < 0)) ? 0 : (this.m_barWidthArray[i][j] * 1 > drillMinStackHeight ) ? this.m_barWidthArray[i][j] * 1 : drillMinStackHeight;
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
							if(IsBoolean(this.m_drilltoggle)){
								this.m_drilltoggle = false;
							} else {
								this.m_drilltoggle = true;
							}
							return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
						}
					}
				}
			}
		}
	}
};

/** @description Starting Of Bar Calculation**/
function BarCalculation() {
	this.xPositionArray = [];
	this.yAxisPixelArray = [];
	this.xPositionMap = {};//DAS-564 Added to support slider in Barchart 
	this.yPositionMap = {};
	this.barGap = 10;
	this.m_xAxisText = "";
	this.m_numberOfMarkers = 6;
	this.minSliderIndex="";//DAS-564 Added to support slider in Barchart 
	this.maxSliderIndex="";
};

/** @description Bar Calculation Initialization**/
BarCalculation.prototype.init = function (chart, categorydata, seriesdata) {
	this.m_chart = chart;
	this.yAxisData = categorydata;
	this.xAxisData = seriesdata;// this.m_chart.getVisibleSeriesData(convertArrayType(seriesdata));
	if (this.m_chart.m_charttype == "clustered") {
		this.m_maxbarwidth = this.m_chart.m_maxbarwidth * (1 + (this.xAxisData.length - 1) * 0.5);
	} else {
		this.m_maxbarwidth = this.m_chart.m_maxbarwidth;
	}
	this.m_chartType = this.m_chart.getChartType();
	if (this.m_chartType.toLowerCase() == "stacked" || this.m_chartType == "100%" || this.m_chartType == "")
		this.xAxisData = this.setStackedData(this.xAxisData);

	this.barGap = 10;
	this.startX = this.m_chart.getStartX();
	this.startY = this.m_chart.getStartY();
	this.endX = this.m_chart.getEndX();
	this.endY = this.m_chart.getEndY();
	this.calculateBarWidth();
	this.setRatio();
	this.setXPositionArray();
	this.setYPositionArray();
};

/** @description Getter for StartX **/
BarCalculation.prototype.getStartX = function () {
	return this.startX * 1;
};

/** @description Get Max Value from series Data**/
BarCalculation.prototype.getMaxValue = function () {
	return this.m_chart.max;
};

/** @description Get Min Value From Series Data**/
BarCalculation.prototype.getMinValue = function () {
	return this.m_chart.min;
};

/** @description Get X Axis Text**/
BarCalculation.prototype.getXAxisText = function () {
	return this.m_chart.m_xAxisText;
};

/** @description Get X Axis Marker Array**/
BarCalculation.prototype.getXAxisMarkersArray = function () {
	return this.m_chart.m_xAxisMarkersArray;
};

/** @description Calculate Bar Width**/
BarCalculation.prototype.calculateBarWidth = function () {
	var numberOfColumns = this.yAxisData.length;
	var totalGap = ((numberOfColumns * 1)) * this.barGap;
	var availableDrawWidth = this.getDrawHeight() * 1;        /*(this.getDrawHeight() * 1 - totalGap * 1);*/
	if(this.m_chart.m_controlbarwidth  == "auto") {
		var barWidth = (availableDrawWidth / numberOfColumns);
		barWidth = (barWidth * this.m_chart.m_barwidth)/100;
	} else {
		if (this.m_chart.m_controlbarwidth < (availableDrawWidth / numberOfColumns)) {
		    var barWidth = this.m_chart.m_controlbarwidth;
		} else {
		    var barWidth = (availableDrawWidth / numberOfColumns);
		    barWidth = (barWidth * this.m_chart.m_barwidth) / 100;
		}
	}
	//DAS-564 Added to support slider in Barchart 
		var maxDate = new Date(this.maxDate).getTime();
		maxDate = isNaN(maxDate) ? 0.001 : maxDate;
		var minDate = new Date(this.minDate).getTime();
		minDate = isNaN(minDate) ? 0 : minDate;
		var widthForOneMS = (availableDrawWidth) / (maxDate - minDate);
		var freqInMS = this.getDataFrequencyInMS(this.yAxisData);
		var onePart = widthForOneMS * freqInMS;
		widthForOneMS = (availableDrawWidth) / (maxDate - minDate + freqInMS);
		onePart = widthForOneMS * freqInMS;
		this.minSliderIndex=0;
		this.maxSliderIndex=parseInt(availableDrawWidth/onePart);
	
	/*if (barWidth > this.m_maxbarwidth) {
		this.setBarWidth(this.m_maxbarwidth);
		this.setColumnGap(this.m_maxbarwidth);
	} else if (barWidth < 9) {
		this.setBarWidth(7);
		this.setColumnGap(7);
	} else {
		this.setBarWidth(barWidth);
	}*/
	this.setBarWidth(barWidth);
	this.setColumnGap(barWidth);
};

/** @description return minimum frequency in miliseconds **/
BarCalculation.prototype.getDataFrequencyInMS = function (xAxisData) {
	var date1 = new Date(isNaN(xAxisData[0]) ? xAxisData[0] : (xAxisData[0] * 1));
	var date2 = new Date(isNaN(xAxisData[1]) ? xAxisData[1] : (xAxisData[1] * 1));
	var minDiff = Math.abs(Math.floor(date1.getTime() - date2.getTime()));
	var xaxisdataLength = xAxisData.length;
	for (var i = 0; i < xaxisdataLength; i++) {
		if (i >= 1) {
			var date1 = new Date(isNaN(xAxisData[i - 1]) ? xAxisData[i - 1] : (xAxisData[i - 1] * 1));
			var date2 = new Date(isNaN(xAxisData[i]) ? xAxisData[i] : (xAxisData[i] * 1));
			var diff = Math.abs(Math.floor(date1.getTime() - date2.getTime()));
			if (minDiff === 0 && diff !== 0)
				minDiff = diff;
			minDiff = (diff < minDiff && diff != 0) ? diff : minDiff;
		}
	}
	return ((minDiff/86400000==28)||(minDiff/86400000==29))?(30*86400000):minDiff;
};

/** @description Setter For Bar Width**/
BarCalculation.prototype.setBarWidth = function (barwidth) {
	this.barWidth = barwidth;
	if ((this.m_chart.m_charttype).toLowerCase() == "clustered") {
		this.barWidth /= this.xAxisData.length;
	}
};

/** @description Setter for column Gap**/
BarCalculation.prototype.setColumnGap = function (barWidth) {
	var totalBarwidth = barWidth * this.yAxisData.length;
	var totalGap = this.getDrawHeight() - totalBarwidth;
	this.barGap = totalGap / ((this.yAxisData.length * 1));
};

/** @description Draw Base Line**/
BarCalculation.prototype.drawBaseLine = function () {
	ctx.beginPath();
	ctx.lineWidth = "0.4";
	ctx.strokeStyle = "#000";
	ctx.moveTo(this.getStartX(), this.startY);
	ctx.lineTo(this.getStartX(), this.endY);
	ctx.stroke();
	ctx.closePath();
};

/** @description Making Data For Stack**/
BarCalculation.prototype.setStackedData = function(seriesData) {
    var data = [];
    for (var i = 0, length = seriesData.length; i < length; i++) {
        data[i] = [];
        for (var j = 0, dataLength = seriesData[i].length; j < dataLength; j++) {
            if (isNaN(seriesData[i][j]))
                data[i][j] = 0;
            else
                data[i][j] = seriesData[i][j];
        }
    }
    return data;
};

/** @description Calculation of Ratio in respect to Chart Width and Chart Max Min Value**/
BarCalculation.prototype.setRatio = function() {
    this.ratio = this.getDrawWidth() / (this.getMaxValue() - this.getMinValue());
};

/** @description Calculating Ratio for Hundred Percent**/
BarCalculation.prototype.setRatioForHundredPercent = function () {
	this.m_hundredPercentsRatios = [];
	for (var i = 0, length = this.xAxisData[0].length; i < length; i++) {
		var sum = 0;
		for (var j = 0, datalength = this.xAxisData.length; j < datalength; j++) {
			sum = (sum) * 1 + (this.xAxisData[j][i]) * 1;
		}
		if(sum == 0){
			sum = 1;
		}
		this.m_hundredPercentsRatios[i] = (this.getDrawWidth() / sum);
	}
};

/** @description Calculating Height for Drawing**/
BarCalculation.prototype.getDrawHeight = function () {
	this.drawHeight = (this.startY - this.endY);
	return this.drawHeight;
};

/** @description Calculating Width For Drawing*/
BarCalculation.prototype.getDrawWidth = function () {
	this.drawWidth = (this.endX * 1) - (this.startX * 1);
	return this.drawWidth;
};

/** @description Getter For Bar Gap**/
BarCalculation.prototype.getBarGap = function () {
	return this.barGap;
};

/** @description Getter For Bar Width**/
BarCalculation.prototype.getbarWidth = function () {
	return this.barWidth;
};

/** @description Getter for Ratio**/
BarCalculation.prototype.getRatio = function () {
	return this.ratio;
};

/** @description Getter for HundredPercent Chart**/
BarCalculation.prototype.getRatioForHundredPercent = function (index) {
	return this.m_hundredPercentsRatios[index];
};

/** @description Getter for XPosition Array ,it contains each data's pixel value**/
BarCalculation.prototype.getXPositionArray = function () {
	return this.xPositionArray;
};

/** @description Setter For X Position Array**/
BarCalculation.prototype.setXPositionArray = function() {
    this.xPositionArray = [];
    this.stackHeightArray = [];
    var xparray = [];
    var positivePointerArray = [];
    var negativePointerArray = [];
    this.m_startX = this.getStartX();
    this.m_xAxisData = this.xAxisData;
    if ((this.m_chart.m_charttype).toLowerCase() == "overlaid") {
        var newYAxisData = this.arrangeDataForOverlaid();
        this.setSeriesColorForOverlaid(newYAxisData[1]);
        /**Added this variable for data label, to support null & any string type data.*/
    	this.m_chart.m_actualseriesdatamap = getDuplicateObject( this.xAxisData );
        this.xAxisData = newYAxisData[0];
        this.m_chart.m_seriesDataForDataLabel = newYAxisData[3];
    	this.m_chart.m_seriesDataLabelPropertyOverlaid = newYAxisData[4];
    }

    for (var i = 0, length = this.xAxisData.length; i < length; i++) {
        this.xPositionArray[i] = [];
        this.stackHeightArray[i] = [];
        var xAxisData = (this.m_chartType === "100%") ? this.m_chart.getPercentageForHundred() : this.xAxisData;
        xparray[i] = [];
        var ratio1 = this.getRatio();
        positivePointerArray[i] = [];
        negativePointerArray[i] = [];
        this.stackHeightArray[i] = [];
        for (var j = 0, dataLength = this.xAxisData[i].length; j < dataLength; j++) {
            
                if ((this.m_chart.m_charttype).toLowerCase() == "clustered" || this.m_chart.m_charttype.toLowerCase() == "overlaid") {

                    if (this.xAxisData[i][j] * 1 > this.getMaxValue())
                        this.xAxisData[i][j] = this.getMaxValue();
                    if (this.xAxisData[i][j] * 1 < this.getMinValue())
                        this.xAxisData[i][j] = this.getMinValue();

                    if (this.getMaxValue() < 0) {
                        var startx = this.getStartX() + (Math.abs(this.getMinValue()-this.getMaxValue()) * ratio1);
                        var value = this.xAxisData[i][j]-this.getMaxValue();
                    } else if(this.getMinValue() < 0){
                    	var startx = this.getStartX() + (Math.abs(this.getMinValue()) * ratio1);
						var value = this.xAxisData[i][j];
                    }else {
                        var startx = this.getStartX();
                        var value = (this.xAxisData[i][j] - this.getMinValue());
                    }
                    this.xPositionArray[i][j] = startx * 1;
                    this.stackHeightArray[i][j] = (value * 1) * ratio1;
                } else {
                    if (isNaN(xAxisData[i][j])) {
                        xAxisData[i][j] = "";
                    }
                    if (i == 0) {
                        if (xAxisData[i][j] * 1 >= 0) {
                            if ((this.m_chart.m_minimumaxisvalue * 1 > 0) && (!IsBoolean(this.m_chart.isAxisSetup())))
                                xparray[i][j] = (this.m_startX);
                            else
                                xparray[i][j] = ((this.m_startX) - (ratio1) * this.getMinValue());
                            positivePointerArray[i][j] = xparray[i][j] + xAxisData[i][j] * ratio1;
                            negativePointerArray[i][j] = xparray[i][j] * 1;
                        } else {
                            xparray[i][j] = ((this.m_startX) - (ratio1) * this.getMinValue());
                            negativePointerArray[i][j] = xparray[i][j] + xAxisData[i][j] * ratio1 * 1;
                            positivePointerArray[i][j] = (this.m_startX) * 1 - (ratio1) * this.getMinValue();
                        }
                    } else {
                        if (this.m_xAxisData[i][j] >= 0) {
                            positivePointerArray[i][j] = positivePointerArray[i - 1][j];
                            negativePointerArray[i][j] = negativePointerArray[i - 1][j];
                            xparray[i][j] = (positivePointerArray[i][j] * 1);
                            positivePointerArray[i][j] = xparray[i][j] * 1 + xAxisData[i][j] * ratio1;
                        } else {
                            negativePointerArray[i][j] = negativePointerArray[i - 1][j];
                            positivePointerArray[i][j] = positivePointerArray[i - 1][j];
                            xparray[i][j] = (negativePointerArray[i][j] * 1);
                            negativePointerArray[i][j] = xparray[i][j] * 1 + xAxisData[i][j] * ratio1;
                        }
                    }
                    this.xPositionArray[i][j] = xparray[i][j];
                    if(this.xAxisData.length == 1){
                    	/** BDD-669 stack chart was broken for single series **/
                        if(this.m_chart.min >= 0){
                        	this.stackHeightArray[i][j] = (ratio1 * (xAxisData[i][j] * 1 - Math.abs(this.m_chart.min*1)));
                        } else{
                        	this.stackHeightArray[i][j] = (ratio1 * (xAxisData[i][j] * 1 + Math.abs(this.m_chart.max*1)));
                        }
                    }else{
                    	this.stackHeightArray[i][j] = (ratio1 * xAxisData[i][j] * 1);
                    }
                    /**Added for hiding overbound stack area*/
                    if (this.xPositionArray[i][j] > this.m_chart.getEndX()) {
                        this.xPositionArray[i][j] = this.m_chart.getEndX();
                    }
                    if (this.xPositionArray[i][j] < this.m_chart.getStartX()) {
                        this.xPositionArray[i][j] = this.m_chart.getStartX();
                    }
                    var stackWidth = this.xPositionArray[i][j] + this.stackHeightArray[i][j];
                    if (this.getStartX() > stackWidth) {
                        this.stackHeightArray[i][j] = this.stackHeightArray[i][j] + (this.getStartX() - stackWidth);
                    }
                    if (stackWidth > this.m_chart.getEndX()) {
                        this.stackHeightArray[i][j] = this.m_chart.getEndX() - this.xPositionArray[i][j];
                    }
                }
        }
    }
    this.xPositionMap = this.xPositionArray;//DAS-564 Added to support slider in Barchart 
};

/** @description Setting Series Color for overlaid **/
BarCalculation.prototype.setSeriesColorForOverlaid = function (seriesColor) {
	this.SeriesColorForOverlaid = seriesColor;
};

/** @description Getting Series Color for overlaid **/
BarCalculation.prototype.getSeriesColorForOverlaid = function () {
	return this.SeriesColorForOverlaid;
};

/** @description Calculating Series data along with color **/
BarCalculation.prototype.arrangeDataForOverlaid = function () {
	this.m_originalindexforoverlaiddata = [];
	var seriesColor = this.m_chart.visibleSeriesInfo.seriesColor;
	var arrangeArray = [];
	var colorArray = [];
	var originalIndexArray = [];
	var arrangeDataLabelArr = [];
	var arrangeDataLabelProp = [];
	for (var i = 0, length = this.xAxisData[0].length; i < length; i++) {
		arrangeArray[i] = [];
		colorArray[i] = [];
		originalIndexArray[i] = [];
		arrangeDataLabelArr[i] = [];
		arrangeDataLabelProp[i] = [];
		for (var j = 0, innerlength = this.xAxisData.length; j < innerlength; j++) {
			arrangeArray[i][j] = (isNaN(this.xAxisData[j][i])) ? 0 : this.xAxisData[j][i] * 1;
			colorArray[i][j] = seriesColor[j];
			originalIndexArray[i][j] = j;
			arrangeDataLabelArr[i][j] = this.m_chart.m_seriesDataForDataLabel[j][i];
			arrangeDataLabelProp[i][j] = this.m_chart.m_seriesDataLabelPropertyOverlaid[j];
		}
	}
	var sortedData = this.sortingDataWithColor(arrangeArray, colorArray, originalIndexArray, arrangeDataLabelArr, arrangeDataLabelProp);
	var arrengeSeriesDataandColor = this.arrengeSeriesDataandColor(sortedData);
	this.m_originalindexforoverlaiddata = arrengeSeriesDataandColor;
	return arrengeSeriesDataandColor;
};

/** @description When Performing sort on data,data and color combination should not be change  **/
BarCalculation.prototype.sortingDataWithColor = function (arrangeArray, colorArray, originalIndexArray, arrangeDataLabelArr, arrangeDataLabelProp) {
	var m_seriesDataAndColor = [];
	for (var i = 0, length = arrangeArray.length; i < length; i++) {
		m_seriesDataAndColor[i] = [];
		for (var j = 0, innerlength = arrangeArray[i].length; j < innerlength; j++) {
			m_seriesDataAndColor[i][j] = [];
			m_seriesDataAndColor[i][j][0] = arrangeArray[i][j] * 1;
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
BarCalculation.prototype.arrengeSeriesDataandColor = function (sortedData) {
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


/** @description Getter For Y Position Array**/
BarCalculation.prototype.getYPositionArray = function () {
	return this.yPositionArray;
};

/** @description Setter For Y Position Array**/
BarCalculation.prototype.setYPositionArray = function () {
	this.yPositionArray = [];
	var clusteredBarPadding = (this.getbarWidth() - this.getbarWidth()*this.m_chart.clusteredbarpadding)/2;
	for (var i = 0, length = this.xAxisData[0].length; i < length; i++) {
		this.yPositionArray[i] = [];
		for (var j = 0, dataLength = this.xAxisData.length; j < dataLength ; j++) {
			if ((this.m_chart.m_charttype).toLowerCase() == "clustered")
				this.yPositionArray[i][j] = (this.startY) * 1 - this.getbarWidth() * (dataLength - j) - this.getBarGap() / 2 - (this.getbarWidth() * this.xAxisData.length) * (length - 1 - i) - (this.getBarGap()) * (length -1 - i) + clusteredBarPadding;
			else
				this.yPositionArray[i][j] = this.startY - (this.getBarGap()) * (length-1-i) - (this.getbarWidth() * 1) - this.getBarGap() / 2 - (this.getbarWidth() * (length-1-i));
		}
	}
	this.yPositionArray = convertArrayType(this.yPositionArray);
	this.yPositionMap = this.yPositionArray;
};

/** @description Getter For Y Position Tooltip Array**/
BarCalculation.prototype.getYPositionforToolTip = function () {
	var yPosArray = [];
	var yPosDataArray = this.getYPositionArray();
	for (var n = 0, length = yPosDataArray[0].length; n < length; n++) {
		yPosArray.push(yPosDataArray[0][n]);
	}
	return yPosArray;
};

/** @description Getter for Stack Height Array**/
BarCalculation.prototype.getstackHeightArray = function () {
	return this.stackHeightArray;
};

/** @description Getter For Y Axis Text**/
BarCalculation.prototype.getYAxisText = function () {
	return this.yAxisData;
};

/** @description Getter For Y Axis Marker Array**/
BarCalculation.prototype.getYAxisMarkersArray = function () {
	return this.yAxisData;
};

/** @description creation of Bar Series class and initialization**/
function BarSeries() {
	this.xPixel = [];
	this.yPixelArray = [];
	this.stackHeightArray = [];
	this.stackColorArray = [];
	this.barStackArray = [];
	this.ctx = "";
	this.m_chart = "";
	this.m_chartbase = "";
};

/** @description Bar Series initialization **/
BarSeries.prototype.init = function (xPixel, yPixelArray, stackWidth, stackHeightArray, stackPercentArray, stackColorArray, strokeColor, stackMarkingOnTopBarFlag, showPercentValueFlag, m_seriesInitializeFlag, plotTrasparency, chart) {
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
	for (var i = 0, length = this.xPixel.length; i < length; i++) {
		this.barStackArray[i] = new BarStack();
		this.barStackArray[i].init(this.xPixel[i], this.yPixelArray[i], this.stackWidth, this.stackHeightArray[i], this.stackPercentArray[i], this.stackColorArray[i], this.strokecolor, this.ctx, chart, this.m_chartbase, this.m_stackMarkingOnTopOfBarFlag, this.m_stackShowPercentValueFlag, this.m_stackSeriesInitializeFlag, this.m_plotTrasparency);
	}
};

/** @description drawing for Bar Series**/
BarSeries.prototype.drawBarSeries = function (k) {
	for (var i = 0, length = this.xPixel.length; i < length; i++) {
		this.barStackArray[i].drawBarStack(k, i);
	}
};

/** @description Creation of BarStack class and initialization **/
function BarStack() {
	this.stackXPixel;
	this.stackYPixel;
	this.stackWidth;
	this.stackHeight;
	this.stackColor;
	this.strokeColor;
	this.ctx = "";
	this.m_chartbase = "";
};

/** @description BarStack initialization**/
BarStack.prototype.init = function (stackXPixel, stackYPixel, stackWidth, stackHeight, stackPercentValue, stackColor, strokeColor, ctx, ref, chartbase, showPercentageFlag, stackShowPercentValueFlag, m_stackSeriesInitializeFlag, plotTrasparency) {
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

/** @description Drawing for Bar Stack**/
BarStack.prototype.drawBarStack = function (k, i) {
	var temp = this;
	//var id = temp.m_chart.svgContainerId;
	//DAS-564 Added to support slider in Barchart 
	var id = (!temp.m_chart.scaleFlag) ? "stackgrp" + k + temp.m_chart.m_objectid : "stackgrpslider" + k + temp.m_chart.m_objectid;
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.strokeStyle = this.strokeColor;
	this.ctx.lineWidth = 0.5;
	var strokeWidth = 0.5;
	switch(this.m_chartbase){
		case "rectangle":
			if(this.stackHeight < 0 ){
				this.stackXPixel = this.stackXPixel + this.stackHeight;
				this.stackHeight = Math.abs(this.stackHeight);
			}
			this.makeCuboid(this.stackXPixel, this.stackYPixel, this.stackWidth, this.stackHeight, this.stackColor);
			this.ctx.fillStyle = hex2rgb(this.stackColor, this.m_stackPlotTrasparency);
			var svgStack = drawSVGRect(this.stackXPixel, this.stackYPixel, this.stackHeight, this.stackWidth, hex2rgb(this.stackColor, this.m_stackPlotTrasparency));
			svgStack.setAttribute("style", "stroke-width:" + strokeWidth + "px; stroke:" + this.strokeColor + ";");
			/*$("#stackgrp"+k+temp.m_chart.m_objectid).append(svgStack);*/
			$("#"+id).append(svgStack);//DAS-564 Added to support slider in Barchart 
			break;
		case "chevron":
			if(this.stackHeight !== 0 ) {
				this.makeChevron(this.stackXPixel, this.stackYPixel, this.stackWidth, this.stackHeight, hex2rgb(this.stackColor, this.m_stackPlotTrasparency), this.strokeColor, k);
			}
			break;
		case "gradient1":
			if(this.stackHeight < 0 ) {
				//this.stackHeight = 	(Math.abs(this.stackHeight) > this.m_chart.m_stackborderwidth * 2) ? this.stackHeight + (this.m_chart.m_stackborderwidth * 2) : this.stackHeight;
				this.stackXPixel = this.stackXPixel + this.stackHeight;
			}
			/**modifying x axis pixels to give some gap between bars and axis**/
			var ah = this.stackHeight;
			if (ah > 0) {
				this.stackHeight = this.stackHeight - ((this.stackHeight > this.m_chart.m_stackborderwidth * 2) ? (this.m_chart.m_stackborderwidth * 1) : 0 );
				this.stackXPixel = ((Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2)) ? this.stackXPixel + (this.m_chart.m_stackborderwidth * 0.5) : this.stackXPixel);
			} else {
				this.stackHeight = 	(Math.abs(this.stackHeight) > this.m_chart.m_stackborderwidth * 2) ? this.stackHeight + (this.m_chart.m_stackborderwidth * 1) : this.stackHeight;
				this.stackXPixel = ((Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2)) ? this.stackXPixel + (this.m_chart.m_stackborderwidth * 0.5) : this.stackXPixel)
			}
			var aw = this.stackWidth;
			this.stackWidth = this.stackWidth - ((this.stackWidth > this.m_chart.m_stackborderwidth * 2) ? (this.m_chart.m_stackborderwidth * 1) : 0 );
			if (temp.m_chart.m_stacksvgtype === "path") {
				this.drawSVGPathBar(this, id, "url(#gradient" + temp.m_chart.m_objectid + k + i +")", ah, aw);
			} else {
				var svgStack = drawSVGRect(this.stackXPixel, this.stackYPixel, Math.abs(this.stackHeight), this.stackWidth, "");
				if (Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2) && Math.abs(aw) > (this.m_chart.m_stackborderwidth * 2)) {
					svgStack.setAttribute("style", "stroke-width:" + this.m_chart.m_stackborderwidth + "px; stroke:" + this.m_chart.m_stackbordercolor + "; stroke-opacity : 1;");
					if (IsBoolean(this.m_chart.m_enablestackshadow) && !IsBoolean(this.m_chart.isPropertyBrowserCompatible()) && this.stackWidth > 2 && Math.abs(this.stackHeight) > 2) {
						$(svgStack).attr("filter", "url(#stackShadow"+temp.m_chart.m_objectid+")");
						svgStack.setAttribute("shape-rendering", "crispEdges");
					}
				}
				/** Added for add radius on stack*/
				$(svgStack).attr("rx", this.m_chart.m_stackborderradius);
				$(svgStack).attr("ry", this.m_chart.m_stackborderradius);
				svgStack.setAttribute("fill", "url(#gradient" + temp.m_chart.m_objectid + k + i +")");
				var isIE = /*@cc_on!@*/false || !!document.documentMode;
				if(IsBoolean(this.m_chart.m_enableanimation) && (this.m_chart.m_baranimationduration > 0) && !isIE) {
					var animate1 = drawSVGStackAnimation(0, "width", Math.abs(this.stackHeight), this.m_chart.m_baranimationduration);
					var animate2 = drawSVGStackAnimation((Math.abs(this.stackHeight) + this.stackXPixel), "x", this.stackXPixel, this.m_chart.m_baranimationduration);
					$(svgStack).append(animate1);
					if(this.stackHeight < 0 ){
						$(svgStack).append(animate2);
					}
				}
				$(svgStack).attr("class", "timeSeries-stackHighlighter");
				//$("#stackgrp"+k+temp.m_chart.m_objectid).append(svgStack);
				$("#"+id).append(svgStack);
			}
			break;
		case "gradient2":
			if(this.stackHeight < 0 ) {
				//this.stackHeight = 	(Math.abs(this.stackHeight) > this.m_chart.m_stackborderwidth * 2) ? this.stackHeight + (this.m_chart.m_stackborderwidth * 2) : this.stackHeight;
				this.stackXPixel = this.stackXPixel + this.stackHeight;
			}
			/**modifying x axis pixels to give some gap between bars and axis**/
			var ah = this.stackHeight;
			if (ah > 0) {
				this.stackHeight = this.stackHeight - ((this.stackHeight > this.m_chart.m_stackborderwidth * 2) ? (this.m_chart.m_stackborderwidth * 1) : 0 );
				this.stackXPixel = ((Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2)) ? this.stackXPixel + (this.m_chart.m_stackborderwidth * 0.5) : this.stackXPixel);
			} else {
				this.stackHeight = 	(Math.abs(this.stackHeight) > this.m_chart.m_stackborderwidth * 2) ? this.stackHeight + (this.m_chart.m_stackborderwidth * 1) : this.stackHeight;
				this.stackXPixel = ((Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2)) ? this.stackXPixel + (this.m_chart.m_stackborderwidth * 0.5) : this.stackXPixel)
			}
			var aw = this.stackWidth;
			this.stackWidth = this.stackWidth - ((this.stackWidth > this.m_chart.m_stackborderwidth * 2) ? (this.m_chart.m_stackborderwidth * 1) : 0 );
			if (temp.m_chart.m_stacksvgtype === "path") {
				this.drawSVGPathBar(this, id, "url(#gradient" + temp.m_chart.m_objectid + k  + i +")", ah, aw);
			} else {
				var svgStack = drawSVGRect(this.stackXPixel, this.stackYPixel, Math.abs(this.stackHeight), this.stackWidth, "");
				if (Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2) && Math.abs(aw) > (this.m_chart.m_stackborderwidth * 2)) {
					svgStack.setAttribute("style", "stroke-width:" + this.m_chart.m_stackborderwidth + "px; stroke:" + this.m_chart.m_stackbordercolor + "; stroke-opacity : 1;");
					if (IsBoolean(this.m_chart.m_enablestackshadow) && !IsBoolean(this.m_chart.isPropertyBrowserCompatible()) && this.stackWidth > 2 && Math.abs(this.stackHeight) > 2) {
						$(svgStack).attr("filter", "url(#stackShadow"+temp.m_chart.m_objectid+")");
						svgStack.setAttribute("shape-rendering", "crispEdges");
					}
				}
				/** Added for add radius on stack*/
				$(svgStack).attr("rx", this.m_chart.m_stackborderradius);
				$(svgStack).attr("ry", this.m_chart.m_stackborderradius);
				svgStack.setAttribute("fill", "url(#gradient" + temp.m_chart.m_objectid + k  + i +")");
				var isIE = /*@cc_on!@*/false || !!document.documentMode;
				if(IsBoolean(this.m_chart.m_enableanimation) && (this.m_chart.m_baranimationduration > 0) && !isIE) {
					var animate1 = drawSVGStackAnimation(0, "width", Math.abs(this.stackHeight), this.m_chart.m_baranimationduration);
					var animate2 = drawSVGStackAnimation((Math.abs(this.stackHeight) + this.stackXPixel), "x", this.stackXPixel, this.m_chart.m_baranimationduration);
					$(svgStack).append(animate1);
					if(this.stackHeight < 0 ){
						$(svgStack).append(animate2);
					}
				}
				$(svgStack).attr("class", "timeSeries-stackHighlighter");
				/*$("#stackgrp"+k+temp.m_chart.m_objectid).append(svgStack);*/
				$("#"+id).append(svgStack);//DAS-564 Added to support slider in Barchart 
				
			}
			break;
		case "gradient3":
			if(this.stackHeight < 0 ) {
				//this.stackHeight = 	(Math.abs(this.stackHeight) > this.m_chart.m_stackborderwidth * 2) ? this.stackHeight + (this.m_chart.m_stackborderwidth * 2) : this.stackHeight;
				this.stackXPixel = this.stackXPixel + this.stackHeight;
			}
			/**modifying x axis pixels to give some gap between bars and axis**/
			var ah = this.stackHeight;
			if (ah > 0) {
				this.stackHeight = this.stackHeight - ((this.stackHeight > this.m_chart.m_stackborderwidth * 2) ? (this.m_chart.m_stackborderwidth * 1) : 0 );
				this.stackXPixel = ((Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2)) ? this.stackXPixel + (this.m_chart.m_stackborderwidth * 0.5) : this.stackXPixel);
			} else {
				this.stackHeight = 	(Math.abs(this.stackHeight) > this.m_chart.m_stackborderwidth * 2) ? this.stackHeight + (this.m_chart.m_stackborderwidth * 1) : this.stackHeight;
				this.stackXPixel = ((Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2)) ? this.stackXPixel + (this.m_chart.m_stackborderwidth * 0.5) : this.stackXPixel)
			}
			var aw = this.stackWidth;
			this.stackWidth = this.stackWidth - ((this.stackWidth > this.m_chart.m_stackborderwidth * 2) ? (this.m_chart.m_stackborderwidth * 1) : 0 );
			if (temp.m_chart.m_stacksvgtype === "path") {
				this.drawSVGPathBar(this, id, "url(#gradient" + temp.m_chart.m_objectid + k  + i +")", ah, aw);
			} else {
				var svgStack = drawSVGRect(this.stackXPixel, this.stackYPixel, Math.abs(this.stackHeight), this.stackWidth, "");
				svgStack.setAttribute("fill", "url(#gradient" + temp.m_chart.m_objectid + k  + i +")");
				if (Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2) && Math.abs(aw) > (this.m_chart.m_stackborderwidth * 2)) {
					svgStack.setAttribute("style", "stroke-width:" + this.m_chart.m_stackborderwidth + "px; stroke:" + this.m_chart.m_stackbordercolor + "; stroke-opacity : 1;");
					if (IsBoolean(this.m_chart.m_enablestackshadow) && !IsBoolean(this.m_chart.isPropertyBrowserCompatible()) && this.stackWidth > 2 && Math.abs(this.stackHeight) > 2) {
						$(svgStack).attr("filter", "url(#stackShadow"+temp.m_chart.m_objectid+")");
						svgStack.setAttribute("shape-rendering", "crispEdges");
					}
				}
				/** Added for add radius on stack*/
				$(svgStack).attr("rx", this.m_chart.m_stackborderradius);
				$(svgStack).attr("ry", this.m_chart.m_stackborderradius);
				var isIE = /*@cc_on!@*/false || !!document.documentMode;
				if(IsBoolean(this.m_chart.m_enableanimation) && (this.m_chart.m_baranimationduration > 0) && !isIE) {
					var animate1 = drawSVGStackAnimation(0, "width", Math.abs(this.stackHeight), this.m_chart.m_baranimationduration);
					var animate2 = drawSVGStackAnimation((Math.abs(this.stackHeight) + this.stackXPixel), "x", this.stackXPixel, this.m_chart.m_baranimationduration);
					$(svgStack).append(animate1);
					if(this.stackHeight < 0 ){
						$(svgStack).append(animate2);
					}
				}
				$(svgStack).attr("class", "timeSeries-stackHighlighter");
				//$("#stackgrp"+k+temp.m_chart.m_objectid).append(svgStack);
				$("#"+id).append(svgStack);//DAS-564 Added to support slider in Barchart 
			}
			break;
		default:
			if(this.stackHeight < 0 ) {
				//this.stackHeight = 	(this.stackHeight > 0) ? this.stackHeight + (this.m_chart.m_stackborderwidth * 2) : this.stackHeight;
				this.stackXPixel = this.stackXPixel + this.stackHeight;
			}
			/**modifying x axis pixels to give some gap between bars and axis**/
			var ah = this.stackHeight;
			if (ah > 0) {
				this.stackHeight = this.stackHeight - ((this.stackHeight > this.m_chart.m_stackborderwidth * 2) ? (this.m_chart.m_stackborderwidth * 1) : 0 );
				this.stackXPixel = ((Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2)) ? this.stackXPixel + (this.m_chart.m_stackborderwidth * 0.5) : this.stackXPixel);
			} else {
				this.stackHeight = 	(Math.abs(this.stackHeight) > this.m_chart.m_stackborderwidth * 2) ? this.stackHeight + (this.m_chart.m_stackborderwidth * 1) : this.stackHeight;
				this.stackXPixel = ((Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2)) ? this.stackXPixel + (this.m_chart.m_stackborderwidth * 0.5) : this.stackXPixel)
			}
			var aw = this.stackWidth;
			this.stackWidth = this.stackWidth - ((this.stackWidth > this.m_chart.m_stackborderwidth * 2) ? (this.m_chart.m_stackborderwidth * 1) : 0 );
			if (temp.m_chart.m_stacksvgtype === "path") {
				this.drawSVGPathBar(this, id, hex2rgb(this.stackColor, this.m_stackPlotTrasparency), ah, aw);
			} else {
				var svgStack = drawSVGRect(this.stackXPixel, this.stackYPixel, Math.abs(this.stackHeight), this.stackWidth, hex2rgb(this.stackColor, this.m_stackPlotTrasparency));
				if (Math.abs(ah) > (this.m_chart.m_stackborderwidth * 2) && Math.abs(aw) > (this.m_chart.m_stackborderwidth * 2)) {
					svgStack.setAttribute("style", "stroke-width:" + this.m_chart.m_stackborderwidth + "px; stroke:" + this.m_chart.m_stackbordercolor + "; stroke-opacity : 1;");
					if (IsBoolean(this.m_chart.m_enablestackshadow) && !IsBoolean(this.m_chart.isPropertyBrowserCompatible()) && this.stackWidth > 2 && Math.abs(this.stackHeight) > 2) {
						$(svgStack).attr("filter", "url(#stackShadow"+temp.m_chart.m_objectid+")");
						svgStack.setAttribute("shape-rendering", "crispEdges");
					}
				}
				//svgStack.setAttribute("opacity", "0.5");
				/** Added for add radius on stack*/
				$(svgStack).attr("rx", this.m_chart.m_stackborderradius);
				$(svgStack).attr("ry", this.m_chart.m_stackborderradius);
				var isIE = /*@cc_on!@*/false || !!document.documentMode;
				if(IsBoolean(this.m_chart.m_enableanimation) && (this.m_chart.m_baranimationduration > 0) && !isIE) {
					var animate1 = drawSVGStackAnimation(0, "width", Math.abs(this.stackHeight), this.m_chart.m_baranimationduration);
					var animate2 = drawSVGStackAnimation((Math.abs(this.stackHeight) + this.stackXPixel), "x", this.stackXPixel, this.m_chart.m_baranimationduration);
					$(svgStack).append(animate1);
					if(this.stackHeight < 0 ){
						$(svgStack).append(animate2);
					}
				}
				$(svgStack).attr("class", "timeSeries-stackHighlighter");
				$(svgStack).attr("id", "stackgrp"+temp.m_chart.m_objectid+"s"+k+"c"+i);
				//$("#stackgrp"+k+temp.m_chart.m_objectid).append(svgStack);
				$("#"+id).append(svgStack);//DAS-564 Added to support slider in Barchart 
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
			        				var clickid = "stackgrp" + temp.m_chart.m_objectid + "s"+n +"c"+ j;
			        			}else{
			        				var clickid = "linestack" + temp.m_chart.m_objectid + "s"+n +"c"+ j;
			        			}
			        			if(catIndex == j){
									//DAS-564 Added to support slider in Barchart 
			        			$("#"+clickid).css("opacity","1");
			        			} else if(($("#"+clickid).css("opacity") == "1") && IsBoolean( temp.m_chart.m_drilltoggle)) {
			        				$("#"+clickid).css("opacity","0.5");//$("#"+clickid).css("opacity","0.5");
			        			} else {
			        				$("#"+clickid).css("opacity","1");
			        			}
			        		  }
			        		}
			        	}
			        });
			}
			break;
	}
	if (IsBoolean(this.m_stackSeriesInitializeFlag)){
		this.drawText();
	}
	this.ctx.restore();
	this.ctx.closePath();
};

/** @description will draw bar using path on SVG.  **/
BarStack.prototype.drawSVGPathBar = function(temp, id, fillColor, actualHeight, actualWidth) {
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
             vertLineTo + spc + (temp.stackWidth - (2*r)) + spc +
             arcTo + spc + (r) + spc + (r) + spc + 0 + spc + 0 + spc + 1 + spc + (-r) + spc + (r) + spc +
             horizLineTo + spc + (r - temp.stackHeight ) + spc +
             closePath;
    } else { // for Negative value
        dStr =
        	moveTo + spc + Math.abs(temp.stackXPixel + Math.abs(temp.stackHeight)) + spc + (temp.stackYPixel) + spc +
            horizLineTo + spc + (temp.stackHeight + r) + spc +
            arcTo + spc + (r) + spc + (r) + spc + 0 + spc + 0 + spc + 0 + spc + (-r) + spc + (r) + spc +
            vertLineTo + spc + (temp.stackWidth - (2*r)) + spc +
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
	    var isIE = /*@cc_on!@*/false || !!document.documentMode;
		if (IsBoolean(temp.m_chart.m_enableanimation) && (temp.m_chart.m_baranimationduration > 0) && !isIE) {
			/**Added for animation in svg path stack */
	    	rect.setAttribute("class", "barchart-rounded-bar");
	    	var sx = ((temp.stackHeight) * 1 > 0) ? (temp.stackXPixel) : (temp.stackXPixel + (Math.abs(temp.stackHeight)));
	    	rect.setAttribute("style","animation: barchart-rounded-bar " + temp.m_chart.m_baranimationduration + "s linear forwards; transform-origin: "+(sx)+ "px center;");
		}
		//If stackHeight value is more than stackBorderWidth then given borderWidth apply else stackHeight value become borderWidth
		if (Math.abs(actualHeight) > (temp.m_chart.m_stackborderwidth*2) && Math.abs(actualWidth) > (temp.m_chart.m_stackborderradius * 1)) {
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

/** @description Draw percent value on Bar**/
BarStack.prototype.drawText = function () {
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

/** @description create Gradient and return calculated gradient**/
BarStack.prototype.createGradient = function () {
	var grd = this.ctx.createLinearGradient(this.stackXPixel, this.stackYPixel, this.stackXPixel, this.stackYPixel * 1 + this.stackWidth * 1);
	var color0 = hex2rgb(this.stackColor, 0.6);
	var color = hex2rgb(this.stackColor, 0.7);
	grd.addColorStop(0, this.stackColor);
	grd.addColorStop(0.3, color0);
	grd.addColorStop(0.7, color);
	grd.addColorStop(1, this.stackColor);
	return grd;
};

/** @description create gradient for chartBase Gradient1**/
BarChart.prototype.createGradient1 = function (color, j, i) {
	var temp = this;
	var id = (!temp.scaleFlag) ? temp.svgContainerId : temp.svgTimeScaleId;//DAS-959 slider implementation for gradients
	var linearGradient = document.createElementNS(NS, 'linearGradient');
	linearGradient.setAttribute("x1", "0%");
	linearGradient.setAttribute("x2", "0%");
	linearGradient.setAttribute("y1", "0%");
	linearGradient.setAttribute("y2", "100%");
	linearGradient.setAttribute("id", "gradient" + temp.m_objectid + j + i);
	$('#' + id).append(linearGradient);
	var color0 = hex2rgb(color, this.m_plotTrasparencyArray[j]);
	var colors = [color0, ColorLuminance(color, 0.2), color0];
	var step=(100 / (((colors.length-1)!=0)?(colors.length-1):1));
	for (var i = 0,Length= colors.length; i <=(Length-1); i++) {
		var stop = document.createElementNS(NS, 'stop');
		stop.setAttribute("offset", (i *step) + "%");
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

/** @description create gradient for chartBase Gradient2**/
BarChart.prototype.createGradient2 = function (color, j, i) {
	var temp = this;
	var id = (!temp.scaleFlag) ? temp.svgContainerId : temp.svgTimeScaleId;//DAS-959 slider implementation for gradients
	var linearGradient = document.createElementNS(NS, 'linearGradient');
	linearGradient.setAttribute("x1", "0%");
	linearGradient.setAttribute("x2", "0%");
	linearGradient.setAttribute("y1", "0%");
	linearGradient.setAttribute("y2", "100%");
	linearGradient.setAttribute("id", "gradient" + temp.m_objectid + j + i);
	$('#' + id).append(linearGradient);
	var color0 = hex2rgb(color, this.m_stackPlotTrasparency);
	var colors = [color0, color0, ColorLuminance(color, -0.15), color0, color0];
	var step=(100 / (((colors.length-1)!=0)?(colors.length-1):1));
	for (var i = 0,Length= colors.length; i <=(Length-1); i++) {
		var stop = document.createElementNS(NS, 'stop');
		stop.setAttribute("offset", (i *step) + "%");
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

BarChart.prototype.getText = function(text1, textWidth, ctxFont) {
	var text = "" + text1;
	var labelTexts = [];
	this.ctx.font = ctxFont;
	var strWidth = this.ctx.measureText(text).width;

	var words = text.split(' ');
	var line = '';
	if (strWidth > textWidth) {
	    for (var j = 0; j <= words.length; j++) {
	        var testLine = line + words[j] + ' ';
	        var metrics = this.ctx.measureText(testLine);
	        var testWidth = metrics.width;
	        if (labelTexts.length == this.m_yaxislabellines) {
	            break;
	        }
	        if (testWidth > textWidth) {
	        	if(j > 0 && this.ctx.measureText(line).width > textWidth){
	        		labelTexts.push(this.m_yAxis.getText(line, textWidth, ctxFont));
	        		break;
	        	} else if(j == 0 && this.ctx.measureText(words[j]).width > textWidth){
	        		labelTexts.push(this.m_yAxis.getText(words[j], textWidth, ctxFont));
	        		break;
	        	} else if(!IsBoolean(this.m_yAxis.m_yaxistextwrap)){
	        		labelTexts.push(line);
	        		break;
	        	} else {
	            	labelTexts.push(line);
	            	line = words[j] + ' ';
	        	}
	        } else if ((j == words.length) && (testWidth < textWidth)) {
	            labelTexts.push(line);
	        } else {
	            line = testLine;
	        }
	    }
	    if ((labelTexts[this.m_yaxislabellines - 1]) && (this.ctx.measureText(labelTexts[this.m_yaxislabellines - 1]).width >= textWidth)) {	       
	        labelTexts[this.m_yaxislabellines - 1] = this.getText(labelTexts[this.m_yaxislabellines - 1], textWidth, ctxFont);
	    }
	} else {
	    labelTexts.push(text);
	}
	return labelTexts;
};

BarChart.prototype.drawSVGTextForCategory = function(x, y, labelText, fillColor, hAlign, Valign, angle) {
    var newText = document.createElementNS(NS, "text");
    if (labelText.length == 1) {
        if (!isNaN(x) && !isNaN(y)) {
            newText.setAttribute("x", x);
            newText.setAttribute("y", y);
            newText.setAttribute("fill", fillColor);
            if (angle !== "" && angle !== undefined && angle !== 0)
                newText.setAttribute("transform", "rotate(" + angle + " " + x + "," + y + ")");
            newText.textContent = labelText;
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
                    spanElement.setAttribute("dy", this.fontScaling(this.m_yAxis.getLabelFontSize()) * 1);
                }
                spanElement.textContent = labelText[i];
                newText.appendChild(spanElement);
            }
        }
        return newText;
    }
};

/** @description create gradient for chartBase Gradient3**/
BarChart.prototype.createGradient3 = function (color, j, i) {
	var temp = this;
	var id = (!temp.scaleFlag) ? temp.svgContainerId : temp.svgTimeScaleId;//DAS-959 slider implementation for gradients
	var linearGradient = document.createElementNS(NS, 'linearGradient');
	linearGradient.setAttribute("x1", "0%");
	linearGradient.setAttribute("x2", "0%");
	linearGradient.setAttribute("y1", "0%");
	linearGradient.setAttribute("y2", "100%");
	linearGradient.setAttribute("id", "gradient" + temp.m_objectid + j + i);
	$('#' + id).append(linearGradient);
	var color0 = hex2rgb(color, 0.35);
	var colors = [color, color, color0, color, color];
	var step=(100 / (((colors.length-1)!=0)?(colors.length-1):1));
	for (var i = 0,Length= colors.length; i <=(Length-1); i++) {
		var stop = document.createElementNS(NS, 'stop');
		stop.setAttribute("offset", (i *step) + "%");
		stop.setAttribute("stop-color", colors[i]);
		stop.setAttribute("stop-opacity", 1);
		$(linearGradient).append(stop);
	}
	/*var grd = this.ctx.createLinearGradient(x, y, x, (y * 1 + w * 1));
	var color0 = hex2rgb(color, 0.35);
	grd.addColorStop(0, color);
	grd.addColorStop(0.15, color);
	grd.addColorStop(0.5, color0);
	grd.addColorStop(0.85, color);
	grd.addColorStop(1, color);
	return grd;*/
};

/** @description create gradient for chartBase Gradient3**/
BarStack.prototype.createGradient3 = function (x, y, w, h, color) {
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

/** @description create cylinderical bar**/
BarStack.prototype.makeCylinder = function (x, y, w, h, color) {
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

/** @description create cuboid bar**/
BarStack.prototype.makeCuboid = function (x, y, w, h, color) {
	var temp = this;
	var id = (!temp.m_chart.scaleFlag) ? temp.m_chart.svgContainerId: temp.m_chart.svgTimeScaleId;//DAS-564 Added to support slider in Barchart 
	var slant = w / 4;
	var strokeColor = "#cccccc";
	var strokeWidth = 0.5;
	var fillColor = hex2rgb(color, this.m_stackPlotTrasparency);
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
};
/** @description draw chevron  **/
BarStack.prototype.makeChevron = function (x, y, h, w, color, stroke, index) {	
	var temp = this;
	//var id = temp.m_chart.svgContainerId;
	//DAS-564 Added to support slider in Barchart 
	var id = (!temp.m_chart.scaleFlag) ? temp.m_chart.svgContainerId : temp.m_chart.svgTimeScaleId;
	var space = h/6;
	var strokeWidth = 0.5;
	if(w * 1 < h / 2) {
		w = h/2;
	}
		var path = [
	        	"M", x, y, 
	        	"L", x * 1 + w * 1 - h / 2 , y,
	        	"L", x * 1 + w * 1 , y * 1 + h / 2,
	        	"L", x * 1 + w * 1 - h / 2, y * 1 + h * 1,
	        	"L", x, y * 1 + h * 1,
	        	"L", x * 1 + h / 2, y * 1 + h / 2,
	        	"L", x, y
	   			].join(" ");
		// commented old chevron shape drawing for BDD-589(1)
		/*var path = [
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
	$("#"+id).append(svgPath);//DAS-564 Added to support slider in Barchart 
};


/** @description BarXAxis class creation and property initialization**/
function BarXAxis() {
	this.base = Xaxis;
	this.base();
	this.m_showlinexaxis = "true";
	this.m_linexaxiscolor = "";
	this.m_textUtil = new TextUtil();
	this.m_util = new Util();
	this.ctx = "";
	this.noOfRows = 1;
};

/** @description inheriting XAxis property into BarXAxis**/
BarXAxis.prototype = new Xaxis;

/** @description BarXAxis initialization**/
BarXAxis.prototype.init = function (m_chart) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.m_startX = this.m_chart.getStartX();
	this.m_startY = this.m_chart.getStartY();
	this.m_endX = this.m_chart.getEndX();
	this.m_endY = this.m_chart.getEndY();
	this.m_xAxisData = this.m_chart.m_seriesData;
	this.m_axiscolor = convertColorToHex(this.m_chart.getAxisColor());
	this.m_linexaxiscolor = (this.m_linexaxiscolor != "") ? convertColorToHex(this.m_linexaxiscolor) : this.m_axiscolor;
	this.setLeftAxisFormatters();
	this.setRightAxisFormatters();
	this.noOfRows = this.m_chart.noOfRows;
};

/** @description get interval width**/
BarXAxis.prototype.getYaxisDivison = function (markerArray) {
	return ((this.m_endY - this.m_startY) / (markerArray.length));
};

/** @description X Axis Marking**/
BarXAxis.prototype.markXaxis = function () {
	var temp = this;
	var m_axisLineToTextGap = this.calculateAxisLineToTextGap();
	var markerArray = this.m_chart.m_calculation.getXAxisMarkersArray();
	var xAxisDiv = (this.m_chart.getEndX() - this.m_chart.getStartX()) / (markerArray.length - 1);
	
	var markerLength = markerArray.length;
	var plottedAxisMarkers = [];
	for (var i = 0; i < markerLength; i++) {
		var text = markerArray[i];
		text = this.getFormattedText(text, this.m_precision);
		plottedAxisMarkers.push(text);
	}
	if(!isUniqueArray(plottedAxisMarkers)){
		/** if the markers has the duplicates, re-set them with one precision **/
		var map = getDuplicatesFromArray(plottedAxisMarkers);
		for (var i = 0; i < markerLength; i++) {
			var text = markerArray[i];
			/** returns formatted value on second y-axis markers **/
			var tempText = this.getFormattedText(text, this.m_precision);
			if(this.m_precision == "default" && this.m_secondaryUnitSymbol == "auto" && Object.keys(map).length > 0){
				/** if Same marker already exist in array, set a precision to 1 **/
				text = this.getFormattedText(text, 1);
			}else{
				text = tempText;
			}
			plottedAxisMarkers[i] = text;
		}
	}
	for (var i = 0, length = markerArray.length; i < length; i++) {
		if ((i % this.m_chart.m_skipxaxislabels) == 0 || this.m_chart.m_skipxaxislabels == "auto") {
			this.ctx.save();
			text = plottedAxisMarkers[i];
			var textWidth = this.ctx.measureText(text).width;
			if (this.noOfRows == 2) {
				text = this.getText("" + text, ((this.m_endX - this.m_startX) / markerArray.length) * 2, this.getLabelFontProperties());
			} else {
				text = this.getText("" + text, ((this.m_endX - this.m_startX) / markerArray.length), this.getLabelFontProperties());
			}
			this.translateTextPosition(m_axisLineToTextGap, i, text, xAxisDiv);
			this.ctx.rotate((this.getLabelrotation()) * Math.PI / 180);
			var axisToLabelMargin = this.calculateAxisToLabelMargin(i);
			var labelAlign = "center";
			var x = (this.m_startX) * 1 + (xAxisDiv * i);
			var y = this.m_startY * 1 + m_axisLineToTextGap / 2  + axisToLabelMargin * 1 + this.calculateAxisLineToTextGap() / 2 ;
			if (IsBoolean(this.m_chart.m_xAxis.getLabelTilted())) {
				var labelRotation = this.getLabelrotation();
				if (labelRotation > 0 && labelRotation <= 90) {
					labelAlign = "left";
				} else if (labelRotation < 0 && labelRotation >= -90) {
					labelAlign = "right";
				} else {
					labelAlign = "center";
				}
			}
			var text = drawSVGText(x, y, text, this.m_labelfontcolor, labelAlign, "middle", this.getLabelrotation());
			/*if (this.isLabelDecoration()){
				this.drawUnderLine(text, 0, 0 + this.m_chart.fontScaling(this.m_labelfontsize) / 2, convertColorToHex(this.m_labelfontcolor), this.m_chart.fontScaling(this.getLabelFontSize()), this.m_labeltextalign);
			}*/
			//this.m_textUtil.drawText(this.ctx, text, 0, 0, this.getLabelFontProperties(), this.m_labeltextalign, convertColorToHex(this.m_labelfontcolor));
			//text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getLabelFontSize()) + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getLabelTextDecoration() + ";");
			$("#xaxislabelgrp" + temp.m_chart.m_objectid).append(text);
			this.ctx.restore();
			this.ctx.closePath();
		}
	}
	if (this.getDescription() != "") {
        this.drawDescription();
    }
};

BarXAxis.prototype.drawDescription = function() {
	var temp = this;
	var serDec = "";
	var fontColor = convertColorToHex(this.getFontColor());
	serDec = this.m_chart.m_allSeriesDisplayNames.join(", ");
	var description=(IsBoolean(this.m_chart.m_xAxis.m_showdatasetdescription)) ? this.m_chart.formattedDescription(this.m_chart, serDec) : this.getDescription();
	//DAS-564 Added to support slider in Barchart 
	var text = drawSVGText(this.getXDesc(), this.getYDesc(), this.m_chart.formattedDescription(this.m_chart, description), convertColorToHex(this.getFontColor()), "middle", "middle", 0);
	$(text).css({
		"font-family": selectGlobalFont(temp.getFontFamily()),
		"font-style": temp.getFontStyle(),
		"font-size": temp.m_chart.fontScaling(temp.getFontSize()) + "px" ,
		"font-weight": temp.getFontWeight(),
		"text-decoration": temp.getTextDecoration()
	});
	$("#" + temp.m_chart.svgContainerId).append(text);
};
BarXAxis.prototype.drawXAxis = function() {
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
		//this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
		var temp = this;
		var newLine = drawSVGLine(x1, y1, x2, y2, lineWidth, strokeColor);
		$("#" + temp.m_chart.svgContainerId).append(newLine);
	}
};
/** @description prepare text for drawing and calculating x,y position**/
BarXAxis.prototype.translateTextPosition = function (m_axisLineToTextGap, i, text, xAxisDiv) {
	var labelRotation = this.getLabelrotation();
	var textWidth = this.getLabelTextWidth(text);
	var x = (this.m_startX) * 1 + (xAxisDiv * i);
	var axisToLabelMargin = this.calculateAxisToLabelMargin(i);
	var y = this.m_startY * 1 + m_axisLineToTextGap * 1 + axisToLabelMargin * 1;
	this.translateText(labelRotation, x, y, text);
};

/** @description If formatter is on than formatting the original text and return the text**/
BarXAxis.prototype.getFormattedText = function (text, prec) {
	var precision = (prec == "undefined" || prec == undefined) ? this.m_chart.m_precision : prec;
	if (text % 1 != 0 && precision < 1) {
		text = this.setPrecision(text, 0);
	} else if (!IsBoolean(this.m_isFormatter) && !IsBoolean(this.m_isSecondaryFormatter)) {
		if(precision !== "default")
		text = this.setPrecision(text, precision);
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

/** @description set formatter on left axis text**/
BarXAxis.prototype.setLeftAxisFormatters = function () {
	this.m_isFormatter = false;
	this.m_isSecondaryFormatter = false;
	if (!IsBoolean(this.m_chart.getFixedLabel())) {
		if (IsBoolean(this.getLeftaxisFormater())) {
			this.setFormatter();
			this.setSecondaryFormatter();
		}
	}
	this.m_precision = this.m_chart.getPrecision();
};

/** @description Set formatter for right axis mark Text**/
BarXAxis.prototype.setRightAxisFormatters = function () {
	if (IsBoolean(this.m_chart.m_secondaryaxisshow)) {
		if (IsBoolean(this.getRightAxisFormater())) {
			this.setSecondAxisFormatter();
		}
	}
	this.m_secondaryAxisPrecision = this.m_chart.m_secondaryaxisprecision;
};

/** @description calculating secondary Axis Formatter **/
BarXAxis.prototype.setSecondAxisFormatter = function () {
	this.m_secondAxisUnitSymbol = "";
	this.m_secondAxisFormatterPosition = "";
	this.m_isSecondAxisFormatter = false;

	if (this.m_chart.m_secondaryaxisformater != "none" || this.m_chart.m_secondaryaxisformater != "") {
		var secondAxisunit = this.m_chart.m_secondaryaxisunit;
		var secondAxisFormatter = this.m_chart.m_secondaryaxisformater;
		if (secondAxisunit != "none" && secondAxisunit != "") {
			this.m_isSecondAxisFormatter = true;
			this.m_secondAxisUnitSymbol = this.m_util.getFormatterSymbol(secondAxisFormatter, secondAxisunit);
			this.m_secondAxisFormatterPosition = this.m_chart.m_secondaryaxissignposition;
		}
	}
};

/** @description Setting Formatter**/
BarXAxis.prototype.setFormatter = function () {
	this.m_unitSymbol = "";
	this.m_formatterPosition = "";
	this.m_isFormatter = false;

	if (this.m_chart.m_formater != "none" && this.m_chart.m_formater != "") {
		var unit = this.m_chart.getUnit();
		var formatter = this.m_chart.getFormater();
		if (unit != "none" && unit != "") {
			this.m_isFormatter = true;
			this.m_unitSymbol = this.m_util.getFormatterSymbol(formatter, unit);
			this.m_formatterPosition = this.m_chart.getSignPosition();
		}
	}
};

/** @description Setting secondary formatter**/
BarXAxis.prototype.setSecondaryFormatter = function () {
	this.m_secondaryUnitSymbol = "";
	this.m_secondaryFormatterPosition = "";
	this.m_isSecondaryFormatter = false;

	if (this.m_chart.m_secondaryformater != "none" && this.m_chart.m_secondaryformater != "" && this.m_chart.getUnit() != "Percent") {
		var secondaryUnit = this.m_chart.getSecondaryUnit();
		var secondaryFormatter = this.m_chart.getSecondaryFormater();
		if (secondaryUnit != "" && secondaryUnit != "none" && secondaryUnit != undefined) {
			this.m_isSecondaryFormatter = true;
			this.m_secondaryUnitSymbol = this.m_util.getFormatterSymbol(secondaryFormatter, secondaryUnit);
		}
		this.m_secondaryFormatterPosition = "suffix";
	}
};

/** @description Getter for secondary Y Axis formatter Text**/
BarXAxis.prototype.getSecondaryAxisFormattedText = function (text) {
	if (this.m_isSecondAxisFormatter) {
		text = this.m_util.addFormatter(text, this.m_secondAxisUnitSymbol, this.m_secondAxisFormatterPosition);
	}
	return text;
};

/** @description Set Precision on text**/
BarXAxis.prototype.setPrecision = function (text, precision) {
	var text = text * 1;
	if(text !== 0){
		if(precision !== "default"){
			return text.toFixed(precision);
		}
		else{
			return (text * 1);
		}
	} else{
		return text * 1;
	}
};

/** @description Add Secondary Formatter in Text**/
BarXAxis.prototype.addSecondaryFormater = function (text, secondaryUnitSymbol) {
	var textValue = text;
	try {
		eval("var formattedText = this.m_util.addUnitAs" + this.m_secondaryFormatterPosition + "(textValue,secondaryUnitSymbol);");
	} catch (e) {
		return formattedText.toString();
	}
	return formattedText.toString();
};

/** @description Creation of BarYAxis Class and attribute initialization**/
function BarYAxis() {
	this.base = Yaxis;
	this.base();
	this.m_showlineyaxis = "true";
	this.m_lineyaxiscolor = "";
	this.m_textUtil = new TextUtil();
	this.m_yAxisText;
	this.ctx;
};

/** @description Inheriting Yaxis property into BarYAxis Class**/
BarYAxis.prototype = new Yaxis;

/** @description BarYAxis initialization**/
BarYAxis.prototype.init = function (m_chart, barCalculation) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.m_chartCalculation = barCalculation;

	this.m_startX = this.m_chart.getStartX();
	this.m_startY = this.m_chart.getStartY();
	this.m_endX = this.m_chart.getEndX();
	this.m_endY = this.m_chart.getEndY();

	this.m_yAxisText = this.m_chartCalculation.getYAxisText();
	this.m_yAxisMarkersArray = this.m_chartCalculation.getYAxisMarkersArray();
	this.setLeftAxisFormatters();
	this.setRightAxisFormatters();
	this.m_isSecodaryAxis = false;
	this.m_axiscolor = convertColorToHex(this.m_chart.getAxisColor());
	this.m_lineyaxiscolor = (this.m_lineyaxiscolor != "") ? convertColorToHex(this.m_lineyaxiscolor) : this.m_axiscolor;
};

/** @description mark Y Axis Text**/
BarYAxis.prototype.markYaxis = function (chartRef, chartCalculation) {
	this.drawAxisLabels();
	if (this.getDescription() != "") {
        this.drawDescription();
    }
};

/** @description Calling label drawing one by one**/
BarYAxis.prototype.drawAxisLabels = function () {
	for (var i = 0, length = this.m_yAxisText.length; i < length; i++) {
		this.ctx.beginPath();
		this.ctx.save();
		this.drawLabel(this.m_yAxisText[length-1-i], i);
		this.ctx.restore();
		this.ctx.closePath();
	}
};

/** @description draw Label Text**/
BarYAxis.prototype.drawLabel = function (text, i) {
	this.m_axislinetotextgap = (IsBoolean(this.m_chart.m_updateddesign) ? 12 : this.m_axislinetotextgap);
	var temp = this;
	var startY = (this.m_startY + this.getYaxisDivison()/2 + (this.getYaxisDivison()) * (i));
	if(IsBoolean(this.m_yaxistextwrap))
	var text = this.m_chart.getText("" + text, this.m_chart.m_width / 4, this.getLabelFontProperties());
	else	
	var text = this.getText("" + text, this.m_chart.m_width / 4, this.getLabelFontProperties());
	var removepadding = (IsBoolean(this.m_chart.m_updateddesign) ? 10 : 0);
	var x = (this.m_startX - this.m_axislinetotextgap);
	//var y = startY;
	var y = (text.length == 1) ? startY : (startY + this.getYaxisDivison() / 8);
	//this.m_textUtil.drawText(this.ctx, text, (this.m_startX) - this.m_axislinetotextgap, startY, this.getLabelFontProperties(), this.m_labeltextalign, convertColorToHex(this.m_labelfontcolor));
	if(!IsBoolean(this.m_yaxistextwrap))
	var text = drawSVGText(x, y, text, this.m_labelfontcolor, this.m_labeltextalign, "middle", this.getLabelrotation());
	else
	var text = this.m_chart.drawSVGTextForCategory(x, y, text, this.m_labelfontcolor, this.m_labeltextalign, "middle", this.getLabelrotation());
	//text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getLabelFontSize()) + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getLabelTextDecoration() + ";");
	$("#yaxislabelgrp" + temp.m_chart.m_objectid).append(text);
	/*if (this.isLabelDecoration()) {
		this.textDecoration(text, this.m_startX * 1 - 2, startY, convertColorToHex(this.m_labelfontcolor), this.m_chart.fontScaling(this.getLabelFontSize()), this.m_labeltextalign);
	}*/
};
BarYAxis.prototype.drawDescription = function() {
	var temp = this;
	var description=(IsBoolean(this.m_chart.m_yAxis.m_showdatasetdescription)) ? this.m_chart.formattedDescription(this.m_chart, this.m_chart.m_allCategoryDisplayNames[0]) : this.m_chart.formattedDescription(this.m_chart, this.getDescription());
	var text = drawSVGText(this.getXDesc(), this.getYDesc(), this.m_chart.formattedDescription(this.m_chart, description), convertColorToHex(this.m_fontcolor), "middle", "middle", 270);
	$(text).css({
		"font-family": selectGlobalFont(temp.getFontFamily()),
		"font-style": temp.getFontStyle(),
		"font-size": temp.m_chart.fontScaling(temp.getFontSize()) +"px",
		"font-weight": temp.getFontWeight(),
		"text-decoration": temp.getTextDecoration()
	});
	$("#" + temp.m_chart.svgContainerId).append(text);
};
BarYAxis.prototype.drawYAxis = function() {
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
/** @description Create seperate block of division**/
BarYAxis.prototype.getYaxisDivison = function () {
	return ((this.m_endY - this.m_startY) / (this.m_yAxisText.length));
};

/** @description create horizontal marker lines**/
BarYAxis.prototype.horizontalMarkerLines = function () {
	var temp = this;
	for (var i = 0, length = this.m_yAxisText.length; i < length ; i++) {
		/*this.ctx.beginPath();
		this.ctx.save();
		this.ctx.lineWidth = 0.5;
		this.ctx.translate(0.5, 0.5);
		this.ctx.strokeStyle = hex2rgb(this.m_chart.m_markercolor, this.m_chart.m_markertransparency);
		this.ctx.moveTo(parseInt(this.m_startX * 1), parseInt(this.m_startY * 1 + this.getYaxisDivison() / 2 + (this.getYaxisDivison()) * (i)));
		this.ctx.lineTo(parseInt(this.m_endX * 1), parseInt(this.m_startY * 1 + this.getYaxisDivison() / 2 + (this.getYaxisDivison()) * (i)));
		this.ctx.stroke();
		this.ctx.restore();
		this.ctx.closePath();*/
		var x1 = parseInt(this.m_startX * 1);
		var y1 = parseInt(this.m_startY * 1 + this.getYaxisDivison() / 2 + (this.getYaxisDivison()) * (i));
		var x2 = parseInt(this.m_endX * 1);
		var y2 = parseInt(this.m_startY * 1 + this.getYaxisDivison() / 2 + (this.getYaxisDivison()) * (i));
		var newLine = drawSVGLine(x1, y1, x2, y2, "0.5", hex2rgb(this.m_chart.m_markercolor, this.m_chart.m_markertransparency));
		$("#horizontallinegrp" + temp.m_chart.m_objectid).append(newLine);
	}
};

/** @description draw tick Marck on Axis**/
BarYAxis.prototype.drawTickMarks = function () {
	var temp = this;
	var tickMakrerHeight = 8;
	if (IsBoolean(this.m_tickmarks)) {
		for (var i = 0, length = (this.m_yAxisText.length + 1); i < length ; i++) {
			/*this.ctx.beginPath();
			this.ctx.save();
			this.ctx.lineWidth = 0.5;
			this.ctx.translate(0.5, 0.5);
			this.ctx.strokeStyle = this.m_categorymarkingcolor;
			this.ctx.moveTo(parseInt(this.m_startX), parseInt(this.m_startY + (this.getYaxisDivison()) * (i)));
			this.ctx.lineTo(parseInt(this.m_startX - tickMakrerHeight * 1), parseInt(this.m_startY + (this.getYaxisDivison()) * (i)));
			this.ctx.stroke();
			this.ctx.restore();
			this.ctx.closePath();*/
			x1 = parseInt(this.m_startX * 1);
			y1 = parseInt(this.m_startY + (this.getYaxisDivison()) * (i));
			x2 = parseInt(this.m_startX - tickMakrerHeight * 1);
			y2 = parseInt(this.m_startY + (this.getYaxisDivison()) * (i));
			var tick = drawSVGLine(x1, y1, x2, y2, "0.5", temp.m_categorymarkingcolor);
			$("#yaxistickgrp" + temp.m_chart.m_objectid).append(tick);
		}
	}
};

/** @description drawing of vertical line**/
BarYAxis.prototype.drawVerticalLine = function () {
	var temp = this;
	var markerArray = this.m_chartCalculation.getXAxisMarkersArray();
	var xAxisDiv = (this.m_endX - this.m_startX) / (markerArray.length - 1);
	for (var i = 0, length = markerArray.length; i < length; i++) {
		/*this.ctx.beginPath();
		this.ctx.save();
		this.ctx.lineWidth = 0.5;
		this.ctx.strokeStyle = hex2rgb(this.m_chart.m_markercolor, this.m_chart.m_markertransparency);
		this.ctx.translate(0.5, 0.5);
		this.ctx.moveTo(parseInt((this.m_startX) + (xAxisDiv * i)), parseInt(this.m_startY));
		this.ctx.lineTo(parseInt((this.m_startX) + (xAxisDiv * i)), parseInt(this.m_endY));
		this.ctx.stroke();
		this.ctx.restore();
		this.ctx.closePath();*/
		x1 = parseInt((this.m_startX) + (xAxisDiv * i));
		y1 = parseInt(this.m_startY);
		x2 = parseInt((this.m_startX) + (xAxisDiv * i));
		y2 = parseInt(this.m_endY);
		var newLine = drawSVGLine(x1, y1, x2, y2, "0.5", hex2rgb(this.m_chart.m_markercolor, this.m_chart.m_markertransparency));
		$("#verticallinegrp" + temp.m_chart.m_objectid).append(newLine);
	}
};
/** @description drawing of zeroMarker line**/
BarYAxis.prototype.zeroMarkerLine = function () {
	var temp = this;
	var markerArray = this.m_chartCalculation.getXAxisMarkersArray();
	var xAxisDiv = (this.m_endX - this.m_startX) / (markerArray.length - 1);
		for (var i = 0, length = markerArray.length; i < length; i++) {
		if (markerArray[i] == 0) {
			/*this.ctx.beginPath();
			this.ctx.save();
			this.ctx.lineWidth = "1.0";
			this.ctx.strokeStyle = hex2rgb(this.m_chart.m_zeromarkercolor, this.m_chart.m_markertransparency);
			this.ctx.translate(0.5, 0.5); // anti aliasing
			this.ctx.moveTo(parseInt((this.m_startX) + (xAxisDiv * i)), parseInt(this.m_startY));
			this.ctx.lineTo(parseInt((this.m_startX) + (xAxisDiv * i)), parseInt(this.m_endY));
			this.ctx.stroke();
			this.ctx.restore();
			this.ctx.closePath();*/
			var newLine = drawSVGLine(parseInt((this.m_startX) + (xAxisDiv * i)), parseInt(this.m_startY), parseInt((this.m_startX) + (xAxisDiv * i)), parseInt(this.m_endY), "1", hex2rgb(temp.m_chart.m_zeromarkercolor, temp.m_chart.m_markertransparency));
			$("#" + temp.m_chart.svgContainerId).append(newLine);
			break;
		}
	}
};
/** @description return true if xAxisMarkerLine Array has negative axis value*/
BarYAxis.prototype.hasNegativeXaxisMarker = function (xAxisMarkerArray) {
	var isNegative = false;
	if (Array.isArray(xAxisMarkerArray) && xAxisMarkerArray.length > 0) {
		var value = Math.min.apply(null, xAxisMarkerArray);
		if (value < 0)
			isNegative = true;
	}
	return isNegative;
};
//# sourceURL=BarChart.js
