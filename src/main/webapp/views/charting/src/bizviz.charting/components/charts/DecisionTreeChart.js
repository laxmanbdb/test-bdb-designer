/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: DecisionTreeChart.js
 * @description DecisionTreeChart
 **/
function DecisionTreeChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();
	this.m_x = 20;
	this.m_y = 320;
	this.m_width = 300;
	this.m_height = 260;
	this.m_seriesNames = [];
	this.m_seriesData = [];
	this.m_fillopacity = 0.5;
	this.fieldNameArr = [];
	this.m_visibleArr = [];
	this.m_widthArr = [];
	this.m_textAlignArr = [];
	this.m_flipxy = 0;
	this.m_labellinespacing = 30;
	this.m_cornerrounding = 10;
	this.m_labelpadding = 12;
	this.m_arrowheadsize = 5;
	this.m_arrowsup = 0;
	this.m_siblinggap = 1;

	this.m_idealsiblinggap = 0.1;
	this.m_minimumcousingap = 2;
	this.m_idealcousingap = 1;
	this.m_levelsgap = 0.8;
	this.m_minimumdepth = 2;
	this.m_minimumbreadth = 2;
	this.m_drawroot = false;
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_percentlayout = false;
	this.m_boxwidth = 100;
	this.m_boxheight = 50;
	this.DTSVG = "";
	this.DTGROUP = "";
	this.m_fieldtypes = ["Name", "condition", "depth", "nodeID", "probability","numberOfItems"];
	this.m_showborder = true;
	this.m_canvastype = "svg";
};

DecisionTreeChart.prototype = new Chart();

DecisionTreeChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas(); //create draggable div
};

DecisionTreeChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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

DecisionTreeChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

DecisionTreeChart.prototype.initializeDraggableDivAndCanvas = function () {
	var temp = this;
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.m_draggableDiv.style.overflow = "auto";
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
/*---------------------- Added Code --------------------------*/	
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
	this.divScrollEvent();
/*---------------------- Till Here ---------------------------*/
	this.createSVG();
	$("#draggableCanvas" + this.m_objectid).hide();
};

DecisionTreeChart.prototype.divScrollEvent = function () {
	var temp = this;
	var dragDivContainer = this.getDragableDiv();
	dragDivContainer.scroll(function() {
		if(IsBoolean(temp.m_showmaximizebutton)){
			var sWidth = dragDivContainer.find('svg').width() - dragDivContainer.width()
			var scrollWidth = Math.min(sWidth, dragDivContainer.scrollLeft());
			$("#minmaxImage" + temp.m_objectid)[0].style.left = (dragDivContainer.width() - $("#minmaxImage" + temp.m_objectid).width() - 5 + scrollWidth)+"px";
		}
	});
};
DecisionTreeChart.prototype.getDragableDiv = function () {
	var temp = this;
	return $("#draggableDiv" + temp.m_objectid);
};
DecisionTreeChart.prototype.createSVG = function () {
	var temp = this;
	this.svgContainerId = "svgContainer" + temp.m_objectid;
	$("#" + temp.svgContainerId).remove();
	temp.DTSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	temp.DTSVG.setAttribute("xlink", "http://www.w3.org/1999/xlink");
	temp.DTSVG.setAttribute("width", this.m_width);
	temp.DTSVG.setAttribute("height", this.m_height);
	temp.DTSVG.setAttribute("id", this.svgContainerId);
	$("#draggableDiv" + temp.m_objectid).append(temp.DTSVG);
};
DecisionTreeChart.prototype.createSVGBodyElement = function () {
	var temp = this;
	var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

	var marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
	marker.setAttribute("id", "arrowHead");
	marker.setAttribute("viewBox", "-10 -5 10 10");

	marker.setAttribute("markerUnits", "strokeWidth");
	marker.setAttribute("markerWidth", "6");
	marker.setAttribute("markerHeight", "5");
	marker.setAttribute("orient", "auto");

	var path = document.createElementNS("http;//www.w3.org/2000/svg", "path");
	marker.appendChild(path);
	path.setAttribute("d", "M -10 -5 L 0 0 L -10 5 z");

	temp.DTGROUP = document.createElementNS("http://www.w3.org/2000/svg", "g");
	temp.DTGROUP.setAttribute("id", "DTGROUP" + temp.m_objectid);

	temp.DTSVG.appendChild(defs);
	temp.DTSVG.appendChild(temp.DTGROUP);
	defs.appendChild(marker);
};

DecisionTreeChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

DecisionTreeChart.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	this.setSeries(fieldsJson);
};

DecisionTreeChart.prototype.setSeries = function (seriesJson) {

	var types = this.m_fieldtypes;
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_allSeriesDisplayNames = [];
	this.m_allSeriesNames = [];
	this.m_seriesVisibleArr = [];
	this.m_reqSeriesVisibleArr = [];
	this.m_seriesNamesWithType=[];
	this.m_numberOfItems=[];
	for (var j = 0; j < this.m_fieldtypes.length; j++) {
		this.m_reqSeriesVisibleArr[this.m_fieldtypes[j]] = {};
		this.m_reqSeriesVisibleArr[this.m_fieldtypes[j]]["visible"] = false;
		for (var i = 0; i < seriesJson.length; i++) {
			var type = this.getProperAttributeNameValue(seriesJson[i], "Type");
			var visiblity = this.getProperAttributeNameValue(seriesJson[i], "visible");
			var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
			this.m_allSeriesDisplayNames[i] = m_formattedDisplayName;
			this.m_allSeriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
			this.m_seriesVisibleArr[this.m_allSeriesNames[i]] = visiblity;
			if (IsBoolean(visiblity)) {
				if (this.m_fieldtypes[j] == type) {
					this.m_reqSeriesVisibleArr[this.m_fieldtypes[j]]["visible"] = true;
					this.m_seriesNames.push(this.getProperAttributeNameValue(seriesJson[i], "Name"));
					var serName = this.getProperAttributeNameValue(seriesJson[i], "Name");
					this.m_seriesDisplayNames.push(m_formattedDisplayName);
					this.m_seriesNamesWithType[serName] = type;
					if(type == "numberOfItems")
						this.m_numberOfItems.push(this.getProperAttributeNameValue(seriesJson[i], "Name"));
					if (type != "probability")
						break;
					//break;
				}
			}
		}
	}
};
DecisionTreeChart.prototype.getAllFieldsName = function () {
	return this.m_allSeriesDisplayNames;
};

