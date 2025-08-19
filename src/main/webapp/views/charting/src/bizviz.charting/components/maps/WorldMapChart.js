/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: WorldMapChart.js
 * @description WorldMapChart
 **/
function WorldMapChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();
	this.m_x = 400;
	this.m_y = 240;
	this.m_width = 300;
	this.m_height = 240;
	this.m_centerX = 0;
	this.m_centerY = 0;
	this.m_aggregation = "";
	this.m_charttype = "map";
	this.m_maptype = "usa";
	this.m_defaultfillcolor = "#FFFFFF";
	this.m_defaultfmapicon="bd-location";
	this.m_outlinecolor = "#c0c0c0";
	this.m_rollovercolor = "";
	this.m_dataMap = "";
	this.m_colorMap = "";
	this.m_origionalDataMap = "";
	//this.m_title = new svgMApTitle(this);
	this.m_title = new Title(this);
	this.m_defaultcolorrange="0~0";
	//this.m_subTitle = new svgMapSubTitle();
	this.m_subTitle = new SubTitle();
	this.m_util = new Util();
	this.m_range1 = [];
	this.m_range2 = [];
	this.m_color = [];
	this.m_range = "";
	this.m_rangedseriesdisplaynames = "Low,Medium,High";
	this.m_rangesofseries = "0-20,20-60,60-100";
	this.m_rangedcolors = "#cccccc,26265,#ff00ff";
	this.m_alphas = "0.5,1,0.7";
	this.multipleNames = {
			"india": [
		        "Andhra Pradesh/AndhraPradesh",
		  		"Arunachal Pradesh/ArunachalPradesh",
				"Daman and Diu/DamanandDiu",
				"Delhi/New Delhi/NewDelhi",
				"Dadra and Nagar Haveli/DadraandNagarHaveli",
				"Himachal Pradesh/HimachalPradesh",
				"Jammu and Kashmir/JammuandKashmir",
				"Madhya Pradesh/MadhyaPradesh","Odisha/Orissa",
				"Puducherry/Pondicherry",
				"Tamil Nadu/TamilNadu",
				"Uttar Pradesh/UttarPradesh",
				"West Bengal/WestBengal",
				"Andaman and Nicobar Islands/AndamanandNicobarIslands",
				"Odisha/Orissa"
			],
			"usa": ["Rhode Isarea/Rhode Island"],
			"world": ["United States/Usa/United States of America","Myanmar/Burma","Lao People's Democratic Republic/Laos","Timor-Leste/East Timor"],
			"europe":[],
			"canada":[],
			"asia":[],
			"australia":[],
			"middleEast":[],
			"asiaPacific":[],
			"bangladesh":[],
			"southAfrica":[]
	};
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	this.m_allCategoryNames = [];
	this.m_allCategoryDisplayNames = [];
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_allSeriesNames = [];
	this.m_allSeriesDisplayNames = [];
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_ShowToolTipData = [];
	this.updatedCategoryData = [];
	this.m_symbol = "happy";
	this.m_defaultimg = svg_set["happy"];
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.prevMapType;
	this.m_solidcolorfill = false;
	this.m_cursortype = "pointer";
	this.m_svgtype = "svg";
	this.m_attributioncontrol = "true";
	this.m_drawTripPath ="false";
	this.m_enableCircle = "false";
	this.m_circleColor = "#0F52BA";
	this.m_circleFillcolor = "#0F52BA";
	this.m_circleFillopacity = "0.2";
	this.m_circleWeight = "0.5";
	this.m_defaultZoom = "14";
	this.m_circleRadius = 500;
	this.m_circleTooltip = "No events in this trip";
	this.m_circleindex = "0";
	this.m_showmarker = false;
	this.m_mapoptions = {
	    center: [40.745176, 0], // [lat, long]
	    zoom: 1,
	    enableanimation: true,
	    duration: 2,
	    mapvariant: "default",
	    wheelzoom: true,
	    zoomAnimation : false
	};
	// added to support line,polygon fills in leaflet map configurable using script
	this.m_shapedetails = {
		    filename: "default"
	};
	this.m_geometrytype = "marker";
	this.m_linetype = "straight";
	this.m_linethickness = 3;
	this.m_randomcolorfill = false;
	this.m_categorycolors = {
		"categoryDefaultColor": "",
        "categoryDefaultColorSet": "",
        "showColorsFromCategoryName": "false",
        "CategoryColor": []
    };
	this.m_conditionalcolors = {
		"ConditionalColor": []
	}
	/** Supported icons are https://labs.mapbox.com/maki-icons/ **/
	this.m_markericon = {
		icon: "bd-location",
		color: "#006684",
		size: "30"
	};
	this.m_makimarkericonsize="m";
	this.m_startcolor = "#2ca02c";
	this.m_endcolor = "#d62728";
	this.m_pathcolor = "#006684";
	this.m_pathicon = {
			icon: "bd-flag-alt",
			color: "#ff7f0e",
			size: "30"
		};
	
	this.m_svgicons = false;
	this.m_starticon = '<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Icon/Location Start</title><g id="Icon/Location-Start" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Marker" transform="translate(3.000000, 0.000000)" fill="#282830"><path d="M9.00004,2 C6.72356,2 4.66147,3.24958 3.36476,5.2563 C1.65686,7.89937 2.32961,11.5106 3.89348,14.7758 C5.25435,17.6171 6.6963,19.4793 7.7769,20.6193 C8.27418,21.1439 8.69611,21.5169 9.00004,21.7626 C9.30398,21.5169 9.7259,21.1439 10.2232,20.6193 C11.3038,19.4793 12.7457,17.6171 14.1066,14.7758 C15.6705,11.5106 16.3432,7.89937 14.6353,5.2563 C13.3386,3.24958 11.2765,2 9.00004,2 Z M9.00004,23 C8.48555,23.8575 8.48513,23.8570062 8.4847,23.8570062 L8.48173,23.8552 L8.47675,23.8522 L8.46334,23.8439 C8.45287,23.8374 8.43938,23.8289 8.42297,23.8184 C8.39015,23.7973 8.34568,23.768 8.29043,23.73 C8.17994,23.654 8.02637,23.5431 7.83682,23.3932 C7.45767,23.0935 6.93489,22.6382 6.32536,21.9952 C5.10527,20.708 3.54299,18.674 2.0897,15.6397 C0.458474,12.2339 -0.621553,7.74027 1.68495,4.17084 C3.29668,1.67661 5.9518,0 9.00004,0 C12.0483,0 14.7034,1.67661 16.3151,4.17084 C18.6216,7.74027 17.5416,12.2339 15.9104,15.6397 C14.4571,18.674 12.8948,20.708 11.6747,21.9952 C11.0652,22.6382 10.5424,23.0935 10.1633,23.3932 C9.97372,23.5431 9.82014,23.654 9.70965,23.73 C9.65441,23.768 9.60993,23.7973 9.57712,23.8184 C9.56071,23.8289 9.54722,23.8374 9.53675,23.8439 L9.52333,23.8522 L9.51835,23.8552 L9.5163,23.8564 L9.51538,23.8570062 C9.51495,23.8570062 9.51454,23.8575 9.00004,23 Z M9.00004,23 L9.51538,23.857 C9.1987,24.047 8.80139,24.047 8.4847,23.857 L9.00004,23 Z M6.616304,5.0635288 L12.21632,8.663528 C12.3308,8.737128 12.4,8.863896 12.4,9.00000001 C12.4,9.13612 12.3308,9.26288 12.21632,9.33648 L6.616304,12.93648 C6.49322,13.0156 6.336754,13.0212 6.2083248,12.95108 C6.0798956,12.88096 6,12.74632 6,12.6 L6,5.4 C6,5.2536776 6.0798956,5.1190316 6.2083248,5.0489156 C6.336754,4.97879928 6.49322,4.98440376 6.616304,5.0635288 Z" id="Shape"></path></g></g></svg>';
    this.m_endicon = '<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Icon/Location End</title><g id="Icon/Location-End" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Marker" transform="translate(3.000000, 0.000000)" fill="#282830"><path d="M9.00004,2 C6.72356,2 4.66147,3.24958 3.36476,5.2563 C1.65686,7.89937 2.32961,11.5106 3.89348,14.7758 C5.25435,17.6171 6.6963,19.4793 7.7769,20.6193 C8.27418,21.1439 8.69611,21.5169 9.00004,21.7626 C9.30398,21.5169 9.7259,21.1439 10.2232,20.6193 C11.3038,19.4793 12.7457,17.6171 14.1066,14.7758 C15.6705,11.5106 16.3432,7.89937 14.6353,5.2563 C13.3386,3.24958 11.2765,2 9.00004,2 Z M9.00004,23 C8.48555,23.8575 8.48513,23.8570062 8.4847,23.8570062 L8.48173,23.8552 L8.47675,23.8522 L8.46334,23.8439 C8.45287,23.8374 8.43938,23.8289 8.42297,23.8184 C8.39015,23.7973 8.34568,23.768 8.29043,23.73 C8.17994,23.654 8.02637,23.5431 7.83682,23.3932 C7.45767,23.0935 6.93489,22.6382 6.32536,21.9952 C5.10527,20.708 3.54299,18.674 2.0897,15.6397 C0.458474,12.2339 -0.621553,7.74027 1.68495,4.17084 C3.29668,1.67661 5.9518,0 9.00004,0 C12.0483,0 14.7034,1.67661 16.3151,4.17084 C18.6216,7.74027 17.5416,12.2339 15.9104,15.6397 C14.4571,18.674 12.8948,20.708 11.6747,21.9952 C11.0652,22.6382 10.5424,23.0935 10.1633,23.3932 C9.97372,23.5431 9.82014,23.654 9.70965,23.73 C9.65441,23.768 9.60993,23.7973 9.57712,23.8184 C9.56071,23.8289 9.54722,23.8374 9.53675,23.8439 L9.52333,23.8522 L9.51835,23.8552 L9.5163,23.8564 L9.51538,23.8570062 C9.51495,23.8570062 9.51454,23.8575 9.00004,23 Z M9.00004,23 L9.51538,23.857 C9.1987,24.047 8.80139,24.047 8.4847,23.857 L9.00004,23 Z M11,6 C11.5522847,6 12,6.44771525 12,7 L12,11 C12,11.5522847 11.5522847,12 11,12 L7,12 C6.44771525,12 6,11.5522847 6,11 L6,7 C6,6.44771525 6.44771525,6 7,6 L11,6 Z" id="Shape"></path></g></g></svg>';

	this.m_tripiconsize = 18;
	this.m_realtimeMarker = '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --> <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="50px" height="30px" viewBox="0 0 50 30" enable-background="new 0 0 50 30" xml:space="preserve"> <path fill="#1E1E1E" d="M16.157,5.488c0,0-5.49-1.567-11.017,0.739c0,0-3.02,1.779-2.69,6.904c0,0-0.829,2.261-0.035,3.836 c0,0-2.651,11.16,13.859,8.159l4.024-0.186c0,0,1.244,0.843,2.525,0.11l10.432-0.184l-0.695,3.029c0,0,1.099,0.27,2.086-1.73h7.501 c0,0,5.86-1.002,6.154-8.252c0,0,1.464-7.396-2.563-11.386c0,0-1.977-1.886-3.916-1.667l-7.432-0.046c0,0-0.145-2.083-2.269-2.009 l1.208,2.628L22.86,5.359c0,0-0.659-1.174-2.526-0.039L16.157,5.488z"/> <path fill="#FFFFFF" d="M14.514,8.101L7.632,8.393c0,0-4.247,7.797,0.183,13.508l6.699,0.438 C14.514,22.34,12.647,15.678,14.514,8.101z"/> <path fill="#FFFFFF" d="M30.182,7.295c0,0,2.707,8.126,0,15.484l6.92,1.245c0,0,9.078-7.98,0-17.645L30.182,7.295z"/> <ellipse transform="matrix(0.8622 0.5065 -0.5065 0.8622 5.1083 -1.5183)" fill="#FFFFFF" cx="5.345" cy="8.632" rx="0.841" ry="1.757"/> <ellipse transform="matrix(0.8347 -0.5507 0.5507 0.8347 -11.0502 6.5249)" fill="#FFFFFF" cx="5.345" cy="21.671" rx="0.841" ry="1.759"/> <path fill="#FFFFFF" d="M11.748,23.288l3.938,0.879H35.91C35.91,24.167,22.563,21.358,11.748,23.288z"/> <path fill="#FFFFFF" d="M11.748,6.637c0,0,10.6,1.574,23.301-0.586l-19.62-0.256C15.429,5.794,13.594,5.831,11.748,6.637z"/> <ellipse transform="matrix(-0.7054 0.7088 -0.7088 -0.7054 82.1154 -19.1358)" fill="#FFFFFF" cx="45.035" cy="7.498" rx="0.841" ry="1.758"/> <ellipse transform="matrix(-0.7266 -0.6871 0.6871 -0.7266 61.1083 69.9299)" fill="#FFFFFF" cx="44.469" cy="22.806" rx="0.841" ry="1.757"/> </svg>';
};

/** @description Making prototype of chart class to inherit its properties and methods into WorldMapChart. **/
WorldMapChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
WorldMapChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Getter Method of Fields Json **/
WorldMapChart.prototype.getFieldsJson = function () {
	return this.m_fieldsJson;
};

/** @description Setter Method of Fields according to fieldType **/
WorldMapChart.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	var categoryJson = [];
	var seriesJson = [];
	this.m_fieldsJson = fieldsJson;
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
	if (categoryJson.length > 0) {
		this.isEmptyCategory = true;
		this.setCategory(categoryJson);
		this.setSeries(seriesJson);
	} else {
		this.isEmptyCategory = false;
	}
};

/** @description Setter Method of Category iterate for all category. **/
WorldMapChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	this.m_allCategoryNames = [];
	this.m_allCategoryDisplayNames = [];
	this.m_categoryVisibleArr = [];
	var count = 0;
	// only one category can be set for pie chart, preference to first one
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
WorldMapChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = [];
	this.m_legendNames = [];
	this.m_seriesVisibleArr = [];
	this.m_allSeriesDisplayNames = [];
	this.m_allSeriesNames = [];
	this.m_precisionArr = [];
	this.m_isfixedlabelArr = [];
	this.m_formatterArr = [];
	this.m_unitnameArr = [];
	this.m_signpositionArr = [];
	this.m_secondformatterArr = [];
	this.m_secondunitnameArr = [];
	this.m_columnTypeArr = [];
	this.formatterMap = {};
	this.legendMap = {};
	var count = 0;
	
	for (var i = 0; i < seriesJson.length; i++) {
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.m_allSeriesDisplayNames[i] = m_formattedDisplayName;
		this.m_allSeriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		this.m_seriesVisibleArr[this.m_allSeriesNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
		if (IsBoolean(this.m_seriesVisibleArr[this.m_allSeriesNames[i]])) {
			this.m_seriesDisplayNames[count] = m_formattedDisplayName;
			this.m_seriesNames[count] = this.getProperAttributeNameValue(seriesJson[i], "Name");
			this.m_legendNames[count] = m_formattedDisplayName;
			this.m_seriesColors[count] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));			
			this.m_precisionArr[count] = this.getProperAttributeNameValue(seriesJson[i], "Precision");
			this.m_isfixedlabelArr[count] = this.getProperAttributeNameValue(seriesJson[i], "isfixedlabel");
			this.m_formatterArr[count] = this.getProperAttributeNameValue(seriesJson[i], "formatter");
			this.m_unitnameArr[count] = this.getProperAttributeNameValue(seriesJson[i], "unitname");
			this.m_signpositionArr[count] = this.getProperAttributeNameValue(seriesJson[i], "signposition");
			this.m_secondformatterArr[count] = this.getProperAttributeNameValue(seriesJson[i], "secondformatter");
			this.m_secondunitnameArr[count] = this.getProperAttributeNameValue(seriesJson[i], "secondunitname");
			this.m_columnTypeArr[count] = this.getProperAttributeNameValue(seriesJson[i], "cellType");
			var tempMap = {
				"precision" : this.m_precisionArr[count],
				"isfixedlabel" : this.m_isfixedlabelArr[count],
				"formatter" : this.m_formatterArr[count],
				"unitname" : this.m_unitnameArr[count],
				"signposition" : this.m_signpositionArr[count],
				"secondformatter" : this.m_secondformatterArr[count],
				"secondunitname" : this.m_secondunitnameArr[count]
			};
			
			var templegendMap = {
				"seriesName" : this.m_seriesNames[count],
				"displayName" : this.m_seriesDisplayNames[count],
				"color" : this.m_seriesColors[count],
				"shape" : "cube"
			};
			this.legendMap[this.m_seriesNames[count]] = templegendMap;
			this.formatterMap[this.m_seriesNames[count]] = tempMap;
			count++;
		}
	}
	this.setLegendsIntialLoad(this.m_defaultlegendfields);
};

/** @description Getter Method of LegendInfo . **/
WorldMapChart.prototype.getLegendInfo = function () {
	return this.legendMap;
};

/** @description Getter Method of All Series Names . **/
WorldMapChart.prototype.getAllSeriesNames = function () {
	return this.m_allSeriesNames;
};

/** @description Setter Method of LegendNames. **/
WorldMapChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};

/** @description Getter Method of LegendNames. **/
WorldMapChart.prototype.getLegendNames = function () {
	return this.m_categoryData[0];
};

/** @description Getter Method of Category Names. **/
WorldMapChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};

/** @description Getter Method of All Category Names. **/
WorldMapChart.prototype.getAllCategoryNames = function () {
	return this.m_allCategoryNames;
};

/** @description Getter Method of Category DisplayName. **/
WorldMapChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

/** @description Getter Method of Series DisplayName. **/
WorldMapChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};

/** @description Getter Method of DataProvider **/
WorldMapChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description Setter Method of Category Data. **/
WorldMapChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	this.isEmptyCategory = true;
	if(this.getCategoryNames().length > 0) {
		this.isEmptyCategory = false;
		for (var i = 0; i < this.getCategoryNames().length; i++) {
			this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
		}
	}
};

/** @description Getter Method of Category Data. **/
WorldMapChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

/** @description Getter Method of Series Names. **/
WorldMapChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};

/** @description Setter Method of Series Data. **/
WorldMapChart.prototype.setSeriesData = function () {
	this.m_tooltipdata = [];
	this.m_seriesData = [];
	this.m_ShowToolTipData = [];
	for (var i = 0; i < this.getSeriesNames().length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
		this.m_ShowToolTipData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
		this.m_tooltipdata[this.m_categoryData[i]] = this.getDataFromJSON(this.getSeriesNames()[i]);; 
	}
	if(this.m_svgtype == "leaflet") {
		if(!IsBoolean(this.m_designMode)){
			this.updateSeriesCatData();
		}
		this.m_latitudepoints = [];
		this.m_longitudepoints = [];
		this.m_markerdata = [];
		this.m_tripeventpoints = []; 
		this.m_markerNames = [];
		this.m_markerDisplayNames = [];
		for(var i = 0; i < this.m_seriesNames.length; i++) {
			if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
				if(this.m_columnTypeArr[i] == "latitude") {
					this.m_latitudepoints.push(this.m_seriesData[i]);
				} else if(this.m_columnTypeArr[i] == "longitude") {
					this.m_longitudepoints.push(this.m_seriesData[i]);
				} else if(this.m_columnTypeArr[i] == "tripevent") {
					this.m_tripeventpoints.push(this.m_seriesData[i]);
				} else {
					this.m_markerdata.push(this.m_seriesData[i]);
					this.m_markerNames.push(this.m_seriesNames[i]);
					this.m_markerDisplayNames.push(this.m_allSeriesDisplayNames[i]);
				}
			}
		}
	}
};

/** @description Method for updating Category,Series Data if garbage data is there in latitude and longitude. **/
WorldMapChart.prototype.updateSeriesCatData = function () {
	var latitudePoints = [];
	var longitudePoints = [];
	for (var i = 0; i < this.m_seriesNames.length; i++) {
	    if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
	        if (this.m_columnTypeArr[i] == "latitude") {
	            latitudePoints.push(this.m_seriesData[i]);
	        } else if (this.m_columnTypeArr[i] == "longitude") {
	            longitudePoints.push(this.m_seriesData[i]);
	        }
	    }
	}
	this.m_tooltipLeafletData = this.m_dataProvider;
	if(longitudePoints.length!== 0 && latitudePoints.length !== 0) {
		var mergeLatLongData = _.zip(latitudePoints[0], longitudePoints[0]);
		var mergeSeriesData = _.zip.apply(_, this.m_seriesData);
		var mergeShowTooltipData = _.zip.apply(_, this.m_ShowToolTipData);
		var newSeriesData = [];
		var newShowToolTipData = [];
		var newCategoryData = [];
		newCategoryData[0] = [];
		this.m_tooltipLeafletData = [];
		for (var j = 0; j < mergeLatLongData.length; j++) {
		    var arr = mergeLatLongData[j];
		    if (!this.isValidData(arr)) {
		        newSeriesData.push(mergeSeriesData[j]);
		        newShowToolTipData.push(mergeShowTooltipData[j]);
		        newCategoryData[0].push(this.m_categoryData[0][j]);
		        this.m_tooltipLeafletData.push(this.m_dataProvider[j]);
		    }
		}
		var splitSeriesData = _.unzip(newSeriesData);
		var splitShowTooltipData = _.unzip(newShowToolTipData);
		this.m_seriesData = splitSeriesData;
		this.m_ShowToolTipData = splitShowTooltipData;
		this.m_categoryData = newCategoryData;
	}
};
WorldMapChart.prototype.isValidData = function (array) {
	var isValue = false;
	for (var j = 0; j < array.length; j++) {
	    var currentData = getNumericComparableValue(array[j]) * 1;
	    if ((isNaN(currentData) || (array[j] === ""))) {
	        isValue = true;
	        break;
	    }
	}
	return isValue;
};
/** @description Getter Method of Series Data. **/
WorldMapChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

