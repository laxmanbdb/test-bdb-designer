/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: SentimentPlotChart.js
 * @description SentimentPlotChart
 **/
var sentimentInfo = {
	infoID: 1, // Current info dialog's unique ID
	dialogBoxes: [] // Active dialogs array
};
function SentimentPlotChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();
	this.m_x = 350;
	this.m_y = 20;
	this.m_width = 300;
	this.m_height = 260;

	/** Array Creation for storing the calculated positions and creating object of XAxis,YAxis,SentimentPlotChartCalculation**/
	this.m_seriesNames = [];
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_chartData = [];
	this.m_plotRadius = [];
	this.m_chartTypeNames = [];
	this.m_showSeries = [];
	this.m_sentimentShapeSeries = [];

	this.m_maximumaxisvalue;
	this.m_minimumaxisvalue;
	this.m_showrangecolorbar = true;
	this.m_yPositionArray = [];
	this.m_calculation = new SentimentPlotChartCalculation();
	this.m_xAxis = new Xaxis();
	this.m_yAxis = new Yaxis();

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;

	this.noOfRows = 1; //used for set x-axis text into two rows in non tilted case.

	this.m_chartMargin = 50;
	this.m_emoticonwidth = 18;
	this.m_emoticonalpha = 1;
	this.m_chartbase = "gradient";
	this.m_luminance = "0.4";
	this.m_transparency = "1";
	this.m_showalldatapointsintooltip = false;
	this.m_showtweetsinmodel = true;
};

/** @description Making prototype of chart class to inherit its properties and methods into SentimentPlotChart **/
SentimentPlotChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
SentimentPlotChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas(); //create draggable div
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
SentimentPlotChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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
				default:
					var propertyName = this.getNodeAttributeName(chartKey)
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
SentimentPlotChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description Checking values ,if values comes in the criteria than only pushing into array  **/
SentimentPlotChart.prototype.refineSentimentPlotData = function () {
	var dp = [];
	this.origionalDPLength = this.getDataProvider().length;
	for (var i = 0; i < this.getDataProvider().length; i++) {
		var record = this.getDataProvider()[i];
		var x = record[this.nameArr[0]];
		var y = record[this.otherFieldArr[0]];
		var color = record[this.colorArr[0]];
		var radius = record[this.plotRadiusFieldArr[0]];
		if (this.nameArr[0] !== undefined && x !== undefined && x !== null && x !== "null" && x !== "" && x > 1 && x < 9)
			if (this.otherFieldArr[0] !== undefined && y !== undefined && y !== null && y !== "null" && y !== "" && y > 1 && y < 9)
				if (this.colorArr[0] !== undefined && color !== undefined && color !== null && color !== "null" && color !== "")
					if (this.plotRadiusFieldArr[0] !== undefined && radius !== undefined && radius !== null && radius !== "null" && radius !== "")
						dp.push(record);
	}
	this.m_dataProvider = [];
	this.m_dataProvider = dp;
};

/** @description Passing FieldJSON to setCategory,setSeries methods**/
SentimentPlotChart.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	this.setCategory(fieldsJson);
	this.setSeries(fieldsJson);
	this.setAllFieldNames();
};

/** @description Pushing all field names into a single array that is this.m_allfieldsName **/
SentimentPlotChart.prototype.setAllFieldNames = function () {
	var fieldNames = [];
	this.m_allfieldsName = [];
	for (var i = 0; i < this.nameArr.length; i++) {
		fieldNames.push(this.nameArr[i]);
		if (this.otherFieldArr[i] != "")
			fieldNames.push(this.otherFieldArr[i]);
	}
	fieldNames = this.getUniqueValueFromArray(fieldNames);
	this.m_allfieldsName = fieldNames;
};

/** @description On basis of field type pushing field name into array **/
SentimentPlotChart.prototype.getFieldbyYFields = function () {
	//seriesNames
	var fieldNames = [];
	for (var i = 0; i < this.nameArr.length; i++) {
		if (this.typeArr[i] == "YField" && this.otherFieldArr[i] != "") {
			fieldNames.push(this.nameArr[i]);
		} else if (this.typeArr[i] == "XField" && this.otherFieldArr[i] != "") {
			fieldNames.push(this.otherFieldArr[i]);
		}
	}
	return fieldNames;
};

/** @description On Basis of field type pushing field Display Name into fieldNames array **/
SentimentPlotChart.prototype.getFieldbyYFieldsDisplayName = function () {
	//seriesDisplayNames
	var fieldNames = [];
	for (var i = 0; i < this.seriesNameArr[i].length; i++) {
		if (this.typeArr[i] == "YField" && this.otherFieldArr[i] != "") {
			fieldNames.push(this.displayFieldArr[i]);
		} else if (this.typeArr[i] == "XField" && this.otherFieldArr[i] != "") {
			fieldNames.push(this.displayFieldArr[i]);
		}
	}
	return fieldNames;
};

/** @description Find Unique value from Array and return **/
SentimentPlotChart.prototype.getUniqueValueFromArray = function (a) {
	var temp = {};
	for (var i = 0; i < a.length; i++)
		temp[a[i]] = true;
	var r = [];
	for (var k in temp)
		r.push(k);
	return r;
};

/** @description Find Category field from fieldJSON and storing field attributes into respective array **/
SentimentPlotChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	for (var i = 0; i < categoryJson.length; i++) {
		var type = this.getProperAttributeNameValue(categoryJson[i], "Type");
		var otherField = this.getProperAttributeNameValue(categoryJson[i], "OtherField");

		if (type == "YField" && otherField != "") {
			this.m_categoryNames.push(otherField);
		} else if (type == "XField" && otherField != "") {
			this.m_categoryNames.push(this.getProperAttributeNameValue(categoryJson[i], "Name"));
		}
	}
};

/** @description According to the field type storingotherfield name into array and returning **/
SentimentPlotChart.prototype.getOtherFields = function () {
	var fieldNames = [];
	for (var i = 0; i < this.nameArr.length; i++) {
		if (this.typeArr[i] == "YField" && this.otherFieldArr[i] != "") {
			fieldNames.push(this.otherFieldArr[i]);
		} else if (this.typeArr[i] == "XField" && this.otherFieldArr[i] != "") {
			fieldNames.push(this.nameArr[i]);
		}
	}
	//fieldNames = this.getUniqueValueFromArray(fieldNames);
	return fieldNames;
};

/** @description Getter for Category Names **/
SentimentPlotChart.prototype.getCategoryNames = function () {
	var categoryNames = this.getOtherFields();
	return categoryNames;

};

/** @description Getter for category Display Names **/
SentimentPlotChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

/** @description Get attribute from series and store it into different-2 arrays**/
SentimentPlotChart.prototype.setSeries = function (seriesJson) {
	this.nameArr = [];
	this.otherFieldArr = [];
	this.legendArr = [];
	this.displayNamesArr = [];
	this.colorArr = [];
	this.plotRadiusFieldArr = [];
	this.typeArr = [];
	this.toolTipArr = [];

	//only one series will be required for sentiment
	//for(var i=0 ; i<seriesJson.length ; i++)
	for (var i = 0; i < 1; i++) {
		this.nameArr[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		this.otherFieldArr[i] = this.getProperAttributeNameValue(seriesJson[i], "OtherField");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.displayNamesArr[i] = m_formattedDisplayName;
		var col_1 = this.getProperAttributeNameValue(seriesJson[i], "Color");
		var col_2 = this.getProperAttributeNameValue(seriesJson[i], "ColorField");
		this.colorArr[i] = (col_2) ? col_2 : (col_1) ? col_1 : "Color";
		this.plotRadiusFieldArr[i] = this.getProperAttributeNameValue(seriesJson[i], "PlotRadius");

		var tooltip = this.getProperAttributeNameValue(seriesJson[i], "ToolTip");
		this.toolTipArr[i] = (tooltip && tooltip !== "") ? tooltip.split(",") : "";
		this.typeArr[i] = this.getProperAttributeNameValue(seriesJson[i], "Type");
		if (this.typeArr[i] != "Category"){
			this.m_showSeries[i] = this.getProperAttributeNameValue(seriesJson[i], "visible");
		}
	}
};

/** @description Getter for Series Names**/
SentimentPlotChart.prototype.getSeriesNames = function () {
	var seriesNames = this.getFieldbyYFields();
	return seriesNames;

};

/** @description Getter for series Display Names **/
SentimentPlotChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};

