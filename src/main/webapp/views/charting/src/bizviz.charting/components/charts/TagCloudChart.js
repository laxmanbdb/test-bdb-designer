/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: TagCloudChart.js
 * @description TagCloudChart
 **/
var NS = 'http://www.w3.org/2000/svg';
var category;
var highLightedColor;
var toolTipX;
var toolTipY;
var sortedarry = [];
var DragableDivID = "";
var SVGDrag = "";

function drawTagCloudSVGText(x, y, text, fillColor, hAlign, Valign, fontSize, j, lift, confidence, fontFamily) {
	var newText = document.createElementNS(NS, 'text');
	newText.setAttribute('x', x);
	newText.setAttribute('y', y);
	newText.setAttribute('fill', fillColor);
	newText.setAttribute('id', j);
	newText.textContent = text;

	newText.setAttributeNS(null, 'font-size', fontSize);
	newText.setAttributeNS(null, 'font-family', fontFamily);
	newText.setAttributeNS(null, 'float', "left");
	newText.setAttributeNS(null, 'position', "absolute");
	newText.setAttributeNS(null, 'onmousemove', "ShowTagCloudTooltip(evt,this," + confidence + "," + lift + "," + x + "," + y + ")");
	newText.setAttributeNS(null, 'onmouseout', "HideTagCloudTooltip(evt)");
	return newText;
}

function drawSVGTextLabel(x, y, text, fillColor, hAlign, Valign, fontSize, j, lift, confidence, anchor) {
	var newText = document.createElementNS(NS, 'text');
	newText.setAttribute('x', x);
	newText.setAttribute('y', y);
	newText.setAttribute('fill', fillColor);
	newText.setAttribute('id', j);
	newText.textContent = text;
	newText.setAttribute("text-anchor", anchor);
	newText.setAttribute("alignment-baseline", "middle");
	newText.setAttributeNS(null, 'font-size', fontSize);
	newText.setAttributeNS(null, 'float', "left");
	newText.setAttributeNS(null, 'position', "absolute");

	return newText;
}

function HideTagCloudTooltip() {
	var tooltip = document.getElementById("tagcloudtooltip");
	tooltip.setAttributeNS(null, "visibility", "hidden");

	var tooltip_bg = document.getElementById("tagcloudtooltip_bg");
	tooltip_bg.setAttributeNS(null, "visibility", "hidden");
}

function ShowTagCloudTooltip(evt, object, con, lift, x, y) {
	var tag = document.getElementById("tagcloudtooltip");
	if (tag != null)
		tag.remove();

	var tag2 = document.getElementById("tagcloudtooltip_bg");
	if (tag2 != null)
		tag2.remove();

	var leftMargin = document.getElementById("mainDiv").style.left;
	var leftMargin2 = parseInt(leftMargin, 10);

	var newRect = document.createElementNS(NS, 'rect');
	newRect.setAttributeNS(null, 'id', "tagcloudtooltip_bg");
	newRect.setAttributeNS(null, 'class', "tooltip_bg");
	newRect.setAttributeNS(null, 'x', x);
	newRect.setAttributeNS(null, 'y', y);
	newRect.setAttributeNS(null, 'height', 70);

	newRect.setAttributeNS(null, 'visibility', "visible");

	document.getElementById(SVGDrag).appendChild(newRect);

	var newText = document.createElementNS(NS, 'text');
	newText.setAttribute('x', x);
	newText.setAttribute('y', y - 5);
	newText.setAttribute('fill', "grey");
	newText.setAttribute('id', "tagcloudtooltip");

	var newTspan1 = document.createElementNS(NS, 'tspan');
	newTspan1.setAttribute('fill', "black");
	newTspan1.setAttribute('x', x);
	newTspan1.setAttribute('y', y - 5);
	newTspan1.setAttribute('dy', "1.2em");
	newTspan1.textContent = "APRIORI_TAGCLOUD_RULES: " + object.textContent;

	newText.appendChild(newTspan1);

	var newTspan2 = document.createElementNS(NS, 'tspan');
	newTspan2.setAttribute('fill', "Black");
	newTspan2.setAttribute('x', x);
	newTspan2.setAttribute('y', y + 10);
	newTspan2.setAttribute('dy', "1.2em");
	newTspan2.textContent = "Confidence: " + con;
	newText.appendChild(newTspan2);

	var newTspan3 = document.createElementNS(NS, 'tspan');
	newTspan3.setAttribute('fill', "black");
	newTspan3.setAttribute('x', x);
	newTspan3.setAttribute('y', y + 25);
	newTspan3.setAttribute('dy', "1.2em");
	newTspan3.textContent = "Lift: " + lift;
	newText.appendChild(newTspan3);
	document.getElementById(SVGDrag).appendChild(newText);
	length = newTspan1.getComputedTextLength();
	newRect.setAttributeNS(null, "width", length + 8);

	if (evt.clientX - leftMargin2 + length > toolTipY) {

		newRect.setAttributeNS(null, 'x', evt.clientX - leftMargin2 * 1 - length * 1 - 20);
		newText.setAttribute('x', evt.clientX - leftMargin2 * 1 - length * 1 - 20);
		newTspan1.setAttribute('x', evt.clientX - leftMargin2 * 1 - length * 1 - 20);
		newTspan2.setAttribute('x', evt.clientX - leftMargin2 * 1 - length * 1 - 20);
		newTspan3.setAttribute('x', evt.clientX - leftMargin2 * 1 - length * 1 - 20);
	}

	if (evt.clientX < toolTipX) {
		newRect.setAttributeNS(null, 'x', evt.clientX);
		newText.setAttribute('x', evt.clientX);
		newTspan1.setAttribute('x', evt.clientX);
		newTspan2.setAttribute('x', evt.clientX);
		newTspan3.setAttribute('x', evt.clientX);
	}

}

function drawSVGLine(x1, y1, x2, y2, lineWidth, fillColor) {
	var newLine = document.createElementNS(NS, 'line');
	newLine.setAttribute('x1', x1);
	newLine.setAttribute('y1', y1);
	newLine.setAttribute('x2', x2);
	newLine.setAttribute('y2', y2);
	newLine.setAttribute('stroke', fillColor);
	newLine.setAttribute('stroke-width', lineWidth);
	return newLine;
}

