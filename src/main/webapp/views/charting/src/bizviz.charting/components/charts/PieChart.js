/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: PieChart.js
 * @description PieChart
 **/
function PieChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();
	this.m_x = 400;
	this.m_y = 240;
	this.m_width = 300;
	this.m_height = 240;
	this.m_radius = 0;
	this.m_centerX = 0;
	this.m_centerY = 0;
	this.m_aggregation = "";
	this.m_charttype = "Pie";
	this.m_chartbase = "plane";
	this.m_linewidth = 40;
	this.m_categoryNames = [];
	this.m_seriesNames = [];
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_maxdatalabel = 10;
	this.m_mindatalabelpercentage = 5;
	this.m_startAngle = [];
	this.m_endAngle = [];
	this.m_slice = [];
	this.m_xaxis = null;
	this.m_yAxis = new Yaxis();
	this.m_calculation = new Piecalculation();
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_percentageInnerCutout = 0;
	this.m_isCategoryAvailable = true;
	this.m_luminance = 0.5;

	/* *slice label property**/
	this.m_showslicevalue = "false";
	this.m_slicelimit = "false";
	this.m_noofslices = "5";	
	this.m_slicefontsize = "12";
	this.m_slicelabelfontfamily = "Roboto";
	this.m_slicelabelfontweight = "normal";
	this.m_slicelabelfontstyle = "normal";

	this.m_globalFontSize = 0;
	this.m_slicelabelfontsize = "";
	this.noOfTextOutSide = 0;
	this.m_originalRadius = 0;
	this.m_maxtooltiprows = 10;
	this.m_isSpaceForTextDrawing = true;
	this.calculatedPercent = [];
	this.m_percentlabelposition = 75;
	this.m_seriesDataLabel = [];
    this.m_seriesDataLabelProperty = [];
    this.m_enableanimation = "false";
    this.m_pieanimationduration = 0.5;
    this.m_slicingdistance = 5;
    this.m_strokelinewidth = 1;
    this.m_datalabelmarkerlength = 10;
	this.m_canvastype = "svg";
	this.m_otherslicescollapse = false;
	
	this.m_enablehundredpercentsum = true;
	this.m_enablePercentForTooltip = true;
	this.m_drilltoggle = true;
	this.m_actualvalues = "false";
};
/** @description Making prototype of chart class to inherit its properties and methods into PieChart chart **/
PieChart.prototype = new Chart();

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
PieChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description  initialization of draggable div and its inner Content **/
PieChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();

	$("#draggableCanvas" + this.m_objectid).hide();
	this.createSVG();
	/*this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEventForSVG(this.svgContainerId);
	if (this.m_canvastype === "canvas") {
		this.removeSVG();
		this.initMouseMoveEvent(this.m_chartContainer);
		this.initMouseClickEvent();
	} else {
	}*/
};

/** @description createSVG Method used for create SVG element for Chart and Scale **/
PieChart.prototype.createSVG = function() {
	var temp = this;
	$("#draggableSvgDiv" + this.m_objectid).remove();
	var draggableSvgDiv = document.createElement("div");
	draggableSvgDiv.id = "draggableSvgDiv" + this.m_objectid;
	draggableSvgDiv.style.height = this.m_height + "px";
	draggableSvgDiv.style.width = this.m_width + "px";
	this.m_draggableDiv.appendChild(draggableSvgDiv);
	this.paper = Raphael("draggableSvgDiv" + this.m_objectid, this.m_width, this.m_height);
	this.svgContainerId = "svgContainer" + this.m_objectid;
	this.paper.canvas.setAttribute("id", this.svgContainerId);
	this.paper.canvas.setAttribute("class", "svg_chart_container");
};
/** @description removeSVG method removes the already present svg **/
PieChart.prototype.removeSVG = function() {
	var temp = this;
	$("#" + temp.svgContainerId).remove();
};
/** @description This method will parse the chart JSON and create a container **/
PieChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description This method will set class variable values with JSON values **/
PieChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.ParsePropertyJsonAttributes(jsonObject, nodeObject);
};
/** @description Making prototype of Title and SubTitle according to canvas or svg**/
PieChart.prototype.updateSvgClassRef = function() {
/*	if (this.m_canvastype === "canvas") {
		this.m_title = new Title(this);
		this.m_subTitle = new SubTitle();
	} else {*/
		this.m_title = new svgTitle(this);
		this.m_subTitle = new svgSubTitle();
	//}
};
/** @description Iterate through chart JSON and set class variable values with JSON values **/
PieChart.prototype.ParsePropertyJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	this.updateSvgClassRef();
	for (var key in jsonObject) {
		if (key == "Chart") {
			for (var chartKey in jsonObject[key]) {
				switch (chartKey) {
				case "xAxis":
				case "yAxis":
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
	/**To support existing dashboard for BDD-733*/
	if(jsonObject["showSliceValue"] !== undefined){
		nodeObject["m_showslicevalue"] = jsonObject["showSliceValue"];
	}
	if(jsonObject["sliceLimit"] !== undefined){
		nodeObject["m_slicelimit"] = jsonObject["sliceLimit"];
	}
};

/** @description Getter Method of DataProvider **/
PieChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description Getter Method of FieldsJson **/
PieChart.prototype.getFieldsJson = function () {
	return this.m_fieldsJson;
};

/** @description Setter Method of Fields according to fieldType **/
PieChart.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	/*for(var i=0;i<fieldsJson.length;i++)
	{
		if(IsBoolean(fieldsJson[i].visible))
			this.m_fieldsJson.push(fieldsJson[i])
	}*/
	var categoryJson = [];
	var seriesJson = [];
	for (var i = 0, length = this.m_fieldsJson.length; i < length; i++) {
		var fieldType = this.getProperAttributeNameValue(this.m_fieldsJson[i], "Type");
		switch (fieldType) {
		case "Category":
			categoryJson.push(this.m_fieldsJson[i]);
			break;
		case "Series":
			seriesJson.push(this.m_fieldsJson[i]);
			break;
		case "CalculatedField":
			seriesJson.push(this.m_fieldsJson[i]);
			break;
		default:
			break;
		}
	}
	/**Added to resolve when multiple series drop in Category and first one visible is false*/
	if ((categoryJson.length > 0) && IsBoolean(categoryJson[0].visible)) {
		this.m_isCategoryAvailable = true;
		this.setCategory(categoryJson);
	}else if (categoryJson.length >1){
		for(var i = 1; categoryJson.length >i ; i++){
			if(IsBoolean(categoryJson[i].visible)){
				this.m_isCategoryAvailable = true;
				this.setCategory(categoryJson);
				break;
			}else{
				this.m_isCategoryAvailable = false;
			}
		}
	} else {
		this.m_isCategoryAvailable = false;
	}
	this.setSeries(seriesJson);
};

/** @description Setter Method of Category iterate for all category. **/
PieChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	this.m_allCategoryNames = [];
	this.m_allCategoryDisplayNames = [];
	this.m_allCategoryFieldsColorForAction = [];
	this.m_categoryVisibleArr = {};
	var count = 0;
	// only one category can be set for pie chart, preference to first one
	for (var i = 0, length = categoryJson.length; i < length; i++) {
		this.m_allCategoryNames[i] = this.getProperAttributeNameValue(categoryJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(categoryJson[i], "DisplayName"));
		this.m_allCategoryDisplayNames[i] = m_formattedDisplayName;
		this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]] = this.getProperAttributeNameValue(categoryJson[i], "visible");
		if (IsBoolean(this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]])) {
			this.m_categoryNames[count] = this.getProperAttributeNameValue(categoryJson[i], "Name");
			this.m_categoryDisplayNames[count] = m_formattedDisplayName;
			this.m_allCategoryFieldsColorForAction[count] = this.getProperAttributeNameValue(categoryJson[i], "Color");
			count++;
		}
	}
};

/** @description creating array for each property of fields and storing in arrays **/
PieChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = [];
	this.m_legendNames = [];
	this.m_seriesVisibleArr = {};
	this.m_allSeriesDisplayNames = [];
	this.m_allSeriesNames = [];
	var count = 0;
	this.legendMap = {};
	for (var i = 0, length = seriesJson.length; i < length; i++) {
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
			    if(IsBoolean(this.m_showslicevalue)){
			    	this.m_seriesDataLabelProperty[count].datalabelField =  this.m_seriesNames[count];
			    }else{
			    	if(IsBoolean(this.m_seriesDataLabelProperty[count].dataLabelUseComponentFormater)){
				    	this.m_seriesDataLabelProperty[count].datalabelFormaterCurrency = this.m_unit;
				    	this.m_seriesDataLabelProperty[count].datalabelFormaterPrecision = this.m_precision;
				    	this.m_seriesDataLabelProperty[count].datalabelFormaterPosition = this.m_signposition;
				    	this.m_seriesDataLabelProperty[count].datalabelFormaterUnit = this.m_secondaryunit;
				    }
			    }
			} else {
			    this.m_seriesDataLabelProperty[count] = this.getDataLabelProperties();
			}
			var tempMap = {
				"seriesName" : this.m_seriesNames[count],
				"displayName" : this.m_seriesDisplayNames[count],
				"color" : this.m_seriesColors[count],
				"shape" : "piechart",
				"index": count
			};
			this.legendMap[this.m_seriesNames[count]] = tempMap;
			count++;
		}
	}
};

/** @description Getter Method of SeriesColors. **/
PieChart.prototype.getSeriesColors = function () {
	return this.getColors();
};
/** @description Getter Method of LegendInfo . **/
PieChart.prototype.getLegendInfo = function () {
	return this.legendMap;
};
/** @description Getter Method of AllSeriesNames. **/
PieChart.prototype.getAllSeriesNames = function () {
	return this.m_allSeriesNames;
};
/** @description Getter for All Category names**/
PieChart.prototype.getAllCategoryNames = function () {
	return this.m_allCategoryNames;
};
/** @description Setter Method of LegendNames. **/
PieChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};
/** @description Getter Method of LegendNames. **/
PieChart.prototype.getLegendNames = function () {
	return this.m_categoryData[0];
};
/** @description Getter Method of Category Names. **/
PieChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};
/** @description Getter Method of Category DisplayName. **/
PieChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};
/** @description Getter Method of SeriesNames. **/
PieChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};
/** @description Getter Method of Series DisplayName. **/
PieChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};
/** @description Getter for Category Colors**/
PieChart.prototype.getCategoryColorsForAction = function () {
	return this.m_allCategoryFieldsColorForAction;
};
/** @description Getter for Series Colors**/
PieChart.prototype.getSeriesColorsForAction = function () {
	return this.m_seriesColors;
};
/** @description Setter Method of Category Data. **/
PieChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	for (var i = 0, length = this.getCategoryNames().length; i < length; i++) {
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
};
/** @description Setter Method of Series Data. **/
PieChart.prototype.setSeriesDataLabel = function() {
    this.maxtextwidth = [];
    var length = (IsBoolean(this.m_limitedslicesdisable)) ? this.getSeriesNames().length : this.m_seriesDataLabel.length;
    for (var i = 0; i < length; i++) {
    	if (IsBoolean(this.m_limitedslicesdisable)) {
            this.m_seriesDataLabel[i] = this.getDataFromJSON(this.m_seriesDataLabelProperty[i].datalabelField);
    	}
        if (!IsBoolean(this.m_showslicevalue)) {
            this.m_seriesDataLabel[i] = this.calculateFormatter(this.m_seriesDataLabel[i], this.m_seriesDataLabelProperty[i]);
            this.maxtextwidth[i] = this.calculatemaxtextwidth(this.m_seriesDataLabel[i]);
        } else {
            this.maxtextwidth[i] = this.getTextWidth("99 %");
        }
    }
};

/** @description Setter Method of Series Data Label when there is no category.**/
PieChart.prototype.setRowWiseDataLabel = function() {
    if (!IsBoolean(this.m_limitedslicesdisable) && !IsBoolean(this.m_showslicevalue)) {
        var length = this.m_seriesDataLabel[0].length;
        for (var i = 0; i < length; i++) {
            this.m_seriesDataLabel[0][i] = this.getFormattedText(this.m_seriesDataLabel[0][i], this.m_seriesDataLabelProperty[0][i]);
        }
    }
};

/** @description Calculate formatter for each field.**/
PieChart.prototype.calculateFormatter = function(seriesDataLabel, seriesDataLabelProperty) {
    for (var j = 0, length = seriesDataLabel.length; j < length; j++) {
        seriesDataLabel[j] = this.getFormattedText(seriesDataLabel[j], seriesDataLabelProperty);
    }
    return seriesDataLabel;
};

