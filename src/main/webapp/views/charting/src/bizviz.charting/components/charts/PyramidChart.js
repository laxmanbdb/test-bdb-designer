/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: PyramidChart.js
 * @description PyramidChart
 **/
function PyramidChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();

	this.m_x = 20;
	this.m_y = 20;
	this.m_width = 400;
	this.m_height = 300;

	this.m_seriesDataAndLegendName = [];
	this.m_layerXpositionArray = [];
	this.m_layerYpositionArray = [];
	this.m_layerWidthArray = [];
	this.m_layerHeightArray = [];
	this.m_layerXLeftpositionArray = [];
	this.m_layerXRightpositionArray = [];
	this.ratio = 0;
	this.totalSeriesvalue = 0;
	this.m_layer = new Layer();
	this.m_yAxis = new Yaxis();
	this.m_layerCalculation = new LayerCalculation();
	this.m_showlayervalue = false;

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_legendShape = "triangle";
	this.calculatedPercent = [];
	
};

/** @description Making prototype of chart class to inherit its properties and methods into PyramidChart. **/
PyramidChart.prototype = new Chart();

/** @description This method will set class variable values with JSON values **/
PyramidChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "Funnel") {
			for (var FunnelKey in jsonObject[key]) {
				switch (FunnelKey) {
				case "Title":
					for (var titleKey in jsonObject[key][FunnelKey]) {
						var propertyName = this.getNodeAttributeName(titleKey);
						nodeObject.m_title[propertyName] = jsonObject[key][FunnelKey][titleKey];
					}
					break;
				case "SubTitle":
					for (var subTitleKey in jsonObject[key][FunnelKey]) {
						var propertyName = this.getNodeAttributeName(subTitleKey);
						nodeObject.m_subTitle[propertyName] = jsonObject[key][FunnelKey][subTitleKey];
					}
					break;
				case "legends":
					for (var legendsKey in jsonObject[key][FunnelKey]) {
						var propertyName = this.getNodeAttributeName(legendsKey);
						nodeObject[propertyName] = jsonObject[key][FunnelKey][legendsKey];
					}
					break;
				default:
					var propertyName = this.getNodeAttributeName(FunnelKey);
					nodeObject[propertyName] = jsonObject[key][FunnelKey];
					break;
				}
			}
		} else {
			var propertyName = this.getNodeAttributeName(key);
			nodeObject[propertyName] = jsonObject[key];
		}
	}
};

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
PyramidChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description  initialization of draggable div and its inner Content **/
PyramidChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/** @description This method will parse the chart JSON and create a container **/
PyramidChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Setter Method of Fields according to fieldType **/
PyramidChart.prototype.setFields = function (fieldsJson) {
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
			break;
		}
	}
	this.setCategory(categoryJson);
	this.setSeries(seriesJson);
};

/** @description Setter Method of Category iterate for all category. **/
PyramidChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	this.m_allCategoryNames = [];
	this.m_allCategoryDisplayNames = [];
	this.m_categoryVisibleArr = {};
	var count = 0;
	// only one category can be set for line chart, preference to first one
	for (var i = 0; i < categoryJson.length; i++) {
		this.m_allCategoryNames[i] = this.getProperAttributeNameValue(categoryJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(categoryJson[i], "DisplayName"));
		this.m_allCategoryDisplayNames[i] = m_formattedDisplayName;
		this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]] = this.getProperAttributeNameValue(categoryJson[i], "visible");
		if (IsBoolean(this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]])) {
			this.m_categoryNames[count] = this.getProperAttributeNameValue(categoryJson[i], "Name");
			this.m_categoryDisplayNames[count] = m_formattedDisplayName;
			count++;
		}
	}
};

/** @description creating array for each property of fields and storing in arrays **/
PyramidChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = [];
	this.m_legendNames = [];
	this.m_seriesVisibleArr = {};
	this.m_plotTrasparencyArray = [];
	this.m_visibleSeriesNames = {};
	this.m_seriesDataLabelProperty = [];
	this.legendMap = {};
	for (var i = 0; i < seriesJson.length; i++) {
		this.m_seriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.m_legendNames[i] = m_formattedDisplayName;
		this.m_seriesDisplayNames[i] = m_formattedDisplayName;
		this.m_seriesColors[i] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));
		this.m_seriesVisibleArr[this.m_seriesDisplayNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
		this.m_visibleSeriesNames[this.m_seriesNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
		var transparency = this.getProperAttributeNameValue(seriesJson[i], "PlotTransparency");
		this.m_plotTrasparencyArray[i] = (transparency != undefined && transparency !== null && transparency !== "" && !isNaN(transparency)) ? transparency : 1;
		this.m_seriesDataLabelProperty[i] = this.getProperAttributeNameValue(seriesJson[i], "DataLabelCustomProperties");
		if (this.m_seriesDataLabelProperty[i] !== undefined) {
		    if(IsBoolean(this.m_seriesDataLabelProperty[i].dataLabelUseComponentFormater)){
		    	this.m_seriesDataLabelProperty[i].datalabelFormaterCurrency = this.m_unit;
		    	this.m_seriesDataLabelProperty[i].datalabelFormaterPrecision = this.m_precision;
		    	this.m_seriesDataLabelProperty[i].datalabelFormaterPosition = this.m_signposition;
		    	this.m_seriesDataLabelProperty[i].datalabelFormaterUnit = this.m_secondaryunit;
		    }
		} else {
		    this.m_seriesDataLabelProperty[i] = this.getDataLabelProperties();
		    this.m_seriesDataLabelProperty[i].showDataLabel = IsBoolean(this.m_showlayervalue) ? "true" : this.m_seriesDataLabelProperty[i].showDataLabel;
		}
		//if(this.m_seriesVisibleArr[this.m_seriesDisplayNames[i]] =="undefined" || this.m_seriesVisibleArr[this.m_seriesDisplayNames[i]] ==undefined )
		//this.m_seriesVisibleArr[this.m_seriesDisplayNames[i]] = true;
		var tempMap = {
			"seriesName" : this.m_seriesNames[i],
			"displayName" : this.m_seriesDisplayNames[i],
			"color" : this.m_seriesColors[i],
			"shape" : this.m_legendShape,
			"index": i
		};
		this.legendMap[this.m_seriesNames[i]] = tempMap;

	}
};
/** @description Getter Method of LegendInfo . **/
PyramidChart.prototype.getLegendInfo = function () {
	return this.legendMap;
};
/** @description Setter Method of LegendNames. **/
PyramidChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};
/** @description Setter Method of All FieldsName. **/
PyramidChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getCategoryNames()[i]);
	}
	for (var j = 0; j < this.getSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getSeriesNames()[j]);
	}
};

