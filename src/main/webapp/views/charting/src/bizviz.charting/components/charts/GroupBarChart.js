/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: GroupBarChart.js
 * @description GroupBarChart
 **/
function GroupBarChart(m_chartContainer, m_zIndex) {
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
	this.m_calculation = new GroupBarCalculation();
	this.noOfRows = 1;
	this.m_xAxis = new GroupBarXAxis();
	this.m_yAxis = new GroupBarYAxis();
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
	
	/**DAS-1251 slider properties */
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
};

/** @description Making prototype of chart class to inherit its properties and methods into Bar chart **/
GroupBarChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
GroupBarChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
GroupBarChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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
GroupBarChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description Getter for categoryNames **/
GroupBarChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};

/** @description Getter for Category Display Name **/
GroupBarChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

/** @description Getter for SubCategory Names **/
GroupBarChart.prototype.getSubCategoryNames = function () {
	return this.m_subCategoryNames;
};

/** @description Setter for StartX **/
GroupBarChart.prototype.setStartX = function () {
	var btdm = this.getBorderToDescriptionMargin();
	var dm = this.getYAxisDescriptionMargin();
	var dtlm = this.getDescriptionToLabelMargin();
	var ltam = this.getLabelToAxisMargin();
	this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
	var lm = this.getCatTextMargin();
	var scm = this.getSubCatTextMargin();
	//DAS-1251 Added to support slider in GroupBarChart 
	var sliderwidth = (IsBoolean(this.m_showslider))?this.m_sliderheight:0;
	if(IsBoolean(this.scaleFlag)) {
			this.m_startX = this.m_x * 1;
		}else{
	if (this.m_subcategoryorientation == "left")
		this.m_startX = this.m_x * 1 + btdm * 1 + dm * 1 + dtlm * 1 + lm * 1 + ltam * 1 + scm * 1;
	else
		this.m_startX = this.m_x * 1 + btdm * 1 + dm * 1 + dtlm * 1 + lm * 1 + ltam * 1;
	}
};

/** @description Getter for category Text Margin **/
GroupBarChart.prototype.getCatTextMargin = function () {
	var lm = 0;
	if(this.fontScaling(this.m_yAxis.m_labelfontsize) > 0){
		this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
		if (!IsBoolean(this.isEmptyCategory))
			for (var i = 0; i < this.m_categoryData[0].length; i++) {
				if (lm < this.ctx.measureText(this.m_categoryData[0][i]).width) {
					lm = this.ctx.measureText(this.m_categoryData[0][i]).width;
				}
			}
		lm = lm + 10 * 1;
		if (lm > this.m_width / 4)
			lm = this.m_width / 4;
	}
	if (this.m_subcategoryorientation == "right" && (IsBoolean(this.isEmptySubCategory) || IsBoolean(this.isEmptyCategory))){
			lm=10;
	}
	return lm;
};

/** @description Getter for Sub Category Text Margin **/
GroupBarChart.prototype.getSubCatTextMargin = function() {
	this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_subcategoryfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
	var scm = 0;
	if (this.fontScaling(this.m_yAxis.m_subcategoryfontsize) > 0) {
		if (!IsBoolean(this.isEmptySubCategory))
			for (var j = 0; j < this.m_subCategoryData[0].length; j++) {
				if (scm < this.ctx.measureText(this.m_subCategoryData[0][j]).width) {
					scm = this.ctx.measureText(this.m_subCategoryData[0][j]).width;
				}
			}
		scm = scm + 10 * 1;
		if (scm > this.m_width / 4)
			scm = this.m_width / 4;
	}
	return scm;
};

/** @description Setter for Start Y **/
GroupBarChart.prototype.setStartY = function () {
	var chartYMargin = this.getChartMargin();
	var xlbm = this.getXAxisLabelMarginForBar();
	this.m_startY = this.m_y * 1 + this.m_height * 1 - chartYMargin * 1 - xlbm * 1;
};

/** @description Getter for X Axis Label Margin **/
GroupBarChart.prototype.getXAxisLabelMarginForBar = function () {
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
		var radians = this.m_xAxis.m_labelrotation * (Math.PI / 180);
		var lw = this.fontScaling(this.m_xAxis.getLabelFontSize()) * 1.5 * this.noOfRows;
		this.setLabelWidth();
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

/** @description Calculating text margin after applying the formatter on text**/
GroupBarChart.prototype.getLabelFormatterMargin = function () {
	var lfm = 0;
	if (!IsBoolean(this.m_fixedlabel)) {
		if (IsBoolean(this.m_xAxis.getLeftaxisFormater())) {
			if (this.m_formater != "none" && this.m_formater != "")
				if (this.m_unit != "none" && this.m_unit != "") {
					var unit = this.m_util.getFormatterSymbol(this.m_formater, this.m_unit);
					this.ctx.beginPath();
					this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
					lfm = this.ctx.measureText(unit).width;
					this.ctx.closePath();
				}
		}
	}
	return lfm;
};

/** @description Getter for LabelWidth **/
GroupBarChart.prototype.getLabelWidth = function () {
	return this.m_labelwidth;
};

/** @description formatter will apply on mark X Axis text and calculating width**/
GroupBarChart.prototype.setLabelWidth = function () {
	this.m_labelwidth = 0;
	var maxSeriesVal =((""+this.min).length <= (""+this.max).length)?this.max:this.min;
	if (this.m_charttype == "100%") {
		maxSeriesVal = 100;
	} 
	var maxSeriesValDecimal =maxSeriesVal;
	this.ctx.beginPath();
	this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
	this.m_labelwidth = this.ctx.measureText(maxSeriesValDecimal).width;
	this.ctx.closePath();
	if (this.fontScaling(this.m_xAxis.m_labelfontsize) > 0) {
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
				this.ctx.beginPath();
				this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
				maxSeriesVal = getFormattedNumberWithCommas(maxSeriesVal, this.m_numberformatter);
				this.m_labelwidth = this.ctx.measureText(maxSeriesVal).width;
				this.ctx.closePath();
			}
		}
	}
};

