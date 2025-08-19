/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: MitoPlotChart.js
 * @description MitoPlotChart
 **/
function MitoPlotChart(m_chartContainer, m_zIndex) {
    this.base = Chart;
    this.base();
    this.m_x = 400;
    this.m_y = 240;
    this.m_width = 300;
    this.m_height = 240;
    this.m_radius = 0;
    this.m_centerX = 0;
    this.m_centerY = 0;
    this.m_aggregation = "";
    this.m_linewidth = 40;
    this.m_categoryNames = [];
    this.m_seriesNames = [];
    this.m_categoryData = [];
    this.m_seriesData = [];
    this.m_markeravail = false;
    this.m_startAngle = [];
    this.m_endAngle = [];
    this.m_slice = [];
    this.m_xaxis = null;
    this.m_yAxis = new Yaxis();
    this.m_calculation = new Mitoplotcalculation();
    this.m_chartContainer = m_chartContainer;
    this.m_zIndex = m_zIndex;
    this.m_percentageInnerCutout = 0;
    this.m_isCategoryAvailable = true;
    this.m_luminance = 0.5;
    this.m_seriescolors = {};
    this.m_strokecolor = "#000000"; /**Stroke color has been added to provide color stroke line in simple pie chart with base type plain */
    this.m_canvastype = "svg"
    /* *slice label property**/
    this.m_showslicevalue = "false";
    this.m_slicelimit = "false";
    this.m_noofslices = "5";
    this.m_slicefontsize = "12";
    this.m_slicelabelfontfamily = "Roboto";
    this.m_slicelabelfontweight = "normal";
    this.m_slicelabelfontstyle = "normal";

    this.m_globalFontSize = 0;
    this.m_slicelabelfontsize = "";
    this.noOfTextOutSide = 0;
    this.m_originalRadius = 0;
    this.m_maxtooltiprows = 10;
    this.m_isSpaceForTextDrawing = true;
    this.calculatedPercent = [];
    this.m_percentlabelposition = 75;
    this.m_seriesDataLabel = [];
    this.m_seriesDataLabelProperty = [];
    this.m_enableanimation = "false";
    this.m_pieanimationduration = 0.5;
    this.m_slicingdistance = 5;
    this.m_strokelinewidth = 1;
    this.m_datalabelmarkerlength = 10;
};
/** @description Making prototype of chart class to inherit its properties and methods into MitoPlotChart chart **/
MitoPlotChart.prototype = new Chart();

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
MitoPlotChart.prototype.initCanvas = function() {
    var temp = this;
    $("#draggableDiv" + temp.m_objectid).remove();
    this.initializeDraggableDivAndCanvas();
};

/** @description  initialization of draggable div and its inner Content **/
MitoPlotChart.prototype.initializeDraggableDivAndCanvas = function() {
    this.setDashboardNameAndObjectId();
    this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
    this.createDraggableCanvas(this.m_draggableDiv);
    this.setCanvasContext();

    $("#draggableCanvas" + this.m_objectid).hide();
    this.createSVG();
};

/** @description createSVG Method used for create SVG element for Chart and Scale **/
MitoPlotChart.prototype.createSVG = function() {
    var temp = this;
    $("#draggableSvgDiv" + this.m_objectid).remove();
    var draggableSvgDiv = document.createElement("div");
    draggableSvgDiv.id = "draggableSvgDiv" + this.m_objectid;
    draggableSvgDiv.style.height = this.m_height + "px";
    draggableSvgDiv.style.width = this.m_width + "px";
    this.m_draggableDiv.appendChild(draggableSvgDiv);
    this.paper = Raphael("draggableSvgDiv" + this.m_objectid, this.m_width, this.m_height);
    this.svgContainerId = "svgContainer" + this.m_objectid;
    this.paper.canvas.setAttribute("id", this.svgContainerId);
    this.paper.canvas.setAttribute("class", "svg_chart_container");
};
/** @description removeSVG method removes the already present svg **/
MitoPlotChart.prototype.removeSVG = function() {
    var temp = this;
    $("#" + temp.svgContainerId).remove();
};
/** @description This method will parse the chart JSON and create a container **/
MitoPlotChart.prototype.setProperty = function(chartJson) {
    this.ParseJsonAttributes(chartJson.Object, this);
    this.initCanvas();
};

