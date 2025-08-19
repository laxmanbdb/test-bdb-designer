/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: PagingDataGrid.js
 * @description Paging Datagrid
 **/
function PagingDataGrid(m_chartContainer, m_zIndex) {
	this.base = DataGrid;
	this.base();
	this.m_x = 10;
	this.m_y = 600;
	this.m_width = 500;
	this.m_height = 285;
	this.m_displayNames = [];
	this.m_columnHeaderDataMap = new Object();
	this.m_aggregatedRow = [];
	this.m_timer = 1;
	this.m_VTextSizeOnButton = 20;
	this.m_tabMargin = 0;
	this.m_marginTop = 0;
	this.m_marginLeft = 0;
	this.m_totalmargin = 0;
	this.m_gridFilterCondition = "";
	this.m_selectedRow = 0;
	this.m_isRowClicked = false;
	this.m_isSorted = false;
	this.m_updateddesign = false;
	/*filter header style control*/
	this.m_filterheight=44;
	this.m_filterfontsize=16;
	this.m_filterfontfamily="BizvizFont";
	this.m_filterfontcolor="#000000";
	this.m_filterfontstyle="normal";
	this.m_filterfontweight="normal";
	this.m_filterbgcolor="#EFF0F0";
	this.m_filterbuttontextcolor="#000000";
	this.m_filterbuttonbgcolor="#ffffff";
	this.m_filterresettextcolor="#000000";
	this.m_filterresetbgcolor="#ffffff";

	this.m_objectID = [];
	this.m_componentid = "";
	this.ctx = "";
	this.m_subTitleHeight = 0;
	this.m_titleHeight = 0;
	this.m_DGFilterHeight = 0;
	this.fieldsData = "";
	this.visibleFieldsData = [];
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_pagerbackgroundcolor = "#81B1BC";
	//array for fields info..
	this.m_colHeadersFieldName = [];
	this.m_gridheaderDisplayNames = [];

	this.m_visibleArr = [];
	this.m_widthArr = [];
	this.m_textAlignArr = [];
	this.m_tooltipColumnsArr = [];
	this.m_sortingColumnsArr = []; // added to show sorting or not at column level
	this.m_numberFormatColumnsArr = []; // added to show default data or with comma
	/*DAS-837 Component was visible when data service load at start is off */
	/*this.m_fieldName = [];*/
	this.m_isNumericArr = [];
	this.m_rowaggrgationArr = {};
	this.m_isFixedLabelArr = [];
	this.m_formatterArr = [];
	this.m_unitNameArr = [];
	this.m_signPositioneArr = [];
	this.m_precisionArr = [];
	this.m_secondFormatterArr = [];
	this.m_secondUnitNameArr = [];
	
	
	this.m_selectedRows = []
	
	/*this.count = 0;*/
	this.m_tempdataProvider;
	this.m_rowheight = 25;

	/**********Property for Filter on Paging DataGrid****************/
	this.m_showpagingfilter = true;
	this.m_pagingfilterfontsize = "11";
	this.m_pagingfilterfontfamily = "";
	this.m_pagingfilterfontcolor = "#000000";
	this.m_pagingfilterfontstyle = "normal";
	this.m_pagingfiltertextdecoration = "normal";
	this.m_pagingfilterfontweight = "normal";
	this.m_designModeDrawingFlag = true;
	this.m_selectedCellInfo={};
	this.columnWiseData = {};
	
	this.m_scrollbarsize = 7;
    this.m_aggregationtitle = "Aggregation";
    this.m_aggregationtitleforna = "NA";
    this.m_aggregatedrowfontweight = "normal";
    this.m_aggregatedrowfontsize = "12";
    this.m_aggregatedrowfontfamily = "Roboto";
    this.m_aggregatedrowfontstyle = "normal";
    this.m_aggregatedrowtextdecoration = "none";
    this.m_aggregatedrowfontcolor = "#000000";
    
    /**Properties added for introducing opacity in Grid*/
    this.m_rowopacity = 0.8;
    this.m_headerrowopacity = 0.6;
    this.m_rowhoveropacity = 0.4;
    this.m_rowselectedopacity = 0.6;
    this.m_rowlinesopacity = 0.8;
    this.m_paginationbaropacity = 0.6;
    this.m_resetbuttoncolor = "#3F51B5";
    this.m_fitcolumns = true;
    
    /**Properties added for introducing styles for column in Grid*/
    this.m_enableColumnStyleArr = [];
    this.m_fontColorArr = [];
    this.m_fontSizeArr = [];
    this.m_fontStyleArr = [];
    this.m_fontWeightArr = [];
    this.m_fontFamilyArr = [];
};

/** @description Making prototype of Datagrid class to inherit its properties and methods into PagingDataGrid chart **/
PagingDataGrid.prototype = new DataGrid();

/** @description Setter Method of dataprovider **/
PagingDataGrid.prototype.setDataProvider = function (m_dataProvider) {
	this.m_dataProvider = m_dataProvider;
	this.m_tempdataProvider = m_dataProvider;
};

/** @description Getter Method of dataprovider **/
PagingDataGrid.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description Setter Method of dataprovider from grid"s inner filter ui **/
PagingDataGrid.prototype.setDataProvider1 = function (m_dataProvider) {
	this.m_dataProvider = m_dataProvider;
};
/** @description Getter Method of dataprovider **/
PagingDataGrid.prototype.getDataProvider1 = function () {
	return this.m_tempdataProvider;
};

/** @description assigning field JSON to a class variable **/
PagingDataGrid.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	this.setSeries(fieldsJson);
};

/** @description creating array for each property of fields and storing in arrays **/
PagingDataGrid.prototype.setSeries = function (fieldsData) {
	this.fieldsData = fieldsData;
	this.m_seriesVisibleArr = {};
	this.m_fieldName = [];
	this.m_colHeadersFieldName = [];
	this.m_gridheaderDisplayNames = [];
	this.m_visibleArr = [];
	this.m_widthArr = [];
	this.m_textAlignArr = [];
	this.m_tooltipColumnsArr = [];
	this.m_sortingColumnsArr = [];
	this.m_numberFormatColumnsArr = [];
	this.m_cellTypeArr = [];
	this.m_isNumericArr = [];
	this.m_isFixedLabelArr = [];
	this.m_formatterArr = [];
	this.m_unitNameArr = [];
	this.m_signPositioneArr = [];
	this.m_precisionArr = {};
	this.m_secondFormatterArr = [];
	this.m_secondUnitNameArr = [];
	this.m_plotShapeArray = [];
	this.m_fieldColors = [];
	this.visibleFieldsData = [];
	this.m_enableColumnStyleArr = [];
	this.m_fontColorArr = [];
    this.m_fontSizeArr = [];
    this.m_fontStyleArr = [];
    this.m_fontWeightArr = [];
    this.m_fontFamilyArr = [];
	this.m_isNumericArrMap = {};
	this.m_isNumericArrMapForSorting = {};
	this.legendMap = {};
	this.m_TooltipFieldsArr = {};
	var j = 0;
	for (var i = 0; i < fieldsData.length; i++) {
		 var fieldname = this.getProperAttributeNameValue(fieldsData[i], "fieldname");
	     var visible = this.getProperAttributeNameValue(fieldsData[i], "visible");
	     this.m_fieldName[j] = fieldname;
	     this.m_seriesVisibleArr[this.m_fieldName[j]] = visible;
		if (IsBoolean(visible)) {
			this.m_colHeadersFieldName[j] = fieldname;
			var m_formattedDescription = this.formattedDescription(this, this.getProperAttributeNameValue(fieldsData[i], "displayname"));
			this.m_gridheaderDisplayNames[j] = m_formattedDescription;
			this.m_visibleArr[j] = visible;
			this.m_widthArr[j] = this.getProperAttributeNameValue(fieldsData[i], "width");
			this.m_textAlignArr[j] = this.getProperAttributeNameValue(fieldsData[i], "textAlign");
			this.m_tooltipColumnsArr[j] = this.getProperAttributeNameValue(fieldsData[i], "showTooltip");
			this.m_enableColumnStyleArr[j] = this.getProperAttributeNameValue(fieldsData[i], "enableColumnStyle");
			this.m_fontColorArr[j] = this.getProperAttributeNameValue(fieldsData[i], "fontColor");
			this.m_fontSizeArr[j] = this.getProperAttributeNameValue(fieldsData[i], "fontSize");
			this.m_fontStyleArr[j] = this.getProperAttributeNameValue(fieldsData[i], "fontStyle");
			this.m_fontWeightArr[j] = this.getProperAttributeNameValue(fieldsData[i], "fontWeight");
			this.m_fontFamilyArr[j] = this.getProperAttributeNameValue(fieldsData[i], "fontFamily");

			 /**To support dashbord when we are publishing it directly without opening in design mode**/
            var cellType = this.getProperAttributeNameValue(fieldsData[i], "cellType");
            var sorting = this.getProperAttributeNameValue(fieldsData[i], "sorting");
            var numberFormatter = this.getProperAttributeNameValue(fieldsData[i], "numberFormatter");
            if(cellType == undefined){
            	cellType = IsBoolean(fieldsData[i].isNumeric)?"Numeric":"none";
            }
            this.m_cellTypeArr[j] = cellType;
            this.m_isNumericArr[j] = cellType;
            this.m_isNumericArrMap[fieldname] = cellType;
            this.m_isNumericArrMapForSorting[this.getStringARSC(fieldname)] = cellType;
            this.m_sortingColumnsArr[j] = (sorting == undefined) ? true : IsBoolean(sorting);
            this.m_numberFormatColumnsArr[j] = (numberFormatter == undefined) ? "none" : numberFormatter;
			
			this.m_rowaggrgationArr[fieldname] = this.getProperAttributeNameValue(fieldsData[i], "rowAggregation");
			this.m_isFixedLabelArr[j] = this.getProperAttributeNameValue(fieldsData[i], "isfixedlabel");
			this.m_formatterArr[j] = this.getProperAttributeNameValue(fieldsData[i], "formatter");
			this.m_unitNameArr[j] = this.getProperAttributeNameValue(fieldsData[i], "unitname");
			this.m_signPositioneArr[j] = this.getProperAttributeNameValue(fieldsData[i], "signposition");
			this.m_precisionArr[this.m_colHeadersFieldName[j]] = this.getProperAttributeNameValue(fieldsData[i], "precision");
			this.m_secondFormatterArr[j] = this.getProperAttributeNameValue(fieldsData[i], "secondformatter");
			this.m_secondUnitNameArr[j] = this.getProperAttributeNameValue(fieldsData[i], "secondunitname");
			
			this.m_plotShapeArray[j] = "cube";
			
			this.m_fieldColors[j] = this.getProperAttributeNameValue(fieldsData[i], "Color");
			this.visibleFieldsData[j] = fieldsData[i];
			var tooltipFieldName = (this.getProperAttributeNameValue(fieldsData[i], "tooltipField") !== undefined && this.getProperAttributeNameValue(fieldsData[i], "tooltipField") !== "") ? (this.getProperAttributeNameValue(fieldsData[i], "tooltipField")) : this.m_colHeadersFieldName[j];
            this.m_TooltipFieldsArr[this.m_colHeadersFieldName[j]] = tooltipFieldName.split(",");
			var tempMap = {
					"seriesName" : this.m_colHeadersFieldName[j],
					"displayName" : this.m_gridheaderDisplayNames[j],
					"color" : this.m_fieldColors[j],
					"shape" : this.m_plotShapeArray[j],
					"width" : this.m_widthArr[j],
					"textAlign" : this.m_textAlignArr[j],
					"toolTipColumn": this.m_tooltipColumnsArr[j],
					"sorting" : this.m_sortingColumnsArr[j],
					"numeric" : this.m_isNumericArr[j],
					"cellType": this.m_cellTypeArr[j],
					"numberFormatter": this.m_numberFormatColumnsArr[j],
					"fixedLabel" : this.m_isFixedLabelArr[j],
					"formatter" : this.m_formatterArr[j],
					"unitName" : this.m_unitNameArr[j],
					"signPosition" : this.m_signPositioneArr[j],
					"precision" : this.m_precisionArr[this.m_colHeadersFieldName[j]],
					"secondFormatter" : this.m_secondFormatterArr[j],
					"secondunitName" : this.m_secondUnitNameArr[j],
					"index": j,
					"enableColumnStyle": this.m_enableColumnStyleArr[j],
					"fontColor": this.m_fontColorArr[j], 
					"fontSize": this.m_fontSizeArr[j],
					"fontStyle": this.m_fontStyleArr[j],
					"fontWeight": this.m_fontWeightArr[j],
					"fontFamily": this.m_fontFamilyArr[j]
			};
			this.legendMap[this.m_colHeadersFieldName[j]] = tempMap;
			j++;
		}
	}
    this.setLegendsIntialLoad(this.m_defaultlegendfields);
};

