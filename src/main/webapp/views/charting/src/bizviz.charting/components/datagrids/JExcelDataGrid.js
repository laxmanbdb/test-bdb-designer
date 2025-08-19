/**
 * Copyright © 2015-2017. Big Data BizViz LLC. All Rights Reserved
 * @File: JExcelDataGrid.js
 * @description Datagrid
 **/
function JExcelDataGrid(m_chartContainer, m_zIndex) {
    this.base = DataGrid;
    this.base();
    this.m_x = 10;
    this.m_y = 600;
    this.m_width = 500;
    this.m_height = 285;
    this.m_columnHeaderDataMap = new Object();
    this.m_objectID = [];
    this.m_componentid = "";
    this.ctx = "";
    this.m_chartContainer = m_chartContainer;
    this.m_zIndex = m_zIndex;
    this.m_maxrow = 10;
    this.m_aggregatedRow = [];
    this.m_iseditable = true;
    this.m_enablecellupdatesave = false;
    this.m_allowinsertrow = false;
    this.m_enablelazyloading = false;
    this.m_freezecolumn=false;
    this.m_pagination=false;
};
/** @description Making prototype of DataGrid class and inheriting Method and property into JExcelDataGrid**/
JExcelDataGrid.prototype = new DataGrid();

/** @description This method will parse the DataGrid JSON and create a container **/
JExcelDataGrid.prototype.setProperty = function(gridJson) {
    this.ParseJsonAttributes(gridJson.Object, this);
    this.initCanvas();
};

/** @description Iterate through Grid JSON and set class variable values with JSON values **/
JExcelDataGrid.prototype.ParseJsonAttributes = function(jsonObject, nodeObject) {
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

/** @description getter method of DataProvider**/
JExcelDataGrid.prototype.getDataProvider = function() {
    return this.m_dataProvider;
};
/** @description storing field JSON into class Variable **/
JExcelDataGrid.prototype.setFields = function(fieldsJson) {
    this.m_fieldsJson = fieldsJson;
    this.setSeries(fieldsJson);
};

/** @description creating array for each property of fields and storing in arrays **/
JExcelDataGrid.prototype.setSeries = function(fieldsData) {
    this.fieldsData = fieldsData;
    this.m_seriesVisibleArr = {};
    this.m_fieldName = [];
    this.m_colHeadersFieldName = [];
    this.m_gridheaderDisplayNames = [];
    this.m_visibleArr = [];
    this.m_widthArr = [];
    this.m_textAlignArr = [];
    this.m_frozenColumnsArr = [];
    this.m_sortingColumnsArr = [];
    this.m_numberFormatColumnsArr = [];
    this.m_cellTypeArr = [];
    this.m_tooltipColumnsArr = [];
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
    this.m_isNumericArrMap = {};
    this.m_isNumericArrMapForSorting = {};
    this.legendMap = {};
    this.m_TooltipFieldsArr = {};
    this.m_rowaggrgationArr = {};
    this.m_freezeColumnsArr = [];
    //this.m_jexcelcelloptionArr = {};
    var j = 0;
    for (var i = 0, length = fieldsData.length; i < length; i++) {
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
            this.m_frozenColumnsArr[j] = this.getProperAttributeNameValue(fieldsData[i], "frozencolumn");
            this.m_freezeColumnsArr[j] = this.getProperAttributeNameValue(fieldsData[i], "freezecolumn");
            this.m_tooltipColumnsArr[j] = this.getProperAttributeNameValue(fieldsData[i], "showTooltip");
            
            /**To support dashbord when we are publishing it directly without opening in design mode**/
            var cellType = this.getProperAttributeNameValue(fieldsData[i], "cellType");
            var sorting = this.getProperAttributeNameValue(fieldsData[i], "sorting");
            var numberFormatter = this.getProperAttributeNameValue(fieldsData[i], "numberFormatter");
            if(cellType == undefined){
            	cellType = IsBoolean(fieldsData[i].isNumeric)?"Numeric":"none";
            }
            this.m_cellTypeArr[j] = cellType;
            this.m_isNumericArr[j] = cellType;
            this.m_isNumericArrMap[fieldname] = cellType;;
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
            //this.m_jexcelcelloptionArr[j] = this.getProperAttributeNameValue(fieldsData[i], "jexcelcelloption");
            var tempMap = {
                "seriesName": this.m_colHeadersFieldName[j],
                "displayName": this.m_gridheaderDisplayNames[j],
                "color": this.m_fieldColors[j],
                "shape": this.m_plotShapeArray[j],
                "width": this.m_widthArr[j],
                "textAlign": this.m_textAlignArr[j],
                "frozenColumn": this.m_frozenColumnsArr[j],
                "freezeColumn": this.m_freezeColumnsArr[j],
                "sorting" : this.m_sortingColumnsArr[j],
                "cellType": this.m_cellTypeArr[j],
                "numberFormatter": this.m_numberFormatColumnsArr[j],
                "toolTipColumn": this.m_tooltipColumnsArr[j],
                "numeric": this.m_isNumericArr[j],
                "fixedLabel": this.m_isFixedLabelArr[j],
                "formatter": this.m_formatterArr[j],
                "unitName": this.m_unitNameArr[j],
                "signPosition": this.m_signPositioneArr[j],
                "precision": this.m_precisionArr[this.m_colHeadersFieldName[j]],
                "secondFormatter": this.m_secondFormatterArr[j],
                "secondUnitName": this.m_secondUnitNameArr[j],
                //"jexcelCellOption": this.m_jexcelcelloptionArr[j],
                "index": j
            };
            this.legendMap[this.m_colHeadersFieldName[j]] = tempMap;
            j++;
        }
    }
    this.setLegendsIntialLoad(this.m_defaultlegendfields);
};

/** @description Getter Method of LegendInfo . **/
JExcelDataGrid.prototype.getLegendInfo = function() {
    return this.legendMap;
};

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
JExcelDataGrid.prototype.initCanvas = function() {
    var temp = this;
    $("#draggableDiv" + temp.m_objectid).remove();
    this.initializeDraggableDivAndCanvas();
};

/** @description  initialization of draggable div and its inner Content **/
JExcelDataGrid.prototype.initializeDraggableDivAndCanvas = function() {
    this.setDashboardNameAndObjectId();
    this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
    this.createDraggableCanvas(this.m_draggableDiv);
    this.setCanvasContext();
    this.initMouseMoveEvent(this.m_chartContainer);
    this.initMouseClickEvent();
};

/** @description  Will create an id for component to be used for dashboard operation management**/
JExcelDataGrid.prototype.setDashboardNameAndObjectId = function() {
    this.m_objectId = this.m_objectid;
    if (this.m_objectid.split(".").length == 2)
        this.m_objectid = this.m_objectid.split(".")[1];

    this.m_componentid = "dataGridDiv" + this.m_objectid;
};

