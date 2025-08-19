/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: DataTable.js
 * @description DataTable
 **/
function DataTable(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();
	this.m_x = 400;
	this.m_y = 240;
	this.m_width = 300;
	this.m_height = 240;
	this.m_aggregation = "";

	this.m_charttype = "DataTable";
	this.m_linewidth = 40;

	this.m_categoryNames = [];
	this.m_seriesNames = [];
	this.m_categoryData = [];
	this.m_seriesData = [];

	this.m_startAngle = [];
	this.m_endAngle = [];
	this.m_slice = [];
	//getting the object of horizontal/vertical.
	this.m_xaxis = null;
	this.m_yaxis = new Yaxis();
	this.m_calculation = new Piecalculation();
	//this.m_xmlColor=this.getDataSet().getColors();
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_percentageInnerCutout = 0;
	this.m_isCategoryAvailable = true;

	this.m_colHeadersFieldName = [];
	this.m_gridheaderDisplayNames = [];

};

DataTable.prototype = new Chart();

DataTable.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

DataTable.prototype.setDataProvider = function (m_dataProvider) {
	this.m_dataProvider = m_dataProvider;
};

DataTable.prototype.getFieldsJson = function () {
	return this.m_fieldsJson;
};

DataTable.prototype.setFields = function (fieldsJson) {
	this.setSeries(fieldsJson);
};

DataTable.prototype.setSeries = function (fieldsData) {
	//this.fieldsData=fieldsData;
	//var j=0;
	for (var i = 0; i < fieldsData.length; i++) {
		if (IsBoolean(this.getProperAttributeNameValue(fieldsData[i], "visible"))) {
			this.m_colHeadersFieldName.push(fieldsData[i].Name);
			this.m_gridheaderDisplayNames.push(fieldsData[i].DisplayName);

			/*this.m_colHeadersFieldName[j] = this.getProperAttributeNameValue(fieldsData[i],"fieldname");
			this.m_gridheaderDisplayNames[j] = this.getProperAttributeNameValue(fieldsData[i],"displayname");
			this.m_visibleArr[j]=this.getProperAttributeNameValue(fieldsData[i],"visible");
			this.m_widthArr[j]=this.getProperAttributeNameValue(fieldsData[i],"width");
			this.m_textAlignArr[j]=this.getProperAttributeNameValue(fieldsData[i],"textAlign");

			this.m_isNumericArr[j]=this.getProperAttributeNameValue(fieldsData[i],"isNumeric");
			this.m_isFixedLabelArr[j]=this.getProperAttributeNameValue(fieldsData[i],"isfixedlabel");
			this.m_formatterArr[j]=this.getProperAttributeNameValue(fieldsData[i],"formatter");
			this.m_unitNameArr[j]=this.getProperAttributeNameValue(fieldsData[i],"unitname");
			this.m_signPositioneArr[j]=this.getProperAttributeNameValue(fieldsData[i],"signposition");
			this.m_precisionArr[this.m_colHeadersFieldName[j]]=this.getProperAttributeNameValue(fieldsData[i],"precision");
			this.m_secondFormatterArr[j]=this.getProperAttributeNameValue(fieldsData[i],"secondformatter");
			this.m_secondUnitNameArr[j]=this.getProperAttributeNameValue(fieldsData[i],"secondunitname");

			this.visibleFieldsData[j] = fieldsData[i];
			j++; */
		}
	}
};

DataTable.prototype.setLegendNames = function (m_legendNames) {
	this.m_legendNames = m_legendNames;
};

DataTable.prototype.getLegendNames = function () {
	return this.m_categoryData[0];
};

DataTable.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};

DataTable.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

DataTable.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};

DataTable.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

DataTable.prototype.getDataFromJSON = function (fieldName) {
	var data = [];
	for (var i = 0; i < this.getDataProvider().length; i++) {
		if (this.getDataProvider()[i][fieldName] == undefined || this.getDataProvider()[i][fieldName] == "undefined")
			data[i] = "";
		else
			data[i] = this.getDataProvider()[i][fieldName];
	}
	return data;
};

DataTable.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
};

DataTable.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};

DataTable.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0; i < this.getSeriesNames().length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
};

DataTable.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

DataTable.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

DataTable.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	//this.initializeDraggableDivAndCanvas();
};

DataTable.prototype.getFilterConditionsArr = function () {
	this.conditionsArr = [];
	var filterCondition = [];
	filterCondition = this.getDataSet().getDataSetFilter().getConditionsArr();
	for (var i = 0; i < filterCondition.length; i++) {
		this.conditionsArr[i] = this.getcondition(filterCondition[i]);
	}
	return this.conditionsArr;
};

DataTable.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getCategoryNames()[i]);
	}
	for (var j = 0; j < this.getSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getSeriesNames()[j]);
	}
};

DataTable.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

DataTable.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

DataTable.prototype.initializeSeriesValues = function () {
	var arr = [];
	for (var i1 = 0; i1 < this.m_seriesData[0].length; i1++) {
		arr[i1] = [];
		for (var j1 = 0; j1 < this.m_seriesData.length; j1++) {
			arr[i1][j1] = this.m_seriesData[j1][i1];
		}
	}
	this.m_seriesData = arr;
};