PagingDataGrid.prototype.getLegendInfo = function () {
	return this.legendMap;
};
/** @description This method will parse the Grid JSON and create a container **/
PagingDataGrid.prototype.setProperty = function (gridJson) {
	this.ParseJsonAttributes(gridJson.Object, this);
	this.initCanvas();
};

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
PagingDataGrid.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description  initialization of draggable div and its inner Content **/
PagingDataGrid.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/** @description  Will create an id for component to be used for dashboard operation management**/
PagingDataGrid.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];

	this.m_componentid = "dataGridDiv" + this.m_objectid;
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
PagingDataGrid.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	var propertyName;
	for (var key in jsonObject) {
		if (key == "DataGrid") {
			for (var chartKey in jsonObject[key]) {
				switch (chartKey) {
				case "Title":
					for (var titleKey in jsonObject[key][chartKey]) {
						propertyName = this.getNodeAttributeName(titleKey);
						nodeObject.m_title[propertyName] = jsonObject[key][chartKey][titleKey];
					}
					break;
				case "SubTitle":
					for (var subTitleKey in jsonObject[key][chartKey]) {
						propertyName = this.getNodeAttributeName(subTitleKey);
						nodeObject.m_subTitle[propertyName] = jsonObject[key][chartKey][subTitleKey];
					}
					break;

				case "LinkButton":
					for (var linkButtonKey in jsonObject[key][chartKey]) {
						propertyName = this.getNodeAttributeName(linkButtonKey);
						nodeObject.m_linkbutton[propertyName] = jsonObject[key][chartKey][linkButtonKey];
					}
					break;
				case "Column":
					for (var columnKey in jsonObject[key][chartKey]) {
						propertyName = this.getNodeAttributeName(columnKey);
						nodeObject.m_column[propertyName] = jsonObject[key][chartKey][columnKey];
					}
					break;
				case "DatagridStyles":
					for (var datagridStylesKey in jsonObject[key][chartKey]) {
						propertyName = this.getNodeAttributeName(datagridStylesKey);
						nodeObject.m_datagridstyles[propertyName] = jsonObject[key][chartKey][datagridStylesKey];
					}
					break;
				case "RowData":
					for (var rowDataKey in jsonObject[key][chartKey]) {
						propertyName = this.getNodeAttributeName(rowDataKey);
						nodeObject.m_rowdata[propertyName] = jsonObject[key][chartKey][rowDataKey];
					}
					break;
				case "LinkBar":
					for (var linkBarKey in jsonObject[key][chartKey]) {
						propertyName = this.getNodeAttributeName(linkBarKey);
						nodeObject.m_linkbar[propertyName] = jsonObject[key][chartKey][linkBarKey];
					}
					break;
				case "Alerts":
					for (var alertsKey in jsonObject[key][chartKey]) {
						if (alertsKey == "AlertColumn") {
							var alertJson = jsonObject[key][chartKey];
							var alertColumnJsonArray = this.getArrayOfSingleLengthJson(alertJson.AlertColumn);
							for (var i = 0; i < alertColumnJsonArray.length; i++) {
								var alertColumnObj = new AlertColumn();
								nodeObject.m_alerts.setAlertColumns(alertColumnObj);
								var fieldname = this.getProperAttributeNameValue(alertColumnJsonArray[i], "name");
								this.m_alertObj[fieldname] = alertColumnObj;
								for (var attribute in alertColumnJsonArray[i]) {
									this.setAttributeValueToNode(attribute, alertColumnJsonArray[i], alertColumnObj);
								}
							}
						}
					}
					break;
				default:
					propertyName = this.getNodeAttributeName(chartKey);
					if (propertyName != "m_title"){
						nodeObject[propertyName] = jsonObject[key][chartKey];
					}
					break;
				}
			}
		} else {
			propertyName = this.getNodeAttributeName(key);
			nodeObject[propertyName] = jsonObject[key];
		}
	}
};
/** @description Filter will draw above the grid so setting filter height margin **/
PagingDataGrid.prototype.setDatagridFilterMargins = function () {
	this.m_DGFilterHeight = (IsBoolean(this.m_updateddesign) ? 48 : 30);
	if (isScaling)
		this.m_DGFilterHeight = this.fontScaling(this.m_DGFilterHeight);
};

/** @description Creation of datagrid division which will be appended in parent draggable div **/
PagingDataGrid.prototype.createDatagrid = function () {
	var temp = this;
	this.m_titleHeight = (IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_showgradient) || IsBoolean(this.m_showmaximizebutton)) ? this.m_title.m_titleBarHeight : 0;
	//this.m_subTitleHeight = (IsBoolean(this.m_subTitle.m_showsubtitle) && this.m_subTitle.getDescription() != "") ? (this.m_subTitle.m_formattedDescription.length * this.m_subTitle.getFontSize() * 1.5) : 0;
	this.m_subTitleHeight = (IsBoolean(this.m_subTitle.m_showsubtitle) && this.m_subTitle.getDescription() != "") ? IsBoolean(this.m_enablehtmlformate.subtitle) ? (((this.m_subTitle.getDescription().match(/<br\s*\/?>/g) || []).length + 1) * this.m_subTitle.getFontSize() * 1.5) : (this.m_subTitle.m_formattedDescription.length * this.m_subTitle.getFontSize() * 1.5) : 0;
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

	var border = ( IsBoolean(this.m_showborder)) ? (this.m_borderthickness) : 0;
	var addtionalpadding = (IsBoolean(this.m_updateddesign) ? 43 : 0);//27+16
	$("#" + temp.m_componentid).css({
		"top": 1 * (this.m_y) + 1 * (this.m_titleHeight) + 1 * this.m_subTitleHeight + 1 * (this.m_DGFilterHeight) + 1 + addtionalpadding + "px",
		"left": 1 * (this.m_x) + 1 * border + "px",
		"position": "absolute"
	}); 
	var padding = addtionalpadding + 2;
	$("#datagridTable" + temp.m_objectid).css({
		"width": this.m_width - border * 2 + "px",
		"height": 1 * (this.m_height) - 1 * (this.m_titleHeight) - this.m_subTitleHeight - 1 * (this.m_DGFilterHeight) - border * 2 - padding + "px"
	});
	this.m_gridFilterCondition = "";
};

/** @description initialization of chartFrame,Title,SubTitle,Grid**/
PagingDataGrid.prototype.init = function () {
	this.count = 0;
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);
	this.m_seriesData = this.getDataFromJSON();
	this.setVisibleFieldData();
	this.isSeriesDataEmpty();
	this.isEmptyField();
	this.isVisibleField();
	if (!IsBoolean(this.m_isEmptyField)){
		this.setDataBycolumn();
		this.updateGlobalVariableWithColumnData();	
		this.setDatagridFilterMargins();
		this.createDatagrid();
	}else{
		var temp = this;
		$("#" + temp.m_componentid).remove();
		$("#FilterContainerDiv" + temp.m_objectid).remove();
	}
};

PagingDataGrid.prototype.setVisibleFieldData = function (AllField) {
	this.m_colHeadersFieldName = [];
	this.m_gridheaderDisplayNames = [];
	this.m_fieldColors = [];
	this.m_widthArr = [];
	this.m_textAlignArr = [];
	this.m_isNumericArr = [];
	this.m_tooltipColumnsArr = [];
	this.m_sortingColumnsArr = [];
	this.m_numberFormatColumnsArr = [];
	this.m_isFixedLabelArr = [];
	this.m_formatterArr = [];
	this.m_unitNameArr = [];
	this.m_signPositioneArr = [];
	this.m_precisionArr = {};
	this.m_secondFormatterArr = [];
	this.m_secondUnitNameArr = [];
	this.m_enableColumnStyleArr = [];
	this.m_fontColorArr = [];
    this.m_fontSizeArr = [];
    this.m_fontStyleArr = [];
    this.m_fontWeightArr = [];
    this.m_fontFamilyArr = [];
	for (var i = 0; i < this.m_fieldName.length ; i++) {
		if (IsBoolean(this.m_seriesVisibleArr[this.m_fieldName[i]])) {
			this.m_colHeadersFieldName.push(this.legendMap[this.m_fieldName[i]].seriesName);
			this.m_gridheaderDisplayNames.push(this.legendMap[this.m_fieldName[i]].displayName);
			this.m_fieldColors.push(this.legendMap[this.m_fieldName[i]].color);
			this.m_widthArr.push(this.legendMap[this.m_fieldName[i]].width);
			this.m_textAlignArr.push(this.legendMap[this.m_fieldName[i]].textAlign);
			this.m_sortingColumnsArr.push(this.legendMap[this.m_fieldName[i]].sorting);
			this.m_tooltipColumnsArr.push(this.legendMap[this.m_fieldName[i]].toolTipColumn);
			this.m_numberFormatColumnsArr.push(this.legendMap[this.m_fieldName[i]].numberFormatter);
			this.m_isNumericArr.push(this.legendMap[this.m_fieldName[i]].numeric);
			this.m_isFixedLabelArr.push(this.legendMap[this.m_fieldName[i]].fixedLabel);
			this.m_formatterArr.push(this.legendMap[this.m_fieldName[i]].formatter);
			this.m_unitNameArr.push(this.legendMap[this.m_fieldName[i]].unitName);
			this.m_signPositioneArr.push(this.legendMap[this.m_fieldName[i]].signPosition);
			this.m_precisionArr[this.legendMap[this.m_fieldName[i]].seriesName] = (this.legendMap[this.m_fieldName[i]].precision);
			this.m_secondFormatterArr.push(this.legendMap[this.m_fieldName[i]].secondFormatter);
			this.m_secondUnitNameArr.push(this.legendMap[this.m_fieldName[i]].secondunitName);
			this.m_enableColumnStyleArr.push(this.legendMap[this.m_fieldName[i]].enableColumnStyle);
			this.m_fontColorArr.push(this.legendMap[this.m_fieldName[i]].fontColor);
			this.m_fontSizeArr.push(this.legendMap[this.m_fieldName[i]].fontSize);
			this.m_fontStyleArr.push(this.legendMap[this.m_fieldName[i]].fontStyle);
			this.m_fontWeightArr.push(this.legendMap[this.m_fieldName[i]].fontWeight);
			this.m_fontFamilyArr.push(this.legendMap[this.m_fieldName[i]].fontFamily);
		}
	}
};

