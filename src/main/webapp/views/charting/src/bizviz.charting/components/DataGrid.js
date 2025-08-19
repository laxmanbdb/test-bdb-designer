/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: DataGrid.js
 * @description Parent class of all datagrid components 
 **/
function DataGrid() {
	this.base = Widget;
	this.base();

	this.plugin = new Plugin();

	this.m_compareindices = "";
	this.m_id = "";
	this.m_rowheight = "";
	this.m_url = "";
	this.m_maxrowcount = "";
	/** 20 - when maximized the number of roww showing in one page **/
	this.m_rowcount = "10";
	/** 7- maximumm number of row when grid is showing with other charts, i.e. not maximized **/
	this.m_labelfontfamily = "Roboto";
	this.m_datagridtype = "";
	this.m_colorbycomparison = "";
	this.m_alerttype = "";
	this.m_title = "";
	this.m_valuesgood = "";
	this.m_alertcolors = "";
	this.m_showgradient = "";
	this.m_labeltextdecoration = "";
	this.m_name = "";
	this.m_labelfontsize = "";
	this.m_fontweight = "";
	this.m_xmlwithcolorcolumn = "";
	this.m_labelfontstyle = "";
	this.m_textdecoration = "";
	this.m_labelfontweight = "";
	this.m_gaugeclickenable = "";
	this.m_labelfontcolor = "";
	this.m_fontcolor = "";
	this.m_gaugeorder = "1";

	this.m_alertvalues = "";
	this.m_alertwithdata = "";
	this.m_alertundefinedcolor = "rgb(204, 204, 204)";
	this.m_percentval = "";
	this.m_fontfamily = "";
	this.m_showtitle = "true";
	this.m_showsubtitle = "true";
	this.m_fontstyle = "";
	this.m_gradientcolor = "";
	this.m_globalkey = "";
	this.m_showborder = "";
	this.m_fontsize = "";
	this.m_align = "";
	this.m_showinfobutton = "";

	this.m_declinefillcolor = "#f1f1f1";

	this.m_languageMapping = "";

	this.m_alertObj = new Object();
	this.m_fieldsObj;

	this.m_chartFrame = new ChartFrame();
	this.m_title = new Title(this);
	this.m_subTitle = new SubTitle();
	this.m_linkbutton = new LinkButton();
	this.m_column = new Column();
	this.m_datagridstyles = new DatagridStyles();
	this.m_rowdata = new RowData();
	this.m_linkbar = new LinkBar();
	this.m_alerts = new Alerts();

	this.m_dashboard = "";
	this.m_isEmptySeries = true;
	this.m_showexceldownload = "true";
	
	/**For disabling the default background color*/
	this.m_usefieldcolorasheader = "false";

	/** @description new header attributes of .bizviz files **/
	this.m_headersymbolcolor = "#000";
	this.m_headerchromecolor = "#2E64FE";
	this.m_usefieldalign = true;
	this.m_headertextalign = "center";
	this.m_headertextdecoration = "normal";
	this.m_headerfontfamily = "Roboto";
	this.m_headerfontsize = "12";
	this.m_headerfontstyle = "normal";
	this.m_headerfontweight = "normal";
	this.m_headerfontcolor = "#ff0000";

	this.m_bggradientrotation = "0";
	this.m_bgalpha = "1";
	this.m_bggradients = "#ffccff";
	this.m_textwrap = true;
	
	this.m_defaultalertcolor = "#e0dfdf";
	/** Show data for grid is not relevant **/
	this.m_exporttogrid = false;
	this.m_adjustpixel = 1;
	this.m_gridcustomtooltip = false;
	this.m_updateddesign = false;
	this.m_titletextwrap = true;
	this.m_subtitletextwrap = true;
};

/** @description Making prototype of Widget class and inheriting Method and property into DataGrid**/
DataGrid.prototype = new Widget;

/** @description: Method will remove special char from a string, useful for column headers name containing special characters **/
DataGrid.prototype.getStringARSC = function (str) {
	return (str) ? (str.toString()).replace(/[^a-z0-9\s]/gi, "").replace(/[_\s]/g, "_") : str;
};

/** @description Getter of BGAlpha**/
DataGrid.prototype.getBGAlpha = function () {
	return this.m_bgalpha;
};

/** @description Setter of BGAlpha**/
DataGrid.prototype.setBGAlpha = function (m_bgalpha) {
	this.m_bgalpha = m_bgalpha;
};

/** @description Getter of BGGradients**/
DataGrid.prototype.getBgGradients = function () {
	return this.m_bggradients;
};

/** @description Getter of ShowExcelDownload**/
DataGrid.prototype.getShowExcelDownload = function () {
	return this.m_showexceldownload;
};

/** @description Getter of ID**/
DataGrid.prototype.getID = function () {
	return this.m_id;
};

/** @description Setter of ID**/
DataGrid.prototype.setID = function (m_id) {
	this.m_id = m_id;
};

/** @description Getter of Type**/
DataGrid.prototype.getType = function () {
	return this.m_type;
};

/** @description Setter of Type**/
DataGrid.prototype.setType = function (m_type) {
	this.m_type = m_type;
};

/** @description Getter of ChartType**/
DataGrid.prototype.getGridType = function () {
	return this.m_charttype;
};

/** @description Setter of GridType**/
DataGrid.prototype.setGridType = function (m_gridtype) {
	this.m_gridtype = m_gridtype;
};

/** @description Getter of Calculus*/
DataGrid.prototype.getCalculus = function () {
	return this.m_calculus;
};

/** @description Setter of Calculus*/
DataGrid.prototype.setCalculus = function (m_calculus) {
	this.m_calculus = m_calculus ;
};
/** @description draw ChartFrame,Title**/
DataGrid.prototype.drawObject = function () {
	this.ctx.clearRect(this.m_x, this.m_y, this.m_width, this.m_height);
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_chartFrame.drawFrame();
	this.m_title.draw();
	this.drawMessage(this.m_status.noDataset);
};
/** @description draw a message on canvas when no data available in chart **/
DataGrid.prototype.drawMessage = function (text) {
	this.ctx.beginPath();
	this.ctx.fillStyle = convertColorToHex(this.m_statuscolor);
	this.ctx.font = this.m_statusfontsize+"px "+selectGlobalFont(this.m_statusfontfamily);
	this.ctx.textAlign = "left";
	var textWidth = this.ctx.measureText(text).width;
	var margin = this.m_width - textWidth;
	this.ctx.fillText(text, this.m_x * 1 + margin / 2, this.m_y * 1 + this.m_height / 2);
	this.ctx.fill();
	this.ctx.closePath();
};
/** @description initialize the DataGrid Alerts Calculation **/
DataGrid.prototype.initDataGridAlerts = function () {
	for(var key in this.getAlertObj()){
		if(this.getAlertObj()[key]){
			this.getAlertObj()[key].init(this);
		}
	}
};
/** @description returns height after calculating scaling **/
DataGrid.prototype.getRowHeight = function(m_rowheight) {
    return this.fontScaling( (m_rowheight == undefined || m_rowheight === "" || m_rowheight == "0") ? 25 : m_rowheight );
};
/** @description Calling the Init of Grid and Drawing.**/
DataGrid.prototype.draw = function () {
	try{
		this.init();
		this.drawChart();
		if(this.m_onafterrendercallback!="")
			onAfterRender(this.m_onafterrendercallback);
		if (this.plugin != undefined && this.plugin != null) {
			this.plugin.initPlugin(this);
		}
	}catch(e){
		console.log("Error in drawing of component "+this.m_objectname+" !");
		console.log(e);
	}
};

/** @description Getter of ObjectType**/
DataGrid.prototype.getType = function () {
	return this.m_objecttype;
};

/** @description Getter of showexceldownload**/
DataGrid.prototype.getShowExcelDownload = function () {
	return this.m_showexceldownload;
};

/** @description Getter of Alert Object**/
DataGrid.prototype.getAlertObj = function () {
	return this.m_alertObj;
};

/** @description Getter of field Object**/
DataGrid.prototype.getfieldsObj = function () {
	return this.m_fieldsObj;
};

/** @description Getter of alertType**/
DataGrid.prototype.getAlertType = function () {
	return this.m_alerttype;
};

/** @description Getter of GlobalKey**/
DataGrid.prototype.getGlobalKey = function () {
	return this.m_globalkey;
};

/** @description Getter of CategoryNames**/
DataGrid.prototype.getCategoryNames = function () {
	return this.getDataSet().getFieldbyCategory();
};

/** @description Getter of Series Names**/
DataGrid.prototype.getSeriesNames = function () {
	return this.getDataSet().getFieldbySeries();
};

/** @description Getter of FieldNames**/
DataGrid.prototype.getFieldNames = function () {
	return this.getDataSet().getFieldNames();
};

/** @description Getter of XMLData Object**/
DataGrid.prototype.getXMLData = function () {
	var connectionId = this.getDataSet().getDataSource();
	var xmlDataObj = this.m_dashboard.getXMLData(connectionId);
	return xmlDataObj;
};

/** @description Get array of JSON data **/
DataGrid.prototype.getDataFromJSON = function () {
	var data = [];
	for (var i = 0; i < this.getDataProvider().length; i++) {
		if (this.getDataProvider()[i] == undefined || this.getDataProvider()[i] == "undefined")
			data[i] = "";
		else
			data[i] = this.getDataProvider()[i];
	}
	return data;
};

DataGrid.prototype.drawLegends = function () {
	this.drawChartLegends();
	this.drawLegendComponent();
}; 

DataGrid.prototype.drawChartLegends = function () {
	/** Do nothing */
};

/** @description this methods checks the series data is available or not **/
DataGrid.prototype.isSeriesDataAvailable = function(legendObj) {
	if(IsBoolean(legendObj.associatedChartObject.m_isrepeater)){
		return true;
	}else{
		if (legendObj.associatedChartObject.m_seriesData.length > 0) {
			return true;
		} else {
			return false;
		}
	}
};
DataGrid.prototype.drawLegendComponent = function () {
	if (!IsBoolean(this.m_designMode)) {
		if (IsBoolean(this.m_legendFlag) || this.m_legendFlag == undefined) {
			var legendObj = this.getLegendComponentObj();
			if (legendObj != undefined && IsBoolean(this.isSeriesDataAvailable(legendObj))) {
				legendObj.drawObject();
//				this.m_legendFlag = false;
				//this.m_legendFlag = false;
			} else {
				if (legendObj != undefined)
				$("#LegendContainerDiv" + legendObj.m_objectid).remove();
			}
		} else {
			this.m_legendFlag = true;
		}
	}
};

