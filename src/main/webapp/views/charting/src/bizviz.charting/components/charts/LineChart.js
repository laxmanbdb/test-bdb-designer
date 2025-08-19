/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: LineChart.js
 * @description LineChart
 **/
function LineChart(m_chartContainer,m_zIndex){
	this.base = Chart;
	this.base();

	this.m_x=680;
	this.m_y=20;
	this.m_width=300;
	this.m_height=260;
	this.m_radius=2;
	this.m_lineSeries=[];
	this.m_colorNames=[];
	this.m_pointSeries=[];
	/**DAS- 954*/
	this.m_showannotation = false;
	this.m_showyannotation = false;
	this.m_showxannotation = false;
	this.m_annotationradius = "3";
	this.m_annotationshape = "point";
	this.m_annotationcolor = "#FF5733";
	this.m_annotationtextcolor = "#e5e1e0";
	this.m_annotationseriescolor = false;
	this.m_annotationopacity = "1";
	this.m_annotationData = [];
	this.m_annotationXData = [];
	this.m_annotationXData2 = [];
	this.m_annotationNames=[];
	this.annotationdatatype = "number";
	this.m_annotationtooltiptitle = "Annotation";
	this.m_linetype = false;
	this.m_showannotationTooltip = false;

	this.m_categoryNames=[];
	this.m_seriesNames=[];
	this.m_seriesarr=[];
	this.m_categoryData=[];
	this.m_seriesData=[];
	this.m_linewidth = "2";
	this.m_pointSeriesData = [];
	this.m_xPositionArray=[];
	this.m_yPositionArray=[];
	this.m_calculation=new LineCalculation();
	this.m_xAxis = new Xaxis();
	this.m_yAxis = new Yaxis();
	this.m_util= new Util();
	this.noOfRows=1; //used for set x-axis text into two rows in non tilted case.
	this.m_chartContainer = m_chartContainer ;
	this.m_zIndex = m_zIndex ;
	this.m_continuousline = false; //added for plotting continuous line when data is discontinuous
	this.enableDrillHighlighter = false;
	this.m_drilltoggle = true;
	/*Threshold properties DAS_951*/
	this.m_showyaxisthreshold = false;
	this.m_minimumyaxisthreshold = "0";
	this.m_maximumyaxisthreshold = "50";
	this.m_thresholdfillopacity = "0.3";
	this.m_thresholdfillcolor = "#FF0000";
	this.m_enablethresholdfill = false;
	this.m_yaxisthresholdlinewidth = "1";
	this.m_yaxisthresholdstrokecolor = "#000000";
	this.m_minimumthresholdstrokecolor = "#00FF00";
	this.m_maximumthresholdstrokecolor = "#FF0000";
	this.m_thresholdlinetype = "straight"; //dot,dash1,dash
	this.m_minimumyaxisthresholdline = true;
	/**threshold fill color options */
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
/** @description Making prototype of chart class to inherit its properties and methods into Line chart **/
LineChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
LineChart.prototype.setProperty=function(chartJson){
	this.ParseJsonAttributes(chartJson.Object ,this);
	this.initCanvas();	//create draggable div
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
LineChart.prototype.ParseJsonAttributes=function(jsonObject,nodeObject){
	this.chartJson = jsonObject;
	for(var key in jsonObject ){
		if(key == "Chart"){
			for (var chartKey in jsonObject[key] ){
				switch(chartKey){
				case "xAxis":
					for (var xAxisKey in jsonObject[key][chartKey] ){
						var propertyName = this.getNodeAttributeName( xAxisKey );
						nodeObject.m_xAxis[propertyName] = jsonObject[key][chartKey][xAxisKey];
					}
					break;
				case "yAxis" :
					for (var yAxisKey in jsonObject[key][chartKey] ){
						var propertyName = this.getNodeAttributeName( yAxisKey );
						nodeObject.m_yAxis[propertyName] = jsonObject[key][chartKey][yAxisKey];
					}
					break;
				case "Title" :
					for (var titleKey in jsonObject[key][chartKey] ){
						var propertyName = this.getNodeAttributeName(  titleKey );
						nodeObject.m_title[propertyName] = jsonObject[key][chartKey][titleKey];
					}
					break;
				case "SubTitle" :
					for (var subTitleKey in jsonObject[key][chartKey] ){
						var propertyName = this.getNodeAttributeName( subTitleKey );
						nodeObject.m_subTitle[propertyName] = jsonObject[key][chartKey][subTitleKey];
					}
					break;
				case "CategoryColors" :
					var categoryColorsObject = new CategoryColors();
					this.setCategoryColors(categoryColorsObject);
					for (var CategoryColorsKey in jsonObject[key][chartKey] ){
						switch(CategoryColorsKey){
							case "CategoryColor":
								var CategoryColorArray = this.getArrayOfSingleLengthJson(jsonObject[key][chartKey][CategoryColorsKey]);
								categoryColorsObject.cateogryNameColorMap = new Object() ;
								for(var i=0 ; i<CategoryColorArray.length ; i++){
									var categoryColorObject = new CategoryColor();
									categoryColorsObject.setCategoryColor(categoryColorObject);
									for (var CategoryColorKey in CategoryColorArray[i] ){
										var propertyName = this.getNodeAttributeName( CategoryColorKey );
										categoryColorObject[propertyName] = CategoryColorArray[i][CategoryColorKey];
									}
									categoryColorsObject.cateogryNameColorMap[categoryColorObject.getCategoryName()] = categoryColorObject.getColor() ;
								}
								break;
							default :
								var propertyName = this.getNodeAttributeName( CategoryColorsKey );
								nodeObject.m_categoryColors[propertyName] = jsonObject[key][chartKey][CategoryColorsKey];
								break;
						}
					}
					categoryColorsObject.setCategoryDefaultColorSet();
					break;
				case "ConditionalColors" :
					if(jsonObject[key][chartKey] != ""){
						var conditionalColorsObject = new ConditionalColors();
						this.setConditionalColors(conditionalColorsObject);
						var ConditionalColorArray = this.getArrayOfSingleLengthJson(jsonObject[key][chartKey]["ConditionalColor"]);
						for(var i=0 ; i<ConditionalColorArray.length ; i++){
							var conditionalColorObject = new ConditionalColor();
							conditionalColorsObject.setConditionalColor(conditionalColorObject);
							for(var conditionalColorKey in ConditionalColorArray[i]){
								var propertyName = this.getNodeAttributeName( conditionalColorKey );
								conditionalColorObject[propertyName] = ConditionalColorArray[i][conditionalColorKey];
							}
						}
					}
					break;
				default :
					var propertyName = this.getNodeAttributeName( chartKey );
					nodeObject[propertyName] = jsonObject[key][chartKey];
					break;
				}
			}
		}
		else{
			var propertyName = this. getNodeAttributeName( key );
			nodeObject[propertyName] = jsonObject[key];
		}
	}
};

/** @description Getter Method of DataProvider **/
LineChart.prototype.getDataProvider=function(){
	return this.m_dataProvider ;
};

/** @description Setter Method of Fields according to fieldType **/
LineChart.prototype.setFields=function(fieldsJson){
	this.m_fieldsJson = fieldsJson ;
	var categoryJson = [] ;
	var seriesJson = [] ;
	var annotationJson = [] ;

	for(var i = 0, length = fieldsJson.length; i < length; i++){
		var fieldType = this.getProperAttributeNameValue(fieldsJson[i],"Type");
		switch(fieldType) {
			case "Category" :
				categoryJson.push(fieldsJson[i]);
				break;
			case "Series" :
				seriesJson.push(fieldsJson[i]);
				break;
			case "Annotation" :
				annotationJson.push(fieldsJson[i]);
				break;
			case "CalculatedField" :
				seriesJson.push(fieldsJson[i]);
				break;
			default :
				break;
		}
	}
	this.setCategory(categoryJson);
	this.setSeries(seriesJson);
	this.setAnnotation(annotationJson);
};

/** @description Setter Method of Category iterate for all category. **/
LineChart.prototype.setCategory=function(categoryJson){
	this.m_categoryNames = [] ;
	this.m_categoryFieldColor = [];
	this.m_categoryDisplayNames = [] ;
	this.m_allCategoryNames = [] ;
	this.m_allCategoryDisplayNames = [] ;
	this.m_categoryVisibleArr=[];
	var count = 0;
	// only one category can be set for line chart, preference to first one
	for(var i = 0, length = categoryJson.length; i < length; i++){
		this.m_allCategoryNames[i] = this.getProperAttributeNameValue(categoryJson[i],"Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(categoryJson[i], "DisplayName"));
		this.m_allCategoryDisplayNames[i] = m_formattedDisplayName;
		this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]]= this.getProperAttributeNameValue(categoryJson[i],"visible");
		if(IsBoolean(this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]])){
			this.m_categoryNames[count] = this.getProperAttributeNameValue(categoryJson[i],"Name");
			this.m_categoryDisplayNames[count] = m_formattedDisplayName;
			this.m_categoryFieldColor[count] = this.getProperAttributeNameValue(categoryJson[i], "Color");
			count++;
		}
	}
};

