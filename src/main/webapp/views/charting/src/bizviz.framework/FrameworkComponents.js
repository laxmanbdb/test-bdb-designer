/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: FrameworkComponents.js
 * @description Contains the Dashboard components which builds the dashboard 
 * */
var parser = new Parser();
var dataManager = new DataManager();
var serviceManager = new ServiceManager();
var gvController = new GlobalVariableController();
var rendererController = new RendererController();
var frameworkController = new FrameworkController();
var frameworkUtil = new FrameworkUtil();
	
/** @description Dashboard class which holds objects of all its components **/
function DashBoard() {
	this.m_id = "";
	this.m_DashboardOptions = "";
	this.m_LanguageMapping = "";
	this.m_FlashVars = "";
	this.m_AuthProfiles = "";
	this.m_DataProviders = "";
	this.m_GlobalVariable = "";
	this.m_AbsoluteLayout = "";
	this.m_ManageConnection = "";
	this.m_VisibilityConstraint = "";
	this.m_DataSetExpressions = "";
	this.m_Containers = "";
	this.m_bootstrap = false;
	this.m_scalingenabled = false;
	this.m_touchenabled = false;
	this.m_virtualDataSet = [];

	this.m_dataMap = new Object();
	this.m_widgetsArray = [];
	this.m_dataSetsArray = [];

	this.showWidgetArray = [];
	this.hideWidgetArray = [];
	this.availableGroups = [];
	
	this.m_dashboardjson = "";
	this.m_enablecache = false;
	this.m_enablereportburst = true;
	this.m_enableresize = false;
	this.m_crosshighligter = true;
};
DashBoard.prototype.setDashboardJson = function (dJson) {
	this.m_dashboardjson = dJson;
};
DashBoard.prototype.getDashboardJson = function (id) {
	return this.m_dashboardjson;
};

DashBoard.prototype.dashboardclick = function (id) {
	var temp = this;
	var dId = "#draggablesParentDiv"+id
	$(dId).click(function(evt) {
		if(temp.m_crosshighligter && temp.m_dataobj !== undefined && temp.m_dataobj.drillComponent !== undefined){
			temp.m_dataobj.drillComponent.m_drilltoggle = true;
			sdk.applyDrill(temp.m_drillcomps,temp.m_dataobj);
			//temp.m_dataobj.drillComponent.draw();
			temp.m_dataobj.drillComponent.m_drilltoggle = false;
			if(temp.m_dataobj.drillComponent.m_componenttype == "column_stack_chart" || temp.m_dataobj.drillComponent.m_componenttype == "line_chart" || temp.m_dataobj.drillComponent.m_componenttype == "mixed_chart" ||  temp.m_dataobj.drillComponent.m_componenttype == "bubble_chart"){
				temp.m_dataobj.drillComponent.m_drilltoggle = true;
			}
			var drillcomp = temp.m_dataobj.drillComponent.m_componenttype,
			wid = temp.m_dataobj.drillComponent;
			switch(drillcomp){
			case "bar_chart":
				for(var s=0;s<wid.m_noofseries;s++){
					for(var c=0;c<wid.m_categoryData[0].length;c++){
					  $("#stackgrp"+wid.m_objectid+"s"+s+"c"+c).css("opacity", "1");
					}
				}
				break;
			case "bubble_chart":
				for(var s = 0; s < wid.m_seriesData[0].length; s++){
					for(var c = 0; c < wid.m_categoryData.length; c++){
					  wid.m_transparencyarr[s][c] = 1;
					}
				}
				wid.initializeBubble();
				wid.drawChart();
				break;
			case "timeline_chart":
				for(var s=0;s<wid.m_seriesData.length;s++){
					for(var c=0;c<wid.SerData[0].length;c++){//wid.m_categoryData[0].length
						var clickid = (wid.m_columnSeries[wid.m_seriesNames[s]] !== undefined) ? "topRoundedStack" + wid.svgContainerId + s + c : "linestack" + wid.svgContainerId + s + c;
						var clickid_sl = (wid.m_columnSeries[wid.m_seriesNames[s]] !== undefined) ? "topRoundedStack_stackgrpslider" + wid.svgContainerId + s + c : "linestack" + wid.svgContainerId + s + c;
						if(IsBoolean(!wid.m_showslider)){
							 $("#"+clickid).css("opacity", "1");
						} else {
							$("#"+clickid).css("opacity", "1");
							$("#"+clickid_sl).css("opacity", "1");
						}
					}
				}
				break;
			case "group_bar_chart":
			case "group_column_chart":
				for(var s=0;s<wid.m_seriesData.length;s++){
					for(var c=0;c<wid.m_categoryData[0].length;c++){
					  $("#stackgrp"+wid.m_objectid+s+c).css("opacity", "1");
					}
				}
				break;
			case "scattered_plot_chart":
				for(var s=0;s<wid.m_seriesData.length;s++){
					for(var c=0;c<wid.m_categoryData[0].length;c++){
					   $("#scatterplot"+wid.m_objectid+s+c).css("opacity", "1");
					}
				}
				break;
			case "mixed_chart":
				for(var s = 0; s < wid.m_seriesData[0].length; s++){//this.m_seriesNames
					for(var c = 0; c < wid.m_seriesNames.length; c++){
					  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 1;
					}
				}
				wid.instanciateSeries(wid.seriesDataMap);
				//this.m_yAxis.m_yAxisMarkersArray = "";
			  	//this.m_yAxis.m_isSecodaryAxis = false;
				wid.drawChart();
				break;
			case "line_chart":
				for(var s = 0; s < wid.m_seriesData[0].length; s++){//this.m_seriesNames
					for(var c = 0; c < wid.m_seriesNames.length; c++){
							wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 1;
						}
					}
				wid.initializeCalculation();
				wid.drawChart();
				break;
			case "column_stack_chart":
				for(var s = 0; s < wid.m_seriesData[0].length; s++){//this.m_seriesNames
					for(var c = 0; c < wid.m_seriesNames.length; c++){
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 1;
						}
					}
				wid.m_stackWidth = wid.m_calculation.getBarWidth();
				wid.initializeColumns();
				wid.drawChart();
				break;
			}
		}
	});
}
DashBoard.prototype.setId = function (id) {
	this.m_id = id;
};
DashBoard.prototype.getId = function () {
	return this.m_id;
};
DashBoard.prototype.setAbsoluteLayout = function (AbsoluteLayoutobj) {
	this.m_AbsoluteLayout = AbsoluteLayoutobj;
};
DashBoard.prototype.getAbsoluteLayout = function () {
	return this.m_AbsoluteLayout;
};
DashBoard.prototype.setContainers = function (cnt) {
	this.m_Containers = cnt;
};
DashBoard.prototype.getContainers = function () {
	return this.m_Containers;
};
DashBoard.prototype.isBootstrap = function () {
	return IsBoolean(this.m_bootstrap);
};
DashBoard.prototype.setBootstrap = function (status) {
	this.m_bootstrap = status;
};
DashBoard.prototype.isScalingEnabled = function () {
	if (this.isValidMobileView()) {
		//return (IsBoolean(this.m_scalingenabled && this.getAbsoluteLayout().m_scalingview == "fitToWidth") ? true: false);
		this.m_scalingenabled = true;
		this.getAbsoluteLayout().m_scalingview = "fitToWidth";
		this.getAbsoluteLayout().m_height = windowWH.h - this.getAbsoluteLayout().getBorderThickness()*this.getAbsoluteLayout().getDashboardMarginRatio();
		return true;
	} else {
		return (IsBoolean(this.m_scalingenabled)) ? true : ((this.isTouchEnabledDevice()) ? true : false) ;
	}
};
DashBoard.prototype.setScalingEnabled = function (status) {
	this.m_scalingenabled = status;
};
DashBoard.prototype.isTouchEnabledDevice = function () {
	return  (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) ? true : false;
};
DashBoard.prototype.isValidMobileView = function () {
	if (detectDevice.mobile()) {
		if (this.m_dashboardjson.Niv.Dashboard.MobileLayout) {
			return (this.m_dashboardjson.Niv.Dashboard.MobileLayout.Object.length > 0) ? true : false;
		} else {
			return false;
		}
	} else if (detectDevice.tablet()) {
		if (this.m_dashboardjson.Niv.Dashboard.TabletLayout) {
			return (this.m_dashboardjson.Niv.Dashboard.TabletLayout.Object.length > 0) ? true : false;
		} else {
			return false;
		}
	} else {
		return false;
	}
};
DashBoard.prototype.setTouchEnabledDevice = function (status) {
	this.m_touchenabled = status;
};
DashBoard.prototype.setDashboardOptions = function (xmlDashboardOptions) {
	this.m_DashboardOptions = xmlDashboardOptions;
};
DashBoard.prototype.getDashboardOptions = function () {
	return this.m_DashboardOptions;
};
DashBoard.prototype.setLanguageMapping = function (xmlLanguageMapping) {
	this.m_LanguageMapping = xmlLanguageMapping;
	dGlobals.langMap.isEnabled = IsBoolean(this.m_LanguageMapping.m_enable);
	dGlobals.langMap.id = this.m_LanguageMapping.m_mappingid;
	dGlobals.langMap.name = this.m_LanguageMapping.m_mappingname;
	dGlobals.langMap.language = this.m_LanguageMapping.m_language;
	dGlobals.langMap.hideBrackets = this.m_LanguageMapping.m_hidebrackets;
};
DashBoard.prototype.getLanguageMapping = function () {
	return this.m_LanguageMapping;
};

DashBoard.prototype.setFlashVars = function (xmlFlashVar) {
	this.m_FlashVars = xmlFlashVar;
};
DashBoard.prototype.getFlashVars = function () {
	return this.m_FlashVars;
};

DashBoard.prototype.setAuthProfiles = function (xmlAuthProfiles) {
	this.m_AuthProfiles = xmlAuthProfiles;
};
DashBoard.prototype.getAuthProfiles = function () {
	return this.m_AuthProfiles;
};

