/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: ProjectTimelineChart.js
 * @description ProjectTimelineChart
 **/
function ProjectTimelineChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_x = 680;
	this.m_y = 320;
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_categoryNames = [];
	this.m_seriesNames = [];
	this.m_displaymilestones = [true, true, true, true, true, true, true, true, false, false, false, false];
	this.m_tdisplayname = "Task1,Task2,Task3";
	this.m_tshape = "rectangle,rectangle,chevron";
	this.m_tcolor = "#E74C3C,#F7CA18,#36D343";
	this.m_msdisplayname = "Milestone1,Milestone2,Milestone3";
	this.m_msshape = "triangle,flag";
	this.m_mscolor = "#e74c3c,#f7ca18,#36d343";
	this.m_msbelowpositioned = "true,false,true";
	this.m_timelinescale = "years";
	this.m_timebandcolor = "#3f4e51";
	this.m_timebandtextcolor = "#ffffff";
	this.m_displayyears = "true";
	this.m_displayyearstextcolor = "#ff531a";
	this.m_milestonefontcolor = "#000000",
	this.m_milestonefontsize = 12,
	this.m_milestonefontweight = "normal",
	this.m_milestonefontfamily = "Roboto",
	this.m_milestonefontstyle = "normal",
	this.m_milestonetextdecoration = "none",
	this.m_taskfontcolor = "#000000",
	this.m_taskfontsize = 12,
	this.m_taskfontweight = "normal",
	this.m_taskfontfamily = "Roboto",
	this.m_taskfontstyle = "normal",
	this.m_tasktextdecoration = "none",
	this.m_ProjectTitleCalculation = new ProjectTimelineCalculation();
	this.isValidStartEndDate = true;
	this.timeline = "";
	this.m_todaymarkerwidth = 2;
	this.m_todaymarkercolor = "#fefefe";
	this.m_minorlabelcolor = "#999999";
	this.m_minorlabelbordercolor = "#dddddd";

	this.m_taskfillopacity = 0.9;
	this.m_milestonefillopacity = 0;
	
	this.m_taskitemoverflow = true;
	this.m_contentalignment = "auto";
	this.m_milestoneborderwidth = 1;
	this.m_milestoneitemdefaultcolor = "#000000";
	this.m_milestoneitemdefaultshape = "circle";
	
	this.m_scrollableboxcolor = "#000000";
	this.m_activeboxcolor = "#30d635";
	
	this.m_axistoitemmargin = 15;
	this.m_marginbetweenitem = 5;
	
	this.m_clicktouse = true;
	this.m_axislabelfontsize = 12;
	this.m_axislabelfontweight = "normal";
	this.m_axislabelfontstyle = "normal";
	this.m_axislabelfontfamily = "Roboto";
	this.m_axislabeltextdecoration = "none";
	this.m_templatedateformat = "dd MMM";
	
	this.m_mindatelimit = new Date(1950, 1, 1);
	this.m_maxdatelimit = new Date(2050, 1, 1);
	
	this.m_showminorlabels = true;
	this.m_showmajorlabels = true;
};