/** @description Getter for series colors **/
SentimentPlotChart.prototype.getSeriesColors = function () {
	var color = [];
	this.m_tooltipsentiment = [];
	this.plotRadiusArr = [];
	for (var i = 0; i < this.getDataProvider().length; i++) {
		var x = this.getDataProvider()[i][this.nameArr[0]];
		var y = this.getDataProvider()[i][this.otherFieldArr[0]];

		var colorOpacity = this.getDataProvider()[i][this.colorArr[0]];
		if (x == "" || x == null || x == undefined || y == "" || y == null || y == undefined || colorOpacity == "" || colorOpacity == null || colorOpacity == undefined)
			color.push("rgba(255,255,255,1)");
		else
			color.push(this.tweetColor(x, y, colorOpacity));

		var plotRadius = this.getDataProvider()[i][this.plotRadiusFieldArr[0]];
		if (plotRadius == "" || plotRadius == null || plotRadius == undefined)
			this.plotRadiusArr.push(0);
		else
			this.plotRadiusArr.push(plotRadius);

		var toolTip = [];
		for (var j = 0; j < this.toolTipArr[0].length; j++) {
			var toolTipText = this.getDataProvider()[i][this.toolTipArr[0][j]];
			if (toolTipText == "" || toolTipText == null || toolTipText == undefined)
				toolTip.push("");
			else
				toolTip.push(toolTipText);
		}
		this.m_tooltipsentiment.push(toolTip);
	}
	return color;
};

/** @description According to the X,Y value calculate the color with opacity **/
SentimentPlotChart.prototype.tweetColor = function (x, y, opacity) {
	var col; // Tweet colour
	var L; // Tweet luminance

	//  valence controlling blue-green hue
	L = 0.4 + (((y - 1) / 8.0) * 0.5);
	if (x < 5) {
		col = this.getColorWL(L, 0.08);
	} else {
		col = this.getColorWL(L, 0.55);
	}

	//  Add an alpha channel value based on overall standard deviation
	col["a"] = (opacity - 1.5) / 2.0;
	if (col.a < 0) {
		col.a = 0;
	} else if (col.a > 1) {
		col.a = 1;
	}
		
	return "rgba(" + col.r + "," + col.g + "," + col.b + "," + (1.0 - col.a) + ")";
	//return col;
};

/** @description Checking Different-2 cases and according to that calculating color in RGB  **/
SentimentPlotChart.prototype.getColorWL = function (L, t) {
	var luminanceNum = 11; // Number of luminance slices
	var pathLen = 100; // Number of positions along path
	var stepPerHue = 4;
	var L_i; // Path position left of L
	var L_frac; // Fractional amount past position L_i
	var r,
	g,
	b; // RGB colour
	var t_i; // Path position left of t
	var t_frac; // Fractional amount past position t_i
	var x,
	y,
	z; // RGB anchor for L interpolation


	if (L < 0) {
		// Bracket L to range 0-1
		L = 0;
	} else if (L > 1) {
		L = 1;
	}

	if (t < 0) {
		// Bracket t to range 0-1
		t = 0;
	} else if (t > 1) {
		t = 1;
	}

	L_i = Math.floor((luminanceNum - 1) * L);
	L_frac = ((luminanceNum - 1) * L) - L_i;
	t_i = Math.floor(((stepPerHue * 10) - 1) * t);
	t_frac = (((stepPerHue * 10) - 1) * t) - t_i;
	r = colorPath[L_i][t_i][0]; // Define anchor colour
	g = colorPath[L_i][t_i][1];
	b = colorPath[L_i][t_i][2];

	if (Math.abs(t_frac) > 0.01) {
		// Add fractional amount
		r += (colorPath[L_i][t_i + 1][0] - r) * t_frac;
		g += (colorPath[L_i][t_i + 1][1] - g) * t_frac;
		b += (colorPath[L_i][t_i + 1][2] - b) * t_frac;
	}

	if (Math.abs(L_frac) > 0.01) {
		// Interpolate between luminance slices
		x = colorPath[L_i + 1][t_i][0];
		y = colorPath[L_i + 1][t_i][1];
		z = colorPath[L_i + 1][t_i][2];

		if (Math.abs(t_frac) > 0.01) {
			// Add fractional amount
			x += (colorPath[L_i + 1][t_i + 1][0] - x) * t_frac;
			y += (colorPath[L_i + 1][t_i + 1][1] - y) * t_frac;
			z += (colorPath[L_i + 1][t_i + 1][2] - z) * t_frac;
		}

		r += (x - r) * L_frac; // Add fractional amount in L-direction
		g += (y - g) * L_frac;
		b += (z - b) * L_frac;
	}

	r = Math.round(r);
	g = Math.round(g);
	b = Math.round(b);
	return {
		r : r,
		g : g,
		b : b
	};
};

/** @description Setter for Category,Series data**/
SentimentPlotChart.prototype.setCategorySeriesData = function () {
	this.m_categoryData = [];
	this.m_seriesData = [];
	for (var k = 0; k < this.getDataProvider().length; k++) {
		var record = this.getDataProvider()[k];
		this.isEmptyCategory = true;
		if (this.getCategoryNames().length > 0) {
			this.isEmptyCategory = false;
			for (var i = 0; i < this.getCategoryNames().length; i++) {
				if( !this.m_categoryData[i] )
					this.m_categoryData[i] = [];
				var data = this.getValidFieldDataFromRecord(record,this.getCategoryNames()[i]);
				this.m_categoryData[i][k] = data;
			}
		}
	
		for (var j = 0; j < this.getSeriesNames().length; j++) {
			if( !this.m_seriesData[j] ){
				this.m_seriesData[j] = [];
			}
			var data = this.getValidFieldDataFromRecord(record,this.getSeriesNames()[j]);
			if (isNaN(data)) {
				data = getNumericComparableValue(data);
			}			
			this.m_seriesData[j][k] = data;
		}	
	}
};

/** @description Setter for Category Data **/
SentimentPlotChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
};

/** @description Getter for Category Data **/
SentimentPlotChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

/** @description Setter for series data **/
SentimentPlotChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0; i < this.getSeriesNames().length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
};

/** @description Getter for series data **/
SentimentPlotChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

/** @description Setter for series color **/
SentimentPlotChart.prototype.setSeriesColor = function (m_seriesColor) {
	this.m_seriesColor = m_seriesColor;
};

/** @description Getter For Series Color **/
SentimentPlotChart.prototype.getSeriesColor = function () {
	return this.m_seriesColor;
};

/** @description Setter for legend Names **/
SentimentPlotChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};

/** @description Getter For Legend Names **/
SentimentPlotChart.prototype.getLegendNames = function () {
	this.m_legendNames = this.displayNamesArr;
	return this.m_legendNames;
};

/** @description Setting all fields Name into this.m_allfieldName **/
SentimentPlotChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getCategoryNames()[i]);
	}
	for (var j = 0; j < this.getSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getSeriesNames()[j]);
	}
};

/** @description Getter for AllFieldName **/
SentimentPlotChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

/** @description Setting all field display name into this.m_allfieldDisplayName**/
SentimentPlotChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

/** @description Getter for all fields Display Name **/
SentimentPlotChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

/** @description Getter for other field **/
SentimentPlotChart.prototype.getOtherField = function () {
	return this.m_otherFields;
};

/** @description Getter for All Fields Display Name**/
SentimentPlotChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