DashBoard.prototype.setVisibilityConstraint = function (xmlVisibilityConstraint) {
	this.m_VisibilityConstraint = xmlVisibilityConstraint;
};
DashBoard.prototype.getVisibilityConstraint = function () {
	return this.m_VisibilityConstraint;
};

DashBoard.prototype.setDataSetExpressions = function (dataSetExpressionObj) {
	this.m_DataSetExpressions = dataSetExpressionObj;
};
DashBoard.prototype.getDataSetExpressions = function () {
	return this.m_DataSetExpressions;
};

DashBoard.prototype.setDataProviders = function (xmlDataProviders) {
	this.m_DataProviders = xmlDataProviders;
};
DashBoard.prototype.getDataProviders = function () {
	return this.m_DataProviders;
};

DashBoard.prototype.setGlobalVariable = function (xmlGlobalVariable) {
	this.m_GlobalVariable = xmlGlobalVariable;
};
DashBoard.prototype.getGlobalVariable = function () {
	return this.m_GlobalVariable;
};

DashBoard.prototype.setManageConnection = function (ManageConnection) {
	this.m_ManageConnection = ManageConnection;
};
DashBoard.prototype.getManageConnection = function () {
	return this.m_ManageConnection;
};

DashBoard.prototype.setVirtualDataSet = function (VirtualDataSet) {
	this.m_virtualDataSet.push(VirtualDataSet);
};
DashBoard.prototype.getVirtualDataSet = function () {
	return this.m_virtualDataSet;
};

DashBoard.prototype.getdataMap = function () {
	return this.m_dataMap;
};
DashBoard.prototype.getXMLData = function (connID) {
	return this.m_dataMap[connID];
};
DashBoard.prototype.pushUniqueToAvailableGroups = function (groupName) {
	pushIfNotExist(this.availableGroups, groupName, function (e) {
		return e === groupName;
	});
};
DashBoard.prototype.getAllGroups = function () {
	return this.availableGroups;
};
/** 
 * @description drawing of dashboard starts  
 * */
DashBoard.prototype.drawDashBoard = function () {
	if (IsBoolean(isGroup)) {
		for (var i = 0; i < this.getAbsoluteLayout().m_group.length; i++){
			this.getAbsoluteLayout().m_group[i].drawObject();
		}
	}
	this.initializeScaling();
	this.initializeDataProvider();
	this.initializeDraggableDivAndCanvas();
	this.getAbsoluteLayout().drawAbsoluteCanvas();
	this.getAbsoluteLayout().drawMaximizeOverlayDiv();
	this.drawComponentsDontHaveDataSet();
	this.notify();
};
/** 
 * @description check for touch device or scaling:true property of dashbaord 
 * */
DashBoard.prototype.initializeScaling = function () {
	isTouchEnabled = this.isTouchEnabledDevice();
	isScaling = (this.isBootstrap()) ? false : this.isScalingEnabled();
	/** If last previewed dashboard has scaling enabled - these ratio was updated according 
	 * Reset the ratio to 1 when new dashboard previewed **/
	widthRatio = 1;
	heightRatio = 1;
	if (isScaling){
		this.initializeScalingOfAbsoluteLayout();
		this.initializeScalingOfWidgets();
	}else{
		this.m_top = 0;
		this.m_left = 0;
	}	
};
/** 
 * @description call absoluteLayout scaling 
 * */
DashBoard.prototype.initializeScalingOfAbsoluteLayout = function () {
	this.getAbsoluteLayout().initializeScaling();
};
/** 
 * @description call scaling of all the widgets 
 * */
DashBoard.prototype.initializeScalingOfWidgets = function () {
	for (var i = 0; i < this.m_widgetsArray.length; i++) {
		this.m_widgetsArray[i].initializeScaling();
	}
};
/** 
 * @description initialize DataProviders
 * */
DashBoard.prototype.initializeDataProvider = function () {
	this.initDataProviders();
	this.registerWidgetsForDrillColorWithGlobalVariable();
	this.registerWebSeviceWithDataprovider();

	this.registerDataSetValuesWithDataprovider();
	this.registerDataSetsWithDataSetValues();
	this.registerWidgetsWithDataSet();

	this.registerDynamicalyUpdateComponent();
};
/** 
 * @description initialize services 
 * */
DashBoard.prototype.initDataProviders = function () {
	for (var i = 0; i < this.getDataProviders().getDataURL().length; i++) {
		this.getDataProviders().getDataURL()[i].init();
	}
};

DashBoard.prototype.registerWidgetsForDrillColorWithGlobalVariable = function () {
	var globalVarArray = this.getGlobalVariable().getVariable();
	for (var l = 0; l < globalVarArray.length; l++) {
		for (var i = 0; i < this.getDataProviders().getDataURL().length; i++) {
			var id = this.getDataProviders().getDataURL()[i].getId();
			for (var j = 0; j < this.m_widgetsArray.length; j++) {
				var component = this.m_widgetsArray[j];
				if (component.m_objecttype == "chart" && component.getDataSourceId() == id && (IsBoolean(component.m_enablecolorfromdrill))) {
					globalVarArray[l].registerWidgetsForDrillColor(component);
				}
			}
		}
	}
};

DashBoard.prototype.registerWebSeviceWithDataprovider = function () {
	for (var i = 0; i < this.getDataProviders().getDataURL().length; i++) {
		var dataProvider = this.getDataProviders().getDataURL()[i];
		if (dataProvider.getType() != "offline") {
			dataProvider.registerWebServiceWithDataProvider(this);
		}
	}
};

DashBoard.prototype.registerDataSetValuesWithDataprovider = function () {
	for (var i = 0; i < this.getDataProviders().getDataURL().length; i++) {
		this.getDataProviders().getDataURL()[i].registerDataSetValuesWithDataprovider();
	}
};

DashBoard.prototype.registerDataSetsWithDataSetValues = function () {
	for (var i = 0; i < this.getDataProviders().getDataURL().length; i++) {
		var dataProvider = this.getDataProviders().getDataURL()[i];
		for (var j = 0; j < this.m_dataSetsArray.length; j++) {
			if (this.m_dataSetsArray[j].getDataSource() == dataProvider.getId()) {
				dataProvider.getDataSetValues().registerDataSetsWithDataSetValues(this.m_dataSetsArray[j]);
			}
		}
	}
};

DashBoard.prototype.registerWidgetsWithDataSet = function () {
	for (var i = 0; i < this.m_dataSetsArray.length; i++) {
		for (var j = 0; j < this.m_widgetsArray.length; j++) {
			if (this.m_dataSetsArray[i].getId() == this.m_widgetsArray[j].getDataSetId()) {
				this.m_dataSetsArray[i].registerWidgetsWithDataSet(this.m_widgetsArray[j]);
			}
		}
	}
};

DashBoard.prototype.registerDynamicalyUpdateComponent = function () {
	this.m_observerDynamicalyUpdateComponent = [];
	for (var i = 0; i < this.m_widgetsArray.length; i++) {
		var objectType = this.m_widgetsArray[i].m_objecttype;
		if (objectType == "label" || objectType == "textbox") {
			var checkIsdynamic = this.m_widgetsArray[i].m_isdynamic;
			var checkVirtualDataSet = this.m_widgetsArray[i].m_isVirtualDataSetavailable;
			if (frameworkUtil.IsBoolean(checkIsdynamic) && !frameworkUtil.IsBoolean(checkVirtualDataSet))
				this.setDynamicalyUpdateComponent(this.m_widgetsArray[i]);
		} else if (objectType == "gauge" || objectType == "semigauge") {
			if (this.m_widgetsArray[i].m_valuevariable != "" && !frameworkUtil.IsBoolean(this.m_widgetsArray[i].m_isVirtualDataSetavailable))
				this.setDynamicalyUpdateComponent(this.m_widgetsArray[i]);
		} else {
			// Do nothing
		}
	}
};

DashBoard.prototype.setDynamicalyUpdateComponent = function (labelTextBoxObject) {
	this.m_observerDynamicalyUpdateComponent.push(labelTextBoxObject);
};

/** 
 * @description initialize DraggableDiv And Canvas for absolute layout
 * */
DashBoard.prototype.initializeDraggableDivAndCanvas = function () {
	var dashboardName = "dashboardName";
	this.getAbsoluteLayout().init(dashboardName);
	for (var i = 0; i < this.m_widgetsArray.length; i++) {
		this.m_widgetsArray[i].initializeDraggableDivAndCanvas(dashboardName, i);
	}
};
/** 
 * @description draw Components Don't Have DataSet
 * */
DashBoard.prototype.drawComponentsDontHaveDataSet = function () {
	for (var i = 0; i < this.m_widgetsArray.length; i++) {
		if (!IsBoolean(this.m_widgetsArray[i].m_isDataSetavailable)) {
			this.m_widgetsArray[i].drawObject();
		}
	}
};
/** 
 * @description call the notify of the data provider 
 * */
DashBoard.prototype.notify = function () {
	for (var i = 0; i < this.getDataProviders().getDataURL().length; i++) {
		this.getDataProviders().getDataURL()[i].notify();
	}
};