DecisionTreeChart.prototype.setNumberOfItems = function () {
	this.m_numberOfItemsArray = this.m_numberOfItems;
};

DecisionTreeChart.prototype.getNumberOfItems = function () {
	return this.m_numberOfItemsArray;
};

DecisionTreeChart.prototype.setProbabilityDisplayName = function () {
	this.m_seriesProbabilityArray = [];
	this.m_seriesProbabilityDisplayArray = [];
	for(var i = 0 ; i < this.m_seriesNames.length ; i++){
		if(this.m_seriesNamesWithType[this.m_seriesNames[i]] == "probability"){
			this.m_seriesProbabilityArray.push(this.m_seriesNames[i]);
			this.m_seriesProbabilityDisplayArray.push(this.m_seriesDisplayNames[i]);
		}
	}
};

DecisionTreeChart.prototype.getProbabilityDisplayName = function () {
	return this.m_seriesProbabilityArray;
};

DecisionTreeChart.prototype.setDisplayName = function () {
	this.m_displayName = this.m_seriesDisplayNames[0];
};

DecisionTreeChart.prototype.setDisplayCondition = function () {
	this.m_displaycondition = this.m_seriesDisplayNames[1];
};

DecisionTreeChart.prototype.setDisplayDepth = function () {
	this.m_displaydepth = this.m_seriesDisplayNames[2];
};

DecisionTreeChart.prototype.setDisplayNodeID = function () {
	this.m_displaynodeid = this.m_seriesDisplayNames[3];
};

DecisionTreeChart.prototype.setDisplayFirstProbabilityField = function () {
	this.m_displayfirstprobabilityfield = this.m_seriesDisplayNames[4];
};

DecisionTreeChart.prototype.setDisplaySecondProbabilityField = function () {
	this.m_displaysecondprobabilityfield = this.m_seriesDisplayNames[5];
};
DecisionTreeChart.prototype.setDisplayItems = function () {
	this.m_displayitemsfield = this.m_seriesDisplayNames[6];
};

DecisionTreeChart.prototype.getDisplayName = function () {
	return this.m_displayName;
};

DecisionTreeChart.prototype.getDisplayCondition = function () {
	return this.m_displaycondition;
};

DecisionTreeChart.prototype.getDisplayDepth = function () {
	return this.m_displaydepth;
};

DecisionTreeChart.prototype.getDisplayNodeID = function () {
	return this.m_displaynodeid;
};

DecisionTreeChart.prototype.getDisplayFirstProbabilityField = function () {
	return this.m_displayfirstprobabilityfield;
};

DecisionTreeChart.prototype.getDisplaySecondProbabilityField = function () {
	return this.m_displaysecondprobabilityfield;
};
DecisionTreeChart.prototype.getDisplayItems = function () {
	return this.m_displayitemsfield;
};

DecisionTreeChart.prototype.setName = function () {
	this.m_fieldName = this.m_seriesNames[0];
};

DecisionTreeChart.prototype.setCondition = function () {
	this.m_condition = this.m_seriesNames[1];
};

DecisionTreeChart.prototype.setDepth = function () {
	this.m_depth = this.m_seriesNames[2];
};

DecisionTreeChart.prototype.setNodeID = function () {
	this.m_nodeid = this.m_seriesNames[3];
};

DecisionTreeChart.prototype.setFirstProbabilityField = function () {
	this.m_firstprobabilityfield = this.m_seriesNames[4];
};


DecisionTreeChart.prototype.setSecondProbabilityField = function () {
	this.m_secondprobabilityfield = this.m_seriesNames[5];
};

DecisionTreeChart.prototype.setProbabilityRectColors = function () {
	
	//this.m_probabilityColorArray = [];
	this.m_probabilityColorArray = this.m_prababilityrectcolors.split(",");
};

DecisionTreeChart.prototype.getDisplayName = function () {
	return this.m_displayName;
};

DecisionTreeChart.prototype.getCondition = function () {
	return this.m_condition;
};
DecisionTreeChart.prototype.getName = function () {
	return this.m_fieldName;
};

DecisionTreeChart.prototype.getNodeID = function () {
	return this.m_nodeid;
};

DecisionTreeChart.prototype.getDepth = function () {
	return this.m_depth;
};

DecisionTreeChart.prototype.setBottomPercentField = function () {
	this.m_bottompercentfield = "percentValue";
};

DecisionTreeChart.prototype.setDisplayBottomPercentField = function () {
	this.m_displaybottompercentfield = "% Value";
};

DecisionTreeChart.prototype.getDisplayBottomPercentField = function () {
	return this.m_displaybottompercentfield;
};

DecisionTreeChart.prototype.getBottomPercentField = function () {
	return this.m_bottompercentfield;
};
DecisionTreeChart.prototype.getFirstProbabilityField = function () {
	return this.m_firstprobabilityfield;
};
DecisionTreeChart.prototype.getSecondProbabilityField = function () {
	return this.m_secondprobabilityfield;
};
DecisionTreeChart.prototype.getItems = function () {
	return this.m_items;
};

DecisionTreeChart.prototype.getParent = function (nodeId) {
	var p_Id;
	for (var i = 1; i < this.m_binaryTreeArray.length; i++) {
		for (var j = 0; j < this.m_binaryTreeArray[i].length; j++) {
			if (nodeId == 1)
				p_Id = null;
			if (nodeId == this.m_binaryTreeArray[i][j])
				p_Id = i;
		}
	}
	return p_Id;
};

DecisionTreeChart.prototype.getMaximumDepth = function (serObj) {
	var max = 0;
	for (var i = 0; i < serObj.length; i++)
		if (max < serObj[i][this.getDepth()])
			max = serObj[i][this.getDepth()];
	return max;
};

DecisionTreeChart.prototype.getNumberOfNode = function (depth) {
	var n = 1;
	for (var i = 0; i <= depth; i++)
		n = n * 2;
	return n;
};