/** @description creating array for each property of fields and storing in arrays **/
LineChart.prototype.setSeries=function(seriesJson){
	this.m_seriesNames = [] ;
	this.m_seriesDisplayNames = [] ;
	this.m_seriesColors = [] ;
	this.m_legendNames = [] ;
	this.m_seriesVisibleArr = {};// added for checklist
	this.m_plotRadiusArray = [];
	this.m_plotTrasparencyArray = [];
	this.m_plotShapeArray =[];
	this.m_allSeriesDisplayNames=[];
	this.m_allSeriesNames=[];
	this.m_seriesDataLabelProperty = [];
	this.m_lineTypeArray = [];
	this.m_lineWidthArray = [];
	var count = 0 ;
	this.legendMap={};
	for(var i = 0, length = seriesJson.length; i < length; i++){
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.m_allSeriesDisplayNames[i] = m_formattedDisplayName;
		this.m_allSeriesNames[i]=this.getProperAttributeNameValue(seriesJson[i],"Name");
		this.m_seriesVisibleArr[this.m_allSeriesNames[i]]= this.getProperAttributeNameValue(seriesJson[i],"visible");
		if(IsBoolean(this.m_seriesVisibleArr[this.m_allSeriesNames[i]])){
			this.m_seriesDisplayNames[count] = m_formattedDisplayName;
			this.m_seriesColors[count] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i],"Color"));
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
			this.m_legendNames[count] = m_formattedDisplayName;
			this.m_seriesNames[count] = this.getProperAttributeNameValue(seriesJson[i],"Name");
			var radius = this.getProperAttributeNameValue(seriesJson[i],"PlotRadius");
			this.m_plotRadiusArray[count] = (radius != undefined && radius !== null && radius !== "") ? radius : 2 ;
			var lineWidth = this.getProperAttributeNameValue(seriesJson[i],"LineWidth");
			this.m_lineWidthArray[count] = (lineWidth != undefined && lineWidth !== null && lineWidth !== "") ? lineWidth : 2 ;
			var lineType = this.getProperAttributeNameValue(seriesJson[i],"LineType");
			this.m_lineTypeArray[count] = (lineType != undefined && lineType !== null && lineType !== "") ? lineType : "simple" ;
			var transparency = this.getProperAttributeNameValue(seriesJson[i],"PlotTransparency");
			this.m_plotTrasparencyArray[count] = (transparency != undefined && transparency !== null && transparency !== "") ? transparency : 1 ;
			var shape = this.getProperAttributeNameValue(seriesJson[i],"PlotType");
			this.m_plotShapeArray[count] = (shape != undefined && shape !== null && shape !== "") ? shape : "point" ;
			var tempMap = {
				    "seriesName": this.m_seriesNames[count],
				    "displayName": this.m_seriesDisplayNames[count],
				    "color": this.m_seriesColors[count],
				    "shape": this.m_plotShapeArray[count],
				    "index": count
				};
			this.legendMap[this.m_seriesNames[count]]=tempMap;
			count++;
		}

	}
	this.setLegendsIntialLoad(this.m_defaultlegendfields);
};
/** @description Setter Method of Annotation data for all category. **/
LineChart.prototype.setAnnotation = function(categoryJson) {
	var temp= this;
    temp.m_annotationNames = { text: [], category: [] };
    temp.m_annotationDisplayNames = { text: [], category: [] };
    temp.m_allAnnotationNames = { text: [], category: [] };
    temp.m_allAnnotationDisplayNames = { text: [], category: [] };
    temp.m_annotationVisibleArr = { text: {}, category: {} };
    var count = { text: 0, category: 0 };
   /**get sample data from component data file */  
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
};;
/** @description Getter Method of Category DisplayNames **/
LineChart.prototype.getLegendInfo=function(){
	return this.legendMap;
};

/** @description Getter Method of Category DisplayNames **/
LineChart.prototype.getAllSeriesNames=function(){
	return this.m_allSeriesNames;
};

/** @description Getter for All Category names**/
LineChart.prototype.getAllCategoryNames = function () {
	return this.m_allCategoryNames;
};

/** @description Getter Method of Category DisplayNames **/
LineChart.prototype.getCategoryNames=function(){
	return this.m_categoryNames ;
};

/** @description Getter Method of Category DisplayNames **/
LineChart.prototype.getCategoryDisplayNames=function(){
	return this.m_categoryDisplayNames ;
};

/** @description Getter Method of Category Names **/
LineChart.prototype.getSeriesNames=function(){
	return this.m_seriesNames ;
};
/** @description Getter Method of Annotation Names **/
LineChart.prototype.getAnnotationNames=function(){
	return this.m_seriesNames ;
};

/** @description Getter Method of Category DisplayNames **/
LineChart.prototype.getSeriesDisplayNames=function(){
	return this.m_seriesDisplayNames ;
};

/** @description Getter Method of SeriesColors  **/
LineChart.prototype.getSeriesColors=function(){
	return this.m_seriesColors ;
};

/** @description Setter Method of SeriesColor **/
LineChart.prototype.setSeriesColor=function(m_seriesColor){
	this.m_seriesColor  = m_seriesColor ;
};

/** @description Setter Method of  LegendNames **/
LineChart.prototype.setLegendNames=function(m_legendNames){
	this.m_legendNames = m_legendNames ;
};

/** @description Getter Method of LegendNames **/
LineChart.prototype.getLegendNames=function(){
	return this.m_legendNames ;
};

/** @description Setter Method of Category Data **/
LineChart.prototype.setCategoryData=function(){
	this.m_categoryData = [] ;
	this.isEmptyCategory = true;
	if(this.getCategoryNames().length > 0){
		this.isEmptyCategory = false;
		for(var i = 0, length = this.getCategoryNames().length; i < length; i++){
			this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
		}
	}
};

/** @description Setter Method of SeriesData **/
LineChart.prototype.setSeriesData=function(){
	this.m_seriesData = [] ;
	for(var i = 0, length = this.getSeriesNames().length; i < length; i++){
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
	if(IsBoolean(this.m_designMode)){
	/**get data for annotation from dataset */
	this.m_annotationData = [];
	this.m_annotationXData = [];
	this.m_annotationXData2 = [];
		
	if(this.m_annotationNames['text'].length>0){
	var annotationdata = this.m_annotationNames['text'];
	var text = this.getDataFromJSON(this.m_annotationNames['text'][0]);
	for(var i=0; i<text.length;i++){
		this.m_annotationData.push({type: 'event',label: text[i],point: 0, property: { color: 'red', radius: 10 }});
	}
	}
	/**get annotation start data */
	if(this.m_annotationNames['category'].length>0){	
	/**get annotation start data */
	if(this.m_annotationNames['category'][0]!= undefined){
		var annotationXdata = this.getDataFromJSON(this.m_annotationNames['category'][0]);
		for(var i=0; i<annotationXdata.length;i++){
		if(annotationXdata[i] != 'null' || annotationXdata[i] != '' || annotationXdata[i] != null)
		this.m_annotationXData.push({type: 'event',label: this.m_annotationData[i].label,point: annotationXdata[i], property: { color: 'red', radius: 10 }});
	}
	}
	/**get annotation end data */
	if(this.m_annotationNames['category'][1]!= undefined){
		var annotationXdata = this.getDataFromJSON(this.m_annotationNames['category'][1]);
		for(var i=0; i<annotationXdata.length;i++){
		if(annotationXdata[i] != 'null' || annotationXdata[i] != '' || annotationXdata[i] != null)
		this.m_annotationXData2.push({type: 'event',label: this.m_annotationData[i],point: annotationXdata[i], property: { color: 'red', radius: 10 }});
	}
	}
	}
	}else{
	/**get annotation data from annotation mapping popup connection saved data */
		var mappedData = this.chartJson.Chart.Annotation;
		/**DAS-1076 */
		var DataSourceId = (mappedData != undefined)?mappedData.DataSourceId:"";
		if(DataSourceId != ""){
			var label = mappedData.DataLabel;
			var atndata = mappedData.DataValue;
			this.m_allAnnotationNames.category[0] = atndata;
			this.m_allAnnotationNames.text[0] = label;
			var dataP = sdk.getConnection(DataSourceId);
			var alldata = dataP.m_wholeData;
			/**get data for annotation from dataset */
			this.m_annotationData = [];
			this.m_annotationXData = [];
			this.m_annotationXData2 = [];
			var textData = [];
			var annotationData = [];
			if (alldata && alldata.length > 0) {
				textData = alldata.map(item => {
					if (item[label] === null || item[label] === undefined || item[label] === "null") {
						return "No label";
					} else {
						return item[label];
					}
				});
				annotationData = (atndata!="") ? alldata.map(item => item[atndata]) : [];
			}
			for (let i = 0; i < textData.length; i++) {
			    this.m_annotationData.push({type: 'event',label: textData[i],point: 0, property: { color: 'red', radius: 10 }});
			}
			for (let i = 0; i < annotationData.length; i++) {
			    this.m_annotationXData.push({type: 'event',label: textData[i],point: annotationData[i], property: { color: 'red', radius: 10 }});
			}
		}
	}
	};

/** @description Getter Method of CategoryData **/
LineChart.prototype.getCategoryData=function(){
	return this.m_categoryData ;
};

/** @description Getter Method of SeriesData **/
LineChart.prototype.getSeriesData=function(){
	return this.m_seriesData ;
};

/** @description Setter Method of AllFieldsName iterate for all Fields **/
LineChart.prototype.setAllFieldsName=function(){
	this.m_allfieldsName = [] ;
	for(var i = 0, length = this.getAllCategoryNames().length; i < length; i++){
		this.m_allfieldsName.push( this.getAllCategoryNames()[i] );
	}
	for(var j = 0, length1 = this.getAllSeriesNames().length; j < length1; j++){
		this.m_allfieldsName.push( this.getAllSeriesNames()[j] );
	}
};

/** @description Getter Method of All FieldsName **/
LineChart.prototype.getAllFieldsName=function(){
	return this.m_allfieldsName ;
};

/** @description Setter Method of AllFieldsDisplayName **/
LineChart.prototype.setAllFieldsDisplayName=function(){
	this.m_allfieldsDisplayName = [] ;
	for(var i = 0, length = this.getCategoryDisplayNames().length; i < length; i++){
		this.m_allfieldsDisplayName.push( this.getCategoryDisplayNames()[i] );
	}
	for(var j = 0, length1 = this.getSeriesDisplayNames().length; j < length1; j++){
		this.m_allfieldsDisplayName.push( this.getSeriesDisplayNames()[j] );
	}
};

/** @description Getter Method of All FieldsDisplayName **/
LineChart.prototype.getAllFieldsDisplayName=function(){
	return this.m_allfieldsDisplayName ;
};

/** @description initialization of LineChart **/
LineChart.prototype.init=function(){
	this.setCategoryData();
	this.setSeriesData();
	this.setAllFieldsName();
	this.setAllFieldsDisplayName();

	this.setColorsForSeries();
	this.isSeriesDataEmpty();
	this.setShowSeries(this.getAllFieldsName());
	this.visibleSeriesInfo=this.getVisibleSeriesData(this.getSeriesData());
	//this.m_seriesDataForToolTip  = this.m_seriesDataForToolTip;
	this.updateSeriesDataWithCommaSeperators();

	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);

	if((!IsBoolean(this.m_isEmptySeries ))&&(IsBoolean(this.isVisibleSeries()))&&(!IsBoolean(this.isEmptyCategory))){
		this.settransparency();
		this.initializeCalculation();
		this.m_xAxis.init(this,this.m_calculation);
		this.m_yAxis.init(this,this.m_calculation);
	}
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};