DashBoard.prototype.initializeData = function () {
	for (var i = 0; i < this.m_widgetsArray.length; i++) {
		this.m_widgetsArray[i].initializeData();
	}
};
DashBoard.prototype.initWindowResizeEvent = function () {
	if ((navigator.userAgent.match(/(iPad|iPhone)/g) ? true : false) || this.getAbsoluteLayout().m_layouttype == "MobileLayout"){
		if(dGlobals.dashboardState.orientationchange){
			$( window ).on( "orientationchange", function( event ) {
				dGlobals.dashboardState.orientationchange = false;
				setTimeout(function() {
					//console.log(windowWH.w +"-"+ windowWH.h +"-"+ windowWH.o +"/"+ window.innerWidth +"-"+ window.innerHeight +"-"+ window.orientation);
					//landscape- portrait:  1024-653 / 1020-909   115
					// portrait - landscape: 768-909 / 1024-904   256
					if((Math.abs(windowWH.o) !== Math.abs(window.orientation)) && (window.orientation == 180 || window.orientation == 0)){
						// Landscape - portrait
						windowWH.w = windowWH.aw - 256;
						windowWH.h = windowWH.ah + 256;
					}else if((Math.abs(windowWH.o) !== Math.abs(window.orientation)) &&(window.orientation == 90 || window.orientation == -90)){
						// Portrait - landscape
						windowWH.w = windowWH.aw + 256;
						windowWH.h = windowWH.ah - 256;
					}else{
						windowWH.w = windowWH.aw;
						windowWH.h = windowWH.ah;
					}
					frameworkController.resizeDashboard();
				},10);
			});
		}
	}else{
		if(dGlobals.dashboardState.resize){
			$(window).resize(function(){
				dGlobals.dashboardState.resize = false;
				if(frameworkController.dashboard){
					if(frameworkController.dashboard.getAbsoluteLayout()){
						if(this.windowResizeTO){
							clearTimeout(windowResizeTO);
						}
						this.windowResizeTO = setTimeout(function() {
							console.log("1:"+Math.random());
							$(this).trigger("resizeEnd");
						}, 100);
					}
				}
			});
			$(window).bind("resizeEnd", function(){
				windowWH = {"aw": window.innerWidth, "ah": window.innerHeight, 
						"w": window.innerWidth, "h": window.innerHeight, 
						"o": window.orientation};
				console.log("2:"+Math.random());
				frameworkController.resizeDashboard();
			});
		}else{
			/** ReCalculate the window dimensions for scaling **/
			windowWH = {"aw": window.innerWidth, "ah": window.innerHeight, 
					"w": window.innerWidth, "h": window.innerHeight, 
					"o": window.orientation};
		}
	}
};
/**************************************************************************/

/** 
 * @description Constructor AbsoluteLayout
 * */
function AbsoluteLayout() {
	this.m_width = "800";
	this.m_borderthickness = "0";
	this.m_gradients = "";
	this.m_height = "500";
	this.m_gradientrotation = "";
	this.m_bordercolor = "";
	this.m_bgalpha = 1;
	this.m_dashBoard = "";
	this.m_manageConnection = "";
	this.m_widgetsArray = [];

	this.m_widgetsGroupArray = [];
	this.m_widgetsGroup = [];
	this.m_group = [];
	this.GaugeObjectArray = [];

	/** for background gradient color use the chart frame **/
	this.m_chartFrame = new ChartFrame();
	this.m_showborder = true;
	this.m_left = 0;
	this.m_top = 0;
	this.m_absoluteLayoutName = "";
	this.m_bootstrap = false;
	this.m_scalingenabled = false;
	this.m_scalingview = "fitToPage";
	this.m_dashboardalign = "none";
	this.m_ALWidth = this.m_width;
	this.m_ALHeight = this.m_height;
	this.m_dashboardmargin = 0; //default was 1
	this.m_dashboardmarginratio = 0; //default was 4
	this.m_defaultabslolutelayoutpadding = 0; //default was 2
};
AbsoluteLayout.prototype.setBorderThickness = function (m_borderthickness) {
	this.m_borderthickness = m_borderthickness;
};
AbsoluteLayout.prototype.getBorderThickness = function () {
	return this.m_borderthickness;
};
AbsoluteLayout.prototype.setWidgetObjectsArray = function (widgetObject) {
	this.m_widgetsArray.push(widgetObject);
};
AbsoluteLayout.prototype.getWidgetObjectsArray = function () {
	return this.m_widgetsArray;
};
AbsoluteLayout.prototype.setGroupObject = function (groupObj) {
	this.m_group.push(groupObj);
};

AbsoluteLayout.prototype.setGroupWidgetsToArray = function (component) {
	this.m_widgetsGroup.push(component);
};
AbsoluteLayout.prototype.setGroupToArray = function (group) {
	this.m_widgetsGroupArray.push(group);
};

AbsoluteLayout.prototype.setnivGaugeObject = function (GaugeObject) {
	this.GaugeObjectArray.push(GaugeObject);
};

AbsoluteLayout.prototype.getnivGaugeObject = function () {
	return this.GaugeObjectArray;
};

AbsoluteLayout.prototype.getDefaultAbsloluteLayoutPadding = function () {
	/** To prevent Extra H/V scroll in dashboard when component placed at extrme right-bottom **/
	return this.m_defaultabslolutelayoutpadding;
};
AbsoluteLayout.prototype.getDashboardMarginRatio = function () {
	return this.m_dashboardmarginratio;
};
/** @Description Margin from all sides for better look of dashboard when scaling enabled **/
AbsoluteLayout.prototype.getDashboardMargin = function (wWidth, wHeight) {
	/** Keeping margin as 1% of the smallest side **/
	/*
	var smallerSide = (wWidth < wHeight) ? wWidth : wHeight ;
	var margin = parseInt(smallerSide / 100);
	*/
	var margin = this.m_dashboardmargin;
	return margin;
};
/** 
 * @description initialize Scaling for dashboard 
 * */
AbsoluteLayout.prototype.initializeScaling = function () {
	var wWidth = windowWH.w;//window.innerWidth;
	var wHeight = windowWH.h;//window.innerHeight;
	this.m_ALWidth = this.m_width;
	this.m_ALHeight = this.m_height;
	var margin, windowWidth, windowHeight;
	if( this.m_scalingview == "fitToPage" ){
		margin = this.getDashboardMargin(wWidth, wWidth);
		this.m_top = margin;
		this.m_left = margin;
		
		windowWidth = wWidth - this.getBorderThickness() * 2
		windowHeight = wHeight - this.getBorderThickness() * 2
		
		widthRatio = (windowWidth) / this.m_width;
		heightRatio = (windowHeight) / this.m_height;
		this.m_ALWidth = windowWidth;
		this.m_ALHeight = windowHeight;
	}else if( this.m_scalingview == "fitToWidth" ){
		margin = this.getDashboardMargin(wWidth, wHeight);
		this.m_top = margin;
		this.m_left = margin;
		windowWidth = wWidth - this.getBorderThickness() * 2;
		
		widthRatio = (windowWidth) / this.m_width;
		heightRatio = (this.m_height) / this.m_height;
		this.m_ALWidth = windowWidth;
		this.m_ALHeight = this.m_height;
		
		this.m_left = margin;
		//this.m_top = ((wHeight - this.m_height)/2) < 0 ? margin : (wHeight - this.m_height)/2;
		this.m_top = (this.m_dashboardalign == "alignTop") ? 0 : ((wHeight - this.m_height)/2) < 0 ? margin : (wHeight - this.m_height)/2;
	}else if( this.m_scalingview == "fitToHeight" ){
		margin = this.getDashboardMargin(wHeight, wHeight);
		windowHeight = wHeight - this.getBorderThickness() * 2;
		
		widthRatio = (this.m_width) / this.m_width;
		heightRatio = (windowHeight) / this.m_height;
		this.m_ALWidth = this.m_width;
		this.m_ALHeight = windowHeight;
		
		this.m_top = margin;
		//this.m_left = ((wWidth - this.m_width)/2) < 0 ? margin : (wWidth - this.m_width)/2;
		this.m_left = (this.m_dashboardalign == "alignLeft") ? 0 : ((wWidth - this.m_width)/2) < 0 ? margin : (wWidth - this.m_width)/2;
	}else if( this.m_scalingview == "proportionate" ){
		var w, h;
		var actualRatio = this.m_width / this.m_height;
		if(wWidth > wHeight){
			w = wHeight * actualRatio;
			h = wHeight;
			if(w > wWidth){
				w = wWidth;
				h = wWidth/actualRatio;
			}
		}else{
			w = wWidth;
			h = wWidth / actualRatio;
			if(h > wHeight){
				w = wHeight*actualRatio;
				h = wHeight;
			}
		}
		
		margin = this.getDashboardMargin(w, h);
		
		widthRatio = (w - margin*2) / this.m_width;
		heightRatio = (h - margin*2) / this.m_height;
		
		this.m_ALWidth = Math.floor(w - this.getBorderThickness() * 2);
		this.m_ALHeight = Math.floor(h - this.getBorderThickness() * 2);
		
		var scaleRatio = wWidth / wHeight;
		if(actualRatio > scaleRatio){
			this.m_top = (wHeight - h)/2;
			this.m_left = margin;
		}else{
			this.m_top = margin;
			this.m_left = (wWidth - w)/2;
		}
	}else{
		// Do nothing
	}
};
	
/** 
 * @description initialize absolute layout of the  dashboard 
 * */
AbsoluteLayout.prototype.init = function (name, bootstrap) {
	this.m_absoluteLayoutName = name;
	this.m_bordercolor = convertColorToHex(this.m_bordercolor);
	this.absoluteLayoutId = "draggablesParentDiv" + this.m_absoluteLayoutName;
	/** remove the dashboard division if already exists **/
	$("#" + this.absoluteLayoutId).remove();
	var absoluteLayout = document.createElement("div");
	absoluteLayout.setAttribute("class", "draggablesParentDiv");
	absoluteLayout.id = this.absoluteLayoutId;
	$("#WatermarkDiv").append(absoluteLayout);
	var cssObj = {"overflow-x": "auto", "overflow-y": "auto"};
	if(IsBoolean(isScaling)){
		if(this.m_scalingview == "fitToWidth"){
			cssObj["overflow-x"] = "hidden";
		}else if(this.m_scalingview == "fitToHeight"){
			cssObj["overflow-y"] = "hidden";
		}else{
			// Do nothing
		}
	}
	$("#WatermarkDiv").css(cssObj);
	$("#maximizeOverlayDiv").remove();
	var maximizeOverlayDiv = document.createElement("div");
	maximizeOverlayDiv.setAttribute("id", "maximizeOverlayDiv");
	absoluteLayout.appendChild(maximizeOverlayDiv);

	if (this.m_borderthickness === ""){
		this.setBorderThickness(0);
	}
	this.m_ALWidth = this.m_ALWidth*1 + this.getDefaultAbsloluteLayoutPadding()*1 + this.getBorderThickness() * 2;
	this.m_ALHeight = this.m_ALHeight*1 + this.getDefaultAbsloluteLayoutPadding()*1 + this.getBorderThickness() * 2;
	
	/** Reset viewport body overflow css that set when show chart data popupDiv hide overflow on preview mode**/
	if(this.m_layouttype == "AbsoluteLayout") {
		if(IsBoolean(isScaling) && IsBoolean(this.m_enableresize))
		{
			$(".ui-mobile-viewport").css("overflow", "hidden");
		}
		else{
			$(".ui-mobile-viewport").css("overflow", "");
		}
	}
	
	/** To prevent the selection of component when taphold event is occuring **/
	/*
	if( IsBoolean(isTouchEnabled) ){
		$("body").css("-webkit-touch-callout", "none");
		$("body").css("-webkit-user-select", "none");
	}
	*/
};
/** 
 * @description draw AbsoluteCanvas
 * */
