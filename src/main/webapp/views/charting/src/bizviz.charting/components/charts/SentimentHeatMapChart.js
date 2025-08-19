/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: SentimentHeatMapChart.js
 * @description SentimentHeatMapChart
 **/
function SentimentHeatMapChart(m_chartContainer, m_zIndex) {
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

	this.m_yPositionArray = [];
	this.m_calculation = new SentimentHeatMapChartCalculation();
	this.m_xAxis = new Xaxis();
	this.m_yAxis = new Yaxis();

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;

	this.noOfRows = 1; //used for set x-axis text into two rows in non tilted case.

	this.m_chartMargin = 50;
	this.m_reviews = 0;
	this.fq_hist = [// Term frequency histogram
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0]
	];
};

var fq_hist_max = 0; // Term frequency maximum
var fq_hist_min = 0; // Term frequency minimum
var fq_hist_n = 0; // Number of non-zero term fq's
var fq_hist_avg = 0; // Term frequency average

SentimentHeatMapChart.prototype = new Chart();

SentimentHeatMapChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas(); //create draggable div
};

SentimentHeatMapChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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

SentimentHeatMapChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};
SentimentHeatMapChart.prototype.refineSentimentPlotData = function () {
	var dp = [];
	this.origionalDPLength = this.getDataProvider().length;
	for (var i = 0; i < this.getDataProvider().length; i++) {
		var x = this.getDataProvider()[i];
		if (x !== undefined && x !== null && x !== 'null' && x !== "")
			dp.push(x);
	}
	this.m_dataProvider = [];
	this.m_dataProvider = dp;
};
SentimentHeatMapChart.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	this.setCategory(fieldsJson);
	this.setSeries(fieldsJson);
	this.setAllFieldNames();
};

SentimentHeatMapChart.prototype.setAllFieldNames = function () {
	var fieldNames = [];
	this.m_allfieldsName = [];
	for (var i = 0; i < this.nameArr.length; i++) {
		fieldNames.push(this.nameArr[i]);
		if (this.otherFieldArr[i] != '')
			fieldNames.push(this.otherFieldArr[i]);
	}
	fieldNames = this.getUniqueValueFromArray(fieldNames);
	this.m_allfieldsName = fieldNames;
};

SentimentHeatMapChart.prototype.getFieldbyYFields = function () {
	//seriesNames
	var fieldNames = [];
	for (var i = 0; i < this.nameArr.length; i++) {
		if (this.typeArr[i] == 'YField' && this.otherFieldArr[i] != '') {
			fieldNames.push(this.nameArr[i]);
		} else if (this.typeArr[i] == 'XField' && this.otherFieldArr[i] != '') {
			fieldNames.push(this.otherFieldArr[i]);
		}
	}
	return fieldNames;
};

SentimentHeatMapChart.prototype.getFieldbyYFieldsDisplayName = function () {
	//seriesDisplayNames
	var fieldNames = [];
	for (var i = 0; i < this.seriesNameArr[i].length; i++) {
		if (this.typeArr[i] == 'YField' && this.otherFieldArr[i] != '') {
			fieldNames.push(this.displayFieldArr[i]);
		} else if (this.typeArr[i] == 'XField' && this.otherFieldArr[i] != '') {
			fieldNames.push(this.displayFieldArr[i]);
		}
	}
	return fieldNames;
};

SentimentHeatMapChart.prototype.getUniqueValueFromArray = function (a) {
	var temp = {};
	for (var i = 0; i < a.length; i++)
		temp[a[i]] = true;
	var r = [];
	for (var k in temp)
		r.push(k);
	return r;
};

SentimentHeatMapChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	for (var i = 0; i < categoryJson.length; i++) {
		var type = this.getProperAttributeNameValue(categoryJson[i], "Type");
		var otherField = this.getProperAttributeNameValue(categoryJson[i], "OtherField");

		if (type == 'YField' && otherField != '') {
			this.m_categoryNames.push(otherField);
		} else if (type == 'XField' && otherField != '') {
			this.m_categoryNames.push(this.getProperAttributeNameValue(categoryJson[i], "Name"));
		}
	}
};

SentimentHeatMapChart.prototype.getOtherFields = function () {
	var fieldNames = [];
	for (var i = 0; i < this.nameArr.length; i++) {
		if (this.typeArr[i] == 'YField' && this.otherFieldArr[i] != '') {
			fieldNames.push(this.otherFieldArr[i]);
		} else if (this.typeArr[i] == 'XField' && this.otherFieldArr[i] != '') {
			fieldNames.push(this.nameArr[i]);
		}
	}
	//fieldNames = this.getUniqueValueFromArray(fieldNames);
	return fieldNames;
};

SentimentHeatMapChart.prototype.getCategoryNames = function () {
	var categoryNames = this.getOtherFields();
	return categoryNames;
};

SentimentHeatMapChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

