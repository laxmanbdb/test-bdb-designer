/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: CheckList.js
 * @description CheckList
 **/
function CheckList(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();

	this.m_horizontalalign = "";
	this.m_enabletickcolorasseriescolor = "";
	this.m_verticalgap = "";
	this.m_chartids = "";
	this.m_textdecoration = "";
	this.m_fontstyle = "";
	this.m_fontsize = "";
	this.m_color = "";
	this.m_fontweight = "";
	this.m_fontfamily = "";
	this.m_bordervisible = "";
	this.m_width = "";
	this.m_height = "";
	this.m_contentbackgroundalpha = "";
	this.m_contentbackgroundcolor = "";
	this.m_globalkey = "";
	this.m_fieldname = "";
	this.m_direction = "";

	this.dashboard = "";
	this.m_chartsArr = "";
	this.m_fieldNameValueMap = new Object();
	this.m_chartframe = new ChartFrame();

	this.m_objectID = [];
	this.m_componentid = "";

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
};

CheckList.prototype = new Widget();

CheckList.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

CheckList.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "CheckList") {
			for (var labelKey in jsonObject[key]) {
				this.setAttributeValueToNode(labelKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

CheckList.prototype.setDataProvider = function (data) {
	//this.m_labelText =  data ;
};

CheckList.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

CheckList.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
};
CheckList.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "CheckListDiv" + this.m_objectid;
};
CheckList.prototype.draw = function () {
	this.drawObject();
};

CheckList.prototype.initialize = function (xmlObject, dashBoard) {
	this.parseXML(xmlObject, dashBoard);
	this.m_objectID = this.m_objectid.split(".");
	this.m_componentid = "CheckListDiv" + this.m_objectID[1];
};

CheckList.prototype.drawObject = function () {
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback!="")
		onAfterRender(this.m_onafterrendercallback);
	//	this.callDrawInit();
};
CheckList.prototype.getGlobalKey = function () {
	return this.m_globalkey;
};
CheckList.prototype.getFieldName = function () {
	return this.m_fieldname;
};

CheckList.prototype.init = function () {
	//this.m_chartframe.init(this);
	this.chartid = this.m_chartids.split(",");
	this.m_chartsArr = this.getChartObject();
	if (this.m_chartsArr.length > 0) {
		this.m_seriesName = this.getSeriesNames();
		//this.isSeriesVisibleArray=this.m_chart[0].getSeriesVisibility();
	}
};

CheckList.prototype.calculateRows = function () {
	return Math.ceil(this.m_seriesName.length / this.m_columncount);
};

CheckList.prototype.getSeriesNames = function () {
	//this.m_chartsArr[].m_datasource;
	this.seriesDisplayNames = [];
	this.seriesNames = [];
	var dataSetArr = this.m_dashboard.m_dataSetsArray;
	for (var i = 0; i < this.m_chartsArr.length; i++) {
		var datasource = this.m_chartsArr[i].m_datasource;
		for (var j = 0; j < dataSetArr.length; j++) {
			if (dataSetArr[j].m_datasource == datasource) {
				var fields = dataSetArr[j].m_Fields;
				for (var k = 0; k < fields.length; k++) {
					if (fields[k].m_type == "Series") {
						this.seriesDisplayNames.push(fields[k].m_displayname);
						this.seriesNames.push(fields[k].m_name);
					}
				}
				break;
			}
		}
	}
	this.seriesDisplayNames = this.unique(this.seriesDisplayNames);
	return this.seriesDisplayNames;
};
CheckList.prototype.unique = function (data) {
	var outputArray = [];
	for (var i = 0; i < data.length; i++) {
		if (($.inArray(data[i], outputArray)) == -1) {
			outputArray.push(data[i]);
		}
	}
	return outputArray;
};
CheckList.prototype.getChartObject = function () {
	var chartobj = [];
	if (this.m_dashboard != "") {
		for (var i = 0, k = 0; i < this.m_dashboard.m_widgetsArray.length; i++) {
			for (var j = 0; j < this.chartid.length; j++) {
				if (this.m_dashboard.m_widgetsArray[i].m_objectid == this.chartid[j].split(".")[1]) {
					chartobj[k] = this.m_dashboard.m_widgetsArray[i];
					k++;
				}
			}
		}
	}
	return chartobj;
};

CheckList.prototype.drawChart = function () {
	//this.m_chartframe.drawFrame();
	this.drawCheckBoxes();
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).on("click", function () {
		if (!IsBoolean(temp.m_designMode)) {
			temp.getDataPointAndUpdateGlobalVariable();
		}
	});
};

CheckList.prototype.drawCheckBoxes = function () {
	var temp = this;
	$("#" + temp.m_componentid).remove();
	var span = this.drawSpan();

	if (this.m_chartsArr.length > 0) {
		for (var i = 0; i < this.seriesDisplayNames.length; i++) {
			this.checkbox = this.drawCheckBox(i, span);
		}
		for (var j = 0; j < this.m_chartsArr.length; j++) {
			//			this.m_chart[j].updateSeriesVisibility();// uncomment this if not want default selected
		}
	}
};