/** @description SentimentPlotChart class initialization**/
SentimentPlotChart.prototype.init = function () {
	this.refineSentimentPlotData();
	// this.setCategoryData();
	// this.setSeriesData();
	this.setCategorySeriesData();
	this.m_chartTypeNames = this.getChartTypeNames();
	this.isSeriesDataEmpty();
	this.m_seriesNames = this.getSeriesNames();
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);
	this.m_chartMargin = (this.m_title.m_showtitle) ? this.getTitleBarHeight() + 25 : this.m_chartMargin;
	if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory)) {
		this.m_calculation.init(this, this.getCategoryData(), this.getSeriesData());
		for (var i = 0; i < this.m_seriesData.length; i++) {
			this.m_sentimentShapeSeries[i] = new SentimentShapeSeries();
			this.m_sentimentShapeSeries[i].init(this.getSeriesColors(), this.m_calculation.getXPixelArray()[i], this.m_calculation.getYPixelArray()[i], this.getChartTypeNames()[i], this.plotRadiusArr, this);
		}
	}
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};

/** @description Start Drawing of chartFrame,Title,SubTitle,SentimentBubble**/
SentimentPlotChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	if (IsBoolean(this.m_showrangecolorbar))
		this.drawColorRange();
	this.drawSentimentAxisAndText();
	if (!IsBoolean(this.m_isEmptySeries) && !IsBoolean(this.isEmptyCategory)) {
		this.drawSentimentBubble();
	}
};

/** @description Drawing Axis and Marking emotion text**/
SentimentPlotChart.prototype.drawSentimentAxisAndText = function () {
	var canvas = $("#draggableCanvas" + this.m_objectid);
	var w = this.m_width;
	var h = this.m_height;
	var margin = 100;

	var i; // Loop counter
	var step; // Step distance between ticks

	// Emotion label text
	var label = [
		"Pleasant", "Unpleasant", "Active", "Subdued", "Happy", "Upset", "Sad", "Contented", "Elated", "Stressed", "Unhappy", "Serene",
		"Excited", "Nervous", "Depressed", "Relaxed", "Alert", "Tense", "Bored", "Calm"
	];
	var cMargin = (IsBoolean(this.m_updateddesign) ? this.m_chartMargin * 1.5 : this.m_chartMargin);
	var hChartMargin = (IsBoolean(this.m_updateddesign) ? this.m_chartMargin * 3 : this.m_chartMargin * 2);
	var chartMargin = (IsBoolean(this.m_updateddesign) ? this.m_chartMargin + 20 : this.m_chartMargin - 10);

	this.ctx.strokeStyle = convertColorToHex(this.m_axiscolor);
	this.ctx.beginPath();
	this.ctx.save(); // Draw pleasure/arousal axes
	this.ctx.translate(0.5, 0.5); // anti aliasing
	this.ctx.moveTo(parseInt(w / 2), parseInt(cMargin));
	this.ctx.lineTo(parseInt(w / 2), parseInt(cMargin));
	this.ctx.stroke();
	this.ctx.restore();
	this.ctx.closePath();

	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.translate(0.5, 0.5); // anti aliasing
	this.ctx.moveTo(parseInt(this.m_chartMargin), parseInt(h / 2));
	this.ctx.lineTo(parseInt(w - this.m_chartMargin), parseInt(h / 2));
	this.ctx.stroke();
	this.ctx.restore();
	this.ctx.closePath();

	step = (w - this.m_chartMargin * 2) / 8.0;

	for (i = 0; i < 9; i++) {
		// Draw pleasure axis ticks
		this.ctx.beginPath();
		this.ctx.moveTo(this.m_chartMargin + (i * step), (h / 2) - 5);
		this.ctx.lineTo(this.m_chartMargin + (i * step), (h / 2) + 5);
		this.ctx.stroke();
	}

	step = (h - hChartMargin) / 8.0;

	for (i = 0; i < 9; i++) {
		// Draw arousal axis ticks
		this.ctx.beginPath();
		this.ctx.moveTo((w / 2) - 5, cMargin + (i * step));
		this.ctx.lineTo((w / 2) + 5, cMargin + (i * step));
		this.ctx.stroke();
	}
	this.ctx.beginPath();
	this.ctx.textAlign = "center"; // Draw labels
	this.ctx.fillStyle = convertColorToHex(this.m_xAxis.m_labelfontcolor);
	this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize * 1) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
	this.ctx.fillText(label[0], w - this.m_chartMargin, (h / 2) - 10);
	this.ctx.fillText(label[1], this.m_chartMargin + 10 + this.fontScaling(this.m_xAxis.m_labelfontsize * 1), (h / 2) - 10);
	this.ctx.fillText(label[2], w / 2, chartMargin); // Active
	this.ctx.fillText(label[3], w / 2, h - (chartMargin)); // Subdued

	for (i = 1; i < 5; i++) {
		// Remaining labels around a circle
		var ang = (i * 18.0) / 180.0 * Math.PI; // Angle for label, in radians
		var x = (w / 2) + (Math.cos(ang) * ((w - hChartMargin) / 2)); // Label"s (x,y) position
		var y = (h / 2) - (Math.sin(ang) * ((h - hChartMargin) / 2));
		this.ctx.fillText(label[(i * 4)], x, y);
		this.ctx.fillText(label[(i * 4) + 1], w - x, y);
		this.ctx.fillText(label[(i * 4) + 2], w - x, h - y);
		this.ctx.fillText(label[(i * 4) + 3], x, h - y);
		if (i == 3) {
			this.drawSentimentEmoticons(x, y, w, h);
		}
	}
	this.ctx.fillStyle = convertColorToHex(this.m_xAxis.m_labelfontcolor);
	this.ctx.closePath();

	var text = "Reviews (" + this.m_reviews + ")";	
	var textWidth = this.ctx.measureText(text).width;
	$("#Reviews" + this.m_objectid).remove();
	var reviewDiv = document.createElement("div");
	reviewDiv.id = "Reviews" + this.m_objectid;
	reviewDiv.innerHTML = "Reviews (" + this.getDataProvider().length + ")";
	reviewDiv.title = "Actual Reviews (" + this.origionalDPLength + ")"; ;
	reviewDiv.style.top = this.getMarginForTitle() + "px";
	reviewDiv.style.left = (w - textWidth) + "px";
	reviewDiv.style.color = this.m_xAxis.m_labelfontcolor;
	reviewDiv.style.fontSize = this.m_xAxis.m_labelfontsize + "px";
	reviewDiv.style.fontFamily = selectGlobalFont(this.m_xAxis.m_labelfontfamily);
	reviewDiv.style.cursor = "pointer";
	reviewDiv.style.position = "absolute";

	$("#draggableDiv" + this.m_objectid).append(reviewDiv);
};

/** @description Calling one by one createEmotion function**/
SentimentPlotChart.prototype.drawSentimentEmoticons = function (x, y, w, h) {
	var imgWidth =((this.m_width > this.m_height) ? this.m_height : this.m_width) / (30 - this.m_emoticonwidth);
	var	imgHeight = ((this.m_width > this.m_height) ? this.m_height : this.m_width) / (30 - this.m_emoticonwidth);
	var marginFromText = -10;
	this.createEmoticon(w - this.m_chartMargin - imgWidth / 2, y - imgHeight - marginFromText, imgWidth, imgWidth, "Happy" + this.m_objectid, "bd-happy", "#2ECC71");
	this.createEmoticon(this.m_chartMargin - imgWidth / 2, y - imgHeight - marginFromText, imgWidth, imgWidth, "Nervous" + this.m_objectid, "bd-stress", "#F89406");
	this.createEmoticon(this.m_chartMargin - imgWidth / 2, h - y + marginFromText, imgWidth, imgWidth, "Angry" + this.m_objectid, "bd-angry", "#E74C3C");
	this.createEmoticon(w - this.m_chartMargin - imgWidth / 2, h - y + marginFromText, imgWidth, imgWidth, "Relax" + this.m_objectid, "bd-relax", "#4183D7");
};