function drawTagCloudSVGRect(x, y, width, height, fill, id, categoryData) {
	var newRect = document.createElementNS(NS, 'rect');
	newRect.setAttributeNS(null, 'id', id);
	newRect.setAttributeNS(null, 'x', x);
	newRect.setAttributeNS(null, 'y', y);

	newRect.setAttributeNS(null, 'zIndex', 1000);
	newRect.setAttributeNS(null, 'height', height);
	newRect.setAttributeNS(null, 'width', width);
	newRect.setAttributeNS(null, 'fill', fill);
	newRect.addEventListener("dblclick", function (e) {
		for (var i = 0; i < sortedarry.length; i++) {
			var textElm = document.getElementById("range_" + i + fill);
			try {
				var tagRect = document.getElementById("highLightRectangle" + i);
				if (tagRect != null) {
					tagRect.setAttributeNS(null, "visibility", "hidden");
					tagRect.remove();
				}
			} catch (e) {}
		}

	});
	//	"ShowTooltip(evt,this,"+confidence+","+lift+","+x+","+y+")"
	newRect.setAttributeNS(null, 'onclick', "changeColor(this,evt)");
	newRect.setAttributeNS(null, 'onmousemove', "ShowBoxTooltip(evt,this," + x + "," + y + ")");
	newRect.setAttributeNS(null, 'onmouseout', "HideBoxTooltip(evt)");
	return newRect;
}

function HideBoxTooltip(event, object) {

	var recttooltip22 = document.getElementById("tooltipRectangle");
	recttooltip22.setAttributeNS(null, "visibility", "hidden");

	var textBoxToolTip = document.getElementById("boxToolTipText");
	textBoxToolTip.setAttributeNS(null, "visibility", "hidden");

}

function ShowBoxTooltip(event, object, x, y) {
	var ctx = document.getElementById(SVGDrag);
	var textCountArry = [];
	for (var i = 0; i < sortedarry.length; i++) {
		var textElm = document.getElementById("range_" + i + object.id);
		if (textElm != null) {
			textCountArry.push(textElm);
		}
	}
	try {
		var tagRect = document.getElementById("tooltipRectangle");
		if (tagRect != null) {
			tagRect.setAttributeNS(null, "visibility", "hidden");
			tagRect.remove();
		}
		var tagRect2 = document.getElementById("boxToolTipText");
		if (tagRect2 != null) {
			tagRect2.setAttributeNS(null, "visibility", "hidden");
			tagRect2.remove();
		}

		var newText = document.createElementNS(NS, 'text');
		newText.setAttribute('x', x + 30);
		newText.setAttribute('y', y + 40);

		newText.setAttribute('id', "boxToolTipText");
		newText.textContent = "Values in range: " + textCountArry.length;
		newText.setAttribute("alignment-baseline", "middle");
		newText.setAttributeNS(null, 'font-size', "12");
		newText.setAttributeNS(null, 'float', "left");
		//newText.setAttributeNS(null, 'position', "absolute");
		ctx.appendChild(newText);

		SVGRect = newText.getBBox();

		var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		rect.setAttribute("x", SVGRect.x);
		rect.setAttribute("y", SVGRect.y);
		rect.setAttribute("id", "tooltipRectangle");
		rect.setAttribute("width", SVGRect.width);
		rect.setAttribute("height", SVGRect.height);
		rect.setAttribute("fill", "grey");
		rect.setAttributeNS(null, 'visibility', "visible");
		ctx.insertBefore(rect, newText);
	} catch (e) {}
}

function changeColor(object, event) {
	event.stopPropagation();
	var ctx = document.getElementById(SVGDrag);
	for (var i = 0; i < sortedarry.length; i++) {
		var textElm = document.getElementById("range_" + i + object.id);
		//console.log(textElm)
		try {
			var tagRect = document.getElementById("highLightRectangle" + i);
			if (tagRect != null) {
				tagRect.setAttributeNS(null, "visibility", "hidden");
				tagRect.remove();
			}
			SVGRect = textElm.getBBox();
			var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			rect.setAttribute("x", SVGRect.x);
			rect.setAttribute("y", SVGRect.y);
			rect.setAttribute("id", "highLightRectangle" + i);
			rect.setAttribute("width", SVGRect.width);
			rect.setAttribute("height", SVGRect.height);
			rect.setAttribute("fill", highLightedColor);
			rect.setAttributeNS(null, 'visibility', "visible");
			ctx.insertBefore(rect, textElm);

		} catch (e) {}
	}
}
function getSVGAlignment(align) {
	if (align.toLowerCase() == "left")
		return "start";
	if (align.toLowerCase() == "center")
		return "middle";
	if (align.toLowerCase() == "right")
		return "end";
	else
		return align;
}
function TagCloudChart(m_chartContainer, m_zIndex) {

	this.base = Chart;
	this.base();

	this.removeDiv = false;
	this.m_x = 680;
	this.m_y = 20;
	this.m_width = 300;
	this.m_height = 260;
	this.m_radius = 2;
	this.m_lineSeries = [];
	this.m_colorNames = [];
	this.m_pointSeries = [];

	this.m_categoryNames = [];
	this.m_seriesNames = [];
	this.m_seriesarr = [];
	this.m_categoryData = [];
	this.m_seriesData = [];

	this.m_yPositionArray = [];
	//this.m_calculation=new SVGLineCalculation();

	this.m_title = new svgTitle(this);
	this.m_subTitle = new svgSubTitle();

	this.m_util = new Util();
	this.noOfRows = 1; //used for set x-axis text into two rows in non tilted case.
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;

	// for time series project
	this.m_lineCalculation = [];
	this.m_yaxisArr = [];
	this.m_marginXArray = [];

	this.max = null;
	this.min = null;
	this.colorseries = [];
	this.xAxisLabelWidth = "";

	this.barHeight = "";
	this.CatData = [];
	this.m_categoryData
	this.seriesFontWeight = [];
	this.m_maxfontsize = "";
	this.count = 0;
	this.datacount = 0;
	this.barColors = [];

};

TagCloudChart.prototype = new Chart();