CheckList.prototype.drawCheckBox = function (index, containerDiv) {
	//this.seriesDisplayNames[index] this.seriesNames[index]
	var temp = this;

	var checkbox = document.createElement("input");
	checkbox.setAttribute("name", this.seriesDisplayNames[index]);
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("value", this.seriesDisplayNames[index]);
	checkbox.setAttribute("id", "checklist" + this.seriesDisplayNames[index]);
	checkbox.setAttribute("class", "option-input-cr cr-checkbox");
	checkbox.style.marginTop = this.m_verticalgap + "px";
	checkbox.style.marginLeft = 2 + "px";

	checkbox.checked = true; // it is for default checked

	checkbox.onchange = function () {
		for (var j = 0; j < temp.m_chartsArr.length; j++) {
			temp.m_chartsArr[j].updateSeriesVisibility();
			temp.m_chartsArr[j].init();
			temp.m_chartsArr[j].drawChart();
		}
	};
	//checkbox.setAttribute((this.isSeriesVisibleArray[index]=="true")?"checked":"unchecked",true);
	var labelObj = this.drawLabel(this.seriesDisplayNames[index]);
	var linebreak = document.createElement("br");
	containerDiv.appendChild(checkbox);
	containerDiv.appendChild(labelObj);
	if (this.m_direction == "vertical")
		containerDiv.appendChild(linebreak);

	return checkbox;
};

CheckList.prototype.drawSpan = function () {
	var temp = this;
	var spanObj = document.createElement("span");
	spanObj.setAttribute("id", this.m_componentid);
	spanObj.setAttribute("class", "CheckListSpan");
	spanObj.style.width = this.m_width + "px";
	spanObj.style.height = this.m_height + "px";
	spanObj.style.position = "absolute";
	spanObj.style.overflow = "auto";
	spanObj.style.background = hex2rgb(convertColorToHex(this.m_contentbackgroundcolor), this.m_contentbackgroundalpha);

	if (IsBoolean(this.m_bordervisible))
		spanObj.style.border = "1.0px solid #000";

	$("#draggableDiv" + temp.m_objectid).append(spanObj);
	return spanObj;
};

CheckList.prototype.drawLabel = function (labelText, valueText) {
	var labelObj = document.createElement("label");
	labelObj.appendChild(document.createTextNode(labelText));

	labelObj.style.color = convertColorToHex(this.m_color);
	labelObj.style.fontSize = this.fontScaling(this.m_fontsize * 1) + "px";
	labelObj.style.fontFamily = selectGlobalFont(this.m_fontfamily);
	labelObj.style.fontWeight = this.m_fontweight;
	labelObj.style.fontStyle = this.m_fontstyle;
	labelObj.style.textDecoration = this.m_textdecoration;

	return labelObj;
};

CheckList.prototype.handleCheckedEvent = function (checklistvalues) {
	var optionValue = checklistvalues;
	var globalVariableObj = this.m_dashboard.getGlobalVariable();
	if (globalVariableObj != "" && globalVariableObj != undefined) {
		var variableObj = this.m_dashboard.getGlobalVariable().map[this.getGlobalKey()];
		if (variableObj != undefined) {
			if (IsBoolean(this.m_isDataSetavailable)) {
				for (var i = 0; i < this.getDataSet().getFields().length; i++) {
					this.m_fieldNameValueMap[this.getDataSet().getFields()[i].getvalue()] = optionValue;
					this.m_fieldNameValueMap[this.getDataSet().getFields()[i].getdisplayField()] = optionValue;
				}
			} else {
				this.m_fieldNameValueMap[this.getFieldName()] = optionValue;
			}
			variableObj.update(this.m_fieldNameValueMap);
		}
	}
};

CheckList.prototype.parseXML = function (xmlObjectNode, dashBoard) {
	this.dashboard = dashBoard;
	var temp = this;
	this.widgetparseXML = NividhWidget.prototype.parseXML;
	this.widgetparseXML(xmlObjectNode, dashBoard);

	var xmlCheckListnode = $(xmlObjectNode).find("CheckList");
	ParseAttributes(xmlCheckListnode[0], temp);
};

CheckList.prototype.getToolTipData = function (mouseX, mouseY) {
	this.mouseX = mouseX;
	this.mouseY = mouseY;
	var data = new Array();
	return data;
};
CheckList.prototype.getDataPointAndUpdateGlobalVariable = function () {
	//	if(this.m_fieldvalue!=""){
	var fieldNameValueMap = {};
	var fieldname = (this.m_fieldname == "" || this.m_fieldname == undefined) ? "Value" : this.m_fieldname;
	fieldNameValueMap[fieldname] = this.m_fieldvalue;
	this.updateDataPoints(fieldNameValueMap);
	//	}
};
//# sourceURL=CheckList.js