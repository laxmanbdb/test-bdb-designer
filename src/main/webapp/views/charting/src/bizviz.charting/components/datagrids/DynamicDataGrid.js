/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: DynamicDataGrid.js
 * @description Pivot Grid
 **/
function DynamicDataGrid(m_chartContainer, m_zIndex) {
	this.base = DataGrid;
	this.base();
	this.m_x = 10;
	this.m_y = 600;
	this.m_width = 500;
	this.m_height = 285;
	this.m_fitcolumns = "true"; //added to fit all columns in the available component width
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
	//array for fields info..
	this.m_visibleArr = [];
	this.m_widthArr = [];
	this.m_textAlignArr = [];
	this.m_tooltipColumnsArr = [];
	this.m_numberFormatColumnsArr = [];
	/*DAS-837 Component was visible when data service load at start is off */
	/*this.m_fieldName = [];*/
	this.m_isNumericArr = [];
	this.m_isFixedLabelArr = [];
	this.m_formatterArr = [];
	this.m_unitNameArr = [];
	this.m_signPositioneArr = [];
	this.m_precisionArr = [];
	this.m_secondFormatterArr = [];
	this.m_secondUnitNameArr = [];
	this.m_fieldType = [];
	this.m_hierarchyType = [];
	this.m_designModeDrawingFlag = true;
	this.mappedData = "";
	this.m_fieldAggregation = [];
	this.columnWiseData = {};
	this.m_placeholdernavalue = "&nbsp;";
	this.m_firstcolumnwidth = "";
	this.m_slidermargin = 15;
	this.m_scrollbarsize = 7;
	this.m_collapseallnode = false;
	
	/**Properties added for introducing opacity in Grid*/
    this.m_rowopacity = 0.8;
    this.m_headerrowopacity = 0.6;
    this.m_rowhoveropacity = 0.4;
    this.m_rowselectedopacity = 0.6;
    this.m_rowlinesopacity = 0.8;
    this.m_enableheadertooltip = false;
};
/** @description Making prototype of DataGrid class and inheriting Method and property into DynamicDataGrid**/
DynamicDataGrid.prototype = new DataGrid();

/** @description This method will parse the DataGrid JSON and create a container **/
DynamicDataGrid.prototype.setProperty = function (gridJson) {
	this.ParseJsonAttributes(gridJson.Object, this);
	this.initCanvas();
};

/** @description Iterate through Grid JSON and set class variable values with JSON values **/
DynamicDataGrid.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "DataGrid") {
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
				case "LinkButton":
					for (var linkButtonKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(linkButtonKey);
						nodeObject.m_linkbutton[propertyName] = jsonObject[key][chartKey][linkButtonKey];
					}
					break;
				case "Column":
					for (var columnKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(columnKey);
						nodeObject.m_column[propertyName] = jsonObject[key][chartKey][columnKey];
					}
					break;
				case "DatagridStyles":
					for (var datagridStylesKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(datagridStylesKey);
						nodeObject.m_datagridstyles[propertyName] = jsonObject[key][chartKey][datagridStylesKey];
					}
					break;
				case "RowData":
					for (var rowDataKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(rowDataKey);
						nodeObject.m_rowdata[propertyName] = jsonObject[key][chartKey][rowDataKey];
					}
					break;
				case "LinkBar":
					for (var linkBarKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(linkBarKey);
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
					var propertyName = this.getNodeAttributeName(chartKey);
					if (propertyName != "m_title"){
						nodeObject[propertyName] = jsonObject[key][chartKey];
					}
					break;
				}
			}
		} else {
			var propertyName = this.getNodeAttributeName(key);
			nodeObject[propertyName] = jsonObject[key];
		}
	}
};

/** @description Getter of DataProvider **/
DynamicDataGrid.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description storing field JSON into class Variable **/
DynamicDataGrid.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	this.setSeries(fieldsJson);
};

/** @description creating array for each property of fields and storing in arrays **/
DynamicDataGrid.prototype.setSeries = function (fieldsData) {
	this.fieldsData = fieldsData;
    this.m_fieldName = [];
	this.m_colHeadersFieldName = []
	this.m_gridheaderDisplayNames = [];
	this.m_fieldType = {};
	this.m_visibleArr = [];
	this.m_widthArr = {};
	this.m_textAlignArr = {};
	this.m_tooltipColumnsArr = [];
	this.m_numberFormatColumnsArr = [];
	this.m_cellTypeArr = [];
	this.m_hierarchyType = {};
	this.m_isNumericArr = [];
	this.m_isFixedLabelArr = {};
	this.m_fieldColors = {};
	this.m_formatterArr = {};
	this.m_unitNameArr = {};
	this.m_signPositioneArr = {};
	this.m_precisionArr = {};
	this.m_secondFormatterArr = {};
	this.m_secondUnitNameArr = {};
	this.visibleFieldsData = {};
	this.m_fieldAggregation = {};
	this.m_visibleValueFields = {};
	this.m_seriesVisibleArr = {};
	this.legendMap = {};
	this.m_TooltipFieldsArr = {};
	var j = 0;
	for (var i = 0; i < fieldsData.length; i++) {
		var fieldname = this.getProperAttributeNameValue(fieldsData[i], "fieldname");
        var visible = this.getProperAttributeNameValue(fieldsData[i], "visible");
        this.m_fieldName[i] = fieldname;
		//if(IsBoolean(this.getProperAttributeNameValue(fieldsData[i],"visible") ))
		{
			this.m_colHeadersFieldName[j] = this.getProperAttributeNameValue(fieldsData[i], "fieldname");
			var m_formattedDescription = this.formattedDescription(this, this.getProperAttributeNameValue(fieldsData[i], "displayname"));
            this.m_gridheaderDisplayNames[j] = m_formattedDescription;
			this.m_fieldType[fieldname] = this.getProperAttributeNameValue(fieldsData[i], "Type");
			this.m_visibleArr[j] = this.getProperAttributeNameValue(fieldsData[i], "visible");
			this.m_seriesVisibleArr[fieldname] = this.getProperAttributeNameValue(fieldsData[i], "visible");
			this.m_widthArr[fieldname] = this.getProperAttributeNameValue(fieldsData[i], "width");
			this.m_textAlignArr[fieldname] = this.getProperAttributeNameValue(fieldsData[i], "textAlign");
			this.m_tooltipColumnsArr.push(this.getProperAttributeNameValue(fieldsData[i], "showTooltip"));
			this.m_hierarchyType[fieldname] = this.getProperAttributeNameValue(fieldsData[i], "hierarchyType");
			
			 /**To support dashbord when we are publishing it directly without opening in design mode**/
            var cellType = this.getProperAttributeNameValue(fieldsData[i], "cellType");
            var numberFormatter = this.getProperAttributeNameValue(fieldsData[i], "numberFormatter");
            if(cellType == undefined){
            	cellType = IsBoolean(fieldsData[i].isNumeric)?"Numeric":"none";
            }
            this.m_cellTypeArr[j] = cellType;
            this.m_isNumericArr[j] = cellType;
            this.m_numberFormatColumnsArr[j] = (numberFormatter == undefined) ? "none" : numberFormatter;
			
			this.m_isFixedLabelArr[fieldname] = this.getProperAttributeNameValue(fieldsData[i], "isfixedlabel");
			this.m_formatterArr[fieldname] = this.getProperAttributeNameValue(fieldsData[i], "formatter");
			this.m_unitNameArr[fieldname] = this.getProperAttributeNameValue(fieldsData[i], "unitname");
			this.m_signPositioneArr[fieldname] = this.getProperAttributeNameValue(fieldsData[i], "signposition");
			this.m_precisionArr[fieldname] = this.getProperAttributeNameValue(fieldsData[i], "precision");
			this.m_secondFormatterArr[fieldname] = this.getProperAttributeNameValue(fieldsData[i], "secondformatter");
			this.m_secondUnitNameArr[fieldname] = this.getProperAttributeNameValue(fieldsData[i], "secondunitname");
			this.visibleFieldsData[fieldname] = fieldsData[i];
			this.m_fieldAggregation[fieldname] = this.getProperAttributeNameValue(fieldsData[i], "parentAggregation");

			this.m_fieldColors[this.getStringARSC(fieldname)] = this.getProperAttributeNameValue(fieldsData[i], "Color");

			
			if((this.m_fieldType[fieldname] =="Values")){
				this.m_visibleValueFields[this.m_colHeadersFieldName[j]] = this.getProperAttributeNameValue(fieldsData[j], "visible");
				var tooltipFieldName = (this.getProperAttributeNameValue(fieldsData[i], "tooltipField") !== undefined && this.getProperAttributeNameValue(fieldsData[i], "tooltipField") !== "") ? (this.getProperAttributeNameValue(fieldsData[i], "tooltipField")) : this.m_colHeadersFieldName[j];
				this.m_TooltipFieldsArr[this.m_colHeadersFieldName[j]] = tooltipFieldName.split(",");
			}
			
			var tempMap = {
					"seriesName" : this.m_colHeadersFieldName[j],
					"displayName" : this.m_gridheaderDisplayNames[j],
					//"color" : this.m_fieldColors[j],
					//"shape" : this.m_plotShapeArray[j],
					//"fieldName" : this.fieldNameArr[j],
					"width": this.m_widthArr[fieldname],
					"textAlign" : this.m_textAlignArr[fieldname],
					"toolTipColumn": this.m_tooltipColumnsArr[i],
					"numeric" : this.m_isNumericArr[fieldname],
					"cellType": this.m_cellTypeArr[j],
					"numberFormatter": this.m_numberFormatColumnsArr[j],
					"fixedLabel" : this.m_isFixedLabelArr[fieldname],
					"formatter" : this.m_formatterArr[fieldname],
					"unitName" : this.m_unitNameArr[fieldname],
					"signPosition" : this.m_signPositioneArr[fieldname],
					"precision" : this.m_precisionArr[fieldname],
					"secondFormatter" : this.m_secondFormatterArr[fieldname],
					"secondUnitName" : this.m_secondUnitNameArr[fieldname],
					"fieldType" : this.m_fieldType[fieldname],
					"index": j
			};
			this.legendMap[fieldname] = tempMap;
			j++;
		}
	}
    this.setLegendsIntialLoad(this.m_defaultlegendfields);
};