TagCloudChart.prototype.getColorSeries = function () {
	return this.colorseries;
};

TagCloudChart.prototype.setMax = function (max) {
	this.max = max;
};
TagCloudChart.prototype.getMax = function () {
	return this.max;
};

TagCloudChart.prototype.setMin = function (min) {
	this.min = min;
};
TagCloudChart.prototype.getMin = function () {
	return this.min;
};

TagCloudChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas(); //create draggable div
};

TagCloudChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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

TagCloudChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

TagCloudChart.prototype.setFields = function (fieldsJson) {
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
TagCloudChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	// only one category can be set for Tag Cloud chart, preference to first one
	for (var i = 0; i < 1; i++) {
		this.m_categoryNames[i] = this.getProperAttributeNameValue(categoryJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(categoryJson[i], "DisplayName"));
		this.m_categoryDisplayNames[i] = m_formattedDisplayName;
	}
};
TagCloudChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = [];
	this.m_legendNames = [];
	this.m_seriesVisibleArr = []; // added for checklist
	for (var i = 0; i < seriesJson.length; i++) {
		this.m_seriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.m_seriesDisplayNames[i] = m_formattedDisplayName;
		this.m_seriesColors[i] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));
		this.m_legendNames[i] = m_formattedDisplayName;
		this.m_seriesVisibleArr[this.m_seriesDisplayNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
	}
};
TagCloudChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};
TagCloudChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};
TagCloudChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};
TagCloudChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};
TagCloudChart.prototype.getSeriesColors = function () {
	return this.m_seriesColors;
};
TagCloudChart.prototype.setSeriesColor = function (m_seriesColor) {
	this.m_seriesColor = m_seriesColor;
};
TagCloudChart.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};
TagCloudChart.prototype.getLegendNames = function () {
	return this.m_legendNames;
};
TagCloudChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
	this.CatData = this.m_categoryData;
};
TagCloudChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0; i < this.getSeriesNames().length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
	this.SerData = this.m_seriesData;
};
TagCloudChart.prototype.getCategoryData = function () {
	category = this.m_categoryData;
	return this.m_categoryData;
};
TagCloudChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

TagCloudChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getCategoryNames()[i]);
	}
	for (var j = 0; j < this.getSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getSeriesNames()[j]);
	}
};
TagCloudChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};
TagCloudChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};
TagCloudChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

TagCloudChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};
TagCloudChart.prototype.initializeDraggableDivAndCanvas = function () {
	var temp = this;
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.m_draggableDiv.style.height = "700px";
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.createSVG();
	//alert(temp.m_objectid)
	DragableDivID = "draggableDiv" + temp.m_objectid;
	document.getElementById(DragableDivID).style.overflowY = "auto";
};
TagCloudChart.prototype.createSVG = function () {
	var temp = this;
	$('#svg' + temp.m_objectid).remove();
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
	svg.setAttribute('width', this.m_width);
	svg.setAttribute('height', this.m_height);
	svg.setAttribute('id', 'svg' + temp.m_objectid);
	svg.setAttribute('class', 'svg_chart_container');

	SVGDrag = 'svg' + temp.m_objectid;
	$("#draggableDiv" + temp.m_objectid).append(svg);
	$('#' + SVGDrag).css('background-color', hex2rgb(convertColorToHex(this.getBgGradients().split(',')[0]), this.m_bgalpha));

	svg.setAttributeNS(null, 'onclick', "changeColorSVG(this,evt)");
};

TagCloudChart.prototype.init = function () {
	sortedarry = [];
	if (this.count == 0) {
		this.setCategoryData();
		this.setSeriesData();
	}
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	if (!IsBoolean(this.m_isEmptySeries)) {
		this.initializeLineSeries();
	}
	highLightedColor = this.m_highlightedcolor;
	toolTipY = this.m_width;
	this.getTextHeight();
	if (this.removeDiv == false) {
		$("#" + DragableDivID).remove();
		this.removeDiv = true;
		this.initializeDraggableDivAndCanvas();
	}
};
function changeColorSVG() {
	for (var i = 0; i < sortedarry.length; i++) {
		var textElm = document.getElementById("range_" + i + sortedarry[i][2]);
		try {
			var tagRect = document.getElementById("highLightRectangle" + i);
			if (tagRect != null) {
				tagRect.setAttributeNS(null, "visibility", "hidden");
				tagRect.remove();
			}
		} catch (e) {}
	}
}

TagCloudChart.prototype.initMouseClickEvent = function () {
	var temp = this;
	var canvas = $("#svg" + this.m_objectid);
	if (canvas != null) {
		$(canvas)[0].addEventListener("mousemove", function () {
			onMouseMove(temp);
		}, false);
		$(canvas)[0].addEventListener("click", function () {
			OnMouseClick(temp);
		}, false);
		$(canvas)[0].addEventListener("touchstart", function (event) {
			OnMouseClick(temp);
		}, false);
		$(canvas)[0].addEventListener("gestureend", function (event) {
			if (temp.m_showmaximizebutton
				 && temp.m_showmaximizebutton != undefined
				 && temp.m_showmaximizebutton != "") {
				if (event.scale < 1.0) {
					$("#MaximizeDiv").remove();
					temp.minimize();
				} else if (event.scale > 1.0) {
					$("#MaximizeDiv").remove();
					temp.maximize();;
				}
			}
		}, false);
	}
	this.initContextMenuEvent();
};

/****************************For manage series /axes  separately for manage time based graph ************************************/
TagCloudChart.prototype.calculateSeriesMap = function (seriesData) {
	this.seriesMap = [];
	var seriesMap = [];
	var seriesDataMap = [];
	if (IsBoolean(this.m_ismultipleaxis)) {
		for (var i = 0, k = 0; i < seriesData[0].length; i++) {
			seriesDataMap[k] = [];
			for (var j = 0; j < seriesData.length; j++) {
				seriesDataMap[k].push(seriesData[j][i]);
			}
			seriesMap[i] = seriesDataMap;
			seriesDataMap = [];
			k = 0;
		}
		this.seriesMap = seriesMap;
	} else {
		this.seriesMap[0] = seriesData;
	}

};