/** @description creation of Div and Table ,Table is appended into div and setting CSS property **/
JExcelDataGrid.prototype.createDatagrid = function() {
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
    var border = (IsBoolean(this.m_showborder)) ? (this.m_borderthickness) : 0;
    var subtitleFontMargin = (IsBoolean(this.m_subTitle.m_showsubtitle) && this.m_subTitle.getDescription() != "") ? 4 : 0 ; /**Added 4 to resolve subtitle font size less then 17 underline does not visible because header overlap the underline.*/
	$("#" + temp.m_componentid).css({
    	"top": 1 * (this.m_y) + 1 * (this.m_titleHeight) + 1 * (this.m_subTitleHeight) + 1 * (subtitleFontMargin) + "px",
    	"left": 1 * (this.m_x) + 1 * border + "px",
    	"position": "absolute"
    });

    $("#datagridTable" + temp.m_objectid).css({
    	"width": this.m_width - border * 2 + "px",
    	"height": 1 * (this.m_height) - 1 * (this.m_titleHeight) - 1 * this.m_subTitleHeight - 1 * (this.m_DGFilterHeight) - 2 * border - subtitleFontMargin + "px"
    });
    this.m_gridFilterCondition = "";
    $("#excelDiv" + temp.m_objectid).remove();
    $("#excelActionDiv" + temp.m_objectid).remove();
};

/** description initialization of JExcelDataGrid **/
JExcelDataGrid.prototype.init = function() {
    this.m_chartFrame.init(this);
    this.m_title.init(this);
    this.m_subTitle.init(this);
    this.m_seriesData = this.getDataFromJSON();
    this.setVisibleFieldData();
    //this.m_seriesData=updateSeriesData(this.m_seriesData);//called for handle  comma separated numeric string data like-"1,234.00"
    this.isSeriesDataEmpty();
    this.isEmptyField();
    this.isVisibleField();
    if (!IsBoolean(this.m_isEmptyField)) {
        this.createDatagrid();
    } else {
        var temp = this;
        $("#" + temp.m_componentid).remove();
        $("#excelDiv" + temp.m_objectid).remove();
    }
};
/** method updates visibility of columns when used with legend-with checkbox **/
JExcelDataGrid.prototype.setVisibleFieldData = function() {
    this.m_gridheaderDisplayNames = [];
    this.m_colHeadersFieldName = [];
    this.m_widthArr = [];
    this.m_textAlignArr = [];
    this.m_isNumericArr = [];
    this.m_frozenColumnsArr = [];
    this.m_sortingColumnsArr = [];
    this.m_tooltipColumnsArr = [];
    this.m_numberFormatColumnsArr = [];
    this.m_isFixedLabelArr = [];
    this.m_formatterArr = [];
    this.m_unitNameArr = [];
    this.m_signPositioneArr = [];
    this.m_precisionArr = {};
    this.m_secondFormatterArr = [];
    this.m_secondUnitNameArr = [];
    this.m_fieldColors = [];
    for (var i = 0, length = this.m_fieldName.length; i < length; i++) {
        if (IsBoolean(this.m_seriesVisibleArr[this.m_fieldName[i]])) {
            this.m_colHeadersFieldName.push(this.legendMap[this.m_fieldName[i]].seriesName);
            this.m_gridheaderDisplayNames.push(this.legendMap[this.m_fieldName[i]].displayName);
            this.m_fieldColors.push(this.legendMap[this.m_fieldName[i]].color);
            this.m_widthArr.push(this.legendMap[this.m_fieldName[i]].width);
            this.m_textAlignArr.push(this.legendMap[this.m_fieldName[i]].textAlign);
            this.m_frozenColumnsArr.push(this.legendMap[this.m_fieldName[i]].frozenColumn);
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
            this.m_secondUnitNameArr.push(this.legendMap[this.m_fieldName[i]].secondUnitName);
        }
    }
};

/** @description getter method for Field Display Name**/
JExcelDataGrid.prototype.getAllFieldsDisplayName = function() {
    return this.m_gridheaderDisplayNames;
};

/** @description getter method for Field Name**/
JExcelDataGrid.prototype.getAllFieldsName = function() {
    return this.m_colHeadersFieldName;
};

/** @description starting of frame,Title,SubTitle and DataGrid Drawing **/
JExcelDataGrid.prototype.drawChart = function() {
    this.drawChartFrame();
    this.drawTitle();
    this.drawSubTitle();
    this.drawLegends();
    var map = this.IsDrawingPossible();
    if (IsBoolean(map.permission)) {
    	this.setRowAltColors();
    	this.setColumnWidth();
        this.drawJExcelGrid();
    } else {
        this.drawMessage(map.message);
    }
};

/** @description drawing of chart frame **/
JExcelDataGrid.prototype.drawChartFrame = function() {
    this.m_chartFrame.drawFrame();
};

/** @description Starting of title drawing  **/
JExcelDataGrid.prototype.drawTitle = function() {
    this.m_title.draw();
};

/** @description starting of subTitle drawing **/
JExcelDataGrid.prototype.drawSubTitle = function() {
    this.m_subTitle.draw();
};

