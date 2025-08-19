/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: SimpleDataGrid.js
 * @description Datagrid
 **/
function SimpleDataGrid(m_chartContainer, m_zIndex) {
    this.base = DataGrid;
    this.base();
    this.m_x = 10;
    this.m_y = 600;
    this.m_width = 500;
    this.m_height = 285;
    this.m_fitcolumns = "true"; //added to fit all columns in the available component width
    this.m_displayNames = [];
    this.m_columnHeaderDataMap = new Object();
    this.m_aggregatedRow = [];
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
    /** array for fields info..**/
    this.m_visibleArr = [];
    this.m_widthArr = [];
    //this.m_showAlertArr=[];
    //this.m_alertTypeArr=[];
    this.m_enableColumnStyleArr = [];
    this.m_textAlignArr = [];
    this.m_fontColorArr = [];
    this.m_fontSizeArr = [];
    this.m_fontStyleArr = [];
    this.m_fontWeightArr = [];
    this.m_fontFamilyArr = [];
    this.m_frozenColumnsArr = [];
	this.m_cellMergeArr = []; /**DAS-1274 added to store cell merge data of fields */
	this.m_cellMergeProertyArr = []; /**DAS-1274 added to store cell merge data of fields */
    this.m_tooltipColumnsArr = [];
    this.m_sortingColumnsArr = []; // added to show sorting or not at column level
    this.m_numberFormatColumnsArr = []; // added to show default data or with comma
	/*DAS-837 Component was visible when data service load at start is off */
   /* this.m_fieldName = [];*/
    this.m_isNumericArr = [];
    this.m_rowaggrgationArr = {};
    this.m_dateformat = {};
    this.m_isFixedLabelArr = [];
    this.m_formatterArr = [];
    this.m_unitNameArr = [];
    this.m_signPositioneArr = [];
    this.m_precisionArr = [];
    this.m_secondFormatterArr = [];
    this.m_secondUnitNameArr = [];
    
    this.m_selectedRows = [];
    
    /** m_designModeDrawingFlag: prevent rendering of grid more than once when in design mode **/
    this.m_designModeDrawingFlag = true;
    this.m_selectedCellInfo = {};
    this.columnWiseData = {};
    this.m_allowmultipleselection = false;
    this.m_showmultiplecheckbox = false;

    this.m_scrollbarsize = 7;
    this.m_scrollviewlimit = "0";
    
    this.m_aggregationtitle = "Aggregation";
    this.m_aggregationtitleforna = "NA";
    this.m_insertemptyrows = true;
    this.m_aggregatedrowfontweight = "normal";
    this.m_aggregatedrowfontsize = "12";
    this.m_aggregatedrowfontfamily = "Roboto";
    this.m_aggregatedrowfontstyle = "normal";
    this.m_aggregatedrowtextdecoration = "none";
    this.m_aggregatedrowfontcolor = "#000000";

    this.m_rowopacity = 0.8;
    this.m_headerrowopacity = 0.6;
    this.m_rowhoveropacity = 0.4;
    this.m_rowselectedopacity = 0.6;
    this.m_rowlinesopacity = 0.8;
    
   
};
/** @description Making prototype of DataGrid class and inheriting Method and property into SimpleDataGrid**/
SimpleDataGrid.prototype = new DataGrid();

/** @description This method will parse the DataGrid JSON and create a container **/
SimpleDataGrid.prototype.setProperty = function(gridJson) {
    this.ParseJsonAttributes(gridJson.Object, this);
    //	this.init();	/**create draggable div**/
    this.initCanvas();
};

/** @description Iterate through Grid JSON and set class variable values with JSON values **/
SimpleDataGrid.prototype.ParseJsonAttributes = function(jsonObject, nodeObject) {
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
SimpleDataGrid.prototype.getDataProvider = function() {
    return this.m_dataProvider;
};
/** @description storing field JSON into class Variable **/
SimpleDataGrid.prototype.setFields = function(fieldsJson) {
    this.m_fieldsJson = fieldsJson;
    this.setSeries(fieldsJson);
};

/** @description creating array for each property of fields and storing in arrays **/
SimpleDataGrid.prototype.setSeries = function(fieldsData) {
    this.fieldsData = fieldsData;
    this.m_seriesVisibleArr = {};
    this.m_fieldName = [];
    this.m_colHeadersFieldName = [];
    this.m_gridheaderDisplayNames = [];
    this.m_visibleArr = [];
    this.m_widthArr = [];
    this.m_textAlignArr = [];
    this.m_enableColumnStyleArr = [];
    this.m_fontColorArr = [];
    this.m_fontSizeArr = [];
    this.m_fontStyleArr = [];
    this.m_fontWeightArr = [];
    this.m_fontFamilyArr = [];
    this.m_frozenColumnsArr = [];
	this.m_cellMergeArr = []; /**DAS-1274 */
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
            this.m_enableColumnStyleArr[j] = this.getProperAttributeNameValue(fieldsData[i], "enableColumnStyle");
            this.m_fontColorArr[j] = this.getProperAttributeNameValue(fieldsData[i], "fontColor");
            this.m_fontSizeArr[j] = this.getProperAttributeNameValue(fieldsData[i], "fontSize");
            this.m_fontStyleArr[j] = this.getProperAttributeNameValue(fieldsData[i], "fontStyle");
            this.m_fontWeightArr[j] = this.getProperAttributeNameValue(fieldsData[i], "fontWeight");
            this.m_fontFamilyArr[j] = this.getProperAttributeNameValue(fieldsData[i], "fontFamily");
            this.m_frozenColumnsArr[j] = this.getProperAttributeNameValue(fieldsData[i], "frozencolumn");
			this.m_cellMergeArr[j] = this.getProperAttributeNameValue(fieldsData[i], "showcellmerge");
			/**DAS-1274 @desc cell merge only work when cellmerge checkbox is checked */
			var cellmergeobj= fieldsData[i].CellMergeCustomProperties;
			if (cellmergeobj && Object.keys(cellmergeobj).length > 0 && IsBoolean(this.m_cellMergeArr[j])) {
			    this.m_cellMergeProertyArr.push(cellmergeobj);
			}
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
            this.m_isNumericArrMap[fieldname] = cellType;
            this.m_isNumericArrMapForSorting[this.getStringARSC(fieldname)] = cellType;
            this.m_sortingColumnsArr[j] = (sorting == undefined) ? true : IsBoolean(sorting);
            this.m_numberFormatColumnsArr[j] = (numberFormatter == undefined) ? "none" : numberFormatter;
            
            this.m_rowaggrgationArr[fieldname] = this.getProperAttributeNameValue(fieldsData[i], "rowAggregation");
            this.m_dateformat[fieldname] = this.getProperAttributeNameValue(fieldsData[i], "dateformat");
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
                "seriesName": this.m_colHeadersFieldName[j],
                "displayName": this.m_gridheaderDisplayNames[j],
                "color": this.m_fieldColors[j],
                "shape": this.m_plotShapeArray[j],
                "width": this.m_widthArr[j],
                "textAlign": this.m_textAlignArr[j],
                "enableColumnStyle": this.m_enableColumnStyleArr[j],
                "fontColor": this.m_fontColorArr[j], 
                "fontSize": this.m_fontSizeArr[j],
                "fontStyle": this.m_fontStyleArr[j],
                "fontWeight": this.m_fontWeightArr[j],
                "fontFamily": this.m_fontFamilyArr[j],
                "frozenColumn": this.m_frozenColumnsArr[j],
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
                "index": j
            };
            this.legendMap[this.m_colHeadersFieldName[j]] = tempMap;
            j++;
        }
    }
	/**DAS-1274 flattern object to one array */
	var flatMerges = [];

	for (var i = 0; i < this.m_cellMergeProertyArr.length; i++) {
	    var item = this.m_cellMergeProertyArr[i];

	    if (Array.isArray(item)) {
	        for (var j = 0; j < item.length; j++) {
	            flatMerges.push(item[j]);
	        }
	    } else if (typeof item === 'object' && item !== null) {
	        for (var key in item) {
	            if (item.hasOwnProperty(key)) {
	                flatMerges.push(item[key]);
	            }
	        }
	    }
	}
	this.m_cellMergeProertyArr = flatMerges;
    this.setLegendsIntialLoad(this.m_defaultlegendfields);
};

/** @description Getter Method of LegendInfo . **/
SimpleDataGrid.prototype.getLegendInfo = function() {
    return this.legendMap;
};

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
SimpleDataGrid.prototype.initCanvas = function() {
    var temp = this;
    $("#draggableDiv" + temp.m_objectid).remove();
    this.initializeDraggableDivAndCanvas();
};

/** @description  initialization of draggable div and its inner Content **/
SimpleDataGrid.prototype.initializeDraggableDivAndCanvas = function() {
    this.setDashboardNameAndObjectId();
    this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
    this.createDraggableCanvas(this.m_draggableDiv);
    this.setCanvasContext();
    this.initMouseMoveEvent(this.m_chartContainer);
    this.initMouseClickEvent();
};

/** @description  Will create an id for component to be used for dashboard operation management**/
SimpleDataGrid.prototype.setDashboardNameAndObjectId = function() {
    this.m_objectId = this.m_objectid;
    if (this.m_objectid.split(".").length == 2)
        this.m_objectid = this.m_objectid.split(".")[1];

    this.m_componentid = "dataGridDiv" + this.m_objectid;
};

/** @description creation of Div and Table ,Table is appended into div and setting CSS property **/
SimpleDataGrid.prototype.createDatagrid = function() {
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
    /*adobe new chart styles*/
    var subtitleFontMargin = (IsBoolean(this.m_subTitle.m_showsubtitle) && this.m_subTitle.getDescription() != "") ? 16 : 0 ; /**Added 4 to resolve subtitle font size less then 17 underline does not visible because header overlap the underline.*/
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
};

