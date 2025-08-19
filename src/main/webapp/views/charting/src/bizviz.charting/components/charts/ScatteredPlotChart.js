/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: ScatteredPlotChart.js
 * @description ScatteredPlotChart
 **/
function ScatteredPlotChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();
	this.m_x = 350;
	this.m_y = 20;
	this.m_width = 300;
	this.m_height = 260;

	this.m_seriesNames = [];
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_chartData = [];
	this.m_plotRadius = [];
	this.m_chartTypeNames = [];
	this.m_showSeries = [];
	this.m_shapeSeries = [];

	this.m_maximumaxisvalue;
	this.m_minimumaxisvalue;

	this.m_minradius = 2;
	this.m_maxradius = 26;

	this.m_yPositionArray = [];
	this.m_calculation = new ScatterPlotChartCalculation();
	this.m_xAxis = new PlotXAxis();
	this.m_yAxis = new PlotYAxis();
	this.m_title = new svgTitle(this);
	this.m_subTitle = new svgSubTitle();

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;

	this.noOfRows = 1; //used for set x-axis text into two rows in non tilted case.

	this.m_startX = 0;
	this.m_startY = 0;
	this.m_endX = 0;
	this.m_endY = 0;

	this.m_range1 = [];
	this.m_range2 = [];
	this.m_color = [];
	this.m_displayname = "a,b";
	this.m_ranges = "0~10,10~20";
	this.m_colors = "#2e309c,#909090";
	this.m_rangeshapes = ["point","point","point","point","point","point"];
	this.m_legendDisplayNames = "A,B";
	this.m_highervaluesaregood = "true";
	this.m_showcolorbandlegends = false;
	
	this.m_lineform = "curve";
	
    this.m_secondaryaxisformater = "Currency";
    this.m_secondaryaxisunit =  "none";
    this.m_secondaryaxissignposition = "prefix";
    this.m_secondaryaxisprecision = "0";
    this.m_secondaryaxissecondaryformatter = "Number";
    this.m_secondaryaxissecondaryunit = "none";
    
	this.m_defaultfillcolor = "#e0dfdf";
	this.m_solidcolorfill = false;
	
	/**animation property**/
	this.m_showxaxisthreshold = "false";
	this.m_minimumxaxisthreshold = "0";
	this.m_maximumxaxisthreshold = "50";
	this.m_showyaxisthreshold = "false";
	this.m_minimumyaxisthreshold = "0";
	this.m_maximumyaxisthreshold = "50";
	this.m_thresholdfillopacity = "0.3";
	this.m_thresholdfillcolor = "#FF0000";
	this.m_enablethresholdfill = false;
	this.m_minimumxaxisthresholdline = true;
	this.m_xaxisthresholdlinewidth = "1";
	this.m_xaxisthresholdstrokecolor = "#000000";
	this.m_minimumyaxisthresholdline = true;
	this.m_yaxisthresholdlinewidth = "1";
	this.m_yaxisthresholdstrokecolor = "#000000";
	this.m_thresholdlinetype = "straight"; //dot,dash1,dash
	
	/**animation property**/
	this.m_bubbleanimationduration = 0.5;
	this.m_hovershape = 2;
	this.m_enableanimation = "false";
	this.m_canvastype = "svg";
	
	this.m_actionsort = false;
	this.m_actionchartviews = false;
	this.enableDrillHighlighter = "false";
	this.m_drilltoggle = false;
	this.m_scatterdragFlag = false;
	this.m_enablezoom = "false";
};

ScatteredPlotChart.prototype = new Chart();

ScatteredPlotChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas(); //create draggable div
};
ScatteredPlotChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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
				case "Legend":
					for (var legendKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(legendKey);
						nodeObject[propertyName] = jsonObject[key][chartKey][legendKey];
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
ScatteredPlotChart.prototype.getAllDPFields = function () {
	return this.m_alldpfields;
};
ScatteredPlotChart.prototype.setAllDPFields = function () {
	this.m_alldpfields = [];
	for (var i = 0, len = this.getDataProvider().length; i < len; i++) {
		for(var key in this.getDataProvider()[i]){
			if((this.m_alldpfields.indexOf(key)) < 0 ){
				this.m_alldpfields.push(key);
			} 
		}
	}
};
ScatteredPlotChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};
ScatteredPlotChart.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	this.setCategory(fieldsJson);
	this.setSeries(fieldsJson);
	this.setAllFieldNames();
	this.setAllFieldsDisplayName();
};
ScatteredPlotChart.prototype.setAllFieldNames = function () {
	var fieldNames = [];
	this.m_allfieldsName = [];
	for (var i = 0, len = this.nameArr.length; i < len; i++) {
		fieldNames.push(this.nameArr[i]);
		if (this.otherFieldArr[i] != "")
			fieldNames.push(this.otherFieldArr[i]);
	}
	fieldNames = this.getUniqueValueFromArray(fieldNames);
	this.m_allfieldsName = fieldNames;
};
ScatteredPlotChart.prototype.setAllFieldsDisplayName = function () {
	var fieldNames = [];
	this.m_displayFieldNames = [];
	for (var i = 0, len = this.displayNamesArr.length; i < len; i++) {
		fieldNames.push(this.displayNamesArr[i]);
		if (this.otherFieldArr[i] != "")
			fieldNames.push(this.displayNamesArr[i]);
	}
	fieldNames = this.getUniqueValueFromArray(fieldNames);
	this.m_displayFieldNames = fieldNames;
};
ScatteredPlotChart.prototype.getFieldbyYFields = function () {
	//seriesNames
	var fieldNames = [];
	for (var i = 0, len = this.nameArr.length; i < len; i++) {
		if (this.typeArr[i] == "YField" && this.otherFieldArr[i] != "" && IsBoolean(this.m_showSeries[i])) {
			fieldNames.push(this.nameArr[i]);
		} else if (this.typeArr[i] == "XField" && this.otherFieldArr[i] != "" && IsBoolean(this.m_showSeries[i])) {
			fieldNames.push(this.otherFieldArr[i]);
		}
	}
	return fieldNames;
};
ScatteredPlotChart.prototype.getYFieldsColors = function () {
	this.m_colorNames = [];
	for (var i = 0, len = this.nameArr.length; i < len; i++) {
		if (this.typeArr[i] == "YField" && this.otherFieldArr[i] != "") {
			this.m_colorNames.push(this.colorArr[i]);
		} else if (this.typeArr[i] == "XField" && this.otherFieldArr[i] != "") {
			this.m_colorNames.push(this.colorArr[i]);
		}
	}
	return this.m_colorNames;
};
ScatteredPlotChart.prototype.getFieldbyYFieldsDisplayName = function () {
	/** seriesDisplayNames **/
	var fieldNames = [];
	for (var i = 0, len = this.nameArr.length; i < len; i++) {
		if ( this.otherFieldArr[i] != "") {
			fieldNames.push(this.displayNamesArr[i]);
		}
	}
	return fieldNames;
};
ScatteredPlotChart.prototype.getUniqueValueFromArray = function (a) {
	var temp = {};
	for (var i = 0; i < a.length; i++)
		temp[a[i]] = true;
	var r = [];
	for (var k in temp)
		r.push(k);
	return r;
};
ScatteredPlotChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	this.m_categoryFieldColor = [];
	for (var i = 0, len = categoryJson.length; i < len; i++) {
		var type = this.getProperAttributeNameValue(categoryJson[i], "Type");
		var otherField = this.getProperAttributeNameValue(categoryJson[i], "OtherField");
		if (type == "YField" && otherField != "") {
			this.m_categoryNames.push(otherField);
		} else if (type == "XField" && otherField != "") {
			this.m_categoryNames.push(this.getProperAttributeNameValue(categoryJson[i], "Name"));
		}
		this.m_categoryFieldColor.push(this.getProperAttributeNameValue(categoryJson[i], "Color"));
	}
};
ScatteredPlotChart.prototype.getOtherFields = function () {
	var fieldNames = [];
	for (var i = 0, len = this.nameArr.length; i < len; i++) {
		if (this.typeArr[i] == "YField" && this.otherFieldArr[i] != "" && IsBoolean(this.m_showSeries[i])) {
			fieldNames.push(this.otherFieldArr[i]);
		} else if (this.typeArr[i] == "XField" && this.otherFieldArr[i] != "" && IsBoolean(this.m_showSeries[i])) {
			fieldNames.push(this.nameArr[i]);
		}
	}
	return fieldNames;
};
ScatteredPlotChart.prototype.getCategoryNames = function () {
	var categoryNames = this.getOtherFields();
	return categoryNames;
};
ScatteredPlotChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};
ScatteredPlotChart.prototype.setSeries = function (seriesJson) {
	this.allNameArr = [];
	this.allDisplayNamesArr = [];
	this.m_seriesVisibleArr = {};
	this.nameArr = [];
	this.otherFieldArr = [];
	this.allOtherFieldArr = [];
	this.legendArr = [];
	this.displayNamesArr = [];
	this.otherFieldDisplayNamesArr = [];
	this.radiusFieldDisplayNamesArr = [];
	this.colorFieldDisplayNamesArr = [];
	this.colorArr = [];
	this.m_seriesDataLabelProperty = [];
	this.plotColorArr = [];
	this.plotRadiusArr = [];
	this.m_isfixedradius = [];
	this.typeArr = [];
	this.m_seriesChartType = [];
	this.m_seriesNameWithOtherField = {};
	this.m_seriesNameAndOtherFieldNameArray = [];
	this.m_transparency = [];
	this.m_lineWidthArray = [];
	
	this.m_bestfitline = [];
	this.m_bestfitlinecolor = [];
	this.m_bestfitlinewidth = [];
	//this.m_bestfitanimation = [];
	this.m_bestfitlinetype = [];
	//this.m_bestfitduration = [];
	var count = 0;
	var tra = 0.3;

	for (var i = 0, len = seriesJson.length; i < len; i++) {
		this.allNameArr[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.allDisplayNamesArr[i] = m_formattedDisplayName;
		this.m_seriesVisibleArr[this.allDisplayNamesArr[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
		this.allOtherFieldArr[i] = this.getProperAttributeNameValue(seriesJson[i], "OtherField");
		this.m_seriesNameAndOtherFieldNameArray.push(this.allNameArr[count]);
		if(this.allOtherFieldArr[count] != ""){
			this.m_seriesNameAndOtherFieldNameArray.push(this.allOtherFieldArr[count]);
		}
		if (IsBoolean(this.m_seriesVisibleArr[this.allDisplayNamesArr[i]] && this.allOtherFieldArr[i] != "")) {
			this.nameArr[count] = this.getProperAttributeNameValue(seriesJson[i], "Name");
			this.otherFieldArr[count] = this.getProperAttributeNameValue(seriesJson[i], "OtherField");
			this.m_seriesNameWithOtherField[this.nameArr[count]] =this.getProperAttributeNameValue(seriesJson[i], "OtherField");
			this.displayNamesArr[count] = m_formattedDisplayName;
			this.otherFieldDisplayNamesArr[count] = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "OtherFieldDisplayName"));
			this.radiusFieldDisplayNamesArr[count] = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "RadiusFieldDisplayName"));
			this.colorFieldDisplayNamesArr[count] = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "ColorFieldDisplayName"));
			this.colorArr[count] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));
			var colorField = this.getProperAttributeNameValue(seriesJson[i], "ColorField");
			var LineWidth = this.getProperAttributeNameValue(seriesJson[i], "LineWidth");
			this.plotColorArr[count] = (colorField != undefined && colorField !== null && colorField !== "") ? colorField : "";
			this.m_lineWidthArray[count] = (LineWidth != undefined && LineWidth !== null && LineWidth !== "") ? LineWidth : 2;
			
			var bestfitline = this.getProperAttributeNameValue(seriesJson[i], "BestFitLine");
			var bestfitlinewidth = this.getProperAttributeNameValue(seriesJson[i], "BestFitLineWidth");
			var bestfitlinecolor = this.getProperAttributeNameValue(seriesJson[i], "BestFitLineColor");
			//var bestfitanimation = this.getProperAttributeNameValue(seriesJson[i], "BestFitAnimation");
			var bestfitlinetype = this.getProperAttributeNameValue(seriesJson[i], "BestFitLineType");
			//var bestfitduration = this.getProperAttributeNameValue(seriesJson[i], "BestFitDuration");
			this.m_bestfitline[count] = (bestfitline != undefined && bestfitline !== null && bestfitline !== "")?bestfitline:"false";
			this.m_bestfitlinewidth[count] = (bestfitlinewidth != undefined && bestfitlinewidth !== null && bestfitlinewidth !== "")?bestfitlinewidth:"1";
			this.m_bestfitlinecolor[count] = (bestfitlinecolor != undefined && bestfitlinecolor !== null && bestfitlinecolor !== "")?bestfitlinecolor:"#000000";
			//this.m_bestfitanimation[count] = (bestfitanimation != undefined && bestfitanimation !== null && bestfitanimation !== "")?bestfitanimation:"false";
			this.m_bestfitlinetype[count] = (bestfitlinetype != undefined && bestfitlinetype !== null && bestfitlinetype !== "")?bestfitlinetype:"straight";
			//this.m_bestfitduration[count] = (bestfitduration != undefined && bestfitduration !== null && bestfitduration !== "")?bestfitduration:"1";
			//this.m_bestfitlinecolor[count] = "#000000";
			//this.m_bestfitlinewidth[count] = "1";
			/*if (this.getProperAttributeNameValue(seriesJson[i], "ColorField"))
				this.plotColorArr[count] = this.getProperAttributeNameValue(seriesJson[i], "ColorField");
			else{
				if(this.getProperAttributeNameValue(seriesJson[i], "ColorField") == ""){
					this.plotColorArr[count] = this.getProperAttributeNameValue(seriesJson[i], "ColorField");
				}else{
					this.plotColorArr[count] = this.getProperAttributeNameValue(seriesJson[i],"");
				}
			}*/
			this.m_seriesDataLabelProperty[count] = this.getProperAttributeNameValue(seriesJson[i], "DataLabelCustomProperties");
			if (this.m_seriesDataLabelProperty[count] !== undefined) {
			    if (IsBoolean(this.m_seriesDataLabelProperty[count].useFieldColor)) {
			        this.m_seriesDataLabelProperty[count].dataLabelFontColor = this.colorArr[count];
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

			//var rad = this.getProperAttributeNameValue(seriesJson[i],"PlotRadius"); //
			var radius = this.getProperAttributeNameValue(seriesJson[i], "PlotRadius");
			this.plotRadiusArr[count] = (radius!=="")?(radius):this.nameArr[count];
			this.m_isfixedradius[count] = this.getProperAttributeNameValue(seriesJson[i], "isFixedRadius");
			var transparency = this.getProperAttributeNameValue(seriesJson[i], "PlotTransparency");
			this.m_transparency[count] = (transparency != undefined) ? transparency : tra;
			this.typeArr[count] = this.getProperAttributeNameValue(seriesJson[i], "Type");
			this.m_seriesChartType[count] = this.getProperAttributeNameValue(seriesJson[i], "PlotType");
			if (this.typeArr[count] != "Category")
				this.m_showSeries[count] = this.getProperAttributeNameValue(seriesJson[i], "visible");
			count++;
		}
	}
};
ScatteredPlotChart.prototype.getSeriesNames = function () {
	var seriesNames = this.getFieldbyYFields();
	return seriesNames;
};
ScatteredPlotChart.prototype.getSeriesNamesForToolTip = function (n) {
	var seriesNames = this.getFieldbyYFields();
	var displaySeriesNames;
	for (var i = 0, len = this.getFieldbyYFields().length; i < len; i++) {
		if (i == n)
			displaySeriesNames = seriesNames[n];
	}
	return displaySeriesNames;
};
ScatteredPlotChart.prototype.getSeriesDisplayNamesForToolTip = function (n) {
	var seriesNames = this.getFieldbyYFieldsDisplayName();
	var displaySeriesNames;
	for (var i = 0, len = seriesNames.length; i < len; i++) {
		if (i == n){
			displaySeriesNames = seriesNames[n];
		}
	}
	return displaySeriesNames;
};
ScatteredPlotChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};
ScatteredPlotChart.prototype.getSeriesColors = function () {
	var colorName = this.getYFieldsColors();
	return colorName;
};
ScatteredPlotChart.prototype.getDataFromJSON = function(fieldName) {
    var data = [];
    for (var i = 0, len = this.getDataProvider().length; i < len; i++) {
        if (this.getDataProvider()[i][fieldName] == undefined || this.getDataProvider()[i][fieldName] == "undefined")
            data[i] = "";
        else
            data[i] = this.getDataProvider()[i][fieldName];
    }
    return data;
};
ScatteredPlotChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	for (var i = 0, len = this.getCategoryNames().length; i < len; i++) {
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
};
ScatteredPlotChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};
ScatteredPlotChart.prototype.setAllSeriesNames = function () {
	var result = [];
	for(var i = 0, len = this.m_seriesNameAndOtherFieldNameArray.length; i < len; i++){
		if(result.indexOf(this.m_seriesNameAndOtherFieldNameArray[i]) == -1)
			result.push(this.m_seriesNameAndOtherFieldNameArray[i]);
	}
	this.m_seriesNameAndOtherFieldNameArray = result;
};
ScatteredPlotChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0, len = this.getSeriesNames().length; i < len; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
};
ScatteredPlotChart.prototype.setPlotRadiusData = function() {
    this.m_plotRadiusData = [];
    for (var i = 0, outerLength = this.plotRadiusArr.length; i < outerLength; i++) {
        /**Added for Numeric Column name and fixed radius*/
        this.m_plotRadiusData[i] = [];
        for (var j = 0, innerLength = this.getDataProvider().length; j < innerLength; j++) {
            if (IsBoolean(this.m_isfixedradius[i])) {
                this.m_plotRadiusData[i][j] = this.plotRadiusArr[i];
            } else {
                /**Added to support old configuration dashboard and default view*/
                if (!isNaN(this.plotRadiusArr[i]) && (this.m_isfixedradius[i] == undefined)) {
                    this.m_plotRadiusData[i][j] = this.plotRadiusArr[i];
                } else {
                    this.m_plotRadiusData[i] = this.getDataFromJSON(this.plotRadiusArr[i]);
                }

            }
        }
    }
};
ScatteredPlotChart.prototype.getPlotRadiusData = function () {
	return this.m_plotRadiusData;
};
ScatteredPlotChart.prototype.setPlotColorData = function () {
	this.m_plotColorData = [];
	for (var i = 0, length = this.plotColorArr.length; i < length; i++) {
		var colorField = (this.plotColorArr[i] !== "")?this.plotColorArr[i]:this.getSeriesNames()[i];
		this.m_plotColorData[i] = this.getDataFromJSON(colorField);
	}
};
ScatteredPlotChart.prototype.getPlotColorData = function () {
	return this.m_plotColorData;
};
ScatteredPlotChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};
ScatteredPlotChart.prototype.setSeriesColor = function (m_seriesColor) {
	this.m_seriesColor = m_seriesColor;
};

ScatteredPlotChart.prototype.getSeriesColor = function () {
	return this.m_seriesColor;
};
ScatteredPlotChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};
ScatteredPlotChart.prototype.getLegendNames = function () {
	this.m_legendNames = this.displayNamesArr;
	return this.m_legendNames;
};

/** @description Getter for Category Colors**/
ScatteredPlotChart.prototype.getCategoryColorsForAction = function () {
	return this.m_categoryFieldColor;
};
/** @description Getter for Series Colors**/
ScatteredPlotChart.prototype.getSeriesColorsForAction = function () {
	return this.colorArr;
};

ScatteredPlotChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0, len = this.getCategoryNames().length; i < len; i++) {
		this.m_allfieldsName.push(this.getCategoryNames()[i]);
	}
	for (var j = 0, length = this.getSeriesNames().length; j < length; j++) {
		this.m_allfieldsName.push(this.getSeriesNames()[j]);
	}
};
ScatteredPlotChart.prototype.setConditionalColor = function () {
	this.m_seriesColorsArray = [];
	var seriesColor = this.m_plotHexColor;
	if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && (!IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName()) || this.getCategoryColors().getCategoryColor().length == 0) && this.getConditionalColors() != "" && this.getConditionalColors() != undefined && this.getConditionalColors().getConditionalColor().length > 0) {
		var conditionalColors = this.getConditionalColors().getScatterPlotConditionalColorsForConditions(this.nameArr , seriesColor , this.m_seriesData,this.m_seriesNameWithOtherField,this);
		for (var i = 0, outerLength = this.m_plotHexColor.length; i < outerLength; i++) {
			this.m_seriesColorsArray[i] = [];
			for (var j = 0, innerLength = this.m_plotHexColor[i].length; j < innerLength; j++) {
				this.m_plotHexColor[i][j] = conditionalColors[i][j];
			}
		}
	}
};
/**@description added setOpacity method to update conditional opacity of the shapes**/
ScatteredPlotChart.prototype.setOpacity = function() {
    this.m_seriesOpacity = [];
    for (var k = 0; k < this.m_categoryNames.length; k++) {
        this.m_seriesOpacity[k] = [];
        if (this.m_conditionalColors.m_ConditionalColor.length > 0) {
            for (var i = 0; i < this.m_conditionalColors.m_ConditionalColor.length; i++) {
                if (this.m_categoryNames[k] === this.m_conditionalColors.m_ConditionalColor[i].m_seriesname) {
                    //var compareTo = this.m_conditionalColors.m_ConditionalColor[i].m_compareto;
                      var field = this.m_conditionalColors.m_ConditionalColor[i].m_comparedfield,
                        opa = this.m_conditionalColors.m_ConditionalColor[i].m_opacity,
                        operator = this.m_conditionalColors.m_ConditionalColor[i].m_operator;

                    for (var j = 0; j < this.m_dataProvider.length; j++) {
                    	var compareTo = (IsBoolean(!this.m_conditionalColors.m_ConditionalColor[i].m_flag)) ? this.m_dataProvider[j][this.m_conditionalColors.m_ConditionalColor[i].m_compareto] :this.m_conditionalColors.m_ConditionalColor[i].m_compareto;
                        var seriesname = this.m_dataProvider[j][field];
                        var result = false;
                        try {
                            if ((operator == "==" || operator == "!=") && IsBoolean(isNaN(seriesname))) {
                                eval("result  = '" + seriesname + "'" + operator + "'" + compareTo + "'");
                            } else if (operator == "between") {
                                var values = ("" + compareTo).split("~");
                                if (seriesname >= values[0] * 1 && seriesname <= values[1] * 1) {
                                    result = true;
                                } else {
                                    result = false;
                                }
                            } else {
                                eval("result  = " + seriesname + operator + compareTo);
                            }
                        } catch (e) {
                            result = false;
                        }

                        if (result) {
                            this.m_seriesOpacity[k][j] = opa;
                        } else if (isNaN(this.m_seriesOpacity[k][j]) || this.m_seriesOpacity[k][j] === undefined) {
                            this.m_seriesOpacity[k][j] = this.m_transparency[k]; //1
                        }
                    }
                } else {
                    for (var a = 0; a < this.m_dataProvider.length; a++) {
                        if (isNaN(this.m_seriesOpacity[k][a]) || this.m_seriesOpacity[k][a] === undefined) {
                            this.m_seriesOpacity[k][a] = this.m_transparency[k]; //1
                        }
                    }
                }
            }
        } else {
            for (var b = 0; b < this.m_dataProvider.length; b++) {
                if (isNaN(this.m_seriesOpacity[k][b]) || this.m_seriesOpacity[k][b] === undefined) {
                    this.m_seriesOpacity[k][b] = this.m_transparency[k]; //1
                }
            }
        }
    }
};
ScatteredPlotChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};
ScatteredPlotChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_displayFieldNames;
};
ScatteredPlotChart.prototype.getType = function () {
	return this.m_fieldType;
};
ScatteredPlotChart.prototype.getOtherField = function () {
	return this.m_otherFields;
};
ScatteredPlotChart.prototype.init = function () {
	this.createSVG();
	if(!IsBoolean(this.m_scatterdragFlag)){
	this.setCategoryData();
	this.setSeriesData();
	this.updateCategoryData();
	this.updateSeriesData();
	this.isSeriesDataEmpty();
	}
	this.setAllDPFields();
	this.setAllSeriesNames();
	this.setPlotRadiusData();
	this.setPlotColorData();
	this.m_chartTypeNames = this.getChartTypeNames();
	this.m_chartTypeRadius = this.getChartTypeRadius();
	this.m_chartTypeColors = this.getChartTypeColors();

	this.getRanges();

	this.m_seriesNames = this.getSeriesNames();
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);

	if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory())) {
		this.setMinMaxValueFromSeriesData();
		this.m_calculation.init(this, this.getCategoryData(), this.getSeriesData());
		this.initializeChartUIProperties();
		var temp = this.m_categoryData;
		this.m_categoryData = this.m_calculation.getXAxisMarkersArray();
		this.m_xAxis.init(this, this.m_calculation);
		this.m_xAxis.m_xAxisData = this.getCategoryData();
		this.m_xAxis.m_xAxisActualMarkersArray = this.m_calculation.m_xAxisActualMarkersArray;
		this.m_yAxis.init(this, this.m_calculation);
		this.m_categoryData = temp;
		var shape = (IsBoolean(this.isShapeAvailable())) ? (this.m_seriesChartType) : (this.m_chartTypeNames);
		for (var i = 0, length = this.m_seriesData.length; i < length; i++) {
			this.m_shapeSeries[i] = new ShapeSeries();
			//this.m_shapeSeries[i].init(this.getPlotHexColor()[i], this.m_calculation.getXPixelArray()[i], this.m_calculation.getYPixelArray()[i], shape[i], this.m_calculation.getPlotRadius()[i],this.m_transparency[i], this, this.m_lineWidthArray[i]);
			this.m_shapeSeries[i].init(this.getPlotHexColor()[i], this.m_calculation.getXPixelArray()[i], this.m_calculation.getYPixelArray()[i], shape[i], this.m_calculation.getPlotRadius()[i],this.m_seriesOpacity[i], this, this.m_lineWidthArray[i]);
		}
	}
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
    /**DAS-901 */
    if(!IsBoolean(this.m_isEmptySeries))
	this.initializeDataLabel();
	this.initMouseClickEventForSVG(this.svgContainerId);
};
ScatteredPlotChart.prototype.getRanges = function () {
	this.m_range = this.m_ranges.split(",");
	for (var i = 0; i < this.m_range.length; i++) {
		var splitter = this.m_range[i].indexOf("~") > -1 ? "~" : "-";
		var m_rangeForLegend = (this.m_range[i].split(splitter));
		this.m_range1[i] = m_rangeForLegend[0];
		this.m_range2[i] = m_rangeForLegend[1];
	}

	Array.prototype.max = function () {
		return Math.max.apply(null, this);
	};

	Array.prototype.min = function () {
		return Math.min.apply(null, this);
	};

	this.m_minRangeValue = [this.m_range1.min(), this.m_range2.min()].min();
	this.m_maxRangeValue = [this.m_range1.max(), this.m_range2.max()].max();
};
ScatteredPlotChart.prototype.initializeChartUIProperties = function () {
	this.m_heatWidth = this.getEndX() - this.m_startX;
	this.initializeColor();
	this.createColorRange();
	this.setPlotHexColor();
	this.setConditionalColor();
	this.setOpacity();
};
ScatteredPlotChart.prototype.initializeColor = function () {
	var color = this.m_colors.split(",");
	if(!IsBoolean(this.m_showdynamicrange)){
		for (var i = 0; i < this.m_range.length; i++) {
			if (color[i] != undefined)
				this.m_color[i] = convertColorToHex(color[i]);
			else
				this.m_color[i] = this.m_color[i - 1];
		}
	}else{
		this.m_color[0] = this.m_minrangecolor;
		this.m_color[1] = this.m_maxrangecolor;
	}
};
ScatteredPlotChart.prototype.setMinMaxValueFromSeriesData = function () {
	this.serMaxVal = this.serMinVal = 0;
	var singletonFlag = true;
	for (var i = 0, outerLength = this.m_plotColorData.length; i < outerLength; i++) {
		for (var j = 0, innerLength = this.m_plotColorData[i].length; j < innerLength; j++) {
			/**Added for comma separated data and to remove garbage data*/
			this.m_plotColorData[i][j] = getNumericComparableValue(this.m_plotColorData[i][j]);
			if (!isNaN(this.m_plotColorData[i][j])) {
				/**Added (this.m_plotColorData[i][j] !=="") because it considering zero as empty string*/
				if(this.m_plotColorData[i][j] != undefined && !isNaN(this.m_plotColorData[i][j]*1) && this.m_plotColorData[i][j] !=null && this.m_plotColorData[i][j] !==""){
					if(singletonFlag){
						this.serMaxVal = this.serMinVal = this.m_plotColorData[i][j]*1;
						singletonFlag = false;
					}
					if(this.serMaxVal*1 <= this.m_plotColorData[i][j]*1)
						this.serMaxVal = this.m_plotColorData[i][j]*1;
					if(this.serMinVal*1 >= this.m_plotColorData[i][j]*1)
						this.serMinVal = this.m_plotColorData[i][j]*1; 
				}
			}
		}
	}
};
ScatteredPlotChart.prototype.createColorRange = function () {
	var crWidth = this.m_heatWidth;
	this.m_minRange = (!IsBoolean(this.m_showdynamicrange)) ?([this.m_range1.min(), this.m_range2.min()].min()) : (this.serMinVal);
	this.m_maxRange =  (!IsBoolean(this.m_showdynamicrange)) ?([this.m_range1.max(), this.m_range2.max()].max()) : (this.serMaxVal);
	var grad = this.ctx.createLinearGradient(0, 0, crWidth, 0);
	if(IsBoolean(this.m_showdynamicrange)){
		var color =[];
		color[0] =this.m_minrangecolor;
		color[1] = this.m_maxrangecolor;
		for (var i = 0; i < color.length; i++) {
			var mark;
			if(i==0){
			    mark = 0;
			}else if(i == color.length-1){
				mark = 1;
			}else{
				mark = i/(color.length-1);
			}
			grad.addColorStop(mark, color[i]);
		}
	}
	else{
		if (this.m_range.length > 1) {
			var rangeDiff = this.m_maxRange - this.m_minRange;
			for (var i = 0; i < this.m_range.length; i++) {
				if (i == 0)
					grad.addColorStop(0, this.m_color[i]);
				else if (i == this.m_range.length - 1)
					grad.addColorStop(1, this.m_color[i]);
				else {
					var stop = this.m_range1[i] - this.m_minRange;
					mark = stop / rangeDiff;
					if(!isNaN(mark)){
						grad.addColorStop( mark, this.m_color[i]);
					}
				}
			}
		} else {
			if (IsBoolean(this.m_highervaluesaregood)) {
				grad.addColorStop(0, "#FFFFFF");
				grad.addColorStop(1, this.m_color[0]);
			} else {
				grad.addColorStop(0, this.m_color[0]);
				grad.addColorStop(1, "#FFFFFF");
			}
		}
	}
	this.ctx.beginPath();
	this.ctx.fillStyle = grad;
	this.ctx.fillRect(0, 0, crWidth, this.m_height * 1);
	this.ctx.fill();
	this.ctx.closePath();
};
ScatteredPlotChart.prototype.setPlotHexColor = function () {
	this.m_plotHexColor = [];
	for (var i = 0, outerLength = this.m_seriesData.length; i < outerLength; i++) {
		this.m_plotHexColor[i] = [];
		for (var j = 0, innerLength = this.m_seriesData[i].length; j < innerLength; j++) {
			/**Added for comma separated data and to remove garbage data*/
			if (this.m_plotColorData[i][j] != null &&  this.m_plotColorData[i][j] !== "" && this.m_plotColorData[i][j] != undefined && !isNaN(this.m_plotColorData[i][j])) {
				if(IsBoolean(this.m_showdynamicrange) || !IsBoolean(this.m_solidcolorfill) || this.plotColorArr[i] == ""){
					/** Gradient fill for dynamic-range and gradient fill for user defined range**/
					if(this.plotColorArr[i] == ""){
						this.m_plotHexColor[i][j] = this.colorArr[i];
					}else{
						if ((this.m_plotColorData[i][j] * 1 < this.m_minRange ) || (this.m_plotColorData[i][j] * 1 > this.m_maxRange)){
							this.m_plotHexColor[i][j] = this.m_defaultfillcolor;
						}else{
							var percent = ((this.m_plotColorData[i][j] - this.m_minRange) / (this.m_maxRange - this.m_minRange)) * this.m_heatWidth * this.getDevicePixelRatio();
							if (this.m_plotColorData[i][j] * 1 < this.m_minRange){
								percent = 0.01;
							}else if(this.m_plotColorData[i][j] * 1 >= this.m_maxRange){
								percent = (this.m_heatWidth * this.getDevicePixelRatio()) - this.m_adjustpixel;
							}
							var col = this.ctx.getImageData(percent | 0, this.m_height / 2, 1, 1).data;
							var rgbColor = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
							this.m_plotHexColor[i][j] = rgb2hex(rgbColor);
						}
					}
				}else{
					/* Solid fill for user defined range*/
					var percent = this.m_plotColorData[i][j] * 1;
					for (var k = 0; k < this.m_range.length; k++) {
						if ((k == 0 && percent < this.m_range1[k]) || (k == this.m_range.length - 1 && percent >= this.m_range2[k])){
							this.m_plotHexColor[i][j] = this.m_defaultfillcolor;
						}
						if (percent >= this.m_range1[k] && percent < this.m_range2[k]){
							this.m_plotHexColor[i][j] = this.m_color[k];
							break;
						}
					}
				}
			}else {
				this.m_plotHexColor[i][j] = this.m_defaultfillcolor;
			}
		}

	}
	
};
ScatteredPlotChart.prototype.getPlotHexColor = function () {
	return this.m_plotHexColor;
};
ScatteredPlotChart.prototype.getRangeColorForData = function (data) {
	for (var i = 0; i < this.m_range.length; i++) {
		if (this.m_range1[i] * 1 <= data * 1 && data * 1 < this.m_range2[i] * 1)
			return this.m_color[i];
	}
	if (data * 1 < this.m_range1[0] * 1)
		return this.m_color[i];
	else if (data * 1 >= this.m_range1[this.m_range.length - 1] * 1)
		return this.m_color[this.m_range.length - 1];
	else
		return "#FFFFFF";
};
ScatteredPlotChart.prototype.updateSeriesData = function () {
	this.m_displaySeriesDataFlag = [];
	for (var i = 0, outerLength = this.m_seriesData.length; i < outerLength; i++) {
		this.m_displaySeriesDataFlag[i] = [];
		for (var j = 0, innerLength = this.m_categoryData[i].length; j < innerLength; j++) {
			this.m_displaySeriesDataFlag[i][j] = true;
			if (isNaN(this.m_seriesData[i][j])) {
				this.m_displaySeriesDataFlag[i][j] = false;
				this.m_seriesData[i][j] = getNumericComparableValue(this.m_seriesData[i][j]);
			}
		}
	}
};
ScatteredPlotChart.prototype.updateCategoryData = function () {
	this.m_displayCategoryDataFlag = [];
	for (var i = 0, outerLength = this.m_categoryData.length; i < outerLength; i++) {
		this.m_displayCategoryDataFlag[i] = [];
		for (var j = 0, innerLength = this.m_categoryData[i].length; j < innerLength; j++) {
			this.m_displayCategoryDataFlag[i][j] = true;
			if (isNaN(this.m_categoryData[i][j])) {
				this.m_displayCategoryDataFlag[i][j] = false;
				this.m_categoryData[i][j] = getNumericComparableValue(this.m_categoryData[i][j]);
			}
		}
	}
};
ScatteredPlotChart.prototype.isShapeAvailable = function () {
	var flag = true;
	for (var i = 0, length = this.m_seriesChartType.length; i < length; i++) {
		if ((this.m_seriesChartType[i] == undefined) || (this.m_seriesChartType[i] == "undefined"))
			flag = false;
	}
	return flag;
};
ScatteredPlotChart.prototype.isEmptyCategory = function () {
	if (this.getCategoryNames() != "" && this.m_categoryData.length != 0)
		return false;
	else
		return true;
};
ScatteredPlotChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawResetButton();
	this.drawLegends();
	var map = this.IsDrawingPossible();
	if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory())) {
		this.drawXAxis();
		this.drawYAxis();
		this.drawScatteredPlotChart();
		this.drawDataLabel();
		this.drawThreshold();
		this.drawBestFitLine();
	} else {
		this.drawSVGMessage(map.message);
	}
};
/**DAS-901 scatterplot check permission as there is no category in dataset to map */
ScatteredPlotChart.prototype.IsDrawingPossible = function() {
	var map = {};
	if (!IsBoolean(this.isEmptyCategory)) {
		if (!IsBoolean(this.m_isEmptySeries)) {
			if (IsBoolean(this.isVisibleSeries())) {
				map = {
					"permission": "true",
					message: this.m_status.success
				};
			} else {
				map = {
					"permission": "false",
					message: this.m_status.noSeries
				};
			}
		} else {
			if (IsBoolean(this.m_allSeriesDisplayNames.length > 0)) {
				if (IsBoolean(this.isVisibleSeries())) {
					if ((IsBoolean(this.m_isEmptySeries))) {
						map = {
							"permission": "false",
							message: this.m_status.noData
						};
					}
				} else {
					map = {
						"permission": "false",
						message: this.m_status.noSeries
					};
				}
			} else {
				map = {
					"permission": "false",
					message: this.m_status.noData
				};
			}
		}
	} else {
		map = {
			"permission": "false",
			message: this.m_status.noData
		};
	}
	return map;
};