AbsoluteLayout.prototype.drawAbsoluteCanvas = function () {
	this.draw(this.absoluteLayoutId, 0, {"x":this.m_left+"px","y":this.m_top+"px","w":this.m_ALWidth+"px", "h":this.m_ALHeight+"px"}, this.getBorderThickness() + "px solid " + this.m_bordercolor, "auto");
};
/** 
 * @description draw maximize division 
 * */
AbsoluteLayout.prototype.drawMaximizeOverlayDiv = function () {
	this.draw("maximizeOverlayDiv", 0, {"x":"0px","y":"0px","w":"0%", "h":"0%"}, "0px", "none");
};
/** 
 * @description draw AbsoluteCanvas and maximize division 
 * */
AbsoluteLayout.prototype.draw = function (absoluteLayoutID, zindex, dimensions, border, overflow) {
	if (this.m_bootstrap) {
		$("#" + absoluteLayoutID).css({"width": "100%", "height": "auto"});
		/** To remove default padding of -15px in bootstrap **/
//		$("#" + absoluteLayoutID).css("padding-left", "20px");
		/** to avoid Horizontal scroll in previous approach **/
		$("#" + absoluteLayoutID).addClass("container");
//		if (navigator.userAgent.match(/(iPad|iPhone)/g) ? true : false){
			$("#" + absoluteLayoutID).css("overflow", "auto");
//		}
	} else {
		$("#" + absoluteLayoutID).css({"left" : dimensions.x, "top": dimensions.y, "width": dimensions.w, "height": dimensions.h });
		if(!IsBoolean(isScaling)){
			$("#" + absoluteLayoutID).css("margin", "auto");
		}else{
			$("#WatermarkDiv").css("overflow", "hidden");
		}
	}
	$("#" + absoluteLayoutID).css({"border": border, "overflow": overflow, "z-index": zindex});
	if (navigator.userAgent.match(/(iPad|iPhone)/g) ? true : false) {
		$("#" + absoluteLayoutID).css("position", "absolute");
		$("#" + absoluteLayoutID).addClass("iPhoneScrollBar");//Added for smooth scroll in iPhone
	} else{
		$("#" + absoluteLayoutID).css("position", "relative");
		$("#" + absoluteLayoutID).removeClass("iPhoneScrollBar");
	}
	/** Hide scrollBar from mobile view**/
	if(this.m_layouttype == "MobileLayout") {
		$("#" + absoluteLayoutID).addClass("hideScrollBar");//Added for hide scrollBar
		if(detectDevice.mobile()){
			$("#" + absoluteLayoutID).css("overflow-x", "hidden");
			$("#WatermarkDiv").css("overflow", "hidden");
			$(window.parent.document.getElementById("contentView")).css("overflow", "hidden");
			$("#dashboardViewerFrame").css("overflow", "hidden");
			/* Added to resolve comp disappear issue while scrolling in mobile devices browser */	
			$("#" + absoluteLayoutID).addClass("mobileViewCSS");
		} else {
			$("#" + absoluteLayoutID).removeClass("mobileViewCSS");
		}
	} else {
		$("#" + absoluteLayoutID).removeClass("hideScrollBar");
		$("#" + absoluteLayoutID).removeClass("mobileViewCSS");
	}
	this.setDashboardCSS(absoluteLayoutID);
};
/** 
 * @description set dashboard css
 * */
AbsoluteLayout.prototype.setDashboardCSS = function (absoluteLayoutID, zindex, border) {
	var deg = this.m_gradientrotation;
	var grads = ["rgba(255,255,255,1)", "rgba(255,255,255,1)"];
	var gradientString = this.m_gradients;
	var bgAlpha = this.m_bgalpha;
	if (gradientString && gradientString != "") {
		var gradientArray = gradientString.split(",");
		if (gradientArray.length == 1) {
			grads[0] = hex2rgb(convertColorToHex(gradientArray[0]), bgAlpha);
			grads[1] = hex2rgb(convertColorToHex(gradientArray[0]), bgAlpha);
		} else {
			for (var i = 0; i < gradientArray.length; i++) {
				grads[i] = hex2rgb(convertColorToHex(gradientArray[i]), bgAlpha);
			}
		}
	}
	var gradsStr = "";
	for (var j = 0; j < grads.length; j++) {
		var suffix = (j < grads.length - 1) ? " ," : "";
		gradsStr += grads[j] + suffix;
	}
	/** Standard syntax **/
	$("#" + absoluteLayoutID).css({
		"background" : "linear-gradient(" + deg + "deg, " + gradsStr + ")"
	});
	/** For Safari 5.1 to 6.0 **/
	$("#" + absoluteLayoutID).css({
		"background" : "-webkit-linear-gradient(" + deg + "deg, " + gradsStr + ")"
	});
	/** For Opera 11.1 to 12.0 **/
	$("#" + absoluteLayoutID).css({
		"background" : "-o-linear-gradient(" + deg + "deg, " + gradsStr + ")"
	});
	/** For Firefox 3.6 to 15 **/
	$("#" + absoluteLayoutID).css({
		"background" : "-moz-linear-gradient(" + deg + "deg, " + gradsStr + ")"
	});
};

/****************************************************************************/

function DashboardOptions() {
	this.m_expirydate = "";
	this.m_hasexpiry = "";
	this.m_publishwsdlserver = "";
};

DashboardOptions.prototype.setExpiryDate = function (m_expirydate) {
	this.m_expirydate = m_expirydate;
};
DashboardOptions.prototype.getExpiryDate = function () {
	return this.m_expirydate;
};

DashboardOptions.prototype.setHasExpiry = function (m_hasexpiry) {
	this.m_hasexpiry = m_hasexpiry;
};
DashboardOptions.prototype.getHasExpiry = function () {
	return this.m_hasexpiry;
};

DashboardOptions.prototype.setPublishWSDLServer = function (m_publishwsdlserver) {
	this.m_publishwsdlserver = m_publishwsdlserver;
};
DashboardOptions.prototype.getPublishWSDLServer = function () {
	return this.m_publishwsdlserver;
};


function FlashVars() {
	this.m_param = [];
};

FlashVars.prototype.setParam = function (param) {
	this.m_param.push(param);
};

FlashVars.prototype.getParam = function () {
	return this.m_param;
};

FlashVars.prototype.getParamFromName = function (name) {
	for (var i = 0; i < this.m_param.length; i++) {
		var param = this.m_param[i];
		if (param.m_name == name) {
			return param;
		}
	}
	return "";
};

function Param() {
	this.m_name;
	this.m_value;
};

Param.prototype.getName = function () {
	return this.m_name;
};
Param.prototype.setName = function (m_name) {
	this.m_name = m_name;
};
Param.prototype.getValue = function () {
	return this.m_value;
};
Param.prototype.setValue = function (m_value) {
	this.m_value = m_value;
};

function AuthProfiles() {
	this.m_profile = [];
};

AuthProfiles.prototype.setProfile = function (m_profile) {
	this.m_profile.push(m_profile);
};

AuthProfiles.prototype.getProfile = function () {
	return this.m_profile;
};

function Profile() {
	this.m_name;
	this.m_username;
	this.m_password;
};

Profile.prototype.setName = function (m_name) {
	this.m_name = m_name;
};
Profile.prototype.getName = function () {
	return this.m_name;
};
Profile.prototype.setUserName = function (m_username) {
	this.m_username = m_username;
};
Profile.prototype.getUserName = function () {
	return this.m_username;
};
Profile.prototype.setPassword = function (m_password) {
	this.m_password = m_password;
};
Profile.prototype.getPassword = function () {
	return this.m_password;
};

function DataProviders() {
	this.m_dataurl = [];
	this.m_dataUrlIdObjMap = new Object();
};

DataProviders.prototype.setDataURL = function (DataURLObj) {
	this.m_dataurl.push(DataURLObj);
};
DataProviders.prototype.getDataURL = function () {
	return this.m_dataurl;
};

DataProviders.prototype.getDataProviderObject = function (dataUrl) {
	var DataURLObj = new DataURL();
	for (var i = 0; i < dataUrl.attributes.length; i++) {
		var attribute = dataUrl.attributes[i];
		if (attribute.name == "type") {
			if (attribute.value == "offline") {
				DataURLObj = new OfflineDataProvider();
			} else {
				DataURLObj = new OnlineDataProvider();
			}
		}
	}
	return DataURLObj;
};