/** @description Calculate maximum text width.**/
PieChart.prototype.calculatemaxtextwidth = function(seriesDataLabel) {
    var maxtextwidth = "";
    var MaxTextWidth = [];
    for (var j = 0, length = seriesDataLabel.length; j < length; j++) {
        MaxTextWidth[j] = this.getTextWidth(seriesDataLabel[j]);
    }
    maxtextwidth = Math.max.apply(null, MaxTextWidth);
    return maxtextwidth;
};
/** @description Getter Method of Series Data. **/
PieChart.prototype.getSeriesDataLabel = function() {
    return this.m_seriesDataLabel;
};
/** @description Getter Method of Category Data. **/
PieChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};
/** @description Setter Method of Series Data. **/
PieChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0, length = this.getSeriesNames().length; i < length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
};
/** @description Getter Method of Series Data. **/
PieChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

/** @description This Method manage the slice according to the limit with it's color and set Series Data, Category Data. **/
PieChart.prototype.manageSliceData = function() {
	this.m_limitedslicesdisable = true;
    if (IsBoolean(this.m_slicelimit) && this.m_noofslices != "") {
        if (this.m_noofslices < this.m_categoryData[0].length) {
        	this.m_sorteddataarr = [];
        	this.m_limitedslicesdisable = false;
        	this.m_seriesDataLabel = [];
            this.remainingData = {};/***Map for tool tip Others*/
            var data = "";
            if (this.m_noofslices == 1) {
                data = this.sortDataInDescOrder(this.m_seriesData[0], this.m_categoryData[0], this.m_noofslices);
                this.m_seriesDataLabel[0] = IsBoolean(this.m_showslicevalue) ? getDuplicateArray(this.m_seriesData[0]) : [data.seriesDataSum];
                this.m_seriesData[0] = [data.seriesDataSum];
                this.m_categoryData[0] = ["Sum"];
            } else {
                data = this.sortDataInDescOrder(this.m_seriesData[0], this.m_categoryData[0], this.m_noofslices);
                var categoryName = "Others";
                this.m_sorteddataarr = data.DataMapArray;
                for (var i = 0, length = this.m_sorteddataarr.length; i < length; i++) {
                    this.m_categoryData[0][i] = data.DataMapArray[i].categoryData;
                    this.m_seriesData[0][i] = data.DataMapArray[i].seriesData;
                }
                this.remainingData = data.remainingData;
                /*if (IsBoolean(this.allCategoryValuesSame(this.m_noofslices - 1, this.m_categoryData[0]))) {
                    this.remainingData[this.m_categoryData[0][this.m_noofslices - 1]] = data.seriesDataSum;
                }*/
                var newCategory = [];
                var newSeries = [];
                for (var j = 0, length1 = this.m_noofslices - 1; j < length1; j++) {
                    newCategory.push(this.m_categoryData[0][j]);
                    newSeries.push(this.m_seriesData[0][j]);
                }
                newCategory.push(categoryName);
                newSeries.push(data.seriesDataSum);
                this.m_seriesData[0] = newSeries;
                this.m_seriesDataLabel[0] = getDuplicateArray(newSeries);
                this.m_categoryData[0] = newCategory;
            }
        }
    }
};
/** @description Getter Method of Original Category Data. **/
PieChart.prototype.getOriginalCategoryData = function () {
	this.m_originalCategoryData = [];
	for (var i = 0, length = this.getCategoryNames().length; i < length; i++) {
		this.m_originalCategoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
	return this.m_originalCategoryData;
};

/** @description Setter Method of All FieldsName. **/
PieChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0, len = this.getAllCategoryNames().length; i < len; i++) {
		this.m_allfieldsName.push(this.getAllCategoryNames()[i]);
	}
	for (var j = 0, length = this.getAllSeriesNames().length; j < length; j++) {
		this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
	}
};

/** @description Getter Method of All FieldsName. **/
PieChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

/** @description Setter Method for set All Fields DisplayName. **/
PieChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0, len = this.getCategoryDisplayNames().length; i < len; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0, length = this.getSeriesDisplayNames().length; j < length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

/** @description Getter Method of All FieldsDisplayName. **/
PieChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

/** @description This Method map the series value according to category. **/
PieChart.prototype.mapSeriesWithCategory = function () {
	if (this.getSeriesData().length > 0) {
		var category = this.m_categoryData[0];
		var series = this.getSeriesData()[0];
		var colors = this.getColors();
		var flag = true;
		if(this.m_defaultlegendfields && !IsBoolean(this.m_designMode)) {
			for(var k = 0; k < this.m_defaultlegendfields.length; k++) {
					flag = this.m_defaultlegendfields[k].value;
					if(flag == false) {
						break;
					}
				}
		}
		for (var i = 0, len = category.length; i < len; i++) {
			if (this.m_seriesVisibleArr[category[i]] == undefined)
				this.m_seriesVisibleArr[category[i]] = flag;
			else {}
		}
		var DataProvider = [];
		var SeriesNames = [];
		this.visibleCategories = [];
		this.visibleSeries = [];
		this.visibleSeriesColors = [];
		this.m_visibledataprovider = [];
		this.m_visibleseriesnames = [];
		this.legendMap = {};
		DataProvider = this.getDataProvider();
		SeriesNames = this.getSeriesNames();
		for (var k = 0, i = 0, length =  category.length; i < length; i++) {
			if (this.m_seriesVisibleArr[category[i]]) {
				this.visibleCategories[k] = category[i];
				this.visibleSeries[k] = series[i];
				this.visibleSeriesColors[k] = colors[i];
				this.m_visibledataprovider[k] = DataProvider[i];
				this.m_visibleseriesnames[k] = SeriesNames[i];
				k++;
			}
			var tempMap = {
				"seriesName" : category[i],
				"displayName" : category[i],
				"color" : colors[i],
				"shape" : "piechart"
			};
			this.legendMap[category[i]] = tempMap;
		}
	}
};

/** @description Getter Method of All VisibleSeries. **/
PieChart.prototype.getVisibleSeries = function () {
	return this.visibleSeries;
};

/** @description Getter Method of All VisibleCategory. **/
PieChart.prototype.getVisibleCategory = function () {
	return this.visibleCategories;
};

/** @description Getter Method of All VisibleSeriesColor. **/
PieChart.prototype.getVisibleSeriesColor = function () {
	return this.visibleSeriesColors;
};

/** @description Setter Method of All Row Wise FieldsData. **/
PieChart.prototype.setRowWiseFieldsData = function () {
	var fieldsJson = this.getFieldsJson();
	this.m_categoryNames[0] = "category";
	this.m_seriesNames[0] = "values";
	var cdata = [];
	var cDisplayData = [];
	var sdatalabelproperty = [];
	this.m_seriesDataLabel = [];
    this.maxtextwidth = [];
	var k = 0;
	for (var i = 0, length = fieldsJson.length; i < length; i++) {
		if(IsBoolean(fieldsJson[i].visible) && fieldsJson[i].Type === "Series"){
			cdata[k] = this.getProperAttributeNameValue(fieldsJson[i], "Name");
			var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(fieldsJson[i], "DisplayName"));
			cDisplayData[k] = m_formattedDisplayName;
			sdatalabelproperty[k] = this.getProperAttributeNameValue(fieldsJson[i], "DataLabelCustomProperties");
			k++;
		}
	}
	this.m_categoryData[0] = cDisplayData;

	this.m_seriesData = [];
	var sdata = [];
	var sdatalabel = [];
    
	for (var j = 0, outerLength = this.getDataProvider().length; j < outerLength; j++) {
		if (j == 0) {
			for (var key in cdata) {
				if(cdata.hasOwnProperty(key)){
					for (var k = 0, innerLength = cdata.length; k < innerLength; k++)
					if (cdata[k] == cdata[key]){
						sdata.push(this.getDataProvider()[j][cdata[key]]);
					}
						var datalabelField = (sdatalabelproperty[key].datalabelField === "")? cdata[key] : sdatalabelproperty[key].datalabelField;
						sdatalabel.push(this.getDataProvider()[j][datalabelField]);
						if(!IsBoolean(this.m_showslicevalue)){
							if (IsBoolean(sdatalabelproperty[key].dataLabelUseComponentFormater)) {
							    sdatalabelproperty[key].datalabelFormaterCurrency = this.m_unit;
							    sdatalabelproperty[key].datalabelFormaterPrecision = this.m_precision;
							    sdatalabelproperty[key].datalabelFormaterPosition = this.m_signposition;
							    sdatalabelproperty[key].datalabelFormaterUnit = this.m_secondaryunit;
							}
							if (IsBoolean(sdatalabel[key])) {
							    sdatalabel[key] = this.getFormattedText(sdatalabel[key], sdatalabelproperty[key]);
							}
						}
				}
			}
		}
	}
	this.m_seriesData[0] = sdata;
	this.m_seriesDataLabel[0] = sdatalabel;
    if (!IsBoolean(this.m_showslicevalue)) {
        this.maxtextwidth[0] = this.calculatemaxtextwidth(this.m_seriesDataLabel[0]);
    } else {
        this.maxtextwidth[0] = this.getTextWidth("99 %");
    }
    this.m_seriesDataLabelProperty[0] = sdatalabelproperty;
};


/** @description Setter Method of All FieldsName For Unavailable Category. **/
PieChart.prototype.setAllFieldsNameForUnavailableCategory = function () {
	this.m_allfieldsName = [];
	for (var j = 0, length = this.getAllSeriesNames().length; j < length; j++) {
		this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
	}
};

/** @description Setter Method of All FieldsDisplayName For Unavailable Category. **/
PieChart.prototype.setAllFieldsDisplayNameForUnavailableCategory = function () {
	this.m_allfieldsDisplayName = [];
	for (var j = 0, length = this.m_seriesNames.length; j < length; j++) {
		this.m_allfieldsDisplayName.push(this.m_seriesDisplayNames[j]);
	}
};