DynamicDataGrid.prototype.getLegendInfo = function () {
	var tempMap = {};
	for(var key in this.legendMap){
		if(this.legendMap[key].fieldType == "Values"){
	    	tempMap[key] = this.legendMap[key];
		}
	};
	return tempMap;
};

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
DynamicDataGrid.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description  initialization of draggable div and its inner Content **/
DynamicDataGrid.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/** @description  Will create an id for component to be used for dashboard operation management**/
DynamicDataGrid.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];

	this.m_componentid = "dataGridDiv" + this.m_objectid;

};
/** @description Fetch Data From JSON and Store into array and replace the undefined with "" **/
DynamicDataGrid.prototype.getDataFromJSON = function () {
	var data = [];
	var tempdata = [];
	var columnName = this.getColumnOriginalFieldName().map(function( name ){
		return this.getStringARSC(name);
	});
	for(var i = 0, length = this.getDataProvider().length; i < length; i++){
		var tempmap = {};
		for(var key in this.getDataProvider()[i]){
			tempmap[key] = this.getDataProvider()[i][key];
		}
		tempdata.push(tempmap);
		
		data[i] = (tempdata[i] == undefined || tempdata[i] == "undefined") ? "" : tempdata[i];
		for (var key1 in data[i]) {
			var value = data[i][key1];
			delete data[i][key1];
			var removeUC = this.getStringARSC(key1);
			data[i][removeUC] = value;
		}
		//Added to prevent appending '-' palace of space in column name @BDD-804
		if (IsBoolean(this.m_enableheadertooltip)) {
			// Do nothing
		} else {
			for (var j = 0; j < columnName.length; j++) {
				var string = "" + data[i][columnName[j]];
				//data[i][columnName[j]] = string;//.replace(/[^a-z0-9\s]/gi, "-").replace(/[_\s]/g, "-");
				data[i][columnName[j]] = string.replace(/\//g, "-");
			}
		}
	}
	return data;
};

/** description initialization of DynamicDataGrid **/
DynamicDataGrid.prototype.init = function () {
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);
	this.m_seriesData = this.getDataFromJSON();
	//this.m_seriesData=updateSeriesData(this.m_seriesData);//called for handle  comma separated numeric string data like-"1,234.00"
	this.isSeriesDataEmpty();
    this.isEmptyField();
    this.isVisibleField();
    /*DAS-837 Component was visible when data service load at start is off */
    if (this.m_fieldName === undefined) {
        throw new Error('m_fieldName is undefined');
    }
	this.updateGlobalVariableWithColumnData();
	if (!IsBoolean(this.m_isEmptySeries)){
		this.createDatagrid();
	}else{
		var temp = this;
		$("#" + temp.m_componentid).remove();
	}
};
DynamicDataGrid.prototype.isVisibleField = function() {
    this.m_isVisibleField = true;
    if (IsBoolean(this.m_fieldName)) {
        for (var i = 0; i < this.m_fieldName.length; i++) {
            if ((this.m_fieldType[this.m_fieldName[i]] == "Values") && IsBoolean(this.m_seriesVisibleArr[this.m_fieldName[i]])){
                this.m_isVisibleField = false;
            	break;
            }
        }
    }
};
/** @description updation of global variable**/
DynamicDataGrid.prototype.updateGlobalVariableWithColumnData = function () {
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

/** @description creation of Div and Table ,Table is appended into div and setting CSS property **/
DynamicDataGrid.prototype.createDatagrid = function () {
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
	$("#" + temp.m_componentid).css({
		"top": 1 * (this.m_y) + 1 * (this.m_titleHeight) + 1 * (this.m_subTitleHeight) + 4 + "px",
		"left": 1 * (this.m_x) + 2 + "px",
		"position": "absolute"
	});

	$("#datagridTable" + temp.m_objectid).css({
		"width": this.m_width - 4 * 1 + "px",
		"height": 1 * (this.m_height) - 1 * (this.m_titleHeight) - 1 * this.m_subTitleHeight - 1 * (this.m_DGFilterHeight) - 6 + "px"
	});
	this.m_gridFilterCondition = "";
};

/** @description Checking is Series Data Empty**/
DynamicDataGrid.prototype.isSeriesDataEmpty = function () {
	this.m_isEmptySeries = false;
	if (this.m_seriesData == "" || (this.m_seriesData.length != 0 && this.m_seriesData[0].length == 0)) {
		this.m_isEmptySeries = true;
	}
};

/** @description drawing of Chart Frame,Title,SubTitle,DynamicDataGrid **/
DynamicDataGrid.prototype.drawChart = function () {
	this.createCanvasForDynamicRangeAlert();
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	this.drawLegends();
	var map = this.IsDrawingPossible();
    if (IsBoolean(map.permission)) {
        this.drawPivotGrid();
    } else {
        this.drawMessage(map.message);
    }
};

/** @description chart Frame Drawing **/
DynamicDataGrid.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

/** @description Title Drawing**/
DynamicDataGrid.prototype.drawTitle = function () {
	this.m_title.draw();
};

/** @description SubTitle Drawing **/
DynamicDataGrid.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

DynamicDataGrid.prototype.drawPivotGrid = function(){
	var temp = this;
	var fitColumns = true;
	if (this.m_designModeDrawingFlag) {
		this.m_designModeDrawingFlag = (this.m_designMode) ? false :  true;
		fitColumns = (this.m_designMode) ? true :  false;
		if (!this.m_designMode){
			this.mappedData = [];
			this.mappedData = this.CreateHierarchyData();
			this.calculateColumnWidth();
			this.createColumnWiseData();
		}
		this.initDataGridAlerts();
		var config = {
			data : temp.m_seriesData,
			rowFontProperties : {"fontweight":temp.m_labelfontweight,"fontsize":temp.fontScaling(temp.m_labelfontsize) + "px","fontfamily":selectGlobalFont(temp.m_labelfontfamily),"fontstyle":temp.m_labelfontstyle},
			singleSelect : true,
			collapsible : true,
			rownumbers : false,
			remoteSort : false,
			showHeader : true,
			showFooter : false,
			scrollbarSize : temp.m_scrollbarsize,
			striped : true,
			placeholderNA : temp.m_placeholdernavalue,
			nowrap : !IsBoolean(temp.m_textwrap),
			autoRowHeight : true,
			fitColumns : fitColumns,
			frozenWidth : temp.firstColumWidth(),
			loadMsg : "",
			loading : false,
			loaded : false,
			pivot : {
				rows : temp.getRowFieldDetail().row,
				columns : temp.getColumnField(),
				values : temp.getValueHeads()
			},
			forzenColumnTitle : temp.getRowFieldDetail().displayName,
			valuePrecision : 0,
			onClickRow : function () {
				temp.m_isRowClicked = true;
				var fieldNameValueMap = temp.getFieldNameValueMap();
				var drillColor = "";
				temp.updateDataPoints(fieldNameValueMap, drillColor);
				temp.setGridColors();
				temp.setGridCss();
			},
			onSelect : function (record) {
				//temp.m_selectedRow = record ;
				//var opts = jqEasyUI("#datagridTable"+temp.m_objectid).datagrid("options");
			},
			onCollapse : function () {
				//var temp = this;
				var comp = $("#" + temp.m_componentid);
				//header properties
				comp.find(".datagrid-row").css("height", temp.getRowHeight(temp.m_rowheight)+"px");
				comp.find(".datagrid-row-alt").css("height", temp.getRowHeight(temp.m_rowheight)+"px");
			},
			onExpand : function () {
				//var temp = this;
				var comp = $("#" + temp.m_componentid);
				//header properties
				comp.find(".datagrid-row").css("height", temp.getRowHeight(temp.m_rowheight)+"px");
				comp.find(".datagrid-row-alt").css("height", temp.getRowHeight(temp.m_rowheight)+"px");
			},
			onLoadSuccess : function (data) {
				$("span").removeClass("tree-icon tree-folder tree-folder-open");
				$("span").removeClass("tree-file");
				temp.setGridColors();
				temp.setGridCss();
				temp.updateGridNodeState();
				// Reset the scroll from the 
				/*setTimeout(function(){
					var header = $("#" + temp.m_componentid).find("div.datagrid-view2 > .datagrid-header");
					//var scrollwidth = (temp.m_fitcolumns) ? 6 : 6;
					$(header).css("width", ($(header).width())+"px");
					//Added for enable tooltip when header text is large and nowrap.
					if (IsBoolean(temp.m_enableheadertooltip)) {
						$(header).find("td").find("div").each(function(){
							this.title = this.innerText;
						});
					}
				},10);*/
				
				if(!IsBoolean(temp.m_designMode)){
					temp.drawMicroCharts();
                }
			},
			groupFormatter : function (value, rows) {
				//return value + " - " + rows.length + " Item(s)";
			},
			renderRow : function (target, fields, frozen, rowIndex, rowData) {
				//console.log("rowdata==>"+rowData);
			},
			rowStyler : function (index, row) {
				return temp.StyleRows(row, temp);
			}
		};
		jqEasyUI("#datagridTable" + this.m_objectid).pivotgrid(config);
	} else {
		jqEasyUI("#datagridTable" + temp.m_objectid).pivotgrid("resize", {
			fitColumns : true,
			width : temp.m_width - 4,
			height : 1 * temp.m_height - 1 * temp.m_titleHeight - temp.m_subTitleHeight * 1 - 1 * temp.m_DGFilterHeight - 8
		});
		temp.setGridColors();
		temp.setGridCss();
	}
};
DynamicDataGrid.prototype.drawMicroCharts = function() {
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
			}
		}
	}
};
/** @description Jquery Sparkline bullet microchart draw method  **/
DynamicDataGrid.prototype.drawBullet = function(j) {
    var tooltipBGColor = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
	var config = {
		width:Math.round(this.m_widthArr[this.m_colHeadersFieldName[j]]) - 18,
	    height: Math.round(this.m_rowheight) - 5,
	    tooltipBackgroundColor: tooltipBGColor,
	    disableTooltips: (!IsBoolean(this.legendMap[this.m_colHeadersFieldName[j]].toolTipColumn))
	};
	$(".bullet"+this.m_objectid+this.getStringARSC(this.m_colHeadersFieldName[j])).sparkline('html', this.getBulletConfig(config, this.m_colHeadersFieldName[j], this.m_gridheaderDisplayNames[j]));
};
/** @description Jquery Sparkline line microchart draw method  **/
DynamicDataGrid.prototype.drawSparkline = function(j) {
    var tooltipBGColor = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
	var config = {
		width:Math.round(this.m_widthArr[this.m_colHeadersFieldName[j]]) - 8,
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
DynamicDataGrid.prototype.drawSparkColumn = function(j) {
    var tooltipBGColor = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
	var config = {
		width:Math.round(this.m_widthArr[this.m_colHeadersFieldName[j]]) - 8,
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
DynamicDataGrid.prototype.drawSparkPie = function(j) {
    var tooltipBGColor = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
	var config = {
		width:Math.round(this.m_widthArr[this.m_colHeadersFieldName[j]]) - 8,
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

/** Collapse or Expand all the node when the pivot loads **/
DynamicDataGrid.prototype.updateGridNodeState = function () {
	var temp = this;
	if(IsBoolean(temp.m_collapseallnode)){
		$("#datagridTable" + temp.m_objectid).treegrid("collapseAll");
	}else{
		$("#datagridTable" + temp.m_objectid).treegrid("expandAll");
	}
};
/** Calculation for First Column Width**/
DynamicDataGrid.prototype.firstColumWidth = function() {
	if (this.getRowFieldDetail().width == 0)
		return 0;
	else if (this.m_firstcolumnwidth == "")
		return this.getRowFieldDetail().width;
	else
		return this.m_firstcolumnwidth;
};

/** @description Putting each column data into column field for dynamic alert**/
DynamicDataGrid.prototype.createColumnWiseData = function() {
	for (var i = 0; i < this.mappedData.length; i++) {
		for (var key in this.mappedData[i]) {
			if (this.columnWiseData[key] == undefined) {
				this.columnWiseData[key] = [];
			}
			var data = this.mappedData[i][key];
			if(Object.prototype.toString.call( this.mappedData[i][key] ) === "[object Array]"){
				var sum = 0;
				for(var j = 0; j < data.length; j++){
					var val = getNumericComparableValue(data[j]) * 1;
					if(!isNaN(val)){
						sum += val;
					}
				}
				data = sum;
			}
			this.columnWiseData[key].push(data);
		}
	}
	var tempColumnWiseData = {};
	for (var key1 in this.columnWiseData) {
		var key2 = this.getStringARSC(key1);
		tempColumnWiseData[key2] = {};
		tempColumnWiseData[key2]["max"] = getNumericMax(this.columnWiseData[key1]);
		tempColumnWiseData[key2]["min"] = getNumericMin(this.columnWiseData[key1]);
	}
	this.columnWiseData = {};
	this.columnWiseData = tempColumnWiseData;
};

/** @description Column Width calculation **/
DynamicDataGrid.prototype.calculateColumnWidth = function() {
	if (IsBoolean(this.isMaximized)) {
	    var availWidth = this.m_width - this.getRowFieldDetail().width - this.m_slidermargin * 1;
	    if (this.mappedData.length != 0) {
	        var AllColumns = Object.keys(this.mappedData[0]);
	        var usedColumns = 0;
	        for (var j = 0; j < AllColumns.length; j++) {
	            if (AllColumns[j] != "_id_field" && AllColumns[j] != "_rows" && AllColumns[j] != "_tree_field"){
	                usedColumns++;
	            }
	        }
	        var repeatSeqNo = (usedColumns / this.getValueFieldName().visibleField.length);
	        var currentColWidth = this.getValueFieldWidth() * repeatSeqNo;
	        if (currentColWidth < availWidth) {
	            this.calculateColumnWidths();
	        }
	    }
	} else {
		this.calculateColumnWidths();
	}
};
/** @description calculate column width based on fitcolumns true/false **/
DynamicDataGrid.prototype.calculateColumnWidths = function() {
	var availWidth = this.m_width - this.getRowFieldDetail().width - this.m_slidermargin * 1;
	if (this.m_fitcolumns) {
	    for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
	        if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Values" && IsBoolean(this.m_visibleArr[j])) { 
	            this.m_widthArr[this.fieldsData[j]["fieldname"]] = availWidth / (this.dynamicColumn.visible).length;
	        }
	    }
	} else {
	    for (var i = 0; i < this.fieldsData.length; i++) {
	    	// Added below if block for BDD-798 Grids column width should be adjusted while Maximize the grid when fit column disabled.
	    	if(this.isMaximized && availWidth > 0) {
	    		if (this.m_fieldType[this.m_colHeadersFieldName[i]] == "Values" && IsBoolean(this.m_visibleArr[i])) { 
		            this.m_widthArr[this.fieldsData[i]["fieldname"]] = availWidth / (this.dynamicColumn.visible).length;
		        }
	    	} else {
	    		this.m_widthArr[this.fieldsData[i]["fieldname"]] = this.getProperAttributeNameValue(this.fieldsData[i], "width");
	    	}
	    }
	}
};
/** @description creation of Hierarichal Data**/
DynamicDataGrid.prototype.CreateHierarchyData = function () {
	var temp = this;
	var data = this.m_seriesData;
	var opts = {};
	opts.rows = this.getRowFieldDetail().row;
	var fieldAggregation = {};
	for(var key in temp.m_fieldAggregation){
		if(temp.m_fieldAggregation.hasOwnProperty(key)){
			fieldAggregation[this.getStringARSC(key)] = temp.m_fieldAggregation[key];
		}
	}
	var _idIndex = 1;
	var allRows = [];
	var topRows = [];
	var dynamicColumn = this.getDynamicColumn();
	var columnNames = this.getColumnField();
	$.map(opts.rows, function (field, index) {
		var pfield = opts.rows[index - 1];
		if (pfield) {
			var tmpRows = [];
			while (topRows.length) {
				var r1 = topRows.shift();
				var groups = temp.getR1(field, r1._rows);
				$.map(groups, function (rows) {
					var r = temp.groupOperation(rows, dynamicColumn, columnNames, fieldAggregation);
					r._rows = rows;
					r["_tree_field"] = rows[0][field];
					r._parentId = r1["_id_field"];
					r["_id_field"] = _idIndex++;
					allRows.push(r);
					tmpRows.push(r);
				});
			}
			topRows = tmpRows;
		} else {
			var groups = temp.getR1(field, data);
			$.map(groups, function (rows) {
				var r = temp.groupOperation(rows, dynamicColumn, columnNames, fieldAggregation);
				r._rows = rows;
				var rowValue = rows[0][field];
				if (rows[0][field] == undefined)
					rowValue = " ";

				r["_tree_field"] = rowValue;
				r["_id_field"] = _idIndex++;
				topRows.push(r);
				allRows.push(r);
			});
		}
	});
	return allRows;
};

/** @description getting dynamic column name**/
DynamicDataGrid.prototype.getDynamicColumn = function () {
	var columHeader = [];
	/**Commented below line to enable invisible fields for indicator */
	//var valueFieldName = this.getValueFieldName()["visibleField"];["AllField"]
	this.dynamicColumn = {
			"visible":[],
			"invisible":[]
	}
	var visible = [];
	var invisible = [];
	var valueFieldName = this.getValueFieldName();
	var columnField = this.getColumnField();
	for (var i = 0; i < this.m_seriesData.length; i++) {
		for (var k = 0; k < valueFieldName["AllField"].length; k++) {
			if (valueFieldName["visibleField"].indexOf(valueFieldName["AllField"][k]) != -1) {
				var columnName = "";
				for (var j = 0; j < columnField.length; j++) {
					if (columnField[j] == " ")
						columnName += " " + "_";
					else
						columnName += this.m_seriesData[i][columnField[j]] + "_";
				}
				columnName += valueFieldName["AllField"][k];
				columHeader.push(columnName);
				visible.push(columnName);
			} else {
				var columnName = "";
				for (var j = 0; j < columnField.length; j++) {
					if (columnField[j] == " ")
						columnName += " " + "_";
					else
						columnName += this.m_seriesData[i][columnField[j]] + "_";
				}
				columnName += valueFieldName["AllField"][k];
				columHeader.push(columnName);
				invisible.push(columnName);
			}
		}
	}
	var uniqueHeader = columHeader.filter(function (itm, k, columHeader) {
		return k == columHeader.indexOf(itm);
	});
	this.dynamicColumn.visible = visible.filter(function (itm, k, visible) {
		return k == visible.indexOf(itm);
	});
	this.dynamicColumn.invisible = invisible.filter(function (itm, k, invisible) {
		return k == invisible.indexOf(itm);
	});
	return uniqueHeader;
};

/** @description creation of Groups **/
DynamicDataGrid.prototype.getR1 = function (field, rows) {
	var result = {};
	$.map(rows, function (row) {
		var val = row[field];
		var rr = result[val];
		if (!rr) {
			rr = [row];
		} else {
			rr.push(row);
		}
		result[val] = rr;
	});
	var groups = [];
	for (var val in result) {
		groups.push(result[val]);
	}
	return groups;
};

/** @description Group contains Multiple value ,passing Group Values for Aggregation**/
DynamicDataGrid.prototype.groupOperation = function (rows, dynamicColumn, ColumnField, fieldAggregation) {
	var temp = this;
	var r = {};
	var fields = dynamicColumn;
	$.map(fields, function (field) {
		r[field] = temp.Aggreagation(field, rows, ColumnField, fieldAggregation);
	});
	return r;
};

/** @description checking aggregation type ,preparing data. Finally aggregated value of group will return **/
DynamicDataGrid.prototype.Aggreagation = function (field, rows, ColumnField, fieldAggregation) {
	var temp = this;
	var tt = field.split("_");
	var data = $.map(rows, function (row) {
		for (var i = 0; i < ColumnField.length; i++) {
			var rowValue = (row[ColumnField[i]] == undefined) ? (" ") : (row[ColumnField[i]]);
			if (rowValue != tt[i]) {
				return undefined;
			}
		}
		return row[tt[tt.length - 1]];
	});
	
	var aggregationtype = fieldAggregation[[tt[tt.length - 1]]];
	aggregationtype = (aggregationtype !== undefined) ? aggregationtype : "sum"
	return (aggregationtype == "none") ? data : getAggregationOperatedData(data, aggregationtype);
};

/** @description checking is Row Field Empty **/
DynamicDataGrid.prototype.isRowFieldEmpty = function () {
	var flag = true;
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Row" && IsBoolean(this.m_visibleArr[j])) {
			flag = false;
			break;
		}
	}
	return flag;
};

/** @description Getting Row Field Name and Width and putting into MAP**/
DynamicDataGrid.prototype.getRowFieldDetail = function () {
	var rowField = [];
	var width = 0;
	var displayName = "";
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Row" && IsBoolean(this.m_visibleArr[j])) {
			rowField.push(this.getStringARSC(this.m_colHeadersFieldName[j]));
		}
	}
	if (rowField.length == 0){
		rowField.push(" ");
	}
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Row" && IsBoolean(this.m_visibleArr[j])) {
			displayName = this.m_gridheaderDisplayNames[j];
			width = this.m_widthArr[this.m_colHeadersFieldName[j]];
			width = (this.m_firstcolumnwidth !== "" && width*1 <  this.m_firstcolumnwidth*1) ? this.m_firstcolumnwidth*1 : width*1;
			break;
		}
	}
	return {
		"row" : rowField,
		"width" : width,
		"displayName" : "<span>" + displayName + "</span>"
	};
};

