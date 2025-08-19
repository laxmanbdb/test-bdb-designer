/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: TrellisChart.js
 * @description TrellisChart
 **/
function TrellisChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();
	this.m_x = 10;
	this.m_y = 600;
	this.m_width = 500;
	this.m_height = 285;
	this.m_displayNames = [];
	this.m_columnHeaderDataMap = new Object();
	this.m_timer = 1;
	this.m_VTextSizeOnButton = 20;
	this.m_DGFilterHeight = 0;
	this.m_tabMargin = 0;
	this.m_marginTop = 0;
	this.m_marginLeft = 0;
	this.m_totalmargin = 0;
	this.m_colHeadersFieldName = [];
	this.m_gridheaderDisplayNames = [];
	this.m_gridFilterCondition = "";
	this.m_selectedRow = 0;
	this.m_isRowClicked = false;
	this.m_isSorted = false;
	this.m_objectID = [];
	this.m_componentid = "";
	this.ctx = "";
	this.m_subTitleHeight = 0;
	this.m_titleHeight = 0;
	this.fieldsData = "";
	this.visibleFieldsData = [];
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	
	/* * array for fields information **/
	this.m_visibleArr = [];
	this.m_widthArr = {};
	this.m_fieldChart = {};
	this.m_textAlignArr = [];
	this.m_isNumericArr = [];
	this.m_isFixedLabelArr = [];
	this.m_formatterArr = [];
	this.m_unitNameArr = [];
	this.m_signPositioneArr = [];
	this.m_precisionArr = [];
	this.m_secondFormatterArr = [];
	this.m_secondUnitNameArr = [];
	this.m_fieldType = {};
	this.m_hierarchyType = [];
	this.m_designModeDrawingFlag = true;
	this.mappedData = "";
	this.m_fieldAggregation = {};
	this.m_autoAxisSetUp = {};
	this.m_axisMinValue = {};
	this.m_axisMaxValue = {};
	this.m_rowheight = 20;
	this.m_seriesColor = {};
	this.m_seriesDataLabelProperty = {};
	
	this.m_fieldSecondaryUnit = {};
	this.m_fieldPrecision = {};
	this.m_fieldUnit = {};
	this.m_fieldSignposition = {};
	this.m_mergefieldname = "";
	this.columnFieldDetail ={};
	this.m_catFieldName = "";
	this.m_serFieldName = [];
	
	this.ColumnInfo = {};
	this.footerDiv = [];
	this.m_showparentvalue = false;
	this.m_fieldChartType = {};
	this.m_fieldAxis = {};
	this.m_fieldheaderDisplayNames = {};
	this.m_showFooter = false;
	this.m_aggregation = "sum";
	this.m_rowFieldName = [];
	this.m_rowFieldDisplayName = [];
	this.m_colFieldName = [];
	this.m_colFieldDisplayName = [];
	this.columnNameDescriptionMargin = 0;
	this.m_drawingmode = "horizontal";
	this.m_firstcolumnwidth = "";
	
	this.m_scrollbarsize = 7;
	this.m_collapseallnode = false;
}
/** @description Making prototype of chart class to inherit its properties and methods into Trellis chart **/
TrellisChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
TrellisChart.prototype.setProperty = function (gridJson) {
	this.ParseJsonAttributes(gridJson.Object, this);//parsing of chart JSON
	this.initCanvas();//initialization for canvas
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
TrellisChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "Chart") {
			for (var chartKey in jsonObject[key]) {
				switch (chartKey) {
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

/** @description Getter Method of DataProvider **/
TrellisChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description Setter for fields **/
TrellisChart.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	this.setSeries(fieldsJson);
};

/** @description creating array for each property of fields and storing in arrays **/
TrellisChart.prototype.setSeries = function (fieldsData) {
	this.fieldsData = fieldsData;
	var j = 0;
	for (var i = 0; i < fieldsData.length; i++) {
		if(IsBoolean(this.getProperAttributeNameValue(fieldsData[i],"visible") )){
			var fieldName = this.getStringARSC(fieldsData[i]["Name"]);
			this.m_colHeadersFieldName[j] = this.getStringARSC(this.getProperAttributeNameValue(fieldsData[i], "Name"));
			var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(fieldsData[i], "DisplayName"));
			this.m_gridheaderDisplayNames[j] = m_formattedDisplayName;
			this.m_fieldType[fieldName] = this.getProperAttributeNameValue(fieldsData[i], "Type");
			if(IsBoolean(isScaling)){
				this.m_widthArr[fieldName] = (this.getProperAttributeNameValue(fieldsData[i], "width"))*widthRatio;
			}
			else{
				this.m_widthArr[fieldName] = this.getProperAttributeNameValue(fieldsData[i], "width");
			}
			var ct = this.getProperAttributeNameValue(fieldsData[i], "ChartType");
			this.m_fieldChart[fieldName] = (ct) ? ct : "bar";
			this.m_autoAxisSetUp[fieldName] = this.getProperAttributeNameValue(fieldsData[i], "autoaxissetup");
			this.m_axisMinValue[fieldName] = this.getProperAttributeNameValue(fieldsData[i], "minvalue");
			this.m_axisMaxValue[fieldName] = this.getProperAttributeNameValue(fieldsData[i], "maxvalue");
			this.m_seriesColor[fieldName] = this.getProperAttributeNameValue(fieldsData[i], "Color");
			this.m_seriesDataLabelProperty[fieldName] = this.getProperAttributeNameValue(fieldsData[i], "DataLabelCustomProperties");
			if (this.m_seriesDataLabelProperty[fieldName] !== undefined) {
			    if (IsBoolean(this.m_seriesDataLabelProperty[fieldName].useFieldColor)) {
			        this.m_seriesDataLabelProperty[fieldName].dataLabelFontColor = this.m_seriesColor[fieldName];
			    }
			    if (IsBoolean(this.m_seriesDataLabelProperty[fieldName].dataLabelUseComponentFormater)) {
			        this.m_seriesDataLabelProperty[fieldName].datalabelFormaterCurrency = this.m_unit;
			        this.m_seriesDataLabelProperty[fieldName].datalabelFormaterPrecision = this.m_precision;
			        this.m_seriesDataLabelProperty[fieldName].datalabelFormaterPosition = this.m_signposition;
			        this.m_seriesDataLabelProperty[fieldName].datalabelFormaterUnit = this.m_secondaryunit;
			    }
			} else {
			    this.m_seriesDataLabelProperty[fieldName] = this.getDataLabelProperties();
			}
			this.m_fieldSecondaryUnit[fieldName] = this.getProperAttributeNameValue(fieldsData[i], "SecondaryUnit");
			this.m_fieldPrecision[fieldName] = this.getProperAttributeNameValue(fieldsData[i], "Precision");
			this.m_fieldUnit[fieldName] = this.getProperAttributeNameValue(fieldsData[i], "Unit");
			var sp = this.getProperAttributeNameValue(fieldsData[i], "SignPosition");
			var sp1 = this.getProperAttributeNameValue(fieldsData[i], "signposition");
			this.m_fieldSignposition[fieldName] = (sp) ? sp : (sp1) ? sp1 : "prefix";
			var fct = this.getProperAttributeNameValue(fieldsData[i], "FieldChartType");
			this.m_fieldChartType[fieldName] = (fct) ? fct : "clustered";
			this.m_fieldAxis[fieldName] = this.getProperAttributeNameValue(fieldsData[i], "axis");
			this.m_fieldheaderDisplayNames[fieldName] = m_formattedDisplayName;
			var aggr = this.getProperAttributeNameValue(fieldsData[i], "Aggregation");
			this.m_fieldAggregation[fieldName] = (aggr) ? aggr : "sum";
			j++;
		}
	}
};

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
TrellisChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description  Will create an id for component to be used for dashboard operation management**/
TrellisChart.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "dataGridDiv" + this.m_objectid;
};

/** @description  initialization of draggable div and its inner Content **/
TrellisChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/** @description getter method to fetch data from json and return cleaned data **/
TrellisChart.prototype.getDataFromJSON = function() {
	var data = [];
	var tempdata = [];
	for (var i = 0, length = this.getDataProvider().length; i < length; i++) {
		var tempmap = {};
		for (key in this.getDataProvider()[i]) {
			tempmap[key] = this.getDataProvider()[i][key];
		}
		tempdata.push(tempmap);
	}
	for ( var i in tempdata) {
		if (tempdata[i] == undefined || tempdata[i] == "undefined")
			data[i] = "";
		else
			data[i] = tempdata[i];
		for ( var key in data[i]) {
			var value = data[i][key];
			delete data[i][key];
			var removeUC = this.getStringARSC(key);
			data[i][removeUC] = value;
		}
	}
	return data;
};

/** @description initialization of Trellis **/
TrellisChart.prototype.init = function() {
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);
	this.m_seriesData = this.getDataFromJSON();
	// this.m_seriesData=updateSeriesData(this.m_seriesData);//called for handle
	/** comma separated numeric string data like-"1,234.00" **/
	this.isSeriesDataEmpty();
	this.updateGlobalVariableWithColumnData();
	// if (!IsBoolean(this.m_isEmptySeries))
	this.createDatagrid();
};

/** @description updation of global variable **/
TrellisChart.prototype.updateGlobalVariableWithColumnData = function() {
	var temp = this;
	if (temp.getGlobalKey() != "" && temp.m_dashboard != ""
			&& temp.m_dashboard != undefined) {
		var globalVariableObj = temp.m_dashboard.getGlobalVariable();
		if (globalVariableObj != "" && globalVariableObj != undefined) {
			var variableObj = globalVariableObj.map[temp.getGlobalKey()];
			if (variableObj != undefined) {
				variableObj.updateDefaultValueArrayMap(this.m_columnHeaderDataMap);
				variableObj.notifyDynamicalyUpdateComponents();
			}
		}
	}
};

