/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: RoadMapChart.js
 * @description RoadMapChart
 **/
function RoadMapChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();

	this.m_showcurrentyeartimeline = false;
	this.m_showoneyearfromstartdate = false;
	this.m_timelinefontcolor = '0x00';
	this.m_timelinefontsize = '14';
	this.m_itemfontcolor = '0xffffff';
	this.m_itemfontsize = '12';
	this.m_subgroupfontcolor = '0x0';
	this.m_subgroupfontsize = '12';
	this.m_groupfontcolor = '0xffcc00';
	this.m_groupfontsize = '18';
	this.m_subgroupwidth = '95';
	this.m_groupwidth = '120';
	this.m_fontstyle = 'normal';
	this.m_fontfamily = 'Roboto';
	this.m_fontweight = 'normal';
	this.m_fontsize = '11';
	this.m_fontcolor = ''; //FontColor
	this.m_timelinecolor = 'red';
	this.m_scalecolor = '0x0';
	this.m_roadmapitemheight = '30';
	this.m_enddate = "12-31-2014";
	this.m_startdate = "01-01-2014";
	this.m_dateformat = 'MM-DD-YYYY';
	this.m_calculatedHeightForFirstDiv = "";
	this.m_calculatedHeightForSecondDiv = "";

	this.m_differenceDate = [];
	this.m_startProjectDate = [];
	this.m_enddProjectDate = [];
	this.m_projectId = [];
	this.m_map = {};
	this.m_subCateogryLengthArray = [];
	this.m_roadMapSeriesArray = "";
	this.m_roadMapYearSubTitle = "";
	this.m_roadMapYearSubTitleLine = "";
	this.m_roadMapSeriesArrayForSubCat = [];
	this.m_roadMapSeriesArrayForSeries = [];
	this.m_roadmapCalculation = new RoadmapCalculation();
	this.m_heightForYearSubtitle = 35;
	this.m_chartYMargin = 5;
	this.ctxForRoadMapSeries = "";
	this.m_roadMapTitle = new RoadMapTitle(this);
	this.m_roadMapTitleTop = 0;
	this.m_leftSideSpaceForChart = 5;
	this.m_categoryMarkingMargin = 30;
	this.m_xAxis = new Xaxis();
	this.m_yAxis = new Yaxis();
	this.m_maximumaxisvalue = "";
	this.m_minimumaxisvalue = "";
	this.m_updateSeriesValue = [];
	this.m_flag = "false";
	this.noOfRows = 1; //used for set x-axis text into two rows in non tilted case.
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_groupname = "";
};

RoadMapChart.prototype = new Chart();

RoadMapChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

RoadMapChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "Chart") {
			for (var chartKey in jsonObject[key]) {
				switch (chartKey) {
				case "xAxis":
					for (var xAxisKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(xAxisKey);
						nodeObject.m_xAxis[propertyName] = jsonObject[key][chartKey][xAxisKey];
					}
					break;
				case "yAxis":
					for (var yAxisKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(yAxisKey);
						nodeObject.m_yAxis[propertyName] = jsonObject[key][chartKey][yAxisKey];
					}
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
				case "Roadmap":
					for (var roadMapKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(roadMapKey);
						nodeObject.m_subTitle[propertyName] = jsonObject[key][chartKey][roadMapKey];
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

RoadMapChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

RoadMapChart.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	var categoryJson = [];
	var subcategoryJson = [];
	var seriesJson = [];
	var startValueJson = [];
	var endValueJson = [];
	this.m_fieldsType = [];

	for (var i = 0; i < fieldsJson.length; i++) {
		var fieldType = this.getProperAttributeNameValue(fieldsJson[i], "Type");
		switch (fieldType) {
		case "Category":
			categoryJson.push(fieldsJson[i]);
			this.m_fieldsType.push(fieldType);
			break;
		case "SubCategory":
			subcategoryJson.push(fieldsJson[i]);
			this.m_fieldsType.push(fieldType);
			break;
		case "Series":
			seriesJson.push(fieldsJson[i]);
			this.m_fieldsType.push(fieldType);
			break;
		case "startvalue":
			startValueJson.push(fieldsJson[i]);
			this.m_fieldsType.push(fieldType);
			break;
		case "endvalue":
			endValueJson.push(fieldsJson[i]);
			this.m_fieldsType.push(fieldType);
			break;
		default:
			break;
		}
	}
	this.setCategory(categoryJson);
	this.setSubCategory(subcategoryJson);
	this.setSeries(seriesJson);
	this.setStartValue(startValueJson);
	this.setEndValue(endValueJson);
};

RoadMapChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	// only one category can be set for line chart, preference to first one
	for (var i = 0; i < 1; i++) {
		this.m_categoryNames[i] = this.getProperAttributeNameValue(categoryJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(categoryJson[i], "DisplayName"));
		this.m_categoryDisplayNames[i] = m_formattedDisplayName;
	}
};

RoadMapChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};

RoadMapChart.prototype.setSubCategory = function (subcategoryJson) {
	this.m_subCategoryNames = [];
	this.m_subCategoryDisplayNames = [];
	// only one category can be set for line chart, preference to first one
	for (var i = 0; i < subcategoryJson.length; i++) {
		this.m_subCategoryNames[i] = this.getProperAttributeNameValue(subcategoryJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(subcategoryJson[i], "DisplayName"));
		this.m_subCategoryDisplayNames[i] = m_formattedDisplayName;
	}
};

RoadMapChart.prototype.getSubCategoryNames = function (subcategoryJson) {
	return this.m_subCategoryNames;
};

RoadMapChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = [];
	this.m_legendNames = [];
	for (var i = 0; i < seriesJson.length; i++) {
		this.m_seriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.m_legendNames[i] = m_formattedDisplayName;
		this.m_seriesDisplayNames[i] = m_formattedDisplayName;
		//this.m_seriesColors[i] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i],"Color"));
	}
};

RoadMapChart.prototype.getSeriesNames = function (subcategoryJson) {
	return this.m_seriesNames;
};
RoadMapChart.prototype.setStartValue = function (startvalueJson) {
	this.m_startValueDisplayNames = [];
	this.m_startValueNames = [];
	// only one startvalue field can be set for chevron chart, preference to first one
	for (var i = 0; i < 1; i++) {
		this.m_startValueNames[i] = this.getProperAttributeNameValue(startvalueJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(startvalueJson[i], "DisplayName"));
		this.m_startValueDisplayNames[i] = m_formattedDisplayName;
	}
};

RoadMapChart.prototype.getStartValueNames = function (subcategoryJson) {
	return this.m_startValueNames;
};

RoadMapChart.prototype.setEndValue = function (endValueJson) {
	this.m_endValueDisplayNames = [];
	this.m_endValueNames = [];
	// only one endvalue field can be set for chevron chart, preference to first one
	for (var i = 0; i < 1; i++) {
		this.m_endValueNames[i] = this.getProperAttributeNameValue(endValueJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(endValueJson[i], "DisplayName"));
		this.m_endValueDisplayNames[i] = m_formattedDisplayName;
	}
};

RoadMapChart.prototype.getEndValueNames = function () {
	return this.m_endValueNames;
};

RoadMapChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

RoadMapChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();

	this.createTitleAndSeriesDiv(this.m_zIndex);
	this.createDraggableCanvasForTitleAndSeries();
	this.setCanvasContext();
	this.setCanvasContextForTitleAndSeries();

	this.initMouseMoveEvent();
	this.initMouseClickEvent();
	this.initMouseMoveEventForToolTip();
	this.initMouseClickEventForToolTip();
};

RoadMapChart.prototype.createTitleAndSeriesDiv = function (zindex) {
	var temp = this;
	this.m_calculatedHeightForFirstDiv = this.m_subTitle.m_subTitleBarHeight * 1 + this.m_title.m_titleBarHeight * 1 + this.m_heightForYearSubtitle * 1;
	this.m_calculatedHeightForSecondDiv = this.m_height - (this.m_subTitle.m_subTitleBarHeight * 1 + this.m_title.m_titleBarHeight * 1 + this.m_heightForYearSubtitle * 1);
	var draggableDiv = document.createElement('div');
	draggableDiv.id = "draggableDivTitle" + this.m_objectid;
	draggableDiv.setAttribute("class", "draggableWidgetDiv");
	draggableDiv.setAttribute("name", this.m_objectname + "_" + this.m_objecttype);
	draggableDiv.style.position = 'absolute';
	draggableDiv.style.top = 0 + 'px';
	this.m_roadMapTitleTop = 0;
	draggableDiv.style.left = this.m_x + 'px';
	//draggableDiv.style.height = this.m_height+'px' ;	// title + subtitle + RoadMapTitle height
	draggableDiv.style.height = this.m_subTitle.m_subTitleBarHeight * 1 + this.m_title.m_titleBarHeight * 1 + this.m_heightForYearSubtitle * 1 + 'px';
	draggableDiv.style.width = this.m_width + 'px';
	draggableDiv.style.zIndex = zindex + 1;
	draggableDiv.style.display = "block";
	draggableDiv.style.backgroundColor = 'white';

	var draggableDiv1 = document.createElement('div');
	draggableDiv1.id = "draggableDivForRoadMapSeries" + this.m_objectid;
	draggableDiv1.setAttribute("class", "draggableWidgetDiv");
	draggableDiv1.setAttribute("name", this.m_objectname + "_" + this.m_objecttype);
	draggableDiv1.style.position = 'absolute';
	draggableDiv1.style.top = this.m_subTitle.m_subTitleBarHeight * 1 + this.m_title.m_titleBarHeight * 1 + this.m_heightForYearSubtitle * 1 - 1 + 'px';
	draggableDiv1.style.left = this.m_x + 'px';
	draggableDiv1.style.height = this.m_height - (this.m_subTitle.m_subTitleBarHeight * 1 + this.m_title.m_titleBarHeight * 1 + this.m_heightForYearSubtitle * 1) + 'px';
	draggableDiv1.style.width = this.m_width + 'px';
	draggableDiv1.style.zIndex = zindex;
	draggableDiv1.style.display = "block";
	draggableDiv1.style.overflow = "auto";
	draggableDiv1.style.overflowX = "hidden";

	$("#draggableDiv" + temp.m_objectid).append(draggableDiv);
	$("#draggableDiv" + temp.m_objectid).append(draggableDiv1);
};

RoadMapChart.prototype.createDraggableCanvasForTitleAndSeries = function () {
	var temp = this;
	var draggableCanvas = document.createElement('canvas');
	draggableCanvas.id = "draggableCanvasTitle" + this.m_objectid;
	draggableCanvas.height = this.m_subTitle.m_subTitleBarHeight * 1 + this.m_title.m_titleBarHeight * 1 + this.m_heightForYearSubtitle * 1;
	draggableCanvas.width = this.m_width;
	$("#draggableDivTitle" + temp.m_objectid).append(draggableCanvas);

	var temp = this;
	var draggableCanvasForSeries = document.createElement('canvas');
	draggableCanvasForSeries.id = "draggableCanvasForRoadMapSeries" + this.m_objectid;

	draggableCanvasForSeries.height = this.m_height - (this.m_subTitle.m_subTitleBarHeight * 1 + this.m_title.m_titleBarHeight * 1 + this.m_heightForYearSubtitle * 1);
	draggableCanvasForSeries.width = this.m_width;
	$("#draggableDivForRoadMapSeries" + temp.m_objectid).append(draggableCanvasForSeries);

};

RoadMapChart.prototype.setCanvasContextForTitleAndSeries = function () {
	this.draggableCanvasTitle = document.getElementById('draggableCanvasTitle' + this.m_objectid);
	this.ctx = this.draggableCanvasTitle.getContext('2d');
	this.m_x = 0;
	this.m_y = 0;

	this.draggableCanvasForRoadMapSeries = document.getElementById('draggableCanvasForRoadMapSeries' + this.m_objectid);
	this.ctxForRoadMapSeries = this.draggableCanvasForRoadMapSeries.getContext('2d');
	this.m_x = 0;
	this.m_y = 0;

};

RoadMapChart.prototype.initMouseMoveEventForToolTip = function () {
	var temp = this;
	var parentDivObject = this.m_chartContainer;
	if ('ontouchstart' in document.documentElement) {
		$("#draggableDivForRoadMapSeries" + temp.m_objectid).bind('touchstart', function (e) {

			var offset = $(parentDivObject)[0].offset();
			var parentOffsetLeft = offset.top - $(window).scrollTop();
			var parentOffsetTop = offset.left - $(window).scrollLeft();
		     mouseX = e.pageX - ($(this)[0].offsetLeft) * 1 - parentOffsetLeft;
			 mouseY = e.pageY - ($(this)[0].offsetTop) * 1 - parentOffsetTop;
			 pageX = e.pageX;
			 pageY = e.pageY;
		}).bind('touchend', function () {});
	} else {
		$("#draggableDiv" + temp.m_objectid).mousemove(function (e) {
			var offset = $(parentDivObject).offset();
			var parentOffsetLeft = offset.left;
			var parentOffsetTop = offset.top;
			var top = document.getElementById("draggableDivForRoadMapSeries" + temp.m_objectid).offsetTop;
			var topForDragbbleDiv = document.getElementById("draggableDiv" + temp.m_objectid).offsetTop;
			var scrollTop = $("#draggableDivForRoadMapSeries" + temp.m_objectid).scrollTop();
			var scrollLeft = $("#draggableDivForRoadMapSeries" + temp.m_objectid).scrollLeft();

			mouseX = e.pageX - ($(this)[0].offsetLeft) * 1 - parentOffsetLeft + scrollLeft;
			mouseY = e.pageY - (top) * 1 - parentOffsetTop + scrollTop - topForDragbbleDiv * 1;

			pageX = e.pageX;
			pageY = e.pageY;
		});
	}

};

RoadMapChart.prototype.initMouseClickEventForToolTip = function () {
	var temp = this;
	var canvas = $("#draggableCanvasForRoadMapSeries" + this.m_objectid);
	if (canvas != null) {
		$(canvas)[0].addEventListener("mousemove", function () {
			onMouseMove(temp);
		}, false);
		$(canvas)[0].addEventListener("click", function () {
			OnMouseClick(temp);
		}, false);
		$(canvas)[0].addEventListener("touchstart", function (event) {
			OnMouseClick(temp);
		}, false);
		$(canvas)[0].addEventListener("gestureend", function (event) {
			if (temp.m_showmaximizebutton
				 && temp.m_showmaximizebutton != undefined
				 && temp.m_showmaximizebutton != "") {
				if (event.scale < 1.0) {
					$("#MaximizeDiv").remove();
					temp.minimize();
				} else if (event.scale > 1.0) {
					$("#MaximizeDiv").remove();
					temp.maximize();
					//					temp.bottomBar();
				}
			}
		}, false);
	}
	this.initContextMenuEvent();
};

