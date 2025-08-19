/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: SimpleFunnelChart.js
 * @description SimpleFunnelChart
 **/
function SimpleFunnelChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();

	this.m_x = 20;
	this.m_y = 20;
	this.m_width = 400;
	this.m_height = 300;

	this.m_isEmptySeries = true;
	this.m_showlayervalue = false;

	this.m_layerXpositionArray = [];
	this.m_layerYpositionArray = [];
	this.m_layerWidthArray = [];
	this.m_layerHeightArray = [];
	this.m_layerXLeftpositionArray = [];
	this.m_layerXRightpositionArray = [];
	this.m_seriesDataAndLegendName = [];
	this.m_layer = new Layer();
	this.m_yAxis = new Yaxis();
	this.m_layerCalculation = new LayerCalculation();
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_legendShape = "invertedtriangle";
	this.calculatedPercent = [];
};

/** @description Making prototype of chart class to inherit its properties and methods into SimpleFunnelChart. **/
SimpleFunnelChart.prototype = new Chart();

/** @description This method will set class variable values with JSON values **/
SimpleFunnelChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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
SimpleFunnelChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};
/** @description  initialization of draggable div and its inner Content **/
SimpleFunnelChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/** @description This method will parse the chart JSON and create a container **/
SimpleFunnelChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};
/** @description Setter Method of Fields according to fieldType **/
SimpleFunnelChart.prototype.setFields = function (fieldsJson) {
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
SimpleFunnelChart.prototype.setCategory = function (categoryJson) {
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
SimpleFunnelChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = [];
	this.m_legendNames = [];
	this.m_seriesVisibleArr = {};
	this.m_visibleSeriesNames = {};
	this.m_plotTrasparencyArray = [];
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
SimpleFunnelChart.prototype.getLegendInfo = function () {
	return this.legendMap;
};
/** @description Setter Method of LegendNames. **/
SimpleFunnelChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};

/** @description Setter Method of All FieldsName. **/
SimpleFunnelChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getCategoryNames()[i]);
	}
	for (var j = 0; j < this.getSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getSeriesNames()[j]);
	}
};

/** @description Getter Method of All FieldsName. **/
SimpleFunnelChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

/** @description Setter Method for set All Fields DisplayName. **/
SimpleFunnelChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

/** @description Setter Method of Category Data. **/
SimpleFunnelChart.prototype.setCategoryData = function () {
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
SimpleFunnelChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	var arr = [];
	this.multiSeriesData = [];
	this.m_isEmptySeries = true;
	if(this.getSeriesNames().length > 0){
		this.m_isEmptySeries = false;
		for (var  i = 0,k = 0; k< this.getSeriesNames().length; k++) {
			if(this.m_seriesVisibleArr[this.getSeriesDisplayNames()[k]]){
			arr[i] = this.getDataFromJSON(this.getSeriesNames()[k]);
			i++;
			}
		}
		for (var i = 0, length = arr[0].length; i < length; i++) {
			this.multiSeriesData [i] = [];
			for (var j = 0, innerlength = arr.length; j < innerlength; j++) {
				this.multiSeriesData [i][j] = arr[j][i];
			}	
		}
		for (var h = 0, length = this.multiSeriesData .length; h < length; h++) {
			this.m_seriesData.push(this.getArraySUM(this.multiSeriesData [h]));
		}	
	}	
};
/** @description will return sum of all element of array. **/
SimpleFunnelChart.prototype.getArraySUM = function (arr) {
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
SimpleFunnelChart.prototype.setSeriesColor = function (m_seriesColor) {
	var colorArray = this.m_seriescolor.split(",");
	this.seriesColors = [];
	var slicesCount = this.getSeriesData().length - 1;
	for (var i = 0, count = 0; i <= slicesCount; i++) {
		var color = (colorArray[i]) ? colorArray[i] : this.seriesColors[count++];
		this.seriesColors[i] = convertColorToHex(color);
	}
};

/** @description Getter Method of DataProvider **/
SimpleFunnelChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};
/** @description Getter Method of Category Names. **/
SimpleFunnelChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};
/** @description Getter Method of Category DisplayName. **/
SimpleFunnelChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};
/** @description Getter Method of SeriesNames. **/
SimpleFunnelChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};
/** @description Getter Method of Series DisplayName. **/
SimpleFunnelChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};
/** @description Getter Method of LegendNames. **/
SimpleFunnelChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};
/** @description Getter Method of All FieldsDisplayName. **/
SimpleFunnelChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};
/** @description Getter Method of Category Data. **/
SimpleFunnelChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};
/** @description Getter Method of Series Data. **/
SimpleFunnelChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};
/** @description Getter Method of SeriesColors. **/
SimpleFunnelChart.prototype.getSeriesColor = function () {
	return this.seriesColors;
};
/** @description Getter Method of SeriesColor. **/
SimpleFunnelChart.prototype.getSeriesColors = function () {
	return (this.visibleSeriesColors == undefined) ? this.m_seriesColors : this.visibleSeriesColors;
};