/****************************************************************************/
/** @description initialization of PieChart. **/
PieChart.prototype.init = function() {
	this.createSVG();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEventForSVG(this.svgContainerId);
    if (this.m_isCategoryAvailable) {
        this.setCategoryData();
        this.setSeriesData();
        this.manageSliceData();
        this.setSeriesDataLabel();
        this.setAllFieldsName();
        this.setAllFieldsDisplayName();
        this.mapSeriesWithCategory();
    } else {
        this.setRowWiseFieldsData();
        this.manageSliceData();
        this.setRowWiseDataLabel();
        this.setAllFieldsNameForUnavailableCategory();
        this.setAllFieldsDisplayNameForUnavailableCategory();
        this.mapSeriesWithCategory();
    }
    this.isSeriesDataEmpty();
    this.m_chartFrame.init(this);
    this.m_title.init(this);
    this.m_subTitle.init(this);

    if (!IsBoolean(this.m_isEmptySeries)) {
        this.initializeCalculation();
        this.setSlice();
    }
    /**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};
/** @description initialize the calculation  of the PieChart. **/
PieChart.prototype.initializeCalculation = function () {
	var seriesdata = this.updateSeriesData(this.visibleSeries);
	this.m_calculation.init(this, seriesdata);
	this.m_yAxis.init(this, this.m_calculation);
	this.m_xmlColor = this.m_seriescolor.split(",");
};

/** @description This method update Series data for calculation of the PieChart. **/
PieChart.prototype.updateSeriesData = function (data) {
	var arr = [];
	this.m_displaySeriesDataFlag = [];
	var str;
	for (var i = 0, length = data.length; i < length; i++) {
		var temp = 0;
		this.m_displaySeriesDataFlag[i] = true;
		if (isNaN(data[i])) {
			this.m_displaySeriesDataFlag[i] = false;
			str = getNumericComparableValue(data[i]);
			if (isNaN(str))
				arr.push(temp);
			else
				arr.push(str);
		} else
			arr.push(data[i]);
	}
	return arr;
};

/** @description Setter Method of every slice calculation. **/
PieChart.prototype.setSlice = function () {
	var _seriesColor = this.getVisibleSeriesColor();
	this.m_startAngle = this.m_calculation.getStartAngle();
	this.m_endAngle = this.m_calculation.getEndAngle();
	//this.m_strokecolor = "#ffffff";/**Stroke color has been added to provide color stroke line in simple pie chart with base type plain */
	this.m_strkelinewidth = 2;/**Stroke line has been added to provide a stroke between two slices in simple pie chart with base type plain */
	this.m_strokeangle = 0.0349066; /**Stroke Angle has been added to provide a border between slices this is in radian and it is equivalent to 2° */
	this.checkNoOfSlices();
	//	this.m_radius=this.m_calculation.radiusCalc();
	//	this.m_centerX=this.m_calculation.centerXCalc();
	//	this.m_centerY=this.m_calculation.centerYCalc();
	//var manageCalulationForTextDrawin = (this.m_isCategoryAvailable) ? this.m_seriesDataLabelProperty[0].showDataLabel : this.showDataLabelCheck();
	//this.m_radius = (IsBoolean(manageCalulationForTextDrawin)) ? this.manageCalulationForTextDrawing() : this.radius;
	if(IsBoolean(this.m_seriesDataLabelProperty[0].showDataLabel) || (this.m_seriesDataLabelProperty[0][0] && IsBoolean(this.m_seriesDataLabelProperty[0][0].showDataLabel))){
		this.m_radius = (this.m_height > 150) ? (this.radius - (this.m_datalabelmarkerlength + 10)) : this.radius; // 20 for data labels
	} else {
		this.m_radius = this.radius;
	}
	
	this.m_centerX = this.centerX;
	this.m_centerY = this.centerY;
	this.m_slice = [];
	for (var count = 0, length = this.getVisibleSeries().length; count < length; count++) {
		this.m_slice[count] = new Slice();
		this.m_slice[count].init(this.m_centerX, this.m_centerY, this.m_radius, this.m_startAngle[count], this.m_endAngle[count], _seriesColor[count], this.ctx, this.m_chartbase, this.m_luminance, this, this.m_strkelinewidth, this.m_strokecolor, this.m_strokeangle);
	}
};
/** @description This Method checks that any field contain show data label true or not**/
PieChart.prototype.showDataLabelCheck = function(){
	var datalabelflag = false;
	for(var i = 0, length = this.m_seriesDataLabelProperty[0].length;  length > i; i++) {
		if(IsBoolean((this.m_seriesDataLabelProperty[0][i]!== "") && (this.m_seriesDataLabelProperty[0][i].showDataLabel))){
			datalabelflag = true;
			break;
		}
	}return datalabelflag;
};
/** @description This Method manage calculation For TextDrawing. **/
PieChart.prototype.manageCalulationForTextDrawing = function () {
	this.m_originalRadius = this.radius;
	this.m_isSpaceForTextDrawing = true;
	if (this.m_charttype == "Pie") {
		this.m_globalFontSize = (this.radius * 1) / 10;
	} else {
		this.m_globalFontSize = (this.m_charttype == "SemiDoughnut") ? (this.radius * 1 + this.m_linewidth / 2) / 15 : (this.radius * 1 + this.m_linewidth / 2) / 10;
	}
	this.m_slicelabelfontsize = (this.m_slicefontsize == "") ? this.fontScaling(this.m_globalFontSize) : this.fontScaling(this.m_slicefontsize);
	this.m_oldRadius=this.radius;
	if (IsBoolean(this.isMarkOutsideOfSlice())) {
		if (this.m_charttype == "Pie") {
			this.m_radius = this.radius - ((this.radius * this.noOfTextOutSide) / 8 + this.maxtextwidth[0]); //three lines  r there so 12.5% means radius/8 and text width will be minus from radius
		} else {
			this.radius = this.radius * 1 + this.m_linewidth / 2 - (this.radius + this.m_linewidth / 2) * this.noOfTextOutSide / 8 - this.maxtextwidth[0]; //left margin to the maximum height of outer Line of Pie (this.radius*1-this.radius*3/10)
			this.m_radius = this.radius;
		}
		if(this.m_radius<0) {
			this.m_isSpaceForTextDrawing = false;
			this.m_radius = this.m_oldRadius;
		}
	} else {
		this.m_radius = this.radius;
		// reducing radius by 20 for data label drawing
		return (this.m_radius - 20);
	}
	return this.m_radius;
};

/** @description This Method manage Mark Outside of Slice value. **/
PieChart.prototype.isMarkOutsideOfSlice = function () {
	this.noOfTextOutSide = 0;
	var flag = false;
	for (var i = 0 , length = this.getCategoryData()[0].length; i < length; i++) {
		var lineWidth = ((this.m_charttype == "Pie") ? this.m_originalRadius : this.m_linewidth);
		var startAngle = this.m_startAngle[i];
		var endAngle = this.m_endAngle[i];
		var radius = ((this.m_charttype == "Pie") ? this.m_originalRadius : this.m_linewidth);
		var distance = this.calCulateDistanceBetweenTwoPoints(radius, (endAngle * 1 - startAngle * 1));
		if (this.maxtextwidth[0] > (distance) || this.maxtextwidth[0] > lineWidth) {
			flag = true;
			this.noOfTextOutSide++;
		}
	}
	this.noOfTextOutSide = (this.noOfTextOutSide > 3) ? 3 : this.noOfTextOutSide % 4;
	return flag;
};
/** @description this Method will return number of slices in pie **/
PieChart.prototype.checkNoOfSlices = function () {
	var count = 0;
	for (var i = 0, length = (this.getCategoryData()[0].length); i < length; i++) {
		if (this.m_seriesVisibleArr[this.getCategoryData()[0][i]]) {
			/**Added to resolve when categories are more then one but drawable slice is only one*/
			var data = getNumericComparableValue(this.getSeriesData()[0][i]);
			if(!isNaN(data) && (data*1 !== 0)){
				count += 1; 
			}
		}
	}
	this.m_isOneSlice = (count > 1) ? false : true;
};
/*************************************************************************/

/** @description Drawing of chart started by drawing different parts of chart like ChartFrame,Title,SubTitle. **/
PieChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	//this.initMouseClickEventForSVG("draggableSvgDiv" + this.m_objectid);
	var sum = this.getArraySUM(this.getVisibleSeries());
	if (!IsBoolean(this.m_isEmptySeries)&&(sum !== 0)&&(!isNaN(sum))) {
		if (this.getVisibleSeries().length > 0) {
			this.angleDiff = [];
			if (this.m_charttype != "Pie") {
				this.drawPieDoughnutChart();
			} else {
				this.drawPieChart();
			}
			if(this.m_height > 150) {
				this.drawDataLabels();
			}
			//if(IsBoolean(this.m_isSpaceForTextDrawing))
			//	this.drawValueOnSlices();
		} else {
			this.drawSVGMessage("No visible Series Available");
		}
	} else {
		this.drawSVGMessage(this.m_status.noData);
	}
};

/** @description overrite drawObject Method  because of ChartFrame and Titles are drawn on SVG  when no dataset **/
PieChart.prototype.drawObject = function () {
	this.drawSVGObject();
};
/** @description will draw the ChartFrame  of the AreaChart. **/
PieChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawSVGFrame();
};

/** @description Will Draw Title on canvas if showTitle set to true. **/
PieChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

/** @description Will Draw SubTitle on canvas if showSubTitle set to true. **/
PieChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

/** @description Will Draw PieChart on canvas for visibleSeries. **/
PieChart.prototype.drawPieChart = function () {
	//this.drawGradientOnArc();
	this.drawSlices();
};

/** @description Will Draw draw Gradient in PieChart on canvas. **/
PieChart.prototype.drawGradientOnArc = function () {
	if (this.m_chartbase != "plane") {
		this.ctx.beginPath();
		this.ctx.save();
		this.ctx.shadowColor = "#BCBDC8";
		this.ctx.shadowBlur = 8;
		//this.ctx.shadowOffsetX = 3;
		//this.ctx.shadowOffsetY = 3;
		this.ctx.fillStyle = "#dcdcff";
		this.ctx.arc(this.m_centerX, this.m_centerY, this.m_radius, 0, Math.PI * 2, false);
		this.ctx.fill();
		this.ctx.closePath();
		this.ctx.restore();
	}
};

/** @description Will Draw Slices on canvas for visibleSeries. **/
PieChart.prototype.drawSlices = function () {
	if (this.getCategoryData()[0] !== "") {
		for (var k = 0, count = 0, length = (this.getCategoryData()[0].length); count < length; count++) {
			if (this.m_seriesVisibleArr[this.getCategoryData()[0][count]]) {
				if (this.m_slice[k]) {
					this.m_slice[k].draw(k);
					/**Added to improve appearance, commented to remove gradient drawing of pie chart **/
					/*if((this.m_charttype == "Pie") && (this.m_chartbase == "plane")){
						this.m_slice[k].draw(k);
					}else{
						this.m_slice[k].drawPieGradient();
					}*/
				}
				k++;
			}
		}
	}
};

/** @description Will draw data lables for visibleSeries. **/
PieChart.prototype.drawDataLabels = function () {
	this.m_datalabelproperty = {};
	var h = 0;
	var k = 0;
	var maxount = 0;
	for (var i = 0, length = this.getVisibleCategory().length; i < length; i++) {
		if(maxount < this.m_maxdatalabel){
		var j = (i - 1);
	    if (IsBoolean(this.m_isCategoryAvailable)) {
	        this.m_datalabelproperty = this.m_seriesDataLabelProperty[0];
	    } else {
	        this.m_datalabelproperty = this.m_datalabelproperties[i];
	    }
	    var text = this.m_dataLabelsValues[i];
	    var fontProperties = this.m_datalabelproperty;
	    /**DAS-957 */
	    var comapareDataLabel = (IsBoolean(this.m_showslicevalue)) ? text : getNumericComparableValue(this.m_seriesData[0][i]);
	    text = (IsBoolean(fontProperties.hideDataLabel) && comapareDataLabel == fontProperties.hideDataLabelText )? ""  : text;
	    text = (IsBoolean(this.m_showslicevalue) && (text == 0)) ? "" : text;
	    if(IsBoolean(this.m_showslicevalue)){
			text = (text > this.m_mindatalabelpercentage) ? text : "";
		}
	    /**DAS-956**/
	   	//text = (IsBoolean(this.m_showslicevalue) && text !== "" && text > this.m_mindatalabelpercentage)? text + "%" : "";
	    if(text !== ""){
			if (IsBoolean(this.m_showslicevalue)) {
	            text = text + "%";
	        }
	        maxount++;
		    var tx = this.m_centerX + ((this.m_datalabelmarkerlength + 10 + this.m_radius) * Math.cos(this.angleDiff[i])); // text path
		    var ty = this.m_centerY + ((this.m_datalabelmarkerlength + 10 + this.m_radius) * Math.sin(this.angleDiff[i]));
		    var lx = this.m_centerX + ((this.m_radius) * Math.cos(this.angleDiff[i])); // line paths
		    var ly = this.m_centerY + ((this.m_radius) * Math.sin(this.angleDiff[i]));
		    var lx1 = this.m_centerX + ((this.m_datalabelmarkerlength + this.m_radius) * Math.cos(this.angleDiff[i]));
		    var ly1 = this.m_centerY + ((this.m_datalabelmarkerlength + this.m_radius) * Math.sin(this.angleDiff[i]));
		    var lx2,ly2;
		    var path1 = null;
		    var line = null;
		    var line1 = null;
		    
		    this.ctx.font = fontProperties.datalabelFontStyle + " " + fontProperties.datalabelFontWeight + " " +
            fontProperties.dataLabelFontSize + "px " + selectGlobalFont(fontProperties.datalabelFontFamily);
	    	var size = this.ctx.measureText(text);
	    	var objText = this.textXpositionCalculation(tx, size, text);
	    	tx = objText.xPos;
	    	text = objText.Text;
	    	var ySpace = Number(fontProperties.dataLabelFontSize);
	    	var xLength = 30;
	    	var textGap = Number(fontProperties.dataLabelFontSize);
	    	/**DAS-150:datalabel overlapping**/
	    	if (IsBoolean(this.m_updateddesign)) {
	    	    if (i == 1)
	    	        var lj1 = this.m_centerY + ((this.m_datalabelmarkerlength + this.m_radius) * Math.sin(this.angleDiff[j]));

	    	    if (lx < lx1) {
	    	        h++;
	    	        lx2 = lx1 + xLength;
	    	        tx = lx2 + (size.width/2) + 5;
	    	        if (ly1 < lj1 + ySpace && (h != 1)) {
	    	            ly1 = lj1 + ySpace;
	    	        }
	    	        lj1 = ly1;
	    	    } else if (lx > lx1) {
	    	        k++;	
	    	        lx2 = lx1 - xLength;
	    	        tx = lx2 - (size.width/2) - 5;
	    	        if (ly1 > lj1 - ySpace && (k != 1)) {
	    	            ly1 = lj1 - ySpace;
	    	        }
	    	        lj1 = ly1;
	    	    } else {
	    	        lx2 = lx1 + xLength;
	    	        tx = lx2 + textGap;
	    	    }
	    	    ty = ly1;
	    	    ly2 = ly1;
	    	}
	if(IsBoolean(tx+size.width>this.m_width)){
				lx2 = lx1;
	    	    tx = lx2 + (size.width/2) + 5;
			}else if(IsBoolean(tx-size.width<this.m_x)){
				lx2 = lx1;
	    	    tx = lx2 - (size.width/2) - 5;
			}
		    if (IsBoolean(fontProperties.showDataLabel) && (text !== "")) {
		    	line = this.paper.path( ["M", lx, ly, "L", lx1, ly1 ] );
		    	line1 = this.paper.path( ["M", lx1, ly1, "L", lx2, ly2 ] );
		    	line.id = "line"+ i;
		    	line1.id = "linex"+ i;
		    	line.attr({
		    		"stroke": this.m_slice[i].m_color
		        });
		    	if (IsBoolean(this.m_updateddesign)) {
		    	    line1.attr({
		    	        "stroke": this.m_slice[i].m_color
		    	    });
		    	}
		    	/** start render rectangle for data label **/
				if(IsBoolean(fontProperties.datalabelBackgroundRect) && (text !== "")){
					this.m_datalablebackgroundrect = IsBoolean(fontProperties.datalabelBackgroundRect) ? true : this.m_datalablebackgroundrect;
		        path1 = this.paper.text(tx, ty, text);
		        path1.attr({
		            "font-size": fontProperties.dataLabelFontSize,
		            "font-family": selectGlobalFont(fontProperties.datalabelFontFamily),
		            "font-style": fontProperties.datalabelFontStyle,
		            "font-weight": fontProperties.datalabelFontWeight,
		            "fill": fontProperties.dataLabelFontColor
		        });
				 /*path1.attr({
					 "fill": "rgba(0,0,0,0)"
				 });*/
				var bbox = path1.getBBox();
				var width = bbox.width;
				var height = bbox.height;
				/*var rect = this.paper.rect(tx-width*3/4, ty-height*3/4,width*3/2, height*3/2, 2);*/
				var rect = this.paper.rect(tx-width/2-5, ty-height*3/4, width + 10, height + 10, 2);
				rect.id = "rect" + i;
				/** set background color for rect **/
				rect.attr({
		    		"fill": fontProperties.datalabelBackgroundRectColor,
					"stroke": fontProperties.datalabelStrokeColor
		        });
				}
				/** end render rectangle for data label **/
		        path1 = this.paper.text(tx, ty, text);
		        path1.id = "text"+ i;
		        path1.attr({
		            "font-size": fontProperties.dataLabelFontSize,
		            "font-family": selectGlobalFont(fontProperties.datalabelFontFamily),
		            "font-style": fontProperties.datalabelFontStyle,
		            "font-weight": fontProperties.datalabelFontWeight,
		            "fill": fontProperties.dataLabelFontColor
		        });
		    }
	    }
	    }
	}
};
/**@description Recalculate X-position to avoid text overlap from axis**/
PieChart.prototype.textXpositionCalculation = function(tx, size, text) {
    var textWidth = size.width / 2 ;
    var Diff;
    var startX = this.m_x;
    var endX = this.m_width;
    if ((endX - startX) < size.width) {
        return {"xPos" : tx, "Text" : ""};
    } else if (tx - textWidth < startX) {
        Diff = Math.abs(textWidth - (tx - startX));
        return {"xPos" : tx + Diff + 5, "Text" : text};
    } else if (tx + textWidth > endX) {
        Diff = Math.abs(textWidth - (endX - tx));
        return {"xPos" : tx - Diff -5 , "Text" : text};
    } else {
    	return {"xPos" : tx, "Text" : text};
    } 
};