TagCloudChart.prototype.updateSeriesData = function (min, max) {
	var cat = [];
	var ser = [];
	cat[0] = [];
	for (var i = 0; i < this.SerData.length; i++) {
		ser[i] = [];
		for (var j = min; j <= max; j++) {
			if (i == 0)
				cat[i].push(this.CatData[i][j]);
			ser[i].push(this.SerData[i][j]);
		}
	}
	this.m_categoryData = cat;
	this.m_seriesData = ser;

};
TagCloudChart.prototype.getTextHeight = function () {

	var sum = 0;
	var height = this.calulateHeight();
	for (var i = 0; i < height.length; i++) {
		sum = sum + height[i] * 1;
	}
	var deleteExtra = sum * 40 / 100;
	var minHeight = "700";
	var newHeight = sum - deleteExtra;
	//alert(newHeight+"==>"+minHeight)
	if (newHeight < minHeight) {
		this.m_height = minHeight;
	} else {
		this.m_height = newHeight;
	}

};

TagCloudChart.prototype.drawChart = function () {
	var temp = this;
	this.drawChartFrame();
	this.drawTitle();
	this.getFontRatio();
	this.drawXAxislabel();
	this.drawColumn();
	//alert("yyo"+this.getTextHeight())
	this.drawText();
};
TagCloudChart.prototype.rangSize = function () {

	if (this.datacount >= 50 && this.datacount < 101)
		this.m_maxfontsize = 21;
	else if (this.datacount >= 101 && this.datacount < 150)
		this.m_maxfontsize = 17.5;
	else if (this.datacount >= 151 && this.datacount < 1000)
		this.m_maxfontsize = 12;
	else
		this.m_maxfontsize = this.m_maxfontsize;
}

TagCloudChart.prototype.calulateHeight = function () {
	var temp = this;
	this.availableLength;
	var x = this.m_barwidth * 1 + this.m_leftmargin * 1 + this.xAxisLabelWidth;
	toolTipX = x;
	var y = this.m_height / 7;
	var heightTextObj = "";
	var heightTextObj2 = "";
	var heightArray = [];
	this.datacount = 0;
	var map = {};

	for (var i = 0; i < this.m_categoryData.length; i++) {
		this.availableLength = eval(document.getElementById("svg" + temp.m_objectid).width.baseVal.value - x);

		for (var j = 0; j < this.m_categoryData[i].length; j++) {
			this.datacount++;

			//heightTextObj2=drawTagCloudSVGText(x,y,this.m_categoryData[i][j],this.getColorSeries()[j],"","",(this.m_maxfontsize),"range_"+j+this.getColorSeries()[j],"","",this.m_wordfontfamily);
			//document.getElementById("svg"+temp.m_objectid).appendChild(heightTextObj2);// without appending we can not get the width of text
			//var bbox2 = heightTextObj2.getBBox();// removing previous text
			var bbox2 = this.getTextWidthHeight(this.m_categoryData[i][j], this.m_maxfontsize);

			//document.getElementById("svg"+temp.m_objectid).removeChild(heightTextObj2);
			if (this.availableLength > bbox2.width) {

				this.availableLength = this.availableLength - bbox2.width;
				heightTextObj = drawTagCloudSVGText(x, y, this.m_categoryData[i][j], this.getColorSeries()[j], "", "", (this.m_maxfontsize), "range_" + j + this.getColorSeries()[j], this.m_seriesData[1][j], this.m_seriesData[0][j], this.m_wordfontfamily);
				document.getElementById("svg" + temp.m_objectid).appendChild(heightTextObj);
				//var bbox = heightTextObj.getBBox();
				var bbox = this.getTextWidthHeight(this.m_categoryData[i][j], this.m_maxfontsize);

				x = x * 1 + bbox.width * 1;
				if (j == 0) {
					heightArray.push(bbox.height);
				}
				document.getElementById("svg" + temp.m_objectid).removeChild(heightTextObj);
			} else {
				x = this.m_barwidth * 1 + this.m_leftmargin * 1 + this.xAxisLabelWidth;
				this.availableLength = eval(document.getElementById("svg" + temp.m_objectid).width.baseVal.value - x);
				y = y * 1 + bbox2.height * 1 + this.m_margin * 1;
				if (bbox2.width > this.availableLength) {
					var newText = temp.getTextWidth("" + this.m_categoryData[i][j], this.availableLength, (this.m_maxfontsize));
					heightTextObj = drawTagCloudSVGText(x, y, newText, this.getColorSeries()[j], "", "", (this.m_maxfontsize), "range_" + j + this.getColorSeries()[j], this.m_seriesData[1][j], this.m_seriesData[0][j], this.m_wordfontfamily);
					document.getElementById("svg" + temp.m_objectid).appendChild(heightTextObj);

					//var bbox = heightTextObj.getBBox();
					var bbox = this.getTextWidthHeight(newText, this.m_maxfontsize);
					x = x * 1 + bbox.width * 1;
					this.availableLength = this.availableLength - bbox2.width;

				} else {
					heightTextObj = drawTagCloudSVGText(x, y, this.m_categoryData[i][j], this.getColorSeries()[j], "", "", (this.m_maxfontsize), "range_" + j + this.getColorSeries()[j], this.m_seriesData[1][j], this.m_seriesData[0][j], this.m_wordfontfamily);
					document.getElementById("svg" + temp.m_objectid).appendChild(heightTextObj);

					//var bbox = heightTextObj.getBBox();
					var bbox = this.getTextWidthHeight(this.m_categoryData[i][j], this.m_maxfontsize);
					x = x * 1 + bbox.width * 1;
					this.availableLength = this.availableLength - bbox2.width;

				}
				heightArray.push(bbox.height);
				document.getElementById("svg" + temp.m_objectid).removeChild(heightTextObj);
			}
		}
	}

	return heightArray;
};

//
///////////////////////////////start//////////////////////////

TagCloudChart.prototype.getFontRatio = function () {
	for (var i = 0; i < this.m_seriesData.length; i++) {
		this.seriesFontWeight = [];
		for (var j = 0; j < this.m_seriesData[i].length; j++) {
			var percentage = (this.m_seriesData[1][j] - this.m_seriesData[1].min()) / (this.m_seriesData[1].max() - this.m_seriesData[1].min());
			this.fontWeight = percentage * (this.m_maxfontsize - this.m_minfontsize) * 1 + this.m_minfontsize * 1;
			this.seriesFontWeight.push(this.fontWeight);
		}
	}
};

