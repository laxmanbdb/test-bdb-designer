/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: DataManager.js
 * @description Chart class is the parent class for all charting components
 **/
function Chart() {
	this.base = Widget;
	this.base();

	this.m_enablecolorfromdrill = "";
	this.m_id = "";
	this.m_name = "";
	this.m_type = "";
	this.m_legendShowType = "series"; //type : series,category,subcategory

	this.m_backgroundcolor = 0;
	this.m_showgradient = 0;
	this.m_bgalpha = "1";
	this.m_bggradients = "#f1f1f1,#f1f1f1";
	this.m_bggradientrotation = "0";
	this.m_backgroundalpha = 0;

	this.m_showborder = true;
	this.m_bordercolor = "#BDC3C7";
	this.m_borderthickness = 1;

	this.m_horizontalaxisautoadjust = 0;
	this.m_horizontalaxisbasezero = 0;
	this.m_horizontalminimumaxisvalue = 20;
	this.m_horizontalmaximumaxisvalue = 110;
	this.m_minimumaxisvalue = 0;
	this.m_maximumaxisvalue = 0;
	this.m_autoaxissetup = 0;
	this.m_basezero = 0;

	this.m_associatedlegendid = "";
	this.m_showlegends = 0;
	this.m_legenddirection = "";
	this.m_legendfontcolor = "";
	this.m_legendfontstyle = "";
	this.m_legendfontfamily = "Roboto";
	this.m_legendtextdecoration = "";
	this.m_showcheckboxwithlegend = false;
	this.m_showcheckboxseprate = 0;
	this.m_showcolorbandlegends = "false";
	this.m_legendfontsize = "";
	this.m_legendfontweight = "normal";
	this.m_legendiconshape = "bd-menu-2";

	this.m_bandalphas = 0;
	this.m_showcolorbands = 0;
	this.m_colorbandranges = "";
	this.m_bandcolors = "";
	this.m_banddisplaynames = "";
	this.m_showcolorbandlegends = 0;

	this.m_rangesofseries = "";
	this.m_rangedseriescolors = "";
	this.m_rangedseriesdisplaynames = "";
	this.m_rangeenabledseries = "";

	this.m_secondaryaxisshow = 0;
	this.m_secondaxisbasezero = 0;
	this.m_secondaxisautosetup = 0;
	this.m_secondaxisminimumvalue = 0;
	this.m_secondaxismaximumvalue = 0;
	this.m_secondaryaxisformater = "";
	this.m_secondaryaxisunit = 0;
	this.m_secondaryaxisprecision = "default";
	this.m_secondaryaxissignposition = "";
	this.m_secondaryaxissecondaryformatter = "Number";
	this.m_secondaryaxissecondaryunit = "none";
	this.m_secondaryaxislabelfontcolor = "#494950";
	this.m_secondaryaxislabelfontsize = "12"
	this.m_secondaryaxislabelfontstyle = "normal";
	this.m_secondaryaxislabelfontweight = "normal";
	this.m_secondaryaxislabelfontfamily = "BizvizFont";
	this.m_secondaryaxislabeltextdecoration = "none";

	this.m_secondaxisdiscription = "";
	this.m_secondaxisfontcolor = "#000000";
	this.m_secondaxisfontsize = 10;
	this.m_secondaxisfontstyle = "normal";
	this.m_secondaxisfontweight = "normal";
	this.m_secondaxisfontfamily = "Roboto";
	this.m_secondaxistextdecoration = "none";
	this.m_secondaxisprecision = 0;

	this.m_fixedlabel = true;
	this.m_formater = "";
	this.m_secondaryformater = "";
	this.m_unit = "$";
	this.m_secondaryunit = "";
	this.m_precision = 0;
	this.m_signposition = 0;

	this.m_pptheading = "";
	this.m_pptsubheading = "";
	this.m_scrnshotfilename = "";
	this.m_showexceldownload = "false";

	this.m_showmaximizebutton = "true";

	this.m_isConditionalColor = false;
	this.m_conditionalColors = "";
	this.m_categoryColors = "";

	this.m_globalkey = "";
	this.m_chartbase = "plain";
	this.m_charttype = "";
	this.m_showpoint = true;
	this.m_lineform = "segment";

	this.m_showtitle = "";
	this.m_showsubtitle = "";

	this.m_drillColor = "#e0dfdf";
	this.m_drillminstackheight = 15;/**To allow drill event for small stacks*/
	this.m_seriescolor = "991818,759999,313210,824434,555441";
	this.m_strokecolor = "";
	this.m_gradientcolor = "";
	this.m_declinefillcolor = "";
	this.m_fillcolor = "";
	this.m_targetcolor = "";
	this.m_valuecolor = "";
	this.m_enablecolorfromdrill = 0;
	this.m_plotwithlabel = 0;

	this.m_currentphasebordercolor = "#ff0000";
	this.m_sourcedateformat = "mm/dd/yyyy";
	this.m_url = "";

	this.m_axiscolor = "";
	this.m_categorymarkingcolor = "#ffffff";
	this.m_markercolor = "#ffffff";
	this.m_showmarkerline = false;
	this.m_markertransparency = 0.5;

	this.plugin = new Plugin();
	this.m_chartFrame = new ChartFrame();
	this.m_title = new Title(this);
	this.m_subTitle = new SubTitle();
	this.m_tooltip = new Tooltip();

	this.m_isEmptySeries = true;
	this.m_showSeries = [];
	this.m_startDrill = false;
	this.m_tickmarks = false;
	this.m_tickmarksatstart = false;
	this.m_showverticalmarkerline = false;

	this.m_sliderborderopacity = 0.8;
	this.m_sliderTextField = "";
	this.m_sliderStartText = "";
	this.m_sliderEndText = "";
	
	this.m_continuouslinetype = {"straight" : "dot" , "dot" : "straight" , "dash" : "straight" , "dash1" : "straight"};

	this.m_barwidth = 50;
	this.m_hideoverbounddatalabel = "false";
	/**Added for Data Label Overlap issue*/
	this.m_overlappeddatalabelarrayY = [];
	this.m_overlappeddatalabelarrayX = [];
	/*Repeater Attributes*/
	this.m_isrepeater = "false";
	this.m_repeaterfield = "";
	this.m_repeateradditionalfield = "";
	this.m_repeaterfieldvalue = "";
	this.m_repeatercolumns = "3";
	this.m_repeaterheight = "250";
	this.m_repeatervmargin = "5";
	this.m_repeaterhmargin = "5";
	this.m_repeaterallexport  = "false";
	this.m_repeatercommonmarker = "false";
	this.m_repeaterscrollwidth = "";

	this.m_repeaterCharts = [];
	this.m_hidelegendonstart = true;
	this.m_chartalignment = "center";
	this.m_sliderrange = "auto";
	this.m_axistodrawingareamargin = 0;
	this.m_showtooltip = true;
	this.m_tooltipprecision = "default";
	this.m_tooltiphighlighter = "true";
	 /**Added default property for Custom Tool Tip for Old chart*/
	 this.m_customtextboxfortooltip = {
	     "dataTipTypeArray": "",
	     "dataTipType": "Default",
	     "datatipData": "",
	     "formatter": {},
	     "useComponentFormatter": true,
	     "displayWindow": "textBox"
	 };
    /**Added for hundred percent chart type tool tip properties*/
    this.m_tooltipproperties = {
    	    "showcummulativesum": "true",
    	    "showcummulativepercent": "true",
    	    "tooltippercentprecision": "auto",
    	    "tooltipheadervalue": ["Field","Value","Percent","Cumulative Sum","Cumulative Percentage"]
    };
	/**Added padding between two column Stack in clustered*/
	this.clusteredbarpadding = 0.9;
	/** Added for to skip number of x axis lables **/
	this.m_skipxaxislabels = "auto";
	
	/** If any new padding is being added here, add || 0 there because this object is overriden in old dashboards **/
	this.m_chartpaddings = {	
	    	"leftBorderToDescription": 5,	
	    	"leftDescriptionToMarkers": 5,	
	    	"leftMarkersToLine": 5,	
	    	"rightBorderToLegend": 15,	
	    	"rightLegendSpace": 10,	
	    	"rightLegendToLine": 5,	
	    	"rightLegendToDescription": 5,	
	    	"rightDescriptionToMarkers": 5,	
	    	"rightMarkersToLine": 5,	
	    	"topTitleToSubtitle": 10,	
	    	"topSubtitleToChart": 10,	
	    	"bottomBorderToDescription": 20,	
	    	"bottomDescriptionToMarkers":10,	
	    	"bottomMarkersToLine": 5,	
	    	"chartToBorder": 15	
		};
    this.m_updateddesign ="false";
	this.m_canvastype = "canvas";
	// added for showing the extra min and max markers on axis
	this.m_ismaxyaxis = false;
	this.m_isminyaxis = false;
	// added for enabling and controlling axis through scriopt
	this.m_customaxis = {
		"enable": "false",
		"axis": {
			"left": {
				"data": {
					"min": 10,
					"max": 100,
					"step": 10,
					"noOfMarkers": 10
				}
			},
			"right": {
				"data": {
					"min": 10,
					"max": 100,
					"step": 10,
					"noOfMarkers": 10
				}
			}
		}
	};
	/**BDD-581 : Added for opacity of TreeMap, HeatMap, Map, Pie & Progress Pie.*/
	this.m_coloropacity = "1";
	this.m_noofmarkers = "default";
	this.m_datalablebackgroundrect = "false";
	this.m_titletextwrap = true;
	this.m_subtitletextwrap = true;
};

Chart.prototype = new Widget;

/** @description method to get scaled font **/
Chart.prototype.fontScaling = function(fontSize) {
	return fontSize * this.minWHRatio();
};
/** @description method to get the associated legend object **/
Chart.prototype.getLegendComponentObj = function() {
	if (this.m_associatedlegendid !== "" && IsBoolean(!this.m_designMode) && this.m_dashboard) {
		for (var i = 0; i < this.m_dashboard.m_widgetsArray.length; i++) {
			if (this.m_associatedlegendid == this.m_dashboard.m_widgetsArray[i].m_objectid) {
				return this.m_dashboard.m_widgetsArray[i];
			}
		}
	}
};

/** @description checks for at least one series is visible or not **/
Chart.prototype.isVisibleSeries = function() {
	for (var i = 0; i < this.m_seriesNames.length; i++) {
		if (this.m_seriesVisibleArr[this.m_seriesNames[i]])
			return true;
	}
	return false;
};

/** @description checks for at least one series is visible or not **/
Chart.prototype.countVisibleSeries = function() {
	var count = 0;
	for (var i = 0; i < this.m_seriesNames.length; i++) {
		if (this.m_seriesVisibleArr[this.m_seriesNames[i]])
			count = count+1;
	}
	return count;
};

/** @description get series data for only visible series **/
Chart.prototype.getVisibleSeriesData = function(yAxisData) {
	var tempMap = {
		"seriesData": [],
		"seriesColor": [],
		"seriesDisplayName": [],
		"seriesName": []
	};
	for (var i = 0; i < this.m_seriesNames.length; i++) {
		if (this.m_seriesVisibleArr[this.m_seriesNames[i]]) {
			tempMap.seriesData.push(yAxisData[i]);
			tempMap.seriesColor.push(this.m_seriesColors[i]);
			tempMap.seriesDisplayName.push(this.m_seriesDisplayNames[i]);
			tempMap.seriesName.push(this.m_seriesNames[i]);
		}
	}
	return tempMap;
};

/**  @description check for valid configuration of category and series to draw a component, if not then set the message **/
Chart.prototype.IsDrawingPossible = function() {
	var map = {};
	if (!IsBoolean(this.isEmptyCategory)) {
		if (!IsBoolean(this.m_isEmptySeries)) {
			if (IsBoolean(this.isVisibleSeries())) {
				map = {
					"permission": "true",
					message: this.m_status.success
				};
			} else {
				map = {
					"permission": "false",
					message: this.m_status.noSeries
				};
			}
		} else {
			if (IsBoolean(this.m_allSeriesDisplayNames.length > 0)) {
				if (IsBoolean(this.isVisibleSeries())) {
					if ((IsBoolean(this.m_isEmptySeries))) {
						map = {
							"permission": "false",
							message: this.m_status.noData
						};
					}
				} else {
					map = {
						"permission": "false",
						message: this.m_status.noSeries
					};
				}
			} else {
				map = {
					"permission": "false",
					message: this.m_status.noData
				};
			}
		}
	} else {
		map = {
			"permission": "false",
			message: this.m_status.noCategory
		};
	}
	return map;
};

/********************** START code for calculate min/max and marker array ********************************/
Chart.prototype.getValidInitialValue = function(yAxisData) {
	var val = 0;
	if (yAxisData.length > 0) {
		for (var i = 0; i < yAxisData[0].length; i++) {
			if (!isNaN(yAxisData[0][i] * 1)) {
				val = yAxisData[0][i];
				break;
			}
		}
	}
	return val;
};
/** @description method to calculate minimum and maximum val from the data array  **/
Chart.prototype.calculateMinMaxValue = function(yAxisData) {
    var calculateMax = this.getValidInitialValue(yAxisData);
    var calculateMin = this.getValidInitialValue(yAxisData);
    
    var yAxisfilteredData = yAxisData.map(function(a) {
        return a.filter(function(value) {
            return (value != "undefined" && value != "" && value != "null");
        });
    });
    for (var i = 0; i < yAxisfilteredData.length; i++) {
        for (var j = 0; j < yAxisfilteredData[i].length; j++) {
            if (1 * (yAxisfilteredData[i][j]) > calculateMax) {
                calculateMax = 1 * (yAxisfilteredData[i][j]);
            }
            if (1 * (yAxisfilteredData[i][j]) < calculateMin) {
                calculateMin = 1 * (yAxisfilteredData[i][j]);
            }
        }
    }
    return {
        max: calculateMax,
        min: calculateMin
    };
};
/** @description This method providing the informations like- Min, Max, MarkerArray, markerText, NoOfMarker for the Chart Y-axis Marking **/
Chart.prototype.getCalculateNiceScale = function(calculatedMin, calculatedMax, baseZero, autoAxisSetup, minimumAxisValue, maximumAxisValue, chartHeight, axis) {
	if(!IsBoolean(this.m_customaxis.enable)) {
		var min, max;
		var chartType = this.m_componenttype == "timeline_chart" ? this.m_columntype : (this.m_chartType ? this.m_chartType : this.m_charttype);
		if (calculatedMin === calculatedMax) {
			if (calculatedMin > 0) {
			//	/** decrease 40% from min and add 40% in max **/
			//	calculatedMin = calculatedMin * 3 / 5;
			//	calculatedMax = calculatedMax * 7 / 5;
				/** DAS-49: decrease 40% from min and add 5% to max **/
				calculatedMin = calculatedMin * 3 / 5;
				calculatedMax = calculatedMax * 21 / 20;
			} else {
			//	calculatedMin = calculatedMin * 7 / 5;
			//	calculatedMax = calculatedMax * 3 / 5;
				calculatedMin = calculatedMin * 21 / 20;
				calculatedMax = calculatedMax * 3 / 5;
			}
		}
		if (IsBoolean(baseZero) && IsBoolean(autoAxisSetup)) {
			min = 0;
			max = calculatedMax * 1;
		} else if (IsBoolean(baseZero) && !IsBoolean(autoAxisSetup)) {
			min = 0;
			max = (isNaN(maximumAxisValue) || (maximumAxisValue === "")) ? 0 : maximumAxisValue * 1;
		} else if (!IsBoolean(baseZero) && IsBoolean(autoAxisSetup)) {
			min = calculatedMin * 1;
			max = calculatedMax * 1;
		} else if (!IsBoolean(baseZero) && !IsBoolean(autoAxisSetup)) {
			min = (isNaN(minimumAxisValue) || (maximumAxisValue === "")) ? 0 : minimumAxisValue * 1;
			max = (isNaN(maximumAxisValue) || (maximumAxisValue === "")) ? 0 : maximumAxisValue * 1;
		}
		if (max <= min) {
			max = (min + 4);
		}
		var scaleConfigObj = {
		    	"minPoint": min,
		    	"maxPoint": max,
		    	"compHeight": chartHeight,
		    	"isMaxYaxis": this.m_ismaxyaxis,
		    	"isMinYaxis": this.m_isminyaxis,
		    	"noOfMarkers": this.m_noofmarkers,
		    	"autoAxis": autoAxisSetup,
		    	"chartType": chartType
		};
		var obj = new NiceScale(scaleConfigObj);
		return (obj.getScaleInfo());
	} else {
		if(axis == "left" || axis == undefined) {
			var obj = getCustomNiceScale(this.m_customaxis.axis.left.data.min, this.m_customaxis.axis.left.data.max, this.m_customaxis.axis.left.data.noOfMarkers, this.m_customaxis.axis.left.data.step);
			return obj;
		} else {
			var obj = getCustomNiceScale(this.m_customaxis.axis.right.data.min, this.m_customaxis.axis.right.data.max, this.m_customaxis.axis.right.data.noOfMarkers, this.m_customaxis.axis.right.data.step);
			return obj;
		}
	}
};
Chart.prototype.getMinValue = function(calculatedMin, calculatedMax, baseZero, autoAxisSetup, minimumAxisValue, maximumAxisValue) {
	var min;
	if (!IsBoolean(autoAxisSetup) && !IsBoolean(baseZero)) //&&  this.m_minimumaxisvalue!="")
	{
		min = (minimumAxisValue !== "") ? minimumAxisValue : calculatedMin;
	} else if (IsBoolean(autoAxisSetup) && !IsBoolean(baseZero)) {
		min = ((calculatedMax == calculatedMin) && (calculatedMax > 0)) ? 0 : calculatedMin;
	} else {
		min = 0;
	}

	if (min >= 0) {
		min = getMin(min);
	} else {
		if (Math.abs(min) > 1) {
			min = -getMax(Math.abs(min))[0];
		} else if (calculatedMax > 1) {
			min = Math.floor(min);
		} else {
			min = min;
		}
	}
	return min;
};
Chart.prototype.getMaxValue = function(calculatedMin, calculatedMax, baseZero, autoAxisSetup, minimumAxisValue, maximumAxisValue, minimumVal) {
	var maxDivisor, max;
	if (!IsBoolean(autoAxisSetup)) {
		if (IsBoolean(baseZero)) {
			if (maximumAxisValue !== 0) {
				maxDivisor = getMax(maximumAxisValue * 1);
				max = maxDivisor[0];
			} else {
				if (calculatedMax * 1 > maximumAxisValue * 1) {
					maxDivisor = getMax(calculatedMax * 1);
					max = maxDivisor[0];
				} else {
					maxDivisor = getMax(maximumAxisValue * 1);
					max = maxDivisor[0];
				}
			}
		} else {
			if (minimumAxisValue !== "") {
				maxDivisor = getMax(maximumAxisValue - minimumVal);
				max = maxDivisor[0] * 1 + minimumVal * 1;
			} else {
				maxDivisor = getMax(calculatedMax - minimumVal);
				max = maxDivisor[0] * 1 + minimumVal * 1;
			}
		}
	} else {
		if (!IsBoolean(baseZero)) {
			if ((calculatedMax == calculatedMin) && (calculatedMax < 0)) {
				maxDivisor = getMax(0 - minimumVal);
				max = maxDivisor[0] * 1 + minimumVal * 1;
			} else {
				maxDivisor = getMax(calculatedMax - minimumVal);
				max = maxDivisor[0] * 1 + minimumVal * 1;
			}

		} else {
			maxDivisor = getMax(calculatedMax * 1);
			max = maxDivisor[0];
		}
	}
	var numberOfMarkers = maxDivisor[1] * 1 + 1 * 1;
	var yAxisText = maxDivisor[2];
	return {
		max: max,
		numberOfMarkers: numberOfMarkers,
		yAxisText: yAxisText
	};
};

/** @description calculate the numer of markers for y-axis **/
Chart.prototype.setYAxisMarkersArray = function(baseZero, axisSetup, min, max, numberOfMarkers, yAxisText) {
	var axisMarkersArray = [];
	if (!IsBoolean(baseZero)) {
		for (var i = 0; i < numberOfMarkers; i++) {
			var temp = (min * 1 + (yAxisText * i));
			axisMarkersArray[i] = IsBoolean(this.isInt(temp)) ? temp : temp.toFixed(3);
		}
	} else {
		for (var i = 0; i < numberOfMarkers; i++) {
			if (yAxisText < 1) {
				axisMarkersArray[i] = (yAxisText * i).toFixed(2);
			} else {
				axisMarkersArray[i] = (yAxisText * i);
			}
		}
	}
	return axisMarkersArray;
};

Chart.prototype.isInt = function(n) {
	return typeof n === "number" && n % 1 == 0;
};
/***************************** End code for calculate min/max and marker array *****************************************/

Chart.prototype.setShowSeries = function(seriesNames) {
	for (var i = 0; i < seriesNames.length; i++) {
		this.m_showSeries[seriesNames[i]] = true;
	}
};
Chart.prototype.getShowSeries = function() {
	return this.m_showSeries;
};

/** @description deprecated methods - called from check-list component **/
Chart.prototype.getSeriesVisibility = function() {
	return this.getDataSet().getSeriesVisibility();
};
Chart.prototype.updateSeriesVisibility = function() {
	var temp = this;
	for (var i = 0; i < this.m_seriesDisplayNames.length; i++) {
		this.m_seriesVisibleArr[this.m_seriesDisplayNames[i]] = ($("#checklist" + temp.m_seriesDisplayNames[i]).is(":checked"));
	}
};

/** @description method to call drawing of a chart when no data available **/
Chart.prototype.drawObject = function() {
	this.ctx.clearRect(this.m_x, this.m_y, this.m_width, this.m_height);
	this.m_chartFrame.init(this);
	this.m_chartFrame.drawFrame();
	this.m_title.init(this);
	this.m_title.draw();
	this.drawMessage(this.m_status.noDataset);
};
Chart.prototype.drawSVGObject = function() {
	this.createSVG();
	this.m_chartFrame.init(this);
	this.drawChartFrame();
	this.m_title.init(this);
	this.m_title.draw();
	this.drawSVGMessage(this.m_status.noDataset);
};
/** @description method to call drawing of chart **/
Chart.prototype.draw = function() {
	try {
		if (this.isValidRepeaterConfig()) {
			this.setRepeaterConfiguration();
		} else {
			/** BDD-490 Once repeater is enabled and then disabled, then it should remove all prrevious repeater instances **/
			this.deleteExistingRepeaterCharts();
			this.resetOriginalChartsContainer();
			this.hideToolTip();
			this.setChartState("");
			this.init();
			this.drawChart();
			if(this.m_onafterrendercallback!=""){
				onAfterRender(this.m_onafterrendercallback);
			}
		}
		if (this.plugin != undefined && this.plugin != null) {
			this.plugin.initPlugin(this);
		}
	} catch (e) {
		console.log("Error in drawing of component " + this.m_objectname + " !");
		console.log(e);
	}
};
/******************* Repeater calc start **************************/
/** @description Repeater Component Functionality **/
Chart.prototype.setRepeaterConfiguration = function() {
	try {
		var temp = this;
		var data = this.getRepeaterData(this.getDataProvider(), this.m_repeaterfield);
		var additionalField = this.getRepeaterAdditionalField(this.getDataProvider(), this.m_repeaterfield, this.m_repeateradditionalfield);
		this.deleteExistingRepeaterCharts();
		if(Object.keys(data).length !== 0 ) {
			/** Hide both canvas and svg of base chart before applying repeater **/
			$("#draggableCanvas" + this.m_objectid).hide();
			$("#svgContainer" + this.m_objectid).hide();
			/**Added for BDD-567 Treemap-Repeater chart is plotting over the existing chart when script applied from component level.*/
			if(temp.m_componenttype == "tree_map_chart"){
				$("#treemapDiv" + this.m_objectid).hide();
			}
			this.resetOriginalChartsContainerResiduals();
			var position = this.getRepeaterCoordinates(data);
			var chartType = this.getRepeaterChartType(this.m_type).chart;
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					/** creating charts,Number of chart equal to number of unique group field Data **/
					var json = {
						"Object": getDuplicateObject(JSON.parse(JSON.stringify(this.chartJson)))
					};
					var chart = createNewInstance(chartType, $("#draggableDiv" + this.m_objectid), this.m_zIndex);
					json.Object.objectId = position[key]["objectId"];
					json.Object.x = position[key]["x"];
					json.Object.y = position[key]["y"];
					json.Object.width = position[key]["width"] * 1;
					json.Object.height = position[key]["height"] * 1;
					json.Object[json.Object.subElement].isRepeater = false;
					json.Object[json.Object.subElement].Title.Description = this.getRepeaterTitleSubTitle(json.Object[json.Object.subElement].Title.Description, key, additionalField[key]);
					json.Object[json.Object.subElement].SubTitle.Description = this.getRepeaterTitleSubTitle(json.Object[json.Object.subElement].SubTitle.Description, key, additionalField[key]);
	
					// chart.m_bootstrap = true;
					chart.m_isRepeaterPart = "true";
					chart.m_repeaterfieldvalue = key;
					chart.m_siblingIds = position.siblingRepeaterIds;
					chart.m_designMode = this.m_designMode;
					chart.m_dashboard = this.m_dashboard;
					chart.m_parentContainer = this.m_chartContainer;
					chart.m_parentObj = this;
					chart.m_parentleft = this.m_left;
					chart.m_parenttop = this.m_top;
					chart.m_customtooltipwidth = this.m_customtooltipwidth;
					chart.m_datasource = this.m_datasource;
					/** TODO Hide the action-icon-dynamic-chart for repeaters **/
					chart.m_actionchartviews = (IsBoolean(this.m_isrepeater)) ? false : this.m_actionchartviews;
					
					/** when chart is hidden, offsets are 0, it should take these values from parent chart's coordinates **/
	//				chart.m_parentleft = $("#draggableDiv" + this.m_objectid)[0].offsetLeft;
	//				chart.m_parenttop = $("#draggableDiv" + this.m_objectid)[0].offsetTop;
					chart.setProperty(json);
					chart.setDataProvider(data[key]);
					chart.m_isDataSetavailable = true;
					chart.setFields(this.m_fieldsJson);
					/***Added to enable drill color in repeater*/
					chart.m_startDrill = this.m_startDrill;
					chart.m_drillColor = this.m_drillColor;
					/** Set the status of legend-checkbox-field to repeater charts **/
					chart.m_seriesVisibleArr = this.m_seriesVisibleArr;
					chart.m_chartactions["sort"]["enable"] = this.m_actionsort;
					chart.m_onafterrendercallback = this.m_onafterrendercallback;
					this.m_repeaterCharts.push(chart);
				}
			}
			this.drawRepeaterCharts();
			/** TODO BDD-695 Due to removing this zIndex, repeater-charts are hiding behind the box in mobiles **/
			/*
			if(dGlobals && dGlobals.layoutType == "AbsoluteLayout"){
				$("#draggableDiv" + this.m_objectid).css("z-index", "");
			}
			*/
		} else {
			$("#LegendContainerDiv" + temp.m_associatedlegendid).remove();
			this.resetOriginalChartsContainer();
			this.drawObject();
			this.resetOriginalChartsContainerResiduals();
			this.hideToolTip();
			/** unbind the events from base canvas to prevent showing tooltip and drill **/
			$("#draggableDiv" + this.m_objectid).unbind();
			$("#draggableCanvas" + this.m_objectid).unbind();
			$("#svgContainer" + this.m_objectid).unbind();
			$("#draggableDiv" + this.m_objectid).css({"overflow": "hidden", "overflow-x": "hidden", "overflow-y": "hidden"});
		}
	} catch (e) {
		console.log("Error in drawing of component " + this.m_objectname + " !");
	}
};
/** @description returns title and subtitle description updated by replacing repeaterfield value **/
Chart.prototype.getRepeaterTitleSubTitle = function(description, key, additionalkey) {
	try {
		if(description.toLowerCase() == "[repeaterfield]"){
			return SearchAndReplaceAllOccurence(description, "[repeaterField]", key);
		}
		if(description.toLowerCase() == "[repeateradditionalfield]"){
			return SearchAndReplaceAllOccurence(description, "[repeateradditionalfield]", additionalkey);
		} else {
			return SearchAndReplaceAllOccurence(description, "[repeaterField]", key);
		}
	} catch (e) {
		return key;
	}
};
Chart.prototype.resetOriginalChartsContainerResiduals = function() {
	/** removing parent div loaders,maxminicon, settingmenu when repeater is enabled, otherwise when max icon clicked, it will trigger base chart's events **/
	$("#loaderImage" + this.m_objectid).remove();
	$("#loaderImageContentArrow" + this.m_objectid).remove();
	$("#loaderImageContent" + this.m_objectid).remove();
	$("#minmaxImage" + this.m_objectid).remove();
	$("#menuSettingImage" + this.m_objectid).remove();
	$("#legendIcon" + this.m_objectid).remove();
	$("#legendContent" + this.m_objectid).remove();
	$("#svgTimeScaleDiv" + this.m_objectid).remove();
	$("#rangeSelector" + this.m_objectid).remove();
	$("#menuContent"+this.m_objectId).remove();
	$("#draggableDiv" + this.m_objectid).css({"overflow-x": "hidden", "overflow-y": "auto"});
	/*
	if(IsBoolean(this.isMaximized)){
		$("#draggableDiv" + this.m_objectid).css({"z-index": this.maximizeZindex});
	}else{
		$("#draggableDiv" + this.m_objectid).css({"z-index": this.m_zIndex});
	}
	*/
};
/** @description when filter is applied and chart get new data, previous repeaters has to be deleted **/
Chart.prototype.resetOriginalChartsContainer = function() {
	if (this.m_canvastype == "svg") {
		$("#draggableCanvas" + this.m_objectid).hide();
		$("#svgContainer" + this.m_objectid).show();
	} else {
		$("#draggableCanvas" + this.m_objectid).show();
	}
	$("#draggableDiv" + this.m_objectid).css({"overflow": "hidden", "overflow-x": "hidden", "overflow-y": "hidden"});
	/*
	if(IsBoolean(this.isMaximized)){
		$("#draggableDiv" + this.m_objectid).css({"z-index": this.maximizeZindex});
	}else{
		$("#draggableDiv" + this.m_objectid).css({"z-index": this.m_zIndex});
	}
	*/
};
/** @description when filter is applied and chart get new data, previous repeaters has to be deleted **/
Chart.prototype.deleteExistingRepeaterCharts = function() {
	try{
		if(this.m_repeaterCharts){
			for (var i = 0; i < this.m_repeaterCharts.length; i++) {
				$("#draggableDiv" + this.m_repeaterCharts[i].m_objectid).remove();
			}
			this.m_repeaterCharts = [];
		}
	}catch(e){
		console.log(e);
	}
};
Chart.prototype.drawRepeaterCharts = function() {
	for (var i = 0; i < this.m_repeaterCharts.length; i++) {
		var chart = this.m_repeaterCharts[i];

		try {
			chart.setChartState("");
			chart.init();
			chart.drawChart();
		} catch (e) {
			console.log(e);
		}
		
		/** enable renderCallBack on repeaters **/
		try{
			if(this.m_onafterrendercallback!=""){
				onAfterRender(this.m_onafterrendercallback.bind(chart));
			}
		}catch(e){
			console.log(e);
		}
		
		/** Enabling the context menus for repeater components **/
		try {
			chart.plugin.initPlugin(chart);
		} catch (e) {
			console.log(e);
		}
	}
};

/** @description Calculating each chart x,y,width,height and setting it in a Object and returing**/
Chart.prototype.getRepeaterCoordinates = function(data) {
	var position = {};
	var hGap = this.m_repeatervmargin * (this.m_repeatercolumns - 1);
	/** This padding of 7px is for scroller-width **/
	var padding = getScrollBarWidth();
	var width = Math.floor((this.m_width - hGap - padding) / this.m_repeatercolumns);
	/** Added this.minWHRatio() to support scaling for repeater charts */
	var height = this.m_repeaterheight * this.minWHRatio();
	var i = 0,
		j = 0,
		x = 0,
		y = 0,
		count = 0,
		idCount = 0;
	position.siblingRepeaterIds = [];
	for (var key in data) {
		if (i % this.m_repeatercolumns == 0 && count != 0) {
			i = 0;
			j++;
			//x = width * i + padding * 1;
			x = width * i;
			y = height * j + this.m_repeaterhmargin * j;

		} else {
			//x = width * i + padding * 1 + this.m_repeatervmargin * i;
			x = width * i + this.m_repeatervmargin * i;
			y = height * j + this.m_repeaterhmargin * j;
			count++;
		}
		var objectId = this.m_objectid + "_" + idCount++;
		position.siblingRepeaterIds.push(objectId);
		position[key] = {
			"x": x,
			"y": y,
			"width": width,
			"height": height,
			"objectId": objectId
		};
		i++;
	}
	return position;
};

/** @description grouping data according to given Repeater field **/
Chart.prototype.getRepeaterData = function(dataProvider, repeaterField) {
	var groupData = {};
	for (var i = 0; i < dataProvider.length; i++) {
		if (groupData[dataProvider[i][repeaterField]] == undefined) {
			groupData[dataProvider[i][repeaterField]] = [];
		}
		groupData[dataProvider[i][repeaterField]].push(dataProvider[i]);
	}
	return groupData;
};

/** @description created a additional field variable for displaying other repeater kind of data in title/sub-title PLAT-98**/
Chart.prototype.getRepeaterAdditionalField = function(dataProvider,repeaterField, repeaterAdditionalField) {
	var groupAdditionalField = {};
	for (var i = 0; i < dataProvider.length; i++) {
		if (groupAdditionalField[dataProvider[i][repeaterField]] == undefined){
			groupAdditionalField[dataProvider[i][repeaterField]] = dataProvider[i][repeaterAdditionalField];
		}
	}
	return groupAdditionalField;
};
/******************* Repeater calc end **************************/

/** @description getter setter methods of properties **/
Chart.prototype.getBgGradients = function() {
	return this.m_bggradients;
};

Chart.prototype.getType = function() {
	return this.m_type;
};
Chart.prototype.setType = function(m_type) {
	this.m_type = m_type;
};

Chart.prototype.getChartType = function() {
	return this.m_charttype;
};
Chart.prototype.setChartType = function(m_charttype) {
	this.m_charttype = m_charttype;
};

Chart.prototype.getShowGradient = function() {
	return this.m_showgradient;
};
Chart.prototype.setShowGradient = function(m_showgradient) {
	this.m_showgradient = m_showgradient;
};

Chart.prototype.getShowPoint = function() {
	return this.m_showpoint;
};
Chart.prototype.setShowPoint = function(m_showpoint) {
	this.m_showpoint = m_showpoint;
};

Chart.prototype.getShowLegends = function() {
	return this.m_showlegends;
};
Chart.prototype.setShowLegends = function(m_showlegends) {
	this.m_showlegends = m_showlegends;
};

Chart.prototype.getLegendDirection = function() {
	return this.m_legenddirection;
};
Chart.prototype.setLegendDirection = function(m_legenddirection) {
	this.m_legenddirection = m_legenddirection;
};

Chart.prototype.getShowcheckboxwithlegend = function() {
	return this.m_showcheckboxwithlegend;
};
Chart.prototype.setShowcheckboxwithlegend = function(m_showcheckboxwithlegend) {
	this.m_showcheckboxwithlegend = m_showcheckboxwithlegend;
};

Chart.prototype.getPrecision = function() {
	return this.m_precision;
};
Chart.prototype.setPrecision = function(m_precision) {
	this.m_precision = m_precision;
};
Chart.prototype.getSecondaryAxisPrecision = function() {
	return this.m_secondaryaxisprecision;
};
Chart.prototype.setSecondaryAxisPrecision = function(m_secondaryaxisprecision) {
	this.m_secondaryaxisprecision = m_secondaryaxisprecision;
};

Chart.prototype.getAxisColor = function() {
	return this.m_axiscolor;
};
Chart.prototype.setAxisColor = function(m_axiscolor) {
	this.m_axiscolor = m_axiscolor;
};

Chart.prototype.getSignPosition = function() {
	return this.m_signposition;
};
Chart.prototype.setSignPosition = function(m_signposition) {
	this.m_signposition = m_signposition;
};

Chart.prototype.getFixedLabel = function() {
	return this.m_fixedlabel;
};
Chart.prototype.setFixedLabel = function(m_fixedlabel) {
	this.m_fixedlabel = (m_fixedlabel === 1) ? true : false;
};

Chart.prototype.getSeriesColor = function() {
	return this.m_seriescolor;
};
Chart.prototype.setSeriesColor = function(m_seriescolor) {
	this.m_seriescolor = m_seriescolor;
};

Chart.prototype.getLineForm = function() {
	return this.m_lineform;
};
Chart.prototype.setLineForm = function(m_lineform) {
	this.m_lineform = m_lineform;
};

Chart.prototype.getFormater = function() {
	return this.m_formater;
};
Chart.prototype.setFormater = function(m_formater) {
	this.m_formater = m_formater;
};

Chart.prototype.getSecondaryFormater = function() {
	return this.m_secondaryformater;
};
Chart.prototype.setSecondaryFormater = function(m_secondaryformater) {
	this.m_secondaryformater = m_secondaryformater;
};

Chart.prototype.getUnit = function() {
	return this.m_unit;
};
Chart.prototype.setUnit = function(m_unit) {
	this.m_unit = m_unit;
};

Chart.prototype.getSecondaryUnit = function() {
	return this.m_secondaryunit;
};
Chart.prototype.setSecondaryUnit = function(m_secondaryunit) {
	this.m_secondaryunit = m_secondaryunit;
};

Chart.prototype.getGlobalKey = function() {
	return this.m_globalkey;
};
Chart.prototype.setGlobalkey = function(m_globalkey) {
	this.m_globalkey = m_globalkey;
};

Chart.prototype.getName = function() {
	return this.m_name;
};
Chart.prototype.setName = function(m_name) {
	this.m_name = m_name;
};

/** @description getter setter methods of objects **/
Chart.prototype.getTitle = function() {
	return this.m_title;
};
Chart.prototype.setTitle = function(titleObject) {
	this.m_title = titleObject;
};

Chart.prototype.getSubTitle = function() {
	return this.m_subTitle;
};
Chart.prototype.setSubTitle = function(titleObject) {
	this.m_subTitle = titleObject;
};


Chart.prototype.getLegend = function() {
	return this.m_heatMaplegend;
};
Chart.prototype.setLegend = function(legendObject) {
	this.m_heatMaplegend = legendObject;
};

Chart.prototype.getXAxes = function() {
	return this.m_xAxes;
};
Chart.prototype.setXAxes = function(xAxesObj) {
	this.m_xaxis = this.m_xAxes = xAxesObj;
};

Chart.prototype.getYAxes = function() {
	return this.m_yAxes;
};
Chart.prototype.setYAxes = function(yAxesObj) {
	this.m_yaxis = this.m_yAxes = yAxesObj;
};

Chart.prototype.getDataSet = function() {
	return this.m_dataSet;
};
Chart.prototype.setDataSet = function(dataSetObject) {
	this.m_dataSet = dataSetObject;
};