/** @description Will Draw Value On Slices for visibleSeries. **/
PieChart.prototype.drawValueOnSlices = function () {
		var datalabel = this.m_seriesDataLabel[0];
		this.m_datalabelproperty = {};
		this.counter = 0;
		for (var i = 0, length = this.getVisibleCategory().length; i < length; i++) {
			if(IsBoolean(this.m_isCategoryAvailable)){
				this.m_datalabelproperty = this.m_seriesDataLabelProperty[0];
			}else{
				this.m_datalabelproperty = this.m_seriesDataLabelProperty[0][i];
			}
			if (this.m_seriesData[0][i] != "" && datalabel[i] != 0) {
				var lineWidth = ((this.m_charttype == "Pie") ? this.m_radius : this.m_linewidth);
				var centerX = this.m_slice[i].m_centerX;
				var centerY = this.m_slice[i].m_centerY;
				var startAngle = this.m_slice[i].m_startAngle;
				var endAngle = this.m_slice[i].m_endAngle;
				var radius = ((this.m_charttype == "Pie") ? this.m_radius : this.m_linewidth);
				var angle = ((endAngle * 1 - startAngle * 1) / 2 + startAngle);
				var distance = this.calCulateDistanceBetweenTwoPoints(radius, (endAngle * 1 - startAngle * 1));
				if(IsBoolean(this.m_showslicevalue)){
					datalabel[i] = datalabel[i] + "%";
				}
				if(IsBoolean(this.m_datalabelproperty.showDataLabel)){
					if (this.maxtextwidth[0] > (distance) || this.maxtextwidth[0] > lineWidth) {
						this.checkLastSeries(datalabel, i);
						this.drawStraightLineToSlice(angle, centerX, centerY, this.counter, (datalabel[i])); //outerLine
						this.counter++;
					} else {
						this.drawTextOnSlice(angle, centerX, centerY, (datalabel[i]), this.m_slicelabelfontsize);
					}
				}
			}
		}
};

/**Added to apply formatter on the data label*/
PieChart.prototype.getFormattedText = function(value, datalabelproperty) {
    if (!isNaN(getNumericComparableValue(value))) {
        // added check for value is number or not otherwise return same string value
        var isCommaSeparated = (("" + value).indexOf(",") > 0) ? true : false;
        var signPosition = (datalabelproperty.datalabelFormaterPosition != "") ? datalabelproperty.datalabelFormaterPosition : "suffix";
        var precision = datalabelproperty.datalabelFormaterPrecision;
        var unit = datalabelproperty.datalabelFormaterCurrency;
        var secondUnit = datalabelproperty.datalabelFormaterUnit;
        var formatter = "Currency";
        var secondFormatter = "Number";
        var valueToBeFormatted = (precision === "default") ?
            (getNumericComparableValue(value) * 1) :
            (getNumericComparableValue(value) * 1).toFixed(precision);
        if (unit != "") {
            var formatterSymbol = this.m_util.getFormatterSymbol(formatter, unit);
            var secondFormatterSymbol = this.m_util.getFormatterSymbol(secondFormatter, secondUnit);
            /* To Add Number formatter */
            if (secondFormatterSymbol == "auto") {
                value = getNumericComparableValue(value);
                var symbol = getNumberFormattedSymbol(value * 1, unit);
                var val = getNumberFormattedNumericValue(value * 1, precision, unit);
                var text = this.m_util.updateTextWithFormatter(val, "", precision);
                valueToBeFormatted = this.m_util.addFormatter(text, symbol, "suffix");
            } else {
                var unitSymbol = secondFormatterSymbol;
                valueToBeFormatted = this.m_util.updateTextWithFormatter(valueToBeFormatted, unitSymbol, precision);
                if (secondFormatterSymbol != "none" && secondFormatterSymbol != "" && secondFormatterSymbol != "") {
                    valueToBeFormatted = this.m_util.addFormatter(valueToBeFormatted, secondFormatterSymbol, "suffix");
                }
            }
            /* To add Currency formatter */
            valueToBeFormatted = (valueToBeFormatted == "NaN" || valueToBeFormatted === "") ? "" : this.m_util.addFormatter(getFormattedNumberWithCommas(valueToBeFormatted, this.m_numberformatter), formatterSymbol, signPosition);
            return valueToBeFormatted;
        } else {
            return (valueToBeFormatted == "NaN") ? value : valueToBeFormatted;
        }
    } else {
        return value;
    }
};
/** @Description Getter method of Colors For Slice. **/
PieChart.prototype.getColors = function () {
	var series = this.getSeriesData()[0];
	if (IsBoolean(this.m_isCategoryAvailable) && series != undefined) {
		var colors = this.m_seriescolor.split(",");
		if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && this.getCategoryColors().getCategoryColor().length > 0 && IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName())) {
			colors = this.getCategoryColors().getCategoryColorsForCategoryNames(this.getCategoryData()[0], this.m_allCategoryFieldsColorForAction);
		}
		if (series && colors.length < series.length) {
			for (var i = colors.length, count = 0; i < series.length; i++, count++) {
				colors[i] = colors[count];
			}
		}
	} else {
		if (this.m_seriesVisibleArr == undefined)
			this.m_seriesVisibleArr = [];
		var colors = [];
		var k = 0;
		var fieldsJson = this.getFieldsJson();
		for (var i = 0, length = fieldsJson.length; i < length; i++) {
			if(IsBoolean(fieldsJson[i].visible)){
				colors[k] = this.getProperAttributeNameValue(fieldsJson[i], "Color");
				k++;
			}
		}
	}
	return colors;
};

/** @Description This method checking Text Drawing OutSide of Slice. **/
PieChart.prototype.isTextDrawingOutSide = function () {
	if (IsBoolean(this.m_showslicevalue)) {
		if (IsBoolean(this.isMarkOutsideOfSlice()))
			return true;
		else
			return false;
	}
	return false;
};

/** @Description This method check all CategoryValues are Same or not. **/
PieChart.prototype.allCategoryValuesSame = function (startPoint, catdata) {
	if (catdata[startPoint] != undefined) {
		for (var i = startPoint, length = catdata.length; i < length; i++) {
			if (catdata[i] !== catdata[startPoint])
				return false;
		}
		return true;
	} else {
		return false;
	}
};

/** @Description This method sort Data In DescOrder for series and category. **/
PieChart.prototype.sortDataInDescOrder = function(m_seriesData, m_categoryData, noOfSlice) {
    var seriesData = m_seriesData;
    var categoryData = m_categoryData;
    var swapped;
    var currentData = ""; 
    var lastData = "";
    var DataMapArray = [];
    var ObjDataMap = {};
    var DataArryNumeric = [];
    var worstDataArray = [];
    var fladremainingData = false;
    var remainingData = {};
    var seriesDataSum = 0;
    for (var i = 0, length = seriesData.length; i < length; i++) {
        currentData = getNumericComparableValue(seriesData[i]) * 1;
        if (isNaN(currentData) || (seriesData[i] === "")) {
            ObjDataMap = {
                "categoryData": categoryData[i],
                "index": i,
                "seriesData": seriesData[i],
                "value": seriesData[i]
            };
            worstDataArray.push(ObjDataMap);/**Array contains all type of garbage data*/
        } else {
            ObjDataMap = {
                "categoryData": categoryData[i],
                "index": i,
                "seriesData": seriesData[i],
                "value": currentData/**Data without comma for sorting and summation*/
            };
            DataMapArray.push(ObjDataMap);/***Array Object contains key value pairs of series and category data but only valid numeric data*/
        }
    }
    /**Added for sorting operation on valid data*/
    DataMapArray.sort(function(obj1, obj2) {
        return obj2["value"] - obj1["value"];
    });
    for (var j = 0, length = worstDataArray.length; j < length; j++) {
        DataMapArray.push(worstDataArray[j]);/**Push worst data after sorting at last index values*/
    }
    for (var k = noOfSlice - 1, length = DataMapArray.length; k < length; k++) {
		remainingData[DataMapArray[k].categoryData+"-"+DataMapArray[k].index] = DataMapArray[k].seriesData;
		currentData = isNaN(DataMapArray[k].value) ? 0 : DataMapArray[k].value;
		seriesDataSum += currentData;
	}

    return {
        "DataMapArray": DataMapArray,
        "seriesDataSum": seriesDataSum,
        "remainingData": remainingData
    };
};

/** @Description This method calculate Distance Between Two Points. **/
PieChart.prototype.calCulateDistanceBetweenTwoPoints = function (R, A) {
	var deg = A * 180 / Math.PI;
	return (2 * Math.PI * R) * (deg / 360);
};

/** @description: This method will update the percent array to make the sum as 100, If all values are zero it will not draw any value on slice. **/
PieChart.prototype.calculatePercent = function () {
	var percent = this.getCalculatedPercent();
	var isAllZero = true;
	for(var i = 0, length = percent.length; i < length; i++){
		if(percent[i] != 0)
			isAllZero = false;
	}
	try{
		if( !isAllZero )
			percent = this.getRoundValue(percent, 100);
	}catch(e){
		console.log("error in calculating percent labels !");
	}
	return percent;
};

/** @description Getter Method of All CalculatedPercent value. **/
PieChart.prototype.getCalculatedPercent = function () {
	return this.calculatedPercent;
};
/** @description Setter Method of Calculate Percent of series. **/
PieChart.prototype.setCalculatedPercent = function () {
	var Total = 0;
	var TotalDataLabel = 0;
	for (var i = 0, length = (this.getCategoryData()[0].length); i < length; i++) {
		if (this.m_seriesVisibleArr[this.getCategoryData()[0][i]]) {
			var val = getNumericComparableValue(this.m_seriesData[0][i]);
			if( !isNaN(val) ){
				Total += Math.abs(val*1);
				if(IsBoolean(this.m_showslicevalue)){
					var valDataLabel = getNumericComparableValue(this.m_seriesDataLabel[0][i]);
					if(!isNaN(valDataLabel)){
						TotalDataLabel += Math.abs(valDataLabel*1);
					}
				}
			}
		}
	}
	var percent = [];
	var percentDataLabel = [];
	this.m_dataLabelsValues = [];
	this.m_datalabelproperties = [];
	for (var i = 0, len = (this.getCategoryData()[0].length); i < len; i++) {
		if (this.m_seriesVisibleArr[this.getCategoryData()[0][i]]) {
			var val = getNumericComparableValue(this.m_seriesData[0][i]);
				var valData = (!isNaN(val) && ((val*1)!==0)) ? this.m_seriesDataLabel[0][i] : "";
				var perc = ( !isNaN(val * 100 / Total) ) ? val * 100 / Total : 0 ;
				percent.push(Math.abs(perc));
				this.m_dataLabelsValues.push(valData);
				this.m_datalabelproperties.push(this.m_seriesDataLabelProperty[0][i]);
				if(IsBoolean(this.m_showslicevalue)){
					var valDataLabel =(valData === "") ? "" : getNumericComparableValue(valData);
					var percDataLabel = ( !isNaN(valDataLabel * 100 / TotalDataLabel) ) ? valDataLabel * 100 / TotalDataLabel : 0 ;
					percentDataLabel.push(Math.abs(percDataLabel));
				}
		}
	}
	this.m_actualvalues =  (this.m_actualValues == undefined) ? this.m_actualvalues : this.m_actualValues;
	this.calculatedPercent = percent;
	if(IsBoolean(this.m_showslicevalue) && IsBoolean(this.m_enablehundredpercentsum)){
		if (IsBoolean(this.m_actualvalues)) {
		    this.m_dataLabelsValues = percentDataLabel.map(function(a) {
		        return (Math.round(a * 100) / 100).toFixed(2);
		    });
		} else {
		    this.m_dataLabelsValues = this.getCloserRoundValue(percentDataLabel, 100);
		}
	}
};