/** @description Getting Column Type Field Name **/
DynamicDataGrid.prototype.getColumnField = function () {
	var columnField = [];
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Column" && IsBoolean(this.m_visibleArr[j])) {
			columnField.push(this.getStringARSC(this.m_colHeadersFieldName[j]));
		}
	}
	if (columnField.length == 0){
		columnField.push(" ");
	}
	return columnField;
};

/** @description Get Value Type Field Name and Visible Field Name **/
DynamicDataGrid.prototype.getValueFieldName = function () {
	var AllField = [];
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Values") {
			AllField.push(this.getStringARSC(this.m_colHeadersFieldName[j]));
		}
	}
	var visibleField = [];
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Values" && IsBoolean(this.m_visibleArr[j])) {
			visibleField.push(this.getStringARSC(this.m_colHeadersFieldName[j]));
		}
	}
	return {
		"AllField" : AllField,
		"visibleField" : visibleField
	};
};

/** @description Get Value Type Field Width**/
DynamicDataGrid.prototype.getValueFieldWidth = function () {
	var totWidth = 0;
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Values" && IsBoolean(this.m_visibleArr[j])) {
			totWidth += this.m_widthArr[this.m_colHeadersFieldName[j]]*1;
		}
	}
	return totWidth;
};

/** @description getter of Grid Value fields with events and styling **/
DynamicDataGrid.prototype.getValueHeads = function () {
	var values = [];
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if ( IsBoolean(this.m_seriesVisibleArr[this.m_colHeadersFieldName[j]]) && (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Values")) {
			var fieldname = (this.m_colHeadersFieldName[j]);
			var fieldname1 = this.getStringARSC(this.m_colHeadersFieldName[j]);
			var width = this.m_widthArr[fieldname];
			var valueField = {
				field : fieldname1,
				align : this.m_textAlignArr[fieldname],
				width : this.m_widthArr[fieldname],
				autoRowHeight : true,
				title : this.m_gridheaderDisplayNames[j],
				op : this.m_fieldAggregation[fieldname]
			};
			if (this.getAlertObj()[fieldname] != undefined && ((this.m_isNumericArr[j] == "Numeric"))) {
				if (this.getAlertObj()[fieldname].m_name == fieldname) {
					if( this.getAlertObj()[fieldname].m_mode == "Range"){ // && IsBoolean(this.getAlertObj()[fieldname].getDynamicRange())
						if(this.getAlertObj()[fieldname].getAlertType() == "colorfill"){
							valueField.styler = this.drawDynamicRange.bind(this, fieldname, j);
							valueField.formatter = this.drawToolTipForCell.bind(this, fieldname, j);
						}else{
							valueField.formatter = this.drawDynamicRange.bind(this, fieldname, j);
						}
					}else if (this.getAlertObj()[fieldname].getAlertType() == "colorfill") {
						valueField.styler = this.drawAlertImages.bind(this, fieldname, j);
						valueField.formatter = this.drawToolTipForCell.bind(this, fieldname, j);
					} else {
						valueField.formatter = this.drawAlertImages.bind(this, fieldname, j);
					}
				}else{
					valueField = "";
				}
			} else {
				valueField.formatter = this.drawToolTipForCell.bind(this, fieldname, j);
			}
			values.push(valueField);
		}
	}
	return values;
};