JExcelDataGrid.prototype.getDatasheetId = function() {
	return this.m_dashboard.m_DataProviders.m_dataUrlIdObjMap[this.m_datasource].m_selectedserviceid;
}
JExcelDataGrid.prototype.drawActionIcons = function(id, src, x, y, fontClass, fontSize, title) {
	var temp = this;
	$("#" + id + temp.m_objectid).remove();
	var span = document.createElement("span");
	span.setAttribute("id", id + "" + temp.m_objectid);
	span.setAttribute("class", id + " " + fontClass);
	span.style.position = "absolute";
	span.style.cursor = "pointer";
	span.style.fontSize = ((fontSize) ? fontSize : 16) + "px";
	/*span.style.color = convertColorToHex(this.getTitle().getFontColor());*/
	span.style.color = "#000000";//DAS-936 default black color is set to drawActionIcons
	var imageWidth = 20;
	var imageHeight = 20;
	span.style.top = y + "px";
	span.style.left = x + "px";
	span.style.zIndex = this.m_zIndex;
	span.style.width = imageWidth * this.minWHRatio() + "px";
	span.style.height = imageHeight * heightRatio + "px";
	$("#excelActionDiv" + temp.m_objectid).append(span);
	
	if (!IsBoolean(isTouchEnabled)) {
		$("#" + id + "" + temp.m_objectid).hover(function() {
			if (!temp.m_designMode) {
				var tooltipDiv = document.createElement("div");
				tooltipDiv.innerHTML = title;
				tooltipDiv.setAttribute("id", id+"TooltipDiv");
				/**getting right margin value (fetching from component in case of DTC)**/
				$(tooltipDiv).css({
					"font-family": selectGlobalFont(temp.getTitle().m_fontfamily),
					"font-size": "12px",
					"top": (y - 5) + "px",
					"left": (x + 30) + "px",
					"z-index": 10000,
					"border": "1px solid #e0dfdf",
					"padding": "5px",
					"position": "absolute",
					"background-color": "#ffffff"
				});
				$("#excelActionDiv" + temp.m_objectid).append(tooltipDiv);
			}
		}, function() {
			$("#"+id+"TooltipDiv").remove();
		});
	}	
	return span;
};
JExcelDataGrid.prototype.drawPaginationIcons = function(id, src, x, y, fontClass, fontSize, title) {
	var temp = this;
	$("#" + id + temp.m_objectid).remove();
	var span = document.createElement("span");
	span.setAttribute("id", id + "" + temp.m_objectid);
	span.setAttribute("class", id + " " + fontClass);
	span.style.cursor = "pointer";
	span.style.fontSize = ((fontSize) ? fontSize : 16) + "px";
	/*span.style.color = convertColorToHex(this.getTitle().getFontColor());*/
	span.style.color = "#000000";//DAS-936 default black color is set to PaginationIcons
	span.style.position = "relative";
	var imageWidth = 20;
	var imageHeight = 20;
	span.style.margin = "10px";
	span.style.zIndex = this.m_zIndex;
	span.style.width = imageWidth * this.minWHRatio() + "px";
	span.style.height = imageHeight * heightRatio + "px";
	$("#paginationdiv" + temp.m_objectid).append(span);
	
	if (!IsBoolean(isTouchEnabled)) {
		$("#" + id + "" + temp.m_objectid).hover(function() {
			if (!temp.m_designMode) {
				var tooltipDiv = document.createElement("div");
				tooltipDiv.innerHTML = title;
				tooltipDiv.setAttribute("id", id+"TooltipDiv");
				/**getting right margin value (fetching from component in case of DTC)**/
				$(tooltipDiv).css({
					"font-family": selectGlobalFont(temp.getTitle().m_fontfamily),
					"font-size": "12px",
					"top": $(this)[0].offsetTop - 5 + "px",
					"left": $(this)[0].offsetLeft + 30 + "px",
					"z-index": 10000,
					"border": "1px solid #e0dfdf",
					"padding": "5px",
					"position": "absolute",
					"background-color": "#ffffff"
				});
				$("#paginationdiv" + temp.m_objectid).append(tooltipDiv);
			}
		}, function() {
			$("#"+id+"TooltipDiv").remove();
		});
	}	
	return span;
};

JExcelDataGrid.prototype.getDatasheetColumnsDef = function() {
	return this.m_dashboard.m_DataProviders.m_dataUrlIdObjMap[this.m_datasource].m_datasheetjsondef.columns;
};
JExcelDataGrid.prototype.isDatasheetDataProvider = function() {
	return (!this.m_designMode && this.m_dashboard.m_DataProviders.m_dataUrlIdObjMap[this.m_datasource].m_type == "datasheet");
};