function DataURL() {
	this.m_userid;
	this.m_id;
	this.m_profilename;
	this.m_url;
	this.m_islangwebservice;
	this.m_allowsessionid;
	this.m_profilename;
	this.m_refreshseconds;
	this.m_timelyrefresh;
	this.m_drillwhendatachanges;
	this.m_offlinedataid;
	this.m_password;
	this.m_type;
	this.m_loadatstartup;
	this.m_fieldSet = [];
	this.m_con;
	this.m_clarityslice;
	this.m_claritysort;
	this.isSorting = false;
	this.m_keys = [];
	this.m_dashboard = "";
	this.m_webservice = "";
	this.m_dataSetValues = "";
	this.m_languageMappingValues = "";
	this.m_fieldNamesArray = [];
	this.m_queryParamsMap = "";
	this.m_dataLoadCount = 0;
	this.m_wholeData;
	this.m_notifierCallbacks = [];
	this.m_datatype = "JSON";
	this.m_soapendpoint = "";
	/** BDD-61, BDD-403, if filter values matches with m_skipfiltervalues array,
	 * connection-filter should not pass those key-values in SOAP-XML. Default skip is "blank" **/
	this.m_skipfiltervalues = [""];
	this.m_clausevalues = {};
};

DataURL.prototype.init = function () {
	this.m_fieldNamesArray = this.setFieldNames();
};
DataURL.prototype.setQueryParamsMap = function (queryParamsMap) {
	this.m_queryParamsMap = queryParamsMap;
};
DataURL.prototype.getQueryParamsMap = function () {
	return this.m_queryParamsMap;
};

DataURL.prototype.getUpdatedQueryParamsMap = function () {
	var queryParamsmap = this.getQueryParamsMap();
	var map = {
		"filters" : ""
	};
	if (this.m_queryParamsMap != "") {
		var globalVarStr = queryParamsmap.filters;
		if (globalVarStr != undefined) {
			map.filters = this.getGlobalVariableValue(globalVarStr);
		}
	}
	return map;
};

DataURL.prototype.getGlobalVariableValue = function (globalVarStr) {
	try {
		/** Need to replace {} with [] . multiple occurrence working only with [] ; **/
		var key = globalVarStr.replace(new RegExp('{', 'g'), '[').replace(new RegExp('}', 'g'), ']');
		var str = key;{
			var re = /\[(.*?)\]/g;
			for (var m = re.exec(key); m; m = re.exec(key)) {
				var globalVariableObj = this.getDashboard().getGlobalVariable();
				if (globalVariableObj != "" && globalVariableObj != undefined) {
					var globalVarValue = globalVariableObj.getFieldValue(m[1]);
					str = str.replace(m[0], globalVarValue);
				}
			}
		}
	} catch (e) {
		return globalVarStr;
	}
	return str;
};

DataURL.prototype.notify = function () {
	this.getData();
};

DataURL.prototype.registerWebServiceWithDataProvider = function () {
	this.setWebService();
	this.getWebService().init(this);
};

DataURL.prototype.setWebService = function () {
	var serviceType = this.m_servicetype ? this.m_servicetype : this.m_type;
	switch (serviceType) {
		case "clarityWSDL":
			this.m_webservice = new ClarityWebService();
			break;
		case "bizvizPA":
			this.m_webservice = new PAWebService();
			break;
		case "bizvizDS":
			this.m_webservice = new DSWebService();
			break;
		case "bizvizWS":
			this.m_webservice = new WSWebService();
			break;
		case "bizvizdatasheet":
			this.m_webservice = new DatasheetService();
			break;
		default:
			this.m_webservice = new NQueryWebService();
	}
};
DataURL.prototype.getWebService = function () {
	return this.m_webservice;
};
DataURL.prototype.registerDataSetValuesWithDataprovider = function () {
	this.m_dataSetValues = new DataSetValues();
	this.m_dataSetValues.init(this);
};
DataURL.prototype.getDataSetValues = function () {
	return this.m_dataSetValues;
};

DataURL.prototype.registerLanguageMappingWithDataprovider = function () {
	var languageMapping = new LanguageMapping();
	this.m_languageMappingValues = languageMapping;
	languageMapping.init(this);
};

DataURL.prototype.updateDataSet = function (xmlData) {
	if (IsBoolean(this.m_islangwebservice)) {
		this.m_languageMappingValues.update(xmlData, this);
	}
	this.m_dataSetValues.update(xmlData, this);
	this.m_dataSetValues.updateVirtualDataSet();
};
DataURL.prototype.registerNotifyCallBack = function (callback) {
	this.m_notifierCallbacks.push(callback)
};
DataURL.prototype.setWholeData = function (data) {
	this.m_wholeData = data;
};
DataURL.prototype.callNotifierCallbacks = function (data) {
	for (var i = 0; i < this.m_notifierCallbacks.length; i++) {
		this.m_notifierCallbacks[i](this.m_id, data)
	}
};
DataURL.prototype.getFieldNames = function () {
	return this.m_fieldNamesArray;
};

DataURL.prototype.setFieldNames = function () {
	var fieldNameArr = [];
	for (var i = 0; i < this.getFieldSet().length; i++) {
		var fieldName = this.getFieldSet()[i].getName();
		fieldNameArr.push(fieldName);
	}
	Array.prototype.contains = function (v) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] === v)
				return true;
		}
		return false;
	};

	Array.prototype.unique = function () {
		var arr = [];
		for (var i = 0; i < this.length; i++) {
			if (!arr.contains(this[i])) {
				arr.push(this[i]);
			}
		}
		return arr;
	};

	fieldNameArr = fieldNameArr.unique();
	return fieldNameArr;
};

DataURL.prototype.getOffLineDataId = function () {
	return this.m_offlinedataid;
};

DataURL.prototype.getId = function () {
	return this.m_id;
};
DataURL.prototype.getuserId = function () {
	return this.m_userid;
};
DataURL.prototype.getPassword = function () {
	return this.m_password;
};
DataURL.prototype.getType = function () {
	return this.m_type;
};

DataURL.prototype.getFieldSet = function (fieldSetObj) {
	return this.m_fieldSet;
};

DataURL.prototype.setFieldSet = function (fieldSetObj) {
	this.m_fieldSet.push(fieldSetObj);
};

DataURL.prototype.getCon = function () {
	return this.m_con;
};
DataURL.prototype.setCon = function (nivCon) {
	this.m_con = nivCon;
};

DataURL.prototype.setClaritySort = function (ClaritySortObj) {
	this.m_claritysort = ClaritySortObj;
};
DataURL.prototype.getClaritySortField = function () {
	return (this.m_claritysort && this.m_claritysort !== "") ? this.m_claritysort.getSortField() : "";
};
DataURL.prototype.getClaritySortDirection = function () {
	return (this.m_claritysort && this.m_claritysort !== "") ? this.m_claritysort.getSortDirection() : "";
};

DataURL.prototype.setClaritySlice = function (ClaritySliceObj) {
	this.m_clarityslice = ClaritySliceObj;
};
DataURL.prototype.getClaritySliceIndex = function () {
	return (this.m_clarityslice && this.m_clarityslice !== "") ? this.m_clarityslice.getSliceIndex() : "";
};
DataURL.prototype.getClaritySliceCount = function () {
	return (this.m_clarityslice && this.m_clarityslice !== "") ? this.m_clarityslice.getSliceCount() : "";
};

DataURL.prototype.setUrl = function (m_url) {
	this.m_url = m_url;
};
DataURL.prototype.getUrl = function () {
	this.checkForPublishWSDLServer();
	return this.m_url;
};
DataURL.prototype.checkForPublishWSDLServer = function () {
	if (/n\w{4}hWSDL/.test(this.m_type) || this.m_type == "web") {
		var publishwsdlserver = this.getDashboard().getDashboardOptions().getPublishWSDLServer();
		if (publishwsdlserver != "" && publishwsdlserver != null && publishwsdlserver != "null") {
			var urlSections = (typeof this.m_url !== "object") ? this.m_url.split("/") : [];
			if (urlSections.length > 0 && this.m_url != ""){
				this.setUrl(publishwsdlserver + "/" + urlSections[urlSections.length - 1]);
			}
		}
	}
};

DataURL.prototype.setDataType = function (dataType) {
	this.m_datatype = (dataType ? dataType : "JSON");
};
DataURL.prototype.getDataType = function () {
	return this.m_datatype;
};

DataURL.prototype.setSOAPEndPoint = function (soapendpoint) {
	this.m_soapendpoint = soapendpoint;
};
DataURL.prototype.getSOAPEndPoint = function () {
	return this.m_soapendpoint;
};
DataURL.prototype.getPredictiveJsonDef = function () {
	return this.m_predictivejsondef;
};
DataURL.prototype.getSkipFilterValues = function () {
	return this.m_skipfiltervalues;
};

DataURL.prototype.setKeys = function () {
	var keys = [];
	if (this.getCon() !== "") {
		var ClauseMap = this.getCon().getClauseMap();
		for (var key in ClauseMap) {
			keys.push(key);
		}
	}
	this.m_keys = keys;
};
DataURL.prototype.getKeys = function () {
	return this.m_keys;
};

DataURL.prototype.getValues = function (dashboard) {
	var valArr = [];
	this.setDashboard(dashboard);
	var value = "";
	if (this.getCon() !== "") {
		var ClauseMap = this.getCon().getClauseMap();
		for (var key in ClauseMap) {
			if (ClauseMap[key].indexOf("@") == 0) {
				var paramObjArr = this.getDashboard().getFlashVars().getParam();
				for (var i = 0; i < paramObjArr.length; i++) {
					if (paramObjArr[i].getName() == ClauseMap[key].substring(1, ClauseMap[key].length)) {
						value = paramObjArr[i].getValue();
					}
				}
			} else {
				if (ClauseMap[key].indexOf("{") == 0) {
					var globalVarStr = ClauseMap[key].substring(1, ClauseMap[key].length - 1);

					var val = globalVarStr.split(".");
					val = [val.shift(), val.join(".")];
					if (this.getDashboard().getGlobalVariable() != undefined)
						if (this.getDashboard().getGlobalVariable().map[val[0]] != undefined){
							value = this.getDashboard().getGlobalVariable().map[val[0]].map[val[1]];
						}
				} else if (ClauseMap[key].indexOf("'") == 0) {
					value = ClauseMap[key].substring(1, ClauseMap[key].length - 1);
				} else {
					value = ClauseMap[key];
				}
			}
			/**DAS-884*/
			value = (value=="Value") ? "" : value;
			this.m_clausevalues[key] = value;
			valArr.push(value);
		}
	}
	return valArr;
};
DataURL.prototype.getGlobalKey = function () {
	return this.getId();
};
DataURL.prototype.setDashboard = function (dashboard) {
	this.m_dashboard = dashboard;
};
DataURL.prototype.getDashboard = function () {
	return this.m_dashboard;
};
DataURL.prototype.getClauseData = function () {
	return this.m_clausevalues;
};