/** @description initialization of SimpleFunnelChart. **/
SimpleFunnelChart.prototype.init = function () {
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
	}
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};

/** @description initialize the calculation  of the SimpleFunnelChart. **/
SimpleFunnelChart.prototype.initializeCalculation = function () {
	 var titleMargin = 10;
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
	    

	    this.m_seriesDataAndLegendName.sort(function(a, b) {
	        return a[0] - b[0];
	    });

	    var sortData = [];
	    var sortedLegend = [];
	   // var sortedColor=[];
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

	    //this.m_seriesColor=sortedColor;
	    this.m_seriesValue = sortData;
	    this.m_displaySeriesDataInToolTipFlagArray = sortedflag;
	    this.visibleLegend = sortedLegend;
	    this.m_categoryValue = sortedCatData;
	    this.m_percentSeries = perData;
	    this.m_seriesDataArray = seriesArray;
	    this.allDataObj = allData;// sorted all data objects

	    this.startX = 1 * (this.m_width / 2) + 1 * (this.m_x);
	    this.startY = 1 * (this.m_height) + 1 * (this.m_y) - this.m_height / 20;
	    this.m_layerCalculation.init(this);
	    this.m_layer.init(this);
	    this.m_yAxis.init(this, this.m_layerCalculation);
	    var visibleData = this.mapSeriesWithCategory(sortedCatData, sortData, sortedLegend, this.m_seriesColor);
	    this.visibleSeriesData = visibleData.ser;
	    this.funnelWidth = this.m_width * 3 / 4;
	    this.funnelHeight = this.m_layerCalculation.getFunnelHeight();
	    this.sliceGap = this.m_layerCalculation.sliceSpace(visibleData.ser);
	    this.visibleSeries = this.m_layerCalculation.updatedSeriesValue(visibleData.ser);
	    this.calculatedPercent = this.m_layerCalculation.getCalculatePercent(visibleData.ser);
	    this.angle = this.m_layerCalculation.angle();
	    this.setMapForDrill(visibleData.ser, (this.visibleCategories));
	  }
};
/** @description Method will calculate percentage of each seriesData Array **/
SimpleFunnelChart.prototype.setPercentageForHundred = function () {
	var serData = this.multiSeriesData ;
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
SimpleFunnelChart.prototype.setVisibleData = function () {
	this.seriesDisplayName = [];
	this.visibleCategoryNames = [];
	this.seriesData = [];
	this.seriesPercent = [];
	this.allDataObjects = {};
	var legendArr = [];
	this.visibleTrasparency = [];
	this.m_legendNames.length = 0;
	this.m_visibleseriesdatalabel = [];
	
	 for (var i = 0,k = 0; k< this.getSeriesNames().length; k++) {
			if(this.m_seriesVisibleArr[this.getSeriesDisplayNames()[k]]){
				this.seriesDisplayName[i] = this.getSeriesDisplayNames()[k];
				this.visibleTrasparency[i] = this.m_plotTrasparencyArray[k];
				this.m_visibleseriesdatalabel[i] = this.m_seriesDataLabelProperty[k];
				i++;
			}
     }
     for (var j = 0, l = 0; l< this.m_categoryValue.length; l++) {
			if(this.m_seriesVisibleArr[this.m_categoryValue[l]]){
				this.visibleCategoryNames[j] = this.m_categoryValue[l];
				this.seriesData[j] = this.m_seriesDataArray[l];
				this.seriesPercent[j] = this.m_percentSeries[l];
				this.allDataObjects[j] = this.allDataObj[l];
				legendArr[j] = this.visibleLegend[l];
				j++;
			}
     }
     this.m_legendNames = this.reverseSeries(legendArr);// update visible legend names
};
/** @description This Method map the series value according to category. **/
SimpleFunnelChart.prototype.mapSeriesWithCategory = function (cat, ser, legends, colors) {
	var category = cat;
	var series = ser;
	var col = [];
	var flag = true;
	if(this.m_defaultlegendfields && !IsBoolean(this.m_designMode)) {
		for(var k = 0; k < this.m_defaultlegendfields.length; k++) {
				flag = this.m_defaultlegendfields[k].value;
				if(flag == false) {
					break;
				}
			}
	}
	for (var i = 0; i < category.length; i++)
		col.push(colors[i]);
	var color = this.reverseSeries(col);

	for (var i = 0; i < category.length; i++) {
		if (this.m_seriesVisibleArr[category[i]] == undefined)
			this.m_seriesVisibleArr[category[i]] = flag;
		else {}
	}
	this.visibleCategories = [];
	this.visibleSeries = [];
	this.visibleSeriesNames = [];
	this.visibleSeriesColors = [];
	this.legendMap = {};
	for (var k = 0, i = 0; i < category.length; i++) {
		if (this.m_seriesVisibleArr[category[i]]) {
			this.visibleCategories[k] = category[i];
			this.visibleSeriesColors[k] = color[i];
			this.visibleSeries[k] = series[i];
			k++;
		}
	}
	for (var k = 0, j = 0; j< this.getSeriesNames().length; j++) {
		if(this.m_visibleSeriesNames[this.getSeriesNames()[j]]){
			this.visibleSeriesNames[k] = this.getSeriesNames()[j];
			k++;
		}
	}
	this.visibleSeriesColors = this.reverseSeries(this.visibleSeriesColors);
	legends = this.reverseSeries(legends);
	for (var k = 0, i = 0; i < legends.length; i++) {
		//if (this.m_seriesVisibleArr[legends[i]]) {
			var tempMap = {
				"seriesName" : legends[i],
				"displayName" : legends[i],
				"color" : this.reverseSeries(color)[i],
				"shape" : this.m_legendShape
			};
			this.legendMap[legends[i]] = tempMap;
			k++;
		//}
	}

	return {
		cat : this.visibleCategories,
		ser : this.visibleSeries,
		color : this.visibleSeriesColors
	};
};

/** @description Drawing of chart started by drawing different parts of chart like ChartFrame,Title,SubTitle. **/
SimpleFunnelChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	var map = this.IsDrawingPossible();
	if (IsBoolean(map.permission)) {
		this.drawSimpleFunnel();
		this.drawValueOnLayers();
	} else {
		this.drawMessage(map.message);
	}
};