/** @description Creation of datagrid division which will be appended in parent draggable div **/
TrellisChart.prototype.createDatagrid = function () {
	var temp = this;
	this.setRowColFieldAndDisplayName();
	this.columnNameDescriptionMargin = (this.m_colFieldDisplayName.length > 0) ? 20 : 0;
	
	this.m_titleHeight = (IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_showgradient) || IsBoolean(this.m_showmaximizebutton)) ? this.m_title.m_titleBarHeight : 0;
	this.m_subTitleHeight = (IsBoolean(this.m_subTitle.m_showsubtitle) && this.m_subTitle.getDescription() != "") ? (this.m_subTitle.getFontSize() * 1.5) + ((this.m_subTitle.m_formattedDescription.length > 1 ) ? 45 : 10) : 0;
	if (this.m_designModeDrawingFlag) {
		$("#" + temp.m_componentid).remove();
		var dataGridDiv = document.createElement("div");
		dataGridDiv.setAttribute("id", this.m_componentid);
		$("#draggableDiv" + temp.m_objectid).append(dataGridDiv);

		var tableObj = document.createElement("table");
		tableObj.setAttribute("id", "datagridTable" + this.m_objectid);
		$("#draggableDiv" + temp.m_objectid).append(tableObj);
		dataGridDiv.appendChild(tableObj);
	}
	$("#" + temp.m_componentid).css({
		"top": 1 * (this.m_y) + 1 * (this.m_titleHeight) + 1 * (this.m_subTitleHeight) + 4 +this.columnNameDescriptionMargin*1+ "px",
		"left": 1 * (this.m_x) + 2 + "px",
		"position": "absolute"
	});

	$("#datagridTable" + temp.m_objectid).css({
		"width": this.m_width - 4 * 1 + "px",
		"height": 1 * (this.m_height) - 1 * (this.m_titleHeight) - 1 * this.m_subTitleHeight - 1 * (this.m_DGFilterHeight) - 6 - this.columnNameDescriptionMargin*1+"px"
	});
	this.m_gridFilterCondition = "";
};

/** @description Checking for empty series. If there is no series present, Set this.m_isEmptySeries to false.
* It will prevent further calculation and drawing of component **/
TrellisChart.prototype.isSeriesDataEmpty = function() {
	this.m_isEmptySeries = true;
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Series") {
			this.m_isEmptySeries = false;
		}
	}
	if (this.m_seriesData.length == 0){
		this.m_isEmptySeries = true;
	}
};

/** @description Drawing of chart started by drawing different parts of chart like ChartFrame,Title,SubTitle **/
TrellisChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.chartDetailMap = [];
	this.setColFieldName();
	this.setCatFieldName();
	this.setSeriesFieldName();
	this.convertingIntoVHScale();
	this.drawPivotGrid();
};

/** @description This method will initialize JqEasyUI pivot grid and once loaded it will render charts in each cell **/
TrellisChart.prototype.drawPivotGrid = function() {
	var temp = this;
	if (!IsBoolean(this.m_isEmptySeries)) {
		if (this.m_designModeDrawingFlag) {
			if (IsBoolean(this.m_designMode)) {
				this.m_designModeDrawingFlag = false;
			} else {
				this.m_designModeDrawingFlag = true;
			}
			
			this.dataCleaning();
			this.manageColumnWidth();
			if(this.m_colFieldDisplayName.length>0){
				this.drawColumnNameInGridHeader();
			}
			/** if special character comes in column field ,replacing those special character **/
			jqEasyUI("#datagridTable" + this.m_objectid).pivotgrid({
				data : temp.m_seriesData,
				singleSelect : true,
				collapsible : true,
				rownumbers : false,
				remoteSort : true,
				showHeader : true,
				showFooter : true,
				scrollbarSize : temp.m_scrollbarsize,
				striped : true,
				nowrap : false,
				autoRowHeight : true,
				fitColumns : false,
				frozenWidth : temp.firstColumWidth(),
				loadMsg : "",
				loading : false,
				loaded : false,
				pivot : {
					rows : temp.getRowFieldName(),
					columns : temp.getColFieldName().colField,
					values : temp.getValueHeads()
				},
				forzenColumnTitle : temp.getRowDisplayName().displayName,
				valuePrecision : 0,
				onLoadSuccess : function(data) {
					temp.m_showFooter = temp.isFooterActive();
					temp.setGridCss();
					temp.setGridColors();
					temp.DirectingToCase();
					temp.FooterAddition();
					temp.removeDefaultIconsOfPivot();
					temp.settingHeaderWidth();
					temp.updateGridNodeState();
				},
				onClickRow : function () {
					temp.m_isRowClicked = true;
					var fieldNameValueMap = temp.getFieldNameValueMap();
					var drillColor = "";
					temp.updateDataPoints(fieldNameValueMap, drillColor);
					//temp.setGridColors();
					//temp.setGridCss();
				}
			});
		} else {
			if(this.m_colFieldDisplayName.length>0){
				this.drawColumnNameInGridHeader();
			}
			/** In design mode - when it is resized this method will be called  **/
			jqEasyUI("#datagridTable" + temp.m_objectid).pivotgrid("resize", {
				width : temp.m_width - 4,
				height : 1 * temp.m_height - 1 * temp.m_titleHeight - temp.m_subTitleHeight * 1 - 1 * temp.m_DGFilterHeight - temp.columnNameDescriptionMargin*1-8*1
			});
			temp.setGridColors();
			temp.setGridCss();
		}
	} else{
		this.drawMessage(this.m_status.noData);
	}
};
/** Collapse or Expand all the node when the trellis loads **/
TrellisChart.prototype.updateGridNodeState = function () {
	var temp = this;
	if(IsBoolean(temp.m_collapseallnode)){
		$("#datagridTable" + temp.m_objectid).treegrid("collapseAll");
	}else{
		$("#datagridTable" + temp.m_objectid).treegrid("expandAll");
	}
};
 /** calculation for First Column Width**/
TrellisChart.prototype.firstColumWidth = function() {
	if (this.getRowDisplayName().Width == 0)
		return 0;
	else if (this.m_firstcolumnwidth == "")
		return this.getRowDisplayName().Width;
	else
		return this.m_firstcolumnwidth;
};

/** @description Getting selected Row data **/
TrellisChart.prototype.getFieldNameValueMap = function () {
	var row = jqEasyUI("#datagridTable" + this.m_objectid).pivotgrid("getSelected");
	var valueField = this.getSeriesFieldName();
	var categoryField = this.getCatFieldName();
	var rowField = this.getRowFieldName();
	var columnField = this.getColFieldName().colField;
	var fieldNameValueMap = new Object();
	var parentText = [];
	parentText.push(row._tree_field);
	var parent = row;
	//fetching parent Node Title text
	while (parent != null) {
		parent = jqEasyUI("#datagridTable" + this.m_objectid).pivotgrid("getParent", parent._id_field);
		if (parent != null)
			parentText.push(parent._tree_field);
	}
	var textArry = parentText.reverse();
	//setting rows Column related  Data in Map
	for (var l = 0; l < rowField.length; l++) {
		fieldNameValueMap[rowField[l]] = textArry[l];
	}
	//setting Column,Value related  Data in Map
	for (var i = 0; i < valueField.length; i++) {
		for (var key in row) {
			if (key.indexOf("_" + this.getStringARSC(valueField[i])) != -1) {
				if (fieldNameValueMap[valueField[i]] == undefined)
					fieldNameValueMap[valueField[i]] = [];
				fieldNameValueMap[valueField[i]].push(row[key]);
				var dataSeperation = key.split("_");
				for (var k = 0; k < columnField.length; k++) {
					if (fieldNameValueMap[columnField[k]] == undefined)
						fieldNameValueMap[columnField[k]] = [];

					if ($.inArray(dataSeperation[k], fieldNameValueMap[columnField[k]]) == -1)
						fieldNameValueMap[columnField[k]].push(dataSeperation[k]);
				}
			}
		}
	}
	if(categoryField != ""){
		var seriesData = this.getData();
		var catData = [];
		
		for(var j=0;j<seriesData.length;j++){
			catData.push(seriesData[j][categoryField]);
		}
		fieldNameValueMap[categoryField] = $.unique(catData);
	}
	return fieldNameValueMap;
};

/** @description Resize columns in maximize mode when all column width is less than the component width**/
TrellisChart.prototype.manageColumnWidth = function() {
	if(IsBoolean(this.isMaximized)){
		var colField = this.getColFieldName()["colField"];
		var series = this.getSeriesFieldName();
		var uniqueMap = {};
		for (var i = 0; i < this.m_seriesData.length; i++) {
			var colName1 = "";
			for (var j = 0; j < colField.length; j++) {
				colName1 += this.m_seriesData[i][colField[j]] + "_";
			}
			var colName = "";
			for (var k = 0; k < series.length; k++) {
				colName = colName1+series[k] + "_";
				uniqueMap[colName] = this.m_widthArr[series[k]];
			}
		};
		var width = this.m_width - this.getRowDisplayName().Width;
		var totalWidth = 0;
		for ( var key in uniqueMap) {
			totalWidth += uniqueMap[key] * 1;
		}
		if (totalWidth < width) {
			for (var k = 0; k < series.length; k++) {
	
				this.m_widthArr[series[k]] = ((this.m_widthArr[series[k]] * 100) / (totalWidth))
						* width / 100;
			}
		}
	}
	else
	{
		for(var i = 0; i<this.fieldsData.length;i++)
		{
			if(IsBoolean(isScaling)){
				this.m_widthArr[this.fieldsData[i]["Name"]] = this.getProperAttributeNameValue(this.fieldsData[i], "width")*widthRatio;
			}
			else{
				this.m_widthArr[this.fieldsData[i]["Name"]] = this.getProperAttributeNameValue(this.fieldsData[i], "width");
			}
		}
	}
};