/** @description updation of global variable **/
PagingDataGrid.prototype.updateGlobalVariableWithColumnData = function () {
	var temp = this;
	if (temp.getGlobalKey() != "" && temp.m_dashboard != "" && temp.m_dashboard != undefined) {
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
/** @description Getter for all field display names **/
PagingDataGrid.prototype.getAllFieldsDisplayName = function () {
	return this.m_gridheaderDisplayNames;
};

/** @description Getter for all field names **/
PagingDataGrid.prototype.getAllFieldsName = function () {
	return this.m_colHeadersFieldName;
};

PagingDataGrid.prototype.setDataBycolumn = function() {
    if (!IsBoolean(this.m_isEmptyField) && this.m_seriesData) {
        for (var key in this.m_seriesData[0]) {
        	if(this.m_seriesData[0].hasOwnProperty(key)){
	            var colData = [];
	            for (var j = 0; j < this.m_seriesData.length; j++) {
	                if (IsBoolean(this.m_seriesVisibleArr[key])){
	                    colData.push(this.m_seriesData[j][key]);
	                }
	            }
	            if (IsBoolean(this.m_seriesVisibleArr[key])){
	                this.m_columnHeaderDataMap[key] = colData;
	            }
	            /** Storing the aggregated cell value for each column **/
	            try{
	            	this.m_aggregatedRow[this.getStringARSC(key)] = this.getRowAggregationObject( key, colData );
	            }catch(e){
	            	console.log(e);
	            }
        	}
        }
    } else {
        for (var k = 0; k < this.m_displayNames.length; k++) {
            this.m_columnHeaderDataMap[this.m_colHeadersFieldName[k]] = [0];
        }
    }
};
PagingDataGrid.prototype.getRowAggregationObject = function(key, colData) {
	var firstKey;
	for (var key1 in this.m_rowaggrgationArr) {
		firstKey = key1;
		break;
    }
    var aggregatedValue = this.m_aggregationtitleforna;
    if ((IsBoolean(this.m_rowaggrgationArr[firstKey]=="none")) && (firstKey == key)) {
    	aggregatedValue = this.m_aggregationtitle;
    } else if (this.m_rowaggrgationArr[key] && this.m_rowaggrgationArr[key] !== "none"){
    	aggregatedValue = this.getCalculusValue(colData,this.m_rowaggrgationArr[key],this.m_isNumericArrMap[key]);
    	if(IsBoolean(this.m_rowaggrgationArr[key] !== "Count" ) && IsBoolean(this.m_precisionArr[key] !== "default")){
    		/*No Precision has been applied for aggregation type 'Count' */
    		aggregatedValue = ((1 * aggregatedValue).toFixed((this.m_precisionArr[key] == "") ? 0 : this.m_precisionArr[key]));            	
    	}else{
    		/*In case of 'default' original value will be displayed, for others it will be rounded off up to the precision selected for that column */
    		if(IsBoolean(this.m_precisionArr[key] !== "default")){
    			aggregatedValue = aggregatedValue.toFixed(this.m_precisionArr[key]);
    		}
    	}
    }else{
    	// Do nothing
    }
    return aggregatedValue;
};
/** @description calculating the value column data according to the m_rowaggregation value for Row Aggregation**/
PagingDataGrid.prototype.getCalculusValue = function(colData, rowaggrgationArr,isNumericArrMap) {
    var NumericArray = [];
    var totalSerData = 0;
    for (var i = 0, length = colData.length; i < length; i++) {
    	var temp = IsBoolean(this.valueValidation(colData[i])) ? getNumericComparableValue(colData[i])*1 : 0;
        NumericArray.push(temp);
        totalSerData = totalSerData * 1 + temp * 1;
    }
    if (rowaggrgationArr == "Sum") {
        return totalSerData;
    } else if (rowaggrgationArr == "Count") {
        var count = colData.length;
        return count;
    } else if (rowaggrgationArr == "Average") {
        var average = (totalSerData / colData.length);
        return average;
    } else if (rowaggrgationArr == "Minimum") {
        var minimum = Math.min.apply(Math, NumericArray);
        if (IsBoolean(minimum == Infinity)) {
            minimum = 0;
        }
        return minimum;
    } else if (rowaggrgationArr == "Maximum") {
        var maximum = Math.max.apply(Math, NumericArray);
        if (IsBoolean(maximum == -Infinity)) {
            maximum = 0;
        }
        return maximum;
    } else {
        return null;
    }
};

/** @description getter for DataByColumn **/
PagingDataGrid.prototype.getDataBycolumn = function (colName) {
	return this.m_columnHeaderDataMap[colName];
};
/** @description setter method to set the width of each column  **/
PagingDataGrid.prototype.setColumnWidth = function () {
	var definedWidth = 0;
	var count = 0;
	for (var i = 0; i < this.m_colHeadersFieldName.length; i++) {
		if (this.m_widthArr[i] != undefined && this.m_widthArr[i] != "") {
			definedWidth = definedWidth * 1 + (parseInt(this.m_widthArr[i]) * 1);
			count++;
		}
	}
	var remainingWidth = this.m_width - definedWidth;
	var otherColumnWidth = remainingWidth / (((this.m_colHeadersFieldName.length - count)!==0)?(this.m_colHeadersFieldName.length - count):1);
	var widthArray = [];
	/*DAS-377*/
	if(IsBoolean(this.m_fitcolumns)){
		for (var i1 = 0; i1 < this.m_colHeadersFieldName.length; i1++) {
			if (this.m_widthArr[i1] != undefined && this.m_widthArr[i1] != "") {
				widthArray[i1] = this.m_width * (this.m_widthArr[i1]/definedWidth);
			} else {
				widthArray[i1] = parseInt(otherColumnWidth);
			}
		}
		this.m_widthArr = widthArray;
	} else {
		/*DAS-377*/
		var len = this.m_colHeadersFieldName.length;
    	for (var i = 0; i < len; i++) {
    	    if (this.m_widthArr[i] != undefined && this.m_widthArr[i] != "") {
    	    	// Added below if block for column width should be adjusted while Maximize the grid when fit column disabled.
    	        if ((this.isMaximized) && remainingWidth > 0) {
    	            widthArray[i] = this.m_width * (this.m_widthArr[i] / definedWidth);
    	        } else {
    	            widthArray[i] = parseInt(this.m_widthArr[i] * 1);
    	        }
    	    } else {
    	        widthArray[i] = parseInt(otherColumnWidth);
    	    }
    	}
    	this.m_widthArr = widthArray;
	}
	
};
/** @description getter of DataGrid headers **/
PagingDataGrid.prototype.getColumnHeads = function () {
	return this.columnHeads;
};
/** @description getter of DataGrid fields with events and styling **/
PagingDataGrid.prototype.setColumnHeads = function () {
	var temp = this;
    this.columnHeads = [];
    for (var i = 0; i < this.m_colHeadersFieldName.length; i++) {
        var tempObject = {
			field: this.getStringARSC(this.m_colHeadersFieldName[i]),
			title: this.m_gridheaderDisplayNames[i],
			width: this.m_widthArr[i],
			halign: this.m_textAlignArr[i],
	        align: this.m_textAlignArr[i],
	        sortable: this.m_sortingColumnsArr[i]
        };
		/**DAS-1221 @desc custom sroting method for case sensitive strings when column type as none*/
		if(temp.m_isNumericArr[i] == "none"){
		var	tempObject = {
			field: this.getStringARSC(this.m_colHeadersFieldName[i]),
			title: this.m_gridheaderDisplayNames[i],
			width: this.m_widthArr[i],
			halign: this.m_textAlignArr[i],
		    align: this.m_textAlignArr[i],
		    sortable: this.m_sortingColumnsArr[i],
			sorter : function(a, b) {
						return temp.sortStringCaseSensitive(a,b);
					}
		};
		}
        var alert = this.getAlertObj()[this.m_colHeadersFieldName[i]];
        if (alert != undefined && (this.m_isNumericArr[i] == "Numeric" || alert.m_mode == "Static Comparison")) {
        	//Added alert.m_mode in condition for displaying static comparison indicator without depending on column type.
            if (alert.m_name == this.m_colHeadersFieldName[i]) {            	
            	if(alert.m_mode == "Range"){
            		if (IsBoolean(alert.getDynamicRange())) {
                        if (alert.getAlertType() == "colorfill") {
                            tempObject.styler = this.drawAlertImages.bind(this, temp.m_colHeadersFieldName[i], i);
                            tempObject.formatter = this.drawToolTipForCell.bind(this, temp.m_colHeadersFieldName[i], i);
                        } else {
                            tempObject.formatter = this.drawAlertImages.bind(this, temp.m_colHeadersFieldName[i], i);
                        }
                    } else if (alert.getAlertType() == "colorfill") {
                        tempObject.styler = this.drawAlertImages.bind(this, temp.m_colHeadersFieldName[i], i);
                        tempObject.formatter = this.drawToolTipForCell.bind(this, temp.m_colHeadersFieldName[i], i);
                    } else {
                        tempObject.formatter = this.drawAlertImages.bind(this, temp.m_colHeadersFieldName[i], i);
                    }
            	}else{
            		if (alert.getAlertType() == "colorfill") {
                        tempObject.styler = this.drawAlertImages.bind(this, temp.m_colHeadersFieldName[i], i);
                        tempObject.formatter = this.drawToolTipForCell.bind(this, temp.m_colHeadersFieldName[i], i);
                    } else {
                        tempObject.formatter = this.drawAlertImages.bind(this, temp.m_colHeadersFieldName[i], i);
                    }
            	}
            } else {
                /** do nothing **/
            }
        } else {
            if (IsBoolean(!IsBoolean(this.m_isFixedLabelArr[i])) && this.m_formatterArr[i] != "none" && this.m_formatterArr[i] != "" && (this.m_isNumericArr[i] == "Numeric")) {
                tempObject.formatter = this.drawToolTipForCell.bind(this, temp.m_colHeadersFieldName[i], i);
            } else {
                tempObject.nowrap = false;
                tempObject.autoRowHeight = true;
                tempObject.align = (this.m_textAlignArr[i] == "") ? ((this.m_isNumericArr[i] == "Numeric") ? "right" : "left") : this.m_textAlignArr[i];
                tempObject.formatter = this.drawToolTipForCell.bind(this, temp.m_colHeadersFieldName[i], i);
            }
        }
        this.columnHeads.push(tempObject);
    }
    this.columnHeads.push({
        field: "gridHiddenField",
        title: "gridHiddenField",
        width: "0px",
        hidden: true,
        nowrap: true,
        autoRowHeight: false
    });
};
//@descrption to compare strings parts (case Sensitive)
PagingDataGrid.prototype.sortStringCaseSensitive = function(a, b) {
	if (a == null && b == null) return 0;
	if (a == null) return -1;
	if (b == null) return 1;
	
	if (typeof a === 'string') a = a.toLowerCase();
	if (typeof b === 'string') b = b.toLowerCase();
	
	if (a < b) return -1;
	if (a > b) return 1;
	return 0; 
};
/** @description getter of table data **/
PagingDataGrid.prototype.getData = function () {
	return this.getTableData();
};
/** @description getter for all DataGrid data**/
PagingDataGrid.prototype.getTableData = function () {
	return this.Tabledata;
}
PagingDataGrid.prototype.setTableData = function () {
	this.Tabledata = [];
	this.columnWiseData = {};
	for (var i = 0; i < this.m_seriesData.length; i++) {
		var rowdata = [];
		for (var j = 0, k = 0; j < this.m_colHeadersFieldName.length; j++) {
			var associateHead = this.m_colHeadersFieldName[j];
			var val = this.m_seriesData[i][associateHead];

			if (!isNaN(getNumericComparableValue(val)) && val != "" && this.m_precisionArr[this.m_colHeadersFieldName[j]] != "default" && this.m_precisionArr[this.m_colHeadersFieldName[j]] !== "") {
				val = this.checkPrecision(val);
			}
			if(this.columnWiseData[this.getStringARSC(associateHead)] == undefined){
				this.columnWiseData[this.getStringARSC(associateHead)] = [];
			}
			if(IsBoolean(this.valueValidation(val))){
				this.columnWiseData[this.getStringARSC(associateHead)].push(val);
			}
			rowdata[this.getStringARSC(associateHead)] = val;
			/** convert to numeric value for numeric sorting **/ 
			//rowdata[this.getStringARSC(associateHead)] = (IsBoolean(this.m_isNumericArr[j]) && IsBoolean(this.valueValidation(val))) ? val*1 : val;
			k++;
		}
		// not required any hidden field data if there is no field available , but dataset id is given
		if (this.m_colHeadersFieldName.length > 0) {
			rowdata["gridHiddenField"] = i;
			this.Tabledata.push(rowdata);
		}
	}
	
	/**@description when any of the column has rowAggregation enabled, pushing extra row in the TableData to show Row Aggregation **/
	for(var key in this.m_rowaggrgationArr){
		if(this.m_rowaggrgationArr.hasOwnProperty(key) && this.m_rowaggrgationArr[key] && this.m_rowaggrgationArr[key] !== "none"){
			this.m_aggregatedRow.gridHiddenField = "aggregatedRow";
	    	this.Tabledata.push(this.m_aggregatedRow);
	    	break;
		}
	}
	var tempColumnWiseData = {};
	for(var key1 in this.columnWiseData) {
		tempColumnWiseData[key1] = {};
		tempColumnWiseData[key1]["max"] = getNumericMax(this.columnWiseData[key1]);
		tempColumnWiseData[key1]["min"] = getNumericMin(this.columnWiseData[key1]);
	}
	this.columnWiseData = {};
	this.columnWiseData = tempColumnWiseData;
	return this.Tabledata;
};

/** @description setting precision on the value **/
PagingDataGrid.prototype.checkPrecision = function (val, prec) {
	var isCommaSeparated = (("" + val).indexOf(",") > 0) ? true : false;
	var value = getNumericComparableValue(val);
	return IsBoolean(isCommaSeparated) ? getNumberWithCommas(value) : value;
};

/** @description getter for sorting the data**/
PagingDataGrid.prototype.getSortedData = function () {
	var TableData = this.m_seriesData;
	var temp = TableData.sort(function sortMultiDimensional(a, b) {
			return ((a[0] < b[0]) ? -1 : ((a[0] > b[0]) ? 1 : 0));
		});
	var Tabledata1 = [];
	for (var i = 0; i < temp.length; i++) {
		var rowdata = [];
		for (var j = 0, k = 0; j < temp[0].length; j++) {
			var associateHead = this.m_colHeadersFieldName[k];
			var val;
			val = temp[i][j];
			rowdata[associateHead] = val;
			k++;
		}
		Tabledata1.push(rowdata);
	}
	return Tabledata1;
};

/** @description starting of frame,Title,SubTitle and DataGrid Drawing **/
PagingDataGrid.prototype.drawChart = function () {
	this.createCanvasForDynamicRangeAlert();
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	var map = this.IsDrawingPossible();
	if (IsBoolean(map.permission)) {
		this.drawPagingDataGrid();
	} else {
		this.removeFilterContainerDiv();
		this.drawMessage(map.message);
	}
};

/** @description drawing of chartFrame **/
PagingDataGrid.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

/** @description drawing of Title**/
PagingDataGrid.prototype.drawTitle = function () {
	this.m_title.draw();
};

/** @description drawing of SubTitle **/
PagingDataGrid.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};
PagingDataGrid.prototype.getPagingSizeArray = function(){
	var temp = this;
	var pagesizes = $.unique([temp.m_rowcount * 1, 10, 15, 20]);
	var pagesize = pagesizes.sort(function (a, b) {
		if (isNaN(a) || isNaN(b)) {
			return a > b ? 1 : -1;
		}
		return a - b;
	});
	return pagesize;
};
PagingDataGrid.prototype.drawPagingDataGrid = function(){
	var temp = this;
	this.setColumnWidth();
	this.setColumnHeads();
	this.setTableData();
	var Tabledata = this.getTableData();
	this.drawGridFilters();
	var showpaging = true;
	var rowcount = temp.m_rowcount;
	var pagesize = temp.getPagingSizeArray();
	var scrollbarSize = temp.getScrollBarSize(Tabledata, rowcount);
	this.initDataGridAlerts();
	if (this.m_designModeDrawingFlag) {
		this.m_designModeDrawingFlag = IsBoolean(this.m_designMode) ? false : true;
		var config = {
			columns : [temp.columnHeads],
			data : Tabledata,
			autoRowHeight : false,
			singleSelect : true,
			collapsible : true,
			isEmptyRowsAdded: true,
			isNumericArrMap:temp.m_isNumericArrMapForSorting,
			rownumbers : false,
			remoteSort : false,
			fitColumns : temp.m_fitcolumns,
			showHeader : true,
			showFooter : false,
			scrollbarSize : scrollbarSize,
			striped : true,
            nowrap: !IsBoolean(temp.m_textwrap),
			pagination : showpaging,
			pagePosition : "bottom",
			// add below pageSize for rowcount (BDD-495)
			pageSize : rowcount,
			pageList : pagesize,
			loadMsg : "",
			loading : false,
			loaded : false,
			loadFilter : temp.pageFilter.bind(temp), 
//			sortName : temp.m_colHeadersFieldName[1],
//			sortOrder :"asc",
//			onSortColumn :function (sort, order){
//				jqEasyUI("#datagridTable" + temp.m_objectid).datagrid("loadData", Tabledata);
//			},
			onSortColumn: function(sortField, sortOrder) {
                if (IsBoolean(temp.m_isNumericArrMapForSorting[sortField] == "Numeric")) {
                	var TDataSortRowsArr = [];
                    var TDataSortObj = getDuplicateObject(Tabledata);
                    var TDataSortArray = $.map(TDataSortObj, function(value, index) {
                        return [value];
                    });
                    var TDataSort = [];
                    for (var i = 0; i < Tabledata.length; i++) {
                        if (IsBoolean(TDataSortArray[i][sortField] !== undefined)) {
                            TDataSortArray[i][sortField] = ((getCommaRemovedValue(TDataSortArray[i][sortField])) * 1 == 0) ? (TDataSortArray[i][sortField] === "" ? "null" : 0) : (isNaN(getCommaRemovedValue(TDataSortArray[i][sortField])) ? TDataSortArray[i][sortField] : (getCommaRemovedValue(TDataSortArray[i][sortField]) * 1));
                        }
                        TDataSort[i] = TDataSortArray[i];
                    }
                    var emptyObj = [];
                    var rowsArr = [];
                    var aggregatedRow;
                    var isAggregatedRow = false;
                    for (var i1 = 0; i1 < TDataSort.length; i1++) {
                        if (!Array.isArray(TDataSort[i1]) || isNaN(TDataSort[i1][sortField] * 1)) {
                            emptyObj.push(TDataSort[i1]);
                        } else {
                            if (TDataSort[i1].gridHiddenField !== "aggregatedRow") {
                                rowsArr.push(TDataSort[i1]);
                            } else {
                                isAggregatedRow = true;
                                aggregatedRow = TDataSort[i1];
                            }
                        }
                    }
                    console.log(emptyObj);
                    if (isAggregatedRow) {
                        rowsArr.push(aggregatedRow);
                    }

                    TDataSortRowsArr = rowsArr;
                    /**BDD-447 : For string data column make its 'ColumnType=Numeric' , apply static comparison alert, sorting = true || Preview*/
                    if(TDataSortRowsArr.length>1){
                    	jqEasyUI("#datagridTable" + temp.m_objectid).datagrid("loadData", TDataSortRowsArr);
                    }else{
                    	jqEasyUI("#datagridTable" + temp.m_objectid).datagrid("loadData", Tabledata);
                    }
                }
            },
               onSelect: function(record) {
								/**DAS-761 */
				 if (temp.m_selectedRows.indexOf(record) === -1) {
        			temp.m_selectedRows.push(record);
    			}
				
            },
			onLoadSuccess : function (data) {
				temp.setGridCss();
				/**DAS-761 */
				for(var i=0 ; i<temp.m_selectedRows.length ; i++){
					jqEasyUI("#datagridTable" + temp.m_objectid).datagrid("selectRow", temp.m_selectedRows[i]);
				}
				
				if(!IsBoolean(temp.m_designMode)){
					temp.drawMicroCharts();
                }
			},
			onClickRow : function (index, row) {
				temp.m_isRowClicked = true;
				var fieldNameValueMap = temp.getFieldNameValueMap();
				fieldNameValueMap["drillDisplayField"]=temp.getDrillDisplayFieldName(temp.m_selectedCellInfo.field,fieldNameValueMap);
				fieldNameValueMap["drillField"]=temp.getDrillFieldName(temp.m_selectedCellInfo.field,fieldNameValueMap);
				fieldNameValueMap["drillValue"]=temp.m_selectedCellInfo.value;
				var drillColor = "";
				temp.updateDataPoints(fieldNameValueMap, drillColor);
				temp.setSelectedRowCSS();
				/**DAS-761 */
				if (jqEasyUI("#datagridTable" + temp.m_objectid).datagrid('getSelections').indexOf(row) === -1) {
                    //console.log('Row unselected:', row);
                    // Your code for when a row is unselected
                    temp.m_selectedRows = temp.m_selectedRows.filter(function(elem){
   					return elem != index; 
					});
                }
			},
			onClickCell : function (index,field,value) {
				temp.m_selectedCellInfo = {};
				temp.m_selectedCellInfo.index = index;
				temp.m_selectedCellInfo.field = field;
				temp.m_selectedCellInfo.value = value;
			}
		};
		jqEasyUI("#datagridTable" + temp.m_objectid).datagrid(config);
		/** Necessory to export the grid proeprly otherwise column-width are not taken properly **/
		jqEasyUI("#datagridTable" + temp.m_objectid).datagrid({
			scrollbarSize : scrollbarSize
		});
	} else {
		//if(IsBoolean(this.m_isResizedInDesigner)){
			var addtionalpadding = (IsBoolean(this.m_updateddesign) ? (IsBoolean(temp.m_subTitleHeight === 0) ? 45 : 27) : 0);
			jqEasyUI("#datagridTable" + temp.m_objectid).datagrid("resize", {
				width : temp.m_width - 2,
				height : 1 * (temp.m_height) - 1 * (temp.m_titleHeight) - temp.m_subTitleHeight - 1 * (temp.m_DGFilterHeight) - addtionalpadding
			});
		//}
		temp.setGridCss();
	}
};
PagingDataGrid.prototype.drawMicroCharts = function() {
	for(var j=0; j<this.m_colHeadersFieldName.length; j++){
		if(this.legendMap[this.m_colHeadersFieldName[j]]){
			if(this.legendMap[this.m_colHeadersFieldName[j]].cellType == "Bullet"){
				this.drawBullet(j);
			}else if(this.legendMap[this.m_colHeadersFieldName[j]].cellType == "Sparkline"){
				this.drawSparkline(j);
			}else if(this.legendMap[this.m_colHeadersFieldName[j]].cellType == "SparkColumn"){
				this.drawSparkColumn(j);
			}else if(this.legendMap[this.m_colHeadersFieldName[j]].cellType == "SparkPie"){
				this.drawSparkPie(j);
			}else{
				// Do nothing
			}
		}
	}
};
/** @description Jquery Sparkline bullet microchart draw method  **/
PagingDataGrid.prototype.drawBullet = function(j) {
    var tooltipBGColor = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
	var config = {
	    width: Math.round(this.m_widthArr[j]) - 18,
	    height: Math.round(this.m_rowheight) - 5,
	    tooltipBackgroundColor: tooltipBGColor,
	    disableTooltips: (!IsBoolean(this.legendMap[this.m_colHeadersFieldName[j]].toolTipColumn))
	};
	$(".bullet"+this.m_objectid+this.getStringARSC(this.m_colHeadersFieldName[j])).sparkline('html', this.getBulletConfig(config, this.m_colHeadersFieldName[j], this.m_gridheaderDisplayNames[j]));
};
/** @description Jquery Sparkline line microchart draw method  **/
PagingDataGrid.prototype.drawSparkline = function(j) {
    var tooltipBGColor = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
	var config = {
		width:Math.round(this.m_widthArr[j]) - 8,
		height: Math.round(this.m_rowheight) - 5,
		dataLabel:false,
	    highlightSpotColor: true,
	    highlightLineColor: null,
		fieldName: this.m_gridheaderDisplayNames[j],
		tooltipBackgroundColor: tooltipBGColor,
		disableTooltips: (!IsBoolean(this.legendMap[this.m_colHeadersFieldName[j]].toolTipColumn)),
	};
	$(".Sparkline"+this.m_objectid+this.getStringARSC(this.m_colHeadersFieldName[j])).sparkline('html', this.getSparklineConfig(config, this.m_colHeadersFieldName[j], this.m_gridheaderDisplayNames[j]));
};
PagingDataGrid.prototype.drawSparkColumn = function(j) {
    var tooltipBGColor = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
	var config = {
		width:Math.round(this.m_widthArr[j]) - 8,
		height: Math.round(this.m_rowheight) - 5,
		dataLabel:false,
	    highlightSpotColor: true,
	    highlightLineColor: null,
		fieldName: this.m_gridheaderDisplayNames[j],
		tooltipBackgroundColor: tooltipBGColor,
		disableTooltips: (!IsBoolean(this.legendMap[this.m_colHeadersFieldName[j]].toolTipColumn)),
	};
	$(".SparkColumn"+this.m_objectid+this.getStringARSC(this.m_colHeadersFieldName[j])).sparkline('html', this.getSparkColumnConfig(config, this.m_colHeadersFieldName[j], this.m_gridheaderDisplayNames[j]));
};
PagingDataGrid.prototype.drawSparkPie = function(j) {
    var tooltipBGColor = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
	var config = {
		width:Math.round(this.m_widthArr[j]) - 8,
		height: Math.round(this.m_rowheight) - 5,
		dataLabel:false,
	    highlightSpotColor: true,
	    highlightLineColor: null,
		fieldName: this.m_gridheaderDisplayNames[j],
		tooltipBackgroundColor: tooltipBGColor,
		disableTooltips: (!IsBoolean(this.legendMap[this.m_colHeadersFieldName[j]].toolTipColumn)),
	};
	$(".SparkPie"+this.m_objectid+this.getStringARSC(this.m_colHeadersFieldName[j])).sparkline('html', this.getSparkPieConfig(config, this.m_colHeadersFieldName[j], this.m_gridheaderDisplayNames[j]));
};

PagingDataGrid.prototype.pageFilter = function (data) {
		var temp = this;
		if (typeof data.length == "number" && typeof data.splice == "function") { // is array
			data = {total : data.length, rows : data}
		}
	
		var dg = jqEasyUI("#datagridTable" + temp.m_objectid);
		var opts = dg.datagrid("options");
		var pager = dg.datagrid("getPager");
		var target = dg;

		/** if not binding temp with pageFilter use this **/
//		var opts = jqEasyUI.data(this, "datagrid").options;
//		var pager = $(this).datagrid("getPager");
//		var target = $(this);
		
		var Tabledata = temp.getTableData();
		pager.pagination({
			onSelectPage : function (pageNum, pageSize) {
				var lastpage = Math.ceil(Tabledata.length / pageSize);
				var noofrecordinpage = (pageNum != lastpage) ? pageSize : Tabledata.length % pageSize;
				var scrollbarSize = temp.getScrollBarSize(Tabledata, noofrecordinpage);

				opts.pageNumber = pageNum;
				opts.pageSize = pageSize;
				pager.pagination("refresh", {
					pageNumber : pageNum,
					pageSize : pageSize
				});
				dg.datagrid({"loadData": data, scrollbarSize : scrollbarSize});
				temp.setOverflow(scrollbarSize);
			}
		});
		if (!data.originalRows) {
			data.originalRows = (data.rows);
		}
		if (!opts.remoteSort && opts.sortName) {
			var names = opts.sortName.split(",");
			var orders = opts.sortOrder.split(",");
			data.originalRows.sort(function (r1, r2) {
				var r = 0;
				for (var i = 0; i < names.length; i++) {
					var sn = names[i];
					var so = orders[i];
					var col = target.datagrid("getColumnOption", sn);
					var sortFunc = col.sorter || function (a, b) {
						return a == b ? 0 : (a > b ? 1 : -1);
					};
					r = sortFunc(r1[sn], r2[sn]) * (so == "asc" ? 1 : -1);
					if (r != 0) {
						return r;
					}
				}
				return r;
			});
		}
		var start = (opts.pageNumber - 1) * parseInt(opts.pageSize);
		var end = start + parseInt(opts.pageSize);
		data.rows = (data.originalRows.slice(start, end));
		return data;
};
/** @description getter for scrollbar size **/
PagingDataGrid.prototype.getScrollBarSize = function (Tabledata, recordInPage) {
	if (!IsBoolean(this.m_textwrap)) {
		var rowHeight = this.getRowHeight(this.m_rowheight);
		var height = (1 * (this.m_height) - 1 * (this.m_titleHeight) - 1 * this.m_subTitleHeight - this.m_DGFilterHeight * 1 - 30);
		if ( (((Tabledata.length + 1) * rowHeight ) < height) || (((recordInPage + 1) * rowHeight ) < height) ){
			return 0;
		}else{
			return this.m_scrollbarsize;
		}
	} else{
		return this.m_scrollbarsize;
	}
};

/** @description Manage vertical scroll,when very less data will present scroll will not come otherwise it will come  **/
PagingDataGrid.prototype.setOverflow = function (scrollbarSize) {
	var temp = this;
	if (scrollbarSize == 0) {
		$("#" + temp.m_componentid).find(".datagrid-body").css("overflow-y", "hidden");
	} else {
		$("#" + temp.m_componentid).find(".datagrid-body").css("overflow-y", "auto");
	}
};

/** @description get drilled field name **/
PagingDataGrid.prototype.getDrillFieldName = function (fieldName,row) {
	for(var key in row){
		if(fieldName === this.getStringARSC(key)){
			return key;
		}
	}
};

/** @description get drilled field display name **/
PagingDataGrid.prototype.getDrillDisplayFieldName = function (fieldName,row) {
	var fieldname = this.getDrillFieldName(fieldName,row);
	for(var i = 0; i < this.m_colHeadersFieldName.length; i++){
		if(this.m_colHeadersFieldName[i] === fieldname){
			return this.m_gridheaderDisplayNames[i];
		}
	}
};

/** @description this Map contains single row details in form of key value pair  **/
PagingDataGrid.prototype.getFieldNameValueMap = function () {
	var row = jqEasyUI("#datagridTable" + this.m_objectid).datagrid("getSelected");
	var fieldNameValueMap = new Object();
	if (row != null){
		for (var i = 0; i < this.m_colHeadersFieldName.length; i++) {
			fieldNameValueMap[this.m_colHeadersFieldName[i]] = row[this.m_colHeadersFieldName[i]];
		}
	}
	if (row != null && this.m_seriesData[row["gridHiddenField"]] != undefined){
		return this.m_seriesData[row["gridHiddenField"]];
	}else{
		return fieldNameValueMap;
	}
};

/** @description generation of ToolTip **/
PagingDataGrid.prototype.drawToolTipForCell = function (colName, index, val, row) {
	if((this.legendMap[colName].cellType == "Sparkline" || this.legendMap[colName].cellType == "SparkColumn" || this.legendMap[colName].cellType == "SparkPie") && (val!="null" && val!=undefined && isNaN(val) && val!="NA")){
		return '<div class="'+this.legendMap[colName].cellType+this.m_objectid+this.getStringARSC(colName)+'" style="width:'+this.m_widthArr[index]+'px;">'+val+'</div>';
	}else if(this.legendMap[colName].cellType == "Image" && (val!="null" && val!=undefined && isNaN(val) && val!="NA")){
		return '<img src="'+val+'" style="height:'+this.m_rowheight+'px; width:'+this.m_rowheight+'px;"></img>'
	}else if(this.legendMap[colName].cellType == "ProgressBar" && (val!="null" && val!=undefined && val!="NA" && !isNaN(val*1))){
		return this.drawProgressBar(colName, index, val, row);
	}else if(this.legendMap[colName].cellType == "Bullet" && (val!="null" && val!=undefined && isNaN(val) && val!="NA")){
		return '<div class="bullet'+this.m_objectid+this.getStringARSC(colName)+'" style="width:'+this.m_widthArr[index]+'px;">'+val+'</div>';
	}else{
		var value;
		var value1;
		if ((IsBoolean(!IsBoolean(this.m_isFixedLabelArr[index]))))
			value = (val == undefined || val === "") ? "" : this.FormatCellValue(colName, index, val, row);
		else
			value = (val == undefined || val === "") ? "" : val;
		/**To display data with Apostrophe in tooltip*/
		if ((typeof value == "string")&&(value !== "")&&(isNaN(value))) {
			value1 = SearchAndReplaceAllOccurence(value, '"', '&#34;');
			value1 = SearchAndReplaceAllOccurence(value1,"'", "\\'");
	    }else{
	    	value1 = value;
	    }
		var alertObject = this.getAlertObj()[colName];
		var showtooltip = this.m_tooltipColumnsArr[index];
	    if(alertObject !== undefined)
	    	value1 = (IsBoolean(alertObject.m_showdata) == true) ? value1 : "&nbsp;";
	    if(alertObject !== undefined)
	    	value = (IsBoolean(alertObject.m_showdata) == true) ? value : "&nbsp;";
	    var tooltipdata = (isNaN(value1))?b64EncodeUnicode(value1):value1;
		var tooltipValue = "'" + tooltipdata + "'";
		if (row.gridHiddenField == "aggregatedRow") {
			/** Commented for enable formatter in aggregated value */
			//value = val;
		    showtooltip = false;
		}
		 var tooltipBGColor = "'" + this.m_tooltipbackgroundcolor + "'";
		 var tooltipBGAlpha = "'" + this.m_tooltipbackgroundtransparency + "'";
		 var customToolTipWidth = "'" + this.m_customtooltipwidth + "'";
		/**Hyperlink will not work for numeric/null/undefined 
		 * values present along with valid values**/
		if(this.legendMap[colName].cellType == "Hyperlink" && (val!="null" && val!=undefined && isNaN(val) && val!="NA")){
	    	return '<div onclick="openHyperlink(\'' + val + '\')" onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ',' + false + ',' + this.m_gridcustomtooltip + ')" onmouseout="hideToolTip()" style="z-index:999; cursor:pointer;">' + value + '</div>';
	    }else {
	    	if (this.m_TooltipFieldsArr[colName].length > 0 && (row.gridHiddenField < this.getDataProvider().length)) {
	    		var toolTipInfo = {
	    				"colName": colName,
	    				"rowId" : row.gridHiddenField,
	    				"tooltipValue" : tooltipValue
	    		};
	    	    if (this.m_TooltipFieldsArr[colName].length == 1) {
	    	    	return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + this.getCustomTooltipData(toolTipInfo, row) + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ',' + false + ',' + this.m_gridcustomtooltip +')" onmouseout="hideToolTip()" style="z-index:999;">' + value + '</div>';
	    	    } else {
	    	    	var toolTipObj = "'" + this.getCustomTooltipData(toolTipInfo, row).value + "'";
		    	    return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + toolTipObj + ',' + tooltipBGColor + ',' + tooltipBGAlpha + ',' + customToolTipWidth + ',' + true + ',' + this.m_gridcustomtooltip +')" onmouseout="hideToolTip()" style="z-index:999;">' + value + '</div>';
	    	    }
	    	} else {
	    		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ',' + false + ',' + this.m_gridcustomtooltip + ')" onmouseout="hideToolTip()" style="z-index:999;">' + value + '</div>';
	    	}
	    }
	}
};
PagingDataGrid.prototype.getCustomTooltipData = function(toolTipInfo, rowdata) {
	var tooltipValues = {};
	if (this.m_TooltipFieldsArr[toolTipInfo.colName].length == 1) {
	    if (toolTipInfo.colName == this.m_TooltipFieldsArr[toolTipInfo.colName][0]) {
	        return toolTipInfo.tooltipValue;
	    } else if(IsBoolean(this.m_gridcustomtooltip)){
	    	/**CP-915 : Added this condition to access fields data in html tooltip content 
	    	  when fields declared in square braces with this.m_gridcustmtooltip variable as true**/
	    	var expScript = this.m_TooltipFieldsArr[toolTipInfo.colName][0];
	    	/**Added to support Language Mapping and global variables */
			//expScript = this.m_chart.formattedDescription(this.m_chart, expScript);
	    	while(/\[(.*?)\]/g.exec(expScript) != null) {
	    		var arr =  /\[(.*?)\]/g.exec(expScript);
	    		var data = this.getDataProvider()[toolTipInfo.rowId][arr[1]];//rowdata[arr[1]];
	    		expScript = expScript.replace(arr[0], data );
	    	}
	    	/**Added to support html tags*/
	    	expScript = SearchAndReplaceAllOccurence(expScript, "&lt;", "<");
	    	expScript = SearchAndReplaceAllOccurence(expScript, "&gt;", ">");
	    	expScript = SearchAndReplaceAllOccurence(expScript, "&#34;", "'");
	    	expScript = btoa(expScript);
	    	expScript = "'" + expScript + "'";
	        return expScript;
	    	//tcNew = expScript;
	    } else {
	        /*var newValue = "'" + (this.getDataProvider()[toolTipInfo.rowId][this.m_TooltipFieldsArr[toolTipInfo.colName][0]]) + "'";
		        return  newValue;*/
	        /*Added below changes, as other field data is not displaying in tooltip*/
	        var newValue = (this.getDataProvider()[toolTipInfo.rowId][this.m_TooltipFieldsArr[toolTipInfo.colName][0]]);
	        newValue = (newValue === undefined) ? ("" + this.m_TooltipFieldsArr[toolTipInfo.colName][0]) : ("" + newValue);
	        newValue = btoa(newValue);
	        newValue = "'" + newValue + "'";
	        return newValue;
	    }
	} else {
	    var toolTipObj = {
	        "isEncoded": true
	    };
	    for (var i = 0; i < this.m_TooltipFieldsArr[toolTipInfo.colName].length; i++) {
	        tooltipValues[this.m_TooltipFieldsArr[toolTipInfo.colName][i]] = (this.getDataProvider()[toolTipInfo.rowId][this.m_TooltipFieldsArr[toolTipInfo.colName][i]]);
	    }
	    toolTipObj.value = btoa(JSON.stringify(tooltipValues));
	    return toolTipObj;
	}
};
PagingDataGrid.prototype.getProgressBarColor = function() {
	return ["#83cc0f","#f7244a","#f5b229","#ddc617","#49b1de"];
};
/** @description drawing of ProgressBar inside the grid cell **/
PagingDataGrid.prototype.drawProgressBar = function(colName, index, val, row) {
	var ProgressClass = "progressDiv"+this.m_objectid+this.getStringARSC(colName);
	var showtooltip = this.m_tooltipColumnsArr[index];
	var tooltipValue = (isNaN(val))?b64EncodeUnicode(val):"'" +val+ "'";
	var colorArr = this.getProgressBarColor();
	var silderHeight = this.fontScaling(3);
	var tooltipBGColor = "'" + this.m_tooltipbackgroundcolor + "'";
	var tooltipBGAlpha = "'" + this.m_tooltipbackgroundtransparency + "'";
    var customToolTipWidth = "'" + this.m_customtooltipwidth + "'";
    var leftBarWidth, rightBarWidth, ProgressClassStyle, ProgressLeftDivStyle, ProgressRightDivStyle, text;
	if(1*val===0){
		rightBarWidth = (this.m_widthArr[index] - 10);
		ProgressClassStyle = '"border-left:'+silderHeight+'px solid transparent;border-right:'+silderHeight+'px solid transparent; width:'+(1*this.m_widthArr[index] - 10)+'px;"';
		ProgressRightDivStyle = '"border:'+silderHeight+'px solid '+colorArr[1]+'; border-top-left-radius: 2em; border-bottom-left-radius: 2em; border-top-right-radius: 2em; border-bottom-right-radius: 2em; float:right; width:'+(rightBarWidth)+'px;"';
		text = '<div style="display:flex;" class="progressBarLabels"><div align="left" style="float:left; width:50%;">'+this.getFormattedCellValue(val, colName, index)+'</div><div align="right" style="float:right; width:50%;">'+this.getFormattedCellValue(100-val, colName, index)+'</div></div>'
		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ')" onmouseout="hideToolTip()" class='+ProgressClass+' style='+ProgressClassStyle+'>'+text+'<div style="display:flex;"><div style='+ProgressRightDivStyle+'></div></div>';
	}else if(1*val===100){
		leftBarWidth = (this.m_widthArr[index] - 10);
		ProgressClassStyle = '"border-left:'+silderHeight+'px solid transparent;border-right:'+silderHeight+'px solid transparent; width:'+(1*this.m_widthArr[index] - 10)+'px;"';
		ProgressLeftDivStyle = '"border:'+silderHeight+'px solid '+colorArr[0]+'; border-top-left-radius: 2em; border-bottom-left-radius: 2em; border-top-right-radius: 2em; border-bottom-right-radius: 2em; float:left; width:'+(leftBarWidth)+'px;"';
		text = '<div style="display:flex;" class="progressBarLabels"><div align="left" style="float:left; width:50%;">'+this.getFormattedCellValue(val, colName, index)+'</div><div align="right" style="float:right; width:50%;">'+this.getFormattedCellValue(100-val, colName, index)+'</div></div>'
		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ')" onmouseout="hideToolTip()" class='+ProgressClass+' style='+ProgressClassStyle+'>'+text+'<div style="display:flex;"><div style='+ProgressLeftDivStyle+'></div></div></div>';
	}else if(1*val<0 || 1*val > 100){
		leftBarWidth = (this.m_widthArr[index] - 10);
		ProgressClassStyle = '"border-left:'+silderHeight+'px solid transparent;border-right:'+silderHeight+'px solid transparent; width:'+(1*this.m_widthArr[index] - 10)+'px;"';
		ProgressLeftDivStyle = '"border:'+silderHeight+'px solid '+this.m_defaultalertcolor+'; border-top-left-radius: 2em; border-bottom-left-radius: 2em; border-top-right-radius: 2em; border-bottom-right-radius: 2em; float:left; width:'+(leftBarWidth)+'px;"';
		text = '<div style="display:flex;" class="progressBarLabels"><div align="left" style="float:left; width:80%;">'+this.getFormattedCellValue(val, colName, index)+'</div><div align="right" style="float:right; width:20%;"></div></div>'
		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ')" onmouseout="hideToolTip()" class='+ProgressClass+' style='+ProgressClassStyle+'>'+text+'<div style="display:flex;"><div style='+ProgressLeftDivStyle+'></div></div></div>';
	}else{
		leftBarWidth = (val*(this.m_widthArr[index] - 10)/100);
		rightBarWidth = (this.m_widthArr[index]*1 - 14) - leftBarWidth;
		ProgressClassStyle = '"border-left:'+silderHeight+'px solid transparent;border-right:'+silderHeight+'px solid transparent; width:'+(1*this.m_widthArr[index] - 10)+'px;"';
		ProgressLeftDivStyle = '"border:'+silderHeight+'px solid '+colorArr[0]+'; border-top-left-radius: 2em; border-bottom-left-radius: 2em; float:left; width:'+(leftBarWidth)+'px;"';
		ProgressRightDivStyle = '"border:'+silderHeight+'px solid '+colorArr[1]+'; border-top-right-radius: 2em; border-bottom-right-radius: 2em; float:right; width:'+(rightBarWidth)+'px;"';
		text = '<div style="display:flex;" class="progressBarLabels"><div align="left" style="float:left; width:50%;">'+this.getFormattedCellValue(val, colName, index)+'</div><div align="right" style="float:right; width:50%;">'+this.getFormattedCellValue(100-val, colName, index)+'</div></div>'
		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ')" onmouseout="hideToolTip()" class='+ProgressClass+' style='+ProgressClassStyle+'>'+text+'<div style="display:flex;"><div style='+ProgressLeftDivStyle+'></div><div style="border: 1px solid #ffffff;"></div><div style='+ProgressRightDivStyle+'></div></div></div>';
	}
};
/** @description drawing of Alerts inside the grid cell **/
PagingDataGrid.prototype.drawAlertImages = function (colName, colIndex, val, row, DynamicColName) {
	var temp = this;
    var formattedValue = val;
    if (!IsBoolean(this.m_isFixedLabelArr[colIndex]) && this.m_formatterArr[colIndex] != "none" && this.m_formatterArr[colIndex] != "") {
        formattedValue = this.FormatCellValue(colName, colIndex, val, row); //colName,colIndex,value , row
    }
    var showTooltip = this.m_tooltipColumnsArr[colIndex];
    var toolTipInfo = {
			"colName": colName,
			"rowId" : row.gridHiddenField,
			"showtooltip" : showTooltip,
			"tooltipValue" : formattedValue
	};
	var toolTipformattedvalue = "";
	if (this.m_TooltipFieldsArr[colName].length > 0 && (row.gridHiddenField < this.getDataProvider().length)) {
	    toolTipformattedvalue = this.getCustomTooltipData(toolTipInfo, row);
	}
    if(temp.getAlertObj()[colName].m_mode == "Range"){// && IsBoolean(temp.getAlertObj()[colName].getDynamicRange())
    	if(val == undefined){
    		/*It will Remove the additional undefined rows and will add blank value there*/
    		return "";
    	}else{
    		if (row.gridHiddenField !== "aggregatedRow") {
    			return this.getAlertObj()[colName].drawDynamicAlert(colName, colIndex, val, row, DynamicColName, formattedValue, showTooltip, toolTipformattedvalue);
    		}else{
    			/*console.log("Aggregated row, formatter not required ! ");
                return val;*/
    			/** Added for apply formatter on Aggregated row */
            	return formattedValue;
    		}
    	}
    }else{
        var originalDataRow = this.m_seriesData[row["gridHiddenField"]];
	    for (var key in row) {
	        if (key == this.getStringARSC(colName) && val == row[key] && temp.getAlertObj()[colName] != undefined) {
	            if (row.gridHiddenField !== "aggregatedRow") {
	                var compareColName = temp.getAlertObj()[colName].m_comparecolumn;
	                var compareColData = "";
	                if (compareColName != "" && compareColName != undefined) {
	                    compareColData = originalDataRow[compareColName];
	                }
	                var AlertObjCheck = (temp.getAlertObj()[colName].m_mode == "Comparison") ? (isNaN((parseFloat(originalDataRow[colName])*1)) ? false : true) : true;
	                if (AlertObjCheck) {
	                    return temp.getAlertObj()[colName].drawAlerts(compareColData, originalDataRow[colName], temp, key, "", formattedValue, colIndex, showTooltip, toolTipformattedvalue);
	                } else {
	                    console.log("Alerts are visible only for numeric data ");
	                    return originalDataRow[colName];
	                }
	            } else {
	                /*console.log("Aggregated row, formatter not required ! ");
	                return row[this.getStringARSC(colName)];*/
	            	/** Added for apply formatter on Aggregated row */
	            	return formattedValue;
	            }
	        }
	    }
    }
};