RoadMapChart.prototype.isMaximizableComponent = function () {
	if (this.m_objecttype.toLowerCase() == 'chart' || this.m_objecttype.toLowerCase() == 'funnel' || this.m_objecttype.toLowerCase() == 'datagrid' || this.m_objecttype.toLowerCase() == 'scorecard')
		return true;
	else
		return false;
};

RoadMapChart.prototype.maximize = function () {
	var temp = this;
	this.m_timer = 1; // timer for fiter in datagrid
	this.oldm_x = this.m_x;
	this.oldm_y = this.m_y;
	this.oldm_width = this.m_width;
	this.oldm_height = this.m_height;

	var draggableDiv = $("#draggableDiv" + temp.m_objectid);
	this.oldoffset_left = $(draggableDiv)[0].offsetLeft;
	this.oldoffset_top = $(draggableDiv)[0].offsetTop;
	this.oldzindex = $(draggableDiv).css("z-index");
	var DashboardDiv = $("#draggablesParentDivdashboardName");

	if (this.m_dashboard != "")
		this.maximizeZindex = (this.m_dashboard.m_widgetsArray.length) * 1 + 3;
	else
		this.maximizeZindex = this.m_zIndex;

	$(draggableDiv).css("z-index", this.maximizeZindex);
	this.isMaximized = true;
	this.m_x = 0;
	this.m_y = 0;
	this.m_width = $(temp.m_chartContainer)[0].clientWidth;
	this.m_height = $(temp.m_chartContainer)[0].clientHeight;
	this.hideToolTip();
	var heightOfSeries = $(temp.m_chartContainer)[0].clientHeight - this.m_calculatedHeightForFirstDiv * 1;
	this.RePositionDraggableDiv();
	if (this.m_type == "roadmap") {
		this.RePositionDivForTitle(this.m_calculatedHeightForFirstDiv * 1);
		this.RePositionDivForChevronBar(heightOfSeries);
	}

	this.init();
	this.drawChart();
	//	this.bottomBar();

};

/*RoadMapChart.prototype.bottomBar= function(){
var temp=this;
this.ctx.beginPath();
this.ctx.fillStyle = this.getGradient(this.m_x,(this.m_y*1)+(this.m_height*1)-1,this.m_x,(this.m_y*1)+(this.m_height*1)+30);
this.ctx.rect(this.m_x,(this.m_y*1)+(this.m_height*1)-1,this.m_width,30);
this.ctx.fill();
this.ctx.closePath();

var x=this.m_x*1 +2*1;
var y=this.m_y*1 + this.m_height*1 + 3*1;
var fontfamily=this.getTitle().m_fontfamily;
var fontsize=12+"px";

var src=(!IsBoolean(this.isGrid))?showgridsrc:showchartsrc;
if(this.m_objecttype.toLowerCase()!="datagrid" && this.m_objecttype.toLowerCase()!="scorecard" && this.m_objecttype.toLowerCase() !='map'){
var gridImage=this.drawImageIcons("gridIconImage",src,x,y);
gridImage.onclick=function(){
if(!IsBoolean(temp.isGrid)){
$("#MaximizeDiv").remove();
temp.showChartData=new ShowChartData(temp);
temp.showChartData.drawChart();
temp.isGrid=true;
temp.bottomBar();
temp.hideToolTip();
// this.m_isActive = false;
}
else{
$("#HierchDG1").remove();
$("#MaximizeDiv").remove();
//this.m_isActive = true;
// this.drawChart();
temp.isGrid=false;
temp.bottomBar();
temp.hideToolTip();
}
};
var zindex = temp.m_zIndex;
if (temp.m_dashboard != "")
zindex = temp.m_dashboard.m_widgetsArray.length + 2;
var tooltip=(!IsBoolean(this.isGrid))?"Show DataGrid":"Hide DataGrid";
if(!isScaling){
$('#gridIconImage'+temp.m_objectid).hover(function(){
var tooltipDiv=document.createElement("div");
tooltipDiv.innerHTML=tooltip;
tooltipDiv.setAttribute("id","MaximizeDiv");
tooltipDiv.setAttribute("style","padding:5px;position:absolute;font-family:"+fontfamily+";font-size:"+fontsize+";bottom:30px;left:35px;z-index:"+zindex+";background-color:#ffffff;border-radius:3px;");
$('#draggableDiv'+temp.m_objectid).append(tooltipDiv);
}, function(){
$("#MaximizeDiv").remove();
});
}
}








var temp = this;
this.ctx.beginPath();
this.ctx.fillStyle = this.getGradient(this.m_x, (this.m_y * 1)
+ (this.m_height * 1) - 1, this.m_x, (this.m_y * 1)
+ (this.m_height * 1) + 30);
this.ctx.rect(this.m_x, (this.m_y * 1) + (this.m_height * 1) - 1,
this.m_width, 30);
this.ctx.fill();
this.ctx.closePath();

var x = this.m_x * 1 + 2 * 1;
var y = this.m_y * 1 + this.m_height * 1 + 3 * 1;
var fontfamily = this.getTitle().m_fontfamily;
var fontsize = 12 + "px";

var src = (!IsBoolean(this.isGrid )) ? showgridsrc : showchartsrc;
if (this.m_objecttype.toLowerCase() != "datagrid"
&& this.m_objecttype.toLowerCase() != "scorecard"
&& this.m_objecttype.toLowerCase() != 'map') {
var gridImage = this.drawImageIcons("gridIconImage", src, x, y);
gridImage.onclick = function() {
if (!IsBoolean(temp.isGrid )) {
$("#MaximizeDiv").remove();
temp.showChartData = new ShowChartData(temp,"draggableDiv"+temp.m_objectid);
temp.showChartData.drawChart();
temp.isGrid = true;
temp.bottomBar();
temp.hideToolTip();
// this.m_isActive = false;
} else {
$("#HierchDG1").remove();
$("#MaximizeDiv").remove();
// this.m_isActive = true;
// this.drawChart();
temp.isGrid = false;
temp.bottomBar();
temp.hideToolTip();
}
};
var zindex = temp.m_zIndex;
if (temp.m_dashboard != "")
zindex = temp.m_dashboard.m_widgetsArray.length + 2;

var tooltip = (!IsBoolean(this.isGrid )) ? "Show DataGrid" : "Hide DataGrid";
if (!isScaling) {
$('#gridIconImage' + temp.m_objectid)
.hover(
function() {
var tooltipDiv = document.createElement("div");
tooltipDiv.innerHTML = tooltip;
tooltipDiv.setAttribute("id", "MaximizeDiv");
tooltipDiv
.setAttribute(
"style",
"padding:5px;position:absolute;font-family:"
+ fontfamily
+ ";font-size:"
+ fontsize
+ ";bottom:30px;left:35px;z-index:"
+ zindex
+ ";background-color:#ffffff;border-radius:3px;");
$('#draggableDiv' + temp.m_objectid).append(
tooltipDiv);
}, function() {
$("#MaximizeDiv").remove();
});
}
}
};*/

RoadMapChart.prototype.minimize = function () {
	var temp = this;
	this.m_timer = 1;
	// timer for filter in datagrid
	this.m_x = this.oldoffset_left;
	this.m_y = this.oldoffset_top;
	this.m_width = this.oldm_width;
	this.m_height = this.oldm_height;

	$("#dg1").remove();
	$("#HierchDG1").remove();
	var draggableDiv = $("#draggableDiv" + temp.m_objectid);
	$(draggableDiv).css("z-index", this.oldzindex);

	$(draggableDiv)[0].offsetLeft = this.oldoffset_left;
	$(draggableDiv)[0].offsetTop = this.oldoffset_top;
	this.isMaximized = false;
	this.isGrid = false;
	$('#gridIconImage' + temp.m_objectid).remove();

	this.hideToolTip();
	this.RePositionDraggableDiv();
	if (this.m_type == "roadmap") {
		this.RePositionDivForTitle(this.m_calculatedHeightForFirstDiv * 1);
		this.RePositionDivForChevronBar(this.m_calculatedHeightForFirstDiv * 1);
	}
	this.init();
	this.drawChart();
	this.index1 = 0;
};

RoadMapChart.prototype.RePositionDivForTitle = function (height) {
	this.draggableCanvas = document.getElementById('draggableCanvasTitle' + this.m_objectid);
	this.draggableDiv = document.getElementById("draggableDivTitle" + this.m_objectid);

	if (IsBoolean(this.isMaximized)) {

		this.draggableDiv.style.left = this.m_x + "px";
		this.draggableDiv.style.top = this.m_y + "px";
		this.draggableDiv.style.width = this.m_width + "px";
		this.draggableDiv.style.height = height + "px";

		this.draggableCanvas.width = this.m_width;
		this.draggableCanvas.height = height;

	} else {
		this.draggableDiv.style.left = this.m_x * 1 + 1 + "px";
		this.draggableDiv.style.top = this.m_roadMapTitleTop + "px";
		this.draggableDiv.style.width = this.oldm_width + "px";
		this.draggableDiv.style.height = height + "px";

		this.draggableCanvas.width = this.oldm_width;
		this.draggableCanvas.height = height;
		this.m_x = 0;
		this.m_y = 0;

	}
};

RoadMapChart.prototype.RePositionDivForChevronBar = function (height) {
	this.draggableCanvas1 = document.getElementById('draggableCanvasForRoadMapSeries' + this.m_objectid);
	this.draggableDiv1 = document.getElementById("draggableDivForRoadMapSeries" + this.m_objectid);
	var divHeight = document.getElementById("draggableDivForRoadMapSeries" + this.m_objectid).style.height;
	if (IsBoolean(this.isMaximized)) {
		this.draggableDiv1.style.left = this.m_x + "px";
		this.draggableDiv1.style.top = (this.m_calculatedHeightForFirstDiv * 1 - 2) + "px";
		this.draggableDiv1.style.width = this.m_width + "px";
		this.draggableDiv1.style.height = (divHeight) + "px";

		this.draggableCanvas1.width = this.m_width;
		this.draggableCanvas1.height = height; //750 hieght is all addition of all category rectangle heights

	} else {
		var mydiv = document.getElementById('draggableCanvasForRoadMapSeries' + this.m_objectid);
		this.draggableDiv1.style.left = this.m_x * 1 + "px";
		this.draggableDiv1.style.top = (this.m_calculatedHeightForFirstDiv * 1 - 3) + "px";
		this.draggableDiv1.style.width = this.oldm_width + "px"; //this.oldm_width +"px";
		this.draggableDiv1.style.height = (this.m_calculatedHeightForSecondDiv * 1) + "px";
		this.draggableCanvas1.width = this.oldm_width;
		this.draggableCanvas1.height = this.oldm_height;
		this.m_x = 0;
		this.m_y = 0;

	}
};

//=============================roadmapchart init ========================

RoadMapChart.prototype.init = function () {
	this.setCategoryData();
	this.setSubCategoryData();
	this.setSeriesData();
	this.setStartValues();
	this.setEndValues();
	this.setAllFieldsName();
	this.setAllFieldsDisplayName();

	var categoryNames = this.getCategoryNames();
	var subCategoryNames = this.getSubCategoryNames();

	var cat = this.unique(this.convert2DTo1D(this.m_categoryData));
	this.categoryValue = cat;
	this.setstoreDataInMap(categoryNames, this.categoryValue, subCategoryNames);
	this.m_catSubValueInMap = this.getstoreDataInMap();
	this.setCategoryAndSubCategory();
	this.m_displaySeriesNames = this.getSeriesNames();
	this.setShowSeries(this.m_displaySeriesNames);
	this.isSeriesDataEmpty();
	var color = this.getConvertColorArray(this.m_seriescolor);
	this.setSeriesColor(color);
	this.setSubCateogryNameAndLengthArray();
	this.setMapIn3DArray();
	this.setDifferenceBetweenStartDataAndEndDate();
	this.m_roadmapCalculation.init(this.categoryValue, this.m_differenceDate, this.m_startProjectDate, this.m_enddProjectDate, this);

	this.m_xAxis.init(this, this.m_roadmapCalculation);

	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);
	this.m_roadMapTitle.init(this);
	this.initializeChartUIPropertiesForCategoryData();
	this.initializeChartUIPropertiesForSubCategoryData();
	this.initializeChartUIPropertiesForSeriesData();
	this.initializeChartUIPropertiesForYearSubtitle();
	if (!IsBoolean(this.m_isEmptySeries)) {
		//this.initializeCalculation();
		//this.m_yAxis.init(this,this.m_calculation);
	}
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};

RoadMapChart.prototype.getConvertColorArray = function (color) {
	var string = color;

	var arr = string.split(",");

	return arr;
};

RoadMapChart.prototype.setSeriesColor = function (color) {
	this.m_colorArray = [];
	for (var i = 0; i < color.length; i++) {
		this.m_colorArray[i] = convertColorToHex(color[i]);
	}
};

RoadMapChart.prototype.getstoreDataInMap = function () {
	return this.m_groupSubGroupDataMap;
};

RoadMapChart.prototype.setstoreDataInMap = function (typeOfCategory, uniqueCategory, typeOfSubcategory) {
	this.m_groupSubGroupDataMap = new Object();
	for (var i = 0; i < uniqueCategory.length; i++) {
		this.m_groupSubGroupDataMap[uniqueCategory[i]] = new Object();
		for (var j = 0; j < this.m_dataProvider.length; j++) {
			if (this.m_dataProvider[j][typeOfCategory] == uniqueCategory[i]) {
				var subGroupValue = this.m_dataProvider[j][typeOfSubcategory];
				if (this.m_groupSubGroupDataMap[uniqueCategory[i]][subGroupValue] == undefined) {
					this.m_groupSubGroupDataMap[uniqueCategory[i]][subGroupValue] = [];
				}
				var seriesAndDateDataMap = this.getSeriesAndDateDataMap(j);
				this.m_groupSubGroupDataMap[uniqueCategory[i]][subGroupValue].push(seriesAndDateDataMap);
			}
		}
	}
};