/** @description Setter Method for set All Fields DisplayName. **/
PyramidChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

/** @description Setter Method of Category Data. **/
PyramidChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	this.isEmptyCategory = true;
	if (this.getCategoryNames().length > 0) {
		this.isEmptyCategory = false;
		for (var i = 0; i < this.getCategoryNames().length; i++) {
			this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
		}
	}
};

/** @description Setter Method of Series Data. **/
PyramidChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	var arr = [];
	this.multiSeriesData = [];
	this.m_isEmptySeries = true;
    if(this.getSeriesNames().length > 0){
		this.m_isEmptySeries = false;
		for (var i = 0, k = 0; k< this.getSeriesNames().length; k++) {
			if(this.m_seriesVisibleArr[this.getSeriesDisplayNames()[k]]){
				arr[i] = this.getDataFromJSON(this.getSeriesNames()[k]);
				i++;
				}
			}
		for (var i = 0, length = arr[0].length; i < length; i++) {
			this.multiSeriesData[i] = [];
			for (var j = 0, innerlength = arr.length; j < innerlength; j++) {
				this.multiSeriesData[i][j] = arr[j][i];
			}	
		}
		for (var h = 0, length = this.multiSeriesData.length; h < length; h++) {
			this.m_seriesData.push(this.getArraySUM(this.multiSeriesData[h]));
		}	
	}	
};
/** @description will return sum of all element of array. **/
PyramidChart.prototype.getArraySUM = function (arr) {
	var sum = 0;
	for (var i = 0,length=arr.length; i <length; i++) {
		if (arr[i] < 0)
			arr[i] = arr[i] * (-1);
		if (!isNaN(arr[i]))
			sum = sum * 1 + arr[i] * 1;
	}
	return sum;
};
/** @description Setter Method of Series Color. **/
PyramidChart.prototype.setSeriesColor = function (m_seriesColor) {
	var colorArray = this.m_seriescolor.split(",");
	this.seriesColors = [];
	var slicesCount = this.getSeriesData().length - 1;
	for (var i = 0, count = 0; i <= slicesCount; i++) {
		var color = (colorArray[i]) ? colorArray[i] : this.seriesColors[slicesCount - count++];
		this.seriesColors[slicesCount - i] = convertColorToHex(color);
	}
};
/** @description Getter Method of DataProvider **/
PyramidChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};
/** @description Getter Method of Category Names. **/
PyramidChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};
/** @description Getter Method of Category DisplayName. **/
PyramidChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};
/** @description Getter Method of SeriesNames. **/
PyramidChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};
/** @description Getter Method of Series DisplayName. **/
PyramidChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};
/** @description Getter Method of LegendNames. **/
PyramidChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};
/** @description Getter Method of All FieldsDisplayName. **/
PyramidChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};
/** @description Getter Method of All FieldsName. **/
PyramidChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};
/** @description Getter Method of Category Data. **/
PyramidChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};
/** @description Getter Method of Series Data. **/
PyramidChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};
/** @description Getter Method of SeriesColor. **/
PyramidChart.prototype.getSeriesColors = function () {
	return (this.visibleSeriesColors == undefined) ? this.m_seriesColors : this.visibleSeriesColors;
};
/** @description Getter Method of SeriesColors. **/
PyramidChart.prototype.getSeriesColor = function () {
	return this.seriesColors;
};

/** @description initialization of PyramidChart. **/
PyramidChart.prototype.init = function () {
	this.setCategoryData();
	this.setSeriesData();
	this.setAllFieldsName();
	this.setAllFieldsDisplayName();
	this.setSeriesColor();
	this.isSeriesDataEmpty();

	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);

	if ((!IsBoolean(this.m_isEmptySeries)) && (!IsBoolean(this.isEmptyCategory))) {
		this.setPercentageForHundred(); 
		this.initializeCalculation();
		this.setVisibleData(); 
		//		this.setShowLegends(true);
	}
	/**Old Dashboard directly previewing without opening in designer*/
	this.initializeToolTipProperty();
	this.m_tooltip.init(this);
};