JExcelDataGrid.prototype.createjExcelContainer = function() {
    var temp = this;
    $("#excelDiv" + temp.m_objectid).remove();
    var excelDiv = document.createElement('div');
    excelDiv.setAttribute("id", 'excelDiv' + temp.m_objectid);
    $("#draggableDiv" + temp.m_objectid).append(excelDiv);

    var actionDiv = document.createElement('div');
    actionDiv.setAttribute("id", 'excelActionDiv' + temp.m_objectid);
    $("#draggableDiv" + temp.m_objectid).append(actionDiv);
    var actionDivMargin = IsBoolean(this.m_iseditable) ? 30 : 0;
    var subtitleFontMargin = (IsBoolean(this.m_subTitle.m_showsubtitle) && this.m_subTitle.getDescription() != "") ? 4 : 0; /**Added 4 to resolve subtitle font size less then 17 underline does not visible because header overlap the underline.*/
    var topMargin = 1 * (this.m_y) + 1 * (this.m_titleHeight) + 1 * (this.m_subTitleHeight) + 1 * (subtitleFontMargin);
    $("#excelActionDiv" + temp.m_objectid).css({
        "width": this.m_width + "px",
        "height": actionDivMargin + "px",
        "top": topMargin + "px",
        "overflow": "hidden",
        "position": "absolute",
        "background": "#ffffff99",//DAS-936 paginationIcons taking title color
        "align-items":"center"
    });
    var save = this.drawActionIcons("saveDatasheetRecords", "", 10, 5, "bd-save", 14, "Save Changes");
    if (!temp.m_designMode) {
        save.onclick = function() {
            var id = '#excelDiv' + temp.m_objectid;
            var instance = id;
            var data = [];
            for (var key in temp.changedRows) {
                data.push(temp.changedRows[key]);
            }
            if (data.length > 0) {
                temp.updateDataSheetData(instance, data, "2", function() {
                    temp.changedRows = {};
                    temp.updateTableStyle(instance);
                    sdk.reload([temp.m_datasource]);
                });
            }
            document.getElementById("saveDatasheetRecords" + temp.m_objectid).style.color = "#000000";
            alertPopUpModal({
                type: "success",
                message: "Table has been saved",
                timeout: '3000'
            });
        };
    }

    if (!temp.m_designMode && temp.m_allowinsertrow) {
        var add = this.drawActionIcons("addDatasheetRecords", "", 40, 5, "bd-plus-circle", 14, "Add Row");
        add.onclick = function() {
            /*if(temp.selectedRows.length>0){
            	temp.insertSelectedRow();
            } else {
            	alert("Select a row.")
            }*/
            temp.insertSelectedRow();
            if (IsBoolean(temp.m_pagination)) {
                var pageNumber = Math.floor(temp.m_seriesData.length / temp.m_maxrow);
                document.getElementById('excelDiv' + temp.m_objectid).jexcel.page(pageNumber);
            }
            document.getElementById("saveDatasheetRecords" + temp.m_objectid).style.color = "red";
            /*alertPopUpModal({ type: "success", message: "Table has been saved", timeout: '3000' });*/
        };
    }

    var deleteIcon = this.drawActionIcons("deleteDatasheetRecords", "", (IsBoolean(temp.m_allowinsertrow) ? 70 : 40), 5, "bd-cross", 14, "Delete Selected Row");
    if (!temp.m_designMode) {
        deleteIcon.onclick = function() {
            /*temp.deleteSelectedRows(function(){
	   			sdk.reload([temp.m_datasource]);
	   	    });*/
            if (temp.selectedRows.length > 0) {
                temp.createPopupForRowDeletion(temp);
                $("#getyes").click(function() {
                    temp.deleteSelectedRows(function() {});
                    $('#dialogdiv').dialog("destroy");
                });
                $("#getno").click(function() {
                    $('#dialogdiv').dialog("destroy");
                });
            } else {
                alert("Select a row");
            }
        };
    }

    var gridtopMargin = topMargin + actionDivMargin * 1;
    var gridBorderMargin = 2;
    var additionalPadding = 30;
    $("#excelDiv" + temp.m_objectid).css({
        "margin-top": gridtopMargin + "px",
        "width": this.m_width - gridBorderMargin + "px",
        "height": this.m_height - gridtopMargin - gridBorderMargin + "px",
        "overflow": "hidden",
        "position": "absolute"
    });
    $('#draggableCanvas' + temp.m_objectid).css("position", "absolute");
    return {
        W: this.m_width - gridBorderMargin,
        H: this.m_height - gridtopMargin - gridBorderMargin - (additionalPadding * ((IsBoolean(this.m_pagination)) ? 2 : 1))
    };
};
JExcelDataGrid.prototype.createTextDiv = function() {
    var temp = this;
    var PageNumber = Math.floor(temp.m_seriesData.length / temp.m_maxrow);
    PageNumber = (PageNumber == 0) ? PageNumber + 1 : PageNumber;
    var div = document.createElement("span");
    var text1 = document.createElement("span").innerHTML = "Page ";
    var input = document.createElement("input");
    input.setAttribute("id", "paginationinput" + temp.m_objectid);
    //input.setAttribute("type", "number");
    input.setAttribute("value", (temp.m_pagenumber * 1) + 1);
    $(input).css({
        "height": "20px",
        "width": "20px",
        "background": "transparent",
        "-webkit-appearance": "none"
    })
    var text3 = document.createElement("span").innerHTML = " Of ";
    var text4 = document.createElement("span").innerHTML = PageNumber;
    $(div).append(text1, input, text3, text4);
    input.onchange = function() {
        var PageNumber = Math.floor(temp.m_seriesData.length / temp.m_maxrow);
        if (input.value > PageNumber) {
            input.value = PageNumber;
        } else if (input.value < 1 || isNaN(input.value)) {
            input.value = 1;
        }
        temp.m_pagenumber = (input.value * 1) - 1;
        var id = '#excelDiv' + temp.m_objectid;
        var instance = $(id)[0].jexcel;
        instance.getConfig().pagination = temp.m_maxrow;
        instance.page(temp.m_pagenumber);
        temp.updatepageiconStyle();
    }
    $(div).css({
        "position": "relative",
        "margin": "10px",
        "font-family": selectGlobalFont(temp.m_labelfontfamily)
    });
    $("#paginationdiv" + temp.m_objectid).append(div);
};
JExcelDataGrid.prototype.updatepageiconStyle = function() {
    var temp = this;
    var lastpage = Math.floor(temp.m_seriesData.length / temp.m_maxrow) - 1;
    lastpage = lastpage < 0 ? 0 : lastpage;
    var css = {
        "opacity": "0.3",
        "pointer-events": "none",
        "cursor": "default"
    }
    var reset = {
        "opacity": "1",
        "pointer-events": "auto",
        "cursor": "pointer"
    }
    $("#previouspage" + temp.m_objectid).css(reset);
    $("#Gotofirst" + temp.m_objectid).css(reset);
    $("#nextpage" + temp.m_objectid).css(reset);
    $("#Gotolast" + temp.m_objectid).css(reset);
    if (temp.m_pagenumber == 0) {
        $("#previouspage" + temp.m_objectid).css(css);
        $("#Gotofirst" + temp.m_objectid).css(css);
    }
    if (temp.m_pagenumber == lastpage) {
        $("#nextpage" + temp.m_objectid).css(css);
        $("#Gotolast" + temp.m_objectid).css(css);
    }
};
JExcelDataGrid.prototype.mainDiv = function() {
	var dialogdiv = document.createElement('div');
	dialogdiv.id = "dialogdiv";
	var width = (!IsBoolean(this.m_designMode) && this.m_dashboard.m_AbsoluteLayout.m_layouttype == "MobileLayout") ? "90%" : "600px";
	$(dialogdiv).css({
		"width": width,	
		"height": "auto",	
		"padding": "0px",	
		"border-radius": "8px",
		"background": "#FFFFFF",	
		//"box-shadow": "#00000029 0px 6px 16px"
	});
	return dialogdiv;
};
JExcelDataGrid.prototype.createPopupForRowDeletion = function(temp){
	var topDiv = document.createElement("div");
	$(topDiv).css('height', '10%');
	var heading = document.createElement("div");
	$(heading).css({
	    "margin": "0px 5px 5px 25px",
	    "text-align": "left",
	    "font-weight": "600",
	    "color": "#434344"
	});
	var title = document.createTextNode("Are you sure you want to delete the Row ?");
	$(title).css({
		"font-style": this.m_fontstyle,
		"font-weight": this.m_fontweight,
		"font-size": this.fontScaling(this.m_fontsize) + "px",
		"font-family": selectGlobalFont(this.m_fontfamily)
	});
	heading.appendChild(title);
	topDiv.appendChild(heading);
	var pop = this.mainDiv();
	pop.appendChild(topDiv);
	var boxThirdInnerDiv = this.createBtnDiv();
	$(boxThirdInnerDiv).css("margin-left", "10%");
	pop.appendChild(boxThirdInnerDiv);
	$(pop).dialog({
		title: 'Delete Row Window',
		closed: false,
		cache: false,
		modal: true,
		draggable: false,
		position: {
            my: "center",
            at: "center",
            of: window
        },
		onClose: function() {
			$('#dialogdiv').dialog("destroy");
		},
	});
	$(".window").css({	
		"background" : "#FFFFFF",	
		"border-radius" : "8px 8px 8px 8px"
	});	
	$(".window-header").css({	
		"padding":"20px"	
	});
	$(".panel-title").css({	
		"background": "transparent",	
		"text-align": "left",	
		"color": "#434344",	
		"padding": "5px",	
		"font-weight": "bolder",	
		"font-size":this.fontScaling(25) + "px",	
		"font-style": this.m_fontstyle,	
		"font-family": selectGlobalFont(this.m_fontfamily)
	});
	$(".panel-tool").css({
		"height": "21px",
		"width": "26px",
		"margin": "-14px 3px 0px 0px"
	});
	$(".panel-tool a").css("display", "none");
	$("dialogdiv .panel-header, .panel-body").css({
		"font-style": this.m_fontstyle,
		"font-weight": this.m_fontweight,
		"font-size": this.fontScaling(this.m_fontsize) + "px",
		"font-family": selectGlobalFont(this.m_fontfamily),
		"border-style": "none"
	});
};
JExcelDataGrid.prototype.createBtnDiv = function() {
	var btnDiv = document.createElement("div");
	$(btnDiv).css({
		"background" : "#ffffff",
		"float" : "right",
		"height" : "20%",
		"margin-right" : "10%"
	});
	this.yesbutton = this.createYesButton("getyes", "Yes");
	this.nobutton = this.createNoButton("getno", "No");
	btnDiv.appendChild(this.yesbutton);
	btnDiv.appendChild(this.nobutton);
	return btnDiv;

};
JExcelDataGrid.prototype.createYesButton = function(id, value) {
	var Button = document.createElement('input');
	Button.type = "submit";
	Button.setAttribute('id', id);
	Button.value = value;
	$(Button).css({
		"font": "normal" + " " + "normal" + " " + 16 * this.minWHRatio() + "px " + selectGlobalFont(this.m_fontfamily),
		"padding": "7px",
		"box-shadow": "0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)",
		"cursor": this.m_cursortype,	
		"border": "hidden",	
		"width": "106px",	
		"display": "inline-block",	
		"text-align": "center",	
//		"background": "#2ecc71",	
		"background": "#0D78BF",	
		"color": "#fff",	
		"margin-left": "2px",
		"margin-right": "6px",	
		"margin-top": "35px",	
		"margin-bottom": "20px",	
		"border-radius": "4px 4px 4px 4px"
	});
	return Button;
};