SentimentHeatMapChart.prototype.setSeries = function (seriesJson) {
	this.nameArr = [];
	this.otherFieldArr = [];
	this.legendArr = [];
	this.displayNamesArr = [];
	this.colorArr = [];
	this.plotRadiusArr = [];
	this.typeArr = [];

	for (var i = 0; i < seriesJson.length; i++) {
		this.nameArr[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		this.otherFieldArr[i] = this.getProperAttributeNameValue(seriesJson[i], "OtherField");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.displayNamesArr[i] = m_formattedDisplayName;
		this.colorArr[i] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));
		//this.plotRadiusArr[i] = this.getProperAttributeNameValue(seriesJson[i],"PlotRadius");
		this.typeArr[i] = this.getProperAttributeNameValue(seriesJson[i], "Type");
		if (this.typeArr[i] != 'Category'){
			this.m_showSeries[i] = this.getProperAttributeNameValue(seriesJson[i], "visible");
		}
	}
};

SentimentHeatMapChart.prototype.getSeriesNames = function () {
	var seriesNames = this.getFieldbyYFields();
	return seriesNames;

};

SentimentHeatMapChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};

SentimentHeatMapChart.prototype.getSeriesColors = function () {};

SentimentHeatMapChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
};

SentimentHeatMapChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

SentimentHeatMapChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0; i < this.getSeriesNames().length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
};

SentimentHeatMapChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

SentimentHeatMapChart.prototype.setSeriesColor = function (m_seriesColor) {
	this.m_seriesColor = m_seriesColor;
};

SentimentHeatMapChart.prototype.getSeriesColor = function () {
	return this.m_seriesColor;
};

SentimentHeatMapChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};

SentimentHeatMapChart.prototype.getLegendNames = function () {
	this.m_legendNames = this.displayNamesArr;
	return this.m_legendNames;
};

SentimentHeatMapChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getCategoryNames()[i]);
	}
	for (var j = 0; j < this.getSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getSeriesNames()[j]);
	}
};

SentimentHeatMapChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

SentimentHeatMapChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

SentimentHeatMapChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

SentimentHeatMapChart.prototype.getType = function () {
	return this.m_fieldType;
};

SentimentHeatMapChart.prototype.getOtherField = function () {
	return this.m_otherFields;
};

SentimentHeatMapChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

SentimentHeatMapChart.prototype.init = function () {
	this.refineSentimentPlotData();
	this.setCategoryData();
	this.setSeriesData();

	this.m_chartTypeNames = this.getChartTypeNames();

	//this.isSeriesDataEmpty();
	this.m_seriesNames = this.getSeriesNames();
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);

	//if(!IsBoolean(this.m_isEmptySeries ) && !IsBoolean(this.isEmptyCategory() ))
	{
		this.m_calculation.init(this, this.getCategoryData(), this.getSeriesData());
		for (var i = 0; i < this.m_seriesData.length; i++) {}
	}
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};

SentimentHeatMapChart.prototype.isEmptyCategory = function () {
	if (this.getCategoryNames() != "" && this.m_categoryData.length != 0)
		return false;
	else
		return true;
};

SentimentHeatMapChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();

	//var canvas = $("#draggableCanvas" + this.m_objectid);
	var w = this.m_width;
	var h = this.m_height;
	this.drawHeatMapAxis(w, h);

	//if(!IsBoolean(this.m_isEmptySeries )&& !IsBoolean(this.isEmptyCategory() ))
	{
		this.updateDataInHeatMapHist();
	}
	this.drawSentimentHeatMapLegend();
	this.drawSentimentHeatMapChart(w, h);
};

SentimentHeatMapChart.prototype.drawSentimentHeatMapLegend = function () {
	var w = this.m_width;
	var h = this.m_height;

	var gradient = this.color;
	try {
		gradient = this.ctx.createLinearGradient(this.m_chartMargin / 4, h - this.m_chartMargin, this.m_chartMargin / 4, this.m_chartMargin);
		gradient.addColorStop(0, "rgba(19, 54, 231,1)");
		gradient.addColorStop(0.5, "rgba(193, 196, 214,1)");
		//gradient.addColorStop(0.5, "rgba(19, 54, 231,1)");
		gradient.addColorStop(1, "rgba(223, 14, 14,1)");
	} catch (e) {
		console.log(e);
	}
	this.ctx.beginPath();
	this.ctx.fillStyle = gradient;
	this.ctx.rect(this.m_chartMargin / 4, this.m_chartMargin, 8, h - this.m_chartMargin * 2);
	this.ctx.fill();
	this.ctx.closePath();

	this.ctx.beginPath();
	this.ctx.textAlign = "left";
	this.ctx.textBaseline = "middle";
	this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize * 1) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
	this.ctx.fillStyle = "#000000";
	this.ctx.fillText(fq_hist_min, this.m_chartMargin / 4, h - this.m_chartMargin + this.fontScaling(this.m_xAxis.m_labelfontsize * 1) / 2);
	this.ctx.fillText(fq_hist_max, this.m_chartMargin / 4, this.m_chartMargin - this.fontScaling(this.m_xAxis.m_labelfontsize * 1) / 2);
	this.ctx.fill();
	this.ctx.closePath();
};