DataGrid.prototype.getLegendComponentObj = function () {
	if (this.m_associatedlegendid != undefined && this.m_associatedlegendid != "" && IsBoolean(!this.m_designMode)) {
		for (var i = 0; i < this.m_dashboard.m_widgetsArray.length; i++) {
			if (this.m_associatedlegendid == this.m_dashboard.m_widgetsArray[i].m_objectid) {
				return this.m_dashboard.m_widgetsArray[i];
			}
		}
	}
};

/** @description Is Series Data Empty**/
DataGrid.prototype.isSeriesDataEmpty = function () {
	if (this.m_seriesData == "") {
		this.m_isEmptySeries = true;
	} else {
		this.m_isEmptySeries = false;
	}
};

DataGrid.prototype.isEmptyField = function () {
	if(this.m_fieldsJson == 0){
		this.m_isEmptyField = true;
	}else{
		this.m_isEmptyField = false;
	}
};

DataGrid.prototype.isVisibleField = function() {
    this.m_isVisibleField = true;
    if (IsBoolean(this.m_fieldName)) {
        for (var i = 0; i < this.m_fieldName.length; i++) {
            if (IsBoolean(this.m_seriesVisibleArr[this.m_fieldName[i]])){
                this.m_isVisibleField = false;
            	break;
            }
        }
    }
};

DataGrid.prototype.IsDrawingPossible = function () {
	var map = {};
	if (!IsBoolean(this.m_isEmptyField)) {
		if (!IsBoolean(this.m_isVisibleField)){
			if(!IsBoolean(this.m_isEmptySeries)){
				map = {
					"permission": "true",
					message: this.m_status.success
				};
			}else{
				map = {
					"permission": "false",
					message: this.m_status.noData
				};
			}
		}else{
			map = {
				"permission": "false",
				message: this.m_status.noField
			};
		}
	} else {
		map = {
			"permission": "false",
			message: this.m_status.noFields
		};
	}
	return map;
};

/** @description Getter of show Title**/
DataGrid.prototype.getShowTitle = function () {
	return this.m_showtitle;
};

/** @description Setter of SubTitleObject**/
DataGrid.prototype.setSubTitle = function (subtitleobj) {
	this.m_subTitle = subtitleobj;
};

/** @description Getter of subtitle**/
DataGrid.prototype.getSubTitle = function () {
	return this.m_subTitle;
};

/** @description Getter of gradient Color**/
DataGrid.prototype.getGradientColor = function () {
	return this.m_gradientcolor;
};

/** @description Getter of showgradient**/
DataGrid.prototype.getShowGradient = function () {
	return this.m_showgradient;
};

/** @description Setter of DatagridStyles**/
DataGrid.prototype.setDatagridStyles = function (DatagridStyles) {
	this.m_datagridstyles = DatagridStyles;
};

/** @description Getter of DatagridStyles**/
DataGrid.prototype.getDatagridStyles = function () {
	return this.m_datagridstyles;
};

/** @description Setter of Alerts**/
DataGrid.prototype.setAlerts = function (Alerts) {
	this.m_alerts.push(Alerts);
};

/** @description Getter of Alerts**/
DataGrid.prototype.getAlerts = function () {
	return this.m_alerts;
};

/** @description Storing RowData into class variable**/
DataGrid.prototype.setRowData = function (RowData) {
	this.m_rowdata = RowData;
};

/** @description Getter of RowData**/
DataGrid.prototype.getRowData = function () {
	return this.m_rowdata;
};

/** @description Setter of LinkBar**/
DataGrid.prototype.setLinkBar = function (LinkBar) {
	this.m_linkbar = LinkBar;
};

/** @description Getter of LinkBar**/
DataGrid.prototype.getLinkBar = function () {
	return this.m_linkbar;
};

/** @description Setter of LinkButton**/
DataGrid.prototype.setLinkButton = function (LinkButton) {
	this.m_linkbutton = LinkButton;
};

/** @description Getter of linkbutton**/
DataGrid.prototype.getLinkButton = function () {
	return this.m_linkbutton;
};

/** @description Setter of Column**/
DataGrid.prototype.setColumn = function (Column) {
	this.m_column = Column;
};

/** @description Getter of Column**/
DataGrid.prototype.getColumn = function () {
	return this.m_column;
};

/** @description Setter of Title**/
DataGrid.prototype.setTitle = function (Title) {
	this.m_title = Title;
};

/** @description Getter of Title**/
DataGrid.prototype.getTitle = function () {
	return this.m_title;
};

/** @description Setter of languageMapping**/
DataGrid.prototype.setLanguageMapping = function (languageMapping) {
	this.m_languageMapping = languageMapping;
};

/** @description Getter of languageMapping**/
DataGrid.prototype.getLanguageMapping = function () {
	return this.m_languageMapping;
};

/** @description Setter of DataSet**/
DataGrid.prototype.setDataSet = function (DataSet) {
	this.m_dataset = DataSet;
};

