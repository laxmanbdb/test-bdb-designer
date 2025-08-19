/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: TreeMapChart.js
 * @description TreeMapChart
 **/
function TreeMapChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();
	this.m_x = 20;
	this.m_y = 320;
	this.m_width = 300;
	this.m_height = 260;
	this.m_radius = 1;
	this.m_seriesNames = [];
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_max = [];
	this.m_range1 = [];
	this.m_range2 = [];
	this.m_color = [];
	this.m_CategoryDataSum = [];
	this.m_displayname = [];
	this.m_rangeForLegend = [];
	this.m_range = [];
	this.m_ranges = "";
	this.m_colorArray = [];
	this.m_seriesColorArray = [];
	this.m_color = [];
	this.m_displayname = "ES,MS";
	this.m_ranges = "0-20,20-100";
	this.m_colors = "#cccccc,26265";
	this.m_legendDisplayNames = "";
	this.m_showcelltext = false;
	this.m_celltextcolor = "#000000";
	this.m_celltextfontstyle = "normal";
	this.m_celltextfontweight = "normal";
	this.m_celltextfontsize = "12";
	this.m_celltextfontfamily = "Roboto";
	this.m_highervaluesaregood = "true";
	this.m_titleBarHeight = 25;
	this.m_subTitleBarHeight = 25;
	this.m_xAxis = new Xaxis();
	this.m_yAxis = new Yaxis();
	this.m_colorMap = new Object();
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_objectid = "";
	this.m_textUtil = new TextUtil();
	this.m_headerbgcolor = "#CCCCCC";
	this.m_bodystrokecolor = "#FFFFFF";
	this.m_showdynamicrange = true ;
	this.m_minrangecolor="#eeeeee";
	this.m_maxrangecolor="#443554";
	this.m_leafNodeSeriesDataFlag=false;
	this.m_parentNodeSeriesDataFlag=false;
	this.m_childNodeSeriesDataFlag=false;
	this.m_defaultfillcolor = "#e0dfdf";
	/**Added for data label*/
	this.m_leftpadding = 7;
	this.m_rightpadding = 7;
	this.m_toppadding = 7;
	this.m_bottompadding = 7;
	/**BDD-547 : Added for hide/show parent or child data label*/
	this.m_showparentdatalabel = true;
	this.m_showparenttextformatter = true;
		
};
TreeMapChart.prototype = new Chart();
TreeMapChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};
TreeMapChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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
				case "Legend":
					for (var legendKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(legendKey);
						nodeObject[propertyName] = jsonObject[key][chartKey][legendKey];
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
TreeMapChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};
TreeMapChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};
TreeMapChart.prototype.setDraggableCanvasSize = function () {
	var height = (IsBoolean(this.m_isEmptySeries)) ? (this.m_height) : (this.getMarginForTitle() * 1 + this.getMarginForSubTitle());
	var draggableCanvas = document.getElementById("draggableCanvas" + this.m_objectid);
	if (draggableCanvas != "" && draggableCanvas != undefined) {
		draggableCanvas.width = this.m_width;
		draggableCanvas.height = height;
	}
};
TreeMapChart.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	this.setSeries(fieldsJson);
};
TreeMapChart.prototype.setSeries = function (fieldsData) {
	this.fieldsData = fieldsData;
	this.m_visibleArr = {};
	this.m_allSeriesDisplayNames = [];
	this.m_allSeriesNames = [];
	this.m_hierarchyTypeArr = {};
	this.m_seriesName = [];
	this.m_displayNames = [];
	this.m_colorField = {};
	this.m_leafNodeName = [];
	this.m_seriesNameWithColorField = {};
	this.m_AdditionalDataField = {};
	var count = 0;
	var c = 0;
	for (var i = 0, length = fieldsData.length; i < length; i++) {
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(fieldsData[i], "DisplayName"));
		this.m_allSeriesDisplayNames[i] = m_formattedDisplayName;
		this.m_allSeriesNames[i] = this.getProperAttributeNameValue(fieldsData[i], "Name");
		this.m_visibleArr[this.m_allSeriesNames[i]] = this.getProperAttributeNameValue(fieldsData[i], "visible");
		this.m_hierarchyTypeArr[this.m_allSeriesNames[i]] = this.getProperAttributeNameValue(fieldsData[i], "hierarchyType");
		if (IsBoolean(this.m_visibleArr[this.m_allSeriesNames[i]])) {
			this.m_seriesName[count] = this.getProperAttributeNameValue(fieldsData[i], "Name");
			this.m_displayNames[count] = m_formattedDisplayName;
			var colorField = this.getProperAttributeNameValue(fieldsData[i], "ColorField");
			this.m_seriesNameWithColorField[this.m_seriesName[count]] =  this.getProperAttributeNameValue(fieldsData[i], "ColorField");
			var AdditionalFieldName = (this.getProperAttributeNameValue(fieldsData[i], "AdditionalField") !== undefined) ? (this.getProperAttributeNameValue(fieldsData[i], "AdditionalField")) : this.m_seriesName[count];
			this.m_AdditionalDataField[this.m_seriesName[count]] =  AdditionalFieldName.split(",");
			//this.m_colorField[this.m_seriesName[count]] = (colorField != undefined && colorField != null) ? colorField : "";
			if (this.m_hierarchyTypeArr[colorField] != "parent" && this.m_hierarchyTypeArr[colorField] != "child"){
				this.m_colorField[this.m_seriesName[count]] = (colorField != undefined && colorField !== null && colorField !== "") ? colorField : "";
				this.m_leafNodeName[c] = this.m_seriesName[count];
			}else
				this.m_colorField[this.m_seriesName[count]] = "";
			count++;
		}
	}
	this.setCategoryNames(fieldsData);
	this.setSeriesNames(fieldsData);
	this.setFieldsByNames(fieldsData);
};
TreeMapChart.prototype.setCategoryNames = function (fieldsJson) {
	this.cat = [];
	for (var i = 0, length = fieldsJson.length; i < length; i++) {
		if (this.getProperAttributeNameValue(fieldsJson[i], "Name") == "")
			this.cat[i] = this.getProperAttributeNameValue(fieldsJson[i], "Value");
		else
			this.cat[i] = this.getProperAttributeNameValue(fieldsJson[i], "Name");
	}
};
TreeMapChart.prototype.setSeriesNames = function (fieldsJson) {
	this.ser = [];
	for (var i = 0, length = fieldsJson.length; i < length; i++) {
		if (this.getProperAttributeNameValue(fieldsJson[i], "Name") == "")
			this.ser[i] = this.getProperAttributeNameValue(fieldsJson[i], "Value");
		else
			this.ser[i] = this.getProperAttributeNameValue(fieldsJson[i], "Name");
	}
};
TreeMapChart.prototype.setFieldsByNames = function (fieldsJson) {
	this.m_fieldByName = [];
	for (var i = 0, length = fieldsJson.length; i < length; i++) {
		var hType = this.getProperAttributeNameValue(fieldsJson[i], "hierarchyType");
		if (hType == "parent" || hType == "child")
			this.m_fieldByName.push(this.getProperAttributeNameValue(fieldsJson[i], "Name"));
	}
};
TreeMapChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};
TreeMapChart.prototype.getSeriesNames = function () {
	return this.ser;
};
TreeMapChart.prototype.getCategoryNames = function () {
	return this.cat;
};
TreeMapChart.prototype.getFieldsByNames = function () {
	return this.m_fieldByName;
};
TreeMapChart.prototype.init = function () {
	this.setCategoryData();
	this.setSeriesData();
	this.isSeriesDataEmpty();
	this.setAllFieldsName();
	//	this.m_seriesData=this.getDataProvider();
	this.m_seriesDataForToolTip = this.getSeriesDataForToolTipData(this.getDataProvider());
	this.setColorFieldArr();
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);
	if (!IsBoolean(this.m_isEmptySeries)){
		this.getRanges();
		this.initializeColor();
		this.createColorRange();
		this.setUnitSymbol();
		this.setSecondaryUnitSymbol();
	}
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};
TreeMapChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0, len = this.getCategoryNames().length; i < len; i++) {
		this.m_allfieldsName.push(this.getCategoryNames()[i]);
	}
	for (var j = 0, length = this.getSeriesNames().length; j < length; j++) {
		this.m_allfieldsName.push(this.getSeriesNames()[j]);
	}
};
TreeMapChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};
TreeMapChart.prototype.setColorFieldArr = function () {
	for(var i = 0, length = this.m_seriesColorNameArr.length; i < length; i++){
		var field = (this.m_colorField[this.m_seriesColorNameArr[i]]) !="" ? (this.m_colorField[this.m_seriesColorNameArr[i]]):(this.m_seriesColorNameArr[i]);
//		var colorField = (this.isColorField(field))? (field):(this.m_seriesColorNameArr[i]);
		var colorField = field;
		this.m_seriesColorValueArr[i] = this.getDataFromJSON(colorField);
	}
};