/** description initialization of SimpleDataGrid **/
SimpleDataGrid.prototype.init = function() {
    this.m_chartFrame.init(this);
    this.m_title.init(this);
    this.m_subTitle.init(this);
    //	this.setLimitedColumnShow();
    this.m_seriesData = this.getDataFromJSON();
    this.setVisibleFieldData();
    //this.m_seriesData=updateSeriesData(this.m_seriesData);//called for handle  comma separated numeric string data like-"1,234.00"
    this.isSeriesDataEmpty();
    this.isEmptyField();
    this.isVisibleField();
    if (!IsBoolean(this.m_isEmptyField)) {
        this.setDataBycolumn();
        this.updateGlobalVariableWithColumnData();
        this.createDatagrid();
    } else {
        var temp = this;
        $("#" + temp.m_componentid).remove();
    }
};
/** method updates visibility of columns when used with legend-with checkbox **/
SimpleDataGrid.prototype.setVisibleFieldData = function() {
    this.m_gridheaderDisplayNames = [];
    this.m_colHeadersFieldName = [];
    this.m_widthArr = [];
    this.m_textAlignArr = [];
    this.m_enableColumnStyleArr = [];
    this.m_fontColorArr = [];
    this.m_fontSizeArr = [];
    this.m_fontStyleArr = [];
    this.m_fontWeightArr = [];
    this.m_fontFamilyArr = [];
    this.m_isNumericArr = [];
    this.m_frozenColumnsArr = [];
	this.m_cellMergeArr = [];
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
            this.m_enableColumnStyleArr.push(this.legendMap[this.m_fieldName[i]].enableColumnStyle);
            this.m_fontColorArr.push(this.legendMap[this.m_fieldName[i]].fontColor);
            this.m_fontSizeArr.push(this.legendMap[this.m_fieldName[i]].fontSize);
            this.m_fontStyleArr.push(this.legendMap[this.m_fieldName[i]].fontStyle);
            this.m_fontWeightArr.push(this.legendMap[this.m_fieldName[i]].fontWeight);
            this.m_fontFamilyArr.push(this.legendMap[this.m_fieldName[i]].fontFamily);
            this.m_frozenColumnsArr.push(this.legendMap[this.m_fieldName[i]].frozenColumn);
			this.m_cellMergeArr.push(this.legendMap[this.m_fieldName[i]].showcellmerge);
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

/** @description POC written to check fast loading of grids with less columns **/
SimpleDataGrid.prototype.setLimitedColumnShow = function() {
    if (this.isLimitedColumnShow) {
        if (this.isMaximized) {
            var fieldsJson = this.m_fieldsJson;
            this.setSeries(fieldsJson);
        } else {
            var fieldsJson = [];
            for (var i = 0, length = this.m_fieldsJson.length; i < length; i++) {
                if (IsBoolean(this.getProperAttributeNameValue(this.m_fieldsJson[i], "visible"))) {
                    if (i < 3) {
                        fieldsJson.push(this.m_fieldsJson[i]);
                    } else {
                        break;
                    }
                }
            }
            this.setSeries(fieldsJson);
        }
    }
};

/** @description updation of global variable**/
SimpleDataGrid.prototype.updateGlobalVariableWithColumnData = function() {
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
/** @description getter method for Field Display Name**/
SimpleDataGrid.prototype.getAllFieldsDisplayName = function() {
    return this.m_gridheaderDisplayNames;
};

/** @description getter method for Field Name**/
SimpleDataGrid.prototype.getAllFieldsName = function() {
    return this.m_colHeadersFieldName;
};

/** @description getter for DataByColumn **/
SimpleDataGrid.prototype.getDataBycolumn = function(colName) {
    return this.m_columnHeaderDataMap[colName];
};

/** @description setting column as key and series Data as value **/
SimpleDataGrid.prototype.setDataBycolumn = function() {
    if (!IsBoolean(this.m_isEmptyField) && this.m_seriesData) {
        for (var key in this.m_seriesData[0]) {
        	if(this.m_seriesData[0].hasOwnProperty(key)){
	            var colData = [];
	            if (IsBoolean(this.m_seriesVisibleArr[key])){
	            	for (var j = 0, length = this.m_seriesData.length; j < length; j++) {
	            		colData.push(this.m_seriesData[j][key]);
	            	}
	            }
	            if (IsBoolean(this.m_seriesVisibleArr[key])){
	                this.m_columnHeaderDataMap[key] = colData;
	            };
	            /** Storing the aggregated cell value for each column **/
	            try{
	            	this.m_aggregatedRow[this.getStringARSC(key)] = this.getRowAggregationObject( key, colData );
	            }catch(e){
	            	console.log(e);
	            }
        	}
        }
    } else {
        for (var k = 0, length = this.m_displayNames.length; k < length; k++) {
            this.m_columnHeaderDataMap[this.m_colHeadersFieldName[k]] = [0];
        }
    }
};
SimpleDataGrid.prototype.getRowAggregationObject = function(key, colData) {
	var firstKey;
	for (var key1 in this.m_rowaggrgationArr) {
		firstKey = key1;
		break;
    };
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
    }
    return aggregatedValue;
};
/** @description calculating the value column data according to the m_rowaggregation value for Row Aggregation**/
SimpleDataGrid.prototype.getCalculusValue = function(colData, rowaggrgationArr, isNumericArrMap) {
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
        if (minimum == Infinity) {
            minimum = 0;
        }
        return minimum;
    } else if (rowaggrgationArr == "Maximum") {
        var maximum = Math.max.apply(Math, NumericArray);
        if (maximum == -Infinity) {
            maximum = 0;
        }
        return maximum;
    } else {
        return null;
    }
};