/** @description Making prototype of chart class to inherit its properties and methods into ProjectTimeline chart **/
ProjectTimelineChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
ProjectTimelineChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};
/** @description Iterate through chart JSON and set class variable values with JSON values **/
ProjectTimelineChart.prototype.ParseJsonAttributes = function (jsonObject,
	nodeObject) {
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
				case "TaskDetails":
					for (var taskDetailsKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(taskDetailsKey);
						nodeObject[propertyName] = jsonObject[key][chartKey][taskDetailsKey];
					}

					break;
				case "MileStoneDetails":
					for (var mileStoneDetailsKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(mileStoneDetailsKey);
						nodeObject[propertyName] = jsonObject[key][chartKey][mileStoneDetailsKey];
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
ProjectTimelineChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};
/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
ProjectTimelineChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description Creating Draggable Div and Canvas **/
ProjectTimelineChart.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	if(this.m_designMode){
		var innerDiv = this.createInnerDiv(this.m_draggableDiv);
		this.createVisTimeline(innerDiv);
	}else{
		this.createVisTimeline(this.m_draggableDiv);
	}
	this.setCanvasContext();
	this.initMouseClickEvent();
};
/** @description for adding a div when project timline is not moving in canvas **/
ProjectTimelineChart.prototype.createInnerDiv = function (container) {
	var div = document.createElement("div");
	div.style.width = "100%";
	div.style.height = "100%";
	div.style.zIndex = "" + 3;
	div.style.top = 0 + "px";
	div.style.position = "absolute";
	div.style.background = "transparent";
	$(container).append(div);
	var innerDiv = document.createElement("div");
	innerDiv.setAttribute("id", "innerDiv"  + this.m_objectid);
	innerDiv.style.height = "100%";
	innerDiv.style.width = "100%";
	innerDiv.style.top = 0 + "px";
	innerDiv.style.position = "absolute";
	innerDiv.style.zIndex = "" + 2;
	$(container).append(innerDiv);
	return innerDiv;
};
/** @description Setting Category,Series,Calculatedfields into seriesJSON array **/
ProjectTimelineChart.prototype.createVisTimeline = function (container) {
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
	this.timeline = new vis.Timeline(container);
	this.setTimelineEvents(this.timeline);
};
/** @description Setting Category,Series,Calculated fields into seriesJSON array **/
ProjectTimelineChart.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	var categoryJson = [];
	var seriesJson = [];
	var startValueJson = [];
	var endValueJson = [];
	for (var i = 0, length = fieldsJson.length; i < length; i++) {
		var fieldType = this.getProperAttributeNameValue(fieldsJson[i], "Type");
		switch (fieldType) {
		case "Category":
			categoryJson.push(fieldsJson[i]);
			break;
		case "Series":
			seriesJson.push(fieldsJson[i]);
			break;
		case "startvalue":
			startValueJson.push(fieldsJson[i]);
			break;
		case "endvalue":
			endValueJson.push(fieldsJson[i]);
			break;
		case "CalculatedField":
			seriesJson.push(fieldsJson[i]);
			break;
		default:
			seriesJson.push(fieldsJson[i]);
			break;
		}
	}
	this.setCategory(categoryJson);
	this.setSeries(seriesJson);
	this.setStartValue(startValueJson);
	this.setEndValue(endValueJson);
};
/** @description Setter Method of Category iterate for all category. **/
ProjectTimelineChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_categoryDisplayNames = [];
	this.m_allCategoryNames = [];
	this.m_allCategoryDisplayNames = [];
	this.m_categoryVisibleArr = [];
	var count = 0;

	for (var i = 0; i < categoryJson.length; i++) {
		this.m_allCategoryNames[i] = this.getProperAttributeNameValue(categoryJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(categoryJson[i], "DisplayName"));
		this.m_allCategoryDisplayNames[i] = m_formattedDisplayName;
		this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]] = this.getProperAttributeNameValue(categoryJson[i], "visible");
		if (IsBoolean(this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]])) {
			this.m_categoryNames[count] = this.getProperAttributeNameValue(categoryJson[i], "Name");
			this.m_categoryDisplayNames[count] = m_formattedDisplayName;
			count++;
		}
	}
};
/** @description Setter Method of Series iterate for all series. **/
ProjectTimelineChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesColors = [];
	this.m_legendNames = [];
	this.m_seriesVisibleArr = [];
	this.m_plotRadiusArray = [];
	this.m_plotTrasparencyArray = [];
	this.m_plotShapeArray = [];
	this.m_allSeriesDisplayNames = [];
	this.m_allSeriesNames = [];
	var count = 0;
	this.legendMap = {};
	for (var i = 0; i < seriesJson.length; i++) {
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.m_allSeriesDisplayNames[i] = m_formattedDisplayName;
		this.m_allSeriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		this.m_seriesVisibleArr[this.m_allSeriesNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
		if (IsBoolean(this.m_seriesVisibleArr[this.m_allSeriesNames[i]])) {
			this.m_seriesDisplayNames[count] = m_formattedDisplayName;
			this.m_seriesColors[count] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));
			this.m_legendNames[count] = m_formattedDisplayName;
			this.m_seriesNames[count] = this.getProperAttributeNameValue(seriesJson[i], "Name");
			var radius = this.getProperAttributeNameValue(seriesJson[i], "PlotRadius");
			this.m_plotRadiusArray[count] = (radius != undefined && radius != "" && radius != null) ? radius : 2;
			var transparency = this.getProperAttributeNameValue(seriesJson[i], "PlotTransparency");
			this.m_plotTrasparencyArray[count] = (transparency != undefined && transparency != null) ? transparency : 1;
			var shape = this.getProperAttributeNameValue(seriesJson[i], "PlotType");
			this.m_plotShapeArray[count] = (shape != undefined && shape != "" && shape != null) ? shape : "point";
			var tempMap = {
				"seriesName" : this.m_seriesNames[count],
				"displayName" : this.m_seriesDisplayNames[count],
				"color" : this.m_seriesColors[count],
				"shape" : this.m_plotShapeArray[count],
				"index": count
			};
			this.legendMap[this.m_seriesNames[count]] = tempMap;
			count++;
		}

	}
};
/** @description Setter method for set StartValue. **/
ProjectTimelineChart.prototype.setStartValue = function (startvalueJson) {
	this.m_allStartValueNames = [];
	this.m_startValueDisplayNames = [];
	this.m_startValueNames = [];
	for (var i = 0; i < startvalueJson.length; i++) {
		this.m_allStartValueNames[i] = this.getProperAttributeNameValue(startvalueJson[i], "Name");
		var visible = this.getProperAttributeNameValue(startvalueJson[i], "visible");
		if (IsBoolean(visible)) {
			this.m_startValueNames[i] = this.getProperAttributeNameValue(startvalueJson[i], "Name");
			var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(startvalueJson[i], "DisplayName"));
			this.m_startValueDisplayNames[i] = m_formattedDisplayName;
		}
	}
};
/** @description Setter method for set EndValue. **/
ProjectTimelineChart.prototype.setEndValue = function (endValueJson) {
	this.m_allEndValueNames = [];
	this.m_endValueDisplayNames = [];
	this.m_endValueNames = [];
	for (var i = 0; i < endValueJson.length; i++) {
		this.m_allEndValueNames[i] = this.getProperAttributeNameValue(endValueJson[i], "Name");
		var visible = this.getProperAttributeNameValue(endValueJson[i], "visible");
		if (IsBoolean(visible)) {
			this.m_endValueNames[i] = this.getProperAttributeNameValue(endValueJson[i], "Name");
			var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(endValueJson[i], "DisplayName"));
			this.m_endValueDisplayNames[i] = m_formattedDisplayName;
		}
	}
};
/** @description Getter method of  Category Names. **/
ProjectTimelineChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};
/** @description Getter method of  Category Display Names. **/
ProjectTimelineChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};
/** @description Getter method of  Series Names. **/
ProjectTimelineChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};
/** @description Getter method of All Series Names. **/
ProjectTimelineChart.prototype.getAllSeriesNames = function () {
	return this.m_allSeriesNames;
};
/** @description Getter method of All Category Names. **/
ProjectTimelineChart.prototype.getAllCategoryNames = function () {
	return this.m_allCategoryNames;
};
/** @description Getter method of  Series Display Names. **/
ProjectTimelineChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};
/** @description Getter method of StartValueNames. **/
ProjectTimelineChart.prototype.getStartValueNames = function () {
	return this.m_startValueNames;
};
/** @description Getter method of All StartValueNames. **/
ProjectTimelineChart.prototype.getAllStartValueNames = function () {
   return this.m_allStartValueNames;
};
/** @description Getter method of StartValue Display Names. **/
ProjectTimelineChart.prototype.getStartValueDisplayNames = function () {
	return this.m_startValueDisplayNames;
};
/** @description Getter method of EndValue Names. **/
ProjectTimelineChart.prototype.getEndValueNames = function () {
	return this.m_endValueNames;
};
/** @description Getter method of All EndValueNames. **/
ProjectTimelineChart.prototype.getAllEndValueNames = function () {
	return this.m_allEndValueNames;
};
/** @description Getter method of EndValueNames. **/
ProjectTimelineChart.prototype.getEndValueDisplayNames = function () {
	return this.m_endValueDisplayNames;
};