/** @description if merge Series On than setting header's second last row width **/	
TrellisChart.prototype.settingHeaderWidth = function() {
	var temp = this;
	if(IsBoolean(this.m_mergeseries)){
		var headerobj = $("#" + temp.m_componentid).find(".datagrid-view2").find(".datagrid-header-inner").find(".datagrid-htable").find("tbody");
		if(headerobj[0].childNodes.length>1){	
		var res = headerobj[0].childNodes[headerobj[0].childNodes.length-2];
		$(res).find(".datagrid-cell-group").each(function(){
			$(this).css("width",temp.m_colwidth);
			});
		}
	}
};

/** @description removal of unwanted icons from Pivot which are not required for trellis **/
TrellisChart.prototype.removeDefaultIconsOfPivot = function() {
	$("span").removeClass("datagrid-sort-icon");
	/** removal of sort icon **/
	$("span").removeClass("tree-icon tree-folder tree-folder-open");
	/** removal of folder icon **/
	$("span").removeClass("tree-file");
	/** removal of open file icon **/
};

/** @description drawing all column field name on the canvas **/
TrellisChart.prototype.drawColumnNameInGridHeader = function() {
	
	var colField = this.getColFieldName()["colField"];
	var series = this.getSeriesFieldName();
	var uniqueMap = {};
	for (var i = 0; i < this.m_seriesData.length; i++) {
		var colName1 = "";
		for (var j = 0; j < colField.length; j++) {
			colName1 += this.m_seriesData[i][colField[j]] + "_";
			if(IsBoolean(this.m_mergeseries))
				uniqueMap[colName] = {};
		}
		if(!IsBoolean(this.m_mergeseries)){
		var colName="";
		for (var k = 0; k < series.length; k++) {
			colName = colName1+series[k] + "_";
			uniqueMap[colName] = this.m_widthArr[series[k]];
		}
		}
	};
	var totWidth = 0;
	for (var k = 0; k < series.length; k++) {
		totWidth += this.m_widthArr[series[k]]*1;
	}
	var width = 0;
	if(!IsBoolean(this.m_mergeseries))
		width = (Object.keys(uniqueMap).length/series.length)*totWidth;
	else
		width =(Object.keys(uniqueMap).length)*this.m_colwidth;
	
	if(width>(this.m_width*1-1*this.getRowDisplayName().Width))
	{
		width = this.m_width*1-1*this.getRowDisplayName().Width;
	}
	
	
	var displayName = "";
	for(var i=0;i<this.m_colFieldDisplayName.length;i++){
		displayName+= this.m_colFieldDisplayName[i]+"/";
	}
	displayName = displayName.substring(0,displayName.length-1);
	this.startX = this.getRowDisplayName().Width*1+1*width/2;
	this.startY = 1 * (this.m_y) + 1 * (this.m_titleHeight) + 1 * (this.m_subTitleHeight) + 4 +10*1;
	this.ctx.beginPath();
	var padd = IsBoolean(this.m_updateddesign) ? "16" : "13";
	this.ctx.font = this.m_headerfontstyle + " " + this.m_headerfontweight + " "+ padd + "px "+ selectGlobalFont(this.m_headerfontfamily);
	this.ctx.textAlign = "center";
	this.ctx.fillStyle = this.m_headerfontcolor;
	this.ctx.fillText(displayName, this.startX,(this.startY * heightRatio));
	this.ctx.closePath();
};

/** @description if any field is having type as bar chart then all series will draw as bar chart only. merge series is set as false  **/
TrellisChart.prototype.convertingIntoVHScale = function() {
	var seriesName = this.getSeriesFieldName();
	/*var flag = false;
	for (var i = 0; i < seriesName.length; i++) {
		if (this.m_fieldChart[seriesName[i]] == "bar") {
			flag = true;
			break;
		}
	}*/
	
	if(this.m_drawingmode == "horizontal")
	{
		for (var i = 0; i < seriesName.length; i++) {
			this.m_fieldChart[seriesName[i]] = "bar";
		}
	}
	else
	{
		for (var i = 0; i < seriesName.length; i++) {
			if(this.m_fieldChart[seriesName[i]] == "bar"){
				this.m_fieldChart[seriesName[i]] = "column";
			}
		}
	}
	
	/*if (IsBoolean(flag)) {
		for (var i = 0; i < seriesName.length; i++) {
			this.m_fieldChart[seriesName[i]] = "bar";
		}
	}*/
};

/** @description Cleaning data if special character comes in column field **/
TrellisChart.prototype.dataCleaning = function() {
	var colField = this.getColFieldNames();
	for (var i = 0; i < this.m_seriesData.length; i++) {
		for (var j = 0; j < colField.length; j++) {
			this.m_seriesData[i][colField[j]] = (""+ this.m_seriesData[i][colField[j]]).replace(/[^\w\s]/gi, "");//removing special character
		}
	}
};

/** @description Getter method to get all column fields **/
TrellisChart.prototype.getColFieldNames = function () {
	var colField = [];
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Column") {
			colField.push(this.getStringARSC(this.m_colHeadersFieldName[j]));
		}
	}
	return colField;
};

/** @description Will call the appropriate method depending upon the configuration set to trellis **/
TrellisChart.prototype.DirectingToCase = function() {
	this.ColumnInfo = {};
	if(!IsBoolean(this.m_mergeseries) && this.getCatFieldName() != ""){
		this.Scenario1();
		/** Scenario1 when category Present and MergeSeries False **/
	}
	else if(!IsBoolean(this.m_mergeseries) && this.getCatFieldName() == ""){
		this.Scenario2();
		/** Scenario2 when category Absent and MergeSeries False **/
	}
	else if(IsBoolean(this.m_mergeseries) && this.getCatFieldName() != ""){
		this.Scenario3();
		/** Scenario3 when category Present and MergeSeries True **/
	}
	else if(IsBoolean(this.m_mergeseries) && this.getCatFieldName() == ""){
		this.Scenario4();
		/** Scenario4 when category Absent and MergeSeries True **/
	}
};

/** @description Scenario1 calculation **/
TrellisChart.prototype.Scenario1 = function() {
	var colDataMap = this.singleColumnData().colData;
	var categoryData = this.singleColumnData().catValue;
	var category = this.getCatFieldName();
	for (var i = 0; i < this.chartDetailMap.length; i++) {
		var chartObj = this.chartDetailMap[i];
		var findField = chartObj.className.split("_");
		var field = findField[findField.length - 1];
		var tempData = chartObj.data;
		var tootipData = this.getUsefulInfo(tempData);
		var data = this.calculateWhenCatPresent(tempData,[field],category,categoryData,chartObj.uniquevalue);
		var fieldArry = [];
		fieldArry = this.createSeriesFields([ field ], fieldArry);
		fieldArry = this.createCategoryFields(category, fieldArry);
		this.singleSeriesChartProperty(chartObj,colDataMap,field,data,fieldArry,tootipData);
	}
};

/** @description Scenario2 calculation **/
TrellisChart.prototype.Scenario2 = function() {
	var colDataMap = this.singleColumnData().colData;
	for (var i = 0; i < this.chartDetailMap.length; i++) {
	/** to the length of chartDetailMap which contains all chart information and data and it is created in drawAlertImages method **/
		var chartObj = this.chartDetailMap[i];
		var findField = chartObj.className.split("_");
		/** splitting class name with _ ex special_series1 will give special,series1 **/
		var field = findField[findField.length - 1];
		var tempData = chartObj.data;
		var tootipData = this.getUsefulInfo(tempData);
		var data = this.calculateWhenCatMissed(tempData,[field]);
		var fieldArry = [];
		fieldArry = this.createSeriesFields([ field ], fieldArry);
		fieldArry = this.createCategoryFields(" ", fieldArry);
		this.singleSeriesChartProperty(chartObj,colDataMap,field,data,fieldArry,tootipData);
		/** setting chart property for single series **/
	}
};

/** @description Scenario3 calculation **/
TrellisChart.prototype.Scenario3 = function() {
	var temp = this;
	var series = temp.getSeriesFieldName();
	var colDataMap = temp.MultipleColumnData(series).colData;
	var categoriesArray = temp.MultipleColumnData(series).categories;
	var category = temp.getCatFieldName();
	for (var i = 0; i < temp.chartDetailMap.length; i++) {
	/** to the length of chartDetailMap which contains all chart information and data and it is created in drawAlertImages method **/
		var chartObj = this.chartDetailMap[i];
		var tempData = chartObj.data;
		var tootipData = this.getUsefulInfo(tempData);
		var data = this.calculateWhenCatPresent(tempData,series,category,categoriesArray,chartObj.uniquevalue);
		/** getting filtered data **/
		var fieldArry = [];
		fieldArry = this.createSeriesFields(series, fieldArry);
		/** creating series field for chart **/
		fieldArry = temp.createCategoryFields(category, fieldArry);
		/** creating category field for chart **/
		this.MultipleSeriesChartProperty(chartObj,colDataMap,data,fieldArry,tootipData);
		/** setting chart property for single series **/
	}
};