/** @description checking for Null values if Null value comes return the null otherwise passing for Formatting **/
PagingDataGrid.prototype.FormatCellValue = function(colName, colIndex, value, row) {
    var temp = this;
    for (var key in row) {
        /** call temp.getStringARSC() method for remove space and replace with underscore(_) **/
        if (value == row[key] && key == temp.getStringARSC(colName)) {
        	/**Changed conditions for apply formatter on Aggregated row */
            if (value === "" || value == "NIL" || value == "null") {
                return value;
            } else {
            	if ((row.gridHiddenField == "aggregatedRow") && (temp.m_rowaggrgationArr[colName] == "Count")) {
            		return value;
            	} else {
            		return temp.getFormattedCellValue(value, colName, colIndex);
            	}
            }
        }
    }
};
/** @description format grid cell value according to given formatter in the fields **/
PagingDataGrid.prototype.getFormattedCellValue = function (value, colName, index) {
	if (!isNaN(getNumericComparableValue(value))) {
		// added check for value is number or not otherwise return same string value
		var isCommaSeparated = (("" + value).indexOf(",") > 0) ? true : false;
		value = getNumericComparableValue(value);
		var formatter = this.m_formatterArr[index];
		var unit = this.m_unitNameArr[index];
		var signPosition = (this.m_signPositioneArr[index] != "") ? this.m_signPositioneArr[index] : "suffix";
		var precision = this.m_precisionArr[colName];
		var secondFormatter = this.m_secondFormatterArr[index];
		var secondUnit = this.m_secondUnitNameArr[index];
		var valueToBeFormatted = (precision === "default") ? 
        		(getNumericComparableValue(value) * 1) : 
        			(getNumericComparableValue(value) * 1).toFixed(precision) ;
        if (unit != "") {
				var formatterSymbol = this.m_util.getFormatterSymbol(formatter, unit);
				var secondFormatterSymbol = (secondFormatter == "none" || secondFormatter == "") ? "" : this.m_util.getFormatterSymbol(secondFormatter, secondUnit);
				/* To Add Number formatter */
	            if (secondFormatterSymbol == "auto") {
	            	value = getNumericComparableValue(value);
	    			var symbol = getNumberFormattedSymbol(value * 1, unit);
	    			var val = getNumberFormattedNumericValue(value * 1, precision, unit);
	    			var text = this.m_util.updateTextWithFormatter(val, "", precision);
	    			valueToBeFormatted = this.m_util.addFormatter(text, symbol, "suffix");
	    		}else{
	    			if (formatter == "Number" || secondFormatter == "Number") {
						var unitSymbol = (formatter == "Number") ? formatterSymbol : secondFormatterSymbol;
						valueToBeFormatted = this.m_util.updateTextWithFormatter(valueToBeFormatted, unitSymbol, precision);
					}
					if (this.m_secondFormatterArr[index] != "none" && this.m_secondFormatterArr[index] != "" && this.m_secondUnitNameArr[index] != "") {
						valueToBeFormatted = this.m_util.addFormatter(valueToBeFormatted, secondFormatterSymbol, "suffix");
					}
	    		}
	            valueToBeFormatted = getFormattedNumberWithCommas(valueToBeFormatted,this.m_numberFormatColumnsArr[index]);
	            /* To add Currency formatter */
	            valueToBeFormatted = (valueToBeFormatted == "NaN" || valueToBeFormatted == "") ? "" : this.m_util.addFormatter(IsBoolean(isCommaSeparated) ? getNumberWithCommas(valueToBeFormatted) : valueToBeFormatted, formatterSymbol, signPosition);
				return valueToBeFormatted;
			
		} else {
			return (valueToBeFormatted == "NaN") ? value : valueToBeFormatted;
		}
	} else {
		return value;
	}	
};