TagCloudChart.prototype.drawXAxislabel = function () {
	this.barColors = [];
	for (var i = 1; i < this.m_seriesData.length; i++) {
		var min = this.m_seriesData[0].min();
		max = this.m_seriesData[0].max();
		this.setMax(max);
		this.setMin(min);
	}
	var temp = this;
	var y = this.m_topmargin * 1;
	this.barColors = (this.m_barcolors.split(","));
	var barHeight = eval(document.getElementById("svg" + temp.m_objectid).height.baseVal.value - y - this.m_bottommargin) / this.barColors.length;

	var b = eval((this.getMax() - this.getMin()) / this.barColors.length);
	var max = this.getMax();
	this.labelArray = [];

	for (var i = 0; i <= this.barColors.length; i++) {
		this.labelArray.push(parseFloat(max.toFixed(5)));

		var LabelObj = drawSVGTextLabel(this.m_barwidth * 1 + this.m_leftmargin * 1, y, parseFloat(max.toFixed(2)), "black", "hAlign", "Valign");
		document.getElementById("svg" + temp.m_objectid).appendChild(LabelObj);
		var bbox = LabelObj.getBBox();
		//var bbox=this.getTextWidthHeight(parseFloat(max.toFixed(2)), this.m_maxfontsize);
		this.xAxisLabelWidth = bbox.width + this.m_margin * 1;
		y = y * 1 + barHeight * 1;
		max = max - b;
	}

	for (var j = 0; j < this.m_seriesData[0].length; j++) {
		for (var k = 0; k < this.labelArray.length; k++) {
			if (this.labelArray[k] >= this.m_seriesData[0][j] && this.labelArray[k + 1] <= this.m_seriesData[0][j]) {
				this.colorseries.push(this.barColors[k]);
			}
		}

	}
};
TagCloudChart.prototype.getTextWidthHeight = function (text, font) {
	this.ctx.font = "" + font + "px " + this.m_wordfontfamily;
	var width = this.ctx.measureText(text).width;
	//var width=text.length*font;
	var height = font * 1.4;
	return {
		width : width,
		height : height
	};
};
TagCloudChart.prototype.drawText = function () {
	var temp = this;
	var map = {};
	var key = "";
	var value = "";
	var count = 0
		for (var i = 0; i < this.m_categoryData.length; i++) {
			map["data"] = [];
			for (var j = 0; j < this.m_categoryData[i].length; j++) {
				var temp1 = [];
				temp1.push(this.m_categoryData[i][j]);
				temp1.push(this.seriesFontWeight[j]);
				temp1.push(this.getColorSeries()[j]);
				temp1.push(this.m_seriesData[1][j]);
				temp1.push(this.m_seriesData[0][j]);
				map["data"].push(temp1);
			}
		}

		for (key in map) {
			for (var key1 in map[key]) {
				if (key1 != "min" && key1 != "max") {
					sortedarry[key1] = [];
					var r = map[key][key1];
					//console.log(r[0]);
					sortedarry[key1][2] = r[2];
					sortedarry[key1][0] = r[1];
					sortedarry[key1][1] = r[0];
					sortedarry[key1][3] = r[3];
					sortedarry[key1][4] = r[4];
				}
			}
		}

		sortedarry.sort(function (a, b) {
			return b[0] - a[0];
		});

	var x = this.getStartX() + this.m_barwidth * 1 + this.m_leftmargin * 1 + this.xAxisLabelWidth;
	this.availableWidth = eval(document.getElementById("svg" + temp.m_objectid).width.baseVal.value - x);
	toolTipX = x;

	var textObj = "";
	var textObj2 = "";

	var alternateUp = false;
	var x2 = this.getStartX() + this.m_barwidth * 1 + this.m_leftmargin * 1 + this.xAxisLabelWidth;
	var previousY_UP = this.m_height / 2;
	var previousY_DOWN = this.m_height / 2;
	var nextX_Down = x2;
	var nextX_Up = x2;
	var availableWidthUP = this.availableWidth;
	var availableWidthDown = this.availableWidth;

	var y = this.m_height / 2;
	var addValue = 2;
	var counter = 0;

	var backSpace = "";
	var newStartSpace;
	var newBackSpace;
	var startSpaceX;
	var repeatId = [];
	var flag = false;

	var totalHeight = 0;

	for (var i = 0; i < sortedarry.length; i++) {
		//textObj2=drawTagCloudSVGText((this.m_width/2),this.m_height/2,sortedarry[i][1],sortedarry[i][2],"","",(sortedarry[i][0]),"range_"+i+sortedarry[i][2],sortedarry[i][3],sortedarry[i][4],this.m_wordfontfamily);
		//document.getElementById("svg"+temp.m_objectid).appendChild(textObj2);// without appending we can not get the width of text
		//var bbox2 = textObj2.getBBox();// removing previous text
		var bbox2 = this.getTextWidthHeight(sortedarry[i][1], sortedarry[i][0]);
		//document.getElementById("svg"+temp.m_objectid).removeChild(textObj2);
		if (i == 0) {
			if (this.availableWidth > bbox2.width) {
				textObj = drawTagCloudSVGText((this.m_width / 2) - (bbox2.width / 2), previousY_DOWN, sortedarry[i][1], sortedarry[i][2], "", "", (sortedarry[i][0]), "range_" + i + sortedarry[i][2], sortedarry[i][3], sortedarry[i][4], this.m_wordfontfamily);
				document.getElementById("svg" + temp.m_objectid).appendChild(textObj);
			} else if (bbox2.width > this.availableWidth) {
				var newTextWithDot = temp.getTextWidth("" + sortedarry[i][1], this.availableWidth, sortedarry[i][0], bbox2.width);
				textObj = drawTagCloudSVGText(x, previousY_DOWN, newTextWithDot, sortedarry[i][2], "", "", (sortedarry[i][0]), "range_" + i + sortedarry[i][2], sortedarry[i][3], sortedarry[i][4], this.m_wordfontfamily);
				document.getElementById("svg" + temp.m_objectid).appendChild(textObj);
			}

			previousY_DOWN = previousY_DOWN * 1 + bbox2.height * 1;
			previousY_UP = previousY_UP - bbox2.height;
			alternateUp = false;

			backSpace = ((this.m_width / 2) * 1 + (bbox2.width) / 2) * 1;
			newBackSpace = this.availableWidth - backSpace;
			newStartSpace = (this.m_width / 2) * 1 - (bbox2.width / 2) * 1 - x2;
			startSpaceX = x2;
			for (var j = 1; j < sortedarry.length; j++) {
				// var textObj2=drawTagCloudSVGText(x2,this.m_height/2,sortedarry[j][1],sortedarry[j][2],"","",(sortedarry[j][0]),"range_"+j+sortedarry[j][2],sortedarry[j][3],sortedarry[j][4],this.m_wordfontfamily);
				// document.getElementById("svg"+temp.m_objectid).appendChild(textObj2);// without appending we can not get the width of text
				//var bbox2 = textObj2.getBBox();// removing previous text
				var bbox2 = this.getTextWidthHeight(sortedarry[j][1], sortedarry[j][0]);
				// document.getElementById("svg"+temp.m_objectid).removeChild(textObj2);

				if (bbox2.width < newStartSpace) {
					var textObj2 = drawTagCloudSVGText(startSpaceX, this.m_height / 2, sortedarry[j][1], sortedarry[j][2], "", "", (sortedarry[j][0]), "range_" + j + sortedarry[j][2], sortedarry[j][3], sortedarry[j][4], this.m_wordfontfamily);
					document.getElementById("svg" + temp.m_objectid).appendChild(textObj2); // without appending we can not get the width of text
					newStartSpace = newStartSpace - bbox2.width * 1;
					startSpaceX = startSpaceX * 1 + bbox2.width * 1;
					repeatId.push("range_" + j + sortedarry[j][2]);
				} else if (bbox2.width < newBackSpace) {
					var textObj2 = drawTagCloudSVGText(backSpace, this.m_height / 2, sortedarry[j][1], sortedarry[j][2], "", "", (sortedarry[j][0]), "range_" + j + sortedarry[j][2], sortedarry[j][3], sortedarry[j][4], this.m_wordfontfamily);
					document.getElementById("svg" + temp.m_objectid).appendChild(textObj2); // without appending we can not get the width of text
					newBackSpace = newBackSpace - bbox2.width * 1;
					backSpace = backSpace * 1 + bbox2.width * 1;
					repeatId.push("range_" + j + sortedarry[j][2]);
				}
			}
			totalHeight = totalHeight * 1 + bbox2.height * 1;
		} else {
			for (var k = 0; k < repeatId.length; k++) {
				if (("range_" + i + sortedarry[i][2]) == repeatId[k]) {
					flag = true;
					break;
				} else {
					flag = false;
				}
			}
			if (IsBoolean(alternateUp)) {
				availableWidthUP = eval(document.getElementById("svg" + temp.m_objectid).width.baseVal.value - nextX_Up);
				if (!IsBoolean(flag)) {
					if (bbox2.width > availableWidthUP) {
						var percentagewidth = bbox2.width / 2 * 1;

						if (availableWidthUP < (this.m_width * 22 / 100) * 1) {
							previousY_UP = previousY_UP - bbox2.height;
							var newText = temp.getTextWidth("" + sortedarry[i][1], this.availableWidth, (sortedarry[i][0]), bbox2.width);
							textObj = drawTagCloudSVGText(x2 * 1 + counter * 1 + addValue * 1, previousY_UP, newText, sortedarry[i][2], "", "", (sortedarry[i][0]), "range_" + i + sortedarry[i][2], sortedarry[i][3], sortedarry[i][4], this.m_wordfontfamily);
							document.getElementById("svg" + temp.m_objectid).appendChild(textObj);
							nextX_Up = x2 * 1 + bbox2.width * 1 + counter * 1 + addValue * 1;
							addValue = addValue * 1 + 5;
							alternateUp = false;
						} else {
							var newText = temp.getTextWidth("" + sortedarry[i][1], availableWidthUP, (sortedarry[i][0]), bbox2.width);
							textObj = drawTagCloudSVGText(nextX_Up, previousY_UP, newText, sortedarry[i][2], "", "", (sortedarry[i][0]), "range_" + i + sortedarry[i][2], sortedarry[i][3], sortedarry[i][4], this.m_wordfontfamily);
							document.getElementById("svg" + temp.m_objectid).appendChild(textObj);
							previousY_UP = previousY_UP - bbox2.height;
							alternateUp = false;
							nextX_Up = x2 * 1 + addValue * 1;
							addValue = addValue * 1 + 5;
						}
						counter++;
						totalHeight = totalHeight * 1 + bbox2.height * 1;
					} else if (availableWidthUP > bbox2.width) {
						textObj = drawTagCloudSVGText(nextX_Up, previousY_UP, sortedarry[i][1], sortedarry[i][2], "", "", (sortedarry[i][0]), "range_" + i + sortedarry[i][2], sortedarry[i][3], sortedarry[i][4], this.m_wordfontfamily);
						document.getElementById("svg" + temp.m_objectid).appendChild(textObj);
						nextX_Up = nextX_Up * 1 + bbox2.width * 1;
						alternateUp = true;
						totalHeight = totalHeight * 1 + bbox2.height * 1;
						if (bbox2.width > availableWidthUP) {
							alternateUp = false;
							var previousY_Up = previousY_Up - bbox2.height;
						}

					}

				}
			} else {
				availableWidthDown = eval(document.getElementById("svg" + temp.m_objectid).width.baseVal.value - nextX_Down);
				if (!IsBoolean(flag)) {
					if (bbox2.width > availableWidthDown) {
						var percentagewidth = bbox2.width / 2 * 1;
						if (availableWidthDown < (this.m_width * 22 / 100) * 1) {
							previousY_DOWN = previousY_DOWN + bbox2.height;
							var newText = temp.getTextWidth("" + sortedarry[i][1], this.availableWidth, (sortedarry[i][0]), bbox2.width);
							textObj = drawTagCloudSVGText(x2 + counter + 1 * addValue * 1, previousY_DOWN, newText, sortedarry[i][2], "", "", (sortedarry[i][0]), "range_" + i + sortedarry[i][2], sortedarry[i][3], sortedarry[i][4], this.m_wordfontfamily);
							document.getElementById("svg" + temp.m_objectid).appendChild(textObj);
							nextX_Down = x2 * 1 + bbox2.width * 1 + counter * 1 + addValue * 1;
							addValue = addValue * 1 + 5;
							alternateUp = true;
						} else {
							var newText = temp.getTextWidth("" + sortedarry[i][1], availableWidthDown, (sortedarry[i][0]), bbox2.width);
							var textObj = drawTagCloudSVGText(nextX_Down, previousY_DOWN, newText, sortedarry[i][2], "", "", (sortedarry[i][0]), "range_" + i + sortedarry[i][2], sortedarry[i][3], sortedarry[i][4], this.m_wordfontfamily);
							document.getElementById("svg" + this.m_objectid).appendChild(textObj);

							previousY_DOWN = previousY_DOWN * 1 + bbox2.height * 1;
							alternateUp = true;
							nextX_Down = x2 * 1 + addValue * 1;
							addValue = addValue * 1 + 5;
						}
						totalHeight = totalHeight * 1 + bbox2.height * 1;
					} else if (availableWidthDown > bbox2.width) {
						textObj = drawTagCloudSVGText(nextX_Down, previousY_DOWN, sortedarry[i][1], sortedarry[i][2], "", "", (sortedarry[i][0]), "range_" + i + sortedarry[i][2], sortedarry[i][3], sortedarry[i][4], this.m_wordfontfamily);
						document.getElementById("svg" + temp.m_objectid).appendChild(textObj);
						totalHeight = totalHeight * 1 + bbox2.height * 1;
						nextX_Down = nextX_Down * 1 + bbox2.width * 1;
						if (bbox2.width * 1 > availableWidthDown * 1) {
							alternateUp = true;
							previousY_DOWN = previousY_DOWN * 1 + bbox2.height * 1;
						}
					}
				}
			}
		}
	}
	//	alert(totalHeight)
};

