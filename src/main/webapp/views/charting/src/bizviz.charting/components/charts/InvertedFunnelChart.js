/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: InvertedFunnelChart.js
 * @description InvertedFunnelChart
 **/
function InvertedFunnelChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();

	this.m_x = 20;
	this.m_y = 20;
	this.m_width = 400;
	this.m_height = 300;

	this.m_layerXpositionArray = [];
	this.m_layerYpositionArray = [];
	this.m_layerWidthArray = [];
	this.m_layerHeightArray = [];
	this.m_layerXLeftpositionArray = [];
	this.m_layerXRightpositionArray = [];
	this.m_layerXCenterpositionArray = [];
	this.m_seriesDataAndLegendName = [];
	this.m_layer = new Layer();
	this.m_yAxis = new Yaxis();
	this.m_layerCalculation = new LayerCalculation();
	this.m_showlayervalue = false;

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_legendShape = "triangle";
	this.calculatedPercent = [];
};

/** @description Making prototype of chart class to inherit its properties and methods into InvertedFunnelChart. **/
InvertedFunnelChart.prototype = new Chart();

/** @description This method will set class variable values with JSON values **/
InvertedFunnelChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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
InvertedFunnelChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description  initialization of draggable div and its inner Content **/
InvertedFunnelChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/** @description This method will parse the chart JSON and create a container **/
InvertedFunnelChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Setter Method of Fields according to fieldType **/
InvertedFunnelChart.prototype.setFields = function (fieldsJson) {
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
InvertedFunnelChart.prototype.setCategory = function (categoryJson) {
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
InvertedFunnelChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = [];
	this.m_legendNames = [];
	this.m_seriesVisibleArr = {};
	this.m_visibleSeriesNames = {};
	this.m_plotTrasparencyArray = [];
	this.m_seriesDataLabelProperty = [];
	this.m_additionalDataField = {};
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
		var additionalFieldName = (this.getProperAttributeNameValue(seriesJson[i], "AdditionalField") !== undefined) ? (this.getProperAttributeNameValue(seriesJson[i], "AdditionalField")) : "";
		this.m_additionalDataField[this.m_seriesNames[i]] =  additionalFieldName.split(",");
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
		// This condition is add for flex because flex is unable to generate visible
		//if(this.m_seriesVisibleArr[this.m_seriesDisplayNames[i]] =="undefined" || this.m_seriesVisibleArr[this.m_seriesDisplayNames[i]] ==undefined )
		//this.m_seriesVisibleArr[this.m_seriesDisplayNames[i]] = true;
		var tempMap = {
			"seriesName" : this.m_seriesNames[i],
			"displayName" : this.m_seriesDisplayNames[i],
			"color" : this.m_seriesColors[i],
			"shape" : "point",
			"index": i
		};
		this.legendMap[this.m_seriesNames[i]] = tempMap;
	}
};

/** @description Getter Method of LegendInfo . **/
InvertedFunnelChart.prototype.getLegendInfo = function () {
	return this.legendMap;
};

/** @description Getter Method of LegendInfo . **/
InvertedFunnelChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};

/** @description Setter Method of All FieldsName. **/
InvertedFunnelChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getCategoryNames()[i]);
	}
	for (var j = 0; j < this.getSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getSeriesNames()[j]);
	}
};

/** @description Setter Method for set All Fields DisplayName. **/
InvertedFunnelChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

/** @description Setter Method of Category Data. **/
InvertedFunnelChart.prototype.setCategoryData = function () {
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
InvertedFunnelChart.prototype.setSeriesData = function () {
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
InvertedFunnelChart.prototype.getArraySUM = function (arr) {
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
InvertedFunnelChart.prototype.setSeriesColor = function (m_seriesColor) {
	var colorArray = this.m_seriescolor.split(",");
	this.seriesColors = [];
	var slicesCount = this.getSeriesData().length - 1;
	for (var i = 0, count = 0; i <= slicesCount; i++) {
		var color = (colorArray[i]) ? colorArray[i] : this.seriesColors[slicesCount - count++];
		this.seriesColors[slicesCount - i] = convertColorToHex(color);
	}
};

/** @description Getter Method of DataProvider **/
InvertedFunnelChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description Getter Method of Category Names. **/
InvertedFunnelChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};

/** @description Getter Method of Category DisplayName. **/
InvertedFunnelChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

/** @description Getter Method of SeriesNames. **/
InvertedFunnelChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};

/** @description Getter Method of Series DisplayName. **/
InvertedFunnelChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};