/** @description styling the datagrid **/
PagingDataGrid.prototype.setGridCss = function () {
	var temp = this;
	var comp = $("#" + temp.m_componentid);
	comp.find(".panel-body").css("padding", "0px");
	comp.find(".datagrid-header-row span").css({
		"color": convertColorToHex(temp.m_headerfontcolor),
		"font-weight": temp.m_headerfontweight,
		"font-size": temp.fontScaling(temp.m_headerfontsize) + "px",
		"font-family": selectGlobalFont(temp.m_headerfontfamily),
		"font-style": temp.m_headerfontstyle,
		"text-decoration": temp.m_headertextdecoration
	});
	/*For Dataset styling changes for column*/
	for (var i = 0, length = temp.m_colHeadersFieldName.length; i < length; i++) {
		if (IsBoolean(temp.m_enableColumnStyleArr[i])) {
			comp.find('.datagrid-body td[field ="' + temp.m_colHeadersFieldName[i] + '"]').css({
				"color": convertColorToHex(temp.m_fontColorArr[i]),
				"font-size": temp.fontScaling(temp.m_fontSizeArr[i]) + "px",
				"font-style": temp.m_fontStyleArr[i],
				"font-weight": temp.m_fontWeightArr[i],
				"font-family": selectGlobalFont(temp.m_fontFamilyArr[i]),
			});
		};
	};
	/** Header text align property to control column names text align using script for BDD-720 */
	if(!IsBoolean(temp.m_usefieldalign)) {
		comp.find(".datagrid-header-row td div").css("text-align", temp.m_headertextalign);
	}
	//$("#"+temp.m_componentid).find(".datagrid-header-row td").css("background", hex2rgb(convertColorToHex(temp.m_headerchromecolor),0.8));
	//comp.find(".datagrid-header").css("background", hex2rgb(convertColorToHex(temp.m_headerchromecolor), 0.8));
	/**for adding the different color on each header according to the Series color*/
	if (IsBoolean(this.m_usefieldcolorasheader)) {
	    for (var i = 0; i < this.m_colHeadersFieldName.length; i++) {
	        comp.find(".datagrid-header-row  td:nth-child(" + (i + 1) + ")").css("background", hex2rgb(this.m_fieldColors[i], temp.m_headerrowopacity));
	    }
	} else {
	    comp.find(".datagrid-header-row td").css("background", hex2rgb(convertColorToHex(temp.m_headerchromecolor), temp.m_headerrowopacity));
	}

	/*comp.find(".datagrid-cell").css({
		"font-weight": temp.m_labelfontweight,
		"font-size": temp.fontScaling(temp.m_labelfontsize) + "px",
		"font-family": selectGlobalFont(temp.m_labelfontfamily),
		"font-style": temp.m_labelfontstyle,
		"text-decoration": temp.m_labeltextdecoration,
		"color": convertColorToHex(temp.m_labelfontcolor)
	});*/
	comp.find(".datagrid-body tbody").css({
	    "font-weight": temp.m_labelfontweight,
	    "font-size": temp.fontScaling(temp.m_labelfontsize) + "px",
	    "font-family": selectGlobalFont(temp.m_labelfontfamily),
	    "font-style": temp.m_labelfontstyle,
	    "text-decoration": temp.m_labeltextdecoration,
	    "color": convertColorToHex(temp.m_labelfontcolor)
    });
	/** Added aggregated row css properties **/
    comp.find(".aggregatedRow .datagrid-cell") .css({
		"font-weight": temp.m_aggregatedrowfontweight,
        "font-size": temp.fontScaling(temp.m_aggregatedrowfontsize) + "px",
        "font-family": selectGlobalFont(temp.m_aggregatedrowfontfamily),
        "font-style": temp.m_aggregatedrowfontstyle,
        "text-decoration": temp.m_aggregatedrowtextdecoration,
        "color": convertColorToHex(temp.m_aggregatedrowfontcolor)
	});
	//comp.find(".datagrid-cell").css("height", this.getRowHeight(this.m_rowheight) + "px"); // header color
	comp.find(".datagrid-body td").css("height", this.getRowHeight(this.m_rowheight) + "px");

	// grid horizontal/vertical line color property
    if (IsBoolean(temp.getDatagridStyles().m_showhorizontalgridlines)) {
        comp.find(".datagrid-header td").css({
            "border-top": "1px solid " + hex2rgb(temp.getDatagridStyles().getHorizontalGridLineColor(), temp.m_rowlinesopacity),
            "border-right": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity),
            "border-bottom": "1px solid " + hex2rgb(temp.getDatagridStyles().getHorizontalGridLineColor(), temp.m_rowlinesopacity),
            "border-left": "0px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity)
        });
        comp.find(".datagrid-header tr").find("td:first").css({
        	"border-left": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity)
        });
        $(".datagrid-btable").css("color", temp.getDatagridStyles().getVerticalGridLineColor());
        comp.find(".datagrid-body td").css({
            "border-right": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity),
            "border-bottom": "1px solid " + hex2rgb(temp.getDatagridStyles().getHorizontalGridLineColor(), temp.m_rowlinesopacity),
            "border-width": "0px 1px 1px 0px"
        });
        comp.find(".datagrid-body tr").find("td:first").css({
            "border-left": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity)
        });
    } else {
        comp.find(".datagrid-header td").css({
        	"border-right": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity),
			"border-width": "0px 1px 0px 0"
        });
        comp.find(".datagrid-header tr").find("td:first").css({
        	"border-left": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity)
        });
        $(".datagrid-btable").css("color", hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity));
        comp.find(".datagrid-body td").css({
            "border-right": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity),
            "border-width": "0px 1px 0px 0px"
        });
        comp.find(".datagrid-body tr").find("td:first").css({
            "border-left": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity)
        });
    }
    comp.find(".panel.datagrid").css({
    	"padding": "0px",
    	"margin": "0px",
    	"border": "0px solid transparent",
    	"background": "transparent",
    	"box-shadow": "none",
    	"-webkit-box-shadow": "none"
    });
	comp.find(".datagrid-header").css({"border-width": "0", "background": "transparent"});
	comp.find("div.datagrid-wrap.panel-body.panel-body-noheader").css({"border": hex2rgb("1px solid" + temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity), "background": "transparent"});

	/*var headerColor=temp.getDatagridStyles().getHeaderColors();
	$("#"+temp.m_componentid).find(".datagrid-header").css("background",convertColorToHex(headerColor[0]));

	$("#"+temp.m_componentid).find(".datagrid-header").css("background-color",convertColorToHex(headerColor[0]));
	$("#"+temp.m_componentid).find(".datagrid-header").css("background","-webkit-linear-gradient(top,"+headerColor[0]+" 0,"+headerColor[1]+" 70%"+headerColor[2]+" 100%)");
	$("#"+temp.m_componentid).find(".datagrid-header").css("background","-moz-linear-gradient(top,"+headerColor[1]+" 0,"+headerColor[1]+" 70%"+headerColor[2]+" 100%)");
	$("#"+temp.m_componentid).find(".datagrid-header").css("background","-o-linear-gradient(top,"+headerColor[2]+" 0,"+headerColor[2]+" 70%"+headerColor[2]+" 100%)");
	$("#"+temp.m_componentid).find(".datagrid-header").css("background","linear-gradient(to bottom ,"+headerColor[0]+" 0,"+headerColor[1]+" 70%"+headerColor[2]+" 100%)");
	$("#"+temp.m_componentid).find(".datagrid-header").css("background-repeat","repeat-x");
	//$(".datagrid-header-over").css("background",temp.getDatagridStyles().getRollOverColor());

	 */
	// css for hiding the row numbers which wass showing on each row
	comp.find(".datagrid-cell-rownumber").css("width", "0px");
	comp.find(".datagrid-header-rownumber").css("width", "0px");

	// css for mask message " loading please wait"
	comp.find(".datagrid-mask").css({
		"opacity": "1",
		"background": "#00ffff"
	});
	comp.find(".datagrid-mask-msg").css({
		"opacity": "1",
		"border-color": "#00ff00"
	});

	this.setGridColors();
    comp.find(".datagrid-header-row").css("height", temp.getRowHeight(temp.m_rowheight)+"px");
	comp.find(".datagrid-header-row td .datagrid-cell").css("height", ((temp.fontScaling(temp.m_headerfontsize) > 15) ? (temp.fontScaling(temp.m_headerfontsize) * 1 + 2) : 17) + "px"); // header color
	comp.find(".datagrid-header-row td div").css("text-decoration", "none");
	if(!IsBoolean(temp.m_fitcolumns))
		comp.find(".datagrid-view2 .datagrid-body").css("overflow","overlay");

	var pagerBorderColor = convertColorToHex(this.getLinkBar().m_linkbarcolor);
	if (this.m_pagerbackgroundcolor == undefined) {
		var m_bgGradientColors = this.m_bggradients.split(",");
		this.m_pagerbackgroundcolor = convertColorToHex(m_bgGradientColors[0]);
	}
	comp.find(".datagrid-pager").css({
		"background": hex2rgb(this.m_pagerbackgroundcolor,this.m_paginationbaropacity),
		"border-color": pagerBorderColor,
		"color": pagerBorderColor,
		"font-size": temp.fontScaling(temp.m_fontsize) + "px",
		"font-family": selectGlobalFont(this.m_fontfamily),
		"width": "inherit",
		"border-radius": temp.fontScaling(1)+"px"
	});

	comp.find(".pagination-num").css({
		"text-align": "center",
		"width": temp.fontScaling(23)+"px",
		"height": temp.fontScaling(19)+"px",
		"padding": "0px"
	});
	comp.find(".pagination").css("margin", "0px");
	comp.find(".pagination span").css("font-size", temp.fontScaling(12)+"px");
	
	if(IsBoolean(this.m_textwrap)){
		comp.find("td div.datagrid-cell").css("white-space","normal");
		comp.find("td div.datagrid-cell").css("word-wrap", "break-word");
		comp.find("td div.datagrid-cell").css("height", "auto");
		comp.find(".datagrid-header td span").css("white-space","normal");
        comp.find(".datagrid-header td span").css("word-wrap", "break-word");
	}
