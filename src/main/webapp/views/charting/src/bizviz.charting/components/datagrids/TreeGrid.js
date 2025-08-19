/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: ScoreCard.js
 * @description Treegrid
 **/
function ScoreCard(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();
	this.plugin = new Plugin();

	this.m_x = 30;
	this.m_y = 300;
	this.m_width = 450;
	this.m_height = 250;
	//this.m_title="";
	this.m_showinfobutton = "";
	this.m_statuscolname = "";
	this.m_gaugeids = "";
	this.m_columnnumbers = "";
	this.m_hierarchylevel = ""; // "Multiple" in case of child, sub-child and sub-sub-child.. i.e. SCORECARD and "Single" in case of p-id and c-id i.e. "TREEGRID".
	this.m_url = "";

	this.m_textselectedcolor = "";
	this.m_textrollovercolor = "";
	this.m_rollovercolor = "";
	this.m_gridcolor = "";
	this.m_alternaterowscolor;
	this.m_horizontalgridlinecolor = "";
	this.m_verticalgridlinecolor = "";
	this.m_showhorizontalgridlines = "";
	this.m_selectedrowcolor = "";

	// for title..
	this.m_fontcolor = "";
	this.m_fontsize = "";
	this.m_fontstyle = "";
	this.m_textdecoration = "";
	this.m_fontweight = "";
	this.m_fontfamily = "";
	this.m_align = "";

	this.m_labelfontcolor = "#000000";
	this.m_labelfontstyle = "normal";
	this.m_labelfontfamily = "Roboto";
	this.m_labeltextdecoration = "normal";
	this.m_labelfontsize = "11";
	this.m_labelfontweight = "normal";

	this.m_globalkey = "";
	this.m_gradientcolor = "#7e8989,#636d6d";
	this.m_showborder = "true";
	this.m_showstatus = "";
	this.m_id = "";
	this.m_showexceldownload = "true";
	this.m_name = "";
	this.m_showgradient = "true";
	this.m_toprootnode = "false";
	this.m_showtitle = false;
	this.m_alertwithdata = "";
	this.m_titleHeight = 0;
	this.m_subTitleHeight = 0;
	this.m_bggradientrotation = "0";
	this.m_bgalpha = "1";
	this.m_bggradients = "#ffffff";
	this.m_title = "";
	this.m_treefield = "";
	this.m_isRowClicked = false;
	this.m_showExcelDownload = true;
	this.m_declinefillcolor = "#ffffff";

	this.m_fieldsObj = new Object();
	this.m_alertObj = new Object();

	this.m_alertcolor = [];
	this.m_percentvalue = [];
	this.m_compareindex = [];
	this.m_fieldNameValueMap = [];

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;

	this.m_title1 = new Title(this);
	this.m_subTitle = new SubTitle();
	this.m_chartFrame = new ChartFrame();
	this.m_alerts = new Alerts();

	// export to ppt property
	this.m_pptheading = "Heading";
	this.m_exportbuttontooltip = "Export to PDF";
	/** Show data for scorecard is not relevant **/
	this.m_exporttogrid = false;
	this.m_mode = "pdf";
	this.m_pptsubheading = "SubHeading";
	this.m_filename = "";

	this.m_isDataSetavailable = false; //for tooltip in design mode
	this.m_isEmptySeries = true;

	// latest header attributes of .bizviz files
	this.m_headerchromecolor = "#0daea7";
	this.m_headertextdecoration = "normal";
	this.m_headerfontfamily = "Roboto";
	this.m_headerfontsize = "12";
	this.m_headerfontstyle = "normal";
	this.m_headerfontweight = "bold";
	this.m_headerfontcolor = "#ffffff";
	this.m_headerSymbolColor = "#000000";

	this.m_alerttype = "";
	this.m_hierarchyTypeArr = [];
	//array for fields info..
	this.m_colHeadersFieldName = [];
	this.m_gridheaderDisplayNames = [];
	this.fieldNameArr = [];

	this.m_visibleArr = [];
	this.m_widthArr = [];
	this.m_textAlignArr = [];
	this.m_tooltipColumnsArr = [];
	this.m_sortingColumnsArr = []; // added to show sorting or not at column level
	this.m_numberFormatColumnsArr = [];
	this.m_numberFormaterSorting = {};

	this.m_isNumericArr = [];
	this.m_isFixedLabelArr = [];
	this.m_formatterArr = [];
	this.m_unitNameArr = [];
	this.m_signPositioneArr = [];
	this.m_precisionArr = [];
	this.m_secondFormatterArr = [];
	this.m_secondUnitNameArr = [];
	this.m_fieldaggregation = [];
	this.m_fieldColors = {};
	this.m_designModeDrawingFlag = true;
	this.defaultAlertJson = '{"AlertColumn": [{"mode": "Range","showTooltip": "false","texts": "r,g,b", "alertPosition": "right","showData": "true","fixedValue": "413892","fixedValueCompare": "true","name": "Revenue","isAlertText": "false","alertType": "colorfill","colors": "#db5937,#f9ad39,#2382b5","compareColumn":"","ranges":"0~3,3~15,15~100" },{"mode": "Comparison","showTooltip": "false","texts": "r,g,b", "alertPosition": "right","showData": "false","fixedValue": "5","fixedValueCompare": "true","name": "Indicator","isAlertText": "false","alertType": "arrow","colors": "#db5937,#f9ad39,#2382b5","compareColumn":"","ranges":"" }]}';
	this.finalArray = [];
	this.m_selectedCellInfo={};
	this.columnWiseData = {};
	this.fieldsData = "";
	this.m_collapseallnode = false;
	this.m_commaSeperatorFlag = false;
	
	this.m_scrollbarsize = 7;
	this.m_defaultalertcolor = "#e0dfdf";
	/**Properties added for introducing opacity in Grid*/
    this.m_rowopacity = 0.8;
    this.m_headerrowopacity = 0.6;
    this.m_rowhoveropacity = 0.4;
    this.m_rowselectedopacity = 0.6;
    this.m_rowlinesopacity = 0.8;
    this.m_fitcolumns = "true"; //added to fit all columns in the available component width
    this.m_usefieldalign = true;
    this.m_headertextalign = "left";
    this.m_enableColumnStyleArr = [];
    this.m_fontColorArr = [];
    this.m_fontSizeArr = [];
    this.m_fontStyleArr = [];
    this.m_fontWeightArr = [];
    this.m_fontFamilyArr = [];
    this.m_titletextwrap = true;
    this.m_subtitletextwrap = true;
};

/** @description Making prototype of Widget class and inheriting Method and property into ScoreCard**/
ScoreCard.prototype = new Widget;

/** @description This method will parse the ScoreCard JSON and create a container **/
ScoreCard.prototype.setProperty = function (gridJson) {
	this.ParseJsonAttributes(gridJson.Object, this);
	//	this.init();	//create draggable div
	this.initCanvas();
};