DecisionTreeChart.prototype.getDataFromJSON = function () {
	var data = [];
	for (var i = 0; i < this.getDataProvider().length; i++) {
		if (this.getDataProvider()[i] == undefined || this.getDataProvider()[i] == "undefined")
			data[i] = "";
		else
			data[i] = this.getDataProvider()[i];
	}
	return data;
};
DecisionTreeChart.prototype.getUpateSeriesData = function (serObj, noOfNode) {
	var arr = [];
	var count = 1;
	for (var i = 1; i <= noOfNode; i++) {
		for (var j = 0; j < serObj.length; j++) {
			if (i == serObj[j][this.getNodeID()]) {
				serObj[j]["id"] = i;
				arr[count] = serObj[j];
				break;
			} else
				arr[count] = 0;
		}
		count++;
	}
	return arr;
};

DecisionTreeChart.prototype.getDepthArray = function (depth) {
	var arr = [];
	var c = 1;
	for (var i = 0; i < (depth * 1) + 1; i++) {
		arr[i] = [];
		for (var j = 0; j < Math.pow(2, i); j++) {
			arr[i][j] = this.m_seriesData[c++];
		}
	}
	var newArray = [];
	for (var i = 0; i < arr.length; i++) {
		newArray[i] = [];
		for (var j = 0; j < arr[i].length; j++) {
			if (arr[i][j][this.getNodeID()] != "")
				newArray[i][j] = arr[i][j];
			else
				newArray[i][j] = 0;
		}
	}
	return newArray;
};

DecisionTreeChart.prototype.getBinaryArray = function (seriesObj, depth) {
	var ser = [];
	var c = 1;
	for (var i = 1; i < seriesObj.length; i++) {
		if (c < seriesObj.length) {
			ser[i] = [(c + 1), (c + 2)];
			c = c + 2;
		}
	}
	return ser;
};

DecisionTreeChart.prototype.setParentIDs = function (binaryArr, max) {
	for (var i = 0; i < binaryArr.length; i++) {
		for (var j = 0; j < binaryArr[i].length; j++) {
			if (typeof binaryArr[i][j] == "object")
				var id = this.getParent(binaryArr[i][j][this.getNodeID()]);
			binaryArr[i][j]["p_id"] = id;
		}
	}
};

DecisionTreeChart.prototype.getSingleArray = function (binaryArr, max) {
	var binaryObj = [];
	var a = [];
	var c = 0;
	for (var i = 0; i < binaryArr.length; i++) {
		for (var j = 0; j <= binaryArr[i].length; j++) {
			if (binaryArr[i][j] != 0 && binaryArr[i][j] != undefined) {
				binaryObj[c] = binaryArr[i][j];
				c++;
			}
		}
	}
	return binaryObj;
};

DecisionTreeChart.prototype.setHierarchicalObjectForm = function (OriginalObj) {
	this.m_map = {};
	var arrayObj = (OriginalObj);
	for (var i = 0; i < arrayObj.length; i++) {
		var obj = arrayObj[i];
		obj.label = "";
		obj.children = [];
		obj.parent = [];
		this.m_map[obj[this.getNodeID()]] = obj;
		var parentID = obj.p_id || "-";
		if (!this.m_map[parentID]) {
			this.m_map[parentID] = {
				label : "root",
				parent : "",
				children : []
			};
		}
		this.m_map[parentID].children.push(obj);
		obj.parent = this.m_map[parentID];
		obj.label = "" + obj[this.getNodeID()];
	}
};

DecisionTreeChart.prototype.init = function () {

	//this.m_designMode = false
	this.checkValidConfiguration();
	this.m_seriesData = this.getDataFromJSON();
	this.isSeriesDataEmpty();
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);
	if ((IsBoolean(this.isValidConfig)) && (!IsBoolean(this.m_isEmptySeries))) {
		this.setName();
		this.setDisplayName();
		this.setCondition();
		this.setNodeID();
		this.setDepth();
		this.setBottomPercentField();
		this.setProbabilityDisplayName();
		this.setFirstProbabilityField();
		this.setSecondProbabilityField();
		this.setDisplayCondition();
		this.setDisplayNodeID();
		this.setDisplayDepth();
		this.setNumberOfItems();
		this.setProbabilityRectColors();
		this.setDisplayBottomPercentField();
		this.setDisplayFirstProbabilityField();
		this.setDisplaySecondProbabilityField();
		this.setDisplayItems();
		var maxDepth = this.getMaximumDepth(this.m_seriesData);
		var numberOfNode = this.getNumberOfNode(maxDepth);
		this.m_seriesData = this.getUpateSeriesData(this.m_seriesData, numberOfNode);
		this.m_depthArray = this.getDepthArray(maxDepth);
		this.m_binaryTreeArray = this.getBinaryArray(this.m_seriesData, maxDepth);
		this.setParentIDs(this.m_depthArray);
		this.m_binaryTreeObject = this.getSingleArray(this.m_depthArray, numberOfNode);
		this.setHierarchicalObjectForm(this.m_binaryTreeObject);
		this.setMakeLevels(this.getHierarchicalObjectForm(), this.m_drawroot);
		this.setPercentValue(this.getMakeLevels());
	}
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
	this.m_percentfillcolor = hex2rgb(this.m_percentcolor, this.m_opacity);
};

DecisionTreeChart.prototype.getMakeLevels = function () {
	return this.m_levels;
};

DecisionTreeChart.prototype.getHierarchicalObjectForm = function () {
	if(this.m_map["-"]){
		return this.m_map["-"];
	}else{
		return {children:[]};
	}
};

DecisionTreeChart.prototype.checkValidConfiguration = function () {
	this.isValidConfig = true;
	for (var j = 0; j < this.m_fieldtypes.length - 2; j++) {
		if (!IsBoolean(this.m_reqSeriesVisibleArr[this.m_fieldtypes[j]]["visible"]))
			this.isValidConfig = false;
	}
};

DecisionTreeChart.prototype.clear = function (node) {
	while (node.childNodes.length > 0)
		node.removeChild(node.childNodes[0]);
};