DataTable.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

DataTable.prototype.setRowWiseFieldsData = function () {
	var fieldsJson = this.getFieldsJson();
	this.m_categoryNames[0] = "category";
	this.m_seriesNames[0] = "values";
	var cdata = [];
	for (var i = 0; i < fieldsJson.length; i++) {
		cdata[i] = this.getProperAttributeNameValue(fieldsJson[i], "Name");
	}
	this.m_categoryData[0] = cdata;

	this.m_seriesData = [];
	var sdata = [];
	for (var j = 0; j < this.getDataProvider().length; j++) {
		if (j == 0) {
			for (var key in this.getDataProvider()[j]) {
				for (var k = 0; k < cdata.length; k++)
					if (cdata[k] == key)
						sdata.push(this.getDataProvider()[j][key]);
			}
		}
	}
	this.m_seriesData[0] = sdata;
};

DataTable.prototype.setAllFieldsNameForUnavailableCategory = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.m_categoryNames.length; i++) {
		this.m_allfieldsName.push(this.m_categoryNames[0]);
	}
	for (var j = 0; j < this.m_seriesNames.length; j++) {
		this.m_allfieldsName.push(this.m_seriesNames[0]);
	}
};

DataTable.prototype.setAllFieldsDisplayNameForUnavailableCategory = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.m_categoryNames.length; i++) {
		this.m_allfieldsDisplayName.push(this.m_categoryNames[0]);
	}
	for (var j = 0; j < this.m_seriesNames.length; j++) {
		this.m_allfieldsDisplayName.push(this.m_seriesNames[0]);
	}
};

DataTable.prototype.init = function () {
	this.data = this.getDataProvider();
};

DataTable.prototype.initializeCalculation = function () {
	var seriesdata = this.updateSeriesData(this.getSeriesData()[0]);
	this.m_calculation.init(this, seriesdata);
	this.m_yaxis.init(this, this.m_calculation);
	this.m_xmlColor = this.m_seriescolor.split(',');
};

DataTable.prototype.updateSeriesData = function (data) {
	var arr = [];
	for (var i = 0; i < data.length; i++) {
		var temp = 0;
		if (isNaN(data[i]) || data[i] == "")
			arr.push(temp);
		else
			arr.push(data[i]);
	}
	return arr;
};

DataTable.prototype.getXmlColor = function () {
	var xmlColorLength = this.m_xmlColor.length;
	if (this.m_xmlColor.length < this.m_seriesData[0].length) {
		for (var i = xmlColorLength, count = 0; i < this.m_seriesData[0].length; i++, count++) {
			this.m_xmlColor[i] = this.m_xmlColor[count];
		}
	}
	return this.m_xmlColor;
};

DataTable.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

DataTable.prototype.drawTitle = function () {
	this.m_title.draw();
};

DataTable.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

DataTable.prototype.drawChart = function () {
	this.drawDataTable();
};

DataTable.prototype.drawDataTable = function () {
	this.m_chartContainer.empty();
	var table = document.createElement("TABLE");
	table.setAttribute("id", "example" + this.m_objectid);
	table.setAttribute("class", "display");
	table.setAttribute("cellpadding", "0");
	table.setAttribute("cellspacing", "0");
	table.setAttribute("border", "0");
	table.style.fontSize = "11px";

	var tableHead = document.createElement("thead");
	var tableRow = document.createElement("tr");
	for (var h = 0; h < this.m_colHeadersFieldName.length; h++) {
		var tableHeading = document.createElement("th");
		tableHeading.innerHTML = this.m_colHeadersFieldName[h];
		tableHeading.style.background = "#34495e";

		switch (h) {
		case 0:
			tableHeading.width = "12%";
			break;
		case 1:
			tableHeading.width = "9%";
			break;
		case 2:
			tableHeading.width = "5%";
			break;
		case 3:
			tableHeading.width = "5%";
			break;
		case 4:
			tableHeading.width = "69%";
		};
		tableRow.appendChild(tableHeading);
	}
	tableHead.appendChild(tableRow);

	var tableBody = document.createElement("tbody");
	for (var r = 0; r < this.getDataProvider().length; r++) {
		var tableRow = document.createElement("tr");
		for (var c = 0; c < this.getDataProvider()[r].length; c++) {
			var tableCol = document.createElement("td");
			tableCol.innerHTML = this.getDataProvider()[r][c];
			/*if(c == 2 || c == 3)
			tableCol.innerHTML = parseFloat(this.getDataProvider()[r][c]).toFixed(2);
			 */
			switch (c) {
			case 0:
				tableCol.width = "12%";
				break;
			case 1:
				tableCol.width = "9%";
				break;
			case 2:
				tableCol.width = "5%";
				tableCol.innerHTML = parseFloat(this.getDataProvider()[r][c]).toFixed(2);
				break;
			case 3:
				tableCol.width = "5%";
				tableCol.innerHTML = parseFloat(this.getDataProvider()[r][c]).toFixed(2);
				break;
			case 4:
				tableCol.width = "69%";
			};
			tableRow.appendChild(tableCol);
		}
		tableBody.appendChild(tableRow);
	}
	table.appendChild(tableBody);
	table.appendChild(tableHead);
	this.m_chartContainer.append(table);

	$('#example' + this.m_objectid).dataTable();
};