JExcelDataGrid.prototype.createNoButton = function(id, value) {
	var Button = document.createElement('input');
	Button.type = "submit";
	Button.setAttribute('id', id);
	Button.value = value;
	$(Button).css({
		"font": "normal" + " " + "normal" + " " + 16 * this.minWHRatio() + "px " + selectGlobalFont(this.m_fontfamily),
		"padding": "7px",
		"box-shadow": "0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)",
		"cursor": this.m_cursortype,
		"border": "hidden",
		"width": "106px",
		"display": "inline-block",
		"text-align": "center",
		"background": "#ffffff",
		"color": "#000000",
		"margin-left": "2px",
		"margin-top": "35px",
		"margin-bottom": "20px",
		"border-radius": "4px 4px 4px 4px"
	});
	return Button;
};

JExcelDataGrid.prototype.drawJExcelGrid = function() {
	var temp = this;
	$("#paginationContainerDiv" + temp.m_objectid).remove();
	
	/** TODO If dataprovider is datasheet then only it should be editable **/
	if( !temp.isDatasheetDataProvider() ){
		this.m_iseditable = false;	
	}
	
	var dim = this.createjExcelContainer();
	var fieldsName = this.getAllFieldsName();
    var fieldDisplayName = this.getAllFieldsDisplayName();
    
    this.jexcelColumns = [];
    if (temp.m_designMode || !temp.isDatasheetDataProvider()) {
    	for (var i = 0; i < fieldsName.length; i++) {
        	var jexcelColumns = {};
        	jexcelColumns['type'] = "text";
        	jexcelColumns['title'] = fieldDisplayName[i];
        	jexcelColumns['width'] = temp.m_widthArr[i];
        	jexcelColumns['readOnly'] = temp.m_freezeColumnsArr[i];
        	this.jexcelColumns.push(jexcelColumns);
        }
    }else{
    	var allColumns = this.getDatasheetColumnsDef();
    	this.jexcelColumns = [{filter: false, lookUp: "", width: "255", formula: "", title: "BDB_DS_ID", type: "hidden"}];	    
    	for (var i = 0; i < fieldsName.length; i++) {
//			var jexcelColumns = {};
//        	jexcelColumns['readOnly'] = temp.m_freezeColumnsArr[i];
        	//this.jexcelColumns.push(jexcelColumns);
	    	for(var c=0; c<allColumns.length; c++){
				/**DAS-357 */
				if(allColumns[c].source != undefined && (allColumns[c].type == "dropdown" || allColumns[c].type == "autocomplete") ){
					allColumns[c].source=[];
				}
				/**DAS-840 setting fullscreen always true*/
				if(allColumns[c].type != undefined && allColumns[c].type == "calendar"){
					allColumns[c].options.fullscreen=true;
				}
	    		if(allColumns[c].title !== 'BDB_DS_ID' && allColumns[c].title == fieldsName[i]){
	    			allColumns[c].width = temp.m_widthArr[i];
	    			allColumns[c].readOnly = temp.m_freezeColumnsArr[i];
	    			this.jexcelColumns.push( allColumns[c] );
	    		}
	    	}
	    }
    }
    var excelData = [];
    for (var j = 0; j < this.m_seriesData.length; j++) {
    	excelData[j] = [];
    	for (var k = 0; k < this.jexcelColumns.length; k++) {
			/**DAS-994  check date format if in dd-mm-YYYY , then convert to YYYY-mm-dd*/
			if(this.jexcelColumns[k].type == "calendar"){
				var edata = this.m_seriesData[j][this.jexcelColumns[k].title];
				var formatted = this.changeDateFormat(edata);
				excelData[j].push(formatted);
			}else			
    		excelData[j].push(this.m_seriesData[j][this.jexcelColumns[k].title]);
    	}
    }
    
    this.changedRows = this.changedRows || {};
    this.selectedRows = [];
    var config = {
	    data: excelData,
	    columns: this.jexcelColumns,
	    tableOverflow: true,
	    tableWidth: dim.W + "px",
	    tableHeight: dim.H + "px",
	    fullscreen: false,
	    //pagination: IsBoolean(this.m_pagination),
        lazyLoading: IsBoolean(temp.m_enablelazyloading),
        loadingSpin: true,
        editable: IsBoolean(temp.m_iseditable),
        allowInsertRow: IsBoolean(temp.m_allowinsertrow),
        allowDeleteRow: true,
        allowManualInsertColumn: false,
        contextMenu: function() { 
        	return false; 
        },
	    onload: function(instance){
	    	temp.setDatasheet( $(instance)[0].jexcel );
	    	temp.getDatasheet(instance).hideIndex();
	    	temp.updateTableStyle(instance);
	    	if (IsBoolean(temp.m_pagination)) {	
	    		$(".jexcel_pagination").remove();
	    		temp.createPagination();
			}
	    },
        ondeleterow: function(instance){
			temp.updateTableStyle(instance);
	    },
	    onchangepage: function(instance){
            temp.updateTableStyle(instance);
        },
	    onselection: temp.RowSelectEvent.bind(temp),
	    onchange: temp.RowChangeEvent.bind(temp),
	    onpaste: temp.RowPasteEvent.bind(temp),
	    oninsertrow: temp.RowInsertEvent.bind(temp),
		onsort: temp.ColumnSortEvent.bind(temp)
	};
    config = this.setDatasheetConfig(config);
	jexcel(document.getElementById('excelDiv'+temp.m_objectid), config);
	/*
	if (IsBoolean(temp.m_pagination)) {	
	    $(".jexcel_pagination").remove();
	    temp.createPagination();
	}
	*/
};
/**DAS-994 */
JExcelDataGrid.prototype.changeDateFormat = function(date1) {
	var regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
    if(regex.test(date1))
    {
		var parts = date1.split('-');
		var newDateString = parts[2] + '-' + parts[1] + '-' + parts[0];
		return newDateString;
	}else
	return date1;
	
}
/** @description format grid cell value according to given formatter in the fields **/
JExcelDataGrid.prototype.getFormattedCellValue = function(value, colName, index) {
	if (!isNaN(getNumericComparableValue(value))) {
		// added check for value is number or not otherwise return same string value
        var isCommaSeparated = (("" + value).indexOf(",") > 0) ? true : false;
        var signPosition = (this.m_signPositioneArr[index] != "") ? this.m_signPositioneArr[index] : "suffix";
        var precision = this.m_precisionArr[colName];
        var formatter = this.m_formatterArr[index];
        var secondFormatter = this.m_secondFormatterArr[index];
        var unit = this.m_unitNameArr[index];
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
        } else{
            return (valueToBeFormatted == "NaN") ? value : valueToBeFormatted;
        }
    } else {
        return value;
    }
};
JExcelDataGrid.prototype.setDatasheetConfig = function(config) {
	/** to override the method in dashboard for customization **/
	config.minSpareRows = 0;
	config.allowManualInsertRow = 1;
	config.wordWrap = IsBoolean(this.m_textwrap);
	if(IsBoolean(this.m_pagination)){
		config.pagination = this.m_maxrow;
	}
	config.columnSorting = true;
	
	return config;
};
JExcelDataGrid.prototype.createPagination = function() {
    var temp = this;
    $("#paginationContainerDiv" + temp.m_objectid).remove();
    var paginationContainerDiv = document.createElement("div");
    paginationContainerDiv.setAttribute('id', 'paginationContainerDiv' + temp.m_objectid);
    $("#draggableDiv" + temp.m_objectid).append(paginationContainerDiv);
    $("#paginationContainerDiv" + temp.m_objectid).css({
        "width": temp.m_width + "px",
        "height": 30 + "px",
        "bottom": "0px",
        "overflow": "hidden",
        "position": "absolute",
        "background": "#ffffff99",//DAS-936 paginationIcons taking title color
        "display": "flex",
        "justify-content": "center",
        "margin": "10px 0px",
        "align-items":"center"
    });
    var paginationDiv = document.createElement("div");
    paginationDiv.setAttribute('id', 'paginationdiv' + temp.m_objectid);
    $("#paginationContainerDiv" + temp.m_objectid).append(paginationDiv);
    $("#paginationdiv" + temp.m_objectid).css({
        "display": "inline-block"
    });
    temp.m_pagenumber = 0;
    var Gotofirst = this.drawPaginationIcons("Gotofirst", "", 0, 0, "bd-backward", 14, "Go to first Page");
    var previouspage = this.drawPaginationIcons("previouspage", "", 0, 0, "bd-arrow-left", 14, "Previous Page");
    this.createTextDiv();
    var nextpage = this.drawPaginationIcons("nextpage", "", 0, 0, "bd-arrow-right", 14, "Next Page");
    var Gotolast = this.drawPaginationIcons("Gotolast", "", 0, 0, "bd-forward", 14, "Go to last Page");
    temp.updatepageiconStyle();
    var id = '#excelDiv' + temp.m_objectid;
    var instance = $(id)[0].jexcel;
    instance.getConfig().pagination = temp.m_maxrow;
    nextpage.onclick = function() {
        temp.m_pagenumber = (temp.m_pagenumber * 1) + 1;
        instance.page(temp.m_pagenumber);
        $("#paginationinput" + temp.m_objectid)[0].value = (temp.m_pagenumber * 1) + 1;
        temp.updatepageiconStyle();
    };
    previouspage.onclick = function() {
        temp.m_pagenumber = temp.m_pagenumber - 1;
        instance.page(temp.m_pagenumber);
        $("#paginationinput" + temp.m_objectid)[0].value = (temp.m_pagenumber * 1) + 1;
        temp.updatepageiconStyle();
    };
    Gotofirst.onclick = function() {
        temp.m_pagenumber = 0;
        instance.page(temp.m_pagenumber);
        $("#paginationinput" + temp.m_objectid)[0].value = (temp.m_pagenumber * 1) + 1;
        temp.updatepageiconStyle();
    };
    Gotolast.onclick = function() {
        temp.m_pagenumber = Math.floor(temp.m_seriesData.length / temp.m_maxrow) - 1;
        instance.page(temp.m_pagenumber);
        $("#paginationinput" + temp.m_objectid)[0].value = (temp.m_pagenumber * 1) + 1;
        temp.updatepageiconStyle();
    };
};
JExcelDataGrid.prototype.setDatasheet = function(ds) {
	this.m_datasheet = ds;
};
JExcelDataGrid.prototype.getDatasheet = function(instance) {
	return (this.m_datasheet) ? this.m_datasheet : $(instance)[0].jexcel; 
};