/** @description Scenario4 calculation **/
TrellisChart.prototype.Scenario4 = function() {
	var temp = this;
	var series = temp.getSeriesFieldName();
	var colDataMap = temp.MultipleColumnData(series).colData;
	for (var i = 0; i < temp.chartDetailMap.length; i++) {
	/** to the length of chartDetailMap which contains all chart information and data and it is created in drawAlertImages method **/
		var chartObj = this.chartDetailMap[i];
		var tempData = chartObj.data;
		var tootipData = this.getUsefulInfo(tempData);
		var data = this.calculateWhenCatMissed(tempData,series);
		var fieldArry = [];
		fieldArry = this.createSeriesFields(series, fieldArry);
		if(series.length >1){
		/** if series is greater than 1 than we have to show category **/
			fieldArry = temp.createCategoryFields("default_Category", fieldArry);
		}
		else
			fieldArry = temp.createCategoryFields(" ", fieldArry);
		this.MultipleSeriesChartProperty(chartObj,colDataMap,data,fieldArry,tootipData);
	}
};

/** @description Removing unnecessary fields from data * */
TrellisChart.prototype.getUsefulInfo = function(data) {
	if (data.length > 1) {
		var unUsedField = [];
		for (var i = 0; i < this.m_rowFieldName.length; i++) {
			var field = this.m_rowFieldName[i];
			var value = data[0][field];
			for (var j = 0; j < data.length; j++) {
				if (data[j][field] != value) {
					unUsedField.push(field);
					break;
				}
			}
		}
		var newData = {};
		for ( var key in data[0]) {
			if (unUsedField.indexOf(key) == -1)
				newData[key] = data[0][key];
		}
		return newData;
	} else
		return data[0];
};

/** @description  Calculate and Return data for multi series **/
TrellisChart.prototype.singleColumnData = function() {
	var colDataMap = {};
	var category = this.getCatFieldName(); /** getting all category **/
	var UniqueCatData = {};
	for (var m = 0; m < this.chartDetailMap.length; m++) {
		var chartObj = this.chartDetailMap[m];
		var uniqueValue = chartObj.uniquevalue;
		var tmp = chartObj.className.split("_"); /** break the class name with _ **/
		var seriesName = tmp[tmp.length - 1]; /** find current series **/
		if (UniqueCatData[uniqueValue] == undefined) {
			UniqueCatData[uniqueValue] = [];
		}
		if(colDataMap[seriesName] == undefined){
			colDataMap[seriesName] = [];
		}
		var allSeriesData = [];
		for (var z = 0; z < chartObj.data.length; z++) {
			if (category == ""){
				if((chartObj.data[z][seriesName]!= "") && (!isNaN(chartObj.data[z][seriesName])))
					allSeriesData.push(chartObj.data[z][seriesName] * 1);
			}
			else {
				colDataMap[seriesName]
						.push(chartObj.data[z][seriesName] * 1);
				UniqueCatData[uniqueValue]
						.push((chartObj.data[z][category]).toString().trim());
			}
		}
			if (category == ""){
				if(IsBoolean(this.m_mergeseries)){
					colDataMap[seriesName].push(getAggregationOperatedData(allSeriesData, this.m_aggregation));
				}
				else{
					colDataMap[seriesName].push(getAggregationOperatedData(allSeriesData, this.m_fieldAggregation[seriesName]));
				}
			}
		}
	return {
		"colData" : colDataMap, /** containing series data **/
		"catValue" : UniqueCatData /** containing category data **/
	};
};

/** @description  Calculate and Return data for multi series **/
TrellisChart.prototype.MultipleColumnData = function(series) {
	var colDataMap = {};
	var allCatData = {};
	var category = this.getCatFieldName();
	for (var m = 0; m < this.chartDetailMap.length; m++) {
		var uniqueValue = this.chartDetailMap[m].uniquevalue;
		
			if (allCatData[uniqueValue] == undefined) {
				allCatData[uniqueValue] = [];
			}
			for (var k = 0; k < series.length; k++) {
				if(colDataMap[series[k]] == undefined){
					colDataMap[series[k]] = [];
				}
				var allSeriesData = [];
				for (var z = 0; z < this.chartDetailMap[m].data.length; z++) {
					if (category == ""){
					/** when cat is missing sum single cell series data **/
						if((this.chartDetailMap[m].data[z][series[k]]!= "") && (!isNaN(this.chartDetailMap[m].data[z][series[k]])))
							allSeriesData.push(this.chartDetailMap[m].data[z][series[k]] * 1);
					}
					else {
						colDataMap[series[k]].push(this.chartDetailMap[m].data[z][series[k]] * 1);
						allCatData[uniqueValue].push(this.chartDetailMap[m].data[z][category]);
					}
				}
				if (category == ""){
					if(IsBoolean(this.m_mergeseries)){
						/** perform aggregation suppose val1,val2,val3,val4 present then aggregation will apply on these values **/
						colDataMap[series[k]].push(getAggregationOperatedData(allSeriesData, this.m_aggregation));
					}
					else{
						/** perform aggregation suppose val1,val2,val3,val4 present then field aggregation will apply on these values **/
						colDataMap[series[k]].push(getAggregationOperatedData(allSeriesData, this.m_fieldAggregation[series[k]]));
					}
				}
			}
	}
	var dataCollection = {};
	dataCollection["All_Series_Data"] = [];
	for(var key in colDataMap){
		for(var i=0;i<colDataMap[key].length;i++){
			dataCollection["All_Series_Data"].push(colDataMap[key][i]);
			/** pushing all series data in data collection one by one **/
		}
	}
	return {
		"colData" : dataCollection, /** containing series data **/
		"categories" : allCatData /** containg category data **/
	};
};

/** @description Properties to set for chart with single field **/
TrellisChart.prototype.singleSeriesChartProperty = function(chartDiv,colData,series,data,fieldArry,toolTipInfo) {
	var requiredChart = this.getRequiredChart(this.m_fieldChart[series]);
//	requiredChart = requiredChart.charAt(0).toUpperCase()+ requiredChart.slice(1) + "Chart";
	var div = document.getElementById(chartDiv.id);
	/** div inside which chart will draw **/
	var values = this.calculateMaxMin(colData[series]);
	/** values contain max ,min value */
	var property = {
			"div" : div,
			"objectId" : chartDiv.id + "SingleSeriesChart",
			"minimumAxisValue" : values.min,
			"maximumAxisValue" : values.max,
			"data" : data, /** getting all data for chart **/
			"fields" : fieldArry, /** getting all series,category data **/
			"secondryunit" : this.m_secondaryunit,
			"precision" : this.m_precision,
			"numberformatter" : this.m_numberformatter,
			"unit" : this.m_unit,
			"signposition" : this.m_signposition,
			"uniqueValue" : chartDiv.uniquevalue,
			"chartType" : this.m_fieldChartType[series],
			"tooltip" : toolTipInfo /** additional tooltip information **/
		};
		this.chartDrawing(property, requiredChart);
};

/** @description return the chart name according to selected type in field **/
TrellisChart.prototype.getRequiredChart = function(fieldChart) {
	switch(fieldChart){
		case "bar" :
			return "BarChart";
		case "column" :
			return "ColumnStackChart";
		case "line":
			return "LineChart";
		case "bubble":
			return "BubbleChart";
		default:
			return "BarChart";
	}
};

/** @description Calculate data when category is not given **/
TrellisChart.prototype.MultipleSeriesChartProperty = function(chartDiv,colData,data,fieldArry,toolTipInfo) {
	var requiredChart = this.m_charttype;
	requiredChart = requiredChart.charAt(0).toUpperCase()+ requiredChart.slice(1) + "Chart";
	/** getting req chart which is selected from UI **/
	var div = document.getElementById(chartDiv.id);
	/** div inside which chart will draw **/
	var values = this.calculateMaxMin(colData["All_Series_Data"]);
	
	if(values.min>0)
	{
		var dataPercentage = (values.max-values.min)*.05;/**5 % of diffence to show both the series**/
		if((values.min - dataPercentage)>0){
		values.min = values.min - dataPercentage;
		}
	}
	var property = {
		"div" : div,
		"objectId" :chartDiv.id + "multipleSeriesChart",
		"minimumAxisValue" : values.min,
		"maximumAxisValue" : values.max,
		"data" : data,
		"fields" : fieldArry,
		"secondryunit" : this.m_secondaryunit,
		"precision" : this.m_precision,
		"unit" : this.m_unit,
		"signposition" : this.m_signposition,
		"uniqueValue" : chartDiv.uniquevalue,
		"chartType" : this.m_mergefieldcharttype, 
		"tooltip" : toolTipInfo
	};
	this.chartDrawing(property, requiredChart);
};

/** @description Calculate data when category is not given **/
TrellisChart.prototype.calculateWhenCatPresent = function(tempData, series,	category, allcategories, chartId) {
	/** var dt = {"sales":200,"profit":300,"year":2010},{"sales":120,"profit":160,"year":2011} **/
	var dt = [];
	for (var l = 0; l < tempData.length; l++) {
		var map = {};
		if (IsBoolean(this.isSeriesDataNumeric(tempData[l], series))) {
			for (var k = 0; k < series.length; k++) {
				map[series[k]] = tempData[l][series[k]];
			}
			map[category] = tempData[l][category];
			dt.push(map);
			/** one record pushed into map **/
		}
	}
	if (dt.length > 0) {
	/** if dt length is zero means no data present **/
		var catData = allcategories[chartId];
		dt = this.insertMissedCat(catData, dt, category, series);
		/** insert category if not present in data for proper visualization in footer marking **/
	}
	return dt;
};