/** @description initialize the calculation  of the PyramidChart. **/
PyramidChart.prototype.initializeCalculation = function () {
	this.m_categoryData = this.updateCategoryData(this.m_categoryData);
	this.m_legendNames = this.m_categoryData;
	this.m_seriesColor = this.getSeriesColor();
	this.multiSeriesData = this.updateSeriesData(this.multiSeriesData);
	
	if (!IsBoolean(this.m_isEmptySeries)) {
		this.m_seriesDataAndLegendName = [];
		for (var index = 0; index < this.getSeriesNames().length; index++) {
			if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesDisplayNames[index]])) {
				for (var i = 0; i < this.m_seriesData.length; i++) {
					this.m_seriesDataAndLegendName[i] = [];
					this.m_seriesDataAndLegendName[i][0] = this.m_seriesData[i];// sum of seriesData
					this.m_seriesDataAndLegendName[i][1] = this.m_legendNames[i][0];
					this.m_seriesDataAndLegendName[i][2] = this.m_seriesColor[i];
					this.m_seriesDataAndLegendName[i][3] = this.m_categoryData[i][0];
					this.m_seriesDataAndLegendName[i][4] = this.m_displaySeriesDataFlag[i]; 
					this.m_seriesDataAndLegendName[i][5] = this.seriesDataPercent[i];//multiple seriesData percentage
					this.m_seriesDataAndLegendName[i][6] = this.multiSeriesData[i];//multiple seriesData
					this.m_seriesDataAndLegendName[i][7] = this.getDataProvider()[i];//data objects
				}
				break;
			}
		}

		this.m_seriesDataAndLegendName.sort(function (a, b) {
			return a[0] - b[0];
		});

		var sortData = [];
		var sortedLegend = [];
		//var sortedColor=[];
		var sortedCatData = [];
		var sortedflag = [];
		var perData = [];
		var seriesArray = [];
		var allData = {};
		for (var j = 0; j < this.m_seriesDataAndLegendName.length; j++) {
			sortedLegend.push(this.m_seriesDataAndLegendName[j][1]);
			sortData.push(this.m_seriesDataAndLegendName[j][0]);
			//sortedColor.push(this.m_seriesDataAndLegendName[j][2]);
			sortedCatData.push(this.m_seriesDataAndLegendName[j][3]);
			sortedflag.push(this.m_seriesDataAndLegendName[j][4]);
			perData.push(this.m_seriesDataAndLegendName[j][5]);
			seriesArray.push(this.m_seriesDataAndLegendName[j][6]);
			allData[j] = this.m_seriesDataAndLegendName[j][7];
		}

		this.m_seriesValue = sortData;
		this.m_displaySeriesDataInToolTipFlagArray = sortedflag;
		this.visibleLegend = sortedLegend;
		//this.m_seriesColor=sortedColor;
		this.m_categoryValue = sortedCatData;
		this.m_percentSeries = perData;
		this.m_seriesDataArray = seriesArray;
		this.allDataObj = allData;// sorted all data objects
		this.m_layerCalculation.init(this);
		this.m_layer.init(this);
		this.m_yAxis.init(this, this.m_layerCalculation);
		this.startX = 1 * (this.m_width / 2) + 1 * (this.m_x);
		
		/*	if (IsBoolean(this.m_subTitle.m_showsubtitle ))
		this.startY = 1*(this.m_y) + 1*this.m_title.m_titleBarHeight + 1*this.m_subTitle.m_subTitleBarHeight + 20;
		else
		this.startY = 1*(this.m_y) + 1*this.m_title.m_titleBarHeight + 20;*/
		this.mapSeriesWithCategory(sortedCatData, sortData, sortedLegend, this.m_seriesColor, sortedflag);
		this.startY = 1 * (this.m_y) + 1 * this.getMarginForTitle() + 1 * this.getMarginForSubTitle();
		this.funnelWidth = this.m_width * 5.5 / 6;
		this.funnelHeight = this.m_layerCalculation.getFunnelHeight();
		this.calculatePercent = this.m_layerCalculation.getCalculatePercent(this.m_seriesValue);
		
		this.xPossitionValue = this.m_layerCalculation.calculateXPosition(this.m_seriesValue);
		this.seriesValue = this.m_layerCalculation.updatedSeriesValueForPyramid(this.m_seriesValue);
		this.setMapForDrill(this.m_seriesValue, this.m_legendNames);		
	}
};
/** @description This Method is to calculate percentage of multiple seriesData values. **/
PyramidChart.prototype.setPercentageForHundred = function () {
	var serData = this.multiSeriesData;
	this.m_SeriesDataInPerForHundredChart;
	var updateValue = [];
	this.seriesDataPercent = [];
	for (var i = 0, length = serData.length; i < length; i++) {
	    var totalSerData = this.getArraySUM(serData[i]);
	    updateValue[i] = [];
	    for (var j = 0, datalength = serData[i].length; j < datalength; j++) {
	        if (serData[i][j] !== "" && (!isNaN(serData[i][j]) && totalSerData !=0))
	            updateValue[i][j] = (serData[i][j] / totalSerData) * 100;
	        else
	            updateValue[i][j] = 0;
	    }
	}
	this.seriesDataPercent = updateValue;
};
/** @description Method will set all visible data **/
PyramidChart.prototype.setVisibleData = function () {
	this.seriesDisplayName = [];
	this.visibleCategoryNames = [];
	this.seriesData = [];
	this.seriesPercent = [];
	this.allDataObjects = {};
	var legendArr = [];
	this.m_legendNames.length = 0;
	this.visibleTrasparency = [];
	this.m_visibleseriesdatalabel = [];
	
	 for (var i =0, k = 0; k< this.getSeriesNames().length; k++) {
			if(this.m_seriesVisibleArr[this.getSeriesDisplayNames()[k]]){
				this.seriesDisplayName[i] = this.getSeriesDisplayNames()[k];
				this.visibleTrasparency[i] = this.m_plotTrasparencyArray[k];
				this.m_visibleseriesdatalabel[i] = this.m_seriesDataLabelProperty[k];
				i++;
			}
     }
     for (var i = 0,l = 0; l< this.m_categoryValue.length; l++) {
			if(this.m_seriesVisibleArr[this.m_categoryValue[l]]){
				this.visibleCategoryNames[i] = this.m_categoryValue[l];
				this.seriesData[i] = this.m_seriesDataArray[l];
				this.seriesPercent[i] = this.m_percentSeries[l];
				this.allDataObjects[i] = this.allDataObj[l];
				legendArr[i] = this.visibleLegend[l];
				i++;
			}
     }
     this.m_legendNames = legendArr;// update visible legend names
};
/** @description This Method map the series value according to category. **/
PyramidChart.prototype.mapSeriesWithCategory = function (category, series, legends, colors, sortedflag) {
	var flag = true;
	if(this.m_defaultlegendfields && !IsBoolean(this.m_designMode)) {
		for(var k = 0; k < this.m_defaultlegendfields.length; k++) {
				flag = this.m_defaultlegendfields[k].value;
				if(flag == false) {
					break;
				}
			}
	}
	for (var i = 0; i < category.length; i++) {
		if (this.m_seriesVisibleArr[category[i]] == undefined)
			this.m_seriesVisibleArr[category[i]] = flag;
		else {}
	}
	this.visibleCategories = [];
	this.m_seriesValue = [];
	this.visibleSeriesColors = [];
	this.visibleSeriesNames = [];
	this.m_displaySeriesDataInToolTipFlagArray = [];
	this.legendMap = {};
	for (var k = 0, i = 0; i < category.length; i++) {
		if (this.m_seriesVisibleArr[category[i]]) {
			this.visibleCategories[k] = category[i];
			this.m_seriesValue[k] = series[i];
			this.visibleSeriesColors[k] = colors[i];
			this.m_displaySeriesDataInToolTipFlagArray[k] = sortedflag[i];
			
			k++;
		}
		var tempMap = {
			"seriesName" : category[i],
			"displayName" : category[i],
			"color" : colors[i],
			"shape" : this.m_legendShape 
		};
		this.legendMap[category[i]] = tempMap;
	}
	this.visibleSeriesData = this.m_seriesValue;
	for (var k = 0, j = 0; j< this.getSeriesNames().length; j++) {
		if(this.m_visibleSeriesNames[this.getSeriesNames()[j]]){
			this.visibleSeriesNames[k] = this.getSeriesNames()[j];
			k++;
		}
	}
	return {
		cat : this.visibleCategories,
		ser : this.m_seriesValue,
		color : this.visibleSeriesColors
	};
};