/** @description Getter Method of LegendNames. **/
InvertedFunnelChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};

/** @description Getter Method of All FieldsName. **/
InvertedFunnelChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

/** @description Getter Method of All FieldsDisplayName. **/
InvertedFunnelChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

/** @description Getter Method of Category Data. **/
InvertedFunnelChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

/** @description Getter Method of Series Data. **/
InvertedFunnelChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

/** @description Getter Method of SeriesColors. **/
InvertedFunnelChart.prototype.getSeriesColor = function () {
	return this.seriesColors;
};

/** @description Getter Method of SeriesColor. **/
InvertedFunnelChart.prototype.getSeriesColors = function () {
	return (this.visibleSeriesColors == undefined) ? this.m_seriesColors : this.visibleSeriesColors;
};

/** @description initialization of InvertedFunnelChart. **/
InvertedFunnelChart.prototype.init = function () {
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

/** @description initialize the calculation  of the InvertedFunnelChart. **/
InvertedFunnelChart.prototype.initializeCalculation = function () {
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
		this.startY = 1*(this.m_y) + 1*this.m_title.m_titleBarHeight + 1*this.m_subTitle.m_subTitleBarHeight;
		else
		this.startY = 1*(this.m_y) + 1*this.m_title.m_titleBarHeight;*/
		var visibleData = this.mapSeriesWithCategory(sortedCatData, sortData, sortedLegend, this.m_seriesColor);
		this.startY = 1 * (this.m_y) + 1 * this.getMarginForTitle() + 1 * this.getMarginForSubTitle();
		this.funnelWidth = this.m_width * 3 / 4;
		this.funnelHeight = this.m_layerCalculation.getFunnelHeight();
		this.sliceGap = this.m_layerCalculation.sliceSpace(visibleData.ser);
		this.visibleSeriesData = visibleData.ser;
		this.visibleSeries = this.m_layerCalculation.updatedSeriesValue(visibleData.ser);
		this.angle = this.m_layerCalculation.angle();
		this.setMapForDrill(visibleData.ser, visibleData.cat);
		this.calculatedPercent = this.m_layerCalculation.getCalculatePercent(visibleData.ser)
	}
};
/** @description This Method is to calculate percentage of multiple seriesData values. **/
InvertedFunnelChart.prototype.setPercentageForHundred = function () {
	var serData = this.multiSeriesData;
	this.m_SeriesDataInPerForHundredChart;
	var updateValue = [];
	this.seriesDataPercent = [];
	for (var i = 0, length = serData.length; i < length; i++) {
	    var totalSerData = this.getArraySUM(serData[i]);
	    updateValue[i] = [];
	    for (var j = 0, datalength = serData[i].length; j < datalength; j++) {
	        if (serData[i][j] !== "" && (!isNaN(serData[i][j]) && totalSerData !=0)) {
	        	if (this.m_charttype == "identicalStack")
	        		updateValue[i][j] = (100 / serData[i].length);
	        	else
	        		updateValue[i][j] = (serData[i][j] / totalSerData) * 100;
	        } else {
	        	/**According to requirement all type of data should have equal stack size for identicalFunnel(ref:BDD-552) */
	        	if (this.m_charttype == "identicalStack") {
	        		updateValue[i][j] = (100 / serData[i].length);
	        	} else {
	        		updateValue[i][j] = 0;
	        	}
	        }
	    }
	}
	this.seriesDataPercent = updateValue;
};
/** @description Method will set all visible data **/
InvertedFunnelChart.prototype.setVisibleData = function () {
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
InvertedFunnelChart.prototype.mapSeriesWithCategory = function (cat, ser, legends, colors) {
	var category = cat;
	var series = ser;
	var colors = colors;
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
	this.visibleSeries = [];
	this.visibleSeriesColors = [];
	this.visibleSeriesNames = [];
	this.legendMap = {};
	for (var k = 0, i = 0; i < category.length; i++) {
		if (this.m_seriesVisibleArr[category[i]]) {
			this.visibleCategories[k] = category[i];
			this.visibleSeriesColors[k] = colors[i];
			this.visibleSeries[k] = series[i];
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
	for (var k = 0, j = 0; j< this.getSeriesNames().length; j++) {
		if(this.m_visibleSeriesNames[this.getSeriesNames()[j]]){
			this.visibleSeriesNames[k] = this.getSeriesNames()[j];
			k++;
		}
	}
	return {
		cat : this.visibleCategories,
		ser : this.visibleSeries,
		color : this.visibleSeriesColors
	};
};

/** @description Drawing of chart started by drawing different parts of chart like ChartFrame,Title,SubTitle. **/
InvertedFunnelChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	var map = this.IsDrawingPossible();
	if (IsBoolean(map.permission)) {
		this.drawInvertedFunnel();
		this.drawValueOnLayers();
	} else {
		this.drawMessage(map.message);
	}
};

/** @description Will check drawing Is possible or not. **/
InvertedFunnelChart.prototype.IsDrawingPossible = function () {
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
InvertedFunnelChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

/** @description Will Draw SubTitle on canvas if showSubTitle set to true. **/
InvertedFunnelChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

/** @description will draw the ChartFrame  of the AreaChart. **/
InvertedFunnelChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

/** @description this methods checks the series data is available or not **/
InvertedFunnelChart.prototype.isSeriesDataAvailable = function(legendObj) {
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

/** @description will draw the InvertedFunnel. **/
InvertedFunnelChart.prototype.drawInvertedFunnel = function () {
	//this.m_layer.drawTriangle();
	this.m_seriescolorforFunnel = this.updateSeriesColor(this.visibleSeriesColors);
	this.m_layerYpositionArray = [];	
	this.m_layerXpositionArray = [];
	this.m_layerWidthArray = [];
	this.m_layerHeightArray = [];
	this.m_layerXLeftpositionArray = [];
	this.m_layerXRightpositionArray = [];
	this.m_layerXCenterpositionArray = [];
	this.yPos = [];
	this.perviousValue = 0;
	this.currentValue = 0;
	if (this.m_charttype == "identicalStack") {
		for (var i = 0; i < this.visibleSeries.length; i++) {
			if (i < 1) {
				this.currentValue = 1 * (this.visibleSeries[i]);
				this.m_layer.drawFirstSliceOfIdenticalStackFunnel(i, this.currentValue, this.m_seriescolorforFunnel[i], this.seriesPercent, this.visibleTrasparency);
			} else {
				this.perviousValue = this.currentValue;
				this.currentValue = 1 * (this.perviousValue) + 1 * (this.visibleSeries[i]) + 1 * (this.sliceGap);
				this.m_layer.drawOtherSlicesOfIdenticalStackFunnel(i, this.perviousValue, this.currentValue, this.m_seriescolorforFunnel[i], this.seriesPercent, this.visibleTrasparency);
			}
		}
	} else {
		for (var i = 0; i < this.visibleSeries.length; i++) {
			if (i < 1) {
				this.currentValue = 1 * (this.visibleSeries[i]);
				this.m_layer.drawFirstSlice(i, this.currentValue, this.m_seriescolorforFunnel[i], this.seriesPercent, this.visibleTrasparency);
			} else {
				this.perviousValue = this.currentValue;
				this.currentValue = 1 * (this.perviousValue) + 1 * (this.visibleSeries[i]) + 1 * (this.sliceGap);
				this.m_layer.drawOtherSlices(i, this.perviousValue, this.currentValue, this.m_seriescolorforFunnel[i], this.seriesPercent, this.visibleTrasparency);
			}
		}
	}
};

/** @description will get the Data Label for Series. **/
InvertedFunnelChart.prototype.getDataLabel = function(){
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
InvertedFunnelChart.prototype.drawValueOnLayers = function () {
	if(IsBoolean(this.m_visibleseriesdatalabel[0].showDataLabel)) {
		var percent = IsBoolean(this.m_showlayervalue) ? this.getRoundValue(this.calculatedPercent, 100) : this.getDataLabel();		
		for(var i = 0; i < this.m_layerXpositionArray.length ; i++) {
			this.ctx.beginPath();
			this.ctx.fillStyle = this.m_visibleseriesdatalabel[0].dataLabelFontColor;
			this.ctx.font = this.m_visibleseriesdatalabel[0].datalabelFontStyle + " " + this.m_visibleseriesdatalabel[0].datalabelFontWeight + " " +
            this.fontScaling(this.m_visibleseriesdatalabel[0].dataLabelFontSize) + "px " + selectGlobalFont(this.m_visibleseriesdatalabel[0].datalabelFontFamily);
			this.ctx.textAlign = "left";
			var text =IsBoolean(this.m_showlayervalue) ? (percent[i]+"%") : this.getFormattedText(percent[i]);
			var textWidth = this.ctx.measureText(text).width;
			var x1,x2 = "";
			if( i % 2 == 0  || i==0) {
				x1 = this.m_layerXRightpositionArray[i]*1;
				x2 = this.m_layerXRightpositionArray[i]*1 + 10;
			} else {
				x1 = this.m_layerXLeftpositionArray[i]*1;
				x2 = (this.m_layerXLeftpositionArray[i]*1 - 10);
			}
			var y1 = (i == 0)?(this.m_layerYpositionArray[i]*1):(i !== (this.m_layerXpositionArray.length - 1))?(this.m_layerYpositionArray[i]*1 + ( this.m_layerYpositionArray[i+1]*1 - this.m_layerYpositionArray[i]*1 )/2) - this.sliceGap*1:(this.m_layerYpositionArray[i]*1 + ((this.startY + (this.currentValue * 1 + this.sliceGap * 1)) - this.m_layerYpositionArray[i]*1 )/2) - this.sliceGap*1;
			var y2 = y1;		
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
	/** To draw additionalDataLabel values on funnel*/
	if (this.m_additionalDataField && this.m_additionalDataField[this.visibleSeriesNames[0]].length > 0) {
		this.drawAdditionalDataLabel();
	}
};
/** @description will draw the additional value on the layers according to the value. **/
InvertedFunnelChart.prototype.drawAdditionalDataLabel = function(i) {
    var keys = this.m_additionalDataField[this.visibleSeriesNames[0]];
    if (keys.length > 0) {
        for (var i = 0; i < this.m_layerXpositionArray.length; i++) {
            this.ctx.beginPath();
            this.ctx.fillStyle = this.m_visibleseriesdatalabel[0].dataLabelFontColor;
            this.ctx.font = this.m_visibleseriesdatalabel[0].datalabelFontStyle + " " + this.m_visibleseriesdatalabel[0].datalabelFontWeight + " " +
            this.fontScaling(this.m_visibleseriesdatalabel[0].dataLabelFontSize) + "px " + selectGlobalFont(this.m_visibleseriesdatalabel[0].datalabelFontFamily);
            this.ctx.textAlign = "center";
            var sliceHeight = this.m_layerHeightArray[i] * 0.5;
            var y1 = (i == 0) ? (this.m_layerYpositionArray[i] * 1) + sliceHeight : (i !== (this.m_layerXpositionArray.length - 1)) ? (this.m_layerYpositionArray[i] * 1 + (this.m_layerYpositionArray[i + 1] * 1 - this.m_layerYpositionArray[i] * 1) / (keys.length * 1.5)) - this.sliceGap * 1 : (this.m_layerYpositionArray[i] * 1 + ((this.startY + (this.currentValue * 1 + this.sliceGap * 1)) - this.m_layerYpositionArray[i] * 1) / (keys.length * 1.5)) - this.sliceGap * 1;
            var maxWidth = (this.m_layerWidthArray[i] * 1) - 2;
            var centerX = this.m_layerXCenterpositionArray[i] * 1;
            var padding = 0;
            for (var j = 0; j < keys.length; j++) {
                if (this.allDataObjects[i][keys[j]]) {
                    var value = (this.allDataObjects[i][keys[j]]).toString();
                    value = (!isNaN(value) && value !== "") ? this.getFormattedText(value) : value;
                    var txtWidth = this.ctx.measureText(value).width
                    if (txtWidth > maxWidth) {
                        var newTxt = "";
                        for (var k = 0; k < value.length; k++) {
                            if (maxWidth > this.ctx.measureText(newTxt + value[k] + "..").width) {
                                newTxt += value[k];
                            } else {
                                newTxt += "..";
                                break;
                            }
                        }
                    } else {
                        newTxt = value;
                    }
                    padding = (j == 0) ? padding : padding + (this.m_visibleseriesdatalabel[0].dataLabelFontSize * ((i == 0) ? 1.04 : 1.25));
                    this.ctx.fillText(newTxt, centerX + 2, y1 + padding);
                    this.ctx.fill();
                    this.ctx.closePath();
                }
            }
        }
    }
};
/** @description will add the formatter on Data Label. **/
InvertedFunnelChart.prototype.getFormattedText = function(value) {
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
InvertedFunnelChart.prototype.getupdatetext = function (textXPosition,textWidth,text,orgX, rightSide) {
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
InvertedFunnelChart.prototype.calculateTitleWidth = function (font, width) {
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
InvertedFunnelChart.prototype.updateSeriesData = function (array) {
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
InvertedFunnelChart.prototype.setMapForDrill = function (serValue, catValue) {
	var alldata = this.getDataProvider();
	this.m_updateDataForDrill = [];
	var flag = false;
	for (var i = 0; i < catValue.length; i++) {
		for (var j = 0; j < alldata.length; j++) {
			for (var key in alldata[j]) {
				if (catValue[i] == alldata[j][key]) {
					this.m_updateDataForDrill.push(alldata[j]);
					flag = true;
					break;
				}
			}Array
			if (IsBoolean(flag)) {
				flag = false;
				break;
			}
		}
	}
};

/** @description Getter Method for map data for drill. **/
InvertedFunnelChart.prototype.getMapForDrill = function () {
	return this.m_updateDataForDrill;
};

/** @description This method will check series available or not. **/
InvertedFunnelChart.prototype.isVisibleSeriesAvailable = function () {
	for (var index = 0; index < this.getSeriesNames().length; index++) {
		if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesDisplayNames[index]])) {
			return true;
		}
	}
	return false;
};

/*InvertedFunnelChart.prototype.getColorAccordingData = function(colorArray){
var arr=[];
if(colorArray.length<this.m_seriesData.length){
for(var i=0;i<this.m_seriesData.length;i++){
var pos =i%colorArray.length;
arr.push(colorArray[pos]);
}
return arr;
}
else
return colorArray;
};
 */

/** @description Method will return reverse array. **/
InvertedFunnelChart.prototype.reverseSeries = function (seriesValue) {
	var reverseValue = [];
	for (var i = seriesValue.length - 1; i >= 0; i--) {
		reverseValue.push(seriesValue[i]);
	}
	return reverseValue;
};

/** @description This method will initialize SeriesValues. **/
InvertedFunnelChart.prototype.initializeSeriesValues = function () {
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
InvertedFunnelChart.prototype.updateCategoryData = function (array) {
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
InvertedFunnelChart.prototype.updateSeriesColor = function (array) {
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
InvertedFunnelChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
	if ((!IsBoolean(this.m_isEmptySeries) && (!IsBoolean(this.isEmptyCategory))) && IsBoolean(this.isVisibleSeriesAvailable())) {
		for (var i = 0; i < this.visibleSeries.length; i++) {
			if ((mouseX >= 1 * this.startX - this.funnelWidth / 2) && (mouseX <= 1 * this.startX + 1 * this.funnelWidth / 2) && (mouseY >= this.m_layerYpositionArray[i] * 1 - 1 * 7)) {
				if (i == this.visibleSeries.length - 1) {
					if ((mouseY <= 1 * this.m_layerYpositionArray[i] + 1 * this.visibleSeries[i] + 1 * 7)) {
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
				} else if (i == "0") {
					if ((mouseY >= this.m_layerYpositionArray[i] * 1) && (mouseY <= 1 * this.m_layerYpositionArray[i] + 1 * this.visibleSeries[i] - 1)) {
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
					if ((mouseY <= 1 * this.m_layerYpositionArray[i] + 1 * this.visibleSeries[i] - 1 * 7)) {
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
InvertedFunnelChart.prototype.getFieldNameValueMap = function (i) {
	var m_fieldNameValueMap = new Object();
	var afn = this.getAllFieldsName();
	for (var l = 0; l < afn.length; l++) {
		m_fieldNameValueMap[afn[l]] = this.allDataObjects[i][afn[l]];// map fieldData with fieldName
	}
	return m_fieldNameValueMap;
};

InvertedFunnelChart.prototype.getLegendTableContent = function () {
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
InvertedFunnelChart.prototype.getToolTipData = function (mouseX, mouseY) {
	var toolTipData;
	if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory) && IsBoolean(this.isVisibleSeriesAvailable()) && IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")) {
	    var legendsColor = this.visibleSeriesColors;
	    var seriesName = this.seriesDisplayName;
	    var categoryName = this.visibleCategoryNames;
	    var percent = this.calculatedPercent;
	    var seriesData = this.seriesData;
	    var seriesPercent = this.seriesPercent;

	    for (var i = 0; i < this.m_layerYpositionArray.length; i++) {
	        if ((mouseX >= 1 * this.startX - this.funnelWidth / 2) && (mouseX <= 1 * this.startX + 1 * this.funnelWidth / 2) && (mouseY >= this.m_layerYpositionArray[i] * 1 - 1 * 7)) {
	            toolTipData = {};
	            if (IsBoolean(this.m_customtextboxfortooltip.dataTipType == "Default")) {
		            toolTipData.cat = "";
		            toolTipData["data"] = new Array();
		            if (i == this.visibleSeries.length - 1) {
		                if ((mouseY <= 1 * this.m_layerYpositionArray[i] + 1 * this.visibleSeries[i] + 1 * 7)) {
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
		                if ((mouseY >= this.m_layerYpositionArray[i] * 1) && (mouseY <= 1 * this.m_layerYpositionArray[i] + 1 * this.visibleSeries[i] - 1)) {
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
		                if ((mouseY <= 1 * this.m_layerYpositionArray[i] + 1 * this.visibleSeries[i] - 1 * 7)) {
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
	            	/** sorted data obj for customtooltip */
	            	 toolTipData = this.allDataObj[i];
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
InvertedFunnelChart.prototype.getDrillColor = function (mouseX, mouseY) {
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
InvertedFunnelChart.prototype.getFormatterText = function (data) {
	var dataWithFormatter = data;
	if (!IsBoolean(this.getFixedLabel()))
		dataWithFormatter = this.m_yAxis.getFormattedText(data);
	return dataWithFormatter;
};

/** @description Getter Method of StartX. **/
InvertedFunnelChart.prototype.getStartX = function () {
	var marginForYAxisLabels = 50;
	return (this.m_x + marginForYAxisLabels);
};

/** @description Getter Method of StartY. **/
InvertedFunnelChart.prototype.getStartY = function () {
	var marginForXAxisLabels = 50;
	return (this.m_y + this.m_height - marginForXAxisLabels);
};

/** @description Getter Method of EndX. **/
InvertedFunnelChart.prototype.getEndX = function () {
	var rightSideMargin = 50;
	return (this.m_x + this.m_width - rightSideMargin);
};

/** @description Getter Method of EndY. **/
InvertedFunnelChart.prototype.getEndY = function () {
	var marginForTitle = 50;
	return (this.m_y + marginForTitle);
};
//# sourceURL=InvertedFunnelChart.js