/** @description initialization of ProjectTimelineChart **/
ProjectTimelineChart.prototype.init = function () {
	this.setCategoryData();
	this.setStartValues();
	this.setEndValues();
	this.setSeriesData();
	this.setAllFieldsName();
	this.setAllFieldsDisplayName();

	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);
	
	if (!IsBoolean(this.isEmptyCategory) && (!IsBoolean(this.m_isEmptyStartValue) || !IsBoolean(this.m_isEmptyEndValue)) ) {
		this.initializeCalculation();
	}
};
/** description drawing of chart started by drawing  different parts of chart like Chartframe,Title,Subtitle **/
ProjectTimelineChart.prototype.drawChart = function () {
	var temp = this;
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	if(!IsBoolean(this.isValidStartEndDate)){
		this.drawMessage(this.m_status.noData);
	}else{
	   var map = this.IsDrawingPossible();
	   if (IsBoolean(map.permission)) {
		   this.timeline.setOptions( this.getOptions() );
	       this.timeline.setData( this.getDataItems() );
	       this.timeline.redraw();
		   this.timeline.fit();
		   window.setTimeout(function(){
				temp.setTimelineItemCSS();
				temp.setTimelineCSS();
			},10);
		}else {
			this.drawMessage(map.message);
		}
	}
};
/** @description Setter Method to set ValidConfiguration. **/
ProjectTimelineChart.prototype.IsDrawingPossible = function () {
	var map = {};
	if (!IsBoolean(this.isEmptyCategory)) {
		if (!(IsBoolean(this.m_isEmptyStartValue)) || !IsBoolean(this.m_isEmptyEndValue)) {
			map = { "permission" : "true", message : this.m_status.success };
		} else {
			map = { "permission" : "false", message : this.m_status.noDate };
		}
	} else{
		map = { "permission" : "false", message : this.m_status.noCategory };
	}
	return map;
};
/** @description Setter method for set the Category data. **/
ProjectTimelineChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	this.isEmptyCategory = true;
	if (this.getCategoryNames().length > 0) {
		this.isEmptyCategory = false;
		for (var i = 0; i < this.getCategoryNames().length; i++) {
			this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
		}
	}
};
/** @description Setter method for set the Series Data. **/
ProjectTimelineChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	this.m_isEmptySeries = true;
	if (!IsBoolean(this.m_isEmptyStartValue) || !IsBoolean(this.m_isEmptyEndValue)) {
		this.m_isEmptySeries = false;
		this.m_seriesData = this.m_categoryData;
	}
};
/** @description Setter method for set the StartValues. **/
ProjectTimelineChart.prototype.setStartValues = function () {
	this.m_startValues = [];
	var tempArr = [];
	this.m_isEmptyStartValue = true;
	if (this.getStartValueNames().length > 0) {
		this.m_isEmptyStartValue = false;
		for (var i = 0; i < this.getStartValueNames().length; i++) {
			 var tempArr = this.getDataFromJSON(this.getStartValueNames()[i]);
			 this.m_startValues[i] = [];
			 for (var k = 0; k < tempArr.length; k++) {
				 if(this.getFormatedDate (tempArr[k]) !==""){
					 this.m_startValues[i][k] = this.getFormatedDate(tempArr[k]);
				 }else{
					this.m_status.noData="Date formate is not Proper!";
			        this.isValidStartEndDate=false;
					break;
				}
			 }
		}
	}
};
/** @description Setter method for set the EndValues. **/
ProjectTimelineChart.prototype.setEndValues = function () {
	this.m_endValues = [];
	this.m_isEmptyEndValue = true;
	if (this.getEndValueNames().length > 0) {
		this.m_isEmptyEndValue = false;
		for (var i = 0; i < this.getEndValueNames().length; i++) {
			var tempArr = this.getDataFromJSON(this.getEndValueNames()[i]);
			this.m_endValues[i] = [];
			for (var k = 0; k < tempArr.length; k++) {
				this.m_endValues[i][k] = this.getFormatedDate(tempArr[k]);
			}
		}
	}
};
/** @description Getter method of CategoryData. **/
ProjectTimelineChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};
/** @description Getter method of SeriesData. * */
ProjectTimelineChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};
/** @description Getter method of StartValues. **/
ProjectTimelineChart.prototype.getStartValues = function () {
	return this.m_startValues;
};
/** @description Getter method of EndValues. * */
ProjectTimelineChart.prototype.getEndValues = function () {
	return this.m_endValues;
};