/** @description check field is exit in series array or not **/
TreeMapChart.prototype.isColorField = function (field) {
	for(var i = 0, length = this.m_leafNodeName.length; i < length; i++){
		if(field == this.m_leafNodeName[i])
			return true;
		else 
			return false;
	}
};

TreeMapChart.prototype.setMinMaxValueFromSeriesData = function () {
	this.serMaxVal = this.serMinVal = 0;
	var singletonFlag = true;
	for(var i = 0, outerLength = this.m_seriesColorValueArr.length; i < outerLength; i++){
		for(var j = 0, innerLength = this.m_seriesColorValueArr[i].length; j < innerLength; j++ ){
			var seriesColorValue = getNumericComparableValue(this.m_seriesColorValueArr[i][j]);
			if(seriesColorValue !== undefined && !isNaN(seriesColorValue) && seriesColorValue !== null && seriesColorValue !== ""){
				if(singletonFlag){
					this.serMaxVal = this.serMinVal = seriesColorValue;
					singletonFlag = false;
				}
				if(this.serMaxVal <= seriesColorValue*1)
					this.serMaxVal = seriesColorValue;
				if(this.serMinVal >= seriesColorValue*1)
					this.serMinVal = seriesColorValue; 
			}
		}
	}
};
TreeMapChart.prototype.getSeriesDataForToolTipData = function (copyObject) {
	var arr = [];
	var count = 0;
	for (var key in copyObject) {
		for (var key1 in copyObject[key])
			if (this.m_hierarchyTypeArr[key1] == "none") {
				if (isNaN(copyObject[key][key1])) {
					var strInt = getNumericComparableValue(copyObject[key][key1]);
					if (isNaN(strInt)) {
						arr[count] = {
							name : key1,
							value : copyObject[key][key1],
							flag : "false"
						};
						count++;
					} else {
						arr[count] = {
							name : key1,
							value : copyObject[key][key1],
							flag : "true"
						};
						count++;
					}
				} else {
					arr[count] = {
						name : key1,
						value : copyObject[key][key1],
						flag : "false"
					};
					count++;
				}
			}
	}
	return arr;
};
TreeMapChart.prototype.getSeriesDataForCommaSperator = function (Obj) {
	var copyObject = getCopyOfJsonObject(Obj);
	for (var key in copyObject) {
		for (var key1 in copyObject[key]) {
			if (this.m_hierarchyTypeArr[key1] == "none") {
				if ((copyObject[key][key1] * 1 < 0) || copyObject[key][key1] == "") {
					copyObject[key][key1] = 0;
				} else {
					if (isNaN(copyObject[key][key1])) {
						var strInt = (copyObject[key][key1]);
						copyObject[key][key1] = (strInt);
					}
				}
			}
		}
	}
	return copyObject;
};
TreeMapChart.prototype.initializeColor = function () {
	var color = this.m_colors.split(",");
	for (var i = 0, length = this.m_range.length; i < length; i++) {
		if (color[i] != undefined)
			this.m_color[i] = convertColorToHex(color[i]);
		else
			this.m_color[i] = this.m_color[i - 1];
	}
};
TreeMapChart.prototype.createColorRange = function () {
	var crWidth = this.m_width;
	this.m_minRange = [this.m_range1.min(), this.m_range2.min()].min();
	this.m_maxRange = [this.m_range1.max(), this.m_range2.max()].max();
	this.m_treeMapColorValue = [{
		val : 1,
		color : "#FFFFFF",
		min : 0,
		max : 0
	}];
	if(!IsBoolean(this.m_showdynamicrange)){
		if (this.m_range.length > 0) {
			if (this.m_range.length == 1) {
				for (var i = 0, length = this.m_range.length; i < length; i++) {
					var minR = Math.abs(this.m_range1[i]);
					var maxR = Math.abs(this.m_range2[i]);
					var midR = minR*1 +(maxR - minR)/2;
					/**DAS-678  setting gradient color to solid color check*/
					this.m_treeMapColorValue[0] = {
						val : 0,
						color : (IsBoolean(this.m_highervaluesaregood)) ? ColorLuminance(this.m_color[i],0.75) : this.m_color[i],
						min : minR,
						max : maxR
						};
						/*
					this.m_treeMapColorValue[1] = {
						val : 1,
						color : (IsBoolean(this.m_highervaluesaregood)) ? this.m_color[i] : ColorLuminance(this.m_color[i],0.75),
						min : midR,
						max : maxR
						};
						*/
				}
			} else {
				for (var i = 0, length = this.m_range.length; i < length; i++) {
					var minR = Math.abs(this.m_range1[i]);
					var maxR = Math.abs(this.m_range2[i]);
					var mark;
					if(i==0){
					 mark = 0;
					}else if(i == this.m_range.length-1){
						mark = 1;
					}else{
						var stop = minR + Math.abs(maxR - minR) / 2;
						mark = (this.m_maxRange > 0) ? (stop / this.m_maxRange) : i/(this.m_range.length-1) ;
						mark = (mark <= 1) ? mark : 1 ;
					}
					this.m_treeMapColorValue[i] = {
						val : mark,
						color : this.m_color[i],
						min : minR,
						max : maxR
					};
				}
			}
		}
	}
	else{
		this.setMinMaxValueFromSeriesData();
		var color = [];
		color[0] = this.m_minrangecolor;
		color[1] = this.m_maxrangecolor;
		for (var i = 0, length = color.length; i < length; i++) {
			if(i==0){
				mark = 0;
			}else if(i == color.length-1){
				mark = 1;
			}else{
				mark = i/(color.length-1);
			}
			this.m_treeMapColorValue[i] = {
				val : mark,
				color : color[i],
				min : this.serMinVal,
				max : this.serMaxVal
			};
		}
	}
};
TreeMapChart.prototype.getRanges = function () {
	this.m_range = (this.m_ranges != "") ? this.m_ranges.split(",") : [];
	for (var i = 0, length = this.m_range.length; i < length; i++) {
		var splitter = this.m_range[i].indexOf("~") > -1 ? "~" : "-";
		var m_rangeForLegend = (this.m_range[i].split(splitter));
		this.m_range1[i] = m_rangeForLegend[0] * 1;
		this.m_range2[i] = m_rangeForLegend[1] * 1;
	}
	Array.prototype.max = function () {
		return (this.length != 0) ? Math.max.apply(null, this) : 0;
	};
	Array.prototype.min = function () {
		return (this.length != 0) ? Math.min.apply(null, this) : 0;
	};
	this.m_minRangeValue = [this.m_range1.min(), this.m_range2.min()].min();
	this.m_maxRangeValue = [this.m_range1.max(), this.m_range2.max()].max();
};
TreeMapChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	this.m_seriesColorValueArr=[];
	this.m_seriesColorNameArr=[];
	var c = 0;
	for (var i = 0, length = this.getSeriesNames().length; i < length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
		if(this.m_hierarchyTypeArr[this.getSeriesNames()[i]] =="none"){
			this.m_seriesColorValueArr[c] = this.getDataFromJSON(this.getSeriesNames()[i]);
			this.m_seriesColorNameArr[c]=this.getSeriesNames()[i];
			this.m_leafNodeSeriesDataFlag =true;
			c++;
		}
		if(this.m_hierarchyTypeArr[this.getSeriesNames()[i]] =="parent")
			this.m_parentNodeSeriesDataFlag=true;
		if(this.m_hierarchyTypeArr[this.getSeriesNames()[i]] =="child")
			this.m_childNodeSeriesDataFlag=true;
	}
	
};
TreeMapChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	for (var i = 0, length = this.getCategoryNames().length; i < length; i++) {
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
};