/** @description This method will set class variable values with JSON values **/
MitoPlotChart.prototype.ParseJsonAttributes = function(jsonObject, nodeObject) {
    this.ParsePropertyJsonAttributes(jsonObject, nodeObject);
};
/** @description Making prototype of Title and SubTitle according to canvas or svg**/
MitoPlotChart.prototype.updateSvgClassRef = function() {
    this.m_title = new svgTitle(this);
    this.m_subTitle = new svgSubTitle();
};
/** @description Iterate through chart JSON and set class variable values with JSON values **/
MitoPlotChart.prototype.ParsePropertyJsonAttributes = function(jsonObject, nodeObject) {
    this.chartJson = jsonObject;
    this.updateSvgClassRef();
    for (var key in jsonObject) {
        if (key == "Chart") {
            for (var chartKey in jsonObject[key]) {
                switch (chartKey) {
                    case "xAxis":
                    case "yAxis":
                        break;
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

/** @description Getter Method of DataProvider **/
MitoPlotChart.prototype.getDataProvider = function() {
    return this.m_dataProvider;
};

/** @description Getter Method of FieldsJson **/
MitoPlotChart.prototype.getFieldsJson = function() {
    return this.m_fieldsJson;
};

/** @description Setter Method of Fields according to fieldType **/
MitoPlotChart.prototype.setFields = function(fieldsJson) {
    this.m_fieldsJson = fieldsJson;
    var categoryJson = [];
    var seriesJson = [];
    var orientationJson = [];
    var startJson = [];
    var stopJson = [];
    var markerJson = [];
    for (var i = 0, length = this.m_fieldsJson.length; i < length; i++) {
        var fieldType = this.getProperAttributeNameValue(this.m_fieldsJson[i], "Type");
        switch (fieldType) {
            case "Category":
                categoryJson.push(this.m_fieldsJson[i]);
                break;
            case "Series":
                seriesJson.push(this.m_fieldsJson[i]);
                break;
            case "Orientation":
                orientationJson.push(this.m_fieldsJson[i]);
                break;
            case "Start":
                startJson.push(this.m_fieldsJson[i]);
                break;
            case "Stop":
                stopJson.push(this.m_fieldsJson[i]);
                break;
            case "Marker":
                markerJson.push(this.m_fieldsJson[i]);
                break;
            case "CalculatedField":
                seriesJson.push(this.m_fieldsJson[i]);
                break;
            default:
                break;
        }
    }
    this.setCategory(categoryJson);
    this.setSeries(seriesJson);
    this.setOrientation(orientationJson);
    this.setStartPoints(startJson);
    this.setStopPoints(stopJson);
    if (markerJson.length > 0) {
        this.m_markeravail = true;
        this.setDataLabel(markerJson);
    }
};

/** @description Setter Method of Category iterate for all category. **/
MitoPlotChart.prototype.setCategory = function(categoryJson) {
    this.m_categoryNames = [];
    this.m_categoryData = [];
    for (var i = 0, length = categoryJson.length; i < length; i++) {
        this.m_categoryNames[i] = this.getProperAttributeNameValue(categoryJson[i], "Name");
        this.m_categoryData[i] = this.getDataFromJSON(this.m_categoryNames[i]);
    }
};

/** @description Setter Method of Category iterate for all RNA type. **/
MitoPlotChart.prototype.setSeries = function(seriesJson) {
    this.m_seriesNames = [];
    this.m_colorarrmap = [];
    this.m_seriesData = [];
    this.m_xmlColor = this.m_seriescolor.split(",");
    for (var i = 0, length = seriesJson.length; i < length; i++) {
        this.m_seriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
        this.m_seriesData[i] = this.getDataFromJSON(this.m_seriesNames[i]);
    }
    for (var j = 0, k = 0, lengthNames = this.m_seriesData[0].length; j < lengthNames; j++) {
        if (this.m_seriescolors[this.m_seriesData[0][j]] === undefined) {
            this.m_seriescolors[this.m_seriesData[0][j]] = convertColorToHex(this.m_xmlColor[k]);
            k++;
        }
    }
};

/** @description Setter Method of Category iterate for Orientation. **/
MitoPlotChart.prototype.setOrientation = function(orientationJson) {
    this.m_orientation = [];
    this.m_orientationData = [];
    for (var i = 0, length = orientationJson.length; i < length; i++) {
        this.m_orientation[i] = this.getProperAttributeNameValue(orientationJson[i], "Name");
        this.m_orientationData[i] = this.getDataFromJSON(this.m_orientation[i]);
    }
};

/** @description Setter Method of Category iterate for Start Points. **/
MitoPlotChart.prototype.setStartPoints = function(startJson) {
    this.m_startpoints = [];
    this.m_startpointsData = [];
    for (var i = 0, length = startJson.length; i < length; i++) {
        this.m_startpoints[i] = this.getProperAttributeNameValue(startJson[i], "Name");
        this.m_startpointsData[i] = this.getDataFromJSON(this.m_startpoints[i]);
    }
};

/** @description Setter Method of Category iterate for Stop Points. **/
MitoPlotChart.prototype.setStopPoints = function(stopJson) {
    this.m_stoppoints = [];
    this.m_stoppointsData = [];
    for (var i = 0, length = stopJson.length; i < length; i++) {
        this.m_stoppoints[i] = this.getProperAttributeNameValue(stopJson[i], "Name");
        this.m_stoppointsData[i] = this.getDataFromJSON(this.m_stoppoints[i]);
    }
};
/** @description Setter Method of Category iterate for Data Label. **/
MitoPlotChart.prototype.setDataLabel = function(markerJson) {
    this.m_datalabelposition = [];
    this.m_seriesdatalabelproperty = [];
    this.m_datalabelpositionarr = [];
    this.m_datalabel = [];
    for (var i = 0, length = markerJson.length; i < length; i++) {
        this.m_datalabelposition[i] = this.getProperAttributeNameValue(markerJson[i], "Name");
        this.m_datalabelpositionarr[i] = this.getDataFromJSON(this.m_datalabelposition[i]);
        this.m_seriesdatalabelproperty[i] = this.getProperAttributeNameValue(markerJson[i], "DataLabelCustomProperties");
        if (IsBoolean(this.m_seriesdatalabelproperty[i].showDataLabel)) {
            this.m_datalabel[i] = this.getDataFromJSON(this.m_seriesdatalabelproperty[i].datalabelField);
        }
    }
};
/** @description Getter Method of Series Data. **/
MitoPlotChart.prototype.getSeriesData = function() {
    return this.m_seriesData;
};

/** @description Getter for Series Colors**/
MitoPlotChart.prototype.getSeriesColors = function() {
    return this.m_seriescolors;
};
/** @description Getter Method of Category Data. **/
MitoPlotChart.prototype.getCategoryData = function() {
    return this.m_categoryData;
};
/** @description Getter Method of Start Points. **/
MitoPlotChart.prototype.getStartData = function() {
    return this.m_startpointsData;
};
/** @description Getter Method of Stop Points. **/
MitoPlotChart.prototype.getStopData = function() {
    return this.m_stoppointsData;
};
/** @description Getter Method of Orientation **/
MitoPlotChart.prototype.getOrientation = function() {
    return this.m_orientationData;
};
/** @description Getter Method of Data Label Positions **/
MitoPlotChart.prototype.getDataLabelPosition = function() {
    return this.m_datalabelpositionarr;
};
/** @description Getter Method of All Fields Name **/
MitoPlotChart.prototype.getAllFieldsName = function() {
    return this.m_categoryNames;
};
/****************************************************************************/
/** @description initialization of MitoPlotChart. **/
MitoPlotChart.prototype.init = function() {
    this.createSVG();
    this.initMouseMoveEvent(this.m_chartContainer);
    this.initMouseClickEventForSVG(this.svgContainerId);
    this.isSeriesDataEmpty();
    this.m_chartFrame.init(this);
    this.m_title.init(this);
    this.m_subTitle.init(this);
    if (!IsBoolean(this.m_isEmptySeries)) {
        this.initializeCalculation();
        this.setSlice();
        if (this.m_markeravail) {
            this.setMitoDataLabel();
        }
    }
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};
/** @description initialize the calculation  of the MitoPlotChart. **/
MitoPlotChart.prototype.initializeCalculation = function() {
    this.m_calculation.init(this);
    this.m_yAxis.init(this, this.m_calculation);
};
MitoPlotChart.prototype.initializeToolTipProperty = function() {
    if (this.m_customtextboxfortooltip == "") {
        this.m_customtextboxfortooltip = {
            "dataTipTypeArray": "",
            "dataTipType": "None",
            "datatipData": ""
        }
    }
};

/** @description Setter Method of every slice calculation. **/
MitoPlotChart.prototype.setSlice = function() {
    var _seriesColor = this.getSeriesColors();
    this.m_startAngle = this.m_calculation.getStartAngle();
    this.m_endAngle = this.m_calculation.getEndAngle();
    this.m_strkelinewidth = 2; /**Stroke line has been added to provide a stroke between two slices in simple pie chart with base type plain */
    this.m_strokeangle = 0.0349066; /**Stroke Angle has been added to provide a border between slices this is in radian and it is equivalent to 2° */
    this.m_radius = this.m_calculation.radiusCalc();
    var seriesdata = this.getSeriesData();
    var orientation = this.getOrientation();
    this.m_centerX = this.centerX;
    this.m_centerY = this.centerY;
    this.m_slice = [];
    for (var count = 0, length = this.getCategoryData()[0].length; count < length; count++) {
        this.m_slice[count] = new MitoPlotSlice();
        this.m_slice[count].init(this.m_centerX, this.m_centerY, this.m_radius, this.m_startAngle[count], this.m_endAngle[count], _seriesColor, this.ctx, this.m_chartbase, this.m_luminance, this, this.m_strkelinewidth, this.m_strokecolor, this.m_strokeangle, seriesdata[0][count], orientation[0][count]);
    }
};

/** @description Setter Method of Data Label. **/
MitoPlotChart.prototype.setMitoDataLabel = function() {
    this.m_mitodatalabel = [];
    var ceterX = this.centerX,
        centerY = this.centerY,
        Radius = this.m_calculation.radiusCalc();
    Position = this.m_calculation.getdatalabelPosition();
    if (IsBoolean(this.m_seriesdatalabelproperty[0].showDataLabel)) {
        for (var count = 0, length = this.getDataLabelPosition()[0].length; count < length; count++) {
            this.m_mitodatalabel[count] = new MitoPlotDataLabel();
            this.m_mitodatalabel[count].init(Position[count], this.m_seriesdatalabelproperty[0], this.m_datalabel[0][count], ceterX, centerY, Radius, this);
        }
    }
};

/** @description Drawing of chart started by drawing different parts of chart like ChartFrame,Title,SubTitle. **/
MitoPlotChart.prototype.drawChart = function() {
    this.drawChartFrame();
    this.drawTitle();
    this.drawSubTitle();
    if (!IsBoolean(this.m_isEmptySeries)) {
        this.angleDiff = [];
        this.drawMitoPlotChart();
        if (this.m_markeravail) {
            this.drawMitoPlotDataLabel();
        }
    } else {
        this.drawSVGMessage(this.m_status.noData);
    }
};
/** @description overrite drawObject Method  because of ChartFrame and Titles are drawn on SVG  when no dataset **/
MitoPlotChart.prototype.drawObject = function() {
    this.drawSVGObject();
};
/** @description will draw the ChartFrame**/
MitoPlotChart.prototype.drawChartFrame = function() {
    this.m_chartFrame.drawSVGFrame();
};

/** @description Will Draw Title on canvas if showTitle set to true. **/
MitoPlotChart.prototype.drawTitle = function() {
    this.m_title.draw();
};

/** @description Will Draw SubTitle on canvas if showSubTitle set to true. **/
MitoPlotChart.prototype.drawSubTitle = function() {
    this.m_subTitle.draw();
};


/** @description Getter Method of StartX. **/
MitoPlotChart.prototype.getStartX = function() {
    var marginForYAxisLabels = 0;
    return (this.m_x + marginForYAxisLabels);
};
/** @description Getter Method of StartY. **/
MitoPlotChart.prototype.getStartY = function() {
    var marginForXAxisLabels = 0;
    return (this.m_y + this.m_height - marginForXAxisLabels);
};
/** @description Getter Method of EndX. **/
MitoPlotChart.prototype.getEndX = function() {
    var rightSideMargin = 0;
    return (this.m_x + this.m_width - rightSideMargin);
};
/** @description Getter Method of EndY. **/
MitoPlotChart.prototype.getEndY = function() {
    return (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};
/** @description Getter Method of Margin For SubTitle. **/
MitoPlotChart.prototype.getMarginForSubTitle = function() {
    var margin;
    if (IsBoolean(this.m_subTitle.m_showsubtitle))
        margin = (this.m_subTitle.getDescription() != "") ? (this.m_subTitle.getFontSize() * 1.5) : 10;
    else
        margin = 0;
    return margin;
};
/** @description Getter Method of ToolTip Data according to the type. **/
MitoPlotChart.prototype.getToolTipData = function(mouseX, mouseY) {
    return this.getMitoPlotToolTipData(mouseX, mouseY);
};

MitoPlotChart.prototype.drawTooltip = function(mouseX, mouseY) {
    if (!IsBoolean(this.m_isEmptySeries) && !this.m_designMode) {
        var toolTipData = this.getToolTipData(mouseX, mouseY);
        if (this.m_hovercallback && this.m_hovercallback != "") {
            this.drawCallBackContent(mouseX, mouseY, toolTipData);
        } else {
            this.drawTooltipContent(toolTipData);
        }
    }
};

/** @description Will drawing the Tooltip Content. **/
MitoPlotChart.prototype.drawTooltipContent = function(toolTipData) {
    this.m_tooltip.draw(toolTipData, this.m_componenttype);
};

/** @description Getter method For DrillDataPoints. **/
MitoPlotChart.prototype.getDrillDataPoints = function(mouseX, mouseY) {
    console.log("Mito Plot Chart")
};


/** @description Constructor function  of Mitoplot calculation class. **/
function Mitoplotcalculation() {
    this.m_globalCal = "";
    this.m_categoryData = [];
    this.m_seriesData = [];
    this.m_endX = "";
    this.m_endY = "";
    this.m_width = "";
    this.m_height = "";
    this.m_marginX;
    this.m_marginLegend;
    this.m_availableHeight;
    this.m_availabeWidth;
    this.total;
    this.ratio;
    this.m_startAngle = [];
    this.m_endAngle = [];
    this.m_chart;
};

/** @description initialization of  Mitoplot calculation. **/
Mitoplotcalculation.prototype.init = function(chartRef) {
    this.m_chart = chartRef;
    this.total = 0;
    this.m_categoryData = chartRef.m_categoryData;
    this.m_endX = chartRef.getEndX();
    this.m_endY = chartRef.getEndY();
    this.m_x = chartRef.m_x;
    this.m_y = chartRef.m_y;
    this.m_startPoints = chartRef.getStartData();
    this.m_stopPoints = chartRef.getStopData();
    this.m_datalabelpositionarr = chartRef.getDataLabelPosition();
    this.m_chart.availableWidth = chartRef.m_width;
    this.m_chart.availableHeight = this.m_chart.m_height - this.m_chart.getTotalMarginForTitleSubtitle() - this.m_chart.getBottomBarMargin();
    this.m_chart.lineWidthCalculation();
    this.m_chart.radiusCalculation();
    this.m_chart.centerXCalcalculation();
    this.m_chart.centerYCalcalculation();
    this.Ratiofun();
    this.setStartAngle();
    this.setEndAngle();
    if (this.m_chart.m_markeravail) {
        this.datalabelPosition();
    }
};

/** @description This method calculate the ratio according to the chart type. **/
Mitoplotcalculation.prototype.Ratiofun = function() {
    var length = this.m_stopPoints[0].length - 1;
    var endPoint = this.m_stopPoints[0][length];
    if ((endPoint == "") && (this.m_stopPoints[0].length > 1)) {
        var max = this.m_stopPoints[0].reduce(function(a, b) {
            return Math.max(a, b);
        });
    }
    var angle = 2 * Math.PI;
    this.ratio = angle / endPoint * 1;
};
/** @description Getter method For Start Angle. **/
Mitoplotcalculation.prototype.getStartAngle = function() {
    return this.m_startAngle;
};
/** @description Setter method For Start Angle. **/
Mitoplotcalculation.prototype.setStartAngle = function() {
    this.m_startAngle = [];
    for (var count = 0, length = this.m_startPoints[0].length; count < length; count++) {
        if (count == 0)
            this.m_startAngle[count] = 0;
        else
            this.m_startAngle[count] = this.m_startPoints[0][count] * this.ratio;
    }
    return this.m_startAngle;
};
/** @description Getter method For End Angle. **/
Mitoplotcalculation.prototype.getEndAngle = function() {
    return this.m_endAngle;
};
/** @description Setter method For End Angle. **/
Mitoplotcalculation.prototype.setEndAngle = function() {
    this.m_endAngle = [];
    for (var count = 0, length = this.m_stopPoints[0].length; count < length; count++) {

        this.m_endAngle[count] = this.ratio * this.m_stopPoints[0][count] * 1;
    }
    return this.m_endAngle;
};
Mitoplotcalculation.prototype.getdatalabelPosition = function() {
    return this.m_datalabelPosition;
};
/** @description Setter method For datalabel Position. **/
Mitoplotcalculation.prototype.datalabelPosition = function() {
    this.m_datalabelPosition = [];
    if ((this.m_datalabelpositionarr !== undefined) && (this.m_datalabelpositionarr[0].length > 0)) {
        for (var count = 0, length = this.m_datalabelpositionarr[0].length; count < length; count++) {

            this.m_datalabelPosition[count] = this.ratio * this.m_datalabelpositionarr[0][count] * 1;
        }
    }
    return this.m_datalabelPosition;
};
/** @description This method returns the radius, according to the width-height. **/
Mitoplotcalculation.prototype.radiusCalc = function() {
    if (this.m_chart.availableHeight >= this.m_chart.availableWidth) {
        this.radius = (this.m_chart.availableWidth) / 2 - 5;
    } else {
        this.radius = (this.m_chart.availableHeight) / 2 - 5;
    }
    if (this.radius < 1)
        this.radius = 1;
    return this.radius;
};

/** @description Getter method For CenterX Point of the chart. **/
Mitoplotcalculation.prototype.centerXCalc = function() {
    return this.centerX;
};
/** @description Getter method For CenterY Point of the chart. **/
Mitoplotcalculation.prototype.centerYCalc = function() {
    return this.centerY;
};
/** @description Constructor function  of Slice class. **/
function MitoPlotSlice() {
    this.m_centerX;
    this.m_centerY;
    this.m_radius;
    this.m_startAngle;
    this.m_endAngle;
    this.m_color = {};
    this.m_chart;
    this.ctx = "";
    this.m_seriesdata = [];
    this.m_orientation = [];
};
/** @description initialization of  Slice. **/
MitoPlotSlice.prototype.init = function(m_centerX, m_centerY, m_radius, m_startAngle, m_endAngle, fillcolor, ctx, m_chartbase, m_luminance, ref, strkelinewidth, strokecolor, strokeangle, seriesdata, orientation) {
    this.m_centerX = m_centerX;
    this.m_centerY = m_centerY;
    this.m_radius = m_radius;
    this.m_startAngle = m_startAngle;
    this.m_chart = ref;
    this.m_endAngle = m_endAngle;
    this.m_color = fillcolor;
    this.ctx = ctx;
    this.m_chartbase = m_chartbase;
    this.m_luminance = m_luminance;
    this.m_strkelinewidth = strkelinewidth;
    this.m_strokecolor = strokecolor;
    this.m_seriesdata = seriesdata;
    this.m_orientation = orientation;
};
/** @description drawing method of  Slice. **/
MitoPlotSlice.prototype.drawMitoPlotDoughnut = function(k, color) {
    var temp = this,
        colorArr = color,
        id = temp.m_chart.svgContainerId,
        donutRadius = this.m_radius - this.m_chart.m_linewidth,
        cx = this.m_centerX,
        cy = this.m_centerY,
        r = donutRadius;
    var linewidth = temp.m_chart.m_linewidth;
    this.m_chart.angleDiff[k] = (this.m_startAngle + this.m_endAngle) / 2;
    if (this.m_orientation === "-") {
        var x1 = cx + (r - linewidth) * Math.cos(this.m_startAngle), // outer
            x2 = cx + (r - linewidth) * Math.cos(this.m_endAngle),
            y1 = cy + (r - linewidth) * Math.sin(this.m_startAngle),
            y2 = cy + (r - linewidth) * Math.sin(this.m_endAngle),
            x3 = cx + (r - 2 * linewidth) * Math.cos(this.m_startAngle), // inner
            x4 = cx + (r - 2 * linewidth) * Math.cos(this.m_endAngle),
            y3 = cy + (r - 2 * linewidth) * Math.sin(this.m_startAngle),
            y4 = cy + (r - 2 * linewidth) * Math.sin(this.m_endAngle);
    } else {
        var x1 = cx + r * Math.cos(this.m_startAngle), // outer
            x2 = cx + r * Math.cos(this.m_endAngle),
            y1 = cy + r * Math.sin(this.m_startAngle),
            y2 = cy + r * Math.sin(this.m_endAngle),
            x3 = cx + (r - linewidth) * Math.cos(this.m_startAngle), // inner
            x4 = cx + (r - linewidth) * Math.cos(this.m_endAngle),
            y3 = cy + (r - linewidth) * Math.sin(this.m_startAngle),
            y4 = cy + (r - linewidth) * Math.sin(this.m_endAngle);
    }

    var flag = (Math.abs(this.m_endAngle - this.m_startAngle) > 180);
    var path = [
        "M", x3, y3,
        "L", x1, y1,
        "A", r, r, 0, +flag, 1, x2, y2,
        "A", r, r, 0, +flag, 1, x2, y2,
        "L", x4, y4,
        "A", (r - linewidth), (r - linewidth), 0, +flag, 0, x3, y3
    ].join(" ");
    var svgPath = drawSVGPath();
    svgPath.setAttribute('d', path);
    svgPath.setAttribute("style", "stroke-width:" + temp.m_chart.m_strokelinewidth + "px; stroke:" + temp.m_chart.m_strokecolor + "; fill:" + colorArr + ";");
    $("#" + id).append(svgPath);
};



/** @description Constructor function  of Data Label class. **/
function MitoPlotDataLabel() {
    this.m_datalabelProperties = {};
    this.m_datalabelPosition;
    this.m_datalabel;
    this.m_chart;
};
/** @description initialization of  Data Label. **/
MitoPlotDataLabel.prototype.init = function(datalabelPositionArr, datalabelProperties, datalabel, ceterX, centerY, Radius, chart) {
    this.m_datalabelProperties = datalabelProperties;
    this.m_datalabelPosition = datalabelPositionArr;
    this.m_datalabel = datalabel;
    this.ceterX = ceterX;
    this.centerY = centerY;
    this.radius = Radius;
    this.m_chart = chart;
};
/** @description drawing method of  Data Label. **/
MitoPlotDataLabel.prototype.drawMitoPlotDataLabel = function(k) {
    var temp = this.m_chart,
        cx = this.ceterX,
        cy = this.centerY,
        r = this.radius,
        Position = this.m_datalabelPosition,
        tx = cx + r * Math.cos(Position),
        ty = cy + r * Math.sin(Position),
        x1 = cx + (r - 7) * Math.cos(Position), // outer
        y1 = cy + (r - 7) * Math.sin(Position),
        x2 = cx + (r - temp.m_linewidth * 1.5) * Math.cos(Position), // inner
        y2 = cy + (r - temp.m_linewidth * 1.5) * Math.sin(Position),
        textDataLabel = drawSVGText(tx, ty, this.m_datalabel, this.m_datalabelProperties.dataLabelFontColor, "middle", "middle");
    textDataLabel.setAttribute("style", "font-family:" + selectGlobalFont(this.m_datalabelProperties.datalabelFontFamily) + ";font-style:" + this.m_datalabelProperties.datalabelFontStyle + ";font-size:" + this.m_chart.fontScaling(this.m_datalabelProperties.dataLabelFontSize) + "px;font-weight:" + this.m_datalabelProperties.datalabelFontWeight + ";cursor: default;text-decoration:" + "none" + ";");
    $("#" + temp.svgContainerId).append(textDataLabel);
    var pathMito = [
        "M", x2, y2,
        "L", x1, y1
    ].join(" ");
    var svgPath = drawSVGPath();
    svgPath.setAttribute('d', pathMito);
    svgPath.setAttribute("style", "stroke-width:1px; stroke:" + this.m_datalabelProperties.dataLabelFontColor + ";");
    $("#" + temp.svgContainerId).append(svgPath);
};
/** @description Will drawing the MitoPlotSlice according to the startAngle and endAngle with radius for the DoughnutSlice. **/
MitoPlotSlice.prototype.drawMitoPlotSlice = function(k, color) {
    var temp = this.m_chart;
    this.drawMitoPlotDoughnut(k, color);
};
MitoPlotDataLabel.prototype.drawMitoDataLabel = function(k) {
    var temp = this.m_chart;
    this.drawMitoPlotDataLabel(k);
};
/** @description This method is calculating centerX point. **/
MitoPlotChart.prototype.centerXCalcalculation = function() {
    this.availableWidth = this.m_width;
    var ChartToBorderMargin = this.getChartToBorderMargin();
    if ((this.availableWidth / 2) > (this.radius * 1 + 10 + ChartToBorderMargin)) {
        this.centerX = ((this.m_chartalignment == "center") ? (this.availableWidth) / 2 : ((this.m_chartalignment == "left") ? (this.availableWidth * 1 - (this.availableWidth - this.radius)) + ChartToBorderMargin : this.availableWidth * 1 - this.radius * 1 - ChartToBorderMargin));
    } else {
        this.centerX = ((this.m_chartalignment == "center") ? (this.availableWidth) / 2 : ((this.m_chartalignment == "left") ? this.availableWidth * 1 - this.radius * 1 - ChartToBorderMargin : (this.availableWidth * 1 - (this.availableWidth - this.radius)) + ChartToBorderMargin));
    }
};
/** @description This method is calculating centerY point according to the charttype and height. **/
MitoPlotChart.prototype.centerYCalcalculation = function() {
    this.availableHeight = this.m_height - this.getTotalMarginForTitleSubtitle() - this.getBottomBarMargin();
    this.centerY = (this.availableHeight) / 2 + this.getTotalMarginForTitleSubtitle();
};
/** @description Getter method For Filling Color on the slice according to the chartbase. **/
MitoPlotChart.prototype.getTotalMarginForTitleSubtitle = function() {
    return (this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};
/** @description Getter method For Margin of MitoPlotChart. **/
MitoPlotChart.prototype.getMarginForMitoPlotChart = function() {
    return 10;
};
/** @description Getter method For BottomBar Margin. **/
MitoPlotChart.prototype.getBottomBarMargin = function() {
    return (this.isMaximized && IsBoolean(this.getShowGradient())) ? 30 : 0;
};
/** @description This method calculate line width. **/
MitoPlotChart.prototype.lineWidthCalculation = function() {
    var lineWidth;
    this.m_linewidth = 40;
    lineWidth = (this.m_linewidth > this.availableWidth / 4) ? this.availableWidth / 4 : this.m_linewidth;
    this.m_linewidth = lineWidth * 0.6;
};
/** @description This method calculate radius according to the charttype. **/
MitoPlotChart.prototype.radiusCalculation = function() {
    this.radius = Math.abs(((this.availableWidth >= this.availableHeight) ? this.availableHeight / 2 : this.availableWidth / 2) - 20);
};

/** @description Will Draw the MitoPlot Chart. **/
MitoPlotChart.prototype.drawMitoPlotChart = function() {
    for (var i = 0; i < this.m_slice.length; i++) {
        var color = this.m_slice[i].m_color[this.m_slice[i].m_seriesdata];
        this.m_slice[i].drawMitoPlotSlice(i, color);
    }
};

/** @description Will Draw the MitoPlot DataLabel. **/
MitoPlotChart.prototype.drawMitoPlotDataLabel = function() {
    for (var i = 0; i < this.m_mitodatalabel.length; i++) {
        if (!isNaN(this.m_mitodatalabel[i].m_datalabelPosition * 1)) {
            this.m_mitodatalabel[i].drawMitoDataLabel(i);
        }

    }
};

/** @description Getter method For Tool Tip Data based on Marker Position or start and stop angle**/
MitoPlotChart.prototype.getMitoPlotToolTipData = function(mouseX, mouseY) {
    if (!IsBoolean(this.m_isEmptySeries) && (this.m_customtextboxfortooltip.dataTipType !== "None") && (!IsBoolean(this.isEmptyCategory))) {
        if (this.m_customtextboxfortooltip.dataTipType === "Default") {
            this.m_customtextboxfortooltip.dataTipType = "None";
        }
        if (this.m_customtextboxfortooltip.dataTipType !== "None") {
            var toolTipData = {};
            var deltaX = mouseX - this.m_centerX;
            var deltaY = mouseY - this.m_centerY;
            var Angle = Math.atan2(deltaY, deltaX);
            var Radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
            var Position = this.m_calculation.getdatalabelPosition();
            var startAngle;
            var endAngle;
            var lineWidth = this.m_linewidth * 1;
            if (Radius <= (this.m_radius * 1 + 10) && Radius >= this.m_radius - lineWidth * 4) {
                for (var i = 0, length = this.getCategoryData()[0].length; i < length; i++) {
                    var startValue = 0;
                    if (Angle < startValue) {
                        var addAngle = Math.atan2(0, -1);
                        Angle = 2 * addAngle + Angle;
                    }
                    if ((Position !== undefined) && (Position.length > 0)) {
                        startAngle = Position[i] - 0.05;
                        endAngle = Position[i] + 0.05;
                    } else {
                        startAngle = this.m_calculation.getStartAngle()[i];
                        endAngle = this.m_calculation.getEndAngle()[i];
                    }
                    if (Angle >= startAngle && Angle <= endAngle) {
                        toolTipData = this.getDataProvider()[i];
                        return toolTipData;
                    } else {
                        this.hideToolTip();
                    }
                }
            } else {
                this.hideToolTip();
            }
        } else {
            return false;
        }
    }
};

//# sourceURL=MitoPlotChart.js