/** @description Calculate data when category is not given **/
TrellisChart.prototype.calculateWhenCatMissed = function(tempData, series) {
	var map = {};
	for (var k = 0; k < series.length; k++) {
		var values = [];
		for (var l = 0; l < tempData.length; l++) {
			values.push(tempData[l][series[k]] * 1);
		}
		if(IsBoolean(this.m_mergeseries)){
			/** perform aggregation suppose val1,val2,val3,val4 present then aggregation will apply on these values **/
			map[series[k]] = getAggregationOperatedData(values, this.m_aggregation);
		}
		else{
		/** perform aggregation suppose val1,val2,val3,val4 present then field aggregation will apply on these values **/
			map[series[k]] = getAggregationOperatedData(values, this.m_fieldAggregation[series[k]]);
		}
		
	}

	/** if any "String Containing Field" Dropped in Series **/
	var finalMap = {};
	for ( var key in map) {
		if (!isNaN(map[key])) {
			finalMap[key] = map[key];
		}
	}
	/** if category is missed then separating putting series name into category **/
	var seriesSeperate = [];
	for ( var key in finalMap) {
		var tempMap = {};
		tempMap[key] = finalMap[key];
		tempMap["default_Category"] = key;
		seriesSeperate.push(tempMap);
	}
	/** if data is present return newLy created data **/
	if (tempData.length != 0)
		return seriesSeperate;
	else
		return [];
};

/** @description This method will add missing category data to the data **/
TrellisChart.prototype.insertMissedCat = function(catData, dt, category, fields) {
	/** get the unique category**/
	var columnCatData = catData.filter(function(item, i, ar){
		return ar.indexOf(item) === i;
	});
	columnCatData = columnCatData.sort();
	var newDataMap = [];
	for (var h = 0; h < columnCatData.length; h++) {
		var flag = false;
		for ( var key in dt) {
			if (dt[key][category] == columnCatData[h]) {
			/** if cat is already present pushing into array **/
				var map = {};
				for (var l = 0; l < fields.length; l++) {
					map[fields[l]] = dt[key][fields[l]];
				}
				map[category] = columnCatData[h];
				newDataMap.push(map);
				flag = true;
				break;
			};///end
		}
		if (flag == false) {
		/** if category is not present making series as category and pushing into array **/
			var map = {};
			for (var l = 0; l < fields.length; l++) {
				map[fields[l]] = "";
			}
			map[category] = columnCatData[h];
			newDataMap.push(map);
		};
	}
	return newDataMap;
};

/** @description Footer will be added in datagrid to show the axis marking for charts **/
TrellisChart.prototype.FooterAddition = function() {
	this.footerDiv = [];
	/** calling jQuery method for footer addition **/
	/** _tree_field is the first field name **/
	jqEasyUI("#datagridTable" + this.m_objectid).pivotgrid("reloadFooter", [ {
		"_tree_field" : " "
	} ]);
	if (IsBoolean(this.m_showFooter)) {//checking showfooter variable
		for (var i = 0; i < this.footerDiv.length; i++) {// this array contains all footer information and this array created in drawAlertImages ()
			var id = this.footerDiv[i].id;//getting footer id
			var uniqueValue = this.footerDiv[i].uniqueValue;//getting unique id
			if (this.ColumnInfo[uniqueValue] != undefined) {//getting field wise footer info
				var property = this.ColumnInfo[uniqueValue].property;//field wise property for footer
				var requiredChart = this.ColumnInfo[uniqueValue].ReqChart;//getting req chart
				var chartData = this.ColumnInfo[uniqueValue].chartData;//getting chart data
				if (chartData.data.length > 0) {//if chart contains data
					var chartContainer = $(document.getElementById(id));//div inside which chart will draw
					var chartZIndex = 10;//setting zindex
					var chart = this.createNewInstance(requiredChart,//creating chart onstance
							chartContainer, chartZIndex);
					property.Object.objectId = id + "chart";//setting id
					var padd = IsBoolean(this.m_updateddesign) ? 16 : 13;
					property.Object.Chart.xAxis.LabelFontSize = this.fontScaling(padd);//setting chart x axis label font size
					property.Object.Chart.Type = requiredChart;//chart type
					chart.m_designMode = IsBoolean(this.m_designMode);//desing mode
					chart.m_bootstrap = true;
					chart.setProperty(property);//setting chart property
					chart.setDataProvider(chartData.data);//setting data for chart
					chart.setFields(chartData.fields);//setting fields for chart
					chart.draw();//drawing chart
					var padd = IsBoolean(this.m_updateddesign) ? 14 : 12;
					chart.m_xAxis.m_labelfontsize = this.fontScaling(padd);//setting chart xAxis font size
					chart.drawChartFrame();//clearing all drawn before on footer chart
					chart.m_xAxis.drawAxisLabelsForTrellis();//drawing marking this method present in chart class
				}
			}
		}
	}
	/** hiding footer **/
	if (!IsBoolean(this.m_showFooter)) {
		$("#" + this.m_componentid).find(".datagrid-view2").find(".datagrid-footer-inner").find(".datagrid-row").css("height",0 + "px");
	}
	/** setting border zero for footer **/
	$("#" + this.m_componentid).find(".datagrid-footer-inner").css(	"border-style", "none");
};

/** @description return if footer is true or false **/
TrellisChart.prototype.isFooterActive = function(strClass) {
	var seriesName = this.getSeriesFieldName();
	if (IsBoolean(this.m_mergeseries) && this.getCatFieldName() == "") {
		/** when merge series is on **/
		if (seriesName.length > 1)
			return true;
		else if ((seriesName.length == 1) && (this.m_charttype == "bar")) {
			return true;
		} else
			return false;
	} else if (this.getCatFieldName() == "") {
		/** when merge series is off **/
		var isBar = false;
		for (var key = 0; key < seriesName.length; key++) {
			if (this.m_fieldChart[seriesName[key]] == "bar") {
				isBar = true;
				break;
			}
		}
		if (IsBoolean(isBar)) {
			return true;
		} else
			return false;
	} else
		return true;
};