Chart.prototype.getConditionalColors = function() {
	return this.m_conditionalColors;
};
Chart.prototype.setConditionalColors = function(condtionalcolorObject) {
	this.m_conditionalColors = condtionalcolorObject;
};

Chart.prototype.getCategoryColors = function() {
	return this.m_categoryColors;
};
Chart.prototype.setCategoryColors = function(categoryColorsObject) {
	this.m_categoryColors = categoryColorsObject;
};

Chart.prototype.getSubCategoryColors = function() {
	return this.m_subCategoryColors;
};
Chart.prototype.setSubCategoryColors = function(subCategoryColorsObject) {
	this.m_subCategoryColors = subCategoryColorsObject;
};

Chart.prototype.getStartValueNames = function() {
	return this.getDataSet().getFieldByStartValue();
};
Chart.prototype.getEndValueNames = function() {
	return this.getDataSet().getFieldByEndValue();
};

Chart.prototype.getCategoryNames = function() {
	return this.getDataSet().getFieldbyCategory();
};

Chart.prototype.getSeriesNames = function() {
	return this.getDataSet().getFieldbySeries();
};

Chart.prototype.getNoneNames = function() {
	return this.getDataSet().getFieldByNoneValue();
};

Chart.prototype.createLegendObj = function(direction) {
	if (direction == "horizontal") {
		return this.m_legend = new LegendHorizontal();
	}
	if (direction == "vertical") {
		return this.m_legend = new LegendVertical();
	}
	return this.m_legend;
};

Chart.prototype.isAxisSetup = function() {
	if ((!IsBoolean(this.m_autoaxissetup))) // && !(this.m_maximumaxisvalue==0||this.m_maximumaxisvalue==""||this.m_maximumaxisvalue==null))
	{
		return false;
	} else {
		return true;
	};
};

Chart.prototype.isBaseZero = function() {
	if ((!IsBoolean(this.m_basezero))) {
		return false;
	} else {
		return true;
	};

};
/** @description check for data is empty or not **/
Chart.prototype.isSeriesDataEmpty = function() {
	this.m_isEmptySeries = false;
	/**DAS-981 @desc check empty series in new wordcloud chart */
	if(this.m_componenttype == "new_word_cloud_chart"){
	if(this.m_wordinputformat == "paragraph" && this.getCategoryData()[0].length == 0){
		this.m_isEmptySeries = true;
	}else if(this.m_wordinputformat == "word" && this.m_seriesData == "" || (this.m_seriesData.length != 0 && this.m_seriesData[0].length == 0)){
		this.m_isEmptySeries = true;
	}
	}
	if (this.m_componenttype != "new_word_cloud_chart" && this.m_seriesData == "" || (this.m_seriesData.length != 0 && this.m_seriesData[0].length == 0)) {
		this.m_isEmptySeries = true;
	}
};
/** @description returns the fields and values in a hash when drill happens on a data point **/
Chart.prototype.getFieldNameValueMap = function(i) {
	var m_fieldNameValueMap = new Object();
	var afn = this.getAllFieldsName();
	for (var l = 0; l < afn.length; l++) {
		m_fieldNameValueMap[afn[l]] = this.getDataProvider()[i][afn[l]];
	}
	return m_fieldNameValueMap;
};
/** @description draw a message on canvas when no data available in chart **/
Chart.prototype.drawMessage = function(text) {
	this.ctx.beginPath();
	this.ctx.fillStyle = convertColorToHex(this.m_statuscolor);
	this.ctx.font = this.m_statusfontsize + "px " + selectGlobalFont(this.m_statusfontfamily);
	this.ctx.textAlign = "left";
	var textWidth = this.ctx.measureText(text).width;
	var margin = this.m_width - textWidth;
	this.ctx.fillText(text, this.m_x * 1 + margin / 2, this.m_y * 1 + this.m_height / 2);
	this.ctx.fill();
	this.ctx.closePath();
};

/** @description draw a message on svg when no data available in chart **/
Chart.prototype.drawSVGMessage = function (text) {
	var x = this.m_x * 1 + this.m_width / 2;
	var y = this.m_y * 1 + this.m_height / 2;
	text = drawSVGText(x, y, text, this.m_statuscolor, "center", "middle", 0);
	text.setAttribute("style", "font-family:"+selectGlobalFont(this.m_statusfontfamily)+";font-style:none;font-size:"+this.m_statusfontsize+"px;font-weight:normal;text-decoration:none;");
	$("#" + this.svgContainerId).append(text);
};

Chart.prototype.toTitleCase = function(str) {
	try {
		return (("" + str).replace(/\w\S*/g, function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		}));
	} catch (e) {
		return ("" + str);
	}
};

Chart.prototype.underLine = function(text, x, y, color, textSize, align) {
	var textWidth = this.ctx.measureText(text).width;
	var startX = 0;
	var startY = y * 1 + (parseInt(textSize) / 15) + 1 * 1;
	var endX = 0;
	var endY = startY;
	if (align === "center") {
		startX = x - (textWidth / 2);
		endX = x + (textWidth / 2);
	} else if (align === "right") {
		startX = x - textWidth;
		endX = x;
	} else {
		startX = x;
		endX = x + (textWidth);
	}
	var underlineHeight = parseInt(textSize) / 15;
	underlineHeight = (underlineHeight < 1) ? 1 : underlineHeight;

	this.ctx.beginPath();
	this.ctx.strokeStyle = color;
	this.ctx.lineWidth = underlineHeight;
	this.ctx.moveTo(startX, startY);
	this.ctx.lineTo(endX, endY);
	this.ctx.stroke();
};
/**@description method is a utility type and available as global function in Widget.js */
Chart.prototype.getNumberWithCommas = function(number) {
	return getNumberWithCommas(number);
};

Chart.prototype.getRoundValue = function(orig, target) {
	var i = orig.length,
		j = 0,
		total = 0,
		change,
		newVals = [],
		next,
		factor1,
		factor2,
		len = orig.length,
		marginOfErrors = [];

	// map original values to new array
	while (i--) {
		total += newVals[i] = Math.round(orig[i]);
	}

	change = (total < target) ? 1 : -1;
	while (total !== target) {

		// select number that will be less affected by change determined
		// in terms of itself e.g. Incrementing 10 by 1 would mean
		// an error of 10% in relation to itself.
		for (i = 0; i < len; i++) {
			next = i === len - 1 ? 0 : i + 1;
			factor2 = errorFactor(orig[next], newVals[next] + change);
			factor1 = errorFactor(orig[i], newVals[i] + change);
			j = (factor1 > factor2) ? next : j;
		}

		newVals[j] += change;
		total += change;
	}

	for (i = 0; i < len; i++) {
		marginOfErrors[i] = newVals[i] && Math.abs(orig[i] - newVals[i]) / orig[i];
	}

	for (i = 0; i < len; i++) {
		for (j = 0; j < len; j++) {
			if (j === i)
				continue;

			var roundUpFactor = errorFactor(orig[i], newVals[i] + 1) + errorFactor(orig[j], newVals[j] - 1);
			var roundDownFactor = errorFactor(orig[i], newVals[i] - 1) + errorFactor(orig[j], newVals[j] + 1);
			var sumMargin = marginOfErrors[i] + marginOfErrors[j];

			if (roundUpFactor < sumMargin) {
				newVals[i] = newVals[i] + 1;
				newVals[j] = newVals[j] - 1;
				marginOfErrors[i] = newVals[i] && Math.abs(orig[i] - newVals[i]) / orig[i];
				marginOfErrors[j] = newVals[j] && Math.abs(orig[j] - newVals[j]) / orig[j];
			}
			if (roundDownFactor < sumMargin) {
				newVals[i] = newVals[i] - 1;
				newVals[j] = newVals[j] + 1;
				marginOfErrors[i] = newVals[i] && Math.abs(orig[i] - newVals[i]) / orig[i];
				marginOfErrors[j] = newVals[j] && Math.abs(orig[j] - newVals[j]) / orig[j];
			}
		}
	}

	function errorFactor(oldNum, newNum) {
		return Math.abs(oldNum - newNum) / oldNum;
	}
	
	return newVals;
};

Chart.prototype.getCloserRoundValue = function(orig, target) {
	var i = orig.length,
		j = 1,
		total = 0,
		change,
		newVals = [],
		factor1,
		factor2,
		len = orig.length,
		marginOfErrors = [];

	// map original values to new array
	while (i--) {
		total += newVals[i] = Math.round(orig[i]);
	}

	change = (total < target) ? 1 : -1;
	while (total !== target) {		
		for (i = 0; i < len; i++) {		
			factor2 = errorFactor(orig[j], newVals[j] + change);
			factor1 = errorFactor(orig[i], newVals[i] + change);
			j = (factor1 > factor2) ? j : i;
		}

		newVals[j] += change;
		total += change;
	}
	function errorFactor(oldNum, newNum) {
		return Math.abs(oldNum - newNum);
	}
	return newVals;
};


Chart.prototype.drawTooltip = function(mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && !this.m_designMode) {
		//this.m_annotationTooltip = this.m_customtextboxfortooltip.dataTipType//Hovering on annotation DAS-953
		var toolTipData = this.getToolTipData(mouseX, mouseY);
		if (this.m_hovercallback && this.m_hovercallback !== "") {
			this.drawCallBackContent(mouseX, mouseY, toolTipData);
		} else {
			this.drawTooltipContent(toolTipData);
			//this.m_customtextboxfortooltip.dataTipType = this.m_annotationTooltip;//Hovering on annotation DAS-953
			this.m_showannotationTooltip  = false;
		}
	}
};
/** @description method calls the callback if available when mouse over on data point **/
Chart.prototype.drawCallBackContent = function(mouseX, mouseY, toolTipData) {
	var component = this;
	this.hideToolTip();
	var data = {};
	data.toolTipData = toolTipData;
	data.component = component;
	var map = this.getDrillDataPoints(mouseX, mouseY);
	if (map) {
		data.value = map.drillRecord;
		data.color = map.drillColor;
	} else {
		data.value = "";
		data.color = "";
	}
	try {
		if (toolTipData && component.m_hovercallback) {
			eval(component.m_hovercallback + "(data)");
		} else {
			this.hideToolTip();
		}
	} catch (e) {
		console.log(e);
		this.hideToolTip();
	}
};
/** @description this methods draws the tooltip content in table - overrided in some sub classes **/
Chart.prototype.initializeToolTipProperty = function() {
    if (this.m_customtextboxfortooltip == "") {
        this.m_customtextboxfortooltip = {
            "dataTipTypeArray": "",
            "dataTipType": "Default",
            "datatipData": "",
            "formatter": {},
            "useComponentFormatter": true,
            "displayWindow": "textBox"
        }
        if (!IsBoolean(this.m_showtooltip)) {
            this.m_customtextboxfortooltip.dataTipType = "None";
        }
        /**Added to support old dashboard, direct Preview without going on to design mode*/
    } else if (this.m_customtextboxfortooltip.dataTipTypeArray == "") {
        if (!IsBoolean(this.m_showtooltip)) {
            this.m_customtextboxfortooltip.dataTipType = "None";
        } else {
            this.m_customtextboxfortooltip = {
                "dataTipTypeArray": "",
                "dataTipType": "Default",
                "datatipData": "",
                "formatter": {},
                "useComponentFormatter": true,
                "displayWindow": "textBox"
            }
        }
    }

    /** BDD-632 to support old dashboard directly open in portal **/
    if (this.m_customtextboxfortooltip.formatter == undefined) {
    	this.m_customtextboxfortooltip.formatter = {};
    }
    if (this.m_customtextboxfortooltip.useComponentFormatter == undefined) {
    	this.m_customtextboxfortooltip.useComponentFormatter = true;
    }
    if (this.m_customtextboxfortooltip.displayWindow == undefined) {
    	this.m_customtextboxfortooltip.displayWindow = "textBox";
    }
};
/** @description this methods draws the tooltip content in table - overrided in some sub classes **/
Chart.prototype.drawTooltipContent = function(toolTipData) {
	this.m_tooltip.draw(toolTipData, this.m_componenttype);
};
/** @description this methods will return the highlighted series field when controlled tooltip is true **/
Chart.prototype.updateTooltipData = function(toolTipData) {
	var tooltTipObj = $.extend(true,{},toolTipData);
	tooltTipObj.data = [];
	var count = tooltTipObj.highlightIndex;
	for(var i = 0, length = toolTipData.data.length; i < length; i++){
		if(toolTipData.data[i][2] !== ""){
			tooltTipObj.data.push(toolTipData.data[i]);
		} else {
			if(count > tooltTipObj.data.length){
				tooltTipObj.highlightIndex = --count;
			}
		}
	}
	return tooltTipObj;
};

Chart.prototype.getHTMLShape = function(shape) {
	return this.m_shapeMap.hasOwnProperty(shape) ? this.m_shapeMap[shape] : this.m_shapeMap["default"];
};

Chart.prototype.drawLegendShape = function(shape, color) {
	var colorSpan = document.createElement("span");
	$(colorSpan)[0].setAttribute("class", shape);
	$(colorSpan)[0].setAttribute("style", "color:" + color + "; " + "height:" + 10 + "px" + "; " + "width:" + 10 + "px; font-size:" + 10 + "px;");
	return $(colorSpan)[0].outerHTML;
};

/****************************** Legend drawing *****************************/
Chart.prototype.getLegendInfo = function() {
	/** overridden in subclasses **/
	return {};
};
Chart.prototype.drawLegends = function() {
	try {
		this.drawChartLegends();
		if (IsBoolean(this.m_legendFlag) || this.m_legendFlag == undefined) {
		    this.drawLegendComponent();
		    //this.m_legendFlag = true;
		} else {
			this.m_legendFlag = true;
		}		
	} catch (e) {
		console.log(e);
	}
};
Chart.prototype.drawChartLegends = function() {
	var temp = this;
	if (IsBoolean(this.getShowLegends())) {
		this.drawLegendIcon();
		if (!IsBoolean(this.m_designMode)) {
			this.drawLegendContentDiv();
		}
	} else {
		$("#legendIcon" + temp.m_objectid).remove();
	}
};
/** @description this methods checks the series data is available or not **/
Chart.prototype.isSeriesDataAvailable = function(legendObj) {
	if(IsBoolean(legendObj.associatedChartObject.m_isrepeater)){
		return true;
	}else{
		if (legendObj.associatedChartObject.m_seriesData.length > 0 && legendObj.associatedChartObject.m_seriesData[0].length > 0) {
			return true;
		} else {
			return false;
		}
	}
};
Chart.prototype.drawLegendComponent = function() {
	if (!IsBoolean(this.m_designMode)) {
		var legendObj = this.getLegendComponentObj();
		if (legendObj != undefined){
			if(IsBoolean(this.isSeriesDataAvailable(legendObj))) {
				/** Set the associated legend id before re-render so multiple components can be updated with same legend **/
				if (IsBoolean(this.m_isRepeaterPart) && this.m_parentObj) {
					legendObj.m_associatedchartid = this.m_parentObj.m_objectid;
					legendObj.m_associatedrepeaterchartid = this.m_objectid;
					/** Draw legend one time for first repeater, or every repeater when maximized **/
					if(this.m_objectid.split("_")[1] == 0) {
						legendObj.drawObject();
					}else{
						/** Do not draw legend for other repeater. **/
						/** Draw legend for other repeater when maximized or minimized **/
						if(this.getChartState() == "maximized" || this.getChartState() == "minimized"){
							legendObj.drawObject();
						}
					}
				}else{
					legendObj.m_associatedchartid = this.m_objectid;
					legendObj.drawObject();
				}
			} else {
				$("#LegendContainerDiv" + legendObj.m_objectid).remove();
			}
		}
	}
};
/** @description draw the icon on right side of component **/
Chart.prototype.drawLegendIcon = function() {
	var temp = this;
	var fontSize = this.fontScaling(16);
	var top = (IsBoolean(this.m_showmaximizebutton)) ? ((IsBoolean(this.m_updateddesign)) ? this.getTitleBarHeight() * 1 + 16 : this.getTitleBarHeight() * 1 + 5) : (this.m_y * 1 + (this.getTitleBarHeight() - this.m_legendfontsize) / 2 + this.m_legendfontsize / 2 - this.fontScaling(10));
	var imageMenu = this.drawFontIcons("legendIcon", "", this.m_width - 25, top, this.m_legendiconshape, fontSize);

	if (!temp.m_designMode) {
		imageMenu.onclick = function(event) {
			$("#legendIconTooltipDiv").remove();
			$("#legendContent" + temp.m_objectid).toggle("slide", {
				direction: "right"
			}, 200);
			var position = $("#legendContent" + temp.m_objectid).position();
			if (position) {
				if ($("#legendContent" + temp.m_objectid).css("display") != "none") {
					$("#legendContent" + temp.m_objectid).css({
						"top": position.top,
						"left": position.left
					});
				}
			}
		};
	}
	
	var zindex = 10000;
	var tooltip = "Legends";
	var fontfamily = selectGlobalFont(this.m_legendfontfamily);
	var fontsize = 12 + "px";
	top=top+25
	//DAS-564 Added to support legend when slider is enabled 
	if (this.m_showslider) {
		var right = (this.m_sliderheightratio*6)+ "px";
	} else {
		var right = "0px";
	}
	if (!IsBoolean(isTouchEnabled)) {
		$("#legendIcon" + temp.m_objectid).hover(function() {
			if (!temp.m_designMode) {
				var tooltipDiv = document.createElement("div");
				tooltipDiv.innerHTML = tooltip;
				tooltipDiv.setAttribute("class", "minMax");
				tooltipDiv.setAttribute("placement", "bottom");
				tooltipDiv.setAttribute("id", "legendIconTooltipDiv");
				/**getting right margin value (fetching from component in case of DTC)**/
				//var right = temp.getRightMargin();
				//DAS-564 to support legend when slider is enabled 
				//var right = "0px"; 
				$(tooltipDiv).css({
					"font-family": fontfamily,
					"font-size": fontsize,
					"top": top,
					"right": right,
					"z-index": zindex,
					"border": "1px solid #e0dfdf",
					"padding": "5px",
					"position": "absolute",
					"background-color": "#ffffff"
				});
				$("#draggableDiv" + temp.m_objectid).append(tooltipDiv);
			}
		}, function() {
			$("#legendIconTooltipDiv").remove();
		});
	}
};

/** @description draw the table in legend division **/
Chart.prototype.getLegendTableContent = function() {
	/** overridden in Boxplot, CandleStick, Pie **/
	var legendTable = "";
	for (var i = 0; i < this.getLegendNames().length; i++) {
		var shape = this.getLegendShape(i);
		var orgShape = this.getHTMLShape(shape);
		legendTable += "<tr style=\"font-style:" + this.m_legendfontstyle + ";color:" + convertColorToHex(this.m_legendfontcolor) + ";text-decoration:" + this.m_legendtextdecoration + ";font-weight:" + this.m_legendfontweight + ";font-family:" + selectGlobalFont(this.m_legendfontfamily) + "\">" +
			"<td>" + this.drawLegendShape(orgShape, this.getSeriesColors()[i]) + "<span style=\"display:inline-table;\">" + this.getLegendNames()[i] + "</span> </td></tr>";
	}
	return legendTable;
};
/** @description draw the table in legend division for category **/
Chart.prototype.getCategoryLegendTableContent = function() {
	/** overridden in Boxplot, CandleStick, Pie **/
	var legendTable = "";
	var data = [];
	var dataProviderData = this.getDataProvider();
	var arrayLength = this.getDataProvider().length;
	for (var i = 0; i < arrayLength; i++) {
		for(j=0;j< this.getCategoryNames().length;j++){
			var fieldName = this.getCategoryNames()[j];
			var value = dataProviderData[i][fieldName];
			if (value !== undefined && value !== null && value !== "" && !data.includes(value)) {
			      data.push(value);
			 }		
		}
	}
	/**get category colors from category alert */
	var categoryColor=	this.m_categoryColors.m_categoryColor || [];
	/**DAS-1266 */
	var catDefaultColor = this.m_categoryFieldColor[0] || "#F89406";
	for (var i = 0; i < data.length; i++) {
		var matchIndex  = categoryColor.findIndex(function(item) {
		    return item.m_categoryname === data[i];
		});
		var color = (categoryColor[matchIndex] != undefined  && matchIndex != -1  )?categoryColor[matchIndex].m_color:catDefaultColor;
		var shape = "cube";
		var orgShape = this.getHTMLShape(shape);
		legendTable += "<tr style=\"font-style:" + this.m_legendfontstyle + ";color:" + convertColorToHex(this.m_legendfontcolor) + ";text-decoration:" + this.m_legendtextdecoration + ";font-weight:" + this.m_legendfontweight + ";font-family:" + selectGlobalFont(this.m_legendfontfamily) + "\">" +
			"<td>" + this.drawLegendShape(orgShape, color) + "<span style=\"display:inline-table;\">" + data[i] + "</span> </td></tr>";
	}
	return legendTable;
};
/** @description draw the table in legend division for subcategory **/
Chart.prototype.getSubCategoryLegendTableContent = function() {
	/** overridden in Boxplot, CandleStick, Pie **/
	var legendTable = "";
	var data = [];
	var dataProviderData = this.getDataProvider();
	var arrayLength = this.getDataProvider().length;
	for (var i = 0; i < arrayLength; i++) {
		for(j=0;j< this.getSubCategoryNames().length;j++){
			var fieldName = this.getSubCategoryNames()[j];
			var value = dataProviderData[i][fieldName];
			if (value !== undefined && value !== null && value !== "" && !data.includes(value)) {
			      data.push(value);
			 }		
		}
	}
	/**get subcategory colors from subcategory alert */
	var subcategoryColor = this.m_subCategoryColors.m_subcategoryColor || []; 
	/**DAS-1266 */
	var subCatDefaultColor = this.m_subCategoryFieldColor[0] || "#F89406";
	for (var i = 0; i < data.length; i++) {
		var matchIndex  = subcategoryColor.findIndex(function(item) {
		    return item.m_subcategoryname === data[i];
		});
		var color = (subcategoryColor[matchIndex] != undefined  && matchIndex != -1 )?subcategoryColor[matchIndex].m_color:subCatDefaultColor;
		var shape = "cube";
		var orgShape = this.getHTMLShape(shape);
		legendTable += "<tr style=\"font-style:" + this.m_legendfontstyle + ";color:" + convertColorToHex(this.m_legendfontcolor) + ";text-decoration:" + this.m_legendtextdecoration + ";font-weight:" + this.m_legendfontweight + ";font-family:" + selectGlobalFont(this.m_legendfontfamily) + "\">" +
			"<td>" + this.drawLegendShape(orgShape, color) + "<span style=\"display:inline-table;\">" + data[i] + "</span> </td></tr>";
	}
	return legendTable;
};

/** @description method will return shape for drawing legend**/
Chart.prototype.getLegendShape = function(i) {
	var shape = this.legendMap[this.getSeriesNames()[i]].shape;
	return shape;
};
Chart.prototype.getLegendContentDiv = function() {
	var temp = this;
	var top = (IsBoolean(this.m_showmaximizebutton)) ? ((IsBoolean(this.m_updateddesign)) ? this.getTitleBarHeight() * 1 + 16 : this.getTitleBarHeight() * 1 + 5) : (this.m_y * 1 + (this.getTitleBarHeight() - this.m_legendfontsize) + this.m_legendfontsize / 2 - this.fontScaling(10));
	$("#legendContent" + temp.m_objectid).remove();
	var div = document.createElement("div");
	div.setAttribute("id", "legendContent" + temp.m_objectid);
	div.style.position = "absolute";
	div.style.zIndex = this.m_zIndex;
	div.style.visible = "hidden";
	div.style.width = "100px";
	div.style.top = top * 1 + "px";
	this.m_draggableDiv.appendChild(div);
	return div;
};
/**@description draws the content of legend table of the chart **/
Chart.prototype.drawLegendContentDiv = function() {
	/** overridden in Bubble, Heatmap **/
	var temp = this;
	var div = this.getLegendContentDiv();
	/**DAS-1254 @desc get legend content based on category/subactegory/seris type @m_legendShowType */
	/** category/subategory conditional colors will be used in case of category and subcategory legends option */
	var legendContent = "";
	
	if(this.m_legendShowType == "category")
	legendContent = this.getCategoryLegendTableContent();
	else
	if(this.m_legendShowType == "subcategory")
	legendContent = this.getSubCategoryLegendTableContent();
	else
	legendContent = this.getLegendTableContent();
	
	var legendTable = "<table class=\"legend\">" + legendContent + "</table>";
	$(div).append(legendTable);
	
	/**Set component legend container background css property object*/
	var legendBGColor = convertColorToHex(temp.m_legendbackgroundcolor);
	$(div).find(".legend").css("background-color", hex2rgb(legendBGColor, temp.m_legendbackgroundtransparency));
	$(div).find("td").each(function() {
		$(this).css({
			"background-color": hex2rgb(legendBGColor, temp.m_legendbackgroundtransparency),
			"font-size" : temp.m_legendfontsize + "px"
		})
	});
	
	var legendsDivheight = $("#legendContent" + temp.m_objectid).height();
	if (legendsDivheight * 1 > (this.m_height * 1 - 35)) {
		$("#legendContent" + temp.m_objectid).css({
			"height": (this.m_height * 1 - 35) + "px",
			"overflow-x": "hidden"
		});
	}

	/*
	var container = $("#draggableDiv" + this.m_objectid);
	$(div).draggable({
		containment : container,
		revert : function (event, ui) {
			$(this).data("uiDraggable").originalPosition = {
				top : 32,
				left : (temp.m_width - divwidth - 19)

			};
		}
	});
	*/
	var tbl = div.getElementsByTagName("table");
	var divwidth = tbl[0].offsetWidth;
	if (divwidth == 0) {
		divwidth = 119;
	} else {
		if (legendsDivheight * 1 > (this.m_height * 1 - 35)) {
			divwidth = divwidth + 20;
		} else {
			divwidth = (divwidth > this.getLegendTableWidth()) ? (divwidth * 1 + 10) : (this.getLegendTableWidth() * 1);
		}
	}
	div.style.width = divwidth + "px";
	//DAS-564 Added to support legend when slider is enabled 
	if (this.m_showslider) {
		div.style.left = (this.m_width - divwidth - 25 -(this.m_sliderheightratio*7))+ "px";
	} else {
		div.style.left = (this.m_width - divwidth - 35) + "px";
	}
	if (IsBoolean(this.m_hidelegendonstart)) {
		$(div).toggle();
	}
};

Chart.prototype.getLegendTableWidth = function() {
	var width;
	var a = [];
	for (var i = 0; i < this.getLegendNames().length; i++) {
		var legendStr = ("" + this.getLegendNames()[i]).split(" ")[0];
		a[i] = this.ctx.measureText(legendStr).width * 1 + 30;
	}
	width = Math.max.apply(null, a);
	return width;
};

/** @description method used in calculation for visible drawing area **/

Chart.prototype.getMarginForTitle = function() {
	return (IsBoolean(this.getShowGradient()) || IsBoolean(this.m_showmaximizebutton) || IsBoolean(this.m_showsettingmenubutton) || IsBoolean(this.getTitle().m_showtitle)) ? this.getTitleBarHeight() * 1 + this.getTitleToSubtitleMargin() : this.getTitleToSubtitleMargin();
};
Chart.prototype.getMarginForSubTitle = function() {
	if (IsBoolean(this.m_subTitle.m_showsubtitle)) {
		return (this.m_subTitle.getDescription() !== "") ? (this.m_subTitle.getFontSize() * 1.5) + this.getSubttitleToChartMargin() * 1: 10 + this.getSubttitleToChartMargin() * 1;
	} else {
		return 0;
	}
};

Chart.prototype.getXAxisDescriptionMargin = function() {
	var xAxisDescription = IsBoolean(this.m_xAxis.m_showdatasetdescription) ? this.m_allCategoryDisplayNames.join("") : this.m_xAxis.getDescription();
	return (xAxisDescription !== "") ? this.m_xAxis.getFontSize() * 1.5 : 5;
};
Chart.prototype.getYAxisDescriptionMargin = function() {
	var yAxisDescription = IsBoolean(this.m_yAxis.m_showdatasetdescription) ? this.m_allSeriesDisplayNames.reduce(function(acc, item) { return item !== "" ? (acc === "" ? item : acc + ", " + item) : acc; }, "") : this.m_yAxis.m_description;
	return (yAxisDescription !== "") ? ((this.m_yAxis.m_textdecoration == "underline") ? this.fontScaling(this.m_yAxis.getFontSize()) * 1.5 + 1 * 1 : this.fontScaling(this.m_yAxis.getFontSize()) * 1.5) : 0;
};
Chart.prototype.getSecondYAxisDescriptionMargin = function () {
	var descTextSpace = 0;
	var safm = 0;
	if(this.m_secondaxisdiscription !== "" && this.rightAxisInfo.markerarray.length > 0){
		/** Added to calculate margin ratio of multilines description text */
		var separatorSign = (IsBoolean(this.m_enablehtmlformate.secondaryaxis)) ? "<br>" : "\\n";
		descTextSpace = this.fontScaling(this.m_secondaxisfontsize) * ((this.m_secondaxisdiscription.split(separatorSign).length > 3) ? 2 : this.m_secondaxisdiscription.split(separatorSign).length - 1);
		safm = this.fontScaling(this.m_secondaxisfontsize) * 1.5;
		if(this.m_secondaxistextdecoration == "underline"){
			safm = safm * 1 + 1 * 1;
		}
	}
	return safm*1 + descTextSpace*1;
};

/** @description margin for Legend icon **/
Chart.prototype.getVerticalLegendMargin = function() {
	return IsBoolean(this.getShowLegends()) ? 20 : (this.m_chartpaddings.rightLegendSpace*1 || 10);
};

/** Gap between Title to Subtitle OR Title to Chart **/
Chart.prototype.getTitleToSubtitleMargin = function() {
//	return 15;
	this.m_chartpaddings["topTitleToSubtitle"] = (IsBoolean(this.m_updateddesign) ? 27 :this.m_chartpaddings["topTitleToSubtitle"]);
	return this.m_chartpaddings["topTitleToSubtitle"];
};
/** Gap between Subtitle to Chart **/
Chart.prototype.getSubttitleToChartMargin = function() {
//	return 0;
	this.m_chartpaddings["topSubtitleToChart"] = (IsBoolean(this.m_updateddesign) ? 26 :this.m_chartpaddings["topSubtitleToChart"]);
	return this.m_chartpaddings["topSubtitleToChart"];
};
/** Gap between Bottom border to X-Axis description **/
Chart.prototype.getChartMargin = function() {
//	return 15;
	this.m_chartpaddings["bottomBorderToDescription"] = (IsBoolean(this.m_updateddesign) ? 40 :this.m_chartpaddings["bottomBorderToDescription"]);
	return this.m_chartpaddings["bottomBorderToDescription"];
};
/** Gap between Bottom border to Horizontal Legend **/
Chart.prototype.getHorizontalLegendMargin = function () {
//	return 5;
	return this.m_chartpaddings["bottomDescriptionToMarkers"];
};
/** 1. Gap bewteen Chart Border and Legend icon **/
Chart.prototype.getBorderToLegendMargin = function() {
//	return 5;
	return this.m_chartpaddings["rightBorderToLegend"];
};
/** 2. Gap bewteen Legend icon and x-axis end **/
Chart.prototype.getVerticalLegendToXAxisMargin = function() {
//	return 5;
	return this.m_chartpaddings["rightLegendToLine"];
};
/** 11. Gap between Legend icon and Second-Axis description **/
Chart.prototype.getLegendToDescriptionMargin = function () {
//	return 5;
	return this.m_chartpaddings["rightLegendToDescription"];
};
/** 12. Gap between Second-Axis description to markers OR legend to X-Axis end **/
Chart.prototype.getSecondAxisToXAxisMargin = function () {
//	return 5;
	return this.m_chartpaddings["rightDescriptionToMarkers"];
};
/** 13. Gap between Second-Axis markers to X-Axis end **/
Chart.prototype.getSecondAxisLabelToAxisMargin = function() {
//	return 0;
	return this.m_chartpaddings["rightMarkersToLine"];
};
/** 1. Gap bewteen Chart Border and Y-Axis description **/
Chart.prototype.getBorderToDescriptionMargin = function() {
//	return 2;
	this.m_chartpaddings["leftBorderToDescription"] = (IsBoolean(this.m_updateddesign) ? 21 :this.m_chartpaddings["leftBorderToDescription"]);
	return this.m_chartpaddings["leftBorderToDescription"];	
};
/** 2. Gap bewteen Y-Axis description and Y-Axis markers **/
Chart.prototype.getDescriptionToLabelMargin = function() {
//	return 5;
	return this.m_chartpaddings["leftDescriptionToMarkers"];
};
/** 3. Gap bewteen Y-Axis markers and Y-Axis line **/
Chart.prototype.getLabelToAxisMargin = function() {
//	return 5;
	this.m_chartpaddings["leftMarkersToLine"] = (IsBoolean(this.m_updateddesign) ? 10 :this.m_chartpaddings["leftMarkersToLine"]);
	return this.m_chartpaddings["leftMarkersToLine"];
};
/**  Gap bewteen Border and Component **/
Chart.prototype.getChartToBorderMargin = function() {
//	return 15;
	return this.m_chartpaddings["chartToBorder"];
};
/** @description method checks if tooltip has any data formatting, and returns formatted value **/
Chart.prototype.getUpdatedFormatterForToolTip = function(data, seriesName) {
    var valueToBeFormatted;
    if (isNaN(getNumericComparableValue(data)) || data == "" || data == undefined){
    	valueToBeFormatted = data;
    } else {
    	if(seriesName === undefined){
    		valueToBeFormatted = this.getFormatterForToolTip(data);
    	}else{
    		if((this.m_customtextboxfortooltip.useComponentFormatter === undefined)){
    			valueToBeFormatted = this.getFormatterForToolTip(data);
    		}else{
    			if(IsBoolean(this.m_customtextboxfortooltip.useComponentFormatter)){
    				valueToBeFormatted = this.getFormatterForToolTip(data);
    			}else {
    				if((this.m_customtextboxfortooltip.formatter != undefined) && (this.m_customtextboxfortooltip.formatter[seriesName] !== undefined)) {
	    				valueToBeFormatted = this.getFieldFormatterForToolTip(data, seriesName);
	           	 	}else{
	    				valueToBeFormatted = this.getFormatterForToolTip(data);           	 		
	           	 	}
    			}
       	 	}
       	 }
    }
    return valueToBeFormatted;
};

/** @description method checks if tooltip has any data formatting, and returns formatted value **/
Chart.prototype.getFormatterForToolTip = function(value) {
    if (!isNaN(getNumericComparableValue(value))) {
        // added check for value is number or not otherwise return same string value
        var isCommaSeparated = (("" + value).indexOf(",") > 0) ? true : false;
        var signPosition = (this.m_signposition != "") ? this.m_signposition : "suffix";
		/*
		var m_precision;
		if (this.m_tooltipprecision !== "default") {
		    m_precision = this.m_tooltipprecision;
		} else {
		    m_precision = (value + "").split(".");
		    if (m_precision[1] !== undefined) {
		        m_precision = m_precision[1].length;
		    } else {
		        m_precision = 0;
		    }
		}*/
        var precision = this.m_tooltipprecision;
        var unit = this.m_unit;
        var secondUnit = this.m_secondaryunit;
        var formatter = "Currency";
        var secondFormatter = "Number";
        var valueToBeFormatted = (precision === "default") ? (getNumericComparableValue(value) * 1) : (getNumericComparableValue(value) * 1).toFixed(precision);
        if (unit != "") {
            var formatterSymbol = this.m_yAxis.m_util.getFormatterSymbol(formatter, unit);
            var secondFormatterSymbol = this.m_yAxis.m_util.getFormatterSymbol(secondFormatter, secondUnit);
            /* To Add Number formatter */
            if (secondFormatterSymbol == "auto") {
                value = getNumericComparableValue(value);
                var symbol = getNumberFormattedSymbol(value * 1, unit);
                var val = getNumberFormattedNumericValue(value * 1, precision, unit);
                var text = this.m_yAxis.m_util.updateTextWithFormatter(val, "", precision);
                valueToBeFormatted = this.m_yAxis.m_util.addFormatter(text, symbol, "suffix");
            } else {
                var unitSymbol = secondFormatterSymbol;
                valueToBeFormatted = this.m_yAxis.m_util.updateTextWithFormatter(valueToBeFormatted, unitSymbol, precision);
                if (secondFormatterSymbol != "none" && secondFormatterSymbol != "" && secondFormatterSymbol != "") {
                    valueToBeFormatted = this.m_yAxis.m_util.addFormatter(valueToBeFormatted, secondFormatterSymbol, "suffix");
                }
            }
            /* To add Currency formatter */
            valueToBeFormatted = (valueToBeFormatted == "NaN" || valueToBeFormatted === "") ? "" : this.m_yAxis.m_util.addFormatter(getFormattedNumberWithCommas(valueToBeFormatted, this.m_numberformatter) , formatterSymbol, signPosition);
            return valueToBeFormatted;
        } else {
            return (valueToBeFormatted == "NaN") ? value : valueToBeFormatted;
        }
    } else {
    	return value;
    	/** when this formatter is added, Jan is returning as EuroJan, or noneJan **/
//        return this.m_yAxis.m_util.addFormatter(value, this.datalabelProperties.datalabelFormaterCurrency, this.datalabelProperties.datalabelFormaterPosition);
    }
}

/** @description method checks if tooltip has any data formatting, andreturns formatted value **/
Chart.prototype.getFieldFormatterForToolTip = function(data, seriesName) {
    var signPosition = (this.m_customtextboxfortooltip.formatter[seriesName].SignPosition.value != "") ? this.m_customtextboxfortooltip.formatter[seriesName].SignPosition.value : "suffix";
    var precision = this.m_customtextboxfortooltip.formatter[seriesName].Precision.value;
    var unit = this.m_customtextboxfortooltip.formatter[seriesName].Unit.value;
    var secondUnit = this.m_customtextboxfortooltip.formatter[seriesName].SecondaryUnit.value;
    var numberFormatter = this.m_customtextboxfortooltip.formatter[seriesName].NumberFormatter.value;
    var formatter = "Currency";
    var secondFormatter = "Number";
    var valueToBeFormatted;
    var formatterSymbol = this.m_util.getFormatterSymbol(formatter, unit);
    var secondFormatterSymbol = this.m_util.getFormatterSymbol(secondFormatter, secondUnit);
    /* To Add Number formatter */
    if (secondFormatterSymbol == "auto") {
        data = getNumericComparableValue(data);
        var symbol = getNumberFormattedSymbol(data * 1, unit);
        var val = getNumberFormattedNumericValue(data * 1, precision, unit);
        var text = this.m_util.updateTextWithFormatter(val, "", precision);
        valueToBeFormatted = this.m_util.addFormatter(text * 1, symbol, "suffix");
    } else {
        var unitSymbol = secondFormatterSymbol;
        valueToBeFormatted = this.m_util.updateTextWithFormatter(data * 1, unitSymbol, precision);
        if (secondFormatterSymbol != "none" && secondFormatterSymbol != "" && secondFormatterSymbol != "") {
            valueToBeFormatted = this.m_util.addFormatter(valueToBeFormatted * 1, secondFormatterSymbol, "suffix");
        } else {
            valueToBeFormatted = valueToBeFormatted * 1;
        }
    }
    /* To add Currency formatter */
    valueToBeFormatted = (valueToBeFormatted == "NaN" || valueToBeFormatted === "") ? "" : this.m_util.addFormatter(getFormattedNumberWithCommas(valueToBeFormatted, numberFormatter), formatterSymbol, signPosition);
    return valueToBeFormatted;
}