/** @description calling for drawing dynamic Alert **/
DynamicDataGrid.prototype.drawDynamicRange = function (colName, colIndex, val, row,DynamicColName) {
	if (!IsBoolean(this.showParent(colName, colIndex, val, row, DynamicColName))) {
		return "";
	}
	var formattedValue;
    if (!IsBoolean(this.m_isFixedLabelArr[colName]) && this.m_formatterArr[colName] != "none" && this.m_formatterArr[colName] != ""){
        formattedValue = this.FormatCellValue(colName, colIndex, val, row, DynamicColName);
    }else{
        formattedValue = this.setPrecision(colName, colIndex, val);
    }
    var showTooltip = this.m_tooltipColumnsArr[colIndex];
    var toolTipInfo = {
    	    "colName": colName,
    	    "rowId": row._id_field - 1,
    	    "tooltipValue": formattedValue,
    	    "dynamicColumn": DynamicColName
    	};
    	var toolTipformattedvalue = "";
    	if (this.m_TooltipFieldsArr[colName].length > 0 && (row._id_field <= this.mappedData.length)) {
    	   toolTipformattedvalue = this.getCustomTooltipData(toolTipInfo, row);
    	}
	return this.getAlertObj()[colName].drawDynamicAlert(colName, colIndex, val, row, DynamicColName, formattedValue, showTooltip, toolTipformattedvalue);
};

/** @description Setter of Precision **/
DynamicDataGrid.prototype.setPrecision = function (colName, index, value, row, DynamicColName) {
	if (!IsBoolean(this.showParent(colName, index, value, row, DynamicColName))) {
		return "";
	}
	var precision = this.m_precisionArr[colName];
	if (!isNaN(value))
		return this.checkPrecision(value, precision,this.m_fieldAggregation[colName]);
	else
		return value;
};