/** @description update seriesData if Data having comma separated value. **/
LineChart.prototype.updateSeriesDataWithCommaSeperators = function(){
	this.m_displaySeriesDataFlag = [];
	for(var i = 0, outerLength = this.m_seriesData.length; i < outerLength; i++ ){
		this.m_displaySeriesDataFlag[i] = [];
		for(var j = 0, innerLength = this.m_seriesData[i].length; j < innerLength; j++){
			this.m_displaySeriesDataFlag[i][j] = true;
			if(isNaN(this.m_seriesData[i][j])){
				this.m_displaySeriesDataFlag[i][j] = false;
				this.m_seriesData[i][j] = getNumericComparableValue(this.m_seriesData[i][j]);
			}
		}
	}
};

/** @description will return true if at-least one series is visible. **/
LineChart.prototype.isVisibleSeriesAvailable = function(){
	for(var index = 0, length = this.getSeriesNames().length; index < length; index++){
		if(IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[index]])){
			return true;
		}
	}
	return false;
};

/** @description Drawing of chart started by drawing different parts of chart like ChartFrame,Title,SubTitle **/
LineChart.prototype.drawChart=function(){
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	var map = this.IsDrawingPossible();
	if ( IsBoolean(map.permission) ){
		this.drawXAxis();
		this.drawYAxis();
		this.drawLineChart();
		if(IsBoolean(this.m_showannotation)){
			/**check story annotation from data file */
		if(this.m_annotationXData.length>0 || this.m_annotationxdata.length>0){
			if(this.m_annotationxdata.length>0){
			this.m_annotationXData = this.m_annotationxdata;	
			}
			this.drawAnnotationChart();	
		}else{
			this.drawMessage(this.m_status.noAnnotationValue);
		}
		}
		this.drawDataLabel();
		this.drawThreshold();
	}
	else{
		this.drawMessage(map.message);
	}
};

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
LineChart.prototype.initCanvas=function(){
	var temp = this ;
	$("#draggableDiv"+temp.m_objectid).remove() ;
	this.initializeDraggableDivAndCanvas();
};

/** @description  initialization of draggable div and its inner Content **/
LineChart.prototype.initializeDraggableDivAndCanvas = function(){
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer,this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/** @description added below method for supporting drill highlighter enhancment**/
LineChart.prototype.settransparency=function(){
	this.m_transparencyarr = {};
	for(var a=0;a<this.m_seriesNames.length;a++){
		this.m_transparencyarr[this.m_seriesNames[a]]=[];
		for(var b=0;b<this.m_seriesData[0].length;b++){
			this.m_transparencyarr[this.m_seriesNames[a]][b] = this.m_plotTrasparencyArray[a];
		}
	}
}
/** @description initialize the calculation and seriesClass of the LineChart. **/
LineChart.prototype.initializeCalculation=function(){
	this.calculateMinimumMaximum();
	this.setChartDrawingArea();
	this.m_calculation.init(this);
	this.m_xPositionArray = this.m_calculation.getXPosition();//we got here x axis position array
	this.m_yPositionArray = this.m_calculation.getYPosition();//we got here y axis position array
	this.m_radius = this.m_lineWidthArray;//this.m_linewidth*1 + 1;
	this.m_lineSeries = {};
	this.m_pointSeries = {};
	this.m_annotationSeries = {};
	this.m_valueTextSeries = {};
	this.m_pointSeriesData = this.m_calculation.yAxisData;
	for(var k = 0, i1 = 0, length = this.m_seriesNames.length; i1 < length; i1++){
		if(IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i1]])){
			this.m_lineSeries[this.m_seriesNames[i1]]=new LineSeries();
			this.m_lineSeries[this.m_seriesNames[i1]].init(this.getColorsForSeries()[i1],this.m_xPositionArray,this.m_yPositionArray[k],this,1,this.m_lineWidthArray[i1],this.m_lineTypeArray[i1]); // using trancparency 1 for now  if want dynamic use "this.m_plotRadiusArray[i1]"

			this.m_pointSeries[this.m_seriesNames[i1]]=new PointSeries();
			this.m_pointSeries[this.m_seriesNames[i1]].init(this.m_PointsColorsArray[i1],(this.m_radius[i1] * 1) + 1,this.m_xPositionArray,this.m_yPositionArray[k],this,this.m_transparencyarr[this.m_seriesNames[i1]],this.m_plotShapeArray[i1],this.m_plotRadiusArray[i1]);//this.m_plotTrasparencyArray[i1]
			if (IsBoolean(this.m_seriesDataLabelProperty[i1].showDataLabel)) {
			    this.setSeriesDataLabel();
			    this.m_valueTextSeries[this.m_seriesNames[i1]] = new ValueTextSeries();
			    this.m_valueTextSeries[this.m_seriesNames[i1]].init(this.m_xPositionArray, this.m_yPositionArray[k], this, this.m_seriesDataForDataLabel[i1], this.m_seriesDataLabelProperty[i1],this.m_seriesData[i1]);
			};
			k++;
		}
	}
	this.setThresholdFillColors();
};
/** @description set Data Label for Series  of the LineChart. **/
LineChart.prototype.setSeriesDataLabel = function() {
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
/** @Description calculate the Min/Max value and get required ScaleInfo of The Axis **/
LineChart.prototype.calculateMinimumMaximum=function(){
	var minMax=this.calculateMinMaxValue(this.visibleSeriesInfo.seriesData);
	var calculatedMin=minMax.min;
	var calculatedMax=minMax.max;

	var niceScaleObj=this.getCalculateNiceScale(calculatedMin,calculatedMax,this.m_basezero,this.m_autoaxissetup,this.m_minimumaxisvalue,this.m_maximumaxisvalue,(this.m_height));
	this.min=niceScaleObj.min;
	this.max=niceScaleObj.max;
	this.yAxisNoOfMarker=niceScaleObj.markerArray.length;
	this.yAxisText=niceScaleObj.step;
	this.m_yAxisMarkersArray=niceScaleObj.markerArray;
};

/** @description  return Colors for Series. **/
LineChart.prototype.getColorsForSeries=function(){
	return this.m_seriesColorsArray ;
};

/** @description Setter method for set Colors of series. **/
LineChart.prototype.setColorsForSeries=function(){
	this.m_seriesColorsArray = [];
	this.m_PointsColorsArray = [];
	
	var isemptyCat = true;//DAS-1122

	for (var i = 0; i < this.m_categoryData.length && isemptyCat; i++) {
		isemptyCat = Array.isArray(this.m_categoryData[i]) && this.m_categoryData[i].length === 0;
	}

	if(IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill )){
		for(var i = 0, outerLength = this.m_seriesData.length; i < outerLength; i++){
			this.m_seriesColorsArray[i] = [];
			this.m_PointsColorsArray [i] = [];
			for(var j = 0, innerLength = this.m_seriesData[i].length; j < innerLength; j++){
				this.m_seriesColorsArray[i][j] = this.m_drillColor;
				this.m_PointsColorsArray[i][j] = this.m_drillColor;
			}
		}
	}
	else if( !IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && this.getCategoryColors().getCategoryColor().length>0 && IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName() )){
		var categoryColors = this.getCategoryColors().getCategoryColorsForCategoryNames(this.getCategoryData()[0],this.m_categoryFieldColor);
		var seriesColors = this.getSeriesColors();
		for(var i = 0, outerLength = this.m_seriesData.length; i < outerLength; i++){
			this.m_seriesColorsArray[i] = [];
			this.m_PointsColorsArray [i] = [];
			for(var j = 0, innerLength = this.m_seriesData[i].length; j < innerLength; j++){
				this.m_seriesColorsArray[i][j] = seriesColors[i];
				this.m_PointsColorsArray[i][j] = categoryColors[j];
			}
		}
	}
	else if( !IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && ( !IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName()) || this.getCategoryColors().getCategoryColor().length == 0) && this.getConditionalColors() != "" && this.getConditionalColors() != undefined && this.getConditionalColors().getConditionalColor().length>0 && !IsBoolean(isemptyCat)){
		var conditionalColors = this.getConditionalColors().getConditionalColorsForConditions(this.getSeriesNames(),this.getSeriesColors(),this.m_seriesData,this);
		var seriesColors = this.getSeriesColors();
		for(var i = 0, outerLength = this.m_seriesData.length; i < outerLength; i++){
			this.m_seriesColorsArray[i] = [];
			this.m_PointsColorsArray[i] = [];
			for(var j = 0, innerLength = this.m_seriesData[i].length; j < innerLength; j++){
				this.m_seriesColorsArray[i][j] = seriesColors[i];
				this.m_PointsColorsArray[i][j] =conditionalColors[i][j];
			}
		}
	}
	else{
		var seriesColors = this.getSeriesColors();
		for(var i = 0, outerLength = this.m_seriesData.length; i < outerLength; i++){
			this.m_seriesColorsArray[i] = [];
			this.m_PointsColorsArray[i] = [];
			for(var j = 0, innerLength = this.m_seriesData[i].length; j < innerLength; j++){
				this.m_seriesColorsArray[i][j] = seriesColors[i];
				this.m_PointsColorsArray[i][j] = seriesColors[i];
			}
		}
	}
};

/** @description Will Draw Title on canvas if showTitle set to true **/
LineChart.prototype.drawTitle=function(){
	this.m_title.draw();
};

/** @description Will Draw SubTitle on canvas if showSubTitle set to true **/
LineChart.prototype.drawSubTitle=function(){
	this.m_subTitle.draw();
};

/** @description Will Draw XAxis on canvas with x-axis labels **/
LineChart.prototype.drawXAxis=function(){
	this.m_xAxis.drawTickMarks();
	this.m_xAxis.drawVerticalLine();
	this.m_xAxis.markXaxis();
	this.m_xAxis.drawXAxis();
};