/** @description Getter of DataSet**/
DataGrid.prototype.getDataSet = function () {
	return this.m_dataset;
};
/** @description placeholder method when no dataset assigned **/
DataGrid.prototype.getToolTip = function (tooltipContent) {
	var temp = this;
	var zindex = $("#draggableDiv" + temp.m_objectid).css("z-index");
	$("#toolTipDiv").remove();
};
/** Sparkline Bullet type Configuration, can be overridden in dashboard script **/
DataGrid.prototype.getBulletConfig = function(config, name, dName) {
	config.type = 'bullet';
	config.targetWidth = 3;
	config.targetColor = '#006684';
	config.performanceColor = '#f89406';
	config.rangeColors = ['#e6e6e6','#d4d4d4','#c0c0c0','#b4b4b4'];
	config.tooltipValueLookups = { fields: {r: 'Range', p: dName, t: 'Target'} };
    return config;
};
/** Sparkline Configuration, can be overridden in dashboard script **/
DataGrid.prototype.getSparklineConfig = function(config, name, dName) {
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
/** Sparkline Configuration, can be overridden in dashboard script **/
DataGrid.prototype.getSparkColumnConfig = function(config, name, dName) {
	config.type = 'bar';
	config.barColor = "#86dff9";
	config.negBarColor = "#f89406";
	config.barSpacing = "1";
    config.zeroColor = "#e0dfdf";
    return config;
};
/** Sparkline Configuration, can be overridden in dashboard script **/
DataGrid.prototype.getSparkPieConfig = function(config, name, dName) {
	config.type = 'pie';
	config.offset = "-90";
	config.borderWidth = "1";
    config.borderColor = "#ffffff";
    return config;
};

/** @description Creating LinkButton Class**/
function LinkButton() {
	this.m_selectedcolor;
	this.m_textrollovercolor;
	this.m_id;
	this.m_textcolor;
	this.m_description;
	this.m_textselectedcolor;
	this.m_titrollovercolorle;
};

/** @description Creating Column Class**/
function Column() {
	this.m_columnwisefill;
	this.m_columnindeciesarray;
	this.m_columncolorarray;
};

/** @description DatagridStyles class**/
function DatagridStyles() {
	this.m_showhorizontalgridlines;
	this.m_enableitemrenderer;
	this.m_headercolors;
	this.m_alternaterowscolor;
	this.m_horizontalgridlinecolor;
	this.m_selectioncolor;
	this.m_verticalgridlinecolor;
	this.m_rollovercolor;
	this.m_texthovercolor;
	this.m_gridcolor = "#ffffff,#D9E5EC";
};

/** @description Getter of showhorizontalgridlines**/
DatagridStyles.prototype.showHorizontalGridLines = function () {
	return this.m_showhorizontalgridlines;
};

/** @description Getter of selection Color**/
DatagridStyles.prototype.getSelectionColor = function () {
	return convertColorToHex(this.m_selectioncolor);
};

/** @description Getter of VerticalGridLineColor**/
DatagridStyles.prototype.getVerticalGridLineColor = function () {
	return convertColorToHex(this.m_verticalgridlinecolor);
};

/** @description Getter of HorizontalGridLineColor**/
DatagridStyles.prototype.getHorizontalGridLineColor = function () {
	return convertColorToHex(this.m_horizontalgridlinecolor);
};

/** @description Getter of GridColor**/
DatagridStyles.prototype.getGridColor = function () {
	return this.m_gridcolor;
};

/** @description Getter of HeaderColors**/
DatagridStyles.prototype.getHeaderColors = function () {
	//	 if(this.m_headercolors!=undefined){
	//		 	var headerColorsArr=this.m_headercolors.split(",");
	//		 	var headerColArr=[];
	//		 	for(var i=0;i<headerColorsArr.length;i++)
	//		 		headerColArr.push(convertColorToHex(headerColorsArr[i]));
	//		 	return headerColArr;
	//	 }
	return this.m_headercolors;
};

/** @description Getter of Alternaterowscolor**/
DatagridStyles.prototype.getAlternateRowsColor = function () {
	//	 if(this.m_headercolors!=undefined){
	//		 var headerColorsArr=this.m_alternaterowscolor.split(",");
	//		 	var headerColArr=[];
	//		 	for(var i=0;i<headerColorsArr.length;i++)
	//		 		headerColArr.push(convertColorToHex(headerColorsArr[i]));
	//
	//		 	return headerColArr;
	//	 }
	return this.m_alternaterowscolor;
};

/** @description Getter of RollOverColor**/
DatagridStyles.prototype.getRollOverColor = function () {
	return convertColorToHex(this.m_rollovercolor);
};

/** @description Getter of TextHoverColor**/
DatagridStyles.prototype.getTextHoverColor = function () {
	return convertColorToHex(this.m_texthovercolor);
};

/** @description Creating RowData class**/
function RowData() {
	this.m_allindeciesarray;
	this.m_rowwisefill;
	this.m_rowindeciesarray;
};

/** @description Creating LinkBar Class**/
function LinkBar() {
	this.m_selectedcolor;
	this.m_linkbarcolor;
	this.m_textrollovercolor;
	this.m_seperatorcolor;
	this.m_textcolor;
	this.m_textselectedcolor;
	this.m_rollovercolor;
	this.m_texthovercolor
};

/** @description Creating Alerts Class**/
function Alerts() {
	this.m_alertColumn = [];
};

/** @description Setter of AlertColumns**/
Alerts.prototype.setAlertColumns = function (AlertColumn) {
	this.m_alertColumn.push(AlertColumn);
};

/** @description Getter of AlertColumns**/
Alerts.prototype.getAlertColumns = function () {
	return this.m_alertColumn;
};

/** @description Creating AlertColumn Class**/
function AlertColumn() {
	this.m_showalert;
	this.m_colors;
	this.m_fixedvalue;
	this.m_ranges;
	this.m_staticrange;
	this.m_operatorname;
	this.m_alerttype;
	this.m_equalitymode;
	this.m_fixedvaluecompare;
	this.m_comparecolumn;
	this.m_showdata;
	this.m_alertposition;
	this.m_alertsize=18;
	this.m_name;
	this.m_rangeColorsImages = [];
	this.m_pagingDg = "";
	this.m_chart = "";
	this.m_numberMap = {};
	this.m_defaultcolor = "#e0dfdf";
	this.m_showdynamicrange = "false";
	this.m_mincolor = "#ff0000";
	this.m_maxcolor = "#000000";
	this.m_customicon = "bd-down-arrow,bd-minus,bd-up-arrow";
	this.m_defaultcustomicon = "bd-minus";
};

/** @description Initializing the Calculation **/
AlertColumn.prototype.init = function (chartObj) {
	this.m_chart = chartObj;
	var columnName = this.m_name;
	this.m_defaultcolor = this.m_chart.m_defaultalertcolor;
	var seriesData = this.m_chart.m_seriesData;
	var M_SeriesData = [];

	for (var i = 0; i < seriesData.length; i++) {
		M_SeriesData.push(seriesData[i][columnName]);
	}

	this.m_numberMap = {
		MAX_VALUE : this.getMaximumSeriesValue(M_SeriesData),
		MIN_VALUE : this.getMinimumSeriesValue(M_SeriesData)
	};
	this.splitcolor();
	this.splitrange();
	this.splitArrowDirection();
};

/** @description On the Basis of color two array created rangeColorsImages,rangeColors **/
AlertColumn.prototype.splitcolor = function () {
	this.rangeColors = this.m_colors.split(",");
	for (var j = 0; j < this.rangeColors.length; j++) {
		if (this.rangeColors[j] == 65280 || this.rangeColors[j] == "#00ff00") {
			this.m_rangeColorsImages.push("green");
		} else if (this.rangeColors[j] == 255 || this.rangeColors[j] == 16711680 || this.rangeColors[j] == "#ff0000") {
			this.m_rangeColorsImages.push("red");
		} else if (this.rangeColors[j] == 16776960 || this.rangeColors[j] == "#ffff00") {
			this.m_rangeColorsImages.push("yellow");
		} else {
			this.m_rangeColorsImages.push("gray");
		}
		this.rangeColors[j] = convertColorToHex(this.rangeColors[j]);
	}
};

/** @description Split the Range and Store into Class Variable in form of Array **/
AlertColumn.prototype.splitrange = function () {
	this.alertRanges = [];
	this.HyphenSeparatedRanges = [];
	this.tildSeparatedRanges = [];
	if(this.m_ranges != ""){
		this.alertRanges = this.m_ranges.split(",");
		for (var i = 0; i < this.alertRanges.length; i++) {
			//this.HyphenSeparatedRanges[i]=this.alertRanges[i].split("-");
			this.tildSeparatedRanges[i] = this.alertRanges[i].split("~");
			/** this.ranges[0]: this.ranges[0][0] contain min, this.ranges[0][1] contain max of a range**/
		}
	}
};

/** @description Split the Range and Store into Class Variable in form of Array **/
AlertColumn.prototype.splitArrowDirection = function () {
	this.m_customiconrange = this.m_customicon.split(",");
};

/** @description Getter of  rangeColorsImages **/
AlertColumn.prototype.getRangeColorsImage = function (index) {
	return this.m_rangeColorsImages[index];
};

/** @description Getter of  rangeColors **/
AlertColumn.prototype.getRangeColor = function (index) {
	return this.rangeColors[index];
};
/** @description Getter of  rangeArrowDirection **/
AlertColumn.prototype.getArrowDirection = function (index) {
	return this.m_customiconrange[index];
};
/** @description Getter of  showdynamicrange **/
AlertColumn.prototype.getDynamicRange = function (index) {
	return this.m_showdynamicrange;
};

/** @description Getter of  Min Max Range **/
AlertColumn.prototype.getMinMaxRange = function (index) {
	//if(this.HyphenSeparatedRanges[0].length==2)
	//	return this.HyphenSeparatedRanges[index];

	if (this.tildSeparatedRanges[0].length == 2){
		return this.tildSeparatedRanges[index];
	}
	// return the range , which is an array of min and max value
};

/** @description Start Calculation for dynamicAlert **/
AlertColumn.prototype.drawDynamicAlert = function(colName, colIndex, val, row, DynamicColName, formattedValue, showTooltip, toolTipformattedvalue) {
	colName = (this.m_chart.m_componenttype == 'tree_grid') ? this.m_chart.getStringARSC(colName) : colName;
	var colorCode = (IsBoolean(this.m_chart.getAlertObj()[colName].getDynamicRange())) ? this.getCellBackGroundColor(colName, colIndex, val, row, DynamicColName) : this.getAlertColor('', val).colorCode;
	if(IsBoolean(!this.m_chart.getAlertObj()[colName].getDynamicRange())){
		this.m_mincolor = colorCode;
		this.m_maxcolor = colorCode;
	}
	//var colorCode = this.getCellBackGroundColor(colName, colIndex, val, row, DynamicColName);
	switch(this.getAlertType()){
		case "dot":
			return this.drawDotDiv(val, colorCode, formattedValue, colIndex, showTooltip, toolTipformattedvalue, this.m_chart.m_gridcustomtooltip);
		case "tick":
			return this.drawTick(val, colorCode, formattedValue, colIndex, showTooltip, this.m_chart.m_gridcustomtooltip);
		case "textcolor":
			return this.drawTextColor(val, colorCode, formattedValue, colIndex, showTooltip, toolTipformattedvalue, this.m_chart.m_gridcustomtooltip);
		case "star":
			return this.drawStar(val, colorCode, formattedValue, colIndex, showTooltip, toolTipformattedvalue, this.m_chart.m_gridcustomtooltip);
		case "hexagon":
			return this.drawHexagon(val, colorCode, formattedValue, colIndex, showTooltip, toolTipformattedvalue, this.m_chart.m_gridcustomtooltip);
		case "diamond":
			return this.drawDiamond(val, colorCode, formattedValue, colIndex, showTooltip, toolTipformattedvalue, this.m_chart.m_gridcustomtooltip);
		case "arrow":
			/** dynamic range arrow position:  down: 0-33%, neutral:33-66%, up:66-100% **/
			var arrowPosition = ["down", "neutral", "up"];
			var index = 2;
			try{
				var max = getNumericComparableValue(this.m_chart.columnWiseData[this.m_chart.getStringARSC(colName)]["max"]);
				var min = getNumericComparableValue(this.m_chart.columnWiseData[this.m_chart.getStringARSC(colName)]["min"]);
				if( val*1 <= (min*1 + (max*1 - min*1 )/3) ){
					index = 0;
				}else if( val*1 <= (min*1 + (max*1 - min*1)*2/3)){
					index = 1;
				}
			}catch(e){
				console.log(e);
			}
			return this.drawArrow(val, colorCode, arrowPosition[index], formattedValue, colIndex, showTooltip, this.m_chart.m_gridcustomtooltip);
		case "bar":
			return this.getBarWithValue(colName, colIndex, val, row, DynamicColName, formattedValue, showTooltip, toolTipformattedvalue, this.m_chart.m_gridcustomtooltip);
		case "colorfill":
			return (colorCode) ? "background-color:" + colorCode + ";color:#000000;" : undefined;
		
		default:
			return val;
	}
};

/** @description Start Calculation for ALert Drawing **/
AlertColumn.prototype.drawAlerts = function (compareColData, cellData, pagingDg, columnName, fieldObject, formattedValue, colIndex, showTooltip, toolTipformattedvalue) {
	var color = this.getAlertColor(compareColData, cellData);
	return this.drawAlertPatern(cellData, color.colorName, color.colorCode, color.compareMax, color.finalArrowPosition, formattedValue, colIndex, showTooltip, color.customIcon, toolTipformattedvalue);
};

/** @description BDD-818 Added this method to create ccolor array on export tabular PDF from component **/
AlertColumn.prototype.drawGridAlerts = function (compareColData, cellData, colIndex){
	if (cellData !== "" && cellData != null) {
	    var color = this.getAlertColor(compareColData, cellData);
	    return color;
	} else {
	    color = {
	        colorCode: ""
	    };
	    return color;
	}
};

/** @description Get Maximum series Value **/
AlertColumn.prototype.getMaximumSeriesValue = function (seriesValue) {
	var maxSeriesVal = seriesValue[0];
	for (var i = 0; i < seriesValue.length; i++) {
		if ((seriesValue[i] !== "") && (seriesValue[i] * 1) >= maxSeriesVal * 1)
			maxSeriesVal = seriesValue[i];
	}
	return maxSeriesVal*1;
};

/** @description Get Minimum Series Value **/
AlertColumn.prototype.getMinimumSeriesValue = function (seriesValue) {
	var minSeriesVal = seriesValue[0];
	for (var i = 0; i < seriesValue.length; i++) {
		if ((seriesValue[i] !== "") && (seriesValue[i] * 1) <= minSeriesVal * 1)
			minSeriesVal = seriesValue[i];
	}
	return minSeriesVal*1;
};

/** @description Getting color for Numeral Comparison **/
AlertColumn.prototype.getColorForNumeralComparison = function (compareValue, cellData) {
	var colorName = "gray";
	var colorCode = this.m_defaultcolor;
	var compareMax = compareValue;
	var arrowPosition = ["down", "neutral", "up"];
	var finalArrowPosition = arrowPosition[0];
	if (cellData * 1 < compareValue * 1) {
		colorName = this.getRangeColorsImage(0);
		colorCode = this.getRangeColor(0);
		finalArrowPosition = arrowPosition[0];
	} else if (cellData * 1 == compareValue * 1) {
		colorName = this.getRangeColorsImage(1);
		colorCode = this.getRangeColor(1);
		finalArrowPosition = arrowPosition[1];
	} else if (cellData * 1 > compareValue * 1) {
		colorName = this.getRangeColorsImage(2);
		colorCode = this.getRangeColor(2);
		finalArrowPosition = arrowPosition[2];
	}
	return {
		colorName : colorName,
		colorCode : colorCode,
		compareMax : compareMax,
		finalArrowPosition : finalArrowPosition
	};
};

/** @description Getting color for PercentageAlertRange  **/
AlertColumn.prototype.getColorForPercentageAlertRange = function (compareColData, cellData) {
	var colorName = "gray";
	var colorCode = this.m_defaultcolor;
	var compareMax = compareColData;
	var arrowPosition = ["down", "neutral", "up"];
	var finalArrowPosition = arrowPosition[0];
	var percent = cellData * 100 / compareColData;
	for (var q = 0; q < this.alertRanges.length; q++) {
		var min = this.getMinMaxRange(q)[0];
		var max = this.getMinMaxRange(q)[1];
		if ((percent <= (max * 1)) && (percent >= (min * 1))) {
			colorName = this.getRangeColorsImage(q);
			colorCode = this.getRangeColor(q);
			finalArrowPosition = arrowPosition[q];
			compareMax = max;
		}
	}
	return {
		colorName : colorName,
		colorCode : colorCode,
		compareMax : compareMax,
		finalArrowPosition : finalArrowPosition
	};
};

/** @description Getting color for StaticComparison  **/
AlertColumn.prototype.getColorForStaticComparison = function (compareColData, cellData) {
	var colorName = "grey";
	var colorCode = this.m_defaultcolor;
	var arrowPosition = ["up"];
	var finalArrowPosition = arrowPosition[0];
	var compareMax = compareColData;
	var customIcon = this.m_defaultcustomicon;
	this.staticRange = this.m_staticrange.split(",");
	this.operatorName = this.m_operatorname.split(",");
	var operators = {
		"<" : function (a, b) {
			return a < b;
		},
		"<=" : function (a, b) {
			return a <= b;
		},
		">" : function (a, b) {
			return a > b;
		},
		">=" : function (a, b) {
			return a >= b;
		},
		"==" : function (a, b) {
			return a == b;
		},
		"!=" : function (a, b) {
			return a != b;
		}
	};
	for (var q = 0; q < this.staticRange.length; q++) {
		var range = this.staticRange[q];
		if (range == ""){
			break;
		}
		if (compareColData !== "" || compareColData != null) {
			if (this.operatorName[q] == "==" || this.operatorName[q] == "!=") {
				/** Equal and notEqual check should be done on strings. for proper validation in below case
				 * "0.0" == 0 : should return false from string-compare, not true by numeric compare 0 == 0 
				 * "0.0" != 0 : should return true from string-compare, not false by numeric compare 0 != 0 **/
				/* String comparison, do not convert to number */
			}else{
				compareColData = compareColData * 1;
				range = range * 1;
			}
			if (IsBoolean(operators[this.operatorName[q]](compareColData, range))) {
				colorName = this.getRangeColorsImage(q);
				colorCode = this.getRangeColor(q);
				compareMax = range;
				customIcon = this.getArrowDirection(q);
			}
		}
	}
	return {
		colorName : colorName,
		colorCode : colorCode,
		compareMax : compareMax,
		finalArrowPosition : finalArrowPosition,
		customIcon : customIcon
	};
};

/** @description Getting color for NumeralAlertRange  **/
AlertColumn.prototype.getColorForNumeralAlertRange = function (compareColData, cellData) {
	var colorName = "gray";
	var colorCode = this.m_defaultcolor;
	var arrowPosition = ["down", "neutral", "up"];
	var finalArrowPosition = arrowPosition[0];
	var compareMax = compareColData;
	for (var q = 0; q < this.alertRanges.length; q++) {
		var min = this.getMinMaxRange(q)[0];
		var max = this.getMinMaxRange(q)[1];

		if (isNaN(min)) {
			if (min.toLowerCase() == "min")
				min = this.m_numberMap.MIN_VALUE;
			else if (min.toLowerCase() == "max")
				min = this.m_numberMap.MAX_VALUE;
		}

		if (isNaN(max)) {
			if (max.toLowerCase() == "max")
				max = this.m_numberMap.MAX_VALUE;
			else if (max.toLowerCase() == "min")
				max = this.m_numberMap.MIN_VALUE;
		}
		/**DAS-664 Range Alert will return @m_defaultcolor with static range(s) same as dynamic Range **/
		if(cellData === "" || cellData === null){
				colorName = this.getRangeColorsImage(q);
				colorCode = this.m_defaultcolor;
				if (q != 0 && q != (this.alertRanges.length - 1))
					finalArrowPosition = arrowPosition[1];
				else
					finalArrowPosition = (q == 0) ? arrowPosition[0] : arrowPosition[2];
				compareMax = max;	
		}
		else if (cellData !== "" || cellData != null) {
			if ((cellData <= 1 * (max)) && (cellData >= 1 * (min))) {
				colorName = this.getRangeColorsImage(q);
				colorCode = this.getRangeColor(q);
				if (q != 0 && q != (this.alertRanges.length - 1))
					finalArrowPosition = arrowPosition[1];
				else
					finalArrowPosition = (q == 0) ? arrowPosition[0] : arrowPosition[2];
				compareMax = max;
			} else if (cellData < 1 * this.getMinMaxRange(0)[0]) {
				colorName = this.getRangeColorsImage(0);
				//colorCode = this.getRangeColor(0);
				colorCode = this.m_defaultcolor;
				finalArrowPosition = arrowPosition[0];
				compareMax = max;
			} else if (cellData > 1 * this.getMinMaxRange(this.alertRanges.length - 1)[1]) {
				colorName = this.getRangeColorsImage(this.alertRanges.length - 1);
				//colorCode = this.getRangeColor(0);
				colorCode = this.m_defaultcolor;
				finalArrowPosition = arrowPosition[2];
				compareMax = max;
			}
		}
	}
	return {
		colorName : colorName,
		colorCode : colorCode,
		compareMax : compareMax,
		finalArrowPosition : finalArrowPosition
	};
};

/** @description Getter of AlertColor**/
AlertColumn.prototype.getAlertColor = function (compareColData, cellData) {
	var compareValue = (IsBoolean(this.m_fixedvaluecompare)) ? this.m_fixedvalue : getNumericComparableValue(compareColData);
	if (this.m_mode == "Static Comparison") {
		return this.getColorForStaticComparison(compareValue, getNumericComparableValue(cellData));
	} else if (this.m_mode == "Numeral Comparison" || this.m_mode == "Comparison") {
		return this.getColorForNumeralComparison(compareValue, getNumericComparableValue(cellData));
	} else if (this.m_mode == "Numeral Alert Range" || this.m_mode == "Range") {
		return this.getColorForNumeralAlertRange(compareValue, getNumericComparableValue(cellData));
	} else if (this.m_mode == "Percentage Alert Range") {
		return this.getColorForPercentageAlertRange(compareValue, getNumericComparableValue(cellData));
	}
};

/** @description Getting Bar Line Color**/
AlertColumn.prototype.getBarStrengthColors = function (value, max, color) {
	value = getNumericComparableValue(value);
	var colors = [];
	var noOfFillBar = value * 5 / max;
	noOfFillBar = (noOfFillBar > 1) ? Math.floor(noOfFillBar) : 1;
	for (var i = 0; i < 5; i++) {
		var col = (i < noOfFillBar) ? color : "#cccccc";
		colors.push(col);
	}
	return colors;
};

/** @description Drawing Different-2 Alert Pattern **/
AlertColumn.prototype.drawAlertPatern = function (cellData, colorName, colorCode, compareMax, ArrowPosition, formattedValue, colIndex, showTooltip, customIcon, toolTipformattedvalue) {
	switch(this.getAlertType()){
		case "dot":
			return this.drawDotDiv(cellData, colorCode, formattedValue, colIndex, showTooltip, toolTipformattedvalue, this.m_chart.m_gridcustomtooltip);
		case "tick":
			return this.drawTick(cellData, colorCode, formattedValue, colIndex, ArrowPosition, showTooltip, toolTipformattedvalue, this.m_chart.m_gridcustomtooltip);
		case "arrow":
			return this.drawArrow(cellData, colorCode, ArrowPosition, formattedValue, colIndex, showTooltip, toolTipformattedvalue, this.m_chart.m_gridcustomtooltip);
		case "bar":
			var color = this.getBarStrengthColors(cellData, compareMax, colorCode);
			return this.drawBar(cellData, color, formattedValue, colIndex, showTooltip, toolTipformattedvalue, this.m_chart.m_gridcustomtooltip);
		case "colorfill":
			if (cellData !== "" && cellData != null){
				return "background-color:" + colorCode + ";color:black;";
			} else {
				break;
			}
		case "textcolor":
			if (cellData !== "" && cellData != null){
				return this.drawTextColor(cellData, colorCode, formattedValue, colIndex, showTooltip, toolTipformattedvalue, this.m_chart.m_gridcustomtooltip);
				//return "<div style=color:" + colorCode + ">" + formattedValue + "</div>";
			} else {
				break;
			}
		case "image":
			return this.drawImageDiv(cellData, formattedValue, compareMax, colIndex, showTooltip, this.m_chart.m_gridcustomtooltip);
		case "star":
			return this.drawStar(cellData, colorCode, formattedValue, colIndex, showTooltip, toolTipformattedvalue, this.m_chart.m_gridcustomtooltip);
		case "hexagon":
			return this.drawHexagon(cellData, colorCode, formattedValue, colIndex, showTooltip, toolTipformattedvalue, this.m_chart.m_gridcustomtooltip);
		case "diamond":
			return this.drawDiamond(cellData, colorCode, formattedValue, colIndex, showTooltip, toolTipformattedvalue, this.m_chart.m_gridcustomtooltip);
		case "customshape":
			return this.drawCustomShape(cellData, colorCode, ArrowPosition, formattedValue, colIndex, showTooltip, customIcon, toolTipformattedvalue, this.m_chart.m_gridcustomtooltip);
		default:
			return "<div>" + formattedValue + "</div>";
	}
};

/** @description Drawing Dot Div  **/
AlertColumn.prototype.drawTextColor = function (cellData, colorCode, formattedValue, colIndex, showTooltip, toolTipformattedvalue, isgridcustomtooltip ) {
	this.m_alertposition = (IsBoolean(this.m_showdata) ? this.m_alertposition : "center");
	if (toolTipformattedvalue !== undefined) {
	    var tooltipvalue = (toolTipformattedvalue === formattedValue) ? ("'" + ((isNaN(formattedValue) && (typeof formattedValue === 'string')) ? b64EncodeUnicode(formattedValue) : formattedValue) + "'") : toolTipformattedvalue;
	} else {
	    var tooltipvalue = (isNaN(formattedValue) && (typeof formattedValue === 'string')) ? b64EncodeUnicode(formattedValue) : formattedValue;
	    tooltipvalue = "'" + tooltipvalue + "'";
	}
	/*Added above conditions to compare the tooltip values as custom tooltip is introduced*/
	//var tooltipvalue = (isNaN(formattedValue) && (typeof formattedValue === 'string'))?b64EncodeUnicode(formattedValue):formattedValue;
	var formattedTooltipValue = tooltipvalue;
	var showData = (IsBoolean(this.m_showdata)) ? formattedValue : "";
	var tooltipBGColor = "'" + this.m_chart.m_tooltipbackgroundcolor + "'";
	var tooltipBGAlpha = "'" + this.m_chart.m_tooltipbackgroundtransparency + "'";
	var customToolTipWidth = "'" + this.m_chart.m_customtooltipwidth + "'";
	if (cellData !== "") {
	    if (toolTipformattedvalue && toolTipformattedvalue.isEncoded) {
	        formattedTooltipValue = "'" + toolTipformattedvalue.value + "'";
	    }
	    return '<div style="color:' + colorCode + '"; onmousemove="getToolTip(this,' + showTooltip + ',' + formattedTooltipValue + ',' + tooltipBGColor + ',' + tooltipBGAlpha + ',' + customToolTipWidth + ',' + toolTipformattedvalue.isEncoded + ','+ isgridcustomtooltip + ')" onmouseout="hideToolTip()">' + formattedValue + '</div>';
	}
};

/** @description Drawing Div for image drawing in cell from url **/
AlertColumn.prototype.drawImageDiv = function (cellData, formattedValue, compareMax, colIndex, showTooltip, isgridcustomtooltip ) {
	this.m_alertposition = (IsBoolean(this.m_showdata) ? this.m_alertposition : "center");
	var formattedTooltipValue = "'" + cellData + "'";
	var showData = (IsBoolean(this.m_showdata)) ? formattedValue : "";
	var tooltipBGColor = "'" + this.m_chart.m_tooltipbackgroundcolor + "'";
	var tooltipBGAlpha = "'" + this.m_chart.m_tooltipbackgroundtransparency + "'";
	return '<div style="display:table-cell;"><a href="'+cellData+'" target="_blank"> <img style="width:40px; height:40px; border-radius:50%;" src="'+ cellData +'" onmousemove="getToolTip(this,' + showTooltip + ',' + formattedTooltipValue + ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ','+ isgridcustomtooltip + ')" onmouseout="hideToolTip()"></a></div>'+
			'<span style="display:table-cell;vertical-align:middle; padding:0px 2px 0px 2px;">' + showData + '</span>';
};
/** @description Drawing Dot Div  **/
AlertColumn.prototype.drawDotDiv = function (cellData, colorCode, formattedValue, colIndex, showTooltip, toolTipformattedvalue,isgridcustomtooltip) {
	if (toolTipformattedvalue !== undefined) {
	    var tooltipvalue = (toolTipformattedvalue === formattedValue) ? ("'" + ((isNaN(formattedValue) && (typeof formattedValue === 'string')) ? b64EncodeUnicode(formattedValue) : formattedValue) + "'") : toolTipformattedvalue;
	} else {
	    var tooltipvalue = (isNaN(formattedValue) && (typeof formattedValue === 'string')) ? b64EncodeUnicode(formattedValue) : formattedValue;
	    tooltipvalue = "'" + tooltipvalue + "'";
	}
	/*Added above conditions to compare the tooltip values as custom tooltip is introduced*/
	//var tooltipvalue = (isNaN(formattedValue) && (typeof formattedValue === 'string'))?b64EncodeUnicode(formattedValue):formattedValue;
	var alertFloatPosition = (IsBoolean(this.m_showdata) ? this.m_chart.m_textAlignArr[colIndex] : "center");
	var formattedTooltipValue = tooltipvalue;
	var showData = (IsBoolean(this.m_showdata)) ? formattedValue : "";
	var tooltipBGColor = "'" + this.m_chart.m_tooltipbackgroundcolor + "'";
	var tooltipBGAlpha = "'" + this.m_chart.m_tooltipbackgroundtransparency + "'";
	var customToolTipWidth = "'" + this.m_chart.m_customtooltipwidth + "'";
	if (cellData !== "") {
	    if (toolTipformattedvalue && toolTipformattedvalue.isEncoded) {
	        formattedTooltipValue = "'" + toolTipformattedvalue.value + "'";
	    }
	    return '<div class="imageDiv" style="width:100%; text-decoration:inherit; text-align: ' + alertFloatPosition + ';" onmousemove="getToolTip(this,' + showTooltip + ',' + formattedTooltipValue + ',' + tooltipBGColor + ',' + tooltipBGAlpha + ',' + customToolTipWidth + ',' + toolTipformattedvalue.isEncoded + ','+ isgridcustomtooltip + ')" onmouseout="hideToolTip()">' + this.getAlertDot(showData, colorCode) + '</div>';
	}
};

/** @description Drawing ALert Dot  **/
AlertColumn.prototype.getAlertDot = function (showData, color) {
	var text = '<div style="display:inline-block;text-decoration:inherit;vertical-align:middle;">' + showData + '</div>';
	var fontsize=(this.m_alertsize*1>0)?this.m_alertsize*1:18;
	fontsize=fontsize+1;
	var alertImage = '<div style="margin-left:5px; margin-right:12px; display:inline-block;vertical-align:middle;">' + this.getRoundDiv(color) + '</div>';
	if (this.m_alertposition == "left"){
		return alertImage + text;
	} else {
		return text + alertImage;
	}
};

/** @description Drawing Round Circle Div  **/
AlertColumn.prototype.getRoundDiv = function (color) {
	//var fontSize = this.m_chart.fontScaling(12);
	var fontSize=(this.m_alertsize*1>0)?this.m_alertsize*1:12;
	var gradientColor = color; //'-webkit-gradient(linear, left top, left bottom, color-stop(0%, ' + color + '), color-stop(15%, ' + color + '), color-stop(100%, ' + color + ')); background: -moz-linear-gradient(top, ' + color + ' 10%, ' + color + ' 55%, #D5E4F3 130%);';
	if (isIE = /*@cc_on!@*/
			false || !!document.documentMode)
		return '<div style="width:' + fontSize + 'px;height:' + fontSize + 'px; border-radius:' + fontSize / 2 + 'px; border:1px double ' + color + ' ;background:' + color + '"></div>';
	else
		return '<div style="width:' + fontSize + 'px;height:' + fontSize + 'px; border-radius:' + fontSize / 2 + 'px; border:1px double ' + color + ' ;background:' + gradientColor + '"></div>';
};

/** @description Drawing Bar  **/
AlertColumn.prototype.drawBar = function (cellData, color, formattedValue, colIndex, showTooltip, toolTipformattedvalue, isgridcustomtooltip ) {
	if (toolTipformattedvalue !== undefined) {
	    var tooltipvalue = (toolTipformattedvalue === formattedValue) ? ("'" + ((isNaN(formattedValue) && (typeof formattedValue === 'string')) ? b64EncodeUnicode(formattedValue) : formattedValue) + "'") : toolTipformattedvalue;
	} else {
	    var tooltipvalue = (isNaN(formattedValue) && (typeof formattedValue === 'string')) ? b64EncodeUnicode(formattedValue) : formattedValue;
	    tooltipvalue = "'" + tooltipvalue + "'";
	}
	/*Added above conditions to compare the tooltip values as custom tooltip is introduced*/
	var formattedTooltipValue = tooltipvalue;
	var alertFloatPosition = (IsBoolean(this.m_showdata) ? this.m_chart.m_textAlignArr[colIndex] : "center");
	var showData = (IsBoolean(this.m_showdata)) ? formattedValue : "";
	var tooltipBGColor = "'" + this.m_chart.m_tooltipbackgroundcolor + "'";
	var tooltipBGAlpha = "'" + this.m_chart.m_tooltipbackgroundtransparency + "'";
	var customToolTipWidth = "'" + this.m_chart.m_customtooltipwidth + "'";
	if (cellData !== "") {
	    if (toolTipformattedvalue && toolTipformattedvalue.isEncoded) {
	        formattedTooltipValue = "'" + toolTipformattedvalue.value + "'";
	    }
	    return '<div class="imageDiv" style="width:100%; text-decoration:inherit;text-align: ' + alertFloatPosition + ';" onmousemove="getToolTip(this,' + showTooltip + ',' + formattedTooltipValue + ',' + tooltipBGColor + ',' + tooltipBGAlpha + ',' + customToolTipWidth + ',' + toolTipformattedvalue.isEncoded + ','+ isgridcustomtooltip + ')" onmouseout="hideToolTip()">' + this.getAlertBar(showData, color) + ' </div>';
	}
};

/** @description Drawing Alert Bar  **/
AlertColumn.prototype.getAlertBar = function (showData, color) {
	var text = '<div style=" display:inline-block;text-decoration:inherit;vertical-align:top;margin-top:3px;">' + showData + '</div>';
	var alertImage = '<div style="width:25px; height:17px;margin-left:5px;margin-right:9px; display:inline-block;"><div  class="bar" style="height:' + 3 + 'px ;width:' + 3 + 'px;background-Color:' + color[0] + '; "></div><div class="bar" style="height:' + 6 + 'px;width:' + 3 + 'px;background-Color:' + color[1] + ';"></div><div class="bar" style="height:' + 9 + 'px;width:' + 3 + 'px;background-Color:' + color[2] + ';"></div><div class="bar"  style="height:' + 12 + 'px;width:' + 3 + 'px;background-Color:' + color[3] + ';"></div><div class="bar" style="height:' + 15 + 'px;width:' + 3 + 'px;background-Color:' + color[4] + ';"></div><div class="bar" style="height:' + 17 + 'px;width:' + 3 + 'px;background-Color:' + color[5] + ';"></div></div>';
	if (this.m_alertposition == "left"){
		return alertImage + text;
	} else {
		return text + alertImage;
	}
};

/** @description Drawing Tick Mark  **/
AlertColumn.prototype.drawTick = function (cellData, color, formattedValue, colIndex, ArrowPosition, showTooltip, toolTipformattedvalue, isgridcustomtooltip ) {
	if (toolTipformattedvalue !== undefined) {
	    var tooltipvalue = (toolTipformattedvalue === formattedValue) ? ("'" + ((isNaN(formattedValue) && (typeof formattedValue === 'string')) ? b64EncodeUnicode(formattedValue) : formattedValue) + "'") : toolTipformattedvalue;
	} else {
	    var tooltipvalue = (isNaN(formattedValue) && (typeof formattedValue === 'string')) ? b64EncodeUnicode(formattedValue) : formattedValue;
	    tooltipvalue = "'" + tooltipvalue + "'";
	}
	/*Added above conditions to compare the tooltip values as custom tooltip is introduced*/
	//var tooltipvalue = (isNaN(formattedValue) && (typeof formattedValue === 'string'))?b64EncodeUnicode(formattedValue):formattedValue;
	var formattedTooltipValue = tooltipvalue;
	var alertFloatPosition = (IsBoolean(this.m_showdata) ? this.m_chart.m_textAlignArr[colIndex] : "center");
	var showData = (IsBoolean(this.m_showdata)) ? formattedValue : "";
	var tooltipBGColor = "'" + this.m_chart.m_tooltipbackgroundcolor + "'";
	var tooltipBGAlpha = "'" + this.m_chart.m_tooltipbackgroundtransparency + "'";
	var customToolTipWidth = "'" + this.m_chart.m_customtooltipwidth + "'";
	if (cellData !== "") {
	    if (toolTipformattedvalue && toolTipformattedvalue.isEncoded) {
	        formattedTooltipValue = "'" + toolTipformattedvalue.value + "'";
	    }
	    return '<div class="imageDiv" style="width:100%; text-decoration:inherit; text-align: ' + alertFloatPosition + ';" onmousemove="getToolTip(this,' + showTooltip + ',' + formattedTooltipValue + ',' + tooltipBGColor + ',' + tooltipBGAlpha + ',' + customToolTipWidth + ',' + toolTipformattedvalue.isEncoded + ','+ isgridcustomtooltip + ')" onmouseout="hideToolTip()">' + this.getTickAlert(showData, color, ArrowPosition) + '</div>';
	}
};

/** @description Getting Tick Alert  **/
AlertColumn.prototype.getTickAlert = function(showData, color, ArrowPosition) {
    var text = '<div style=" display:inline-block;text-decoration:inherit;vertical-align:middle;">' + showData + '</div>';
    var fontsize=(this.m_alertsize*1>0)?this.m_alertsize*1:18;
    var alertImage = '';
    if (ArrowPosition == "up") {
        alertImage = '<div style="margin-left:5px;margin-right:12px; display:inline-block;vertical-align:middle;"><span class="bd-ok" style="color:' + color + ';font-size:'+fontsize+'px;vertical-align:middle;"></span></div>';

    } else if (ArrowPosition == "neutral") {
        alertImage = '<div style="margin-left:5px;margin-right:12px; display:inline-block;vertical-align:middle;"><span class="bd-exclamation-1" style="color:' + color + ';font-size:'+fontsize+'px;vertical-align:middle;"></span></div>';

    } else if (ArrowPosition == "down") {
        alertImage = '<div style="margin-left:5px;margin-right:12px; display:inline-block;vertical-align:middle;"><span class="bd-cross" style="color:' + color + ';font-size:'+fontsize+'px;vertical-align:middle;"></span></div>';

    } else {
        var alertImage = ''
    }
    if (this.m_alertposition == "left") {
        return alertImage + text;
    } else {
        return text + alertImage;
    }
};

/** @description Drawing Arrow **/
AlertColumn.prototype.drawArrow = function (cellData, color, arrowPosition, formattedValue, colIndex, showTooltip, toolTipformattedvalue, isgridcustomtooltip ) {
	var alertFloatPosition = (IsBoolean(this.m_showdata) ? this.m_chart.m_textAlignArr[colIndex] : "center");
	if (toolTipformattedvalue !== undefined) {
	    var tooltipvalue = (toolTipformattedvalue === formattedValue) ? ("'" + ((isNaN(formattedValue) && (typeof formattedValue === 'string')) ? b64EncodeUnicode(formattedValue) : formattedValue) + "'") : toolTipformattedvalue;
	} else {
	    var tooltipvalue = (isNaN(formattedValue) && (typeof formattedValue === 'string')) ? b64EncodeUnicode(formattedValue) : formattedValue;
	    tooltipvalue = "'" + tooltipvalue + "'";
	}
	/*Added above conditions to compare the tooltip values as custom tooltip is introduced*/
	//var tooltipvalue = (isNaN(formattedValue) && (typeof formattedValue === 'string'))?b64EncodeUnicode(formattedValue):formattedValue;
	var formattedTooltipValue = tooltipvalue;
	var showData = (IsBoolean(this.m_showdata)) ? formattedValue : "";
	var tooltipBGColor = "'" + this.m_chart.m_tooltipbackgroundcolor + "'";
	var tooltipBGAlpha = "'" + this.m_chart.m_tooltipbackgroundtransparency + "'";
	var customToolTipWidth = "'" + this.m_chart.m_customtooltipwidth + "'";
	if (cellData !== "") {
	    if (toolTipformattedvalue && toolTipformattedvalue.isEncoded) {
	        formattedTooltipValue = "'" + toolTipformattedvalue.value + "'";
	    }
	    return '<div class="imageDiv" style="width:100%; text-decoration:inherit; text-align: ' + alertFloatPosition + ';" onmousemove="getToolTip(this,' + showTooltip + ',' + formattedTooltipValue + ',' + tooltipBGColor + ',' + tooltipBGAlpha + ',' + customToolTipWidth + ',' + toolTipformattedvalue.isEncoded + ','+ isgridcustomtooltip + ')" onmouseout="hideToolTip()" >' + this.getArrowAlert(showData, color, arrowPosition) + '</div>';
	}
};

/** @description Drawing Arrow Alert **/
AlertColumn.prototype.getArrowAlert = function (showData, color, arrowPosition) {
	var text = '<div style=" display:inline-block;text-decoration:inherit;vertical-align:middle;">' + showData + '</div>';
	var fontsize=(this.m_alertsize*1>0)?this.m_alertsize*1:18;
	var alertImage = '<div style="width:25px; height:20px; margin-left:5px;margin-right:5px; display:inline-block;vertical-align:middle;"><div style="width:'+fontsize+'px; height:'+fontsize+'px; position:absolute; float :right;">';
	if (arrowPosition == 'neutral') {
		alertImage += '<div class="arrow-neutral-alert"  style="background-color:' + color + ';vertical-align:middle;"></div></div></div>';
	} else if (arrowPosition == 'up') {
		alertImage += '<div class="arrow-up-alert" style="border-bottom:10px solid ' + color + ';vertical-align:middle;" ></div><div class="arrow-line-alert" style="background-color:' + color + ';"></div></div></div>';
	} else {
		alertImage += '<div class="arrow-lineDown-alert" style="background-color:' + color + ';vertical-align:middle;"></div><div class="arrow-down-alert"  style="border-top:10px solid ' + color + ';"></div></div></div>';
	}
	if (this.m_alertposition == "left"){
		return alertImage + text;
	} else {
		return text + alertImage;
	}
};

/** @description Drawing Custom Shape **/
AlertColumn.prototype.drawCustomShape = function (cellData, color, arrowPosition, formattedValue, colIndex, showTooltip, customIcon, toolTipformattedvalue, isgridcustomtooltip ) {
	var alertFloatPosition = (IsBoolean(this.m_showdata) ? this.m_chart.m_textAlignArr[colIndex] : "center");
	if (toolTipformattedvalue !== undefined) {
	    var tooltipvalue = (toolTipformattedvalue === formattedValue) ? ("'" + ((isNaN(formattedValue) && (typeof formattedValue === 'string')) ? b64EncodeUnicode(formattedValue) : formattedValue) + "'") : toolTipformattedvalue;
	} else {
	    var tooltipvalue = (isNaN(formattedValue) && (typeof formattedValue === 'string')) ? b64EncodeUnicode(formattedValue) : formattedValue;
	    tooltipvalue = "'" + tooltipvalue + "'";
	}
	/*Added above conditions to compare the tooltip values as custom tooltip is introduced*/
	//var tooltipvalue = (isNaN(formattedValue) && (typeof formattedValue === 'string'))?b64EncodeUnicode(formattedValue):formattedValue;
	var formattedTooltipValue = tooltipvalue;
	var showData = (IsBoolean(this.m_showdata)) ? formattedValue : "";
	var tooltipBGColor = "'" + this.m_chart.m_tooltipbackgroundcolor + "'";
	var tooltipBGAlpha = "'" + this.m_chart.m_tooltipbackgroundtransparency + "'";
	var customToolTipWidth = "'" + this.m_chart.m_customtooltipwidth + "'";
	if (cellData !== "") {
	    if (toolTipformattedvalue && toolTipformattedvalue.isEncoded) {
	        formattedTooltipValue = "'" + toolTipformattedvalue.value + "'";
	    }
	    return '<div class="imageDiv" style="width:100%; text-decoration:inherit; text-align: ' + alertFloatPosition + ';" onmousemove="getToolTip(this,' + showTooltip + ',' + formattedTooltipValue + ',' + tooltipBGColor + ',' + tooltipBGAlpha + ',' + customToolTipWidth + ',' + toolTipformattedvalue.isEncoded + ','+ isgridcustomtooltip + ')" onmouseout="hideToolTip()" >' + this.getCustomAlert(showData, color, arrowPosition, customIcon) + '</div>';
	}
};

/** @description Drawing Arrow Alert **/
AlertColumn.prototype.getCustomAlert = function (showData, color, arrowPosition, customIcon) {
	var text = '<div style=" display:inline-block;text-decoration:inherit;vertical-align:top;margin-top:3px;">' + showData + '</div>';
	var fontsize=(this.m_alertsize*1>0)?this.m_alertsize*1:18;
	var alertImage = '<div style="margin-left:5px;margin-right:12px; display:inline-block; vertical-align:middle;"><span class="'+customIcon+'" style="color:' + color + ';font-size:'+fontsize+'px;"></span></div>';
	if (this.m_alertposition == "left"){
		return alertImage + text;
	} else {
		return text + alertImage;
	}
};

/** @description Drawing Star Mark  **/
AlertColumn.prototype.drawStar = function (cellData, color, formattedValue, colIndex, showTooltip, toolTipformattedvalue, isgridcustomtooltip ) {
	if (toolTipformattedvalue !== undefined) {
	    var tooltipvalue = (toolTipformattedvalue === formattedValue) ? ("'" + ((isNaN(formattedValue) && (typeof formattedValue === 'string')) ? b64EncodeUnicode(formattedValue) : formattedValue) + "'") : toolTipformattedvalue;
	} else {
	    var tooltipvalue = (isNaN(formattedValue) && (typeof formattedValue === 'string')) ? b64EncodeUnicode(formattedValue) : formattedValue;
	    tooltipvalue = "'" + tooltipvalue + "'";
	}
	/*Added above conditions to compare the tooltip values as custom tooltip is introduced*/
	//var tooltipvalue = (isNaN(formattedValue) && (typeof formattedValue === 'string'))?b64EncodeUnicode(formattedValue):formattedValue;
	var formattedTooltipValue = tooltipvalue;
	var alertFloatPosition = (IsBoolean(this.m_showdata) ? this.m_chart.m_textAlignArr[colIndex] : "center");
	var showData = (IsBoolean(this.m_showdata)) ? formattedValue : "";
	var tooltipBGColor = "'" + this.m_chart.m_tooltipbackgroundcolor + "'";
	var tooltipBGAlpha = "'" + this.m_chart.m_tooltipbackgroundtransparency + "'";
	var customToolTipWidth = "'" + this.m_chart.m_customtooltipwidth + "'";
	if (cellData !== "") {
	    if (toolTipformattedvalue && toolTipformattedvalue.isEncoded) {
	        formattedTooltipValue = "'" + toolTipformattedvalue.value + "'";
	    }
	    return '<div class="imageDiv" style="width:100%; text-decoration:inherit; text-align: ' + alertFloatPosition + ';" onmousemove="getToolTip(this,' + showTooltip + ',' + formattedTooltipValue + ',' + tooltipBGColor + ',' + tooltipBGAlpha + ',' + customToolTipWidth + ',' + toolTipformattedvalue.isEncoded + ','+ isgridcustomtooltip + ')" onmouseout="hideToolTip()">' + this.getStar(showData, color) + '</div>';
	}
};

/** @description Getting Star Alert  **/
AlertColumn.prototype.getStar = function (showData, color) {
	var text = '<div style="display:inline-block;text-decoration:inherit;vertical-align:middle;">' + showData + '</div>';
	var fontsize=(this.m_alertsize*1>0)?this.m_alertsize*1:18;
	var alertImage = '<div style="margin-left:5px;margin-right:12px; display:inline-block;vertical-align: middle;"><span class="bd-star" style="color:' + color + ';font-size:'+fontsize+'px;vertical-align:middle;"></span></div>';
	if (this.m_alertposition == "left"){
		return alertImage + text;
	} else {
		return text + alertImage;
	}
};
/** @description Drawing Hexagon Mark  **/
AlertColumn.prototype.drawHexagon = function (cellData, color, formattedValue, colIndex, showTooltip, toolTipformattedvalue, isgridcustomtooltip ) {
	if (toolTipformattedvalue !== undefined) {
	    var tooltipvalue = (toolTipformattedvalue === formattedValue) ? ("'" + ((isNaN(formattedValue) && (typeof formattedValue === 'string')) ? b64EncodeUnicode(formattedValue) : formattedValue) + "'") : toolTipformattedvalue;
	} else {
	    var tooltipvalue = (isNaN(formattedValue) && (typeof formattedValue === 'string')) ? b64EncodeUnicode(formattedValue) : formattedValue;
	    tooltipvalue = "'" + tooltipvalue + "'";
	}
	/*Added above conditions to compare the tooltip values as custom tooltip is introduced*/
	//var tooltipvalue = (isNaN(formattedValue) && (typeof formattedValue === 'string'))?b64EncodeUnicode(formattedValue):formattedValue;
	var formattedTooltipValue = tooltipvalue;
	var alertFloatPosition = (IsBoolean(this.m_showdata) ? this.m_chart.m_textAlignArr[colIndex] : "center");
	var showData = (IsBoolean(this.m_showdata)) ? formattedValue : "";
	var tooltipBGColor = "'" + this.m_chart.m_tooltipbackgroundcolor + "'";
	var tooltipBGAlpha = "'" + this.m_chart.m_tooltipbackgroundtransparency + "'";
	var customToolTipWidth = "'" + this.m_chart.m_customtooltipwidth + "'";
	if (cellData !== "") {
	    if (toolTipformattedvalue && toolTipformattedvalue.isEncoded) {
	        formattedTooltipValue = "'" + toolTipformattedvalue.value + "'";
	    }
	    return '<div class="imageDiv" style="width:100%; text-decoration:inherit; text-align: ' + alertFloatPosition + ';" onmousemove="getToolTip(this,' + showTooltip + ',' + formattedTooltipValue + ',' + tooltipBGColor + ',' + tooltipBGAlpha + ',' + customToolTipWidth + ',' + toolTipformattedvalue.isEncoded + ','+ isgridcustomtooltip + ')" onmouseout="hideToolTip()">' + this.getHexagon(showData, color) + '</div>';
	}
};

/** @description Getting Hexagon Alert  **/
AlertColumn.prototype.getHexagon = function (showData, color) {
	var text = '<div style="display:inline-block;text-decoration:inherit;vertical-align:middle;">' + showData + '</div>';
	var fontsize=(this.m_alertsize*1>0)?this.m_alertsize*1:18;
	var alertImage = '<div style="margin-left:5px;margin-right:12px; display:inline-block;vertical-align:middle;"><span class="bd-hexagon" style="color:' + color + ';font-size:'+fontsize+'px;vertical-align:middle;"></span></div>';
	if (this.m_alertposition == "left"){
		return alertImage + text;
	} else {
		return text + alertImage;
	}
};
/** @description Drawing Diamond Mark  **/
AlertColumn.prototype.drawDiamond = function (cellData, color, formattedValue, colIndex, showTooltip, toolTipformattedvalue, isgridcustomtooltip ) {
	if (toolTipformattedvalue !== undefined) {
	    var tooltipvalue = (toolTipformattedvalue === formattedValue) ? ("'" + ((isNaN(formattedValue) && (typeof formattedValue === 'string')) ? b64EncodeUnicode(formattedValue) : formattedValue) + "'") : toolTipformattedvalue;
	} else {
	    var tooltipvalue = (isNaN(formattedValue) && (typeof formattedValue === 'string')) ? b64EncodeUnicode(formattedValue) : formattedValue;
	    tooltipvalue = "'" + tooltipvalue + "'";
	}
	/*Added above conditions to compare the tooltip values as custom tooltip is introduced*/
	//var tooltipvalue = (isNaN(formattedValue) && (typeof formattedValue === 'string'))?b64EncodeUnicode(formattedValue):formattedValue;
	var formattedTooltipValue = tooltipvalue;
	var alertFloatPosition = (IsBoolean(this.m_showdata) ? this.m_chart.m_textAlignArr[colIndex] : "center");
	var showData = (IsBoolean(this.m_showdata)) ? formattedValue : "";
	var tooltipBGColor = "'" + this.m_chart.m_tooltipbackgroundcolor + "'";
	var tooltipBGAlpha = "'" + this.m_chart.m_tooltipbackgroundtransparency + "'";
	var customToolTipWidth = "'" + this.m_chart.m_customtooltipwidth + "'";
	if (cellData !== "") {
	    if (toolTipformattedvalue && toolTipformattedvalue.isEncoded) {
	        formattedTooltipValue = "'" + toolTipformattedvalue.value + "'";
	    }
	    return '<div class="imageDiv" style="width:100%; text-decoration:inherit; text-align: ' + alertFloatPosition + ';" onmousemove="getToolTip(this,' + showTooltip + ',' + formattedTooltipValue + ',' + tooltipBGColor + ',' + tooltipBGAlpha + ',' + customToolTipWidth + ',' + toolTipformattedvalue.isEncoded + ','+ isgridcustomtooltip + ')" onmouseout="hideToolTip()">' + this.getDiamond(showData, color) + '</div>';
	}
};

/** @description Getting Diamond Alert  **/
AlertColumn.prototype.getDiamond = function (showData, color) {
	var text = '<div style="display:inline-block;text-decoration:inherit;vertical-align:top;">' + showData + '</div>';
	var fontsize=(this.m_alertsize*1>0)?this.m_alertsize*1:18;
	var alertImage = '<div style="margin-left:5px;margin-right:12px; display:inline-block;vertical-align:middle;"><span class="bd-diamond" style="color:' + color + ';font-size:'+fontsize+'px;"></span></div>';
	if (this.m_alertposition == "left"){
		return alertImage + text;
	} else {
		return text + alertImage;
	}
};
/** @description Getting Bar Line Color Array **/
AlertColumn.prototype.getBarStrengthColorArray = function (compareColData, cellData) {
	var percent = cellData * 100 / compareColData;
	var colorArr = [];
	var index;
	for (var q = 0; q < this.alertRanges.length; q++) {
		var min = this.getMinMaxRange(q)[0];
		var max = this.getMinMaxRange(q)[1];
		if ((percent <= parseInt(max)) && (percent >= parseInt(min))) {
			index = q;
			var color = this.getRangeColor(q);
			while (index >= 0) {
				colorArr.push(color);
				colorArr.push(color);
				index--;
			}
		}
	}
	for (var i = colorArr.length; i < 6; i++) {
		colorArr.push("#BAB9B9");
	}
	return colorArr;
};

/** @description Getter of Gradient **/
AlertColumn.prototype.getGradient = function (m_color) {
	var color = "" + hex2rgb(m_color, 0.7);
	var radgrad4 = ctx.createRadialGradient(0, 0, 5, 0, 0, 10);
	radgrad4.addColorStop(0, m_color);
	radgrad4.addColorStop(0.6, color);
	radgrad4.addColorStop(1, m_color);
	return radgrad4;
};

/** @description Getter of Name **/
AlertColumn.prototype.getname = function () {
	return this.m_name;
};

/** @description Getter  alert Type **/
AlertColumn.prototype.getAlertType = function () {
	return this.m_alerttype;
};

/** @description color picking from canvas**/
AlertColumn.prototype.pickTheColor = function(xPosition) {
	var canvas = document.getElementById("intermediateCanvas" + this.m_chart.m_objectid);
	var ctx = canvas.getContext("2d");
	var grd = ctx.createLinearGradient(0, 0, this.m_chart.m_width, 0);
	grd.addColorStop(0, this.m_mincolor);
	grd.addColorStop(1, this.m_maxcolor);
	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, this.m_chart.m_width, this.m_chart.m_height);
	xPosition = (xPosition >= canvas.width) ? canvas.width - 1 : xPosition;
	var imgData = ctx.getImageData(xPosition, this.m_chart.m_height / 2, 1, 1);
	return "rgba("
			+ [ imgData.data[0], imgData.data[1], imgData.data[2],
					imgData.data[3] ] + ")";
};