/** @description method checks if tooltip has any data formatting, andreturns formatted value only for mixed and timeline chart **/
Chart.prototype.getUpdatedLeftRightAxisFormatterForToolTip = function(map) {
    var data = map.serVal;
    var axisType = map.axisType;
    var valueToBeFormatted;
    if (isNaN(data) || data == "" || data == undefined) {
        return data;
    } else {
    	var useDefaultFormatter = ((this.m_customtextboxfortooltip.useComponentFormatter === undefined) ? true : this.m_customtextboxfortooltip.useComponentFormatter);
    	if(map.seriesName === undefined || this.m_customtextboxfortooltip.useComponentFormatter === undefined){
    		valueToBeFormatted = this.getLeftRightAxisFormatterForToolTip(data * 1, axisType);
    	}else{
    		if(IsBoolean(useDefaultFormatter) && (this.m_customtextboxfortooltip.formatter != undefined) && (this.m_customtextboxfortooltip.dataTipType == "Default")) {
    			valueToBeFormatted = this.getLeftRightAxisFormatterForToolTip(data * 1, axisType);
    		}else if(this.m_customtextboxfortooltip.dataTipType == "Custom"){    
    			valueToBeFormatted = this.getFieldFormatterForToolTip(data * 1, map.seriesName);
    		} else {
    			valueToBeFormatted = this.getFieldFormatterForToolTip(data * 1, map.seriesName);
    		}
    	}
    }
    return valueToBeFormatted;
};

/** @description method checks if tool tip has any data formatting, and returns formatted value only for mixed and timeline chart **/
Chart.prototype.getLeftRightAxisFormatterForToolTip = function(data, axisType) {
    var m_precision;
    if (this.m_tooltipprecision !== "default") {
        m_precision = (this.m_tooltipprecision == 0 && data % 1 != 0) ? 2 : this.m_tooltipprecision;
    } else {
        m_precision = (data + "").split(".");
        if (m_precision[1] !== undefined) {
            m_precision = m_precision[1].length;
        } else {
            m_precision = 0;
        }
    }
    var unit = (axisType == "left") ? (this.m_numberformatter) : (this.m_secondaryaxisnumberformatter);
    data = this.getLocaleWithPrecision(data, m_precision, unit);
    var symbol = (axisType == "left") ? (this.m_yAxis.m_secondaryUnitSymbol) : (this.m_yAxis.m_secondAxisSecondaryUnitSymbol);
    if (IsBoolean(this.m_yAxis.m_isSecondaryFormatter) && this.checkCurrencyForToolTip(symbol)) {
        data = this.m_yAxis.getSecondaryFormaterAddedText(data, symbol);
    }else if (IsBoolean(this.m_yAxis.m_rightaxisformater) && this.checkCurrencyForToolTip(symbol)) {
        if (IsBoolean((this.m_yAxis.m_isFormatter) || (this.m_yAxis.m_rightaxisformater)) && this.m_yAxis.m_unitSymbol != undefined) {		
        	data = this.m_yAxis.getSecondaryFormaterAddedText(data, symbol);}}
        if (IsBoolean((this.m_yAxis.m_isFormatter) || (this.m_yAxis.m_rightaxisformater)) && this.m_yAxis.m_unitSymbol != undefined) {
        var unitSymbol = (axisType == "left") ? (this.m_yAxis.m_unitSymbol) : (this.m_yAxis.m_secondAxisUnitSymbol);
        var position = (axisType == "left") ? (this.m_yAxis.m_formatterPosition) : (this.m_yAxis.m_secondAxisFormatterPosition);
        data = this.m_yAxis.m_util.addFormatter(data, unitSymbol, position, this.m_precision);
    }
    return data;
};

/**@description added this method to get the line type for continuous line BDD-837**/
Chart.prototype.getLineType = function(linetype){
	 		return this.m_continuouslinetype[linetype];
	};

/** @description method checks if data has any  formatting and returns formatted value only for mixed and timeline chart **/
Chart.prototype.getLeftRightAxisFormatterForShowData = function(data, i) {
	var axisType = this.m_seriesAxis[i];
	if (isNaN(getNumericComparableValue(data)) || data == "" || data == undefined) {
		return data;
	} else {
		data = getNumericComparableValue(data);
		var m_precision;
		if (this.m_tooltipprecision !== "default") {
			m_precision = (this.m_tooltipprecision == 0 && data % 1 != 0) ? 2 : this.m_tooltipprecision;
		} else {
			m_precision = (data + "").split(".");
			if (m_precision[1] !== undefined) {
				m_precision = m_precision[1].length;
			} else {
				m_precision = 0;
			}
		}
		data = this.getLocaleWithPrecision(data, m_precision);
		var symbol = (axisType == "left") ? (this.m_yAxis.m_secondaryUnitSymbol) : (this.m_yAxis.m_secondAxisSecondaryUnitSymbol);
		if (IsBoolean(this.m_yAxis.m_isSecondaryFormatter) && this.checkCurrencyForToolTip(symbol)) {
			data = this.m_yAxis.getSecondaryFormaterAddedText(data, symbol);
		}
		if (IsBoolean((this.m_yAxis.m_isFormatter)|| (this.m_yAxis.m_rightaxisformater)) && this.m_yAxis.m_unitSymbol != undefined) {
			var unitSymbol = (axisType == "left") ? (this.m_yAxis.m_unitSymbol) : (this.m_yAxis.m_secondAxisUnitSymbol);
			var position = (axisType == "left") ? (this.m_yAxis.m_formatterPosition) : (this.m_yAxis.m_secondAxisFormatterPosition);
			data = this.m_yAxis.m_util.addFormatter(data, unitSymbol, position, this.m_precision);
		}
		return data;
	}
};

/** @description returns true only when formatter is "%" */
Chart.prototype.checkCurrencyForToolTip = function(format) {
	if(this.m_componenttype == "mixed_chart") { 
		return (format == "%" && this.m_charttype !== "100%") ? true : false;
	} else if(this.m_componenttype == "timeline_chart"){
		return (format == "%" && this.m_columntype !== "100%") ? true : false;
	} else {
		return (format == "%") ? true : false;
	}
};
/** @description returns the data converted to locale string and added precision 
 * @param {Number} data
 * @param {Number} precision
 * @returns {String} locale converted number with precision
 * **/
Chart.prototype.getLocaleWithPrecision = function(data, precision, unit) {
	var language = (unit === "indiannumber") ? "en-IN" : (navigator.userLanguage || navigator.language);
	try {
		return (data * 1).toLocaleString(language, {
			minimumFractionDigits: precision,
			maximumFractionDigits: precision
		});
	} catch (e) {
		return ((data * 1).toFixed(precision)).toLocaleString();
	}
};
/** @description common method to calculate visible drawing area after removing axis title margins etc **/
Chart.prototype.setChartDrawingArea = function() {
	this.setStartX();
	this.setEndX();
	this.setStartY();
	this.setEndY();
};
Chart.prototype.getStartX = function() {
	return this.m_startX;
};
Chart.prototype.getStartY = function() {
	return this.m_startY;
};
Chart.prototype.getEndX = function() {
	return this.m_endX;
};
Chart.prototype.getEndY = function() {
	return this.m_endY;
};

/** @description methods for timeline component **/
Chart.prototype.getFormattedDate = function(dateString) {
	dateString = "" + dateString;
	var str;
	var dateTypes = {
		"mm/yy": function() {
			var arr = dateString.split("/");
			str = arr[0] + "/" + "01" + "/" + getFullYear(arr[1]);
		},
		"dd/mm/yy": function() {
			var arr = dateString.split("/");
			str = arr[1] + "/" + arr[0] + "/" + getFullYear(arr[2]);
		},
		"mm/dd/yy": function() {
			var arr = dateString.split("/");
			str = arr[0] + "/" + arr[1] + "/" + getFullYear(arr[2]);
		},
		"dd/mm/yyyy": function() {
			var arr = dateString.split("/");
			str = arr[1] + "/" + arr[0] + "/" + arr[2];
		},
		"mm/dd/yyyy": function() {
			var arr = dateString.indexOf("-") > 0 ? dateString.split("-") : dateString.split("/");
			str = arr[0] + "/" + arr[1] + "/" + arr[2];
		},
		"yyyy/mm/dd": function() {
			var arr = dateString.split("/");
			str = arr[1] + "/" + arr[2] + "/" + arr[0];
		},
		"dd/mm/yyyy hh:mm:ss": function() {
			var arr1 = dateString.split(" ");
			var arr = arr1[0].split("/");
			str = arr[1] + "/" + arr[0] + "/" + arr[2] + " " + arr1[1];
		},
		"dd/mm/yyyy hh:mm:ss pm": function() {
			var arr1 = dateString.split(" ");
			var arr = arr1[0].split("/");
			str = arr[1] + "/" + arr[0] + "/" + arr[2] + " " + arr1[1];
		},
		"mm/dd/yyyy hh:mm:ss": function() {
			var arr1 = dateString.split(" ");
			var arr = arr1[0].split("/");
			str = arr[0] + "/" + arr[1] + "/" + arr[2] + " " + arr1[1];
		},
		"mm/dd/yyyy hh:mm:ss pm": function() {
			var arr1 = dateString.split(" ");
			var arr = arr1[0].split("/");
			str = arr[0] + "/" + arr[1] + "/" + arr[2] + " " + arr1[1];
		},
		"mm-yy": function() {
			var arr = dateString.split("-");
			str = arr[0] + "/" + "01" + "/" + getFullYear(arr[1]);
		},
		"dd-mm-yy": function() {
			var arr = dateString.split("-");
			str = arr[1] + "/" + arr[0] + "/" + getFullYear(arr[2]);
		},
		"mm-dd-yy": function() {
			var arr = dateString.split("-");
			str = arr[0] + "/" + arr[1] + "/" + getFullYear(arr[2]);
		},
		"dd-mm-yyyy": function() {
			var arr = dateString.split("-");
			str = arr[1] + "/" + arr[0] + "/" + arr[2];
		},
		"mm-dd-yyyy": function() {
			var arr = dateString.split("-");
			str = arr[0] + "/" + arr[1] + "/" + arr[2];
		},
		"yyyy-mm-dd": function() {
			var arr = dateString.split("-");
			str = arr[1] + "/" + arr[2] + "/" + arr[0];
		},
		"dd-mm-yyyy hh:mm:ss": function() {
			var arr1 = dateString.split(" ");
			var arr = arr1[0].split("-");
			str = arr[1] + "/" + arr[0] + "/" + arr[2] + " " + arr1[1];
		},
		"dd-mm-yyyy hh:mm:ss pm": function() {
			var arr1 = dateString.split(" ");
			var arr = arr1[0].split("-");
			str = arr[1] + "/" + arr[0] + "/" + arr[2] + " " + arr1[1];
		},
		"mm-dd-yyyy hh:mm:ss": function() {
			var arr1 = dateString.split(" ");
			var arr = arr1[0].split("-");
			str = arr[0] + "/" + arr[1] + "/" + arr[2] + " " + arr1[1];
		},
		"mm-dd-yyyy hh:mm:ss pm": function() {
			var arr1 = dateString.split(" ");
			var arr = arr1[0].split("-");
			str = arr[0] + "/" + arr[1] + "/" + arr[2] + " " + arr1[1];
		},
		"yyyy-mm-ddThh:mm:ss.sss-hh.mm": function() {
			str = dateString;
		},
		"yyyy-mm-ddThh:mm:ss.sss": function() {
			str = dateString;
		},
		"dd mmm yyyy": function() {
			str = dateString;
		},
		"dd mmm yyyy hh:mm": function() {
			str = dateString;
		},
		"day,month dd,yyyy": function() {
			str = dateString;
		},
		"default": function() {
			str = dateString;
		}
	};
	var dateFormate = (IsBoolean(this.m_designMode)) ? "mm/dd/yyyy" : this.m_sourcedateformat;
	(dateTypes[dateFormate] || dateTypes["default"])();
	return str;
};
Chart.prototype.drawRangeSelector = function() {
	var temp = this;
	$("#rangeSelector" + temp.m_objectid).remove();
	if (this.m_charttype == "timeseries" && IsBoolean(this.m_showrangeselector)) {
		this.rangeSelectorImplementation();
	}
};

Chart.prototype.rangeSelectorImplementation = function() {
	var temp = this;
	var rangeSelector = document.createElement("div");
	var topFloatingMargin = (IsBoolean(this.getShowLegends()) && !IsBoolean(this.m_fixedlegend) && (this.m_legendposition == "horizontalTopLeft" || this.m_legendposition == "horizontalTopCenter" || this.m_legendposition == "horizontalTopRight")) ? this.m_topFloatingLegendMargin : 0;
	$(rangeSelector).attr("id", "rangeSelector" + temp.m_objectid);
	$(rangeSelector).attr("class", "timeSeries-RangeSelector-Container");
	$(rangeSelector).css({
		"z-index": IsBoolean(this.m_designMode) ? "0" : (this.m_zIndex * 1 + 1),
		"top": (this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1 - 14 + topFloatingMargin) + "px",
		"background": hex2rgb(this.m_sliderbordercolor, this.m_rangeselectoropacity),
		"height": (27 * temp.minWHRatio()) + "px"
	});
	var rangesTextArr = ["1w", "2w", "1m", "3m", "6m", "1y", "5y", "All"];
	var frequency = temp.m_lineCalculation.getDataFrequency(temp.CatData[0]);
	for (var i = 0; i < rangesTextArr.length; i++) {
		var range = document.createElement("li");
		range.style.fontFamily = selectGlobalFont(temp.m_rangeselectorfontfamily);
		$(range).attr("id", "range_" + rangesTextArr[i] + "_" + temp.m_objectid);
		$(range).attr("class", "timeSeries-RangeSelector");
		if (!temp.isInRange(rangesTextArr[i].substring(0, 1), rangesTextArr[i].substring(1, 2), frequency) && (rangesTextArr[i] !== "All")) {
			$(range).css({
				"pointer-events": "none",
				"opacity": "0.4",
				"display": "inline-block"
			});
		}
		$(range).html(rangesTextArr[i]);
		$(rangeSelector).append(range);
		$(range).click(function() {
			temp.updateTimeSeriesWithRange($(this).text());
		});
	}
	$("#draggableDiv" + temp.m_objectid).append(rangeSelector);
	/** @description Add text box for show start-date and end-date **/
	if ((temp.m_width * 1) > 545 && temp.CatData[0].length >= 2) {
		$(rangeSelector).append('<div id="TimeInterval' + temp.m_objectid + '"  style="position:absolute; right:' + (10 + (IsBoolean(temp.getShowLegends()) ? 20 : 0)) + 'px;display: inline-block; margin:2px;"><span class="textBox-time-Interval" style="font-family:' + selectGlobalFont(temp.m_rangeselectorfontfamily) + ';">From </span><input type="text" readonly style="font-size:' + temp.fontScaling(13) + 'px;font-family:' + selectGlobalFont(temp.m_rangeselectorfontfamily) + ';" class="textBox-time-Interval" id="From' + temp.m_objectid + '"> <span class="textBox-time-Interval" style="font-size:' + selectGlobalFont(temp.m_rangeselectorfontfamily) + ';"> To </span><input type="text" readonly style="font-size:' + temp.fontScaling(13) + 'px;font-family:' + selectGlobalFont(temp.m_rangeselectorfontfamily) + ';" class="textBox-time-Interval" id="To' + temp.m_objectid + '"></div>');
	}
	
	/** Added for support chart scaling*/
	if (IsBoolean(isScaling)) {
		$(rangeSelector).find(".timeSeries-RangeSelector").css({
			"height": (19 * temp.minWHRatio()) + "px",
			"margin": (4 * temp.minWHRatio()) + "px",
			"font-size": temp.fontScaling(13) + "px",
			"display":"block"
		});
	    var isIE = /*@cc_on!@*/false || !!document.documentMode;
	    if (isIE) {
	    	$(rangeSelector).find(".timeSeries-RangeSelector").css("display", "inline-block");
	    }
		$(rangeSelector).find(".textBox-time-Interval").css({
			"height": (20 * temp.minWHRatio()) + "px",
			"font-size": temp.fontScaling(13) + "px"
		});
	}
};

Chart.prototype.isInRange = function(value, range, frequency) {
	var temp = this;
	var categoryData = temp.CatData[0];
	var startDay = new Date(isNaN(categoryData[0]) ? categoryData[0] : categoryData[0] * 1);
	var endIndex = categoryData.length - 1;
	for (var i = categoryData.length - 1; i > 0; i--) {
		if (categoryData[i] !== "") {
			endIndex = i;
			break;
		}
	}
	var endDay = new Date(isNaN(categoryData[endIndex]) ? categoryData[endIndex] : categoryData[endIndex] * 1);
	var millisecondsPerDay = 1000 * 60 * 60 * 24;

	var millisBetween = endDay.getTime() - startDay.getTime();
	var days = ((millisBetween / millisecondsPerDay) + 1);
	days = (Math.floor(days));

	if (temp.getDaysInRange(categoryData[0], value, range) <= days) {
		switch (frequency) {
			case "year":
				return (range == "y") ? true : false;
			case "month":
				return (range == "y" || range == "m") ? true : false;
			case "day":
				return (range == "y" || range == "m" || range == "w") ? true : false;
			case "hour":
				return (range == "y" || range == "m" || range == "w") ? true : false;
			case "minute":
				return (range == "y" || range == "m" || range == "w") ? true : false;
			default:
				return false;
		}
	} else {
		return false;
	}
};

Chart.prototype.getDaysInMonths = function(startDate, months) {
	var date = new Date(startDate);
	var month = (date.getMonth() + 1);
	var year = date.getFullYear();
	var index = 0;
	var days;
	for (var i = 1; i <= months; i++) {
		days = (new Date(year, month, 0).getDate());
		month++;
		index = index + (days);
	}
	return index;
};
Chart.prototype.getDaysInYears = function(startDate, years) {
	var date = new Date(startDate);
	var year = date.getFullYear();
	var index = 0;
	var days;
	for (var i = 1; i <= years; i++) {
		days = (isLeapYear(year)) ? 366 : 365;
		year++;
		index = index + (days);
	}
	return index;
};
Chart.prototype.getDaysInRange = function(startDate, value, range) {
	if (range == "w") {
		return (7 * value);
	} else if (range == "m") {
		return this.getDaysInMonths(startDate, value);
	} else if (range == "y") {
		return this.getDaysInYears(startDate, value);
	} else {
		return "";
	}
};

Chart.prototype.updateTimeSeriesWithRange = function(range) {
	var temp = this;
	var width = this.getEndX() - this.getStartX();
	var startX = this.getStartX() * 1;
	var rangesValueArr = ["1w", "2w", "1m", "3m", "6m", "1y", "5y", "All"];
	for (var i = 0; i < rangesValueArr.length; i++) {
		if (rangesValueArr[i] == range) {
			$("#range_" + rangesValueArr[i] + "_" + temp.m_objectid).css({
				"font-weight": "bold"
			});
		} else {
			$("#range_" + rangesValueArr[i] + "_" + temp.m_objectid).css({
				"font-weight": "normal"
			});
		}
	}
	if (range != "All") {
		var startdata = temp.CatData[0][0];
		var sdate = new Date(startdata).getTime();
		var edate = new Date(temp.CatData[0][temp.CatData[0].length - 1]).getTime();
		var days = this.getDaysInRange(startdata, range.substring(0, 1), range.substring(1, 2));
		var oneDayWidth = (edate - sdate) / (1000 * 60 * 60 * 24);
		width = (width / oneDayWidth * days);
	}
	$("#silderSelecterdiv" + temp.m_objectid).css({
		"left": 0,
		"width": width
	});

	temp.updatechart(startX, (startX + width));
};
Chart.prototype.resetSelectorToNormal = function() {
	var temp = this;
	var rangesValueArr = ["1w", "2w", "1m", "3m", "6m", "1y", "5y", "All"];
	for (var i = 0; i < rangesValueArr.length; i++) {
		$("#range_" + rangesValueArr[i] + "_" + temp.m_objectid).css("font-weight", "normal");
	}
};

/***************************** Start Slider Implementation *****************************/
Chart.prototype.updatechart = function(start, end) {
	var temp = this;
	this.updateDragChartFromSlider(start, end);
	if (new Date(this.startDate).toDateString() != "Invalid Date") {
		$("#From" + temp.m_objectid).val(new Date(this.startDate).toDateString());
		$("#To" + temp.m_objectid).val(new Date(this.endDate).toDateString());
	}
};
Chart.prototype.sliderTextBox = function() {
    var temp = this;
    var left = this.getStartX();
    var width = this.getEndX() - this.getStartX();
    var textwidth = width/4 ;
    if (this.m_sliderTextField == "" || this.m_sliderTextField == undefined) {
        var startData = temp.CatData[0][0];
        var endData = temp.CatData[0][temp.CatData[0].length - 1];
    } else {
    	var startData = temp.m_dataProvider[0][this.m_sliderTextField];
    	var endData = temp.m_dataProvider[temp.m_dataProvider.length - 1][this.m_sliderTextField];
    }
    var sliderTextDiv = document.createElement("div");
    sliderTextDiv.setAttribute("id", "textdiv" + temp.m_objectid);
    sliderTextDiv.setAttribute("style", " left:" + left + "px; bottom:68px; width:" + width + "px; height:18px; position:relative; display:flex; justify-content: space-between;");
    $(sliderTextDiv).css({
        "font-family": selectGlobalFont(this.m_xAxis.getLabelFontFamily()),
        "color": convertColorToHex(this.m_xAxis.getLabelFontColor()),
        "font-style": this.m_xAxis.getLabelFontStyle(),
        "font-size": this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px",
        "font-weight": this.m_xAxis.getLabelFontWeight(),
        "text-decoration": this.m_xAxis.getLabelTextDecoration()
    });
    var input1 = document.createElement("div");
    var input2 = document.createElement("div");
    input1.setAttribute("style","width:" + textwidth + "px; text-align:start; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;");
    input2.setAttribute("style","width:" + textwidth + "px; text-align:end; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;");
    sliderTextDiv.append(input1);
    sliderTextDiv.append(input2);
    if (this.m_sliderStartText == "" && this.m_sliderEndText == "") {
        input1.innerHTML = startData + ":";
        input2.innerHTML = endData + ":";
    } else {
        input1.innerHTML = this.m_sliderStartText + startData;
        input2.innerHTML = this.m_sliderEndText + endData;
    }
    $("#svgTimeScaleDiv" + temp.m_objectid).append(sliderTextDiv);
    
   /*DAS-411 */
	if (IsBoolean(this.m_showslidertext)) {
		   height = this.m_sliderheight;
		   $("#textdiv" + temp.m_objectid).css("bottom",height+ 18 + "px");
	    }
}

Chart.prototype.drawslider = function() {
	var temp = this;
	$("#rangeslider" + temp.m_objectid).remove();
	if (IsBoolean(this.m_showslider)) {
		this.jquerySliderImplementation();
	}
};
Chart.prototype.jquerySliderImplementation = function() {
	var temp = this;
	var left = this.getStartX();
	var width = this.getEndX() - this.getStartX();
	var slectedWidth = (temp.m_sliderwidthperc != undefined) ? (temp.m_sliderwidthperc * width):((this.m_sliderrange == "auto") ? width * 3 / 10 : (this.m_sliderrange * 1) * width / 100);
	/** To update slider position left to right side or according to current Date index*/
	var tempLeft;
	if(IsBoolean(!temp.m_slideronmaxmize) || this.m_sliderleftperc == undefined){
		if (this.m_sliderposition == "left") {
			tempLeft = this.getStartX()*1;
		} else if (this.m_sliderposition == "right") {
			tempLeft = width - slectedWidth;
		} else {
			tempLeft = this.sliderAxisCalculation(width, slectedWidth);
			if (this.currentDateIndex === 0) {
			    tempLeft = (this.sliderAxisCalculation(width, slectedWidth)) - (this.getStartX() * 1);
			}
		}
	} else {
		tempLeft = (this.m_sliderleftperc * width);//this.getStartX()*1 + 
	}
	
	var sliderContainerDiv = document.createElement("div");
	sliderContainerDiv.setAttribute("id", "newSilderBody" + temp.m_objectid);
	sliderContainerDiv.setAttribute("class", "newSilderBody");
	sliderContainerDiv.setAttribute("style", " left:" + left + "px; top:0px; width:" + width + "px; height:" + this.m_sliderheight + "px; position:relative;");
	$(sliderContainerDiv).css({
		"background": hex2rgb(this.m_sliderbordercolor, this.m_slideropacitycontainer),
		"border": "1px solid " + hex2rgb(this.m_sliderbordercolor, this.m_sliderborderopacity)
	});
	$("#svgTimeScaleDiv" + temp.m_objectid).append(sliderContainerDiv);

	var silderSelecterdiv = document.createElement("div");
	silderSelecterdiv.setAttribute("id", "silderSelecterdiv" + temp.m_objectid);
	silderSelecterdiv.setAttribute("class", "easyui-draggable");
	var bgColor = hex2rgb(this.m_sliderbordercolor, this.m_slideropacityselection);
	silderSelecterdiv.setAttribute("style", "position:absolute;top:0px; width:" + slectedWidth + "px; height:" + this.m_sliderheight + "px;  background:" + bgColor + ";cursor:move;");
	$(silderSelecterdiv).css({
		"border-left": "1px solid " + hex2rgb(this.m_sliderbordercolor, this.m_sliderborderopacity),
		"border-right": "1px solid " + hex2rgb(this.m_sliderbordercolor, this.m_sliderborderopacity)
	});
	if (temp.m_sliderposition != "left") { // || temp.m_sliderleftperc != undefined
		$(silderSelecterdiv).css({
			 "left" : tempLeft + "px"
		});
	}
	$(sliderContainerDiv).append(silderSelecterdiv);

	var leftHandle = document.createElement("div");
	leftHandle.setAttribute("id", "leftHandle" + temp.m_objectid);
	$(silderSelecterdiv).append(leftHandle);
	var leftbordercolor = hex2rgb(this.m_sliderbordercolor, this.m_sliderborderopacity);
	$("#leftHandle" + temp.m_objectid).attr("style", "position:absolute;left:-3px;top:" + this.m_sliderheight / 4 + "px;width:5px;height:" + this.m_sliderheight / 2.5 + "px;border:1px solid " + leftbordercolor + ";background:#F6F7F2;");

	var rightHandle = document.createElement("div");
	rightHandle.setAttribute("id", "rightHandle" + temp.m_objectid);
	$(silderSelecterdiv).append(rightHandle);
	var rightbordercolor = hex2rgb(this.m_sliderbordercolor, this.m_sliderborderopacity);
	$("#rightHandle" + temp.m_objectid).attr("style", "position:absolute;top:" + this.m_sliderheight / 4 + "px;right:-3px;width:5px;height:" + this.m_sliderheight / 2.5 + "px;border:1px solid " + rightbordercolor + ";background:#F6F7F2;");

	/** start, drag, stop and resize events for other modules **/
	$("#silderSelecterdiv" + temp.m_objectid).draggable({
		axis: "x",
		containment: ("#newSilderBody" + temp.m_objectid),
		start: function(event, ui) {
			slectedWidth = ($(this).width());
		},
		drag: function(event, ui) {
			tempLeft = (temp.getStartX() * 1) + ($(this).position().left * 1);
			temp.updatechart(tempLeft, ((tempLeft * 1) + (1 * slectedWidth)));
		},
		stop: function(event, ui) {
			tempLeft = (temp.getStartX() * 1) + ($(this).position().left * 1);
			temp.updatechart(tempLeft, ((tempLeft * 1) + (1 * slectedWidth)));
			//console.log(templeft+" <==> "+((tempLeft*1)+(1*slectedWidth)))
		}
	});
	$("#silderSelecterdiv" + temp.m_objectid).resizable({
		axis: "x",
		containment: ("#newSilderBody" + temp.m_objectid),
		handles: "e,w",
		start: function(e, ui) {
			console.log("resizing started");
		},
		resize: function(e, ui) {
			tempLeft = (temp.getStartX() * 1) + (ui.position.left * 1);
			slectedWidth = ui.size.width;
			if (slectedWidth > 15) {
				temp.updatechart(tempLeft, ((tempLeft * 1) + (1 * slectedWidth)));
			}
		},
		stop: function(e, ui) {
			tempLeft = (temp.getStartX() * 1) + (ui.position.left * 1);
			slectedWidth = ui.size.width;
			temp.updatechart(tempLeft, ((tempLeft * 1) + (1 * slectedWidth)));
			temp.resetSelectorToNormal();
		}
	});

	$("#silderSelecterdiv" + temp.m_objectid).draggable({
		axis: "h",
		containment: ("#newSilderBody" + temp.m_objectid),

		onStartDrag: function(event, ui) {
			slectedWidth = $(event.data.target).outerWidth();
		},
		onDrag: function(event, ui) {
			constrain(event);
			tempLeft = (temp.getStartX() * 1) + ($(this).position().left * 1);
			temp.updatechart(tempLeft, ((tempLeft * 1) + (1 * slectedWidth)));
		},
		onStopDrag: function(event, ui) {
			constrain(event);
			tempLeft = (temp.getStartX() * 1) + ($(this).position().left * 1);
			temp.m_sliderleftperc = ($(this).position().left * 1)/((temp.getEndX()*1)-(temp.getStartX()*1));
			temp.updatechart(tempLeft, ((tempLeft * 1) + (1 * slectedWidth)));
			//console.log(templeft+" <==> "+((tempLeft*1)+(1*slectedWidth)));
		}
	});

	$("#silderSelecterdiv" + temp.m_objectid).resizable({
		minWidth: 15,
		fit: true,
		axis: "h",
		containment: ("#newSilderBody" + temp.m_objectid),
		maxWidth: width,
		handles: "e,w",
		onStartResize: function(e, ui) {
			//console.log($(this).width()*1);
		},
		onResize: function(e, ui) {
			constrainResizable(e);
			tempLeft = (temp.getStartX() * 1) + ($(this).position().left * 1);
			slectedWidth = e.data.width; //$(this).width()*1;
			if (slectedWidth > 15) {
				temp.updatechart(tempLeft, ((tempLeft * 1) + (1 * slectedWidth)));
			}
			//console.log("slectedWidth="+slectedWidth);
		},
		onStopResize: function(e, ui) {
			//console.log("slectedWidth onStopResize="+slectedWidth);
			constrainResizable(e);
			$(this).css({
				"left": e.data.left,
				"width": e.data.width
			});
			tempLeft = (temp.getStartX() * 1) + ($(this).position().left * 1);
			slectedWidth = e.data.width; //$(this).width()*1;;
			temp.m_sliderleftperc = ($(this).position().left * 1)/((temp.getEndX()*1)-(temp.getStartX()*1));
			temp.m_sliderwidthperc = slectedWidth / ((temp.getEndX()*1)-(temp.getStartX()*1));
			temp.updatechart(tempLeft, ((tempLeft * 1) + (1 * slectedWidth)));
			temp.resetSelectorToNormal();
		}
	});
	if (IsBoolean(this.m_showslidertext))
	    this.sliderTextBox();
};

/** @description centralized method to create group for xaxis , yaxis , data label, etc  **/
Chart.prototype.createXAxisMarkerLabelGroup = function(name) {
	var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.setAttribute('id', name+this.m_objectid);
	group.setAttribute('class', name);
	$(group).css({
		"font-family": selectGlobalFont(this.m_xAxis.getLabelFontFamily()),
		"font-style": this.m_xAxis.getLabelFontStyle(),
		"font-size": this.fontScaling(this.m_xAxis.getLabelFontSize()) +"px" ,
		"font-weight": this.m_xAxis.getLabelFontWeight(),
		"text-decoration": this.m_xAxis.getLabelTextDecoration()
	});
	$("#" + this.svgContainerId).append(group);
	//return group;
};

/** @description centralized method to create group for xaxis , yaxis , data label, etc  **/
Chart.prototype.createYAxisMarkerLabelGroup = function(name) {
	var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.setAttribute('id', name+this.m_objectid);
	group.setAttribute('class', name);
	$(group).css({
		"font-family": selectGlobalFont(this.m_yAxis.getLabelFontFamily()),
		"font-style": this.m_yAxis.getLabelFontStyle(),
		"font-size": this.fontScaling(this.m_yAxis.getLabelFontSize()) +"px" ,
		"font-weight": this.m_yAxis.getLabelFontWeight(),
		"text-decoration": this.m_yAxis.getLabelTextDecoration()
	});
	$("#" + this.svgContainerId).append(group);
	//return group;
};

/** @description centralized method to create group for xaxis , yaxis , data label, etc  **/
Chart.prototype.createTickGroup = function(name) {
	var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.setAttribute('id', name+this.m_objectid);
	group.setAttribute('class', name);
	$("#" + this.svgContainerId).append(group);
	//return group;
};

/** @description centralized method to create group for xaxis , yaxis , data label, etc  **/
Chart.prototype.createVerticalLineGroup = function(name) {
	var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.setAttribute('id', name+this.m_objectid);
	group.setAttribute('class', name);
	$("#" + this.svgContainerId).append(group);
	//return group;
};

/** @description centralized method to create group for xaxis , yaxis , data label, etc  **/
Chart.prototype.createHorizontalLineGroup = function(name) {
	var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.setAttribute('id', name+this.m_objectid);
	group.setAttribute('class', name);
	$("#" + this.svgContainerId).append(group);
	//return group;
};

/** @description centralized method to create group for xaxis , yaxis , data label, etc  **/
Chart.prototype.createShapeGroup = function(name, index, seriesName) {
	var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.setAttribute('id', name+index+this.m_objectid);
	group.setAttribute('class', name);
	group.setAttribute('data-fieldIndex', index);
	group.setAttribute('data-fieldName', seriesName);
	$("#" + this.svgContainerId).append(group);
	//return group;
};

/** @description centralized method to create group for xaxis , yaxis , data label, etc  **/
Chart.prototype.createYAxisCategoryMarkerLabelGroup = function(name) {
	var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.setAttribute('id', name+this.m_objectid);
	group.setAttribute('class', name);
	$(group).css({
		"font-family": selectGlobalFont(this.m_yAxis.getLabelFontFamily()),
		"font-style": this.m_yAxis.getLabelFontStyle(),
		"font-size": this.fontScaling(this.m_yAxis.getLabelFontSize()) +"px" ,
		"font-weight": this.m_yAxis.getLabelFontWeight(),
		"text-decoration": this.m_yAxis.getLabelTextDecoration()
	});
	$("#" + this.svgContainerId).append(group);
	//return group;
};

/** @description centralized method to create group for xaxis , yaxis , data label, etc  **/
Chart.prototype.createYAxisSubCategoryMarkerLabelGroup = function(name) {
	var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.setAttribute('id', name+this.m_objectid);
	group.setAttribute('class', name);
	$(group).css({
		"font-family": selectGlobalFont(this.m_yAxis.getLabelFontFamily()),
		"font-style": this.m_yAxis.getLabelFontStyle(),
		"font-size": this.fontScaling(this.m_yAxis.m_subcategoryfontsize) +"px" ,
		"font-weight": this.m_yAxis.getLabelFontWeight(),
		"text-decoration": this.m_yAxis.getLabelTextDecoration()
	});
	$("#" + this.svgContainerId).append(group);
	//return group;
};

/** @description centralized method to create group for xaxis , yaxis , data label, etc  **/
Chart.prototype.createDataLabelGroup = function (valueTextSeries, name , index, seriesName) {
	var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.setAttribute('id', name+index+this.m_objectid);
	group.setAttribute('class', name+this.m_referenceid);
	group.setAttribute('data-fieldIndex', index);
	group.setAttribute('data-fieldName', seriesName);
	$(group).css({
		"font-family": selectGlobalFont(valueTextSeries.datalabelProperties.datalabelFontFamily),
		"font-style": valueTextSeries.datalabelProperties.datalabelFontStyle,
		"font-size": this.fontScaling(valueTextSeries.datalabelProperties.dataLabelFontSize)+"px",
		"font-weight": valueTextSeries.datalabelProperties.datalabelFontWeight,
		"text-decoration": "none"
	});
	$("#" + this.svgContainerId).append(group);
};

/** @description centralized method to create group for xaxis , yaxis , data label, etc  **/
Chart.prototype.createStackGroup = function (barSeriesArray, name , index, seriesName) {
	//"barSeriesArray" parameter has been added in parameter to use it's property if required
	var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.setAttribute('id', name+index+this.m_objectid);
	group.setAttribute('class', name);
	group.setAttribute('data-fieldIndex', index);
	group.setAttribute('data-fieldName', seriesName);
	$("#" + this.svgContainerId).append(group);
};

/** @description centralized method to create group for timeline slider stack **/
Chart.prototype.createStackGroupForSlider = function (barSeriesArray, name , index, seriesName) {
	//"barSeriesArray" parameter has been added in parameter to use it's property if required
	var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.setAttribute('id', name+index+this.m_objectid);
	group.setAttribute('class', name);
	group.setAttribute('data-fieldIndex', index);
	group.setAttribute('data-fieldName', seriesName);
	$("#" + this.svgTimeScaleId).append(group);
};

/** @description centralized method to create group for heat map box etc  **/
Chart.prototype.createHeatMapRectBoxGroup = function (valueTextSeries, name , index, seriesName) {
	var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.setAttribute('id', name+index+this.m_objectid);
	group.setAttribute('class', name);
	group.setAttribute('data-fieldIndex', index);
	group.setAttribute('data-fieldName', seriesName);
	$("#" + this.svgContainerId).append(group);
};

/** @description centralized method to create group for heat map text etc  **/
Chart.prototype.createHeatMapBoxLabelGroup = function (valueTextSeries, name , index, seriesName) {
	var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.setAttribute('id', name+index+this.m_objectid);
	group.setAttribute('class', name+this.m_referenceid);
	group.setAttribute('data-fieldIndex', index);
	group.setAttribute('data-fieldName', seriesName);
	$(group).css({
		"font-family": selectGlobalFont(this.m_celltextfontfamily),
		"font-style": this.m_celltextfontstyle,
		"font-size": this.fontScaling(this.m_celltextfontsize * 1)+"px",
		"font-weight": this.m_celltextfontweight
	});
	$("#" + this.svgContainerId).append(group);
};

/** @description this method will check browser type **/
Chart.prototype.isPropertyBrowserCompatible = function () {
	/**In chrome isSafari && isChrome > 0**/
	/**In safari isSafari > 0 && isChrome < 0**/
	var isSafari = navigator.userAgent.indexOf("Safari");
	var isChrome = navigator.userAgent.indexOf("Chrome");
	if(isSafari > 0 && isChrome < 0) {
		return true;
	} else {
		return false;
	}
	/*if (window.window.L === undefined) {
		var isSafari = navigator.userAgent.indexOf("Safari");
		var isChrome = navigator.userAgent.indexOf("Chrome");
		if(isSafari > 0 && isChrome < 0) {
			console.log(isSafari);
			return true;
		} else {
			return false;
		}
	} else {
		var isSafari = window.window.L.Browser.safari;
		console.log(isSafari);
		return isSafari;
	}*/
};