RoadMapChart.prototype.getSeriesAndDateDataMap = function (recordIndex) {
	var seriesNames = this.getSeriesNames();
	var startvalueNames = this.getStartValueNames();
	var endvalueNames = this.getEndValueNames();
	//var noneValueNames =  this.m_chart.getNoneNames();
	var seriesAndDateDataMap = new Object();
	for (var j = 0; j < this.m_dataProvider.length; j++) {
		if (j == recordIndex) {
			seriesAndDateDataMap[startvalueNames] = this.m_dataProvider[j][startvalueNames];
			seriesAndDateDataMap[endvalueNames] = this.m_dataProvider[j][endvalueNames];
			for (var i = 0; i < seriesNames.length; i++) {
				seriesAndDateDataMap[seriesNames[i]] = this.m_dataProvider[j][seriesNames[i]];
				//seriesAndDateDataMap[noneValueNames[i]] = this.m_dataProvider[j][noneValueNames[i]];
			}
		}
	}

	return seriesAndDateDataMap;
};

RoadMapChart.prototype.convert2DTo1D = function (data) {
	var temp = [];
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i].length; j++) {
			temp.push(data[i][j]);
		}
	}
	return temp;
};

RoadMapChart.prototype.unique = function (data) {
	var outputArray = [];
	for (var i = 0; i < data.length; i++) {
		if (($.inArray(data[i], outputArray)) == -1) {
			outputArray.push(data[i]);
		}
	}
	return outputArray;
};

RoadMapChart.prototype.setCategoryData = function () {
	var m_categoryData = [];
	this.m_categoryData = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
	this.m_categoryData = m_categoryData;
};

RoadMapChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

RoadMapChart.prototype.setSubCategoryData = function () {
	var m_subCategoryData = [];
	this.m_subCategoryData = [];
	for (var i = 0; i < this.getSubCategoryNames().length; i++) {
		m_subCategoryData[i] = this.getDataFromJSON(this.getSubCategoryNames()[i]);
	}
	this.m_subCategoryData = m_subCategoryData;
};

RoadMapChart.prototype.getSubCategoryData = function () {
	return this.m_subCategoryData;
};

RoadMapChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];

	for (var j = 0; j < this.getCategoryData().length; j++) {
		for (var i = 0; i < this.getSeriesNames().length; i++) {
			this.m_seriesData[j] = this.getDataFromJSON(this.getSeriesNames()[i]);
		}
	}
};

RoadMapChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

RoadMapChart.prototype.setStartValues = function () {
	this.m_startValues = [];
	for (var j = 0; j < this.getCategoryData().length; j++) {
		for (var i = 0; i < this.getStartValueNames().length; i++) {
			this.m_startValues[j] = this.getDataFromJSON(this.getStartValueNames()[i]);
		}
	}
};

RoadMapChart.prototype.getStartValues = function () {
	return this.m_startValues;
};

RoadMapChart.prototype.setEndValues = function () {
	this.m_endValues = [];
	for (var j = 0; j < this.getCategoryData().length; j++) {
		for (var i = 0; i < this.getEndValueNames().length; i++) {
			this.m_endValues[j] = this.getDataFromJSON(this.getEndValueNames()[i]);
		}
	}
};

RoadMapChart.prototype.getEndValues = function () {
	return this.m_endValues;
};

RoadMapChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getCategoryNames()[i]);
	}
	for (var j = 0; j < this.getSubCategoryNames().length; j++) {
		this.m_allfieldsName.push(this.getSubCategoryNames()[j]);
	}
	for (var j = 0; j < this.getSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getSeriesNames()[j]);
	}
	for (var j = 0; j < this.getStartValueNames().length; j++) {
		this.m_allfieldsName.push(this.getStartValueNames()[j]);
	}
	for (var j = 0; j < this.getEndValueNames().length; j++) {
		this.m_allfieldsName.push(this.getEndValueNames()[j]);
	}
};

RoadMapChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

RoadMapChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};

RoadMapChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};

RoadMapChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};

RoadMapChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

RoadMapChart.prototype.setCategoryAndSubCategory = function () {
	this.m_categoryDataFromMap = [];
	this.m_subCategoryDataFromMap = [];
	this.m_arrangeSubCatData = [];
	var countCat = 0;
	var countSubCat = 0;
	var map = {};
	var lengthOfSubCat = [];
	for (var key in this.m_catSubValueInMap) {
		this.m_categoryDataFromMap[countCat++] = key;
	}
	for (var i = 0; i < this.m_categoryDataFromMap.length; i++) {
		map = this.m_catSubValueInMap[this.m_categoryDataFromMap[i]];
		lengthOfSubCat[i] = Object.keys(map).length;
		for (key in map) {
			this.m_subCategoryDataFromMap[countSubCat] = key;
			countSubCat++;
		}
	}
	var c = 0;
	for (var i = 0; i < this.m_categoryDataFromMap.length; i++) {
		this.m_arrangeSubCatData[i] = [];
		for (var j = 0; j < lengthOfSubCat[i]; j++) {
			this.m_arrangeSubCatData[i][j] = this.m_subCategoryDataFromMap[c++];
		}
	}
};

RoadMapChart.prototype.setSubCateogryNameAndLengthArray = function () {
	var keyName = [];
	var count = 0;
	this.m_subCatNameArray = [];
	for (var i = 0; i < this.m_categoryData.length; i++) {

		var map = this.m_catSubValueInMap[this.categoryValue[i]];

		this.m_subCateogryLengthArray[i] = Object.keys(map).length;
		for (key in map) {
			keyName[count] = key;
			count++;
		}
	}
	var c = 0;
	for (var i = 0; i < this.m_categoryData.length; i++) {
		this.m_subCatNameArray[i] = [];

		for (var j = 0; j < this.m_subCateogryLengthArray[i]; j++) {
			this.m_subCatNameArray[i][j] = keyName[c++];
		}
	}
};

RoadMapChart.prototype.setMapIn3DArray = function () {
	this.m_subCateogry3DArray = [];
	var i = 0;
	var categoryMap = {};
	var subCategoryMap = {};
	this.m_subCatNameArray = [];
	this.m_arrangeSubCatData = [];
	for (key in this.m_catSubValueInMap) {
		categoryMap = this.m_catSubValueInMap[key];
		this.m_subCateogry3DArray[i] = [];
		var j = 0;
		this.m_subCatNameArray[i] = [];
		this.m_arrangeSubCatData[i] = [];
		for (key in categoryMap) {
			subCategoryMap = categoryMap[key];
			var len = Object.keys(subCategoryMap).length; //this.m_subCateogry3DArray[i][j][k]=subCategoryMap[k];
			if (len > 1) {
				var twoDArray = this.get2dArray(subCategoryMap);
				for (var index = 0; index < twoDArray.length; index++) {
					this.m_subCateogry3DArray[i][j] = [];
					this.m_subCatNameArray[i][j] = key;
					this.m_arrangeSubCatData[i][j] = key;
					for (var index2 = 0; index2 < twoDArray[index].length; index2++) {
						this.m_subCateogry3DArray[i][j][index2] = twoDArray[index][index2];
					}
					j++;
				}
			} else {
				this.m_subCateogry3DArray[i][j] = [];
				this.m_subCatNameArray[i][j] = key;
				this.m_arrangeSubCatData[i][j] = key;
				this.m_subCateogry3DArray[i][j][0] = subCategoryMap[0];
				j++;
			}
		}
		i++;
	}
};

RoadMapChart.prototype.setDifferenceBetweenStartDataAndEndDate = function () {
	var obj = {};
	this.containerArray = [];
	this.m_differenceDate = [];
	this.m_startProjectDate = [];
	this.m_enddProjectDate = [];
	this.m_projectName = [];
	this.m_projectId = [];
	for (var i = 0; i < this.m_subCateogry3DArray.length; i++) {
		this.m_differenceDate[i] = [];
		this.m_startProjectDate[i] = [];
		this.m_enddProjectDate[i] = [];
		this.m_projectName[i] = [];
		this.m_projectId[i] = [];
		for (var j = 0; j < this.m_subCateogry3DArray[i].length; j++) {
			this.m_differenceDate[i][j] = [];
			this.m_startProjectDate[i][j] = [];
			this.m_enddProjectDate[i][j] = [];
			this.m_projectName[i][j] = [];
			this.m_projectId[i][j] = [];
			for (var k = 0; k < this.m_subCateogry3DArray[i][j].length; k++) {
				obj = this.m_subCateogry3DArray[i][j][k];
				var a = 0;
				for (key in obj) {
					this.containerArray[a] = obj[key];
					a++;
				}
				var str1 = this.containerArray[0];
				var startDate = str1.replace(/\-/g, "/");
				var str2 = this.containerArray[1];
				var endDate = str2.replace(/\-/g, "/");
				var start = new XDate(startDate);
				var end = new XDate(endDate);
				var difference = start.diffDays(end);
				this.m_differenceDate[i][j].push(difference);
				this.m_startProjectDate[i][j].push(this.containerArray[0]);
				this.m_enddProjectDate[i][j].push(this.containerArray[1]);
				this.m_projectName[i][j].push(this.containerArray[2]);
				this.m_projectId[i][j].push(this.containerArray[3]);
			}
		}
	}
};

RoadMapChart.prototype.initializeChartUIPropertiesForCategoryData = function () {
	this.m_xPositionArrayForCategoryData = this.m_roadmapCalculation.getXPositionArrayForCategoryData();
	this.m_yPositionArrayForCategoryData = this.m_roadmapCalculation.getYPositionArrayForCategoryData();
	this.m_groupWidthForCategoryData = this.m_roadmapCalculation.getWidthForCategoryData();
	this.m_heightForCategoryData = this.m_roadmapCalculation.getHieghtForCategoryData();
	this.m_categoryColors = this.m_colorArray;

	this.initializeCategoryRectangle();

};

RoadMapChart.prototype.initializeChartUIPropertiesForSubCategoryData = function () {
	this.m_xPositionArrayForSubCategoryData = this.m_roadmapCalculation.getXPositionArrayForSubCategoryData();
	this.m_yPositionArrayForSubCategoryData = this.m_roadmapCalculation.getYPositionArrayForSubCategoryData();
	this.m_groupWidthForSubCategoryData = this.m_roadmapCalculation.getWidthForSubCategoryData();
	this.m_heightForSubCategoryData = this.m_roadmapCalculation.getHeightForSubCategoryData();
	this.m_subCategoryColors = this.m_roadmapCalculation.getColorsForSubCategoryData();
	this.initializeSubCategoryRectangle();
};

RoadMapChart.prototype.initializeChartUIPropertiesForYearSubtitle = function () {
	this.m_xPositionArrayForYearSubtitle = this.m_roadmapCalculation.getXPositionForYearSubtitle();
	this.m_yPositionArrayForYearSubtitle = this.m_roadmapCalculation.getYPositionForYearSubtitle();
	this.m_groupWidthForYearSubtitle = this.m_roadmapCalculation.getwidthForYearSubtitle();
	this.m_heightForYearSubtitle = this.m_roadmapCalculation.getheightForYearSubtitle();
	this.m_textForYearSubtitle = this.m_roadmapCalculation.getTextForSubtitle();
	this.m_colorsForYearSubtitle = this.m_roadmapCalculation.getColorForSubtitle(); //["#ccc","#ccc","#ccc","#ccc","#ccc","#ccc","#ccc","#ccc","#ccc"];
	this.initializeYearSubtitle();
};

RoadMapChart.prototype.initializeChartUIPropertiesForSeriesData = function () {
	this.m_xPositionArrayForSeriesData = this.m_roadmapCalculation.getXPositionArrayForSeriesData();
	this.m_yPositionArrayForSeriesData = this.m_roadmapCalculation.getYPositionArrayForSeriesData();
	this.m_widthForSeriesData = this.m_roadmapCalculation.getWidthArrayForSeriesData();
	this.m_heightForSeriesData = this.m_roadmapCalculation.getHeightArrayForSeriesData();
	this.m_seriesColors = this.m_roadmapCalculation.getColorsForSeriesData();
	this.m_startProgressingFlagArray = this.m_roadmapCalculation.m_startProgressingFlag;
	this.m_endProgressingFlagArray = this.m_roadmapCalculation.m_endProgressingFlag;
	this.m_outOfchartFlagArray = this.m_roadmapCalculation.m_outOfChartSeriesDataFlag;
	this.initializeSeries();
};

RoadMapChart.prototype.initializeCategoryRectangle = function () {
	this.m_roadMapSeriesArray = new RoadMapSeries();
	this.m_roadMapSeriesArray.init(this.m_xPositionArrayForCategoryData, this.m_yPositionArrayForCategoryData, this.m_groupWidthForCategoryData, this.m_heightForCategoryData, this.m_categoryColors, "Group", this.categoryValue, [], [], [], this);
};

RoadMapChart.prototype.initializeSubCategoryRectangle = function () {
	for (var i = 0; i < this.categoryValue.length; i++) {
		this.m_roadMapSeriesArrayForSubCat[i] = new RoadMapSeries();
		this.m_roadMapSeriesArrayForSubCat[i].init(this.m_xPositionArrayForSubCategoryData[i], this.m_yPositionArrayForSubCategoryData[i], this.m_groupWidthForSubCategoryData[i], this.m_heightForSubCategoryData[i], this.m_subCategoryColors[i], "SubGroup", this.m_arrangeSubCatData[i], [], [], [], this);
	}
};

RoadMapChart.prototype.initializeYearSubtitle = function () {
	this.m_roadMapYearSubTitleLine = new RoadmapLineSeries();
	this.m_roadMapYearSubTitleLine.init(this.m_xPositionArrayForYearSubtitle, this.m_yPositionArrayForYearSubtitle, this.m_groupWidthForYearSubtitle, convertColorToHex(this.m_scalecolor), this);

	this.m_roadMapYearSubTitle = new RoadMapSeries();
	this.m_roadMapYearSubTitle.init(this.m_xPositionArrayForYearSubtitle, this.m_yPositionArrayForYearSubtitle, this.m_groupWidthForYearSubtitle, this.m_heightForYearSubtitle, this.m_colorsForYearSubtitle, "Quarter", this.m_textForYearSubtitle, [], [], [], this);

};

RoadMapChart.prototype.initializeSeries = function () {
	var counter = 0;
	this.m_roadMapSeriesArrayForSeries = [];
	for (var i = 0; i < this.m_startProjectDate.length; i++) {
		for (var j = 0; j < this.m_startProjectDate[i].length; j++) {
			this.m_roadMapSeriesArrayForSeries[counter] = new RoadMapSeries();
			this.m_roadMapSeriesArrayForSeries[counter].init(this.m_xPositionArrayForSeriesData[i][j], this.m_yPositionArrayForSeriesData[i][j], this.m_widthForSeriesData[i][j], this.m_heightForSeriesData[i][j], this.m_seriesColors[i][j], "Series", this.m_projectName[i][j], this.m_startProgressingFlagArray[i][j], this.m_endProgressingFlagArray[i][j], this.m_outOfchartFlagArray[i][j], this);
			counter++;
		}
	}
};