//	comp.find(".datagrid-header td span.datagrid-sort-icon").css({"float":"right", "position":"absolute"});
	this.applyAdditionalStyles();
};

/** @description setting alternative row's and header's color**/
PagingDataGrid.prototype.setGridColors = function () {
	var temp = this;
	this.setSelectedRowCSS();
	/** row hover **/
	$("#" + temp.m_componentid).find(".datagrid-row").hover(
		function () {
			$(this).css("background", hex2rgb(temp.getDatagridStyles().getRollOverColor(), temp.m_rowhoveropacity));
		},
		function () {
			temp.setSelectedRowCSS();
	});
	/** header hover **/
	/*	$("#"+temp.m_componentid).find(".datagrid-header-row td").hover(
			function () {
				$(this).css("background", hex2rgb(convertColorToHex(temp.m_headerchromecolor),0.8));
			},
			function () {
				$(this).css("background",hex2rgb(convertColorToHex(temp.m_headerchromecolor),0.8));
			}
		);
	*/
};

/** @description setting CSS for selected row **/
PagingDataGrid.prototype.setSelectedRowCSS = function () {
	var temp = this;
	var gridColors = this.getRowAltColors();
	$("#" + temp.m_componentid).find(".datagrid-row").css({
    	"background": hex2rgb(convertColorToHex(gridColors[1]), temp.m_rowopacity),
    	"height": temp.getRowHeight(temp.m_rowheight)+"px"
    });
	$("#" + temp.m_componentid).find(".datagrid-row-alt").css("background", hex2rgb(convertColorToHex(gridColors[2]), temp.m_rowopacity));
	setTimeout(function(){
		$("#" + temp.m_componentid).find(".datagrid-row-selected").css("background", hex2rgb(convertColorToHex(temp.getDatagridStyles().getSelectionColor()), temp.m_rowselectedopacity));
	},1);
};
PagingDataGrid.prototype.getRowAltColors = function () {
	var temp = this;
	var alternateRowColor = temp.getDatagridStyles().getAlternateRowsColor();
	var headerColors = temp.getDatagridStyles().getHeaderColors();
	var gridColors;
	if (alternateRowColor != undefined) {
		gridColors = alternateRowColor.split(",");
		if (gridColors.length == 1) {
			gridColors.push(gridColors[0]);
		}
		var newArr = ["#ffffff"];
		for (var i = 0; i < gridColors.length; i++){
			newArr.push(convertColorToHex(gridColors[i]));
		}
		gridColors = newArr;
	} else {
		gridColors = headerColors.split(",");
		var tempArr = [];
		for (var i1 = 0; i1 < gridColors.length; i1++){
			tempArr.push(convertColorToHex(gridColors[i1]));
		}
		gridColors = tempArr;
		if (gridColors.length == 1) {
			gridColors.push("#ffffff");
			gridColors.push("#ffffff");
		} else if (gridColors.length == 2) {
			gridColors.push(gridColors[1]);
		} else {
			// Do nothing
		}
	}
	return gridColors;
};