/** @description Getter Method of Original Category Data. **/
WorldMapChart.prototype.getOriginalCategoryData = function () {
	this.m_originalCategoryData = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_originalCategoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
	return this.m_originalCategoryData;
};

/** @description  initialization of draggable div and its inner Content **/
WorldMapChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.createSVGContainer();
	this.initMouseClickEvent();
};

/** @description  This method will create svg Element into DOM and set CSS property. **/
WorldMapChart.prototype.createSVGContainer = function () {
	var temp = this;
	//Title
	this.svgContainerId = "svgContainer" + temp.m_objectid;
	var height = this.getMarginForSubTitle() * 1 + this.getMarginForTitle() * 1;
	$("#" + temp.svgContainerId).remove();
	//var svg = document.createElementNS(NS, "svg");
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("xlink", "http://www.w3.org/1999/xlink");
	svg.setAttribute("width", this.m_width);
	svg.setAttribute("height", height + "px");
	svg.setAttribute("id", this.svgContainerId);
	svg.setAttribute("class", "svg_chart_container");
	$("#draggableDiv" + temp.m_objectid).append(svg);

	// Map
	$("#svgMapDiv" + temp.m_objectid).remove();
	var div = document.createElement("div");
	div.setAttribute("id", "svgMapDiv" + temp.m_objectid);
	$("#draggableDiv" + temp.m_objectid).append(div);
	$("#svgMapDiv" + temp.m_objectid).css({"position": "absolute", "top": height + "px", "height": this.m_height - height + "px", "width": this.m_width + "px", "font-family": selectGlobalFont(temp.m_defaultfontfamily)});
};

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
WorldMapChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description Setter Method of All FieldsName. **/
WorldMapChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getAllCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getAllCategoryNames()[i]);
	}
	for (var j = 0; j < this.getAllSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
	}
};

/** @description Getter Method of All FieldsName. **/
WorldMapChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

/** @description Setter Method for set All Fields DisplayName. **/
WorldMapChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

/** @description Getter Method of All FieldsDisplayName. **/
WorldMapChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

/** @description Setter Method of All FieldsName For Unavailable Category. **/
WorldMapChart.prototype.setAllFieldsNameForUnavailableCategory = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.m_categoryNames.length; i++) {
		this.m_allfieldsName.push(this.m_categoryNames[0]);
	}
	for (var j = 0; j < this.m_seriesNames.length; j++) {
		this.m_allfieldsName.push(this.m_seriesNames[0]);
	}
};

/** @description Setter Method of All Fields DisplayName For Unavailable Category. **/
WorldMapChart.prototype.setAllFieldsDisplayNameForUnavailableCategory = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.m_categoryNames.length; i++) {
		this.m_allfieldsDisplayName.push(this.m_categoryNames[0]);
	}
	for (var j = 0; j < this.m_seriesNames.length; j++) {
		this.m_allfieldsDisplayName.push(this.m_seriesNames[0]);
	}
};

/** @description This method will call ParsePropertyJsonAttributes**/
WorldMapChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.ParsePropertyJsonAttributes(jsonObject, nodeObject);
};

/** @description This method will set class variable values with JSON values **/
WorldMapChart.prototype.ParsePropertyJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
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

/** @description initialization of WorldMapChart. **/
WorldMapChart.prototype.init = function () {
	this.setCategoryData();
	this.setSeriesData();
	this.setAllFieldsName();
	this.setAllFieldsDisplayName();
	this.isSeriesDataEmpty();
	this.updateSeriesDataWithCommaSeperators();
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);
	if (!IsBoolean(this.m_isEmptySeries)) {
		var temp = this;
		/**If map is invisible on loading time,then this condition is required to get the properties
		 * of map element by making it visible**/
		if(!IsBoolean(this.visibilityStatus)){
			this.visibilityStatus = true;
			$("#draggableDiv" + temp.m_objectid).css("display", "block");
			this.initializeCalculation();
			this.visibilityStatus = false;
			$("#draggableDiv" + temp.m_objectid).css("display", "none");
		}else{
			this.initializeCalculation();
		}
	}
	this.m_tooltip = new Tooltip();
	/**Old Dashboard directly previewing without opening in designer*/
	this.initializeToolTipProperty();
	this.m_tooltip.init(this);
};

/** @description Update Series Data With Comma Seperators**/
WorldMapChart.prototype.updateSeriesDataWithCommaSeperators = function () {
	for (var i = 0, length = this.m_ShowToolTipData.length; i < length; i++) {
		for (var j = 0, innerlength = this.m_ShowToolTipData[i].length; j < innerlength; j++) {
			if (isNaN(this.m_ShowToolTipData[i][j])) {
				this.m_seriesData[i][j] = getNumericComparableValue(this.m_seriesData[i][j]);
			}
		}
	}
};

/** @description Setter method for set the color according to the data and its range. **/
WorldMapChart.prototype.setColorForMapRange = function() {
    var colorMap = {};
    var dataMap = {};
    var origionalDataMap = {};
    var leafLetDataMap = [];
    var leafLetColorMap = [];
    var leafLetIconMap = [];
    this.m_customtooltipmap = {};
    if (!IsBoolean(this.isEmptyCategory)) {
        for (var i = 0; i < this.m_categoryData[0].length; i++) {
            var tempMap = {};
            for (var j = 0; j < this.m_seriesNames.length; j++) {
                if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[j]])) {
                    tempMap[this.m_seriesNames[j]]={"seriesName":"","displayName":"","data":"","displayData":""};
                    tempMap[this.m_seriesNames[j]].data = this.m_seriesData[j][i];
                    tempMap[this.m_seriesNames[j]].displayData = this.m_ShowToolTipData[j][i];
                    tempMap[this.m_seriesNames[j]].seriesName = this.m_seriesNames[j];
                    tempMap[this.m_seriesNames[j]].displayName = this.m_seriesDisplayNames[j];
                }
            }
            dataMap[("" + this.m_categoryData[0][i]).toLowerCase()] = tempMap;
            if (this.m_customtextboxfortooltip.dataTipType == "Custom") {
                this.m_customtooltipmap[("" + this.m_categoryData[0][i]).toLowerCase()] = this.getDataProvider()[i];
            }
            leafLetDataMap[i] = tempMap;
            origionalDataMap[this.m_categoryData[0][i]] = tempMap;
            colorMap[("" + this.m_categoryData[0][i]).toLowerCase()] = this.getRangeColor(this.m_seriesData[this.getIndex()][i], this.m_categoryData[0][i]);
            if (this.m_svgtype == "leaflet" && this.m_markerdata[0]){
            	leafLetColorMap[i] = this.getRangeColorLeafLet(this.m_markerdata[0][i], this.m_categoryData[0][i],i);
            	/*DAS-292 marker indicator for leaflet*/
            	leafLetIconMap[i] = this.getRangeColorLeafLetIcon(i);
            } 
            if (this.m_svgtype == "svg" && this.m_seriesData[0]) {
				leafLetColorMap[this.m_categoryData[0][i]] = this.getRangeColorLeafLet(this.m_seriesData[0][i], this.m_categoryData[0][i],i);
			}
                
        }
    }
    this.m_colorMap = colorMap;
    this.m_dataMap = dataMap;
    this.m_origionalDataMap = origionalDataMap;
    this.m_leafLetDataMap = leafLetDataMap;
    this.m_leafLetColorMap = leafLetColorMap;
    this.m_leafLetIconMap = leafLetIconMap;
};

/** @description Getter Method for getting index from visible series. **/
WorldMapChart.prototype.getIndex = function () {
	var index=0;
	for(var k=0;k<this.m_seriesNames.length;k++){
		if(IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[k]]))
			return k;
	}
	return index;
};

/** @description Getter Method for Range Color. **/
WorldMapChart.prototype.getRangeColor = function (value, catName) {
	var catcolor = this.m_categorycolors.CategoryColor;
	if((value != undefined && value !== null && value !== "") && !isNaN(value)) {
		if(!IsBoolean(this.m_solidcolorfill) || IsBoolean(this.m_showdynamicrange)){
			if ((value * 1 < this.m_minRange ) || (value*1 > this.m_maxRange)){
				return this.m_defaultfillcolor;
			}else{
				var percent = ((value * 1 - this.m_minRange) / (this.m_maxRange - this.m_minRange)) * this.m_tempMapWidth * this.getDevicePixelRatio();
				if (value * 1 < this.m_minRange){
					percent = 0.01;
				}else if(value * 1 >= this.m_maxRange){
					percent = (this.m_tempMapWidth * this.getDevicePixelRatio()) - this.m_adjustpixel;
				}
				var col = this.ctx.getImageData(percent | 0, this.m_tempHeight / 2, 1, 1).data;
				var rgbColor = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
				/**calculating category conditional color and random color**/
				if (IsBoolean(this.m_randomcolorfill)) {
					return "#"+getRandomColor();
				} else {
					for (var i = 0; i < catcolor.length; i++) {
						if (catcolor[i].categoryName === catName) {
							rgbColor = catcolor[i].color;
							return rgbColor;
						}
					}
				}
				return rgb2hex(rgbColor);
			}
		}else{
			/** solid fill when dynamic range is false **/
			this.m_MapCellColor;
			var percent = value;
			for (var k = 0; k < this.m_range.length; k++) {
				if ((k == 0 && percent < this.m_range1[k]) || ((k == this.m_range.length - 1 && percent >= this.m_range2[k]))){
					this.m_MapCellColor = this.m_defaultfillcolor;
				}
				if (percent >= this.m_range1[k] && percent <this.m_range2[k]){
					this.m_MapCellColor = rgb2hex(this.m_color[k],this.m_coloropacity)
					break;
				}
				/**calculating category conditional color and random color**/
				if (IsBoolean(this.m_randomcolorfill)) {
					return "#"+getRandomColor();
				} else {
					for (var i = 0; i < catcolor.length; i++) {
						if (catcolor[i].categoryName === catName) {
							this.m_MapCellColor = catcolor[i].color;
							return this.m_MapCellColor;
						}
					}
				}
			}
			return this.m_MapCellColor;
		}
	}else {
		return this.m_defaultfillcolor;
	}
};

/** @description Getter Method for Range Color of Leafletmap. **/
WorldMapChart.prototype.getRangeColorLeafLet = function (value, catName, rowIndex) {
	var catcolor = this.m_categorycolors.CategoryColor;
	var leafletMax = _.max((IsBoolean(this.m_svgtype == "svg")?this.m_seriesData[0]:this.m_markerdata[0]), function(val) {  // underscore method for max value
	    return (val === "" || val===undefined || val == null) ? undefined : val * 1;
	});
	var leafletMin = _.min((IsBoolean(this.m_svgtype == "svg")?this.m_seriesData[0]:this.m_markerdata[0]), function(val) {  // underscore method for min value
	   return (val === "" || val===undefined || val == null) ? undefined : val * 1;
	});
	this.m_leafletminRange =  (!IsBoolean(this.m_showdynamicrange)) ?[this.m_range1.min(), this.m_range2.min()].min():((IsBoolean(this.m_svgtype == "svg")?this.m_seriesData[0]:this.m_markerdata[0]).length !== 0) ? leafletMin : 0;
	this.m_leafletmaxRange =  (!IsBoolean(this.m_showdynamicrange)) ?[this.m_range1.max(), this.m_range2.max()].max():((IsBoolean(this.m_svgtype == "svg")?this.m_seriesData[0]:this.m_markerdata[0]).length !== 0) ? leafletMax : 0;
	
	if((value != undefined && value !== null && value !== "") && !isNaN(value)) {
		if(!IsBoolean(this.m_solidcolorfill) || IsBoolean(this.m_showdynamicrange)){
			if ((value * 1 < this.m_leafletminRange ) || (value*1 > this.m_leafletmaxRange)){
				/** DAS-292 **/
				if (this.m_conditionalcolors.ConditionalColor.length > 0) {
					  if (this.getRangeColorLeafLetSeries(rowIndex) != undefined) {
					    return this.getRangeColorLeafLetSeries(rowIndex);
					  }
				}
				for (var i = 0; i < catcolor.length; i++) {
					if (catcolor[i].categoryName === catName) {
						rgbColor = catcolor[i].color;
						return rgbColor;
					}
				}				
				return this.m_defaultfillcolor;
			}else{
				var percent = ((value * 1 - this.m_leafletminRange) / (this.m_leafletmaxRange - this.m_leafletminRange)) * this.m_tempMapWidth * this.getDevicePixelRatio();
				if (value * 1 < this.m_leafletminRange){
					percent = 0.01;
				}else if(value * 1 >= this.m_leafletmaxRange){
					percent = (this.m_tempMapWidth * this.getDevicePixelRatio()) - 1;
				}
				var col = this.ctx.getImageData(percent | 0, this.m_tempHeight / 2, 1, 1).data;
				var rgbColor = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
				/**calculating category conditional color and random color**/
				if (IsBoolean(this.m_randomcolorfill)) {
					return "#"+getRandomColor();
				} else {
					/** DAS-292 **/
					if (this.m_conditionalcolors.ConditionalColor.length > 0) {
						  if (this.getRangeColorLeafLetSeries(rowIndex) != undefined) {
						    return this.getRangeColorLeafLetSeries(rowIndex);
						  }
					}
					for (var i = 0; i < catcolor.length; i++) {
						if (catcolor[i].categoryName === catName) {
							rgbColor = catcolor[i].color;
							return rgbColor;
						}
					}
				}
				return rgb2hex(rgbColor);
			}
		}else{
			/** solid fill when dynamic range is false **/
			this.m_MapCellColor = this.m_defaultfillcolor;
			var percent = value;
			for (var k = 0; k < this.m_range.length; k++) {
				if ((k == 0 && percent < this.m_range1[k]) || ((k == this.m_range.length - 1 && percent >= this.m_range2[k]))){
					this.m_MapCellColor = this.m_defaultfillcolor;
				}
				if (percent >= this.m_range1[k] && percent <this.m_range2[k]){
					this.m_MapCellColor = rgb2hex(this.m_color[k]);
					break;
				}
				/**calculating category conditional color and random color**/
				if (IsBoolean(this.m_randomcolorfill)) {
					return "#"+getRandomColor();
				} else {
					/** DAS-292 **/
					if (this.m_conditionalcolors.ConditionalColor.length > 0) {
						  if (this.getRangeColorLeafLetSeries(rowIndex) != undefined) {
						    return this.getRangeColorLeafLetSeries(rowIndex);
						  }
					}
					for (var i = 0; i < catcolor.length; i++) {
						if (catcolor[i].categoryName === catName) {
							this.m_MapCellColor = catcolor[i].color;
							return this.m_MapCellColor;
						}
					}
				}
			}
			return this.m_MapCellColor;
		}
	}else {
		return this.m_defaultfillcolor;
	}
};
/** @description Get custom Marker Icon for series alert indicator of Leaflet map. DAS-292**/
WorldMapChart.prototype.getRangeColorLeafLetIcon = function (rowIndex) {
	var series=this.m_seriesData;
	var seriesName=this.m_seriesNames;
	var seriesColor=this.m_conditionalcolors.ConditionalColor;
	if((seriesColor != undefined && seriesColor !== null && seriesColor !== "") ) {
		for (var i = 0; i < seriesColor.length; i++) {
			var operator = (seriesColor[i].operator == "=") ? "==" : "" + seriesColor[i].operator;
			if(seriesColor[i].flag === true){
				/*fixed value comparison*/
				var index=(seriesName.indexOf(seriesColor[i].comparedField)>-1)?seriesName.indexOf(seriesColor[i].comparedField):0;
				eval("result  = '" + series[index][rowIndex] + "'" + operator + "'" + seriesColor[i].compareTo + "'");
				if (IsBoolean(result)) {
					return seriesColor[i].icon;
				}
				
			}
			else{
				/*filed value compare with another column value comparison*/
				var indexCF=(seriesName.indexOf(seriesColor[i].comparedField)>-1)?seriesName.indexOf(seriesColor[i].comparedField):0;
				var indexCT=(seriesName.indexOf(seriesColor[i].compareTo)>-1)?seriesName.indexOf(seriesColor[i].compareTo):0;
				eval("result  = '" + series[indexCF][rowIndex] + "'" + operator + "'" + series[indexCT][rowIndex] + "'");
				if (IsBoolean(result)) {
					return seriesColor[i].icon;
				}
				
			}
		}
		
	}
	else{
		//return this.m_markericon.icon;
	}
	//return this.m_markericon.icon;
};
/** DAS-292 @description getMarker color from series alert indicator of Leaflet map **/
WorldMapChart.prototype.getRangeColorLeafLetSeries = function (rowIndex) {
	var index,
			indexcmpto,
			comparedfield,
			compareToField;
		var seriesName=this.m_seriesNames;
		var seriesColor=this.m_conditionalcolors.ConditionalColor;
		if((seriesColor != undefined && seriesColor !== null && seriesColor !== "")) {
			for (var i = 0; i < seriesColor.length; i++) {
				for (var j = 0; j < seriesName.length; j++) {
					if (seriesColor[i].seriesName == seriesName[j]) {
						index = i;
						if (seriesColor[i].comparedField != undefined) {
							comparedfield = seriesColor[i].comparedField;
						} else {
							comparedfield = seriesColor[i].seriesName;
						}
					}
					if (!seriesColor[i].flag) {
						indexcmpto = i;
						seriesColor[i].m_seriesFlag = true;
						compareToField = seriesColor[i].compareTo;
					}
				}
				var M_SeriesName = [];
				var M_SeriesName1 = [];
			
				if (index != undefined)
					M_SeriesName = getCommaSeparateSeriesData(this.getDataFromJSON(comparedfield));
				if (indexcmpto != undefined && IsBoolean(seriesColor[i].m_seriesFlag))
					M_SeriesName1 = getCommaSeparateSeriesData(this.getDataFromJSON(compareToField));
			
				var operator = (seriesColor[i].operator == "=") ? "==" : "" + seriesColor[i].operator;
				var result = false;
				
				if (IsBoolean(seriesColor[i].m_seriesFlag)) {
					var compareTo = M_SeriesName1[rowIndex];
				} else {
					if (isNaN(seriesColor[i].compareTo)) {
						switch (seriesColor[i].compareTo.toLowerCase()) {
							case "max":
								compareTo = this.getMaximumSeriesValue(SeriesData, index);
								break;
							case "min":
								compareTo = this.getMinimumSeriesValue(SeriesData, index);
								break;
							default:
								compareTo = "" + seriesColor[i].compareTo;
								break;
						}
					} else {
						compareTo = seriesColor[i].compareTo;
					}
				}
				var seriesname = M_SeriesName[rowIndex];
		
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
						eval("result  = '" + seriesname + "'" + operator + "'" + compareTo + "'");
					}
				} catch (e) {
					result = false;
				}
		
				if (IsBoolean(result)) {
					var seriesColors;
					seriesColors = convertColorToHex(seriesColor[i].color);
					return seriesColors;
				}
			}
		}
};