TreeMapChart.prototype.drawChart = function () {
	var temp = this;
	this.ctx.clearRect(this.m_x, this.m_y, this.m_width, this.m_height);
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	var map = this.IsDrawingPossible();
	 if ( IsBoolean(map.permission) ){
		$("#treemapDiv" + this.m_objectid).remove();
		this.drawTreeMap();
	 }else{
		$("#treemapDiv" + this.m_objectid).remove();
		$("#draggableCanvas" + temp.m_objectid).css("display", "block");
		this.drawMessage(map.message);
	 }
};
TreeMapChart.prototype.IsDrawingPossible = function () {
	var map={};   
	if (!IsBoolean(this.m_isEmptySeries)){
		if(IsBoolean(this.m_leafNodeSeriesDataFlag) && !IsBoolean(this.m_parentNodeSeriesDataFlag) && !IsBoolean(this.m_childNodeSeriesDataFlag))
			map = {
					"permission" : "false",
					message : this.m_status.noParentChildData
				};
		else if(!IsBoolean(this.m_leafNodeSeriesDataFlag) && IsBoolean(this.m_parentNodeSeriesDataFlag) && IsBoolean(this.m_childNodeSeriesDataFlag))
			map = {
					"permission" : "false",
					message : this.m_status.noLeafNodeData
				};
		else
			map = {
					"permission" : "true",
					message : this.m_status.success
				};
	}
	else
		map = {
					"permission" : "false",
					message : this.m_status.noData
				};
	
	return map;
};