/** @description setter method to set the width of each column  **/
SimpleDataGrid.prototype.setColumnWidth = function() {
	var definedWidth = 0;
	var count = 0;
	this.m_fitRemainingColumns = false;
	for (var i = 0, len = this.m_colHeadersFieldName.length; i < len; i++) {
	    if (this.m_widthArr[i] != undefined && this.m_widthArr[i] != "") {
	        definedWidth = definedWidth * 1 + (parseInt(this.m_widthArr[i]) * 1);
	        count++;
	    }
	}
	var remainingWidth = this.m_width - definedWidth;
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
/** @description Getter for DataGrid headers **/
SimpleDataGrid.prototype.getColumnHeads = function() {
	return this.columnHeads;
};
SimpleDataGrid.prototype.dateSorter = function(dateStr1, dateStr2, format) {
	var a, b;

	// Split based on format
	switch (format) {
		case 'YYYY-MM-DD':/*Dates*/
			a = dateStr1?.split(/[-]/); 
			b = dateStr2?.split(/[-]/);
			return this.compareDates(a, b, [0, 1, 2]);
		case 'DD-MM-YYYY':
			a = dateStr1?.split(/[-]/);
			b = dateStr2?.split(/[-]/);
			return this.compareDates(a, b, [2, 1, 0]);
		case 'MM-DD-YYYY':
			a = dateStr1?.split(/[-]/);
			b = dateStr2?.split(/[-]/);
			return this.compareDates(a, b, [2, 0, 1]);
		case 'YYYY/MM/DD':
			a = dateStr1?.split(/[/]/); 
			b = dateStr2?.split(/[/]/);
			return this.compareDates(a, b, [0, 1, 2]);
		case 'DD/MM/YYYY':
			a = dateStr1?.split(/[/]/);
			b = dateStr2?.split(/[/]/);
			return this.compareDates(a, b, [2, 1, 0]);
		case 'MM/DD/YYYY':
			a = dateStr1?.split(/[/]/);
			b = dateStr2?.split(/[/]/);
			return this.compareDates(a, b, [2, 0, 1]);
		
		case 'YYYY-MM-DD HH:MM:SS':/*Dates with time*/
			a = dateStr1?.split(/[- :]/); 
			b = dateStr2?.split(/[- :]/);
			return this.compareDates(a, b, [0, 1, 2 ,3 ,4 ,5]);
		case 'DD-MM-YYYY HH:MM:SS':
			a = dateStr1?.split(/[- :]/);
			b = dateStr2?.split(/[- :]/);
			return this.compareDates(a, b, [2, 1, 0 ,3 ,4 ,5]);
		case 'MM-DD-YYYY HH:MM:SS':
			a = dateStr1?.split(/[- :]/);
			b = dateStr2?.split(/[- :]/);
			return this.compareDates(a, b, [2, 0, 1 ,3 ,4 ,5]);
		case 'YYYY/MM/DD HH:MM:SS':
			a = dateStr1?.split(/[/ :]/); 
			b = dateStr2?.split(/[/ :]/);
			return this.compareDates(a, b, [0, 1, 2 ,3 ,4 ,5]);
		case 'DD/MM/YYYY HH:MM:SS':
			a = dateStr1?.split(/[/ :]/);
			b = dateStr2?.split(/[/ :]/);
			return this.compareDates(a, b, [2, 1, 0 ,3 ,4 ,5]);
		case 'MM/DD/YYYY HH:MM:SS':
			a = dateStr1?.split(/[/ :]/);
			b = dateStr2?.split(/[/ :]/);
			return this.compareDates(a, b, [2, 0, 1 ,3 ,4 ,5]);
		
		case 'YYYY-MM-DDTHH:MM:SSZ':/*ISO*/
			a = dateStr1?.split(/[- : T Z]/);
			b = dateStr2?.split(/[- : T Z]/);
			return this.compareDates(a, b, [0, 1, 2 ,3 ,4 ,5]);
		
		case 'AM/PM':/*Time*/
			a = this.convertTo24HourFormat(dateStr1);
			b = this.convertTo24HourFormat(dateStr2);
			return this.compareDates(a, b, [0, 1, 2]);
		case 'HH:MM':
			a = dateStr1?.split(/[:]/);
			b = dateStr2?.split(/[:]/);
			return this.compareDates(a, b, [0, 1, 2]);
		
		default:
			return 0; // If format is unknown, do nothing
	}
}
SimpleDataGrid.prototype.convertTo24HourFormat = function(timeStr) {
    if (!timeStr) return undefined;
    
    let [hours, minutes, period] = timeStr.split(/[: ]/);
    hours = parseInt(hours);
    
    // Convert hours based on AM/PM
    if (period === 'PM' && hours < 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0; // Midnight case
    }

    return [hours, minutes];
}
//@descrption to compare date parts and time parts  (year, month, day,hh,mm,ss)
SimpleDataGrid.prototype.compareDates = function(a, b, order) {
	if (a != undefined && b != undefined) {
		for (let i of order) {
			if ((a[i]*1) !== (b[i]*1)) {//DAS-1046 24h format date sorting issue 
				return ((a[i]*1) > (b[i]*1)) ? 1 : -1;
			}
		}
	}
	return 0; 
}
//@descrption to compare strings parts (case Sensitive)
SimpleDataGrid.prototype.sortStringCaseSensitive = function(a, b) {
	if (a == null && b == null) return 0;
	if (a == null) return -1;
	if (b == null) return 1;
	
	if (typeof a === 'string') a = a.toLowerCase();
	if (typeof b === 'string') b = b.toLowerCase();
	
	if (a < b) return -1;
	if (a > b) return 1;
	return 0; 
}
/** @description Setter for DataGrid fields with events and styling **/
SimpleDataGrid.prototype.setColumnHeads = function() {
    var temp = this;
    this.columnHeads = [];
    this.frozenColumns = [];
    for (var i = 0, length = this.m_colHeadersFieldName.length; i < length; i++) {
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
		/*date formats*/
		if (temp.m_dateformat[this.m_colHeadersFieldName[i]] === 'D:YYYY-MM-DD') {
			tempObject.sorter = function(a, b) {
				return temp.dateSorter(a, b, 'YYYY-MM-DD');
			};
		} else if (temp.m_dateformat[this.m_colHeadersFieldName[i]] === 'D:MM-DD-YYYY') {
			tempObject.sorter = function(a, b) {
				return temp.dateSorter(a, b, 'MM-DD-YYYY');
			};
		} else if (temp.m_dateformat[this.m_colHeadersFieldName[i]] === 'D:DD-MM-YYYY') {
			tempObject.sorter = function(a, b) {
				return temp.dateSorter(a, b, 'DD-MM-YYYY');
			};
		} else if (temp.m_dateformat[this.m_colHeadersFieldName[i]] === 'D:YYYY/MM/DD') {
			tempObject.sorter = function(a, b) {
				return temp.dateSorter(a, b, 'YYYY/MM/DD');
			};
		} else if (temp.m_dateformat[this.m_colHeadersFieldName[i]] === 'D:MM/DD/YYYY') {
			tempObject.sorter = function(a, b) {
				return temp.dateSorter(a, b, 'MM/DD/YYYY');
			};
		} else if (temp.m_dateformat[this.m_colHeadersFieldName[i]] === 'D:DD/MM/YYYY') {
			tempObject.sorter = function(a, b) {
				return temp.dateSorter(a, b, 'DD/MM/YYYY');
			};
		}
		/*Date with Time formats*/
		else if (temp.m_dateformat[this.m_colHeadersFieldName[i]] === 'DT:YYYY-MM-DD HH:MM:SS') {
			tempObject.sorter = function(a, b) {
				return temp.dateSorter(a, b, 'YYYY-MM-DD HH:MM:SS');
			};
		} else if (temp.m_dateformat[this.m_colHeadersFieldName[i]] === 'DT:MM-DD-YYYY HH:MM:SS') {
			tempObject.sorter = function(a, b) {
				return temp.dateSorter(a, b, 'MM-DD-YYYY HH:MM:SS');
			};
		} else if (temp.m_dateformat[this.m_colHeadersFieldName[i]] === 'DT:DD-MM-YYYY HH:MM:SS') {
			tempObject.sorter = function(a, b) {
				return temp.dateSorter(a, b, 'DD-MM-YYYY HH:MM:SS');
			};
		} else if (temp.m_dateformat[this.m_colHeadersFieldName[i]] === 'DT:YYYY/MM/DD HH:MM:SS') {
			tempObject.sorter = function(a, b) {
				return temp.dateSorter(a, b, 'YYYY/MM/DD HH:MM:SS');
			};
		} else if (temp.m_dateformat[this.m_colHeadersFieldName[i]] === 'DT:MM/DD/YYYY HH:MM:SS') {
			tempObject.sorter = function(a, b) {
				return temp.dateSorter(a, b, 'MM/DD/YYYY HH:MM:SS');
			};
		} else if (temp.m_dateformat[this.m_colHeadersFieldName[i]] === 'DT:DD/MM/YYYY HH:MM:SS') {
			tempObject.sorter = function(a, b) {
				return temp.dateSorter(a, b, 'DD/MM/YYYY HH:MM:SS');
			};
		} else if (temp.m_dateformat[this.m_colHeadersFieldName[i]] === 'DT:YYYY-MM-DDTHH:MM:SSZ') {
			tempObject.sorter = function(a, b) {
				return temp.dateSorter(a, b, 'YYYY-MM-DDTHH:MM:SSZ');
			};
		} else if (temp.m_dateformat[this.m_colHeadersFieldName[i]] === 'T:AM/PM') {
			tempObject.sorter = function(a, b) {
				return temp.dateSorter(a, b, 'AM/PM');
			};
		} else if (temp.m_dateformat[this.m_colHeadersFieldName[i]] === 'T:HH:MM') {
			tempObject.sorter = function(a, b) {
				return temp.dateSorter(a, b, 'HH:MM');
			};
		}
		var alert = this.getAlertObj()[this.m_colHeadersFieldName[i]];
		/**DAS-1137 check if m_showalert is disabled through script  */
        if (alert != undefined && ((this.m_isNumericArr[i] == "Numeric")) && alert.m_showalert == true) {
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
        IsBoolean(this.m_frozenColumnsArr[i]) ? this.frozenColumns.push(tempObject) : this.columnHeads.push(tempObject);
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

/** @description getter for table data **/
SimpleDataGrid.prototype.getData = function() {
    return this.getTableData();
};

/** @description getter for all DataGrid data**/
SimpleDataGrid.prototype.getTableData = function() {
	return this.Tabledata;
};

/** @description getter for all DataGrid data**/
SimpleDataGrid.prototype.setTableData = function() {
    this.Tabledata = [];
    this.columnWiseData = {};
    for (var i = 0, outerLength = this.m_seriesData.length; i < outerLength; i++) {
        var rowdata = [];
        for (var j = 0, k = 0, innerLength = this.m_colHeadersFieldName.length; j < innerLength; j++) {
            var associateHead = this.m_colHeadersFieldName[j];
            var val = this.m_seriesData[i][associateHead];
            if (!isNaN(getNumericComparableValue(val)) && val != "" && this.m_precisionArr[this.m_colHeadersFieldName[j]] != "default" && this.m_precisionArr[this.m_colHeadersFieldName[j]] !== "") {
                val = this.checkPrecision(val);
            }
            if (this.columnWiseData[this.getStringARSC(associateHead)] == undefined) {
                this.columnWiseData[this.getStringARSC(associateHead)] = [];
            }
            if (IsBoolean(this.valueValidation(val))) {
                this.columnWiseData[this.getStringARSC(associateHead)].push(val);
            }
            rowdata[this.getStringARSC(associateHead)] = val;
            /** convert to numeric value for numeric sorting **/
            //rowdata[this.getStringARSC(associateHead)] = (IsBoolean(this.m_isNumericArr[j]) && IsBoolean(this.valueValidation(val))) ? val * 1 : val;
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
    for (var key in this.columnWiseData) {
        tempColumnWiseData[key] = {};
        tempColumnWiseData[key]["max"] = getNumericMax(this.columnWiseData[key]);
        tempColumnWiseData[key]["min"] = getNumericMin(this.columnWiseData[key]);
    }
    this.columnWiseData = {};
    this.columnWiseData = tempColumnWiseData;
    return this.Tabledata;
};

/** @description setting precision on the value **/
SimpleDataGrid.prototype.checkPrecision = function(val) {
    var isCommaSeparated = (("" + val).indexOf(",") > 0) ? true : false;
    var value = getNumericComparableValue(val);
    return IsBoolean(isCommaSeparated) ? getNumberWithCommas(value) : value;
};

/** @description getter for sorting the data**/
SimpleDataGrid.prototype.getSortedData = function() {
    var TableData = this.m_seriesData;
    /**sorting of data**/
    var temp = TableData.sort(function sortMultiDimensional(a, b) {
        return ((a[0] < b[0]) ? -1 : ((a[0] > b[0]) ? 1 : 0));
    });
    /** creating key value map for each row and pushing into TableDataArray**/
    var Tabledata1 = [];
    for (var i = 0, outerLength = temp.length; i < outerLength; i++) {
        var rowdata = [];
        for (var j = 0, k = 0, innerLength = temp[0].length; j < innerLength; j++) {
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

/** @description when grid has less data  blank rows for better looking **/
SimpleDataGrid.prototype.insertBlankRows = function(Tabledata) {
    /**When this.m_textwrap == true then scroll bar shows by default even though it's not required.
     * After text wrap header height increases and that header height applied after execution of set grid css function.
     * In that case need to call this.insertBlankRows() again, same function calling too many time increase time complexity
     * That's why in case of text wrap true, if insert bank rows is not required and scroll bar is creating unnecessary trouble.
     * Then in this case insert blank row can be avoid using script sdk.getWidget( 'ComponentID' ).m_insertemptyrows = false;  */
    if(IsBoolean(this.m_insertemptyrows) && (!IsBoolean(this.m_allowmultipleselection) || !IsBoolean(this.m_showmultiplecheckbox))){
        var rowHeight = this.getRowHeight(this.m_rowheight);
        var height = (1 * (this.m_height) - 1 * (this.m_titleHeight) - 1 * this.m_subTitleHeight);
        var rowNumber = (Tabledata.length * 1);
        var existingGridRowHeight = rowNumber * rowHeight + rowHeight * 1;
        this.m_isEmptyRows = ((existingGridRowHeight) < height) ? true : false;
        if ((existingGridRowHeight) < height) {
            this.m_hideScrollBar = true;
            var row = {};
            for (var i = 0, length = this.columnHeads.length; i < length; i++) {
                for (var j = 0; j < this.columnHeads[i].length; j++) {
                    row[this.columnHeads[i][j]["field"]] = "    ";
                }
            }
            for (var j = 1; j < 50; j++) {
                if ((existingGridRowHeight + rowHeight * 1) < height && existingGridRowHeight < height) {
                    Tabledata.push(row);
                    existingGridRowHeight = existingGridRowHeight * 1 + rowHeight * 1;
                } else {
                    break;
                }
            }
        } else {
            this.m_hideScrollBar = false;
        }
    }
    return Tabledata;
};

/** @description getter for scrollbar size **/
SimpleDataGrid.prototype.getScrollBarSize = function(Tabledata) {
	var rowHeight = this.getRowHeight(this.m_rowheight);
    var height = (1 * (this.m_height) - 1 * (this.m_titleHeight) - 1 * this.m_subTitleHeight);
    return ((Tabledata.length + 1) * rowHeight) < height ? 0 : this.m_scrollbarsize;
};

/** @description starting of frame,Title,SubTitle and DataGrid Drawing **/
SimpleDataGrid.prototype.drawChart = function() {
    this.createCanvasForDynamicRangeAlert();
    this.drawChartFrame();
    this.drawTitle();
    this.drawSubTitle();
    this.drawLegends();
    var map = this.IsDrawingPossible();
    if (IsBoolean(map.permission)) {
        this.drawSimpleDataGrid();
    } else {
        this.drawMessage(map.message);
    }
};

/** @description drawing of chart frame **/
SimpleDataGrid.prototype.drawChartFrame = function() {
    this.m_chartFrame.drawFrame();
};

/** @description Starting of title drawing  **/
SimpleDataGrid.prototype.drawTitle = function() {
    this.m_title.draw();
};

/** @description starting of subTitle drawing **/
SimpleDataGrid.prototype.drawSubTitle = function() {
    this.m_subTitle.draw();
};

/** @description Enables the scroll-view of datagrid when limit is set to greater-then-zero
 * and number-of-rows in datagrid is greater then the defined limit 
 * @param  {number} TdataLength length of records in datagrid 
 * @return {string} type of grid View **/
SimpleDataGrid.prototype.getDataGridView = function(TdataLength) {
	return (this.m_scrollviewlimit*1 !== 0 && TdataLength > this.m_scrollviewlimit*1) ? 
				scrollview : 
					$.fn.datagrid.defaults.view;
};

SimpleDataGrid.prototype.drawSimpleDataGrid = function() {
    var temp = this;
    this.setColumnWidth();
    this.setColumnHeads();
    this.setTableData();
    var Tabledata = this.getTableData();
    var Tdata = this.insertBlankRows(Tabledata);
	// Extract footerData and remove from main data
	const footerData = Tdata.find(row => row.gridHiddenField && row.gridHiddenField === 'aggregatedRow') || "" ;
	// Remove footer row from main data
	Tdata = Tdata.filter(row => !(row.gridHiddenField && row.gridHiddenField === 'aggregatedRow'));
	console.log("Footer Data:", footerData);
	console.log("Updated Data:", Tdata);
    var scrollbarSize = this.getScrollBarSize(Tdata);
    this.initDataGridAlerts();
    this.setRowAltColors();
    var isLoadingTime = true;
    if (this.m_designModeDrawingFlag) {
        this.m_designModeDrawingFlag = IsBoolean(this.m_designMode) ? false : true;
        if(temp.frozenColumns.length <= 0 && IsBoolean(temp.m_allowmultipleselection) && IsBoolean(temp.m_showmultiplecheckbox)){
			var checkBoxCol= {field:"ck", checkbox:true, fixed:true};
			temp.columnHeads.unshift(checkBoxCol);
		}
        var config = {
            view: temp.getDataGridView( (Tdata) ? Tdata.length : 0),
            pageSize: temp.m_scrollviewlimit*1,
            columns: [temp.columnHeads],
            data: Tdata,
            singleSelect: !IsBoolean(temp.m_allowmultipleselection),
            isEmptyRowsAdded: true,
            scrollOnSelect:false,
            isNumericArrMap:temp.m_isNumericArrMapForSorting,
            collapsible: true,
            rownumbers: false,
            remoteSort: false,
            showHeader: true,
            showFooter: true,
            scrollbarSize: scrollbarSize,
            striped: true,
            nowrap: !IsBoolean(temp.m_textwrap),
            //autoRowHeight:true,
            //sortName : temp.m_colHeadersFieldName[2],
            //sortOrder :"desc",
            loadMsg: "",
            loading: false,
            loaded: false,
            onSortColumn: function(sortField, sortOrder) {
                if (temp.m_isNumericArrMapForSorting[sortField] == "Numeric") {
                	var TDataSortRowsArr = [];
                    var TDataSortObj = getDuplicateObject(Tdata);
                    var TDataSortArray = $.map(TDataSortObj, function(value, index) {
                        return [value];
                    });
                    var TDataSort = [];
                    for (var i = 0, len = Tdata.length; i < len; i++) {
                        if (TDataSortArray[i][sortField] !== undefined) {
                            TDataSortArray[i][sortField] = ((getCommaRemovedValue(TDataSortArray[i][sortField])) * 1 == 0) ? (TDataSortArray[i][sortField] === "" ? "null" : 0) : (isNaN(getCommaRemovedValue(TDataSortArray[i][sortField])) ? TDataSortArray[i][sortField] : (getCommaRemovedValue(TDataSortArray[i][sortField]) * 1));
                        }
                        TDataSort[i] = TDataSortArray[i];
                    }
                    var emptyObj = [];
                    var rowsArr = [];
                    var aggregatedRow;
                    var isAggregatedRow = false;
                    for (var i = 0, length = TDataSort.length; i < length; i++) {
                        if (!Array.isArray(TDataSort[i]) || isNaN(TDataSort[i][sortField] * 1)) {
                            emptyObj.push(TDataSort[i]);
                        } else {
                            if (TDataSort[i].gridHiddenField !== "aggregatedRow") {
                                rowsArr.push(TDataSort[i]);
                            } else {
                                isAggregatedRow = true;
                                aggregatedRow = TDataSort[i];
                            }
                        }
                    }
                    /**DAS-1137 */
                    if (emptyObj) {
                        rowsArr = rowsArr.concat(emptyObj);
                    }
                    if (isAggregatedRow) {
                        rowsArr.push(aggregatedRow);
                    }

                    TDataSortRowsArr = rowsArr;
                    /**BDD-447 : For string data column make its 'ColumnType=Numeric' , apply static comparison alert, sorting = true || Preview*/
                    if(TDataSortRowsArr.length>1){
                    	jqEasyUI("#datagridTable" + temp.m_objectid).datagrid("loadData", TDataSortRowsArr);
                    }else{
                    	jqEasyUI("#datagridTable" + temp.m_objectid).datagrid("loadData", Tdata);
                    }
                } else {
                	 if (jqEasyUI("#datagridTable" + temp.m_objectid).datagrid("options").view.type == "scrollview" || IsBoolean(temp.m_isEmptyRows)) {
                         /** To hide and show column in jEasyui - use these syntax **/
                         //jqEasyUI("#datagridTable"+temp.m_objectid).datagrid("hideColumn", sortField);
                         //jqEasyUI("#datagridTable"+temp.m_objectid).datagrid("showColumn", sortField);
                     	jqEasyUI("#datagridTable" + temp.m_objectid).datagrid("loadData", Tdata);
                     }
                }
                
            },
            onClickRow: function() {
                temp.m_isRowClicked = true;
                var fieldNameValueMap = temp.getFieldNameValueMap();
                fieldNameValueMap["drillDisplayField"] = temp.getDrillDisplayFieldName(temp.m_selectedCellInfo.field, fieldNameValueMap);
                fieldNameValueMap["drillField"] = temp.getDrillFieldName(temp.m_selectedCellInfo.field, fieldNameValueMap);
                fieldNameValueMap["drillValue"] = temp.m_selectedCellInfo.value;
                var drillColor = "";
                temp.updateDataPoints(fieldNameValueMap, drillColor);
                temp.setSelectedRowCSS();                
            },
            onClickCell: function(index, field, value) {
                temp.m_selectedCellInfo = {};
                temp.m_selectedCellInfo = {
                    "index": index,
                    "field": field,
                    "value": value
                };
            },
            onCheck: function(index,row) {
				if (isLoadingTime) {
                return;
            	}else{
				/**execute only when checkbox is enabled with multiseelct in datagrid */
				if(temp.frozenColumns.length <= 0 && IsBoolean(temp.m_allowmultipleselection) && IsBoolean(temp.m_showmultiplecheckbox)){
				temp.m_isRowClicked = true;
                console.log(index+row);
                var fieldNameValueMap = temp.getFieldNameValueMap();
                fieldNameValueMap["drillDisplayField"] = temp.getDrillDisplayFieldName(temp.m_selectedCellInfo.field, fieldNameValueMap);
                fieldNameValueMap["drillField"] = temp.getDrillFieldName(temp.m_selectedCellInfo.field, fieldNameValueMap);
                fieldNameValueMap["drillValue"] = temp.m_selectedCellInfo.value;
                var drillColor = "";
                temp.updateDataPoints(fieldNameValueMap, drillColor);
                temp.setSelectedRowCSS();
                }	
				}                
            },
            onSelect: function(record) {				
				temp.m_selectedRow = record;
                //var opts = jqEasyUI("#datagridTable"+temp.m_objectid).datagrid("options");
            },
            onUnselect: function() {		
				/**DAS-761 */
    			var fieldNameValueMap = temp.getFieldNameValueMap();
                fieldNameValueMap["drillDisplayField"] = temp.getDrillDisplayFieldName(temp.m_selectedCellInfo.field, fieldNameValueMap);
                fieldNameValueMap["drillField"] = temp.getDrillFieldName(temp.m_selectedCellInfo.field, fieldNameValueMap);
                fieldNameValueMap["drillValue"] = temp.m_selectedCellInfo.value;
                var drillColor = "";
                temp.updateDataPoints(fieldNameValueMap, drillColor);
                temp.setSelectedRowCSS();
                //var opts = jqEasyUI("#datagridTable"+temp.m_objectid).datagrid("options");
            },
            onLoadSuccess: function(data) {
            	/** Change the calling position of setGridCss() to prevent row misalignment */
                //temp.setGridCss();
				/**DAS-1274 @desc merge cell code */
				/**	Merged cells must be adjacent and visible.
				If a cell is hidden, it can't be part of a colspan or rowspan.
				If you merge cells that already contain a merge, you'll get unexpected behavior or an error. 
				*/
				jqEasyUI("#datagridTable" + temp.m_objectid).datagrid('reloadFooter', [footerData]);
				var flatMerges = temp.m_cellMergeProertyArr;
				if (Array.isArray(flatMerges) && flatMerges.length > 0) {
				    // safe to loop
				    for (var i = 0; i < flatMerges.length; i++) {
				        var mergeObj = flatMerges[i];
				        var fieldName = (mergeObj.field).replace(/\s+/g, '_');
				       jqEasyUI("#datagridTable" + temp.m_objectid).datagrid('mergeCells', {
				            index: parseInt(mergeObj.index),
				            field: fieldName,
				            rowspan: parseInt(mergeObj.rowspan)>1?parseInt(mergeObj.rowspan):undefined,
							colspan: parseInt(mergeObj.colspan)>1?parseInt(mergeObj.colspan):undefined
				        });
				    }
				}
                /**DAS-761 */
               jqEasyUI("#datagridTable" + temp.m_objectid).datagrid("selectRow", temp.m_selectedRow);
                if(!IsBoolean(temp.m_designMode)){
                	temp.drawMicroCharts();
                }
				temp.setGridCss();
                isLoadingTime = false;
              
            },
            onAfterRender: function(target) {
				jqEasyUI("#datagridTable" + temp.m_objectid).datagrid('resize');
            	if(temp.m_scrollviewlimit*1 !== 0){
            		temp.setGridCss();
            	}
				temp.setGridCss();
            if(IsBoolean(temp.m_allowmultipleselection) && IsBoolean(temp.m_showmultiplecheckbox)){
			var style =$("#" + temp.m_componentid).find(".datagrid-view2 div.datagrid-header-check").attr('style'); //it will return string
			style = 'display: none;';
	    	$("#" + temp.m_componentid).find(".datagrid-view2 div.datagrid-header-check input").attr('style',style);
        }
            }
            /*groupFormatter:function(value,rows){
            //return value + " - " + rows.length + " Item(s)";
            },
            renderRow: function(target, fields, frozen, rowIndex, rowData){
            //console.log("rowdata==>"+rowData);
            },
            rowStyler: function(index,row){
            return temp.StyleRows(row,temp);
            }
             */
        };
        config.fitColumns = IsBoolean(this.m_designMode) ? true : IsBoolean(this.m_fitRemainingColumns);
        if(temp.frozenColumns.length > 0){
        	config.frozenColumns = [temp.frozenColumns];
        }
        try{
        	jqEasyUI("#datagridTable" + this.m_objectid).datagrid(config);
			/**load footer data */
			/*
			if (typeof footerData !== 'undefined' && footerData !== null) {
			  jqEasyUI("#datagridTable" + temp.m_objectid).datagrid('reloadFooter', [footerData]);
			}*/
        	if(IsBoolean(temp.m_columnrearrange) && IsBoolean(temp.m_designModeDrawingFlag))
        		jqEasyUI("#datagridTable" + this.m_objectid).datagrid('columnMoving');
        		
        }catch(e){
        	console.log(e);
        	try{
        		temp.setGridCss();
        	}catch(e){
        		console.log(e);
        	}
        }
        if ((scrollbarSize == 0) && (!IsBoolean(this.m_textwrap))) {
            $("#" + temp.m_componentid).find(".datagrid-body").css("overflow-y", "hidden");
        } else if ((IsBoolean(this.m_textwrap))) {
            $("#" + temp.m_componentid).find(".datagrid-body").css("overflow-y", "auto");
        } else {
            $("#" + temp.m_componentid).find(".datagrid-body").css("overflow-y", "auto");
        }
        // hiding vertical scroll bar hidden for first view
        if(_.contains(this.m_frozenColumnsArr,true)){
        	$("#" + temp.m_componentid).find(".datagrid-view1 div.datagrid-body").css("overflow-y", "hidden");
        }
        /* added below block for BDD-758, when frozen column is there and when vertical scroll bar is there,
		then column width mismatch when horizontally scrolled.*/
        if(!IsBoolean(this.m_fitcolumns)){
	    	$("#" + temp.m_componentid).find(".datagrid-view2 div.datagrid-header-inner").css("width", "10000px");
        }
        if(IsBoolean(temp.m_allowmultipleselection) && IsBoolean(temp.m_showmultiplecheckbox)){
			var style =$("#" + temp.m_componentid).find(".datagrid-view2 div.datagrid-header-check").attr('style'); //it will return string
			style = 'display: none;';
	    	$("#" + temp.m_componentid).find(".datagrid-view2 div.datagrid-header-check input").attr('style',style);
        }
        /** Necessory to export the grid proeprly otherwise column-width are not taken properly **/
        /**@PerformanceFix: Commenting below line of code bcz it is reloading grid again and this will increase the loading time.
         * We have checked with few scenarios and its working with scenarios BDD-746 @khivraj */
        /*jqEasyUI("#datagridTable" + temp.m_objectid).datagrid({
            scrollbarSize: scrollbarSize
        });*/
    } else {
       // if (IsBoolean(this.m_isResizedInDesigner)) {//DAS-696 Grids and Knowledge & decomposition charts were not drawing properly in canvas when initially hidden
            jqEasyUI("#datagridTable" + temp.m_objectid).datagrid("resize", {
                width: temp.m_width - (IsBoolean(temp.m_showborder) ? (temp.m_borderthickness) : 0) * 2 ,
                height: 1 * temp.m_height - 1 * temp.m_titleHeight - temp.m_subTitleHeight * 1 - 1 * temp.m_DGFilterHeight - 2
            });
            temp.setGridCss();
        //}
    }
};
SimpleDataGrid.prototype.drawMicroCharts = function() {
	for(var j = 0, length = this.m_colHeadersFieldName.length; j < length; j++){
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
SimpleDataGrid.prototype.drawBullet = function(j) {
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
SimpleDataGrid.prototype.drawSparkline = function(j) {
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
SimpleDataGrid.prototype.drawSparkColumn = function(j) {
    var tooltipBGColor = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
	var config = {
		width:Math.round(this.m_widthArr[j]) - 8,
		height: Math.round(this.m_rowheight) - 5,
		dataLabel:false,
		fieldName: this.m_gridheaderDisplayNames[j],
		tooltipBackgroundColor: tooltipBGColor,
		disableTooltips: (!IsBoolean(this.legendMap[this.m_colHeadersFieldName[j]].toolTipColumn)),
	};
	$(".SparkColumn"+this.m_objectid+this.getStringARSC(this.m_colHeadersFieldName[j])).sparkline('html', this.getSparkColumnConfig(config, this.m_colHeadersFieldName[j], this.m_gridheaderDisplayNames[j]));
};
SimpleDataGrid.prototype.drawSparkPie = function(j) {
    var tooltipBGColor = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
	var config = {
		width:Math.round(this.m_widthArr[j]) - 8,
		height: Math.round(this.m_rowheight) - 5,
		dataLabel:false,
		fieldName: this.m_gridheaderDisplayNames[j],
		tooltipBackgroundColor: tooltipBGColor,
		disableTooltips: (!IsBoolean(this.legendMap[this.m_colHeadersFieldName[j]].toolTipColumn)),
	};
	$(".SparkPie"+this.m_objectid+this.getStringARSC(this.m_colHeadersFieldName[j])).sparkline('html', this.getSparkPieConfig(config, this.m_colHeadersFieldName[j], this.m_gridheaderDisplayNames[j]));
};
/** @description get drilled field name **/
SimpleDataGrid.prototype.getDrillFieldName = function(fieldName, row) {
    for (var key in row) {
        if (fieldName === this.getStringARSC(key)){
            return key;
        }
    }
};

/** @description get drilled field display name **/
SimpleDataGrid.prototype.getDrillDisplayFieldName = function(fieldName, row) {
    var fieldname = this.getDrillFieldName(fieldName, row);
    for (var i = 0, length = this.m_colHeadersFieldName.length; i < length; i++) {
        if (this.m_colHeadersFieldName[i] === fieldname){
            return this.m_gridheaderDisplayNames[i];
        }
    }
};

/** @description this Map contains single row details in form of key value pair  **/
SimpleDataGrid.prototype.getFieldNameValueMap = function() {
	var temp = this;
    var fieldNameValueMap = new Object();
    if (!IsBoolean(this.m_allowmultipleselection)) {
        var row = jqEasyUI("#datagridTable" + this.m_objectid).datagrid("getSelected");
        var fieldNameValueMap = new Object();
        if (rows && row != null) {
            for (var i = 0, length = this.m_colHeadersFieldName.length; i < length; i++) {
                fieldNameValueMap[this.m_colHeadersFieldName[i]] = row[this.m_colHeadersFieldName[i]];
            }
        }

        if (row != null && this.m_seriesData[row["gridHiddenField"]] != undefined) {
            return this.m_seriesData[row["gridHiddenField"]];
        } else {
            return fieldNameValueMap;
        }
    } else {
		/**DAS-761 */
    	var rows = jqEasyUI("#datagridTable" + this.m_objectid).datagrid("getSelections");
    	//var rows = temp.m_selectedRows;
        if (rows && rows != null) {
            fieldNameValueMap = {};
            if (rows.length != 0) {
                for (var i = 0, length = rows.length; i < length; i++) {
                    var index = rows[i]["gridHiddenField"];/**DAS-761 */
                    //var index = rows[i];
                    for (var key in this.m_seriesData[index]) {
                        if (fieldNameValueMap[key] == undefined) {
                            fieldNameValueMap[key] = [];
                        }
                        fieldNameValueMap[key].push(this.m_seriesData[index][key]);
                    }
                }
            } else {
                for (var key in this.m_seriesData[0]) {
                    if (fieldNameValueMap[key] == undefined) {
                        fieldNameValueMap[key] = [];
                    }
                }
            }
        }
        return fieldNameValueMap;
    }
};

/** @description generation of ToolTip **/
SimpleDataGrid.prototype.drawToolTipForCell = function(colName, index, val, row) {
	if((this.legendMap[colName].cellType == "Sparkline" || this.legendMap[colName].cellType == "SparkColumn" || this.legendMap[colName].cellType == "SparkPie") && (val!="null" && val!=undefined && isNaN(val) && val!="NA")){
		return '<div class="'+this.legendMap[colName].cellType+this.m_objectid+this.getStringARSC(colName)+'" style="width:'+this.m_widthArr[index]+'px;">'+val+'</div>';
	}else if(this.legendMap[colName].cellType == "Image" && (val!="null" && val!=undefined && isNaN(val) && val!="NA")){
		return '<img src="'+val+'" style="height:'+(this.m_rowheight*1 - 1)+'px; width:'+(this.m_rowheight*1 - 1)+'px;"></img>'
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
	    if(this.legendMap[colName].cellType == "Hyperlink" && (val!="null" && val!=undefined && (isNaN(val)==true) && val!="NA")){
	    	return '<div onclick="openHyperlink(\'' + val + '\')" onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ',' + false + ',' + this.m_gridcustomtooltip + ')" onmouseout="hideToolTip()" style="z-index:999; cursor:pointer;">' + value + '</div>';
	    } else {
	    	if (this.m_TooltipFieldsArr[colName].length > 0 && (row.gridHiddenField < this.getDataProvider().length)) {
	    		var toolTipInfo = {
	    				"colName": colName,
	    				"rowId" : row.gridHiddenField,
	    				"tooltipValue" : tooltipValue
	    		};
	    	    if (this.m_TooltipFieldsArr[colName].length == 1) {
	    	    		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + this.getCustomTooltipData(toolTipInfo,row) + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ',' + false + ',' + this.m_gridcustomtooltip + ')" onmouseout="hideToolTip()" style="z-index:999;">' + value + '</div>';
	    	    } else {
	    	    		var toolTipObj = "'" + this.getCustomTooltipData(toolTipInfo,row).value + "'";
		    	        return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + toolTipObj + ',' + tooltipBGColor + ',' + tooltipBGAlpha + ',' + customToolTipWidth + ',' + true + ','+ this.m_gridcustomtooltip +')" onmouseout="hideToolTip()" style="z-index:999;">' + value + '</div>';
	    	    }
	    	} else {
	    		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ',' + false + ',' + this.m_gridcustomtooltip + ')" onmouseout="hideToolTip()" style="z-index:999;">' + value + '</div>';
	    	}
	    }
	}
};
SimpleDataGrid.prototype.getCustomTooltipData = function(toolTipInfo,rowdata) {
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
SimpleDataGrid.prototype.getProgressBarColor = function() {
	return ["#83cc0f","#f7244a","#f5b229","#ddc617","#49b1de"];
};
/** @description drawing of ProgressBar inside the grid cell **/
SimpleDataGrid.prototype.drawProgressBar = function(colName, index, val, row) {
	var ProgressClass = "progressDiv"+this.m_objectid+this.getStringARSC(colName);
	var showtooltip = this.m_tooltipColumnsArr[index];
	var tooltipValue = "'" + val + "'";
	var colorArr = this.getProgressBarColor();
	var silderHeight = this.fontScaling(3);
	var tooltipBGColor = "'" + this.m_tooltipbackgroundcolor + "'";
    var tooltipBGAlpha = "'" + this.m_tooltipbackgroundtransparency + "'";
    var customToolTipWidth = "'" + this.m_customtooltipwidth + "'";
	if(1*val===0){
		var leftBarWidth = 0;
		var rightBarWidth = (this.m_widthArr[index] - 10);
		var ProgressClassStyle = '"border-left:'+silderHeight+'px solid transparent;border-right:'+silderHeight+'px solid transparent; width:'+(1*this.m_widthArr[index] - 10)+'px;"';
		var ProgressLeftDivStyle = '"border:'+silderHeight+'px solid '+colorArr[0]+'; border-top-left-radius: 2em; border-bottom-left-radius: 2em; float:left; width:'+(leftBarWidth)+'px;"';
		var ProgressRightDivStyle = '"border:'+silderHeight+'px solid '+colorArr[1]+'; border-top-left-radius: 2em; border-bottom-left-radius: 2em; border-top-right-radius: 2em; border-bottom-right-radius: 2em; float:right; width:'+(rightBarWidth)+'px;"';
		var text = '<div style="display:flex;" class="progressBarLabels"><div align="left" style="float:left; width:50%;">'+this.getFormattedCellValue(val, colName, index)+'</div><div align="right" style="float:right; width:50%;">'+this.getFormattedCellValue(100-val, colName, index)+'</div></div>'
		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ')" onmouseout="hideToolTip()" class='+ProgressClass+' style='+ProgressClassStyle+'>'+text+'<div style="display:flex;"><div style='+ProgressRightDivStyle+'></div></div>';
	}else if(1*val===100){
		var leftBarWidth = (this.m_widthArr[index] - 10);
		var rightBarWidth = 0;
		var ProgressClassStyle = '"border-left:'+silderHeight+'px solid transparent;border-right:'+silderHeight+'px solid transparent; width:'+(1*this.m_widthArr[index] - 10)+'px;"';
		var ProgressLeftDivStyle = '"border:'+silderHeight+'px solid '+colorArr[0]+'; border-top-left-radius: 2em; border-bottom-left-radius: 2em; border-top-right-radius: 2em; border-bottom-right-radius: 2em; float:left; width:'+(leftBarWidth)+'px;"';
		var ProgressRightDivStyle = '"border:'+silderHeight+'px solid '+colorArr[1]+'; border-top-right-radius: 2em; border-bottom-right-radius: 2em; float:right; width:'+(rightBarWidth)+'px;"';
		var text = '<div style="display:flex;" class="progressBarLabels"><div align="left" style="float:left; width:50%;">'+this.getFormattedCellValue(val, colName, index)+'</div><div align="right" style="float:right; width:50%;">'+this.getFormattedCellValue(100-val, colName, index)+'</div></div>'
		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ')" onmouseout="hideToolTip()" class='+ProgressClass+' style='+ProgressClassStyle+'>'+text+'<div style="display:flex;"><div style='+ProgressLeftDivStyle+'></div></div></div>';
	}else if(1*val<0 || 1*val > 100){
		var leftBarWidth = (this.m_widthArr[index] - 10);
		var ProgressClassStyle = '"border-left:'+silderHeight+'px solid transparent;border-right:'+silderHeight+'px solid transparent; width:'+(1*this.m_widthArr[index] - 10)+'px;"';
		var ProgressLeftDivStyle = '"border:'+silderHeight+'px solid '+this.m_defaultalertcolor+'; border-top-left-radius: 2em; border-bottom-left-radius: 2em; border-top-right-radius: 2em; border-bottom-right-radius: 2em; float:left; width:'+(leftBarWidth)+'px;"';
		var text = '<div style="display:flex;" class="progressBarLabels"><div align="left" style="float:left; width:80%;">'+this.getFormattedCellValue(val, colName, index)+'</div><div align="right" style="float:right; width:20%;"></div></div>'
		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ')" onmouseout="hideToolTip()" class='+ProgressClass+' style='+ProgressClassStyle+'>'+text+'<div style="display:flex;"><div style='+ProgressLeftDivStyle+'></div></div></div>';
	}else{
		var leftBarWidth = (val*(this.m_widthArr[index] - 10)/100);
		var rightBarWidth = (this.m_widthArr[index]*1 - 14) - leftBarWidth;
		var ProgressClassStyle = '"border-left:'+silderHeight+'px solid transparent;border-right:'+silderHeight+'px solid transparent; width:'+(1*this.m_widthArr[index] - 10)+'px;"';
		var ProgressLeftDivStyle = '"border:'+silderHeight+'px solid '+colorArr[0]+'; border-top-left-radius: 2em; border-bottom-left-radius: 2em; float:left; width:'+(leftBarWidth)+'px;"';
		var ProgressRightDivStyle = '"border:'+silderHeight+'px solid '+colorArr[1]+'; border-top-right-radius: 2em; border-bottom-right-radius: 2em; float:right; width:'+(rightBarWidth)+'px;"';
		var text = '<div style="display:flex;" class="progressBarLabels"><div align="left" style="float:left; width:50%;">'+this.getFormattedCellValue(val, colName, index)+'</div><div align="right" style="float:right; width:50%;">'+this.getFormattedCellValue(100-val, colName, index)+'</div></div>'
		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ')" onmouseout="hideToolTip()" class='+ProgressClass+' style='+ProgressClassStyle+'>'+text+'<div style="display:flex;"><div style='+ProgressLeftDivStyle+'></div><div style="border: 1px solid #ffffff;"></div><div style='+ProgressRightDivStyle+'></div></div></div>';
	}
};

/** @description drawing of Alerts inside the grid cell **/
SimpleDataGrid.prototype.drawAlertImages = function(colName, colIndex, val, row, DynamicColName) {
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
		toolTipformattedvalue = this.getCustomTooltipData(toolTipInfo,row);
	}
    if(temp.getAlertObj()[colName].m_mode == "Range"){ // && IsBoolean(temp.getAlertObj()[colName].getDynamicRange())
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
SimpleDataGrid.prototype.FormatCellValue = function(colName, colIndex, value, row) {
    var temp = this;
    for (var key in row) {
        // call temp.getStringARSC() method for remove space and replace with underscore(_)
        if (value == row[key] && key == temp.getStringARSC(colName)) {
        	/** Changed conditions for apply formatter on Aggregated row */
        	if (value === "" || value == "NIL" || value == "null"){
                return value;
            } else {
            	if (row.gridHiddenField == "aggregatedRow" && temp.m_rowaggrgationArr[colName] == "Count") {
            		return value;
            	} else {
            		return temp.getFormattedCellValue(value, colName, colIndex);
            	}
                
            }
        }
    }
};

/** @description format grid cell value according to given formatter in the fields **/
SimpleDataGrid.prototype.getFormattedCellValue = function(value, colName, index) {
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

/** @description styling the grid rows **/
SimpleDataGrid.prototype.StyleRows = function(row, pagingDG) {
    var temp = pagingDG;
    if (IsBoolean(temp.m_colorbycomparison)) {
        for (var i = 0, outerLength = temp.getDataSet().getFields().length; i < outerLength; i++) {
            //if(IsBoolean(temp.getDataSet().getFields()[i].getshowalert() ))
            {
                for (var key in row) {
                    var value = row[key];
                    if (temp.getAlertObj()[key] != undefined) {
                        var alertObject = temp.getAlertObj()[key];
                        var color, gradient;
                        if (alertObject.getAlertType() == "row" && alertObject.m_mode == "Numeral Comparison") {
                            if ((value) == 1) {
                                //color=hex2rgb(alertObject.getRangeColor(0),0.7);
                                color = alertObject.getRangeColor(0);
                                gradient = this.createLinearGradient(color);
                                return "background-color:" + gradient;
                            } else if ((value) == 0) {
                                //color=hex2rgb(alertObject.getRangeColor(1),0.7);
                                color = alertObject.getRangeColor(1);
                                gradient = this.createLinearGradient(color);
                                return "background-color:" + gradient;
                            } else {
                            	// Do nothing
                            }
                        } else {
                            for (var q = 0, innerLength = alertObject.alertRanges.length; q < innerLength; q++) {
                                var min = alertObject.getMinMaxRange(q)[0];
                                var max = alertObject.getMinMaxRange(q)[1];
                                if ((value <= (max * 1)) && (value >= (min * 1))) {
                                    color = alertObject.getRangeColor(q);
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
SimpleDataGrid.prototype.createLinearGradient = function(colorcode) {
    var color = (convertColorToHex(colorcode));
    /*	return "background: -webkit-gradient(linear, left top, left bottom,color-stop(0%, white),"+
    "color-stop(5%, white), color-stop(6%, #"+color+"));"+
    "background: -moz-linear-gradient(top, white 0%, white 15%, #"+color+" 70%);";
     */
    return "background-image: -webkit-gradient(linear, left top, left bottom, from(#9e9e9e), to(#454545));" +
        " background-image: -webkit-linear-gradient(top, #fff 2%, #" + color + " 90%, #fff);" +
        "background-image:    -moz-linear-gradient(top, #fff 2%, #" + color + " 90%, #fff);" +
        " background-image:      -o-linear-gradient(top, #fff 2%, #" + color + " 90%, #fff);" +
        " background-image:         linear-gradient(to bottom, #fff 2%, #" + color + " 90%, #fff);" +
        "height: " + this.getRowHeight(this.m_rowheight) + "px;";
};

/** @description styling the datagrid **/
SimpleDataGrid.prototype.setGridCss = function() {
    var temp = this;
    var comp = $("#" + temp.m_componentid);
    comp.find("table").css("border-collapse", "initial");
    comp.find(".panel-body").css("padding", "0px");
    comp.find(".datagrid-header-row span").css({
        "color": convertColorToHex(temp.m_headerfontcolor),
        "font-weight": temp.m_headerfontweight,
        "font-size": temp.fontScaling(temp.m_headerfontsize) + "px",
        "font-family": selectGlobalFont(temp.m_headerfontfamily),
        "font-style": temp.m_headerfontstyle,
        "text-decoration": temp.m_headertextdecoration
    });
    for (var i = 0, length = temp.m_colHeadersFieldName.length; i < length; i++) {
        if (IsBoolean(temp.m_enableColumnStyleArr[i])) {
            var colName = temp.m_colHeadersFieldName[i].replace(/[^a-z0-9\s]/gi, '').replace(/ /g, "_");
            comp.find('.datagrid-body td[field ="' + colName + '"]').css({
                "color": convertColorToHex(temp.m_fontColorArr[i]),
                "font-size": temp.fontScaling(temp.m_fontSizeArr[i]) + "px",
                "font-style": temp.m_fontStyleArr[i],
                "font-weight": temp.m_fontWeightArr[i],
                "font-family": selectGlobalFont(temp.m_fontFamilyArr[i]),
            });
        };
    };
    /**for adding the different color on each header according to the Series color **/
    if (IsBoolean(this.m_usefieldcolorasheader)) {
    	/** coloring datagrid header based on views when frozen column **/
    	var l = 0,
    	    m = 0;
    	for (var i = 0, length = this.m_colHeadersFieldName.length; i < length; i++) {
    	    if (IsBoolean(this.m_frozenColumnsArr[i])) {
    	        comp.find(".datagrid-view1 .datagrid-header-row  td:nth-child(" + (l + 1) + ")").css("background", hex2rgb(this.m_fieldColors[i], temp.m_headerrowopacity));
    	        l++;
    	    } else {
    	        comp.find(".datagrid-view2 .datagrid-header-row  td:nth-child(" + (m + 1) + ")").css("background", hex2rgb(this.m_fieldColors[i], temp.m_headerrowopacity));
    	        m++;
    	    }
    	    // comp.find(".datagrid-header-row  td:nth-child(" + (i + 1) + ")").css("background", hex2rgb(this.m_fieldColors[i], temp.m_headerrowopacity));
    	}
    } else {
        comp.find(".datagrid-header-row  td").css("background", hex2rgb(convertColorToHex(temp.m_headerchromecolor), temp.m_headerrowopacity));
    }
    
    //$("#"+temp.m_componentid).find(".datagrid-header-row td").css("background", hex2rgb(convertColorToHex(temp.m_headerchromecolor), temp.m_headerrowopacity));//label properties
   
    /**@PerformanceFix: Instead of applying below css on each td div add class on tbody and inherit all the css in td div 
     * This approach avoid extra looping @khivraj*/
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
    comp.find(".datagrid-cell").addClass("datagridTbodycss");
    
    /** Added aggregated row css properties **/
    comp.find(".aggregatedRow .datagrid-cell") .css({
		"font-weight": temp.m_aggregatedrowfontweight,
        "font-size": temp.fontScaling(temp.m_aggregatedrowfontsize) + "px",
        "font-family": selectGlobalFont(temp.m_aggregatedrowfontfamily),
        "font-style": temp.m_aggregatedrowfontstyle,
        "text-decoration": temp.m_aggregatedrowtextdecoration,
        "color": convertColorToHex(temp.m_aggregatedrowfontcolor)
	});
	
	/**footer css  */
	comp.find(".datagrid-footer td .datagrid-cell").css({
		"color": convertColorToHex(temp.m_headerfontcolor),
       "font-weight": temp.m_headerfontweight,
       "font-size": temp.fontScaling(temp.m_headerfontsize) + "px",
       "font-family": selectGlobalFont(temp.m_headerfontfamily),
       "font-style": temp.m_headerfontstyle,
       "text-decoration": temp.m_headertextdecoration
	});
	comp.find(".datagrid-footer-inner").css("border-width", "0");
    
    if (temp.m_labelfontsize > this.getRowHeight(this.m_rowheight)) {
        comp.find(".datagrid-cell").css("height", ((temp.fontScaling(temp.m_labelfontsize) > 15) ? (temp.fontScaling(temp.m_labelfontsize) * 1 + 2) : 17) + "px");
    }
    /**@PerformanceFix: commented below code and add with other css property to avoid extra looping @khivraj*/
    //comp.find(".datagrid-body td").css("height", this.getRowHeight(this.m_rowheight) + "px");
    temp.setHorizontalGridLines(comp);

    comp.find(".datagrid-header").css({"border-width": "0", "background": "transparent"});
    comp.find("div.datagrid-wrap.panel-body.panel-body-noheader").css({
    	"border": hex2rgb("1px solid" + temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity),
    	"border-radius": "0px",
    	"background": "transparent"
    });
    
    /** Header text align property to control column names text align using script for BDD-720 */
    if(!IsBoolean(temp.m_usefieldalign)) {
    	comp.find(".datagrid-header-row td div").css("text-align", temp.m_headertextalign);
    }
    /*
    var headerColor = temp.getDatagridStyles().getHeaderColors();
    comp.find(".datagrid-header").css({
		"background": convertColorToHex(headerColor[0]),
	    "background-color": convertColorToHex(headerColor[0]),
	    "background": "-webkit-linear-gradient(top,"+headerColor[0]+" 0,"+headerColor[1]+" 70%"+headerColor[2]+" 100%)",
	    "background": "-moz-linear-gradient(top,"+headerColor[1]+" 0,"+headerColor[1]+" 70%"+headerColor[2]+" 100%)",
	    "background": "-o-linear-gradient(top,"+headerColor[2]+" 0,"+headerColor[2]+" 70%"+headerColor[2]+" 100%)",
	    "background": "linear-gradient(to bottom ,"+headerColor[0]+" 0,"+headerColor[1]+" 70%"+headerColor[2]+" 100%)",
	    "background-repeat": "repeat-x"
	});  */

    // css for hiding the row numbers which was showing on each row
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
        "border": "none"
    });
    comp.find(".panel.datagrid").css({
    	"border": "0px solid #fff",
    	"padding": "0px",
    	"margin": "0px",
    	"background": "transparent",
    	"box-shadow": "none",
    	"-webkit-box-shadow": "none"
    });
    this.setGridColors();
	comp.find(".datagrid-footer .datagrid-row").css({"height": temp.getRowHeight(temp.m_rowheight) + "px"});
	comp.find(".datagrid-header-row").css("height", temp.getRowHeight(temp.m_rowheight)+"px");
    comp.find(".datagrid-header-row td .datagrid-cell").css("height", ((temp.fontScaling(temp.m_headerfontsize) > 15) ? (temp.fontScaling(temp.m_headerfontsize) * 1 + 2) : 17) + "px"); // header color
	comp.find(".datagrid-footer td .datagrid-cell").css("height", ((temp.fontScaling(temp.m_headerfontsize) > 15) ? (temp.fontScaling(temp.m_headerfontsize) * 1 + 2) : 17) + "px"); // header color
    comp.find(".datagrid-header-row td div").css("text-decoration", "none");
	
    /**@PerformanceFix: commented below css and class for static css property to avoid extra looping @khivraj*/
    if (IsBoolean(this.m_textwrap)) {
    	/*comp.find("td div.datagrid-cell").css({
    		"white-space":"normal",
			"word-wrap": "break-word",
			"height": "auto"
    	}); */
    	comp.find("td div.datagrid-cell").addClass("datagridTextwrapTrue");
        comp.find(".datagrid-header td span").css({
        	"white-space": "normal",
        	"word-wrap": "break-word"
        });
    }else{
    	/*comp.find("td div.datagrid-cell").css({
    		"overflow":"hidden",
			"word-wrap": "break-word"
    	});*/
    	comp.find("td div.datagrid-cell").addClass("datagridTextwrapFalse");
    }
	/** Added for row alignment when text wrap is true */
    var allViewRows = $("#" + temp.m_componentid).find(".datagrid-view1").find(".datagrid-row ");
    var tr = $("#" + temp.m_componentid).find(".datagrid-view2").find(".datagrid-row ");
    allViewRows.each(function(index){
 		var view1RowHeight = $(this).css("height").split('px')[0]*1;//[0].offsetHeight;
		var view2RowHeight = $(tr[index]).css("height").split('px')[0]*1;//[0].offsetHeight;//.css("height");//
		if(view2RowHeight == view1RowHeight){
			//do nothing
		}else if (view2RowHeight > view1RowHeight) {
			$(this).css("height", view2RowHeight);
		} else {
			$(tr[index]).css("height",view1RowHeight);
		}
 	});
    temp.setGridRowHeight();
    
    if(_.contains(this.m_frozenColumnsArr,true)){
    	$("#" + temp.m_componentid).find(".datagrid-view1 div.datagrid-body").css("overflow-y", "hidden");
    }
//    comp.find(".datagrid-header td span.datagrid-sort-icon").css({"float":"right", "position":"absolute"});
    this.applyAdditionalStyles();
};

/** @description setting rows alternative and header color**/
SimpleDataGrid.prototype.setGridColors = function() {
    var temp = this;
    this.setSelectedRowCSS();
    $("#" + temp.m_componentid).find(".datagrid-row").hover(
        function() {
            $(this).css("background", hex2rgb(temp.getDatagridStyles().getRollOverColor(), temp.m_rowhoveropacity));
        },
        function() {
            temp.setSelectedRowCSS({"isMouseOut": true});
        });
    // header hover
    /*	$("#"+temp.m_componentid).find(".datagrid-header-row td").hover(
    function () {
    $(this).css("background", hex2rgb(convertColorToHex(temp.m_headerchromecolor),0.8));
    },
    function () {
    $(this).css("background", hex2rgb(convertColorToHex(temp.m_headerchromecolor),0.8));
    }
    );*/
    //$("#"+temp.m_componentid).find(".datagrid-header").css("background",hex2rgb(convertColorToHex(temp.m_headerchromecolor),0.8));
};

/** @description setting CSS for selected row **/
SimpleDataGrid.prototype.setSelectedRowCSS = function(obj) {
    var temp = this;
    var gridColors = this.getRowAltColors();
    $("#" + temp.m_componentid).find(".datagrid-row").css({
    	"background": hex2rgb(convertColorToHex(gridColors[1]), temp.m_rowopacity)
    	/**row height set again when mouse hover on grid row bcz of this row misaligned **/
    	//"height": temp.getRowHeight(temp.m_rowheight)+"px"
    });
    $("#" + temp.m_componentid).find(".datagrid-row-alt").css("background", hex2rgb(convertColorToHex(gridColors[2]), temp.m_rowopacity));
    if(obj && obj.isMouseOut){
    	$("#" + temp.m_componentid).find(".datagrid-row-selected").css("background", hex2rgb(convertColorToHex(temp.getDatagridStyles().getSelectionColor()), temp.m_rowselectedopacity));
    }else{
    	setTimeout(function() {
    		$("#" + temp.m_componentid).find(".datagrid-row-selected").css("background", hex2rgb(convertColorToHex(temp.getDatagridStyles().getSelectionColor()), temp.m_rowselectedopacity));
    	}, 1);
    }
};
SimpleDataGrid.prototype.setGridRowHeight = function() {
	var temp = this;
	/** added below code for finding the total rows height for adding overflow to datagrid body
	irrespective of text-wrap,most useful when alerts are applied(BDD-619) */
	var allRowsHeight = 0;
	var availableBodyHeight = ((1 * this.m_height) - (1 * this.m_titleHeight) - (1 * this.m_subTitleHeight));
	var allRowsLength = $("#" + temp.m_componentid).find(".datagrid-view2").find(".datagrid-row ");
	var currentRow = $("#" + temp.m_componentid).find(".datagrid-view2").find(".datagrid-row ");
	for (var k = 0; k < allRowsLength; k++) {
		var currentRowHeight = $(currentRow[index])[0].clientHeight;
		allRowsHeight = allRowsHeight + currentRowHeight;
		if((allRowsHeight + temp.m_rowheight * 1) > availableBodyHeight) {
			$("#" + temp.m_componentid).find(".datagrid-body").css("overflow-y", "auto");
			break;
		}
	}
};
SimpleDataGrid.prototype.setHorizontalGridLines = function(comp) {
	var temp = this;
	/** grid horizontal/vertical line color property **/
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
        comp.find(".datagrid-body td").css({
            "border-right": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity),
            "border-bottom": "1px solid " + hex2rgb(temp.getDatagridStyles().getHorizontalGridLineColor(), temp.m_rowlinesopacity),
            "border-width": "0px 1px 1px 0px",
            "height": temp.getRowHeight(temp.m_rowheight) + "px"
        });
        comp.find(".datagrid-body tr").find("td:first").css({
            "border-left": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity),
        });
		/**footer css */
		comp.find(".datagrid-footer td").css({
            "border-top": "1px solid " + hex2rgb(temp.getDatagridStyles().getHorizontalGridLineColor(), temp.m_rowlinesopacity),
            "border-right": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity),
            "border-bottom": "1px solid " + hex2rgb(temp.getDatagridStyles().getHorizontalGridLineColor(), temp.m_rowlinesopacity),
            "border-left": "0px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity)
        });
    } else {
        comp.find(".datagrid-header td").css({
        	"border-right": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity),
			"border-width": "0px 1px 0px 0"
        });
        comp.find(".datagrid-header tr").find("td:first").css({
        	"border-left": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity)
        });
		/**footer css */
		comp.find(".datagrid-footer td").css({
        	"border-right": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity),
			"border-width": "0px 1px 0px 0"
        });
        comp.find(".datagrid-footer tr").find("td:first").css({
        	"border-left": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity)
        });
        comp.find(".datagrid-body td").css({
            "border-right": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity),
            "border-width": "0px 1px 0px 0px",
            "height": temp.getRowHeight(temp.m_rowheight) + "px"
        });
        comp.find(".datagrid-body tr").find("td:first").css({
            "border-left": "1px solid " + hex2rgb(temp.getDatagridStyles().getVerticalGridLineColor(), temp.m_rowlinesopacity),
        });
    }
};
SimpleDataGrid.prototype.getRowAltColors = function() {
	return this.m_alternaterowcolors;
};
SimpleDataGrid.prototype.setRowAltColors = function() {
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
SimpleDataGrid.prototype.getToolTipData = function(mouseX, mouseY) {
    var data = [];
    data[0] = "";
    return data;
};
//# sourceURL=SimpleDataGrid.js