/** @description Getter Method for Ranges. **/
WorldMapChart.prototype.getRanges = function () {
	this.m_range = (this.m_rangesofseries != "") ? this.m_rangesofseries.split(",") : [this.m_defaultcolorrange];
	for (var i = 0; i < this.m_range.length; i++) {
		var splitter = this.m_range[i].indexOf("~") > -1 ? "~" : "-";
		var m_rangeForLegend = (this.m_range[i].split(splitter));
		this.m_range1[i] = m_rangeForLegend[0] * 1;
		this.m_range2[i] = m_rangeForLegend[1] * 1;
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

/** @description Will initialize the calculation  of the range and color. **/
WorldMapChart.prototype.initializeCalculation = function () {
	this.initializeChartUIProperties();
	this.setColorForMapRange();
};

/** @description This method will initialize chart Properties. **/
WorldMapChart.prototype.initializeChartUIProperties = function () {
	var temp = this;
	this.m_startX = this.getStartX();
	this.m_startY = this.getStartY();
	this.m_tempMapWidth = $("#draggableCanvas" + temp.m_objectid).width();
	this.m_tempHeight = this.getStartY() - this.getEndY();
	this.getRanges();
	this.initializeColor();
	this.createColorRange();
};

/** @description will initialize color Properties according to the color-range set. **/
WorldMapChart.prototype.initializeColor = function () {
	this.m_defaultfillcolor = convertColorToHex(this.m_defaultfillcolor);
	this.m_rollovercolor = convertColorToHex(this.m_rollovercolor);
	this.m_outlinecolor = convertColorToHex(this.m_outlinecolor);

	/*if (this.m_alphas != null)
		var bandalphas = this.m_alphas.split(",");*/
	var color = this.m_rangedcolors.split(",");
	this.m_color = [];
	if(!IsBoolean(this.m_showdynamicrange)) {
		var m_color = [];
		for (var i = 0; i < this.m_range.length; i++) {
			if (color[i] != undefined)
				m_color[i] = convertColorToHex(color[i]);
			else
				m_color[i] = m_color[i - 1];
			this.m_color[i] = hex2rgb(m_color[i]);
			//this.m_color[i] = hex2rgb(m_color[i], bandalphas[i]);
		}
	}else {
		this.m_color[0] = this.m_minrangecolor;
		this.m_color[1] = this.m_maxrangecolor;
	}
};

/** @description will create Color Range and set gradiant accordingly to the min and max value. **/
WorldMapChart.prototype.createColorRange = function () {	
	var crWidth = this.m_tempMapWidth;
	var seriesData = [];
	for (var j = 0; j < this.m_seriesNames.length; j++) {
		if(IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[j]])){
			seriesData.push(this.m_seriesData[j]);
		}
	}
	
	var max = _.max(seriesData[0], function(val) {  // underscore method for max value
	    return (val === "" || val===undefined || val == null) ? undefined : val * 1;
	});
	var min = _.min(seriesData[0], function(val) {  // underscore method for min value
	   return (val === "" || val===undefined || val == null) ? undefined : val * 1;
	});
	
	this.m_minRange =  (!IsBoolean(this.m_showdynamicrange)) ?[this.m_range1.min(), this.m_range2.min()].min():(seriesData.length !== 0) ? min : 0;
	this.m_maxRange =  (!IsBoolean(this.m_showdynamicrange)) ?[this.m_range1.max(), this.m_range2.max()].max():(seriesData.length !== 0) ? max : 0;
	var grad = this.ctx.createLinearGradient(0, 0, crWidth, 0);
	if(!IsBoolean(this.m_showdynamicrange)){
		if (this.m_range.length > 1) {
			var rangeDiff = this.m_maxRange - this.m_minRange;
			for (var i = 0; i < this.m_range.length; i++) {
				if (i == 0)
					grad.addColorStop(0, this.m_color[i]);
				else if (i == this.m_range.length - 1)
					grad.addColorStop(1, this.m_color[i]);
				else {
					var stop = this.m_range1[i] - this.m_minRange;
					var mark = stop / rangeDiff;
					grad.addColorStop( mark, this.m_color[i]);
					/*grad.addColorStop(isNaN(mark) ? 0 : mark, this.m_color[i]);*/
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
	else {
		for (var i = 0; i < this.m_color.length; i++) {
			if(i==0){
				mark = 0;
			}else if(i == this.m_color.length-1){
				mark = 1;
			}else{
				mark = i/(this.m_color.length-1);
			}
			grad.addColorStop(mark, this.m_color[i]);
		}
	}
	this.ctx.beginPath();
	this.ctx.fillStyle = grad;
	this.ctx.fillRect(0, 0, crWidth, this.m_height * 1);
	this.ctx.fill();
	this.ctx.closePath();
};

/** @description Drawing of chart started by drawing different parts of chart like SVG Container,Title,SubTitle. **/
WorldMapChart.prototype.drawChartFrame = function () {
	this.createSVGContainer();
	this.m_chartFrame.drawFrame();
};

/** @description Will Draw Title on svg if showTitle set to true. **/
WorldMapChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

/** @description Will Draw SubTitle on svg if showSubTitle set to true. **/
WorldMapChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

/** @description Getter Method for Image data. **/
WorldMapChart.prototype.getImage = function () {
	var img;
	for (var key in svg_set) {
		if (key.toLowerCase() == this.m_symbol.toLowerCase()) {
			img = svg_set[key];
			break;
		}
	}
	var pt = (img != undefined && this.m_symbolcategory != "none") ? img : (this.m_imgdata != undefined || this.m_imgdata != "" ? this.m_imgdata : this.m_defaultimg);
	return pt;
};

/** @description Drawing of chart started by drawing different parts of chart like ChartFrame,Title,SubTitle. **/
WorldMapChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	var map = this.IsDrawingPossible();
	if (this.m_svgtype == "leaflet" && !IsBoolean(this.m_designMode)) {
		map = this.IsLeafletDrawingPossible(map);
	}
	if (IsBoolean(map.permission) && this.m_svgtype == "svg") {
		this.drawMap();
	} else if (IsBoolean(map.permission) && this.m_svgtype == "leaflet") {
		if(!IsBoolean(this.m_designMode)) {
			if(this.m_geometrytype == "line" || this.m_geometrytype == "polygon") {
				this.setShapeData();
			}else{
				this.drawLeafletMap();
			}
		} else {
			this.drawDesignModeLeaflet();
		}
	} else {
		this.drawMessage(map.message);
	}
};

/**  @description check for valid configuration of latitude and longitude to draw a component, if not then set the message **/
WorldMapChart.prototype.IsLeafletDrawingPossible = function(map) {
	if (IsBoolean(map.permission) && (this.m_latitudepoints.length == 0 || this.m_longitudepoints.length == 0 || this.m_latitudepoints.length > 1 || this.m_longitudepoints.length > 1) && (this.m_geometrytype == "marker" || this.m_geometrytype == "clustered" || this.m_geometrytype == "trail")) {
		map = {
			"permission": "false",
			message: this.m_status.noLatitudeLongitudeData
		};
	}
	/* BDD-915 Leaflet trip event issue fixed*/
	else if(IsBoolean(map.permission) && (this.m_latitudepoints.length == 0 || this.m_longitudepoints.length == 0 || this.m_tripeventpoints.length == 0 || this.m_latitudepoints.length > 1 || this.m_longitudepoints.length > 1 || this.m_tripeventpoints.length > 1) && this.m_geometrytype == "trip"){
		map = {
			"permission": "false",
			message: this.m_status.noLatitudeLongitudeData + " and Trip Event"
		};
	}
	return map;
};

/**  @description draws leaflet map in design mode**/
WorldMapChart.prototype.drawDesignModeLeaflet = function () {
	var temp = this;
	var lat = 40.745176;
	var lang = 0;
	var mapOptions = {
		    center: [lat, lang],
		    dragging : false,
		    doubleClickZoom : false,
		    scrollWheelZoom : false,
		    zoom: 1
	};
	var map = L.map("svgMapDiv" + temp.m_objectid, mapOptions);
	this.addLeafletLink(L, map);
};
WorldMapChart.prototype.addLeafletLink = function (L, map) {
	if (this.m_mapoptions.mapvariant === 'default' || this.m_mapoptions.mapvariant === undefined) {
		var osmUrl = '//{s}.tile.osm.org/{z}/{x}/{y}.png';
		var osmAttrib = '<a href="//openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>';
		L.tileLayer(osmUrl, {
			maxZoom: 18,
			attribution: osmAttrib
		}).addTo(map);
	} else {
		L.tileLayer.provider(this.m_mapoptions.mapvariant).addTo(map);
	}
	this.applyAdditionalStyles(L, map);
};

/** @description Set additional controlling events in dashboard by overriding this method **/
WorldMapChart.prototype.applyAdditionalStyles = function (L, map) {
	/** it will disable the zoom in map by mouse-scroll **/
	//map.scrollWheelZoom.disable(); 
	
	/** Refer https://leafletjs.com/reference-1.5.0.html for more configuration **/
};

/**  @description converts csv/excel to geojson for leaflet**/
WorldMapChart.prototype.getGeoJsonData = function () {
	var geoJson;
	var type = "Point";
	var keyList = [];

	geoJson = "{\"type\":\"FeatureCollection\"";
	if (type == "Point") {
	    var latKey = "Latitude";
	    var lonKey = "Longitude";
	    if (latKey == null || lonKey == null) {
	        alertMessage("error", "Latitude and Longitude has not been found!");
	    }

	    keyList.push(latKey);
	    keyList.push(lonKey);

	    geoJson += ",\"features\": [";
	    for (var j = 0; j < this.m_latitudepoints.length; j++) {
	        for (var k = 0; k < this.m_latitudepoints[0].length; k++) {
	            geoJson += "{\"type\":\"Feature\"," +
	                "\"geometry\":{\"type\":\"Point\"," +
	                "\"coordinates\":[" +
	                this.m_longitudepoints[j][k] +
	                "," + this.m_latitudepoints[j][k] + "]";
	                if(this.m_tripeventpoints[j] != undefined && this.m_tripeventpoints[j][k] != undefined){
	                	geoJson +=","+"\"tripevent\": "+this.m_tripeventpoints[j][k] +"},\"properties\": {";
	                } else {
	                	geoJson +="},\"properties\": {";
	                }
	            for (var p = 0; p < this.m_markerNames.length; p++) {
	                geoJson += "\"" +
	                    this.m_markerDisplayNames[p] +
	                    "\": \"" +
	                    this.getFormatterForToolTip(this.m_markerNames[p], this.m_markerdata[p][k]) +
	                    "\",";
	            }
	            geoJson += "\"" +
			                "rownumber" +
			                "\": \"" +
			                k +
			                "\",";
	            geoJson = geoJson.slice(0, -1) + "}},";
	        }
	    }
	    geoJson = geoJson.slice(0, -1);
	    geoJson += "],";
	}
	geoJson += "\"keyList\":[";
	$.each(keyList, function(i, val) {
	    geoJson += "\"" +
	        keyList[i] +
	        "\",";
	});
	geoJson = geoJson.slice(0, -1) + "]}";
	return geoJson;
};

WorldMapChart.prototype.getGeoJsonTripData = function () {
	var geoJson;
	var type = "Point";
	var keyList = [];
	this.m_leafLetColorMapTrip = [];

	geoJson = "{\"type\":\"FeatureCollection\"";
	if (type == "Point") {
	    var latKey = "Latitude";
	    var lonKey = "Longitude";
	    if (latKey == null || lonKey == null) {
	        alertMessage("error", "Latitude and Longitude has not been found!");
	    }

	    keyList.push(latKey);
	    keyList.push(lonKey);

	    geoJson += ",\"features\": [";
	    for (var j = 0; j < this.m_latitudepoints.length; j++) {
	        for (var k = 0; k < this.m_latitudepoints[0].length; k++) {
				if(IsBoolean(this.m_tripeventpoints[j][k])){
	            geoJson += "{\"type\":\"Feature\"," +
	                "\"geometry\":{\"type\":\"Point\"," +
	                "\"coordinates\":[" +
	                this.m_longitudepoints[j][k] +
	                "," + this.m_latitudepoints[j][k] + "]";
	                if(this.m_tripeventpoints[j] != undefined && this.m_tripeventpoints[j][k] != undefined){
	                	geoJson +=","+"\"tripevent\": "+this.m_tripeventpoints[j][k] +"},\"properties\": {";
	                	this.m_leafLetColorMapTrip.push(this.m_leafLetColorMap[k]);
	                } else {
	                	geoJson +="},\"properties\": {";
	                }
	            for (var p = 0; p < this.m_markerNames.length; p++) {
	                geoJson += "\"" +
	                    this.m_markerDisplayNames[p] +
	                    "\": \"" +
	                    this.getFormatterForToolTip(this.m_markerNames[p], this.m_markerdata[p][k]) +
	                    "\",";
	            }
	            geoJson += "\"" +
			                "rownumber" +
			                "\": \"" +
			                k +
			                "\",";
	            geoJson = geoJson.slice(0, -1) + "}},";
			    }
	        }
	    }
	    geoJson = geoJson.slice(0, -1);
	    geoJson += "],";
	}
	geoJson += "\"keyList\":[";
	$.each(keyList, function(i, val) {
	    geoJson += "\"" +
	        keyList[i] +
	        "\",";
	});
	geoJson = geoJson.slice(0, -1) + "]}";
	return geoJson;
};
/**@description added getTrailGeoJsonData for trail type alert and tooltip BDD-926**/
WorldMapChart.prototype.getTrailGeoJsonData = function () {
	var geoJson;
	var type = "LineString";
	var keyList = [];
	var arrJson=[];

	geoJson = "{\"type\":\"FeatureCollection\"";
	if (type == "LineString") {
	    var latKey = "Latitude";
	    var lonKey = "Longitude";
	    if (latKey == null || lonKey == null) {
	        alertMessage("error", "Latitude and Longitude has not been found!");
	    }

	    keyList.push(latKey);
	    keyList.push(lonKey);

	    geoJson += ",\"features\": [";
	    for (var j = 0; j < this.m_latitudepoints.length; j++) {
	        for (var k = 0; k < this.m_latitudepoints[0].length-1; k++) {
	            geoJson += "{\"type\":\"Feature\"," +
	                "\"geometry\":{\"type\":\"LineString\"," +
	                "\"coordinates\":[[" +
	                this.m_longitudepoints[j][k] +
	                "," + this.m_latitudepoints[j][k] + "],["+
	                this.m_longitudepoints[j][k+1] +
	                "," + this.m_latitudepoints[j][k+1] + "]]";
	               /* if(this.m_tripeventpoints[j] != undefined && this.m_tripeventpoints[j][k] != undefined){
	                	geoJson +=","+"\"tripevent\": "+this.m_tripeventpoints[j][k] +"},\"properties\": {";
	                } else {*/
	                	geoJson +="},\"properties\": {";
	               // }
	            for (var p = 0; p < this.m_markerNames.length; p++) {
	                geoJson += "\"" +
	                    this.m_markerDisplayNames[p] +
	                    "\": \"" +
	                    this.getFormatterForToolTip(this.m_markerNames[p], this.m_markerdata[p][k]) +
	                    "\",";
	            }
	            geoJson += "\"" +
			                "rownumber" +
			                "\": \"" +
			                k +
			                "\",";
	            geoJson = geoJson.slice(0, -1) + "}},";
	        }
	    }
	    geoJson = geoJson.slice(0, -1);
	    geoJson += "],";
	}
	geoJson += "\"keyList\":[";
	$.each(keyList, function(i, val) {
	    geoJson += "\"" +
	        keyList[i] +
	        "\",";
	});
	geoJson = geoJson.slice(0, -1) + "]}";
	return geoJson;
};
/**  @description converts csv/excel to geojson for leaflet**/
WorldMapChart.prototype.getGeoTrailData = function () {
	var coordinates = [];
	for (var j = 0; j < this.m_latitudepoints.length; j++) {
        for (var k = 0; k < this.m_latitudepoints[0].length; k++) {
        	if(this.m_latitudepoints[0][k] !== "" && this.m_longitudepoints[0][k]){
        		if (this.m_geometrytype == "trip" || this.m_geometrytype == "circle") {
        			coordinates.push([this.m_latitudepoints[0][k], this.m_longitudepoints[0][k]]);
        		} else {
        			coordinates.push([this.m_longitudepoints[0][k], this.m_latitudepoints[0][k]]);
        		}
        	}
        }
    }
	return coordinates;
};

WorldMapChart.prototype.getGeoTripData = function () {
	var coordinates = [];
	for (var j = 0; j < this.m_latitudepoints.length; j++) {
        for (var k = 0; k < this.m_latitudepoints[0].length; k++) {
        	if (this.m_latitudepoints[0][k] !== "" && this.m_longitudepoints[0][k]) {
                if (this.m_geometrytype == "trip") {
                    //if(this.m_latitudepoints[0][k] !== "" && this.m_longitudepoints[0][k] && IsBoolean(this.m_tripeventpoints[0][k])){
                    if (IsBoolean(this.m_tripeventpoints[0][k])) {
                        coordinates.push([this.m_latitudepoints[0][k], this.m_longitudepoints[0][k]]);
                    }
                    //}
                } else {
                    coordinates.push([this.m_latitudepoints[0][k], this.m_longitudepoints[0][k]]);
                }
                /**Added above conditions for BDD-926**/
            }
        }
    }
	return coordinates;
};

/**  @description will draw leaflet marker map**/
WorldMapChart.prototype.drawLeafletMap = function () {
	switch(this.m_geometrytype){
	case "marker":
		this.drawLeafletMapMarker();
		break;
	case "line":
		this.drawLeafletMapLine();
		break;
	case "polygon":
		this.drawLeafletMapPolygon();
		break;
	case "clustered":
		this.drawLeafletMapClusterd();
		break;
	case "trail":
		this.drawLeafletMapTrail();
		break;
	case "trip":
		this.drawLeafletMapTrip();
		break;
	case "realtime":
		this.drawLeafletMapRealtime();
		break;
	case "circle":
		this.drawCircle();
		break;
	default:
		this.drawLeafletMap_Old();
	}
};

WorldMapChart.prototype.drawLeafletMapMarker = function () {
	var temp = this;
	var geojsonData = this.getGeoJsonData();
	var geojson1 = JSON.parse(geojsonData);
	var features = geojson1.features;
	/*DAS-264 set map marker and zoom based on marker*/
	var coordinates = this.getGeoTripData();
	if(geojson1.features.length !== 0) {
		var property = this.m_markerDisplayNames[0];
		var defaultColor = convertColorToHex(this.m_defaultfillcolor);
		var defaultMapIcon = convertColorToHex(this.m_defaultfmapicon);
		var geometryType = this.m_geometrytype;
		var mapOptions =  $.extend(true,{},this.m_mapoptions);
		mapOptions.zoom = 1;
		mapOptions.scrollWheelZoom = (mapOptions.wheelzoom === undefined) ? true : mapOptions.wheelzoom;
		mapOptions.attributionControl = this.m_attributioncontrol;
		for(var i = 0; i < features.length; i++) {
			features[i]["properties"]["color"] = this.m_leafLetColorMap[i];
			features[i]["properties"]["color"] = (features[i]["properties"]["color"] == undefined) ? defaultColor : features[i]["properties"]["color"];
			/*DAS-292*/
			features[i]["properties"]["icon"] = this.m_leafLetIconMap[i];
			features[i]["properties"]["icon"] = (features[i]["properties"]["icon"] == undefined) ? temp.m_markericon.icon : features[i]["properties"]["icon"];
		}
		var map = L.map("svgMapDiv" + temp.m_objectid, mapOptions);
		this.m_map = map;
		if(IsBoolean(this.m_mapoptions.enableanimation)){
			map.flyTo(this.m_mapoptions.center,this.m_mapoptions.zoom,{duration: this.m_mapoptions.duration});
		}
		this.addLeafletLink(L, map);
		/*DAS-264 set map marker and zoom based on marker*/
		if(coordinates.length > 0){
			//draw the boundry line for the map for zoom
			var bounds = L.latLngBounds(coordinates);
			map.fitBounds(bounds);
			//var polyline = L.polyline(coordinates, {color: defaultColor});
			// zoom-in the map to the polyline@getBounds()
			//map.fitBounds(polyline.getBounds());
		}
		var geoJsonLayer = L.geoJson(geojson1, {
		    onEachFeature: function(feature, layer) {
		        if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
		            var popup = "";
		            var properties = feature.properties;
		            if (temp.m_customtextboxfortooltip.dataTipType == "Default") {
		                popup = "<html><body><table>";
		                $.each(temp.m_markerDisplayNames, function(index, val) {
		                    if (properties[val] == undefined) {
		                        popup += "<tr><td>No data found.</td></tr>";
		                        return null;
		                    }
		                    popup += "<tr><td style = 'font-size:"+ temp.m_tooltipfontsize + "px' >" +
		                        val +
		                        ": </td><td style = 'font-size:"+ temp.m_tooltipfontsize + "px' >" +
		                        properties[val] +
		                        "</td></tr>";
		                });
		                popup += "</table></body></html>";
		            } else {
		            	var tooltipData = {"data" : properties.rownumber * 1, "type" : "LeafletMap"};
		                popup = temp.m_tooltip.drawMapToolTip(tooltipData);
		            }
		            layer.bindPopup(popup);
		        }
		        layer.options.rowId = feature.properties.rownumber;
		        /*DAS-263*/
		        var timer = null;
		        var delay = 500;		  
	        	if(detectDevice.mobile() || detectDevice.tablet()) {
	        		if(detectDevice.android()) {
	        			layer.on({
				        	dblclick: whenClicked
				        });
	        		}
	        		else{
	        		layer.on('click', function(e) {
	        		    var test1 = layer;
	        		    test1.closePopup();
	        		    if (timer === null) {
	        		        timer = setTimeout(function() {
	        		        	timer = null;
	        		            test1.openPopup();
	        		            if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
	        		                var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
	        		                if (temp.m_customtooltipwidth !== "auto") {
	        		                    $(".leaflet-popup-content").css({
	        		                        "width": temp.m_customtooltipwidth + "px"
	        		                    });
	        		                }
	        		                $(".leaflet-popup-content-wrapper").css({
	        		                    "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
	        		                    "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
	        		                    "color": temp.m_tooltipfontcolor
	        		                });
	        		                $(".leaflet-popup-tip").css({
	        		                    "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
	        		                    "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
	        		                });
	        		                /** Added for control tooltip font size */
	        		                $(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
	        		            }
	        		        }, delay);

	        		    } else {
	        		        clearTimeout(timer);
	        		        timer = null;
	        		        whenClicked(e);
	        		    }
	        		});
	        	}
	        	} else {
			        layer.on('mouseover', function (e) {
		            	this.openPopup();
		            	if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
					        var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
					        if(temp.m_customtooltipwidth !== "auto"){
					        	$(".leaflet-popup-content").css({"width": temp.m_customtooltipwidth + "px"});
					        }
					        $(".leaflet-popup-content-wrapper").css({
					            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
					            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
					            "color": temp.m_tooltipfontcolor
					        });
					        $(".leaflet-popup-tip").css({
					            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
					            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
					        });
					        /** Added for control tooltip font size */
					        $(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
					    }
		      		});
			        layer.on('mouseout', function (e) {
			            this.closePopup();
			        });
			        /*DAS-263*/
			        layer.on('click', function (e) {
			            whenClicked(e);
			        });
	        	}
	        	/*
		        if(detectDevice.mobile() || detectDevice.tablet()) {
			        layer.on({
			        	dblclick: whenClicked
			        });
		        } else {
			        layer.on({
			        	click: whenClicked
			        });
		        }
		        */
		    },
		    pointToLayer: function (feature, latlng) {
		    	var custIcon;
		    	var color;
		    	var icon;
				if (feature.properties.color != undefined) {
					color = feature.properties.color;
				} else {
					color = defaultColor;
				}
				if (feature.properties.icon != undefined) {
					//temp.m_markericon.icon=feature.properties.icon;
					icon = feature.properties.icon;
				} else {
					icon = temp.m_markericon.icon;
				}
				//temp.m_markericon.color = color;
				/*indicator map marker icon code goes here*/
				//temp.m_markericon.icon=icon;
				/** if bd- font icons used, it will not bring the markers images from http call **/
				/*(temp.m_markericon.icon.indexOf("bd-")==0)*/
				if(temp.m_svgicons){
					if(icon.indexOf("bd-") !== 0){
						var svg = temp.drawSVGImage(icon);
						custIcon = L.divIcon({
							className: '',
							html: '<div style="height:'+temp.m_markericon.size+'px; width:'+temp.m_markericon.size+'px;">'+svg+'</div>' 
						});
					}else{
						icon = (icon.includes('bd-glyphicon')) ? (icon.replace("bd-", "")) : icon;
						custIcon = L.divIcon({
							className: '',
							html: '<div class="'+icon+'" style="text-shadow: 1px 2px 2px #666;font-size: '+temp.m_markericon.size+'px;margin: -15px -10px 0px -10px;height: 40px;box-shadow: 0px 8px 6px -6px #666;border-radius: 15px;color:'+color+'">' 
						});
					}
				}else{
					if(icon.indexOf("bd-") == 0){
					icon = (icon.includes('bd-glyphicon')) ? (icon.replace("bd-", "")) : icon;
					custIcon = L.divIcon({
						className: '',
						html: '<div class="'+icon+'" style="text-shadow: 1px 2px 2px #666;font-size: '+temp.m_markericon.size+'px;margin: -15px -10px 0px -10px;height: 40px;box-shadow: 0px 8px 6px -6px #666;border-radius: 15px;color:'+color+'">' 
					});
					}else{
						custIcon = L.MakiMarkers.icon({icon: icon, color: color, size: temp.m_makimarkericonsize});
						//custIcon = L.MakiMarkers.icon(temp.m_markericon);
					}
				}
				
				return L.marker(latlng, {icon: custIcon});
		    }
		});
		
		function whenClicked(e) {
			  var index = e.target.options.rowId;
			  var drillObj = temp.m_leafLetDataMap[index];
			  var tempMap = {};
				for(var key in drillObj) {
					var d = drillObj[key];
					if(IsBoolean(temp.m_seriesVisibleArr[key]))
						tempMap[d.seriesName] = d.displayData;
				}
				temp.m_fieldvalue = tempMap;
				if(index > -1) {
					var title = temp.m_categoryData[0][index];
					temp.m_fieldcolor = geojson1.features[index].properties.color;
					temp.getDataPointAndUpdateGlobalVariable(temp.getOrigionalTitle(title), index);
				}
				/**Added for tooltip property*/
				 if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
				        var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
				        if(temp.m_customtooltipwidth !== "auto"){
				        	$(".leaflet-popup-content").css({"width": temp.m_customtooltipwidth + "px"});
				        }
				        $(".leaflet-popup-content-wrapper").css({
				            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
				            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
				            "color": temp.m_tooltipfontcolor
				        });
				        $(".leaflet-popup-tip").css({
				            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
				            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
				        });
				        /** Added for control tooltip font size */
				        $(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
				    }
			}
			map.addLayer(geoJsonLayer);
	} else {
		this.drawMessage({ "permission": "false", message: "Connection data does not match with shape file data"}.message);
	}
};
WorldMapChart.prototype.drawSVGImage = function (svg) {
    var img = svg;
    try {
        var str = img;
        var index = 4;
        for (var i = 0; i < $(img).length; i++) {
            if ($(img)[i].tagName != undefined && ($(img)[i].tagName).toLowerCase() == "svg") {
                index = i;
                break;
            }
        }
        if ($(img)[index] != undefined) {
            var attrs = $(img)[index].attributes;
            var viewBox;
            var height;
            var width;
            for (var i = 0; i < attrs.length; i++) {
                if (attrs[i].name == "height")
                    height = attrs[i].value;
                if (attrs[i].name == "width")
                    width = attrs[i].value;
                if ((attrs[i].name).toLowerCase() == "viewbox")
                    viewBox = attrs[i].value;
            }
            if (viewBox == undefined) {
                viewBox = "0 0 " + height * 1 + " " + width * 1;
                str = img.replace('height="' + height + '"', 'viewBox="' + viewBox + '"');
                str = str.replace('width="' + width + '"', "");
            } else {
                str = str.replace('width="' + width + '"', "");
                str = str.replace('height="' + height + '"', "");
            }
        }
        //Removed SVG.js draw
        var svg =str;
        return svg;    
        } catch (e) {
        console.log(e);
        console.log("Invalid SVG Image");
        return "";
    }
};

WorldMapChart.prototype.drawLeafletMapLine = function () {
	var temp = this;
	var geojsonData = this.shapeJsonData;

	var geojson1 = JSON.parse(geojsonData);
	var features = geojson1.features;

	var filteredLineFeatures = [];
	var count = 0;
    for (var i = 0; i < features.length; i++) {
    	if(this.m_origionalDataMap[features[i][this.m_categoryNames[0]]]) {
	        for (var p = 0; p < this.m_markerNames.length; p++) {
	            features[i].properties[this.m_markerDisplayNames[p]] = this.getFormatterForToolTip(this.m_markerNames[p], this.m_markerdata[p][count]);
	        }
	        features[i].properties.rownumber = count++;
	        filteredLineFeatures.push(features[i]);
    	}
    }
    features = filteredLineFeatures;
	geojson1.features = filteredLineFeatures;

	if(geojson1.features.length !== 0) {
		var property = this.m_markerDisplayNames[0];
		var defaultColor = convertColorToHex(this.m_defaultfillcolor);
		var geometryType = this.m_geometrytype;
		var mapOptions =  $.extend(true,{},this.m_mapoptions);
		mapOptions.zoom = 1;
		mapOptions.attributionControl = this.m_attributioncontrol;
		for(var i = 0; i < features.length; i++) {
			features[i]["properties"]["color"] = this.m_leafLetColorMap[i];
			features[i]["properties"]["color"] = (features[i]["properties"]["color"] == undefined) ? defaultColor : features[i]["properties"]["color"];
			}
		var map = L.map("svgMapDiv" + temp.m_objectid, mapOptions);
		if(IsBoolean(this.m_mapoptions.enableanimation)){
			map.flyTo(this.m_mapoptions.center,this.m_mapoptions.zoom,{duration: this.m_mapoptions.duration});
		}
		this.addLeafletLink(L, map);
		var geoJsonLayer = L.geoJson(geojson1, {
			style: function (feature) {
		    	var value = '';
		    	var color;
				if (feature.properties.color != undefined) {
					color = feature.properties.color;
				} else {
					color = defaultColor;
				}
				value = {
				    color: color,
				    weight: 2,
				    opacity: 1,
		    	};
				return value;
		    },
		    onEachFeature: function(feature, layer) {
		        if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
		            var popup = "";
		            var properties = feature.properties;
		            if (temp.m_customtextboxfortooltip.dataTipType == "Default") {
		                popup = "<html><body><table>";
		                $.each(temp.m_markerDisplayNames, function(index, val) {
		                    if (properties[val] == undefined) {
		                        popup += "<tr><td>No data found.</td></tr>";
		                        return null;
		                    }
		                    popup += "<tr><td style = 'font-size:"+ temp.m_tooltipfontsize + "px' >" +
	                        val +
	                        ": </td><td style = 'font-size:"+ temp.m_tooltipfontsize + "px' >" +
		                        properties[val] +
		                        "</td></tr>";
		                });
		                popup += "</table></body></html>";
		            } else {
		            	var tooltipData = {"data" : properties.rownumber * 1, "type" : "LeafletMap"};
		                popup = temp.m_tooltip.drawMapToolTip(tooltipData);
		            }
		            layer.bindPopup(popup);
		        }
		        layer.options.rowId = feature.properties.rownumber;
		        /* DAS-263 */
		        var timer = null;
		        var delay = 500;
		        if(detectDevice.mobile() || detectDevice.tablet()) {
		        	if(detectDevice.android()) {
	        			layer.on({
				        	dblclick: whenClicked
				        });
	        		}
		        	else{
		        	layer.on('click', function(e) {
		        		var test1 = layer;
                    	test1.closePopup();
		        	    if (timer === null) {
		        	        timer = setTimeout(function() {
		        	            timer = null;
		        	            test1.openPopup();
		        	        },delay);
		        	    } else {
		        	        clearTimeout(timer);
		        	        timer = null;
		        	        whenClicked(e);
		        	    }
		        	});
		        }
		        	/*
			        layer.on({
			        	dblclick: whenClicked
			        });
			        */
		        } else {
			        layer.on({
			        	click: whenClicked
			        });
		        }
		    },
		    pointToLayer: function (feature, latlng) {
		    	var custIcon;
		    	var color;
				if (feature.properties.color != undefined) {
					color = feature.properties.color;
				} else {
					color = defaultColor;
				}
				temp.m_markericon.color = color;
				/** if bd- font icons used, it will not bring the markers images from http call **/
				if(temp.m_markericon.icon.indexOf("bd-") == 0){
					var icon = (temp.m_markericon.icon.includes('bd-glyphicon')) ? (temp.m_markericon.icon.replace("bd-", "")) : temp.m_markericon.icon;
		            
					custIcon = L.divIcon({
						className: '',
						html: '<div class="'+icon+'" style="text-shadow: 1px 2px 2px #666;font-size: '+temp.m_markericon.size+'px;margin: -15px -10px 0px -10px;height: 40px;box-shadow: 0px 8px 6px -6px #666;border-radius: 15px;color:'+color+'">' 
					});
				}else{
					custIcon = L.MakiMarkers.icon({icon: temp.m_markericon.icon, color:temp.m_markericon.color, size: temp.m_makimarkericonsize});
				}
				return L.marker(latlng, {icon: custIcon});
		    }
		});
		
		function whenClicked(e) {
			  index = e.target.options.rowId;
			  var drillObj = temp.m_leafLetDataMap[index];
			  var tempMap = {};
				for(var key in drillObj) {
					var d = drillObj[key];
					if(IsBoolean(temp.m_seriesVisibleArr[key]))
						tempMap[d.seriesName] = d.displayData;
				}
				temp.m_fieldvalue = tempMap;
				if(index > -1) {
					var title = temp.m_categoryData[0][index];
					temp.m_fieldcolor = geojson1.features[index].properties.color;
					temp.getDataPointAndUpdateGlobalVariable(temp.getOrigionalTitle(title), index);
				}
				/**Added for tooltip property*/
				 if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
				        var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
				        if(temp.m_customtooltipwidth !== "auto"){
				        	$(".leaflet-popup-content").css({"width": temp.m_customtooltipwidth + "px"});
				        }
				        $(".leaflet-popup-content-wrapper").css({
				            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
				            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
				            "color": temp.m_tooltipfontcolor
				        });
				        $(".leaflet-popup-tip").css({
				            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
				            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
				        });
				        /** Added for control tooltip font size */
				        $(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
				    }
			}
			map.addLayer(geoJsonLayer);
	} else {
		this.drawMessage({ "permission": "false", message: "Connection data does not match with shape file data"}.message);
	}	
};

WorldMapChart.prototype.drawLeafletMapPolygon = function () {
	var temp = this;
	var geojsonData = this.shapeJsonData;
	
	var geojson1 = JSON.parse(geojsonData);
	var features = geojson1.features;
	
    var count = 0;
    var filteredFeaturesArray = [];
    for (var i = 0; i < features.length; i++) {
        if (this.m_origionalDataMap[features[i].id]) {
            for (var j = 0; j < this.m_categoryNames.length; j++) {
                features[i].properties[this.m_categoryNames[j]] = features[i].id;
            }
            for (var k = 0; k < this.m_seriesNames.length; k++) {
                var index = this.m_categoryData[0].indexOf(features[i].id);
                features[i].properties[this.m_seriesNames[k]] = this.getFormatterForToolTip(this.m_markerNames[k], this.m_markerdata[k][index]);
            }
            features[i].properties.rownumber = count++;
            filteredFeaturesArray.push(features[i]);
        }
    }
    features = filteredFeaturesArray;
	geojson1.features = filteredFeaturesArray;
	
	if(geojson1.features.length !== 0) {
		var property = this.m_markerDisplayNames[0];
		var defaultColor = convertColorToHex(this.m_defaultfillcolor);
		var geometryType = this.m_geometrytype;
		var mapOptions =  $.extend(true,{},this.m_mapoptions);
		mapOptions.zoom = 1;
		mapOptions.attributionControl = this.m_attributioncontrol;
		for(var i = 0; i < features.length; i++) {
			var index = this.m_categoryData[0].indexOf(features[i].id);
			features[i]["properties"]["color"] = this.m_leafLetColorMap[index];
			features[i]["properties"]["color"] = (features[i]["properties"]["color"] == undefined) ? defaultColor : features[i]["properties"]["color"];
			}
		var map = L.map("svgMapDiv" + temp.m_objectid, mapOptions);
		if(IsBoolean(this.m_mapoptions.enableanimation)){
			map.flyTo(this.m_mapoptions.center,this.m_mapoptions.zoom,{duration: this.m_mapoptions.duration});
		}
		this.addLeafletLink(L, map);
		var geoJsonLayer = L.geoJson(geojson1, {
			style: function (feature) {
		    	var value = '';
		    	var color;
				if (feature.properties.color != undefined) {
					color = feature.properties.color;
				} else {
					color = defaultColor;
				}
				value = {
					fillColor: color,
				    color: color,
				    weight: 1,
				    opacity: 1,
				    fillOpacity: 0.8
		    	};
				return value;
		    },
		    onEachFeature: function(feature, layer) {
		        if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
		            var popup = "";
		            var properties = feature.properties;
		            if (temp.m_customtextboxfortooltip.dataTipType == "Default") {
		                popup = "<html><body><table>";
		                $.each(temp.m_markerDisplayNames, function(index, val) {
		                    if (properties[val] == undefined) {
		                        popup += "<tr><td>No data found.</td></tr>";
		                        return null;
		                    }
		                    popup += "<tr><td style = 'font-size:"+ temp.m_tooltipfontsize + "px' >" +
	                        val +
	                        ": </td><td style = 'font-size:"+ temp.m_tooltipfontsize + "px' >" +
		                        properties[val] +
		                        "</td></tr>";
		                });
		                popup += "</table></body></html>";
		            } else {
		            	var tooltipData = {"data" : properties.rownumber * 1, "type" : "LeafletMap"};
		                popup = temp.m_tooltip.drawMapToolTip(tooltipData);
		            }
		            layer.bindPopup(popup);
		        }
		        layer.options.rowId = feature.properties.rownumber;
		        /* DAS-263 */
		        var timer = null;
		        var delay = 500;
		        if(detectDevice.mobile() || detectDevice.tablet()) {
		        	if(detectDevice.android()) {
	        			layer.on({
				        	dblclick: whenClicked
				        });
	        		}else{
		        	layer.on('click', function(e) {
		        		var test1 = layer;
                    	test1.closePopup();
		        	    if (timer === null) {
		        	        timer = setTimeout(function() {
		        	            timer = null;
		        	            test1.openPopup();
		        	        },delay);
		        	    } else {
		        	        clearTimeout(timer);
		        	        timer = null;
		        	        whenClicked(e);
		        	    }
		        	});
		        }
		        	/*
			        layer.on({
			        	dblclick: whenClicked
			        });
			        */
		        } else {
			        layer.on({
			        	click: whenClicked
			        });
		        }
		    },
		    pointToLayer: function (feature, latlng) {
		    	var custIcon;
		    	var color;
				if (feature.properties.color != undefined) {
					color = feature.properties.color;
				} else {
					color = defaultColor;
				}
				temp.m_markericon.color = color;
				/** if bd- font icons used, it will not bring the markers images from http call **/
				if(temp.m_markericon.icon.indexOf("bd-") == 0){
					var icon = (temp.m_markericon.icon.includes('bd-glyphicon')) ? (temp.m_markericon.icon.replace("bd-", "")) : temp.m_markericon.icon;
		            
					custIcon = L.divIcon({
						className: '',
						html: '<div class="'+icon+'" style="text-shadow: 1px 2px 2px #666;font-size: '+temp.m_markericon.size+'px;margin: -15px -10px 0px -10px;height: 40px;box-shadow: 0px 8px 6px -6px #666;border-radius: 15px;color:'+color+'">' 
					});
				}else{
					custIcon = L.MakiMarkers.icon({icon: temp.m_markericon.icon, color: temp.m_markericon.color, size:temp.m_makimarkericonsize});
				}
				return L.marker(latlng, {icon: custIcon});
		    }
		});
		
		function whenClicked(e) {
			  index = e.target.options.rowId;
			  var drillObj = temp.m_leafLetDataMap[index];
			  var tempMap = {};
				for(var key in drillObj) {
					var d = drillObj[key];
					if(IsBoolean(temp.m_seriesVisibleArr[key]))
						tempMap[d.seriesName] = d.displayData;
				}
				temp.m_fieldvalue = tempMap;
				if(index > -1) {
					var title = temp.m_categoryData[0][index];
					temp.m_fieldcolor = geojson1.features[index].properties.color;
					temp.getDataPointAndUpdateGlobalVariable(temp.getOrigionalTitle(title), index);
				}
				/**Added for tooltip property*/
				 if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
				        var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
				        if(temp.m_customtooltipwidth !== "auto"){
				        	$(".leaflet-popup-content").css({"width": temp.m_customtooltipwidth + "px"});
				        }
				        $(".leaflet-popup-content-wrapper").css({
				            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
				            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
				            "color": temp.m_tooltipfontcolor
				        });
				        $(".leaflet-popup-tip").css({
				            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
				            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
				        });
				        /** Added for control tooltip font size */
				        $(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
				    }
			}
			map.addLayer(geoJsonLayer);
	} else {
		this.drawMessage({ "permission": "false", message: "Connection data does not match with shape file data"}.message);
	}
};