/** @description Drawing of chart started by drawing different parts of chart like ChartFrame,Title,SubTitle. **/
PyramidChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	var map = this.IsDrawingPossible();
	if (IsBoolean(map.permission)) {
		this.drawPyramid();
		this.drawValueOnLayers();
	} else {
		this.drawMessage(map.message);
	}
};

/** @description Will check drawing Is possible or not. **/
PyramidChart.prototype.IsDrawingPossible = function () {
	var map = {};
	if (!IsBoolean(this.isEmptyCategory)) {
		if (!IsBoolean(this.m_isEmptySeries)) {
			if (IsBoolean(this.isVisibleSeriesAvailable()) && this.m_seriesValue.length > 0)
				map = {
					"permission" : "true",
					message : this.m_status.success
				};
			else
				map = {
					"permission" : "false",
					message : this.m_status.noSeries
				};
		} else
			map = {
				"permission" : "false",
				message : this.m_status.noData
			};

	} else
		map = {
			"permission" : "false",
			message : this.m_status.noCategory
		};

	return map;
};
/** @description Will Draw Title on canvas if showTitle set to true. **/
PyramidChart.prototype.drawTitle = function () {
	this.m_title.draw();
};
/** @description Will Draw SubTitle on canvas if showSubTitle set to true. **/
PyramidChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};
/** @description will draw the ChartFrame  of the AreaChart. **/
PyramidChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

/** @description this methods checks the series data is available or not **/
PyramidChart.prototype.isSeriesDataAvailable = function(legendObj) {
	if(IsBoolean(legendObj.associatedChartObject.m_isrepeater)){
		return true;
	}else{
		if (legendObj.associatedChartObject.m_seriesData.length > 0) {
			return true;
		} else {
			return false;
		}
	}
};