/** @description This method checking last series value. **/
PieChart.prototype.checkLastSeries = function (percentArry, i) {
	var length = this.getCategoryData()[0].length - 1;
	while (percentArry[length] == 0) {
		length -= 1;
	}
	if (length == i && this.counter % 3 == 0)
		this.counter++;
};

/** @description Will Drawing Straight Line To Slice. **/
PieChart.prototype.drawStraightLineToSlice = function (angle, centerX, centerY, counter, data) {
	var newRadius = "";
	var lineHeight = 0 ;
	var endX = 0;
	var endY = 0;
	var AspectRatio = this.m_originalRadius / 8; //12.5 percent of radius
	var startPoint = ((this.m_charttype == "Pie") ? this.m_radius * .7 : this.radius+this.m_linewidth/2);
	newRadius = this.m_radius;/*(this.m_charttype == "Pie") ? this.m_radius :this.m_radius+this.m_linewidth/2 ;*/
	var startX = centerX * 1 + (startPoint) * Math.cos(angle); //startX for outer Line
	var startY = centerY * 1 + (startPoint) * Math.sin(angle); //startY for outer Line
	if(this.m_charttype == "Pie"){
		lineHeight = AspectRatio + (counter % 3) * AspectRatio; //calculate line height ,it will very according to counter
		endX = centerX * 1 + (newRadius + lineHeight * 1) * Math.cos(angle); //endX of outer Line
		endY = centerY * 1 + (newRadius + lineHeight * 1) * Math.sin(angle); //endY of Outer Line
	}else{
		var count =(counter)%3;
		count++;
		if(this.m_charttype == "SemiDoughnut")
			lineHeight = ((this.m_oldRadius-this.m_linewidth / 2)* count / 8);
		else
			lineHeight = ((this.m_oldRadius+this.m_linewidth / 2)* count / 8); //calculate line height ,it will very according to counter
		endX = startX * 1 + ( lineHeight * 1) * Math.cos(angle); //endX of outer Line
		endY = startY * 1 + (lineHeight * 1) * Math.sin(angle); //endY of Outer Line
	}
	this.drawLine(startX, startY, endX, endY);
	this.drawValueOutOfSlice(endX, endY, data, angle);
};

/** @description Will Drawing Value OutOf Slice. **/
PieChart.prototype.drawValueOutOfSlice = function (x, y, data, angle) {
	var margin = this.getTextWidth(data) / 2;
	var x1 = x + (margin) * Math.cos(angle);
	var y1 = y + (margin) * Math.sin(angle);
	this.ctx.beginPath();
	this.ctx.font = this.m_datalabelproperty.datalabelFontStyle + " " + this.m_datalabelproperty.datalabelFontWeight + " " + this.fontScaling(this.m_datalabelproperty.dataLabelFontSize) + "px " + selectGlobalFont(this.m_datalabelproperty.datalabelFontFamily);
	this.ctx.textAlign = "center";
	this.ctx.fillStyle = this.m_datalabelproperty.dataLabelFontColor;
	this.ctx.fillText(data, x1, y1);
	this.ctx.closePath();
};

/** @description Will Drawing Value OutOf Slice. **/
PieChart.prototype.drawLine = function (startX, startY, endX, endY) {
	this.ctx.beginPath();
	this.ctx.lineWidth = 1;
	this.ctx.strokeStyle = this.m_datalabelproperty.dataLabelFontColor;
	this.ctx.moveTo(startX, startY);
	this.ctx.lineTo(endX, endY);
	this.ctx.stroke();
};

/** @description Will Drawing Text On Slice. **/
PieChart.prototype.drawTextOnSlice = function (angle, centerX, centerY, data, fontSize) {
	var startPoint = (this.m_charttype == "Pie" ? this.radius*this.m_percentlabelposition/100 : this.radius);
	if (this.m_charttype == "Pie") {
		if (this.getTextWidth(data) > this.m_radius * .3) {
			startPoint = this.m_radius - this.getTextWidth(data) / 2;
		}
	}
	var x = (this.m_seriesData[0].length == 1 && this.m_charttype == "Pie") ? centerX : centerX * 1 + (startPoint) * Math.cos(angle); //70 percent of Radius
	var y = (this.m_seriesData[0].length == 1 && this.m_charttype == "Pie") ? centerY : centerY * 1 + (startPoint) * Math.sin(angle * 1);
	this.ctx.beginPath();
	this.ctx.font = this.m_datalabelproperty.datalabelFontStyle + " " + this.m_datalabelproperty.datalabelFontWeight + " " + this.fontScaling(this.m_datalabelproperty.dataLabelFontSize) + "px " + selectGlobalFont(this.m_datalabelproperty.datalabelFontFamily);
	this.ctx.textAlign = "center";
	this.ctx.fillStyle = this.m_datalabelproperty.dataLabelFontColor;
	this.ctx.fillText(data, x, y);
	this.ctx.closePath();
};
/** @description Getter Method of TextWidth. **/
PieChart.prototype.getTextWidth = function (data) {
	this.ctx.font = this.m_slicelabelfontstyle + " " + this.m_slicelabelfontweight + " " + this.fontScaling(this.m_slicelabelfontsize) + "px " + selectGlobalFont(this.m_slicelabelfontfamily);
	return this.ctx.measureText(data).width;
};

/** @description Getter Method of ArraySUM. **/
PieChart.prototype.getArraySUM = function(array) {
	if((array !== undefined)&&(array.length>1)){
		return (array.reduce(function(a, b) {
	        var adata = getNumericComparableValue(a);
	        adata = isNaN(adata) ? 0 : adata;
	        var bdata = getNumericComparableValue(b);
	        bdata = isNaN(bdata) ? 0 : bdata;
	        return adata * 1 + bdata * 1;
	    }));
	}else if((array !== undefined)&&(array.length === 1)){
		var sum = getNumericComparableValue(array[0]);
		sum = isNaN(sum) ? 0 : sum*1;
		return sum;
	}else{
		var sum = "";
		return sum;
	}
};
/** @description Getter Method of StartX. **/
PieChart.prototype.getStartX = function () {
	var marginForYAxisLabels = 0;
	return (this.m_x + marginForYAxisLabels);
};
/** @description Getter Method of StartY. **/
PieChart.prototype.getStartY = function () {
	var marginForXAxisLabels = 0;
	return (this.m_y + this.m_height - marginForXAxisLabels);
};
/** @description Getter Method of EndX. **/
PieChart.prototype.getEndX = function () {
	var rightSideMargin = 0;
	return (this.m_x + this.m_width - rightSideMargin);
};
/** @description Getter Method of EndY. **/
PieChart.prototype.getEndY = function () {
	return (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};
/** @description Getter Method of Margin For SubTitle. **/
PieChart.prototype.getMarginForSubTitle = function () {
	var margin;
	var multiplier = (IsBoolean(this.m_updateddesign) ? 3 : 1.5) ;
	if (IsBoolean(this.m_subTitle.m_showsubtitle))
		margin = (this.m_subTitle.getDescription() != "") ? (this.m_subTitle.getFontSize() * multiplier) : 10;
	else
		margin = 0;
	return margin;
};
/** @description Getter Method of ToolTip Data according to the type. **/
PieChart.prototype.getToolTipData = function (mouseX, mouseY) {
	if (this.m_charttype != "Pie")
		return this.getDoughnutToolTipData(mouseX, mouseY);
	else
		return this.getPieToolTipData(mouseX, mouseY);
};
/** @description Getter Method of Pie ToolTip Data. **/
PieChart.prototype.getPieToolTipData = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && (this.m_customtextboxfortooltip.dataTipType!=="None") && (!IsBoolean(this.isEmptyCategory))) {
		if (this.m_customtextboxfortooltip.dataTipType!=="None") {
			this.seriesValue = [];
			this.categoryValue = [];
			this.percentVal = this.getCalculatedPercent();
			var seriesValue = this.updateSeriesData(this.getVisibleSeries());
			var categoryValue = this.getVisibleCategory();
			var deltaX = mouseX - this.centerX;
			var deltaY = mouseY - this.centerY;
			var Angle = Math.atan2(deltaY, deltaX);
			var Radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
			this.m_startAngle = [];
			this.m_endAngle = [];
			this.m_startAngle = this.m_calculation.getStartAngle();
			this.m_endAngle = this.m_calculation.getEndAngle();
			if (Radius <= this.m_radius) {
				for (var i = 0, length = seriesValue.length; i < length; i++) {
					if (Angle < (-Math.PI/2)) {
						var addAngle = Math.atan2(0, -1);
						Angle = 2 * addAngle + Angle;
					}
					if (Angle >= this.m_startAngle[i] && Angle <= this.m_endAngle[i]) {
						var toolTipData = {};
						if (this.m_customtextboxfortooltip.dataTipType == "Default"){
							toolTipData = {
									cat : "",
									color : "",
									ser : "",
									data : []
								};
								toolTipData.cat = categoryValue[i];
								toolTipData.color = this.getVisibleSeriesColor()[i];
								if (IsBoolean(this.m_isCategoryAvailable)) {
									toolTipData.ser = this.getSeriesDisplayNames()[0];
								}
								if (categoryValue[i] == "Others" && IsBoolean(this.m_slicelimit) && this.m_noofslices != "" && this.m_noofslices < this.getOriginalCategoryData()[0].length) {
									toolTipData.data = this.remainingRecordInToolTip();
								} else {
									var newVal = seriesValue[i] *1;
									if (!isNaN(newVal) && (newVal % 1 != 0) && (this.m_tooltipprecision !== "default")) {
										newVal = newVal.toFixed(this.m_tooltipprecision);
						            }
									var FormterData = this.getFormatterForToolTip(newVal);
									var data = new Array();
									data[0] = FormterData;
									if(IsBoolean(this.m_enablePercentForTooltip)) {
									data[1] = this.percentVal[i].toFixed(2)+"%";
									}
									toolTipData.data.push(data);
								}
						}else{
							toolTipData = this.getDataProvider()[i];
						}
						
					} else {
						this.hideToolTip();
					}
				}
			} else {
				this.hideToolTip();
			}
			return toolTipData;
		} else {
			return false;
		}
	}
};
/** @description method checks if tooltip has any data formatting, andreturns formatted value **/
PieChart.prototype.getFormatterForToolTip = function (data) {
	if (isNaN(getNumericComparableValue(data)) || data == "" || data == undefined) {
		return data;
	} else {
		data = getNumericComparableValue(data);
		if(this.m_precision !== "default") {
			var m_precision = (this.m_precision == 0 && data % 1 != 0) ? 2 : this.m_precision;
		} else {
			var m_precision = ( data + "").split(".");
		    if (m_precision[1] !== undefined) {
		    	m_precision = m_precision[1].length;
		    } else {
		    	m_precision = 0;
		    }
		}
		data = this.getLocaleWithPrecision(data, m_precision, this.m_numberformatter);
		if (IsBoolean(this.m_yAxis.m_isFormatter) && this.m_yAxis.m_unitSymbol != undefined) {
			data = this.m_yAxis.m_util.addFormatter(data, this.m_yAxis.m_unitSymbol, this.m_yAxis.m_formatterPosition, this.m_precision);
		}
		if (IsBoolean(this.m_yAxis.m_isSecondaryFormatter) && this.m_yAxis.m_secondaryUnitSymbol === "%") {
			data = this.m_yAxis.getSecondaryFormaterAddedText(data, this.m_yAxis.m_secondaryUnitSymbol);
		}
		return data;
	}
};
/** @description Getter Method of FormatterText. **/
PieChart.prototype.getFormatterText = function (data) {
	data[0] = this.getFormatterText(this.seriesValue[i]);
	var dataWithFormatter = data;
	if (!IsBoolean(this.getFixedLabel()))
		dataWithFormatter = this.m_yAxis.getFormattedText(data);
	// = this.m_util.addFormatter(dataWithFormatter , this.m_util.getFormatterSymbol(this.m_formater,this.m_unit), "suffix");
	return dataWithFormatter;
};