SentimentHeatMapChart.prototype.drawHeatMapAxis = function (w, h) {
	var label = ["Pleasant", "Unpleasant", "Active", "Subdued"]; // Emotion label text
	var off; // Tick offset
	var step; // Step distance between ticks

	this.ctx.strokeStyle = "rgb(192, 192, 192)";
	this.ctx.textAlign = "center"; // Setup label text
	this.ctx.fillStyle = "#2c8ac7";
	this.ctx.beginPath(); // Draw pleasure/arousal axes
	this.ctx.moveTo(w / 2, this.m_chartMargin);
	this.ctx.lineTo(w / 2, h - this.m_chartMargin);
	this.ctx.stroke();
	this.ctx.beginPath();
	this.ctx.moveTo(this.m_chartMargin, h / 2);
	this.ctx.lineTo(w - this.m_chartMargin, h / 2);
	this.ctx.stroke();

	//  There's a chartMargin to the right and left of the graph, and
	//  another 20-pixel pad for each quadrant of the heatmap to offset
	//  it within the axes, so ticks must be positioned accordingly
	this.ctx.textBaseline = "top";
	this.ctx.beginPath(); // Left tick
	this.ctx.moveTo(this.m_chartMargin, (h / 2) - 5);
	this.ctx.lineTo(this.m_chartMargin, (h / 2) + 5);
	this.ctx.stroke();
	this.ctx.fillText("1", this.m_chartMargin, (h / 2) + 8);
	this.ctx.beginPath(); // Right tick
	this.ctx.moveTo(w - this.m_chartMargin, (h / 2) - 5);
	this.ctx.lineTo(w - this.m_chartMargin, (h / 2) + 5);
	this.ctx.stroke();
	this.ctx.fillText("9", w - this.m_chartMargin, (h / 2) + 8);
	step = (w - (this.m_chartMargin * 2 + 80)) / 8.0; // Step size between ticks
	off = this.m_chartMargin + 20 + step; // Initial tick offset

	for (var i = 1; i < 8; i++) {
		if (i == 4) {
			// Jump over Y-axis
			off += 40;
		} else {
			this.ctx.beginPath();
			this.ctx.moveTo(off, (h / 2) - 5);
			this.ctx.lineTo(off, (h / 2) + 5);
			this.ctx.stroke();
			this.ctx.fillText((i + 1).toString(), off, (h / 2) + 7);
		}
		off += step;
	}

	this.ctx.textAlign = "right";
	this.ctx.textBaseline = "middle";
	this.ctx.beginPath(); // Top tick
	this.ctx.moveTo((w / 2) - 5, this.m_chartMargin);
	this.ctx.lineTo((w / 2) + 5, this.m_chartMargin);
	this.ctx.stroke();
	this.ctx.fillText("9", (w / 2) - 8, this.m_chartMargin);
	this.ctx.beginPath(); // Bottom tick
	this.ctx.moveTo((w / 2) - 5, h - this.m_chartMargin);
	this.ctx.lineTo((w / 2) + 5, h - this.m_chartMargin);
	this.ctx.stroke();
	this.ctx.fillText("1", (w / 2) - 8, h - this.m_chartMargin);

	step = (h - (this.m_chartMargin * 2 + 80)) / 8.0; // Step size between ticks
	off = this.m_chartMargin + 20 + step; // Initial tick offset

	for (var i = 1; i < 8; i++) {
		// Left-side interior ticks
		if (i == 4) {
			// Jump over Y-axis
			this.ctx.fillText((i + 1).toString(), (w / 2) - 8, off + 32);
			off += 40;
		} else {
			this.ctx.beginPath();
			this.ctx.moveTo((w / 2) - 5, off);
			this.ctx.lineTo((w / 2) + 5, off);
			this.ctx.stroke();
			this.ctx.fillText((9 - i).toString(), (w / 2) - 8, off);
		}
		off += step;
	}

	this.ctx.textAlign = "center"; // Draw labels
	//this.ctx.fillStyle = "#2c8ac7";
	//this.ctx.font = "11px Roboto"
	this.ctx.fillStyle = convertColorToHex(this.m_xAxis.m_labelfontcolor);
	this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.fontScaling(this.m_xAxis.m_labelfontsize * 1) + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);

	//  Label at ends of axes (pleasant, unpleasant, active, subdued) must be placed explicitly
	this.ctx.textBaseline = "alphabetic";
	this.ctx.fillText(label[0], w - this.m_chartMargin, (h / 2) - 10);
	this.ctx.fillText(label[1], this.m_chartMargin + 10, (h / 2) - 10);
	this.ctx.fillText(label[2], w / 2, this.m_chartMargin - 10);
	this.ctx.fillText(label[3], w / 2, h - (this.m_chartMargin - 15));

	/*/
	 / Reviews Count
	this.ctx.font = "bold 11px Roboto";
	this.ctx.fillText("Reviews (" + this.getDataProvider().length + ")", w - 50, 25);
	 */
};