/** @description will draw the PyramidChart layer by layer. **/
PyramidChart.prototype.drawPyramid = function () {
	this.m_layerXpositionArray = [];
	this.m_layerYpositionArray = [];
	this.m_layerWidthArray = [];
	this.m_layerHeightArray = [];
	this.m_layerXLeftpositionArray = [];
	this.m_layerXRightpositionArray = [];
	this.value1 = 0;
	this.value2 = 0;
	this.xPositionPre = 0;
	this.xPositioncur = 0;
	this.yPos =[];
	this.m_seriescolorforPyramid = this.updateSeriesColor(this.visibleSeriesColors);
	for (var i = 0; i < this.seriesValue.length; i++) {
		if (i < 1) // for the first slice
		{
			this.value2 = 1 * (this.seriesValue[i]);
			this.xPositioncur = 1 * (this.xPossitionValue[i]);
			this.m_layer.drawFirstSlicePyramid(i, this.value2, this.m_seriescolorforPyramid[i], this.xPositioncur, this.seriesPercent, this.visibleTrasparency);
		} else // for other slices
		{
			this.value1 = this.value2;
			this.value2 = 1 * (this.value1) + 1 * (this.seriesValue[i]);
			this.xPositionPre = this.xPositioncur;
			this.xPositioncur = this.xPossitionValue[i];
			this.m_layer.drawOtherSlicesForPyramid(i, this.value1, this.value2, this.m_seriescolorforPyramid[i], this.xPositionPre, this.xPositioncur, this.seriesPercent, this.visibleTrasparency);
		}
	}
};
/** @description will get the Data Label for Series. **/
PyramidChart.prototype.getDataLabel = function(){
	var DataLabelArray = [];
	for (var k in this.allDataObjects) {
        var record = this.allDataObjects[k];
        for (var j = 0, serlength = this.seriesDisplayName.length; j < serlength; j++) {
            if (!DataLabelArray[j]) {
            	DataLabelArray[j] = [];
            }
            var dataFordatalabel = this.getValidFieldDataFromRecord(record, this.m_visibleseriesdatalabel[j].datalabelField);
            DataLabelArray[j][k] = dataFordatalabel;
        }
    } 
	return DataLabelArray[0];
}
/** @description will draw the value on the layers according to the value. **/
PyramidChart.prototype.drawValueOnLayers = function () {
	if(IsBoolean(this.m_visibleseriesdatalabel[0].showDataLabel)) {
		var percent = IsBoolean(this.m_showlayervalue) ? this.getRoundValue(this.calculatePercent, 100) : this.getDataLabel();
		for(var i = 0; i < this.m_layerXpositionArray.length ; i++) {
			this.ctx.beginPath();
			this.ctx.fillStyle = this.m_visibleseriesdatalabel[0].dataLabelFontColor;
			this.ctx.font = this.m_visibleseriesdatalabel[0].datalabelFontStyle + " " + this.m_visibleseriesdatalabel[0].datalabelFontWeight + " " +
            this.fontScaling(this.m_visibleseriesdatalabel[0].dataLabelFontSize) + "px " + selectGlobalFont(this.m_visibleseriesdatalabel[0].datalabelFontFamily);
			this.ctx.textAlign = "left";
			var text =IsBoolean(this.m_showlayervalue) ? (percent[i]+"%") : this.getFormattedText(percent[i]);
			var textWidth = this.ctx.measureText(text).width;
			var x1,x2,y1,y2 = "";
			if( i % 2 == 0  || i==0) {
				x1 = this.m_layerXRightpositionArray[i].x;
				x2 = this.m_layerXRightpositionArray[i].x + 10;
				y1 = this.m_layerXRightpositionArray[i].y;
				y2 = y1;
			} else {
				x1 = this.m_layerXLeftpositionArray[i].x;
				x2 = this.m_layerXLeftpositionArray[i].x - 10;
				y1 = this.m_layerXLeftpositionArray[i].y;
				y2 = y1;
			}
			
			this.ctx.lineWidth = 1;
			this.ctx.strokeStyle = this.m_visibleseriesdatalabel[0].dataLabelFontColor;
			this.ctx.moveTo(x1, y1);
			this.ctx.lineTo(x2, y2);
			this.ctx.stroke();
			
			var textXPosition = ( i % 2 == 0  || i==0) ? x2 + 3*1 : (x2 - textWidth*1 - 3);
			var newtext = ( i % 2 == 0  || i==0) ? this.getupdatetext(textXPosition, textWidth, text, (x2 + 3*1 + textWidth*1), "width").text :this.getupdatetext(textXPosition, textWidth, text, x1 -3).text;
			textXPosition = ( i % 2 == 0  || i==0) ? textXPosition :this.getupdatetext(textXPosition, textWidth, text, x1 -3).textPosition;
			
			this.ctx.fillText(newtext, textXPosition , y1);
			this.ctx.fill();
			this.ctx.closePath();
		}
	}
};
/** @description will add the formatter on Data Label. **/
PyramidChart.prototype.getFormattedText = function(value) {
    if (!isNaN(getNumericComparableValue(value))) {
        // added check for value is number or not otherwise return same string value
        var isCommaSeparated = (("" + value).indexOf(",") > 0) ? true : false;
        var signPosition = (this.m_visibleseriesdatalabel[0].datalabelFormaterPosition != "") ? this.m_visibleseriesdatalabel[0].datalabelFormaterPosition : "suffix";
        var precision = this.m_visibleseriesdatalabel[0].datalabelFormaterPrecision;
        var unit = this.m_visibleseriesdatalabel[0].datalabelFormaterCurrency;
        var secondUnit = this.m_visibleseriesdatalabel[0].datalabelFormaterUnit;
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
                value = getNumericComparableValue(value, unit);
                var symbol = getNumberFormattedSymbol(value * 1, unit);
                var val = getNumberFormattedNumericValue(value * 1, precision);
                var text = this.m_util.updateTextWithFormatter(val, "", precision);
                valueToBeFormatted = this.m_util.addFormatter(text, symbol, "suffix");
            } else {
                var unitSymbol = secondFormatterSymbol;
                valueToBeFormatted = this.m_util.updateTextWithFormatter(valueToBeFormatted, unitSymbol, precision);
                if (secondFormatterSymbol != "none" && secondFormatterSymbol != "" && secondFormatterSymbol != "") {
                    valueToBeFormatted = this.m_util.addFormatter(valueToBeFormatted, secondFormatterSymbol, "suffix");
                }
            }
            /* To Add Number formatter */ 
            valueToBeFormatted = (valueToBeFormatted == "NaN" || valueToBeFormatted === "") ? "" : this.m_util.addFormatter(getFormattedNumberWithCommas(valueToBeFormatted, this.m_numberformatter) , formatterSymbol, signPosition);
            return valueToBeFormatted;
        } else {
            return (valueToBeFormatted == "NaN") ? value : valueToBeFormatted;
        }
    } else {
    	return value;
    	
    }
};
/** @description Getter Method for update the text value and it's possition. **/
PyramidChart.prototype.getupdatetext = function (textXPosition,textWidth,text,orgX, rightSide) {
	var textX = textXPosition;
	var newText = text;
	if ( textXPosition<1 ) {
		textX = 2;
		var newWidth =  orgX - textX;		
		newText = this.calculateTitleWidth(text,newWidth);	
	}
	
	if ( rightSide === "width" && orgX >= this.m_width) {
		var newWidth =  this.m_width - textX - 2;
		newText = this.calculateTitleWidth(text,newWidth);
	}
	return {"text":newText,"textPosition" : textX};
};
/** @description This method calculate the title width. **/
PyramidChart.prototype.calculateTitleWidth = function (font, width) {
	var res = font.split("");
	var titlewidth = width - 30 ;
	var w = 0;
	var str = "";
	var count = 0;
	var f = "12px " + this.m_defaultfontfamily;
	for (var i = 0; i < res.length; i++) {
		if (titlewidth > w) {
			str = str + res[i];
			var o = $("<div>" + str + "</div>")
				.css({
					"position" : "absolute",
					"float" : "left",
					"white-space" : "nowrap",
					"visibility" : "hidden",
					"font" : f
				})
				.appendTo($("body"));
			w = o.width();
			o.remove();
		} else {
			count++;
		}
	}
	if (count != 0)
		str = str + "..";
	return str;
};