/** @description It will create instances of charts, set the fields and draw with data**/
TrellisChart.prototype.chartDrawing = function (Info,requiredChart) {
	var chartContainer = $(Info.div);
	var chartZIndex = 10 ;
	var chart = this.createNewInstance(requiredChart, chartContainer, chartZIndex);
	var pro={"Object":{"componentType":"mixed_chart","objectType":"chart","subElement":"Chart","globalVariableKeyAttribute":"Globalkey","isDataSetAvailable":"true","enableScript":"true","referenceID":"","isValueFieldsAvailable":"false","showContextMenu":"false","shortName":"mix","showLocked":"false","objectName":"Mixed_1","unShowHidden":"false","percentheight":"320","width":158,"x":"0","height":227,"y":"0","initialVisibility":"true","percentwidth":"450","objectID":"card_910188d1-f659-4eb1-84bd-49f6b5fc8937","Chart":{"id":"Obj.784241DDN8439NB566NF0C7N7BBDD306B14F","Type":"Mixed","showGradient":"false","bgGradients":"0xffffff","bgAlpha":"1","bgGradientRotation":"0","exportToExcel":"true","exportToJPEG":"true","exportToPNG":"true","exportToPDF":"true","exportToPPT":"true","exportToPrint":"true","showScreenShotButton":"true","screenShotMode":"ppt","pptServiceURL":"http://bdbizviz.com/PPT/Parser","pptHeading":"Heading","pptSubHeading":"Sub Heading","subHeading":"Sub Heading","scrnShotFileName":"exportDashboard","showTooltip":"true","showMaximizeButton":"false","showExcelDownload":"true","showSubTitle":"false","showTitle":"false","GradientColor":"#BDC3C7,#BDC3C7","showLegends":false,"legendDirection":"horizontal","legendfontSize":"10","legendtextDecoration":"none","legendfontStyle":"normal","legendfontColor":"#000000","legendfontFamily":"Roboto","legendfontWeight":"normal","showcheckboxwithlegend":"false","showCheckboxSeprate":"false","showBorder":"false","borderColor":"","borderThickness":"","markerColor":"#666666","markerTransparency":0.5,"showMarkerLine":false,"showVerticalMarkerLine":false,"autoaxisSetup":"true","minimumAxisValue":"-20","maximumAxisValue":"110","baseZero":"false","FixedLabel":false,"Formater":"Currency","Unit":"USD","SignPosition":"prefix","Precision":"0","SecondaryFormater":"Number","SecondaryUnit":"Million","Globalkey":"","enableColorFromDrill":"false","showPoint":"true","lineForm":"curve","ChartType":"clustered","ChartBase":"plane","SecondChartType":"clustered","secondaryAxisShow":true,"secondAxisautoSetup":"true","secondAxisminimumValue":"0","secondAxismaximumValue":"100","secondAxisbaseZero":"false","SecondaryAxisFormater":"Currency","SecondaryAxisUnit":"none","SecondaryAxisSecondaryFormatter":"Number","SecondaryAxisSecondaryUnit":"none","SecondaryAxisPrecision":"0","SecondaryAxisSignPosition":"suffix","secondAxisDiscription":"","secondAxisfontcolor":"#000000","secondAxisfontsize":"12","secondAxisfontstyle":"normal","secondAxisfontweight":"normal","secondAxisfontfamily":"Roboto","secondaxistextdecoration":"none","lineWidth":"3","xAxis":{"ShowLineXAxis":"false","LineXAxisColor":"#ffffff","Description":"","LabelFontWeight":"normal","FontSize":"12","LabelFontColor":"0","LabelFontStyle":"normal","TextDecoration":"none","LabelFontFamily":"Roboto","Labelrotation":"-45","LabelTilted":false,"FontColor":"0","LabelTextDecoration":"none","LabelFontSize":"0","FontStyle":"normal","FontFamily":"Roboto","FontWeight":"normal","TickMarks":false,"CategoryMarkingColor":"#cccccc"},"yAxis":{"ShowLineYAxis":"false","LineYAxisColor":"#ffffff","Description":"","LabelFontWeight":"normal","FontStyle":"normal","LabelFontColor":"0","FontFamily":"Roboto","TextDecoration":"none","LabelFontStyle":"normal","LabelFontFamily":"Roboto","FontColor":"0","SecondDiscription":"","LabelTextDecoration":"none","LabelFontSize":"12","FontSize":"12","leftaxisFormater":true,"rightaxisFormater":true,"FontWeight":"normal","TickMarks":false},"Title":{"FontWeight":"normal","Description":"Year wise Expense, Revenue & Profit","FontSize":"12","TextDecoration":"none","Align":"left","FontFamily":"Roboto","FontColor":"#22313f","FontStyle":"normal","showTitle":"false"},"SubTitle":{"FontWeight":"normal","Description":"Subtitle Description","showSubTitle":"false","FontSize":"12","TextDecoration":"none","Align":"center","FontFamily":"Roboto","FontColor":"0","FontStyle":"normal"},"ConditionalColors":{"ConditionalColor":[]},"CategoryColors":{"categoryDefaultColor":"","categoryDefaultColorSet":"","showColorsFromCategoryName":"false","CategoryColor":[]},"showHorizontalMarkerLine":false,"controlledTooltip":true,"leftaxisFormater":true,"chartType":"clustered"},"clickCallBack":""}};
	pro.Object.objectId = Info.objectId;
	pro.Object.x = "inherit";
	pro.Object.y = "inherit";
	pro.Object.minimumAxisValue = Info.minimumAxisValue;
	pro.Object.maximumAxisValue = Info.maximumAxisValue;
	pro.Object.autoaxisSetup = "false";
	pro.Object.Chart.chartType = Info.chartType;
	if((Info.chartType == "100%") && (requiredChart != "BubbleChart") && (requiredChart != "LineChart")){
		pro.Object.autoaxisSetup = "true";
		pro.Object.Chart.baseZero = "true";
	}
	pro.Object.Chart.IsTrellis = true;
	pro.Object.Chart.ChartBase = this.m_chartbase;
	pro.Object.Chart.SecondaryUnit = Info.secondryunit;
	pro.Object.Chart.Precision = Info.precision;
	pro.Object.Chart.Unit = Info.unit;
	pro.Object.Chart.SignPosition = Info.signposition;
	pro.Object.Chart.NumberFormatter = Info.numberformatter;
	pro.Object.Chart.CustomTooltipWidth = this.m_customtooltipwidth;
	chart.m_designMode = IsBoolean(this.m_designMode);
	chart.m_bootstrap = true;
	chart.m_tooltipprecision = this.m_tooltipprecision;
	if((requiredChart == "BubbleChart") && (this.getCatFieldName().length == 0))//when category Missing making radius of bubble small in size
	{
		chart.minRadius = 10;
		chart.maxRadius = 12;
	}
	else if(requiredChart == "BubbleChart")
	{
		chart.minRadius = 2;
		chart.maxRadius = 14;
	}
	if(Info.tooltip != undefined){
		this.tooltipConfiguration(chart,Info);
	}
	if (requiredChart == "BarChart") {
	    pro.Object.componentType = "bar_chart";
	    pro.Object.Chart.Type = "Bar";
	}
	chart.setProperty(pro);
	chart.setDataProvider(Info.data);
	chart.setFields(Info.fields);
	chart.draw();
	if (requiredChart == "BarChart") {
	    pro.Object.componentType = "mixed_chart";
	    pro.Object.Chart.Type = "Mixed";
	};
	chart.m_xAxis.m_labelfontsize = this.fontScaling(12);
	if (Info.data.length > 0) {
	/** putting chart info into columnInfo which will use in footer drawing **/
		this.ColumnInfo[Info.uniqueValue] = {
			"property" : pro,
			"ReqChart" : requiredChart,
			"chartData" : Info
		};
	}
};

/** @description Setting tooltip configuration for each cell, later it will be used to add details in chart tooltip **/
TrellisChart.prototype.tooltipConfiguration = function(chart,Info) {
	var colField = this.m_colFieldName;
	var toolTipData = {};
	for (var k = 0; k < this.m_rowFieldName.length; k++) {
		if(Info.tooltip[this.m_rowFieldName[k]] != undefined)
		toolTipData[this.m_rowFieldDisplayName[k]] = Info.tooltip[this.m_rowFieldName[k]];
	}
	for (var k = 0; k < colField.length; k++) {
		toolTipData[this.m_colFieldDisplayName[k]] = Info.tooltip[colField[k]];
	}
	chart.additiontooltipdata = toolTipData;
	chart.m_hovercallback = "editToolTipForTrellis";
};

/** @description  getting all series fields with properties and events bind **/
TrellisChart.prototype.getValueHeads = function () {
	var values = [];
	if(IsBoolean(this.m_mergeseries))//checking is merge series is true or not
	{
		var temp =this;
		values = [];
		var valueField = {
					field : "AllField",//default value is given
					autoRowHeight : true,
					width : temp.m_colwidth,//column width this will be taken from chart general property
					title : (temp.m_mergefieldname == "")?"   ":temp.m_mergefieldname,//show title this can be set from chart General property
					op : "sum",
					align:"center",
					sort : false,
					formatter : this.drawAlertImages.bind(this,"AllField",0)//binding method
				};
				values.push(valueField);				
	}
	else
	{
		for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {//to the length of column Field name
			if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Series") {//if it is series
				var fieldname = (this.m_colHeadersFieldName[j]);//field name
				var fieldname1 = this.getStringARSC(this.m_colHeadersFieldName[j]);//removing special character
				var valueField = "";
				valueField = {
					field : fieldname1,
					autoRowHeight : true,
					width : this.m_widthArr[fieldname],//width of field 
					title : this.m_gridheaderDisplayNames[j],//display name of field
					op : "sum",
					align:"center",
					sort : false,
					formatter : this.drawAlertImages.bind(this, fieldname, j)//binding with method
				};
				values.push(valueField);
			}
		}
	}
	return values;
};

/** @description Alert and formatting: here DynamicColName contain hierarchical all column Field data + series field name like column1_series1 **/
TrellisChart.prototype.drawAlertImages = function(colName, colIndex, val, row,DynamicColName, tdObj, tdId) {
	var temp = this;
	var copyOfData = $.extend(true, {}, row);
	/** creating copy of data **/
	var data = copyOfData._rows;
	if (data != undefined) {
	/** Draw charts inside the cell **/
		var showParent = true;
		if (!IsBoolean(temp.m_showparentvalue)&& (copyOfData.children != undefined)){
			showParent = false;
		}
		if (IsBoolean(showParent)) {
			var matchArry = [];
			var DynamicColName1 = DynamicColName;
			DynamicColName = DynamicColName.replace(colName, "");
			matchArry = this.processData(data,DynamicColName);
			var width = IsBoolean(temp.m_mergeseries)?temp.m_colwidth:temp.m_widthArr[colName];
			var rowHeight = temp.m_rowheight;
			if(IsBoolean(isScaling))
				rowHeight = temp.m_rowheight*heightRatio;
			if(matchArry.length == 0){
				return '<span style="width:'+ width + 'px;height:' + rowHeight + 'px;font-family:'+selectGlobalFont(temp.m_statusfontfamily)+';font-weight:normal;font-size:'+temp.fontScaling(temp.m_statusfontsize)+'px;color:'+temp.m_statuscolor+';">'+temp.m_status.noData+'</span>';
			}
			else{
				var chartDetailMap = {};
				chartDetailMap.id = temp.getStringARSC(tdId+tdObj.cellClass);
				chartDetailMap.uniquevalue = DynamicColName1;
				chartDetailMap.data = matchArry;
				chartDetailMap.className = tdObj.cellClass;
				this.chartDetailMap.push(chartDetailMap);
				return '<div id="' + chartDetailMap.id + '" style="width:'+ width + 'px;height:' + rowHeight + 'px;"></div>';
			}
		}
	} else {
		/** for drawing of Footer in trellis **/
		var width = IsBoolean(temp.m_mergeseries) ? temp.m_colwidth : temp.m_widthArr[colName];
		var id = temp.getStringARSC(tdObj.cellClass + DynamicColName + "Footer");
		this.footerDiv.push({
			"id" : id,
			"uniqueValue" : DynamicColName
		});
		var height = (IsBoolean(this.m_showFooter)) ? 25 : 0;
		return '<div id="' + id + '" style="width:' + width + 'px;height:'+ height + 'px;"></div>';
	}
};