/*DecisionTreeChart.prototype.setPercentValue = function (levels) {
	for (var i = 0; i < levels.length; i++) {
		for (var j = 0; j < levels[i].length; j++) {
			for (var k = 0; k < levels[i][j].length; k++) {
				var childObj = levels[i][j][k];
				childObj[this.getBottomPercentField()] = "";
				if (childObj[this.getCondition()] == "root" && childObj.p_id == null)
					childObj[this.getBottomPercentField()] = 100;
				else{
					if(this.m_numberOfItems.length == 0)
						childObj[this.getBottomPercentField()] = (k == 0) ? (((childObj.parent[this.getFirstProbabilityField()]) * 100).toFixed(4)) : (((childObj.parent[this.getSecondProbabilityField()]) * 100).toFixed(4));
					else
						childObj[this.getBottomPercentField()] = ((childObj[this.getNumberOfItems()]/childObj.parent[this.getNumberOfItems()])*100).toFixed(4);
				}
				if(childObj.percentValue == "NaN")
				{
					childObj.percentValue = "0.0000";
				}
			}
		}
	}
};
*/
DecisionTreeChart.prototype.setPercentValue = function (levels) {
	var parNoItem =1;
	var firstProbField = 0;
	var secondProbField = 0;
	var rootData;
	for (var i = 0; i < levels.length; i++) {
		for (var j = 0; j < levels[i].length; j++) {
			for (var k = 0; k < levels[i][j].length; k++) {
				var childObj = levels[i][j][k];
				childObj[this.getBottomPercentField()] = "";
				if (childObj[this.getCondition()] == "root" && childObj.p_id == null){
					rootData = childObj[this.getNumberOfItems()];
					childObj[this.getBottomPercentField()] = (this.m_numberOfItems.length == 0)?"":100;
				}else{
					if(this.m_numberOfItems.length == 0){
						/*firstProbField = ((childObj.parent[this.getFirstProbabilityField()] == undefined) ||(childObj.parent[this.getFirstProbabilityField()]) == "") ? 0 : childObj.parent[this.getFirstProbabilityField()];
						secondProbField = ((childObj.parent[this.getSecondProbabilityField()] == undefined) || (childObj.parent[this.getSecondProbabilityField()]) == "") ? 0 : childObj.parent[this.getSecondProbabilityField()];
						childObj[this.getBottomPercentField()] = (k == 0) ? ((firstProbField * 100).toFixed(4)) : ((secondProbField * 100).toFixed(4));*/
					}else{
						//parNoItem = ((childObj.parent[this.getNumberOfItems()] == undefined) ||(childObj.parent[this.getNumberOfItems()] == "")) ? 100 : childObj.parent[this.getNumberOfItems()];
						parNoItem = rootData;
						/*Calculating percentage according to root element's number of item instead of its immediate parent */
						childObj[this.getBottomPercentField()] = ((childObj[this.getNumberOfItems()]/parNoItem)*100).toFixed(4);
					}
				}
			}
		}
	}
};

DecisionTreeChart.prototype.drawChart = function () {
	this.drawChartFrame();
	this.m_title.draw();
	this.m_subTitle.draw();
	this.createSVGBodyElement();
	if (!IsBoolean(this.m_isEmptySeries)) {
		if (IsBoolean(this.isValidConfig)) {
			this.drawTreeDiagram();
		} else
			this.drawSVGMessage("Invalid chart configuration");
	} else{
		this.drawSVGMessage(this.m_status.noData);
	}
};

DecisionTreeChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawSVGFrame();
};
/** @description overrite drawObject Method  because of ChartFrame and Titles are drawn on SVG  **/
DecisionTreeChart.prototype.drawObject = function () {
	this.drawSVGObject();
};