/** @description This method update the series data according to the calculation. **/
PyramidChart.prototype.updateSeriesData = function (array) {
	var arr = [];
	this.m_displaySeriesDataFlag = [];
	if ((array != undefined && array !== null && array !== "") && array.length != 0)
		for (var i = 0; i < array.length; i++) {
			arr[i] = [];
			this.m_displaySeriesDataFlag[i] = [];
			for (var j = 0; j < array[0].length; j++) {
				this.m_displaySeriesDataFlag[i][j] = true;
				if (isNaN(array[i][j])) {
					this.m_displaySeriesDataFlag[i][j] = false;
					arr[i][j] = getNumericComparableValue(array[i][j]);
					if (isNaN(arr[i][j]))
						arr[i][j] = 0;
				} else
					arr[i][j] = array[i][j];
			}
		}
	return arr;
};

/** @description Setter Method for update value and store in the Map for drill feature. **/
PyramidChart.prototype.setMapForDrill = function (serValue, catValue) {
	var alldata = this.getDataProvider();
	this.m_updateDataForDrill = [];
	var flag = "false";
	for (var i = 0; i < catValue.length; i++) {
		for (var j = 0; j < alldata.length; j++) {
			for (var key in alldata[j]) {
				if (catValue[i] == alldata[j][key]) {
					this.m_updateDataForDrill.push(alldata[j]);
					flag = "true";
					break;
				}
			}
			if (flag == "true") {
				flag = "false";
				break;
			}
		}
	}
};

/** @description Getter Method for map data for drill. **/
PyramidChart.prototype.getMapForDrill = function () {
	return this.m_updateDataForDrill;
};

/** @description This method will check series available or not. **/
PyramidChart.prototype.isVisibleSeriesAvailable = function () {
	for (var index = 0; index < this.getSeriesNames().length; index++) {
		if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesDisplayNames[index]])) {
			return true;
		}
	}
	return false;
};

/** @description Getter method for color value according to the data. **/
PyramidChart.prototype.getColorAccordingData = function (colorArray) {
	var arr = [];
	if (colorArray.length < this.m_seriesData.length) {
		for (var i = 0; i < this.m_seriesData.length; i++) {
			var pos = i % colorArray.length;
			arr.push(colorArray[pos]);
		}
		return arr;
	} else
		return colorArray;
};

/** @description This method will initialize SeriesValues. **/
PyramidChart.prototype.initializeSeriesValues = function () {
	var arr = [];
	for (var i1 = 0; i1 < this.m_seriesData[0].length; i1++) {
		arr[i1] = [];
		for (var j1 = 0; j1 < this.m_seriesData.length; j1++) {
			arr[i1][j1] = this.m_seriesData[j1][i1];
		}
	}
	this.m_seriesData = arr;
};