RoadMapChart.prototype.getLenghtOfSubcategory = function () {
	var counter = 0;
	for (var i = 0; i < this.m_startProjectDate.length; i++) {
		for (var j = 0; j < this.m_startProjectDate[i].length; j++) {
			counter++;
		}
	}
	return counter;
};

RoadMapChart.prototype.get2dArray = function (subCategoryMap) {
	var array = [];
	var counter = 0;
	for (var i = 0; i < subCategoryMap.length; i++) {
		if (i == 0) {
			array[counter] = [];
			array[counter].push(subCategoryMap[i]);
			counter++;
		} else {
			var flag = this.isConflicting(subCategoryMap[i - 1], subCategoryMap[i]);
			if (flag == true) {
				array[counter] = [];
				array[counter].push(subCategoryMap[i]);
				counter++;
			} else {
				array[counter - 1].push(subCategoryMap[i]);
			}
		}
	}
	return array;
};

RoadMapChart.prototype.isConflicting = function (proj1, proj2) {
	var startDateName = this.m_startValueNames;
	var endDateName = this.m_endValueNames;
	var sd1 = this.getDateFromDateString(proj1[startDateName]);
	var ed1 = this.getDateFromDateString(proj1[endDateName]);
	var sd2 = this.getDateFromDateString(proj2[startDateName]);
	var ed2 = this.getDateFromDateString(proj2[endDateName]);

	if (sd1 < sd2) {
		if (ed1 < sd2)
			return false;
		else
			return true;
	} else {
		if (sd1 < ed2)
			return true;
		else
			return false;
	}
};

RoadMapChart.prototype.getDateFromDateString = function (date) {
	var str = date.replace(/\-/g, "/");
	return new Date(str);
};

RoadMapChart.prototype.compareDates = function (d1, d2) {
	if (d1 < d2) {
		return 1;
	} else if (d1 > d2) {
		return -1;
	} else {
		return 0;
	}
};

RoadMapChart.prototype.drawChart = function () {
	this.ctx.clearRect(this.m_x, this.m_y, this.m_width, this.m_height);
	this.ctxForRoadMapSeries.clearRect(this.m_x, this.m_y, this.m_width, this.m_height);
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();

	if (IsBoolean(this.m_isEmptySeries)) {
		this.drawMessage(this.m_status.noData);
	} else {
		this.drawYearSubTitle();
		this.drawRoadMapChartCategory();
		this.drawRoadMapChartSubCategory();
		this.drawRoadMapChartSeries();
	}
};

RoadMapChart.prototype.drawYearSubTitle = function () {
	this.m_roadMapYearSubTitle.draw();
	this.m_roadMapYearSubTitleLine.draw();
};

RoadMapChart.prototype.drawRoadMapChartCategory = function () {
	this.m_roadMapSeriesArray.draw();
};

RoadMapChart.prototype.drawRoadMapChartSubCategory = function () {
	for (var i = 0; i < this.categoryValue.length; i++) {
		this.m_roadMapSeriesArrayForSubCat[i].draw();
	}
};

RoadMapChart.prototype.drawRoadMapChartSeries = function () {
	for (var i = 0; i < this.m_roadMapSeriesArrayForSeries.length; i++) {
		this.m_roadMapSeriesArrayForSeries[i].draw();
	}
};

RoadMapChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};
RoadMapChart.prototype.drawTitle = function () {
	this.m_roadMapTitle.draw(this.m_roadmapCalculation, this);
};

RoadMapChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw(this.m_roadmapCalculation, this);
};

//****************override all metohde of global class*************
RoadMapChart.prototype.getStartX = function () {
	return (this.m_x * 1 + this.m_leftSideSpaceForChart * 1);
};

RoadMapChart.prototype.getStartY = function () {
	this.m_startY = parseInt(this.m_y) + parseInt(this.m_height) - this.m_chartYMargin - this.getXAxisDescriptionMargin() - 2 * 1;
	return this.m_startY;
};

RoadMapChart.prototype.getEndX = function () {
	this.m_endX = 1 * (this.m_x) + 1 * (this.m_width);
	return this.m_endX;
};

RoadMapChart.prototype.getEndY = function () {
	var titleMargin = 5;
	var subtitleMargin = 3;
	if (this.m_groupname == "") {
		if (IsBoolean(this.m_showtitle) || IsBoolean(this.m_showgradient)) {
			titleMargin = 30;
		}
		if (IsBoolean(this.m_showsubtitle)) {
			subtitleMargin = (this.m_subTitle.getDescription() != "") ? (this.m_subTitle.getFontSize() * 1.5) : 10;
		}
		//subtitleMargin = (this.m_chart.m_subTitle.getDescription()!="") ? (this.m_chart.m_subTitle.getFontSize()*2.8) : 10;
	}
	this.m_endY = this.m_y * 1 + this.m_chartYMargin * 1 + titleMargin * 1 + subtitleMargin * 1 + this.m_categoryMarkingMargin * 1;
	return this.m_endY;
};

RoadMapChart.prototype.getSecondAxisToXAxisMargin = function () {
	var lam = 2;
	return lam;
};

RoadMapChart.prototype.getSecondAxisMargin = function () {
	var sam = 20;
	if (IsBoolean(this.m_secondaryaxisshow)) {
		sam = 50 * 1;
	}
	return sam;
};

RoadMapChart.prototype.getBorderToLegendMargin = function () {
	var blm = 2;
	return blm;
};

RoadMapChart.prototype.getVerticalLegendMargin = function () {
	var lm = 0;
	if (this.m_legend.getLegendDirection() == "vertical") {
		var lcm = 0;
		if (IsBoolean(this.getShowcheckboxwithlegend())) {
			lcm = 15;
		}
		var crm = 2;
		var rm = 10;
		if (IsBoolean(this.isMaximized))
			rm = 80;
		var rtm = 2;
		var ltm = 0;

		this.ctx.beginPath();
		if (IsBoolean(this.isMaximized))
			this.ctx.font = this.m_legend.m_legendfontstyle + " " + this.m_legend.m_legendfontWeight + " " + 12 * 1 + "px " + selectGlobalFont(this.m_legend.m_legendfontfamily);
		else
			this.ctx.font = this.m_legend.m_legendfontstyle + " " + this.m_legend.m_legendfontWeight + " " + 20 * 1 + "px " + selectGlobalFont(this.m_legend.m_legendfontfamily);

		var textLength = 0;

		for (var i = 0; i < this.m_seriesNames.length; i++) {
			textLength = this.ctx.measureText(this.m_seriesNames[i]).width;
			if (ltm < textLength)
				ltm = textLength;
		}
		this.ctx.closePath();
		lm = lcm * 1 + crm * 1 + rm * 1 + rtm * 1 + ltm * 1;
	}
	return lm;
};

RoadMapChart.prototype.getVerticalLegendToSecondAxisMargin = function () {
	var vsm = 2;
	return vsm;
};

RoadMapChart.prototype.getXAxisDescriptionMargin = function () {
	var xAxisDescriptionMargin = 2;

	//this.ctx.font=this.m_chart.m_xAxis.getFontWeight()+" "+this.m_chart.m_xAxis.getFontSize()+"px "+this.m_chart.m_xAxis.getFontFamily();
	//xAxisDescriptionMargin=this.ctx.measureText("N").width;
	xAxisDescriptionMargin = this.m_xAxis.getFontSize() * 1.5;

	return xAxisDescriptionMargin;
};

RoadMapChart.prototype.getXAxisLabelMargin = function () {
	var xAxislabelDescMargin = 15;
	if (IsBoolean(this.m_xAxis.getLabelTilted())) {
		this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.m_xAxis.getLabelFontSize() + "px " + this.m_xAxis.getLabelFontFamily();
		xAxislabelDescMargin = this.ctx.measureText(this.m_categoryData[0]).width;
		for (var i = 1; i < this.m_categoryData.length; i++) {
			if (xAxislabelDescMargin < this.ctx.measureText(this.m_categoryData[i]).width)
				xAxislabelDescMargin = this.ctx.measureText(this.m_categoryData[i]).width;
		}
		if (xAxislabelDescMargin > this.m_height / 4) {
			xAxislabelDescMargin = (this.m_xAxis.getLabelrotation() <= 70) ? (this.m_height / 4 - 15) : this.m_height / 4;
		}
	} else {
		this.ctx.font = this.m_xAxis.getLabelFontWeight() + " " + this.m_xAxis.getLabelFontSize() + "px " + this.m_xAxis.getLabelFontFamily();
		var xlm = this.m_xAxis.m_labelfontsize * 1.8;
		this.noOfRows = this.setNoOfRows();
		xAxislabelDescMargin = (xlm) * this.noOfRows;
	}
	return xAxislabelDescMargin;
};

RoadMapChart.prototype.setNoOfRows = function () {
	this.ctx.font = this.m_xAxis.m_labelfontstyle + " " + this.m_xAxis.m_labelfontweight + " " + this.m_xAxis.m_labelfontsize + "px " + selectGlobalFont(this.m_xAxis.m_labelfontfamily);
	var xDivision = (this.getEndX() - this.getStartX()) / this.m_categoryData.length;
	var noOfRow = 1;
	for (var i = 1; i < this.m_categoryData.length; i++) {
		if (this.ctx.measureText(this.m_categoryData[i]).width > xDivision)
			noOfRow = 2;
	}
	return noOfRow;
};

RoadMapChart.prototype.getYAxisLabelMargin = function () {
	var lm = 0;
	var lfm = this.getLabelFormatterMargin();
	var lw = this.getLabelWidth();
	var lsm = this.getLabelSignMargin();
	var lpm = this.getLabelPrecisionMargin();
	var lsfm = this.getLabelSecondFormatterMargin();
	lm = lfm * 1 + lw * 1 + lsm * 1 + lpm * 1 + lsfm * 1;
	return lm;
};

RoadMapChart.prototype.getLabelSecondFormatterMargin = function () {
	var lsfm = 0;
	if (!IsBoolean(this.m_fixedlabel)) {
		if (IsBoolean(this.m_yAxes.getLeftaxisFormater())) {
			if (this.getSecondaryFormater() != 'none' && this.getSecondaryFormater() != '')
				if (this.getSecondaryUnit() != 'none' && this.getSecondaryUnit() != '') {
					var secondunit = this.m_util.getFormatterSymbol(this.getSecondaryFormater(), this.getSecondaryUnit());
					this.ctx.font = this.m_yAxes.m_fontstyle + " " + this.m_yAxes.m_fontweight + " " + this.m_yAxes.m_fontsize + "px " + selectGlobalFont(this.m_yAxes.m_fontfamily);
					lsfm = this.ctx.measureText(secondunit).width;
				}
		}
	}
	return lsfm;
};

RoadMapChart.prototype.getLabelPrecisionMargin = function () {
	var lpm = 5;
	if (!IsBoolean(this.m_fixedlabel)) {
		if (IsBoolean(this.m_yAxes.getLeftaxisFormater())) {
			if (this.m_formater != 'none' && this.m_formater != '' && this.m_formater == "Number")
				if (this.m_unit != 'none' && this.m_unit != '')
					if (this.m_precision != 'none' && this.m_precision != '' && this.m_precision != 0) {
						this.ctx.beginPath();
						this.ctx.font = this.m_yAxes.m_labelfontstyle + " " + this.m_yAxes.m_labelfontweight + " " + this.m_yAxes.m_labelfontsize + "px " + selectGlobalFont(this.m_yAxes.m_labelfontfamily);
						var precisionText = ".";
						for (var i = 0; i < this.m_precision; i++)
							precisionText = precisionText + "" + "0";
						lpm = this.ctx.measureText(precisionText).width;
						this.ctx.closePath();
					}
			if (this.getSecondaryFormater() != 'none' && this.getSecondaryFormater() != '' && this.m_secondaryformater == "Number")
				if (this.getSecondaryUnit() != 'none' && this.getSecondaryUnit() != '')
					if (this.m_secondaryaxisprecision != 'none' && this.m_secondaryaxisprecision != '' && this.m_secondaryaxisprecision != 0) {
						this.ctx.beginPath();
						this.ctx.font = this.m_yAxes.m_labelfontstyle + " " + this.m_yAxes.m_labelfontweight + " " + this.m_yAxes.m_labelfontsize + "px " + selectGlobalFont(this.m_yAxes.m_labelfontfamily);
						var precisionText = ".";
						for (var i = 0; i < this.m_secondaryaxisprecision; i++)
							precisionText = precisionText + "" + "0";
						lpm = this.ctx.measureText(precisionText).width;
						this.ctx.closePath();
					}
		}
	}
	return lpm;
};

RoadMapChart.prototype.getLabelSignMargin = function () {
	var lsm = 0;
	var minSeriesValue = this.getMinimumSeriesValue();
	if (minSeriesValue < 0) {
		this.ctx.beginPath();
		this.ctx.font = this.m_yAxes.m_labelfontstyle + " " + this.m_yAxes.m_labelfontweight + " " + this.m_yAxes.m_labelfontsize + "px " + selectGlobalFont(this.m_yAxes.m_labelfontfamily);
		lsm = this.ctx.measureText(minSeriesValue).width;
		this.ctx.closePath();
	}

	if (this.getLabelWidth() > lsm)
		lsm = ctx.measureText("-").width;
	return lsm;
};

RoadMapChart.prototype.getMinimumSeriesValue = function () {
	var minSeriesVal = 0;
	for (var i = 0; i < this.m_seriesData.length; i++) {
		for (var j = 0; j < this.m_seriesData[i].length; j++) {
			if (i == 0 && j == 0) {
				minSeriesVal = this.m_seriesData[i][j];
			}
			if (minSeriesVal * 1 > this.m_seriesData[i][j] * 1) {
				minSeriesVal = this.m_seriesData[i][j];
			}
		}
	}
	return minSeriesVal;
};