/** @description Drawing Emotions**/
SentimentPlotChart.prototype.createEmoticon = function (x, y, w, h, id, cssClass, fontColor) {
	var temp = this;
	$("#" + id).remove();
	var img = document.createElement("span");
	img.setAttribute("id", id);
	img.setAttribute("class", " icons " + cssClass);
	img.style.fontSize = h + "px";
	img.style.color = fontColor;
	img.style.left = x + "px";
	img.style.top = y + "px";
	img.style.height = Math.ceil(h) + "px";
	img.style.width = w + "px";
	img.style.opacity = this.m_emoticonalpha;
	img.style.position = "absolute";
	$("#draggableDiv" + temp.m_objectid).append(img);
};

/** @description Creating gradient and drawing text **/
SentimentPlotChart.prototype.drawColorRange = function () {
	//var canvas = $("#draggableCanvas" + this.m_objectid);
	var w = this.m_width;
	var h = this.m_height;

	var gradient = this.color;
	try {
		gradient = this.ctx.createLinearGradient(this.m_chartMargin / 4, h - this.m_chartMargin, this.m_chartMargin / 4, this.m_chartMargin);
		gradient.addColorStop(0, "rgba(67,17,29,1)");
		gradient.addColorStop(0.5, "rgba(233,186,215,1)");
		gradient.addColorStop(0.5, "rgba(169,211,200,1)");
		gradient.addColorStop(1, "rgba(5,40,23,1)");
	} catch (e) {
		console.log(e);
	}
	var cMargin = (IsBoolean(this.m_updateddesign) ? this.m_chartMargin + 10 : this.m_chartMargin);
	this.ctx.beginPath();
	this.ctx.fillStyle = gradient;
	this.ctx.rect(this.m_chartMargin / 4, cMargin, 8, h - this.m_chartMargin * 2);
	this.ctx.fill();
	this.ctx.closePath();

	this.ctx.beginPath();
	this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize * 1) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
	this.ctx.fillStyle = "#000000";
	this.ctx.textAlign = "left"; 
	this.ctx.fillText("1", this.m_chartMargin / 4, h - cMargin + this.fontScaling(this.m_xAxis.m_labelfontsize * 1) / 2);
	this.ctx.fillText("9", this.m_chartMargin / 4, cMargin - this.fontScaling(this.m_xAxis.m_labelfontsize * 1) / 2);
	this.ctx.fill();
	this.ctx.closePath();

};

/** @description Drawing line from start Position to end Position **/
SentimentPlotChart.prototype.drawLine = function (x, y, x1, y1) {
	this.ctx.beginPath();
	this.ctx.moveTo(x, y);
	this.ctx.lineTo(x1, y1);
	this.ctx.strokeStyle = "#036861";
	this.ctx.stroke();
	this.ctx.closePath();
};

/** @description Canvas Creation **/
SentimentPlotChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description Creating Draggable Div and Canvas**/
SentimentPlotChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/** @description Calling draw Title**/
SentimentPlotChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

/** @description Calling draw SubTitle**/
SentimentPlotChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

/** @description Drawing of X Axis**/
SentimentPlotChart.prototype.drawXAxis = function () {
	this.m_xAxis.drawXAxis();
	this.m_xAxis.markXaxis();
};

/** @description Drawing of Y Axis**/
SentimentPlotChart.prototype.drawYAxis = function () {
	this.m_yAxis.drawYAxis();
	this.m_yAxis.markYaxis();
};

/** @description Drawing of Chart Frame**/
SentimentPlotChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

/** @description Calling to drawSentimentShapeSeries to the length of category Data**/
SentimentPlotChart.prototype.drawSentimentBubble = function () {
	for (var i = 0; i < this.getCategoryData().length; i++) {
		if (IsBoolean(this.m_showSeries[i]))
			this.m_sentimentShapeSeries[i].drawSentimentShapeSeries();
		else {}
	}
};

/** @description Getter for startX**/
SentimentPlotChart.prototype.getStartX = function () {
	var marginForYAxisLabels = this.m_chartMargin;
	return (this.m_x + marginForYAxisLabels);
};

/** @description Getter for StartY**/
SentimentPlotChart.prototype.getStartY = function () {
	var marginForXAxisLabels = this.m_chartMargin;
	return (this.m_y + this.m_height - marginForXAxisLabels);
};

/** @description Getter for End X**/
SentimentPlotChart.prototype.getEndX = function () {
	var rightSideMargin = this.m_chartMargin;
	return (this.m_x + this.m_width - rightSideMargin);
};

/** @description Getter for End Y**/
SentimentPlotChart.prototype.getEndY = function () {
	return this.m_y + this.m_chartMargin;
	//return  (this.m_y  +  this.getMarginForTitle()*1 + this.getMarginForSubTitle()*1);
};

/** @description Getter for TitleMargin**/
SentimentPlotChart.prototype.getMarginForTitle = function () {
	var marginForTitle = (IsBoolean(this.m_updateddesign) ? 60 : 40);
	if ((!IsBoolean(this.getShowGradient())) && (!IsBoolean(this.m_showmaximizebutton)) && (!IsBoolean(this.getTitle().m_showtitle)))
		margin = 15;
	else
		margin = marginForTitle;
	return margin;
};

/** @description Getter for SubTitle Margin**/
SentimentPlotChart.prototype.getMarginForSubTitle = function () {
	var margin;
	if (IsBoolean(this.m_subTitle.m_showsubtitle))
		margin = (this.m_subTitle.getDescription() != "") ? (this.fontScaling(this.m_subTitle.getFontSize() * 1) * 1.5) : 10;
	else
		margin = 0;
	return margin;
};

/** @description Getter for Tooltip Data**/
SentimentPlotChart.prototype.getToolTipData = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && (IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None"))) {
		var isInIpad = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) ? true : false;/** Checking For Ipad/Iphone/IPOD **/
		if(IsBoolean(isInIpad)){
			this.getDataPointAndUpdateGlobalVariable(mouseX, mouseY);
		}
		else{
			var toolTipData;
			var data = [];
			this.xPositionArr = this.m_calculation.getXPixelArray();
			this.yAxisDataArray = this.m_calculation.getYPixelArray();
	
			if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
				toolTipData = {};
				toolTipData.data = new Array();			
				for (var i = 0; i < this.xPositionArr.length; i++){
					for (var k = 0; k < this.xPositionArr[i].length; k++) {
						if (mouseX <= (this.xPositionArr[i][k] * 1 + this.plotRadiusArr[k] * 1) && (mouseX >= this.xPositionArr[i][k] * 1 - this.plotRadiusArr[k] * 1) && (mouseY <= (this.yAxisDataArray[i][k] * 1 + this.plotRadiusArr[k] * 1)) && (mouseY >= (this.yAxisDataArray[i][k] * 1 - this.plotRadiusArr[k] * 1))) {
							var data = [];
							for (var t = 0; t < this.m_tooltipsentiment[k].length; t++) {
								if (this.m_tooltipsentiment[k][t].length > 40)
									data[t] = this.m_tooltipsentiment[k][t].substring(0, 38) + "  ....";
								else
									data[t] = this.m_tooltipsentiment[k][t];
							}
							toolTipData.data.push(data);
							// To show all data points on this x-y position or not
							if (!IsBoolean(this.m_showalldatapointsintooltip))
								break;
						} else {
							this.hideToolTip();
						}					
					}
				}
			} else {
				this.hideToolTip();
			}
			return toolTipData;
		}
	}
};

/** @description Drawing of tooltip**/
SentimentPlotChart.prototype.drawTooltip = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && !this.m_designMode && (IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None"))) {
		var toolTipData = this.getToolTipData(mouseX, mouseY);
		if(this.m_hovercallback && this.m_hovercallback != ""){
			this.drawCallBackContent(mouseX,mouseY,toolTipData);
		}
		else{
			this.drawTooltipContent(toolTipData);
		}
	}
};

/** @description Creating Table and in td adding tooltip data**/
SentimentPlotChart.prototype.drawTooltipContent=function(toolTipData){
	this.m_tooltip.draw(toolTipData, this.m_componenttype);
};

