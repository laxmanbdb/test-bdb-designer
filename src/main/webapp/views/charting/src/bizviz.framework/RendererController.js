/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: RendererController.js
 * @description Responsible for rendering the dashboard components 
 * */

/**
 * @description Constructor RendererController
 * **/
function RendererController() {
	this.dashboard = "";
};
/** @description Setter method for dashboard object
 * @param {Object} Dashboard Object
 * **/
RendererController.prototype.setDashboard = function (dashboard) {
	this.dashboard = dashboard;
};
/** @description Getter method for dashboard object
 * @return {Object} Dashboard Object
 * **/
RendererController.prototype.getDashboard = function () {
	return this.dashboard;
};
/** @description init dashboard rendering
 * @param {Object} Dashboard Object
 * **/
RendererController.prototype.initiateComponents = function (dashboard) {
	this.dashboard = dashboard;
	this.initializeScaling();
	this.initializeGlobalFont();
	this.initializeAbsoluteLayout();
	this.initializeBootstraping();
	this.initializeDraggableDivAndCanvas();
	this.dashboard.dashboardclick(this.dashboard.m_id);
};
/** @description init the scaling of dashboard if set true **/
RendererController.prototype.initializeScaling = function () {
	isTouchEnabled = this.getDashboard().isTouchEnabledDevice();
	isScaling = (this.getDashboard().isBootstrap()) ? false : this.getDashboard().isScalingEnabled();
	/** If last previewed dashboard has scaling enabled - these ratio was updated according 
	 * Reset the ratio to 1 when new dashboard previewed **/
	 widthRatio = 1;
	 heightRatio = 1;
	var absLayout = this.getDashboard().getAbsoluteLayout();
	if (isScaling) {
		absLayout.initializeScaling();
		for (var i = 0, len = this.getDashboard().m_widgetsArray.length; i < len; i++) {
			this.getDashboard().m_widgetsArray[i].initializeScaling();
		}
	}else{
		absLayout.m_ALWidth = absLayout.m_width;
		absLayout.m_ALHeight = absLayout.m_height;
	}
};
/** @description initialize the global font - if given **/
RendererController.prototype.initializeGlobalFont = function () {
	var gf = {
		"useGlobal" : IsBoolean(this.getDashboard().getAbsoluteLayout().m_useglobalfont),
		"fontFamily" : this.getDashboard().getAbsoluteLayout().m_fontfamily,
		"useFontFromUrl" : this.getDashboard().getAbsoluteLayout().m_usefontfromurl,
		"fontUrl" : this.getDashboard().getAbsoluteLayout().m_fonturl
	}
	setGlobalFont(gf);
};
/** @description initialize the bootstrapping of dashboard if it is responsive  **/
RendererController.prototype.initializeBootstraping = function () {
	var dashboardId = this.getDashboard().getId(); ;
	var c = this.getDashboard().getContainers();
	if (c){
		c.create("draggablesParentDiv" + dashboardId);
	}
};
/** @description initialize the container for dashboard comonents **/
RendererController.prototype.initializeAbsoluteLayout = function () {
	var dashboardId = this.getDashboard().getId();
	var bs = this.getDashboard().isBootstrap();
	this.getDashboard().getAbsoluteLayout().init(dashboardId, bs);
	this.getDashboard().getAbsoluteLayout().drawAbsoluteCanvas();
	this.getDashboard().getAbsoluteLayout().drawMaximizeOverlayDiv();
	/** if responsive dashboard- set the margin as 0 **/
	if (bs) {
		$("#WatermarkDiv").css("margin", "0px")
	}
};
/** @description init method for each component is called - which will initialize the div and canvas for components  **/
RendererController.prototype.initializeDraggableDivAndCanvas = function () {
	var dashboardId = this.getDashboard().getId(); ;
	for (var i = 0, len = this.getDashboard().m_widgetsArray.length; i < len; i++) {
		/** check if component has to rendered in responsive container or dashboard container **/
		if (this.getDashboard().m_widgetsArray[i].m_parent && this.getDashboard().m_widgetsArray[i].m_parent != "") {
			this.getDashboard().m_widgetsArray[i].m_bootstrap = true;
			this.getDashboard().m_widgetsArray[i].m_chartContainer = $("#" + this.getDashboard().m_widgetsArray[i].m_parent);
		} else {
			this.getDashboard().m_widgetsArray[i].m_chartContainer = $("#draggablesParentDiv" + dashboardId);
		}
		this.getDashboard().m_widgetsArray[i].m_zIndex = i;
		try{
			this.getDashboard().m_widgetsArray[i].initializeDraggableDivAndCanvas(i);
		}catch(e){
			console.log(e);
		}
	}
};
/** @description draw static component which doesn't need data **/
RendererController.prototype.drawStaticComponents = function () {
	for (var i = 0, len = this.getDashboard().m_widgetsArray.length; i < len; i++) {
		var component = this.getDashboard().m_widgetsArray[i];
//		if(this.getDashboard().m_widgetsArray[i].getDataSourceId() == "" && this.getDashboard().m_widgetsArray[i].getDataSetId() == "" )
		if (!IsBoolean(this.getDashboard().m_widgetsArray[i].m_isDataSetavailable)){
			try {
				component.drawObject();
			} catch (e) {
				this.throwExceptionMessage(component, e);
			}
			try {
				this.componentIniitialVisibility(component);
			} catch (e) {
				this.throwExceptionMessage(component, e);
			}
			
		} else {
			try {
				this.componentIniitialVisibility(component);
			} catch (e) {
				console.log(e);
			}
		}
	}
};
/** @description dashboard components start drawing **/
RendererController.prototype.drawComponent = function (chartDataObject) {
	try {
		var component = chartDataObject.Chart;
		if (component != "") {
			component.setDataProvider(chartDataObject.Data);
			component.setFields(chartDataObject.Fields);
			/** Setting timeout of 10ms to reflect the drawing changes on UI **/
			setTimeout(function () {
				component.draw()
			}, 1);
			/** Once component draws, check its initial visibility- if set as false, hide it **/
			this.componentIniitialVisibility(component);
		}
	} catch (e) {
		this.throwExceptionMessage(component, e);
		/** if error occures in drawing of a component, check its initial visibility **/
		this.componentIniitialVisibility(component);
	}
};
/** @description draws single value components like label/textbox etc  **/
RendererController.prototype.drawSingleValueComponent = function (virtualDataSetChartObject) {
	for (var i = 0; i < virtualDataSetChartObject.Chart.length; i++) {
		var component = virtualDataSetChartObject.Chart[i];
		try {
			if (component != "") {
				component.setDataProvider(virtualDataSetChartObject.Data[i]);
				component.setDataPointToUpdate(virtualDataSetChartObject.DataPointToUpdate[i]);
				component.draw();
				this.componentIniitialVisibility(component);
			}
		} catch (e) {
			this.throwExceptionMessage(component, e);
			this.componentIniitialVisibility(component);
		}
	}
};
/** @description prints exception message when error in drawing of component **/
RendererController.prototype.throwExceptionMessage = function (component, e) {
	console.log(component.m_objecttype + " : " + component.m_objectname + " is having some issue in drawing");
	console.log(e);
};
/** @description check for initial visibility of component - if true hides the component **/
RendererController.prototype.componentIniitialVisibility = function (component) {
	if (!IsBoolean(component.m_initialvisibility)) {
		component.hideWidget();
		/** initial visibility is checked only once when component renders first time, then set the variable to true **/
		component.m_initialvisibility = true;
	}
};
/** @description check for initial visibility of component - if true hides the component **/
RendererController.prototype.drawDashboard = function (dashboard) {
	this.setDashboard(dashboard);
};
//# sourceURL=RendererController.js