/** @description Background color calculation**/
AlertColumn.prototype.getCellBackGroundColor = function(colName, colIndex, val, row, DynamicColName) {
	var bgColor = '';
	val = getNumericComparableValue(val);
	if (IsBoolean(this.m_chart.valueValidation(val))) {
		var dynamicColName = (this.m_chart.m_datagridtype != "DynamicDatagrid") ? 
				this.m_chart.getStringARSC(colName) : 
					this.m_chart.getStringARSC(DynamicColName);
		var max = getNumericComparableValue(this.m_chart.columnWiseData[dynamicColName]["max"]);
		var min = getNumericComparableValue(this.m_chart.columnWiseData[dynamicColName]["min"]);
		var xPosition = ((val*1 - min*1) / (max*1 - min*1)) * this.m_chart.m_width * this.m_chart.getDevicePixelRatio();
		/** When value is equal to min value, min color should be filled **/
		if (val * 1 <= min * 1){
			xPosition = 0.01;
		}else if(val * 1 >= max * 1){
			xPosition = (this.m_chart.m_width * this.m_chart.getDevicePixelRatio()) - 1;
		}
		bgColor = this.pickTheColor(xPosition);
		return bgColor;
	}else{
		bgColor = this.m_defaultcolor;
		return bgColor;
	}
};