/** @description Will Draw YAxis on canvas with y-axis labels **/
LineChart.prototype.drawYAxis=function(){
	if(IsBoolean(this.m_showmarkerline))
		this.m_yAxis.horizontalMarkerLines();
	if (IsBoolean(this.m_zeromarkerline) && !IsBoolean(this.m_basezero) && IsBoolean(this.m_yAxis.hasNegativeAxisMarker(this.m_yAxisMarkersArray)))
		this.m_yAxis.zeroMarkerLine();
	this.m_yAxis.markYaxis();
	this.m_yAxis.drawYAxis();
};

/** @description Will Draw ChartFrame on canvas . **/
LineChart.prototype.drawChartFrame=function(){
	this.m_chartFrame.drawFrame();
};

/** @description Will Draw LineChart on canvas with Visible series **/
LineChart.prototype.drawLineChart=function(){
	for(var i = 0, length = this.m_seriesNames.length; i < length; i++){
		if(IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])){
			this.m_lineSeries[this.m_seriesNames[i]].drawLineSeries();
			if( IsBoolean(this.getShowPoint()) || (this.m_xPositionArray.length == 1)){ 
				this.m_pointSeries[this.m_seriesNames[i]].drawPointSeries();
			}
		}
	}
};
/** @description Will Draw LineChart on canvas with Visible series **/
LineChart.prototype.drawAnnotationChart=function(){
	this.m_annotationSeries = {};
	for(var i = 0, length = this.m_seriesNames.length; i < length; i++){
		if(IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])){
			if( IsBoolean(this.m_showannotation) || (this.m_xPositionArray.length == 1)){
				/**DAS-954 */
				/**chck annotation points */
				this.m_annotationSeries[this.m_seriesNames[i]]=new AnnotationSeries();
				this.m_annotationSeries[this.m_seriesNames[i]].init(this.m_PointsColorsArray[i],(this.m_radius[i] * 1) + 1,this.m_xPositionArray,this.m_yPositionArray[0],this,this.m_transparencyarr[this.m_seriesNames[i]],this.m_plotShapeArray[i],this.m_plotRadiusArray[i]);//this.m_plotTrasparencyArray[i1]
				this.m_annotationSeries[this.m_seriesNames[i]].drawPointSeries();
			}
		}
	}
};
/** @description Will Draw LineChart data label**/
LineChart.prototype.drawDataLabel = function() {
	/**Added for Data Label Overlap issue*/
	this.m_overlappeddatalabelarrayY = [];
	this.m_overlappeddatalabelarrayX = [];
    for (var i = 0, length = this.m_seriesNames.length; i < length; i++) {
        if (IsBoolean(this.m_seriesDataLabelProperty[i].showDataLabel)) {
            if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
                this.m_valueTextSeries[this.m_seriesNames[i]].drawValueTextSeries();
            }
        }
    }
};
/** @description drawing Thresholdline on LineChart DAS-951**/
LineChart.prototype.drawThreshold = function() {
	if (IsBoolean(this.m_showyaxisthreshold)) {
		var lineWidth = 0.5;
		var antiAliasing = 0.5;
		var fData = this.m_yAxis.m_yAxisMarkersArray[0] * 1;
		var lData = this.m_yAxis.m_yAxisMarkersArray[this.m_yAxis.m_yAxisMarkersArray.length - 1] * 1;

		var ratio = 1 / (lData - fData);
		var perYPixel = ratio * (this.m_startY * 1 - this.m_endY * 1);

		//&& !IsBoolean(this.m_basezero)
		this.m_minimumyaxisthreshold = (IsBoolean(this.m_minimumyaxisthresholdline)) ?
			this.m_minimumyaxisthreshold : this.m_yAxis.m_yAxisMarkersArray[0];

		var pixelValue = {};
			if (IsBoolean(this.m_autoaxissetup) && IsBoolean(this.m_basezero)) {
			//this.m_maximumyaxisthreshold = this.m_yAxis.m_yAxisMarkersArray[this.m_yAxis.m_yAxisMarkersArray.length-1];
		/*	if ((this.m_minimumyaxisthreshold * 1) <= (this.m_maximumyaxisthreshold * 1)) {*/
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
		/**DAS-1015 */
		this.m_fillcolorarray = [];
		var strokeStyle = hex2rgb(this.m_markercolor, this.m_markertransparency);
		if (IsBoolean(this.m_minimumyaxisthresholdline)) {
			this.drawThresholdLineBetweenPoints(fData,lData,this.m_minimumyaxisthreshold,this.m_yaxisthresholdlinewidth, antiAliasing, this.m_minimumthresholdstrokecolor, pixelValue.x1, pixelValue.y1, pixelValue.x2, pixelValue.y2);
		}
		this.drawThresholdLineBetweenPoints(fData,lData,this.m_minimumyaxisthreshold,this.m_yaxisthresholdlinewidth, antiAliasing, this.m_maximumthresholdstrokecolor, pixelValue.X1, pixelValue.Y1, pixelValue.X2, pixelValue.Y2);
		//this.fillColorBetweenPoints(lineWidth, antiAliasing, "#000000", pixelValue.x1, pixelValue.y1, pixelValue.X2-pixelValue.x1, (pixelValue.Y2-pixelValue.y2));
		this.fillColorBetweenPoints(this.m_fillcolorarray);
	}
};
/** @description y-axis threshold pixel calculation LineChart DAS-951**/
LineChart.prototype.thresholdYAxisCalculation = function(fData , lData , perYPixel) {
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
				this.drawMessage(this.m_status.notValidthresholdValues);
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
				this.drawMessage(this.m_status.notValidthresholdValues);
			}*/

		}
	}
	return pixelMap;
};
/** @description y-axis threshold line drawing in LineChart DAS-951 **/
LineChart.prototype.drawThresholdLineBetweenPoints = function(fdata,ldata,thresholdvalue,lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2, text, textcolor,opacity) {
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.lineWidth = lineWidth;
	this.ctx.translate(antiAliasing, antiAliasing);
	this.ctx.strokeStyle = hex2rgb(strokeColor, opacity);
	var fillcolor = strokeColor;
	/** parseInt() is used to draw Sharp marker lines **/
	this.ctx.moveTo(parseInt(x1), parseInt(y1));
	this.ctx.lineTo(parseInt(x2), parseInt(y2));
	this.ctx.stroke();
	this.ctx.fillStyle = fillcolor;
	// Rotate the context 90 degrees (counterclockwise)
	this.ctx.rotate(-Math.PI / 2);
	//this.ctx.fillText(text, 0, 0);
	this.ctx.restore();
	this.ctx.closePath();
	//points to fill theshold lines
	if(thresholdvalue > fdata && thresholdvalue < ldata){
		var lines = {"X1":x1,"Y1":y1,"X2":x2,"Y2":y2};
		this.m_fillcolorarray.push(lines); 
	}

};
/** @description filling color for threshold range on LineChart chart**/
LineChart.prototype.fillColorBetweenPoints = function(fillColorArray) {
	var fillArray = fillColorArray.sort(function(a, b) {
    return a.Y1 - b.Y1;
	});
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
		/**draw label */
		this.ctx.font = "16px Arial";
		this.ctx.fillStyle = hex2rgb(this.m_BelowThresholdLabelColor,1);
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(this.m_BelowThresholdLabel, centerX, centerY);

		// Fill color between minY and maxY
		var minY2 = minY;
		var maxY2 = maxY;
		var height2 = maxY2 - minY2;
		
		var centerY2 = minY2 + height2 / 2;/*label*/
		this.ctx.fillStyle = hex2rgb(this.m_fillBetweenThreshold, this.m_fillBetweenThresholdOpacity * 1);
		this.ctx.fillRect(minX, minY2, width1, height2);
		/**draw label */
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
		this.ctx.fillStyle = hex2rgb(this.m_fillAboveUpperThreshold, this.m_fillUpperThresholdOpacity * 1);
		this.ctx.fillRect(minX, minY3, width1, height3);
		var centerY3 = minY3 + height3 / 2/*label*/
		// Set the text properties
		this.ctx.font = "16px Arial";
		this.ctx.fillStyle = hex2rgb(this.m_UpperThresholdLabelColor,1);
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(this.m_UpperThresholdLabel, centerX, centerY3);
	}
};
/** @description Setter Method to set ThresholdFillColors. **/
LineChart.prototype.setThresholdFillColors = function() {
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
/** @description Setter method for startX Position. **/
LineChart.prototype.setStartX=function(){
	this.yaxisLabelFont=this.m_yAxis.m_labelfontstyle +" "+ this.m_yAxis.m_labelfontweight +" "+ this.fontScaling(this.m_yAxis.m_labelfontsize) +"px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily) ;
	this.yaxisDescriptionFont=this.m_yAxis.m_fontstyle +" "+ this.m_yAxis.m_fontweight +" "+ this.fontScaling(this.m_yAxis.m_fontsize) +"px " + selectGlobalFont(this.m_yAxis.m_fontfamily) ;
	var btdm = this.getBorderToDescriptionMargin();
	var dm = this.getYAxisDescriptionMargin();
	var dtlm = this.getDescriptionToLabelMargin();
	var ltam = this.getLabelToAxisMargin();
	//this.setMaxMinSeriesValue();
	var lm = this.getYAxisLabelMargin();
	this.m_startX = this.m_x*1 + btdm*1 + dm*1 + dtlm*1 + lm*1 + ltam*1 ;
};

/** @description return  YAxis-Label Margin . **/
LineChart.prototype.getYAxisLabelMargin=function(){
	var lm = 0 ;
	var lfm = this.getLabelFormatterMargin();
	this.setLabelWidth();
	var lw = this.getLabelWidth();
	var lsm = this.getLabelSignMargin();
	var lpm = this.getLabelPrecisionMargin();
	var lsfm = this.getLabelSecondFormatterMargin();
	//console.log( lfm*1 +"="+ lw*1 +"="+ lsm*1 +"="+lpm*1 +"="+ lsfm*1 );
	lm =  lfm*1 + lw*1 + lsm*1 +lpm*1 + lsfm*1 ;
	return lm ;
};

/** @description return  Label Formatter Margin . **/
LineChart.prototype.getLabelFormatterMargin=function(){
	var lfm = 0 ;
	if(!IsBoolean(this.m_fixedlabel)){
		if(IsBoolean(this.m_yAxis.getLeftaxisFormater() )){
			if(this.m_formater != "none" && this.m_formater != "")
			if(this.m_unit != "none" && this.m_unit != ""){
				var unit = this.m_util.getFormatterSymbol(this.m_formater , this.m_unit);
				this.ctx.beginPath();
				this.ctx.font = this.m_yAxis.m_labelfontstyle +" "+ this.m_yAxis.m_labelfontweight +" "+ this.fontScaling(this.m_yAxis.m_labelfontsize) +"px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily) ;
				lfm = this.ctx.measureText(unit).width ;
				this.ctx.closePath();
			}
		}
	}
	return lfm ;
};

/** @description getter method of LabelWidth. **/
LineChart.prototype.getLabelWidth=function(){
	return this.m_labelwidth;
};

/** @description Setter method of LabelWidth. **/
LineChart.prototype.setLabelWidth=function(){
	this.m_labelwidth = 0;
	var maxSeriesVals = [];
	if (this.fontScaling(this.m_yAxis.m_labelfontsize) > 0) {
		for(var i = 0, length = this.m_yAxisMarkersArray.length; i < length; i++ ){
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

/** @description getter method of LabelSignMargin. **/
LineChart.prototype.getLabelSignMargin=function(){
	var lsm = 0 ;
	var msvw=0;
	var minSeriesValue = this.min ;
	if(minSeriesValue <0 ){
		this.ctx.beginPath();
		this.ctx.font = this.m_yAxis.m_labelfontstyle +" "+ this.m_yAxis.m_labelfontweight +" "+ this.fontScaling(this.m_yAxis.m_labelfontsize) +"px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily) ;
		var msvw = this.ctx.measureText(minSeriesValue).width ;
		this.ctx.closePath();
	}

	if(this.getLabelWidth() < msvw )
		lsm = this.ctx.measureText("-").width ;
	return lsm ;
};

/** @description getter method of LabelPrecision Margin. **/
LineChart.prototype.getLabelPrecisionMargin=function(){
	var lpm = 5;
	/**
	 * When axis is set as Auto, min marker is 500M and max marker is 3B, this.m_valueondatapoints = "true";
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

/** @description getter method of LabelSecondFormatter Margin. **/
LineChart.prototype.getLabelSecondFormatterMargin=function(){
	var lsfm = 0 ;
	if(!IsBoolean(this.m_fixedlabel)){
		if(IsBoolean(this.m_yAxis.getLeftaxisFormater() )){
			if(this.getSecondaryFormater() != "none" && this.getSecondaryFormater() != ""){
				if(this.getSecondaryUnit() != "none" && this.getSecondaryUnit() != "" ){
					if( this.getSecondaryUnit() != "auto"){
						var secondunit = this.m_util.getFormatterSymbol(this.getSecondaryFormater() , this.getSecondaryUnit());
					} else if (this.getSecondaryUnit() == "auto" && this.m_unit == "Rupees") {
						var secondunit = getNumberFormattedSymbol(this.max * 1, this.m_unit);
					} else {
						var secondunit = "K";
					}
					this.ctx.font = this.m_yAxis.m_fontstyle +" "+ this.m_yAxis.m_fontweight +" "+ this.fontScaling(this.m_yAxis.m_fontsize) +"px " + selectGlobalFont(this.m_yAxis.m_fontfamily) ;
					lsfm = this.ctx.measureText(secondunit).width ;
				}
			}
		}
	}
	return lsfm ;
};

/** @description getter method of FormatterMargin. **/
LineChart.prototype.getFormatterMargin=function(){
	var unitwidth = 0 ;
	var secondunitwidth = 0 ;
	var precisionMargin = 4 ;
	if(!IsBoolean(this.m_fixedlabel)){
		if(IsBoolean(this.m_yAxis.getLeftaxisFormater() )){
			if(this.m_formater != "none" && this.m_formater != "")
			if(this.m_unit != "" && this.m_unit != "none"){
				var unit = this.m_util.getFormatterSymbol(this.m_formater , this.m_unit);
				unitwidth = this.ctx.measureText(unit).width ;
			}
			if(this.getSecondaryFormater() != "none" && this.getSecondaryFormater() != "")
			if(this.getSecondaryUnit() != "" && this.getSecondaryUnit() != "none"){
				secondunit = this.m_util.getFormatterSymbol(this.getSecondaryFormater() , this.getSecondaryUnit());
				secondunitwidth = this.ctx.measureText(secondunit).width ;
			}
		}
	}
	return ( unitwidth*1 + secondunitwidth*1 +precisionMargin*1);
};

/** @description Setter method of EndX position of Chart. **/
LineChart.prototype.setEndX=function(){
	var blm = this.getBorderToLegendMargin() ;
	var vlm = this.getVerticalLegendMargin() ;
	var vlxm = this.getVerticalLegendToXAxisMargin() ;
	var rightSideMargin = blm*1 + vlm*1 + vlxm*1 ;
	this.m_endX = ( this.m_x *1 + this.m_width *1 - rightSideMargin*1 ) ;
};

/** @description Setter method of StartY position Chart. **/
LineChart.prototype.setStartY=function(){
	var cm = this.getChartMargin() ;
	var xlbm = this.getXAxisLabelMargin() ;
	var xdm = this.getXAxisDescriptionMargin() ;
	var bottomMargin =  cm*1 + xlbm*1 + xdm*1 ;
	this.m_startY = ( this.m_y*1 + this.m_height*1 - bottomMargin*1 ) ;
};

/** @description Getter method of XAxisLabel Margin. **/
LineChart.prototype.getXAxisLabelMargin=function(){
	var xAxislabelDescMargin=this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.8;
	var radians = this.m_xAxis.m_labelrotation * (Math.PI / 180); 
	if(IsBoolean(this.m_xAxis.getLabelTilted())){
		this.ctx.font=this.m_xAxis.getLabelFontWeight()+" "+this.fontScaling(this.m_xAxis.getLabelFontSize())+"px "+this.m_xAxis.getLabelFontFamily();
		//xAxislabelDescMargin=Math.abs(this.ctx.measureText(this.m_categoryData[0][0]).width * radians);
		for(var i = 1, length = this.m_categoryData[0].length; i < length; i++) {
			if(xAxislabelDescMargin<  Math.abs(this.ctx.measureText(this.m_categoryData[0][i]).width * radians))
				xAxislabelDescMargin=Math.abs(this.ctx.measureText(this.m_categoryData[0][i]).width * radians);
		}
		if(xAxislabelDescMargin > this.m_height/4) {
			xAxislabelDescMargin=(this.m_xAxis.getLabelrotation()<=70)?(this.m_height/4-15):this.m_height/4;
		}
	} else {
		this.ctx.font=this.m_xAxis.getLabelFontWeight()+" "+this.fontScaling(this.m_xAxis.getLabelFontSize())+"px "+this.m_xAxis.getLabelFontFamily();
		var xlm = this.fontScaling(this.m_xAxis.m_labelfontsize) * 1.8;
		this.noOfRows=this.setNoOfRows();
		xAxislabelDescMargin = (xlm)*this.noOfRows;
	}
	return xAxislabelDescMargin;
};

/** @description Setter method to set NoOfRows for x-axis labels. **/
LineChart.prototype.setNoOfRows=function(){
	this.ctx.font=this.m_xAxis.m_labelfontstyle +" "+ this.m_xAxis.m_labelfontweight+" " + this.fontScaling(this.m_xAxis.m_labelfontsize) +"px "+selectGlobalFont(this.m_xAxis.m_labelfontfamily);
	var noOfRow=1;
	if(!IsBoolean(this.isEmptyCategory)){
		var textWidth=this.ctx.measureText(this.m_categoryData[0][0]).width;
		var xDivision=(this.getEndX()-this.getStartX())/this.m_categoryData[0].length;
		for(var i = 1, length = this.m_categoryData[0].length; i < length; i++) {
			if(this.ctx.measureText(this.m_categoryData[0][i]).width > xDivision)
				noOfRow=2;
		}
	}
	return noOfRow;
};

/** @description Setter method to set EndY position. **/
LineChart.prototype.setEndY=function(){
	this.m_endY = ( this.m_y*1  +  this.getMarginForTitle()*1 + this.getMarginForSubTitle()*1 + this.getMarginForCurveLine()*1 );
};

/** @description Getter method of MarginForCurveLine. **/
LineChart.prototype.getMarginForCurveLine=function(){
	return ( (this.m_lineform=="curve") ) ? ( this.fontScaling(this.m_subTitle.getFontSize())/2 ) : 0 ;
};

/** @description Getter method for get tooltip Info. **/
LineChart.prototype.getToolTipData=function(mouseX,mouseY){
	var toolTipData;
	if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory) && IsBoolean(this.isVisibleSeries()) && IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")) {
		var isNaNValue;
		var m_plotRadius = 5;
		if(this.m_xPositionArray.length == 1){
			m_plotRadius = this.m_calculation.getOnePartWidth() / 4;
		}else{
			m_plotRadius = this.m_calculation.getOnePartWidth() / 2;
		}
		if((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY())&&(mouseY >= this.getEndY())){
			for(var i = 0, outerLength = this.m_xPositionArray.length; i < outerLength; i++){
				if(mouseX <= (this.m_xPositionArray[i]*1+m_plotRadius) && (mouseX >= this.m_xPositionArray[i]*1-m_plotRadius)){
					toolTipData = {};
					var seriesData=(this.getSeriesData());
					toolTipData.cat = "";
					toolTipData["data"] = new Array();
					toolTipData.cat = this.getCategoryData()[0][i];
					if(this.m_customtextboxfortooltip.dataTipType == "Default"){
						for (var j = 0, k = 0, innerLength = this.getSeriesData().length; j < innerLength; j++) {
							isNaNValue = false;
							var newVal;
							if(IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[j]])){
								var data = [];
								//data[0] = this.getSeriesColors()[j];
								var Color = ((this.m_showpoint !== undefined)&&(this.m_showpoint)) ? this.m_PointsColorsArray[j][i] : this.getColorsForSeries()[j][i];
								data[0] = {"color": Color,"shape":this.legendMap[this.getSeriesNames()[j]].shape};
								data[1] = this.getSeriesDisplayNames()[j];
								if(seriesData[j][i] == "" || isNaN(seriesData[j][i]) || seriesData[j][i] == null || seriesData[j][i] == "null"){
									newVal = seriesData[j][i];
									isNaNValue = true;
								}
								else{
									var num = seriesData[j][i]*1;
									if(num % 1 != 0 && this.m_tooltipprecision !== "default") {
										newVal  = num.toFixed(this.m_tooltipprecision);
									} else {
										newVal =seriesData[j][i] * 1;
									}
								}
								var FormterData = this.getUpdatedFormatterForToolTip( newVal, this.getSeriesNames()[j]) ;
								data[2] = FormterData;
								toolTipData.data[k] = data;
								k++;
							}
						}
						toolTipData.highlightIndex = this.getDrillColor(mouseX,mouseY);
						if (IsBoolean(this.m_controlledtooltip)) {
							toolTipData = this.updateTooltipData(toolTipData);
						}
						break;
					}else{
						toolTipData = this.getDataProvider()[i];
					}
					
				}
			}
						/*DAS-954 Annotation Line Hover Toltip*/
			if (IsBoolean(this.m_showannotation)) {
				for (var j1 = 0; j1 < this.m_annotationXData.length; j1++) {
					if (this.m_annotationXData[j1] != "") {
						var hpoint = Math.round(this.m_annotationXData[j1].xposition * 1);
						if ((mouseX >= hpoint - this.m_annotationradius) && (mouseX <= hpoint + (this.m_annotationradius * 1)) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
							toolTipData = {};
							toolTipData.cat = "";
							toolTipData["data"] = new Array();
							var j1Year = this.getMonthYear(this.m_annotationXData[j1].point.toString());
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
		}
		else{
			this.hideToolTip();
		}
		return toolTipData;
	}
};

/** @description Getter method for getDrillColor. **/
LineChart.prototype.getDrillColor = function(mouseX, mouseY){
	if((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory)))){
		var m_plotRadius = 5 ;
		var RadiusArray = this.getVisibleRadiusArr().RadiusArray;
		if( ( mouseX >= this.getStartX() && mouseX <= this.getEndX() ) && ( mouseY <= this.getStartY() && mouseY >= this.getEndY() ) ){
			for(var i = 0, outerLength = this.m_xPositionArray.length; i < outerLength; i++){
				for(var j = this.m_yPositionArray.length - 1; j >= 0; j--){
					var m_plotRadius = RadiusArray[j];
					if( mouseX <= (this.m_xPositionArray[i]*1+m_plotRadius*1) && mouseX >= (this.m_xPositionArray[i]*1-m_plotRadius*1) ){					
						 if( mouseY <= (this.m_yPositionArray[j][i]*1+m_plotRadius*1) && mouseY >= (this.m_yPositionArray[j][i]*1-m_plotRadius*1)){
							return j;
						 }
					}
				}
			}
		}
	}
};

/** @description Getter method of getDrillDataPoints to get drillInfo. **/
LineChart.prototype.getDrillDataPoints= function(mouseX, mouseY){
	if((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory))) && IsBoolean(this.isVisibleSeries())){
		var m_plotRadius = 5;
		if( ( mouseX >= this.getStartX() && mouseX <= this.getEndX() ) && ( mouseY <= this.getStartY() && mouseY >= this.getEndY() ) ){
			var PointsColorsArray = this.getVisibleRadiusArr().PointsColorsArray;
			var ColorsForSeries = this.getVisibleRadiusArr().ColorsForSeries;
			for(var i = 0, outerLength = this.m_xPositionArray.length; i < outerLength; i++){
				for(var j = this.m_yPositionArray.length - 1; j >= 0; j--){
					m_plotRadius = this.m_plotRadiusArray[j];
					if( mouseX <= (this.m_xPositionArray[i]*1+m_plotRadius*1) && mouseX >= (this.m_xPositionArray[i]*1-m_plotRadius*1) ){					
						 if( mouseY <= (this.m_yPositionArray[j][i]*1+m_plotRadius*1) && mouseY >= (this.m_yPositionArray[j][i]*1-m_plotRadius*1)){
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
									this.initializeCalculation();
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
							var drillColor = ((this.m_showpoint !== undefined)&&(this.m_showpoint)) ? PointsColorsArray[j][i] : ColorsForSeries[j][i];
							var drillField = this.visibleSeriesInfo.seriesName[j];
						    var drillDisplayField = this.visibleSeriesInfo.seriesDisplayName[j];
							var drillValue = fieldNameValueMap[drillField];
							fieldNameValueMap.drillField = drillField;
							fieldNameValueMap.drillDisplayField = drillDisplayField;
							fieldNameValueMap.drillValue = drillValue;
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
};
/***Added to resolve index issue of drill color*/
LineChart.prototype.getVisibleRadiusArr = function (){
	var drillObj = {
		"PointsColorsArray" : [],
		"ColorsForSeries" : [],
		"RadiusArray" : []
	};
	var PointsColorsArray = [];
	var ColorsForSeries = [];
	var RadiusArray = [];
	for (var i = 0; i < this.m_seriesNames.length; i++) {
		if (this.m_seriesVisibleArr[this.m_seriesNames[i]]) {
			PointsColorsArray.push(this.m_PointsColorsArray[i]);
			ColorsForSeries.push(this.getColorsForSeries()[i]);
			RadiusArray.push(this.m_plotRadiusArray[i]);
		}
	}
	drillObj["PointsColorsArray"] = PointsColorsArray;
	drillObj["ColorsForSeries"] = ColorsForSeries;
	drillObj["RadiusArray"] = RadiusArray;
	return drillObj;
}
function LineCalculation(){
	this.startX;
	this.startY;
	this.endX;
	this.endY;

	this.xAxisData =[];
	this.yAxisData = [];
	this.xPositionArray=[];
	this.yPositionArray=[];
	this.m_yAxisMarkersArray=[];
	this.m_numberOfMarkers = 6;
	this.basePoint="";
	this.spaceFromYAxis="";
};

/** @description initialize  LineCalculation and set required properties. **/
LineCalculation.prototype.init=function(lineChart){
	this.m_chart=lineChart;
	this.startX =lineChart.getStartX();
	this.startY = lineChart.getStartY();
	this.endX = lineChart.getEndX();
	this.endY =lineChart.getEndY();

	this.xAxisData = lineChart.getCategoryData()[0];
	this.yAxisData = this.m_chart.visibleSeriesInfo.seriesData ;

	this.setXAxisOnePart();
	this.setEachLinePix();
	this.setXPosition();
	this.setYPosition();
	this.setXPositionTooltipArr();
};

/** @description Setter method for set onepart width on x-axis **/
LineCalculation.prototype.setXAxisOnePart= function(){
	this.onePartWidth = (this.endX-this.startX)/(this.xAxisData.length);
};
/** @description Setter method for set onepart width on x-axis **/
LineCalculation.prototype.setXAxisAnnotationOnePart= function(){
	this.onePartAnnotationWidth = (this.endX-this.startX)/(1);
};

/** @description Setter method for set  EachLinePix . **/
LineCalculation.prototype.setEachLinePix= function(){
	this.eachLinePix = (this.startY*1-this.endY*1)/(this.getMaxValue()-this.getMinValue());
};

/** @description Setter method for set  XPositions Array . **/
LineCalculation.prototype.setXPosition = function(){
	this.xPositionArray=[];
	for(var i = 0, length = this.xAxisData.length; i < length; i++){
		if(this.xAxisData.length == 1){
			this.xPositionArray[i] = (this.startX*1)+(this.endX-this.startX)/2;
		} else {
			this.xPositionArray[i] = this.startX*1 + (this.getOnePartWidth()/2) + (i*this.getOnePartWidth());
		}
	}
};
/** @description Setter method for set Closest Value for X Point annotation . **/
LineCalculation.prototype.findClosestNumber = function(arr, target){
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
};
/** @description Setter method for set Closest Value for X Point annotation . **/
LineCalculation.prototype.checkIndexOfData = function(target){
	var dataIndex=-1;
	var arr = this.m_chart.m_calculation.xAxisData;
  for (var i = 0; i < arr.length; i++) {
	  var dataYear = this.m_chart.getMonthYear(arr[i].toString());
	  if(dataYear.year == target)
	  dataIndex = i;
  }
  return dataIndex;
};
/** @description Setter method for set  XPositions Array . **/
LineCalculation.prototype.getYAnotPosition = function(data){
	return (this.startY*1)-((this.getEachLinePix())*(data-this.getMinValue()));
};

/** @description Setter method for set YPositions Array . **/
LineCalculation.prototype.setYPosition = function(){
	this.basePoint = (this.getMinValue()<0)?this.startY-Math.abs(this.getEachLinePix()*this.getMinValue()):this.startY;
	var yparray = [];
	for(var i = 0, outerLength = this.yAxisData.length; i < outerLength; i++){
		yparray[i] = [];
		for(var j = 0, innerLength = this.yAxisData[i].length; j < innerLength; j++){
			if(this.yAxisData[i][j] === "" || isNaN(this.yAxisData[i][j]) || this.yAxisData[i][j] == null || this.yAxisData[i][j] == "null") {
				yparray[i][j] = "";
			} else {
				yparray[i][j] = (this.startY*1)-((this.getEachLinePix())*(this.yAxisData[i][j]-this.getMinValue()));
			}
		}
	}
	this.yPositionArray=yparray;
};

/** @description Setter method for set XPositions for Tooltip . **/
LineCalculation.prototype.setXPositionTooltipArr = function () {
	this.xPositionTooltipArray = [];
	var onePartWidth = this.getOnePartWidth();
	for(var i = 0, length = this.xAxisData.length; i < length ; i++){
		this.xPositionTooltipArray[i] = this.startX * 1 + (onePartWidth * i + onePartWidth / 2);
	}
};

/** @description Getter method of getMaxValue . **/
LineCalculation.prototype.getMaxValue = function(){
	return this.m_chart.max;
};

/** @description Getter method of getMinValue . **/
LineCalculation.prototype.getMinValue = function(){
	return this.m_chart.min;
};

/** @description Getter method of getYAxisText . **/
LineCalculation.prototype.getYAxisText = function(){
	return this.m_chart.yAxisText;
};

/** @description Getter method of getYAxisMarkersArray . **/
LineCalculation.prototype.getYAxisMarkersArray = function(){
	return this.m_chart.m_yAxisMarkersArray;
};

/** @description Getter method of getOnePartWidth . **/
LineCalculation.prototype.getOnePartWidth= function(){
	return this.onePartWidth;
};

/** @description Getter method of getEachLinePix . **/
LineCalculation.prototype.getEachLinePix= function(){
	return this.eachLinePix;
};

/** @description Getter method of getXPositionTooltip . **/
LineCalculation.prototype.getXPositionTooltip = function () {
	return this.xPositionTooltipArray;
};

/** @description Getter method of getYPosition . **/
LineCalculation.prototype.getYPosition = function () {
	return this.yPositionArray;
};

/** @description Getter method of getXPosition . **/
LineCalculation.prototype.getXPosition = function () {
	return this.xPositionArray;
};

/** @Description LineSeries implementation **/
function LineSeries(){
	this.color;
	this.xPositionArray=[];
	this.yPositionArray=[];
	this.line=[];
	this.ctx="";
	this.m_chart="";
};
/** @description Initialization of LineSeries . **/
LineSeries.prototype.init= function(color,xPositionArray,yPositionArray,m_chart,plotTrasparency,lineWidth,lineType){
	this.m_chart=m_chart;
	this.ctx=this.m_chart.ctx;
	this.color=color;
	this.xPositionArray=xPositionArray;
	this.yPositionArray=yPositionArray;
	this.lineWidth = lineWidth;
	this.lineType = lineType;

	this.m_plotTrasparency= plotTrasparency;
	for(var i = 0, length = this.xPositionArray.length; i < length; i++){
		this.line[i] = new Line();
		if(this.xPositionArray[i] != "" && this.yPositionArray[i] != "") {
			if(i==0){
				this.line[i].init(this.color[i],this.xPositionArray[i],this.yPositionArray[i],this.xPositionArray[i],this.yPositionArray[i],this.m_chart,this.m_plotTrasparency,this.lineWidth,this.lineType);
			}
			else{
				this.line[i].init(this.color[i],this.xPositionArray[i-1],this.yPositionArray[i-1],this.xPositionArray[i],this.yPositionArray[i],this.m_chart,this.m_plotTrasparency,this.lineWidth,this.lineType);
			}
		}
	}
};

/** @description check the point isInRange.will decide point need to draw or not **/
LineSeries.prototype.isInRange = function(i) {
    if (!IsBoolean(this.m_chart.m_continuousline)) {
        if (i == 0) {
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
    }
    /*BDD-837 Added below condition for plotting continuous line when data is discontinuous*/
    else {
        if (i == 0) {
            if (this.yPositionArray[i] == "" || this.yPositionArray[i] == null || isNaN(this.yPositionArray[i])) {
                this.line[i].init(this.color[i], this.xPositionArray[i + 1], this.yPositionArray[i + 1], this.xPositionArray[i + 1], this.yPositionArray[i + 1], this.m_chart, this.m_plotTrasparency, this.lineWidth, this.m_chart.getLineType(this.lineType));
            } else if (this.yPositionArray[i] > this.m_chart.getStartY() || this.yPositionArray[i] < this.m_chart.getEndY())
                return true;
            else
                return false;
        } else {
            if (this.yPositionArray[i] == "" || this.yPositionArray[i] == null || isNaN(this.yPositionArray[i])) {
                //for start x & start y 
                var count = 0;
                var count1 = 0;
                for (var a = i - 1; a >= 0; a--) {
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
                if ((this.yPositionArray[count] == "" || this.yPositionArray[count] == null || isNaN(this.yPositionArray[count])) || count1 == 0)
                    return true;
                else
                    this.line[i].init(this.color[i], this.xPositionArray[count], this.yPositionArray[count], this.xPositionArray[count1], this.yPositionArray[count1], this.m_chart, this.m_plotTrasparency, this.lineWidth, this.m_chart.getLineType(this.lineType));
            } else if (this.yPositionArray[i - 1] == "" || this.yPositionArray[i - 1] == null || isNaN(this.yPositionArray[i - 1])) {
                this.line[i].init(this.color[i], this.xPositionArray[i], this.yPositionArray[i], this.xPositionArray[i], this.yPositionArray[i], this.m_chart, this.m_plotTrasparency, this.lineWidth, this.m_chart.getLineType(this.lineType));
            } else if(Math.floor(this.yPositionArray[i-1]) > Math.ceil(this.m_chart.getStartY()) || Math.ceil(this.yPositionArray[i-1]) < Math.floor(this.m_chart.getEndY()) || Math.floor(this.yPositionArray[i]) > Math.ceil(this.m_chart.getStartY()) || Math.ceil(this.yPositionArray[i]) < Math.floor(this.m_chart.getEndY()))
    			return true;
    		else
    			return false;
        }
    }
};

/** @description will draw LineSeries **/
LineSeries.prototype.drawLineSeries= function(){
	if(this.m_chart.getLineForm() === "curve" && this.xPositionArray.length >= 2){
		var pts = [];
		var count = 0;
		pts[count] = [];
		var pts1=[];
		var flag=0;
		pts1[flag] = [];
		var lineDashArray = this.getLineDashArray(this.lineType, this.lineWidth);
		var lineDashArray1 = this.getLineDashArray(this.m_chart.getLineType(this.lineType), this.lineWidth);
		    for (var i = 0, length = this.xPositionArray.length; i < length; i++) {
		        if (this.xPositionArray[i] != null && this.xPositionArray[i] != "" && this.yPositionArray[i] != null && this.yPositionArray[i] != "" && this.yPositionArray[i] <= this.m_chart.getStartY() && this.yPositionArray[i] >= this.m_chart.getEndY()) {
		            pts[count].push(this.xPositionArray[i]);
		            pts[count].push(this.yPositionArray[i]);
		        } else{
		        	count++;
		        	pts[count] = [];
		        }
		        if(IsBoolean(this.m_chart.m_continuousline) && !IsBoolean(this.xPositionArray[i] != null && this.xPositionArray[i] != "" && this.yPositionArray[i] != null && this.yPositionArray[i] != "" && this.yPositionArray[i] <= this.m_chart.getStartY() && this.yPositionArray[i] >= this.m_chart.getEndY())) {
		        	//for start x & start y 
	                var counta = 0;
	                var countb = 0;
	                for (var a = i - 1; a >= 0; a--) {
	                    if (this.yPositionArray[a] == "" || this.yPositionArray[a] == null || isNaN(this.yPositionArray[a])) {
	                        //do nothing
	                    } else {
	                        counta = a;
	                        break;
	                    }
	                }
	                //for end x & end y
	                for (var b = i + 1; b <= this.xPositionArray.length; b++) {
	                    if (this.yPositionArray[b] == "" || this.yPositionArray[b] == null || isNaN(this.yPositionArray[b])) {
	                        //do nothing
	                    } else {
	                        countb = b;
	                        break;
	                    }
	                }
	                if((this.yPositionArray[counta] == "" || this.yPositionArray[counta] == null || isNaN(this.yPositionArray[counta])) || countb == 0){
	                	//do nothing
	                }
	                else{
	                pts1[flag].push(this.xPositionArray[counta]);
		            pts1[flag].push(this.yPositionArray[counta]);
		            pts1[flag].push(this.xPositionArray[countb]);
		            pts1[flag].push(this.yPositionArray[countb]);
		            flag++;
		            pts1[flag] = [];
	                }
		        }
		    }/*BDD-837 Added "m_continuousline" condition for plotting continuous line when data is discontinuous*/
		for(var j = 0; j <= count; j++){
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
		for(var k = 0; k <= flag; k++){
			if(pts1[k].length>0){
				this.ctx.beginPath();
				this.ctx.save();
				this.ctx.lineWidth = this.lineWidth;
				this.ctx.strokeStyle = hex2rgb(this.color[j],this.m_plotTrasparency);
				this.ctx.moveTo(pts1[k][0], pts1[k][1]);
				this.ctx.curve(pts1[k], 0.5, 25, this);
				if (this.lineWidth > 0) {
					this.ctx.setLineDash(lineDashArray1);
					this.ctx.stroke();	
				}
				this.ctx.restore();
				this.ctx.closePath();
			}
		}
	} else {
		for(var i = 0, length1 = this.xPositionArray.length; i < length1; i++){
			if(!this.isInRange(i))
				this.line[i].drawLine();
		}
	}
};
/** @description Get line dash array **/
LineSeries.prototype.getLineDashArray = function(lineType, lineWidth) {
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
function PointSeries(){
	this.color;
	this.radius;
	this.xPositionArray=[];
	this.yPositionArray=[];
	this.point=[];
	this.ctx="";
	this.m_chart="";
	};

/** @description initialization of PointSeries. **/
PointSeries.prototype.init= function(color,radius,xPositionArray,yPositionArray,m_chart,plotTrasparencyArray,plotTypeArray,plotRadiusArray,yseriesData,valueondatapoints){
	this.m_chart=m_chart;
	this.ctx=this.m_chart.ctx;
	this.color=color;
	this.m_chart=m_chart;
	this.radius=radius;
	this.xPositionArray=xPositionArray;
	this.yPositionArray=yPositionArray;
	this.m_plotTrasparency=plotTrasparencyArray;
	this.m_plotType=plotTypeArray;
	this.m_plotRadius=plotRadiusArray;
	
	for(var i = 0, length = this.xPositionArray.length; i < length; i++){
		this.point[i] = new Point();
		this.point[i].init(this.color[i],this.radius,this.xPositionArray[i],this.yPositionArray[i],this.ctx,this,this.m_plotTrasparency[i],this.m_plotType,this.m_plotRadius);
	}
};

/** @description check Points in range or not. **/
PointSeries.prototype.isInRange= function(i){
	if(this.yPositionArray[i] > this.m_chart.getStartY() || this.yPositionArray[i] <= this.m_chart.getEndY() - 0.1)// -0.1 bucause of yposition data outof chart area, but point(drawpoint) is the maximum value and ratio*current value negligible difference between calculated point with the endY so we can substract sum minner value to arrenge the drawing.
		return true;
	else
		return false;
};

/** @description will draw PointSeries for those which is in Range. **/
PointSeries.prototype.drawPointSeries= function(){
	for(var i = 0, length = this.xPositionArray.length; i < length; i++){
		if(!this.isInRange(i))
			this.point[i].drawPoint();
	}	
};
/**@description methid to initiliaze Annotation cacluations and other functions */
function AnnotationSeries(){
	this.color;
	this.radius;
	this.xPositionArray=[];
	this.yPositionArray=[];
	this.point=[];
	this.ctx="";
	this.m_chart="";
	};
/** @description initialization of AnnotationSeries. **/
AnnotationSeries.prototype.init= function(color,radius,xPositionArray,yPositionArray,m_chart,plotTrasparencyArray,plotTypeArray,plotRadiusArray,yseriesData,valueondatapoints){
	this.m_chart=m_chart;
	this.ctx=this.m_chart.ctx;
	this.color=color;
	this.m_chart=m_chart;
	this.radius=radius;
	this.xPositionArray=xPositionArray;
	this.yPositionArray=yPositionArray;
	this.m_plotTrasparency=plotTrasparencyArray;
	this.m_plotType=plotTypeArray;
	this.m_plotRadius=plotRadiusArray;
	/**Y Axis points based Annotation */
	var annotationdata = this.m_chart.m_annotationData;
	var count=0;
	if(IsBoolean(this.m_chart.m_showyannotation)){
		for(j=0;j<annotationdata.length;j++){
		for(var i = 0, length = this.xPositionArray.length; i < length; i++){
		this.point[count] = new Point();
		var antcolor = (IsBoolean(this.m_chart.m_annotationseriescolor)) ? this.color[i] : this.m_chart.m_annotationcolor;
		var radius = this.m_chart.m_annotationradius;
		var transp= this.m_chart.m_annotationopacity;
		var shapeType= this.m_chart.m_annotationshape;
		var plotRadius= this.m_chart.m_annotationradius;
		this.point[count].init(antcolor,plotRadius,this.xPositionArray[i],this.m_chart.m_calculation.getYAnotPosition(annotationdata[j].point),this.ctx,this,transp,shapeType,plotRadius);
		if(!this.isInRange(i))
		this.point[count].drawPoint();
		count++;
		}
		}
	}
	/**Category points based Line Annotation */
	var yearDrawn = {};
	var monthDrawn = [{"month":0,"year":0}];
	var count = 0;
	var xplotdata = this.m_chart.m_annotationXData;
	for (var j = 0; j < xplotdata.length; j++) {
		if (xplotdata[j].point === "" || xplotdata[j].point == null || xplotdata[j].point == "null" || xplotdata[j].point == "NULL" || xplotdata[j].point == "Null") {
			xplotdata[j] = "";
		}
		if (xplotdata[j] != "") {
			/**check date format in dataset (mm/dd/yyyy, mm-dd-yyyy, dd/mm/yyyy, or dd-mm-yyyy) */
			var regex = /^(0[1-9]|1[0-2])[-/.](0[1-9]|[12][0-9]|3[01])[-/.](\d{4})$|^(0[1-9]|[12][0-9]|3[01])[-/.](0[1-9]|1[0-2])[-/.](\d{4})$/;;
			// Test if the date string matches the pattern
			var dateStr = xplotdata[j].point.toString();
			var datesplit = dateStr.match(regex);
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
						var xannotationData = this.m_chart.m_calculation.findClosestNumber(this.m_chart.m_calculation.xAxisData, year);
						var xdataindex = xannotationData['closestIndex'];
						var xdataclst = xannotationData['closest'];
						var yearFraction = (month - 1) / 12;
						var nextclosestData;
						var xPlotDiff;
						var partPerc;
						var nextYearDiff;
						if (this.m_chart.m_calculation.xAxisData.length > 1) {
							nextclosestData = (year - xdataclst >= 0) ? this.m_chart.m_calculation.xAxisData[xdataindex + 1] : this.m_chart.m_calculation.xAxisData[xdataindex - 1];
							xPlotDiff = Math.abs(xdataclst - year) + yearFraction;
							nextYearDiff = Math.abs(nextclosestData - xdataclst);
							partPerc = xPlotDiff / nextYearDiff * 100;
						} else if (this.m_chart.m_calculation.xAxisData.length == 1 && year === xdataclst) {
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
						var xannotationData = this.m_chart.m_calculation.findClosestNumber(this.m_chart.m_calculation.xAxisData, year);
						var xdataindex = xannotationData['closestIndex'];
						var xdataclst = xannotationData['closest'];
						var nextclosestData;
						var xPlotDiff;
						var partPerc;

						if (this.m_chart.m_calculation.xAxisData.length == 1 && year === xdataclst) {
							// If there is only one data point and year is equal to it
							nextclosestData = xdataclst;
							xPlotDiff = 0;
							partPerc = 0;
						} else {
							// If there are multiple data points, calculate nextclosestData
							nextclosestData = ((year - xdataclst >= 0) ? this.m_chart.m_calculation.xAxisData[xdataindex + 1] : this.m_chart.m_calculation.xAxisData[xdataindex - 1]) || 0;
							xPlotDiff = (xdataclst > year) ? (xdataclst - year) : (year - xdataclst);
							partPerc = (nextclosestData == xdataclst) ? 0 : xPlotDiff / (nextclosestData - xdataclst) * 100;
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
				var xdataindex = this.m_chart.m_calculation.xAxisData.indexOf(xplotdata[j].point);
				var xPlotDiff = 0;
				var partPerc = 0;
			} else {
				/** check if annotation plot format is year/month/day */
				if (!yearDrawn[xplotdata[j].point]) {
					yearDrawn[xplotdata[j].point] = true;
					var xannotationData = this.m_chart.m_calculation.findClosestNumber(this.m_chart.m_calculation.xAxisData, xplotdata[j].point);
					var xdataindex = xannotationData['closestIndex'];
					var xdataclst = xannotationData['closest'];
					var nextclosestData = ((xplotdata[j].point - xdataclst >= 0) ? this.m_chart.m_calculation.xAxisData[xdataindex + 1] : this.m_chart.m_calculation.xAxisData[xdataindex - 1]) || 0;

					var xPlotDiff = (xdataclst > xplotdata[j].point) ? (xdataclst - xplotdata[j].point) : (xplotdata[j].point - xdataclst);
					var partPerc = (nextclosestData == xdataclst) ? 0 : (xPlotDiff / (nextclosestData - xdataclst) * 100);
				} else {
					nextclosestData = 0;
					xPlotDiff = 0;
					partPerc = NaN;
				}
			}
			var xannotaionPosition = xPositionArray[xdataindex] + this.m_chart.m_calculation.getOnePartWidth() * partPerc / 100;
			/**get all yaxis points fromthe all series */
			var antcolor = (IsBoolean(this.m_chart.m_annotationseriescolor)) ? this.color[i] : this.m_chart.m_annotationcolor;
			var radius = this.m_chart.m_annotationradius;
			var transp = this.m_chart.m_annotationopacity;
			var text = xplotdata[j].label;
			var textColor = this.m_chart.m_annotationtextcolor;
			/*
			var yPostionArrayAll = Array.from(new Set(this.m_chart.m_yPositionArray.flat(1)));
			var yPostionArrayAll = yPostionArrayAll.sort((a, b) => a - b); // Sort in ascending order
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
			var pointYear = this.m_chart.getMonthYear(xplotdata[j].point.toString());
			var dataIndex= this.m_chart.m_calculation.checkIndexOfData(pointYear.year);
			if(dataIndex != -1)
			{
			/**Add xposition to annotation array for tooltip */
			this.m_chart.m_annotationXData[j].xposition = xannotaionPosition;
			this.drawLineBetweenPoints(radius, 0.5, antcolor, xannotaionPosition, this.m_chart.getStartY(), xannotaionPosition, this.m_chart.getEndY(), text, textColor, transp);
			}
		}
	}
};
/**@desc to get month date and year from datestrint */
LineChart.prototype.getMonthYear = function(dateStr){
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
	} else if (dateStr.match(/^\d{4}$/)) {
		year = dateStr;
	}
	dateadta['mon']=month;
	dateadta['day']=day;
	dateadta['year']=year;
	
	return dateadta;
};
AnnotationSeries.prototype.drawLineBetweenPoints = function(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2, text, textcolor, opacity) {
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.lineWidth = lineWidth;
	this.ctx.translate(antiAliasing, antiAliasing);
	this.ctx.strokeStyle = hex2rgb(strokeColor, opacity);
	/**@desc [dash length, gap length] */
	if(IsBoolean(this.m_chart.m_linetype)){
	this.ctx.setLineDash([5, 5]);
	}
	/** parseInt() is used to draw Sharp marker lines **/
	this.ctx.moveTo(parseInt(x1), parseInt(y1));
	this.ctx.lineTo(parseInt(x2), parseInt(y2));
	this.ctx.stroke();
	this.ctx.restore();
	this.ctx.closePath();

};
/** @description check Annotations point in range or not. **/
AnnotationSeries.prototype.isInRange= function(i){
	if(this.yPositionArray[i] > this.m_chart.getStartY() || this.yPositionArray[i] <= this.m_chart.getEndY() - 0.1)// -0.1 bucause of yposition data outof chart area, but point(drawpoint) is the maximum value and ratio*current value negligible difference between calculated point with the endY so we can substract sum minner value to arrenge the drawing.
		return true;
	else
		return false;
};
/** @description will draw Annotation points for those which is in Range. **/
AnnotationSeries.prototype.drawPointSeries= function(){
	for(var i = 0, length = this.xPositionArray.length; i < length; i++){
		/*if(!this.isInRange(i))
		this.point[i].drawPoint();
		*/
	}	
};
//# sourceURL=LineChart.js