/** @description This method is overridden because pie chart have some different behaviour than other chart like it have only one category and series. **/
PieChart.prototype.drawTooltip = function (mouseX, mouseY) {
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

/** @description Will drawing the Tooltip Content. **/
PieChart.prototype.drawTooltipContent = function(toolTipData) {
	this.m_tooltip.draw(toolTipData, this.m_componenttype);
};

/** @description Getter method For DrillDataPoints. **/
PieChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
	if(IsBoolean(this.m_drilltoggle)){
		this.m_drilltoggle = false;
	} else {
		this.m_drilltoggle = true;
	}
	if (!IsBoolean(this.m_isEmptySeries)) {
		if (this.m_charttype != "Pie")
			return this.getDoughnutDrillDataPoints(mouseX, mouseY);
		else
			return this.getPieDrillDataPoints(mouseX, mouseY);
	}
};

/** @description Getter method For Pie DrillDataPoints. **/
PieChart.prototype.getPieDrillDataPoints = function (mouseX, mouseY) {
	var seriesValue = this.updateSeriesData(this.getVisibleSeries());
	var categoryValue = this.getVisibleCategory();
	var deltaX = mouseX - this.centerX;
	var deltaY = mouseY - this.centerY;
	var Angle = Math.atan2(deltaY, deltaX);
	var Radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
	this.m_startAngle = [];
	this.m_endAngle = [];
	this.m_startAngle = this.m_calculation.getStartAngle();
	this.m_endAngle = this.m_calculation.getEndAngle();
	if (Radius <= this.m_radius) {
		for (var i = 0, length = seriesValue.length; i < length; i++) {
			if (Angle < (-Math.PI/2)) {
				var addAngle = Math.atan2(0, -1);
				Angle = 2 * addAngle + Angle;
			}
			if (Angle >= this.m_startAngle[i] && Angle <= this.m_endAngle[i]) {
				if(IsBoolean(this.m_slicelimit) && IsBoolean(this.m_isCategoryAvailable) && (this.m_noofslices*1 < this.getOriginalCategoryData()[0].length) && (this.m_noofslices*1!==1)){
					var fieldNameValueMap = this.getSliceValueMap(i);
				}else{
					var fieldNameValueMap = IsBoolean(this.m_isCategoryAvailable) ? this.getFieldNameValueMapPie(i) : this.getFieldNameValueMapPie(0);
				}
				/*var fieldNameValueMap = {};
				fieldNameValueMap[this.getCategoryNames()[0]] = categoryValue[i];
				fieldNameValueMap[this.getSeriesNames()[0]] = seriesValue[i];*/
				var drillColor = this.getVisibleSeriesColor()[i];
				return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
			}
		}
	}
};

/** @description returns the fields and values in a hash when drill happens on a data point for Limited Slice enable**/
PieChart.prototype.getSliceValueMap = function(i) {
    var temp = this;
    var fieldNameValueMap = new Object();
    var visibledataprovider = [];
    var category = this.m_categoryData[0];
    var allData = getDuplicateArray(this.getDataProvider());
    var sortedDataarr = getDuplicateArray(this.m_sorteddataarr);
    this.visibleSeriesFieldForSlice = this.getSeriesNames()[0];
    for (var k = 0, j = 0, length = category.length; j < length; j++) {
        if (this.m_seriesVisibleArr[category[j]]) {
            visibledataprovider[k] = allData[(sortedDataarr[j].index)*1];
            k++;
        }
    }
    for (var key in visibledataprovider[i]) {
        fieldNameValueMap[key] = visibledataprovider[i][key];
    }
    return fieldNameValueMap;
};

/** @description returns the fields and values in a hash when drill happens on a data point **/
PieChart.prototype.getFieldNameValueMapPie = function(i) {
	var fieldNameValueMap = new Object();
	if(IsBoolean(this.m_isCategoryAvailable)){
		for (var key in this.m_visibledataprovider[i]) {
			fieldNameValueMap[key] = this.m_visibledataprovider[i][key];
		}
	}else{
		for (var key in this.getDataProvider()[i]) {
			fieldNameValueMap[key] = this.getDataProvider()[i][key];
		}
	}
	
	return fieldNameValueMap;
};

/** @description Constructor function  of Piecalculation class. **/
function Piecalculation() {
	this.m_globalCal = "";
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_endX = "";
	this.m_endY = "";
	this.m_width = "";
	this.m_height = "";
	this.m_marginX;
	this.m_marginLegend;
	this.m_availableHeight;
	this.m_availabeWidth;
	this.total;
	this.ratio = [];
	this.m_startAngle = [];
	this.m_endAngle = [];
	this.m_chart;
};

/** @description initialization of  Piecalculation. **/
Piecalculation.prototype.init = function (chartRef, m_seriesData) {
	this.m_chart = chartRef;
	this.total = 0;
	this.m_categoryData = chartRef.m_categoryData;
	this.m_seriesData = m_seriesData;
	this.m_endX = chartRef.getEndX();
	this.m_endY = chartRef.getEndY();
	this.m_x = chartRef.m_x;
	this.m_y = chartRef.m_y;
	this.m_chart.availableWidth = chartRef.m_width;
	this.m_chart.availableHeight = this.m_chart.m_height - this.m_chart.getTotalMarginForTitleSubtitle() - this.m_chart.getBottomBarMargin() - this.m_chart.getMarginForTooltip();
	this.m_chart.lineWidthCalculation();
	this.m_chart.radiusCalculation();
	this.m_chart.centerXCalcalculation();
	this.m_chart.centerYCalcalculation();
	this.m_chart.setCalculatedPercent();
	this.RatioCalc();
	this.Ratiofun();
	this.setStartAngle();
	this.setEndAngle();
};
/** @description This method calculate the total of series value for ratio. **/
Piecalculation.prototype.RatioCalc = function () {
	for (var count = 0, length = this.m_seriesData.length; count < length; count++) {
		this.total = this.total * 1 + Math.abs(this.m_seriesData[count]*1);
	}
};
/** @description This method calculate the ratio according to the charttype. **/
Piecalculation.prototype.Ratiofun = function () {
	for (var count = 0, length = this.m_seriesData.length; count < length; count++) {
		if (this.total != 0) {
			var angle = (this.m_chart.m_charttype == "SemiDoughnut") ? Math.PI : 2 * Math.PI;
			this.ratio[count] = angle * Math.abs(this.m_seriesData[count]*1) / this.total;
		} else {
			this.ratio[count] = 0;
		}
	}
};
/** @description Getter method For Start Angle. **/
Piecalculation.prototype.getStartAngle = function () {
	return this.m_startAngle;
};
/** @description Setter method For Start Angle. **/
Piecalculation.prototype.setStartAngle = function () {
	this.m_startAngle = [];
	for (var count = 0, length = this.m_seriesData.length; count < length; count++) {
		if (count == 0)
			this.m_startAngle[count] = (this.m_chart.m_charttype == "SemiDoughnut") ? Math.PI : (-Math.PI/2);
		else
			this.m_startAngle[count] = this.ratio[count - 1] + this.m_startAngle[count - 1];
	}
	return this.m_startAngle;
};
/** @description Getter method For End Angle. **/
Piecalculation.prototype.getEndAngle = function () {
	return this.m_endAngle;
};
/** @description Setter method For End Angle. **/
Piecalculation.prototype.setEndAngle = function () {
	this.m_endAngle = [];
	for (var count = 0, length = this.m_seriesData.length; count < length; count++) {
		if (count == 0)
			this.m_endAngle[count] = (this.m_chart.m_charttype == "SemiDoughnut") ? (this.ratio[count] * 1 + Math.PI) : (this.ratio[count] * 1 - Math.PI/2);
		else
			this.m_endAngle[count] = this.ratio[count] * 1 + this.m_endAngle[count - 1] * 1;
	}
	return this.m_endAngle;
};
/** @description This method returns the radius of Pie, according to the width-height. **/
Piecalculation.prototype.radiusCalc = function () {
	if (this.m_availableHeight >= this.m_availabeWidth) {
		this.radius = (this.m_availabeWidth) / 2;
	} else {
		this.radius = (this.m_availableHeight) / 2;
	}
	if (this.radius < 1)
		this.radius = 1;
	return this.radius;
};