/** @description Checking have we to show the parent value or not**/
DynamicDataGrid.prototype.showParent = function(colName, colIndex, val, row, DynamicColName) {
	if ((this.m_fieldAggregation[colName] == "none") && (row.children !== undefined && row.children.length > 0))
		return false;
	else
		return true;
};
/** @description Checking For alert and Formatting **/
DynamicDataGrid.prototype.drawAlertImages = function(colName, colIndex, val, row, DynamicColName) {
    if (!IsBoolean(this.showParent(colName, colIndex, val, row, DynamicColName))) {
        return "";
    }
    var temp = this;
    var formattedValue = val;
    if (!IsBoolean(this.m_isFixedLabelArr[colName]) && this.m_formatterArr[colName] != "none" && this.m_formatterArr[colName] != ""){
        formattedValue = this.FormatCellValue(colName, colIndex, val, row, DynamicColName); //colName,colIndex,value , row
    }else{
        formattedValue = this.setPrecision(colName, colIndex, val);
    }
    var showTooltip = this.m_tooltipColumnsArr[colIndex];
    var toolTipInfo = {
			"colName": colName,
			"rowId" : row._id_field - 1,
			"tooltipValue" : formattedValue,
			"dynamicColumn" : DynamicColName
	};
    var toolTipformattedvalue = "";
    if (this.m_TooltipFieldsArr[colName].length > 0 && (row._id_field <= this.mappedData.length)) {
	    toolTipformattedvalue = this.getCustomTooltipData(toolTipInfo, row);
	}
    for (var key in row) {
        if (key == DynamicColName && val == row[DynamicColName] && temp.getAlertObj()[colName] != undefined) {
            var compareColName = temp.getAlertObj()[colName].m_comparecolumn;
            var compareColData = "";
            if (compareColName != "" && compareColName != undefined) {
                var compareColData = temp.getMatchedRecord(colName, DynamicColName, row, compareColName, val);
            }
            return temp.getAlertObj()[colName].drawAlerts(compareColData, val, temp, key, "", formattedValue, colIndex, showTooltip, toolTipformattedvalue);
        }
    }
};

/** @description Getting Matched Records**/
DynamicDataGrid.prototype.getMatchedRecord = function (colName, DynamicColumn, row, compareColName, val) {
	var temp = this;
	var colName = temp.getStringARSC(colName);
	var compareColName = temp.getStringARSC(compareColName);
	var data = this.mappedData;
	for (var key in data) {
		if ((data[key]["_tree_field"] == row["_tree_field"]) && (IsBoolean(temp.isMatch(data[key][DynamicColumn], val)))) {
			var dynamicCompareCol = DynamicColumn.split(colName)[0] + compareColName;
			return data[key][dynamicCompareCol];
		}
	}
	return "";
};

/** @description Value Matching **/
DynamicDataGrid.prototype.isMatch = function (val1, val2) {
	if (typeof val1 == "object") {
		var val = val2[0];
		return ($(val1).not(val).length === 0 && $(val).not(val1).length === 0);
	} else{
		return (val1 == val2);
	}
};

/** @description Tool Tip generation for the cell **/
DynamicDataGrid.prototype.drawToolTipForCell = function (colName, index, val, row, dynamicColumn) {
	/*var colData = row._rows[0][colName];*/
	var colData = val;
	if((this.legendMap[colName].cellType == "Sparkline" || this.legendMap[colName].cellType == "SparkColumn" || this.legendMap[colName].cellType == "SparkPie") && (colData!="null" && colData!=undefined && isNaN(colData) && colData!="NA")){
		if (!IsBoolean(this.showParent(colName, index, val, row, dynamicColumn))) {
			return "";
		}
		return '<div class="'+this.legendMap[colName].cellType+this.m_objectid+this.getStringARSC(colName)+'" style="width:'+this.m_widthArr[colName]+'px;">'+colData+'</div>';
	}else if(this.legendMap[colName].cellType == "Image" && (colData!="null" && colData!=undefined && isNaN(colData) && colData!="NA")){
		if (!IsBoolean(this.showParent(colName, index, val, row, dynamicColumn))) {
			return "";
		}
		return '<img src="'+colData+'" style="height:'+(this.m_rowheight*1-1)+'px; width:'+(this.m_rowheight*1-1)+'px;"></img>'
	}else if(this.legendMap[colName].cellType == "ProgressBar" && (colData!="null" && colData!=undefined && !isNaN(colData) && colData!="NA")){
		if (!IsBoolean(this.showParent(colName, index, val, row, dynamicColumn))) {
			return "";
		}
		return this.drawProgressBar(colName, index, val, row);
	}else if(this.legendMap[colName].cellType == "Bullet" && (colData!="null" && colData!=undefined && isNaN(colData) && colData!="NA")){
		if (!IsBoolean(this.showParent(colName, index, val, row, dynamicColumn))) {
			return "";
		}
		return '<div class="bullet'+this.m_objectid+this.getStringARSC(colName)+'" style="width:'+this.m_widthArr[index]+'px;">'+val+'</div>';
	}else{
		if (!IsBoolean(this.showParent(colName, index, val, row, dynamicColumn))) {
			return "";
		}
		var value;
		if ((IsBoolean(!IsBoolean(this.m_isFixedLabelArr[colName]))))
			value = (val == undefined || val === "") ? "" : this.FormatCellValue(colName, index, val, row, dynamicColumn);
		else
			value = (val == undefined || val === "") ? "" : val;
		var alertObject = this.getAlertObj()[(colName)];
		var showtooltip = this.m_tooltipColumnsArr[index];
		if(alertObject !== undefined)
		value = (IsBoolean(alertObject.m_showdata) == true) ? value : "&nbsp;";
		var tooltipdata = (isNaN(value) && (typeof formattedValue === 'string'))?b64EncodeUnicode(value):value;
		var tooltipValue = "'" + tooltipdata + "'";
		var tooltipBGColor = "'" + this.m_tooltipbackgroundcolor + "'";
		var tooltipBGAlpha = "'" + this.m_tooltipbackgroundtransparency + "'";
		var customToolTipWidth = "'" + this.m_customtooltipwidth + "'";
		/**Hyperlink will not work for numeric/null/undefined 
		 * values present along with valid values**/
		if(this.legendMap[colName].cellType == "Hyperlink" && (colData!="null" && colData!=undefined && colData!="NA" && isNaN(colData))) {
	    		return '<div onclick="openHyperlink(\'' + colData + '\')" onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ',' + false + ',' + this.m_gridcustomtooltip + ')" onmouseout="hideToolTip()" style="z-index:999; cursor:pointer;">' + colData + '</div>';
	    } else {
	    	if (this.m_TooltipFieldsArr[colName].length > 0 && (row._id_field <= this.mappedData.length)) {
	    		var toolTipInfo = {
	    				"colName": colName,
	    				"rowId" : row._id_field - 1,
	    				"tooltipValue" : tooltipValue,
	    				"dynamicColumn" : dynamicColumn
	    		};
	    	    if (this.m_TooltipFieldsArr[colName].length == 1) {
	    	        return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + this.getCustomTooltipData(toolTipInfo, row) + ',' + tooltipBGColor + ',' + tooltipBGAlpha + ',' + customToolTipWidth + ',' + false + ',' + this.m_gridcustomtooltip +')" onmouseout="hideToolTip()" style="z-index:999;">' + value + '</div>';
	    	    } else {
	    	    	var toolTipObj = "'" + this.getCustomTooltipData(toolTipInfo, row).value + "'";
	    	        return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + toolTipObj + ',' + tooltipBGColor + ',' + tooltipBGAlpha + ',' + customToolTipWidth +  ',' + true + ',' + this.m_gridcustomtooltip +')" onmouseout="hideToolTip()" style="z-index:999;">' + value + '</div>';
	    	    }
	    	} else {
	    	    return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' + tooltipBGAlpha + ',' + customToolTipWidth +  ',' + false + ',' + this.m_gridcustomtooltip + ')" onmouseout="hideToolTip()" style="z-index:999;">' + value + '</div>';
	    	}
	    }
	}
};