/**Drawing best fit line**/
ScatteredPlotChart.prototype.drawBestFitLine = function () {
	if (!IsBoolean(this.m_designMode)) {
		for (var l = 0; l < this.m_categoryData.length; l++) {
			if (this.m_categoryData[l].length < 2) {
				break;
			}
			if (IsBoolean(this.m_bestfitline[l]) && IsBoolean(this.m_showSeries[l])) {
				var x = this.m_categoryData[l];
				var y = this.m_seriesData[l];
				var m = 0;
				var c = 0;
				var xSum =0;
				var ySum =0;
				var xsqrSum =0;
				var xySum =0;
				var ysqrSum = 0;
				var n = this.m_categoryData[l].length;
				for (var i = 0; i < n; i++) {
					xsqrSum += Math.pow(x[i], 2);
					xySum += x[i] * y[i];
					xSum += x[i] * 1;
					ySum += y[i] * 1;
					ysqrSum += Math.pow(y[i], 2);
				}
				/**calculating slope of line**/
				m = ( (n*xySum) - (xSum * ySum) ) / ( (n*xsqrSum) - (Math.pow(xSum, 2)) );
				/**calculating Intercept**/
				c = (ySum - (m*xSum) ) / n;
				
				/**Finding Correlation**/
				this.correlation = ( (n * xySum) - (xSum * ySum) ) / ( Math.sqrt((n * xsqrSum) - Math.pow(xSum, 2)) * Math.sqrt((n * ysqrSum) - Math.pow(ySum, 2)));
				//console.log(this.correlation);
				
				/**Line Draw**/
				var xfdata = this.m_xAxis.m_xAxisActualMarkersArray[0] * 1;
				var xldata = this.m_xAxis.m_xAxisActualMarkersArray[this.m_xAxis.m_xAxisActualMarkersArray.length - 1] * 1;
				var xratio = 1 / (xldata - xfdata);
				var perXPixel = xratio * (this.m_endX * 1  -  this.m_startX * 1);
				
				var yfdata = this.m_yAxis.m_yAxisMarkersArray[0] * 1;
				var yldata = this.m_yAxis.m_yAxisMarkersArray[this.m_yAxis.m_yAxisMarkersArray.length - 1] * 1;
				var yratio = 1 / (yldata - yfdata);
				var perYPixel = yratio * (this.m_startY * 1  -  this.m_endY * 1);
				
				var ynew = [];
				for (var j = 0; j < n; j++) {
					ynew[j] = m*x[j] + c;
				}
				
				var axisvalue = this.bestFitLineCalculation(x, y, ynew, perXPixel, perYPixel, xfdata, xldata, yfdata, yldata, c, m);
				var path = "";
	            var str = "";
				if (m < 0) {
					var x1 = axisvalue[0];
					var y1 = axisvalue[3];
					var x2 = axisvalue[2];
					var y2 = axisvalue[1];
					//this.drawLineBetweenPoints(this.m_bestfitlinewidth[l], "0.5", this.m_bestfitlinecolor[l], axisvalue[0], axisvalue[3], axisvalue[2], axisvalue[1]);
				} else {
					var x1 = axisvalue[0];
					var y1 = axisvalue[1];
					var x2 = axisvalue[2];
					var y2 = axisvalue[3];
					//this.drawLineBetweenPoints(this.m_bestfitlinewidth[l], "0.5", this.m_bestfitlinecolor[l], axisvalue[0], axisvalue[1], axisvalue[2], axisvalue[3]);
				}
				if (x1 != "" && y1 != "" && x2 != "" && y2 != "") {
                    str += "M" + x1 + "," + y1 + "L" + x2 + "," + y2;
                	path = str;
                    if (path != undefined || path != "") {
                    	var strokeDashArray = this.m_shapeSeries[l].common[0].getLineDashArray(this.m_bestfitlinetype[l], this.m_bestfitlinewidth[l]);
                        var newLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
                        newLine.setAttribute("d", path);
                        newLine.setAttribute("stroke-dasharray", strokeDashArray);
                        newLine.setAttribute("style", "stroke:" + this.m_bestfitlinecolor[l] + "; stroke-width:" + this.m_bestfitlinewidth[l] + ";fill:" + hex2rgb(this.m_bestfitlinecolor[l],"0.7") + ";");
                        $("#" + this.svgContainerId).append(newLine);
                    }
                }
				var isIE = /*@cc_on!@*/false || !!document.documentMode;
				if (IsBoolean(this.m_enableanimation) && !isIE) {
					this.m_shapeSeries[l].common[0].setLineAnimation(newLine);
				}
			}
		}
	}
};

ScatteredPlotChart.prototype.bestFitLineCalculation = function (x, y, ynew, perXPixel, perYPixel, xfdata, xldata, yfdata, yldata, c, m) {
	var axismap = [];
	if (yfdata < 0 && yldata < 0) {
		//console.log("Y min axis and Y max axis are -ve");
		var y1 = this.m_startY - ynew.min()*perYPixel + yfdata*perYPixel;
		var y2 = this.m_startY - ynew.max()*perYPixel + yfdata*perYPixel;
	} else if (yfdata < 0 && yldata > 0) {
		var y1 = this.m_startY - ynew.min()*perYPixel + yfdata*perYPixel;
		var y2 = this.m_startY - ynew.max()*perYPixel + yfdata*perYPixel;
	} else {
		/*Basic calculation
		var x1 = this.m_startX + x.min()*perXPixel;
		var y1 = this.m_startY - ynew.min()*perYPixel;
		var x2 = this.m_startX + x.max()*perXPixel;
		var y2 = this.m_startY - ynew.max()*perYPixel;*/
		if (yfdata > 0) {
			var y1 = this.m_startY - ynew.min()*perYPixel + yfdata*perYPixel;
			var y2 = this.m_startY - ynew.max()*perYPixel + yfdata*perYPixel;
		} else {
			var y1 = this.m_startY - ynew.min()*perYPixel;
			var y2 = this.m_startY - ynew.max()*perYPixel;
		}
	}
	
	if (xfdata < 0 && xldata < 0) {
		//console.log("X min axis and X max axis are -ve");
		var x1 = this.m_startX + x.min()*perXPixel - xfdata*perXPixel;
		var x2 = this.m_startX + x.max()*perXPixel - xfdata*perXPixel;
	} else if (xfdata < 0 && xldata > 0) {
		var x1 = this.m_startX + x.min()*perXPixel - xfdata*perXPixel;
		var x2 = this.m_startX + x.max()*perXPixel - xfdata*perXPixel;
	} else {
		if (xfdata > 0) {
			var x1 = this.m_startX + x.min()*perXPixel - xfdata*perXPixel;
			var x2 = this.m_startX + x.max()*perXPixel - xfdata*perXPixel;
		} else {
			var x1 = this.m_startX + x.min()*perXPixel;
			var x2 = this.m_startX + x.max()*perXPixel;
		}
	}
	//BDD-917 Scatterplot - Best fit line is plotting out of the chart boundaries(on title or axis area)
	if(y1 > this.m_startY && ynew.min() < 0 && m > 0){
		y1 = this.m_startY;
		x1 = ((yfdata - c)/m) * perXPixel + this.m_startX;
	}
	if(y1 > this.m_startY && ynew.min() && m < 0){
		y1 = this.m_startY;
	}
	if(y2 < this.m_endY){
		y2 = this.m_endY;
		x2 = ((yldata - c)/m) * perXPixel + this.m_startX;
	}
	if(x1 < this.m_startX && x.min() < 0){
		x1 = this.m_startX;
		y1 = (m*xfdata + c)*perYPixel + this.m_startY;
	}
	if(x2 > this.m_endX){
		x2 = this.m_endX;
		y2 = (m*xldata + c)*perYPixel + this.m_startY;
	}
	axismap.push(x1);
	axismap.push(y1);
	axismap.push(x2);
	axismap.push(y2);
	return axismap;
};

ScatteredPlotChart.prototype.drawLegends = function () {
	this.drawChartLegends();
	//this.drawLegendComponent();
};
ScatteredPlotChart.prototype.getLegendTableContent = function () {
	var legendTable = "";
	var legendName = (IsBoolean(this.m_showcolorbandlegends)) ? ((!IsBoolean(this.m_showdynamicrange))?(this.m_displayname.split(",")): (["Min","Max"])) : (this.getLegendNames());
	var color = (IsBoolean(this.m_showcolorbandlegends)) ? ((!IsBoolean(this.m_showdynamicrange))?(this.m_color):([this.m_minrangecolor,this.m_maxrangecolor])) : (this.getSeriesColors());
	for (var i = 0; i < legendName.length; i++) {
		var shape = (!IsBoolean(this.m_showcolorbandlegends))? this.m_seriesChartType[i] : this.m_rangeshapes[i];
		var orgShape = this.getHTMLShape(shape);
		legendTable += "<tr style=\"font-style:" + this.m_legendfontstyle + ";color:" + convertColorToHex(this.m_legendfontcolor) + ";text-decoration:" + this.m_legendtextdecoration + ";font-weight:" + this.m_legendfontweight + ";font-family:" + selectGlobalFont(this.m_legendfontfamily) + "\">"+
							"<td>"+this.drawLegendShape(orgShape,color[i])+"<span style=\"display:inline;\">" + legendName[i] +"</span></td></tr>";
	}
	return legendTable;
};
ScatteredPlotChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};
ScatteredPlotChart.prototype.initializeDraggableDivAndCanvas = function () {
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
ScatteredPlotChart.prototype.createSVG = function() {
    var temp = this;
    this.svgContainerId = "svgContainer" + temp.m_objectid;
    $("#" + temp.svgContainerId).remove();
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xlink", "http://www.w3.org/1999/xlink");
    svg.setAttribute("width", this.m_width);
    svg.setAttribute("height", this.m_height);
    svg.setAttribute("id", this.svgContainerId);
    $(svg).css({
        "width": this.m_width,
        "height": this.m_height
    });
    //svg.setAttribute("class", "svg_chart_container");
    $("#draggableDiv" + temp.m_objectid).append(svg);
    
    if (!IsBoolean(this.m_designMode) && (IsBoolean(this.m_enablezoom))) {
        var beginX, beginY, endX, endY;
        $(svg).selectable({
        	autoRefresh: false,
        	distance: 1,
            start: function(e) {
                var posX = $(this).position().left;
                var posY = $(this).position().top;

                beginX = e.pageX - posX;
                beginY = e.pageY - posY;

            },
            stop: function(e) {
                var posX = $(this).offset().left;
                var posY = $(this).offset().top;

                endX = e.pageX - posX;
                endY = e.pageY - posY;

                var StartX = (beginX > endX) ? endX : beginX;
                var StartY = (beginY > endY) ? endY : beginY;
                var EndX = (beginX > endX) ? beginX : endX;
                var EndY = (beginY > endY) ? beginY : endY;

                if (temp.m_scatterdragFlag == false) {
                    temp.originaldataProvider = temp.m_dataProvider;
                }

                temp.dragAndZoom(StartX, StartY, EndX, EndY);
                temp.drawResetButton();
            }
        });
    }
};
ScatteredPlotChart.prototype.dragAndZoom = function(startx, starty, endx, endy) {
    var temp = this;
    this.m_scatterdragFlag = true;
    for (var index = 0, length = this.m_seriesNames.length; index < length; index++) {
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[index]])) {
            break;
        }
    }
    this.origonalXposition = this.m_calculation.getXPixelArray(this.m_seriesNames[index]);
    this.origonalYposition = this.m_calculation.getYPixelArray(this.m_seriesNames[index]);
    var emptySeries = true;
    var newcategory = [];
    var newseries = [];
    var newseriesDataLabel = [];
    var newseriesConditionalColor = {};
    var newplotradiusarray = {};
    var newxPixelArray = [];
    var newyPixelArray = [];
    var newdataProvider = [];
    for (var j = 0, serDataLength = this.m_seriesData.length; j < serDataLength; j++) {
        newseries[j] = [];
        newcategory[j] = [];
        newxPixelArray[j] = [];
        newyPixelArray[j] = [];
        newseriesDataLabel[j] = [];
        newseriesConditionalColor[this.m_seriesNames[j]] = [];
        newplotradiusarray[this.m_seriesNames[j]] = [];
    }
    for (var k = 0; k < this.origonalXposition.length; k++) {
        for (var i = 0, outerLength = this.origonalXposition[k].length; i < outerLength; i++) {
            if (startx < this.origonalXposition[k][i] * 1 && endx > this.origonalXposition[k][i] * 1 && starty < this.origonalYposition[k][i] * 1 && endy > this.origonalYposition[k][i] * 1) {
                newseries[k].push(this.m_seriesData[k][i]);
                newcategory[k].push(this.m_categoryData[k][i]);
                newxPixelArray[k].push(this.m_calculation.m_xPixelArray[k][i]);
                newyPixelArray[k].push(this.m_calculation.m_yPixelArray[k][i]);
                newdataProvider.push(this.m_dataProvider[i]);
            }
        }
    }
    for(var j = 0; j < newseries.length; j++){
		if(newseries[j].length != 0){
			emptySeries = false;
			break;
		}
	}
	this.m_isEmptySeries = emptySeries;
    this.m_categoryData = newcategory;
    this.m_seriesData = newseries;
    this.m_xPixelArray = newxPixelArray;
    this.m_yPixelArray = newyPixelArray;
    this.m_dataProvider = newdataProvider;
    this.init();
    this.drawChart();
};
ScatteredPlotChart.prototype.drawTitle = function () {
	this.m_title.draw();
};
ScatteredPlotChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};
ScatteredPlotChart.prototype.drawResetButton = function() {
    var temp = this;
    $("#reseticon").remove();
    if (IsBoolean(this.m_scatterdragFlag)) {
        var x = (IsBoolean(this.m_showmaximizebutton) || (IsBoolean(this.m_showlegends) && IsBoolean(this.m_fixedlegend))) ? ((IsBoolean(this.m_showsettingmenubutton)) ? this.m_width - this.fontScaling(25) - 60 : this.m_width - this.fontScaling(25) - 30) : ((IsBoolean(this.m_showsettingmenubutton)) ? this.m_width - this.fontScaling(25) - 30 : this.m_width - this.fontScaling(25));
        var y = this.m_title.startY - this.fontScaling(10);
        var fontSize = this.fontScaling(16);
        var imageMenu = this.drawFontIcons("reseticon", "", x, y, "bd-refresh", fontSize);
        imageMenu.setAttribute("id", "reseticon");
        $(imageMenu).on("click", function() {
            $("#resetTooltipDiv").remove();
            temp.m_scatterdragFlag = false;
            temp.m_dataProvider = temp.originaldataProvider;
            temp.init();
            temp.drawChart();
            $("#reseticon").remove();
        });

        var zindex = 10000;
        var tooltip = "Reset";
        var fontfamily = selectGlobalFont(this.m_title.m_fontfamily);
        var fontsize = 12 + "px";
        var right = (IsBoolean(this.m_showmaximizebutton) || (IsBoolean(this.m_showlegends) && IsBoolean(this.m_fixedlegend))) ? this.fontScaling(50) - 30 + "px" : this.fontScaling(30) - 25 + "px";
        var cls = (IsBoolean(this.m_showmaximizebutton) || (IsBoolean(this.m_showlegends) && IsBoolean(this.m_fixedlegend))) ? "settingIcon" : "minMax";

        var top = (this.m_title.startY + 10) + "px";
        if (!IsBoolean(isTouchEnabled)) {
            if (!temp.m_designMode) {
                $("#reseticon").hover(function(e) {
                    var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
                    var scrollLeft = parentDiv.scrollLeft;
                    var scrollTop = parentDiv.scrollTop;
                    var offset = $(parentDiv).offset();
                    var PageTop = offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
                    var PageLeft = offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft;
                    var top = e.pageY - e.offsetY + $(this)[0].offsetHeight - PageTop + 1 + "px"; //comment this for overlap
                    var left = e.pageX - e.offsetX + ($(this)[0].offsetWidth / 2) - PageLeft + 8 + "px";

                    var tooltipDiv = document.createElement("div");
                    tooltipDiv.innerHTML = tooltip;
                    tooltipDiv.setAttribute("class", cls);
                    tooltipDiv.setAttribute("placement", "bottom");
                    tooltipDiv.setAttribute("id", "resetTooltipDiv");
                    $(tooltipDiv).css({
                        "font-family": fontfamily,
                        "font-size": fontsize,
                        "top": top,
                        "left": left,
                        "z-index": zindex,
                        "border": "1px solid #e0dfdf",
                        "padding": "24px",
                        "position": "absolute",
                        "border-radius": "6px",
                        "background-color": "#ffffff"
                    });
                    $("#draggablesParentDiv" + temp.m_dashboard.m_id).append(tooltipDiv);
                    var lt = e.pageX - e.offsetX + ($(this)[0].offsetWidth) - tooltipDiv.offsetWidth - PageLeft + 28 + "px";
                    $(tooltipDiv).css({
                        "left": lt
                    });
                }, function() {
                    $("#resetTooltipDiv").remove();
                });
            }
        }
    }
};
ScatteredPlotChart.prototype.drawXAxis = function () {
	this.createTickGroup('xaxistickgrp');
	this.m_xAxis.drawTickMarksForScatterPlotChart();
	
	if (IsBoolean(this.m_showverticalmarkerline)){
		this.createVerticalLineGroup('verticallinegrp');
		this.m_xAxis.drawVerticalLineForScatterPlotChart();
	}
	this.m_xAxis.markXaxis();
	this.m_xAxis.drawXAxis();
};

ScatteredPlotChart.prototype.drawYAxis = function () {
	if (IsBoolean(this.m_showmarkerline)){
		this.createHorizontalLineGroup('horizontallinegrp');
		this.m_yAxis.horizontalMarkerLines();
	}
	if (IsBoolean(this.m_zeromarkerline) && !IsBoolean(this.m_basezero) && IsBoolean(this.m_yAxis.hasNegativeAxisMarker(this.m_yAxis.m_yAxisMarkersArray))){
		this.m_yAxis.zeroMarkerLine();
	}
	if (IsBoolean(this.m_verticalzeromarkerline) && !IsBoolean(this.m_horizontalaxisbasezero) && IsBoolean(this.m_yAxis.hasNegativeAxisMarker(this.m_xAxis.m_xAxisActualMarkersArray))){
		this.m_xAxis.zeroMarkerVerticalLineForScatterPlotChart();
	}
	this.createYAxisMarkerLabelGroup('yaxislabelgrp');
	this.m_yAxis.markYaxis();
	this.m_yAxis.drawYAxis();
};
/*ScatteredPlotChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};*/

/** @description overrite drawObject Method  because of ChartFrame and Titles are drawn on SVG  **/
ScatteredPlotChart.prototype.drawObject = function () {
	this.drawSVGObject();
};

ScatteredPlotChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawSVGFrame();
	this.getBGGradientColorToContainer();
};
/** @description Will generate the gradient and fill in background of chart  **/
ScatteredPlotChart.prototype.getBGGradientColorToContainer = function () {
	var temp = this;
	var defsElement = document.createElementNS('http://www.w3.org/2000/svg', "defs");
    defsElement.setAttribute("id", "defsElement" + temp.m_objectid);
	$("#" + temp.svgContainerId).append(defsElement);
};
ScatteredPlotChart.prototype.drawScatteredPlotChart = function () {
	for (var i = 0, length = this.getCategoryData().length; i < length; i++) {
		if (IsBoolean(this.m_showSeries[i])){
			switch (this.m_shapeSeries[i].shape) {
				case "cross":
					this.createShapeGroup('crossgrp', i , this.m_seriesNames[i]);
					break;
				case "cube":
					this.createShapeGroup('cubegrp', i , this.m_seriesNames[i]);
					break;
				case "line":
					this.createShapeGroup('bubblegrp', i , this.m_seriesNames[i]);
					break;
				case "plus":
					this.createShapeGroup('plusgrp', i , this.m_seriesNames[i]);
					break;
				case "polygon":
					this.createShapeGroup('polygongrp', i , this.m_seriesNames[i]);
					break;
				case "point":
					this.createShapeGroup('bubblegrp', i , this.m_seriesNames[i]);
					break;
				case "quad":
					this.createShapeGroup('quadgrp', i , this.m_seriesNames[i]);
					break;
				case "star":
					this.createShapeGroup('stargrp', i , this.m_seriesNames[i]);
					break;
				case "triangle":
					this.createShapeGroup('trianglegrp', i , this.m_seriesNames[i]);
					break;
				default :
					this.createShapeGroup('bubblegrp', i , this.m_seriesNames[i]);
					break;
			}
			this.m_shapeSeries[i].drawShapeSeries(i);
		}
	}
}
/** @description drawing Data Label on Scattered Plot chart**/
ScatteredPlotChart.prototype.drawDataLabel = function() {
    for (var i = 0, length = this.m_seriesNames.length; i < length; i++) {
        var ValueText = this.m_valueTextSeries[this.m_seriesNames[i]];
        if (IsBoolean(this.m_seriesDataLabelProperty[i].showDataLabel)) {
            this.createDataLabelGroup(ValueText, 'datalabelgrp', i, this.m_seriesNames[i]);
            ValueText.drawValueTextSeriesPlot();
        }
    }
};
/** @description drawing Data Label on Scattered Plot chart only when point is drawable**/
ValueTextSeries.prototype.drawValueTextSeriesPlot = function() {
    for (var i = 0; i < this.xPositionArray.length; i++) {
        var ValueText = this.valueText[i];
        if ((ValueText.xPosition !== null && ValueText.xPosition !== "" && ValueText.yPosition != null && ValueText.yPosition !== "" && ValueText.yPosition <= ValueText.m_chart.getStartY() && ValueText.yPosition >= ValueText.m_chart.getEndY()) && ((ValueText.xPosition >= ValueText.m_chart.getStartX() && ValueText.xPosition <= ValueText.m_chart.getEndX()) && ((ValueText.yPosition * 1) <= ValueText.m_chart.getStartY() && (ValueText.yPosition * 1) >= ValueText.m_chart.getEndY()))) {
        	/*DAS-366*/  
        	if (IsBoolean(this.valueText[i].datalabelProperties.hideDataLabel)) {
			    if (this.valueText[i].m_ySeriesActualData.toString() !== this.valueText[i].datalabelProperties.hideDataLabelText) {
			      this.valueText[i].drawValueText(i);
			    }
			  } else {
			    this.valueText[i].drawValueText(i);
			  }
        }
    }
};
/** @description drawing line on Scattered Plot chart**/
ScatteredPlotChart.prototype.drawThreshold = function() {
	if(IsBoolean(this.m_showxaxisthreshold)) {
		var lineWidth = 0.5;
		var antiAliasing = 0.5;
		var fData = getNumericComparableValue(this.m_xAxis.m_xAxisActualMarkersArray[0]) * 1;
		var lData = getNumericComparableValue(this.m_xAxis.m_xAxisActualMarkersArray[this.m_xAxis.m_xAxisActualMarkersArray.length-1]) * 1;
		
		//&& !IsBoolean(this.m_horizontalaxisbasezero)
		this.m_minimumxaxisthreshold = (IsBoolean(this.m_minimumxaxisthresholdline))?
				this.m_minimumxaxisthreshold:this.m_xAxis.m_xAxisActualMarkersArray[0];
		
		var ratio = 1 / (lData - fData);
		var perXPixel = ratio * (this.m_endX * 1  -  this.m_startX * 1);
		var pixelValue = {};
		if (IsBoolean(this.m_horizontalaxisautoadjust) && IsBoolean(this.m_horizontalaxisbasezero)) {
			if ( (this.m_minimumxaxisthreshold*1) < (fData*1) && (this.m_maximumxaxisthreshold*1) > (lData*1) ) {
				pixelValue["x1"] = this.m_startX * 1;
				pixelValue["y1"] = this.m_startY * 1;
				pixelValue["x2"] = this.m_startX * 1;
				pixelValue["y2"] = this.m_endY * 1;
				
				pixelValue["X1"] = this.m_endX * 1;
				pixelValue["Y1"] = this.m_startY * 1;
				pixelValue["X2"] = this.m_endX * 1;
				pixelValue["Y2"] = this.m_endY * 1;
			} else if ( (this.m_minimumxaxisthreshold*1) < (fData*1) ) {
				pixelValue["x1"] = this.m_startX * 1;
				pixelValue["y1"] = this.m_startY * 1;
				pixelValue["x2"] = this.m_startX * 1;
				pixelValue["y2"] = this.m_endY * 1;
				
				pixelValue["X1"] = this.m_startX * 1 + (this.m_maximumxaxisthreshold * perXPixel);
				pixelValue["Y1"] = this.m_startY * 1;
				pixelValue["X2"] = this.m_startX * 1 + (this.m_maximumxaxisthreshold * perXPixel);
				pixelValue["Y2"] = this.m_endY * 1;
			} else if ( (this.m_maximumxaxisthreshold*1) > (lData*1) ) {
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
		} else {
			pixelValue = this.thresholdXAxisCalculation(fData , lData , perXPixel);
		}
		
		var strokeStyle = hex2rgb(this.m_markercolor, this.m_markertransparency);
		if(IsBoolean(this.m_minimumxaxisthresholdline)){
			this.drawLineBetweenPoints(this.m_xaxisthresholdlinewidth, antiAliasing, this.m_xaxisthresholdstrokecolor, pixelValue.x1, pixelValue.y1, pixelValue.x2, pixelValue.y2);
		}
		this.drawLineBetweenPoints(this.m_xaxisthresholdlinewidth, antiAliasing, this.m_xaxisthresholdstrokecolor, pixelValue.X1, pixelValue.Y1, pixelValue.X2, pixelValue.Y2);
		//this.fillColorBetweenPoints(lineWidth, antiAliasing, "#ffffff", pixelValue.x1, pixelValue.y2, (pixelValue.X2-pixelValue.x1), (pixelValue.Y2-pixelValue.Y1));
		this.fillColorBetweenPoints(lineWidth, antiAliasing, "#ffffff", pixelValue.x1, pixelValue.y2, (pixelValue.X2-pixelValue.x1), (pixelValue.Y1-pixelValue.Y2));
	}
	
	if(IsBoolean(this.m_showyaxisthreshold)){
		var lineWidth = 0.5;
		var antiAliasing = 0.5;
		var fData = this.m_yAxis.m_yAxisMarkersArray[0] * 1;
		var lData = this.m_yAxis.m_yAxisMarkersArray[this.m_yAxis.m_yAxisMarkersArray.length-1] * 1;
		
		var ratio = 1 / (lData - fData);
		var perYPixel = ratio * (this.m_startY * 1  -  this.m_endY * 1);
		
		//&& !IsBoolean(this.m_basezero)
		this.m_minimumyaxisthreshold = (IsBoolean(this.m_minimumyaxisthresholdline))?
				this.m_minimumyaxisthreshold:this.m_yAxis.m_yAxisMarkersArray[0];
		
		var pixelValue = {};
		if (IsBoolean(this.m_autoaxissetup) && IsBoolean(this.m_basezero)) {
			//this.m_maximumyaxisthreshold = this.m_yAxis.m_yAxisMarkersArray[this.m_yAxis.m_yAxisMarkersArray.length-1];
			if ( (this.m_minimumyaxisthreshold*1) < (fData*1) && (this.m_maximumyaxisthreshold*1) > (lData*1) ) {
				pixelValue["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
				pixelValue["y1"] = this.m_startY * 1;
				pixelValue["x2"] = this.m_endX * 1;
				pixelValue["y2"] = this.m_startY * 1;
				
				pixelValue["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
				pixelValue["Y1"] = this.m_endY * 1;
				pixelValue["X2"] = this.m_endX * 1;
				pixelValue["Y2"] = this.m_endY * 1;
			} else if ( (this.m_minimumyaxisthreshold*1) < (fData*1) ) {
				pixelValue["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
				pixelValue["y1"] = this.m_startY * 1;
				pixelValue["x2"] = this.m_endX * 1;
				pixelValue["y2"] = this.m_startY * 1;
				
				pixelValue["X1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
				pixelValue["Y1"] = this.m_startY * 1 - (this.m_maximumyaxisthreshold * perYPixel);
				pixelValue["X2"] = this.m_endX * 1;
				pixelValue["Y2"] = this.m_startY * 1 - (this.m_maximumyaxisthreshold * perYPixel);
			} else if ( (this.m_maximumyaxisthreshold*1) > (lData*1) ) {
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
		} else {
			var pixelValue = this.thresholdYAxisCalculation(fData , lData , perYPixel);
		}
		
		var strokeStyle = hex2rgb(this.m_markercolor, this.m_markertransparency);
		if (IsBoolean(this.m_minimumyaxisthresholdline)) {
			this.drawLineBetweenPoints(this.m_yaxisthresholdlinewidth, antiAliasing, this.m_yaxisthresholdstrokecolor, pixelValue.x1, pixelValue.y1, pixelValue.x2, pixelValue.y2);
		}
		this.drawLineBetweenPoints(this.m_yaxisthresholdlinewidth, antiAliasing, this.m_yaxisthresholdstrokecolor, pixelValue.X1, pixelValue.Y1, pixelValue.X2, pixelValue.Y2);
		//this.fillColorBetweenPoints(lineWidth, antiAliasing, "#000000", pixelValue.x1, pixelValue.y1, pixelValue.X2-pixelValue.x1, (pixelValue.Y2-pixelValue.y2));
		this.fillColorBetweenPoints(lineWidth, antiAliasing, "#000000", pixelValue.x1, pixelValue.Y1, pixelValue.X2-pixelValue.x1, (pixelValue.y2-pixelValue.Y2));
	}
};
/** @description y-axis threshold pixel calculation Scattered Plot chart**/
ScatteredPlotChart.prototype.thresholdYAxisCalculation = function(fData , lData , perYPixel) {
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
		}
	} else {
		if (lData < 0) {		// Left Axis is +ve && Right Axis is -ve
//			console.log("C");
		} else {		// Left Axis is +ve && Right Axis is +ve
			if ( (this.m_minimumyaxisthreshold*1) < (fData*1) && (this.m_maximumyaxisthreshold*1) > (lData*1) ) {
				pixelMap["x1"] = this.m_startX * 1 - this.m_axistodrawingareamargin;
				pixelMap["y1"] = this.m_startY * 1;
				pixelMap["x2"] = this.m_endX * 1;
				pixelMap["y2"] = this.m_startY * 1 ;
				
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
		}
	}
	return pixelMap;
};
/** @description x-axis threshold pixel calculation Scattered Plot chart**/
ScatteredPlotChart.prototype.thresholdXAxisCalculation = function(fData , lData , perXPixel) {
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
			} else if ( (this.m_maximumxaxisthreshold*1) > (lData*1)  ) {
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
		}
	} else {
		if (lData < 0){		// Left Axis is +ve && Right Axis is -ve
//			console.log("C");
		} else {		// Left Axis is +ve && Right Axis is +ve
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
			} else if ( (this.m_maximumxaxisthreshold*1) > (lData*1)  ) {
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
		}
	}
	return pixelMap;
};
/** @description filling color for threshold range on Scattered Plot chart**/
ScatteredPlotChart.prototype.fillColorBetweenPoints = function(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2) {
	if(IsBoolean(this.m_enablethresholdfill)){
		var strokeStyle = hex2rgb(this.m_thresholdfillcolor, this.m_thresholdfillopacity);
		var rect = drawSVGRect(x1,y1,x2,y2,strokeStyle);
		$("#" + this.svgContainerId).append(rect);
	}
};
/** @description joining line on Scattered Plot chart**/
ScatteredPlotChart.prototype.drawLineBetweenPoints = function(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2) {
	var line = drawSVGLine(x1,y1,x2,y2,lineWidth,strokeColor);
	var strokeDashArray = this.getLineDashArray(this.m_thresholdlinetype, lineWidth);
	line.setAttribute("stroke-dasharray", strokeDashArray);
	line.setAttribute("shape-rendering", "");
	$("#" + this.svgContainerId).append(line);
};

ScatteredPlotChart.prototype.getLineDashArray = function(lineType, lineWidth) {
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

ScatteredPlotChart.prototype.IsThresholdFlag = function(data) {
	if( ((this.m_minimumxaxisthreshold * 1) === (data * 1)) || ((this.m_maximumxaxisthreshold * 1) === (data * 1)) )
		return true;
	else
		return false;
};
ScatteredPlotChart.prototype.setStartX = function () {
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
ScatteredPlotChart.prototype.getMinimumSeriesValue = function () {
	return this.m_minimumseriesvalue;
};
ScatteredPlotChart.prototype.getMaximumSeriesValue = function () {
	return this.m_maximumSeriesValue;
};
ScatteredPlotChart.prototype.setMaxMinSeriesValue = function () {
	this.m_maximumSeriesValue = 0;
	this.m_minimumseriesvalue = 0;
	for (var i = 0, innerLength = this.m_seriesData.length; i < innerLength; i++) {
		for (var j = 0, outerLength = this.m_seriesData[i].length; j < outerLength; j++) {
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
ScatteredPlotChart.prototype.getYAxisLabelMargin = function () {
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
ScatteredPlotChart.prototype.getLabelSecondFormatterMargin = function () {
	var lsfm = 0;

	if (!IsBoolean(this.m_fixedlabel)) {
		if (IsBoolean(this.m_yAxis.getLeftaxisFormater())) {
			if (this.getSecondaryFormater() != "none" && this.getSecondaryFormater() != "") {
				if (this.getSecondaryUnit() != "none" && this.getSecondaryUnit() != "") {
					if (this.getSecondaryUnit() != "auto") {
						var secondunit = this.m_util.getFormatterSymbol(this.getSecondaryFormater(), this.getSecondaryUnit());
					} else if (this.getSecondaryUnit() == "auto" && this.m_unit == "Rupees") {
						var secondunit = getNumberFormattedSymbol(this.m_calculation.serMax * 1, this.m_unit);
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
ScatteredPlotChart.prototype.getLabelFormatterMargin = function () {
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
ScatteredPlotChart.prototype.getLabelWidth = function () {
	return this.m_labelwidth;
};
ScatteredPlotChart.prototype.setLabelWidth = function() {
	this.m_labelwidth = 0;
	var maxSeriesVals = [];
	if (this.fontScaling(this.m_yAxis.m_labelfontsize) > 0) {
		for (var i = 0, length = this.m_calculation.m_yAxisMarkersArray.length; i < length; i++) {
			var maxSeriesVal = this.m_calculation.m_yAxisMarkersArray[i];
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
ScatteredPlotChart.prototype.getLabelSignMargin = function () {
	var lsm = 0;
	var msvw = 0;
	var minSeriesValue = this.getMinimumSeriesValue();
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
ScatteredPlotChart.prototype.getLabelPrecisionMargin = function () {
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
ScatteredPlotChart.prototype.setStartY = function () {
	var cm = this.getChartMargin();
	//var xlbm = this.getXAxisLabelMargin();
	var xdm = this.getXAxisDescriptionMargin();
	this.setMaxMinCategoryValue();
	this.setLabelWidthForSecondAxis();
	var lwsa = this.getLabelWidthForSecondAxis();
	var lssfm = this.getLabelSecondarySecondFormatterMargin();
	var slpm = this.getSecondaryLabelPrecisionMargin();
	//this.m_extraspace =  lwsa * 1 + lssfm * 1 + slpm * 1;
	this.m_extraspace =  lwsa * 1;
	var bottomMargin = cm * 1  + xdm * 1 + this.m_extraspace ;
	this.m_startY = (this.m_y * 1 + this.m_height * 1 - bottomMargin * 1);
};
ScatteredPlotChart.prototype.getMinimumCategoryValue = function () {
	return this.m_minimumCategoryvalue;
};
ScatteredPlotChart.prototype.getMaximumCategoryValue = function () {
	return this.m_maximumCategoryValue;
};
ScatteredPlotChart.prototype.setMaxMinCategoryValue = function () {
	this.m_maximumCategoryValue = 0;
	this.m_minimumCategoryvalue = 0;
	for (var i = 0, outerLength = this.m_categoryData.length; i < outerLength; i++) {
		 for (var j = 0, innerLength = this.m_categoryData[i].length; j < innerLength; j++) {
			  var data = this.m_categoryData[i][j];
			  data = (isNaN(data) || data == undefined || data == "") ? 0 : data;
			  if (i == 0 && j == 0) {
				  this.m_maximumCategoryValue = data;
				  this.m_minimumCategoryvalue = data;
			  }
			  if (this.m_maximumCategoryValue * 1 <= data * 1) {
					this.m_maximumCategoryValue = data;
			  }
			  if (this.m_minimumseriesvalue * 1 > data * 1) {
					this.m_minimumseriesvalue = data;
			  }
		}
	}
};
ScatteredPlotChart.prototype.getXAxisLabelMargin = function () {
	var xAxislabelDescMargin = 15;
	if (IsBoolean(this.m_xAxis.getLabelTilted())) {
		this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
		xAxislabelDescMargin = this.ctx.measureText(this.getCategoryData()[0][0]).width;
		for (var i = 1, length = this.getCategoryData().length; i < length; i++) {
			if (xAxislabelDescMargin < this.ctx.measureText(this.getCategoryData()[0][i]).width)
				xAxislabelDescMargin = this.ctx.measureText(this.getCategoryData()[0][i]).width;
		}
		if (xAxislabelDescMargin > this.m_height / 4) {
			xAxislabelDescMargin = (this.m_xAxis.getLabelrotation() <= 70) ? (this.m_height / 4 - 15) : this.m_height / 4;
		}
		this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
		var xlm = this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.8;
		this.noOfRows = this.setNoOfRows();
		xAxislabelDescMargin = (xlm) * this.noOfRows;
	} else {
		this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px " + this.m_xAxis.getLabelFontFamily();
		var xlm = this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.8;
		this.noOfRows = this.setNoOfRows();
		xAxislabelDescMargin = (xlm) * this.noOfRows;
	}
	return xAxislabelDescMargin;
};
/** @description return  Label Width For SecondAxis  **/
ScatteredPlotChart.prototype.getLabelWidthForSecondAxis = function () {
	return this.m_labelwidthsecondaxis;
};
/** @description return  Label Width For SecondAxis  **/
ScatteredPlotChart.prototype.setLabelWidthForSecondAxis = function () {
	this.m_labelwidthsecondaxis = 0;
	var radians = this.m_xAxis.m_labelrotation * (Math.PI / 180);
	if (IsBoolean(this.m_xAxis.getLabelTilted())) {
		var maxSeriesVals = [];
		for (var i = 0, length = this.m_calculation.m_xAxisMarkersArray.length; i < length; i++) {
			maxSeriesVals[i] = this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.8;
		    var maxSeriesVal = this.m_calculation.m_xAxisMarkersArray[i];
		    maxSeriesVal = getFormattedNumberWithCommas(maxSeriesVal, this.m_secondaryaxisnumberformatter);
		    this.ctx.beginPath();
		    this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
		    var markerWidth = Math.abs(this.ctx.measureText(maxSeriesVal).width * radians);
			if (maxSeriesVals[i] < markerWidth){
				maxSeriesVals[i] = markerWidth;
			}
		    this.ctx.closePath();
		}
		this.m_labelwidthsecondaxis = getMaxValueFromArray(maxSeriesVals);
	}else{
		this.ctx.beginPath();
	    this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
	    var xlm = this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.8;
		this.noOfRows = this.setNoOfRows();
		this.m_labelwidthsecondaxis =  (xlm) * this.noOfRows;
	}
};
ScatteredPlotChart.prototype.getLabelSecondarySecondFormatterMargin = function () {
	var lssfm = 0;
	if (this.m_secondaryaxissecondaryformatter != "none" && this.m_secondaryaxissecondaryformatter != "") {
		if (this.m_secondaryaxissecondaryunit != "none" && this.m_secondaryaxissecondaryunit != "") {
			if (this.m_secondaryaxissecondaryunit != "auto") {
				var secondunit = this.m_util.getFormatterSymbol(this.m_secondaryaxissecondaryformatter, this.m_secondaryaxissecondaryunit);
			} else if (this.m_secondaryaxissecondaryunit == "auto" && this.m_secondaryaxisunit == "Rupees") {
				var secondunit = getNumberFormattedSymbol(this.m_calculation.catMax * 1, this.m_secondaryaxisunit);
			} else {
				var secondunit = "K";
			}
			this.ctx.font = this.m_xAxis.m_fontstyle + " " + this.m_xAxis.m_fontweight + " " + this.fontScaling(this.m_xAxis.m_fontsize) + "px " + selectGlobalFont(this.m_xAxis.m_fontfamily);
			lssfm = this.ctx.measureText(secondunit).width;
		}
	}
   return lssfm;
};
ScatteredPlotChart.prototype.getSecondaryLabelPrecisionMargin = function () {
	//var slpm = 5;
	var slpm = 0;
	if (IsBoolean(this.m_xAxis.getLabelTilted())) {
		this.ctx.beginPath();
		this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
		var precisionText = ".0";
		slpm = this.ctx.measureText(precisionText).width;
		if (!IsBoolean(this.m_fixedlabel)) {
			if (IsBoolean(this.m_yAxis.getLeftaxisFormater())) {
				if (this.m_precision != "none" && this.m_secondaryaxisprecision != "" &&this.m_secondaryaxisprecision != 0) {
					var precisionText = ".0";
					for (var i = 0; i < this.m_secondaryaxisprecision; i++)
						 precisionText = precisionText + "" + "0";
						 slpm = this.ctx.measureText(precisionText).width;
				}
			}
		}
		this.ctx.closePath();
	}
	return slpm;
};	
ScatteredPlotChart.prototype.setNoOfRows = function () {
	this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
	var textWidth = this.ctx.measureText(this.m_calculation.m_xAxisMarkersArray[0]).width;
	//has to divide by markers , otherwise it will through NaN
	var xDivision = (this.getEndX() - this.getStartX()) / this.m_calculation.m_noOfXAxisMarkers;
	var noOfRow = 1;
	for (var i = 1; i < this.m_calculation.m_xAxisMarkersArray.length; i++) {
		if (this.ctx.measureText(this.m_calculation.m_xAxisMarkersArray[i]).width > xDivision)
			noOfRow = 2;
	}
	return noOfRow;
};
ScatteredPlotChart.prototype.setEndX = function () {
	var blm = this.getBorderToLegendMargin();
	var vlm = this.getVerticalLegendMargin();
	var vlxm = this.getVerticalLegendToXAxisMargin();
	var rightSideMargin = blm * 1 + vlm * 1 + vlxm * 1;
	this.m_endX = (this.m_x * 1 + this.m_width * 1 - rightSideMargin * 1);
};
ScatteredPlotChart.prototype.setEndY = function () {
	this.m_endY = (this.m_y * 1 + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1 + this.getRadiusMargin() * 1);
};
ScatteredPlotChart.prototype.getRadiusMargin = function () {
	var flag = false;
	for (var i = 0; i < this.plotRadiusArr.length; i++) {
		if (((this.plotRadiusArr[i] != parseInt(this.plotRadiusArr[i], 10))))
			flag = true;
	}

	if (IsBoolean(flag))
		return (this.m_maxradius / 2);
	else
		return (this.m_minradius * 2);
};
ScatteredPlotChart.prototype.getToolTipData = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && (this.m_customtextboxfortooltip.dataTipType!=="None")) {
		var toolTipData;
		this.xPositionArr = this.m_calculation.getXPixelArray();
		this.yAxisDataArray = this.m_calculation.getYPixelArray();
		var radiusArray = this.m_calculation.getPlotRadius();
		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			for (var i = 0, outerLength = this.xPositionArr.length; i < outerLength; i++) {
				for (var k = 0, innerLength = this.xPositionArr[i].length; k < innerLength; k++) {
					var m_plotRadius = (radiusArray[i][k] < 2) ? 2 : radiusArray[i][k];
					if (this.xPositionArr[i][k] != null)
						if (mouseX <= (this.xPositionArr[i][k] * 1 + m_plotRadius * 1) && (mouseX >= this.xPositionArr[i][k] * 1 - m_plotRadius * 1)) {
							if (mouseY <= (this.yAxisDataArray[i][k] * 1 + m_plotRadius * 1) && (mouseY >= this.yAxisDataArray[i][k] * 1 - m_plotRadius * 1)) {
								toolTipData = {};
								if (this.m_customtextboxfortooltip.dataTipType == "Default"){
									toolTipData["data"] = new Array();
								//will update displayname and otherfield displayname for xfield and yfield
								if(this.typeArr[i] == "YField" ){
									var displayName = this.getSeriesDisplayNamesForToolTip(i);
									var otherfielddisplayname = this.otherFieldDisplayNamesArr[i];
								} else {
									var displayName = this.otherFieldDisplayNamesArr[i]									
									var otherfielddisplayname = this.getSeriesDisplayNamesForToolTip(i);
								}
								var categoryData = (IsBoolean(this.m_customtextboxfortooltip.useComponentFormatter))?this.getXaxisFormatterForToolTip(this.m_categoryData[i][k]):this.getUpdatedFormatterForToolTip(this.m_categoryData[i][k], otherfielddisplayname);
								toolTipData.data.push([{"color":this.getColorValue(this.getPlotHexColor()[i][k],i),"shape":this.m_seriesChartType[i]}, "X", otherfielddisplayname, categoryData]);
								var seriesData = (IsBoolean(this.m_customtextboxfortooltip.useComponentFormatter))?this.getFormatterForToolTip(this.m_seriesData[i][k]):this.getUpdatedFormatterForToolTip(this.m_seriesData[i][k], displayName);
								toolTipData.data.push([{"color":this.getColorValue(this.getPlotHexColor()[i][k],i),"shape":this.m_seriesChartType[i]}, "Y", displayName, seriesData]);
								if (this.getChartTypeRadius()[i] && this.getAllDPFields().indexOf(this.getChartTypeRadius()[i]) != -1) {
									var radiusData = (this.m_plotRadiusData[i][k]);
									toolTipData.data.push([{"color":this.getColorValue(this.getPlotHexColor()[i][k],i),"shape":this.m_seriesChartType[i]}, "Radius", this.radiusFieldDisplayNamesArr[i], radiusData]);
								}
								if (this.getChartTypeColors()[i] && this.getAllDPFields().indexOf(this.getChartTypeColors()[i]) != -1) {
									var colorData = (this.m_plotColorData[i][k]);
									toolTipData.data.push([{"color":this.getColorValue(this.getPlotHexColor()[i][k],i),"shape":this.m_seriesChartType[i]}, "Color", this.colorFieldDisplayNamesArr[i], colorData]);
								}
								break;
								}else{
									toolTipData = this.getDataProvider()[k];
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
/** @description method checks if tooltip has any data formatting, andreturns formatted value **/
ScatteredPlotChart.prototype.getXaxisFormatterForToolTip = function (data) {
	if (isNaN(data) || data == "" || data == undefined) {
		return data;
	} else {
		if(this.m_tooltipprecision !== "default") {
			var m_precision = (this.m_tooltipprecision == 0 && data % 1 != 0) ? 2 : this.m_tooltipprecision;
		} else {
			var m_precision = ( data + "").split(".");
		    if (m_precision[1] !== undefined) {
		    	m_precision = m_precision[1].length;
		    } else {
		    	m_precision = 0;
		    }
		}
		data = this.getLocaleWithPrecision(data, m_precision, this.m_secondaryaxisnumberformatter);
		if (IsBoolean(this.m_calculation.m_isSecondAxisFormatter) && this.m_calculation.m_secondAxisUnitSymbol != undefined) {
			data = this.m_util.addFormatter(data, this.m_calculation.m_secondAxisUnitSymbol, this.m_calculation.m_secondAxisFormatterPosition, this.m_secondaryaxisprecision);
		}
		if (IsBoolean(this.m_calculation.m_isSecondAxisSecondaryFormatter) && this.m_calculation.m_secondAxisSecondaryUnitSymbol === "%") {
			data = this.m_calculation.getSecondaryFormaterAddedText(data, this.m_calculation.m_secondAxisSecondaryUnitSymbol);
		}
		return data;
	}
};
ScatteredPlotChart.prototype.getColorValue = function (color,i) {
	this.color = color;
	//this.color = (this.color == undefined) ? "#993366" : this.color ;
	//var luminanceColor = ColorLuminance(this.color, this.m_luminance) ;
	//luminanceColor = (this.color == luminanceColor) ? hex2rgb(this.color,this.m_chart.m_transparency) : luminanceColor ;
	var luminanceColor = hex2rgb(this.color, this.m_transparency[i]);
	return luminanceColor;
};
ScatteredPlotChart.prototype.drawTooltip = function (mouseX, mouseY) {
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
ScatteredPlotChart.prototype.drawTooltipContent=function(toolTipData){
	this.m_tooltip.draw(toolTipData, this.m_componenttype);
};
ScatteredPlotChart.prototype.getDrillDataPoints = function(mouseX, mouseY) {
    if (!IsBoolean(this.m_isEmptySeries)) {
        this.xPositionArr = this.m_calculation.getXPixelArray();
        this.yAxisDataArray = this.m_calculation.getYPixelArray();
        var radiusArray = this.m_calculation.getPlotRadius();
        /*DAS-179*/
        if ((mouseX >= this.getStartX() - 10) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY() + 10) && (mouseY >= this.getEndY())) {
            for (var i = 0, outerLength = this.xPositionArr.length; i < outerLength; i++) {
                for (var k = 0, innerLength = this.xPositionArr[i].length; k < innerLength; k++) {
                    if (this.xPositionArr[i][k] != null) {
                        if (mouseX <= (this.xPositionArr[i][k] * 1 + radiusArray[i][k] * 1) && (mouseX >= this.xPositionArr[i][k] * 1 - radiusArray[i][k] * 1)) {
                            if (mouseY <= (this.yAxisDataArray[i][k] * 1 + radiusArray[i][k] * 1) && (mouseY >= this.yAxisDataArray[i][k] * 1 - radiusArray[i][k] * 1)) {
                                var fieldNameValueMap = this.getDataProvider()[k];
                                /**Clicked color drills as the drill-color not series color.*/
                                var drillColor = this.getPlotHexColor()[i][k];
                                fieldNameValueMap.drillIndex = k;
                                /*if (IsBoolean(this.m_drilltoggle)) {
                                    this.m_drilltoggle = false;
                                } else {
                                    this.m_drilltoggle = true;
                                }*/
                                return {
                                    "drillRecord": fieldNameValueMap,
                                    "drillColor": drillColor
                                };
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
};
ScatteredPlotChart.prototype.getChartTypeNames = function () {
	var fieldNames = [];
	var shapeNames = ["point", "quad", "triangle", "cross", "cube"];
	for (var i = 0, count = 0, length = this.getSeriesData().length; i < length; i++) {
		if (this.typeArr[i] == "YField" && this.otherFieldArr[i] != "") {
			fieldNames.push(shapeNames[count]);
			count++;
			if (count == 5)
				count = 0;

		}
		if (this.typeArr[i] == "XField" && this.otherFieldArr[i] != "") {
			fieldNames.push(shapeNames[count]);
			count++;
			if (count == 5)
				count = 0;

		}
	}
	return fieldNames;
};
ScatteredPlotChart.prototype.getChartTypeRadius = function () {
	var plotradius = [];
	for (var i = 0, length = this.nameArr.length; i < length; i++) {
		if (this.typeArr[i] == "YField" && this.otherFieldArr[i] != "") {
			plotradius.push(this.plotRadiusArr[i]);
		} else if (this.typeArr[i] == "XField" && this.otherFieldArr[i] != "") {
			plotradius.push(this.plotRadiusArr[i]);
		}else{
			plotradius.push(this.plotRadiusArr[i]);
		}
	}
	return plotradius;
};
ScatteredPlotChart.prototype.getChartTypeColors = function () {
	var colorfield = [];
	for (var i = 0, length = this.nameArr.length; i < length; i++) {
		if (this.typeArr[i] == "YField" && this.otherFieldArr[i] != "") {
			colorfield.push(this.plotColorArr[i]);
		} else if (this.typeArr[i] == "XField" && this.otherFieldArr[i] != "") {
			colorfield.push(this.plotColorArr[i]);
		}
	}
	return colorfield;
};
ScatteredPlotChart.prototype.initializeSeriesValues = function () {
	var arr = [];

	for (var i = 0, outerLength = this.m_seriesData[0].length; i < outerLength; i++) {
		arr[i] = [];
		for (var j = 0, innerLength = this.m_seriesData.length; j < innerLength; j++) {
			arr[i][j] = this.m_seriesData[j][i];
		}
	}
	this.m_seriesData = arr;
};
ScatteredPlotChart.prototype.initializeCategoryValues = function () {
	var arr = [];
	for (var i = 0, outerLength = this.m_categoryData[0].length; i < outerLength; i++) {
		arr[i] = [];
		for (var j = 0, innerLength = this.m_categoryData.length; j < innerLength; j++) {
			arr[i][j] = this.m_categoryData[j][i];
		}
	}
	this.m_categoryData = arr;
};
function ScatterPlotChartCalculation() {
	this.m_xAxisMarkersArray = [];
	this.m_yAxisMarkersArray = [];
	this.m_xPixelArray = [];
	this.m_yPixelArray = [];
	this.radius = [];
	this.colors = [];
	this.m_xMax = 0;
	this.m_xRatio = 0;
	this.m_yRatio = 0;
	this.m_yMax = 0;
	this.m_yAxisText = 1;
	this.m_noOfXAxisMarkers = 5;
	this.m_noOfYAxisMarkers = 5;
	this.m_axisToChartMargin = 5;
};
ScatterPlotChartCalculation.prototype.init = function (plotchart, m_categoryData, m_seriesData) {
	this.m_chart = plotchart;

	this.m_calculation = this.m_chart.m_calculation;
	this.m_categoryData = m_categoryData;
	this.m_seriesData = m_seriesData;
	this.m_minradius = this.m_chart.m_minradius;
	this.m_maxradius = this.m_chart.m_maxradius;
	
	this.setHorizontalAxisFormaters();
	
	this.setCategoryMaxMin();
	this.setSeriesMaxMin();
	this.setCategoryMaxMinValue();
	this.setSeriesMaxMinValue();
	this.m_chart.setChartDrawingArea();

	this.startX = this.m_chart.getStartX();
	this.startY = this.m_chart.getStartY();
	this.endX = this.m_chart.getEndX();
	this.endY = this.m_chart.getEndY();
	
	this.setMaxValue();
	this.setPlotRadius();

	this.setXRatio();
	this.setYRatio();
	this.setXPixelArray();
	this.setYPixelArray();
};
ScatterPlotChartCalculation.prototype.setMaxValue = function () {
	this.m_maxValue = (this.m_xMax > this.m_yMax) ? (this.m_xMax) : (this.m_yMax);

};
ScatterPlotChartCalculation.prototype.getMaxValue = function () {
	return this.m_maxValue;
};
ScatterPlotChartCalculation.prototype.getSeriesRadiusField = function () {
	return this.m_chart.plotRadiusArr;
};
ScatterPlotChartCalculation.prototype.getPlotRadius = function () {
	return this.radius;
};
ScatterPlotChartCalculation.prototype.setPlotRadius = function () {
	var ratio = "";
	var radius1 = "";
	for (var i = 0; i < this.m_chart.plotRadiusArr.length; i++) {
		var arr = this.m_chart.getPlotRadiusData()[i];
		/**Added for comma separated data*/
		for(var j = 0; j < arr.length; j++){
			arr[j] = getNumericComparableValue(arr[j]);
		}
		this.radius[i] = [];
		var max = this.getMaxFromArray(arr);
		var min = this.getMinFromArray(arr);
		if (this.m_chart.plotRadiusArr[i] != parseInt(this.m_chart.plotRadiusArr[i], 10)) {
			for (var j = 0; j < arr.length; j++) {
				/** Array index should be taken as "j" not the "i" **/
				if (min >= 0 && arr[j] !== "" && arr[j] !== undefined && arr[j] !== null && arr[j] !== "Nil" && arr[j] !== "null") {
					var ratio = (max) / arr[j];
					var radius1 = ((this.m_maxradius - this.m_minradius)) / ratio;
					this.radius[i][j] = this.m_minradius * 1 + radius1 * 1;
                    ratio = (max) / arr[j];
                    radius1 = ((this.m_maxradius - this.m_minradius)) / ratio;
                    this.radius[i][j] = this.m_minradius * 1 + radius1 * 1;

                    if (this.radius[i][j] * 1 > this.m_maxradius * 1) {
                        this.radius[i][j] = this.m_maxradius;
                    }
                    /**Added for the negative value calculation*/
                } else if (min < 0 && arr[j] !== "" && arr[j] !== undefined && arr[j] !== null && arr[j] !== "Nil" && arr[j] !== "null") {
                    ratio = (this.m_maxradius - this.m_minradius) / (max * 1 - min * 1);
                    if (ratio == Infinity) {
                        radius1 = this.m_maxradius;
                    } else {
                        radius1 = this.m_minradius + (arr[j] * 1 - min * 1) * ratio;
                    }
                    this.radius[i][j] = this.m_minradius * 1 + radius1 * 1;
                    if (this.radius[i][j] * 1 > this.m_maxradius * 1) {
                        this.radius[i][j] = this.m_maxradius;
                    }

                } else {
                    this.radius[i][j] = 0;
                }
            }
        } else {
            for (var j = 0; j < arr.length; j++) {
                this.radius[i][j] = (arr[j] * 1 > this.m_maxradius * 1) ? this.m_maxradius : arr[j];
            }
        }
    }
};
/**Added for getting maximum value from array*/
ScatterPlotChartCalculation.prototype.getMaxFromArray = function (arr) {
	var max = 0;
	for (var i = 0, length = arr.length; i < length; i++) {
		if (arr[i] !== "" && arr[i] !== undefined && arr[i] !== null && arr[i] !== "Nil" && arr[i] !== "null")
			if (max * 1 <= arr[i] * 1)
				max = arr[i] * 1;
	}
	return max;
};
/**Added for getting minimum value from array*/
ScatterPlotChartCalculation.prototype.getMinFromArray = function (arr) {
	var min = 0;
	for (i = 0, length = arr.length; i < length; i++) {
		if (arr[i] !== "" && arr[i] !== undefined && arr[i] !== null && arr[i] !== "Nil" && arr[i] !== "null")
			if (min * 1 >= arr[i] * 1)
				min = arr[i] * 1;
	}
	return min;
};
ScatterPlotChartCalculation.prototype.getDefaultRadius = function (m_radiusField) {
	var radius = [];
	for (var i = 0, innerLength = m_radiusField.length; i < innerLength; i++) {
		for (var q = 0, outerLength = this.m_seriesData[0].length; q < outerLength; q++) {
			radius[i][q] = m_radiusField[i];
		}
	}
	return radius;
};
ScatterPlotChartCalculation.prototype.setCategoryMaxMinValue = function () {
	var niceScaleObj=this.m_chart.getCalculateNiceScale(this.getCategoryMinValue(),this.getCategoryMaxValue(),this.m_chart.m_horizontalaxisbasezero,this.m_chart.m_horizontalaxisautoadjust,this.m_chart.m_horizontalminimumaxisvalue,this.m_chart.m_horizontalmaximumaxisvalue,(this.m_chart.m_height));
	this.min=niceScaleObj.min;
	this.m_xMax=niceScaleObj.max;
	this.catMax=niceScaleObj.max;
	this.catMin=niceScaleObj.min;
	this.m_noOfXAxisMarkers=niceScaleObj.markerArray.length;
	this.m_xAxisActualMarkersArray = niceScaleObj.markerArray;
	this.setXAxisMarkersArray(niceScaleObj.markerArray,niceScaleObj.step);
};
ScatterPlotChartCalculation.prototype.getCategoryMaxValue = function () {
	return this.m_categoryMaxValue;
};
ScatterPlotChartCalculation.prototype.getCategoryMinValue = function () {
	return this.m_categoryMinValue;
};
ScatterPlotChartCalculation.prototype.setCategoryMaxMin = function() {
    var setMinMax = true;
    this.m_categoryMinValue = 0;
    this.m_categoryMaxValue = 0;
    if (this.m_categoryData.length > 0) {
        for (var i = 0, outerLength = this.m_categoryData.length; i < outerLength; i++) {
            for (var j = 0, innerLength = this.m_categoryData[i].length; j < innerLength; j++) {
                /**Added for comma separated data and to remove garbage data*/
                if (!isNaN(this.m_categoryData[i][j] * 1)) {
                    //           	if (i == 0 && j == 0) {
                    if (this.m_categoryData[i].length != 0 && IsBoolean(setMinMax)) {
                        this.m_categoryMinValue = this.m_categoryData[i][j];
                        this.m_categoryMaxValue = this.m_categoryData[i][j];
                        setMinMax = false;
                    }
                    if (this.m_categoryData[i][j] * 1 <= this.m_categoryMinValue * 1) {
                        this.m_categoryMinValue = this.m_categoryData[i][j] * 1;
                    }
                    if (this.m_categoryData[i][j] * 1 >= this.m_categoryMaxValue * 1) {
                        this.m_categoryMaxValue = this.m_categoryData[i][j] * 1;
                    }
                }
            }
        }
    }
};
ScatterPlotChartCalculation.prototype.calculateCategoryMinValue = function () {
	if (IsBoolean(this.m_chart.m_horizontalaxisautoadjust)) {
		if (IsBoolean(this.m_chart.m_horizontalaxisbasezero)) {
			this.min = 0;
		} else {
			this.min = this.getCategoryMinValue();
		}
	} else {
		if (IsBoolean(this.m_chart.m_horizontalaxisbasezero)) {
			this.min = 0;
		} else {
			if (this.m_chart.m_horizontalminimumaxisvalue == 0 || this.m_chart.m_horizontalminimumaxisvalue == "") {
				this.min = this.getCategoryMinValue();
			} else {
				this.min = this.m_chart.m_horizontalminimumaxisvalue;
			}
		}
	}

	if (this.min >= 0) {
		this.min = getMin(this.min);
	} else {
		if (Math.abs(this.min) > 1) {
			this.min =  - getMax(Math.abs(this.min))[0];
		} else if (this.calculateCatMax > 1) {
			this.min = Math.floor(this.min);
		}
	}
	return this.min;
};
ScatterPlotChartCalculation.prototype.getMinValue = function () {
	if (IsBoolean(this.m_chart.isAxisSetup())) {
		if (IsBoolean(this.m_chart.isBaseZero())) {
			this.min = 0;
		} else {
			this.min = this.getSeriesMinValue();
		}
	} else {
		if (IsBoolean(this.m_chart.isBaseZero())) {
			this.min = 0;
		} else {
			if (this.m_chart.m_minimumaxisvalue == 0 || this.m_chart.m_minimumaxisvalue == "") {
				this.min = this.getSeriesMinValue();
			} else {
				this.min = this.m_chart.m_minimumaxisvalue;
			}
		}
	}

	if (this.min >= 0) {
		this.min = getMin(this.min);
	} else {
		if (Math.abs(this.min) > 1) {
			this.min =  - getMax(Math.abs(this.min))[0];
		} else if (this.getSeriesMaxValue() > 1) {
			this.min = Math.floor(this.min);
		}
	}
	return this.min;
};
ScatterPlotChartCalculation.prototype.getSeriesMinValue = function () {
	return this.m_seriesMinValue;
};
ScatterPlotChartCalculation.prototype.getSeriesMaxValue = function () {
	return this.m_seriesMaxValue;
};
ScatterPlotChartCalculation.prototype.setSeriesMaxMin = function() {
    this.m_seriesMinValue = 0;
    this.m_seriesMaxValue = 0;
    if (this.m_seriesData.length > 0) {
        for (var i = 0, outerLength = this.m_seriesData.length; i < outerLength; i++) {
            for (var j = 0, innerLength = this.m_seriesData[i].length; j < innerLength; j++) {
        		/**Added for comma separated data and to remove garbage data*/
                if (!isNaN(this.m_seriesData[i][j] * 1)) {
                    if (i == 0 && j == 0) {
                        this.m_seriesMinValue = this.m_seriesData[i][j];
                        this.m_seriesMaxValue = this.m_seriesData[i][j];
                    }
                    if ((this.m_seriesData[i][j]) * 1 <= (this.m_seriesMinValue)) {
                        this.m_seriesMinValue = 1 * (this.m_seriesData[i][j]);
                    }
                    if ((this.m_seriesData[i][j]) * 1 >= (this.m_seriesMaxValue)) {
                        this.m_seriesMaxValue = 1 * (this.m_seriesData[i][j]);
                    }
                }
            }
        }
    }
};
ScatterPlotChartCalculation.prototype.setSeriesMaxMinValue = function () {
	var niceScaleObj=this.m_chart.getCalculateNiceScale(this.getMinValue(),this.getSeriesMaxValue(),this.m_chart.m_basezero,this.m_chart.m_autoaxissetup,this.m_chart.m_minimumaxisvalue,this.m_chart.m_maximumaxisvalue,(this.m_chart.m_height));
	this.min=niceScaleObj.min;
	this.m_xMax=niceScaleObj.max;
	this.serMax = niceScaleObj.max;
	this.serMin = niceScaleObj.min;
	this.m_noOfYAxisMarkers=niceScaleObj.markerArray.length;
 	this.m_yAxisText=niceScaleObj.step;
 	this.m_yAxisMarkersArray = niceScaleObj.markerArray;
};
ScatterPlotChartCalculation.prototype.setXAxisMarkersArray = function (markerArray, xAxisText) {
	this.m_xAxisMarkersArray = [];
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
	for (var i = 0; i < markerArray.length; i++) {
		this.m_xAxisMarkersArray[i] = plottedAxisMarkers[i];
	}
};
ScatterPlotChartCalculation.prototype.setHorizontalAxisFormaters = function () {
	this.m_isSecondAxisFormatter = false;
	this.m_secondAxisUnitSymbol = "";
	this.m_secondAxisFormatterPosition = "";
	if (this.m_chart.m_secondaryaxisformater != "none" || this.m_chart.m_secondaryaxisformater != "") {
		var secondAxisunit = this.m_chart.m_secondaryaxisunit;
		var secondAxisFormatter = this.m_chart.m_secondaryaxisformater;
		if (secondAxisunit != "none" && secondAxisunit != "") {
			this.m_isSecondAxisFormatter = true;
			this.m_secondAxisUnitSymbol = this.m_chart.m_util.getFormatterSymbol(secondAxisFormatter, secondAxisunit);
			this.m_secondAxisFormatterPosition = this.m_chart.m_secondaryaxissignposition;
		}
	}

	this.m_isSecondAxisSecondaryFormatter = false;
	this.m_secondAxisSecondaryUnitSymbol = "";
	this.m_secondAxisSecondaryFormatterPosition = "";
	if (this.m_chart.m_secondaryaxissecondaryformatter != "none" || this.m_chart.m_secondaryaxissecondaryformatter != "") {
		var secondAxisSecondaryUnit = this.m_chart.m_secondaryaxissecondaryunit;
		var secondAxisSecondaryFormatter = this.m_chart.m_secondaryaxissecondaryformatter;
		if (secondAxisSecondaryUnit != "none" && secondAxisSecondaryUnit != "") {
			this.m_isSecondAxisSecondaryFormatter = true;
			this.m_secondAxisSecondaryUnitSymbol = this.m_chart.m_util.getFormatterSymbol(secondAxisSecondaryFormatter, secondAxisSecondaryUnit);
			this.m_secondAxisSecondaryFormatterPosition = "suffix";
		}
	}
	
	this.m_secondaryAxisPrecision = this.m_chart.m_secondaryaxisprecision;
};
ScatterPlotChartCalculation.prototype.getSecondaryAxisFormattedText = function (text, prec) {
	var prec = (prec !== undefined) ? prec : this.m_secondaryAxisPrecision;
	if (text % 1 != 0 && prec < 1) {
		text = this.setPrecision(text, 1);
	} else if (!IsBoolean(this.m_isSecondAxisFormatter) && !IsBoolean(this.m_isSecondAxisSecondaryFormatter)) {
		if(prec !== "default")
		text = this.setPrecision(text, prec);
	}
	if ((this.m_chart.m_secondaryaxisformater == "none" || this.m_chart.m_secondaryaxisformater == "") && (this.m_chart.m_secondaryaxissecondaryformatter == "none" || this.m_chart.m_secondaryaxissecondaryformatter == "")) {
		text = this.setPrecision(text, prec);
	}
	if (IsBoolean(this.m_isSecondAxisFormatter)) {
		text = this.m_chart.m_util.updateTextWithFormatter(text, this.m_secondAxisUnitSymbol, prec);
	}
	if (IsBoolean(this.m_isSecondAxisSecondaryFormatter) && this.m_chart.m_secondaryaxissecondaryformatter == "Number") {
		text = this.m_chart.m_util.updateTextWithFormatter(text, this.m_secondAxisSecondaryUnitSymbol, prec);
	}
	if (IsBoolean(this.m_isSecondAxisSecondaryFormatter)) {
		if (this.m_secondAxisSecondaryUnitSymbol != "auto"){
			if (prec != 0 && prec != null){
				text = this.setPrecision(text, prec);
			}else if (text < 1 && text % 1 != 0){
				text = this.setPrecision(text, 2);
			}
			text = (text%1 === 0 && this.m_secondaryAxisPrecision === "default") ? (text*1) : text;
			text = this.addSecondAxisSecondaryFormater(text, this.m_secondAxisSecondaryUnitSymbol);
		} else {
			var symbol = getNumberFormattedSymbol(text * 1, this.m_chart.m_secondaryaxisunit);
			var val = getNumberFormattedNumericValue(text * 1, prec, this.m_chart.m_secondaryaxisunit);
			text = this.setPrecision(val, prec);
			if (prec != 0 && prec != null){
				text = this.setPrecision(text, prec);
			}else if (text < 1 && text % 1 != 0){
				text = this.setPrecision(text, 2);
			}
			text = (text%1 === 0 && this.m_secondaryAxisPrecision === "default") ? (text*1) : text;
			text = this.addSecondAxisSecondaryFormater(text, symbol);
		}
	}
	text = getFormattedNumberWithCommas(text, this.m_chart.m_secondaryaxisnumberformatter);
	if (IsBoolean(this.m_isSecondAxisFormatter) && this.m_secondAxisUnitSymbol != undefined) {
		text = this.m_chart.m_util.addFormatter(text, this.m_secondAxisUnitSymbol, this.m_secondAxisFormatterPosition, prec);
	}
	return text;
};
ScatterPlotChartCalculation.prototype.setPrecision = function (text, precision) {
	if(text !== 0){
		if (precision !== "default") {
	        return (text * 1).toFixed(precision);
	    } else {
	        return (text * 1);
	    }
	}else{
	   return (text * 1);
	}
};
ScatterPlotChartCalculation.prototype.addSecondAxisSecondaryFormater = function (text, secondAxisSecondaryUnitSymbol) {
	var textValue = text;
	try {
		eval("var formattedText = this.m_chart.m_util.addUnitAs" + this.m_secondAxisSecondaryFormatterPosition + "(textValue,secondAxisSecondaryUnitSymbol);");
	} catch (e) {
		return formattedText.toString();
	}
	return formattedText.toString();
};
ScatterPlotChartCalculation.prototype.getSecondaryFormaterAddedText = function (textValue, secondaryUnitSymbol) {
	var formattedText = textValue;
	try {
		eval("var formattedText = this.m_chart.m_util.addUnitAs" + this.m_secondAxisSecondaryFormatterPosition + "(textValue,secondaryUnitSymbol);");
	} catch (e) {
		return formattedText;
	}
	return formattedText;
};
ScatterPlotChartCalculation.prototype.isInt = function (n) {
	return typeof n === "number" && n % 1 == 0;
};

ScatterPlotChartCalculation.prototype.getXAxisMarkersArray = function () {
	return this.m_xAxisMarkersArray;
};
ScatterPlotChartCalculation.prototype.getYAxisMarkersArray = function () {
	return this.m_yAxisMarkersArray;
};
ScatterPlotChartCalculation.prototype.setXRatio = function () {
	var totalWidth = this.endX * 1 - this.startX * 1;
	this.m_xRatio = totalWidth * 1 / (this.catMax * 1 - this.catMin * 1);;
};
ScatterPlotChartCalculation.prototype.setYRatio = function () {
	this.m_yRatio = (this.startY - this.endY) / (this.serMax - this.serMin);
};
ScatterPlotChartCalculation.prototype.setXPixelArray = function () {
	this.m_xPixelArray = [];
	for (var i = 0, outerLength = this.m_categoryData.length; i < outerLength; i++) {
		this.m_xPixelArray[i] = [];
		for (var j = 0, innerLength = this.m_categoryData[i].length; j < innerLength; j++) {
			if (this.m_categoryData[i][j] === "" || this.m_categoryData[i][j] === undefined || this.m_categoryData[i][j] === null || this.m_categoryData[i][j] === "Nil" || this.m_categoryData[i][j] === "null")
				this.m_xPixelArray[i][j] = null;
			else
				this.m_xPixelArray[i][j] = this.startX * 1 + (this.m_categoryData[i][j] * 1 - this.catMin * 1) * this.m_xRatio * 1 ;
		}
	}
};
ScatterPlotChartCalculation.prototype.getXPixcelForEachCategory = function () {
	var xPixcel;
	xPixcel = (this.endX - this.startX) / (this.m_noOfXAxisMarkers * 1 - 1);
	return xPixcel;
};
ScatterPlotChartCalculation.prototype.getXPixelArray = function () {
	return this.m_xPixelArray;
};
ScatterPlotChartCalculation.prototype.setYPixelArray = function () {
	this.m_yPixelArray = [];
	for (var i = 0, outerLength = this.m_seriesData.length; i < outerLength; i++) {
		this.m_yPixelArray[i] = [];
		for (var j = 0, innerLength = this.m_seriesData[i].length; j < innerLength; j++) {
			if (this.m_seriesData[i][j] === "" || this.m_seriesData[i][j] === undefined || this.m_seriesData[i][j] === null || this.m_seriesData[i][j] === "Nil" || this.m_seriesData[i][j] === "null")
				this.m_yPixelArray[i][j] = null;
			else
				this.m_yPixelArray[i][j] = this.startY * 1 - (this.m_seriesData[i][j] - this.serMin) * this.m_yRatio;
		}
	}
};
ScatterPlotChartCalculation.prototype.getYPixelArray = function () {
	return this.m_yPixelArray;
};
ScatterPlotChartCalculation.prototype.getYAxisText = function () {
	return 0;
};
/** @description Data Label for ScatteredPlotChart Initialization**/
ScatteredPlotChart.prototype.initializeDataLabel = function() {
    this.m_valueTextSeries = {};
    var XPixelArray = [];
    var YPixelArray = [];
    XPixelArray = this.m_calculation.getXPixelArray();
    YPixelArray = this.m_calculation.getYPixelArray();
    for (var k = 0, i1 = 0; i1 < this.m_seriesNames.length; i1++) {
        if (IsBoolean(this.m_seriesDataLabelProperty[i1].showDataLabel)) {
            this.setSeriesDataLabel();
            this.m_valueTextSeries[this.m_seriesNames[i1]] = new ValueTextSeries();
            this.m_valueTextSeries[this.m_seriesNames[i1]].init(XPixelArray[k], YPixelArray[k], this, this.m_seriesDataForDataLabel[i1], this.m_seriesDataLabelProperty[i1], this.m_seriesData[i1]);
        };
        k++;
    }
};
/** @description set Data Label for Series  of the ScatteredPlotChart. **/
ScatteredPlotChart.prototype.setSeriesDataLabel = function() {
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

function ShapeSeries() {
	this.color = [];
	this.xPositionArray = [];
	this.yPositionArray = [];

	this.common = [];
	this.shape;
	this.plotradius = [];
	this.m_chart;
	this.linewidth;
};
ShapeSeries.prototype.init = function (color, xPositionArray, yPositionArray, shape, plotradius,transparency, chart, LineWidth) {
	this.color = color;

	this.xPositionArray = xPositionArray;
	this.yPositionArray = yPositionArray;
	this.shape = shape;
	this.plotradius = plotradius;
	this.m_transparency = transparency;
	this.m_chart = chart;
	this.linewidth = LineWidth;
	this.m_startX = this.m_chart.m_startX;
	this.m_startY = this.m_chart.m_startY;
	this.m_endX = this.m_chart.m_endX;
	this.m_endY = this.m_chart.m_endY;

	this.lastValidX = this.m_chart.m_startX;
	this.lastValidY = this.m_chart.m_startY;

	for (var i = 0, length = this.xPositionArray.length; i < length; i++) {
		if (this.xPositionArray[i] != null) {
			this.common[i] = new Shape();
			if (this.shape != "line")
				this.common[i].init(this.color[i], this.xPositionArray[i], this.yPositionArray[i], this.shape, this.plotradius[i],this.m_transparency[i], this.m_chart, 0, 0);
			else
				this.common[i].init(this.color[i], this.xPositionArray[i], this.yPositionArray[i], this.shape, this.plotradius[i],this.m_transparency[i], this.m_chart, this.getNextDataPoint(i).x, this.getNextDataPoint(i).y, this.linewidth);
		}
	}
};
ShapeSeries.prototype.getNextDataPoint = function (index) {
	if (index > 0) {
		var nextX = this.xPositionArray[index - 1];
		var nextY = this.yPositionArray[index - 1];
		if ((nextX != undefined && nextX !== null && nextX !== "") && !isNaN(nextX) && (nextY != undefined && nextY !== null && nextY !== "") && !isNaN(nextY)) {
			this.lastValidX = nextX;
			this.lastValidY = nextY;
			return {
				"x" : nextX,
				"y" : nextY
			};
		} else {
			return {
				"x" : this.lastValidX,
				"y" : this.lastValidY
			};
		}
	} else {
		return {
			"x" : this.xPositionArray[index],
			"y" : this.yPositionArray[index]
		};
	}
};
ShapeSeries.prototype.drawShapeSeries = function (catIndex) {
	if (this.shape == "line" && this.m_chart.m_lineform == "curve"){
		try{
			var pts = [];
			var count = 0;
			pts[count] = [];
			for(var i = 0, length = this.xPositionArray.length; i < length; i++){
				if(this.xPositionArray[i] != null && this.xPositionArray[i] != "" && this.yPositionArray[i] != null && this.yPositionArray[i] != "" && this.yPositionArray[i]<=this.m_chart.getStartY() && this.yPositionArray[i]>=this.m_chart.getEndY()){
					pts[count].push(this.xPositionArray[i]);
					pts[count].push(this.yPositionArray[i]);
				} else {
					count++;
					pts[count] = [];
				}
			}
			for(var j = 0; j <= count; j++){
				if(pts[j].length > 0){
					this.m_chart.ctx.beginPath();
					this.m_chart.ctx.save();
					this.m_chart.ctx.lineWidth = 1;
					this.m_chart.ctx.strokeStyle = hex2rgb(this.color[j],this.m_transparency);
					this.m_chart.ctx.moveTo(pts[j][0], pts[j][1]);
					this.m_chart.ctx.curve(pts[j], 0.5, 25, this);
					this.m_chart.ctx.stroke();
					this.m_chart.ctx.restore();
					this.m_chart.ctx.closePath();
				}
			}
		}catch(e){
			console.log("Error in drawing of curve type line! ")
		}
	}
	/** do the point draw operation as it is for all type **/
	for (var i = 0, length1 = this.xPositionArray.length; i < length1; i++) {
		if (this.isInRange(i)) {
			this.common[i].draw(i,catIndex);
		}
	}
};
ShapeSeries.prototype.isInRange = function (i) {
	if ((this.xPositionArray[i] >= this.m_startX && this.xPositionArray[i] <= this.m_endX) && ((this.yPositionArray[i] * 1 ) <= this.m_startY && (this.yPositionArray[i] * 1 ) >= this.m_endY))
		return true;
	else
		return false;
};

function Shape() {
	this.color;
	this.xPosition;
	this.yPosition;
	this.s;
	this.plotradius = 3;
	this.ctx = "";
	this.linewidth;
};
Shape.prototype.init = function (color, xPosition, yPosition, shape, plotradius,m_transparency, m_chart, nextX, nextY, linewidth) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.color = color;
	this.xPosition = xPosition;
	this.yPosition = yPosition;
	this.s = shape;
	this.plotradius = plotradius;
	this.transparency = m_transparency;
	this.nextX = nextX;
	this.nextY = nextY;
	this.linewidth = linewidth;
};
Shape.prototype.draw = function (i,j) {
	if (this.xPosition != null) {
		switch (this.s) {
		case "cube":
			this.drawCube(j);
			break;
		case "cross":
			this.drawCross(i,j);
			break;
		case "quad":
			this.drawQuad(j);
			break;
		case "triangle":
			this.drawTriangle(i,j);
			break;
		case "point":
			this.drawPoint(i,j);
			break;
		case "polygon":
			this.drawPolygon(i,j);
			break;
		case "star":
			this.drawStar(i,j);
			break;
		case "line":
			this.drawLine(i,j);
			this.drawPoint(i,j);
			break;
		case "plus":
			this.drawPlus(i,j);
			break;
		case "default":
			this.drawPoint(i,j);
			break;
		}
	}
};
Shape.prototype.drawCube = function (categoryIndex) {
	var temp = this;
	var newRect = document.createElementNS(NS, "rect");
	newRect.setAttributeNS(null, "x", this.xPosition - this.plotradius);
	newRect.setAttributeNS(null, "y", this.yPosition - this.plotradius);
	newRect.setAttributeNS(null, "height", 2 * this.plotradius);
	newRect.setAttributeNS(null, "width", 2 * this.plotradius);
	newRect.setAttributeNS(null, "stroke", hex2rgb(this.color, this.transparency));
	newRect.setAttributeNS(null, "fill", hex2rgb(this.color, this.transparency));
	/**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if (IsBoolean(this.m_chart.m_enableanimation) && (this.m_chart.m_bubbleanimationduration > 0) && !isIE) {
		var Animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        Animate.setAttribute("attributeName", "width");
        Animate.setAttribute("from", "1");
        Animate.setAttribute("to", this.plotradius*2);
        Animate.setAttribute("dur", temp.m_chart.m_bubbleanimationduration + "s");
        $(newRect).append(Animate);
        $(newRect).attr("class", "pointShapeAnimation");
        var radius = this.plotradius;
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
	
	$("#cubegrp"+categoryIndex+temp.m_chart.m_objectid).append(newRect);
};
Shape.prototype.drawCross = function (seriesIndex , categoryIndex) {
	var temp = this;
	var FillColor = hex2rgb(this.color, this.transparency);
    var colorArr = [FillColor, "transparent"];
	var d = "M" + (this.xPosition * 1 - this.plotradius * 1) + " " + (this.yPosition * 1 - this.plotradius * 1) +
		" L" + (this.xPosition * 1 + this.plotradius * 1) + " " + (this.yPosition * 1 + this.plotradius * 1) +
		" M" + (this.xPosition * 1 + this.plotradius * 1) + " " + (this.yPosition * 1 - this.plotradius * 1) +
		" L" + (this.xPosition * 1 - this.plotradius * 1) + " " + (this.yPosition * 1 + this.plotradius * 1);
	var newLine = document.createElementNS(NS, "path");
	newLine.setAttribute("d", d);
	newLine.setAttributeNS(null, "stroke-width", 3);
	/**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if (IsBoolean(this.m_chart.m_enableanimation) && (this.m_chart.m_bubbleanimationduration > 0) && !isIE) {
        var content = document.createElementNS(NS, "linearGradient");
        content.setAttribute("id", "LinearGradient" + temp.m_chart.m_objectid + seriesIndex + categoryIndex);
        for (var i = 0; i < 2; i++) {
            var stop = document.createElementNS(NS, "stop");
            stop.setAttribute("offset", "0");
            stop.setAttribute("stop-color", colorArr[i]);
            var Animate = drawSVGStackAnimation(0, "offset", this.plotradius, temp.m_chart.m_bubbleanimationduration * 10);
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
	
    $("#crossgrp"+categoryIndex+temp.m_chart.m_objectid).append(newLine);
};
Shape.prototype.drawPlus = function (seriesIndex , categoryIndex) {
	var temp = this;
	var FillColor = hex2rgb(this.color, this.transparency);
    var colorArr = [FillColor, "transparent"];
	var d = "M" + (this.xPosition * 1 - this.plotradius * 1) + " " + (this.yPosition * 1) +
		" L" + (this.xPosition * 1 + this.plotradius * 1) + " " + (this.yPosition * 1) +
		" M" + (this.xPosition * 1) + " " + (this.yPosition * 1 - this.plotradius * 1) +
		" L" + (this.xPosition * 1) + " " + (this.yPosition * 1 + this.plotradius * 1);
	var newLine = document.createElementNS(NS, "path");
	newLine.setAttribute("d", d);
	newLine.setAttributeNS(null, "stroke-width", 3);
	/**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if (IsBoolean(this.m_chart.m_enableanimation) && (this.m_chart.m_bubbleanimationduration > 0) && !isIE) {
        var content = document.createElementNS(NS, "linearGradient");
        content.setAttribute("id", "LinearGradient" + temp.m_chart.m_objectid + seriesIndex + categoryIndex);
        for (var i = 0; i < 2; i++) {
            var stop = document.createElementNS(NS, "stop");
            stop.setAttribute("offset", "0");
            stop.setAttribute("stop-color", colorArr[i]);
            var Animate = drawSVGStackAnimation(0, "offset", this.plotradius, temp.m_chart.m_bubbleanimationduration * 10);
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
	
	$("#plusgrp"+categoryIndex+ temp.m_chart.m_objectid).append(newLine);
};
Shape.prototype.drawQuad = function (categoryIndex) {
	var temp = this;
	var angle = 45;
	this.ctx.lineTo(this.xPosition * 1, this.yPosition * 1 - this.plotradius * 1);

	var newRect = document.createElementNS(NS, "rect");
	newRect.setAttributeNS(null, "x", this.xPosition - this.plotradius);
	newRect.setAttributeNS(null, "y", this.yPosition - this.plotradius);
	newRect.setAttributeNS(null, "height", 2 * this.plotradius);
	newRect.setAttributeNS(null, "width", 2 * this.plotradius);
	newRect.setAttribute("transform", "rotate(" + angle + " " + this.xPosition + "," + this.yPosition + ")");
	newRect.setAttributeNS(null, "stroke", hex2rgb(this.color, this.transparency));
	newRect.setAttributeNS(null, "fill", hex2rgb(this.color, this.transparency));
	/**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if (IsBoolean(this.m_chart.m_enableanimation) && (this.m_chart.m_bubbleanimationduration > 0) && !isIE) {
		var Animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        Animate.setAttribute("attributeName", "height");
        Animate.setAttribute("from", "1");
        Animate.setAttribute("to", this.radius*2);
        Animate.setAttribute("dur", temp.m_chart.m_bubbleanimationduration + "s");
        $(newRect).append(Animate);
        $(newRect).attr("class", "pointShapeAnimation");
        var radius = this.plotradius;
        newRect.addEventListener("mouseover", function (evt) {
        	newRect.setAttributeNS(null, "height", (2*radius + temp.m_chart.m_hovershape));
        	newRect.setAttributeNS(null, "width", (2*radius + temp.m_chart.m_hovershape));
        	newRect.setAttributeNS(null, "opacity", 0.8);
		});
        newRect.addEventListener("mouseout", function () {
        	newRect.setAttributeNS(null, "height", 2*radius);
        	newRect.setAttributeNS(null, "width", 2*radius);
        	newRect.setAttributeNS(null, "opacity", temp.transparency);
		});
    }
	
	$("#quadgrp"+categoryIndex+temp.m_chart.m_objectid).append(newRect);
};
Shape.prototype.drawTriangle = function (seriesIndex , categoryIndex) {
	var temp = this;
    var FillColor = hex2rgb(this.color, this.transparency);
    var colorArr = [FillColor, "transparent"];
    var d = "M" + (this.xPosition * 1) + " " + (this.yPosition * 1 - this.plotradius * 1) +
        " L" + (this.xPosition * 1 + this.plotradius * 1) + " " + (this.yPosition * 1 + this.plotradius * 1) +
        " L" + (this.xPosition * 1 - this.plotradius * 1) + " " + (this.yPosition * 1 + this.plotradius * 1) +
        " L" + (this.xPosition * 1) + " " + (this.yPosition * 1 - this.plotradius * 1);
    var newLine = document.createElementNS(NS, "path");
    newLine.setAttribute("d", d);
    /**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if (IsBoolean(this.m_chart.m_enableanimation) && (this.m_chart.m_bubbleanimationduration > 0) && !isIE) {
        var content = document.createElementNS(NS, "linearGradient");
        content.setAttribute("id", "LinearGradient" + temp.m_chart.m_objectid + seriesIndex + categoryIndex);
        for (var i = 0; i < 2; i++) {
            var stop = document.createElementNS(NS, "stop");
            stop.setAttribute("offset", "0");
            stop.setAttribute("stop-color", colorArr[i]);
            var Animate = drawSVGStackAnimation(0, "offset", this.plotradius, temp.m_chart.m_bubbleanimationduration * 10);
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
    $("#trianglegrp"+categoryIndex+temp.m_chart.m_objectid).append(newLine);
};
Shape.prototype.drawPoint = function (seriesIndex , categoryIndex) {
	var temp = this;
	var luminanceColor = this.getColorValue();
	/**Internet Explorer does not support svg animation.*/
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if (this.m_chart.m_chartbase == undefined || this.m_chart.m_chartbase == "plane"){
		//this.fillStyle = hex2rgb(this.color, this.transparency);
		var arc = drawSVGCircle(this.xPosition, this.yPosition, this.plotradius, this.getColorValue(), hex2rgb(this.color, this.transparency));
		if (IsBoolean(this.m_chart.m_enableanimation) && (this.m_chart.m_bubbleanimationduration > 0) && !isIE) {
	    	var Animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
	        Animate.setAttribute("attributeName", "r");
	        Animate.setAttribute("from", "1");
	        Animate.setAttribute("to", this.plotradius);
	        Animate.setAttribute("dur", temp.m_chart.m_bubbleanimationduration + "s");
	       // Animate.setAttribute("repeatCount", "indefinite"); For infite repeat.
	        $(arc).append(Animate);
	        $(arc).attr("class", "pointShapeAnimation");
	        arc.addEventListener("mouseover", function (evt) {
	        	arc.setAttributeNS(null, "r", temp.plotradius*1 + temp.m_chart.m_hovershape);
			});
	        arc.addEventListener("mouseout", function () {
	        	arc.setAttributeNS(null, "r", temp.plotradius*1);
			});
	    }
		$("#bubblegrp"+categoryIndex+this.m_chart.m_objectid).append(arc);
	} else {
		try {
		    var FillColor = hex2rgb(this.color, this.transparency);
		    var luminanceColor = ColorLuminance(this.color, this.m_chart.m_luminance);
		    luminanceColor = hex2rgb(luminanceColor, this.transparency);
		    var colorArr = [luminanceColor, FillColor];
		    var perArr = ["10%", "80%"];
		    var svgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
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
		    svgCircle.setAttributeNS(null, "r", this.plotradius);
		    svgCircle.setAttributeNS(null, "stroke", hex2rgb(this.color, this.transparency));
		    FillColor = "url(#radialGradient" + temp.m_chart.m_objectid + seriesIndex + categoryIndex + ")";
		    svgCircle.setAttributeNS(null, "fill", FillColor);
		    
		    if (IsBoolean(this.m_chart.m_enableanimation) && (this.m_chart.m_bubbleanimationduration > 0) && !isIE) {
		    	var Animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
		        Animate.setAttribute("attributeName", "r");
		        Animate.setAttribute("from", "1");
		        Animate.setAttribute("to", this.plotradius);
		        Animate.setAttribute("dur", temp.m_chart.m_bubbleanimationduration + "s");
		       // Animate.setAttribute("repeatCount", "indefinite"); For infite repeat.
		        $(svgCircle).append(Animate);
		        $(svgCircle).attr("class", "pointShapeAnimation");
		        svgCircle.addEventListener("mouseover", function (evt) {
		        	svgCircle.setAttributeNS(null, "r", temp.plotradius*1 + temp.m_chart.m_hovershape);
				});
		        svgCircle.addEventListener("mouseout", function () {
		        	svgCircle.setAttributeNS(null, "r", temp.plotradius*1);
				});
		    }
		    
		    $("#defsElement" + temp.m_chart.m_objectid).append(content);
		    $("#bubblegrp"+categoryIndex+temp.m_chart.m_objectid).append(svgCircle);
		    $(svgCircle).attr("id", "scatterplot"+temp.m_chart.m_objectid+ categoryIndex + seriesIndex);
			
		    svgCircle.addEventListener("click", function(evt) {
	        	var id = this.id;
	        	var serIndex= seriesIndex,//id.slice((id.length-2),(id.length-1)),
	        	catIndex = categoryIndex;//id.slice((id.length-1),(id.length));
	        	for(var i=0;i<temp.m_chart.m_seriesData.length; i++){
					//var seriesName = temp.m_chart.m_allSeriesNames[i];
	        		for(var j=0;j<temp.m_chart.m_categoryData[0].length; j++){
	        			if(IsBoolean(temp.m_chart.enableDrillHighlighter)){
	        			//var clickid = "topRoundedStack" + temp.m_chart.svgContainerId + i + j;
						//if(temp.m_chart.m_columnSeries[seriesName] !== undefined){
	        				var clickid = "scatterplot" + temp.m_chart.m_objectid + i + j;
	        		//	}else{
	        				//var clickid = "bubblegrp" + ttemp.m_chart.m_objectid + i + j;
	        		//	}
	        			if(serIndex == j){
	        			$("#"+clickid).css("opacity","1");
	        			}/* else if(($("#"+clickid).css("opacity") == "1") && IsBoolean( temp.m_chart.m_drilltoggle)) {
	        				$("#"+clickid).css("opacity","0.5");//$("#"+clickid).css("opacity","0.5");
	        			}*/else {
	        				$("#"+clickid).css("opacity","0.5");
	        			}
	        		  }
	        		}
	        	}
	        	
	        });
		} catch (e) {
			console.log(e);
		}
	}
};

Shape.prototype.drawPolygon = function (seriesIndex,categoryIndex) {
	var temp = this;
	var x = this.xPosition;
	var y = this.yPosition;
	var radius = this.plotradius;
	var sides = 6;
	var FillColor = hex2rgb(this.color, this.transparency);
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
	if (IsBoolean(this.m_chart.m_enableanimation) && (this.m_chart.m_bubbleanimationduration > 0) && !isIE) {
        var content = document.createElementNS(NS, "linearGradient");
        content.setAttribute("id", "LinearGradient" + temp.m_chart.m_objectid + seriesIndex + categoryIndex);
        for (var i = 0; i < 2; i++) {
            var stop = document.createElementNS(NS, "stop");
            stop.setAttribute("offset", "0");
            stop.setAttribute("stop-color", colorArr[i]);
            var Animate = drawSVGStackAnimation(0, "offset", radius, temp.m_chart.m_bubbleanimationduration * 10);
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
	
	$("#polygongrp"+categoryIndex+temp.m_chart.m_objectid).append(newLine);
};
Shape.prototype.drawStar = function (seriesIndex , categoryIndex) {
	var temp = this;
	var cx = this.xPosition;
	var cy = this.yPosition;
	var r1 = this.plotradius;
	var r0 = this.plotradius / 2;
	var spikes = 5;

	var rot = Math.PI / 2 * 3;
	var x = cx;
	var y = cy;
	var step = Math.PI / spikes;
	var FillColor = hex2rgb(this.color, this.transparency);
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
	if (IsBoolean(this.m_chart.m_enableanimation) && (this.m_chart.m_bubbleanimationduration > 0) && !isIE) {
        var content = document.createElementNS(NS, "linearGradient");
        content.setAttribute("id", "LinearGradient" + temp.m_chart.m_objectid + seriesIndex + categoryIndex);
        for (var i = 0; i < 2; i++) {
            var stop = document.createElementNS(NS, "stop");
            stop.setAttribute("offset", "0");
            stop.setAttribute("stop-color", colorArr[i]);
            var Animate = drawSVGStackAnimation(0, "offset", this.plotradius, temp.m_chart.m_bubbleanimationduration * 10);
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
	$("#stargrp"+categoryIndex+temp.m_chart.m_objectid).append(newLine);
};
Shape.prototype.drawLine = function (i,j) {
	if (i==0) {
		/*computes control points p1 and p2 for x and y direction*/
		var temp = this;
		/*DAS-404 @desc zoom n drag */
		var px = this.computeControlPoints(this.m_chart.m_shapeSeries[j].xPositionArray);
		var py = this.computeControlPoints(this.m_chart.m_shapeSeries[j].yPositionArray);
		var id = temp.m_chart.svgContainerId;
		this.clipFillArea();
		
		/*updates path settings, the browser will draw the new spline*/
		var attributeD = "";
		var xposArrLength=px.p1.length;
		for (var i = 0; i < xposArrLength; i++) {
			/*DAS-404 @desc replaced this.m_chart.m_shapeSeries[0] with this.m_chart.m_shapeSeries[j] */
			if (this.m_chart.m_shapeSeries[j].yPositionArray[i] <= temp.m_chart.getStartY() && this.m_chart.m_shapeSeries[j].yPositionArray[i] >= temp.m_chart.getEndY()&& this.m_chart.m_shapeSeries[j].yPositionArray[i+1] <= temp.m_chart.getStartY() && this.m_chart.m_shapeSeries[j].yPositionArray[i+1] >= temp.m_chart.getEndY()) {
				var path = this.createBezierPath(this.m_chart.m_shapeSeries[j].xPositionArray[i], this.m_chart.m_shapeSeries[j].yPositionArray[i], px.p1[i], py.p1[i], px.p2[i], py.p2[i], this.m_chart.m_shapeSeries[j].xPositionArray[i + 1], this.m_chart.m_shapeSeries[j].yPositionArray[i + 1]);
				if (path != undefined)
					attributeD += path;
			}
		}
		if (attributeD != undefined) {
			var strokeDashArray = this.getLineDashArray("straight", this.linewidth);
			var path = this.createPath(this.color, this.linewidth, strokeDashArray);
			path.setAttributeNS(null, "d", attributeD);
			$("#" + id).append(path);
			// Internet Explorer not support svg animation
		    var isIE = /*@cc_on!@*/false || !!document.documentMode;
			if (IsBoolean(this.m_chart.m_enableanimation) && !isIE) {
				this.setLineAnimation(path);
			}
		}
	}
};
Shape.prototype.setLineAnimation = function(path) {
	if (this.m_chart.m_bubbleanimationduration > 0) {
		path.style.strokeDashoffset = '0';
	    var length = path.getTotalLength();
	    var duration = this.m_chart.m_bubbleanimationduration;
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
/** @description will clip fillArea path which is drawing out of chart drawing area. **/
Shape.prototype.clipFillArea = function () {
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
/** @description creates formated path string for SVG cubic path element  **/
Shape.prototype.createBezierPath = function (x1, y1, px1, py1, px2, py2, x2, y2) {
	if (x1 !== "" && y1 !== "" && px1 !== "" && py1 !== "" && px2 !== "" && py2 !== "" && x2 !== "" && y2 !== "")
		return "M " + x1 + " " + y1 + " C " + px1 + " " + py1 + " " + px2 + " " + py2 + " " + x2 + " " + y2;
	else
		return;
};
/** @description computes control points given knots K, this is the brain of the operation  **/
Shape.prototype.computeControlPoints = function (K) {
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
Shape.prototype.createPath = function (color, width,strokeDashArray) {
	width = (typeof width == "undefined" ? "3" : width);
	var P = document.createElementNS("http://www.w3.org/2000/svg", "path");
	P.setAttributeNS(null, "fill", "none");
	P.setAttribute("stroke-dasharray", strokeDashArray);
	P.setAttributeNS(null, "stroke", color);
	P.setAttributeNS(null, "stroke-width", width);
	return P;
};
Shape.prototype.getLineDashArray = function(lineType, lineWidth) {
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
Shape.prototype.getColorValue = function () {
	this.color = (this.color == undefined) ? "#993366" : this.color;
	var luminanceColor = ColorLuminance(this.color, this.m_chart.m_luminance);
	//	creating issue with color like #ff0000  BUG#12968
	//	luminanceColor = (this.color == luminanceColor) ? hex2rgb(this.color,0.5) : luminanceColor ;
	return luminanceColor;
};

/** @description PlotXAxis class creation and property initialization**/
function PlotXAxis() {
	this.base = Xaxis;
	this.base();
	this.m_textUtil = new TextUtil();
	this.m_util = new Util();
	this.ctx = "";
};

/** @description inheriting XAxis property into PlotXAxis**/
PlotXAxis.prototype = new Xaxis;

PlotXAxis.prototype.init = function(m_chart) {
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

PlotXAxis.prototype.drawTickMarksForScatterPlotChart = function() {
	if (IsBoolean(this.m_tickmarks)) {
		var tickMarkerHeight = 8;
		var msfx = 1;
		/** msfx = margin space from x - axis 1 px **/
		for (var i = 0; i < this.m_xAxisData.length; i++) {
			var lineWidth = 0.5;
			var antiAliasing = 0.5;
			var strokeColor = this.m_categorymarkingcolor;
			var x1 = this.m_startX * 1 + ((this.m_endX - this.m_startX) / (this.m_xAxisData.length - 1)) * (i * 1);
			var y1 = this.m_startY * 1 + msfx * 1;
			var x2 = this.m_startX * 1 + ((this.m_endX - this.m_startX) / (this.m_xAxisData.length - 1)) * (i * 1);
			var y2 = this.m_startY * 1 + tickMarkerHeight * 1;
			var newLine = drawSVGLine(x1, y1, x2, y2, lineWidth, strokeColor);
			$("#xaxistickgrp" + this.m_chart.m_objectId).append(newLine);
		}
	}
};

PlotXAxis.prototype.drawVerticalLineForScatterPlotChart = function() {
	var temp = this;
	var markerArray = this.m_xAxisActualMarkersArray;
	var xAxisDiv = (this.m_endX - this.m_startX) / (markerArray.length - 1);
	for (var i = 0, length = markerArray.length; i < length; i++) {
		var x1 = parseInt((this.m_startX) + (xAxisDiv * i));
		var y1 = parseInt(this.m_startY);
		var x2 = parseInt((this.m_startX) + (xAxisDiv * i));
		var y2 = parseInt(this.m_endY);
		var newLine = drawSVGLine(x1, y1, x2, y2, "0.5", hex2rgb(this.m_chart.m_markercolor, this.m_chart.m_markertransparency));
		$("#verticallinegrp" + temp.m_chart.m_objectId).append(newLine);
	}
};

PlotXAxis.prototype.markXaxis = function() {
	this.m_chart.createXAxisMarkerLabelGroup('xaxislabelgrp');
	this.drawAxisLabels();
	if (this.getDescription() !== "") {
		this.drawDescription();
	}
};

PlotXAxis.prototype.drawDescription = function() {
	var temp = this;
	var text = drawSVGText((this.getXDesc() * 1 + this.m_fontsize / 2), this.getYDesc(), this.m_chart.formattedDescription(this.m_chart, this.getDescription()), convertColorToHex(this.getFontColor()), "middle", "middle", 0);
	$(text).css({
		"font-family": selectGlobalFont(temp.getFontFamily()),
		"font-style": temp.getFontStyle(),
		"font-size": temp.m_chart.fontScaling(temp.getFontSize()) + "px" ,
		"font-weight": temp.getFontWeight(),
		"text-decoration": temp.getTextDecoration()
	});
	$("#" + this.m_chart.svgContainerId).append(text);
};

/*PlotXAxis.prototype.drawAxisLabels = function() {
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
};*/

PlotXAxis.prototype.drawAxisLabels = function() {
	for (var i = 0; i < this.m_xAxisData.length; i++) {
		if ((i % this.m_chart.m_skipxaxislabels) == 0 || this.m_chart.m_skipxaxislabels == "auto") {
			this.drawAxisLabelsForScatterPlotChart(this.m_xAxisData[i], i);
		}
	}
};

/** @description will draw  X Axis  Label markings only for ScatteredPlotChart in case of x axis formatters. **/
PlotXAxis.prototype.drawAxisLabelsForScatterPlotChart = function(text, i) {
	var m_axisLineToTextGap = 5;
	//text = getFormattedNumberWithCommas(text, this.m_chart.m_secondaryaxisnumberformatter);
	var xAxisDiv = (this.m_chart.getEndX() - this.m_chart.getStartX()) / (this.m_xAxisActualMarkersArray.length - 1);
	var axisToLabelMargin = this.calculateAxisToLabelMargin(i);
	var m_axisLineToTextGap = this.calculateAxisLineToTextGap();
	if (IsBoolean(this.getLabelTilted())) {
		var dm = (this.getDescription() !== "") ? this.m_fontsize : 5;
		var avlblheight = this.m_chart.m_height / 4 - dm + this.m_chart.m_extraspace;
		var rotation = this.getLabelrotation();
		this.ctx.font = this.getLabelFontProperties();
		if (this.ctx.measureText(text).width > avlblheight) {
			text = this.getText("" + text, avlblheight, this.getLabelFontProperties());
		}
	} else {
		var avlblheight = ((this.m_endX - this.m_startX) / this.m_xAxisData.length) * 2;
		var rotation = 0;
		if (this.m_chart.noOfRows == 2) {
			text = this.getText("" + text, avlblheight, this.getLabelFontProperties());
		}
	}
	var x = (this.m_startX) * 1 + (xAxisDiv * i);
	var y = this.m_startY * 1 + m_axisLineToTextGap + axisToLabelMargin * 1;
	this.translateTextPosition(m_axisLineToTextGap, i, text, xAxisDiv);
	//this.ctx.rotate(rotation * Math.PI / 180);
	//this.m_textUtil.drawText(this.ctx, text, 0, 0, this.getLabelFontProperties(), this.m_labeltextalign, this.m_labelfontcolor);
	/*if (IsBoolean(this.isLabelDecoration())) {
		this.drawUnderLine(text, 0, this.m_labelfontsize / 2, this.m_labelfontcolor, this.m_chart.fontScaling(this.getLabelFontSize()), this.m_labeltextalign);
	}*/
	var halign = IsBoolean(this.getLabelTilted()) ? "left" : "center";
	var text = drawSVGText(x, y, text, this.m_labelfontcolor, halign, "middle", this.getLabelrotation());
	//text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getLabelFontSize()) + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getLabelTextDecoration() + ";");
	$("#xaxislabelgrp" + this.m_chart.m_objectid).append(text);
};

/** @description prepare text for drawing and calculating x,y position**/
PlotXAxis.prototype.translateTextPosition = function (m_axisLineToTextGap, i, text, xAxisDiv) {
	var labelRotation = this.getLabelrotation();
	var textWidth = this.getLabelTextWidth(text);
	var x = (this.m_startX) * 1 + (xAxisDiv * i);
	var axisToLabelMargin = this.calculateAxisToLabelMargin(i);
	var y = this.m_startY * 1 + m_axisLineToTextGap * 1 + axisToLabelMargin * 1;
	this.translateText(labelRotation, x, y, text);
};

PlotXAxis.prototype.drawXAxis = function() {
	var temp = this;
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
		/* Removed markertransparency for X-axis line*/
		var newLine = drawSVGLine(x1, y1, x2, y2, "0.5", strokeColor);
		//hex2rgb(this.m_linexaxiscolor, this.m_chart.m_markertransparency));
		$("#" + temp.m_chart.svgContainerId).append(newLine);
		//this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
	}
};

PlotXAxis.prototype.zeroMarkerVerticalLineForScatterPlotChart = function() {
	for (var i = 0; i < this.m_xAxisActualMarkersArray.length; i++) {
		if (this.m_xAxisActualMarkersArray[i] == 0) {
			var lineWidth = 0.5;
			var antiAliasing = 0.5;
			var strokeStyle = hex2rgb(this.m_chart.m_verticalzeromarkercolor, this.m_chart.m_markertransparency);
			var x1 = this.m_startX * 1 + ((this.m_endX - this.m_startX) / (this.m_xAxisActualMarkersArray.length - 1)) * (i * 1);
			var y1 = this.m_startY * 1;
			var x2 = this.m_startX * 1 + ((this.m_endX - this.m_startX) / (this.m_xAxisActualMarkersArray.length - 1)) * (i * 1);
			var y2 = this.m_endY * 1;
			var newLine = drawSVGLine(x1, y1, x2, y2, "0.5", strokeStyle);
			$("#" + this.m_chart.svgContainerId).append(newLine);
			break;
		}
	}
};

//**************************** YAxis **************************/
function PlotYAxis() {
	this.base = Axes;
	this.base();

	this.m_chart;
	this.m_chartCalculation;

	this.m_startX;
	this.m_startY;
	this.m_endX;
	this.m_endY;
	this.m_axislinetotextgap = 5;
	this.m_textUtil = new TextUtil();
	this.m_util = new Util();
	this.ctx = "";
};

PlotYAxis.prototype = new Axes;

PlotYAxis.prototype.init = function(m_chart, chartCalculation) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.m_chartCalculation = chartCalculation;

	this.m_startX = this.m_chart.getStartX();
	this.m_startY = this.m_chart.getStartY();
	this.m_endX = this.m_chart.getEndX();
	this.m_endY = this.m_chart.getEndY();
	//if (this.m_chart.m_type != "Pie" && this.m_chart.m_type != "PieDoughnut" && this.m_chart.m_type != "Funnel" && this.m_chart.m_type != "InvertedFunnel" && this.m_chart.m_type != "Pyramid" && this.m_chart.m_type != "Spider") {
	this.m_yAxisText = this.m_chartCalculation.getYAxisText();
	this.m_yAxisMarkersArray = this.m_chartCalculation.getYAxisMarkersArray();
	this.setLeftAxisFormatters();
		//this.setRightAxisFormatters();
	/*} else {
		this.setFormatter();
		this.setSecondaryFormatter();
	}*/
	this.m_precision = this.m_chart.getPrecision();
	this.m_secondaryAxisPrecision = this.m_chart.getSecondaryAxisPrecision();
	this.m_isSecodaryAxis = false;
	this.m_axiscolor = convertColorToHex(this.m_chart.getAxisColor());
	this.m_lineyaxiscolor = (this.m_lineyaxiscolor !== "") ? convertColorToHex(this.m_lineyaxiscolor) : this.m_axiscolor;
	this.m_labelfontcolor = convertColorToHex(this.getLabelFontColor());
};

PlotYAxis.prototype.setLeftAxisFormatters = function() {
	this.m_isFormatter = false;
	this.m_isSecondaryFormatter = false;
	if (!IsBoolean(this.m_chart.getFixedLabel())) {
		if (IsBoolean(this.getLeftaxisFormater())) {
			this.setFormatter();
			this.setSecondaryFormatter();
		}
	}
};

PlotYAxis.prototype.setFormatter = function() {
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

PlotYAxis.prototype.setSecondaryFormatter = function() {
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

/** @description return true if axisMarkerLine Array has negative axis value*/
PlotYAxis.prototype.hasNegativeAxisMarker = function (axisMarkerArray) {
	var isNegative = false;
	if (Array.isArray(axisMarkerArray) && axisMarkerArray.length > 0) {
		var value = Math.min.apply(null, axisMarkerArray);
		if (value < 0)
			isNegative = true;
	}
	return isNegative;
};

PlotYAxis.prototype.setPrecision = function(text, precision) {
	if (text !== 0) {
		if (precision !== "default") {
			return (text * 1).toFixed(precision);
		} else {
			return (text * 1);
		}
	} else {
		return (text * 1);
	}
};

PlotYAxis.prototype.addSecondaryFormater = function(text, secondaryUnitSymbol) {
	var textValue = text;
	var formattedText = this.getSecondaryFormaterAddedText(textValue, secondaryUnitSymbol);
	return formattedText.toString();
};

PlotYAxis.prototype.getSecondaryFormaterAddedText = function(textValue, secondaryUnitSymbol) {
	var formattedText = textValue;
	try {
		eval("var formattedText = this.m_util.addUnitAs" + this.m_secondaryFormatterPosition + "(textValue,secondaryUnitSymbol);");
	} catch (e) {
		return formattedText;
	}
	return formattedText;
};

/*PlotYAxis.prototype.setRightAxisFormatters = function() {
	if (IsBoolean(this.m_chart.m_secondaryaxisshow)) {
		if (IsBoolean(this.getRightAxisFormater())) {
			this.setSecondAxisFormatter();
			this.setSecondAxisSecondaryFormatter();
		}
	}
};

PlotYAxis.prototype.setSecondAxisFormatter = function() {
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

PlotYAxis.prototype.setSecondAxisSecondaryFormatter = function() {
	this.m_secondAxisSecondaryUnitSymbol = "";
	this.m_secondAxisSecondaryFormatterPosition = "";
	this.m_isSecondAxisSecondaryFormatter = false;

	if (this.m_chart.m_secondaryaxissecondaryformatter != "none" || this.m_chart.m_secondaryaxissecondaryformatter != "") {
		var secondAxisSecondaryUnit = this.m_chart.m_secondaryaxissecondaryunit;
		var secondAxisSecondaryFormatter = this.m_chart.m_secondaryaxissecondaryformatter;
		if (secondAxisSecondaryUnit != "none" && secondAxisSecondaryUnit != "") {
			this.m_isSecondAxisSecondaryFormatter = true;
			this.m_secondAxisSecondaryUnitSymbol = this.m_util.getFormatterSymbol(secondAxisSecondaryFormatter, secondAxisSecondaryUnit);
			this.m_secondAxisSecondaryFormatterPosition = "suffix";
		}
	}
};*/

PlotYAxis.prototype.horizontalMarkerLines = function() {
	for (var i = 0; i < this.m_yAxisMarkersArray.length; i++) {
		var lineWidth = 0.5;
		var antiAliasing = 0.5;
		var strokeColor = hex2rgb(this.m_chart.m_markercolor, this.m_chart.m_markertransparency);
		var x1 = this.m_startX * 1 - this.m_chart.m_axistodrawingareamargin;
		var y1 = this.m_startY * 1 - this.getYAxisDiv() * i;
		var x2 = this.m_endX * 1;
		var y2 = this.m_startY * 1 - this.getYAxisDiv() * i;
		var newLine = drawSVGLine(x1, y1, x2, y2, "0.5", strokeColor);
		$("#horizontallinegrp" + this.m_chart.m_objectid).append(newLine);
	}
};

PlotYAxis.prototype.getYAxisDiv = function() {
	return (this.m_startY - this.m_endY) / (this.m_yAxisMarkersArray.length - 1);
};

PlotYAxis.prototype.markYaxis = function() {
	this.m_axislinetotextgap = (IsBoolean(this.m_chart.m_updateddesign) ? 15 : this.m_axislinetotextgap);
	var plottedAxisMarkers = [];
	for (var i = 0; i < this.m_yAxisMarkersArray.length; i++) {
		var text = this.m_yAxisMarkersArray[i];
		if (!IsBoolean(this.m_chart.m_fixedlabel)) {
			if (IsBoolean(this.m_isSecodaryAxis)) {
				if (IsBoolean(this.getRightAxisFormater())){
					text = this.getSecondaryAxisFormattedText(text, this.m_secondaryAxisPrecision);
				}
			} else {
				text = this.getFormattedText(text, this.m_precision);
			}
		} else {
			text = getNumberFormattedValue(text);
		}
		plottedAxisMarkers.push(text);
	}
	for(var j=0; j<plottedAxisMarkers.length; j++) {
		var x = (this.m_startX * 1 - this.m_chart.m_axistodrawingareamargin) - this.m_axislinetotextgap;
		var y = ((this.m_startY * 1) - (j * (this.getYAxisDiv())));
		//this.m_textUtil.drawText(this.ctx, plottedAxisMarkers[j], (this.m_startX * 1 - this.m_chart.m_axistodrawingareamargin) - this.m_axislinetotextgap, ((this.m_startY * 1) - (j * (this.getYAxisDiv()))), this.getLabelFontProperties(), this.m_labeltextalign, this.m_labelfontcolor);
		var text = drawSVGText(x, y, plottedAxisMarkers[j], this.m_labelfontcolor, "right", "middle", this.getLabelrotation());
		//text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getLabelFontSize()) + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getLabelTextDecoration() + ";");
		$("#yaxislabelgrp" + this.m_chart.m_objectid).append(text);
	}
	if (this.getDescription() != "") {
        this.drawDescription();
    }
};

PlotYAxis.prototype.getFormattedText = function(text, prec) {
	var precision = (prec == "undefined" || prec == undefined) ? this.m_chart.m_precision : prec;
	if (text % 1 != 0 && precision < 1) {
		text = this.setPrecision(text, 0);
	} else if (!IsBoolean(this.m_isFormatter) && !IsBoolean(this.m_isSecondaryFormatter)) {
		if (precision !== "default")
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
		if (this.m_secondaryUnitSymbol != "auto") {
			if (precision != 0 && precision != null) {
				text = this.setPrecision(text, precision);
			} else if (text < 1 && text % 1 != 0) {
				text = this.setPrecision(text, 2);
			}
			text = (text%1 === 0 && this.m_precision === "default") ? (text*1) : text;
			text = this.addSecondaryFormater(text, this.m_secondaryUnitSymbol);
		} else {
			var symbol = getNumberFormattedSymbol(text * 1 , this.m_chart.m_unit);
			var val = getNumberFormattedNumericValue(text * 1, precision, this.m_chart.m_unit);
			text = this.setPrecision(val, precision);
			if (precision != 0 && precision != null) {
				text = this.setPrecision(text, precision);
			} else if (text < 1 && text % 1 != 0) {
				text = this.setPrecision(text, 2);
			}
			text = (text%1 === 0 && this.m_precision === "default") ? (text*1) : text;
			text = this.addSecondaryFormater(text, symbol);
		}
	}

	text = getFormattedNumberWithCommas(text, this.m_chart.m_numberformatter);
	if (IsBoolean(this.m_isFormatter) && this.m_unitSymbol != undefined) {
		text = this.m_util.addFormatter(text, this.m_unitSymbol, this.m_formatterPosition, precision);
	}
	return text;
};

PlotYAxis.prototype.drawDescription = function() {
	var temp = this;
	var text = drawSVGText(this.getXDesc(), this.getYDesc(), this.m_chart.formattedDescription(this.m_chart, this.getDescription()), convertColorToHex(this.getFontColor()), "middle", "middle", 270);
	$(text).css({
		"font-family": selectGlobalFont(temp.getFontFamily()),
		"font-style": temp.getFontStyle(),
		"font-size": temp.m_chart.fontScaling(temp.getFontSize()) + "px" ,
		"font-weight": temp.getFontWeight(),
		"text-decoration": temp.getTextDecoration()
	});
	$("#" + temp.m_chart.svgContainerId).append(text);
};

PlotYAxis.prototype.getXDesc = function() {
	return (this.m_chart.m_x * 1) + (this.m_chart.fontScaling(this.getFontSize()) * 1) + this.m_chart.m_chartpaddings.leftBorderToDescription*1/2;
};
PlotYAxis.prototype.getYDesc = function() {
	return this.m_startY - (this.m_startY - this.m_endY) / 2;
};
PlotYAxis.prototype.zeroMarkerLine = function() {
	for (var i = 0; i < this.m_yAxisMarkersArray.length; i++) {
		if (this.m_yAxisMarkersArray[i] == 0) {
			var lineWidth = 0.5;
			var antiAliasing = 0.5;
			var strokeColor = hex2rgb(this.m_chart.m_zeromarkercolor, this.m_chart.m_markertransparency);
			var x1 = this.m_startX * 1 - this.m_chart.m_axistodrawingareamargin;
			var y1 = this.m_startY * 1 - this.getYAxisDiv() * i;
			var x2 = this.m_endX * 1;
			var y2 = this.m_startY * 1 - this.getYAxisDiv() * i;
			var newLine = drawSVGLine(x1, y1, x2, y2, "0.5", strokeColor);
			$("#" + this.m_chart.svgContainerId).append(newLine);
			break;
		}
	}
};
PlotYAxis.prototype.drawYAxis = function() {
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
		//this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
		var newLine = drawSVGLine(x1, y1, x2, y2, "0.5", strokeColor);
		$("#" + this.m_chart.svgContainerId).append(newLine);
	}
};
//# sourceURL=ScatteredPlotChart.js