//Update the sentiment (valence,arousal) frequency histogram
SentimentHeatMapChart.prototype.updateDataInHeatMapHist = function () {
	this.m_reviews = 0;
	var data = this.getDataProvider();
	var a_bin; // Arousal bin
	var v_bin; // Valence bin
	this.fq_hist.length = 0; // Clear previous histogram

	for (var i = 0; i < 8; i++) {
		this.fq_hist.push([0, 0, 0, 0, 0, 0, 0, 0]); // Initialize zero-frequency array
	}

	fq_hist_avg = 0; // Reset avg, max
	fq_hist_max = 0;
	fq_hist_min = data.length;
	fq_hist_n = 0;

	for (var i = 0; i < data.length; i++) {
		//if(data[i].avgScore != undefined && data[i].avgScore != null && data[i].avgScore != "null" && data[i].avgScore != "")
		if (data[i] != undefined && data[i] != null && data[i] != "null" && data[i] != "") {
			// For all tweets
			//var avgArray = tw[i].avg.replace(/\[|\]/gi, '').split(",");
			//var x = data[i].avgScore.split("[");
			//var avgArray = x[1].split(", ");

			//a_bin = Math.min(Math.floor(avgArray[0].trim()), 8) - 1;
			//v_bin = Math.min(Math.floor(avgArray[1].trim()), 8) - 1;

			a_bin = Math.min(Math.floor(data[i][0].trim()), 8) - 1;
			v_bin = Math.min(Math.floor(data[i][1].trim()), 8) - 1;

			this.fq_hist[a_bin][v_bin]++;
			fq_hist_max = Math.max(fq_hist_max, this.fq_hist[a_bin][v_bin]);
			fq_hist_min = Math.min(fq_hist_min, this.fq_hist[a_bin][v_bin]);
			this.m_reviews++;
		}
	}

	for (var i = 0; i < 8; i++) {
		// Calculate average non-zero fq
		for (var j = 0; j < 8; j++) {
			if (this.fq_hist[i][j] > 0) {
				fq_hist_avg += this.fq_hist[i][j];
				fq_hist_n++;
			}
		}
	}
	fq_hist_avg /= fq_hist_n;
};

SentimentHeatMapChart.prototype.drawSentimentHeatMapChart = function (w, h) {
	var col; // Cell colour
	var x,
	y; // Top-left corner of cell

	//  Setup log scale to map sentiment frequency to colour
	var scale = shm.scale.linear(); // "Sentiment Heat Map" logarithmic colour scale
	scale.domain([0, fq_hist_avg, fq_hist_max]);

	if (fq_hist_max == 0) {
		// No terms, all cells white
		scale.range([[255, 255, 255], [255, 255, 255], [255, 255, 255]]);
	} else {
		scale.range([[19, 54, 231], [193, 196, 214], [223, 14, 14]]);
	}

	//  There's a chartMargin to the right and left of the graph, and
	//  another 20-pixel pad for each quadrant of the heatmap to offset
	var cell_w = (w - (this.m_chartMargin * 2 + 80 * 1)) / 8.0; // Cell width
	var cell_h = (h - (this.m_chartMargin * 2 + 80 * 1)) / 8.0; // Cell height
	y = this.m_chartMargin + 20; // Top of first quadrant

	for (var i = 0; i < 8; i++) {
		// For all rows
		x = this.m_chartMargin + 20; // Left of first quadrant
		for (var j = 0; j < 8; j++) {
			// For all columns
			this.ctx.beginPath(); // Draw heatmap cell
			this.ctx.rect(x, y, cell_w, cell_h);
			this.ctx.stroke();

			//  Colour above average cells red, below average cells blue, and
			//  cells with no tweets white
			if (this.fq_hist[7 - i][j] > 0) {
				col = scale(this.fq_hist[7 - i][j]);
				this.ctx.fillStyle = shm.rgb(col[0], col[1], col[2]).toString();
			} else {
				this.ctx.fillStyle = "#ffffff";
			}
			this.ctx.fill();
			if (j == 3) {
				x += 40; // Add offset around Y-axis
			}
			x += cell_w; // Move right to next cell
		}
		if (i == 3) {
			y += 40; // Add offset around X-axis
		}
		y += cell_h; // Move down to next row of cells
	}

	/*var text = "Reviews ("+this.m_reviews+")" ;
	var textLength = this.ctx.measureText(text).width ;
	this.ctx.beginPath();
	this.ctx.fillStyle = convertColorToHex(this.m_xAxis.m_labelfontcolor);
	this.ctx.fillText( text, w - textLength/2-5, this.getMarginForTitle() );*/
	this.ctx.closePath();

	var text = "Reviews (" + this.m_reviews + ")";
	var textWidth = this.ctx.measureText(text).width;
	$("#Reviews" + this.m_objectid).remove();
	var reviewDiv = document.createElement('div');
	reviewDiv.id = "Reviews" + this.m_objectid;
	reviewDiv.innerHTML = "Reviews (" + this.getDataProvider().length + ")";
	reviewDiv.title = "Actual Reviews (" + this.origionalDPLength + ")"; ;
	reviewDiv.style.top = this.getMarginForTitle() + 'px';
	reviewDiv.style.left = (w - textWidth) + 'px';
	reviewDiv.style.color = this.m_xAxis.m_labelfontcolor;
	reviewDiv.style.fontSize = this.m_xAxis.m_labelfontsize + 'px';
	reviewDiv.style.fontFamily = this.m_xAxis.m_labelfontfamily;
	reviewDiv.style.cursor = "pointer";
	reviewDiv.style.position = "absolute";

	$("#draggableDiv" + this.m_objectid).append(reviewDiv);
};

SentimentHeatMapChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

SentimentHeatMapChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

SentimentHeatMapChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

SentimentHeatMapChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

SentimentHeatMapChart.prototype.drawXAxis = function () {
	this.m_xAxis.drawXAxis();
	this.m_xAxis.markXaxis();
};

SentimentHeatMapChart.prototype.drawYAxis = function () {
	this.m_yAxis.drawYAxis();
	this.m_yAxis.markYaxis();
};

SentimentHeatMapChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

SentimentHeatMapChart.prototype.getStartX = function () {
	var marginForYAxisLabels = this.m_chartMargin;
	return (this.m_x + marginForYAxisLabels);
};

SentimentHeatMapChart.prototype.getStartY = function () {
	var marginForXAxisLabels = this.m_chartMargin;
	return (this.m_y + this.m_height - marginForXAxisLabels);
};

SentimentHeatMapChart.prototype.getEndX = function () {
	var rightSideMargin = this.m_chartMargin;
	return (this.m_x + this.m_width - rightSideMargin);
};

SentimentHeatMapChart.prototype.getEndY = function () {
	return this.m_y + this.m_chartMargin;
};

SentimentHeatMapChart.prototype.getMarginForTitle = function () {
	var margin;
	if ((!IsBoolean(this.getShowGradient())) && (!IsBoolean(this.m_showmaximizebutton)) && (!IsBoolean(this.getTitle().m_showtitle)))
		margin = 15;
	else
		margin = 40;
	return margin;
};

SentimentHeatMapChart.prototype.getMarginForSubTitle = function () {
	var margin;
	if (IsBoolean(this.m_subTitle.m_showsubtitle))
		margin = (this.m_subTitle.getDescription() != "") ? (this.m_subTitle.getFontSize() * 1.5) : 10;
	else
		margin = 0;
	return margin;
};

SentimentHeatMapChart.prototype.getToolTipData = function (mouseX, mouseY) {
	//if(!IsBoolean(this.m_isEmptySeries ) && (this.m_showtooltip==true || this.m_showtooltip=="true"))
	{
		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			var i,
			j; // Indices of cell under mouse
			var x,
			y; // Offset mouse position

			var w = this.m_width;
			var h = this.m_height;
			var cell_w = (w - (this.m_chartMargin * 2 + 80 * 1)) / 8.0; // Heatmap cell width, height
			var cell_h = (h - (this.m_chartMargin * 2 + 80 * 1)) / 8.0;

			var gap1 = this.m_chartMargin * 1 + 20 * 1;
			var gap2 = this.m_chartMargin * 1 + 60 * 1;

			// If mouse outside left, right, top, or bottom bounds of heatmap,
			// or if it's in the buffer region around the axes, return no data
			if (mouseX < gap1 || mouseX > w - gap1
				 || (mouseX > gap1 + (cell_w * 4) && mouseX < gap2 + (cell_w * 4))
				 || mouseY < gap1 || mouseY > h - gap1
				 || (mouseY > gap1 + (cell_h * 4) && mouseY < gap2 + (cell_h * 4))) {
				return {};
			}

			x = mouseX - gap1; // Adjust for left, center border
			if (mouseX > gap1 + (cell_w * 4) + 40) {
				x -= 40;
			}

			y = mouseY - gap1; // Adjust for top, center border
			if (mouseY > gap1 + (cell_h * 4) + 40) {
				y -= 40;
			}

			// Return empty result if mouse pointer outside of heatmap cells
			if (x < 0 || x >= (cell_w * 8) || y < 0 || y >= (cell_h * 8)) {
				return {};
			}

			i = 7 - Math.floor(y / cell_h); // Convert mouse pos to cell index
			j = Math.floor(x / cell_w);

			return {
				a : i + 1,
				v : j + 1,
				fq : this.fq_hist[i][j]
			};
		}
	}
};

SentimentHeatMapChart.prototype.getToolTip = function(tooltipContent){
	var chartObject = this;
	chartObject.removeToolTipDiv();
	var obj = document.createElement("div");
	document.body.appendChild(obj);
	obj.setAttribute("class", "toolTipDiv");
	obj.setAttribute("id", "toolTipDiv");
	obj.innerHTML = tooltipContent;
	var pos = {left: pageX * 1 + 15 * 1, top: pageY * 1 + 10 * 1};
	var left = pageX - obj.clientWidth * 1;
	if ((mouseX * 1 + obj.clientWidth * 1) >= chartObject.getEndX()) {
	    if (left * 1 > 0) {
	        pos.left = left * 1;
	    } else {
	        if (left * -1 < (obj.clientWidth * 1 / 3)) {
	            pos.left = left * -1;
	        }
	    }
	}
	var top = pageY - obj.clientHeight * 1 - 10;
	if ((mouseY * 1 + obj.clientHeight) >= chartObject.getStartY() && (top * 1 > 0)) {
		pos.top = top;
	}
	$(obj).css({
		"font-family" :  selectGlobalFont(chartObject.m_defaultfontfamily),
		"visibility" : "",
		"zIndex" : chartObject.m_zIndex + 1,
		"left": pos.left + "px",
		"top": pos.top + "px",
	})
	
	/**Set tooltip container background css property object*/
	var tooltipBGColor = hex2rgb(convertColorToHex(chartObject.m_tooltipbackgroundcolor), chartObject.m_tooltipbackgroundtransparency);		
	if ($(obj).hasClass("toolTipDivForCustom")) {
		 // for custom tooltip div
	    $(obj).css({
	    	"background-color": tooltipBGColor,
	    	"border": chartObject.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(chartObject.m_tooltipbordercolor))
	    });
	} 
	/** Added to control fontSize and color of tooltip */
	$(obj).find(".chart-tooltip td").css({
		"font-size": chartObject.m_tooltipfontsize + "px",
		"color": chartObject.m_tooltipfontcolor
	});
	
	if (chartObject.m_autotooltiphide) {
		setTimeout(function() {
			if (obj !== undefined) {
				/** .remove() of jQuery won't work in IE for plain object, Need to wrap inside $ **/
				$(obj).remove();
			}
		}, chartObject.m_tooltiphidetimeout);
	}
};