/** @description This method will Update CategoryData. **/
PyramidChart.prototype.updateCategoryData = function (array) {
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

/** @description This method will Update SeriesColor. **/
PyramidChart.prototype.updateSeriesColor = function (array) {
	var arr = [];
	if ((array != undefined && array !== null && array !== "") && array.length != 0)
		for (var i = 0; i < array.length; i++) {
			arr[i] = [];
			for (var j = 0; j < array.length; j++) {
				arr[i][j] = convertColorToHex(array[i]);
			}
		}
	return arr;
};

/** @description Getter method For DrillDataPoints according to the values. **/
PyramidChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory))) && IsBoolean(this.isVisibleSeriesAvailable())) {
		for (var i = 0; i < this.m_seriesValue.length; i++) {
			var x = this.xPossitionValue[this.m_seriesValue.length - 1];
			if ((mouseX >= 1 * this.startX - 1 * x) && (mouseX <= 1 * this.startX + 1 * x) && (mouseY >= this.m_layerYpositionArray[i] * 1)) {
				if (i == "0") {
					if ((mouseY >= this.m_layerYpositionArray[i] * 1) && (mouseY <= 1 * this.m_layerYpositionArray[i] + 1 * this.seriesValue[i] - 1)) {
						for (var i = this.m_layerYpositionArray.length; i >= 0; i--) {
							if(mouseY >= this.m_layerYpositionArray[i]){
								for (var j = 0, Innerlength = this.yPos[i].length; j < Innerlength; j++) {
									if (mouseY >= this.m_layerYpositionArray[i] && mouseY <= (this.yPos[i][j] * 1)) {
										var fieldNameValueMap = this.getFieldNameValueMap(i);
										var drillColor = this.visibleSeriesColors[i];
										var drillField = this.visibleSeriesNames[j];
										var drillDisplayField = this.seriesDisplayName[j];
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
				} else {
					if ((mouseY <= 1 * this.m_layerYpositionArray[i] + 1 * this.seriesValue[i])) {
						for (var i = this.m_layerYpositionArray.length; i >= 0; i--) {
							if(mouseY >= this.m_layerYpositionArray[i]){
								for (var j = 0, Innerlength = this.yPos[i].length; j < Innerlength; j++) {
									if (mouseY >= this.m_layerYpositionArray[i] && mouseY <= (this.yPos[i][j] * 1)) {
										var fieldNameValueMap = this.getFieldNameValueMap(i);
										var drillColor = this.visibleSeriesColors[i];
										var drillField = this.visibleSeriesNames[j];
										var drillDisplayField = this.seriesDisplayName[j];
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
		}
	}
};
/** @description Getter method For FieldName ValueMap. **/
PyramidChart.prototype.getFieldNameValueMap = function (i) {
	var m_fieldNameValueMap = new Object();
	var afn = this.getAllFieldsName();
	for (var l = 0; l < afn.length; l++) {
		m_fieldNameValueMap[afn[l]] = this.allDataObjects[i][afn[l]];//map fieldData with fieldName
	}
	return m_fieldNameValueMap;
};


PyramidChart.prototype.getLegendTableContent = function () {
	var legendTable = "";
	for (var i = 0; i < this.getLegendNames().length; i++) {
		var shape = this.m_legendShape;
		var orgShape = this.getHTMLShape(shape);
		legendTable += "<tr style=\"font-style:" + this.m_legendfontstyle + ";color:" + convertColorToHex(this.m_legendfontcolor) + ";text-decoration:" + this.m_legendtextdecoration + ";font-weight:" + this.m_legendfontweight + ";font-family:" + selectGlobalFont(this.m_legendfontfamily) + "\">"+
							"<td>"+this.drawLegendShape(orgShape,this.getSeriesColors()[i])+"<span style=\"display:inline;\">" + this.getLegendNames()[i] +"</span></td></tr>";
	}
	return legendTable;
};

/** @description Getter Method of ToolTip Data according to the type. **/
PyramidChart.prototype.getToolTipData = function (mouseX, mouseY) {
	var toolTipData;
	if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory) && IsBoolean(this.isVisibleSeriesAvailable()) && IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")) {
		 var legendsColor = this.visibleSeriesColors;
	        var seriesName = this.seriesDisplayName;
	        var categoryName = this.visibleCategoryNames;
	        var percent = this.calculatedPercent;
	        var seriesData = this.seriesData;
	        var seriesPercent = this.seriesPercent;
	        
		for (var i = 0; i < this.m_seriesValue.length; i++) {
			var x = this.xPossitionValue[this.m_seriesValue.length - 1];
			if ((mouseX >= 1 * this.startX - 1 * x) && (mouseX <= 1 * this.startX + 1 * x) && (mouseY >= this.m_layerYpositionArray[i] * 1)) {
				toolTipData = {};
				if (IsBoolean(this.m_customtextboxfortooltip.dataTipType == "Default")) {
					toolTipData.cat = "";
					toolTipData["data"] = new Array();
					if (i == "0") {
						if ((mouseY >= this.m_layerYpositionArray[i] * 1) && (mouseY <= 1 * this.m_layerYpositionArray[i] + 1 * this.seriesValue[i] - 1)) {
							 for (var m = 0; m < seriesData[i].length; m++) {
				                	if (seriesName.length == 1) {
				                        toolTipData.cat = categoryName[i];
				                        var data = [];
				                        data[0] = {"color":legendsColor[i],"shape":this.m_legendShape};
				                        data[1] = seriesName[m];
				                        var num = seriesData[i][m] * 1;
				                        if (num % 1 != 0 && this.m_precision !== "default") {
				                            var newVal = num.toFixed((this.m_precision == 0) ? 2 : this.m_precision);
				                        } else {
				                            newVal = seriesData[i][m]*1;
				                        }
				                        var FormterData = this.getFormatterForToolTip(newVal);
				                        data[2] = FormterData;
				                        toolTipData.data.push(data);
				                    } else {
				                        toolTipData.cat = categoryName[i];
				                        var data = [];
				                        data[0] = {"color":legendsColor[i],"shape":this.m_legendShape};
				                        data[1] = seriesName[m];
				                        var num = seriesData[i][m] * 1;
				                        if (num % 1 != 0 && this.m_precision !== "default") {
				                            newVal = num.toFixed((this.m_precision == 0) ? 2 : this.m_precision);
				                        } else {
				                            newVal = seriesData[i][m]*1;
				                        }
				                        var FormterData = this.getFormatterForToolTip(newVal);
				                        data[2] = FormterData;
				                        data[3] = seriesPercent[i][m].toFixed(2) + "%";
				                        toolTipData.data.push(data);
				                    }
				                }
				                toolTipData.highlightIndex = this.getDrillColor(mouseX, mouseY);
						}
					} else {
						if ((mouseY <= 1 * this.m_layerYpositionArray[i] + 1 * this.seriesValue[i])) {
							 for (var m = 0; m < seriesData[i].length; m++) {
				                	if (seriesName.length == 1) {
				                        toolTipData.cat = categoryName[i];
				                        var data = [];
				                        data[0] = {"color":legendsColor[i],"shape":this.m_legendShape};
				                        data[1] = seriesName[m];
				                        var num = seriesData[i][m] * 1;
				                        if (num % 1 != 0 && this.m_precision !== "default") {
				                            newVal = num.toFixed((this.m_precision == 0) ? 2 : this.m_precision);
				                        } else {
				                            newVal = this.seriesData[i][m] * 1;
				                        }
				                        var FormterData = this.getFormatterForToolTip(newVal);
				                        data[2] = FormterData;
				                        toolTipData.data.push(data);
				                    } else {
				                        toolTipData.cat = categoryName[i];
				                        var data = [];
				                        data[0] = {"color":legendsColor[i],"shape":this.m_legendShape};
				                        data[1] = seriesName[m];
				                        var num = seriesData[i][m] * 1;
				                        if (num % 1 != 0 && this.m_precision !== "default") {
				                            newVal = num.toFixed((this.m_precision == 0) ? 2 : this.m_precision);
				                        } else {
				                            newVal = seriesData[i][m]*1;
				                        }
				                        var FormterData = this.getFormatterForToolTip(newVal);
				                        data[2] = FormterData;
				                        data[3] = seriesPercent[i][m].toFixed(2) + "%";
				                        toolTipData.data.push(data);
				                    }
				                }
				                toolTipData.highlightIndex = this.getDrillColor(mouseX, mouseY);
						}
					}
				} else {
					toolTipData = this.getDataProvider()[i];
				}
			} else {
				this.hideToolTip();
			}
		}
		return toolTipData;
	} else {
		/** remove return "" because its shows length undefined when Category is empty */
		return toolTipData;
	}
};
/** @description Getting Drill Bar Color**/
PyramidChart.prototype.getDrillColor = function (mouseX, mouseY) {
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory)))) {
		for (var i = this.m_layerYpositionArray.length; i >= 0; i--) {
			if(mouseY >= this.m_layerYpositionArray[i]){
				for (var j = 0, Innerlength = this.yPos[i].length; j < Innerlength; j++) {
					if (mouseY >= this.m_layerYpositionArray[i] && mouseY <= (this.yPos[i][j] * 1)) {
								return j;
					}	
				}
			}
		}
	}
};
/** @description Getter Method for formatting the text values. **/
PyramidChart.prototype.getFormatterText = function (data) {
	var dataWithFormatter = data;
	if (!IsBoolean(this.getFixedLabel()))
		dataWithFormatter = this.m_yAxis.getFormattedText(data);
	return dataWithFormatter;
};

/** @description Getter Method of StartX. **/
PyramidChart.prototype.getStartX = function () {
	var marginForYAxisLabels = 50;
	return (this.m_x + marginForYAxisLabels);
};

/** @description Getter Method of StartY. **/
PyramidChart.prototype.getStartY = function () {
	var marginForXAxisLabels = 50;
	return (this.m_y + this.m_height - marginForXAxisLabels);
};

/** @description Getter Method of EndX. **/
PyramidChart.prototype.getEndX = function () {
	var rightSideMargin = 50;
	return (this.m_x + this.m_width - rightSideMargin);
};

/** @description Getter Method of EndY. **/
PyramidChart.prototype.getEndY = function () {
	var marginForTitle = 10;
	return (this.m_y + marginForTitle);
};

/** @description Getter Method of Margin For SubTitle. **/
PyramidChart.prototype.getMarginForSubTitle = function () {
	var margin;
	if(IsBoolean(this.m_subTitle.m_showsubtitle) && this.m_subTitle.m_formattedDescription.length == 3){
		margin = (this.m_subTitle.getDescription() != "") ? (this.m_subTitle.getFontSize() * 1.5) + (this.m_chartpaddings.topTitleToSubtitle * 1) : 10;
	} else if (IsBoolean(this.m_subTitle.m_showsubtitle))
		margin = (this.m_subTitle.getDescription() != "") ? (this.m_subTitle.getFontSize() * 1.5) : 10;
	else
		margin = 0;
	return margin;
};
//# sourceURL=PyramidChart.js