TagCloudChart.prototype.getTextWidth = function (text1, textWidth, ctxFont, wordWidth) {
	var text = text1;
	var newText = "";
	this.ctx.font = "" + ctxFont + "px " + this.m_wordfontfamily;

	var strWidth = this.ctx.measureText(text).width;
	if (text.length > 0) {
		var appendedTextWidth = (wordWidth / text.length) * 2;
	}
	for (var i = 0; i < text.length; i++) {
		//var textObj2=drawTagCloudSVGText((this.m_width/2),this.m_height/2,newText,"","","",(ctxFont),"range_"+i+"red");
		//document.getElementById("svg"+this.m_objectid).appendChild(textObj2);// without appending we can not get the width of text
		//var bbox2 = textObj2.getBBox();// removing previous text
		var bbox2 = this.getTextWidthHeight(newText, ctxFont);
		//document.getElementById("svg"+this.m_objectid).removeChild(textObj2);
		if (bbox2.width < (textWidth - appendedTextWidth) * 1) {
			newText += text[i];
		} else {
			newText = newText + "..";
			break;
		}
	}
	return newText;
};

Array.prototype.max = function () {
	return Math.max.apply(null, this);
};

Array.prototype.min = function () {
	return Math.min.apply(null, this);
};

TagCloudChart.prototype.drawColumn = function () {
	var topmargin = this.m_topmargin;
	var temp = this;
	this.barHeight = eval(document.getElementById("svg" + temp.m_objectid).height.baseVal.value - topmargin - this.m_bottommargin) / this.barColors.length;
	for (var i = 0; i < this.barColors.length; i++) {
		var rectObj = drawTagCloudSVGRect(this.m_leftmargin * 1, topmargin * 1, this.m_barwidth * 1, this.barHeight, this.barColors[i], this.barColors[i], this.getCategoryData());
		document.getElementById("svg" + temp.m_objectid).appendChild(rectObj);
		topmargin = topmargin * 1 + this.barHeight;
	}
};