function constrainResizable(e) {
	var d = e.data;
	if (d.left < 0) {
		d.width = (d.width - Math.abs(d.left));
		d.left = 0;
	}
	if ((d.left * 1 + d.width * 1) > d.target.parentElement.clientWidth) {
		d.width = d.width - ((d.left * 1 + d.width * 1) - d.target.parentElement.clientWidth);
	}
	//DAS-564 Added to support legend when slider is enabled 
	if (d.top < 0) {
		d.height = (d.height - Math.abs(d.top));
		d.top = 0;
	}
	if ((d.top * 1 + d.height * 1) > d.target.parentElement.clientHeight) {
		d.height = d.height - ((d.top * 1 + d.height * 1) - d.target.parentElement.clientHeight);
	}
};

function constrain(e) {
	var d = e.data;
	if (d.left < 0) {
		d.left = 0;
	}
	if (d.top < 0) {
		d.top = 0;
	}
	if (d.left + $(d.target).outerWidth() > $(d.parent).width()) {
		d.left = $(d.parent).width() - $(d.target).outerWidth();
	}
	if (d.top + $(d.target).outerHeight() > $(d.parent).height()) {
		d.top = $(d.parent).height() - $(d.target).outerHeight();
	}
};

/******************************** Parent class of X and Y axis ***********************************/
function Axes() {
	this.m_labelfontweight = "normal";
	this.m_labelrotation = "90";
	this.m_labelfontstyle = "normal";
	this.m_labelfontsize = "11";
	this.m_labeltextdecoration = "none";
	this.m_textdecoration = "none";
	this.m_labeltilted = "false";
	this.m_labelfontfamily = "Roboto";
	this.m_fontsize = "11";
	this.m_fontstyle = "normal";
	this.m_fontweight = "normal";
	this.m_fontcolor = "0";
	this.m_description = "";
	this.m_labelfontcolor = "0";
	this.m_fontfamily = "Roboto";

	this.m_leftaxisformater = "true";
	this.m_seconddiscription = "yaxis";
	this.m_rightaxisformater = "false";

	this.m_labeltextalign = "center";
	this.m_descriptiontextalign = "center";
};

Axes.prototype.getFontWeight = function() {
	return this.m_fontweight;
};
Axes.prototype.setFontWeight = function(FontWeightValue) {
	this.m_fontweight = FontWeightValue;
};

Axes.prototype.getLabelTextDecoration = function() {
	return this.m_labeltextdecoration;
};
Axes.prototype.setLabelTextDecoration = function(LabelTextDecorationValue) {
	this.m_labeltextdecoration = LabelTextDecorationValue;
};

Axes.prototype.getLabelFontWeight = function() {
	return this.m_labelfontweight;
};
Axes.prototype.setLabelFontWeight = function(LabelFontWeightValue) {
	this.m_labelfontweight = LabelFontWeightValue;
};

Axes.prototype.getLabelFontColor = function() {
	return this.m_labelfontcolor;
};
Axes.prototype.setLabelFontColor = function(LabelFontColorValue) {
	this.m_labelfontcolor = LabelFontColorValue;
};

Axes.prototype.getLabelFontStyle = function() {
	return this.m_labelfontstyle;
};
Axes.prototype.setLabelFontStyle = function(LabelFontStyleValue) {
	this.m_labelfontstyle = LabelFontStyleValue;
};

Axes.prototype.getTextDecoration = function() {
	return this.m_textdecoration;
};
Axes.prototype.setTextDecoration = function(TextDecorationValue) {
	this.m_textdecoration = TextDecorationValue;
};

Axes.prototype.getLabelTilted = function() {
	return this.m_labeltilted;
};
Axes.prototype.setLabelTilted = function(LabelTiltedValue) {
	this.m_labeltilted = LabelTiltedValue;
};

Axes.prototype.getFontSize = function() {
	return this.m_fontsize;
};
Axes.prototype.setFontSize = function(FontSizeValue) {
	this.m_fontsize = FontSizeValue;
};

Axes.prototype.getLabelFontFamily = function() {
	return selectGlobalFont(this.m_labelfontfamily);
};
Axes.prototype.setLabelFontFamily = function(LabelFontFamilyValue) {
	this.m_labelfontfamily = LabelFontFamilyValue;
};

Axes.prototype.getFontFamily = function() {
	return selectGlobalFont(this.m_fontfamily);
};
Axes.prototype.setFontFamily = function(FontFamilyValue) {
	this.m_fontfamily = FontFamilyValue;
};
Axes.prototype.getDescription = function() {
	return this.m_description;
};
Axes.prototype.setDescription = function(DescriptionValue) {
	this.m_description = DescriptionValue;
};

Axes.prototype.getLabelrotation = function() {
	return IsBoolean(this.getLabelTilted()) ? this.m_labelrotation : 0;
};
Axes.prototype.setLabelrotation = function(LabelrotationValue) {
	this.m_labelrotation = LabelrotationValue;
};

Axes.prototype.getFontStyle = function() {
	return this.m_fontstyle;
};
Axes.prototype.setFontStyle = function(FontStyleValue) {
	this.m_fontstyle = FontStyleValue;
};

Axes.prototype.getFontColor = function() {
	return this.m_fontcolor;
};
Axes.prototype.setFontColor = function(FontColorValue) {
	this.m_fontcolor = FontColorValue;
};

Axes.prototype.getSecondAxisFontColor = function() {
	return this.m_secondAxisfontcolor;
};

Axes.prototype.getLabelFontSize = function() {
	return this.m_labelfontsize;
};
Axes.prototype.setLabelFontSize = function(LabelFontSizeValue) {
	this.m_labelfontsize = LabelFontSizeValue;
};

Axes.prototype.getRightAxisFormater = function() {
	return this.m_rightaxisformater;
};
Axes.prototype.setRightaxisFormater = function(rightaxisFormaterValue) {
	this.m_rightaxisformater = rightaxisFormaterValue;
};

Axes.prototype.getLeftaxisFormater = function() {
	return this.m_leftaxisformater;
};
Axes.prototype.setLeftaxisFormater = function(leftaxisFormaterValue) {
	this.m_leftaxisformater = leftaxisFormaterValue;
};

Axes.prototype.getSecondDiscription = function() {
	return this.m_seconddiscription;
};
Axes.prototype.setSecondDiscription = function(SecondDiscriptionValue) {
	this.m_seconddiscription = SecondDiscriptionValue;
};

Axes.prototype.isLabelDecoration = function() {
	return (this.getLabelTextDecoration().toLowerCase() == "underline") ? true : false;
};
Axes.prototype.isDescriptionDecoration = function() {
	return (this.getTextDecoration().toLowerCase() == "underline") ? true : false;
};

Axes.prototype.getSecondAxisFontStyle = function() {
	return this.m_chart.m_secondaxisfontstyle;
};
Axes.prototype.getSecondAxisFontWeight = function() {
	return this.m_chart.m_secondaxisfontweight;
};
Axes.prototype.getSecondAxisFontSize = function() {
	return this.m_chart.m_secondaxisfontsize;
};
Axes.prototype.getSecondAxisFontFamily = function() {
	return selectGlobalFont(this.m_chart.m_secondaxisfontfamily);
};
Axes.prototype.getSecondAxisTextDecoration = function() {
	return this.m_chart.m_secondaxistextdecoration;
};

Axes.prototype.drawLineBetweenPoints = function(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2) {
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.lineWidth = lineWidth;
	this.ctx.translate(antiAliasing, antiAliasing);
	this.ctx.strokeStyle = strokeColor;
	/** parseInt() is used to draw Sharp marker lines **/
	this.ctx.moveTo(parseInt(x1), parseInt(y1));
	this.ctx.lineTo(parseInt(x2), parseInt(y2));
	this.ctx.stroke();
	this.ctx.restore();
	this.ctx.closePath();
};

Axes.prototype.initColors = function() {
	this.m_labelfontcolor = convertColorToHex(this.getLabelFontColor());
	this.m_fontcolor = convertColorToHex(this.getFontColor());
};

Axes.prototype.getText = function(text1, textWidth, ctxFont) {
	var text = "" + text1;
	var newText = "";
	this.ctx.font = ctxFont;

	var strWidth = this.ctx.measureText(text).width;
	if (text.length > 0) {
		var appendedTextWidth = (strWidth / text.length) * 2;
	}
	for (var i = 0; i < text.length; i++) {
		if (this.ctx.measureText(newText).width < (textWidth - appendedTextWidth) || (i == (text.length - 1))) {
			newText += text[i];
		} else {
			newText = newText + ".";
			break;
		}
	}
	return newText;
};

/***************************** XAxis *********************************/
function Xaxis() {
	this.base = Axes;
	this.base();

	this.m_chart;

	this.m_startX;
	this.m_startY;
	this.m_endX;
	this.m_endY;

	this.m_xAxisData = [];
	this.m_axiscolor;

	this.m_showlinexaxis = "true";
	this.m_linexaxiscolor = "";

	this.m_textUtil = new TextUtil();
	this.ctx = "";
};

Xaxis.prototype = new Axes;

Xaxis.prototype.init = function(m_chart) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.m_startX = this.m_chart.getStartX();
	this.m_startY = this.m_chart.getStartY();
	this.m_endX = this.m_chart.getEndX();
	this.m_endY = this.m_chart.getEndY();

	this.m_xAxisData = this.m_chart.getCategoryData()[0];
	this.m_axiscolor = convertColorToHex(this.m_chart.getAxisColor());
	this.m_linexaxiscolor = (this.m_linexaxiscolor !== "") ? convertColorToHex(this.m_linexaxiscolor) : this.m_axiscolor;
	this.m_labelfontcolor = convertColorToHex(this.getLabelFontColor());
};

Xaxis.prototype.drawXAxis = function() {
	if (IsBoolean(this.m_showlinexaxis)) {
		var msfx = 1;
		/** msfx = margin space from x - axis 1 px **/
		var lineWidth = 0.5;
		var antiAliasing = 0.5;
		var strokeColor = this.m_linexaxiscolor;
		var x1 = this.m_startX * 1 - msfx * 1 - this.m_chart.m_axistodrawingareamargin;
		var y1 = this.m_startY * 1 + msfx * 1 + this.m_chart.m_axistodrawingareamargin;
		var x2 = this.m_endX * 1;
		var y2 = this.m_startY * 1 + msfx * 1 + this.m_chart.m_axistodrawingareamargin;
		this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
	}
};

Xaxis.prototype.drawTickMarks = function() {
	if (IsBoolean(this.m_tickmarks)) {
		var tickMarkerHeight = 8;
		/** BDD - 744_showing tickmark in place of vertical line **/
		if(IsBoolean(this.m_chart.m_tickmarksatstart)){
			for (var i = 0; i < this.m_xAxisData.length; i++) {
				var lineWidth = 0.5;
				var antiAliasing = 0.5;
				var strokeColor = this.m_categorymarkingcolor;
				var x1 = this.m_startX * 1 + this.getXaxisDivison() * i + this.getXaxisDivison()/2;
				var y1 = this.m_startY * 1 + this.m_chart.m_axistodrawingareamargin;
				var x2 = this.m_startX * 1 + this.getXaxisDivison() * i + this.getXaxisDivison()/2;
				var y2 = this.m_startY * 1 + tickMarkerHeight * 1 + this.m_chart.m_axistodrawingareamargin;
				this.drawLineBetweenPoints(lineWidth, antiAliasing,strokeColor, x1, y1, x2, y2);
			}
		}
		else
		{
			for (var i = 0; i < this.m_xAxisData.length + 1; i++) {
				
				var lineWidth = 0.5;
				var antiAliasing = 0.5;
				var strokeColor = this.m_categorymarkingcolor;
				var x1 = this.m_startX * 1 + this.getXaxisDivison() * i - 1;
				var y1 = this.m_startY * 1 + this.m_chart.m_axistodrawingareamargin;
				var x2 = this.m_startX * 1 + this.getXaxisDivison() * i - 1;
				var y2 = this.m_startY * 1 + tickMarkerHeight * 1 + this.m_chart.m_axistodrawingareamargin;
				this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
			}
		}
	}
};


Xaxis.prototype.drawTickMarksForScatterPlotChart = function() {
	if (IsBoolean(this.m_tickmarks)) {
		var tickMarkerHeight = 8;
		var msfx = 1;
		/** msfx = margin space from x - axis 1 px **/
		for (var i = 0; i < this.m_xAxisData.length; i++) {
			var lineWidth = 0.5;
			var antiAliasing = 0.5;
			var strokeColor = this.m_categorymarkingcolor;
			var x1 = this.m_startX * 1 + ((this.m_endX - this.m_startX) / (this.m_xAxisData.length - 1)) * (i * 1);
			var y1 = this.m_startY * 1 + msfx * 1;
			var x2 = this.m_startX * 1 + ((this.m_endX - this.m_startX) / (this.m_xAxisData.length - 1)) * (i * 1);
			var y2 = this.m_startY * 1 + tickMarkerHeight * 1;
			this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
		}
	}
};

Xaxis.prototype.drawVerticalLine = function() {
	if (IsBoolean(this.m_chart.m_showverticalmarkerline)) {
		for (var i = 0; i < this.m_xAxisData.length; i++) {
			var lineWidth = 0.5;
			var antiAliasing = 0.5;
			var strokeColor = hex2rgb(this.m_chart.m_markercolor, this.m_chart.m_markertransparency);
			var x1 = this.m_startX * 1 + (this.getXaxisDivison() / 2 + this.getXaxisDivison() * i);
			var y1 = this.m_startY * 1 + this.m_chart.m_axistodrawingareamargin;
			var x2 = this.m_startX * 1 + (this.getXaxisDivison() / 2 + this.getXaxisDivison() * i);
			var y2 = this.m_endY * 1;
			this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
		}
	}
};

Xaxis.prototype.drawVerticalLineForScatterPlotChart = function() {
	for (var i = 0; i < this.m_xAxisData.length; i++) {
		var lineWidth = 0.5;
		var antiAliasing = 0.5;
		var strokeStyle = hex2rgb(this.m_chart.m_markercolor, this.m_chart.m_markertransparency);
		var x1 = this.m_startX * 1 + ((this.m_endX - this.m_startX) / (this.m_xAxisData.length - 1)) * (i * 1);
		var y1 = this.m_startY * 1;
		var x2 = this.m_startX * 1 + ((this.m_endX - this.m_startX) / (this.m_xAxisData.length - 1)) * (i * 1);
		var y2 = this.m_endY * 1;
		this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeStyle, x1, y1, x2, y2);
	}
};

Xaxis.prototype.zeroMarkerVerticalLineForScatterPlotChart = function() {
	for (var i = 0; i < this.m_xAxisActualMarkersArray.length; i++) {
		if (this.m_xAxisActualMarkersArray[i] == 0) {
			var lineWidth = 0.5;
			var antiAliasing = 0.5;
			var strokeStyle = hex2rgb(this.m_chart.m_verticalzeromarkercolor, this.m_chart.m_markertransparency);
			var x1 = this.m_startX * 1 + ((this.m_endX - this.m_startX) / (this.m_xAxisActualMarkersArray.length - 1)) * (i * 1);
			var y1 = this.m_startY * 1;
			var x2 = this.m_startX * 1 + ((this.m_endX - this.m_startX) / (this.m_xAxisActualMarkersArray.length - 1)) * (i * 1);
			var y2 = this.m_endY * 1;
			this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeStyle, x1, y1, x2, y2);
			break;
		}
	}
};

Xaxis.prototype.markXaxis = function() {
	var checkLabelFont = parseInt(this.m_chart.m_xAxis.m_labelfontsize);
	var checkFont = parseInt(this.m_chart.m_xAxis.m_fontsize);
	if(checkLabelFont>0){
		this.drawAxisLabels();
	}
	if (checkFont>0) {
		this.drawDescription();
	}
};

Xaxis.prototype.drawAxisLabels = function() {
	for (var i = 0; i < this.m_xAxisData.length; i++) {
		if ((i % this.m_chart.m_skipxaxislabels) == 0 || this.m_chart.m_skipxaxislabels == "auto") {
			this.ctx.beginPath();
			this.ctx.save();
			if (this.m_chart.m_type == "Plot") {
				this.drawAxisLabelsForScatterPlotChart(this.m_xAxisData[i], i);
			} else {
				this.drawLabel(this.m_xAxisData[i], i);
			}
			this.ctx.restore();
			this.ctx.closePath();
		}
	}
};
/** @description will draw  X Axis  Label markings only for ScatteredPlotChart in case of x axis formatters. **/
Xaxis.prototype.drawAxisLabelsForScatterPlotChart = function(text, i) {
	var m_axisLineToTextGap = (IsBoolean(this.m_chart.m_updateddesign) ? 15 : 5);
	//text = getFormattedNumberWithCommas(text, this.m_chart.m_secondaryaxisnumberformatter);
	if (IsBoolean(this.getLabelTilted())) {
		var dm = (this.getDescription() !== "") ? this.m_fontsize : 5;
		var avlblheight = this.m_chart.m_height / 4 - m_axisLineToTextGap / 2 - dm - this.calculateAxisLineToTextGap() / 2 + this.m_chart.m_extraspace;
		var rotation = this.getLabelrotation();
		this.ctx.font = this.getLabelFontProperties();
		if (this.ctx.measureText(text).width > avlblheight) {
			text = this.getText("" + text, avlblheight, this.getLabelFontProperties());
		}
	} else {
		var avlblheight = ((this.m_endX - this.m_startX) / this.m_xAxisData.length) * 2;
		var rotation = 0;
		if (this.m_chart.noOfRows == 2) {
			text = this.getText("" + text, avlblheight, this.getLabelFontProperties());
		}
	}
	this.translateTextPosition(m_axisLineToTextGap, i, text);
	this.ctx.rotate(rotation * Math.PI / 180);
	this.m_textUtil.drawText(this.ctx, text, 0, 0, this.getLabelFontProperties(), this.m_labeltextalign, this.m_labelfontcolor);
	if (IsBoolean(this.isLabelDecoration())) {
		this.drawUnderLine(text, 0, this.m_labelfontsize / 2, this.m_labelfontcolor, this.m_chart.fontScaling(this.getLabelFontSize()), this.m_labeltextalign);
	}
};
/** X Axis marking of charts which are drawing inside Trellis Chart **/
Xaxis.prototype.drawAxisLabelsForTrellis = function() {
	var temp = this;
	var markerArray = this.m_xAxisData; //all marker data
	var availWidth = (this.m_chart.getEndX() - this.m_chart.getStartX()) / (markerArray.length); //for each category width is calculating here
	if (this.m_chart.m_type == "BarChart") { //chaeking for Bar chart
		markerArray = this.m_chart.m_calculation.getXAxisMarkersArray(); //getting bar chart Marker array
		if (markerArray[0] != undefined && markerArray.length > 1) { //if marker contains more than 1 element
			var interval = (markerArray[markerArray.length - 1] * 1 - markerArray[0] * 1) / 2; //max value - min Value divide by 2,that will be interval
			var newMarkerArray = []; //creation of array
			newMarkerArray.push(markerArray[0] * 1); //pushing minimum value in array
			newMarkerArray.push(interval * 1 + markerArray[0] * 1); //pushing middle value in array
			newMarkerArray.push(markerArray[markerArray.length - 1]); //pushing last value in array
			markerArray = newMarkerArray; //moving newly created array into old array
			availWidth = (this.m_chart.getEndX() - this.m_chart.getStartX()) / (markerArray.length - 1); //calculating width for each category
		}
	}
	for (var i = 0; i < markerArray.length; i++) { //to the length of marker for bar it will be 3
		this.ctx.beginPath();
		this.ctx.save();
		var text = markerArray[i]; //getting text
		if (this.m_chart.m_type == "BarChart") { //if bar chart present
			text = this.getFormattedText(text); //formatting the text
		}
		text = this.getText("" + text, availWidth, this.getLabelFontProperties()); //scaling of text
		var textWidth = this.getLabelTextWidth(text); //getting text width
		if (this.m_chart.m_type == "BarChart") { //setting startX when Bar is present
			x = (this.m_startX) * 1 + (availWidth * i);
		} else if (this.m_xAxisData.length == 1) { //calculating startX for other charts
			var x = this.m_startX * 1 + (this.m_endX - this.m_startX) / 2;
		} else {
			var x = (this.m_startX) * 1 + (this.getXaxisDivison() / 2) * 1 + (this.getXaxisDivison() * i);
		}
		if (this.m_chart.m_type == "BarChart") {
			var y = 10;
			var text = drawSVGText(x, y, text, this.m_labelfontcolor, "center", "middle", this.getLabelrotation());
			text.setAttribute("style", "font-family:" + this.getLabelFontFamily() + ";font-style:" + this.getLabelFontStyle() + ";font-size:" + this.m_chart.fontScaling(this.getLabelFontSize()) + "px;font-weight:" + this.getLabelFontWeight() + ";text-decoration:" + this.getLabelTextDecoration() + ";");
			$("#" + temp.m_chart.svgContainerId).append(text);
		} else {
			this.translateText(0, x, 0, text, textWidth); //setting X and Y
			this.ctx.rotate(0 * Math.PI / 180); //rotating the Text
			if (IsBoolean(this.isLabelDecoration())) { //text decoration
				this.drawUnderLine(text, 0, this.m_labelfontsize / 2, this.m_labelfontcolor, this.m_chart.fontScaling(this.getLabelFontSize()), this.m_labeltextalign);
			}
			this.m_textUtil.drawText(this.ctx, getFormattedNumberWithCommas(text, this.m_chart.m_numberformatter), 0, 0, this.getLabelFontProperties(), this.m_labeltextalign, convertColorToHex(this.m_labelfontcolor)); //text drawing
			this.ctx.restore();
			this.ctx.closePath(); //ending
		}
	}
};

Xaxis.prototype.drawLabel = function(text, i) {
	var m_axisLineToTextGap = (IsBoolean(this.m_chart.m_updateddesign) ? 15 : 5);
	if (IsBoolean(this.getLabelTilted())) {
		var dm = (this.getDescription() !== "") ? this.m_fontsize : 5;
		var avlblheight = this.m_chart.m_height / 4 - m_axisLineToTextGap / 2 - dm - this.calculateAxisLineToTextGap() / 2;
		var rotation = this.getLabelrotation();
		this.ctx.font = this.getLabelFontProperties();
		if (this.ctx.measureText(text).width > avlblheight) {
			text = this.getText("" + text, avlblheight, this.getLabelFontProperties());
		}
	} else {
		/**commented if else statement since first and lastvalue not displaying properly even with enough space.**/
/*		if (i == 0 || i == this.m_xAxisData.length - 1) {
			var avlblheight = ((this.m_endX - this.m_startX) / this.m_xAxisData.length);
		}
		else {
			var avlblheight = ((this.m_endX - this.m_startX) / this.m_xAxisData.length) * 2;
		}   */
		var avlblheight = ((this.m_endX - this.m_startX) / this.m_xAxisData.length) * 2;
		var rotation = 0;
		if (this.m_chart.noOfRows == 2) {
			text = this.getText("" + text, avlblheight, this.getLabelFontProperties());
		}
	}
	this.translateTextPosition(m_axisLineToTextGap, i, text);
	this.ctx.rotate(rotation * Math.PI / 180);

	if (IsBoolean(this.isLabelDecoration())) {
		this.drawUnderLine(text, 0, this.m_labelfontsize / 2, this.m_labelfontcolor, this.m_chart.fontScaling(this.getLabelFontSize()), this.m_labeltextalign);
	}
	this.m_textUtil.drawText(this.ctx, text, 0, 0, this.getLabelFontProperties(), this.m_labeltextalign, this.m_labelfontcolor);
};

Xaxis.prototype.drawLabelUnderLine = function() {
	if (this.isLabelDecoration()) {
		for (var i = 0; i < this.m_xAxisData.length; i++) {
			this.drawUnderLine(this.m_xAxisData[i], parseInt(this.m_startX) + (parseInt(this.getXaxisDivison()) * i), parseInt(this.m_startY) + 15, this.m_labelfontcolor, this.m_chart.fontScaling(this.getLabelFontSize()), this.m_labeltextalign);
		}
	}
};

Xaxis.prototype.drawDescription = function() {
	//	this.m_textUtil.drawText( this.ctx ,this.getDescription(),this.getXDesc(), this.getYDesc() , this.getFontProperties() , this.m_descriptiontextalign ,this.m_fontcolor);
	var dsDec=this.m_chart.m_allCategoryDisplayNames.join("");
	var description=(IsBoolean(this.m_chart.m_xAxis.m_showdatasetdescription)) ? this.m_chart.formattedDescription(this.m_chart, dsDec) : this.m_chart.formattedDescription(this.m_chart, this.m_description);
	if(description !== ""){
		this.ctx.beginPath();
		this.ctx.font = this.getFontProperties();
		this.ctx.textAlign = this.m_descriptiontextalign;
		this.ctx.fillStyle = convertColorToHex(this.m_fontcolor);
		this.ctx.fillText(description, this.getXDesc(), this.getYDesc());
		this.ctx.closePath();
		if (this.isDescriptionDecoration()) {
			this.drawUnderLine(description, this.getXDesc(), (this.getYDesc() * 1 + this.m_fontsize / 2), convertColorToHex(this.m_fontcolor), this.m_chart.fontScaling(this.getFontSize()), this.m_descriptiontextalign);
		}	
	}
};

Xaxis.prototype.drawUnderLine = function(text, startX, startY, color, fontSize, align) {
	this.m_chart.underLine(text, startX, startY, color, fontSize, align);
};

Xaxis.prototype.getXaxisDivison = function() {
	return ((this.m_endX - this.m_startX) / (this.m_xAxisData.length));
};

Xaxis.prototype.getFontProperties = function() {
	return this.m_textUtil.getFontProperties(this.getFontStyle(), this.getFontWeight(), this.m_chart.fontScaling(this.getFontSize()), this.getFontFamily());
};

Xaxis.prototype.getLabelFontProperties = function() {
	return this.m_textUtil.getFontProperties(this.getLabelFontStyle(), this.getLabelFontWeight(), this.m_chart.fontScaling(this.getLabelFontSize()), this.getLabelFontFamily());
};

Xaxis.prototype.calculateAxisLineToTextGap = function() {
	return this.m_chart.fontScaling(this.getLabelFontSize()) + (this.m_chart.m_chartpaddings.bottomMarkersToLine*1 || 0);
};
Xaxis.prototype.calculateAxisToLabelMargin = function(i) {
	var axisToLabelMargin = 0;
	if(this.m_chart.noOfRows == 2 && !IsBoolean(this.getLabelTilted())){
		if(i % 2 != 0) {
			axisToLabelMargin = this.m_chart.fontScaling(this.getLabelFontSize() * 1.5);
		}
	}
	return axisToLabelMargin*1;
};
Xaxis.prototype.getLabelTextWidth = function(text) {
	this.ctx.font = this.getLabelFontProperties();
	var textWidth = this.ctx.measureText(text).width;
	if (textWidth > this.m_chart.m_height * 0.25) {
		textWidth = this.m_chart.m_height * 0.25;
	}
	return textWidth;
};

Xaxis.prototype.translateTextPosition = function(m_axisLineToTextGap, i, text) {
	var labelRotation = this.getLabelrotation();
	var axisToLabelMargin = this.calculateAxisToLabelMargin(i);
	var y = this.m_startY * 1 + m_axisLineToTextGap / 2 + axisToLabelMargin * 1 + this.calculateAxisLineToTextGap() / 2 + this.m_chart.m_axistodrawingareamargin;
	switch (this.m_chart.m_type) {
		case "HeatMap":
			var barWidth = this.m_chart.getHeatMapCellWidth();
			var x = (this.m_startX) * 1 + (barWidth * i * 1 + barWidth * 1 / 2);
			var textWidth = this.getLabelTextWidth(text);
			break;
		case "Plot":
			var maxSerText = this.getMaxSeriesValue();
			var textWidth = this.getLabelTextWidth(maxSerText);
			if (this.m_xAxisData.length == 1) {
				var x = this.m_startX * 1 + (this.m_endX - this.m_startX) / 2;
			} else {
				//			var x = this.m_startX * 1 + ((this.m_endX - this.m_startX) / (this.m_xAxisData.length * 1 + 1)) * (i * 1 + 1);
				var x = this.m_startX * 1 + ((this.m_endX - this.m_startX) / (this.m_xAxisData.length * 1 - 1)) * (i * 1); // remove extra space from both side on x-axis.
			}
			break;
		default:
			var textWidth = this.getLabelTextWidth(text);
			if (this.m_xAxisData.length == 1) {
				var x = this.m_startX * 1 + (this.m_endX - this.m_startX) / 2;
			} else {
				var x = (this.m_startX) * 1 + (this.getXaxisDivison() / 2) * 1 + (this.getXaxisDivison() * i);
			}
			break;
	}
	this.translateText(labelRotation, x, y, text, textWidth);
};

Xaxis.prototype.getMaxSeriesValue = function() {
	var max = this.m_xAxisData[0];
	for (var i = 0; i < this.m_xAxisData.length; i++) {
		if (max < this.m_xAxisData[i]) {
			max = this.m_xAxisData[i];
		}
	}
	return max;
};

Xaxis.prototype.translateText = function(labelRotation, x, y, text, textWidth) {
	this.m_labeltextalign = "center";
	if (IsBoolean(this.m_chart.m_xAxis.getLabelTilted())) {
		if (labelRotation > 0 && labelRotation <= 90) {
			this.m_labeltextalign = "left";
		} else if (labelRotation < 0 && labelRotation >= -90) {
			this.m_labeltextalign = "right";
		} else {
			this.m_labeltextalign = "center";
		}

		this.ctx.translate(x, y);
	} else {
		this.ctx.translate(x, y * 1 + 10);
	}
};
Xaxis.prototype.getXDesc = function() {
	return this.m_chart.m_x * 1 + this.m_chart.m_width / 2;
};

Xaxis.prototype.getYDesc = function() {
	this.m_chart.m_chartpaddings["bottomBorderToDescription"] = (IsBoolean(this.m_chart.m_updateddesign) ? 40 :this.m_chart.m_chartpaddings["bottomBorderToDescription"]);
	var yPosition = this.m_chart.m_y * 1 + this.m_chart.m_height * 1 - this.m_fontsize - this.m_chart.m_chartpaddings.bottomBorderToDescription*1/2;
	return yPosition;
};

//**************************** YAxis **************************/
function Yaxis() {
	this.base = Axes;
	this.base();

	this.m_chart;
	this.m_chartCalculation;

	this.m_startX;
	this.m_startY;
	this.m_endX;
	this.m_endY;
	this.m_yAxisText = [];
	this.m_yAxisMarkersArray = [];
	this.m_labeltextalign = "right";
	this.m_axislinetotextgap = 5;
	this.m_showlineyaxis = "true";
	this.m_lineyaxiscolor = "";
	this.m_unitSymbol;
	this.m_textUtil = new TextUtil();
	this.m_util = new Util();
	this.m_isSecondAxisFormatter = false;
	this.ctx = "";
};

Yaxis.prototype = new Axes;

Yaxis.prototype.init = function(m_chart, chartCalculation) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.m_chartCalculation = chartCalculation;

	this.m_startX = this.m_chart.getStartX();
	this.m_startY = this.m_chart.getStartY();
	this.m_endX = this.m_chart.getEndX();
	this.m_endY = this.m_chart.getEndY();
	if (this.m_chart.m_type != "Pie" && this.m_chart.m_type != "MitoPlot" && this.m_chart.m_type != "PieDoughnut" && this.m_chart.m_type != "Funnel" && this.m_chart.m_type != "InvertedFunnel" && this.m_chart.m_type != "Pyramid" && this.m_chart.m_type != "Spider") {
		this.m_yAxisText = this.m_chartCalculation.getYAxisText();
		this.m_yAxisMarkersArray = this.m_chartCalculation.getYAxisMarkersArray();
		this.setLeftAxisFormatters();
		this.setRightAxisFormatters();
	} else {
		this.setFormatter();
		this.setSecondaryFormatter();
	}
	this.m_precision = this.m_chart.getPrecision();
	this.m_secondaryAxisPrecision = this.m_chart.getSecondaryAxisPrecision();
	this.m_isSecodaryAxis = false;
	this.m_axiscolor = convertColorToHex(this.m_chart.getAxisColor());
	this.m_lineyaxiscolor = (this.m_lineyaxiscolor !== "") ? convertColorToHex(this.m_lineyaxiscolor) : this.m_axiscolor;
	this.m_labelfontcolor = convertColorToHex(this.getLabelFontColor());
};

Yaxis.prototype.setLeftAxisFormatters = function() {
	this.m_isFormatter = false;
	this.m_isSecondaryFormatter = false;
	if (!IsBoolean(this.m_chart.getFixedLabel())) {
		if (IsBoolean(this.getLeftaxisFormater())) {
			this.setFormatter();
			this.setSecondaryFormatter();
		}
	}
};

Yaxis.prototype.setFormatter = function() {
	this.m_unitSymbol = "";
	this.m_formatterPosition = "";
	this.m_isFormatter = false;
	if (this.m_chart.m_formater != "none" && this.m_chart.m_formater != "") {
		var formatter = this.m_chart.getFormater();
		var unit = this.m_chart.getUnit();
		if (unit != "none" && unit != "") {
			this.m_isFormatter = true;
			this.m_unitSymbol = this.m_util.getFormatterSymbol(formatter, unit);
			this.m_formatterPosition = this.m_chart.getSignPosition();
			if (this.m_formatterPosition == "") {
				this.m_formatterPosition = "suffix";
			}
		}
	}
};

Yaxis.prototype.setSecondaryFormatter = function() {
	this.m_secondaryUnitSymbol = "";
	this.m_secondaryFormatterPosition = "";
	this.m_isSecondaryFormatter = false;
	//	if(this.m_chart.m_secondaryformater != "none" && this.m_chart.m_secondaryformater != "" && this.m_chart.getSecondaryUnit() != "Percent")
	if (this.m_chart.m_secondaryformater != "none" && this.m_chart.m_secondaryformater != "") {
		/** remove condition for Percent because secondary formatter is not working for % **/
		var secondaryFormatter = this.m_chart.getSecondaryFormater();
		var secondaryUnit = this.m_chart.getSecondaryUnit();
		if (secondaryUnit != "" && secondaryUnit != "none" && secondaryUnit != undefined) {
			this.m_isSecondaryFormatter = true;
			this.m_secondaryUnitSymbol = this.m_util.getFormatterSymbol(secondaryFormatter, secondaryUnit);
		}
		this.m_secondaryFormatterPosition = "suffix";
	}
};

Yaxis.prototype.setRightAxisFormatters = function() {
	if (IsBoolean(this.m_chart.m_secondaryaxisshow)) {
		if (IsBoolean(this.getRightAxisFormater())) {
			this.setSecondAxisFormatter();
			this.setSecondAxisSecondaryFormatter();
		}
	}
};

Yaxis.prototype.setSecondAxisFormatter = function() {
	this.m_secondAxisUnitSymbol = "";
	this.m_secondAxisFormatterPosition = "";
	this.m_isSecondAxisFormatter = false;
	if (this.m_chart.m_secondaryaxisformater != "none" || this.m_chart.m_secondaryaxisformater != "") {
		var secondAxisunit = this.m_chart.m_secondaryaxisunit;
		var secondAxisFormatter = this.m_chart.m_secondaryaxisformater;
		if (secondAxisunit != "none" && secondAxisunit != "") {
			this.m_isSecondAxisFormatter = true;
			this.m_secondAxisUnitSymbol = this.m_util.getFormatterSymbol(secondAxisFormatter, secondAxisunit);
			this.m_secondAxisFormatterPosition = this.m_chart.m_secondaryaxissignposition;
		}
	}
};

Yaxis.prototype.setSecondAxisSecondaryFormatter = function() {
	this.m_secondAxisSecondaryUnitSymbol = "";
	this.m_secondAxisSecondaryFormatterPosition = "";
	this.m_isSecondAxisSecondaryFormatter = false;

	if (this.m_chart.m_secondaryaxissecondaryformatter != "none" || this.m_chart.m_secondaryaxissecondaryformatter != "") {
		var secondAxisSecondaryUnit = this.m_chart.m_secondaryaxissecondaryunit;
		var secondAxisSecondaryFormatter = this.m_chart.m_secondaryaxissecondaryformatter;
		if (secondAxisSecondaryUnit != "none" && secondAxisSecondaryUnit != "") {
			this.m_isSecondAxisSecondaryFormatter = true;
			this.m_secondAxisSecondaryUnitSymbol = this.m_util.getFormatterSymbol(secondAxisSecondaryFormatter, secondAxisSecondaryUnit);
			this.m_secondAxisSecondaryFormatterPosition = "suffix";
		}
	}
};

Yaxis.prototype.drawYAxis = function() {
	if (IsBoolean(this.m_showlineyaxis)) {
		var msfy = 1;
		/** msfy = margin space from y - axis 1 px **/
		var lineWidth = 0.5;
		var antiAliasing = 0.5;
		var strokeColor = this.m_lineyaxiscolor;
		var x1 = (this.m_startX * 1 - this.m_chart.m_axistodrawingareamargin) - msfy;
		var y1 = this.m_startY * 1 + msfy * 1 + this.m_chart.m_axistodrawingareamargin;
		var x2 = (this.m_startX * 1 - this.m_chart.m_axistodrawingareamargin) - msfy;
		var y2 = this.m_endY * 1;
		this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
	}
};

Yaxis.prototype.horizontalMarkerLines = function() {
	for (var i = 0; i < this.m_yAxisMarkersArray.length; i++) {
		var lineWidth = 0.5;
		var antiAliasing = 0.5;
		var strokeColor = hex2rgb(this.m_chart.m_markercolor, this.m_chart.m_markertransparency);
		var x1 = this.m_startX * 1 - this.m_chart.m_axistodrawingareamargin;
		var y1 = this.m_startY * 1 - this.getYAxisDiv() * i;
		var x2 = this.m_endX * 1;
		var y2 = this.m_startY * 1 - this.getYAxisDiv() * i;
		this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
	}
};

Yaxis.prototype.zeroMarkerLine = function() {
	for (var i = 0; i < this.m_yAxisMarkersArray.length; i++) {
		if (this.m_yAxisMarkersArray[i] == 0) {
			var lineWidth = 0.5;
			var antiAliasing = 0.5;
			var strokeColor = hex2rgb(this.m_chart.m_zeromarkercolor, this.m_chart.m_markertransparency);
			var x1 = this.m_startX * 1 - this.m_chart.m_axistodrawingareamargin;
			var y1 = this.m_startY * 1 - this.getYAxisDiv() * i;
			var x2 = this.m_endX * 1;
			var y2 = this.m_startY * 1 - this.getYAxisDiv() * i;
			this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
			break;
		}
	}
};