JExcelDataGrid.prototype.RowSelectEvent = function(instance, cell, x, y, value){
	var temp = this;
	temp.selectedRows = [];
	temp.selectedRows = temp.getDatasheet(instance).getSelectedRows();
	
    var changedRowData = temp.getDatasheet(instance).getRowData(x);
    var headers = temp.getDatasheet(instance).getHeaders().split(',');
	this.changedRows = this.changedRows || {};
    var selectedRow = {};
	for(var i=0 ; i<headers.length ; i++ ){
		if(changedRowData[i] == "0"){
			selectedRow[headers[i]] = 0;
		}
		else{
			selectedRow[headers[i]] = changedRowData[i];
		}
	}
	
    var fieldNameValueMap = selectedRow;
    fieldNameValueMap["drillDisplayField"] = headers[x];
    fieldNameValueMap["drillField"] = headers[x];
    fieldNameValueMap["drillValue"] = changedRowData[cell];
    var drillColor = "";
    temp.updateDataPoints(fieldNameValueMap, drillColor);
};
JExcelDataGrid.prototype.RowChangeEvent = function(instance, cell, x, y, value) {
	var temp = this;
    var changedRowData = temp.getDatasheet(instance).getRowData(y);
    
    var headers = temp.getDatasheet(instance).getHeaders().split(',');
	this.changedRows = this.changedRows || {};
    var selectedRow = {};
	for(var i=0 ; i<headers.length ; i++ ){
		if(changedRowData[i] == "0"){
			selectedRow[headers[i]] = 0;
		}
		else{
			selectedRow[headers[i]] = changedRowData[i];
		}
	}
	this.changedRows[y] = selectedRow;
	
	if(IsBoolean(temp.m_enablecellupdatesave)){
		var data = [];
		for (var key in temp.changedRows){
			data.push(temp.changedRows[key]);
	   	}
		if(data.length > 0){
			temp.updateDataSheetData(instance, data, "2", function(){
				temp.changedRows = {};
	   			sdk.reload([temp.m_datasource]);
	   	    });
		}
	}
	document.getElementById("saveDatasheetRecords"+temp.m_objectid).style.color = "red";
};
JExcelDataGrid.prototype.deleteSelectedRows = function() {
	var temp = this;
	var id = '#excelDiv'+temp.m_objectid;
	var instance = $(id)[0].jexcel;
	
    var type = "3";
    var data = [];
    var i = 0;
    for( ; i<this.selectedRows.length; i++) {
		if(IsBoolean(this.m_pagination)){
			var index = parseInt(this.selectedRows[i].dataset.y);
		} else {
			var index = this.selectedRows[i].rowIndex-1;
		}
    	var headers = instance.getHeaders().split(',');
        var changedRowData = instance.getRowData(index);
        if(changedRowData != "" && changedRowData != undefined){
        	var row = {};
    		var j = 0;
    		for( ; j<headers.length;j++){
    			if(changedRowData[j] == "0"){
    				row[headers[j]]= 0;
    			}
    			else{
    				row[headers[j]]=changedRowData[j];
    			}
    		}
    		data.push(row);
        }
    	instance.deleteRow(index,1);
    }
    alertPopUpModal({ type: "success", message: "Row has been deleted", timeout: '3000' });
    this.updateDataSheetData(instance, data, type, function() {
		sdk.reload([temp.m_datasource]);
	});
};

