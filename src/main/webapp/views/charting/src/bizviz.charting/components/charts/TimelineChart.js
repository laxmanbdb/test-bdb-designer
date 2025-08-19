/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: TimelineChart.js
 * @description TimelineChart
 **/
function TimelineChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();

	this.m_x = 680;
	this.m_y = 20;
	this.m_width = 300;
	this.m_height = 260;
	this.m_radius = 2;
	this.m_lineSeries = {};
	this.m_columnSeries = [];
	this.m_colorNames = [];
	this.m_pointSeries = {};
	this.m_valueTextSeries = {};

	this.m_categoryNames = [];
	this.m_seriesNames = [];
	this.m_seriesarr = [];
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_alertData = [];

	this.m_showslider = true;
	this.m_showslidermarker = true;
	this.m_showslidertext = false;
	this.m_sliderhandlerbgcolor = "#ccffff";
	this.m_sliderselectbgcolor = "#cccccc";
	this.m_slidercontainerbgcolor = "#ccffff";
	this.m_slidercontainerbordercolor = "#bbbbbb";
	//this.m_charttype="";
	this.m_sliderbordercolor = "#cccccc";
	this.m_sliderbghandle = "#ffffff";
	this.m_slideropacityhandle = "0.0";
	this.m_sliderbgselection = "#cccccc";
	this.m_slideropacityselection = "0.5";
	this.m_sliderbgcontainer = "#ecf0f1";
	this.m_slideropacitycontainer = "0.0";
	this.m_sliderbgscrollbar = "#b0b0b0";
	this.m_slideropacityscrollbar = "0.7";

	this.m_sourcedateformat = "mm/dd/yyyy";
	this.m_yPositionArray = [];
	//this.m_calculation=new TimeLineCalculation();
	this.m_xAxis = new svgXAxis();
	this.m_yAxis = new svgYAxis();
	this.m_title = new svgTitle(this);
	this.m_subTitle = new svgSubTitle();
	this.m_util = new Util();
	this.noOfRows = 1; //used for set x-axis text into two rows in non tilted case.
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_continuousline=false; //added for plotting continuous line when data is discontinuous

	// for time series project
	this.m_lineCalculation = "";
	this.m_yaxisArr = [];
	this.m_marginXArray = [];
	this.count = 0;
	this.timeLineSliderFlag = false;
	this.svgContainerId = "";
	this.rangedSelectorMargin = 27;
	this.m_luminance = "0.5";
	this.columnGapeMap = {};

	this.m_rangeselectoropacity = "1.0";
	this.m_rangeselectorbgcolor = "#cccddd";
	this.m_rangeselectorfontfamily = "Roboto";
	this.m_showrangeselector = "true";
	this.isSeriesValueWithComma = false;
	this.m_fillarea = false;
	this.m_columntype = "clustered";
	this.m_barsize = 60;
	this.m_fixedrange = "false";
	this.origonalXposition = "";
	this.updateflag=false;
	this.m_sliderheightratio = 7;
	this.m_sliderrangeflag = false;
    this.m_sliderrangevalue = 10;
	this.m_sliderheight = 63;
	this.sliderMargin = 70;
	this.m_topcurvemargin = 26;
	this.m_stackborderwidth = "0.5";
	this.m_stackbordercolor = "#ffffff";
	this.m_enablestackshadow = "false";
	this.m_stackshadowcolor = "#000000";
	this.m_stackshadowopacity = "0.3";
	this.m_stackborderradius = "0";
	/**Added for Data Label Overlap issue*/
	this.m_overlappeddatalabelarrayY = [];
	this.m_overlappeddatalabelarrayX = [];
	/**Added to support when dates are not sorted*/
	this.m_sorteddate = "false";
	this.m_sliderLastIndex = 0;
	this.m_isCurrentDate = false;
	this.m_sliderposition = "default"
	/**Added for animation property*/	
	this.m_enableanimation = "false";
	this.m_stackAnimationDuration = 0.5;
	this.m_lineAnimationDuration = 0.5;
	this.m_bubbleanimationduration = 0.5;
	this.m_hovershape = 2;/**Hover on Point radius can be increase or decrease*/
	this.m_stackhoverstyle = "false"; //Enable style on stack on mouseover
	this.m_stackstripecolor = "#ffffff"; //Stack pattern stripe color
	this.m_stacksvgtype = "rect";
	
	this.m_fixedlegend = "true";
	/**Added to control width/height floating legends*/
	this.m_topFloatingLegendMargin = 30;
	this.m_bottomFloatingLegendMargin = 40;
	this.m_leftFloatingLegendMargin = 100;
	this.m_rightFloatingLegendMargin = 100;
	/**Added for Point radius*/
	this.m_minradius = 2;
	this.m_maxradius = 26;
	this.m_showlinesecondaxis = "true";
	this.m_canvastype = "svg";
	this.m_xaxislabellines = 3;
	// added for controlling uniform bar widths using script
	this.m_controlbarwidth = "auto";
	this.m_drilltoggle = false;
	this.enableDrillHighlighter = "false";
	this.m_slideronmaxmize = false;
	/*Annotation in TimeSeries Chart DAS-972*/
	this.m_showannotation = false;
	this.m_showyannotation = false;
	this.m_showxannotation = false;
	this.m_annotationradius = "3";
	this.m_annotationshape = "point";
	this.m_annotationcolor = "#7F00FF";
	this.m_annotationtextcolor = "#CF9FFF";
	this.m_annotationseriescolor = false;
	this.m_annotationopacity = "1";
	this.m_annotationData = [];
	this.m_annotationXData = [];
	this.m_annotationXData2 = [];
	this.m_annotationNames=[];
	this.m_annotationdatatype = "number";
	this.m_annotationformat = "year";
	this.m_annotationTooltip = "default;"
	this.m_showannotationTooltip = false;
	this.m_annotationtooltiptitle = "Annotation";
	this.m_linetype = false;
	/*Threshold properties DAS_952*/
	this.m_showyaxisthreshold = false;
	this.m_minimumyaxisthreshold = "0";
	this.m_maximumyaxisthreshold = "50";
	this.m_yaxisthresholdlinewidth = "1";
	this.m_yaxisthresholdstrokecolor = "#000000";
	this.m_minimumthresholdstrokecolor = "#00FF00";
	this.m_maximumthresholdstrokecolor = "#FF0000";
	this.m_thresholdlinetype = "straight"; //dot,dash1,dash
	this.m_minimumyaxisthresholdline = true;
	
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

/** @description Making prototype of chart class to inherit its properties and methods into TimeLine chart **/
TimelineChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
TimelineChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas(); //create draggable div
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
TimelineChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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

/***************************************** Setter Methods ******************************************************/

/** @description Iterate Fields JSON and set field according to their fieldType  **/
TimelineChart.prototype.setFields = function (fieldsJson) {
	/*	This will sort the json and set column fields to first and line fields to last.
	To draw lines on top of columns for Better View
	 */
	if (this.m_charttype !== "fanchart") {
		try {
			fieldsJson = getDuplicateArray(fieldsJson);
			sortAscArrayOfJsonByKey(fieldsJson, "ChartType");
		} catch (e) {
			console.log(e);
		}
	}
	this.m_fieldsJson = fieldsJson;
	var categoryJson = [];
	var seriesJson = [];
	var annotationJson = [] ;/*Annotation in Line Chart DAS-972*/
	var arrayLength = fieldsJson.length;
	for (var i = 0; i < arrayLength; i++) {
		var fieldType = this.getProperAttributeNameValue(fieldsJson[i], "Type");
		switch (fieldType) {
			case "Category":
				categoryJson.push(fieldsJson[i]);
				break;
			case "Series":
				seriesJson.push(fieldsJson[i]);
				break;
			case "Annotation":
				annotationJson.push(fieldsJson[i]);
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
	this.setAnnotation(annotationJson);
};

/** @description Setter Method of Category **/
TimelineChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryFieldColor = [];
	this.m_categoryDisplayNames = [];
	this.m_allCategoryNames = [];
	this.m_allCategoryDisplayNames = [];
	this.m_categoryVisibleArr = {};
	var count = 0;
	// only one category can be set for line chart, preference to first one
	var arrayLength = categoryJson.length;
	for (var i = 0; i < arrayLength; i++) {
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

/** @description creating array for each property of fields and storing in arrays **/
TimelineChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = {};
	this.m_seriesOpacity = {};
	this.m_legendNames = [];
	this.m_seriesVisibleArr = {};
	this.m_plotRadiusArray = {};
	this.m_plotRadiusFieldArray = {};
	this.m_isfixedradius = {};
	this.m_plotTrasparencyArray = {};
	this.m_fillTrasparencyArray = {};
	this.m_plotShapeArray = [];
	this.m_allSeriesDisplayNames = [];
	this.m_allSeriesNames = [];
	this.m_seriesDisplayNamesMap = {};
	this.m_seriesDataLabelProperty = {};
	this.m_lineWidthArray = {};
	this.m_lineTypeArray = {};
	this.m_seriesAxisDrill = {};
	this.m_seriesChartTypeDrill = {};
	this.m_fanChartSeriesVisibleArr = {};
	this.m_fillAreaColor=[];
	var count = 0;

	this.legendMap = {};
	this.m_seriesAxis = [];
	this.m_seriesChartType = [];
	this.m_fanSeriesType = {};
	this.m_LegendColors = [];
	this.m_seriesFillAreaMap = {};
	seriesJson = (this.m_charttype === "fanchart") ? this.setFanChartSeriesJson(seriesJson) : seriesJson;
	var arrayLength = seriesJson.length;
	for (var i = 0; i < arrayLength; i++) {
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.m_allSeriesDisplayNames[i] = m_formattedDisplayName;
		this.m_allSeriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		this.m_seriesVisibleArr[this.m_allSeriesNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
		this.m_fanChartSeriesVisibleArr[this.m_allSeriesNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
		if (IsBoolean(this.m_seriesVisibleArr[this.m_allSeriesNames[i]])) {
			this.m_seriesDisplayNames[count] = m_formattedDisplayName;
			this.m_legendNames[count] = m_formattedDisplayName;
			this.m_seriesNames[count] = this.getProperAttributeNameValue(seriesJson[i], "Name");
			this.m_seriesDisplayNamesMap[this.m_seriesNames[count]] = m_formattedDisplayName;
			this.m_seriesColors[this.m_seriesNames[count]] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));
			this.m_LegendColors[count] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));
			/** change the axis to left if second axis is invisible **/
			var axis = this.getProperAttributeNameValue(seriesJson[i], "axis");
			this.m_seriesAxis[count] = (IsBoolean(this.m_secondaryaxisshow)) ? axis : "left" ;
			/**Added to get Axis type on the basis of field name*/
			this.m_seriesAxisDrill[this.m_seriesNames[count]] = (IsBoolean(this.m_secondaryaxisshow)) ? axis : "left" ;
			this.m_seriesChartTypeDrill[this.m_seriesNames[count]] = this.getProperAttributeNameValue(seriesJson[i], "ChartType");
			this.m_seriesChartType[count] = this.getProperAttributeNameValue(seriesJson[i], "ChartType");
			this.m_seriesDataLabelProperty[this.m_seriesNames[count]] = this.getProperAttributeNameValue(seriesJson[i], "DataLabelCustomProperties");
			var fieldFill = (this.getProperAttributeNameValue(seriesJson[i], "enableFillArea") == undefined ? 
					IsBoolean(this.m_fillarea) : 
						this.getProperAttributeNameValue(seriesJson[i], "enableFillArea")); 
			this.m_seriesFillAreaMap[this.m_seriesNames[count]] = fieldFill ;
			this.m_fillAreaColor[this.m_seriesNames[count]] = this.getProperAttributeNameValue(seriesJson[i], "FillAreaColor");
			if (this.m_charttype === "fanchart") {
				/** For fanchart, series chartType should be 'line' always*/
				this.m_seriesChartTypeDrill[this.m_seriesNames[count]] = "line";
				this.m_seriesChartType[count] = "line";
				this.m_fanSeriesType[this.m_seriesNames[count]] = this.getProperAttributeNameValue(seriesJson[i], "FanSeriesType");
			}
			if (this.m_seriesDataLabelProperty[this.m_seriesNames[count]] !== undefined) {
			    if (IsBoolean(this.m_seriesDataLabelProperty[this.m_seriesNames[count]].useFieldColor)) {
			        this.m_seriesDataLabelProperty[this.m_seriesNames[count]].dataLabelFontColor = this.m_seriesColors[this.m_seriesNames[count]];
			    }
			    if ((this.m_seriesDataLabelProperty[this.m_seriesNames[count]].showPercentValue !== undefined) && IsBoolean(this.m_seriesDataLabelProperty[this.m_seriesNames[count]].showPercentValue) && (this.m_columntype=="100%")) {
                    this.m_seriesDataLabelProperty[this.m_seriesNames[count]].datalabelField = this.m_seriesNames[count];
                }
			    if(IsBoolean(this.m_seriesDataLabelProperty[this.m_seriesNames[count]].dataLabelUseComponentFormater)){
			    	if(this.m_seriesAxis[count]=="left"){
			    		this.m_seriesDataLabelProperty[this.m_seriesNames[count]].datalabelFormaterCurrency = this.m_unit;
				    	this.m_seriesDataLabelProperty[this.m_seriesNames[count]].datalabelFormaterPrecision = this.m_precision;
				    	this.m_seriesDataLabelProperty[this.m_seriesNames[count]].datalabelFormaterPosition = this.m_signposition;
				    	this.m_seriesDataLabelProperty[this.m_seriesNames[count]].datalabelFormaterUnit = this.m_secondaryunit;
			    	}else{
			    		this.m_seriesDataLabelProperty[this.m_seriesNames[count]].datalabelFormaterCurrency = this.m_secondaryaxisunit;
				    	this.m_seriesDataLabelProperty[this.m_seriesNames[count]].datalabelFormaterPrecision = this.m_secondaryaxisprecision;
				    	this.m_seriesDataLabelProperty[this.m_seriesNames[count]].datalabelFormaterPosition = this.m_secondaryaxissignposition;
				    	this.m_seriesDataLabelProperty[this.m_seriesNames[count]].datalabelFormaterUnit = this.m_secondaryaxissecondaryunit;
			    	}
			    }
			} else {
			    this.m_seriesDataLabelProperty[this.m_seriesNames[count]] = this.getDataLabelProperties();
			}
			this.m_isfixedradius[this.m_seriesNames[count]] = this.getProperAttributeNameValue(seriesJson[i], "isFixedRadius");
			if((this.m_isfixedradius[this.m_seriesNames[count]] === undefined) || IsBoolean(this.m_isfixedradius[this.m_seriesNames[count]])){
				this.m_isfixedradius[this.m_seriesNames[count]] = (this.m_isfixedradius[this.m_seriesNames[count]] === undefined) ? "true" : this.m_isfixedradius[this.m_seriesNames[count]];
				var radius = this.getProperAttributeNameValue(seriesJson[i], "PlotRadius");
				this.m_plotRadiusArray[this.m_seriesNames[count]] = (radius != undefined && radius !== null && radius !== "") ? radius : 3;
			}else{
				this.m_plotRadiusFieldArray[this.m_seriesNames[count]] = this.getProperAttributeNameValue(seriesJson[i], "RadiusField");
			}
			var lineWidth = this.getProperAttributeNameValue(seriesJson[i],"LineWidth");
			this.m_lineWidthArray[this.m_seriesNames[count]] = (lineWidth != undefined && lineWidth !== null && lineWidth !== "") ? lineWidth : 2 ;
			var lineType = this.getProperAttributeNameValue(seriesJson[i],"LineType");
			this.m_lineTypeArray[this.m_seriesNames[count]] = (lineType != undefined && lineType !== null && lineType !== "") ? lineType : "simple" ;
			var transparency = this.getProperAttributeNameValue(seriesJson[i], "PlotTransparency");
			this.m_plotTrasparencyArray[this.m_seriesNames[count]] = (transparency != undefined && transparency !== null && transparency !== "") ? transparency : 1;
			var fillTransparency = this.getProperAttributeNameValue(seriesJson[i], "FillTransparency");
			this.m_fillTrasparencyArray[this.m_seriesNames[count]] = (fillTransparency != undefined && fillTransparency !== null && fillTransparency !== "") ? fillTransparency : 0.6;
			
			var shape = this.getProperAttributeNameValue(seriesJson[i], "PlotType");
			this.m_plotShapeArray[count] = (shape != undefined && shape !== null && shape !== "") ? shape : "point";
			
			var opacity = this.getProperAttributeNameValue(seriesJson[i], "Opacity");
			this.m_seriesOpacity[this.m_seriesNames[count]] = (opacity != undefined && opacity !== null && opacity !== "") ? opacity : 1;
			
			var tempMap = {
				"seriesName" : this.m_seriesNames[count],
				"displayName" : this.m_seriesDisplayNames[count],
				"color" : this.m_seriesColors[this.m_seriesNames[count]],
				"shape" : this.m_plotShapeArray[count],
				"axisType" : this.m_seriesAxis[count],
				"index": count
			};
			this.legendMap[this.m_seriesNames[count]] = tempMap;
			count++;
		}
	}
	this.setLegendsIntialLoad(this.m_defaultlegendfields);
};
/** @description setter Method of Annotation **/
TimelineChart.prototype.setAnnotation = function(categoryJson) {
	var temp = this;
	temp.m_annotationNames = { text: [], category: [] };
	temp.m_annotationDisplayNames = { text: [], category: [] };
	temp.m_allAnnotationNames = { text: [], category: [] };
	temp.m_allAnnotationDisplayNames = { text: [], category: [] };
	temp.m_annotationVisibleArr = { text: {}, category: {} };
	var count = { text: 0, category: 0 };
	if (IsBoolean(this.m_designMode)) {
		for (var i = 0, length = categoryJson.length; i < length; i++) {
			/** text annotation */
			if (temp.getProperAttributeNameValue(categoryJson[i], "SeriesType") === "text") {
				var seriesName = temp.getProperAttributeNameValue(categoryJson[i], "Name");
				var formattedDisplayName = temp.formattedDescription(this, temp.getProperAttributeNameValue(categoryJson[i], "DisplayName"));

				temp.m_allAnnotationNames.text[i] = seriesName;
				temp.m_allAnnotationDisplayNames.text[i] = formattedDisplayName;
				temp.m_annotationVisibleArr.text[formattedDisplayName] = temp.getProperAttributeNameValue(categoryJson[i], "visible");

				if (IsBoolean(temp.m_annotationVisibleArr.text[formattedDisplayName])) {
					temp.m_annotationNames.text[count.text] = seriesName;
					temp.m_annotationDisplayNames.text[count.text] = formattedDisplayName;
					count.series++;
				}
			}
			/** category annotation */
			if (temp.getProperAttributeNameValue(categoryJson[i], "SeriesType") === "category") {
				var categoryName = temp.getProperAttributeNameValue(categoryJson[i], "Name");
				var formattedDisplayName = temp.formattedDescription(this, temp.getProperAttributeNameValue(categoryJson[i], "DisplayName"));

				temp.m_allAnnotationNames.category[i] = categoryName;
				temp.m_allAnnotationDisplayNames.category[i] = formattedDisplayName;
				temp.m_annotationVisibleArr.category[formattedDisplayName] = temp.getProperAttributeNameValue(categoryJson[i], "visible");

				if (IsBoolean(temp.m_annotationVisibleArr.category[formattedDisplayName])) {
					temp.m_annotationNames.category[count.category] = categoryName;
					temp.m_annotationDisplayNames.category[count.category] = formattedDisplayName;
					count.category++;
				}
			}
		}
	} else {
		/**get annotation data from annotation mapping popup connection saved data */
		var mappedData = temp.chartJson.Chart.Annotation;
		/*label setting*/
		/**DAS-1076 */
		if(mappedData != undefined){
		var seriesName = mappedData.DataLabel;
		var formattedDisplayName = mappedData.DataLabel;
		temp.m_allAnnotationNames.text[0] = seriesName;
		temp.m_allAnnotationDisplayNames.text[0] = formattedDisplayName;
		temp.m_annotationVisibleArr.text[formattedDisplayName] = true;
		if (IsBoolean(temp.m_annotationVisibleArr.text[formattedDisplayName])) {
			temp.m_annotationNames.text[count.text] = seriesName;
			temp.m_annotationDisplayNames.text[count.text] = formattedDisplayName;
			count.series++;
		}
		/*Annotation vlue setting*/
		var categoryName = mappedData.DataValue;
		var formattedDisplayName = mappedData.DataValue
		temp.m_allAnnotationNames.category[0] = categoryName;
		temp.m_allAnnotationDisplayNames.category[0] = formattedDisplayName;
		temp.m_annotationVisibleArr.category[formattedDisplayName] = true;
	
		if (IsBoolean(temp.m_annotationVisibleArr.category[formattedDisplayName])) {
			temp.m_annotationNames.category[count.category] = categoryName;
			temp.m_annotationDisplayNames.category[count.category] = formattedDisplayName;
			count.category++;
		}
		}
	}
};
/** @description getter Method of LegendInfo **/
TimelineChart.prototype.getLegendInfo = function () {
	return this.legendMap;
};

/** @description Setter Method of Series Colors **/
TimelineChart.prototype.setSeriesColor = function (m_seriesColor) {
	this.m_seriesColor = m_seriesColor;
};

/** @description Setter Method of LegendNames **/
TimelineChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};

/** @description Will arrange the series data according to fanchart calculation **/
TimelineChart.prototype.setFanChartSeriesJson = function (fieldsJson) {
	var min = [], result = [], fan = [], max = [], none = [];
	for (var i = 0; i < fieldsJson.length; i++) {
		if (fieldsJson[i].FanSeriesType) {
			switch (fieldsJson[i].FanSeriesType) {
				case "min":
					min.push(fieldsJson[i]);
					break;
				case "result":
					result.push(fieldsJson[i]);
					break;
				case "fan":
					fan.push(fieldsJson[i]);
					break;
				case "max":
					max.push(fieldsJson[i]);
					break;
				case "none":
					none.push(fieldsJson[i]);
					break;
				default :
			}
		}
	}
	fieldsJson.splice(0,fieldsJson.length);
	(min.length > 0) ? fieldsJson.push(min[0]) : ""; // insert min type series
	for (var j = 0; j < fan.length; j++) {  // insert fan type series
		fieldsJson.push(fan[j]);
	}
	(max.length > 0) ? fieldsJson.push(max[0]) : "";  // insert max type series
	(result.length > 0) ? fieldsJson.push(result[0]) : ""; // insert result type series
	for (var j = 0; j < none.length; j++) {  // insert none type series
		fieldsJson.push(none[j]);
	}
	
	return fieldsJson;
};
/** @description Setter Method of Category/Series Data **/
TimelineChart.prototype.setCategorySeriesData = function() {
    this.m_categoryData = [];
    this.m_seriesData = [];
    /**Added to create series for Data Label*/
    this.m_seriesDataLabel = [];
    this.m_seriesDataForToolTip = [];
    this.m_displaySeriesDataFlag = [];
    /**Added for dynamic Point Radius*/
    this.m_plotradiusarray = {};

    if (this.m_charttype == "timeseries") {
        var uniqueCategories = [];
        var uniqueCategoriesArr = [];
        for (var i = 0, length = this.getCategoryNames().length; i < length; i++) {
            uniqueCategories[i] = {};
            uniqueCategoriesArr[i] = [];
            var field = this.getCategoryNames()[i];
            for (var k = 0, j = 0, len = this.getDataProvider().length; k < len; k++) {
                var record = this.getDataProvider()[k];
                data = record[field];
                if (!uniqueCategories[i][data]) {
                    uniqueCategories[i][data] = [];
                    uniqueCategoriesArr[i][j++] = [];
                }
                uniqueCategories[i][data].push(record);
                uniqueCategoriesArr[i][j - 1].push(record);
            }
        }
        this.isEmptyCategory = true;
        for (var k = 0, len = uniqueCategoriesArr.length; k < len; k++) {
            this.m_categoryData[k] = [];
            for (var l = 0, outerLength = uniqueCategoriesArr[k].length; l < outerLength; l++) {
                var records = uniqueCategoriesArr[k][l];
                var record = records[0];
                this.isEmptyCategory = false;
                var data = "";
                var field = this.getCategoryNames()[k];
                if (record[field] != undefined && record[field] != "undefined") {
                    data = record[field];
                    data = (this.m_charttype == "timeseries") ? this.getFormattedDate(data) : data;
                }
                this.m_categoryData[k][l] = data;


                this.m_displaySeriesDataFlag[l] = [];
                for (var j = 0, innerLength = this.getSeriesNames().length; j < innerLength; j++) {
                    if (!this.m_seriesData[j]) {
                        this.m_seriesData[j] = [];
                        this.m_seriesDataLabel[j] = [];
                        this.m_seriesDataForToolTip[j] = [];
                        this.m_plotradiusarray[this.getSeriesNames()[j]] = [];
                    }
                    var data = "";
                    var datalabel = "";
                    var plotRadius = "";
                    var field = this.getSeriesNames()[j];
                    if (record[field] != undefined && record[field] != "undefined")
                        data = record[field];
                    if (this.m_seriesDataLabelProperty[field].datalabelField !== '') {
                        datalabel = record[this.m_seriesDataLabelProperty[field].datalabelField];
                    } else {
                        datalabel = data;
                    }
                    if(!IsBoolean(this.m_isfixedradius[field])){
                    	plotRadius = record[this.m_plotRadiusFieldArray[field]];
                        if (isNaN(plotRadius)) {
                        	plotRadius = getNumericComparableValue(plotRadius);
                        }
                        this.m_plotradiusarray[this.getSeriesNames()[j]][l] = plotRadius;
                    }else{
                    	this.m_plotradiusarray[this.getSeriesNames()[j]][l] = this.m_plotRadiusArray[this.getSeriesNames()[j]];
                    }
                    this.m_displaySeriesDataFlag[l][j] = true;
                    if (isNaN(data)) {
                        this.m_displaySeriesDataFlag[l][j] = false;
                        data = getNumericComparableValue(data);
                    }
                    
                    this.m_seriesData[j][l] = data;
                    this.m_seriesDataLabel[j][l] = datalabel;
                    this.m_seriesDataForToolTip[j][l] = data;
                }
            }
        }
    } else {
        for (var k = 0, len = this.getDataProvider().length; k < len; k++) {
            var record = this.getDataProvider()[k];
            this.isEmptyCategory = true;
            if (this.getCategoryNames().length > 0) {
                this.isEmptyCategory = false;
                for (var i = 0, innerLength = this.getCategoryNames().length; i < innerLength; i++) {
                    if (!this.m_categoryData[i]) {
                        this.m_categoryData[i] = [];
                    }
                    var data = "";
                    var datalabel = "";
                    var field = this.getCategoryNames()[i];
                    if (record[field] != undefined && record[field] != "undefined") {
                        data = record[field];
                        data = (this.m_charttype == "timeseries") ? this.getFormattedDate(data) : data;
                    }
                    this.m_categoryData[i][k] = data;
                }
            }

            this.m_displaySeriesDataFlag[k] = [];
            for (var j = 0, length = this.getSeriesNames().length; j < length; j++) {
                if (!this.m_seriesData[j]) {
                    this.m_seriesData[j] = [];
                    this.m_seriesDataLabel[j] = [];
                    this.m_seriesDataForToolTip[j] = [];
                    this.m_plotradiusarray[this.getSeriesNames()[j]] = [];
                }
                var data = "";
                var field = this.getSeriesNames()[j];
                if (record[field] != undefined && record[field] != "undefined")
                    data = record[field];
                if (this.m_seriesDataLabelProperty[field].datalabelField !== '') {
                    datalabel = record[this.m_seriesDataLabelProperty[field].datalabelField];
                } else {
                    datalabel = data;
                }
                if(!IsBoolean(this.m_isfixedradius[field])){
                	plotRadius = record[this.m_plotRadiusFieldArray[field]];
                    if (isNaN(plotRadius)) {
                    	plotRadius = getNumericComparableValue(plotRadius);
                    }
                    this.m_plotradiusarray[this.getSeriesNames()[j]][k] = plotRadius;
                }else{
                	this.m_plotradiusarray[this.getSeriesNames()[j]][k] = this.m_plotRadiusArray[this.getSeriesNames()[j]];
                }
                this.m_displaySeriesDataFlag[k][j] = true;
                if (isNaN(data)) {
                    this.m_displaySeriesDataFlag[k][j] = false;
                    data = getNumericComparableValue(data);
                }
                this.m_seriesData[j][k] = data;
                this.m_seriesDataLabel[j][k] = datalabel;
                this.m_seriesDataForToolTip[j][k] = data;
            }
        }
    }
    this.CatData = this.m_categoryData;
    this.SerData = this.m_seriesData;
    this.SerDataLabel = this.m_seriesDataLabel;
    this.PlotRadius = this.m_plotradiusarray;
    /**Added to support when dates are not sorted*/
    if (IsBoolean(this.m_sorteddate)) {
        var DatesSortedArray = this.getDatesSortedArray(this.CatData);
        var CatDataArray = [];
        var SerDataArray = [];
        var SerDataLabelArray = [];
        this.m_seriesdatamap = {};
        for (var k = 0, catDataLength = this.CatData[0].length; k < catDataLength; k++) {
            CatDataArray[k] = this.CatData[0][DatesSortedArray[k]];
        }
        this.CatData[0] = CatDataArray;
        for (var l = 0, serDataLength = this.SerData.length; l < serDataLength; l++) {
            SerDataArray[l] = [];
            SerDataLabelArray[l] = [];
            for (var m = 0, innerSerDataLength = this.SerData[l].length; m < innerSerDataLength; m++) {
                SerDataArray[l][m] = this.SerData[l][DatesSortedArray[m]];
                SerDataLabelArray[l][m] = this.SerDataLabel[l][DatesSortedArray[m]];
            }
            this.SerData[l] = SerDataArray[l];
            this.SerDataLabel[l] = SerDataLabelArray[l];
            /**Added to resolve indicator color issue*/
            this.m_seriesdatamap[this.m_seriesNames[l]] = this.SerData[l];
        }
        this.m_categoryData = this.CatData;
        this.m_seriesData = this.SerData;
        this.m_seriesDataLabel = this.SerDataLabel;

    }      
    	/**get data for annotation from dataset */
		this.m_annotationData = [];
	if (IsBoolean(this.m_designMode)) {
		if (this.m_annotationNames['text'].length > 0) {
			var annotationdata = this.m_annotationNames['text'];
			var text = this.getDataFromJSON(this.m_annotationNames['text'][0]);
			for (var i = 0; i < text.length; i++) {
				this.m_annotationData.push({ type: 'event', label: text[i], point:0 , property: { color: 'red', radius: 10 } });
			}
		}
		if (this.m_annotationNames['category'].length > 0) {
			this.m_annotationXData = [];
			/**get annotation start data */
			if (this.m_annotationNames['category'][0] != undefined) {
				var annotationXdata = this.getDataFromJSON(this.m_annotationNames['category'][0]);
				for (var i = 0; i < annotationXdata.length; i++) {
					if (annotationXdata[i] != 'null' || annotationXdata[i] != '' || annotationXdata[i] != null)
						this.m_annotationXData.push({ type: 'event', label: this.m_annotationData[i].label, point: annotationXdata[i], property: { color: 'red', radius: 10 } });
				}
			}
			this.m_annotationXData2 = [];
			/**get annotation start data */
			if (this.m_annotationNames['category'][1] != undefined) {
				var annotationXdata = this.getDataFromJSON(this.m_annotationNames['category'][1]);
				for (var i = 0; i < annotationXdata.length; i++) {
					if (annotationXdata[i] != 'null' || annotationXdata[i] != '' || annotationXdata[i] != null)
						this.m_annotationXData2.push({ type: 'event', label: this.m_annotationData[i], point: annotationXdata[i], property: { color: 'red', radius: 10 } });
				}
			}
		}
	}else{
		var mappedData = this.chartJson.Chart.Annotation;
		/**DAS-1076 */
		var DataSourceId = (mappedData != undefined)?mappedData.DataSourceId:"";
		var alldata = [];
		if (DataSourceId != "") {
			var dataP = sdk.getConnection(DataSourceId);
			alldata = dataP.m_wholeData;//has all values in connectionr
		}
		if (this.m_annotationNames['text'].length > 0) {
			var annotationdata = this.m_annotationNames['text'];
			if (alldata && alldata.length > 0) {
				var text = alldata.map(item => {
					if (item[annotationdata] === null || item[annotationdata] === undefined || item[annotationdata] === "null") {
						return "No label";
					} else {
						return item[annotationdata];
					}
				});
				for (var i = 0; i < text.length; i++) {
					this.m_annotationData.push({ type: 'event', label: text[i], point: annotationdata[i], property: { color: 'red', radius: 10 } });
				}
			}
		}
		if (this.m_annotationNames['category'].length > 0) {
			this.m_annotationXData = [];
			/**get annotation start data */
			if (this.m_annotationNames['category'][0] != undefined) {
				if (alldata && alldata.length > 0 && this.m_annotationNames['category'][0] != '' ) {
					var annotationXdata = alldata.map(item => item[this.m_annotationNames['category'][0]]);
					for (var i = 0; i < annotationXdata.length; i++) {
						if (annotationXdata[i] != 'null' || annotationXdata[i] != '' || annotationXdata[i] != null)
							this.m_annotationXData.push({ type: 'event', label: this.m_annotationData[i].label, point: annotationXdata[i], property: { color: 'red', radius: 10 } });
					}
				}
			}
			this.m_annotationXData2 = [];
			/**get annotation start data */
			if (this.m_annotationNames['category'][1] != undefined) {
				var annotationXdata = alldata.map(item => item[this.m_annotationNames['category'][1]]);
				for (var i = 0; i < annotationXdata.length; i++) {
					if (annotationXdata[i] != 'null' || annotationXdata[i] != '' || annotationXdata[i] != null)
						this.m_annotationXData2.push({ type: 'event', label: this.m_annotationData[i], point: annotationXdata[i], property: { color: 'red', radius: 10 } });
				}
			}
		}
	}
};
TimelineChart.prototype.getDatesSortedArray = function (catData){
	var DatesSortedArray = [];
	var MonthSorted = "";
	var DateSorted = "";
	var YearSorted = "";
	var DatesSortedArrayIndexValue = [];
	for (var j = 0, length = catData[0].length; j < length; j++) {
	    if (catData[j] != "")
	        DatesSortedArray.push(new Date(catData[0][j]));
	}
	DatesSortedArray = DatesSortedArray.sort(function(date1, date2) {
	    if (date1 > date2) return 1;
	    if (date1 < date2) return -1;
	    return 0;
	});
	for (var k = 0, len = DatesSortedArray.length; k < len; k++) {
	    MonthSorted = DatesSortedArray[k].getMonth() + 1;
	    if(MonthSorted<10){
	    	MonthSorted = "0"+MonthSorted;
	    }
	    DateSorted = DatesSortedArray[k].getDate();
	    if(DateSorted<10){
	    	DateSorted = "0"+DateSorted;
	    }
	    YearSorted = DatesSortedArray[k].getFullYear();
	    DatesSortedArray[k] = MonthSorted+"/" + DateSorted+"/" + YearSorted;
	    }
	for (var l = 0, length = DatesSortedArray.length; l < length; l++) {
		DatesSortedArrayIndexValue[l]  = catData[0].indexOf(DatesSortedArray[l]);
	}
	return DatesSortedArrayIndexValue;
};
//TimelineChart.prototype.setCategoryData = function () {
//	this.m_categoryData = [];
//	this.isEmptyCategory = true;
//	for (var i = 0; i < this.getCategoryNames().length; i++) {
//		this.isEmptyCategory = false;
//		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
//	}
//	if (this.m_charttype == "timeseries" && this.m_categoryData.length > 0)
//		this.m_categoryData = this.setDateFormatForCategory(this.m_categoryData);
//	this.CatData = this.m_categoryData;
//};
//
//TimelineChart.prototype.setDateFormatForCategory = function (categoryData) {
//	var tempData = [];
//	for (var i = 0; i < categoryData[0].length; i++) {
//		if (categoryData[0][i] != "" && categoryData[0][i] != undefined)
//			tempData.push(this.getFormattedDate(categoryData[0][i]));
//	}
//	categoryData[0] = tempData;
//	return categoryData;
//};
//
//TimelineChart.prototype.setSeriesData = function () {
//	this.m_seriesData = [];
//	for (var i = 0; i < this.getSeriesNames().length; i++) {
//		this.m_seriesData[i] = getCommaSeparateSeriesData(this.getDataFromJSON(this.getSeriesNames()[i]));
//	}
//	this.SerData = this.m_seriesData;
//};

/** @description Getter for All Series names**/
TimelineChart.prototype.getAllSeriesNames = function () {
	return this.m_allSeriesNames;
};

/** @description Getter for All Category names**/
TimelineChart.prototype.getAllCategoryNames = function () {
	return this.m_allCategoryNames;
};

/** @description Setter Method of AllFieldsName **/
TimelineChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0, len = this.getAllCategoryNames().length; i < len; i++) {
		this.m_allfieldsName.push(this.getAllCategoryNames()[i]);
	}
	for (var j = 0, length = this.getAllSeriesNames().length; j < length; j++) {
		this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
	}
};

/** @description Setter Method of set visible series Name **/
TimelineChart.prototype.setVisibleSeriesName = function () {
	this.m_visibleSeriesName = [];
	for (var j = 0, length = this.getAllSeriesNames().length; j < length; j++) {
		/**Added m_fanChartSeriesVisibleArr[] condition for resolve associate legend and visible series false problem in fanchart */
		if (IsBoolean(this.m_seriesVisibleArr[this.m_allSeriesNames[j]]) && this.m_fanChartSeriesVisibleArr[this.m_allSeriesNames[j]]) {
			this.m_visibleSeriesName.push(this.getAllSeriesNames()[j]);
		}
	}
};
/** @description Setter Method of AllFieldsDisplayName **/
TimelineChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0, len = this.getCategoryDisplayNames().length; i < len; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0, length = this.getSeriesDisplayNames().length; j < length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};
/** @description Setter method for svg stack type rect/path update **/
TimelineChart.prototype.setStackSVGTypeForSeries = function () {
	this.m_seriesSVGStackTypeArray = [];
	var seriesLength = this.m_seriesData.length;
	var isLastColumnField = true;
	for (var i = seriesLength-1; i >= 0; i--) {
		if(this.m_seriesChartType[i] == "column" && isLastColumnField){
			this.m_seriesSVGStackTypeArray[this.m_seriesNames[i]] = "path";
			isLastColumnField= false;
		}else{
			this.m_seriesSVGStackTypeArray[this.m_seriesNames[i]] = "rect";
		}
	}
};

/** @description Setter Method of SeriesColor according to drill/categoryColor/conditionalColor **/
TimelineChart.prototype.setColorsForSeries = function () {
	this.m_seriesColorsArray = {};
	this.m_PointsColorsArray = {};
	if (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) {
		var seriesLength = this.m_seriesData.length;
		for (var i = 0; i < seriesLength; i++) {
			this.m_seriesColorsArray[this.m_seriesNames[i]] = [];
			this.m_PointsColorsArray[this.m_seriesNames[i]] = [];
			var seriesDataLength = this.m_seriesData[i].length;
			for (var j = 0; j < seriesDataLength; j++) {
				this.m_seriesColorsArray[this.m_seriesNames[i]][j] = this.m_drillColor;
				this.m_PointsColorsArray[this.m_seriesNames[i]][j] = this.m_drillColor;
			}
		}
	} else if ( !IsBoolean(this.m_designMode) && this.getCategoryColors().getCategoryColor().length > 0 && this.getConditionalColors()["m_ConditionalColor"] != "" && this.getConditionalColors()["m_ConditionalColor"] != undefined && this.getConditionalColors()["m_ConditionalColor"].length > 0) {
		var seriesColors = this.getSeriesColors();
		var seriesLength = this.m_seriesData.length;
		/**DAS-733  */
/*		var conditionalColors = this.m_conditionalcolorswithslider;
*/		for (var i = 0; i < seriesLength; i++) {
		var categoryColors = this.getCategoryColors().getCategoryColorsForCategoryNames(this.getCategoryData()[0], this.m_categoryFieldColor);
			this.m_seriesColorsArray[this.m_seriesNames[i]] = [];
			this.m_PointsColorsArray[this.m_seriesNames[i]] = [];
			var seriesDataLength = this.m_seriesData[i].length;
			for (var j = 0; j < seriesDataLength; j++) {
				this.m_seriesColorsArray[this.m_seriesNames[i]][j] = seriesColors[this.m_seriesNames[i]];
				this.m_PointsColorsArray[this.m_seriesNames[i]][j] = categoryColors[j];
			}
		}
	} else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && this.getCategoryColors().getCategoryColor().length > 0 && IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName())) {
		var seriesColors = this.getSeriesColors();
		var categoryColors = this.getCategoryColors().getCategoryColorsForCategoryNames(this.getCategoryData()[0], this.m_categoryFieldColor);
		var seriesLength = this.m_seriesData.length;
		for (var i = 0; i < seriesLength; i++) {
			this.m_seriesColorsArray[this.m_seriesNames[i]] = [];
			this.m_PointsColorsArray[this.m_seriesNames[i]] = [];
			var seriesDataLength = this.m_seriesData[i].length;
			for (var j = 0; j < seriesDataLength; j++) {
				this.m_seriesColorsArray[this.m_seriesNames[i]][j] = seriesColors[this.m_seriesNames[i]];
				this.m_PointsColorsArray[this.m_seriesNames[i]][j] = categoryColors[j];
			}
		}
	} else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && (!IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName()) || this.getCategoryColors().getCategoryColor().length == 0) && this.getConditionalColors() != "" && this.getConditionalColors() != undefined && this.getConditionalColors().getConditionalColor().length > 0) {
		/**Added for reducing the calculation of conditional color calculation repetition and for slider color mismatch issue*/
		var conditionalColors = this.m_conditionalcolorswithslider;
		var seriesColors = this.getSeriesColors();
		var seriesLength = this.m_seriesData.length;
		for (var i = 0; i < seriesLength; i++) {
			this.m_seriesColorsArray[this.m_seriesNames[i]] = [];
			this.m_PointsColorsArray[this.m_seriesNames[i]] = [];
			var seriesDataLength = this.m_seriesData[i].length;
			for (var j = 0; j < seriesDataLength; j++) {
				this.m_seriesColorsArray[this.m_seriesNames[i]][j] = seriesColors[this.m_seriesNames[i]];
				this.m_PointsColorsArray[this.m_seriesNames[i]][j] = conditionalColors[this.m_seriesNames[i]][j];
			}
		}
	} else {
		var seriesColors = this.getSeriesColors();
		var seriesLength = this.m_seriesData.length;
		for (var i = 0; i < seriesLength; i++) {
			this.m_seriesColorsArray[this.m_seriesNames[i]] = [];
			this.m_PointsColorsArray[this.m_seriesNames[i]] = [];
			var seriesDataLength = this.m_seriesData[i].length;
			for (var j = 0; j < seriesDataLength; j++) {
				this.m_seriesColorsArray[this.m_seriesNames[i]][j] = seriesColors[this.m_seriesNames[i]];
				this.m_PointsColorsArray[this.m_seriesNames[i]][j] = seriesColors[this.m_seriesNames[i]];
			}
		}
	}
};

/***************************************** Getter Methods ******************************************************/

/** @description Getter Method of DataProvider **/
TimelineChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description Getter Method of CategoryNames **/
TimelineChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};

/** @description Getter Method of CategoryDisplayNames **/
TimelineChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

/** @description Getter Method of SeriesNames **/
TimelineChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};
/** @description Getter Method of SeriesDisplayNames **/
TimelineChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};
/** @description Getter Method of LegendColors **/
TimelineChart.prototype.getLegendColors = function () {
	return this.m_LegendColors;
};
/** @description Getter for Category Colors**/
TimelineChart.prototype.getCategoryColorsForAction = function () {
	return this.m_categoryFieldColor;
};
/** @description Getter for Series Colors**/
TimelineChart.prototype.getSeriesColorsForAction = function () {
	return this.m_LegendColors;
};
/** @description Getter Method of LegendTableContent **/
TimelineChart.prototype.getLegendTableContent = function () {
	var legendTable = "";
	for (var i = 0, length = this.getLegendNames().length; i < length; i++) {
		var shape = this.legendMap[this.getSeriesNames()[i]].shape;
		var orgShape = this.getHTMLShape(shape);
		legendTable += "<tr style=\"font-style:" + this.m_legendfontstyle + ";color:" + convertColorToHex(this.m_legendfontcolor) + ";text-decoration:" + this.m_legendtextdecoration + ";font-weight:" + this.m_legendfontweight + ";font-family:" + selectGlobalFont(this.m_legendfontfamily) + "\">"+
							"<td>"+this.drawLegendShape(orgShape,this.getLegendColors()[i])+"<span style=\"display:inline;\">" + this.getLegendNames()[i] +"</span></td></tr>";
	}
	return legendTable;
};

/** @description Getter Method of SeriesColor **/
TimelineChart.prototype.getSeriesColors = function () {
	return this.m_seriesColors;
};

/** @description Getter Method of LegendNames **/
TimelineChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};

/** @description getter Method for get DataFromJSON according to fieldName **/
TimelineChart.prototype.getDataFromJSON = function (fieldName) {
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

/** @description Getter Method of SeriesColor **/
TimelineChart.prototype.getSeriesFillAreaMap = function () {
	return this.m_seriesFillAreaMap;
};

/** @description Getter Method of CategoryData **/
TimelineChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

/** @description Getter Method of SeriesData **/
TimelineChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

/** @description Getter Method of AllFieldsName **/
TimelineChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

/** @description Getter Method of AllFieldsDisplayName **/
TimelineChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

/** @description Getter Method of ColorsForSeries **/
TimelineChart.prototype.getColorsForSeries = function () {
	return this.m_seriesColorsArray;
};

/**********************************************************************************************************/

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
TimelineChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description  Will create DraggableDiv and DraggableCanvas and initialize mouse event for component .**/
TimelineChart.prototype.initializeDraggableDivAndCanvas = function () {
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

/** @description createSVG Method used for create SVG element for Chart and Scale **/
TimelineChart.prototype.createSVG = function () {
	var temp = this;
	this.svgContainerId = "svgContainer" + temp.m_objectid;
	$("#" + temp.svgContainerId).remove();
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("xlink", "http://www.w3.org/1999/xlink");
	svg.setAttribute("width", this.m_width);
	
	/**For fanchart slider should not be visible whether property set true or false*/
	if (this.m_charttype === "fanchart") {
		this.m_showslider = false;
		this.m_columntype = "stacked";
	}
	var height = 0;
	this.m_sliderheight = this.m_height/4;
	var marginForFloatingLegends = (IsBoolean(this.getShowLegends()) && !IsBoolean(this.m_fixedlegend) &&(this.m_legendposition == "horizontalBottomLeft" || this.m_legendposition == "horizontalBottomCenter" || this.m_legendposition == "horizontalBottomRight")) ? (40 * this.minWHRatio()): 0;
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
	
	svg.setAttribute("height", this.m_height);
	svg.setAttribute("id", this.svgContainerId);
	svg.setAttribute("class", "svg_chart_container");

	$("#draggableDiv" + temp.m_objectid).append(svg);
	/*******************************this.m_chart.getBgGradients(),this.m_chart.m_bgalpha, this.m_chart.m_bggradientrotation*/
	if (IsBoolean(this.m_showslider) && (IsBoolean(this.m_isDataSetavailable)|| IsBoolean(this.m_designMode))) {
		if (IsBoolean(!this.timeLineSliderFlag)) {
			$("#svgTimeScaleDiv" + temp.m_objectid).remove();
			var div = document.createElement("div");
			div.setAttribute("id", "svgTimeScaleDiv" + temp.m_objectid);
			div.style.position = "absolute";
			div.style.zIndex = temp.m_zIndex + 1;
			div.style.top = this.m_height - this.sliderMargin + "px";
			$("#draggableDiv" + temp.m_objectid).append(div);
			$("#svgTimeScaleDiv" + temp.m_objectid).css("top", this.m_height - this.sliderMargin - marginForFloatingLegends - 1 + "px");
			/*******************************/
			this.svgTimeScaleId = "svgTimeScale" + temp.m_objectid;
			$("#" + temp.svgTimeScaleId).remove();
			var svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg1.setAttribute("xlink", "http://www.w3.org/1999/xlink");
			svg1.setAttribute("width", this.m_width);
			svg1.setAttribute("height", this.m_sliderheight);
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

/***************************************** Initialize Methods ******************************************************/
/** @description initialization of Timeline Chart **/
TimelineChart.prototype.init = function () {
	this.createSVG();
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
	this.setVisibleSeriesName();
	this.setColorsForSeries();
	this.isSeriesDataEmpty();
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);

	if ((!IsBoolean(this.m_isEmptySeries)) && (IsBoolean(this.isVisibleSeries())) && (!IsBoolean(this.isEmptyCategory))) {
		this.registerDataInMap();
		this.registerDateInMapForSeriesIndex();
		this.updateDataforHundred(this.seriesDataMap);
		this.calculateMinMax();
		this.initializeCalculationClass();
		this.initializeYAxis();
		this.instanciateSeries(this.seriesDataMap);
	}
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};

/** @description create a Map and registered all fields data into map according to their ChartType and Axis **/
TimelineChart.prototype.registerDataInMap = function() {
    this.seriesDataMap = {};
    this.seriesDataLabelMap = {};
    var ObjMap = {
        "left": {
            "column": {},
            "line": {}

        },
        "right": {
            "column": {},
            "line": {}

        }
    };
    this.seriesDataMap = $.extend(true,{},ObjMap);
    this.seriesDataLabelMap = $.extend(true,{},ObjMap);
    var seriesLength = this.m_seriesNames.length;
    for (var i = 0; i < seriesLength; i++) {
        if (this.m_seriesVisibleArr[this.m_seriesNames[i]]) {
            this.seriesDataMap[this.m_seriesAxis[i]][this.m_seriesChartType[i]][this.m_seriesNames[i]] = this.m_seriesData[i];
            this.seriesDataLabelMap[this.m_seriesAxis[i]][this.m_seriesChartType[i]][this.m_seriesNames[i]] = this.m_seriesDataLabel[i];
        }
    }
    //console.log(this.seriesDataMap);
};

TimelineChart.prototype.registerDateInMapForSeriesIndex = function () {
	this.seriesDataMapForIndex = {};
	this.seriesIndexMap = {};
	var m = 0;
	this.seriesDataMapForIndex = {
		"line" : {
			"left" : {},
			"right" : {}

		},
		"column" : {
			"left" : {},
			"right" : {}

		}
	};
	this.seriesIndexMap = {
			"left" : {
				"column" : {},
				"line" : {}

			},
			"right" : {
				"column" : {},
				"line" : {}

			}
		};
	var seriesLength = this.m_seriesNames.length;
	for (var i = 0; i < seriesLength; i++) {
		if (this.m_seriesVisibleArr[this.m_seriesNames[i]]){
			this.seriesDataMapForIndex[this.m_seriesChartType[i]][this.m_seriesAxis[i]][this.m_seriesNames[i]] = this.m_seriesData[i];
			this.seriesIndexMap[this.m_seriesAxis[i]][this.m_seriesChartType[i]][this.m_seriesNames[i]] = {
					"seriesIndex": m++
				};		
			}
	}
	//console.log(this.seriesDataMap);
};

// Added code for handle 100% Column Chart.
/** @description method will update data for 100% chart. **/
TimelineChart.prototype.updateDataforHundred = function (originalDataMap) {
	this.changedDataMap = getDuplicateObject( originalDataMap );
	/**Added this variable for data label*/
	this.m_actualseriesdatamap = getDuplicateObject( originalDataMap );
	if(this.m_columntype=="100%"){
		this.changedDataMap.left.column=(!$.isEmptyObject(this.changedDataMap.left.column))?this.getUpdatedData(this.changedDataMap.left.column):this.changedDataMap.left.column;
		this.changedDataMap.right.column=(!$.isEmptyObject(this.changedDataMap.right.column))?this.getUpdatedData(this.changedDataMap.right.column):this.changedDataMap.right.column;
	}
};

/** @description method will provide the updated data. **/
TimelineChart.prototype.getUpdatedData = function (columnMap) {
	var keyArr=[];
	var dataArr=[];
	for(var key in columnMap){
		if(key != "unique" && key!= "contains"){
			keyArr.push(key);
			dataArr.push(columnMap[key]);
		}
	}
	// update Data for 100% similar to column charts.
	var arr = this.getUpdateSeriesDataWithCategory(dataArr);
	var data = this.arrengeDataforHundred(arr,dataArr);
	var newArr=[];
	for(var i=0;i < keyArr.length; i++){
		newArr[keyArr[i]]=data[i];
	}
	return newArr;
};
/** @description method will arrenge Data forHundred. **/
TimelineChart.prototype.arrengeDataforHundred = function (array,actualArray) {
	var serData = array;
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
	
	if (updateValue.length > 0) {
		this.m_SeriesDataInPerForHundredChart = this.getUpdateSeriesDataForHundredPercentageChart(updateValue,actualArray);
		return this.m_SeriesDataInPerForHundredChart;
	}
	//console.log(this.m_SeriesDataInPerForHundredChart);
};

/** @description method will return the sum of array elements. **/
TimelineChart.prototype.getArraySUM = function (arr) {
	var sum = 0;
	for (var i = 0, length = arr.length; i < length; i++) {
		if (arr[i] < 0)
			arr[i] = arr[i] * (-1);
		if (!isNaN(arr[i]))
			sum = sum * 1 + arr[i] * 1;
	}
	return sum;
};

/** @description method will return Updated SeriesData. **/
TimelineChart.prototype.getUpdateSeriesDataWithCategory = function (arr) {
	var updateArray = [];
	for (var i = 0, length = arr[0].length; i < length; i++) {
		updateArray[i] = [];
		for (var j = 0, innerlength = arr.length; j < innerlength; j++) {
			updateArray[i][j] = arr[j][i];
		}
	}
	return updateArray;
};

/** @description method will return Updated SeriesData For HundredPercentageChart . **/
TimelineChart.prototype.getUpdateSeriesDataForHundredPercentageChart = function (arr,actualArray) {
	var updatArray = [];
	for (var i = 0, length = arr[0].length; i < length; i++) {
		updatArray[i] = [];
		for (var j = 0, innerlength = arr.length; j < innerlength; j++) {
			updatArray[i][j] = arr[j][i];
		}
	}

	for (var i = 0, length = actualArray.length; i < length; i++) {
		for (var j = 0, innerlength = actualArray[i].length; j < innerlength; j++) {
			if (!isNaN(actualArray[i][j])) {
				if (actualArray[i][j] * 1 < 0)
					updatArray[i][j] = updatArray[i][j] * (-1);
			}
		}
	}
	return updatArray;
};
/* ------X-----  */

/** @description calculate Minimum and Maximum for both left and right Axis **/
TimelineChart.prototype.calculateMinMax = function () {
	/** Added for enable common marker for repeater chart */
	var seriesDataObj = (IsBoolean(this.m_isRepeaterPart) && IsBoolean(this.m_parentObj.m_repeatercommonmarker)) ? this.getAllSeriesDataForRepeater() : this.seriesDataMap;
	var leftAxisData = this.getAxisData(seriesDataObj["left"]);
	var rightAxisData = this.getAxisData(seriesDataObj["right"]);
	this.leftAxisInfo = this.getAxisInfo("left", leftAxisData);
	this.rightAxisInfo = this.getAxisInfo("right", rightAxisData);
	this.manageLeftRightMarker(this.leftAxisInfo, this.rightAxisInfo);
};
/** @description calculate scale chart Minimum and Maximum for both left and right Axis **/
TimelineChart.prototype.calculateAxisMinMax = function () {
	if (IsBoolean(this.scaleFlag)) {
		this.manageLeftRightMarker(this.leftAxisInfo, this.rightAxisInfo);
	}
};
/** @description store leftAxis and rightAxis info corresponding class var this.leftAxisInfo and this.rightAxisInf **/
TimelineChart.prototype.manageLeftRightMarker = function (leftAxisInfo, rightAxisInfo) {
	if (leftAxisInfo.markerarray.length > 1 && rightAxisInfo.markerarray.length > 1 && (leftAxisInfo.markerarray.length !== rightAxisInfo.markerarray.length) && IsBoolean(this.m_showmarkerline)) {
		/**CP-919-updated the conditions for reducing additional markers **/
		if (leftAxisInfo.markerarray.length > rightAxisInfo.markerarray.length) {
			var numberofticks = leftAxisInfo.markerarray.length;
			var range = ((rightAxisInfo.max - rightAxisInfo.min)/(numberofticks-1))+'';//.toFixed(1);Math.ceil(range*1)
			range = (range.split('.')[1] !== undefined && range.split('.')[1].length > 3) ? (range*1).toFixed(1) : range*1;
			rightAxisInfo.markerarray = [];
			var val = rightAxisInfo.min;
			var prec = ( range + "").split(".");
		    if (prec[1] !== undefined) {
		    	prec = prec[1].length;
		    } else {
		    	prec = 0;
		    }
			for (var i = 0; i < numberofticks; i++) {
				rightAxisInfo.markerarray.push(val);
		        val = val * 1 + (range * 1);
		        if (val && val.toString().indexOf("e") > -1) {
		            var valA = val.toString().split("e");
		            val = (valA[0] * 1).toFixed(prec) + "e" + valA[1];
		        }else{
		            val = (val * 1).toFixed(prec);
		        }
			}
			
			/*var diff = leftAxisInfo.markerarray.length - rightAxisInfo.markerarray.length;
			for (var i = 0; i < diff; i++) {
				rightAxisInfo.markerarray.push(rightAxisInfo.max + rightAxisInfo.markertext);
				rightAxisInfo.max = rightAxisInfo.max + rightAxisInfo.markertext;
			}*/
			this.rightAxisInfo = rightAxisInfo;
		} else {
			var numberofticks = rightAxisInfo.markerarray.length;
			var range = ((leftAxisInfo.max - leftAxisInfo.min)/(numberofticks-1))+'';//.toFixed('1');Math.ceil
			range = (range.split('.')[1] !== undefined && range.split('.')[1].length > 3) ? (range*1).toFixed(1) : range*1;
			leftAxisInfo.markerarray = [];
			var val = leftAxisInfo.min;
			var prec = ( range + "").split(".");
		    if (prec[1] !== undefined) {
		    	prec = prec[1].length;
		    } else {
		    	prec = 0;
		    }
			for (var i = 0; i < numberofticks; i++) {
				leftAxisInfo.markerarray.push(val);
		        val = val * 1 + (range * 1);
		        if (val && val.toString().indexOf("e") > -1) {
		            var valA = val.toString().split("e");
		            val = (valA[0] * 1).toFixed(prec) + "e" + valA[1];
		        }else{
		            val = (val * 1).toFixed(prec);
		        }
			}
		
			/*var diff = rightAxisInfo.markerarray.length - leftAxisInfo.markerarray.length;
			for (var i = 0; i < diff; i++) {
				leftAxisInfo.markerarray.push(leftAxisInfo.max + leftAxisInfo.markertext);
				leftAxisInfo.max = leftAxisInfo.max + leftAxisInfo.markertext;
			}*/
			this.leftAxisInfo = leftAxisInfo;
		}
	}
	return;
};

/** @description method return data of AllSeries , LineSeries and ColumnSeries for any Axis **/
TimelineChart.prototype.getAxisData = function (map) {
	var lineArr = [];
	var columnArr = [];
	var allData = [];
	var FanChartLineArr = {
			"line":[],
			"stacked" : []
		};
	for (var key in map) {
		for (var key1 in map[key]) {
			if (key1 != "unique" && key1 != "contains") {
				allData.push(map[key][key1]);
				if (key == "line") {
					if (this.m_charttype === "fanchart") {
						if (this.m_fanSeriesType[key1] == "fan" || this.m_fanSeriesType[key1] == "min") {
							FanChartLineArr["stacked"].push(map[key][key1])
						} else {
							FanChartLineArr["line"].push(map[key][key1])
						}
					} else {
						lineArr.push(map[key][key1]);
					}
				}
				if (key == "column")
					columnArr.push(map[key][key1]);
			}
		}
	}
	return {
		all : allData,
		line : (this.m_charttype === "fanchart") ? FanChartLineArr: lineArr,
		column : columnArr
	};
};

/** @description this method provides the All(min, max, noofmarker, markertext, markerarray) information for any Axis **/
TimelineChart.prototype.getAxisInfo = function (axis, axisData) {
	if( axisData.all.length>0){
		var scaleHeight = IsBoolean(this.m_showslider) ? (this.m_height - this.m_sliderheight) : this.m_height;
		var basezero = (axis == "left") ? this.m_basezero : this.m_secondaxisbasezero;
		var autoaxissetup = (axis == "left") ? this.m_autoaxissetup : this.m_secondaxisautosetup;
		var minimumaxisvalue = (axis == "left") ? this.m_minimumaxisvalue : this.m_secondaxisminimumvalue;
		var maximumaxisvalue = (axis == "left") ? this.m_maximumaxisvalue : this.m_secondaxismaximumvalue;
		if (this.m_charttype === "fanchart" && axisData.line["stacked"].length > 0) {
			var tempminmaxstack= this.calculateStackMinMaxValue(axisData.line["stacked"]);
			var tempminmaxline = (axisData.line["line"].length > 0) ? this.calculateMinMaxValue(axisData.line["line"]) : {
				min : "",
				max : ""
			};
			
			if (tempminmaxline.min !== ""){
				var tempmin = (tempminmaxline.min < tempminmaxstack.min) ? tempminmaxline.min : tempminmaxstack.min;
			}else{
				var tempmin = tempminmaxstack.min;
			}
	
			if (tempminmaxline.max !== ""){
				var tempmax = (tempminmaxline.max > tempminmaxstack.max) ? tempminmaxline.max : tempminmaxstack.max;
			}else{
				var tempmax = tempminmaxstack.max;
			}
			var minMax = {
				min : tempmin,
				max : tempmax
			};
		} else {
			if ((this.m_columntype == "stacked" ||this.m_columntype=="100%") && axisData.column.length > 0) {
				var tempminmaxline = (axisData.line.length > 0) ? this.calculateMinMaxValue(axisData.line) : {
					min : "",
					max : ""
				};
				if((this.m_columntype == "stacked") && (axisData.column.length === 1)) {
					var tempminmaxcolumn = this.calculateMinMaxValue(axisData.column);
				} 	else {
					var tempminmaxcolumn = this.calculateStackMinMaxValue(axisData.column);
				}
				if (tempminmaxline.min !== "")
					var tempmin = (tempminmaxline.min < tempminmaxcolumn.min) ? tempminmaxline.min : tempminmaxcolumn.min;
				else
					var tempmin = tempminmaxcolumn.min;
	
				if (tempminmaxline.max !== "")
					var tempmax = (tempminmaxline.max > tempminmaxcolumn.max) ? tempminmaxline.max : tempminmaxcolumn.max;
				else
					var tempmax = tempminmaxcolumn.max;
	
				var minMax = {
					min : tempmin,
					max : tempmax
				};
			} else {
				var minMax = this.calculateMinMaxValue(axisData.all);
			}
		}

		var calculatedMin = minMax.min;
		var calculatedMax = minMax.max;
		var obj=this.getCalculateNiceScale(calculatedMin, calculatedMax, basezero, autoaxissetup, minimumaxisvalue, maximumaxisvalue, scaleHeight, axis);

		return {
			max : obj.max,
			min : obj.min,
			noofmarker : obj.markerArray.length,
			markertext : obj.step,
			markerarray : obj.markerArray
		};
	} else{
		return {
			max : "",
			min : "",
			noofmarker :  "",
			markertext :  "",
			markerarray :  ""
		};
	}
};

/** @Description Will return all series data for repeater chart **/
TimelineChart.prototype.getAllSeriesDataForRepeater = function() {
    var ObjMap = {
        "left": {
            "column": {},
            "line": {}
        },
        "right": {
            "column": {},
            "line": {}
        }
    };
    var seriesLength = this.m_parentObj.m_seriesNames.length;
    for (var i = 0; i < seriesLength; i++) {
        if (this.m_parentObj.m_seriesVisibleArr[this.m_parentObj.m_seriesNames[i]]) {
            var seriesDataArray = [];
            for (var j = 0; j < this.m_parentObj.m_dataProvider.length; j++) {
                seriesDataArray[j] = removeCommaFromSrting(this.m_parentObj.m_dataProvider[j][this.m_parentObj.m_seriesNames[i]]);
            }
            ObjMap[this.m_parentObj.m_seriesAxis[i]][this.m_parentObj.m_seriesChartType[i]][this.m_parentObj.m_seriesNames[i]] = seriesDataArray;
        }
    }
    return ObjMap
};

/** @description this method provides the All (Axis, Chart, Data) info for Any Series **/
TimelineChart.prototype.getSeriesInfo = function (seriesName) {
	var map = this.seriesDataMap;
	for (var axis in map) {
		for (var chart in map[axis]) {
			for (var series in map[axis][chart]) {
				if (seriesName == series)
					return {
						axis : axis,
						chart : chart,
						data : map[axis][chart][series]
					};
			}
		}
	}
};

/** @description calculate the min/max for stack and 100% chart **/
TimelineChart.prototype.calculateStackMinMaxValue = function (dataArr) {
	var calculateMax = (isNaN(dataArr[0][0]*1)) ? 0 : dataArr[0][0]*1;
	var calculateMin = (isNaN(dataArr[0][0]*1)) ? 0 : dataArr[0][0]*1;
	var data = [];
	var dataLength=dataArr[0].length;
	if (this.m_columntype == "stacked" ){
		for (var i = 0, k = 0; i < dataLength; i++) // number of rectangles
		{
			var height = 0;
			var negHeight = 0;
			var stackLength=dataArr.length;
			for (var j = 0; j < stackLength; j++) // number of stacks in one rectangle
			{
				data[k++] = (dataArr[j][i] * 1);
				if( !isNaN(dataArr[j][i] * 1) ){
					if (dataArr[j][i] * 1 > 0)
						height = (height) * 1 + (dataArr[j][i] * 1) * 1;
					else
						negHeight = (dataArr[j][i] * 1) * 1 + (negHeight) * 1;
				}
			}
			if ((height) >= (calculateMax))
				calculateMax = height * 1;
			if ((negHeight * 1) < (calculateMin))
				calculateMin = negHeight * 1;
		}
	}
	
	if (this.m_columntype == "100%" ) {
		var negFlag = false;
		for (var i = 0, length = dataArr.length; i < length; i++) {
			for (var j = 0, innerlength = dataArr[i].length; j < innerlength; j++) {
				if (dataArr[i][j] < 0) {
					negFlag = true;
					break;
				}
			}
		}
		calculateMax = 100;
		calculateMin = (IsBoolean(negFlag)) ? -100 : 0;
	}
	return {
		min : calculateMin,
		max : calculateMax
	};
};


/** @description instanciate and initialize all series **/
TimelineChart.prototype.instanciateSeries = function (map) {
	var columncount = 0;
	var dataActual = {};
	this.m_columnSeries = {};
	this.m_lineSeries = {};
	var MarkerArray = [];
	for (var key in map) {
		for (var key2 in map[key]) {
			for (var key1 in map[key][key2]) {
				if (map[key][key2].hasOwnProperty(key1) && key1 != "unique" && key1 != "contains") {
					if (key2 == "column") {
						columncount++;
						this.m_columnSeries[key1] = new TimeLineColumns();
						this.m_columnSeries[key1].init(this.m_PointsColorsArray[key1], this.m_lineCalculation.getXPositionArray(key1), this.m_lineCalculation.getYPositionArray(key1), this.m_lineCalculation.getHeightArray(key1), (this.m_lineCalculation.columnWidthMap[key1] / this.m_lineCalculation.totalColumn), this, this.m_plotTrasparencyArray[key1],this.m_lineCalculation.seriesDataMap[key][key2][key1],this.m_showdatalabel,this.m_seriesOpacity[key1]);
					} else {
						this.m_lineSeries[key1] = new SVGLineSeries();
						this.m_lineSeries[key1].init(this.getColorsForSeries()[key1], this.m_lineCalculation.getXPositionArray(key1), this.m_lineCalculation.getYPositionArray(key1), this.m_linewidth, this, 1, key1, this.m_lineWidthArray[key1], this.m_lineTypeArray[key1], this.m_fillTrasparencyArray[key1]); //sending default plotTrasparencyArray 1 for line
						if (this.getShowPoint() || (this.m_lineCalculation.xAxisData.length == 1)) {
							this.m_pointSeries[key1] = new SVGPointSeries();
							this.m_pointSeries[key1].init(this.m_PointsColorsArray[key1], this.getPlotRadiusArray(key1), this.m_lineCalculation.getXPositionArray(key1), this.m_lineCalculation.getYPositionArray(key1), this, this.m_plotTrasparencyArray[key1]);
						}
					}
					if (IsBoolean(this.m_seriesDataLabelProperty[key1].showDataLabel)) {
						if (this.m_columntype == "100%") {
						    if ((this.m_seriesDataLabelProperty[key1].showPercentValue !== undefined) && IsBoolean(this.m_seriesDataLabelProperty[key1].showPercentValue)) {
						        this.seriesDataLabelMap[key][key2][key1] = this.m_lineCalculation.seriesDataMap[key][key2][key1];
						    }
						    /**Added for BDD-681, in this datalabel won't draw if stack won't draw and its actual value wouldn't be zero.*/
						    dataActual = this.m_actualseriesdatamap[key][key2][key1];
						} else {
						    dataActual = this.m_lineCalculation.seriesDataMap[key][key2][key1];
						}
						MarkerArray = ((key === "left") ? this.m_lineCalculation.leftAxisInfo.markerarray : this.m_lineCalculation.rightAxisInfo.markerarray); 
						var max = Math.max.apply(null, MarkerArray);
					    this.m_valueTextSeries[key1] = new SVGValueTextSeries();
					    this.m_valueTextSeries[key1].init(this.m_lineCalculation.getXPositionArray(key1), this.m_lineCalculation.getYPositionArray(key1), this, this.seriesDataLabelMap[key][key2][key1],this.m_seriesDataLabelProperty[key1],dataActual,(this.m_lineCalculation.columnWidthMap[key1] / this.m_lineCalculation.totalColumn), this.m_lineCalculation.getHeightArray(key1),key2,max);
					}
				}
			}
		}
	}
};

/**Added for Point Radius*/
TimelineChart.prototype.getPlotRadiusArray = function(key){
	if(!IsBoolean(this.m_isfixedradius[key])) {
		var ratio = "";
		var radius1 = "";
			var arr = this.m_plotradiusarray[key];
			/**Added for comma separated data*/
			for(var j = 0; j < arr.length; j++){
				arr[j] = getNumericComparableValue(arr[j]);
			}
			this.radius = [];
			var max = this.getMaxFromArray(arr);
			var min = this.getMinFromArray(arr);
			if (this.m_plotradiusarray[key] != parseInt(this.m_plotradiusarray[key], 10)) {
				for (var j = 0; j < arr.length; j++) {
					/** Array index should be taken as "j" not the "i" **/
					if (min >= 0 && arr[j] !== "" && arr[j] !== undefined && arr[j] !== null && arr[j] !== "Nil" && arr[j] !== "null") {
						var ratio = (max) / arr[j];
						var radius1 = ((this.m_maxradius - this.m_minradius)) / ratio;
						this.radius[j] = this.m_minradius * 1 + radius1 * 1;
	                    ratio = (max) / arr[j];
	                    radius1 = ((this.m_maxradius - this.m_minradius)) / ratio;
	                    this.radius[j] = this.m_minradius * 1 + radius1 * 1;

	                    if (this.radius[j] * 1 > this.m_maxradius * 1) {
	                        this.radius[j] = this.m_maxradius;
	                    }
	                    /**Added for the negative value calculation*/
	                } else if (min < 0 && arr[j] !== "" && arr[j] !== undefined && arr[j] !== null && arr[j] !== "Nil" && arr[j] !== "null") {
	                    ratio = (this.m_maxradius - this.m_minradius) / (max * 1 - min * 1);
	                    if (ratio == Infinity) {
	                        radius1 = this.m_maxradius;
	                    } else {
	                        radius1 = this.m_minradius + (arr[j] * 1 - min * 1) * ratio;
	                    }
	                    this.radius[j] = this.m_minradius * 1 + radius1 * 1;
	                    if (this.radius[j] * 1 > this.m_maxradius * 1) {
	                        this.radius[j] = this.m_maxradius;
	                    }

	                } else {
	                    this.radius[j] = 0;
	                }
	            }
	        } else {
	            for (var j = 0; j < arr.length; j++) {
	                this.radius[j] = (arr[j] * 1 > this.m_maxradius * 1) ? this.m_maxradius : arr[j];
	            }
	        }
			this.m_plotradiusarray[key] = this.radius;
		return this.radius;
	}else{
		return this.m_plotradiusarray[key];
	}
};
/**Added for getting maximum value from array*/
TimelineChart.prototype.getMaxFromArray = function (arr) {
	var max = 0;
	for (var i = 0, length = arr.length; i < length; i++) {
		if (arr[i] !== "" && arr[i] !== undefined && arr[i] !== null && arr[i] !== "Nil" && arr[i] !== "null")
			if (max * 1 <= arr[i] * 1)
				max = arr[i] * 1;
	}
	return max;
};
/**Added for getting minimum value from array*/
TimelineChart.prototype.getMinFromArray = function (arr) {
	var min = 0;
	for (i = 0, length = arr.length; i < length; i++) {
		if (arr[i] !== "" && arr[i] !== undefined && arr[i] !== null && arr[i] !== "Nil" && arr[i] !== "null")
			if (min * 1 >= arr[i] * 1)
				min = arr[i] * 1;
	}
	return min;
};

/** @description instanciate and initialize Calculation Class **/
TimelineChart.prototype.initializeCalculationClass = function () {
	this.m_lineCalculation = new TimeLineCalculation();
	if(IsBoolean(!this.timeLineSliderFlag)) {
		this.setChartDrawingArea();
		if(IsBoolean(this.m_xAxis.m_xaxistextwrap) && !IsBoolean(this.scaleFlag)) {
			this.setTextWrapHeight();
		}
	}
	this.m_lineCalculation.init(this, this.m_seriesData, 0, this.m_categoryData, this.changedDataMap);
	this.setThresholdFillColors();
};
/** @description method will update startY if textwrap is set to true **/
TimelineChart.prototype.setTextWrapHeight = function () {
	var xaxisLabels = this.m_categoryData[0];
	var stepValue = 1;
	if(this.m_xAxis.m_xaxismarkers == "auto") {
		if (!IsBoolean(this.m_fixedrange) || IsBoolean(this.m_designMode)) {
			if (xaxisLabels.length > 10)
				stepValue = Math.ceil(xaxisLabels.length / 10);
		}
	}
	var xAxisMarkersArray = [];
	var noOfMarker = xaxisLabels.length;
	for (var i = 0; i < noOfMarker; ) {
		xAxisMarkersArray.push(xaxisLabels[i]);
		i = ((i * 1) + stepValue);
	}
	
	
	// add label font properties using ctx font to set space according to label font size
	this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
	var textWidth = this.ctx.measureText(xAxisMarkersArray[0]).width;
	var dataLength = xAxisMarkersArray.length;
	for (var j = 0; j < dataLength; j++) {
	    if (this.ctx.measureText(xAxisMarkersArray[j]).width > textWidth)
	        textWidth = this.ctx.measureText(xAxisMarkersArray[j]).width;
	}
	var widthOfEachMarker = ((this.m_endX - this.m_startX) / xAxisMarkersArray.length);
	var labelsMargin = 0;
	if (textWidth > widthOfEachMarker) {
	    for (var k = 0; k < this.m_xaxislabellines; k++) {
	        if (textWidth > widthOfEachMarker * k) {
	        	labelsMargin += this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.5;
	        }
	    }
	    this.m_startY = this.m_startY - (labelsMargin - this.getXAxisLabelMargin());
	}
};
/** @description Setter Method of MinMaxSlider Index  **/
TimelineChart.prototype.setMinMaxSliderIndex = function () {
	this.minSliderIndex=this.m_lineCalculation.minSliderIndex;
	this.maxSliderIndex=this.m_lineCalculation.maxSliderIndex;
};

/** @description Getter Method of MinSlider Index  **/
TimelineChart.prototype.getMinSliderIndex = function () {
	return this.minSliderIndex;
};

/** @description Setter Method of MaxSlider Index  **/
TimelineChart.prototype.getMaxSliderIndex = function () {
	return this.maxSliderIndex;
};

/** @description initialize Yaxis for TimeSeries Chart  **/
TimelineChart.prototype.initializeYAxis = function () {
	this.m_yAxis.init(this, this.m_lineCalculation);
	this.m_xAxis.init(this, this.m_lineCalculation);
};

/** @description overrite drawObject Method  because of ChartFrame and Titles are drawn on SVG  **/
TimelineChart.prototype.drawObject = function () {
	this.drawSVGObject();
	if (IsBoolean(!this.timeLineSliderFlag)){
		this.getBGGradientColorToScale();
	}
};

/** @description overrite draw Method  because of we need to initialize timeLineSliderFlag variable  **/
TimelineChart.prototype.draw = function () {
	this.timeLineSliderFlag = false;
	Chart.prototype.draw.call(this);
	/*
	this.init();
	this.drawChart();
	if (this.plugin != undefined && this.plugin != null) {
		this.plugin.initPlugin(this);
	}*/
};

/** @description Drawing of chart started by drawing different parts of chart like ChartFrame,Title,SubTitle **/
TimelineChart.prototype.drawChart = function () {
	this.drawChartFrame();
	if (IsBoolean(!this.timeLineSliderFlag)){
		this.getBGGradientColorToScale();
		this.drawLegends();
	}
		
	var temp = this;
	this.drawTitle();
	this.drawSubTitle();
	var map = this.IsDrawingPossible();
	if (IsBoolean(map.permission)) {
		if ((new Date(this.CatData[0][0]) == "Invalid Date") && this.m_charttype == "timeseries") {
			this.drawSVGMessage("Please Change Date Format ..");
			return;
		}else{
			this.drawYAxis();
			this.drawXAxis();
			this.drawTimeSeries();
			if (IsBoolean(this.m_showannotation)) {
				/**check story annotation from data file */
			if(this.m_annotationXData.length>0 || this.m_annotationxdata.length>0){
				if(this.m_annotationxdata.length>0){
				this.m_annotationXData = this.m_annotationxdata;	
				}
				this.drawAnnotationChart();	
			}else {
					this.drawSVGMessage(this.m_status.noAnnotationValue);
				}
			}
			this.drawDataLabel();
			this.drawThreshold();
			this.initMouseClickEventForSVG(this.svgContainerId);
			if (IsBoolean(!this.timeLineSliderFlag)) {
//				this.drawLegends();
				if(IsBoolean(this.m_showslider) && this.m_charttype !== "fanchart"){
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
					if (!this.m_designMode && (this.m_charttype == "timeseries" || !IsBoolean(this.m_fixedrange))){
						this.timeLineSliderFlag = true;
					/*	this.updatechart(this.getStartX(),((this.getStartX()*1)+((this.getEndX()-this.getStartX())*3/10)));*/
						var width = this.getEndX()-this.getStartX();
						var slectedWidth = (temp.m_sliderwidthperc != undefined) ? (temp.m_sliderwidthperc * width):((this.m_sliderrange == "auto") ? width * 3 / 10 : (this.m_sliderrange * 1) * width / 100);
					/** To update slider position left/right side or according to current Date index*/
					/*  this.updatechart(this.getStartX(),((this.getStartX()*1) + slectedWidth));*/
						if(IsBoolean(!temp.m_slideronmaxmize) || this.m_sliderleftperc == undefined){
							if (this.m_sliderposition == "left") {
								this.updatechart(this.getStartX(), ((this.getStartX()*1) + slectedWidth));
							} else if (this.m_sliderposition == "right") {
							    this.updatechart((this.getStartX() * 1) + (width - slectedWidth), this.getEndX() * 1);
							} else {
								if (IsBoolean(this.m_isCurrentDate) && this.currentDateIndex < this.lastIndex) {
								    var templeft = (this.currentDateIndex == 0) ? this.tempLeft : (this.getStartX() * 1) + this.tempLeft - 0.01;
								    this.updatechart(templeft, (templeft + slectedWidth));
								} else {
									this.updatechart((this.getStartX() * 1) + (width - slectedWidth), this.getEndX() * 1);
								}
							}
						}else{
							var startvalue = (this.getStartX() * 1) + (temp.m_sliderleftperc * width);
							this.updatechart(startvalue, startvalue + slectedWidth);
						}
					}
				}
			}
			if ( IsBoolean(this.m_showslider) && !IsBoolean(this.m_designMode) && IsBoolean(!this.timeLineSliderFlag)&& IsBoolean(this.m_fixedrange) && this.m_charttype != "timeseries") {
				this.timeLineSliderFlag = true;
				var ranges = this.getPosibleRange(this.m_categoryData[0]);
				var minindex = ranges.minindex;
				var maxindex = ranges.maxindex;
				this.updateFixedRange(minindex, maxindex);
				this.hideHandler();
			}
		}
	}else {
		this.drawSVGMessage(map.message);
	}
	if(IsBoolean(this.m_fixedlegend) || (this.m_legendposition !== "horizontalBottomLeft" && this.m_legendposition !== "horizontalBottomCenter" && this.m_legendposition !== "horizontalBottomRight")) {
		$("#legendIcon" + temp.m_objectid).css("z-index", "" + (temp.m_zIndex * 1 + 2));
		$("#legendContent" + temp.m_objectid).css("z-index", "" + (temp.m_zIndex * 1 + 2));
	}
};
/** @description overidding legend Drawing of chart for fluid legends  **/
TimelineChart.prototype.drawChartLegends = function() {
	var temp = this;
	if (IsBoolean(this.getShowLegends())) {
	    if (IsBoolean(this.m_fixedlegend)) {
	        this.drawLegendIcon();
	        if (!IsBoolean(this.m_designMode)) {
	            this.drawLegendContentDiv();
	        } else {
	            $("#legendContent" + temp.m_objectid).remove();
	        }
	    } else {
	    	$("#legendIcon" + temp.m_objectid).remove();
	        this.drawFloatedLegends();
	    }
	} else {
	    $("#legendIcon" + temp.m_objectid).remove();
	    $("#legendContent" + temp.m_objectid).remove();
	}
};
/** @description will draw legends of chart based on top/middle/bottom positions  **/
TimelineChart.prototype.drawFloatedLegends = function() {
	var temp = this;
	if(this.m_legendposition == "horizontalTopLeft" || this.m_legendposition == "horizontalTopCenter" || this.m_legendposition == "horizontalTopRight" || this.m_legendposition == "horizontalBottomLeft" || this.m_legendposition == "horizontalBottomCenter" || this.m_legendposition == "horizontalBottomRight") {
		this.drawHorizontalFloatedLegends();
	} else {
		this.drawVerticalFloatedLegends();
	}
};
/** @description will draw legends background color when it is aligned horizontal bottom  **/
TimelineChart.prototype.drawBackgroundForLegend = function() {
	var temp = this;
	if (IsBoolean(this.getShowLegends()) && !IsBoolean(this.m_fixedlegend) && (this.m_legendposition == "horizontalBottomLeft" || this.m_legendposition == "horizontalBottomCenter" || this.m_legendposition == "horizontalBottomRight")) {
		var marginForFloatingLegends = (IsBoolean(this.getShowLegends()) && !IsBoolean(this.m_fixedlegend) &&(this.m_legendposition == "horizontalBottomLeft" || this.m_legendposition == "horizontalBottomCenter" || this.m_legendposition == "horizontalBottomRight")) ? (40 * this.minWHRatio()): 0;
		$("#svgBottomLegendsDiv" + temp.m_objectid).remove();
		
		var div = document.createElement("div");
		div.setAttribute("id", "svgBottomLegendsDiv" + temp.m_objectid);
		div.style.zIndex = "inherit";
		div.style.position = "absolute";
		div.style.opacity = "0";
		div.style.top = this.m_height - marginForFloatingLegends - ((IsBoolean(this.m_showslider) && (IsBoolean(this.m_isDataSetavailable)|| IsBoolean(this.m_designMode))) ? this.sliderMargin : 0) + "px";
		$("#draggableDiv" + temp.m_objectid).append(div);
		$("#svgBottomLegendsDiv" + temp.m_objectid).css("top", this.m_height - marginForFloatingLegends - 2 + "px");
		
		this.svgBottomLegendsId = "svgBottomLegends" + temp.m_objectid;
		$("#" + temp.svgBottomLegendsDivId).remove();
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("xlink", "http://www.w3.org/1999/xlink");
		svg.setAttribute("width", this.m_width);
		svg.setAttribute("height", marginForFloatingLegends);
		svg.setAttribute("id", this.svgBottomLegendsId);
		$("#svgBottomLegendsDiv" + temp.m_objectid).append(svg);
		
		var linearGradient = document.createElementNS(NS, "linearGradient");
		linearGradient.setAttribute("id", "gradient" + temp.m_objectid);
		linearGradient.setAttribute("gradientTransform", "rotate(" + this.m_bggradientrotation + ")");
		$("#" + temp.svgBottomLegendsId).append(linearGradient);
		
		var colors = this.getBgGradients().split(",");
		var step=(100 / (((colors.length-1)!=0)?(colors.length-1):1));
		for (var i = 0,Length= colors.length; i <=(Length-1); i++) {
			var stop = document.createElementNS(NS, "stop");
			stop.setAttribute("offset", (i *step) + "%");
			stop.setAttribute("stop-color", (hex2rgb(convertColorToHex(colors[i]),this.m_bgalpha)));
			stop.setAttribute("stop-opacity", this.m_bgalpha);
			$(linearGradient).append(stop);
		}
		
		var rect2 = drawSVGRect(0, 0, this.m_width, marginForFloatingLegends, "");
		$(rect2).attr("fill", "url(#gradient" + temp.m_objectid + ")");
		$("#" + temp.svgBottomLegendsId).append(rect2);
	}
};
/** @description will draw legends of chart for top & bottom positions  **/
TimelineChart.prototype.drawHorizontalFloatedLegends = function() {
	var temp = this;
	var topOfLegend = this.getMarginForLegend();
	var h = (this.m_topFloatingLegendMargin * this.minWHRatio());
	if(this.m_legendposition == "horizontalBottomLeft" || this.m_legendposition == "horizontalBottomCenter" || this.m_legendposition == "horizontalBottomRight") {
		this.drawBackgroundForLegend();
		topOfLegend = this.m_height * 1 - (40* this.minWHRatio());
		h = (this.m_bottomFloatingLegendMargin * this.minWHRatio());
	}
	var leftOfLegend = 12;
	$("#legendContent" + temp.m_objectid).remove();
	var div = document.createElement("div");
	div.setAttribute("id", "legendContent" + temp.m_objectid);

	div.style.position = "relative";
	div.style.height = h + "px";
	div.style.zIndex = "inherit";
	div.style.margin = "0 auto";
	div.style.background = hex2rgb(this.m_legendbackgroundcolor, this.m_legendbackgroundtransparency);
	div.style.float = "left";
	div.style.left = 12 + "px";
	div.style.visible = "hidden";
	div.style.top = topOfLegend * 1 + "px";
	$(div).prepend('<div id="left-button' + (temp.m_objectid)+'" class = "controlBtn left-button" style="visibility: hidden;height: inherit;"><a href="#" style="text-decoration : none;color: #808080"><</a></div>');
	var outerDiv = document.createElement("div");
	outerDiv.setAttribute('class', 'topfloatinglegend');
	outerDiv.setAttribute("id", "outerDiv" + temp.m_objectid);
	$(outerDiv).css("overflow-x","auto");
	outerDiv.style.width = this.m_width - leftOfLegend - 62 + "px";
	outerDiv.style.height = "inherit";
	var innerDiv = document.createElement("div");
	innerDiv.style.height = "inherit";
	innerDiv.style.fontSize = this.fontScaling(this.m_legendfontsize) + "px";
	if((this.m_legendposition == "horizontalTopLeft") || (this.m_legendposition == "horizontalBottomLeft")) {
		innerDiv.style.textAlign = "left";
	} else if(this.m_legendposition == "horizontalTopCenter" || this.m_legendposition == "horizontalBottomCenter") {
		innerDiv.style.textAlign = "center";
	} else {
		innerDiv.style.textAlign = "right";
	}
	var tableData = this.getFloatingLegendTableContent();
	$(innerDiv).append(tableData);
	$(outerDiv).append(innerDiv);
	$(div).append(outerDiv);
	$(div).append('<div id="right-button' + (temp.m_objectid)+'" class = "controlBtn right-button" style="visibility: hidden;height: inherit;"><a href="#" style="text-decoration : none;color: #808080;">></a></div>');
	this.m_draggableDiv.appendChild(div);
	var maxWidth = $(outerDiv).outerWidth(true);
	var items = $(innerDiv).children();
	var actualWidth = 0;
	var setVisible = function(elem) {
        elem.css('visibility', 'visible');
      };
    var setInvisible = function(elem) {
        elem.css('visibility', 'hidden');
      };
	for(var i = 0;i < items.length; i++) {
			actualWidth += $(items[i]).outerWidth(true);
	}
	if (maxWidth <= actualWidth) {
        setVisible($('#right-button' + temp.m_objectid));
        setVisible($('#left-button' + temp.m_objectid));
     }
	
	/** Added for support chart scaling*/
	if (IsBoolean(isScaling)) {
		$(div).find(".controlBtn").css({
			"padding-top": (5 * this.minWHRatio()) + "px"
		});
		$(outerDiv).css({
			"padding-top": (2 * this.minWHRatio()) + "px"
		});
		$(outerDiv).find("label").css({
			"padding-top": 	(5 * this.minWHRatio()) + "px ", 
			"margin-bottom": (5 * this.minWHRatio()) + "px",
			"height": "inherit"
		});
		
		$(outerDiv).find("span").each(function(){
			if (this.className != ""){
				$(this).css("font-size", temp.fontScaling(10) + "px");
			}
		});
	}
	$('#left-button' + temp.m_objectid).click(function() {
        var leftPos = $('#outerDiv' + temp.m_objectid).scrollLeft();
        $('#outerDiv' + temp.m_objectid).animate({
          scrollLeft: leftPos - 100
        }, 800, function() {
          if ($('#outerDiv' + temp.m_objectid).scrollLeft() <= 0) {
            //setInvisible($('#left-button' + temp.m_objectid));
          }
        });
      });

      $('#right-button' + temp.m_objectid).click(function() {
        //setVisible($('#left-button' + temp.m_objectid));
        var leftPos = $('#outerDiv' + temp.m_objectid).scrollLeft();
        $('#outerDiv' + temp.m_objectid).animate({
            scrollLeft: leftPos + 100
          }, 800);
      });
};
/** @description will draw legends of chart for middle positions  **/
TimelineChart.prototype.drawVerticalFloatedLegends = function() {
	var temp = this;
	var leftOfLegend = (this.m_legendposition == "verticalLeftTop" ||this.m_legendposition == "verticalLeftMiddle" ||this.m_legendposition == "verticalLeftBottom") ? 0 : (this.m_width - (this.m_rightFloatingLegendMargin * this.minWHRatio()));
	if(this.m_legendposition == "verticalLeftTop" || this.m_legendposition == "verticalRightTop"){
		var topOfLegend = this.m_endY;
	} else if(this.m_legendposition == "verticalLeftMiddle" || this.m_legendposition == "verticalRightMiddle"){
		topOfLegend = this.m_height * 0.5;
	} else {
		topOfLegend = this.m_height * 0.7;
	}
	$("#legendContent" + temp.m_objectid).remove();
	var div = document.createElement("div");
	div.setAttribute("id", "legendContent" + temp.m_objectid);

	div.style.position = "absolute";
	div.style.zIndex = "inherit";
	div.style.background = hex2rgb(this.m_legendbackgroundcolor, this.m_legendbackgroundtransparency);
	div.style.visible = "hidden";
	div.style.top = topOfLegend * 1 + "px";
	div.style.left = leftOfLegend * 1 + "px";
	$(div).prepend('<div id="top-button' + (temp.m_objectid)+'" class = "top-button controlBtn" style="visibility: hidden;"><a href="#" style="text-decoration : none;color: #808080;"><</a></div>');
	var outerDiv = document.createElement("div");
	outerDiv.setAttribute('class', 'middlefloatinglegend');
	outerDiv.setAttribute("id", "outerDiv" + temp.m_objectid);
	var heightOfDiv = (this.m_legendposition == "verticalLeftTop" ||this.m_legendposition == "verticalLeftMiddle" ||this.m_legendposition == "verticalLeftBottom") ? this.m_leftFloatingLegendMargin : this.m_rightFloatingLegendMargin;
	outerDiv.style.height = (this.m_height * 1 - topOfLegend - 50)  + "px";
	outerDiv.style.width = heightOfDiv * this.minWHRatio() + "px";
	var innerDiv = document.createElement("div");
	var tableData = this.getFloatingLegendTableContent();
	$(innerDiv).append(tableData);
	$(outerDiv).append(innerDiv);
	$(div).append(outerDiv);
	$(div).append('<div id="bottom-button' + (temp.m_objectid)+'" class = "bottom-button controlBtn" style="visibility: hidden;"><a href="#" style="text-decoration : none; color: #808080;">></a></div>');
	this.m_draggableDiv.appendChild(div);
	var maxWidth = $(outerDiv).outerHeight(true);
	var items = $(innerDiv).children();
	var actualWidth = 0;
	var setVisible = function(elem) {
        elem.css('visibility', 'visible');
      };
    var setInvisible = function(elem) {
        elem.css('visibility', 'hidden');
      };
	for(var i = 0;i < items.length; i++) {
		actualWidth += $(items[i]).outerHeight(true);
	}
	if (maxWidth <= actualWidth) {
        setVisible($('#bottom-button' + temp.m_objectid));
        setVisible($('#top-button' + temp.m_objectid));
     }
	
	/** Added for support chart scaling*/
	if (IsBoolean(isScaling)) {
		$(div).find(".controlBtn").css({
			"margin-left": (30 * this.minWHRatio()) + "px"
		});
		$(outerDiv).find("span").each(function(){
			if (this.className != ""){
				$(this).css("font-size", temp.fontScaling(10) + "px");
			}
		});
	}
	$('#top-button' + temp.m_objectid).click(function() {
        var leftPos = $('#outerDiv' + temp.m_objectid).scrollTop();
        $('#outerDiv' + temp.m_objectid).animate({
        scrollTop: leftPos - 70
        }, 800, function() {
          if ($('#outerDiv' + temp.m_objectid).scrollTop() <= 0) {
            //setInvisible($('#top-button' + temp.m_objectid));
          }
        });
      });

      $('#bottom-button' + temp.m_objectid).click(function() {
        //setVisible($('#top-button' + temp.m_objectid));
        var leftPos = $('#outerDiv' + temp.m_objectid).scrollTop();
        $('#outerDiv' + temp.m_objectid).animate({
        	scrollTop: leftPos + 30
          }, 800);
      });
};
/** @description will return legend content for top/middle/bottom positions  **/
TimelineChart.prototype.getFloatingLegendTableContent = function() {
	var legendTable = "";
	for (var i = 0, length = this.getLegendNames().length; i < length; i++) {
		var shape = this.legendMap[this.getSeriesNames()[i]].shape;
		var orgShape = this.getHTMLShape(shape);
		var fontSize = this.fontScaling(this.m_legendfontsize);
		if(this.m_legendposition == "horizontalTopLeft" || this.m_legendposition == "horizontalTopCenter" || this.m_legendposition == "horizontalTopRight" || this.m_legendposition == "horizontalBottomLeft" || this.m_legendposition == "horizontalBottomCenter" || this.m_legendposition == "horizontalBottomRight") {
			legendTable += "<label style=\"font-size:" + fontSize + "px;font-style:" + this.m_legendfontstyle + ";color:" + convertColorToHex(this.m_legendfontcolor) + ";text-decoration:" + this.m_legendtextdecoration + ";font-weight:" + this.m_legendfontweight + ";font-family:" + selectGlobalFont(this.m_legendfontfamily) + "\">"+
							""+this.drawLegendShape(orgShape,this.getLegendColors()[i])+"<span style=\"font-size:" + fontSize + "px;display:inline;\">" + this.getLegendNames()[i] +"</span></label>";
		} else {
			legendTable += "<label style=\"font-size:" + fontSize + "px; font-style:" + this.m_legendfontstyle + ";color:" + convertColorToHex(this.m_legendfontcolor) + ";text-decoration:" + this.m_legendtextdecoration + ";font-weight:" + this.m_legendfontweight + ";font-family:" + selectGlobalFont(this.m_legendfontfamily) + "\">"+
			                ""+this.drawLegendShape(orgShape,this.getLegendColors()[i])+"<span style=\"font-size:" + fontSize + "px;display:inline;\">" + this.getLegendNames()[i] +"</span></label></br>";
		}
	}
	return legendTable;
};

/** @description method returns margin for top floated legend **/
TimelineChart.prototype.getMarginForLegend = function () {
	var margin = (IsBoolean(this.m_updateddesign) ? 10 : 15);
	var topOfLegend = 0;
	if ((!IsBoolean(this.getShowGradient())) && (!IsBoolean(this.m_showmaximizebutton)) && (!IsBoolean(this.getTitle().m_showtitle)) && (!IsBoolean(this.m_showsettingmenubutton))) {
	    topOfLegend = 0;
	} else {
		topOfLegend = this.getMarginForTitle() * 1 - margin;
	}
	if (IsBoolean(this.m_subTitle.m_showsubtitle)) {
	    topOfLegend = topOfLegend + this.getMarginForSubTitle();
	} else {
	    topOfLegend = topOfLegend;
	}
	return topOfLegend;
};

/** @description Update Chart in case of fixed Range **/
TimelineChart.prototype.updateFixedRange = function (min,max) {
	var temp = this;
	var left = this.m_lineCalculation.onePartWidth*min;
	var right = this.m_lineCalculation.onePartWidth*(max);
	var width = Math.abs(right - left);
	var div = document.getElementById("silderSelecterdiv" + temp.m_objectid);
	if((div || "") != ""){
		div.style.left = left+"px";
		div.style.width = width+"px";
	}
	temp.updatechart(left,(right*1+this.m_startX*1));
};

/** @description hide resize handler of slider in case of fixed Range **/
TimelineChart.prototype.hideHandler = function () {
	var temp = this;
	$("#silderSelecterdiv" + temp.m_objectid).resizable({disabled:true});
};

/** @description calculate posible range  in case of fixed Range **/
TimelineChart.prototype.getPosibleRange = function (categoryData) {
	this.ctx.font = this.m_xAxis.getLabelFontProperties();
	var textWidth = this.ctx.measureText(categoryData[0]).width;
	var dataLength = categoryData.length;
	for (var i = 0; i < dataLength; i++) {
		if (this.ctx.measureText(categoryData[0]).width > textWidth)
			textWidth = this.ctx.measureText(categoryData[0]).width;
	}
	textWidth = (textWidth > 100) ? 100 : textWidth;
	var noofmarker = parseInt((this.getEndX() - this.getStartX()) / (textWidth * 1 + 6));
	noofmarker=(noofmarker>=categoryData.length)?categoryData.length:noofmarker;
	return {
		minindex : 0,
		maxindex : (noofmarker)
	};
};

/** @description Will Draw Title on SVG if showTitle set to true **/
TimelineChart.prototype.drawTitle = function () {
	this.m_title.draw();
};
/** @description Will Draw SubTitle on SVG if showSubTitle set to true **/
TimelineChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

/** @description Draw X-axis and marker of x-axis on SVG  **/
TimelineChart.prototype.drawXAxis = function () {
	this.createVerticalLineGroup('verticallinegrp');
	this.m_xAxis.drawVerticalLine();
	this.createXAxisMarkerLabelGroup('xaxislabelgrp');
	this.createTickGroup('xaxistickgrp');
	this.m_xAxis.markXaxis();
	this.m_xAxis.drawXAxis();
};

/** @description Draw y-axis (leftAxis and rightAxis) and marker of y-axis on SVG  **/
TimelineChart.prototype.drawYAxis = function () {
	if (IsBoolean(this.m_showmarkerline)){
		this.createHorizontalLineGroup('horizontallinegrp');
		this.m_yAxis.horizontalMarkerLines();
	}
	if (IsBoolean(this.m_zeromarkerline) && !IsBoolean(this.m_basezero) && IsBoolean(this.m_yAxis.hasNegativeAxisMarker(this.m_yAxis.m_yAxisMarkersArray))){
		this.m_yAxis.zeroMarkerLine(this.leftAxisInfo, this.m_zeromarkercolor);
	}
	this.m_yAxis.markYaxis(0);
	this.m_yAxis.drawYAxis();
	var rightAxisData=this.getAxisData(this.seriesDataMap["right"]);
	if (IsBoolean(this.m_secondaryaxisshow) && rightAxisData.all.length > 0) {
		this.createYAxisMarkerLabelGroup('rightyaxislabelgrp');
		$("#rightyaxislabelgrp" + this.m_objectid).css({
			  "font-family": selectGlobalFont(this.m_secondaryaxislabelfontfamily),
			  "font-style": this.m_secondaryaxislabelfontstyle,
			  "font-size": this.fontScaling(this.m_secondaryaxislabelfontsize) +"px" ,
			  "font-weight": this.m_secondaryaxislabelfontweight,
			  "text-decoration": this.m_secondaryaxislabeltextdecoration
	     });	
		this.drawSecondaryAxis();
	}
};

/** @description Draw SecondaryAxis (right-axis) and marker on SVG  **/
TimelineChart.prototype.drawSecondaryAxis = function () {
	if (IsBoolean(this.m_secondaxiszeromarkerline) && !IsBoolean(this.m_secondaxisbasezero) && IsBoolean(this.m_yAxis.hasNegativeAxisMarker(this.rightAxisInfo.markerarray))){
		this.m_yAxis.zeroMarkerLine(this.rightAxisInfo, this.m_secondaxiszeromarkercolor);
	}
	if (IsBoolean(this.m_showlinesecondaxis)){
		this.m_linesecondaxiscolor = this.m_linesecondaxiscolor || this.m_yAxis.m_lineyaxiscolor || "#FFFFFF";
		this.m_yAxis.drawSecondaryAxis();
	}
	this.m_yAxis.markRightYaxis();
};

/** @description Draw Timeline itrate for all series and draw visible series.  **/
TimelineChart.prototype.drawTimeSeries = function () {
	var seriesLength = this.m_seriesNames.length;
	var k = 0;
	for (var i = 0; i < seriesLength; i++) {
		if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
			if (this.m_lineSeries[this.m_seriesNames[i]] == undefined && this.m_columnSeries[this.m_seriesNames[i]] != undefined) {
				this.createStackGroup(this.m_columnSeries[this.m_seriesNames[i]], "stackgrp", i, this.m_seriesNames[i]);
				this.m_columnSeries[this.m_seriesNames[i]].drawColumns(i);
			} else {
				if (this.m_charttype === "fanchart") {
					this.createStackGroup(this.m_lineSeries[this.m_seriesNames[i]], "linestackgrp", i, this.m_seriesNames[i]);
					this.m_lineSeries[this.m_seriesNames[i]].drawFanChartSeries(k);
					k++;
				} else {
					this.createStackGroup(this.m_lineSeries[this.m_seriesNames[i]], "linestackgrp", i, this.m_seriesNames[i]);
					this.m_lineSeries[this.m_seriesNames[i]].drawLineSeries(i);
					 if (IsBoolean(this.getShowPoint()) || (this.m_lineCalculation.xAxisData.length == 1)) {
						this.createShapeGroup("shapegrp", i, this.m_seriesNames[i]);
					    this.m_pointSeries[this.m_seriesNames[i]].drawPointSeries(i);
					}
				}
			}
		}
	}
};
/** @description Will Draw Annotations on TimeSeries chart  **/
TimelineChart.prototype.drawAnnotationChart=function(){
	this.m_annotationSeries = {};
	
	if(	this.m_categoryData[0].length>1 || (	this.m_categoryData[0].length ==1 && this.m_annotationformat == "year")){
	for (var i = 0, length = this.m_seriesNames.length; i < length; i++) {
		if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
			if (IsBoolean(this.m_showannotation) || (this.m_lineCalculation.xannotationPosArray == 1)) {
				/**DAS-954 */
				/**chck annotation points */
				this.m_annotationSeries[this.m_seriesNames[i]] = new AnnotSeries();
				this.m_annotationSeries[this.m_seriesNames[i]].init(this.m_PointsColorsArray[this.m_seriesNames[i]], (this.m_radius[this.m_seriesNames[i]] * 1) + 1, this.m_lineCalculation.xannotationPosArray, this.m_lineCalculation.getYPositionArray(this.m_seriesNames[i]), this, [], this.m_plotShapeArray[this.m_seriesNames[i]], this.m_plotRadiusArray[this.m_seriesNames[i]]);//this.m_plotTrasparencyArray[i1]
				this.m_annotationSeries[this.m_seriesNames[i]].drawPointSeries();

			}
		}
	}
	}
};
/** @description Draw Timeline iterate for all series and draw Data Label for visible series.  **/
TimelineChart.prototype.drawDataLabel = function() {
    var seriesLength = this.m_seriesNames.length;
    this.m_overlappeddatalabelarrayX = [];
    this.m_overlappeddatalabelarrayY = [];
    for (var i = 0; i < seriesLength; i++) {
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
        	var text = this.m_valueTextSeries[this.m_seriesNames[i]];
            if (IsBoolean(this.m_seriesDataLabelProperty[this.m_seriesNames[i]].showDataLabel)) {
            	this.createDataLabelGroup(text, 'datalabelgrp' , i, this.m_seriesNames[i]);
            	text.drawSVGValueTextSeries();
            }
        }
    }
};
/** @description drawing Thresholdline on TimelineChart DAS-982**/
TimelineChart.prototype.drawThreshold = function() {
	if (IsBoolean(this.m_showyaxisthreshold)) {
		var lineWidth = 0.5;
		var antiAliasing = 0.5;
		var secondAxis = this.m_lineCalculation.rightAxisInfo.markerarray;
		if (this.m_secondaryaxisshow && secondAxis != "" ) {
			var fData = secondAxis[0] * 1;
			var lData = secondAxis[secondAxis.length - 1] * 1;
		} else {
			var fData = this.m_yAxis.m_yAxisMarkersArray[0] * 1;
			var lData = (this.m_yAxis.m_yAxisMarkersArray[this.m_yAxis.m_yAxisMarkersArray.length - 1] * 1) 
		}

		var ratio = 1 / (lData - fData);
		var perYPixel = ratio * (this.m_startY * 1 - this.m_endY * 1);

		//&& !IsBoolean(this.m_basezero)
		this.m_minimumyaxisthreshold = (IsBoolean(this.m_minimumyaxisthresholdline)) ?
			this.m_minimumyaxisthreshold : this.m_yAxis.m_yAxisMarkersArray[0];
		var pixelValue = {};
		if (this.m_secondaryaxisshow  && secondAxis != "" ) {
			if (IsBoolean(this.m_secondaxisautosetup) && IsBoolean(this.m_secondaxisbasezero)) {
				/*if ((this.m_minimumyaxisthreshold * 1) <= (this.m_maximumyaxisthreshold * 1)) {*/
					// Adjust minimum and maximum thresholds
					if (this.m_minimumyaxisthreshold * 1 < fData) {
						this.m_minimumyaxisthreshold = fData;
					}
					if ((this.m_maximumyaxisthreshold * 1) > lData) {
						this.m_maximumyaxisthreshold = lData;
					}
					if (this.m_maximumyaxisthreshold * 1 < fData) {
						this.m_maximumyaxisthreshold = fData;
					}
					if (this.m_minimumyaxisthreshold * 1 > lData) {
						this.m_minimumyaxisthreshold = lData;
					}

					// Drawing logic based on the adjusted thresholds
					if ((this.m_minimumyaxisthreshold * 1) < (fData * 1) && (this.m_maximumyaxisthreshold * 1) > (lData * 1)) {
						pixelValue["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
						pixelValue["y1"] = this.m_startY * 1;
						pixelValue["x2"] = this.m_endX * 1;
						pixelValue["y2"] = this.m_startY * 1;

						pixelValue["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
						pixelValue["Y1"] = this.m_endY * 1;
						pixelValue["X2"] = this.m_endX * 1;
						pixelValue["Y2"] = this.m_endY * 1;

					} else if ((this.m_minimumyaxisthreshold * 1) < (fData * 1)) {
						pixelValue["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
						pixelValue["y1"] = this.m_startY * 1;
						pixelValue["x2"] = this.m_endX * 1;
						pixelValue["y2"] = this.m_startY * 1;

						pixelValue["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
						pixelValue["Y1"] = this.m_startY * 1 - (this.m_maximumyaxisthreshold * perYPixel);
						pixelValue["X2"] = this.m_endX * 1;
						pixelValue["Y2"] = this.m_startY * 1 - (this.m_maximumyaxisthreshold * perYPixel);

					} else if ((this.m_maximumyaxisthreshold * 1) > (lData * 1)) {
						pixelValue["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
						pixelValue["y1"] = this.m_startY * 1 - (this.m_minimumyaxisthreshold * perYPixel);
						pixelValue["x2"] = this.m_endX * 1;
						pixelValue["y2"] = this.m_startY * 1 - (this.m_minimumyaxisthreshold * perYPixel);

						pixelValue["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
						pixelValue["Y1"] = this.m_endY * 1;
						pixelValue["X2"] = this.m_endX * 1;
						pixelValue["Y2"] = this.m_endY * 1;

					} else {
						pixelValue["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
						pixelValue["y1"] = this.m_startY * 1 - (this.m_minimumyaxisthreshold * perYPixel);
						pixelValue["x2"] = this.m_endX * 1;
						pixelValue["y2"] = this.m_startY * 1 - (this.m_minimumyaxisthreshold * perYPixel);

						pixelValue["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
						pixelValue["Y1"] = this.m_startY * 1 - (this.m_maximumyaxisthreshold * perYPixel);
						pixelValue["X2"] = this.m_endX * 1;
						pixelValue["Y2"] = this.m_startY * 1 - (this.m_maximumyaxisthreshold * perYPixel);
					}
				/*} else {
					this.drawSVGMessage(this.m_status.notValidthresholdValues);
				}*/
			} else {
				var pixelValue = this.thresholdYAxisCalculation(fData, lData, perYPixel);
			}
		}
		else if (IsBoolean(this.m_autoaxissetup) && IsBoolean(this.m_basezero)) {
			/*if ((this.m_minimumyaxisthreshold * 1) <= (this.m_maximumyaxisthreshold * 1)) {*/
				// Adjust minimum and maximum thresholds
				if (this.m_minimumyaxisthreshold * 1 < fData) {
					this.m_minimumyaxisthreshold = fData;
				}
				if ((this.m_maximumyaxisthreshold * 1) > lData) {
					this.m_maximumyaxisthreshold = lData;
				}
				if (this.m_maximumyaxisthreshold * 1 < fData) {
					this.m_maximumyaxisthreshold = fData;
				}
				if (this.m_minimumyaxisthreshold * 1 > lData) {
					this.m_minimumyaxisthreshold = lData;
				}

				// Drawing logic based on the adjusted thresholds
				if ((this.m_minimumyaxisthreshold * 1) < (fData * 1) && (this.m_maximumyaxisthreshold * 1) > (lData * 1)) {
					pixelValue["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelValue["y1"] = this.m_startY * 1;
					pixelValue["x2"] = this.m_endX * 1;
					pixelValue["y2"] = this.m_startY * 1;

					pixelValue["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelValue["Y1"] = this.m_endY * 1;
					pixelValue["X2"] = this.m_endX * 1;
					pixelValue["Y2"] = this.m_endY * 1;

				} else if ((this.m_minimumyaxisthreshold * 1) < (fData * 1)) {
					pixelValue["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelValue["y1"] = this.m_startY * 1;
					pixelValue["x2"] = this.m_endX * 1;
					pixelValue["y2"] = this.m_startY * 1;

					pixelValue["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelValue["Y1"] = this.m_startY * 1 - (this.m_maximumyaxisthreshold * perYPixel);
					pixelValue["X2"] = this.m_endX * 1;
					pixelValue["Y2"] = this.m_startY * 1 - (this.m_maximumyaxisthreshold * perYPixel);

				} else if ((this.m_maximumyaxisthreshold * 1) > (lData * 1)) {
					pixelValue["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelValue["y1"] = this.m_startY * 1 - (this.m_minimumyaxisthreshold * perYPixel);
					pixelValue["x2"] = this.m_endX * 1;
					pixelValue["y2"] = this.m_startY * 1 - (this.m_minimumyaxisthreshold * perYPixel);

					pixelValue["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelValue["Y1"] = this.m_endY * 1;
					pixelValue["X2"] = this.m_endX * 1;
					pixelValue["Y2"] = this.m_endY * 1;

				} else {
					pixelValue["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelValue["y1"] = this.m_startY * 1 - (this.m_minimumyaxisthreshold * perYPixel);
					pixelValue["x2"] = this.m_endX * 1;
					pixelValue["y2"] = this.m_startY * 1 - (this.m_minimumyaxisthreshold * perYPixel);

					pixelValue["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelValue["Y1"] = this.m_startY * 1 - (this.m_maximumyaxisthreshold * perYPixel);
					pixelValue["X2"] = this.m_endX * 1;
					pixelValue["Y2"] = this.m_startY * 1 - (this.m_maximumyaxisthreshold * perYPixel);
				}
		/*	} else {
				this.drawSVGMessage(this.m_status.notValidthresholdValues);
			}*/
		}
		else {
			var pixelValue = this.thresholdYAxisCalculation(fData, lData, perYPixel);
		}
		this.m_fillcolorarray = [];
		var strokeStyle = hex2rgb(this.m_markercolor, this.m_markertransparency);
		this.drawThresholdLineBetweenPoints(fData,lData,this.m_minimumyaxisthreshold,this.m_yaxisthresholdlinewidth, antiAliasing, this.m_minimumthresholdstrokecolor, pixelValue.x1, pixelValue.y1, pixelValue.x2, pixelValue.y2);
		this.drawThresholdLineBetweenPoints(fData,lData,this.m_maximumyaxisthreshold,this.m_yaxisthresholdlinewidth, antiAliasing, this.m_maximumthresholdstrokecolor, pixelValue.X1, pixelValue.Y1, pixelValue.X2, pixelValue.Y2);
		this.fillColorBetweenPoints(this.m_fillcolorarray);

	}
};
/** @description y-axis threshold pixel calculation TimelineChart chart DAS-982**/
TimelineChart.prototype.thresholdYAxisCalculation = function(fData , lData , perYPixel) {
	var pixelMap = {};
	if (fData < 0) {		// Left Axis is -ve
		if (lData < 0) {		// Left Axis is -ve && Right Axis is -ve
			if ( (this.m_minimumyaxisthreshold*1) < (fData*1) && (this.m_maximumyaxisthreshold*1) > (lData*1) ) {
				pixelMap["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
				pixelMap["y1"] = this.m_startY * 1;
				pixelMap["x2"] = this.m_endX * 1;
				pixelMap["y2"] = this.m_startY * 1;
				
				pixelMap["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
				pixelMap["Y1"] = this.m_endY * 1;
				pixelMap["X2"] = this.m_endX * 1;
				pixelMap["Y2"] = this.m_endY * 1;
			} else if ( (this.m_minimumyaxisthreshold*1) < (fData*1) ) {
				pixelMap["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
				pixelMap["y1"] = this.m_startY * 1;
				pixelMap["x2"] = this.m_endX * 1;
				pixelMap["y2"] = this.m_startY * 1;
				
				pixelMap["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
				pixelMap["Y1"] = this.m_startY * 1 - (this.m_maximumyaxisthreshold * perYPixel) + (fData * perYPixel);
				pixelMap["X2"] = this.m_endX * 1;
				pixelMap["Y2"] = this.m_startY * 1 - (this.m_maximumyaxisthreshold * perYPixel) + (fData * perYPixel);
			} else if ( (this.m_maximumyaxisthreshold*1) > (lData*1)  ) {
				pixelMap["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
				pixelMap["y1"] = this.m_startY * 1 - (this.m_minimumyaxisthreshold * perYPixel) + (fData * perYPixel);
				pixelMap["x2"] = this.m_endX * 1;
				pixelMap["y2"] = this.m_startY * 1 - (this.m_minimumyaxisthreshold * perYPixel) + (fData * perYPixel);
				
				pixelMap["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
				pixelMap["Y1"] = this.m_endY * 1;
				pixelMap["X2"] = this.m_endX * 1;
				pixelMap["Y2"] = this.m_endY * 1;
			} else {
				pixelMap["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
				pixelMap["y1"] = this.m_startY * 1 - (this.m_minimumyaxisthreshold * perYPixel) + (fData * perYPixel);
				pixelMap["x2"] = this.m_endX * 1;
				pixelMap["y2"] = this.m_startY * 1 - (this.m_minimumyaxisthreshold * perYPixel) + (fData * perYPixel);
				
				pixelMap["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
				pixelMap["Y1"] = this.m_startY * 1 - (this.m_maximumyaxisthreshold * perYPixel) + (fData * perYPixel);
				pixelMap["X2"] = this.m_endX * 1;
				pixelMap["Y2"] = this.m_startY * 1 - (this.m_maximumyaxisthreshold * perYPixel) + (fData * perYPixel);
			}
		} else {		// Left Axis is -ve && Right Axis is +ve
			/*if ((this.m_minimumyaxisthreshold * 1) <= (this.m_maximumyaxisthreshold * 1)) {*/
				if (this.m_minimumyaxisthreshold * 1 < fData) {
					this.m_minimumyaxisthreshold  = fData;
				}
				if ((this.m_maximumyaxisthreshold * 1) > lData) {
					this.m_maximumyaxisthreshold = lData;
				}
				if(this.m_maximumyaxisthreshold * 1 < fData){
					this.m_maximumyaxisthreshold = fData;
				}
				if(this.m_minimumyaxisthreshold * 1 > lData){
					this.m_minimumyaxisthreshold = lData;
				}
				if ((this.m_minimumyaxisthreshold * 1) < (fData * 1) && (this.m_maximumyaxisthreshold * 1) > (lData * 1)) {
					pixelMap["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["y1"] = this.m_startY * 1;
					pixelMap["x2"] = this.m_endX * 1;
					pixelMap["y2"] = this.m_startY * 1;

					pixelMap["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["Y1"] = this.m_endY * 1;
					pixelMap["X2"] = this.m_endX * 1;
					pixelMap["Y2"] = this.m_endY * 1;
				} else if ((this.m_minimumyaxisthreshold * 1) < (fData * 1)) {
					pixelMap["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["y1"] = this.m_startY * 1;
					pixelMap["x2"] = this.m_endX * 1;
					pixelMap["y2"] = this.m_startY * 1;

					pixelMap["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["Y1"] = this.m_startY * 1 - (this.m_maximumyaxisthreshold * perYPixel) + (fData * perYPixel);
					pixelMap["X2"] = this.m_endX * 1;
					pixelMap["Y2"] = this.m_startY * 1 - (this.m_maximumyaxisthreshold * perYPixel) + (fData * perYPixel);
				} else if ((this.m_maximumyaxisthreshold * 1) > (lData * 1)) {
					pixelMap["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["y1"] = this.m_startY * 1 - (this.m_minimumyaxisthreshold * perYPixel) + (fData * perYPixel);
					pixelMap["x2"] = this.m_endX * 1;
					pixelMap["y2"] = this.m_startY * 1 - (this.m_minimumyaxisthreshold * perYPixel) + (fData * perYPixel);

					pixelMap["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["Y1"] = this.m_endY * 1;
					pixelMap["X2"] = this.m_endX * 1;
					pixelMap["Y2"] = this.m_endY * 1;
				} else {
					pixelMap["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["y1"] = this.m_startY * 1 - (this.m_minimumyaxisthreshold * perYPixel) + (fData * perYPixel);
					pixelMap["x2"] = this.m_endX * 1;
					pixelMap["y2"] = this.m_startY * 1 - (this.m_minimumyaxisthreshold * perYPixel) + (fData * perYPixel);

					pixelMap["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["Y1"] = this.m_startY * 1 - (this.m_maximumyaxisthreshold * perYPixel) + (fData * perYPixel);
					pixelMap["X2"] = this.m_endX * 1;
					pixelMap["Y2"] = this.m_startY * 1 - (this.m_maximumyaxisthreshold * perYPixel) + (fData * perYPixel);
				}
			/*} else {
				this.drawSVGMessage(this.m_status.notValidthresholdValues);
			}*/
		}
	} else {
		if (lData < 0) {		// Left Axis is +ve && Right Axis is -ve
//			console.log("C");
		} else {		// Left Axis is +ve && Right Axis is +ve
			/*if ((this.m_minimumyaxisthreshold * 1) <= (this.m_maximumyaxisthreshold * 1)) {*/
				let minYThreshold = this.m_minimumyaxisthreshold * 1;
				let maxYThreshold = this.m_maximumyaxisthreshold * 1;

				if (minYThreshold < fData) {
					minYThreshold = fData;
				}
				if (maxYThreshold > lData) {
					maxYThreshold = lData;
				}

				if (minYThreshold > (lData * 1) && maxYThreshold <= (lData * 1) && maxYThreshold >= (fData * 1)) {
					pixelMap["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["y1"] = this.m_endY * 1;
					pixelMap["x2"] = this.m_endX * 1;
					pixelMap["y2"] = this.m_endY * 1;

					pixelMap["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["Y1"] = this.m_startY * 1 - (maxYThreshold * perYPixel) + (fData * perYPixel);
					pixelMap["X2"] = this.m_endX * 1;
					pixelMap["Y2"] = this.m_startY * 1 - (maxYThreshold * perYPixel) + (fData * perYPixel);

				} else if (minYThreshold > (lData * 1) && maxYThreshold >= (lData * 1)) {
					pixelMap["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["y1"] = this.m_endY * 1;
					pixelMap["x2"] = this.m_endX * 1;
					pixelMap["y2"] = this.m_endY * 1;

					pixelMap["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["Y1"] = this.m_endY * 1;
					pixelMap["X2"] = this.m_endX * 1;
					pixelMap["Y2"] = this.m_endY * 1;

				} else if (maxYThreshold < (fData * 1) && minYThreshold >= (fData * 1)) {
					pixelMap["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["y1"] = this.m_startY * 1 - (minYThreshold * perYPixel) + (fData * perYPixel);
					pixelMap["x2"] = this.m_endX * 1;
					pixelMap["y2"] = this.m_startY * 1 - (minYThreshold * perYPixel) + (fData * perYPixel);

					pixelMap["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["Y1"] = this.m_startY * 1;
					pixelMap["X2"] = this.m_endX * 1;
					pixelMap["Y2"] = this.m_startY * 1;

				} else if (maxYThreshold < (fData * 1) && minYThreshold < (fData * 1)) {
					pixelMap["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["y1"] = this.m_startY * 1;
					pixelMap["x2"] = this.m_endX * 1;
					pixelMap["y2"] = this.m_startY * 1;

					pixelMap["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["Y1"] = this.m_startY * 1;
					pixelMap["X2"] = this.m_endX * 1;
					pixelMap["Y2"] = this.m_startY * 1;

				} else if (minYThreshold < (fData * 1)) {
					pixelMap["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["y1"] = this.m_startY * 1;
					pixelMap["x2"] = this.m_endX * 1;
					pixelMap["y2"] = this.m_startY * 1;

					pixelMap["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["Y1"] = this.m_startY * 1 - (maxYThreshold * perYPixel) + (fData * perYPixel);
					pixelMap["X2"] = this.m_endX * 1;
					pixelMap["Y2"] = this.m_startY * 1 - (maxYThreshold * perYPixel) + (fData * perYPixel);

				} else if (maxYThreshold > (lData * 1)) {
					pixelMap["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["y1"] = this.m_startY * 1 - (minYThreshold * perYPixel) + (fData * perYPixel);
					pixelMap["x2"] = this.m_endX * 1;
					pixelMap["y2"] = this.m_startY * 1 - (minYThreshold * perYPixel) + (fData * perYPixel);

					pixelMap["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["Y1"] = this.m_endY * 1;
					pixelMap["X2"] = this.m_endX * 1;
					pixelMap["Y2"] = this.m_endY * 1;

				} else {
					pixelMap["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["y1"] = this.m_startY * 1 - (minYThreshold * perYPixel) + (fData * perYPixel);
					pixelMap["x2"] = this.m_endX * 1;
					pixelMap["y2"] = this.m_startY * 1 - (minYThreshold * perYPixel) + (fData * perYPixel);

					pixelMap["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
					pixelMap["Y1"] = this.m_startY * 1 - (maxYThreshold * perYPixel) + (fData * perYPixel);
					pixelMap["X2"] = this.m_endX * 1;
					pixelMap["Y2"] = this.m_startY * 1 - (maxYThreshold * perYPixel) + (fData * perYPixel);
				}
			/*} else {
				this.drawSVGMessage(this.m_status.notValidthresholdValues);
			}*/

		}
	}
	return pixelMap;
};
/** @description y-axis threshold line drawing in TimelineChart chart DAS-982**/
TimelineChart.prototype.drawThresholdLineBetweenPoints = function(fdata,ldata,thresholdvalue,lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2, text, textcolor,opacity) {
	if ((x1 && x1 != Infinity) && (x2 != Infinity && x2)) {
		var fillcolor = hex2rgb(strokeColor, opacity);
		var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		var dashArray = [4, 4];
		line.setAttribute('x1', x1);
		line.setAttribute('y1', y1);
		line.setAttribute('x2', x2);
		line.setAttribute('y2', y2);
		line.setAttribute('stroke', fillcolor);
		line.setAttribute('stroke-width', lineWidth);
		$("#" + this.svgContainerId).append(line);
		if (thresholdvalue > fdata && thresholdvalue < ldata) {
			var lines = { "X1": x1, "Y1": y1, "X2": x2, "Y2": y2 };
			this.m_fillcolorarray.push(lines);
		}
	}

};
/** @description filling color for threshold range  **/
TimelineChart.prototype.fillColorBetweenPoints = function(fillArray) {
	if (IsBoolean(this.m_enablethresholdfill) && fillArray.length > 0 ) {
		var minY, maxY;
		minY = fillArray[0].Y1;
		maxY = fillArray[0].Y1;

		for (var i = 1; i < fillArray.length; i++) {
			var point = fillArray[i];
			if (point.Y1 < minY) {
				minY = point.Y1;
			}
			if (point.Y1 > maxY) {
				maxY = point.Y1;
			}
		}
		
		var point = fillArray[0];
		var X1 = point.X1;
		var X2 = point.X2;

		var minX = Math.min(X1, X2);
		var maxX = Math.max(X1, X2);

		// Fill color between minY and startY
		var minY1 = Math.min(maxY, this.m_startY);
		var maxY1 = Math.max(maxY, this.m_startY);
		var width1 = maxX - minX;
		var height1 = maxY1 - minY1;		
		var centerX = minX + width1 / 2;/*label*/
		var centerY = minY1 + height1 / 2;/*label*/
		
		var fillStyle = hex2rgb(this.m_fillBelowLowerThreshold, this.m_fillBelowThresholdOpacity * 1);
		var rect1 = drawSVGRect(minX, minY1, width1, height1,fillStyle);
		$("#" + this.svgContainerId).append(rect1)
		/*label drawing*/
		var text1 = drawSVGText(centerX, centerY, this.m_BelowThresholdLabel, hex2rgb(this.m_BelowThresholdLabelColor, 1), "center", "middle", 0);
		text1.setAttribute("style", "font-family:" + selectGlobalFont(this.m_statusfontfamily) + ";font-style:none;font-size:16px;font-weight:normal;text-decoration:none;");
		$("#" + this.svgContainerId).append(text1);
		
		// Fill color between minY and maxY
		var minY2 = minY;
		var maxY2 = maxY;
		var height2 = maxY2 - minY2;		
		var fillStyle = hex2rgb(this.m_fillBetweenThreshold, this.m_fillBetweenThresholdOpacity * 1);
		var rect2 = drawSVGRect(minX, minY2, width1, height2,fillStyle);
		$("#" + this.svgContainerId).append(rect2)

		/*label drawing*/
		var centerY2 = minY2 + height2 / 2;/*label*/
		if (height2 > 0) {
			var text2 = drawSVGText(centerX, centerY2, this.m_BetweenThresholdLabel, hex2rgb(this.m_BetweenThresholdLabelColor,1), "center", "middle", 0);
			text2.setAttribute("style", "font-family:" + selectGlobalFont(this.m_statusfontfamily) + ";font-style:none;font-size:16px;font-weight:normal;text-decoration:none;");
			$("#" + this.svgContainerId).append(text2);
		}

		// Fill color between minY and endY
		var minY3 = Math.min(minY, this.m_endY);
		var maxY3 = Math.max(minY, this.m_endY);
		var height3 = maxY3 - minY3;
		
		var centerY3 = minY3 + height3 / 2/*label*/
		
		var fillStyle =  hex2rgb(this.m_fillAboveUpperThreshold, this.m_fillUpperThresholdOpacity * 1)
		var rect3 = drawSVGRect(minX, minY3, width1, height3,fillStyle);
		$("#" + this.svgContainerId).append(rect3);
		// label drawing
		var text3 = drawSVGText(centerX, centerY3,this.m_UpperThresholdLabel,  hex2rgb(this.m_UpperThresholdLabelColor, 1), "center", "middle", 0);
		text3.setAttribute("style", "font-family:" + selectGlobalFont(this.m_statusfontfamily) + ";font-style:none;font-size:16px;font-weight:normal;text-decoration:none;");
		$("#" + this.svgContainerId).append(text3);

	}
};
/** @description Setter Method to set ThresholdFillColors. **/
TimelineChart.prototype.setThresholdFillColors = function() {
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
/** @description Will Draw ChartFrame and gradient if given any, default is #ffffff **/
TimelineChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawSVGFrame();
	this.getBGGradientColorToContainer();
};

/** @description Will generate the gradient and fill in background of chart  **/
TimelineChart.prototype.getBGGradientColorToContainer = function () {
	var temp = this;
	var defsElement = document.createElementNS('http://www.w3.org/2000/svg', "defs");
	defsElement.setAttribute("id", "defsElement"+temp.m_objectid);
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

/** @description Will generate the gradient and fill in background of Scale chart  **/
TimelineChart.prototype.getBGGradientColorToScale = function () {
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
	var rect1 = drawSVGRect(0, 0, this.m_width, this.sliderMargin, "");
	$(rect1).attr("id", "GradientScaleRect" + temp.m_objectid);
	$(rect1).css("opacity","0");
	$(rect1).attr("fill", "url(#gradient1" + temp.m_objectid + ")");
	$("#" + temp.svgTimeScaleId).append(rect1);
};

/** @description Update slider position according to current Date or right side **/
TimelineChart.prototype.sliderAxisCalculation = function(sliderTotalWidth, slectedWidth) {
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
            this.tempLeft = this.m_lineCalculation.xPositionMap[key][i] - this.getStartX() * 1;
            if ((this.tempLeft + slectedWidth) > sliderTotalWidth || this.currentDateIndex == this.lastIndex) {
                this.tempLeft = sliderTotalWidth - slectedWidth;
            } else if (this.tempLeft < this.getStartX() || this.currentDateIndex == 0) {
                this.tempLeft = this.getStartX() * 1;
            }
            break;
        }
    }
    return this.tempLeft;
};
/***************************************** End Drawing  ******************************************8************/
/** @description calculate the drill data point and return required info  **/
TimelineChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
	/*var map = this.seriesDataMap;
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory))) && IsBoolean(this.isVisibleSeries())) {
		var columnWidth = this.m_lineCalculation.columnWidth / this.m_lineCalculation.totalColumn;
		var pointRadius = 5;
		if ((mouseX >= this.getStartX() && mouseX <= this.getEndX()) && (mouseY <= this.getStartY() && mouseY >= this.getEndY())) {
			for (key in map) {
				for (key2 in map[key]) {
					for (key1 in map[key][key2]) {
						if (key1 != "unique" && key1 != "contains") {
							var xpixcel = this.m_lineCalculation.getXPositionArray(key1);
							var ypixcel = this.m_lineCalculation.getYPositionArray(key1);
							var xpixelLength=xpixcel.length;
							for (var i = 0; i < xpixelLength; i++) {
								var xpixl1 = (key2 == "line") ? (xpixcel[i] - pointRadius) : xpixcel[i];
								var xpixl2 = (key2 == "line") ? (xpixcel[i] * 1 + pointRadius) : xpixcel[i] + columnWidth;
								var ypixl1 = (key2 == "line") ? (ypixcel[i] + pointRadius) : this.getStartY();
								var ypixl2 = (key2 == "line") ? (ypixcel[i] * 1 - pointRadius) : ypixcel[i];

								if (mouseX <= (xpixl2 * 1) && mouseX >= (xpixl1 * 1) && mouseY <= ypixl1 && mouseY >= ypixl2) {
									var catDataLength=this.CatData[0].length;
									for (var k = 0; k < catDataLength; k++) {
										if (this.m_categoryData[0][i] == this.CatData[0][k])
											break;
									}
									var fieldNameValueMap = this.getFieldNameValueMap(k);
									var drillColor = this.getSeriesColors()[key1];
									var drillField = key1;
									var drillDisplayField = this.m_seriesDisplayNamesMap[key1];
									var drillValue = fieldNameValueMap[drillField];
									fieldNameValueMap.drillField = drillField;
									fieldNameValueMap.drillDisplayField = drillDisplayField;
									fieldNameValueMap.drillValue = drillValue;
									return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
								}
							}
						}
					}
				}
			}
		}
	}*/
	var temp = this;
	var map = this.seriesDataMapForIndex;
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory))) && IsBoolean(this.isVisibleSeries())) {
		if(this.m_columntype == "clustered"){
			var columnWidth = (this.m_lineCalculation.columnWidth*this.clusteredbarpadding) / this.m_lineCalculation.totalColumn;
		}else{
			var columnWidth = this.m_lineCalculation.columnWidth / this.m_lineCalculation.totalColumn;
		}
	    var pointRadius = 5;
	    var isDrillIndexFound = false;
		var drillMinStackHeight = (this.m_columntype == "stacked") ? 0 : this.m_drillminstackheight;
	    if ((mouseX >= this.getStartX() && mouseX <= this.getEndX()) && (mouseY <= this.getStartY() && mouseY >= this.getEndY())) {
	        for (chartKey in map) {
	            for (var axisKay in map[chartKey]) {
	                var index = 0;
	                if (this.columntype == "overlaid" && chartKey == "column") {
	                    var WidthArr = this.m_lineCalculation.overlaidColWidth[axisKay][chartKey];
	                    for (var seriesKeyindex in WidthArr) {
	                        var xpixcel = this.m_lineCalculation.getXPositionArray(WidthArr[seriesKeyindex]);
	                        var ypixcel = this.m_lineCalculation.getYPositionArray(WidthArr[seriesKeyindex]);
	                        var xpixcelLength = xpixcel.length;
	                        var startIndex = (IsBoolean(this.m_showslider)) ? (this.m_sliderLastIndex + 1) - xpixcelLength : 0;
	                        if (xpixcel != undefined && ypixcel != undefined) {
	                            for (var i = 0; i < xpixcelLength; i++) {
	                            	var StackHeight = 0;
	                            	if (Math.abs(this.getStartY() - ypixcel[i]) < drillMinStackHeight) {
	                            	    StackHeight = (this.m_columnSeries[seriesKey[k]].m_ySeriesData[i] * 1 < 0) ? drillMinStackHeight : - drillMinStackHeight;
	                            	}
	                                var xpixl1 = (chartKey == "line") ? (xpixcel[i] - pointRadius) : xpixcel[i];
	                                var xpixl2 = (chartKey == "line") ? (xpixcel[i] * 1 + pointRadius) : xpixcel[i] + this.m_lineCalculation.columnWidthMap[WidthArr[seriesKeyindex]];
	                                var ypixl1 = (chartKey == "line") ? (ypixcel[i] + pointRadius) : this.getStartY();
	                                var ypixl2 = (chartKey == "line") ? (ypixcel[i] * 1 - pointRadius) : ypixcel[i] + StackHeight;

	                                if (mouseX <= (xpixl2 * 1) && mouseX >= (xpixl1 * 1) && mouseY <= ypixl1 && mouseY >= ypixl2) {
	                                    /*for (var k = 0; k < this.m_categoryData[0].length; k++) {
	                                        if (this.m_categoryData[0][i] == this.m_categoryData[0][k])
	                                            break;
	                                    }*/
	                                    var fieldNameValueMap = this.getFieldNameValueMap(startIndex + i);
	                                    /**Clicked color drills as the drill-color not series color.*/
	                                    var drillColor = this.m_PointsColorsArray[this.m_seriesNames[(WidthArr.length - 1 - index)]][i];
	                                    var drillField = this.m_seriesNames[(WidthArr.length - 1 - index)];
	                                    var drillDisplayField = this.m_seriesDisplayNamesMap[this.m_seriesNames[(WidthArr.length - 1 - index)]];
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
	                        index++;
	                    }
	                } else {
	                	var seriesKey = this.m_seriesNames.filter(function(key) {
	                	    return temp.m_seriesVisibleArr[key];
	                	});
	                	var Yposition = true;

	                	for (var k = seriesKey.length - 1; k >= 0; k--) {
	                	    if (seriesKey[k] != "unique" && seriesKey[k] != "contains") {
	                	        var xpixcel = this.m_lineCalculation.getXPositionArray(seriesKey[k]);
	                	        var ypixcel = this.m_lineCalculation.getYPositionArray(seriesKey[k]);
	                	        var xpixcelLength = xpixcel.length;
	                	        var startIndex = (IsBoolean(this.m_showslider)) ? (this.m_sliderLastIndex + 1) - xpixcelLength : 0;
	                	        var MarkerArray = [];
	                	        var Axistype = this.m_seriesAxisDrill[seriesKey[k]];
	                	        var chartKey = this.m_seriesChartTypeDrill[seriesKey[k]];
	                	        MarkerArray = (Axistype === "left") ? this.m_lineCalculation.leftAxisInfo.markerarray : this.m_lineCalculation.rightAxisInfo.markerarray;
	                	        var ZeroIndex = (MarkerArray.indexOf("0") == -1) ? ((MarkerArray.indexOf(0) == -1) ? "" : MarkerArray.indexOf(0)) : MarkerArray.indexOf("0");
	                	        if (ZeroIndex !== "") {
	                	            var ZeroAxisPosition = this.m_startY * 1 - this.m_yAxis.getYAxisDiv(MarkerArray) * ZeroIndex;
	                	            var ZeroAxisAvail = true;
	                	        } else {
	                	            var ZeroAxisAvail = false;
	                	        }
	                	        for (var i = 0; i < xpixcelLength; i++) {
	                	            var StackHeight1 = 0;
	                	            var StackHeight2 = 0;
	                	            pointRadius = (this.m_plotradiusarray[seriesKey[k]][i] > pointRadius) ? this.m_plotradiusarray[seriesKey[k]][i] : pointRadius;
	                	            if ((chartKey == "column")&&(this.m_columnSeries[seriesKey[k]]!==undefined)&&(this.m_columnSeries[seriesKey[k]].m_stackHeightArray[i] * 1 < drillMinStackHeight)) {
	                	                StackHeight1 = (this.m_columnSeries[seriesKey[k]].m_ySeriesData[i] * 1 < 0) ? (IsBoolean(this.m_basezero) ? 0 : drillMinStackHeight) : 0;
	                	                StackHeight2 = (this.m_columnSeries[seriesKey[k]].m_ySeriesData[i] * 1 < 0) ? 0 : drillMinStackHeight;
	                	            }
	                	            var xpixl1 = (chartKey == "line") ? (xpixcel[i] - pointRadius) : xpixcel[i];
	                	            var xpixl2 = (chartKey == "line") ? (xpixcel[i] * 1 + pointRadius) : xpixcel[i] + columnWidth;
	                	            if (ypixcel[i] === "") {
	                	                if (ZeroAxisAvail) {
	                	                    var ypixl1 = (chartKey == "line") ? (ZeroAxisPosition + this.m_plotradiusarray[seriesKey[k]][i] * 1) : (_.has(this.m_columnSeries, seriesKey[k])) ? ZeroAxisPosition  : 0;
	                	                    var ypixl2 = (chartKey == "line") ? (ZeroAxisPosition - pointRadius) : ZeroAxisPosition - StackHeight2;
	                	                } else {
	                	                	var Ypixel = (MarkerArray[0]*1 > 0) ? this.getStartY() : this.getEndY();
	                	                    StackHeight1 = (MarkerArray[0]*1 > 0) ? 0 : drillMinStackHeight;
	                	                    StackHeight2 = (MarkerArray[0]*1 > 0) ? drillMinStackHeight : 0;
	                	                    var ypixl1 = (chartKey == "line") ? (Ypixel + this.m_plotradiusarray[seriesKey[k]][i] * 1) : (_.has(this.m_columnSeries, seriesKey[k])) ? Ypixel + StackHeight1 : 0;
	                	                    var ypixl2 = (chartKey == "line") ? (Ypixel - pointRadius) : Ypixel - StackHeight2;
	                	                }
	                	            } else {
	                	                var ypixl1 = (chartKey == "line") ? (ypixcel[i] + this.m_plotradiusarray[seriesKey[k]][i] * 1) : (_.has(this.m_columnSeries, seriesKey[k])) ? ypixcel[i] + this.m_columnSeries[seriesKey[k]].m_stackHeightArray[i] + StackHeight1 : 0;
	                	                var ypixl2 = (chartKey == "line") ? (ypixcel[i] * 1 - pointRadius) : ypixcel[i] - StackHeight2;
	                	            }
	                	            if (mouseX <= (xpixl2 * 1) && mouseX >= (xpixl1 * 1) && mouseY <= ypixl1 && mouseY >= ypixl2) {
	                	                /*for (var k = 0; k < this.m_categoryData[0].length; k++) {
	                	                    if (this.m_categoryData[0][i] == this.m_categoryData[0][k])
	                	                        break;
	                	                }*/
	                	                var drillObj = this.getDrillData(startIndex, seriesKey[k], i);
	                	                Yposition = false;
	                	                isDrillIndexFound = true;
	                	                return drillObj;
	                	            }
	                	        }
	                	    }
	                	}
	                }
	                
	            }
	        }
	    }
	    if(this.m_columntype == "stacked" && !isDrillIndexFound) {
			   var xPositionsArray = this.m_lineCalculation.getxPositionTooltipArray();
			   var m_plotRadius = this.m_lineCalculation.columnWidth / 2;
				for (var k = 0, length = xPositionsArray.length; k < length; k++) {
					if (mouseX <= (xPositionsArray[k] * 1 + m_plotRadius) && (mouseX >= xPositionsArray[k] * 1 - m_plotRadius)) {
						var seriesKey = this.m_seriesNames;
						for(var l = 0,innerlength = seriesKey.length; l < innerlength; l++){
							var ypixcel = this.m_lineCalculation.getYPositionArray(seriesKey[l]);
							if(((mouseY >= ypixcel[k]) && (mouseY <= ypixcel[k] + this.m_drillminstackheight)) || ((mouseY <= ypixcel[k] +  this.m_columnSeries[seriesKey[l]].m_stackHeightArray[k])  && (mouseY >= ypixcel[k] - this.m_drillminstackheight))) {
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
	    /**Entire underlying area should be considered as drill data point*/
	    if((Yposition)&&(IsBoolean(this.m_fillarea))){for (var l = seriesKey.length - 1; l >= 0; l--) {
	        if (seriesKey[l] != "unique" && seriesKey[l] != "contains") {
	        	var MarkerArray = [];
	            var Axistype = this.m_seriesAxisDrill[seriesKey[l]];
	            var chartKey = this.m_seriesChartTypeDrill[seriesKey[l]];
	            MarkerArray = (Axistype === "left") ? this.m_lineCalculation.leftAxisInfo.markerarray : this.m_lineCalculation.rightAxisInfo.markerarray;
	            var ZeroIndex = (MarkerArray.indexOf("0") == -1) ? ((MarkerArray.indexOf(0) == -1) ? "" : MarkerArray.indexOf(0)) : MarkerArray.indexOf("0");
	            if (ZeroIndex !== "") {
	                var ZeroAxisPosition = this.m_startY * 1 - this.m_yAxis.getYAxisDiv(MarkerArray) * ZeroIndex;
	            } else {
	                var ZeroAxisPosition = true;
	            }
	            if (chartKey === "line") {
	                var xpixcel = this.m_lineCalculation.getXPositionArray(seriesKey[l]);
	                var ypixcel = this.m_lineCalculation.getYPositionArray(seriesKey[l]);
	                var xpixcelLength = xpixcel.length;
	                var m_plotRadius = (this.m_xAxis.m_xPositionData[1] !== undefined) ? (this.m_xAxis.m_xPositionData[1] - this.m_xAxis.m_xPositionData[0]) / 2 : (this.m_isfixedradius[seriesKey[l]]) ? (((this.m_plotradiusarray[seriesKey[l]][0] > pointRadius) ? this.m_plotradiusarray[seriesKey[l]][0] : pointRadius)) : pointRadius;
	                var startIndex = (IsBoolean(this.m_showslider)) ? (this.m_sliderLastIndex + 1) - xpixcelLength : 0;
	                for (var m = 0; m < xpixcelLength; m++) {
	                    var xpixl1 = xpixcel[m] * 1 - m_plotRadius;
	                    var xpixl2 = xpixcel[m] * 1 + m_plotRadius;

	                    if (mouseX <= (xpixl2 * 1) && mouseX >= (xpixl1 * 1)) {
	                        if ((IsBoolean(this.m_basezero) || (ZeroAxisPosition === true)) && (mouseY >= ypixcel[m] * 1)) {
	                            var drillObj = this.getDrillData(startIndex, seriesKey[l], m);
	                            return drillObj;
	                            break;
	                        } else if (!IsBoolean(this.m_basezero) && (map[chartKey][Axistype][seriesKey[l]] !== undefined) && (!isNaN(map[chartKey][Axistype][seriesKey[l]][m] * 1)) && (map[chartKey][Axistype][seriesKey[l]][m] * 1 >= 0) && (ZeroAxisPosition >= mouseY) && (mouseY >= ypixcel[m] * 1)) {
	                            var drillObj = this.getDrillData(startIndex, seriesKey[l], m);
	                            return drillObj;
	                            break;
	                        } else if (!IsBoolean(this.m_basezero) && (map[chartKey][Axistype][seriesKey[l]] !== undefined) && (!isNaN(map[chartKey][Axistype][seriesKey[l]][m] * 1)) && (map[chartKey][Axistype][seriesKey[l]][m] * 1 < 0) && (ZeroAxisPosition < mouseY) && (mouseY <= ypixcel[m] * 1)) {
	                            var drillObj = this.getDrillData(startIndex, seriesKey[l], m);
	                            return drillObj;
	                            break;
	                        }
	                    }

	                }
	            }

	        }
	    }
	  }
	}
};
/** @description Will return Drill Data Object **/
TimelineChart.prototype.getDrillData = function (startIndex, seriesKey ,i) {
	var fieldNameValueMap = this.getFieldNameValueMap(startIndex + i);
    /**Clicked color drills as the drill-color not series color.*/
    var drillColor = (IsBoolean(this.getShowPoint()) || (this.m_lineCalculation.xAxisData.length == 1)) ? this.m_PointsColorsArray[seriesKey][i] : this.getColorsForSeries()[seriesKey][i];
    var drillField = seriesKey;
    var drillDisplayField = this.m_seriesDisplayNamesMap[seriesKey];
    var drillValue = fieldNameValueMap[drillField];
    var drillCategory = this.m_categoryNames;
    var drillCategoriesValue=[]
    for(var j=0;j<drillCategory.length;j++){
    	drillCategoriesValue.push(fieldNameValueMap[drillCategory[j]]);
    }
    fieldNameValueMap.drillField = drillField;
    fieldNameValueMap.drillDisplayField = drillDisplayField;
    fieldNameValueMap.drillValue = drillValue;
	fieldNameValueMap.drillIndex = i;
	fieldNameValueMap.drillCategoryNames = drillCategory; 
	fieldNameValueMap.drillCategory = drillCategoriesValue;
	
    return {
        "drillRecord": fieldNameValueMap,
        "drillColor": drillColor
    };
}
/** @description Will find and return Tooltip data of TimeLine chart  **/
TimelineChart.prototype.getToolTipData = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory) && IsBoolean(this.isVisibleSeries()) && IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")) {
		var toolTipData;
		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			var xPositionsArray = this.m_lineCalculation.getxPositionTooltipArray();
			var m_plotRadius = this.m_lineCalculation.columnWidth / 2;
			var seriesData = (this.getSeriesData());
			var xPosArrayLength=xPositionsArray.length;
			for (var i = 0; i < xPosArrayLength; i++) {
				if (mouseX <= (xPositionsArray[i] * 1 + m_plotRadius) && (mouseX >= xPositionsArray[i] * 1 - m_plotRadius)) {
					toolTipData = {};
					if (this.m_customtextboxfortooltip.dataTipType == "Default") {
						toolTipData.cat = "";
						toolTipData["data"] = new Array();
						toolTipData.cat = this.getCategoryData()[0][i];
						var seriesLength=seriesData.length;
						for (var j = 0, k = 0; j < seriesLength; j++) {
							var newVal;
							if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[j]])) {
								var data = [];
								//data[0] = this.getSeriesColors()[this.m_seriesNames[j]];
								var toolTipColor = (IsBoolean(this.getShowPoint()) || (this.m_categoryData[0].length == 1)) ? this.m_PointsColorsArray[this.m_seriesNames[j]][i] : this.getColorsForSeries()[this.m_seriesNames[j]][i];
								data[0] = {"color":toolTipColor,"shape":this.legendMap[this.m_seriesNames[j]].shape};
								data[1] = this.getSeriesDisplayNames()[j];
								if (seriesData[j][i] == "" || isNaN(seriesData[j][i]) || seriesData[j][i] == null || seriesData[j][i] == "null") {
									newVal = seriesData[j][i];
								} else {
									var num = seriesData[j][i] * 1;
									if (num % 1 != 0 && this.m_tooltipprecision !== "default") {
										newVal = num.toFixed(this.m_tooltipprecision);
									} else {
										newVal = seriesData[j][i];
									}
								}
								var tempMap = {"seriesName":this.m_seriesNames[j],"axisType":this.legendMap[this.m_seriesNames[j]].axisType,"serVal":newVal}
								var FormterData = this.getUpdatedLeftRightAxisFormatterForToolTip(tempMap);
								data[2] = FormterData;
								if (this.m_columntype == "100%" && this.getSeriesDisplayNames().length > 1) 
								{
									var percentageData=this.getValuefromMap( this.getSeriesNames()[j],i);
									if (this.m_tooltipproperties.tooltippercentprecision == "auto") {
									    if (countDecimal((percentageData).toString()) == 0) {
									        data[3] = (percentageData) + "%";
									    } else {
									    	data[3] = (percentageData).toFixed(2);
									        if(data[3] % 1 == 0) {
									        	data[3] = (data[3] * 1).toFixed() + "%";
									        } else {
									        	data[3] = data[3] + "%";
									        }
									    }
									} else {
											data[3] = (percentageData).toFixed(this.m_tooltipproperties.tooltippercentprecision) + "%";
									}
								}
								/*if (IsBoolean(this.m_controlledtooltip)) {
									if (FormterData !== "")
										toolTipData.data.push(data);
								} else {*/
									toolTipData.data[k] = data;
									k++;
								//}
							}
						}
						toolTipData.highlightIndex = this.getDrillColor(mouseX, mouseY);
						if (IsBoolean(this.m_controlledtooltip)) {
							toolTipData = this.updateTooltipData(toolTipData);
						}
						break;
					} else {
						var startIndex = (IsBoolean(this.m_showslider)) ? (this.m_sliderLastIndex + 1) - xPosArrayLength : 0;
						toolTipData = this.getDataProvider()[startIndex + i];
					}
				}
			}
		} else {
			this.hideToolTip();
		}
		//Hovering on annotation DAS-972
		var xPositionsArray = this.m_lineCalculation.getxPositionTooltipArray();
		var xPosArrayLength = xPositionsArray.length;
			if (IsBoolean(this.m_showannotation)) {
				for (var j1 = 0; j1 < this.m_annotationXData.length; j1++) {
					if (this.m_annotationXData[j1] != "") {
						var hpoint = Math.round(this.m_annotationXData[j1].xposition * 1);
						if ((mouseX >= hpoint - this.m_annotationradius) && (mouseX <= hpoint + (this.m_annotationradius * 1)) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
							toolTipData = {};
							toolTipData.cat = "";
							toolTipData["data"] = new Array();
							var datepoint = this.m_annotationXData[j1].point.toString();
							var j1Year = this.getMonthYear(datepoint);
							toolTipData.cat = this.m_annotationtooltiptitle;
							if (this.m_annotationformat == 'year') {
								var filteredData = this.m_annotationXData
									.filter(data => {
										if (data !== "") {
											var dataYear = this.getMonthYear(data.point.toString());
											return dataYear.year === j1Year.year;
										}
										return false;
									});

								var labelarr = filteredData.map(data => data.label);
								var pointarr = filteredData.map(data => data.point);
							} else {
								var filteredData = this.m_annotationXData.filter(data =>{
									if (data){
										var dataMonth = this.getMonthYear(data.point.toString())
										return (dataMonth.mon === j1Year.mon && dataMonth.year === j1Year.year);
									}
									return false;
								});
								var labelarr = filteredData.map(data => data.label);
								var pointarr = filteredData.map(data => data.point);
							}
							for (var lab = 0, j3 = 0; lab < labelarr.length; lab++) {
								var data = [];
								data[0] = { "color": this.m_annotationcolor, "shape": "bubble"};
								data[1] = labelarr[lab];
								data[2] = Array.isArray(pointarr) ? pointarr[lab] : pointarr;
								toolTipData.data[j3] = data;
								j3++;
							}
							this.m_showannotationTooltip  = true;
							break;
						}
					}
				}
				
			}
		return toolTipData;
	}
};
TimelineChart.prototype.getMonthYear = function(dateStr) {
	var dateadta = [];
	/**check date format in dataset (mm/dd/yyyy, mm-dd-yyyy, dd/mm/yyyy, or dd-mm-yyyy) */
	var regex = /^(0[1-9]|1[0-2])[-/.](0[1-9]|[12][0-9]|3[01])[-/.](\d{4})$|^(0[1-9]|[12][0-9]|3[01])[-/.](0[1-9]|1[0-2])[-/.](\d{4})$/;;
	// Test if the date string matches the pattern
	var datesplit = dateStr.match(regex);
	if (datesplit) {
		var month = 0, day = 0, year = 0;
		if (datesplit[1] && datesplit[2] && datesplit[3]) {
			// mm/dd/yyyy or mm-dd-yyyy format
			month = datesplit[1];
			day = datesplit[2];
			year = datesplit[3];
		} else if (datesplit[4] && datesplit[5] && datesplit[6]) {
			// dd/mm/yyyy or dd-mm-yyyy format
			day = datesplit[4];
			month = datesplit[5];
			year = datesplit[6];
		}
	}else if (dateStr.match(/^\d{4}$/)){
		year = dateStr;
	}
	dateadta['mon'] = month;
	dateadta['day'] = day;
	dateadta['year'] = year;

	return dateadta;
};

/** @description Will return  changed DataMap. **/
TimelineChart.prototype.getValuefromMap = function (series, index) {
	for(var key in  this.changedDataMap){
		for(var key1 in this.changedDataMap[key]){
			for(var key2 in this.changedDataMap[key][key1]){
				if(key2==series){
					return (key1=="line")?0:this.changedDataMap[key][key1][key2][index];
				}
			}
		}
	}
};
/** @description Will calculate drill color for TimeLine chart  **/
TimelineChart.prototype.getDrillColor = function (mouseX, mouseY) {
	/*var map = this.seriesDataMap;
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory)))) {
		var columnWidth = this.m_lineCalculation.columnWidth / this.m_lineCalculation.totalColumn;
		var pointRadius = 5;
		if ((mouseX >= this.getStartX() && mouseX <= this.getEndX()) && (mouseY <= this.getStartY() && mouseY >= this.getEndY())) {
			for (var key in map) {
				for (key2 in map[key]) {
					var index = 0;
					for (var key1 in map[key][key2]) {
						if (key1 != "unique" && key1 != "contains") {
							var xpixcel = this.m_lineCalculation.getXPositionArray(key1);
							var ypixcel = this.m_lineCalculation.getYPositionArray(key1);
							var xpixcelLength=xpixcel.length;
							for (var i = 0; i < xpixcelLength; i++) {
								var xpixl1 = (key2 == "line") ? (xpixcel[i] - pointRadius) : xpixcel[i];
								var xpixl2 = (key2 == "line") ? (xpixcel[i] * 1 + pointRadius) : xpixcel[i] + columnWidth;
								var ypixl1 = (key2 == "line") ? (ypixcel[i] + pointRadius) : this.getStartY();
								var ypixl2 = (key2 == "line") ? (ypixcel[i] * 1 - pointRadius) : ypixcel[i];

								if (mouseX <= (xpixl2 * 1) && mouseX >= (xpixl1 * 1) && mouseY <= ypixl1 && mouseY >= ypixl2) {
									for (var k = 0; k < this.CatData[0].length; k++) {
										if (this.m_categoryData[0][i] == this.CatData[0][k])
											break;
									}
									return index;
								}
							}
							index++;
						}
					}
				}
			}
		}
	}*/
	
	//===========================================================================================
	var temp = this;
	var map = this.seriesDataMapForIndex;
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory)))) {
		var columnWidth;
		/**Added to resolve BDD-682 issue*/
		var drillMinStackHeight = (this.m_columntype == "stacked") ? 0 : this.m_drillminstackheight;
		if(this.m_columntype == "clustered"){
			columnWidth = (this.m_lineCalculation.columnWidth*this.clusteredbarpadding) / this.m_lineCalculation.totalColumn;
		}else{
			columnWidth = this.m_lineCalculation.columnWidth / this.m_lineCalculation.totalColumn;
		}
		var pointRadius = 5;
		if ((mouseX >= this.getStartX() && mouseX <= this.getEndX()) && (mouseY <= this.getStartY() && mouseY >= this.getEndY())) {
			for (var chartKey in map) {
				for (var axisKay in map[chartKey]) {
					var index = 0;
					if(this.m_columntype=="overlaid" && chartKey=="column"){
						var WidthArr=this.m_lineCalculation.overlaidColWidth[axisKay][chartKey];
						for(var seriesKeyindex in WidthArr)	{
							var xpixcel = this.m_lineCalculation.getXPositionArray(WidthArr[seriesKeyindex]);
							var ypixcel = this.m_lineCalculation.getYPositionArray(WidthArr[seriesKeyindex]);
							if(xpixcel != undefined && ypixcel != undefined){
								for (var i = 0, xpixcelLength = xpixcel.length; i < xpixcelLength; i++) {
									var xpixl1 = (chartKey == "line") ? (xpixcel[i] - pointRadius) : xpixcel[i];
									var xpixl2 = (chartKey == "line") ? (xpixcel[i] * 1 + pointRadius) : xpixcel[i] + this.m_lineCalculation.columnWidthMap[WidthArr[seriesKeyindex]];
									var ypixl1 = (chartKey == "line") ? (ypixcel[i] + pointRadius) : this.getStartY();
									var ypixl2 = (chartKey == "line") ? (ypixcel[i] * 1 - pointRadius) : ypixcel[i];
			
									if (mouseX <= (xpixl2 * 1) && mouseX >= (xpixl1 * 1) && mouseY <= ypixl1 && mouseY >= ypixl2) {
										/*for (var k = 0; k < this.m_categoryData[0].length; k++) {
											if (this.m_categoryData[0][i] == this.m_categoryData[0][k])
												break;
										}*/
										return (WidthArr.length-1-index);
									}
								}
							}
							index++;
						}
					}
					else
					{
						var seriesKey = this.m_seriesNames.filter(function(key){return temp.m_seriesVisibleArr[key]});
						for (var j = seriesKey.length - 1; j >=0; j--) {
							if (seriesKey[j] != "unique" && seriesKey[j] != "contains") {
								var xpixcel = this.m_lineCalculation.getXPositionArray(seriesKey[j]);
								var ypixcel = this.m_lineCalculation.getYPositionArray(seriesKey[j]);
								var xpixcelLength=xpixcel.length;
								var MarkerArray = [];
	                	        var Axistype = this.m_seriesAxisDrill[seriesKey[j]];
	                	        var chartKey = this.m_seriesChartTypeDrill[seriesKey[j]];
	                	        MarkerArray = (Axistype === "left") ? this.m_lineCalculation.leftAxisInfo.markerarray : this.m_lineCalculation.rightAxisInfo.markerarray;
	                	        var ZeroIndex = (MarkerArray.indexOf("0") == -1) ? ((MarkerArray.indexOf(0) == -1) ? "" : MarkerArray.indexOf(0)) : MarkerArray.indexOf("0");
	                	        if (ZeroIndex !== "") {
	                	            var ZeroAxisPosition = this.m_startY * 1 - this.m_yAxis.getYAxisDiv(MarkerArray) * ZeroIndex;
	                	            var ZeroAxisAvail = true;
	                	        } else {
	                	            var ZeroAxisAvail = false;
	                	        }
								for (var i = 0; i < xpixcelLength; i++) {
									 var StackHeight1 = 0;
		                	            var StackHeight2 = 0;
		                	            if ((chartKey == "column")&&(this.m_columnSeries[seriesKey[j]]!==undefined)&&(this.m_columnSeries[seriesKey[j]].m_stackHeightArray[i] * 1 < drillMinStackHeight)) {
		                	                StackHeight1 = (this.m_columnSeries[seriesKey[j]].m_ySeriesData[i] * 1 < 0) ? (IsBoolean(this.m_basezero) ? 0 : drillMinStackHeight) : 0;
		                	                StackHeight2 = (this.m_columnSeries[seriesKey[j]].m_ySeriesData[i] * 1 < 0) ? 0 : drillMinStackHeight;
		                	            }
									var xpixl1 = (chartKey == "line") ? (xpixcel[i] - this.m_plotradiusarray[seriesKey[j]][i] * 1) : xpixcel[i];
									var xpixl2 = (chartKey == "line") ? (xpixcel[i] * 1 + this.m_plotradiusarray[seriesKey[j]][i] * 1) : xpixcel[i] + columnWidth;
									if (ypixcel[i] === "") {
	                	                if (ZeroAxisAvail) {
	                	                    var ypixl1 = (chartKey == "line") ? (ZeroAxisPosition + this.m_plotradiusarray[seriesKey[j]][i] * 1) : (_.has(this.m_columnSeries, seriesKey[j])) ? ZeroAxisPosition  : 0;
	                	                    var ypixl2 = (chartKey == "line") ? (ZeroAxisPosition - pointRadius) : ZeroAxisPosition - StackHeight2;
	                	                } else {
	                	                	var Ypixel = (MarkerArray[0]*1 > 0) ? this.getStartY() : this.getEndY();
	                	                    StackHeight1 = (MarkerArray[0]*1 > 0) ? 0 : drillMinStackHeight;
	                	                    StackHeight2 = (MarkerArray[0]*1 > 0) ? drillMinStackHeight : 0;
	                	                    var ypixl1 = (chartKey == "line") ? (Ypixel + this.m_plotradiusarray[seriesKey[j]][i] * 1) : (_.has(this.m_columnSeries, seriesKey[j])) ? Ypixel + StackHeight1 : 0;
	                	                    var ypixl2 = (chartKey == "line") ? (Ypixel - pointRadius) : Ypixel - StackHeight2;
	                	                }
	                	            } else {
	                	            	var ypixl1 = (chartKey == "line") ? (ypixcel[i] + this.m_plotradiusarray[seriesKey[j]][i] * 1) : (_.has( this.m_columnSeries, seriesKey[j])) ? ypixcel[i] + this.m_columnSeries[seriesKey[j]].m_stackHeightArray[i] + StackHeight1 : 0;
										var ypixl2 = (chartKey == "line") ? (ypixcel[i] * 1 - this.m_plotradiusarray[seriesKey[j]][i] * 1) : ypixcel[i] - StackHeight2;
	                	            }
									if (mouseX <= (xpixl2 * 1) && mouseX >= (xpixl1 * 1) && mouseY <= ypixl1 && mouseY >= ypixl2) {
										/*for (var k = 0; k < this.m_categoryData[0].length; k++) {
											if (this.m_categoryData[0][i] == this.m_categoryData[0][k])
												break;
										}*/
										//return index;
										//return this.seriesIndexMap[axisKay][chartKey][seriesKey[j]]["seriesIndex"];
										return j;
									}
								}
								//index++;
							}
						}
					}
				}
			}
		}
	}
};

/** @description Initialize ScaleChart  **/
TimelineChart.prototype.initScaleChart = function (temp) {
	temp.m_y = 0;
	this.tempTitle = temp.m_title.m_showtitle;
	this.tempSubTitle = temp.m_subTitle.m_showsubtitle;
	temp.m_height = this.sliderMargin;
	temp.m_linewidth = 2;
	temp.m_title.m_showtitle = false;
	temp.m_subTitle.m_showsubtitle = false;
	temp.m_showmaximizebutton = false;
	temp.m_showgradient = false;
	temp.m_showrangeselector = false;
	
	temp.setCategorySeriesData();
	temp.setAllFieldsName();
	temp.setAllFieldsDisplayName();
	temp.setColorsForSeries();

	temp.registerDataInMap();
	temp.registerDateInMapForSeriesIndex();
	temp.calculateAxisMinMax();
	temp.initializeCalculationClass();
	temp.instanciateSeries(temp.seriesDataMap);

	if (!IsBoolean(temp.m_isEmptySeries))
		temp.initializeScaleLine(this.seriesDataMap);
};

/** @description Will draw the ScaleChart  **/
TimelineChart.prototype.drawScaleChart = function (temp) {
	temp.drawScaleLines();
	this.m_title.m_showtitle = this.tempTitle;
	this.m_subTitle.m_showsubtitle = this.tempSubTitle;
};

/** @description initialize Line and Column Series for Scale Chart  **/
TimelineChart.prototype.initializeScaleLine = function (map) {
	var columncount = 0;
	for (var key in map) {
		for (var key2 in map[key]) {
			for (var key1 in map[key][key2]) {
				if ((map[key][key2]).hasOwnProperty(key1)) {
					if (key2 == "column") {
						columncount++;
						this.m_columnSeries[key1] = new TimeLineColumns();
						this.m_columnSeries[key1].init(this.m_PointsColorsArray[key1], this.m_lineCalculation.getXPositionArray(key1), this.m_lineCalculation.getYPositionArray(key1), this.m_lineCalculation.getHeightArray(key1), (this.m_lineCalculation.columnWidth / this.m_lineCalculation.totalColumn), this, this.m_plotTrasparencyArray[key1],this.m_lineCalculation.seriesDataMap[key][key2][key1],false);
					} else {
						this.m_lineSeries[key1] = new SVGLineSeries();
						this.m_lineSeries[key1].init(this.getColorsForSeries()[key1], this.m_lineCalculation.getXPositionArray(key1), this.m_lineCalculation.getYPositionArray(key1), this.m_linewidth, this, 1, key1, this.m_lineWidthArray[key1], this.m_lineTypeArray[key1]);
					}
				}
			}
		}
	}
};

/** @description Draw Line and Column Series of Scale Chart  **/
TimelineChart.prototype.drawScaleLines = function () {
	var seriesLength=this.m_seriesNames.length;
	for (var i = 0; i < seriesLength; i++) {
		if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
			if (this.m_lineSeries[this.m_seriesNames[i]] == undefined) {
				this.createStackGroupForSlider(this.m_columnSeries[this.m_seriesNames[i]], "stackgrpslider", i, this.m_seriesNames[i]);
				this.m_columnSeries[this.m_seriesNames[i]].drawColumns(i);
			} else {
				this.createStackGroupForSlider(this.m_columnSeries[this.m_seriesNames[i]], "linegrpslider", i, this.m_seriesNames[i]);
				this.m_lineSeries[this.m_seriesNames[i]].drawLineSeries(i);
			}
		}
	}
};

/*
TimelineChart.prototype.updateDragChart = function (startx,starty,endx,endy) {

	var xpos=this.m_lineCalculation.getXPositionArray(this.m_seriesNames[0]);
	var newcategory =[];
	var newseries = [];
	newcategory[0]=[];
	for(var j=0;j<this.m_seriesData.length;j++)
	{
		newseries[j] = [];
	}
	for(var i=0;i<xpos.length;i++)
	{
		if(startx<xpos[i]*1 && endx>xpos[i]*1)
		{
			newcategory[0].push(this.m_categoryData[0][i]);
			for(var j=0;j<this.m_seriesData.length;j++)
			{
				newseries[j].push(this.m_seriesData[j][i]);
			}
		}
	}
	if(newcategory[0].length>2){
		this.m_categoryData = newcategory;
		this.m_seriesData = newseries;
		this.init();
		this.drawChart();
	}
	
};*/

/** @description This method use for Filter the data according to Selected Range (Slider) **/
TimelineChart.prototype.updateDragChartFromSlider = function (startx,endx) {
	if(!IsBoolean(this.updateflag)) {
		for(var index = 0, length = this.m_seriesNames.length; index < length; index++) {
			if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[index]])) {
				break;
			}
		}
		this.origonalXposition = this.m_lineCalculation.getXPositionArray(this.m_seriesNames[index]);
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
		if(startx<this.origonalXposition[i]*1 && endx>this.origonalXposition[i]*1) {
			newcategory[0].push(this.CatData[0][i]);
			for(var j = 0, innerLength = this.SerData.length;j < innerLength; j++) {
				newseries[j].push(this.SerData[j][i]);
				newseriesDataLabel[j].push(this.SerDataLabel[j][i]);
				newseriesConditionalColor[this.m_seriesNames[j]].push(this.m_conditionalcolorswithoutslider[this.m_seriesNames[j]][i]);
				newplotradiusarray[this.m_seriesNames[j]].push(this.PlotRadius[this.m_seriesNames[j]][i]);
				this.m_sliderLastIndex = i;
				this.m_sliderindexes[j].push(i);
			}
		}else if(this.origonalXposition[i]*1>endx){
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
/*TimelineChart.prototype.updateSeriesData = function (min, max) {
	var cat = [];
	var ser = [];
	cat[0] = [];
	// if(this.m_charttype!="timeseries"){
		var serDataLength=this.SerData.length;
		for (var i = 0; i <serDataLength; i++) {
			ser[i] = [];
			for (var j = min; j <= max; j++) {
				if (i == 0) {
					cat[i].push(this.CatData[i][j]);
				}
				ser[i].push(this.SerData[i][j]);
			}
		}
	// }
	// else{
		// var freqInMS = this.m_lineCalculation.getDataFrequencyInMS(this.CatData[0]);
		// var serDataLength= this.SerData.length;
		// for (var i = 0; i < serDataLength; i++) {
			// ser[i] = [];
			// var catdataLength=this.CatData[0].length;
			// for (var j = 0; j < catdataLength ; j++) {
				// if(new Date(this.CatData[0][j]).getTime()>=(new Date(this.CatData[0][0]).getTime()+freqInMS*min) && new Date(this.CatData[0][j]).getTime()<=(new Date(this.CatData[0][0]).getTime()+freqInMS*max)){
					// if (i == 0) {
						// cat[i].push(this.CatData[i][j]);
					// }
					// ser[i].push(this.SerData[i][j]);
				// }
				
			// }
		// }
	// }
	this.firstIndex = min;
	this.lastIndex = max;
	this.m_categoryData = cat;
	this.m_seriesData = ser;
};*/

/**************************** RangeSelector and Slider Implementation in Chart.js **********************************/

/** @description Setter Method for set startX  of TimeLine Chart. **/
TimelineChart.prototype.setStartX = function () {
	this.yaxisLabelFont = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
	this.yaxisDescriptionFont = this.m_yAxis.m_fontstyle + " " + this.m_yAxis.m_fontweight + " " + this.fontScaling(this.m_yAxis.m_fontsize) + "px " + selectGlobalFont(this.m_yAxis.m_fontfamily);
	/** Added to calculate margin ratio of multilines description text */
	var separatorSign = (IsBoolean(this.m_enablehtmlformate.yaxis)) ? "<br>" : "\\n";
	var descTextSpace = (this.m_yAxis.m_description !== "" && this.leftAxisInfo.markerarray.length > 0) ? this.fontScaling(this.m_yAxis.getFontSize()) * ((this.m_yAxis.m_description.split(separatorSign).length > 3) ? 2 : this.m_yAxis.m_description.split(separatorSign).length - 1) : 0;
	
	var btdm = this.getBorderToDescriptionMargin();
	var dm = this.getYAxisDescriptionMargin() + descTextSpace;
	var dtlm = this.getDescriptionToLabelMargin();
	var ltam = this.getLabelToAxisMargin();
	var lm = this.getYAxisLabelMargin();
	var testStartX = this.m_x * 1 + btdm * 1 + dm * 1 + dtlm * 1 + lm * 1 + ltam * 1;
	//console.log(testStartX +"==m_x:"+this.m_x*1 +"==btdm:"+ btdm*1 +"==dm:"+ dm*1 +"==dtlm:"+ dtlm*1 +"==lm:"+ lm*1 +"==ltam:"+ ltam*1) ;
	this.m_startX = 1 * testStartX;
	//this.m_startX = (this.m_startX < 30) ? 35 : this.m_startX;
	if(IsBoolean(this.getShowLegends()) && !IsBoolean(this.m_fixedlegend)  && (this.m_legendposition == "verticalLeftTop" || this.m_legendposition == "verticalLeftMiddle" || this.m_legendposition == "verticalLeftBottom")){
		this.m_startX = this.m_startX + (this.m_leftFloatingLegendMargin * this.minWHRatio());	
	}
};

/** @description will calculate Y-Axis Label Margin of Chart  **/
TimelineChart.prototype.getYAxisLabelMargin = function () {
	var lm = 0;
	var lfm = this.getLabelFormatterMargin();
	this.setLabelWidth();
	var lw = this.getLabelWidth();
	var lsm = this.getLabelSignMargin();
	var lpm = this.getLabelPrecisionMargin();
	var lsfm = this.getLabelSecondFormatterMargin();
	//console.log( lfm*1 +"="+ lw*1 +"="+ lsm*1 +"="+lpm*1 +"="+ lsfm*1 );
	lm = lfm * 1 + lw * 1 + lsm * 1 + lpm * 1 + lsfm * 1;
	return lm;
};

/** @description will provide the LabelFormaterMargin  **/
TimelineChart.prototype.getLabelFormatterMargin = function () {
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

/** @description calculating the Label width for largest Label  **/
TimelineChart.prototype.getLabelWidth = function () {
	return this.m_labelwidth;
};
/** @description calculating the Label width for largest Label  **/
TimelineChart.prototype.setLabelWidth = function () {
	this.m_labelwidth = 0;
	var maxSeriesVals = [];
	if (this.fontScaling(this.m_yAxis.m_labelfontsize) > 0) {
		for(var i = 0, length = this.leftAxisInfo.markerarray.length; i < length; i++){
			var maxSeriesVal = this.leftAxisInfo.markerarray[i];
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

/** @description calculating Label sign margin if data is -ve  **/
TimelineChart.prototype.getLabelSignMargin = function () {
	var lsm = 0;
	var msvw = 0;
	var minSeriesValue = this.leftAxisInfo.min;
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

/** @description will calculate Label Precision margin  **/
TimelineChart.prototype.getLabelPrecisionMargin = function () {
	var lpm = 0;
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

/** @description will calculate Label SecondFormatter margin  **/
TimelineChart.prototype.getLabelSecondFormatterMargin = function () {
	var lsfm = 0;
	if (!IsBoolean(this.m_fixedlabel)) {
		if (IsBoolean(this.m_yAxis.getLeftaxisFormater())) {
			if (this.getSecondaryFormater() != "none" && this.getSecondaryFormater() != "") {
				if (this.getSecondaryUnit() != "none" && this.getSecondaryUnit() != "") {
					if (this.getSecondaryUnit() != "auto") {
						var secondunit = this.m_util.getFormatterSymbol(this.getSecondaryFormater(), this.getSecondaryUnit());
					} else if (this.getSecondaryUnit() == "auto" && this.m_unit == "Rupees") {
						var secondunit = getNumberFormattedSymbol(this.leftAxisInfo.max * 1, this.m_unit);
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

/** @description Setter Method for set endX  of TimeLine Chart. **/
TimelineChart.prototype.setEndX = function () {
	var blm = this.getBorderToLegendMargin();
	var vlm = this.getVerticalLegendMargin();
	var sxm = this.getSecondAxisToXAxisMargin();
	var salf = this.getSecondAxisLabelFormatterMargin();
	var yad = this.getSecondYAxisDescriptionMargin();
	this.setLabelWidthForSecondAxis();
	var lwsa = this.getLabelWidthForSecondAxis();
	var raf = this.getLabelPrecisionMarginForSecondAxis();
	var lsfm = this.getLabelSecondFormatterMarginForSecondAxis();
	var sltam = this.getSecondAxisLabelToAxisMargin();
	
	this.m_rightAxisSpace = (blm * 1 + vlm * 1 + sxm * 1 + raf * 1 + yad * 1 + salf * 1 + lwsa * 1 + lsfm*1 + sltam*1);
	this.m_endX = 1 * (this.m_x) + 1 * (this.m_width) - 1 * (this.m_rightAxisSpace);
	this.m_endX = (this.m_endX < 35) ? 35 : this.m_endX;
	if(IsBoolean(this.getShowLegends()) && !IsBoolean(this.m_fixedlegend)  && (this.m_legendposition == "verticalRightTop" || this.m_legendposition == "verticalRightMiddle" || this.m_legendposition == "verticalRightBottom")){
		this.m_endX  = this.m_endX - (this.m_rightFloatingLegendMargin * this.minWHRatio());		
	}
};

/** @description return  Label PrecisionMargin For SecondAxis  **/
TimelineChart.prototype.getLabelPrecisionMarginForSecondAxis = function () {
	var lpm = 0;
	/**
	 * When axis is set as Auto, min marker is 500M and max marker is 3B, 
	 */
	if (this.m_secondaryaxissecondaryunit == "auto" && this.rightAxisInfo.markerarray.length > 0) {
		this.ctx.beginPath();
		this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
		var precisionText = ".0";
		lpm = this.ctx.measureText(precisionText).width;
		this.ctx.closePath();
	}
	return lpm;
};
/** @description return  Label Width For SecondAxis  **/
TimelineChart.prototype.getLabelWidthForSecondAxis = function () {
	return this.m_labelwidthsecondaxis;
};
/** @description margin for Legend icon **/
TimelineChart.prototype.getVerticalLegendMargin = function() {
	return (IsBoolean(this.getShowLegends()) && IsBoolean(this.m_fixedlegend)) ? 20 : (this.m_chartpaddings.rightLegendSpace*1 || 10);
};
/** @description return  Label Width For SecondAxis  **/
TimelineChart.prototype.setLabelWidthForSecondAxis = function () {
	this.m_labelwidthsecondaxis = 0;
	var maxSeriesVals = [];
	if (this.fontScaling(this.m_secondaryaxislabelfontsize) > 0) {
		for(var i = 0, length = this.rightAxisInfo.markerarray.length; i < length; i++){
		     var maxSeriesVal = this.rightAxisInfo.markerarray[i];
		     this.ctx.beginPath();
		     this.ctx.font = this.m_secondaryaxislabelfontstyle + " " + this.m_secondaryaxislabelfontweight + " " + this.fontScaling(this.m_secondaryaxislabelfontsize) + "px " + selectGlobalFont(this.m_secondaryaxislabelfontfamily);
		     this.ctx.closePath();
		     if (IsBoolean(this.m_secondaryaxisshow)) {
			  if (IsBoolean(this.m_yAxis.m_rightaxisformater)) {
					if (this.m_secondaryaxissecondaryunit != "none" && this.m_secondaryaxissecondaryunit != "") {
						secondunit = this.m_util.getFormatterSymbol(this.m_secondaryaxissecondaryformatter, this.m_secondaryaxissecondaryunit);
						if (this.m_secondaryaxissecondaryunit  == "auto" && this.m_secondaryaxisunit == "Rupees") {
							maxSeriesVal = getNumberFormattedNumericValue(maxSeriesVal * 1, this.m_secondaryaxisprecision, this.m_secondaryaxisunit);
						} else if (this.m_secondaryaxissecondaryunit == "auto") {
							maxSeriesVal = getNumberFormattedNumericValue(maxSeriesVal * 1);
						} else if (this.m_secondaryaxissecondaryunit !== "none") {
							maxSeriesVal = this.m_util.updateTextWithFormatter(maxSeriesVal, secondunit, this.m_secondaryaxisprecision);
						}
					}
				
				if(maxSeriesVal !== 0){
					if(this.m_secondaryaxisprecision !== "default")
					maxSeriesVal = this.m_yAxis.setPrecision(maxSeriesVal, this.m_secondaryaxisprecision);
				}
			  }
			  	maxSeriesVal = getFormattedNumberWithCommas(maxSeriesVal, this.m_secondaryaxisnumberformatter);
				this.ctx.beginPath();
				this.ctx.font = this.m_secondaryaxislabelfontstyle + " " + this.m_secondaryaxislabelfontweight + " " + this.fontScaling(this.m_secondaryaxislabelfontsize) + "px " + selectGlobalFont(this.m_secondaryaxislabelfontfamily);
				maxSeriesVals[i] =  this.ctx.measureText(maxSeriesVal).width;
				
				this.ctx.closePath();
			}
		}
		this.m_labelwidthsecondaxis = getMaxValueFromArray(maxSeriesVals);
	}
};

/** @description return  SecondAxis LabelFormatter Margin  **/
TimelineChart.prototype.getSecondAxisLabelFormatterMargin = function () {
	var lfm = 0;
	if (IsBoolean(this.m_secondaryaxisshow) && this.rightAxisInfo.markerarray.length > 0) {
		if (IsBoolean(this.m_yAxis.m_rightaxisformater)) {
			if (this.m_secondaryaxisunit != "none" && this.m_secondaryaxisunit != "") {
					var unit = this.m_util.getFormatterSymbol(this.m_secondaryaxisformater, this.m_secondaryaxisunit);
					this.ctx.beginPath();
					this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
					lfm = this.ctx.measureText(unit).width;
					this.ctx.closePath();
			}
		}
	}
	return lfm;
};

/** @description return  Label SecondFormatter Margin For SecondAxis   **/
TimelineChart.prototype.getLabelSecondFormatterMarginForSecondAxis = function () {
	var lsfm = 0;
	if (IsBoolean(this.m_yAxis.m_rightaxisformater) && this.rightAxisInfo.markerarray.length > 0) {
		if (this.m_secondaryaxissecondaryformatter != "none" && this.m_secondaryaxissecondaryformatter != "") {
			if (this.m_secondaryaxissecondaryunit != "none" && this.m_secondaryaxissecondaryunit != "") {
				if (this.m_secondaryaxissecondaryunit != "auto") {
					var secondunit = this.m_util.getFormatterSymbol(this.m_secondaryaxissecondaryformatter, this.m_secondaryaxissecondaryunit);
				} else if (this.m_secondaryaxissecondaryunit == "auto" && this.m_secondaryaxisunit == "Rupees") {
					var secondunit = getNumberFormattedSymbol(this.rightAxisInfo.max * 1, this.m_secondaryaxisunit);
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

/** @description setter Method for set startY position of chart  **/
TimelineChart.prototype.setStartY = function () {
	var chartYMargin = this.getChartMargin();
	/** Added to calculate margin ratio of multilines description text */
	var separatorSign = (IsBoolean(this.m_enablehtmlformate.xaxis)) ? "<br>" : "\\n";
	var descTextSpace = (this.m_xAxis.getDescription() != "") ? this.fontScaling(this.m_xAxis.getFontSize()) * ((this.m_xAxis.getDescription().split(separatorSign).length > 3) ? 2 : this.m_xAxis.getDescription().split(separatorSign).length - 1) : 0;
	this.m_startY = (this.m_y * 1) + (this.m_height * 1) - chartYMargin - this.getXAxisLabelMargin() - (this.getXAxisDescriptionMargin() + descTextSpace) - this.getHorizontalLegendMargin() - ((IsBoolean(this.m_showslider)) ? this.sliderMargin : 0);
	if(IsBoolean(this.getShowLegends()) && !IsBoolean(this.m_fixedlegend)  && (this.m_legendposition =="horizontalBottomLeft" || this.m_legendposition =="horizontalBottomCenter" || this.m_legendposition =="horizontalBottomRight") && !IsBoolean(this.scaleFlag)){
		this.m_startY = this.m_startY - (this.m_bottomFloatingLegendMargin * this.minWHRatio());
	}
	this.m_startY = (IsBoolean(this.scaleFlag)) ? (this.m_y * 1 + this.m_height * 1 - 4) : this.m_startY;
};

/** @description return  XAxis Label Margin   **/
TimelineChart.prototype.getXAxisLabelMargin = function () {
	var xAxislabelDescMargin=this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.5;
	var radians = this.m_xAxis.m_labelrotation * (Math.PI / 180); 
	if(IsBoolean(this.m_xAxis.getLabelTilted())){
		this.ctx.font=this.m_xAxis.getLabelFontWeight()+" "+this.fontScaling(this.m_xAxis.getLabelFontSize())+"px "+this.m_xAxis.getLabelFontFamily();
		//xAxislabelDescMargin=Math.abs(this.ctx.measureText(this.m_categoryData[0][0]).width * radians);
		for(var i = 1, length = this.m_categoryData[0].length; i < length; i++) {
			var markerWidth = Math.abs(this.ctx.measureText(this.m_categoryData[0][i]).width * radians);
			if(xAxislabelDescMargin < markerWidth)
				xAxislabelDescMargin=markerWidth;
		}
		if(xAxislabelDescMargin > this.m_height/4) {
			xAxislabelDescMargin=(this.m_xAxis.getLabelrotation()<=70)?(this.m_height/4-15):this.m_height/4;
		}
	} else{
		this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
		var xlm = this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.5;
		this.noOfRows = 1;
		xAxislabelDescMargin = (xlm) * this.noOfRows;
	}
	return xAxislabelDescMargin;
};


/** @description setter method for set NoOfRows for draw x-axis  Label   **/
TimelineChart.prototype.setNoOfRows = function () {
	this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + this.m_xAxis.m_labelfontfamily;
	var textWidth = this.ctx.measureText(this.m_categoryData[0][0]).width;
	var xDivision = (this.getEndX() - this.getStartX()) / this.m_categoryData[0].length;
	var noOfRow = 1;
	var catdataLength=this.m_categoryData[0].length;
	for (var i = 1; i < catdataLength; i++) {
		if (this.ctx.measureText(this.m_categoryData[0][i]).width > xDivision)
			noOfRow = 2;
	}
	if (IsBoolean(this.m_xAxis.getLabelTilted()))
		noOfRow = 1;
	return noOfRow;
};

/** @description return  XAxis Description Margin if description!=""  **/
TimelineChart.prototype.getXAxisDescriptionMargin = function () {
	var xAxisDescriptionMargin = 2;
	if (this.m_xAxis.getDescription() != "") {
		xAxisDescriptionMargin = this.fontScaling(this.m_xAxis.getFontSize()) * 1.5;
	}
	return xAxisDescriptionMargin;
};

/** @description setter method for set EndY position of chart   **/
TimelineChart.prototype.setEndY = function () {
	this.m_endY = (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1 + this.getRangeSelectorMargin() * 1) + this.getMarginForTooltip();
	if(IsBoolean(this.getShowLegends()) && !IsBoolean(this.m_fixedlegend)  && (this.m_legendposition =="horizontalTopLeft" || this.m_legendposition =="horizontalTopCenter" || this.m_legendposition =="horizontalTopRight") && !IsBoolean(this.scaleFlag)){
		this.m_endY = this.m_endY + (this.m_topFloatingLegendMargin * this.minWHRatio());
	}

};

/** @description return Title Margin if showTitle set to true **/
TimelineChart.prototype.getMarginForTitle = function () {
	var margin;
	if ((!IsBoolean(this.getShowGradient())) && (!IsBoolean(this.m_showmaximizebutton)) && (!IsBoolean(this.getTitle().m_showtitle))){
		if(IsBoolean(this.m_showsettingmenubutton) && !IsBoolean(this.scaleFlag)) {
			margin = (this.getTitleBarHeight() * 1 + this.getTitleToSubtitleMargin() * 1);	
		} else {
			margin = (IsBoolean(this.scaleFlag)) ? 4 : this.m_topcurvemargin/2;
		}
	} else {
		margin = (this.getTitleBarHeight() * 1 + this.getTitleToSubtitleMargin() * 1);
	}
	return margin;
};

/** @description return SubTitle Margin if showSubTitle set to true **/
TimelineChart.prototype.getMarginForSubTitle = function () {
	var margin;
	if (IsBoolean(this.m_subTitle.m_showsubtitle)){
		return (this.m_subTitle.getDescription() !== "") ? 
			(this.fontScaling(this.m_subTitle.getFontSize()) * 1.5 + this.getSubttitleToChartMargin() * 1 ): (10 * 1 + this.getSubttitleToChartMargin() * 1);
	} else {
		return this.m_topcurvemargin/2;
	}
};

/** @description return RangeSelector Margin if visiblity of RangeSelector set to true **/
TimelineChart.prototype.getRangeSelectorMargin = function () {
	if (IsBoolean(this.m_showrangeselector) && IsBoolean(this.m_showslider) && this.m_charttype == "timeseries")
		return this.rangedSelectorMargin;
	else
		return 0;
};

/** @description overwrite method because data arranged in map for timeLine chart **/
TimelineChart.prototype.getFieldNameValueMap = function (i) {
	var m_fieldNameValueMap = new Object();
	var fieldNameLength= this.getAllFieldsName().length;
	for (var l = 0; l < fieldNameLength; l++) {
		m_fieldNameValueMap[this.getAllFieldsName()[l]] = this.getDataProvider()[i][this.getAllFieldsName()[l]];
	}
	/*if(IsBoolean(this.m_drilltoggle)){
		this.m_drilltoggle = false;
	} else {
		this.m_drilltoggle = true;
	}*/
	return m_fieldNameValueMap;
};

/**************** *************************   Line Calculation   ************************/

/** @description constructor  method TimeLineCalculation  **/
function TimeLineCalculation() {
	this.startX;
	this.startY;
	this.endX;
	this.endY;
	this.marginX;

	this.xAxisData = [];
	this.yAxisData = [];
	this.xPositionArray = [];
	this.yPositionArray = [];

	this.xPositionMap = {};
	this.yPositionMap = {};
	this.heightMap = {};
	this.columnWidthMap = {};

	this.m_yAxisMarkersArray = [];
	this.m_numberOfMarkers = 6;
	this.basePoint = "";

	this.minDate = "";
	this.maxDate = "";
	this.columnWidth = "";
	this.columnGap = "";
	this.minSliderIndex="";
	this.maxSliderIndex="";
};

/** @description initialize the TimeLineCalculation  **/
TimeLineCalculation.prototype.init = function (chart, seriesData, index, categories, seriesDataMap) {
	this.m_chart = chart;
	this.index = index;
	this.startX = this.m_chart.getStartX();
	this.endX = this.m_chart.getEndX();
	this.startY = this.m_chart.getStartY();
	this.endY = this.m_chart.getEndY();

	this.xAxisData = categories[0];
	this.yAxisData = this.m_chart.getVisibleSeriesData(seriesData).seriesData;
	this.calculateMinMaxCategory(categories);

	this.seriesDataMap = seriesDataMap;
	this.leftAxisInfo = this.m_chart.leftAxisInfo;
	this.rightAxisInfo = this.m_chart.rightAxisInfo;
	this.totalColumn = (this.m_chart.m_columntype == "stacked"||this.m_chart.m_columntype == "100%" || this.m_chart.m_columntype == "overlaid") ? 1 : this.getTotalColumn(this.seriesDataMap);
	this.setColumnWidthGap();
	this.setXPositionTooltipArr(this.xAxisData);
	this.setYPositionArray(this.seriesDataMap);
	this.setXAnnotationPosition();
};

/** @description return TotalColumn in chart  **/
TimeLineCalculation.prototype.getTotalColumn = function (map) {
	var count = 0;
	for (var key in map) {
		for (var key2 in map[key]) {
			for (var key1 in map[key][key2]) {
				if (key2 == "column" && key1 != "contains" && key1 != "unique") {
					count++;
				}
			}
		}
	}
	return count;
};

/** @description will measure column width and column Gap **/
TimeLineCalculation.prototype.setColumnWidthGap = function (axis, axisData) {
	var drawingWidth = (this.endX - this.startX);
	if (this.m_chart.m_charttype !== "timeseries") {
		var onePart = drawingWidth / this.xAxisData.length;
		this.minSliderIndex=0;
		this.maxSliderIndex=this.xAxisData.length-1;
	} else {
		var maxDate = new Date(this.maxDate).getTime();
		maxDate = isNaN(maxDate) ? 0.001 : maxDate;
		var minDate = new Date(this.minDate).getTime();
		minDate = isNaN(minDate) ? 0 : minDate;
		var widthForOneMS = (drawingWidth) / (maxDate - minDate);
		var freqInMS = this.getDataFrequencyInMS(this.xAxisData);
		var onePart = widthForOneMS * freqInMS;
		widthForOneMS = (drawingWidth) / (maxDate - minDate + freqInMS);
		onePart = widthForOneMS * freqInMS;
		this.minSliderIndex=0;
		this.maxSliderIndex=parseInt(drawingWidth/onePart);
		/*
		if(this.getDateData() < this.xAxisData.length)
			var onePart = drawingWidth / this.getDateData();
		*/
	}
	this.onePartWidth = (isNaN(onePart)) ? drawingWidth : onePart;
	/*this.columnWidth = (this.onePartWidth * (this.m_chart.m_barsize)) / 100;
	this.columnGap = (this.onePartWidth * ((100 - this.m_chart.m_barsize) / 2)) / 100;*/
	if(this.m_chart.m_controlbarwidth  == "auto") {
		this.columnWidth = (this.onePartWidth * (this.m_chart.m_barwidth)) / 100;
		this.columnGap = (this.onePartWidth * ((100 - this.m_chart.m_barwidth) / 2)) / 100;
	} else {
		if (this.m_chart.m_controlbarwidth < this.onePartWidth) {
			this.columnWidth = this.m_chart.m_controlbarwidth;
			this.columnGap = (this.onePartWidth - this.m_chart.m_controlbarwidth)/2;
		} else {
			this.columnWidth = (this.onePartWidth * (this.m_chart.m_barwidth)) / 100;
			this.columnGap = (this.onePartWidth * ((100 - this.m_chart.m_barwidth) / 2)) / 100;
		}
	}	
};

/** @description return minimum frequency in miliseconds **/
TimeLineCalculation.prototype.getDataFrequencyInMS = function (xAxisData) {
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

/** @description setter method for Y-Positions of the series **/
TimeLineCalculation.prototype.setYPositionArray = function (map) {
	var columncount = 0;
	this.overlaidColWidth = {"left":{"column":[]},"right":{"column":[]}};
	for (var key in map) {
		var colSeries = 1;
		var previousWidth = "";
		var previousGape = "";
		for (var key2 in map[key]) {
			var WidthArr = [];
			for (var key1 in map[key][key2]) {
				if (key1 != "unique" && key1 != "contains") {
					if (key2 == "column") {
						if(this.m_chart.m_columntype == "overlaid") {
							previousWidth = (previousWidth != "") ? (previousWidth* 50)/100 : this.columnWidth;
							this.m_chart.columnGapeMap[key1] = (previousGape !=="") ? (previousGape*1+previousWidth/2) : 0;
							previousGape = this.m_chart.columnGapeMap[key1];
							this.columnWidthMap[key1] = (previousWidth);
							WidthArr.push({name:key1,value:previousWidth});
							colSeries++;
						} else {
							this.columnWidthMap[key1] = this.columnWidth/colSeries;
						}
						columncount++;
						this.heightMap[key1] = this.getHeightArr(key, map[key][key2][key1]);
					}
					var yPixcelArr = this.getYPositionArr(key, key2, map[key][key2][key1], key1, map);
					if (this.yPositionMap[key1] == undefined && yPixcelArr != undefined)
						this.yPositionMap[key1] = yPixcelArr;
					this.xPositionMap[key1] = this.getXPositionArr(key, key2, columncount, this.xAxisData, key1);
				}
			}
			if(key2 == "column" && this.m_chart.m_columntype == "overlaid"){
				WidthArr = WidthArr.reverse();
				var keyArray=[];
				for(var i = 0; i < WidthArr.length; i++) {
					keyArray.push(WidthArr[i].name);
				}
				WidthArr = keyArray;
				this.overlaidColWidth[key][key2] = WidthArr;
			}
		}
	}
};

/** @description return y-positions for a series **/
TimeLineCalculation.prototype.getYPositionArr = function (axis, charttype, seriesData, seriesName, dataMap) {
	var axisInfo = (axis == "left") ? this.leftAxisInfo : this.rightAxisInfo;
	var pixcel = (this.startY * 1 - (this.endY) * 1) / (axisInfo.max - axisInfo.min);
	/** add 1 in endY to resolve slider lineChart line break issue(when max is 50 & min is 0).*/
	pixcel = (IsBoolean(this.m_chart.scaleFlag)) ? (this.startY * 1 - (this.endY + 1) * 1) / (axisInfo.max - axisInfo.min):pixcel;
	var min = axisInfo.min;
	var max = axisInfo.max;
	/** Added for calculate fan chart stacked area  and 'result' series line*/
	if (this.m_chart.m_charttype === "fanchart" && this.m_chart.m_fanSeriesType[seriesName] !== "none") {
		if (this.m_chart.m_fanSeriesType[seriesName] === "result" || this.m_chart.m_fanSeriesType[seriesName] === "max") {
			var yparray = [];
			var seriesDataLength = seriesData.length;
			for (var j = 0; j < seriesDataLength ; j++) {
				if (seriesData[j] === "" || isNaN(seriesData[j]) || seriesData[j] == null || seriesData[j] == "NIL") {
					yparray[j] = "";
				} else {
					yparray[j] = (this.startY) - ((pixcel) * (seriesData[j] - min));
				}
			}
			return yparray;
		} else {
			this.getyPixelArrayForStacked(axis, charttype, seriesName, dataMap, pixcel, min, max);
		}
	} else {
		if ((this.m_chart.m_columntype == "stacked"||this.m_chart.m_columntype == "100%") && charttype == "column")
			this.getyPixelArrayForStacked(axis, charttype, seriesName, dataMap, pixcel, min, max);
		else {
			var yparray = [];
			var seriesDataLength = seriesData.length;
			for (var j = 0; j < seriesDataLength ; j++) {
				if (seriesData[j] === "" || isNaN(seriesData[j]) || seriesData[j] == null || seriesData[j] == "NIL") {
					yparray[j] = "";
				} else {
					if (charttype == "column" && seriesData[j] < 0) {
						yparray[j] = (this.startY) - ((pixcel) * (seriesData[j] - min) - (pixcel * seriesData[j]));
					} else
						yparray[j] = (this.startY) - ((pixcel) * (seriesData[j] - min));
				}
			}
			return yparray;
		}
	}
};

/** @description will calculate y-pixcels for stack chart **/
TimeLineCalculation.prototype.getyPixelArrayForStacked = function (axis, charttype, seriesName, dataMap, pixcel, min, max) {
	var dataArr = [];
	var keysArr = [];
	for (var key4 in dataMap[axis][charttype]) {
		if (key4 != "unique" && key4 != "contains") {
			if (this.m_chart.m_charttype === "fanchart") {
				if (this.m_chart.m_fanSeriesType[key4] === "fan" || this.m_chart.m_fanSeriesType[key4] === "min") {
					keysArr.push(key4);
					dataArr.push(dataMap[axis][charttype][key4]);
				}
			} else {
				keysArr.push(key4);
				dataArr.push(dataMap[axis][charttype][key4]);
			}
		}
	}
	var yparray = [];
	var positivePointerArray = [];
	var negativePointerArray = [];
	var dataArrLength=dataArr.length;
	for (var i = 0; i < dataArrLength; i++) {
		yparray[i] = [];
		positivePointerArray[i] = [];
		negativePointerArray[i] = [];
		var dataLength=dataArr[i].length;
		for (var j = 0; j < dataLength; j++) {
			if (isNaN(dataArr[i][j]))
				dataArr[i][j] = "";
			if (i == 0) {
				if (dataArr[i][j] * 1 >= 0) {
					if (max * 1 > 0)
						yparray[i][j] = this.m_chart.getStartY() + (pixcel * min) - (pixcel * dataArr[i][j]);
					else
						yparray[i][j] = ((this.m_chart.getStartY()) - (pixcel) * ((dataArr[i][j]))) + (pixcel) * min;

					positivePointerArray[i][j] = yparray[i][j];
					negativePointerArray[i][j] = (this.m_chart.getStartY()) * 1 + (pixcel) * min;
				} else {
					yparray[i][j] = ((this.m_chart.getStartY()) + (pixcel) * min);
					negativePointerArray[i][j] = yparray[i][j] - (pixcel * dataArr[i][j]);
					positivePointerArray[i][j] = (this.m_chart.getStartY()) * 1 + (pixcel) * min;
				}
			} else {
				if (dataArr[i][j] >= 0) {
					positivePointerArray[i][j] = positivePointerArray[i - 1][j];
					negativePointerArray[i][j] = negativePointerArray[i - 1][j];
					yparray[i][j] = (positivePointerArray[i][j] - (pixcel * dataArr[i][j]));
					positivePointerArray[i][j] = yparray[i][j] * 1;
				} else {
					negativePointerArray[i][j] = negativePointerArray[i - 1][j];
					positivePointerArray[i][j] = positivePointerArray[i - 1][j];
					yparray[i][j] = (negativePointerArray[i][j] * 1);
					negativePointerArray[i][j] = yparray[i][j] * 1 - (pixcel * dataArr[i][j]);
				}
			}
		}
		if (this.yPositionMap[keysArr[i]] == undefined)
			this.yPositionMap[keysArr[i]] = yparray[i];
	}
};

/** @description return pixcels ratio **/
TimeLineCalculation.prototype.getXAxisPixel = function (axis) {
	if (this.m_chart.m_charttype == "timeseries") {
		var maxDate = new Date(this.maxDate).getTime();
		maxDate = isNaN(maxDate) ? 0.001 : maxDate;
		var minDate = new Date(this.minDate).getTime();
		minDate = isNaN(minDate) ? 0 : minDate;
		var xaxisRatio = (this.endX - this.startX - this.onePartWidth) / (maxDate - minDate);
	} else
		var xaxisRatio = (this.endX - this.startX) / (this.xAxisData.length - 1);
	return xaxisRatio;
};

/** @description calculate the x-pixcels for tooltip purpose **/
TimeLineCalculation.prototype.setXPositionTooltipArr = function (categoryData) {
	this.xPositionTooltipArray = [];
	var catDataLength = categoryData.length;
	for (var i = 0; i < catDataLength; i++) {
		if (this.m_chart.m_charttype == "timeseries") {
			if (categoryData.length == 1)
				this.xPositionTooltipArray[i] = (this.startX * 1) + this.onePartWidth / 2;
			else {
				var minDate = new Date(this.minDate).getTime();
				minDate = isNaN(minDate) ? 0 : minDate;
				var categoryDate = new Date(categoryData[i]).getTime();
				categoryDate = isNaN(categoryDate) ? 0 : categoryDate;
				this.xPositionTooltipArray[i] = this.startX * 1 + ((categoryDate - minDate) * this.getXAxisPixel()) + this.onePartWidth / 2;
			}
		} else {
			this.xPositionTooltipArray[i] = this.startX * 1 + (this.onePartWidth * i + this.onePartWidth / 2);
		}
	}
};
/** @description Setter method for set onepart width on x-axis **/
TimeLineCalculation.prototype.setXAxisAnnotationOnePart= function(){
	this.onePartAnnotationWidth = (this.endX-this.startX)/(1);
};
/** @description Setter method for set  XPositions Array . **/
TimeLineCalculation.prototype.setXAnnotationPosition = function(){
	this.xannotationPosArray=[];
	var xa = [];
	for(var i = 0, length = this.xAxisData.length; i < length; i++){
		if(this.xAxisData.length == 1){
			this.xannotationPosArray[i] = (this.startX*1)+(this.endX-this.startX)/2;
		} else {
			this.xannotationPosArray[i] = this.startX * 1 + (this.onePartWidth * i + this.onePartWidth / 2);
			xa[i] = this.startX*1 + (this.onePartWidth/2) + (i*this.onePartWidth);
		}
	}
};
/** @description return x-positions Array  **/
TimeLineCalculation.prototype.getXPositionArr = function (axis, charttype, count, categoryData, seriesKey) {
	count = (this.m_chart.m_columntype == "stacked"||this.m_chart.m_columntype == "100%" || this.m_chart.m_columntype == "overlaid") ? 1 : count;
	var xPositionArray = [];
	var clusteredBarPadding = ((this.columnWidth / this.totalColumn)*(1 - this.m_chart.clusteredbarpadding))/2;
	var catDataLength = categoryData.length;
	for (var i = 0; i < catDataLength; i++) {
		if (this.m_chart.m_charttype == "timeseries") {
			if (categoryData.length == 1) {
				if (charttype == "line") {
					xPositionArray[i] = (this.startX * 1) + this.onePartWidth / 2;
				} else if (this.m_chart.m_columntype == "overlaid") {
					xPositionArray[i] = this.startX * 1 + this.columnGap * (2 * i + 1) + (this.columnWidth * i) + ((this.columnWidth / this.totalColumn) * (count - 1) + this.m_chart.columnGapeMap[seriesKey]);
				} else if (this.m_chart.m_columntype == "clustered"){
					xPositionArray[i] = this.startX * 1 + this.columnGap * 1 + ((this.columnWidth / this.totalColumn) * (count - 1)) + clusteredBarPadding;
				} else {
					xPositionArray[i] = this.startX * 1 + this.columnGap * 1 + ((this.columnWidth / this.totalColumn) * (count - 1));
				}
			} else {
				if (categoryData[i] != "") {
					var minDate = new Date(this.minDate).getTime();
					minDate = isNaN(minDate) ? 0 : minDate;
					var categoryDate = new Date(categoryData[i]).getTime();
					categoryDate = isNaN(categoryDate) ? 0 : categoryDate;
					if (charttype == "line") {
						xPositionArray[i] = this.startX * 1 + ((categoryDate - minDate) * this.getXAxisPixel()) + this.onePartWidth / 2;
					} else if(this.m_chart.m_columntype == "overlaid"){
						xPositionArray[i] = this.startX * 1 + ((categoryDate - minDate) * this.getXAxisPixel()) + this.columnGap * 1 + ((this.columnWidth / this.totalColumn) * (count - 1) + this.m_chart.columnGapeMap[seriesKey]) ;
					} else if(this.m_chart.m_columntype == "clustered"){
						xPositionArray[i] = this.startX * 1 + ((categoryDate - minDate) * this.getXAxisPixel()) + this.columnGap * 1 + ((this.columnWidth / this.totalColumn) * (count - 1)) + clusteredBarPadding;
					}  else {
						xPositionArray[i] = this.startX * 1 + ((categoryDate - minDate) * this.getXAxisPixel()) + this.columnGap * 1 + ((this.columnWidth / this.totalColumn) * (count - 1));
					}
				}
			}
		} else {
			if (charttype == "line") {
				xPositionArray[i] = this.startX * 1 + (this.onePartWidth * i + this.onePartWidth / 2);
			} else if (this.m_chart.m_columntype == "overlaid") {
				xPositionArray[i] = this.startX * 1 + this.columnGap * (2 * i + 1) + (this.columnWidth * i) + ((this.columnWidth / this.totalColumn) * (count - 1) + this.m_chart.columnGapeMap[seriesKey]);
			} else if(this.m_chart.m_columntype == "clustered"){
				xPositionArray[i] = this.startX * 1 + this.columnGap * (2 * i + 1) + (this.columnWidth * i) + ((this.columnWidth / this.totalColumn) * (count - 1)) + clusteredBarPadding;
			} else {
				xPositionArray[i] = this.startX * 1 + this.columnGap * (2 * i + 1) + (this.columnWidth * i) + ((this.columnWidth / this.totalColumn) * (count - 1));
			}
		}
	}
	return xPositionArray;
};

/** @description method will calculate and return height array **/
TimeLineCalculation.prototype.getHeightArr = function (axis, seriesData) {
	var axisInfo = (axis == "left") ? this.leftAxisInfo : this.rightAxisInfo;
	var pixcel = (this.startY * 1 - this.endY * 1) / (axisInfo.max - axisInfo.min);
	/** add 1 in endY to resolve slider lineChart line break issue(when max is 50 & min is 0).*/
	pixcel = (IsBoolean(this.m_chart.scaleFlag)) ? (this.startY * 1 - (this.endY + 1) * 1) / (axisInfo.max - axisInfo.min): pixcel;
	var min = axisInfo.min;

	var stackHeightArray = [];
	var serDataLength=seriesData.length;
	for (var j = 0; j < serDataLength; j++) {
		if (seriesData[j] === "" || isNaN(seriesData[j]) || seriesData[j] == null || seriesData[j] == "NIL") {
			stackHeightArray[j] = "";
		} else {
			var value = seriesData[j];
			stackHeightArray[j] = Math.abs(pixcel * (value));
		}
	}
	return stackHeightArray;
};

/** @description return y-positions array according to series. **/
TimeLineCalculation.prototype.getYPositionArray = function (key) {
	return this.yPositionMap[key];
};

/** @description return x-positions array according to series. **/
TimeLineCalculation.prototype.getXPositionArray = function (key) {
	return this.xPositionMap[key];
};

/** @description return height array according to series. **/
TimeLineCalculation.prototype.getHeightArray = function (key) {
	return this.heightMap[key];
};

/** @description return x-positions for tooltip. **/
TimeLineCalculation.prototype.getxPositionTooltipArray = function () {
	return this.xPositionTooltipArray;
};

/** @description return y-axis text .**/
TimeLineCalculation.prototype.getYAxisText = function () {
	return this.leftAxisInfo.markertext;
};

/** @description return y-axis marker array . **/
TimeLineCalculation.prototype.getYAxisMarkersArray = function () {
	return this.leftAxisInfo.markerarray;
};
/** @description Setter method for set Closest Value for X Point annotation . **/
TimeLineCalculation.prototype.findClosestNumber = function(arr, target){
  var closest = arr[0];
  var closestIndex = 0;
  const dataYear = new Date(arr[0].toString()).getFullYear();
  var smallestDifference = Math.abs(dataYear - target);
  for (var i = 1; i < arr.length; i++) {
    var currentDifference = Math.abs(arr[i] - target);
    if (currentDifference < smallestDifference) {
      smallestDifference = currentDifference;
      closest = arr[i];
      closestIndex = i;
    }
  }
  return { closest, closestIndex };
}
/** @description Setter method for set Closest Value for X Point annotation . **/
TimeLineCalculation.prototype.checkIndexOfData = function(target){
	var dataIndex=-1;
	var arr = this.m_chart.m_lineCalculation.xAxisData;
  for (var i = 0; i < arr.length; i++) {
	  var dataYear = this.m_chart.getMonthYear(arr[i].toString());
	  if(dataYear.year == target)
	  dataIndex = i;
  }
  return dataIndex;
};
/** @description will calculate the minimum and maximum category for timeseries **/
TimeLineCalculation.prototype.calculateMinMaxCategory = function (allCategories) {
	var dates = [];
	for (var i = 0; i < allCategories.length; i++) {
		var catDataLength = allCategories[i].length;
		for (var j = 0; j < catDataLength; j++) {
			if (allCategories[i][j] != "")
				dates.push(new Date(allCategories[i][j]));
		}
	}
	this.maxDate = new Date(Math.max.apply(null, dates));
	this.minDate = new Date(Math.min.apply(null, dates));
};

/**************************** X-Position *************************************/
/** @description return x-axis marker array **/
TimeLineCalculation.prototype.getXAxisMarkersArray = function () {
	if (this.m_chart.m_charttype == "timeseries") {
		this.setXAxisMarkerForTimeLine();
	} else {
		this.setXAxisMarkerforAdvanceLine();
	}
	return this.m_xAxisMarkersArray;
};

/** @description setter method for x-axis marker of AdvanceLine chart. **/
TimeLineCalculation.prototype.setXAxisMarkerforAdvanceLine = function () {
	var stepValue = 1;
	if(this.m_chart.m_xAxis.m_xaxismarkers == "auto") {
		if (!IsBoolean(this.m_chart.m_fixedrange) || IsBoolean(this.m_chart.m_designMode)) {
			if (this.xAxisData.length > 10)
				stepValue = Math.ceil(this.xAxisData.length / 10);
		}
	}
	this.m_xAxisMarkersArray = [];
	this.xPositionForMarker = [];
	var noOfMarker = this.xAxisData.length;
	for (var i = 0; i < noOfMarker; ) {
		var x = this.startX * 1 + (this.onePartWidth * i + this.onePartWidth / 2);
		this.m_xAxisMarkersArray.push(this.xAxisData[i]);
		this.xPositionForMarker.push(x);
		i = ((i * 1) + stepValue);
	}
};

/** @description return x-position for marker **/
TimeLineCalculation.prototype.getXAxisPositionForMarkers = function () {
	return this.xPositionForMarker;
};

/*******Calculation for TimeSeries Scale**********/
/** @description setter method for set  XAxisMarker For TimeLine  **/
TimeLineCalculation.prototype.setXAxisMarkerForTimeLine = function () {
	if (this.xAxisData.length == 1) {
		this.m_xAxisMarkersArray = [];
		this.xPositionForMarker = [];
		this.m_xAxisMarkersArray[0] = this.xAxisData[0];
		this.xPositionForMarker[0] = (this.startX * 1) + (this.endX - this.startX) / 2;
	} else {

		this.dataFrequency = (this.xAxisData.length > 1) ? this.getDataFrequency(this.xAxisData) : "year";
		var totalNoOfDay = this.getDateData();
		var scaleFormate = this.getTimeLineMarkerFormateAndStep(totalNoOfDay);
		var firstDate = new Date(this.xAxisData[0]).getTime();
		var xAxisDataLength=this.xAxisData.length;
		var lastDate = this.xAxisData[xAxisDataLength - 1];
		for (var i = (xAxisDataLength - 1); i > 0; i--) {
			if (this.xAxisData[i] != "") {
				lastDate = this.xAxisData[i];
				break;
			}
		}
		lastDate = new Date(lastDate).getTime();
		var xAxisArr = [];
		var xPositionArr = [];
		for (i = firstDate; i <= lastDate; ) {
			var data = this.getFormattedDateTime(i, scaleFormate.formate, scaleFormate.step);
			if (data.textData != "") {
				xAxisArr.push(data.textData);
				var minDate = new Date(this.minDate).getTime();
				minDate = isNaN(minDate) ? 0 : minDate;
				xPositionArr.push(this.startX * 1 + ((i - minDate) * this.getXAxisPixel()) + this.onePartWidth / 2);
			}
			i = data.index;
		}
		this.m_xAxisMarkersArray = xAxisArr;
		this.xPositionForMarker = xPositionArr;
	}
};

/** @description return total no of days between first and last date.  **/
TimeLineCalculation.prototype.getDateData = function () {
	this.xAxisData.length;
	var startDay = new Date(isNaN(this.xAxisData[0]) ? this.xAxisData[0] : this.xAxisData[0] * 1);
	var xAxisDataLength= this.xAxisData.length ;
	var endIndex = (xAxisDataLength - 1);
	for (var i = (xAxisDataLength - 1); i > 0; i--) {
		if (this.xAxisData[i] != "") {
			endIndex = i;
			break;
		}
	}
	var endDay = new Date(isNaN(this.xAxisData[endIndex]) ? this.xAxisData[endIndex] : this.xAxisData[endIndex] * 1);
	var millisecondsPerDay = 1000 * 60 * 60 * 24;

	var millisBetween = endDay.getTime() - startDay.getTime();
	var days = millisBetween / millisecondsPerDay;
	return (Math.floor((days > 1) ? days : 1));
};

/** @description return the frequency of data it may be ("year" or "month" or "day"or "hour")  **/
TimeLineCalculation.prototype.getDataFrequency = function (xAxisData) {
	var date1 = new Date(isNaN(xAxisData[0]) ? xAxisData[0] : (xAxisData[0] * 1));
	var date2 = new Date(isNaN(xAxisData[1]) ? xAxisData[1] : (xAxisData[1] * 1));
	var minDiff = Math.abs(Math.floor(date1.getTime() - date2.getTime()));
	var xAxisDataLength= xAxisData.length ;
	for (var i = 0; i < xAxisDataLength; i++) {
		if (i >= 1) {
			var date1 = new Date(isNaN(xAxisData[i - 1]) ? xAxisData[i - 1] : (xAxisData[i - 1] * 1));
			var date2 = new Date(isNaN(xAxisData[i]) ? xAxisData[i] : (xAxisData[i] * 1));
			var diff = Math.abs(Math.floor(date1.getTime() - date2.getTime()));
			if (minDiff === 0 && diff !== 0)
				minDiff = diff;
			minDiff = (diff < minDiff && diff != 0) ? diff : minDiff;
		}
	}
	minDiff = (minDiff == 0) ? 0.001 : minDiff;

	var day = 1000 * 60 * 60 * 24;
	var hour = 1000 * 60 * 60;
	var minute = 1000 * 60;

	var days = Math.floor(minDiff / day);
	var months = Math.floor(days / 28);
	var years = Math.floor(months / 12);
	var hours = Math.floor(minDiff / hour);
	var minutes = (minDiff / minute) - 60 * hours;

	var message = {};
	message["year"] = years;
	message["month"] = months;
	message["day"] = days;
	message["hour"] = hours;
	message["minute"] = minutes;

	if (years > 0)
		return "year";
	if (months > 0)
		return "month";
	if (days > 0)
		return "day";
	if (hours > 0)
		return "hour";
	if (minutes > 0)
		return "minute";

};

/** @description return formated marker for a step  **/
TimeLineCalculation.prototype.getTimeLineMarkerFormateAndStep = function (days) {
	if (this.dataFrequency == "minute")
		return this.getFormateAndStepsforMin(days);
	else if (this.dataFrequency == "hour")
		return this.getFormateAndStepsforHour(days);
	else if (this.dataFrequency == "day")
		return this.getFormateAndStepsforDay(days);
	else if (this.dataFrequency == "month")
		return this.getFormateAndStepsforMonth(days);
	else if (this.dataFrequency == "year")
		return this.getFormateAndStepsforYear(days);
};

/** @description return formate and step if frequency in year.  **/
TimeLineCalculation.prototype.getFormateAndStepsforYear = function (days) {
	if (days < 2920)
		return {
			formate : "year",
			step : 1
		};
	else if (days >= 2920 && days < 5840) {
		return {
			formate : "year",
			step : 2
		};
	} else if (days >= 5840 && days < 14600) {
		return {
			formate : "year",
			step : 5
		};
	} else if (days >= 14600 && days < 29200) {
		return {
			formate : "year",
			step : 10
		};
	} else
		return {
			formate : "year",
			step : 25
		};
};

/** @description return formate and step if frequency in Month.  **/
TimeLineCalculation.prototype.getFormateAndStepsforMonth = function (days) {
	if (days < 240) {
		return {
			formate : "month",
			step : 1
		};
	} else if (days >= 240 && days < 365) {
		return {
			formate : "month",
			step : 2
		};
	} else if (days >= 365 && days < 730) {
		return {
			formate : "month",
			step : 3
		};
	} else if (days >= 730 && days < 1460) {
		return {
			formate : "month",
			step : 6
		};
	} else if (days >= 1460 && days < 2920) {
		return {
			formate : "year",
			step : 1
		};
	} else if (days >= 2920 && days < 5840) {
		return {
			formate : "year",
			step : 2
		};
	} else if (days >= 5840 && days < 14600) {
		return {
			formate : "year",
			step : 5
		};
	} else if (days >= 14600 && days < 43800) {
		return {
			formate : "year",
			step : 10
		};
	} else
		return {
			formate : "year",
			step : 25
		};
};

/** @description return formate and step if frequency in Day.  **/
TimeLineCalculation.prototype.getFormateAndStepsforDay = function (days) {
	if (days < 10) {
		return {
			formate : "day",
			step : 1
		};
	} else if (days >= 10 && days < 20) {
		return {
			formate : "day",
			step : 2
		};
	} else if (days >= 20 && days < 28) {
		return {
			formate : "day",
			step : 3
		};
	} else if (days >= 28 && days < 70) {
		return {
			formate : "day",
			step : 7
		};
	} else if (days >= 70 && days < 140) {
		return {
			formate : "day",
			step : 14
		};
	} else if (days >= 140 && days < 280) {
		return {
			formate : "month",
			step : 1
		};
	} else if (days >= 280 && days < 365) {
		return {
			formate : "month",
			step : 2
		};
	} else if (days >= 365 && days < 730) {
		return {
			formate : "month",
			step : 3
		};
	} else if (days >= 730 && days < 1460) {
		return {
			formate : "month",
			step : 6
		};
	} else if (days >= 1460 && days < 2920) {
		return {
			formate : "year",
			step : 1
		};
	} else
		return {
			formate : "year",
			step : 4
		};
};

/** @description return formate and step if frequency in Min.  **/
TimeLineCalculation.prototype.getFormateAndStepsforMin = function (days) {
	if (days < 1) {
		return {
			formate : "hour",
			step : 3
		};
	} else if (days >= 1 && days < 2) {
		return {
			formate : "hour",
			step : 8
		};
	} else if (days >= 2 && days < 4) {
		return {
			formate : "hour",
			step : 12
		};
	} else if (days < 28) {
		var step = (days > 7) ? 2 : 1;
		if (days > 20)
			step = 3;
		return {
			formate : "day",
			step : step
		};
	} else if (days >= 28 && days < 70) {
		return {
			formate : "day",
			step : 7
		};
	} else if (days >= 70 && days < 140) {
		return {
			formate : "day",
			step : 14
		};
	} else if (days >= 140 && days < 280) {
		return {
			formate : "month",
			step : 1
		};
	} else if (days >= 280 && days < 365) {
		return {
			formate : "month",
			step : 2
		};
	} else if (days >= 365 && days < 730) {
		return {
			formate : "month",
			step : 3
		};
	} else if (days >= 730 && days < 1460) {
		return {
			formate : "month",
			step : 6
		};
	} else if (days >= 1460 && days < 2920) {
		return {
			formate : "year",
			step : 1
		};
	} else
		return {
			formate : "year",
			step : 4
		};
};

/** @description return formate and step if frequency in Hour.  **/
TimeLineCalculation.prototype.getFormateAndStepsforHour = function (days) {
	if (days < 1) {
		return {
			formate : "hour",
			step : 3
		};
	} else if (days >= 1 && days < 2) {
		return {
			formate : "hour",
			step : 8
		};
	} else if (days >= 2 && days < 4) {
		return {
			formate : "hour",
			step : 12
		};
	} else if (days < 28) {
		var step = (days > 7) ? 2 : 1;
		if (days > 20)
			step = 3;
		return {
			formate : "day",
			step : step
		};
	} else if (days >= 28 && days < 70) {
		return {
			formate : "day",
			step : 7
		};
	} else if (days >= 70 && days < 140) {
		return {
			formate : "day",
			step : 14
		};
	} else if (days >= 140 && days < 280) {
		return {
			formate : "month",
			step : 1
		};
	} else if (days >= 280 && days < 365) {
		return {
			formate : "month",
			step : 2
		};
	} else if (days >= 365 && days < 730) {
		return {
			formate : "month",
			step : 3
		};
	} else if (days >= 730 && days < 1460) {
		return {
			formate : "month",
			step : 6
		};
	} else if (days >= 1460 && days < 2920) {
		return {
			formate : "year",
			step : 1
		};
	} else
		return {
			formate : "year",
			step : 5
		};
};

/** @description return next month Index .  **/
TimeLineCalculation.prototype.getNextMonthIndex = function (date, index, steps) {
	var month = (date.getMonth() + 1);
	var year = date.getFullYear();
	var day = 1000 * 60 * 60 * 24;
	for (var i = 1; i <= steps; i++) {
		var days = (new Date(year, month, 0).getDate());
		month++;
		index = index + (days * day);
	}
	return index;
};

/** @description return next year Index .  **/
TimeLineCalculation.prototype.getNextYearIndex = function (year, index, steps) {
	var day = 1000 * 60 * 60 * 24;
	for (var i = 0; i < steps; i++) {
		index = (index * 1) + (((IsBoolean(isLeapYear(year * 1 + i * 1))) ? 366 : 365) * day);
	}
	return index;
};

/** @description return formated date for mark on x-axis and Index .  **/
TimeLineCalculation.prototype.getFormattedDateTime = function (data, formate, steps) {
	var monthArr = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var dayArr = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	var date = new Date(isNaN(data) ? data : data * 1);
	if (formate == "hour" && (this.dataFrequency == "hour" || this.dataFrequency == "minute")) {
		var hour = 1000 * 60 * 60;{
			var date = new Date(data * 1);
			var textData = date.getDate() + ". " + monthArr[date.getMonth() + 1] + " " + date.getHours() + ":00";
			return {
				textData : textData,
				index : (data * 1 + steps * hour)
			};
		}
	} else if (formate == "day" && (this.dataFrequency == "day" || this.dataFrequency == "hour" || this.dataFrequency == "minute")) {
		var day = 1000 * 60 * 60 * 24;
		var date = new Date(data * 1);
		var textData = date.getDate() + ". " + monthArr[date.getMonth() + 1];
		return {
			textData : textData,
			index : (data * 1 + steps * day)
		};
	} else if (formate == "month" && (this.dataFrequency == "day" || this.dataFrequency == "hour" || this.dataFrequency == "month" || this.dataFrequency == "minute")) {
		var date = new Date(data * 1);
		var day = 1000 * 60 * 60 * 24;

		if (date.getDate() == 1) {
			var textData = (monthArr[date.getMonth() + 1] + " \"" + ("" + date.getFullYear()).substring(2, 4));
			return {
				textData : textData,
				index : (this.getNextMonthIndex(date, data, steps))
			};
		} else
			return {
				textData : "",
				index : ((data * 1) + day)
			};
	} else {
		var day = 1000 * 60 * 60 * 24;
		var date = new Date(data * 1);
		var month = (date.getMonth() + 1);
		var year = date.getFullYear();
		var days = new Date(year, month, 0).getDate();
		if ((date.getMonth() + 1) == 1) {
			var textData = date.getFullYear();
			return {
				textData : textData,
				index : (this.getNextYearIndex(textData, data, steps))
			};
		} else
			if (data * 1 < 0)
				return {
					textData : "",
					index : (data * 1 + days * day)
				};
			else
				return {
					textData : "",
					index : (data * 1 +days * day)
				};
	}
};

//--------------------------------------SVGColumns-----------------------------------------

function TimeLineColumns() {
	this.m_xPixel = [];
	this.m_yPixelArray = [];
	this.m_stackHeightArray = [];
	this.m_stackColorArray = [];
	this.m_stackOpacityArray = [];
	this.m_svgStackArray = [];
	this.m_transparency = "";
	this.m_ySeriesData=[];
	this.m_valueOnDataPoints;
};
/** @description initialize  TimeLineColumns with some required properties.  **/
TimeLineColumns.prototype.init = function (stackColorArray, xPixel, yPixelArray, stackHeightArray, stackWidth, chart, transparency, yseriesData, valueondatapoints, stackOpacityArray) {
	this.m_xPixel = xPixel;
	this.m_yPixelArray = yPixelArray;
	this.m_stackWidth = (chart.m_columntype == "clustered" ) ? stackWidth*chart.clusteredbarpadding : stackWidth;
	this.m_stackHeightArray = stackHeightArray;
	this.m_stackColorArray = stackColorArray;
	this.m_stackOpacityArray = stackOpacityArray;
	this.m_chart = chart;
	this.m_transparency = transparency;
	var arrayLength=this.m_yPixelArray.length;
	this.m_ySeriesData = yseriesData;
	this.m_valueOnDataPoints = IsBoolean(valueondatapoints);
	for (var i = 0; i < arrayLength; i++) {
		this.m_svgStackArray[i] = new TimeLineStack();
		/*DAS-934  Data label position is not proper when autoaxis is true and base zero is false*/
		if (this.m_yPixelArray[i] >= this.m_chart.getStartY() || this.m_yPixelArray === "")
			this.m_stackHeightArray[i] = 0;
		else if (this.m_yPixelArray[i] < this.m_chart.getEndY()) {
			this.m_stackHeightArray[i] = this.m_stackHeightArray[i] - (this.m_chart.getEndY() - this.m_yPixelArray[i]);
			this.m_yPixelArray[i]= this.m_chart.getEndY();
		} else if ((this.m_yPixelArray[i] * 1 + this.m_stackHeightArray[i] * 1) > this.m_chart.getStartY()) {
			this.m_stackHeightArray[i] = (this.m_chart.getStartY() - this.m_yPixelArray[i]);
		}
		if ((this.m_yPixelArray[i] * 1 + this.m_stackHeightArray[i]) > this.m_chart.getStartY())
			this.m_stackHeightArray[i] = this.m_chart.getStartY() - this.m_yPixelArray[i];
		this.m_stackHeightArray[i] = (this.m_stackHeightArray[i] < 0) ? 0 : this.m_stackHeightArray[i];
				
	    this.m_svgStackArray[i].init(this.m_xPixel[i], this.m_yPixelArray[i], this.m_stackWidth, this.m_stackHeightArray[i], this.m_stackColorArray[i], this.m_chart, this.m_transparency, this.m_ySeriesData[i], this.m_valueOnDataPoints, this.m_stackOpacityArray);
	}
};
/** @description will draw  the columns which is in range. **/
TimeLineColumns.prototype.drawColumns = function (j) {
	var arrayLength=this.m_yPixelArray.length;
	if (IsBoolean(this.m_chart.m_stackhoverstyle) && IsBoolean(!this.m_chart.scaleFlag)) {
		this.createStackPattern(); // Added for create stack pattern
	}
	for (var i = 0; i < arrayLength; i++) {
		if ((!this.isInRange(i)) && (this.m_chart.m_afterslider == undefined || this.m_chart.m_afterslider == false)){
			this.m_svgStackArray[i].drawSVGStack(i , j);
		} else if(IsBoolean(this.m_chart.m_afterslider)){
			this.m_svgStackArray[i].drawSVGStack(this.m_chart.m_sliderindexes[j][i] , j);
		}
	}
};

/** @description checks column in range of not. **/
TimeLineColumns.prototype.isInRange = function (i) {
	if (this.m_yPixelArray[i] >= this.m_chart.getStartY() && this.m_yPixelArray[i] <= this.m_chart.getEndY())
		return true;
	else
		return false;
};

/** @description will create stack pattern on mouseover. **/
TimeLineColumns.prototype.createStackPattern = function () {
	var temp = this;
	var defsElement = document.createElementNS('http://www.w3.org/2000/svg', "defs");
	var pattern = document.createElementNS(NS, "pattern");
	pattern.setAttribute("id", "pattern-stripe");
	pattern.setAttribute("width", "6");
	pattern.setAttribute("height", "4");
	pattern.setAttribute("patternUnits", "userSpaceOnUse");
	pattern.setAttribute("patternTransform", "rotate(45)");
	
	var rect = document.createElementNS(NS, "rect");
	rect.setAttribute("width", "3");
	rect.setAttribute("height", "4");
	rect.setAttribute("fill", "#FFFFFF");
	pattern.appendChild(rect);
	
	var mask = document.createElementNS(NS, "mask");
	mask.setAttribute("id", "mask-stripe" + temp.m_chart.svgContainerId);
	var maskRect = document.createElementNS(NS, "rect");
	maskRect.setAttribute("id", "mask-stripeRect" + temp.m_chart.svgContainerId);
	maskRect.setAttribute("x", 0);
	maskRect.setAttribute("y", 0);
	maskRect.setAttribute("width", "100%");
	maskRect.setAttribute("height", "100%");
	maskRect.setAttribute("fill", "url(#pattern-stripe)");
	mask.appendChild(maskRect);
	
	defsElement.appendChild(pattern);
	defsElement.appendChild(mask);
	$("#" + temp.m_chart.svgContainerId).append(defsElement);
};
//------------------------SVGStack----------------------------------------------

function TimeLineStack() {
	this.m_stackXPixel;
	this.m_stackYPixel;
	this.m_stackWidth;
	this.m_stackHeight;
	this.m_stackColor;
	this.m_showGradient;
	this.m_transparency;
	this.m_ySeriesData;
	this.m_valueOnDataPoints;
	this.m_stackOpacity;
}

/** @description initialize  TimeLineStack with some required properties.  **/
TimeLineStack.prototype.init = function (stackXPixel, stackYPixel, stackWidth, stackHeight, stackColor, chatRef, transparency,ySeriesData,valueOnDataPoints,stackOpacity) {
	this.m_stackXPixel = stackXPixel;
	this.m_stackYPixel = stackYPixel;
	this.m_stackWidth = stackWidth;
	this.m_stackHeight = stackHeight;
	this.m_stackColor = stackColor;
	this.m_stackOpacity = stackOpacity;
	this.m_chart = chatRef;
	this.m_transparency = transparency;
	this.m_ySeriesData = ySeriesData;
	this.m_valueOnDataPoints = valueOnDataPoints;
};

/** @description will draw Stack  on SVG.  **/
TimeLineStack.prototype.drawSVGStack = function (categoryIndex, seriesIndex) {
	var temp = this;
	var id = (!temp.m_chart.scaleFlag) ? "stackgrp" + seriesIndex + temp.m_chart.m_objectid : "stackgrpslider" + seriesIndex + temp.m_chart.m_objectid;
	if (this.m_stackYPixel >= temp.m_chart.getStartY() || this.m_stackYPixel === "")
		this.m_stackHeight = 0;
	else if (this.m_stackYPixel < temp.m_chart.getEndY()) {
		this.m_stackHeight = this.m_stackHeight - (temp.m_chart.getEndY() - this.m_stackYPixel);
		this.m_stackYPixel = temp.m_chart.getEndY();
	} else if ((this.m_stackYPixel * 1 + this.m_stackHeight * 1) > temp.m_chart.getStartY()) {
		this.m_stackHeight = (temp.m_chart.getStartY() - this.m_stackYPixel);
	}else{
		// Do nothing
	}
	if ((this.m_stackYPixel * 1 + this.m_stackHeight) > temp.m_chart.getStartY()){
		this.m_stackHeight = temp.m_chart.getStartY() - this.m_stackYPixel;
	}
	/** Updated stack Height & Width calculation for stack border addition */
	var actualHeight = this.m_stackHeight;
	this.m_stackHeight = this.m_stackHeight - ((this.m_stackHeight > this.m_chart.m_stackborderwidth * 2) ? (this.m_chart.m_stackborderwidth * 1) : 0 );
	this.m_stackHeight = (this.m_stackHeight < 0) ? 0 : this.m_stackHeight;
	
	/**DAS-1281*/
	var seriesName = this.m_chart.m_seriesNames[seriesIndex];
	var overlaidWidth = this.m_chart.m_lineCalculation.columnWidthMap[seriesName];
	this.m_stackWidth = (this.m_chart.m_columntype == "overlaid") ? overlaidWidth : this.m_stackWidth;
	var actualWidth = this.m_stackWidth;
	this.m_stackWidth = this.m_stackWidth - ((this.m_stackWidth > this.m_chart.m_stackborderwidth * 2) ? (this.m_chart.m_stackborderwidth * 1) : 0 );
	this.m_stackWidth = (this.m_stackWidth < 0) ? 0 : this.m_stackWidth;
	/** Updated stackYPixel calculation for stack border addition */
	this.m_stackYPixel = (actualHeight > (this.m_chart.m_stackborderwidth * 2) && actualWidth > (this.m_chart.m_stackborderwidth * 2)) ? (this.m_stackYPixel + this.m_chart.m_stackborderwidth * 0.5) : this.m_stackYPixel; 
	if (("" + this.m_stackYPixel) !== "NaN" && this.m_stackHeight !== "" && this.m_stackColor !== "") {
		if (temp.m_chart.m_stacksvgtype === "path") {
			/**to append slider chart in group**/
			this.drawSVGPathStack(this, id, categoryIndex, seriesIndex, actualHeight);
		} else {
			var svgStack = drawSVGRect(this.m_stackXPixel, this.m_stackYPixel, this.m_stackWidth, this.m_stackHeight, hex2rgb(this.m_stackColor, this.m_transparency));
			$(svgStack).attr("id", "svgStack" +  temp.m_chart.svgContainerId + seriesIndex + categoryIndex);
			if (actualHeight > (this.m_chart.m_stackborderwidth * 2) && actualWidth > (this.m_chart.m_stackborderwidth * 2)) {
				$(svgStack).attr("stroke", hex2rgb(this.m_chart.m_stackbordercolor));
				$(svgStack).attr("stroke-width", this.m_chart.m_stackborderwidth);
				$(svgStack).attr("stroke-opacity", "1");
				/** Added for add radius on stack*/
				$(svgStack).attr("rx", this.m_chart.m_stackborderradius);
				$(svgStack).attr("ry", this.m_chart.m_stackborderradius);
				if (IsBoolean(this.m_chart.m_enablestackshadow) && !IsBoolean(this.m_chart.isPropertyBrowserCompatible()) && this.m_stackHeight > 2 && this.m_stackWidth > 2) {
					$(svgStack).attr("filter", "url(#stackShadow"+temp.m_chart.m_objectid+")");
					svgStack.setAttribute("shape-rendering", "crispEdges");
				}
			}
			/**Internet Explorer does not support svg animation.*/
		    var isIE = /*@cc_on!@*/false || !!document.documentMode;
			if (IsBoolean(this.m_chart.m_enableanimation) && IsBoolean(!this.m_chart.scaleFlag) && (this.m_chart.m_stackAnimationDuration > 0) && !isIE) {
				var animate1 = drawSVGStackAnimation(0, "height", this.m_stackHeight, this.m_chart.m_stackAnimationDuration);
				var animate2 = drawSVGStackAnimation((this.m_stackHeight + this.m_stackYPixel), "y", this.m_stackYPixel, this.m_chart.m_stackAnimationDuration);
				$(svgStack).append(animate1);
				if (temp.m_ySeriesData > 0) {
					$(svgStack).append(animate2);
				}
			}
			/** draw style on stack on mouseover event */
			if (IsBoolean(this.m_chart.m_stackhoverstyle) && IsBoolean(!this.m_chart.scaleFlag) && !isIE) {
				var svgStack1 = drawSVGRect(0, 0, 0, 0, "none");
				$(svgStack1).attr("id", "overly-svgStack" +  temp.m_chart.svgContainerId + seriesIndex + categoryIndex);
				$(svgStack1).attr("rx", this.m_chart.m_stackborderradius);
				$(svgStack1).attr("ry", this.m_chart.m_stackborderradius);
				svgStack.addEventListener("mouseover", function (evt) {
					$("#overly-" + this.id).attr("x",temp.m_stackXPixel);
					$("#overly-" + this.id).attr("y",temp.m_stackYPixel);
					$("#overly-" + this.id).attr("width",temp.m_stackWidth);
					$("#overly-" + this.id).attr("height",temp.m_stackHeight);
					$("#overly-" + this.id).attr("fill",hex2rgb(temp.m_stackColor, temp.m_transparency));
					$(this).attr("fill",hex2rgb(temp.m_chart.m_stackstripecolor, "1"));
					$(this).attr("mask", "url(#mask-stripe"+ temp.m_chart.svgContainerId +")");
				});
				svgStack.addEventListener("mouseout", function () {
					$(this).attr("mask", "");
					$(this).attr("fill", hex2rgb(temp.m_stackColor, temp.m_transparency));
					$("#overly-" + this.id).attr("x","0");
					$("#overly-" + this.id).attr("y","0");
					$("#overly-" + this.id).attr("width","0");
					$("#overly-" + this.id).attr("height","0");
					$("#overly-" + this.id).attr("fill","none");
				});
				$("#"+id).append(svgStack1);
			} else {
				$(svgStack).attr("class", "timeSeries-stackHighlighter");
			}
			$("#"+id).append(svgStack);
		}
	}
};

/** @description will draw top rounded stack using path **/
TimeLineStack.prototype.drawSVGPathStack = function(temp, id, categoryIndex, seriesIndex, actualHeight) {
    var dStr = this.getStackPathString(temp, temp.m_stackXPixel, temp.m_stackYPixel, temp.m_stackWidth, temp.m_stackHeight, actualHeight);
    if (dStr != "" && Math.abs(temp.m_stackHeight) > 0) { // Added for remove path drawing when value is 0 or path string is empty.
        var g1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(IsBoolean(temp.m_chart.scaleFlag)){
        	g1.setAttribute("id", "topRoundedStack_stackgrpslider" + temp.m_chart.svgContainerId + seriesIndex + categoryIndex);
        } else {
        	g1.setAttribute("id", "topRoundedStack" + temp.m_chart.svgContainerId + seriesIndex + categoryIndex);
        }
        var g2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "path");
        rect.setAttribute("d", dStr);
        rect.setAttribute("fill-opacity",temp.m_stackOpacity);
        /**Internet Explorer does not support svg animation.*/
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;
        if (IsBoolean(temp.m_chart.m_enableanimation) && IsBoolean(!temp.m_chart.scaleFlag) && (temp.m_chart.m_stackAnimationDuration > 0) && !isIE) {
            /**Added for animation on top rounded stack */
            rect.setAttribute("class", "timeline-rounded-stack");
            var sy = ((temp.m_ySeriesData * 1) > 0) ? (temp.m_stackYPixel + temp.m_stackHeight) : (temp.m_stackYPixel);
            rect.setAttribute("style", "animation: timeline-rounded-stack " + temp.m_chart.m_stackAnimationDuration + "s linear forwards; transform-origin:center " + (sy) + "px;");
        }
        //If stackHeight value is more than stackBorderWidth then given borderWidth apply else stackHeight value become borderWidth
        if (actualHeight > (temp.m_chart.m_stackborderwidth * 2)) {
            $(g1).attr("stroke", temp.m_chart.m_stackbordercolor);
            $(g1).attr("stroke-width", temp.m_chart.m_stackborderwidth);
            $(g1).attr("fill", hex2rgb(temp.m_stackColor, temp.m_transparency));
        } else {
            $(g1).attr("stroke", temp.m_chart.m_stackbordercolor);
            $(g1).attr("stroke-width", 0);
            $(g1).attr("fill", hex2rgb(temp.m_stackColor, temp.m_transparency));
        }
        $(g2).append(rect);
        $(g1).append(g2);
        if(this.m_chart.m_drillcomptoggle !== undefined && this.m_chart.m_slidercatarr !== undefined && this.m_chart.m_slidercatarr.length !== 0){
        	if(IsBoolean(!this.m_chart.m_drillcomptoggle) && IsBoolean(this.m_chart.m_slidercatarr.includes(categoryIndex))){
            	$(g1).attr("opacity", "1");
            }else if(this.m_chart.m_slidercatarr.length == this.m_chart.SerData[0].length){
            	$(g1).attr("opacity", "1");
            }else{
            	$(g1).attr("opacity", "0.5");//$(g1).attr("opacity", "0.5");
            }
        }
        if(IsBoolean(!temp.m_chart.scaleFlag)){
        	g1.addEventListener("click", function(evt) {
            	var id = this.id;
            	var serIndex= seriesIndex,//id.slice((id.length-2),(id.length-1)),
            	catIndex = categoryIndex;//id.slice((id.length-1),(id.length));
            	for(var i=0;i<temp.m_chart.m_seriesData.length; i++){
    				var seriesName = temp.m_chart.m_allSeriesNames[i];
            		for(var j=0;j<temp.m_chart.SerData[0].length; j++){
            			if(IsBoolean(temp.m_chart.enableDrillHighlighter)){
            			//var clickid = "topRoundedStack" + temp.m_chart.svgContainerId + i + j;
    					if(temp.m_chart.m_columnSeries[seriesName] !== undefined){
            				var clickid = "topRoundedStack" + temp.m_chart.svgContainerId + i + j;
            				var clcikid_slr = "topRoundedStack_stackgrpslider" + temp.m_chart.svgContainerId + i + j;
            			}else{
            				var clickid = "linestack" + temp.m_chart.svgContainerId + i + j;
            			}
    					
            			if(catIndex == j){
                			$("#"+clickid).css("opacity","1");
                			$("#"+clcikid_slr).css("opacity","1");
            			} /*else if(IsBoolean( temp.m_chart.m_drilltoggle)) {//($("#"+clickid).css("opacity") == "1") &&
            				$("#"+clickid).css("opacity","0.5");//$("#"+clickid).css("opacity","0.5");
            				$("#"+clcikid_slr).css("opacity","0.5");//$("#"+clcikid_slr).css("opacity","0.5");
            			}*/ else {
            				$("#"+clickid).css("opacity","0.5");
            				$("#"+clcikid_slr).css("opacity","0.5");
            			}
            		  }
            		}
            	}
            });
        }
        /** Added for applying pattern on top rounded stack */
        if (IsBoolean(temp.m_chart.m_stackhoverstyle) && IsBoolean(!this.m_chart.scaleFlag) && !isIE) {
            var overlyGrp = document.createElementNS("http://www.w3.org/2000/svg", "g");
            overlyGrp.setAttribute("id", "overlyGrp-topRoundedStack" + temp.m_chart.svgContainerId + seriesIndex + categoryIndex);
            var overlyRect = document.createElementNS("http://www.w3.org/2000/svg", "path");
            overlyRect.setAttribute("d", dStr);
            overlyRect.setAttribute("fill", "none");
            $(overlyGrp).append(overlyRect);
            $("#" + id).append(overlyGrp);
            /** Initialization of event for applying pattern on top rounded stack */
            g1.addEventListener("mouseover", function(evt) {
                $("#overlyGrp-" + this.id).find("path").attr("fill", hex2rgb(temp.m_stackColor, temp.m_transparency));
                $(this).attr("fill", "");
                $(this).attr("fill", hex2rgb(temp.m_chart.m_stackstripecolor, "1"));
                $(this).attr("mask", "url(#mask-stripe" + temp.m_chart.svgContainerId + ")");
            });
            g1.addEventListener("mouseout", function() {
                $(this).attr("mask", "");
                $(this).attr("fill", hex2rgb(temp.m_stackColor, temp.m_transparency));
                $("#overlyGrp-" + this.id).find("path").attr("fill", "none");
            });
        } else {
            $(g2).attr("class", "timeSeries-stackHighlighter");
        }
        $("#" + id).append(g1);
    }
};

/** @description will return svg path string to draw top rounded stack.**/
TimeLineStack.prototype.getStackPathString = function(temp, x, y, w, h, actualHeight) {
    var
        spc = " ", // path drawing instruction letters with readable names
        moveTo = "M",
        horizLineTo = "h",
        vertLineTo = "v",
        arcTo = "a",
        closePath = "z",
        r = (actualHeight > temp.m_chart.m_stackborderradius * 1) ? temp.m_chart.m_stackborderradius * 1 : 0,
        dStr = ""; // the "d" path for the svg path
    if ((temp.m_ySeriesData) * 1 > 0) { // for positive value
        dStr =
            moveTo + spc + x + spc + (y + r) + spc +
            vertLineTo + spc + (h - r) + spc +
            horizLineTo + spc + (w) + spc +
            vertLineTo + spc + (r - h) + spc +
            arcTo + spc + (r) + spc + (-r) + spc + 0 + spc + 0 + spc + 0 + spc + (-r) + spc + (-r) + spc +
            horizLineTo + spc + (-(w - 2 * r)) + spc +
            arcTo + spc + r + spc + r + spc + 0 + spc + 0 + spc + 0 + spc + (-r) + spc + r + spc;
    } else { // for Negative value
        dStr =
            moveTo + spc + x + spc + y + spc +
            vertLineTo + spc + (h - r) + spc +
            arcTo + spc + r + spc + r + spc + 0 + spc + 0 + spc + 0 + spc + r + spc + r + spc +
            horizLineTo + spc + (w - 2 * r) + spc +
            arcTo + spc + r + spc + r + spc + 0 + spc + 0 + spc + 0 + spc + r + spc + (-r) + spc +
            vertLineTo + spc + (r - h) + spc +
            closePath;
    }
    return dStr;
};
/********************** SVGLineSeries *********************************/
function SVGLineSeries() {
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
SVGLineSeries.prototype.init = function (color, xPositionArray, yPositionArray, width, m_chart, plotTrasparency, seriesName, lineWidth, lineType, fillTrasparency) {
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
SVGLineSeries.prototype.getBasePoint = function (AxisInfo) {
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
SVGLineSeries.prototype.drawLineSeries = function(i) {
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

/** @description will draw fan chart LineSeries according to lineform.  **/
SVGLineSeries.prototype.drawFanChartSeries = function (i) {
	var isResultSeries = (this.m_chart.m_fanSeriesType[this.seriesName] == "result" || this.m_chart.m_fanSeriesType[this.seriesName] == "max") ? false : true;
		if (IsBoolean(this.m_chart.m_fillarea) && isResultSeries && this.m_chart.m_fanSeriesType[this.seriesName] !== "none")
			this.drawFanChartSegmentArea(i);
		else
			this.drawSegmentLines(i);
};
/** @description will draw Splines and filled.  **/
SVGLineSeries.prototype.drawSplinesArea = function (index) {
	/*computes control points p1 and p2 for x and y direction*/
	var temp = this;
	var px = this.computeControlPoints(this.xPositionArray);
	var py = this.computeControlPoints(this.yPositionArray);
	var id = (!temp.m_chart.scaleFlag) ? "#linestackgrp" + index + temp.m_chart.m_objectid : "#linegrpslider" + index + temp.m_chart.m_objectid;
	/*clip fillArea path which is drawing out of chart drawing area*/
	this.clipFillArea();
	
	/*updates path settings, the browser will draw the new spline*/
	var attributeD = "";
	var xposArrLength=px.p1.length;
	for (var i = 0; i < xposArrLength; i++) {
		var path = this.createBezierPathArea(this.xPositionArray[i], this.yPositionArray[i], px.p1[i], py.p1[i], px.p2[i], py.p2[i], this.xPositionArray[i + 1], this.yPositionArray[i + 1], i, this.basePoint, (px.p1.length - 1));
		if (path != undefined)
			attributeD += path;
	}
	if (attributeD != undefined || attributeD != "") {
		var strokeDashArray = this.getLineDashArray(this.lineType, this.lineWidth);
		var newLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
		newLine.setAttribute("d", attributeD);
		newLine.setAttribute("clip-path", "url(#clipPath"+ temp.m_chart.m_objectid +")");
		newLine.setAttribute("stroke-dasharray", strokeDashArray);
		newLine.setAttribute("style", "stroke:" + temp.color[0] + "; stroke-width:" + temp.lineWidth + ";fill:" + hex2rgb(temp.color[0], this.fillTrasparency) + ";");
		$(id).append(newLine);
	}
};

/** @description will create and return  Bezier path.  **/
SVGLineSeries.prototype.createBezierPathArea = function (x1, y1, px1, py1, px2, py2, x2, y2, index, startY, last) {
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
SVGLineSeries.prototype.drawSegmentArea = function (index) {
	var temp = this;
	var x_pixel = this.xPositionArray;
	var y_pixel = this.yPositionArray;
	var id = (!temp.m_chart.scaleFlag) ? "#linestackgrp" + index + temp.m_chart.m_objectid : "#linegrpslider" + index + temp.m_chart.m_objectid;
	/*clip fillArea path which is drawing out of chart drawing area*/
	this.clipFillArea();
	//var clipId = "clipPath" + index + temp.m_chart.m_objectid;
	// Remove existing clipPath if it exists (to avoid duplicates)
	/**DAS-1276 @desc check if basezero is ture for left and right series and update fillarea for both series */
	/*
	if(!IsBoolean(temp.m_chart.m_designMode) && ((IsBoolean(temp.m_chart.m_basezero) && this.m_chart.m_seriesAxis[index] == "left") || (this.m_chart.m_seriesAxis[index] == "right" && IsBoolean(this.m_chart.m_secondaxisbasezero)  )  )){
	$("#" + clipId).remove();
	var svgDefs = document.getElementById("defs" + temp.m_chart.m_objectid);
	if (!svgDefs) {
		svgDefs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
		svgDefs.setAttribute("id", "defs" + temp.m_chart.m_objectid);
		$(id).before(svgDefs);
	}
	var clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
	clipPath.setAttribute("id", clipId);
	var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rect.setAttribute("x", "0");
	rect.setAttribute("y", "0");
	rect.setAttribute("width", "100%");
	rect.setAttribute("height", temp.basePoint);
	clipPath.appendChild(rect);
	svgDefs.appendChild(clipPath);
	}*/	
	var path = this.getAreaPath(x_pixel, y_pixel, temp.basePoint); // also need to set fill css
	var strokeDashArray = this.getLineDashArray(this.lineType, this.lineWidth);
	for (var j = 0; j < path.length; j++) {
		var newLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
		newLine.setAttribute("d", path[j]);
		newLine.setAttribute("clip-path", "url(#clipPath"+ temp.m_chart.m_objectid +")");
		//newLine.setAttribute("clip-path", "url(#" + clipId  +")");
		newLine.setAttribute("stroke-dasharray", strokeDashArray);
		newLine.setAttribute("style", "stroke:" + temp.color[0] + "; stroke-width:" + temp.lineWidth + ";fill:" + hex2rgb((temp.m_chart.m_fillAreaColor[temp.seriesName]!==undefined)?temp.m_chart.m_fillAreaColor[temp.seriesName]:(!IsBoolean(temp.m_chart.m_designMode))?temp.m_chart.m_seriesColors[temp.seriesName]:"#34c0eb", temp.fillTrasparency) + ";");
		$(id).append(newLine);
	}
};

/** @description will drawn fan chart segment line and fill area.  **/
SVGLineSeries.prototype.drawFanChartSegmentArea = function (i) {
	var temp = this;
	var x_pixel = this.xPositionArray;
	var y_pixel = this.yPositionArray;
	var id = (!temp.m_chart.scaleFlag) ? temp.m_chart.m_objectid : temp.m_chart.svgTimeScaleId;
	/*clip fillArea path which is drawing out of chart drawing area*/
	this.clipFillArea();
	
	if (i == 0) {
		var path = this.getAreaPath(x_pixel, y_pixel, temp.basePoint); // also need to set fill css
	} else {
		//draw fan chart fill area bw current series line to previous series line;
		var px = this.m_chart.m_lineCalculation.xPositionMap[this.m_chart.m_visibleSeriesName[i-1]]
		var py = this.m_chart.m_lineCalculation.yPositionMap[this.m_chart.m_visibleSeriesName[i-1]];
		var path = this.getFanChartAreaPath(x_pixel, y_pixel, px, py);
	}
	
	var strokeDashArray = this.getLineDashArray(this.lineType, this.lineWidth);
	for (var j = 0; j < path.length; j++) {
		var newLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
		newLine.setAttribute("d", path[j]);
		newLine.setAttribute("clip-path", "url(#clipPath"+ temp.m_chart.m_objectid +")");
		newLine.setAttribute("stroke-dasharray", strokeDashArray);
		newLine.setAttribute("style", "stroke:" + temp.color[0] + "; stroke-width:" + temp.lineWidth + ";fill:" + hex2rgb((temp.m_chart.m_fillAreaColor[temp.seriesName]!==undefined)?temp.m_chart.m_fillAreaColor[temp.seriesName]:(!IsBoolean(temp.m_chart.m_designMode))?temp.m_chart.m_seriesColors[temp.seriesName]:"#34c0eb", temp.fillTrasparency) + ";");
		$("#linestackgrp" + i + id).append(newLine);
	}
};

/** @description will clip fillArea path which is drawing out of chart drawing area. **/
SVGLineSeries.prototype.clipFillArea = function () {
	var temp = this;
	var defsElement = document.createElementNS('http://www.w3.org/2000/svg', "defs");
	var clipPath = document.createElementNS(NS, "clipPath");
	clipPath.setAttribute("id", "clipPath"+temp.m_chart.m_objectid);
	var rect = document.createElementNS(NS, "rect");
	rect.setAttribute("x", temp.m_chart.getStartX());
	rect.setAttribute("y", temp.m_chart.getEndY());
	rect.setAttribute("width", temp.m_chart.getEndX() - temp.m_chart.getStartX());
	rect.setAttribute("height", temp.m_chart.getStartY() - temp.m_chart.getEndY());
	rect.setAttribute("fill", "none");
	clipPath.appendChild(rect);
	defsElement.appendChild(clipPath);
	$("#" + temp.m_chart.svgContainerId).append(defsElement);
};

/** @description will drawn segment line .  **/
SVGLineSeries.prototype.drawSegmentLines = function (index) {
	var temp = this;
	var x_pixel = this.xPositionArray;
	var y_pixel = this.yPositionArray;
	var id = (!temp.m_chart.scaleFlag) ? "#linestackgrp" + index + temp.m_chart.m_objectid : "#linegrpslider" + index + temp.m_chart.m_objectid;

	var path = this.pathString(x_pixel, y_pixel, temp.m_chart.getStartY(), temp.m_chart.getEndY());
	var path1 = (IsBoolean(this.m_chart.m_continuousline))?this.pathStringContinuous(x_pixel, y_pixel, temp.m_chart.getStartY(), temp.m_chart.getEndY()):undefined;
	if(path!=undefined && path!=""){
		var strokeDashArray = this.getLineDashArray(this.lineType, this.lineWidth);
		var newLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
		newLine.setAttribute("d", path);
		newLine.setAttribute("stroke-dasharray", strokeDashArray);
		newLine.setAttribute("style", "stroke:" + temp.color[0] + "; stroke-width:" + temp.lineWidth + ";fill:none;");
		$(id).append(newLine);
		// Internet Explorer not support svg animation
	    var isIE = /*@cc_on!@*/false || !!document.documentMode;
		if (IsBoolean(this.m_chart.m_enableanimation) && IsBoolean(!this.m_chart.scaleFlag) && !isIE) {
			this.setLineAnimation(newLine);
		}
	}
	//added below condition for plotting continuous line
	if(path1!=undefined && path1!=""){
		var strokeDashArray1 = this.getLineDashArray(this.m_chart.getLineType(this.lineType), this.lineWidth);
		var newLine1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		newLine1.setAttribute("d", path1);
		newLine1.setAttribute("stroke-dasharray", strokeDashArray1);
		newLine1.setAttribute("style", "stroke:" + temp.color[0] + "; stroke-width:" + temp.lineWidth + ";fill:none;");
		$(id).append(newLine1);
		// Internet Explorer not support svg animation
	    var isIE = /*@cc_on!@*/false || !!document.documentMode;
		if (IsBoolean(this.m_chart.m_enableanimation) && IsBoolean(!this.m_chart.scaleFlag) && !isIE) {
			this.setLineAnimation(newLine1);
		}
	}
};

/** @description creates and adds an SVG path without defining the nodes  **/
SVGLineSeries.prototype.createPath = function (color, width,strokeDashArray) {
	width = (typeof width == "undefined" ? "3" : width);
	var P = document.createElementNS("http://www.w3.org/2000/svg", "path");
	P.setAttributeNS(null, "fill", "none");
	P.setAttribute("stroke-dasharray", strokeDashArray);
	P.setAttributeNS(null, "stroke", color);
	P.setAttributeNS(null, "stroke-width", width);
	return P;
};

/** @description computes spline control points and draw path  **/
SVGLineSeries.prototype.drawSplines = function (index) {
	/*computes control points p1 and p2 for x and y direction*/
	var temp = this;
	px = this.computeControlPoints(this.xPositionArray);
	py = this.computeControlPoints(this.yPositionArray);
	var id = (!temp.m_chart.scaleFlag) ? "#linestackgrp" + index + temp.m_chart.m_objectid : "#linegrpslider" + index + temp.m_chart.m_objectid;

	/*updates path settings, the browser will draw the new spline*/
	var attributeD = "";
	var attributeD1 = "";
	var xposArrLength=px.p1.length;
	for (var i = 0; i < xposArrLength; i++) {
		if (this.yPositionArray[i] <= temp.m_chart.getStartY() && this.yPositionArray[i] >= temp.m_chart.getEndY()&& this.yPositionArray[i+1] <= temp.m_chart.getStartY() && this.yPositionArray[i+1] >= temp.m_chart.getEndY()) {
			var path = this.createBezierPath(this.xPositionArray[i], this.yPositionArray[i], px.p1[i], py.p1[i], px.p2[i], py.p2[i], this.xPositionArray[i + 1], this.yPositionArray[i + 1]);
			if (path != undefined)
				attributeD += path;
		}
		/*BDD-837 Added below condition for plotting continuous line when data is discontinuous*/
		 else if(IsBoolean(this.m_chart.m_continuousline)) {
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
	    var isIE = /*@cc_on!@*/false || !!document.documentMode;
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
	    var isIE = /*@cc_on!@*/false || !!document.documentMode;
		if (IsBoolean(this.m_chart.m_enableanimation) && IsBoolean(!this.m_chart.scaleFlag) && !isIE) {
			this.setLineAnimation(path1);
		}
	}
};
/** @description Get line dash array **/
SVGLineSeries.prototype.getLineDashArray = function(lineType, lineWidth) {
	/**An Array of first two numbers which specify line width and a gap and last two for line patterns **/
	if (lineType === "dot")
		return [lineWidth * 1,(lineWidth * 2) + 1,0,0];
	else if (lineType === "dash1")
		return [lineWidth * 1,(lineWidth * 1),(lineWidth * 4),(lineWidth * 1)];
	else if (lineType === "dash")
		return [(lineWidth * 2),(lineWidth * 2) + 1,0,0];
	else
		return [];
};
/** @description creates formated path string for SVG cubic path element  **/
SVGLineSeries.prototype.createBezierPath = function (x1, y1, px1, py1, px2, py2, x2, y2) {
	if (x1 !== "" && y1 !== "" && px1 !== "" && py1 !== "" && px2 !== "" && py2 !== "" && x2 !== "" && y2 !== "")
		return "M " + x1 + " " + y1 + " C " + px1 + " " + py1 + " " + px2 + " " + py2 + " " + x2 + " " + y2;
	else
		return;
};

/** @description computes control points given knots K, this is the brain of the operation  **/
SVGLineSeries.prototype.computeControlPoints = function (K) {
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
		p1 : p1,
		p2 : p2
	};
};

/** @description computes control points for segment Line. **/
SVGLineSeries.prototype.pathString = function (xPixelArr, yPixelArr, startY, endY) {
	var str = "";
	var k = 0;
	var xPixelArrLength=xPixelArr.length;
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
		}
		else
			k=0;
	 }
	/*BDD-837 Added "m_continuousline" condition for plotting continuous line when data is discontinuous*/
	return str;
};

/**@decription added below method for plotting conitnous line path string BDD-837**/
SVGLineSeries.prototype.pathStringContinuous = function (xPixelArr, yPixelArr, startY, endY) {
	var str = "";
	var k = 0;
	var xPixelArrLength=xPixelArr.length;
	for (var i = 0; i < xPixelArrLength; i++) {
		/**Math.floor & Math.ceil added to draw which is having very small difference*/
			if (yPixelArr[i] == "" && k == 0) {
				var count = 0;
		        var count1 = 0;
				for (var a = i-1; a >= 0; a--) {
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
		        }else{
					str += "M" + xPixelArr[count] + "," + yPixelArr[count];
					str +="L" + xPixelArr[count1] + "," + yPixelArr[count1];
		        }
			}
	 }
	/*BDD-837 Added "m_continuousline" condition for plotting continuous line when data is discontinuous*/
	return str;
};


/** @description computes control points for segment area. **/
SVGLineSeries.prototype.getAreaPath = function (xPixelArr, yPixelArr, startY) {
	var path = [];
	var str = "";
	var k = 0;
	var l = 0;
	var xPixelArrLength=xPixelArr.length;
	for (var i = 0; i < xPixelArrLength; i++) {
		if (yPixelArr[i] == "") {
		    if (IsBoolean(this.m_chart.m_continuousline)) {
		        l++;
		        if (i == (xPixelArr.length - 1)) {
		            str += "L" + xPixelArr[i - l] + "," + startY;
		        }
		        continue;
		    } else {
		        k = 0;
		        if (str != "")
		            path.push(str);
		        str = "";
		    }
		}
		l = 0 ;
		if (k == 0) {
			if (yPixelArr[i] != "") {
				str += "M" + xPixelArr[i] + "," + startY + "L" + xPixelArr[i] + "," + yPixelArr[i];
				//str+="M"+xPixelArr[i]+","+ yPixelArr[i];
				k++;
			}
		} else if (i == (xPixelArr.length - 1))
			str += "L" + xPixelArr[i] + "," + yPixelArr[i] + "L" + xPixelArr[i] + "," + startY;
		else {
			str += "L" + xPixelArr[i] + "," + yPixelArr[i];
		}
	}
	if (str != "")
		path.push(str);
	return path;
};
/** @description computes control points for segment area. **/
SVGLineSeries.prototype.getFanChartAreaPath= function (xPixelArr, yPixelArr, xPixelArr1, yPixelArr1) {
	var path = [];
	var str = "";
	var k = 0;
	var xPixelArrLength=xPixelArr.length;
	for (var i = 0; i < xPixelArrLength; i++) {
		if (yPixelArr[i] == "") {
			k = 0;
			if (str != "")
				path.push(str);
			str = "";
		}
		if (k == 0) {
			if (yPixelArr[i] != "") {
				str += "M" + xPixelArr[i] + "," + /*startY*/ yPixelArr1[i] + "L" + xPixelArr[i] + "," + yPixelArr[i];
				//str+="M"+xPixelArr[i]+","+ yPixelArr[i];
				k++;
			}
		} else if (i == (xPixelArr.length - 1))
			str += "L" + xPixelArr[i] + "," + yPixelArr[i] + "L" + xPixelArr[i] + "," + /*startY*/yPixelArr1[i];
		else {
			str += "L" + xPixelArr[i] + "," + yPixelArr[i];
		}
	}
	//drawline on previous series to fill area bw current to previous series lines. 
	for (var i = xPixelArrLength - 2; i > 0; i--) {
		str += "L" + xPixelArr1[i] + "," + yPixelArr1[i];
	}
	if (str != "")
		path.push(str);
	return path;
};
SVGLineSeries.prototype.setLineAnimation = function(path) {
	if (this.m_chart.m_lineAnimationDuration > 0) {
		path.style.strokeDashoffset = '0';
	    var length = path.getTotalLength();
	    var duration = this.m_chart.m_lineAnimationDuration;
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
	        path.style.transition = path.style.WebkitTransition =
	        	'stroke-dashoffset ' + duration + 's linear';
	        path.style.strokeDashoffset = "0";
	    }
	}
};
/**********************SVGPointSeries*********************************/

function SVGPointSeries() {
	this.color;
	this.radius = [];
	this.xPositionArray = [];
	this.yPositionArray = [];
	this.point = [];
	this.ctx = "";
	this.m_chart = "";
};

/** @description method initialize SVGPointSeries with their properties. **/
SVGPointSeries.prototype.init = function (color, radius, xPositionArray, yPositionArray, m_chart, pointOpacity) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.color = color;
	this.m_chart = m_chart;
	this.radius = radius;
	this.xPositionArray = xPositionArray;
	this.yPositionArray = yPositionArray;
	this.pointOpacity = pointOpacity;
	var xPosArrLength=this.xPositionArray.length;
	var radius = "";
	for (var i = 0; i < xPosArrLength; i++) {
		this.point[i] = new SVGPoint();
		radius = isNaN(this.radius[i]) ? 0 : this.radius[i];
		this.point[i].init(this.color[i], radius, this.xPositionArray[i], this.yPositionArray[i], this.ctx, this.m_chart);
	}
};

/** @description method will check point is in visible range or not. **/
SVGPointSeries.prototype.isInRange = function (i) {
	/**Math.floor & Math.ceil added to draw which is having very small difference*/
	if (Math.floor(this.yPositionArray[i]) > Math.ceil(this.m_chart.getStartY()) || Math.ceil(this.yPositionArray[i]) < Math.floor(this.m_chart.getEndY()))
		return true;
	else
		return false;
};

/** @description method will draw the points which is in range. **/
SVGPointSeries.prototype.drawPointSeries = function (seriesIndex) {
	var xPosArrLength=this.xPositionArray.length;
	for (var i = 0; i < xPosArrLength; i++) {
		if ((!this.isInRange(i)) && (this.m_chart.m_afterslider == undefined || this.m_chart.m_afterslider == false)){
			this.point[i].drawPoint(i, seriesIndex, this.pointOpacity);
		} else if(IsBoolean(this.m_chart.m_afterslider) && (!this.isInRange(i))){
			this.point[i].drawPoint(this.m_chart.m_sliderindexes[seriesIndex][i] , seriesIndex, this.pointOpacity);
		}
			
	}
};

/**@description methid to initiliaze Annotation cacluations and other functions */
function AnnotSeries() {
	this.color;
	this.radius;
	this.xPositionArray = [];
	this.yPositionArray = [];
	this.point = [];
	this.ctx = "";
	this.m_chart = "";
};
/** @description initialization of AnnotSeries. **/
AnnotSeries.prototype.init = function(color, radius, xPositionArray, yPositionArray, m_chart, plotTrasparencyArray, plotTypeArray, plotRadiusArray, yseriesData, valueondatapoints) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.color = color;
	this.m_chart = m_chart;
	this.radius = radius;
	this.xPositionArray = xPositionArray;
	this.yPositionArray = yPositionArray;
	this.m_plotTrasparency = plotTrasparencyArray;
	this.m_plotType = plotTypeArray;
	this.m_plotRadius = plotRadiusArray;
	/**Y Axis points based Annotation */
	var annotationdata = this.m_chart.m_annotationData;
	var count = 0;
	if (IsBoolean(this.m_chart.m_showyannotation)) {
		for (j = 0; j < annotationdata.length; j++) {
			for (var i = 0, length = this.xPositionArray.length; i < length; i++) {
				this.point[count] = new Point();
				var antcolor = (IsBoolean(this.m_chart.m_annotationseriescolor)) ? this.color[i] : this.m_chart.m_annotationcolor;
				var radius = this.m_chart.m_annotationradius;
				var transp = this.m_chart.m_annotationopacity;
				var shapeType = this.m_chart.m_annotationshape;
				var plotRadius = this.m_chart.m_annotationradius;
				this.point[count].init(antcolor, plotRadius, this.xPositionArray[i], this.m_chart.m_lineCalculation.getYAnotPosition(annotationdata[j].point), this.ctx, this, transp, shapeType, plotRadius);
				if (!this.isInRange(i))
					this.point[count].drawPoint();
				count++;
			}
		}
	}
	/**Category points based Line Annotation */
	var yearDrawn = {};
	var monthDrawn = [{"month":0,"year":0}];
	var xplotdata = this.m_chart.m_annotationXData;
	for (var j = 0; j < xplotdata.length; j++) {
		if (xplotdata[j].point === "" || xplotdata[j].point == null || xplotdata[j].point == "null" || xplotdata[j].point == "NULL" || xplotdata[j].point == "Null") {
			xplotdata[j] = "";
		}
		if (xplotdata[j] != "") {
				var dateRegex = /^(0[1-9]|1[0-2])[-/.](0[1-9]|[12][0-9]|3[01])[-/.](\d{4})$|^(0[1-9]|[12][0-9]|3[01])[-/.](0[1-9]|1[0-2])[-/.](\d{4})$/;;
				// Test if the date string matches the pattern
				var dateStr = xplotdata[j].point.toString();
				var datesplit = dateStr.match(dateRegex);
				if (datesplit) {
					var month, day, year;
					if (datesplit[1] && datesplit[2] && datesplit[3]) {
						// mm/dd/yyyy or mm-dd-yyyy format
						month = datesplit[1];
						day = datesplit[2];
						year = datesplit[3];
					} else if (datesplit[4] && datesplit[5] && datesplit[6]) {
						// dd/mm/yyyy or dd-mm-yyyy format
						day = datesplit[4];
						month = datesplit[5];
						year = datesplit[6];
					}
					if (this.m_chart.m_annotationformat == "month") {
						var monthcheck = monthDrawn.some(function(obj) {
						    return obj.month === month && obj.year === year;
						  });
						if (!monthcheck) {
							monthDrawn.push({"month":month,"year":year});
							var xannotationData = this.m_chart.m_lineCalculation.findClosestNumber(this.m_chart.m_lineCalculation.xAxisData, year);
							var xdataindex = xannotationData['closestIndex'];
							var xdataclst = xannotationData['closest'];
							var yearFraction = (month - 1) / 12;
							var nextclosestData;
							var xPlotDiff;
							var partPerc;
							var nextYearDiff;
							if (this.m_chart.m_lineCalculation.xAxisData.length > 1) {
								nextclosestData = (year - xdataclst >= 0) ? this.m_chart.m_lineCalculation.xAxisData[xdataindex + 1] : this.m_chart.m_lineCalculation.xAxisData[xdataindex - 1];
								xPlotDiff = Math.abs(xdataclst - year) + yearFraction;
								nextYearDiff = Math.abs(nextclosestData - xdataclst);
								partPerc = xPlotDiff / nextYearDiff * 100;
							} else if (this.m_chart.m_lineCalculation.xAxisData.length == 1 && year === xdataclst) {
								nextclosestData = xdataclst;
								xPlotDiff = Math.abs(xdataclst - year) + yearFraction;
								nextYearDiff = 1;
								partPerc = xPlotDiff / nextYearDiff * 100;
							}
						} else {
							nextclosestData = 0;
							xPlotDiff = 0;
							partPerc = NaN;
						}
				}
				else if (this.m_chart.m_annotationformat == "year") {
					if (!yearDrawn[year]) {
						yearDrawn[year] = true;
						var xannotationData = this.m_chart.m_lineCalculation.findClosestNumber(this.m_chart.m_lineCalculation.xAxisData, year);
						var xdataindex = xannotationData['closestIndex'];
						var xdataclst = xannotationData['closest'];
						var nextclosestData;
						var xPlotDiff;
						var partPerc;

						if (this.m_chart.m_lineCalculation.xAxisData.length == 1 && year === xdataclst) {
							// If there is only one data point and year is equal to it
							nextclosestData = xdataclst;
							xPlotDiff = 0;
							partPerc = 0;
						} else {
							// If there are multiple data points, calculate nextclosestData
							var xdataclstyear = new Date(xdataclst.toString()).getFullYear();
							nextclosestData = ((year - xdataclstyear >= 0) ? this.m_chart.m_lineCalculation.xAxisData[xdataindex + 1] : this.m_chart.m_lineCalculation.xAxisData[xdataindex - 1]) || 0;
							var nextclosestYear = new Date(nextclosestData?.toString()).getFullYear();
							xPlotDiff = (xdataclstyear > year) ? (xdataclstyear - year) : (year - xdataclstyear);
							partPerc = (nextclosestYear == xdataclstyear)? 0 : (xPlotDiff / (nextclosestYear - xdataclstyear) * 100);
						}
					} else {
						nextclosestData = 0;
						xPlotDiff = 0;
						partPerc = NaN;
					}
				}
				else if (this.m_chart.m_annotationformat == "day") {
					console.log(datesplit[0]);
				}
			}
			else if (isNaN(xplotdata[j].point)) {
				var xdataindex = this.m_chart.m_lineCalculation.xAxisData.indexOf(xplotdata[j].point);
				var xPlotDiff = 0;
				var partPerc = 0;
			} else {
				if (!yearDrawn[xplotdata[j].point]) {
					yearDrawn[xplotdata[j].point] = true;
					var xannotationData = this.m_chart.m_lineCalculation.findClosestNumber(this.m_chart.m_lineCalculation.xAxisData, xplotdata[j].point);
					var xdataindex = xannotationData['closestIndex'];
					var xdataclst = xannotationData['closest'];
					var nextclosestData = ((xplotdata[j].point - xdataclst >= 0) ? this.m_chart.m_lineCalculation.xAxisData[xdataindex + 1] : this.m_chart.m_lineCalculation.xAxisData[xdataindex - 1])||0;
					var xPlotDiff = (xdataclst > xplotdata[j].point) ? (xdataclst - xplotdata[j].point) : (xplotdata[j].point - xdataclst);
					var partPerc = (nextclosestYear == xdataclstyear)? 0 : (xPlotDiff / (nextclosestYear - xdataclstyear) * 100);
				} else {
					nextclosestData = 0;
					xPlotDiff = 0;
					partPerc = NaN;
				}
			}
			var xannotaionPosition = xPositionArray[xdataindex] + this.m_chart.m_lineCalculation.onePartWidth * partPerc / 100;
			/**get all yaxis points fromthe all series */
			var yPostionArrayAll = Array.from(new Set(this.m_chart.m_yPositionArray.flat(1)));
			var yPostionArrayAll = yPostionArrayAll.sort((a, b) => a - b); // Sort in ascending order
			var antcolor = (IsBoolean(this.m_chart.m_annotationseriescolor)) ? this.color[i] : this.m_chart.m_annotationcolor;
			var radius = this.m_chart.m_annotationradius;
			var transp = this.m_chart.m_annotationopacity;
			var text = xplotdata[j].label;
			var textColor = this.m_chart.m_annotationtextcolor;
			//this.m_chart.m_annotationXData[j].xposition = xannotaionPosition;
			/*
			for(var i = 0, length = yPostionArrayAll.length; i < length; i++){
				this.point[count] = new Point();
				var antcolor = "#0a286a";
				var radius = this.m_chart.m_annotationradius;
				var transp= this.m_chart.m_annotationopacity;
				var shapeType= this.m_chart.m_annotationshape;
				var plotRadius= this.m_chart.m_annotationradius;
				this.point[count].init(antcolor,plotRadius,xannotaionPosition,yPostionArrayAll[i],this.ctx,this,transp,shapeType,plotRadius);
				if(!this.isInRange(i))
				this.point[count].drawPoint();
				count++;
			}
			*/
			/**darw line for yaxis based on category */

			/**darw line for yaxis based on category */
			var pointYear = this.m_chart.getMonthYear(xplotdata[j].point.toString());
			var dataIndex = this.m_chart.m_lineCalculation.checkIndexOfData(pointYear.year);
			if (dataIndex != -1) {
				/**Add xposition to annotation array for tooltip */
				this.m_chart.m_annotationXData[j].xposition = xannotaionPosition;
				this.drawLineBetweenPoints(radius, 0.5, antcolor, xannotaionPosition, this.m_chart.getStartY(), xannotaionPosition, this.m_chart.getEndY(), text, textColor, transp);
			}

		}
	}
};
AnnotSeries.prototype.drawLineBetweenPoints = function(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2, text, textcolor,opacity) {
	if ((x1 && x1 != Infinity) && (x2 != Infinity && x2 )) {
		var fillcolor = hex2rgb(strokeColor, opacity);
		var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		var dashArray = [4,4];
		if(IsBoolean(this.m_chart.m_linetype)){
		line.setAttribute('stroke-dasharray', dashArray);	
		}
		line.setAttribute('x1', x1);
		line.setAttribute('y1', y1);
		line.setAttribute('x2', x2);
		line.setAttribute('y2', y2);
		line.setAttribute('stroke', fillcolor);
		line.setAttribute('stroke-width', lineWidth);
		$("#" + this.m_chart.svgContainerId).append(line);
	}
};
/** @description check Annotations point in range or not. **/
AnnotSeries.prototype.isInRange = function(i) {
	if (this.yPositionArray[i] > this.m_chart.getStartY() || this.yPositionArray[i] <= this.m_chart.getEndY() - 0.1)// -0.1 bucause of yposition data outof chart area, but point(drawpoint) is the maximum value and ratio*current value negligible difference between calculated point with the endY so we can substract sum minner value to arrenge the drawing.
		return true;
	else
		return false;
};
/** @description will draw Annotation points for those which is in Range. **/
AnnotSeries.prototype.drawPointSeries = function() {
	for (var i = 0, length = this.xPositionArray.length; i < length; i++) {
		/*if(!this.isInRange(i))
		this.point[i].drawPoint();
		*/
	}
};

/***********************************************************************/

function SVGPoint() {
	this.base = Point;
	this.base();
};

SVGPoint.prototype = new Point;

/** @description will draw point according to their shape. **/
SVGPoint.prototype.drawPoint = function (categoryIndex, seriesIndex, pointOpacity) {
	this.pointOpacity = pointOpacity;
	switch (this.m_chart.m_plotShapeArray[seriesIndex]) {
	case "point":
		this.drawCircle(categoryIndex, seriesIndex);
		break;
	case "cross":
		this.drawCross(categoryIndex, seriesIndex);
		break;
	case "cube":
		this.drawCube(categoryIndex, seriesIndex);
		break;
	case "star":
		this.drawStar(categoryIndex, seriesIndex);
		break;
	case "triangle":
		this.drawTriangle(categoryIndex, seriesIndex);
		break;
	case "quad":
		this.drawQuad(categoryIndex, seriesIndex);
		break;
	case "polygon":
		this.drawHexagon(categoryIndex, seriesIndex);
		break;
	case "ring":
		this.drawCircle(categoryIndex, seriesIndex, this.m_chart.m_plotShapeArray[seriesIndex]);
		break;
	case "bubble":
		this.drawBubble(categoryIndex, seriesIndex);
		break;
	default:
		this.drawCircle(categoryIndex, seriesIndex);
		break;
	}
};

/** @description calculate the path for Star. **/
SVGPoint.prototype.drawStar = function (categoryIndex, seriesIndex) {
	var temp = this;
	var cx = this.xPosition;
	var cy = this.yPosition;
	var r1 = this.radius;
	var r0 = this.radius / 2;
	var spikes = 5;

	var rot = Math.PI / 2 * 3;
	var x = cx;
	var y = cy;
	var step = Math.PI / spikes;
	var FillColor = hex2rgb(this.color, this.pointOpacity);
    var colorArr = [FillColor, "transparent"];

	var d = "M" + (cx * 1) + " " + (cy - r0);
	for (var i = 0; i < spikes; i++) {
		x = cx * 1 + Math.cos(rot) * r0;
		y = cy * 1 + Math.sin(rot) * r0;
		d += " L" + (x) + " " + (y);
		rot = rot * 1 + step * 1;

		x = cx * 1 + Math.cos(rot) * r1;
		y = cy * 1 + Math.sin(rot) * r1;
		d += " L" + (x) + " " + (y);
		rot = rot * 1 + step * 1;
	}
	d += " L" + (cx) + " " + (cy - r0);
	var newLine = document.createElementNS(NS, "path");
	newLine.setAttribute("d", d);

	newLine.setAttributeNS(null, "stroke-width", 3);
	/**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if (IsBoolean(this.m_chart.m_enableanimation) && IsBoolean(!this.m_chart.scaleFlag) && (this.m_chart.m_stackAnimationDuration > 0) && !isIE) {
        var content = document.createElementNS(NS, "linearGradient");
        content.setAttribute("id", "LinearGradient" + temp.m_chart.m_objectid + seriesIndex + categoryIndex);
        for (var i = 0; i < 2; i++) {
            var stop = document.createElementNS(NS, "stop");
            stop.setAttribute("offset", "0");
            stop.setAttribute("stop-color", colorArr[i]);
            var Animate = drawSVGStackAnimation(0, "offset", this.radius, temp.m_chart.m_bubbleanimationduration * 10);
            $(stop).append(Animate);
            $(stop).attr("class", "pointShapeColorAnimation");
            $(content).append(stop);
        }
        $("#defsElement" + temp.m_chart.m_objectid).append(content);
        FillColor = "url(#LinearGradient" + temp.m_chart.m_objectid + seriesIndex + categoryIndex + ")";
        $(newLine).attr("class", "timeSeries-pointShapeHighlighter");
    }
    newLine.setAttributeNS(null, "fill", FillColor);
    newLine.setAttributeNS(null, "stroke", FillColor);
	$("#shapegrp" + seriesIndex + temp.m_chart.m_objectid).append(newLine);
};

/** @description calculate the path for Hexagon. **/
SVGPoint.prototype.drawHexagon = function (categoryIndex, seriesIndex) {
	var temp = this;
	var x = this.xPosition;
	var y = this.yPosition;
	var radius = this.radius;
	var sides = 6;
	var FillColor = hex2rgb(this.color, this.pointOpacity);
    var colorArr = [FillColor, "transparent"];
	var a = (Math.PI * 2) / sides;
	var d = "M" + (radius * 1) + " " + (0);
	for (var i = 1; i <= sides; i++) {
		d += " L" + (radius * Math.cos(a * i)) + " " + (radius * Math.sin(a * i));
	}
	var newLine = document.createElementNS(NS, "path");
	newLine.setAttribute("transform", "translate(" + x + "," + y + ")");
	newLine.setAttribute("d", d);
	newLine.setAttributeNS(null, "stroke-width", 3);
	/**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if (IsBoolean(this.m_chart.m_enableanimation) && IsBoolean(!this.m_chart.scaleFlag) && (this.m_chart.m_stackAnimationDuration > 0) && !isIE) {
        var content = document.createElementNS(NS, "linearGradient");
        content.setAttribute("id", "LinearGradient" + temp.m_chart.m_objectid + seriesIndex + categoryIndex);
        for (var i = 0; i < 2; i++) {
            var stop = document.createElementNS(NS, "stop");
            stop.setAttribute("offset", "0");
            stop.setAttribute("stop-color", colorArr[i]);
            var Animate = drawSVGStackAnimation(0, "offset", this.radius, temp.m_chart.m_bubbleanimationduration * 10);
            $(stop).append(Animate);
            $(stop).attr("class", "pointShapeColorAnimation");
            $(content).append(stop);
        }
        $("#defsElement" + temp.m_chart.m_objectid).append(content);
        FillColor = "url(#LinearGradient" + temp.m_chart.m_objectid + seriesIndex + categoryIndex + ")";
        $(newLine).attr("class", "timeSeries-pointShapeHighlighter");
    }
    newLine.setAttributeNS(null, "fill", FillColor);
    newLine.setAttributeNS(null, "stroke", FillColor);
	
	$("#shapegrp" + seriesIndex + temp.m_chart.m_objectid).append(newLine);
};

/** @description calculate and draw the path for Cross. **/
SVGPoint.prototype.drawCross = function (categoryIndex, seriesIndex) {
	var temp = this;
	var FillColor = hex2rgb(this.color, this.pointOpacity);
    var colorArr = [FillColor, "transparent"];
	var d = "M" + (this.xPosition * 1 - this.radius * 1) + " " + (this.yPosition * 1 - this.radius * 1) +
		" L" + (this.xPosition * 1 + this.radius * 1) + " " + (this.yPosition * 1 + this.radius * 1) +
		" M" + (this.xPosition * 1 + this.radius * 1) + " " + (this.yPosition * 1 - this.radius * 1) +
		" L" + (this.xPosition * 1 - this.radius * 1) + " " + (this.yPosition * 1 + this.radius * 1);
	var newLine = document.createElementNS(NS, "path");
	newLine.setAttribute("d", d);
	newLine.setAttributeNS(null, "stroke-width", 3);
	/**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if (IsBoolean(this.m_chart.m_enableanimation) && IsBoolean(!this.m_chart.scaleFlag) && (this.m_chart.m_stackAnimationDuration > 0) && !isIE) {
        var content = document.createElementNS(NS, "linearGradient");
        content.setAttribute("id", "LinearGradient" + temp.m_chart.m_objectid + seriesIndex + categoryIndex);
        for (var i = 0; i < 2; i++) {
            var stop = document.createElementNS(NS, "stop");
            stop.setAttribute("offset", "0");
            stop.setAttribute("stop-color", colorArr[i]);
            var Animate = drawSVGStackAnimation(0, "offset", this.radius, temp.m_chart.m_bubbleanimationduration * 10);
            $(stop).append(Animate);
            $(stop).attr("class", "pointShapeColorAnimation");
            $(content).append(stop);
        }
        $("#defsElement" + temp.m_chart.m_objectid).append(content);
        FillColor = "url(#LinearGradient" + temp.m_chart.m_objectid + seriesIndex + categoryIndex + ")";
        $(newLine).attr("class", "timeSeries-pointShapeHighlighter");
    }
    newLine.setAttributeNS(null, "fill", FillColor);
    newLine.setAttributeNS(null, "stroke", FillColor);
	
	$("#shapegrp" + seriesIndex + temp.m_chart.m_objectid).append(newLine);
};

/** @description calculate and draw the path for Triangle. **/
SVGPoint.prototype.drawTriangle = function(categoryIndex, seriesIndex) {
    var temp = this;
    var FillColor = hex2rgb(this.color, this.pointOpacity);
    var colorArr = [FillColor, "transparent"];
    var d = "M" + (this.xPosition * 1) + " " + (this.yPosition * 1 - this.radius * 1) +
        " L" + (this.xPosition * 1 + this.radius * 1) + " " + (this.yPosition * 1 + this.radius * 1) +
        " L" + (this.xPosition * 1 - this.radius * 1) + " " + (this.yPosition * 1 + this.radius * 1) +
        " L" + (this.xPosition * 1) + " " + (this.yPosition * 1 - this.radius * 1);
    var newLine = document.createElementNS(NS, "path");
    newLine.setAttribute("d", d);
    /**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if (IsBoolean(this.m_chart.m_enableanimation) && IsBoolean(!this.m_chart.scaleFlag) && (this.m_chart.m_stackAnimationDuration > 0) && !isIE) {
        var content = document.createElementNS(NS, "linearGradient");
        content.setAttribute("id", "LinearGradient" + temp.m_chart.m_objectid + seriesIndex + categoryIndex);
        for (var i = 0; i < 2; i++) {
            var stop = document.createElementNS(NS, "stop");
            stop.setAttribute("offset", "0");
            stop.setAttribute("stop-color", colorArr[i]);
            var Animate = drawSVGStackAnimation(0, "offset", this.radius, temp.m_chart.m_bubbleanimationduration * 10);
            $(stop).append(Animate);
            $(stop).attr("class", "pointShapeColorAnimation");
            $(content).append(stop);
        }
        $("#defsElement" + temp.m_chart.m_objectid).append(content);
        FillColor = "url(#LinearGradient" + temp.m_chart.m_objectid + seriesIndex + categoryIndex + ")";
        $(newLine).attr("class", "timeSeries-pointShapeHighlighter");
    }
    newLine.setAttributeNS(null, "fill", FillColor);
    newLine.setAttributeNS(null, "stroke", FillColor);
    $("#shapegrp" + seriesIndex + temp.m_chart.m_objectid).append(newLine);
};

/** @description calculate and draw the path for Quad. **/
SVGPoint.prototype.drawQuad = function (categoryIndex, seriesIndex) {
	var temp = this;
	var angle = 45;
	this.ctx.lineTo(this.xPosition * 1, this.yPosition * 1 - this.m_plotradius * 1);

	var newRect = document.createElementNS(NS, "rect");
	newRect.setAttributeNS(null, "x", this.xPosition - this.radius);
	newRect.setAttributeNS(null, "y", this.yPosition - this.radius);
	newRect.setAttributeNS(null, "height", 2 * this.radius);
	newRect.setAttributeNS(null, "width", 2 * this.radius);
	newRect.setAttribute("transform", "rotate(" + angle + " " + this.xPosition + "," + this.yPosition + ")");
	newRect.setAttributeNS(null, "stroke", hex2rgb(this.color, this.pointOpacity));
	newRect.setAttributeNS(null, "fill", hex2rgb(this.color, this.pointOpacity));
	/**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if (IsBoolean(this.m_chart.m_enableanimation) && IsBoolean(!this.m_chart.scaleFlag) && (this.m_chart.m_stackAnimationDuration > 0) && !isIE) {
		var Animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        Animate.setAttribute("attributeName", "height");
        Animate.setAttribute("from", "1");
        Animate.setAttribute("to", this.radius*2);
        Animate.setAttribute("dur", temp.m_chart.m_bubbleanimationduration + "s");
        $(newRect).append(Animate);
        $(newRect).attr("class", "pointShapeAnimation");
        var radius = this.radius;
        newRect.addEventListener("mouseover", function (evt) {
        	newRect.setAttributeNS(null, "height", (2*radius + temp.m_chart.m_hovershape));
        	newRect.setAttributeNS(null, "width", (2*radius + temp.m_chart.m_hovershape));
        	newRect.setAttributeNS(null, "opacity", 0.8);
		});
        newRect.addEventListener("mouseout", function () {
        	newRect.setAttributeNS(null, "height", 2*radius);
        	newRect.setAttributeNS(null, "width", 2*radius);
        	newRect.setAttributeNS(null, "opacity", temp.pointOpacity);
		});
    }
	
	$("#shapegrp" + seriesIndex +temp.m_chart.m_objectid).append(newRect);
};

/** @description calculate and draw the path for Cube. **/
SVGPoint.prototype.drawCube = function (categoryIndex, seriesIndex) {
	var temp = this;
	var newRect = document.createElementNS(NS, "rect");
	newRect.setAttributeNS(null, "x", this.xPosition - this.radius);
	newRect.setAttributeNS(null, "y", this.yPosition - this.radius);
	newRect.setAttributeNS(null, "height", 2 * this.radius);
	newRect.setAttributeNS(null, "width", 2 * this.radius);
	newRect.setAttributeNS(null, "stroke", hex2rgb(this.color, this.pointOpacity));
	newRect.setAttributeNS(null, "fill", hex2rgb(this.color, this.pointOpacity));
	/**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if (IsBoolean(this.m_chart.m_enableanimation) && IsBoolean(!this.m_chart.scaleFlag) && (this.m_chart.m_stackAnimationDuration > 0) && !isIE) {
		var Animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        Animate.setAttribute("attributeName", "width");
        Animate.setAttribute("from", "1");
        Animate.setAttribute("to", this.radius*2);
        Animate.setAttribute("dur", temp.m_chart.m_bubbleanimationduration + "s");
        $(newRect).append(Animate);
        $(newRect).attr("class", "pointShapeAnimation");
        var radius = this.radius;
        newRect.addEventListener("mouseover", function (evt) {
        	newRect.setAttributeNS(null, "height", (2*radius + temp.m_chart.m_hovershape));
        	newRect.setAttributeNS(null, "width", (2*radius + temp.m_chart.m_hovershape));
        	newRect.setAttributeNS(null, "opacity", 0.8);
		});
        newRect.addEventListener("mouseout", function () {
        	newRect.setAttributeNS(null, "height", 2*radius);
        	newRect.setAttributeNS(null, "width", 2*radius);
        	newRect.setAttributeNS(null, "opacity", temp.pointOpacity);
		});
    }
	
	$("#shapegrp" + seriesIndex + temp.m_chart.m_objectid).append(newRect);
};

/** @description calculate and draw the path for Bubble. **/
SVGPoint.prototype.drawBubble = function(categoryIndex, seriesIndex) {
    var temp = this;
    var FillColor = hex2rgb(this.color, this.pointOpacity);
    var luminanceColor = ColorLuminance(this.color, this.m_chart.m_luminance);
    luminanceColor = hex2rgb(luminanceColor, this.pointOpacity);
    var colorArr = [luminanceColor, FillColor];
    var perArr = ["10%", "80%"];
    var svgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
   // var defsElement = document.createElementNS('http://www.w3.org/2000/svg', "defs");
    var content = document.createElementNS(NS, "radialGradient");
    content.setAttribute("id", "radialGradient" + temp.m_chart.m_objectid + seriesIndex + categoryIndex);
    content.setAttribute("fx", "30%");
    content.setAttribute("fy", "20%");
    for (var i = 0; i < 2; i++) {
        var stop = document.createElementNS(NS, "stop");
        stop.setAttribute("offset", perArr[i]);
        stop.setAttribute("stop-color", colorArr[i]);
        $(content).append(stop);
    }
    svgCircle.setAttributeNS(null, "cx", this.xPosition);
    svgCircle.setAttributeNS(null, "cy", this.yPosition);
    svgCircle.setAttributeNS(null, "r", this.radius);
    svgCircle.setAttributeNS(null, "stroke", hex2rgb(this.color, this.pointOpacity));
    FillColor = "url(#radialGradient" + temp.m_chart.m_objectid + seriesIndex + categoryIndex + ")";
    svgCircle.setAttributeNS(null, "fill", FillColor);
    /**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if (IsBoolean(this.m_chart.m_enableanimation) && IsBoolean(!this.m_chart.scaleFlag) && (this.m_chart.m_bubbleanimationduration > 0) && !isIE) {
    	var Animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        Animate.setAttribute("attributeName", "r");
        Animate.setAttribute("from", "1");
        Animate.setAttribute("to", this.radius);
        Animate.setAttribute("dur", temp.m_chart.m_bubbleanimationduration + "s");
       // Animate.setAttribute("repeatCount", "indefinite"); For infite repeat.
        $(svgCircle).append(Animate);
        $(svgCircle).attr("class", "pointShapeAnimation");
        var radius = this.radius;
        svgCircle.addEventListener("mouseover", function (evt) {
        	//svgCircle.setAttributeNS(null, "r", radius*1 + (temp.m_chart.m_hovershape*1));
        	/**Enable point animation on mousehover */
        	var to = (temp.radius*1) + (temp.m_chart.m_hovershape*1);
            var animateCircle1 = temp.drawAnimateCircle(temp, (temp.pointOpacity*1) - (temp.pointOpacity*0.2), radius, temp.m_chart.m_hovershape, "1", to);
            to = to + (temp.m_chart.m_hovershape*1)
            var animateCircle2 = temp.drawAnimateCircle(temp, (temp.pointOpacity*1) - (temp.pointOpacity*0.4), radius, temp.m_chart.m_hovershape, "1", to);
            var repeatCount = $(this).find("animate")[0];
        	repeatCount.setAttribute("repeatCount", "indefinite");
        	$("#" + temp.m_chart.svgContainerId).append(animateCircle1);
        	$("#" + temp.m_chart.svgContainerId).append(animateCircle2);
		});
        svgCircle.addEventListener("mouseout", function () {
        	//svgCircle.setAttributeNS(null, "r", radius*1);
        	/**Disable point animation on mousehover */
        	var repeatCount = $(this).find("animate")[0];
        	repeatCount.setAttribute("repeatCount", "");
        	$("#" + temp.m_chart.svgContainerId).find(".animateCircle").remove();
		});
    }
    $("#defsElement" + temp.m_chart.m_objectid).append(content);
    $("#shapegrp" + seriesIndex + temp.m_chart.m_objectid).append(svgCircle);
};

/** @description calculate and draw the path for Circle. **/
SVGPoint.prototype.drawCircle = function (categoryIndex, seriesIndex, circleType) {
	var temp = this;
	var FillColor = (circleType === "ring") ? "transparent" : hex2rgb(this.color, this.pointOpacity);
	var svgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	svgCircle.setAttribute("id", "linestack" + temp.m_chart.svgContainerId + seriesIndex + categoryIndex);
	svgCircle.setAttributeNS(null, "cx", this.xPosition);
	svgCircle.setAttributeNS(null, "cy", this.yPosition);
	svgCircle.setAttributeNS(null, "r", this.radius);
	svgCircle.setAttributeNS(null, "stroke", hex2rgb(this.color, this.pointOpacity));
	svgCircle.setAttributeNS(null, "fill", FillColor);
	/**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if (IsBoolean(this.m_chart.m_enableanimation) && IsBoolean(!this.m_chart.scaleFlag) && (this.m_chart.m_bubbleanimationduration > 0) && !isIE) {
		var Animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        Animate.setAttribute("attributeName", "r");
        Animate.setAttribute("from", "1");
        Animate.setAttribute("to", this.radius);
        Animate.setAttribute("dur", temp.m_chart.m_bubbleanimationduration + "s");
        $(svgCircle).append(Animate);
        $(svgCircle).attr("class", "pointShapeAnimation");
        var radius = this.radius;
        if(temp.m_chart.m_drillcomptoggle !== undefined && temp.m_chart.m_slidercatarr !== undefined && temp.m_chart.m_slidercatarr.length !== 0){
        	if(IsBoolean(!temp.m_chart.m_drillcomptoggle) && IsBoolean(temp.m_chart.m_slidercatarr.includes(categoryIndex))){
            	$(svgCircle).attr("opacity", "1");
            }else if(temp.m_chart.m_slidercatarr.length == temp.m_chart.SerData[0].length){
            	$(svgCircle).attr("opacity", "1");
            }else{
            	$(svgCircle).attr("opacity", "1");//$(svgCircle).attr("opacity", "0.5");
            }
        }
        svgCircle.addEventListener("click", function(evt) {
        	var serIndex= seriesIndex,
        	catIndex = categoryIndex;
        	for(var i=0;i<temp.m_chart.m_seriesData.length; i++){
        		var seriesName = temp.m_chart.m_allSeriesNames[i];
        		for(var j=0;j<temp.m_chart.SerData[0].length; j++){
        			if(temp.m_chart.m_columnSeries[seriesName] !== undefined){
        				var clickid = "topRoundedStack" + temp.m_chart.svgContainerId + i + j;
        				var clcikid_slr = "topRoundedStack_stackgrpslider" + temp.m_chart.svgContainerId + i + j;
        			}else{
        				var clickid = "linestack" + temp.m_chart.svgContainerId + i + j;
        			}
        			if(catIndex == j){
            			$("#"+clickid).css("opacity","1");
            			$("#"+clcikid_slr).css("opacity","1");
        			} else if(($("#"+clickid).css("opacity") == "1") && IsBoolean( temp.m_chart.m_drilltoggle)) {
        				$("#"+clickid).css("opacity","0.5");//$("#"+clickid).css("opacity","0.5");
        				$("#"+clcikid_slr).css("opacity","0.5");//$("#"+clcikid_slr).css("opacity","0.5");
        			} else {
        				$("#"+clickid).css("opacity","1");
        				$("#"+clcikid_slr).css("opacity","1");
        			}
        		}
        	};
        });
        svgCircle.addEventListener("mouseover", function (evt) {
        	//svgCircle.setAttributeNS(null, "r", radius*1 + temp.m_chart.m_hovershape);
        	/**Enable point animation on mousehover */
        	var to = (temp.radius*1) + (temp.m_chart.m_hovershape*1);
            var animateCircle1 = temp.drawAnimateCircle(temp, (temp.pointOpacity*1) - (temp.pointOpacity*0.2), radius, temp.m_chart.m_hovershape, "1", to);
            to = to + (temp.m_chart.m_hovershape*1)
            var animateCircle2 = temp.drawAnimateCircle(temp, (temp.pointOpacity*1) - (temp.pointOpacity*0.4), radius, temp.m_chart.m_hovershape, "1", to);
            var repeatCount = $(this).find("animate")[0];
        	repeatCount.setAttribute("repeatCount", "indefinite");
        	$("#" + temp.m_chart.svgContainerId).append(animateCircle1);
        	$("#" + temp.m_chart.svgContainerId).append(animateCircle2);
        });
        svgCircle.addEventListener("mouseout", function () {
        	//svgCircle.setAttributeNS(null, "r", radius*1);
        	/**Disable point animation on mousehover */
        	var repeatCount = $(this).find("animate")[0];
        	repeatCount.setAttribute("repeatCount", "");
        	$("#" + temp.m_chart.svgContainerId).find(".animateCircle").remove();
		});
    }
	
	$("#shapegrp" + seriesIndex + temp.m_chart.m_objectid).append(svgCircle);
};

/** @description Added for animate point on mouseover. **/
SVGPoint.prototype.drawAnimateCircle = function (temp, opacity, radius, strokeWidth, from, to) {
	var animateCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	animateCircle.setAttributeNS(null, "cx", temp.xPosition);
	animateCircle.setAttributeNS(null, "cy", temp.yPosition);
	animateCircle.setAttributeNS(null, "r", radius);
	animateCircle.setAttributeNS(null, "stroke", hex2rgb(temp.color, opacity));
	animateCircle.setAttributeNS(null, "stroke-width", strokeWidth);
	animateCircle.setAttributeNS(null, "fill", "none");
	var Animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    Animate.setAttribute("attributeName", "r");
    Animate.setAttribute("from", from);
    Animate.setAttribute("to", to);
    Animate.setAttribute("repeatCount", "indefinite");
    Animate.setAttribute("dur", temp.m_chart.m_bubbleanimationduration + "s");
    $(animateCircle).append(Animate);
    $(animateCircle).attr("class", "animateCircle");
    
    return animateCircle;
};

function svgYAxis() {
	this.base = Yaxis;
	this.base();
	this.m_showlineyaxis = "true";
	this.m_lineyaxiscolor = "";
};

svgYAxis.prototype = new Yaxis;

/** @description draw the econdaryAxis  on svg. **/
svgYAxis.prototype.drawSecondaryAxis = function (lineCalculation) {
	var temp = this;
	this.m_isSecodaryAxis = true;
	var newLine = drawSVGLine(this.m_endX, this.m_startY, this.m_endX, (this.m_endY * 1), "1", temp.m_chart.m_linesecondaxiscolor);
	$("#" + temp.m_chart.svgContainerId).append(newLine);
};

/** @description will draw RightYaxis marker on svg. **/
svgYAxis.prototype.markRightYaxis = function () {
//	var noofmarkers = this.m_chart.m_lineCalculation.rightAxisInfo.noofmarker;
	var markerArray = this.m_chart.m_lineCalculation.rightAxisInfo.markerarray;
	//var noofmarkers = this.m_chart.m_lineCalculation.leftAxisInfo.noofmarker;
	var markerLength = markerArray.length;
	var plottedAxisMarkers = [];
	for (var i = 0; i < markerLength; i++) {
		var text = markerArray[i];
		text = this.getSecondaryAxisFormattedText(text, this.m_secondaryAxisPrecision);
		plottedAxisMarkers.push(text);
	}

	if(!isUniqueArray(plottedAxisMarkers)){
		/** if the markers has the duplicates, re-set them with one precision **/
		var map = getDuplicatesFromArray(plottedAxisMarkers);
		for (var i = 0; i < markerLength; i++) {
			var text = markerArray[i];
			/** returns formatted value on second y-axis markers **/
			var tempText = this.getSecondaryAxisFormattedText(text, this.m_secondaryAxisPrecision);
			if(this.m_secondaryAxisPrecision == "default" && this.m_secondAxisSecondaryUnitSymbol == "auto" && Object.keys(map).length > 0){
			/** if Same marker already exist in array, set a precision to 1 **/
				text = this.getSecondaryAxisFormattedText(text, 1);
			}else{
				text = tempText;
			}
			plottedAxisMarkers[i] = text;
		}
	}
	if (markerArray.length > 1){
		for(var j=0; j<plottedAxisMarkers.length; j++){
			this.drawSVGTextRightAxis(this.m_chart.getEndX() + this.m_axislinetotextgap, ((this.m_startY * 1) - (j * (this.getYAxisDiv(markerArray)))), "", this.m_chart.m_secondaryaxislabelfontcolor, plottedAxisMarkers[j], "left");
		}
	}	
	if (this.m_chart.m_secondaxisdiscription != "" && this.m_chart.m_secondaxisdiscription != null){
		this.drawRightAxisDescription();
	}
};


/** @description will draw RightAxisDescription on svg if (m_secondaxisdiscription != "" ). **/
Yaxis.prototype.drawRightAxisDescription = function () {
	var temp = this;
	var fontColor = convertColorToHex(this.m_chart.m_secondaxisfontcolor);
	var fontSize = this.m_chart.fontScaling(this.getSecondAxisFontSize()) * 1;
	var m_formattedDescription = this.m_chart.formattedDescription(this.m_chart, this.m_chart.m_secondaxisdiscription);
	
	var separatorSign = (IsBoolean(this.m_chart.m_enablehtmlformate.secondaryaxis)) ? "<br>" : "\\n";
	var descTextArr = m_formattedDescription.split(separatorSign);
	/**Removing array element When its length more then 3 bcz we are providing max three lines for axis desription*/
	if(descTextArr.length > 3) {
		descTextArr.splice(3, descTextArr.length-3);
	}
	if(IsBoolean(this.m_chart.m_updateddesign)){
		var descTextSpace = (descTextArr.length > 0) ? fontSize * ((descTextArr.length > 3) ? 4 : descTextArr.length -1) : 0;
		var x = this.m_chart.m_x * 1 + this.m_chart.m_width * 1 - this.m_chart.fontScaling(this.getSecondAxisFontSize()) / 2-(IsBoolean(this.m_chart.m_showlegends)?20:10) - descTextSpace;
	}else{
		var descTextSpace = (descTextArr.length > 0) ? fontSize * ((descTextArr.length > 3) ? 2 : descTextArr.length -1) : 0;
		var x = this.m_chart.m_x * 1 + this.m_chart.m_width * 1 - this.m_chart.fontScaling(this.getSecondAxisFontSize()) * 1-(IsBoolean(this.m_chart.m_showlegends)?20:5) - descTextSpace;
	}
	
	if(IsBoolean(this.m_chart.getShowLegends()) && !IsBoolean(this.m_chart.m_fixedlegend)  && (this.m_chart.m_legendposition == "verticalRightTop" || this.m_chart.m_legendposition == "verticalRightMiddle" || this.m_chart.m_legendposition == "verticalRightBottom")){
		x  = x - (this.m_chart.m_rightFloatingLegendMargin * this.m_chart.minWHRatio());		
	}
	var y = this.getYDesc();
	//Added for support html format text in secondary description 
	if (IsBoolean(this.m_chart.m_enablehtmlformate.secondaryaxis)) {
		this.drawRightAxisDescriptionInHTML(x, m_formattedDescription, fontSize);
	} else {
		var text = drawSVGText(x, y, "", fontColor, "middle", "end", 270);
		/** This method will wrap text*/
		wrapSVGText(temp, x, y, descTextArr, text, fontSize, (temp.m_startY * 1) - (this.m_endY * 1));
		
		text.setAttribute("style", "font-family:" + this.getSecondAxisFontFamily() + ";font-style:" + this.getSecondAxisFontStyle() + ";font-size:" + fontSize + "px;font-weight:" + this.getSecondAxisFontWeight() + ";text-decoration:" + this.getSecondAxisTextDecoration() + ";");
		$("#" + temp.m_chart.svgContainerId).append(text);
	}
};

/** @description will draw RightAxisDescription in html formate **/
Yaxis.prototype.drawRightAxisDescriptionInHTML = function (x, formattedDescription, fontSize) {
	var temp = this;
	var text = document.createElement("div");
	var span = document.createElement("span");
	span.innerHTML = formattedDescription;
	$(text).css({
		"position": "absolute",
		"top": (temp.m_startY*1) + "px",
		"left": (x - (this.m_axislinetotextgap*1)) + "px",
		"width": (temp.m_startY*1) - (temp.m_endY * 1)+ "px",
		"font-family": selectGlobalFont(temp.getFontFamily()),
		"font-style": temp.getFontStyle(),
		"font-size": fontSize + "px" ,
		"font-weight": temp.getFontWeight(),
		"text-align": "center",
		"color": convertColorToHex(this.m_fontcolor),
		"line-height":"normal",
		"overflow": "hidden",
	    "white-space": "nowrap",
	    "text-overflow": "ellipsis",
		"text-decoration": temp.getTextDecoration(),
		"-webkit-transform-origin":" 0 0",
			"transform": "rotate(270deg)"		
		});
	$(text).append(span);
	$("#draggableDiv" + temp.m_chart.m_objectid).append(text);
};
/** @description return one part height on y-axis. **/
svgYAxis.prototype.getYAxisDiv = function (markerArray) {
	return (this.m_startY - this.m_endY) / (markerArray.length - 1);
};

/** @description will draw horizontal marker line on SVG. **/
svgYAxis.prototype.horizontalMarkerLines = function () {
	var temp = this;
//	var noofmarkers = (this.m_chart.leftAxisInfo.noofmarker!="")?this.m_chart.leftAxisInfo.noofmarker:this.m_chart.rightAxisInfo.noofmarker;
	var markerArray = (this.m_chart.leftAxisInfo.markerarray!="")?this.m_chart.leftAxisInfo.markerarray:this.m_chart.rightAxisInfo.markerarray;
	//markerarray / max /min / markertext /noofmarker
	for (var i = 0; i < markerArray.length; i++) {
		if (markerArray.length > 1) {
			var newLine = drawSVGLine(this.m_startX, this.m_startY - (i * this.getYAxisDiv(markerArray)), this.m_endX, this.m_startY - (i * this.getYAxisDiv(markerArray)), "1", hex2rgb(temp.m_chart.m_markercolor, temp.m_chart.m_markertransparency));
			$("#horizontallinegrp" + temp.m_chart.m_objectid).append(newLine);
		}
	}
};
/** @description will draw zero Marker Line on SVG. **/
svgYAxis.prototype.zeroMarkerLine = function (markerArrayInfo,markerColor) {
	var temp = this;
	var markerArray = markerArrayInfo.markerarray;
	//markerarray / max /min / markertext /noofmarker
	for (var i = 0; i < markerArray.length; i++) {
		if (markerArray.length > 1 && markerArray[i] == 0) {
			var newLine = drawSVGLine(this.m_startX, this.m_startY - (i * this.getYAxisDiv(markerArray)), this.m_endX, this.m_startY - (i * this.getYAxisDiv(markerArray)), "1", hex2rgb(markerColor, temp.m_chart.m_markertransparency));
			$("#" + temp.m_chart.svgContainerId).append(newLine);
			break;
		}
	}
};
/** @description return true if axisMarkerLine Array has negative axis value*/
svgYAxis.prototype.hasNegativeAxisMarker = function (axisMarkerArray) {
	var isNegative = false;
	if (Array.isArray(axisMarkerArray) && axisMarkerArray.length > 0) {
		var value = Math.min.apply(null, axisMarkerArray);
		if (value < 0)
			isNegative = true;
	}
	return isNegative;
};
/** @description will draw y-axis  line on SVG. **/
svgYAxis.prototype.drawYAxis = function () {
	var temp = this;
	if (IsBoolean(this.m_showlineyaxis)) {
		var newLine = drawSVGLine(this.m_startX, this.m_startY, this.m_startX, this.m_endY, "1", temp.m_lineyaxiscolor);
		$("#" + temp.m_chart.svgContainerId).append(newLine);
	}
};

/** @description will draw  markers for y-axis on SVG. **/
svgYAxis.prototype.markYaxis = function () {
	var markerArray = this.m_chart.m_lineCalculation.leftAxisInfo.markerarray;
	var markerLength = markerArray.length;
	var plottedAxisMarkers = [];
	for (var i1 = 0; i1 < markerLength; i1++) {
		var txt;
		if (IsBoolean(this.m_isSecodaryAxis)){
			txt = this.getSecondaryAxisFormattedText(markerArray[i1], this.m_secondaryAxisPrecision);
		}else{
			txt = this.getFormattedText(markerArray[i1], this.m_precision);
		}
		plottedAxisMarkers.push(txt);
	}

	if(!isUniqueArray(plottedAxisMarkers)){
		/** if the markers has the duplicates, re-set them with one precision **/
		var map = getDuplicatesFromArray(plottedAxisMarkers);
		for (var i = 0; i < markerLength; i++) {
			var text = markerArray[i];
			var tempText;
			if (IsBoolean(this.m_isSecodaryAxis)){
				/** returns formatted value on second y-axis markers **/
				tempText = this.getSecondaryAxisFormattedText(text, this.m_secondaryAxisPrecision);
				if(this.m_secondaryAxisPrecision == "default" && this.m_secondAxisSecondaryUnitSymbol == "auto" && Object.keys(map).length > 0){
				/** if Same marker already exist in array, set a precision to 1 **/
					text = this.getSecondaryAxisFormattedText(text, 1);
				}else{
					text = tempText;
				}
			} else {
				/** returns formatted value on y-axis markers **/
				tempText = this.getFormattedText(text, this.m_precision);
				if(this.m_precision == "default" && this.m_secondaryUnitSymbol == "auto" && Object.keys(map).length > 0){
					/** if Same marker already exist in array, set a precision to 1 **/
					text = this.getFormattedText(text, 1);
				}else{
					text = tempText;
				}
			}
			plottedAxisMarkers[i] = text;
		}
	}
	if (markerArray.length > 1){
		this.m_chart.createYAxisMarkerLabelGroup('yaxislabelgrp');
		for(var j=0; j<plottedAxisMarkers.length; j++){
			this.drawSVGText(this.m_chart.getStartX() - this.m_axislinetotextgap, ((this.m_startY * 1) - (j * (this.getYAxisDiv(markerArray)))), "", this.m_labelfontcolor, getFormattedNumberWithCommas(plottedAxisMarkers[j], this.m_chart.m_numberformatter), "right");
		}
	}
	var leftAxisData = this.m_chart.getAxisData(this.m_chart.seriesDataMap["left"]);
	if (leftAxisData.all.length > 0){
		this.drawDescription();
	}
};

/** @description will draw description  if (this.getDescription() != "") **/
svgYAxis.prototype.drawDescription = function () {
	var temp = this;
	var serDec = this.m_chart.m_allSeriesDisplayNames.reduce(function(acc, item) {return item !== "" ? (acc === "" ? item : acc + ", " + item) : acc}, "");
	var description=(IsBoolean(this.m_chart.m_yAxis.m_showdatasetdescription)) ? this.m_chart.formattedDescription(this.m_chart, serDec) : this.m_chart.formattedDescription(this.m_chart, this.getDescription());
	if (description != "" && description != null) {
		var m_formattedDescription = this.m_chart.formattedDescription(this.m_chart, description);
		var separatorSign = (IsBoolean(this.m_chart.m_enablehtmlformate.yaxis)) ? "<br>" : "\\n";
		var descTextArr = m_formattedDescription.split(separatorSign);
		/**Removing array element When its length more then 3 bcz we are providing max three lines for axis desription*/
		if (descTextArr.length > 3) {
			descTextArr.splice(3, descTextArr.length - 3);
		}
		var x = this.getXDesc();
		if (IsBoolean(this.m_chart.getShowLegends()) && !IsBoolean(this.m_chart.m_fixedlegend) && (this.m_chart.m_legendposition == "verticalLeftTop" || this.m_chart.m_legendposition == "verticalLeftMiddle" || this.m_chart.m_legendposition == "verticalLeftBottom")) {
			x = x + (this.m_chart.m_leftFloatingLegendMargin * this.m_chart.minWHRatio());
		}
		var y = this.getYDesc();
		var fontSize = temp.m_chart.fontScaling(temp.getFontSize()) * 1;
		//Added for support html format text in yaxis description 
		if (IsBoolean(this.m_chart.m_enablehtmlformate.yaxis)) {
			this.drawDescriptionInHTML(m_formattedDescription, fontSize);
		} else {
			var text = drawSVGText(x, y, this.m_chart.formattedDescription(this.m_chart, ""), convertColorToHex(this.getFontColor()), "middle", "middle", 270);
			/** This method will wrap text*/
			wrapSVGText(temp, x, y, descTextArr, text, fontSize, (temp.m_startY * 1) - (this.m_endY * 1));

			$(text).css({
				"font-family": selectGlobalFont(temp.getFontFamily()),
				"font-style": temp.getFontStyle(),
				"font-size": fontSize + "px",
				"font-weight": temp.getFontWeight(),
				"text-decoration": temp.getTextDecoration()
			});
			$("#" + temp.m_chart.svgContainerId).append(text);
		}
	}
};

/** @description will draw description in html format**/
svgYAxis.prototype.drawDescriptionInHTML = function (formattedDescription, fontSize) {
	var temp = this;
	var text = document.createElement("div");
	var span = document.createElement("span");
	span.innerHTML = formattedDescription;
	$(text).css({
		"position": "absolute",
		"top": (temp.m_startY*1) + "px",
		"left": (this.m_chart.m_chartpaddings.leftBorderToDescription*1/2) + "px",
		"width": (temp.m_startY*1) - (temp.m_endY * 1)+ "px",
		"font-family": selectGlobalFont(temp.getFontFamily()),
		"font-style": temp.getFontStyle(),
		"font-size": fontSize + "px" ,
		"font-weight": temp.getFontWeight(),
		"text-align": "center",
		"color": convertColorToHex(this.m_fontcolor),
		"line-height":"normal",
		"overflow": "hidden",
	    "white-space": "nowrap",
	    "text-overflow": "ellipsis",
		"text-decoration": temp.getTextDecoration(),
		"-webkit-transform-origin":" 0 0",
			"transform": "rotate(270deg)"		
		});
	$(text).append(span);
	$("#draggableDiv" + temp.m_chart.m_objectid).append(text);
};

/** @description will draw SVGText with text properties. **/
svgYAxis.prototype.drawSVGText = function (x, y, rotate, color, text1, align) {
	var temp = this;
	var text = drawSVGText(x, y, text1, color, align, "middle");
	//text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getLabelFontSize()) + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getLabelTextDecoration() + ";");
	$("#yaxislabelgrp" + temp.m_chart.m_objectid).append(text);
};

/** @description will draw SVGText with text properties. **/
svgYAxis.prototype.drawSVGTextRightAxis = function (x, y, rotate, color, text1, align) {
	var temp = this;
	var text = drawSVGText(x, y, text1, color, align, "middle");
	$("#rightyaxislabelgrp" + temp.m_chart.m_objectid).append(text);
};

function svgXAxis() {
	this.base = Xaxis;
	this.base();
	this.m_showlinexaxis = "true";
	this.m_linexaxiscolor = "";
};

svgXAxis.prototype = new Xaxis;

/** @description initialize x-axis properties for timeline chart. **/
svgXAxis.prototype.init = function (m_chart) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.m_startX = this.m_chart.getStartX();
	this.m_startY = this.m_chart.getStartY();
	this.m_endX = this.m_chart.getEndX();
	this.m_endY = this.m_chart.getEndY();

	this.m_xAxisData = this.m_chart.m_lineCalculation.getXAxisMarkersArray();
	this.m_xPositionData = this.m_chart.m_lineCalculation.getXAxisPositionForMarkers();
	this.m_axiscolor = convertColorToHex(this.m_chart.getAxisColor());
	this.m_linexaxiscolor = (this.m_linexaxiscolor != "") ? convertColorToHex(this.m_linexaxiscolor) : this.m_axiscolor;

	this.m_labelfontcolor = convertColorToHex(this.getLabelFontColor());
};

/** @description will draw x-axis line on SVG. **/
svgXAxis.prototype.drawXAxis = function () {
	var temp = this;
	if (IsBoolean(this.m_showlinexaxis)) {
		var newLine = drawSVGLine(this.m_startX, this.m_startY, this.m_endX, (this.m_startY * 1), "1", temp.m_linexaxiscolor);
		$("#" + temp.m_chart.svgContainerId).append(newLine);
	}
};

/** @description will draw vertical lines corresponding to x-axis label. **/
svgXAxis.prototype.drawVerticalLine = function () {
	var temp = this;
	if (IsBoolean(temp.m_chart.m_showverticalmarkerline)) {
		var xAxisdatalength=this.m_xAxisData.length;
		for (var i = 0; i < xAxisdatalength; i++) {
			var x = this.m_xPositionData[i];
			var newLine = drawSVGLine(x, this.m_startY, x, this.m_endY, "1", hex2rgb(temp.m_chart.m_markercolor, temp.m_chart.m_markertransparency));
			$("#verticallinegrp" + temp.m_chart.m_objectid).append(newLine);
		}
	}
};

/** @description will draw x-axis marker and description . **/
svgXAxis.prototype.markXaxis = function () {
	this.drawAxisLabels();
	/*if (this.getDescription() != "") {
		this.drawDescription();
	}*/
	this.drawDescription();
};

/** @description will draw x-axis labels  with their text properties. **/
svgXAxis.prototype.drawAxisLabels = function () {
	var temp = this;
	var m_axisLineToTextGap = this.calculateAxisLineToTextGap();
	var xAxisdatalength=this.m_xAxisData.length;
	for (var i = 0; i < xAxisdatalength; i++) {
		var x = this.m_xPositionData[i];
		var axisToLabelMargin = 10;
		var y = this.m_startY * 1 + m_axisLineToTextGap / 2  + axisToLabelMargin * 1 + this.calculateAxisLineToTextGap() / 2 ;
		if (IsBoolean(this.m_tickmarks)) {
			var tick = drawSVGLine(x, this.m_startY, x, this.m_startY * 1 + 8, "1", temp.m_categorymarkingcolor);
			$("#xaxistickgrp" + temp.m_chart.m_objectid).append(tick);
		}
		var avlblheight, labelText, text;
		if (IsBoolean(this.getLabelTilted())) {
		    var dm = (this.getDescription() !== "") ? this.m_fontsize : 5;
		    avlblheight = this.m_chart.m_height / 4 - m_axisLineToTextGap / 2 - dm - this.calculateAxisLineToTextGap() / 2;
		    this.ctx.font = this.getLabelFontProperties();
		    if (this.ctx.measureText(this.m_xAxisData[i]).width > avlblheight) {
		        labelText = this.getText("" + this.m_xAxisData[i], avlblheight, this.getLabelFontProperties());
		    } else {
		        labelText = this.getText("" + this.m_xAxisData[i], avlblheight, this.getLabelFontProperties());
		    }
		    var labelAlign = (this.m_labelrotation > 0) ? "left" : "right";
		    text = drawSVGText(x, y, labelText, this.m_labelfontcolor, labelAlign, "start", this.getLabelrotation());
		} else {
		    avlblheight = ((this.m_chart.m_endX - this.m_chart.m_startX) / this.m_xAxisData.length);
		    if(!IsBoolean(this.m_xaxistextwrap)) {
			    labelText = this.getText("" + this.m_xAxisData[i], avlblheight, this.getLabelFontProperties());
			    text = drawSVGText(x, y, labelText, this.m_labelfontcolor, "center", "start", this.getLabelrotation());
		    } else {
		    	// if text wrap is true
			    labelText = this.m_xAxisData[i];
			    text = this.drawSVGTextForCategory(x, y, labelText, this.m_labelfontcolor, "center", "start", this.getLabelrotation(),avlblheight);
		    }
		}
		//text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getLabelFontSize()) + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getLabelTextDecoration() + ";");
		$("#xaxislabelgrp" + temp.m_chart.m_objectid).append(text);
	}
};

/** @description SVG drawing methods **/
svgXAxis.prototype.drawSVGTextForCategory= function(x, y, text, fillColor, hAlign, Valign, angle,avlblWidth) {
	var newText = document.createElementNS(NS, "text");
	// set the below method to return the 3 lines label arrays
	var labelText = this.getTexts("" + text, avlblWidth, this.getLabelFontProperties());
	if(labelText.length == 1) {
		if (!isNaN(x) && !isNaN(y)) {
			newText.setAttribute("x", x);
			newText.setAttribute("y", y);
			newText.setAttribute("fill", fillColor);
			if (angle !== "" && angle !== undefined && angle !== 0)
				newText.setAttribute("transform", "rotate(" + angle + " " + x + "," + y + ")");
			newText.textContent = labelText[0];
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
					spanElement.setAttribute("dy", this.m_chart.fontScaling(this.getLabelFontSize()) * 1);
				}
				spanElement.textContent = labelText[i];
				newText.appendChild(spanElement);
			}
		}
		return newText;
	}
};
/** @description method will return x-axis labels array when textwrap is true. **/
svgXAxis.prototype.getTexts = function(text1, textWidth, ctxFont) {
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
/** @description will draw x-axis description with text properties. **/
svgXAxis.prototype.drawDescription = function() {
	var temp = this;
	var fontSize = temp.m_chart.fontScaling(temp.getFontSize()) * 1;
	var dsDec=this.m_chart.m_allCategoryDisplayNames.join("");
	var description = (IsBoolean(this.m_chart.m_xAxis.m_showdatasetdescription)) ? this.m_chart.formattedDescription(this.m_chart, dsDec) : this.m_chart.formattedDescription(this.m_chart, this.m_description);
	if (description != "") {
		var m_formattedDescription = this.m_chart.formattedDescription(this.m_chart, description);
		var separatorSign = (IsBoolean(this.m_chart.m_enablehtmlformate.xaxis)) ? "<br>" : "\\n";
		var descTextArr = m_formattedDescription.split(separatorSign);
		/**Removing array element When its length more then 3 bcz we are providing max three lines for axis desription*/
		if (descTextArr.length > 3) {
			descTextArr.splice(3, descTextArr.length - 3);
		}
		var descTextSpace = (descTextArr.length > 0) ? fontSize * (descTextArr.length - 1) : 0;
		var x = this.getXDesc();
		var y = this.getYDesc() - ((IsBoolean(this.m_chart.m_showslider)) ? this.m_chart.sliderMargin : 0) - descTextSpace;
		if (IsBoolean(this.m_chart.getShowLegends()) && !IsBoolean(this.m_chart.m_fixedlegend) && (this.m_chart.m_legendposition == "horizontalBottomLeft" || this.m_chart.m_legendposition == "horizontalBottomCenter" || this.m_chart.m_legendposition == "horizontalBottomRight") && !IsBoolean(this.m_chart.scaleFlag)) {
			y = y - (this.m_chart.m_bottomFloatingLegendMargin * this.m_chart.minWHRatio());
		}
		//Added for support html format text in xaxis description 
		if (IsBoolean(this.m_chart.m_enablehtmlformate.xaxis)) {
			this.drawDescriptionInHTML(y, m_formattedDescription, fontSize);
		} else {
			var text = drawSVGText(x, y, this.m_chart.formattedDescription(this.m_chart, ""), convertColorToHex(this.m_fontcolor), "middle", "middle", 0);
			/** This method will wrap text*/
			wrapSVGText(temp, x, y, descTextArr, text, fontSize, (temp.m_endX * 1) - (temp.m_startX * 1));

			$(text).css({
				"font-family": selectGlobalFont(temp.getFontFamily()),
				"font-style": temp.getFontStyle(),
				"font-size": fontSize + "px",
				"font-weight": temp.getFontWeight(),
				"text-decoration": temp.getTextDecoration()
			});
			$("#" + temp.m_chart.svgContainerId).append(text);
		}
	}
};

/** @description will draw x-axis description with text properties in html format. **/
svgXAxis.prototype.drawDescriptionInHTML = function (y, formattedDescription, fontSize) {
	var temp = this;
	var text = document.createElement("div");
	var span = document.createElement("span");
	span.innerHTML = formattedDescription;
	$(text).css({
		"position": "absolute",
		"top": (y - fontSize) + 1 + "px",
		"left": temp.m_startX + "px",
		"width": (temp.m_endX * 1) - (temp.m_startX * 1) + "px",
		"font-family": selectGlobalFont(temp.getFontFamily()),
		"font-style": temp.getFontStyle(),
		"font-size": fontSize + "px" ,
		"font-weight": temp.getFontWeight(),
		"text-align": "center",
		"color": convertColorToHex(this.m_fontcolor),
		"line-height":"normal",
		"overflow": "hidden",
	    "white-space": "nowrap",
	    "text-overflow": "ellipsis",
		"text-decoration": temp.getTextDecoration()
	});
	$(text).append(span);
	$("#draggableDiv" + temp.m_chart.m_objectid).append(text);
};

/** @description will draw tick on x-axis. **/
svgXAxis.prototype.drawAxisTick = function () {
	var temp = this;
	var tickMakrerHeight = 8;
	if (IsBoolean(this.m_tickmarks)) {
		var xAxisdatalength=this.m_xAxisData.length;
		for (var i = 0; i < xAxisdatalength; i++) {
			var x = parseInt(this.m_startX) + (this.getXaxisDivison() * i);
			var newLine = drawSVGLine(x, this.m_startY, x, (this.m_startY * 1 + tickMakrerHeight * 1), "1", temp.m_chart.m_categorymarkingcolor);
			$("#" + temp.m_chart.svgContainerId).append(newLine);
		}
	}
};

/** @description return the one part of width on x-axis. **/
svgXAxis.prototype.getXaxisDivison = function () {
	return ((this.m_endX - this.m_startX) / (this.m_xAxisData.length - 1));
};

/** @description return line to text gap. **/
svgXAxis.prototype.calculateAxisLineToTextGap = function () {
	var m_axisLineToTextGap = this.m_chart.fontScaling(this.getLabelFontSize());
	return m_axisLineToTextGap;
};

/** @description will draw SVGText with text properties. **/
svgXAxis.prototype.drawSVGText = function (x, y, rotate, color, text1) {
	var temp = this;
	var text = drawSVGText(x, y, text1, color, "middle", "middle", rotate);
	text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getLabelFontSize()) + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$("#" + temp.m_chart.svgContainerId).append(text);
};
//# sourceURL=TimelineChart.js