Yaxis.prototype.secondAxisZeroMarkerLine = function() {
	for (var i = 0; i < this.m_yAxisMarkersArray.length; i++) {
		if (this.m_yAxisMarkersArray[i] == 0) {
			var lineWidth = 0.5;
			var antiAliasing = 0.5;
			var strokeColor = hex2rgb(this.m_chart.m_secondaxiszeromarkercolor, this.m_chart.m_markertransparency);
			var x1 = this.m_startX * 1 - this.m_chart.m_axistodrawingareamargin;
			var y1 = this.m_startY * 1 - this.getYAxisDiv() * i;
			var x2 = this.m_endX * 1;
			var y2 = this.m_startY * 1 - this.getYAxisDiv() * i;
			this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
			break;
		}
	}
};

Yaxis.prototype.markYaxis = function() {
	var checkLabelFont = parseInt(this.m_chart.m_yAxis.m_labelfontsize);
	var checkFont = parseInt(this.m_chart.m_yAxis.m_fontsize);
	if ((this.m_chart.m_type == "Bar" || this.m_chart.m_type == "bar" || this.m_chart.m_type == "Chevron" || this.m_chart.m_type == "chevron") && checkLabelFont>0) {
		this.markYaxisForBarOrChevron();
	} else {
		var plottedAxisMarkers = [];
		for (var i = 0; i < this.m_yAxisMarkersArray.length; i++) {
			var text = this.m_yAxisMarkersArray[i];
			if (!IsBoolean(this.m_chart.m_fixedlabel)) {
				if (IsBoolean(this.m_isSecodaryAxis)) {
					if (IsBoolean(this.getRightAxisFormater())){
						text = this.getSecondaryAxisFormattedText(text, this.m_secondaryAxisPrecision);
					}
				} else {
					text = this.getFormattedText(text, this.m_precision);
				}
			} else {
				text = getNumberFormattedValue(text);
			}
			plottedAxisMarkers.push(text);
		}
		if(!isUniqueArray(plottedAxisMarkers)){
			/** if the markers has the duplicates, re-set them with one precision **/
			var map = getDuplicatesFromArray(plottedAxisMarkers);
			for (var i = 0; i < this.m_yAxisMarkersArray.length; i++) {
				var text = this.m_yAxisMarkersArray[i];
				if (!IsBoolean(this.m_chart.m_fixedlabel)) {
					if (IsBoolean(this.m_isSecodaryAxis)) {
						if (IsBoolean(this.getRightAxisFormater())){
							/** returns formatted value on second y-axis markers **/
							var tempText = this.getSecondaryAxisFormattedText(text, this.m_secondaryAxisPrecision);
							if(this.m_secondaryAxisPrecision == "default" && this.m_secondAxisSecondaryUnitSymbol == "auto" && Object.keys(map).length > 0){
							/** if Same marker already exist in array, set a precision to 1 **/
								text = this.getSecondaryAxisFormattedText(text, 1);
							}else{
								text = tempText;
							}
						}
					} else {
						/** returns formatted value on y-axis markers **/
						var tempText = this.getFormattedText(text, this.m_precision);
						if(this.m_precision == "default" && this.m_secondaryUnitSymbol == "auto" && Object.keys(map).length > 0){
							/** if Same marker already exist in array, set a precision to 1 **/
							text = this.getFormattedText(text, 1);
						}else{
							text = tempText;
						}
					}
				} else {
					text = getNumberFormattedValue(text);
				}
				plottedAxisMarkers[i] = text;
			}
		}
		for(var j=0; j<plottedAxisMarkers.length; j++){
			this.m_axislinetotextgap = (IsBoolean(this.m_chart.m_updateddesign) ? 5 : this.m_axislinetotextgap);
			if(checkLabelFont>0){
				this.m_textUtil.drawText(this.ctx, plottedAxisMarkers[j], (this.m_startX * 1 - this.m_chart.m_axistodrawingareamargin) - this.m_axislinetotextgap, ((this.m_startY * 1) - (j * (this.getYAxisDiv()))), this.getLabelFontProperties(), this.m_labeltextalign, this.m_labelfontcolor);
			}
			if (this.isLabelDecoration()) {
				this.textDecoration(plottedAxisMarkers[j], (this.m_startX * 1) - this.m_axislinetotextgap, (this.m_startY * 1) - (j * (this.getYAxisDiv())), this.m_labelfontcolor, this.m_chart.fontScaling(this.getLabelFontSize()), this.m_labeltextalign);
			}
		}
	}
	if(checkFont>0){
		if (IsBoolean(this.m_isSecodaryAxis)) {
			this.drawSecondAxisDescription();
		} else {
			this.drawDescription();
		}
	}
};

Yaxis.prototype.descriptionDecoration = function(text, x, y, color, textSize, align) {
	this.ctx.beginPath();
	this.ctx.font = this.m_fontstyle + " " + this.m_fontweight + " " + this.m_fontsize + "px " + selectGlobalFont(this.m_fontfamily);
	var textWidth = this.ctx.measureText(text).width;
	this.ctx.closePath();

	var lineWidth = 0.5;
	var antiAliasing = 0.5;
	var strokeColor = color;
	var x1 = x * 1 + 2;
	var y1 = y * 1 + textWidth / 2;
	var x2 = x * 1 + 2;
	var y2 = y * 1 - textWidth / 2;
	this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
};

Yaxis.prototype.secondAxisDescriptionDecoration = function(text, x, y, color, textSize, align) {
	this.ctx.beginPath();
	this.ctx.font = this.getSecondAxisFontProperties(); //this.m_fontstyle +" "+ this.m_fontweight +" "+ this.m_fontsize +"px " + selectGlobalFont(this.m_fontfamily) ;
	var textWidth = this.ctx.measureText(text).width;
	this.ctx.closePath();

	var lineWidth = 0.5;
	var antiAliasing = 0.5;
	var strokeColor = color;
	var x1 = x * 1 + 2;
	var y1 = y * 1 + textWidth / 2;
	var x2 = x * 1 + 2;
	var y2 = y * 1 - textWidth / 2;
	this.drawLineBetweenPoints(lineWidth, antiAliasing, strokeColor, x1, y1, x2, y2);
};

Yaxis.prototype.drawDescription = function() {
	var serDec = "";
	var fontColor = convertColorToHex(this.getFontColor());
	serDec = (this.m_chart.m_componenttype === "box_plot_chart") ? this.m_chart.m_subCategoryDisplayNames.reduce(function(acc, item) { return item !== "" ? (acc === "" ? item : acc + ", " + item) : acc}, "") : (this.m_chart.m_componenttype === "candle_stick_chart") ? "Data" : this.m_chart.m_allSeriesDisplayNames.reduce(function(acc, item) { return item !== "" ? (acc === "" ? item : acc + ", " + item) : acc}, "");
	var dsDec=serDec;
	var description=(IsBoolean(this.m_chart.m_yAxis.m_showdatasetdescription)) ? this.m_chart.formattedDescription(this.m_chart, dsDec) : this.m_chart.formattedDescription(this.m_chart, this.m_description);
	if(description !== "") {
		var textAlign = "center";
		this.ctx.beginPath();
		this.ctx.save();
		this.ctx.translate(this.getXDesc(), this.getYDesc());
		this.ctx.rotate(270 * Math.PI / 180);
		this.m_textUtil.drawText(this.ctx, description, 0, 0, this.getFontProperties(), textAlign, fontColor);
		this.ctx.restore();
		if (this.isDescriptionDecoration()) {
			this.descriptionDecoration(description, (this.getXDesc() * 1 + this.m_fontsize / 2), this.getYDesc(), fontColor, this.m_chart.fontScaling(this.getFontSize()), textAlign);
		}
		this.ctx.closePath();
	}
};

Yaxis.prototype.drawSecondAxisDescription = function() {
	var totalWidth = (this.m_chart.m_x) + 1 * (this.m_chart.m_width);
	var showlegendIconWidth = (IsBoolean(this.m_chart.m_showlegends)) ? 16 : 0;
	var fontColor = convertColorToHex(this.m_chart.m_secondaxisfontcolor);
	var description = this.m_chart.formattedDescription(this.m_chart, this.m_chart.m_secondaxisdiscription);
	var textAlign = "center";
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.translate(this.getSecondXDesc(), this.getYDesc());
	this.ctx.rotate(270 * Math.PI / 180);
	this.m_textUtil.drawText(this.ctx, description, 0, 0, this.getSecondAxisFontProperties(), textAlign, fontColor);
	this.ctx.restore();
	if ((this.getSecondAxisTextDecoration()).toLowerCase() == "underline") {
		this.secondAxisDescriptionDecoration(description, this.getSecondXDesc() * 1 + this.m_chart.fontScaling(this.m_chart.m_secondaxisfontsize) / 2, this.getYDesc(), fontColor, this.m_chart.fontScaling(this.m_chart.m_secondaxisfontsize), textAlign);
	}
	this.ctx.closePath();
};

Yaxis.prototype.textDecoration = function(text, startX, startY, color, fontSize, align) {
	this.m_chart.underLine(text, startX, startY * 1 + this.m_labelfontsize / 2, color, fontSize, align);
};

Yaxis.prototype.getFormattedText = function(text, prec) {
	var precision = (prec == "undefined" || prec == undefined) ? this.m_chart.m_precision : prec;
	if (text % 1 != 0 && precision < 1) {
		text = this.setPrecision(text, 0);
	} else if (!IsBoolean(this.m_isFormatter) && !IsBoolean(this.m_isSecondaryFormatter)) {
		if (precision !== "default")
			text = this.setPrecision(text, precision);
	}
	if ((this.m_chart.m_formater == "none" || this.m_chart.m_formater == "") && (this.m_chart.m_secondaryformater == "none" || this.m_chart.m_secondaryformater == "")) {
		text = this.setPrecision(text, precision);
	}
	if (IsBoolean(this.m_isFormatter)) {
		text = this.m_util.updateTextWithFormatter(text, this.m_unitSymbol, precision);
	}
	if (IsBoolean(this.m_isSecondaryFormatter) && this.m_chart.m_secondaryformater == "Number") {
		text = this.m_util.updateTextWithFormatter(text, this.m_secondaryUnitSymbol, precision);
	}
	if (IsBoolean(this.m_isSecondaryFormatter)) {
		if (this.m_secondaryUnitSymbol != "auto") {
			if (precision != 0 && precision != null) {
				text = this.setPrecision(text, precision);
			} else if (text < 1 && text % 1 != 0) {
				text = this.setPrecision(text, 2);
			}
			text = (text%1 === 0 && this.m_precision === "default") ? (text*1) : text;
			text = this.addSecondaryFormater(text, this.m_secondaryUnitSymbol);
		} else {
			var symbol = getNumberFormattedSymbol(text * 1 , this.m_chart.m_unit);
			var val = getNumberFormattedNumericValue(text * 1, precision, this.m_chart.m_unit);
			text = this.setPrecision(val, precision);
			if (precision != 0 && precision != null) {
				text = this.setPrecision(text, precision);
			} else if (text < 1 && text % 1 != 0) {
				text = this.setPrecision(text, 2);
			}
			text = (text%1 === 0 && this.m_precision === "default") ? (text*1) : text;
			text = this.addSecondaryFormater(text, symbol);
		}
	}

	text = getFormattedNumberWithCommas(text, this.m_chart.m_numberformatter);
	if (IsBoolean(this.m_isFormatter) && this.m_unitSymbol != undefined) {
		text = this.m_util.addFormatter(text, this.m_unitSymbol, this.m_formatterPosition, precision);
	}
	return text;
};

Yaxis.prototype.getSecondaryAxisFormattedText = function(text, prec) {
	var prec = (prec !== undefined) ? prec : this.m_secondaryAxisPrecision;
	if (text % 1 != 0 && prec < 1) {
		text = this.setPrecision(text, 0);
	} else if (!IsBoolean(this.m_isSecondAxisFormatter) && !IsBoolean(this.m_isSecondAxisSecondaryFormatter)) {
		if (prec !== "default")
			text = this.setPrecision(text, prec);
	}
	if ((this.m_chart.m_secondaryaxisformater == "none" || this.m_chart.m_secondaryaxisformater == "") && (this.m_chart.m_secondaryaxissecondaryformatter == "none" || this.m_chart.m_secondaryaxissecondaryformatter == "")) {
		text = this.setPrecision(text, prec);
	}
	if (IsBoolean(this.m_isSecondAxisFormatter)) {
		text = this.m_util.updateTextWithFormatter(text, this.m_secondAxisUnitSymbol, prec);
	}
	if (IsBoolean(this.m_isSecondAxisSecondaryFormatter) && this.m_chart.m_secondaryaxissecondaryformatter == "Number") {
		text = this.m_util.updateTextWithFormatter(text, this.m_secondAxisSecondaryUnitSymbol, prec);
	}
	if (IsBoolean(this.m_isSecondAxisSecondaryFormatter)) {
		if (this.m_secondAxisSecondaryUnitSymbol != "auto") {
			if (prec != 0 && prec != null) {
				text = this.setPrecision(text, prec);
			} else if (text < 1 && text % 1 != 0) {
				text = this.setPrecision(text, 2);
			}
			text = (text%1 === 0 && this.m_secondaryAxisPrecision === "default") ? (text*1) : text;
			text = this.addSecondAxisSecondaryFormater(text, this.m_secondAxisSecondaryUnitSymbol);
		} else {
			var symbol = getNumberFormattedSymbol(text * 1, this.m_chart.m_secondaryaxisunit);
			var val = getNumberFormattedNumericValue(text * 1, prec, this.m_chart.m_secondaryaxisunit);
			text = this.setPrecision(val, prec);
			if (prec != 0 && prec != null) {
				text = this.setPrecision(text, prec);
			} else if (text < 1 && text % 1 != 0) {
				text = this.setPrecision(text, 2);
			}
			text = (text%1 === 0 && this.m_secondaryAxisPrecision === "default") ? (text*1) : text;
			text = this.addSecondAxisSecondaryFormater(text, symbol);
		}
	}

	text = getFormattedNumberWithCommas(text, this.m_chart.m_secondaryaxisnumberformatter);
	if (IsBoolean(this.m_isSecondAxisFormatter) && this.m_secondAxisUnitSymbol != undefined) {
		text = this.m_util.addFormatter(text, this.m_secondAxisUnitSymbol, this.m_secondAxisFormatterPosition, this.m_secondaryAxisPrecision);
	}
	return text;
};
/** @description return true if axisMarkerLine Array has negative axis value*/
Yaxis.prototype.hasNegativeAxisMarker = function (axisMarkerArray) {
	var isNegative = false;
	if (Array.isArray(axisMarkerArray) && axisMarkerArray.length > 0) {
		var value = Math.min.apply(null, axisMarkerArray);
		if (value < 0)
			isNegative = true;
	}
	return isNegative;
};
Yaxis.prototype.setPrecision = function(text, precision) {
	if (text !== 0) {
		if (precision !== "default") {
			return (text * 1).toFixed(precision);
		} else {
			return (text * 1);
		}
	} else {
		return (text * 1);
	}
};

Yaxis.prototype.addSecondaryFormater = function(text, secondaryUnitSymbol) {
	var textValue = text;
	var formattedText = this.getSecondaryFormaterAddedText(textValue, secondaryUnitSymbol);
	return formattedText.toString();
};
Yaxis.prototype.getSecondaryFormaterAddedText = function(textValue, secondaryUnitSymbol) {
	var formattedText = textValue;
	try {
		eval("var formattedText = this.m_util.addUnitAs" + this.m_secondaryFormatterPosition + "(textValue,secondaryUnitSymbol);");
	} catch (e) {
		return formattedText;
	}
	return formattedText;
};

Yaxis.prototype.addSecondAxisSecondaryFormater = function(text, secondAxisSecondaryUnitSymbol) {
	var textValue = text;
	try {
		eval("var formattedText = this.m_util.addUnitAs" + this.m_secondAxisSecondaryFormatterPosition + "(textValue,secondAxisSecondaryUnitSymbol);");
	} catch (e) {
		return formattedText.toString();
	}
	return formattedText.toString();
};
Yaxis.prototype.markYaxisForBarOrChevron = function() {
	this.m_axislinetotextgap = (IsBoolean(this.m_chart.m_updateddesign) ? 15 : this.m_axislinetotextgap);
	for (var i = 0; i < this.m_yAxisText.length; i++) {
		var startY = (1 * (this.m_startY) - 1 * (this.m_chart.m_barGap) * (1 * (i) + 1) - this.m_chart.m_barWidth * 1 * (i) - 1 * (this.m_chart.m_barWidth) / 2 + 5);
		var text = this.getText("" + this.m_yAxisText[i], this.m_chart.m_width / 4, this.getLabelFontProperties());
		this.m_textUtil.drawText(this.ctx, text, 1 * (this.m_startX) - this.m_axislinetotextgap, startY - 4, this.getLabelFontProperties(), this.m_labeltextalign, this.m_labelfontcolor);
		if (this.isLabelDecoration()) {
			this.textDecoration(text, this.m_startX, startY - 3, this.m_labelfontcolor, this.m_chart.fontScaling(this.getLabelFontSize()), this.m_labeltextalign);
		}
	}
};

Yaxis.prototype.getSecondAxisFontProperties = function() {
	return this.m_textUtil.getFontProperties(this.getSecondAxisFontStyle(), this.getSecondAxisFontWeight(), this.m_chart.fontScaling(this.getSecondAxisFontSize()), this.getSecondAxisFontFamily() );
};

Yaxis.prototype.getFontProperties = function() {
	return this.m_textUtil.getFontProperties(this.getFontStyle(), this.getFontWeight(), this.m_chart.fontScaling(this.getFontSize()), this.getFontFamily());
};

Yaxis.prototype.getLabelFontProperties = function() {
	return this.m_textUtil.getFontProperties(this.getLabelFontStyle(), this.getLabelFontWeight(), this.m_chart.fontScaling(this.getLabelFontSize()), this.getLabelFontFamily());
};

Yaxis.prototype.getYAxisDiv = function() {
	return (this.m_startY - this.m_endY) / (this.m_yAxisMarkersArray.length - 1);
};

Yaxis.prototype.getSecondXDesc = function() {
	return (this.m_chart.m_x * 1 + this.m_chart.m_width * 1 - this.m_chart.m_spaceForSecondAxisDec - this.m_chart.fontScaling(this.m_chart.m_secondaxisfontsize) * 1 + 2);
};

Yaxis.prototype.getXDesc = function() {
	return (this.m_chart.m_x * 1) + (this.m_chart.fontScaling(this.getFontSize()) * 1) + this.m_chart.m_chartpaddings.leftBorderToDescription*1/2;
};

Yaxis.prototype.getYDesc = function() {
	return this.m_startY - (this.m_startY - this.m_endY) / 2;
};

Yaxis.prototype.formatToCurrency = function(num) {
	num = num.toString().replace(/\$|\,/g, "");
	if (isNaN(num))
		num = "0";
	var sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * 100 + 0.50000000001);
	var cents = num % 100;
	num = Math.floor(num / 100).toString();
	if (cents < 10) {
		cents = "0" + cents;
	}
	for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
		num = num.substring(0, num.length - (4 * i + 3)) + "," + num.substring(num.length - (4 * i + 3));
	}
	if (cents > 0) {
		return (((sign) ? "" : "-") + "$ " + num + "." + cents);
	} else {
		return (((sign) ? "" : "-") + "$ " + num);
	}
};

Yaxis.prototype.secondaryAxisInit = function(mixedCalculation) {
	this.m_chartCalculation = mixedCalculation;
	this.m_yAxisText = this.m_chart.rightAxisInfo.markertext;
	this.m_yAxisMarkersArray = this.m_chart.rightAxisInfo.markerarray;
};

Yaxis.prototype.drawSecondaryAxis = function(lineCalculation) {
	if (IsBoolean(this.m_chart.m_showmarkerline) && this.m_chart.leftAxisInfo.markerarray == "") {
		this.horizontalMarkerLines();
	}
	if (IsBoolean(this.m_chart.m_secondaxiszeromarkerline) && !IsBoolean(this.m_chart.m_secondaxisbasezero) && IsBoolean(this.hasNegativeAxisMarker(this.m_yAxisMarkersArray))) {
		this.secondAxisZeroMarkerLine();
	}
	var temp_startX = this.m_startX;
	this.m_startX = this.m_endX;
	this.drawYAxis();

	this.m_isSecodaryAxis = true;
	this.m_labeltextalign = "left";
	this.m_startX = this.m_endX * 1 + 10;
	this.markYaxis();

	this.m_labeltextalign = "right";
	this.m_startX = temp_startX;
};

/*********************************** Layer Calculation for Funnels ********************************/
function LayerCalculation() {
	this.m_chartRef;
}

LayerCalculation.prototype.init = function(chartRef) {
	this.m_chartRef = chartRef;
};

LayerCalculation.prototype.getFunnelHeight = function() {
	this.funnelHeight = this.m_chartRef.m_height - this.m_chartRef.getMarginForTitle() - this.m_chartRef.getMarginForSubTitle() - this.m_chartRef.m_height / 20;
	return this.funnelHeight;
};

LayerCalculation.prototype.getAbsSum = function(arr) {
	var sum = 0;
	for (var i = 0; i < arr.length; i++) {
		var val = getNumericComparableValue(arr[i]);
		if (!isNaN(val))
			sum += Math.abs(val * 1);
	}
	return sum;
};

LayerCalculation.prototype.updatedSeriesValue = function(seriesValue) {
	var totalSeriesvalue = this.getAbsSum(seriesValue);
	if (this.m_chartRef.m_charttype == "identicalStack") {
		var ratio = (this.m_chartRef.funnelHeight - (this.m_chartRef.sliceGap * seriesValue.length)) / seriesValue.length;

		var updatedSeriesValue = [];
		for (var i = 0; i < seriesValue.length; i++) {
			updatedSeriesValue[i] = Math.abs(ratio);
		}
	} else {
		ratio = (this.m_chartRef.funnelHeight - (this.m_chartRef.sliceGap * seriesValue.length)) / totalSeriesvalue;

		var updatedSeriesValue = [];
		for (var i = 0; i < seriesValue.length; i++) {
			updatedSeriesValue[i] = Math.abs(seriesValue[i] * 1) * ratio;
		}
	}
	
	return updatedSeriesValue;
};

LayerCalculation.prototype.updatedSeriesValueForPyramid = function(seriesValue) {
	var totalSeriesvalue = this.getAbsSum(seriesValue);
	ratio = (this.m_chartRef.funnelHeight) / totalSeriesvalue;

	var updatedSeriesValue = [];
	for (var i = 0; i < seriesValue.length; i++) {
		updatedSeriesValue[i] = Math.abs(seriesValue[i] * 1) * ratio;
	}
	return updatedSeriesValue;
};

LayerCalculation.prototype.calculateXPosition = function(seriesValue) {
	var totalSeriesvalue = this.getAbsSum(seriesValue);
	ratio = (this.m_chartRef.funnelWidth) / totalSeriesvalue;

	var calculateXPosition = [];
	calculateXPosition[-1] = 0;
	for (var i = 0; i < seriesValue.length; i++) {
		var temp = (Math.abs(seriesValue[i * 1]) * ratio) / 2;
		calculateXPosition[i] = calculateXPosition[i - 1] * 1 + 1 * temp;
	}
	return calculateXPosition;
};

LayerCalculation.prototype.getCalculatePercent = function(seriesValue) {
	var totalSeriesvalue = this.getAbsSum(seriesValue);
	var calculatePercent = [];
	for (var i = 0; i < seriesValue.length; i++) {
		var val = getNumericComparableValue(seriesValue[i]);
		var percent = (!isNaN(val * 100 / totalSeriesvalue)) ? val * 100 / totalSeriesvalue : 0;
		calculatePercent[i] = Math.abs(percent).toFixed(2);
	}
	return calculatePercent;
};

LayerCalculation.prototype.sliceSpace = function(seriesValue) {
	var space = (10 * this.funnelHeight) / (100 * seriesValue.length); // (10% of total height)/length of the layer;
	return space;
};

LayerCalculation.prototype.angle = function() {
	var angle = Math.atan(this.funnelHeight / (this.m_chartRef.funnelWidth / 2));
	return angle;
};

/*********************************** Layer ************************************/
function Layer() {
	this.ctx = "";
	this.m_strokecolor = "#FFFFFF";
};

Layer.prototype.init = function(chartRef) {
	this.m_chartRef = chartRef;
	this.ctx = this.m_chartRef.ctx;
};

Layer.prototype.draw = function() {};

Layer.prototype.drawTriangle = function() {
	this.x = (this.m_chartRef.m_type == "Funnel") ? 1 : -1;
	this.ctx.beginPath();
	this.ctx.moveTo(this.m_chartRef.startX, this.m_chartRef.startY);
	this.ctx.lineTo(this.m_chartRef.startX + this.m_chartRef.funnelWidth / 2, this.m_chartRef.startY - this.x * this.m_chartRef.funnelHeight);
	this.ctx.lineTo(this.m_chartRef.startX - this.m_chartRef.funnelWidth / 2, this.m_chartRef.startY - this.x * this.m_chartRef.funnelHeight);
	this.ctx.lineTo(this.m_chartRef.startX, this.m_chartRef.startY);
	this.ctx.strokeStyle = this.m_strokecolor;
	this.ctx.stroke();
	this.ctx.closePath();
};

Layer.prototype.drawFirstSlice = function(i, seriesValue, color, perArray, opacity) {
	/** drawing a triangle **/
	this.seriesValue = seriesValue;
	var xValue = this.seriesValue / Math.tan(this.m_chartRef.angle);
	this.percentArr = perArray;
	this.x = (this.m_chartRef.m_type == "Funnel") ? 1 : -1;
	var previousValue = 0;
	var currentValue = 0;
	var yAxisArr = [];
	this.x = (this.m_chartRef.m_type == "Funnel") ? 1 : -1;
	for (var j = i; j < this.percentArr.length; j++) {
		for (var k = 0; k < this.percentArr[j].length; k++) {
			var newval = (this.percentArr[j][k] / 100) * (this.seriesValue);
			previousValue = currentValue;
			currentValue = previousValue + newval;

			if (k == 0) {
				this.ctx.beginPath();
				this.ctx.moveTo(this.m_chartRef.startX, this.m_chartRef.startY);
				this.ctx.lineTo(this.m_chartRef.startX - currentValue / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * currentValue); // reduce x in the left direction
				this.ctx.lineTo(this.m_chartRef.startX * 1 + currentValue / Math.tan(this.m_chartRef.angle) * 1, this.m_chartRef.startY - this.x * currentValue); // upgrade x in the right direction
				this.ctx.lineTo(this.m_chartRef.startX, this.m_chartRef.startY);
				this.ctx.fillStyle = (hex2rgb(color[0], opacity[k]));
				this.ctx.fill();
				this.ctx.strokeStyle = color[0];
				//this.ctx.stroke();
				this.ctx.closePath();
			} else {
				this.ctx.moveTo(this.m_chartRef.startX - (previousValue) / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * previousValue);
				this.ctx.lineTo(this.m_chartRef.startX - currentValue / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * currentValue); // reduce x in the left direction
				this.ctx.lineTo(this.m_chartRef.startX + currentValue / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * currentValue); // upgrade x in the right direction
				this.ctx.lineTo(this.m_chartRef.startX + (previousValue) / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * previousValue); // end point of the other slices
				this.ctx.lineTo(this.m_chartRef.startX - (previousValue) / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * previousValue); // end point of the other slices
				this.ctx.fillStyle = hex2rgb(color[0], opacity[k]);
				this.ctx.fill();
				this.ctx.strokeStyle = color[0];
				//this.ctx.stroke();
				this.ctx.closePath();

			}
			if (k != this.percentArr[j].length - 1) {
				this.ctx.beginPath();
				this.ctx.moveTo(this.m_chartRef.startX - (currentValue) / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * currentValue);
				this.ctx.lineTo(this.m_chartRef.startX * 1 + (currentValue) / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * currentValue);
				this.ctx.strokeStyle = "#ffffff";
				this.ctx.stroke();
				this.ctx.closePath();
			}

			yAxisArr[k] = (this.m_chartRef.startY - this.x * currentValue); //// yAxis lines coordinates  
		}
		this.m_chartRef.yPos.push(yAxisArr);
		break;
	}

	/** storing XYWH of each layer **/
	this.m_chartRef.m_layerXpositionArray.push((this.m_chartRef.startX - xValue));
	var yPos = (this.m_chartRef.m_type == "Funnel") ? this.m_chartRef.startY - this.x * this.seriesValue : this.m_chartRef.startY;
	this.m_chartRef.m_layerYpositionArray.push(yPos);

	this.m_chartRef.m_layerWidthArray.push(2 * xValue);
	this.m_chartRef.m_layerHeightArray.push(this.seriesValue);

	var rightX1 = this.m_chartRef.startX;
	var rightX2 = this.m_chartRef.startX * 1 + xValue * 1;
	var rightXposition = (rightX1 + rightX2) / 2;
	var leftX1 = this.m_chartRef.startX;
	var leftX2 = this.m_chartRef.startX * 1 - xValue * 1;
	var leftXposition = (leftX1 + leftX2) / 2;

	this.m_chartRef.m_layerXLeftpositionArray.push(leftXposition);
	this.m_chartRef.m_layerXRightpositionArray.push(rightXposition);
};

Layer.prototype.drawFirstSliceOfIdenticalStackFunnel = function(i, seriesValue, color, perArray, opacity) {
	/** drawing a triangle **/
	this.seriesValue = seriesValue;
	var xValue = this.seriesValue / Math.tan(this.m_chartRef.angle);
	this.percentArr = perArray;
	this.x = (this.m_chartRef.m_type == "Funnel") ? 1 : -1;
	var previousValue = 0;
	var currentValue = 0;
	var yAxisArr = [];
	var radius = 2;
	this.x = (this.m_chartRef.m_type == "Funnel") ? 1 : -1;
	for (var j = i; j < this.percentArr.length; j++) {
		for (var k = 0; k < this.percentArr[j].length; k++) {
			var newval = (this.percentArr[j][k] / 100) * (this.seriesValue);
			previousValue = currentValue;
			currentValue = previousValue + newval;

			if (k == 0) {
				this.ctx.beginPath();
				this.ctx.moveTo(this.m_chartRef.startX + radius, this.m_chartRef.startY + radius);
				this.ctx.quadraticCurveTo(this.m_chartRef.startX + radius, this.m_chartRef.startY + radius, this.m_chartRef.startX , this.m_chartRef.startY+radius);
				this.ctx.lineTo(this.m_chartRef.startX - currentValue / Math.tan(this.m_chartRef.angle), (this.m_chartRef.startY - this.x * currentValue)-radius); // reduce x in the left direction
				this.ctx.quadraticCurveTo(this.m_chartRef.startX - currentValue / Math.tan(this.m_chartRef.angle) , (this.m_chartRef.startY - this.x * currentValue), this.m_chartRef.startX - currentValue / Math.tan(this.m_chartRef.angle) + radius, (this.m_chartRef.startY - this.x * currentValue));
				this.ctx.lineTo((this.m_chartRef.startX * 1 + currentValue / Math.tan(this.m_chartRef.angle) * 1) - radius, this.m_chartRef.startY - this.x * currentValue); // upgrade x in the right direction
				this.ctx.quadraticCurveTo((this.m_chartRef.startX * 1 + currentValue / Math.tan(this.m_chartRef.angle) * 1) + radius ,  this.m_chartRef.startY - this.x * currentValue, (this.m_chartRef.startX * 1 + currentValue / Math.tan(this.m_chartRef.angle) * 1)+radius, (this.m_chartRef.startY - this.x * currentValue)-radius);
				this.ctx.lineTo(this.m_chartRef.startX + radius, this.m_chartRef.startY + radius);
				this.ctx.fillStyle = (hex2rgb(color[0], opacity[k]));
				this.ctx.fill();
				this.ctx.strokeStyle = color[0];
				this.ctx.stroke();
				this.ctx.closePath();
			} else {
				this.ctx.moveTo(this.m_chartRef.startX - (previousValue) / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * previousValue);
				this.ctx.lineTo(this.m_chartRef.startX - currentValue / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * currentValue); // reduce x in the left direction
				this.ctx.lineTo(this.m_chartRef.startX + currentValue / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * currentValue); // upgrade x in the right direction
				this.ctx.lineTo(this.m_chartRef.startX + (previousValue) / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * previousValue); // end point of the other slices
				this.ctx.lineTo(this.m_chartRef.startX - (previousValue) / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * previousValue); // end point of the other slices
				this.ctx.fillStyle = hex2rgb(color[0], opacity[k]);
				this.ctx.fill();
				this.ctx.strokeStyle = color[0];
				this.ctx.stroke();
				this.ctx.closePath();

			}
			if (k != this.percentArr[j].length - 1) {
				this.ctx.beginPath();
				this.ctx.moveTo(this.m_chartRef.startX - (currentValue) / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * currentValue);
				this.ctx.lineTo(this.m_chartRef.startX * 1 + (currentValue) / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * currentValue);
				this.ctx.strokeStyle = "#ffffff";
				this.ctx.stroke();
				this.ctx.closePath();
			}

			yAxisArr[k] = (this.m_chartRef.startY - this.x * currentValue); //// yAxis lines coordinates  
		}
		this.m_chartRef.yPos.push(yAxisArr);
		break;
	}

	/** storing XYWH of each layer **/
	this.m_chartRef.m_layerXpositionArray.push((this.m_chartRef.startX - xValue));
	var yPos = (this.m_chartRef.m_type == "Funnel") ? this.m_chartRef.startY - this.x * this.seriesValue : this.m_chartRef.startY;
	this.m_chartRef.m_layerYpositionArray.push(yPos);

	var width = ((this.m_chartRef.startX * 1 + currentValue / Math.tan(this.m_chartRef.angle) * 1)/2) -((this.m_chartRef.startX - currentValue / Math.tan(this.m_chartRef.angle)*1)/2) ; 
	this.m_chartRef.m_layerWidthArray.push(width);
	this.m_chartRef.m_layerHeightArray.push(this.seriesValue);

	var rightX1 = this.m_chartRef.startX;
	var rightX2 = this.m_chartRef.startX * 1 + xValue * 1;
	var rightXposition = (rightX1 + rightX2) / 2;
	var leftX1 = this.m_chartRef.startX;
	var leftX2 = this.m_chartRef.startX * 1 - xValue * 1;
	var leftXposition = (leftX1 + leftX2) / 2;

	this.m_chartRef.m_layerXCenterpositionArray.push(this.m_chartRef.startX);
	this.m_chartRef.m_layerXLeftpositionArray.push(leftXposition);
	this.m_chartRef.m_layerXRightpositionArray.push(rightXposition);
};

Layer.prototype.drawOtherSlices = function(i, value1, value2, color, perArray, opacity) {
	/** drawing a retangle **/
	this.value1 = value1; //perviousValue of seriesData
	this.value2 = value2; //currentValue of seriesData
	this.x = (this.m_chartRef.m_type == "Funnel") ? 1 : -1;
	this.percentArr = perArray;
	var yAxisArr = [];
	var previousValue = 0;
	var currentValue = 0;
	for (var j = i; j < this.percentArr.length; j++) {
		var sum = 0;
		for (var k = 0; k < this.percentArr[j].length; k++) {
			var newval = (this.percentArr[j][k] / 100) * (this.value2 - (this.value1 + this.m_chartRef.sliceGap * 1));
			previousValue = (k == 0) ? (this.value1 + this.m_chartRef.sliceGap * 1 + currentValue) : currentValue;
			currentValue = previousValue + newval;

			this.ctx.beginPath();
			this.ctx.moveTo(this.m_chartRef.startX - (previousValue) / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * previousValue); // starting point of the other slices
			this.ctx.lineTo(this.m_chartRef.startX - currentValue / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * currentValue); // reduce x in the left direction
			this.ctx.lineTo(this.m_chartRef.startX + currentValue / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * currentValue); // upgrade x in the right direction
			this.ctx.lineTo(this.m_chartRef.startX + (previousValue) / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * previousValue); // end point of the other slices
			this.ctx.lineTo(this.m_chartRef.startX - (previousValue) / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * previousValue); // end point of the other slices
			this.ctx.fillStyle = hex2rgb(color[0], opacity[k]);
			this.ctx.fill();
			this.ctx.strokeStyle = color[0];
			//this.ctx.stroke();
			this.ctx.closePath();
			if (k != this.percentArr[j].length - 1) {
				this.ctx.beginPath();
				this.ctx.moveTo(this.m_chartRef.startX - (currentValue * 1) / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * currentValue); // starting point of the other slices
				this.ctx.lineTo(this.m_chartRef.startX + (currentValue * 1) / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * currentValue); // upgrade x in the right direction
				this.ctx.strokeStyle = "#ffffff";
				this.ctx.stroke();
				this.ctx.closePath();
			}

			yAxisArr[k] = (this.m_chartRef.startY - this.x * currentValue); // yAxis lines coordinates  
		}
		this.m_chartRef.yPos.push(yAxisArr);
		break;
	}

	/** storing XYWH of each layer. **/
	this.m_chartRef.m_layerXpositionArray.push((this.m_chartRef.startX - this.value2 / Math.tan(this.m_chartRef.angle)));

	var yPos = (this.m_chartRef.m_type == "Funnel") ? this.m_chartRef.startY - this.x * this.value2 : this.m_chartRef.startY - this.x * (this.value1 * 1 + this.m_chartRef.sliceGap * 1);
	this.m_chartRef.m_layerYpositionArray.push(yPos);

	this.m_chartRef.m_layerWidthArray.push(2 * this.value2 / Math.tan(this.m_chartRef.angle));
	this.m_chartRef.m_layerHeightArray.push(this.value1);

	var rightX1 = this.m_chartRef.startX + this.value2 / Math.tan(this.m_chartRef.angle);
	var rightX2 = this.m_chartRef.startX + (this.value1 + this.m_chartRef.sliceGap) / Math.tan(this.m_chartRef.angle);
	var rightXposition = (rightX1 + rightX2) / 2;
	var leftX1 = this.m_chartRef.startX - (this.value1 + this.m_chartRef.sliceGap) / Math.tan(this.m_chartRef.angle);
	var leftX2 = this.m_chartRef.startX - this.value2 / Math.tan(this.m_chartRef.angle);
	var leftXposition = (leftX1 + leftX2) / 2;

	this.m_chartRef.m_layerXLeftpositionArray.push(leftXposition);
	this.m_chartRef.m_layerXRightpositionArray.push(rightXposition);
};