DynamicDataGrid.prototype.getCustomTooltipData = function(toolTipInfo,rowdata) {
	var tooltipValues = {};
	var columnName = toolTipInfo.dynamicColumn.split('_')[0];
	var fieldName = toolTipInfo.dynamicColumn.split('_');
	var updatedFieldName = (fieldName.filter(function(val,index){
		if(val !== toolTipInfo.colName){
			return val;
		}
	})).join('_');
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
	    		var data = rowdata[updatedFieldName + "_"+arr[1]];
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
	        /*Added below changes, as other single field data is not displaying in tooltip*/
	        var reqdName = columnName + '_' + this.m_TooltipFieldsArr[toolTipInfo.colName][0];
	        var newValue = this.mappedData[toolTipInfo.rowId][reqdName];
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
	        //var reqdName = columnName + '_' + this.m_TooltipFieldsArr[toolTipInfo.colName][i];
	        var reqdName = this.m_TooltipFieldsArr[toolTipInfo.colName][i];
	        if (this.mappedData[toolTipInfo.rowId][" _" + reqdName]) {
                (this.mappedData[toolTipInfo.rowId]._rows[0][reqdName]) = this.mappedData[toolTipInfo.rowId][" _" + reqdName];
            }
	        tooltipValues[this.m_TooltipFieldsArr[toolTipInfo.colName][i]] = (this.mappedData[toolTipInfo.rowId]._rows[0][reqdName]);
	        tooltipValues[this.m_TooltipFieldsArr[toolTipInfo.colName][i]] = (tooltipValues[this.m_TooltipFieldsArr[toolTipInfo.colName][i]] == "") ?
	            0 : tooltipValues[this.m_TooltipFieldsArr[toolTipInfo.colName][i]];
	    }
	    toolTipObj.value = btoa(JSON.stringify(tooltipValues));
	    return toolTipObj;
	}
};
DynamicDataGrid.prototype.getProgressBarColor = function() {
	return ["#83cc0f","#f7244a","#f5b229","#ddc617","#49b1de"];
};
/** @description drawing of ProgressBar inside the grid cell **/
DynamicDataGrid.prototype.drawProgressBar = function(colName, index, val, row) {
	var ProgressClass = "progressDiv"+this.m_objectid+this.getStringARSC(colName);
	var showtooltip = this.m_tooltipColumnsArr[index];
	var tooltipdata = (isNaN(val))?b64EncodeUnicode(val):val;
	var tooltipValue = "'" + tooltipdata + "'";
	var colorArr = this.getProgressBarColor();
	var silderHeight = this.fontScaling(3);
	var tooltipBGColor = "'" + this.m_tooltipbackgroundcolor + "'";
	var tooltipBGAlpha = "'" + this.m_tooltipbackgroundtransparency + "'";
	var customToolTipWidth = "'" + this.m_customtooltipwidth + "'";
	if(1*val===0){
		var leftBarWidth = 0;
		var rightBarWidth = (this.m_widthArr[colName] - 10);
		var ProgressClassStyle = '"border-left:'+silderHeight+'px solid transparent;border-right:'+silderHeight+'px solid transparent; width:'+(1*this.m_widthArr[colName] - 10)+'px;"';
		var ProgressLeftDivStyle = '"border:'+silderHeight+'px solid '+colorArr[0]+'; border-top-left-radius: 2em; border-bottom-left-radius: 2em; float:left; width:'+(leftBarWidth)+'px;"';
		var ProgressRightDivStyle = '"border:'+silderHeight+'px solid '+colorArr[1]+'; border-top-left-radius: 2em; border-bottom-left-radius: 2em; border-top-right-radius: 2em; border-bottom-right-radius: 2em; float:right; width:'+(rightBarWidth)+'px;"';
		var text = '<div style="display:flex;" class="progressBarLabels"><div align="left" style="float:left; width:50%;">'+this.getFormattedCellValue(val, colName, index)+'</div><div align="right" style="float:right; width:50%;">'+this.getFormattedCellValue(100-val, colName, index)+'</div></div>'
		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ')" onmouseout="hideToolTip()" class='+ProgressClass+' style='+ProgressClassStyle+'>'+text+'<div style="display:flex;"><div style='+ProgressRightDivStyle+'></div></div>';
	}else if(1*val===100){
		var leftBarWidth = (this.m_widthArr[colName] - 10);
		var rightBarWidth = 0;
		var ProgressClassStyle = '"border-left:'+silderHeight+'px solid transparent;border-right:'+silderHeight+'px solid transparent; width:'+(1*this.m_widthArr[colName] - 10)+'px;"';
		var ProgressLeftDivStyle = '"border:'+silderHeight+'px solid '+colorArr[0]+'; border-top-left-radius: 2em; border-bottom-left-radius: 2em; border-top-right-radius: 2em; border-bottom-right-radius: 2em; float:left; width:'+(leftBarWidth)+'px;"';
		var ProgressRightDivStyle = '"border:'+silderHeight+'px solid '+colorArr[1]+'; border-top-right-radius: 2em; border-bottom-right-radius: 2em; float:right; width:'+(rightBarWidth)+'px;"';
		var text = '<div style="display:flex;" class="progressBarLabels"><div align="left" style="float:left; width:50%;">'+this.getFormattedCellValue(val, colName, index)+'</div><div align="right" style="float:right; width:50%;">'+this.getFormattedCellValue(100-val, colName, index)+'</div></div>'
		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ')" onmouseout="hideToolTip()" class='+ProgressClass+' style='+ProgressClassStyle+'>'+text+'<div style="display:flex;"><div style='+ProgressLeftDivStyle+'></div></div></div>';
	}else if(1*val<0 || 1*val > 100){
		var leftBarWidth = (this.m_widthArr[colName] - 10);
		var ProgressClassStyle = '"border-left:'+silderHeight+'px solid transparent;border-right:'+silderHeight+'px solid transparent; width:'+(1*this.m_widthArr[colName] - 10)+'px;"';
		var ProgressLeftDivStyle = '"border:'+silderHeight+'px solid '+this.m_defaultalertcolor+'; border-top-left-radius: 2em; border-bottom-left-radius: 2em; border-top-right-radius: 2em; border-bottom-right-radius: 2em; float:left; width:'+(leftBarWidth)+'px;"';
		var text = '<div style="display:flex;" class="progressBarLabels"><div align="left" style="float:left; width:80%;">'+this.getFormattedCellValue(val, colName, index)+'</div><div align="right" style="float:right; width:20%;"></div></div>'
		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ')" onmouseout="hideToolTip()" class='+ProgressClass+' style='+ProgressClassStyle+'>'+text+'<div style="display:flex;"><div style='+ProgressLeftDivStyle+'></div></div></div>';
	}else{
		var leftBarWidth = (val*(this.m_widthArr[colName] - 10)/100);
		var rightBarWidth = (this.m_widthArr[colName]*1 - 14) - leftBarWidth;
		var ProgressClassStyle = '"border-left:'+silderHeight+'px solid transparent;border-right:'+silderHeight+'px solid transparent; width:'+(1*this.m_widthArr[index] - 10)+'px;"';
		var ProgressLeftDivStyle = '"border:'+silderHeight+'px solid '+colorArr[0]+'; border-top-left-radius: 2em; border-bottom-left-radius: 2em; float:left; width:'+(leftBarWidth)+'px;"';
		var ProgressRightDivStyle = '"border:'+silderHeight+'px solid '+colorArr[1]+'; border-top-right-radius: 2em; border-bottom-right-radius: 2em; float:right; width:'+(rightBarWidth)+'px;"';
		var text = '<div style="display:flex;" class="progressBarLabels"><div align="left" style="float:left; width:50%;">'+this.getFormattedCellValue(val, colName, index)+'</div><div align="right" style="float:right; width:50%;">'+this.getFormattedCellValue(100-val, colName, index)+'</div></div>'
		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ')" onmouseout="hideToolTip()" class='+ProgressClass+' style='+ProgressClassStyle+'>'+text+'<div style="display:flex;"><div style='+ProgressLeftDivStyle+'></div><div style="border: 1px solid #ffffff;"></div><div style='+ProgressRightDivStyle+'></div></div></div>';
	}
};

/** @description Checking Precision for Value Field **/
DynamicDataGrid.prototype.checkPrecision = function (val, prec,fieldAggregation) {
	var isCommaSeparated = (("" + val).indexOf(",") > 0) ? true : false;
	var value = getNumericComparableValue(val);
	if((IsBoolean(prec !== "default"))&&(IsBoolean(fieldAggregation !== "count"))){
		value = ((1 * value).toFixed((prec == "") ? 0 : prec));
	}
	return (isCommaSeparated == true) ? getNumberWithCommas(value) : value;
};

/** @description format cell value when value is not null**/
DynamicDataGrid.prototype.FormatCellValue = function (colName, colIndex, value, row, dynamicColumn) {
	if (!IsBoolean(this.showParent(colName, colIndex, value, row, dynamicColumn))) {
		return "";
	}
	var temp = this;
	//var rowData=row._rows;
	for (var key in row) {
		if (key == dynamicColumn && value == row[key]) {
			if (value === "" || value == "NIL" || value == "null" || (temp.m_fieldAggregation[colName] == "count")){
				return value;
			}else{
				return temp.getFormattedCellValue(value, colName, colIndex);
			}
	
       }
	}
};
/** @description format cell value on the basis of given formatter in the Value Fields **/
DynamicDataGrid.prototype.getFormattedCellValue = function (value, colName, index) {
	if (!isNaN(getNumericComparableValue(value))) {
		// added check for value is number or not otherwise return same string value
		var isCommaSeparated = (("" + value).indexOf(",") > 0) ? true : false;
		var formatter = this.m_formatterArr[colName];
		var unit = this.m_unitNameArr[colName];
		var valueToBeFormatted = value * 1;
		var signPosition = (this.m_signPositioneArr[colName] != "") ? this.m_signPositioneArr[colName] : "suffix";
		var precision = this.m_precisionArr[colName];
		var secondFormatter = this.m_secondFormatterArr[colName];
		var secondUnit = this.m_secondUnitNameArr[colName];
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
					if (secondFormatter != "none" && secondUnit != "") {
						valueToBeFormatted = this.m_util.addFormatter(valueToBeFormatted, secondFormatterSymbol, "suffix");
					}
	    		}
				valueToBeFormatted = getFormattedNumberWithCommas(valueToBeFormatted,this.m_numberFormatColumnsArr[index]);
				/* To add Currency formatter */
				valueToBeFormatted = (valueToBeFormatted == "NaN" || valueToBeFormatted == "") ? "" : this.m_util.addFormatter(IsBoolean(isCommaSeparated) ? getNumberWithCommas(valueToBeFormatted) : valueToBeFormatted, formatterSymbol, signPosition);
				return valueToBeFormatted;
		} else
			return (valueToBeFormatted == "NaN") ? value : valueToBeFormatted;
	} else {
		return value;
	}
};

/** @description Getting Column Field Name Without any modification **/
DynamicDataGrid.prototype.getColumnOriginalFieldName = function () {
	var columnField = [];
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Column" && IsBoolean(this.m_visibleArr[j])) {
			columnField.push((this.m_colHeadersFieldName[j]));
		}
	}
	return columnField;
};

/** @description Get value Field Name**/
DynamicDataGrid.prototype.getValueOriginalFieldName = function () {
	var visibleField = [];
	var invisibleField = [];
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Values") {
			/**Getting invisible field values to pass invisible fields in drill object*/
			if (IsBoolean(this.m_visibleArr[j])) {
				visibleField.push(this.m_colHeadersFieldName[j]);
			} else {
				invisibleField.push(this.m_colHeadersFieldName[j]);
			}
		} else {
			if (IsBoolean(this.m_visibleArr[j])) {
				visibleField.push(this.m_colHeadersFieldName[j]);
			} else {
				invisibleField.push(this.m_colHeadersFieldName[j]);
			}
		}
	}
	return {"visible": visibleField, "invisible": invisibleField};
};