/** @description Will check drawing Is possible or not. **/
SimpleFunnelChart.prototype.IsDrawingPossible = function () {
	var map = {};
	if (!IsBoolean(this.isEmptyCategory)) {
		if (!IsBoolean(this.m_isEmptySeries)) {
			if (IsBoolean(this.isVisibleSeriesAvailable()) && this.visibleSeries.length > 0)
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
SimpleFunnelChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

/** @description Will Draw SubTitle on canvas if showSubTitle set to true. **/
SimpleFunnelChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

/** @description will draw the ChartFrame  of the AreaChart. **/
SimpleFunnelChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

/** @description this methods checks the series data is available or not **/
SimpleFunnelChart.prototype.isSeriesDataAvailable = function(legendObj) {
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
/** @description will draw the SimpleFunnel. **/
SimpleFunnelChart.prototype.drawSimpleFunnel = function () {
	this.m_layerYpositionArray = [];	
	this.m_layerXpositionArray = [];
	this.m_layerWidthArray = [];
	this.m_layerHeightArray = [];
	this.m_layerXLeftpositionArray = [];
	this.m_layerXRightpositionArray = [];
	this.yPos =[];
	
	this.m_seriescolorforFunnel = this.updateSeriesColor(this.visibleSeriesColors);
	this.perviousValue  = 0;
	this.currentValue = 0;
	for (var i = 0; i < this.visibleSeries.length; i++) {
		if (i < 1) // for the first slice
		{
			this.currentValue = 1 * (this.visibleSeries[i]);
			this.m_layer.drawFirstSlice(i, this.currentValue, this.m_seriescolorforFunnel[(this.visibleSeries.length - 1) - i], this.seriesPercent, this.visibleTrasparency);
		} else {
			this.perviousValue = this.currentValue;
			this.currentValue = 1 * (this.perviousValue) + 1 * (this.visibleSeries[i]) + 1 * (this.sliceGap);
			this.m_layer.drawOtherSlices(i, this.perviousValue, this.currentValue, this.m_seriescolorforFunnel[(this.visibleSeries.length - 1) - i], this.seriesPercent, this.visibleTrasparency);
		}
	}
};
/** @description will get the Data Label for Series. **/
SimpleFunnelChart.prototype.getDataLabel = function(){
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
SimpleFunnelChart.prototype.drawValueOnLayers = function () {
	if(IsBoolean(this.m_visibleseriesdatalabel[0].showDataLabel)) {
		var percent = IsBoolean(this.m_showlayervalue) ? this.getRoundValue(this.calculatedPercent, 100) : this.getDataLabel();		
		for(var i = 0,count=1; i < this.m_layerXpositionArray.length ; i++) {
			this.ctx.beginPath();
			this.ctx.fillStyle = this.m_visibleseriesdatalabel[0].dataLabelFontColor;
			//this.ctx.font = this.fontScaling(this.m_visibleseriesdatalabel[0].dataLabelFontColor)+"px "+selectGlobalFont(this.m_visibleseriesdatalabel[0].datalabelFontFamily);
			this.ctx.font = this.m_visibleseriesdatalabel[0].datalabelFontStyle + " " + this.m_visibleseriesdatalabel[0].datalabelFontWeight + " " +
            this.fontScaling(this.m_visibleseriesdatalabel[0].dataLabelFontSize) + "px " + selectGlobalFont(this.m_visibleseriesdatalabel[0].datalabelFontFamily);
			this.ctx.textAlign = "left";
			var text =IsBoolean(this.m_showlayervalue) ? (percent[i]+"%") : this.getFormattedText(percent[i]);
			var textWidth = this.ctx.measureText(text).width;
			var x1,x2 = "";
			if( i % 2 == 0  || i==0) {
				x1 = this.m_layerXRightpositionArray[i]*1;
				x2 = this.m_layerXRightpositionArray[i]*1 + 10*count;
			} else {
				x1 = this.m_layerXLeftpositionArray[i]*1;
				x2 = (this.m_layerXLeftpositionArray[i]*1 - 10*count);
			}		
			var y1 = (i==0)?(this.m_layerYpositionArray[i]*1 + ( this.startY*1 - this.m_layerYpositionArray[i]*1 )/2):(this.m_layerYpositionArray[i]*1 + ( this.m_layerYpositionArray[i-1]*1 - this.m_layerYpositionArray[i]*1 )/2);
			var y2 = y1;
			
			this.ctx.lineWidth = 0.5;
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
SimpleFunnelChart.prototype.getFormattedText = function(value) {
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
SimpleFunnelChart.prototype.getupdatetext = function (textXPosition,textWidth,text,orgX, rightSide) {
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
SimpleFunnelChart.prototype.calculateTitleWidth = function (font, width) {
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
SimpleFunnelChart.prototype.updateSeriesData = function (array) {
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
SimpleFunnelChart.prototype.setMapForDrill = function (serValue, catValue) {
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
SimpleFunnelChart.prototype.getMapForDrill = function () {
	return this.m_updateDataForDrill;
};

/** @description This method will check series available or not. **/
SimpleFunnelChart.prototype.isVisibleSeriesAvailable = function () {
	for (var index = 0; index < this.getSeriesNames().length; index++) {
		if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesDisplayNames[index]])) {
			return true;
		}
	}
	return false;
};

/** @description Getter method for color value according to the data. **/
SimpleFunnelChart.prototype.getColorAccordingData = function (colorArray) {
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

/** @description Method will return reverse array. **/
SimpleFunnelChart.prototype.reverseSeries = function (seriesValue) {
	var reverseValue = [];
	for (var i = seriesValue.length - 1; i >= 0; i--) {
		reverseValue.push(seriesValue[i]);
	}
	return reverseValue;
};

/** @description This method will initialize SeriesValues. **/
SimpleFunnelChart.prototype.initializeSeriesValues = function () {
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
SimpleFunnelChart.prototype.updateCategoryData = function (array) {
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
SimpleFunnelChart.prototype.updateSeriesColor = function (array) {
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
SimpleFunnelChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory))) && IsBoolean(this.isVisibleSeriesAvailable())) {
		for (var i = 0; i < this.visibleSeries.length; i++) {
			if ((mouseX >= 1 * this.startX - this.funnelWidth / 2) && (mouseX <= 1 * this.startX + 1 * this.funnelWidth / 2) && (mouseY <= this.m_layerYpositionArray[i] * 1 + 1 * this.visibleSeries[i] + 1 * 7)) // "7" is the half height of ellipse.
			{
				if (i == this.visibleSeries.length - 1) {
					if ((mouseY >= this.m_layerYpositionArray[i] * 1 - 1 * 7)) {
						for (var l = 0; l<this.m_layerYpositionArray.length; l++) {
							if(mouseY >= this.m_layerYpositionArray[l]){
								for (var j = 0; j< this.yPos[l].length; j++) {
									if (mouseY >= this.m_layerYpositionArray[l] && mouseY >= (this.yPos[l][j] * 1)) {
								        var fieldNameValueMap = this.getFieldNameValueMap(i);
										var drillColor = this.reverseSeries(this.visibleSeriesColors)[i];
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
				} else if (i == "0") {
					if ((mouseY <= this.m_layerYpositionArray[i] * 1 + 1 * this.visibleSeries[i] + 1 * 1) && (mouseY >= this.m_layerYpositionArray[i] * 1)) {
						for (var l = 0; l<this.m_layerYpositionArray.length; l++) {
							if(mouseY >= this.m_layerYpositionArray[l]){
								for (var j = 0; j< this.yPos[l].length; j++) {
									if (mouseY >= this.m_layerYpositionArray[l] && mouseY >= (this.yPos[l][j] * 1)) {
								        var fieldNameValueMap = this.getFieldNameValueMap(i);
										var drillColor = this.reverseSeries(this.visibleSeriesColors)[i];
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
					if ((mouseY >= this.m_layerYpositionArray[i] * 1 + 1 * (this.sliceGap))) {
						for (var l = 0; l<this.m_layerYpositionArray.length; l++) {
							if(mouseY >= this.m_layerYpositionArray[l]){
								for (var j = 0; j< this.yPos[l].length; j++) {
									if (mouseY >= this.m_layerYpositionArray[l] && mouseY >= (this.yPos[l][j] * 1)) {
								        var fieldNameValueMap = this.getFieldNameValueMap(i);
										var drillColor = this.reverseSeries(this.visibleSeriesColors)[i];
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
SimpleFunnelChart.prototype.getFieldNameValueMap = function (i) {
	var m_fieldNameValueMap = new Object();
	var afn = this.getAllFieldsName();
	for (var l = 0; l < afn.length; l++) {
		m_fieldNameValueMap[afn[l]] = this.allDataObjects[i][afn[l]];//map fieldData with fieldName
	}
	return m_fieldNameValueMap;
};

SimpleFunnelChart.prototype.getLegendTableContent = function () {
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
SimpleFunnelChart.prototype.getToolTipData = function (mouseX, mouseY) {
	var toolTipData;
	if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory) && IsBoolean(this.isVisibleSeriesAvailable()) && IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")) {
	    var legendsColor = this.reverseSeries(this.visibleSeriesColors);
	    var seriesName = this.seriesDisplayName;
	    var categoryName = this.visibleCategoryNames;
	    var percent = this.calculatedPercent;
	    var seriesData = this.seriesData;
	    var seriesPercent = this.seriesPercent;

	    for (var i = 0; i < this.m_layerYpositionArray.length; i++) {
	        if ((mouseX >= 1 * this.startX - this.funnelWidth / 2) && (mouseX <= 1 * this.startX + 1 * this.funnelWidth / 2) && (mouseY <= this.m_layerYpositionArray[i] * 1 + 1 * this.visibleSeries[i] + 1 * 7)) {
	            toolTipData = {};
	            if (IsBoolean(this.m_customtextboxfortooltip.dataTipType == "Default")) {
		            toolTipData.cat = "";
		            toolTipData["data"] = new Array();
		            if (i == this.visibleSeries.length - 1) {
		                if ((mouseY >= this.m_layerYpositionArray[i] * 1 - 1 * 7)) {
		                    for (var m = 0; m < seriesData[i].length; m++) {
		                    	   var newVal;
		                    	if (seriesName.length == 1) {
		                            toolTipData.cat = categoryName[i];
		                            var data = [];
		                            data[0] = {
		                                "color": legendsColor[i],
		                                "shape": this.m_legendShape
		                            };
		                            data[1] = seriesName[m];
		                            var num = seriesData[i][m] * 1;
		                            if (num % 1 != 0 && this.m_precision !== "default") {
		                                newVal = num.toFixed((this.m_precision == 0) ? 2 : this.m_precision);
		                            } else {
		                                newVal = seriesData[i][m] * 1;
		                            }
		                            var FormterData = this.getFormatterForToolTip(newVal);
		                            data[2] = FormterData;
		                            toolTipData.data.push(data);
		                        } else {
		                            toolTipData.cat = categoryName[i];
		                            var data = [];
		                            data[0] = {
		                                "color": legendsColor[i],
		                                "shape": this.m_legendShape
		                            };
		                            data[1] = seriesName[m];
		                            var num = seriesData[i][m] * 1;
		                            if (num % 1 != 0 && this.m_precision !== "default") {
		                                newVal = num.toFixed((this.m_precision == 0) ? 2 : this.m_precision);
		                            } else {
		                                newVal = seriesData[i][m] * 1;
		                            }
		                            var FormterData = this.getFormatterForToolTip(newVal);
		                            data[2] = FormterData;
		                            data[3] = seriesPercent[i][m].toFixed(2) + "%";
		                            toolTipData.data.push(data);
		                        }
		                    }
		                    toolTipData.highlightIndex = this.getDrillColor(mouseX, mouseY);
		                }
		            } else if (i == "0") {
		                if ((mouseY <= this.m_layerYpositionArray[i] * 1 + 1 * this.visibleSeries[i] + 1 * 1) && (mouseY >= this.m_layerYpositionArray[i] * 1)) {
		                    for (var m = 0; m < seriesData[i].length; m++) {
		                        if (seriesName.length == 1) {
		                            toolTipData.cat = categoryName[i];
		                            var data = [];
		                            data[0] = {
		                                "color": legendsColor[i],
		                                "shape": this.m_legendShape
		                            };
		                            data[1] = seriesName[m];
		                            var num = seriesData[i][m] * 1;
		                            if (num % 1 != 0 && this.m_precision !== "default") {
		                                newVal = num.toFixed((this.m_precision == 0) ? 2 : this.m_precision);
		                            } else {
		                                newVal = seriesData[i][m] * 1;
		                            }
		                            var FormterData = this.getFormatterForToolTip(newVal);
		                            data[2] = FormterData;
		                            toolTipData.data.push(data);
		                        } else {
		                            toolTipData.cat = categoryName[i];
		                            var data = [];
		                            data[0] = {
		                                "color": legendsColor[i],
		                                "shape": this.m_legendShape
		                            };
		                            data[1] = seriesName[m];
		                            var num = seriesData[i][m] * 1;
		                            if (num % 1 != 0 && this.m_precision !== "default") {
		                                newVal = num.toFixed((this.m_precision == 0) ? 2 : this.m_precision);
		                            } else {
		                                newVal = seriesData[i][m] * 1;
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
		                if ((mouseY >= this.m_layerYpositionArray[i] * 1 + 1 * (this.sliceGap))) {
		                    for (var m = 0; m < seriesData[i].length; m++) {
		                        if (seriesName.length == 1) {
		                            toolTipData.cat = categoryName[i];
		                            var data = [];
		                            data[0] = {
		                                "color": legendsColor[i],
		                                "shape": this.m_legendShape
		                            };
		                            data[1] = seriesName[m];
		                            var num = seriesData[i][m] * 1;
		                            if (num % 1 != 0 && this.m_precision !== "default") {
		                                newVal = num.toFixed((this.m_precision == 0) ? 2 : this.m_precision);
		                            } else {
		                                newVal = seriesData[i][m] * 1;
		                            }
		                            var FormterData = this.getFormatterForToolTip(newVal);
		                            data[2] = FormterData;
		                            toolTipData.data.push(data);
		                        } else {
		                            toolTipData.cat = categoryName[i];
		                            var data = [];
		                            data[0] = {
		                                "color": legendsColor[i],
		                                "shape": this.m_legendShape
		                            };
		                            data[1] = seriesName[m];
		                            var num = seriesData[i][m] * 1;
		                            if (num % 1 != 0 && this.m_precision !== "default") {
		                                newVal = num.toFixed((this.m_precision == 0) ? 2 : this.m_precision);
		                            } else {
		                                newVal = seriesData[i][m] * 1;
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
SimpleFunnelChart.prototype.getDrillColor = function (mouseX, mouseY) {
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory)))) {
		for (var i = 0; i<this.m_layerYpositionArray.length; i++) {
			if(mouseY >= this.m_layerYpositionArray[i]){
				for (var j = 0; j< this.yPos[i].length; j++) {
					if (mouseY >= this.m_layerYpositionArray[i] && mouseY >= (this.yPos[i][j] * 1)) {
								return j;
					}	
				}
			}
		}
	}
};
/** @description Getter Method for formatting the text values. **/
SimpleFunnelChart.prototype.getFormatterText = function (data) {
	var dataWithFormatter = data;
	if (!IsBoolean(this.getFixedLabel()))
		dataWithFormatter = this.m_yAxis.getFormattedText(data);
	return dataWithFormatter;
};

/** @description Getter Method of StartX. **/
SimpleFunnelChart.prototype.getStartX = function () {
	var marginForYAxisLabels = 50;
	return (this.m_x + marginForYAxisLabels);
};
/** @description Getter Method of StartY. **/
SimpleFunnelChart.prototype.getStartY = function () {
	var marginForXAxisLabels = 50;
	return (this.m_y + this.m_height - marginForXAxisLabels);
};
/** @description Getter Method of EndX. **/
SimpleFunnelChart.prototype.getEndX = function () {
	var rightSideMargin = 50;
	return (this.m_x + this.m_width - rightSideMargin);
};
/** @description Getter Method of EndY. **/
SimpleFunnelChart.prototype.getEndY = function () {
	var marginForTitle = 50;
	return (this.m_y + marginForTitle);
};
/** @description Getter Method of Margin For SubTitle. **/
SimpleFunnelChart.prototype.getMarginForSubTitle = function () {
	var margin;
	if(IsBoolean(this.m_subTitle.m_showsubtitle) && this.m_subTitle.m_formattedDescription.length == 3){
		margin = (this.m_subTitle.getDescription() != "") ? (this.m_subTitle.getFontSize() * 1.5) + (this.m_chartpaddings.topTitleToSubtitle * 1) : 10;
	} else if (IsBoolean(this.m_subTitle.m_showsubtitle))
		margin = (this.m_subTitle.getDescription() != "") ? (this.m_subTitle.getFontSize() * 1.5) : 10;
	else
		margin = 0;
	return margin;
};
//# sourceURL=SimpleFunnelChart.js