Layer.prototype.drawOtherSlicesOfIdenticalStackFunnel = function(i, value1, value2, color, perArray, opacity) {
	/** drawing a retangle **/
	this.value1 = value1; //perviousValue of seriesData
	this.value2 = value2; //currentValue of seriesData
	this.x = (this.m_chartRef.m_type == "Funnel") ? 1 : -1;
	this.percentArr = perArray;
	var yAxisArr = [];
	var previousValue = 0;
	var currentValue = 0;
	var radius = 2;
	for (var j = i; j < this.percentArr.length; j++) {
		var sum = 0;
		for (var k = 0; k < this.percentArr[j].length; k++) {
			var newval = (this.percentArr[j][k] / 100) * (this.value2 - (this.value1 + this.m_chartRef.sliceGap * 1));
			previousValue = (k == 0) ? (this.value1 + this.m_chartRef.sliceGap * 1 + currentValue) : currentValue;
			currentValue = previousValue + newval;

			this.ctx.beginPath();
			this.ctx.moveTo((this.m_chartRef.startX - (previousValue) / Math.tan(this.m_chartRef.angle)) + radius, this.m_chartRef.startY - this.x * previousValue); // starting point of the other slices
			this.ctx.quadraticCurveTo(this.m_chartRef.startX - (previousValue) / Math.tan(this.m_chartRef.angle) + radius,  this.m_chartRef.startY - this.x * previousValue, this.m_chartRef.startX - (previousValue) / Math.tan(this.m_chartRef.angle) , (this.m_chartRef.startY - this.x * previousValue) + radius);
			this.ctx.lineTo(this.m_chartRef.startX - currentValue / Math.tan(this.m_chartRef.angle), (this.m_chartRef.startY - this.x * currentValue) - radius); // reduce x in the left direction
			this.ctx.quadraticCurveTo(this.m_chartRef.startX - currentValue / Math.tan(this.m_chartRef.angle) ,  (this.m_chartRef.startY - this.x * currentValue), (this.m_chartRef.startX - currentValue / Math.tan(this.m_chartRef.angle)) + radius,  (this.m_chartRef.startY - this.x * currentValue));
			this.ctx.lineTo((this.m_chartRef.startX + currentValue / Math.tan(this.m_chartRef.angle)) - radius , this.m_chartRef.startY - this.x * currentValue); // upgrade x in the right direction
			this.ctx.quadraticCurveTo((this.m_chartRef.startX + currentValue / Math.tan(this.m_chartRef.angle)) + radius ,  this.m_chartRef.startY - this.x * currentValue, (this.m_chartRef.startX + currentValue / Math.tan(this.m_chartRef.angle)) + radius, (this.m_chartRef.startY - this.x * currentValue) - radius);
			this.ctx.lineTo((this.m_chartRef.startX + (previousValue) / Math.tan(this.m_chartRef.angle)) + radius, (this.m_chartRef.startY - this.x * previousValue) + radius); // end point of the other slices
			this.ctx.quadraticCurveTo((this.m_chartRef.startX + (previousValue) / Math.tan(this.m_chartRef.angle)), (this.m_chartRef.startY - this.x * previousValue), (this.m_chartRef.startX + (previousValue) / Math.tan(this.m_chartRef.angle)) - radius, (this.m_chartRef.startY - this.x * previousValue));
			this.ctx.lineTo((this.m_chartRef.startX - (previousValue) / Math.tan(this.m_chartRef.angle)) + radius, this.m_chartRef.startY - this.x * previousValue); // end point of the other slices
			this.ctx.fillStyle = hex2rgb(color[0], opacity[k]);
			this.ctx.fill();
			this.ctx.strokeStyle = color[0];
			this.ctx.stroke();
			this.ctx.closePath();
			if (k != this.percentArr[j].length - 1) {
				this.ctx.beginPath();
				this.ctx.moveTo(this.m_chartRef.startX - (currentValue * 1) / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * currentValue); // starting point of the other slices
				this.ctx.lineTo(this.m_chartRef.startX + (currentValue * 1) / Math.tan(this.m_chartRef.angle), this.m_chartRef.startY - this.x * currentValue); // upgrade x in the right direction
				this.ctx.strokeStyle = "#ffffff";
				this.ctx.stroke();
				this.ctx.closePath();
			}

			yAxisArr[k] = (this.m_chartRef.startY - this.x * currentValue); // yAxis lines coordinates  
		}
		this.m_chartRef.yPos.push(yAxisArr);
		break;
	}

	/** storing XYWH of each layer. **/
	this.m_chartRef.m_layerXpositionArray.push((this.m_chartRef.startX - this.value2 / Math.tan(this.m_chartRef.angle)));

	var yPos = (this.m_chartRef.m_type == "Funnel") ? this.m_chartRef.startY - this.x * this.value2 : this.m_chartRef.startY - this.x * (this.value1 * 1 + this.m_chartRef.sliceGap * 1);
	this.m_chartRef.m_layerYpositionArray.push(yPos);
	
	var width = (this.m_chartRef.startX + (previousValue) / Math.tan(this.m_chartRef.angle)) - (this.m_chartRef.startX - (previousValue) / Math.tan(this.m_chartRef.angle));
	this.m_chartRef.m_layerWidthArray.push(width);
	this.m_chartRef.m_layerHeightArray.push(this.value1);

	var rightX1 = this.m_chartRef.startX + this.value2 / Math.tan(this.m_chartRef.angle);
	var rightX2 = this.m_chartRef.startX + (this.value1 + this.m_chartRef.sliceGap) / Math.tan(this.m_chartRef.angle);
	var rightXposition = (rightX1 + rightX2) / 2;
	var leftX1 = this.m_chartRef.startX - (this.value1 + this.m_chartRef.sliceGap) / Math.tan(this.m_chartRef.angle);
	var leftX2 = this.m_chartRef.startX - this.value2 / Math.tan(this.m_chartRef.angle);
	var leftXposition = (leftX1 + leftX2) / 2;
	
	this.m_chartRef.m_layerXCenterpositionArray.push(this.m_chartRef.startX);
	this.m_chartRef.m_layerXLeftpositionArray.push(leftXposition);
	this.m_chartRef.m_layerXRightpositionArray.push(rightXposition);
};

Layer.prototype.drawLowerHalfEllipse = function(centerX, centerY, width, height, color, index) {
	height = (index == "0") ? 2 : height;
	this.x = (this.m_chartRef.m_type == "Funnel") ? 1 : -1;

	this.ctx.beginPath();
	this.ctx.moveTo(centerX - width / 2, centerY); // A1

	this.ctx.bezierCurveTo(
		centerX - width / 2, centerY + this.x * height / 2, // C1
		centerX + width / 2, centerY + this.x * height / 2, // C2
		centerX + width / 2, centerY); // A2
	this.ctx.lineWidth = 2;
	this.ctx.strokeStyle = color[0]; //"white";
	this.ctx.stroke();
	this.ctx.fillStyle = color[0]; //"white"
	this.ctx.fill();
	this.ctx.closePath();
};

Layer.prototype.drawEllipse = function(centerX, centerY, width, height, color, index, seriesData) {
	height = (index == "0") ? 2 : height;
	this.ctx.beginPath();
	this.ctx.moveTo(centerX - width / 2, centerY); // A1

	this.ctx.bezierCurveTo(
		centerX - width / 2, centerY - height / 2, // C1
		centerX + width / 2, centerY - height / 2, // C2
		centerX + width / 2, centerY); // A2

	this.ctx.bezierCurveTo(
		centerX + width / 2, centerY + height / 2, // C3
		centerX - width / 2, centerY + height / 2, // C4
		centerX - width / 2, centerY); // A1

	this.ctx.strokeStyle = this.m_strokecolor;
	this.ctx.stroke();
	this.ctx.fillStyle = this.m_strokecolor;
	this.ctx.fill();
	if (index == (seriesData.length - 1)) {
		this.ctx.strokeStyle = hex2rgb(color[0], 0.6);
		this.ctx.stroke();
		this.ctx.fillStyle = color[0];
		this.ctx.fill();
	}
	this.ctx.closePath();
};

Layer.prototype.createGradient = function(layerColor, x, y1, width, y2) {
	var grd = this.ctx.createLinearGradient(x, y1, parseInt(x) + parseInt(width), y2);

	var color0 = hex2rgb(layerColor, 0.6);
	var color = hex2rgb("#000000", 1);
	grd.addColorStop(0, layerColor);
	grd.addColorStop(0.3, layerColor);
	grd.addColorStop(0.5, color0);
	grd.addColorStop(0.7, layerColor);
	grd.addColorStop(1, layerColor);

	return grd;
};

Layer.prototype.drawFirstSlicePyramid = function(i, seriesValue, color, xPossitionValue, percentArray, opacity) {
	this.seriesValue = seriesValue;
	var seriesValue_25p = (this.seriesValue * 1) / 4;
	this.percentArr = percentArray;
	for (var j = i; j < this.percentArr.length; j++) {
		var currentXposValue = 0;
		var previousXposValue = 0;
		var currentValue_25p = 0;
		var currentValue = 0;
		var previousValue = 0;
		var previousValue_25p = 0;
		var yAxisArr = [];
		for (var k = 0; k < this.percentArr[j].length; k++) {
			var xPos = (this.percentArr[j][k] / 100) * (xPossitionValue);
			previousXposValue = currentXposValue;
			currentXposValue = previousXposValue + xPos;

			var newval = (this.percentArr[j][k] / 100) * (this.seriesValue);
			previousValue = currentValue
			currentValue = previousValue + newval;
			previousValue_25p = currentValue_25p;
			currentValue_25p = previousValue_25p + (newval * 1) / 4;

			if (k == 0) {
				this.ctx.beginPath();
				this.ctx.moveTo(this.m_chartRef.startX, this.m_chartRef.startY);
				this.ctx.lineTo((this.m_chartRef.startX - currentXposValue), this.m_chartRef.startY + (currentValue - currentValue_25p));
				this.ctx.lineTo(this.m_chartRef.startX, this.m_chartRef.startY + currentValue);
				this.ctx.lineTo(this.m_chartRef.startX + currentXposValue, this.m_chartRef.startY + (currentValue - currentValue_25p));
				this.ctx.lineTo(this.m_chartRef.startX, this.m_chartRef.startY);
				this.ctx.fillStyle = hex2rgb(color[0], opacity[k]);
				this.ctx.fill();
				this.ctx.strokeStyle = color[0];
				//this.ctx.stroke();
				this.ctx.closePath();
			} else {
				this.ctx.beginPath();
				this.ctx.moveTo(this.m_chartRef.startX - previousXposValue, this.m_chartRef.startY + (previousValue - previousValue_25p)); //starting point left side
				this.ctx.lineTo((this.m_chartRef.startX - (currentXposValue)), this.m_chartRef.startY + (currentValue - currentValue_25p)); // 2nd left down point
				this.ctx.lineTo(this.m_chartRef.startX, this.m_chartRef.startY + (currentValue)); // mid point
				this.ctx.lineTo(this.m_chartRef.startX + currentXposValue, this.m_chartRef.startY + (currentValue - currentValue_25p)); // right direction point
				this.ctx.lineTo(this.m_chartRef.startX + previousXposValue, this.m_chartRef.startY + (previousValue - previousValue_25p)); // right direction up side point
				this.ctx.lineTo(this.m_chartRef.startX, this.m_chartRef.startY + previousValue); //mid point for up side
				this.ctx.lineTo(this.m_chartRef.startX - previousXposValue, this.m_chartRef.startY + (previousValue - previousValue_25p)); // join with starting point
				this.ctx.fillStyle = hex2rgb(color[0], opacity[k]);
				this.ctx.fill();
				this.ctx.strokeStyle = color[0];
				//this.ctx.stroke();
				this.ctx.closePath();
			}
			this.ctx.beginPath();
			this.ctx.moveTo(this.m_chartRef.startX, this.m_chartRef.startY);
			this.ctx.lineTo(this.m_chartRef.startX, this.m_chartRef.startY + currentValue);
			this.ctx.fillStyle = color[0];
			this.ctx.fill();
			this.ctx.strokeStyle = this.m_strokecolor; //color[0];
			this.ctx.stroke();
			this.ctx.closePath();

			if (k != this.percentArr[j].length - 1) {
				this.ctx.beginPath();
				this.ctx.moveTo((this.m_chartRef.startX - currentXposValue * 1), this.m_chartRef.startY + (currentValue - currentValue_25p));
				this.ctx.lineTo(this.m_chartRef.startX, this.m_chartRef.startY + currentValue);
				this.ctx.lineTo(this.m_chartRef.startX + currentXposValue * 1, this.m_chartRef.startY + (currentValue - currentValue_25p));
				this.ctx.strokeStyle = "#ffffff";
				this.ctx.stroke();
				this.ctx.closePath();
			}
			yAxisArr[k] = (this.m_chartRef.startY + currentValue); //// yAxis lines coordinates  
		}
		this.m_chartRef.yPos.push(yAxisArr);
		break;
	}
	var rightX1 = this.m_chartRef.startX;
	var rightX2 = this.m_chartRef.startX + xPossitionValue;
	var rightY1 = this.m_chartRef.startY;
	var rightY2 = this.m_chartRef.startY + (this.seriesValue - seriesValue_25p);
	var rightXposition = (rightX1 + rightX2) / 2;
	var rightYposition = (rightY1 + rightY2) / 2;
	var leftX1 = this.m_chartRef.startX;
	var leftX2 = (this.m_chartRef.startX - xPossitionValue);
	var leftY1 = this.m_chartRef.startY;
	var leftY2 = this.m_chartRef.startY + (this.seriesValue - seriesValue_25p);
	var leftXposition = (leftX1 + leftX2) / 2;
	var leftYposition = (leftY1 + leftY2) / 2;

	// storing XYWH of each layer.
	this.m_chartRef.m_layerXpositionArray.push((this.m_chartRef.startX - xPossitionValue));
	this.m_chartRef.m_layerYpositionArray.push((this.m_chartRef.startY));
	this.m_chartRef.m_layerWidthArray.push(2 * xPossitionValue);
	this.m_chartRef.m_layerHeightArray.push(this.seriesValue);
	this.m_chartRef.m_layerXLeftpositionArray.push({
		"x": leftXposition,
		"y": leftYposition
	});
	this.m_chartRef.m_layerXRightpositionArray.push({
		"x": rightXposition,
		"y": rightYposition
	});
};

Layer.prototype.drawOtherSlicesForPyramid = function(i, value1, value2, color, xPre_Value, xCur_Value, perArray, opacity) {
	this.previousValue = value1;
	var previousValue1_25p = (this.previousValue * 1) / 4;
	this.currentValue = value2;
	var currentValue1_25p = (this.currentValue * 1) / 4;

	this.percentArr = perArray;
	for (var j = i; j < this.percentArr.length; j++) {
		var currentXposValue = 0;
		var previousXposValue = 0;
		var currentValue_25p = 0;
		var currentValue = 0;
		var previousValue = 0;
		var previousValue_25p = 0;
		var yAxisArr = [];

		for (var k = 0; k < this.percentArr[j].length; k++) {
			var xPos = (this.percentArr[j][k] / 100) * (xCur_Value - xPre_Value);
			previousXposValue = (k == 0) ? xPre_Value + currentXposValue : currentXposValue;
			currentXposValue = previousXposValue + xPos;
			var newval = (this.percentArr[j][k] / 100) * (this.currentValue - this.previousValue);

			previousValue = (k == 0) ? this.previousValue + currentValue : currentValue;
			currentValue = previousValue + newval;
			previousValue_25p = (k == 0) ? (this.previousValue * 1) / 4 + currentValue_25p : currentValue_25p;
			currentValue_25p = previousValue_25p + (newval * 1) / 4;

			this.ctx.beginPath();
			this.ctx.moveTo(this.m_chartRef.startX - previousXposValue, this.m_chartRef.startY + (previousValue - previousValue_25p)); //starting point left side
			this.ctx.lineTo((this.m_chartRef.startX - (currentXposValue)), this.m_chartRef.startY + (currentValue - currentValue_25p)); // 2nd left down point
			this.ctx.lineTo(this.m_chartRef.startX, this.m_chartRef.startY + (currentValue)); // mid point
			this.ctx.lineTo(this.m_chartRef.startX + currentXposValue, this.m_chartRef.startY + (currentValue - currentValue_25p)); // right direction point
			this.ctx.lineTo(this.m_chartRef.startX + previousXposValue, this.m_chartRef.startY + (previousValue - previousValue_25p)); // right direction up side point
			this.ctx.lineTo(this.m_chartRef.startX, this.m_chartRef.startY + previousValue); //mid point for up side
			this.ctx.lineTo(this.m_chartRef.startX - previousXposValue, this.m_chartRef.startY + (previousValue - previousValue_25p)); // join with starting point
			this.ctx.fillStyle = hex2rgb(color[0], opacity[k]);
			this.ctx.fill();
			this.ctx.strokeStyle = color[0];
			//this.ctx.stroke();
			this.ctx.closePath();

			this.ctx.beginPath();
			this.ctx.moveTo(this.m_chartRef.startX, this.m_chartRef.startY + (currentValue)); // mid point
			this.ctx.lineTo(this.m_chartRef.startX, this.m_chartRef.startY + previousValue); //mid point for up side
			this.ctx.fillStyle = color[0];
			this.ctx.fill();
			this.ctx.strokeStyle = this.m_strokecolor; //color[0];//
			this.ctx.stroke();
			this.ctx.closePath();

			if (k != this.percentArr[j].length - 1) {
				this.ctx.beginPath();
				this.ctx.moveTo((this.m_chartRef.startX - (currentXposValue * 1)), this.m_chartRef.startY + (currentValue - currentValue_25p)); // 2nd left down point
				this.ctx.lineTo(this.m_chartRef.startX, this.m_chartRef.startY + (currentValue)); // mid point
				this.ctx.lineTo(this.m_chartRef.startX + currentXposValue * 1, this.m_chartRef.startY + (currentValue - currentValue_25p)); // right direction point
				this.ctx.strokeStyle = "#ffffff";
				this.ctx.stroke();
				this.ctx.closePath();
			}
			yAxisArr[k] = (this.m_chartRef.startY + currentValue); //// yAxis lines coordinates  
		}
		this.m_chartRef.yPos.push(yAxisArr);
		break;
	}

	var rightX1 = this.m_chartRef.startX + xCur_Value;
	var rightX2 = this.m_chartRef.startX + xPre_Value;
	var rightY1 = this.m_chartRef.startY + (this.currentValue - currentValue1_25p);
	var rightY2 = this.m_chartRef.startY + (this.previousValue - previousValue1_25p);
	var rightXposition = (rightX1 + rightX2) / 2;
	var rightYposition = (rightY1 + rightY2) / 2;
	var leftX1 = this.m_chartRef.startX - xPre_Value;
	var leftX2 = (this.m_chartRef.startX - (xCur_Value));
	var leftY1 = this.m_chartRef.startY + (this.previousValue - previousValue1_25p);
	var leftY2 = this.m_chartRef.startY + (this.currentValue - currentValue1_25p);
	var leftXposition = (leftX1 + leftX2) / 2;
	var leftYposition = (leftY1 + leftY2) / 2;

	// storing XYWH of each layer.
	this.m_chartRef.m_layerXpositionArray.push(this.m_chartRef.startX - xCur_Value);
	this.m_chartRef.m_layerYpositionArray.push(this.m_chartRef.startY + this.previousValue);
	this.m_chartRef.m_layerWidthArray.push(2 * this.currentValue);
	this.m_chartRef.m_layerHeightArray.push(this.previousValue);
	this.m_chartRef.m_layerXLeftpositionArray.push({
		"x": leftXposition,
		"y": leftYposition
	});
	this.m_chartRef.m_layerXRightpositionArray.push({
		"x": rightXposition,
		"y": rightYposition
	});
};

/************************************** Category Color ***************************************/
function CategoryColor() {
	this.m_categoryname = "";
	this.m_color = "";
};

CategoryColor.prototype.getCategoryName = function() {
	return this.m_categoryname;
};
CategoryColor.prototype.setCategoryName = function(categoryName) {
	this.m_categoryname = categoryName;
};

CategoryColor.prototype.getColor = function() {
	return this.m_color;
};
CategoryColor.prototype.setColor = function(color) {
	this.m_color = color;
};

/******************************** Category Colors ******************************************/
function CategoryColors() {
	this.m_categorydefaultcolor = "";
	this.m_categorydefaultcolorset = "";
	this.m_showcolorsfromcategoryname = "";

	this.m_categorydefaultcolorsetArray = [];
	this.cateogryNameColorMap = new Object();
	this.m_categoryColor = [];
};
CategoryColors.prototype.getCategoryColor = function() {
	return this.m_categoryColor;
};
CategoryColors.prototype.setCategoryColor = function(categoryColor) {
	this.m_categoryColor.push(categoryColor);
};
CategoryColors.prototype.getCategoryNameColorMapLength = function() {
	var length = 0;
	for (var key in this.cateogryNameColorMap) {
		length++;
	};
	return length;
};

CategoryColors.prototype.getCategoryColorsForCategoryNames = function(categoryData, categoryFieldColor) {
	var categoryColorsArray = [];
	var categoryNameColorMapLength = this.getCategoryNameColorMapLength();
	var repeatedCategoryColorSets = [];

	var categoryDefaultColorSetLength = this.getCategoryDefaultColorSet().length;
	if (this.getCategoryDefaultColorSet().length < categoryData.length) {
		for (var i = categoryDefaultColorSetLength, count = 0; i < categoryData.length; i++, count++) {
			if (categoryDefaultColorSetLength != 0) {
				this.getCategoryDefaultColorSet()[i] = this.getCategoryDefaultColorSet()[count];
			} else {
				this.getCategoryDefaultColorSet()[i] = categoryFieldColor[0];
			}
		}
	}

	for (var i = 0, j = 0; i < categoryData.length; i++) {
		var isCategoryColorFound = false;
		if (categoryNameColorMapLength > 0) {
			for (var key in this.cateogryNameColorMap) {
				if (categoryData[i] == key) {
					categoryColorsArray[i] = convertColorToHex(this.cateogryNameColorMap[key]);
					isCategoryColorFound = true;
				}
			}
		}
		if (!IsBoolean(isCategoryColorFound)) {
			if (categoryFieldColor.length > 1) {
				categoryColorsArray[i] = convertColorToHex(categoryFieldColor[j]);
			} else {
				categoryColorsArray[i] = convertColorToHex(this.getCategoryDefaultColorSet()[j]);
			}
		}
		j++;
	}
	return categoryColorsArray;
};

CategoryColors.prototype.getCategoryDefaultColor = function() {
	return this.m_categorydefaultcolor;
};
CategoryColors.prototype.setCategoryDefaultColor = function(categoryDefaultColor) {
	this.m_categorydefaultcolor = categoryDefaultColor;
};

CategoryColors.prototype.getshowColorsFromCategoryName = function() {
	return this.m_showcolorsfromcategoryname;
};
CategoryColors.prototype.setshowColorsFromCategoryName = function(showColorsFromCategoryName) {
	this.m_showcolorsfromcategoryname = showColorsFromCategoryName;
};

CategoryColors.prototype.getCategoryDefaultColorSet = function() {
	return this.m_categorydefaultcolorsetArray;
};

CategoryColors.prototype.setCategoryDefaultColorSet = function() {
	if (this.m_categorydefaultcolorset !== "")
		this.m_categorydefaultcolorsetArray = ("" + this.m_categorydefaultcolorset).split(",");
};

/********************************** SubCategory Color *******************************************/
function SubCategoryColor() {
	this.m_subcategoryname = "";
	this.m_color = "";
};

SubCategoryColor.prototype.getSubCategoryName = function() {
	return this.m_subcategoryname;
};
SubCategoryColor.prototype.setSubCategoryName = function(subCategoryName) {
	this.m_subcategoryname = categoryName;
};

SubCategoryColor.prototype.getColor = function() {
	return this.m_color;
};
SubCategoryColor.prototype.setColor = function(color) {
	this.m_color = color;
};

/********************************** SubCategory Colors *******************************************/
function SubCategoryColors() {

	this.m_subcategorydefaultcolor = "";
	this.m_subcategorydefaultcolorset = "";
	this.m_showcolorsfromsubcategoryname = "";

	this.m_subcategorydefaultcolorsetArray = [];
	this.subcateogryNameColorMap = new Object();
	this.m_subcategoryColor = [];
};

SubCategoryColors.prototype.setSubCategoryDefaultColorSet = function() {
	if (this.m_subcategorydefaultcolorset !== "") {
		this.m_subcategorydefaultcolorsetArray = ("" + this.m_subcategorydefaultcolorset).split(",");
	}
};

SubCategoryColors.prototype.getSubCategoryDefaultColorSet = function() {
	return this.m_subcategorydefaultcolorsetArray;
};

SubCategoryColors.prototype.getSubCategoryColor = function() {
	return this.m_subcategoryColor;
};
SubCategoryColors.prototype.setSubCategoryColor = function(subCategoryColor) {
	this.m_subcategoryColor.push(subCategoryColor);
};

SubCategoryColors.prototype.getshowColorsFromSubCategoryName = function() {
	return this.m_showcolorsfromsubcategoryname;
};
SubCategoryColors.prototype.setshowColorsFromSubCategoryName = function(showColorsFromSubCategoryName) {
	this.m_showcolorsfromsubcategoryname = showColorsFromSubCategoryName;
};

SubCategoryColors.prototype.getSubCategoryNameColorMapLength = function() {
	var length = 0;
	for (var key in this.subcateogryNameColorMap) {
		length++;
	};
	return length;
};

SubCategoryColors.prototype.getSubCategoryColorsForSubCategoryNames = function(subCategoryData, categoryFieldColor) {
	var subCategoryColorsArray = [];
	var subCategoryNameColorMapLength = this.getSubCategoryNameColorMapLength();
	var repeatedCategoryColorSets = [];

	var subCategoryDefaultColorSetLength = this.getSubCategoryDefaultColorSet().length;
	if (this.getSubCategoryDefaultColorSet().length < subCategoryData.length) {
		for (var i = subCategoryDefaultColorSetLength, count = 0; i < subCategoryData.length; i++, count++) {
			if (subCategoryDefaultColorSetLength != 0) {
				this.getSubCategoryDefaultColorSet()[i] = this.getSubCategoryDefaultColorSet()[count];
			} else {
				this.getSubCategoryDefaultColorSet()[i] = categoryFieldColor[0];
			}
		}
	}

	for (var i = 0, j = 0; i < subCategoryData.length; i++) {
		var isSubCategoryColorFound = false;
		if (subCategoryNameColorMapLength > 0) {
			for (var key in this.subcateogryNameColorMap) {
				if (subCategoryData[i].trim() == key.trim()) {
					subCategoryColorsArray[i] = convertColorToHex(this.subcateogryNameColorMap[key]);
					isSubCategoryColorFound = true;
				}
			}
		}
		if (!IsBoolean(isSubCategoryColorFound)) {
			subCategoryColorsArray[i] = convertColorToHex(this.getSubCategoryDefaultColorSet()[j]);
			j++;
		}
	}
	return subCategoryColorsArray;
};

/********************************** Conditional Color *******************************************/
function ConditionalColor() {
	this.m_seriesname;
	this.m_color;
	this.m_operator;
	this.m_compareto;
	this.m_comparedfield;
	this.m_compToFlag = false;
};

ConditionalColor.prototype.getSeriesName = function() {
	return this.m_seriesname;
};
ConditionalColor.prototype.getColor = function() {
	return this.m_color;
};
ConditionalColor.prototype.getOperator = function() {
	return this.m_operator;
};
ConditionalColor.prototype.getCompareTo = function() {
	return this.m_compareto;
};
ConditionalColor.prototype.getComparedField = function() {
	return this.m_comparedfield;
};

/********************************** Conditional Colors *******************************************/
function ConditionalColors() {
	this.m_ConditionalColor = [];
	this.m_chart;
	this.m_colorChangedConditional = [];
};

ConditionalColors.prototype.getScatterPlotConditionalColorsForConditions = function(seriesNames, seriesColors, seriesData, otherField, chart) {
	this.m_chart = chart;
	var conditionalColorsArray = seriesColors;
	var conditionalColor = this.getConditionalColor();
	for (var l = 0; l < conditionalColor.length; l++) {
		conditionalColorsArray = this.getColorFromConditionForScatterPlot(seriesNames, seriesData, conditionalColorsArray, conditionalColor[l], otherField);
	}
	return conditionalColorsArray;
};

ConditionalColors.prototype.getBubbleConditionalColorsForConditions = function(seriesNames, seriesColors, seriesData, chart) {
	this.m_chart = chart;
	var conditionalColorsArray = seriesColors;
	var conditionalColor = this.getConditionalColor();
	for (var l = 0; l < conditionalColor.length; l++) {
		conditionalColorsArray = this.getColorFromCondition(seriesNames, seriesData, conditionalColorsArray, conditionalColor[l]);
	}
	return conditionalColorsArray;
};

ConditionalColors.prototype.getColorFromConditionForScatterPlot = function(Series, SeriesData, seriesColors, conditionalColor, otherField) {
	var index,
		indexcmpto,
		comparedfield,
		compareToField;
	var plotSeries = Series;
	for (var key in otherField) {
		if (Series.indexOf(otherField[key]) < 0 && otherField.hasOwnProperty(key))
			Series.push(otherField[key]);
	}
	for (var i = 0; i < Series.length; i++) {
		if ((conditionalColor.m_seriesname == Series[i]) && (otherField[Series[i]] == (typeof conditionalColor.m_otherfield == "object") ? conditionalColor.m_otherfield.key : conditionalColor.m_otherfield)) {
			index = i;
			if (conditionalColor.m_comparedfield != undefined) {
				comparedfield = conditionalColor.m_comparedfield;
			} else {
				comparedfield = conditionalColor.m_seriesname;
			}
		}
		/**DAS-632: indicator support for all fields*/
		if ((this.m_chart.m_dataProvider[0]).hasOwnProperty(conditionalColor.m_compareto)) {  /*if (conditionalColor.m_compareto == Series[i]) {*/
			indexcmpto = i;
			conditionalColor.m_compToFlag = true;
			compareToField = conditionalColor.m_compareto;
		}
	}
	var M_SeriesName = [];
	var M_SeriesName1 = [];

	if (index != undefined)
		M_SeriesName = getCommaSeparateSeriesData(this.m_chart.getDataFromJSON(comparedfield));
	if (indexcmpto != undefined && IsBoolean(conditionalColor.m_compToFlag))
		M_SeriesName1 = getCommaSeparateSeriesData(this.m_chart.getDataFromJSON(compareToField));

	var operator = (conditionalColor.m_operator == "=") ? "==" : "" + conditionalColor.m_operator;

	var result = false;

	for (var j = 0; j < M_SeriesName.length; j++) {
		if (IsBoolean(conditionalColor.m_compToFlag)) {
			var compareTo = M_SeriesName1[j];
		} else {
			if (isNaN(conditionalColor.m_compareto)) {
				switch (conditionalColor.m_compareto.toLowerCase()) {
					case "max":
						compareTo = this.getMaximumSeriesValue(SeriesData, index);
						break;
					case "min":
						compareTo = this.getMinimumSeriesValue(SeriesData, index);
						break;
					default:
						compareTo = "" + conditionalColor.m_compareto;
						break;
				}
			} else {
				compareTo = conditionalColor.m_compareto;
			}
		}
		compareTo = (compareTo == "") ? null : compareTo;
		var seriesname = (M_SeriesName1[j] == "") ? null : M_SeriesName[j];

		try {
			if ((operator == "==" || operator == "!=") && IsBoolean(isNaN(seriesname))) {
				eval("result  = '" + seriesname + "'" + operator + "'" + compareTo + "'");
			} else if (operator == "between") {
				var values = ("" + compareTo).split("~");
				if (seriesname >= values[0] * 1 && seriesname <= values[1] * 1) {
					result = true;
				} else {
					result = false;
				}
			} else {
				eval("result  = " + seriesname + operator + compareTo);
			}
		} catch (e) {
			result = false;
		}

		if (IsBoolean(result)) {
			seriesColors[index][j] = convertColorToHex(conditionalColor.m_color);
		}
	}
	return seriesColors;
};
ConditionalColors.prototype.getConditionalColorsForConditions = function(seriesNames, seriesColors, seriesData, chart) {
	this.m_chart = chart;
	var conditionalColorsArray = [];
	for (var i = 0; i < seriesData.length; i++) {
		conditionalColorsArray[i] = [];
		for (var j = 0; j < seriesData[i].length; j++) {
			conditionalColorsArray[i][j] = seriesColors[i];
		}
	}

	var conditionalColor = this.getConditionalColor();
	for (var l = 0; l < conditionalColor.length; l++) {
		conditionalColorsArray = this.getColorFromCondition(seriesNames, seriesData, conditionalColorsArray, conditionalColor[l]);
	}
	return conditionalColorsArray;
};
ConditionalColors.prototype.getConditionalColorsForConditionsForMixedTime = function(seriesNames, seriesColors, seriesData, chart) {
	this.m_chart = chart;
	var conditionalColorsArray = {};
	for (var i = 0; i < seriesData.length; i++) {
		conditionalColorsArray[seriesNames[i]] = [];
		for (var j = 0; j < seriesData[i].length; j++) {
			conditionalColorsArray[seriesNames[i]][j] = seriesColors[seriesNames[i]];
		}
	}

	var conditionalColor = this.getConditionalColor();
	for (var l = 0; l < conditionalColor.length; l++) {
		conditionalColorsArray = this.getColorFromConditionForMixedTime(seriesNames, seriesData, conditionalColorsArray, conditionalColor[l]);
	}
	return conditionalColorsArray;
};
ConditionalColors.prototype.getColorFromConditionForMixedTime = function(Series, SeriesData, seriesColors, conditionalColor) {
	var index,
		indexcmpto,
		comparedfield,
		compareToField;
	for (var i = 0; i < Series.length; i++) {
		if (conditionalColor.m_seriesname == Series[i]) {
			index = i;
			if (conditionalColor.m_comparedfield != undefined) {
				comparedfield = conditionalColor.m_comparedfield;
			} else {
				comparedfield = conditionalColor.m_seriesname;
			}
		}
		/**DAS-632: indicator support for all fields*/
		if ((this.m_chart.m_dataProvider[0]).hasOwnProperty(conditionalColor.m_compareto)) {  /*if (conditionalColor.m_compareto == Series[i]) {*/
			indexcmpto = i;
			conditionalColor.m_compToFlag = true;
			compareToField = conditionalColor.m_compareto;
		}
	}
	var M_SeriesName = [];
	var M_SeriesName1 = [];

	if (index != undefined) {
	    M_SeriesName = getCommaSeparateSeriesData(this.m_chart.getDataFromJSON(comparedfield));
	    /**Added to get sorted data*/
	    if (IsBoolean(this.m_chart.m_sorteddate)) {
	        M_SeriesName = getCommaSeparateSeriesData(this.m_chart.m_seriesdatamap[comparedfield]);
	    }
	}
	if (indexcmpto != undefined && IsBoolean(conditionalColor.m_compToFlag)) {
	    M_SeriesName1 = getCommaSeparateSeriesData(this.m_chart.getDataFromJSON(compareToField));
	    /**Added to get sorted data*/
	    if (IsBoolean(this.m_chart.m_sorteddate)) {
	        M_SeriesName1 = getCommaSeparateSeriesData(this.m_chart.m_seriesdatamap[compareToField]);
	    }
	}
	var operator = (conditionalColor.m_operator == "=") ? "==" : "" + conditionalColor.m_operator;

	var result = false;

	for (var j = 0; j < M_SeriesName.length; j++) {
		if (IsBoolean(conditionalColor.m_compToFlag)) {
			var compareTo = M_SeriesName1[j];
		} else {
			if (isNaN(conditionalColor.m_compareto)) {
				switch (conditionalColor.m_compareto.toLowerCase()) {
					case "max":
						compareTo = this.getMaximumSeriesValue(SeriesData, index);
						break;
					case "min":
						compareTo = this.getMinimumSeriesValue(SeriesData, index);
						break;
					default:
						compareTo = "" + conditionalColor.m_compareto;
						break;
				}
			} else {
				compareTo = conditionalColor.m_compareto;
			}
		}
		compareTo = (compareTo == "") ? null : compareTo;
		var seriesname = (M_SeriesName1[j] == "") ? null : M_SeriesName[j];

		try {
			if ((operator == "==" || operator == "!=") && IsBoolean(isNaN(seriesname))) {
				eval("result  = '" + seriesname + "'" + operator + "'" + compareTo + "'");
			} else if (operator == "between") {
				var values = ("" + compareTo).split("~");
				if (seriesname >= values[0] * 1 && seriesname <= values[1] * 1) {
					result = true;
				} else {
					result = false;
				}
			} else {
				eval("result  = " + seriesname + operator + compareTo);
			}
		} catch (e) {
			result = false;
		}

		if (IsBoolean(result)) {
			seriesColors[Series[index]][j] = convertColorToHex(conditionalColor.m_color);
		}
	}
	return seriesColors;
};
ConditionalColors.prototype.getColorFromCondition = function(Series, SeriesData, seriesColors, conditionalColor) {
	var index,
		indexcmpto,
		comparedfield,
		compareToField;
	for (var i = 0; i < Series.length; i++) {
		if (conditionalColor.m_seriesname == Series[i]) {
			index = i;
			if (conditionalColor.m_comparedfield != undefined) {
				comparedfield = conditionalColor.m_comparedfield;
			} else {
				comparedfield = conditionalColor.m_seriesname;
			}
		}
		/**DAS-632: indicator support for all fields*/
		if ((this.m_chart.m_dataProvider[0]).hasOwnProperty(conditionalColor.m_compareto)) {  /*if (conditionalColor.m_compareto == Series[i]) {*/
			indexcmpto = i;
			conditionalColor.m_compToFlag = true;
			compareToField = conditionalColor.m_compareto;
		}
	}
	var M_SeriesName = [];
	var M_SeriesName1 = [];

	if (index != undefined)
		M_SeriesName = getCommaSeparateSeriesData(this.m_chart.getDataFromJSON(comparedfield));
	if (indexcmpto != undefined && IsBoolean(conditionalColor.m_compToFlag))
		M_SeriesName1 = getCommaSeparateSeriesData(this.m_chart.getDataFromJSON(compareToField));

	var operator = (conditionalColor.m_operator == "=") ? "==" : "" + conditionalColor.m_operator;

	var result = false;

	for (var j = 0; j < M_SeriesName.length; j++) {
		if (IsBoolean(conditionalColor.m_compToFlag)) {
			var compareTo = M_SeriesName1[j];
		} else {
			if (isNaN(conditionalColor.m_compareto)) {
				switch (conditionalColor.m_compareto.toLowerCase()) {
					case "max":
						compareTo = this.getMaximumSeriesValue(SeriesData, index);
						break;
					case "min":
						compareTo = this.getMinimumSeriesValue(SeriesData, index);
						break;
					default:
						compareTo = "" + conditionalColor.m_compareto;
						break;
				}
			} else {
				compareTo = conditionalColor.m_compareto;
			}
		}
		compareTo = (compareTo == "") ? null : compareTo;
		var seriesname = (M_SeriesName1[j] == "") ? null : M_SeriesName[j];

		try {
			if ((operator == "==" || operator == "!=") && IsBoolean(isNaN(seriesname))) {
				eval("result  = '" + seriesname + "'" + operator + "'" + compareTo + "'");
			} else if (operator == "between") {
				var values = ("" + compareTo).split("~");
				if (seriesname >= values[0] * 1 && seriesname <= values[1] * 1) {
					result = true;
				} else {
					result = false;
				}
			} else {
				eval("result  = " + seriesname + operator + compareTo);
			}
		} catch (e) {
			result = false;
		}

		if (IsBoolean(result)) {
			seriesColors[index][j] = convertColorToHex(conditionalColor.m_color);
		}
	}
	return seriesColors;
};