RoadMapChart.prototype.getLabelFormatterMargin = function () {
	var lfm = 0;
	if (!IsBoolean(this.m_fixedlabel)) {
		if (IsBoolean(this.m_yAxes.getLeftaxisFormater())) {
			if (this.m_formater != 'none' && this.m_formater != '')
				if (this.m_unit != 'none' && this.m_unit != '') {
					var unit = this.m_util.getFormatterSymbol(this.m_formater, this.m_unit);
					this.ctx.beginPath();
					this.ctx.font = this.m_yAxes.m_labelfontstyle + " " + this.m_yAxes.m_labelfontweight + " " + this.m_yAxes.m_labelfontsize + "px " + selectGlobalFont(this.m_yAxes.m_labelfontfamily);
					lfm = this.ctx.measureText(unit).width;
					this.ctx.closePath();
				}
		}
	}
	return lfm;
};

RoadMapChart.prototype.getLabelWidth = function () {
	var lw = 0;
	var maxSeriesVal = this.getMaximumSeriesValue();
	var maxSeriesValDecimal = maxSeriesVal;
	if (this.m_charttype == "100%") {
		maxSeriesVal = 100;
		maxSeriesValDecimal = maxSeriesVal ;
	} else {
		var maxDivisor = getMax(maxSeriesVal);
		maxSeriesVal = maxDivisor[0];
		maxSeriesValDecimal = (maxDivisor[2] < 1) ? maxSeriesVal + ".00" : maxSeriesVal;
	}
	this.ctx.beginPath();
	this.ctx.font = this.m_yAxes.m_labelfontstyle + " " + this.m_yAxes.m_labelfontweight + " " + this.m_yAxes.m_labelfontsize + "px " + selectGlobalFont(this.m_yAxes.m_labelfontfamily);
	lw = this.ctx.measureText(maxSeriesValDecimal).width;
	this.ctx.closePath();
	if (!IsBoolean(this.m_fixedlabel)) {
		if (IsBoolean(this.m_yAxes.getLeftaxisFormater())) {
			if (this.m_formater != 'none' && this.m_formater != '' && this.m_formater == "Number")
				if (this.m_unit != 'none' && this.m_unit != '') {
					var unit = this.m_util.getFormatterSymbol(this.m_formater, this.m_unit);
					maxSeriesVal = this.m_util.updateTextWithFormatter(maxSeriesVal, unit, this.m_precision);
					this.ctx.beginPath();
					this.ctx.font = this.m_yAxes.m_labelfontstyle + " " + this.m_yAxes.m_labelfontweight + " " + this.m_yAxes.m_labelfontsize + "px " + selectGlobalFont(this.m_yAxes.m_labelfontfamily);
					lw = this.ctx.measureText(maxSeriesVal).width;
					this.ctx.closePath();
				}
			if (this.getSecondaryFormater() != 'none' && this.getSecondaryFormater() != '' && this.m_secondaryformater == "Number")
				if (this.getSecondaryUnit() != 'none' && this.getSecondaryUnit() != '') {
					var secondunit = this.m_util.getFormatterSymbol(this.getSecondaryFormater(), this.getSecondaryUnit());
					maxSeriesVal = this.m_util.updateTextWithFormatter(maxSeriesVal, secondunit, this.m_secondaryaxisprecision);
					this.ctx.beginPath();
					this.ctx.font = this.m_yAxes.m_labelfontstyle + " " + this.m_yAxes.m_labelfontweight + " " + this.m_yAxes.m_labelfontsize + "px " + selectGlobalFont(this.m_yAxes.m_labelfontfamily);
					lw = this.ctx.measureText(maxSeriesVal).width;
					this.ctx.closePath();
				}
		}
	}
	return lw;
};

RoadMapChart.prototype.getYAxisDescriptionMargin = function () {
	var dm = 0;
	if (this.m_yAxes.m_description != '') {
		dm = this.m_yAxes.m_fontsize * 2;
		if (this.m_yAxes.m_textdecoration == "underline")
			dm = dm * 1 + 1;
	}
	return dm;
};

RoadMapChart.prototype.getDescriptionToLabelMargin = function () {
	var dtlm = 5;
	return dtlm;
};

RoadMapChart.prototype.getLabelToAxisMargin = function () {
	var ltam = 5;
	return ltam;
};

RoadMapChart.prototype.getToolTipData = function (mouseX, mouseY, divId) {
	this.mouseX = mouseX;
	this.mouseY = mouseY;
	var data = [];
	if ("draggableDivTitle" + this.m_objectid == divId) {
		if (this.mouseX >= (this.m_x * 1) + 5 && this.mouseX <= (this.m_x * 1) + 30 && this.mouseY >= this.m_y && this.mouseY <= (this.m_y * 1) + 25) {
			if (IsBoolean(this.isMaximized))
				data[0] = "Minimize";
			else
				data[0] = "Maximize";
		} else if (IsBoolean(this.isMaximized) && this.isOnGridIcon(this.mouseX, this.mouseY) && this.getObjectType() == "chart") {
			if (IsBoolean(this.m_showmaximizebutton)) {
				if (IsBoolean(this.isGrid)) {
					data[0] = "Show the Chart";
				} else {
					data[0] = "Show Data In Grid";
				}
			}
		}
	} else {
		if ((this.mouseX >= this.getStartX()) && (this.mouseX <= this.getEndX()) && ((this.mouseY >= this.m_y * 1) && (this.mouseY <= this.m_roadmapCalculation.m_updatedHeightForCanvas * 1))) {
			for (var i = 0; i < this.m_startProjectDate.length; i++) {

				for (var j = 0; j < this.m_startProjectDate[i].length; j++) {
					for (var k = 0; k < this.m_startProjectDate[i][j].length; k++) {
						if (this.mouseX <= ((this.m_xPositionArrayForSeriesData[i][j][k] * 1) + (this.m_widthForSeriesData[i][j][k] * 1)) && (this.mouseX >= this.m_xPositionArrayForSeriesData[i][j][k] * 1) && this.mouseY <= ((this.m_yPositionArrayForSeriesData[i][j][k] * 1) + (this.m_heightForSeriesData[i][j][k] * 1)) && (this.mouseY >= this.m_yPositionArrayForSeriesData[i][j][k] * 1)) {
							data[0] = "Group: " + this.categoryValue[i];
							data[1] = "SubGroup: " + this.m_arrangeSubCatData[i][j];
							data[2] = this.m_projectName[i][j][k];
							data[3] = "Start: " + this.m_startProjectDate[i][j][k];
							data[4] = "End: " + this.m_enddProjectDate[i][j][k];
							data[5] = "ProjectID: " + this.m_projectId[i][j][k];
							break;
						}
						if (this.mouseX <= ((this.m_xPositionArrayForCategoryData[i] * 1) + (this.m_groupWidthForCategoryData[i] * 1)) && (this.mouseX >= this.m_xPositionArrayForCategoryData[i] * 1) && this.mouseY <= ((this.m_yPositionArrayForCategoryData[i] * 1) + (this.m_heightForCategoryData[i] * 1)) && (this.mouseY >= this.m_yPositionArrayForCategoryData[i] * 1)) {
							data[0] = this.categoryValue[i];
						}
						//tool - tip for subcategory data
						if (this.mouseX <= ((this.m_xPositionArrayForSubCategoryData[i][j] * 1) + (this.m_groupWidthForSubCategoryData[i][j] * 1)) && (this.mouseX >= this.m_xPositionArrayForSubCategoryData[i][j] * 1) && this.mouseY <= ((this.m_yPositionArrayForSubCategoryData[i][j] * 1) + (this.m_heightForSubCategoryData[i][j] * 1)) && (this.mouseY >= this.m_yPositionArrayForSubCategoryData[i][j] * 1)) {
							data[0] = this.m_arrangeSubCatData[i][j];
						}
					}
				}
			}
		} else {
			this.hideToolTip();
		}
	}
	return data;
};
RoadMapChart.prototype.drawTooltip = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && !this.m_designMode) {
		var toolTipData = this.getToolTipData(mouseX, mouseY);
		if(this.m_hovercallback && this.m_hovercallback != ""){
			this.drawCallBackContent(mouseX,mouseY,toolTipData);
		}
		else{
			this.drawTooltipContent(toolTipData);
		}
	}
};

RoadMapChart.prototype.drawTooltipContent=function(toolTipData){
	if ((toolTipData != null) && toolTipData.length > 0 && (IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None"))) {
		var tooltipContent = "<table class=\" chart-tooltip bdtooltip\">";
		for (var i = 0; i < toolTipData.length; i++) {
			tooltipContent += "<tr>";
			tooltipContent += "<td align=\"left\">" + toolTipData[i] + "</td>";
			tooltipContent += "</tr>";
		}
		tooltipContent += "</table>";
		this.getToolTip(tooltipContent);
	} else {
		this.hideToolTip();
	}
};

RoadMapChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries)) {
		if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && ((mouseY >= this.m_y * 1) && (mouseY <= this.m_roadmapCalculation.m_updatedHeightForCanvas * 1))) {
			for (var i = 0; i < this.m_startProjectDate.length; i++) {
				for (var j = 0; j < this.m_startProjectDate[i].length; j++) {
					for (var k = 0; k < this.m_startProjectDate[i][j].length; k++) {
						if (mouseX <= ((this.m_xPositionArrayForSeriesData[i][j][k] * 1) + (this.m_widthForSeriesData[i][j][k] * 1)) && (mouseX >= this.m_xPositionArrayForSeriesData[i][j][k] * 1) && mouseY <= ((this.m_yPositionArrayForSeriesData[i][j][k] * 1) + (this.m_heightForSeriesData[i][j][k] * 1)) && (mouseY >= this.m_yPositionArrayForSeriesData[i][j][k] * 1)) {
							var m_fieldNameValueMap = new Object();
							for (var l = 0; l < this.getAllFieldsName().length; l++) {
								if (this.m_fieldsType[l] == "Category")
									m_fieldNameValueMap[this.getAllFieldsName()[l]] = this.categoryValue[i];
								if (this.m_fieldsType[l] == "SubCategory")
									m_fieldNameValueMap[this.getAllFieldsName()[l]] = this.m_arrangeSubCatData[i][j];
								if (this.m_fieldsType[l] == "Series")
									m_fieldNameValueMap[this.getAllFieldsName()[l]] = this.m_projectName[i][j][k];
								if (this.m_fieldsType[l] == "startvalue")
									m_fieldNameValueMap[this.getAllFieldsName()[l]] = this.m_startProjectDate[i][j][k];
								if (this.m_fieldsType[l] == "endvalue")
									m_fieldNameValueMap[this.getAllFieldsName()[l]] = this.m_enddProjectDate[i][j][k];
								if (this.m_fieldsType[l] == "none")
									m_fieldNameValueMap[this.getAllFieldsName()[l]] = this.m_projectId[i][j][k];
							}
							var drillColor = "";
							return { "drillRecord":fieldNameValueMap, "drillColor":drillColor };
						}
					}
				}
			}
		}
	}
};

//=========================================================roadmap calcualtion ===========================

function RoadmapCalculation() {
	this.m_chart = '';
	this.m_max = 0;

	this.m_startX;
	this.m_startY;
	this.m_endX;
	this.m_endY;

	this.m_chartXMargin = 35;
	this.m_chartTitleMargin = 0;
	this.m_chartSubTitleMargin = 0;
	this.m_util = new Util();
	this.m_xPositionForCategoryData = [];
	this.m_yPositionForCategoryData = [];
	this.m_widthForCateogryData = [];
	this.m_subCateogryLengthArray = [];

	this.m_xPositionForSubCategoryData = [];
	this.m_yPositionForSubCategoryData = [];
	this.m_heightForSubCategoryData = [];
	this.m_widthForSubCategoryData = [];
	this.m_colorForSubCategoryData = [];

	this.m_xPositionForSeries = [];
	this.m_yPositionForSeries = [];
	this.m_widthForSeries = [];
	this.m_heightForSeries = [];
	this.m_startProgressingFlag = [];
	this.m_endProgressingFlag = [];
	this.m_outOfChartSeriesDataFlag = [];
	this.m_colorsForSeriesData = [];

	this.m_xPosForYearSubtitle = [];
	this.m_yPosForYearSubtitle = [];
	this.m_heightForDateYearSubtitle = [];
	this.m_widthForDateYearSubtitle = [];
	this.m_colorsForSubtitle = [];
	this.m_numberOfMonthArray = [];
	this.m_subtitleTextArray = [];

	this.m_leftSideWidth = 2;
	this.m_rightSideWidth = 2;

	this.m_TopMargin = 5;
	this.ctx = "";

	this.m_scrollBarWidth = 4;
	this.m_scrollBarHeight = 2;
	this.m_updatedHeightForCanvas = "";
	this.m_leftSideSpaceForChart = 5;
};

RoadmapCalculation.prototype.init = function (categorydata, seriesdata, startDate, endDate, chart) {
	this.m_chart = chart;
	this.ctx = this.m_chart.ctx;
	this.m_categorydata = categorydata;
	this.xAxisData = seriesdata;
	this.m_startDateArray = startDate;
	this.m_endDateArray = endDate;

	this.m_x = this.m_chart.m_x;
	this.m_y = this.m_chart.m_y;
	this.m_width = this.m_chart.m_width;
	this.m_height = this.m_chart.m_height;
	this.startX = this.m_chart.getStartX();
	this.startY = this.m_chart.getStartY();
	this.endX = this.m_chart.getEndX();
	this.endY = this.m_chart.getEndY();
	this.setTextForSubtitle();
	this.setwidthForYearSubtitle();
	this.setXPositionForYearSubtitle();
	this.setYPositionForYearSubtitle();
	this.setheightForYearSubtitle();
	this.setColorForYearSubtitle();

	this.setMaxValue();

	this.m_subCategoryDataArray = this.m_chart.m_subCatNameArray;
	this.setXPositionArrayForCategoryData();
	this.setHieghtForCategoryData();
	this.setYPositionArrayForCategoryData();
	this.setWidthForCategoryData();

	this.setXPositionArrayForSubCategoryData();
	this.setHeightForSubCategoryData();
	this.setYPositionArrayForSubCategoryData();
	this.setWidthForSubCategoryData();
	this.setColorsForSubCategoryData();

	this.setXPositionArrayForSeriesData();
	this.setYPositionArrayForSeriesData();
	this.setWidthArrayForSeriesData();
	this.setHeightArrayForSeriesData();
	this.setColorsForSeriesData();
};

RoadmapCalculation.prototype.setXPositionForYearSubtitle = function () {
	this.m_xPosForYearSubtitle = [];
	for (var i = 0; i < this.m_subtitleTextArray.length; i++) {
		if (i == 0) {
			this.m_xPosForYearSubtitle[i] = this.m_x * 1 + this.m_chart.m_groupwidth * 1 + this.m_chart.m_subgroupwidth * 1;
		} else {
			this.m_xPosForYearSubtitle[i] = this.m_xPosForYearSubtitle[i - 1] * 1 + this.m_widthForDateYearSubtitle[i - 1] + this.m_leftSideWidth * 1;
		}
	}
};