/** @description If repeated data present for same category than performing aggregation for that  **/
TrellisChart.prototype.processData = function(data,DynamicColName) {
	var column = this.getColFieldName().colField;
	var isColumnPresent = this.getColFieldName().isPresent;
	var matchArry = [];
	for (var i = 0; i < data.length; i++) {
		var str = "";
		if (IsBoolean(isColumnPresent)) {
			matchArry.push(data[i]);
		} else {
			for (var j = 0; j < column.length; j++) {
				str += data[i][column[j]] + "_";
				/** creating string to compare with record and if string is matched than insert into matchedArry **/
			}
			if (str == DynamicColName) {
				/** if created String matched with the current colName **/
				matchArry.push(data[i]);
			}
		}
	}
/** perform Aggregation on Data and put in Map when Category present **/
	var category = this.getCatFieldName();
	if (category != "") {
		


		if (matchArry.length > 0) {
			var unUsedField = [];
			for (var i = 0; i < this.m_rowFieldName.length; i++) {
				var field = this.m_rowFieldName[i];
				var value = matchArry[0][field];
				for (var j = 0; j < matchArry.length; j++) {
					if (matchArry[j][field] != value) {
						unUsedField.push(field);
						break;
					}
				}
			}
			var storeData = [];
			if (unUsedField.length > 0) {
				for (var i = 0; i < matchArry.length; i++) {
					var newData = {};
					for ( var key in matchArry[i]) {
						if (unUsedField.indexOf(key) == -1)
							newData[key] = matchArry[i][key];
					}
					storeData.push(newData);
				}
				matchArry = storeData;
			}
		}
		
		var series = this.getSeriesFieldName();
		var map = {};
		for (var i = 0; i < matchArry.length; i++) {
			if (map[matchArry[i][category]] == undefined) {
				map[matchArry[i][category]] = [];
			}
			map[matchArry[i][category]].push(matchArry[i]);
			/** category is the key and record present on value */
		}
		var newMap = [];
		for ( var key in map) {
			for (var i = 0; i < series.length; i++) {
				var values = [];
				for (var j = 0; j < map[key].length; j++) {
					values.push(map[key][j][series[i]]);
				}
				/** perform aggregation **/
				if(IsBoolean(this.m_mergeseries)){
					map[key][0][series[i]] = getAggregationOperatedData(values,this.m_aggregation);
				}
				else{
					map[key][0][series[i]] = getAggregationOperatedData(values,this.m_fieldAggregation[series[i]]);
				}
			}
			newMap.push(map[key][0]);
		}
			
		return newMap;
	} else
		return matchArry;
};

/** @description Set the css styles for data grid rows, columns and headers**/
TrellisChart.prototype.setGridCss = function () {
	var temp = this;
	var comp = $("#" + temp.m_componentid);
	if(temp.firstColumWidth() == 0){
		comp.find(".datagrid-view1").remove(); 
	}
	/** header properties **/
	comp.find(".panel-body").css("padding", "0px");
	comp.find(".panel").css("text-align", "left");
	comp.find(".datagrid-header-row span").css({
		"color": convertColorToHex(temp.m_headerfontcolor),
		"font-weight": temp.m_headerfontweight,
		"font-size": temp.fontScaling(temp.m_headerfontsize) + "px",
		"font-family": selectGlobalFont(temp.m_headerfontfamily),
		"font-style": temp.m_headerfontstyle,
		"text-decoration": temp.m_headertextdecoration
	});
	comp.find(".datagrid-header-row td div").css({
		"color": convertColorToHex(temp.m_headerfontcolor),
		"font-weight": temp.m_headerfontweight,
		"font-size": temp.fontScaling(temp.m_headerfontsize) + "px",
		"font-family": selectGlobalFont(temp.m_headerfontfamily),
		"font-style": temp.m_headerfontstyle,
		"text-align": temp.m_headertextalign,
	});
	/** label properties **/
	comp.find(".datagrid-cell").css({
		"padding": "0px",
		"font-weight": temp.m_headerfontweight,
		"font-size": temp.fontScaling(temp.m_headerfontsize) + "px",
		"font-family": selectGlobalFont(temp.m_headerfontfamily),
		"font-style": temp.m_headerfontstyle,
		"text-decoration": temp.m_headertextdecoration,
		"color": convertColorToHex(temp.m_headerfontcolor)
	});
	
	comp.find(".datagrid-view1 .datagrid-body .datagrid-body-inner .datagrid-btable .datagrid-row td .tree-title").css({
		"font-weight": temp.m_headerfontweight,
		"font-size": temp.fontScaling(temp.m_headerfontsize) + "px",
		"font-family": selectGlobalFont(temp.m_headerfontfamily),
		"font-style": temp.m_headerfontstyle,
		"text-decoration": temp.m_headertextdecoration,
		"color": convertColorToHex(temp.m_headerfontcolor)
	});
	/** grid horizontal/vertical line color property **/
	
	//comp.find(".datagrid-header td").css("border-color", "#000");
	if(IsBoolean(this.m_showhorizontalgridlines)){
		comp.find(".datagrid-header td").css({
			"border-right": "1px solid "+temp.m_verticalgridlinecolor,
			"border-bottom": "1px solid "+temp.m_horizontalgridlinecolor
		});
		this.setCellBorder(".datagrid-view1","0px 1px 1px 0px");
		this.setCellBorder(".datagrid-view2","0px 1px 1px 0px");
	}else{	
		comp.find(".datagrid-header td").css({
			"border-right": "1px solid "+temp.m_verticalgridlinecolor,
			"border-bottom": "0px solid "+temp.m_horizontalgridlinecolor
		});		
		this.setCellBorder(".datagrid-view1","0px 1px 0px 0px");
		this.setCellBorder(".datagrid-view2","0px 1px 0px 0px");
	}	
	comp.find(".datagrid-header").css({
		"border-width": "0",
		"background": hex2rgb(convertColorToHex(temp.m_headerchromecolor), 0.8)
	});
	/** css for hiding the row numbers which wass showing on each row **/
	comp.find(".datagrid-cell-rownumber").css("width", "0px");
	comp.find(".datagrid-header-rownumber").css("width", "0px");
	/** css for mask message " loading please wait" **/
	comp.find(".datagrid-mask").css({
		"display": "none",
		"width": "0px",
		"height": "0px",
		"opacity": "0",
		"background": "#cfcfcf"
	});

	comp.find(".datagrid-mask-msg").css({
		"opacity": "0",
		"border-color": "#fdfdfd"
	});
	comp.find(".datagrid-header-row td .datagrid-cell").css("height", ((temp.fontScaling(temp.m_headerfontsize) > 15) ? (temp.fontScaling(temp.m_headerfontsize) * 1 + 2) : 17) + "px"); // header color
	comp.find(".datagrid-header-row td div").css("text-decoration", "none");
	
	comp.find(".datagrid-view2 .datagrid-header-row .datagrid-cell-group").css("text-decoration", temp.m_headertextdecoration);
	comp.find(".datagrid-view").find(".datagrid-view1").find(".datagrid-body").find("table").css("border-collapse","initial");
	comp.find(".datagrid-view").find(".datagrid-view2").find(".datagrid-body").find("table").css("border-collapse","initial");
	
	comp.find(".datagrid-view2").find(".datagrid-header").find(".datagrid-header-row").each(function(){
		$(this).find("td").each(function(){
			$(this).css("background",hex2rgb(convertColorToHex(temp.m_headerchromecolor), 0.8));
			$(this).hover(function(){
				$(this).css("background",hex2rgb(convertColorToHex(temp.m_headerchromecolor), 0.8));
			});
		});
	});
	comp.find(".datagrid-view1").find(".datagrid-htable .datagrid-cell").css("padding","0px 8px 0px 4px");
	comp.find(".datagrid-view2").find(".datagrid-htable .datagrid-cell").css("padding","0px 8px 0px 4px");
	comp.find(".datagrid-view2").find(".datagrid-header-inner").css("width","10000px");
};

/** @description setting border for cell **/
TrellisChart.prototype.setCellBorder = function (className,borderWidth) {
	var temp = this;
	$("#" + this.m_componentid).find(".datagrid-view").find(className).find(".datagrid-body").find(".datagrid-btable").find(".datagrid-row").each(function(){
		$(this).find("td").each(function(){
			$(this).css({
				"border-bottom": temp.m_horizontalgridlinecolor,
				"border-right": temp.m_verticalgridlinecolor,
				"border-width": borderWidth,
				"border-style": "solid"
			});
		});
	});
};

/** @description Styling grid row css, currently setting to #ffffff **/
TrellisChart.prototype.setGridColors = function () {
	var temp = this;
	var comp = $("#" + temp.m_componentid);
	var headerColors = "#cccccc,#cccccc,#cccccc";
	var gridColors = ["#ffffff","#ffffff","#ffffff","#ffffff"];
	
	comp.find(".datagrid-row").css("background", gridColors[1]);
	comp.find(".datagrid-row-alt").css("background", gridColors[2]);
	comp.find(".datagrid-row-selected").css("background","#ffffff");

	comp.find(".datagrid-row").hover(
	function () {
		$(this).css("background", "#ffffff");
	},
	function () {
		comp.find(".datagrid-row").css("background", gridColors[1]);
		comp.find(".datagrid-row-alt").css("background", gridColors[2]);
		comp.find(".datagrid-row-selected").css("background", "#ffffff");
	});
};

/** @descriptionas Styling selected row **/
TrellisChart.prototype.setSelectedRowCSS = function () {
	var temp = this;
	var comp = $("#" + temp.m_componentid);
	var alternateRowColor = temp.getDatagridStyles().getAlternateRowsColor();
	var headerColors = temp.getDatagridStyles().getHeaderColors();
	if (alternateRowColor != undefined) {
		var gridColors = alternateRowColor.split(",");
		var newArr = ["#ffffff"];
		for (var i = 0; i < gridColors.length; i++)
			newArr.push(convertColorToHex(gridColors[i]));
		gridColors = newArr;
	} else {
		var gridColors = headerColors.split(",");
		var tempArr = [];
		for (var i = 0; i < gridColors.length; i++)
			tempArr.push(convertColorToHex(gridColors[i]));

		gridColors = tempArr;
		if (gridColors.length == 1) {
			gridColors.push("#ffffff");
			gridColors.push("#ffffff");
		} else if (gridColors.length == 2) {
			gridColors.push(gridColors[1]);
		}
	}
	comp.find(".datagrid-row").css("background", convertColorToHex(gridColors[1]));
	comp.find(".datagrid-row-alt").css("background", convertColorToHex(gridColors[2]));
	comp.find(".datagrid-row-selected").css("background", convertColorToHex(temp.getDatagridStyles().m_selectionColor));
};