ConditionalColors.prototype.getMaximumSeriesValue = function(seriesValue, index) {
	var maxSeriesVal = seriesValue[index][0];
	for (var i = 0; i < seriesValue[index].length; i++) {
		if ((seriesValue[index][i] !== "") && (seriesValue[index][i] * 1) >= maxSeriesVal * 1) {
			maxSeriesVal = seriesValue[index][i];
		}
	}
	return maxSeriesVal;
};

ConditionalColors.prototype.getMinimumSeriesValue = function(seriesValue, index) {
	var minSeriesVal = seriesValue[index][0];
	for (var i = 0; i < seriesValue[index].length; i++) {
		if ((seriesValue[index][i] !== "") && (seriesValue[index][i] * 1) <= minSeriesVal * 1) {
			minSeriesVal = seriesValue[index][i];
		}
	}
	return minSeriesVal;
};

ConditionalColors.prototype.getCondicolor = function(index) {
	return this.m_colorChangedConditional[index];
};

ConditionalColors.prototype.getConditionalColor = function() {
	return this.m_ConditionalColor;
};
ConditionalColors.prototype.setConditionalColor = function(ConditionalColorObj) {
	this.m_ConditionalColor.push(ConditionalColorObj);
};

/********************************** Line *******************************************/
function Line() {
	this.color;
	this.startXPosition;
	this.startYPosition;
	this.endXPosition;
	this.endYPosition;
	this.ctx = "";
	this.m_chart = "";
};

Line.prototype.init = function(color, startXPosition, startYPosition, endXPosition, endYPosition, m_chart, plotTrasparency,lineWidth,lineType) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.color = color;
	this.startXPosition = startXPosition;
	this.startYPosition = startYPosition;
	this.endXPosition = endXPosition;
	this.endYPosition = endYPosition;
	this.m_plotTrasparency = plotTrasparency;
	this.lineWidth = lineWidth;
	this.lineType = lineType;
};

Line.prototype.drawLine = function() {
	switch (this.m_chart.getLineForm()) {
		case "segment":
			this.drawSegmentLine();
			break;
		case "step":
			this.drawStepLine();
			break;
		case "reversestep":
			this.drawReverseStepLine();
			break;
		case "horizontal":
			this.drawHorizontalLine();
			break;
		case "vertical":
			this.drawVerticalLine();
			break;
		case "curve":
			this.drawCurveLine();
			break;
		default:
			this.drawSegmentLine();
			break;
	}
};

Line.prototype.drawHorizontalLine = function() {
	var lineDashArray = this.getLineDashArray(this.lineWidth, this.lineType);
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.lineWidth = this.lineWidth;
	this.ctx.strokeStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.moveTo(this.startXPosition, this.startYPosition);
	this.ctx.lineTo(this.endXPosition, this.startYPosition);
	if (this.lineWidth > 0) {
		this.ctx.setLineDash(lineDashArray);
		this.ctx.stroke();
	}
	this.ctx.restore();
	this.ctx.closePath();
};

Line.prototype.drawVerticalLine = function() {
	var lineDashArray = this.getLineDashArray(this.lineWidth, this.lineType);
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.lineWidth = this.lineWidth;
	this.ctx.strokeStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.moveTo(this.endXPosition, this.endYPosition);
	this.ctx.lineTo(this.endXPosition, this.startYPosition);
	if (this.lineWidth > 0) {
		this.ctx.setLineDash(lineDashArray);
		this.ctx.stroke();
	}
	this.ctx.restore();
	this.ctx.closePath();
};

Line.prototype.drawStepLine = function() {
	var lineDashArray = this.getLineDashArray(this.lineWidth, this.lineType);
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.lineWidth = this.lineWidth;
	this.ctx.strokeStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.moveTo(this.startXPosition, this.startYPosition);
	this.ctx.lineTo(this.endXPosition, this.startYPosition);
	this.ctx.lineTo(this.endXPosition, this.endYPosition);
	if (this.lineWidth > 0) {
		this.ctx.setLineDash(lineDashArray);
		this.ctx.stroke();
	}
	this.ctx.restore();
	this.ctx.closePath();
};

Line.prototype.drawReverseStepLine = function() {
	var lineDashArray = this.getLineDashArray(this.lineWidth, this.lineType);
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.lineWidth = this.lineWidth;
	this.ctx.strokeStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.moveTo(this.startXPosition, this.startYPosition);
	this.ctx.lineTo(this.startXPosition, this.endYPosition);
	this.ctx.lineTo(this.endXPosition, this.endYPosition);
	if (this.lineWidth > 0) {
		this.ctx.setLineDash(lineDashArray);
		this.ctx.stroke();
	}
	this.ctx.restore();
	this.ctx.closePath();
};

Line.prototype.drawSegmentLine = function() {
	var lineDashArray = this.getLineDashArray(this.lineWidth, this.lineType);
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.lineWidth = this.lineWidth;
	this.ctx.strokeStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.moveTo(this.startXPosition, this.startYPosition);
	this.ctx.lineTo(this.endXPosition, this.endYPosition);
	if (this.lineWidth > 0) {
		this.ctx.setLineDash(lineDashArray);
		this.ctx.stroke();
	}
	this.ctx.restore();
	this.ctx.closePath();
};

Line.prototype.drawCurveLine = function() {
	var lineDashArray = this.getLineDashArray(this.lineWidth, this.lineType);
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.lineWidth = this.lineWidth;
	this.ctx.strokeStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.moveTo(this.startXPosition, this.startYPosition);
	this.ctx.lineTo(this.endXPosition, this.endYPosition);
	if (this.lineWidth > 0) {
		this.ctx.setLineDash(lineDashArray);
		this.ctx.stroke();
	}
	this.ctx.restore();
	this.ctx.closePath();
};
/** @description Get line dash array **/
Line.prototype.getLineDashArray = function(lineWidth, lineType) {
	/**An Array of first two numbers which specify line width and a gap and last two for line patterns **/
	if (lineType === "dot")
		return [lineWidth * 1,(lineWidth * 2) + 1,0,0];
	else if (lineType === "dash1")
		return [lineWidth * 1,(lineWidth * 1),(lineWidth * 4),(lineWidth * 1)];
	else if (lineType === "dash")
		return [(lineWidth * 2) + 1,(lineWidth * 2) + 1,0,0];
	else
		return [];
};

/********************************** Point *******************************************/
function Point() {
	this.color;
	this.radius;
	this.xPosition;
	this.yPosition;
	this.ctx = "";
	this.m_chart = "";
};

Point.prototype.init = function(color, radius, xPosition, yPosition, ctx, m_chart, plotTrasparency, plotType, plotRadius) {
	this.ctx = ctx;
	this.color = color;
	this.radius = radius;
	this.xPosition = xPosition;
	this.yPosition = yPosition;
	this.m_chart = m_chart;
	this.m_plotTrasparency = plotTrasparency;
	this.m_plotType = plotType;
	this.m_plotradius = plotRadius;

};

Point.prototype.drawPoint = function() {
	switch (this.m_plotType) {
		case "cube":
			this.drawCube();
			break;
		case "cross":
			this.drawCross();
			break;
		case "quad":
			this.drawQuad();
			break;
		case "triangle":
			this.drawTriangle();
			break;
		case "point":
			this.drawPointShape();
			break;
		case "polygon":
			this.drawPolygon();
			break;
		case "star":
			this.drawStar();
			break;
		case "default":
			this.drawPointShape();
			break;
	}
};

Point.prototype.drawCube = function() {
	this.ctx.beginPath();
	this.ctx.fillStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.strokeStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.rect(this.xPosition - this.m_plotradius, this.yPosition - this.m_plotradius, this.m_plotradius * 2, this.m_plotradius * 2);
	this.ctx.fill();
	this.ctx.stroke();
	this.ctx.closePath();
};

Point.prototype.drawCross = function() {
	this.ctx.beginPath();
	this.ctx.lineWidth = 2;
	this.ctx.strokeStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.moveTo(this.xPosition * 1 - this.m_plotradius * 1, this.yPosition * 1 - this.m_plotradius * 1);
	this.ctx.lineTo(this.xPosition * 1 + this.m_plotradius * 1, this.yPosition * 1 + this.m_plotradius * 1);

	this.ctx.moveTo(this.xPosition * 1 + this.m_plotradius * 1, this.yPosition * 1 - this.m_plotradius * 1);
	this.ctx.lineTo(this.xPosition * 1 - this.m_plotradius * 1, this.yPosition * 1 + this.m_plotradius * 1);
	this.ctx.stroke();
	this.ctx.closePath();
};

Point.prototype.drawQuad = function() {
	this.ctx.beginPath();
	this.ctx.fillStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.strokeStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.moveTo(this.xPosition * 1, this.yPosition * 1 - this.m_plotradius * 1);
	this.ctx.lineTo(this.xPosition * 1 + this.m_plotradius * 1, this.yPosition * 1);
	this.ctx.lineTo(this.xPosition * 1, this.yPosition * 1 + this.m_plotradius * 1);
	this.ctx.lineTo(this.xPosition * 1 - this.m_plotradius * 1, this.yPosition * 1);
	this.ctx.lineTo(this.xPosition * 1, this.yPosition * 1 - this.m_plotradius * 1);
	this.ctx.fill();
	this.ctx.stroke();

	this.ctx.closePath();
};

Point.prototype.drawTriangle = function() {
	this.ctx.beginPath();
	this.ctx.fillStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.strokeStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.moveTo(this.xPosition, this.yPosition * 1 - this.m_plotradius * 1);
	this.ctx.lineTo(this.xPosition * 1 + this.m_plotradius * 1, this.yPosition * 1 + this.m_plotradius * 1);
	this.ctx.lineTo(this.xPosition * 1 - this.m_plotradius * 1, this.yPosition * 1 + this.m_plotradius * 1);
	this.ctx.lineTo(this.xPosition * 1, this.yPosition * 1 - this.m_plotradius * 1);
	this.ctx.fill();
	this.ctx.stroke();
	this.ctx.closePath();
};

Point.prototype.drawPointShape = function() {
	this.ctx.beginPath();
	this.strokeMargin = 2;
	this.ctx.fillStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.arc(this.xPosition * 1, this.yPosition * 1, this.m_plotradius * 1, 0, Math.PI * 2, false);
	this.ctx.fill();
	this.ctx.closePath();

	this.ctx.beginPath();
	this.ctx.strokeStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.arc(this.xPosition * 1, this.yPosition * 1, this.m_plotradius * 1, 0, Math.PI * 2, false);
	this.ctx.lineTo(this.xPosition * 1, this.yPosition * 1);
	this.ctx.stroke();
	this.ctx.closePath();
};

Point.prototype.drawPolygon = function() {
	this.ctx.fillStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.strokeStyle = hex2rgb(this.color, this.m_plotTrasparency);
	var ctx = this.ctx;
	var x = this.xPosition;
	var y = this.yPosition;
	var radius = this.m_plotradius;
	var sides = 6;
	var startAngle = Math.PI / 2;
	var a = (Math.PI * 2) / sides;
	ctx.save();
	ctx.beginPath();
	ctx.translate(x, y);
	ctx.rotate(startAngle);
	ctx.moveTo(radius, 0);
	for (var i = 1; i < sides; i++) {
		ctx.lineTo(radius * Math.cos(a * i), radius * Math.sin(a * i));
	}
	ctx.closePath();
	ctx.restore();
	this.ctx.fill();
	this.ctx.stroke();
};
Point.prototype.drawStar = function() {
	this.ctx.fillStyle = hex2rgb(this.color, this.m_plotTrasparency);
	this.ctx.strokeStyle = hex2rgb(this.color, this.m_plotTrasparency);
	var ctx = this.ctx;
	var cx = this.xPosition;
	var cy = this.yPosition;
	var r1 = this.m_plotradius;
	var r0 = this.m_plotradius / 2;
	var spikes = 5;

	var rot = Math.PI / 2 * 3;
	var x = cx;
	var y = cy;
	var step = Math.PI / spikes;

	ctx.beginPath();
	ctx.moveTo(cx, cy - r0);
	for (var i = 0; i < spikes; i++) {
		x = cx * 1 + Math.cos(rot) * r0;
		y = cy * 1 + Math.sin(rot) * r0;
		ctx.lineTo(x, y);
		rot = rot * 1 + step * 1;

		x = cx * 1 + Math.cos(rot) * r1;
		y = cy * 1 + Math.sin(rot) * r1;
		ctx.lineTo(x, y);
		rot = rot * 1 + step * 1;
	}
	ctx.lineTo(cx, cy - r0);
	ctx.closePath();
	this.ctx.fill();
	this.ctx.stroke();
};
/**********************************Data Label Value Text*****************************************/
Chart.prototype.getDataLabelProperties = function() {
	var DataLabelObject = {};
	DataLabelObject = {
		"showDataLabel": "false",
		"useFieldColor": "false",
		"dataLabelTextAlign": "center",
		"dataLabelFontColor": "#000000",
		"dataLabelRotation": "0",
		"dataLabelFontSize": "12",
		"datalabelFontStyle": "normal",
		"datalabelFontWeight": "normal",
		"datalabelFontFamily": "Roboto",
		"datalabelField": "",
		"datalabelPosition": "Top",
		"dataLabelUseComponentFormater":"true",
		"datalabelFormaterUnit":"none",
		"datalabelFormaterPrecision":"default",
		"datalabelFormaterCurrency":"none",
		"datalabelFormaterPosition":"suffix"
	}
	return DataLabelObject;
};

function ValueTextSeries() {
	this.xPositionArray = [];
	this.yPositionArray = [];
	this.ctx = "";
	this.m_chart = "";
	this.m_ySeriesData = [];
	this.valueText = [];
	this.datalabelProperties = "";
	this.m_ySeriesActualData = [];
	this.m_stackWidth = "";
	this.m_stackHeightArray = "";
	this.seriesChartType = "";
};
/** @description initialization of ValueTextSeries. **/
ValueTextSeries.prototype.init = function(xPositionArray, yPositionArray, m_chart, yseriesData, datalabelProperties, ySeriesActualData, stackWidth, stackHeight, seriesChartType) {
	this.m_chart = m_chart;
	this.ctx = this.m_chart.ctx;
	this.xPositionArray = xPositionArray;
	this.yPositionArray = yPositionArray;
	this.ySeriesData = yseriesData;
	this.datalabelProperties = datalabelProperties;
	this.m_ySeriesActualData = ySeriesActualData;
	this.m_stackWidth = stackWidth;
	this.m_stackHeightArray = stackHeight;
	this.seriesChartType = seriesChartType;
	if ((this.m_stackWidth == undefined) || (this.seriesChartType == "line")) {
		this.m_stackWidth = 0;
		this.m_stackHeightArray = 0;
	}
	for (var i = 0; i < this.xPositionArray.length; i++) {
		this.valueText[i] = new ValueText();
		var DataLabelProp = (((this.m_chart.m_componenttype == "bar_chart") || (this.m_chart.m_componenttype == "column_stack_chart")) && (this.m_chart.m_charttype.toLowerCase() == "overlaid")) ? this.datalabelProperties[i] : this.datalabelProperties;
		if(IsBoolean(DataLabelProp.showDataLabel)){
			this.valueText[i].init(this.xPositionArray[i], this.yPositionArray[i], this.ctx, this.m_chart, this.ySeriesData[i], DataLabelProp, this.m_ySeriesActualData[i], this.m_stackWidth, this.m_stackHeightArray[i], this.seriesChartType);
		}
	}
};
ValueTextSeries.prototype.drawValueTextSeries = function() {
	for (var i = 0; i < this.xPositionArray.length; i++) {
		var DrawableStack = (this.m_stackHeightArray[i]==0) ? ((this.valueText[i].m_ySeriesActualData==0)? true : false ) : true;
		var DrawableOverlaidStack = (((this.m_chart.m_componenttype == "bar_chart") || (this.m_chart.m_componenttype == "column_stack_chart")) && (this.m_chart.m_charttype.toLowerCase() == "overlaid")) ? (IsBoolean(this.valueText[i].datalabelProperties.showDataLabel) ? true : false) : true;
		if ((!isNaN(this.valueText[i].m_ySeriesActualData) && (this.valueText[i].m_ySeriesActualData !== "") && (DrawableStack) && (DrawableOverlaidStack))) {
			/*DAS-366*/  
			if (IsBoolean(this.valueText[i].datalabelProperties.hideDataLabel)) {
			    if (this.valueText[i].m_ySeriesActualData.toString() !== this.valueText[i].datalabelProperties.hideDataLabelText) {
			      this.valueText[i].drawValueText(i);
			    }
			  } else {
			    this.valueText[i].drawValueText(i);
			  }
		}
	}
};

function ValueText() {
	this.xPosition;
	this.yPosition;
	this.ctx = "";
	this.m_chart = "";
	this.m_ySeriesData;
	this.datalabelProperties = "";
	this.m_ySeriesActualData;
	this.m_stackWidth = "";
	this.m_stackHeight = "";
	this.seriesChartType = "";
	this.MaxValue;
};
ValueText.prototype.init = function(xPosition, yPosition, ctx, m_chart, ySeriesData, datalabelProperties, ySeriesActualData, stackWidth, stackHeight, seriesChartType, MaxValue) {
	this.ctx = ctx;
	this.xPosition = xPosition;
	this.yPosition = yPosition;
	this.m_chart = m_chart;
	this.m_ySeriesData = ySeriesData;
	this.datalabelProperties = datalabelProperties;
	this.m_ySeriesActualData = ySeriesActualData;
	this.m_stackWidth = stackWidth;
	this.m_stackHeight = stackHeight;
	this.seriesChartType = seriesChartType;
	this.MaxValue = MaxValue;
};
/** commenting below method for column chart Data-label issue[DAS-5] **/
/*ValueText.prototype.calculateDataLabelLength = function(labelText, textWidth) {
	var text = labelText;
	var newText = "";

	var strWidth = this.ctx.measureText(text).width;
	if (text.length > 0) {
		var appendedTextWidth = (strWidth / text.length) * 2;
	}
	for (var i = 0; i < text.length; i++) {
		if (this.ctx.measureText(newText).width < (textWidth - appendedTextWidth) || (i == (text.length - 1))) {
			newText += text[i];
		} else {
			newText = newText + ".";
			break;
		}
	}
	return newText;
}*/
/**@description draw Data Label**/
ValueText.prototype.drawValueText = function(i) {
	var temp = this.m_chart;
    var yspace = 10;
    var xspace = 10;
    try {
        if (this.m_chart.m_overlappeddatalabelarrayY[i] === undefined) {
            this.m_chart.m_overlappeddatalabelarrayY[i] = [];
            this.m_chart.m_overlappeddatalabelarrayX[i] = [];
        }
        this.m_ySeriesData = this.getFormattedText(this.m_ySeriesData);
        /** commenting below method for column chart Data-label issue[DAS-5] **/
        /*if(this.m_chart.m_type == "Column"){
        	if((temp.m_startY - this.m_stackHeight)  < 100){
        		var avblHeight = (temp.m_startY - temp.m_endY)/2;
        	}else {
        		var avblHeight = (temp.m_startY - (temp.m_endY * 2 + this.m_stackHeight));
        	}
        	this.m_ySeriesData = this.calculateDataLabelLength(this.m_ySeriesData, avblHeight);
        }*/
        this.ctx.save();
        this.ctx.font = this.datalabelProperties.datalabelFontStyle + " " + this.datalabelProperties.datalabelFontWeight + " " +
            this.m_chart.fontScaling(this.datalabelProperties.dataLabelFontSize) + "px " + selectGlobalFont(this.datalabelProperties.datalabelFontFamily);
        this.ctx.fillStyle = this.datalabelProperties.dataLabelFontColor;
        var color = this.datalabelProperties.dataLabelFontColor;
        var size = this.ctx.measureText(this.m_ySeriesData);
        var position = this.datalabelProperties.datalabelPosition;
        var StackHeight = this.m_stackHeight;
        var ySeriesData = (getNumericComparableValue(this.m_ySeriesData)) * 1;
        var ySeriesActualData = (getNumericComparableValue(this.m_ySeriesActualData)) * 1;
        var paddingWithRotation = 0;
        var paddingWithoutRotation = 0;
        if (StackHeight < 0) {
            StackHeight = StackHeight * (-1);
        }
        position = (size.width / 2 >= StackHeight) ? ("Top") : (position);

        if ((!IsBoolean(this.m_chart.m_basezero) && (ySeriesActualData < 0))) {
            var YSpace = (size.width / 2) * 1 + yspace;
            if ((this.m_chart.m_componenttype == "mixed_chart") && (this.seriesChartType == "column")) {
                this.yPosition = this.yPosition + this.m_stackHeight;
            }
        } else {
            yspace = -10;
            YSpace = -(size.width / 2) * 1 + yspace;
        }
        if ((this.m_chart.m_type == "Bar") || (this.m_chart.m_type == "GroupBar")) {
            if (position == "Top") {
                if (this.datalabelProperties.dataLabelRotation !== "0") {
                    if (!IsBoolean(this.m_chart.m_basezero) && (ySeriesActualData < 0)) {
                        var tx = this.xPosition * 1 + this.m_stackHeight - xspace;
                    } else {
                      /*DAS-902 on base type Rectangle and Data label position is top ,data label overlapping with the chart issue */
						if(this.m_chart.m_chartbase=='rectangle'){
                        	var tx = this.xPosition * 1 + this.m_stackHeight + xspace +(this.m_stackWidth/4) + 10;							
						}else{
                        var tx = this.xPosition * 1 + this.m_stackHeight + xspace;							
						}
                    }
                    var Align = this.datalabelProperties.dataLabelTextAlign;
                } else {
                    var tx = this.setAlignDataLabelBarChart(size, ySeriesActualData, StackHeight);
                    var Align = "center";
                }
            } else if (position == "Middle") {
                var tx = (this.xPosition * 1 + this.m_stackHeight / 2);
                if (!IsBoolean(this.m_chart.m_basezero) && (ySeriesActualData < 0)) {
                	var Align = ((this.datalabelProperties.dataLabelTextAlign == "right") ? "left" : ((this.datalabelProperties.dataLabelTextAlign == "left") ? "right" : "center"));
                } else {
                	var Align = this.datalabelProperties.dataLabelTextAlign;
                }
            } else {
                if (this.datalabelProperties.dataLabelRotation !== "0") {
                    if (!IsBoolean(this.m_chart.m_basezero) && (ySeriesActualData < 0)) {
                        var tx = this.xPosition * 1 - xspace;
                    } else {
                        var tx = this.xPosition * 1 + xspace;
                    }
                    var Align = this.datalabelProperties.dataLabelTextAlign;
                } else {
                    if (!IsBoolean(this.m_chart.m_basezero) && (ySeriesActualData < 0)) {
                        var tx = this.xPosition * 1 - xspace - size.width;
                        var Align = ((this.datalabelProperties.dataLabelTextAlign == "right") ? "left" : ((this.datalabelProperties.dataLabelTextAlign == "left") ? "right" : "center"));
                    } else {
                        var tx = this.xPosition * 1 + xspace + size.width;
                        var Align = this.datalabelProperties.dataLabelTextAlign;
                    }
                }
            }
            var ty = this.yPosition * 1 + this.m_stackWidth / 2;
        } else {
            if ((this.seriesChartType == "column") && (position !== "Top" || position == undefined)) {
                this.setPositionDataLabel(StackHeight);
            } else if (this.seriesChartType !== "column") {
                /**Added for position feature in Area and line chart*/
                if (!IsBoolean(this.m_chart.m_basezero) && (ySeriesActualData < 0)) {
                    (position == "Top") ? (yspace = 10) : ((position == "Middle") ? (yspace = 0) : (yspace = -10));
                } else {
                    (position == "Top") ? (yspace = -10) : ((position == "Middle") ? (yspace = 0) : (yspace = 10));
                }
            }
            if ((this.datalabelProperties.dataLabelRotation == "-90" || this.datalabelProperties.dataLabelRotation == "90") && (this.datalabelProperties.dataLabelTextAlign == "left")) {
                var tx = (this.xPosition * 1 + this.m_stackWidth / 2) + xspace;
                 /*DAS-902 on base type Rectangle and Data label position is top ,data label overlapping with the chart issue */
                if(this.m_chart.m_chartbase=='rectangle'){
                	var ty = (this.yPosition * 1 + YSpace - (this.m_stackWidth/4));					
				}else{
					var ty = (this.yPosition * 1 + YSpace);					
				}
                var Align = "center";
            } else if ((this.datalabelProperties.dataLabelRotation == "-90" || this.datalabelProperties.dataLabelRotation == "90") && (this.datalabelProperties.dataLabelTextAlign == "right")) {
                var tx = (this.xPosition * 1 + this.m_stackWidth / 2) - xspace;
                if(this.m_chart.m_chartbase=='rectangle'){
                	var ty = (this.yPosition * 1 + YSpace - (this.m_stackWidth/4));/*DAS-902*/		
				}else{
					var ty = (this.yPosition * 1 + YSpace);					
				}
                var Align = "center";
            } else if ((this.datalabelProperties.dataLabelRotation == "-90" || this.datalabelProperties.dataLabelRotation == "90") && (this.datalabelProperties.dataLabelTextAlign == "center")) {
                var tx = (this.xPosition * 1 + this.m_stackWidth / 2);
                if (size.width >= 28) {
					 if(this.m_chart.m_chartbase=='rectangle'){
						 var ty = (this.yPosition * 1 + YSpace - (this.m_stackWidth/4));/*DAS-902*/
					 }else{
                    	var ty = (this.yPosition * 1 + YSpace); 
					 }
                } else {
					if(this.m_chart.m_chartbase=='rectangle'){
						 var ty = (this.yPosition * 1 + 2 * yspace - (this.m_stackWidth/4));/*DAS-902*/
					 }else{
                    	var ty = (this.yPosition * 1 + 2 * yspace);
					 }
                }
                var Align = this.datalabelProperties.dataLabelTextAlign;

            } else {
				if(this.seriesChartType == "column" && position == "Top" && (this.m_chart.m_chartbase=='rectangle')){
                	var ty = (this.yPosition * 1 + yspace - (this.m_stackWidth/4));/*DAS-902*/
				}else{
					var ty = (this.yPosition * 1 + yspace);
				}
                var tx = (this.xPosition * 1 + this.m_stackWidth / 2);					
                var Align = this.datalabelProperties.dataLabelTextAlign;
            }
        }
        if (!IsBoolean(this.m_chart.m_basezero) && (this.m_ySeriesActualData < 0)) {
            var minimumDrawLength = tx - this.m_chart.m_startX;
            if ((this.m_chart.m_type == "Bar") || (this.m_chart.m_type == "GroupBar")) {
            	if(tx <= this.m_chart.m_startX){
            		tx = ((this.datalabelProperties.dataLabelRotation !== "0") ? (this.m_chart.m_startX + 20) :  (this.m_chart.m_startX + size.width/2 + 5));
            	}else{
            		var sizeWidth = (this.datalabelProperties.dataLabelTextAlign === "left") ? size.width : size.width/2 ;
            		tx = (((this.datalabelProperties.dataLabelRotation !== "0") && (minimumDrawLength <= 5)) ? (tx + 20) : (((this.datalabelProperties.dataLabelRotation == "0") && (minimumDrawLength <= sizeWidth)) ? (((this.datalabelProperties.dataLabelRotation == "0") && (this.m_stackHeight <= sizeWidth)) ? (tx + size.width/2 + 5) : tx) : tx));
            	}
            } else {
                tx = (((this.datalabelProperties.dataLabelRotation !== "0") && (minimumDrawLength < size.width / 2)) ? (tx + size.width / 2 + 10) : (((this.datalabelProperties.dataLabelRotation == "0") && (minimumDrawLength <= 5)) ? (tx + 20) : tx));
            }
        } else {
            var minimumDrawLength = this.m_chart.m_endX - tx;
            if ((this.m_chart.m_type == "Bar") || (this.m_chart.m_type == "GroupBar")) {
            	if(tx >= this.m_chart.m_endX){
					/*Here the color is added since the color will change whenever the above condition is true or it will not change.*/
					color = this.datalabelProperties.dataLabelDefaultFontColor;
            		tx = ((this.datalabelProperties.dataLabelRotation !== "0") ? (this.m_chart.m_endX - 20) : (this.xPosition * 1 + this.m_stackHeight - 5));
            	}else{
            		var sizeWidth = (this.datalabelProperties.dataLabelTextAlign === "right") ? size.width : size.width/2 ;
            		tx = (((this.datalabelProperties.dataLabelRotation !== "0") && (minimumDrawLength <= 5)) ? (tx - 20) : (((this.datalabelProperties.dataLabelRotation == "0") && (minimumDrawLength <= sizeWidth)) ? (((this.datalabelProperties.dataLabelRotation == "0") && (this.m_stackHeight <= sizeWidth)) ? (tx - size.width/2 - 5) : tx) : tx));
            		if((this.datalabelProperties.dataLabelRotation === "0") && (minimumDrawLength <= sizeWidth)){
						//Do Nothing
					} else if(position == "Top"){
						Align = "right";
					}
            	}
            } 
            /** commenting below method for column chart Data-label issue[DAS-5] **/
            /* Added a fix for BDD-889-Data label issue with long text when alignment is right
            else if((this.m_chart.m_type == "Column")&& (minimumDrawLength < size.width / 2)){
            	tx = tx * 1;
            }*/
            else {
                tx = (((this.datalabelProperties.dataLabelRotation !== "0") && (minimumDrawLength < size.width / 2)) ? (tx - size.width / 2 - 10) : (((this.datalabelProperties.dataLabelRotation == "0") && (minimumDrawLength <= 5)) ? (tx - 20) : tx));
            }
        }
        /*if(this.m_chart.m_allSeriesNames.length>1){
			color = (minimumDrawLength <= 5 && (this.datalabelProperties.dataLabelTextAlign == "left" && position == "Top")) ? this.datalabelProperties.dataLabelDefaultFontColor : color;
		} else {
			color = (minimumDrawLength <= 5 || minimumDrawLength <= sizeWidth) ? this.datalabelProperties.dataLabelDefaultFontColor : color;
		}*/
        if(minimumDrawLength <= 5 || minimumDrawLength <= sizeWidth){
        	Align= "right";
        }
        if ((this.m_chart.m_type !== "Bar") && (this.m_chart.m_type !== "GroupBar")) {
            if (!IsBoolean(this.m_chart.m_basezero) && (this.m_ySeriesActualData < 0)) {
                var minimumDrawLength = this.m_chart.m_startY - ty;
                paddingWithRotation = -(size.width / 2 + 10);
                paddingWithoutRotation = -20;
                if (ty >= this.m_chart.m_startY) {
                    ty = ((this.datalabelProperties.dataLabelRotation !== "0") ? (this.m_chart.m_startY + paddingWithRotation) : this.m_chart.m_startY + paddingWithoutRotation);
                } else {
                    ty = (((this.datalabelProperties.dataLabelRotation !== "0") && (minimumDrawLength < size.width / 2)) ? (ty + paddingWithRotation) : (((this.datalabelProperties.dataLabelRotation == "0") && (minimumDrawLength <= 5)) ? (ty + paddingWithoutRotation) : ty));
                }
            } else {
                var minimumDrawLength = ty - this.m_chart.m_endY;
                paddingWithRotation = size.width / 2 + 10;
                paddingWithoutRotation = 20;
                if (ty <= this.m_chart.m_endY) {
                    ty = ((this.datalabelProperties.dataLabelRotation !== "0") ? (this.m_chart.m_endY + paddingWithRotation) : this.m_chart.m_endY + paddingWithoutRotation);
                    this.ctx.fillStyle = this.datalabelProperties.dataLabelDefaultFontColor;
                } else {
                    ty = (((this.datalabelProperties.dataLabelRotation !== "0") && (minimumDrawLength < size.width / 2)) ? (ty + paddingWithRotation) : (((this.datalabelProperties.dataLabelRotation == "0") && (minimumDrawLength <= 5)) ? (ty + paddingWithoutRotation) : ty));
                }
            }
        } else {
        	var minimumDrawLength = this.m_chart.m_startY - ty - size.width / 2;
        	if ((this.datalabelProperties.dataLabelRotation !== "0") && (minimumDrawLength < size.width / 2)) {
        	    ty = ty + this.m_stackWidth / 2;
        	    Align = "right";
        	}
        }
        if (minimumDrawLength <= 5 ) {
            this.ctx.fillStyle = this.datalabelProperties.dataLabelDefaultFontColor;
        }
        this.ctx.translate(tx, ty);
        this.ctx.rotate(this.datalabelProperties.dataLabelRotation * Math.PI / 180);
        this.ctx.textAlign = Align; //this.m_chart.m_datalabeltextalign;
        this.ctx.translate(-tx, -ty);
        if ((IsBoolean(this.m_chart.m_basezero) && ((ySeriesData < 0) || (ySeriesActualData < 0)) || ((!IsBoolean(this.m_chart.m_autoaxissetup)) && (StackHeight === undefined) && ((ySeriesActualData < this.m_chart.min) || (ySeriesActualData > this.m_chart.m_maximumaxisvalue))))) {
            this.m_ySeriesData = "";
        }
        
        /*DAS-466 if min/max from zero to whatever ,in this case negative datalabel point should not show */
        if (!IsBoolean(this.m_chart.m_basezero) && (ySeriesData < 0) && (!IsBoolean(this.m_chart.m_autoaxissetup)) && this.m_chart.m_minimumaxisvalue == 0) {
            this.m_ySeriesData = "";
        }
        /**Added to remove overlapping issue of data label*/
        if ((this.m_chart.m_type == "Area") || (this.m_chart.m_type === "Line") || (this.m_chart.m_type === "Mixed") || (this.m_chart.m_type === "Bubble") || (this.m_chart.m_type === "Column") || (this.m_chart.m_type === "GroupBar")) {
            this.m_chart.m_overlappeddatalabelarrayY[i].push(ty);
            this.m_chart.m_overlappeddatalabelarrayX[i].push(tx);

            if (this.m_chart.m_overlappeddatalabelarrayY[i].length > 1) {
                var length = this.m_chart.m_overlappeddatalabelarrayY[i].length - 1;
                for (var k = 0; length > k; k++) {
                    var xValue = this.precisionRound(this.m_chart.m_overlappeddatalabelarrayX[i][k], 4);
                    var yValue = this.precisionRound(this.m_chart.m_overlappeddatalabelarrayY[i][k], 4);
                    var xValuePlot = this.precisionRound(tx, 4);
                    var yValuePlot = this.precisionRound(ty, 4);
                    if ((xValue === xValuePlot) && (yValue === yValuePlot)) {
                        this.m_ySeriesData = "";
                        break;
                    } else if ((xValue === xValuePlot) && (yValuePlot > yValue - 15 && yValuePlot < yValue + 15)) {
                        ty = yValuePlot - (this.m_chart.fontScaling(this.datalabelProperties.dataLabelFontSize) + 5);
                        if (!IsBoolean(this.m_chart.m_basezero) && (this.m_ySeriesActualData < 0)) {
                            ty = (((this.datalabelProperties.dataLabelRotation !== "0") && (minimumDrawLength < size.width / 2)) ? (yValuePlot + paddingWithRotation + this.m_chart.fontScaling(this.datalabelProperties.dataLabelFontSize) + 5) : (((this.datalabelProperties.dataLabelRotation == "0") && (minimumDrawLength <= 5)) ? (ty - paddingWithoutRotation - this.m_chart.fontScaling(this.datalabelProperties.dataLabelFontSize) - 5) : ty));
                        } else {
                            ty = (((this.datalabelProperties.dataLabelRotation !== "0") && (minimumDrawLength < size.width / 2)) ? (yValuePlot + paddingWithRotation - this.m_chart.fontScaling(this.datalabelProperties.dataLabelFontSize) - 5) : (((this.datalabelProperties.dataLabelRotation == "0") && (minimumDrawLength <= 5)) ? (ty + paddingWithoutRotation + this.m_chart.fontScaling(this.datalabelProperties.dataLabelFontSize) + 5) : ty));
                        }

                        this.m_chart.m_overlappeddatalabelarrayY[i][length] = ty;
                    }
                }
            }
        }
        if (this.datalabelProperties.dataLabelRotation === "0") {
            tx = this.textXpositionCalculation(tx, size, Align);
        } else {
            ty = this.textYpositionCalculation(ty, size, Align);
        }
        if((this.m_chart.m_type == "Bar" || this.m_chart.m_type == "GroupBar")&& (this.m_chart.m_charttype!=="clustered")){
			if(this.m_stackHeight<=size.width && this.m_chart.countVisibleSeries()>1){
				this.m_ySeriesData="";
			}
		}
		if((this.m_chart.m_type == "Bar" || this.m_chart.m_type == "GroupBar")){
			if(this.m_stackHeight<=size.width){
				Align = "left";
			}
		}
		
        if(this.m_chart.m_type == "Bar" || this.m_chart.m_type == "Plot" || this.m_chart.m_type == "GroupBar"){
        	var textDataLabel = drawSVGText(tx, ty, this.m_ySeriesData, color, Align, "middle", this.datalabelProperties.dataLabelRotation);
     	    //textDataLabel.setAttribute("style", "font-family:" + selectGlobalFont(this.datalabelProperties.datalabelFontFamily) + ";font-style:" + this.datalabelProperties.datalabelFontStyle + ";font-size:" + this.m_chart.fontScaling(this.datalabelProperties.dataLabelFontSize) + "px;font-weight:" + this.datalabelProperties.datalabelFontWeight + ";text-decoration:" + "none" + ";");
        	 /** Datalabel issue with SVG component **/
        	var seriesIndex = $("#draggableDiv"+this.m_chart.m_objectId +" .datalabelgrp"+this.m_chart.m_referenceid).last()[0].getAttribute('data-fieldIndex');
        	$("#datalabelgrp" + seriesIndex + this.m_chart.m_objectid).append(textDataLabel);
        	
        	/** Added below condition for  creating background rect for datalabels**/
        	if(IsBoolean(this.datalabelProperties.datalabelBackgroundRect)){
				this.m_chart.m_datalablebackgroundrect = (IsBoolean(this.datalabelProperties.datalabelBackgroundRect)) ? true : this.m_chart.m_datalablebackgroundrect;

        		var newRect = document.createElementNS(NS, "rect");
        		var bboxr = textDataLabel.getBBox();
        		var width = bboxr.width;
        		var height = bboxr.height;
        					 	/*newRect.attr({
        				    		"fill": "rgba(121,121,249,0)",
        							"stroke": "#000"
        				        });*/
        		newRect.setAttribute("fill", this.datalabelProperties.datalabelBackgroundRectColor);
        		newRect.setAttribute("stroke", this.datalabelProperties.datalabelStrokeColor);
        		newRect.setAttribute("x", bboxr.x-width/4);
        		newRect.setAttribute("y", bboxr.y-height/8);
        		newRect.setAttribute("rx", "2");
        	    newRect.setAttribute("ry", "2");
        		newRect.setAttribute("width", width*3/2);
        		newRect.setAttribute("height", height*5/4);
        		if (this.datalabelProperties.dataLabelRotation !== "" && this.datalabelProperties.dataLabelRotation !== undefined && this.datalabelProperties.dataLabelRotation !== 0)
        			newRect.setAttribute("transform", "rotate(" + this.datalabelProperties.dataLabelRotation + " " + tx + "," + ty + ")");
        		
        		$("#datalabelgrp" + seriesIndex + this.m_chart.m_objectid).append(newRect);
        		$("#datalabelgrp" + seriesIndex + this.m_chart.m_objectid).append(textDataLabel);
        	}
        } else {
			/**DAS-698 */
		if(this.m_ySeriesData == "null"){
			this.m_ySeriesData= "";
		}
        this.ctx.fillText(this.m_ySeriesData, tx, ty);
        this.ctx.restore();
        }
    } catch (e) {
        console.log("issue in data label text drawing");
    }
};
ValueText.prototype.precisionRound = function(number, precision) {
	var factor = Math.pow(10, precision);
	return Math.round(number * factor) / factor;
}
/**@description draw Data Label Position**/
ValueText.prototype.setPositionDataLabel = function(StackHeight) {
    if (this.datalabelProperties.datalabelPosition == "Middle") {
        if ((!IsBoolean(this.m_chart.m_basezero) && (this.m_ySeriesActualData < 0))) {
            this.yPosition = this.yPosition * 1 - (StackHeight) / 2 - 20;
        } else {
			/*Das 830*/
            this.yPosition =  this.yPosition * 1 + (StackHeight) / 2 + 12;
        }
    } else {
        if ((!IsBoolean(this.m_chart.m_basezero) && (this.m_ySeriesActualData < 0))) {
            this.yPosition = this.yPosition = this.yPosition - this.m_stackHeight;
        } else {
            this.yPosition = this.yPosition = this.yPosition + this.m_stackHeight;
        }
    }
};
/**@description Bar & GroupBar Chart Data Label Alignment **/
ValueText.prototype.setAlignDataLabelBarChart = function(size, ySeriesActualData, StackHeight) {
    if (this.m_chart.m_chartbase == "chevron") {
        if (this.m_stackWidth > 31) {
            this.xPosition = this.xPosition + size.width / 2;
        } else if (this.m_stackWidth > 15) {
            this.xPosition = this.xPosition + size.width / 2;
        }
    }
    if (this.datalabelProperties.dataLabelTextAlign == "right") {
        if (!IsBoolean(this.m_chart.m_basezero) && (ySeriesActualData < 0)) {
			/**DAS-735 */
            (this.m_chart.m_allSeriesNames.length>1) ? tx = (size.width / 2 >= StackHeight) ? (this.xPosition * 1 + this.m_stackHeight - 5 - size.width / 4) : (this.xPosition * 1 + this.m_stackHeight  - (size.width/4)) : tx = (size.width / 2 >= StackHeight) ? (this.xPosition * 1 + this.m_stackHeight - 5 - size.width / 4) : (this.xPosition * 1 + this.m_stackHeight - (size.width/4));
        } else {
            (this.m_chart.m_allSeriesNames.length>1) ? tx = (size.width / 2 >= StackHeight) ? (this.xPosition * 1 + this.m_stackHeight + 5 + size.width / 4) : (this.xPosition * 1 + this.m_stackHeight - 5) : tx = (size.width / 2 >= StackHeight) ? (this.xPosition * 1 + this.m_stackHeight + 5 + size.width / 4) : (this.xPosition * 1 + this.m_stackHeight - 5);
        }

    } else if (this.datalabelProperties.dataLabelTextAlign == "center") {
    	if (!IsBoolean(this.m_chart.m_basezero) && (ySeriesActualData < 0)) {
			/**DAS-735 */
			(this.m_chart.m_allSeriesNames.length>1) ? tx = (size.width / 2 >= StackHeight) ? (this.xPosition * 1 + this.m_stackHeight - 5 - size.width / 2) : (this.xPosition + this.m_stackHeight - (size.width/2)) : tx = (size.width / 2 >= StackHeight) ? (this.xPosition * 1 + this.m_stackHeight - 5 - size.width / 2) : (this.xPosition + this.m_stackHeight - (size.width/2));
        } else {
			(this.m_chart.m_allSeriesNames.length>1) ? tx = (size.width / 2 >= StackHeight) ? (this.xPosition * 1 + this.m_stackHeight + 10 + size.width / 2) : (this.xPosition + this.m_stackHeight + (size.width/2)) : tx = (size.width / 2 >= StackHeight) ? (this.xPosition * 1 + this.m_stackHeight + 10 + size.width / 2) : (this.xPosition + this.m_stackHeight + (size.width/2));
        }
       
    } else {
        if (!IsBoolean(this.m_chart.m_basezero) && (ySeriesActualData < 0)) {
			/**DAS-735 */
			tx = this.xPosition * 1 + this.m_stackHeight + 5 - size.width;
		} else {
		/*DAS-902 on base type Rectangle and Data label position is top ,data label overlapping with the chart issue */
			if(this.m_chart.m_chartbase=='rectangle'){
				tx = this.xPosition * 1 + this.m_stackHeight + 5 + size.width +(this.m_stackWidth/4) + 10;
			}
            else{
				tx = this.xPosition * 1 + this.m_stackHeight + 5 + size.width;
			}
        }
    }
    return tx;
};