WorldMapChart.prototype.drawLeafletMapClusterd = function () {
	var temp = this;
	var geojsonData = this.getGeoJsonData();
	var geojson1 = JSON.parse(geojsonData);
	var features = geojson1.features;
	var coordinates = this.getGeoTripData();
	if(geojson1.features.length !== 0) {
		var property = this.m_markerDisplayNames[0];
		var defaultColor = convertColorToHex(this.m_defaultfillcolor);
		var geometryType = this.m_geometrytype;
		var mapOptions =  $.extend(true,{},this.m_mapoptions);
		mapOptions.zoom = 1;
		mapOptions.attributionControl = this.m_attributioncontrol;
		for(var i = 0; i < features.length; i++) {
			features[i]["properties"]["color"] = this.m_leafLetColorMap[i];
			features[i]["properties"]["color"] = (features[i]["properties"]["color"] == undefined) ? defaultColor : features[i]["properties"]["color"];
			/*DAS-292*/
			features[i]["properties"]["icon"] = this.m_leafLetIconMap[i];
			features[i]["properties"]["icon"] = (features[i]["properties"]["icon"] == undefined) ? temp.m_markericon.icon : features[i]["properties"]["icon"];
		}
		var map = L.map("svgMapDiv" + temp.m_objectid, mapOptions);
		if(IsBoolean(this.m_mapoptions.enableanimation)){
			map.flyTo(this.m_mapoptions.center,this.m_mapoptions.zoom,{duration: this.m_mapoptions.duration});
		}
		this.addLeafletLink(L, map);
		/*DAS-264 set map marker and zoom based on marker*/
		if(coordinates.length > 0){
			//draw the boundry line for the map for zoom
			var bounds = L.latLngBounds(coordinates);
			map.fitBounds(bounds);
			//var polyline = L.polyline(coordinates, {color: defaultColor});
			// zoom-in the map to the polyline@getBounds()
			//map.fitBounds(polyline.getBounds());
		}
		var markers = L.markerClusterGroup();
		var geoJsonLayer = L.geoJson(geojson1, {
			style: function (feature) {
		    	var value = '';
		    	var color;
				if (feature.properties.color != undefined) {
					color = feature.properties.color;
				} else {
					color = defaultColor;
				}
				value = {
					fillColor: color,
				    color: color,
				    weight: 1,
				    opacity: 1,
				    fillOpacity: 0.8
		    	};
				return value;
		    },
		    onEachFeature: function(feature, layer) {
		        if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
		            var popup = "";
		            var properties = feature.properties;
		            if (temp.m_customtextboxfortooltip.dataTipType == "Default") {
		                popup = "<html><body><table>";
		                $.each(temp.m_markerDisplayNames, function(index, val) {
		                    if (properties[val] == undefined) {
		                        popup += "<tr><td>No data found.</td></tr>";
		                        return null;
		                    }
		                    popup += "<tr><td style = 'font-size:"+ temp.m_tooltipfontsize + "px' >" +
	                        val +
	                        ": </td><td style = 'font-size:"+ temp.m_tooltipfontsize + "px' >" +
		                        properties[val] +
		                        "</td></tr>";
		                });
		                popup += "</table></body></html>";
		            } else {
		            	var tooltipData = {"data" : properties.rownumber * 1, "type" : "LeafletMap"};
		                popup = temp.m_tooltip.drawMapToolTip(tooltipData);
		            }
		            layer.bindPopup(popup);
		        }
		        layer.options.rowId = feature.properties.rownumber;
		        /*DAS-263*/
		        var timer = null;
		        var delay = 500;
	        	if(detectDevice.mobile() || detectDevice.tablet()) {
	        		if(detectDevice.android()) {
	        			layer.on({
				        	dblclick: whenClicked
				        });
	        		}else{
	        		 layer.on('click', function (e) {
	        			 var test1 = layer;
	                    	test1.closePopup();
		        		    if (timer === null) {
		        		        timer = setTimeout(function() {
		        		        timer = null;
		        		        test1.openPopup();
			            	if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
						        var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
						        if(temp.m_customtooltipwidth !== "auto"){
						        	$(".leaflet-popup-content").css({"width": temp.m_customtooltipwidth + "px"});
						        }
						        $(".leaflet-popup-content-wrapper").css({
						            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
						            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
						            "color": temp.m_tooltipfontcolor
						        });
						        $(".leaflet-popup-tip").css({
						            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
						            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
						        });
						        /** Added for control tooltip font size */
						        $(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
			            	
						    }
		        		     },delay);
	        		     }
	        			 else
							{
							clearTimeout(timer);
							timer = null;
							whenClicked(e);
							}
			      		});
	        	}
	        	} else {
			        layer.on('mouseover', function (e) {
		            	this.openPopup();
		            	if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
					        var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
					        if(temp.m_customtooltipwidth !== "auto"){
					        	$(".leaflet-popup-content").css({"width": temp.m_customtooltipwidth + "px"});
					        }
					        $(".leaflet-popup-content-wrapper").css({
					            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
					            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
					            "color": temp.m_tooltipfontcolor
					        });
					        $(".leaflet-popup-tip").css({
					            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
					            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
					        });
					        /** Added for control tooltip font size */
					        $(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
					    }
		      		});
			        layer.on('mouseout', function (e) {
			            this.closePopup();
			        });
			        layer.on('click', function (e) {
			        	whenClicked(e);
			        });
	        	}
	        	/*
		        if(detectDevice.mobile() || detectDevice.tablet()) {
			        layer.on({
			        	dblclick: whenClicked
			        });
		        } else {
			        layer.on({
			        	click: whenClicked
			        });
		        }
		        */
		    },
		    pointToLayer: function (feature, latlng) {
		    	var custIcon;
		    	var color;
		    	var icon;
				if (feature.properties.color != undefined) {
					color = feature.properties.color;
				} else {
					color = defaultColor;
				}
				if (feature.properties.icon != undefined) {
					//temp.m_markericon.icon=feature.properties.icon;
					icon = feature.properties.icon;
				} else {
					icon = temp.m_markericon.icon;
				}
				/** if bd- font icons used, it will not bring the markers images from http call **/
				/*if(temp.m_markericon.icon.indexOf("bd-") == 0)*/
				if(temp.m_svgicons){
					if(icon.indexOf("bd-") !== 0){
						var svg = temp.drawSVGImage(icon);
						custIcon = L.divIcon({
							className: '',
							html: '<div style="height:'+temp.m_markericon.size+'px; width:'+temp.m_markericon.size+'px;">'+svg+'</div>' 
						});
					}else{
						icon = (icon.includes('bd-glyphicon')) ? (icon.replace("bd-", "")) : icon;
						custIcon = L.divIcon({
							className: '',
							html: '<div class="'+icon+'" style="text-shadow: 1px 2px 2px #666;font-size: '+temp.m_markericon.size+'px;margin: -15px -10px 0px -10px;height: 40px;box-shadow: 0px 8px 6px -6px #666;border-radius: 15px;color:'+color+'">' 
						});
				}}else{
					if(icon.indexOf("bd-") == 0){
					icon = (icon.includes('bd-glyphicon')) ? (icon.replace("bd-", "")) : icon;
					custIcon = L.divIcon({
						className: '',
						html: '<div class="'+icon+'" style="text-shadow: 1px 2px 2px #666;font-size: '+temp.m_markericon.size+'px;margin: -15px -10px 0px -10px;height: 40px;box-shadow: 0px 8px 6px -6px #666;border-radius: 15px;color:'+color+'">' 
					});
					}else{
						custIcon = L.MakiMarkers.icon({icon: icon, color: color, size: temp.m_makimarkericonsize});
						//custIcon = L.MakiMarkers.icon(temp.m_markericon);
					}
				}
				return L.marker(latlng, {icon: custIcon});
		    }
		});
		
		function whenClicked(e) {
			  var index = e.target.options.rowId;
			  var drillObj = temp.m_leafLetDataMap[index];
			  var tempMap = {};
				for(var key in drillObj) {
					var d = drillObj[key];
					if(IsBoolean(temp.m_seriesVisibleArr[key]))
						tempMap[d.seriesName] = d.displayData;
				}
				temp.m_fieldvalue = tempMap;
				if(index > -1) {
					var title = temp.m_categoryData[0][index];
					temp.m_fieldcolor = geojson1.features[index].properties.color;
					temp.getDataPointAndUpdateGlobalVariable(temp.getOrigionalTitle(title), index);
				}
				/**Added for tooltip property*/
				 if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
				        var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
				        if(temp.m_customtooltipwidth !== "auto"){
				        	$(".leaflet-popup-content").css({"width": temp.m_customtooltipwidth + "px"});
				        }
				        $(".leaflet-popup-content-wrapper").css({
				            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
				            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
				            "color": temp.m_tooltipfontcolor
				        });
				        $(".leaflet-popup-tip").css({
				            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
				            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
				        });
				        /** Added for control tooltip font size */
				        $(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
				    }
			}
			markers.addLayer(geoJsonLayer);
			map.addLayer(markers);
	} else {
		this.drawMessage({ "permission": "false", message: "Connection data does not match with shape file data"}.message);
	}
};
/*WorldMapChart.prototype.drawLeafletMapTrail = function () {
	var temp = this;
	var mapOptions =  $.extend(true,{},this.m_mapoptions);
	mapOptions.zoom = 1;
	mapOptions.attributionControl = this.m_attributioncontrol;
	mapOptions.scrollWheelZoom = (mapOptions.wheelzoom === undefined) ? true : mapOptions.wheelzoom;
	var map = L.map("svgMapDiv" + temp.m_objectid, mapOptions);
	var coordinates = this.getGeoTrailData();
	if(coordinates.length > 0){
		var lastCoordinate = [coordinates[coordinates.length-1][0], coordinates[coordinates.length-1][1]];
		map.flyTo(lastCoordinate, this.m_mapoptions.zoom, {duration: this.m_mapoptions.duration});
		this.addLeafletLink(L, map);
		var noel = {
		    "type": "Feature",
		    "properties": {},
		    "geometry": {
		        "type": "LineString",
		        "coordinates": coordinates
		    }
		};
		
		var polyline = L.polyline(coordinates, {color: this.m_markericon.color}).addTo(map);
		// zoom the map to the polyline
		map.fitBounds(polyline.getBounds());
		
		//var layer = L.geoJSON(noel, {color: this.m_markericon.color});//.addTo(map);
		

		//Number of points in linestring
		var numPts = coordinates.length;
	    var beg = coordinates[0];
	    var end = coordinates[numPts-1];

	    *//** https://leafletjs.com/reference-1.0.0.html#icon **//*
		var custIcon;
		*//** if bd- font icons used, it will not bring the markers images from http call **//*
		if(temp.m_markericon.icon.indexOf("bd-") == 0){
			custIcon = L.divIcon({
				className: '',
				html: '<div class="'+temp.m_markericon.icon+'" style="text-shadow: 1px 2px 2px #666;font-size: 30px;margin: -15px -10px 0px -10px;height: 40px;box-shadow: 0px 8px 6px -6px #666;border-radius: 15px;color:'+temp.m_markericon.color+'">' 
			});
		}else{
			custIcon = L.MakiMarkers.icon(temp.m_markericon);
		}
		
		
	    L.marker([beg[0],beg[1]],{icon: custIcon}).addTo(map);
	    L.marker([end[0],end[1]],{icon: custIcon}).addTo(map);
	    
	} else {
		this.drawMessage({ "permission": "false", message: "Connection data does not have valid data"}.message);
	}
};*/