///////////////////////////////End//////////////////////////
TagCloudChart.prototype.getColorsForSeries = function () {
	return this.m_seriesColorsArray;
};
TagCloudChart.prototype.setColorsForSeries = function () {
	this.m_seriesColorsArray = [];
	if (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) {
		for (var i = 0; i < this.m_seriesData.length; i++) {
			this.m_seriesColorsArray[i] = this.m_drillColor;
		}
	} else {
		var seriesColors = this.getSeriesColors();
		for (var i = 0; i < this.m_seriesData.length; i++) {
			this.m_seriesColorsArray[i] = seriesColors[i];
		}
	}
};
TagCloudChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

TagCloudChart.prototype.drawSubTitle = function () {
	//this.m_subTitle.draw();
};
TagCloudChart.prototype.drawXAxis = function () {
	this.m_xAxis.drawXAxis();
	this.m_xAxis.markXaxis();
};

TagCloudChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

TagCloudChart.prototype.getStartX = function () {
	var textmargin = 50;
	var yAxislabelDescMargin;
	//var chartXMargin=textmargin*(Math.ceil(this.seriesMap.length/2));
	var yAxisDescriptionMargin = 5;

	var formatterMargin = 5;
	var startX = (this.m_x * 1);
	return startX;
};
TagCloudChart.prototype.getEndX = function () {
	var textmargin = 50;
	var chartXMargin = textmargin * (Math.floor(this.seriesMap.length / 2));
	var endX = (this.m_x * 1) + (this.m_width * 1) - (chartXMargin) - 30;

	return endX;
};