SentimentHeatMapChart.prototype.drawTooltip = function (mouseX, mouseY) {
	//if( !IsBoolean(this.m_isEmptySeries) && !this.m_designMode)
	{
		var chart_data = this.getToolTipData(mouseX, mouseY);
		if (chart_data != {} && ((chart_data || "") != "")) {
			if (((chart_data.fq || "") != "") && chart_data.fq != {}) {
				var tooltipContent = "<table class=\" chart-tooltip toolTip\">";
				tooltipContent += "<tr>";
				tooltipContent += "<td align=\"left\">" + chart_data.fq + " Review</td>";
				tooltipContent += "</tr>";
				tooltipContent += "</table>";
				this.getToolTip(tooltipContent);
			} else {
				this.hideToolTip();
			}
		} else {
			this.hideToolTip();
		}
	}
};

SentimentHeatMapChart.prototype.getChartTypeNames = function () {
	var fieldNames = [];
	var shapeNames = ["point", "quad", "triangle", "cross", "cube"];
	for (var i = 0, count = 0; i < this.getSeriesData().length; i++) {
		if (this.typeArr[i] == 'YField' && this.otherFieldArr[i] != '') {
			fieldNames.push(shapeNames[count]);
			count++;
			if (count == 5)
				count = 0;

		}
		if (this.typeArr[i] == 'XField' && this.otherFieldArr[i] != '') {
			fieldNames.push(shapeNames[count]);
			count++;
			if (count == 5)
				count = 0;

		}
	}
	return fieldNames;
};

SentimentHeatMapChart.prototype.initializeSeriesValues = function () {
	var arr = [];

	for (var i = 0; i < this.m_seriesData[0].length; i++) {
		arr[i] = [];
		for (var j = 0; j < this.m_seriesData.length; j++) {
			arr[i][j] = this.m_seriesData[j][i];
		}
	}
	this.m_seriesData = arr;
};

SentimentHeatMapChart.prototype.initializeCategoryValues = function () {
	var arr = [];
	for (var i = 0; i < this.m_categoryData[0].length; i++) {
		arr[i] = [];
		for (var j = 0; j < this.m_categoryData.length; j++) {
			arr[i][j] = this.m_categoryData[j][i];
		}
	}
	this.m_categoryData = arr;
};

SentimentHeatMapChart.prototype.getDrillDataPoints = function () {
	//if(!IsBoolean(this.m_isEmptySeries ) && (this.m_showtooltip==true || this.m_showtooltip=="true"))
	{
		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			var i,
			j; // Indices of cell under mouse
			var x,
			y; // Offset mouse position

			var w = this.m_width;
			var h = this.m_height;
			var cell_w = (w - (this.m_chartMargin * 2 + 80 * 1)) / 8.0; // Heatmap cell width, height
			var cell_h = (h - (this.m_chartMargin * 2 + 80 * 1)) / 8.0;

			var gap1 = this.m_chartMargin * 1 + 20 * 1;
			var gap2 = this.m_chartMargin * 1 + 60 * 1;

			// If mouse outside left, right, top, or bottom bounds of heatmap,
			// or if it's in the buffer region around the axes, return no data
			if (mouseX < gap1 || mouseX > w - gap1
				 || (mouseX > gap1 + (cell_w * 4) && mouseX < gap2 + (cell_w * 4))
				 || mouseY < gap1 || mouseY > h - gap1
				 || (mouseY > gap1 + (cell_h * 4) && mouseY < gap2 + (cell_h * 4))) {
				return {};
			}

			x = mouseX - gap1; // Adjust for left, center border
			if (mouseX > gap1 + (cell_w * 4) + 40) {
				x -= 40;
			}

			y = mouseY - gap1; // Adjust for top, center border
			if (mouseY > gap1 + (cell_h * 4) + 40) {
				y -= 40;
			}

			// Return empty result if mouse pointer outside of heatmap cells
			if (x < 0 || x >= (cell_w * 8) || y < 0 || y >= (cell_h * 8)) {
				return {};
			}

			i = 7 - Math.floor(y / cell_h); // Convert mouse pos to cell index
			j = Math.floor(x / cell_w);

			var fieldNameValueMap = {
				"Value" : this.fq_hist[i][j]
			};
			var drillColor = "";
			return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
		}
	}
};