/** @description Method Will convert year from "yy" format to "yyyy" and  return. **/
ProjectTimelineChart.prototype.getFullYear = function (yy) {
	return ((yy * 1) > 50) ? "19" + yy : "20" + yy;
};
/** @description returns converted date or month from "d" / "m" format to "dd" / "mm" **/
ProjectTimelineChart.prototype.getFullDayMonth = function (dm) {
	return ((""+dm).length == 2) ? dm : ("0" + dm);
};

/** @description method will return the formatted Date. **/
ProjectTimelineChart.prototype.getFormatedDate = function (dateString) {
	if (dateString != undefined) {
		var dateFormate = (this.m_designMode) ? "mm/dd/yyyy" : this.m_sourcedateformat;
		var updatedDate = "";
		switch (dateFormate) {
		case "dd-mm-yy":
			var arr = ("" + dateString).split("-");
			if (arr.length == 3)
				if(this.getFullYear(arr[2]) < 9999)
				updatedDate = arr[1] + "/" + arr[0] + "/" + this.getFullYear(arr[2]);
			break;
		case "mm-dd-yy":
			var arr = ("" + dateString).split("-");
			if (arr.length == 3)
				if(this.getFullYear(arr[2]) < 9999)
				updatedDate = arr[0] + "/" + arr[1] + "/" + this.getFullYear(arr[2]);
			break;
		case "dd-mm-yyyy":
			var arr = ("" + dateString).split("-");
			if (arr.length == 3)
				updatedDate = arr[1] + "/" + arr[0] + "/" + arr[2];
			break;
		case "mm-dd-yyyy":
			var arr = ("" + dateString).split("-");
			if (arr.length == 3)
				updatedDate = arr[0] + "/" + arr[1] + "/" + arr[2];
			break;
		case "yyyy-mm-dd":
			var arr = ("" + dateString).split("-");
			if (arr.length == 3)
				updatedDate = arr[1] + "/" + arr[2] + "/" + arr[0];
			break;

		case "dd/mm/yy":
			var arr = ("" + dateString).split("/");
			if (arr.length == 3)
				if(this.getFullYear(arr[2]) < 9999)
				updatedDate = arr[1] + "/" + arr[0] + "/" + this.getFullYear(arr[2]);
			break;
		case "mm/dd/yy":
			var arr = ("" + dateString).split("/");
			if (arr.length == 3)
				if(this.getFullYear(arr[2]) < 9999)
				updatedDate = arr[0] + "/" + arr[1] + "/" + this.getFullYear(arr[2]);
			break;
		case "dd/mm/yyyy":
			var arr = ("" + dateString).split("/");
			if (arr.length == 3)
				updatedDate = arr[1] + "/" + arr[0] + "/" + arr[2];
			break;
		case "mm/dd/yyyy":
			var arr = ("" + dateString).split("/");
			if (arr.length == 3)
				updatedDate = arr[0] + "/" + arr[1] + "/" + ((arr[2] * 1 <= 99) ? this.getFullYear(arr[2]) : arr[2]);
			break;
		default:
			updatedDate = "";
			break;
		}
		var ud = updatedDate.split("/");
		if (ud[0] * 1 <= 12 && ud[1] * 1 <= 31 && ud[2] * 1 >= 1700){
			return (ud[2] +"-"+ this.getFullDayMonth(ud[0]) +"-"+ this.getFullDayMonth(ud[1])) ; 
		}else {
			return "";
		}
	} else {
		return "";
	}
};

/** @description Setter Method for AllFieldsName **/
ProjectTimelineChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getAllCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getAllCategoryNames()[i]);
	}
	for (var j = 0; j < this.getAllStartValueNames().length; j++) {
		this.m_allfieldsName.push(this.getAllStartValueNames()[j]);
	}
	for (var j = 0; j < this.getAllEndValueNames().length; j++) {
		this.m_allfieldsName.push(this.getAllEndValueNames()[j]);
	}
	for (var j = 0; j < this.getAllSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
	}
};

/** @description Setter Method of AllFieldsDisplayName **/
ProjectTimelineChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getStartValueNames()[j]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getEndValueNames()[j]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};
/** @description Getter Method of AllFieldsName **/
ProjectTimelineChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};
/** @description Getter Method of AllFieldsDisplayName **/
ProjectTimelineChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