/** @description Getter for label sign margin **/
GroupBarChart.prototype.getLabelSignMargin = function () {
	var lsm = 0;
	var msvw = 0;
	var minSeriesValue =this.min;
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

/** @description Getter for precision margin**/
GroupBarChart.prototype.getLabelPrecisionMargin = function () {
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

/** @description Getter for second formatter margin**/
GroupBarChart.prototype.getLabelSecondFormatterMargin = function () {
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

/** @description Calculating number of rows for x Axis marking(if x axis text are big than it will break into 2 lines) **/
GroupBarChart.prototype.setNumberOfRows = function () {
	this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
	var noOfRow = 1;
	var max= ((""+this.min).length <= (""+this.max).length)?this.max:this.min;
	if (!IsBoolean(this.isEmptySeries)) {
		var maxSeriesVal = (this.m_charttype == "100%") ? 100 : max;
		var markerLength = this.m_xAxisMarkersArray.length;

		var xDivision = (this.getEndX() - this.getStartX()) / markerLength;
		var secondUnit = this.getSecondUnitValue();
		var val = this.m_util.updateTextWithFormatter(maxSeriesVal, secondUnit, this.m_precision);
		var unit = this.getUnitValue();
		if(secondUnit == "auto"){
			secondUnit="K";
		}
		val = val +""+ unit +""+ secondUnit;
		if (this.ctx.measureText(val).width > xDivision) {
			noOfRow = (this.m_skipxaxislabels == "auto") ? 2 : 1;
			//noOfRow = 1; //DAS-1251 aligning slider chart
		}
	}
	return noOfRow;
};

/** @description Getter for second unit formatter**/
GroupBarChart.prototype.getSecondUnitValue = function () {
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
GroupBarChart.prototype.getUnitValue = function () {
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
GroupBarChart.prototype.setEndX = function () {
	var blm = this.getBorderToLegendMargin();
	var vlm = this.getVerticalLegendMargin();
	var vlxm = this.getVerticalLegendToXAxisMargin();
	var sliderwidth = (IsBoolean(this.m_showslider))?this.m_sliderheight:0;//DAS-1251 Added to support slider in GBarchart
	var scm = (this.m_subcategoryorientation == "right") ? this.getSubCatTextMargin() + sliderwidth: 0;
	var addGap = (this.m_subcategoryorientation == "right" && this.m_chartbase == "rectangle")?7:0;
	var rightSideMargin = blm * 1 + vlm * 1 + vlxm * 1 + scm * 1;
	this.m_endX = (this.m_x * 1 + this.m_width * 1 - rightSideMargin * 1-addGap*1 - sliderwidth * 1);
	this.m_endX = (IsBoolean(this.scaleFlag)) ? sliderwidth : this.m_endX;//DAS-1251 Added to support slider in GBarchart
};

/** @description Calculating End Y and setting into this.m_endY variable**/
GroupBarChart.prototype.setEndY = function () {
	this.m_endY = (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};

/** @description Checking is only one series visible **/
GroupBarChart.prototype.getCounterFlagForSeriesVisiblity = function () {
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
GroupBarChart.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	var categoryJson = [];
	this.m_categoryJSON = [];
	this.m_subCategoryJSON =[];
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
GroupBarChart.prototype.setCategory = function (categoryJson) {
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
GroupBarChart.prototype.setSubCategory = function (subCategoryJson) {
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
GroupBarChart.prototype.setSeries = function (seriesJson) {
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
			    if(IsBoolean(this.m_seriesDataLabelProperty[count].dataLabelUseComponentFormater)){
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

/** @description Getter for legend information**/
GroupBarChart.prototype.getLegendInfo = function () {
	return this.legendMap;
};

/** @description Getter for All Series Names **/
GroupBarChart.prototype.getAllSeriesNames = function () {
	return this.m_allSeriesNames;
};

/** @description Getter for All Category Names **/
GroupBarChart.prototype.getAllCategoryNames = function () {
	return this.m_allCategoryNames;
};

/** @description Getter for All Sub Category Names **/
GroupBarChart.prototype.getAllSubCategoryNames = function () {
	return this.m_allSubCategoryNames;
};

/** @description Getter for series Names**/
GroupBarChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};

/** @description Getter for series display Names **/
GroupBarChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};

/** @description Getter for series colors **/
GroupBarChart.prototype.getSeriesColors = function () {
	return this.m_seriesColors;
};

/** @description Setter for legend Names **/
GroupBarChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};

/** @description Getter for legend Names**/
GroupBarChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};

/** @description Pushing all field name into this.m_allFieldsName array  **/
GroupBarChart.prototype.setAllFieldsName = function () {
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
GroupBarChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

/** @description Setter for All fields Display Name **/
GroupBarChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

/** @description Getter for All Fields DisplayName **/
GroupBarChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

/** @description Setting Category Data into this.m_categoryData Array **/
GroupBarChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	this.isEmptyCategory = true;
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.isEmptyCategory = false;
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
	this.CatData = this.m_categoryData;
};

/** @description Setting subcategory Data into this.m_subcategoryData **/
GroupBarChart.prototype.setSubCategoryData = function () {
	this.m_subCategoryData = [];
	this.isEmptySubCategory = true;
	for (var i = 0; i < this.getSubCategoryNames().length; i++) {
		this.isEmptySubCategory = false;
		this.m_subCategoryData[i] = this.getDataFromJSON(this.getSubCategoryNames()[i]);
	}
	this.SubCatData = this.m_subCategoryData;
};

/** @description Fetching data from category,series and moving into category,series array**/
GroupBarChart.prototype.setCategorySubcategorySeriesData = function () {
	this.m_categoryData = [];
	this.m_subCategoryData = [];
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
		/**1251 */
		this.isEmptySubCategory = true;
				if (this.getSubCategoryNames().length > 0) {
					this.isEmptySubCategory = false;
					for (var i = 0, innerLength = this.getSubCategoryNames().length; i < innerLength; i++) {
						if( !this.m_subCategoryData[i] )
							this.m_subCategoryData[i] = [];
						var data = this.getValidFieldDataFromRecord(record,this.getSubCategoryNames()[i]);
						this.m_subCategoryData[i][k] = data;
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
	/**DAS-1251 */
	this.CatData = this.m_categoryData;
	this.SubCatData = this.m_subCategoryData;
    this.SerData = this.m_seriesData;
    this.SerDataLabel = this.m_seriesDataLabel;
};

/** @description Getter for SubCategory Data **/
GroupBarChart.prototype.getSubCategoryData = function () {
	return this.m_subCategoryData;
};

/** @description Getter for Category Data**/
GroupBarChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

/** @description Setter for Series Data **/
GroupBarChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0; i < this.getSeriesNames().length; i++) {
		this.m_seriesData.push(this.getDataFromJSON(this.getSeriesNames()[i]));
	}
	this.SerData = this.m_seriesData;
};
/** @description getter Method for get DataFromJSON according to fieldName **/
GroupBarChart.prototype.getDataFromJSON = function (fieldName) {
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
/** @description Getter for Series Data **/
GroupBarChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

/** @description Setter for Series Color **/
GroupBarChart.prototype.setSeriesColor = function (m_seriesColor) {
	this.m_seriesColor = m_seriesColor;
};

/** @description Getter for Series Color **/
GroupBarChart.prototype.getSeriesColor = function () {
	return this.m_seriesColor;
};

/** @description GroupBarChart initialization of title,subtitle,chartFrame,XAxis,YAxis class **/
GroupBarChart.prototype.init = function () {
	if (IsBoolean(!this.timeLineSliderFlag)) {
			//this.setCategoryData();
			//this.setSeriesData();
			this.updateflag=false;
			this.setCategorySubcategorySeriesData();
			//this.setCategoryData();
			//this.setSubCategoryData();
			//this.setSeriesData();
			this.firstIndex = 0;
			if (this.m_categoryData.length > 0){//DAS-1122
				this.lastIndex = this.m_categoryData[0].length - 1;
				/**Added to calculate conditional colors for complete values of series*/
				this.m_conditionalcolorswithoutslider = this.getConditionalColors().getConditionalColorsForConditionsForMixedTime(this.getSeriesNames(), this.getSeriesColors(), this.m_seriesData, this);
				/**Added for slider window move*/
				this.m_conditionalcolorswithslider = this.m_conditionalcolorswithoutslider;
			}
	}
	//this.setCategoryData();
	//this.setSubCategoryData();
	//this.setSeriesData();
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

	this.visibleSeriesInfo=this.getVisibleSeriesData(this.getSeriesData());
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
GroupBarChart.prototype.manageRepeatedSubCategory = function () {
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
					if(isNaN(mapData[key][key1][i][j])){
						 /**To support comma values (eg. "12,345.97","-12,345.97") **/
						var RemovedCommaData = removeCommaFromSrting(mapData[key][key1][i][j]);
						if(RemovedCommaData!==""){
							processArr.push(RemovedCommaData);
						}else{
							processArr.push(mapData[key][key1][i][j]);
						}
					}else{
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
GroupBarChart.prototype.updateSeriesDataWithCommaSeperators = function () {
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
GroupBarChart.prototype.drawChart = function () {
	this.drawChartFrame();
	var temp = this;
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	if ((!IsBoolean(this.isEmptyCategory)) || (!IsBoolean(this.isEmptySubCategory))) {
		if (!IsBoolean(this.m_isEmptySeries)) {
			if (IsBoolean(this.isVisibleSeries())) {
				this.drawXAxis();
				this.drawYAxis();
				this.drawBarChart();
				this.drawDataLabel();
						/**DAS-1251 gbarchart slider */
				if (IsBoolean(!this.timeLineSliderFlag)) {
				if(IsBoolean(this.m_showslider)){   
					this.getBGGradientColorToScale();
						if (IsBoolean(this.m_sliderrangeflag)) {
							/**checked with actual series data */
								var data = this.m_seriesData[0].length;
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
									/**DAS-1251 gbarchart slider */
									var startvalue = (this.getEndY() * 1) + (temp.m_sliderleftperc * width);
									this.updatechart(startvalue, startvalue + slectedWidth);
								}
							}
						}	
					}
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
/**DAS-1251 @description Will generate the gradient and fill in background of Scale chart  **/
GroupBarChart.prototype.getBGGradientColorToScale = function () {
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
GroupBarChart.prototype.sliderAxisCalculation = function(sliderTotalWidth, slectedWidth) {
    this.tempLeft = sliderTotalWidth - slectedWidth;
    var currentDateObj = new Date();
	var catData = this.CatData[0] || this.SubCatData[0];
    for (var i = 0, length = catData.length; i < length; i++) {
        var dateObj = new Date(catData[i]);
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
GroupBarChart.prototype.setMinMaxSliderIndex = function () {
	this.minSliderIndex=this.m_calculation.minSliderIndex;
	this.maxSliderIndex=this.m_calculation.maxSliderIndex;
};
/** @description Initialize ScaleChart  **/
GroupBarChart.prototype.initScaleChart = function (temp) {
	temp.m_y = 0;
	this.tempTitle = temp.m_title.m_showtitle;
	this.tempSubTitle = temp.m_subTitle.m_showsubtitle;
	//temp.m_height = this.sliderMargin;
	temp.m_title.m_showtitle = false;
	//temp.m_subTitle.m_showsubtitle = false;
	temp.m_showmaximizebutton = true;
	temp.m_showgradient = false;
	temp.m_showrangeselector = false;
	
	temp.setCategorySubcategorySeriesData();
	//temp.setCategoryData();
	//temp.setSubCategoryData();
	//temp.setSeriesData();
	if (temp.getCategoryNames().length != 0 && temp.getSubCategoryNames()[0] != undefined) {
		temp.manageRepeatedSubCategory();
	}
	temp.setAllFieldsName();
	temp.setAllFieldsDisplayName();
	temp.setColorsForSeries();

    if (!IsBoolean(temp.m_isEmptySeries)) {
		temp.setPercentageForHundred();
		temp.initializeCalculation();
	}
	temp.initializeToolTipProperty();
	temp.m_tooltip.init(temp);
};
/** @description This method use for Filter the data according to Selected Range (Slider) **/
GroupBarChart.prototype.updateDragChartFromSlider = function (starty,endy) {
	if(!IsBoolean(this.updateflag)) {
		this.SerData = this.m_seriesData;
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
	var newsubcategory =[];
	var newseries = [];
	/**Added for data label and conditional color calculation*/
	var newseriesDataLabel = [];
	var newseriesConditionalColor = {};
	var newplotradiusarray = {};
	newcategory[0]=[];
	newsubcategory[0]=[];
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
			/**check if catwegory or subcategory not empty */
			if(this.CatData[0] != undefined)
			newcategory[0].push(this.CatData[0][i]);
			if(this.SubCatData[0] != undefined)
			newsubcategory[0].push(this.SubCatData[0][i]);
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
	/**DAS-1257 @desc gbarchart will draw either with @newcategory data or @newsubcategory Data */
	if(newcategory[0].length>=1 || newsubcategory[0].length>=1){
		this.m_afterslider = true;
		this.m_categoryData = newcategory;
		this.m_subCategoryData = newsubcategory;
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
GroupBarChart.prototype.drawScaleChart = function (temp) {
	temp.drawScaleBar();
	this.m_title.m_showtitle = this.tempTitle;
	this.m_subTitle.m_showsubtitle = this.tempSubTitle;
};
/** @description drawing of bar chart**/
GroupBarChart.prototype.drawScaleBar = function() {
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
GroupBarChart.prototype.updatechart = function(start, end) {
	var temp = this;
	this.updateDragChartFromSlider(start, end);
};
GroupBarChart.prototype.sliderTextBox = function() {
    var temp = this;
    var left = this.getEndY();
    var width = this.getStartY() - this.getEndY();
    var textwidth = width/6 ;
	/**DAS-1251 @desc show category or subcategory on slider text when one of them is empty */
    if ((this.m_sliderTextField == "" || this.m_sliderTextField == undefined) && (temp.CatData[0] != undefined))  {
        var startData = temp.CatData[0][0];
        var endData = temp.CatData[0][temp.CatData[0].length - 1];
    } else if ((this.m_sliderTextField == "" || this.m_sliderTextField == undefined) && (temp.SubCatData[0] != undefined))  {
		        var startData = temp.SubCatData[0][0];
		        var endData = temp.SubCatData[0][temp.SubCatData[0].length - 1];
	} else{
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
GroupBarChart.prototype.drawslider = function() {
	var temp = this;
	$("#rangeslider" + temp.m_objectid).remove();
	if (IsBoolean(this.m_showslider)) {
		this.jquerySliderImplementation();
	}
};
/**DAS-564 @description jquery slider implentation */
GroupBarChart.prototype.jquerySliderImplementation = function() {
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
	$("#leftHandle" + temp.m_objectid).attr("style", "position:absolute;top:-2px;left:" + this.m_sliderheight / 4 + "px;height:5px;width:" + this.m_sliderheight / 2.5 + "px;border:1px solid " + leftbordercolor + ";background:#999999;");

	var rightHandle = document.createElement("div");
	rightHandle.setAttribute("id", "rightHandle" + temp.m_objectid);
	$(silderSelecterdiv).append(rightHandle);
	var rightbordercolor = hex2rgb(this.m_sliderbordercolor, this.m_sliderborderopacity);
	$("#rightHandle" + temp.m_objectid).attr("style", "position:absolute;left:" + this.m_sliderheight / 4 + "px;bottom:-2px;height:5px;width:" + this.m_sliderheight / 2.5 + "px;border:1px solid " + rightbordercolor + ";background:#999999;");

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
/** @description drawing line accroding to the passed parameter value**/
GroupBarChart.prototype.drawLine = function (startX, StartY, endX, endY) {
	var temp = this;
    var newLine = drawSVGLine(startX, StartY, endX, endY, "1", hex2rgb(this.m_markercolor, this.m_markertransparency));
	$("#horizontallinegrp" + temp.m_objectid).append(newLine);
/*	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.lineWidth = "0.5";
	this.ctx.translate(0.5, 0.5);
	this.ctx.strokeStyle = hex2rgb(this.m_markercolor, this.m_markertransparency);
	this.ctx.moveTo(parseInt(startX), parseInt(StartY));
	this.ctx.lineTo(parseInt(endX), parseInt(endY));
	this.ctx.stroke();
	this.ctx.restore();
	this.ctx.closePath();*/
};

/** @description Canvas Initialization and removing already present canvas which have same id **/
GroupBarChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description Initialization of Draggable Div and Canvas **/
GroupBarChart.prototype.initializeDraggableDivAndCanvas = function () {
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
GroupBarChart.prototype.createSVG = function () {
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

/** @description Calculating required parameters which will use in further processing inside this function **/
GroupBarChart.prototype.initializeCalculation = function () {
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
GroupBarChart.prototype.calculateMinimumMaximum = function (seriesdata) {
	var minMax;
	if (this.m_charttype.toLowerCase() == "clustered" || this.m_charttype.toLowerCase() == "overlaid") {
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
	
	var niceScaleObj=this.getCalculateNiceScale(calculatedMin,calculatedMax,this.m_basezero,this.m_autoaxissetup,this.m_minimumaxisvalue,this.m_maximumaxisvalue,(this.m_width));
	this.min=niceScaleObj.min;
	this.max=niceScaleObj.max;
	this.m_numberOfMarkers=niceScaleObj.markerArray.length;
	this.m_xAxisText=niceScaleObj.step;
	this.m_xAxisMarkersArray=niceScaleObj.markerArray;
};

/** @description calculate max,min from series data**/
GroupBarChart.prototype.calculateFinalMinMaxValue = function(xAxisData) {
	var calculateMax = (isNaN(xAxisData[0][0]*1)) ? 0 : xAxisData[0][0]*1;
	var calculateMin = (isNaN(xAxisData[0][0]*1)) ? 0 : xAxisData[0][0]*1;
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
				if( !isNaN(xAxisData[i][j] * 1) ){
					if (xAxisData[i][j] * 1 > 0)
						height = (	height) * 1 + (xAxisData[i][j] * 1) * 1;
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
GroupBarChart.prototype.calculateCategoryBoxSize = function () {
	var boxWidth = {};
	var y = this.getStartY() - this.m_barGap / 2;
	var i = Object.keys(this.dataMap).length - 1;
	for (Object.keys(this.dataMap)[i] in this.dataMap) {
		var count = 0;
		for (var subCat in this.dataMap[Object.keys(this.dataMap)[i]]) {
			count++;
		}
		if (IsBoolean(this.m_mergesubcategory) && this.m_categoryNames[0] != undefined) {
			y = y - (count * this.m_barWidth) - (this.m_barGap / 2);
		} else{
			y = y - (count * this.m_barWidth + this.m_barGap * count - this.m_barGap / 2);
		}
		boxWidth[Object.keys(this.dataMap)[i]] = y;
		
		y = y - this.m_barGap / 2;
		i--;
	}
	return boxWidth;
};

/** @description Checking is all series data conatin zero **/
GroupBarChart.prototype.getCheckedAllPosContainigZero = function () {
	var flag = true;
	for (var i = 0; i < this.m_seriesData[this.m_seriesVisiblityPosition].length; i++) {
		if (this.m_seriesData[this.m_seriesVisiblityPosition][i] != 0)
			flag = false;
	}
	return flag;
};

/** @description Initializing percent array with Zero **/
GroupBarChart.prototype.getArrayWhenPercentFlagIsFalse = function () {
	var per = [];
	for (var i = 0; i < this.m_seriesData.length; i++) {
		per[i] = 0;
	}
	return per;
};

/** @description Calculating Percentage of series values **/
GroupBarChart.prototype.getPercentage = function () {
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
GroupBarChart.prototype.getSumOfSeriesData = function () {
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
GroupBarChart.prototype.initializeBars = function() {
    this.m_barSeriesArray = {};
    for (var i = 0; i < this.visibleSeriesInfo.seriesName.length; i++) {
        this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[i]] = new GroupBarSeries();
        var barWidth = (this.m_charttype == "clustered") ? this.m_barWidth / this.visibleSeriesInfo.seriesName.length : this.m_barWidth;
        /**Added for bar drawing position issue*/
        if (this.m_charttype == "clustered") {
            barWidth = barWidth * this.clusteredbarpadding;
        }
        this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[i]].init(this.m_xPositionArray[i], this.m_yPositionArray[i], barWidth, this.m_barWidthArray[i], this.m_percentageArray, this.getColorsForSeries()[i], this.m_strokecolor, this.m_showmarkingorpercentvalue, this.m_showPercentValueFlag, this.m_seriesInitializeFlag, this.m_plotTrasparencyArray[i], this);
    }
};
/** @description Data Label for BarSeries Initialization**/
GroupBarChart.prototype.initializeDataLabel = function() {
    this.m_valueTextSeries = {};
    if (!(this.getCategoryNames().length != 0 && this.getSubCategoryNames()[0] != undefined)) {
    	this.m_seriesDataForDataLabel = [];
	}
    /**Added when subcategory is not there in the chart*/
    if ((this.m_seriesDataForDataLabel.length === undefined) || IsBoolean(this.isEmptySubCategory) || (this.m_seriesDataForDataLabel.length === 0)) {
        this.setSeriesDataLabel();
    }
    for (var k = 0, i1 = 0; i1 < this.m_seriesNames.length; i1++) {
		/**slider datalabel support */
		this.m_seriesDataForDataLabel[i1] = this.visibleSeriesInfo.seriesData[i1];
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i1]])) {
            if (IsBoolean(this.m_seriesDataLabelProperty[i1].showDataLabel)) {
            	if((this.m_charttype == "100%") && (this.m_seriesDataLabelProperty[k].showPercentValue !== undefined) && IsBoolean(this.m_seriesDataLabelProperty[k].showPercentValue)){
                	this.m_seriesDataForDataLabel[k] = this.getPercentageForHundred()[k];
                	var value = k;
                }else{
                	var value = i1;
                }
                var barWidth = (this.m_charttype == "clustered") ? this.m_barWidth / this.visibleSeriesInfo.seriesName.length : this.m_barWidth;
                this.m_valueTextSeries[this.m_seriesNames[i1]] = new ValueTextSeries();
                this.m_valueTextSeries[this.m_seriesNames[i1]].init(this.m_xPositionArray[k], this.m_yPositionArray[k], this, this.m_seriesDataForDataLabel[value], this.m_seriesDataLabelProperty[i1], this.m_seriesData[i1], barWidth, this.m_barWidthArray[k]);
            };
            k++;
        }
    }
};

/** @description creating series data for data label**/
GroupBarChart.prototype.setSeriesDataLabel = function() {
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
GroupBarChart.prototype.getColorsForSeries = function () {
	return this.m_seriesColorsArray;
};

/** @description Setter for Series Color **/
GroupBarChart.prototype.setColorsForSeries = function () {
	
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
	} else if (!IsBoolean(this.m_designMode) && (this.getCategoryColors() != undefined) && this.getCategoryColors() != "" && this.getCategoryColors().getCategoryColor().length > 0 && IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName()) && this.m_categoryJSON.length>0) {
		var categoryColors = [];
		if(this.m_subCategoryNames.length>0 && this.m_categoryNames.length == 0){
			categoryColors = this.getCategoryColors().getCategoryColorsForCategoryNames(this.getSubCategoryData()[0], this.m_categoryFieldColor);
		}else{
			categoryColors = this.getCategoryColors().getCategoryColorsForCategoryNames(this.getCategoryData()[0], this.m_categoryFieldColor);
		}
		for (var i = 0; i < this.visibleSeriesInfo.seriesData.length; i++) {
			this.m_seriesColorsArray[i] = [];
			for (var j = 0; j < this.visibleSeriesInfo.seriesData[i].length; j++) {
				this.m_seriesColorsArray[i][j] = categoryColors[j];
			}
		}
	}
	else if (!IsBoolean(this.m_designMode) && (this.getSubCategoryColors() != undefined) && this.getSubCategoryColors() != "" && this.getSubCategoryColors().getSubCategoryColor().length > 0 && IsBoolean(this.getSubCategoryColors().getshowColorsFromSubCategoryName()) && this.m_subCategoryJSON.length>0) {
			var categoryColors = this.getSubCategoryColors().getSubCategoryColorsForSubCategoryNames(this.getSubCategoryData()[0], this.m_categoryFieldColor);
			for (var i = 0; i < this.visibleSeriesInfo.seriesData.length; i++) {
				this.m_seriesColorsArray[i] = [];
				for (var j = 0; j < this.visibleSeriesInfo.seriesData[i].length; j++) {
					this.m_seriesColorsArray[i][j] = categoryColors[j];
				}
			}
		}		
	else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && (!IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName())|| this.getCategoryColors().getCategoryColor().length == 0) && this.getConditionalColors() != "" && this.getConditionalColors() != undefined && this.getConditionalColors().getConditionalColor().length > 0 && !IsBoolean(isemptyCat)) {
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
GroupBarChart.prototype.updateSeriesData = function (array) {
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
GroupBarChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

/** @description Drawing of SubTitle **/
GroupBarChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

/** @description Drawing of XAxis**/
GroupBarChart.prototype.drawXAxis = function () {
	this.createHorizontalLineGroup('horizontallinegrp');
	if (IsBoolean(this.m_showhorizontalmarkerline))
		this.drawPartitionLine();
	if (IsBoolean(this.m_showcatpartitioner))
		this.drawCategoryPartitionLine();
	this.createXAxisMarkerLabelGroup('xaxislabelgrp');
	this.m_xAxis.markXaxis();
	this.m_xAxis.drawXAxis();
};

/** @description Calculating StartX,StartY,EndX,EndY for partition line**/
GroupBarChart.prototype.drawCategoryPartitionLine = function () {
	var startPoint = this.getStartX() - this.getSubCatTextMargin() - this.m_yAxis.m_axislinetotextgap;
	if (this.m_subcategoryorientation == "left")
		startPoint = this.getStartX() - this.getCatTextMargin() - this.getSubCatTextMargin() - this.m_yAxis.m_axislinetotextgap;
	else
		startPoint = this.getStartX() - this.getCatTextMargin() - this.m_yAxis.m_axislinetotextgap;

	this.drawLine(startPoint, this.getStartY()*1+1*1, this.getStartX(), this.getStartY()*1+1*1);
	var boxSize = this.calculateCategoryBoxSize();
	for (var key in boxSize) {
		this.drawLine(startPoint, boxSize[key], this.getStartX(), boxSize[key]);
	}
};

/** @description Drawing Line which will create partition between the category Data**/
GroupBarChart.prototype.drawPartitionLine = function () {
	var startPoint = this.getStartX();
	this.drawLine(startPoint, this.getStartY()*1+1*1, this.getEndX()*1-1*1, this.getStartY()*1+1*1);
	var boxSize = this.calculateCategoryBoxSize();
	for (var key in boxSize) {
		this.drawLine(startPoint, boxSize[key], this.getEndX()*1-1*1
				, boxSize[key]);
	}
};

/** @description Drawing Y Axis**/
GroupBarChart.prototype.drawYAxis = function () {
	if (IsBoolean(this.m_showverticalmarkerline)) {
		this.createVerticalLineGroup('verticallinegrp');
		this.m_yAxis.drawVerticalLine();
	}
	if (IsBoolean(this.m_zeromarkerline) && !IsBoolean(this.m_basezero) && IsBoolean(this.m_yAxis.hasNegativeAxisMarker(this.m_xAxisMarkersArray)))
		this.m_yAxis.drawZeroMarkerLine();
	if ((!IsBoolean(this.isEmptySubCategory) && !IsBoolean(this.isEmptyCategory)) && this.m_subcategoryorientation == "left" && IsBoolean(this.m_showcatsubcatpartitioner))
		this.drawVerticalPartLine();
	if(!IsBoolean(this.m_mergesubcategory)) {
		this.createTickGroup('yaxistickmark');
		this.m_yAxis.drawTickMarks();
	}
	this.createYAxisCategoryMarkerLabelGroup('yaxiscategorylabelgrp');
	this.createYAxisSubCategoryMarkerLabelGroup('yaxissubcategorylabelgrp');
	this.m_yAxis.markSubCategory();
	this.m_yAxis.drawYAxis();
	this.m_yAxis.drawCategory();
};

/** @description Drawing Vertical Partiton line between category and subcategory**/
GroupBarChart.prototype.drawVerticalPartLine = function () {
	var startX = this.getStartX() - this.getSubCatTextMargin();
	this.drawLine(startX, this.getStartY(), startX, this.getEndY());
	/* enhancement : added a line at the begining of category data */
    var StartPoint = this.getStartX() - this.getCatTextMargin() - this.getSubCatTextMargin() - this.m_yAxis.m_axislinetotextgap;
	this.drawLine(StartPoint, this.getStartY(), StartPoint, this.getEndY())
};

/** @description Will Draw ChartFrame and gradient if given any, default is #ffffff **/
GroupBarChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawSVGFrame();
	this.getBGGradientColorToContainer();
};

/** @description Will generate the gradient and fill in background of chart  **/
GroupBarChart.prototype.getBGGradientColorToContainer = function() {
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

/** @description overrite drawObject Method  because of ChartFrame and Titles are drawn on SVG  **/
GroupBarChart.prototype.drawObject = function () {
	this.drawSVGObject();
};

/** @description Draw Bar Chart**/
GroupBarChart.prototype.drawBarChart = function () {
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
	for (var k = 0; k < this.visibleSeriesInfo.seriesName.length; k++) {
		var barSeriesArray = this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[k]];
		this.createStackGroup(barSeriesArray, "stackgrp", k, this.visibleSeriesInfo.seriesName[k]);
		barSeriesArray.drawBarSeries(k);
	}
};

/** @description drawing Data Label on bar chart**/
GroupBarChart.prototype.drawDataLabel = function() {
	this.m_overlappeddatalabelarrayX = [];
	this.m_overlappeddatalabelarrayY = [];
	for (var i = 0, length = this.m_seriesNames.length; i < length; i++) {
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
        	var valueText = this.m_valueTextSeries[this.m_seriesNames[i]];
            if (IsBoolean(this.m_seriesDataLabelProperty[i].showDataLabel)) {
            	this.createDataLabelGroup(valueText, 'datalabelgrp' , i, this.m_seriesNames[i]);
            	this.m_valueTextSeries[this.m_seriesNames[i]].drawValueTextSeries();
            }
        }
    }
};
/** @description Get Sum of Array**/
GroupBarChart.prototype.getArraySUM = function (arr) {
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
GroupBarChart.prototype.getUpdateSeriesDataWithCategory = function (arr) {
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
GroupBarChart.prototype.setPercentageForHundred = function () {
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
GroupBarChart.prototype.getPercentageForHundred = function () {
	return this.m_SeriesDataInPerForHundredChart;
};

/** @description Updating series data and converting it into percentage when chart type is hundred percent chart**/
GroupBarChart.prototype.getUpdateSeriesDataForHundredPercentageChart = function (arr) {
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
GroupBarChart.prototype.getToolTipData = function (mouseX, mouseY) {
	var toolTipData;
	var seriesData = [];
	/**Remove this.isEmptyCategory because tooltip was not drawing for the data with no subcategory.*/
	if (!IsBoolean(this.m_isEmptySeries) && IsBoolean(this.isVisibleSeries()) && IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")) {
		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			this.yPositions = this.m_calculation.getYPositionforToolTip();
			seriesData = this.visibleSeriesInfo.seriesData;
			var percentageData = this.getPercentageForHundred();
			for (var i = 0; i < this.yPositions.length; i++) {
				if (mouseY <= (this.yPositions[i] * 1 + this.m_barWidth * 1) && (mouseY >= this.yPositions[i] * 1)) {
					toolTipData = {};
					toolTipData.cat = "";
					toolTipData.subcat = "";
					toolTipData["data"] = new Array();

					if (!IsBoolean(this.isEmptyCategory))
						toolTipData.cat = this.getCategoryData()[0][i];
					if (!IsBoolean(this.isEmptySubCategory))
					toolTipData.subcat = this.getSubCategoryData()[0][i];
					if (IsBoolean(this.m_customtextboxfortooltip.dataTipType == "Default")){
						for (var j = 0, k = 0; j < this.visibleSeriesInfo.seriesData.length; j++) {
							var data = [];
							var newVal;
							//data[0] = this.visibleSeriesInfo.seriesColor[j];
							data[1] = this.visibleSeriesInfo.seriesDisplayName[j];
							/*Added to show drill color or indicator color in the tooltip*/
							if (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) {
								data[0] = (this.m_charttype != "overlaid") ? this.getColorsForSeries()[j][i] : this.m_drillColor;
							}else{
								data[0] = (this.m_charttype != "overlaid") ? this.getColorsForSeries()[j][i] : this.visibleSeriesInfo.seriesColor[j];
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
};

/** @description Get Drill Color on which bar it is clicked**/
GroupBarChart.prototype.getDrillColor = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries)) {
		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			var barWidth;
			/**Added to resolve BDD-682 issue*/
			var drillMinStackHeight = (this.m_charttype == "stacked") ? 0 : this.m_drillminstackheight;
			for (var i = 0; i < this.m_yPositionArray.length; i++) {
				for (var j = 0; j <= this.m_yPositionArray[i].length; j++) {
					if(this.m_barWidthArray[i][j] * 1 < 0){
						barWidth = (this.m_barWidthArray[i][j] * 1 < -drillMinStackHeight ) ? this.m_barWidthArray[i][j] * 1 : -drillMinStackHeight;
						var range1 = this.m_xPositionArray[i][j] * 1 + barWidth;
						var range2 = this.m_xPositionArray[i][j] * 1;
					}else{
						barWidth = (IsBoolean(this.m_basezero)&&(this.visibleSeriesInfo.seriesData[i][j] * 1 < 0)) ? 0 : (this.m_barWidthArray[i][j] * 1 > drillMinStackHeight ) ? this.m_barWidthArray[i][j] * 1 : drillMinStackHeight;
						var range1 = this.m_xPositionArray[i][j] * 1;
						var range2 = this.m_xPositionArray[i][j] * 1 + barWidth;
					}
					if(this.m_charttype == "clustered"){
						if(mouseX >= range1 && mouseX <= range2 && mouseY >= this.m_yPositionArray[i][j] * 1 && mouseY <= (this.m_yPositionArray[i][j] * 1 + (this.m_barWidth * 1/this.m_yPositionArray.length))){
							return i;
						}
					}else{
						if(mouseX >= range1 && mouseX <= range2 && mouseY >= this.m_yPositionArray[i][j] * 1 && mouseY <= (this.m_yPositionArray[i][j] * 1 + this.m_barWidth * 1)){
							return i;
						}
					}
				}
			}
		}
	}
};

/** @description Calling DrawToolTip method when series is not empty**/
GroupBarChart.prototype.drawTooltip = function (mouseX, mouseY) {
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

/** @description Converting selected bar details into DOM element for tooltip**/
GroupBarChart.prototype.drawTooltipContent = function(toolTipData) {
	this.m_tooltip.draw(toolTipData, this.m_componenttype);
};

/** @description Getting Drilled bar and fetching bar information**/
GroupBarChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && IsBoolean(this.isVisibleSeries())) {
		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			var barWidth;
			var isDrillIndexFound = false;
			var drillMinStackHeight = (this.m_charttype == "stacked") ? 0 : this.m_drillminstackheight;
			for (var i = 0; i < this.m_yPositionArray.length; i++) {
				for (var j = 0; j < this.m_yPositionArray[i].length; j++) {
					if(this.m_barWidthArray[i][j] * 1 < 0){
						barWidth = (this.m_barWidthArray[i][j] * 1 < -drillMinStackHeight ) ? this.m_barWidthArray[i][j] * 1 : -drillMinStackHeight;
						var range1 = this.m_xPositionArray[i][j] * 1 + barWidth;
						var range2 = this.m_xPositionArray[i][j] * 1;
					}else{
						barWidth = (IsBoolean(this.m_basezero)&&(this.visibleSeriesInfo.seriesData[i][j] * 1 < 0)) ? 0 : (this.m_barWidthArray[i][j] * 1 > drillMinStackHeight ) ? this.m_barWidthArray[i][j] * 1 : drillMinStackHeight;
						var range1 = this.m_xPositionArray[i][j] * 1;
						var range2 = this.m_xPositionArray[i][j] * 1 + barWidth;
					}
					if(this.m_charttype == "clustered"){
						if(mouseX >= range1 && mouseX <= range2 && mouseY >= this.m_yPositionArray[i][j] * 1 && mouseY <= (this.m_yPositionArray[i][j] * 1 + (this.m_barWidth * 1/this.m_yPositionArray.length))) {
							var fieldNameValueMap = this.getFieldNameValueMap(j);
							/**Clicked color drills as the drill-color not series color.*/
							var drillColor = this.getColorsForSeries()[i][j];
							var drillField = this.visibleSeriesInfo.seriesName[i];
							var drillDisplayField = this.visibleSeriesInfo.seriesDisplayName[i];
							var drillValue = fieldNameValueMap[drillField];
							fieldNameValueMap.drillField = drillField;
							fieldNameValueMap.drillDisplayField = drillDisplayField;
							fieldNameValueMap.drillValue = drillValue;
							fieldNameValueMap.drillIndex = j;  
							
							return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
						}
					}else{
						if(mouseX >= range1 && mouseX <= range2 && mouseY >= this.m_yPositionArray[i][j] * 1 && mouseY <= (this.m_yPositionArray[i][j] * 1 + (this.m_barWidth * 1))) {
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
							
							return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
						}
					}
				}
			}
			if(this.m_charttype == "stacked" && !isDrillIndexFound) {
				for (var k = 0, length = this.yPositions.length; k < length; k++) {
					if (mouseY <= (this.yPositions[k] * 1 + this.m_barWidth * 1) && (mouseY >= this.yPositions[k] * 1)) {
						for(var l = 0,innerlength = this.m_xPositionArray.length; l < innerlength; l++){
							if(((mouseX >= this.m_xPositionArray[l][k]) && (mouseX <= this.m_xPositionArray[l][k] + this.m_drillminstackheight)) || ((mouseX <= this.m_xPositionArray[l][k] + this.m_barWidthArray[l][k])  && (mouseX >= this.m_xPositionArray[l][k] - this.m_drillminstackheight))) {
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
		}
	}
};

/** @description Creating FieldValue Map where key is category,subcategory,series field name and values will be respective category,subcategory,series 
 * Can not use chart.js method as groupbar chart data is re-shuffled and mapped as per category/ subcategory
 * which might break in the drill and pass wrong data **/
/*GroupBarChart.prototype.getFieldNameValueMap = function (j) {
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
	
	//getting values from data provider 
	var m_fieldNameValueMap = new Object();
	var afn = this.getAllFieldsName();
	for (var l = 0; l < afn.length; l++) {
		m_fieldNameValueMap[afn[l]] = this.getDataProvider()[i][afn[l]];
	}
	return m_fieldNameValueMap;
};*/

/** @description Creating GroupBarCalculation class**/
function GroupBarCalculation() {
	this.xPositionArray = [];
	this.yAxisPixelArray = [];
	this.xPositionMap = {};//DAS-1251 Added to support slider in GBarchart 
	this.yPositionMap = {};
	this.barGap = 10;
	this.m_xAxisText = "";
	this.m_numberOfMarkers = 6;
	this.minSliderIndex="";//DAS-1251 Added to support slider in GBarchart 
	this.maxSliderIndex="";
};

/** @description Initialization of GroupBarCalculation **/
GroupBarCalculation.prototype.init = function (chart, subcategorydata, seriesdata, completeData) {
	this.m_chart = chart;
	this.m_chartData = completeData;
	this.yAxisData = subcategorydata;
	this.xAxisData = seriesdata;//this.m_chart.getVisibleSeriesData(convertArrayType(seriesdata));
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
	this.setYPositionArray();
};

/** @description Getter for start X**/
GroupBarCalculation.prototype.getStartX = function () {
	return this.startX * 1;
};

/** @description Getter for Max Value**/
GroupBarCalculation.prototype.getMaxValue = function () {
	return this.m_chart.max;
};

/** @description Getter for Min Value**/
GroupBarCalculation.prototype.getMinValue = function () {
	return this.m_chart.min;
};

/** @description Getter for X Axis Text**/
GroupBarCalculation.prototype.getXAxisText = function () {
	//this.getMaxValue();
	return this.m_chart.m_xAxisText;
};

/** @description Getter for X Axis Marker Array**/
GroupBarCalculation.prototype.getXAxisMarkersArray = function () {
	return this.m_chart.m_xAxisMarkersArray;
};

/** @description Calculating Bar Width when chart type is different-2**/
GroupBarCalculation.prototype.calculateBarWidth = function () {
	var numberOfColumns = this.yAxisData.length;
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
	var availableDrawWidth = this.getDrawHeight() * 1;                /*(this.getDrawHeight() * 1 - totalGap * 1);*/
	if(this.m_chart.m_controlbarwidth  == "auto") {
		var barWidth = (availableDrawWidth / this.yAxisData.length);
		barWidth = (barWidth * this.m_chart.m_barwidth)/100;
	} else {
		if (this.m_chart.m_controlbarwidth < (availableDrawWidth / numberOfColumns)) {
		    var barWidth = this.m_chart.m_controlbarwidth;
		} else {
		    var barWidth = (availableDrawWidth / numberOfColumns);
		    barWidth = (barWidth * this.m_chart.m_barwidth) / 100;
		}
	}
	
	//DAS-1251 Added to support slider in GBarchart 
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
	/*if(this.m_chart.m_charttype == "clustered" && barWidth > 60){
		this.setBarWidth(60);
		this.setColumnGap(60, numberOfColumns);
	} else if (barWidth > 40) {
		this.setBarWidth(40);
		this.setColumnGap(40, numberOfColumns);
	} else if (barWidth < 9) {
		this.setBarWidth(7);
		this.setColumnGap(7, numberOfColumns);
	} else {
		this.setBarWidth(barWidth);
	}*/
	this.setBarWidth(barWidth);
	this.setColumnGap(barWidth, numberOfColumns);
};

/** @description return minimum frequency in miliseconds **/
GroupBarCalculation.prototype.getDataFrequencyInMS = function (xAxisData) {
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

/** @description Setter for Bar Width**/
GroupBarCalculation.prototype.setBarWidth = function (barwidth) {
	this.barWidth = barwidth;
};

/** @description Setter for Column Gap**/
GroupBarCalculation.prototype.setColumnGap = function (barWidth, numberOfColumns) {
	var totalBarwidth = barWidth * this.yAxisData.length;
	var totalGap = this.getDrawHeight() - totalBarwidth;
	this.barGap = totalGap / ((numberOfColumns * 1));
};

/** @description Draw Base line**/
GroupBarCalculation.prototype.drawBaseLine = function () {
	ctx.beginPath();
	ctx.lineWidth = "0.4";
	ctx.strokeStyle = "#000";
	ctx.moveTo(this.getStartX(), this.startY);
	ctx.lineTo(this.getStartX(), this.endY);
	ctx.stroke();
	ctx.closePath();
};

/** @description Setter for Ratio**/
GroupBarCalculation.prototype.setRatio = function () {
	this.ratio = this.getDrawWidth() / (this.getMaxValue() - this.getMinValue());
	
};

/** @description Getter for Draw Height**/
GroupBarCalculation.prototype.getDrawHeight = function () {
	this.drawHeight = (this.startY - this.endY);
	return this.drawHeight;
};

/** @description Getter for Draw Width**/
GroupBarCalculation.prototype.getDrawWidth = function () {
	this.drawWidth = (this.endX * 1) - (this.startX * 1);
	return this.drawWidth;
};

/** @description Getter for Bar Gap**/
GroupBarCalculation.prototype.getBarGap = function () {
	return this.barGap;
};

/** @description Getter for Bar Width**/
GroupBarCalculation.prototype.getbarWidth = function () {
	return this.barWidth;
};

/** @description Getter for Ratio**/
GroupBarCalculation.prototype.getRatio = function () {
	return this.ratio;
};

/** @description Getter for X Position Array**/
GroupBarCalculation.prototype.getXPositionArray = function () {
	return this.xPositionArray;
};

/** @description Setter for X Position Array for Hundred Percent **/
GroupBarCalculation.prototype.setXPositionArrayForStackHundredPercent = function () {
	this.stackHeightArray = [];
	var xparray = [];
	var positivePointerArray = [];
	var negativePointerArray = [];
	this.m_startX = this.getStartX();
	this.m_xAxisData = this.xAxisData;
	var xAxisData = (this.m_chartType === "100%") ? this.m_chart.getPercentageForHundred() : this.xAxisData;
	for (var i = 0, length = xAxisData.length; i < length; i++) {
		xparray[i] = [];
		positivePointerArray[i] = [];
		negativePointerArray[i] = [];
		this.stackHeightArray[i] = [];
		for (var j = 0, innerlength = xAxisData[i].length; j < innerlength; j++) {
			if (isNaN(xAxisData[i][j])) {
                xAxisData[i][j] = "";
            }
			var ratio = this.getRatio();
			
			if (i == 0) {
				if (xAxisData[i][j] * 1 >= 0) {
					if ((this.m_chart.m_minimumaxisvalue * 1 > 0) && (!IsBoolean(this.m_chart.isAxisSetup())))
						xparray[i][j] = (this.m_startX);
					else
						xparray[i][j] = ((this.m_startX)  - (ratio) * this.getMinValue());
					positivePointerArray[i][j] = xparray[i][j]+xAxisData[i][j]*ratio;
					negativePointerArray[i][j] = xparray[i][j] * 1;
				} else {
					xparray[i][j] = ((this.m_startX) - (ratio) * this.getMinValue());
					negativePointerArray[i][j] = xparray[i][j]+xAxisData[i][j]*ratio*1;
					positivePointerArray[i][j] = (this.m_startX) * 1 - (ratio) * this.getMinValue();
				}
			} else {
				if (this.m_xAxisData[i][j] >= 0) {
					positivePointerArray[i][j] = positivePointerArray[i - 1][j];
					negativePointerArray[i][j] = negativePointerArray[i - 1][j];
					xparray[i][j] = (positivePointerArray[i][j] * 1);
					positivePointerArray[i][j] = xparray[i][j] * 1+xAxisData[i][j]*ratio;
				} else {
					negativePointerArray[i][j] = negativePointerArray[i - 1][j];
					positivePointerArray[i][j] = positivePointerArray[i - 1][j];
					xparray[i][j] = (negativePointerArray[i][j] * 1 );
					negativePointerArray[i][j] = xparray[i][j] * 1+xAxisData[i][j]*ratio;
				}
			}
			if (this.getMaxValue() < 0) {
				var value = xAxisData[i][j] - this.getMaxValue();
			} else if(this.getMinValue() < 0) {
				var value = xAxisData[i][j];
			} else {
				var value = (xAxisData[i][j] - this.getMinValue());
			}
			this.stackHeightArray[i][j] = (ratio*value);
		}
		
	}
	return xparray;
};

/** @description Setter for X Position Array**/
GroupBarCalculation.prototype.setXPositionArray = function () {
	this.xPositionArray = [];
	this.stackHeightArray = [];
	if(this.m_chart.m_charttype == "stacked" || this.m_chart.m_charttype == "100%")
	{
		this.xPositionArray = this.setXPositionArrayForStackHundredPercent();
	}else{
	for (var i = 0; i < this.xAxisData.length; i++) {
		this.xPositionArray[i] = [];
		this.stackHeightArray[i] = [];
		for (var j = 0; j < this.xAxisData[i].length; j++) {
			var ratio1 = this.getRatio();
			var min = this.getMinValue();
			var max = this.getMaxValue()
			if(this.m_chart.m_charttype == "clustered"){
				if(max<0){
					/**Added for condition when auto axes true & base zero false and dataset contains all negative values.*/
					this.xPositionArray[i][j] = (this.getStartX()) * 1-(min-max)*ratio1;
					this.stackHeightArray[i][j] = (this.xAxisData[i][j]-max) * ratio1;
				}else if(min<0){
					this.xPositionArray[i][j] = (this.getStartX()) * 1-min*ratio1;
					this.stackHeightArray[i][j] = (this.xAxisData[i][j]) * ratio1;
				}
				else{
					this.xPositionArray[i][j] = (this.getStartX()) * 1;
					this.stackHeightArray[i][j] = (this.xAxisData[i][j] - min) * ratio1;
					/**Addded for when subcategory is not their drawing were differing*/
				}
			}
		}
		}
	}
	this.xPositionMap = this.xPositionArray;//DAS-1251 Added to support slider in GBarchart
	this.manageMinMaxExceedLimitData();
};

/** @description Handle data when it is greater than Max Limit and less than Min Limit**/
GroupBarCalculation.prototype.manageMinMaxExceedLimitData = function () {

	for(var i=0;i<this.xPositionArray.length;i++)
	{
		for(var j=0;j<this.xPositionArray[i].length;j++)
		{
			if(this.xPositionArray[i][j]>this.m_chart.getEndX())
			{
				this.xPositionArray[i][j] = this.m_chart.getEndX();
			}
			if(this.xPositionArray[i][j]<this.m_chart.getStartX())
			{
				this.xPositionArray[i][j] = this.m_chart.getStartX();
			}
			var stackWidth = this.xPositionArray[i][j]+this.stackHeightArray[i][j];
			if(this.getStartX()>stackWidth)
			{
				this.stackHeightArray[i][j] = this.stackHeightArray[i][j] +(this.getStartX()-stackWidth);
			}
			if(stackWidth>this.m_chart.getEndX())
			{
				this.stackHeightArray[i][j] = this.m_chart.getEndX()-this.xPositionArray[i][j];
			}
		}
	}
};

/** @description Getter for Y Position Array**/
GroupBarCalculation.prototype.getYPositionArray = function () {
	return this.yPositionArray;
};

/** @description Setter for Y Position Array**/
GroupBarCalculation.prototype.setYPositionArray = function () {
	this.yPositionArray = [];
	var clusteredBarPadding = (this.getbarWidth() - this.getbarWidth()*this.m_chart.clusteredbarpadding)/2;
	if (IsBoolean(this.m_chart.m_mergesubcategory) && (this.m_chart.m_categoryNames[0] != undefined) && (this.m_chart.m_subCategoryNames[0] != undefined)) {
		//when mergeSubcategory is ON
		var CountArray = [];
		var count = 0;
		var a = Object.keys(this.dataMap).length - 1;
		for (Object.keys(this.dataMap)[a] in this.dataMap) {
			for (var key1 in this.dataMap[Object.keys(this.dataMap)[a]]) {
				count++;
			}
			a--;
			CountArray.push(count);
		}
		var startPoint = 0;
		var barGap = this.getBarGap() / 2;
		var startY = this.startY;
		for (var k = 0; k < CountArray.length; k++) {
			startY = startY - barGap;
			for (var i = startPoint; i < CountArray[k]; i++) {
				this.yPositionArray[i] = [];
				for (var j = 0,x=1; j < this.xAxisData.length; j++) {
					if(this.m_chart.m_charttype == "clustered"){
						this.yPositionArray[i][j] = startY - (this.getbarWidth() * (i))-(this.getbarWidth() / this.xAxisData.length) * x + clusteredBarPadding;
						x++;
					}
					else
					{
						this.yPositionArray[i][j] = startY - (this.getbarWidth() * 1) - (this.getbarWidth() * (i));
						
					}

				}
				this.yPositionArray[i] = (this.yPositionArray)[i].reverse();
			}
			startPoint = CountArray[k];
			barGap = this.getBarGap();
		}
		this.yPositionArray = (this.yPositionArray).reverse();
	} else {
		for (var i = 0; i < this.xAxisData[0].length; i++) {
			this.yPositionArray[i] = [];
			for (var j = 0,k=this.xAxisData.length; j < this.xAxisData.length; j++) {
				if(this.m_chart.m_charttype == "clustered"){
					//this.yPositionArray[i][j] = this.startY - (this.getBarGap()) * (i) - this.getBarGap() / 2 - (this.getbarWidth() * (i))-(this.getbarWidth()/this.xAxisData.length)*k + clusteredBarPadding;
					this.yPositionArray[i][j] = this.startY - (this.getBarGap()) * (this.xAxisData[0].length-1-i) - this.getBarGap() / 2 - (this.getbarWidth() * (this.xAxisData[0].length-1-i))-(this.getbarWidth()/this.xAxisData.length)*k + clusteredBarPadding;
					k--;
				}
				else{
				this.yPositionArray[i][j] = this.startY - (this.getBarGap()) * (this.xAxisData[0].length-1-i) - (this.getbarWidth() * 1) - this.getBarGap() / 2 - (this.getbarWidth() * (this.xAxisData[0].length-1-i));
				}
			}
		}
	}
	this.yPositionArray = convertArrayType(this.yPositionArray);
};

/** @description Getter for Y Position Data which will be used in tooltip**/
GroupBarCalculation.prototype.getYPositionforToolTip = function () {
	var yPosArray = [];
	var yPosDataArray = this.getYPositionArray();
	for (var n = 0; n < yPosDataArray[0].length; n++) {
		yPosArray.push(yPosDataArray[0][n]);
	}
	return yPosArray;
};

/** @description Getter for Stack Height Array**/
GroupBarCalculation.prototype.getstackHeightArray = function () {
	return this.stackHeightArray;
};

/** @description Getter for Y Axis Text**/
GroupBarCalculation.prototype.getYAxisText = function () {
	return this.yAxisData;
};

/** @description Getter for Y Axis Marker Array**/
GroupBarCalculation.prototype.getYAxisMarkersArray = function () {
	return this.yAxisData;
};

/** @description Creation of GroupBarSeries Class**/
function GroupBarSeries() {
	this.xPixel = [];
	this.yPixelArray = [];
	this.stackHeightArray = [];
	this.stackColorArray = [];
	this.barStackArray = [];
	this.ctx = "";
	this.m_chart = "";
	this.m_chartbase = "";
};

/** @description initialization of GroupBarSeries class and creating object of GroupBarStack **/
GroupBarSeries.prototype.init = function (xPixel, yPixelArray, stackWidth, stackHeightArray, stackPercentArray, stackColorArray, strokeColor, stackMarkingOnTopBarFlag, showPercentValueFlag, m_seriesInitializeFlag, plotTrasparency, chart) {
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
		this.barStackArray[i] = new GroupBarStack();
		this.barStackArray[i].init(this.xPixel[i], this.yPixelArray[i], this.stackWidth, this.stackHeightArray[i], this.stackPercentArray[i], this.stackColorArray[i], this.strokecolor, this.ctx, chart, this.m_chartbase, this.m_stackMarkingOnTopOfBarFlag, this.m_stackShowPercentValueFlag, this.m_stackSeriesInitializeFlag, this.m_plotTrasparency);
	}
};

/** @description Drawing of Bar Stack **/
GroupBarSeries.prototype.drawBarSeries = function (k) {
	for (var i = 0; i < this.xPixel.length; i++) {
		this.barStackArray[i].drawBarStack(k, i);
	}
};

/** @description Creation of GroupBarStack class **/
function GroupBarStack() {
	this.stackXPixel;
	this.stackYPixel;
	this.stackWidth;
	this.stackHeight;
	this.stackColor;
	this.strokeColor;
	this.ctx = "";
	this.m_chartbase = "";
};

/** @description initializing GroupBarStack **/
GroupBarStack.prototype.init = function (stackXPixel, stackYPixel, stackWidth, stackHeight, stackPercentValue, stackColor, strokeColor, ctx, ref, chartbase, showPercentageFlag, stackShowPercentValueFlag, m_stackSeriesInitializeFlag, plotTrasparency) {
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
GroupBarStack.prototype.drawBarStack = function (k, i) {
	var temp = this;
	//var id = temp.m_chart.svgContainerId;
	//DAS-564 Added to support slider in Barchart 
	var id = (!temp.m_chart.scaleFlag) ? "stackgrp" + k + temp.m_chart.m_objectid : "stackgrpslider" + k + temp.m_chart.m_objectid;
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.strokeStyle = this.strokeColor;
	this.ctx.lineWidth = 0.5;
	var strokeWidth = 0.5;
	switch (this.m_chartbase){
		case "rectangle":
			if(this.stackHeight < 0 ){
				this.stackXPixel = this.stackXPixel + this.stackHeight;
				this.stackHeight = Math.abs(this.stackHeight);
			}
			/**DAS-695 */
			if(this.stackHeight !== 0 ) {
			this.makeCuboid(this.stackXPixel, this.stackYPixel, this.stackWidth, this.stackHeight, this.stackColor);
			this.ctx.fillStyle = hex2rgb(this.stackColor, this.m_stackPlotTrasparency);
			var svgStack = drawSVGRect(this.stackXPixel, this.stackYPixel, this.stackHeight, this.stackWidth, hex2rgb(this.stackColor, this.m_stackPlotTrasparency));
			svgStack.setAttribute("style", "stroke-width:" + strokeWidth + "px; stroke:" + this.strokeColor + ";");
			//$("#stackgrp"+k+temp.m_chart.m_objectid).append(svgStack);
			$("#"+id).append(svgStack);//DAS-1251 Added to support slider in GBarchart
			}
			break;
		case "chevron":
			if(this.stackHeight !== 0 ) {
				this.makeChevron(this.stackXPixel, this.stackYPixel, this.stackHeight, this.stackWidth, hex2rgb(this.stackColor, this.m_stackPlotTrasparency), this.strokeColor, k);
			}
			break;
		case "gradient1":
			if(this.stackHeight < 0 ) {
				this.stackXPixel = this.stackXPixel + this.stackHeight;
			}
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
				svgStack.setAttribute("fill", "url(#gradient" + temp.m_chart.m_objectid + k + i +")");
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
				$("#"+id).append(svgStack);
			}
			break;
		case "gradient2":
			if(this.stackHeight < 0 ){
				this.stackXPixel = this.stackXPixel + this.stackHeight;
			}
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
				$("#"+id).append(svgStack);
			}
			break;
		case "gradient3":
			if(this.stackHeight < 0 ){
				this.stackXPixel = this.stackXPixel + this.stackHeight;
			}
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
				$("#"+id).append(svgStack);
			}
			break;
		default:
			if(this.stackHeight < 0 ){
				this.stackXPixel = this.stackXPixel + this.stackHeight;
			}
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
				$(svgStack).attr("id", "stackgrp"+temp.m_chart.m_objectid+k+i);
				//$("#stackgrp"+k+temp.m_chart.m_objectid).append(svgStack);
				$("#"+id).append(svgStack);
				
				
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
		        			} /*else if(($("#"+clickid).css("opacity") == "1") && IsBoolean( temp.m_chart.m_drilltoggle)) {
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
GroupBarStack.prototype.drawSVGPathBar = function(temp, id, fillColor, actualHeight, actualWidth) {
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

/** @description drawing of text **/
GroupBarStack.prototype.drawText = function () {
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
GroupBarStack.prototype.createGradient = function () {
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
GroupBarChart.prototype.createGradient1 = function (color, j, i) {
	var temp = this;
	var id = temp.svgContainerId;
	var linearGradient = document.createElementNS(NS, 'linearGradient');
	linearGradient.setAttribute("x1", "0%");
	linearGradient.setAttribute("x2", "0%");
	linearGradient.setAttribute("y1", "0%");
	linearGradient.setAttribute("y2", "100%");
	linearGradient.setAttribute("id", "gradient" + temp.m_objectid + j + i);
	$('#' + temp.svgContainerId).append(linearGradient);
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

/** @description Creating Gradient when chart base is Gradient2**/
GroupBarChart.prototype.createGradient2 = function (color, j, i) {
	var temp = this;
	var id = temp.svgContainerId;
	var linearGradient = document.createElementNS(NS, 'linearGradient');
	linearGradient.setAttribute("x1", "0%");
	linearGradient.setAttribute("x2", "0%");
	linearGradient.setAttribute("y1", "0%");
	linearGradient.setAttribute("y2", "100%");
	linearGradient.setAttribute("id", "gradient" + temp.m_objectid + j + i);
	$('#' + temp.svgContainerId).append(linearGradient);
	var color0 = hex2rgb(color, this.m_plotTrasparencyArray[j]);
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

/** @description Creating Gradient when chart Base is Gradient3**/
GroupBarChart.prototype.createGradient3 = function (color, j, i) {
	var temp = this;
	var id = temp.svgContainerId;
	var linearGradient = document.createElementNS(NS, 'linearGradient');
	linearGradient.setAttribute("x1", "0%");
	linearGradient.setAttribute("x2", "0%");
	linearGradient.setAttribute("y1", "0%");
	linearGradient.setAttribute("y2", "100%");
	linearGradient.setAttribute("id", "gradient" + temp.m_objectid + j + i);
	$('#' + temp.svgContainerId).append(linearGradient);
	var color0 = hex2rgb(color, this.m_plotTrasparencyArray[j]);
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
GroupBarStack.prototype.createGradient3 = function (x, y, w, h, color) {
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
GroupBarStack.prototype.makeCylinder = function (x, y, w, h, color) {
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
GroupBarStack.prototype.makeCuboid = function (x, y, w, h, color) {
	var temp = this;
	//var id = temp.m_chart.svgContainerId;
	//DAS-1251 Added to support slider in GBarchart
	var id = (!temp.m_chart.scaleFlag) ? temp.m_chart.svgContainerId: temp.m_chart.svgTimeScaleId; 
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
GroupBarStack.prototype.makeChevron = function (x, y, w, h, color, stroke, index) {
	var temp = this;
	//var id = temp.m_chart.svgContainerId;
	//DAS-1251 Added to support slider in GBarchart 
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
	//$("#stackgrp"+index+temp.m_chart.m_objectid).append(svgPath);
	$("#"+id).append(svgPath);//DAS-564 Added to support slider in Barchart
};

/** @description Creating GroupBarXAxis class**/
function GroupBarXAxis() {
	this.base = Xaxis;
	this.base();
	this.m_showlinexaxis = "true";
	this.m_linexaxiscolor = "";
	this.m_textUtil = new TextUtil();
	this.m_util = new Util();
	this.ctx = "";
	this.noOfRows = 1;
};

/** @description Inheriting Xaxis class property into GroupBarXAxis class using the prototype**/
GroupBarXAxis.prototype = new Xaxis;

GroupBarXAxis.prototype.init = function (m_chart) {
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

/** @description Getter for Y Axis Divison**/
GroupBarXAxis.prototype.getYaxisDivison = function (markerArray) {
	return ((this.m_endY - this.m_startY) / (markerArray.length));
};

/** @description Getting X Axis Marker Array and draw marker text**/
GroupBarXAxis.prototype.markXaxis = function () {
	var temp = this;
	var m_axisLineToTextGap = this.calculateAxisLineToTextGap();
	var markerArray = this.m_chart.m_calculation.getXAxisMarkersArray();
	var xAxisDiv = (this.m_chart.getEndX() - this.m_chart.getStartX()) / (markerArray.length - 1);
	
	var markerLength = markerArray.length;
	var plottedAxisMarkers = [];
	for (var i = 0; i < markerLength; i++) {
		var text = markerArray[i];
		text = this.getFormattedText(text, this.m_precision);
		//text = getFormattedNumberWithCommas(text, this.m_chart.m_numberformatter);
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
	
	for (var i = 0; i < markerArray.length; i++) {
		if ((i % this.m_chart.m_skipxaxislabels) == 0 || this.m_chart.m_skipxaxislabels == "auto") {
			this.ctx.save();
			text = plottedAxisMarkers[i];
			var textWidth = this.ctx.measureText(text).width;
			if (this.noOfRows == 2) {
				text = this.getText("" + text, ((this.m_endX - this.m_startX) / markerArray.length) * 2, this.getLabelFontProperties());
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
			    var text = drawSVGText(x, y, text, this.m_labelfontcolor, labelAlign, "middle", this.getLabelrotation());
			} else {
				var text = drawSVGText(x, y, text, this.m_labelfontcolor, labelAlign, "middle", this.getLabelrotation());
			}
			$("#xaxislabelgrp" + temp.m_chart.m_objectid).append(text);
			//text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getLabelFontSize()) + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getLabelTextDecoration() + ";");
			//$("#" + temp.m_chart.svgContainerId).append(text);
			/*if (this.isLabelDecoration())
				this.drawUnderLine(text, 0, 0 + this.m_chart.fontScaling(this.m_labelfontsize) / 2, convertColorToHex(this.m_labelfontcolor), this.m_chart.fontScaling(this.getLabelFontSize()), this.m_labeltextalign);
			this.m_textUtil.drawText(this.ctx, getFormattedNumberWithCommas(text, this.m_chart.m_numberformatter), 0, 0, this.getLabelFontProperties(), this.m_labeltextalign, convertColorToHex(this.m_labelfontcolor));*/
			this.ctx.restore();
			this.ctx.closePath();
		}
	}
	/*if (this.getDescription() != "") {
        this.drawDescription();
    }*/
    this.drawDescription();
};

GroupBarXAxis.prototype.drawDescription = function() {
	var temp = this;
	var serDec = this.m_chart.m_allSeriesDisplayNames.reduce(function(acc, item) { return item !== "" ? (acc === "" ? item : acc + ", " + item) : acc; }, "");
	var description=(IsBoolean(this.m_chart.m_xAxis.m_showdatasetdescription)) ? this.m_chart.formattedDescription(this.m_chart, serDec) : this.getDescription();
	//DAS-1251 Added to support slider in GBarchart 
	if (description != "") {
		var text = drawSVGText(this.getXDesc(), this.getYDesc(), this.m_chart.formattedDescription(this.m_chart, description), convertColorToHex(this.m_fontcolor), "middle", "middle");
		$(text).css({
			"font-family": selectGlobalFont(temp.getFontFamily()),
			"font-style": temp.getFontStyle(),
			"font-size": temp.m_chart.fontScaling(temp.getFontSize()) + "px" ,
			"font-weight": temp.getFontWeight(),
			"text-decoration": temp.getTextDecoration()
		});
		$("#" + temp.m_chart.svgContainerId).append(text);
	}
};

GroupBarXAxis.prototype.drawXAxis = function() {
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

/** @description Translate text on the basis of given rotation**/
GroupBarXAxis.prototype.translateTextPosition = function (m_axisLineToTextGap, i, text, xAxisDiv) {
	var labelRotation = this.getLabelrotation();
	var textWidth = this.getLabelTextWidth(text);
	var x = (this.m_startX) * 1 + (xAxisDiv * i);
	var axisToLabelMargin = this.calculateAxisToLabelMargin(i);
	var y = this.m_startY * 1 + m_axisLineToTextGap * 1 + axisToLabelMargin * 1;
	this.translateText(labelRotation, x, y, text);
};

/** @description if text  size is greater than the coming text width than wrap text and add ".."**/
GroupBarXAxis.prototype.getText = function (text, textWidth, ctxFont) {
	var newText = "";
	this.ctx.font = ctxFont;

	var strWidth = this.ctx.measureText(text).width;
	if (text.length > 0)
		var appendedTextWidth = (strWidth / text.length) * 2;

	for (var i = 0; i < text.length; i++) {
		if (this.ctx.measureText(newText).width < (textWidth - appendedTextWidth)) {
			newText += text[i];
		} else {
			newText = newText + "..";
			break;
		}
	}
	return newText;
};

/** @description Getter for formatted text**/
GroupBarXAxis.prototype.getFormattedText = function (text, prec) {
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

/** @description Adding formatter on left axis marker array**/
GroupBarXAxis.prototype.setLeftAxisFormatters = function () {
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

/** @description Setting right axis formatter on right axis marker text**/
GroupBarXAxis.prototype.setRightAxisFormatters = function () {
	if (IsBoolean(this.m_chart.m_secondaryaxisshow)) {
		if (IsBoolean(this.getRightAxisFormater())) {
			this.setSecondAxisFormatter();
		}
	}
	this.m_secondaryAxisPrecision = this.m_chart.m_secondaryaxisprecision;
};

/** @description Adding secondary axis formatter on the marker text**/
GroupBarXAxis.prototype.setSecondAxisFormatter = function () {
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

/** @description Getting formatter details from the JSON and setting into global variables**/
GroupBarXAxis.prototype.setFormatter = function () {
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

/** @description Getting secondary formatter details from JSON and setting it into global variables**/
GroupBarXAxis.prototype.setSecondaryFormatter = function () {
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

/** @description Taking text and putting formatter on the text**/
GroupBarXAxis.prototype.getSecondaryAxisFormattedText = function (text) {
	if (this.m_isSecondAxisFormatter) {
		text = this.m_util.addFormatter(text, this.m_secondAxisUnitSymbol, this.m_secondAxisFormatterPosition);
	}
	return text;
};

/** @description Set precision on the text according to the coming precision value**/
GroupBarXAxis.prototype.setPrecision = function (text, precision) {
	var text = text * 1;
	if(text !== 0){
		if (precision !== "default") {
			return (text * 1).toFixed(precision);
		} else {
			return (text * 1);
		}
	}
	else{
		return text * 1;
	}
};

/** @description Add secondary formatter on the text**/
GroupBarXAxis.prototype.addSecondaryFormater = function (text, secondaryUnitSymbol) {
	var textValue = text;
	try {
		eval("var formattedText = this.m_util.addUnitAs" + this.m_secondaryFormatterPosition + "(textValue,secondaryUnitSymbol);");
	} catch (e) {
		return formattedText.toString();
	}
	return formattedText.toString();
};

/** @description Creating class for GroupBarY Axis**/
function GroupBarYAxis() {
	this.base = Yaxis;
	this.base();
	this.m_showlineyaxis = "true";
	this.m_lineyaxiscolor = "";
	this.m_textUtil = new TextUtil();
	this.m_yAxisText;
	this.ctx;
};

/** @description Making YAxis to the parent of GroupBarYAxis using the prototype**/
GroupBarYAxis.prototype = new Yaxis;

/** @description GroupBarYAxis initialization**/
GroupBarYAxis.prototype.init = function (m_chart, barCalculation) {
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

/** @description Mark Subcategory along with category**/
GroupBarYAxis.prototype.markSubCategory = function (chartRef, chartCalculation) {
	this.drawAxisLabels();
	/*if (this.getDescription() != "") {
        this.drawDescription();
    }*/
    this.drawDescription();
};

/** @description Calling drawLabel function**/
GroupBarYAxis.prototype.drawAxisLabels = function () {
	for (var i = 0; i < this.m_yAxisText.length; i++) {
		this.ctx.beginPath();
		this.ctx.save();
		this.drawLabel(this.m_yAxisText[i], i);
		this.ctx.restore();
		this.ctx.closePath();
	}
};

/** @description Drawing of label**/
GroupBarYAxis.prototype.drawLabel = function (text, i) {
	var temp = this;
	var startY = (this.m_chart.m_yPositionArray[0][i] * 1 + this.m_chart.m_barWidth / 2); //(this.m_startY  + this.getYaxisDivison()/2 +(this.getYaxisDivison())*(i));
	if(this.m_chart.m_charttype == "clustered"){
		//startY = (this.m_chart.m_yPositionArray[0][i] * 1 + this.m_chart.m_barWidth / this.m_chart.m_yPositionArray.length);
		startY = (this.m_chart.m_yPositionArray[0][i] * 1 + this.m_chart.m_barWidth / 2);
	}
	/*var text = this.getText("" + text, this.m_chart.m_width / 4, this.getSubCatLabelFontProperties());
	var addGap =(this.m_chart.m_subcategoryorientation == "right" && this.m_chart.m_chartbase == "rectangle")?12:(this.m_chart.m_subcategoryorientation == "right")?5:0;
	if (this.m_chart.m_subcategoryorientation == "right")
		var text = drawSVGText((this.m_chart.getEndX() * 1 + addGap * 1), startY, text, this.m_labelfontcolor, "left", "middle", this.getLabelrotation());
		//this.m_textUtil.drawText(this.ctx, text, this.m_chart.getEndX() * 1 + addGap * 1, startY, this.getLabelFontProperties(), "left", convertColorToHex(this.m_labelfontcolor));
	else
		//this.m_textUtil.drawText(this.ctx, text, (this.m_startX) - this.m_axislinetotextgap, startY, this.getLabelFontProperties(), this.m_labeltextalign, convertColorToHex(this.m_labelfontcolor));
		var text = drawSVGText(((this.m_startX) - this.m_axislinetotextgap), startY, text, this.m_labelfontcolor, this.m_labeltextalign, "middle", this.getLabelrotation());
		$("#yaxissubcategorylabelgrp" + temp.m_chart.m_objectid).append(text);
		//text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getLabelFontSize()) + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getLabelTextDecoration() + ";");
		//$("#" + temp.m_chart.svgContainerId).append(text);*/
	
	/*DAS-731*/
	var textWrap,labelFontSize,labelFontProperties,axisGroup;
	if(this.m_chart.m_subCategoryJSON.length == 0 || !IsBoolean(this.m_chart.m_subCategoryJSON[0].visible)){
		textWrap = this.m_yaxiscategorytextwrap;
		labelFontSize = this.m_labelfontsize;
		labelFontProperties =  this.getLabelFontProperties();
		axisGroup = $("#yaxiscategorylabelgrp" + temp.m_chart.m_objectid);
	}else{
		textWrap = this.m_yaxissubcategorytextwrap;
		labelFontSize = this.m_subcategoryfontsize;
		labelFontProperties =  this.getSubCatLabelFontProperties();
		axisGroup = $("#yaxissubcategorylabelgrp" + temp.m_chart.m_objectid);
	}

	var addGap =(this.m_chart.m_subcategoryorientation == "right" && this.m_chart.m_chartbase == "rectangle")?12:(this.m_chart.m_subcategoryorientation == "right")?5:0;
	/**DAS-1251 @desc show category or subcategory with limited text when one of them is empty and subcategory orientation is right and slider is enabled */
	var sliderwidth = (IsBoolean(this.m_chart.m_showslider) && this.m_chart.m_subcategoryorientation == "right" && (IsBoolean(this.m_chart.isEmptyCategory) || IsBoolean(this.m_chart.isEmptySubCategory)))?this.m_chart.m_sliderheight+addGap+10:0;
	if(!IsBoolean(textWrap)) {
		var text = this.getText("" + text, this.m_chart.m_width / 4 - sliderwidth, labelFontProperties);
		if (this.m_chart.m_subcategoryorientation == "right")
			var text = drawSVGText((this.m_chart.getEndX() * 1 + addGap * 1), startY, text, this.m_labelfontcolor, "left", "middle", this.getLabelrotation());
		else
			var text = drawSVGText(((this.m_startX) - this.m_axislinetotextgap), startY, text, this.m_labelfontcolor, this.m_labeltextalign, "middle", this.getLabelrotation());
	}else{
		//var text = this.getTexts("" + text, this.m_chart.m_width / 4, this.getSubCatLabelFontProperties());
		var avlblheight = this.m_chart.m_width / 4 - sliderwidth;
		var subcatboxwidth = Math.abs(this.getYaxisDivison())/1.2;
		var nooflines = this.calculateLabelLength(text,subcatboxwidth);
		if (this.m_chart.m_subcategoryorientation == "right")
		    var text = this.drawSVGTextForCategory((this.m_chart.getEndX() * 1 + addGap * 1), startY, text, this.m_labelfontcolor, "left", "middle", this.getLabelrotation(), avlblheight, nooflines, labelFontProperties, labelFontSize);
		else 
			var text = this.drawSVGTextForCategory((this.m_startX - this.m_axislinetotextgap), startY, text, this.m_labelfontcolor, this.m_labeltextalign, "middle", this.getLabelrotation(), avlblheight, nooflines, labelFontProperties, labelFontSize);
	}
	axisGroup.append(text);
	/*if (this.isLabelDecoration()) {
	if(this.m_chart.m_subcategoryorientation == "right")
		this.textDecoration(text, this.m_chart.getEndX() * 1 + addGap * 1, startY, convertColorToHex(this.m_labelfontcolor), this.m_chart.fontScaling(this.getLabelFontSize()), "left");
	else
		this.textDecoration(text, this.m_startX * 1 - 5, startY, convertColorToHex(this.m_labelfontcolor), this.m_chart.fontScaling(this.getLabelFontSize()), this.m_labeltextalign);
    }*/
};

GroupBarYAxis.prototype.getSubCatLabelFontProperties = function() {
	return this.m_textUtil.getFontProperties(this.getLabelFontStyle(), this.getLabelFontWeight(), this.m_chart.fontScaling(this.m_subcategoryfontsize), this.getLabelFontFamily());
};
GroupBarYAxis.prototype.drawDescription = function() {
	var temp = this;
	var description=(IsBoolean(this.m_chart.m_yAxis.m_showdatasetdescription)) ? this.m_chart.formattedDescription(this.m_chart, this.m_chart.m_allCategoryDisplayNames[0]) : this.m_chart.formattedDescription(this.m_chart, this.getDescription());
	if (description != "") {
		var text = drawSVGText(this.getXDesc(), this.getYDesc(), this.m_chart.formattedDescription(this.m_chart, description), convertColorToHex(this.getFontColor()), "middle", "middle", 270);
		$(text).css({
			"font-family": selectGlobalFont(temp.getFontFamily()),
			"font-style": temp.getFontStyle(),
			"font-size": temp.m_chart.fontScaling(temp.getFontSize()) +"px",
			"font-weight": temp.getFontWeight(),
			"text-decoration": temp.getTextDecoration()
		});
		$("#" + temp.m_chart.svgContainerId).append(text);
	}	
};

GroupBarYAxis.prototype.drawYAxis = function() {
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

/** @description Draw Category Text**/
GroupBarYAxis.prototype.drawCategory = function () {
	var temp = this;
	var cm = this.m_chart.getCatTextMargin();
	var scm = 0;
	if (this.m_chart.m_subcategoryorientation == "left")
		scm = this.m_chart.getSubCatTextMargin();
	var data = this.m_chart.calculateCategoryBoxSize();
	var startY = this.m_startY;
	
	for (var key in data) {
		var subCatCount = Object.keys(this.m_chart.dataMap[key]).length;
		if (IsBoolean(this.m_chart.m_mergesubcategory)) {
		    var boxHeight = (subCatCount * this.m_chart.m_barWidth) + this.m_chart.m_barGap;
		} else {
		    var boxHeight = subCatCount * (this.m_chart.m_barWidth + this.m_chart.m_barGap);
		}
		var y = data[key] + boxHeight / 2;
		var x = this.m_chart.getStartX() - (cm / 2) - scm * 1 - 5 * 1;
		/*DAS-376*/
		if(!IsBoolean(this.m_yaxiscategorytextwrap)) {
			var textData = this.getText("" + key, this.m_chart.m_width / 4, this.getLabelFontProperties());
			var text = drawSVGText((x), y, textData, this.m_labelfontcolor, "middle", "middle", this.getLabelrotation());
		}else{
			var textData = 	key;
			var avlblheight = this.m_chart.m_width / 4;
			//var avlblheight = ((this.m_chart.m_endX - this.m_chart.m_startX) / Object.keys(data).length);
			var nooflines = this.calculateLabelBoxSize(textData);
			var text = this.drawSVGTextForCategory(x, y, textData, this.m_labelfontcolor, "center", "middle", this.getLabelrotation(), avlblheight, nooflines, this.getLabelFontProperties(), this.getLabelFontSize());
		}
		$("#yaxiscategorylabelgrp" + temp.m_chart.m_objectid).append(text);
		//text.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getFontSize()) + "px;font-weight:" + this.getFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
		//$("#" + temp.m_chart.svgContainerId).append(text);
		//this.m_textUtil.drawText(this.ctx, textData, (x), y, this.getLabelFontProperties(), "center", convertColorToHex(this.m_labelfontcolor));
		/*if (this.isLabelDecoration()) {
			this.textDecoration(textData, x * 1 - 2, y, convertColorToHex(this.m_labelfontcolor), this.m_chart.fontScaling(this.getLabelFontSize()), "center");
		}*/
		startY = data[key];
	}

};

GroupBarYAxis.prototype.calculateLabelBoxSize = function(text) {
	var boxSize = this.m_chart.calculateCategoryBoxSize();
	var x = boxSize[text];
	var index = Object.keys(boxSize).indexOf(text);
	if(index > 0) {
	  var y = boxSize[Object.keys(boxSize)[index - 1]];
	} else {
		var y = this.m_chart.getStartY();
	}
//	var textBoxSize = y - x;
	var noOfLines = this.calculateLabelLength(text,(y-x));
	return noOfLines;
};
GroupBarYAxis.prototype.calculateLabelLength = function(text,availableHeight) {
	var textBoxSize = availableHeight; 
	var textSize = this.ctx.measureText(text).actualBoundingBoxAscent + this.ctx.measureText(text).actualBoundingBoxDescent;
	textSize = textSize * 1.3;
	var lines = (textBoxSize/textSize).toFixed(0);
	return lines;
};
/** @description SVG drawing methods for category**/
GroupBarYAxis.prototype.drawSVGTextForCategory= function(x, y, text, fillColor, hAlign, Valign, angle, avlblWidth, nooflines, labelFontproperties, labelFontSize) {
	var newText = document.createElementNS(NS, "text");
	// set the below method to return the 3 lines label arrays
	/*var labelText1 = this.getTexts("" + text, avlblWidth, this.getLabelFontProperties());
	var labelText = labelText1.slice(0, 3);
	var extraDot = (labelText1.length>3)?".....":"";*/
	
	/*DAS-731*/
	var labelText1 = this.getTexts("" + text, avlblWidth, labelFontproperties);	
	var labelText = labelText1.slice(0, nooflines);
	labelText = labelText.slice(0, 3);
	var extraDot = (labelText1.length>labelText.length)?"...":"";
	if(labelText.length == 1) {
		if (!isNaN(x) && !isNaN(y)) {
			newText.setAttribute("x", x);
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
			for(var i = 0; i < labelText.length; i++) {
				var spanElement = document.createElementNS(NS, "tspan");
				if(i == 0){
					spanElement.setAttribute("x", x);
				} else {
					spanElement.setAttribute("x", x);
					spanElement.setAttribute("dy", this.m_chart.fontScaling(labelFontSize) * 1);
				}
				spanElement.textContent = labelText[i];
				spanElement.textContent += (i == labelText.length-1) ? extraDot : "";
				newText.appendChild(spanElement);
			}
		}
		return newText;
	}
};
/** @description method will return y-axis labels text when textwrap is true. **/
GroupBarYAxis.prototype.getTexts = function(text1, textWidth, ctxFont) {
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
	        if (labelTexts.length == this.m_chart.m_xaxislabellines) {
	            break;
	        }
	        if (testWidth > textWidth && j > 0) {
	        	if(this.ctx.measureText(line).width > textWidth){
	        		labelTexts.push(this.getText(line, textWidth, ctxFont));
	        		line = words[j] + ' ';
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
	    if ((labelTexts[this.m_chart.m_xaxislabellines - 1]) && (this.ctx.measureText(labelTexts[this.m_chart.m_xaxislabellines - 1]).width >= textWidth)) {	       
	        labelTexts[this.m_chart.m_xaxislabellines - 1] = this.getText(labelTexts[this.m_chart.m_xaxislabellines - 1], textWidth, ctxFont);
	    }
	} else {
	    labelTexts.push(text);
	}
	return labelTexts;
}

/** @description Getter for YAxisDivision width**/
GroupBarYAxis.prototype.getYaxisDivison = function () {
	return ((this.m_endY - this.m_startY) / (this.m_yAxisText.length));
};

/** @description Drawing of tick marks**/
GroupBarYAxis.prototype.drawTickMarks = function () {
	var temp = this;
	var tickMakrerHeight = 8;
	if (IsBoolean(this.m_tickmarks)) {
		for (var i = 0; i < this.m_yAxisText.length + 1; i++) {
			/*this.ctx.beginPath();
			this.ctx.save();
			this.ctx.lineWidth = "0.9";
			this.ctx.translate(0.5, 0.5);
			this.ctx.strokeStyle = this.m_categorymarkingcolor;
			this.ctx.moveTo(parseInt(this.m_startX), parseInt(this.m_startY + (this.getYaxisDivison()) * (i)));
			this.ctx.lineTo(parseInt(this.m_startX - tickMakrerHeight * 1), parseInt(this.m_startY + (this.getYaxisDivison()) * (i)));
			this.ctx.stroke();
			this.ctx.restore();
			this.ctx.closePath();*/
			var x1 = parseInt(this.m_startX * 1);
			var y1 = parseInt(this.m_startY + (this.getYaxisDivison()) * (i));
			var x2 = parseInt(this.m_startX - tickMakrerHeight * 1);
			var y2 = parseInt(this.m_startY + (this.getYaxisDivison()) * (i));
			var tick = drawSVGLine(x1, y1, x2, y2, "0.9", temp.m_categorymarkingcolor);
			$("#yaxistickmark" + temp.m_chart.m_objectid).append(tick);
		}
	}
};

/** @description Drawing of Vertical Line**/
GroupBarYAxis.prototype.drawVerticalLine = function () {
	var temp = this;
	var markerArray = this.m_chartCalculation.getXAxisMarkersArray();
	var xAxisDiv = (this.m_endX - this.m_startX) / (markerArray.length - 1);
	for (var i = 0; i < markerArray.length; i++) {
		/*this.ctx.beginPath();
		this.ctx.save();
		this.ctx.lineWidth = "0.5";
		this.ctx.strokeStyle = hex2rgb(this.m_chart.m_markercolor, this.m_chart.m_markertransparency);
		this.ctx.translate(0.5, 0.5); // anti aliasing
		this.ctx.moveTo(parseInt((this.m_startX*1-1*1) + (xAxisDiv * i)), parseInt(this.m_startY));
		this.ctx.lineTo(parseInt((this.m_startX*1-1*1) + (xAxisDiv * i)), parseInt(this.m_endY));
		this.ctx.stroke();
		this.ctx.restore();
		this.ctx.closePath();*/

		var x1 = parseInt((this.m_startX) + (xAxisDiv * i));
		var y1 = parseInt(this.m_startY);
		var x2 = parseInt((this.m_startX) + (xAxisDiv * i));
		var y2 = parseInt(this.m_endY);
		var newLine = this.drawSVGLine(x1, y1, x2, y2, "1", hex2rgb(this.m_chart.m_markercolor, this.m_chart.m_markertransparency));
		$("#verticallinegrp" + temp.m_chart.m_objectid).append(newLine);
	}
};
/** @description Drawing of ZeroMarker Line**/
GroupBarYAxis.prototype.drawZeroMarkerLine = function () {
	var temp = this;
	var markerArray = this.m_chartCalculation.getXAxisMarkersArray();
	var xAxisDiv = (this.m_endX - this.m_startX) / (markerArray.length - 1);
	for (var i = 0; i < markerArray.length; i++) {
		if (markerArray.length > 0 && markerArray[i] == 0) {
			/*this.ctx.beginPath();
			this.ctx.save();
			this.ctx.lineWidth = "0.5";
			this.ctx.strokeStyle = hex2rgb(this.m_chart.m_zeromarkercolor, this.m_chart.m_markertransparency);
			this.ctx.translate(0.5, 0.5); // anti aliasing
			this.ctx.moveTo(parseInt((this.m_startX*1-1*1) + (xAxisDiv * i)), parseInt(this.m_startY));
			this.ctx.lineTo(parseInt((this.m_startX*1-1*1) + (xAxisDiv * i)), parseInt(this.m_endY));
			this.ctx.stroke();
			this.ctx.restore();
			this.ctx.closePath();*/
			var newLine = this.drawSVGLine(parseInt((this.m_startX*1) + (xAxisDiv * i)), parseInt(this.m_startY), parseInt((this.m_startX*1) + (xAxisDiv * i)), parseInt(this.m_endY), "1", hex2rgb(temp.m_chart.m_zeromarkercolor, temp.m_chart.m_markertransparency));
			$("#" + temp.m_chart.svgContainerId).append(newLine);
			break;
		}
	}
};
GroupBarYAxis.prototype.drawSVGLine  = function (x1, y1, x2, y2, lineWidth, fillColor) {
	var newLine = document.createElementNS(NS, "line");
	if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2)) {
		newLine.setAttribute("x1", x1);
		newLine.setAttribute("y1", y1);
		newLine.setAttribute("x2", x2);
		newLine.setAttribute("y2", y2);
		newLine.setAttribute("stroke", fillColor);
		newLine.setAttribute("stroke-width", lineWidth);
	}
	return newLine;
};
/** @description return true if axisMarkerLine Array has negative axis value*/
GroupBarYAxis.prototype.hasNegativeAxisMarker = function (axisMarkerArray) {
	var isNegative = false;
	if (Array.isArray(axisMarkerArray) && axisMarkerArray.length > 0) {
		var value = Math.min.apply(null, axisMarkerArray);
		if (value < 0)
			isNegative = true;
	}
	return isNegative;
};
/** @description Getting Text and text Width if text is greater than the coming text width than wrap text and add ".."**/
GroupBarYAxis.prototype.getText = function (text1, textWidth, ctxFont) {
	var text = text1;
	var newText = "";
	this.ctx.font = ctxFont;

	var strWidth = this.ctx.measureText(text).width;
	if (text.length > 0) {
		var appendedTextWidth = (strWidth / text.length) * 3;
	}
	for (var i = 0; i < text.length; i++) {
		if (this.ctx.measureText(newText).width < (textWidth - appendedTextWidth)) {
			newText += text[i];
		} else {
			newText = newText + "..";
			break;
		}
	}
	return newText;
};
//# sourceURL=GroupBarChart.js
