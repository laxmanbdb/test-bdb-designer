/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: Legend.js
 * @description Legend
 **/
function Legend(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();

	this.m_bordercolor = "";
	this.m_bgalpha = "";
	this.m_bggradients = "";
	this.m_borderthickness = "";
	this.m_bggradientrotation = "";
	this.m_borderalpha = "";
	this.m_fontfamily = "";
	this.m_fontsize = "";
	this.m_fontcolor = "";
	this.m_fontstyle = "";
	this.m_fontweight = "";
	this.m_textdecoration = "";
	this.m_legenddirection = "";
	this.m_legendcheckbox = "";
	this.m_legendsymbol = "";
	this.m_associatedchartid = "";
	this.m_associatedrepeaterchartid = "";
	this.m_showborder = false;
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_chartFrame = new ChartFrame();
	this.m_legendwidth = 12;
	this.m_legendheight = 10;

	this.m_legendcolors = "#E08283,#38d3a9,#797979";
	this.m_legendnames = "Series1,Series2,Series3";
	this.m_legendshapes = "cube,triangle,point";
	this.legendsWidthArray = [];

	this.marginLeft = 15;
	this.marginTop = 10;
	this.marginGap = 10;
	this.m_rowpadding = 4;
	this.m_columnpadding = 0;
	this.checkboxChangedFlag = false;

	this.m_original_x;
	this.m_original_y;
	this.m_original_width;
	this.m_original_height;
	this.m_original_zindex;

	this.legendNames = [];
	this.legendDisplayNames = [];
	this.legendColors = [];
	this.legendShapes = [];
	this.m_legendObjectArr = [];
	this.m_isstaticlegend = "false";
	this.isMaximized = false;
	
	this.m_enhanceCheckbox=false;
	
	this.m_rollovercolor = "transparent";
	this.m_cursortype = "pointer";
	this.reloadLegend = true;
	this.m_legendtextalign = "left";
	this.m_multipleassociatedchart = {
		"enable": false,
		"id": []
	};
	this.m_legendhscroll = false;
};

Legend.prototype = new Widget();

Legend.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