/** @description Calculation initialization **/
ProjectTimelineChart.prototype.initializeCalculation = function () {
	this.setChartDrawingArea();
	this.seperateTaskMilestones();
	this.m_ProjectTitleCalculation.init(this);
};
/** @description calcluating mark text margin and than start point from where chart x,y will draw **/
ProjectTimelineChart.prototype.setStartX = function () {
	this.m_startX = this.m_x * 1 ;
};
/** @description  Setter method of ProjectTimelineChart for set EndX position.**/
ProjectTimelineChart.prototype.setEndX = function () {
	this.m_endX = this.m_startX * 1 + this.m_width * 1;
};
/** @description  Setter method of ProjectTimelineChart for set StartY position.**/
ProjectTimelineChart.prototype.setStartY = function () {
	this.m_startY = this.m_y * 1 + (this.m_height);
};
/** @description  Setter method of ProjectTimelineChart for set EndY position.**/
ProjectTimelineChart.prototype.setEndY = function () {
	this.m_endY = (this.m_y * 1 + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1 );
};
/** @description Getter method of ProjectTimelineChart for Marginfortitle. **/
ProjectTimelineChart.prototype.getMarginForTitle = function () {
	return ((!IsBoolean(this.getShowGradient())) && (!IsBoolean(this.m_showmaximizebutton)) && (!IsBoolean(this.getTitle().m_showtitle))) ? 0 : (this.getTitleBarHeight() * 1 + 15);
};
/** @description this method will separate task and milestones from dataset. **/
ProjectTimelineChart.prototype.seperateTaskMilestones = function() {
	this.m_taskDetails = [];
	this.m_milestoneDetails = [];
	for (var i = 0, length = this.m_categoryData[0].length; i < length; i++) {
		if(this.m_startValues[0] == undefined){
			if(this.m_endValues[0] != undefined && this.m_endValues[0][i] !== ""){
				this.m_milestoneDetails.push( {name: this.m_categoryData[0][i], 
					start: "",
					end: this.m_endValues[0][i],
					index : i,
					field: {start: "", end: this.getEndValueDisplayNames()[0]} 
				} );
			}
		}else if(this.m_endValues[0] == undefined){
			if(this.m_startValues[0] != undefined && this.m_startValues[0][i] !== ""){
				this.m_milestoneDetails.push( {name: this.m_categoryData[0][i], 
					start: this.m_startValues[0][i],
					end: "",
					index : i,
					field: {start: this.getStartValueDisplayNames()[0], end: ""}
				} );
			}
		}else if (this.m_startValues[0][i] !== "" && this.m_endValues[0][i] !== "") {
			if(this.m_startValues[0][i] < this.m_endValues[0][i] ){
				this.m_taskDetails.push( {name: this.m_categoryData[0][i], 
					start: this.m_startValues[0][i],
					end: this.m_endValues[0][i],
					index : i,
					field: {start: this.getStartValueDisplayNames()[0], end: this.getEndValueDisplayNames()[0]}
				} );
			}
		}else if (this.m_startValues[0][i] !== "" || this.m_endValues[0][i] !== "") {
			this.m_milestoneDetails.push( {name: this.m_categoryData[0][i], 
				start: (this.m_startValues[0][i] !== "") ? this.m_startValues[0][i] : "",
				end: (this.m_endValues[0][i] !== "") ? this.m_endValues[0][i] : "",
				index : i,
				field: {start: ((this.m_startValues[0][i] !== "") ? this.getStartValueDisplayNames()[0] : ""), 
						end: ((this.m_endValues[0][i] !== "") ? this.getEndValueDisplayNames()[0] : "")}
			} );
		}
	}
	this.initializeMileStoneProperties();
	this.initializeTaskProperties();
};
/** @description this method will intialize  Milestone properties like shape,color. **/
ProjectTimelineChart.prototype.initializeMileStoneProperties = function () {
	this.MileStoneDisplayNames = (this.m_msdisplayname !== "") ? this.m_msdisplayname.split(",") : []; 
	this.MileStoneShapes = (this.m_msshape !== "") ? this.m_msshape.split(",") : [];
	this.MileStoneColors = (this.m_mscolor !== "") ? this.m_mscolor.split(",") : [];
	this.MileStonePositions = (this.m_msbelowpositioned !== "") ? this.m_msbelowpositioned.split(",") : [];
	
	var ms = this.getMatchedUnMatchedMilestoneProperties();
	for(var i = 0, count = 0, length = this.m_milestoneDetails.length; i < length; i++){
		var res = this.getMatchedItemDetail( this.m_milestoneDetails[i].name, ms.matched );
        if(res.matchflag){
        	this.m_milestoneDetails[i].shape = res.data.shape;
        	this.m_milestoneDetails[i].color = res.data.color;
        	this.m_milestoneDetails[i].position = res.data.position;
        }else{
        	if( ms.unmatched.length > 0){
	        	this.m_milestoneDetails[i].shape = ms.unmatched[count].data.shape;
	        	this.m_milestoneDetails[i].color = ms.unmatched[count].data.color;
	        	this.m_milestoneDetails[i].position = ms.unmatched[count].data.position;
	        	if(count == ms.unmatched.length - 1 ){
	                count = 0;
		        }else{
		        	count ++;
		        }
        	}else{
        		this.m_milestoneDetails[i].shape = "circle";
	        	this.m_milestoneDetails[i].color = "#999999";
	        	this.m_milestoneDetails[i].position = "true";
        	}
        }
	}
};
/** @description this method will find and return matched milestones from properties section. 
 *  @returns(Object) milestones 
 * **/
ProjectTimelineChart.prototype.getMatchedUnMatchedMilestoneProperties = function () {
	var milestones = {matched: [], unmatched: []};
	for(var i = 0 ;i < this.MileStoneDisplayNames.length; i++){
		var res = {matchflag: false, data:{}};
		for(var j = 0 ;j < this.m_milestoneDetails.length; j++){
			if(this.m_milestoneDetails[j].name == this.MileStoneDisplayNames[i]){
				res.matchflag = true;
			}
		}
		res.data.name = this.MileStoneDisplayNames[i];
		res.data.shape = this.MileStoneShapes[i];
		res.data.color = this.MileStoneColors[i];
		res.data.position = this.MileStonePositions[i];
		if( res.matchflag ){
			milestones.matched.push( res );
		}else{
			milestones.unmatched.push( res );
		}
	}
	return milestones;
}
/** @description Getter method for returning matched item details for task and milestone **/
ProjectTimelineChart.prototype.getMatchedItemDetail = function (val, arr) {
	var res = {matchflag: false, data:{}};
	for( var i = 0 ;i <arr.length;i++ ){
		if(val ==  arr[i].data.name){
			return arr[i];
		}
	}
	return res;
};
/** @description this method will intialize  Task properties like shape,color. **/
ProjectTimelineChart.prototype.initializeTaskProperties = function () {
	this.TaskDisplayNames = (this.m_tdisplayname !== "") ? this.m_tdisplayname.split(",") : [];
	this.TaskShapes = (this.m_tshape !== "") ? this.m_tshape.split(",") : [];
	this.TaskColors = (this.m_tcolor !== "") ? this.m_tcolor.split(",") : []; 
	
	var task = this.getMatchedUnMatchedTaskProperties();
	for(var i = 0, count = 0, length = this.m_taskDetails.length; i < length; i++){
		var res = this.getMatchedItemDetail( this.m_taskDetails[i].name, task.matched );
        if(res.matchflag){
        	this.m_taskDetails[i].shape = res.data.shape;
        	this.m_taskDetails[i].color = res.data.color;
        }else{
        	if( task.unmatched.length > 0){
	        	this.m_taskDetails[i].shape = task.unmatched[count].data.shape;
	        	this.m_taskDetails[i].color = task.unmatched[count].data.color;
	        	if(count == task.unmatched.length - 1 ){
	                count = 0;
		        }else{
		        	count ++;
		        }
        	}else{
        		this.m_taskDetails[i].shape = "rectangle";
	        	this.m_taskDetails[i].color = "#999999";
        	}
        }
	}
};
/** @description this method will find and return matched task from properties section. 
 *  @returns(Object) task 
 * **/