JExcelDataGrid.prototype.insertSelectedRow = function() {
	var temp = this;
	var id = '#excelDiv'+temp.m_objectid;
	var instance = $(id)[0].jexcel;
	var rows = instance.rows;
	
    var type = "3";
    var data = [];
    var i = 0;
    /*for( ; i<this.selectedRows.length; i++) {
    	var index = this.selectedRows[i].rowIndex+1;
    	var headers = instance.getHeaders().split(',');
        var changedRowData = instance.getRowData(index);
        if(changedRowData != "" && changedRowData != undefined){
        	var row = {};
    		var j = 0;
    		for( ; j<headers.length;j++){
    			if(changedRowData[j] == "0"){
    				row[headers[j]]= 0;
    			}
    			else{
    				row[headers[j]]=changedRowData[j];
    			}
    		}
    		data.push(row);
        }
    	instance.insertRow(data,index,false);
    }*/
    var noOfRows =rows.length;
    var index = noOfRows+1;
	var headers = instance.getHeaders().split(',');
    var changedRowData = instance.getRowData(index);
    if(changedRowData != "" && changedRowData != undefined){
    	var row = {};
		var j = 0;
		for( ; j<headers.length;j++){
			if(changedRowData[j] == "0"){
				row[headers[j]]= 0;
			}
			else{
				row[headers[j]]=changedRowData[j];
			}
		}
		data.push(row);
    }
	instance.insertRow(data,index,false);
	for(i=1; i<=temp.m_fieldName.length; i++){
		instance.records[noOfRows][i].className = "";
	}
    alertPopUpModal({ type: "success", message: "A row has been added", timeout: '3000' });
    this.updateDataSheetData(instance, data, type, function() {});
};