DataTable.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.ParsePropertyJsonAttributes(jsonObject, nodeObject);
};
DataTable.prototype.ParsePropertyJsonAttributes = function (jsonObject, nodeObject) {
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

DataTable.prototype.getNodeAttributeName = function (key) {
	return "m_" + (key.toLowerCase().replace("__", "").replace("_", ""));
};

DataTable.prototype.getProperAttributeNameValue = function (json, name) {
	for (var key in json) {
		if (key.replace("__", "").replace("_", "") == name) {
			return json[key];
		}
	}
};

DataTable.prototype.getStartX = function () {
	var marginForYAxisLabels = 0;
	return (this.m_x + marginForYAxisLabels);
};
DataTable.prototype.getStartY = function () {
	var marginForXAxisLabels = 0;
	return (this.m_y + this.m_height - marginForXAxisLabels);
};

DataTable.prototype.getEndX = function () {
	var rightSideMargin = 0;
	return (this.m_x + this.m_width - rightSideMargin);
};
DataTable.prototype.getEndY = function () {
	return (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};

DataTable.prototype.getMarginForTitle = function () {
	return (IsBoolean(this.getShowGradient()) || IsBoolean(this.getTitle().m_showtitle)) ? 40 : 0;
};

DataTable.prototype.getMarginForSubTitle = function () {
	return (IsBoolean(this.m_subTitle.m_showsubtitle) && (this.m_subTitle.getDescription() != "")) ? (this.m_subTitle.getFontSize() * 1.5) : 0;
};

DataTable.prototype.getFormatterText = function (data) {
	data[0] = this.getFormatterText(this.seriesValue[i]);
	var dataWithFormatter = data;
	if (!IsBoolean(this.getFixedLabel()))
		dataWithFormatter = this.m_yaxis.getFormattedText(data);

	// = this.m_util.addFormatter(dataWithFormatter , this.m_util.getFormatterSymbol(this.m_formater,this.m_unit), "suffix");

	return dataWithFormatter;
};

DataTable.prototype.drawTooltip = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && !this.m_designMode) {
		var chart_data = this.getToolTipData(mouseX, mouseY);
		if (((chart_data || "") != "") && chart_data != {}) {
			var tooltipContent = "<table class=\" chart-tooltip toolTip\">";
			tooltipContent += "<tr>";
			tooltipContent += "<td colspan=\"2\" class=\"chart-tooltip-head\">";
			tooltipContent += chart_data.cat;
			tooltipContent += "</td>";
			tooltipContent += "</tr>";
			for (var i = 0; i < chart_data.data.length; i++) {
				tooltipContent += "<tr>";
				tooltipContent += "<td><span style=\"background-color:" + chart_data.color + "; width:10px;height:10px;\"></span>" + chart_data.data[i][0] + "</td>";
				tooltipContent += "<td align=\"right\">" + chart_data.data[i][1] + "</td>";
				tooltipContent += "</tr>";
			}
			tooltipContent += "</table>";
			this.getToolTip(tooltipContent);
		} else {
			this.hideToolTip();
		}
	}
};

DataTable.prototype.centerXCalcalculation = function () {
	this.availableWidth = this.m_width;
	this.centerX = (this.availableWidth) / 2;
};
DataTable.prototype.centerYCalcalculation = function () {
	this.availableHeight = this.m_height - this.getTotalMarginForTitleSubtitle() - this.getBottomBarMargin();
	this.centerY = (this.availableHeight) / 2 + this.getTotalMarginForTitleSubtitle();
};

DataTable.prototype.getTotalMarginForTitleSubtitle = function () {
	return (this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};
DataTable.prototype.getMarginForDataTable = function () {
	return 10;
};
DataTable.prototype.getBottomBarMargin = function () {
	return (this.isMaximized && IsBoolean(this.getShowGradient())) ? 30 : 0;
};
DataTable.prototype.lineWidthCalculation = function () {
	if (this.availableWidth >= this.availableHeight) {
		this.m_linewidth = (this.m_linewidth > this.availableHeight / 4) ? this.availableHeight / 4 : this.m_linewidth;
	} else {
		this.m_linewidth = (this.m_linewidth > this.availableWidth / 4) ? this.availableWidth / 4 : this.m_linewidth;
	}
	this.m_linewidth = (this.m_charttype == "Doughnut") ? this.m_linewidth : 10;
};

DataTable.prototype.getToolTipData = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries)) {}
};

DataTable.prototype.getFormatterText = function (data) {
	var dataWithFormatter = data;
	if (!IsBoolean(this.getFixedLabel()))
		dataWithFormatter = this.m_yaxis.getFormattedText(data);

	return dataWithFormatter;
};
//# sourceURL=DataTable.js