/** @description Creating div and showing content in Div**/
SentimentPlotChart.prototype.showToolTipDiv = function (tooltipContent) {
	var temp = this;
	var obj = document.createElement("div");
	obj.setAttribute("id", "dialog");
	obj.setAttribute("class", "toolTipDiv1");
	obj.title = "Review Details";
	obj.innerHTML = "";
	obj.innerHTML = tooltipContent;
	obj.style.fontSize = this.fontScaling(this.m_xAxis.m_labelfontsize * 1) + "px";
	obj.style.fontFamily = selectGlobalFont(this.m_xAxis.m_labelfontfamily);
	obj.style.fontWeight = this.m_xAxis.m_labelfontweight;
	//obj.style.fontStyle = this.m_xAxis.m_labelfontstyle;
	//obj.style.top =  100 + "px";
	obj.style.zIndex = 999;
	document.body.appendChild(obj);
	//$("#draggableDiv"+temp.m_objectid).append(obj);
	$("#dialog").dialog();
};

/** @description OnClicking the comment open the dialog box**/
SentimentPlotChart.prototype.getDataPointAndUpdateGlobalVariable = function (mouseX, mouseY) {
	var map = this.getDrillDataPoints(mouseX, mouseY);
	if(IsBoolean(this.m_showtweetsinmodel)){
		this.getDialogBoxes(mouseX,mouseY);
	}
	this.updateDataPointsToGV(map);
};

/** @description Creating Dialog Box**/
SentimentPlotChart.prototype.getDialogBoxes = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && !this.m_designMode) {
		var numOfTweets = this.getTweetNumAtThatRange(mouseX, mouseY);
		this.drawDialogBox(numOfTweets, mouseX, mouseY);
	}
};

/** @description Getting Drilled Points and Drilled data**/
SentimentPlotChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && !this.m_designMode) {
		var numOfTweets = this.getTweetNumAtThatRange(mouseX, mouseY);
		if (this.getGlobalKey() != "") {
			var fieldNameValueMap = this.getDataProvider()[numOfTweets[numOfTweets.length - 1]];
			var drillColor = "";
			if (fieldNameValueMap != undefined)
				return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
		}
	}
};

/** @description Getting all tweets which are in the range**/
SentimentPlotChart.prototype.getTweetNumAtThatRange = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries)) {
		var tweentNum = [];
		this.xPositionArr = this.m_calculation.getXPixelArray();
		this.yAxisDataArray = this.m_calculation.getYPixelArray();

		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			for (var i = 0; i < this.xPositionArr.length; i++) //2
			{
				for (var k = 0; k < this.xPositionArr[i].length; k++) {
					if (mouseX <= (this.xPositionArr[i][k] * 1 + this.plotRadiusArr[k] * 1) && (mouseX >= this.xPositionArr[i][k] * 1 - this.plotRadiusArr[k] * 1) && (mouseY <= (this.yAxisDataArray[i][k] * 1 + this.plotRadiusArr[k] * 1)) && (mouseY >= (this.yAxisDataArray[i][k] * 1 - this.plotRadiusArr[k] * 1))) {
						tweentNum.push(k);
					}
				}
			}
		}
		return tweentNum;
	}
};
/** @description Gathering attributes for Creating dialog Box**/
SentimentPlotChart.prototype.drawDialogBox = function (twID, mouseX, mouseY) {
	var temp = this;
	var infoBtnId; // Dialog's button ID
	var infoDivId; // Dialog's div ID
	var infoTxtId; // Dialog's label ID
	var tweet; // Current tweet object
	var txt; // Text for current tweet
	var dlgX = 5; // Current x-offset of dialog in canvas
	var dlgY = 5; // Current x-offset of dialog in canvas

	var scrollLeft = $("#WatermarkDiv").scrollLeft();
	var scrollTop = $("#WatermarkDiv").scrollTop();
	var offsetLeft = ($("#draggableDiv" + this.m_objectid)[0].offsetLeft) * 1;
	var offsetTop = ($("#draggableDiv" + this.m_objectid)[0].offsetTop) * 1;
	if (twID.length == 0) {
		return; // No tweets under mouse?
	}

	var canvas = $("#draggableCanvas" + this.m_objectid);
	var w = this.m_width;
	var h = this.m_height - 40;

	for (var i = 0; i < twID.length; i++) {
		infoDivId = "div-" + sentimentInfo.infoID; // Build IDs
		infoTxtId = "txt-" + sentimentInfo.infoID;
		infoBtnId = "btn-" + sentimentInfo.infoID;
		var x = this.m_x + 200 + dlgX + offsetLeft * 1;
		var y = this.m_y + 100 + dlgY + offsetTop * 1;

		// Populate dialog with tweet's formatted text
		tweet = this.m_tooltipsentiment[twID[i]];

		var txt = "";
		for (var j = 0; j < tweet.length; j++) {
			txt = txt + "<div class='sentimentTweetDiv'><p>" + tweet[j] + "</p></div>";
		}

		temp.createDailogBox(x, y, infoDivId, infoTxtId, infoBtnId, txt);
		sentimentInfo.infoID++; // Increment to next ID
		if (i > twID.length - 25) {
			//check to restrict number of open div to show .. if many divs are there , they will draw on same coordinates
			dlgX += 5;
			dlgY += 1;
		}
	}
};

/** @description Creating Dialog Box**/
SentimentPlotChart.prototype.createDailogBox = function (x, y, infoDivId, infoTxtId, infoBtnId, txt) {
	var temp = this;
	var dailogboxDiv = temp.createDiv(infoDivId, x, y, 375, 120);
	dailogboxDiv.setAttribute("class", "dailogboxDiv");
	dailogboxDiv.style.background = "#e2e2e2";
	dailogboxDiv.style.zIndex = "1000";
	$(".draggablesParentDiv").append(dailogboxDiv);

	$("#" + infoDivId).draggable({
		containment : $(".draggablesParentDiv"),
		ghost : true,
		cancel : false,
		stop : function (event, ui) {},
		drag : function (event, ui) {}
	});

	var dataContainerDiv = temp.createDiv(infoTxtId, 1, 1, 348, 118);
	dataContainerDiv.style.fontFamily = selectGlobalFont(this.m_xAxis.m_labelfontfamily);
	dataContainerDiv.style.position = "absolute";
	dataContainerDiv.style.fontSize = temp.fontScaling(12) + "px";
	dataContainerDiv.style.color = "#000000";
	dataContainerDiv.style.background = "#FFFFFF";
	dataContainerDiv.style.overflow = "auto";
	$("#" + infoDivId).append(dataContainerDiv);

	var headerDiv = temp.createDiv("headerDiv" + infoDivId, 350, 1, 25, 118);
	headerDiv.style.borderBottom = "1px solid #cccccc";
	$("#" + infoDivId).append(headerDiv);

	var cancel = temp.cancelButton(infoBtnId, infoDivId);
	$("#headerDiv" + infoDivId).append(cancel);

	var cancelAll = temp.cancelAllButton();
	$("#headerDiv" + infoDivId).append(cancelAll);

	dataContainerDiv.innerHTML = txt;
};

/** @description Creating Div and returning div**/
SentimentPlotChart.prototype.createDiv = function (id, x, y, width, height) {
	var newDiv = document.createElement("div");
	newDiv.setAttribute("id", id);
	newDiv.style.width = width + "px";
	newDiv.style.height = height + "px";
	newDiv.style.position = "absolute";
	newDiv.style.top = y + "px";
	newDiv.style.left = x + "px";
	newDiv.style.borderRadius = "2px";
	return newDiv;
};

/** @description Creating Cancel Button and attaching event**/
SentimentPlotChart.prototype.cancelButton = function (id, infoId) {
	var cancel = document.createElement("span");
	cancel.setAttribute("id", id);
	cancel.setAttribute("class", "icon bd-close")
	cancel.style.width = "25px";
	cancel.style.height = "25px";
	cancel.style.right = "0px";
	cancel.style.top = "5px";
	cancel.style.cursor = "pointer";
	cancel.style.textAlign = "center";
	cancel.style.position = "absolute";
	cancel.title = "Close";
	cancel.onclick = function () {
		$("#" + infoId).remove();
	};

	$(cancel).on("touchstart", function (ev) {
		$("#" + infoId).remove();
	});
	return cancel;
};