Legend.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "Legend") {
			for (var rectangleKey in jsonObject[key]) {
				this.setAttributeValueToNode(rectangleKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

Legend.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

Legend.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseClickEvent();
};

Legend.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = this.m_objectid;
};

Legend.prototype.draw = function () {
	this.drawObject();
};

Legend.prototype.drawObject = function () {
	if(this.getAssociatedChartObject()){
		this.isMaximized = this.getAssociatedChartObject().isMaximized;
	}
	/** redraws the legend when chart-is-minimized and checkbox-changed **/
	if (!IsBoolean(this.checkboxChangedFlag)) {
		if (!IsBoolean(this.m_designMode) &&  IsBoolean(this.reloadLegend) && this.getAssociatedChartObject() != undefined && IsBoolean(this.getAssociatedChartObject().isMaximized)){
			this.repositionLegend(this.getAssociatedChartObject());
			this.reloadLegend = false;
		}else if (this.m_original_x != undefined && !IsBoolean(this.isMaximized)){
			this.setOriginalPosition();
			this.reloadLegend = true;
		}else{
			// Do nothing
		}
		this.init();
		this.drawChart();
		if(this.m_onafterrendercallback!=""){
			onAfterRender(this.m_onafterrendercallback);
		}
	}else if(!IsBoolean(this.reloadLegend)){
		this.init();
		this.drawChart();
		if(this.m_onafterrendercallback!="")
			onAfterRender(this.m_onafterrendercallback);
	}  else if ( this.getAssociatedChartObject() != undefined && !IsBoolean(this.getAssociatedChartObject().isMaximized) ){
		/** Redraw the legend when chart-reloads */
		this.init();
		this.drawChart();
	}else{
		// Do nothing
	}
};

Legend.prototype.getAssociatedChartObject = function () {
	this.associatedChartObject = this.getRepeaterChartObjectById(this.m_associatedchartid);
	return this.associatedChartObject;
};
Legend.prototype.getLegendName = function (chart) {
	return chart.getLegendNames();
};
Legend.prototype.getLegendColors = function (chart) {
	var colors = chart.getSeriesColors();
	return colors;
};
Legend.prototype.getLegendShapes = function (chart) {
	return chart.m_plotShapeArray;
};
Legend.prototype.getBgGradients = function () {
	return this.m_bggradients;
};
Legend.prototype.createLegendContainerDiv = function () {
	var temp = this;
	$("#LegendContainerDiv" + temp.m_objectid).remove();
	var div = document.createElement("div");
	div.setAttribute("id", "LegendContainerDiv" + temp.m_objectid);
	if (this.m_legenddirection == "vertical"){
		div.setAttribute("class", "LegendVContainerDiv");
		div.setAttribute("style",  "position:absolute;left:0px;top:0px;width:inherit;height:inherit;overflow:auto;text-align:"+ temp.m_legendtextalign +";");
	}else{
		div.setAttribute("class", "LegendHContainerDiv");
		var width = (IsBoolean(this.m_legendhscroll) ? "max-content": "inherit");
		div.setAttribute("style", "display: flow-root;position:absolute;left:0px;top:0px;width:"+width+";height:inherit;overflow:auto;text-align:"+ temp.m_legendtextalign +";");
	}
	$("#draggableDiv" + temp.m_objectid).append(div);
};
Legend.prototype.init = function () {
	this.checkBoxWidth=(this.m_fontsize*1 <12 ) ? 12 : this.m_fontsize*1 ;
	this.createLegendContainerDiv();
	this.m_chartFrame.init(this);
	/** When checkbox is enabled, show cursor as pointer else default **/
	this.m_cursortype = IsBoolean(this.m_legendcheckbox) ? "pointer" : "default";
	if (!(this.m_designMode) && this.getAssociatedChartObject() != undefined) {
		this.setLegendInfoForAssignedChart(this.getAssociatedChartObject());
	} else {
		this.setLegendInfoForStatic();
	}
};
Legend.prototype.setLegendInfoForAssignedChart = function (chart) {
	var temp = this;
	this.legendNames = [];
	this.legendDisplayNames = [];
	this.legendColors = [];
	this.legendShapes = [];
	this.m_legendObjectArr = [];
	var legendMap = chart.getLegendInfo();
	for (var key in legendMap) {
		this.legendNames.push(legendMap[key].seriesName);
		this.legendDisplayNames.push(legendMap[key].displayName);
		this.legendColors.push(legendMap[key].color);
		this.legendShapes.push(legendMap[key].shape);
		this.m_legendObjectArr.push({
		"legendName": legendMap[key].seriesName,
		"legendShape":legendMap[key].shape,
		"legendColor":legendMap[key].color,
		"legendDisplayName":legendMap[key].displayName,
		"index":legendMap[key].index
		});
	}
	this.m_legendObjectArr.sort(function(a, b) {
		return a["index"] - b["index"];
	});
	/** Added for append static legends in chart associated legend */
	if(IsBoolean(this.m_isstaticlegend)) {
		var legendNames = this.m_legendnames.split(",");
		var legendDisplayNames = this.m_legendnames.split(",");
		legendDisplayNames = legendDisplayNames.map(function(name){
			return temp.getValueFromGlobalVariable(name, "square", false);
		});
		var legendColors = this.m_legendcolors.split(",");
		var legendShapes = this.m_legendshapes.split(",");
		for (var i = 0; i < legendNames.length; i++) {
			this.m_legendObjectArr.push({
				"legendName": legendNames[i],
				"legendShape":legendShapes[i],
				"legendColor":legendColors[i],
				"legendDisplayName": legendDisplayNames[i],
				"legendType": "static"
			});
		}
	}
};
Legend.prototype.setLegendInfoForStatic = function (chart) {
	var temp = this;
	this.m_legendObjectArr = [];
	this.legendNames = this.m_legendnames.split(",");
	this.legendDisplayNames = this.m_legendnames.split(",");
	this.legendDisplayNames = this.legendDisplayNames.map(function(name){
		return temp.getValueFromGlobalVariable(name, "square", false);
	});
	this.legendColors = this.m_legendcolors.split(",");
	this.legendShapes = this.m_legendshapes.split(",");
	
	for (var i = 0; i < this.legendNames.length; i++) {
		this.m_legendObjectArr.push({
			"legendName": this.legendNames[i],
			"legendShape": this.legendShapes[i],
			"legendColor": this.legendColors[i],
			"legendDisplayName": this.legendDisplayNames[i]
		});
	}
};
Legend.prototype.drawChart = function () {
	this.m_chartFrame.drawFrame();
	if (this.m_legendObjectArr.length > 0) {
		this.calculateLegendsWidth();
		this.drawLegend();
	}
};
Legend.prototype.drawLegend = function() {
    for (var i = 0; i < this.m_legendObjectArr.length; i++) {
        if (this.m_legendObjectArr[i].legendName != "") {
        	var showCheckbox = IsBoolean(this.m_legendcheckbox);
        	/** Added for remove legend checkBox of static legend, when static legend appended with chart associated legend **/
        	if(IsBoolean(this.m_isstaticlegend) && this.m_legendObjectArr[i].legendType == "static") {
        		showCheckbox = false;
        	}
            this.drawLegendDiv(i);
            if (showCheckbox) {
                this.drawLegendCheckbox(i);
            }
            this.drawHtmlLegends(i);
            this.drawHtmlLegendText(i);
        }
    }
};
Legend.prototype.drawLegendDiv = function(i) {
    var temp = this;
    var LegendDiv = document.createElement("div");
    LegendDiv.setAttribute("id", "LegendDiv" + this.m_objectid + i);
    LegendDiv.setAttribute("class", "legend-row-div");
    if (this.m_legenddirection == "vertical") {
        LegendDiv.setAttribute("style", "display: table-row;vertical-align:top;cursor: "+this.m_cursortype+";");
    } else {
        LegendDiv.setAttribute("style", "display: inline-flex; padding-top: "+temp.fontScaling(2)+"px; vertical-align:top; margin-right: 15px; cursor: "+this.m_cursortype+";");
    }
    $("#LegendContainerDiv" + temp.m_objectid).append(LegendDiv);
    $("#LegendDiv" + this.m_objectid + i).hover(
		function () {
			$(this).css("background", temp.m_rollovercolor);
		},
		function () {
			$(this).css("background", "transparent");
    	});
};
Legend.prototype.drawLegendCheckbox = function(i) {
    var temp = this;
    var checkBoxDiv = document.createElement("div");
    var checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("class", "cr-checkbox");
    if(this.m_enhanceCheckbox)
    checkBox.setAttribute("class", "option-input-cr cr-checkbox");
    checkBox.setAttribute("id", this.m_objectid + "LegendCheckbox" + this.m_legendObjectArr[i].legendName);
    if (IsBoolean(this.m_designMode) || temp.getAssociatedChartObject() == undefined) {
        checkBox.setAttribute("checked", true);
    } else {
        checkBox.setAttribute((IsBoolean(temp.getAssociatedChartObject().m_seriesVisibleArr[this.m_legendObjectArr[i].legendName]) == true) ? "checked" : "unchecked", true);
    }
    checkBoxDiv.setAttribute("id", this.m_objectid + "LegendCheckboxDiv" + this.m_legendObjectArr[i].legendName);
    checkBoxDiv.setAttribute("class", "legend-checkbox-div");
    checkBoxDiv.setAttribute("style", "display: table-cell;vertical-align: middle;position: relative;text-align: center;width: 25px;padding: " + this.m_rowpadding/2 + "px " + this.m_columnpadding +"px " + this.m_rowpadding/2 + "px " + this.m_columnpadding +"px;");

    $(checkBoxDiv).append(checkBox);
    $("#LegendDiv" + this.m_objectid + i).append(checkBoxDiv);
    /*DAS-894 Legend shape & Text alignmnet is was not proper when increase the text fone size .*/
    $(checkBox).css({
        "width": temp.fontScaling(this.checkBoxWidth) + "px",
        "height": temp.fontScaling(this.checkBoxWidth) + "px",
        "display": "inline-block",
    	"vertical-align": "middle",
    	"margin":"0px 0 0",
    	"position": "absolute",
    	"top": "45%",
    	"left": "50%",
    	"transform": "translate(-50%, -50%)"
        });
    
    if (!IsBoolean(temp.m_designMode)) {
        checkBox.onchange = function() {        	
            temp.redrawAssociatedChart($(this).attr("id").split("LegendCheckbox")[1], this.checked);
            /** updateGV should be called always, so it can work for static legends as well **/
            temp.getDataPointAndUpdateGlobalVariable(temp.m_legendObjectArr[i].legendDisplayName, temp.m_legendObjectArr[i].legendName, temp.m_legendObjectArr[i].legendColor);
        };
    }
};
Legend.prototype.redrawAssociatedChart = function(field, status) {
	var ch = this.getAssociatedChartObject();
	if (ch != undefined){
		ch.m_legendFlag = false;
		/** TODO Do not draw legend for Pie,Funnels. when repeater is applied and category is available, 
		 * because every repeated chart will have different category-values which can not be mapped with same colos **/
		
		/** Redraw all siblings of repeaters when a checkbox is changed **/
		if(IsBoolean(ch.m_isRepeaterPart)) {
			var parentObj = ch.m_parentObj;
			for (var j = 0; j < parentObj.m_repeaterCharts.length; j++) {
				parentObj.m_repeaterCharts[j].m_seriesVisibleArr[field] = status;
				/*To update the legend checked fields when filter is applied*/
				var rFieldIndex = parentObj.m_repeaterCharts[j].m_parentObj.m_defaultlegendfields.findIndex(function(element) {
					return element.key == field;
				});
				if(rFieldIndex != -1 && parentObj.m_repeaterCharts[j].m_parentObj.m_defaultlegendfields[rFieldIndex]){
					parentObj.m_repeaterCharts[j].m_parentObj.m_defaultlegendfields[rFieldIndex].value = status;
				}
		        /* its because when we checked and then maximize component then legend was not drawing */
		        this.checkboxChangedFlag = true;
		        ch.setChartState("legendCheckboxChanged");
		        parentObj.m_repeaterCharts[j].draw();
			}
		}else{
			ch.m_seriesVisibleArr[field] = status;
			/** m_defaultlegendfields is undefined for BStory **/
			if(ch.m_defaultlegendfields){
				/*To update the legend checked fields when filter is applied*/
				var fieldIndex = ch.m_defaultlegendfields.findIndex(function(element) {
					return element.key == field;
				});
				if(fieldIndex != -1 && ch.m_defaultlegendfields[fieldIndex]){
					ch.m_defaultlegendfields[fieldIndex].value = status;
				}
			}
	        /* its because when we checked and then maximize component then legend was not drawing */
	        this.checkboxChangedFlag = true;
	        ch.draw();
		}
    }
	this.redrawMultipleAssociatedCharts(field, status);
};
/** Draw multiple associated charts from same legends with same series **/
Legend.prototype.redrawMultipleAssociatedCharts = function(field, status) {
	if(this.m_multipleassociatedchart && IsBoolean(this.m_multipleassociatedchart.enable)){
		var arr = this.m_multipleassociatedchart.id;
		/** add pre-selected associated chart id **/
		var ch = this.getAssociatedChartObject();
		if(ch && ch.m_referenceid){
			if(arr.indexOf(ch.m_referenceid) == -1){
				arr.push(ch.m_referenceid);
			}
		}
		for(var i=0; i<arr.length; i++){
			ch = this.getChartObjectByReferenceId(arr[i]);
			/** TODO not supporting multiple checkbox-legend for multiple repeaters **/
			if (ch != undefined && !IsBoolean(ch.isValidRepeaterConfig())) {
				this.m_associatedchartid = ch.m_objectid;
				ch.m_associatedlegendid = this.m_objectid;
				ch.m_seriesVisibleArr[field] = status;
				/* its because when we checked and then maximize component then legend was not drawing */
				this.checkboxChangedFlag = true;
				ch.draw();
			}
		}
	}
};
/*******************Legend On Div ****************************/
Legend.prototype.drawHtmlLegends = function(i) {
    if (this.m_legendsymbol != "defaultshape" && this.m_legendObjectArr.length > 0 && this.m_legendObjectArr[i].legendShape != undefined) {
        this.drawLegendShape(i, this.m_shapeMap.hasOwnProperty(this.m_legendObjectArr[i].legendShape) ? this.m_shapeMap[this.m_legendObjectArr[i].legendShape] : this.m_shapeMap["default"]);
    } else {
        this.drawLegendShape(i, this.m_shapeMap["default"]);
    }
};
//    overflow: overlay; => for scroll verticaly only

Legend.prototype.drawLegendShape = function (i, shapeClass) {
	var temp = this;
	var container = document.createElement("div");
	container.setAttribute("id", "LegendShape" + temp.m_legendObjectArr[i].legendName + temp.m_objectid);
	    /*DAS-894 Legend shape & Text alignmnet is was not proper when increase the text fone size .*/
	var styleStr = "display: table-cell;align-items:center;vertical-align: middle;text-align: -webkit-center;width: 25px;padding: " + this.m_rowpadding/2 + "px " + this.m_columnpadding +"px " + this.m_rowpadding/2 + "px " + this.m_columnpadding +"px;";
	container.setAttribute("style", styleStr);
	container.setAttribute("class", "legend-shape-div");
	$("#LegendDiv" + this.m_objectid + i).append(container);

	var shapes = document.createElement("a");
	$(shapes).attr("class", shapeClass);
	
	if(this.m_enhanceCheckbox)
	$(shapes).attr("class", shapeClass+" legend-shape");
	
	var fontsize = this.m_legendwidth;
	/*DAS-894 Legend shape & Text alignmnet is was not proper when increase the text fone size and some shapeClass was displaying even when fontsize was 0 .*/
	if (shapeClass == "bd-diamond" && fontsize != 0) {
		fontsize = this.m_legendwidth * 1 + 2;
	} else if ((shapeClass == "bd-stop" || shapeClass == "bd-cross") && (fontsize != 0))	 {
		fontsize = this.m_legendwidth * 1 - 1;
	} else {
		// Do nothing
	}

	$(shapes).css({
		"color": this.m_legendObjectArr[i].legendColor,
		"font-size": (fontsize * 1) + "px",
		"display": "inline-flex",
		"text-decoration": "none",
		"vertical-align": "middle"
	});
	$(container).append(shapes);

};

Legend.prototype.drawHtmlLegendText = function (i) {
	var temp = this;
	var labelObj = document.createElement("div");
	var labelObjLabel = document.createElement("label");
	var labelObjSpan = document.createElement("span");
	labelObjLabel.setAttribute("for", this.m_objectid + "LegendCheckbox" + this.m_legendObjectArr[i].legendName);
	labelObjSpan.innerHTML = this.m_legendObjectArr[i].legendDisplayName;
	labelObj.setAttribute("id", temp.m_objectid + "" + temp.m_legendObjectArr[i].legendName);
	var styleStr = "display:table-cell;vertical-align:middle;padding:" + this.m_rowpadding/2 + "px " + this.m_columnpadding +"px " + this.m_rowpadding/2 + "px " + this.m_columnpadding +"px;";
	labelObj.setAttribute("style", styleStr);
	labelObj.setAttribute("class", "legend-label-div");
	/**Added selectGlobalFont for active the global font*/
	labelObjSpan.setAttribute("style", "margin-bottom:0px;cursor: " + this.m_cursortype + ";font-weight:" + this.m_fontweight + ";font-size:" + this.fontScaling(this.m_fontsize * 1) + "px;font-style:" +
		this.m_fontstyle + ";font-family:" + selectGlobalFont(this.m_fontfamily) + ";color:" + this.m_fontcolor + ";text-decoration:" + this.m_textdecoration + ";");
	$(labelObjLabel).append(labelObjSpan);
	$(labelObj).append(labelObjLabel);
	$("#LegendDiv" + this.m_objectid + i).append(labelObj);
	/** When legend with checkbox is there, no need for label event, change will be auto-triggered because of "For" relation with checkbox **/
	if (!IsBoolean(this.m_legendcheckbox) && !IsBoolean(temp.m_designMode)) {
		labelObj.onclick = (function () {
			temp.getDataPointAndUpdateGlobalVariable(temp.m_legendObjectArr[i].legendDisplayName, temp.m_legendObjectArr[i].legendName, temp.m_legendObjectArr[i].legendColor);
		});
	}
	/** Added to support scaling*/
	$(labelObjLabel).css({
		"display": "inline-flex",
		"margin-bottom": "0px",
		"vertical-align": "middle"
	});
};
Legend.prototype.calculateLegendsWidth = function () {
	var temp = this;
	this.m_legendwidth = this.fontScaling( this.m_fontsize );
	this.m_legendheight = this.fontScaling( this.m_fontsize );
	this.ctx.font = "" + this.m_fontstyle + " " + this.m_fontweight + " " + this.fontScaling( this.m_fontsize * 1) + "px " + selectGlobalFont(this.m_fontfamily);
	var checkboxMargin = (IsBoolean(this.m_legendcheckbox)) ? (this.marginGap * 1 + this.checkBoxWidth) : 0;
	
	this.createSpanToCalculateWidth();
	
	this.legendsWidthArray = [];
	for (var i = 0; i < this.m_legendObjectArr.length; i++) {
		var legendTextWidth = this.getTextWidth(this.m_legendObjectArr[i].legendDisplayName);
		//var width = this.marginLeft * 1 + this.m_legendwidth * 1 + this.marginGap * 1 + checkboxMargin * 1 + this.marginLeft * 1 + this.marginGap * 1;
		// [ 10px ][Checkbox][ 10px ][ShapeBox][ 10px ][Name][ 10px ]
		var width = this.marginLeft * 1 + checkboxMargin*1 + this.marginGap * 1 + this.m_legendwidth * 1 + this.marginGap * 1 + legendTextWidth * 1 + this.marginGap * 1;
		this.legendsWidthArray.push(width);
	}
	$("#textWidthCalcDiv" + temp.m_objectid).remove();
};
/** @description create a span to calculate width of text as legends drawing in div not in canvas **/
Legend.prototype.createSpanToCalculateWidth = function () {
	var temp = this;
	$("#textWidthCalcDiv" + temp.m_objectid).remove();
	var textWidthDiv = document.createElement("div");
	textWidthDiv.id = "textWidthCalcDiv" + temp.m_objectid;
	textWidthDiv.style.position = "absolute";
	textWidthDiv.style.float = "left";
	textWidthDiv.style.whiteSpace = "nowrap";
	textWidthDiv.style.visibility = "hidden";
	textWidthDiv.style.display = "none";
	textWidthDiv.style.fontSize = this.fontScaling( this.m_fontsize * 1) + "px";
	textWidthDiv.style.fontFamily = selectGlobalFont(this.m_fontfamily);
	textWidthDiv.style.fontWeight = this.m_fontweight;
	textWidthDiv.style.fontStyle = this.m_fontstyle;
	/** when initialVisibility of legend is false, legendTextWidth is calculated as 0 
	 * Need to append in document body to get proper width **/
//	$("#draggableDiv" + temp.m_objectid).append(textWidthDiv);
	document.body.appendChild(textWidthDiv);
};
/** @description append the text in span and return the calculated width **/
Legend.prototype.getTextWidth = function (text) {
	var temp = this;
	try{
		$("#textWidthCalcDiv" + temp.m_objectid).html("" + text);
		return $("#textWidthCalcDiv" + temp.m_objectid).width();
	}catch(e){
		return this.ctx.measureText( "" + text ).width;
	}
};
Legend.prototype.getNoOfRows = function (extendedWidth) {
	var rowCount = 1;
	var width = 0;
	for (var i = 0; i < this.legendsWidthArray.length; i++) {
		width = width * 1 + this.legendsWidthArray[i] * 1;
		if (width > extendedWidth * 1) {
			rowCount++;
			width = this.legendsWidthArray[i];
		}
	}
	return rowCount;
};
Legend.prototype.getOneRowHeight = function () {
	return (this.marginTop * 1 + this.m_legendheight * 1 + this.marginGap * 1);
};
Legend.prototype.getLargestLegend = function () {
	var max = 0;
	for (var i = 0; i < this.legendsWidthArray.length; i++) {
		if (this.legendsWidthArray[i] * 1 > max)
			max = this.legendsWidthArray[i];
	}
	return max;
};
Legend.prototype.getLegendMargins = function (extendedWidth) {
	var bottom, right;
	if (this.m_legenddirection == "horizontal") {
		var rows = this.getNoOfRows(extendedWidth);
		var rowHeight = this.getOneRowHeight();
		bottom = rows * rowHeight;
		right = 0;
	} else {
		bottom = 0;
		right = this.getLargestLegend();
	}
	return {
		bottom : bottom,
		right : right
	};
};
Legend.prototype.repositionLegend = function (chart) {
	var temp = this;
	var x,
	y,
	width,
	height;

	this.m_original_x = $("#draggableDiv" + temp.m_objectid)[0].offsetLeft;
	this.m_original_y = $("#draggableDiv" + temp.m_objectid)[0].offsetTop;
	this.m_original_width = this.m_width;
	this.m_original_height = this.m_height;
	this.m_original_zindex = this.m_zIndex;

	var chart_draggableDiv = $("#draggableDiv" + chart.m_objectid);
	var chart_draggableDiv_width = chart_draggableDiv.width(); /* chart_draggableDiv.width: 355, chart_draggableDiv.css("width") : 355px */
	var legendMargin = this.getLegendMargins(chart_draggableDiv_width);
	if ((this.m_legenddirection == "horizontal")) {
		x = chart_draggableDiv.css("left").split("px")[0];
		y = (chart_draggableDiv.css("top").split("px")[0] * 1 + chart_draggableDiv.css("height").split("px")[0] * 1);
		width = chart_draggableDiv.css("width").split("px")[0];
		height = legendMargin.bottom;
	} else {
		x = (chart_draggableDiv.css("left").split("px")[0] * 1 + chart_draggableDiv.css("width").split("px")[0] * 1);
		y = (chart_draggableDiv.css("top").split("px")[0]);
		width = legendMargin.right;
		height = chart_draggableDiv.css("height").split("px")[0];
	}

	$("#draggableDiv" + temp.m_objectid).css({
		"z-index": chart.maximizeZindex,
		"left": x + "px",
		"top": temp.fontScaling(y) + "px",
		"width": width + "px",
		"height": height + "px"});

	$("#draggableCanvas" + temp.m_objectid).attr("width", width);
	$("#draggableCanvas" + temp.m_objectid).attr("height", height);
	
	$("#draggableCanvas" + temp.m_objectid).css({
		"width": width,
		"height": height});
	
	this.adjustPixelRatio();
	this.m_width = width;
	this.m_height = height;
};
Legend.prototype.setOriginalPosition = function () {
	var temp = this;
	this.m_width = this.m_original_width;
	this.m_height = this.m_original_height;

	$("#draggableDiv" + temp.m_objectid)[0].offsetLeft = this.m_original_x;
	$("#draggableDiv" + temp.m_objectid)[0].offsetTop = this.m_original_y;

	$("#draggableDiv" + temp.m_objectid).css({
		"z-index": this.m_zIndex,
		"left": this.m_original_x * 1 + "px",
		"top": this.m_original_y * 1 + "px",
		"width": this.m_original_width + "px",
		"height": this.m_original_height + "px"});

	$("#draggableCanvas" + temp.m_objectid).attr("width", this.m_original_width);
	$("#draggableCanvas" + temp.m_objectid).attr("height", this.m_original_height);
	
	$("#draggableCanvas" + temp.m_objectid).css({
		"width": this.m_original_width,
		"height": this.m_original_height});
	
	this.adjustPixelRatio();

	this.m_x = 0;
	this.m_y = 0;
};

Legend.prototype.getLegendTextHeight = function (fontsize, TextfontFamily) {
	var text = $('<span style="font-size:' + this.fontScaling( fontsize * 1) + '; font-family:' + TextfontFamily + ';">Hg</span>');
	var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');
	var div = $("<div></div>");
	div.append(text, block);
	var body = $("body");
	body.append(div);
	try {
		var result = {};
		block.css({
			verticalAlign : "baseline"
		});
		result.ascent = block.offset().top - text.offset().top;
		block.css({
			verticalAlign : "bottom"
		});
		result.height = block.offset().top - text.offset().top;
		result.descent = result.height - result.ascent;
	}
	finally {
		div.remove();
	}
	return result.height;
};
Legend.prototype.getDataPointAndUpdateGlobalVariable = function (drillDisplayName, drillField, drillColor) {
	//console.log(drillDisplayName+" , "+drillField+" , "+drillColor); // clicked Legend Value
	var fieldMap={"drillDisplayField":drillDisplayName,"drillField":drillField};
	this.updateDataPoints(fieldMap, drillColor);
};
//# sourceURL=Legend.js