/** @description Getter method For CenterX Point of the chart. **/
Piecalculation.prototype.centerXCalc = function () {
	//	var rx = 1 * (this.m_x) + (this.m_availabeWidth/2) * 1;
	//	return rx;
	return this.centerX;
};
/** @description Getter method For CenterY Point of the chart. **/
Piecalculation.prototype.centerYCalc = function () {
	//	var ry =1*(this.m_endY) + 1*(this.m_availableHeight/2);
	//	return ry;
	return this.centerY;
};
/** @description Constructor function  of Slice class. **/
function Slice() {
	this.m_centerX;
	this.m_centerY;
	this.m_radius;
	this.m_startAngle;
	this.m_endAngle;
	this.m_color;
	this.m_chart;
	//this.m_colorManager= new ColorManager();
	this.ctx = "";
};
/** @description initialization of  Slice. **/
Slice.prototype.init = function (m_centerX, m_centerY, m_radius, m_startAngle, m_endAngle, fillcolor, ctx, m_chartbase, m_luminance, ref, strkelinewidth, strokecolor, strokeangle) {
	this.m_centerX = m_centerX;
	this.m_centerY = m_centerY;
	this.m_radius = m_radius;
	this.m_startAngle = m_startAngle;
	this.m_chart = ref;
	this.m_endAngle = m_endAngle;
	this.m_color = convertColorToHex(fillcolor);
	this.ctx = ctx;
	this.m_chartbase = m_chartbase;
	this.m_luminance = m_luminance;
	this.m_strkelinewidth =  strkelinewidth;
	this.m_strokecolor = strokecolor;
};
/** @description Will drawing the Slice according to the startAngle and endAngle with radius. **/
Slice.prototype.draw = function (k) {
	this.drawRaphael(k);
	/*if(this.m_chart.m_canvastype == "svg") {
	} else {
	this.ctx.beginPath();
	var fillColor = this.getFillColor();
	var strokeColor = this.m_strokecolor;
	this.ctx.fillStyle = fillColor;
	this.ctx.strokeStyle = strokeColor;
	this.ctx.arc(this.m_centerX, this.m_centerY, this.m_radius, this.m_startAngle, this.m_endAngle, false);
	this.ctx.lineTo(this.m_centerX, this.m_centerY);
	this.ctx.lineWidth = this.m_strkelinewidth;
	this.ctx.fill();
	this.ctx.closePath();
	this.ctx.stroke();
	}*/
};
Slice.prototype.drawRaphael = function (k) {
	var temp = this;
	var colorArr = hex2rgb(this.m_color, this.m_chart.m_coloropacity);
	var startAngle = this.m_startAngle * (180 / Math.PI);
	if (this.m_chart.m_isOneSlice) {
		/**DAS-683 */
		var endAngle = this.m_endAngle.toFixed(3) * (180 / Math.PI);
	} else {
		var endAngle = this.m_endAngle * (180 / Math.PI);
	}
	
	this.m_chart.angleDiff[k] = (this.m_startAngle + this.m_endAngle) / 2;
	var radius = this.m_radius;
	var cx = this.m_centerX;
	var cy = this.m_centerY;
	var animSpeed = (IsBoolean(this.m_chart.m_enableanimation)) ? this.m_chart.m_pieanimationduration * 1000 : 0;
	var path = null;

	//creates a custom attribute 'sector' for a Rapahel path
	this.m_chart.paper.customAttributes.sector = function(cx, cy, r, startAngle, endAngle) {
	    var rad = Math.PI / 180,
	        x1 = cx + r * Math.cos(startAngle * rad),
	        x2 = cx + r * Math.cos(endAngle * rad),
	        y1 = cy + r * Math.sin(startAngle * rad),
	        y2 = cy + r * Math.sin(endAngle * rad),
	        flag = (Math.abs(endAngle - startAngle) > 180);

	    return {
	        path: [
	            ["M", cx, cy, ],
	            ["L", x1, y1, ],
	            ["A", r, r, 0, +flag, 1, x2, y2, ],
	            ["z"]
	        ]
	    }
	}

	//create a rapahel path with the custom pie 'sector' attribute that we defined above. Start angle initially is 0
	path = this.m_chart.paper.path().attr({
	    sector: [cx, cy, radius, 0, 0],
	    stroke: temp.m_strokecolor,
	    "stroke-width": temp.m_chart.m_strokelinewidth,
	    "transform": "",
	    "stroke-linejoin": "round",
	    "stroke-linecap": "round",
	    fill: colorArr
	}).data("id", "svgPath"+k).click(function() {
	    var path = this[0];
	    var linePath = temp.m_chart.paper.getById("line"+ this.id.split("svgPath")[1]);
	    var linePath1 = temp.m_chart.paper.getById("linex"+ this.id.split("svgPath")[1]);
    	var textPath = temp.m_chart.paper.getById("text"+ this.id.split("svgPath")[1]);
    	var rectPath = temp.m_chart.paper.getById("rect"+ this.id.split("svgPath")[1]);
    	if(!IsBoolean(temp.m_chart.m_otherslicescollapse)) {
    		if (path.attributes.class && path.attributes.class.nodeValue== "slice") {
    	    	path.removeAttribute("class");
    	    	this.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
		        if(textPath !== null) {
		        	linePath.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
		        	linePath1.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
	        		textPath.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
	        		rectPath.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
	    		}
    		} else {
    			path.setAttribute("class", "slice");
	    		this.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
		        if(textPath !== null) {
		        	linePath.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
		        	linePath1.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
	        		textPath.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
	        		rectPath.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
	    		}
    		}
    	} else {
    		for(var i = 0; i < temp.m_chart.m_slice.length; i++) {
	        	var linePathCounter = temp.m_chart.paper.getById("line"+ i);
	        	var linePathCounter1 = temp.m_chart.paper.getById("linex"+ i);
	        	var textPathCounter = temp.m_chart.paper.getById("text"+ i);
	        	var rectPathCounter = temp.m_chart.paper.getById("rect"+ i);
	        	var svgPathCounter = temp.m_chart.paper.getById("svgPath"+ i);
	        	var flag = (svgPathCounter.id != this.id);
	        	if (svgPathCounter[0].attributes.class && svgPathCounter[0].attributes.class.nodeValue == "slice" && flag) {
					svgPathCounter.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[i]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[i]));
					svgPathCounter[0].removeAttribute("class");
					if(textPathCounter !== null) {
						linePathCounter.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[i]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[i]));
						linePathCounter1.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[i]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[i]));
	        			textPathCounter.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[i]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[i]));
	        			rectPathCounter.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[i]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[i]));
					}
	        	}
	        }
    		if(path.attributes.class && path.attributes.class.nodeValue == "slice") {
	        	path.removeAttribute("class");
    	    	this.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
		        if(textPath !== null) {
		        	linePath.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
		        	linePath1.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
	        		textPath.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
	        		rectPath.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
	    		}
	        } else {
	        	path.setAttribute("class", "slice");
    			this.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
    			if(textPath !== null) {
    				linePath.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
    				linePath1.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
    				textPath.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
    				rectPath.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
    			}
	        }
    	}
	    //console.log(this.data("id")); //I have also added a click event for each slice. This is just in case you need to handle a pie slice click
	});
	
	path.id = "svgPath"+k;
	//change the pie sector attribute over time - this is where the animation happens
	path.animate({
	    sector: [cx, cy, radius, startAngle, endAngle]
	}, animSpeed, function() {
	    //console.log('callback function called after animation');
	});
	        
};
Slice.prototype.drawDoughnutRaphael = function (k) {
	var temp = this;
	var colorArr = hex2rgb(this.m_color, this.m_chart.m_coloropacity);
	var startAngle = this.m_startAngle * (180 / Math.PI);
	if (this.m_chart.m_isOneSlice) {
		/**DAS-683 */
		var endAngle = this.m_endAngle.toFixed(3) * (180 / Math.PI);
	} else {
		var endAngle = this.m_endAngle * (180 / Math.PI);
	}
	this.m_chart.angleDiff[k] = (this.m_startAngle + this.m_endAngle) / 2;
	var radius = this.m_radius;
	var donutRadius = this.m_radius - this.m_chart.m_linewidth;
	var cx = this.m_centerX;
	var cy = this.m_centerY;
	var animSpeed = (IsBoolean(this.m_chart.m_enableanimation)) ? this.m_chart.m_pieanimationduration * 1000 : 0;
	path = null;

	//creates a custom attribute 'sector' for a Rapahel path
	this.m_chart.paper.customAttributes.sector = function(cx, cy, r, startAngle, endAngle) {
	    var rad = Math.PI / 180,
	        x1 = cx + r * Math.cos(startAngle * rad), // outer
	        x2 = cx + r * Math.cos(endAngle * rad),
	        y1 = cy + r * Math.sin(startAngle * rad),
	        y2 = cy + r * Math.sin(endAngle * rad),
	        x3 = cx + (r - temp.m_chart.m_linewidth) * Math.cos(startAngle * rad), // inner
	        x4 = cx + (r - temp.m_chart.m_linewidth) * Math.cos(endAngle * rad),
	        y3 = cy + (r - temp.m_chart.m_linewidth) * Math.sin(startAngle * rad),
	        y4 = cy + (r - temp.m_chart.m_linewidth) * Math.sin(endAngle * rad),
	        flag = (Math.abs(endAngle - startAngle) > 180);
	    return {
	        path: [
	            ["M", x3, y3, ],
	            ["L", x1, y1, ],
	            ["A", r, r, 0, +flag, 1, x2, y2, ],
	            ["L", x4, y4, ],
	            ["A", (r - temp.m_chart.m_linewidth), (r - temp.m_chart.m_linewidth), 0, +flag, 0, x3, y3, ],
	            ["z"]
	        ]
	    }
	}

	//create a rapahel path with the custom pie 'sector' attribute that we defined above. Start angle initially is 0
	path = this.m_chart.paper.path().attr({
	    sector: [cx, cy, radius, 0, 0],
	    stroke: temp.m_strokecolor,
	    "stroke-width": temp.m_chart.m_strokelinewidth,
	    "transform": "",
	    "stroke-linejoin": "round",
	    "stroke-linecap": "round",
	    fill: colorArr
	}).data("id", k).click(function() {
	    var path = this[0];
	    var linePath = temp.m_chart.paper.getById("line"+ this.id.split("svgPath")[1]);
	    var linePath1 = temp.m_chart.paper.getById("linex"+ this.id.split("svgPath")[1]);
    	var textPath = temp.m_chart.paper.getById("text"+ this.id.split("svgPath")[1]);
    	var rectPath = temp.m_chart.paper.getById("rect"+ this.id.split("svgPath")[1]);
    	if(!IsBoolean(temp.m_chart.m_otherslicescollapse)) {
    		if (path.attributes.class && path.attributes.class.nodeValue== "slice") {
    	    	path.removeAttribute("class");
    	    	this.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
		        if(textPath !== null) {
		        	linePath.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
		        	linePath1.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
	        		textPath.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
	        		rectPath.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
	    		}
    		} else {
    			path.setAttribute("class", "slice");
	    		this.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
		        if(textPath !== null) {
		        	linePath.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
		        	linePath1.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
	        		textPath.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
	        		rectPath.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
	    		}
    		}
    	} else {
    		for(var i = 0; i < temp.m_chart.m_slice.length; i++) {
	        	var linePathCounter = temp.m_chart.paper.getById("line"+ i);
	        	var linePathCounter1 = temp.m_chart.paper.getById("linex"+ i);
	        	var textPathCounter = temp.m_chart.paper.getById("text"+ i);
	        	var rectPathCounter = temp.m_chart.paper.getById("text"+ i);
	        	var svgPathCounter = temp.m_chart.paper.getById("svgPath"+ i);
	        	var flag = (svgPathCounter.id != this.id);
	        	if (svgPathCounter[0].attributes.class && svgPathCounter[0].attributes.class.nodeValue == "slice" && flag) {
					svgPathCounter.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[i]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[i]));
					svgPathCounter[0].removeAttribute("class");
					if(textPathCounter !== null) {
						linePathCounter.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[i]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[i]));
						linePathCounter1.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[i]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[i]));
	        			textPathCounter.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[i]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[i]));
	        			rectPathCounter.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[i]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[i]));
					}
	        	}
	        }
    		if(path.attributes.class && path.attributes.class.nodeValue == "slice") {
	        	path.removeAttribute("class");
    	    	this.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
		        if(textPath !== null) {
		        	linePath.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
		        	linePath1.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
	        		textPath.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
	        		rectPath.translate(-temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), -temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
	    		}
	        } else {
	        	path.setAttribute("class", "slice");
    			this.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
    			if(textPath !== null) {
    				linePath.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
    				linePath1.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
    				textPath.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
    				rectPath.translate(temp.m_chart.m_slicingdistance * Math.cos(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]), temp.m_chart.m_slicingdistance * Math.sin(temp.m_chart.angleDiff[this.id.split("svgPath")[1]]));
    			}
	        }
    	}
	    //console.log(this.data("id")); //I have also added a click event for each slice. This is just in case you need to handle a pie slice click
	});
	
	path.id = "svgPath"+k;
	//change the pie sector attribute over time - this is where the animation happens
	path.animate({
	    sector: [cx, cy, radius, startAngle, endAngle]
	}, animSpeed, function() {
	    //console.log('callback function called after animation');
	});
};

/** @description Will drawing the Slice with Gradient according to the startAngle and endAngle with radius. **/
Slice.prototype.drawPieGradient = function () {
	this.ctx.beginPath();
	var fillColor = this.getFillColor();
	var strokeColor = this.m_color;
	this.ctx.fillStyle = fillColor;
	this.ctx.strokeStyle = strokeColor;
	this.ctx.arc(this.m_centerX, this.m_centerY, this.m_radius, this.m_startAngle, this.m_endAngle, false);
	this.ctx.lineTo(this.m_centerX, this.m_centerY);
	this.ctx.fill();
	this.ctx.closePath();
};

/** @description Will drawing the Slice according to the startAngle and endAngle with radius for the DoughnutSlice. **/
Slice.prototype.drawDoughnutSlice = function (k) {
	var temp = this.m_chart;
	this.drawDoughnutRaphael(k);
	/*if(this.m_chart.m_canvastype == "svg") {
	} else {
	this.ctx.beginPath();
	this.m_linecap = "butt";
	var fillColor = this.getFillColor();
	this.ctx.strokeStyle = fillColor;
	this.ctx.arc(this.m_centerX, this.m_centerY, this.m_radius, this.m_startAngle, this.m_endAngle, false);
	this.ctx.lineCap = this.m_linecap;
	var lineWidth = this.m_chart.m_linewidth;
	this.ctx.lineWidth = lineWidth;
	this.ctx.stroke();
	this.ctx.closePath();
	}*/
};

/** @description Getter method For FillColor on the slice according to the chartbase. **/
Slice.prototype.getFillColor = function () {
	var grd = this.m_color;
	switch (this.m_chartbase) {
	case "plane":
		grd = this.m_color;
		break;
	case "gradient1":
		grd = this.m_color;
		try {
			var color = "" + ColorLuminance(this.m_color, this.m_luminance);
			grd = this.ctx.createRadialGradient(this.m_centerX * 1, this.m_centerY * 1, this.m_radius, this.m_centerX, this.m_centerY, 1);
			grd.addColorStop(0, this.m_color);
			grd.addColorStop(1, color);
		} catch (e) {
			console.log(e);
		}
		break;
	case "gradient2":
		grd = this.m_color;
		try {
			var color = "" + ColorLuminance(this.m_color, this.m_luminance);
			grd = this.ctx.createLinearGradient(this.m_centerX * 1 - this.m_radius / 2, this.m_centerY * 1 - this.m_radius / 2, this.m_centerX * 1 + this.m_radius / 2, this.m_centerY * 1 + this.m_radius / 2);
			grd.addColorStop(0, color);
			grd.addColorStop(1, this.m_color);
		} catch (e) {
			console.log(e);
		}
		break;
	case "gradient3":
		grd = this.m_color;
		var strat = (this.m_chart.m_charttype == "Pie") ? this.m_radius - this.m_radius * 95 / 100 : (this.m_chart.isTextDrawingOutSide() == true) ? this.m_radius - this.m_chart.m_linewidth / 4 : this.m_radius - this.m_chart.m_linewidth;
		var end = (this.m_chart.m_charttype == "Pie") ? this.m_radius : (this.m_chart.isTextDrawingOutSide() == true) ? this.m_radius + this.m_radius * (this.m_chart.m_linewidth / 4) * 1 / 100 : this.m_radius + this.m_radius * this.m_chart.m_linewidth / 100;
		try {
			var color = "" + ColorLuminance(this.m_color, this.m_luminance);
			grd = this.ctx.createRadialGradient(this.m_centerX * 1, this.m_centerY * 1, strat, this.m_centerX, this.m_centerY, end);
			grd.addColorStop(0, this.m_color);
			grd.addColorStop(Math.abs(this.m_luminance), color);
			grd.addColorStop(1, this.m_color);
		} catch (e) {
			console.log(e);
		}
		break;
	default:
		grd = this.m_color;
		break;
	}
	return grd;
};

