/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: Widget.js
 * @description Parent class of all charting components 
 **/
/**
 * Add new Global Variables here or in FrameworkUtil and initialize them.
 * These variables has to be updated from different plug-in teams( Survey, Predictive, SMB, Story, OTMS, Eduviz ) according to there need.
 **/
var dashboardChartComponent = {};
var NS = "http://www.w3.org/2000/svg";
var isScaling = false;
var isTouchEnabled = false;
var singleClickTimer = null;
var widthRatio = 1;
var heightRatio = 1;
var mouseX = 0;
var mouseY = 0;
/** Object for document level variables **/
var dGlobals = window.dGlobals || {};
/** To use global font family in dashboard  **/
var globalFont = undefined;

function Widget() {
	this.m_x = "";
	this.m_y = "";
	this.m_left = "";
	this.m_top = "";
	this.m_width = "";
	this.m_height = "";
	this.m_objecttype = "";
	this.m_objectname = "";
	this.m_objectid = "";
	this.m_objectclass = "draggableWidgetDiv";

	this.ctx;
	this.m_componentid = "";
	this.m_datasetid = "";
	this.m_datasource = "";
	this.m_dataProvider = [];
	this.m_fieldsJson = "";
	
	this.m_initialvisibility = true;
	this.visibilityStatus = true;
	this.m_isActive = true;
	this.m_chartstate = "";
	
	this.m_dashboard = "";
	this.m_dashboardname = "";
	this.m_isDataSetavailable = false;
	this.m_isLanguageMapping = false;
	this.m_isChartVisible = true;
	this.m_showObject = true;
	this.isGrid = false;
	this.m_isVirtualDataSetavailable = false;
	this.m_isVisibiltyConstraintFlag = false;
	this.m_languageMappingOBJ = "";
	this.m_fieldSetValue = "";
	
	this.isMaximized = false;
	this.isMenuSelected = false;

	this.imageHeight = 22;
	this.imageWidth = 25;

	this.componentElement = "";

	this.contextMenu;
	/** Set for datagrids to prevent rendering in designer for performance imporvement **/
	this.m_isResizedInDesigner = false;
	this.m_designMode = false;
	this.chartJson = "";
	this.m_seriesDataForDataLabel = [];
	
	this.m_showexceldownload = false;
	this.m_showcontextmenu = true;
	this.m_exporttoexcel = true;
	this.m_exporttocsv = true;
	this.m_exporttoppt = true;
	this.m_exporttopdf = true;
	this.m_exporttopng = true;
	this.m_exporttojpeg = true;
	this.m_exporttoprint = true;
	this.m_exporttogrid = true;
	this.m_showdatagridminwidth = 250;
	this.m_showdatagridminheight = 250;
	this.m_scrnshotsheetname = "";
	/** If filters-passed-in-the-connection need to be exported in excel **/
	this.m_filterdetails = "false";
	this.m_excelexportext = "csv";
	
	this.m_clickcallback = "";
	this.m_hovercallback = "";
	this.m_onafterrendercallback = "";
	
	/** to plot large data in chunks in area and wordcloud chart **/
	this.m_chunkdatalimit = 500;
	this.m_chunkdatatimeout = 100;

	this.m_roundedframe = "";
	this.m_bordercolor = "#BDC3C7";
	this.m_borderradius = "1";
	this.m_borderthickness = "1";

	this.drillColor = "#000000";
	this.m_showloaderbutton = false;
	this.m_cursortype = "default";
	
	this.m_bootstrap = false;
	this.m_adjustpixel = 1;

	this.m_showshadow = false;
	this.m_shadowcolor = "#000000";
	this.m_shadowopacity = "0.1";
	this.scrollPositions = {};

	this.m_showmaximizebutton = true;
	this.m_maximizeicontitle = "Maximise";
	this.m_minimizeicontitle = "Minimise";
	/** Added for changing the icons of min and max icons*/
	//this.m_maxminicons = {"maxiconshape": "bd-expand","miniconshape": "bd-minimize"};
	this.m_maxminiconscolor = {
		"maxiconcolor": "#282830",
		"miniconcolor": "#282830"
	};
	this.m_maxminicons = {
			"maxiconshape": '<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Icon/Maximise-" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Maximize" transform="translate(2.000000, 2.000000)" fill="'+this.m_maxminiconscolor.maxiconcolor+'"><path d="M13,2 C12.4477,2 12,1.55228 12,1 C12,0.447715 12.4477,0 13,0 L19,0 C19.5523,0 20,0.447715 20,1 L20,7 C20,7.55228 19.5523,8 19,8 C18.4477,8 18,7.55228 18,7 L18,3.41421 L12.7071,8.70711 C12.3166,9.09763 11.6834,9.09763 11.2929,8.70711 C10.9024,8.31658 10.9024,7.68342 11.2929,7.29289 L16.5858,2 L13,2 Z M7.29289,11.2929 C7.68342,10.9024 8.31658,10.9024 8.70711,11.2929 C9.09763,11.6834 9.09763,12.3166 8.70711,12.7071 L3.41421,18 L7,18 C7.55228,18 8,18.4477 8,19 C8,19.5523 7.55228,20 7,20 L1,20 C0.447715,20 0,19.5523 0,19 L0,13 C0,12.4477 0.447715,12 1,12 C1.55228,12 2,12.4477 2,13 L2,16.5858 L7.29289,11.2929 Z" id="Shape"></path></g></g></svg>',
			"miniconshape": '<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Icon/Minimise" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Minimize" transform="translate(2.000000, 2.000000)" fill="'+this.m_maxminiconscolor.miniconcolor+'"><path d="M18.2929,0.292893 C18.6834,-0.0976311 19.3166,-0.0976311 19.7071,0.292893 C20.0976,0.683417 20.0976,1.31658 19.7071,1.70711 L14.4142,6.99999992 L18,6.99999992 C18.5523,6.99999992 19,7.44772 19,7.99999992 C19,8.55228 18.5523,8.99999992 18,8.99999992 L12,8.99999992 C11.4477,8.99999992 11,8.55228 11,7.99999992 L11,1.99999992 C11,1.44772 11.4477,0.999999925 12,0.999999925 C12.5523,0.999999925 13,1.44772 13,1.99999992 L13,5.58579 L18.2929,0.292893 Z M0.999999925,12 C0.999999925,11.4477 1.44772,11 1.99999992,11 L7.99999992,11 C8.55228,11 8.99999992,11.4477 8.99999992,12 L8.99999992,18 C8.99999992,18.5523 8.55228,19 7.99999992,19 C7.44772,19 6.99999992,18.5523 6.99999992,18 L6.99999992,14.4142 L1.70711,19.7071 C1.31658,20.0976 0.683417,20.0976 0.292893,19.7071 C-0.0976311,19.3166 -0.0976311,18.6834 0.292893,18.2929 L5.58579,13 L1.99999992,13 C1.44772,13 0.999999925,12.5523 0.999999925,12 Z" id="Shape"></path></g></g></svg>'
						  };
	
	this.m_shapeMap = {
		"cube": "bd-stop",
		"cross": "bd-cross",
		"chevron": "bd-arrow-right",
		"quad": "bd-diamond",
		"triangle": "bd-arrowup",
		"invertedtriangle": "bd-arrowdown",
		"point": "bd-circle",
		"star": "bd-star2",
		"polygon": "bd-hexagon-1",
		"plus": "bd-plus",
	//	"piechart": "bd-piechart",
		"piechart": "bd-circle",
		"ring": "bd-doughnut",
		"bubble": "bd-circle",
		"ellipsis": "bd-oval",
		"database": "bd-data-base-1",
		"default": "bd-stop"
	};

	this.m_textUtil = new TextUtil();
	this.m_util = new Util();
	this.m_defaultfontfamily = "Roboto";
	this.m_status = {
		noData: "Data not available !",
		noDataset: "DataSet not available !",
		noSeries: "No Visible Series Field Available !",
		noCategory: "No Visible Category Field Available !",
		noSubCategory: "SubCategory not available !",
		noField: "No Visible Field Available !",
		noFields: "No Field Available !",
		success: "success",
		progress: "Waiting for data load !",
		invalidDate: "Date formate is not proper !",
		invalidConfig: "Invalid Configuration",
		noDate: "No Visible Start/End Date Field Available",
		noMinCategory: "Minimum three category values should be present in selected category field",
		noLeafNodeData: "Leaf Node Data is Not Available",
		noParentChildData: "Parent and Child Data is Not Available",
		noLatitudeLongitudeData: "Please Update Longitude and Latitude",
		noAnnotationValue:"No Visible Annotation data Available",
		notValidthresholdValues: "Please validate Threshold values",
	};
	this.m_statuscolor = "#EF6C00";
	this.m_statusfontsize = "12";
	this.m_statusfontfamily = "Roboto";

	this.m_fixedlegend = true;
	/** Added for changing component legend and tooltip container backgroundColor*/
	this.m_legendbackgroundcolor = "#ffffff";
	this.m_legendbackgroundtransparency = "1";

	this.m_autotooltiphide = false;
	this.m_controlledtooltip = false;
	this.m_tooltiphidetimeout = 10000;
	this.m_tooltipfontcolor = "#000000";
	this.m_tooltipfontsize = "12";
	this.m_tooltipbackgroundcolor = "#ffffff";
	this.m_tooltipbackgroundtransparency = "1";
	this.m_tooltipbordercolor = "#e0dfdf";
	this.m_tooltipborderwidth = 1;
	this.m_customtooltipwidth = "auto";
	/**Added for single valued components*/
	this.m_tooltipborderradius = "1";
	/**Added for mobile tooltip*/
	this.m_mobiletooltipleftmargin = 15; //Margin from left border.
	this.m_mobiletooltipmargin = 65;//Margin from top.
	this.m_mobiletooltipstyle = "default";
	/** Set background color of hover row in tooltip */
	this.m_fieldhighlightercolor = "#f8f8f8";
	/** Set background color of hover row in tooltip */
	this.m_sortpanelwidth = "150";
	this.m_actionshowdata = true;
	this.m_actionsort = true;
	this.m_actionexport = true;
	this.m_actionchartviews = true;
	/**Adde for touch timeout.*/
	this.m_doubletaptimeout = 500;
	/** To keep base-chart object intact when switching the chart **/
	this.m_actionChartObject = "";
	this.m_tooltipPosition = "auto";
	this.m_chartactions = {
		"showdata": {
			"enable": this.m_actionshowdata,
			"properties": {
				"icon": "bdmenuicon icons bd-grid",
				"label": "Show Data"
			},
			"actions": {}
		},
		"sort": {
			"enable": this.m_actionsort,
			"properties": {
				"icon": "bdmenuicon icons bd-funnel",
				"label": "Sort"
			},
			"actions": {
				"icon": ["bdicon icons bd-arrowdown","bdicon icons bd-arrowup","bdmenuicon icons bd-cross"]
			}
		},
		"export": {
			"enable": this.m_actionexport,
			"properties": {
				"icon": "bdmenuicon icons bd-download",
				"label": "Export"
			},
			"actions": [{"label":"Excel","icon":"bd-export-excel"},
				{"label":"PNG","icon":"bd-png"},
				{"label":"PDF","icon":"bd-pdf"},
				{"label":"PPT","icon":"bd-ppt"}]
		},
		"chartviews": {
			"enable": this.m_actionchartviews,
			"properties": {
				"icon": "bdmenuicon icons bd-chart",
				"label": "Chart"
			},
			"actions": [{"dChart":"Area","dClass":"AreaChart","icon":"bd-graph-1"},
				{"dChart":"Bar","dClass":"BarChart","icon":"bd-bar"},
				{"dChart":"Bubble","dClass":"TimelineChart","icon":"bd-bubble"},
				{"dChart":"Column","dClass":"TimelineChart","icon":"bd-column"},
				{"dChart":"Line","dClass":"TimelineChart","icon":"bd-line"},
				{"dChart":"Pie","dClass":"PieChart","icon":"bd-piechart"},
				{"dChart":"Spider","dClass":"SpiderChart","icon":"bd-star2off"}]
		}
	};
	/** Export the dataGrid in pdf as a Table **/
	this.m_exporttopdfgrid  = {
		"exportastable" : "false",
		"theme" : "striped",
		"orientation" : "l",
		"filterdetails" : "false"
	};
	this.m_exporttype = "screenshot";
	this.m_exporttopdfngrid = false;
	this.m_pdfheadingcolor = "#006684";
	this.m_pdfsubheadingcolor = "#f5f5f5 ";
	this.m_pdfheadingopacity = 1;
	this.m_pdfsubheadingopacity = 1;
	this.m_pdfhfontcolor = "#ffffff";
	this.m_pdfshfontcolor = "#000000";
	/**Added below variable to change the file name & orientation of export group components**/
	this.m_scrnshotfilename = "Dashboard";
	this.m_scrnshotorientation = "p";
	this.m_showPageNumber = true;
	this.m_pageNumberFontSize = 16;
	this.m_pageNumberFontColor ='#000000';
	this.m_hidemaxnmin = false;
	this.m_loadermessage = "";
	this.m_tooltiptextalign="center";//left/right
	this.m_tooltipremove = true;
	/** To enable excel formatters in Charts using script, BDD-637 **/
	this.m_enablexcelformatter = "false";
	/** Whether to execute the script or not after GlobalVariable update, BDD-279 **/
	this.m_notifychange = true;
	/** Default export base-background color when chart-bg-opacity is less than 1 BDD-664 **/
	this.m_exportdefaultbgcolor = "#FFFFFF";
	/** Variable to configure the icon and export menu labels in contextMenu list, BDD-664 **/
	this.m_exportmenus = {
		"exportToExcel": {
			"iconPath": "icon bd-export-excel",
			"exportToExcel": "Export to Excel"
		},
		"exportToTSV": {
			"iconPath": "bdicon icons bd-excel",
			"exportToCSV": "Export to TSV"
		},
		"exportToCSV": {
			"iconPath": "bdicon icons bd-csv",
			"exportToCSV": "Export to CSV"
		},
		"exportToPPT": {
			"iconPath": "icon bd-ppt",
			"exportToPPT": "Export To PPT"
		},
		"exportToPDF": {
			"iconPath": "icon bd-pdf",
			"exportToPDF": "Export To PDF"
		},
		"exportToPNG": {
			"iconPath": "icon bd-png",
			"exportToPNG": "Export To PNG"
		},
		"exportToJPEG": {
			"iconPath": "icon bd-image",
			"exportToJPEG": "Export To JPEG"
		},
		"exportToPrint": {
			"iconPath": "icon bd-print",
			"exportToPrint": "Print Preview"
		},
		"exportToGrid": {
			"iconPath": "icon bd-grid",
			"showData": "Show Data"
		}
	};
	/** Enable the audit for click events on component BDD-661 **/
	this.m_enableaudit = false;
	this.m_showdatatooltipcolor = "#ffffff";
	this.m_showdatatooltiptextcolor = "#000000";
	this.m_showdatatooltipborder = "0px transparent";
	this.m_showdatatooltipfontsize = "12px";
	/** Enable axis and title descriptions as HTML content BDD-579 */
	this.m_enablehtmlformate = {
			"title": false,
			"subtitle": false,
			"xaxis": false,
			"yaxis": false,
			"secondaryaxis": false
	}
};
/** @description initializes a component container and its events **/
Widget.prototype.initializeDraggableDivAndCanvas = function(dashboardName, zindex) {
	this.setDashboardNameAndObjectId(dashboardName);
	this.createDraggableDiv(zindex);
	this.createDraggableCanvas();
	this.setCanvasContext();
	this.initMouseMoveEvent();
	this.initMouseClickEvent();
};
/** @description create a valid id for component container **/
Widget.prototype.setDashboardNameAndObjectId = function() {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length === 2) {
		this.m_objectid = this.m_objectid.split(".")[1];
	}
};
/** @description create a component container division which will be added to the dashboard **/
Widget.prototype.createDraggableDiv = function(container, zindex) {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	var draggableDiv = document.createElement("div");
	draggableDiv.setAttribute("id", "draggableDiv" + this.m_objectid);
	draggableDiv.setAttribute("class", this.m_objectclass);
	draggableDiv.setAttribute("name", this.m_objectname + "_" + this.m_objecttype);
	draggableDiv.setAttribute("data-name", this.m_objectname);
	draggableDiv.setAttribute("data-id", this.m_referenceid);
	draggableDiv.setAttribute("data-type", this.m_objecttype);
	draggableDiv.setAttribute("data-charttype", this.m_componenttype);
	draggableDiv.style.overflow = "hidden";
	draggableDiv.style.zIndex = "" + zindex;
	$(container).append(draggableDiv);
	/** Store the original x/y position of component **/
	this.m_left = this.m_x;
	this.m_top = this.m_y;
	if (!IsBoolean(this.m_bootstrap)) {
		draggableDiv.style.position = "absolute";
		draggableDiv.style.display = "block";
		this.setDraggableDivPosition(this.m_x, this.m_y);
	}
	this.setDraggableDivSize();
	this.setDraggableDivShadow();
	this.addGroups(draggableDiv);
	return draggableDiv;
};
/** @description component container positioned according to the given coordinates**/
Widget.prototype.setDraggableDivPosition = function(x, y) {
	var draggableDiv = document.getElementById("draggableDiv" + this.m_objectid);
	var left = (!isNaN(x * 1)) ? x * 1 : 0 * 1;
	var top = (!isNaN(y * 1)) ? y * 1 : 0 * 1;
	draggableDiv.style.left = left + "px";
	draggableDiv.style.top = top + "px";
};
/** @description set the size for component container depends on dashboard type **/
Widget.prototype.setDraggableDivSize = function() {
	var draggableDiv = document.getElementById("draggableDiv" + this.m_objectid);
	if ((draggableDiv || "") != "") {
		if (this.m_bootstrap) {
			draggableDiv.style.height = "100%";
			draggableDiv.style.width = "100%";
			this.initializeForBootstrap();
		} else {
			draggableDiv.style.height = this.m_height + "px";
			draggableDiv.style.width = this.m_width + "px";
		}
	}
};
/** @description component container will have some shadow to look like material ui card **/
Widget.prototype.setDraggableDivShadow = function() {
	if(IsBoolean(this.getShowShadow())) {
		var shadow = hex2rgb(convertColorToHex(this.m_shadowcolor), this.m_shadowopacity);
		$("#draggableDiv" + this.m_objectid).css({
			"box-shadow": "0 1px 2px " + shadow + ", 0 1px 1px " + shadow + "",
			"-webkit-box-shadow": "0 1px 2px " + shadow + ", 0 1px 1px " + shadow + "",
			"-moz-box-shadow": "0 1px 2px " + shadow + ", 0 1px 1px " + shadow + ""
		});
	}else{
		/** remove the css property so designMode shadow can be aplied if set from preference **/
		$("#draggableDiv" + this.m_objectid).css({
			"box-shadow": "",
			"-webkit-box-shadow": "",
			"-moz-box-shadow": ""
		});
	}
};
/** @description Material shadow should be hidden for dashboards_version < 3.0.0 
 * check for showShadow property in absoluteLayout, this can be set true for old-dashboards to enable shadow in those versions **/
Widget.prototype.getShowShadow = function() {
	if(this.m_dashboard && 
			this.m_dashboard.m_dashboardjson && 
			this.m_dashboard.m_dashboardjson.Niv && 
			this.m_dashboard.m_dashboardjson.Niv.Dashboard && 
			this.m_dashboard.m_dashboardjson.Niv.Dashboard.AbsoluteLayout){
		try{
			var dShowShadow = this.m_dashboard.m_dashboardjson.Niv.Dashboard.AbsoluteLayout.showShadow;
			/** If global shadow is set as true, it will be applicable to all the components **/
			if (dShowShadow != undefined && IsBoolean(dShowShadow)){
				this.m_showshadow = IsBoolean(dShowShadow);
				this.m_shadowcolor = this.m_dashboard.m_dashboardjson.Niv.Dashboard.AbsoluteLayout.shadowColor;
				this.m_shadowopacity = this.m_dashboard.m_dashboardjson.Niv.Dashboard.AbsoluteLayout.shadowOpacity;
			}
		}catch(e){
			console.log("Version is not defined in config JSON");
		}
	}
	return this.m_showshadow;
};
/*Window Resize capture event for close popups CP-1013*/
Widget.prototype.checkWindowResize = function(popup) {
	
	$(window).resize(function() {
		  //resize just happened, close changed
		$(popup).hide();
		});
};


/** @description Adding values for avoid looping in script **/
Widget.prototype.addGroups = function(divs) {
	var temp = this;
	$.data(divs, "referenceID", this.m_referenceid);
	if (this.m_groupings) {
		/** To avoid same className and groupName problem, add prefix g_ in className.*/
		var grps = this.m_groupings.split(",");
		grps = grps.map(function(val) {return 'g_' + val.replace(/\s/g,'')});
		$.each(grps, function(index, cls) {
			$(divs).addClass(cls);
			/** Storing the group class in class-level-variable **/
			temp.m_objectclass = temp.m_objectclass + " " + cls;
			if (temp.m_dashboard) {
				temp.m_dashboard.pushUniqueToAvailableGroups(cls);
			}
		});
	}
};
/** @description create a canvas for chart components **/
Widget.prototype.createDraggableCanvas = function(container) {
	var temp = this;
	$("#draggableCanvas" + temp.m_objectid).remove();
	var draggableCanvas = document.createElement("canvas");
	draggableCanvas.id = "draggableCanvas" + this.m_objectid;
	container.appendChild(draggableCanvas);
	this.setDraggableCanvasSize();
};
/** @description set the canvas size **/
Widget.prototype.setDraggableCanvasSize = function() {
	var draggableCanvas = document.getElementById("draggableCanvas" + this.m_objectid);
	if ((draggableCanvas || "") != "") {
		draggableCanvas.width = this.m_width;
		draggableCanvas.height = this.m_height;
	}
};
/** @description create a context for the canvas, which will be used for drawing of component **/
Widget.prototype.setCanvasContext = function() {
	var temp = this;
	this.draggableCanvas = $("#draggableCanvas" + temp.m_objectid);
	this.ctx = $("#draggableCanvas" + temp.m_objectid)[0].getContext("2d");
	//	this.adjustPixelRatio();
	/** adjustPixelRatio() setting is not required, it is making issue in iPhone6 **/
	this.reSetCanvasCoordinates();
};
/** @description reset the variables to 0,0 after component positioning to absolute location **/
Widget.prototype.reSetCanvasCoordinates = function() {
	this.m_x = 0;
	this.m_y = 0;
	this.adjustPixelRatio();
};

/** @description Setting backing store pixel ratio and the device pixel ratio **/
Widget.prototype.adjustPixelRatio = function() {
	var temp = this;
	var canvas = document.getElementById("draggableCanvas" + this.m_objectid);
	if ((canvas || "") != "") {
		var context = $("#draggableCanvas" + temp.m_objectid)[0].getContext("2d");
		this.adjustPixelRatioForCanvas(canvas, context);
	}
};
/** Method takes canvas and context as parameter to make reusable moduler method **/
Widget.prototype.adjustPixelRatioForCanvas = function(canvas, context) {
	if ((canvas || "") != "") {
		if ((context || "") != "") {
			ratio = this.getDevicePixelRatio();
			if (typeof auto === "undefined") {
				auto = true;
			}
			if (auto && devicePixelRatio !== backingStoreRatio) {
				var oldWidth = canvas.width;
				var oldHeight = canvas.height;
				canvas.width = oldWidth * ratio;
				canvas.height = oldHeight * ratio;
				canvas.style.width = oldWidth + "px";
				canvas.style.height = oldHeight + "px";
				context.scale(ratio, ratio);
			}
		} else {
			//Do nothing
		}
	}
};
/** @description detect the device and return the device pixel ratio **/
Widget.prototype.getDevicePixelRatio = function() {
	var temp = this;
	var canvas = document.getElementById("draggableCanvas" + this.m_objectid);
	var ratio = 1;
	if ((canvas || "") != "") {
		var context = $("#draggableCanvas" + temp.m_objectid)[0].getContext("2d");
		ratio = this.getDevicePixelRatioForCanvas(canvas, context);
	}
	return ratio;
};
/** Method takes canvas and context as parameter to make reusable moduler method **/
Widget.prototype.getDevicePixelRatioForCanvas = function(canvas, context) {
	var ratio = 1;
	if ((canvas || "") != "") {
		if ((context || "") != "") {
			devicePixelRatio = (window.devicePixelRatio || 1);
			backingStoreRatio = (context.webkitBackingStorePixelRatio ||
				context.mozBackingStorePixelRatio ||
				context.msBackingStorePixelRatio ||
				context.oBackingStorePixelRatio ||
				context.backingStorePixelRatio || 1);

			ratio = devicePixelRatio / backingStoreRatio;
		}
	}
	return ratio;
};

/** Method to get margin for tool tip in chart**/
Widget.prototype.getMarginForTooltip = function() {
    var Margin = 0;
    if (!IsBoolean(this.m_designMode) && dGlobals.layoutType == "MobileLayout" && IsBoolean(this.isMaximized)) {
        Margin = this.m_mobiletooltipmargin*this.minWHRatio();
    }
    return Margin;
}
/** @description initialize the touch and mouse move event on chart container **/
Widget.prototype.initMouseMoveEvent = function(parentDivObject) {
	if (!IsBoolean(this.m_designMode)) {
		var temp = this;
		parentDivObject = this.m_chartContainer;
		if ("ontouchstart" in document.documentElement) {
			/** captures touch event on container div **/
			$("#draggableDiv" + temp.m_objectid).bind("touchstart", function(e) {
				var touches = e.originalEvent.touches[0];
				var offset;
				/** In story offset were not calculating properly when chart has another parent container **/
				var parentOffsetLeft = $(this).offset().left - $(this)[0].scrollLeft;
				var parentOffsetTop = $(this).offset().top - $(this)[0].scrollTop;

				if (temp.m_istrellis !== undefined && IsBoolean(temp.m_istrellis)) {
					offset = $(parentDivObject).offset();
					parentOffsetLeft = offset.left + $(parentDivObject)[0].clientLeft - $(parentDivObject)[0].scrollLeft;
					parentOffsetTop = offset.top + $(parentDivObject)[0].clientTop - $(parentDivObject)[0].scrollTop;
				}
				mouseX = touches.pageX - parentOffsetLeft;
				mouseY = touches.pageY - parentOffsetTop;
				pageX = touches.pageX;
				pageY = touches.pageY;

				if ((temp.m_istrellis !== undefined && IsBoolean(temp.m_istrellis)) || (temp.m_isRepeaterPart !== undefined && IsBoolean(temp.m_isRepeaterPart))) {
					e.stopPropagation();
					onMouseMove(temp);
				}
			}).bind("touchend", function() {});
		} else {
			/** captures mouse move event on division **/
			$("#draggableDiv" + temp.m_objectid).mousemove(function(e) {
				var offset = $(parentDivObject).offset();
				/** tooltip is distorted when border is given for dashboard or dashboard is scrollable **/
				var parentOffsetLeft = offset.left + $(parentDivObject)[0].clientLeft - $(parentDivObject)[0].scrollLeft;
				var parentOffsetTop = offset.top + $(parentDivObject)[0].clientTop - $(parentDivObject)[0].scrollTop;

				var offsetLeft = (!temp.m_bootstrap) ? ($(this)[0].offsetLeft) : 0;
				var offsetTop = (!temp.m_bootstrap) ? ($(this)[0].offsetTop) : 0;

				mouseX = e.pageX - offsetLeft * 1 - parentOffsetLeft;
				mouseY = e.pageY - offsetTop * 1 - parentOffsetTop;
				pageX = e.pageX;
				pageY = e.pageY;
				if ((temp.m_istrellis !== undefined && IsBoolean(temp.m_istrellis)) || (temp.m_isRepeaterPart !== undefined && IsBoolean(temp.m_isRepeaterPart))) {
					/** when repeater is present, mouseX,mouseY should be calculated according to the repeater container 
					 * to prevent event bubbling, stop the propagation  **/
					e.stopPropagation();
					if (temp.m_canvastype !== "svg") {
						onMouseMove(temp);
					}
				}
			});
		}

		/** captures swipe left event on division **/
		$("#draggableDiv" + temp.m_objectid).on("swipeleft", function(e) {
			onSwipeLeft(temp, e);
		});
		/** captures swipe right event on division **/
		$("#draggableDiv" + temp.m_objectid).on("swiperight", function(e) {
			onSwipeRight(temp, e);
		});
		$("#draggableDiv" + temp.m_objectid).on("mousewheel", function(e) {
			temp.hideToolTip();
		});
		$(".draggablesParentDiv").on("scroll", function(e) {
			temp.hideToolTip();
		});
		$("#WatermarkDiv").on("scroll", function(e) {
			temp.hideToolTip();
		});
	}
};
/** @description initialize the mouse event on canvas **/
Widget.prototype.initMouseClickEvent = function() {
	if (!IsBoolean(this.m_designMode)) {
		var temp = this;
		var canvas = $("#draggableCanvas" + this.m_objectid);
		if ((canvas || "") != "") {
			if (!IsBoolean(isTouchEnabled)) {
				/** mouse move event on CANVAS**/
				$(canvas)[0].addEventListener("mousemove", function(e) {
					if (temp.m_istrellis === undefined && temp.m_isRepeaterPart === undefined) {
						onMouseMove(temp);
					}
				}, false);
				$(canvas)[0].addEventListener("mouseout", function(e) {
					if (temp.m_componenttype === "trend") {
						temp.removeToolTipDiv();
					}
				}, false);
			}
			/** mouse click event on CANVAS**/
			$(canvas)[0].addEventListener("click", function(e) {
				if ("ontouchstart" in document.documentElement) {
					temp.hideToolTip();
					onMouseMove(temp);
				} else {
					temp.hideToolTip();
					OnMouseClick(temp);
					e.stopPropagation();
				}
			}, false);
			/** touch start event on CANVAS**/
			$(canvas)[0].addEventListener("touchstart", function(event) {
				var touches = (event.originalEvent) ? event.originalEvent.touches[0] : event.targetTouches[0];
				pageX = touches.pageX;
				pageY = touches.pageY;
				temp.hideToolTip();
				if (temp.m_istrellis === undefined && temp.m_isRepeaterPart === undefined) {
					onMouseMove(temp);
				}
				/**double tap to drill in mobile view**/
				if (singleClickTimer == null) {
					singleClickTimer = setTimeout(function() {
						singleClickTimer = null;
						onMouseMove(temp);
					}, temp.m_doubletaptimeout);
				} else {
					clearTimeout(singleClickTimer);
					singleClickTimer = null;
					OnMouseClick(temp);
				}
			}, false);
			/** pinch zoom event on CANVAS**/
			$(canvas)[0].addEventListener("gestureend", function(event) {
				if (IsBoolean(temp.m_showmaximizebutton) &&
					temp.m_showmaximizebutton !== undefined &&
					temp.m_showmaximizebutton !== "") {
					if (event.scale < 1.0 && IsBoolean(temp.isMaximized)) {
						$("#MaximizeTooltipDiv").remove();
						temp.minimize();
					} else if (event.scale > 1.0 && !IsBoolean(temp.isMaximized)) {
						$("#MaximizeTooltipDiv").remove();
						temp.maximize();
					} else {
						// Do nothing
					}
				}
			}, false);
			
			/** tap hold event on CANVAS**/
			$("#draggableCanvas" + this.m_objectid).bind("taphold", function(e) {
				temp.hideToolTip();
				//OnMouseClick(temp);
			});
		}
		this.initContextMenuEvent();
	}
};

/** @description event for SVG Components **/
Widget.prototype.initMouseClickEventForSVG = function(svgContainerId) {
	if (!IsBoolean(this.m_designMode)) {
		var temp = this;
		var canvas = $("#" + svgContainerId);
		if ((canvas || "") != "") {
			if (!IsBoolean(isTouchEnabled)) {
				$(canvas)[0].addEventListener("mousemove", function(e) {
					onMouseMove(temp);
				}, false);
			}
			$(canvas)[0].addEventListener("click", function(e) {
				if ("ontouchstart" in document.documentElement) {
					temp.hideToolTip();
					onMouseMove(temp);
				} else {
					temp.hideToolTip();
					OnMouseClick(temp);
					e.stopPropagation();
				}
			}, false);
			$(canvas)[0].addEventListener("touchstart", function(event) {
				var touches = (event.originalEvent) ? event.originalEvent.touches[0] : event.targetTouches[0];
				pageX = touches.pageX;
				pageY = touches.pageY;
				temp.hideToolTip();
				onMouseMove(temp);

				if (singleClickTimer == null) {
					singleClickTimer = setTimeout(function() {
						singleClickTimer = null;
						onMouseMove(temp);
					}, temp.m_doubletaptimeout);
				} else {
					clearTimeout(singleClickTimer);
					singleClickTimer = null;
					OnMouseClick(temp);
				}
			}, false);
			$(canvas)[0].addEventListener("gestureend", function(event) {
				if (IsBoolean(temp.m_showmaximizebutton) &&
					temp.m_showmaximizebutton !== undefined &&
					temp.m_showmaximizebutton !== "") {
					if (event.scale < 1.0 && IsBoolean(temp.isMaximized)) {
						$("#MaximizeTooltipDiv").remove();
						temp.minimize();
					} else if (event.scale > 1.0 && !IsBoolean(temp.isMaximized)) {
						$("#MaximizeTooltipDiv").remove();
						temp.maximize();
					} else {
						// Do nothing
					}
				}
			}, false);
			$("#draggableCanvas" + this.m_objectid).bind("taphold", function(e) {
				temp.hideToolTip();
				OnMouseClick(temp);
			});
		}
		this.initContextMenuEvent();
	}
};

/**Added common mouse event method for some single value component(SVC)**/
Widget.prototype.initMouseAndTouchEventSVC = function(comp) {
    if (!IsBoolean(this.m_designMode)) {
        var temp = this;
        this.checkToolTipDesc = (temp.m_objecttype == "gauge" || temp.m_objecttype == "semigauge") ? "Target Value" : this.updateToolTipInfo(this.m_tooltip);
        var mousemoveFn = function(e) {
            if (!temp.m_designMode && temp.m_tooltip != "" && temp.m_tooltip != " ") {
            	e.stopPropagation();
                temp.removeToolTipDiv();
               // var parentDiv = (temp.m_objecttype == "gauge" || temp.m_objecttype == "semigauge") ? document.body : document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
                var dashboard = document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
                var parentDiv = document.getElementById("WatermarkDiv");
                var scrollLeft = dashboard.scrollLeft;
                var scrollTop = dashboard.scrollTop;
                var offset = $(parentDiv).offset();
                var PageTop = 0;//offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
                var PageLeft = 0;//offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft;
                var offsetLeft = $(this)[0].offsetLeft;
                var offsetTop = $(this)[0].offsetTop;
                var divTop = e.pageY - PageTop - offsetTop + 5;
                var divLeft = e.pageX - PageLeft - offsetLeft + 5;
                var tooltipDiv = document.createElement("div");
                tooltipDiv.innerHTML = temp.checkToolTipDesc;
                tooltipDiv.setAttribute("id", "toolTipDiv");
                tooltipDiv.setAttribute("class", "settingIcon");
                tooltipDiv.setAttribute("placement", "bottom");
                if (temp.m_objecttype == "gauge" || temp.m_objecttype == "semigauge") {
                    $(document.body).append(tooltipDiv);
                } else {
                   // $(".draggablesParentDiv").append(tooltipDiv);
                    document.querySelector("#WatermarkDiv").appendChild(tooltipDiv);
                }

                /**Commented this for updating enhanced tooltip PLAT-112**/
                /*var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
                	"top": divTop + "px",
                	"left": divLeft + "px"
                });
                $(tooltipDiv).css(tooltipObjCss);*/
                var wd = $(comp)[0].offsetWidth * 1;//temp.m_width * 1,
                    ht = $(comp)[0].offsetHeight * 1;//temp.m_height * 1;
                var deeptop = (ht > 16) ? 8 + temp.m_tooltipborderwidth : 0;
                var deepleft = (wd > 16) ? 8 + temp.m_tooltipborderwidth : 0;
                var lt,sidemargin = 40,pointerH = 20,pointerW = 38;
                var tolerance = 1;//(temp.m_tooltipborderwidth == 0) ? 1 : 2;
                var left = e.pageX + parentDiv.scrollLeft - e.offsetX - PageLeft - offsetLeft;
                //var top = (temp.m_objecttype == "gauge" || temp.m_objecttype == "semigauge") ? e.pageY - e.offsetY + ht - PageTop - offsetTop - deeptop : temp.m_top + ht - PageTop - offsetTop - deeptop;
                var top = e.pageY + parentDiv.scrollTop - e.offsetY + ht - PageTop - offsetTop - deeptop;
                //if(left + wd + 110 > temp.m_dashboard.m_AbsoluteLayout.m_width * 1 + scrollLeft){
                //left = left / 2;
                //}
                var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
                    "top": top + "px",
                    "left": left + "px"
                });
                var width = tooltipDiv.offsetWidth; 
                $(tooltipDiv).css({
                   "left": lt + "px",
                  // "width": width + "px"
                });
                    //"white-space": "nowrap"
                divTop = temp.m_top * 1 + ht - PageTop - offsetTop;
                $(tooltipDiv).css(tooltipObjCss);
                /**DAS-709 */
                $(tooltipDiv).css({
                	"width": "max-content"
                });
                if (temp.m_objecttype == "gauge" || temp.m_objecttype == "semigauge") {
                    var tp = e.pageY - e.offsetY + $(comp)[0].offsetHeight - PageTop;
                    lt = e.pageX - e.offsetX - (tooltipDiv.offsetWidth / 2) + (($(comp)[0].offsetWidth) / 2) - PageLeft - 18;
                    divLeft = e.pageX - e.offsetX - (tooltipDiv.offsetWidth / 2) + (($(comp)[0].offsetWidth) / 2) - PageLeft - 18;
                    if (tp + tooltipDiv.offsetHeight > window.pageYOffset + window.innerHeight) {
                        tp = tp - $(comp)[0].offsetHeight - tooltipDiv.offsetHeight - 40; //20 is settingIcon height and 20 for tooltip margin.
                        tooltipDiv.setAttribute("placement", "top");
                    }
                    $(tooltipDiv).css({
                        "top" : tp + "px",
                        "left": lt + "px"
                    });
                    /**DAS-80 Gauge Semi Gauge Tooltip issue */
                    var tooltipRect = tooltipDiv.getBoundingClientRect();
                    var tooltipLeft = tooltipRect.left;
                    var tooltipRight = tooltipRect.right;
                    var tooltipTop = tooltipRect.top;
                    var tooltipBottom = tooltipRect.bottom;
                    var windowWidth = window.innerWidth;
                    var windowHeight = window.innerHeight;
                    temp.m_tooltipPosition = "auto";

                    if (tooltipRight > windowWidth) {
                        console.log('Tooltip goes off the right side of the window');
                        temp.m_tooltipPosition = "left-middle";

                    }
                    if (tooltipLeft < 0) {
                        console.log('Tooltip goes off the left side of the window');

                        temp.m_tooltipPosition = "right-middle";
                    }
                } else {
                    //lt = temp.m_left * 1 + (wd / 2) - offsetLeft - ((tooltipDiv.offsetWidth + sidemargin) / 2) + "px";
                    //divLeft = temp.m_left * 1 + (wd / 2) - PageLeft - offsetLeft - ((tooltipDiv.offsetWidth + sidemargin) / 2);
                	lt = left - (tooltipDiv.offsetWidth / 2) + (temp.m_width/2) - parentDiv.offsetLeft - 20; //20 for settingicon margin
                    $(tooltipDiv).css("left", lt);   
                }
                if (!IsBoolean(isTouchEnabled)) {
                    $(tooltipDiv).hover(function() {
                    	temp.m_tooltipremove = false;
                    }, function() {
                    	temp.m_tooltipremove = true;
                        $(tooltipDiv).remove();
                    });
                }

                if (temp.m_tooltipPosition !== "auto") {
                    temp.m_tooltipPosition = temp.m_tooltipPosition.trim();
                    switch (temp.m_tooltipPosition) {
                        case "bottom":
                            $(tooltipDiv).css("left", lt);
                            tooltipDiv.setAttribute("placement", temp.m_tooltipPosition);
                            break;
                        case "bottom-left":
                       	 var bordertol = (temp.m_tooltipborderwidth == 1) ? 1 : 0;
                            divLeft = temp.m_left * 1 - PageLeft - sidemargin - (pointerW/2) + (wd / 2) - tolerance - bordertol;
                            $(tooltipDiv).css("left", divLeft);
                            tooltipDiv.setAttribute("placement", temp.m_tooltipPosition);
                            break;
                        case "bottom-right":
                       	 var bordertol = (temp.m_tooltipborderwidth == 1) ? 1 : 0;
                            divLeft = divLeft - ((tooltipDiv.offsetWidth + pointerH) / 2) + sidemargin + (pointerH/2) + bordertol;
                            $(tooltipDiv).css("left", divLeft);
                            tooltipDiv.setAttribute("placement", temp.m_tooltipPosition);
                            break;
                        case "top":
                            divTop = temp.m_top * 1 - PageTop * 1 + scrollTop * 1 - (tooltipDiv.offsetHeight + sidemargin) + deeptop;
                            $(tooltipDiv).css({
                                "left": lt,
                                "top": divTop
                            });
                            tooltipDiv.setAttribute("placement", temp.m_tooltipPosition);
                            break;
                        case "top-left":
                       	 var bordertol = (temp.m_tooltipborderwidth == 1) ? 1 : 0;
                            divTop = temp.m_top * 1 - PageTop * 1 + scrollTop * 1 - (tooltipDiv.offsetHeight + sidemargin) + deeptop;
                            divLeft = temp.m_left * 1 - PageLeft - sidemargin - (pointerW/2) + (wd / 2) - tolerance - bordertol;
                            $(tooltipDiv).css({
                                "left": divLeft,
                                "top": divTop
                            });
                            tooltipDiv.setAttribute("placement", temp.m_tooltipPosition);
                            break;
                        case "top-right":
                       	 var bordertol = (temp.m_tooltipborderwidth == 1) ? 1 : 0;
                            divTop = temp.m_top * 1 - PageTop * 1 + scrollTop * 1 - (tooltipDiv.offsetHeight + sidemargin) + deeptop;// + (temp.m_tooltipborderwidth * 2)
                            divLeft = divLeft - ((tooltipDiv.offsetWidth + pointerH) / 2) + sidemargin + (pointerH/2) + bordertol;
                            $(tooltipDiv).css({
                                "left": divLeft,
                                "top": divTop
                            });
                            tooltipDiv.setAttribute("placement", temp.m_tooltipPosition);
                            break;
                        case "right-top":
                        case "right-middle":
                            divLeft = temp.m_left * 1 - PageLeft - 50 + (wd / 2);
                            //if (divLeft < 0 && wd / 2 <= 50) {
                            divLeft = temp.m_left * 1 + wd - deepleft;
                            divTop = (temp.m_tooltipPosition.indexOf("top") > 0) ? divTop - (ht / 2) - (pointerH/2) - sidemargin : temp.m_top - PageTop * 1 + scrollTop * 1 + (ht / 2) - ((tooltipDiv.offsetHeight + (temp.m_tooltipborderwidth * 2) + sidemargin) / 2);
                            divTop = (divTop < 0) ? temp.m_top * 1 - 20 : divTop;
                            $(tooltipDiv).css({
                                "left": divLeft,
                                "top": divTop
                            });
                            /*} else if (divLeft < -8) {
                                divLeft = 0;
                                $(tooltipDiv).css("left", divLeft);
                            } else {
                                $(tooltipDiv).css("left", divLeft);
                            }*/
                            if (temp.m_tooltipPosition == "right-top") {
                                tooltipDiv.setAttribute("placement", "left-top");
                            } else {
                                tooltipDiv.setAttribute("placement", "left-middle");
                            }
                            //tooltipDiv.setAttribute("placement", temp.m_tooltipPosition);
                            break;
                        case "right-bottom":
                            divTop = temp.m_top * 1 - PageTop * 1 + scrollTop * 1 - (tooltipDiv.offsetHeight + (temp.m_tooltipborderwidth * 2) + sidemargin) + deeptop;
                            divLeft = temp.m_left * 1 - PageLeft - 50 + (wd / 2);
                            //if (divLeft < 0 && wd / 2 <= 50) {
                            divLeft = temp.m_left * 1 + wd - deepleft;
                            //divTop = (temp.m_tooltipPosition.indexOf("top") > 0) ? divTop + 40 + (ht / 2) : temp.m_top - PageTop * 1 + scrollTop * 1 - (tooltipDiv.offsetHeight / 2);
                            divTop = divTop + 40 + 10 + (ht / 2) - 8;
                            divTop = (divTop < 0) ? temp.m_top * 1 - 18 : divTop;
                            $(tooltipDiv).css({
                                "left": divLeft,
                                "top": divTop
                            });
                            /*} else if (divLeft < -8) {
                                divLeft = 0;
                                $(tooltipDiv).css("left", divLeft);
                            } else {
                                $(tooltipDiv).css("left", divLeft);
                            }*/
                            tooltipDiv.setAttribute("placement", "left-bottom");
                            break;
                        case "left-top":
                        case "left-middle":
                            divLeft = divLeft - ((tooltipDiv.offsetWidth + 20) / 2) + 50;
                            //if (divLeft + (tooltipDiv.offsetWidth + sidemargin) > temp.m_dashboard.m_AbsoluteLayout.m_width * 1 + scrollLeft) {
                            divLeft = divLeft - (wd / 2) - 40 - 2 - 18 + deepleft;
                            divTop = (temp.m_tooltipPosition.indexOf("top") > 0) ? divTop - (ht / 2) - (pointerH/2) - sidemargin : temp.m_top - PageTop * 1 + scrollTop * 1 + (ht / 2) - ((tooltipDiv.offsetHeight + (temp.m_tooltipborderwidth * 2) + sidemargin) / 2);
                            divTop = (divTop < 0) ? temp.m_top * 1 - 20 : divTop;
                            $(tooltipDiv).css({
                                "left": divLeft,
                                "top": divTop
                            });
                            /*} else {
                                $(tooltipDiv).css("left", divLeft);
                            }*/
                            if (temp.m_tooltipPosition == "left-top") {
                                tooltipDiv.setAttribute("placement", "right-top");
                            } else {
                                tooltipDiv.setAttribute("placement", "right-middle");
                            }
                            //tooltipDiv.setAttribute("placement", temp.m_tooltipPosition);
                            break;
                        case "left-bottom":
                       	 divTop = temp.m_top * 1 - PageTop * 1 + scrollTop * 1 - (tooltipDiv.offsetHeight + (temp.m_tooltipborderwidth * 2) + sidemargin) + deeptop;
                            divLeft = divLeft - ((tooltipDiv.offsetWidth + 20) / 2) + 50;
                            //if (divLeft + (tooltipDiv.offsetWidth + sidemargin) > temp.m_dashboard.m_AbsoluteLayout.m_width * 1 + scrollLeft) {
                            divLeft = divLeft - (wd / 2) - 40 - 2 - 18 + deepleft;
                            //divTop = (temp.m_tooltipPosition.indexOf("top") > 0) ? divTop + 40 + 10 + (ht / 2) : divTop - (ht / 2) - ((tooltipDiv.offsetHeight + 18) / 2) - 8;
                            divTop = divTop + 40 + 10 + (ht / 2) - 8;
                            divTop = (divTop < 0) ? temp.m_top * 1 - 18 : divTop;
                            $(tooltipDiv).css({
                                "left": divLeft,
                                "top": divTop
                            });
                            /*} else {
                                $(tooltipDiv).css("left", divLeft);
                            }*/
                            tooltipDiv.setAttribute("placement", "right-bottom");
                            break;
                        default:
                            temp.removeToolTipDiv();
                            alertPopUpModal({
                                type: "warning",
                                message: "Please choose the correct tooltip position",
                                timeout: '3000'
                            });
                            console.log("Please choose the correct tooltip position");
                            break;
                    }

                } else if(temp.m_objecttype !== "gauge" && temp.m_objecttype !== "semigauge") {
//                    var pos_top = "bottom";
//                    var pos_left = "";
//                    var bordertol = (temp.m_tooltipborderwidth == 1) ? 1 : 0;
//
//                    /** Adjust if going out of boundary **/
//                    if (temp.m_top + ht + 10 * 1 + (tooltipDiv.offsetHeight * 1) + 20 - deeptop > temp.m_dashboard.m_AbsoluteLayout.m_height * 1 + scrollTop) {
//                        divTop = temp.m_top * 1 - PageTop * 1 + scrollTop * 1 - ((tooltipDiv.offsetHeight * 1) + sidemargin) + deeptop;
//                        $(tooltipDiv).css("top", divTop);
//                        pos_top = "top";
//                    }
//                    if ((divLeft + (tooltipDiv.offsetWidth + sidemargin)) < temp.m_dashboard.m_AbsoluteLayout.m_width * 1 + scrollLeft) {
//                        $(tooltipDiv).css("left", lt);
//                    } else {
//                        divLeft = divLeft - ((tooltipDiv.offsetWidth + 20) / 2) + 50; // + 18;
//                        //40 is for adding right value of the pointer
//                        if (divLeft + (tooltipDiv.offsetWidth + sidemargin) > temp.m_dashboard.m_AbsoluteLayout.m_width * 1 + scrollLeft) {
//                            //divLeft = divLeft - ((divLeft + ($(tooltipDiv).width() + 66)) - temp.m_dashboard.m_AbsoluteLayout.m_width) - wd - 20;
//                            divLeft = divLeft - (wd / 2) - sidemargin - (temp.m_tooltipborderwidth * 2) - 20 + deepleft;
//                            //40 is for removing  right value of the pointer value, 2 for border width, 18 for pointer width
//                            //divTop = (pos_top == "top") ? divTop + 40 + (ht / 2) : temp.m_top - PageTop * 1 + scrollTop * 1 - (tooltipDiv.offsetHeight / 2);
//                            divTop = (pos_top == "top") ? divTop + sidemargin + (ht / 2) : temp.m_top * 1 - PageTop * 1 + scrollTop * 1 + (ht / 2) - ((tooltipDiv.offsetHeight + (temp.m_tooltipborderwidth * 2) + sidemargin)/ 2) + tolerance;
//                            pos_left = (divTop < 0) ? "top" : "middle";
//                            divTop = (pos_left == "top") ? temp.m_top * 1 - PageTop * 1 + scrollTop * 1 - sidemargin - (pointerH/2) + (ht / 2) : divTop - tolerance;
//                            divTop = (divTop < -20) ? temp.m_top * 1 - (sidemargin/2) : divTop;
//                            pos_left = (pos_top == "top") ? "bottom" : ((pos_left == "middle") ? pos_left : "top");
//                            pos_top = "right";
//                            if(pos_left == "bottom"){
//                             	divTop = divTop + (tolerance * 2);
//                             }
//                            divTop = (pos_left == "bottom") ? (divTop + tolerance) : divTop;
//                            divTop = (pos_left == "top" && temp.m_tooltipborderwidth == 1) ? divTop - tolerance :((pos_left == "middle" && temp.m_tooltipborderwidth == 1) ? divTop + 1 : divTop);
//                            $(tooltipDiv).css({
//                                "left": divLeft,
//                                "top": divTop
//                            });
//                        } else {
//                        	divLeft = divLeft + bordertol;
//                            $(tooltipDiv).css("left", divLeft);
//                            pos_left = "right";
//                        }
//                    }
//
//                    if ((temp.m_left * 1 - PageLeft + (wd / 2) + 10 * 1 - (($(tooltipDiv).width() + 66) / 2) < 0) && (temp.m_objecttype !== "gauge" || temp.m_objecttype !== "semigauge")) {
//                        divLeft = temp.m_left * 1 - PageLeft - 50 + (wd / 2);
//                        if (divLeft < 0 && wd / 2 <= 50) {
//                            divLeft = temp.m_left * 1 + wd - deepleft;
//                            divTop = (pos_top == "top") ? divTop + sidemargin + (ht / 2) : temp.m_top * 1 - PageTop * 1 + scrollTop * 1 + (ht / 2) - ((tooltipDiv.offsetHeight + (temp.m_tooltipborderwidth * 2) + sidemargin)/ 2) + tolerance;
//                            pos_left = (divTop < 0) ? "top" : "middle";
//                            divTop = (pos_left == "top") ? temp.m_top * 1 - PageTop * 1 + scrollTop * 1 - sidemargin - (pointerH/2) + (ht / 2) : divTop - tolerance;
//                            divTop = (divTop < -20) ? temp.m_top * 1 - (sidemargin/2) : divTop;
//                            pos_left = (pos_top == "top") ? "bottom" : ((pos_left == "middle") ? pos_left : "top");
//                            pos_top = "left";
//                            if(pos_left == "bottom"){
//                            	divTop = divTop + (tolerance * 2);
//                            }
//                            divTop = (pos_left == "bottom") ? (divTop + tolerance) : divTop;
//                            divTop = (pos_left == "top" && temp.m_tooltipborderwidth == 1) ? divTop - tolerance :((pos_left == "middle" && temp.m_tooltipborderwidth == 1) ? divTop + 1 : divTop);
//                            $(tooltipDiv).css({
//                                "left": divLeft,
//                                "top": divTop
//                            });
//                        } else if (divLeft < -8) {
//                            divLeft = 0;
//                            $(tooltipDiv).css("left", divLeft);
//                            pos_left = "left";
//                        } else {
//                        	divLeft = divLeft - (pointerH/2)- bordertol;
//                            $(tooltipDiv).css("left", divLeft);
//                            pos_left = "left";
//                        }
//                    }
//                    var position = (pos_left == "") ? pos_top : pos_top + "-" + pos_left;
//                    tooltipDiv.setAttribute("placement", position);
//                } else {
//					if (1){
//					/*if (e.pageY - e.offsetY +  $(comp)[0].offsetHeight + (tooltipDiv.offsetHeight * 1) + 20 - deeptop >= $(document).height() * 1 + scrollTop) {*/
//                        if(tooltipBottom > windowHeight){
//                        divTop = e.pageY - e.offsetY - PageTop * 1 + scrollTop * 1 - ((tooltipDiv.offsetHeight * 1) + sidemargin) + deeptop;//- $(tooltipDiv).height() * 1 - 76 + deeptop;
//                        $(tooltipDiv).css("top", divTop);
//						tooltipDiv.setAttribute("placement", "top");
//                    }
//                    }
                	var pos_top = "bottom";
                    var pos_left = "";
                    var tp = e.pageY - e.offsetY + PageTop;
                    if (tp + ht + 10 * 1+ tooltipDiv.offsetHeight+ 20 - deeptop > window.pageYOffset + window.innerHeight) {
                        top = top - $(comp)[0].offsetHeight - 20 - tooltipDiv.offsetHeight;
                        pos_top = "top";
                        if (lt < window.pageXOffset) {
                            lt = lt + tooltipDiv.offsetWidth / 2 - 40;
                            pos_left = "left";
                        } else if (lt + tooltipDiv.offsetWidth + 40 > window.pageXOffset + window.innerWidth) {
                            lt = lt - tooltipDiv.offsetWidth / 2 + 40;
                            pos_left = "right";
                        }
                    } else {
                        if (lt + tooltipDiv.offsetWidth + 40 > window.pageXOffset + window.innerWidth) {
                            lt = lt - tooltipDiv.offsetWidth / 2 - 20 - $(comp)[0].offsetWidth/2;
                            top = top - 20 - $(comp)[0].offsetHeight / 2 - 19;
                            pos_left = "top";
                            pos_top = "right";
                        } else if (lt < window.pageXOffset) {
                            lt = lt + tooltipDiv.offsetWidth / 2 + 20 + $(comp)[0].offsetWidth/2;
                            top = top - 20 - $(comp)[0].offsetHeight / 2 - 19;
                            pos_left = "top";
                            pos_top = "left";
                        }
                    }
                    $(tooltipDiv).css({
                    	"top": top,
                    	"left": lt
                    });
                    var position = (pos_left == "") ? pos_top : pos_top + "-" + pos_left;
                    tooltipDiv.setAttribute("placement", position);
                }                   				
            }
        };
        var mouseoutFn = function(e) {
        	//setTimeout(function(){
        		temp.removeToolTipDiv();
        	//}, 1);
        };
        switch (temp.m_objecttype) {
            case "exportppt":
                var clickFn = function(e) {
                    try {
                        if (IsBoolean(temp.m_exportwindow)) {
                            /** creating dialog popup menu for export */
                            temp.createPopupForExport(temp.m_mode);
                        } else {
                            eval("temp.ConvertDivToImageFor" + temp.m_mode + "();");
                        }
                    } catch (e) {
                        console.log("error in export " + temp.m_mode + " !")
                    }
                    temp.handleOnChangeEvent();
                };
                var hoverFn = function(e) {
                    $(this).css("cursor", temp.m_cursortype);
                };
                break;
            case "filtersaver":
                var clickFn = function(e) {
                    temp.createPopupForFilterSaver();
                    //temp.handleOnChangeEvent();
                };
                var hoverFn = function(e) {
                    $(this).css("cursor", temp.m_cursortype);
                };
                break
            case "info":
                var clickFn = function(e) {
                    if ($("#PopUp" + temp.m_componentid) != null) {
                        $("#PopUp" + temp.m_componentid).remove();
                    }
                    var popupdiv = document.createElement("popupdiv");
                    var popupID = "PopUp" + temp.m_componentid;
                    popupdiv.setAttribute("id", popupID);
                    popupdiv.style.width = temp.m_informationwindowwidth + "px";
                    popupdiv.style.height = temp.m_informationwindowheight + "px";
                    popupdiv.style.padding = "0px";
                    var content = '<pre style="color:' + convertColorToHex(temp.m_color) + '; font-style:' + temp.m_fontstyle + '; font-family:' + selectGlobalFont(temp.m_fontfamily) + '; font-weight:' + temp.m_fontweight + '; background-color:' + convertColorToHex(temp.m_windowbackgroundcolor) + ';border: 1px solid ' + convertColorToHex(temp.m_windowbordercolor) + '; font-size:' + temp.m_fontsize * 1 + 'px; overflow-x:hidden; white-space: pre-wrap; word-wrap: break-word; margin-top:auto; height:' + (temp.m_informationwindowheight - 70) + 'px;">' + temp.m_information + '</pre>';
                    if (temp.m_textdecoration.toLowerCase() == "underline") {
                        content = '<u style="color:' + convertColorToHex(temp.m_color) + ';">' + content + '</u>';
                    }
                    popupdiv.innerHTML = content;
                    $("#draggableDiv" + temp.m_objectid).append(popupdiv);

                    jqEasyUI("#" + popupID).dialog({
                        title: temp.m_updatetitle,
                        width: temp.m_informationwindowwidth + "px",
                        closed: false,
                        cache: false,
                        modal: true
                    });
                    temp.setInfoDialogCSS();
                    temp.getDataPointAndUpdateGlobalVariable();
                };
                var hoverFn = function(e) {
                    $(this).css("cursor", temp.m_cursortype);
                };
                break
            case "URLButton":
                var clickFn = function(e) {
                    temp.getDataPointAndUpdateGlobalVariable();
                    if (temp.m_url) {
                        try {
                            temp.loadURL(temp.getURLToCall(temp.m_url));
                        } catch (e) {
                            console.log("Error Occured - " + temp.getURLToCall(temp.m_url) + "\n" + e.message)
                        }
                    }
                };
                var hoverFn = function(e) {
                    $(this).css("cursor", temp.m_cursortype);
                };
                break;
            case "image":
                var clickFn = function(e) {
                    OnMouseClick(temp);
                };
                var hoverFn = function(e) {
                    if (!temp.m_designMode && IsBoolean(temp.m_rolloverglowenable)) {
                        $(this).css({
                            "padding": "1px",
                            "-moz-box-shadow": "1px 1px 6px " + hex2rgb(convertColorToHex(temp.m_rolloverglowcolor), 1),
                            "-webkit-box-shadow": "1px 1px 6px " + hex2rgb(convertColorToHex(temp.m_rolloverglowcolor), 1),
                            "box-shadow": "1px 1px 6px " + hex2rgb(convertColorToHex(temp.m_rolloverglowcolor), 1),
                            "left": "2px",
                            "top": "2px"
                        });
                        temp.setWidthHeightWithAspectRatio($("#" + temp.m_componentid), 8);
                    }
                    $(this).css("cursor", temp.m_cursortype);
                };
                break;
            default:
                var clickFn = function(e) {
                    OnMouseClick(temp);
                };
                var hoverFn = function(e) {
                    $(this).css("cursor", temp.m_cursortype);
                };
        }


        var touchstartFn = function(e) {
            e.stopImmediatePropagation();
            if (!temp.m_designMode && temp.m_tooltip != "" && temp.m_tooltip != " ") {
                if ($(".draggablesParentDiv").find("#" + "toolTipDiv").length === 0) {
                    var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
                    var scrollLeft = parentDiv.scrollLeft;
                    var scrollTop = parentDiv.scrollTop;
                    var PageTop = e.originalEvent.touches[0].pageY;
                    var PageLeft = e.originalEvent.touches[0].pageX;
                    var divTop = PageTop * 1 + scrollTop * 1 + 20 * 1;
                    var divLeft = (((PageLeft * 1 + scrollLeft * 1) - 150) < 0) ? (PageLeft * 1 + scrollLeft * 1) : (PageLeft * 1 + scrollLeft * 1) - 160;
                    var tooltipDiv = document.createElement("div");
                    tooltipDiv.innerHTML = temp.checkToolTipDesc;
                    tooltipDiv.setAttribute("id", "toolTipDiv");
                    tooltipDiv.setAttribute("class", temp.m_objecttype + "ToolTipDiv");
                    $(".draggablesParentDiv").append(tooltipDiv);
                    var tStyles = $.extend(temp.getTooltipStyles(), {
                        "top": divTop + "px",
                        "left": divLeft + "px"
                    });
                    $(tooltipDiv).css(tStyles);

                    /** Adjust if going out of boundary **/
                    if (divTop * 1 + 20 * 1 + $(tooltipDiv).height() * 1 > temp.m_dashboard.m_AbsoluteLayout.m_height + scrollTop) {
                        divTop = PageTop * 1 - 20 + scrollTop * 1 - $(tooltipDiv).height() * 1;
                        $(tooltipDiv).css("top", divTop);
                    }
                    if (divLeft * 1 + 10 * 1 + $(tooltipDiv).width() * 1 > temp.m_dashboard.m_AbsoluteLayout.m_width + scrollLeft) {
                        divLeft = PageTop * 1 - 10 + scrollLeft * 1 - $(tooltipDiv).width() * 1;
                        $(tooltipDiv).css("left", divLeft);
                    }
                } else {
                    temp.removeToolTipDiv();
                }
            }
        };

        if ("ontouchstart" in document.documentElement) {
            /** captures touch event on container div **/
            $("#draggableDiv" + temp.m_objectid).bind("touchstart", function(e) {
                e.stopImmediatePropagation();
                if ($("." + temp.m_objecttype + "ToolTipDiv").length) {
                    mouseoutFn.bind($(comp))(e);
                } else {
                    touchstartFn.bind(this)(e);
                }
                clickFn.bind(this)(e);
            }).bind("touchend", function(e) {
                /** Do Nothing **/
            });
        } else {
            $(comp).click(function(e) {
                    mouseoutFn.bind(this)(e);
                    clickFn.bind(this)(e);
                })
                .hover(function(e) {
                    hoverFn.bind(this)(e);
                })
                .mouseenter(function(e) {
                    mousemoveFn.bind(this)(e);
                })
                .mouseleave(function(e) {
                    mouseoutFn.bind(this)(e);
                });
                /*mouseout(function(e) {
                    mouseoutFn.bind(this)(e);
                });*/
        }

        /** captures swipe events on division **/
        $("#draggableDiv" + temp.m_objectid).on("swipeleft", function(e) {
            onSwipeLeft(temp, e);
        }).on("swiperight", function(e) {
            onSwipeRight(temp, e);
        }).on("mousewheel", function(e) {
            temp.hideToolTip();
        });

        $(".draggablesParentDiv").on("scroll", function(e) {
            temp.hideToolTip();
        });
        $("#WatermarkDiv").on("scroll", function(e) {
            temp.hideToolTip();
        });
    }
};

/** @description Context menu events initialization **/
Widget.prototype.initContextMenuEvent = function() {
	var comp = this.m_objecttype.toLowerCase();
	if (!IsBoolean(this.m_designMode) && IsBoolean(this.m_showcontextmenu) && (comp === "chart" || comp === "funnel" || comp === "datagrid" || comp === "scorecard")) {
		if (!IsBoolean(isTouchEnabled)) {
			var contextMenu = new ContextMenu();
			contextMenu.init(this);
			dashboardChartComponent[this.m_objectid] = contextMenu;
		} else {
			console.log("Context Menu Not enabled in Touch Devices");
		}
	}
};
/** @description Reset the width/ height of component according to scaling property  **/
Widget.prototype.initializeScaling = function() {
	this.m_width = this.chartJson.width * widthRatio;//this.m_width * widthRatio;
	this.m_height = this.chartJson.height * heightRatio; //this.m_height * heightRatio;
	
	if(this.m_left !== ''){
		this.m_x = this.chartJson.x;
	}
	if(this.m_top !== ''){
		this.m_y = this.chartJson.y;
	}

	this.m_x = this.m_x * widthRatio;
	this.m_y = this.m_y * heightRatio;
	if (IsBoolean(isTouchEnabled)) {
		this.m_showexceldownload = false;
		this.m_autotooltiphide = true;
	}
};
/** @description change width/height if dashboard type is responsive **/
Widget.prototype.initializeForBootstrap = function() {
	this.m_width = $("#draggableDiv" + this.m_objectid).width();
	this.m_height = $("#draggableDiv" + this.m_objectid).height();
};
/** @description returns the scaling ratio **/
Widget.prototype.minWHRatio = function() {
	if (!this.isMaximized) {
		if (widthRatio < heightRatio) {
			return widthRatio;
		} else if (widthRatio > heightRatio) {
			return heightRatio;
		} else {
			return heightRatio;
		}
	} else {
		return 1;
	}
};
/** @description Method returns scaled font size **/
Widget.prototype.fontScaling = function(fontSize) {
	return fontSize * this.minWHRatio();
};
/** @description properties getter setter methods **/
Widget.prototype.isChartVisible = function() {
	return this.m_isChartVisible;
};
Widget.prototype.getX = function() {
	return this.m_x;
};
Widget.prototype.setX = function(xValue) {
	this.m_x = xValue;
};
Widget.prototype.getY = function() {
	return this.m_y;
};
Widget.prototype.setY = function(yValue) {
	this.m_y = yValue;
};
Widget.prototype.getWidth = function() {
	return this.m_width;
};
Widget.prototype.setWidth = function(widthValue) {
	this.m_width = widthValue;
};
Widget.prototype.getHeight = function() {
	return this.m_height;
};
Widget.prototype.setHeight = function(heightValue) {
	this.m_height = heightValue;
};
Widget.prototype.getObjectID = function() {
	return this.m_objectid;
};
Widget.prototype.getObjectName = function() {
	return this.m_objectname;
};
Widget.prototype.getObjectType = function() {
	return this.m_objecttype;
};
Widget.prototype.getDataSource = function() {
	return this.getDataSet().getDataSource();
};
Widget.prototype.getId = function() {
	return this.getDataSet().getId();
};
/** @description deprecated methods for language mapping **/
Widget.prototype.notifyLanuageMapping = function(languageMappingOBJ) {
	this.m_languageMappingOBJ = languageMappingOBJ;
	this.drawLanguageMapping();
};
Widget.prototype.setChartState = function(state) {
	this.m_chartstate = state;
};
Widget.prototype.getChartState = function() {
	return this.m_chartstate;
};
Widget.prototype.drawLanguageMapping = function() {
	if (IsBoolean(this.m_isActive)) {
		for (var key in this.m_languageMappingOBJ.m_fieldNameValues[0]) {
			if (this.m_languageMappingOBJ.m_fieldNameValues[0].hasOwnProperty(key)) {
				for (var j = 0; j < this.m_dataset.getByDisplayNameCopy().length; j++) {
					if (key === this.m_dataset.getByDisplayNameCopy()[j]) {
						this.m_dataset.m_Fields[j]["m_displayname"] = this.m_languageMappingOBJ.m_fieldNameValues[0][key];
					}
				}
			}
		}
		this.init();
		this.drawChart();
	}
};

/** @description when response is received from connection, all the registered components will be called for drawing **/
Widget.prototype.notifyWidgetsDataUpdate = function(dataSetValueObject) {
	this.m_fieldSetValue = dataSetValueObject;
	this.m_dataStore.init(this.m_fieldSetValue, this);
	this.copyDataStoreToDataViewAndCallInitDraw();
};
Widget.prototype.copyDataStoreToDataViewAndCallInitDraw = function() {
	this.m_dataStore.init(this.m_fieldSetValue, this);
	this.copyDataStoreToDataView();
	this.callDrawInit();
};
Widget.prototype.copyDataStoreToDataView = function() {
	this.m_dataView.copyData(this.m_dataStore);
};

/** @description will call init and draw() of a component -> once draw then it will update the visibility **/
Widget.prototype.callDrawInit = function() {
	this.init();
	this.drawChart();
};
Widget.prototype.showWidget = function() {
	var temp = this;
	this.visibilityStatus = true;
	this.hideToolTip();
	$("#draggableDiv" + temp.m_objectid).css("display", "block");
	//DAS-1010 benchmark Grid not loading on hide and show component
	if ((this.m_objecttype === "datagrid" || IsBoolean(this.m_datalablebackgroundrect) || (this.m_componenttype === "knowledge_graph_chart") || (this.m_componenttype === "decomposition_chart") || (this.m_componenttype === "world_map" && this.m_svgtype === "leaflet") || (this.m_componenttype === "benchmark_analysis_chart")) && IsBoolean(this.m_isDataSetavailable)) {
		this.draw();
	}
};
Widget.prototype.hideWidget = function() {
	var temp = this;
	this.visibilityStatus = false;
	this.hideToolTip();
	/*
	 * Issue :#16477
	 * *If chart is maximized and drill occurs and
	 * in the changeScript of chart, same chart is getting hidden by method hideComponent(),
	 * then maximizeOverlayDiv still show with high z-index
	 * OR 
	 * after this step , if same component is shown with some other script method showComponent(),
	 * This chart is opening in maximize mode, then maximizeOverlayDiv is not showing.
	 * 
	 * When hiding a component and if it is in maximize state- minimize it then hide.
	 */
	if (IsBoolean(this.isMaximized)) {
		this.minimize();
	}
	$("#draggableDiv" + temp.m_objectid).css("display", "none");
};

/** @description Method is to draw the underline for labels on axis titles etc **/
Widget.prototype.underLine = function(text, x, y, color, textSize, align) {
	var textWidth = ctx.measureText(text).width;
	var startX = 0;
	var startY = y + (1 * (textSize) / 15) + 1;
	var endX = 0;
	var endY = startY;
	var underlineHeight = 1 * (textSize) / 15;

	if (underlineHeight < 1) {
		underlineHeight = 1;
	}

	ctx.beginPath();
	if (align === "center") {
		startX = x - (textWidth / 2);
		endX = x + (textWidth / 2);
	} else if (align === "right") {
		startX = x - textWidth;
		endX = x;
	} else {
		startX = x;
		endX = x + textWidth;
	}

	ctx.strokeStyle = color;
	ctx.lineWidth = underlineHeight;
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.stroke();
};
/** @description check whether the mouse cursor is inside the dashboard -> used in frameworkController **/
Widget.prototype.isMouseInWidget = function(mouseX, mouseY) {
	var height = this.m_height;
	if (this.m_objecttype !== "rectangle" &&
		mouseX >= this.m_x && mouseX <= (this.m_x * 1) + (this.m_width * 1) &&
		mouseY >= this.m_y && mouseY <= (this.m_y * 1) + (height * 1) &&
		this.isChartVisible() && IsBoolean(this.m_isActive)) {
		return true;
	}
	return false;
};

Widget.prototype.getShowcheckboxwithlegend = function() {
	// overridden in sub classes
};

Widget.prototype.drawObject = function() {
	this.callDrawInit();
};

/** @description Component div has to be repositioned when maximized or minimized **/
Widget.prototype.RePositionDraggableDiv = function() {
	var temp = this;
	var margin = 10;
	this.draggableCanvas = $("#draggableCanvas" + temp.m_objectid);
	this.draggableDiv = $("#draggableDiv" + temp.m_objectid);

	if (IsBoolean(this.isMaximized)) {
		this.updateMaximizeOverlayDivCSS(this.maximizeZindex, 100, 100);
		var legendMargin = this.getLegendMargin(this.m_width * 1 - margin * 2);
		this.draggableDiv.css({
			"left": this.m_x + margin + "px",
			"top": this.m_y + margin + "px",
			"width": this.m_width - margin * 2 - legendMargin.right + "px",
			"height": this.m_height - margin * 2 - legendMargin.bottom + "px"
		});

		this.draggableCanvas.attr("width", this.m_width - margin * 2 - legendMargin.right);
		this.draggableCanvas.attr("height", this.m_height - margin * 2 - legendMargin.bottom);
		this.draggableCanvas.css({
			"width": this.m_width - margin * 2 - legendMargin.right,
			"height": this.m_height - margin * 2 - legendMargin.bottom
		});
		this.adjustPixelRatio();
		this.m_width = this.m_width - margin * 2 - legendMargin.right;
		this.m_height = this.m_height - margin * 2 - legendMargin.bottom;
	} else {
		this.updateMaximizeOverlayDivCSS(0, 0, 0);
		this.draggableDiv.css({
			"left": this.m_x * 1 + "px",
			"top": this.m_y * 1 + "px",
			"width": this.oldm_width + "px",
			"height": this.oldm_height + "px"
		});

		this.draggableCanvas.attr("width", this.oldm_width);
		this.draggableCanvas.attr("height", this.oldm_height);
		this.draggableCanvas.css({
			"width": this.oldm_width,
			"height": this.oldm_height
		});

		this.adjustPixelRatio();

		this.m_x = 0;
		this.m_y = 0;
	}
};
/** @description overlay divisions z-index updation method **/
Widget.prototype.updateMaximizeOverlayDivCSS = function(zIndex, h, w) {
	if ($("#maximizeOverlayDiv")) {
		$("#maximizeOverlayDiv").css({
			"z-index" : zIndex,
			"height" : h + "%",
			"width" : w + "%"
		});
	}
};
Widget.prototype.getChartObjectByReferenceId = function (id) {
	if (this.m_dashboard && this.m_dashboard.m_widgetsArray != undefined) {
		for (var i = 0; i < this.m_dashboard.m_widgetsArray.length; i++) {
			if (id == this.m_dashboard.m_widgetsArray[i].m_referenceid)
				return this.m_dashboard.m_widgetsArray[i];
		}
	}
};
Widget.prototype.getChartObjectById = function (id) {
	if (this.m_dashboard && this.m_dashboard.m_widgetsArray != undefined) {
		for (var i = 0; i < this.m_dashboard.m_widgetsArray.length; i++) {
			if (id == this.m_dashboard.m_widgetsArray[i].m_objectid){
				return this.m_dashboard.m_widgetsArray[i];
			}
		}
	}
};

Widget.prototype.getRepeaterChartObjectById = function (id) {
	var parentObj = this.getChartObjectById(id);
	if(parentObj && parentObj.isValidRepeaterConfig()){
		for (var j = 0; j < parentObj.m_repeaterCharts.length; j++) {
			if( IsBoolean(parentObj.m_repeaterCharts[j].m_isRepeaterPart) && parentObj.m_repeaterCharts[j].m_objectid == this.m_associatedrepeaterchartid){
				return parentObj.m_repeaterCharts[j];
			}
		}
	}
	return parentObj;
};
Widget.prototype.isValidRepeaterConfig = function() {
	return (!IsBoolean(this.m_designMode) && IsBoolean(this.m_isrepeater) && this.m_repeaterfield !== "" && IsBoolean(this.getRepeaterChartType(this.m_type).SupportRepeater));
};
Widget.prototype.getRepeaterChartType = function(chartType) {
	var map = {
		"Area": {
			"chart": "AreaChart",
			"SupportRepeater": true
		},
		"Bar": {
			"chart": "BarChart",
			"SupportRepeater": true
		},
		"BoxPlot": {
			"chart": "BoxPlotChart",
			"SupportRepeater": true
		},
		"Bubble": {
			"chart": "BubbleChart",
			"SupportRepeater": true
		},
		"CandleStick": {
			"chart": "CandleStickChart",
			"SupportRepeater": true
		},
		"Chevron": {
			"chart": "ChevronChart",
			"SupportRepeater": true
		},
		"Circumplex": {
			"chart": "CircumplexChart",
			"SupportRepeater": true
		},
		"Column": {
			"chart": "ColumnStackChart",
			"SupportRepeater": true
		},
		"DecisionTree": {
			"chart": "DecisionTreeChart",
			"SupportRepeater": true
		},
		"GroupBar": {
			"chart": "GroupBarChart",
			"SupportRepeater": true
		},
		"GroupColumn": {
			"chart": "GroupColumnChart",
			"SupportRepeater": true
		},
		"HeatMap": {
			"chart": "HeatMapChart",
			"SupportRepeater": true
		},
		"InvertedFunnel": {
			"chart": "InvertedFunnelChart",
			"SupportRepeater": true
		},
		"Line": {
			"chart": "LineChart",
			"SupportRepeater": true
		},
		"Mixed": {
			"chart": "MixedChart",
			"SupportRepeater": true
		},
		"Pie": {
			"chart": "PieChart",
			"SupportRepeater": true
		},
		"Progress": {
			"chart": "ProgressChart",
			"SupportRepeater": false
		},
		"Pyramid": {
			"chart": "PyramidChart",
			"SupportRepeater": true
		},
		"RoadMap": {
			"chart": "RoadMapChart",
			"SupportRepeater": true
		},
		"Plot": {
			"chart": "ScatteredPlotChart",
			"SupportRepeater": true
		},
		"SentimentHeatMap": {
			"chart": "SentimentHeatMapChart",
			"SupportRepeater": true
		},
		"SentimentPlot": {
			"chart": "SentimentPlotChart",
			"SupportRepeater": true
		},
		"Funnel": {
			"chart": "SimpleFunnelChart",
			"SupportRepeater": true
		},
		"Spider": {
			"chart": "SpiderChart",
			"SupportRepeater": true
		},
		"SVGLine": {
			"chart": "SVGLineChart",
			"SupportRepeater": true
		},
		"TimeArea": {
			"chart": "TimeAreaChart",
			"SupportRepeater": true
		},
		"TimeColumnStack": {
			"chart": "TimeColumnStackChart",
			"SupportRepeater": true
		},
		"Timeline": {
			"chart": "TimelineChart",
			"SupportRepeater": true
		},
		"TreeMap": {
			"chart": "TreeMapChart",
			"SupportRepeater": true
		},
		"Trellis": {
			"chart": "TrellisChart",
			"SupportRepeater": false
		},
		"WordCloud": {
			"chart": "WordCloudChart",
			"SupportRepeater": true
		},
		"WorldMap": {
			"chart": "WorldMapChart",
			"SupportRepeater": true
		},
		"default": {
			"SupportRepeater": false
		}
	};
	return map.hasOwnProperty(chartType) ? map[chartType] : map["default"];
};

/** returns the dataset object for given component id **/
Widget.prototype.getDatasetObjectById = function(component) {
	var chart = this.getChartObjectById(component);
	if (chart) {
		if (chart.m_datasetid != "") {
			for (var i = 0; i < this.m_dashboard.m_dataSetsArray.length; i++) {
				if (this.m_dashboard.m_dataSetsArray[i].m_id == chart.m_datasetid) {
					return this.m_dashboard.m_dataSetsArray[i];
				}
			}
		} else {
			console.log(component + " does not have Dataset");
		}
	} else {
		console.log(component + " is Not Available in Dashboard");
	}
};
/** @description when chart is maximized -> associated legend has to draw on right side or bottom of the chart **/
Widget.prototype.getLegendMargin = function(extendedWidth) {
	if (this.m_associatedlegendid !== "" && this.m_associatedlegendid !== undefined) {
		var obj = this.getLegendComponentObj();
		if (obj !== undefined) {
			try {
				var legendMargin = obj.getLegendMargins(extendedWidth);
				return {
					bottom: legendMargin.bottom,
					right: legendMargin.right
				};
			} catch (e) {
				console.log("error in legend component drawing");
			}
		} else {
			return {
				bottom: 0,
				right: 0
			};
		}
	} else {
		return {
			bottom: 0,
			right: 0
		};
	}
};
/** @description called when clicked on maximize icon of component **/
Widget.prototype.maximize = function() {
	if (!IsBoolean(this.m_isEmptySeries)) {
		/** check series is empty or not. if chart has no data then we are not going under maximize process because maximize is update z-index **/
		var temp = this;
		this.m_timer = 1;
		/** timer for fiter in datagrid **/
		this.oldm_x = this.m_x;
		this.oldm_y = this.m_y;
		this.oldm_width = this.m_width;
		this.oldm_height = this.m_height;

		var draggableDiv = $("#draggableDiv" + temp.m_objectid);
		this.oldoffset_left = $(draggableDiv)[0].offsetLeft;
		this.oldoffset_top = $(draggableDiv)[0].offsetTop;
		this.oldzindex = $(draggableDiv).css("z-index");
		this.maximizeZindex = (this.m_dashboard !== "") ? (this.m_dashboard.m_widgetsArray.length) * 1 + 3 : this.m_zIndex;

		$(draggableDiv).css("z-index", this.maximizeZindex);
		this.isMaximized = true;
		var parentDivWidth = $(".draggablesParentDiv")[0] ? $(".draggablesParentDiv")[0].clientWidth : $(draggableDiv).parent().width();
		var parentDivHeight = $(".draggablesParentDiv")[0] ? $(".draggablesParentDiv")[0].clientHeight : $(draggableDiv).parent().height();
		var browserWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var browserHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		if (!temp.m_bootstrap) {
			if (IsBoolean(this.m_isRepeaterPart)) {
				this.m_width = (parentDivWidth > browserWidth) ? browserWidth : parentDivWidth;
				this.m_height = (parentDivHeight > browserHeight) ? browserHeight : parentDivHeight;
				$(temp.m_chartContainer).css({
					"left": "0px",
					"top": "0px",
					"height": this.m_height + "px",
					"width": this.m_width + "px",
					"position": "absolute",
					"z-index": this.maximizeZindex
				});
				for (var k = 0; k < this.m_siblingIds.length; k++) {
					if (this.m_siblingIds[k] != temp.m_objectid) {
						$("#draggableDiv" + this.m_siblingIds[k]).css("display", "none");
					}

				}
			} else {
				this.m_x = 0;
				this.m_y = 0;
				this.m_width = (parentDivWidth > browserWidth) ? browserWidth : parentDivWidth;
				this.m_height = (parentDivHeight > browserHeight) ? browserHeight : parentDivHeight;
			}
			this.maximizeScrollUpadte();
		} else {
			this.m_width = $(".draggablesParentDiv")[0] ? $(".draggablesParentDiv")[0].clientWidth : $(draggableDiv).parent().width();
			this.m_height = $(".draggablesParentDiv")[0] ? $(".draggablesParentDiv")[0].clientHeight : $(draggableDiv).parent().height();
			$(temp.m_chartContainer).css({
				"left": "0px",
				"top": "0px",
				"height": this.m_height + "px",
				"width": this.m_width + "px",
				"position": "absolute",
				"z-index": this.maximizeZindex
			});
		}
		this.m_slideronmaxmize = true;
		this.hideToolTip();
		if (!IsBoolean(this.m_isEmptySeries)) {
			this.RePositionDraggableDiv();
			this.timeLineSliderFlag = false;
			if (this.m_objecttype === "chart" || this.m_objecttype === "funnel" || this.m_objecttype === "datagrid" || this.m_objecttype === "scorecard") {
				var legendObj = this.getLegendComponentObj();
				if (legendObj !== undefined) {
					legendObj.checkboxChangedFlag = false;
					this.setChartState("maximized");
					this.m_legendFlag = true;
				}
			}
			this.init();
			this.drawChart();
			if(this.m_onafterrendercallback!=""){
				onAfterRender(this.m_onafterrendercallback);
			}
		}
	}
};
/** @description minimize method resets the default coordinates and size of component **/
Widget.prototype.minimize = function() {
	var temp = this;
	this.m_timer = 1;
	/** timer for filter in data grid **/
	this.m_x = this.oldoffset_left;
	this.m_y = this.oldoffset_top;
	this.m_width = this.oldm_width;
	this.m_height = this.oldm_height;

	$("#dg1").remove();
	$("#HierchDG1").remove();
	var draggableDiv = $("#draggableDiv" + temp.m_objectid);
	$(draggableDiv).css("z-index", this.oldzindex);

	if (!temp.m_bootstrap) {
		this.minimizeScrollUpadte();
		$(draggableDiv)[0].offsetLeft = this.oldoffset_left;
		$(draggableDiv)[0].offsetTop = this.oldoffset_top;
		if (IsBoolean(this.m_isRepeaterPart)) {
			$(temp.m_chartContainer).css({
				"left": this.m_parentleft + "px",
				"top": this.m_parenttop + "px",
				"height": this.m_parentObj.m_height + "px",
				"width": this.m_parentObj.m_width + "px",
				"position": "absolute",
				"z-index": this.oldzindex
			});

			for (var k = 0; k < this.m_siblingIds.length; k++) {
				$("#draggableDiv" + this.m_siblingIds[k]).css({
					"display": "block",
					"z-index": this.oldzindex
				});
			}
		}
	} else {
		$(draggableDiv)[0].offsetLeft = this.oldoffset_left;
		$(draggableDiv)[0].offsetTop = this.oldoffset_top;
		$(temp.m_chartContainer).css({
			"left": this.oldoffset_left + "px",
			"top": this.oldoffset_top + "px",
			"height": this.m_height + "px",
			"width": this.m_width + "px",
			"position": "absolute",
			"z-index": this.oldzindex
		});
	}

	this.isMaximized = false;
	this.isGrid = false;
	this.m_slideronmaxmize = true;
	$("#gridIconImage" + temp.m_objectid).remove();

	this.hideToolTip();
	if (!IsBoolean(this.m_isEmptySeries)) {
		this.RePositionDraggableDiv();
		this.timeLineSliderFlag = false;
		if (this.m_objecttype === "chart" || this.m_objecttype === "funnel" || this.m_objecttype === "datagrid" || this.m_objecttype == "scorecard") {
			var legendObj = this.getLegendComponentObj();
			if (legendObj !== undefined) {
				legendObj.checkboxChangedFlag = false;
				this.setChartState("minimized");
				this.m_legendFlag = true;
			}
		}
		this.init();
		this.drawChart();
		if(this.m_onafterrendercallback!=""){
			onAfterRender(this.m_onafterrendercallback);
		}
	}
};
/** @description update scroll position of component parent div when maximize component**/
Widget.prototype.maximizeScrollUpadte = function() {
	this.scrollPositions = {};
	$(".draggablesParentDiv").css("overflow", "hidden");
	if (navigator.userAgent.match(/(iPad|iPhone)/g) ? true : false) {
		$(".draggablesParentDiv").removeClass("iPhoneScrollBar");
	}
	/** Added for on maximize comp all scroll should be hidden after maximize the component*/
	if (dGlobals.layoutType != "AbsoluteLayout") {
		$(".draggablesParentDiv").removeClass("mobileViewCSS");
	}
	/** chart breaking when draw standalone in other modules **/
if(div){
		div.setAttribute('style', 'overflow:hidden !important');
	}
	this.scrollPositions.top = $(window).scrollTop();
	this.scrollPositions.left = $(window).scrollLeft();
	this.scrollPositions.parentTop = $(".draggablesParentDiv").scrollTop();
	this.scrollPositions.parentLeft = $(".draggablesParentDiv").scrollLeft();
	this.scrollPositions.watermarkDivTop = $("#WatermarkDiv").scrollTop();
	this.scrollPositions.watermarkDivLeft = $("#WatermarkDiv").scrollLeft();
	/** Don't change the below js css applying format bcz jquery css applying format will not work in this case */
	var div = document.getElementById("WatermarkDiv");
	div.setAttribute('style', 'overflow:hidden !important');
	$("#WatermarkDiv").css("position", "absolute");
	window.scroll(0, 0);
	if($(".draggablesParentDiv")[0]){
		$(".draggablesParentDiv")[0].scrollLeft = 0;
		$(".draggablesParentDiv")[0].scrollTop = 0;
	}
	if($("#WatermarkDiv")[0]){
		$("#WatermarkDiv")[0].scrollTop = 0;
		$("#WatermarkDiv")[0].scrollLeft = 0;
	}
};
/** @description reset scroll position of component parent div when minimize component**/
Widget.prototype.minimizeScrollUpadte = function() {
   $(".draggablesParentDiv").css("overflow", "auto");
    /** chart breaking when draw standalone in other modules **/
    if(div){
		div.setAttribute('style', 'overflow:visible !important');
	}
	if (navigator.userAgent.match(/(iPad|iPhone)/g) ? true : false) {
		$(".draggablesParentDiv").addClass("iPhoneScrollBar");
	}
	/** Added for on maximize comp all scroll should be work before maximize comp*/
	if (dGlobals.layoutType != "AbsoluteLayout") {
		$(".draggablesParentDiv").addClass("mobileViewCSS");
	}
	$("#WatermarkDiv").css("position", "");
	/** Don't change the below js css applying format bcz jquery css applying format will not work in this case */
	var div = document.getElementById("WatermarkDiv");
	div.setAttribute('style', 'overflow:visible !important');
	window.scroll(this.scrollPositions.left,this.scrollPositions.top);
	if($(".draggablesParentDiv")[0]){
		$(".draggablesParentDiv")[0].scrollTop = this.scrollPositions.parentTop;
		$(".draggablesParentDiv")[0].scrollLeft = this.scrollPositions.parentLeft;
	}
	if($("#WatermarkDiv")[0]){
		$("#WatermarkDiv")[0].scrollTop = this.scrollPositions.watermarkDivTop;
		$("#WatermarkDiv")[0].scrollLeft = this.scrollPositions.watermarkDivLeft;
	}
};
/** @description used to draw the icons of maximize-minimize **/
Widget.prototype.drawFontIcons = function(id, src, x, y, fontClass, fontSize) {/**added svg icons fro maximize and minimize**/
    if (fontClass.split('-')[0] !== "bd") {
        var temp = this;
        var div = document.createElement("span");
        $("#" + id + "" + temp.m_objectid).remove();
        div.setAttribute("id", id + "" + temp.m_objectid);
        var imageWidth = 24;
        var imageHeight = 24;
        div.style.top = (y - 2) + "px";
        div.style.left = (x * 1) - 11 + "px";
        div.style.zIndex = this.m_zIndex;
        div.style.position = "absolute";
        div.style.cursor = "pointer";
        div.style.width = imageWidth * this.minWHRatio() + "px";
        div.style.height = imageHeight * heightRatio + "px";

        var img = fontClass;
        try {
            var str = img;
            var svg = $.parseHTML(str);
            $(svg).attr("id", "svgImg" + temp.m_objectid);
            $(svg).css("opacity", this.m_opacity);
            $(div).append(svg);
            $(div).html(svg);
            $("#draggableDiv" + temp.m_objectid).append(div);
            return div;
        } catch (e) {
            console.log(e);
            console.log("Invalid SVG Image");
        }
    } else {
        /**Below method is overridden by above so commented**/
        var temp = this;
        $("#" + id + temp.m_objectid).remove();
        var span = document.createElement("span");
        span.setAttribute("id", id + "" + temp.m_objectid);
        span.setAttribute("class", id + " " + fontClass);
        span.style.position = "absolute";
        span.style.cursor = "pointer";
        span.style.fontSize = ((fontSize) ? fontSize : 16) + "px";
        span.style.color = convertColorToHex(this.getTitle().getFontColor());
        var imageWidth = 20;
        var imageHeight = 20;
        span.style.top = (y - 2) + "px";
        //DAS-564 Added to support legend when slider is enabled 
        if(this.m_showslider){
	        span.style.right = (this.m_sliderheightratio*7)+ "px";
	        //span.style.left = (((x * 1) - 11)-40)+ "px";
		}else{
	        span.style.left = (x * 1) - 11 + "px";			
		}        
		span.style.zIndex = this.m_zIndex;
        span.style.width = imageWidth * this.minWHRatio() + "px";
        span.style.height = imageHeight * heightRatio + "px";
        $("#draggableDiv" + temp.m_objectid).append(span);
        return span;
    }
};
/** @description Deprecated method used to draw the maximize-minimize image **/
Widget.prototype.drawImageIcons = function(id, src, x, y) {
	var temp = this;
	$("#" + id + temp.m_objectid).remove();
	var image = document.createElement("img");
	image.setAttribute("id", id + "" + temp.m_objectid);
	image.setAttribute("class", "minmaxImage");
	image.style.position = "absolute";
	var imageWidth = 20;
	var imageHeight = 20;
	image.style.top = y + "px";
	image.style.left = x + "px";
	image.style.width = imageWidth * this.minWHRatio() + "px";
	image.style.height = imageHeight * heightRatio + "px";
	image.src = src;
	$("#draggableDiv" + temp.m_objectid).append(image);
	return image;
};

Widget.prototype.setCursorStyle = function(type) {
	if(type == "pointer"){
		$("#draggableDiv" + this.m_objectid).addClass("cursor-hand");
	}else{
		$("#draggableDiv" + this.m_objectid).removeClass("cursor-hand");
	}
};
Widget.prototype.hideToolTip = function() {
	this.setCursorStyle("default");
	this.removeToolTipDiv();
	this.removeMobileToolTipDiv();
};
Widget.prototype.removeToolTipDiv = function() {
	if(IsBoolean(this.m_tooltipremove)){
		$("#toolTipDiv").remove();
	}
};
Widget.prototype.removeMobileToolTipDiv = function() {
	$("#mobileTooltipContent").remove();
};
/** Default tooltip styles for single value componens **/
Widget.prototype.getTooltipStyles = function() {
	var temp = this;
	//"border-radius": temp.m_tooltipborderradius + "px"
	//"box-shadow": "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
	return {
		"font-family": selectGlobalFont(temp.m_defaultfontfamily),
		"font-size": temp.m_tooltipfontsize + "px",
		"background-color": hex2rgb(convertColorToHex(temp.m_tooltipbackgroundcolor), temp.m_tooltipbackgroundtransparency),
		"border": temp.m_tooltipborderwidth + "px solid " + temp.m_tooltipbordercolor,
		"border-radius": "8px", 
		"color": temp.m_tooltipfontcolor,
		"width": (temp.m_customtooltipwidth !== "auto") ? (temp.m_customtooltipwidth + "px") : "auto",
		"padding": "24px", 
		"position": "absolute",
		"z-index": "10000",
		"text-align":temp.m_tooltiptextalign,
		"box-shadow": "0 8px 16px 0 rgba(0, 0, 0, 0.12)", 
		"-moz-box-shadow": "0 8px 16px 0 rgba(0, 0, 0, 0.12)", 
		"-webkit-box-shadow": "0 8px 16px 0 rgba(0, 0, 0, 0.12)"
	};
};

Widget.prototype.drawTooltip = function(mouseX, mouseY) {
	if ((IsBoolean(this.m_isDataSetavailable) && !this.m_designMode) &&
		this.m_objecttype !== "filter" && !IsBoolean(this.m_isEmptySeries) &&
		IsBoolean(this.m_isActive)) {

		var chart_data = this.getToolTipData(mouseX, mouseY);
		if (chart_data !== "") {
			var tooltipContent = "";
			for (var i = 0; i < chart_data.length; i++) {
				tooltipContent += chart_data[i] + "<br>";
			}
			this.getToolTip(tooltipContent);
		} else {
			this.hideToolTip();
		}
	}
};

Widget.prototype.updateToolTipInfo = function(msg) {
	var textWidthDiv = document.createElement("div");
	textWidthDiv.id = "textWidthDiv";
	textWidthDiv.style.position = "absolute";
	textWidthDiv.style.float = "left";
	textWidthDiv.style.whiteSpace = "nowrap";
	textWidthDiv.style.visibility = "hidden";
	textWidthDiv.style.font = "12px " + selectGlobalFont(this.m_defaultfontfamily);
	$("body").append(textWidthDiv);

	var splitMsg = msg.split(" ");
	var widthlength = 144;
	var newstr = "";
	for (var j = 0; j < splitMsg.length; j++) {
		var res = splitMsg[j].split("");
		var count = 0;
		var str = "";
		var w = 0;
		for (var i = 0; i < res.length; i++) {
			if (widthlength > w) {
				str = str + res[i];
				$("#textWidthDiv").css({
					"font": "12px " + selectGlobalFont(this.m_defaultfontfamily)
				});
				$("#textWidthDiv").html("" + str);
				w = $("#textWidthDiv").width();
			} else {
				count++;
				break;
			}
		}
		if (count !== 0)
			newstr = newstr + str + ".. ";
		else
			newstr = newstr + splitMsg[j] + " ";
	}
	$("#textWidthDiv").remove();
	return newstr;
};

/** getter-setter methods **/

/** @description placeholder method for category colors for grids **/
Widget.prototype.getCategoryColors = function() {
	return;
};

Widget.prototype.setTargetValue = function() {
	// overridden in child classes (i.e. bullet, gauge etc.)
};
/**@description stores a copy of dataprovider to the chart **/
Widget.prototype.setDataProvider = function(m_dataProvider) {
	this.m_dataProvider = getDuplicateArray(m_dataProvider);
};
/**@description sets the series fields to true/false when associated with legend component by default **/
Widget.prototype.setLegendsIntialLoad = function(defaultSelectedFields) {
	if(this.m_defaultlegendfields && !IsBoolean(this.m_designMode)) {
		for (var i = 0; i < defaultSelectedFields.length; i++) {
	        this.m_seriesVisibleArr[defaultSelectedFields[i].key] = defaultSelectedFields[i].value;
		}
	}
};
Widget.prototype.setDataPointToUpdate = function() {
	// overridden in child classes
};
Widget.prototype.getFieldsJson = function() {
	return this.m_fieldsJson;
};
Widget.prototype.getGlobalKey = function() {
	return this.m_globalkey;
};
Widget.prototype.getDataSetId = function() {
	return this.m_datasetid;
};
Widget.prototype.setDataSetId = function(m_datasetid) {
	this.m_datasetid = m_datasetid;
};
Widget.prototype.getDataSourceId = function() {
	return this.m_datasource;
};
Widget.prototype.setDataSourceId = function(m_datasource) {
	this.m_datasource = m_datasource;
};
Widget.prototype.getFieldNameValueMap = function() {
	return this.fieldNameValueMap;
};
Widget.prototype.setFieldNameValueMap = function(fieldNameValueMap) {
	this.fieldNameValueMap = fieldNameValueMap;
};
Widget.prototype.getDrillColor = function() {
	return this.drillColor;
};
Widget.prototype.setDrillColor = function(drillColor) {
	this.drillColor = drillColor;
};
/** Method will create the configuration and saves it the AuditTrail **/
Widget.prototype.setAuditTrail = function(fieldNameValueMap) {
	if(IsBoolean(this.m_enableaudit)){
		var auditConfig = {key: "", request: {}};
		auditConfig.key = "drill_event";
		auditConfig.request.chartId = this.m_referenceid;
		try{
			var dObj = getDuplicateObject(fieldNameValueMap);
			delete dObj.drillComponent;
			auditConfig.request.drillOnPoint = dObj;
			if(this.m_dashboard !== ""){
				auditConfig.request.dashboardId = this.m_dashboard.m_id;
				auditConfig.request.publishDocId = this.m_dashboard.m_dashboardjson.Niv.Dashboard.versionDetails.publishDocId;
				var dp = findInArray(this.m_dashboard.m_DataProviders.m_dataurl, "m_id", this.getDatasetObjectById(this.m_objectid).m_datasource);
				auditConfig.request.dataSource = {};
				if(dp.m_typespecifier == "csv" || dp.m_typespecifier == "excel" || dp.m_typespecifier == "derived" || dp.m_typespecifier == "ws"){
					auditConfig.request.dataSource.dataSourceType = dp.m_typespecifier;	
				} else {
					if(dp.m_typespecifier == "web"){
						auditConfig.request.dataSource.dataSourceType = dp.m_datasourcetype;
						auditConfig.request.dataSource.dataSourceId = dp.m_selecteddatasourceid;
						auditConfig.request.dataSource.dataSourceName = dp.m_datasourcename;					
					}
					/** for dp.m_typespecifier == "ds" or "web" or "pa"**/
					auditConfig.request.dataSource.dataServiceId = dp.m_selectedserviceid;
					auditConfig.request.dataSource.dataServiceName = dp.m_queryname;
				}
			}
		}catch(e){
			console.log(e);
		}
		this.saveAudit(auditConfig);
	}
};
Widget.prototype.saveAudit = function(auditConfig) {
    var
    REQ_URL = req_url.designer.saveAudit,
    REQ_DATA = {
        "data": JSON.stringify({
        	"audit": auditConfig.key,
        	"request": auditConfig.request
        })
    },
    requestSuccessFn = function(complete, success) {
//    	complete = getDecryptedResponse(complete);
//    	console.log(complete);
    	//alertPopUpModal({type:'success', message:'Audit has been saved', timeout: '3000'});
    },
    requestFailedFn = function(data, success) {
    	//alertPopUpModal({type:'error', message:'Failed to save audit', timeout: '3000'});
    };
    
	this.webServiceCall(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
};
/** will get the drill data points of component and proceed to update global variable **/
Widget.prototype.getDataPointAndUpdateGlobalVariable = function(mouseX, mouseY) {
	var map = this.getDrillDataPoints(mouseX, mouseY);
	this.updateDataPointsToGV(map);
};
/**  placeholder method to prevent error on click **/
Widget.prototype.getDrillDataPoints = function(mouseX, mouseY) {
	/** Overridden in child classes **/
};
/** @description getter setter methods of objects **/
Widget.prototype.getTitle = function() {
	/** Overridden in child class **/
};
/** @description Method is being called directly for TreeMap, WordCloud and DecisionTree **/
Widget.prototype.updateDataPointsToGV = function(map) {
	if (map) {
		var drillRecordMap = {};
		/** Add current component reference to drill object to access in script **/
		drillRecordMap.drillComponent = this;
		/** Pass the copy of drill Record to prevent Circular reference in dashboard JSON **/
		for (var key in map.drillRecord) {
			drillRecordMap[key] = map.drillRecord[key];
		}
		this.updateDataPoints(drillRecordMap, map.drillColor);
	}
};
/** @description update the GV and call the call back if given **/
Widget.prototype.updateDataPoints = function(fieldNameValueMap, drillColor) {
	if (!IsBoolean(this.m_designMode)) {
		this.setFieldNameValueMap(fieldNameValueMap);
		this.setDrillColor(drillColor);
		this.setAuditTrail(fieldNameValueMap);
		if (this.getGlobalKey() !== "" && this.getGlobalKey() !== undefined && gvController !== undefined) {
			gvController.updateGlobalVariable(this, fieldNameValueMap, drillColor);
		}

		/** This code below will be used to initiate callback method from outside the framework (i.e Story/OTMS/Survey/Predictive) **/
		var component = this;
		if (this.m_clickcallback !== "" && this.m_clickcallback !== undefined) {
			var data = {
				"value": fieldNameValueMap,
				"color": drillColor,
				"component": component
			};
			try {
				eval(component.m_clickcallback + "(data)");
			} catch (e) {
				console.log(e);
			}
		}
	}
};
/** @description Common method -> being used in child classes **/
Widget.prototype.getDataFromJSON = function(fieldName) {
	var data = [];
	for (var i = 0; i < this.getDataProvider().length; i++) {
		if (this.getDataProvider()[i][fieldName] === undefined || this.getDataProvider()[i][fieldName] === "undefined")
			data[i] = "";
		else
			data[i] = this.getDataProvider()[i][fieldName];
	}
	return data;
};
Widget.prototype.getValidFieldDataFromRecord = function(record, field) {
	return (record[field] !== undefined && record[field] !== "undefined") ? record[field] : "";
};
Widget.prototype.getValidAltFieldDataFromRecord = function(record, field, altField) {
	if (record[field] !== undefined && record[field] !== "undefined")
		return this.getValidFieldDataFromRecord(record, field);
	else
		return this.getValidFieldDataFromRecord(record, altField);
};
/** @description method to parse all attributes of json object to node object
 * @param {Object} jsonObject
 * @param {Object} nodeObject
 * **/
Widget.prototype.parseSubJsonAttributes = function(jsonObject, nodeObject) {
	for (var key in jsonObject) {
		this.setAttributesValue(jsonObject, nodeObject, key);
	}
};
/** @description method to set an attributes of json object to node object
 * @param {Object} jsonObject
 * @param {Object} nodeObject
 * **/
Widget.prototype.setAttributesValue = function(jsonObject, nodeObject, key) {
	var propertyName = this.getNodeAttributeName(key);
	nodeObject[propertyName] = jsonObject[key];
};
Widget.prototype.getNodeAttributeName = function(key) {
	return "m_" + (key.toLowerCase().replace("__", "").replace("_", ""));
};
Widget.prototype.setAttributeValueToNode = function(key, jsonObject, nodeObject) {
	var propertyName = this.getNodeAttributeName(key);
	if (key.toLowerCase() === "globalkey") {
		/** #16549 - Document Migration Issue **/
		if (this.m_globalkey && this.m_globalkey !== "" && this.m_globalkey !== "none") {
			/** Do Nothing **/
		} else {
			/** Set the Value **/
			nodeObject[propertyName] = jsonObject[key];
		}
	} else {
		nodeObject[propertyName] = jsonObject[key];
	}
};
Widget.prototype.getProperAttributeNameValue = function(json, name) {
	for (var key in json) {
		if (key.replace("__", "").replace("_", "") === name) {
			return json[key];
		}
	}
};
Widget.prototype.getArrayOfSingleLengthJson = function(json) {
	if ($.isArray(json)) {
		return json;
	} else {
		return [json];
	}
};
Widget.prototype.formattedDescription = function(m_chart, m_description) {
	var str = m_description;
	if (!IsBoolean(m_chart.m_designMode) && m_chart.m_dashboard && m_chart.m_dashboard.getGlobalVariable() && m_chart.m_dashboard.getGlobalVariable() !== "") {
		try{
			str = m_chart.getValueFromLanguageMap(str);
			var re = /\[(.*?)\]/g;
			for (var m = re.exec(m_description); m; m = re.exec(m_description)) {
				var val = (m[1].indexOf(".") !== -1) ? m_chart.m_dashboard.getGlobalVariable().getFieldValue(m[1]) : m[0];
				str = str.replace(m[0], val);
			}
		}catch(e){
			console.log(e);
			return m_description;
		}
	}
	return str;
};
/** Gets the value from languageMapping object **/
Widget.prototype.getValueFromLanguageMap = function(m_description) {
	var str = m_description;
	try{
		/** Exception handling for use of charting library in other modules **/
		if(dGlobals && dGlobals.langMap && IsBoolean(dGlobals.langMap.isEnabled)){
			var re = /\{(.*?)\}/g;
			for (var m = re.exec(m_description); m; m = re.exec(m_description)) {
				if (m[1].indexOf(".") === -1) {
					if(dGlobals.langMap.data.hasOwnProperty(m[1])) {
						str = str.replace(m[0], dGlobals.langMap.data[m[1]]);
					} else if(IsBoolean(dGlobals.langMap.hideBrackets)) {
						str = str.replace(m[0], m[1]);
					} else {
						// Do nothing
					}
				}
			}
		}
	}catch(e){
		console.log(e);
	}
	return str;
};
/** @description method for getting dynamic values for single values component **/
Widget.prototype.getValueFromGlobalVariable = function(text, bracket, convertToNumeric) {
	var str = text;
	str = this.getValueFromLanguageMap(str);
	if (this.m_dashboard !== "" && this.m_dashboard.getGlobalVariable() !== "") {
		var re = (bracket === "curly") ? /\{(.*?)\}/g : /\[(.*?)\]/g;
		for (var match = re.exec(text); match; match = re.exec(text)) {
			if (match.length > 1) {
				var globalVarValue = this.m_dashboard.getGlobalVariable().getFieldValue(match[1]);
				globalVarValue = (convertToNumeric && globalVarValue === undefined) ? 0 : globalVarValue;
				str = str.replace(match[0], globalVarValue);
			}
		}
	}
	return str;
};
/** set the flag status while parsing for single valued components **/
Widget.prototype.SetIsVirtualDataSetAvailable = function() {
	this.m_isVirtualDataSetavailable = false;
	if (this.m_virtualdataid !== "" && this.m_virtualdatafield !== "" && this.m_datarownumber !== "") {
		this.m_isVirtualDataSetavailable = true;
	}
};

/** @description dynamic Alert **/
Widget.prototype.valueValidation = function(val) {
	return (val !== undefined &&  (("" + val).length !== 0) && !isNaN(getNumericComparableValue(val)) ) ? true : false ;
};

/** @description create canvas for picking the color**/
Widget.prototype.createCanvasForDynamicRangeAlert = function() {
	$("#intermediateCanvas" + this.m_objectid).remove();
	for (var key in this.getAlertObj()) {
		if (this.getAlertObj()[key].m_mode === "Range") { // && IsBoolean(this.getAlertObj()[key].getDynamicRange())
			this.createCanvas();
			break;
		}
	}
};
/** @description canvas Creation**/
Widget.prototype.createCanvas = function() {
	var temp = this;
	var canvas = document.createElement("canvas");
	canvas.id = "intermediateCanvas" + this.m_objectid;
	canvas.width = this.m_width;
	canvas.height = this.m_height;
	canvas.style.display = "none";
	$("#draggableDiv" + temp.m_objectid).append(canvas);
	var context = $("#intermediateCanvas" + temp.m_objectid)[0].getContext("2d");
	this.adjustPixelRatioForCanvas(canvas, context);
};
Widget.prototype.setShowLoaderIcon = function(m_showloaderbutton) {
	this.m_showloaderbutton = m_showloaderbutton;
};
/** @description method wil set this variable true/false if chart is resized or not to prevent multiple time datarid drawing **/
Widget.prototype.setIsResizedInDesigner = function(m_isResizedInDesigner) {
	this.m_isResizedInDesigner = m_isResizedInDesigner;
};
/** @description this method can be overridden in dashboard script to apply customized css fro datagrids **/
Widget.prototype.applyAdditionalStyles = function() {
	//Called from datagrid's setCSS() 
};
/** @description this method will return title bar height with font scaling for maximize icon and titlebarheight **/
Widget.prototype.getTitleBarHeight = function() {
	return this.fontScaling(this.getTitle().m_titlebarheight);
};
/** Returns X coordinate value for max/min icon**/
Widget.prototype.getXpoint = function() {
	var x = this.m_width - this.fontScaling(25);
	return x;
};
/** Returns right margin value for max/min icon's tooltip**/
Widget.prototype.getRightMargin = function() {
	var right =  this.fontScaling(30) + "px";
	return right;
};

/** @description method will call webservice **/
Widget.prototype.webServiceCall = function(url, reqData, cb, ecb) {
    reqData["token"] = parent.BIZVIZ.SDK.getAuthInfo().authToken;
    reqData["spacekey"] = parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey;
    reqData["userid"] = parent.BIZVIZ.SDK.getAuthInfo().user.id

    makeSecureRequest({
        url: base_url + url,
        method: "POST",
        formData: reqData,
        params: {
            headers: {
                authtoken: parent.BIZVIZ.SDK.getAuthInfo().authToken,
                spacekey: encryptText(parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey),
                userid: encryptText(parent.BIZVIZ.SDK.getAuthInfo().user.id)
            },
        }
    }, cb, ecb);
};

/** @description widget method for exporting multiple/selected components in png **/
Widget.prototype.setCustomExport = function (array) {
	this.plugin = new Plugin();
	this.plugin.exportToCustomScreenShot(array, this);
};

/** @description widget method for group components in export pdf**/
Widget.prototype.setCustomExportPdf = function (array, array1) {
	this.plugin = new Plugin();
	this.plugin.exportToCustomPDF(array, this, array1);
};

/** @description Component context menu initialization **/
var currentSelectedContextMenu = "";
var contextMenuTimeOutArray = [];
(function($, window) {
	$.fn.chartingContextMenu = function(config) {
		var level = 0;
		return this.each(function() {
			$(this).off("contextmenu").on("contextmenu", function(event) {
				event.preventDefault();
				event.stopPropagation();
				dashboardChartComponent[event.currentTarget.id.replace("draggableDiv", "")].createContextMenu();
				//	$( event.target ).trigger( "click" );
				if (config.tree !== undefined) {
					var node = $(config.tree).fancytree("getActiveNode");
					if (node !== null) {
						level = node.getLevel();
					}
				}
				$(currentSelectedContextMenu).hide();
				currentSelectedContextMenu = config.menuSelector[level];
				$(config.menuSelector[level]).data("invokedOn", $(config.menuSelector[level]).show().css({
					"position": "absolute",
					"left": getLeft(event),
					"top": getTop(event)
				}));
				chartingContextMenuClickHandler();
				$(document).click(function() {
					$(config.menuSelector[level]).hide();
				});

				clearAllTimeOut();
				var tout = setTimeout(function() {
					$(config.menuSelector[level]).hide();
				}, 5000);
				contextMenuTimeOutArray.push(tout);
				return false;
			});

			function chartingContextMenuClickHandler() {
				$(config.menuSelector[level]).off("click").on("click", function(event) {
					$(this).hide();
					var $invokedOn = $(this).data("invokedOn");
					var $selectedMenu = $(event.target);
					clearAllTimeOut();
					contextMenuTimeOutArray = [];
					config.menuSelected.call($(this), $invokedOn, $selectedMenu);
				});
			}

			function clearAllTimeOut() {
				for (var i = 0; i < contextMenuTimeOutArray.length; i++) {
					clearTimeout(contextMenuTimeOutArray[i]);
				}
				contextMenuTimeOutArray = [];
			}
		});

		function getLeft(event) {
			var
				mouseX = event.pageX,
				pageWidth = $(config.containment).width(),
				menuWidth = $(config.menuSelector[level]).width();
			if (mouseX + menuWidth > pageWidth && mouseX > menuWidth) {
				return mouseX - menuWidth;
			} else {
				return mouseX;
			}
		}

		function getTop(event) {
			var
				mouseY = event.pageY,
				pageHeight = $(config.containment).height(),
				menuHeight = $(config.menuSelector[level]).height();
			if (mouseY + menuHeight > pageHeight && mouseY > menuHeight) {
				return mouseY - menuHeight - 10;
			} else {
				return mouseY;
			}
		}
	};
})($, window);

/** @description Context menu class for creation and controlling **/
function ContextMenu() {
	this.component = "";
};
ContextMenu.prototype.init = function(component) {
	this.component = component;
	this.componentContextMenuEventHandler();
};
ContextMenu.prototype.initContextMenuData = function() {
	var temp = this;
	var contextMenuData = {
		chart: []
	};
	/*if (IsBoolean(temp.component.m_exporttoexcel)) {
		if(temp.component.m_excelexportext == "xlsx") {
		contextMenuData.chart.push(temp.component.m_exportmenus.exportToExcel);
		} else if(temp.component.m_excelexportext == "tsv") {
			contextMenuData.chart.push(temp.component.m_exportmenus.exportToTSV);
		} else {
			contextMenuData.chart.push(temp.component.m_exportmenus.exportToCSV);
		}
		contextMenuData.chart.push(temp.component.m_exportmenus.exportToExcel);
	}*/
	if (IsBoolean(temp.component.m_exporttoexcel)) {
		contextMenuData.chart.push(temp.component.m_exportmenus.exportToExcel);
	}
	if (IsBoolean(temp.component.m_exporttocsv)) {
		if(temp.component.m_excelexportext == "csv") {
			contextMenuData.chart.push(temp.component.m_exportmenus.exportToCSV);
		}else if(temp.component.m_excelexportext == "tsv") {
			contextMenuData.chart.push(temp.component.m_exportmenus.exportToTSV);
		} else {
			//
		}
	}	
	if (IsBoolean(temp.component.m_exporttojpeg)) {
		contextMenuData.chart.push(temp.component.m_exportmenus.exportToJPEG);
	}
	if (IsBoolean(temp.component.m_exporttopng)) {
		contextMenuData.chart.push(temp.component.m_exportmenus.exportToPNG);
	}
	if (IsBoolean(temp.component.m_exporttopdf)) {
		contextMenuData.chart.push(temp.component.m_exportmenus.exportToPDF);
	}
	if (IsBoolean(temp.component.m_exporttoppt)) {
		contextMenuData.chart.push(temp.component.m_exportmenus.exportToPPT);
	}
	if (IsBoolean(temp.component.m_exporttoprint)) {
		contextMenuData.chart.push(temp.component.m_exportmenus.exportToPrint);
	}
	if (IsBoolean(temp.component.m_exporttogrid)) {
		contextMenuData.chart.push(temp.component.m_exportmenus.exportToGrid);
	}

	return contextMenuData;
};
ContextMenu.prototype.createContextMenu = function() {
	var temp = this;
	var contextMenuData = temp.initContextMenuData();
	var jsonData = contextMenuData;
	var content = "";
	$.each(jsonData, function(key, value) {
		content += "<ul id=\"" + key + "ContextMenu\" class=\"dropdown-menu-context-menu\" style='font-family:"+selectGlobalFont(temp.component.m_defaultfontfamily)+";' role=\"menu\">";
		for (var i = 0; i < value.length; i++) {
			if (value[i].iconPath !== "NA") {
				var cmID = "";
				var cmPath = "";
				var cmValue = "";
				for(var key1 in value[i]) {
					if(value[i].hasOwnProperty(key1)){
						if(key1 !== "iconPath" && value[i][key1] !== ""){
							cmID = key1;
							cmValue = value[i][key1];
						}else if(key1 == "iconPath" && value[i][key1] !== ""){
							cmPath = value[i][key1];
						}else{
							// Do nothing
						}
					}
				}
				content += "<li id=\"" + cmID + "\"><span id=\"" + cmID + "\" class='" +cmPath + "'></span><a id=\"" + cmID + "\" href=\"#\">" + cmValue + "</a></li>";
			} else {
				content += "<li class=\"divider\"></li>";
			}
		}
		content += "</ul>";
	});
	$(".dropdown-menu-context-menu").remove();
	if (!temp.component.m_designMode) {
		$("body").append(content);
	}
	if(temp.component !== undefined){
		temp.component.hideToolTip();
	}
};
/** @description Handles the context menu event **/
ContextMenu.prototype.componentContextMenuEventHandler = function() {
    var temp = this;
    var optionId = null;
    $("#draggableDiv" + temp.component.m_objectid).on("mouseenter", function(event) {
        temp.component.hideToolTip();
        event.stopPropagation();
        $(this).chartingContextMenu({
            menuSelector: ["#chartContextMenu"],
            menuSelected: function(x, y, z) {
                //optionId = y[0].context.id;
                optionId = y[0].id;
                if (temp.component.plugin.component !== "") {
                    switch (optionId) {
                        case "exportToExcel":
                            temp.component.plugin.exportToExcel();
                            break;
                        case "exportToCSV":
                            temp.component.plugin.exportToCSV();
                            break;
                        case "exportToJPEG":
                            temp.component.plugin.exportToJPEG();
                            break;
                        case "exportToPNG":
                            temp.component.plugin.exportToPNG();
                            break;
                        case "exportToPDF":
                            temp.component.plugin.exportToPDF();
                            break;
                        case "exportToPPT":
                            temp.component.plugin.exportToPPT();
                            break;
                        case "exportToPrint":
                            temp.component.plugin.exportToPrint();
                            break;
                        case "showData":
                            if (temp.component !== undefined) {
                                temp.component.hideToolTip();
                                if (temp.component.getAllFieldsName() !== undefined) {
                                    if ((temp.component.getAllFieldsName()).length > 0) {
                                        temp.component.plugin.showData();
                                    }
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        });
    });
};

/** @description ChartFrame class for drawing the border around component **/
function ChartFrame() {
	this.m_x;
	this.m_y;
	this.m_width;
	this.m_height;
	this.m_bordercolor;
	this.m_borderradius;
	this.m_borderthickness;
	this.m_bgGradientColors = [];
	this.gradientCoords = [];
	this.ctx = "";
	this.m_titleBarHeight = 30;
};
ChartFrame.prototype.init = function(chartRef) {
	this.m_chart = chartRef;
	this.ctx = this.m_chart.ctx;
	this.m_x = this.m_chart.m_x;
	this.m_y = this.m_chart.m_y;
	this.m_width = this.m_chart.m_width;
	this.m_height = this.m_chart.m_height;
	this.m_bordercolor = convertColorToHex(this.m_chart.m_bordercolor || "#BDC3C7");
	this.m_borderradius = this.m_chart.m_borderradius || 1;
	this.m_borderthickness = this.m_chart.m_borderthickness || 1;

	if (this.m_chart.getBgGradients() === undefined || this.m_chart.getBgGradients() === "") {
		this.m_chart.m_bggradients = "#FFFFFF";
	}

	if (this.m_chart.getBgGradients() !== undefined) {
		this.showBackgroundGradientColor(this.m_chart.getBgGradients(), this.m_chart.m_bgalpha, this.m_chart.m_bggradientrotation);
	}

	if (IsBoolean(this.m_chart.isMaximized) && this.m_chart.m_bgalpha === 0) {
		this.showBackgroundGradientColor(this.m_chart.m_dashboard.m_AbsoluteLayout.m_gradients, 1, this.m_chart.m_dashboard.m_AbsoluteLayout.m_bggradientrotation);
	} else if (IsBoolean(this.m_chart.isMaximized)) {
		this.showBackgroundGradientColor(this.m_chart.getBgGradients(), this.m_chart.m_bgalpha, this.m_chart.m_bggradientrotation);
	} else {
		// Do nothing
	}
};
ChartFrame.prototype.showBackgroundGradientColor = function(gradientColors,
	colorAlpha, rotation) {
	if (this.m_chart.m_canvastype == "svg") {
	    this.showBackgroundGradientColorForSvg(gradientColors, colorAlpha, rotation);
	} else {
	    this.m_bgGradientColors = gradientColors.split(",");
	    for (var i = 0; i < this.m_bgGradientColors.length; i++) {
	        var hexColor = convertColorToHex(this.m_bgGradientColors[i]);
	        this.m_bgGradientColors[i] = hex2rgb(hexColor, colorAlpha);
	    }
	    this.gradientCoords = this.calculateGradientCoordinates(rotation);
	}
};
ChartFrame.prototype.showBackgroundGradientColorForSvg = function(gradientColors,
		colorAlpha, rotation) {
	var temp = this.m_chart;
    $("#" + temp.svgContainerId).empty();
    var linearGradient = document.createElementNS(NS, "linearGradient");
    linearGradient.setAttribute("id", "gradient" + temp.m_objectid);
    linearGradient.setAttribute("gradientTransform", "rotate(" + temp.m_bggradientrotation + ")");
    $("#" + temp.svgContainerId).append(linearGradient);
    var colors = gradientColors.split(",");
    var step = (100 / (((colors.length - 1) !== 0) ? (colors.length - 1) : 1));
    for (var i = 0, Length = colors.length; i <= (Length - 1); i++) {
        var stop = document.createElementNS(NS, "stop");
        stop.setAttribute("offset", (i * step) + "%");
        stop.setAttribute("stop-color", (hex2rgb(convertColorToHex(colors[i]), colorAlpha)));
        stop.setAttribute("stop-opacity", colorAlpha);
        $(linearGradient).append(stop);
    }
};
ChartFrame.prototype.getBackgroundGradient = function() {
	var grd = this.ctx.createLinearGradient(this.gradientCoords[0],
		this.gradientCoords[1], this.gradientCoords[2], this.gradientCoords[3]);
	for (var i = 0; i < this.m_bgGradientColors.length; i++) {
		var color = this.m_bgGradientColors[i];
		var colorStop = i / (this.m_bgGradientColors.length - 1 * (this.m_bgGradientColors.length > 1 ? 1 : 0));
		grd.addColorStop(colorStop, color);
	}
	return grd;
};
ChartFrame.prototype.calculateGradientCoordinates = function(bgGradientAngle) {
	var gradientCoords = [];
	var x1 = this.m_chart.m_x;
	var y1 = this.m_chart.m_y;
	var x2 = this.m_chart.m_width;
	var y2 = this.m_chart.m_y;
	var sinAngle;
	var angle = (bgGradientAngle > 0) ? bgGradientAngle : (bgGradientAngle % 360) * 1 + 360;
	if (angle >= 0 && angle <= 45) {
		sinAngle = angle - 0;
		x1 = this.m_chart.m_x;
		y1 = this.m_chart.m_y;
		x2 = this.m_x * 1 + this.m_chart.m_width * 1;
		y2 = this.m_chart.m_y * 1 + this.m_chart.m_height * 1 * Math.sin(sinAngle * Math.PI / 180 * 2);
	} else if (angle > 45 && angle <= 90) {
		sinAngle = angle - 45;
		x1 = this.m_chart.m_x;
		y1 = this.m_chart.m_y;
		x2 = this.m_chart.m_x * 1 + this.m_chart.m_width * 1 -
			this.m_chart.m_width * 1 * Math.sin(sinAngle * Math.PI / 180 * 2);
		y2 = this.m_chart.m_height;
	} else if (angle > 90 && angle <= 135) {
		sinAngle = angle - 90;
		x1 = this.m_chart.m_x * 1 + this.m_width * 1 * Math.sin(sinAngle * Math.PI / 180 * 2);
		y1 = this.m_chart.m_y;
		x2 = this.m_chart.m_x;
		y2 = this.m_chart.m_height;
	} else if (angle > 135 && angle <= 180) {
		sinAngle = angle - 135;
		x1 = this.m_chart.m_width;
		y1 = this.m_chart.m_y;
		x2 = this.m_chart.m_x;
		y2 = this.m_chart.m_y * 1 + this.m_chart.m_height * 1 -
			this.m_chart.m_height * 1 * Math.sin(sinAngle * Math.PI / 180 * 2);
	} else if (angle > 180 && angle <= 225) {
		sinAngle = angle - 180;
		x1 = this.m_chart.m_width;
		y1 = this.m_chart.m_y * 1 + this.m_height * Math.sin(sinAngle * Math.PI / 180 * 2);
		x2 = this.m_chart.m_x;
		y2 = this.m_chart.m_y;
	} else if (angle > 225 && angle <= 270) {
		sinAngle = angle - 225;
		x1 = this.m_chart.m_x * 1 + this.m_chart.m_width * 1 -
			this.m_width * 1 * Math.sin(sinAngle * Math.PI / 180 * 2);
		y1 = this.m_chart.m_y * 1 + this.m_chart.m_height * 1;
		x2 = this.m_chart.m_x;
		y2 = this.m_chart.m_y;
	} else if (angle > 270 && angle <= 325) {
		sinAngle = angle - 270;
		x1 = this.m_chart.m_x;
		y1 = this.m_chart.m_y * 1 + this.m_chart.m_height * 1;
		x2 = this.m_chart.m_x * 1 + this.m_width * Math.sin(sinAngle * Math.PI / 180 * 2);
		y2 = this.m_chart.m_y;
	} else if (angle > 325 && angle <= 360) {
		sinAngle = angle - 325;
		x1 = this.m_chart.m_x;
		y1 = this.m_chart.m_y * 1 + this.m_chart.m_height * 1 -
			this.m_chart.m_height * Math.sin(sinAngle * Math.PI / 180 * 2);
		x2 = this.m_chart.m_x * 1 + this.m_chart.m_width * 1;
		y2 = this.m_chart.m_y * 1;
	} else {
		// Do nothing
	}
	gradientCoords[0] = x1;
	gradientCoords[1] = y1;
	gradientCoords[2] = x2;
	gradientCoords[3] = y2;
	return gradientCoords;
};
ChartFrame.prototype.drawFrame = function() {
	var temp = this;
	this.ctx.clearRect(this.m_x, this.m_y, this.m_width, this.m_height);
	if (IsBoolean(this.m_chart.m_roundedframe)) {
		this.drawRoundedFrame(this.m_x, this.m_y, this.m_width, this.m_height, 4);
	} else {
		this.ctx.beginPath();
		/**Added for KPI tile to make canvas background color transparent*/
		this.ctx.fillStyle = (this.m_chart.m_componenttype === "kpi_tile") ? "transparent" : this.getBackgroundGradient();		this.ctx.rect(this.m_x * 1, this.m_y * 1, this.m_width * 1, this.m_height * 1);
		this.ctx.fill();
		if (IsBoolean(this.m_chart.m_showborder)) {
			this.ctx.strokeStyle = this.m_bordercolor;
			this.ctx.lineWidth = this.m_borderthickness;
			//this.ctx.stroke();
			//using css border instead of canvas lineWidth for uniform border for all components and overlapping with titlebox issue
			$("#draggableDiv" + temp.m_chart.m_objectid).css("border", ""+this.m_borderthickness + "px"+" solid "+temp.m_bordercolor+"");
			var draggableDiv = document.getElementById("draggableDiv" + this.m_chart.m_objectid);
			draggableDiv.style.borderRadius = this.m_borderradius + "px";
		} else {
		    $("#draggableDiv" + temp.m_chart.m_objectid).css('border', '');
		}
		this.ctx.closePath();

		/** for RoadMapChart 2nd canvas background color. **/
		if (this.m_chart.m_type === "roadmap") {
			var height = $("#draggableCanvasForRoadMapSeries" +
				temp.m_chart.m_objectid)[0].height;
			this.m_chart.ctxForRoadMapSeries.beginPath();
			this.m_chart.ctxForRoadMapSeries.fillStyle = this
				.getBackgroundGradient();
			this.m_chart.ctxForRoadMapSeries.strokeStyle = "#BDC3C7";
			this.m_chart.ctxForRoadMapSeries.rect(this.m_x * 1 + 1,
				this.m_y * 1 + 1, this.m_width * 1 - 2, height * 1);
			this.m_chart.ctxForRoadMapSeries.fill();
			if (IsBoolean(this.m_showborder)) {
				this.ctxForRoadMapSeries.lineWidth = "1";
				this.ctxForRoadMapSeries.stroke();
			}
			this.m_chart.ctxForRoadMapSeries.closePath();
		}
	}
	// this.titleShadow();
};
ChartFrame.prototype.titleShadow = function() {
	this.ctx.beginPath();
	this.ctx.fillStyle = this.getBackgroundGradient();
	this.ctx.strokeStyle = "#000000";
	this.ctx.save();
	this.ctx.rect(this.m_chart.m_x * 1 + 2, this.m_chart.m_y * 1 + 1,
		this.m_chart.m_width * 1 - 4, this.m_titleBarHeight);
	this.ctx.shadowColor = "#ccc";
	this.ctx.shadowBlur = 3;
	this.ctx.shadowOffsetX = 0;
	this.ctx.shadowOffsetY = 3;
	this.ctx.fill();
	this.ctx.restore();
};
ChartFrame.prototype.drawRoundedFrame = function(x, y, w, h, radius) {
	var r = (x * 1) + ((w - 1) * 1);
	var b = (y * 1) + (h * 1);
	this.ctx.beginPath();
	this.ctx.fillStyle = "#fff";
	this.ctx.strokeStyle = "#b9d3b8";
	this.ctx.lineWidth = "8";
	this.ctx.moveTo((x * 1) + (radius * 1), y);
	this.ctx.lineTo(r - radius, y);
	this.ctx.quadraticCurveTo(r, y, r, (y * 1) + (radius * 1));
	this.ctx.lineTo(r, (y * 1) + (h * 1) - radius);
	this.ctx.quadraticCurveTo(r, b, r - radius, b);
	this.ctx.lineTo((x * 1) + (radius * 1), b);
	this.ctx.quadraticCurveTo(x, b, x, b - radius);
	this.ctx.lineTo(x, (y * 1) + (radius * 1));
	this.ctx.quadraticCurveTo(x, y, (x * 1) + (radius * 1), y);
	this.ctx.stroke();
	this.ctx.fill();
	this.ctx.closePath();
};
ChartFrame.prototype.drawSVGFrame = function() {
	var temp = this.m_chart;
	if (IsBoolean(this.m_chart.m_showborder)) {
		$("#draggableDiv" + this.m_chart.m_objectid).css({
			"border": ""+this.m_chart.m_borderthickness+"px solid "+this.m_chart.m_bordercolor+"",
			"border-radius": this.m_chart.m_borderradius + "px"
		});
	}
	var rect = drawSVGRect(0, 0, this.m_width, this.m_height , "");
	$(rect).attr("id", "GradientRect" + temp.m_objectid);
	$(rect).attr("fill", "url(#gradient" + temp.m_objectid + ")");
	if(temp.m_componenttype == "decisiontree_chart") {
		$(rect).attr("style", "width:inherit;height:inherit;");
	}
	if(temp.m_componenttype != "decomposition_chart")
	   $("#" + temp.svgContainerId).append(rect);
};

/** @description Class to show the dataset data into a grid through context menu option **/
function ShowChartData(chart) {
	this.m_chart = chart;
	this.m_titlebarheight = 30;
	this.m_sidemargin = 10;
	this.m_fontsize = 12;
	this.m_fontfamily = selectGlobalFont(this.m_chart.m_defaultfontfamily);
	this.m_fontweight = "normal";
	this.m_fontstyle = "normal";
};
ShowChartData.prototype.createGridContainer = function() {
	var temp = this;
	var w,h;
	if(IsBoolean(this.m_chart.m_isRepeaterPart)){
		w = $(this.m_chart.m_chartContainer).parent().width();
		h = $(this.m_chart.m_chartContainer).parent().height();
	}else{
		w = $(this.m_chart.m_chartContainer).width();
		h = $(this.m_chart.m_chartContainer).height();
	}
	var wWidth = (w < $(window).width()) ? w : $(window).width();
	var wHeight = (h < $(window).height()) ? h : $(window).height();
	/** Set minimum height width for show data grid **/
	var tw = (wWidth < this.m_chart.m_width ) ? (wWidth - this.m_sidemargin*2) : (this.m_chart.m_width < this.m_chart.m_showdatagridminwidth ? this.m_chart.m_showdatagridminwidth : this.m_chart.m_width);
	var th = (wHeight < this.m_chart.m_height) ? (wHeight - this.m_sidemargin*2 - this.m_titlebarheight) : ((this.m_chart.m_height < this.m_chart.m_showdatagridminheight) ? (this.m_chart.m_showdatagridminheight - this.m_titlebarheight) : (this.m_chart.m_height - this.m_titlebarheight));

	$(".contextMenuShowDataDiv").remove();
	var contextMenuShowDataDiv = document.createElement("div");
	contextMenuShowDataDiv.setAttribute("id", "contextMenuShowDataDiv");
	contextMenuShowDataDiv.setAttribute("class", "contextMenuShowDataDiv");
	contextMenuShowDataDiv.style.top = (wHeight < this.m_chart.m_height) ? (this.m_sidemargin +"px")  : (wHeight * 1 / 2 - this.m_chart.m_height * 1 / 2) + "px";
	contextMenuShowDataDiv.style.left = (wWidth < this.m_chart.m_width ) ? (this.m_sidemargin + "px") : (wWidth * 1 / 2 - this.m_chart.m_width * 1 / 2) + "px"
	contextMenuShowDataDiv.style.width = tw + "px";
	contextMenuShowDataDiv.style.height = (wHeight < this.m_chart.m_height) ? (wHeight - this.m_sidemargin*2) : ((this.m_chart.m_height < this.m_chart.m_showdatagridminheight) ? (this.m_chart.m_showdatagridminheight) : (this.m_chart.m_height)) + "px"
	contextMenuShowDataDiv.style.fontFamily = this.m_fontfamily;
	$(".draggablesParentDiv").append(contextMenuShowDataDiv);

	var contextMenuShowDataDivHeader = document.createElement("div");
	contextMenuShowDataDivHeader.setAttribute("class", "contextMenuShowDataDivHeader");
	contextMenuShowDataDivHeader.style.height = this.m_titlebarheight + "px";
	$(contextMenuShowDataDiv).append(contextMenuShowDataDivHeader);
	
	var titleSpan = document.createElement("span");
	titleSpan.setAttribute("class", "contextMenuShowDataDivTitle");
	titleSpan.style.fontSize = this.m_chart.fontScaling(this.m_fontsize) + "px";
	try{
		var titleText= ""; 
		titleText = this.m_chart.formattedDescription(this.m_chart, this.m_chart.m_title.getDescription());
		titleText = titleText.split("\n").join(" ").split("<br>").join(" ");
		titleSpan.innerHTML = titleText;
	}catch(e){
		console.log(e);
	}
	$(contextMenuShowDataDivHeader).append(titleSpan);
	
	var anchor = document.createElement("span");
	anchor.setAttribute("class", "contextMenuShowDataDivClose");
	$(contextMenuShowDataDivHeader).append(anchor);
	
	var anchorIcon = document.createElement("span");
	anchorIcon.setAttribute("class", "contextMenuShowDataClose icon bd-close");
	//anchorIcon.setAttribute("title", "Close");
	$(anchorIcon).on("mouseenter", function(e){
		//$(this).css({"color": "#000000"});
		temp.m_chart.removeToolTipDiv();
		var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_chart.m_dashboard.m_id);
		var scrollLeft =  parentDiv.scrollLeft;
		var scrollTop =  parentDiv.scrollTop;
		var offset = $(parentDiv).offset();
		var PageTop =  offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
		var PageLeft = offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft; 
		var offsetLeft = $(this)[0].offsetLeft;
		var offsetTop = $(this)[0].offsetTop;
		var divTop = e.pageY - e.offsetY- PageTop + offsetTop + 18;
		var divLeft = e.pageX - PageLeft - offsetLeft + 25;
		var browserWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		
		var tooltipDiv = document.createElement("div");
		tooltipDiv.innerHTML = "Close";
		tooltipDiv.setAttribute("id", "toolTipDiv");
		tooltipDiv.setAttribute("class", "settingIcon");
		tooltipDiv.setAttribute("placement", "bottom");
		$(".draggablesParentDiv").append(tooltipDiv);
		
		var tooltipObjCss = $.extend(temp.m_chart.getTooltipStyles(), {
			"top": divTop + "px",
			"left": divLeft + "px"
		});
		tooltipObjCss["background-color"] = temp.m_chart.m_showdatatooltipcolor;
		tooltipObjCss["width"] = "auto";
		tooltipObjCss["color"] = temp.m_chart.m_showdatatooltiptextcolor;
		tooltipObjCss["border"] = temp.m_chart.m_showdatatooltipborder;
		tooltipObjCss["font-size"] = temp.m_chart.m_showdatatooltipfontsize;
		$(tooltipDiv).css(tooltipObjCss);
		var wd = tooltipDiv.offsetWidth * 1;
		ht = tooltipDiv.offsetHeight * 1;
		var lt = e.pageX - e.offsetX - PageLeft - (wd/2) - 4 + "px";
		if(e.pageX - e.offsetX - PageLeft - (wd/2) - 4 + wd > browserWidth){
			lt = e.pageX - e.offsetX - PageLeft - (wd) - 4 + 20 + "px";
			tooltipDiv.setAttribute("placement", "bottom-right");
		}
		
			$(tooltipDiv).css("left",lt);
			$(tooltipDiv).css("box-shadow","0 5px 15px -5px rgb(0 0 0 / 50%)");
	}).on("mouseleave", function(){
		//$(this).css({"color": convertColorToHex(temp.m_menupanelfontcolor)});
		temp.m_chart.removeToolTipDiv();
	});
	$(anchor).append(anchorIcon);

	temp.m_chart.maximizeScrollUpadte();
	
	if(detectDevice.mobile() || detectDevice.tablet()) {
		anchor.addEventListener("touchstart", function(event) {
			temp.m_chart.minimizeScrollUpadte();
			if(temp.m_chart.isMaximized){
				temp.m_chart.maximizeScrollUpadte();
			}
			$(".contextMenuShowDataDiv").remove();
			$(".PopDisableDiv").remove();
		}, false);
	} else {
		anchor.onclick = function() {
			temp.m_chart.hideToolTip();
			temp.m_chart.minimizeScrollUpadte();
			if(temp.m_chart.isMaximized){
				temp.m_chart.maximizeScrollUpadte();
			}
			$(".contextMenuShowDataDiv").remove();
			$(".PopDisableDiv").remove();
			/** Reset viewport body overflow*/
			if(dGlobals.layoutType == "AbsoluteLayout") {
				$(".ui-mobile-viewport").css("overflow", ""); 
			}
		}
	}
	
	var tableObj = document.createElement("table");
	tableObj.setAttribute("id", "contextMenuShowDataTable");
	tableObj.setAttribute("class", "contextMenuShowDataTable");
	tableObj.style.width = tw + "px";
	tableObj.style.height = th + "px";
	tableObj.style.top = this.m_titlebarheight + "px";
	contextMenuShowDataDiv.appendChild(tableObj);
};
ShowChartData.prototype.createPopupDisableDiv = function() {
	var popDisableDiv = document.createElement("div");
	popDisableDiv.setAttribute("class", "PopDisableDiv");
	$(".draggablesParentDiv").append(popDisableDiv);
	/** To hide viewport body overflow**/
	if(dGlobals.layoutType == "AbsoluteLayout") {
		$(".ui-mobile-viewport").css("overflow", "hidden");
	}
};
ShowChartData.prototype.drawChart = function() {
	var temp = this;
	$(".PopDisableDiv").remove();
	this.createPopupDisableDiv();
	this.createGridContainer();
	var columnHeads = this.getColumnHeads();
	var Tabledata = this.getTableData(columnHeads.columnNames);

	jqEasyUI("#contextMenuShowDataTable").datagrid({
		columns: [columnHeads.columnHeads],
		data: Tabledata,
		autoRowHeight: false,
		singleSelect: true,
		collapsible: true,
		rownumbers: false,
		remoteSort: false,
		fitColumns: true,
		striped: true,
		nowrap: true,
		loadMsg: "",
		loading: false,
		loaded: false,
		onClickRow: function() {
			temp.setGridCSS();
		},
		onSortColumn: function() {
			temp.setGridCSS();
		},
        onAfterRender: function(data) {
        	temp.setGridCSS();
        }
	});
};
ShowChartData.prototype.getColumnHeads = function() {
	this.m_colHeadersFieldName = [];
	this.m_colHeadersFieldDisplayName = [];
	var type = this.m_chart.getType();
	var fieldJson = this.m_chart.getFieldsJson();
	var fields = [];
	switch (type) {
		case "Plot":
			for (var i = 0; i < fieldJson.length; i++) {
				fields.push({
					"Name": fieldJson[i].Name,
					"DisplayName": fieldJson[i].Name
				});
				fields.push({
					"Name": fieldJson[i].OtherField,
					"DisplayName": fieldJson[i].OtherField
				});
			}
			return this.createColumnHead(this.getUniqueFromArray(fields));
		case "SentimentPlot":
			for (var i1 = 0; i1 < fieldJson.length; i1++) {
				fields.push({
					"Name": fieldJson[i1].Name,
					"DisplayName": fieldJson[i1].Name
				});
				fields.push({
					"Name": fieldJson[i1].OtherField,
					"DisplayName": fieldJson[i1].OtherField
				});
				fields.push({
					"Name": fieldJson[i1].ColorField,
					"DisplayName": fieldJson[i1].ColorFieldDisplayName
				});
				fields.push({
					"Name": fieldJson[i1].PlotRadius,
					"DisplayName": fieldJson[i1].PlotRadius
				});
				var tooltipFields = fieldJson[i1].ToolTip.split(",");
				for (var j = 0; j < tooltipFields.length; j++)
					fields.push({
						"Name": tooltipFields[j],
						"DisplayName": tooltipFields[j]
					});
			}
			return this.createColumnHead(this.getUniqueFromArray(fields));
		case "datagrid":
			for (var i2 = 0; i2 < fieldJson.length; i2++) {
				if (IsBoolean(fieldJson[i2].visible))
					fields.push({
						"Name": fieldJson[i2].Name,
						"DisplayName": fieldJson[i2].displayname
					});
			}
			return this.createColumnHeadGrid(fields);
		case "scorecard":
			for (var i2 = 0; i2 < fieldJson.length; i2++) {
				if (IsBoolean(fieldJson[i2].visible))
					fields.push({
						"Name": fieldJson[i2].Name,
						"DisplayName": fieldJson[i2].DisplayName
					});
			}
			return this.createColumnHeadGrid(fields);
		case "filter":
			for (var i3 = 0; i3 < fieldJson.length; i3++) {
				fields.push({
					"Name": fieldJson[i3].Name,
					"DisplayName": fieldJson[i3].DisplayName
				});
			}
			return this.createColumnHead(fields);
		default:
			for (var i4 = 0; i4 < fieldJson.length; i4++) {
				if (IsBoolean(fieldJson[i4].visible)) {
					fields.push({
						"Name": fieldJson[i4].Name,
						"DisplayName": fieldJson[i4].DisplayName
					});
				}
			}
			return this.createColumnHead(fields);
	}
};
ShowChartData.prototype.createColumnHead = function(fields) {
	var columnHeads = [];
	var columnNames = [];
	for (var i = 0; i < fields.length; i++) {
		columnNames.push({
			field: fields[i].Name
		});
		columnHeads.push({
			field: getStringARSC(fields[i].Name),
			title: fields[i].DisplayName,
			width: 100,
			halign: "center",
			sortable: false
		});
	}
	return {
		columnHeads: columnHeads,
		columnNames: columnNames
	};
};
/**DAS-1022 */
ShowChartData.prototype.createColumnHeadGrid = function(fields) {
	var columnHeads = [];
	var columnNames = [];
	for (var i = 0; i < fields.length; i++) {
		columnNames.push({
			field: fields[i].Name
		});
		columnHeads.push({
			field: fields[i].Name,
			title: fields[i].DisplayName,
			width: 100,
			halign: "center",
			sortable: false
		});
	}
	return {
		columnHeads: columnHeads,
		columnNames: columnNames
	};
};
ShowChartData.prototype.getUniqueFromArray = function(data) {
	var outputArray = [];
	for (var i = 0; i < data.length; i++) {
		if (($.inArray(data[i]["Name"], outputArray)) === -1) {
			outputArray.push(data[i]);
		}
	}
	return outputArray;
};
ShowChartData.prototype.getTableData = function(columnHeads) {
	var Tabledata = [];
	for (var j = 0; j < this.m_chart.getDataProvider().length; j++) {
		var rowdata = {};
		for (var j1 = 0,ser = 0; j1 < columnHeads.length; j1++) {
			/* Added check for showing currency formatters in showData of charts BDD-274 */
			if((this.m_chart.m_objecttype == "chart" || this.m_chart.m_objecttype == "funnel") && (this.m_chart.m_componenttype !== "word_cloud_chart" && this.m_chart.m_componenttype !== "trellis_chart")) {
				if (!_.contains(this.m_chart.m_categoryNames, columnHeads[j1].field) && this.m_chart.m_componenttype !== "scattered_plot_chart") {
				    switch (this.m_chart.m_componenttype) {
				        case "circumplex_chart":
				        case "group_column_chart":
				        case "group_bar_chart":
				            if (_.contains(this.m_chart.m_subCategoryNames, columnHeads[j1].field)) {
				                rowdata[getStringARSC(columnHeads[j1].field)] = this.m_chart.getDataProvider()[j][columnHeads[j1].field];
				            } else {
				                rowdata[getStringARSC(columnHeads[j1].field)] = this.m_chart.getFormatterForToolTip(this.m_chart.getDataProvider()[j][columnHeads[j1].field]);
				            }
				            break;
				        case "mixed_chart":
				        case "timeline_chart":
				            rowdata[getStringARSC(columnHeads[j1].field)] = this.m_chart.getLeftRightAxisFormatterForShowData(this.m_chart.getDataProvider()[j][columnHeads[j1].field], ser);
				            ser++;
				            break;
				        case "world_map":
				            rowdata[getStringARSC(columnHeads[j1].field)] = this.m_chart.getFormatterForToolTip(columnHeads[j1].field, this.m_chart.getDataProvider()[j][columnHeads[j1].field]);
				            break;
				        case "project_timeline_chart":
				        	rowdata[getStringARSC(columnHeads[j1].field)] = this.m_chart.getDataProvider()[j][columnHeads[j1].field];
				        	break;
				        case "chevron_chart":
				        	rowdata[getStringARSC(columnHeads[j1].field)] = this.m_chart.getDataProvider()[j][columnHeads[j1].field];
				        	break;
				        case "decomposition_chart":
				        	rowdata[getStringARSC(columnHeads[j1].field)] = this.m_chart.getDataProvider()[j][columnHeads[j1].field];
				        	break;
				        case "sankey_chart":
				        	rowdata[getStringARSC(columnHeads[j1].field)] = this.m_chart.getDataProvider()[j][columnHeads[j1].field];
				        	break;
				        case "knowledge_graph_chart":
				        	rowdata[getStringARSC(columnHeads[j1].field)] = this.m_chart.getDataProvider()[j][columnHeads[j1].field];
				        	break;
				        default:
				            rowdata[getStringARSC(columnHeads[j1].field)] = this.m_chart.getFormatterForToolTip(this.m_chart.getDataProvider()[j][columnHeads[j1].field]);
				            break;
				    }
				} else {
				    rowdata[getStringARSC(columnHeads[j1].field)] = this.m_chart.getDataProvider()[j][columnHeads[j1].field];
				}
			} else {
				rowdata[getStringARSC(columnHeads[j1].field)] = this.m_chart.getDataProvider()[j][columnHeads[j1].field];
			}
		}
		Tabledata.push(rowdata);
	}
	return Tabledata;
};
ShowChartData.prototype.setGridCSS = function() {
	$("#contextMenuShowDataDiv").find(".datagrid-header").css("background", "#ffffff");
	$("#contextMenuShowDataDiv").find(".datagrid-header-row").css("background", "#fafafa");
	$("#contextMenuShowDataDiv").find(".datagrid-header-row span").css({
		"color": "#000000",
		"text-transform": "capitalize",
		"font-weight": "bold",
		"font-size": this.m_chart.fontScaling(this.m_fontsize) + "px",
		"font-family": selectGlobalFont(this.m_fontfamily)
	});
	$("#contextMenuShowDataDiv").find(".datagrid").css({
		margin: "0px",
		background: "#ffffff",
		border: "none",
	    "box-shadow": "none",
    	"-webkit-box-shadow": "none"
	});
	$("#contextMenuShowDataDiv").find(".datagrid-cell").css({
		"color": "#000000",
		"font-weight": this.m_fontweight,
		"font-size": this.m_chart.fontScaling(this.m_fontsize) + "px",
		"font-family": selectGlobalFont(this.m_fontfamily),
		"font-style": this.m_fontstyle
	});
	$("#contextMenuShowDataDiv").find(".datagrid-row").css("background", "#ffffff");
	$("#contextMenuShowDataDiv").find(".datagrid-row-alt").css("background", "#fdfdfd");

	$("#contextMenuShowDataDiv").find(".datagrid-mask").css({
		"display": "none",
		"width": "0px",
		"height": "0px"
	});
	$("#contextMenuShowDataDiv").find(".datagrid-header-row").css({"height": "30px", "background": "#ffffff"});
	$("#contextMenuShowDataDiv").find(".datagrid-header-row td").css({
	    "border-bottom" :"2px solid #fdfdfd"		
	});
	$("#contextMenuShowDataDiv").find(".datagrid-row").css("height", "30px");
	$("#contextMenuShowDataDiv").find(".datagrid-header-row td").hover(
		function() {
			$(this).css("background", "#ffffff");
			$(this).find("span").css("color", "#000000");
		},
		function() {
			$(this).css("background", "#ffffff");
			$(this).find("span").css("color", "#000000");
		});
};

/** @description Tooltip class and methods to draw component Tooltip **/
function Tooltip() {
    this.m_chart;
};
Tooltip.prototype.setChart = function(m_chart) {
    this.m_chart = m_chart;
};
Tooltip.prototype.init = function(m_chart) {
    this.setChart(m_chart);
    this.m_customtextboxfortooltip = this.m_chart.m_customtextboxfortooltip;
    this.m_tooltipproperties = this.m_chart.m_tooltipproperties;
    this.m_tooltipbackgroundcolor = this.m_chart.m_tooltipbackgroundcolor;
    this.m_tooltipbackgroundtransparency = this.m_chart.m_tooltipbackgroundtransparency;
    this.m_tooltipfontsize = this.m_chart.m_tooltipfontsize;
    this.m_tooltipfontcolor = this.m_chart.m_tooltipfontcolor;    
    this.m_tooltipbordercolor = this.m_chart.m_tooltipbordercolor;
    this.m_tooltipprecision = this.m_chart.m_tooltipprecision;
    this.m_customtooltipwidth = this.m_chart.m_customtooltipwidth + (this.m_chart.m_customtooltipwidth !== "auto" ? "px" : "");
    this.m_autotooltiphide = this.m_chart.m_autotooltiphide;
	this.m_tooltiphidetimeout = this.m_chart.m_tooltiphidetimeout;
	this.m_controlledtooltip = this.m_chart.m_controlledtooltip;
	this.m_tooltiphighlighter = this.m_chart.m_tooltiphighlighter;
	this.m_fieldhighlightercolor = this.m_chart.m_fieldhighlightercolor;
	this.m_tooltipborderwidth = this.m_chart.m_tooltipborderwidth;
};
Tooltip.prototype.draw = function(toolTipData, type) {
    switch (type) {
        case "circumplex_chart":
            this.drawCircumplexToolTip(toolTipData);
            break;
        case "box_plot_chart":
            this.drawBoxPlotToolTip(toolTipData);
            break;
        case "candle_stick_chart":
            this.drawCandleStickToolTip(toolTipData);
            break;
        case "decisiontree_chart":
            this.drawDecisionTreeToolTip(toolTipData);
            break;
        case "pie_chart":
            this.drawPieChartToolTip(toolTipData);
            break;
        case "group_column_chart":
        case "group_bar_chart":
            this.drawGroupBarToolTip(toolTipData);
            break;
        case "group_column_chart":
            this.drawGroupBarToolTip(toolTipData);
            break;
        case "project_timeline_chart":
            this.drawProjectTimelineToolTip(toolTipData);
            break;
        case "sentiment_plot_chart":
            this.drawSentimentPlotToolTip(toolTipData);
            break;
        case "tree_map_chart":
            this.drawTreeMapToolTip(toolTipData);
            break;
        case "word_cloud_chart":
            this.drawWordCloudToolTip(toolTipData);
            break;
        case "scattered_plot_chart":   
            this.drawScatteredChartToolTip(toolTipData);
            break;
        case "trend":   
            this.drawTrendToolTip(toolTipData);
            break;
        case "world_map":   
            this.drawMapToolTip(toolTipData);
            break;
        default:
            this.drawDefaultChartToolTip(toolTipData);
            break;
    }
};
Tooltip.prototype.truncateString = function(str, width) {
	// Default character limit for 100px width
	var defaultWidth = 100;
	var defaultCharLimit = 25;
	if (width === 'auto') {
		width = 400; 
	} else {
		width = parseInt(width.replace('px', ''), 10);
	}
    // Calculate character limit based on custom width
    var charLimit = Math.floor((width / defaultWidth) * defaultCharLimit);

    if (str.length > charLimit) {
        return str.slice(0, charLimit) + "...";
    } else {
        return str;
    }
}
//DAS-971 Annotation tooltip 
Tooltip.prototype.drawAnnotationToolTip = function(toolTipData){
	this.m_chart.setCursorStyle("default");
	var border = "none";
	var bor = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
	var backColor = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
	var tc = "<table class=\" chart-tooltip bdtooltip\" style = 'border-collapse: separate; border-spacing: 0;border-collapse: separate; border-spacing: 0;border:" + border + "; background:background:" + backColor + ";width:" + this.m_customtooltipwidth + ";textOverflow:ellipsis'>";
	tc += "<tr class=\"chart-tooltip-head-row\"><td style='text-align:center;border:" + border + ";background:" + backColor + ";' colspan=\"4\" class=\"chart-tooltip-head\">" + toolTipData.cat + "</td></tr>";
	tc += "<tr><td class=\"chart-tooltip-head\" style='background:" + backColor + "; border-top: " + bor + ";border-bottom: " + bor + ";' align=\"left\">" + "Event Description" + "</td>";
	tc += "<td class=\"chart-tooltip-head\" style='background:" + backColor + "; border-top: " + bor + ";border-bottom: " + bor + ";' align=\"left\">" + "Event Date" + "</td></tr>";

	for (var i = 0; i < toolTipData.data.length; i++) {
		var shape = this.m_chart.getHTMLShape(toolTipData.data[i][0]["shape"]);
		var bgClr = (IsBoolean(this.m_tooltiphighlighter) && (i === toolTipData.highlightIndex)) ? this.m_fieldhighlightercolor : backColor;
		var highlightBorder = (i === toolTipData.highlightIndex) ? (this.m_tooltipborderwidth * 1 + 1) + "px solid " + toolTipData.data[i][0]["color"] : "";
		tc += (i === toolTipData.highlightIndex) ? "<tr class=\"chart-tooltip-highlight-row\">" : "<tr>";
		if (toolTipData.data[i][0]) {
			tc += "<td style='border-collapse: separate; border-spacing: 0;border:none;background:" + bgClr + ";border-right:" + highlightBorder + "; border-left:" + border + ";'>" + this.m_chart.drawLegendShape(shape, toolTipData.data[i][0]["color"]) + "" + this.truncateString(toolTipData.data[i][1], this.m_customtooltipwidth) + "</td>";
		} else {
			tc += "<td style='background:" + bgClr + ";border:" + border + "; '>" + this.truncateString(toolTipData.data[i][1], this.m_customtooltipwidth) + "</td>";
		}
		for (var j = 2; j < toolTipData.data[i].length; j++) {
			tc += "<td style='border-collapse: separate; border-spacing: 0;border:none;background:" + bgClr + ";' align=\"right\">" + toolTipData.data[i][j] + "</td>";
		}
		tc += "</tr>";
	}
	tc += "</table>";
	var ShowHighlighter = this.m_chart.m_tooltiphighlighter;
	this.getToolTip(tc, ShowHighlighter);
}
/** @description this methods draws the tooltip content in table - overrided in some sub classes **/
Tooltip.prototype.drawDefaultChartToolTip = function(toolTipData) {
	
    if ((toolTipData != {} && toolTipData != undefined && toolTipData != null) && (this.m_customtextboxfortooltip!== undefined) && (this.m_customtextboxfortooltip.dataTipType == "Default") && (toolTipData.data.length > 0) && !this.m_chart.m_showannotationTooltip) {
   		this.m_chart.setCursorStyle((toolTipData.highlightIndex !== undefined) ? this.m_chart.m_cursortype : "default");
   		var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
   		var backColor = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
    	var tc = "<table class=\" chart-tooltip bdtooltip\" style = 'border:" + border + ";background:"+backColor+";width:"+this.m_customtooltipwidth+";textOverflow:ellipsis'>";
        tc += "<tr class=\"chart-tooltip-head-row\"><td style='border:" + border + ";background:"+backColor+";' colspan=\"4\" class=\"chart-tooltip-head\">" + toolTipData.cat + "</td></tr>";
        if ((this.m_tooltipproperties["tooltipheadervalue"] !== undefined) && (this.m_chart.m_charttype === "100%" || this.m_chart.m_columntype === "100%")) {
        	for (var j = 0; j < toolTipData.data[0].length - 1; j++) {
                tc += "<td style='border:" + border + ";background:" + backColor + ";' align=\"left\">" + this.m_tooltipproperties["tooltipheadervalue"][j] + "</td>";
            }
        }
        for (var i = 0; i < toolTipData.data.length; i++) {
            var shape = this.m_chart.getHTMLShape(toolTipData.data[i][0]["shape"]);
            var bgClr = (IsBoolean(this.m_tooltiphighlighter) && (i === toolTipData.highlightIndex)) ? this.m_fieldhighlightercolor : backColor;
            var highlightBorder = (i === toolTipData.highlightIndex) ? (this.m_tooltipborderwidth * 1 + 1) + "px solid " + toolTipData.data[i][0]["color"] : "";
            tc += (i === toolTipData.highlightIndex) ?"<tr class=\"chart-tooltip-highlight-row\">" : "<tr>";
            if (toolTipData.data[i][0]) {
                tc += "<td style='background:" + bgClr + ";border-right:" + highlightBorder + ";border-top:" + border + ";border-bottom:" + border + ";border-left:" + border + ";'>" + this.m_chart.drawLegendShape(shape, toolTipData.data[i][0]["color"]) + "" + this.truncateString(toolTipData.data[i][1], this.m_customtooltipwidth) + "</td>";
            } else {
                tc += "<td style='background:" + bgClr + ";border:" + border + ";'>" + this.truncateString(toolTipData.data[i][1], this.m_customtooltipwidth) + "</td>";
            }
            for (var j = 2; j < toolTipData.data[i].length; j++) {
                tc += "<td style='border:" + border + ";background:" + bgClr + ";' align=\"right\">" + toolTipData.data[i][j] + "</td>";
            }
            tc += "</tr>";
        }
        tc += "</table>";
        /**DAS-672 */
        var ShowHighlighter = this.m_chart.m_tooltiphighlighter;
        this.getToolTip(tc, ShowHighlighter);
    } else if ((toolTipData != undefined && toolTipData != null) && (this.m_customtextboxfortooltip!== undefined) && (this.m_customtextboxfortooltip.dataTipType == "Custom") && !this.m_chart.m_showannotationTooltip) {
    	this.drawcustomtooltip(toolTipData);
	} else if (this.m_chart.m_showannotationTooltip && (toolTipData != {} && toolTipData != undefined && toolTipData != null) && (toolTipData.data.length > 0)) {
		this.drawAnnotationToolTip(toolTipData);
	} else {
    	if(this.m_chart !== undefined){
    		if (dGlobals.layoutType == "MobileLayout" && this.m_chart.m_type == "Timeline") {
        		if (IsBoolean(this.m_chart.isMaximized)) {
        			$("#legendContent" + this.m_chart.m_objectid).css('visibility', 'visible');
        			$("#left-button" + this.m_chart.m_objectid).css('display', 'block');
        	    	$("#right-button" + this.m_chart.m_objectid).css('display', 'block');
        		}
        	}
        	this.m_chart.hideToolTip();
    	}
    }
};

Tooltip.prototype.drawScatteredChartToolTip = function(toolTipData){
	if (toolTipData != {} && toolTipData != undefined && toolTipData != null && (this.m_customtextboxfortooltip.dataTipType == "Default")) {
		var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
		var tc = "<table class=\" chart-tooltip bdtooltip\" style = 'border:" + border + ";background:transparent;width:"+this.m_customtooltipwidth+";'>";
		for (var i = 0, outerLength = toolTipData.data.length; i < outerLength; i++) {
			tc += "<tr>";
			var shape = this.m_chart.getHTMLShape(toolTipData.data[i][0]["shape"]);
			tc += "<td>" + this.m_chart.drawLegendShape(shape,toolTipData.data[i][0]["color"])+""+ toolTipData.data[i][1] + "</td>";
			//To support custom tooltip method-column should be added dynamically
			for (var j = 2, innerLength = toolTipData.data[i].length; j < innerLength; j++) {
				tc += "<td align=\"left\">" + toolTipData.data[i][j] + "</td>";
			}
			tc += "</tr>";
		}
		tc += "</table>";
		var ShowHighlighter = false;
		this.getToolTip(tc, ShowHighlighter);
	}else if ((toolTipData != undefined && toolTipData != null) && (this.m_customtextboxfortooltip.dataTipType == "Custom")) {
		this.drawcustomtooltip(toolTipData);
    } else {
    	if(this.m_chart !== undefined){
    		this.m_chart.hideToolTip();
    	}
	}
};

Tooltip.prototype.drawTrendToolTip = function(toolTipData){
	if ((((toolTipData || "") != "") && toolTipData != {}) && toolTipData.data.length > 0) {
		var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
		var tc = "<table class=\" chart-tooltip toolTip\" style = 'border:" + border + ";background:transparent;width:"+this.m_customtooltipwidth+";'>";
		tc += "<tr><td>" + toolTipData.cat + "</td></tr>";
		tc += "<tr><td align=\"center\">" + toolTipData.data[0] + "</td></tr>";
		tc += "</table>";
		var ShowHighlighter = false;
		//this.getToolTip(tc, ShowHighlighter);
		this.getTrendToolTip(tc, ShowHighlighter);
	} else {
    	if(this.m_chart !== undefined){
    		this.m_chart.hideToolTip();
    	}
	}
};
Tooltip.prototype.drawWordCloudToolTip = function (toolTipData) {
	var data = toolTipData.data;
	var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
	var tc = "<table class=\" chart-tooltip bdtooltip\" style = 'border:" + border + ";background:transparent;width:"+this.m_customtooltipwidth+";'>";
	tc += "<tr><td colspan=\"3\" class=\"chart-tooltip-head\"><span class=\"colorspan\" style=\"background-color:" + data[0].color + ";\"></span>" + data[0].value + "</td></tr>";
	tc += "<tr><td align=\"left\">" + data[1].text + "</td><td align=\"left\">" + data[1].value + "</td></tr>";
	if(this.m_chart.m_confidenceDisplayNames.length !== 0){
		tc += "<tr><td align=\"left\">" + data[2].text + "</td><td align=\"left\">" + data[2].value + "</td></tr>";
	}
	tc += "</table>";
	var ShowHighlighter = false;
	this.getToolTip(tc, ShowHighlighter);
};
Tooltip.prototype.drawTreeMapToolTip = function (toolTipData) {
	if ((toolTipData != undefined && toolTipData != null) && (this.m_customtextboxfortooltip!== undefined) && (this.m_customtextboxfortooltip.dataTipType == "Default")) {
		this.m_chart.setCursorStyle(this.m_cursortype);
		var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
		var tc = "<table class=\" chart-tooltip bdtooltip\" style = 'border:" + border + ";background:transparent;width:"+this.m_customtooltipwidth+";'>";
		for (var i = 0, length = toolTipData.data.length; i < length; i++) {
			tc += "<tr>";
			for (var j = 0, len = toolTipData.data[i].length; j < len; j++) {
				if(len == 2){
					tc += "<td>" + toolTipData.data[i][j] + "</td>";
				}else{ 
					if( j == 1 ){
						tc += "<td><span class=\"colorspan\" style=\"background-color:" + toolTipData.data[i][0] + ";\"></span>" + toolTipData.data[i][j] + "</td>";
					}else if( j > 1 ){
						tc += "<td>" + toolTipData.data[i][j] + "</td>";
					} else {
						// Do nothing
					}
				}
			}
			tc += "</tr>";
		}
		tc += "</table>";
		var ShowHighlighter = false;
		this.getToolTip(tc, ShowHighlighter);
	} else if ((toolTipData != undefined && toolTipData != null) && (this.m_customtextboxfortooltip!== undefined) && (this.m_customtextboxfortooltip.dataTipType == "Custom")) {
    	this.drawcustomtooltip(toolTipData);
    }else{
    	// Do nothing
    }
};
/** @description Creating Table and in td adding tooltip data**/
Tooltip.prototype.drawSentimentPlotToolTip=function(toolTipData){
	if (toolTipData != {} && toolTipData != undefined && toolTipData != null && (toolTipData.data).length !== 0) {
		var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
		var tc = "<table class=\" chart-tooltip bdtooltip\" style = 'border:" + border + ";background:transparent;width:"+this.m_customtooltipwidth+";'>";
		for (var j = 0; j < toolTipData.data.length; j++) {
			for (var i = 0; i < toolTipData.data[j].length; i++) {
				var toolData = toolTipData.data[j][i];
				tc += "<tr>";
				tc += "<td style='font-size:11px; font-family:"+selectGlobalFont(this.m_chart.m_xAxis.m_labelfontfamily)+"; font-weight:" + this.m_chart.m_xAxis.m_labelfontweight + "; ' align=\"left\">" + toolData + "</td>";
				tc += "</tr>";
			}
		}
		tc += "</table>";
		var ShowHighlighter = false;
		this.getToolTip(tc, ShowHighlighter);
	} else {
		if(this.m_chart !== undefined){
			this.m_chart.hideToolTip();
		}
	}
};
/** @description this methods draws the tooltip content in table - overrided in some sub classes **/
Tooltip.prototype.drawProjectTimelineToolTip = function (toolTipData) {
	if ((toolTipData != {} && toolTipData != undefined && toolTipData != null) && toolTipData.data.length > 0) {
		var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
		var tc = "<table class=\" chart-tooltip bdtooltip\" style = 'border:" + border + ";background:transparent;width:"+this.m_customtooltipwidth+";'>";
		tc += "<tr><td colspan=\"4\" class=\"chart-tooltip-head\"><span class=\"icons bd-"+toolTipData.shape+"\" style='color:" + toolTipData.color + ";'></span>" + toolTipData.cat + "</td></tr>";
		for (var i = 0; i < toolTipData.data.length; i++) {
			tc += "<tr>";
			for (var j = 0; j < toolTipData.data[i].length; j++) {
				tc += "<td>" + toolTipData.data[i][j] + "</td>";
			}
			tc += "</tr>";
		}
		tc += "</table>";
		var ShowHighlighter = false;
		this.getToolTip(tc, ShowHighlighter);
	} else {
		if(this.m_chart !== undefined){
			this.m_chart.hideToolTip();
		}
	}
};
Tooltip.prototype.drawGroupBarToolTip = function(toolTipData) {
    if ((((toolTipData || "") != "") && toolTipData != {}) && (this.m_customtextboxfortooltip.dataTipType == "Default") && toolTipData.data.length > 0) {
    	var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
    	var backColor = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
		var tc = "<table class=\" chart-tooltip bdtooltip\" style = 'border:" + border + ";background:"+backColor+";width:"+this.m_customtooltipwidth+";'>";
        if (this.m_chart.getCategoryData().length != 0) {
            tc += "<tr><td style='border:" + border + ";background:"+backColor+";' colspan=\"4\" class=\"chart-tooltip-head\">" + toolTipData.cat + "</td></tr>";
        }
        tc += "<tr><td style='border:" + border + ";background:"+backColor+";' colspan=\"4\" class=\"chart-tooltip-sub-head\">" + toolTipData.subcat + "</td></tr>";
        if ((this.m_tooltipproperties["tooltipheadervalue"] !== undefined) && (this.m_chart.m_charttype === "100%")) {
        	for (var j = 0; j < toolTipData.data[0].length - 1; j++) {
                tc += "<td style='border:" + border + ";background:" + backColor + ";' align=\"left\">" + this.m_tooltipproperties["tooltipheadervalue"][j] + "</td>";
            }
        }
        for (var i = 0; i < toolTipData.data.length; i++) {
            tc += "<tr>";

            var bgClr = (IsBoolean(this.m_tooltiphighlighter) && (i === toolTipData.highlightIndex)) ? this.m_fieldhighlightercolor : backColor;
            var highlightBorder = (i == toolTipData.highlightIndex) ? (this.m_tooltipborderwidth * 1 + 1) + "px solid " + toolTipData.data[i][0] : "";
            if (toolTipData.data[i][0])
                tc += "<td style='background:" + bgClr + ";border-right:" + highlightBorder + ";border-top:" + border + ";border-bottom:" + border + ";border-left:" + border + ";'><span class=\"colorspan\" style=\"background-color:" + toolTipData.data[i][0] + ";\"></span>" + toolTipData.data[i][1] + "</td>";
            else
                tc += "<td style='background:" + bgClr + ";border:" + border + ";'>" + toolTipData.data[i][1] + "</td>";

            //			tc += "<td><span class=\"colorspan\" style=\"background-color:" + toolTipData.data[i][0] + ";\"></span>" + toolTipData.data[i][1] + "</td>";
            for (var j = 2; j < toolTipData.data[i].length; j++) {
                tc += "<td style='border:" + border + ";background:" + bgClr + ";' align=\"right\">" + toolTipData.data[i][j] + "</td>";
            }
            tc += "</tr>";
        }
        tc += "</table>";
        /**DAS-672 */
        var ShowHighlighter = this.m_chart.m_tooltiphighlighter;
        this.getToolTip(tc, ShowHighlighter);
    } else if ((toolTipData != undefined && toolTipData != null) && (this.m_customtextboxfortooltip.dataTipType == "Custom")) {
    	this.drawcustomtooltip(toolTipData);
    } else {
    	if(this.m_chart !== undefined){
    		this.m_chart.hideToolTip();
    	}
    }
};
Tooltip.prototype.drawPieChartToolTip = function(toolTipData) {
    if (toolTipData != {} && ((toolTipData || "") != "") && (this.m_customtextboxfortooltip.dataTipType == "Default")) {
    	this.m_chart.setCursorStyle(this.m_chart.m_cursortype);
    	var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
		var tc = "<table class=\" chart-tooltip bdtooltip\" style = 'border:" + border + ";background:transparent;width:"+this.m_customtooltipwidth+";'>";
        tc += "<tr class=\"chart-tooltip-head-row\"><td colspan=\"4\" class=\"chart-tooltip-head\"><span class=\"colorspan\" style=\"background-color:" + toolTipData.color + ";\"></span>" + toolTipData.cat + "</td></tr>";
        for (var i = 0, length = toolTipData.data.length; i < length; i++) {
            tc += "<tr>";
            if (IsBoolean(this.m_chart.m_isCategoryAvailable)) {
                tc += dGlobals.layoutType == "MobileLayout" && (this.m_chart.m_mobiletooltipstyle !== undefined) && (this.m_chart.m_mobiletooltipstyle == "top") ? "<td><span class=\"colorspan\" style=\"background-color:" + toolTipData.color + ";\"></span>" + toolTipData.ser + "</td>" : "<td>" + toolTipData.ser + "</td>";
            }
            for (var j = 0; j < toolTipData.data[i].length; j++) {
                tc += "<td>" + toolTipData.data[i][j] + "</td>";
            }
            tc += "</tr>";
        }
        tc += "</table>";
        var ShowHighlighter = false;
        this.getToolTip(tc, ShowHighlighter);
    } else if ((toolTipData != undefined && toolTipData != null) && (this.m_customtextboxfortooltip.dataTipType == "Custom")) {
    	this.drawcustomtooltip(toolTipData);
    } else {
    	if(this.m_chart !== undefined){
    		this.m_chart.hideToolTip();
    	}
    }
};
Tooltip.prototype.drawDecisionTreeToolTip=function(toolTipData){
	if ((((toolTipData || "") != "") && toolTipData != {}) && toolTipData.data.length > 0) {
		var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
		var tc = "<table class=\" chart-tooltip bdtooltip\" style = 'border:" + border + ";background:transparent;width:"+this.m_customtooltipwidth+";'>";
		tc += "<tr><td colspan=\"4\" class=\"chart-tooltip-head\">" + toolTipData.labelOfNode + "</td></tr>";
		tc += "<tr><td colspan=\"4\" class=\"chart-tooltip-head\">" + toolTipData.condition + "</td></tr>";
		if(this.m_chart.m_numberOfItemsArray.length !=0){
			tc += "<tr><td colspan=\"4\" class=\"chart-tooltip-head\">" + toolTipData.n + "</td></tr>";
		}
		for (var i = 0; i < toolTipData.data.length; i++) {
			if(toolTipData.data[i] !== ""){
				tc += "<tr>";
				if((this.m_chart.m_numberOfItems.length != 0) || (this.m_chart.m_seriesProbabilityArray.length != 0))
				{
					tc += "<td><span class=\"colorspan\" style=\"background-color:" + toolTipData.data[i][0] + ";\"></span>" + toolTipData.data[i][1] + "</td>";
					for (var j = 2; j < toolTipData.data[i].length; j++) {
						tc += "<td align=\"right\">" + toolTipData.data[i][j] + "</td>";
					}
				}
				tc += "</tr>";
			}
		}
		tc += "</table>";
		var ShowHighlighter = false;
		this.getToolTip(tc, ShowHighlighter);
	}else{
		if(this.m_chart !== undefined){
			this.m_chart.hideToolTip();
		}
	}
};
Tooltip.prototype.drawCandleStickToolTip=function(toolTipData){
	if ((((toolTipData || "") != "") && toolTipData != {}) && toolTipData.data.length > 0) {
		var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
		var tc = "<table class=\" chart-tooltip bdtooltip\" style = 'border:" + border + ";background:transparent;width:"+this.m_customtooltipwidth+";'>";
		tc += "<tr><td colspan=\"3\" class=\"chart-tooltip-head\"><span class=\"colorspan\" style=\"background-color:" + toolTipData.color + ";\"></span>" + toolTipData.cat + "</td></tr>";
		for (var i = 0; i < toolTipData.data.length; i++) {
			if (toolTipData.data[i]) {
				tc += "<tr>";
				for(var j=0; j<toolTipData.data[i].length; j++){
					if(j == 0 && IsBoolean(this.m_chart.m_showtooltipcategory)){//to show hide tooltip field names
						tc += "<td align=\"left\" ><strong>" + toolTipData.data[i][j] + "</strong></td>";
					}
					else if (j != 0) {
						tc += "<td align=\"right\">" + toolTipData.data[i][j] + "</td>";
					}
				}
				tc += "</tr>";
			}
		}
		tc += "</table>";
		var ShowHighlighter = false;
		this.getToolTip(tc, ShowHighlighter);
	} else {
		if(this.m_chart !== undefined){
			this.m_chart.hideToolTip();
		}
	}
};
Tooltip.prototype.drawBoxPlotToolTip=function(toolTipData){
	if ((toolTipData != {} && toolTipData != undefined && toolTipData != null) && toolTipData.data.length > 0) {
		var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
		var tc = "<table class=\" chart-tooltip bdtooltip\" style = 'border:" + border + ";background:transparent;width:"+this.m_customtooltipwidth+";'>";
		tc += "<tr><td colspan=\"3\" class=\"chart-tooltip-head\"><span class=\"colorspan\" style=\"background-image:" + toolTipData.color + ";\"></span>" + toolTipData.cat + "</td></tr>";
		for (var i = 0,length=toolTipData.data.length ; i < length; i++) {
			if (toolTipData.data[i]) {
				tc += "<tr>";
				/** Tooltip would add column dynamically given in tooltip object**/
				for(var j=0; j<toolTipData.data[i].length; j++){
					if(j <= 1)
						tc += "<td align=\"left\">" + toolTipData.data[i][j] + "</td>";
					else
						tc += "<td align=\"right\">" + toolTipData.data[i][j] + "</td>";
				}
				tc += "</tr>";
			}
		}
		tc += "</table>";
		var ShowHighlighter = false;
		this.getToolTip(tc, ShowHighlighter);
	} else {
		if(this.m_chart !== undefined){
			this.m_chart.hideToolTip();
		}
	}
};
Tooltip.prototype.drawCircumplexToolTip = function(toolTipData) {
    if ((toolTipData !== undefined && toolTipData !== null && toolTipData != {}) && (this.m_customtextboxfortooltip.dataTipType == "Default") && toolTipData.data.length > 0) {
    	var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
    	var backColor = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
		var tc = "<table class=\" chart-tooltip bdtooltip\" style = 'border:" + border + ";background:"+backColor+";width:"+this.m_customtooltipwidth+";'>";
        tc += "<tr><td style='border:" + border + ";background:"+backColor+";' colspan=\"3\" class=\"chart-tooltip-head\">" + toolTipData.cat + "</td></tr>";
        tc += "<tr><td style='border:" + border + ";background:"+backColor+";' align=\"left\">" + toolTipData.subCat + "</td><td style='border:" + border + ";background:transparent;' align=\"left\">" + toolTipData.subCatData + "</td></tr>";
        for (var i = 0; i < toolTipData.data.length; i++) {
            if (toolTipData.data[i]) {
            	var bgClr = (IsBoolean(this.m_tooltiphighlighter) && (i === toolTipData.highlightIndex)) ? this.m_fieldhighlightercolor : backColor;
                var highlightBorder = (i == toolTipData.highlightIndex) ? (this.m_tooltipborderwidth * 1 + 1) + "px solid " + toolTipData.data[i][0] : "";

                tc += "<tr>";
                for (var j = 1; j < toolTipData.data[i].length; j++) {
                    if (j == 1)
                        tc += "<td align=\"left\" style='background:" + bgClr + ";border-right:" + highlightBorder + ";border-top:" + border + ";border-bottom:" + border + ";border-left:" + border + ";'><span class=\"colorspan\" style=\"background:" + toolTipData.data[i][0] + ";\"></span>" + toolTipData.data[i][j] + "</td>";
                    else
                        tc += "<td align=\"right\" style='border:" + border + ";background:" + bgClr + ";'>" + toolTipData.data[i][j] + "</td>";
                }
            }
            tc += "</tr>";
        }
        tc += "</table>";
        var ShowHighlighter = true;
        this.getToolTip(tc, ShowHighlighter);
    } else if ((toolTipData != undefined && toolTipData != null) && (this.m_customtextboxfortooltip.dataTipType == "Custom")) {
    	this.drawcustomtooltip(toolTipData);
    } else {
    	if(this.m_chart !== undefined){
    		this.m_chart.hideToolTip();
    	}
    }
};
Tooltip.prototype.drawMapToolTip = function(toolTipData) {
    if (!IsBoolean(this.m_chart.m_isEmptySeries) && !this.m_chart.m_designMode) {
        if (((toolTipData || "") != "") && toolTipData != {}) {
        	var tc = "";
            if (this.m_customtextboxfortooltip.dataTipType == "Default") {
                this.m_chart.setCursorStyle(this.m_chart.m_cursortype);
                var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
                var tooltipwidth = this.m_customtooltipwidth + (this.m_customtooltipwidth !== "auto" ? "px" : "");
                tc = "<table class=\" chart-tooltip bdtooltip\" style = 'border:" + border + ";background:transparent;width:" + tooltipwidth + ";'>";
                tc += "<tr>";
                tc += "<td colspan=\"3\" class=\"chart-tooltip-head\">";
                tc += "<span style=\"background-color:" + toolTipData.color + "; width:10px;height:10px;\"></span>";
                tc += toolTipData.cat;
                tc += "</td>";
                tc += "</tr>";
                if (toolTipData.data != "") {
                    for (var key in toolTipData.data) {
                        tc += "<tr>";
                        tc += "<td>" + key + "</td>";
                        tc += "<td align=\"right\">" + toolTipData.data[key] + "</td>";
                        tc += "</tr>";
                    }
                }
                tc += "</table>";
            } else if ((toolTipData != undefined && toolTipData != null) && (this.m_customtextboxfortooltip.dataTipType == "Custom")) {
                /**DAS-528 add formatter for svg type */
                if(toolTipData.type == "svgMap"){
				   tc = this.drawcustomtooltipformap(toolTipData.data);
			   }else{
                var ToolTipData = this.m_customtextboxfortooltip.datatipData;
                while (/\[(.*?)\]/g.exec(ToolTipData) != null) {
                    var arr = /\[(.*?)\]/g.exec(ToolTipData);
                    if ((toolTipData.data !== undefined) && (toolTipData.type !== undefined))
                    /**DAS-528 add formatter for leafletMap type */
                        var data = (toolTipData.type == "LeafletMap") ? this.m_chart.getFormatterForToolTip(arr[1],this.m_chart.getDataProvider()[toolTipData.data][arr[1]]) : toolTipData.data[arr[1]];
                    var displayData;
                    if (data == "" || isNaN(data) || data == null || data == "null") {
                        displayData = data;
                    } else {
                        var num = data * 1;
                        if (num % 1 != 0 && this.m_tooltipprecision !== "default") {
                            displayData = num.toFixed(this.m_tooltipprecision);
                        } else {
                            displayData = data * 1;
                        }
                    }
                    ToolTipData = ToolTipData.replace(arr[0], displayData);
                }
                ToolTipData = SearchAndReplaceAllOccurence(ToolTipData, "&lt;", "<");
                ToolTipData = SearchAndReplaceAllOccurence(ToolTipData, "&gt;", ">");
                ToolTipData = SearchAndReplaceAllOccurence(ToolTipData, "&#34;", "'");
                tc = ToolTipData;
                }
            }
            if (toolTipData.type == "LeafletMap") {
                return tc;
            } else {
                this.m_chart.getMapToolTip(tc, toolTipData.left, toolTipData.top, this.m_chart);
            }
        } else {
            this.hideToolTip();
        }
    }
};
Tooltip.prototype.drawDecompositionToolTip = function(toolTipData) {
    if ((toolTipData != {} && toolTipData != undefined && toolTipData != null) && (this.m_customtextboxfortooltip!== undefined) && (this.m_customtextboxfortooltip.dataTipType == "Default") && (toolTipData.data.length > 0)) {
   		this.m_chart.setCursorStyle((toolTipData.highlightIndex !== undefined) ? this.m_chart.m_cursortype : "default");
   		var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
   		var backColor = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
    	var tc = "<table class=\" chart-tooltip bdtooltip\" style = 'border:" + border + ";background:"+backColor+";width:"+this.m_customtooltipwidth+";'>";
    	if(toolTipData.cat != undefined)
            tc += "<tr class=\"chart-tooltip-head-row\"><td style='border:" + border + ";background:"+backColor+";' colspan=\"4\" class=\"chart-tooltip-head\">" + toolTipData.cat + "</td></tr>";
        if ((this.m_tooltipproperties["tooltipheadervalue"] !== undefined) && (this.m_chart.m_charttype === "100%" || this.m_chart.m_columntype === "100%")) {
        	for (var j = 0; j < toolTipData.data[0].length - 1; j++) {
                tc += "<td style='border:" + border + ";background:" + backColor + ";' align=\"left\">" + this.m_tooltipproperties["tooltipheadervalue"][j] + "</td>";
            }
        }
        for (var i = 0; i < toolTipData.data.length; i++) {
            var shape = this.m_chart.getHTMLShape(toolTipData.data[i][0]["shape"]);
            var bgClr = (IsBoolean(this.m_tooltiphighlighter) && (i === toolTipData.highlightIndex)) ? this.m_fieldhighlightercolor : backColor;
            var highlightBorder = (i === toolTipData.highlightIndex) ? (this.m_tooltipborderwidth * 1 + 1) + "px solid " + toolTipData.data[i][0]["color"] : "";
            tc += (i === toolTipData.highlightIndex) ?"<tr class=\"chart-tooltip-highlight-row\">" : "<tr>";
            if (toolTipData.data[i][0]) {
                tc += "<td style='background:" + bgClr + ";border-right:" + highlightBorder + ";border-top:" + border + ";border-bottom:" + border + ";border-left:" + border + ";'>" + this.m_chart.drawLegendShape(shape, toolTipData.data[i][0]["color"]) + "" + toolTipData.data[i][1] + "</td>";
            } else {
                tc += "<td style='background:" + bgClr + ";border:" + border + ";'>" + toolTipData.data[i][1] + "</td>";
            }
            for (var j = 2; j < toolTipData.data[i].length; j++) {
                tc += "<td style='border:" + border + ";background:" + bgClr + ";' align=\"right\">" + toolTipData.data[i][j] + "</td>";
            }
            tc += "</tr>";
        }
        tc += "</table>";
        /**DAS-672 */
    var ShowHighlighter = this.m_chart.m_tooltiphighlighter;
        this.getToolTip(tc, ShowHighlighter);
    } else if ((toolTipData != undefined && toolTipData != null) && (this.m_customtextboxfortooltip!== undefined) && (this.m_customtextboxfortooltip.dataTipType == "Custom")) {
    	this.drawcustomtooltip(toolTipData);
    } else {
    	if(this.m_chart !== undefined){
    		if (dGlobals.layoutType == "MobileLayout" && this.m_chart.m_type == "Timeline") {
        		if (IsBoolean(this.m_chart.isMaximized)) {
        			$("#legendContent" + this.m_chart.m_objectid).css('visibility', 'visible');
        			$("#left-button" + this.m_chart.m_objectid).css('display', 'block');
        	    	$("#right-button" + this.m_chart.m_objectid).css('display', 'block');
        		}
        	}
        	this.m_chart.hideToolTip();
    	}
    }
};
Tooltip.prototype.drawKnowledgeToolTip = function(toolTipData) {
    if ((toolTipData != {} && toolTipData != undefined && toolTipData != null) && (this.m_customtextboxfortooltip !== undefined) && (this.m_customtextboxfortooltip.dataTipType == "Default")) {
        this.m_chart.setCursorStyle((toolTipData.highlightIndex !== undefined) ? this.m_chart.m_cursortype : "default");
        var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
        var backColor = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
        var tc = "<table class=\" chart-tooltip bdtooltip\" style = 'border:" + border + ";background:" + backColor + ";width:" + this.m_customtooltipwidth + ";'>";
        var shape = this.m_chart.getHTMLShape(toolTipData.cat[0][0]["shape"]);
        shape = toolTipData.cat[0][0]["shape"].indexOf("bd-") > -1 ? toolTipData.cat[0][0]["shape"] : shape;
        var bgClr = (IsBoolean(this.m_tooltiphighlighter) && (i === toolTipData.highlightIndex)) ? this.m_fieldhighlightercolor : backColor;
        var highlightBorder = (i === toolTipData.highlightIndex) ? (this.m_tooltipborderwidth * 1 + 1) + "px solid " + toolTipData.cat[0][0]["color"] : "";
        if (toolTipData.cat != undefined)
            tc += "<tr class=\"chart-tooltip-head-row\"><td style='border:" + border + ";background:" + bgClr + ";' colspan=\"4\" class=\"chart-tooltip-head\">" + this.m_chart.drawLegendShape(shape, toolTipData.cat[0][0]["color"]) + "" + toolTipData.cat[0][1] + "</td></tr>";

        for (var i = 0; i < toolTipData.data.length; i++) {
            tc += "<tr>";
            if (toolTipData.data[i]) {
                tc += "<td style='background:" + backColor + ";border-right:" + border + ";border-top:" + border + ";border-bottom:" + border + ";border-left:" + border + ";'>" + toolTipData.data[i][0] + "</td>";
            } else {
                tc += "<td style='background:" + backColor + ";border:" + border + ";'>" + toolTipData.data[1] + "</td>";
            }
            for (var j = 1; j < toolTipData.data[i].length; j++) {
                tc += "<td style='border:" + border + ";background:" + bgClr + ";' align=\"right\">" + toolTipData.data[i][j] + "</td>";
            }
            tc += "</tr>";
        }
        tc += "</table>";
        var ShowHighlighter = true;
        this.getToolTip(tc, ShowHighlighter);
    } else {
        if (this.m_chart !== undefined) {
            if (dGlobals.layoutType == "MobileLayout" && this.m_chart.m_type == "Timeline") {
                if (IsBoolean(this.m_chart.isMaximized)) {
                    $("#legendContent" + this.m_chart.m_objectid).css('visibility', 'visible');
                    $("#left-button" + this.m_chart.m_objectid).css('display', 'block');
                    $("#right-button" + this.m_chart.m_objectid).css('display', 'block');
                }
            }
            this.m_chart.hideToolTip();
        }
    }
};
/** @description tooltip drawing methods **/
Tooltip.prototype.drawcustomtooltip = function(toolTipData) {
    var textArray = [];
    var ToolTipData = this.m_customtextboxfortooltip.datatipData;
    var tcNew = ToolTipData;
    try{
    	var expScript = tcNew;
    	/**Added to support Language Mapping and global variables */
		expScript = this.m_chart.formattedDescription(this.m_chart, expScript);
    	while(/\[(.*?)\]/g.exec(expScript) != null) {
    		var arr =  /\[(.*?)\]/g.exec(expScript);
    		/**BDD:632 Added to support formatter field level*/
    		if((this.m_chart.m_type !== "Mixed") && (this.m_chart.m_type !== "Timeline")){
    			var data = this.m_chart.getUpdatedFormatterForToolTip(toolTipData[arr[1]], arr[1]);
    		}else{
    			var map = {"serVal": toolTipData[arr[1]], "seriesName": arr[1]};
    			var data = this.m_chart.getUpdatedLeftRightAxisFormatterForToolTip(map);
    		}
    		expScript = expScript.replace(arr[0], data );
    	}
    	/**Added to support html tags*/
    	expScript = SearchAndReplaceAllOccurence(expScript, "&lt;", "<");
    	expScript=SearchAndReplaceAllOccurence(expScript, "&gt;", ">");
    	expScript=SearchAndReplaceAllOccurence(expScript, "&#34;", "'");
    	tcNew = expScript;
    } catch(e) {
    	/** Alternative **/
	    /**Added to support html tags*/
	    if (ToolTipData.indexOf("&lt;htmlTag&gt;") != -1 || ToolTipData.indexOf("<htmlTag>") != -1) {
	        ToolTipData = SearchAndReplaceAllOccurence(ToolTipData, "&lt;htmlTag&gt;", "");
	        ToolTipData = SearchAndReplaceAllOccurence(ToolTipData, "&lt;/htmlTag&gt;", "");
	        ToolTipData = SearchAndReplaceAllOccurence(ToolTipData, "&lt;", "<");
	        ToolTipData = SearchAndReplaceAllOccurence(ToolTipData, "&gt;", ">");
	        ToolTipData = SearchAndReplaceAllOccurence(ToolTipData, "&#34;", "'");
	    }
	    textArray = (ToolTipData).split(/\[+(.*?)\]+/g);
	    for (var key in toolTipData) {
	        for (var k = 1; textArray.length > k; k += 2) {
	            if (key == textArray[k]) {
	            	var tempToolTipData = toolTipData[key];
	                if (tempToolTipData == "" || isNaN(tempToolTipData) || tempToolTipData == null || tempToolTipData == "null") {
	                    toolTipData[key] = tempToolTipData;
	                } else {
	                    var num = tempToolTipData * 1;
	                    if (num % 1 != 0 && this.m_tooltipprecision !== "default") {
	                        toolTipData[key] = num.toFixed(this.m_tooltipprecision);
	                    } else {
	                        toolTipData[key] = tempToolTipData * 1;
	                    }
	                }
	                /**Custom tool tip is designed in such a way that component formater can not be apply directly in to it*/
	                textArray[k] = toolTipData[key];
	            }
	        }
	    }
	    tcNew = '';
	    for (var l = 0; textArray.length > l; l++) {
	        tcNew += textArray[l];
	    }
    }
    /**DAS-672 */
    var ShowHighlighter = this.m_chart.m_tooltiphighlighter;
    this.m_chart.setCursorStyle(this.m_chart.m_cursortype);
    this.getToolTip(tcNew, ShowHighlighter);
};
/*DAS-528 function to draw custom formatter tooltip for map component */
Tooltip.prototype.drawcustomtooltipformap = function(toolTipData) {
    var textArray = [];
    var ToolTipData = this.m_customtextboxfortooltip.datatipData;
    var tcNew = ToolTipData;
    try{
    	var expScript = tcNew;
    	/**Added to support Language Mapping and global variables */
		expScript = this.m_chart.formattedDescription(this.m_chart, expScript);
    	while(/\[(.*?)\]/g.exec(expScript) != null) {
    		var arr =  /\[(.*?)\]/g.exec(expScript);
    		/**BDD:632 Added to support formatter field level */
    		if((this.m_chart.m_type !== "Mixed") && (this.m_chart.m_type !== "Timeline")){
    			var data = this.m_chart.getFormatterForToolTip(arr[1],toolTipData[arr[1]]);
    		}else{
    			var map = {"serVal": toolTipData[arr[1]], "seriesName": arr[1]};
    			var data = this.m_chart.getUpdatedLeftRightAxisFormatterForToolTip(map);
    		}
    		expScript = expScript.replace(arr[0], data );
    	}
    	/**Added to support html tags*/
    	expScript = SearchAndReplaceAllOccurence(expScript, "&lt;", "<");
    	expScript=SearchAndReplaceAllOccurence(expScript, "&gt;", ">");
    	expScript=SearchAndReplaceAllOccurence(expScript, "&#34;", "'");
    	tcNew = expScript;
    } catch(e) {
    	/** Alternative **/
	    /**Added to support html tags*/
	    if (ToolTipData.indexOf("&lt;htmlTag&gt;") != -1 || ToolTipData.indexOf("<htmlTag>") != -1) {
	        ToolTipData = SearchAndReplaceAllOccurence(ToolTipData, "&lt;htmlTag&gt;", "");
	        ToolTipData = SearchAndReplaceAllOccurence(ToolTipData, "&lt;/htmlTag&gt;", "");
	        ToolTipData = SearchAndReplaceAllOccurence(ToolTipData, "&lt;", "<");
	        ToolTipData = SearchAndReplaceAllOccurence(ToolTipData, "&gt;", ">");
	        ToolTipData = SearchAndReplaceAllOccurence(ToolTipData, "&#34;", "'");
	    }
	    textArray = (ToolTipData).split(/\[+(.*?)\]+/g);
	    for (var key in toolTipData) {
	        for (var k = 1; textArray.length > k; k += 2) {
	            if (key == textArray[k]) {
	            	var tempToolTipData = toolTipData[key];
	                if (tempToolTipData == "" || isNaN(tempToolTipData) || tempToolTipData == null || tempToolTipData == "null") {
	                    toolTipData[key] = tempToolTipData;
	                } else {
	                    var num = tempToolTipData * 1;
	                    if (num % 1 != 0 && this.m_tooltipprecision !== "default") {
	                        toolTipData[key] = num.toFixed(this.m_tooltipprecision);
	                    } else {
	                        toolTipData[key] = tempToolTipData * 1;
	                    }
	                }
	                /**Custom tool tip is designed in such a way that component formater can not be apply directly in to it*/
	                textArray[k] = toolTipData[key];
	            }
	        }
	    }
	    tcNew = '';
	    for (var l = 0; textArray.length > l; l++) {
	        tcNew += textArray[l];
	    }
    }
    return tcNew;
};
/** @description tooltip drawing methods **/
/*Tooltip.prototype.getToolTip = function(tooltipContent, ShowHighlighter) {
	*//** Mobile view tooltip drawing *//*
if (dGlobals.layoutType == "MobileLayout" && (this.m_chart.m_mobiletooltipstyle !== undefined) && (this.m_chart.m_mobiletooltipstyle == "top")) {
	if (IsBoolean(this.m_chart.isMaximized)) {
		this.m_chart.removeMobileToolTipDiv()
		this.drawMobileViewTooltip(tooltipContent, ShowHighlighter);
	}
} else {
	var chartObject = this.m_chart;
	chartObject.removeToolTipDiv();
	var obj = document.createElement("div");
	document.body.appendChild(obj);
	var cls = (IsBoolean(chartObject.m_customtextboxfortooltip) && IsBoolean(chartObject.m_customtextboxfortooltip.dataTipType == "Custom")) ? "toolTipDivForCustom" : "toolTipDiv";
	obj.setAttribute("class", cls);
	obj.setAttribute("id", "toolTipDiv");
	obj.innerHTML = tooltipContent;
	$(obj).css({"width" : chartObject.m_customtooltipwidth + (chartObject.m_customtooltipwidth !== "auto" ? "px" : "")});
	var pos = {left: pageX * 1 + 15 * 1, top: pageY * 1 + 10 * 1};
	var left = pageX - obj.clientWidth * 1;
	if ((mouseX * 1 + obj.clientWidth * 1) >= chartObject.getEndX()) {
	    if (left * 1 > 0) {
	        pos.left = left * 1;
	    } else {
	        if (left * -1 < (obj.clientWidth * 1 / 3)) {
	            pos.left = left * -1;
	        }
	    }
	}
	var top = pageY - obj.clientHeight * 1 - 10;
	if ((mouseY * 1 + obj.clientHeight) >= chartObject.getStartY() && (top * 1 > 0)) {
		pos.top = top;
	}
	$(obj).css({
		"font-family" :  selectGlobalFont(chartObject.m_defaultfontfamily),
		"visibility" : "",
		"zIndex" : chartObject.m_zIndex + 1,
		"left": pos.left + "px",
		"top": pos.top + "px",
	})
	
	*//**Set tooltip container background css property object*//*
	var tooltipBGColor = hex2rgb(convertColorToHex(chartObject.m_tooltipbackgroundcolor), chartObject.m_tooltipbackgroundtransparency);		
	if ($(obj).hasClass("toolTipDivForCustom")) {
		 // for custom tooltip div
	    $(obj).css({
	    	"background-color": tooltipBGColor,
	    	"border": chartObject.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(chartObject.m_tooltipbordercolor))
	    });
	} else if(!IsBoolean(ShowHighlighter)) {
		 // for default tooltip div
	    $(obj).find("table").css("background-color", tooltipBGColor);
	    $(obj).find("td").each(function() {
	        $(this).css({
	            "background-color": tooltipBGColor,
	            "border": chartObject.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(chartObject.m_tooltipbordercolor))
	        });
	    });
	}
	*//** Added to control fontSize and color of tooltip *//*
	$(obj).find(".chart-tooltip td").css({
		"font-size": chartObject.m_tooltipfontsize + "px",
		"color": chartObject.m_tooltipfontcolor
	});
	
	if (chartObject.m_autotooltiphide) {
		setTimeout(function() {
			if (obj !== undefined) {
				*//** .remove() of jQuery won't work in IE for plain object, Need to wrap inside $ **//*
				$(obj).remove();
			}
		}, chartObject.m_tooltiphidetimeout);
	}
}
};*/
/**@description updated tooltip method for different positions PLAT-112**/
Tooltip.prototype.getToolTip = function(tooltipContent, ShowHighlighter) {
/** Mobile view tooltip drawing */
if (dGlobals.layoutType == "MobileLayout" && (this.m_chart.m_mobiletooltipstyle !== undefined) && (this.m_chart.m_mobiletooltipstyle == "top")) {
    if (IsBoolean(this.m_chart.isMaximized)) {
        this.m_chart.removeMobileToolTipDiv();
        this.drawMobileViewTooltip(tooltipContent, ShowHighlighter);
    }
} else {
    var parentDiv = document.getElementById("WatermarkDiv");
    var dashboardObj = document.getElementsByClassName("draggableWidgetDiv");
    var scrollLeft = (parentDiv == null) ? 0 : parentDiv.scrollLeft;
    var scrollTop = (parentDiv == null) ? 0 : parentDiv.scrollTop;
    var chartObject = this.m_chart;
    chartObject.removeToolTipDiv();
    var obj = document.createElement("div");
    if (this.m_chart.m_dashboard == "") {
        document.body.appendChild(obj);
    } else {
        document.querySelector("#WatermarkDiv").appendChild(obj);
    }
	var startX = window.pageXOffset;
	var startY = window.pageYOffset;
	var screenWidth = (parentDiv == null)? this.m_chart.m_draggableDiv.clientWidth : parentDiv.clientWidth;
	var screenHeight = (parentDiv == null)? this.m_chart.m_draggableDiv.clientHeight: parentDiv.clientHeight;
	var endX = startX + screenWidth;
	var endY = startY + screenHeight;
    var cls = (IsBoolean(chartObject.m_customtextboxfortooltip) && IsBoolean(chartObject.m_customtextboxfortooltip.dataTipType == "Custom") && !IsBoolean(this.m_chart.m_showannotationTooltip)) ? "toolTipDivForCustom" : "toolTipDiv";
    obj.setAttribute("class", cls);
    obj.setAttribute("id", "toolTipDiv");
    /*DAS-701: tooltip while having scroll,ui is breaking - created innerDiv for overflow*/ 
    //obj.innerHTML = tooltipContent;
    var innerDiv = document.createElement("div");
    $(obj).append(innerDiv);
    innerDiv.innerHTML = tooltipContent;
    //DAS-971 Annotation Tooltip UI
		var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
	if (IsBoolean(this.m_chart.m_showannotationTooltip)) {
		$(innerDiv).css({
			"border": border,
			"border-radius": "8px",
		});
	}
    /**Set tooltip container background css property object*/
    var tooltipBGColor = hex2rgb(convertColorToHex(chartObject.m_tooltipbackgroundcolor), chartObject.m_tooltipbackgroundtransparency);
    if ($(obj).hasClass("toolTipDivForCustom")) {
        // for custom tooltip div
        $(obj).css({
            "background-color": tooltipBGColor,
            "border": chartObject.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(chartObject.m_tooltipbordercolor))
        });
    } else if (!IsBoolean(ShowHighlighter)) {
        // for default tooltip div
        $(obj).find("table").css("background-color", tooltipBGColor);
        $(obj).find("td").each(function() {
            $(this).css({
                "background-color": tooltipBGColor,
                "border": chartObject.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(chartObject.m_tooltipbordercolor))
            });
        });
    }
    /** Added to control fontSize and color of tooltip */
    $(obj).find(".chart-tooltip td").css({
        "font-size": chartObject.m_tooltipfontsize + "px",
        "color": chartObject.m_tooltipfontcolor
    });
    $(obj).css({
      //  "width": chartObject.m_customtooltipwidth + (chartObject.m_customtooltipwidth !== "auto" ? "px" : ""),
    	"width" : "fit-content",
    	"white-space" : "nowrap"
    });
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
        pos.left = (pos.left * 1) + (width / 2) - 38;
        //20+14 +4 in which 20is right for funnel and 14 is half the width of funnel 4is half of left padding
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
            pos.left = pos.left - 8;
            // 8 is subtracted for center funnel position as removing left padding
        }
    } else {
        if (place == 'left') {
            obj.setAttribute("placement", "bottom-right");
        } else if (place == 'right') {
            obj.setAttribute("placement", "bottom-left");
        } else {
            obj.setAttribute("placement", "bottom");
            pos.left = pos.left - 8;
        }
    }

    $(obj).css({
        "font-family": selectGlobalFont(chartObject.m_defaultfontfamily),
        "visibility": "",
        "zIndex": chartObject.m_zIndex + 1,
        "left": pos.left + "px",
        "top": pos.top + "px",
    });
    /*DAS-701:tooltip while having scroll,ui is breaking-overflow only for default tooltip*/
    if(obj.className != "toolTipDivForCustom"){
    	$(innerDiv).css({
            "margin" : "18px 8px 18px 8px",
            "max-height":"277px",
            "overflow":"auto"
         });
    }
    if (!IsBoolean(isTouchEnabled) && this.m_chart.m_dashboard !== "") {
        $(obj).hover(function() {
            $(obj).remove();
        }, function() {
            $(obj).remove();
        });
    }

    if (chartObject.m_autotooltiphide) {
        setTimeout(function() {
            if (obj !== undefined) {
                /** .remove() of jQuery won't work in IE for plain object, Need to wrap inside $ **/
                $(obj).remove();
            }
        }, chartObject.m_tooltiphidetimeout);
    }
}
};

Tooltip.prototype.getTrendToolTip = function(tooltipContent, ShowHighlighter) {
	
 	/** Mobile view tooltip drawing */
	if (dGlobals.layoutType == "MobileLayout" && (this.m_chart.m_mobiletooltipstyle !== undefined) && (this.m_chart.m_mobiletooltipstyle == "top")) {
		if (IsBoolean(this.m_chart.isMaximized)) {
			this.m_chart.removeMobileToolTipDiv()
			this.drawMobileViewTooltip(tooltipContent, ShowHighlighter);
		}
	} else {
		var chartObject = this.m_chart;
		chartObject.removeToolTipDiv();
		var obj = document.createElement("div");
		document.body.appendChild(obj);
		var cls = (IsBoolean(chartObject.m_customtextboxfortooltip) && IsBoolean(chartObject.m_customtextboxfortooltip.dataTipType == "Custom")) ? "toolTipDivForCustom" : "toolTipDiv";
		obj.setAttribute("class", "trendToolTipDiv");
		obj.setAttribute("id", "toolTipDiv");
		obj.innerHTML = tooltipContent;
		$(obj).css({"width" : chartObject.m_customtooltipwidth + (chartObject.m_customtooltipwidth !== "auto" ? "px" : "")});
		var pos = {left: pageX * 1 + 15 * 1, top: pageY * 1 + 10 * 1};
		var left = pageX - obj.clientWidth * 1;
		var place;
		
		var top = pageY - obj.clientHeight * 1 - 10;
		if ((mouseY * 1 + obj.clientHeight) >= chartObject.getStartY() && (top * 1 > 0)) {
			pos.top = top - 16;
			if(cls == "toolTipDivForCustom") {
				pos.top = pos.top - 4;
			}
				obj.setAttribute("placement", "bottom");
		} else {
			pos.top = pos.top + 10;
				obj.setAttribute("placement", "bottom");
		}
		// CHANGE: For tooltip design
		//pos.left = pos.left - ((obj.clientWidth / 2) + 12);
		var parentDiv = document.getElementById("draggablesParentDiv" + chartObject.m_dashboard.m_id);
		var scrollLeft = parentDiv.scrollLeft;
        var scrollTop = parentDiv.scrollTop;
		var offset = $(parentDiv).offset();
		var PageTop =  offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
		var PageLeft = offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft; 
		var lt = chartObject.m_left * 1+ PageLeft + (chartObject.m_width/2) -  (obj.clientWidth/2 );
		if(lt<=0)lt=PageLeft;
		var tp = chartObject.m_top * 1 + PageTop + (chartObject.m_height*1) - 15;// - obj.clientHeight;
		
		/** Adjust if trends going out of boundary DAS-709**/
		var ht = parseFloat(chartObject.m_height);	
		
		if (tp + ht + 10 * 1 + (obj.clientHeight * 1) + 20 > window.pageYOffset + window.innerHeight) {
			obj.setAttribute("placement", "top");
			tp = chartObject.m_top * 1 + PageTop-62;
/*			lt = lt + 8;
*/		}
		else{
			tp = chartObject.m_top * 1 + PageTop + (chartObject.m_height*1) - 15;
			obj.setAttribute("placement", "bottom");
		}
		/*$(obj).css({
			"font-family" :  selectGlobalFont(chartObject.m_defaultfontfamily),
			"visibility" : "",
			"zIndex" : chartObject.m_zIndex + 1,
			"left": pos.left + "px",
			"top": pos.top + "px",
		});*/
		$(obj).css({
			"font-family" :  selectGlobalFont(chartObject.m_defaultfontfamily),
			"visibility" : "",
			"zIndex" : chartObject.m_zIndex + 1,
			"left": lt + "px",
			"top": tp + "px",
		}); 
		
		/**Set tooltip container background css property object*/
		var tooltipBGColor = hex2rgb(convertColorToHex(chartObject.m_tooltipbackgroundcolor), chartObject.m_tooltipbackgroundtransparency);		
		if ($(obj).hasClass("toolTipDivForCustom")) {
			 // for custom tooltip div
		    $(obj).css({
		    	"background-color": tooltipBGColor,
		    	"border": chartObject.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(chartObject.m_tooltipbordercolor))
		    });
		} else if(!IsBoolean(ShowHighlighter)) {
			 // for default tooltip div
		    $(obj).find("table").css("background-color", tooltipBGColor);
		    $(obj).find("td").each(function() {
		        $(this).css({
		            "background-color": tooltipBGColor,
		            "border": chartObject.m_tooltipborderwidth + "px solid " + hex2rgb(convertColorToHex(chartObject.m_tooltipbordercolor))
		        });
		    });
		}
		/** Added to control fontSize and color of tooltip */
		$(obj).find(".chart-tooltip td").css({
			"font-size": chartObject.m_tooltipfontsize + "px",
			"color": chartObject.m_tooltipfontcolor
		});
		/*if (!IsBoolean(isTouchEnabled)) {
			$(obj).hover(function() {
				$(obj).remove();
			}, function() {
				$(obj).remove();
			});
		}*/
		
		if (chartObject.m_autotooltiphide) {
			setTimeout(function() {
				if (obj !== undefined) {
					/** .remove() of jQuery won't work in IE for plain object, Need to wrap inside $ **/
					$(obj).remove();
				}
			}, chartObject.m_tooltiphidetimeout);
		}
	}
};

/** @description will draw mobile view tooltip of chart for top positions  **/
Tooltip.prototype.drawMobileViewTooltip = function(tooltipContent) {
    var temp = this;
    var horizontalTooltipMargin = (IsBoolean(temp.m_chart.getShowLegends()) && !IsBoolean(temp.m_chart.m_fixedlegend) && (temp.m_chart.m_legendposition == "horizontalTopLeft" || temp.m_chart.m_legendposition == "horizontalTopCenter" || temp.m_chart.m_legendposition == "horizontalTopRight") && !IsBoolean(temp.m_chart.scaleFlag)) ? temp.m_chart.m_topFloatingLegendMargin * temp.m_chart.minWHRatio() : 0;
    var topMargin = temp.getMarginForToolTip();
    var isHTopEnable = (horizontalTooltipMargin !== 0) ? true : false;
    var div = document.createElement("div");
    temp.m_tooltipheadertext = "";
    div.setAttribute("id", "mobileTooltipContent");
    $(div).css({
        "position": "absolute",
        "z-index": "inherit",
        "background": hex2rgb(temp.m_chart.m_tooltipbackgroundcolor, temp.m_chart.m_tooltipbackgroundtransparency),
        "width": "100%",
        "visible": "hidden",
        "top": topMargin * 1 + "px"
    })
    var firstInnerDiv = document.createElement("div");
    firstInnerDiv.style.position = "relative";
    var outerDiv = document.createElement("div");
    outerDiv.setAttribute('class', 'mobileviewTooltip');
    outerDiv.setAttribute("id", "mobiletooltip-outerDiv" + temp.m_chart.m_objectid);
    $(outerDiv).css({"padding-bottom" : "10px", "width" : "calc(100% - " + temp.m_chart.m_mobiletooltipleftmargin + "px)"});
    var innerDiv = document.createElement("div");
    innerDiv.innerHTML = tooltipContent;

    /** Set tooltip background color */
    var tooltipBGColor = hex2rgb(temp.m_chart.m_tooltipbackgroundcolor, temp.m_chart.m_tooltipbackgroundtransparency);
    var tooltipBordreColor = hex2rgb(temp.m_chart.m_tooltipbordercolor, temp.m_chart.m_tooltipbackgroundtransparency);
    if (temp.m_chart.m_customtextboxfortooltip.dataTipType == "Custom") { // for custom tooltip div
    	$(innerDiv).css({"font-family": selectGlobalFont(temp.m_defaultfontfamily)});
        $(innerDiv).find("p").each(function() {
            $(this).css({
                "display": "inline-block",
                "padding": "2px",
                "background-color": tooltipBGColor
            });
        });
    } else {
        $(innerDiv).find("table").removeClass("bdtooltip");
        $(innerDiv).find("tr").each(function() {
            if ($(this).hasClass("chart-tooltip-head-row")) {
                temp.m_tooltipheadertext = $(this)[0].outerText;
                $(this).css({
                    "display": "none",
                });
            } else {
                $(this).css({
                    "display": "inline-block",
                    "background-color": tooltipBGColor,
                    "border": "1px solid",
                    "border-color": tooltipBordreColor,
                    "border-radius": "20px",
                    "padding": "4px",
                    "margin-left": "4px"
                   });
                if ($(this).hasClass("chart-tooltip-highlight-row")) {
                    $(this).css({
                        "box-shadow": "0 1px 2px " + tooltipBordreColor + ", 0 1px 1px " + tooltipBordreColor + "",
                    });
                }
            }
        });
        $(innerDiv).find("table").css({
            "background-color": tooltipBGColor,
            "border": "none"
        });
        $(innerDiv).find("td").each(function() {
            $(this).css({
                "background-color": tooltipBGColor,
                "font-size": temp.m_chart.fontScaling(temp.m_tooltipfontsize) + "px",
                "color": temp.m_tooltipfontcolor,
                "font-family": selectGlobalFont(temp.m_defaultfontfamily),
                "border": "none"
            });
        });
        var labelObj = document.createElement("div");
        var labelObjSpan = document.createElement("span");
        labelObjSpan.appendChild(document.createTextNode(temp.m_tooltipheadertext));
        $(labelObj).append(labelObjSpan);
        $(labelObj).css({
            "position": "relative",
            "font-size": temp.m_chart.fontScaling(temp.m_tooltipfontsize) + "px",
            "font-family": selectGlobalFont(temp.m_defaultfontfamily),
            "padding": "5px",
            "margin-left": temp.m_chart.m_mobiletooltipleftmargin + "px"
        });
        div.appendChild(labelObj);
    }
    div.appendChild(firstInnerDiv);
    $(outerDiv).append(innerDiv);
    $(firstInnerDiv).append(outerDiv);
    temp.m_chart.m_draggableDiv.appendChild(div);
    var maxWidth = $(outerDiv).outerWidth(true);
    var items = $(innerDiv).children();
    var actualWidth = 0;
    var setVisible = function(elem) {
        elem.css('visibility', 'visible');
    };
    var setInvisible = function(elem) {
        elem.css('visibility', 'hidden');
    };
    for (var i = 0; i < items.length; i++) {
        actualWidth += $(items[i]).outerWidth(true);

    }

    if (navigator.userAgent.match(/(iPad|iPhone)/g) ? true : false) {
        $(outerDiv).addClass("mobileviewTooltip-iPhoneScrollBar"); //Added for smooth scroll in iPhone
    } else {
        $(outerDiv).removeClass("mobileviewTooltip-iPhoneScrollBar");
    }
    if (isHTopEnable) {
        $("#legendContent" + temp.m_chart.m_objectid).css('visibility', 'hidden');
        $("#left-button" + temp.m_chart.m_objectid).css('display', 'none');
        $("#right-button" + temp.m_chart.m_objectid).css('display', 'none');
    }
};
/** @description method returns margin for top floated legend **/
Tooltip.prototype.getMarginForToolTip = function () {
	var topOfLegend = 0;
	if ((!IsBoolean(this.m_chart.getShowGradient())) && (!IsBoolean(this.m_chart.m_showmaximizebutton)) && (!IsBoolean(this.m_chart.getTitle().m_showtitle)) && (!IsBoolean(this.m_chart.m_showsettingmenubutton))) {
	    topOfLegend = 0;
	} else {
		topOfLegend = this.m_chart.getMarginForTitle() * 1 - 15;
	}
	if (IsBoolean(this.m_chart.m_subTitle.m_showsubtitle)) {
	    topOfLegend = topOfLegend + this.m_chart.getMarginForSubTitle();
	} else {
	    topOfLegend = topOfLegend;
	}
	return topOfLegend;
};
/** @description Title class and methods to draw component title **/
function Title(m_chart) {
	this.base = TitleText;
	this.base();

	this.m_chart = m_chart;
	this.m_showtitle = true;
	this.m_align = "left";
	this.m_formattedDescription = "Title";
	this.m_titlebarheight = 25;
	this.m_gradientcolorsArray = [];
	this.m_chartLeftRightMargin = 5;
	this.ctx = "";
	this.m_selectedsortfield = {};
};
Title.prototype = new TitleText();
Title.prototype.getShowTitle = function() {
	return this.m_showtitle;
};
Title.prototype.setChart = function(m_chart) {
	this.m_chart = m_chart;
};
Title.prototype.init = function(m_chart) {
	this.setChart(m_chart);
	this.ctx = this.m_chart.ctx;
	//this.m_titleBarHeight = (this.m_fontsize > 20) ? 30 - (24 - this.m_fontsize) : 25;
	//setting titlebar height from component property
	this.m_titleBarHeight = this.m_chart.getTitleBarHeight();
	var serDec = "";
	var dsDec = this.getDescription();
	if( this.m_chart.m_componenttype === "sentiment_plot_chart" || this.m_chart.m_componenttype === "custom_chart"){
		dsDec;
	} else if(this.m_chart.m_dataProvider.length>0){
		if(this.m_chart.m_objecttype === "funnel"){
			serDec = this.m_chart.m_seriesDisplayNames.reduce(function(acc, item) { return item !== "" ? (acc === "" ? item : acc + ", " + item) : acc; }, "");
			dsDec=serDec + " data by " + this.m_chart.m_categoryDisplayNames[0];
		} else if(this.m_chart.m_objecttype == "chart"){
			var seriesName = (this.m_chart.m_componenttype === "tree_map_chart") ? this.m_chart.m_allSeriesDisplayNames : 
				(this.m_chart.m_componenttype == "trellis_chart") ? this.m_chart.m_gridheaderDisplayNames : 
				(this.m_chart.m_componenttype === "scattered_plot_chart") ? this.m_chart.m_displayFieldNames : 
				(this.m_chart.m_componenttype === "mitoplot_chart") ? this.m_chart.m_seriesNames : 
				(this.m_chart.m_componenttype === "knowledge_graph_chart") ? this.m_chart.m_sourceNames :
				(this.m_chart.m_componenttype === "box_plot_chart") ? this.m_chart.m_subCategoryDisplayNames : this.m_chart.m_seriesDisplayNames;
			serDec = (seriesName != undefined) ? seriesName.reduce(function(acc, item) { return item !== "" ? (acc === "" ? item : acc + ", " + item) : acc; }, "") : "";
			/**DAS-675 check if component dataset has category fileds name */
			serDec = (this.m_chart.m_categoryDisplayNames != undefined && this.m_chart.m_categoryDisplayNames.length>0) ? serDec + "Data By "+ (this.m_chart.m_categoryDisplayNames[0]) : serDec;
			dsDec=(this.m_chart.m_componenttype === "mitoplot_chart") ? this.m_chart.m_categoryNames + " " + serDec : (this.m_chart.m_componenttype === "scattered_plot_chart" || this.m_chart.m_componenttype === "tree_map_chart" || this.m_chart.m_componenttype === "trellis_chart" || this.m_chart.m_componenttype === "knowledge_graph_chart") ? serDec : (this.m_chart.m_componenttype === "candle_stick_chart") ? "Data by " + this.m_chart.m_categoryDisplayNames[0] : serDec;
			
		} else if (this.m_chart.m_objecttype == "datagrid" || this.m_chart.m_objecttype == "scorecard"){
			serDec = this.m_chart.m_gridheaderDisplayNames.reduce(function(acc, item) { return item !== "" ? (acc === "" ? item : acc + ", " + item) : acc; }, "");
			dsDec=serDec;
		}
	}
	var description=(IsBoolean(this.m_chart.m_title.m_showdatasetdescription) || IsBoolean(this.m_chart.m_showdatasetdescription)) ? dsDec : this.getDescription();
	if (!this.m_chart.m_designMode) {
		this.m_formattedDescription = this.m_chart.formattedDescription(this.m_chart, description);
	} else {
		this.m_formattedDescription = this.m_chart.formattedDescription(this.m_chart, description);
	}
	/** formatteddescription() will return description according to global variable value **/
	this.m_formattedDescription = this.calculatedDescription(this.m_formattedDescription, IsBoolean(this.m_chart.m_titletextwrap));
	/** calculatedDescription() will cut the text if subtitle text is big and flowing out of boundary **/

	var gradientcolorsArray = this.m_chart.m_gradientcolor.split(",");
	for (var i = 0; i < gradientcolorsArray.length; i++) {
		this.m_gradientcolorsArray[i] = convertColorToHex(gradientcolorsArray[i]);
	}
	this.m_fontColor = convertColorToHex(this.getFontColor());
	this.maxIconWidth = (IsBoolean(this.m_chart.m_showmaximizebutton)) ? 45 : 0;
	this.legendIconWidth = 0;
	this.startX = this.checkAlign();
	this.ctx.textBaseline = "middle";
	if (this.m_chart.m_componenttype === "knowledge_graph_chart") {
		this.startX = this.startX - 16;
	}
	this.startY = this.m_chart.m_y * 1 + (this.m_titleBarHeight - this.getFontSize()) / (1 + this.m_formattedDescription.length) + this.getFontSize() / (1 + this.m_formattedDescription.length);
};
Title.prototype.draw = function() {
	var temp = this;
	if (IsBoolean(this.m_chart.getShowGradient())) {
		this.drawTitleBox();
	}
	if (IsBoolean(this.m_chart.m_showmaximizebutton)) {
		this.drawMaxMinIcon();
	} else {
		$("#minmaxImage" + temp.m_chart.m_objectid).remove();
	}
	if (IsBoolean(this.m_chart.m_showsettingmenubutton)) {
		this.drawMenuSettingIcon();
	} else {
		$("#menuSettingImage" + temp.m_chart.m_objectid).remove();
	}
	if (!temp.m_chart.m_designMode) {
		this.drawLoaderIcon();
	}
	if (IsBoolean(this.m_chart.getTitle().m_showtitle)) {
		if (IsBoolean(this.m_chart.m_enablehtmlformate.title)) {
			this.drawTitleTextInHTML();
		}else{
			this.drawText();
		}
		// If html formate enable for title than underline can enable by html tag
		if (!IsBoolean(this.m_chart.m_enablehtmlformate.title)) {
			this.drawUnderLine(this.m_formattedDescription);
		}
	}
};
Title.prototype.drawTitleBox = function() {
	this.ctx.beginPath();
	this.ctx.fillStyle = this.getGradient();
	var x = this.m_chart.m_x * 1;
	var y = this.m_chart.m_y * 1;
	var w = this.m_chart.m_width * 1;
	var h = this.m_titleBarHeight;
	this.ctx.rect(x, y, w, h);
	this.ctx.fill();
	this.ctx.closePath();
};
Title.prototype.getGradient = function() {
	var grd = this.ctx.createLinearGradient(this.m_chart.m_x, this.m_chart.m_y,
		this.m_chart.m_x, this.m_chart.m_y * 1 + this.m_titleBarHeight * 1);
	grd.addColorStop(0.1, this.m_gradientcolorsArray[0]);
	grd.addColorStop(1.0, this.m_gradientcolorsArray[1]);
	return grd;
};
Title.prototype.drawImageIcons = function(id, src, x, y) {
	var temp = this;
	$("#" + id + temp.m_chart.m_objectid).remove();
	var image = document.createElement("img");
	image.setAttribute("id", id + "" + temp.m_chart.m_objectid);
	image.setAttribute("class", "minmaxImage");
	image.style.position = "absolute";

	var imageWidth = 17;
	var imageHeight = 17;
	if (IsBoolean(isTouchEnabled)) {
		if (this.m_titleBarHeight > 22)
			imageWidth = imageHeight = 22;
		else
			imageWidth = imageHeight = this.m_titleBarHeight;
	}
	image.style.top = y + "px";
	image.style.left = x + "px";
	image.style.width = imageWidth * this.m_chart.minWHRatio() + "px";
	image.style.height = imageHeight * heightRatio + "px";
	image.src = src;
	$("#draggableDiv" + temp.m_chart.m_objectid).append(image);
	return image;
};

Title.prototype.drawLoaderIcon = function() {
	var temp = this;
	var x = this.m_chart.m_width - this.m_chart.fontScaling(25) - ((IsBoolean(this.m_chart.m_showmaximizebutton) || IsBoolean(this.m_chart.m_showlegends)) ? 25 : 0) - (IsBoolean(this.m_chart.m_showsettingmenubutton) ? 25 : 0);
	var y = this.startY - this.m_chart.fontScaling(10);
	if ($("#loaderImage" + temp.m_chart.m_objectid).length) {
		$("#loaderImage" + temp.m_chart.m_objectid).css({
			"left": x + "px",
			"top": y + "px"
		});
		/** if loader already enabled, no need to create loader again, reposition the contentDiv **/
		$("#loaderImageContentArrow" + temp.m_chart.m_objectid).css({
			"z-index": (temp.m_chart.m_zIndex + 2),
			"left": x + "px",
			"top": (y * 1 + 25) + "px"
		});
		$("#loaderImageContent" + temp.m_chart.m_objectid).css({
			"z-index": (temp.m_chart.m_zIndex + 2),
			"font-family": selectGlobalFont(temp.m_chart.m_defaultfontfamily), 
			"left": 5 + "px",
			"top": (y * 1 + 35) + "px",
			"width": (temp.m_chart.m_width - 10) + "px",
			"height": 120 + "px"
		});
	} else {
		/** Create loader icon **/
		$("#loaderImage" + temp.m_chart.m_objectid).remove();
		var image = document.createElement("div");
		image.setAttribute("id", "loaderImage" + temp.m_chart.m_objectid);
		image.setAttribute("class", "loaderImage");
		$("#draggableDiv" + temp.m_chart.m_objectid).append(image);
		$("#loaderImage" + temp.m_chart.m_objectid).css({
			"z-index": (temp.m_chart.m_zIndex + 2),
			"left": x + "px",
			"top": y + "px"
		}).on("click", function() {
			$("#loaderImageContent" + temp.m_chart.m_objectid).toggle("slide", {
				direction: "up"
			}, 200);
			$("#loaderImageContentArrow" + temp.m_chart.m_objectid).toggle();
		}).append('<div style="position:absolute;height:100%;width:100%;left:0px;top:0px;" class="la-ball-clip-rotate la-dark la-lg loaderImageRotation"><div style="border-width:2px;border-color:'+convertColorToHex(this.getFontColor())+';height:80%;width:80%;"></div></div>');

		/** Create loaderContent icon **/
		$("#loaderImageContentArrow" + temp.m_chart.m_objectid).remove();
		var loaderContentArrowDiv = document.createElement("div");
		loaderContentArrowDiv.setAttribute("id", "loaderImageContentArrow" + temp.m_chart.m_objectid);
		loaderContentArrowDiv.setAttribute("class", "loaderImageContentArrow");
		$("#draggableDiv" + temp.m_chart.m_objectid).append(loaderContentArrowDiv);
		$("#loaderImageContentArrow" + temp.m_chart.m_objectid).css({
			"z-index": (temp.m_chart.m_zIndex + 2),
			"left": x + "px",
			"top": (y * 1 + 25) + "px"
		});

		/** Create loaderContent container **/
		$("#loaderImageContent" + temp.m_chart.m_objectid).remove();
		var loaderContentDiv = document.createElement("div");
		loaderContentDiv.setAttribute("id", "loaderImageContent" + temp.m_chart.m_objectid);
		loaderContentDiv.setAttribute("class", "loaderImageContent");
		$("#draggableDiv" + temp.m_chart.m_objectid).append(loaderContentDiv);
		$("#loaderImageContent" + temp.m_chart.m_objectid).css({
			"z-index": (temp.m_chart.m_zIndex + 2),
			"font-family": selectGlobalFont(temp.m_chart.m_defaultfontfamily), 
			"left": 5 + "px",
			"top": (y * 1 + 35) + "px",
			"width": (temp.m_chart.m_width - 10) + "px",
			"height": 120 + "px"
		});
		$("#loaderImageContent" + temp.m_chart.m_objectid).hide();
		$("#loaderImageContentArrow" + temp.m_chart.m_objectid).hide();
	}
	if (IsBoolean(this.m_chart.m_showloaderbutton)) {
		this.showLoaderIcon();
	} else {
		this.hideLoaderIcon();
	}
};
Title.prototype.showLoaderIcon = function() {
	var temp = this;
	if (temp.m_chart !== "") {
		$("#loaderImage" + temp.m_chart.m_objectid).show();
	}
};
Title.prototype.hideLoaderIcon = function() {
	var temp = this;
	if (temp.m_chart !== "") {
		$("#loaderImage" + temp.m_chart.m_objectid).hide();
	}
};
Title.prototype.clearLoaderContent = function() {
	var temp = this;
	$("#loaderImageContent" + temp.m_chart.m_objectid).html("");
};
Title.prototype.setLoaderContent = function(content, status) {
	var temp = this;
	if (temp.m_chart !== "") {
		if (status == "progress") {
			$("#loaderImageContent" + temp.m_chart.m_objectid).prepend(function(n) {
				return "<div class='loaderImageContentMsg'>" + content + "</div>";
			});
		} else if (status == "completed") {
			$("#loaderImageContent" + temp.m_chart.m_objectid).html("<div class='loaderImageContentMsg'>" + content + "</div>");
			$("#loaderImageContent" + temp.m_chart.m_objectid).hide();
			$("#loaderImageContentArrow" + temp.m_chart.m_objectid).hide();
		} else {
			$("#loaderImageContent" + temp.m_chart.m_objectid).html("");
			$("#loaderImageContent" + temp.m_chart.m_objectid).hide();
			$("#loaderImageContentArrow" + temp.m_chart.m_objectid).hide();
		}
	}
};

Title.prototype.drawMenuSettingIcon = function() {
	var temp = this;
	var x = (IsBoolean(this.m_chart.m_showmaximizebutton)|| (IsBoolean(this.m_chart.m_showlegends) && IsBoolean(this.m_chart.m_fixedlegend))) ? this.m_chart.m_width - this.m_chart.fontScaling(25) - 30 : this.m_chart.m_width - this.m_chart.fontScaling(25);
	var y = this.startY - this.m_chart.fontScaling(10);
	var fontSize = this.m_chart.fontScaling(16);
	var imageMenu = this.m_chart.drawFontIcons("menuSettingImage", "", x, y, "bd-settings-1", fontSize);
	if (!temp.m_chart.m_designMode) {
		imageMenu.onclick = function() {
			$("#MenuSettingTooltipDiv").remove();
			if (IsBoolean(temp.m_chart.isMenuSelected)) {
				$("#menuContent" + temp.m_chart.m_objectid).toggle("slide", {
					direction: "up"
				}, 200);
				temp.m_chart.isMenuSelected = false;
			} else {
				temp.openMenu();
				temp.m_chart.isMenuSelected = true;
			}
		};
	}
	var zindex = 10000;
	var tooltip = "Actions";
	tooltip = temp.m_chart.formattedDescription(temp.m_chart, tooltip);
	var fontfamily = selectGlobalFont(this.m_fontfamily);
	var fontsize = 12 + "px";
	var right = (IsBoolean(this.m_chart.m_showmaximizebutton) || (IsBoolean(this.m_chart.m_showlegends) && IsBoolean(this.m_chart.m_fixedlegend))) ? this.m_chart.fontScaling(50)-30 + "px" : this.m_chart.fontScaling(30)-25 + "px";
	var cls = (IsBoolean(this.m_chart.m_showmaximizebutton) || (IsBoolean(this.m_chart.m_showlegends) && IsBoolean(this.m_chart.m_fixedlegend))) ? "settingIcon" : "minMax";
	
	var top = (this.startY +10) + "px";
	if (!IsBoolean(isTouchEnabled)) {
		if (!temp.m_chart.m_designMode) {
			$("#menuSettingImage" + temp.m_chart.m_objectid).hover(function(e) {
				var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_chart.m_dashboard.m_id);
				var scrollLeft =  parentDiv.scrollLeft;
				var scrollTop =  parentDiv.scrollTop;
				var offset = $(parentDiv).offset();
				var PageTop =  offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
				var PageLeft = offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft;
				var top = e.pageY - e.offsetY + $(this)[0].offsetHeight - PageTop + 1 + "px";//comment this for overlap
				var left = e.pageX - e.offsetX+ ($(this)[0].offsetWidth/2) - PageLeft + 8 + "px";
				
				var tooltipDiv = document.createElement("div");
				tooltipDiv.innerHTML = tooltip;
				tooltipDiv.setAttribute("class", cls);
				tooltipDiv.setAttribute("placement", "bottom");
				tooltipDiv.setAttribute("id", "MenuSettingTooltipDiv");
				/*$(tooltipDiv).css({
					"font-family": fontfamily,
					"font-size": fontsize,
					"top": top,
					"right": right,
					"z-index": zindex,
					"border": "1px solid #e0dfdf",
					"padding": "5px",
					"position": "absolute",
					"background-color": "#ffffff"
				});*/
				$(tooltipDiv).css({
					"font-family": fontfamily,
					"font-size": fontsize,
					"top": top,
					"left": left,
					"z-index": zindex,
					"border": "1px solid #e0dfdf",
					"padding": "24px",
					"position": "absolute",
					"border-radius": "6px",
					"background-color": "#ffffff"
				});
				//change right to left in css key
				//$("#draggableDiv" + temp.m_chart.m_objectid).append(tooltipDiv);//comment this for overlap
				$("#draggablesParentDiv" + temp.m_chart.m_dashboard.m_id).append(tooltipDiv);
				var lt = e.pageX - e.offsetX + ($(this)[0].offsetWidth) - tooltipDiv.offsetWidth- PageLeft + 28 + "px";
				$(tooltipDiv).css({"left": lt});
			}, function() {
				$("#MenuSettingTooltipDiv").remove();
			});
		}
	}
};

Title.prototype.openMenu = function() {
	var temp = this;
	var top = this.m_chart.getTitleBarHeight()/2 + 7;
	var right = ( (IsBoolean(this.m_chart.m_showlegends) && IsBoolean(this.m_chart.m_fixedlegend)) || IsBoolean(this.m_chart.m_showmaximizebutton) ? 50 : 15);
	var container = this.actionPaletteCss({
		"id": "menuContent" + temp.m_chart.m_objectid,
		"cls": "legend",
		"overflow": "auto",
		"top": top * 1 + "px",
		"height": "auto",
		"width": "110px",
		"right": right + "px"
	});
		
	var menuTable = document.createElement("div");
	$(menuTable).css({
		"width":"100%",
		"height":"100%"
	});
	$(container).append(menuTable);
	var actionobject = this.getActionObjects();
	var menuArr = getDuplicateArray(actionobject.menuArray);
	var imgClass = getDuplicateArray(actionobject.imgClass);
	for (var i = 0; i < menuArr.length; i++) {
		var getId = menuArr[i].replace(" ", '');
	
		var div = document.createElement("div");
		div.setAttribute("id", getId+this.m_chart.m_objectid);
		
		$(div).css({
			height:"30px",
			borderBottom:"1px solid #dcdcdc",
			margin:"2px 0px",
			cursor:"pointer",
			fontFamily:selectGlobalFont(this.m_fontfamily)
		});
		menuTable.appendChild(div);
		switch(menuArr[i]){
		case "Show Data":
			$(div).click({"menu": menuArr[i]}, function(e){
				temp.m_chart.hideToolTip();
				if(IsBoolean(temp.showDataCondition())){
					temp.m_chart.plugin.showData();
				} else {
					alertPopUpModal({type:'info', message:'No data to display', timeout: '3000'});
				}
			});
			break;
		case "Sort":
			$("#"+menuArr[i]+this.m_chart.m_objectid).hover(function(){
				temp.m_chart.hideToolTip();
				temp.openSortMenu();
				$("#menuSortContent" + temp.m_chart.m_objectid).hover(function(){
				    $("#menuSortContent" + temp.m_chart.m_objectid).removeClass('hidden');
				},function(){
					$("#menuSortContent" + temp.m_chart.m_objectid).addClass('hidden');
				});
			},function(){
				$("#menuSortContent" + temp.m_chart.m_objectid).addClass('hidden');
			});
			break;
		case "Export":
			$("#"+menuArr[i]+this.m_chart.m_objectid).hover(function(){
				temp.m_chart.hideToolTip();
				temp.openExportMenu();
				$("#menuExportContent" + temp.m_chart.m_objectid).hover(function(){
				    $("#menuExportContent" + temp.m_chart.m_objectid).removeClass('hidden');
				},function(){
					$("#menuExportContent" + temp.m_chart.m_objectid).addClass('hidden');
				});
			},function(){
				$("#menuExportContent" + temp.m_chart.m_objectid).addClass('hidden');
			});
			break;
		case "Chart":
			$("#"+menuArr[i]+this.m_chart.m_objectid).hover(function(){
				temp.m_chart.hideToolTip();
				temp.openDynamicChart();
				$("#dynamicChart" + temp.m_chart.m_objectid).hover(function(){
				    $("#dynamicChart" + temp.m_chart.m_objectid).removeClass('hidden');
				},function(){
					$("#dynamicChart" + temp.m_chart.m_objectid).addClass('hidden');
				});
			},function(){
				$("#dynamicChart" + temp.m_chart.m_objectid).addClass('hidden');
			});
			break;
		default:
			break;
		}
		
		var span = document.createElement("span");
		span.setAttribute("class", imgClass[i]);
		$(span).css({
			width:"30%",
			height:"100%", 
			padding:"8px",
			float:"left"
		});
		div.appendChild(span);
		
		var span1 = document.createElement("span");
		$(span1).css({
			width:"70%",
			height:"100%", 
			float:"right"
		});
		div.appendChild(span1);
		
		var text = document.createElement("text");
		$(text).css({
			textAlign:"left", 
			display:"block",
			fontSize:"12px",
			paddingLeft: "3px", 
			paddingTop:"8px",
			textOverflow:"ellipsis", 
			overflowX:"hidden",
			overflowY:"hidden"			
		});
		//text.setAttribute("title", menuArr[i]);
		$(text).html(menuArr[i]);
		span1.appendChild(text);
	}
};
Title.prototype.openExportMenu = function() {
	var temp = this;
	var top = this.m_chart.getTitleBarHeight()/2 + 7;
	var right = 110 + ((IsBoolean(this.m_chart.m_showlegends) && IsBoolean(this.m_chart.m_fixedlegend)) || IsBoolean(this.m_chart.m_showmaximizebutton) ? 50 : 15);
	var div = this.actionPaletteCss({
		"id": "menuExportContent" + temp.m_chart.m_objectid,
		"cls": "legend",
		"overflow": "auto",
		"top": top * 1 + "px",
		"height": "auto",
		"width": "90px",
		"right": right+"px"
	});
	
	var exportTable = document.createElement("div");
	$(exportTable).css({width: "100%", "height":"100%"});
	$(div).append(exportTable);
	this.getMenuExportContent(exportTable);
};
Title.prototype.getMenuExportContent = function(exportTable) {
	var temp = this;
	var dynamicOption = {label: [], icon: []};
	(this.m_chart.m_chartactions["export"]["actions"]).map(function(obj){
		dynamicOption.label.push(obj["label"]);
		dynamicOption.icon.push("bdmenuicon icons "+obj["icon"]);
	});
	
	for (var i = 0; i < dynamicOption.label.length; i++) {
		var div = document.createElement("div");
		div.setAttribute("id", dynamicOption.label[i]+this.m_chart.m_objectid);
		
		$(div).css({
			height:"auto",
			width: "100%",
			display: "table",
			overfow: "hidden",
		    margin:"2px 0px 2px 0px",
			borderBottom:"1px solid #dcdcdc",
			background:"#FFFFFF",
			fontFamily:selectGlobalFont(this.m_fontfamily)
		});
		$(div).click({"field": dynamicOption.label[i]}, function(e){
			if(temp.m_chart.getAllFieldsName() !== undefined){
				temp.ExportPluginCall(e.data.field);
			}
		});
		
		exportTable.appendChild(div);
		
		var span = document.createElement("span");
		span.setAttribute("class", dynamicOption.icon[i]);
		//span.setAttribute("title", "grid");
		$(span).css({
			width:"30%",
			height:"100%", 
			padding:"4px",
			float:"left"
		});
		div.appendChild(span);
		
		var span1 = document.createElement("span");
		$(span1).css({
			width:"70%",
			height:"100%", 
			float:"right",
			padding: "6px 0px 6px 3px"
		});
		div.appendChild(span1);
		
		var text = document.createElement("text");
		$(text).css({
			display:"table-cell",
			fontSize:"12px",
			textOverflow:"ellipsis"
		});
		//text.setAttribute("title", dynamicOption.label[i]);
		$(text).html(dynamicOption.label[i]);
		span1.appendChild(text);
	}
	return exportTable;
};
Title.prototype.openSortMenu = function() {
	var temp = this;
	var top = this.m_chart.getTitleBarHeight()/2 + 7;
	var right = 110 + ((IsBoolean(this.m_chart.m_showlegends) && IsBoolean(this.m_chart.m_fixedlegend)) || IsBoolean(this.m_chart.m_showmaximizebutton) ? 50 : 15);
	var div = this.actionPaletteCss({
		"id": "menuSortContent" + temp.m_chart.m_objectid,
		"cls": "legend",
		"overflow": "auto",
		"top": top * 1 + "px",
		"height": "auto",
		"width": temp.m_chart.m_sortpanelwidth+"px",
		"right": right+"px"
	});
	
	var sortTable = document.createElement("div");
	$(sortTable).css({"width":"100%", "padding": "0px 2px"});
	$(div).append(sortTable);
	this.getMenuSortContent(sortTable);
	
	var menuSortDivheight = $(div).height();
	var availableHeight = (temp.m_chart.m_height - this.m_chart.getTitleBarHeight());
	if (menuSortDivheight * 1 > availableHeight * 1) {
		$(div).css({
			"height": availableHeight + "px",
		});
	}
};
Title.prototype.getMenuSortContent = function(sortTable) {
	var temp = this;
	this.menuSortArray = [];
	this.visibleFields = [];
	this.visibleFieldColor = [];
	for(var j = 0; j < this.m_chart.getCategoryNames().length; j++){
		(this.visibleFields).push(this.m_chart.getCategoryNames()[j]);
		(this.visibleFieldColor).push(this.m_chart.getCategoryColorsForAction()[j]);
	}
	for(var k = 0; k < this.m_chart.getSeriesNames().length; k++){
		(this.visibleFields).push(this.m_chart.getSeriesNames()[k]);
		(this.visibleFieldColor).push(this.m_chart.getSeriesColorsForAction()[k]);
	}
	/**If field is invisible, removing that field from sortArray**/
	this.menuSortArray = getDuplicateArray(this.visibleFields);
	/** when there is no Field present, None should not be displayed **/
	if(this.menuSortArray.length > 0){
		this.menuSortArray.push("None");
	}
	var isSelectedSortFieldFound = false;
	for (var i = 0; i < this.menuSortArray.length; i++) {
		this.menuSortArray[i] = getStringARSC(this.menuSortArray[i]);
		
		var div = document.createElement("div");
		div.setAttribute("id", this.menuSortArray[i]+this.m_chart.m_objectid);
		
		$(div).css({
			height:"auto",
			width: "100%",
			display: "table",
			overfow: "hidden",
		    margin:"2px 0px 2px 0px",
			borderBottom:"1px solid #dcdcdc",
			borderLeft:"2px solid "+this.visibleFieldColor[i],
			background:"#FFFFFF",
			fontFamily:selectGlobalFont(this.m_fontfamily)
		});
		$(div).click({"field": temp.visibleFields[i], "color": this.visibleFieldColor[i]}, function(e){
			$(this).siblings().css({"background": "#FFFFFF"});
			$(this).css({"background": hex2rgb(e.data.color, 0.1)});
			var order = "";
			if($(this).find(".sortingFieldsIcon").hasClass("bd-arrowup")){
				$(".sortingFields").find(".sortingFieldsIcon").removeClass("bd-arrowup").removeClass("bd-arrowdown");
				$(this).find(".sortingFieldsIcon").addClass("bd-arrowdown");
				temp.m_selectedsortfield.name = e.data.field;
				temp.m_selectedsortfield.icon = "bd-arrowdown";
				order = ((temp.m_chart.m_categoryNames) && (temp.m_chart.m_categoryNames[0] === e.data.field)) ? "desc" : "numdesc";
				temp.SortingCall(e.data.field,order);
			}else {
				if($(this).find(".sortingFieldsIcon").hasClass("bd-cross")){
					temp.SortingCall(e.data.field,"none");
					temp.m_selectedsortfield.name = "";
					temp.m_selectedsortfield.icon = "bd-cross";
				}else{
					$(".sortingFields").find(".sortingFieldsIcon").removeClass("bd-arrowup").removeClass("bd-arrowdown");
					$(this).find(".sortingFieldsIcon").addClass("bd-arrowup");
					temp.m_selectedsortfield.name = e.data.field;
					temp.m_selectedsortfield.icon = "bd-arrowup";
					order = ((temp.m_chart.m_categoryNames) && (temp.m_chart.m_categoryNames[0] === e.data.field)) ? "asc" : "numasc";
					temp.SortingCall(e.data.field,order);
				}
			}
		});
		
		sortTable.appendChild(div);
		
		var span = document.createElement("span");
		span.setAttribute("userclass", i);
		$(span).css({
			width:"30%",
			height:"auto",
			padding: "6px",
			color: this.visibleFieldColor[i],
			fontSize:"12px",
			float:"right"
		});
		div.appendChild(span);
		
		var span1 = document.createElement("span");
		$(span1).css({
			width:"70%",
			height:"auto",
			padding: "6px 0px 6px 3px",
			float:"left"
		});
		div.appendChild(span1);
		
		var text = document.createElement("text");
		$(text).css({
			textAlign:"left", 
			display:"table-cell",
			fontSize:"12px",
			textOverflow:"ellipsis"	
		});
		span1.appendChild(text);
		
		if(this.menuSortArray[i] === "None"){
			//text.setAttribute("title", "Reset");
			div.setAttribute("class", "sort_None sortingFields");
			$(div).css({borderBottom:"none"});
			span.setAttribute("class", this.menuSortArray[i] + i + " "+ this.m_chart.m_chartactions["sort"]["actions"]["icon"][2] + " sortingFieldsIcon");
			$(text).html(this.menuSortArray[i]);
		}else{
			//text.setAttribute("title", this.m_chart.getAllFieldsDisplayName()[i]);
			div.setAttribute("class", "sort_"+this.visibleFields[i]+" sortingFields");
			if(this.m_selectedsortfield && (this.m_selectedsortfield.name === this.visibleFields[i]) && !IsBoolean(isSelectedSortFieldFound)){
				span.setAttribute("class", this.m_selectedsortfield.icon + " sortingFieldsIcon");
				$(div).css({"background": hex2rgb(this.visibleFieldColor[i], 0.1)});
				isSelectedSortFieldFound = true;
			}else{
				span.setAttribute("class", "sortingFieldsIcon");
			}			
			$(text).html(this.m_chart.getAllFieldsDisplayName()[i]);
		}
	}
};
Title.prototype.showDataCondition = function() {
	if(this.m_chart.getAllFieldsName() !== undefined){
		if((this.m_chart.getAllFieldsName()).length>0){
			return true;
		}
	}
};

Title.prototype.actionPaletteCss = function(obj) {
	var temp = this;
	$("#"+obj.id).remove();
	var div = document.createElement("div");
	div.setAttribute("id", obj.id);
	div.setAttribute("class", obj.cls);
	$(div).css({
		"overflow": obj.overflow,
		"top": obj.top,
		"height": obj.height,
		"right": obj.right,
		"width": obj.width,
		"zIndex": temp.m_chart.m_zIndex + 3,
		"position": "absolute",
		"visible": "hidden",
		"cursor": "pointer"
	});
	this.m_chart.m_draggableDiv.appendChild(div);
	return div;
};
Title.prototype.closeMenu = function() {
	$("#menuExportContent" + this.m_chart.m_objectid).addClass('hidden');
	$("#menuContent"+this.m_chart.m_objectid).hide();
	this.m_chart.isMenuSelected = false;
};
Title.prototype.SortingCall = function(menuInfo,order) {
	var compId = this.m_chart.m_referenceid;
	try{
		if(order === "none"){
			sdk.removeDataSetFilter(compId);
		}else{
			sdk.applyDataSetFilter(compId, ["order by ["+menuInfo+"] "+order]);
		}
		sdk.reloadDataset( [ compId ] );
	}catch(e){
		console.log(e);
	}
};
Title.prototype.ExportPluginCall = function(menuInfo) {
	/** closeMenu() has been called to hide menu, otherwise screenshot of open menu will appear in JPEG,PNG,PDF etc **/
	this.closeMenu();
	switch(menuInfo){
		case "Excel":
			this.m_chart.plugin.exportToExcel();
			break;
		case "JPEG":
			this.m_chart.plugin.exportToJPEG();
			break;
		case "PNG":
			this.m_chart.plugin.exportToPNG();
			break;
		case "PDF":
			this.m_chart.plugin.exportToPDF();
			break;
		case "PPT":
			this.m_chart.plugin.exportToPPT();
			break;
		default:
			break;
	}
};
Title.prototype.drawMaxMinIcon = function() {
	var temp = this;
	var startY = this.m_chart.m_y * 1 + (this.m_titleBarHeight - this.getFontSize()) / 2 + this.getFontSize() / 2;
	/*var x = this.m_chart.m_width - this.m_chart.fontScaling(25);*/
	/**getting x coordinate value (fetching from component in case of DTC)**/
	var x = this.m_chart.getXpoint();
	var y = startY - this.m_chart.fontScaling(10);
	var fontSize = this.m_chart.fontScaling(16);
	if (IsBoolean(isTouchEnabled)) {
		if (this.m_titleBarHeight >= 22)
			y = (this.m_titleBarHeight - 22) / 2;
		else
			y = 0.5;
	}
	/**DAS -595 change max/min icon colorbased on title color */
		temp.m_chart.m_maxminiconscolor.maxiconcolor = temp.m_fontcolor;
		temp.m_chart.m_maxminiconscolor.miniconcolor = temp.m_fontcolor;
		temp.m_chart.m_maxminicons.maxiconshape = '<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Icon/Maximise-" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Maximize" transform="translate(2.000000, 2.000000)" fill="'+temp.m_chart.m_maxminiconscolor.maxiconcolor+'"><path d="M13,2 C12.4477,2 12,1.55228 12,1 C12,0.447715 12.4477,0 13,0 L19,0 C19.5523,0 20,0.447715 20,1 L20,7 C20,7.55228 19.5523,8 19,8 C18.4477,8 18,7.55228 18,7 L18,3.41421 L12.7071,8.70711 C12.3166,9.09763 11.6834,9.09763 11.2929,8.70711 C10.9024,8.31658 10.9024,7.68342 11.2929,7.29289 L16.5858,2 L13,2 Z M7.29289,11.2929 C7.68342,10.9024 8.31658,10.9024 8.70711,11.2929 C9.09763,11.6834 9.09763,12.3166 8.70711,12.7071 L3.41421,18 L7,18 C7.55228,18 8,18.4477 8,19 C8,19.5523 7.55228,20 7,20 L1,20 C0.447715,20 0,19.5523 0,19 L0,13 C0,12.4477 0.447715,12 1,12 C1.55228,12 2,12.4477 2,13 L2,16.5858 L7.29289,11.2929 Z" id="Shape"></path></g></g></svg>';
		temp.m_chart.m_maxminicons.miniconshape = '<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Icon/Minimise" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Minimize" transform="translate(2.000000, 2.000000)" fill="'+temp.m_chart.m_maxminiconscolor.miniconcolor+'"><path d="M18.2929,0.292893 C18.6834,-0.0976311 19.3166,-0.0976311 19.7071,0.292893 C20.0976,0.683417 20.0976,1.31658 19.7071,1.70711 L14.4142,6.99999992 L18,6.99999992 C18.5523,6.99999992 19,7.44772 19,7.99999992 C19,8.55228 18.5523,8.99999992 18,8.99999992 L12,8.99999992 C11.4477,8.99999992 11,8.55228 11,7.99999992 L11,1.99999992 C11,1.44772 11.4477,0.999999925 12,0.999999925 C12.5523,0.999999925 13,1.44772 13,1.99999992 L13,5.58579 L18.2929,0.292893 Z M0.999999925,12 C0.999999925,11.4477 1.44772,11 1.99999992,11 L7.99999992,11 C8.55228,11 8.99999992,11.4477 8.99999992,12 L8.99999992,18 C8.99999992,18.5523 8.55228,19 7.99999992,19 C7.44772,19 6.99999992,18.5523 6.99999992,18 L6.99999992,14.4142 L1.70711,19.7071 C1.31658,20.0976 0.683417,20.0976 0.292893,19.7071 C-0.0976311,19.3166 -0.0976311,18.6834 0.292893,18.2929 L5.58579,13 L1.99999992,13 C1.44772,13 0.999999925,12.5523 0.999999925,12 Z" id="Shape"></path></g></g></svg>';
	var maxIconImage = temp.m_chart.m_maxminicons.maxiconshape;
	var minIconImage = temp.m_chart.m_maxminicons.miniconshape;
	//var image = this.m_chart.drawFontIcons("minmaxImage", "", x, y, (!IsBoolean(this.m_chart.isMaximized)) ? "icons "+this.m_chart.m_maxminicons.maxiconshape+"" : "icons "+this.m_chart.m_maxminicons.miniconshape+"", fontSize);
	var image = temp.m_chart.drawFontIcons("minmaxImage", "", x, y, (!IsBoolean(temp.m_chart.isMaximized)) ? maxIconImage : minIconImage, fontSize);
	
	image.onclick = function() {
		if (!temp.m_chart.m_designMode) {
			$("#menuContent"+temp.m_chart.m_objectid).remove();
			temp.m_chart.isMenuSelected = false;
			if (IsBoolean(temp.m_chart.isMaximized)) {
				$("#MaximizeTooltipDiv").remove();
				temp.m_chart.hideToolTip();
				temp.m_chart.minimize();
			} else {
				$("#MaximizeTooltipDiv").remove();
				temp.m_chart.hideToolTip();
				temp.m_chart.maximize();
			}
		}
	};
	var zindex = 10000;
	var tooltip = (!IsBoolean(temp.m_chart.isMaximized)) ? temp.m_chart.m_maximizeicontitle : temp.m_chart.m_minimizeicontitle;
	tooltip = temp.m_chart.formattedDescription(temp.m_chart, tooltip);
	var fontfamily = selectGlobalFont(this.m_fontfamily);
	var fontsize = 14 + "px";
	//var left = this.m_chart.m_width - 95 + "px";
	//changed left to right for font scaling issues
	//var right =  this.m_chart.fontScaling(30) + "px";
	//var top = (IsBoolean(temp.m_chart.isMaximized))?(this.startY+20) + "px":this.m_chart.m_top+(this.startY+10) + "px";//uncomment this for overlap
	//var right =(IsBoolean(temp.m_chart.isMaximized))?x-38:this.m_chart.m_left+x-50;//uncomment this for overlap
	var top = (this.startY + 10) + "px";//comment this for overlap
	if (!IsBoolean(isTouchEnabled)) {
		$("#minmaxImage" + temp.m_chart.m_objectid).hover(function(e) {
			if (!temp.m_chart.m_designMode) {
				var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_chart.m_dashboard.m_id);
				var scrollLeft =  parentDiv.scrollLeft;
				var scrollTop =  parentDiv.scrollTop;
				var offset = $(parentDiv).offset();
				var PageTop =  offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
				var PageLeft = offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft;
				var top = e.pageY - e.offsetY + $(this)[0].offsetHeight - PageTop + 1 + "px";//comment this for overlap
				var left = e.pageX - e.offsetX+ ($(this)[0].offsetWidth/2) - PageLeft + 8 + "px";
		
				var tooltipDiv = document.createElement("div");
				tooltipDiv.innerHTML = tooltip;
				tooltipDiv.setAttribute("class", "minMax");
				tooltipDiv.setAttribute("placement", "bottom");
				tooltipDiv.setAttribute("id", "MaximizeTooltipDiv");
				/**getting right margin value (fetching from component in case of DTC)**/
				var right = "-5px";//temp.m_chart.getRightMargin();//comment this for overlap
				/*$(tooltipDiv).css({
					"font-family": fontfamily,
					"font-size": fontsize,
					"top": top,
					"right": right,
					"z-index": zindex,
					"border": "1px solid #e0dfdf",
					"padding": "5px",
					"position": "absolute",
					"background-color": "#ffffff"
				});*/
				$(tooltipDiv).css({
					"font-family": fontfamily,
					"font-size": fontsize,
					"top": top,
					"left": left,
					"z-index": zindex,
					"border": "0px solid #e0dfdf",
					"padding": "24px",
					"position": "absolute",
					"border-radius": "6px",
					"color":"#494950",
					"background-color": "#ffffff"
				});
				//change right to left in css key
				//$("#draggableDiv" + temp.m_chart.m_objectid).append(tooltipDiv);//comment this for overlap
				$("#draggablesParentDiv" + temp.m_chart.m_dashboard.m_id).append(tooltipDiv);
				var lt = e.pageX - e.offsetX + ($(this)[0].offsetWidth) - tooltipDiv.offsetWidth- PageLeft + 3 + "px";
				$(tooltipDiv).css({"left": lt});
			}
		}, function() {
			$("#MaximizeTooltipDiv").remove();
		});
	}
};

/** Method to open charts on runtime **/
Title.prototype.openDynamicChart = function() {
	var temp = this;
	var top = this.m_chart.getTitleBarHeight()/2 + 7;
	var right = 110 + ((IsBoolean(this.m_chart.m_showlegends) && IsBoolean(this.m_chart.m_fixedlegend)) || IsBoolean(this.m_chart.m_showmaximizebutton) ? 50 : 15);
	var div = this.actionPaletteCss({
		"id": "dynamicChart" + temp.m_chart.m_objectid,
		"cls": "legend",
		"overflow": "auto",
		"top": top * 1 + "px",
		"height": "auto",
		"width": "90px",
		"right": right+"px"
	});
	
	var dynamicTable = document.createElement("div");
	$(dynamicTable).css({width: "100%", "height":"100%"});
	$(div).append(dynamicTable);
	this.getDynamicChartContent(dynamicTable);
};
/** Setting up component json**/
Title.prototype.dynamicComponentJson = function(data, compName) {
	var temp = this;
	var dynChart = eval(Object.keys(data)[0]);
	var chartConf = new dynChart();
	/** set baseChartObject **/
	chartConf.m_actionChartObject = this.m_chart.m_actionChartObject;
	data[Object.keys(data)[0]]["Properties"]["Object"] = this.updateChartObjectDynamic(data[Object.keys(data)[0]]["Properties"]["Object"], compName, chartConf);
	
	chartConf.m_chartContainer = temp.m_chart.m_chartContainer;
	chartConf.oldoffset_left = temp.m_chart.oldoffset_left;
	chartConf.oldoffset_top = temp.m_chart.oldoffset_top;
	chartConf.oldm_width = temp.m_chart.oldm_width;
	chartConf.oldm_height = temp.m_chart.oldm_height;
	chartConf.isMaximized = temp.m_chart.isMaximized;
	chartConf.m_dashboard = temp.m_chart.m_dashboard;
	chartConf.m_zIndex = (IsBoolean(temp.m_chart.isMaximized)) ? 
			((temp.m_chart.m_dashboard !== "") ? 
					(temp.m_chart.m_dashboard.m_widgetsArray.length) * 1 + 3 : 
						temp.m_chart.m_zIndex) : 
				(temp.m_chart.oldzindex === undefined) ? 
						temp.m_chart.m_zIndex : 
							temp.m_chart.oldzindex;
	chartConf.oldzindex = (IsBoolean(temp.m_chart.isMaximized)) ? temp.m_chart.m_zIndex : temp.m_chart.oldzindex;
	
	chartConf.setProperty(data[Object.keys(data)[0]]["Properties"]);
	chartConf.setDataProvider(chartConf.m_actionChartObject.m_dataProvider);
	chartConf.setFields(this.updateChartFieldDynamic(compName, chartConf));
	chartConf.draw();
};

Title.prototype.updateChartFieldDynamic = function(compName, chartConf) {
	var fields = chartConf.m_actionChartObject.m_fieldsJson;
	for (var x = 0; x < fields.length; x++) {
		var fieldJson = fields[x];
		switch (compName) {
			case "Area":
				break;
				
			case "Bar":
				break;
			
			case "Bubble":
				if (fieldJson.Type === "Series") {
					fieldJson.ChartType = "line";
					fieldJson.LineWidth = "0";
					fieldJson.isFixedRadius = false;
					fieldJson.RadiusField = fieldJson.Name;
				}
				break;
			
			case "Column":
				fieldJson.ChartType = "column";
				break;
			
			case "Line":
				if (fieldJson.Type === "Series") {
					fieldJson.ChartType = "line";
					fieldJson.isFixedRadius = true;
					fieldJson.LineWidth = "1";
				}
				break;
			
			case "Pie":
				break;
			
			case "Spider":
				break;
				
			default:
				break;
		}
	}
	return fields;
};

/**setting common charts property when changing dynamically from action button**/
Title.prototype.updateChartObjectDynamic = function(chartObject, compName, chartConf) {
	var temp = this;
	var chartObjectJson = {
	    "objectID": chartConf.m_actionChartObject.m_objectId,
	    "height": temp.m_chart.m_height,
	    "width": temp.m_chart.m_width,
	    "x": (IsBoolean(temp.m_chart.isMaximized)) ? "10" : (temp.m_chart.oldoffset_left === undefined) ? temp.m_chart.chartJson.x : temp.m_chart.oldoffset_left,
	    "y": (IsBoolean(temp.m_chart.isMaximized)) ? "10" : (temp.m_chart.oldoffset_top === undefined) ? temp.m_chart.chartJson.y : temp.m_chart.oldoffset_top,
	    "subElement": {
	        "Globalkey": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.m_globalkey
	        },
	        "showSettingMenuButton": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["showSettingMenuButton"]
	        },
	        "Title": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["Title"]
	        },
	        "SubTitle": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["SubTitle"]
	        },
	        "xAxis": {
	            "invalidComp": ["Spider"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["xAxis"]
	        },
	        "yAxis": {
	            "invalidComp": ["Spider"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["yAxis"]
	        },
	        "designData": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson.m_designdata
	        },
	        "bgGradients": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["bgGradients"]
	        },
	        "bgGradientRotation": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["bgGradientRotation"]
	        },
	        "borderColor": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["borderColor"]
	        },
	        "borderRadius": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["borderRadius"]
	        },
	        "borderThickness": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["borderThickness"]
	        },
	        "autoaxisSetup": {
	            "invalidComp": ["Pie","Spider"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["autoaxisSetup"]
	        },
	        "baseZero": {
	            "invalidComp": ["Pie","Spider"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["baseZero"]
	        },
	        "minimumAxisValue": {
	            "invalidComp": ["Pie","Spider"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["minimumAxisValue"]
	        },
	        "maximumAxisValue": {
	            "invalidComp": ["Pie","Spider"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["maximumAxisValue"]
	        },
	        "zeroMarkerLine": {
	            "invalidComp": ["Pie","Spider"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["zeroMarkerLine"]
	        },
	        "zeroMarkerColor": {
	            "invalidComp": ["Pie","Spider"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["zeroMarkerColor"]
	        },
	        "shadowOpacity": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["shadowOpacity"]
	        },
	        "shadowColor": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["shadowColor"]
	        },
	        "Unit": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["Unit"]
	        },
	        "Precision": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["Precision"]
	        },
	        "SecondaryUnit": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["SecondaryUnit"]
	        },
	        "SignPosition": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["SignPosition"]
	        },
	        "NumberFormatter": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["NumberFormatter"]
	        },
	        "showLegends": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["showLegends"]
	        },
	        "legendfontColor": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["legendfontColor"]
	        },
	        "legendfontWeight": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["legendfontWeight"]
	        },
	        "legendfontSize": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["legendfontSize"]
	        },
	        "legendfontFamily": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["legendfontFamily"]
	        },
	        "legendfontStyle": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["legendfontStyle"]
	        },
	        "legendtextDecoration": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["legendtextDecoration"]
	        },
	        "hideLegendOnStart": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["hideLegendOnStart"]
	        },
	        "CustomTextBoxForToolTip": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["CustomTextBoxForToolTip"]
	        },
	        "tooltipBackgroundColor": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["tooltipBackgroundColor"]
	        },
	        "tooltipBackgroundTransparency": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["tooltipBackgroundTransparency"]
	        },
	        "tooltipBorderColor": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["tooltipBorderColor"]
	        },
	        "tooltipFontSize": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["tooltipFontSize"]
	        },
	        "customTooltipWidth": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["customTooltipWidth"]
	        },
	        "tooltipPrecision": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["tooltipPrecision"]
	        },
	        "tooltipHighlighter": {
	            "invalidComp": ["none"],
	            "value": chartConf.m_actionChartObject.chartJson[chartConf.m_actionChartObject.m_subelement]["tooltipHighlighter"]
	        }
	    }
	};
	
	for (var key in chartObjectJson) {
	    if (key === "subElement") {
	        for (var key1 in chartObjectJson["subElement"]) {
	            if (((chartObjectJson["subElement"][key1]["invalidComp"]).indexOf(chartObject[chartObject["subElement"]]["Type"]) < 0) && (chartObjectJson["subElement"][key1].value !== undefined)) {
	                chartObject[chartObject["subElement"]][key1] = chartObjectJson["subElement"][key1].value;
	            }
	        }
	    } else {
	        chartObject[key] = chartObjectJson[key];
	    }
	}
	return chartObject;
};

/** Setting component content when changing charts at runtime **/
Title.prototype.getDynamicChartContent = function(dynamicTable) {
	var temp = this;
	var dynamicOption = {dChart: [], dClass: [], icon: []};
	(this.m_chart.m_chartactions["chartviews"]["actions"]).map(function(obj){
		dynamicOption.dChart.push(obj["dChart"]);
		dynamicOption.dClass.push(obj["dClass"]);
		dynamicOption.icon.push("bdmenuicon icons "+obj["icon"]);
	});
	/** Add Default option **/
//	dynamicOption.dChart.push("Default");
//	dynamicOption.dClass.push("actionChart");
//	dynamicOption.icon.push("bdmenuicon icons bd-close");
	
	this.m_chart.m_actionChartObject = (this.m_chart.m_actionChartObject === "") ? this.m_chart : this.m_chart.m_actionChartObject;
	for (var i = 0; i < dynamicOption.dChart.length; i++) {
		var div = document.createElement("div");
		div.setAttribute("id", dynamicOption.dChart[i]+this.m_chart.m_objectid);
		
		$(div).css({
			height:"auto",
			width: "100%",
			display: "table",
			overfow: "hidden",
		    margin:"2px 0px 2px 0px",
			borderBottom:"1px solid #dcdcdc",
			background:"#ffffff",
			fontFamily:selectGlobalFont(this.m_fontfamily)
		});
		$(div).click({"field": dynamicOption.dClass[i], "CompName": dynamicOption.dChart[i]}, function(e){
			if(e.data.field !== "actionChart"){
				var configChart = {
					type: "get",
					url: dGlobals.componentJSUrl+"charts/"+e.data.field+".js",
					data: e.data,
					cache: true
				};
				$.when($.ajax(configChart)).then(function(complete, status) {
					temp.loadDataFile(configChart.data);
				});
			}else{
				if(temp.m_chart.m_actionChartObject && temp.m_chart.m_actionChartObject != ""){
					sdk.reloadDataset( [ temp.m_chart.m_actionChartObject.m_referenceid ] );
				}
			}
		});
		
		dynamicTable.appendChild(div);
		
		var span = document.createElement("span");
		span.setAttribute("class", dynamicOption.icon[i]);
		//span.setAttribute("title", "grid");
		$(span).css({
			width:"30%",
			height:"100%", 
			padding:"4px",
			float:"left"
		});
		div.appendChild(span);
		
		var span1 = document.createElement("span");
		$(span1).css({
			width:"70%",
			height:"100%", 
			float:"right",
			padding: "6px 0px 6px 3px"
		});
		div.appendChild(span1);
		
		var text = document.createElement("text");
		$(text).css({
			display:"block",
			display:"table-cell",
			fontSize:"12px",
			textOverflow:"ellipsis"
		});
		//text.setAttribute("title", dynamicOption.dChart[i]);
		$(text).html(dynamicOption.dChart[i]);
		span1.appendChild(text);
	}
	return dynamicTable;
};

/** Loading data files when dynamically changing the charts**/
Title.prototype.loadDataFile = function(data) {
	var temp = this;
	var config = {
		type: "get",
		url: dGlobals.componentJSONUrl+"default-theme/chart/"+data.field+".data",
		data: data.CompName,
		cache: true
	};
	$.when($.ajax(config)).then(function(complete, status) {
		temp.dynamicComponentJson(JSON.parse(complete),config.data);
	});
};

/** Getting objects for Action menu**/
Title.prototype.getActionObjects = function() {
	var actionmap = {menuArray: [], imgClass:[]};
	this.updateActionObjects();
	for (var key in this.m_chart.m_chartactions) {
		if(IsBoolean(this.m_chart.m_chartactions[key].enable)) {
			actionmap.menuArray.push(this.m_chart.m_chartactions[key]["properties"]["label"]);
			actionmap.imgClass.push(this.m_chart.m_chartactions[key]["properties"]["icon"])
		}
	}
	return actionmap;
};

Title.prototype.updateActionObjects = function() {
	var chart = this.m_chart.m_type;
	switch(chart) {
		case "Pie" :
			if ( (!IsBoolean(this.m_chart.m_isCategoryAvailable) || IsBoolean(this.m_chart.m_slicelimit)) ) {
				this.m_chart.m_actionsort = false;
			}
			break;
		
		case "Timeline" :
			if (this.m_chart.m_charttype === "timeseries") {
				this.m_chart.m_actionsort = false;
			}
			break;
			
		default :
			break;
	}
	this.m_chart.m_chartactions["showdata"]["enable"] = this.m_chart.m_actionshowdata;
	this.m_chart.m_chartactions["sort"]["enable"] = this.m_chart.m_actionsort;
	this.m_chart.m_chartactions["export"]["enable"] = this.m_chart.m_actionexport;
	this.m_chart.m_chartactions["chartviews"]["enable"] = this.m_chart.m_actionchartviews;
};

/** @description Subtitle class to draw subtitle of a component **/
function SubTitle() {
	this.base = TitleText;
	this.base();
	this.m_showsubtitle = true;
	this.m_formattedDescription = "SubTitle";
	this.m_chart = "";
	this.startX = "";
	this.startY = "";
	//this.m_subTitleBarHeight = 20;
	this.m_subTitleBarHeight = 80;
	this.m_chartLeftRightMargin = 5;
	this.ctx = "";
};
SubTitle.prototype = new TitleText();
SubTitle.prototype.getShowSubTitle = function() {
	return this.m_showsubtitle;
};
SubTitle.prototype.init = function(m_chart) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.m_globalCalculation = this.m_chart.m_globalCalculation;
	this.m_fontColor = convertColorToHex(this.getFontColor());
	
	var description=this.getDescription();
	
	/** formatteddescription() will return description according to global variable value **/
	this.m_formattedDescription = (this.m_chart.m_designMode) ? description :
		this.m_chart.formattedDescription(this.m_chart, description);

	/** calculatedDescription() will cut the text if subtitle text is big and flowing out of boundary **/
	this.m_formattedDescription = this.calculatedDescription(this.m_formattedDescription, IsBoolean(this.m_chart.m_subtitletextwrap));

	this.maxIconWidth = (IsBoolean(this.m_chart.m_showmaximizebutton)) ? 45 : 0;
	this.legendIconWidth = (IsBoolean(this.m_chart.m_showlegends) && (IsBoolean(this.m_chart.getTitle().m_showtitle) || IsBoolean(this.m_chart.m_showgradient))) ? 30 : 0;
	this.startX = this.checkAlign();
	/**DAS-690 enabling subtitlebarheight to control from script*/
	/*commenting since subtitlebarheight is given 80 by default and can control height from script
	var subtitlebarheight= (this.getFontSize() * 1.1)*3;
	this.m_subTitleBarHeight = (this.m_subTitleBarHeight > subtitlebarheight) ? this.m_subTitleBarHeight : subtitlebarheight;*/
	var addpadding = (IsBoolean(this.m_chart.m_updateddesign) ? 13 : 5);
	var titleMargin = (IsBoolean(this.m_chart.getTitle().m_showtitle) || IsBoolean(this.m_chart.m_showgradient)) ? this.m_chart.getTitle().m_titleBarHeight * 1 + addpadding : addpadding;
	this.m_titleMargin = titleMargin;
	this.startY = this.m_chart.m_y * 1 + titleMargin * 1 + this.getFontSize() * 2 / 3;
};
SubTitle.prototype.draw = function() {
	if (IsBoolean(this.m_chart.m_subTitle.m_showsubtitle)) {
		if (IsBoolean(this.m_chart.m_enablehtmlformate.subtitle)) {
			this.drawSubTitleTextInHTML();
		} else {
			this.drawText();
		}
		this.drawUnderLine(this.m_formattedDescription);
	}
};
/** @description draw the subtitle text in html formate . **/
SubTitle.prototype.drawSubTitleTextInHTML = function() {
		var temp = this;
		$( "#subTitle" + this.m_chart.m_objectid).remove();
		var text = document.createElement("div");
		var span = document.createElement("span");
		text.setAttribute("id", "subTitle" + this.m_chart.m_objectid);
		span.innerHTML = this.m_chart.formattedDescription(this.m_chart, this.getDescription());
		//text.style.height = this.m_chart.fontScaling(temp.m_subTitleBarHeight) + "px";
		var iconWidth = (IsBoolean(this.m_chart.m_showmaximizebutton)) ? (temp.maxIconWidth*1) : 0;
		iconWidth = (IsBoolean(this.m_chart.m_showsettingmenubutton)) ? iconWidth + 25 : iconWidth + 0;
		var top = this.m_titleMargin;
		span.setAttribute("style","display: inline-block; vertical-align: top; line-height: 1.1;text-decoration:inherit; height:"+this.m_subTitleBarHeight+"px; ");
		text.setAttribute("style", "position: absolute;top:"+ top +"px;left:0px;width:calc(100% - "+ iconWidth +"px);padding-left:"+temp.m_chartLeftRightMargin+"px;font-family:" 
				+ this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getFontSize()) + "px;font-weight:" 
				+ this.getFontWeight() + ";color:"+this.m_fontColor +";text-align:"+this.getAlign()+";text-decoration:" + this.getTextDecoration() + ";overflow: hidden;white-space: nowrap;text-overflow: ellipsis;");
		$(text).append(span);
		$("#draggableDiv" + temp.m_chart.m_objectid).append(text);
};

/** @description TitleText is parent class of Title and SubTitle -> common methods kept here **/
function TitleText() {
	this.m_fontsize = 10;
	this.m_fontweight = "normal";
	this.m_fontfamily = "Roboto";
	this.m_fontstyle = "normal";
	this.m_fontcolor = "#cccccc";
	this.m_textalign = "center";
	this.m_textdecoration = "none";
	this.m_align = "center";
	this.m_description = "Title";
};
TitleText.prototype.init = function() {};
TitleText.prototype.getFontSize = function() {
	return this.m_fontsize;
};
TitleText.prototype.setFontSize = function(FontSizeValue) {
	this.m_fontsize = FontSizeValue;
};
TitleText.prototype.getFontWeight = function() {
	return this.m_fontweight;
};
TitleText.prototype.setFontWeight = function(FontWeightValue) {
	this.m_fontweight = FontWeightValue;
};
TitleText.prototype.getFontFamily = function() {
	return selectGlobalFont(this.m_fontfamily);
};
TitleText.prototype.setFontFamily = function(FontFamilyValue) {
	this.m_fontfamily = FontFamilyValue;
};
TitleText.prototype.getFontStyle = function() {
	return this.m_fontstyle;
};
TitleText.prototype.setFontStyle = function(FontStyleValue) {
	this.m_fontstyle = FontStyleValue;
};
TitleText.prototype.getFontColor = function() {
	return this.m_fontcolor;
};
TitleText.prototype.setFontColor = function(FontColorValue) {
	this.m_fontcolor = FontColorValue;
};
TitleText.prototype.getTextAlign = function() {
	return this.m_textalign;
};
TitleText.prototype.setTextAlign = function(m_textalign) {
	this.m_textalign = m_textalign;
};
TitleText.prototype.getAlign = function() {
	return this.m_align;
};
TitleText.prototype.setAlign = function(m_align) {
	this.m_align = m_align;
};
TitleText.prototype.getTextDecoration = function() {
	return this.m_textdecoration;
};
TitleText.prototype.setTextDecoration = function(TextDecorationValue) {
	this.m_textdecoration = TextDecorationValue;
};
TitleText.prototype.getDescription = function() {
	return this.m_description;
};
TitleText.prototype.setDescription = function(DescriptionValue) {
	this.m_description = DescriptionValue;
};
TitleText.prototype.checkAlign = function() {
	this.m_chartLeftRightMargin = (IsBoolean(this.m_chart.m_updateddesign) ? 7 : this.m_chartLeftRightMargin);
	switch (this.getAlign()) {
		case "center":
			this.startX = this.m_chart.m_x * 1 + this.m_chart.m_width / 2 * 1;
			break;
		case "left":
			// adding 2px for BorderToDescriptionMargin
			this.startX = this.m_chart.m_x * 1 + this.m_chartLeftRightMargin * 2 + 2;
			break;
		case "right":
			this.startX = this.m_chart.m_x * 1 + this.m_chart.m_width * 1 - this.m_chartLeftRightMargin * 1 -
				this.maxIconWidth - this.legendIconWidth - this.m_chartLeftRightMargin * 1;
			break;
		case "justify":
			this.startX = this.m_chart.m_x * 1 + this.m_chartLeftRightMargin * 1;
			break;
		default:
			break;
	}
	return this.startX;
};
TitleText.prototype.calculatedDescription = function(m_description, textwrap) {
	var titleDescTextArr = m_description.split("\\n");
	var text = "";
	if(titleDescTextArr.length > 3) {
		var newTitlesArray = [];
		for(var k = 0; k < titleDescTextArr.length; k++) {
			if (k < 2) {
				newTitlesArray.push(titleDescTextArr[k]);
			} else {
				text += titleDescTextArr[k];
	            if (k == (titleDescTextArr.length - 1)) {
	            	newTitlesArray.push(text);
	            }
			}
		}
		titleDescTextArr = newTitlesArray;
	}
	for(var j = 0; j < titleDescTextArr.length; j++) {
		var str = titleDescTextArr[j];
		try {
			this.ctx.beginPath();
			this.ctx.font = this.getFontStyle() + " " + this.getFontWeight() + " " +
				this.m_chart.fontScaling(this.getFontSize()) + "px " + this.getFontFamily();
			var textWidth = this.ctx.measureText(str).width;
			var availableWidth = (IsBoolean(this.m_chart.m_showmaximizebutton)) ? this.m_chart.m_width * 1 - 20 : this.m_chart.m_width;
			if (textWidth > availableWidth) {
				var newText = "";
				if (str.length > 0) {
					var appendedTextWidth = (textWidth / str.length) * 3 + this.m_chartLeftRightMargin * 2  + 12; // adding 12px for right space after (...)
					if(IsBoolean(this.m_chart.m_showmaximizebutton)){
						if(IsBoolean(this.m_chart.m_showsettingmenubutton)){
							appendedTextWidth = appendedTextWidth * 1 + 30;
						}else{
							appendedTextWidth = appendedTextWidth * 1 + 20;
						}
					}else if(IsBoolean(this.m_chart.m_showsettingmenubutton)){
						appendedTextWidth = appendedTextWidth * 1 + 30;
					}else{
						// Do nothing
					}
					appendedTextWidth = (IsBoolean(this.m_chart.m_showmaximizebutton)) ? appendedTextWidth * 1 + 20 : appendedTextWidth;
				}
				for (var i = 0; i < str.length; i++) {
					if (this.ctx.measureText(newText).width < (this.m_chart.m_width - appendedTextWidth)) {
						newText += str[i];
					} else {
						newText = newText + "...";
						break;
					}
				}
				str = newText;
			}
			this.ctx.closePath();
			//return str;
		} catch (e) {
			console.log("Issue in length calculation of title description");
			//return str;
		}
		titleDescTextArr[j] = str;
	}
	/**@description DAS-574 : Updated below method for default text wrap in title and subtitle of charts**/
	var k = 0;
	var titleBarHeight = this.m_titleBarHeight != undefined ? this.m_titleBarHeight : this.m_subTitleBarHeight != undefined ? this.m_subTitleBarHeight : 3;
	var titleHeight = Math.min(3, Math.floor(titleBarHeight / (this.m_fontsize*1.1)));
	if(m_description.indexOf('\\n') == -1 && IsBoolean(textwrap)){
		var str = m_description;
		try {
			this.ctx.beginPath();
			this.ctx.font = this.getFontStyle() + " " + this.getFontWeight() + " " +
				this.m_chart.fontScaling(this.getFontSize()) + "px " + this.getFontFamily();
			var textWidth = this.ctx.measureText(str).width;
			var availableWidth = (IsBoolean(this.m_chart.m_showmaximizebutton)) ? this.m_chart.m_width * 1 - 48 : this.m_chart.m_width;
			if (textWidth > availableWidth) {
				var newText = "";
				if (str.length > 0) {
					var appendedTextWidth = (textWidth / str.length) * 3 + this.m_chartLeftRightMargin * 2; // adding 12px for right space after (...)
					if(IsBoolean(this.m_chart.m_showmaximizebutton)){
						if(IsBoolean(this.m_chart.m_showsettingmenubutton)){
							appendedTextWidth = appendedTextWidth * 1 + 30;
						}else{
							appendedTextWidth = appendedTextWidth * 1 + 20;
						}
					}else if(IsBoolean(this.m_chart.m_showsettingmenubutton)){
						appendedTextWidth = appendedTextWidth * 1 + 30;
					}else{
						// Do nothing
					}
					appendedTextWidth = (IsBoolean(this.m_chart.m_showmaximizebutton) ? appendedTextWidth * 1 + 28 : appendedTextWidth) + (this.m_chart.m_componenttype === "knowledge_graph_chart" ? 20 : 0);
				}
				for (var i = 0; i < str.length; i++) {
					if ((this.ctx.measureText(newText).width < (this.m_chart.m_width - appendedTextWidth)) && (i == (str.length - 1))) {
						newText += str[i];
						titleDescTextArr[k] = newText;
					} else if (this.ctx.measureText(newText).width < (this.m_chart.m_width - appendedTextWidth)) {
						newText += str[i];
					} else if(k < titleHeight){
						titleDescTextArr[k] = newText;
						newText = '' + str[i];
						k++;
						if(k == titleHeight)
							break;
					}
				}
				//str = newText;
			}
			this.ctx.closePath();
			//return str;
		} catch (e) {
			console.log("Issue in length calculation of title description");
			//return str;
		}
	}
	return titleDescTextArr;
};
TitleText.prototype.drawText = function() {
	try {
		for(var i = 0; i < this.m_formattedDescription.length; i++) {
			this.ctx.beginPath();
			this.ctx.font = this.getFontStyle() + " " + this.getFontWeight() + " " +
			this.m_chart.fontScaling(this.getFontSize()) + "px " + this.getFontFamily();
			this.ctx.textAlign = this.getAlign();
			this.ctx.fillStyle = this.m_fontColor;
			var y = (i == 0) ? (this.startY + (this.m_chart.fontScaling(this.getFontSize()) *i)) : (this.startY + (this.m_chart.fontScaling(this.getFontSize()) *i)) + this.m_chart.fontScaling(i * 2);
			this.ctx.fillText(this.m_formattedDescription[i], this.startX, y);
			this.ctx.closePath();
		}
	} catch (e) {
		console.log("issue in title text drawing");
	}
};
/** @description draw the title text in html formate . **/
TitleText.prototype.drawTitleTextInHTML = function () {
	var temp = this;
	$( "#title" + this.m_chart.m_objectid).remove();
	var text = document.createElement("div");
	var span = document.createElement("span");
	text.setAttribute("id", "title" + this.m_chart.m_objectid);
	span.innerHTML = this.m_chart.formattedDescription(this.m_chart, this.getDescription());
	text.style.height = this.m_chart.fontScaling(temp.m_titlebarheight) + "px";
	var iconWidth = (IsBoolean(this.m_chart.m_showmaximizebutton)) ? (temp.maxIconWidth*1) : 0;
	iconWidth = (IsBoolean(this.m_chart.m_showsettingmenubutton)) ? iconWidth + 25 : iconWidth + 0;
	span.setAttribute("style","display: inline-block; vertical-align: middle; line-height: 1.1;text-decoration:inherit;");
	text.setAttribute("style", "position: absolute; top:0px; left:0px;height:"+ this.m_chart.fontScaling(temp.m_titlebarheight) +"px;width:calc(100% - "+ iconWidth +"px);line-height:"+this.m_chart.fontScaling(temp.m_titlebarheight)+"px;padding-left:"+temp.m_chartLeftRightMargin+"px;font-family:" 
			+ this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getFontSize()) + "px;font-weight:" 
			+ this.getFontWeight() + ";color:"+this.m_fontColor +";text-align:"+this.getAlign()+";text-decoration:" + this.getTextDecoration() + ";overflow: hidden;white-space: nowrap;text-overflow: ellipsis;");
	
	$(text).append(span);
	$("#draggableDiv" + temp.m_chart.m_objectid).append(text);
};
TitleText.prototype.drawUnderLine = function(m_description) {
	if (this.getTextDecoration().toLowerCase() === "underline") {
		var textToUnderlineMargin = 2 * heightRatio;
		var startX = 0;
		var endX = 0;
		var startY, endY;
		var underlineHeight = 0.5;
		for(var i = 0; i < m_description.length; i++) {
			this.ctx.beginPath();
			this.ctx.font = this.getFontStyle() + " " + this.getFontWeight() + " " +
				this.m_chart.fontScaling(this.getFontSize()) + "px " + this.getFontFamily();
			var textWidth = this.ctx.measureText(m_description[i]).width;
			this.ctx.closePath();
			startY = this.startY * 1 + textToUnderlineMargin * 1 + this.m_chart.fontScaling(this.getFontSize()) / 2;
			if(i == 0) {
				startY = (startY + (this.m_chart.fontScaling(this.getFontSize()) *i));
			} else {
				startY = (startY + (this.m_chart.fontScaling(this.getFontSize()) *i)) + this.m_chart.fontScaling(i * 2);
			}
			endY = startY;
			switch (this.m_align) {
				case "center":
					startX = this.startX - (textWidth / 2);
					endX = this.startX * 1 + (textWidth / 2) * 1;
					break;
				case "right":
					startX = this.startX - textWidth;
					endX = this.startX;
					break;
				default:
					/* same case for "justify" as well */
					startX = this.startX;
					endX = this.startX * 1 + textWidth * 1;
					break;
			}
			this.ctx.beginPath();
			this.ctx.lineWidth = underlineHeight;
			this.ctx.strokeStyle = this.m_fontColor;
			this.ctx.moveTo(startX, startY);
			this.ctx.lineTo(endX, endY);
			this.ctx.stroke();
			this.ctx.closePath();
		}
	}
};

/** @description text util class to draw texts on canvas **/
function TextUtil() {};
TextUtil.prototype.getFontProperties = function(fontStyle, fontWeight,
	fontSize, fontFamily) {
	fontFamily = selectGlobalFont(fontFamily);
	return fontStyle + " " + fontWeight + " " + fontSize + "px " + fontFamily;
};
TextUtil.prototype.drawText = function(ctx, text, startX, startY,
	fontProperties, align, labelFontColor) {
	ctx.font = fontProperties;
	ctx.textAlign = align;
	ctx.fillStyle = labelFontColor;
	ctx.fillText(text, startX, startY);
};

/** @description Util class for y-axis formatters **/
function Util() {};
Util.prototype.getFormatterSymbol = function(formatter, unit) {
	var unitSymbol = "";
	try {
		eval("unitSymbol = this.get" + formatter + "Symbol(unit);");
	} catch (e) {
		return unitSymbol;
	}
	return unitSymbol;
};
Util.prototype.getCurrencySymbol = function(unit) {
	switch (unit.toLowerCase()) {
		case "cent":
			return "\u00A2";
		case "euro":
			return "\u20ac";
		case "ind":
			return "Rs.";
		case "rupees":
			return "\u20B9";
		case "pound":
			return "\u00A3";
		case "usd":
			return "\u0024";
		case "yen":
			return "\u00a5";
		default:
			return "";
	}
};
Util.prototype.getNumberSymbol = function(unit) {
	switch (unit.toLowerCase()) {
		case "percent":
			return "%";
		case "auto":
			return "auto";
		case "thousand":
			return "K";
		case "thousands":
			return "K";
		case "million":
			return "M";
		case "millions":
			return "M";
		case "billion":
			return "B";
		case "billions":
			return "B";
		case "trillion":
			return "T";
		case "trillions":
			return "T";
		case "quadrillion":
			return "Q";
		case "quadrillions":
			return "Q";
		case "lac":
			return "Lacs";
		case "crore":
			return "Cr";
		default:
			return "";
	}
};
Util.prototype.getTimeSymbol = function(unit) {
	/* TODO time formatters
	switch (unit) {
		case "ShortDate":
			return "";
		case "SimpleDate":
			return "";
		case "LongDate":
			return "";
		case "ExtendedDate":
			return "";
		default:
			return "";
	}
	*/
	return "";
};
Util.prototype.getDateSymbol = function(unit) {
	/* TODO date formatters
	switch (unit) {
		case "DateTime":
			return "";
		case "ShortTime":
			return "";
		case "SimpleTime":
			return "";
		case "ExtendedTime":
			return "";
		default:
			return "";
	}
	*/
	return "";
};
Util.prototype.updateTextWithFormatter = function(text, unit, precision) {
	var value;
	switch (unit) {
		case "K":
			value = text * 1 / 1000;
			break;
		case "M":
			value = text * 1 / 1000000;
			break;
		case "B":
			value = text * 1 / 1000000000;
			break;
		case "T":
			value = text * 1 / 1000000000000;
			break;
		case "Q":
			value = text * 1 / 1000000000000000;
			break;
		case "Lacs":
			value = text * 1 / 100000;
			break;
		case "Cr":
			value = text * 1 / 10000000;
			break;
		default:
			value = text * 1;
			break;
	}
	if (value !== 0) {
		if (precision !== "default") {
			return (value * 1).toFixed(precision);
		} else {
			return value * 1;
		}
	} else {
		return value * 1;
	}
};
Util.prototype.addFormatter = function(text, unitSymbol, signPosition) {
	try {
		eval("text = this.addUnitAs" + signPosition + "( text , unitSymbol )");
	} catch (e) {
		return text;
	}
	return text;
};
Util.prototype.addUnitAssuffix = function(text, unitSymbol) {
	return text + unitSymbol;
};
Util.prototype.addUnitAsprefix = function(text, unitSymbol) {
	/** when value is less then zero and currency is added, it should display -$24,345. -$24B, -35.52K **/
	 if(text && (""+text).indexOf("-") == 0){
		 return (""+text).replace("-", "-" + unitSymbol);
	 }else{
		 return unitSymbol + text;
	 }
};

/**  Spline Curves **/
/**
 * 		# sourceURL=Widget.js -> Spline Line Chart
 *		Curve version 2.0
 *		Smooth curves (cardinal splines) on canvas.
 *		By Ken Fyrstenberg Nilsen (c) 2013
 *		Abdias Software, http://abdiassoftware.com/
 *		MIT licensed.
 **/

CanvasRenderingContext2D.prototype.curve = function(points, tension, segments, chart) {
	"use strict";
	// options or defaults
	tension = (typeof tension === "number") ? tension : 0.5;
	var numOfSeg = segments;

	var pointsLength = points.length;
	var rPos = 0;
	var rLen = (pointsLength - 2) * numOfSeg + 2;
	var res = new Float32Array(rLen);
	var cache = new Float32Array((numOfSeg + 2) * 4);

	var pts = points.slice(0);
	pts.unshift(points[1]); // copy 1. point and insert at beginning
	pts.unshift(points[0]);
	pts.push(points[pointsLength - 2], points[pointsLength - 1]); // duplicate end-points

	cache[0] = 1; // cache inner-loop calculations as they are based on t alone	// 1,0,0,0
	var cachePtr = 4;
	for (var i = 1; i < numOfSeg; i++) {

		var st = i / numOfSeg,
			st2 = st * st,
			st3 = st2 * st,
			st23 = st3 * 2,
			st32 = st2 * 3;

		cache[cachePtr++] = st23 - st32 + 1; // c1
		cache[cachePtr++] = st32 - st23; // c2
		cache[cachePtr++] = st3 - 2 * st2 + st; // c3
		cache[cachePtr++] = st3 - st2; // c4
	}

	cache[++cachePtr] = 1; // 0,1,0,0

	// calc. points
	for (var i = 2, t; i < pointsLength; i += 2) {

		var pt1 = pts[i],
			pt2 = pts[i + 1],
			pt3 = pts[i + 2],
			pt4 = pts[i + 3],

			t1x = (pt3 - pts[i - 2]) * tension,
			t1y = (pt4 - pts[i - 1]) * tension,
			t2x = (pts[i + 4] - pt1) * tension,
			t2y = (pts[i + 5] - pt2) * tension;

		for (t = 0; t < numOfSeg; t++) {

			var c = t << 2, //t * 4;

				c1 = cache[c],
				c2 = cache[c + 1],
				c3 = cache[c + 2],
				c4 = cache[c + 3];

			res[rPos++] = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
			res[rPos++] = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
		}
	}

	// add last point
	pointsLength = points.length - 2;
	res[rPos++] = points[pointsLength];
	res[rPos] = points[pointsLength + 1];

	// add lines to path
	if (chart !== undefined && chart.m_chart.m_type === "Area") {
		this.moveTo(res[0], chart.m_chart.basePoint); //this.m_chart.basePoint
		this.lineTo(res[0], res[1]);
		for (i = 0, pointsLength = res.length; i < pointsLength; i += 2) {
			this.lineTo(res[i], res[i + 1]);
		}
		this.lineTo(res[res.length - 2], chart.m_chart.basePoint);
	} else {
		for (i = 0, pointsLength = res.length; i < pointsLength; i += 2) {
			this.lineTo(res[i], res[i + 1]);
		}
	}
	return res;
};

/**
 * Canteen v1.0.4
 * November 10th, 2016
 *
 * Copyright 2015 Platfora, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
;
(function() {
	// ================================ Constants ================================
	var CONTEXT_2D_ATTRIBUTES = [
		"fillStyle",
		"font",
		"globalAlpha",
		"globalCompositeOperation",
		"lineCap",
		"lineDashOffset",
		"lineJoin",
		"lineWidth",
		"miterLimit",
		"shadowBlur",
		"shadowColor",
		"shadowOffsetX",
		"shadowOffsetY",
		"strokeStyle",
		"textAlign",
		"textBaseline"
	];

	// ================================ Utils ================================

	function each(arr, func) {
		var len = arr.length,
			n;

		for (n = 0; n < len; n++) {
			func(arr[n], n);
		}
	}

	function round(val, decimalPoints) {
		var power = Math.pow(10, decimalPoints);
		return Math.round(val * power) / power;
	}

	function roundArr(arr, decimalPoints) {
		var len = arr.length,
			ret = [],
			n;

		for (n = 0; n < len; n++) {
			if (isNumber(arr[n])) {
				ret.push(round(arr[n], decimalPoints));
			} else {
				ret.push(arr[n]);
			}
		}

		return ret;
	}

	function isFunction(func) {
		return func && {}.toString.call(func) === "[object Function]";
	}

	function isNumber(val) {
		return typeof val === "number";
	}

	// ================================ Canteen Class ================================

	/**
	 * Canteen Constructor
	 * @constructor
	 */
	var Canteen = function(context) {
		var that = this;

		this._stack = [];
		this.context = context;

		// add observable attributes
		each(CONTEXT_2D_ATTRIBUTES, function(key, n) {
			Object.defineProperty(that, key, {
				get: function() {
					return that.context[key];
				},
				set: function(val) {
					that._pushAttr(key, val);
					that.context[key] = val;
				}
			});
		});
	};

	// Canteen methods 
	Canteen.prototype = {
		/**
		 * get a stack of operations
		 * @method stack
		 * @param {Object} config
		 * @param {String} [config.loose=false] - strict mode returns method calls with arguments and property names 
		 *  with values.  loose mode only returns method calls and property names
		 * @param {Number} [config.decimalPoints=3] - number of decimal points to round numeric values to.  The default is 
		 *  3, i.e. 1.23456 will round to 1.234
		 * @returns {Array}
		 * @public
		 */
		stack: function(config) {
			var config = config || {},
				loose = config.loose,
				decimalPoints = config.decimalPoints === undefined ? 3 : config.decimalPoints,
				ret = [];

			if (loose) {
				each(this._stack, function(el, n) {
					ret.push(el.method || el.attr);
				});
			} else {
				each(this._stack, function(el, n) {
					// if method instruction
					if (el.method) {
						ret.push({
							method: el.method,
							arguments: roundArr(el.arguments, decimalPoints)
						});
					}
					// if attr
					else if (el.attr) {
						ret.push({
							attr: el.attr,
							val: isNumber(el.val) ? round(el.val, decimalPoints) : el.val
						});
					}
				});
			}

			return ret;
		},
		/**
		 * serialize a stack into a string
		 * @method json
		 * @param {Object} config
		 * @param {String} [config.loose=false] - strict mode returns method calls with arguments and property names 
		 *  with values.  loose mode only returns method calls and property names
		 * @param {Number} [config.decimalPoints=3] - number of decimal points to round numeric values to.  The default is 
		 *  3, i.e. 1.23456 will round to 1.234
		 * @returns {String}
		 * @public
		 */
		json: function(config) {
			return JSON.stringify(this.stack(config));
		},
		/**
		 * convert a stack into a small hash string for easy comparisons
		 * @method hash
		 * @param {Object} config
		 * @param {String} [config.loose=false] - strict mode returns method calls with arguments and property names 
		 *  with values.  loose mode only returns method calls and property names
		 * @param {Number} [config.decimalPoints=3] - number of decimal points to round numeric values to.  The default is 
		 *  3, i.e. 1.23456 will round to 1.234
		 * @public
		 * @returns {String}
		 */
		hash: function(config) {
			return Canteen.md5(this.json(config));
		},
		/**
		 * clear the stack
		 * @method clear
		 * @public
		 */
		clear: function() {
			this._stack = [];
		},
		/**
		 * push instruction method onto the stack
		 * @method _pushMethod
		 * @param {String} method
		 * @param {arguments} args
		 * @private
		 */
		_pushMethod: function(method, args) {
			this._stack.push({
				method: method,
				arguments: Array.prototype.slice.call(args, 0)
			});

			this._slice();
		},
		/**
		 * push instruction attribute onto the stack
		 * @method _pushAttr
		 * @param {String} attr
		 * @param {*} val
		 * @private
		 */
		_pushAttr: function(attr, val) {
			this._stack.push({
				attr: attr,
				val: val
			});

			this._slice();
		},
		/**
		 * slice the stack if needed.  This means making sure that it doesn't exceed
		 *  the STACK_SIZE.  if it does, then shorten the stack starting from the beginning
		 * @method _slice
		 * @private
		 */
		_slice: function() {
			var stack = this._stack,
				len = stack.length,
				exceded = len - Canteen.globals.STACK_SIZE;
			if (exceded > 0) {
				this._stack = stack.slice(exceded);
			}
		}
	};

	// generate observable methods and add them to the Canteen prototype
	(function() {
		var proto = CanvasRenderingContext2D.prototype,
			key, val, desc;

		function addMethod(key, val) {
			Canteen.prototype[key] = function() {
				this._pushMethod(key, arguments);
				return this.context[key].apply(this.context, arguments);
			};
		}

		for (key in proto) {
			desc = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, key);
			val = (desc && desc.value ? proto[key] : null);
			if (isFunction(val)) {
				addMethod(key, val);
			}
		}
	})();

	// ================================ Global Config ================================
	/**
	 * global config.  You can directly change these values in order to configure Canteen
	 * @static
	 * @example 
	 *  // change stack size to 3000
	 *  Canteen.globals.STACK_SIZE = 3000;
	 */
	Canteen.globals = {
		STACK_SIZE: 20000
	};

	// ================================ Initialization ================================

	// override the canvas context getContext method in order to automatically instantiate
	// a Canteen instance and wrap the native context object
	(function() {
		var origGetContext = HTMLCanvasElement.prototype.getContext;

		HTMLCanvasElement.prototype.getContext = function() {
			var context = origGetContext.apply(this, arguments);
			// added below if block for getting context for canvg plugin without creating context
			if (this.className == "screenShotTempCanvas") {
				return context;
			}
			// if the context already has a canteen instance, then return it
			if (context){
				if(context.canteen) {
					return context.canteen
				}
				// if the context does not have a canteen instance, then instantiate one
				// and return it
				else {
					context.canteen = new Canteen(context);
					return context.canteen;
				}
			}else{
				return context;
			}
		}
	})();

	// make the Canteen namespace global so that developers can configure
	// it via Canteen.globals, or override methods if desired
	window.Canteen = Canteen;
})();;
/*
 * JavaScript MD5 1.0.1
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 * 
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*jslint bitwise: true */
/*global unescape, define */
(function($) {
	"use strict";

	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function safe_add(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF),
			msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}

	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	function bit_rol(num, cnt) {
		return (num << cnt) | (num >>> (32 - cnt));
	}

	/*
	 * These functions implement the four basic operations the algorithm uses.
	 */
	function md5_cmn(q, a, b, x, s, t) {
		return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
	}

	function md5_ff(a, b, c, d, x, s, t) {
		return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}

	function md5_gg(a, b, c, d, x, s, t) {
		return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}

	function md5_hh(a, b, c, d, x, s, t) {
		return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}

	function md5_ii(a, b, c, d, x, s, t) {
		return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	/*
	 * Calculate the MD5 of an array of little-endian words, and a bit length.
	 */
	function binl_md5(x, len) {
		/* append padding */
		x[len >> 5] |= 0x80 << (len % 32);
		x[(((len + 64) >>> 9) << 4) + 14] = len;

		var i, olda, oldb, oldc, oldd,
			a = 1732584193,
			b = -271733879,
			c = -1732584194,
			d = 271733878;

		for (i = 0; i < x.length; i += 16) {
			olda = a;
			oldb = b;
			oldc = c;
			oldd = d;

			a = md5_ff(a, b, c, d, x[i], 7, -680876936);
			d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
			c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
			b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
			a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
			d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
			c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
			b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
			a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
			d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
			c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
			b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
			a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
			d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
			c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
			b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

			a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
			d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
			c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
			b = md5_gg(b, c, d, a, x[i], 20, -373897302);
			a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
			d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
			c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
			b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
			a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
			d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
			c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
			b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
			a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
			d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
			c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
			b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

			a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
			d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
			c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
			b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
			a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
			d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
			c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
			b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
			a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
			d = md5_hh(d, a, b, c, x[i], 11, -358537222);
			c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
			b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
			a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
			d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
			c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
			b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

			a = md5_ii(a, b, c, d, x[i], 6, -198630844);
			d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
			c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
			b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
			a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
			d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
			c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
			b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
			a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
			d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
			c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
			b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
			a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
			d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
			c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
			b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

			a = safe_add(a, olda);
			b = safe_add(b, oldb);
			c = safe_add(c, oldc);
			d = safe_add(d, oldd);
		}
		return [a, b, c, d];
	}

	/*
	 * Convert an array of little-endian words to a string
	 */
	function binl2rstr(input) {
		var i,
			output = "";
		for (i = 0; i < input.length * 32; i += 8) {
			output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
		}
		return output;
	}

	/*
	 * Convert a raw string to an array of little-endian words
	 * Characters >255 have their high-byte silently ignored.
	 */
	function rstr2binl(input) {
		var i,
			output = [];
		output[(input.length >> 2) - 1] = undefined;
		for (i = 0; i < output.length; i += 1) {
			output[i] = 0;
		}
		for (i = 0; i < input.length * 8; i += 8) {
			output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
		}
		return output;
	}

	/*
	 * Calculate the MD5 of a raw string
	 */
	function rstr_md5(s) {
		return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
	}

	/*
	 * Calculate the HMAC-MD5, of a key and some data (raw strings)
	 */
	function rstr_hmac_md5(key, data) {
		var i,
			bkey = rstr2binl(key),
			ipad = [],
			opad = [],
			hash;
		ipad[15] = opad[15] = undefined;
		if (bkey.length > 16) {
			bkey = binl_md5(bkey, key.length * 8);
		}
		for (i = 0; i < 16; i += 1) {
			ipad[i] = bkey[i] ^ 0x36363636;
			opad[i] = bkey[i] ^ 0x5C5C5C5C;
		}
		hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
		return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
	}

	/*
	 * Convert a raw string to a hex string
	 */
	function rstr2hex(input) {
		var hex_tab = "0123456789abcdef",
			output = "",
			x,
			i;
		for (i = 0; i < input.length; i += 1) {
			x = input.charCodeAt(i);
			output += hex_tab.charAt((x >>> 4) & 0x0F) +
				hex_tab.charAt(x & 0x0F);
		}
		return output;
	}

	/*
	 * Encode a string as utf-8
	 */
	function str2rstr_utf8(input) {
		return unescape(encodeURIComponent(input));
	}

	/*
	 * Take string arguments and return either raw or hex encoded strings
	 */
	function raw_md5(s) {
		return rstr_md5(str2rstr_utf8(s));
	}

	function hex_md5(s) {
		return rstr2hex(raw_md5(s));
	}

	function raw_hmac_md5(k, d) {
		return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
	}

	function hex_hmac_md5(k, d) {
		return rstr2hex(raw_hmac_md5(k, d));
	}

	function md5(string, key, raw) {
		if (!key) {
			if (!raw) {
				return hex_md5(string);
			}
			return raw_md5(string);
		}
		if (!raw) {
			return hex_hmac_md5(key, string);
		}
		return raw_hmac_md5(key, string);
	}

	if (typeof define === "function" && define.amd) {
		define(function() {
			return md5;
		});
	} else {
		$.md5 = md5;
	}
}(Canteen));

/** XDATE **/
/**
 * @preserve XDate v@VERSION
 * Docs & Licensing: http://arshaw.com/xdate/
 * Internal Architecture
 * ---------------------
 * An XDate wraps a native Date. The native Date is stored in the "0" property of the object.
 * UTC-mode is determined by whether the internal native Date's toString method is set to
 * Date.prototype.toUTCString (see getUTCMode).
 *
 **/
var XDate = (function(Date, Math, Array, undefined) {

	/** @const */
	var FULLYEAR = 0;
	/** @const */
	var MONTH = 1;
	/** @const */
	var DATE = 2;
	/** @const */
	var HOURS = 3;
	/** @const */
	var MINUTES = 4;
	/** @const */
	var SECONDS = 5;
	/** @const */
	var MILLISECONDS = 6;
	/** @const */
	var DAY = 7;
	/** @const */
	var YEAR = 8;
	/** @const */
	var WEEK = 9;
	/** @const */
	var DAY_MS = 86400000;
	var ISO_FORMAT_STRING = "yyyy-MM-dd'T'HH:mm:ss(.fff)";
	var ISO_FORMAT_STRING_TZ = ISO_FORMAT_STRING + "zzz";

	var methodSubjects = [
		"FullYear", // 0
		"Month", // 1
		"Date", // 2
		"Hours", // 3
		"Minutes", // 4
		"Seconds", // 5
		"Milliseconds", // 6
		"Day", // 7
		"Year" // 8
	];
	var subjectPlurals = [
		"Years", // 0
		"Months", // 1
		"Days" // 2
	];
	var unitsWithin = [
		12, // months in year
		31, // days in month (sort of)
		24, // hours in day
		60, // minutes in hour
		60, // seconds in minute
		1000, // milliseconds in second
		1 //
	];
	var formatStringRE = new RegExp(
		"(([a-zA-Z])\\2*)|" + // 1, 2
		"(\\(" + "(('.*?'|\\(.*?\\)|.)*?)" + "\\))|" + // 3, 4, 5 (allows for 1 level of inner quotes or parens)
		"('(.*?)')" // 6, 7
	);
	var UTC = Date.UTC;
	var toUTCString = Date.prototype.toUTCString;
	var proto = XDate.prototype;

	// This makes an XDate look pretty in Firebug and Web Inspector.
	// It makes an XDate seem array-like, and displays [ <internal-date>.toString() ]
	proto.length = 1;
	proto.splice = Array.prototype.splice;

	/* Constructor
	---------------------------------------------------------------------------------*/

	// TODO: in future, I'd change signature for the constructor regarding the `true` utc-mode param. ~ashaw
	// I'd move the boolean to be the *first* argument. Still optional. Seems cleaner.
	// I'd remove it from the `xdate`, `nativeDate`, and `milliseconds` constructors.
	// (because you can simply call .setUTCMode(true) after)
	// And I'd only leave it for the y/m/d/h/m/s/m and `dateString` constructors
	// (because those are the only constructors that need it for DST-gap data-loss reasons)
	// Should do this for 1.0

	function XDate() {
		return init(
			(this instanceof XDate) ? this : new XDate(),
			arguments);
	}

	function init(xdate, args) {
		var len = args.length;
		var utcMode;
		if (isBoolean(args[len - 1])) {
			utcMode = args[--len];
			args = slice(args, 0, len);
		}
		if (!len) {
			xdate[0] = new Date();
		} else if (len === 1) {
			var arg = args[0];
			if (arg instanceof Date || isNumber(arg)) {
				xdate[0] = new Date(+arg);
			} else if (arg instanceof XDate) {
				xdate[0] = _clone(arg);
			} else if (isString(arg)) {
				xdate[0] = new Date(0);
				xdate = parse(arg, utcMode || false, xdate);
			}
		} else {
			xdate[0] = new Date(UTC.apply(Date, args));
			if (!utcMode) {
				xdate[0] = coerceToLocal(xdate[0]);
			}
		}
		if (isBoolean(utcMode)) {
			setUTCMode(xdate, utcMode);
		}
		return xdate;
	}

	/* UTC Mode Methods
	---------------------------------------------------------------------------------*/

	proto.getUTCMode = methodize(getUTCMode);

	function getUTCMode(xdate) {
		if (xdate !== undefined && xdate[0] !== undefined && xdate[0] !== "Invalid Date")
			return xdate[0].toString === toUTCString;
		else
			return false;
	};

	proto.setUTCMode = methodize(setUTCMode);

	function setUTCMode(xdate, utcMode, doCoercion) {
		if (utcMode) {
			if (!getUTCMode(xdate)) {
				if (doCoercion) {
					xdate[0] = coerceToUTC(xdate[0]);
				}
				xdate[0].toString = toUTCString;
			}
		} else {
			if (getUTCMode(xdate)) {
				if (doCoercion) {
					xdate[0] = coerceToLocal(xdate[0]);
				} else {
					xdate[0] = new Date(+xdate[0]);
				}
				// toString will have been cleared
			}
		}
		return xdate; // for chaining
	}

	proto.getTimezoneOffset = function() {
		if (getUTCMode(this)) {
			return 0;
		} else {
			return this[0].getTimezoneOffset();
		}
	};

	/* get / set / add / diff Methods (except for week-related)
	---------------------------------------------------------------------------------*/

	each(methodSubjects, function(subject, fieldIndex) {

		proto["get" + subject] = function() {
			return _getField(this[0], getUTCMode(this), fieldIndex);
		};

		if (fieldIndex !== YEAR) { // because there is no getUTCYear

			proto["getUTC" + subject] = function() {
				return _getField(this[0], true, fieldIndex);
			};

		}

		if (fieldIndex !== DAY) { // because there is no setDay or setUTCDay
			// and the add* and diff* methods use DATE instead

			proto["set" + subject] = function(value) {
				_set(this, fieldIndex, value, arguments, getUTCMode(this));
				return this; // for chaining
			};

			if (fieldIndex !== YEAR) { // because there is no setUTCYear
				// and the add* and diff* methods use FULLYEAR instead

				proto["setUTC" + subject] = function(value) {
					_set(this, fieldIndex, value, arguments, true);
					return this; // for chaining
				};

				proto["add" + (subjectPlurals[fieldIndex] || subject)] = function(delta, preventOverflow) {
					_add(this, fieldIndex, delta, preventOverflow);
					return this; // for chaining
				};

				proto["diff" + (subjectPlurals[fieldIndex] || subject)] = function(otherDate) {
					return _diff(this, otherDate, fieldIndex);
				};

			}

		}

	});

	function _set(xdate, fieldIndex, value, args, useUTC) {
		var getField = curry(_getField, xdate[0], useUTC);
		var setField = curry(_setField, xdate[0], useUTC);
		var expectedMonth;
		var preventOverflow = false;
		if (args.length === 2 && isBoolean(args[1])) {
			preventOverflow = args[1];
			args = [value];
		}
		if (fieldIndex === MONTH) {
			expectedMonth = (value % 12 + 12) % 12;
		} else {
			expectedMonth = getField(MONTH);
		}
		setField(fieldIndex, args);
		if (preventOverflow && getField(MONTH) !== expectedMonth) {
			setField(MONTH, [getField(MONTH) - 1]);
			setField(DATE, [getDaysInMonth(getField(FULLYEAR), getField(MONTH))]);
		}
	}

	function _add(xdate, fieldIndex, delta, preventOverflow) {
		delta = Number(delta);
		var intDelta = Math.floor(delta);
		xdate["set" + methodSubjects[fieldIndex]](
			xdate["get" + methodSubjects[fieldIndex]]() + intDelta,
			preventOverflow || false);
		if (intDelta !== delta && fieldIndex < MILLISECONDS) {
			_add(xdate, fieldIndex + 1, (delta - intDelta) * unitsWithin[fieldIndex], preventOverflow);
		}
	}

	function _diff(xdate1, xdate2, fieldIndex) { // fieldIndex=FULLYEAR is for years, fieldIndex=DATE is for days
		xdate1 = xdate1.clone().setUTCMode(true, true);
		xdate2 = XDate(xdate2).setUTCMode(true, true);
		var v = 0;
		if (fieldIndex === FULLYEAR || fieldIndex === MONTH) {
			for (var i = MILLISECONDS, methodName; i >= fieldIndex; i--) {
				v /= unitsWithin[i];
				v += _getField(xdate2, false, i) - _getField(xdate1, false, i);
			}
			if (fieldIndex === MONTH) {
				v += (xdate2.getFullYear() - xdate1.getFullYear()) * 12;
			}
		} else if (fieldIndex === DATE) {
			var clear1 = xdate1.toDate().setUTCHours(0, 0, 0, 0); // returns an ms value
			var clear2 = xdate2.toDate().setUTCHours(0, 0, 0, 0); // returns an ms value
			v = Math.round((clear2 - clear1) / DAY_MS) + ((xdate2 - clear2) - (xdate1 - clear1)) / DAY_MS;
		} else {
			v = (xdate2 - xdate1) / [
				3600000, // milliseconds in hour
				60000, // milliseconds in minute
				1000, // milliseconds in second
				1 //
			][fieldIndex - 3];
		}
		return v;
	}

	/* Week Methods
	---------------------------------------------------------------------------------*/

	proto.getWeek = function() {
		return _getWeek(curry(_getField, this, false));
	};

	proto.getUTCWeek = function() {
		return _getWeek(curry(_getField, this, true));
	};

	proto.setWeek = function(n, year) {
		_setWeek(this, n, year, false);
		return this; // for chaining
	};

	proto.setUTCWeek = function(n, year) {
		_setWeek(this, n, year, true);
		return this; // for chaining
	};

	proto.addWeeks = function(delta) {
		return this.addDays(Number(delta) * 7);
	};

	proto.diffWeeks = function(otherDate) {
		return _diff(this, otherDate, DATE) / 7;
	};

	function _getWeek(getField) {
		return getWeek(getField(FULLYEAR), getField(MONTH), getField(DATE));
	}

	function getWeek(year, month, date) {
		var d = new Date(UTC(year, month, date));
		var week1 = getWeek1(
			getWeekYear(year, month, date));
		return Math.floor(Math.round((d - week1) / DAY_MS) / 7) + 1;
	}

	function getWeekYear(year, month, date) { // get the year that the date's week # belongs to
		var d = new Date(UTC(year, month, date));
		if (d < getWeek1(year)) {
			return year - 1;
		} else if (d >= getWeek1(year + 1)) {
			return year + 1;
		}
		return year;
	}

	function getWeek1(year) { // returns Date of first week of year, in UTC
		var d = new Date(UTC(year, 0, 4));
		d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7); // make it Monday of the week
		return d;
	}

	function _setWeek(xdate, n, year, useUTC) {
		var getField = curry(_getField, xdate, useUTC);
		var setField = curry(_setField, xdate, useUTC);

		if (year === undefined) {
			year = getWeekYear(
				getField(FULLYEAR),
				getField(MONTH),
				getField(DATE));
		}

		var week1 = getWeek1(year);
		if (!useUTC) {
			week1 = coerceToLocal(week1);
		}

		xdate.setTime(+week1);
		setField(DATE, [getField(DATE) + (n - 1) * 7]); // would have used xdate.addUTCWeeks :(
		// n-1 because n is 1-based
	}

	/* Parsing
	---------------------------------------------------------------------------------*/

	XDate.parsers = [
		parseISO
	];

	XDate.parse = function(str) {
		return +XDate("" + str);
	};

	function parse(str, utcMode, xdate) {
		var parsers = XDate.parsers;
		var i = 0;
		var res;
		for (; i < parsers.length; i++) {
			res = parsers[i](str, utcMode, xdate);
			if (res) {
				return res;
			}
		}
		xdate[0] = new Date(str);
		return xdate;
	}

	function parseISO(str, utcMode, xdate) {
		var m = str.match(/^(\d{4})(-(\d{2})(-(\d{2})([T ](\d{2}):(\d{2})(:(\d{2})(\.(\d+))?)?(Z|(([-+])(\d{2})(:?(\d{2}))?))?)?)?)?$/);
		if (m) {
			var d = new Date(UTC(
				m[1],
				m[3] ? m[3] - 1 : 0,
				m[5] || 1,
				m[7] || 0,
				m[8] || 0,
				m[10] || 0,
				m[12] ? Number("0." + m[12]) * 1000 : 0));
			if (m[13]) { // has gmt offset or Z
				if (m[14]) { // has gmt offset
					d.setUTCMinutes(
						d.getUTCMinutes() +
						(m[15] === "-" ? 1 : -1) * (Number(m[16]) * 60 + (m[18] ? Number(m[18]) : 0)));
				}
			} else { // no specified timezone
				if (!utcMode) {
					d = coerceToLocal(d);
				}
			}
			return xdate.setTime(+d);
		}
	}

	/* Formatting
	---------------------------------------------------------------------------------*/

	proto.toString = function(formatString, settings, uniqueness) {
		if (formatString === undefined || !valid(this)) {
			return this[0].toString(); // already accounts for utc-mode (might be toUTCString)
		} else {
			return format(this, formatString, settings, uniqueness, getUTCMode(this));
		}
	};

	proto.toUTCString = proto.toGMTString = function(formatString, settings, uniqueness) {
		if (formatString === undefined || !valid(this)) {
			return this[0].toUTCString();
		} else {
			return format(this, formatString, settings, uniqueness, true);
		}
	};

	proto.toISOString = function() {
		return this.toUTCString(ISO_FORMAT_STRING_TZ);
	};

	XDate.defaultLocale = "";

	XDate.locales = {
		"": {
			monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			amDesignator: "AM",
			pmDesignator: "PM"
		}
	};

	XDate.formatters = {
		i: ISO_FORMAT_STRING,
		u: ISO_FORMAT_STRING_TZ
	};

	function format(xdate, formatString, settings, uniqueness, useUTC) {

		var locales = XDate.locales;
		var defaultLocaleSettings = locales[XDate.defaultLocale] || {};
		var getField = curry(_getField, xdate, useUTC);

		settings = (isString(settings) ? locales[settings] : settings) || {};

		function getSetting(name) {
			return settings[name] || defaultLocaleSettings[name];
		}

		function getFieldAndTrace(fieldIndex) {
			if (uniqueness) {
				var i = (fieldIndex === DAY ? DATE : fieldIndex) - 1;
				for (; i >= 0; i--) {
					uniqueness.push(getField(i));
				}
			}
			return getField(fieldIndex);
		}

		return _format(xdate, formatString, getFieldAndTrace, getSetting, useUTC);
	}

	function _format(xdate, formatString, getField, getSetting, useUTC) {
		var m;
		var subout;
		var out = "";
		while (m = formatString.match(formatStringRE)) {
			out += formatString.substr(0, m.index);
			if (m[1]) { // consecutive alphabetic characters
				out += processTokenString(xdate, m[1], getField, getSetting, useUTC);
			} else if (m[3]) { // parenthesis
				subout = _format(xdate, m[4], getField, getSetting, useUTC);
				if (parseInt(subout.replace(/\D/g, ""), 10)) { // if any of the numbers are non-zero. or no numbers at all
					out += subout;
				}
			} else { // else if (m[6]) { // single quotes
				out += m[7] || "'"; // if inner is blank, meaning 2 consecutive quotes = literal single quote
			}
			formatString = formatString.substr(m.index + m[0].length);
		}
		return out + formatString;
	}

	function processTokenString(xdate, tokenString, getField, getSetting, useUTC) {
		var end = tokenString.length;
		var replacement;
		var out = "";
		while (end > 0) {
			replacement = getTokenReplacement(xdate, tokenString.substr(0, end), getField, getSetting, useUTC);
			if (replacement !== undefined) {
				out += replacement;
				tokenString = tokenString.substr(end);
				end = tokenString.length;
			} else {
				end--;
			}
		}
		return out + tokenString;
	}

	function getTokenReplacement(xdate, token, getField, getSetting, useUTC) {
		var formatter = XDate.formatters[token];
		if (isString(formatter)) {
			return _format(xdate, formatter, getField, getSetting, useUTC);
		} else if (isFunction(formatter)) {
			return formatter(xdate, useUTC || false, getSetting);
		}
		switch (token) {
			case "fff":
				return zeroPad(getField(MILLISECONDS), 3);
			case "s":
				return getField(SECONDS);
			case "ss":
				return zeroPad(getField(SECONDS));
			case "m":
				return getField(MINUTES);
			case "mm":
				return zeroPad(getField(MINUTES));
			case "h":
				return getField(HOURS) % 12 || 12;
			case "hh":
				return zeroPad(getField(HOURS) % 12 || 12);
			case "H":
				return getField(HOURS);
			case "HH":
				return zeroPad(getField(HOURS));
			case "d":
				return getField(DATE);
			case "dd":
				return zeroPad(getField(DATE));
			case "ddd":
				return getSetting("dayNamesShort")[getField(DAY)] || "";
			case "dddd":
				return getSetting("dayNames")[getField(DAY)] || "";
			case "M":
				return getField(MONTH) + 1;
			case "MM":
				return zeroPad(getField(MONTH) + 1);
			case "MMM":
				return getSetting("monthNamesShort")[getField(MONTH)] || "";
			case "MMMM":
				return getSetting("monthNames")[getField(MONTH)] || "";
			case "yy":
				return (getField(FULLYEAR) + "").substring(2);
			case "yyyy":
				return getField(FULLYEAR);
			case "t":
				return _getDesignator(getField, getSetting).substr(0, 1).toLowerCase();
			case "tt":
				return _getDesignator(getField, getSetting).toLowerCase();
			case "T":
				return _getDesignator(getField, getSetting).substr(0, 1);
			case "TT":
				return _getDesignator(getField, getSetting);
			case "z":
			case "zz":
			case "zzz":
				return useUTC ? "Z" : _getTZString(xdate, token);
			case "w":
				return _getWeek(getField);
			case "ww":
				return zeroPad(_getWeek(getField));
			case "S":
				var d = getField(DATE);
				if (d > 10 && d < 20)
					return "th";
				return ["st", "nd", "rd"][d % 10 - 1] || "th";
		}
	}

	function _getTZString(xdate, token) {
		var tzo = xdate.getTimezoneOffset();
		var sign = tzo < 0 ? "+" : "-";
		var hours = Math.floor(Math.abs(tzo) / 60);
		var minutes = Math.abs(tzo) % 60;
		var out = hours;
		if (token === "zz") {
			out = zeroPad(hours);
		} else if (token === "zzz") {
			out = zeroPad(hours) + ":" + zeroPad(minutes);
		}
		return sign + out;
	}

	function _getDesignator(getField, getSetting) {
		return getField(HOURS) < 12 ? getSetting("amDesignator") : getSetting("pmDesignator");
	}

	/* Misc Methods
	---------------------------------------------------------------------------------*/

	each(
		[ // other getters
			"getTime",
			"valueOf",
			"toDateString",
			"toTimeString",
			"toLocaleString",
			"toLocaleDateString",
			"toLocaleTimeString",
			"toJSON"
		],
		function(methodName) {
			proto[methodName] = function() {
				return this[0][methodName]();
			};
		});

	proto.setTime = function(t) {
		this[0].setTime(t);
		return this; // for chaining
	};

	proto.valid = methodize(valid);

	function valid(xdate) {
		return !isNaN(+xdate[0]);
	}

	proto.clone = function() {
		return new XDate(this);
	};

	proto.clearTime = function() {
		return this.setHours(0, 0, 0, 0); // will return an XDate for chaining
	};

	proto.toDate = function() {
		return new Date(+this[0]);
	};

	/* Misc Class Methods
	---------------------------------------------------------------------------------*/

	XDate.now = function() {
		return +new Date();
	};

	XDate.today = function() {
		return new XDate().clearTime();
	};

	XDate.UTC = UTC;

	XDate.getDaysInMonth = getDaysInMonth;

	/* Internal Utilities
	---------------------------------------------------------------------------------*/

	function _clone(xdate) { // returns the internal Date object that should be used
		var d = new Date(+xdate[0]);
		if (getUTCMode(xdate)) {
			d.toString = toUTCString;
		}
		return d;
	}

	function _getField(d, useUTC, fieldIndex) {
		return d["get" + (useUTC ? "UTC" : "") + methodSubjects[fieldIndex]]();
	}

	function _setField(d, useUTC, fieldIndex, args) {
		d["set" + (useUTC ? "UTC" : "") + methodSubjects[fieldIndex]].apply(d, args);
	}

	/* Date Math Utilities
	---------------------------------------------------------------------------------*/

	function coerceToUTC(date) {
		return new Date(UTC(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			date.getHours(),
			date.getMinutes(),
			date.getSeconds(),
			date.getMilliseconds()));
	}

	function coerceToLocal(date) {
		return new Date(
			date.getUTCFullYear(),
			date.getUTCMonth(),
			date.getUTCDate(),
			date.getUTCHours(),
			date.getUTCMinutes(),
			date.getUTCSeconds(),
			date.getUTCMilliseconds());
	}

	function getDaysInMonth(year, month) {
		return 32 - new Date(UTC(year, month, 32)).getUTCDate();
	}

	/* General Utilities
	---------------------------------------------------------------------------------*/

	function methodize(f) {
		return function() {
			return f.apply(undefined, [this].concat(slice(arguments)));
		};
	}

	function curry(f) {
		var firstArgs = slice(arguments, 1);
		return function() {
			return f.apply(undefined, firstArgs.concat(slice(arguments)));
		};
	}

	function slice(a, start, end) {
		return Array.prototype.slice.call(
			a,
			start || 0, // start and end cannot be undefined for IE
			end === undefined ? a.length : end);
	}

	function each(a, f) {
		for (var i = 0; i < a.length; i++) {
			f(a[i], i);
		};
	}

	function isString(arg) {
		return typeof arg === "string";
	}

	function isNumber(arg) {
		return typeof arg === "number";
	}

	function isBoolean(arg) {
		return typeof arg === "boolean";
	}

	function isFunction(arg) {
		return typeof arg === "function";
	}

	function zeroPad(n, len) {
		len = len || 2;
		n += "";
		while (n.length < len) {
			n = "0" + n;
		}
		return n;
	}

	// Export for Node.js
	if (typeof module !== "undefined" && module.exports) {
		module.exports = XDate;
	}

	// AMD
	if (typeof define === "function" && define.amd) {
		define([], function() {
			return XDate;
		});
	}

	return XDate;

})(Date, Math, Array);

//--------- Global utility methods which are being used across the charting components -------------//
/** @description finding item in an array **/
var findInArray = function(arr, name, value) {
	var result = $.grep(arr, function(n) {
		return ((value !== undefined) && n[name].toLowerCase() == value.toLowerCase());
	});
	if (result.length > 0) {
		return result[0];
	} else {
		return undefined;
	}
};
/** @description this method returns an array with default value at each index **/
function getArrayWithDefaultValues(len, val) {
	return Array.apply(null, Array(len)).map(function() {
		return val
	});
};

/** @description this method remove remove special characters like- "#", "%", "," ,".","/" from string (Used in grids header names) **/
function getStringARSC(str) {
	return (str) ? (str.toString()).replace(/[^a-z0-9\s]/gi, "").replace(/[_\s]/g, "_") : str;
};

/** @description this method remove comma ( , ) from a numeric value. 
 * check value is a string and it contains comma inside it, do not remove the comma. i.e. "Sponser,Sue" **/
function getNumericComparableValue(value) {
	var newValue = value;
	try {
		//var isValueContainsChar = (/[a-zA-Z]/.test(value));
		var regEx  = /^-?\d{1,3}(,\d{3})*(\.\d+)?$/;
		var isValueContainsChar = regEx.test(value);
		if (isValueContainsChar) {
			if (isNaN(value) && value !== undefined) {
				newValue = ("" + value).replace(/\,/g, "");
			}
		}
	} catch (e) {
		console.log(e);
	}
	return newValue;
};

/** @description this method remove comma ( , ) from all values of an array (used in Conditional Color in chart.js) **/
function getCommaSeparateSeriesData(seriesData) {
	var newSeries = seriesData;
	for (var i = 0; i < seriesData.length; i++) {
		if (isNaN(seriesData[i])) {
			newSeries[i] = ("" + seriesData[i]).replace(/\,/g, "");
		}
	}
	return newSeries;
};

/** @description  It will return a number with comma separated (used in Simple/Paging data grid) **/
function getNumberWithCommas(number) {
	try {
		number = number.toString();
		var nums = number.split(".");
		number = nums[0];
		var pattern = /(-?\d+)(\d{3})/;
		while (pattern.test(number)) {
			number = number.replace(pattern, "$1,$2");
		}
		return (nums[1]) ? number + "." + nums[1] : number;
	} catch (e) {
		return number;
	}
};

/** @description  It will return a number with comma separated according to Indian currency (used in Simple/Paging data grid) **/
function getIndianNumberWithCommas(number) {
	try {
	    number = number.toString();
	    var nums = number.split(".");
	    number = nums[0];
	    var pattern = /(\d+?)(?=(\d\d)+(\d)(?!\d))(\.\d+)?/;
	    while (pattern.test(number)) {
	        number = number.replace(pattern, "$1,");
	    }
	    return (nums[1]) ? number + "." + nums[1] : number;
	} catch (e) {
	    return number;
	}
};

/** @description  It will return a number with comma separated according to number formatter **/
function getFormattedNumberWithCommas(number,type) {
	if (type === "number") {
	    return getNumberWithCommas(number);
	} else if (type === "indiannumber") {
	    return getIndianNumberWithCommas(number);
	} else {
	    return number;
	}
};
/** @description check a value is numeric or not **/
function checkNumeric(objName) {
	return ("" + objName).replace(/\,/g, "");
};
/** @description check a value is boolean or not **/
function IsBoolean(value) {
	if (value === "true") {
		return true;
	} else if (value === "false") {
		return false;
	} else {
		return value;
	}
};
/** @description It will convert "yy" to "yyyy" format (used in TimeLine chart) **/
function getFullYear(yy) {
	
	return ((yy * 1).toString().length>=4)?(yy * 1):(((yy * 1) > 50) ? "19" + yy : "20" + yy);
};
/** @description check for a year is Leap or not **/
function isLeapYear(year) {
	return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? true : false ;
};
/** @description SVG drawing methods **/
function drawSVGText(x, y, text, fillColor, hAlign, Valign, angle) {
	var newText = document.createElementNS(NS, "text");
	if (!isNaN(x) && !isNaN(y)) {
		newText.setAttribute("x", x);
		newText.setAttribute("y", y);
		newText.setAttribute("fill", fillColor);
		if (angle !== "" && angle !== undefined && angle !== 0)
			newText.setAttribute("transform", "rotate(" + angle + " " + x + "," + y + ")");
		newText.textContent = text;
		newText.setAttribute("text-anchor", getSVGAlignment(hAlign));
		newText.setAttribute("alignment-baseline", Valign);
	}
	return newText;
};

/** @description SVG text wrap methods **/
function wrapSVGText(temp, x, y, textArray, textElement, fontSize, maxWidth) {
	var tspan_element = document.createElementNS(NS, "tspan"); // Create first tspan element
	tspan_element.setAttribute("x", x);
	tspan_element.setAttribute("y", y);
	textArray[0] = trimText(temp, textArray[0], maxWidth); // This will retrun trimmed text if given text width is more then maxWidth. 
	var text_node = document.createTextNode(textArray[0]); // Create text in tspan element
	tspan_element.appendChild(text_node);
	textElement.appendChild(tspan_element);
	var text = "";
	for (var i = 1; i < textArray.length; i++) {
		textArray[i] = trimText(temp, textArray[i], maxWidth); // This will retrun trimmed text if given text width is more then maxWidth. 
		if (i < 2) {
			tspan_element = document.createElementNS(NS, "tspan"); // Create new tspan element
			tspan_element.setAttribute("x", x);
			tspan_element.setAttribute("dy", (fontSize * 1 + temp.m_chart.fontScaling(i * 2)));
			text_node = document.createTextNode(textArray[i]);
			tspan_element.appendChild(text_node);
			textElement.appendChild(tspan_element);
		} else {
			text += textArray[i];
			if (i == (textArray.length - 1)) {
				tspan_element = document.createElementNS(NS, "tspan"); // Create new tspan element
				tspan_element.setAttribute("x", x);
				tspan_element.setAttribute("dy", (fontSize * 1 + temp.m_chart.fontScaling(2)));
				text_node = document.createTextNode(text);
				tspan_element.appendChild(text_node);
				textElement.appendChild(tspan_element);
			}
		}
	}
};

/** @description will trim text which is drawing out of given width.*/
function trimText (temp, text, maxWidth) {
	text = (isNaN(text)) ? text.replace(/\s*$/,"") : text;
	temp.m_chart.ctx.font = temp.m_fontsize + "px " + selectGlobalFont(temp.m_fontfamily);
	var txtWidth = temp.m_chart.ctx.measureText(text).width;
	if (txtWidth > maxWidth) {
		var words = text.split(" ");
		var newTxt = "";
		for (var j = 0; j < words.length; j++) {
			if (maxWidth > temp.m_chart.ctx.measureText(newTxt + words[j]).width) {
				newTxt += words[j];
			} else {
				newTxt += "..";
				break;
			}
		}
		return newTxt;
	}
	return text;
};

function drawSVGLine(x1, y1, x2, y2, lineWidth, fillColor) {
	var newLine = document.createElementNS(NS, "line");
	if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2)) {
		newLine.setAttribute("x1", x1);
		newLine.setAttribute("y1", y1);
		newLine.setAttribute("x2", x2);
		newLine.setAttribute("y2", y2);
		newLine.setAttribute("stroke", fillColor);
		newLine.setAttribute("stroke-width", lineWidth);
		newLine.setAttribute("shape-rendering", "crispEdges");
	}
	return newLine;
};

function drawSVGRect(x, y, width, height, fillColor) {
	var newRect = document.createElementNS(NS, "rect");
	if (x !== "" && y !== "" && width !== "" && height !== "" && !isNaN(x) && !isNaN(y) && !isNaN(width) && !isNaN(height)) {
		try{
			newRect.setAttributeNS(null, "x", x);
			newRect.setAttributeNS(null, "y", y);
			newRect.setAttributeNS(null, "height", height);
			newRect.setAttributeNS(null, "width", width);
			newRect.setAttributeNS(null, "fill", fillColor);
		}catch(e){}
	}
	return newRect;
};
function drawSVGStackAnimation(startPoint, attributeName, endPoint, duration) {
	var newAnimate = document.createElementNS(NS, "animate");
	if (!isNaN(startPoint) && !isNaN(endPoint)) {
		newAnimate.setAttributeNS(null, "attributeName", attributeName);
		newAnimate.setAttributeNS(null, "from", startPoint);
		newAnimate.setAttributeNS(null, "to", endPoint);
		newAnimate.setAttributeNS(null, "dur", duration + "s");
		newAnimate.setAttributeNS(null, "fill", "freeze");
	}
	return newAnimate;
};

function drawSVGCircle(x, y, radius, strokeWidth, fillColor, strokeColor) {
	var circle = document.createElementNS(NS, "circle");
	if (!isNaN(x) && !isNaN(y) && !isNaN(radius)) {
		circle.setAttributeNS(null, "cx", x);
		circle.setAttributeNS(null, "cy", y);
		circle.setAttributeNS(null, "r", radius);
		circle.setAttributeNS(null, "stroke-width", strokeWidth);
		circle.setAttributeNS(null, "stroke", strokeColor);
		circle.setAttributeNS(null, "fill", fillColor);
	}
	return circle;
};

function drawSVGPath() {
	var path = document.createElementNS(NS, "path");
	return path;
};

function getSVGAlignment(align) {
	switch (align.toLowerCase()) {
		case "left":
			return "start";
		case "center":
			return "middle";
		case "right":
			return "end";
		default:
			return align;
	}
};

/** @description It will return copy of the object **/
function getCopyOfJsonObject(obj) {
	try {
		return JSON.parse(JSON.stringify(obj));
	} catch (e) {
		console.log(e);
	}
	return obj;
};

/** Used in Bubble/ Heatmap/ World/ Grids **/
function getNumericMax(arr){
	//underscore method for max value
	return _.max(arr, function(val) {
	     return (val === "" || val === undefined || val == null) ? undefined : getNumericComparableValue(val) * 1;
	 });
};
function getNumericMin(arr){
	// underscore method for min value
	return _.min(arr, function(val) {
	     return (val === "" || val === undefined || val == null) ? undefined : getNumericComparableValue(val) * 1;
	 });
};

/** @description returns scorllbar width according to browser
 * used for repeater scrollbar and datagrids  **/ 
function getScrollBarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    document.body.appendChild(outer);
    
    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";
    
    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);        
    var widthWithScroll = inner.offsetWidth;
    
    // remove divs
    outer.parentNode.removeChild(outer);
    return widthNoScroll - widthWithScroll;	
};

/** @description Method calculates the aggragation on data **/
function getAggregationOperatedData(values, operation) {
    switch (operation) {
        case "sum":
            var sum = "";
            for (var i = 0; i < values.length; i++) {
                var val = getNumericComparableValue(values[i]) * 1;
                if (!isNaN(val) && val !== "")
                    sum = sum * 1 + val;
            }
            return sum;
        case "avg":
            var avg = "";
            for (var i1 = 0; i1 < values.length; i1++) {
                var val = getNumericComparableValue(values[i1]) * 1;
                if (!isNaN(val) && val !== "")
                    avg = avg * 1 + val;
            }
            if (avg !== "")
                return avg / values.length;
            else
                return "";
            break;
        case "max":
            var max = getNumericComparableValue(values[0]) * 1;
            for (var i2 = 0; i2 < values.length; i2++) {
                var val = getNumericComparableValue(values[i2]) * 1;
                if (!isNaN(val) && val !== "")
                    if (val > max)
                        max = val;
            }
            return max;
        case "min":
            var min = getNumericComparableValue(values[0]) * 1;
            for (var i3 = 0; i3 < values.length; i3++) {
                var val = getNumericComparableValue(values[i3]) * 1;
                if (!isNaN(val) && val !== "")
                    if (val < min)
                        min = val;
            }
            return min;
        case "count":
            return values.length;
        case "customAggregation":
            var val = "";
            for (var i4 = 0; i4 < values.length; i4++) {
                var val1 = getNumericComparableValue(values[i4]) * 1;
                if (!isNaN(val1) && val1 !== "")
                    val = val1;
            }
            return val;
        case "uniquevalue":
            return $.unique(values);
        default:
            return;
    }
};

/** @description case-insensitve replace - which replaces all occurences in the string **/
function SearchAndReplaceAllOccurence(str, searchStr, replaceStr) {
	var temp = new RegExp("(" + (searchStr + "").replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1") + ")", "gi");
	return str.replace(temp, replaceStr);
};

/** @description Converts the array formats **/
function convertTo2DArray(arr) {
	var convertedArr = [];
	for (var i = 0; i < arr.length; i++) {
		convertedArr[i] = [];
		for (var j = 0; j < arr[i].length; j++) {
			convertedArr[i][j] = arr[i][j];
		}
	}
	return convertedArr;
};

function convertArrayType(array) {
	var arr = [];
	if (array.length > 0 && array[0] !== undefined) {
		for (var i = 0; i < array[0].length; i++) {
			arr[i] = [];
			for (var j = 0; j < array.length; j++) {
				arr[i][j] = array[j][i];
			}
		}
	}
	return arr;
};

function getMaxValueFromArray(arr) {
	if (arr && arr.length > 0) {
		return Math.max.apply(null, arr);
	} else {
		return 0;
	}
};
/** @description removes the NaN values and filter the numeric data **/
function updateSeriesData(seriesData) {
	var data = [];
	for (var i = 0; i < seriesData.length; i++) {
		data[i] = [];
		for (var j = 0; j < seriesData[i].length; j++) {
			var val1 = ("" + seriesData[i][j]).replace(/\,/g, "");
			if (!isNaN(val1)) {
				data[i][j] = val1;
			} else
				data[i][j] = seriesData[i][j];
		}
	}
	return data;
};

/** @description Util method to convert any number to hexadecimal equivalent **/
function convertColorToHex(colorString) {
	var m_colors = colorString;
	var icolor = "";
	var str = "" + m_colors;
	if ((startsWith(str, "0x")) || (startsWith(str, "0X"))) {
		icolor = m_colors.substr(2, 7);
	} else if ((startsWith(str, "#"))) {
		icolor = m_colors.substr(1, 6);
		if (icolor.length <= 3) {
			icolor = addString(icolor);
		}
	} else if (isNaN(str)) {
		icolor = str;
		if (icolor.length === 3) {
			/** String like "red" making this loop into infinite loop **/
			var hexIcolor = "";
			for (var i = 0; i < icolor.length; i++) {
				hexIcolor += icolor[i] + "" + icolor[i];
			}
			icolor = hexIcolor;
		} else if (icolor.length < 6) {
			icolor = padColorString(icolor);
		} else{
			// Do nothing
		}
	} else {
		icolor = Number(m_colors).toString(16);
		icolor = padColorString(icolor);
	}
	if (icolor.length > 6) {
		icolor = icolor.substring(icolor.length - 6, icolor.length);
	}

	var hex = ("#" + icolor);
	return (isValidHex(hex)) ? hex : "#000000";
};

function startsWith(str, prefix) {
	return (str.indexOf(prefix) === 0);
};

function addString(colorString) {
	return padString(colorString, 6, colorString);
};

function padColorString(colorString) {
	return padString(colorString, 6, "0");
};

function padString(stringTobePadded, length, paddingChar) {
	if (stringTobePadded.length < length) {
		var paddingLength = length - stringTobePadded.length;
		var padding = "";
		for (var i = 0; i < paddingLength; i++) {
			padding += paddingChar;
		}
		stringTobePadded = padding + stringTobePadded;
	}
	return stringTobePadded;
};

function isValidHex(str) {
	return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(str);
};

/** @description Converts rgb color string to rgba equivalent **/
function rgb2hex(rgb) {
	var hex = "#";
	rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	hex = hex + ("0" + parseInt(rgb[1]).toString(16)).slice(-2);
	hex = hex + ("0" + parseInt(rgb[2]).toString(16)).slice(-2);
	hex = hex + ("0" + parseInt(rgb[3]).toString(16)).slice(-2);
	return hex;
};

/** @description converts hexadecimal colors to rgba format **/
function hex2rgb(hex, opacity) {
	if (hex) {
		var rgb = hex.replace("#", "").match(/(.{2})/g);
		var i = 3;
		while (i--) {
			rgb[i] = parseInt(rgb[i], 16);
		}
		if (typeof opacity === "undefined") {
			return "rgb(" + rgb.join(", ") + ")";
		}
		return "rgba(" + rgb.join(", ") + ", " + opacity + ")";
	} else {
		return hex;
	}
};

/*@description convert rgb color to rgb color shade by passing "p = opacity", "c0 = rgb color" "c1=false " & "l = false"*/
function pSBC(p, c0, c1, l) {
    var r, g, b, P, f, t, h, i = parseInt,
        m = Math.round,
        a = typeof(c1) == "string";
    if (typeof(p) != "number" || p < -1 || p > 1 || typeof(c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
    if (!this.pSBCr) this.pSBCr = function(d) {
        var n = d.length;
        var x = {};
        if (n > 9) {
            d = d.split(",");
            r = d[0];
            g = d[1];
            b = d[2];
            a = d[3];
            n = d.length;
            if (n < 3 || n > 4) return null;
            x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4));
            x.g = i(g);
            x.b = i(b);
            x.a = a ? parseFloat(a) : -1;
        } else {
            if (n == 8 || n == 6 || n < 4) return null;
            if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
            d = i(d.slice(1), 16);
            if (n == 9 || n == 5) {
                x.r = d >> 24 & 255;
                x.g = d >> 16 & 255;
                x.b = d >> 8 & 255;
                x.a = m((d & 255) / 0.255) / 1000;
            } else {
                x.r = d >> 16;
                x.g = d >> 8 & 255;
                x.b = d & 255;
                x.a = -1;
            }
        }
        return x
    };
    h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? pSBCr(c1) : P ? {
        r: 0,
        g: 0,
        b: 0,
        a: -1
    } : {
        r: 255,
        g: 255,
        b: 255,
        a: -1
    }, p = P ? p * -1 : p, P = 1 - p;
    if (!f || !t) return null;
    if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
    else {
        r = m((P * f.r * 2 + p * t.r * 2) * 0.5),
            g = m((P * f.g * 2 + p * t.g * 2) * 0.5),
            b = m((P * f.b * 2 + p * t.b * 2) * 0.5);
        a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
    }
    if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
    else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
};

/** @description  converts hexadecimal colors to matrix format**/
function hex2Matrix(hex, opacity) {
	var hexColor = convertColorToHex(hex);
	var rgba = hex2rgb(hexColor, opacity);
	var colorMatrix = "";
	var colorArr = rgba.replace(/[^0-9 ]/g, "").split(" ");
	for (var i = 0; i < colorArr.length; i++) {
		var matrixArr = [];
	    if (i != colorArr.length - 1) {
	        matrixArr = ["0", "0", "0", "0", "0"];
	        matrixArr[i] = (colorArr[i] * 1) / 255;
	    } else {
	        matrixArr[i] = (opacity * 1);
	    }
	    colorMatrix += matrixArr.toString().replace(/,/g, " ") + " ";
	}
	return colorMatrix;
};
/** @description add luminance to hexadecimal color **/
function ColorLuminance(hex, lum) {
	if (hex) {
		/** validate hex string **/
		hex = String(hex).replace(/[^0-9a-f]/gi, "");
		if (hex.length < 6) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		}
		lum = lum || 0.1;
		/** convert to decimal and change luminosity **/
		var rgb = "#",
			c,
			i;
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i * 2, 2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ("00" + c).substr(c.length);
		}
		return rgb;
	} else {
		return hex;
	}
};
/** @description generates random color **/
function getRandomColor() {
	var letters = "0123456789ABCDEF".split("");
	var hex = "";
	for (var j = 0; j < 6; j++) {
		hex += "" + letters[Math.round(Math.random() * 15)];
	}
	return hex;
};
/** @Description JSON sorting methods **/
function sortAscArrayOfJsonByKey(array, key) {
	return array.sort(function(a, b) {
		var x = a[key];
		var y = b[key];
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
};

function sortDescArrayOfJsonByKey(array, key) {
	return array.sort(function(a, b) {
		var y = a[key];
		var x = b[key];
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
};

/** @description callback methods of canvas mouse move event **/
function onMouseMove(obj) {
	obj.drawTooltip(mouseX, mouseY);
};
/** @description callback methods of canvas mouse click event **/
function OnMouseClick(obj) {
	obj.getDataPointAndUpdateGlobalVariable(mouseX, mouseY);
};
/** @description callback methods of canvas mouse event **/
function onSwipeLeft(obj, evt) {
	if (obj.m_clickcallback !== "" && obj.m_clickcallback !== undefined) {
		var data = {};
		try {
			eval(obj.m_clickcallback + "(data, evt)");
		} catch (e) {
			console.log(e);
		}
	}
};
/** @description callback methods of canvas mouse event **/
function onSwipeRight(obj, evt) {
	if (obj.m_clickcallback !== "" && obj.m_clickcallback !== undefined) {
		var data = {};
		try {
			eval(obj.m_clickcallback + "(data, evt)");
		} catch (e) {
			console.log(e);
		}
	}
};
function getCustomNiceScale(min, max, noofmarkers, step) {
	var makersarray = [];
	var prec = ( step + "").split(".");
	if (prec[1] !== undefined) {
    	prec = prec[1].length;
    } else {
    	prec = 0;
    }
	for(var i = 0; i <= noofmarkers; i++) {
		var currentvalue = (min + step * i).toFixed(prec);
		if (currentvalue <= max && i < noofmarkers) {
			makersarray.push(currentvalue);
		} else {
			break;
		}
	  }
	return {
		min: min,
		max: max,
		step: step,
		markerArray: makersarray
	};
};


/** @Description Instantiates a new instance of the NiceScale class **/
function NiceScale(data) {
	var minimumValue = data.minPoint.toFixed(5);
	var maximumValue = data.maxPoint.toFixed(5);
	// added below check to fix BDD-421 for updating markers for minute difference
	if(minimumValue * 1 == maximumValue * 1) {
		data.minPoint = minimumValue - (minimumValue * (10/100));
	}
	this.minPoint = data.minPoint;
	this.maxPoint = data.maxPoint;
	this.showMaxPoint = data.isMaxYaxis;
	this.showMinPoint = data.isMinYaxis;
	this.autoAxis = data.autoAxis;
	this.chartType = data.chartType;
	this.minPoint;
	this.maxPoint;
	this.maxTicks = (data.noOfMarkers == "default") ? this.getOptimumTicks(data.compHeight) : data.noOfMarkers;
	this.tickSpacing;
	this.range;
	this.niceMin;
	this.niceMax;
	this.calculate();
};
/** @Description return axis markers based upon height of component .**/
NiceScale.prototype.getOptimumTicks = function(height) {
	try{
		var arr = [{"h": 100, "m": 2},
			{"h": 120, "m": 3},
			{"h": 160, "m": 4},
			{"h": 200, "m": 5},
			{"h": 300, "m": 6},
			{"h": 400, "m": 8},
			{"h": 600, "m": 12},
			{"h": 750, "m": 15},
			{"h": 1000, "m": 20},
			{"h": 2000, "m": 25}
		];
		for(var i=0; i<arr.length; i++) {
			if(arr[i].h*1 >= height*1){
				return arr[i].m*1;
			}
		}
	} catch(e) {
		console.log(e);
	}
	return (height < 201) ? 5 : 10;
};
/** @Description Calculate and update values for tick spacing and nice. minimum and maximum data points on the axis.**/
NiceScale.prototype.calculate = function() {
    this.range = this.niceNum(this.maxPoint - this.minPoint, false);
    this.tickSpacing = this.niceNum(this.range / (this.maxTicks - 1), true);
    this.niceMin = Math.floor(this.minPoint / this.tickSpacing) * this.tickSpacing;
    this.niceMax = Math.ceil(this.maxPoint / this.tickSpacing) * this.tickSpacing;
    if (IsBoolean(this.autoAxis) && this.chartType != "100%" ) {
        if (this.niceMin == this.minPoint && this.minPoint !== 0)
            this.niceMin = this.niceMin - this.tickSpacing;

        if (this.niceMax == this.maxPoint)
            this.niceMax = this.niceMax + this.tickSpacing;
    }
    
    this.markerArray=[];
    var val = this.niceMin;
    var prec = ( this.tickSpacing + "").split(".");
    if (prec[1] !== undefined) {
    	prec = prec[1].length;
    } else {
    	prec = 0;
    }
    if(val * 1 !== 0){
    	val = this.niceMin.toFixed(prec);
    }
    if(IsBoolean(this.showMinPoint) && this.minPoint !== 0) {
    	this.niceMin = (val - this.tickSpacing).toFixed(prec);
    	this.markerArray.push(this.niceMin);
    }
    while (1) {
        this.markerArray.push(val);
        val = val * 1 + this.tickSpacing * 1;
        if (val && val.toString().indexOf("e") > -1) {
            var valA = val.toString().split("e");
            val = (valA[0] * 1).toFixed(prec) + "e" + valA[1];
        }else{
            val = (val * 1).toFixed(prec);
        }
        if (val > this.niceMax || this.markerArray.length > 30) {
            break;
        }
    }
    if(IsBoolean(this.showMaxPoint)){
    	this.niceMax = this.niceMax + this.tickSpacing;
    	this.markerArray.push(this.niceMax);
    }
};

/** @Description Returns a "nice" number approximately equal to range Rounds.the number if round = true Takes the ceiling if round = false. **/
NiceScale.prototype.niceNum = function(range, round) {
	var exponent; /** exponent of range */
	var fraction; /** fractional part of range */
	var niceFraction; /** nice, rounded fraction */

	exponent = Math.floor(this.getBaseLog(10, range));
	fraction = range / Math.pow(10, exponent);

	if (round) {
		if (fraction < 1.5)
			niceFraction = 1;
		else if (fraction < 3)
			niceFraction = 2;
		else if (fraction < 7)
			niceFraction = 5;
		else
			niceFraction = 10;
	} else {
		if (fraction <= 1)
			niceFraction = 1;
		else if (fraction <= 2)
			niceFraction = 2;
		else if (fraction <= 5)
			niceFraction = 5;
		else
			niceFraction = 10;
	}

	return niceFraction * Math.pow(10, exponent);
};

NiceScale.prototype.setMinMaxPoints = function(minPoint, maxPoint) {
	this.minPoint = minPoint;
	this.maxPoint = maxPoint;
	calculate();
};
NiceScale.prototype.setMaxTicks = function(maxTicks) {
	this.maxTicks = maxTicks;
	calculate();
};
/** @Description Returns required ScaleInfo of The Axis **/
NiceScale.prototype.getScaleInfo = function() {
	return {
		min: this.niceMin,
		max: this.niceMax,
		step: this.tickSpacing,
		markerArray: this.markerArray
	};
};
NiceScale.prototype.getBaseLog = function(x, y) {
	return Math.log(y) / Math.log(x);
};

/** @description Method to calculate yAxis markers **/
function getMax(maximum) {
	var max = maximum;
	var NoOfMarkers = 5;
	var markerText = 5;

	var divisor = 1;
	var incrementor = 1;
	var lessThanOneFlagValue = 1;
	if (!isNaN(max))
		setDivisorsMarkers(max);
	var maxDivisor = [max, NoOfMarkers, markerText];
	return maxDivisor;

	function setDivisorsMarkers(value) {
		var newMax = value;
		if (newMax > 0 && newMax < 1) {
			lessThanOneFlagValue = lessThanOneFlagValue * 10;
			newMax = newMax * 10;
			setDivisorsMarkers(newMax);
		} else if (lessThanOneFlagValue !== 1) {
			initDivisorMarker(newMax);
			getDivisor(divisor, incrementor, newMax);
			max = max / lessThanOneFlagValue;
			markerText = markerText / lessThanOneFlagValue;
		} else {
			initDivisorMarker(newMax);
			getDivisor(divisor, incrementor, newMax);
		}
	};

	/**
	 * million	6 (1,000,000)
	 * billion	9 (1,000,000,000)
	 * trillion	12 (1,000,000,000,000)
	 * quadrillion	15 (1,000,000,000,000,000)
	 **/

	function initDivisorMarker(max) {
		if (max >= 1 && max <= 5) {
			divisor = 1;
			incrementor = 1;
		} else if (max > 5 && max <= 25) {
			divisor = 2;
			incrementor = 1;
		} else if (max > 25 && max <= 100) {
			divisor = 5;
			incrementor = 5;
		} else if (max > 100 && max <= 200) {
			divisor = 20;
			incrementor = 10;
		} else if (max > 200 && max <= 500) {
			divisor = 50;
			incrementor = 10;
		} else if (max > 500 && max <= 1000) {
			divisor = 100;
			incrementor = 50;
		} else if (max > 1000 && max <= 2000) {
			divisor = 200;
			incrementor = 100;
		} else if (max > 2000 && max <= 5000) {
			divisor = 500;
			incrementor = 500;
		} else if (max > 5000 && max <= 100000) {
			divisor = 2000;
			incrementor = 1000;
		} else if (max > 100000 && max <= 1000000) {
			divisor = 10000;
			incrementor = 10000;
		} else if (max > 1000000 && max <= 10000000) {
			divisor = 1000000;
			incrementor = 5000000;
		} else if (max > 10000000 && max <= 100000000) {
			divisor = 10000000;
			incrementor = 10000000;
		} else if (max > 100000000 && max <= 1000000000) {
			divisor = 100000000;
			incrementor = 10000000;
		} else if (max > 1000000000 && max <= 10000000000) {
			divisor = 100000000;
			incrementor = 100000000;
		} else if (max > 10000000000 && max <= 100000000000) {
			divisor = 1000000000;
			incrementor = 1000000000;
		} else {
			divisor = 100000000000;
			incrementor = 100000000000;

			var numberOfDigits = getLengthOfValue(max);
			if (getLengthOfValue(max) > 10) {
				divisor = Math.pow(10, numberOfDigits - 2);
				incrementor = Math.pow(10, numberOfDigits - 1);
			}
		}
	};

	function getLengthOfValue(number) {
		var data = number.toString().split(/[eE]/);
		if (data.length === 1)
			return data[0].length;

		var z = "",
			sign = this < 0 ? "-" : "",
			str = data[0].replace(".", ""),
			mag = Number(data[1]) + 1;

		if (mag < 0) {
			z = sign + "0.";
			while (mag++)
				z += "0";
			return (z + str.replace(/^\-/, "")).length;
		}
		mag -= str.length;
		while (mag--)
			z += "0";
		return (str + z).length;
		//return number.toString().length;
	};

	function setMaxMarkerText(quotient, divisor) {
		NoOfMarkers = Math.ceil(quotient);
		max = divisor * NoOfMarkers;
		markerText = divisor;
	};

	function getDivisor(divisor, incrementor, max) {
		var quotient = max / divisor;
		if (quotient <= 5) {
			setMaxMarkerText(quotient, divisor);
		} else {
			var newDivisor = divisor + incrementor;
			getDivisor(newDivisor, incrementor, max);
		}
	};
};

function getMin(min) {
	return (min % 5 !== 0) ? min - min % 5 : min;
};
/** @description Array Sorter **/
function numOrdA(a, b) {
	return (a - b);
};

function numOrdD(a, b) {
	return (b - a);
};

/** @description It will read the canvas and return the specified Image format 
 * @param {canvas} reference of canvas element, {format} "png", "jpeg", "gif" etc.
 **/
function getImageDataFromCanvas(canvas, format) {
	return canvas.toDataURL("image/" + format);
};

function getNumberFormattedSymbol(text, unit) {
	var compareVal = Math.abs(text);
	if(unit === "Rupees") {
		return getNumberFormattedIndianSymbol(compareVal, unit);
	}
	if (compareVal < 1000) {
		return "";
	} else if (compareVal >= 1000 && compareVal < 1000000) {
		return "K";
	} else if (compareVal >= 1000000 && compareVal < 1000000000) {
		return "M";
	} else if (compareVal >= 1000000000 && compareVal < 1000000000000) {
		return "B";
	} else if (compareVal >= 1000000000000 && compareVal < 1000000000000000) {
		return "T";
	} else if (compareVal >= 1000000000000000 && compareVal < 1000000000000000000) {
		return "Q";
	} else if (compareVal >= 1000000000000000000 && compareVal < 1000000000000000000000) {
		return "E";
	} else {
		return "";
	}
};

function getNumberFormattedIndianSymbol(compareVal, unit) {
	if (compareVal < 1000) {
		return "";
	} else if (compareVal >= 1000 && compareVal < 100000) {
		return "K";
	} else if (compareVal >= 100000 && compareVal < 10000000) {
		return "Lacs";
	}  else if (compareVal >= 10000000 && compareVal < 1000000000000000000000) {
		return "Cr";
	} else {
		return "";
	}
};

function getNumberFormattedNumericValue(text, prec, unit) {
	var compareVal = Math.abs(text);
	var precision = (prec == undefined || prec == 'default') ? 1 : prec;
	var value = text;
	if(unit === "Rupees") {
		return getNumberFormattedNumericIndianValue(compareVal, value, precision);
	}
	/**DAS-1133 for story changes done*/
	if (compareVal < 1000) {
		value = value.toFixed(precision);
		return value;
	}
	if (compareVal >= 1000 && compareVal < 1000000) {
		value = text * 1 / 1000;
		if (value % 1 !== 0)
			value = value.toFixed(precision);
		return value;
	} else if (compareVal >= 1000000 && compareVal < 1000000000) {
		value = text * 1 / 1000000;
		if (value % 1 !== 0)
			value = value.toFixed(precision);
		return value;
	} else if (compareVal >= 1000000000 && compareVal < 1000000000000) {
		value = text * 1 / 1000000000;
		if (value % 1 !== 0)
			value = value.toFixed(precision);
		return value;
	} else if (compareVal >= 1000000000000 && compareVal < 1000000000000000) {
		value = text * 1 / 1000000000000;
		if (value % 1 !== 0)
			value = value.toFixed(precision);
		return value;
	} else if (compareVal >= 1000000000000000 && compareVal < 1000000000000000000) {
		value = text * 1 / 1000000000000000;
		if (value % 1 !== 0)
			value = value.toFixed(precision);
		return value;
	} else if (compareVal >= 1000000000000000000 && compareVal < 1000000000000000000000) {
		value = text * 1 / 1000000000000000000;
		if (value % 1 !== 0)
			value = value.toFixed(precision);
		return value;
	} else {
		return value;
	}
};

function getNumberFormattedNumericIndianValue(compareVal, value, precision) {
	if (compareVal < 1000) {
		value = value.toFixed(precision);
		return value;
	}
	if (compareVal >= 1000 && compareVal < 100000) {
		value = value * 1 / 1000;
		if (value % 1 !== 0)
			value = value.toFixed(precision);
		return value;
	} else if (compareVal >= 100000 && compareVal < 10000000) {
		value = value * 1 / 100000;
		if (value % 1 !== 0)
			value = value.toFixed(precision);
		return value;
	} else if (compareVal >= 10000000 && compareVal < 1000000000000000000000) {
		value = value * 1 / 10000000;
		if (value % 1 !== 0)
			value = value.toFixed(precision);
		return value;
	}  else {
		return value;
	}
};

function getNumberFormattedValue(text) {
	var compareVal = Math.abs(text);
	var value = text;
	if (compareVal < 1000) {
		return value;
	}
	if (compareVal >= 1000 && compareVal < 1000000) {
		value = text * 1 / 1000;
		if (value % 1 !== 0)
			value = value.toFixed(1);
		return value + "K";
	} else if (compareVal >= 1000000 && compareVal < 1000000000) {
		value = text * 1 / 1000000;
		if (value % 1 !== 0)
			value = value.toFixed(1);
		return value + "M";
	} else if (compareVal >= 1000000000 && compareVal < 1000000000000) {
		value = text * 1 / 1000000000;
		if (value % 1 !== 0)
			value = value.toFixed(1);
		return value + "B";
	} else if (compareVal >= 1000000000000 && compareVal < 1000000000000000) {
		value = text * 1 / 1000000000000;
		if (value % 1 !== 0)
			value = value.toFixed(1);
		return value + "T";
	} else if (compareVal >= 1000000000000000 && compareVal < 1000000000000000000) {
		value = text * 1 / 1000000000000000;
		if (value % 1 !== 0)
			value = value.toFixed(1);
		return value + "Q";
	} else if (compareVal >= 1000000000000000000 && compareVal < 1000000000000000000000) {
		value = text * 1 / 1000000000000000000;
		if (value % 1 !== 0)
			value = value.toFixed(1);
		return value + "E";
	} else {
		return value;
	}
};

function setGlobalFont(fontProperties) {
	globalFont = fontProperties;
};

function selectGlobalFont(suppliedFont) {
	return (globalFont && globalFont.useGlobal) ? globalFont.fontFamily : suppliedFont;
};

function createNewInstance(strClass) {
	var args = Array.prototype.slice.call(arguments, 1);
	var clsClass = eval(strClass);

	function F() {
		return clsClass.apply(this, args);
	}
	F.prototype = clsClass.prototype;
	return new F();
};
/** returns a deep copy of the object **/
function getDuplicateObject(obj) {
	try {
		return $.extend(true, {}, obj);
	} catch (e) {
		return obj;
	}
};
/** returns a deep copy of array to prevent circular reference **/
function getDuplicateArray(arr) {
	try {
		return JSON.parse(JSON.stringify(arr));
	} catch (e) {
		return arr;
	}
};
/** returns true if array is with unique values **/
function isUniqueArray(arr) {
  return arr.length === _.uniq(arr).length;
};
function getDuplicatesFromArray(arr){
	Array.prototype.getDuplicates = function () {
	    var duplicates = {};
	    for (var i = 0; i < this.length; i++) {
	        if(duplicates.hasOwnProperty(this[i])) {
	            duplicates[this[i]].push(i);
	        } else if (this.lastIndexOf(this[i]) !== i) {
	            duplicates[this[i]] = [i];
	        }
	    }
	    return duplicates;
	}
	return arr.getDuplicates();
};

/** returns count of number of digits after decimal **/
function countDecimal(num) {
	return (num.split('.')[1] || []).length;
};
/** will open link in new Tab.(Used in Datagrid) **/
function openHyperlink(val){
	window.open("http://"+val,'_blank');
};
function onAfterRender(callback) {
	/**Calling script's method**/
	callback.call();
};
/** @description this method remove comma ( , ) from a numeric value. i.e. ""192,456.89"" **/
function removeCommaFromSrting(value) {
	var newValue = value;
	if (isNaN(value) && value !== undefined) {
		newValue = ("" + value).replace(/,/g,"");
		newValue = isNaN(newValue) ? newValue : newValue*1;
	}
	return newValue;
};
/**encoding string value, working same as btoa, added to support rupee and euro symbol**/
function b64EncodeUnicode(str) {
    /*first we use encodeURIComponent to get percent-encoded UTF-8, then we convert the percent encodings into raw bytes which can be fed into btoa.*/
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
};
/**decoding string value, working same as atob, added to support rupee and euro symbol**/
function b64DecodeUnicode(str) {
    /*Going backwards from bytestream, to percent-encoding, to original string.*/
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
};

/** @description this method will display alert popup modal*/
function alertPopUpModal(obj) {
	$("#alertPopUpModal").remove();
	$("#alertPopUpModaloverlay").remove();
	var cssObj = {
	    "error": {
	    	"color": "#ffffff",
		    "background-color": "#BD362F",
		    "border-color": "#BD362F",
	    },
	    "failure": {
	    	"color": "#ffffff",
		    "background-color": "#BD362F",
		    "border-color": "#BD362F",
	    },
	    "info": {
	        "color": "#31708f",
	        "background-color": "#d9edf7",
	        "border-color": "#d9edf7",
	    },
	    "success": {
	        "color": "#ffffff",
	        "background-color": "#008000",
	        "border-color": "#008000",
	    },
	    "warning": {
	    	"color": "#ffffff",
		    "background-color": "#F89406",
		    "border-color": "#F89406",
	    }
	};
	obj.type = obj.type ? obj.type : "info";
	obj.message = obj.message ? obj.message : "Status Message";
	var delay = obj.timeout ? obj.timeout : 3000;
	var overlaydiv = document.createElement("div");
	overlaydiv.setAttribute("id", "alertPopUpModaloverlay");
	$(overlaydiv).css({
	  "position":"fixed", /* Positioning and size */
	  "top":"0",
	  "left":"0",
	  "z-index": 9999,
	  "width": "100%",
      "height": "100%",
	  "background-color":"rgba(128,128,128,0.5)", /* color */
	  "display":"none", /* making it hidden by default */
      });
	var div = document.createElement("div");
	div.setAttribute("id", "alertPopUpModal");
	/**DAS-938 */
	var spanclose = document.createElement("span");
	spanclose.innerHTML = '&times;';
	div.innerHTML = obj.message;
	$(spanclose).css({
            "position": "absolute",
            "right": "10px",
            "color": "#fff",
            "font-weight": "bold",
            "cursor": "pointer",
            "font-size": "21px",
    		"line-height": "15px"
      });
	$(div).css({
		"position": "absolute",
	    "display": "none",
		"width": "auto",
		"max-width": "350px",
		"min-width": "250px",
		"top": 0 + "px",
		"left": 0 + "px",
		"right": 0 + "px",
		"margin": "0 auto",
		"z-index": 9999,
		"text-align": "center",
		"padding": "10px",
		"border": "2px solid transparent",
		"border-radius": "3px",
		"font": "normal" + " " + "normal" + " " + 14 + "px " + selectGlobalFont("Roboto"),
		"box-shadow": "rgba(0, 0, 0, 0.1) 0px 12px 20px -10px, rgba(0, 0, 0, 0.2) 0px 4px 20px 0px, rgba(0, 0, 0, 0.5) 0px 7px 8px -5px",
		"-moz-box-shadow": "rgba(0, 0, 0, 0.1) 0px 12px 20px -10px, rgba(0, 0, 0, 0.2) 0px 4px 20px 0px, rgba(0, 0, 0, 0.5) 0px 7px 8px -5px",
		"-webkit-box-shadow": "rgba(0, 0, 0, 0.1) 0px 12px 20px -10px, rgba(0, 0, 0, 0.2) 0px 4px 20px 0px, rgba(0, 0, 0, 0.5) 0px 7px 8px -5px"
	});
	$(div).css(cssObj[obj.type]);
	if(obj.type == "error" || obj.type ==  "warning"){
		div.append(spanclose);
		overlaydiv.append(div);
		document.body.appendChild(overlaydiv);
	}else
	document.body.appendChild(div);
	
	
	/**DAS-938 */
	$(spanclose).click(function(e) // You are clicking the close button
    {
    $(div).fadeOut(400); // Now the pop up is hiden.
    $("#alertPopUpModaloverlay").css({'display':'none'});
    });
    
    if(localStorage.getItem('popState') == obj.message){
	$(div).fadeOut(400);
	localStorage.setItem('popState',null);
	}
	if(obj.type == "error" || obj.type ==  "warning"){
	$(div).fadeIn(300);
	localStorage.setItem('popState',obj.message);
	$("#alertPopUpModaloverlay").css({'display':'block'});
	}else{
		$(div).fadeIn( 300 ).delay( delay ).fadeOut( 400 );
	}
};
/************************* Svg Title ************************************/
function svgTitle(m_chart) {
	this.base = Title;
	this.base(m_chart);
};

svgTitle.prototype = new Title;

/** @description will draw the titleBox on SVG. **/
svgTitle.prototype.drawTitleBox = function () {
	var temp = this;
	var x = this.m_chart.m_x * 1;
	var y = this.m_chart.m_y * 1;
	var w = this.m_chart.m_width * 1;
	var h = this.m_titleBarHeight;

	var xmlns = "http://www.w3.org/2000/svg";
	var rect = document.createElementNS(xmlns, "rect");
	rect.setAttributeNS(null, "x", x);
	rect.setAttributeNS(null, "y", y);
	rect.setAttributeNS(null, "height", h);
	rect.setAttributeNS(null, "width", w);
	rect.setAttributeNS(null, "fill", this.m_gradientcolorsArray[0]);
	$("#" + temp.m_chart.svgContainerId).append(rect);
};

/** @description draw the title text on svg. **/
svgTitle.prototype.drawText = function () {
	var temp = this;
	if (IsBoolean(this.m_chart.m_enablehtmlformate.title)) {
		this.drawTitleTextInHTML();
	} else {
		//this.startY = this.m_chart.m_y * 1 + (this.m_titleBarHeight) / (1 + this.m_formattedDescription.length);
		var text = drawSVGText(this.startX, (this.startY), "", this.m_fontColor, this.getAlign(), "middle");
		wrapSVGText(temp, this.startX, (this.startY), this.m_formattedDescription, text, temp.m_chart.fontScaling(this.m_fontsize), (this.m_chart.m_width * 1 - 20 * 1));
		text.setAttribute("dominant-baseline", "middle");
		text.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getFontSize()) + "px;font-weight:" + this.getFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
		 // Internet Explorer 6-11
		var isIE = /*@cc_on!@*/false || !!document.documentMode;
		if (isIE) {
			text.setAttribute("dy", "0.3em");
		}
		$("#" + temp.m_chart.svgContainerId).append(text);
	}
};
/** @description draw the title text in html formate . **/
svgTitle.prototype.drawTitleTextInHTML = function () {
	var temp = this;
	$( "#title" + this.m_chart.m_objectid).remove();
	var text = document.createElement("div");
	var span = document.createElement("span");
	text.setAttribute("id", "title" + this.m_chart.m_objectid);
	span.innerHTML = this.m_chart.formattedDescription(this.m_chart, this.getDescription());
	text.style.height = this.m_chart.fontScaling(temp.m_titlebarheight) + "px";
	var iconWidth = (IsBoolean(this.m_chart.m_showmaximizebutton)) ? (temp.maxIconWidth*1) : 0;
	iconWidth = (IsBoolean(this.m_chart.m_showsettingmenubutton)) ? iconWidth + 25 : iconWidth + 0;
	span.setAttribute("style","display: inline-block; vertical-align: middle; line-height: 1.1;text-decoration:inherit;");
	text.setAttribute("style", "position: absolute; top:0px; left:0px;height:"+ this.m_chart.fontScaling(temp.m_titlebarheight) +"px;width:calc(100% - "+ iconWidth +"px);line-height:"+this.m_chart.fontScaling(temp.m_titlebarheight)+"px;padding-left:"+temp.m_chartLeftRightMargin+"px;font-family:" 
			+ this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getFontSize()) + "px;font-weight:" 
			+ this.getFontWeight() + ";color:"+this.m_fontColor +";text-align:"+this.getAlign()+";text-decoration:" + this.getTextDecoration() + ";overflow: hidden;white-space: nowrap;text-overflow: ellipsis;");
	
	$(text).append(span);
	$("#draggableDiv" + temp.m_chart.m_objectid).append(text);
};
/*************************** Svg SubTitle **************************/

function svgSubTitle() {
	this.base = SubTitle;
	this.base();
};

svgSubTitle.prototype = new SubTitle;

/** @description draw the Subtitle text on svg. **/
svgSubTitle.prototype.drawText = function () {
	var temp = this;
	if (IsBoolean(this.m_chart.m_enablehtmlformate.subtitle)) {
		this.drawSubTitleTextInHTML();
	} else {
		var text = drawSVGText(this.startX, (this.startY), "", this.m_fontColor, this.getAlign(), "middle");
		wrapSVGText(temp, this.startX, (this.startY), this.m_formattedDescription, text, temp.m_chart.fontScaling(this.m_fontsize), (this.m_chart.m_width * 1 - 20 * 1));
		text.setAttribute("dominant-baseline", "middle");
		text.setAttribute("style", "font-family:" + this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getFontSize()) + "px;font-weight:" + this.getFontWeight() + ";text-decoration:" + this.getTextDecoration() + ";");
		this.m_subtitleText = text;
		 // Internet Explorer 6-11
		var isIE = /*@cc_on!@*/false || !!document.documentMode;
		if (isIE) {
			text.setAttribute("dy", "0.3em");
		}
		$("#" + temp.m_chart.svgContainerId).append(text);
	}
};

/** @description draw the subtitle text in html formate . **/
svgSubTitle.prototype.drawSubTitleTextInHTML = function () {
	var temp = this;
	$( "#subTitle" + this.m_chart.m_objectid).remove();
	var text = document.createElement("div");
	var span = document.createElement("span");
	text.setAttribute("id", "subTitle" + this.m_chart.m_objectid);
	span.innerHTML = this.m_chart.formattedDescription(this.m_chart, this.getDescription());
	//text.style.height = this.m_chart.fontScaling(temp.m_subTitleBarHeight) + "px";
	var iconWidth = (IsBoolean(this.m_chart.m_showmaximizebutton)) ? (temp.maxIconWidth*1) : 0;
	iconWidth = (IsBoolean(this.m_chart.m_showsettingmenubutton)) ? iconWidth + 25 : iconWidth + 0;
	/*var top = 0;
	if(IsBoolean(this.m_chart.getTitle().m_showtitle)) {
		//iconWidth = 0;
		top = this.m_chart.fontScaling(temp.m_chart.getTitle().m_titlebarheight) ; 
	}*/
	var top = this.m_titleMargin;
	span.setAttribute("style","display: inline-block; vertical-align: top;line-height: 1.1;text-decoration:inherit;height:"+this.m_subTitleBarHeight+"px;");
	text.setAttribute("style", "position: absolute; top:"+ top +"px;left:0px;width:calc(100% - "+ iconWidth +"px);padding-left:"+temp.m_chartLeftRightMargin+"px;font-family:" 
			+ this.getFontFamily() + ";font-style:" + this.getFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getFontSize()) + "px;font-weight:" 
			+ this.getFontWeight() + ";color:"+this.m_fontColor +";text-align:"+this.getAlign()+";text-decoration:" + this.getTextDecoration() + ";overflow: hidden;white-space: nowrap;text-overflow: ellipsis;");
	$(text).append(span);
	$("#draggableDiv" + temp.m_chart.m_objectid).append(text);
};

//# sourceURL=Widget.js