DecisionTreeChart.prototype.drawTreeDiagram = function () {
	var temp = this;
	var tree = this.getHierarchicalObjectForm();
	this.clear(temp.DTGROUP);
	var levels = this.getMakeLevels();
	var fixedLevel = -1;
	var spacings = [];
	var widths = [];
	for (var i = 0; i != levels.length; i++) {
		var level = levels[i];
		var spacing = 0;
		var nodesWidth = 0;
		var groupSpacing = 0;
		for (var j = 0; j != level.length; j++) {
			spacing += groupSpacing;
			var group = level[j];
			nodesWidth += group.length;
			spacing += (group.length - 1) * this.m_siblinggap * 1;
			groupSpacing = this.m_minimumcousingap * 1;
		}
		var width = spacing + nodesWidth;
		if (fixedLevel == -1 || width > widths[fixedLevel])
			fixedLevel = i;
		widths.push(width);
		spacings.push(spacing);
	}

	var maxWidth = Math.max(widths[fixedLevel],
			this.m_minimumbreadth * (1 + this.m_levelsgap * 1))
		var level = levels[fixedLevel];
	// Use any extra space to increase group gap up to ideal gap...
	var usesiblingGap = this.m_siblinggap * 1;
	var spare = (maxWidth - widths[fixedLevel]);
	var useCousinGap = this.m_minimumcousingap * 1;
	if (level.length > 1) {
		var spareForGroupGaps = Math.min(spare / (level.length - 1),
				(this.m_idealcousingap * 1 - this.m_minimumcousingap * 1));
		spare -= spareForGroupGaps * (level.length - 1);
		useCousinGap += spareForGroupGaps;
	}
	// ... any left is used to center the fixed group.
	var x = spare / 2;

	for (var i = 0; i != level.length; i++) {
		var group = level[i];
		var nodeSpacing = 0;
		for (var j = 0; j != group.length; j++) {
			x += nodeSpacing;
			var node = group[j];
			node.x = x;
			x += 1;
			nodeSpacing = usesiblingGap;
		}
		x += useCousinGap;
	}

	// Fixed to top; parent to average of children.
	for (var i = fixedLevel - 1; i >= 0; i--) {
		var level = levels[i];
		// Find positions
		for (var j = 0; j != level.length; j++) {
			var group = level[j];
			for (var m = 0; m != group.length; m++) {
				var node = group[m];
				if (node.children.length == 0)
					continue;
				var totalX = 0;
				for (var n = 0; n != node.children.length; n++) {
					var child = node.children[n];
					totalX += child.x;
				}
				node.x = totalX / node.children.length;
			}
		}
		this.sweepAndAverage(level, maxWidth);
	}

	// Second level to bottom; children distributed under parent.
	for (var i = fixedLevel + 1; i < levels.length; i++) {
		var level = levels[i];
		// Find positions
		for (var j = 0; j != level.length; j++) {
			var group = level[j];
			var parent = group[0].parent;

			var groupWidth = (group.length - 1) * (1 + this.m_idealsiblinggap * 1);
			var x = parent.x - groupWidth / 2;
			for (var k = 0; k != group.length; k++) {
				var node = group[k];
				node.x = x;
				x += 1 + this.m_idealsiblinggap * 1;
			}
		}
		this.sweepAndAverage(level, maxWidth);
	}

	temp.DTSVG.getElementById("arrowHead").setAttribute("markerHeight", this.m_arrowheadsize * 1);

	// Find height ratio
	var val =  (IsBoolean(this.m_updateddesign) ? 2 : 1);
	var val1 =  (IsBoolean(this.m_updateddesign) ? 3 : 1);
	var useLevels = Math.max(levels.length, this.m_minimumdepth * val);
	var height = useLevels + (useLevels - val1) * this.m_levelsgap * 1;

	var xAttribute;
	var yAttribute;
	var widthAttribute;
	var heightAttribute;
	var topBottomMargin = 2;
	var leftRightMargin = 2;

	if (this.m_flipxy * 1) {
		xAttribute = "y";
		yAttribute = "x";
		widthAttribute = "height";
		heightAttribute = "width";
	} else {
		xAttribute = "x";
		yAttribute = "y";
		widthAttribute = "width";
		heightAttribute = "height";
	}
	var first;
	var second;
	if (this.m_arrowsup * 1) {
		first = "2";
		second = "1";
	} else {
		first = "1";
		second = "2";
	}
	var xMultiplier1 = this.m_boxwidth * 1;
	var width1 = xMultiplier1 * maxWidth + leftRightMargin *1;
	var percentWidthFlag = (this.m_width*1 < width1) ? true : false;
	
	if (!IsBoolean(percentWidthFlag)) {
		var xMultiplier = this.m_width / maxWidth;
		var yMultiplier = (this.m_height - this.m_roottopmargin * 1) / height;
		temp.DTSVG.style.width = this.m_width + "px";
		temp.DTSVG.style.height = this.m_height + "px";
	} else {
		var xMultiplier = this.m_boxwidth * 1;
		var yMultiplier = this.m_boxheight * 1;
		temp.DTSVG.style.width = xMultiplier * maxWidth + leftRightMargin * 1 + "px";
		//temp.DTSVG.style.height = yMultiplier * height + this.m_roottopmargin * 1 + topBottomMargin * 1 + "px";
	}
	for (var i = 0; i != levels.length; i++) {
		var level = levels[i];

		for (var j = 0; j != level.length; j++) {
			var group = level[j];
			for (var m = 0; m != group.length; m++) {
				var node = group[m];
				var yValue = i * (1 + this.m_levelsgap * 1);
				var val =  (IsBoolean(this.m_updateddesign) ? -20 : 4);
				var xRect = Math.floor(node.x * xMultiplier + val);
				var yRect = (Math.floor(yValue * yMultiplier) + this.m_roottopmargin * 1);
				var val1 =  (IsBoolean(this.m_updateddesign) ? 50 : -4);
				var wRect = Math.floor(xMultiplier + val1);
				var hRect = ((this.m_numberOfItems.length != 0) || (this.m_seriesProbabilityArray.length != 0)) ? Math.floor(yMultiplier) : this.m_titlerectheight *3;
				var getText = "";
				var textAlignmentPoint = 0;
				var rectStrokeColor = hex2rgb(this.m_noderectstrokecolor, this.m_noderectopacity);
				var rectFillColor = hex2rgb(this.m_noderectfillcolor, this.m_noderecttrasparency);
				var borderRadius = 2;
				var svgRect = this.drawSVGRect(xRect, yRect, wRect, hRect, rectStrokeColor, rectFillColor, borderRadius);
				this.createTooltipTipMap(svgRect, node);
				//Outline Rect
				
				this.drawSVGText(node[this.getCondition()], xRect + wRect / 2, yRect, wRect, hRect, this.m_labellinespacing * 1, xAttribute, yAttribute, this.m_textstrokecolor, this.m_conditiontextanchor, this.m_conditionfontweight, this.m_conditionfontsize, this.m_fontfamily);
				//Condition Text
				textAlignmentPoint = (this.m_titletextanchor == "middle") ? xRect + wRect/2 : ((this.m_titletextanchor == "end") ? xRect + wRect - 4: xRect);
				getText = this.validateText(node[this.getName()],wRect);
				this.drawSVGText(getText, textAlignmentPoint + this.m_textleftmargin * 1, yRect + 2 + this.m_textfontsize * 3 / 2, wRect, hRect, this.m_labellinespacing * 1, xAttribute, yAttribute, this.m_textstrokecolor, this.m_titletextanchor, this.m_titlefontweight, this.m_titlefontsize, this.m_fontfamily);
				var lineStrokeColor = hex2rgb(this.m_linestrokecolor, this.m_lineopacity);
				if((this.m_numberOfItems.length != 0) || (this.m_seriesProbabilityArray.length != 0))
				{
					var lx1 = xRect;
					var val =  (IsBoolean(this.m_updateddesign) ? 2 : 1);
					var ly1 = yRect + (this.m_titlerectheight * val);
					var lx2 = xRect + wRect;
					var val1 =  (IsBoolean(this.m_updateddesign) ? 2 : 1);
					var ly2 = yRect + (this.m_titlerectheight * val1);

					this.drawSVGLine(lx1, ly1, lx2, ly2, xAttribute, yAttribute, first, second, lineStrokeColor);
				
				//Title Text
					textAlignmentPoint = (this.m_numberofitemstextanchor == "middle") ? xRect + wRect/2 : ((this.m_numberofitemstextanchor == "end") ? xRect + wRect - 4: xRect);
			//		this.drawSVGText(this.getNumberOfItems()+"="+node[this.getNumberOfItems()], textAlignmentPoint + this.m_textleftmargin * 1, yRect + this.m_textfontsize * 3 , wRect, hRect, this.m_labellinespacing * 1, xAttribute, yAttribute, this.m_textstrokecolor, this.m_numberofitemstextanchor, this.m_numberofitemsfontweight, this.m_numberofitemstextfontsize, this.m_fontfamily);
				//Number of items text
					getText = node[this.getNumberOfItems()];
					getText = ((getText == undefined) || (getText == "")) ? "": this.validateText(this.getDisplayItems()+"="+node[this.getNumberOfItems()], wRect);
					if(IsBoolean(this.m_updateddesign))
						this.drawSVGText(getText, textAlignmentPoint - 10 + this.m_textleftmargin / 4, yRect + this.m_textfontsize * 3 , wRect, hRect, this.m_labellinespacing * 1, xAttribute, yAttribute, this.m_textstrokecolor, this.m_numberofitemstextanchor, this.m_numberofitemsfontweight, this.m_numberofitemstextfontsize, this.m_fontfamily);
					else
						this.drawSVGText(getText, textAlignmentPoint + this.m_textleftmargin * 1, yRect + this.m_textfontsize * 3 , wRect, hRect, this.m_labellinespacing * 1, xAttribute, yAttribute, this.m_textstrokecolor, this.m_numberofitemstextanchor, this.m_numberofitemsfontweight, this.m_numberofitemstextfontsize, this.m_fontfamily);
				
				//Title Bottom Line
				
					var chartAvailableHeight = hRect - (this.m_titlerectheight * 1 + this.m_percentrectheight * 1);				
					var rectStrokeColor = hex2rgb(this.m_linestrokecolor, this.m_probabilityrectopacity);
					borderRadius = 0;
				
					this.drawProbabilityRect(node,xRect,yRect,wRect,hRect,chartAvailableHeight,rectStrokeColor,borderRadius);
				
					var lx1 = xRect;
					var ly1 = yRect + (hRect - this.m_percentrectheight * 1);
					var lx2 = xRect + wRect;
					var ly2 = yRect + (hRect - this.m_percentrectheight * 1);
					this.drawSVGLine(lx1, ly1, lx2, ly2, xAttribute, yAttribute, first, second, lineStrokeColor);
				//Probability Bottom Line

					var rectStrokeColorForPercentrect = hex2rgb(this.m_strokecolorforpercentrect, this.m_opacityforpercentrect);
					this.drawSVGRect(xRect, yRect + hRect - this.m_percentrectheight * 1, wRect * 1, this.m_percentrectheight * 1, rectStrokeColorForPercentrect, this.m_percentfillcolor, borderRadius);
				//Bottom Percentage Rect
					if(IsBoolean(this.m_updateddesign))
						var text = (node.percentValue == "")?"":this.drawSVGText(node.percentValue + "%", xRect + wRect / 2, yRect + hRect + 3, wRect, hRect, this.m_labellinespacing * 1, xAttribute, yAttribute, this.m_textstrokecolor, this.m_percenttextanchor, this.m_percentfontweight, this.m_percentfontsize, this.m_fontfamily);
					else
						var text = (node.percentValue == "")?"":this.drawSVGText(node.percentValue + "%", xRect + wRect / 2, yRect + hRect, wRect, hRect, this.m_labellinespacing * 1, xAttribute, yAttribute, this.m_textstrokecolor, this.m_percenttextanchor, this.m_percentfontweight, this.m_percentfontsize, this.m_fontfamily);
				//Bottom Percentage Text
				}
				if (i == 0)
					continue;
				// Level 0 nodes don't have parents.

				var parentOffset = (m + 1) / (group.length + 1);
				var lx1 = Math.floor((node.parent.x + parentOffset) * xMultiplier);
				var parentY = (i - 1) * (1 + this.m_levelsgap * 1);
//				var ly1 = Math.floor((parentY + 1) * yMultiplier) + this.m_roottopmargin * 1;
				var ly1 = ((this.m_numberOfItems.length != 0) || (this.m_seriesProbabilityArray.length != 0)) ? Math.floor((parentY + 1) * yMultiplier) + this.m_roottopmargin * 1 : Math.floor((parentY + 1) * (yMultiplier)) + this.m_roottopmargin * 1 - yMultiplier+ hRect;
				var lx2 = Math.floor((node.x + .5) * xMultiplier);
				var ly2 = Math.floor(yValue * yMultiplier) + this.m_roottopmargin * 1 - this.m_linespace * 1;
				this.drawSVGLine(lx1, ly1, lx2, ly2, xAttribute, yAttribute, first, second, lineStrokeColor);
				// Draw Skew Lines To Parents
			}
		}
	}
	this.scrollOnMaximize();
};
DecisionTreeChart.prototype.scrollOnMaximize = function(){
	var dragDivContainer = this.getDragableDiv();
	var svgWidth = this.DTSVG.style.width;
	var divWidth = dragDivContainer[0].style.width;
	if(svgWidth === divWidth){
		dragDivContainer[0].style.overflowX = "hidden";
	}else{
		dragDivContainer[0].style.overflowX = "auto";
	}
};
DecisionTreeChart.prototype.validateText = function(word, recWidth){
	var str = word;
	try {
		this.ctx.beginPath();
		var textWidth = this.ctx.measureText(str).width;
		if (textWidth > recWidth) {
			var newText = "";
			for (var i = 0; i < str.length; i++) {
				if (this.ctx.measureText(newText).width < recWidth) {
					newText += str[i];
				} else {
					newText = newText + "...";
					break;
				}
			}
			str = newText;
		}
		this.ctx.closePath();
		return str;
	} catch (e) {
		console.log("");
		return str;
	}
};
DecisionTreeChart.prototype.drawProbabilityRect = function (node,xRect,yRect,wRect,hRect,chartAvailableHeight,rectStrokeColor,borderRadius) {
	var xspace = 0;
	var numerOfLoop = (this.m_seriesProbabilityArray.length <= 10) ? (this.m_seriesProbabilityArray.length) : (10);
	var probWidthRect = (wRect)/numerOfLoop;
	for(var i = 0 ; i < numerOfLoop; i++){
		var xPos = xRect + xspace*1 ;
		var probRectH =  (chartAvailableHeight)*((node[this.m_seriesProbabilityArray[i]]*1 < 1) ? (node[this.m_seriesProbabilityArray[i]]) : 1);
		this.drawSVGRect(xPos, yRect + this.m_titlerectheight * 1  + chartAvailableHeight*1 -  probRectH*1, probWidthRect, probRectH, rectStrokeColor, this.m_probabilityColorArray[i], borderRadius);
		xspace = xspace*1 + probWidthRect;
	}
};