/** @description Calculating color and creating bar in alert**/
AlertColumn.prototype.getBarWithValue = function(colName, colIndex, val, row, DynamicColName, formattedValue, showTooltip, toolTipformattedvalue, isgridcustomtooltip) {
	val = getNumericComparableValue(val);
	if (IsBoolean(this.m_chart.valueValidation(val))) {
		if(toolTipformattedvalue !== undefined){
			var tooltipvalue = (toolTipformattedvalue == formattedValue)?("'"+((isNaN(formattedValue) && (typeof formattedValue === 'string'))?b64EncodeUnicode(formattedValue):formattedValue)+ "'"):toolTipformattedvalue;
		}else{
			var tooltipvalue = (isNaN(formattedValue) && (typeof formattedValue === 'string'))?b64EncodeUnicode(formattedValue):formattedValue;
			tooltipvalue = "'" + tooltipvalue + "'";
		}
		//var tooltipvalue =((isNaN(formattedValue) && (typeof formattedValue === 'string'))?b64EncodeUnicode(formattedValue):formattedValue);
		//var tooltipData = "'" + tooltipvalue + "'";
		var tooltipData =  tooltipvalue;
		var dynamicColName = (this.m_chart.m_datagridtype != "DynamicDatagrid") ? 
				this.m_chart.getStringARSC(colName) : 
					this.m_chart.getStringARSC(DynamicColName);
		
		var max = getNumericComparableValue(this.m_chart.columnWiseData[dynamicColName]["max"]);
		var min = getNumericComparableValue(this.m_chart.columnWiseData[dynamicColName]["min"]);
		var xPosition = ((val*1 - min*1) / (max*1 - min*1)) * this.m_chart.m_width * this.m_chart.getDevicePixelRatio();
		xPosition = (val*1 >= max*1) ? ((this.m_chart.m_width * this.m_chart.getDevicePixelRatio()) - this.m_chart.m_adjustpixel) : xPosition;
		xPosition = (val*1 <= min*1) ? (0.01) : xPosition;
		var percent = this.calculatePercentage(val,min,max);
		/** When value is equal to min value, atleast there should be a bar with 1px **/
		var barWidth = (percent > 1) ? (percent + "%") : "1px";
		var imgColor = this.pickTheColor(xPosition);
		var barPosition = this.m_alertposition;
		var textPosition = (barPosition == "right") ? "left" : "right";
		var marginTop = this.m_chart.m_rowheight * 15 / 100;
		var rowHeight = this.m_chart.m_rowheight * 7 / 10;
		var width = IsBoolean(this.m_showdata) ? 70 : 100;
		var tooltipBGColor = "'" + this.m_chart.m_tooltipbackgroundcolor + "'";
		var tooltipBGAlpha = "'" + this.m_chart.m_tooltipbackgroundtransparency + "'";
		var customToolTipWidth = "'" + this.m_chart.m_customtooltipwidth + "'";
		if(toolTipformattedvalue && toolTipformattedvalue.isEncoded) {
			tooltipData = "'" + toolTipformattedvalue.value + "'";
		}
			var dom =  '<div onmouseout="hideToolTip()" onmousemove="getToolTip(this,'
				+ showTooltip + ',' + tooltipData
				+ ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ',' + customToolTipWidth + ',' +  toolTipformattedvalue.isEncoded + ','+ isgridcustomtooltip +')" style="width:'+width+'%;height:' + this.m_chart.m_rowheight
				+ 'px;display:inline-block;float:' + barPosition
				+ ';"><div style="margin-top:' + marginTop + 'px;float:'
				+ barPosition + ';height:'+rowHeight+'px;background-color:' + imgColor
				+ ';width:' + barWidth
				+ ';"></div></div>';
		if(IsBoolean(this.m_showdata)){
			return dom+'<div style="display:table;float:' + textPosition
			+ ';height:'+this.m_chart.m_rowheight+'px;"><div style="display:table-cell;vertical-align:middle;">' + formattedValue + '</div></div>';		
		} else {
			return dom;
		}
	} else if(val != undefined ) {
		var toolTipData = "'"+val+"'";
		var value = IsBoolean(this.m_showdata) ? val : '';
		return '<div style="width:100%;height:'+this.m_chart.m_rowheight+'px;" onmouseout="hideToolTip()" onmousemove="getToolTip(this,'+ showTooltip + ',' + toolTipData+ ',' + tooltipBGColor + ',' +  tooltipBGAlpha + ', undefined, undefined, '+ isgridcustomtooltip + ')">'+value+'</div>';
	}
};

