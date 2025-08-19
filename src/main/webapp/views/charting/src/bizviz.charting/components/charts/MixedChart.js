/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: MixedChart.js
 * @description MixedChart
 **/
function MixedChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();

	this.m_x = 680;
	this.m_y = 20;
	this.m_width = 300;
	this.m_height = 260;
	this.m_radius = 2;
	this.m_lineSeries = {};
	this.m_columnSeries = {};
	this.m_colorNames = [];
	this.m_pointSeries = {};
	this.m_valueTextSeries = {};
	
	this.m_categoryNames = [];
	this.m_seriesNames = [];
	this.m_seriesarr = [];
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_alertData = [];

	this.m_yPositionArray = [];	
	this.m_xAxis = new Xaxis();
	this.m_yAxis = new Yaxis();
	this.noOfRows = 1; 
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;


	this.m_mixedCalculation = "";
	this.m_yaxisArr = [];
	this.m_marginXArray = [];
	this.count = 0;
	this.m_showrangeselector = "true";
	this.isSeriesValueWithComma = false;
	this.m_charttype = "clustered";
	this.m_barsize = 60;
	this.enableDrillHighlighter = false;
	this.m_drilltoggle = true;
	/*Annotation in Mixed Chart DAS-955*/
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

/** @description Making prototype of chart class to inherit its properties and methods into Mixed chart **/
MixedChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
MixedChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas(); //create draggable div
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
MixedChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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
MixedChart.prototype.setFields = function (fieldsJson) {
	/*	This will sort the json and set column fields to first and line fields to last.
	To draw lines on top of columns for Better View
	 */
	try {
		fieldsJson = getDuplicateArray(fieldsJson);
		sortAscArrayOfJsonByKey(fieldsJson, "ChartType");
	} catch (e) {
		console.log(e);
	}
	this.m_fieldsJson = fieldsJson;
	var categoryJson = [];
	var seriesJson = [];
	var annotationJson = [] ;/*Annotation in Mixed Chart DAS-955*/
	var arrayLength=fieldsJson.length;
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
MixedChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryFieldColor = [];
	this.m_categoryDisplayNames = [];
	this.m_allCategoryNames = [];
	this.m_allCategoryDisplayNames = [];
	this.m_categoryVisibleArr = {};
	var count = 0;
	// only one category can be set for line chart, preference to first one
	var arrayLength=categoryJson.length;
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
MixedChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = {};
	this.m_legendNames = [];
	this.m_seriesVisibleArr = {};
	this.m_plotRadiusArray = {};
	this.m_plotTrasparencyArray = {};
	this.m_plotShapeArray = {};
	this.m_allSeriesDisplayNames = [];
	this.m_allSeriesNames = [];
	this.m_seriesDisplayNamesMap = {};
	this.m_seriesDataLabelProperty = {};
	this.m_lineWidthArray = {};
	this.m_lineTypeArray = {};
	var count = 0;
	//***
	this.legendMap = {};
	this.m_seriesAxis = [];
	this.m_seriesChartType = [];
	this.m_LegendColors = [];
	var arrayLength=seriesJson.length;
	for (var i = 0; i <arrayLength; i++) {
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.m_allSeriesDisplayNames[i] = m_formattedDisplayName;
		this.m_allSeriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		this.m_seriesVisibleArr[this.m_allSeriesNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
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
			this.m_seriesChartType[count] = this.getProperAttributeNameValue(seriesJson[i], "ChartType");
			this.m_seriesDataLabelProperty[this.m_seriesNames[count]] = this.getProperAttributeNameValue(seriesJson[i], "DataLabelCustomProperties");
			if (this.m_seriesDataLabelProperty[this.m_seriesNames[count]] !== undefined) {
			    if (IsBoolean(this.m_seriesDataLabelProperty[this.m_seriesNames[count]].useFieldColor)) {
			        this.m_seriesDataLabelProperty[this.m_seriesNames[count]].dataLabelFontColor = this.m_seriesColors[this.m_seriesNames[count]];
			    }
			    if(IsBoolean(this.m_seriesDataLabelProperty[this.m_seriesNames[count]].dataLabelUseComponentFormater)){
			    	if(IsBoolean(this.m_seriesAxis[count]=="left")){
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
			var radius = this.getProperAttributeNameValue(seriesJson[i], "PlotRadius");
			this.m_plotRadiusArray[this.m_seriesNames[count]] = (radius != undefined && radius !== null && radius !== "") ? radius : 3;
			var lineWidth = this.getProperAttributeNameValue(seriesJson[i],"LineWidth");
			this.m_lineWidthArray[this.m_seriesNames[count]] = (lineWidth != undefined && lineWidth !== null && lineWidth !== "") ? lineWidth : 2 ;
			var lineType = this.getProperAttributeNameValue(seriesJson[i],"LineType");
			this.m_lineTypeArray[this.m_seriesNames[count]] = (lineType != undefined && lineType !== null && lineType !== "") ? lineType : "simple" ;
			var transparency = this.getProperAttributeNameValue(seriesJson[i], "PlotTransparency");
			this.m_plotTrasparencyArray[this.m_seriesNames[count]] = (transparency != undefined && transparency !== null && transparency !== "") ? transparency : 1;
			var shape = this.getProperAttributeNameValue(seriesJson[i], "PlotType");
			//this.m_plotShapeArray[this.m_seriesNames[count]] = (shape != undefined && shape !== null && shape !== "") ? shape : "point";
			this.m_plotShapeArray[this.m_seriesNames[count]] = (shape != undefined && shape !== null && shape !== "") ?  (this.m_seriesChartType[count] =="line")?(shape):("cube") : "point";
			var tempMap = {
				"seriesName" : this.m_seriesNames[count],
				"displayName" : this.m_seriesDisplayNames[count],
				"color" : this.m_seriesColors[this.m_seriesNames[count]],
				"shape" : this.m_plotShapeArray[this.m_seriesNames[count]],
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
MixedChart.prototype.setAnnotation = function(categoryJson) {
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
MixedChart.prototype.getLegendInfo = function () {
	return this.legendMap;
};

/** @description Setter Method of Series Colors **/
MixedChart.prototype.setSeriesColor = function (m_seriesColor) {
	this.m_seriesColor = m_seriesColor;
};

/** @description Setter Method of LegendNames **/
MixedChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};

/** @description Setter Method of Category/Series Data **/
MixedChart.prototype.setCategorySeriesData = function () {
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_seriesDataForToolTip = [];
	this.m_displaySeriesDataFlag = [];
	this.m_transparencyarr = {};

	for (var k = 0, len = this.getDataProvider().length; k < len; k++){
		var record = this.getDataProvider()[k];
		this.isEmptyCategory = true;
		if (this.getCategoryNames().length > 0){
			this.isEmptyCategory = false;
			for (var i = 0; i < this.getCategoryNames().length; i++){
				if( !this.m_categoryData[i] ){
					this.m_categoryData[i] = [];
				}
				var data = "";
				var field = this.getCategoryNames()[i];
				if (record[field] != undefined && record[field] != "undefined"){
					data = record[field];
					data = data;
				}
				this.m_categoryData[i][k] = data;
			}
		}
	
		this.m_displaySeriesDataFlag[k] = [];
		for (var j = 0; j < this.getSeriesNames().length; j++){
			if( !this.m_seriesData[j] ){
				this.m_seriesData[j] = [];
				this.m_seriesDataForToolTip[j] = [];
				this.m_transparencyarr[this.getSeriesNames()[j]] = [];
			}
			var data = "";
			var field = this.getSeriesNames()[j];
			if (record[field] != undefined && record[field] != "undefined")
				data = record[field];
			
			this.m_displaySeriesDataFlag[k][j] = true;
			if (isNaN(data)){
				this.m_displaySeriesDataFlag[k][j] = false;
				data = getNumericComparableValue(data);
			}
			this.m_seriesData[j][k] = data;
			this.m_seriesDataForToolTip[j][k] = data;
			this.m_transparencyarr[this.getSeriesNames()[j]][k] = this.m_plotTrasparencyArray[this.getSeriesNames()[j]];
		}
	}
	/**get data for annotation from dataset */
		this.m_annotationData = [];
	if (IsBoolean(this.m_designMode)) {
		if (this.m_annotationNames['text'].length > 0) {
			var annotationdata = this.m_annotationNames['text'];
			var text = this.getDataFromJSON(this.m_annotationNames['text'][0]);
			for (var i = 0; i < text.length; i++) {
				this.m_annotationData.push({ type: 'event', label: text[i], point: annotationdata[i], property: { color: 'red', radius: 10 } });
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
		var alldata=[];
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
				if (alldata && alldata.length > 0  && this.m_annotationNames['category'][0] != '') {
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

/** @description Setter Method of AllFieldsName **/
MixedChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getAllCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getAllCategoryNames()[i]);
	}
	for (var j = 0; j < this.getAllSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
	}
};

/** @description Setter Method of AllFieldsDisplayName **/
MixedChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

/** @description Setter Method of SeriesColor according to drill/categoryColor/conditionalColor **/
MixedChart.prototype.setColorsForSeries = function () {
	this.m_seriesColorsArray = {};
	this.m_PointsColorsArray = {};
	
	var isemptyCat = true;//DAS-1122

	for (var i = 0; i < this.m_categoryData.length && isemptyCat; i++) {
		isemptyCat = Array.isArray(this.m_categoryData[i]) && this.m_categoryData[i].length === 0;
	}
	if (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) {
		var seriesLength=this.m_seriesData.length;
		for (var i = 0; i < seriesLength; i++) {
			this.m_seriesColorsArray[this.m_seriesNames[i]] = [];
			this.m_PointsColorsArray[this.m_seriesNames[i]] = [];
			var seriesDataLength=this.m_seriesData[i].length;
			for (var j = 0; j < seriesDataLength; j++) {
				this.m_seriesColorsArray[this.m_seriesNames[i]][j] = this.m_drillColor;
				this.m_PointsColorsArray[this.m_seriesNames[i]][j] = this.m_drillColor;
			}
		}
	} else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && this.getCategoryColors().getCategoryColor().length > 0 && IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName())) {
		var seriesColors = this.getSeriesColors();
		var categoryColors = this.getCategoryColors().getCategoryColorsForCategoryNames(this.getCategoryData()[0], this.m_categoryFieldColor);
		var seriesLength=this.m_seriesData.length;
		for (var i = 0; i < seriesLength; i++) {
			this.m_seriesColorsArray[this.m_seriesNames[i]] = [];
			this.m_PointsColorsArray[this.m_seriesNames[i]] = [];
			var seriesDataLength=this.m_seriesData[i].length;
			for (var j = 0; j < seriesDataLength; j++) {
				this.m_seriesColorsArray[this.m_seriesNames[i]][j] = seriesColors[this.m_seriesNames[i]];
				this.m_PointsColorsArray[this.m_seriesNames[i]][j] = categoryColors[j];
			}
		}
	} else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && (!IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName()) || this.getCategoryColors().getCategoryColor().length == 0) && this.getConditionalColors() != "" && this.getConditionalColors() != undefined && this.getConditionalColors().getConditionalColor().length > 0 && !IsBoolean(isemptyCat)) {
		var conditionalColors = this.getConditionalColors().getConditionalColorsForConditionsForMixedTime(this.getSeriesNames(), this.getSeriesColors(), this.m_seriesData, this);
		var seriesColors = this.getSeriesColors();
		var seriesLength=this.m_seriesData.length;
		for (var i = 0; i <seriesLength; i++) {
			this.m_seriesColorsArray[this.m_seriesNames[i]] = [];
			this.m_PointsColorsArray[this.m_seriesNames[i]] = [];
			var seriesDataLength=this.m_seriesData[i].length;
			for (var j = 0; j < seriesDataLength; j++) {
				this.m_seriesColorsArray[this.m_seriesNames[i]][j] = seriesColors[this.m_seriesNames[i]];
				this.m_PointsColorsArray[this.m_seriesNames[i]][j] = conditionalColors[this.m_seriesNames[i]][j];
			}
		}
	} else {
		var seriesColors = this.getSeriesColors();
		var seriesLength=this.m_seriesData.length;
		for (var i = 0; i < seriesLength; i++) {
			this.m_seriesColorsArray[this.m_seriesNames[i]] = [];
			this.m_PointsColorsArray[this.m_seriesNames[i]] = [];
			var seriesDataLength=this.m_seriesData[i].length;
			for (var j = 0; j < seriesDataLength; j++) {
				this.m_seriesColorsArray[this.m_seriesNames[i]][j] = seriesColors[this.m_seriesNames[i]];
				this.m_PointsColorsArray[this.m_seriesNames[i]][j] = seriesColors[this.m_seriesNames[i]];
			}
		}
	}
};

/***************************************** Getter Methods ******************************************************/
/** @description Getter Method of DataProvider **/
MixedChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description Getter for All Series names**/
MixedChart.prototype.getAllSeriesNames = function () {
	return this.m_allSeriesNames;
};
/** @description Getter for All Series names**/
MixedChart.prototype.getAllCategoryNames = function () {
	return this.m_allCategoryNames;
};

/** @description Getter Method of CategoryNames **/
MixedChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};

/** @description Getter Method of CategoryDisplayNames **/
MixedChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

/** @description Getter Method of SeriesNames **/
MixedChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};
/** @description Getter Method of Annotation Names **/
MixedChart.prototype.getSeriesNames=function(){
	return this.m_seriesNames ;
};
/** @description Getter Method of SeriesDisplayNames **/
MixedChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};
/** @description Getter Method of LegendColors **/
MixedChart.prototype.getLegendColors = function () {
	return this.m_LegendColors;
};

/** @description Getter Method of LegendTableContent **/
MixedChart.prototype.getLegendTableContent = function () {
	var legendTable = "";
	for (var i = 0; i < this.getLegendNames().length; i++) {
		var shape = this.legendMap[this.m_seriesNames[i]].shape;
		var orgShape = this.getHTMLShape(shape);
		legendTable += "<tr style=\"font-style:" + this.m_legendfontstyle + ";color:" + convertColorToHex(this.m_legendfontcolor) + ";text-decoration:" + this.m_legendtextdecoration + ";font-weight:" + this.m_legendfontweight + ";font-family:" + selectGlobalFont(this.m_legendfontfamily) + "\">"+
							"<td>"+this.drawLegendShape(orgShape,this.getLegendColors()[i])+"<span style=\"display:inline;\">" + this.getLegendNames()[i] +"</span></td></tr>";
	}
	return legendTable;
};

/** @description Getter Method of SeriesColor **/
MixedChart.prototype.getSeriesColors = function () {
	return this.m_seriesColors;
};

/** @description Getter Method of LegendNames **/
MixedChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};

/** @description getter Method for get DataFromJSON according to fieldName **/
MixedChart.prototype.getDataFromJSON = function (fieldName) {
	var data = [];
	var dataProviderData=this.getDataProvider();
	
	var arrayLength=this.getDataProvider().length;
	for (var i = 0; i < arrayLength; i++) {
		if (dataProviderData[i][fieldName] == undefined)
			data[i] = "";
		else
			data[i] = dataProviderData[i][fieldName];
	}
	return data;
};

/** @description Getter Method of CategoryData **/
MixedChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

/** @description Getter Method of SeriesData **/
MixedChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

/** @description Getter Method of AllFieldsName **/
MixedChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

/** @description Getter Method of AllFieldsDisplayName **/
MixedChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

/** @description Getter Method of ColorsForSeries **/
MixedChart.prototype.getColorsForSeries = function () {
	return this.m_seriesColorsArray;
};

/**********************************************************************************************************/
/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
MixedChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description  Will create DraggableDiv and DraggableCanvas and initialize mouse event for component .**/
MixedChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/***************************************** Initialize Methods ******************************************8************/
/** @description initialization of Timeline Chart **/
MixedChart.prototype.init = function () {
	this.setCategorySeriesData();
	this.setAllFieldsName();
	this.setAllFieldsDisplayName();
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

MixedChart.prototype.registerDateInMapForSeriesIndex = function () {
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
	var seriesLength=this.m_seriesNames.length;
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

/** @description create a Map and registered all fields data into map according to their ChartType and Axis **/
MixedChart.prototype.registerDataInMap = function () {
	this.seriesDataMap = {};
	this.seriesDataMap = {
		"left" : {
			"column" : {},
			"line" : {}

		},
		"right" : {
			"column" : {},
			"line" : {}

		}
	};
	var seriesLength=this.m_seriesNames.length;
	for (var i = 0; i < seriesLength; i++) {
		if (this.m_seriesVisibleArr[this.m_seriesNames[i]])
			this.seriesDataMap[this.m_seriesAxis[i]][this.m_seriesChartType[i]][this.m_seriesNames[i]] = this.m_seriesData[i];
	}
};

/** @description method will update data for 100% chart. **/
MixedChart.prototype.updateDataforHundred = function (originalDataMap) {
	this.changedDataMap = getDuplicateObject( originalDataMap );
	/**Added this variable for data label*/
	this.m_actualseriesdatamap = getDuplicateObject( originalDataMap );
	if(this.m_charttype=="100%"){
		this.changedDataMap.left.column=(!$.isEmptyObject(this.changedDataMap.left.column))?this.getUpdatedData(this.changedDataMap.left.column):this.changedDataMap.left.column;
		this.changedDataMap.right.column=(!$.isEmptyObject(this.changedDataMap.right.column))?this.getUpdatedData(this.changedDataMap.right.column):this.changedDataMap.right.column;
	}
};

/** @description method will provide the updated data. **/
MixedChart.prototype.getUpdatedData = function (columnMap) {
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
	var newArr = {};
	for(var i=0;i<keyArr.length;i++){
		newArr[keyArr[i]]=data[i];
	}
	return newArr;
};
/** @description method will arrenge Data forHundred. **/
MixedChart.prototype.arrengeDataforHundred = function (array,actualArray) {
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
MixedChart.prototype.getArraySUM = function (arr) {
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
MixedChart.prototype.getUpdateSeriesDataWithCategory = function (arr) {
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
MixedChart.prototype.getUpdateSeriesDataForHundredPercentageChart = function (arr,actualArray) {
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
/*   ***  */

/** @description calculate Minimum and Maximum for both left and right Axis **/
MixedChart.prototype.calculateMinMax = function () {
	var leftAxisData = this.getAxisData(this.seriesDataMap["left"]);
	var rightAxisData = this.getAxisData(this.seriesDataMap["right"]);
	this.leftAxisInfo = this.getAxisInfo("left", leftAxisData);
	this.rightAxisInfo = this.getAxisInfo("right", rightAxisData);
	this.manageLeftRightMarker(this.leftAxisInfo, this.rightAxisInfo);
};

/** @description store leftAxis and rightAxis info corresponding class var this.leftAxisInfo and this.rightAxisInf **/
MixedChart.prototype.manageLeftRightMarker = function (leftAxisInfo, rightAxisInfo) {
	if (leftAxisInfo.markerarray.length > 1 && rightAxisInfo.markerarray.length > 1 && (leftAxisInfo.markerarray.length !== rightAxisInfo.markerarray.length)) {
		if (leftAxisInfo.markerarray.length > rightAxisInfo.markerarray.length) {
			var diff = leftAxisInfo.markerarray.length - rightAxisInfo.markerarray.length;
			for (var i = 0; i < diff; i++) {
				rightAxisInfo.markerarray.push(rightAxisInfo.max + rightAxisInfo.markertext);
				rightAxisInfo.max = rightAxisInfo.max + rightAxisInfo.markertext;
			}
			this.rightAxisInf = rightAxisInfo;
		} else {
			var diff = rightAxisInfo.markerarray.length - leftAxisInfo.markerarray.length;
			for (var i = 0; i < diff; i++) {
				leftAxisInfo.markerarray.push(leftAxisInfo.max + leftAxisInfo.markertext);
				leftAxisInfo.max = leftAxisInfo.max + leftAxisInfo.markertext;
			}
			this.leftAxisInfo = leftAxisInfo;
		}
	}
	return;
};

/** @description method return data of AllSeries , LineSeries and ColumnSeries for any Axis **/
MixedChart.prototype.getAxisData = function (map) {
	var lineArr = [];
	var columnArr = [];
	var allData = [];
	for (var key in map) {
		for (var key1 in map[key]) {
			if (key1 != "unique" && key1 != "contains") {
				allData.push(map[key][key1]);
				if (key == "line")
					lineArr.push(map[key][key1]);
				if (key == "column")
					columnArr.push(map[key][key1]);
			}
		}
	}
	return {
		all : allData,
		line : lineArr,
		column : columnArr
	};
};

/** @description this method provides the All(min, max, noofmarker, markertext, markerarray) information for any Axis **/
MixedChart.prototype.getAxisInfo = function (axis, axisData) {
	if( axisData.all.length>0){
		var basezero = (axis == "left") ? this.m_basezero : this.m_secondaxisbasezero;
		var autoaxissetup = (axis == "left") ? this.m_autoaxissetup : this.m_secondaxisautosetup;
		var minimumaxisvalue = (axis == "left") ? this.m_minimumaxisvalue : this.m_secondaxisminimumvalue;
		var maximumaxisvalue = (axis == "left") ? this.m_maximumaxisvalue : this.m_secondaxismaximumvalue;
		if ((this.m_charttype == "stacked"||this.m_charttype=="100%") && axisData.column.length > 0) {
			var tempminmaxline = (axisData.line.length > 0) ? this.calculateMinMaxValue(axisData.line) : {
				min : "",
				max : ""
			};
			var tempminmaxcolumn = this.calculateStackMinMaxValue(axisData.column);
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
		} else
			var minMax = this.calculateMinMaxValue(axisData.all);
	
		var calculatedMin = minMax.min;
		var calculatedMax = minMax.max;
		var obj=this.getCalculateNiceScale(calculatedMin, calculatedMax, basezero, autoaxissetup, minimumaxisvalue, maximumaxisvalue,(this.m_height), axis);
		return {
			max : obj.max,
			min : obj.min,
			noofmarker : obj.markerArray.length,
			markertext : obj.step,
			markerarray : obj.markerArray
		};
	}
	else{
		return {
			max : "",
			min : "",
			noofmarker :  "",
			markertext :  "",
			markerarray :  ""
		};
	}
};

/** @description this method provides the All (Axis, Chart, Data) info for Any Series **/
MixedChart.prototype.getSeriesInfo = function (seriesName) {
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
MixedChart.prototype.calculateStackMinMaxValue = function (dataArr) {
	var calculateMax = (isNaN(dataArr[0][0]*1)) ? 0 : dataArr[0][0]*1;
	var calculateMin = (isNaN(dataArr[0][0]*1)) ? 0 : dataArr[0][0]*1;
	var data = [];
	var dataLength=dataArr[0].length;
	if (this.m_charttype == "stacked" ){
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
	
	if (this.m_charttype == "100%" ) {
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
MixedChart.prototype.instanciateSeries = function (map) {
	var columncount = 0;
	for (key in map) {
		for (var chartKey in map[key]) {
			for (var seriesKey in map[key][chartKey]) {
				if (seriesKey != "unique" && seriesKey != "contains") {
					if (chartKey == "column") {
						columncount++;
						if(this.m_charttype=="clustered"){
							this.m_mixedCalculation.columnWidthMap[seriesKey] = this.m_mixedCalculation.columnWidthMap[seriesKey]*this.clusteredbarpadding;
						}
						this.m_columnSeries[seriesKey] = new MixedColumns();
						this.m_columnSeries[seriesKey].init(this.m_PointsColorsArray[seriesKey], this.m_mixedCalculation.getXPositionArray(seriesKey), this.m_mixedCalculation.getYPositionArray(seriesKey), this.m_mixedCalculation.getHeightArray(seriesKey), (this.m_mixedCalculation.columnWidthMap[seriesKey] / this.m_mixedCalculation.totalColumn),this.m_strokecolor, this.m_showgradient,this, this.m_transparencyarr[seriesKey],this.m_mixedCalculation.seriesDataMap[key][chartKey][seriesKey]);//this.m_plotTrasparencyArray[seriesKey]
					} else {
						this.m_lineSeries[seriesKey] = new MixedLines();
						this.m_lineSeries[seriesKey].init(this.getColorsForSeries()[seriesKey], this.m_mixedCalculation.getXPositionArray(seriesKey), this.m_mixedCalculation.getYPositionArray(seriesKey), this.m_linewidth, this, 1, seriesKey, this.m_lineWidthArray[seriesKey], this.m_lineTypeArray[seriesKey]); //sending default plotTrasparencyArray 1 for line
						if (this.getShowPoint() || (this.m_mixedCalculation.xAxisData.length==1)) {
							this.m_pointSeries[seriesKey] = new MixedPoints();
							this.m_pointSeries[seriesKey].init(this.m_PointsColorsArray[seriesKey], this.m_plotRadiusArray[seriesKey], this.m_mixedCalculation.getXPositionArray(seriesKey), this.m_mixedCalculation.getYPositionArray(seriesKey), this, this.m_transparencyarr[seriesKey],this.m_plotShapeArray[seriesKey]);//this.m_plotTrasparencyArray[seriesKey]
						}
					}
					if (IsBoolean(this.m_seriesDataLabelProperty[seriesKey].showDataLabel)) {
						this.setSeriesDataLabel(seriesKey);
						if (this.m_charttype == "100%") {
						    /**Added for BDD-681, in this datalabel won't draw if stack won't draw and its actual value wouldn't be zero.*/
						   var dataActual = this.m_actualseriesdatamap[key][chartKey][seriesKey];
						} else {
						  var  dataActual = this.m_mixedCalculation.seriesDataMap[key][chartKey][seriesKey];
						}
					    this.m_valueTextSeries[seriesKey] = new ValueTextSeries();
					    this.m_valueTextSeries[seriesKey].init(this.m_mixedCalculation.getXPositionArray(seriesKey), this.m_mixedCalculation.getYPositionArray(seriesKey), this, this.m_seriesDataForDataLabel[seriesKey],this.m_seriesDataLabelProperty[seriesKey],dataActual, (this.m_mixedCalculation.columnWidthMap[seriesKey] / this.m_mixedCalculation.totalColumn), this.m_mixedCalculation.heightMap[seriesKey],chartKey);
					}
				}
			}
		}
	}
};
/** @description creating series data for data label**/
MixedChart.prototype.setSeriesDataLabel = function(key) {
    this.m_seriesDataForDataLabel = {};
    for (var k = 0, length = this.getDataProvider().length; k < length; k++) {
        var record = this.getDataProvider()[k];
        if (!this.m_seriesDataForDataLabel[key]) {
            this.m_seriesDataForDataLabel[key] = [];
        }
        var dataFordatalabel = this.getValidFieldDataFromRecord(record, this.m_seriesDataLabelProperty[key].datalabelField);
        this.m_seriesDataForDataLabel[key][k] = dataFordatalabel;
    }
};
/** @description instanciate and initialize Calculation Class **/
MixedChart.prototype.initializeCalculationClass = function () {
	this.m_annotationSeries = {};
	this.m_radius = this.m_lineWidthArray
	this.m_mixedCalculation = new MixedCalculation();
	this.setChartDrawingArea();
	this.m_mixedCalculation.init(this, this.m_seriesData, 0, this.m_categoryData, this.changedDataMap);
	this.setThresholdFillColors();
};

/** @description initialize Yaxis for TimeSeries Chart  **/
MixedChart.prototype.initializeYAxis = function () {
	this.m_yAxis.init(this, this.m_mixedCalculation);
	this.m_xAxis.init(this, this.m_mixedCalculation);
};

/** @description overrite drawObject Method  because of ChartFrame and Titles are drawn on Canvas  **/
MixedChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	var map = this.IsDrawingPossible();
	if (IsBoolean(map.permission)) {
		this.drawXAxis();
		this.drawYAxis();
		this.drawMixedSeries();
		if (IsBoolean(this.m_showannotation)) {
			/**check story annotation from data file */
		if(this.m_annotationXData.length>0 || this.m_annotationxdata.length>0){
			if(this.m_annotationxdata.length>0){
			this.m_annotationXData = this.m_annotationxdata;	
			}
			this.drawAnnotationChart();
		}else {
				this.drawMessage(this.m_status.noAnnotationValue);
			}
		}
		this.drawDataLabel();
		this.drawThreshold();
	} 
	else {
		this.drawMessage(map.message);
	}
};

/** @description Will Draw the ChartFrame and fill gradients. **/
MixedChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

/** @description Will Draw Title on canvas if showTitle set to true **/
MixedChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

/** @description Will Draw SubTitle on Canvas if showSubTitle set to true **/
MixedChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

/** @description Draw X-axis and marker of x-axis on Canvas  **/
MixedChart.prototype.drawXAxis = function () {
	this.m_xAxis.drawTickMarks();
	this.m_xAxis.drawVerticalLine();
	this.m_xAxis.markXaxis();
	this.m_xAxis.drawXAxis();
};

/** @description Draw y-axis (leftAxis and rightAxis) and marker of y-axis on Canvas.  **/
MixedChart.prototype.drawYAxis = function () {
	if (IsBoolean(this.m_showmarkerline))
	    this.m_yAxis.horizontalMarkerLines();
	if (IsBoolean(this.m_zeromarkerline) && !IsBoolean(this.m_basezero) && IsBoolean(this.m_yAxis.hasNegativeAxisMarker(this.m_yAxis.m_yAxisMarkersArray)))
	    this.m_yAxis.zeroMarkerLine();
	if (this.leftAxisInfo.markerarray.length > 0) {
	    this.m_yAxis.markYaxis();
	    this.m_yAxis.drawYAxis();
	}
	if (IsBoolean(this.m_secondaryaxisshow) && this.rightAxisInfo.markerarray.length > 0) {
	    this.drawSecondaryAxis();
	}
};

/** @description Draw SecondaryAxis (right-axis) and marker on Canvas.  **/
MixedChart.prototype.drawSecondaryAxis = function () {
	this.m_yAxis.secondaryAxisInit(this.m_mixedCalculation);
	this.m_yAxis.drawSecondaryAxis();
};

/** @description Draw Timeline itrate for all series and draw visible series.  **/
MixedChart.prototype.drawMixedSeries = function () {
	var seriesLength=this.m_seriesNames.length;
	for (var i = 0; i < seriesLength; i++) {
		if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
			if (this.m_lineSeries[this.m_seriesNames[i]] == undefined) {
				this.m_columnSeries[this.m_seriesNames[i]].drawColumns();
			} else {
				this.m_lineSeries[this.m_seriesNames[i]].drawLineSeries();
				if (IsBoolean(this.getShowPoint()) || (this.m_mixedCalculation.xAxisData.length==1)){
				    this.m_pointSeries[this.m_seriesNames[i]].drawPointSeries();
				}
			}
		}
	}
};
/** @description Will Draw Annotations on Mixed chart  **/
MixedChart.prototype.drawAnnotationChart=function(){
	this.m_annotationSeries = {};
	
	if(	this.m_categoryData[0].length>1 || (	this.m_categoryData[0].length ==1 && this.m_annotationformat == "year")){
	for (var i = 0, length = this.m_seriesNames.length; i < length; i++) {
		if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
			if (IsBoolean(this.m_showannotation) || (this.m_mixedCalculation.xannotationPosArray == 1)) {
				/**DAS-954 */
				/**chck annotation points */
				this.m_annotationSeries[this.m_seriesNames[i]] = new MixAnnotSeries();
				this.m_annotationSeries[this.m_seriesNames[i]].init(this.m_PointsColorsArray[this.m_seriesNames[i]], (this.m_radius[this.m_seriesNames[i]] * 1) + 1, this.m_mixedCalculation.xannotationPosArray, this.m_mixedCalculation.getYPositionArray(this.m_seriesNames[i]), this, this.m_transparencyarr[this.m_seriesNames[i]], this.m_plotShapeArray[this.m_seriesNames[i]], this.m_plotRadiusArray[this.m_seriesNames[i]]);//this.m_plotTrasparencyArray[i1]
				this.m_annotationSeries[this.m_seriesNames[i]].drawPointSeries();

			}
		}
	}
	}
};
/** @description Draw MixedChart itrate for all series and draw Data Label for visible series.  **/
MixedChart.prototype.drawDataLabel = function() {
	/**Added for Data Label Overlap issue*/
	this.m_overlappeddatalabelarrayY = [];
	this.m_overlappeddatalabelarrayX = [];
    var seriesLength = this.m_seriesNames.length;
    for (var i = 0; i < seriesLength; i++) {
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
            if (IsBoolean(this.m_seriesDataLabelProperty[this.m_seriesNames[i]].showDataLabel)) {
                this.m_valueTextSeries[this.m_seriesNames[i]].drawValueTextSeries();
            }
        }
    }
};
/** @description drawing Thresholdline on MixedChart DAS-952**/
MixedChart.prototype.drawThreshold = function() {
	if (IsBoolean(this.m_showyaxisthreshold)) {
		var lineWidth = 0.5;
		var antiAliasing = 0.5;
		var secondAxis = this.m_mixedCalculation.rightAxisInfo.markerarray;
		if (this.m_secondaryaxisshow && secondAxis != "") {
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
		if (this.m_secondaryaxisshow  && secondAxis!="" ) {
			if (IsBoolean(this.m_secondaxisautosetup) && IsBoolean(this.m_secondaxisbasezero)) {
/*				if ((this.m_minimumyaxisthreshold * 1) <= (this.m_maximumyaxisthreshold * 1)) {*/
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
					this.drawMessage(this.m_status.notValidthresholdValues);
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
			/*} else {
				this.drawMessage(this.m_status.notValidthresholdValues);
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
/** @description y-axis threshold pixel calculation Mixed chart DAS-952**/
MixedChart.prototype.thresholdYAxisCalculation = function(fData , lData , perYPixel) {
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
	/*		if ((this.m_minimumyaxisthreshold * 1) <= (this.m_maximumyaxisthreshold * 1)) {*/
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
				this.drawMessage(this.m_status.notValidthresholdValues);
			}*/
		}
	} else {
		if (lData < 0) {		// Left Axis is +ve && Right Axis is -ve
//			console.log("C");
		} else {		// Left Axis is +ve && Right Axis is +ve
/*			if ((this.m_minimumyaxisthreshold * 1) <= (this.m_maximumyaxisthreshold * 1)) {*/
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
				this.drawMessage(this.m_status.notValidthresholdValues);
			}*/

		}
	}
	return pixelMap;
};
/** @description y-axis threshold line drawing in Mixed chart DAS-952**/
MixedChart.prototype.drawThresholdLineBetweenPoints = function(fdata,ldata,thresholdvalue,lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2, text, textcolor,opacity) {
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.lineWidth = lineWidth;
	this.ctx.translate(antiAliasing, antiAliasing);
	this.ctx.strokeStyle = hex2rgb(strokeColor, opacity);
	var fillcolor = strokeColor;
	this.ctx.moveTo(parseInt(x1), parseInt(y1));
	this.ctx.lineTo(parseInt(x2), parseInt(y2));
	this.ctx.stroke();
	this.ctx.fillStyle = fillcolor;
	this.ctx.rotate(-Math.PI / 2);
	this.ctx.restore();
	this.ctx.closePath();
	//points to fill theshold lines
	if(thresholdvalue > fdata && thresholdvalue < ldata){
		var lines = {"X1":x1,"Y1":y1,"X2":x2,"Y2":y2};
		this.m_fillcolorarray.push(lines); 
	}

};
/** @description filling color for threshold range on MixedChart chart **/
MixedChart.prototype.fillColorBetweenPoints = function(fillArray) {
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
		this.ctx.fillStyle = hex2rgb(this.m_fillBelowLowerThreshold, this.m_fillBelowThresholdOpacity * 1);
		this.ctx.fillRect(minX, minY1, width1, height1);
		/*label drawing*/
		this.ctx.font = "16px Arial";
		this.ctx.fillStyle = hex2rgb(this.m_BelowThresholdLabelColor,1);
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(this.m_BelowThresholdLabel, centerX, centerY);
		

		// Fill color between minY and maxY
		var minY2 = minY;
		var maxY2 = maxY;
		var height2 = maxY2 - minY2;
		this.ctx.fillStyle = hex2rgb(this.m_fillBetweenThreshold, this.m_fillBetweenThresholdOpacity * 1);
		this.ctx.fillRect(minX, minY2, width1, height2);
		/*label drawing*/
		var centerY2 = minY2 + height2 / 2;/*label*/
		this.ctx.font = "16px Arial";
		this.ctx.fillStyle = hex2rgb(this.m_BetweenThresholdLabelColor,1);
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		if (height2 > 0) {
			this.ctx.fillText(this.m_BetweenThresholdLabel, centerX, centerY2);
		}

		// Fill color between minY and endY
		var minY3 = Math.min(minY, this.m_endY);
		var maxY3 = Math.max(minY, this.m_endY);
		var height3 = maxY3 - minY3;
		
		var centerY3 = minY3 + height3 / 2/*label*/
		this.ctx.fillStyle = hex2rgb(this.m_fillAboveUpperThreshold, this.m_fillUpperThresholdOpacity * 1);
		this.ctx.fillRect(minX, minY3, width1, height3);
		// label drawing
		this.ctx.font = "16px Arial";
		this.ctx.fillStyle = hex2rgb(this.m_UpperThresholdLabelColor,1);
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(this.m_UpperThresholdLabel, centerX, centerY3);
		
	}
};
/** @description Setter Method to set ThresholdFillColors. **/
MixedChart.prototype.setThresholdFillColors = function() {
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
/** @description calculate the drill data point and return required info  **/
MixedChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
		 var temp = this;
		 var map = this.seriesDataMapForIndex;
		 if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory))) && IsBoolean(this.isVisibleSeries())) {
		  var columnWidth = this.m_mixedCalculation.columnWidth / this.m_mixedCalculation.totalColumn;
		  var pointRadius = 5;
		  var isDrillIndexFound = false;
		  var drillMinStackHeight = (this.m_charttype == "stacked") ? 0 : this.m_drillminstackheight;
		  if ((mouseX >= this.getStartX() && mouseX <= this.getEndX()) && (mouseY <= this.getStartY() && mouseY >= this.getEndY())) {
		   /*for (key in map) {
		    for (chartKey in map[key]) {
		     for (seriesKey in map[key][chartKey]) {
		      if (seriesKey != "unique" && seriesKey != "contains") {
		       var xpixcel = this.m_mixedCalculation.getXPositionArray(seriesKey);
		       var ypixcel = this.m_mixedCalculation.getYPositionArray(seriesKey);
		       var xpixelLength=xpixcel.length;
		       for (var i = 0; i < xpixelLength; i++) {
		        var xpixl1 = (chartKey == "line") ? (xpixcel[i] - pointRadius) : xpixcel[i];
		        var xpixl2 = (chartKey == "line") ? (xpixcel[i] * 1 + pointRadius) : xpixcel[i] + columnWidth;
		        var ypixl1 = (chartKey == "line") ? (ypixcel[i] + pointRadius) : this.getStartY();
		        var ypixl2 = (chartKey == "line") ? (ypixcel[i] * 1 - pointRadius) : ypixcel[i];
		        
		        if (mouseX <= (xpixl2  1) && mouseX >= (xpixl1  1) && mouseY <= ypixl1 && mouseY >= ypixl2) {
		         var catDataLength=this.m_categoryData[0].length;
		         for (var k = 0; k < catDataLength; k++) {
		          if (this.m_categoryData[0][i] == this.m_categoryData[0][k])
		           break;
		         }
		         var fieldNameValueMap = this.getFieldNameValueMap(k);
		         var drillColor = this.getSeriesColors()[seriesKey];
		         var drillField = seriesKey;
		         var drillDisplayField = this.m_seriesDisplayNamesMap[seriesKey];
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
		   }*/
		   for (chartKey in map) {
		    for (var axisKay in map[chartKey]) {
		      var index = 0;
		      if(this.m_charttype=="overlaid" && chartKey=="column"){
		       var seriesKey = this.m_seriesNames;
		       var WidthArr=this.m_mixedCalculation.overlaidColWidth[axisKay][chartKey];
		       for (var j = seriesKey.length - 1; j >=0; j--) {
		        var xpixcel = this.m_mixedCalculation.getXPositionArray(seriesKey[j]);
		        var ypixcel = this.m_mixedCalculation.getYPositionArray(seriesKey[j]);
		        if(xpixcel != undefined && ypixcel != undefined){
		         for (var i = 0, xpixcelLength = xpixcel.length; i < xpixcelLength; i++) {
		        	 var StackHeight1 = 0;
                     var StackHeight2 = 0;
                 	if ((chartKey == "column")&&(this.m_columnSeries[seriesKey[j]] !== undefined)&&(this.m_columnSeries[seriesKey[j]].m_stackHeightArray[i] * 1 < drillMinStackHeight)) {
                 	    StackHeight1 = (this.m_columnSeries[seriesKey[j]].m_ySeriesData[i] * 1 < 0) ? (IsBoolean(this.m_basezero) ? 0 : drillMinStackHeight) : 0;
                 	    StackHeight2 = (this.m_columnSeries[seriesKey[j]].m_ySeriesData[i] * 1 < 0) ? 0 : drillMinStackHeight;
                 	}
		          var xpixl1 = (chartKey == "line") ? (xpixcel[i] - pointRadius) : xpixcel[i];
		          var xpixl2 = (chartKey == "line") ? (xpixcel[i] * 1 + pointRadius) : (_.has( this.m_columnSeries, seriesKey[j])) ?  xpixcel[i] + this.m_mixedCalculation.columnWidthMap[seriesKey[j]] : 0;
		          var ypixl1 = (chartKey == "line") ? (ypixcel[i] + pointRadius) : (_.has( this.m_columnSeries, seriesKey[j])) ? ypixcel[i] + this.m_columnSeries[seriesKey[j]].m_stackHeightArray[i] + StackHeight1 : 0;
		          var ypixl2 = (chartKey == "line") ? (ypixcel[i] * 1 - pointRadius) : ypixcel[i] - StackHeight2;
		    
		          if (mouseX <= (xpixl2 * 1) && mouseX >= (xpixl1 * 1) && mouseY <= ypixl1 && mouseY >= ypixl2) {
		           /*for (var k = 0; k < this.m_categoryData[0].length; k++) {
		            if (this.m_categoryData[0][i] == this.m_categoryData[0][k])
		             break;
		           }*/
		            var fieldNameValueMap = this.getFieldNameValueMap(i);
		            /**Clicked color drills as the drill-color not series color.*/
		            var drillColor = this.m_PointsColorsArray[this.m_seriesNames[j]][i];
		            var drillField = this.m_seriesNames[j];
		            var drillDisplayField = this.m_seriesDisplayNamesMap[this.m_seriesNames[j]];
		            var drillValue = fieldNameValueMap[drillField];
		            fieldNameValueMap.drillField = drillField;
		            fieldNameValueMap.drillDisplayField = drillDisplayField;
		            fieldNameValueMap.drillValue = drillValue;
		            return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
		          }
		         }
		        }
		        index++;
		       }
		      }
		      else
		      {
		       var seriesKey = this.m_seriesNames.filter(function(key){return temp.m_seriesVisibleArr[key]});
		       for (var k = seriesKey.length - 1; k >=0; k--) {
		        if (seriesKey[k] != "unique" && seriesKey[k] != "contains") {
		         var xpixcel = this.m_mixedCalculation.getXPositionArray(seriesKey[k]);
		         var ypixcel = this.m_mixedCalculation.getYPositionArray(seriesKey[k]);
		         var xpixcelLength=xpixcel.length;
		         for (var i = 0; i < xpixcelLength; i++) {
		        	 var StackHeight1 = 0;
                     var StackHeight2 = 0;
                 	if ((chartKey == "column")&&(this.m_columnSeries[seriesKey[k]] !== undefined)&&(this.m_columnSeries[seriesKey[k]].m_stackHeightArray[i] * 1 < drillMinStackHeight)) {
                 	    StackHeight1 = (this.m_columnSeries[seriesKey[k]].m_ySeriesData[i] * 1 < 0) ? (IsBoolean(this.m_basezero) ? 0 : drillMinStackHeight) : 0;
                 	    StackHeight2 = (this.m_columnSeries[seriesKey[k]].m_ySeriesData[i] * 1 < 0) ? 0 : drillMinStackHeight;
                 	}
		        	 pointRadius = (this.m_plotRadiusArray[seriesKey[k]] > pointRadius) ? this.m_plotRadiusArray[seriesKey[k]] : pointRadius;
		        	 var xpixl1 = (chartKey == "line") ? (xpixcel[i] - pointRadius) : xpixcel[i];
		        	 var xpixl2 = (chartKey == "line") ? (xpixcel[i] * 1 + pointRadius) : (_.has( this.m_columnSeries, seriesKey[k])) ? xpixcel[i] + this.m_columnSeries[seriesKey[k]].m_stackWidth : 0;
		        	 var ypixl1 = (chartKey == "line") ? (ypixcel[i] + this.m_plotRadiusArray[seriesKey[k]] * 1) : (_.has( this.m_columnSeries, seriesKey[k])) ? ypixcel[i] + this.m_columnSeries[seriesKey[k]].m_stackHeightArray[i] + StackHeight1: 0;
		        	 var ypixl2 = (chartKey == "line") ? (ypixcel[i] * 1 - pointRadius) : ypixcel[i] - StackHeight2;
		  
		          if (mouseX <= (xpixl2 * 1) && mouseX >= (xpixl1 * 1) && mouseY <= ypixl1 && mouseY >= ypixl2) {
		           /*for (var k = 0; k < this.m_categoryData[0].length; k++) {
		            if (this.m_categoryData[0][i] == this.m_categoryData[0][k])
		             break;
		           }*/
		        	  /*for(var a=0;a<seriesKey.length;a++){
		        		  this.m_transparencyarr[seriesKey[a][i]] = 1;
		        	  }*/
		        	  if(IsBoolean(this.enableDrillHighlighter)){
							for(var a = 0; a < seriesKey.length; a++){
								for(var b = 0; b < this.m_transparencyarr[seriesKey[a]].length; b++){
									if(IsBoolean(this.m_drilltoggle)){
										this.m_transparencyarr[seriesKey[a]][b] = 0.5;//this.m_transparencyarr[seriesKey[a]][b] = 0.5;
									} else {
										this.m_transparencyarr[seriesKey[a]][b] = 1;
									}
								}
								this.m_transparencyarr[seriesKey[a]][i] = 1;//this.m_transparency[a];
							}
							this.instanciateSeries(this.seriesDataMap);
							//this.m_yAxis.m_yAxisMarkersArray = "";
						  	//this.m_yAxis.m_isSecodaryAxis = false;
							this.drawChart();
						}
		        	  	/*if(IsBoolean(this.m_drilltoggle)){
							this.m_drilltoggle = false;
						} else {
							this.m_drilltoggle = true;
						}*/
					this.m_drilltoggle = false;
		            var fieldNameValueMap = this.getFieldNameValueMap(i);
		            var drillCategory = this.m_categoryNames;
					var drillCategoriesValue = [];
					for(var a=0;a<drillCategory.length;a++){
						drillCategoriesValue.push(fieldNameValueMap[drillCategory[a]]);
					}
		            /**Clicked color drills as the drill-color not series color.*/
		            var drillColor = this.m_PointsColorsArray[seriesKey[k]][i];
		            var drillField = seriesKey[k];
		            var drillDisplayField = this.m_seriesDisplayNamesMap[seriesKey[k]];
		            var drillValue = fieldNameValueMap[drillField];
		            fieldNameValueMap.drillField = drillField;
		            fieldNameValueMap.drillDisplayField = drillDisplayField;
		            fieldNameValueMap.drillValue = drillValue;
		            isDrillIndexFound = true;
		            fieldNameValueMap.drillIndex = i;
					fieldNameValueMap.drillCategoriesNames = drillCategory;
					fieldNameValueMap.drillCategory = drillCategoriesValue;
		            return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
		          }
		         }
		        }
		       }
		      }
		    }
		   }
		   if(this.m_charttype == "stacked" && !isDrillIndexFound) {
			   var xPositionsArray = this.m_mixedCalculation.getxPositionTooltipArray();
			   var m_plotRadius = this.m_mixedCalculation.columnWidth / 2;
				for (var k = 0, length = xPositionsArray.length; k < length; k++) {
					if (mouseX <= (xPositionsArray[k] * 1 + m_plotRadius) && (mouseX >= xPositionsArray[k] * 1 - m_plotRadius)) {
						var seriesKey = this.m_seriesNames;
						for(var l = 0,innerlength = seriesKey.length; l < innerlength; l++){
							var ypixcel = this.m_mixedCalculation.getYPositionArray(seriesKey[l]);
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
		  }
		 }
};
	
/** @description Will find and return Tooltip data of Mixed chart  **/
MixedChart.prototype.getToolTipData = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory) && IsBoolean(this.isVisibleSeries()) && IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")) {
		var toolTipData;
		var m_plotRadius = this.m_mixedCalculation.columnWidth / 2;
		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			var xPositionsArray = this.m_mixedCalculation.getxPositionTooltipArray();
			var seriesData = (this.getSeriesData());
			var xPosArrayLength = xPositionsArray.length;
			for (var i = 0; i < xPosArrayLength; i++) {
				if (mouseX <= (xPositionsArray[i] * 1 + m_plotRadius) && (mouseX >= xPositionsArray[i] * 1 - m_plotRadius)) {
					toolTipData = {};
					toolTipData.cat = "";
					toolTipData["data"] = new Array();
					toolTipData.cat = this.getCategoryData()[0][i];
					if (IsBoolean(this.m_customtextboxfortooltip.dataTipType == "Default")){
						var seriesLength=seriesData.length;
						for (var j = 0, k = 0; j < seriesLength; j++) {
							var newVal;
							if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[j]])) {
								var data = [];
								//data[0] = this.getSeriesColors()[this.m_seriesNames[j]];
								var toolTipColor = (IsBoolean(this.getShowPoint()) || (this.m_mixedCalculation.xAxisData.length==1)) ? this.m_PointsColorsArray[this.m_seriesNames[j]][i] : this.getColorsForSeries()[this.m_seriesNames[j]][i];
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
								
								if (this.m_charttype == "100%" && this.getSeriesDisplayNames().length > 1) 
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
								toolTipData.data[k] = data;
								k++;
							} 
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
		//Hovering on annotation DAS-953
		var xPositionsArray = this.m_mixedCalculation.getxPositionTooltipArray();
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
								data[0] = { "color": this.m_annotationcolor, "shape": "cube" };
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
MixedChart.prototype.getMonthYear = function(dateStr) {
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
MixedChart.prototype.getValuefromMap = function (series, index) {
	
	for(var key in  this.changedDataMap){
		for(var key1 in this.changedDataMap[key]){
			for(var key2 in this.changedDataMap[key][key1]){
				if(key2==series){
					return (key1=="line")?0:this.changedDataMap[key][key1][key2][index];
					//return this.changedDataMap[key][key1][key2][index];
				}
			}
		}
	}
	//this.changedDataMap;
};

/** @description Will calculate drill color for TimeLine chart  **/
MixedChart.prototype.getDrillColor = function (mouseX, mouseY) {
	var temp = this;
	var map = this.seriesDataMapForIndex;
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory)))) {
		var columnWidth = this.m_mixedCalculation.columnWidth / this.m_mixedCalculation.totalColumn;
		var pointRadius = 5;
		if ((mouseX >= this.getStartX() && mouseX <= this.getEndX()) && (mouseY <= this.getStartY() && mouseY >= this.getEndY())) {
			/**Added to resolve BDD-682 issue*/
			var drillMinStackHeight = (this.m_charttype == "stacked") ? 0 : this.m_drillminstackheight;
			for (chartKey in map) {
				for (axisKay in map[chartKey]) {
					var index = 0;
					if(this.m_charttype=="overlaid" && chartKey=="column"){
						var seriesKey = this.m_seriesNames;
						var WidthArr=this.m_mixedCalculation.overlaidColWidth[axisKay][chartKey];
						for (var j = seriesKey.length - 1; j >=0; j--) {
							var xpixcel = this.m_mixedCalculation.getXPositionArray(seriesKey[j]);
							var ypixcel = this.m_mixedCalculation.getYPositionArray(seriesKey[j]);
							if(xpixcel != undefined && ypixcel != undefined){
								for (var i = 0, xpixcelLength = xpixcel.length; i < xpixcelLength; i++) {
									var StackHeight1 = 0;
		                            var StackHeight2 = 0;
	                            	if ((chartKey == "column")&&(this.m_columnSeries[seriesKey[j]] !== undefined)&&(this.m_columnSeries[seriesKey[j]].m_stackHeightArray[i] * 1 < drillMinStackHeight)) {
	                            	    StackHeight1 = (this.m_columnSeries[seriesKey[j]].m_ySeriesData[i] * 1 < 0) ? (IsBoolean(this.m_basezero) ? 0 : drillMinStackHeight) : 0;
	                            	    StackHeight2 = (this.m_columnSeries[seriesKey[j]].m_ySeriesData[i] * 1 < 0) ? 0 : drillMinStackHeight;
	                            	}
									var xpixl1 = (chartKey == "line") ? (xpixcel[i] - pointRadius) : xpixcel[i];
									var xpixl2 = (chartKey == "line") ? (xpixcel[i] * 1 + pointRadius) : (_.has( this.m_columnSeries, seriesKey[j])) ?  xpixcel[i] + this.m_mixedCalculation.columnWidthMap[seriesKey[j]] : 0;
									var ypixl1 = (chartKey == "line") ? (ypixcel[i] + pointRadius) : (_.has( this.m_columnSeries, seriesKey[j])) ? ypixcel[i] + this.m_columnSeries[seriesKey[j]].m_stackHeightArray[i] + StackHeight1 : 0;
									var ypixl2 = (chartKey == "line") ? (ypixcel[i] * 1 - pointRadius) : ypixcel[i] - StackHeight2;
			
									if (mouseX <= (xpixl2 * 1) && mouseX >= (xpixl1 * 1) && mouseY <= ypixl1 && mouseY >= ypixl2) {
										for (var k = 0; k < this.m_categoryData[0].length; k++) {
											if (this.m_categoryData[0][i] == this.m_categoryData[0][k])
												break;
										}
										//return (WidthArr.length-1-index);
										return j;
									}
								}
							}
							//index++;
						}
					}
					else
					{
						var seriesKey = this.m_seriesNames.filter(function(key){return temp.m_seriesVisibleArr[key]});
						for (var j = seriesKey.length - 1; j >=0; j--) {
							if (seriesKey[j] != "unique" && seriesKey[j] != "contains") {
								var xpixcel = this.m_mixedCalculation.getXPositionArray(seriesKey[j]);
								var ypixcel = this.m_mixedCalculation.getYPositionArray(seriesKey[j]);
								var xpixcelLength=xpixcel.length;
								for (var i = 0; i < xpixcelLength; i++) {
									var StackHeight1 = 0;
		                            var StackHeight2 = 0;
	                            	if ((chartKey == "column")&&(this.m_columnSeries[seriesKey[j]] !== undefined)&&(this.m_columnSeries[seriesKey[j]].m_stackHeightArray[i] * 1 < drillMinStackHeight)) {
	                            	    StackHeight1 = (this.m_columnSeries[seriesKey[j]].m_ySeriesData[i] * 1 < 0) ? (IsBoolean(this.m_basezero) ? 0 : drillMinStackHeight) : 0;
	                            	    StackHeight2 = (this.m_columnSeries[seriesKey[j]].m_ySeriesData[i] * 1 < 0) ? 0 : drillMinStackHeight;
	                            	}
									var xpixl1 = (chartKey == "line") ? (xpixcel[i] - this.m_plotRadiusArray[seriesKey[j]] * 1) : xpixcel[i];
									var xpixl2 = (chartKey == "line") ? (xpixcel[i] * 1 + this.m_plotRadiusArray[seriesKey[j]] * 1) : (_.has( this.m_columnSeries, seriesKey[j])) ? xpixcel[i] + this.m_columnSeries[seriesKey[j]].m_stackWidth : 0;
									var ypixl1 = (chartKey == "line") ? (ypixcel[i] + this.m_plotRadiusArray[seriesKey[j]] * 1) : (_.has( this.m_columnSeries, seriesKey[j])) ? ypixcel[i] + this.m_columnSeries[seriesKey[j]].m_stackHeightArray[i] + StackHeight1: 0;
									var ypixl2 = (chartKey == "line") ? (ypixcel[i] * 1 - this.m_plotRadiusArray[seriesKey[j]] * 1) : ypixcel[i] - StackHeight2;
	
									if (mouseX <= (xpixl2 * 1) && mouseX >= (xpixl1 * 1) && mouseY <= ypixl1 && mouseY >= ypixl2) {
										for (var k = 0; k < this.m_categoryData[0].length; k++) {
											if (this.m_categoryData[0][i] == this.m_categoryData[0][k])
												break;
										}
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
/****************************Some Initial Calculation*****************************/

/** @description Setter Method for set startX  of MixedChart. **/
MixedChart.prototype.setStartX = function () {
	this.yaxisLabelFont = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
	this.yaxisDescriptionFont = this.m_yAxis.m_fontstyle + " " + this.m_yAxis.m_fontweight + " " + this.fontScaling(this.m_yAxis.m_fontsize) + "px " + selectGlobalFont(this.m_yAxis.m_fontfamily);
	var btdm = this.getBorderToDescriptionMargin();
	var dm = this.getYAxisDescriptionMargin();
	var dtlm = this.getDescriptionToLabelMargin();
	var ltam = this.getLabelToAxisMargin();
	var lm = this.getYAxisLabelMargin();
	var testStartX = this.m_x * 1 + btdm * 1 + dm * 1 + dtlm * 1 + lm * 1 + ltam * 1;
	//console.log(testStartX +"==m_x:"+this.m_x*1 +"==btdm:"+ btdm*1 +"==dm:"+ dm*1 +"==dtlm:"+ dtlm*1 +"==lm:"+ lm*1 +"==ltam:"+ ltam*1) ;
	this.m_startX = 1 * testStartX;
	//this.m_startX = (this.m_startX < 30) ? 35 : this.m_startX;
};

/** @description will calculate Y-Axis Label Margin of Chart  **/
MixedChart.prototype.getYAxisLabelMargin = function () {
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
MixedChart.prototype.getLabelFormatterMargin = function () {
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
MixedChart.prototype.getLabelWidth = function () {
	return this.m_labelwidth;
}
/** @description calculating the Label width for largest Label  **/
MixedChart.prototype.setLabelWidth = function () {
	this.m_labelwidth = 0;
	var maxSeriesVals = [];
	if (this.fontScaling(this.m_yAxis.m_labelfontsize) > 0) {
		for(var i = 0;i < this.leftAxisInfo.markerarray.length ;i++ ){
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
MixedChart.prototype.getLabelSignMargin = function () {
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
MixedChart.prototype.getLabelPrecisionMargin = function () {
	//var lpm = 5;
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
MixedChart.prototype.getLabelSecondFormatterMargin = function () {
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

/** @description Setter Method for set endX  of MixedChart Chart. **/
MixedChart.prototype.setEndX = function () {
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
	/** m_spaceForSecondAxisDec is used in yaxis class also to get the xposition for description **/
	this.m_spaceForSecondAxisDec = this.fontScaling(this.m_secondaxisfontsize) * 1;
	this.m_rightAxisSpace = (blm * 1 + vlm * 1 + sxm * 1 + raf * 1 + yad * 1 + salf * 1 + lwsa * 1 + lsfm*1 + sltam*1 + this.m_spaceForSecondAxisDec/2);
	this.m_endX = 1 * (this.m_x) + 1 * (this.m_width) - 1 * (this.m_rightAxisSpace);
	this.m_endX = (this.m_endX < 35) ? 35 : this.m_endX;
};

/** @description return  Label PrecisionMargin For SecondAxis  **/
MixedChart.prototype.getLabelPrecisionMarginForSecondAxis = function () {
	var lpm = 0;
	/**
	 * When axis is set as Auto, min marker is 500M and max marker is 3B, 
	 */
	if (this.m_secondaryaxissecondaryunit == "auto") {
		this.ctx.beginPath();
		this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
		var precisionText = ".0";
		lpm = this.ctx.measureText(precisionText).width;
		this.ctx.closePath();
	}
	return lpm;
};
/** @description return  Label Width For SecondAxis  **/
MixedChart.prototype.getLabelWidthForSecondAxis = function () {
	return this.m_labelwidthsecondaxis;
};
/** @description return  Label Width For SecondAxis  **/
MixedChart.prototype.setLabelWidthForSecondAxis = function () {
	this.m_labelwidthsecondaxis = 0;
	var maxSeriesVals = [];
	if (this.fontScaling(this.m_yAxis.m_labelfontsize) > 0) {
		for(var i = 0; i < this.rightAxisInfo.markerarray.length ; i++){
		     var maxSeriesVal = this.rightAxisInfo.markerarray[i];
		     this.ctx.beginPath();
		     this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
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
				this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
				maxSeriesVals[i] =  this.ctx.measureText(maxSeriesVal).width;
				this.ctx.closePath();
			}
		}
	 	this.m_labelwidthsecondaxis = getMaxValueFromArray(maxSeriesVals);
	}
};

/** @description return  SecondAxis LabelFormatter Margin  **/
MixedChart.prototype.getSecondAxisLabelFormatterMargin = function () {
	var lfm = 0;
	if (IsBoolean(this.m_secondaryaxisshow)) {
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

/** @description return  SecondYAxis Description Margin   **/
MixedChart.prototype.getSecondYAxisDescriptionMargin = function () {
	var dm = 0;
	if (IsBoolean(this.m_secondaxisdiscription != ""))
		dm = this.fontScaling(this.m_secondaxisfontsize) * 1.5;
	return dm;
};

/** @description return  SecondAxis To XAxis Margin   **/
/*MixedChart.prototype.getSecondAxisToXAxisMargin = function () {
	var lam = 5;
	return lam;
};*/

/** @description return  Label SecondFormatter Margin For SecondAxis   **/
MixedChart.prototype.getLabelSecondFormatterMarginForSecondAxis = function () {
	var lsfm = 0;
	if (IsBoolean(this.m_yAxis.m_rightaxisformater)) {
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
MixedChart.prototype.setStartY = function () {
	var chartYMargin = this.getChartMargin();
	this.m_startY = (this.m_y * 1) + (this.m_height * 1) - chartYMargin - this.getXAxisLabelMargin() - this.getXAxisDescriptionMargin() - this.getHorizontalLegendMargin() - ((IsBoolean(this.m_showslider)) ? this.sliderMargin : 0);
	this.m_startY = (IsBoolean(this.scaleFlag)) ? (this.m_y * 1 + this.m_height * 1 - 5) : this.m_startY;
};

/** @description return  XAxis Label Margin   **/
MixedChart.prototype.getXAxisLabelMargin = function () {
	var xAxislabelDescMargin=15;
	var radians = this.m_xAxis.m_labelrotation * (Math.PI / 180); 
	if(IsBoolean(this.m_xAxis.getLabelTilted())){
		this.ctx.font=this.m_xAxis.getLabelFontWeight()+" "+this.fontScaling(this.m_xAxis.getLabelFontSize())+"px "+this.m_xAxis.getLabelFontFamily();
		//xAxislabelDescMargin=Math.abs(this.ctx.measureText(this.m_categoryData[0][i]).width * radians);
		for(var i=1;i<this.m_categoryData[0].length;i++){
			if(xAxislabelDescMargin< Math.abs(this.ctx.measureText(this.m_categoryData[0][i]).width * radians)){
				xAxislabelDescMargin=Math.abs(this.ctx.measureText(this.m_categoryData[0][i]).width * radians);
			}
		}
		if(xAxislabelDescMargin > this.m_height/4){
			xAxislabelDescMargin=(this.m_xAxis.getLabelrotation()<=70)?(this.m_height/4-15):this.m_height/4;
		}
	} else {
		this.ctx.font=this.m_xAxis.getLabelFontWeight()+" "+this.fontScaling(this.m_xAxis.getLabelFontSize())+"px "+this.m_xAxis.getLabelFontFamily();
		var xlm = this.fontScaling(this.m_xAxis.m_labelfontsize)*1.8;
		this.noOfRows=this.setNoOfRows();
		xAxislabelDescMargin = (xlm)*this.noOfRows;
	}
	return xAxislabelDescMargin;
};

/** @description setter method for set NoOfRows for draw x-axis  Label   **/
MixedChart.prototype.setNoOfRows = function () {
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
MixedChart.prototype.getXAxisDescriptionMargin = function () {
	var xAxisDescriptionMargin = 2;
	if (this.m_xAxis.getDescription() != "") {
		xAxisDescriptionMargin = this.fontScaling(this.m_xAxis.getFontSize()) * 1.5;
	}
	return xAxisDescriptionMargin;
};

/** @description setter method for set EndY position of chart   **/
MixedChart.prototype.setEndY = function () {
	if(this.m_chartbase == "rectangle"){
		this.m_endY = (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1 + this.getRangeSelectorMargin() * 1);
		var x = this.m_height - this.m_startY;
		//this.m_endY = this.m_endY + x/1.5;
		/**DAS-348:commenting extra margin bcz added one axis more than max value[DAS-5].**/
	}else{
		this.m_endY = (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1 + this.getRangeSelectorMargin() * 1);
	}
};

/** @description return SubTitle Margin if showSubTitle set to true **/
MixedChart.prototype.getMarginForSubTitle = function () {
	var margin;
	var multiplier = (IsBoolean(this.m_updateddesign) ? 2.5 : 1.5);
	if (IsBoolean(this.m_subTitle.m_showsubtitle))
		margin = (this.m_subTitle.getDescription() != "") ? (this.fontScaling(this.m_subTitle.getFontSize()) * multiplier) : 10;
	else
		margin = 0;
	return margin;
};

/** @description return RangeSelector Margin if visiblity of RangeSelector set to true **/
MixedChart.prototype.getRangeSelectorMargin = function () {
	return 0;
};

/** @description overwrite method because data arranged in map for timeLine chart **/
MixedChart.prototype.getFieldNameValueMap = function (i) {
	var m_fieldNameValueMap = new Object();
	var fieldNameLength= this.getAllFieldsName().length;
	for (var l = 0; l < fieldNameLength; l++) {
		m_fieldNameValueMap[this.getAllFieldsName()[l]] = this.getDataProvider()[i][this.getAllFieldsName()[l]];
	}
	return m_fieldNameValueMap;
};

/**************** *************************   Mixed Calculation   ************************/
/** @description constructor  method for MixedCalculation  class. **/
function MixedCalculation() {
	this.startX;
	this.startY;
	this.endX;
	this.endY;
	this.marginX;

	this.xAxisData = [];
	this.yAxisData = [];
	this.xPositionMap = {};
	this.yPositionMap = {};
	this.heightMap = {};
	this.columnWidthMap={};
	this.columnGapeMap = {};
	this.basePoint = "";
	this.columnWidth = "";
	this.columnGap = "";
};

/** @description initialize the MixedCalculation  **/
MixedCalculation.prototype.init = function (chart, seriesData, index, categories, seriesDataMap) {
	this.m_chart = chart;
	this.index = index;
	this.startX = this.m_chart.getStartX();
	this.endX = this.m_chart.getEndX();
	this.startY = this.m_chart.getStartY();
	this.endY = this.m_chart.getEndY();

	this.xAxisData = categories[0];
	this.yAxisData = this.m_chart.getVisibleSeriesData(seriesData).seriesData;//not using in calculation

	this.seriesDataMap = seriesDataMap;
	this.leftAxisInfo = this.m_chart.leftAxisInfo;
	this.rightAxisInfo = this.m_chart.rightAxisInfo;
	
	this.totalColumn = (this.m_chart.m_charttype == "stacked"||this.m_chart.m_charttype == "100%"||this.m_chart.m_charttype == "overlaid") ? 1 : this.getTotalColumn(this.seriesDataMap);
	this.setColumnWidthGap();
	this.setXPositionTooltipArr(this.xAxisData);
	this.setYPositionArray(this.seriesDataMap);
	this.setXAnnotationPosition();
};

/** @description return TotalColumn in chart  **/
MixedCalculation.prototype.getTotalColumn = function (map) {
	var count = 0;
	for (axisKay in map) {
		for (chartKey in map[axisKay]) {
			for (seriesKey in map[axisKay][chartKey]) {
				if (chartKey == "column" && seriesKey != "contains" && seriesKey != "unique") {
					count++;
				}
			}
		}
	}
	return count;
};

/** @description will measure column width and column Gap **/
MixedCalculation.prototype.setColumnWidthGap = function (axis, axisData) {
/*	var drawingWidth = (this.endX - this.startX);
	var onePart = drawingWidth / this.xAxisData.length;
	this.onePartWidth = (isNaN(onePart)) ? drawingWidth : onePart;
	this.columnWidth = (this.onePartWidth * (this.m_chart.m_barsize)) / 100;
	this.columnGap = (this.onePartWidth * ((100 - this.m_chart.m_barsize) / 2)) / 100;*/
	var drawingWidth = (this.endX - this.startX);
	var onePart = drawingWidth / this.xAxisData.length;
	this.onePartWidth = (isNaN(onePart)) ? drawingWidth : onePart;
	this.columnWidth = (this.onePartWidth * (this.m_chart.m_barwidth)) / 100;
	this.columnGap = (this.onePartWidth * ((100 - this.m_chart.m_barwidth) / 2)) / 100;
};

/** @description setter method for Y-Positions of the series **/
MixedCalculation.prototype.setYPositionArray = function (map) {
	var columncount = 0;
	this.overlaidColWidth={"left":{"column":[]},"right":{"column":[]}};
	for (var Axiskey in map) {
		var colSeries=1;
		var previousWidth = "";
		var previousGape ="";
		for (var chartTypeKey in map[Axiskey]) {
			var WidthArr=[];
			for (var seriesKey in map[Axiskey][chartTypeKey]) {
				if (seriesKey != "unique" && seriesKey != "contains") {
					if(chartTypeKey=="column"){
						if(this.m_chart.m_charttype == "overlaid"){
							
							previousWidth= (previousWidth != "") ? (previousWidth* 50)/100:this.columnWidth;
							this.columnGapeMap[seriesKey] = (previousGape !=="") ? (previousGape*1+previousWidth/2) : 0;
							previousGape=this.columnGapeMap[seriesKey];
							this.columnWidthMap[seriesKey]=(previousWidth);
							WidthArr.push({name:seriesKey,value:previousWidth});
							colSeries++;
						}
						else{
							this.columnWidthMap[seriesKey]=this.columnWidth/colSeries ;
						}
					}
					var yPixcelArr = this.getYPositionArr(Axiskey, chartTypeKey, map[Axiskey][chartTypeKey][seriesKey], seriesKey, map);
					if (this.yPositionMap[seriesKey] == undefined && yPixcelArr != undefined)
						this.yPositionMap[seriesKey] = yPixcelArr;
					if (chartTypeKey == "column") {
						columncount++;
						this.heightMap[seriesKey] = this.getHeightArr(Axiskey, map[Axiskey][chartTypeKey][seriesKey]);
					}
					this.xPositionMap[seriesKey] = this.getXPositionArr(Axiskey, chartTypeKey, columncount, this.xAxisData,seriesKey);
				}
			}
			if(chartTypeKey=="column" && this.m_chart.m_charttype == "overlaid"){
				WidthArr = WidthArr.reverse();
				var keyArray=[];
				for(var i=0; i<WidthArr.length; i++) {
					keyArray.push(WidthArr[i].name);
				}
				WidthArr = keyArray;
				this.overlaidColWidth[Axiskey][chartTypeKey]=WidthArr;
			}
		}
	}
};

/** @description return y-positions Array for a series **/
MixedCalculation.prototype.getYPositionArr = function (axis, charttype, seriesData, seriesName, dataMap) {
	var axisInfo = (axis == "left") ? this.leftAxisInfo : this.rightAxisInfo;
	var pixcel = (this.startY * 1 - this.endY * 1) / (axisInfo.max - axisInfo.min);
	var min = axisInfo.min;
	var max = axisInfo.max;
	if ((this.m_chart.m_charttype == "stacked"||this.m_chart.m_charttype == "100%") && charttype == "column")
		this.getyPixelArrayForStacked(axis, charttype, seriesName, dataMap, pixcel, min, max);
	else {
		var yparray = [];
		var seriesDataLength=seriesData.length;
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
};
/** @description Setter method for set Closest Value for X Point annotation . **/
MixedCalculation.prototype.findClosestNumber = function(arr, target){
  var closest = arr[0];
  var closestIndex = 0;
  var smallestDifference = Math.abs(arr[0] - target);
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
MixedCalculation.prototype.checkIndexOfData = function(target){
	var dataIndex=-1;
	var arr = this.m_chart.m_mixedCalculation.xAxisData;
  for (var i = 0; i < arr.length; i++) {
	  var dataYear = this.m_chart.getMonthYear(arr[i].toString());
	  if(dataYear.year == target)
	  dataIndex = i;
  }
  return dataIndex;
}
/** @description will calculate y-pixcels for stack chart **/
MixedCalculation.prototype.getyPixelArrayForStacked = function (axis, charttype, seriesName, dataMap, pixcel, min, max) {
	var dataArr = [];
	var keysArr = [];
	for (var key4 in dataMap[axis][charttype]) {
		if (key4 != "unique" && key4 != "contains") {
			keysArr.push(key4);
			dataArr.push(dataMap[axis][charttype][key4]);
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
MixedCalculation.prototype.getXAxisPixel = function (axis) {
	var xaxisRatio = (this.endX - this.startX) / (this.xAxisData.length - 1);
	return xaxisRatio;
};

/** @description calculate the x-pixcels for tooltip purpose **/
MixedCalculation.prototype.setXPositionTooltipArr = function (categoryData) {
	this.xPositionTooltipArray = [];
	var catDataLength=categoryData.length;
	for (var i = 0; i <catDataLength; i++) {
		this.xPositionTooltipArray[i] = this.startX * 1 + (this.onePartWidth * i + this.onePartWidth / 2);
	}
};
/** @description Setter method for set onepart width on x-axis **/
MixedCalculation.prototype.setXAxisAnnotationOnePart= function(){
	this.onePartAnnotationWidth = (this.endX-this.startX)/(1);
};
/** @description Setter method for set  XPositions Array . **/
MixedCalculation.prototype.setXAnnotationPosition = function(){
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
/** @description method will return x-positions Array  **/
MixedCalculation.prototype.getXPositionArr = function (axis, charttype, count, categoryData,seriesKey) {
	count = (this.m_chart.m_charttype == "stacked"|| this.m_chart.m_charttype == "100%" || this.m_chart.m_charttype == "overlaid") ? 1 : count;
	var xPositionArray = [];
	var clusteredBarPadding = (this.columnWidth - this.columnWidth*this.m_chart.clusteredbarpadding)/2;
	var catDataLength=categoryData.length;
	for (var i = 0; i < catDataLength; i++) {
		if (charttype == "line") {
			xPositionArray[i] = this.startX * 1 + (this.onePartWidth * i + this.onePartWidth / 2);
		} else {
			if(this.m_chart.m_charttype == "overlaid"){
				xPositionArray[i] = this.startX * 1 + this.columnGap * (2 * i + 1) + (this.columnWidth * i) + ((this.columnWidth / this.totalColumn) * (count - 1)+this.columnGapeMap[seriesKey]);
			}
			else if(this.m_chart.m_charttype == "clustered"){
				xPositionArray[i] = this.startX * 1 + this.columnGap * (2 * i + 1) + (this.columnWidth * i) + ((this.columnWidth / this.totalColumn) * (count - 1)) + clusteredBarPadding;
			}else{
				xPositionArray[i] = this.startX * 1 + this.columnGap * (2 * i + 1) + (this.columnWidth * i) + ((this.columnWidth / this.totalColumn) * (count - 1));
			}
		}
	}
	return xPositionArray;
};

/** @description method will calculate and return height array **/
MixedCalculation.prototype.getHeightArr = function (axis, seriesData) {
	var axisInfo = (axis == "left") ? this.leftAxisInfo : this.rightAxisInfo;
	var pixcel = (this.startY * 1 - this.endY * 1) / (axisInfo.max - axisInfo.min);
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
MixedCalculation.prototype.getYPositionArray = function (key) {
	return this.yPositionMap[key];
};

/** @description return x-positions array according to series. **/
MixedCalculation.prototype.getXPositionArray = function (key) {
	return this.xPositionMap[key];
};

/** @description return height array according to series. **/
MixedCalculation.prototype.getHeightArray = function (key) {
	return this.heightMap[key];
};
/** @description return x-positions for tooltip. **/
MixedCalculation.prototype.getxPositionTooltipArray = function () {
	return this.xPositionTooltipArray;
};

/** @description return y-axis text .**/
MixedCalculation.prototype.getYAxisText = function () {
	return this.leftAxisInfo.markertext;
};

/** @description return y-axis marker array . **/
MixedCalculation.prototype.getYAxisMarkersArray = function () {
	return this.leftAxisInfo.markerarray;
};

/** @description return x-axis marker array **/
MixedCalculation.prototype.getXAxisMarkersArray = function () {
	this.setXAxisMarkerforAdvanceLine();
	return this.m_xAxisMarkersArray;
};

/** @description setter method for x-axis marker of the chart. **/
MixedCalculation.prototype.setXAxisMarkerforAdvanceLine = function () {
	this.m_xAxisMarkersArray = [];
	this.xPositionForMarker = [];
	var noOfMarker = this.xAxisData.length;
	for (var i = 0; i < noOfMarker; i++) {
		var x = this.startX * 1 + (this.onePartWidth * i + this.onePartWidth / 2);
		this.m_xAxisMarkersArray.push(this.xAxisData[i]);
		this.xPositionForMarker.push(x);
	}
};

/** @description return x-position for marker **/
MixedCalculation.prototype.getXAxisPositionForMarkers = function () {
	return this.xPositionForMarker;
};

//--------------------------------------MixedColumns-----------------------------------------
function MixedColumns() {
    this.m_xPixel = [];
    this.m_yPixelArray = [];
    this.m_stackHeightArray = [];
    this.m_stackColorArray = [];
    this.m_svgStackArray = [];
    this.m_transparency = "";
    this.m_strokeColor = "";
    this.m_showGradient = "";
    this.m_ySeriesData = [];
    this.m_valueOnDataPoints;
};
/** @description initialize  MixedColumns with some required properties.  **/
MixedColumns.prototype.init = function (stackColorArray, xPixel, yPixelArray, stackHeightArray, stackWidth, strokeColor,ShowGradient,chart, transparency,yseriesData) {
	var temp=this;
	this.m_xPixel = xPixel;
	this.m_yPixelArray = yPixelArray;
	this.m_stackWidth = stackWidth;
	this.m_stackHeightArray = stackHeightArray;
	this.m_stackColorArray = stackColorArray;
	this.m_chart = chart;
	this.m_transparency = transparency;
	this.m_strokeColor = strokeColor;
	this.m_showGradient = ShowGradient;
	this.m_ySeriesData = yseriesData;
	
	var arrayLength=this.m_yPixelArray.length;
	for (var i = 0; i < arrayLength; i++) {
		this.m_svgStackArray[i] = new Stack();
		
		if (this.m_yPixelArray[i] >= temp.m_chart.getStartY() || this.m_yPixelArray === "")
			this.m_stackHeightArray[i] = 0;
		else if (this.m_yPixelArray[i] < temp.m_chart.getEndY()) {
			this.m_stackHeightArray[i] = this.m_stackHeightArray[i] - (temp.m_chart.getEndY() - this.m_yPixelArray[i]);
			this.m_yPixelArray[i]= temp.m_chart.getEndY();
		} else if ((this.m_yPixelArray[i] * 1 + this.m_stackHeightArray[i] * 1) > temp.m_chart.getStartY()) {
			this.m_stackHeightArray[i] = (temp.m_chart.getStartY() - this.m_yPixelArray[i]);
		}
		if ((this.m_yPixelArray[i] * 1 + this.m_stackHeightArray[i]) > temp.m_chart.getStartY())
			this.m_stackHeightArray[i] = temp.m_chart.getStartY() - this.m_yPixelArray[i];
		this.m_stackHeightArray[i] = (this.m_stackHeightArray[i] < 0) ? 0 : this.m_stackHeightArray[i];
		
		this.m_svgStackArray[i].init(this.m_xPixel[i], this.m_yPixelArray[i], this.m_stackWidth, this.m_stackHeightArray[i], this.m_stackColorArray[i],this.m_strokeColor,this.m_showGradient, this.m_chart.ctx,this.m_chart.m_chartbase,"","","false",this.m_transparency[i],this.m_ySeriesData[i],this.m_chart);
	}
};

/** @description will draw  the columns which is in range. **/
MixedColumns.prototype.drawColumns = function () {
	var arrayLength=this.m_yPixelArray.length;
	for (var i = 0; i < arrayLength; i++) {
		//if (!this.isInRange(i))
			//this.m_svgStackArray[i].drawStack();
		/**DAS-695 */
		if (!this.isInRange(i)){
		var stackHeight = this.m_svgStackArray[i].m_stackHeight;
		if(stackHeight == null || stackHeight == "null" || stackHeight == "" || (isNaN(stackHeight)) || stackHeight ==0){
			//do nothing
		}else{
			this.m_svgStackArray[i].drawStack();
		}
		
		}
	}
};

/** @description checks column in range of not. **/
MixedColumns.prototype.isInRange = function (i) {
	if (this.m_yPixelArray[i] >= this.m_chart.getStartY() && this.m_yPixelArray[i] <= this.m_chart.getEndY())
		return true;
	else
		return false;
};

/********************** MixedLines *********************************/
function MixedLines() {
	this.color;
	this.width;
	this.xPositionArray = [];
	this.yPositionArray = [];
	this.line = [];
	this.ctx = "";
	this.m_chart = "";
	this.seriesName = "";
};

/** @description initialize MixedLines with their properties. **/
MixedLines.prototype.init = function (color, xPositionArray, yPositionArray, width, m_chart, plotTrasparency, seriesName, lineWidth, lineType) {
	this.m_chart = m_chart;
	this.seriesName = seriesName;
	this.ctx = this.m_chart.ctx;
	this.color = color;
	this.width = width;
	this.xPositionArray = xPositionArray;
	this.yPositionArray = yPositionArray;
	this.plotTrasparency = plotTrasparency;
	this.lineWidth = lineWidth;
	this.lineType = lineType;
	
	if(this.m_chart.m_lineform !== "curve"){
		for(var i=0;i<this.xPositionArray.length;i++){
			this.line[i]=new Line();
			if(this.xPositionArray[i] !== "" && this.yPositionArray[i] !== "") {
				if(i==0){
					this.line[i].init(this.color[i],this.xPositionArray[i],this.yPositionArray[i],this.xPositionArray[i],this.yPositionArray[i],this.m_chart,this.plotTrasparency, this.lineWidth, this.lineType);
				}
				else{
					this.line[i].init(this.color[i],this.xPositionArray[i-1],this.yPositionArray[i-1],this.xPositionArray[i],this.yPositionArray[i],this.m_chart,this.plotTrasparency, this.lineWidth, this.lineType);
				}
			}
		}
	}
};

/** @description will draw LineSeries according to lineform.  **/
MixedLines.prototype.drawLineSeries = function () {
	if (this.m_chart.m_lineform == "curve" ) 
	{
		this.drawSplines();
	} 
	else 
	{
		this.drawSegmentLines();
	}
};

/** @description method will check available datapoint isInRange or not. **/
MixedLines.prototype.isInRange= function(i){
	if(i==0){
		if(Math.floor(this.yPositionArray[i]) > Math.ceil(this.m_chart.getStartY()) || Math.ceil(this.yPositionArray[i]) < Math.floor(this.m_chart.getEndY()))
			return true;
		else
			return false;
	}
	else{
		if(Math.floor(this.yPositionArray[i-1]) > Math.ceil(this.m_chart.getStartY()) || Math.ceil(this.yPositionArray[i-1]) < Math.floor(this.m_chart.getEndY()) || Math.floor(this.yPositionArray[i]) > Math.ceil(this.m_chart.getStartY()) || Math.ceil(this.yPositionArray[i]) < Math.floor(this.m_chart.getEndY()))
			return true;
		else
			return false;
	}
};

/** @description method will drawn segment line .  **/
MixedLines.prototype.drawSegmentLines = function () {
	
	for(var i=0;i<this.xPositionArray.length;i++){
		if(!this.isInRange(i))
			this.line[i].drawLine();
	}
};

MixedLines.prototype.drawSegmentLine= function (color,x1,y1,x2,y2,transparency) {
	
		this.ctx.beginPath();
		this.ctx.lineWidth = this.m_chart.m_linewidth;
		this.ctx.strokeStyle = hex2rgb(color, transparency);
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();
		this.ctx.closePath();
};

/** @description method will draw Splines .  **/
MixedLines.prototype.drawSplines = function () {
	var pts =[];
	var count=0;
	pts[count] = [];
	var lineDashArray = this.getLineDashArray(this.lineType, this.lineWidth);
	for(var i=0 ; i<this.xPositionArray.length ; i++){
		if(this.xPositionArray[i] != null && this.xPositionArray[i] != "" && this.yPositionArray[i] != null && this.yPositionArray[i] != "" && this.yPositionArray[i]<=this.m_chart.getStartY() && this.yPositionArray[i]>=this.m_chart.getEndY()){
			pts[count].push(this.xPositionArray[i]);
			pts[count].push(this.yPositionArray[i]);
		}
		else{
			count++;
			pts[count] = [];
		}
	}
	for(var j=0;j<=count;j++){
		if(pts[j].length>0){
			this.ctx.beginPath();
			this.ctx.save();
			this.ctx.lineWidth = this.lineWidth;
			this.ctx.strokeStyle = hex2rgb(this.color[j],this.m_plotTrasparency);
			this.ctx.moveTo(pts[j][0], pts[j][1]);
			this.ctx.curve(pts[j], 0.5, 25, this);
			if (this.lineWidth > 0) {
				this.ctx.setLineDash(lineDashArray);
				this.ctx.stroke();
			}
			this.ctx.restore();
			this.ctx.closePath();
		}
	}
};
/** @description Get line dash array **/
MixedLines.prototype.getLineDashArray = function(lineType, lineWidth) {
	/**An Array of first two numbers which specify line width and a gap and last two for line patterns **/
	if (lineType === "dot")
		return [lineWidth * 1,(lineWidth * 2) + 1,0,0];
	else if (lineType === "dash1")
		return [lineWidth * 1,(lineWidth * 1),(lineWidth * 4),(lineWidth * 1)];
	else if (lineType === "dash")
		return [(lineWidth * 2) + 1,(lineWidth * 2) + 1,0,0];
	else
		return [];
};
/**********************MixedPoints*********************************/
function MixedPoints() {
	this.color;
	this.radius;
	this.xPositionArray = [];
	this.yPositionArray = [];
	this.point = [];
	this.ctx = "";
	this.m_chart = "";
};

/** @description method initialize MixedPoints with their properties. **/
MixedPoints.prototype.init = function (color, plaotRadius, xPositionArray, yPositionArray, m_chart, plotTrancparency,plotshape) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.color = color;
	this.m_chart = m_chart;
	this.radius = plaotRadius;
	this.xPositionArray = xPositionArray;
	this.yPositionArray = yPositionArray;
	this.pointOpacity = plotTrancparency;
	this.pointShape=plotshape;
	var xPosArrLength=this.xPositionArray.length;
	for (var i = 0; i < xPosArrLength; i++) {
		this.point[i] =new Point();
		this.point[i].init(this.color[i], this.radius, this.xPositionArray[i], this.yPositionArray[i], this.ctx, this.m_chart,this.pointOpacity[i],this.pointShape,this.radius);
	}
};
/** @description method will check point is in visible range or not. **/
MixedPoints.prototype.isInRange = function (i) {
	if (Math.floor(this.yPositionArray[i]) > Math.ceil(this.m_chart.getStartY()) || Math.ceil(this.yPositionArray[i]) < Math.floor(this.m_chart.getEndY()))
		return true;
	else
		return false;
};

/** @description method will draw the points which is in range. **/
MixedPoints.prototype.drawPointSeries = function (seriesIndex) {
	var xPosArrLength=this.xPositionArray.length;
	for (var i = 0; i < xPosArrLength; i++) {
		if (!this.isInRange(i))
			this.point[i].drawPoint();
	}
};
/**@description methid to initiliaze Annotation cacluations and other functions */
function MixAnnotSeries() {
	this.color;
	this.radius;
	this.xPositionArray = [];
	this.yPositionArray = [];
	this.point = [];
	this.ctx = "";
	this.m_chart = "";
};
/** @description initialization of MixAnnotSeries. **/
MixAnnotSeries.prototype.init = function(color, radius, xPositionArray, yPositionArray, m_chart, plotTrasparencyArray, plotTypeArray, plotRadiusArray, yseriesData, valueondatapoints) {
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
				this.point[count].init(antcolor, plotRadius, this.xPositionArray[i], this.m_chart.m_mixedCalculation.getYAnotPosition(annotationdata[j].point), this.ctx, this, transp, shapeType, plotRadius);
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
						monthDrawn.push({ "month": month, "year": year });
						var xannotationData = this.m_chart.m_mixedCalculation.findClosestNumber(this.m_chart.m_mixedCalculation.xAxisData, year);
						var xdataindex = xannotationData['closestIndex'];
						var xdataclst = xannotationData['closest'];
						var yearFraction = (month - 1) / 12;
						var nextclosestData;
						var xPlotDiff;
						var partPerc;
						var nextYearDiff;
						if (this.m_chart.m_mixedCalculation.xAxisData.length > 1) {
							nextclosestData = (year - xdataclst >= 0) ? this.m_chart.m_mixedCalculation.xAxisData[xdataindex + 1] : this.m_chart.m_mixedCalculation.xAxisData[xdataindex - 1];
							xPlotDiff = Math.abs(xdataclst - year) + yearFraction;
							nextYearDiff = Math.abs(nextclosestData - xdataclst);
							partPerc = xPlotDiff / nextYearDiff * 100;
						} else if (this.m_chart.m_mixedCalculation.xAxisData.length == 1 && year === xdataclst) {
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
						var xannotationData = this.m_chart.m_mixedCalculation.findClosestNumber(this.m_chart.m_mixedCalculation.xAxisData, year);
						var xdataindex = xannotationData['closestIndex'];
						var xdataclst = xannotationData['closest'];
						var nextclosestData;
						var xPlotDiff;
						var partPerc;

						if (this.m_chart.m_mixedCalculation.xAxisData.length == 1 && year === xdataclst) {
							// If there is only one data point and year is equal to it
							nextclosestData = xdataclst;
							xPlotDiff = 0;
							partPerc = 0;
						} else {
							// If there are multiple data points, calculate nextclosestData
							nextclosestData = ((year - xdataclst >= 0) ? this.m_chart.m_mixedCalculation.xAxisData[xdataindex + 1] : this.m_chart.m_mixedCalculation.xAxisData[xdataindex - 1]) || 0;
							xPlotDiff = (xdataclst > year) ? (xdataclst - year) : (year - xdataclst);
							partPerc = xPlotDiff / (nextclosestData - xdataclst) * 100;
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
				var xdataindex = this.m_chart.m_mixedCalculation.xAxisData.indexOf(xplotdata[j].point);
				var xPlotDiff = 0;
				var partPerc = 0;
			} else {
				if (!yearDrawn[xplotdata[j].point]) {
					yearDrawn[xplotdata[j].point] = true;
					var xannotationData = this.m_chart.m_mixedCalculation.findClosestNumber(this.m_chart.m_mixedCalculation.xAxisData, xplotdata[j].point);
					var xdataindex = xannotationData['closestIndex'];
					var xdataclst = xannotationData['closest'];
					var nextclosestData = ((xplotdata[j].point - xdataclst >= 0) ? this.m_chart.m_mixedCalculation.xAxisData[xdataindex + 1] : this.m_chart.m_mixedCalculation.xAxisData[xdataindex - 1]) || 0;
					var xPlotDiff = (xdataclst > xplotdata[j].point) ? (xdataclst - xplotdata[j].point) : (xplotdata[j].point - xdataclst);
					var partPerc = xPlotDiff / (nextclosestData - xdataclst) * 100;
				} else {
					nextclosestData = 0;
					xPlotDiff = 0;
					partPerc = NaN;
				}
			}
			var xannotaionPosition = xPositionArray[xdataindex] + this.m_chart.m_mixedCalculation.onePartWidth * partPerc / 100;
			/**get all yaxis points fromthe all series */
			var yPostionArrayAll = Array.from(new Set(this.m_chart.m_yPositionArray.flat(1)));
			var yPostionArrayAll = yPostionArrayAll.sort((a, b) => a - b); // Sort in ascending order
			var antcolor = (IsBoolean(this.m_chart.m_annotationseriescolor)) ? this.color[i] : this.m_chart.m_annotationcolor;
			var radius = this.m_chart.m_annotationradius;
			var transp = this.m_chart.m_annotationopacity;
			var text = xplotdata[j].label;
			var textColor = this.m_chart.m_annotationtextcolor;
			/*this.m_chart.m_annotationXData[j].xposition = xannotaionPosition;
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
			}*/
			
			/**darw line for yaxis based on category */
				/**darw line for yaxis based on category */
			var pointYear = this.m_chart.getMonthYear(xplotdata[j].point.toString());
			var dataIndex= this.m_chart.m_mixedCalculation.checkIndexOfData(pointYear.year);
			if(dataIndex != -1)
			{
			/**Add xposition to annotation array for tooltip */
			this.m_chart.m_annotationXData[j].xposition = xannotaionPosition;
			this.drawLineBetweenPoints(radius, 0.5, antcolor, xannotaionPosition, this.m_chart.getStartY(), xannotaionPosition, this.m_chart.getEndY(), text, textColor, transp);
			}
			
		}
	}
};
MixAnnotSeries.prototype.drawLineBetweenPoints = function(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2, text, textcolor,opacity) {
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.lineWidth = lineWidth;
	this.ctx.translate(antiAliasing, antiAliasing);
	this.ctx.strokeStyle = hex2rgb(strokeColor, opacity);
	var fillcolor = strokeColor;
	if (IsBoolean(this.m_chart.m_linetype)) {
		/**[dash length, gap length] */
		this.ctx.setLineDash([10, 3]);
	}
	/** parseInt() is used to draw Sharp marker lines **/
	this.ctx.moveTo(parseInt(x1), parseInt(y1));
	this.ctx.lineTo(parseInt(x2), parseInt(y2));
	this.ctx.stroke();
	/**draw text */
	this.ctx.fillStyle = fillcolor;
	//this.ctx.textAlign = 'center';  // Center the text
	if (!IsBoolean(this.m_chart.m_designMode)) {
		this.ctx.translate(parseInt(x2 + 10 + lineWidth), parseInt(y2));
	} else {
		this.ctx.translate(parseInt(x2 + 10 + lineWidth), parseInt(y2 + 35));
	}
	// Rotate the context 90 degrees (counterclockwise)
	this.ctx.rotate(-Math.PI / 2);
	//this.ctx.fillText(text, 0, 0);
	this.ctx.restore();
	this.ctx.closePath();

};
/** @description check Annotations point in range or not. **/
MixAnnotSeries.prototype.isInRange = function(i) {
	if (this.yPositionArray[i] > this.m_chart.getStartY() || this.yPositionArray[i] <= this.m_chart.getEndY() - 0.1)// -0.1 bucause of yposition data outof chart area, but point(drawpoint) is the maximum value and ratio*current value negligible difference between calculated point with the endY so we can substract sum minner value to arrenge the drawing.
		return true;
	else
		return false;
};
/** @description will draw Annotation points for those which is in Range. **/
MixAnnotSeries.prototype.drawPointSeries = function() {
	for (var i = 0, length = this.xPositionArray.length; i < length; i++) {
		/*if(!this.isInRange(i))
		this.point[i].drawPoint();
		*/
	}
};
//# sourceURL=MixedChart.js