ProjectTimelineChart.prototype.getMatchedUnMatchedTaskProperties = function () {
	var task = {matched: [], unmatched: []};
	for(var i = 0 ;i < this.TaskDisplayNames.length; i++){
		var res = {matchflag: false, data:{}};
		for(var j = 0 ;j < this.m_taskDetails.length; j++){
			if(this.m_taskDetails[j].name == this.TaskDisplayNames[i]){
				res.matchflag = true;
			}
		}
		res.data.name = this.TaskDisplayNames[i];
		res.data.shape = this.TaskShapes[i];
		res.data.color = this.TaskColors[i];
		if( res.matchflag ){
			task.matched.push( res );
		}else{
			task.unmatched.push( res );
		}
	}
	return task;
}
/** @description Getter Method of dataitem for vis timeline. **/
ProjectTimelineChart.prototype.getDataItems = function () {
	var groups = [];
	for(var i=0; i<1; i++){
		groups.push({ id: "g1", content:"", subgroupOrder: function (a,b) {return a.subgroupOrder - b.subgroupOrder;} });
	}
	
	var items = [];
	var idCount = 0;
	this.colorMap = {};
	var b = this.m_milestoneborderwidth;
	/** bb: 1px bottom border for better look of milestone **/
	var bb = (this.m_milestoneborderwidth !== 0) ? 1 : 0;
	var borderWidth = (this.m_axisorientation == "top") ? ((b*1+bb*1)+"px "+b+"px "+b+"px "+b+"px") : ((b)+"px "+b+"px "+(b*1+bb*1)+"px "+b+"px");
	for(var i=0; i<this.m_milestoneDetails.length; i++){
		var color = convertColorToHex(this.m_milestoneDetails[i].color);
		var temp = color.replace("#", "-");
		var colorCSS = "color" + temp;
		this.colorMap[colorCSS] = color;
		items.push({
				group: "g1", subgroup: "sg1", subgroupOrder: 0,
				id: "milestone" + idCount++, 
				content: this.m_milestoneDetails[i].name, 
				start: ((this.m_milestoneDetails[i].start !== "") ? this.m_milestoneDetails[i].start : this.m_milestoneDetails[i].end), 
				type: "box",
				className: "milestone-item-"+this.m_milestoneDetails[i].shape +" "+colorCSS,
				style: "background:"+hex2rgb(color,this.m_milestonefillopacity)+"; "+"border-width:"+borderWidth+"; border-color:"+color+"; "+"color:"+convertColorToHex(this.m_milestonefontcolor)+"; "+"font-size:"+this.m_milestonefontsize+"px; "+"font-weight:"+this.m_milestonefontweight+"; "+"font-family:"+selectGlobalFont(this.m_milestonefontfamily)+"; "+"font-style:"+this.m_milestonefontstyle+"; "+"text-decoration:"+this.m_milestonetextdecoration+"; "
			});
	}
	/** reset the id to 0, as task-id is starting with different prefix **/
	idCount = 0;
	for(var j=0; j<this.m_taskDetails.length; j++){
		var color = convertColorToHex(this.m_taskDetails[j].color);
		var temp = color.replace("#", "-");
		var colorCSS = "color" + temp;
		this.colorMap[colorCSS] = color;
		items.push({
				group: "g1", subgroup: "sg1", subgroupOrder: 0,
				id: "task"+idCount++, 
				content: this.m_taskDetails[j].name, 
				start: this.m_taskDetails[j].start, 
				end: this.m_taskDetails[j].end, 
				type: "range",
				className: "task-item-"+this.m_taskDetails[j].shape +" "+colorCSS,
				style: "background-color: "+hex2rgb(color,this.m_taskfillopacity)+"; "+"color:"+convertColorToHex(this.m_taskfontcolor)+"; "+"font-size:"+this.m_taskfontsize+"px; "+"font-weight:"+this.m_taskfontweight+"; "+"font-family:"+selectGlobalFont(this.m_taskfontfamily)+"; "+"font-style:"+this.m_taskfontstyle+"; "+"text-decoration:"+this.m_tasktextdecoration+"; "
			});
	}
	return {groups: groups, items: items};
};
/** @description Getter Method of options for vis timeline. **/
ProjectTimelineChart.prototype.getOptions = function () {
	/** @help http://visjs.org/docs/timeline/ **/
	var temp = this;
	return {
		width: (this.m_width - 2) + "px",
		height: (this.m_startY - this.m_endY) + "px",
		clickToUse: this.m_clicktouse,
		align: this.m_contentalignment,
		editable: false,
		selectable: false,
		zoomable: (this.m_designMode) ? false : true,
		moveable: (this.m_designMode) ? false : true,
		type: "point",
		maxMinorChars: 7,
		showMinorLabels: IsBoolean(this.m_showminorlabels),
		showMajorLabels: IsBoolean(this.m_showmajorlabels),
		showCurrentTime: ((this.m_todaymarkerwidth > 0) ? true : false),
		stack: true,
		autoResize: true,
		horizontalScroll: true,
		verticalScroll: false,
//		timeAxis: {scale: "monthly", step: 1},
	    min: this.m_mindatelimit,                // lower limit of visible range
	    max: this.m_maxdatelimit,                // upper limit of visible range
	    zoomMin: 1000 * 60 * 60 * 24 * 15,		  // 1 day of min zoom range
	    zoomMax: 1000 * 60 * 60 * 24 * 365 * 100, // 100 years of zoom max range
		orientation: {axis: this.m_axisorientation, 
			item: (this.m_axisorientation == "both") ? "bottom" : this.m_axisorientation},
		margin: {axis: this.m_axistoitemmargin, item: {horizontal: this.m_marginbetweenitem, vertical: this.m_marginbetweenitem}},
		dataAttributes: ["id", "content", "start", "end", "type"],
		hiddenDates: temp.getHiddenDates(),
		template: function (item) {
			return temp.getMilestoneTaskTemplate(item);
		}
	 }
};
ProjectTimelineChart.prototype.getMilestoneTaskTemplate = function (item) {
	var start = new XDate(item.start.toLocaleDateString()).toString(this.m_templatedateformat);
	if(item.end){
		var end = new XDate(item.end.toLocaleDateString()).toString(this.m_templatedateformat);
		return "<span>" + item.content + " ( " + start + " - " + end + " )</span>";
	}else{
		return "<span>" + item.content + " ( " + start + " )</span>";
	}
};
ProjectTimelineChart.prototype.getHiddenDates = function () {
	/** Hide weekends from timeline **/
//	return {start: "2016-12-31", end: "2017-01-01", repeat:"weekly"};
	return {};
};
/** description will set timeline events for ProjectTimelineChart like drill,tooltip. **/
ProjectTimelineChart.prototype.setTimelineEvents = function (timeline) {
	if(!this.m_designMode){
		var temp = this;
		/** Drill events on timeline items **/
		timeline.on("click", function (properties) {
			if ("ontouchstart" in document.documentElement) {
				onMouseMove(temp);
				if (singleClickTimer == null) {
					singleClickTimer = setTimeout(function() {
						singleClickTimer = null;
						onMouseMove(temp);
					}, temp.m_doubletaptimeout);
				} else {
					var fieldNameValueMap = {};
					var drillColor = "";
					var index = 0;
					if(properties && properties.item != null){
						if(properties.item.indexOf("milestone") != -1){
							var id = properties.item.split("milestone")[1];
							var value = temp.m_milestoneDetails[id].index;
							var afn = temp.m_allfieldsName.length;
							for(var i = 0 ; i < afn;i++){
								fieldNameValueMap[temp.m_allfieldsName[i]] = temp.getDataProvider()[value][temp.m_allfieldsName[i]];
							}
							drillColor = temp.m_milestoneDetails[id].color;
						}else{
							var id = properties.item.split("task")[1];
							value = temp.m_taskDetails[id].index;
							afn = temp.m_allfieldsName.length;
							for(var i = 0 ; i < afn;i++){
								fieldNameValueMap[temp.m_allfieldsName[i]] = temp.getDataProvider()[value][temp.m_allfieldsName[i]];
							}
							drillColor = temp.m_taskDetails[id].color;
						}			
						temp.updateDataPointsToGV( { "drillRecord":fieldNameValueMap, "drillColor":drillColor } );
					}
				}
			} else {
				var fieldNameValueMap = {};
				var drillColor = "";
				var index = 0;
				if(properties && properties.item != null){
					if(properties.item.indexOf("milestone") != -1){
						var id = properties.item.split("milestone")[1];
						value = temp.m_milestoneDetails[id].index;
						var afn = temp.m_allfieldsName.length;
						for(var i = 0 ; i < afn;i++){
							fieldNameValueMap[temp.m_allfieldsName[i]] = temp.getDataProvider()[value][temp.m_allfieldsName[i]];
						}
						drillColor = temp.m_milestoneDetails[id].color;
					}else{
						var id = properties.item.split("task")[1];
						value = temp.m_taskDetails[id].index;
						afn = temp.m_allfieldsName.length;
						for(var i = 0 ; i < afn;i++){
							fieldNameValueMap[temp.m_allfieldsName[i]] = temp.getDataProvider()[value][temp.m_allfieldsName[i]];
						}
						drillColor = temp.m_taskDetails[id].color;
					}			
					temp.updateDataPointsToGV( { "drillRecord":fieldNameValueMap, "drillColor":drillColor } );
				}
			}
		});
		
		/*$(timeline)[0].addEventListener("touchstart", function(event) {
			
		}, false);*/
		
		/** Tooltip events on timeline items **/
		if(IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")){
			timeline.on("itemover", function(properties){
			    pageX = properties.event.pageX;
			    pageY = properties.event.pageY;
				var toolTipData = {};
				toolTipData.cat = "";
				toolTipData.data = [];
				if(properties && properties.item != null){
					if(properties.item.indexOf("milestone") != -1){
						var id = properties.item.split("milestone")[1];
						toolTipData.cat = temp.m_milestoneDetails[id].name;
						toolTipData.color = temp.m_milestoneDetails[id].color;
						toolTipData.shape = temp.m_milestoneDetails[id].shape;
						var fieldName = (temp.m_milestoneDetails[id].field.start !== "") ? temp.m_milestoneDetails[id].field.start : temp.m_milestoneDetails[id].field.end;
						var fieldValue = (temp.m_milestoneDetails[id].field.start !== "") ? temp.m_milestoneDetails[id].start : temp.m_milestoneDetails[id].end;
						toolTipData.data.push( [fieldName, fieldValue] );
					}else{
						var id = properties.item.split("task")[1];
						toolTipData.cat = temp.m_taskDetails[id].name;
						toolTipData.color = temp.m_taskDetails[id].color;
						toolTipData.shape = temp.m_taskDetails[id].shape;
						toolTipData.data.push( [temp.m_taskDetails[id].field.start, temp.m_taskDetails[id].start] );
						toolTipData.data.push( [temp.m_taskDetails[id].field.end, temp.m_taskDetails[id].end] );
					}
					temp.drawTooltipContent(toolTipData);
				}else{
					temp.hideToolTip();
				}
			});
			timeline.on("itemout", function(properties){
				temp.hideToolTip();
			});
		}
		timeline.on("rangechanged", function(){
		     temp.setTimelineCSS();
		 });
	}
};
/** @description will set css for timeline items. **/
ProjectTimelineChart.prototype.setTimelineItemCSS = function () {
	var temp = this;
	var container = this.m_draggableDiv;
	window.setTimeout(function(){
		/** will add the color style in preview page for milestones and tasks **/
		for(var key in temp.colorMap){
			$("#draggableDivStyle"+temp.m_objectid+""+key).remove();
			$("head").append('<style id="draggableDivStyle'+temp.m_objectid+''+key+'" type="text/css">'+
				'#draggableDiv'+temp.m_objectid+' .vis-line.'+key+' { border-right: '+temp.m_milestoneborderwidth+'px solid '+temp.colorMap[key]+';}'
			);
		}
		var itemMargin = (temp.m_axisorientation == "top" || temp.m_axisorientation == "none") ? -15 : -2;
		/** will set the shapes for each milestone **/
		$(container).find(".vis-timeline").find(".vis-item.vis-dot").each(function(){
			var classList = $(this).attr("class").split(/\s+/);
			var color = convertColorToHex(temp.m_milestoneitemdefaultcolor);
			$.each(classList, function(index, item) {
			    if (item.indexOf("color-") !== -1) {
			        color = convertColorToHex(""+item.split("-")[1]);
			    }
			});
			var shape = temp.m_milestoneitemdefaultshape;
			$.each(classList, function(index, item) {
			    if (item.indexOf("milestone-item-") !== -1) {
			    	shape = item.split("milestone-item-")[1];
			    }
			});
			$(this).addClass("icons bd-"+shape);
			$(this).css({"color": color, "margin-left": (-7)+"px", "margin-top": (itemMargin)+"px"});
		});
	}, 10);
};
/** @description will set css for timeline. **/
ProjectTimelineChart.prototype.setTimelineCSS = function () {
	var temp = this;
	var container = this.m_draggableDiv;
	$(container).find(".vis-timeline").css({
		"position": "absolute", "background": "transparent", "left": "1px", "top": this.m_endY + "px"
	});
	$(container).find(".vis-timeline").find(".vis-current-time").css({
	      "background-color": convertColorToHex(temp.m_todaymarkercolor),
	      "width": temp.m_todaymarkerwidth+"px"
	});
	$(container).find(".vis-timeline").find(".vis-item").find(".vis-item-overflow").css({
	      "overflow": (IsBoolean(temp.m_taskitemoverflow) ? "visible" : "hidden")
	});
	$(container).find(".vis-time-axis .vis-text").css({
	      "color": convertColorToHex(this.m_minorlabelcolor), "font-size": this.m_axislabelfontsize+"px",
	      "font-weight": this.m_axislabelfontweight, "font-style": this.m_axislabelfontstyle,
	      "font-family": selectGlobalFont(this.m_axislabelfontfamily), "text-decoration": this.m_axislabeltextdecoration
	});
	$(container).find(".vis-time-axis .vis-grid.vis-minor").css({
	      "border-color": convertColorToHex(this.m_minorlabelbordercolor)
	});
	$(container).find(".vis-time-axis .vis-grid.vis-major").css({
	      "border-color": convertColorToHex(this.m_minorlabelbordercolor)
	});
	$(container).find(".vis-active").css({
	      "box-shadow": "0px 0px 2px 1px "+hex2rgb(temp.m_activeboxcolor, 0.5)+" inset"
	});
	$(container).find(".vis-panel .vis-shadow").css({
	      "box-shadow": "0 0 5px 1px "+hex2rgb(temp.m_scrollableboxcolor, 0.2)
	});
	this.addCustomCSSToHead();
};
/** @description to provide option to add cutom css from script by overriding this method **/
ProjectTimelineChart.prototype.addCustomCSSToHead = function () {
	var temp = this;
	var container = this.m_draggableDiv;
};
/** @description will draw the ChartFrame  of the ProjectTimelineChart. **/
ProjectTimelineChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};
/** @description Will Draw Title on canvas if showTitle set to true **/
ProjectTimelineChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

/** @description Will Draw SubTitle on canvas if showSubTitle set to true **/
ProjectTimelineChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

ProjectTimelineChart.prototype.getToolTipData = function (mouseX, mouseY) {
	
};
/** @description this methods draws the tooltip content in table - overrided in some sub classes **/
ProjectTimelineChart.prototype.drawTooltipContent = function (toolTipData) {
	this.m_tooltip.draw(toolTipData, this.m_componenttype);
};
ProjectTimelineChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
};
/** @description Constructor function of ProjectTimelineCalculation class. * */
function ProjectTimelineCalculation() {
	this.m_chart = "";
};
ProjectTimelineCalculation.prototype.init = function (m_chart) {
	this.m_chart = m_chart;
};
//# sourceURL=ProjectTimelineChart.js