TreeMapChart.prototype.convertDataIntoJson = function (data, color, temp) {
	var newData = {};
	var color = color;
	var temp = temp;
	if (data) {
		newData = {
			name : "root",
			id : "node",
			size : [1],
			color : [1],
			value : 0,
			children : []
		};
		var levels = [];
		var levelsDisplayName = [];
		var leafNodeDetails = [];
		var leafNodeDisplayNameDetails = [];
		var colorNodeDatails = [];
		var AdditionalDataField = [];
		//	        var levels = ["Region","Country","States"];
		//	        var leafNodeDetails = ["Disease","size"];
		this.levels = [];
		this.leafNodeDetails = [];
		this.colorNodeDetails = [];
		for (var i = 0, length = this.m_seriesName.length; i < length; i++) {
			if (this.m_hierarchyTypeArr[this.m_seriesName[i]] == "parent" || this.m_hierarchyTypeArr[this.m_seriesName[i]] == "child") {
				levels.push(this.m_seriesName[i]);
				levelsDisplayName.push(this.m_displayNames[i]);
			} else {
				leafNodeDetails.push(this.m_seriesName[i]);
				leafNodeDisplayNameDetails.push(this.m_displayNames[i]);
				if (this.m_colorField[this.m_seriesName[i]] != ""){
					colorNodeDatails.push(this.m_colorField[this.m_seriesName[i]]);
				}
				AdditionalDataField.push(this.m_AdditionalDataField[this.m_seriesName[i]]);
			}
		}
		this.levels = levels;
		this.leafNodeDetails = leafNodeDetails;
		this.colorNodeDetails = colorNodeDatails;
		var nodeId = "node"; // For each data row, loop through the expected levels traversing the output tree
		data.forEach(function (d) { // Keep this as a reference to the current level
			var depthCursor = newData.children;
			var nod; // Go down one level at a time
			levels.forEach(function (property, depth) { // Look to see if a branch has already been created
				var index;
				depthCursor.forEach(function (child, i) {
					if (d[property] == child.name)
						index = i;
				});
				// Add a branch if it isn't there
				if (isNaN(index)) {
					var idd = (nod && nod.id) ? nod.id + "_" + depthCursor.length : nodeId + "_" + depthCursor.length;
					depthCursor.push({
						name : (d[property] !=undefined) ? d[property] : "",
						fieldname : levels[depth],
						fielddisplayname : levelsDisplayName[depth],
						id : idd,
						size : [0],
						color : [0],
						value : 0,
						leafnode : false,
						children : [],
						drillData : d
					});
					index = depthCursor.length - 1;
				}
				// Now reference the new child array as we go deeper into the tree
				nod = depthCursor[index];
				depthCursor = depthCursor[index].children;
				// This is a leaf, so add the last element to the specified branch
				if (depth === levels.length - 1) {
					var sum = 0;
					leafNodeDetails.forEach(function (leaf) {
						sum = sum * 1 + getNumericComparableValue(d[leaf]);
					});
					for (var x = 0, length = leafNodeDetails.length; x < length; x++) {
						var AdditionalData = [];
						var filterValue = (isNaN(d[leafNodeDetails[x]]))?removeCommaFromSrting(d[leafNodeDetails[x]]):(d[leafNodeDetails[x]]);
						var val = getNumericComparableValue(filterValue);
						if(!isNaN(val)){
							var val = getNumericComparableValue(filterValue);
						}else{
							var val = "";
						}
						var OriginalVal = ( d[leafNodeDetails[x]] );
						for(var z = 0; AdditionalDataField[x].length>z; z++){
							var fieldName = AdditionalDataField[x][z];
							AdditionalData.push( d[fieldName] );
						}
						var cval = getNumericComparableValue( d[colorNodeDatails[x]] );
						var leafNodeChildSeriesData = {
							id : nod.id + "_" + depthCursor.length + "_" + x,
							size : [val / sum],
							value : val,
							colorfield : colorNodeDatails[x],
							colorvalue : cval,
							color : [0],
							name : OriginalVal,
							// name:leafNodeDisplayNameDetails[x],
							leafnode : true,
							fieldname : leafNodeDetails[x],
							fielddisplayname : leafNodeDisplayNameDetails[x],
							AdditionalDataLabel : AdditionalData,
							drillData : d
						};
						depthCursor.push(leafNodeChildSeriesData);
					}
				}
			});
		});
	}
	function funcSum(child, level) {
		if (level > 0) {
			var parentSum = 0;
			for (var i = 0; i < child.length; i++) {
				var sum = funcSum(child[i].children, level - 1);
				child[i].value = sum;
				parentSum += sum * 1;
			}
			return parentSum;
		} else {
			var sum = 0;
			for (var i = 0; i < child.length; i++) {
				sum += (child[i].value) * 1;
			}
			return (isNaN(sum) || sum == undefined || sum == "") ? 0 : sum;
		}
	}
	var sum = funcSum(newData.children, levels.length);
	newData.value = sum;
	var maxRange = (this.m_maxRangeValue != 0) ? this.m_maxRangeValue : 0.1;
	var m_minrangecolor = this.m_minrangecolor;
	var m_maxrangecolor = this.m_maxrangecolor;
	var colorField = this.m_colorField;
	function getColorForValue1(d1) {
		var colorvalue1 = (d1.colorvalue != undefined) ? (d1.colorvalue) : (d1.value);
		return (colorvalue1 / maxRange) > 1 ? 1 : colorvalue1 / maxRange;
	}
	function getColorForValue2(d1) {
		var colorvalue1 = (d1.colorvalue != undefined) ? getNumericComparableValue(d1.colorvalue) : getNumericComparableValue(d1.value);
		for (var i = 0; i < color.length; i++) {
			/**DAS-678 @description value within range eg: value>min&&value<max */
			if (colorvalue1 >= color[i].min * 1 && colorvalue1 < color[i].max * 1) {
				if(IsBoolean(temp.m_showdynamicrange)){
					var c_value = (colorvalue1 - color[i].min) / (color[color.length - 1].max - color[i].min);
					c_value = (c_value > 1) ? 1 : c_value;
					return c_value;
					}
					else{
						return color[i].val;
					}
			}
		}
		/**DAS-678 setting defualt color for values that are not in range color */
		if (colorvalue1 < color[0].min * 1){
			if(IsBoolean(temp.m_showdynamicrange)){
				return color[0].val;
			}else{
				return m_minrangecolor;
			}
		}
		/**DAS-678 @description if dyanamic range enabled then return values from treecolormap array */
		if (colorvalue1 >= color[color.length - 1].max * 1){
			if(IsBoolean(temp.m_showdynamicrange)){
				return color[color.length - 1].val;
			}else{
				return m_maxrangecolor;
			}
		}
	}
	function funcSize(d) {
		if (d.children) {
			var parentVal = d.value;
			for (var i = 0; i < d.children.length; i++) {
				var d1 = d.children[i];
				d1.size = [(parentVal != 0) ? d1.value / parentVal : 0];
				d1.color = [getColorForValue1(d1)];
				funcSize(d1);
			}
		}
	}
	function funcSize1(d) {
		if (d.children) {
			var parentVal = d.value;
			for (var i = 0; i < d.children.length; i++) {
				var d1 = d.children[i];
				d1.size = [(parentVal != 0) ? d1.value / parentVal : 0];
				d1.color = [getColorForValue1(d1)];
				funcSize1(d1);
			}
		}
	}
	function funcSize2(d) {
		if (d.children) {
			var parentValue = d.value;
			var parentVal;
			for (var i = 0; i < d.children.length; i++) {
				var d1 = d.children[i];
				d1.size = [(parentValue != 0) ? d1.value / parentValue : 0];
				d1.color = [getColorForValue2(d1)];
				funcSize2(d1);
			}
		} else {
			maxval = (d.value * 1 >= maxval * 1) ? d.value * 1 : maxval * 1;
		}
	}
	if (levels.length >= 1 && leafNodeDetails.length > 1){
		/*Colors ot filling correctly for multilevel treemap*/
		// funcSize(newData);
		funcSize2(newData);
	}
	else if (leafNodeDetails.length == 1) {
	 parentVal = newData.value;
		var maxval = 1;
		funcSize2(newData);
		parentVal = maxval;
		funcSize2(newData);
	}
	return newData;
};
TreeMapChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};
TreeMapChart.prototype.drawTitle = function () {
	this.m_title.draw();
};
TreeMapChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};
TreeMapChart.prototype.setUnitSymbol = function () {
	this.m_unitSymbol = this.m_util.getFormatterSymbol(this.m_formater, this.m_unit);
	if (this.m_signposition == "") {
		this.m_signposition = "suffix";
	}
	this.m_isFormatter = false;
	if (this.m_formater != "none" && this.m_formater != "") {
		if (this.m_unit != "none" && this.m_unit != "") {
			this.m_isFormatter = true;
		}
	}
};
TreeMapChart.prototype.setSecondaryUnitSymbol = function () {
	this.m_secondaryUnitSymbol = this.m_util.getFormatterSymbol(this.m_secondaryformater, this.m_secondaryunit);
	this.m_secondaryFormatterPosition = "suffix";
	this.m_isSecondaryFormatter = false;
	if (this.m_secondaryformater != "none" && this.m_secondaryformater != "") {
		if (this.m_secondaryunit != "" && this.m_secondaryunit != "none") {
			this.m_isSecondaryFormatter = true;
		}
	}
};
TreeMapChart.prototype.addSecondaryFormater = function (text, secondaryUnitSymbol) {
	var textValue = text;
	if (this.m_precision != 0 && this.m_precision != null)
		textValue = this.setPrecision(textValue, this.m_precision);
	else if (textValue < 1 && textValue % 1 != 0)
		textValue = this.setPrecision(textValue, 2);
	try {
		eval("var formattedText = this.m_util.addUnitAs" + this.m_secondaryFormatterPosition + "(textValue,secondaryUnitSymbol);");
	} catch (e) {
		return formattedText.toString();
	}
	return formattedText.toString();
};
TreeMapChart.prototype.getFormattedText = function (data) {
	// added check for value is number or not otherwise return same string value
    var isCommaSeparated = (("" + data).indexOf(",") > 0) ? true : false;
	var text = getNumericComparableValue(data) * 1;
	if (!IsBoolean(this.getFixedLabel())) {
		if ((this.m_formater == "none" || this.m_formater == "") && (this.m_secondaryformater == "none" || this.m_secondaryformater == "") && (!IsBoolean(this.m_fixedlabel))) {
			text = this.setPrecision(text, this.m_precision);
		}
		if (!IsBoolean(this.m_isFormatter) && !IsBoolean(this.m_isSecondaryFormatter)) {
			text = this.setPrecision(text, this.m_precision);
		}
		if (IsBoolean(this.m_isSecondaryFormatter)) {
			text = this.m_util.updateTextWithFormatter(text, this.m_secondaryUnitSymbol, this.m_precision);
		}
		if (IsBoolean(this.m_isSecondaryFormatter)) {
			if (this.m_secondaryUnitSymbol != "auto")
				text = this.addSecondaryFormater(text, this.m_secondaryUnitSymbol);
			else {
				var symbol = getNumberFormattedSymbol(text * 1, this.m_unit);
				var val = getNumberFormattedNumericValue(text * 1, this.m_precision, this.m_unit);
				text = this.setPrecision(val, this.m_precision);
				text = this.addSecondaryFormater(text, symbol);
			}
		}
		if(!IsBoolean(this.m_isSecondaryFormatter)) {
			text = this.setPrecision(text, this.m_precision);
		}
	}
	if (isCommaSeparated || this.m_numberformatter === "number") {
		text = getFormattedNumberWithCommas(text, "number");
	} else {
		text = getFormattedNumberWithCommas(text, this.m_numberformatter);
	}
	if (IsBoolean(this.m_isFormatter) && this.m_unitSymbol != undefined) {
		text = this.m_util.addFormatter(text, this.m_unitSymbol, this.m_signposition);
	}
	return text;
};
TreeMapChart.prototype.setPrecision = function (text, precision) {
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
TreeMapChart.prototype.getCommaSeperator = function (text, name) {
	for (var i = 0, length = this.m_seriesDataForToolTip.length; i < length; i++) {
		for (var key in this.m_seriesDataForToolTip) {
			for (var key1 in this.m_seriesDataForToolTip[key]) {
				if (this.m_seriesDataForToolTip[key][key1] == name) {
					if (IsBoolean(this.m_seriesDataForToolTip[key]["flag"]))
						text = this.getNumberWithCommas(text);
				}
			}
		}
	}
	return text;
};
TreeMapChart.prototype.getFormatterForToolTip = function (data) {
	data = getNumericComparableValue(data);
	if (isNaN(data) || data == "" || data == undefined){
		return data;
	} else {
		var m_precision;
		if(this.m_tooltipprecision !== "default"){
			m_precision =  this.m_tooltipprecision;
		}else{
			m_precision = (data + "").split(".");
		    if (m_precision[1] !== undefined) {
		    	m_precision = m_precision[1].length;
		    } else {
		    	m_precision = 0;
		    }
		}
		m_precision = this.m_tooltipprecision;
		/** for story need to show the formatters in tooltip as they are not showing the values on cell **/
		if (IsBoolean(this.m_isSecondaryFormatter) && !IsBoolean(this.m_showcelltext)) {
			if (this.m_secondaryUnitSymbol != "auto") {
				try {
					data = this.m_util.updateTextWithFormatter(data, this.m_secondaryUnitSymbol, m_precision);
					//data = this.getLocaleWithPrecision(data * 1, m_precision);
					eval("data = this.m_util.addUnitAs" + this.m_secondaryFormatterPosition + "(data,this.m_secondaryUnitSymbol);");
				} catch (e) {}
			} else {
				var symbol = getNumberFormattedSymbol(data * 1, this.m_unit);
				data = getNumberFormattedNumericValue(data * 1, m_precision, this.m_unit);
				//data = this.getLocaleWithPrecision(data * 1, m_precision);
				eval("data = this.m_util.addUnitAs" + this.m_secondaryFormatterPosition + "(data,symbol);");
			}
		}else{
			/**DAS-732 */
			if (this.m_secondaryUnitSymbol != "auto") {
				try {
					data = this.m_util.updateTextWithFormatter(data, this.m_secondaryUnitSymbol, m_precision);
					//data = this.getLocaleWithPrecision(data * 1, m_precision);
					eval("data = this.m_util.addUnitAs" + this.m_secondaryFormatterPosition + "(data,this.m_secondaryUnitSymbol);");
				} catch (e) {}
			} else {
				var symbol = getNumberFormattedSymbol(data * 1, this.m_unit);
				data = getNumberFormattedNumericValue(data * 1, m_precision, this.m_unit);
				//data = this.getLocaleWithPrecision(data * 1, m_precision);
				eval("data = this.m_util.addUnitAs" + this.m_secondaryFormatterPosition + "(data,symbol);");
			}
		}
		if (IsBoolean(this.m_isFormatter) && this.m_unitSymbol != undefined) {
			return this.m_util.addFormatter(data, this.m_unitSymbol, this.m_signposition, m_precision);
		}
	}
	return data;
};
TreeMapChart.prototype.drawTreeMap = function () {
	var temp = this;
	var width = this.m_width * 1;
	var topMargin = (this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
	var height = this.m_height - topMargin;
	//Removing canvas if there is no title and subtitle
	if ((!IsBoolean(this.getShowGradient())) && (!IsBoolean(this.m_showmaximizebutton)) && (!IsBoolean(this.getTitle().m_showtitle)) && (!IsBoolean(this.m_subTitle.m_showsubtitle)))
		$("#draggableCanvas" + temp.m_objectid).css("display", "none");
	else
		$("#draggableCanvas" + temp.m_objectid).css("display", "block");
	//Removing treemapdiv before creating new div
	$("#treemapDiv" + temp.m_objectid).remove();
	var lmargin = (IsBoolean(this.m_updateddesign) ? 32 : 0);
	var div = document.createElement("div");
	div.id = "treemapDiv" + this.m_objectid;
	div.style.width = width + "px";
	div.style.height = height + "px";
	div.style.top = topMargin + "px";
	div.style.left = lmargin + "px";
	if (!IsBoolean(this.m_bootstrap)) {
		div.style.position = "absolute";
	}
	$("#draggableDiv" + temp.m_objectid).append(div);
	var mouseclickHandler = function (e, data) {
		this.getDrillData(e, data);
	};
	var mousetouchHandler = function (e, data) {
		if (("ontouchstart" in document.documentElement)&&(data!==undefined)) {
			this.getDrillData(e, data);
		}
	};
	var mousemoveHandler = function (e, data) {
		var temp = this;
		if (IsBoolean(temp.m_customtextboxfortooltip.dataTipType !== "None")) {
			if (!temp.m_designMode) {
				var toolTipData = temp.getToolTipData(data,e);
				if (temp.m_hovercallback && temp.m_hovercallback != "") {
					temp.drawCallBackContent(mouseX, mouseY, toolTipData);
				} else {
					temp.drawTooltipContent(toolTipData);
				}
			}
		}
	};
	var mouseleaveHandler = function () {
		//remove tooltip div
		$("#toolTipDiv").remove();
	};
	var currSizeOption = 1;
	var currColorOption = 1;
	var color = this.m_treeMapColorValue;
	var data = this.convertDataIntoJson(this.getSeriesDataForCommaSperator(this.getDataProvider()), color, temp);
	/**Added to check weather the view is desktop or not, to restrict event for touch.*/
	var desktopView = (detectDevice.mobile() || detectDevice.tablet()) ? false : true;
	var w = (IsBoolean(this.m_updateddesign) ? width - 64 : width);
	var h =(IsBoolean(this.m_updateddesign) ? height - 32 : height);
	$("#treemapDiv" + this.m_objectid).treemap({
		"dimensions" : [w, h],
		"desktopView" : desktopView,
		"singleClickTimer":null,
		"doubletapTimeout" : temp.m_doubletaptimeout,
		colorStops : color,
		leafNodeBodyStrokeLineWidth : temp.m_bodystrokecolorlinewidth,
		innerNodeHeaderHeightPx : (temp.getShowTextOnHeader()) ? (0) : (temp.fontScaling(temp.getLabelFontSize() * 1.8)),
		innerNodeHeaderGradient : function (ctx, rect, rgb) {
			return temp.m_headerbgcolor;
		},
		leafNodeBodyGradient : function (ctx, rect, rgb) {
			if ((rgb[0] == undefined) && (rgb[1] == undefined) && (rgb[2] == undefined)) {
			    var colorDefault = hex2rgb(temp.m_defaultfillcolor);
			    var vals = colorDefault.substring(colorDefault.indexOf('(') + 1, colorDefault.length - 1).split(', ');
			    rgb[0] = vals[0];
			    rgb[1] = vals[1];
			    rgb[2] = vals[2];
			}
			var gradient = TreemapUtils.rgb2hex(rgb);
			try {
				//To get correct gradient when all cell sizes are same
				//make linear gradient x,y -> x+width,y
				if(!isNaN(rect[0])&&!isNaN(rect[1])&&!isNaN(rect[2])&&!isNaN(rect[3])){
					gradient = ctx.createLinearGradient(rect[0], rect[1], rect[0] * 1 + rect[2] * 1, rect[3]);
					var color = hex2rgb(TreemapUtils.rgb2hex(rgb),temp.m_coloropacity);
					gradient.addColorStop(0, color);
					gradient.addColorStop(1, color);
				}
			} catch (e) {
				console.log(e);
			}
			return gradient;
		},
		leafNodeBodyStroke : function (ctx, rect, rgb) {
			return temp.m_bodystrokecolor;
		},
		innerNodeHeaderLabeller : function (ctx, rect, rgb, id) {
			var str = "";
			temp.headerNodeName = id;
			if(IsBoolean(temp.m_showparenttext)){
				str = id;
				if(id !== "" && !isNaN(id) && (temp.m_fieldByName.length > 0)){
					if(IsBoolean(temp.m_showparenttextformatter)){
						temp.getFormattedText(id)						
					}
				}								
			}
			ctx.rect(rect[0], rect[1], rect[2], rect[3]);
			ctx.clip();
			ctx.fillStyle = temp.m_celltextcolor;
			ctx.font = temp.getLabelFontProperties();
			ctx.textBaseline = "middle";
			var textLen = ctx.measureText(str).width;
			if (textLen <= rect[2])
				ctx.fillText(str, rect[0] + 5, rect[1] * 1 + rect[3] / 2);
		},
		leafNodeBodyLabeller : function (ctx, rect, rgb, id, id2) {
			var leafNodeText;
			var leafNodeSecondText = []; 
			var headerStr;
			/**Added to manage data label when position is center or bottom*/
			temp.m_copytext = "";
			leafNodeText = (IsBoolean(temp.m_showcelltext)) ? (id) : "";
			leafNodeSecondText = (IsBoolean(temp.m_showcelltext)) ? ((id2 !== undefined) ? id2 : []) : [];
			headerStr = (IsBoolean(temp.getShowTextOnHeader()) ? (temp.headerNodeName) : (leafNodeText));
			ctx.textBaseline = "top";
			ctx.rect(rect[0], rect[1], rect[2] + 5, rect[3]);
			ctx.clip();

			/** changes for not adding formatter for headers */ 
			try{
				ctx.fillStyle = temp.m_celltextcolor;
				ctx.font = temp.getLabelFontProperties();
				var txt = (headerStr !== "" && !isNaN(headerStr) && (temp.m_fieldByName.length > 0) && IsBoolean(temp.m_showparenttextformatter)) ? temp.getFormattedText(headerStr) : headerStr;
				var widthForTextLen = (temp.m_position == "center") ? rect[2]*3/4 : rect[2];
				var updateHeaderStr = temp.getUpdateText(txt, widthForTextLen, ctx.font);
				var existLength= updateHeaderStr.Text.length;
				var isSentenceCase = updateHeaderStr.isSentenceCase;
				var drawData = IsBoolean(isSentenceCase) ? ((existLength < 6) ? true : false) : ((existLength < 4) ? true : false);
				var Totallength = ((temp.m_position == "bottomleft")||(temp.m_position == "bottomright")) ? (existLength + leafNodeSecondText.length) : 0;
				if(IsBoolean(temp.m_showparentdatalabel) && (drawData)){
					for(var l= 0; existLength>l; l++){
						if(temp.m_copytext !== ""){
							updateHeaderStr.Text.pop();
							updateHeaderStr.Text.unshift(temp.m_copytext);
						}
						var textLen =  ctx.measureText( updateHeaderStr.Text[l] ).width;
						var level = ((temp.m_position == "bottomleft")||(temp.m_position == "bottomright")) ? (Totallength - l) : l;
						temp.labelPosition(temp, ctx, rect, updateHeaderStr.Text[l], textLen, level);
					}
				}
			}catch(e){
				console.log(e);
			}
			for (var k = 0; leafNodeSecondText.length > k; k++) {
				if(temp.m_copytext !== ""){
					leafNodeSecondText.pop();
					leafNodeSecondText.unshift(temp.m_copytext);
				}
			    leafNodeSecondText[k] = (leafNodeSecondText[k] !== "" && !isNaN(getNumericComparableValue(leafNodeSecondText[k]))) ? temp.getFormattedText(leafNodeSecondText[k]) : leafNodeSecondText[k];
			    var updateLeafNodeText = temp.getUpdateText(leafNodeSecondText[k], widthForTextLen, ctx.font);
			    updateLeafNodeText.Text[0] = (updateLeafNodeText.Text.length>1) ? updateLeafNodeText.Text[0].slice(0, -1) + '..' : updateLeafNodeText.Text[0];
			    var textLen1 = ctx.measureText(leafNodeSecondText[k]).width;
			    var widthForTextLen = (temp.m_position == "center") ? rect[2]*3/4 : rect[2];
			    /**BDD-618 : Added (existLength<4) this won't draw child field when parent field won't draw.*/
			        if ((temp.getShowTextOnHeader())&&(rect[2]>(15 + temp.m_leftpadding + temp.m_rightpadding))&&(existLength<4)) {
			                if ((temp.getLabelFontSize() * 2 + (rect[3]) / 2) <= rect[3] - temp.m_toppadding) {
			                    var Length = ((temp.m_position == "bottomleft")||(temp.m_position == "bottomright")) ? (leafNodeSecondText.length - k)  : ((existLength !== 0) ? existLength + k : k);
			                    var textLen1 = ( temp.m_copytext == "" ) ? ctx.measureText( updateLeafNodeText.Text[0] ).width : ctx.measureText( temp.m_copytext ).width;
			                    temp.labelPosition(temp, ctx, rect, updateLeafNodeText.Text[0], textLen1, Length);
			                }
			    }
			}
		},
		"sizeOption" : 0,
		"colorOption" : 0,
		"labelsEnabled" : true,
		"animationEnabled" : true,
		"animationDurationMs" : 2000,
		"nodeData" : data
	})
	.bind("treemapmousemove", mousemoveHandler.bind(temp))
	.bind("treemapclick", mouseclickHandler.bind(temp))
	.bind("treemaptouchstart", mousetouchHandler.bind(temp))/**Extension "treemap" need to use to enable any jQuery events.*/
	.bind("touchend", function() {})
	.mouseleave(function () {
		mouseleaveHandler()
	});
};

/**Added to get Drill Data*/
TreeMapChart.prototype.getDrillData = function(e, data){
	var temp = this;
	var nodes = data.nodes;
	var fieldNameValueMap = {};
	var color;
	for (var i = nodes.length - 1; i >= 0; i--) {
		if ((i == 0) && (IsBoolean(nodes[i].leafnode))) {
			for(var j = 0; temp.m_seriesName.length>j; j++){
				fieldNameValueMap[temp.m_allSeriesNames[j]] = nodes[i].drillData[temp.m_allSeriesNames[j]];
			}
			
			color = rgb2hex("rgb(" + nodes[i].computedColor[0] + "," + nodes[i].computedColor[1] + "," + nodes[i].computedColor[2] + ")");
		} else
			for(var j = 0; temp.m_allSeriesNames.length>j; j++){
				fieldNameValueMap[temp.m_allSeriesNames[j]] = nodes[i].drillData[temp.m_allSeriesNames[j]];
			}
	}
	var drillColor = (color != undefined) ? (color) : "";
	temp.updateDataPointsToGV( { "drillRecord":fieldNameValueMap, "drillColor":drillColor } );
};

/**Added for Text Alignment*/
TreeMapChart.prototype.labelPosition = function(temp, ctx, rect, Text, textLen, i) {
    var X;
    var Y;
    switch (temp.m_position) {
        case 'topleft':
            X = rect[0] + temp.m_leftpadding;
            Y = (rect[1] + (temp.getLabelFontSize() * 1 + temp.m_toppadding) * i) + temp.m_toppadding;
            if (Y < (rect[1] + rect[3] - this.m_bottompadding - temp.getLabelFontSize() * 1)) {
                ctx.fillText(Text, X, Y);
            }
            break;
        case 'topright':
            X = rect[0] + (rect[2]) - textLen - temp.m_leftpadding;
            Y = ((rect[1]) + (temp.getLabelFontSize() * 1 + temp.m_toppadding) * i) + temp.m_toppadding;
            if (Y < (rect[1] + rect[3] - this.m_bottompadding - temp.getLabelFontSize() * 1)) {
                ctx.fillText(Text, X, Y);
            }
            break;
        case 'bottomleft':
            X = rect[0] + temp.m_leftpadding;
            Y = ((rect[1] + (rect[3]) - (temp.getLabelFontSize() * 1 + temp.m_toppadding) * i - temp.m_toppadding)) - temp.m_toppadding;
            if (Y > (rect[1] + this.m_toppadding + temp.getLabelFontSize() * 1)) {
            	var drawText = (temp.m_copytext === "") ? Text : temp.m_copytext;
                ctx.fillText(drawText, X, Y);
                temp.m_copytext = "";
            }else{
            	temp.m_copytext = Text;
            }
            break;
        case 'bottomright':
            X = rect[0] + (rect[2]) - textLen - temp.m_leftpadding;
            Y = ((rect[1] + ((rect[3])) - (temp.getLabelFontSize() * 1 + temp.m_toppadding) * i - temp.m_toppadding)) - temp.m_toppadding;
            if (Y > (rect[1] + this.m_toppadding + temp.getLabelFontSize() * 1)) {
            	/**This will draw first value of text on the drawing position*/
            	var drawText = (temp.m_copytext === "") ? Text : temp.m_copytext;
            	ctx.textAlign = "left";
                ctx.fillText(drawText, X, Y);
                temp.m_copytext = "";
            }else{
            	/**To store top value or first value of text*/
            	temp.m_copytext = Text;
            }
            break;
        default:
            X = rect[0] + (rect[2] / 2);
            Y = (rect[1] + ((rect[3]) / 2) - temp.getLabelFontSize() * 1) + (temp.getLabelFontSize() * 1 + temp.m_toppadding) * i;
            if ((Y < (rect[1] + rect[3] - this.m_bottompadding - temp.getLabelFontSize() * 1)) && (Y > (rect[1] + this.m_toppadding + temp.getLabelFontSize() * 1))) {
            	var drawText = (temp.m_copytext === "") ? Text : temp.m_copytext;
            	ctx.textAlign = "center";
                ctx.fillText(drawText, X, Y);
                temp.m_copytext = "";
            }else{
            	temp.m_copytext = Text;
            }
    }
};


TreeMapChart.prototype.getUpdateText = function (text1, textWidth, ctxFont) {
	var text = (""+text1);
	var newText = "";
	var textArr = [];
	this.ctx.font = ctxFont;
	var count = 0 ;
	var strWidth = this.ctx.measureText(text).width;
	var appendedTextWidth = (text.length > 0) ? (strWidth / text.length) : 0;
	var SentenceCaseArr = text.split(' ');
	for (var i = 0, length = text.length; i < length; i++) {
		if (this.ctx.measureText(newText).width < (textWidth - appendedTextWidth - (this.m_leftpadding+this.m_rightpadding))) {
			newText += text[i];
			if(this.ctx.measureText(newText).width >= (textWidth - appendedTextWidth - (this.m_leftpadding+this.m_rightpadding))&&(isNaN(text1))){
				var finalText = (i==length-1) ? newText : newText+"-";
				textArr.push(finalText);
				newText = "";
			}
			if((i+1==length)&&(newText!=="")){
				textArr.push(newText);
			}
			count++;
		} else {
				newText = (newText !== "") ? newText + ".." : newText;
				textArr.push(newText);
				break;
		}
	}
	textArr = ((textArr.length==0)&&(text1.length>0)) ? textArr.push(text1) : textArr;
	var isSentenceCase = (SentenceCaseArr.length > 1) ? true : false;
	return {"Text" : textArr, "noOfWord" : count, "isSentenceCase" : isSentenceCase};
};

TreeMapChart.prototype.getwidthForTextLen = function (width,textWidth) {
	var middleWidth = width/2;
	var textPos = (middleWidth - textWidth/2);
	var perWidth = middleWidth - textPos;
	
	return (width - perWidth*2); //calculate width of text drawing area ...
};

TreeMapChart.prototype.getToolTipData = function (data,e) {
	var nodes = data.nodes;
	var ids = data.ids;
	var toolTipData = {};
	if (IsBoolean(this.m_customtextboxfortooltip.dataTipType == "Default")) {
		toolTipData.cat = "";
		toolTipData.data = new Array();
		for (var i = nodes.length - 1; i >= 0; i--) {
			var data = [];
			if (i == 0) {
				data = [];
				if(	nodes[i].colorfield === undefined && nodes[i].leafnode){
					data.push( "rgb(" + nodes[i].computedColor[0] + "," + nodes[i].computedColor[1] + "," + nodes[i].computedColor[2] + ")" );
				}
				data.push( nodes[i].fielddisplayname );
				data.push( (nodes[i].leafnode) ? this.getUpdatedFormatterForToolTip( nodes[i].value, nodes[i].fielddisplayname ) : nodes[i].name );	
				toolTipData.data.push(data);
				if (nodes[i].leafnode && nodes[i].colorfield) {
					var field = ((nodes[i].colorfield != undefined)) ? (nodes[i].colorfield) : (nodes[i].fielddisplayname);
					data = [];
					data.push( "rgb(" + nodes[i].computedColor[0] + "," + nodes[i].computedColor[1] + "," + nodes[i].computedColor[2] + ")" );
					data.push(field);
					data.push( this.getFormatterForToolTip( ((nodes[i].colorvalue != undefined)) ? (nodes[i].colorvalue) : (nodes[i].value) ) );
					toolTipData.data.push(data);
				}
			} else {
				data.push( nodes[i].fielddisplayname );
				data.push( nodes[i].name );
				toolTipData.data.push(data);
			}
		}
	}else{
		toolTipData = nodes[0].drillData;
	}
	return toolTipData;
};
TreeMapChart.prototype.drawTooltipContent = function (toolTipData) {
	this.m_tooltip.draw(toolTipData, this.m_componenttype);
};
TreeMapChart.prototype.getShowTextOnHeader = function () {
	if ((this.levels.length == 1))
		return true;
	else
		false;
};
TreeMapChart.prototype.getLabelFontProperties = function () {
	return this.m_textUtil.getFontProperties(this.getLabelFontStyle(), this.getLabelFontWeight(), this.fontScaling(this.getLabelFontSize()), this.getLabelFontFamily());
};
TreeMapChart.prototype.getLabelFontStyle = function () {
	return this.m_celltextfontstyle;
};
TreeMapChart.prototype.getLabelFontWeight = function () {
	return this.m_celltextfontweight;
};
TreeMapChart.prototype.getLabelFontSize = function () {
	return this.m_celltextfontsize;
};
TreeMapChart.prototype.getLabelFontFamily = function () {
	return this.m_celltextfontfamily;
};
TreeMapChart.prototype.getStartY = function () {
	return (this.m_y) * 1 + (this.m_height) * 1;
};
TreeMapChart.prototype.getEndX = function () {
	return 1 * (this.m_x) + 1 * (this.m_width);
};
TreeMapChart.prototype.getStartX = function () {
	return this.m_x;
};
TreeMapChart.prototype.getEndY = function () {
	return (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};
TreeMapChart.prototype.getMarginForTitle = function () {
	if ((!IsBoolean(this.getShowGradient())) && (!IsBoolean(this.m_showmaximizebutton)) && (!IsBoolean(this.getTitle().m_showtitle)))
		return 0;
	else
		return (this.getTitleBarHeight() * 1 + this.getTitleToSubtitleMargin() * 1);
};
TreeMapChart.prototype.getMarginForSubTitle = function () {
	if(IsBoolean(this.m_subTitle.m_showsubtitle) && IsBoolean(this.m_enablehtmlformate.subtitle)){
		return $("#subTitle" + this.m_objectid).height();
	} else if (IsBoolean(this.m_subTitle.m_showsubtitle) && this.m_subTitle.m_formattedDescription.length == 3){
		return margin = (this.m_subTitle.getDescription() != "") ? (this.m_subTitle.getFontSize() * 3) + (this.m_chartpaddings.bottomBorderToDescription * 1) : 10;
	} else if (IsBoolean(this.m_subTitle.m_showsubtitle))
		return (this.m_subTitle.getDescription() != "") ? (this.m_subTitle.getFontSize() * 1.5) : 0;
	else
		return 0;
};

TreeMapChart.prototype.getDataPointAndUpdateGlobalVariable = function (mouseX, mouseY) {
	//Written in mouseClickHandler
};
TreeMapChart.prototype.drawTooltip = function (mouseX, mouseY) {
	//Written in mousemovehandler;
};
//# sourceURL=TreeMapChart.js