DecisionTreeChart.prototype.drawSVGText = function (word, x, y, w, h, labellinespacing, xAttribute, yAttribute, textStrokeColor, textAnchor, fontWeight, fontSize, fontFamily) {
	var text = document.createElementNS(NS, "text");
	this.DTGROUP.appendChild(text);
	text.setAttribute("text-anchor", textAnchor);
	text.setAttribute("fill", textStrokeColor);
	text.setAttribute("font-size", fontSize + "px");
	text.setAttribute("font-weight", fontWeight);
	text.setAttribute("font-family", selectGlobalFont(fontFamily));
	text.setAttribute("stroke-width", 0.1);
	text.setAttribute("alignment-baseline", "baseline");
	text.setAttribute(xAttribute, x + "px");
	text.setAttribute(yAttribute, y - fontSize / 2 + "px");
	this.getLayoutText(text, word, x, w, h, labellinespacing);
	return text;
};

DecisionTreeChart.prototype.drawEllipse = function (xPos, yPos, xMul, yMul, space) {
	var ellipse = document.createElementNS(NS, "ellipse");
	this.DTGROUP.appendChild(ellipse);
	ellipse.setAttribute("cx", xPos * xMul + xMul / 2);
	ellipse.setAttribute("cy", yPos * yMul + space + yMul / 2);
	ellipse.setAttribute("rx", xMul * 2 / 3);
	ellipse.setAttribute("ry", yMul / 2);
	ellipse.setAttributeNS(null, "style", "visibility:visible;stroke:rgb(122,122,112);fill:rgba(122,122,112,0.4);");
};