/** @description Iterate through Grid JSON and set class variable values with JSON values **/
ScoreCard.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "Scorecard") {
			for (var chartKey in jsonObject[key]) {
				switch (chartKey) {
				case "TitleWindow":
					break;
				case "SubTitle":
					for (var subTitleKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(subTitleKey);
						nodeObject.m_subTitle[propertyName] = jsonObject[key][chartKey][subTitleKey];
					}
					break;
				case "SummaryRows":
					break;
				case "value":
					break;
				case "Alerts":
					if (this.m_designMode){
						this.parseDefaultAlertJson($.parseJSON(this.defaultAlertJson), nodeObject);
					}else {
						for (var alertsKey in jsonObject[key][chartKey]) {
							if (alertsKey == "AlertColumn") {
								var alertJson = jsonObject[key][chartKey];
								var alertColumnJsonArray = this.getArrayOfSingleLengthJson(alertJson.AlertColumn);
								for (var i = 0; i < alertColumnJsonArray.length; i++) {
									var alertColumnObj = new AlertColumn();
									nodeObject.m_alerts.setAlertColumns(alertColumnObj);
									var fieldname = this.getProperAttributeNameValue(alertColumnJsonArray[i], "name");
									this.m_alertObj[this.getStringARSC(fieldname)] = alertColumnObj;
									for (var attribute in alertColumnJsonArray[i]) {
										this.setAttributeValueToNode(attribute, alertColumnJsonArray[i], alertColumnObj);
									}
								}
							}
						}
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

/** @description Parse Alert Json when design mode is active**/
ScoreCard.prototype.parseDefaultAlertJson = function (json, nodeObject) {
	for (var alertsKey in json) {
		if (alertsKey == "AlertColumn") {
			var alertJson = json;
			var alertColumnJsonArray = this.getArrayOfSingleLengthJson(alertJson.AlertColumn);
			for (var i = 0, length = alertColumnJsonArray.length; i < length; i++) {
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
};

/** @description Getter of DataProvider **/
ScoreCard.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description Getting data from JSON and putting into the array and when getting undefined as data than replacing undefined with blank string and pushing into array **/
ScoreCard.prototype.getDataFromJSON = function () {
	var data = [];
	for (var i = 0, length = this.getDataProvider().length; i < length; i++) {
		if (this.getDataProvider()[i] == undefined || this.getDataProvider()[i] == "undefined"){
			data[i] = "";
		}else{
			/**check sjon sctring */
				data[i] = this.getDataProvider()[i];
		}
	}
	return data;
};

/** @description Getter of Object Type **/
ScoreCard.prototype.getType = function () {
	return this.m_objecttype;
};

/** @description Set field JSON into class variable **/
ScoreCard.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	this.setSeries(fieldsJson);
};

/** @description  Field attribute will set in the sequence of parent,Child,None heirarchy**/
ScoreCard.prototype.setSeries = function (fieldsData) {
	this.fieldsData = fieldsData;
	this.m_hierarchyTypeArr = [];
	this.m_colHeadersFieldName = []
	this.m_gridheaderDisplayNames = [];
	this.fieldNameArr = [];
	this.legendMap = {};
	this.fieldName = [];
	this.m_displayAllFieldName = [];
	this.m_seriesVisibleArr = {};
	this.m_typeArr = {};
	
	this.m_visibleArr = {};
	this.m_widthArr = {};
	this.m_textAlignArr = {};
	this.m_sortingColumnsArr = {};
	this.m_tooltipColumnsArr = {};
	this.m_numberFormatColumnsArr = {};

	this.m_isNumericArr = {};
	this.m_cellTypeArr = [];
	this.m_isFixedLabelArr = {};

	this.m_formatterArr = {};
	this.m_unitNameArr = {};
	this.m_signPositioneArr = {};
	this.m_precisionArr = {};
	this.m_secondFormatterArr = {};
	this.m_secondUnitNameArr = {};
	this.m_fieldaggregation = {};
	this.m_TooltipFieldsArr = {};
	
	this.m_enableColumnStyleArr = [];
	this.m_fontColorArr = [];
	this.m_fontSizeArr = [];
	this.m_fontStyleArr = [];
	this.m_fontWeightArr = [];
	this.m_fontFamilyArr = [];
	var j = 0;
	for (var i = 0, len = fieldsData.length; i < len; i++) {
		this.fieldName[j] = this.getProperAttributeNameValue(fieldsData[i], "Name");
		var m_formattedDescription = this.formattedDescription(this, this.getProperAttributeNameValue(fieldsData[i], "DisplayName"));
		this.m_displayAllFieldName[j] = m_formattedDescription;
		this.m_seriesVisibleArr[this.fieldName[j]] = this.getProperAttributeNameValue(fieldsData[i], "visible");
		if ((this.m_hierarchylevel == "Single" || this.m_hierarchylevel == "TreeWithPivot") || IsBoolean(this.getProperAttributeNameValue(fieldsData[i], "visible"))) {
			if (this.getProperAttributeNameValue(fieldsData[i], "hierarchyType") == "parent") {
				this.setSeriesJsonProp(fieldsData, i, j);
				j++;
				break;
			}
		}
	}
	for (var i = 0, length = fieldsData.length; i < length; i++) {
		this.fieldName[j] = this.getProperAttributeNameValue(fieldsData[i], "Name");
		var m_formattedDescription = this.formattedDescription(this, this.getProperAttributeNameValue(fieldsData[i], "DisplayName"));
		this.m_displayAllFieldName[j] = m_formattedDescription;
		this.m_seriesVisibleArr[this.fieldName[j]] = this.getProperAttributeNameValue(fieldsData[i], "visible");
		if ((this.m_hierarchylevel == "Single" || this.m_hierarchylevel == "TreeWithPivot") || IsBoolean(this.getProperAttributeNameValue(fieldsData[i], "visible"))) {
			if (this.getProperAttributeNameValue(fieldsData[i], "hierarchyType") == "child") {
				this.setSeriesJsonProp(fieldsData, i, j);
				j++;
			}
		}
	}
	for (var i = 0, length1 = fieldsData.length; i < length1; i++) {
		this.fieldName[j] = this.getProperAttributeNameValue(fieldsData[i], "Name");
		var m_formattedDescription = this.formattedDescription(this, this.getProperAttributeNameValue(fieldsData[i], "DisplayName"));
		this.m_displayAllFieldName[j] = m_formattedDescription;
		this.m_seriesVisibleArr[this.fieldName[j]] = this.getProperAttributeNameValue(fieldsData[i], "visible");
		//if (this.m_hierarchylevel == "Single" || IsBoolean(this.getProperAttributeNameValue(fieldsData[i], "visible"))) {
			if (this.getProperAttributeNameValue(fieldsData[i], "hierarchyType") == "none") {
				this.setSeriesJsonProp(fieldsData, i, j);
				j++;
			}
		//}
	}
    this.setLegendsIntialLoad(this.m_defaultlegendfields);
};

/** @description creating array for each property of fields and storing in arrays **/
ScoreCard.prototype.setSeriesJsonProp = function (fieldsData, i, j) {
	this.m_hierarchyTypeArr[j] = this.getProperAttributeNameValue(fieldsData[i], "hierarchyType");

	this.m_colHeadersFieldName[j] = this.getProperAttributeNameValue(fieldsData[i], "Name");
	var m_formattedDescription = this.formattedDescription(this, this.getProperAttributeNameValue(fieldsData[i], "DisplayName"));
    this.m_gridheaderDisplayNames[j] = m_formattedDescription;
	this.fieldNameArr[j] = this.getProperAttributeNameValue(fieldsData[i], "Name");
	
	this.m_typeArr[this.m_colHeadersFieldName[j]] = this.getProperAttributeNameValue(fieldsData[i], "hierarchyType");
	
	this.m_visibleArr[this.m_colHeadersFieldName[j]] = ((this.m_hierarchylevel == "Single" || this.m_hierarchylevel == "TreeWithPivot") && this.m_hierarchyTypeArr[j]=="child")?"false" : this.getProperAttributeNameValue(fieldsData[i], "visible");
	this.m_widthArr[this.m_colHeadersFieldName[j]] = this.getProperAttributeNameValue(fieldsData[i], "width");
	this.m_textAlignArr[this.fieldNameArr[j]] = this.getProperAttributeNameValue(fieldsData[i], "textAlign");
	this.m_tooltipColumnsArr[this.fieldNameArr[j]] = this.getProperAttributeNameValue(fieldsData[i], "showTooltip");

	 /**To support dashbord when we are publishing it directly without opening in design mode**/
    var cellType = this.getProperAttributeNameValue(fieldsData[i], "cellType");
    var sorting = this.getProperAttributeNameValue(fieldsData[i], "sorting");
    var numberFormatter = this.getProperAttributeNameValue(fieldsData[i], "numberFormatter");
    if(cellType == undefined){
    	cellType = IsBoolean(fieldsData[i].isNumeric)?"Numeric":"none";
    }
    this.m_cellTypeArr[j] = cellType;
    this.m_isNumericArr[this.fieldNameArr[j]] = cellType;
    this.m_sortingColumnsArr[this.fieldNameArr[j]] = (sorting == undefined) ? true : IsBoolean(sorting);
    this.m_numberFormatColumnsArr[this.fieldNameArr[j]] = (numberFormatter == undefined) ? "none" : numberFormatter;
    this.m_numberFormaterSorting[this.getStringARSC(this.fieldNameArr[j])] = (numberFormatter == undefined) ? "none" : numberFormatter;
	
	this.m_isFixedLabelArr[this.fieldNameArr[j]] = this.getProperAttributeNameValue(fieldsData[i], "isfixedlabel");

	this.m_formatterArr[this.fieldNameArr[j]] = this.getProperAttributeNameValue(fieldsData[i], "formatter");
	this.m_unitNameArr[this.fieldNameArr[j]] = this.getProperAttributeNameValue(fieldsData[i], "unitname");
	this.m_signPositioneArr[this.fieldNameArr[j]] = this.getProperAttributeNameValue(fieldsData[i], "signposition");
	this.m_precisionArr[this.fieldNameArr[j]] = this.getProperAttributeNameValue(fieldsData[i], "precision");
	this.m_secondFormatterArr[this.fieldNameArr[j]] = this.getProperAttributeNameValue(fieldsData[i], "secondformatter");
	this.m_secondUnitNameArr[this.fieldNameArr[j]] = this.getProperAttributeNameValue(fieldsData[i], "secondunitname");
	this.m_fieldaggregation[this.fieldNameArr[j]] = (this.getProperAttributeNameValue(fieldsData[i], "parentAggregation") === undefined) ? "none" : this.getProperAttributeNameValue(fieldsData[i], "parentAggregation");
	this.m_fieldColors[this.getStringARSC(this.fieldNameArr[j])] = this.getProperAttributeNameValue(fieldsData[i], "Color");
	var tooltipFieldName = (this.getProperAttributeNameValue(fieldsData[i], "tooltipField") !== undefined && this.getProperAttributeNameValue(fieldsData[i], "tooltipField") !== "") ? (this.getProperAttributeNameValue(fieldsData[i], "tooltipField")) : this.m_colHeadersFieldName[j];
	this.m_TooltipFieldsArr[this.m_colHeadersFieldName[j]] = tooltipFieldName.split(",");
	
	this.m_enableColumnStyleArr[j] = this.getProperAttributeNameValue(fieldsData[i], "enableColumnStyle");
	this.m_fontColorArr[j] = this.getProperAttributeNameValue(fieldsData[i], "fontColor");
	this.m_fontSizeArr[j] = this.getProperAttributeNameValue(fieldsData[i], "fontSize");
	this.m_fontStyleArr[j] = this.getProperAttributeNameValue(fieldsData[i], "fontStyle");
	this.m_fontWeightArr[j] = this.getProperAttributeNameValue(fieldsData[i], "fontWeight");
	this.m_fontFamilyArr[j] = this.getProperAttributeNameValue(fieldsData[i], "fontFamily");

	var tempMap = {
			"seriesName" : this.m_colHeadersFieldName[j],
			"displayName" : this.m_gridheaderDisplayNames[j],
			"color" : this.m_fieldColors[j],
			//"shape" : this.m_plotShapeArray[j],
			"fieldName" : this.fieldNameArr[j],
			"width": this.m_widthArr[this.m_colHeadersFieldName[j]],
			"textAlign" : this.m_textAlignArr[this.fieldNameArr[j]],
			"toolTipColumn": this.m_tooltipColumnsArr[this.fieldNameArr[j]],
			"numeric" : this.m_isNumericArr[this.fieldNameArr[j]],
			"sorting" : this.m_sortingColumnsArr[this.fieldNameArr[j]],
			"numberFormatter": this.m_numberFormatColumnsArr[this.fieldNameArr[j]],
			"cellType": this.m_cellTypeArr[j],
			"fixedLabel" : this.m_isFixedLabelArr[this.fieldNameArr[j]],
			"formatter" : this.m_formatterArr[this.fieldNameArr[j]],
			"unitName" : this.m_unitNameArr[this.fieldNameArr[j]],
			"signPosition" : this.m_signPositioneArr[this.fieldNameArr[j]],
			"precision" : this.m_precisionArr[this.fieldNameArr[j]],
			"secondFormatter" : this.m_secondFormatterArr[this.fieldNameArr[j]],
			"secondUnitName" : this.m_secondUnitNameArr[this.fieldNameArr[j]],
			"type" : this.m_hierarchyTypeArr[j],
/** added condition to check the visible field of associate chart **/
			"visible" : this.m_seriesVisibleArr[this.fieldNameArr[j]],
			"enableColumnStyle": this.m_enableColumnStyleArr[j],
			"fontColor": this.m_fontColorArr[j], 
			"fontSize": this.m_fontSizeArr[j],
			"fontStyle": this.m_fontStyleArr[j],
			"fontWeight": this.m_fontWeightArr[j],
			"fontFamily": this.m_fontFamilyArr[j],

			"index": j
	};
	this.legendMap[this.m_colHeadersFieldName[j]] = tempMap;
};
ScoreCard.prototype.getLegendInfo = function() {
    var tempMap = {};
    for (var key in this.legendMap) {
    	/** added condition to check the visible field of associate chart **/
        if ((this.legendMap[key].type != "parent") && IsBoolean(this.legendMap[key].visible)){
            if (IsBoolean((this.m_hierarchylevel == "Multiple") || ((this.m_hierarchylevel == "Single" || this.m_hierarchylevel == "TreeWithPivot") && this.legendMap[key].type != "child"))) {
                tempMap[key] = this.legendMap[key];
            }
        }
    };
    return tempMap;
};

/** @description Getter of all Field Name **/
ScoreCard.prototype.getAllFieldsName = function () {
	return this.fieldName;
};

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
ScoreCard.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description  Will create an id for component to be used for dashboard operation management**/
ScoreCard.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];

	this.m_componentid = "dataGridDiv" + this.m_objectid;

};

/** @description  initialization of draggable div and its inner Content **/
ScoreCard.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);

	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/** @description  calling init and drawChart of Scorecard **/
ScoreCard.prototype.draw = function () {
	this.init();
	this.drawChart();
	if (this.plugin != undefined && this.plugin != null) {
		this.plugin.initPlugin(this);
	}
	if(this.m_onafterrendercallback != ""){
		onAfterRender(this.m_onafterrendercallback);
	}
};

/** @description Setting Visibility as visible**/
ScoreCard.prototype.showWidget = function () {
	var temp = this;
	this.visibilityStatus = true;
	$("#draggableDiv" + temp.m_objectid).css("display", "block");
	if (IsBoolean(this.m_isDataSetavailable)) {
	/*DAS-837 Component was visible when data service load at start is off */
		/*this.init();*/
		this.drawChart();
	}
};

/** @description Setting Visibility as hidden **/
ScoreCard.prototype.hideWidget = function () {
	var temp = this;
	this.visibilityStatus = false;
	$("#draggableDiv" + temp.m_objectid).css("display", "none");
};

/** @description drawing of Frame and Title **/
ScoreCard.prototype.drawObject = function () {
	this.ctx.clearRect(this.m_x, this.m_y, this.m_width, this.m_height);
	this.m_chartFrame.init(this);
	this.m_chartFrame.drawFrame();
	this.setTitleProperties();
	this.m_title1.init(this);
	this.m_title1.draw();
	this.drawMessage(this.m_status.noData);
};
ScoreCard.prototype.drawMessage = function (text) {
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
/** @description Initialization of title,subtitle,chartFrame,Scorecard **/
ScoreCard.prototype.init = function () {
	this.setTitleProperties();
	this.m_title1.init(this);
	this.m_subTitle.init(this);
	this.m_chartFrame.init(this);

	this.m_seriesData = this.getDataFromJSON();
	this.setVisibleFieldData();
	this.isSeriesDataEmpty();
	this.isEmptyField()
	this.isVisibleField();
	if (!IsBoolean(this.m_isEmptyField)){
		//this.setColumnHeads();
		if (this.m_hierarchylevel == "Multiple") {
			this.setParentIDs();
			this.updateVisibleArrObject();
		} else if (this.m_hierarchylevel == "TreeWithPivot"){
			this.m_gridHeaderNames = this.m_gridheaderDisplayNames;
			this.m_gridFieldNames = this.m_colHeadersFieldName;
			this.setTreeField();
			this.setIdField();
			this.setParentIDName();
			this.updateVisibleArrObject();
			this.setFixedField();
			this.setDynamicHeader();
		} else {
			this.m_gridHeaderNames = this.m_gridheaderDisplayNames;
			this.m_gridFieldNames = this.m_colHeadersFieldName;
			this.setTreeField();
			this.setIdField();
			this.setParentIDName();
			/**Added for update visible array when using legend comp (update only none type fields) */
			this.updateVisibleArrObjectForSingleType();
		}
		this.setToolTipArray();
		this.createDatagrid();
	}else{
		var temp = this;
		$("#" + temp.m_componentid).remove();
	}
};

/** @description update flag **/
ScoreCard.prototype.setCommaSeperatorFlag = function () {
	for(var i = 0 ; i < this.dataField.length ; i++){
		if(IsBoolean(this.m_visibleArr[this.dataField[i]]) && this.m_typeArr[this.dataField[i]] == "none" && this.m_fieldaggregation[this.dataField[i]] == "none"){
			this.m_commaSeperatorFlag = true;
			break;
		}
	}
};

ScoreCard.prototype.updateVisibleArrObject = function () {
	for(var key in this.m_visibleArr){
		if(this.m_seriesVisibleArr[key]!=undefined){
			this.m_visibleArr[key] = this.m_seriesVisibleArr[key];
		}
	}
};

ScoreCard.prototype.updateVisibleArrObjectForSingleType = function () {
	for(var key in this.m_visibleArr){
		if(this.m_seriesVisibleArr[key] != undefined && this.m_typeArr[key] != "child" && this.m_typeArr[key] != "parent"){
			this.m_visibleArr[key] = this.m_seriesVisibleArr[key];
		}
	}
};

ScoreCard.prototype.setVisibleFieldData = function () {
	this.m_gridheaderDisplayNames = [];
	this.m_colHeadersFieldName = [];
	this.m_widthArr = {};
	this.m_textAlignArr = {};
	this.m_tooltipColumnsArr = {};
	this.m_numberFormatColumnsArr = {};
	this.m_isNumericArr = {};
	this.m_isFixedLabelArr = {};
	this.m_formatterArr = {};
	this.m_unitNameArr = {};
	this.m_signPositioneArr = {};
	this.m_precisionArr = {};
	this.m_secondFormatterArr = {};
	this.m_secondUnitNameArr = {};
	this.m_fieldColor = [];
	this.m_hierarchyTypeArr = [];
	this.m_enableColumnStyleArr = [];
	this.m_fontColorArr = [];
	this.m_fontSizeArr = [];
	this.m_fontStyleArr = [];
	this.m_fontWeightArr = [];
	this.m_fontFamilyArr = [];
	for(var key in this.legendMap){
		/**Added below condition this.m_hierarchylevel == "Single" to enable hierarchy when parent and child node is invisible and pass invisible field in drill object */
		if(this.m_hierarchylevel == "Single" || this.m_hierarchylevel == "TreeWithPivot" || IsBoolean(this.m_seriesVisibleArr[key])){
			this.m_colHeadersFieldName.push(this.legendMap[key].seriesName)
			this.m_gridheaderDisplayNames.push(this.legendMap[key].displayName);
			this.m_fieldColor.push(this.legendMap[key].color);		
			this.m_widthArr[this.legendMap[key].seriesName] =  this.legendMap[key].width;
			this.m_textAlignArr[this.legendMap[key].fieldName] = this.legendMap[key].textAlign;
			this.m_tooltipColumnsArr[this.legendMap[key].fieldName]  = this.legendMap[key].toolTipColumn;
			this.m_numberFormatColumnsArr[this.legendMap[key].fieldName] = this.legendMap[key].numberFormatter;
			this.m_isNumericArr[this.legendMap[key].fieldName] = this.legendMap[key].cellType;
			this.m_isFixedLabelArr[this.legendMap[key].fieldName] = this.legendMap[key].fixedLabel;
			this.m_formatterArr[this.legendMap[key].fieldName] = this.legendMap[key].formatter;
			this.m_unitNameArr[this.legendMap[key].fieldName] = this.legendMap[key].unitName;
			this.m_signPositioneArr[this.legendMap[key].fieldName] = this.legendMap[key].signPosition;
			this.m_precisionArr[this.legendMap[key].fieldName] = this.legendMap[key].precision;
			this.m_secondFormatterArr[this.legendMap[key].fieldName] = this.legendMap[key].secondFormatter;
			this.m_secondUnitNameArr[this.legendMap[key].fieldName] = this.legendMap[key].secondUnitName;
			this.m_hierarchyTypeArr.push(this.legendMap[key].type);
			this.m_enableColumnStyleArr.push(this.legendMap[key].enableColumnStyle);
			this.m_fontColorArr.push(this.legendMap[key].fontColor);
			this.m_fontSizeArr.push(this.legendMap[key].fontSize);
			this.m_fontStyleArr.push(this.legendMap[key].fontStyle);
			this.m_fontWeightArr.push(this.legendMap[key].fontWeight);
			this.m_fontFamilyArr.push(this.legendMap[key].fontFamily);
		}
	}
};
/** @description Setter of tooltip values for all columns **/
ScoreCard.prototype.setToolTipArray = function () {
	for(var i = 0, length = this.m_colHeadersFieldName.length; i < length; i++){
		if(_.contains(this.m_hierarchyTypeArr, "parent") || _.contains(this.m_hierarchyTypeArr, "child")){
			if(this.m_tooltipColumnsArr["name"] !== true && (this.m_hierarchyTypeArr[i] == "parent" || this.m_hierarchyTypeArr[i] == "child")) {
				this.m_tooltipColumnsArr["name"] = this.m_tooltipColumnsArr[this.m_colHeadersFieldName[i]];
				this.m_sortingColumnsArr["name"] = this.m_sortingColumnsArr[this.m_colHeadersFieldName[i]];
				this.m_numberFormatColumnsArr["name"] = this.m_numberFormatColumnsArr[this.m_colHeadersFieldName[i]];
				this.m_TooltipFieldsArr["name"] = this.m_TooltipFieldsArr[this.m_colHeadersFieldName[i]];
			}
		}
	}
};

/** @description Getter of BgGradients **/
ScoreCard.prototype.getBgGradients = function () {
	return this.m_bggradients;
};

/** @description creation of Div and Table ,Table is appended into div and setting CSS property **/
ScoreCard.prototype.createDatagrid = function () {
	var temp = this;
	this.m_titleHeight = (IsBoolean(this.m_title1.m_showtitle) || IsBoolean(this.m_showgradient) || IsBoolean(this.m_showmaximizebutton)) ? this.m_title1.m_titleBarHeight : 0;
	//this.m_subTitleHeight = (IsBoolean(this.m_subTitle.m_showsubtitle) && this.m_subTitle.getDescription() != "") ? (this.m_subTitle.m_formattedDescription.length * this.m_subTitle.getFontSize() * 1.85) : 0;
	this.m_subTitleHeight = (IsBoolean(this.m_subTitle.m_showsubtitle) && this.m_subTitle.getDescription() != "") ? IsBoolean(this.m_enablehtmlformate.subtitle) ? (((this.m_subTitle.getDescription().match(/<br\s*\/?>/g) || []).length + 1) * this.m_subTitle.getFontSize() * 1.5) : (this.m_subTitle.m_formattedDescription.length * this.m_subTitle.getFontSize() * 1.5) : 0;
	if (this.m_designModeDrawingFlag) {
		$("#" + temp.m_componentid).remove();
		var dataGridDiv = document.createElement("div");
		dataGridDiv.setAttribute("id", temp.m_componentid);
		$("#draggableDiv" + temp.m_objectid).append(dataGridDiv);
		$("#draggableDiv" + temp.m_objectid).append(dataGridDiv);

		var tableObj = document.createElement("table");
		tableObj.setAttribute("id", "HierarchicalDGTable" + temp.m_objectid);
		$("#draggableDiv" + temp.m_objectid).append(tableObj);
		dataGridDiv.appendChild(tableObj);
	}
	$("#" + temp.m_componentid).css({
		"left": 1 * (this.m_x) + 1 + "px",
		"top": 1 * (this.m_y) + 1 * (this.m_titleHeight) + 1 * this.m_subTitleHeight + 1 + "px",
		"position": "absolute"
	});

	$("#HierarchicalDGTable" + temp.m_objectid).css("width", this.m_width - 1 + "px");
	$("#HierarchicalDGTable" + temp.m_objectid).css("height", 1 * (this.m_height) - 1 * (this.m_titleHeight) - 1 * this.m_subTitleHeight + "px");
};

/** @description Setting Title Font Style  **/
ScoreCard.prototype.setTitleProperties = function () {
	this.m_title1.m_fontsize = this.m_fontsize;
	this.m_title1.m_fontweight = this.m_fontweight;
	this.m_title1.m_fontfamily = selectGlobalFont(this.m_fontfamily);
	this.m_title1.m_fontstyle = this.m_fontstyle;
	this.m_title1.m_fontcolor = this.m_fontcolor;
	this.m_title1.m_textdecoration = this.m_textdecoration;
	this.m_title1.m_align = this.m_align;
	this.m_title1.m_description = this.m_title;
	this.m_title1.m_showtitle = this.m_showtitle;
	this.m_title1.m_titlebarheight = (this.m_titlebarheight !== undefined) ? this.m_titlebarheight : 25;
	this.m_gradientcolorsArray;
};
ScoreCard.prototype.getRowHeight = function(m_rowheight) {
	return this.fontScaling( (m_rowheight == undefined || m_rowheight === "" || m_rowheight == "0") ? 25 : m_rowheight );
};
/** @description initialize the DataGrid Alerts Calculation **/
ScoreCard.prototype.initDataGridAlerts = function () {
	for(var key in this.getAlertObj()){
		if(this.getAlertObj()[key]){
			this.getAlertObj()[key].init(this);
		}
	}
};
/** @description Drawing of chartFrame,title,subtitle and scorecard**/
ScoreCard.prototype.drawChart = function () {
	this.createCanvasForDynamicRangeAlert();
	this.m_chartFrame.drawFrame();
	this.m_title1.draw();
	this.m_subTitle.draw();
	this.drawLegends();
	this.getHierarchcy(this.legendMap);
	var map = this.IsDrawingPossible();
	if (IsBoolean(map.permission)) {
		/**DAS-1158 */
		if(this.m_seriesData.length>0){
		if (this.m_hierarchylevel == "TreeWithPivot" && IsBoolean(this.IsDrawingPossibleOfTreePivot().permission)) {
			this.drawTreeGridWithPivot();
		} else {
				this.drawTreeGrid();
			}
		}else{
			this.drawMessage(this.m_status.noData);
		}
	} else {
		this.drawMessage(map.message);
	}	
};

ScoreCard.prototype.getHierarchcy = function(legmap){
	this.m_hieraryFields = [];
	for(var key in legmap){
		if(legmap[key].type == "child" || legmap[key].type == "parent"){
			this.m_hieraryFields.push(legmap[key]);
		}
	}
}
ScoreCard.prototype.drawLegends = function () {
	this.drawChartLegends();
	this.drawLegendComponent();
}; 

ScoreCard.prototype.drawChartLegends = function () {
/*	var temp = this;
	if (IsBoolean(this.getShowLegends())) {
		this.drawLegendIcon();
		if (!IsBoolean(this.m_designMode))
			this.drawLegendContentDiv();
	} else {
		$("#legendIcon" + temp.m_objectid).remove();
	}*/
};
/** @description this methods checks the series data is available or not **/
ScoreCard.prototype.isSeriesDataAvailable = function(legendObj) {
	if(IsBoolean(legendObj.associatedChartObject.m_isrepeater)){
		return true;
	}else{
		if (legendObj.associatedChartObject && legendObj.associatedChartObject.m_seriesData && legendObj.associatedChartObject.m_seriesData.length > 0) {
			return true;
		} else {
			return false;
		}
	}
};
ScoreCard.prototype.drawLegendComponent = function () {
	if (!IsBoolean(this.m_designMode)) {
		var legendObj = this.getLegendComponentObj();
		if (legendObj != undefined && IsBoolean(this.isSeriesDataAvailable(legendObj))) {
			legendObj.drawObject();
		} else {
			if (legendObj != undefined)
			$("#LegendContainerDiv" + legendObj.m_objectid).remove();
		}
	}
};

ScoreCard.prototype.getLegendComponentObj = function () {
	if (this.m_associatedlegendid != "" && IsBoolean(!this.m_designMode)) {
		for (var i = 0, length = this.m_dashboard.m_widgetsArray.length; i < length; i++) {
			if (this.m_associatedlegendid == this.m_dashboard.m_widgetsArray[i].m_objectid) {
				return this.m_dashboard.m_widgetsArray[i];
			}
		}
	}
};

ScoreCard.prototype.drawTreeGrid = function(){
	var temp = this;
	this.setColumnWidth();
	this.xyz = this.m_seriesData;
	this.setColumnHeads();
	this.initDataGridAlerts();
	var fitColumnsValue = IsBoolean(this.m_designMode) ? true : IsBoolean(this.m_fitRemainingColumns);
	if (this.m_designModeDrawingFlag) {
		if (this.m_designMode) {
			this.m_designModeDrawingFlag = false;
		} else {
			this.m_designModeDrawingFlag = true;
		}
		
		$("#HierarchicalDGTable" + temp.m_objectid).treegrid({
			idField : temp.getIdField(),
			columns : [temp.columnHeads],
			treeField : temp.getTreeField(),
			data : temp.getTableData(),
			singleSelect : true,
			collapsible : true,
			rownumbers : false,
			remoteSort : false,
			fitColumns : fitColumnsValue,
			showHeader : true,
			showFooter : false,
			nowrap : !IsBoolean(temp.m_textwrap),
			loadMsg : "",
			loading : false,
			loaded : false,
			striped : true,
			//lines: true,
			//groupField:temp.getTreeField(),
			//sortName : temp.m_gridheaderNames[0],
			sortOrder : "asc",
			state : closed,
			scrollbarSize : 0,
			groupFormatter : function (value, rows) {
				return value;
			},
			onSortColumn : function (sort, order) {
				$("span").removeClass("tree-icon tree-folder tree-folder-open");
				$("span").removeClass("tree-file");
			},
			onClickRow : function () {
				temp.m_isRowClicked = true;
				var fieldNameValueMap = temp.getFieldNameValueMap();
				for(var i=0; i<temp.fieldNameArr.length; i++){
					if (temp.fieldNameArr[i] === temp.m_selectedCellInfo.field) {
					    fieldNameValueMap["drillDisplayField"] = temp.getDrillDisplayFieldName(temp.fieldNameArr[i], fieldNameValueMap);
					    fieldNameValueMap["drillField"] = temp.getDrillFieldName(temp.fieldNameArr[i], fieldNameValueMap);
					    fieldNameValueMap["drillValue"] = temp.m_selectedCellInfo.value;
					    break;
					} else if (temp.m_selectedCellInfo.field === "name") {
					    fieldNameValueMap["drillDisplayField"] = temp.getDrillDisplayFieldName(temp.fieldNameArr[0], fieldNameValueMap);
					    fieldNameValueMap["drillField"] = temp.getDrillFieldName(temp.fieldNameArr[0], fieldNameValueMap);
					    fieldNameValueMap["drillValue"] = temp.m_selectedCellInfo.value;
					    break;
					}
				}
				var drillColor = "";
				temp.updateDataPoints(fieldNameValueMap, drillColor);
				temp.setSelectedRowCSS();
			},
			onClickCell : function (field,row) {
				temp.m_selectedCellInfo={};
				temp.m_selectedCellInfo={"field":field,"value":row[field]};
				if(detectDevice.mobile() || detectDevice.tablet()) {
					if(row.state == "closed") {
						$("#HierarchicalDGTable" + temp.m_objectid).treegrid('expand', row.id);
					} else {
						$("#HierarchicalDGTable" + temp.m_objectid).treegrid('collapse', row.id);
					}
				}
			},
			onLoadSuccess : function (data) {
				temp.setGridColors();
				temp.setGridCss();
				temp.updateGridNodeState();
				if(!IsBoolean(temp.m_designMode)){
					temp.drawMicroCharts();
                }
			}
		});
		$("#HierarchicalDGTable" + temp.m_objectid).treegrid("resize", {
			// setting width and height of the Tree Grid
			width : temp.m_width -2,
			height : temp.m_height - this.m_titleHeight - this.m_subTitleHeight -2
		});
		$("span").removeClass("tree-icon tree-folder tree-folder-open");
		$("span").removeClass("tree-file");
		this.m_seriesData = this.xyz;
	} else {
		jqEasyUI("#HierarchicalDGTable" + temp.m_objectid).datagrid("resize", {
			width : temp.m_width -2,
			height : temp.m_height - this.m_titleHeight - this.m_subTitleHeight -2
		});
		temp.setGridColors();
		temp.setGridCss();
	}
	/** Commenting below code for DAS-605 text position issue 
	 //added below block for DAS-370 when fitcolumns is true, make datagrid table width 100% , then column width shrink when trying to export
	 if (IsBoolean(this.m_fitcolumns)) {
	     var tempwidth = parseInt(temp.m_width - 2) + "px";
	     $("#" + temp.m_componentid).find(".datagrid-btable").css("width", tempwidth);
	     $("#" + temp.m_componentid).find(".datagrid-header-inner").css("width", "100%");
	     $("#" + temp.m_componentid).find(".datagrid-htable").css("width", "100%");
	 }  **/
	if(!IsBoolean(this.m_fitRemainingColumns)){
    	/* added below block for BDD-741, when fitcolumns is true and when vertical scroll bar is there,
		then column width mismatch when horizontally scrolled.*/
    	if(temp.m_scrollbarsize > 0) {
    		$("#" + temp.m_componentid).find(".datagrid-view2 div.datagrid-header-inner").css("width", "10000px");
    	}
    }
};

ScoreCard.prototype.drawTreeGridWithPivot = function(){
	var temp = this;
	this.setColumnWidth();
	this.xyz = this.m_seriesData;
	//this.setColumnHeads();
	var data = this.setTreeGridWithPivotingData();
	var treeData = this.getTreeData(data);
	var columnHeads = this.getColumnHeadsWithPivoting(data);
	//this.initDataGridAlerts();
	var fitColumnsValue = IsBoolean(this.m_designMode) ? true : IsBoolean(this.m_fitRemainingColumns);
	if (this.m_designModeDrawingFlag) {
		if (this.m_designMode) {
			this.m_designModeDrawingFlag = false;
		} else {
			this.m_designModeDrawingFlag = true;
		}
		$("#HierarchicalDGTable" + temp.m_objectid).treegrid({
			idField : temp.getIdField(),
			columns : columnHeads,
			treeField : temp.getTreeField(),
			data : treeData,
			singleSelect : true,
			collapsible : true,
			rownumbers : false,
			remoteSort : false,
			fitColumns : fitColumnsValue,
			showHeader : true,
			showFooter : false,
			nowrap : !IsBoolean(temp.m_textwrap),
			loadMsg : "",
			loading : false,
			loaded : false,
			striped : true,
			//lines: true,
			//groupField:temp.getTreeField(),
			//sortName : temp.m_gridheaderNames[0],
			sortOrder : "asc",
			state : closed,
			scrollbarSize : 0,
			groupFormatter : function (value, rows) {
				return value;
			},
			onSortColumn : function (sort, order) {
				$("span").removeClass("tree-icon tree-folder tree-folder-open");
				$("span").removeClass("tree-file");
			},
			onClickRow : function () {
				temp.m_isRowClicked = true;
				var fieldNameValueMap = temp.getFieldNameValueMap();
				fieldNameValueMap["drillDisplayField"]=temp.getDrillDisplayFieldName(temp.m_selectedCellInfo.field,fieldNameValueMap);
				fieldNameValueMap["drillField"]=temp.getDrillFieldName(temp.m_selectedCellInfo.field,fieldNameValueMap);
				fieldNameValueMap["drillValue"]=temp.m_selectedCellInfo.value;
				var drillColor = "";
				temp.updateDataPoints(fieldNameValueMap, drillColor);
				temp.setSelectedRowCSS();
			},
			onClickCell : function (field,row) {
				temp.m_selectedCellInfo={};
				temp.m_selectedCellInfo={"field":field,"value":row[field]};
			},
			onLoadSuccess : function (data) {
				temp.setGridColors();
				temp.setGridCss();
				temp.updateGridNodeState();
				if(!IsBoolean(temp.m_designMode)){
					temp.drawMicroCharts();
                }
			}
		});
		$("#HierarchicalDGTable" + temp.m_objectid).treegrid("resize", {
			// setting width and height of the Tree Grid
			width : temp.m_width -2,
			height : temp.m_height - this.m_titleHeight - this.m_subTitleHeight -2
		});
		$("span").removeClass("tree-icon tree-folder tree-folder-open");
		$("span").removeClass("tree-file");
		this.m_seriesData = this.xyz;
	} else {
		jqEasyUI("#HierarchicalDGTable" + temp.m_objectid).datagrid("resize", {
			width : temp.m_width -2,
			height : temp.m_height - this.m_titleHeight - this.m_subTitleHeight -2
		});
		temp.setGridColors();
		temp.setGridCss();
	}
	if(!IsBoolean(this.m_fitRemainingColumns)){
    	/* added below block for BDD-741, when fitcolumns is true and when vertical scroll bar is there,
		then column width mismatch when horizontally scrolled.*/
    	if(temp.m_scrollbarsize > 0) {
    		$("#" + temp.m_componentid).find(".datagrid-view2 div.datagrid-header-inner").css("width", "10000px");
    	}
    }
};
ScoreCard.prototype.drawMicroCharts = function() {
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
ScoreCard.prototype.drawBullet = function(j) {
    var tooltipBGColor = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
	var config = {
	    width: Math.round(this.m_widthArr[this.m_colHeadersFieldName[j]]) - 18,
	    height: Math.round(this.m_rowheight) - 5,
	    tooltipBackgroundColor: tooltipBGColor,
	    disableTooltips: (!IsBoolean(this.legendMap[this.m_colHeadersFieldName[j]].toolTipColumn))
	};
	$(".bullet"+this.m_objectid+this.getStringARSC(this.m_colHeadersFieldName[j])).sparkline('html', this.getBulletConfig(config, this.m_colHeadersFieldName[j], this.m_gridheaderDisplayNames[j]));
};
/** @description Jquery Sparkline line microchart draw method  **/
ScoreCard.prototype.drawSparkline = function(j) {
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
ScoreCard.prototype.drawSparkColumn = function(j) {
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
ScoreCard.prototype.drawSparkPie = function(j) {
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

/** Sparkline Bullet type Configuration, can be overridden in dashboard script **/
ScoreCard.prototype.getBulletConfig = function(config, name, dName) {
	config.type = 'bullet';
	config.targetWidth = 3;
	config.targetColor = '#006684';
	config.performanceColor = '#f89406';
	config.rangeColors = ['#e6e6e6','#d4d4d4','#c0c0c0','#b4b4b4'];
	config.tooltipValueLookups = { fields: {r: 'Range', p: dName, t: 'Target'} };
    return config;
};
/** Sparkline Configuration, can be overridden in dashboard script **/
ScoreCard.prototype.getSparklineConfig = function(config, name) {
	config.type = 'line';
	config.lineColor = "#006684";
	config.fillColor = "rgba(224, 223, 223, 0)";
	config.lineWidth = "1";
    config.spotColor = "#f89406";
    config.minSpotColor = "#f89406";
    config.maxSpotColor = "#f89406";
    config.spotRadius = "2";
    return config;
};
ScoreCard.prototype.getSparkColumnConfig = function(config, name, dName) {
	config.type = 'bar';
	config.barColor = "#86dff9";
	config.negBarColor = "#f89406";
	config.barSpacing = "1";
    config.zeroColor = "#e0dfdf";
    return config;
};
/** Sparkline Configuration, can be overridden in dashboard script **/
ScoreCard.prototype.getSparkPieConfig = function(config, name, dName) {
	config.type = 'pie';
	config.offset = "-90";
	config.borderWidth = "1";
    config.borderColor = "#ffffff";
    return config;
};

ScoreCard.prototype.updateGridNodeState = function () {
	var temp = this;
	if(IsBoolean(temp.m_collapseallnode)){
		$("#HierarchicalDGTable" + temp.m_objectid).treegrid("collapseAll");
	}else{
		$("#HierarchicalDGTable" + temp.m_objectid).treegrid("expandAll");
	}
};
/** @description Getting drilled Field Name **/
ScoreCard.prototype.getDrillFieldName = function (fieldName,row) {
	for(var key in row){
		if(fieldName === this.getStringARSC(key))
			return key;
	}
};

/** @description Getting drilled Field Display Name **/
ScoreCard.prototype.getDrillDisplayFieldName = function (fieldName,row) {
	var fieldname=this.getDrillFieldName(fieldName,row);
	for(var i = 0, length = this.m_colHeadersFieldName.length; i < length; i++){
		if(this.m_colHeadersFieldName[i] === fieldname)
			return this.m_gridheaderDisplayNames[i];
	}
	
};

/** @description getting first child of parent node **/
ScoreCard.prototype.getFirstChild = function (row) {
	if (row.children != undefined) {
		for (var i = 0, length = row.children.length; i < length; i++) {
			return this.getFirstChild(row.children[i]);
		}
	}
	return row;
};

/** @description this Map contains single row details in form of key value pair  **/
ScoreCard.prototype.getFieldNameValueMap = function () {
	var row = jqEasyUI("#HierarchicalDGTable" + this.m_objectid).datagrid("getSelected");
	//Added to resolve the drill issue with TreeWithPivot grid [BDD-812] @Khivraj
	if (this.m_hierarchylevel == "TreeWithPivot") {
	    for (var key in row) {
	        if (key.indexOf("MAUKA" + row[this.m_fixedfield]) > -1) {
	            var updatedKey = key.split("MAUKA" + row[this.m_fixedfield])[0];
	            row[updatedKey] = row[key];
	            delete row[key];
	        }
	    }
	}
	var fieldNameValueMap = new Object();
	this.getParentArray(row["_parentId"]);
	this.getChildArray(row);

	var hierArray = [];
	for (var p = this.parentNamesArray.length - 1; p >= 0; p--) {
		hierArray.push(this.parentNamesArray[p]);
	}
	hierArray.push(row.name);
	for (var c = 0, len = this.childNamesArray.length; c < len; c++) {
		hierArray.push(this.childNamesArray[c]);
	}
	for (var j = 0, k = 0, length = this.fieldNameArr.length; j < length; j++) {
		if (this.m_hierarchyTypeArr[j] == "none") {
			fieldNameValueMap["drillField_" + this.fieldNameArr[j]] = row[this.getStringARSC(this.fieldNameArr[j])];
		} else {
			fieldNameValueMap[this.fieldNameArr[j]] = hierArray[k];
			k++;
		}
	}
	
    row = this.getFirstChildRow(row);
	for (var i = 0, length = this.m_gridFieldNames.length; i < length; i++) {
		fieldNameValueMap[(this.m_gridFieldNames[i] == "name") ? this.m_name1 : this.m_gridFieldNames[i]] = row[ (this.m_gridFieldNames[i] == "_parentId") ? this.m_gridFieldNames[i] : this.getStringARSC(this.m_gridFieldNames[i]) ];
	}
	return fieldNameValueMap;
};
/** @description Getting FirstChildRow **/
ScoreCard.prototype.getFirstChildRow = function (row) {
    /** As per BI team req. commented below line of code to pass selected row on drill object whether it's parent or child row
	 * Before this if user click on any parent row its first child row will pass on drill object @[BDD-727]
	 * can overide the method if workign required as before */
	/*if (((row || "") != "") && row.children != undefined) {
		row = this.getFirstChild(row);
	}*/
	return row;
};
/** @description Getting all parent  **/
ScoreCard.prototype.getParentArray = function (pId) {
	this.parentNamesArray = [];
	this.getIterativeParentArray(pId);
};

/** @description Process of Storing the Parent into array **/
ScoreCard.prototype.getIterativeParentArray = function (id) {
	for (var i = 0; i < this.finalArray.length; i++) {
		if (this.finalArray[i]["id"] == id) {
			if (id * 1 > 0) {
				this.parentNamesArray.push(this.finalArray[i]["name"]);
				var parentId = this.finalArray[i]["_parentId"];
				this.getIterativeParentArray(parentId);
			}
		}
	}
};

/** @description Getting all Child  **/
ScoreCard.prototype.getChildArray = function (row) {
	this.childNamesArray = [];
	this.getIterativeChildArray(row);
};

/** @description Process of Storing the Child into array **/
ScoreCard.prototype.getIterativeChildArray = function (row) {
	if (row.children) {
		for (var i = 0, length = this.finalArray.length; i < length; i++) {
			if (this.finalArray[i]["_parentId"] == row["id"]) {
				this.childNamesArray.push(this.finalArray[i]["name"]);
				this.getIterativeChildArray(row.children[0]);
				break;
			}
		}
	}
};
//---------------------------- setter Methods -------------------------------------------------------

/** @description setter of TreeField **/
ScoreCard.prototype.setTreeField = function () {
	if (this.m_treefield == "") {
		for (var i = 0, length = this.m_hierarchyTypeArr.length; i < length; i++) {
			if (this.m_hierarchyTypeArr[i] == "none") {
				this.m_treefield = this.m_gridFieldNames[i];
				this.m_treefieldDisplayName = this.m_gridHeaderNames[i]; // Added for TreeWithPivot grid
				break;
			}
		}
	}
};

/** @description setter of IDField **/
ScoreCard.prototype.setIdField = function () {
	for (var i = 0, length = this.m_gridFieldNames.length; i < length; i++) {
		if ((this.m_hierarchyTypeArr[i]).toLowerCase() == "child") {
			this.m_idField = this.m_gridFieldNames[i];
			break;
		}
	}
};

/** @description setter of Parent Name **/
ScoreCard.prototype.setParentIDName = function (i) {
	for (var i = 0, length = this.m_gridFieldNames.length; i < length; i++) {
		if ((this.m_hierarchyTypeArr[i]).toLowerCase() == "parent") {
			this.m_widthArr["_parentId"] = this.m_widthArr[this.m_gridFieldNames[i]];
			this.m_gridFieldNames[i] = "_parentId";
		}
	}
};

//---------------------------- getter Methods -------------------------------------------------------

/** @description getter of TreeField **/
ScoreCard.prototype.getTreeField = function () {
	return this.getStringARSC(this.m_treefield);
};

/** @description getter of IDField **/
ScoreCard.prototype.getIdField = function () {
	return this.getStringARSC(this.m_idField);
};
/** @description getter for DataGrid fields with events and styling **/
ScoreCard.prototype.getColumnHeads = function () {
	return this.columnHeads;
};
/** @description getter for DataGrid fields with events and styling **/
ScoreCard.prototype.setColumnHeads = function () {
	var temp = this;
	this.columnHeads = [];
	for (var i = 0, length = this.m_gridFieldNames.length; i < length; i++) {
		if (IsBoolean(this.m_visibleArr[this.m_gridFieldNames[i]])) {	
			if (this.m_hierarchylevel != "Multiple"){
				this.setParentIDName(i);
			}
			if (IsBoolean(this.m_visibleArr[this.m_gridFieldNames[i]])) {
				var fieldName = this.getStringARSC(this.m_gridFieldNames[i]);
				var width = (this.m_widthArr[this.m_gridFieldNames[i]] != undefined && this.m_widthArr[this.m_gridFieldNames[i]] != "") ? 
								this.m_widthArr[this.m_gridFieldNames[i]] * 1 : 150 ;
				var align = (this.m_textAlignArr[this.m_gridFieldNames[i]] != undefined) ? this.m_textAlignArr[this.m_gridFieldNames[i]] : "left";
				if (this.m_hierarchylevel == "Multiple" && fieldName == "name"){
					this.addAlertProperty(); /** adding alert on first field **/
				}
				var columnHeadMap = {
					field: fieldName, title: this.m_gridHeaderNames[i], width: width, align: align, 
					hidden: false, halign: this.m_textAlignArr[this.m_gridFieldNames[i]], sortable: this.m_sortingColumnsArr[this.m_gridFieldNames[i]]
				};
				/**DAS-1221 @desc custom sroting method for case sensitive strings when column type as none*/
				if (this.m_isNumericArr[this.m_gridHeaderNames[i]] == "none") {
				var columnHeadMap = {
					field: fieldName, title: this.m_gridHeaderNames[i], width: width, align: align, 
					hidden: false, halign: this.m_textAlignArr[this.m_gridFieldNames[i]], sortable: this.m_sortingColumnsArr[this.m_gridFieldNames[i]],
					sorter: function(a, b) {
					                return temp.sortStringCaseSensitive(a, b)
					            }
				};
				}
				if (this.getAlertObj()[fieldName] != undefined && ((this.m_isNumericArr[this.m_gridFieldNames[i]] == "Numeric") || (this.getAlertObj()[fieldName].m_mode == "Static Comparison"))) {
					if (this.getAlertObj()[fieldName].m_name == this.m_gridFieldNames[i]) {
						if (this.getAlertObj()[fieldName].m_mode == "Range" && IsBoolean(this.getAlertObj()[fieldName].getDynamicRange())) {
							if (this.getAlertObj()[fieldName].getAlertType() == "colorfill") {
								columnHeadMap.formatter = this.drawToolTipForCell.bind(this, this.m_gridFieldNames[i], i);
								columnHeadMap.styler = this.drawAlertImages.bind(this, this.m_gridFieldNames[i], i);
							} else {
								columnHeadMap.formatter = this.drawAlertImages.bind(this, this.m_gridFieldNames[i], i);
							}
						} else {
							if (this.getAlertObj()[fieldName].getAlertType() == "colorfill"){
								columnHeadMap.formatter = this.drawToolTipForCell.bind(this, this.m_gridFieldNames[i], i);
								columnHeadMap.styler = this.drawAlertImages.bind(this, this.m_gridFieldNames[i], i);
							}else{
								columnHeadMap.formatter = this.drawAlertImages.bind(this, this.m_gridFieldNames[i], i);
							}
						}/** If-Else for dynamic range alert **/
					}/** check for valid column name **/
				} else {
					if (!IsBoolean(this.m_isFixedLabelArr[this.m_gridFieldNames[i]]) && this.m_formatterArr[this.m_gridFieldNames[i]] != undefined && this.m_formatterArr[this.m_gridFieldNames[i]] != "" && this.m_formatterArr[this.m_gridFieldNames[i]] != "none" && ((this.m_isNumericArr[this.m_gridFieldNames[i]] == "Numeric"))) {
						//columnHeadMap.formatter = this.FormatCellValue.bind(this, this.m_gridFieldNames[i], i);
						columnHeadMap.formatter = this.drawToolTipForCell.bind(this, this.m_gridFieldNames[i], i);
					} else {
						columnHeadMap.formatter = this.drawToolTipForCell.bind(this, this.m_gridFieldNames[i], i);
						/** add tooltip according property, use the default map **/
					}
				}/** If-Else for Alert & Formatters **/
				this.columnHeads.push( columnHeadMap );
			}
		} /** End of Visible IF**/
	} /** End of FOR **/	
};

/** @description If Alert is Present on First Field than copying alert property into newly created Field  **/
ScoreCard.prototype.addAlertProperty = function () {
	var fieldNames = [];
	var fieldsData = this.fieldsData;
	var fields = [];
	for (var i = 0, len = fieldsData.length; i < len; i++) {
		if (IsBoolean(this.getProperAttributeNameValue(fieldsData[i], "visible"))) {
			if (this.getProperAttributeNameValue(fieldsData[i], "hierarchyType") == "parent") {
				fieldNames.push(fieldsData[i].Name);
				fields.push(fieldsData[i]);
			}
			if (this.getProperAttributeNameValue(fieldsData[i], "hierarchyType") == "child") {
				fieldNames.push(fieldsData[i].Name);
				fields.push(fieldsData[i]);
			}
		}
	}
	for (var j = 0, length = fieldNames.length; j < length; j++) {
		if (this.getAlertObj()[this.getStringARSC(fieldNames[j])] != undefined) {
			this.getAlertObj()["name"] = this.getAlertObj()[this.getStringARSC(fieldNames[j])];
			this.m_isNumericArr["name"] = "Numeric";
			this.getAlertObj()["name"].m_name = "name";
			this.m_formatterArr["name"] = fields[j].formatter;
			this.m_isFixedLabelArr["name"] = fields[j].isfixedlabel;
			this.m_unitNameArr["name"] = fields[j].unitname;
			this.m_signPositioneArr["name"] = fields[j].signposition;
			this.m_precisionArr["name"] = fields[j].precision;
			this.m_secondFormatterArr["name"] = fields[j].secondformatter;
			this.m_secondUnitNameArr["name"] = fields[j].secondunitname;
			break;
		}
	}
};

/** @description Getter for removing the special character **/
ScoreCard.prototype.getStringARSC = function (str) {
	/*DAS-796 drillDisplayField is showing undefine when filedname having underscore.*/
	return (str) ? (str.toString()).replace(/[^a-z0-9_\s]/gi, "").replace(/\s/g, "_") : str;
};

/** @description Generation of ToolTip **/
ScoreCard.prototype.drawToolTipForCell = function (colName, index, val, row) {
	var value;
	var value1;
	var typeCell = (this.legendMap[colName] == undefined)?this.m_colHeadersFieldName[index]:colName;
	var tooltipBGColor = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
	if((this.legendMap[typeCell].cellType == "Sparkline" || this.legendMap[typeCell].cellType == "SparkColumn" || this.legendMap[typeCell].cellType == "SparkPie") && (val!="null" && val!=undefined && isNaN(val) && val!="NA")){
		return '<div class="'+this.legendMap[typeCell].cellType+this.m_objectid+this.getStringARSC(colName)+'" style="width:'+this.m_widthArr[colName]+'px;">'+val+'</div>';
	}else if(this.legendMap[typeCell].cellType == "Image" && (val!="null" && val!=undefined && isNaN(val) && val!="NA")){
		return '<img src="'+val+'" style="height:'+this.m_rowheight+'px; width:'+this.m_rowheight+'px;"></img>'
	}else if(this.legendMap[typeCell].cellType == "ProgressBar" && (val != "" && val!="null" && val!=undefined && val!="NA" && !isNaN(val*1))){
		index = this.fieldNameArr.indexOf(colName);
		return this.drawProgressBar(colName, index, val, row);
	}else if(this.legendMap[typeCell].cellType == "Bullet" && (val!="null" && val!=undefined && isNaN(val) && val!="NA")){
		return '<div class="bullet'+this.m_objectid+this.getStringARSC(colName)+'" style="width:'+this.m_widthArr[index]+'px;">'+val+'</div>';
	}else{
		if ((IsBoolean(!IsBoolean(this.m_isFixedLabelArr[colName]))))
			value = (val == undefined || val === "") ? "" : this.FormatCellValue(colName, index, val, row);
		else
			value = (val == undefined || val === "") ? "" : val;
		/**To display data with Apostrophe in tooltip*/
		if ((typeof value == "string")&&(value !== "")&&(isNaN(value))) {
			value1 = SearchAndReplaceAllOccurence(value, '"', '&#34;');
			value1 = SearchAndReplaceAllOccurence(value1,"'", "\\'");
	    }else if((typeof value == "object")&&(value[0] !== "")&&(isNaN(value[0]))){
	    	value1 = [];
	    	value1[0] = SearchAndReplaceAllOccurence(value[0], '"', '&#34;');
	    	value1[0] = SearchAndReplaceAllOccurence(value1[0], "'", "\\'");
	    }else{
	    	value1 = value;
	    }
		var alertObject = this.getAlertObj()[this.getStringARSC(colName)];
		var showtooltip = this.m_tooltipColumnsArr[colName];       
	    if(alertObject !== undefined)
	    	value1 = (IsBoolean(alertObject.m_showdata) == true) ? value1 : "&nbsp;";
	    if (typeof value == "object") {
	    	var tooltipdata = (isNaN(value1[0]))?b64EncodeUnicode(value1[0]):value1[0];
			var tooltipValue = "'" + tooltipdata + "'";
	    } else {
	    	var tooltipdata = (isNaN(value1))?b64EncodeUnicode(value1):value1;
			var tooltipValue = "'" + tooltipdata + "'";
	    }
	    /*DAS-288*/
	    if(alertObject !== undefined)
	    	value = (IsBoolean(alertObject.m_showdata) == true) ? value : "&nbsp;";
	    
		var tooltipBGColor = "'" + this.m_tooltipbackgroundcolor + "'";
		var tooltipBGAlpha = "'" + this.m_tooltipbackgroundtransparency + "'";
		var customToolTipWidth = "'" + this.m_customtooltipwidth + "'";
		/**Hyperlink will not work for numeric/null/undefined 
		 * values present along with valid values**/
		if(this.legendMap[typeCell].cellType == "Hyperlink" && (val!="null" && val!=undefined && isNaN(val) && val!="NA")){
	    	return '<div onclick="openHyperlink(\'' + val + '\')" onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ',' + false + ',' + this.m_gridcustomtooltip + ')" onmouseout="hideToolTip()" style="z-index:999; cursor:pointer;">' + value + '</div>';
	    }else{
	    	if (this.m_TooltipFieldsArr[colName].length > 0) {
	    		var toolTipInfo = {
	    				"colName": colName,
	    				"row" : row,
	    				"tooltipValue" : tooltipValue
	    		};
	    	    if (this.m_TooltipFieldsArr[colName].length == 1) {
	    	    	if(colName == "name" && IsBoolean(this.m_gridcustomtooltip)){
	    	    		var newValue = this.getCustomTooltipData(toolTipInfo, row);
	    	    		return '<div onmousemove="getToolTip(this,' + false + ',' + newValue + ',' + tooltipBGColor + ',' + tooltipBGAlpha + ',' + customToolTipWidth + ',' + false + ',' + this.m_gridcustomtooltip +')" onmouseout="hideToolTip()" style="z-index:999;">' + value + '</div>';
	    	    	}else{
	    	    		var newValue = this.getCustomTooltipData(toolTipInfo, row);
	    	    		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + newValue + ',' + tooltipBGColor + ',' + tooltipBGAlpha + ',' + customToolTipWidth + ',' + false + ',' + this.m_gridcustomtooltip +')" onmouseout="hideToolTip()" style="z-index:999;">' + value + '</div>';
	    	    	}
				} else {
					if(colName == "name" && IsBoolean(this.m_gridcustomtooltip)){
	    	    		var toolTipObj = "'" + this.getCustomTooltipData(toolTipInfo, row).value + "'";
		    	        return '<div onmousemove="getToolTip(this,' + false + ',' + toolTipObj + ',' + tooltipBGColor + ',' + tooltipBGAlpha + ',' + customToolTipWidth +  ',' + true + ',' + this.m_gridcustomtooltip +')" onmouseout="hideToolTip()" style="z-index:999;">' + value + '</div>';
	    	    	}else{
	    	    		var toolTipObj = "'" + this.getCustomTooltipData(toolTipInfo, row).value + "'";
		    	        return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + toolTipObj + ',' + tooltipBGColor + ',' + tooltipBGAlpha + ',' + customToolTipWidth +  ',' + true + ',' + this.m_gridcustomtooltip +')" onmouseout="hideToolTip()" style="z-index:999;">' + value + '</div>';
	    	    	}
	    	    }
	    	} else {
	    		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ',' + false + ',' + this.m_gridcustomtooltip + ')" onmouseout="hideToolTip()" style="z-index:999;">' + value + '</div>';
	    	}
	    }
	}
};
ScoreCard.prototype.getCustomTooltipData = function(toolTipInfo, rowdata) {
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
	    		var data = rowdata[arr[1]];
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
	        if (toolTipInfo.colName == "name") {
	            var newValue = toolTipInfo.tooltipValue;
	        } else {
	            /*Added below changes, as other field data is not displaying in tooltip*/
	            if (toolTipInfo.row[toolTipInfo.colName] !== "") {
	                if (Array.isArray(toolTipInfo.row[this.m_TooltipFieldsArr[toolTipInfo.colName][0]])) {
	                    var newValue = (toolTipInfo.row[this.m_TooltipFieldsArr[toolTipInfo.colName][0]])[0];
	                    newValue = (newValue === undefined) ? ("" + this.m_TooltipFieldsArr[toolTipInfo.colName][0]) : ("" + newValue);
	                    newValue = btoa(newValue);
	                    newValue = "'" + newValue + "'";
	                } else {
	                    var newValue = (toolTipInfo.row[this.m_TooltipFieldsArr[toolTipInfo.colName][0]]);
	                    newValue = (newValue === undefined) ? ("" + this.m_TooltipFieldsArr[toolTipInfo.colName][0]) : ("" + newValue);
	                    newValue = btoa(newValue);
	                    newValue = "'" + newValue + "'";
	                }
	            }
	        }
	        return newValue;
	    }
	} else {
	    var flag = true;
	    var toolTipObj = {
	        "isEncoded": true
	    };
	    for (var i = 0; i < this.m_TooltipFieldsArr[toolTipInfo.colName].length; i++) {
	        if (toolTipInfo.colName == "name" && flag) {
	            flag = false;
	            tooltipValues[this.m_TooltipFieldsArr[toolTipInfo.colName][i]] = toolTipInfo.row["name"];
	        } else {
	            if (this.m_TooltipFieldsArr[toolTipInfo.colName][i] !== this.getParentField() && toolTipInfo.row[this.m_TooltipFieldsArr[toolTipInfo.colName][i]] !== "") {
	                tooltipValues[this.m_TooltipFieldsArr[toolTipInfo.colName][i]] = toolTipInfo.row.name;
	            }
	            if (toolTipInfo.row[this.m_TooltipFieldsArr[toolTipInfo.colName][i]] !== undefined && toolTipInfo.row[this.m_TooltipFieldsArr[toolTipInfo.colName][i]] !== "") {
	                if (Array.isArray(toolTipInfo.row[this.m_TooltipFieldsArr[toolTipInfo.colName][i]])) {
	                    tooltipValues[this.m_TooltipFieldsArr[toolTipInfo.colName][i]] = (toolTipInfo.row[this.m_TooltipFieldsArr[toolTipInfo.colName][i]])[0];
	                } else {
	                    tooltipValues[this.m_TooltipFieldsArr[toolTipInfo.colName][i]] = (toolTipInfo.row[this.m_TooltipFieldsArr[toolTipInfo.colName][i]]);
	                }
	            }
	        }
	    }
	    toolTipObj.value = btoa(JSON.stringify(tooltipValues));
	    return toolTipObj;
	}
};
ScoreCard.prototype.getProgressBarColor = function() {
	return ["#83cc0f","#f7244a","#f5b229","#ddc617","#49b1de"];
};
/** @description drawing of ProgressBar inside the grid cell **/
ScoreCard.prototype.drawProgressBar = function(colName, index, val, row) {
	var ProgressClass = "progressDiv"+this.m_objectid+this.getStringARSC(colName);
	var showtooltip = this.m_tooltipColumnsArr[colName];
	var tooltipdata = (isNaN(val) && (typeof val === 'string'))?b64EncodeUnicode(val):val;
	var tooltipValue = "'" + tooltipdata + "'";
	var colorArr = this.getProgressBarColor();
	var silderHeight = this.fontScaling(3);
	var tooltipBGColor = "'" + this.m_tooltipbackgroundcolor + "'";
	var tooltipBGAlpha = "'" + this.m_tooltipbackgroundtransparency + "'";
	var customToolTipWidth = "'" + this.m_customtooltipwidth + "'";
	if(1*val===0){
		var leftBarWidth = 0;
		var rightBarWidth = (this.m_widthArr[colName] - 10);
		var ProgressClassStyle = '"border-left:'+silderHeight+'px solid transparent;border-right:'+silderHeight+'px solid transparent; width:'+(1*this.m_widthArr[index] - 10)+'px;"';
		var ProgressLeftDivStyle = '"border:'+silderHeight+'px solid '+colorArr[0]+'; border-top-left-radius: 2em; border-bottom-left-radius: 2em; float:left; width:'+(leftBarWidth)+'px;"';
		var ProgressRightDivStyle = '"border:'+silderHeight+'px solid '+colorArr[1]+'; border-top-left-radius: 2em; border-bottom-left-radius: 2em; border-top-right-radius: 2em; border-bottom-right-radius: 2em; float:right; width:'+(rightBarWidth)+'px;"';
		var text = '<div style="display:flex;" class="progressBarLabels"><div align="left" style="float:left; width:50%;">'+this.getFormattedCellValue(val, colName, index)+'</div><div align="right" style="float:right; width:50%;">'+this.getFormattedCellValue(100-val, colName, index)+'</div></div>'
		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ')" onmouseout="hideToolTip()" class='+ProgressClass+' style='+ProgressClassStyle+'>'+text+'<div style="display:flex;"><div style='+ProgressRightDivStyle+'></div></div>';
	}else if(1*val===100){
		var leftBarWidth = (this.m_widthArr[colName] - 10);
		var rightBarWidth = 0;
		var ProgressClassStyle = '"border-left:'+silderHeight+'px solid transparent;border-right:'+silderHeight+'px solid transparent; width:'+(1*this.m_widthArr[index] - 10)+'px;"';
		var ProgressLeftDivStyle = '"border:'+silderHeight+'px solid '+colorArr[0]+'; border-top-left-radius: 2em; border-bottom-left-radius: 2em; border-top-right-radius: 2em; border-bottom-right-radius: 2em; float:left; width:'+(leftBarWidth)+'px;"';
		var ProgressRightDivStyle = '"border:'+silderHeight+'px solid '+colorArr[1]+'; border-top-right-radius: 2em; border-bottom-right-radius: 2em; float:right; width:'+(rightBarWidth)+'px;"';
		var text = '<div style="display:flex;" class="progressBarLabels"><div align="left" style="float:left; width:50%;">'+this.getFormattedCellValue(val, colName, index)+'</div><div align="right" style="float:right; width:50%;">'+this.getFormattedCellValue(100-val, colName, index)+'</div></div>'
		return '<div onmousemove="getToolTip(this,' + showtooltip + ',' + tooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ')" onmouseout="hideToolTip()" class='+ProgressClass+' style='+ProgressClassStyle+'>'+text+'<div style="display:flex;"><div style='+ProgressLeftDivStyle+'></div></div></div>';
	}else if(1*val<0 || 1*val > 100){
		var leftBarWidth = (this.m_widthArr[colName] - 10);
		var ProgressClassStyle = '"border-left:'+silderHeight+'px solid transparent;border-right:'+silderHeight+'px solid transparent; width:'+(1*this.m_widthArr[index] - 10)+'px;"';
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
/** @description Setting Column Width **/
ScoreCard.prototype.setColumnWidth = function () {
	var definedWidth = 0;
	var count = 0;
	for (var i = 0, length = this.m_colHeadersFieldName.length; i < length; i++) {
	    if (this.m_widthArr[this.m_colHeadersFieldName[i]] != undefined && this.m_widthArr[this.m_colHeadersFieldName[i]] != "") {
	        definedWidth = definedWidth * 1 + (parseInt(this.m_widthArr[this.m_colHeadersFieldName[i]]) * 1);
	        count++;
	    }
	}
	var remainingWidth = this.m_width - definedWidth;
	this.m_fitRemainingColumns = false;
	/**Hide old line of code bcz when count and this.m_colHeadersFieldName.length is equal than o/p is infinity   */
	//var otherColumnWidth = remainingWidth / (this.m_colHeadersFieldName.length - count);
	var otherColumnWidth = remainingWidth / ((this.m_colHeadersFieldName.length - count) !== 0) ? (this.m_colHeadersFieldName.length - count) : 1;
	if(IsBoolean(this.m_fitcolumns)) {
		for (var i = 0, length1 = this.m_colHeadersFieldName.length; i < length1; i++) {
		    if (this.m_typeArr[this.m_colHeadersFieldName[i]] !== "parent") {
		    	/**Added check bcz when this.m_widthArr["name"] value is undefined than column width set NaN*/
		    	var name = (this.m_widthArr["name"] !== undefined) ? this.m_widthArr["name"]: 0;
		    	if (this.m_widthArr[this.m_colHeadersFieldName[i]] != undefined && this.m_widthArr[this.m_colHeadersFieldName[i]] != "") {
		            this.m_widthArr[this.m_colHeadersFieldName[i]] = (this.m_width - name) * (this.m_widthArr[this.m_colHeadersFieldName[i]] / (definedWidth - name));
		        } else {
		            this.m_widthArr[this.m_colHeadersFieldName[i]] = parseInt(otherColumnWidth);
		        }
		    }
		}
		this.m_fitRemainingColumns = true;
	} else if (this.isMaximized && remainingWidth > 0) {
		// Added this block for BDD-798 Grids column width should be adjusted while Maximize the grid when fit column disabled.
	    this.m_fitRemainingColumns = true;
	}
};

/** @description Getter of Parent,Child field Name **/
ScoreCard.prototype.getParentChildFieldName = function () {
	//this.m_colHeadersFieldName[j]this.m_hierarchyTypeArr[j]
	var rootNode = [];
	var rootNodeDisplay = [];
	var valueNode = [];
	var headerNode = [];

	//Push the parent node first always - irrespective of order in fields json
	for (var i = 0, length = this.fieldName.length; i < length; i++) {
		if (this.m_typeArr[this.fieldName[i]] == "parent") {
			rootNode.push(this.fieldName[i]);
			rootNodeDisplay.push(this.m_displayAllFieldName[i]);
		}
	}

	for (var i = 0, length1 = this.fieldName.length; i < length1; i++) {
		if (this.m_typeArr[this.fieldName[i]] == "child") {
			if(this.m_seriesVisibleArr[this.fieldName[i]]){
				rootNode.push(this.fieldName[i]);
				rootNodeDisplay.push(this.m_displayAllFieldName[i]);
			}
		} else if (this.m_typeArr[this.fieldName[i]] !== "parent") {
			valueNode.push(this.fieldName[i]);
			headerNode.push(this.m_displayAllFieldName[i]);
		}
	}
	return {
		root : rootNode,
		value : valueNode,
		header : headerNode,
		rootDisplay : rootNodeDisplay
	};
};

/** @description Setting width for First Column**/
ScoreCard.prototype.setWidthForTreeNode = function (rootNames) {
	var width = this.m_widthArr[rootNames[0]];
	for (var i = 0, length = rootNames.length; i < length; i++) {
		if (width < this.m_widthArr[rootNames[i]])
			width = this.m_widthArr[rootNames[i]];
	}
	this.m_widthArr["name"] = width;
};

/** @description data Processing**/
ScoreCard.prototype.setParentIDs = function () {
	var nodeNames = this.getParentChildFieldName();
	var seq = nodeNames.root;
	var dataField = nodeNames.value;
	this.dataField = nodeNames.value;
	this.dataField = nodeNames.value;
	var headerField = nodeNames.header;
	var rootDisplay = nodeNames.rootDisplay;
	/** Call setCommaSeperatorFlag to set flag to true/false for none columns **/
	this.setCommaSeperatorFlag();
	this.setWidthForTreeNode(seq);
	var newData = [];
	this.m_name1 = [seq[seq.length - 1]];
	var ids = 1;
	/*************************************************/
	this.m_treefield = "name";
	this.m_idField = "id";
	this.m_gridFieldNames = ["name", "id", "_parentId"];
	for (var i = 0, dataFieldLength = dataField.length; i < dataFieldLength; i++) {
		this.m_gridFieldNames.push(dataField[i]);
	}

	this.m_gridHeaderNames = [rootDisplay[rootDisplay.length - 1], "id", "_parentId"];
	for (var i = 0, length = dataField.length; i < length; i++) {
		this.m_gridHeaderNames.push(headerField[i]);
	}

	for (var i = 0, gridFieldLength = this.m_gridFieldNames.length; i < gridFieldLength; i++) {
		if (this.m_gridFieldNames[i] == "id" || this.m_gridFieldNames[i] == "_parentId")
			this.m_visibleArr[this.m_gridFieldNames[i]] = "false";
		else if (this.m_gridFieldNames[i] == this.m_gridFieldNames[i])
			this.m_visibleArr[this.m_gridFieldNames[i]] = "true";
	}
	/*************************************************/
	var tempVar = {};
	var tempVar1 = {};

	for (var i = 0, outerLength = this.m_seriesData.length; i < outerLength; i++) {
		for (var j = 0, innerLength = seq.length; j < innerLength; j++) {
			var flag = false;
			var dataArr = {};
			var name = this.m_seriesData[i][seq[j]];
			for (var k = 0, length = newData.length; k < length; k++) {
				if (newData[k].name == this.m_seriesData[i][seq[j - 1]]) {
					dataArr["name"] = name;
					dataArr["id"] = ids;
					dataArr["_parentId"] = newData[k]["id"];

					flag = true;
				}
				if (flag)
					break;
			}
			if (!flag) {
				dataArr["name"] = name;
				dataArr["id"] = ids;
				dataArr["_parentId"] = null;
			}

			if (j == seq.length - 1)
				for (var x = 0, len = dataField.length; x < len; x++){
					if(dataArr[dataField[x]] == undefined){
						dataArr[dataField[x]] = [];
					}
					dataArr[dataField[x]].push(this.m_seriesData[i][dataField[x]]);
				}
			else
				for (var x = 0; x < dataField.length; x++)
					dataArr[dataField[x]] = [];

			this.pushDataInMap(newData, seq, j, dataArr, null, this.m_seriesData[i]);
			/**Included when their is no parent in the grid for resolving sorting issue.*/
			if (IsBoolean(IsBoolean(this.m_fieldaggregation[dataField] == "none") && IsBoolean(nodeNames.root.length <= 1))) {
			    var Truthdata = this.isNodeExist(newData, dataArr, dataField);
			} else {
			    var Truthdata = this.isNodeExist(newData, dataArr, dataArr["_parentId"], dataField);
			}
			if (!IsBoolean(Truthdata)) {
				newData.push(dataArr);

				tempVar1[dataArr["id"]] = dataArr;
				tempVar[dataArr["id"]] = {};

				if (tempVar[dataArr["_parentId"]] != undefined)
					tempVar[dataArr["_parentId"]][dataArr["id"]] = {};

				ids++;
			}

		}
	}
	/*for(var k=0;k<newData.length;k++){
		for(var i=0;i<dataField.length;i++){
			if(this.m_fieldaggregation[dataField[i]] != "none" && (!IsBoolean(this.isString(newData[k][dataField[i]]))|| this.m_fieldaggregation[dataField[i]] == "count"))
				newData[k][dataField[i]] = getAggregationOperatedData(newData[k][dataField[i]],this.m_fieldaggregation[dataField[i]]);
		}
	}*/
	for(var k = 0, outerLength = newData.length; k < outerLength; k++){
		for(var i = 0, innerLength = dataField.length; i < innerLength; i++){
			if((!IsBoolean(this.isString(newData[k][dataField[i]]))|| this.m_fieldaggregation[dataField[i]] == "count")){
				var field = (IsBoolean(this.m_commaSeperatorFlag)) ? (dataField[i]+"_"+this.m_fieldaggregation[dataField[i]]):(dataField[i]);
				if (this.m_fieldaggregation[dataField[i]] == "none") {
				    if (IsBoolean(newData[k][field] == undefined) || IsBoolean(newData[k][field].length == 0)) {
				        newData[k][field] = "";
				    } else {
				        newData[k][field] = newData[k][field]["0"] * 1;
				    }
				} else {
				    newData[k][field] = getAggregationOperatedData(newData[k][dataField[i]], this.m_fieldaggregation[dataField[i]]);
				}
			}
		}
	}
	this.m_seriesData = newData;
	this.sum(tempVar, tempVar1);
	this.updateData(newData, tempVar1);
};

/** @description checking is array contains string value or not **/
ScoreCard.prototype.isString = function (data) {
	for(var i = 0,length = data.length;i < length; i++){
		if(isNaN(data[i])){
			return true;
		}
	}
	return false;
};

/** @description update Parent Data **/
ScoreCard.prototype.updateData = function (data, tempVar1) {
	/** initialize customAggregation object*/
	this.customAggregation = {};
	var i = data.length - 1;
	for (i; i >= 0; i--) {
		if (data[i]["_parentId"] != null) {
			this.calculateRoot(data[i], tempVar1[data[i]["_parentId"]]);
		}
	}
};

/** @description Performing Aggregation on Parent Node **/
ScoreCard.prototype.calculateRoot = function (childNode, parentNode) {
	for (var key in childNode) {
		var field = (IsBoolean(this.m_commaSeperatorFlag)) ? (key+"_"+this.m_fieldaggregation[key]):(key);
		/** To support custom aggregation on field added condition (this.m_fieldaggregation[key] == "customAggregation") bcz customAggregation field calculating rowwise 
		 * 	so it should avoid numeric field data validation */
		if ((!isNaN(getNumericComparableValue(childNode[key])) && key != "id" && key != "_parentId" && childNode[key] !== "") || (this.m_fieldaggregation[key] == "customAggregation")) {
			if(parentNode[key] == undefined)
				parentNode[key] = "";
			switch (this.m_fieldaggregation[key]) {
			case "count":
				parentNode[key] = this.getFirstValue(parentNode,key)*1 + this.getSecondValue(parentNode,childNode,key)*1;
				parentNode[field] = parentNode[key];
				break;
			case "sum":
				parentNode[key] = this.getFirstValue(parentNode,key)*1 + this.getSecondValue(parentNode,childNode,key)*1;
				parentNode[field] = parentNode[key];
				break;
			case "avg":
				parentNode[key + "_count"] = (((parentNode[key + "_count"] == undefined) ? 0 : parentNode[key + "_count"] * 1) + getNumericComparableValue(1) * 1);
				var noOfElement = parentNode[key + "_count"];
				if (noOfElement > 1)
					noOfElement = noOfElement - 1;
				var value = ((((parentNode[key] == "") ? 0 : parentNode[key] * noOfElement) + getNumericComparableValue(childNode[key]) * 1));
				parentNode[key] = value / parentNode[key + "_count"];
				break;
			case "max":
				parentNode[key] = (parentNode[key] == "") ? childNode[key] : (parentNode[key] * 1 < getNumericComparableValue(childNode[field]) ? getNumericComparableValue(childNode[field]) : getNumericComparableValue(parentNode[key]));
				break;
			case "min":
				parentNode[key] = (parentNode[key] == "") ? childNode[key] : (parentNode[key] * 1 > getNumericComparableValue(childNode[key]) ? getNumericComparableValue(childNode[field]) : getNumericComparableValue(parentNode[key]));
				break;
			case "none":
				parentNode[key] = (((parentNode[key] == "") ? "" : parentNode[key] * 1) + "");
				break;
			case "customAggregation":
				parentNode[key] = this.calculateCustomAggregation(parentNode, childNode, key);
				break;
			}
		}
	}
};

/** @description get First Value **/
ScoreCard.prototype.calculateCustomAggregation = function(parentNode, childNode, key) {
    if (this.customAggregation[parentNode.name] == undefined) {
        this.customAggregation[parentNode.name] = {};
    }
    if (this.customAggregation[parentNode.name][key] == undefined) {
        this.customAggregation[parentNode.name][key] = {};
        for (var i = 0; i < this.dataField.length; i++) {
            this.customAggregation[parentNode.name][key][this.dataField[i]] = "";
        }
    }
    var result = "";
    if (this.customAggregationScriptObj && this.customAggregationScriptObj[key] && this.customAggregationScriptObj[key]["field"]) {
        for (var key1 in this.customAggregationScriptObj[key]["field"]) {
            var customAggFieldObj = this.customAggregationScriptObj[key]["field"][key1];
            if (customAggFieldObj && customAggFieldObj != "" && customAggFieldObj['opr'] && customAggFieldObj['opr'] != "") {
        		if (!isNaN(getNumericComparableValue(childNode[key1])) && childNode[key1] !== "") {
                    var operType = this.customAggregationScriptObj[key]["field"][key1]['opr'];
	                switch (operType) {
	                    case "sum":
	                        var value = (this.customAggregation[parentNode.name][key][key1] !== "") ? this.customAggregation[parentNode.name][key][key1] : 0;
	                        value += this.getSecondValue(parentNode, childNode, key1) * 1;
	                        this.customAggregation[parentNode.name][key][key1] = value;
	                        break;
	                    case "avg":
	                        this.customAggregation[parentNode.name][key][key1 + "_count"] = (((this.customAggregation[parentNode.name][key][key1 + "_count"] == undefined) ? 0 : this.customAggregation[parentNode.name][key][key1 + "_count"] * 1) + getNumericComparableValue(1) * 1);
	                        var noOfElement = this.customAggregation[parentNode.name][key][key1 + "_count"];
	                        if (noOfElement > 1)
	                            noOfElement = noOfElement - 1;
	                        var value = ((((this.customAggregation[parentNode.name][key][key1] == "") ? 0 : this.customAggregation[parentNode.name][key][key1] * noOfElement) + getNumericComparableValue(childNode[key1]) * 1));
	                        this.customAggregation[parentNode.name][key][key1] = value / this.customAggregation[parentNode.name][key][key1 + "_count"];
	                        break;
	                }
        		}
            }
        }
        var expression = this.customAggregationScriptObj[key].exper;
        if (expression && expression !== "") {
            var newTxt = expression.split('[');
            for (var i = 1; i < newTxt.length; i++) {
                var val = this.customAggregation[parentNode.name][key][newTxt[i].split(']')[0]];
                val = (val == "") ? 0 : val;
                expression = expression.replace(/ *\[[^\]]*]/, val);
            }
            result = eval(expression);
            this.customAggregation[parentNode.name][key][key] = result;
        }
    }
    return result;
};
/** @description get First Value **/
ScoreCard.prototype.getFirstValue = function (parentNode,key) {
	return ((parentNode[key] == "") ? 0 : parentNode[key] * 1);
};
/** @description get Second Value **/
ScoreCard.prototype.getSecondValue = function (parentNode, childNode, key) {
	var field = (IsBoolean(this.m_commaSeperatorFlag)) ? (key+"_"+this.m_fieldaggregation[key]):(key);
	return (getNumericComparableValue(childNode[field]) * 1);
};

/** @description Sum Aggregation **/
ScoreCard.prototype.sum = function (data, mainData) {
	for (var key in data) {
		if (data[key].length > 0) {
			this.sum(data[key], mainData);
		} else {
			mainData[key];
		}
	}
};

/** @description assigning parent ID **/
ScoreCard.prototype.pushDataInMap = function (newData, seq, j, data, parentId, seriesData) {
	if (j == 0)
		return;

	var i = 0;
	var k = null;

	for (k = 0, length = newData.length; k < length; k++) {
		if (newData[k].name == seriesData[seq[i]] && newData[k]["_parentId"] == parentId) {
			parentId = newData[k]["id"];
			i++;

			if (i == j)
				break;
		}
	}

	data["_parentId"] = parentId;
};

/** @description Checking is Node Exist or Not **/
ScoreCard.prototype.isNodeExist = function (dataArr, data, parentId,seriesField) {
	for (var i = 0, outerLength = dataArr.length; i < outerLength; i++) {
		if (dataArr[i]["name"] == data.name && dataArr[i]["_parentId"] == parentId) {
			for(var k = 0, innerLength = seriesField.length; k < innerLength; k++){
				if(data[seriesField[k]].length>0 && data[seriesField[k]] != undefined && data[seriesField[k]] != "")
				dataArr[i][seriesField[k]].push(data[seriesField[k]][0]);
			}
			return true;
		}
	}
	return false;
};

/** @description Getter of Table Data **/
ScoreCard.prototype.getTableData = function () {
	var Tabledata = [];
	this.columnWiseData = {};
	/** TODO added array to indicate that these values contains comma values for rendering microcharts, any further microcharts that support comma value has to be added here**/
	var numericCheck = ["SparkColumn", "Bullet", "Sparkline", "SparkPie"];
	/** add for checking the parent field displaying zeros when aggregation is none **/
	var parentFieldsArray = ["id", "name", "_parentId"];
	for (var i1 = 0, outerLength = this.m_seriesData.length; i1 < outerLength; i1++) {
		var rowdata = {};
		for (var j = 0, innerLength = this.m_gridFieldNames.length; j < innerLength; j++) {
			var associateHead = this.m_gridFieldNames[j];
			var associateARSCHead = this.getStringARSC(associateHead);
			if (associateHead == "_parentId") {
				var pId = (this.m_hierarchylevel == "Multiple") ? associateHead : this.fieldNameArr[j];
				rowdata["_parentId"] = this.getParentIdValue( this.m_seriesData[i1][pId]);
			} else {
				var val = this.m_seriesData[i1][associateHead];
				if (this.m_precisionArr[associateHead] != "" && this.m_precisionArr[associateHead] != undefined) {
					if (this.m_hierarchylevel == "Single" && (this.m_hierarchyTypeArr[j]).toLowerCase() == "child") {
						/** To prevent changing the child id of single level hierarchical grid from empty to 0, do not multiple with 1**/
						val = this.m_seriesData[i1][associateHead];
					} else if (!isNaN(val) && val != "") {
						var prec = this.m_precisionArr[associateHead];
						if (this.m_fieldaggregation[associateHead] !== "count") {
							// Do nothing
						}
					}else{
						// Do nothing
					}
				}
				/** convert to numeric value for numeric sorting **/
				if((this.m_isNumericArr[associateHead] == "Numeric") && IsBoolean(this.valueValidation(val))){
					rowdata[associateARSCHead] = this.numericArrayData(val);
				} else{
					rowdata[associateARSCHead] = val;
				}
			}
			/** Set the data column wise **/
			if (this.columnWiseData[associateARSCHead] == undefined) {
				this.columnWiseData[associateARSCHead] = [];
			}
			if (rowdata[associateARSCHead]) {
				var singlevalue, rowd;
				if (typeof rowdata[associateARSCHead] === "object") {
					for (var vl = 0; vl < rowdata[associateARSCHead].length; vl++) {
						singlevalue = rowdata[associateARSCHead][vl];
						if (IsBoolean(this.valueValidation(singlevalue))) {
							rowd = rowdata[associateARSCHead];
							this.columnWiseData[associateARSCHead].push(((rowd && rowd instanceof Array) && rowd.length > 0) ? rowd[vl] : rowd);
						}
					}
				} else {
					/** BDD-620 when data-with-comma is there, bar alerts are not drawing because type is coming as number **/
					singlevalue = rowdata[associateARSCHead];
					if (IsBoolean(this.valueValidation(singlevalue))) {
						rowd = rowdata[associateARSCHead];
						this.columnWiseData[associateARSCHead].push(rowd);
					}
				}
			}

			/**Added for Sorting to be proper*/
			var value = rowdata[associateARSCHead];
			/** Save the sorting state of column whether to go numeric sort or not **/
			/**" (numericCheck.indexOf(this.m_isNumericArr[associateARSCHead]) " has been added to check whether respective field is microchart or not. 
			 * if it is micro charts, comma will not be removed and it should store false **/
			var valueSorting = false;
			if (this.m_numberFormaterSorting[associateARSCHead] !== undefined && (numericCheck.indexOf(this.m_isNumericArr[associateHead]) === -1)) {
				if (this.m_numberFormaterSorting[associateARSCHead] == "number") {
					valueSorting = !(isNaN(getCommaRemovedValue(value) * 1));
				} else {
					valueSorting = !(isNaN((value) * 1));
				}
			}
			if (IsBoolean(valueSorting)) {
				if (_.contains(parentFieldsArray, associateARSCHead)) {
					if (value * 1 === 0 && value != 0) {
						value = "";
					}
				} else {
					/*DAS-829 BDD-68 should not show empty for values 0 and 0.0 */
					//DAS-865 when data is empty value should be empty
					if ((value.length === 0) || (value === 0 && value[0] !== "0" && value[0] !== undefined && value[0] !== 0) || (value[0] === "") || (Array.isArray(value) && value[0] === undefined)) {
						value = "";
					} else {
						/**Converted String to Numeric*/
						if (IsBoolean(Array.isArray(value)) && (value.length > 1)) {
							for (var j1 = 0; value.length > j1; j1++) {
								/**Added for No child data*/
								if (this.m_numberFormaterSorting[associateARSCHead] == "number") {
									value[j1] = getCommaRemovedValue(value[j1]) * 1;
								} else {
									value[j1] = (value[j1]) * 1;
								}
							}
						} else {
							if (this.m_numberFormaterSorting[associateARSCHead] == "number") {
								value = getCommaRemovedValue(value) * 1;
							} else {
								value = value * 1;
							}
						}
					}
				}
			}
			rowdata[associateARSCHead] = value;

		}
		Tabledata.push(rowdata);
	}

	/** add min and max to each column's data **/
	var tempColumnWiseData = {};
	for (var key1 in this.columnWiseData) {
		tempColumnWiseData[key1] = {};
		tempColumnWiseData[key1]["max"] = getNumericMax(this.columnWiseData[key1]);
		tempColumnWiseData[key1]["min"] = getNumericMin(this.columnWiseData[key1]);
	}
	this.columnWiseData = {};
	this.columnWiseData = tempColumnWiseData;
	
	var updatedTableData = ((this.m_hierarchylevel == "Multiple" && IsBoolean(this.m_commaSeperatorFlag)) && (this.dataField.length != 0)) ? (this.getUpdateTableData(Tabledata)) : (Tabledata);
	this.finalArray = Tabledata;
	var Data = JSON.stringify(updatedTableData);
	var finalData = '{"rows":' + Data + '}';
	return (JSON.parse(finalData));
};

/**return numeric value in case of data having array**/
ScoreCard.prototype.numericArrayData = function(val){
	try {
		if (Array.isArray(val) && val.length > 1) {
			return val.map(Number);
		} else {
			return removeCommaFromSrting(val);
		}
	} catch (e){
		return removeCommaFromSrting(val);
	}
};

/** @description get Updated Table Data**/
/** @description get Updated Table Data**/
ScoreCard.prototype.getUpdateTableData = function(Tabledata){
	var updateTableData = [];
	for(var i = 0, length = Tabledata.length; i < length; i++){	
		var map = this.getFieldMapFromObject(Tabledata[i]);
		if(IsBoolean(map.isArray)){
			if((Tabledata[i][(map.field)].length == 0) || (Tabledata[i][(map.field)].length == 1) || 
			(Tabledata[i][(map.field)]==0))
				updateTableData.push(Tabledata[i]);
			else{
				if(Array.isArray(Tabledata[i][(map.field)])){
					for(var x = 0 ; x < Tabledata[i][(map.field)].length ; x++){
						updateTableData.push(this.getSeperateObject(this.dataField,Tabledata[i],x));
					}
				}
			}
		}
		else
			updateTableData.push(Tabledata[i]);
	}
	return updateTableData;
};

ScoreCard.prototype.getFieldMapFromObject = function(tableObject){
	var field;
	var tempField;
	var map = {};
	var c = 0 ;
	for(var i = 0, length = this.dataField.length; i <  length; i++){
		if(Array.isArray(tableObject[this.getStringARSC(this.dataField[i])])){
			field = this.getStringARSC(this.dataField[i]);
			c++;
		}
		else{
			tempField = this.getStringARSC(this.dataField[i]);
		}
			
	}
	if(c>0)
		map = {"isArray":true,"field":field};
	else
		map = {"isArray":false,"field":tempField};
	
	return map;
};

/** @description remove comma and make a seperate object**/
ScoreCard.prototype.getSeperateObject = function(dataField,Tabledata,c){
	var returnObject = {};
	var tempArr = [];
	for(key in Tabledata){
		if(Array.isArray(Tabledata[key])){
			tempArr.push(Tabledata[key][c]);
			returnObject[key] = tempArr;
			tempArr=[];
		}
		else
			returnObject[key] = Tabledata[key];		
	}
	return returnObject;
};
/** @description Get parentIdValue**/
ScoreCard.prototype.getParentIdValue = function (pId) {
	/** parentId should be numeric always as jeasyui supports numeric value only 
	 * If not numeric, single hierarchy scorecard will not showing rows **/
	return  (pId == undefined || pId == null || isNaN(pId)) ? pId : pId*1;
};
/*************************************************************************/
/** @description Getter of Alert Object **/
ScoreCard.prototype.getAlertObj = function () {
	return this.m_alertObj;
};

/*****************************************************************************************/

/** @description Setting Grid CSS **/
ScoreCard.prototype.setGridCss = function () {
	var temp = this;
	var comp = $("#" + temp.m_componentid);
	var btable = comp.find(".datagrid-body table");
	btable[0].style.borderCollapse = "initial";
	comp.find(".panel-body").css("padding", "0px");
	comp.find(".datagrid-row").css("height", temp.getRowHeight(temp.m_rowheight)+"px");
	comp.find(".datagrid-row-alt").css("height", temp.getRowHeight(temp.m_rowheight)+"px");
	comp.find(".datagrid-header-row").css("height", temp.getRowHeight(temp.m_rowheight)+"px");
	
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
	comp.find(".datagrid-row > td:last-child > div.datagrid-cell").css("padding-right", (temp.m_scrollbarsize*1 + 2+"px"));

	comp.find(".datagrid-header-row span").css({
		"font-weight": temp.m_headerfontweight,
		"font-size": temp.fontScaling(temp.m_headerfontsize) + "px",
		"font-family": selectGlobalFont(temp.m_headerfontfamily),
		"font-style": temp.m_headerfontstyle,
		"color": convertColorToHex(temp.m_headerfontcolor),
		"text-decoration": temp.m_headertextdecoration
	});
	comp.find(".datagrid-header-row span").parent().css("text-decoration", temp.m_headertextdecoration);
	if (IsBoolean(this.m_usefieldcolorasheader)) {
	    /**Feature Added for different color for different value field*/
	    var rootNodeArr = this.getParentChildFieldName().root;
	    comp.find(".datagrid-header-row  td").each(function() {
	        $(this).css("background", hex2rgb(temp.m_fieldColors[this.attributes["0"].nodeValue], temp.m_headerrowopacity));
	    });
	    $(comp.find(".datagrid-header-row  td")[0]).css("background", hex2rgb(temp.m_fieldColors[this.getStringARSC(rootNodeArr[rootNodeArr.length - 1])], temp.m_headerrowopacity));
	} else {
	    comp.find(".datagrid-header-row  td").css("background", hex2rgb(convertColorToHex(temp.m_headerchromecolor), temp.m_headerrowopacity));
	}
	/** Header text align property to control column names text align using script for BDD-720 */
	if(!IsBoolean(temp.m_usefieldalign)) {
		comp.find(".datagrid-header-row td div").css("text-align", temp.m_headertextalign);
	}
	comp.find(".tree-title").css({
		"font-weight": temp.m_labelfontweight,
		"font-size": temp.fontScaling(temp.m_labelfontsize) + "px",
		"font-family": selectGlobalFont(temp.m_labelfontfamily),
		"font-style": temp.m_labelfontstyle,
		"text-decoration": temp.m_labeltextdecoration,
		"color": convertColorToHex(temp.m_labelfontcolor)
	});
	for (var i = 0, length = temp.m_colHeadersFieldName.length; i < length; i++) {
		if (IsBoolean(temp.m_enableColumnStyleArr[i]) && (temp.m_hieraryFields[i]!==undefined)) {
			if((temp.m_colHeadersFieldName[i] == temp.m_hieraryFields[i].fieldName)){
				comp.find('.datagrid-body td[field ="name"] .tree-title').css({
					"color": convertColorToHex(temp.m_fontColorArr[i]),
					"font-size": temp.fontScaling(temp.m_fontSizeArr[i]) + "px",
					"font-style": temp.m_fontStyleArr[i],
					"font-weight": temp.m_fontWeightArr[i],
					"font-family": selectGlobalFont(temp.m_fontFamilyArr[i]),
				});
			}
		};
	};
	if(IsBoolean(this.m_textwrap))	{
		comp.find(".tree-title").css({
			"display": "initial",
			"white-space": "pre-wrap" 
		});
	}
    // @description setting vertical and horizontal gridline color
	if (IsBoolean(temp.m_showhorizontalgridlines)) {
        comp.find(".datagrid-header td").css({
            "border-top": "1px solid " + hex2rgb(temp.m_horizontalgridlinecolor, temp.m_rowlinesopacity),
            "border-right": "1px solid " + hex2rgb(temp.m_verticalgridlinecolor, temp.m_rowlinesopacity),
            "border-bottom": "1px solid " + hex2rgb(temp.m_horizontalgridlinecolor, temp.m_rowlinesopacity),
            "border-left": "0px solid " + hex2rgb(temp.m_verticalgridlinecolor, temp.m_rowlinesopacity)
        });
        comp.find(".datagrid-header tr").find("td:first").css({
        	"border-left": "1px solid " + hex2rgb(temp.m_verticalgridlinecolor, temp.m_rowlinesopacity)
        });
        comp.find(".datagrid-body tr.datagrid-row").find("td").css({
            "border-right": "1px solid " + hex2rgb(temp.m_verticalgridlinecolor, temp.m_rowlinesopacity),
            "border-bottom": "1px solid " + hex2rgb(temp.m_horizontalgridlinecolor, temp.m_rowlinesopacity),
            "border-width": "0px 1px 1px 0px"
        });
        comp.find(".datagrid-body tr.datagrid-row").find("td:first").css({
            "border-left": "1px solid " + hex2rgb(temp.m_verticalgridlinecolor, temp.m_rowlinesopacity)
        });
    } else {
        comp.find(".datagrid-header td").css({
        	"border-right": "1px solid " + hex2rgb(temp.m_verticalgridlinecolor, temp.m_rowlinesopacity),
			"border-width": "0px 1px 0px 0"
        });
        comp.find(".datagrid-header tr").find("td:first").css({
        	"border-left": "1px solid " + hex2rgb(temp.m_verticalgridlinecolor, temp.m_rowlinesopacity)
        });
        comp.find(".datagrid-body tr.datagrid-row").find("td").css({
            "border-right": "1px solid " + hex2rgb(temp.m_verticalgridlinecolor, temp.m_rowlinesopacity),
            "border-width": "0px 1px 0px 0px"
        });
        comp.find(".datagrid-body tr.datagrid-row").find("td:first").css({
            "border-left": "1px solid " + hex2rgb(temp.m_verticalgridlinecolor, temp.m_rowlinesopacity)
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
	comp.find("div.datagrid-wrap.panel-body.panel-body-noheader").css({
    	"border": "1px solid" + hex2rgb(convertColorToHex(temp.m_verticalgridlinecolor), temp.m_rowlinesopacity),
    	"border-radius": "0px",
    	"background": "transparent"
    });
	
	if (IsBoolean(this.m_textwrap)) {
		comp.find("td div.datagrid-cell").css({
			"white-space": "normal",
			"word-wrap": "break-word",
			"height": "auto"
		});/*changed white space property from nowrap to normal, as nowrap will not allow text to wrap in next line*/
		comp.find(".datagrid-header td span").css({
			"white-space": "normal",
       		"word-wrap": "break-word"
        });
	}
	
	/** indents the sub nodes of score card when the subnode is wrapped **/
	comp.find(".tree-title").each(function(){
		var parent = (this.parentElement);
		var counter = $(parent).find(".tree-indent").length;
		var width = (counter != undefined) ? 
				(counter == 0) ? "84%" : 
					(counter == 1) ? "74%" : 
						(counter == 2) ? "62%" : 
							(counter == 3) ? "50%" : "40%" : "90%";
		$(this).css({"width": width, "display": "inline-table"});
	});
	this.applyAdditionalStyles();
};

/** @description setting rows alternative and header color**/
ScoreCard.prototype.setGridColors = function () {
	var temp = this;
	var gridColors = this.getRowAltColors();
	this.setSelectedRowCSS();
	$("#" + temp.m_componentid).find(".datagrid-row").hover(
		function () {
			$(this).css("background", hex2rgb(convertColorToHex(temp.m_rollovercolor), temp.m_rowhoveropacity));
		},
		function () {
			temp.setSelectedRowCSS();
	});
};
/** @description setting CSS for selected row **/
ScoreCard.prototype.setSelectedRowCSS = function () {
	var temp = this;
	var gridColors = this.getRowAltColors();
	$("#" + temp.m_componentid).find(".datagrid-btable").each(function () {
		var i = 0;
		var children = $(this).children("tbody").children("tr");
		for (var z = 0, length = children.length; z < length; z++) {
			var attr = $(children[z]).attr("node-id");
			if (attr != undefined && attr != false) {
				i++;
				if (i % 2 == 0)
					$(children[z]).css("background", hex2rgb(convertColorToHex(gridColors[2]), temp.m_rowopacity));
				else
					$(children[z]).css("background", hex2rgb(convertColorToHex(gridColors[1]), temp.m_rowopacity));
			}
		}
	});
	setTimeout(function(){
		$("#" + temp.m_componentid).find(".datagrid-row-selected").css("background", hex2rgb(convertColorToHex(temp.m_selectedrowcolor), temp.m_rowselectedopacity));
	},1);
};
ScoreCard.prototype.getRowAltColors = function () {
	var temp = this; //m_selectedrowcolor  m_rollovercolor
	if (this.m_alternaterowscolor != undefined) {
		var gridColors = this.m_alternaterowscolor.split(",");
		if (gridColors.length == 1) {
			gridColors.push(gridColors[0]);
		}
		var newArr = ["#ffffff"];
		for (var i = 0; i < gridColors.length; i++)
			newArr.push(convertColorToHex(gridColors[i]));
		gridColors = newArr;
	} else {
		var gridColors = this.m_gridcolor.split(",");
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
	return gridColors;
};
/** @description Getter of Gradient**/
ScoreCard.prototype.getShowGradient = function () {
	return this.m_showgradient;
};

/** @description Checking is series Data Empty**/
ScoreCard.prototype.isSeriesDataEmpty = function () {
	if (this.m_seriesData == "") {
		this.m_isEmptySeries = true;
	} else {
		this.m_isEmptySeries = false;
	}
};

ScoreCard.prototype.isEmptyField = function () {
	if(this.m_fieldsJson == 0)
		this.m_isEmptyField = true;
	else
		this.m_isEmptyField = false;	
};

ScoreCard.prototype.isVisibleField = function() {
    this.m_isVisibleField = true;
    if (IsBoolean(this.fieldNameArr)) {
        for (var i = 0; i < this.fieldNameArr.length; i++) {
            if (IsBoolean(this.m_seriesVisibleArr[this.fieldNameArr[i]]))
                this.m_isVisibleField = false;
        }
    }
};

ScoreCard.prototype.IsDrawingPossible = function () {
	var map = {};
	if (!IsBoolean(this.m_isEmptyField)) {
		if (!IsBoolean(this.m_isVisibleField))
			map = {
				"permission": "true",
				message: this.m_status.success
			};
		else
			map = {
				"permission": "false",
				message: this.m_status.noField
			};
	} else {
		map = {
			"permission": "false",
			message: this.m_status.noData
		};
	}
	return map;
};

/** @description Getter of Category Names**/
ScoreCard.prototype.getCategoryNames = function () {
	return this.getDataSet().getFieldbyCategory();
};

/** @description Getter of Series Names**/
ScoreCard.prototype.getSeriesNames = function () {
	return this.getDataSet().getFieldbySeries();
};

/** @description Getter of StartValueNames**/
ScoreCard.prototype.getStartValueNames = function () {
	return this.getDataSet().getFieldByStartValue();
};

/** @description Getter of DataSet**/
ScoreCard.prototype.getDataSet = function () {
	return this.m_dataSet;
};

/** @description Setter of DataSet**/
ScoreCard.prototype.setDataSet = function (dataSetObject) {
	this.m_dataSet = dataSetObject;
};

/** @description Getter of EndValueName**/
ScoreCard.prototype.getEndValueNames = function () {
	return this.getDataSet().getFieldByEndValue();
};

/** @description initialization of data class**/
ScoreCard.prototype.initializeData = function () {
	this.createDataObject();
	this.m_dataStore.initialize();
};

/** @description creating DataObject**/
ScoreCard.prototype.createDataObject = function () {
	if (this.m_dashboard.getDataProviders().getDataURL()[0].getType() === "offline") {
		this.m_dataStore = new NividhOffLineData(this);
	} else {
		this.m_dataStore = new NividhOnLineData(this);
	}
};

/** @description get Connection Details**/
ScoreCard.prototype.getConnectionDetails = function () {
	var nivConnIdfromDataSet = this.getDataSet().getDataSource();
	var connObj = this.m_dashboard.getManageConObj().getConnectionMap()[nivConnIdfromDataSet];
	return connObj;
};

/** @description notify the data **/
ScoreCard.prototype.notify = function (valArr) {
	this.m_dataStore.getData(valArr);
};

/** @description Setter of Summary Collection **/
ScoreCard.prototype.setSummaryCollection = function (summaryCollectionObj) {
	this.m_summarycollection = summaryCollectionObj;
};

/** @description Setter of  Alert Object**/
ScoreCard.prototype.setAlerts = function (alertsObj) {
	this.m_alerts = alertsObj;
};

/** @description setter of value object **/
ScoreCard.prototype.setValue = function (valueObj) {
	this.m_value = valueObj;
};

/** @description setter of TitleWindow Object **/
ScoreCard.prototype.setTitleWindow = function (titleWindowObj) {
	this.m_titlewindow = titleWindowObj;
};
/** @description setter of SubTitle object  **/
ScoreCard.prototype.setSubTitle = function (subTitleObj) {
	this.m_subTitle = subTitleObj;
};

/** @description setter of field Alert color**/
ScoreCard.prototype.setAlertColor = function (alertColorObj) {
	this.m_alertcolor.push(alertColorObj);
};

/** @description setter of Percent Value **/
ScoreCard.prototype.setPercentValue = function (percentValueObj) {
	this.m_percentvalue.push(percentValueObj);
};

/** @description setter of compareIndex **/
ScoreCard.prototype.setCompareIndex = function (compareIndexObj) {
	this.m_compareindex.push(compareIndexObj);
};

/** @description Getter Field Object **/
ScoreCard.prototype.getfieldsObj = function () {
	return this.m_fieldsObj;
};

/** @description Getter of XML Data **/
ScoreCard.prototype.getXMLData = function () {
	var connectionId = this.getDataSet().getDataSource();
	var xmlDataObj = this.m_dashboard.getXMLData(connectionId);
	return xmlDataObj;
};

/** @description Getter of Global Key **/
ScoreCard.prototype.getGlobalKey = function () {
	return this.m_globalkey;
};

/** @description drawing of Excel Export **/
ScoreCard.prototype.drawExportToExcel = function () {
	if (IsBoolean(this.m_isDataSetavailable)) {

		var HeadByDisplayname = this.getDataSet().getFieldsByDisplayName();
		var xlsString = "";
		for (var i = 0, length = HeadByDisplayname.length; i < length; i++) {
			xlsString = xlsString + HeadByDisplayname[i] + "\t";
		}
		xlsString = xlsString + "\r\n";

		for (var i2 = 0, outerLength = this.m_seriesData.length; i2 < outerLength; i2++) {
			for (var j2 = 0, innerLength = this.m_seriesData[i2].length; j2 < innerLength; j2++) {
				xlsString = xlsString + this.m_seriesData[i2][j2] + "\t";
			}
			xlsString = xlsString + "\r\n";
		}

		var link = document.createElement("a");
		link.setAttribute("id", "anchor");
		link = document.body.appendChild(link);
		//var anchorobj=document.getElementById("anchor");
		link.download = this.m_objectname + "_ExcelExport.xls";
		link.href = "data:application/...," + encodeURIComponent(xlsString);
		link.click();

	}
};

/** @description getter of Title **/
ScoreCard.prototype.getTitle = function () {
	return this.m_title1;
	//return this.m_title;
};
/** @description Getter of ToolTip Data **/
ScoreCard.prototype.getToolTipData = function (mouseX, mouseY) {
	var data = [];
	return data;
};
/****************************************Aters and Formatter*************************************************************/

/** @description drawing of Alerts inside the grid cell **/
ScoreCard.prototype.drawAlertImages = function(colName, colIndex, val, row, DynamicColName) {
    if (Object.prototype.toString.call(val) === "[object Array]") {
        if (val.length == 0)
            return val;
    }
    var temp = this;
    var formattedValue = val;
    if (!IsBoolean(this.m_isFixedLabelArr[colName]) && this.m_formatterArr[colName] != "none" && this.m_formatterArr[colName] != ""){
        formattedValue = this.FormatCellValue(colName, colIndex, val, row); //colName,colIndex,value , row
    }
    var showTooltip = this.m_tooltipColumnsArr[colName];
    var toolTipInfo = {
    	    "colName": colName,
    	    "row": row,
    	    "tooltipValue": formattedValue
    	};
    	var toolTipformattedvalue = "";
    	if (this.m_TooltipFieldsArr[colName].length > 0) {
    	   toolTipformattedvalue = this.getCustomTooltipData(toolTipInfo, row);
    	}
    if(temp.getAlertObj()[this.getStringARSC(colName)].m_mode == "Range"){ // && IsBoolean(temp.getAlertObj()[this.getStringARSC(colName)].getDynamicRange())
    	if(val == undefined){
    		/*It will Remove the additional undefined rows and will add blank value there*/
    		return "";
    	}else{
    		if (this.m_fieldaggregation[colName] == "none") {
    		    if (row.children == undefined) {
    		        return this.getAlertObj()[this.getStringARSC(colName)].drawDynamicAlert(colName, colIndex, val, row, DynamicColName, formattedValue, showTooltip, toolTipformattedvalue);
    		    } else {
    		        // Do nothing,for parent field no need to draw alert when column aggregation type is none
    		    }
    		} else {
    		    return this.getAlertObj()[this.getStringARSC(colName)].drawDynamicAlert(colName, colIndex, val, row, DynamicColName, formattedValue, showTooltip, toolTipformattedvalue);
    		}
    	}
    }else{
	    for (var key in row) {
	        if (key == this.getStringARSC(colName) && val == row[key] && temp.getAlertObj()[key] != undefined) {
	            var compareColName = temp.getAlertObj()[key].m_comparecolumn;
	            var compareColData = "";
	            if (compareColName != "" && compareColName != undefined) {
	                compareColData = row[this.getStringARSC(compareColName)];
	            }
	            if(key == "name" && IsBoolean(this.m_gridcustomtooltip)){
	            	return temp.getAlertObj()[key].drawAlerts(compareColData, val, temp, key, "", formattedValue, colIndex, false, toolTipformattedvalue);
	            } else {
	            	return temp.getAlertObj()[key].drawAlerts(compareColData, val, temp, key, "", formattedValue, colIndex, showTooltip, toolTipformattedvalue);
	            }
	            //return temp.getAlertObj()[key].drawAlerts(compareColData, val, temp, key, "", formattedValue, colIndex, showTooltip, toolTipformattedvalue);
	        }
	    }
    }
};

/** @description checking for Null values if Null value comes return the null otherwise passing for Formatting **/
ScoreCard.prototype.FormatCellValue = function (colName, colIndex, value, row) {
	var temp = this;
	for (var key in row) {
		// call temp.getStringARSC() method for remove space and replace with underscore(_)
		if (value == row[key] && key == temp.getStringARSC(colName)) {
			if (value === "" || value == "NIL" || value == "null"|| (temp.m_fieldaggregation[colName] == "count")) {
				return value;
			} else {
				return temp.getFormattedCellValue(value, colName, colIndex);
			}
		}
	}
};

/** @description format grid cell value according to given formatter in the fields **/
ScoreCard.prototype.getFormattedCellValue = function (value, colName, index) {
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
				valueToBeFormatted =  getFormattedNumberWithCommas(valueToBeFormatted,this.m_numberFormatColumnsArr[colName]);
				 /* To add Currency formatter */
				valueToBeFormatted = (valueToBeFormatted == "NaN" || valueToBeFormatted == "") ? "" : this.m_util.addFormatter(IsBoolean(isCommaSeparated) ? getNumberWithCommas(valueToBeFormatted) : valueToBeFormatted, formatterSymbol, signPosition);
				return valueToBeFormatted;
		} else
			return (valueToBeFormatted == "NaN") ? value : valueToBeFormatted;
	} else
		return value;
};

/** @description placeholder method when no dataset assigned **/
ScoreCard.prototype.getToolTip = function (tooltipContent) {
	var temp = this;
	var zindex = $("#draggableDiv" + temp.m_objectid).css("z-index");
	$("#toolTipDiv").remove();
};

ScoreCard.prototype.setTreeGridWithPivotingData = function() {
    this.m_gridheaderNames = this.m_dynamicHeaderName; 
    var uniqueKey = this.getIdField();
    var fixedField = this.m_fixedfield;
    var map = {};
    for (var i = 0; i < this.m_seriesData.length; i++) {
        if (this.m_seriesData[i][fixedField] != "") {
            if (map[this.m_seriesData[i][uniqueKey]] == undefined) {
                map[this.m_seriesData[i][uniqueKey]] = {};
                for (var key in this.m_seriesData[i]) {
                    if (key != this.getParentField() && key != uniqueKey && key != fixedField && key != this.getTreeField()) {
                        map[this.m_seriesData[i][uniqueKey]][key + 'MAUKA' + this.m_seriesData[i][fixedField]] = this.m_seriesData[i][key];
                    } else {
                        map[this.m_seriesData[i][uniqueKey]][key] = this.m_seriesData[i][key];
                    }
                }
            }

            for (var j = 0; j < this.m_seriesData.length; j++) {
                if (this.m_seriesData[j][uniqueKey] == this.m_seriesData[i][uniqueKey] && i != j) {

                    for (var key1 in this.m_seriesData[j]) {
                        for (var m = 0; m < this.m_gridheaderNames.length; m++) {
                            if (this.m_gridheaderNames[m] == key1)
                                map[this.m_seriesData[i][uniqueKey]][key1 + 'MAUKA' + this.m_seriesData[j][fixedField]] = this.m_seriesData[j][key1];
                        }

                    }
                }
            }
        }
    }
    return map;
};
ScoreCard.prototype.getTreeData = function(map) {
    var mapArray = [];
    for (var key in map) {
        var newMap = {};
        for (var key1 in map[key]) {
            var store = key1;
            key1 = key1.replace("/", "-");

            if (key1 == this.getParentField())
                newMap["_parentId"] = Number(map[key][store]);
            else
                newMap[key1] = map[key][store];
        }
        mapArray.push(newMap);
    }
    this.m_finalData = mapArray;
    //this.removeFileContainingColumn();
    var Data = JSON.stringify(mapArray);
    var finalData = '{"rows":' + Data + '}';
    return (JSON.parse(finalData));
};
ScoreCard.prototype.getColumnHeadsWithPivoting = function(data) {
    var headerNames = this.m_dynamicHeaderName;
    var headerDisplayName = this.m_dynamicHeaderDisplayName;
    var columnHeads = [];
    var columnHeads1 = [];
    var trackerMap = {};
    this.m_gridheaderNames = [];
    this.m_gridheaderDisplayNames = [];
    this.m_gridheaderNames = [];
    this.m_gridheaderDisplayNames = [];
    this.m_gridheaderNames.push(this.getTreeField());
    this.m_gridheaderDisplayNames.push(this.m_treefieldDisplayName);
    this.m_gridHeaderWidthArr = [120];
    var columnName = [];

    for (var key1 in data) {
        for (var key in data[key1]) {

            columnName.push(key);
        }
    }
    var unique = columnName.filter(function(itm, i, columnName) {
        return i == columnName.indexOf(itm);
    });

    for (var l = 0; l < headerNames.length; l++) {
        var count = 0;
        if (IsBoolean(this.m_visibleArr[headerNames[l]])) {
			this.m_gridheaderNames.push(headerNames[l]);
			this.m_gridheaderDisplayNames.push(headerDisplayName[l]);
			this.m_gridHeaderWidthArr.push(this.m_widthArr[headerNames[l]]);
			for (var m = 0; m < unique.length; m++) {
				if (unique[m].indexOf(headerNames[l]) != -1) {
					count++;
					this.m_gridheaderNames.push(unique[m]);
					this.m_gridheaderDisplayNames.push(unique[m]);
					this.m_gridHeaderWidthArr.push(this.m_widthArr[headerNames[l]]);
				}
			}
			trackerMap[headerNames[l]] = count;
        }
    }
    for (var i = 0; i < this.m_gridheaderNames.length; i++) {
        var headerName = this.m_gridheaderNames[i].replace("/", "-");
        if (this.m_gridheaderNames[i].indexOf("MAUKA") != -1)
            var displayName = this.m_gridheaderDisplayNames[i].split("MAUKA")[1];
        else
            var displayName = this.m_gridheaderDisplayNames[i];

        var width = this.m_width / this.m_gridheaderNames.length;
        if (i == 0)
            columnHeads.push({
                field: this.m_gridheaderNames[i],
                rowspan: 2,
                title: displayName,
                halign: 'center',
                width: 120,
                align: 'center',
                sortable: true
            });

        else if (this.isInit(headerNames, this.m_gridheaderNames[i])) {
            columnHeads.push({
                colspan: trackerMap[this.m_gridheaderNames[i]],
                title: displayName,
                halign: 'center'
            });
        } else
            columnHeads1.push({
                field: headerName,
                title: displayName,
                halign: 'center',
                width: this.m_gridHeaderWidthArr[i],
                align: 'center',
                sortable: true
            });


			/**DAS-1221 @desc custom sroting method for case sensitive strings when column type as none*/
				if (this.m_hierarchyTypeArr[i] == "none") {
					columnHeads1.push({
						sorter : function(a, b) {
									return temp.sortStringCaseSensitive(a,b);
								}
					            });
					columnHeads.push({
						sorter : function(a, b) {
									return temp.sortStringCaseSensitive(a,b);
								}
					            });
				}
    }
    return [columnHeads, columnHeads1];
};
//@descrption to compare strings parts (case Sensitive)
ScoreCard.prototype.sortStringCaseSensitive = function(a, b) {
	if (a == null && b == null) return 0;
	if (a == null) return -1;
	if (b == null) return 1;
	
	// Extract first element if a or b is an array
	if (Array.isArray(a)) a = a[0];
	if (Array.isArray(b)) b = b[0];
	
	if (typeof a === 'string') a = a.toLowerCase();
	if (typeof b === 'string') b = b.toLowerCase();
	
	if (a < b) return -1;
	if (a > b) return 1;
	return 0; 
};
ScoreCard.prototype.isInit = function(arry, specialword) {
    var found = false;
    for (var i = 0; i < arry.length && !found; i++) {
        if (arry[i] === specialword) {
            found = true;
        }
    }
    return found;
};
ScoreCard.prototype.getParentField = function() {
    var field = "";
    for (var i = 0; i < this.fieldsData.length; i++) {
        if (this.m_typeArr[this.fieldsData[i].Name] == "parent") {
            field = this.fieldsData[i].Name;
        }
    }
    return field;
};
ScoreCard.prototype.setDynamicHeader = function() {
    this.m_dynamicHeaderName = [];
    this.m_dynamicHeaderDisplayName = [];
    var count = 0;
    for (var i = 0; i < this.m_gridFieldNames.length; i++) {
        if (this.m_hierarchyTypeArr[i].toLowerCase() == "none") {
        	if (count > 0) {
        		this.m_dynamicHeaderName.push(this.m_gridFieldNames[i]);
        		this.m_dynamicHeaderDisplayName.push(this.m_gridHeaderNames[i])
        	}
        	count++;
        }
    }
};
/** @description setter of fixed Field **/
ScoreCard.prototype.setFixedField = function () {
	var count = 0;
	for (var i = 0, length = this.m_gridFieldNames.length; i < length; i++) {
		if ((this.m_hierarchyTypeArr[i]).toLowerCase() == "child") {
			if (count == 1) {
				this.m_fixedfield = this.m_gridFieldNames[i];
				break;
			}
			count++; 
		}
	}
};
ScoreCard.prototype.IsDrawingPossibleOfTreePivot = function () {
	var map = {};
	if (this.m_fixedfield && this.m_fixedfield != "" && this.m_dynamicHeaderName && this.getTreeField() != "") {
		map = {
				"permission": "true",
				message: this.m_status.success
			};
	} else {
		map = {
			"permission": "false",
			message: this.m_status.invalidConfig
		};
	}
	return map;
};
//# sourceURL=ScoreCard.js