/** @description getter of tooltip data **/
PagingDataGrid.prototype.getToolTipData = function (mouseX, mouseY) {
	var data = [];
	data[0] = "";
	return data;
};

/** @description drawing of grid Filters **/
PagingDataGrid.prototype.drawGridFilters = function () {
	if (this.count == 0) {
		var filterContainer = this.createFilterContainerDiv();
		this.createFilterFields(filterContainer);
		this.createFilterOperators(filterContainer);
		this.createFilterTextBox(filterContainer);
		this.DGFilterButton(filterContainer);
		this.DGFilterResetButton(filterContainer);
		if (this.m_colHeadersFieldName.length > 0 && IsBoolean(!this.m_designMode)){
			this.count++;
		}
	}
};
PagingDataGrid.prototype.removeFilterContainerDiv = function () {
	var temp = this;
	$("#FilterContainerDiv" + temp.m_objectid).remove();
}
/** @description Creation of Parent div for Filters **/
PagingDataGrid.prototype.createFilterContainerDiv = function () {
	var temp = this;
	this.removeFilterContainerDiv();
	var FilterContainerDiv = document.createElement("div");
	FilterContainerDiv.setAttribute("id", "FilterContainerDiv" + this.m_objectid);
	FilterContainerDiv.style.left = 1 * (this.m_x) + 4 + "px";
	FilterContainerDiv.style.top = 1 * (this.m_y) + 1 * (this.m_titleHeight) + 1 * this.m_subTitleHeight + "px";
	FilterContainerDiv.style.height = this.m_DGFilterHeight + "px";
	FilterContainerDiv.style.width = this.m_width - 6 + "px";
	FilterContainerDiv.style.position = "absolute";
	/*DAS-194 if subtitle is enabled then also set padding top 20*/
	var ht =  (IsBoolean(this.m_updateddesign) || IsBoolean(this.m_subTitle.m_showsubtitle) ? 20 : 5);
	FilterContainerDiv.style.paddingTop = this.fontScaling(ht) + "px";
	$("#draggableDiv" + temp.m_objectid).append(FilterContainerDiv);
	return FilterContainerDiv;
};