DecisionTreeChart.prototype.drawSVGRect = function (xPos, yPos, width, height, strokeColor, fillColor, borderRadius) {
	var rect = document.createElementNS(NS, "rect");
	width = (width < 0) ? width * -1 : width;
	this.DTGROUP.appendChild(rect);
	rect.setAttributeNS(null, "style", "visibility:visible;stroke:" + strokeColor + ";fill:" + fillColor + ";");
	rect.setAttribute("x", xPos + "px");
	rect.setAttribute("y", yPos + "px");
	rect.setAttribute("width", width + "px");
	rect.setAttribute("height", height + "px");
	rect.setAttribute("rx", borderRadius + "px");
	rect.setAttribute("ry", borderRadius + "px");
	return rect;

};

DecisionTreeChart.prototype.drawSVGLine = function (x1, y1, x2, y2, xAttribute, yAttribute, first, second, strokeColor) {
	var line = document.createElementNS(NS, "line");
	this.DTGROUP.appendChild(line);
	line.style.stroke = strokeColor;
	line.style.opacity = 1;
	line.setAttribute("stroke-width", "0.5");
	line.setAttribute(xAttribute + first, x1 + "px");
	line.setAttribute(yAttribute + first, y1 + "px");
	line.setAttribute(xAttribute + second, x2 + "px");
	line.setAttribute(yAttribute + second, y2 + "px");
	line.setAttribute("marker-end", "url(#arrowHead)");
	return line;
};

DecisionTreeChart.prototype.getLayoutText = function (textNode, word, x, width, height, labellinespacing) {
	var newText = word;
	var tspan = document.createElementNS(NS, "tspan");
	tspan.setAttributeNS(null, "x", x);
	tspan.setAttribute("title", word);
	textNode.appendChild(tspan);
	tspan.textContent = "..";
	var dotWidth = tspan.getComputedTextLength();
	tspan.textContent = word;
	var newTextLength = tspan.getComputedTextLength();
	while ((newTextLength > (width - dotWidth))) {
		newText = newText.slice(0, -1);
		tspan.textContent = newText;
		newTextLength = tspan.getComputedTextLength();
	}
	if (newText != word)
		newText += "..";
	else
		newText = word;
	tspan.textContent = newText;
};

DecisionTreeChart.prototype.sweepAndAverage = function (level, maxWidth) {
	this.sweepLeftToRight(level, "x", "x0");
	this.sweepRightToLeft(level, "x0", "x0", maxWidth);
	this.sweepRightToLeft(level, "x", "x1", maxWidth);
	this.sweepLeftToRight(level, "x1", "x1");
	for (var i = 0; i != level.length; i++) {
		var group = level[i];
		for (var j = 0; j != group.length; j++) {
			var node = group[j];
			node.x = (node.x0 + node.x1) / 2;
		}
	}
};

DecisionTreeChart.prototype.sweepLeftToRight = function (level, infield, outfield) {
	var minX = 0;
	for (var i = 0; i != level.length; i++) {
		var group = level[i];
		for (var j = 0; j != group.length; j++) {
			var node = group[j];
			var newX;
			if (infield in node && node[infield] > minX)
				newX = node[infield];
			else
				newX = minX;
			if (j == group.length - 1)
				minX = newX + 1 + this.m_minimumcousingap * 1;
			else
				minX = newX + 1 + this.m_siblinggap * 1;
			node[outfield] = newX;
		}
	}
};
// Sweep from the right to the left along a level, moving nodes along the row
// if they overlap with a previous node, or the edge of the diagram area
// (specified).
DecisionTreeChart.prototype.sweepRightToLeft = function (level, infield, outfield, maxWidth) {
	var maxX = maxWidth - 1;
	for (var i = level.length - 1; i >= 0; i--) {
		var group = level[i];
		for (var j = group.length - 1; j >= 0; j--) {
			var node = group[j];
			var newX;
			if (infield in node && node[infield] < maxX)
				newX = node[infield];
			else
				newX = maxX;
			if (j == 0)
				maxX = newX - 1 - this.m_minimumcousingap * 1;
			else
				maxX = newX - 1 - this.m_siblinggap * 1;
			node[outfield] = newX;
		}
	}
};

DecisionTreeChart.prototype.splitBy = function (array, char) {
	var out = [];
	for (var i = 0; i != array.length; i++) {
		var word = array[i];
		var split = word.split(char);
		for (var j = 0; j != split.length - 1; j++) {
			out.push(split[j] + char);
		}
		out.push(split[j]);
	}
	return out;
};

DecisionTreeChart.prototype.setMakeLevels = function (tree, drawRoot) {
	var groups = [];
	if (drawRoot) {
		groups.push([tree]);
	} else {
		var group = tree.children;
		for (var i = 0; i != group.length; i++)
			groups.push([group[i]]);
	}

	this.m_levels = [];
	while (true) {
		this.m_levels.push(groups);
		groups = this.buildNextLevel(groups);
		if (groups.length == 0)
			break;
	}
};

DecisionTreeChart.prototype.buildNextLevel = function (groups) {
	var groupsOut = [];
	for (var i = 0; i != groups.length; i++) {
		var group = groups[i];
		for (var j = 0; j != group.length; j++) {
			var member = group[j];
			if (!member.children.length)
				continue;
			groupsOut.push(member.children);
		}
	}
	return groupsOut;
};