/**@description updated drawLeafletMapTrail for color ranges and tooltip BDD-926**/
WorldMapChart.prototype.drawLeafletMapTrail = function() {
    var temp = this;
    var mapOptions = $.extend(true, {}, this.m_mapoptions);
    mapOptions.zoom = 1;
    mapOptions.attributionControl = this.m_attributioncontrol;
    mapOptions.scrollWheelZoom = (mapOptions.wheelzoom === undefined) ? true : mapOptions.wheelzoom;
    var map = L.map("svgMapDiv" + temp.m_objectid, mapOptions);
    var coordinates = this.getGeoTrailData();
    var defaultColor = convertColorToHex(this.m_defaultfillcolor);
    var geojsonData = this.getTrailGeoJsonData(); //this.getGeoJsonData();
    var geojson1 = JSON.parse(geojsonData);
    var c1 = this.getGeoTripData();
    var features = geojson1.features;
    for (var i = 0; i < features.length; i++) {
        features[i]["properties"]["color"] = this.m_leafLetColorMap[i];
        features[i]["properties"]["color"] = (features[i]["properties"]["color"] == undefined) ? defaultColor : features[i]["properties"]["color"];
        }
    if (coordinates.length > 0) {
        var lastCoordinate = [coordinates[coordinates.length - 1][0], coordinates[coordinates.length - 1][1]];
        map.flyTo(lastCoordinate, this.m_mapoptions.zoom, {
            duration: this.m_mapoptions.duration
        });
        this.addLeafletLink(L, map);
        /*var noel = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": coordinates
            }
        };*/
        /*DAS-301*/
        var dashArray=[];
        var lineWidth=1;
        if (this.m_linetype === "dot")
            dashArray = [lineWidth * 1, (lineWidth * 3) + 1, 0, 0];
        else if (this.m_linetype === "dash") {
            lineWidth = 5;
            dashArray = [(lineWidth * 2) + 1, (lineWidth * 2) + 1, 0, 0];
        }
        var traillayer = L.geoJson(geojson1, {
            style: function(feature) {
                return {
                    "color": feature.properties.color,
                    "dashArray": dashArray,
                    "weight": temp.m_linethickness*1,
                    "opacity": 1
                }
            },
            onEachFeature: function(feature, layer) {
                if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
                    var popup = "";
                    var properties = feature.properties;
                    if (temp.m_customtextboxfortooltip.dataTipType == "Default") {
                        popup = "<html><body><table>";
                        $.each(temp.m_markerDisplayNames, function(index, val) {
                            if (properties[val] == undefined) {
                                popup += "<tr><td>No data found.</td></tr>";
                                return null;
                            }
                            popup += "<tr><td style = 'font-size:"+ temp.m_tooltipfontsize + "px' >" +
	                        val +
	                        ": </td><td style = 'font-size:"+ temp.m_tooltipfontsize + "px' >" +
                                properties[val] +
                                "</td></tr>";
                        });
                        popup += "</table></body></html>";
                    } else {
                        var tooltipData = {
                            "data": properties.rownumber * 1,
                            "type": "LeafletMap"
                        };
                        popup = temp.m_tooltip.drawMapToolTip(tooltipData);
                    }
                    layer.bindPopup(popup);
                }
                layer.options.rowId = feature.properties.rownumber;
                /*DAS-263*/
                var timer = null;
		        var delay = 500;
                if (detectDevice.mobile() || detectDevice.tablet()) {
                	if(detectDevice.android()) {
	        			layer.on({
				        	dblclick: whenClicked
				        });
	        		}else{
                    layer.on('click', function(e) {
                    	var test1 = layer;
                    	test1.closePopup();
	        		    if (timer === null) {
	        		        timer = setTimeout(function() {
	        		        timer = null;
	        		        test1.openPopup();
                        if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
                            var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
                            if (temp.m_customtooltipwidth !== "auto") {
                                $(".leaflet-popup-content").css({
                                    "width": temp.m_customtooltipwidth + "px"
                                });
                            }
                            $(".leaflet-popup-content-wrapper").css({
                                "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
                                "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
                                "color": temp.m_tooltipfontcolor
                            });
                            $(".leaflet-popup-tip").css({
                                "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
                                "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
                            });
                            /** Added for control tooltip font size */
                            $(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
                        }
	        		        }, delay);

	        		    } else {
	        		        clearTimeout(timer);
	        		        timer=null;
	        		        whenClicked(e);
	        		    }
                    });
	        		}
                } else {
                    layer.on('mouseover', function(e) {
                        this.openPopup();
                        if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
                            var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
                            if (temp.m_customtooltipwidth !== "auto") {
                                $(".leaflet-popup-content").css({
                                    "width": temp.m_customtooltipwidth + "px"
                                });
                            }
                            $(".leaflet-popup-content-wrapper").css({
                                "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
                                "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
                                "color": temp.m_tooltipfontcolor
                            });
                            $(".leaflet-popup-tip").css({
                                "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
                                "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
                            });
                            /** Added for control tooltip font size */
                            $(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
                        }
                    });
                    layer.on('mouseout', function(e) {
                        this.closePopup();
                    });
                    layer.on('click', function(e) {
                        whenClicked(e);
                    });
                }
                /*
                if (detectDevice.mobile() || detectDevice.tablet()) {
                    layer.on({
                        dblclick: whenClicked
                    });
                } else {
                    layer.on({
                        click: whenClicked
                    });
                }
                */
            }
        });
        function whenClicked(e) {
            var index = e.target.options.rowId;
            var drillObj = temp.m_leafLetDataMap[index];
            var tempMap = {};
            for (var key in drillObj) {
                var d = drillObj[key];
                if (IsBoolean(temp.m_seriesVisibleArr[key]))
                    tempMap[d.seriesName] = d.displayData;
            }
            temp.m_fieldvalue = tempMap;
            if (index > -1) {
                var title = temp.m_categoryData[0][index];
                temp.m_fieldcolor = geojson1.features[index].properties.color;
                temp.getDataPointAndUpdateGlobalVariable(temp.getOrigionalTitle(title), index);
            }
            /**Added for tooltip property*/
            if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
                var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
                if (temp.m_customtooltipwidth !== "auto") {
                    $(".leaflet-popup-content").css({
                        "width": temp.m_customtooltipwidth + "px"
                    });
                }
                $(".leaflet-popup-content-wrapper").css({
                    "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
                    "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
                    "color": temp.m_tooltipfontcolor
                });
                $(".leaflet-popup-tip").css({
                    "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
                    "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
                });
                /** Added for control tooltip font size */
                $(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
            }
        }
        map.addLayer(traillayer);

        var polyline = L.polyline(c1, {color: this.m_markericon.color}); //.addTo(map);
        // zoom the map to the polyline
        map.fitBounds(polyline.getBounds());

        /**Added below one for testing sample with other data
		var layer = L.geoJSON(features, {
			style: function (feature) {
  				return {
   				 "color": feature.properties.color,
   				 "opacity": 1,
  				}}
			}).addTo(map);**/
        //color: this.m_markericon.color
        //Number of points in linestring
        var numPts = coordinates.length;
        var beg = coordinates[0];
        var end = coordinates[numPts - 1];

        /** https://leafletjs.com/reference-1.0.0.html#icon **/
        var custIcon;
        /** if bd- font icons used, it will not bring the markers images from http call **/
        if (temp.m_markericon.icon.indexOf("bd-") == 0) {
        	var icon = (temp.m_markericon.icon.includes('bd-glyphicon')) ? (temp.m_markericon.icon.replace("bd-", "")) : temp.m_markericon.icon;
            custIcon = L.divIcon({
                className: '',
                html: '<div class="' + icon + '" style="text-shadow: 1px 2px 2px #666;font-size: '+temp.m_markericon.size+'px;margin: -15px -10px 0px -10px;height: 40px;box-shadow: 0px 8px 6px -6px #666;border-radius: 15px;color:' + temp.m_markericon.color + '">'
            });
        } else {
        	custIcon = L.MakiMarkers.icon({icon: temp.m_markericon.icon, color: temp.m_markericon.color, size:temp.m_makimarkericonsize});
        	//custIcon = L.MakiMarkers.icon(temp.m_markericon);
        }
        
        L.marker([beg[1], beg[0]], {icon: custIcon}).addTo(map);
        L.marker([end[1], end[0]], {icon: custIcon}).addTo(map);
    } else {
        this.drawMessage({"permission": "false",message: "Connection data does not have valid data"}.message);
    }
};
WorldMapChart.prototype.drawLeafletMapRealtime = function() {
    var temp = this;
    var mapOptions = $.extend(true, {}, this.m_mapoptions);
    mapOptions.zoom = 1;
    mapOptions.attributionControl = this.m_attributioncontrol;

    var linecoordinates = this.getGeoTrailData();
    var coordinates = this.getGeoTripData();
    if (linecoordinates.length > 0) {
        var lastCoordinate = [linecoordinates[linecoordinates.length - 1][1], linecoordinates[linecoordinates.length - 1][0]];
        var map = L.map("svgMapDiv" + temp.m_objectid, mapOptions);
        this.m_map = map;
        map.flyTo(lastCoordinate, this.m_mapoptions.zoom, {
            duration: this.m_mapoptions.duration
        });

        var fx = new L.PosAnimation();
        this.m_pos = fx;
        //fx.run(el, [300, 500], 0.5)

        /*var noel = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": coordinates
            }
        };*/
        this.addLeafletLink(L, map);
        var polyline = L.polyline(linecoordinates, {
            color: this.m_pathcolor
        }); //.addTo(map);
        // zoom the map to the polyline
        map.fitBounds(polyline.getBounds());

        var count = 1,
        beg = coordinates[0];
        //var end = coordinates[numPts-1];

        /** https://leafletjs.com/reference-1.0.0.html#icon **/
        var custIcon;
        /** if bd- font icons used, it will not bring the markers images from http call **/
        if (temp.m_realtimeMarker.indexOf("bd-") == 0) {
        	custIcon = L.divIcon({
				className: '',
				html: '<div class="'+temp.m_realtimeMarker+'" style="text-shadow: 1px 2px 2px #666;font-size: 30px;margin: -15px -10px 0px -10px;height: 40px;box-shadow: 0px 8px 6px -6px #666;border-radius: 15px;color:'+temp.m_markericon.color+'">' 
			});
        } else {
            //custIcon = L.MakiMarkers.icon(temp.m_markericon);
            custIcon = L.divIcon({
                className: '',
                html: temp.m_realtimeMarker
            });
        }

        this.m_marker = L.marker([beg[0], beg[1]], {
            icon: custIcon
        }).addTo(map);
        //L.marker([end[0],end[1]],{icon: custIcon}).addTo(map);

    } else {
        this.drawMessage({
            "permission": "false",
            message: "Connection data does not have valid data"
        }.message);
    }
};

WorldMapChart.prototype.drawCircle = function() {
    var temp = this;
    var mapOptions = $.extend(true, {}, this.m_mapoptions);
    mapOptions.zoom = this.m_defaultZoom;
    mapOptions.attributionControl = this.m_attributioncontrol;

    var linecoordinates = this.getGeoTrailData();
   
    if(IsBoolean(this.m_showmarker)){ 
    	this.drawLeafletMapMarker();
    }else{
    	var map = L.map("svgMapDiv" + temp.m_objectid, mapOptions);
        this.m_map = map;
        this.addLeafletLink(L, map);
    }

    var lat = linecoordinates[this.m_circleindex][0];
    var lang = linecoordinates[this.m_circleindex][1];
    var circleRadius = this.m_circleRadius;
    var circleCenter = [lat, lang];
    var circleOptions = {
        color: this.m_circleColor,
        fillColor: this.m_circleFillcolor,
        fillOpacity: this.m_circleFillopacity,
        weight: this.m_circleWeight,
    }
    var circle = L.circle(circleCenter, circleRadius, circleOptions);
    circle.addTo(this.m_map);
    this.m_map.panTo(new L.LatLng(lat, lang));
    var popup = this.m_circleTooltip;
    circle.bindPopup(popup);
    circle.on('mouseover', function(e) {
        this.openPopup();
    });
    circle.on('mouseout', function(e) {
        this.closePopup();
    });
};