/**@description Recalculate X-position to avoid text overlap from axis**/
ValueText.prototype.textXpositionCalculation = function(tx, size, Align) {
    var textWidth = (Align == "center") ? size.width / 2 : ((Align == "left") ? size.width : 0);
    var Diff;
    if ((this.m_chart.m_endX - this.m_chart.m_startX) - 5 < size.width) {
        this.m_ySeriesData = "";
        return tx;
    } else if (tx - textWidth < this.m_chart.m_startX) {
        Diff = Math.abs(textWidth - (tx - this.m_chart.m_startX));
        return tx + Diff + 5;
    } else if (tx + textWidth > this.m_chart.m_endX) {
        Diff = Math.abs(textWidth - (this.m_chart.m_endX - tx));
        return tx - Diff - 5;
    } else {
        return tx;
    }
};

/**@description Recalculate Y-position to avoid text overlap from axis**/
ValueText.prototype.textYpositionCalculation = function(ty, size, Align) {
    var textWidth = (Align == "center") ? size.width / 2 : size.width;
    var Diff;
    if (((this.m_chart.m_startY - this.m_chart.m_endY) - 5 < size.width) && (this.m_chart.m_type !== "Column")) {
        this.m_ySeriesData = "";
        return ty;
    } else if ((Align !== "left") && (ty - textWidth < this.m_chart.m_endY) && (this.m_chart.m_type !== "Column")) {
        Diff = Math.abs(textWidth - (ty - this.m_chart.m_endY));
        return ty + Diff;
    } else if ((Align !== "right") && (ty + textWidth > this.m_chart.m_startY) && (this.m_chart.m_type !== "Column")) {
        Diff = Math.abs(textWidth - (this.m_chart.m_startY - ty));
        return ty - Diff;
    } else {
        return ty;
    }
};

ValueText.prototype.getFormattedText = function(value) {
    if (!isNaN(getNumericComparableValue(value))) {
        // added check for value is number or not otherwise return same string value
        var isCommaSeparated = (("" + value).indexOf(",") > 0) ? true : false;
        var signPosition = (this.datalabelProperties.datalabelFormaterPosition != "") ? this.datalabelProperties.datalabelFormaterPosition : "suffix";
        var precision = this.datalabelProperties.datalabelFormaterPrecision;
        var unit = this.datalabelProperties.datalabelFormaterCurrency;
        var secondUnit = this.datalabelProperties.datalabelFormaterUnit;
        var formatter = "Currency";
        var secondFormatter = "Number";
        var valueToBeFormatted = (precision === "default") ?
            (getNumericComparableValue(value) * 1) :
            (getNumericComparableValue(value) * 1).toFixed(precision);
        if (unit != "") {
            var formatterSymbol = this.m_chart.m_util.getFormatterSymbol(formatter, unit);
            var secondFormatterSymbol = this.m_chart.m_util.getFormatterSymbol(secondFormatter, secondUnit);
            /* To Add Number formatter */
            if (secondFormatterSymbol == "auto") {
                value = getNumericComparableValue(value);
                var symbol = getNumberFormattedSymbol(value * 1, unit);
                var val = getNumberFormattedNumericValue(value * 1, precision, unit);
                var text = this.m_chart.m_util.updateTextWithFormatter(val, "", precision);
                valueToBeFormatted = this.m_chart.m_util.addFormatter(text, symbol, "suffix");
            } else {
                var unitSymbol = secondFormatterSymbol;
                valueToBeFormatted = this.m_chart.m_util.updateTextWithFormatter(valueToBeFormatted, unitSymbol, precision);
                if (secondFormatterSymbol != "none" && secondFormatterSymbol != "" && secondFormatterSymbol != "") {
                    valueToBeFormatted = this.m_chart.m_util.addFormatter(valueToBeFormatted, secondFormatterSymbol, "suffix");
                }
            }
            /* To add Currency formatter */
            valueToBeFormatted = (valueToBeFormatted == "NaN" || valueToBeFormatted === "") ? "" : this.m_chart.m_util.addFormatter(getFormattedNumberWithCommas(valueToBeFormatted, this.m_chart.m_numberformatter) , formatterSymbol, signPosition);
            return valueToBeFormatted;
        } else {
            return (valueToBeFormatted == "NaN") ? value : valueToBeFormatted;
        }
    } else {
    	return value;
    	/** when this formatter is added, Jan is returning as EuroJan, or noneJan **/
//        return this.m_chart.m_util.addFormatter(value, this.datalabelProperties.datalabelFormaterCurrency, this.datalabelProperties.datalabelFormaterPosition);
    }
};

/************************* ValueText  ********************************/
function SVGValueTextSeries() {
    this.xPositionArray = [];
    this.yPositionArray = [];
    this.ctx = "";
    this.m_chart = "";
    this.m_ySeriesData = [];
    this.svgvalueText = [];
    this.datalabelProperties = "";
    this.m_ySeriesActualData = [];
    this.m_stackWidth;
    this.m_stackHeightArray;
    this.seriesChartType;
    this.MaxValue;
};

/** @description initialization of ValueTextSeries. **/
SVGValueTextSeries.prototype.init = function(xPositionArray, yPositionArray, m_chart, yseriesData, datalabel, ySeriesActualData, stackWidth, stackHeight, seriesChartType, max) {
    this.m_chart = m_chart;
    this.ctx = this.m_chart.ctx;
    this.xPositionArray = xPositionArray;
    this.yPositionArray = yPositionArray;
    this.m_ySeriesData = yseriesData;
    this.datalabelProperties = datalabel;
    this.m_ySeriesActualData = ySeriesActualData;
    this.valueText = [];
    this.m_stackWidth = stackWidth;
    this.MaxValue = max;
    this.m_stackHeightArray = stackHeight;
    if (this.m_stackHeightArray == undefined) {
        this.m_stackWidth = 0;
        this.m_stackHeightArray = 0;
    }
    this.seriesChartType = seriesChartType;

    for (var i = 0, length = this.xPositionArray.length; i < length; i++) {
        this.valueText[i] = new SVGValueText();
        this.valueText[i].init(this.xPositionArray[i], this.yPositionArray[i], this.ctx, this.m_chart, this.m_ySeriesData[i], this.datalabelProperties, this.m_ySeriesActualData[i], this.m_stackWidth, this.m_stackHeightArray[i], this.seriesChartType, this.MaxValue);
    }
};

function SVGValueText() {

    this.base = ValueText;
    this.base();
};
SVGValueText.prototype = new ValueText;
SVGValueText.prototype.drawValueText = function(i) {
    var temp = this;
    var xspace = 15;
    var yspace = 10;
    var paddingWithRotation = 0;
    var paddingWithoutRotation = 0;
    var ySeriesData = (getNumericComparableValue(this.m_ySeriesData)) * 1;
    var ySeriesActualData = (getNumericComparableValue(this.m_ySeriesActualData));
    this.m_ySeriesData = this.getFormattedText(this.m_ySeriesData);
    var text = this.m_ySeriesData;
    /*DAS-934 Centering the label horizontally along the bar.*/
    this.m_stackWidth = (this.m_chart.m_columntype == "clustered" ) ? this.m_stackWidth*this.m_chart.clusteredbarpadding : this.m_stackWidth;

    /**Added to mesaure the font size with all the font properties.*/
    this.ctx.font = this.datalabelProperties.datalabelFontStyle + " " + this.datalabelProperties.datalabelFontWeight + " " +
    				this.m_chart.fontScaling(this.datalabelProperties.dataLabelFontSize) + "px " + selectGlobalFont(this.datalabelProperties.datalabelFontFamily);
    var size = this.ctx.measureText(text);
    var position = this.datalabelProperties.datalabelPosition;
    position = (size.width / 2 >= this.m_stackHeight) ? ("Top") : (position);
    if (this.m_chart.m_overlappeddatalabelarrayY[i] === undefined) {
        this.m_chart.m_overlappeddatalabelarrayY[i] = [];
        this.m_chart.m_overlappeddatalabelarrayX[i] = [];
    }
    if (((!IsBoolean(this.m_chart.m_basezero)) || (!IsBoolean(this.m_chart.m_secondaxisbasezero))) && (ySeriesActualData * 1 < 0)) {
        var YSpace = (size.width / 2) * 1 + yspace;
        yspace = 10;
        if (this.seriesChartType == "column") {
        	if ((position == "Top")&&(this.yPosition < this.m_chart.getEndY())) {
        		this.m_stackHeight = this.m_stackHeight - (this.m_chart.getEndY() - this.yPosition);
        		this.yPosition = this.m_chart.getEndY() + this.m_stackHeight;
        	}else{
        		this.yPosition = (this.m_stackHeight >= 0)?(this.yPosition + this.m_stackHeight):(this.yPosition - this.m_stackHeight);
        	//added this condition as stackheight is negative for group column for negative vlaues.
        	}
        }
    } else {
        yspace = -10;
        YSpace = -(size.width / 2) * 1 + yspace;
    }
    if ((this.seriesChartType == "column") && (position !== "Top")) {
        this.setPositionDataLabel();
    } else if (this.seriesChartType !== "column") {
        /**Added for position feature in Area and line chart*/
        if (((!IsBoolean(this.m_chart.m_basezero)) || (!IsBoolean(this.m_chart.m_secondaxisbasezero))) && (ySeriesActualData < 0)) {
            (position == "Top") ? (yspace = 10) : ((position == "Middle") ? (yspace = 0) : (yspace = -10));
        } else {
            (position == "Top") ? (yspace = -10) : ((position == "Middle") ? (yspace = 0) : (yspace = 10));
        }
    }
    var color = this.datalabelProperties.dataLabelFontColor;
    
    if ((this.datalabelProperties.dataLabelRotation == "-90" || this.datalabelProperties.dataLabelRotation == "90") && (this.datalabelProperties.dataLabelTextAlign == "left")) {
        var tx = (this.xPosition * 1 + this.m_stackWidth / 2) + (this.m_stackWidth / 5);
        var ty = (this.yPosition * 1 + YSpace);
        var Align = "center";
    } else if ((this.datalabelProperties.dataLabelRotation == "-90" || this.datalabelProperties.dataLabelRotation == "90") && (this.datalabelProperties.dataLabelTextAlign == "right")) {
        var tx = (this.xPosition * 1 + this.m_stackWidth / 2) - (this.m_stackWidth / 5);
        var ty = (this.yPosition * 1 + YSpace);
        var Align = "center";
    } else if ((this.datalabelProperties.dataLabelRotation == "-90" || this.datalabelProperties.dataLabelRotation == "90") && (this.datalabelProperties.dataLabelTextAlign == "center")) {
        var tx = (this.xPosition * 1 + this.m_stackWidth / 2.5);
        if (size.width >= 28) {
            var ty = (this.yPosition * 1 + YSpace);
        } else {
            var ty = (this.yPosition * 1 + 2 * yspace);
        }
        var Align = this.datalabelProperties.dataLabelTextAlign;

    } else {
    	//yspace = IsBoolean(ySeriesActualData * 1 < 0) ? 15 : -10;
        var tx = (this.xPosition * 1 + this.m_stackWidth / 2);
        var ty = (this.yPosition * 1 + yspace);
        var Align = this.datalabelProperties.dataLabelTextAlign;
    }
    
    

    if ((!IsBoolean(this.m_chart.m_basezero)) && (ySeriesActualData * 1 < 0)) {
        var minimumDrawLength = this.m_chart.m_startY - ty;
        var padding = (minimumDrawLength < -5) ? minimumDrawLength - 10 : -20;
        paddingWithRotation = -size.width / 2 + padding;
        paddingWithoutRotation = padding;
        if (ty >= this.m_chart.m_startY) {
            ty = (this.datalabelProperties.dataLabelRotation !== "0") ? (this.m_chart.m_startY - size.width / 2 - this.datalabelProperties.dataLabelFontSize) : ( this.m_chart.m_startY + paddingWithoutRotation);
        } else {
            ty = (((this.datalabelProperties.dataLabelRotation !== "0") && (minimumDrawLength < size.width / 2)) ? (ty + paddingWithRotation) : (((this.datalabelProperties.dataLabelRotation == "0") && (minimumDrawLength <= 5)) ? (ty + paddingWithoutRotation) : ty));
        }
    } else {
        ty = (ty < 1) ? ty * (-1) : ty;
        var minimumDrawLength = ty - this.m_chart.m_endY;
        paddingWithRotation = size.width / 2 + 10;
        paddingWithoutRotation = 20;
        if (ty <= this.m_chart.m_endY) {
            ty = ((this.datalabelProperties.dataLabelRotation !== "0") ? (this.m_chart.m_endY + size.width / 2 + this.datalabelProperties.dataLabelFontSize) :  (this.m_chart.m_endY + paddingWithoutRotation));
            color = this.datalabelProperties.dataLabelDefaultFontColor;
        } else {
            ty = (((this.datalabelProperties.dataLabelRotation !== "0") && (minimumDrawLength < size.width / 2)) ? (ty + paddingWithRotation) : (((this.datalabelProperties.dataLabelRotation == "0") && (minimumDrawLength <= 5)) ? (ty + paddingWithoutRotation) : ty));
        }
    }
    /*DAS-466 groupcolumn second axisbasezero is 0 which return secondaxisbasezero false when basezero is enabled
    if (IsBoolean(this.m_chart.m_basezero) && (IsBoolean(this.m_chart.m_secondaxisbasezero)) && ((ySeriesData < 0) || (ySeriesActualData < 0))) {*/
    if (IsBoolean(this.m_chart.m_basezero) && (IsBoolean(this.m_chart.m_secondaxisbasezero) || this.m_chart.m_secondaxisbasezero == 0) && ((ySeriesData < 0) || (ySeriesActualData < 0))) {
     	this.m_ySeriesData = "";
     }
	 /*
	 if (IsBoolean(this.m_chart.m_basezero) && ((ySeriesData < 0) || (ySeriesActualData < 0)) && (this.m_chart.m_type == "Timeline" )) {
	             this.m_ySeriesData = "";
	 }*/

     /*DAS-466 if min/max from zero to whatever ,in this case negative datalabel point should not show */
     if (!IsBoolean(this.m_chart.m_basezero) && (ySeriesData < 0) && (!IsBoolean(this.m_chart.m_autoaxissetup)) && this.m_chart.m_minimumaxisvalue == 0) {
     	this.m_ySeriesData = "";
     }
     if(minimumDrawLength<=5){
		 color = this.datalabelProperties.dataLabelDefaultFontColor;
	 }
        
    this.m_chart.m_overlappeddatalabelarrayY[i].push(ty);
    this.m_chart.m_overlappeddatalabelarrayX[i].push(tx);
    /**Added to remove overlapping issue of data label*/
    if (this.m_chart.m_overlappeddatalabelarrayY[i].length > 1) {
        var length = this.m_chart.m_overlappeddatalabelarrayY[i].length - 1;
        for (var k = 0; length > k; k++) {
            var xValue = this.precisionRound(this.m_chart.m_overlappeddatalabelarrayX[i][k], 4);
            var yValue = this.precisionRound(this.m_chart.m_overlappeddatalabelarrayY[i][k], 4);
            var xValuePlot = this.precisionRound(tx, 4);
            var yValuePlot = this.precisionRound(ty, 4);
            var dataDraw = (this.seriesChartType == "column") ? ((this.m_chart.m_columntype !== "stacked") && (this.m_chart.m_columntype !== "100%") ? true : false ): true;
            if ((xValue === xValuePlot) && (yValue === yValuePlot) && dataDraw && (minimumDrawLength == 0)) {
                this.m_ySeriesData = "";
                break;
            } else if ((xValue === xValuePlot) && (yValuePlot > yValue - 15 && yValuePlot < yValue + 15)) {
                ty = yValuePlot - (this.m_chart.fontScaling(this.datalabelProperties.dataLabelFontSize) + 5);
                if (((!IsBoolean(this.m_chart.m_basezero)) || (!IsBoolean(this.m_chart.m_secondaxisbasezero))) && (this.m_ySeriesActualData < 0)) {
                    ty = (((this.datalabelProperties.dataLabelRotation !== "0") && (minimumDrawLength < size.width / 2)) ? (yValuePlot + paddingWithRotation + this.m_chart.fontScaling(this.datalabelProperties.dataLabelFontSize) + 5) : (((this.datalabelProperties.dataLabelRotation == "0") && (minimumDrawLength <= 1)) ? (ty - paddingWithoutRotation - this.m_chart.fontScaling(this.datalabelProperties.dataLabelFontSize) - 5) : ty));
                } else {
                    ty = (((this.datalabelProperties.dataLabelRotation !== "0") && (minimumDrawLength < size.width / 2)) ? (yValuePlot + paddingWithRotation - this.m_chart.fontScaling(this.datalabelProperties.dataLabelFontSize) - 5) : (((this.datalabelProperties.dataLabelRotation == "0") && (minimumDrawLength <= 1)) ? (ty + paddingWithoutRotation + this.m_chart.fontScaling(this.datalabelProperties.dataLabelFontSize) + 5) : ty));
                }
                this.m_chart.m_overlappeddatalabelarrayY[i][length] = ty;
            }
        }
    } 

    var textDataLabel = drawSVGText(tx, ty, this.m_ySeriesData, color, Align, "middle", this.datalabelProperties.dataLabelRotation);
    //textDataLabel.setAttribute("style", "font-family:" + selectGlobalFont(this.datalabelProperties.datalabelFontFamily) + ";font-style:" + this.datalabelProperties.datalabelFontStyle + ";font-size:" + this.m_chart.fontScaling(this.datalabelProperties.dataLabelFontSize) + "px;font-weight:" + this.datalabelProperties.datalabelFontWeight + ";cursor: default;text-decoration:" + "none" + ";");
    var seriesIndex = $(".datalabelgrp"+this.m_chart.m_referenceid).last()[0].getAttribute('data-fieldIndex');
    $("#datalabelgrp" + seriesIndex + temp.m_chart.m_objectid).append(textDataLabel);
    
    /** Added below condition for  creating background rect for datalabels**/
    if(IsBoolean(this.datalabelProperties.datalabelBackgroundRect)){
	  this.m_chart.m_datalablebackgroundrect = (IsBoolean(this.datalabelProperties.datalabelBackgroundRect)) ? true : this.m_chart.m_datalablebackgroundrect;
    	
      var newRect = document.createElementNS(NS, "rect");
      var bboxr = textDataLabel.getBBox();
      var width = bboxr.width;
      var height = bboxr.height;
     	/*newRect.attr({
    		"fill": "rgba(121,121,249,0)",
    		"stroke": "#000"
        });*/
      newRect.setAttribute("fill", this.datalabelProperties.datalabelBackgroundRectColor);
      newRect.setAttribute("stroke", this.datalabelProperties.datalabelStrokeColor);
      newRect.setAttribute("x", bboxr.x - width/4);
      newRect.setAttribute("y", bboxr.y - height/8);
      newRect.setAttribute("rx", "2");
      newRect.setAttribute("ry", "2");
      newRect.setAttribute("width", width*3/2);
      newRect.setAttribute("height", height*5/4);
      if (this.datalabelProperties.dataLabelRotation !== "" && this.datalabelProperties.dataLabelRotation !== undefined && this.datalabelProperties.dataLabelRotation !== 0)
			newRect.setAttribute("transform", "rotate(" + this.datalabelProperties.dataLabelRotation + " " + tx + "," + ty + ")");
      
      $("#datalabelgrp" + seriesIndex + this.m_chart.m_objectid).append(newRect);
      $("#datalabelgrp" + seriesIndex + this.m_chart.m_objectid).append(textDataLabel);
    }
};

SVGValueText.prototype.precisionRound = function(number, precision) {
	var factor = Math.pow(10, precision);
	return Math.round(number * factor) / factor;
}
SVGValueText.prototype.setPositionDataLabel = function() {
	var AllNeg = false;
	if ((this.MaxValue<=0)&&(this.yPosition < 0)) {
		this.m_stackHeight = this.m_stackHeight - (this.m_chart.getEndY() - this.yPosition);
		this.yPosition = this.m_chart.getEndY() + this.m_stackHeight;
		AllNeg = true;
	}
    if (this.datalabelProperties.datalabelPosition == "Middle") {
        if (((!IsBoolean(this.m_chart.m_basezero)) || (!IsBoolean(this.m_chart.m_secondaxisbasezero))) && (this.m_ySeriesActualData < 0)) {
        	if(AllNeg){
        		this.yPosition = this.yPosition * 1 - this.m_stackHeight - (this.m_stackHeight) / 2 - 20;
        	}else{
        		this.yPosition = this.yPosition * 1 - (this.m_stackHeight) / 2 - 20;
        	}
        } else {
			/*DAS 830*/
            this.yPosition = (this.m_stackHeight) / 2 + this.yPosition * 1 + 12;
        }
    } else {
        if (((!IsBoolean(this.m_chart.m_basezero)) || (!IsBoolean(this.m_chart.m_secondaxisbasezero))) && (this.m_ySeriesActualData < 0)) {
        	if(AllNeg){
        		this.yPosition = this.m_chart.getEndY() - this.m_stackHeight;
        	}else{
        		this.yPosition = this.yPosition - this.m_stackHeight;
        	}
        } else {
            this.yPosition = this.yPosition + this.m_stackHeight;
        }
    }
};
SVGValueTextSeries.prototype.drawSVGValueTextSeries = function() {
	this.m_overlappeddatalabelarrayY = [];
	this.m_overlappeddatalabelarrayX = [];
	var VisibleDataLabel = this.getVisibleDataLabel();
    for (var i = 0,length = this.xPositionArray.length; i < length; i++) {
    	/**Added to resolve filter issues*/
//    	if ((this.m_chart.m_overlappeddatalabelarrayY[i] !== undefined) && (this.m_chart.m_overlappeddatalabelarrayY[i].length >= VisibleDataLabel)) {
//    	    this.m_chart.m_overlappeddatalabelarrayY[i] = [];
//    	    this.m_chart.m_overlappeddatalabelarrayX[i] = [];
//    	}
    	/**Added for inrange and when Y position is less then 0*/
    	var YPosition = ((this.valueText[i].m_stackHeight !== undefined)&&(this.valueText[i].yPosition<0)||(this.valueText[i].MaxValue <= 0)) ? this.valueText[i].yPosition + this.valueText[i].m_stackHeight : this.valueText[i].yPosition;
    	var isInRange = ((YPosition > (this.m_chart.m_endY-1))&&(YPosition < (this.m_chart.m_startY+1))) ? true : false ;
    	if(!isNaN(this.valueText[i].m_ySeriesActualData)&&(this.valueText[i].m_ySeriesActualData!=="")&&isInRange){
    		/*DAS-366*/  
        	if (IsBoolean(this.valueText[i].datalabelProperties.hideDataLabel)) {
			    if (this.valueText[i].m_ySeriesActualData.toString() !== this.valueText[i].datalabelProperties.hideDataLabelText) {
			      this.valueText[i].drawValueText(i);
			    }
			  } else {
			    this.valueText[i].drawValueText(i);
			  }
    	}
    }
};
/**Added to resolve connection reload issues*/
SVGValueTextSeries.prototype.getVisibleDataLabel = function() {
	var VisibleDataLabelArray = [];
	for(var key in this.m_chart.m_seriesDataLabelProperty){
		if (IsBoolean(this.m_chart.m_seriesVisibleArr[key])) {
			if (IsBoolean(this.m_chart.m_seriesDataLabelProperty[key].showDataLabel)){
				VisibleDataLabelArray.push(key);
			}
		}	
	}
	var VisibleDataLabelArrayLength = VisibleDataLabelArray.length;
	return VisibleDataLabelArrayLength;
}
/********************************** Stack *******************************************/
function Stack() {
	this.m_stackXPixel;
	this.m_stackYPixel;
	this.m_stackWidth;
	this.m_stackHeight;
	this.m_stackColor = [];
	this.m_showGradient;
	this.ctx = "";
	this.checkStroke = true;
	this.m_ySeriesData;
	this.m_chart;
	this.m_showDataLabel;
	this.fontstyle;
	this.fontweight;
	this.fontsize;
	this.fontfamily;
	this.fontcolor;
}

Stack.prototype.init = function(stackXPixel, stackYPixel, stackWidth, stackHeight, stackColor, strokeColor, showGradient, ctx, m_chartbase, stackPercentage, stackShowPercentFlag, stackPercentValueFlag, plotTrasparency, ySeriesData, m_chart) {
	this.ctx = ctx;
	this.m_chartbase = m_chartbase;
	this.m_stackXPixel = stackXPixel;
	this.m_stackYPixel = stackYPixel;
	this.m_stackWidth = stackWidth;
	this.m_stackHeight = stackHeight;
	if (this.m_stackColor != undefined)
		this.m_stackColor = stackColor;
	this.m_strokeColor = strokeColor;
	this.m_showGradient = showGradient;
	this.m_stackPercentage = stackPercentage;
	this.m_showPercentageFlag = stackShowPercentFlag;
	this.m_stackPercentValueFlag = stackPercentValueFlag;
	this.m_stackPlotTrasparency = plotTrasparency;
	this.checkStroke = !(this.m_stackPlotTrasparency * 1 == 0);
	this.m_ySeriesData = ySeriesData;
	this.m_chart = m_chart;
};

Stack.prototype.drawStack = function() {
	if (IsBoolean(isNaN(this.m_stackYPixel))) {
		this.m_stackYPixel = 0;
		this.m_stackHeight = 0;
	}
	var fillColor = this.getFillColor();
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.fillStyle = ((this.m_chartbase == "cylinder") || (this.m_chartbase == "plane") || (this.m_chartbase == "rectangle")) ? (hex2rgb(fillColor, this.m_stackPlotTrasparency)) : (fillColor);
	this.ctx.rect(this.m_stackXPixel, this.m_stackYPixel, this.m_stackWidth, this.m_stackHeight);
	this.ctx.strokeStyle = (this.m_chart.m_type == "Histogram") ? this.m_chart.m_borderstrokecolor : ColorLuminance(this.m_stackColor, -0.1);
	//this.ctx.lineWidth="1";
	this.ctx.lineWidth = "0.4";
	if (IsBoolean(this.checkStroke) && this.m_stackHeight * 1 > 0)
		this.ctx.stroke();
	this.ctx.fill();
	this.drawText();
	this.ctx.restore();
	this.ctx.closePath();

	if (this.m_chartbase == "cylinder") {
		this.makeCylinder(this.m_stackXPixel, this.m_stackYPixel, this.m_stackWidth, this.m_stackHeight, this.m_stackColor);
	}
};

Stack.prototype.drawText = function() {
	var xspace = 5;
	var yspace = 10;
	try {
		if (IsBoolean(this.m_showPercentageFlag)) {
			this.ctx.fillStyle = "black";
			if (IsBoolean(this.m_stackPercentValueFlag)) {
				this.ctx.fillText(parseInt(this.m_stackPercentage) + "%", (this.m_stackXPixel * 1 + (this.m_stackWidth * 2 / 3) + xspace * 1), (this.m_stackYPixel * 1 - yspace * 1));
			} else {
				this.ctx.fillText(parseInt(this.m_stackPercentage), (this.m_stackXPixel * 1 + (this.m_stackWidth * 2 / 3) + xspace * 1), (this.m_stackYPixel * 1 - yspace * 1));
			}
		}

	} catch (e) {
		console.log("issue in data label text drawing");
	}
};
Stack.prototype.shadow = function() {
	var grd = this.createGradient();
	this.ctx.beginPath();
	this.ctx.fillStyle = grd;
	this.ctx.strokeStyle = "#000000";
	this.ctx.save();
	this.ctx.rect(this.m_stackXPixel, this.m_stackYPixel, this.m_stackWidth, this.m_stackHeight);
	this.ctx.shadowColor = "#ccc";
	this.ctx.shadowBlur = 5;
	this.ctx.shadowOffsetX = 1;
	this.ctx.shadowOffsetY = 0;
	this.ctx.fill();
	this.ctx.restore();
};

Stack.prototype.getFillColor = function() {
	var grd = this.m_stackColor;
	switch (this.m_chartbase) {
		case "rectangle":
			this.makeCuboid(this.m_stackXPixel, this.m_stackYPixel, this.m_stackWidth, this.m_stackHeight, this.m_stackColor);
			break;
		case "gradient1":
			grd = this.createGradient1(this.m_stackXPixel, this.m_stackYPixel, this.m_stackWidth, this.m_stackHeight, this.m_stackColor);
			break;
		case "gradient2":
			grd = this.createGradient2(this.m_stackXPixel, this.m_stackYPixel, this.m_stackWidth, this.m_stackHeight, this.m_stackColor);
			break;
		case "gradient3":
			grd = this.createGradient3(this.m_stackXPixel, this.m_stackYPixel, this.m_stackWidth, this.m_stackHeight, this.m_stackColor);
			break;
		default:
			grd = grd;
			break;
	}
	return grd;
};

Stack.prototype.createGradient1 = function(x, y, w, h, color) {
	/*var grd=this.ctx.createLinearGradient(x,y,x,(y*1+h*1));
	var color0=this.hex2rgb(color,0.5);
	grd.addColorStop(0,color);
	grd.addColorStop(1,color0);
	return grd;*/

	var gradient = this.ctx.createLinearGradient(x, y, (x * 1 + w * 1), y);
	var color0 = hex2rgb(color, this.m_stackPlotTrasparency);
	gradient.addColorStop(0.1, color0);
	gradient.addColorStop(0.5, ColorLuminance(color, 0.5));
	gradient.addColorStop(1, color0);
	return gradient;
};

Stack.prototype.createGradient2 = function(x, y, w, h, color) {
	/*var grd=this.ctx.createLinearGradient(x,y,(x*1+w*1),y);
	var color0=this.hex2rgb(color,0.70);
	var color1=this.hex2rgb(color,0.15);
	grd.addColorStop(0,color);
	grd.addColorStop(0.1,color0);
	grd.addColorStop(0.48,color);
	grd.addColorStop(0.5,"#000");
	grd.addColorStop(0.52,color);
	grd.addColorStop(0.98,color1);
	grd.addColorStop(1,color);
	return grd;*/

	var gradient = this.ctx.createLinearGradient(x, y, (x * 1 + w * 1), y);
	var color0 = hex2rgb(color, this.m_stackPlotTrasparency);
	gradient.addColorStop(0, color0);
	gradient.addColorStop(0.15, color0);
	gradient.addColorStop(0.5, ColorLuminance(color, -0.15));
	gradient.addColorStop(0.85, color0);
	gradient.addColorStop(1, color0);
	return gradient;
};
Stack.prototype.createGradient3 = function(x, y, w, h, color) {
	/*var grd=this.ctx.createLinearGradient(x,y,(x*1+w*1),y);
	var color0=this.hex2rgb(color,0.35);
	grd.addColorStop(0,color)
	grd.addColorStop(0.15,color);
	grd.addColorStop(0.5,color0);
	grd.addColorStop(0.85,color);
	grd.addColorStop(1,color);
	return grd;*/

	var gradient = this.ctx.createLinearGradient(x, y, (x * 1 + w * 1), y);
	var color0 = hex2rgb(color, this.m_stackPlotTrasparency);
	gradient.addColorStop(0.1, color0);
	gradient.addColorStop(0.15, color0);
	gradient.addColorStop(0.5, ColorLuminance(color, 0.3));
	gradient.addColorStop(0.85, color0);
	gradient.addColorStop(1, color0);
	return gradient;
};

Stack.prototype.makeCuboid = function(x, y, w, h, color) {
	var slant = 0;
	if (h > 0)
		slant = w / 4;
	this.ctx.beginPath();
	this.ctx.moveTo(x, y - 1);
	this.ctx.lineTo(x + slant, y - slant);
	this.ctx.lineTo(x + slant + w, y - slant);
	this.ctx.lineTo(x + slant + w, y - slant + h + 1);
	this.ctx.lineTo(x + w, y + h + 1);
	this.ctx.fillStyle = hex2rgb(color, this.m_stackPlotTrasparency);
	this.ctx.fill();
	this.ctx.lineWidth = "0.2";
	this.ctx.lineTo(x + w, y + h + 1);
	this.ctx.lineTo(x + w, y + 1);
	this.ctx.moveTo(x, y);
	this.ctx.lineTo(x + w, y);
	this.ctx.lineTo(x + w + 1 + slant, y - slant);
	this.ctx.strokeStyle = hex2rgb(color, this.m_stackPlotTrasparency);
	if (IsBoolean(this.checkStroke))
		this.ctx.stroke();
	this.ctx.closePath();
};
Stack.prototype.makeCylinder = function(x, y, w, h, color) {
	var xpick = 3;
	var ypick = 5;
	var strokeColor = hex2rgb(color, this.m_stackPlotTrasparency);

	this.ctx.beginPath();
	this.ctx.strokeStyle = "#fff";
	this.ctx.fillStyle = strokeColor;
	this.ctx.moveTo(x, y);
	this.ctx.bezierCurveTo((x * 1 + w / xpick), (y * 1 + ypick), (x * 1 + w * 2 / xpick), (y * 1 + ypick), (x * 1 + w * 1), y);
	this.ctx.stroke();

	this.ctx.strokeStyle = hex2rgb(color, this.m_stackPlotTrasparency);
	this.ctx.moveTo(x, y);
	this.ctx.bezierCurveTo((x * 1 + w / xpick), (y * 1 - ypick), (x * 1 + w * 2 / xpick), (y * 1 - ypick), (x * 1 + w * 1), y);
	this.ctx.fill();
	if (IsBoolean(this.checkStroke))
		this.ctx.stroke();
	this.ctx.closePath();
};

Stack.prototype.hex2rgb = function(hex, opacity) {
	var rgb = hex.replace("#", "").match(/(.{2})/g);
	var i = 3;
	while (i--) {
		rgb[i] = parseInt(rgb[i], 16);
	}
	if (typeof opacity === "undefined") {
		return "rgb(" + rgb.join(", ") + ")";
	}
	return "rgba(" + rgb.join(", ") + ", " + opacity + ")";
};
//# sourceURL=Chart.js