/**************************** OFFLINE DATA SOURCE ******************************************/
/** @description Constructor OfflineDataProvider
 * */
function OfflineDataProvider() {
	this.base = DataURL;
	this.base();

	this.m_fieldName = [];
	this.m_allFieldName = [];
	this.m_completeParsedData = [];
	this.m_completeParsedDataLowerCase = [];
	this.m_excluderecordsforemptymatch = true;
};

OfflineDataProvider.prototype = new DataURL;

OfflineDataProvider.prototype.getDataFromConnection = function (dataSetValues, callBack) {
	var data = {
		"dataSetValues" : dataSetValues,
		"dataObject" : this.getOffLineData(),
		"status" : {
			"isDataReceived": true
		}
	};
	callBack(data);
};
OfflineDataProvider.prototype.getOffLineData = function () {
	var XMLData = this.getXmlData();
	//var Dtype = Object.prototype.toString.call( XMLData[0] ) === '[object Array]' ;  // Added Nikhil Verma Start
	if(this.m_datatype == "Array"){
		XMLData = this.getArrayData(XMLData);
	}	// Added Nikhil Verma End
	if (XMLData != undefined) {
		this.m_fieldName = this.getFieldNames();
		this.m_allFieldName = this.getAlFieldsFromJSONData(XMLData);
		this.m_completeParsedData = XMLData;
		this.m_completeParsedDataLowerCase = XMLData;

		this.m_con_clauseMap = this.getCon().getClauseMap();
		this.m_con_clauseMapLength = Object.keys(this.m_con_clauseMap).length;
		this.m_dataSetValues.setXmlData(XMLData);
		if (this.m_con_clauseMapLength > 0) {
			return this.getFilteredData();
		}
		return XMLData;
	} else {
		return new Object();
	}
};
OfflineDataProvider.prototype.getArrayData = function (data) {
	var jsonDataArray = [];
	var arrData = data;
	for (var i = 1; i < arrData.length; i++) { 
		var jsonData = {};
		for (var j = 0; j < arrData[i].length; j++) {
			jsonData[arrData[0][j]] = arrData[i][j];
		}
		jsonDataArray.push(jsonData);
	}
	data = [];
	data = jsonDataArray;
	return data;
};
OfflineDataProvider.prototype.getAlFieldsFromJSONData = function (jsonArray) {
	var fieldNameArr = new Object();
	if (jsonArray != undefined) {
		for (var i = 0; i < jsonArray.length; i++) {
			for (key in jsonArray[i]) {
				fieldNameArr[key] = "";
			}
		}
	}
	var allFieldNames = [];

	for (var key in fieldNameArr)
		allFieldNames.push(key);

	return allFieldNames;
};
OfflineDataProvider.prototype.notify = function () {
	var XMLData = this.getXmlData();
	this.m_fieldName = this.getFieldNames();
	this.m_allFieldName = this.getAlFieldsFromXMLData(XMLData);
	this.m_completeParsedData = this.parseXMLData(XMLData);
	this.m_completeParsedDataLowerCase = this.parseXMLDataWithAllField(XMLData);
	this.getData();
};

OfflineDataProvider.prototype.getXmlData = function () {
	return this.m_dashboard.getXMLData(this.getId());
};
OfflineDataProvider.prototype.getAlFieldsFromXMLData = function (XMLData) {
	var fieldNameArr = new Object();
	var recordsObj = $(XMLData).find("Records");
	$(recordsObj).find("Record").each(function () {
//		for( var i =0 ; i<  $(this).children().length ; i++){
//			var key = ($(this).children()[i].tagName).toLowerCase() ;
//			fieldNameArr[key] = "" ;
//		}
		var childs = $(this).find("*");
		for (var i = 0; i < childs.length; i++) {
			var key = (childs[i].tagName).toLowerCase();
			fieldNameArr[key] = "";
		}
	});
	var allFieldNames = [];

	for (var key in fieldNameArr)
		allFieldNames.push(key);

	return allFieldNames;
};
OfflineDataProvider.prototype.parseXMLData = function (XMLData) {
	var temp = this;
	var m_fieldNameValues = [];
	var recordsObj = $(XMLData).find("Records");
	this.m_numberOfRecords = 0;
	$(recordsObj).find("Record").each(function () {
		var hashmap = new Object();
		for (var i = 0; i < temp.m_fieldName.length; i++) {
			var tagName = temp.m_fieldName[i];
			var tagData = $(this).find(tagName).text();
			hashmap[tagName] = tagData;
		}
		m_fieldNameValues[temp.m_numberOfRecords] = hashmap;
		temp.m_numberOfRecords++;
	});
	return m_fieldNameValues;
};
OfflineDataProvider.prototype.parseXMLDataWithAllField = function (XMLData) {
	var temp = this;
	var m_fieldNameValues = [];
	var recordsObj = $(XMLData).find("Records");
	var m_numberOfRecords = 0;
	$(recordsObj).find("Record").each(function () {
		var hashmap = new Object();
		for (var i = 0; i < temp.m_allFieldName.length; i++) {
			var tagName = temp.m_allFieldName[i].toLowerCase();
			var tagData = $(this).find(tagName).text();
			hashmap[tagName] = tagData;
		}
		m_fieldNameValues[m_numberOfRecords] = hashmap;
		m_numberOfRecords++;
	});
	return m_fieldNameValues;
};
OfflineDataProvider.prototype.getData = function () {
	this.m_con_clauseMap = this.getCon().getClauseMap();
	this.m_con_clauseMapLength = Object.keys(this.m_con_clauseMap).length;
	/** if the length is greater then 0 , it means some condition is given **/
	// if(this.m_con_clauseMap != "")
	var XMLData = this.getXmlData();
	this.m_dataSetValues.setXmlData(XMLData);
	/** need to pass complete data to datasetvalues class for chevron chart **/
	if (this.m_con_clauseMapLength > 0) {
		var filteredData = this.getFilteredData();
		this.updateDataSet(filteredData);
		this.m_dataSetValues.updateVirtualDataSet();
	} else {
		this.updateDataSet(this.m_completeParsedData);
		this.m_dataSetValues.updateVirtualDataSet();
	}
};
OfflineDataProvider.prototype.updateDataSet = function (m_fieldNameValues) {
	this.m_dataSetValues.setDataInMap(m_fieldNameValues);
	this.m_dataSetValues.setNumberOfRecord(this.m_numberOfRecords);
	this.m_dataSetValues.notifyDataUpdate();
};
OfflineDataProvider.prototype.getFilteredData = function () {
	var m_fieldNameValues = [];
	this.setClauseData();
	for (var p = 0; p < this.m_completeParsedData.length; p++){
		var result = this.isFilterConditionSatisfied(p);
		/** if result is true it means this record fulfils all the conditions given in clause. **/
		if (IsBoolean(result)) {
			m_fieldNameValues.push(this.m_completeParsedData[p]);
		}
	}
	return m_fieldNameValues;
};
OfflineDataProvider.prototype.getLowerCaseClauseMap = function (clauseMap) {
	var map = {};
	for (var key in clauseMap) {
		map[key.toLowerCase()] = clauseMap[key];
	}
	return map;
};
OfflineDataProvider.prototype.isFilterConditionSatisfied = function (p) {
//	var counter = 0;
	var clauseMap = this.getLowerCaseClauseMap(this.m_con_clauseMap);
//	var m_con_clauseMapLength = Object.keys(clauseMap).length;

	for (var i = 0; i < this.m_allFieldName.length; i++) {
		var key = this.m_allFieldName[i];
		if (clauseMap[key.toLowerCase()] !== undefined) {
			/** trim is required to remove leading and trailing space... won't compare "david miller" and "david miller  " **/
			var tagData = this.m_completeParsedDataLowerCase[p][key];
			if (tagData == undefined){
				console.log("data for column: " + key + " not present");
			}else{
				tagData = (tagData + "").trim();
			}
			var value = this.m_clausevalues[key.toLowerCase()];
			value = (value == "Value")? "": value;
			if (value == undefined){
				console.log("error in getting value from global variable");
			}else{
				/** trim string single values (filter single selection. Ex. "New delhi ")**/
				value = value.trim();
			}
			var value1 = [];
			/** Here splitting multiple comma separated string values(Ex. "john, david, ram, shayam")**/
			value1 = ("" + value).split(",");
			var matchFlag = false;
			if (value1.length > 1) {
				for (var j = 0; j < value1.length; j++) {
					//console.log(tagData +"==="+ value1[j] +"===="+p)
					/** Here trim array element string (Ex. value1[j] = "New delhi ".trim())**/
					value1[j] = value1[j].trim();
					if (tagData == value1[j]) {
						matchFlag = true;
					} else if (value1[j] == "null") {
						matchFlag = true;
					} else if (tagData == value) {
						matchFlag = true;
					} else {
						// Do nothing
					}
				}
				if (matchFlag == false) {
					return false;
				}
			} else {
				if (value == "null" || value == "") {
					//return this.excludeRecordsForEmptyMatch();
				}else if (tagData != value) {
					return false;
				}
			}
			//counter ++ ;
		}
	}
	//if (counter == this.m_con_clauseMapLength){
		return true;
	//}
};
/*OfflineDataProvider.prototype.excludeRecordsForEmptyMatch = function () {
	if(IsBoolean(this.m_excluderecordsforemptymatch)){	// Added Nikhil Verma
  		return false; 
      	// include all the records when condition has empty checks like "year==''"
	}else{
      // include nothing in data resultSet when condition has empty checks like "year==''"
    }
};*/
OfflineDataProvider.prototype.getValueOfClause = function (cluseValue) {
	var value = cluseValue;
	if (cluseValue.indexOf("{") == 0) {
		var globalVarStr = cluseValue.substring(1, cluseValue.length - 1);
		var val = globalVarStr.split(".");
		/** joining back the remaining column name if somebody used "dot" in query column name **/
		val = [val.shift(), val.join(".")];
		if (this.m_dashboard.getGlobalVariable() != undefined) {
			if (this.m_dashboard.getGlobalVariable().map[val[0]] != undefined) {
				value = this.m_dashboard.getGlobalVariable().map[val[0]].map[val[1]];
			}
		}
	} else if (cluseValue.indexOf("'") == 0) {
		value = cluseValue.substring(1, cluseValue.length - 1);
	} else {
		// Do nothing
	}
	return value;
};
OfflineDataProvider.prototype.setClauseData = function () {
	var clauseMap = this.getLowerCaseClauseMap(this.m_con_clauseMap);
	for (var key in clauseMap) {
		this.m_clausevalues[key] = this.getValueOfClause(clauseMap[key.toLowerCase()]) + "";
	}
};