/** @description Creating Cancel All Button**/
SentimentPlotChart.prototype.cancelAllButton = function () {
	var cancelAll = document.createElement("span");
	cancelAll.setAttribute("class", "icon bd-delete-all")
	cancelAll.value = "Close All";
	cancelAll.style.height = "25px";
	cancelAll.style.width = "25px";
	cancelAll.style.right = "0px";
	cancelAll.style.top = "35px";
	cancelAll.style.cursor = "pointer";
	cancelAll.style.textAlign = "center";
	cancelAll.style.position = "absolute";
	cancelAll.title = "Close All";
	cancelAll.onclick = function () {
		$(".dailogboxDiv").remove();
	};

	$(cancelAll).on("touchstart", function (ev) {
		$(".dailogboxDiv").remove();
	});
	return cancelAll;
};

/** @description Close All dialog Box**/
SentimentPlotChart.prototype.closeAllInfoDlg = function () {
	for (var i = 0; i < sentimentInfo.dialogBoxes.length; i++) {
		sentimentInfo.dialogBoxes[i].dialog("destroy").remove();
	}
	sentimentInfo.dialogBoxes.splice(0, sentimentInfo.dialogBoxes.length); // Clear active dialog list
};

/** @description Close individual dialog box**/
SentimentPlotChart.prototype.closeIndividualInfoDlg = function (tgDlg) {
	var id = this.getDlgID(tgDlg); // Get target dialog's ID
	for (var i = 0; i < sentimentInfo.dialogBoxes.length; i++) {
		// Remove reference in dialog array
		if (this.getDlgID(sentimentInfo.dialogBoxes[i]) == id) {
			sentimentInfo.dialogBoxes.splice(i, 1);
			break;
		}
	}
	tgDlg.dialog("destroy").remove();
};

/** @description Get dialog's unique ID //tgDlg: Dialog to close**/
SentimentPlotChart.prototype.getDlgID = function (tgDlg) {
	var htmlStr = tgDlg[0].innerHTML; // Dialog's HTML
	var beg = htmlStr.indexOf("txt-") + 4; // Beginning of ID string
	var end = htmlStr.substr(beg).indexOf("\""); // End of ID string

	return htmlStr.substr(beg, end);
};