/** @description Creation of Series field JSON which will be passed to charts **/
TrellisChart.prototype.createCategoryFields = function(category, container) {
	var fieldProp = {
		"DisplayName" : "city",
		"Type" : "Category",
		"visible" : "true",
		"PlotRadius" : "4",
		"Name" : "city",
		"Color" : "#fcdb96",
		"axis" : "none",
		"Precision" : "0",
		"PlotTransparency" : "1",
		"PlotType" : "point",
		"ChartType" : "none"
	};
	fieldProp.Type = "Category";
	fieldProp.Name = category;
	container.push(fieldProp);
	return container;
};

/** @description Creation of Series field JSON which will be passed to charts **/ 
TrellisChart.prototype.createSeriesFields = function (series,container) {
	for(var m = 0;m<series.length;m++){
		var fieldProp = {
				"DisplayName": "city",
				"Type": "",
				"visible": "true",
				"PlotRadius": "4",
				"Name": "city",
				"Color": "#fcdb96",
				"axis": "left",
				"Precision": "0",
				"PlotTransparency": "1",
				"PlotType": "point",
				"ChartType": "column",
				"DataLabelCustomProperties" : {
					"showDataLabel"	: "false",
					"useFieldColor"	: "false",
					"dataLabelTextAlign" : "center",
					"dataLabelFontColor" : "#000000",
					"dataLabelRotation" : "0",
					"dataLabelFontSize" : "12",
					"datalabelFontStyle" : "normal",
					"datalabelFontWeight" : "normal",
					"datalabelFontFamily" : "Roboto",
					"datalabelField" : "",
					"datalabelPosition" : "Top"
				}
			};	
		if(this.m_fieldChart[series[m]] == "line")
			fieldProp.ChartType = "line";
		else if(this.m_fieldChart[series[m]] == "column")
			fieldProp.ChartType = this.m_fieldChart[series[m]];
		fieldProp.axis = this.m_fieldAxis[series[m]];
		fieldProp.Type = "Series";
		fieldProp.Name = series[m];
		fieldProp.Color = this.m_seriesColor[series[m]];
		fieldProp.DisplayName = this.m_fieldheaderDisplayNames[series[m]];
		fieldProp.DataLabelCustomProperties = this.m_seriesDataLabelProperty[series[m]];
		container.push(fieldProp);
	}
	return container;
};

/** @description First column of pivot grid: width and display name which shows the row types of fields **/
TrellisChart.prototype.getRowDisplayName = function() {
	var displayName = "";
	var width = 0;
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Row") {
			width = (this.m_widthArr[this.m_colHeadersFieldName[j]])?(this.m_widthArr[this.m_colHeadersFieldName[j]]):100;
			
			break;
		}
	}
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Row") {
			displayName += this.m_gridheaderDisplayNames[j]+"/";
		}
	}
	displayName = displayName.substring(0, displayName.length - 1);
	return {
		"displayName" : displayName,
		"Width" : width
	};
};

/** @description getting all rows field **/
TrellisChart.prototype.getRowFieldName = function() {
	var rowField = [];
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Row") {
			rowField.push(this.getStringARSC(this.m_colHeadersFieldName[j]));
		};
	}
	if (rowField.length == 0)
		rowField.push(" ");
	return rowField;
};

/** @description Setter Column fields into arrays after removing the special characters **/
TrellisChart.prototype.setRowColFieldAndDisplayName = function() {
	this.m_rowFieldName = [];
	this.m_rowFieldDisplayName = [];
	this.m_colFieldName = [];
	this.m_colFieldDisplayName = [];
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Row") {
			this.m_rowFieldName.push(this.getStringARSC(this.m_colHeadersFieldName[j]));
			this.m_rowFieldDisplayName.push(this.m_gridheaderDisplayNames[j]);
		};
	}
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Column") {
			this.m_colFieldName.push(this.getStringARSC(this.m_colHeadersFieldName[j]));
			this.m_colFieldDisplayName.push(this.m_gridheaderDisplayNames[j]);
		};
	}
};

/** @description  getting all column field **/
TrellisChart.prototype.getColFieldName = function () {
	return this.columnFieldDetail;
};

/** @description Setter for column field name and status **/
TrellisChart.prototype.setColFieldName = function() {
	var colField = [];
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Column") {
			colField.push(this.getStringARSC(this.m_colHeadersFieldName[j]));
		}
	}
	var flag = false;
	if (colField.length == 0) {
		flag = true;
		colField.push(" ");
	}
	this.columnFieldDetail = {
		"colField" : colField,
		"isPresent" : flag
	};
};

/** @description PlaceHolder method for only, Tool tip will draw for each chart accordingly **/
TrellisChart.prototype.getToolTipData = function (mouseX, mouseY) {
	var data = [];
	//data[0] = "";
	return {"data":data};
};

/** @description Will Draw ChartFrame and gradient if given any, default is #ffffff **/
TrellisChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

/** @description Will Draw Title on canvas if showSubTitle set to true **/
TrellisChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

/** @description Will Draw SubTitle on canvas if showSubTitle set to true **/
TrellisChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

/** @description Getter for all category field display names **/
TrellisChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_gridheaderDisplayNames;
};

/** @description Getter for all category field names **/
TrellisChart.prototype.getAllFieldsName = function () {
	return this.m_colHeadersFieldName;
};

/** @description Getter for column wise data **/
TrellisChart.prototype.getDataBycolumn = function (colName) {
	return this.m_columnHeaderDataMap[colName];
};

/** @description Getter for series data **/
TrellisChart.prototype.getData = function () {
	return this.m_seriesData;
};

/** @description Getter for series field name **/
TrellisChart.prototype.getSeriesFieldName = function() {
	return this.m_serFieldName;
};

/** @description Setter for series field name after removal of special characters**/
TrellisChart.prototype.setSeriesFieldName = function() {
	this.m_serFieldName = [];
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Series") {
			this.m_serFieldName.push(this.getStringARSC(this.m_colHeadersFieldName[j]));
		}
	}
};

/** @description Setter for category field name after removal of special characters**/
TrellisChart.prototype.setCatFieldName = function() {
	this.m_catFieldName = "";
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Category") {
			this.m_catFieldName = (this.getStringARSC(this.m_colHeadersFieldName[j]));
			break;
		}
	}
};

/** @description Getter for category field name **/
TrellisChart.prototype.getCatFieldName = function () {
	return this.m_catFieldName;
};

/** @description This will remove all special characters from the string **/
TrellisChart.prototype.getStringARSC = function (str) {
	return (str) ? (str.toString()).replace(/[^a-z0-9\s]/gi, "").replace(/[_\s]/g, "") : str;
};

/** @description return max and min value in a map **/
TrellisChart.prototype.calculateMaxMin = function(dataArray) {
	var min = this.getMinValue(dataArray);
	var max = this.getMaxValue(dataArray);
	if(min ==0 && max == 0)
		max= 100;	
	else if (min == max)
		min = 0;
	return {
		"max" : max,
		"min" : min
	};
};
/** @description return hecking whether series contain numeric value or not **/
TrellisChart.prototype.isSeriesDataNumeric = function(dataMap, Series) {
	for (var i = 0; i < Series.length; i++) {
		if (isNaN(dataMap[Series[i]]))
			return false;
	}
	return true;
};

/** @description Create instance of chart **/
TrellisChart.prototype.createNewInstance = function(strClass) {
	var args = Array.prototype.slice.call(arguments, 1);
	var clsClass = eval(strClass);
	function F() {
		return clsClass.apply(this, args);
	}
	F.prototype = clsClass.prototype;
	return new F();
};

/** @description return maximum value from array **/
TrellisChart.prototype.getMaxValue = function(data) {
	var max = 0;
	var count = 0;
	for (var i = 0; i < data.length; i++) {
		if (count == 0)
			max = data[i];

		if (data[i] > max)
			max = data[i];
		count++;
	}
	return max;
};

/** @description return minimum value from array **/
TrellisChart.prototype.getMinValue = function(data) {
	var min = 0;
	var count = 0;
	for (var i = 0; i < data.length; i++) {
		if (count == 0)
			min = data[i];

		if (data[i] < min)
			min = data[i];
		count++;
	}
	return min;
};

/** @description Getter for drill Data Points**/
TrellisChart.prototype.getDrillDataPoints = function () {
	//TODO
};

/** @description Show Trellis Component**/
TrellisChart.prototype.showWidget = function () {
	var temp = this;
	this.visibilityStatus = true;
	this.hideToolTip();
	$("#draggableDiv" + temp.m_objectid).css("display", "block");
	if(IsBoolean(this.m_isDataSetavailable)){
		this.draw();
	}
};

/**
* @description It will update the chart tool tip data with additional trellis data
* @param { data } It contains row/column information of the cell which has to be added in original tool tip
* */
function editToolTipForTrellis(data){
	var newData = data.component.additiontooltipdata;
	for(var key in newData){
		if(newData.hasOwnProperty(key)){
			var map = [ {color: "#2ECC71", shape: "cube"}, key, newData[key] ];
			data.toolTipData.data.unshift(map);
		}
	}
	data.toolTipData.highlightIndex = "";
	data.component.drawTooltipContent(data.toolTipData)
};
//# sourceURL=TrellisChart.js