/** @description Get Row Field Name**/
DynamicDataGrid.prototype.getRowOriginalFieldName = function () {
	var rowField = [];
	for (var j = 0; j < this.m_colHeadersFieldName.length; j++) {
		if (this.m_fieldType[this.m_colHeadersFieldName[j]] == "Row" && IsBoolean(this.m_visibleArr[j])) {
			rowField.push(this.m_colHeadersFieldName[j]);
		}
	}
	return rowField;
};

/** @description this Map contains single row details in form of key value pair  **/
DynamicDataGrid.prototype.getFieldNameValueMap = function () {
	var row = null;
	try{
		/** throws error when clicked on title box **/
		row = jqEasyUI("#datagridTable" + this.m_objectid).pivotgrid("getSelected");
	}catch(e){
		console.log(e);
	}
	if(row !== null){

		/**Updated existing variables for pass invisible fields in drill object*/
		//var valueField = this.getValueOriginalFieldName();
		var fieldNames = this.getValueOriginalFieldName();
		var visibleValueField = fieldNames.visible;
		var invisibleValueField = fieldNames.invisible;
		var rowField = this.getRowOriginalFieldName();
		var columnField = this.getColumnOriginalFieldName();
		var fieldNameValueMap = {};
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
		for (var i = 0; i < visibleValueField.length; i++) {
			for (var key in row) {
				if (key.indexOf("_" + this.getStringARSC(visibleValueField[i])) != -1) {
					if (fieldNameValueMap[visibleValueField[i]] == undefined)
						fieldNameValueMap[visibleValueField[i]] = [];
					fieldNameValueMap[visibleValueField[i]].push(row[key]);
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
		/**Added for pass invisible fields in drill object*/
		for (var i = 0; i < invisibleValueField.length; i++) {
			if (fieldNameValueMap[invisibleValueField[i]] == undefined) {
				fieldNameValueMap[invisibleValueField[i]] = [];
			}
			var fieldName = this.getStringARSC(invisibleValueField[i]);
			fieldNameValueMap[invisibleValueField[i]].push(row._rows[0][fieldName]);
		}
		return fieldNameValueMap;
	}
};

/** @description styling the grid rows **/
DynamicDataGrid.prototype.StyleRows = function (row, pagingDG) {
	var temp = pagingDG;
	if (IsBoolean(temp.m_colorbycomparison)) {
		for (var i = 0; i < temp.getDataSet().getFields().length; i++) {
			//if(IsBoolean(temp.getDataSet().getFields()[i].getshowalert() ))
			{
				for (var key in row) {
					var value = row[key];
					if (temp.getAlertObj()[key] != undefined) {
						var alertObject = temp.getAlertObj()[key];
						if (alertObject.getAlertType() == "row" && alertObject.m_mode == "Numeral Comparison") {
							if ((value) == 1) {
								//var color=hex2rgb(alertObject.getRangeColor(0),0.7);
								var color = alertObject.getRangeColor(0);
								var gradient = this.createLinearGradient(color);
								return "background-color:" + gradient;
							} else if ((value) == 0) {
								//var color=hex2rgb(alertObject.getRangeColor(1),0.7);
								var color = alertObject.getRangeColor(1);
								var gradient = this.createLinearGradient(color);
								return "background-color:" + gradient;
							}
						} else {
							for (var q = 0; q < alertObject.alertRanges.length; q++) {
								var min = alertObject.getMinMaxRange(q)[0];
								var max = alertObject.getMinMaxRange(q)[1];
								if ((value <= (max * 1)) && (value >= (min * 1))) {
									var color = alertObject.getRangeColor(q);
									//console.log(key+"=="+value+"=="+value+"="+color+"="+max+"=="+min);
									return "background-color:" + color + " ; color:#000;";
								}
							}
						}
					}
				}
			}
		}
	}
};

/** @description creation of linear gradient**/
DynamicDataGrid.prototype.createLinearGradient = function (color) {
	var color = (convertColorToHex(color));
	return "background-image: -webkit-gradient(linear, left top, left bottom, from(#9e9e9e), to(#454545));" +
	" background-image: -webkit-linear-gradient(top, #fff 2%, #" + color + " 90%, #fff);" +
	"background-image:    -moz-linear-gradient(top, #fff 2%, #" + color + " 90%, #fff);" +
	" background-image:      -o-linear-gradient(top, #fff 2%, #" + color + " 90%, #fff);" +
	" background-image:         linear-gradient(to bottom, #fff 2%, #" + color + " 90%, #fff);" +
	"height: " + this.getRowHeight(this.m_rowheight) + "px;";
};

/** @description styling the datagrid **/
DynamicDataGrid.prototype.setGridCss = function () {
	var temp = this;
	var comp = $("#" + temp.m_componentid);
	//header properties
	comp.find(".panel-body").css("padding", "0px");
	comp.find(".panel").css("text-align", "left");
	if (IsBoolean(temp.isRowFieldEmpty())){
		comp.find(".datagrid-view").find(".datagrid-view1").remove();
	}
	comp.find(".datagrid-row").css("height", temp.getRowHeight(temp.m_rowheight)+"px");
	comp.find(".datagrid-row-alt").css("height", temp.getRowHeight(temp.m_rowheight)+"px");
	
    comp.find(".datagrid-header-row").css("height", temp.getRowHeight(temp.m_rowheight)+"px");
    
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
    	"font-style": temp.m_headerfontstyle
    });
    if(!IsBoolean(temp.m_usefieldalign)) {
    	comp.find(".datagrid-header-row td div").css({
        	"text-align": temp.m_headertextalign
        });
    }
	
	//label properties
    comp.find(".datagrid-cell").css({
    	"font-weight": temp.m_labelfontweight,
    	"font-size": temp.fontScaling(temp.m_labelfontsize) + "px",
    	"font-family": selectGlobalFont(temp.m_labelfontfamily),
    	"font-style": temp.m_labelfontstyle,
    	"text-decoration": temp.m_labeltextdecoration,
    	"color": convertColorToHex(temp.m_labelfontcolor)
    });
	comp.find(".datagrid-view1 .datagrid-body .datagrid-body-inner .datagrid-btable .datagrid-row td .tree-title").css({
		"text-decoration": temp.m_labeltextdecoration,
		"font-size": temp.fontScaling(temp.m_labelfontsize) + "px"
	});
	// grid horizontal/vertical line color property
	if (IsBoolean(temp.getDatagridStyles().m_showhorizontalgridlines)) {
        comp.find(".datagrid-header td").css({
            "border-top": "1px solid " + hex2rgb(temp.getDatagridStyles().getHorizontalGridLineColor(), temp.m_rowlinesopacity),
            "border-right": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity),
            "border-bottom": "1px solid " + hex2rgb(temp.getDatagridStyles().getHorizontalGridLineColor(), temp.m_rowlinesopacity),
            "border-left": "0px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity)
        });
        comp.find(".datagrid-view1 .datagrid-header tr").find("td:first").css({
        	"border-left": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity)
        });
		this.setCellBorder(".datagrid-view1","0px 1px 1px 1px");
		this.setCellBorder(".datagrid-view2","0px 1px 1px 0px");
    } else {
        comp.find(".datagrid-header td").css({
        	"border-right": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity),
			"border-width": "0px 1px 0px 0"
        });
        comp.find(".datagrid-view1 .datagrid-header tr").find("td:first").css({
        	"border-left": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity)
        });
		this.setCellBorder(".datagrid-view1","0px 1px 0px 1px");
		this.setCellBorder(".datagrid-view2","0px 1px 0px 0px");
    }
	
	comp.find(".datagrid-header").css("border-width", "0");
	if (IsBoolean(this.m_usefieldcolorasheader)) {
	    /**Feature Added for different color for different value field*/
	    var rowFieldArr = this.getRowFieldDetail().row;
	    comp.find(".datagrid-header-row  td").each(function() {
	        var fieldName = [];
	        fieldName = (this.attributes["0"].nodeValue).split("_");
	        var fieldNameLength = (fieldName.length - 1)
	        $(this).css({"background": hex2rgb(temp.m_fieldColors[fieldName[fieldNameLength]], temp.m_headerrowopacity)});
	    });
	    $(comp.find(".datagrid-header-row  td")[0]).css("background", hex2rgb(temp.m_fieldColors[this.getStringARSC(rowFieldArr[rowFieldArr.length - 1])], temp.m_headerrowopacity));
	} else {
		comp.find(".datagrid-header-row  td").each(function() {
	        $(this).css({"background": hex2rgb(convertColorToHex(temp.m_headerchromecolor), temp.m_headerrowopacity)});
	    });
	}
	// css for hiding the row numbers which wass showing on each row
	comp.find(".datagrid-cell-rownumber").css("width", "0px");
	comp.find(".datagrid-header-rownumber").css("width", "0px");
	// css for mask message " loading please wait"
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

	comp.find(".datagrid-view2 .datagrid-header-row .datagrid-cell-group").css({
		"white-space": "normal",
		"text-decoration": temp.m_headertextdecoration,
		"height": "auto"
	});
	comp.find(".datagrid-view").find(".datagrid-view1").find(".datagrid-body").find("table").css("border-collapse","initial");
	comp.find(".datagrid-view").find(".datagrid-view2").find(".datagrid-body").find("table").css("border-collapse","initial");
	
	if (IsBoolean(this.m_textwrap)) {
		comp.find("td div.datagrid-cell").css({
			"white-space":"normal",
			"word-wrap": "break-word",
			"height": "auto"
		});
		comp.find(".datagrid-header td span").css({
			"white-space": "normal",
			"word-wrap": "break-word"
		});
		/*added below style for applying text wrap in headers*/ 
		comp.find("td div.datagrid-cell-group").css({
			"white-space": "normal",
			"word-wrap": "break-word",
			"height": "auto"
		});
	}