DecisionTreeChart.prototype.getNodeToolTipData = function ( node) {
	var data =[];
	for(var i=0,j=0; i <= this.m_seriesProbabilityArray.length ; i++){
		if(i==0){
			if(this.m_numberOfItemsArray.length == 0){
				data[i] = "";
			}else{
				data[i] = (node.percentValue == "")?[this.m_percentfillcolor, this.getDisplayBottomPercentField(), node.percentValue]:[this.m_percentfillcolor, this.getDisplayBottomPercentField(), node.percentValue + "%"];
			}
		}
		else{
			/*if(this.m_numberOfItems.length == 0){*/
				data[i] = [(this.m_probabilityColorArray[j]),this.m_seriesProbabilityDisplayArray[j],node[this.m_seriesProbabilityArray[j]]];
				j++;
			/*}*/
		}
	}
	return data;
};

DecisionTreeChart.prototype.createTooltipTipMap = function(rect, node) {
    var tooltipData = {
        "labelOfNode": node[this.getName()],
        "condition": node[this.getCondition()],
        "n": this.getDisplayItems() + "=" + node[this.getNumberOfItems()],
        "data": this.getNodeToolTipData(node),
        "depth": node[this.getDepth()],
        "ID": node[this.getNodeID()]
    }
    var toolTipDataForDrill = node;
    var allFields = this.m_allSeriesNames;
    rect.setAttribute("data", JSON.stringify(tooltipData));
    var temp = this;
    rect.addEventListener("mouseover", function(evt) {
        temp.setToolTipData((JSON.parse(this.attributes.data.nodeValue)));
        mouseX = pageX = evt.clientX;
        mouseY = pageY = evt.clientY;
        temp.drawTooltip(evt.clientX, evt.clientY);
    });
    rect.addEventListener("mouseout", function(evt) {
        temp.hideToolTip();
    });
    rect.addEventListener("click", function(evt) {
        if ("ontouchstart" in document.documentElement) {
            onMouseMove(temp);
        } else {
            var map = JSON.parse(this.attributes.data.nodeValue);
            var fieldNameValueMap = {};
            var len = allFields.length;
            //	var key = 0;
            for (var i = 0; i < len; i++) {
                var series = allFields[i];
                for (var key in toolTipDataForDrill) {
                    if (key == series) {
                        fieldNameValueMap[key] = toolTipDataForDrill[key];
                        break;
                    }
                }
            }

            /*		fieldNameValueMap[temp.getName()] = map.labelOfNode;
            		fieldNameValueMap[temp.getCondition()] = map.condition;
            		fieldNameValueMap[temp.getFirstProbabilityField()] = map.data[0][2];
            		fieldNameValueMap[temp.getSecondProbabilityField()] = map.n;
            		fieldNameValueMap[temp.getNodeID()] = map.ID;
            		fieldNameValueMap[temp.getDepth()] = map.depth;

            	*/
            var drillColor = "";
            temp.updateDataPointsToGV({
                "drillRecord": fieldNameValueMap,
                "drillColor": drillColor
            });
        }
    });

    $(rect)[0].addEventListener("touchstart", function(event) {
        if (singleClickTimer == null) {
             singleClickTimer = setTimeout(function() {
                singleClickTimer = null;
                onMouseMove(temp);
            }, temp.m_doubletaptimeout);
        } else {
            clearTimeout(singleClickTimer);
            singleClickTimer = null;
            var map = JSON.parse(this.attributes.data.nodeValue);
            var fieldNameValueMap = {};
            var len = allFields.length;
            for (var i = 0; i < len; i++) {
                var series = allFields[i];
                for (var key in toolTipDataForDrill) {
                    if (key == series) {
                        fieldNameValueMap[key] = toolTipDataForDrill[key];
                        break;
                    }
                }
            }
            var drillColor = "";
            temp.updateDataPointsToGV({
                "drillRecord": fieldNameValueMap,
                "drillColor": drillColor
            });
        }
    }, false);

};

DecisionTreeChart.prototype.drawTooltip = function (mouseX, mouseY) {
	if (!IsBoolean(this.m_isEmptySeries) && !this.m_designMode && IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")) {
		var toolTipData = this.getToolTipData(mouseX, mouseY);
		if(this.m_hovercallback && this.m_hovercallback != ""){
			this.drawCallBackContent(mouseX,mouseY,toolTipData);
		}
		else{
			this.drawTooltipContent(toolTipData);
		}
	}
};

DecisionTreeChart.prototype.drawTooltipContent=function(toolTipData){
	this.m_tooltip.draw(toolTipData, this.m_componenttype);
};

DecisionTreeChart.prototype.setToolTipData = function (tooltipData) {
	this.tooltipData = tooltipData;
};

DecisionTreeChart.prototype.getToolTipData = function (mouseX, mouseY) {
	return this.tooltipData;
};
/** Returns X coordinate value for max/min icon **/
DecisionTreeChart.prototype.getXpoint = function () {
	var x = this.m_width - this.fontScaling(25);
	var dragDivContainer = this.getDragableDiv();
	var sWidth = dragDivContainer.find('svg').width() - dragDivContainer.width();
	var scrollWidth = (sWidth < 0)?0:Math.min(sWidth, dragDivContainer.scrollLeft());
	x = (x + scrollWidth);
	return x;
};
/** Returns right margin value for max/min icon's tooltip **/
DecisionTreeChart.prototype.getRightMargin = function () {
	var right =  this.fontScaling(30) + "px";
	var dragDivContainer = this.getDragableDiv();
	var sWidth = dragDivContainer.find('svg').width() - dragDivContainer.width();
	var scrollWidth = Math.min(sWidth, dragDivContainer.scrollLeft());
	right = this.fontScaling(30 - scrollWidth)+"px";
	return right;
};
/** @description overridden(Chart.js) method checks if tooltip has any data formatting, andreturns formatted value **/
DecisionTreeChart.prototype.getFormatterForToolTip = function(data) {
	if (isNaN(getNumericComparableValue(data)) || data == "" || data == undefined) {
		return data;
	} else {
		data = getNumericComparableValue(data);
		var m_precision;
		if (this.m_tooltipprecision !== "default") {
			m_precision = this.m_tooltipprecision;
		} else {
			m_precision = (data + "").split(".");
			if (m_precision[1] !== undefined) {
				m_precision = m_precision[1].length;
			} else {
				m_precision = 0;
			}
		}
		data = this.getLocaleWithPrecision(data, m_precision);
		return data;
	}
};
//# sourceURL=DecisionTreeChart.js