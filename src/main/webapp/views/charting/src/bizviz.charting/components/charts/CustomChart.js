/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: CustomChart.js
 * @description CustomChart
 **/
function CustomChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	
	this.m_jspaths = [];
	this.m_csspaths = [];
	this.m_htmlcontent = '<div class="statusMessage"><p>Data not available !</p></div>';
	this.m_csscontent = "body{margin: 0px; font-family: Roboto} .statusMessage p{ color: #EF6C00; font-size: 12px; margin: 0; position: absolute; top: 50%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%); }";
	this.m_jscontent = "";

	this.m_frame = "";
};

/** @description Making prototype of chart class to inherit its properties and methods into Column Stack chart **/
CustomChart.prototype = new Chart();
/** @description This method will parse the chart JSON and create a container **/
CustomChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas(); //create draggable div
};
/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
CustomChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};
/** @description  Will create DraggableDiv and DraggableCanvas and initialize mouse event for component .**/
CustomChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
};
/** @description Iterate through chart JSON and set class variable values with JSON values **/
CustomChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "Chart") {
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
/** @description Iterate Fields JSON and set field according to their fieldType  **/
CustomChart.prototype.setFields = function (fieldsJson) {
	try {
		fieldsJson = getDuplicateArray(fieldsJson);
	} catch (e) {
		console.log(e);
	}
	this.m_fieldsJson = fieldsJson;
	
	var seriesJson = [];
	var arrayLength = fieldsJson.length;
	for (var i = 0; i < arrayLength; i++) {
		var fieldType = this.getProperAttributeNameValue(fieldsJson[i], "Type");
		switch (fieldType) {
		case "Series":
			seriesJson.push(fieldsJson[i]);
			break;
		case "CalculatedField":
			seriesJson.push(fieldsJson[i]);
			break;
		default:
			break;
		}
	}
	this.setSeries(seriesJson);
};
CustomChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	var count = 0;
	var arrayLength = seriesJson.length;
	for (var i = 0; i < arrayLength; i++) {
		this.m_seriesNames[count] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.m_seriesDisplayNames[count] = m_formattedDisplayName;
		count++;
	}
};

/** @description Getter For DataProvider **/
CustomChart.prototype.getFields = function () {
	return this.m_fieldsJson;
};
/** @description Getter For DataProvider **/
CustomChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};
/** @description Getter For DataProvider **/
CustomChart.prototype.eventCallBack = function (event, data, index) {
	if(event.type == "mousemove"){
		console.log("mouse move");
	}else if(event.type == "mouseout"){
		console.log("mouse out");
	}else if(event.type == "click"){
		var map = { "drillRecord":data, "drillColor":"" };
		this.updateDataPointsToGV(map);
	}
};
CustomChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};
CustomChart.prototype.setCategorySeriesData = function() {
    this.m_categoryData = [];
    this.m_seriesData = [];
    for (var k = 0, len = this.getDataProvider().length; k < len; k++) {
        var record = this.getDataProvider()[k];
        this.isEmptyCategory = false;
        for (var j = 0, length = this.getSeriesNames().length; j < length; j++) {
            if (!this.m_seriesData[j]) {
                this.m_seriesData[j] = [];
            }
            var data = "";
            var field = this.getSeriesNames()[j];
            if (record[field] != undefined && record[field] != "undefined"){
                data = record[field];
            }            

            if (isNaN(data)) {
                data = getNumericComparableValue(data);
            }
            this.m_seriesData[j][k] = data;
        }
    }
};
/** @description calcluating mark text margin and than start point from where chart x,y will draw **/
CustomChart.prototype.setStartX = function () {
	this.m_startX = this.m_x * 1 ;
};
/** @description  Setter method of ProjectTimelineChart for set EndX position.**/
CustomChart.prototype.setEndX = function () {
	this.m_endX = this.m_startX * 1 + this.m_width * 1;
};
/** @description  Setter method of ProjectTimelineChart for set StartY position.**/
CustomChart.prototype.setStartY = function () {
	this.m_startY = this.m_y * 1 + (this.m_height);
};
/** @description  Setter method of ProjectTimelineChart for set EndY position.**/
CustomChart.prototype.setEndY = function () {
	this.m_endY = (this.m_y * 1 + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1 );
};
/** @description Chart Data,Chart Frame,XAxis,YAxis initialization **/
CustomChart.prototype.init = function () {
	this.setCategorySeriesData();
	this.isSeriesDataEmpty();
	this.setChartDrawingArea();
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);
};

CustomChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	//this.hideCanvas();
	if(this.m_designMode){
		this.createInnerDiv(this.m_draggableDiv);
		try{
			//this.setDesignModeCustomChart();
			this.drawDesignModeCustomChart();
		}catch(e){
			console.log(e);
			this.drawMessage("Failed to import custom chart, Please check log !");
		}
	}else{
		var map = this.IsDrawingPossible();
		if (IsBoolean(map.permission)) {
			this.drawCustomChart();
		} else {
			this.drawMessage(map.message);
		}
	}
};
CustomChart.prototype.IsDrawingPossible = function() {
	var map = {};
	if (!IsBoolean(this.m_isEmptySeries)) {
		map = {
			"permission": "true",
			message: this.m_status.success
		};
	} else {
		map = {
			"permission": "false",
			message: this.m_status.noData
		};
	}
	return map;
};
/** @description drawing of Chart Frame**/
CustomChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};/** @description Will Draw Title on SVG if showTitle set to true **/
CustomChart.prototype.drawTitle = function () {
	this.m_title.draw();
};
/** @description Will Draw SubTitle on SVG if showSubTitle set to true **/
CustomChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};
CustomChart.prototype.hideCanvas = function () {
	var temp = this;
	$("#draggableCanvas"+temp.m_objectid).css("display", "none");
	$("#draggableDiv"+temp.m_objectid).find("svg").remove();
};
CustomChart.prototype.createInnerDiv = function (container) {
	$("#innerDiv"  + this.m_objectid).remove();
	var innerDiv = document.createElement("div");
	innerDiv.setAttribute("id", "innerDiv"  + this.m_objectid);
	innerDiv.style.height = "100%";
	innerDiv.style.width = "100%";
	innerDiv.style.top = 0 + "%";
	innerDiv.style.left = 0 + "%";
	innerDiv.style.position = "absolute";
	innerDiv.style.zIndex = "" + 2;
	$(container).append(innerDiv);
	return innerDiv;
};
CustomChart.prototype.drawDesignModeCustomChart = function () {
	var temp = this;
	function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
        var l1 = (p2x - p1x) / 2,
            l2 = (p3x - p2x) / 2,
            a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
            b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
        a = p1y < p2y ? Math.PI - a : a;
        b = p3y < p2y ? Math.PI - b : b;
        var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
            dx1 = l1 * Math.sin(alpha + a),
            dy1 = l1 * Math.cos(alpha + a),
            dx2 = l2 * Math.sin(alpha + b),
            dy2 = l2 * Math.cos(alpha + b);
        return {
            x1: p2x - dx1,
            y1: p2y + dy1,
            x2: p2x + dx2,
            y2: p2y + dy2
        };
    }
    // Grab the data
    var labels = ["2012", "2013", "2014", "2015", "2016", "2017", "2018"],
        data = [3,6,12,6,24,9,15];
    
    // Draw
    var width = this.m_width,
        height = this.m_height,
        leftgutter = 10,
        bottomgutter = 40,
        topgutter = (this.getEndY()*1 + 20*1),
        color = "#f89406",
        r = Raphael("innerDiv"+temp.m_objectid, width, height),
        txt = {font: "12px Roboto", fill: "#808080"},
        X = (width - leftgutter) / labels.length,
        max = Math.max.apply(Math, data),
        Y = (height - bottomgutter - topgutter) / max;
    var path = r.path().attr({stroke: color, "stroke-width": 4, "stroke-linejoin": "round"}),
        bgp = r.path().attr({stroke: "none", opacity: .2, fill: color}),
        label = r.set(),
        lx = 0, ly = 0,
        is_label_visible = false,
        leave_timer,
        blanket = r.set();
    label.hide();

    var p, bgpp;
    for (var i = 0, ii = labels.length; i < ii; i++) {
        var y = Math.round(height - bottomgutter - Y * data[i]),
            x = Math.round(leftgutter + X * (i + .5)),
            t = r.text(x, height - bottomgutter/2 - 6, labels[i]).attr(txt).toBack();
        if (!i) {
            p = ["M", x, y, "C", x, y];
            bgpp = ["M", leftgutter + X * .5, height - bottomgutter, "L", x, y, "C", x, y];
        }
        if (i && i < ii - 1) {
            var Y0 = Math.round(height - bottomgutter - Y * data[i - 1]),
                X0 = Math.round(leftgutter + X * (i - .5)),
                Y2 = Math.round(height - bottomgutter - Y * data[i + 1]),
                X2 = Math.round(leftgutter + X * (i + 1.5));
            var a = getAnchors(X0, Y0, x, y, X2, Y2);
            p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
            bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
        }
        var dot = r.circle(x, y, 4).attr({fill: "rgba(248, 148, 6, 0.5)", stroke: "#fff", "stroke-width": 2});
    }
    p = p.concat([x, y, x, y]);
    bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);
    path.attr({path: p});
    bgp.attr({path: bgpp});
};
/** No need to draw iframe in design to make dashboard operations heavy, and iframe hides when custom chart is duplicated due to append in multiselectdiv **/
CustomChart.prototype.setDesignModeCustomChart = function(){
	this.m_jspaths = [{"name": "d3", "src": "//d3js.org/d3.v4.min.js"}];
	this.m_htmlcontent = '<div class="customCompContainer" id="customCompContainer'+this.m_objectid+'"></div>';
	this.m_csscontent = 'body{ margin: 0px; padding: 0px; background: transparent;} .customCompContainer{width:100%; height: 100%;}';
	this.m_jscontent = 'var drawDesignModeCustomComp = function(w, h, id, data, cat, ser, sercolor, chartID) {'+
	'    	var svg = d3.select("#"+id)'+
	'    	.append("svg")'+
	'    	.attr("width", w)'+
	'    	.attr("height", h),'+
	'        margin = {top: 40, right: 40, bottom: 40, left: 40},'+
	'        width = +svg.attr("width") - margin.left - margin.right,'+
	'        height = +svg.attr("height") - margin.top - margin.bottom;'+
	''+
	'    	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),'+
	'    	    y = d3.scaleLinear().rangeRound([height, 0]);'+
	'    	'+
	'    	var g = svg.append("g")'+
	'    	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");'+
	'    	'+
	'    	var tooltipdiv = d3.select("body").append("div")	'+
	'        .attr("class", "d3tooltip")				'+
	'        .style("background", "#ffffff")'+
	'        .style("padding", "10px")'+
	'        .style("opacity", 0)'+
	'        .style("display", "none")'+
	'        .style("position", "absolute");'+
	'    	'+
	'    	x.domain(data.map(function(d) { return d[cat]; }));'+
	'    	  y.domain([0, d3.max(data, function(d) { return 1*d[ser]; })]);'+
	'    	'+
	'    	  g.append("g")'+
	'    	      .attr("class", "axis axis--x")'+
	'    	      .attr("transform", "translate(0," + height + ")")'+
	'    	      .call(d3.axisBottom(x));'+
	'    	'+
	'    	  g.append("g")'+
	'    	      .attr("class", "axis axis--y")'+
	'    	      .call(d3.axisLeft(y).ticks(5))'+
	'    	    .append("text")'+
	'    	      .attr("transform", "rotate(-90)")'+
	'    	      .attr("y", 6)'+
	'    	      .attr("dy", "0.71em")'+
	'    	      .attr("text-anchor", "end")'+
	'    	      .text("Frequency");'+
	'    	'+
	'    	  g.selectAll(".d3bar")'+
	'    	    .data(data)'+
	'    	    .enter().append("rect")'+
	'    	      .attr("class", "d3bar")'+
	'    	      .style("fill", sercolor)'+
	'    	      .attr("x", function(d) { return x(d[cat]); })'+
	'    	      .attr("y", function(d) { return y(d[ser]); })'+
	'    	      .attr("width", x.bandwidth())'+
	'    	      .attr("height", function(d) { return height - y(d[ser]); })'+
	'    	      '+
	'    	      .on("mousemove", function(d,i,e) {'+
	'    	    	  tooltipdiv.transition()'+
	'                    .duration(100)'+
	'        			 .style("display", "block")'+
	'                    .style("opacity", 1);'+
	'    	    	  tooltipdiv.html((d[cat]) + "<br/>"  + ser +": "+ d[ser])'+
	'                    .style("left", (d3.event.pageX + 30) + "px")'+
	'                    .style("top", (d3.event.pageY - 30) + "px");'+
	'					parent.window.dGlobals.containerCallback(chartID, event, d,i,e);'+
	'                })'+
	'            .on("mouseout", function(d,i,e) {'+
	'            	tooltipdiv.transition()'+
	'                    .duration(400)'+
	'        			 .style("display", "none")'+
	'                    .style("opacity", 0);'+
	'					parent.window.dGlobals.containerCallback(chartID, event, d,i,e);'+
	'            })'+
	'            .on("click", function(d,i,e) {'+
	'    	    	  	parent.window.dGlobals.containerCallback(chartID, event, d,i,e);'+
	'                });'+
	'    };    '+
	'    drawDesignModeCustomComp('+ (this.m_width - this.m_borderthickness*2) +', '+ (this.m_height - this.m_borderthickness*2 - this.getEndY()) +', "customCompContainer'+this.m_objectid+'", [{date: "13-May", a: "5", b: "3"},{date: "14-May", a: "4", b: "2"},{date: "15-May", a: "3", b: "1"},{date: "16-May", a: "4", b: "2"}], "date", "a", "#f89406");';
};
/** @description setter method for set EndY position of chart   **/
CustomChart.prototype.getEndY = function () {
	return (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};
/** @description return Title Margin if showTitle set to true **/
CustomChart.prototype.getMarginForTitle = function () {
	if (IsBoolean( this.getShowGradient()) || IsBoolean(this.m_showmaximizebutton) || IsBoolean(this.getTitle().m_showtitle) ){
		return this.getTitleBarHeight() * 1;
	}else{
		return 0;
	}
};
/** @description return SubTitle Margin if showSubTitle set to true **/
CustomChart.prototype.getMarginForSubTitle = function () {
	if (IsBoolean(this.m_subTitle.m_showsubtitle) || ( IsBoolean( this.getShowGradient()) || IsBoolean(this.getTitle().m_showtitle)) ){
		return (this.m_subTitle.getDescription() != "") ? (this.fontScaling(this.m_subTitle.getFontSize()) * 1.5) : 0;
	}else{
		return 0;
	}
};/** @description return pre processed script to set charting level variables and objects **/
CustomChart.prototype.getPreProcessedScript = function () {
	if(this.m_designMode){
		return "";
	}else{
		return 'var bizvizchart = {chartJson: ' + JSON.stringify(this.chartJson) +'}; bizvizchart.chart = parent.sdk.getWidget(bizvizchart.chartJson.referenceID); bizvizchart.getData=function(){return bizvizchart.chart.getDataProvider()}; bizvizchart.getFields=function(){return bizvizchart.chart.getFields()}; bizvizchart.getWidth=function(){return bizvizchart.chart.m_width - bizvizchart.chart.m_borderthickness*2}; bizvizchart.getHeight=function(){return bizvizchart.chart.m_height - bizvizchart.chart.m_borderthickness*2 - bizvizchart.chart.getEndY()*1}; bizvizchart.eventCallBack=function(event, data, index){ bizvizchart.chart.eventCallBack(event, data, index); };';
	}
};
CustomChart.prototype.drawCustomChart = function () {
	var temp = this;
	var spaths = [];
	spaths = this.m_jspaths.map(function(obj){
		return '<script type="text/javascript" src="' + getNoProtocolUrl(obj.src) + '"></script>';
	});
	
	var cpaths = [];
	cpaths = this.m_csspaths.map(function(obj){
		return '<link rel="stylesheet" href="' + getNoProtocolUrl(obj.src) + '" type="text/css">';
	});
	cpaths.push('<link rel="stylesheet" href="' + window.location.origin + '/home/shared/brand/fonts/font.css" type="text/css">');
	var result = '<html><head>' + spaths.join(" ") + '' + cpaths.join(" ") + 
	'<style>body{ margin:0px; padding:0px; background: transparent;}' + this.m_csscontent + '</style></head><body>' + this.m_htmlcontent + 
	'<script type="text/javascript">try{'+ this.getPreProcessedScript() +'}catch(e){console.log(e);}</script>' +
	'<script type="text/javascript">try{ ' + this.m_jscontent + '}catch(e){console.log(e);}</script></body></html>';
	
	if(this.m_frame === ""){
		$("#draggableDiv"+temp.m_objectid).find("iframe").remove();
		this.m_frame = document.createElement("iframe");
		this.m_frame.setAttribute("id", "CustomChart"+temp.m_objectid);
		$("#draggableDiv"+temp.m_objectid).append(this.m_frame);
	}
	$(this.m_frame).css({"width": "100%", "height": (this.m_height - this.m_borderthickness*2 - this.getEndY()*1)+"px", "position": "absolute", "top": this.getEndY()+"px", "left": "0%", "background": "transparent", "border": "none"});

	var contents = $(this.m_frame).contents();
    var iframe = $(this.m_frame)[0];
    var doc;
	if(iframe.contentDocument) {
		doc = iframe.contentDocument;
	} else if(iframe.contentWindow) {
		doc = iframe.contentWindow.document;
	} else {
		doc = iframe.document;
	}
	try{
		doc.open();
		doc.writeln(result);
		doc.close();
	} catch(e) {
		console.log(e);
        alertPopUpModal({type:'error', message: "Error in custom component drawing", timeout: '3000'});
	}
};
//# sourceURL=CustomChart.js