RoadmapCalculation.prototype.getYPositionForYearSubtitle = function () {
	return this.m_yPosForYearSubtitle;
};
RoadmapCalculation.prototype.setYPositionForYearSubtitle = function () {
	this.m_yPosForYearSubtitle = [];
	for (var i = 0; i < this.m_subtitleTextArray.length; i++) {
		this.m_yPosForYearSubtitle[i] = this.endY * 1 - this.m_chart.m_categoryMarkingMargin * 1 - this.m_TopMargin * 1;
	}
};

RoadmapCalculation.prototype.getheightForYearSubtitle = function () {
	return this.m_heightForDateYearSubtitle;
};

RoadmapCalculation.prototype.getwidthForYearSubtitle = function () {
	return this.m_widthForDateYearSubtitle;
};

RoadmapCalculation.prototype.setwidthForYearSubtitle = function () {
	this.m_widthForDateYearSubtitle = [];
	var cal_month = this.m_numberOfMonthArray.length;
	var width = this.getDrawWidthForSubTitle();
	width = width / cal_month * 1;
	for (var i = 0; i < this.m_subtitleTextArray.length; i++) {
		this.m_widthForDateYearSubtitle[i] = this.m_numberOfMonthInQuarterArray[i] * width - this.m_rightSideWidth * 1;
	}
};

RoadmapCalculation.prototype.getTextForSubtitle = function () {
	return this.m_subtitleTextArray;
};

RoadmapCalculation.prototype.setTextForSubtitle = function () {
	this.m_subtitleTextArray = [];
	this.m_numberOfMonthArray = [];
	this.m_numberOfMonthInQuarterArray = [];
	if (IsBoolean(this.m_chart.m_showcurrentyeartimeline)) {
		var currentTime = new Date();
		var year = currentTime.getFullYear();
		for (var i = 1; i <= 12; i++) {
			this.m_numberOfMonthArray.push(this.setTextForEveryMonth(i, year));
		}
	} else {
		var startDate = new Date((this.m_chart.m_startdate).replace(/\-/g, "/"));
		var endDate = new Date((this.m_chart.m_enddate).replace(/\-/g, "/"));

		if (startDate < endDate) {
			var year = startDate.getFullYear();
			var month = startDate.getMonth();
			var endDate = new Date((this.m_chart.m_enddate).replace(/\-/g, "/"));
			var endyear = endDate.getFullYear();
			var endmonth = endDate.getMonth();
			var temp = month + 1;
			var monthlimit = 12;
			for (var y = year; y <= endyear; y++) {
				if (y == endyear)
					monthlimit = endmonth + 1;
				for (var k = temp; k <= monthlimit; k++) {
					this.m_numberOfMonthArray.push(this.setTextForEveryMonth(k, y));
				}
				temp = 1;
			}
			//console.log(this.m_numberOfMonthArray);
		} else {
			var date = new Date(),
			y = date.getFullYear(),
			m = date.getMonth();
			this.m_chart.m_startdate = "01-01-" + y;
			this.m_chart.m_enddate = "12-31-" + y;
			for (var i = 1; i <= 12; i++) {
				this.m_numberOfMonthArray.push(this.setTextForEveryMonth(i, y));
			}
		}
	}
	this.setUniqueTitleTextAccordingQuarters();
	this.setNumberOfMonthInQuarterArray();
};

RoadmapCalculation.prototype.getTextForSubtitle = function () {
	return this.m_subtitleTextArray;
};

RoadmapCalculation.prototype.setTextForEveryMonth = function (month, year) {
	if (month <= 3)
		return "Q1-" + year;
	else if (month <= 6)
		return "Q2-" + year;
	else if (month <= 9)
		return "Q3-" + year;
	else
		return "Q4-" + year;
};

RoadmapCalculation.prototype.setUniqueTitleTextAccordingQuarters = function () {
	for (var count = 0; count < this.m_numberOfMonthArray.length; count++) {
		if (count == 0) {
			this.m_subtitleTextArray.push(this.m_numberOfMonthArray[count]);
		} else if (this.m_numberOfMonthArray[count] != this.m_numberOfMonthArray[count - 1]) {
			this.m_subtitleTextArray.push(this.m_numberOfMonthArray[count]);
		}
	}
};
RoadmapCalculation.prototype.setNumberOfMonthInQuarterArray = function () {
	for (var j = 0; j < this.m_subtitleTextArray.length; j++) {
		var counter = 0;
		for (var i = 0; i < this.m_numberOfMonthArray.length; i++) {
			if (this.m_subtitleTextArray[j] == this.m_numberOfMonthArray[i])
				counter++;
		}
		this.m_numberOfMonthInQuarterArray[j] = counter;
	}
};

RoadmapCalculation.prototype.setXPositionForYearSubtitle = function () {
	this.m_xPosForYearSubtitle = [];
	for (var i = 0; i < this.m_subtitleTextArray.length; i++) {
		if (i == 0) {
			this.m_xPosForYearSubtitle[i] = this.m_x * 1 + this.m_chart.m_groupwidth * 1 + this.m_chart.m_subgroupwidth * 1; // - this.m_scrollBarWidth *1;
		} else {
			this.m_xPosForYearSubtitle[i] = this.m_xPosForYearSubtitle[i - 1] * 1 + this.m_widthForDateYearSubtitle[i - 1];
		}
	}
};

RoadmapCalculation.prototype.getXPositionForYearSubtitle = function () {
	return this.m_xPosForYearSubtitle;
};

RoadmapCalculation.prototype.setheightForYearSubtitle = function () {
	this.m_heightForDateYearSubtitle = [];
	for (var i = 0; i < this.m_subtitleTextArray.length; i++) {
		this.m_heightForDateYearSubtitle[i] = 30 * 1;
	}
};

RoadmapCalculation.prototype.getMaximumSeriesValue = function () {
	var maxSeriesVal = 0;
	for (var i = 0; i < this.m_chart.m_seriesData.length; i++) {
		for (var j = 0; j < this.m_chart.m_seriesData[i].length; j++) {
			var data = this.m_seriesData[i][j];
			data = (isNaN(data) || data == undefined || data == "") ? 0 : data;
			if (i == 0 && j == 0) {
				maxSeriesVal = data;
			}
			if (maxSeriesVal * 1 <= data * 1) {
				maxSeriesVal = data;
			}
		}
	}
	return maxSeriesVal;
};

/*RoadmapCalculation.prototype.getheightForYearSubtitle=function(){
return this.m_heightForDateYearSubtitle;
};
 */
RoadmapCalculation.prototype.setColorForYearSubtitle = function () {
	/*this.m_colorsForSubtitle=[];
	var color = convertColorToHex(this.m_chart.m_timelinecolor);
	for(var i=0 ; i<this.m_subtitleTextArray.length ; i++){
	this.m_colorsForSubtitle[i]="#ccc";
	}*/
	this.m_colorsForSubtitle = "#ccc";
};

RoadmapCalculation.prototype.getColorForSubtitle = function () {
	return this.m_colorsForSubtitle;
};

RoadmapCalculation.prototype.setwidthForYearSubtitle = function () {
	this.m_widthForDateYearSubtitle = [];
	var perMonthWidth = this.getDrawWidthForSubTitle() / this.m_numberOfMonthArray.length;
	for (var i = 0; i < this.m_subtitleTextArray.length; i++) {
		this.m_widthForDateYearSubtitle[i] = this.m_numberOfMonthInQuarterArray[i] * perMonthWidth - this.m_scrollBarWidth;
	}
};

RoadmapCalculation.prototype.getwidthForYearSubtitle = function () {
	return this.m_widthForDateYearSubtitle;
};

RoadmapCalculation.prototype.getXPositionArrayForSeriesData = function () {
	return this.m_xPositionForSeries;
};

RoadmapCalculation.prototype.setXPositionArrayForSeriesData = function () {
	this.m_xPositionForSeries = [];
	this.m_startProgressingFlag = [];
	this.m_outOfChartSeriesDataFlag = [];
	for (var i = 0; i < this.m_startDateArray.length; i++) {
		this.m_xPositionForSeries[i] = [];
		this.m_startProgressingFlag[i] = [];
		this.m_outOfChartSeriesDataFlag[i] = [];
		for (var j = 0; j < this.m_startDateArray[i].length; j++) {
			this.m_xPositionForSeries[i][j] = [];
			this.m_startProgressingFlag[i][j] = [];
			this.m_outOfChartSeriesDataFlag[i][j] = [];
			for (var k = 0; k < this.m_startDateArray[i][j].length; k++) {
				var xPosStartProgressFlagArray = this.getXPosition(this.m_startDateArray[i][j][k], this.m_endDateArray[i][j][k]);
				this.m_xPositionForSeries[i][j].push(xPosStartProgressFlagArray[0]);
				this.m_startProgressingFlag[i][j].push(xPosStartProgressFlagArray[1]);
				this.m_outOfChartSeriesDataFlag[i][j].push(xPosStartProgressFlagArray[2]);
			}
		}
	}

};

RoadmapCalculation.prototype.getYPositionArrayForSeriesData = function () {
	return this.m_yPositionForSeriesData;
};

RoadmapCalculation.prototype.setYPositionArrayForSeriesData = function () {
	this.m_yPositionForSeriesData = [];

	var yPos = this.m_y * 1 + this.m_scrollBarHeight; ;
	var counter = 0;
	for (var i = 0; i < this.m_startDateArray.length; i++) {
		this.m_yPositionForSeriesData[i] = [];
		for (var j = 0; j < this.m_startDateArray[i].length; j++) {
			this.m_yPositionForSeriesData[i][j] = [];
			for (var k = 0; k < this.m_startDateArray[i][j].length; k++) {
				var yPosition = yPos * 1 + counter * this.m_heightForSubCategoryData[i][j] + this.m_topBottomMargin * (2 * counter + 1);
				this.m_yPositionForSeriesData[i][j].push(yPosition);
			}
			counter++;
		}
	}
};

RoadmapCalculation.prototype.setWidthArrayForSeriesData = function () {
	this.m_widthForSeries = [];
	this.m_endProgressingFlag = [];
	for (var i = 0; i < this.m_startDateArray.length; i++) {
		this.m_widthForSeries[i] = [];
		this.m_endProgressingFlag[i] = [];
		for (var j = 0; j < this.m_startDateArray[i].length; j++) {
			this.m_widthForSeries[i][j] = [];
			this.m_endProgressingFlag[i][j] = [];
			for (var k = 0; k < this.m_startDateArray[i][j].length; k++) {
				var widthEndProgressFlagArray = this.getWidth(this.m_startDateArray[i][j][k], this.m_endDateArray[i][j][k]);
				this.m_widthForSeries[i][j].push(widthEndProgressFlagArray[0]);
				this.m_endProgressingFlag[i][j].push(widthEndProgressFlagArray[1]);
			}
		}
	}
};

RoadmapCalculation.prototype.getWidthArrayForSeriesData = function () {
	return this.m_widthForSeries;
};

RoadmapCalculation.prototype.getHeightArrayForSeriesData = function () {
	return this.m_heightForSeries;
};

RoadmapCalculation.prototype.setHeightArrayForSeriesData = function () {
	this.m_heightForSeries = [];
	for (var i = 0; i < this.m_startDateArray.length; i++) {
		this.m_heightForSeries[i] = [];
		for (var j = 0; j < this.m_startDateArray[i].length; j++) {
			this.m_heightForSeries[i][j] = [];
			for (var k = 0; k < this.m_startDateArray[i][j].length; k++) {
				var height = this.m_heightForSubCategoryData[i][j] * 1;
				this.m_heightForSeries[i][j].push(height);
			}
		}
	}
};

RoadmapCalculation.prototype.getColorsForSeriesData = function () {
	return this.m_colorsForSeriesData;
};

RoadmapCalculation.prototype.setColorsForSeriesData = function () {
	this.m_colorsForSeriesData = [];
	var color;

	for (var i = 0; i < this.m_startDateArray.length; i++) {
		this.m_colorsForSeriesData[i] = [];
		for (var j = 0; j < this.m_startDateArray[i].length; j++) {
			this.m_colorsForSeriesData[i][j] = [];
			for (var k = 0; k < this.m_startDateArray[i][j].length; k++) {
				color = this.m_chart.m_colorArray[i];
				this.m_colorsForSeriesData[i][j].push(color);
			}
		}
	}
};

RoadmapCalculation.prototype.getXPosition = function (projectStartDate, projectEndDate) {
	var startProjectDate = this.getDateFromDateString(projectStartDate);
	var endProejctDate = this.getDateFromDateString(projectEndDate);
	var startDate = this.getDateFromDateString(this.m_chart.m_startdate);
	var endDate = this.getDateFromDateString(this.m_chart.m_enddate);
	var dateDifference = this.getDifferenceFromDateString(this.m_chart.m_startdate, projectStartDate);
	var xPositionAndFlagArray = [];

	if ((startProjectDate >= startDate) && (endDate >= startDate)) {
		if (startProjectDate <= endDate) {
			//project starts in between start date and end date
			xPositionAndFlagArray[0] = this.m_leftSideWidth * 1 + this.getStartXPosition() * 1 + dateDifference * this.getRatio() - this.m_leftSideSpaceForChart * 1 - 1;
			xPositionAndFlagArray[1] = false;
			xPositionAndFlagArray[2] = false;
		} else {
			//project starts after end date
			xPositionAndFlagArray[0] = this.m_rightSideWidth * 0 + this.m_leftSideWidth * 0 + this.getStartXPosition() * 0 + (0) * this.getRatio() - this.m_leftSideSpaceForChart * 0;
			xPositionAndFlagArray[1] = false;
			xPositionAndFlagArray[2] = true;
		}
	} else if (startProjectDate < startDate) {
		//project start before start date
		if (endProejctDate > startDate) {
			xPositionAndFlagArray[0] = this.m_rightSideWidth * 1 + this.m_leftSideWidth * 1 + this.getStartXPosition() * 1 + (0) * this.getRatio() - this.m_leftSideSpaceForChart * 1;
			xPositionAndFlagArray[1] = true;
			xPositionAndFlagArray[2] = false;
		} else {
			xPositionAndFlagArray[0] = this.m_rightSideWidth * 1 + this.m_leftSideWidth * 1 + this.getStartXPosition() * 1 + (0) * this.getRatio() - this.m_leftSideSpaceForChart * 1;
			xPositionAndFlagArray[1] = true;
			xPositionAndFlagArray[2] = true;
		}

	}

	return xPositionAndFlagArray;
};