WorldMapChart.prototype.drawLeafletMapTrip = function() {
    /**Polyline will plot independent of tripevent**/
    /**Flags will be plotted based on tripevent**/
    var temp = this;
    var mapOptions = $.extend(true, {}, this.m_mapoptions);
    mapOptions.zoom = 1;
    mapOptions.attributionControl = this.m_attributioncontrol;
    
    var linecoordinates = this.getGeoTrailData();
    var coordinates = this.getGeoTripData();

    if (linecoordinates.length == 1 && IsBoolean(this.m_enableCircle)) {
        this.drawCircle();
    } else {
        if (linecoordinates.length > 0) {
            var lastCoordinate = [linecoordinates[linecoordinates.length - 1][1], linecoordinates[linecoordinates.length - 1][0]];
            var map = L.map("svgMapDiv" + temp.m_objectid, mapOptions);
            this.m_map = map;
            map.flyTo(lastCoordinate, this.m_mapoptions.zoom, {
                duration: this.m_mapoptions.duration
            });

            /*var noel = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": coordinates
                }
            };*/
            this.addLeafletLink(L, map);
            /*DAS-301*/
            var dashArray=[];
            var lineWidth=1;
            if (this.m_linetype === "dot")
                dashArray = [lineWidth * 1, (lineWidth * 3) + 1, 0, 0];
            else if (this.m_linetype === "dash") {
                lineWidth = 5;
                dashArray = [(lineWidth * 2) + 1, (lineWidth * 2) + 1, 0, 0];
            }
           
            if (IsBoolean(this.m_drawTripPath)) {
                var polyline = L.polyline(linecoordinates, {
                    color: this.m_pathcolor,
                    dashArray: dashArray,
                    weight: this.m_linethickness*1
                }).addTo(map);
                // zoom the map to the polyline
                map.fitBounds(polyline.getBounds());
            }else{
            	var polyline = L.polyline(linecoordinates, {
                    color: this.m_pathcolor
                });//.addTo(map);
                // zoom the map to the polyline
                map.fitBounds(polyline.getBounds());
            }
            //L.geoJSON(noel, {color: this.m_pathcolor}).addTo(map);

            //var geojsonData = this.getGeoJsonTripData();
            //var geojson1 = JSON.parse(geojsonData);
            var gjsonData = this.getGeoJsonData();
            var gjson1 = JSON.parse(gjsonData);
            var geojsonData = this.getTrailGeoJsonData(); //this.getGeoJsonData();
            var geojson1 = JSON.parse(geojsonData);
            //var features = geojson1.features;
            var features = geojson1.features;
            if (geojson1.features.length !== 0) {
                var property = this.m_markerDisplayNames[0];
                var defaultColor = convertColorToHex(this.m_defaultfillcolor);
                var geometryType = this.m_geometrytype;
                var mapOptions = $.extend(true, {}, this.m_mapoptions);
                mapOptions.zoom = 1;
                mapOptions.scrollWheelZoom = (mapOptions.wheelzoom === undefined) ? true : mapOptions.wheelzoom;
                mapOptions.attributionControl = this.m_attributioncontrol;
                /*if (IsBoolean(this.m_pathhighlighter)) {
                    for (var i = 0; i < features.length; i++) {
                        features[i]["properties"]["color"] = this.m_leafLetColorMap[i]; //this.m_leafLetColorMapTrip[i];
                        features[i]["properties"]["color"] = (features[i]["properties"]["color"] == undefined) ? defaultColor : features[i]["properties"]["color"];
                    }
                }*/
                for (var i = 0; i < gjson1.features.length; i++) {
                    gjson1.features[i]["properties"]["color"] = this.m_leafLetColorMap[i]; //this.m_leafLetColorMapTrip[i];
                    //gjson1.features[i]["properties"]["color"] = (gjson1.features[i]["properties"]["color"] == undefined) ? defaultColor : gjson1.features[i]["properties"]["color"];
                    /*DAS-292*/
                    gjson1.features[i]["properties"]["icon"] = this.m_leafLetIconMap[i];
                    //gjson1.features[i]["properties"]["icon"] = (gjson1.features[i]["properties"]["icon"] == undefined) ? temp.m_markericon.icon : gjson1.features[i]["properties"]["icon"];
                }
                var count = 1,
                    end = (features.length * 1) + 1;
                /*if (IsBoolean(this.m_pathhighlighter)) {
                    var geoJsonLayer = L.geoJson(geojson1, {
                        style: function(feature) {
                            return {
                                "color": feature.properties.color,
                                "opacity": 1,
                            }
                        },
                        onEachFeature: function(feature, layer) {
                            if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
                                var popup = "";
                                var properties = feature.properties;
                                if (temp.m_customtextboxfortooltip.dataTipType == "Default") {
                                    popup = "<html><body><table>";
                                    $.each(temp.m_markerDisplayNames, function(index, val) {
                                        if (properties[val] == undefined) {
                                            popup += "<tr><td>No data found.</td></tr>";
                                            return null;
                                        }
                                        popup += "<tr><td style = 'font-size:" + temp.m_tooltipfontsize + "px' >" +
                                            val +
                                            ": </td><td style = 'font-size:" + temp.m_tooltipfontsize + "px' >" +
                                            properties[val] +
                                            "</td></tr>";
                                    });
                                    popup += "</table></body></html>";
                                } else {
                                    var tooltipData = {
                                        "data": properties.rownumber * 1,
                                        "type": "LeafletMap"
                                    };
                                    popup = temp.m_tooltip.drawMapToolTip(tooltipData);
                                }
                                layer.bindPopup(popup);
                            }
                            layer.options.rowId = feature.properties.rownumber;
                            if (detectDevice.mobile() || detectDevice.tablet()) {
                                layer.on('click', function(e) {
                                    this.openPopup();
                                    if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
                                        var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
                                        if (temp.m_customtooltipwidth !== "auto") {
                                            $(".leaflet-popup-content").css({
                                                "width": temp.m_customtooltipwidth + "px"
                                            });
                                        }
                                        $(".leaflet-popup-content-wrapper").css({
                                            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
                                            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
                                            "color": temp.m_tooltipfontcolor
                                        });
                                        $(".leaflet-popup-tip").css({
                                            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
                                            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
                                        });
                                        *//** Added for control tooltip font size *//*
                                        $(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
                                    }
                                });
                            } else {
                                layer.on('mouseover', function(e) {
                                    this.openPopup();
                                    if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
                                        var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
                                        if (temp.m_customtooltipwidth !== "auto") {
                                            $(".leaflet-popup-content").css({
                                                "width": temp.m_customtooltipwidth + "px"
                                            });
                                        }
                                        $(".leaflet-popup-content-wrapper").css({
                                            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
                                            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
                                            "color": temp.m_tooltipfontcolor
                                        });
                                        $(".leaflet-popup-tip").css({
                                            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
                                            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
                                        });
                                        *//** Added for control tooltip font size *//*
                                        $(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
                                    }
                                });
                                layer.on('mouseout', function(e) {
                                    this.closePopup();
                                });
                            }
                            if (detectDevice.mobile() || detectDevice.tablet()) {
                                layer.on({
                                    dblclick: whenClicked
                                });
                            } else {
                                layer.on({
                                    click: whenClicked
                                });
                            }
                        },
                        pointToLayer: function(feature, latlng) {

                            var custIcon;
                            var color;
                            if (feature.properties.color != undefined) {
                                color = feature.properties.color;
                            } else {
                                color = defaultColor;
                            }
                            //temp.m_markericon.color = color;
                            *//** if bd- font icons used, it will not bring the markers images from http call **//*
                            if (temp.m_markericon.icon.indexOf("bd-") == 0 && (count == 1 || count == end)) {
                                temp.m_startcolor = (count == 1) ? temp.m_startcolor : temp.m_endcolor;
                                custIcon = L.divIcon({
                                    className: '',
                                    html: '<div class="' + temp.m_markericon.icon + '" style="text-shadow: 1px 2px 2px #666;font-size: 30px;margin: -15px -10px 0px -10px;height: 40px;box-shadow: 0px 8px 6px -6px #666;border-radius: 15px;color:' + temp.m_startcolor + '">'
                                });
                                count++;
                                return L.marker(latlng, {
                                    icon: custIcon
                                });
                                //return L.marker(latlng, {icon: custIcon});
                            } else if (temp.m_markericon.icon.indexOf("bd-") == 0 && IsBoolean(feature.geometry.tripevent)) {
                                custIcon = L.divIcon({
                                    className: '',
                                    html: '<div class="' + temp.m_pathicon.icon + '" style="text-shadow: 1px 2px 2px #666;font-size: ' + temp.m_tripiconsize + 'px;margin: 0px 0px 0px 0px;height: 15px;box-shadow: 0px 0px 0px 0px #666;border-radius: 5px;color:' + color + '">' //temp.m_pathicon.
                                });
                                count++;
                                return L.marker(latlng, {
                                    icon: custIcon
                                });
                                //return L.marker(latlng, {icon: custIcon});
                            } else {
                                count++;
                                //custIcon = L.MakiMarkers.icon(temp.m_markericon);
                            }
                            //count++;
                            //return L.marker(latlng, {icon: custIcon});
                        }
                    });
                }*/
                var geoJsonLayer1 = L.geoJson(gjson1, {

                    onEachFeature: function(feature, layer) {
                        if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
                            var popup = "";
                            var properties = feature.properties;
                            if (temp.m_customtextboxfortooltip.dataTipType == "Default") {
                                popup = "<html><body><table>";
                                $.each(temp.m_markerDisplayNames, function(index, val) {
                                    if (properties[val] == undefined) {
                                        popup += "<tr><td>No data found.</td></tr>";
                                        return null;
                                    }
                                    popup += "<tr><td style = 'font-size:" + temp.m_tooltipfontsize + "px' >" +
                                        val +
                                        ": </td><td style = 'font-size:" + temp.m_tooltipfontsize + "px' >" +
                                        properties[val] +
                                        "</td></tr>";
                                });
                                popup += "</table></body></html>";
                            } else {
                                var tooltipData = {
                                    "data": properties.rownumber * 1,
                                    "type": "LeafletMap"
                                };
                                popup = temp.m_tooltip.drawMapToolTip(tooltipData);
                            }
                            layer.bindPopup(popup);
                        }
                        layer.options.rowId = feature.properties.rownumber;
                        /*DAS-263*/
                        var timer = null;
        		        var delay = 500;
                        if (detectDevice.mobile() || detectDevice.tablet()) {
                        	if(detectDevice.android()) {
        	        			layer.on({
        				        	dblclick: whenClicked
        				        });
        	        		}else{
                            layer.on('click', function(e) {
                            	var test1 = layer;
                            	test1.closePopup();
        	        		    if (timer === null) {
        	        		        timer = setTimeout(function() {
        	        		        timer = null;
        	        		        test1.openPopup();
                                if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
                                    var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
                                    if (temp.m_customtooltipwidth !== "auto") {
                                        $(".leaflet-popup-content").css({
                                            "width": temp.m_customtooltipwidth + "px"
                                        });
                                    }
                                    $(".leaflet-popup-content-wrapper").css({
                                        "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
                                        "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
                                        "color": temp.m_tooltipfontcolor
                                    });
                                    $(".leaflet-popup-tip").css({
                                        "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
                                        "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
                                    });
                                    /** Added for control tooltip font size */
                                    //$(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
                                }
        	        		    }, delay);

        	        		    } else {
        	        		        clearTimeout(timer);
        	        		        timer = null;
        	        		        whenClicked(e);
        	        		    }
                            });
        	        		}
                        } else {
                            layer.on('mouseover', function(e) {
                                this.openPopup();
                                if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
                                    var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
                                    if (temp.m_customtooltipwidth !== "auto") {
                                        $(".leaflet-popup-content").css({
                                            "width": temp.m_customtooltipwidth + "px"
                                        });
                                    }
                                    $(".leaflet-popup-content-wrapper").css({
                                        "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
                                        "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
                                        "color": temp.m_tooltipfontcolor
                                    });
                                    $(".leaflet-popup-tip").css({
                                        "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
                                        "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
                                    });
                                    /** Added for control tooltip font size */
                                    //$(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
                                }
                            });
                            layer.on('mouseout', function(e) {
                                this.closePopup();
                            });
                            layer.on('click', function(e) {
                                whenClicked(e);
                            });
                        }
                        /*
                        if (detectDevice.mobile() || detectDevice.tablet()) {
                            layer.on({
                                dblclick: whenClicked
                            });
                        } else {
                            layer.on({
                                click: whenClicked
                            });
                        }
                        */
                    },
                    pointToLayer: function(feature, latlng) {

                        var custIcon;
                        var color, icon;
                        if (feature.properties.color != undefined) {
                            color = feature.properties.color;
                        } else {
                            color = defaultColor;
                        }
                        if(temp.m_svgicons){
                        	if (temp.m_markericon.icon.indexOf("bd-") == 0 && (count == 1 || count == end)) {
                                temp.m_flag = (count == 1) ? temp.m_starticon : temp.m_endicon;
                                custIcon = L.divIcon({
                                    className: '',
                                    html: temp.m_flag
                                });
                                count++;
                                return L.marker(latlng, {
                                    icon: custIcon
                                });
                                //return L.marker(latlng, {icon: custIcon});
                            } else if (temp.m_markericon.icon.indexOf("bd-") == 0) { // && IsBoolean( feature.geometry.tripevent)
                                custIcon = L.divIcon({
                                    className: '',
                                    html: '<svg width="4px" height="4px" viewBox="0 0 16 16" class="bi bi-circle-fill" fill=' + color + ' xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8"/></svg>'
                                });
                                /*var achenSvgString = temp.m_pathicon.icon;
                                var myIconUrl = encodeURI("data:image/svg+xml," + achenSvgString).replace('#','%23');
                                custIcon=L.icon({
                                iconUrl: myIconUrl
                                });*/
                                count++;
                                return L.marker(latlng, {
                                    icon: custIcon
                                });
                            } else {
                                /*custIcon = L.divIcon({
                                	className: '',
                                	html:  '<svg width="4px" height="4px" viewBox="0 0 16 16" class="bi bi-circle-fill" fill="#00a0f0" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8"/></svg>'
                                });*/
                                count++;
                                //return L.marker(latlng, {icon: custIcon});
                                //custIcon = L.MakiMarkers.icon(temp.m_markericon);
                            }
                        }else{
                        	/*DAS-323 @check for start end amrker icons for markericons*/
                        	if (count == 1 || count == end) {
                        	    var iconcolor = (count == 1) ? temp.m_startcolor : temp.m_endcolor;
                        	    if (temp.m_markericon.icon.indexOf("bd-") == 0) {
                        	    	icon = (temp.m_markericon.icon.includes('bd-glyphicon')) ? (temp.m_markericon.icon.replace("bd-", "")) : temp.m_markericon.icon;
                        	        custIcon = L.divIcon({
                        	            className: '',
                        	            html: '<div class="' + icon + '" style="text-shadow: 1px 2px 2px #666;font-size: '+temp.m_markericon.size+'px;margin: -15px -10px 0px -10px;height: 40px;box-shadow: 0px 8px 6px -6px #666;border-radius: 15px;color:' + iconcolor + '">'
                        	        });
                        	    } else {
                        	        temp.m_markericon.color=iconcolor;
                        	        temp.m_markericon.size=temp.m_makimarkericonsize;
                        	    	custIcon = L.MakiMarkers.icon(temp.m_markericon);
                        	    }
                        	    count++;
                        	    return L.marker(latlng, {
                        	        icon: custIcon
                        	    });
                        	} else {
                        		/*DAS-292 glyph maki icons support for path icons */
                                if (feature.properties.color != undefined) {
                                    color = feature.properties.color;
                                } else {
                                    color = temp.m_pathicon.color;
                                }
                                
                        		if (feature.properties.icon != undefined) {
                					//temp.m_markericon.icon=feature.properties.icon;
                					icon = feature.properties.icon;
                				} else {
                					icon = temp.m_pathicon.icon;
                				}
                			
                        	    /*check for intermediate icons for pathicons*/
                        	    if (icon.indexOf("bd-") == 0) {
                        	    	icon = (icon.includes('bd-glyphicon')) ? (icon.replace("bd-", "")) : icon;
                        	        custIcon = L.divIcon({
                        	            className: '',
                        	            html: '<div class="' + icon + '" style="text-shadow: 1px 2px 2px #666;font-size: ' + temp.m_tripiconsize + 'px;margin: 0px 0px 0px 0px;height: 15px;box-shadow: 0px 0px 0px 0px #666;border-radius: 5px;color:' + color + '">'
                        	        });
                        	    } else {
                        	    	custIcon = L.MakiMarkers.icon({icon: icon, color: color, size: temp.m_makimarkericonsize});
                        	    	//custIcon = L.MakiMarkers.icon(temp.m_pathicon);
                        	    }
                        	    count++;
                        	    return L.marker(latlng, {
                        	        icon: custIcon
                        	    });
                        	}
                        	//temp.m_markericon.color = color;
                            /** if bd- font icons used, it will not bring the markers images from http call **/
                        	//if (temp.m_markericon.icon.indexOf("bd-") == 0 && (count == 1 || count == end)) {
                                //var iconcolor = (count == 1) ? temp.m_startcolor : temp.m_endcolor;
                                //custIcon = L.divIcon({
                                    //className: '',
                                  //  html: '<div class="' + temp.m_markericon.icon + '" style="text-shadow: 1px 2px 2px #666;font-size: 30px;margin: -15px -10px 0px -10px;height: 40px;box-shadow: 0px 8px 6px -6px #666;border-radius: 15px;color:' + iconcolor + '">'
                                //});
                                //count++;
                                //return L.marker(latlng, {
                                //    icon: custIcon
                              //  });
                                //return L.marker(latlng, {icon: custIcon}); 
                            //} else if (temp.m_markericon.icon.indexOf("bd-") == 0) {// && IsBoolean(feature.geometry.tripevent)
                                //custIcon = L.divIcon({
                                   // className: '',
                                 //   html: '<div class="' + temp.m_pathicon.icon + '" style="text-shadow: 1px 2px 2px #666;font-size: ' + temp.m_tripiconsize + 'px;margin: 0px 0px 0px 0px;height: 15px;box-shadow: 0px 0px 0px 0px #666;border-radius: 5px;color:' + color + '">' //temp.m_pathicon.
                                //});
                                //count++;
                                //return L.marker(latlng, {
                                 //   icon: custIcon
                               // });
                                //return L.marker(latlng, {icon: custIcon});
                            //} else {
                                //count++;
                                //custIcon = L.MakiMarkers.icon(temp.m_markericon);/*DAS-323*/
                                //return L.marker(latlng, {icon: custIcon});
                            //}
                        	
                        }
                        
                        //count++;
                        //return L.marker(latlng, {icon: custIcon});
                    }
                });

                function whenClicked(e) {
                    var index = e.target.options.rowId;
                    var drillObj = temp.m_leafLetDataMap[index];
                    var tempMap = {};
                    for (var key in drillObj) {
                        var d = drillObj[key];
                        if (IsBoolean(temp.m_seriesVisibleArr[key]))
                            tempMap[d.seriesName] = d.displayData;
                    }
                    temp.m_fieldvalue = tempMap;
                    if (index > -1) {
                        var title = temp.m_categoryData[0][index];
                        temp.m_fieldcolor = gjson1.features[index].properties.color;
                        temp.getDataPointAndUpdateGlobalVariable(temp.getOrigionalTitle(title), index);
                    }
                    /**Added for tooltip property*/
                    if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
                        var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
                        if (temp.m_customtooltipwidth !== "auto") {
                            $(".leaflet-popup-content").css({
                                "width": temp.m_customtooltipwidth + "px"
                            });
                        }
                        $(".leaflet-popup-content-wrapper").css({
                            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
                            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
                            "color": temp.m_tooltipfontcolor
                        });
                        $(".leaflet-popup-tip").css({
                            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
                            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
                        });
                        /** Added for control tooltip font size */
                        //$(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
                    }
                }
                if (IsBoolean(this.m_pathhighlighter)) {
                    map.addLayer(geoJsonLayer);
                    map.addLayer(geoJsonLayer1);
                    var polyline = L.polyline(linecoordinates, {
                        color: this.m_markericon.color
                    }); //.addTo(map);
                    // zoom the map to the polyline
                    map.fitBounds(polyline.getBounds());
                } else {
                    map.addLayer(geoJsonLayer1);
                    map.fitBounds(polyline.getBounds());
                }
            }
        } else {
            this.drawMessage({
                "permission": "false",
                message: "Connection data does not have valid data"
            }.message);
        }
    }
};