/** @description This method is calculating centerX point. **/
PieChart.prototype.centerXCalcalculation = function () {
	this.availableWidth = this.m_width;
	var ChartToBorderMargin = this.getChartToBorderMargin();
	if(this.m_charttype == "Pie") {
		if((this.availableWidth/2) > (this.radius*1 + ChartToBorderMargin)){
			this.centerX = ((this.m_chartalignment == "center") ? (this.availableWidth) / 2: ((this.m_chartalignment == "left") ? this.availableWidth - (this.availableWidth - this.radius) + ChartToBorderMargin : this.availableWidth - this.radius - ChartToBorderMargin));
		}else{
			this.centerX = ((this.m_chartalignment == "center") ? (this.availableWidth) / 2: ((this.m_chartalignment == "left") ? this.availableWidth - this.radius - ChartToBorderMargin : this.availableWidth - (this.availableWidth - this.radius) + ChartToBorderMargin));
		}
	} else if(this.m_charttype == "Doughnut") {
		if((this.availableWidth/2) > (this.radius*1 + 10 + ChartToBorderMargin)){
			this.centerX = ((this.m_chartalignment == "center") ? (this.availableWidth) / 2: ((this.m_chartalignment == "left") ? (this.availableWidth *1 - (this.availableWidth - this.radius)) + ChartToBorderMargin : this.availableWidth * 1 - this.radius * 1 - ChartToBorderMargin)) ;
		}else{
			this.centerX = ((this.m_chartalignment == "center") ? (this.availableWidth) / 2: ((this.m_chartalignment == "left") ? this.availableWidth * 1 - this.radius * 1 - ChartToBorderMargin : (this.availableWidth *1 - (this.availableWidth - this.radius)) + ChartToBorderMargin)) ;
		}
		
	} else {
		if((this.availableWidth/2) > (this.radius*1 + this.m_linewidth/2 *1 + ChartToBorderMargin)){
			this.centerX = ((this.m_chartalignment == "center") ? (this.availableWidth) / 2: ((this.m_chartalignment == "left") ? (this.availableWidth *1 + this.m_linewidth/2 *1 - (this.availableWidth - this.radius) + ChartToBorderMargin) : this.availableWidth * 1 - this.radius * 1 - this.m_linewidth/2 * 1 - ChartToBorderMargin));
		}else{
			this.centerX = ((this.m_chartalignment == "center") ? (this.availableWidth) / 2: ((this.m_chartalignment == "left") ? this.availableWidth * 1 - this.radius * 1 - this.m_linewidth/2 * 1 - ChartToBorderMargin : (this.availableWidth *1 + this.m_linewidth/2 *1 - (this.availableWidth - this.radius) + ChartToBorderMargin)));
		}
		
	}
};
/** @description This method is calculating centerY point according to the charttype and height. **/
PieChart.prototype.centerYCalcalculation = function () {
	this.availableHeight = this.m_height - this.getTotalMarginForTitleSubtitle() - this.getBottomBarMargin();
	this.centerY = (this.availableHeight) / 2 + this.getTotalMarginForTitleSubtitle();
	this.centerY = (this.m_charttype == "SemiDoughnut") ? this.centerY + this.radius * 1 / 2 : this.centerY;
};
/** @description Getter method For Filling Color on the slice according to the chartbase. **/
PieChart.prototype.getTotalMarginForTitleSubtitle = function () {
	return (this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};
/** @description Getter method For Margin of PieChart. **/
PieChart.prototype.getMarginForPieChart = function () {
	return 10;
};
/** @description Getter method For BottomBar Margin. **/
PieChart.prototype.getBottomBarMargin = function () {
	return (IsBoolean(this.m_updateddesign) ? 30 : (this.isMaximized && IsBoolean(this.getShowGradient())) ? 30 : 0);
};
/** @description This method calculate line width. **/
PieChart.prototype.lineWidthCalculation = function () {
	if (this.availableWidth >= this.availableHeight) {
		this.m_linewidth = (this.m_linewidth > this.availableHeight / 4) ? this.availableHeight / 4 : this.m_linewidth;
	} else {
		this.m_linewidth = (this.m_linewidth > this.availableWidth / 4) ? this.availableWidth / 4 : this.m_linewidth;
	}
	this.m_linewidth = (this.m_charttype != "Pie") ? this.m_linewidth : 10;
};
/** @description This method calculate radius according to the charttype. **/
PieChart.prototype.radiusCalculation = function () {
	if (this.m_charttype == "SemiDoughnut") {
		if (this.availableHeight <= (this.availableWidth / 2))
			this.radius = Math.abs(this.availableHeight - (this.m_linewidth / 2 + 20));
		else if (this.availableHeight * 1 < this.availableWidth * 1)
			this.radius = Math.abs((this.availableWidth * 1 / 2) - (this.m_linewidth * 1 / 2 + 15));
		else
			this.radius = Math.abs(this.availableWidth / 2 - (this.m_linewidth / 2 + 10));
	} else {
		this.radius = Math.abs(((this.availableWidth >= this.availableHeight) ? this.availableHeight / 2 : this.availableWidth / 2) - 10);
		//this.radius = Math.abs(((this.availableWidth >= this.availableHeight) ? this.availableHeight / 2 : this.availableWidth / 2) - this.m_linewidth);
	}
	//this.radius=(this.m_charttype == "SemiDoughnut")?this.radius+this.radius*3/10:this.radius;
};

/** @description Will Draw the Semi PieDoughnut Chart. **/
PieChart.prototype.drawSemiPieDoughnutChart = function () {
	this.ctx.beginPath();
	this.ctx.save();
	this.m_linecap = "butt";
	this.ctx.translate(this.centerX, this.centerY);
	for (var i = 0, length = this.m_slice.length; i < length; i++) {
		this.drawCircle(this.m_slice[i].m_color, this.m_slice[i].m_startAngle, Math.PI * 2);
	}
	this.ctx.restore();
	this.ctx.closePath();
};

/** @description Will Draw the PieDoughnut Chart. **/
PieChart.prototype.drawPieDoughnutChart = function () {
	for (var i = 0; i < this.m_slice.length; i++) {
		this.m_slice[i].drawDoughnutSlice(i);
	}
};

/** @description Will Draw the Circle of the Chart on the canvas. **/
PieChart.prototype.drawCircle = function (color, startAngle, endAngle) {
	//var percent = Math.min(Math.max(0, m_percent || 1), 1);
	this.ctx.beginPath();
	this.ctx.arc(0, 0, this.radius, startAngle, endAngle, false);
	this.ctx.strokeStyle = color;
	this.ctx.lineCap = this.m_linecap;
	var lineWidth = this.m_linewidth;
	this.ctx.lineWidth = lineWidth;
	this.ctx.stroke();
};

/** @description This method Will getting the tooltip data remaining Data. **/
PieChart.prototype.remainingRecordInToolTip = function () {
	var count = 0;
	var toolTipData = new Array();
	var keyArr = [];
	for (var key in this.remainingData) {
		var FormterData = this.getFormatterForToolTip(this.remainingData[key]);
		if (count < this.m_maxtooltiprows && key != "") {
			toolTipData[count] = new Array();
			toolTipData[count][0] = FormterData;
			keyArr = key.split("-");
			var key1 = "";
			for(var i=0; keyArr.length-1 > i ; i++){
				key1 += keyArr[i];/**Added to remove index value from the key for tooltip*/
			}
			toolTipData[count][1] = key1;
			count++;
		}
	}
	return toolTipData;
};

/** @description Getter method For Doughnut ToolTip Data particular mouse area. **/
PieChart.prototype.getDoughnutToolTipData = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && (this.m_customtextboxfortooltip.dataTipType !== "None") && (!IsBoolean(this.isEmptyCategory))) {
		if (this.m_customtextboxfortooltip.dataTipType !== "None") {
			this.percentVal = this.getCalculatedPercent();
			seriesValue = this.updateSeriesData(this.getVisibleSeries());
			categoryValue = this.getVisibleCategory();
			var deltaX = mouseX - this.m_centerX;
			var deltaY = mouseY - this.m_centerY;
			var Angle = Math.atan2(deltaY, deltaX);
			var Radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
			this.m_startAngle = [];
			this.m_endAngle = [];
			this.m_startAngle = this.m_calculation.getStartAngle();
			this.m_endAngle = this.m_calculation.getEndAngle();
			var lineWidth = this.m_linewidth * 1;
			if (Radius <= this.m_radius * 1 && Radius >= this.m_radius - lineWidth) {
				for (var i = 0, length = seriesValue.length; i < length; i++) {
					var startValue = (this.m_charttype == "SemiDoughnut") ? 0 :(-Math.PI/2);
					if (Angle < startValue) {
						var addAngle = Math.atan2(0, -1);
						Angle = 2 * addAngle + Angle;
					}
					if (Angle >= this.m_startAngle[i] && Angle <= this.m_endAngle[i]) {
					   var toolTipData = {};
					   if (this.m_customtextboxfortooltip.dataTipType == "Default"){
						var toolTipData = {
							cat : "",
							color : "",
							ser : "",
							data : []
						};
						var data = [];
						toolTipData.cat = categoryValue[i];
						toolTipData.color = this.getVisibleSeriesColor()[i];
						if (IsBoolean(this.m_isCategoryAvailable)) {
							toolTipData.ser = this.getSeriesDisplayNames()[0];
						}
						if (categoryValue[i] == "Others" && IsBoolean(this.m_slicelimit) && this.m_noofslices != "" && this.m_noofslices < this.getOriginalCategoryData()[0].length) {
							toolTipData.data = this.remainingRecordInToolTip();
						} else {
							newVal = seriesValue[i] *1;
							if (!isNaN(newVal) && (newVal % 1 != 0) && (this.m_tooltipprecision !== "default")) {
								newVal = newVal.toFixed(this.m_tooltipprecision);
				            }
							var FormterData = this.getFormatterForToolTip(newVal);
							data[0] = FormterData;
							if(IsBoolean(this.m_enablePercentForTooltip)) {
							data[1] = this.percentVal[i].toFixed(2)+"%";
							}
							toolTipData.data.push(data);
						}
					  }else{
							toolTipData = this.getDataProvider()[i];
					  }
					} else {
						this.hideToolTip();
					}
				}
			} else {
				this.hideToolTip();
			}
			return toolTipData;
		} else {
			return false;
		}
	}
};

PieChart.prototype.getLegendTableContent = function () {
	var legendTable = "";
	for (var i = 0; i < this.getLegendNames().length; i++) {
		var shape = "piechart";
		var orgShape = this.getHTMLShape(shape);
		legendTable += "<tr style=\"font-style:" + this.m_legendfontstyle + ";color:" + convertColorToHex(this.m_legendfontcolor) + ";text-decoration:" + this.m_legendtextdecoration + ";font-weight:" + this.m_legendfontweight + ";font-family:" + selectGlobalFont(this.m_legendfontfamily) + "\">"+
							"<td>"+this.drawLegendShape(orgShape,this.getSeriesColors()[i])+"<span style=\"display:inline;\">" + this.getLegendNames()[i] + "</span></td></tr>";
	}
	return legendTable;
};

/** @description Getter method For Formatter in Text or Value. **/
PieChart.prototype.getFormatterText = function (data) {
	var dataWithFormatter = data;
	if (!IsBoolean(this.getFixedLabel()))
		dataWithFormatter = this.m_yAxis.getFormattedText(data);

	return dataWithFormatter;

};

/** @description Getter method For Doughnut DrillDataPoints. **/
PieChart.prototype.getDoughnutDrillDataPoints = function (mouseX, mouseY) {
	var seriesValue = this.updateSeriesData(this.getVisibleSeries());
	var categoryValue = this.getVisibleCategory();
	var deltaX = mouseX - this.m_centerX;
	var deltaY = mouseY - this.m_centerY;
	var Angle = Math.atan2(deltaY, deltaX);
	var Radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
	this.m_startAngle = [];
	this.m_endAngle = [];
	this.m_startAngle = this.m_calculation.getStartAngle();
	this.m_endAngle = this.m_calculation.getEndAngle();
	if (Radius <= this.m_radius * 1 && Radius >= this.m_radius - this.m_linewidth) {
		for (var i = 0, length = seriesValue.length; i < length; i++) {
			var startValue = (this.m_charttype == "SemiDoughnut") ? 0 :(-Math.PI/2);
			if (Angle < startValue) {
				var addAngle = Math.atan2(0, -1);
				Angle = 2 * addAngle + Angle;
			}
			if (Angle >= this.m_startAngle[i] && Angle <= this.m_endAngle[i]) {
				if(IsBoolean(this.m_slicelimit) && IsBoolean(this.m_isCategoryAvailable) && (this.m_noofslices*1 < this.getOriginalCategoryData()[0].length) && (this.m_noofslices*1!==1)){
					var fieldNameValueMap = this.getSliceValueMap(i);
				}else{
					var fieldNameValueMap = IsBoolean(this.m_isCategoryAvailable) ? this.getFieldNameValueMapPie(i) : this.getFieldNameValueMapPie(0);
				}
				var drillColor = this.getVisibleSeriesColor()[i];
				return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
			}
		}
	}
};

/** @description Constructor function  of PieDoughnutChart class. **/
function PieDoughnutChart(m_chartContainer, m_zIndex) {
	this.base = PieChart;
	this.base();
	this.m_percentageInnerCutout = 0.5;
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
};

/** @description Making prototype of PieChart class to inherit its properties and methods into PieDoughnutChart. **/
PieDoughnutChart.prototype = new PieChart();

/** @description Iterate through chart JSON and set class variable values with JSON values **/
PieDoughnutChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.ParsePropertyJsonAttributes(jsonObject, nodeObject);
	this.m_charttype = "Doughnut";
};
//# sourceURL=PieChart.js