/** @description Calculating percentage of value**/
AlertColumn.prototype.calculatePercentage = function(value, min, max) {
	if (min*1 >= 0 && max*1 > 0) {
		return (value * 100) / max*1;
	} else if (min*1 < 0 && max*1 > 0) {
		return (value*1 - min*1) * 100 / (max*1 - min*1);
	} else if (min*1 < 0 && max*1 < 0) {
		return -value * 100 / ((-min*1) + (-max*1));
	}
};

/** @description Creation of ToolTip Div **/
function getToolTip(divObj, showTooltip, tooltipContent, tooltipBGColor, tooltipBGAlpha, customToolTipWidth, isEncoded, isgridcustomtooltip) {
    var parentDiv = document.getElementById("WatermarkDiv");
    var dashboardObj = document.getElementsByClassName("draggableWidgetDiv");
    var scrollLeft = (parentDiv == null) ? 0 : parentDiv.scrollLeft;
    var scrollTop = (parentDiv == null) ? 0 : parentDiv.scrollTop;
    var scrollTop = 0; /*DAS-274 tooltip issue in home module*/
    var screenWidth = (parentDiv == null) ? dashboardObj[0].clientWidth : parentDiv.clientWidth;
    var screenHeight = (parentDiv == null) ? dashboardObj[0].clientHeight : parentDiv.clientHeight;
    var startX = window.pageXOffset;
    var startY = window.pageYOffset;
    var endX = startX + screenWidth;
    var endY = startY + screenHeight;
    if (isEncoded !== undefined && IsBoolean(isEncoded)) {
        var toolTipObj = JSON.parse(b64DecodeUnicode(tooltipContent));
        var tooltipData = "";
        for (var key in toolTipObj) {
            tooltipData = tooltipData + "<p>" + key + " : " + toolTipObj[key] + "</p>";
        }
        /*var border = "0px solid #E0DFDF";
   		var backColor = hex2rgb(convertColorToHex(tooltipBGColor), tooltipBGAlpha);
   		tooltipData = "<table class=\" chart-tooltip bdtooltip\" style = 'background:"+tooltipBGColor+";width:100%;'>";
		
   		var lastobj = Object.keys(toolTipObj)[Object.keys(toolTipObj).length-1];
		for(var key in toolTipObj) {
			var bgClr = tooltipBGColor;
			var bottomborder =  (lastobj == key) ? "0px solid #E0DFDF" : "1px solid #E0DFDF";
			tooltipData += "<tr>";
			tooltipData += "<td style='background:" + bgClr + ";border-right: 1px solid #E0DFDF; padding:5px;'>" + key + "</td>";
			tooltipData += "<td style='background:" + bgClr + ";border:" + border + ";border-bottom:"+bottomborder+";paading:5px;'>" + toolTipObj[key] + "</td>";
			tooltipData += "</tr>";
		}
		tooltipData += "</table";*/
        tooltipContent = tooltipData;
    } else if (isNaN(tooltipContent) && divObj.textContent !== tooltipContent) {
        tooltipContent = b64DecodeUnicode(tooltipContent);
        tooltipContent = (tooltipContent === "&nbsp;") ? "" : tooltipContent;
    }
    $("#toolTipDiv").remove();
    if (IsBoolean(showTooltip) && ("" + tooltipContent.trim().length > 0)) {
        var obj = document.createElement("div");
        obj.id = "toolTipDiv";
        obj.setAttribute("class", "settingIcon");
        document.body.appendChild(obj);
        var tooltipBGColor = (tooltipBGColor != "" && tooltipBGColor != "") ? hex2rgb(convertColorToHex(tooltipBGColor), tooltipBGAlpha) : "#ffffff";
        //"padding": (toolTipObj === undefined) ? "8px" : "0px",
        $(obj).css({
            "visibility": "",
            "display": "block",
            "position": "absolute",
            "opacity": "1",
            "padding": (isgridcustomtooltip) ? "24px" : "5px",
            "z-index": "999",
            //"top": pageY + 15 + "px",
            //"left": pageX - 10 + "px",
            "fontFamily": selectGlobalFont("Roboto"),
            "fontSize": "12px",
            "width": customToolTipWidth + "px",
            "fontWeight": "normal",
            "zIndex": "10000",
            "backgroundColor": tooltipBGColor,
            "border": (isgridcustomtooltip) ? "0px solid #cccccc" : "1px solid #cccccc",
            "borderRadius": (isgridcustomtooltip) ? "8px" : "0px",
            /*"box-shadow": "0px 0px 5px 0px rgba(0, 0, 0, 0.2), 0px 0px 5px 0px rgba(0, 0, 0, 0.2)",
            "-webkit-box-shadow": "0px 0px 5px 0px rgba(0, 0, 0, 0.2), 0px 0px 5px 0px rgba(0, 0, 0, 0.2)"*/
        });
        obj.innerHTML = tooltipContent;
        
        var width = obj.clientWidth;
        var height = obj.clientHeight;
        var pos = {
            left: (pageX * 1) - (width / 2) + (scrollLeft * 1),
            top: pageY * 1 + 10 + (scrollTop * 1)
        };
        var place;
        if ((pageX * 1 + width / 2) >= endX) {
            if (pos.left * 1 > 0) {
                pos.left = (pos.left * 1) - (width / 2) + 26; //20
                //14+12 in which 14 is the half of funnel 12 is right of the funnel to end of tooltip withuot padding
                place = 'left';
            } else {
                if (pos.left * -1 < (width * 1 / 3)) {
                    pos.left = pos.left * -1;
                }
            }
        }
        if ((pageX * 1 - width / 2) <= startX) {
            pos.left = (pos.left * 1) + (width / 2) - 58;
            place = 'right';
        }
        var top = pageY - (height * 1) - 40 + (scrollTop * 1);
        //40 is sum of 36 which is margin top and margin botton for tooltip and 4 is tolerance 
        if ((pageY * 1 + height) >= endY && (top * 1 > 0)) {
            pos.top = top;
            if (place == 'left') {
                obj.setAttribute("placement", "top-right");
            } else if (place == 'right') {
                obj.setAttribute("placement", "top-left");
            } else {
                obj.setAttribute("placement", "top");
                pos.left = pos.left - 20;
                // 20 is subtracted for center funnel position as removing left padding
            }
        } else {
            if (place == 'left') {
                obj.setAttribute("placement", "bottom-right");
            } else if (place == 'right') {
                obj.setAttribute("placement", "bottom-left");
            } else {
                obj.setAttribute("placement", "bottom");
                pos.left = pos.left - 20;
            }
        }
        $(obj).css({
            "left": pos.left + "px",
            "top": pos.top + "px",
            "text-align": "left",
            "width": width
        });
    }
};
/** @description Removing the ToolTip Div **/
function hideToolTip() {
	$("#tooltipDiv").remove();
};
//# sourceURL=DataGrid.js