/**************************** ONLINE DATA SOURCE ******************************************/
/** @description Constructor OnlineDataProvider
 * */
function OnlineDataProvider() {
	this.base = DataURL;
	this.base();
};
OnlineDataProvider.prototype = new DataURL;
OnlineDataProvider.prototype.getDataFromConnection = function (dataSetValues, callBack) {
	var valArr = this.getValues(this.m_dashboard);
	this.getWebService().setDataType(this.getDataType());
	this.getWebService().callWebservice(valArr, dataSetValues, callBack);
};
OnlineDataProvider.prototype.getData = function () {
	var valArr = this.getValues(this.m_dashboard);
	this.getWebService().setDataType(this.getDataType());
	this.getWebService().callWebservice(valArr, this.updateDataSet);
};

/**************************** DERIVED DATA SOURCE ******************************************/
/** @description Constructor DerivedDataProvider
 * */
function DerivedDataProvider() {
	this.base = DataURL;
	this.base();

	this.m_fieldName = [];
	this.m_allFieldName = [];
	this.m_completeParsedData = [];
	this.m_completeParsedDataLowerCase = [];

	this.m_parentDataReady = false;
	this.m_childDataReady = false;
	this.m_parentData = [];
	this.m_childData = [];
	this.m_dataDirty = true;
	this.mergedData = [];
	this.m_registeredCallBack;
	this.m_registeredCallBackData;
};

DerivedDataProvider.prototype = new DataURL;

/** @description initialization of the derived data connector
 * */
DerivedDataProvider.prototype.init = function () {
	DataURL.prototype.init.call(this);
	this.registerCallBacksInSuperConnections();
};
/** @description Getter method of mergedData object
 * @param {Object} dataSetValues: object which holds the data consuming component from this connection 
 * @param {function} callBack: calBack method 
 * */
DerivedDataProvider.prototype.getDataFromConnection = function (dataSetValues, callBack) {
	var data = {
		"dataSetValues" : dataSetValues,
		"dataObject" : this.getMergedData(),
		"status" : {
			"isDataReceived": true
		}
	};
	if (!this.m_dataDirty) {
		callBack(data);
	} else {
		this.m_registeredCallBack = callBack;
		this.m_registeredCallBackData = data;
	}
};
/** @description getter method
 * */
DerivedDataProvider.prototype.getData = function (dataSetValues, callBack) {
};
/** @description Registers the parent connection callback
 * */
DerivedDataProvider.prototype.registerCallBacksInSuperConnections = function () {
	if (this.m_parentsource && this.m_childsource) {
		for (var i = 0; i < this.m_dashboard.m_DataProviders.m_dataurl.length; i++) {
			var url = this.m_dashboard.m_DataProviders.m_dataurl[i];
			if (url.m_id == this.m_parentsource || url.m_id == this.m_childsource) {
				url.registerNotifyCallBack(this.dataRecieve.bind(this));
			}
		}
	}
};
/** @description Check for parent connection data and child connection data, when both are available
 * call derivedata calculation and returns the resultant data.
 * @param {String} id: connection ID
 * @param {Object} data: data object
 * @return {String} parentCon: id of parent connection
 * */
DerivedDataProvider.prototype.dataRecieve = function (id, data) {
	this.m_dataDirty = true;
	if (id == this.m_parentsource) {
		this.m_parentData = data;
		this.m_parentDataReady = true;
	} else if (id == this.m_childsource) {
		this.m_childData = data;
		this.m_childDataReady = true;
	} else {
		// Do nothing
	}
	return (this.m_parentDataReady && this.m_childDataReady) ? this.deriveData() : undefined;
};

/** @description This method is creating the data for derived connection, depends upon the criteria given. **/
DerivedDataProvider.prototype.deriveData = function () {
	var p_data = this.m_parentData;
	var c_data = this.m_childData;
	/*
	 *if C_1.field1 == C_2.field1 -> LeftJoin
	 *if C_2.field1 == C_1.field1 -> RightJoin
	 *if C_1.field1 != C_2.field1 -> CrossJoin
	 *Inner join can be achieved on datasets by applying dataset filter condition as sdk.applyDatasetFilter('datagrid7',["Proj2!='null'"])
	 *This will filter out only matching records from the merged dataset 
	 */
	var leftJoinResult = [];
	if (this["m_deriveconditions"] !== undefined  && this["m_deriveconditions"]["criteria"][0] !== undefined) { // check for no criteria
	    if (p_data && c_data) {
	        try {
	            var allConditions = this["m_deriveconditions"]["criteria"][0].split("&&");
	            this.m_deriveconditionsarray = [];
	            for (var i = 0; i < allConditions.length; i++) {
	                this.m_deriveconditionsarray[i] = {};
	                var splitter = allConditions[i].indexOf("==") > 0 ? "==" : "!=";
	                var conditionFields = allConditions[i].split(splitter);
	                this.m_deriveconditionsarray[i].leftid = conditionFields[0].split(".")[1].trim();
	                this.m_deriveconditionsarray[i].rightid = conditionFields[1].split(".")[1].trim();
	                this.m_deriveconditionsarray[i].operator = splitter;
	            }
	            leftJoinResult = this.leftJoin(p_data, c_data, this);
	        } catch (error) {
	            console.log("Derived data creation error:" + error.message);
	        }
	    }
	} else {        
		 console.log("No Criteria is Specified");
	}
	this.mergedData = leftJoinResult;
	this.m_dataDirty = false;
	this.notifyCallBack();
};
/****************************** Performs left join operation according to parent & child data using column conditions **************/
DerivedDataProvider.prototype.leftJoin = function(left, right, temp) {
    var resultOfLeftJoin = [];
    var i = 0;
    _.each(left, function(litem) {
    	/*  each method loops through the left array */
        var f = _.filter(right, function(ritem) {
        	/* filter method checks if any right object matches with left object and retruns the array */
            return temp.evaluteCriteria(litem, ritem, temp.m_deriveconditionsarray);
        });
        if (f.length == 0) {
        	/* if matching items are zero,making  right side object as null for left join */  
            var nullObj = {};
            _.each(right[i], function(v, k) {
                v = null;
                nullObj[k] = v;
            });
            f = [{}];
        }
        _.each(f, function(i) {
        	/* this method loops through the left object gives the resultant new object */
            var newObj = {};
            _.each(litem, function(v, k) {
                newObj[k] = v;
            });
            if (_.isEmpty(i)) {
                i = nullObj;
            }
            _.each(i, function(v, k) {
            	/* for resultant object left side records are appended in this each loop */
            	if(k in newObj){
                	newObj[k + "_R"] = v;
            	}
            	else{
            		newObj[k] = v;
            	}
            });
            resultOfLeftJoin.push(newObj);
        });
    });
    return resultOfLeftJoin;
};
/** @description will evaluate the condition according to left and right item
 * @param {Object} litem: parent criteria
 * @param {Object} ritem: child criteria
 * @return {Boolean} returns if criteria matched or not
 **/
DerivedDataProvider.prototype.evaluteCriteria = function (litem, ritem, arr) {
	var result = true;
	for(var i = 0 ; i < arr.length; i++){
		if(arr[i].operator == "==") {
			result = litem[arr[i].leftid] == ritem[arr[i].rightid];
		} else {
			result = litem[arr[i].leftid] != ritem[arr[i].rightid];
		}
		if(result == false) break;
	}
	return result;
};
/** @description Registering callback for the connection
 * */
DerivedDataProvider.prototype.notifyCallBack = function () {
	if (this.m_registeredCallBack) {
		this.m_registeredCallBackData["dataObject"] = this.mergedData;
		this.m_registeredCallBack(this.m_registeredCallBackData);
	}
};
/** @description Evalutes the given criteria
 * @param {Object} d1: parent criteria
 * @param {Object} d2: child criteria
 * @return {Boolean} returns if criteria mathced or not 
 * */
DerivedDataProvider.prototype.evalCriteria = function (d1, d2) {
	var scr = "var " + this.m_parentsource + "=" + JSON.stringify(d1) + ";var " + this.m_childsource + "=" + JSON.stringify(d2);
	scr += ";" + this["m_deriveconditions"]["criteria"][0];
	return eval(scr);
};
/** @description Getter method of mergedData object
 * @param {Object} item: data object
 * @param {String} parentCon: id of parent connection
 * @param {Object} resObj: resultant data object
 * @param {Boolean} status: to add record in resultant object or not 
 * @return {Object} Data Object
 * */