/** @description Setting font style of Filter text **/
PagingDataGrid.prototype.setFilterTextCSS = function (op) {
	var temp = this;
	temp.m_pagingfilterfontsize = (IsBoolean(temp.m_updateddesign) ? ((this.m_filterfontsize>24)?24:this.m_filterfontsize) : 11);
	$(op).css("font-weight", temp.m_filterfontweight);
	$(op).css("font-size", temp.fontScaling(temp.m_pagingfilterfontsize) + "px");
	$(op).css("font-family", selectGlobalFont(temp.m_filterfontfamily));
	$(op).css("font-style", temp.m_filterfontstyle);
	$(op).css("text-decoration", temp.m_pagingfiltertextdecoration);
	$(op).css("color", convertColorToHex(temp.m_filterfontcolor));
};

/** @description Creation of Filter fields **/
PagingDataGrid.prototype.createFilterFields = function (container) {
	var temp = this;
	var optionValues = [];
	var optionTexts = [];

	optionValues[0] = "";
	optionTexts[0] = "Select Column";
	var selectedColumn = (this.selectedFiltersMap !==  undefined)?this.selectedFiltersMap.fieldName :"Select Column";
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		optionValues[j + 1] = this.m_colHeadersFieldName[j];
		optionTexts[j + 1] = this.m_gridheaderDisplayNames[j];
	}
	var select = document.createElement("SELECT");
	select.setAttribute("id", "PDFieldsFilter" + this.m_objectid);
	select.setAttribute("class", "PagingDGFilter PDFieldsFilter");
	this.setFilterTextCSS(select);
	if(IsBoolean(this.m_updateddesign)){
		$(select).css("background",this.m_filterbgcolor);
		$(select).css("padding-left","10px");
	}
	for (var i = 0; i < optionValues.length; i++) {
		var op = document.createElement("option");
		op.setAttribute("value", optionValues[i]);
		op.appendChild(document.createTextNode(optionTexts[i]));
		if (optionValues[i] == selectedColumn){
			op.selected = "selected";
		}
		select.appendChild(op);
	}
	container.appendChild(select);
	var ht =  (IsBoolean(this.m_updateddesign) ? ((this.m_filterheight>40)?40:this.m_filterheight) : 20);
	$(select).css("height",temp.fontScaling(ht) + "px");
	$(select).change(function() {
		var isNumericField = false;
		for (var i = 0; i < temp.m_colHeadersFieldName.length; i++) {
			if( temp.m_colHeadersFieldName[i] == this.value ){
				isNumericField = ( (temp.m_isNumericArr[i] == "Numeric") ? true : false);
			}
		}
		var OperatorFilter = $("#PDOperatorFilter"+temp.m_objectid);
		OperatorFilter.empty(); 
		var optionsMap = (isNumericField) ? {"<":"<", "<=":"<=", ">":">", ">=":">=", "=":"==", "!=":"!="} : {"Like":"like", "!Like":"!like", "=":"==", "!=":"!="};
		for (var key in optionsMap) {
			var op = document.createElement("option");
			op.setAttribute("value", optionsMap[key]);
			op.appendChild(document.createTextNode(key));
			if (i == 0)
				op.selected = "selected";
			$(OperatorFilter).append(op);
		}
	});
};

/** @description Creation of operator containing  filter **/
PagingDataGrid.prototype.createFilterOperators = function (container) {
	var temp = this;
	var optionsMap;
	if(temp.selectedFiltersMap !==  undefined){
		var isNumericField = false;
		for (var i = 0; i < temp.m_colHeadersFieldName.length; i++) {
			if( temp.m_colHeadersFieldName[i] == temp.selectedFiltersMap.fieldName ){
				isNumericField = ( (temp.m_isNumericArr[i] == "Numeric") ? true : false );
			}
		}
		optionsMap = (isNumericField) ? {"<":"<", "<=":"<=", ">":">", ">=":">=", "=":"==", "!=":"!="} : {"Like":"like", "!Like":"!like", "=":"==", "!=":"!="};
	}else{
		optionsMap = {"Like":"like", "!Like":"!like", "<":"<", "<=":"<=", ">":">", ">=":">=", "=":"==", "!=":"!="};
	}
	
	var selectedOperator = (this.selectedFiltersMap !==  undefined)?this.selectedFiltersMap.operator :"Select Column";
	var OperatorFilter = document.createElement("SELECT");
	OperatorFilter.setAttribute("id", "PDOperatorFilter" + this.m_objectid);
	OperatorFilter.setAttribute("class", "PagingDGFilter PDOperatorFilter");
	this.setFilterTextCSS(OperatorFilter);
	for (var key in optionsMap) {
		var op = document.createElement("option");
		op.setAttribute("value", optionsMap[key]);
		op.appendChild(document.createTextNode(key));
		if (optionsMap[key] == selectedOperator){
			op.selected = "selected";
		}
		OperatorFilter.appendChild(op);
	}
	container.appendChild(OperatorFilter);
	var ht =  (IsBoolean(this.m_updateddesign) ? ((this.m_filterheight>40)?40:this.m_filterheight) : 20);
	$(OperatorFilter).css("height",temp.fontScaling(ht) + "px");
	if(IsBoolean(this.m_updateddesign)){
		$(OperatorFilter).css("margin-left","10px");
		$(OperatorFilter).css("background",this.m_filterbgcolor);
		$(OperatorFilter).css("padding-left","10px");
	}
};

/** @description Creation of Text Box Filter **/
PagingDataGrid.prototype.createFilterTextBox = function (container) {
	var temp = this;
	var textObj = document.createElement("input");
	textObj.type = "text";
	textObj.value = (this.selectedFiltersMap !==  undefined) ? this.selectedFiltersMap.value:"";
	if(textObj.value == "undefined")
		textObj.value = "";
	textObj.setAttribute("id", "PDFilterTextBox" + this.m_objectid);
	textObj.setAttribute("class", "PagingDGFilter PDFilterTextBox");
	
	this.setFilterTextCSS(textObj);
	container.appendChild(textObj);
	var ht =  (IsBoolean(this.m_updateddesign) ? ((this.m_filterheight>40)?40:this.m_filterheight) : 20);
	$(textObj).css("height",temp.fontScaling(ht) + "px");
	if(IsBoolean(this.m_updateddesign)){
		textObj.setAttribute("placeholder", "Select Value");
		$(textObj).css("margin-left","10px");
		$(textObj).css("padding-left","10px");
	}
};

/** @description Creation of Filter Button ,onclicking of this filter will start in the grid**/
PagingDataGrid.prototype.DGFilterButton = function (container) {
	var temp = this;
	var ButtonObj = document.createElement("input");
	ButtonObj.type = "button";
	ButtonObj.setAttribute("id", "PDFilterButton" + this.m_objectid);
	ButtonObj.setAttribute("class", "PagingDGFilter PDFilterButton");
	ButtonObj.value = "Filter";
	this.setFilterTextCSS(ButtonObj);
	ButtonObj.onclick = this.gridFilter.bind(this);
	container.appendChild(ButtonObj);
	var ht =  (IsBoolean(this.m_updateddesign) ? ((this.m_filterheight>40)?40:this.m_filterheight) : 20);
	$(ButtonObj).css("height",temp.fontScaling(ht) + "px");
	if(IsBoolean(this.m_updateddesign)){
		$(ButtonObj).css("margin-left","10px");
		$(ButtonObj).css("background",this.m_filterbuttonbgcolor);
		$(ButtonObj).css("color",temp.m_filterbuttontextcolor);
		$(ButtonObj).css("border-radius","8px");
	}
};

/** @description Creation of Filter Reset Button .onclicking all filter will set to its default value **/
PagingDataGrid.prototype.DGFilterResetButton = function (container) {
	var temp = this;
	var ButtonObj = document.createElement("input");
	ButtonObj.setAttribute("id", "PDResetFilterButton" + this.m_objectid);
	ButtonObj.setAttribute("class", "PagingDGFilter PDResetFilterButton");
	ButtonObj.type = "button";
	ButtonObj.value = "Reset";
	this.setFilterTextCSS(ButtonObj);
	ButtonObj.onclick = function () {
		$(this).css("display", "none");

		temp.m_gridFilterCondition = "";
		temp.setDataProvider1(temp.getDataProvider1());
		temp.init();
		temp.drawChart();
		$("#PDFieldsFilter" + temp.m_objectid).val("");
		$("#PDOperatorFilter" + temp.m_objectid).val("like");
		$("#PDFilterTextBox" + temp.m_objectid).val("");
		temp.selectedFiltersMap = {};
		ButtonObj.style.display = "none";
	};
	container.appendChild(ButtonObj);
	var ht =  (IsBoolean(this.m_updateddesign) ? ((this.m_filterheight>40)?40:this.m_filterheight) : 20);
	$(ButtonObj).css("height",temp.fontScaling(ht) + "px");
	if(IsBoolean(this.m_updateddesign)){
		$(ButtonObj).css("margin-left","10px");
		$(ButtonObj).css("background",temp.m_filterresetbgcolor);
		$(ButtonObj).css("color",temp.m_filterresettextcolor);
		$(ButtonObj).css("border-radius","8px");
	}
};

/******************************* code for filter GridData according to grid Filter *************************************/

/** @description Filter grid data on the basis of the selected filter values**/
PagingDataGrid.prototype.gridFilter = function () {
	var temp = this;
	var fieldName = $("#PDFieldsFilter" + temp.m_objectid).val();
	var operator = $("#PDOperatorFilter" + temp.m_objectid).val();
	var value = $("#PDFilterTextBox" + temp.m_objectid).val();
	this.selectedFiltersMap = {
		    "fieldName": fieldName,
		    "operator": operator,
		    "value": value
	};
	if (!IsBoolean(this.m_designMode)) {
		$("#PDResetFilterButton" + temp.m_objectid).css("display", "inline-block");
		if (value == "") {
			alertPopUpModal({type: 'warning', message: "Enter a value for comparison", timeout: '3000'});
		} else if (fieldName == "") {
			alertPopUpModal({type: 'warning', message: "Select a Column", timeout: '3000'});
		} else {
			var filterData = temp.getFilteredRecordsByGridFilter(fieldName, operator, value);
			if(filterData.length == 0){
				var obj = {};
				if( temp.m_dataProvider[0] ){
					/** copying the JSON object **/
					//obj = jQuery.extend(true, {}, oldObject);
					for(var kk in temp.m_dataProvider[0]){
						obj[kk] = temp.m_dataProvider[0][kk];
					}
					/** making a row with blank data **/
					for (var prop in obj) {
						if (obj.hasOwnProperty(prop)) { 
							obj[prop] = "";
						} 
					}
				}
				filterData = [obj];
			}
			temp.setDataProvider1(filterData);
			temp.init();
			temp.drawChart();
			$("#PDResetFilterButton" + this.m_objectid).css("display", "initial");
		}
	}
};

/** @description Filter Record **/
PagingDataGrid.prototype.getFilteredRecordsByGridFilter = function (fieldName, operator, value) {
	var filteredRecordNumbers = [];
	var totalRecordsMap = this.getDataProvider1();
	for (var key in totalRecordsMap) {
		/** commenting the itreration of keys of objects **/ 
//		for (key1 in totalRecordsMap[key]) {
			if (totalRecordsMap[key][fieldName] !== undefined ) {
				if (IsBoolean(this.isCompare(totalRecordsMap[key][fieldName], operator, value))) {
					filteredRecordNumbers.push(totalRecordsMap[key]);
				}
			}
//		}
	}
	return filteredRecordNumbers;
};

/** @description filter condition comarision with the data **/
PagingDataGrid.prototype.isCompare = function (fieldValue, operator, filterValue) {
	fieldValue = getNumericComparableValue(fieldValue);
	switch (operator) {
	case "like":
		return (((""+fieldValue).toLowerCase()).indexOf((""+filterValue).toLowerCase()) != -1);
	case "!like":
		return (((""+fieldValue).toLowerCase()).indexOf((""+filterValue).toLowerCase()) == -1);
	case "==":
		if (!isNaN(fieldValue) && !isNaN(filterValue))
			return (fieldValue * 1 == filterValue * 1);
		else if(fieldValue == filterValue)
			return true;
		else
			return false;
	case "!=":
		if(!isNaN(fieldValue) && !isNaN(filterValue))
			return (fieldValue != filterValue);
		else if(fieldValue !== filterValue)
			return true;
		else
			return false;
	case ">":
		if (!isNaN(fieldValue) && !isNaN(filterValue))
			return (fieldValue * 1 > filterValue * 1);
		else
			return false;
	case ">=":
		if (!isNaN(fieldValue) && !isNaN(filterValue))
			return (fieldValue * 1 >= filterValue * 1);
		else
			return false;
	case "<":
		if (!isNaN(fieldValue) && !isNaN(filterValue))
			return (fieldValue * 1 < filterValue * 1);
		else
			return false;
	case "<=":
		if (!isNaN(fieldValue) && !isNaN(filterValue))
			return (fieldValue * 1 <= filterValue * 1);
		else
			return false;
	default:
		return false;
	}
};
//# sourceURL=PagingDataGrid.js