function SentimentHeatMapChartCalculation() {
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

SentimentHeatMapChartCalculation.prototype.init = function (plotchart, m_categoryData, m_seriesData) {
	this.m_chart = plotchart;

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

SentimentHeatMapChartCalculation.prototype.setXRatio = function () {
	this.m_xRatio = (this.endX - this.startX) / 8;
};

SentimentHeatMapChartCalculation.prototype.setYRatio = function () {
	this.m_yRatio = (this.startY - this.endY) / 8;
};

SentimentHeatMapChartCalculation.prototype.setXPixelArray = function () {
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

SentimentHeatMapChartCalculation.prototype.getXPixelArray = function () {
	return this.m_xPixelArray;
};

SentimentHeatMapChartCalculation.prototype.setYPixelArray = function () {
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

SentimentHeatMapChartCalculation.prototype.getMinValue = function () {
	return 1;
};

SentimentHeatMapChartCalculation.prototype.getYPixelArray = function () {
	return this.m_yPixelArray;
};

//==================SentimentHeatMapForColor========================

//shm = Sentiment Heat Map
var shm = function () {
	var shm = {};

	shm.bisector = function (f) {
		return {
			left : function (a, x, lo, hi) {
				if (arguments.length < 3)
					lo = 0;
				if (arguments.length < 4)
					hi = a.length;
				while (lo < hi) {
					var mid = lo + hi >>> 1;
					if (f.call(a, a[mid], mid) < x)
						lo = mid + 1;
					else
						hi = mid;
				}
				return lo;
			},
			right : function (a, x, lo, hi) {
				if (arguments.length < 3)
					lo = 0;
				if (arguments.length < 4)
					hi = a.length;
				while (lo < hi) {
					var mid = lo + hi >>> 1;
					if (x < f.call(a, a[mid], mid))
						hi = mid;
					else
						lo = mid + 1;
				}
				return lo;
			}
		};
	};
	var shm_bisector = shm.bisector(function (d) {
			return d;
		});
	shm.bisect = shm_bisector.right;

	shm.interpolateNumber = shm_interpolateNumber;
	function shm_interpolateNumber(a, b) {
		b -= a;
		return function (t) {
			return a + b * t;
		};
	}
	shm.interpolateObject = shm_interpolateObject;
	function shm_interpolateObject(a, b) {
		var i = {},
		c = {},
		k;
		for (k in a) {
			if (k in b) {
				i[k] = shm_interpolateByName(k)(a[k], b[k]);
			} else {
				c[k] = a[k];
			}
		}
		for (k in b) {
			if (!(k in a)) {
				c[k] = b[k];
			}
		}
		return function (t) {
			for (k in i)
				c[k] = i[k](t);
			return c;
		};
	}
	shm.interpolate = shm_interpolate;
	function shm_interpolate(a, b) {
		var i = shm.interpolators.length,
		f;
		while (--i >= 0 && !(f = shm.interpolators[i](a, b)));
		return f;
	}
	shm.interpolators = [shm_interpolateObject, function (a, b) {
			return Array.isArray(b) && shm_interpolateArray(a, b);
		}, function (a, b) {
			return (typeof a === "string" || typeof b === "string") && shm_interpolateString(a + "", b + "");
		}, function (a, b) {
			return (typeof b === "string" ? shm_rgb_names.has(b) || /^(#|rgb\(|hsl\()/.test(b) : b instanceof shm_Color) && shm_interpolateRgb(a, b);
		}, function (a, b) {
			return !isNaN(a = +a) && !isNaN(b = +b) && shm_interpolateNumber(a, b);
		}
	];
	shm.interpolateArray = shm_interpolateArray;
	function shm_interpolateArray(a, b) {
		var x = [],
		c = [],
		na = a.length,
		nb = b.length,
		n0 = Math.min(a.length, b.length),
		i;
		for (i = 0; i < n0; ++i)
			x.push(shm_interpolate(a[i], b[i]));
		for (; i < na; ++i)
			c[i] = a[i];
		for (; i < nb; ++i)
			c[i] = b[i];
		return function (t) {
			for (i = 0; i < n0; ++i)
				c[i] = x[i](t);
			return c;
		};
	}
	function shm_uninterpolateNumber(a, b) {
		b = b - (a = +a) ? 1 / (b - a) : 0;
		return function (x) {
			return (x - a) * b;
		};
	}
	function shm_scale_bilinear(domain, range, uninterpolate, interpolate) {
		var u = uninterpolate(domain[0], domain[1]),
		i = interpolate(range[0], range[1]);
		return function (x) {
			return i(u(x));
		};
	}
	function shm_Color() {}
	shm_Color.prototype.toString = function () {
		return this.rgb() + "";
	};

	var shm_rgbPrototype = shm_Rgb.prototype = new shm_Color();
	shm_rgbPrototype.brighter = function (k) {
		k = Math.pow(.7, arguments.length ? k : 1);
		var r = this.r,
		g = this.g,
		b = this.b,
		i = 30;
		if (!r && !g && !b)
			return shm_rgb(i, i, i);
		if (r && r < i)
			r = i;
		if (g && g < i)
			g = i;
		if (b && b < i)
			b = i;
		return shm_rgb(Math.min(255, Math.floor(r / k)), Math.min(255, Math.floor(g / k)), Math.min(255, Math.floor(b / k)));
	};
	shm_rgbPrototype.darker = function (k) {
		k = Math.pow(.7, arguments.length ? k : 1);
		return shm_rgb(Math.floor(k * this.r), Math.floor(k * this.g), Math.floor(k * this.b));
	};
	shm_rgbPrototype.hsl = function () {
		return shm_rgb_hsl(this.r, this.g, this.b);
	};
	shm_rgbPrototype.toString = function () {
		return "#" + shm_rgb_hex(this.r) + shm_rgb_hex(this.g) + shm_rgb_hex(this.b);
	};
	function shm_rgb_hex(v) {
		return v < 16 ? "0" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);
	}

	shm.scale = {};
	shm.scale.linear = function () {
		return shm_scale_linear([0, 1], [0, 1], shm_interpolate, false);
	};
	function shm_scale_polylinear(domain, range, uninterpolate, interpolate) {
		var u = [],
		i = [],
		j = 0,
		k = Math.min(domain.length, range.length) - 1;
		if (domain[k] < domain[0]) {
			domain = domain.slice().reverse();
			range = range.slice().reverse();
		}
		while (++j <= k) {
			u.push(uninterpolate(domain[j - 1], domain[j]));
			i.push(interpolate(range[j - 1], range[j]));
		}
		return function (x) {
			var j = shm.bisect(domain, x, 1, k) - 1;
			return i[j](u[j](x));
		};
	}

	function shm_scale_linear(domain, range, interpolate, clamp) {
		var output,
		input;
		function rescale() {
			var linear = Math.min(domain.length, range.length) > 2 ? shm_scale_polylinear : shm_scale_bilinear,
			uninterpolate = clamp ? shm_uninterpolateClamp : shm_uninterpolateNumber;
			output = linear(domain, range, uninterpolate, interpolate);
			input = linear(range, domain, uninterpolate, shm_interpolate);
			return scale;
		}
		function scale(x) {
			return output(x);
		}
		scale.invert = function (y) {
			return input(y);
		};
		scale.domain = function (x) {
			if (!arguments.length)
				return domain;
			domain = x.map(Number);
			return rescale();
		};
		scale.range = function (x) {
			if (!arguments.length)
				return range;
			range = x;
			return rescale();
		};
		scale.rangeRound = function (x) {
			return scale.range(x).interpolate(shm_interpolateRound);
		};
		scale.clamp = function (x) {
			if (!arguments.length)
				return clamp;
			clamp = x;
			return rescale();
		};
		scale.interpolate = function (x) {
			if (!arguments.length)
				return interpolate;
			interpolate = x;
			return rescale();
		};
		scale.ticks = function (m) {
			return shm_scale_linearTicks(domain, m);
		};
		scale.tickFormat = function (m, format) {
			return shm_scale_linearTickFormat(domain, m, format);
		};
		scale.nice = function () {
			shm_scale_nice(domain, shm_scale_linearNice);
			return rescale();
		};
		scale.copy = function () {
			return shm_scale_linear(domain, range, interpolate, clamp);
		};
		return rescale();
	}

	function shm_rgb(r, g, b) {
		return new shm_Rgb(r, g, b);
	}
	function shm_Rgb(r, g, b) {
		this.r = r;
		this.g = g;
		this.b = b;
	}
	function shm_rgb_parse(format, rgb, hsl) {
		var r = 0,
		g = 0,
		b = 0,
		m1,
		m2,
		name;
		m1 = /([a-z]+)\((.*)\)/i.exec(format);
		if (m1) {
			m2 = m1[2].split(",");
			switch (m1[1]) {
			case "hsl": {
					return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);
				}

			case "rgb": {
					return rgb(shm_rgb_parseNumber(m2[0]), shm_rgb_parseNumber(m2[1]), shm_rgb_parseNumber(m2[2]));
				}
			}
		}
		if (name = shm_rgb_names.get(format))
			return rgb(name.r, name.g, name.b);
		if (format != null && format.charAt(0) === "#") {
			if (format.length === 4) {
				r = format.charAt(1);
				r += r;
				g = format.charAt(2);
				g += g;
				b = format.charAt(3);
				b += b;
			} else if (format.length === 7) {
				r = format.substring(1, 3);
				g = format.substring(3, 5);
				b = format.substring(5, 7);
			}
			r = parseInt(r, 16);
			g = parseInt(g, 16);
			b = parseInt(b, 16);
		}
		return rgb(r, g, b);
	}

	shm.rgb = function (r, g, b) {
		return arguments.length === 1 ? r instanceof shm_Rgb ? shm_rgb(r.r, r.g, r.b) : shm_rgb_parse("" + r, shm_rgb, shm_hsl_rgb) : shm_rgb(~~r, ~~g, ~~b);
	};
	return shm;
}();
//# sourceURL=SentimentHeatMapChart.js