TagCloudChart.prototype.getStartY = function () {
	var chartYMargin = 15;
	var sliderMargin = 25;
	this.m_startY = parseInt(this.m_y) + parseInt(this.m_height) - chartYMargin - this.getXAxisLabelMargin() - this.getXAxisDescriptionMargin() - this.getHorizontalLegendMargin() - sliderMargin;

	return this.m_startY;
};
TagCloudChart.prototype.getXAxisLabelMargin = function () {
	var xAxislabelDescMargin = 15;
	if (IsBoolean(this.m_xAxis.getLabelTilted())) {
		this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.m_xAxis.getLabelFontSize() + "px " + this.m_xAxis.getLabelFontFamily();
		xAxislabelDescMargin = this.ctx.measureText(this.m_categoryData[0][0]).width;
		for (var i = 1; i < this.m_categoryData.length; i++) {
			if (xAxislabelDescMargin < this.ctx.measureText(this.m_categoryData[0][i]).width)
				xAxislabelDescMargin = this.ctx.measureText(this.m_categoryData[0][i]).width;
		}
		if (xAxislabelDescMargin > this.m_height / 4) {
			xAxislabelDescMargin = (this.m_xAxis.getLabelrotation() <= 70) ? (this.m_height / 4 - 15) : this.m_height / 4;
		}
	} else {
		this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.m_xAxis.getLabelFontSize() + "px " + this.m_xAxis.getLabelFontFamily();
		var xlm = this.m_xAxis.m_labelfontsize * 1.8;
		this.noOfRows = this.setNoOfRows();
		xAxislabelDescMargin = (xlm) * this.noOfRows;
	}
	return xAxislabelDescMargin;
};

TagCloudChart.prototype.setNoOfRows = function () {
	this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.m_xAxis.m_labelfontsize + "px " + this.m_xAxis.m_labelfontfamily;
	var textWidth = this.ctx.measureText(this.m_categoryData[0][0]).width;
	var xDivision = (this.getEndX() - this.getStartX()) / this.m_categoryData[0].length;
	var noOfRow = 1;
	for (var i = 1; i < this.m_categoryData[0].length; i++) {
		if (this.ctx.measureText(this.m_categoryData[0][i]).width > xDivision)
			noOfRow = 2;
	}
	return noOfRow;
};

TagCloudChart.prototype.getXAxisDescriptionMargin = function () {
	var xAxisDescriptionMargin = 2;
	if (this.m_xAxis.getDescription() != "") {
		xAxisDescriptionMargin = this.m_xAxis.getFontSize() * 1.5;
	}
	return xAxisDescriptionMargin;
};

TagCloudChart.prototype.getEndY = function () {
	var marginForTitle = 50;
	return (this.m_y + marginForTitle);
};

TagCloudChart.prototype.getToolTipData = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries)) {
		var toolTipData;
		this.xPositions = this.m_lineCalculation[0].getXPosition();
		this.yPositions = this.m_lineCalculation[0].getYPosition();

		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
			for (var i = 0; i < this.xPositions.length; i++) {
				if (mouseX <= (this.xPositions[i] + 3) && (mouseX >= this.xPositions[i] - 3)) {
					toolTipData = {
						cat : "",
						data : []
					};
					var seriesData = (this.getSeriesData());
					toolTipData.cat = "";
					toolTipData["data"] = new Array();
					toolTipData.cat = this.getCategoryData()[0][i];
					//			   this.m_yAxis.getFormattedText(seriesData);
					for (var j = 0; j < this.getSeriesData().length; j++) {
						var data = [];
						data[0] = this.getSeriesDisplayNames()[j];
						data[1] = seriesData[j][i];
						toolTipData.data[j] = data;
					}
					break;
				}
			}
		} else {
			this.hideToolTip();
		}
		// alert(toolTipData);
		return toolTipData;
	}
};

/*************************************************************************/

function svgLine() {
	this.base = Line;
	this.base();
};
svgLine.prototype = new Line;
svgLine.prototype.drawCurveLine = function () {
	var temp = this;
	var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	newLine.setAttribute('x1', this.startXPosition);
	newLine.setAttribute('y1', this.startYPosition);
	newLine.setAttribute('x2', this.endXPosition);
	newLine.setAttribute('y2', this.endYPosition);
	newLine.setAttribute('style', 'stroke:' + this.color + '; stroke-width:2;');
	$("#svg" + temp.m_chart.m_objectid).append(newLine);
};

function svgPoint() {
	this.base = Line;
	this.base();
};

function svgTitle(m_chart) {
	this.base = Title;
	this.base(m_chart);
};
svgTitle.prototype = new Title;

svgTitle.prototype.drawTitleBox = function () {
	var temp = this;
	var x = this.m_chart.m_x * 1 + 0.5 * 1;
	var y = this.m_chart.m_y * 1 + 1 * 1;
	var w = this.m_chart.m_width * 1 - 1 * 1;
	var h = this.m_titleBarHeight * heightRatio;

	var xmlns = "http://www.w3.org/2000/svg";
	var rect = document.createElementNS(xmlns, 'rect');
	rect.setAttributeNS(null, 'x', x);
	rect.setAttributeNS(null, 'y', y);
	rect.setAttributeNS(null, 'height', h);
	rect.setAttributeNS(null, 'width', w);
	rect.setAttributeNS(null, 'fill', "#61AB17");
	$("#svg" + temp.m_chart.m_objectid).append(rect);

	var markerText = drawSVGTextLabel(this.startX, h + this.startY, this.m_chart.m_columnmarker, this.m_chart.m_markerfontcolor, "left", "end");
	markerText.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.getFontSize() + "px;font-weight:" + this.getFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$("#svg" + temp.m_chart.m_objectid).append(markerText);
};
svgTitle.prototype.drawText = function () {
	var temp = this.m_chart;
	var text = drawSVGTextLabel(temp.m_width / 2 - 80, this.startY, this.m_formattedDescription, "#000000", this.getAlign(), "end");
	text.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.getFontSize() + "px;font-weight:" + this.getFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$("#svg" + temp.m_objectid).append(text);
};

/*****************************************************/
function svgSubTitle() {
	this.base = SubTitle;
	this.base();
};
svgSubTitle.prototype = new SubTitle;
svgSubTitle.prototype.drawText = function () {
	var temp = this.m_chart;
	var text = drawSVGText(this.startX, this.startY, this.m_formattedDescription, this.m_fontColor, this.getAlign(), "end");
	text.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.getFontSize() + "px;font-weight:" + this.getFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
	$("#svg" + temp.m_objectid).append(text);
};
//# sourceURL=TagCloudChart.js