/** @description Getter for chart Type Names**/
SentimentPlotChart.prototype.getChartTypeNames = function () {
	var fieldNames = [];
	var shapeNames = ["point", "quad", "triangle", "cross", "cube"];
	for (var i = 0, count = 0; i < this.getSeriesData().length; i++) {
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

/** @description Transforming 2D Array**/
SentimentPlotChart.prototype.initializeSeriesValues = function () {
	var arr = [];
	for (var i = 0; i < this.m_seriesData[0].length; i++) {
		arr[i] = [];
		for (var j = 0; j < this.m_seriesData.length; j++) {
			arr[i][j] = this.m_seriesData[j][i];
		}
	}
	this.m_seriesData = arr;
};

/** @description Initialization of category Values**/
SentimentPlotChart.prototype.initializeCategoryValues = function () {
	var arr = [];
	for (var i = 0; i < this.m_categoryData[0].length; i++) {
		arr[i] = [];
		for (var j = 0; j < this.m_categoryData.length; j++) {
			arr[i][j] = this.m_categoryData[j][i];
		}
	}
	this.m_categoryData = arr;
};

/** @description Creation of SentimentPlotChartCalculation class**/
function SentimentPlotChartCalculation() {
	this.m_xAxisMarkersArray = [];
	this.m_yAxisMarkersArray = [];
	this.m_xPixelArray = [];
	this.m_yPixelArray = [];
	this.m_xMax = 0;
	this.m_xRatio = 0;
	this.m_yRatio = 0;
	this.m_yMax = 0;
	this.m_yAxisText = 1;
	this.m_noOfXAxisMarkers = 5;
	this.m_noOfYAxisMarkers = 5;
	this.m_axisToChartMargin = 5;
};

/** @description Initialization of SentimentPlotChartCalculation**/
SentimentPlotChartCalculation.prototype.init = function (m_chart, m_categoryData, m_seriesData) {
	this.m_chart = m_chart;

	this.m_calculation = this.m_chart.m_calculation;
	this.m_categoryData = m_categoryData;
	this.m_seriesData = m_seriesData;
	this.startX = this.m_chart.getStartX();
	this.startY = this.m_chart.getStartY();
	this.endX = this.m_chart.getEndX();
	this.endY = this.m_chart.getEndY();

	this.setXRatio();
	this.setYRatio();
	this.setXPixelArray();
	this.setYPixelArray();
};

/** @description Setter for X Axis Ratio**/
SentimentPlotChartCalculation.prototype.setXRatio = function () {
	this.m_xRatio = (this.endX - this.startX) / 8;
};

/** @description Setter for Y Axis Ratio**/
SentimentPlotChartCalculation.prototype.setYRatio = function () {
	this.m_yRatio = (this.startY - this.endY) / 8;
};

/** @description Setter for X Pixel Array**/
SentimentPlotChartCalculation.prototype.setXPixelArray = function () {
	this.m_xPixelArray = [];
	for (var i = 0; i < this.m_categoryData.length; i++) //2
	{
		this.m_xPixelArray[i] = [];
		for (var j = 0; j < this.m_categoryData[i].length; j++) //8
		{
			this.m_xPixelArray[i][j] = this.startX * 1 + (this.m_categoryData[i][j] - this.getMinValue() * 1) * this.m_xRatio;
		}
	}
};

/** @description Getter for X Pixel Array**/
SentimentPlotChartCalculation.prototype.getXPixelArray = function () {
	return this.m_xPixelArray;
};

/** @description Setter for Y Pixel Array**/
SentimentPlotChartCalculation.prototype.setYPixelArray = function () {
	this.m_yPixelArray = [];
	for (var i = 0; i < this.m_seriesData.length; i++) //2
	{
		this.m_yPixelArray[i] = [];
		for (var j = 0; j < this.m_seriesData[i].length; j++) //8
		{
			this.m_yPixelArray[i][j] = this.startY * 1 - (this.m_seriesData[i][j] - this.getMinValue() * 1) * this.m_yRatio;
		}
	}
};

/** @description Getter for minimum value**/
SentimentPlotChartCalculation.prototype.getMinValue = function () {
	return 1;
};

/** @description Getter for Y Pixel Array**/
SentimentPlotChartCalculation.prototype.getYPixelArray = function () {
	return this.m_yPixelArray;
};

/** @description Creation of SentimentShapeSeries class**/
function SentimentShapeSeries() {
	this.color;
	this.xPositionArray = [];
	this.yPositionArray = [];

	this.common = [];
	this.shape;
	this.plotradius;
	this.m_chart;
};

/** @description SentimentShapeSeries class initialization**/
SentimentShapeSeries.prototype.init = function (color, xPositionArray, yPositionArray, shape, plotradius, m_chart) {
	this.color = color;
	this.xPositionArray = xPositionArray;
	this.yPositionArray = yPositionArray;
	this.shape = shape;
	this.plotradius = plotradius;
	this.m_chart = m_chart;
	for (var i = 0; i < this.xPositionArray.length; i++) {
		this.common[i] = new SentimentShape();
		this.common[i].init(this.color[i], this.xPositionArray[i], this.yPositionArray[i], this.shape, this.plotradius[i], this.m_chart);
	}
};

/** @description Draw Sentiment Shape Series**/
SentimentShapeSeries.prototype.drawSentimentShapeSeries = function () {
	try {
		this.drawSentimentShapes(0);
	} catch (e) {
		console.log("error in calculation of Plot")
	}
};

/** @description Draw Sentiment Shapes**/
SentimentShapeSeries.prototype.drawSentimentShapes = function (indexLimit) {
	var temp = this;
	var xPositionArray = this.xPositionArray;
	for (var i = indexLimit*temp.m_chart.m_chunkdatalimit; i < xPositionArray.length; i++) {
		if(i<(indexLimit+1)*temp.m_chart.m_chunkdatalimit){
			if(IsBoolean(temp.checkValidPoints(this.xPositionArray[i], this.yPositionArray[i])))
				temp.common[i].draw();
		} else {
			setTimeout(function () {
				if(++indexLimit*temp.m_chart.m_chunkdatalimit < xPositionArray.length)
					temp.drawSentimentShapes(indexLimit);
			}, temp.m_chart.m_chunkdatatimeout);
			break;
		}
	}
};

/** @description Taking x,y and checking is it inside the given area ,if yes return true else return false**/
SentimentShapeSeries.prototype.checkValidPoints = function (x, y) {
	// remove parseInt because radiusX and radiusY value was not calculating properly.
	var radiusX = (this.m_chart.m_width/2) - (this.m_chart.m_chartMargin*1);
	var radiusY = (this.m_chart.m_height/2) - (this.m_chart.m_chartMargin*1);
	var centerX = (this.m_chart.m_width/2);
	var centerY = (this.m_chart.m_height/2);
	
	//formula :- (x-centerX)^2 / radiusX^2 + (y-centerY)^2 / 2 <= 1;
	var radiusYSquare = radiusY*radiusY;
	var radiusXSquare = radiusX*radiusX;
	var part1 = (Math.pow((x-centerX), 2))/radiusXSquare;
	var part2 = (Math.pow((y-centerY), 2))/radiusYSquare;
	
	var checkedValue = part1 + part2;
	
	var validPointFlag = false;
	if(checkedValue <= 1)
		validPointFlag = true;
	
	return validPointFlag;
};
 
/** @description Checking value is in range or not**/ 
SentimentShapeSeries.prototype.isInRange = function (i) {
	var startY = this.m_chart.getStartY();
	var endY = this.m_chart.getEndY();
	var startX = this.m_chart.getStartX();
	var endX = this.m_chart.getEndX();
	if ((this.xPositionArray[i] > startX && this.xPositionArray[i] < endX) && (this.yPositionArray[i] < startY && this.yPositionArray[i] > endY))
		return true;
	else
		return false;
};

/** @description Creation of SentimentShapeSeries class**/
function SentimentShape() {
	this.color;
	this.xPosition;
	this.yPosition;
	this.s;
	this.plotradius = 3;
	this.ctx = "";
};

/** @description Initializing SentimentShape class **/
SentimentShape.prototype.init = function (color, xPosition, yPosition, sentimentShape, plotradius, m_chart) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.color = color;
	this.xPosition = xPosition;
	this.yPosition = yPosition;
	this.s = sentimentShape;
	this.plotradius = plotradius;
};

/** @description Starting Drawing of shape**/
SentimentShape.prototype.draw = function () {
	//this.drawPoint();
	if (this.m_chart.m_chartbase == undefined || this.m_chart.m_chartbase == "plane")
		this.drawPlainPoint();
	else
		this.drawGradientPoint();
};

/** @description Drawing of Point**/
SentimentShape.prototype.drawPlainPoint = function () {
	this.ctx.beginPath();
	this.ctx.strokeStyle = "rgb(192, 192, 192)";
	this.ctx.fillStyle = this.color;
	this.ctx.arc(this.xPosition, this.yPosition, this.plotradius, 0, Math.PI * 2, false);
	this.ctx.stroke();
	this.ctx.fill();
	this.ctx.closePath();
}

/** @description Drawing of Gradient Point**/
SentimentShape.prototype.drawGradientPoint = function () {
	this.ctx.beginPath();

	var luminanceColor = this.getColorValue();
	var x = this.xPosition;
	var y = this.yPosition;
	var r = this.plotradius;
	var gradient = this.color;
	var innerRadius = (r * 2) / 100;
	var outerRadius = r;
	try {

		gradient = this.ctx.createRadialGradient(x - r / 2, y - r / 2, innerRadius, x, y, outerRadius);
		gradient.addColorStop(0, this.color);
		gradient.addColorStop(1, (luminanceColor));

		/*gradient = this.ctx.createLinearGradient(x-r/2,y-r/2,   x+r/2,y+r/2);
		gradient.addColorStop(0.7, this.color);
		gradient.addColorStop(0, luminanceColor);*///=> staments are comment due to Bug #11033(Text Analyzer not showing total circles for sentiments plotted)
	} catch (e) {
		console.log(e);
	}
	this.ctx.strokeStyle = this.color;
	this.ctx.fillStyle = gradient;
	this.ctx.arc(this.xPosition, this.yPosition, this.plotradius, 0, Math.PI * 2, false);
	this.ctx.fill();
	this.ctx.stroke();
	this.ctx.closePath();
};

/** @description Getter for color value**/
SentimentShape.prototype.getColorValue = function () {
	this.color = (this.color == undefined) ? "#993366" : this.color;
	var luminanceColor = ColorLuminance(rgb2hex(this.color), 0.6);
	luminanceColor = (this.color == luminanceColor) ? hex2rgb(this.color, 0.3) : luminanceColor;
	return luminanceColor;
};

/*SentimentShape.prototype.drawPoint=function(){
this.ctx.beginPath();
this.ctx.strokeStyle = "rgb(192, 192, 192)";
this.ctx.fillStyle = this.color;
this.ctx.arc(this.xPosition,this.yPosition,this.plotradius,0,Math.PI*2,false);
this.ctx.stroke();
this.ctx.fill();
this.ctx.closePath();
};
 */
//Combined hue-luminance path (luminanceNum slices, stepPerHue values per
//10 Munsell hues in each slice)
var colorPath = [
	[
		// Black
		[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
		[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
		[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
		[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
		[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
		[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
		[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
		[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
		[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
		[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]
	],
	[//  Lum: 1, Saturation: 2
		[5, 1, 5], [5, 1, 4], [6, 1, 4], [6, 1, 4], //  RP
		[6, 1, 3], [6, 1, 3], [6, 1, 2], [6, 1, 2], //  R
		[6, 1, 1], [6, 2, 1], [6, 2, 1], [5, 2, 0], //  YR
		[5, 2, 0], [4, 2, 0], [4, 3, 0], [3, 3, 0], //  Y
		[3, 3, 1], [2, 3, 1], [2, 3, 2], [2, 3, 2], //  GY
		[1, 3, 2], [1, 3, 2], [1, 3, 3], [1, 3, 3], //  G
		[1, 3, 3], [1, 3, 4], [1, 3, 4], [1, 3, 4], //  BG
		[1, 3, 5], [1, 3, 5], [1, 3, 6], [1, 3, 6], //  B
		[1, 3, 6], [2, 2, 6], [2, 2, 6], [3, 2, 6], //  PB
		[4, 2, 6], [4, 2, 6], [4, 2, 6], [5, 1, 5]//  P
	],
	[//  Lum: 2, Saturation: 4
		[15, 4, 13], [16, 4, 11], [17, 4, 10], [17, 4, 9], //  RP
		[18, 4, 8], [18, 4, 6], [18, 4, 5], [18, 4, 4], //  R
		[18, 4, 3], [17, 5, 2], [16, 5, 1], [15, 6, 1], //  YR
		[13, 6, 0], [12, 7, 0], [10, 7, 0], [9, 8, 0], //  Y
		[7, 8, 0], [6, 9, 1], [4, 9, 2], [3, 9, 4], //  GY
		[2, 10, 5], [2, 10, 6], [2, 10, 7], [1, 10, 8], //  G
		[1, 10, 9], [0, 10, 11], [0, 10, 12], [0, 9, 14], //  BG
		[0, 9, 15], [0, 9, 17], [1, 9, 18], [1, 8, 19], //  B
		[3, 8, 20], [4, 7, 20], [6, 6, 20], [8, 6, 19], //  PB
		[10, 5, 18], [11, 5, 17], [13, 5, 16], [14, 4, 14]//  P
	],
	[//  Lum: 3, Saturation: 4
		[30, 10, 24], [32, 10, 21], [33, 10, 19], [34, 10, 16], //  RP
		[35, 10, 14], [35, 10, 12], [35, 10, 10], [35, 10, 9], //  R
		[34, 11, 7], [32, 12, 6], [30, 13, 5], [28, 13, 4], //  YR
		[26, 14, 3], [23, 15, 3], [21, 16, 3], [19, 17, 3], //  Y
		[16, 18, 3], [14, 19, 4], [11, 19, 6], [9, 20, 9], //  GY
		[7, 20, 11], [6, 20, 13], [5, 20, 14], [4, 21, 16], //  G
		[4, 20, 19], [3, 20, 21], [3, 20, 24], [2, 20, 27], //  BG
		[3, 20, 30], [3, 19, 32], [4, 18, 34], [6, 18, 35], //  B
		[8, 17, 36], [10, 16, 37], [14, 14, 37], [17, 13, 36], //  PB
		[20, 12, 35], [23, 12, 33], [25, 11, 30], [28, 11, 28]//  P
	],
	[//  Lum: 4, Saturation: 6
		[58, 18, 46], [62, 17, 39], [65, 17, 33], [67, 17, 29], //  RP
		[68, 17, 25], [69, 17, 20], [70, 17, 17], [69, 18, 13], //  R
		[67, 19, 10], [63, 21, 7], [60, 22, 5], [55, 24, 3], //  YR
		[50, 26, 2], [45, 28, 1], [40, 30, 1], [36, 32, 1], //  Y
		[30, 34, 1], [25, 35, 3], [18, 37, 7], [13, 39, 10], //  GY
		[8, 40, 17], [6, 40, 22], [4, 40, 25], [3, 40, 29], //  G
		[2, 40, 34], [0, 40, 40], [0, 39, 46], [0, 38, 52], //  BG
		[0, 38, 58], [2, 36, 63], [5, 35, 67], [8, 33, 69], //  B
		[13, 31, 71], [17, 30, 72], [25, 27, 72], [32, 25, 70], //  PB
		[37, 23, 66], [42, 22, 62], [48, 20, 57], [53, 19, 52]//  P
	],
	[//  Lum: 5, Saturation: 6
		[86, 34, 70], [92, 33, 61], [96, 33, 54], [99, 32, 48], //  RP
		[101, 32, 43], [102, 33, 37], [103, 33, 32], [102, 34, 26], //  R
		[100, 35, 21], [96, 37, 17], [92, 39, 13], [86, 42, 10], //  YR
		[79, 45, 7], [72, 47, 6], [65, 50, 5], [59, 52, 5], //  Y
		[51, 55, 7], [44, 57, 10], [34, 60, 16], [28, 61, 22], //  GY
		[21, 63, 31], [17, 63, 38], [15, 64, 43], [13, 63, 49], //  G
		[12, 63, 54], [10, 63, 63], [9, 62, 70], [8, 62, 79], //  BG
		[9, 60, 86], [12, 59, 93], [16, 56, 98], [20, 54, 101], //  B
		[27, 52, 104], [33, 49, 105], [43, 46, 105], [52, 43, 103], //  PB
		[59, 41, 98], [66, 39, 92], [74, 37, 85], [80, 35, 78]//  P
	],
	[//  Lum: 6, Saturation: 8
		[138, 50, 108], [148, 48, 92], [153, 48, 81], [157, 47, 71], //  RP
		[161, 47, 62], [163, 47, 53], [165, 48, 44], [164, 49, 34], //  R
		[160, 52, 27], [153, 55, 19], [144, 59, 14], [134, 63, 9], //  YR
		[123, 68, 6], [111, 72, 3], [100, 77, 2], [91, 80, 2], //  Y
		[78, 85, 3], [65, 89, 7], [49, 94, 15], [37, 97, 26], //  GY
		[25, 99, 42], [18, 100, 54], [14, 100, 63], [11, 100, 72], //  G
		[8, 100, 82], [5, 100, 96], [3, 99, 108], [2, 97, 123], //  BG
		[3, 95, 138], [7, 92, 152], [14, 88, 160], [23, 84, 166], //  B
		[34, 80, 170], [45, 75, 172], [62, 70, 169], [77, 65, 164], //  PB
		[90, 61, 158], [102, 58, 148], [117, 54, 134], [128, 52, 122]//  P
	],
	[//  Lum: 7, Saturation: 8
		[189, 76, 149], [201, 74, 129], [207, 73, 116], [213, 73, 102], //  RP
		[217, 72, 91], [220, 73, 80], [223, 73, 67], [221, 75, 55], //  R
		[215, 79, 45], [205, 83, 35], [195, 88, 28], [182, 94, 21], //  YR
		[169, 99, 16], [153, 105, 13], [141, 110, 11], [129, 114, 11], //  Y
		[114, 120, 14], [98, 125, 19], [77, 131, 30], [61, 135, 44], //  GY
		[45, 139, 64], [36, 140, 81], [31, 140, 92], [27, 140, 103], //  G
		[23, 140, 115], [19, 139, 131], [17, 138, 147], [16, 136, 166], //  BG
		[18, 133, 183], [23, 129, 200], [30, 125, 212], [41, 120, 220], //  B
		[56, 114, 226], [70, 109, 229], [91, 101, 229], [110, 95, 223], //  PB
		[126, 90, 212], [140, 87, 200], [161, 82, 181], [175, 78, 166]//  P
	],
	[//  Lum: 8, Saturation: 4
		[196, 130, 179], [202, 129, 169], [207, 128, 162], [211, 128, 154], //  RP
		[214, 127, 147], [217, 127, 140], [220, 127, 131], [222, 128, 122], //  R
		[220, 129, 112], [216, 132, 104], [210, 135, 97], [202, 139, 89], //  YR
		[193, 143, 84], [182, 147, 80], [176, 150, 78], [169, 152, 78], //  Y
		[158, 156, 81], [150, 158, 85], [132, 164, 96], [120, 166, 108], //  GY
		[109, 169, 123], [102, 169, 135], [99, 170, 143], [96, 170, 152], //  G
		[93, 170, 159], [92, 169, 169], [92, 168, 180], [91, 167, 190], //  BG
		[93, 165, 199], [98, 162, 208], [104, 159, 213], [113, 155, 218], //  B
		[123, 151, 220], [132, 148, 221], [144, 144, 220], [153, 141, 217], //  PB
		[163, 138, 214], [170, 136, 209], [183, 132, 197], [190, 131, 188]//  P
	],
	[//  Lum: 9, Saturation: 2
		[226, 187, 226], [229, 187, 222], [231, 187, 219], [233, 186, 215], //  RP
		[232, 187, 213], [236, 186, 208], [238, 186, 203], [240, 186, 199], //  R
		[242, 186, 191], [243, 187, 181], [242, 188, 173], [238, 191, 165], //  YR
		[233, 193, 160], [227, 196, 157], [222, 198, 155], [218, 199, 154], //  Y
		[212, 201, 156], [205, 203, 158], [192, 207, 168], [182, 209, 178], //  GY
		[174, 211, 189], [170, 211, 197], [167, 211, 204], [166, 211, 210], //  G
		[165, 211, 215], [165, 210, 221], [165, 209, 229], [167, 208, 234], //  BG
		[171, 206, 239], [176, 204, 242], [182, 201, 244], [186, 200, 245], //  B
		[193, 197, 245], [197, 196, 245], [203, 193, 244], [208, 192, 243], //  PB
		[211, 191, 242], [214, 190, 240], [220, 189, 234], [223, 188, 230]//  P
	],
	[
		// White
		[255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255],
		[255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255],
		[255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255],
		[255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255],
		[255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255],
		[255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255],
		[255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255],
		[255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255],
		[255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255],
		[255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255]
	]
];
//# sourceURL=SentimentPlotChart.js