/**  @description will draw leaflet marker map**/
WorldMapChart.prototype.drawLeafletMap_Old = function () {
	var temp = this;
	var geojsonData;
	if(this.m_geometrytype == "marker" || this.m_geometrytype == "clustered") {
		geojsonData = this.getGeoJsonData();
	} else {
		geojsonData = this.shapeJsonData;
	}
	
	var geojson1 = JSON.parse(geojsonData);
	var features = geojson1.features;
	
	if (this.m_geometrytype === "line") {
		var filteredLineFeatures = [];
		var count = 0;
	    for (var i = 0; i < features.length; i++) {
	    	if(this.m_origionalDataMap[features[i][this.m_categoryNames[0]]]) {
		        for (var p = 0; p < this.m_markerNames.length; p++) {
		            features[i].properties[this.m_markerDisplayNames[p]] = this.getFormatterForToolTip(this.m_markerNames[p], this.m_markerdata[p][count]);
		        }
		        features[i].properties.rownumber = count++;
		        filteredLineFeatures.push(features[i]);
	    	}
	    }
	    features = filteredLineFeatures;
		geojson1.features = filteredLineFeatures;
	} else if (this.m_geometrytype === "polygon") {
	    var count = 0;
	    var filteredFeaturesArray = [];
	    for (var i = 0; i < features.length; i++) {
	        if (this.m_origionalDataMap[features[i].id]) {
	            for (var j = 0; j < this.m_categoryNames.length; j++) {
	                features[i].properties[this.m_categoryNames[j]] = features[i].id;
	            }
	            for (var k = 0; k < this.m_seriesNames.length; k++) {
	                var index = this.m_categoryData[0].indexOf(features[i].id);
	                features[i].properties[this.m_seriesNames[k]] = this.getFormatterForToolTip(this.m_markerNames[k], this.m_markerdata[k][index]);
	            }
	            features[i].properties.rownumber = count++;
	            filteredFeaturesArray.push(features[i]);
	        }
	    }
	    features = filteredFeaturesArray;
		geojson1.features = filteredFeaturesArray;
	}else{
		// Do nothing
	}
	if(geojson1.features.length !== 0) {
		var property = this.m_markerDisplayNames[0];
		var defaultColor = convertColorToHex(this.m_defaultfillcolor);
		var geometryType = this.m_geometrytype;
		var mapOptions =  $.extend(true,{},this.m_mapoptions);
		mapOptions.zoom = 1;
		mapOptions.attributionControl = this.m_attributioncontrol;
		for(var i = 0; i < features.length; i++) {
			if(this.m_geometrytype !== "polygon") {
				features[i]["properties"]["color"] = this.m_leafLetColorMap[i];
				features[i]["properties"]["color"] = (features[i]["properties"]["color"] == undefined) ? defaultColor : features[i]["properties"]["color"];
			} else {
				var index = this.m_categoryData[0].indexOf(features[i].id);
				features[i]["properties"]["color"] = this.m_leafLetColorMap[index];
				features[i]["properties"]["color"] = (features[i]["properties"]["color"] == undefined) ? defaultColor : features[i]["properties"]["color"];
			}
		}
		var map = L.map("svgMapDiv" + temp.m_objectid, mapOptions);
		if(IsBoolean(this.m_mapoptions.enableanimation)){
			map.flyTo(this.m_mapoptions.center,this.m_mapoptions.zoom,{duration: this.m_mapoptions.duration});
		}
		this.addLeafletLink(L, map);
		if(this.m_geometrytype === "clustered") {
			var markers = L.markerClusterGroup();
		}
		var geoJsonLayer = L.geoJson(geojson1, {
			style: function (feature) {
		    	var value = '';
		    	var color;
				if (feature.properties.color != undefined) {
					color = feature.properties.color;
				} else {
					color = defaultColor;
				}
				if(geometryType == "marker") {
					value = {
					};
				} else if(geometryType == "polygon") {
						value = {
							fillColor: color,
						    color: color,
						    weight: 1,
						    opacity: 1,
						    fillOpacity: 0.8
				    	};
				} else if(geometryType == "line") {
						value = {
						    color: color,
						    weight: 2,
						    opacity: 1,
				    	};
					}
				return value;
		    },
		    onEachFeature: function(feature, layer) {
		        if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
		            var popup = "";
		            var properties = feature.properties;
		            if (temp.m_customtextboxfortooltip.dataTipType == "Default") {
		                popup = "<html><body><table>";
		                $.each(temp.m_markerDisplayNames, function(index, val) {
		                    if (properties[val] == undefined) {
		                        popup += "<tr><td>No data found.</td></tr>";
		                        return null;
		                    }
		                    popup += "<tr><td style = 'font-size:"+ temp.m_tooltipfontsize + "px' >" +
	                        val +
	                        ": </td><td style = 'font-size:"+ temp.m_tooltipfontsize + "px' >" +
		                        properties[val] +
		                        "</td></tr>";
		                });
		                popup += "</table></body></html>";
		            } else {
		            	var tooltipData = {"data" : properties.rownumber * 1, "type" : "LeafletMap"};
		                popup = temp.m_tooltip.drawMapToolTip(tooltipData);
		            }
		            layer.bindPopup(popup);
		        }
		        layer.options.rowId = feature.properties.rownumber;
		        if(temp.m_geometrytype !== "polygon" && temp.m_geometrytype !== "line") {
		        	if(detectDevice.mobile() || detectDevice.tablet()) {
		        		 layer.on('click', function (e) {
				            	this.openPopup();
				            	if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
							        var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
							        if(temp.m_customtooltipwidth !== "auto"){
							        	$(".leaflet-popup-content").css({"width": temp.m_customtooltipwidth + "px"});
							        }
							        $(".leaflet-popup-content-wrapper").css({
							            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
							            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
							            "color": temp.m_tooltipfontcolor
							        });
							        $(".leaflet-popup-tip").css({
							            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
							            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
							        });
							        /** Added for control tooltip font size */
							        //$(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
							    }
				      		});
		        	} else {
				        layer.on('mouseover', function (e) {
			            	this.openPopup();
			            	if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
						        var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
						        if(temp.m_customtooltipwidth !== "auto"){
						        	$(".leaflet-popup-content").css({"width": temp.m_customtooltipwidth + "px"});
						        }
						        $(".leaflet-popup-content-wrapper").css({
						            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
						            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
						            "color": temp.m_tooltipfontcolor
						        });
						        $(".leaflet-popup-tip").css({
						            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
						            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
						        });
						        /** Added for control tooltip font size */
						        //$(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
						    }
			      		});
				        layer.on('mouseout', function (e) {
				            this.closePopup();
				        });
		        	}
		        }
		        if(detectDevice.mobile() || detectDevice.tablet()) {
			        layer.on({
			        	dblclick: whenClicked
			        });
		        } else {
			        layer.on({
			        	click: whenClicked
			        });
		        }
		    },
		    pointToLayer: function (feature, latlng) {
		    	var custIcon;
		    	var color;
				if (feature.properties.color != undefined) {
					color = feature.properties.color;
				} else {
					color = defaultColor;
				}
				temp.m_markericon.color = color;
				/** if bd- font icons used, it will not bring the markers images from http call **/
				if(temp.m_markericon.icon.indexOf("bd-") == 0){
					var icon = (temp.m_markericon.icon.includes('bd-glyphicon')) ? (temp.m_markericon.icon.replace("bd-", "")) : temp.m_markericon.icon;
		            
					custIcon = L.divIcon({
						className: '',
						html: '<div class="'+icon+'" style="text-shadow: 1px 2px 2px #666;font-size: 30px;margin: -15px -10px 0px -10px;height: 40px;box-shadow: 0px 8px 6px -6px #666;border-radius: 15px;color:'+color+'">' 
					});
				}else{
					custIcon = L.MakiMarkers.icon(temp.m_markericon);
				}
				return L.marker(latlng, {icon: custIcon});
		    }
		});
		
		function whenClicked(e) {
			  index = e.target.options.rowId;
			  var drillObj = temp.m_leafLetDataMap[index];
			  var tempMap = {};
				for(var key in drillObj) {
					var d = drillObj[key];
					if(IsBoolean(temp.m_seriesVisibleArr[key]))
						tempMap[d.seriesName] = d.displayData;
				}
				temp.m_fieldvalue = tempMap;
				if(index > -1) {
					var title = temp.m_categoryData[0][index];
					temp.m_fieldcolor = geojson1.features[index].properties.color;
					temp.getDataPointAndUpdateGlobalVariable(temp.getOrigionalTitle(title), index);
				}
				/**Added for tooltip property*/
				 if ((temp.m_customtextboxfortooltip !== undefined) && (temp.m_customtextboxfortooltip.dataTipType !== "None")) {
				        var tooltipBGColor = convertColorToHex(temp.m_tooltipbackgroundcolor);
				        if(temp.m_customtooltipwidth !== "auto"){
				        	$(".leaflet-popup-content").css({"width": temp.m_customtooltipwidth + "px"});
				        }
				        $(".leaflet-popup-content-wrapper").css({
				            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
				            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor)),
				            "color": temp.m_tooltipfontcolor
				        });
				        $(".leaflet-popup-tip").css({
				            "background-color": hex2rgb(tooltipBGColor, temp.m_tooltipbackgroundtransparency),
				            "border": temp.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(temp.m_tooltipbordercolor))
				        });
				        /** Added for control tooltip font size */
				        //$(".leaflet-popup-content td").css("font-size", temp.m_tooltipfontsize + "px");
				    }
			}
		if(this.m_geometrytype !== "clustered") {
			map.addLayer(geoJsonLayer);
		} else {
			markers.addLayer(geoJsonLayer);
			map.addLayer(markers);
		}
	} else {
		this.drawMessage({ "permission": "false", message: "Connection data does not match with shape file data"}.message);
	}
};

WorldMapChart.prototype.setShapeData = function () {
	var temp = this;
	// service intializaton for getting all shape files 
	var url = req_url.geospatial.getAllGeoShapeDatas;
	var reqData = {};
	reqData.geometryType = this.m_geometrytype;
	
	var
	requestSuccessFn = function(respData, success) {
		respData = getDecryptedResponse(respData);
    	if (respData) {
    		var resp = respData.geoSpatialResp;
            if (resp && resp.success) {
                temp.setShapeFileDetails(resp);
            }
    	} else {
         	alertPopUpModal({ type: "error", message: "Failed to load shape files list", timeout: '3000' });
    	}
    },
    requestFailedFn = function(data_gws, success) {
     	alertPopUpModal({ type: "error", message: "Failed to load shape files", timeout: '3000' });
    };
    showLoader();
	this.webServiceCall(url, reqData, requestSuccessFn, requestFailedFn);
};

WorldMapChart.prototype.setShapeFileDetails = function(response) {
	var shapefiles = response.geoShapeDataList;
	for(var i = 0; i < shapefiles.length; i++) {
		if(this.m_shapedetails.filename == shapefiles[i].name) {
			this.selectedShapeFile = shapefiles[i];
			break;
		}
	}
	if(this.selectedShapeFile !== undefined) {
		this.getShapeFileData();
	} else {
     	alertPopUpModal({ type: "error", message: "Failed to load shape file data", timeout: '3000' });
     	this.drawMessage({ "permission": "false", message: "Failed to load shape file data" }.message);
	}
};
WorldMapChart.prototype.getShapeFileData = function() {
	var temp = this;
	// service intializaton for getting all shape selected file data
	var url = req_url.geospatial.getGeoShapeData;
	var reqData = {
			"shapeDataId": this.selectedShapeFile.id
	}
	//reqData.geometryType = this.m_geometrytype;
	
	var
	requestSuccessFn = function(respData, success) {
		respData = getDecryptedResponse(respData);
		if (respData && respData.geoSpatialResp.geoShapeData.data != "") {
    		var resp = respData.geoSpatialResp;
            if (resp && resp.success) {
             	alertPopUpModal({ type: "success", message: "Shape file has been loaded", timeout: '3000' });
                temp.setGeoJsonData(resp);
            }
    	} else {
         	alertPopUpModal({ type: "error", message: "Failed to load shape files", timeout: '3000' });
    	}
    },
    requestFailedFn = function(data_gws, success) {
     	alertPopUpModal({ type: "error", message: "Failed to load shape files", timeout: '3000' });
    };
    showLoader();
	this.webServiceCall(url, reqData, requestSuccessFn, requestFailedFn);
};
WorldMapChart.prototype.setGeoJsonData = function(response) {
	this.shapeJsonData = response.geoShapeData.data;
	this.drawLeafletMap();
};

WorldMapChart.prototype.getMapURL = function () {
	if(dGlobals.mapJSONUrl == undefined){
		if (loaderSvgSrc){
			return loaderSvgSrc;
		}else{
			var basepath = window.location.href;
			var vpath = basepath.split("views")[0] + "views";
			return vpath + "/charting/src/bizviz.charting/components/resources/map/";
		}
	}else{
		return dGlobals.mapJSONUrl;
	}
};
/** @description Drawing of Map chart fetching of same SVG file multiple times. **/
WorldMapChart.prototype.drawMap = function () {
	var temp = this;
	if(this.prevMapType !== this.m_maptype){
		var urlmap = this.getMapURL() + this.m_maptype + ".svg";
		this.prevMapType = this.m_maptype;
		$.ajax({
			url : urlmap,
			async : false,
			success : function (data) {
				var xmlText = temp.processXMLItems(data);
				temp.m_svgdata = data;
				temp.m_imgdata = xmlText;
				temp.drawSVGMap(data);
				hideLoader();
			}
		});
	}else{
		temp.drawSVGMap(temp.m_svgdata);
	}
};

/** @description This method will parse the svg element into string value. **/
WorldMapChart.prototype.processXMLItems = function (data) {
	return new XMLSerializer().serializeToString(data.getElementsByTagName("svg")[0]);
};

/** @description Will draw SVG Map chart and set properties. **/
WorldMapChart.prototype.drawSVGMap = function (dataObj) {
	var temp = this;
	var singleClickTimer = null;
	$("#svgMapDiv" + temp.m_objectid).empty();
	try {
		this.svgMapId = "svgMap" + temp.m_objectid;
		$("#" + temp.svgMapId).remove();
		var svg = document.createElementNS(NS, "svg");		
		svg.setAttribute("id", this.svgMapId);
		svg.setAttribute("class", "svg_chart_container");
		$("#svgMapDiv" + temp.m_objectid).append(svg);
		var draw = SVG(temp.svgMapId);
		/**DAS-81 set width and height of svg export issue */
		svg.setAttribute("width", this.m_width);
		svg.setAttribute("height", this.m_height);
		//Javascript method is not working in IE
		var data = $(dataObj).find("svg").children();
//		var data = data.getElementsByTagName("svg")[0].children;
		for (var i = 0; i < data.length; i++) {
			var nodename = data[i].nodeName;
			if (nodename == "g") {
				var cls = $(data[i]).attr("class");
				cls = cls || "";
				if (cls.search("total-area") > -1) {
					data[i].setAttribute("id", "gr-" + this.m_objectid);
				}
			}
			var str = new XMLSerializer().serializeToString(data[i]);
			draw.svg(str);
		}
		/**If map is invisible on loading time,then this condition is required to get the properties
		 * of map element by making it visible**/
		if(!IsBoolean(this.visibilityStatus)){
			this.visibilityStatus = true;
			$("#draggableDiv" + temp.m_objectid).css("display", "block");
			this.svgresize();
			this.visibilityStatus = false;
			$("#draggableDiv" + temp.m_objectid).css("display", "none");
		}else{
			this.svgresize();
		}
		this.initPathProperties();
	} catch (e) {
		console.log(e);
		console.log("Invalid SVG Image")
	}
	if (!IsBoolean(this.m_designMode)) {
		svg.onclick = (function (event) {
			if ("ontouchstart" in document.documentElement) {
				onMouseMove(temp);
			} else {
				var title = $(event.target).attr("title");
				if(title !== undefined) {
					var multipleNameFlag = temp.checkMultipleName(title);
					if(IsBoolean(multipleNameFlag)) {
						var newTitles = title.split("/");
						for(var i = 0; i < newTitles.length; i++) {
							if(temp.m_dataMap[newTitles[i].toLowerCase()] != undefined) {
								title = newTitles[i];
								break;
							}
						}
					}
					var tempMap = {};
					for(var key in temp.m_dataMap[title.toLowerCase()]) {
						var d = temp.m_dataMap[title.toLowerCase()][key];
						if(IsBoolean(temp.m_seriesVisibleArr[key]))
							tempMap[d.seriesName] = d.displayData;
					}
					temp.m_fieldvalue = tempMap;
					var title1 = temp.getOrigionalTitle(title);
					var index = temp.m_categoryData[0].indexOf(title1);
					temp.m_fieldcolor = temp.m_colorMap[title.toLowerCase()];
					if(index > -1) {
						temp.getDataPointAndUpdateGlobalVariable(title1, index);
					}
				}
			}
		});
		$(svg)[0].addEventListener("touchstart", function(event) {
			if (singleClickTimer == null) {
				singleClickTimer = setTimeout(function() {
					singleClickTimer = null;
					onMouseMove(temp);
				}, temp.m_doubletaptimeout);
			} else {
				clearTimeout(singleClickTimer);
				singleClickTimer = null;
				var title = $(event.target).attr("title");
				if(title !== undefined) {
					var multipleNameFlag = temp.checkMultipleName(title);
					if(IsBoolean(multipleNameFlag)) {
						var newTitles = title.split("/");
						for(var i = 0; i < newTitles.length; i++) {
							if(temp.m_dataMap[newTitles[i].toLowerCase()] != undefined) {
								title = newTitles[i];
								break;
							}
						}
					}
					var tempMap = {};
					for(var key in temp.m_dataMap[title.toLowerCase()]) {
						var d = temp.m_dataMap[title.toLowerCase()][key];
						if(IsBoolean(temp.m_seriesVisibleArr[key]))
							tempMap[d.seriesName] = d.displayData;
					}
					temp.m_fieldvalue = tempMap;
					var title1 = temp.getOrigionalTitle(title);
					var index = temp.m_categoryData[0].indexOf(title1);
					temp.m_fieldcolor = temp.m_colorMap[title.toLowerCase()];
					if(index > -1) {
						temp.getDataPointAndUpdateGlobalVariable(title1, index);
					}
				}
			}
		}, false);
	}
};

/** @description Getter method for Origional Title. **/
WorldMapChart.prototype.getOrigionalTitle = function (titleName) {
	var temp = this;
	for(var key in temp.m_origionalDataMap) {
		if(key.toLowerCase() === titleName.toLowerCase()) {
			return key;
		}
	}
	return titleName;
};

/** @description This method will resize svg image according to the division size. **/
WorldMapChart.prototype.svgresize = function () {
	var size = $("#gr-" + this.m_objectid)[0].getBBox(),
	actualHt = (this.m_height * 1) - $("#" + this.svgContainerId).height(),
	calcSize = this.getCalculatedSize(size, actualHt, (this.m_width * 1)),
	tx = 0,
	ty = 0,
	calcWidth = calcSize.w,
	calcheight = calcSize.h;
	if (size.width > 0) {
		var scale,
		dx,
		dy;
		if (size.width > size.height) {
			scale = (calcWidth - 10) / size.width;
			dx = -size.x;
			//dy = -size.y + 0.5 * (size.width - size.height);
			dy = -size.y;
		} else {
			scale = (calcWidth - 10) / size.height;
			//dx = -size.x + 0.5 * (size.height - size.width);
			dx = -size.x;
			dy = -size.y;
		}
		tx = (this.m_width - calcWidth) / 2;
		ty = (actualHt - calcheight) / 2;
		var transform = "translate(" + tx + " " + ty + ") scale(" + scale + " ) translate(" + dx + " " + dy + ")";
		$("#gr-" + this.m_objectid).attr("transform", transform);
	}
};

/** @description Getter method for Calculate Size according to the width and height. **/
WorldMapChart.prototype.getCalculatedSize = function (box, actualHt, actualWd) {
	var aw,
	ah,
	aspectR = box.width / box.height;
	aw = actualWd;
	ah = aw / aspectR;
	if (ah <= (actualHt * 1)) {
		return {
			w : aw,
			h : ah
		};
	} else {
		ah = actualHt;
		aw = ah * aspectR;
		return {
			w : aw,
			h : ah
		};
	}
};

/** @description This method initialize path properties and set data. color according to the range then fill according to the data. **/
WorldMapChart.prototype.initPathProperties = function () {
	var temp = this;
	var paths = $("#" + temp.svgMapId + " > g > .area");
	paths.attr("style", "fill:" + hex2rgb(temp.m_defaultfillcolor, temp.m_coloropacity) + ";stroke:" + temp.m_outlinecolor + ";");

	for (var i = 0; i < this.m_categoryData[0].length; i++) {
		var updatetitle = this.toTitleCase(this.m_categoryData[0][i]);
		updatetitle = updatetitle.replace(" And "," and ");
		updatetitle = temp.checkNameHasMultipleName(updatetitle);
		var indicatorColor = (!IsBoolean(temp.m_designMode)) ? temp.m_leafLetColorMap[temp.m_categoryData[0][i]] ? temp.m_leafLetColorMap[temp.m_categoryData[0][i]] : temp.m_colorMap[(""+temp.m_categoryData[0][i]).toLowerCase()] : temp.m_colorMap[(""+temp.m_categoryData[0][i]).toLowerCase()];
		var Color = hex2rgb(indicatorColor, temp.m_coloropacity);
		$("#" + temp.svgMapId + " .area[title=" + "'" + CSS.escape(updatetitle) + "'" + "]").css("fill",  Color);
	}
	
	if (IsBoolean(!this.m_designMode)) {
		paths.on("mouseover", function (event) {
				var title = (""+$(event.target).attr("title"));
				var multipleNameFlag = temp.checkMultipleName(title);
				if(IsBoolean(multipleNameFlag)) {
					var newTitles = title.split("/");
					var tempflag = false;
					for(var i = 0; i < newTitles.length; i++){
						if(temp.m_dataMap[(""+newTitles[i]).toLowerCase()] != undefined) {
							title = newTitles[i];
							tempflag = true;
							break;
						}
					}
					if(!IsBoolean(tempflag))
						title = newTitles[0];
				}
				if (temp.m_dataMap[title.toLowerCase()] != undefined) {
					var dataValues = temp.getSeriesValuesForToolTip(temp.m_dataMap[title.toLowerCase()]);
					var left = (((event.pageX) ? event.pageX : event.clientX)*1 + 10);
					var top = (((event.pageY) ? event.pageY : event.clientY)*1 + 10);
					var color = (dataValues == "") ? temp.m_rollovercolor : temp.m_colorMap[title.toLowerCase()];
					var tooltipObj = {};
					if (temp.m_customtextboxfortooltip.dataTipType !== "None") {
					    if (!isNaN(dataValues) && (dataValues % 1 != 0) && (temp.m_tooltipprecision !== "default")) {
					        dataValues = dataValues.toFixed(this.m_tooltipprecision);
					    }
					    if(temp.m_customtextboxfortooltip.dataTipType == "Default"){
					    	tooltipObj = {cat: title,data: dataValues,"left" : left,"top" : top,"color" : hex2rgb(temp.m_leafLetColorMap[title])};
					    }else{
					    	tooltipObj = {"data" : temp.m_customtooltipmap[title.toLowerCase()], "type" : "svgMap", "left" : left,"top" : top,"color" : color};
					    } 
					    temp.drawTooltipContent(tooltipObj);
					}
				}
//				else{
//					dataValues = "";
//				}
				if (temp.m_dataMap[title.toLowerCase()] != undefined) {
					$(this).css("fill", temp.m_rollovercolor);
				} else {
					$(this).css("fill", hex2rgb(temp.m_defaultfillcolor, temp.m_coloropacity));
				}
		});

		paths.on("mouseout", function (event) {
			var title = (""+$(event.target).attr("title"));
			var multipleNameFlag = temp.checkMultipleName(title);
			if(IsBoolean(multipleNameFlag)) {
				var newTitles = title.split("/");
				var tempflag = false;
				for(var i=0;i<newTitles.length;i++) {
					if(temp.m_colorMap[newTitles[i].toLowerCase()] != undefined) {
						title = newTitles[i];
						tempflag = true;
						break;
					}
				}
			}
			if(tempflag!==undefined && !IsBoolean(tempflag))
				title = newTitles[0];
			if(temp.m_leafLetColorMap[title] && temp.m_dataMap[title.toLowerCase()] != undefined)
				$(this).css("fill", hex2rgb(temp.m_leafLetColorMap[title], temp.m_coloropacity));
			else if(temp.m_colorMap[title.toLowerCase()])
				$(this).css("fill", hex2rgb(temp.m_defaultfillcolor, temp.m_coloropacity));
			temp.hideToolTip();
		});
	}
};