DerivedDataProvider.prototype.createData = function (item, parentCon, resObj, status) {
	resObj = resObj || {};
	for (var i = 0; i < this.m_fieldSet.length; i++) {
		if (this.m_fieldSet[i]["m_parentconnection"] == parentCon) {
			resObj[this.m_fieldSet[i]["m_name"]] = item[this.m_fieldSet[i]["m_parentfield"]] || undefined;
		} else if (status) {
			resObj[this.m_fieldSet[i]["m_name"]] = item[this.m_fieldSet[i]["m_parentfield"]] || "null";
		} else {
			// Do nothing
		}
	}
	return resObj;
};
/** @description Getter method of mergedData object 
 * @return {Object} merged Data Object
 * */
DerivedDataProvider.prototype.getMergedData = function () {
	return this.mergedData;
};

/**********************************************************************************/
function ClaritySlice() {
	this.m_sliceindex = "";
	this.m_slicecount = "";
};
ClaritySlice.prototype.getSliceIndex = function () {
	return this.m_sliceindex;
};
ClaritySlice.prototype.getSliceCount = function () {
	return this.m_slicecount;
};

function ClaritySort() {
	this.m_columns = [];
	this.m_sortfield = [];
	this.m_sortdirection = [];
};
ClaritySort.prototype.getColumns = function () {
	return this.m_columns;
};
ClaritySort.prototype.getSortField = function () {
	this.m_sortfield = [];
	for(var i=0; i<this.m_columns.length; i++){
		this.m_sortfield.push( this.m_columns[i].sortField );
	}
	return this.m_sortfield;
};
ClaritySort.prototype.getSortDirection = function () {
	this.m_sortdirection = [];
	for(var i=0; i<this.m_columns.length; i++){
		this.m_sortdirection.push( this.m_columns[i].sortDirection );
	}
	return this.m_sortdirection;
};
/**********************************************************************************/
function FieldSet() {
	this.m_type;
	this.m_name;
	this.m_displayname;
};
FieldSet.prototype.getName = function () {
	return this.m_name;
};
FieldSet.prototype.getType = function () {
	return this.m_type;
};
FieldSet.prototype.getDisplayName = function () {
	return this.m_displayname;
};

function LanguageMapping() {
	this.base = DataURL;
	this.base();
	this.m_source = "";
	this.m_dataUrl = "";
	this.m_connectionId = "";
	this.m_fieldName = [];
	this.m_fieldNameValues = [];
	this.m_registerdWidgets = [];
	
	this.m_enable = false;
	this.m_mappingname = "";
	this.m_mappingid = "";
	this.m_language = "";
	this.m_hidebrackets = false;
};

LanguageMapping.prototype = new DataURL();

LanguageMapping.prototype.init = function (dataURLObj) {
	this.m_dataUrl = dataURLObj;
	this.m_connectionId = this.m_dataUrl.getId();
	this.m_fieldName = this.m_dataUrl.m_fieldNamesArray;
};
LanguageMapping.prototype.getSource = function () {
	return this.m_source;
};

LanguageMapping.prototype.update = function (XmlData, dataURL) {
	this.m_XMLData = XmlData;
	var m_fieldNameValues = this.parseDataInDataSetValues(XmlData);
	this.setDataInMap(m_fieldNameValues);
	for (var i = 0; i < this.m_registerdWidgets.length; i++) {
		this.m_registerdWidgets[i].notifyLanuageMapping(this);
	}
};
LanguageMapping.prototype.parseDataInDataSetValues = function (XMLData) {
	var temp = this;
	var m_fieldNameValues = [];
	var m_records = "";
	var m_record = "";
	if (/n\w{4}hWSDL/.test(this.m_dataUrl.m_type) || this.m_dataUrl.m_type == "web") {
		m_records = "records";
		m_record = "record";
	} else if (this.m_dataUrl.m_type == "clarityWSDL") {
		m_records = "Records";
		m_record = "Record";
	}else{
		// Do nothing
	}

	var recordsObj = $(XMLData).find(m_records);
	this.m_numberOfRecords = 0;
	$(recordsObj).find(m_record).each(function () {
		var hashmap = new Object();
		for (var i = 0; i < temp.m_fieldName.length; i++) {
			var tagName = temp.m_fieldName[i];
			var tagData = $(this).find(tagName).text();
			hashmap[tagName] = tagData;
			/** set data into map[fieldName] = datavalue **/
		}
		m_fieldNameValues[temp.m_numberOfRecords] = hashmap;
		temp.m_numberOfRecords++;
	});

	return m_fieldNameValues;
};
LanguageMapping.prototype.setDataInMap = function (m_fieldNameValues) {
	this.m_fieldNameValues = m_fieldNameValues;
};

function Con() {
	this.m_orderby = "";
	this.m_clause = "";
	this.m_defaultclause = "";
	this.m_groupby = "";
	this.clauseMap = new Object();
	this.defaultclauseMap = new Object();
	this.keyArr = [];
	this.m_clausemap = "";
};
Con.prototype.setdefaultclauseMap = function (key, val) {
	this.defaultclauseMap[key] = val;
};
Con.prototype.getdefaultMapfromCon = function () {
	return this.defaultclauseMap;
};
Con.prototype.getdefaultclauseMap = function () {
	var str = this.m_defaultclause;
	var keyValuePairArr = [];
	var commaSplitArray = str.split(",");
	for (var i = 0; i < commaSplitArray.length; i++) {
		keyValuePairArr[i] = commaSplitArray[i].split("=");
		this.defaultclauseMap[keyValuePairArr[i][0]] = keyValuePairArr[i][1].substring(1, keyValuePairArr[i][1].length - 1);
		this.keyArr[i] = keyValuePairArr[i][0];
	}
	return this.defaultclauseMap;
};
Con.prototype.getDefaultclause = function () {
	return this.m_defaultclause;
};
Con.prototype.getClause = function () {
	return this.m_clause;
};
Con.prototype.getClauseMap = function () {
	if (this.m_clausemap != undefined && this.m_clausemap != "") {
		/** in case of designer dashboard **/
		this.clauseMap = this.m_clausemap;
		return this.m_clausemap;
	} else {
		/** in case of NIV,BVZ dashboard **/
		var str = this.m_clause;
		if (str.length > 0) {
//			var str = "yr='a,a',sal=343,pro='cc',exp='d,e,f',g='gg',h=699,i='ggh',j='a,a,b'";
			try {
				var arr = str.match(/'[^']*'/g);
				arr = arr || [];
				for (var i = 0; i < arr.length; i++) {
					var stt = arr[i].replace(/,/g, "~~");
					str = str.replace(arr[i], stt);
				}
				var strArr = str.split(",");
				var keyValuePairArr = [];
				for (var i1 = 0; i1 < strArr.length; i1++) {
					var rr = strArr[i1].replace(/~~/g, ",");
					keyValuePairArr[i1] = rr.split("=");
					this.clauseMap[keyValuePairArr[i1][0]] = keyValuePairArr[i1][1];
				}
			} catch (e) {
				console.log(e);
			}
		}
		return this.clauseMap;
	}
};

function DefaultValues() {
	this.m_name = "";
	this.m_text = "";
	this.m_defaultValuesNameValueMap = new Object();
};

DefaultValues.prototype.setDefaultValuesNameValueMap = function (key, val) {
	this.m_defaultValuesNameValueMap[key] = val;
};
DefaultValues.prototype.getDefaultValuesNameValueMap = function () {
	return this.m_defaultValuesNameValueMap;
};

function DataProvider() {
	this.m_id = "";
};
DataProvider.prototype.getId = function () {
	return this.m_id;
};

/** Methods for DataSetExpressions which is used in Calculated field**/
function DataSetExpressions() {
	this.m_dataSetExpression = [];
	this.m_dataSetExpressionMap = new Object();
	this.m_dataSetCount = 0;
};
DataSetExpressions.prototype.setDataSetExpression = function (DataSetExpressionObj) {
	this.m_dataSetExpression.push(DataSetExpressionObj);
	this.setDataSetExpressionMap(DataSetExpressionObj);
	this.m_dataSetCount++;
	DataSetExpressionObj.m_count = this.m_dataSetCount;
};
DataSetExpressions.prototype.getDataSetExpression = function () {
	return this.m_dataSetExpression;
};
DataSetExpressions.prototype.setDataSetExpressionMap = function (DataSetExpressionObj) {
	this.m_dataSetExpressionMap[DataSetExpressionObj.m_datasource +""+DataSetExpressionObj.m_id] = DataSetExpressionObj;
};
DataSetExpressions.prototype.getDataSetExpressionbyID = function (id) {
	return this.m_dataSetExpressionMap[id];
};

function DataSetExpression() {
	this.m_id = "";
	this.m_expressionScript = "";
	this.m_Variable = [];
	this.m_count = 0;
}
DataSetExpression.prototype.getId = function () {
	return this.m_id;
};
DataSetExpression.prototype.setId = function (id) {
	this.m_id = id;
};
DataSetExpression.prototype.getExpressionScript = function () {
	return this.m_expressionScript;
};
DataSetExpression.prototype.setExpressionScript = function (script) {
	this.m_expressionScript = script;
};
DataSetExpression.prototype.getVariables = function () {
	return this.m_Variable;
};
DataSetExpression.prototype.setVariables = function (variableObj) {
	this.m_Variable.push(variableObj);
};

function DataSetExpressionVariable() {
	this.m_name = "";
	this.m_value = "";
};
DataSetExpressionVariable.prototype.getName = function () {
	return this.m_name;
};
DataSetExpressionVariable.prototype.setName = function (name) {
	this.m_name = name;
};
DataSetExpressionVariable.prototype.getValue = function () {
	return this.m_value;
};
DataSetExpressionVariable.prototype.setValue = function (value) {
	this.m_value = value;
};

function DataSetExpressionscript() {
	this.m_expressionScript = "";
}
DataSetExpressionscript.prototype.getExpressionScript = function () {
	return this.m_expressionScript;
};
DataSetExpressionscript.prototype.setExpressionScript = function (expressionScript) {
	this.m_expressionScript = expressionScript;
};

//# sourceURL=FrameworkComponents.js