JExcelDataGrid.prototype.updateDataSheetData = function(instance, changedRowData, type, cb) {
	var temp = this;

    var formdata = {
		"bizvizdatasheetId": temp.getDatasheetId(),
		"type": ""+type,
		"data": JSON.stringify(changedRowData)
	};

    /** TODO as per bijeesh, this information should not be send in the mail **/
    //formdata.docData = JSON.stringify(temp.getDatasheet(instance).getConfig().columns);

    var reqData = {};
    reqData["isSecure"] = true;
    reqData["consumerName"] = "BDBDATASHEET";
    reqData["serviceName"] = "saveOrUpdateSheetRecords";
    reqData["data"] = JSON.stringify(formdata);
    reqData["spacekey"] = parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey;

    makeSecureRequest({
        url: base_url + req_url.designer.pluginService,
        method: "POST",
        formData: {
        	"isSecure": true,
            "consumerName": "BDBDATASHEET",
            "serviceName": "saveOrUpdateSheetRecords",
            "data": JSON.stringify(formdata),
            "spacekey": parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey,
        },
        params: {
            headers: {
                authtoken: parent.BIZVIZ.SDK.getAuthInfo().authToken,
                spacekey: encryptText(parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey),
                userid: encryptText(parent.BIZVIZ.SDK.getAuthInfo().user.id)
            }
        }
    },
    function(complete, sucess, component) {
    	cb && cb(complete);
    });
};
JExcelDataGrid.prototype.RowPasteEvent = function(instance, cell, x, y, value) {
	var temp = this;
};
JExcelDataGrid.prototype.RowInsertEvent = function(instance, y) {
	var temp = this;
	temp.updateTableStyle(instance);
	
	/** Below code is not required - bulk pasting of rows will not work if opened **/
	/*
	var changedRowData = temp.getDatasheet(instance).getRowData(temp.getDatasheet(instance).getJson().length-1);
	var headers = temp.getDatasheet(instance).getHeaders().split(',');
	if(changedRowData != "" && changedRowData != undefined){
		var row = {};
		var i = 0;
		for( ; i<headers.length;i++){
			if(changedRowData[i] == "0"){
				row[headers[i]]= 0;
			}
			else{
				row[headers[i]]=changedRowData[i];
			}
		}
		
		temp.updateDataSheetData(instance, [row], "1", function(datasheet){
			if(datasheet != "" && datasheet != null){
				var table = temp.getDatasheet(instance).getJson();
    			var lastIndex = table.length - 1;
    			var rowId =  parseInt(datasheet[0]);
    			if(rowId != undefined ){
    				table[lastIndex][0] = rowId;
    				temp.changedRows[y] = table[lastIndex];
    				temp.getDatasheet(instance).setData(table);
    			}	
    		}
   	    });
	}
	*/
};
JExcelDataGrid.prototype.ColumnSortEvent = function(instance) {
	var temp = this;
	temp.updateTableStyle(instance);
};
JExcelDataGrid.prototype.updateTableStyle = function(instance) {
    var temp = this;

    /** Alternate row colors **/
	var gridColors = temp.getRowAltColors();
	var rows = $(instance)[0].jexcel.rows;
	rows.map(function(row){
		var color = "";
		if (row.dataset.y % 2) {
			color = hex2rgb(convertColorToHex(gridColors[1]), temp.m_rowopacity);
		}else{
			color = hex2rgb(convertColorToHex(gridColors[2]), temp.m_rowopacity);
		}
		row.style.backgroundColor = color;
	});

    /** if fit-columns true hide the x-scroller **/
    if(IsBoolean(temp.m_fitcolumns)){
	    $("#excelDiv" + temp.m_objectid +" .jexcel_content").css({
	    	"overflow-x": "hidden"
	    });
    }
    
    /** set the parent font family to grid **/
    $("#excelDiv" + temp.m_objectid +" .jexcel").css({
    	"font-family": selectGlobalFont(temp.m_labelfontfamily)
    });
    
    /** Header styles **/
    $("#excelDiv" + temp.m_objectid +" .jexcel > thead > tr > td").css({
    	"color": convertColorToHex(temp.m_headerfontcolor),
        "font-weight": temp.m_headerfontweight,
        "font-size": temp.fontScaling(temp.m_headerfontsize) + "px",
        "font-family": selectGlobalFont(temp.m_headerfontfamily),
        "font-style": temp.m_headerfontstyle,
        "text-decoration": temp.m_headertextdecoration,
        "height": (temp.m_rowheight*1 + 5) + "px",
        "line-height": "1.5",
        "background": hex2rgb(convertColorToHex(temp.m_headerchromecolor), temp.m_headerrowopacity)
    });

    /** Row styles **/
    $("#excelDiv" + temp.m_objectid +" .jexcel > tbody > tr > td").css({
    	"font-weight": temp.m_labelfontweight,
	    "font-size": temp.fontScaling(temp.m_labelfontsize) + "px",
	    "font-family": selectGlobalFont(temp.m_labelfontfamily),
	    "font-style": temp.m_labelfontstyle,
	    "text-decoration": temp.m_labeltextdecoration,
	    "color": convertColorToHex(temp.m_labelfontcolor),
    	"height": temp.m_rowheight + "px",
        "line-height": "1.5"
    });
    
    /*pagination styles*/
    $(".jexcel_pagination").css({"bottom": "0px", "position": "absolute", "width": "100%"});
};
JExcelDataGrid.prototype.setColumnWidth = function() {
	var definedWidth = 0;
	var count = 0;
	this.m_fitRemainingColumns = false;
	var gridBorderMargin = 2;
	for (var i = 0, len = this.m_colHeadersFieldName.length; i < len; i++) {
	    if (this.m_widthArr[i] != undefined && this.m_widthArr[i] != "") {
	        definedWidth = definedWidth * 1 + (parseInt(this.m_widthArr[i]) * 1) + (gridBorderMargin * 1);
	        count++;
	    }
	}
	var remainingWidth = this.m_width - definedWidth - gridBorderMargin;
	var otherColumnWidth = remainingWidth / (((this.m_colHeadersFieldName.length - count) !== 0) ? (this.m_colHeadersFieldName.length - count) : 1);
	var widthArray = [];
	// this case for when there are no frozen columns and fitcolumns true/false.
	if (!_.contains(this.m_frozenColumnsArr, true)) {
	    if (IsBoolean(this.m_fitcolumns)) {
	        for (var i = 0, length = this.m_colHeadersFieldName.length; i < length; i++) {
	            if (this.m_widthArr[i] != undefined && this.m_widthArr[i] != "") {
	            	widthArray[i] = this.m_width * (this.m_widthArr[i]/definedWidth);
	            } else {
	                widthArray[i] = parseInt(otherColumnWidth);
	            }
	        }
	        this.m_fitRemainingColumns = true;
	    } else {
	    	var len = this.m_colHeadersFieldName.length;
	    	for (var i = 0; i < len; i++) {
	    	    if (this.m_widthArr[i] != undefined && this.m_widthArr[i] != "") {
	    	    	// Added below if block for BDD-798 Grids column width should be adjusted while Maximize the grid when fit column disabled.
	    	        if ((this.isMaximized) && remainingWidth > 0) {
	    	            widthArray[i] = this.m_width * (this.m_widthArr[i] / definedWidth);
	    	        } else {
	    	            widthArray[i] = parseInt(this.m_widthArr[i] * 1);
	    	        }
	    	    } else {
	    	        widthArray[i] = parseInt(otherColumnWidth);
	    	    }
	    	}
	    	this.m_fitRemainingColumns = ((this.isMaximized) && remainingWidth > 0) ? true : false;
	    }
	} else if (_.contains(this.m_frozenColumnsArr, true) && IsBoolean(this.m_fitcolumns)) {
	    // this case for atleast one column frozen and other columns take remaining width by number of columns.
	    var value = 0;
	    var leftOverWidth = this.m_width;
	    for (var j = 0, length = this.m_colHeadersFieldName.length; j < length; j++) {
	    	if (IsBoolean(this.m_frozenColumnsArr[j])) {
	    		widthArray[j] = parseInt(this.m_widthArr[j] * 1);
	    		leftOverWidth = leftOverWidth - widthArray[j];
	                value++;
	    	}
	    };
	    for (var i = 0, length1 = this.m_colHeadersFieldName.length; i < length1; i++) {
	        if (IsBoolean(this.m_frozenColumnsArr[i])) {
	            if (this.m_widthArr[i] != undefined && this.m_widthArr[i] != "") {
	                widthArray[i] = parseInt(this.m_widthArr[i] * 1);	             
	            } else {
	                widthArray[i] = parseInt(otherColumnWidth);
	            }
	        } else {
	            widthArray[i] = leftOverWidth / (this.m_colHeadersFieldName.length - value);
	        }
	    }
	    this.m_fitRemainingColumns = true;
	} else {
		// this case for atleast one column frozen and other columns take specified width with scroll bar.
	    for (var i = 0, length = this.m_colHeadersFieldName.length; i < length; i++) {
	    	if (this.m_widthArr[i] != undefined && this.m_widthArr[i] != "") {
	    		// Added below if block for BDD-798 Grids column width should be adjusted while Maximize the grid when fit column disabled.
	    	    if ((this.isMaximized) && remainingWidth > 0) {
	    	        widthArray[i] = this.m_width * (this.m_widthArr[i] / definedWidth);
	    	    } else {
	    	        widthArray[i] = parseInt(this.m_widthArr[i] * 1);
	    	    }
	    	} else {
	    	    widthArray[i] = parseInt(otherColumnWidth);
	    	}
	    }
	    this.m_fitRemainingColumns = ((this.isMaximized) && remainingWidth > 0) ? true : false;
	}
	this.m_widthArr = widthArray;
};

JExcelDataGrid.prototype.getRowAltColors = function() {
	return this.m_alternaterowcolors;
};
JExcelDataGrid.prototype.setRowAltColors = function() {
    var temp = this;
    this.m_alternaterowcolors = [];
    var alternateRowColor = temp.getDatagridStyles().getAlternateRowsColor();
    var headerColors = temp.getDatagridStyles().getHeaderColors();
    var gridColors;
    if (alternateRowColor != undefined) {
        gridColors = alternateRowColor.split(",");
        if (gridColors.length == 1) {
            gridColors.push(gridColors[0]);
        }
        var newArr = ["#ffffff"];
        for (var i = 0; i < gridColors.length; i++) {
            newArr.push(convertColorToHex(gridColors[i]));
        }
        gridColors = newArr;
    } else {
        gridColors = headerColors.split(",");
        var tempArr = [];
        for (var i1 = 0; i1 < gridColors.length; i1++)
            tempArr.push(convertColorToHex(gridColors[i1]));

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
    this.m_alternaterowcolors = gridColors;
};
/** @description getter for tooltip **/
JExcelDataGrid.prototype.getToolTipData = function(mouseX, mouseY) {
    var data = [];
    data[0] = "";
    return data;
};
//# sourceURL=JExcelDataGrid.js