/** @description Getter method for ToolTip Formatter. **/
WorldMapChart.prototype.getSeriesValuesForToolTip = function (datamap) {
	var tempMap={};
	for(var key in datamap) {
		if(IsBoolean(this.m_seriesVisibleArr[key]))
			tempMap[datamap[key].displayName] = this.getFormatterForToolTip(key,datamap[key].displayData);
	}
	return tempMap;
};

/** @description Will update data value according to the Formatter setting. **/
WorldMapChart.prototype.getFormatterForToolTip = function (fieldname,value) {
	var data = value;
	data = getNumericComparableValue(data);
	if (isNaN(data) || data == "" || data == undefined){
		return data;
	} else {
		/*DAS-2 World Map Tooltip Formatter support when component formatter is false*/
		if(!IsBoolean(this.m_customtextboxfortooltip.useComponentFormatter) && (this.m_customtextboxfortooltip.formatter != undefined) && (this.m_customtextboxfortooltip.formatter[fieldname] !== undefined)) {
			data = this.getFieldFormatterForToolTip(data,fieldname);	
			return data;
		}
		/** for story need to show the formatters in tooltip as they are not showing the values on states **/
		this.m_precision = this.formatterMap[fieldname].precision;
		var m_precision;
		if (this.m_precision !== "default") {
		    m_precision = this.m_precision;
		} else {
		    m_precision = (data + "").split(".");
		    if (m_precision[1] !== undefined) {
		        m_precision = m_precision[1].length;
		    } else {
		        m_precision = 0;
		    }
		}
		
		if (this.formatterMap[fieldname].secondformatter != "none" && this.formatterMap[fieldname].secondformatter != "" && this.formatterMap[fieldname].secondunitname != "" && this.formatterMap[fieldname].secondunitname != "none") {
			this.m_secondaryUnitSymbol = this.m_util.getFormatterSymbol(this.formatterMap[fieldname].secondformatter, this.formatterMap[fieldname].secondunitname);
			this.m_secondaryFormatterPosition = "suffix";
			if (this.m_secondaryUnitSymbol != "auto") {
				try {
					data = this.m_util.updateTextWithFormatter(data, this.m_secondaryUnitSymbol, m_precision);
					data = this.getLocaleWithPrecision(data, m_precision);
					eval("data = this.m_util.addUnitAs" + this.m_secondaryFormatterPosition + "(data,this.m_secondaryUnitSymbol);");
				} catch (e) {}
			} else {
				var symbol = getNumberFormattedSymbol(data * 1);
				data = getNumberFormattedNumericValue(data * 1, m_precision);
				data = this.getLocaleWithPrecision(data, m_precision);
				eval("data = this.m_util.addUnitAs" + this.m_secondaryFormatterPosition + "(data,symbol);");
			}
		}else{
			data = this.getLocaleWithPrecision(data, m_precision);
		}
		
		if (this.formatterMap[fieldname].formatter != "none" && this.formatterMap[fieldname].formatter != "" && this.formatterMap[fieldname].unitname != "none" && this.formatterMap[fieldname].unitname != "") {
			this.m_unitSymbol = this.m_util.getFormatterSymbol(this.formatterMap[fieldname].formatter, this.formatterMap[fieldname].unitname);
			if(this.m_unitSymbol != undefined) {
				if (this.formatterMap[fieldname].signposition == "") {
					this.formatterMap[fieldname].signposition = "suffix";
				}
				return this.m_util.addFormatter(data, this.m_unitSymbol, this.formatterMap[fieldname].signposition, m_precision);
			}
		}
	}
	return data;
};
/** @description method checks if tooltip has any data formatting, andreturns formatted value **/
WorldMapChart.prototype.getFieldFormatterForToolTip = function(data, seriesName) {
    var signPosition = (this.m_customtextboxfortooltip.formatter[seriesName].SignPosition.value != "") ? this.m_customtextboxfortooltip.formatter[seriesName].SignPosition.value : "suffix";
    var precision = this.m_customtextboxfortooltip.formatter[seriesName].Precision.value;
    var unit = this.m_customtextboxfortooltip.formatter[seriesName].Unit.value;
    var secondUnit = this.m_customtextboxfortooltip.formatter[seriesName].SecondaryUnit.value;
    var numberFormatter = this.m_customtextboxfortooltip.formatter[seriesName].NumberFormatter.value;
    var formatter = "Currency";
    var secondFormatter = "Number";
    var valueToBeFormatted;
    var formatterSymbol = this.m_util.getFormatterSymbol(formatter, unit);
    var secondFormatterSymbol = this.m_util.getFormatterSymbol(secondFormatter, secondUnit);
    /* To Add Number formatter */
    if (secondFormatterSymbol == "auto") {
        data = getNumericComparableValue(data);
        var symbol = getNumberFormattedSymbol(data * 1, unit);
        var val = getNumberFormattedNumericValue(data * 1, precision, unit);
        var text = this.m_util.updateTextWithFormatter(val, "", precision);
        valueToBeFormatted = this.m_util.addFormatter(text * 1, symbol, "suffix");
    } else {
        var unitSymbol = secondFormatterSymbol;
        valueToBeFormatted = this.m_util.updateTextWithFormatter(data * 1, unitSymbol, precision);
        if (secondFormatterSymbol != "none" && secondFormatterSymbol != "" && secondFormatterSymbol != "") {
            valueToBeFormatted = this.m_util.addFormatter(valueToBeFormatted * 1, secondFormatterSymbol, "suffix");
        } else {
            valueToBeFormatted = valueToBeFormatted * 1;
        }
    }
    /* To add Currency formatter */
    valueToBeFormatted = (valueToBeFormatted == "NaN" || valueToBeFormatted === "") ? "" : this.m_util.addFormatter(getFormattedNumberWithCommas(valueToBeFormatted, numberFormatter), formatterSymbol, signPosition);
    return valueToBeFormatted;
}

/** @description Will check category name multiple or not and update the name accordingly. **/
WorldMapChart.prototype.checkNameHasMultipleName = function (updatetitle) {
	var temp=this;
	var multipleNameArray = temp.multipleNames[temp.m_maptype];
	var newUpdateName = updatetitle;
	for(var i = 0; i < multipleNameArray.length; i++) {
		var tempName = multipleNameArray[i].split("/");
		for(var j = 0 ; j < tempName.length; j++) {
			if(updatetitle.toLowerCase() === tempName[j].toLowerCase()) {
				newUpdateName = multipleNameArray[i];
				break;
			}
		}
	}
	return newUpdateName;
};

/** @description Will return flag for multiple name. **/
WorldMapChart.prototype.checkMultipleName = function (title) {
	var flag = (title.indexOf("/") > -1) ? true : false;
	return flag;
};


/** @description Getter method for tooltip data. **/
WorldMapChart.prototype.getMapToolTip = function (tooltipContent, left, top, chartObject) {
	$("#toolTipDiv").remove();
	var obj = document.createElement("div");
	obj.setAttribute("id", "toolTipDiv");
	var cls = (IsBoolean(chartObject.m_customtextboxfortooltip) && IsBoolean(chartObject.m_customtextboxfortooltip.dataTipType == "Custom")) ? "toolTipDivForCustom" : "toolTipDiv";
    obj.setAttribute("class", cls);
	//obj.setAttribute("class", "toolTipDiv");
	obj.style.width =  chartObject.m_customtooltipwidth + (chartObject.m_customtooltipwidth !== "auto" ? "px" : "");
	obj.style.fontFamily =  selectGlobalFont(chartObject.m_defaultfontfamily);
	document.body.appendChild(obj);
	obj.innerHTML = tooltipContent;
	obj.style.visibility = "";
	obj.setAttribute("placement", "bottom");
	obj.style.left = (left - (obj.clientWidth/2) )+ "px";
	obj.style.top = top + 10 + "px";
	var tooltipBGColor = convertColorToHex(chartObject.m_tooltipbackgroundcolor);
	if(chartObject.m_customtextboxfortooltip.dataTipType == "Custom"){
		 $(obj).css({
			 	"padding" : "5px",
		    	"background-color": hex2rgb(tooltipBGColor, chartObject.m_tooltipbackgroundtransparency),
		    	"border": chartObject.m_tooltipborderwidth+"px solid " + hex2rgb(convertColorToHex(chartObject.m_tooltipbordercolor))
		    });
	}else{
		$(obj).find("table").css("background-color", hex2rgb(tooltipBGColor, chartObject.m_tooltipbackgroundtransparency));
	    $(obj).find("td").each(function() {
	        $(this).css({
	            "background-color": hex2rgb(tooltipBGColor, chartObject.m_tooltipbackgroundtransparency),
	            "border": chartObject.m_tooltipborderwidth+"px solid " + hex2rgb(convertColorToHex(chartObject.m_tooltipbordercolor)),
	            "font-size": chartObject.m_tooltipfontsize + "px"
	        });
	    });	
	}
	if (chartObject.m_autotooltiphide) {
		setTimeout(function() {
			if (obj !== undefined) {
				/** .remove() of jQuery won't work in IE for plain object, Need to wrap inside $ **/
				$(obj).remove();
			}
		}, chartObject.m_tooltiphidetimeout);
	}
};

/** @description Creating Map and setting field name,required Data in Map for update global variable. **/
WorldMapChart.prototype.getDataPointAndUpdateGlobalVariable = function (Selected, index) {
	var fieldNameValueMap = new Object();
	var afn = this.getAllFieldsName();
	if (this.m_fieldvalue == undefined) {
		var tempMap = new Object();
		for (var j = 0; j < this.m_allSeriesNames.length; j++) {
			tempMap[this.m_allSeriesNames[j]] = "";
		}
		this.m_fieldvalue = tempMap;
	}
	for (var l = 0; l < afn.length; l++) {
		//fieldNameValueMap[afn[l]] = (this.m_fieldvalue[afn[l]] != undefined) ? this.m_fieldvalue[afn[l]] : Selected;
		fieldNameValueMap[afn[l]] = (this.m_svgtype == "svg") ? this.getDataProvider()[index][afn[l]] : this.m_tooltipLeafletData[index][afn[l]];
	}
	var drillColor = this.m_fieldcolor;
	var drillField = (this.m_svgtype !== "leaflet") ? this.getSeriesNames()[0] : this.m_markerNames[0];
	var drillDisplayField = (this.m_svgtype !== "leaflet") ? this.getSeriesDisplayNames()[0] : this.m_markerDisplayNames[0];
	var drillValue = fieldNameValueMap[drillField];
	fieldNameValueMap.drillField = drillField;
	fieldNameValueMap.drillDisplayField = drillDisplayField;
	fieldNameValueMap.drillValue = drillValue;
	this.updateDataPoints(fieldNameValueMap, drillColor);
};

/** @description Getter Method of StartX. **/
WorldMapChart.prototype.getStartX = function () {
	var marginForYAxisLabels = 0;
	return (this.m_x + marginForYAxisLabels);
};

/** @description Getter Method of StartY. **/
WorldMapChart.prototype.getStartY = function () {
	var marginForXAxisLabels = 0;
	return (this.m_y + this.m_height - marginForXAxisLabels);
};

/** @description Getter Method of EndX. **/
WorldMapChart.prototype.getEndX = function () {
	var rightSideMargin = 0;
	return (this.m_x + this.m_width - rightSideMargin);
};

/** @description Getter Method of EndY. **/
WorldMapChart.prototype.getEndY = function () {
	return (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};

/** @description Getter Method of Margin For Title. **/
WorldMapChart.prototype.getMarginForTitle = function () {
	var margin;
	if ((!IsBoolean(this.getShowGradient())) && (!IsBoolean(this.m_showmaximizebutton)) && (!IsBoolean(this.getTitle().m_showtitle)))
		margin = 0;
	else
		margin = (this.getTitleBarHeight() * 1);
	return margin;
};

/** @description Getter Method of Margin For SubTitle. **/
WorldMapChart.prototype.getMarginForSubTitle = function () {
	var margin;
	if(IsBoolean(this.m_subTitle.m_showsubtitle) && this.m_subTitle.m_formattedDescription.length > 1){
		margin = (this.m_subTitle.getDescription() != "") ? (this.m_subTitle.getFontSize() * 1.5) + 45 : 10;
	} else if (IsBoolean(this.m_subTitle.m_showsubtitle))
		margin = (this.m_subTitle.getDescription() != "") ? (this.m_subTitle.getFontSize() * 2) : 10;
	else
		margin = 0;
	return margin;
};

/** @description Constructor function  of svgMApTitle class. **/
function svgMApTitle(m_chart) {
	this.base = Title;
	this.base(m_chart);
};

/** @description Making prototype of Title class to inherit its properties and methods into svgMApTitle. **/
svgMApTitle.prototype = new Title;

/** @description Will draw Title Box for Title. **/
svgMApTitle.prototype.drawTitleBox = function () {
	var temp = this;
	var x = this.m_chart.m_x * 1;
	var y = this.m_chart.m_y * 1;
	var w = this.m_chart.m_width * 1;
	var h = this.m_titleBarHeight * 1;

	var xmlns = "http://www.w3.org/2000/svg";
	var rect = document.createElementNS(xmlns, "rect");
	rect.setAttributeNS(null, "x", x);
	rect.setAttributeNS(null, "y", y);
	rect.setAttributeNS(null, "height", h);
	rect.setAttributeNS(null, "width", w);
	rect.setAttributeNS(null, "fill", this.m_gradientcolorsArray[0]);
	$("#" + temp.m_chart.svgContainerId).append(rect);
};

/** @description draw the title text in html formate . **/
svgMApTitle.prototype.drawTitleTextInHTML = function () {
	var temp = this;
	$( "#title" + this.m_chart.m_objectid).remove();
	var text = document.createElement("div");
	var span = document.createElement("span");
	text.setAttribute("id", "title" + this.m_chart.m_objectid);
	span.innerHTML = this.m_chart.formattedDescription(this.m_chart, this.getDescription());
	text.style.height = this.m_chart.fontScaling(temp.m_titlebarheight) + "px";
	var iconWidth = (IsBoolean(this.m_chart.m_showmaximizebutton)) ? (temp.maxIconWidth*1) : 0;
	iconWidth = (IsBoolean(this.m_chart.m_showsettingmenubutton)) ? iconWidth + 25 : iconWidth + 0;
	span.setAttribute("style","display: inline-block; vertical-align: middle; line-height: normal;text-decoration:inherit;");
	text.setAttribute("style", "position: absolute; top:0px; left:0px;height:"+ this.m_chart.fontScaling(temp.m_titlebarheight) +"px;width:calc(100% - "+ iconWidth +"px);line-height:"+this.m_chart.fontScaling(temp.m_titlebarheight)+"px;padding-left:"+temp.m_chartLeftRightMargin+"px;font-family:" 
			+ this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getFontSize()) + "px;font-weight:" 
			+ this.getFontWeight() + ";color:"+this.m_fontColor +";text-align:"+this.getAlign()+";text-decoration:" + this.getTextDecoration() + ";overflow: hidden;white-space: nowrap;text-overflow: ellipsis;");
	
	$(text).append(span);
	$("#draggableDiv" + temp.m_chart.m_objectid).append(text);
};

/** @description Will draw text for Title. **/
svgMApTitle.prototype.drawText = function () {
	var temp = this;
	if (IsBoolean(this.m_chart.m_enablehtmlformate.title)) {
		this.drawTitleTextInHTML();
	} else {
	var text = drawSVGText(this.startX, this.startY, "", this.m_fontColor, this.getAlign(), "middle");
	wrapSVGText(temp, this.startX, this.startY, this.m_formattedDescription, text, temp.m_chart.fontScaling(this.m_fontsize), (this.m_chart.m_width * 1 - 20 * 1));
	text.setAttribute("dominant-baseline", "middle");
	text.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + temp.m_chart.fontScaling(this.getFontSize()) + "px;font-weight:" + this.getFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$("#" + temp.m_chart.svgContainerId).append(text);
	}
};

/** @description Constructor function  of svgMapSubTitle class. **/
function svgMapSubTitle() {
	this.base = SubTitle;
	this.base();
};

/** @description Making prototype of SubTitle class to inherit its properties and methods into svgMapSubTitle. **/
svgMapSubTitle.prototype = new SubTitle;

/** @description Will draw text for SubTitle. **/
/*
svgMapSubTitle.prototype.drawText = function() {
    if (IsBoolean(this.m_chart.m_enablehtmlformate.subtitle)) {
        this.drawSubTitleTextInHTML();
    } else {
        var temp = this.m_chart;
        var text = drawSVGText(this.startX, this.startY, this.m_formattedDescription, this.m_fontColor, this.getAlign(), "middle");
        text.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.getFontSize() + "px;font-weight:" + this.getFontWeight() + ";");
        $("#" + temp.svgContainerId).append(text);
    }
};
*/
svgMapSubTitle.prototype.drawText = function () {
	var temp = this;
	if (IsBoolean(this.m_chart.m_enablehtmlformate.subtitle)) {
		this.drawSubTitleTextInHTML();
	} else {
		var text = drawSVGText(this.startX, (this.startY), "", this.m_fontColor, this.getAlign(), "middle");
		wrapSVGText(temp, this.startX, (this.startY), this.m_formattedDescription, text, temp.m_chart.fontScaling(this.m_fontsize), (this.m_chart.m_width * 1 - 20 * 1));
		text.setAttribute("dominant-baseline", "middle");
		text.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getFontSize()) + "px;font-weight:" + this.getFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
		 // Internet Explorer 6-11
		var isIE = /*@cc_on!@*/false || !!document.documentMode;
		if (isIE) {
			text.setAttribute("dy", "0.3em");
		}
		$("#" + temp.m_chart.svgContainerId).append(text);
	}
};

/** @description draw the subtitle text in html formate . **/
svgMapSubTitle.prototype.drawSubTitleTextInHTML = function () {
	var temp = this;
	$( "#subTitle" + this.m_chart.m_objectid).remove();
	var text = document.createElement("div");
	var span = document.createElement("span");
	text.setAttribute("id", "subTitle" + this.m_chart.m_objectid);
	span.innerHTML = this.m_chart.formattedDescription(this.m_chart, this.getDescription());
	text.style.height = this.m_chart.fontScaling(temp.m_subTitleBarHeight) + "px";
	var iconWidth = (IsBoolean(this.m_chart.m_showmaximizebutton)) ? (temp.maxIconWidth*1) : 0;
	iconWidth = (IsBoolean(this.m_chart.m_showsettingmenubutton)) ? iconWidth + 25 : iconWidth + 0;
	var top = 0;
	if(IsBoolean(this.m_chart.getTitle().m_showtitle)) {
		iconWidth = 0;
		top = this.m_chart.fontScaling(temp.m_chart.getTitle().m_titlebarheight) ; 
	}
	span.setAttribute("style","display: inline-block; vertical-align: middle; line-height: normal;text-decoration:inherit;");
	text.setAttribute("style", "position: absolute; top:"+ top +"px;left:0px;height:"+ this.m_chart.fontScaling(temp.m_subTitleBarHeight) +"px;width:calc(100% - "+ iconWidth +"px);line-height:"+this.m_chart.fontScaling(temp.m_subTitleBarHeight)+"px;padding-left:"+temp.m_chartLeftRightMargin+"px;font-family:" 
			+ this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getFontSize()) + "px;font-weight:" 
			+ this.getFontWeight() + ";color:"+this.m_fontColor +";text-align:"+this.getAlign()+";text-decoration:" + this.getTextDecoration() + ";overflow: hidden;white-space: nowrap;text-overflow: ellipsis;");
	$(text).append(span);
	$("#draggableDiv" + temp.m_chart.m_objectid).append(text);
};
//# sourceURL=WorldMapChart.js