RoadmapCalculation.prototype.getStartXPosition = function () {
	var startXPosition = this.startX * 1 + this.m_chart.m_groupwidth * 1 + this.m_chart.m_subgroupwidth * 1;
	return startXPosition;
};

RoadmapCalculation.prototype.getDateFromDateString = function (date) {
	var str = date.replace(/\-/g, "/");
	return new Date(str);
};

RoadmapCalculation.prototype.getDifferenceFromDateString = function (dateOne, dateTwo) {
	var str1 = dateOne.replace(/\-/g, "/");
	var firstDate = new XDate(str1);
	var str2 = dateTwo.replace(/\-/g, "/");
	var secondDate = new XDate(str2);
	var difference = firstDate.diffDays(secondDate);
	return difference;
};

RoadmapCalculation.prototype.getWidth = function (projectStartDate, projectEndDate) {
	var startProjectDate = this.getDateFromDateString(projectStartDate);
	var endProjectDate = this.getDateFromDateString(projectEndDate);
	var startDate = this.getDateFromDateString(this.m_chart.m_startdate);
	var endDate = this.getDateFromDateString(this.m_chart.m_enddate);
	var dateDifferenceForWidth = this.getDifferenceFromDateString(projectStartDate, projectEndDate);
	var dateDifferenceBetweenSDAndPSD = this.getDifferenceFromDateString(projectStartDate, this.m_chart.m_startdate);
	var dateDifferenceBetweenPEDAndED = this.getDifferenceFromDateString(this.m_chart.m_enddate, projectEndDate);
	var widthAndFlagArray = [];
	var lineWidth = 2;
	if (dateDifferenceForWidth < 0) {
		widthAndFlagArray[0] = (0) * this.getRatio();
		widthAndFlagArray[1] = false;
	} else {
		if (endProjectDate <= endDate) {
			if (startProjectDate < startDate) {
				if (endProjectDate < startDate) {
					widthAndFlagArray[0] = (0) * this.getRatio();
					widthAndFlagArray[1] = false;
				} else {
					widthAndFlagArray[0] = (dateDifferenceForWidth - dateDifferenceBetweenSDAndPSD) * this.getRatio() - lineWidth * 1;
					widthAndFlagArray[1] = false;
				}
			} else {
				widthAndFlagArray[0] = (dateDifferenceForWidth) * this.getRatio() - lineWidth * 1;
				widthAndFlagArray[1] = false;

			}
		} else if (endProjectDate > endDate) {

			if (startProjectDate < startDate) {
				widthAndFlagArray[0] = (dateDifferenceForWidth - dateDifferenceBetweenSDAndPSD - dateDifferenceBetweenPEDAndED) * this.getRatio() - lineWidth * 1;
				widthAndFlagArray[1] = true;
			} else if ((startProjectDate > startDate) && (startProjectDate >= endDate)) {
				widthAndFlagArray[0] = (0) * this.getRatio();
				widthAndFlagArray[1] = false;
			} else {

				widthAndFlagArray[0] = (dateDifferenceForWidth - dateDifferenceBetweenPEDAndED) * this.getRatio() - lineWidth * 1;
				widthAndFlagArray[1] = true;
			}
		}
	}
	return widthAndFlagArray;
};

//***********************this is calculation for drwaing a rectangle for CategoryData********************//

RoadmapCalculation.prototype.getXPositionArrayForCategoryData = function () {
	return this.m_xPositionForCategoryData;
};

RoadmapCalculation.prototype.getYPositionArrayForCategoryData = function () {
	return this.m_yPositionForCategoryData;
};

RoadmapCalculation.prototype.getWidthForCategoryData = function () {
	return this.m_widthForCateogryData;
};

RoadmapCalculation.prototype.getHieghtForCategoryData = function () {
	return this.m_subCateogryLengthArray;
};

RoadmapCalculation.prototype.setXPositionArrayForCategoryData = function () {
	this.m_xPositionForCategoryData = [];
	for (var i = 0; i < this.m_categorydata.length; i++) {
		this.m_xPositionForCategoryData[i] = this.m_chart.getStartX();
	}
};

RoadmapCalculation.prototype.setYPositionArrayForCategoryData = function () {
	this.m_yPositionForCategoryData = [];
	var endY = this.m_y * 1 + this.m_scrollBarHeight * 1;

	var catLengthArrayt = this.getHieghtForCategoryData();
	for (var i = 0; i < this.m_categorydata.length; i++) {
		if (i == 0)
			this.m_yPositionForCategoryData[i] = endY + this.m_scrollBarHeight * 1;
		else {
			this.m_yPositionForCategoryData[i] = this.m_yPositionForCategoryData[i - 1] * 1 + catLengthArrayt[i - 1] * 1;
		}
	}
};

RoadmapCalculation.prototype.setWidthForCategoryData = function () {
	this.m_widthForCateogryData = [];

	for (var i = 0; i < this.m_categorydata.length; i++) {
		this.m_widthForCateogryData[i] = this.m_chart.m_groupwidth * 1 - this.m_leftSideWidth * 1;
	}
};

RoadmapCalculation.prototype.setHieghtForCategoryData = function () {
	var subCateogryTotalHeight = 0;
	var height = this.getCalculatePercentageHeight();
	this.m_cateogryHeightArray = [];
	for (var i = 0; i < height.length; i++) {
		this.m_subCateogryLengthArray[i] = height[i];

		subCateogryTotalHeight = subCateogryTotalHeight * 1 + this.m_subCateogryLengthArray[i] * 1; // storing total category height.
	}
	// Increasing the "draggableCanvasForRoadMapSeries" heigth if "subCateogryTotalHeight" is greater than draggableCanvasForRoadMapSeries's original height.
	var draggableCanvasForRoadMapSeriesHeight = this.m_chart.m_height - (this.m_chart.m_subTitle.m_subTitleBarHeight * 1 + this.m_chart.m_title.m_titleBarHeight * 1 + this.m_chart.m_heightForYearSubtitle * 1);
	if (subCateogryTotalHeight > draggableCanvasForRoadMapSeriesHeight) {
		var temp = this;
		//	document.getElementById("draggableDivForRoadMapSeries1"+temp.m_chart.m_objectid).height =  subCateogryTotalHeight + 10;
		document.getElementById("draggableCanvasForRoadMapSeries" + temp.m_chart.m_objectid).height = subCateogryTotalHeight + 10;
		this.m_updatedHeightForCanvas = subCateogryTotalHeight + 10;

	} else {
		var temp = this;
		//		document.getElementById("draggableDivForRoadMapSeries1"+temp.m_chart.m_objectid).height =  subCateogryTotalHeight + 10;
		document.getElementById("draggableCanvasForRoadMapSeries" + temp.m_chart.m_objectid).height = subCateogryTotalHeight + 10;
		this.m_updatedHeightForCanvas = subCateogryTotalHeight + 10;
	}
};
//*************this calculation for subcateogry rectangle*****************
RoadmapCalculation.prototype.getXPositionArrayForSubCategoryData = function () {
	return this.m_xPositionForSubCategoryData;
};

RoadmapCalculation.prototype.setXPositionArrayForSubCategoryData = function () {
	this.m_xPositionForSubCategoryData = [];
	var x;
	for (var i = 0; i < this.m_subCategoryDataArray.length; i++) {
		this.m_xPositionForSubCategoryData[i] = [];
		for (var j = 0; j < this.m_subCategoryDataArray[i].length; j++) {
			x = this.m_chart.getStartX();
			this.m_xPositionForSubCategoryData[i][j] = x * 1 + this.m_chart.m_groupwidth * 1 + this.m_leftSideWidth * 1;
		}
	}
};

RoadmapCalculation.prototype.getYPositionArrayForSubCategoryData = function () {
	return this.m_yPositionForSubCategoryData;
};

RoadmapCalculation.prototype.setYPositionArrayForSubCategoryData = function () {
	this.m_yPositionForSubCategoryData = [];
	var yPos = this.m_y * 1 + this.m_scrollBarHeight * 1;
	var counter = 0;
	for (var i = 0; i < this.m_subCategoryDataArray.length; i++) {
		this.m_yPositionForSubCategoryData[i] = [];
		for (var j = 0; j < this.m_subCategoryDataArray[i].length; j++) {
			var yPosition = yPos * 1 + counter * this.m_heightForSubCategoryData[i][j] + this.m_topBottomMargin * (2 * counter + 1);
			this.m_yPositionForSubCategoryData[i].push(yPosition);
			counter++;
		}
	}
};

RoadmapCalculation.prototype.getHeightForSubCategoryData = function () {
	return this.m_heightForSubCategoryData;
};

RoadmapCalculation.prototype.setHeightForSubCategoryData = function () {
	this.m_heightForSubCategoryData = [];
	var calculatedHeight = this.getCalculatHeightForSubCategory();
	for (var i = 0; i < this.m_subCategoryDataArray.length; i++) {
		this.m_heightForSubCategoryData[i] = [];
		for (var j = 0; j < this.m_subCategoryDataArray[i].length; j++) {
			this.m_heightForSubCategoryData[i][j] = calculatedHeight[i];
		}
	}
};

RoadmapCalculation.prototype.getCalculatHeightForSubCategory = function (length) {
	var HeightForCat = this.getHieghtForCategoryData();
	var calculatPercentageHeightForSubCategory = [];
	this.m_topBottomMargin;
	for (var i = 0; i < this.m_subCategoryDataArray.length; i++) {
		var temp = (HeightForCat[i]) / this.m_subCategoryDataArray[i].length;
		var height = temp;
		if (temp * 1 > this.m_chart.m_roadmapitemheight * 1) {
			height = this.m_chart.m_roadmapitemheight * 1;
			var sub = temp * 1 - this.m_chart.m_roadmapitemheight * 1;
			this.m_topBottomMargin = sub * 1 / 2;
		} else {
			height = temp * 3 / 5;
			this.m_topBottomMargin = temp * 1 / 5;
		}
		calculatPercentageHeightForSubCategory[i] = this.m_chart.m_roadmapitemheight * 1;
	}
	return calculatPercentageHeightForSubCategory;
};

RoadmapCalculation.prototype.getWidthForSubCategoryData = function () {
	return this.m_widthForSubCategoryData;
};

RoadmapCalculation.prototype.setWidthForSubCategoryData = function () {
	this.m_widthForSubCategoryData = [];
	var subGroupWidth = this.m_chart.m_subgroupwidth * 1 - this.m_leftSideWidth * 1 - this.m_rightSideWidth * 1;
	for (var i = 0; i < this.m_subCategoryDataArray.length; i++) {
		this.m_widthForSubCategoryData[i] = [];
		for (var j = 0; j < this.m_subCategoryDataArray[i].length; j++) {
			this.m_widthForSubCategoryData[i][j] = subGroupWidth * 1 - this.m_leftSideSpaceForChart * 1 - this.m_rightSideWidth * 1;
		}
	}
};

RoadmapCalculation.prototype.getColorsForSubCategoryData = function () {
	return this.m_colorForSubCategoryData;
};

RoadmapCalculation.prototype.setColorsForSubCategoryData = function () {
	this.m_colorForSubCategoryData = [];
	for (var i = 0; i < this.m_subCategoryDataArray.length; i++) {
		this.m_colorForSubCategoryData[i] = [];
		for (var j = 0; j < this.m_subCategoryDataArray[i].length; j++) {
			this.m_colorForSubCategoryData[i][j] = this.m_chart.m_colorArray[i];
		}
	}
};

RoadmapCalculation.prototype.getDrawHeight = function () {
	this.drawHeight = (this.startY - this.endY);
	return this.drawHeight;
};

RoadmapCalculation.prototype.getDrawWidth = function () {
	var newStartX = this.startX * 1 + this.m_chart.m_subgroupwidth * 1 + this.m_chart.m_groupwidth * 1;
	this.drawWidth = (this.endX * 1) - (newStartX * 1) - this.m_scrollBarWidth * 2 - this.m_rightSideWidth * 2 - 1;
	return this.drawWidth;
};

RoadmapCalculation.prototype.getDrawWidthForSubTitle = function () {
	var newStartXForTitle = this.startX * 1 + this.m_chart.m_subgroupwidth * 1 + this.m_chart.m_groupwidth * 1;
	this.drawWidth = (this.endX * 1) - (newStartXForTitle * 1) + this.m_scrollBarWidth * 1;
	return this.drawWidth;
};

RoadmapCalculation.prototype.getRatio = function () {
	this.getDrawHeight();
	this.ratio = this.getDrawWidth() / (this.getMaxValue());
	return this.ratio;
};

RoadmapCalculation.prototype.getMaxValue = function () {
	return this.m_max;
};

RoadmapCalculation.prototype.getCalculatePercentageHeight = function () {
	var lengthOfSubCat = [];
	var percentageArray = [];
	var topAndBottomHieght = 4;
	//var totalLengthOfSubcat = this.m_chart.getLenghtOfSubcategory();
	for (var i = 0; i < this.m_subCategoryDataArray.length; i++) {
		lengthOfSubCat[i] = this.m_subCategoryDataArray[i].length;
		//percentageArray[i] = (lengthOfSubCat[i]/totalLengthOfSubcat)*100;
		percentageArray[i] = lengthOfSubCat[i] * this.m_chart.m_roadmapitemheight * 1 + topAndBottomHieght * lengthOfSubCat[i];
		//percentageArray[i] = 35+6;	// bar height + gap
	}

	return percentageArray;
};
//**************************set a max value by using year ..******************//

RoadmapCalculation.prototype.setMaxValue = function () {
	if (IsBoolean(this.m_chart.m_showcurrentyeartimeline)) {
		this.m_max = 365 * 1;
	} else {
		this.m_max = this.getDifferenceFromDateString(this.m_chart.m_startdate, this.m_chart.m_enddate);
	}
};

//======================RoadMap Series start ==================================

function RoadMapSeries() {
	this.xPixel = [];
	this.yPixelArray = [];
	this.stackHeightArray = [];
	this.stackColorArray = [];
	this.roadMapStackArray = [];
	this.m_dataValue = [];
	this.m_startProejctFlag = [];
	this.m_endProejctFlag = [];
	this.m_outOfChartFlag = [];
	this.m_chart = [];
};