//	comp.find(".datagrid-header td span.datagrid-sort-icon").css({"float":"right", "position":"absolute"});
	
	/** indents the sub nodes of score card when the subnode is wrapped **/
	comp.find(".tree-title").each(function(){
		var parent =(this.parentElement);
		var counter = $(parent).find(".tree-indent").length;
		var width = (counter) ? 
				(counter == 0) ? "84%" : 
					(counter == 1) ? "74%" : 
						(counter == 2) ? "62%" : 
							(counter == 3) ? "50%" : "40%" : "90%";
		$(this).css("width", width);
		$(this).css("display", "inline-table");
	});
	/** Added for row alignment when text wrap is true */
	comp.find(".datagrid-view1").find(".datagrid-row ").each(function(index){
 		var view1RowHeight = $(this).css("height");
		var tr = comp.find(".datagrid-view2").find(".datagrid-row ")[index];
		var view2RowHeight = $(tr).css("height");
		if (view2RowHeight > view1RowHeight) {
			$(this).css("height", view2RowHeight);
		} else {
			$(tr).css("height",view1RowHeight);
		}
 	});
	/**Added for pivot header alignment when header name is too long or contain any special character*/
	if (!IsBoolean(this.m_designMode)) {
	    comp.find(".datagrid-view2 .datagrid-header-row .datagrid-cell-group").each(function() {
	        var value = temp.getValueHeads();
	        var numericvalue = '';
	        var valueLength = value.length;
	        var totalColumLength = 0;
	        for (var i = 0; valueLength > i; i++) {
	            numericvalue = 1 * temp.m_widthArr[value[i].title];
	            totalColumLength += numericvalue;
	        }
	        var wid = (totalColumLength - (valueLength+1));
	        if(wid > 0)
	        	$(this).css('width', wid + "px");
	    });
	    /* DAS-711 **/
	    /*
	    comp.find(".datagrid-view2 .datagrid-header-row td[field]").each(function(){
	    	var classname = $(this)[0].getAttribute("field");
	    	var width = $(this)[0].offsetWidth;
	    	comp.find('.datagrid-view2 td[field ="' + classname + '"] div').css({
	    		"width": width + "px"
	    	})
	    });
	    */
	}

	this.applyAdditionalStyles();
};
/** @description styling cell border **/
DynamicDataGrid.prototype.setCellBorder = function (className,borderWidth) {
	var temp = this;
	$("#" + temp.m_componentid).find(".datagrid-view").find(className).find(".datagrid-body").find(".datagrid-btable").find(".datagrid-row").each(function() {
		$(this).find("td").each(function(){
			$(this).css({
				"border-top": hex2rgb(temp.getDatagridStyles().getHorizontalGridLineColor(), temp.m_rowlinesopacity),
				"border-right": hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity),
				"border-bottom": hex2rgb(temp.getDatagridStyles().getHorizontalGridLineColor(), temp.m_rowlinesopacity),
				"border-left": hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity),
				"border-width": borderWidth,
				"border-style": "solid"
			});
		});
	});
};
/** @description setting rows alternative and header color**/
DynamicDataGrid.prototype.setGridColors = function () {
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

	temp.fillColorInRow(".datagrid-view1",hex2rgb(gridColors[1], temp.m_rowopacity),hex2rgb(gridColors[2], temp.m_rowopacity));
	temp.fillColorInRow(".datagrid-view2",hex2rgb(gridColors[1], temp.m_rowopacity),hex2rgb(gridColors[2], temp.m_rowopacity));
	comp.find(".datagrid-row-selected").css("background", hex2rgb(convertColorToHex(temp.getDatagridStyles().getSelectionColor()), temp.m_rowselectedopacity));

	comp.find(".datagrid-row").hover(
		function () {
			var id = $(this).attr("node-id");
			temp.breakFromEach(".datagrid-view1",id);
			temp.breakFromEach(".datagrid-view2",id);
		},
		function () {
		temp.fillColorInRow(".datagrid-view1",hex2rgb(gridColors[1], temp.m_rowopacity),hex2rgb(gridColors[2], temp.m_rowopacity));
		temp.fillColorInRow(".datagrid-view2",hex2rgb(gridColors[1], temp.m_rowopacity),hex2rgb(gridColors[2], temp.m_rowopacity));
		//comp.find(".datagrid-row").css("background", gridColors[1]);
		//comp.find(".datagrid-row-alt").css("background", gridColors[2]);
		comp.find(".datagrid-row-selected").css("background", hex2rgb(convertColorToHex(temp.getDatagridStyles().getSelectionColor()), temp.m_rowselectedopacity));
		comp.find(".datagrid-cell").css("color", convertColorToHex(temp.m_labelfontcolor));
	});
	comp.find(".datagrid-row-selected").css("background", hex2rgb(convertColorToHex(temp.getDatagridStyles().getSelectionColor()), temp.m_rowselectedopacity));
	comp.find(".datagrid-cell").css("color", convertColorToHex(temp.m_labelfontcolor));
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
};

/** @description Breaking from For Each loop**/
DynamicDataGrid.prototype.breakFromEach = function (classname,id) {
	var temp = this;
	$("#" + temp.m_componentid).find(".datagrid-view").find(classname).find(".datagrid-body").find(".datagrid-btable").find(".datagrid-row").each(function() {
		if($(this).attr("node-id") == id){
			$(this).find(".datagrid-cell").css("color", hex2rgb(temp.getDatagridStyles().getTextHoverColor(), temp.m_rowhoveropacity));
			$(this).css("background", hex2rgb(temp.getDatagridStyles().getRollOverColor(),temp.m_rowhoveropacity));
			return false;
		}
	});
};

/** @description Setting Alternate color to the rows**/
DynamicDataGrid.prototype.fillColorInRow = function (classname,color1,color2) {
	var temp = this;
	var count = 0;
	$("#" + temp.m_componentid).find(".datagrid-view").find(classname).find(".datagrid-body").find(".datagrid-btable").find(".datagrid-row").each(function() {
		(count%2 == 0)?$(this).css("background-color", color1):$(this).css("background-color",color2);
		count++;
		
	});
};

/** @description setting selected Row CSS**/
DynamicDataGrid.prototype.setSelectedRowCSS = function () {
	var temp = this;
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
	$("#" + temp.m_componentid).find(".datagrid-row").css({
    	"background": convertColorToHex(gridColors[1]),
    	"height": temp.getRowHeight(temp.m_rowheight)+"px"
    });
	$("#" + temp.m_componentid).find(".datagrid-row-alt").css("background", convertColorToHex(gridColors[2]));
	$("#" + temp.m_componentid).find(".datagrid-row-selected").css("background", convertColorToHex(temp.getDatagridStyles().m_selectionColor));
};

/** @description Getting Tool Tip Data**/
DynamicDataGrid.prototype.getToolTipData = function (mouseX, mouseY) {
	var data = [];
	data[0] = "";
	return data;
};

/** @description Getter of all Field Display Name **/
DynamicDataGrid.prototype.getAllFieldsDisplayName = function () {
	return this.m_gridheaderDisplayNames;
};

/** @description Getter of all Field Name **/
DynamicDataGrid.prototype.getAllFieldsName = function () {
	return this.m_colHeadersFieldName;
};

/** @description Getting Data of each column by name **/
DynamicDataGrid.prototype.getDataBycolumn = function (colName) {
	return this.m_columnHeaderDataMap[colName];
};

/** @description Get Series Data **/
DynamicDataGrid.prototype.getData = function () {
	return this.m_seriesData;
};

/** @description Checking Is Series Empty **/
DynamicDataGrid.prototype.IsEmptyFields = function () {
	if (this.getRowFieldDetail().row.length == 0 || this.getColumnField().length == 0 || this.getValueFieldName()["visibleField"].length == 0)
		return true;
	else
		return false;
};

/** @description Removing Special Character **/
DynamicDataGrid.prototype.getStringARSC = function (str) {
	return (str) ? (str.toString()).replace(/[^a-z0-9\s]/gi, "").replace(/[_\s]/g, "") : str;
};

/** @description draw Message when No Data Available **/
DynamicDataGrid.prototype.drawMessage = function (text) {
	this.ctx.beginPath();
	this.ctx.fillStyle = this.m_statuscolor;
	this.ctx.font = this.m_statusfontsize+"px "+selectGlobalFont(this.m_statusfontfamily);
	this.ctx.textAlign = "left";
	var textWidth = this.ctx.measureText(text).width;
	var margin = this.m_width - textWidth;
	this.ctx.fillText(text, this.m_x * 1 + margin / 2, this.m_y * 1 + this.m_height / 2);
	this.ctx.fill();
	this.ctx.closePath();
};

/** @description Get Drill Data Points **/
DynamicDataGrid.prototype.getDrillDataPoints = function(mouseX, mouseY) {
	var map = this.getFieldNameValueMap();
	if(map){
		return { "drillRecord":map, "drillColor":"#cccccc" };
	}else{
		/** Return nothing **/
	}
};
//# sourceURL=DynamicDataGrid.js