RoadMapSeries.prototype.init = function (xPixel, yPixelArray, stackWidth, stackHeightArray, stackColorArray, type, data, startProjectFlag, endProjectFlag, outOfChartFlag, chartref) {
	this.xPixel = xPixel;
	this.yPixelArray = yPixelArray;
	this.stackWidth = stackWidth;
	this.stackHeightArray = stackHeightArray;
	this.stackColorArray = stackColorArray;
	this.m_type = type;
	this.m_dataValue = data;
	this.m_startProejctFlag = startProjectFlag;
	this.m_endProejctFlag = endProjectFlag;
	this.m_outOfChartFlag = outOfChartFlag;
	this.m_chart = chartref;
	for (var i = 0; i < this.xPixel.length; i++) {
		this.roadMapStackArray[i] = new RoadMapStack();
		if (this.m_type == "Group" || this.m_type == "SubGroup" || this.m_type == "Quarter")
			this.roadMapStackArray[i].init(this.xPixel[i], this.yPixelArray[i], this.stackWidth[i], this.stackHeightArray[i], this.stackColorArray[i], this.m_dataValue[i], this.m_type, false, false, false, this.m_chart);
		else
			this.roadMapStackArray[i].init(this.xPixel[i], this.yPixelArray[i], this.stackWidth[i], this.stackHeightArray[i], this.stackColorArray[i], this.m_dataValue[i], this.m_type, this.m_startProejctFlag[i], this.m_endProejctFlag[i], this.m_outOfChartFlag[i], this.m_chart);
	}
};

RoadMapSeries.prototype.draw = function () {
	for (var i = 0; i < this.xPixel.length; i++) {
		if (this.m_type == "Group" || this.m_type == "SubGroup" || this.m_type == "Quarter")
			this.roadMapStackArray[i].drawStack();
		else
			this.roadMapStackArray[i].drawChevron();
	}

};
//===============Roadmap Series end ===========================

//=============RoadMap Line Series==================================

function RoadmapLineSeries() {
	this.m_xPixel;
	this.m_yPixel;
	this.m_lineColor;
	this.m_width;
	this.m_chart;
	this.ctx = "";
};

RoadmapLineSeries.prototype.init = function (lineXPixel, lineYPixel, Width, lineColor, chartref) {
	this.m_xPixel = lineXPixel;
	this.m_yPixel = lineYPixel;
	this.m_width = Width;
	this.m_lineColor = lineColor;
	this.m_chart = chartref;
	this.ctx = this.m_chart.ctxForRoadMapSeries;
};

RoadmapLineSeries.prototype.draw = function () {
	for (var i = 0; i < this.m_xPixel.length; i++) {
		this.drawLine(this.m_xPixel[i] * 1, this.m_yPixel[i] * 1);
		if (i == this.m_xPixel.length - 1) {
			this.drawLine((this.m_xPixel[i] * 1 + this.m_width[i] * 1), this.m_yPixel[i] * 1);
		}
	}
};

RoadmapLineSeries.prototype.drawLine = function (x, y) {
	var y = this.m_chart.m_roadmapCalculation.m_updatedHeightForCanvas * 1;
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.moveTo(x, this.m_chart.m_y * 1 - 2);
	this.ctx.lineTo(x, y);
	//this.ctx.lineTo(x,this.m_chart.m_height);
	this.ctx.lineWidth = '';
	this.ctx.strokeStyle = this.m_lineColor;
	this.ctx.stroke();
	this.ctx.restore();
	this.ctx.closePath();
};

//======================end==========================================


//====================RoadMap Stack start ================================
function RoadMapStack() {
	this.m_xPixel;
	this.m_yPixel;
	this.m_width;
	this.m_height;
	this.stackColor;
	this.m_projectText;
	this.m_startProjectFlag;
	this.m_endProejctFlag;
	this.m_outOfChartFlag;
	this.m_arrowWidth = 0;
	this.m_chart;
	this.ctx = "";
	this.m_chartLeftRightMargin = 10;
};

RoadMapStack.prototype.init = function (stackXPixel, stackYPixel, stackWidth, stackHeight, stackColor, data, type, startProjectFlag, endProjectFlag, outOfChartFlag, chartref) {
	this.m_xPixel = stackXPixel;
	this.m_yPixel = stackYPixel;
	this.m_width = stackWidth;
	this.m_height = stackHeight;
	this.stackColor = stackColor;
	this.m_projectText = data;
	this.m_type = type;
	this.m_startProjectFlag = startProjectFlag;
	this.m_endProejctFlag = endProjectFlag;
	this.m_outOfChartFlag = outOfChartFlag;
	this.m_chart = chartref;
	if (this.m_type == "Quarter")
		this.ctx = this.m_chart.ctx;
	else
		this.ctx = this.m_chart.ctxForRoadMapSeries;

	this.m_groupFontColor = convertColorToHex(this.m_chart.m_groupfontcolor);
	this.m_subGroupFontColor = convertColorToHex(this.m_chart.m_subgroupfontcolor);
	this.m_itemFontColor = convertColorToHex(this.m_chart.m_itemfontcolor);
	this.m_seriesFontColor = convertColorToHex(this.m_chart.m_itemfontcolor); //timelineFontColor
	this.m_timeLineFontColor = convertColorToHex(this.m_chart.m_timelinefontcolor);
	this.m_timeLineStrokeColor = this.m_chart.m_chartFrame.getBackgroundGradient();

};

RoadMapStack.prototype.createGradient = function () {
	//console.log(this.m_xPixel*1+"=="+this.m_yPixel+"=="+this.m_xPixel+"=="+this.m_yPixel*1+"=="+this.m_height/2)
	var grd = this.ctx.createLinearGradient(this.m_xPixel, this.m_yPixel, this.m_xPixel, this.m_yPixel * 1 + this.m_height / 2);
	var color0 = this.m_colorManager.hex2rgb(this.stackColor, 0.9);
	grd.addColorStop(0, this.stackColor);
	return grd;
};

RoadMapStack.prototype.drawStack = function () {
	if (this.m_type == "SubGroup") {
		this.strokeRectangle("#fff");
		this.drawText("#000000", this.m_chart.m_subgroupfontsize);
	} else if (this.m_type == "Group") {
		this.drawRectangle();
		this.drawText("#FFFFFF ", 12);
	} else {
		this.strokeRectangle(this.m_timeLineStrokeColor);
		this.drawText(this.m_timeLineFontColor, this.m_chart.m_timelinefontsize);
	}
};
RoadMapStack.prototype.strokeRectangle = function (styleColor) {
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.strokeStyle = this.stackColor;
	this.ctx.lineWidth = "2";
	this.ctx.rect(this.m_xPixel * 1, this.m_yPixel * 1, this.m_width * 1 - this.m_arrowWidth, this.m_height * 1);
	this.ctx.fillStyle = styleColor;
	this.ctx.stroke();
	this.ctx.fill();
	this.ctx.restore();
	this.ctx.closePath();
};
RoadMapStack.prototype.drawRectangle = function () {
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.fillStyle = this.stackColor;
	this.ctx.strokeStyle = "#ccc";
	this.ctx.lineWidth = "";
	this.ctx.rect(this.m_xPixel * 1, this.m_yPixel * 1, this.m_width * 1 - this.m_arrowWidth, this.m_height * 1);
	this.ctx.fill();
	this.ctx.stroke();
	this.ctx.restore();
	this.ctx.closePath();
};

RoadMapStack.prototype.drawChevronStack = function () {
	if (this.m_width > 13)
		this.m_arrowWidth = 13;
	else
		this.m_arrowWidth = 0;
	this.ctx.beginPath();
	this.ctx.fillStyle = this.getChevronGradient();
	this.ctx.strokeStyle = this.stackColor;
	this.ctx.rect(this.m_xPixel * 1, this.m_yPixel * 1, this.m_width * 1 - this.m_arrowWidth - 0.5 * 1, this.m_height * 1);
	this.ctx.fill();
	this.ctx.stroke();
	this.ctx.closePath();
};

RoadMapStack.prototype.getChevronGradient = function () {
	var color = this.stackColor;
	var x = this.m_xPixel * 1;
	var y = this.m_yPixel * 1;
	var h = this.m_width * 1;
	var w = this.m_height * 1;
	var grd = this.ctx.createLinearGradient(x, y, x, (y * 1 + w * 1));
	var color0 = hex2rgb(color, 0.90);
	var color1 = hex2rgb(color, 0.85);
	grd.addColorStop(0, color);
	grd.addColorStop(0.1, color0);
	grd.addColorStop(0.49, color);
	grd.addColorStop(0.5, color1);
	grd.addColorStop(0.51, color);
	grd.addColorStop(0.98, color1);
	grd.addColorStop(1, color);
	return grd;
};

RoadMapStack.prototype.drawTriangle = function () {
	this.ctx.beginPath();
	this.ctx.fillStyle = this.stackColor;
	this.ctx.fillStyle = this.stackColor;
	this.ctx.moveTo(this.m_xPixel * 1 + this.m_width * 1 - this.m_arrowWidth, this.m_yPixel);
	this.ctx.lineTo(this.m_xPixel * 1 + this.m_width * 1, this.m_yPixel * 1 + this.m_height / 2 * 1);
	this.ctx.lineTo(this.m_xPixel * 1 + this.m_width * 1 - this.m_arrowWidth, this.m_yPixel * 1 + this.m_height * 1);
	this.ctx.lineTo(this.m_xPixel * 1 + this.m_width * 1 - this.m_arrowWidth, this.m_yPixel);
	this.ctx.fill();
	this.ctx.stroke();
	this.ctx.closePath();
};

RoadMapStack.prototype.drawText = function (fillColor, fontSize) {
	/*if(this.m_type == "SubGroup")
	console.log("subgroup x pos for text"+this.m_xPixel*1+this.m_width/1.9);
	if(this.m_type == "Group")
	console.log("gropu x pos for text"+this.m_xPixel*1+this.m_width/1.9);*/
	var str = this.getCalculatedDescription(this.m_projectText, fontSize);
	this.ctx.beginPath();
	this.ctx.save();
	this.ctx.font = this.m_chart.m_fontstyle + " " + this.m_chart.m_fontweight + " " + fontSize + "px " + selectGlobalFont(this.m_chart.m_fontfamily);
	this.ctx.textAlign = "center";
	this.ctx.fillStyle = fillColor;
	if (this.m_type == "Group")
		this.ctx.fillText(str, this.m_xPixel * 1 + this.m_width / 1.9, this.m_yPixel * 1 + this.m_height * 1 / 2 * 1);
	else
		this.ctx.fillText(str, this.m_xPixel * 1 + this.m_width / 1.9, this.m_yPixel * 1 + this.m_height * 2 / 3 * 1);
	this.ctx.fill();
	this.ctx.restore();
	this.ctx.closePath();

};

RoadMapStack.prototype.drawChevron = function () {
	if (IsBoolean(this.m_outOfChartFlag)) {
		console.log("This is out of Date project");
	} else {
		this.drawChevronStack();
		this.drawTriangle();
	}

	this.drawProgrsiveMark();
	this.drawText(this.m_seriesFontColor, this.m_chart.m_itemfontsize); //itemFontSize
};

RoadMapStack.prototype.drawProgrsiveMark = function () {
	if (this.m_width > this.m_arrowWidth) {
		if (IsBoolean(this.m_startProjectFlag)) {
			var x = this.m_xPixel * 1 + this.m_arrowWidth / 2 * 1;
			this.drawProgresive(x);
		}
		if (IsBoolean(this.m_endProejctFlag)) {
			var x = this.m_xPixel * 1 + this.m_width * 1 - this.m_arrowWidth * 2;
			this.drawProgresive(x);
		}
	}
};

RoadMapStack.prototype.drawProgresive = function (x) {
	this.ctx.beginPath();
	this.ctx.strokeStyle = "#fff";
	this.ctx.lineWidth = 1;
	this.ctx.moveTo(x * 1, this.m_yPixel);
	this.ctx.lineTo(x * 1 + this.m_arrowWidth * 1, this.m_yPixel * 1 + this.m_height / 2 * 1);
	this.ctx.lineTo(x * 1, this.m_yPixel * 1 + this.m_height * 1);
	this.ctx.moveTo(x * 1 + this.m_arrowWidth / 2 * 1, this.m_yPixel);
	this.ctx.lineTo(x * 1 + this.m_arrowWidth * 3 / 2, this.m_yPixel * 1 + this.m_height / 2 * 1);
	this.ctx.lineTo(x * 1 + this.m_arrowWidth / 2 * 1, this.m_yPixel * 1 + this.m_height * 1);
	this.ctx.stroke();
	this.ctx.closePath();
};

RoadMapStack.prototype.getCalculatedDescription = function (m_description, fontSize) {
	var str = m_description;
	this.ctx.beginPath();
	var leftSpace = 10;
	var textWidth = this.ctx.measureText(str).width + leftSpace * 1;
	if (this.m_width > this.m_arrowWidth) {
		if (textWidth > this.m_width - leftSpace * 1) {
			var newText = "";
			if (str.length > 0)
				var appendedTextWidth = (textWidth / str.length) * 3 + this.m_chartLeftRightMargin * 2;

			for (var i = 0; i < str.length; i++) {
				if (this.ctx.measureText(newText).width < (this.m_width - appendedTextWidth * 1 - leftSpace * 1)) {
					newText += str[i];
				} else {
					var dotText = "...";
					var dotTextWidth = this.ctx.measureText(dotText).width;
					if (dotTextWidth > this.m_width) {
						newText = "";
					} else {
						newText = newText + "...";
					}
					break;
				}
			}
			str = newText;
		}
	} else
		str = "";

	this.ctx.closePath();
	return str;

};

//==================RoadMap stack end ================================================

//============RoadMap Title Start =====================================================
function RoadMapTitle(m_chart) {
	this.base = Title;
	this.base(m_chart);

	this.m_showtitle = true;
	this.m_align = "left";
	this.m_formattedDescription = "Title";
	this.m_chart = '';
	this.m_titleBarHeight = 25;
	this.m_gradientcolorsArray = [];

	this.m_chartLeftRightMargin = 30;
	this.ctx = "";
};

RoadMapTitle.prototype = new Title();

RoadMapTitle.prototype.drawImageIcons = function (id, src, x, y) {
	var temp = this;
	$("#" + id + temp.m_chart.m_objectid).remove();
	var image = document.createElement("img");
	image.setAttribute("id", id + "" + temp.m_chart.m_objectid);
	image.setAttribute('class', 'minmaxImage');
	image.style.position = "absolute";

	var imageWidth = 17;
	var imageHeight = 17;
	if (isScaling) {
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

	$('#draggableDivTitle' + temp.m_chart.m_objectid).append(image);
	return image;
};
//# sourceURL=RoadMapChart.js