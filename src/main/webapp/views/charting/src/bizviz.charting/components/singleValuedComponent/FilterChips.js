/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: FilterChips.js
 * @description FilterChips
 **/
function FilterChips(m_chartContainer, m_zIndex) {
	this.base = Filter;
	this.base();

	this.m_bordercolor = "";
	this.m_bgalpha = "";
	this.m_bggradients = "";
	this.m_borderthickness = "";
	this.m_bggradientrotation = "";
	this.m_borderalpha = "";
	this.m_fontfamily = "";
	this.m_fontsize = "";
	this.m_fontcolor = ""
	this.m_fontstyle = "";
	this.m_fontweight = "";
	this.m_textdecoration = "";
	this.m_legenddirection = "";
	this.m_legendcheckbox = "";
	this.m_showallfilterbutton= true;
	this.m_showchipscount= true;
	this.m_allfilterbuttonwidth= 150;
	this.m_legendsymbol = "";
	this.m_associatedchartid = "";
	this.m_assignedfilters = [];
	this.m_savedfilterschips = [];
	this.m_savedtext = [];
	this.m_associatedrepeaterchartid = "";
	this.m_showborder = false;
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_chartFrame = new ChartFrame();
	this.m_legendwidth = 12;
	this.m_legendheight = 10;

	this.m_legendcolors = "#E08283,#38d3a9,#797979";
	this.m_legendnames = "Filter1,Filter2,Filter3,Filter4,Filter5,Filter6";
	this.m_legendshapes = "cube,triangle,point";
	this.legendsWidthArray = [];
	
	/*DAS-1272*/
	this.m_imgdata = "";
	this.m_chipstitle = "Applied Filters";
	this.m_btntitle = "All Filters";
	this.m_popuptitle = "Additional Filters";
	this.m_btnbgcolor = "#ffffff";
	this.m_filterbgcolor = "#ffffff";
	this.m_filterheaderbgcolor = "#EFF0F0";
	this.m_closebtnbgcolor = "#000000";
	this.m_chipsbgcolor = "#efefef";
	this.m_chipsfontcolor = "#000000";

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
	this.m_appendAdditionalButton = false;
	this.m_filterDisplayValues = {};
	this.m_additionaldropdownheight = 245;
	this.m_removedChipParentValues = [];
};

FilterChips.prototype = new Widget();

FilterChips.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

FilterChips.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "FilterChips") {
			for (var rectangleKey in jsonObject[key]) {
				this.setAttributeValueToNode(rectangleKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

FilterChips.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

FilterChips.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseClickEvent();
};

FilterChips.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = this.m_objectid;
};

FilterChips.prototype.draw = function () {
	this.drawObject();
};

FilterChips.prototype.drawObject = function () {
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

FilterChips.prototype.getAssociatedChartObject = function () {
	this.associatedChartObject = this.getRepeaterChartObjectById(this.m_associatedchartid);
	return this.associatedChartObject;
};
FilterChips.prototype.getLegendName = function (chart) {
	return chart.getLegendNames();
};
FilterChips.prototype.getLegendColors = function (chart) {
	var colors = chart.getSeriesColors();
	return colors;
};
FilterChips.prototype.getLegendShapes = function (chart) {
	return chart.m_plotShapeArray;
};
FilterChips.prototype.getBgGradients = function () {
	return this.m_bggradients;
};
FilterChips.prototype.createFilterChipsContainerDiv = function () {
	var temp = this;
	$("#FilterChipsContainerDiv" + temp.m_objectid).remove();
	var div = document.createElement("div");
	div.setAttribute("id", "FilterChipsContainerDiv" + temp.m_objectid);
	
	div.setAttribute("class", "filterchipsContainerDiv");
	var width = (IsBoolean(this.m_legendhscroll) ? "max-content": "inherit");
	div.setAttribute("style", "display: flex;flex-direction:row;flex-wrap:nowrap;position:absolute;left:0px;top:0px;width:"+width+";height:inherit;overflow:auto;");//text-align:"+ temp.m_legendtextalign +";
	
	$("#draggableDiv" + temp.m_objectid).append(div);
};
FilterChips.prototype.init = function () {
	this.checkBoxWidth=(this.m_fontsize*1 <12 ) ? 12 : this.m_fontsize*1 ;
	this.createFilterChipsContainerDiv();
	this.m_chartFrame.init(this);
	/** When checkbox is enabled, show cursor as pointer else default **/
	this.m_cursortype = IsBoolean(this.m_legendcheckbox) ? "pointer" : "default";
	if (!(this.m_designMode)) {
		this.setChipsInfoForAssignedFilter();
	} else {
		this.setLegendInfoForStatic();
	}
};

FilterChips.prototype.setChipsInfoForAssignedFilter = function() {
    var temp = this;
    var selectedValues = "";
    temp.m_legendObjectArr = [];
    if (this.m_savedfilterschips.length == 0) {
        for (var i = 0; i < temp.m_assignedfilters.length; i++) {
            var assignedFilterObject = this.getChartObjectById(temp.m_assignedfilters[i]);
            /*DAS-387*/
            if (assignedFilterObject != undefined) {
            	assignedFilterObject.m_associatedfilterchipsid = this.m_objectid;
            }
        }
    }

    if (temp.m_savedfilterschips.length != 0) {
        /* set dyanmic chips array */
        for (var i = 0; i < temp.m_savedfilterschips.length; i++) {
            temp.m_legendObjectArr.push({
                "legendName": temp.m_savedfilterschips[i].value,
                "legendShape": "",
                "legendColor": "",
                "legendDisplayName": temp.m_savedfilterschips[i].key,
                "index": "",
                "objectid": temp.m_savedfilterschips[i].objectid,
                "objecttype": temp.m_savedfilterschips[i].objecttype
            });
        }
    }


};

FilterChips.prototype.setLegendInfoForAssignedChart = function (chart) {
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
FilterChips.prototype.setLegendInfoForStatic = function (chart) {
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
FilterChips.prototype.drawChart = function () {
	var temp=this;
	this.m_chartFrame.drawFrame();
	if (this.m_legendObjectArr.length > 0) {
		this.calculateLegendsWidth();
		/*filterchips title*/
		this.drawChipsTitle();
		/*draw chips with ul li*/
		this.drawFilterChips();
		/*show all filter button*/
		if(IsBoolean(this.m_showallfilterbutton)){
			//this.drawAdditonalChipsDiv();
		}
		/*DAS-142*/
		var popupWidth= ($("#" + temp.m_objectid + "additionalUl").width()*1 <= 175) ? 175 : $("#" + temp.m_objectid + "additionalUl").width()*1;
		var top = $("#draggableDiv" + temp.m_objectid).offset().top + $("#" + temp.m_objectid + "additionalFilter").height() + 10 + "px";
		var left = $("#draggableDiv" + temp.m_objectid).offset().left + $("#draggableDiv" + temp.m_objectid).width() - $(".draggablesParentDiv").offset().left - popupWidth + "px";
		$("#" + temp.m_objectid + "additionalUl").css({
			"top":top,
			"left":left,
			"border": "none !important", 
			"background": temp.m_filterbgcolor,
			"box-shadow": "0px 0px 10px #00000029",
			"border-radius": "8px",
			"min-width": "175px",
			"margin-top": "1px",
		});
		
	}
};
FilterChips.prototype.drawFilterChips = function() {
	
	var temp = this;
	this.m_appendAdditionalButton = false;
	$("#" + temp.m_objectid + "additionalUl").remove();//BVZ746763f9-d30e-41e6-9d1d-70bdbeb1aae9additionalUl
	/*@description create chips ul li*/
    var FilterChipsUl = document.createElement("ul");
    FilterChipsUl.setAttribute("id", "FilterChipsUl" + this.m_objectid);
    FilterChipsUl.setAttribute("class", "float-left");
    FilterChipsUl.setAttribute("style", "margin:10px;");
    $("#FilterChipsContainerDiv" + temp.m_objectid).append(FilterChipsUl);
    var titleWidth = $("#"+temp.m_objectid + "titleFilter").width() + $("#filterchipsTitleText"+temp.m_objectid).width()+20;
    
	var additionalDiv = document.createElement("div");
	additionalDiv.setAttribute("id", temp.m_objectid + "additionalFilter");
	additionalDiv.setAttribute("max-height", ((temp.m_height * 1) - 10));
	additionalDiv.setAttribute("style", "margin: 10px 5px 10px 10px;position:absolute;right: 0px;background: " + this.m_btnbgcolor+"; box-shadow: 1px 1px 5px " + this.m_btnbgcolor);
	/*Add button for all filter*/
	var actionButton = document.createElement("button");
	actionButton.setAttribute("id", temp.m_objectid + "allFilterButton");	
	//actionButton.setAttribute("class", "btn dropdown-toggle ml-3");
	//actionButton.setAttribute("data-toggle", "dropdown");
	var actionButtonLabel = document.createElement("label");
	actionButtonLabel.setAttribute("id", temp.m_objectid + "allFiltertext");
	var mbtntitle = (temp.m_btntitle == "") ? "All Filters" : temp.m_btntitle;
	var actionBtnArrow="<span class='glyphicon glyphicon-chevron-down' id='allfilterArrow"+temp.m_objectid+"' style='margin: 10px 10px 10px 0px;color:"+this.m_fontcolor+";'></span>";
	
	actionButtonLabel.textContent=mbtntitle;
	actionButton.innerHTML = mbtntitle;
	actionButton.setAttribute("style", "border: none; outline:none; cursor: " + this.m_cursortype +"; background: " + this.m_btnbgcolor +"; box-shadow: 0px 0px 0px " + this.m_btnbgcolor +"!important ; width: "+this.m_allfilterbuttonwidth +"px;padding: 6px 20px;font-weight:" + this.m_fontweight + ";font-size:" + this.fontScaling(this.m_fontsize * 1) + "px;font-style:" +
			this.m_fontstyle + ";font-family:" + selectGlobalFont(this.m_fontfamily) + ";color:" + this.m_fontcolor + ";text-decoration:" + this.m_textdecoration +";overflow:hidden; text-overflow:ellipsis;white-space:nowrap;");
	//$(actionButton).append(actionButtonLabel);
	$(additionalDiv).append(actionButton);
	$(additionalDiv).append(actionBtnArrow);
	
	/** Add additional ul li for chips */
	var additionalUl = document.createElement("div");
	additionalUl.setAttribute("id", temp.m_objectid + "additionalUl");
	additionalUl.setAttribute("class", "filterchipsContainerDiv dropdown-content");
	var additionalChipDiv = document.createElement("ul");
	additionalChipDiv.setAttribute("id", temp.m_objectid + "additionalFilterDropdown");
	additionalChipDiv.setAttribute("class", "additionalFilterDropdown");
	//additionalChipDiv.setAttribute("class", "dropdown-menu");
	//additionalChipDiv.setAttribute("style", "list-style:none;");
	
	additionalChipDiv.setAttribute("style", "height :" + temp.m_additionaldropdownheight + "px; overflow : auto; display : inline-flex; flex-direction : column; width : 100%")
	var additionalTextDiv = document.createElement("div");
	additionalTextDiv.setAttribute("class", "bg-gray p-2 mb-2");
	var mpopuptitle = (temp.m_popuptitle == "") ? "Additional Filters" : temp.m_popuptitle;
	additionalTextDiv.innerHTML=mpopuptitle;
	additionalTextDiv.setAttribute("style", "background :" + temp.m_filterheaderbgcolor + "; outline:none;cursor: " + this.m_cursortype + ";font-weight:" + this.m_fontweight + ";font-size:" + this.fontScaling(this.m_fontsize * 1) + "px;font-style:" +
			this.m_fontstyle + ";font-family:" + selectGlobalFont(this.m_fontfamily) + ";color:" + this.m_fontcolor + ";text-decoration:" + this.m_textdecoration + ";");
	
	$(additionalUl).append(additionalTextDiv);
    this.m_textWidth = titleWidth;//94 is the width of the all filter drop down
    for (var i = 0; i < this.m_legendObjectArr.length; i++) {
        if (this.m_legendObjectArr[i].legendName != "") {
            this.drawChipsDiv(i,this.m_legendObjectArr[i], additionalChipDiv);
        }
    }
    $(additionalUl).append(additionalChipDiv);
	//$(additionalDiv).append(additionalUl);
	$(".draggablesParentDiv").append(additionalUl);
	/*
	var top = $("#draggableDiv" + temp.m_objectid).offset().top + $("#" + temp.m_objectid + "additionalFilter").height() + 10 + "px";
	var left = $("#draggableDiv" + temp.m_objectid).offset().left + $("#draggableDiv" + temp.m_objectid).width() - $(".draggablesParentDiv").offset().left - $(additionalUl).width() - 20 + "px";
	additionalUl.setAttribute("style","top :"+top+";left:"+left+";border: none !important; background: #FFFFFF;box-shadow: 0px 0px 10px #00000029; border-radius: 8px; min-width: 175px;margin-top: 0px;");
	*/
	if(IsBoolean(!this.m_designMode)){
		$(additionalDiv).click(function(e){
			e.stopPropagation();
			//$(additionalUl).toggle("show");
			if($(additionalUl).is(":visible")){
				$(additionalUl).css("display","none");
				temp.m_dropdownopen = false;
				$("#allfilterArrow"+temp.m_objectid).attr('class', 'glyphicon glyphicon-chevron-down');
			} else {
				$(additionalUl).css("display","block");
				temp.m_dropdownopen = true;
				$("#allfilterArrow"+temp.m_objectid).attr('class', 'glyphicon glyphicon-chevron-up');
			}
		});
		$(".draggablesParentDiv").click(function(){
			//$(additionalUl).toggle("hide");
			$(additionalUl).css("display","none");
		});
	}
	/**check filter chips width and additional button  */
	var titleWidth = $("#"+temp.m_objectid + "titleFilter").width() + $("#filterchipsTitleText"+temp.m_objectid).width() + 20;
	var componentwidth = $("#FilterChipsContainerDiv" + temp.m_objectid).width() - temp.m_allfilterbuttonwidth - titleWidth;
	var totalWidth = 0;
	$("#FilterChipsUl" + this.m_objectid).find('li').each(function () {
	        const $li = $(this);
	        const width = $li.outerWidth(true); // true includes margin
	        totalWidth = totalWidth + 1;
	});
	
	if(IsBoolean(temp.m_designMode)){
		var totalChips = temp.m_legendObjectArr.length;
	}else{
		var totalChips = temp.m_savedfilterschips.length;
	}
	
    if(totalChips > totalWidth &&  this.m_showallfilterbutton)
    	$("#FilterChipsContainerDiv" + temp.m_objectid).append(additionalDiv);
};
FilterChips.prototype.drawFilterChipsDiv = function(i) {
    var temp = this;
    var FilterChipsDiv = document.createElement("div");
    FilterChipsDiv.setAttribute("id", "FilterChipsDiv" + this.m_objectid + i);
    FilterChipsDiv.setAttribute("class", "filterchips-row-div");
    FilterChipsDiv.setAttribute("style", "display: inline-flex; padding-top: "+temp.fontScaling(2)+"px; vertical-align:top; margin-right: 15px; cursor: "+this.m_cursortype+";");
    $("#FilterChipsContainerDiv" + temp.m_objectid).append(FilterChipsDiv);
    $("#FilterChipsDiv" + this.m_objectid + i).hover(
		function () {
			$(this).css("background", temp.m_rollovercolor);
		},
		function () {
			$(this).css("background", "transparent");
    	});
};
FilterChips.prototype.drawFilterChipsCheckbox = function(i) {
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
    checkBoxDiv.setAttribute("style", "display: table-cell;vertical-align: middle;text-align: center;width: 25px;padding: " + this.m_rowpadding/2 + "px " + this.m_columnpadding +"px " + this.m_rowpadding/2 + "px " + this.m_columnpadding +"px;");

    $(checkBoxDiv).append(checkBox);
    $("#FilterChipsDiv" + this.m_objectid + i).append(checkBoxDiv);
    $(checkBox).css({
        "width": temp.fontScaling(this.checkBoxWidth) + "px",
        "height": temp.fontScaling(this.checkBoxWidth) + "px",
        "display": "inline-block",
    	"vertical-align": "middle",
    	"margin":"0px 0 0"
    });
    if (!IsBoolean(temp.m_designMode)) {
        checkBox.onchange = function() {
            temp.redrawAssociatedChart($(this).attr("id").split("LegendCheckbox")[1], this.checked);
            /** updateGV should be called always, so it can work for static legends as well **/
            temp.getDataPointAndUpdateGlobalVariable(temp.m_legendObjectArr[i].legendDisplayName, temp.m_legendObjectArr[i].legendName, temp.m_legendObjectArr[i].legendColor);
        };
    }
};
FilterChips.prototype.redrawAssociatedChart = function(field, status) {
	var ch = this.getAssociatedChartObject();
	if (ch != undefined){
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
FilterChips.prototype.redrawMultipleAssociatedCharts = function(field, status) {
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
FilterChips.prototype.drawHtmlLegends = function(i) {
    if (this.m_legendsymbol != "defaultshape" && this.m_legendObjectArr.length > 0 && this.m_legendObjectArr[i].legendShape != undefined) {
        this.drawFilterChipsShape(i, this.m_shapeMap.hasOwnProperty(this.m_legendObjectArr[i].legendShape) ? this.m_shapeMap[this.m_legendObjectArr[i].legendShape] : this.m_shapeMap["default"]);
    } else {
        this.drawFilterChipsShape(i, this.m_shapeMap["default"]);
    }
};
//    overflow: overlay; => for scroll verticaly only

FilterChips.prototype.drawFilterChipsShape = function (i, shapeClass) {
	var temp = this;
	var container = document.createElement("div");
	container.setAttribute("id", "LegendShape" + temp.m_legendObjectArr[i].legendName + temp.m_objectid);
	var styleStr = "display: table-cell;vertical-align: middle;text-align: -webkit-center;width: 25px;padding: " + this.m_rowpadding/2 + "px " + this.m_columnpadding +"px " + this.m_rowpadding/2 + "px " + this.m_columnpadding +"px;";
	container.setAttribute("style", styleStr);
	container.setAttribute("class", "legend-shape-div");
	$("#FilterChipsDiv" + this.m_objectid + i).append(container);

	var shapes = document.createElement("a");
	$(shapes).attr("class", shapeClass);
	
	if(this.m_enhanceCheckbox)
	$(shapes).attr("class", shapeClass+" legend-shape");
	
	var fontsize = this.m_legendwidth;
	if (shapeClass == "bd-diamond") {
		fontsize = this.m_legendwidth * 1 + 2;
	} else if (shapeClass == "bd-stop" || shapeClass == "bd-cross") {
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

FilterChips.prototype.drawChipsDiv = function (i, obj, additionalChipDiv) {
	var temp = this;
	var chipsObj = document.createElement("li");
	var chipsObjLabel = document.createElement("label");
	var chipsObjSpan = document.createElement("span");
	chipsObjLabel.setAttribute("for", this.m_objectid + "filterchips" + this.m_legendObjectArr[i].legendName);
	chipsObjLabel.innerHTML = this.m_legendObjectArr[i].legendDisplayName;
	chipsObjLabel.setAttribute("style", "margin-bottom:0px;padding:3px 0 5px 10px;cursor: " + this.m_cursortype + ";font-weight:" + this.m_fontweight + ";font-size:" + this.fontScaling(this.m_fontsize * 1) + "px;font-style:" +
			this.m_fontstyle + ";font-family:" + selectGlobalFont(this.m_fontfamily) + ";color:" + this.m_chipsfontcolor + ";text-decoration:" + this.m_textdecoration + ";");
	
	//chipsObjSpan.innerHTML = "<a></a>";
	chipsObj.setAttribute("id", temp.m_objectid + "" + temp.m_legendObjectArr[i].legendName);
	chipsObj.setAttribute("style", "background: "+temp.m_chipsbgcolor);
	chipsObjSpan.setAttribute("class", "closebtn bd-close");
	chipsObjSpan.setAttribute("style", "color: "+temp.m_closebtnbgcolor);
	//chipsObjSpan.textContent="close";
	chipsObjSpan.setAttribute("id", temp.m_legendObjectArr[i].objectid + "_" +  temp.m_legendObjectArr[i].legendName);
	$(chipsObj).append(chipsObjLabel);
	if(temp.m_legendObjectArr[i].objecttype!="radio_filter")
	$(chipsObj).append(chipsObjSpan);
	if(!IsBoolean(temp.m_designMode)){
		chipsObjSpan.onclick = (function () {
			$(this).closest('li').remove();
			temp.m_removedChipValue = temp.m_legendObjectArr[i].legendDisplayName;
			/*var ind2 = temp.m_savedtext.indexOf(temp.m_removedChipValue);
			(ind2 >= 0) ? temp.m_savedtext.splice(ind2,1) : temp.m_savedtext;*/
			temp.updateFilter(temp.m_legendObjectArr[i].objectid, temp.m_legendObjectArr[i].legendName, temp.m_legendObjectArr[i].legendDisplayName);
			//$("#filterchipsTitleText" + temp.m_componentid).html( temp.m_chipstitle +": "+ temp.m_savedfilterschips.length);
			var timer = setInterval(removeChipsConnections, 1000);
			function removeChipsConnections() {
				if(!$(document).find(".blockUI").length){
					setTimeout(function(){
						temp.getDataPointAndUpdateGlobalVariable(temp.m_legendObjectArr[i].legendDisplayName, temp.m_legendObjectArr[i].legendName, temp.m_legendObjectArr[i].legendColor);
						sdk.updateFilterChips(temp.m_referenceid);
						if(temp.m_dropdown && temp.m_appendAdditionalButton){
							$("#"+temp.m_objectid + "additionalUl").css("display","block");
						}
						clearInterval(timer);
					},1);
				}
			}
			/*setTimeout(function(){
				temp.getDataPointAndUpdateGlobalVariable(temp.m_legendObjectArr[i].legendDisplayName, temp.m_legendObjectArr[i].legendName, temp.m_legendObjectArr[i].legendColor);
				//temp.draw();
				sdk.updateFilterChips(temp.m_referenceid);
				if(temp.m_dropdownopen && temp.m_appendAdditionalButton)
					$("#"+temp.m_objectid + "additionalUl").css("display","block");
			},100);*/
		});
	}
	$("#FilterChipsUl" + this.m_objectid).append(chipsObj);
	var titleWidth = $("#"+temp.m_objectid + "titleFilter").width() + $("#filterchipsTitleText"+temp.m_objectid).width() + 20;
	var componentwidth = $("#FilterChipsContainerDiv" + temp.m_objectid).width() - temp.m_allfilterbuttonwidth;
	temp.m_textWidth = temp.m_textWidth + $(chipsObj).outerWidth(true);
	//20is for margin-left and 24 is padding-left and padding-right
	if(temp.m_textWidth > componentwidth && (IsBoolean(temp.m_showallfilterbutton))){
		temp.m_textWidth = temp.m_textWidth + $(chipsObj).outerWidth(true);
		$(chipsObj).remove();
		temp.drawAdditonalChipsDiv(i, additionalChipDiv);
	}
	/** When legend with checkbox is there, no need for label event, change will be auto-triggered because of "For" relation with checkbox **/
	/*if (!IsBoolean(this.m_legendcheckbox) && !IsBoolean(temp.m_designMode)) {
		chipsObj.onclick = (function () {
			//temp.getDataPointAndUpdateGlobalVariable(temp.m_legendObjectArr[i].legendDisplayName, temp.m_legendObjectArr[i].legendName, temp.m_legendObjectArr[i].legendColor);
			//temp.draw();
		});
	}*/
	/** Added to support scaling*/
	$(chipsObjLabel).css({
		"display": "inline-flex",
		"margin-bottom": "0px",
		"vertical-align": "middle"
	});
};

FilterChips.prototype.updateFilter = function(objId, removedChipValue, removedChipDisplayname) {
	var comp = this.getChartObjectById(objId);
	/*DAS-387*/
	if (comp != undefined) {
	  switch (comp.m_componenttype) {
	    case "combo_filter":
	      comp.m_selectedindex = [];
	      for (var j = 0; j < comp.staticOptsValue.length; j++) {
	        var idValue = getStringARSC(comp.staticOptsValue[j]) + "-" + j;
	        if (comp.staticOptsValue[j] == removedChipValue) {
	          comp.m_checkboxstatus[idValue] = false;
	        } else if (comp.m_checkboxstatus[idValue]) {
	          comp.m_selectedindex.push(j);
	        }
	      }
	      var ind = this.m_savedtext.indexOf(removedChipDisplayname);
	      if (ind > -1) {
	        this.m_savedtext.splice(ind, 1);
	      }
	      var ind1 = this.m_savedfilterschips.filter(function(obj) {
	        return removedChipValue != obj.value;
	      })
	      this.m_savedfilterschips = ind1;
	      comp.draw();
	      break;
	    case "date_picker": 	
	    	var ind = this.m_savedtext.indexOf(removedChipDisplayname);
	    	if (ind > -1) {
	    	    this.m_savedtext.splice(ind, 1);
	    	}
	    	var ind1 = this.m_savedfilterschips.filter(function(obj) {
	    	    return removedChipValue != obj.value;
	    	})
	    	this.m_savedfilterschips = ind1;
	    	if (comp.fieldNameValueMap) {
	    	    delete comp.fieldNameValueMap;
	    	}
	    	comp.m_nodefaultdate = true;
	    	comp.draw();
	    	$("#input" + comp.m_componentid)[0].value = "Please select date ";
		      break;
	    case "list_filter":
	      comp.m_selectedindex = [];
	      if (IsBoolean(comp.m_enabledualselectionlist)) {
	        for (var i = 0; i < comp.m_updateFilterList.length; i++) {
	          if (comp.m_updateFilterList[i] == removedChipValue) {
	            comp.m_updateFilterList.splice(i, 1);
	          }
	        }
	        for (var j = 0; j < comp.m_updateFilterList.length; j++) {
	          for (var k = 0; k < comp.value.length; k++) {
	            if (comp.m_updateFilterList[j] == comp.value[k]) {
	              comp.m_selectedindex.push(k);
	            }
	          }
	        }
	      } else {
	        for (var j = 0; j < comp.value.length; j++) {
	          var idValue = getStringARSC(comp.value[j]) + "-" + j;
	          var Value = comp.value[j];
	          if (comp.value[j] == removedChipValue) {
	            comp.m_checkboxstatus[idValue] = false;
	          } else if (comp.m_checkboxstatus[idValue]) {
	            comp.m_selectedindex.push(j);
	          }
	        }
	      }
	      var ind = this.m_savedtext.indexOf(removedChipDisplayname);
	      if (ind > -1) {
	        this.m_savedtext.splice(ind, 1);
	      }
	      var ind1 = this.m_savedfilterschips.filter(function(obj) {
	        return removedChipValue != obj.value;
	      })
	      this.m_savedfilterschips = ind1;
	      comp.draw();
	      break;
	    case "hierarchical_combo":
	      comp.m_selectedindex = [];
	      if (IsBoolean(comp.m_allowmultipleselection)) {
	        comp.m_currentIndexSelect = $("#ComboTree" + comp.m_componentid).combotree("getValues");
	        for (var i = 0; i < comp.finalArray.length; i++) {
	          if (comp.m_currentIndexSelect.includes(comp.finalArray[i].id.toString()) && comp.finalArray[i].name == removedChipValue) {
	            var index = comp.m_currentIndexSelect.indexOf(comp.finalArray[i].id.toString());
	            comp.m_currentIndexSelect.splice(index, 1);
	            /*remove parent if any*/
	            if (comp.finalArray[i].parentId > 0) {
	              var pindex = comp.m_currentIndexSelect.indexOf(comp.finalArray[i].parentId.toString());
	              if (pindex !== -1) {
	                comp.m_currentIndexSelect.splice(pindex, 1);
	              }
	            }
	            /*remove all childs of its parent from filter and chips*/
	            for (var key in comp.finalArray) {
	              if (comp.finalArray[key]["parentId"] == comp.finalArray[i].id) {
	                var index = comp.m_currentIndexSelect.indexOf(comp.finalArray[key]["id"].toString());
	                comp.m_currentIndexSelect.splice(index, 1);
	              }
	            }
	            comp.cid = 0;
	            comp.m_chipRemoved = true;
	          }
	        }
	      } else {
	        comp.selectedRecordArray = [];
	        comp.cid = 0;
	        comp.m_chipRemoved = true;
	      }
	      var ind = this.m_savedtext.indexOf(removedChipDisplayname);
	      if (ind > -1) {
	        this.m_savedtext.splice(ind, 1);
	      }
	      var ind1 = this.m_savedfilterschips.filter(function(obj) {
	        return removedChipValue != obj.value;
	      })
	      this.m_savedfilterschips = ind1;
	      comp.draw();
	      break;
	  }
	}
};

/** @description create additional filter if chips are not adjust in one line **/
FilterChips.prototype.drawAdditonalChipsDiv = function (i, additionalChipDiv) {
	var temp = this;
	temp.m_appendAdditionalButton = true;
	/*var additionalDiv = document.createElement("div");
	additionalDiv.setAttribute("id", temp.m_objectid + "additionalFilter");
	additionalDiv.setAttribute("style", "margin-left:10px;");
	
	*//** Add button for all filter*//*
	var actionButton = document.createElement("button");
	actionButton.setAttribute("id", temp.m_objectid + "allFilterButton");	
	actionButton.setAttribute("class", "btn dropdown-toggle ml-3");
	actionButton.setAttribute("data-toggle", "dropdown");
	actionButton.innerHTML=temp.m_btntitle;
	$(additionalDiv).append(actionButton);
	
	*//** Add additional ul li for chips *//*
	var additionalUl = document.createElement("div");
	additionalUl.setAttribute("id", temp.m_objectid + "additionalUl");
	//additionalUl.setAttribute("class", "dropdown-content");
	
	var additionalChipDiv = document.createElement("ul");
	additionalDiv.setAttribute("id", temp.m_objectid + "additionalFilterDropdown")
	additionalChipDiv.setAttribute("class", "dropdown-menu");
	
	var additionalTextDiv = document.createElement("div");
	
	additionalTextDiv.setAttribute("class", "bg-gray p-2 mb-2");
	additionalTextDiv.innerHTML=temp.m_popuptitle;
	$(additionalChipDiv).append(additionalTextDiv);*/
	
	
	//var additionalDiv = $("#"+ temp.m_objectid + "additionalFilter");
	//var additionalChipDiv = $("#"+ temp.m_objectid + "additionalFilterDropdown");
	var chipsObj = document.createElement("li")
	chipsObj.setAttribute("style", "background: "+temp.m_chipsbgcolor+"; width: fit-content;margin-left: 10px;margin-bottom:3px;margin-top:3px");
	var chipsObjLabel = document.createElement("label");
	var chipsObjSpan = document.createElement("span");
	chipsObjLabel.setAttribute("for", this.m_objectid + "filterchips" + this.m_legendObjectArr[i].legendName);
	chipsObjLabel.innerHTML = this.m_legendObjectArr[i].legendDisplayName;
	chipsObjLabel.setAttribute("style", "padding:6px 0px 5px 10px;cursor: " + this.m_cursortype + ";font-weight:" + this.m_fontweight + ";font-size:" + this.fontScaling(this.m_fontsize * 1) + "px;font-style:" +
			this.m_fontstyle + ";font-family:" + selectGlobalFont(this.m_fontfamily) + ";color:" + this.m_chipsfontcolor + ";text-decoration:" + this.m_textdecoration + ";");
	
	//chipsObjSpan.innerHTML = "<a></a>";
	chipsObj.setAttribute("id", temp.m_objectid + "" + temp.m_legendObjectArr[i].legendName);
	chipsObj.setAttribute("class", "filter-chips");
	chipsObjSpan.setAttribute("class", "closebtn bd-close");
	chipsObjSpan.setAttribute("style", "color: "+temp.m_closebtnbgcolor);
	chipsObjSpan.setAttribute("id", temp.m_legendObjectArr[i].objectid + "_" +  temp.m_legendObjectArr[i].legendName);
	$(chipsObj).append(chipsObjLabel);
	if(temp.m_legendObjectArr[i].objecttype!="radio_filter")
	$(chipsObj).append(chipsObjSpan);
	if (!IsBoolean(temp.m_designMode)) {
		chipsObjSpan.onclick = (function () {
			$(this).closest('li').remove();
			temp.m_removedChipValue = temp.m_legendObjectArr[i].legendDisplayName;
			/*var ind2 = temp.m_savedtext.indexOf(temp.m_removedChipValue);
			(ind2 >= 0) ? temp.m_savedtext.splice(ind2,1) : temp.m_savedtext;*/
			temp.updateFilter(temp.m_legendObjectArr[i].objectid, temp.m_legendObjectArr[i].legendName, temp.m_legendObjectArr[i].legendDisplayName);
			//$("#filterchipsTitleText" + temp.m_componentid).html( temp.m_chipstitle +": "+ temp.m_savedfilterschips.length);
			var timer = setInterval(removeChipsConnections1, 1000);
			function removeChipsConnections1() {
				if(!$(document).find(".blockUI").length){
					setTimeout(function(){
						temp.getDataPointAndUpdateGlobalVariable(temp.m_legendObjectArr[i].legendDisplayName, temp.m_legendObjectArr[i].legendName, temp.m_legendObjectArr[i].legendColor);
						sdk.updateFilterChips(temp.m_referenceid);
						if(temp.m_dropdown && temp.m_appendAdditionalButton){
							$("#"+temp.m_objectid + "additionalUl").css("display","block");
						}
						clearInterval(timer);
					},1);
				}
			}
			/*setTimeout(function(){
				temp.getDataPointAndUpdateGlobalVariable(temp.m_legendObjectArr[i].legendDisplayName, temp.m_legendObjectArr[i].legendName, temp.m_legendObjectArr[i].legendColor);
				//temp.draw();
				sdk.updateFilterChips(temp.m_referenceid);
				if(temp.m_dropdownopen && temp.m_appendAdditionalButton)
					$("#"+temp.m_objectid + "additionalUl").css("display","block");
			},100);*/
		});
	}
	
	/*if (!IsBoolean(temp.m_designMode)) {
		chipsObj.onclick = (function () {
			temp.getDataPointAndUpdateGlobalVariable(temp.m_legendObjectArr[i].legendDisplayName, temp.m_legendObjectArr[i].legendName, temp.m_legendObjectArr[i].legendColor);
			temp.draw();
		});
	}*/
	additionalChipDiv.append(chipsObj);
	
	
	/*for(var i=1; i<=5; i++)
		{
		var chipsObj = document.createElement("li");
		var chipsObjLabel = document.createElement("label");
		var chipsObjSpan = document.createElement("span");
		chipsObjLabel.setAttribute("for", this.m_objectid + "additonalfilterchips" + i);
		chipsObjLabel.innerHTML = "Filter "+i;
		chipsObjLabel.setAttribute("style", "margin-bottom:0px;cursor: " + this.m_cursortype + ";font-weight:" + this.m_fontweight + ";font-size:" + this.fontScaling(this.m_fontsize * 1) + "px;font-style:" +
				this.m_fontstyle + ";font-family:" + selectGlobalFont(this.m_fontfamily) + ";color:" + this.m_fontcolor + ";text-decoration:" + this.m_textdecoration + ";");
		
		chipsObjSpan.innerHTML = "&times;";
		chipsObj.setAttribute("id", temp.m_objectid + "additonalfilterchips" + i);
		chipsObjSpan.setAttribute("class", "closebtn");
		$(chipsObj).append(chipsObjLabel);
		$(chipsObj).append(chipsObjSpan);
		$(additionalChipDiv).append(chipsObj);
		
		}*/
	
	/*$(additionalDiv).append(additionalChipDiv);
	$(additionalDiv).append(additionalUl);
	
	$('#'+temp.m_objectid + "allFilterButton").click(function(){
	document.getElementById(temp.m_objectid + "additionalUl").classList.toggle("show");
	});
	
	$("#FilterChipsContainerDiv" + temp.m_objectid).append(additionalDiv);*/
	
	
};
/*DAS-473*/
FilterChips.prototype.drawSVGImage = function (container) {
	var temp = this;
	var img = this.m_imgdata;
		try {
		var str = img;
		var index = 4;
		for (var i = 0; i < $(img).length; i++) {
			if ($(img)[i].tagName != undefined && ($(img)[i].tagName).toLowerCase() == "svg") {
				index = i;
				break;
			}
		}
		if ($(img)[index] != undefined) {
			var attrs = $(img)[index].attributes;

			var viewBox;
			var height;
			var width;
			for (var i = 0; i < attrs.length; i++) {
				if (attrs[i].name == "height")
					height = attrs[i].value;
				if (attrs[i].name == "width")
					width = attrs[i].value;
				if ((attrs[i].name).toLowerCase() == "viewbox")
					viewBox = attrs[i].value;
			}
			if (viewBox == undefined) {
				viewBox = "0 0 " + height * 1 + " " + width * 1;
				str = img.replace('height="' + height + '"', 'viewBox="' + viewBox + '"');
				str = str.replace('width="' + width + '"', "");
			} else {
				str = str.replace('width="' + width + '"', "");
				str = str.replace('height="' + height + '"', "");
			}
		}
		//Removed SVG.js draw
		var svg = $.parseHTML(str);
		$(container).empty();
		$(svg).attr("id", "svgImg" + temp.m_componentid);
		$(svg).attr("class", "svgPointer");
		$(svg).css("opacity", 1);
		$(container).append(svg);
		
//			var draw = SVG("svgImg" + temp.m_objectid)
//			var store = draw.svg(str);
	} catch (e) {
		console.log(e);
		console.log("Invalid SVG Image");
	}
	}

FilterChips.prototype.drawChipsTitle = function () {
	var temp = this;
	var titleDiv = document.createElement("div");
	var titleImageSpan = document.createElement("div");
	titleImageSpan.setAttribute("id", "filterchipsimage" + temp.m_componentid);
	var titleSpan = document.createElement("span");
	titleSpan.setAttribute("id", "filterchipsTitleText" + temp.m_componentid);
	var titleCountSpan = document.createElement("span");
	titleCountSpan.setAttribute("id", "filterchipsCount" + temp.m_componentid);
	/*var mtitle = (temp.m_chipstitle == "") ? "Applied Filers" : temp.m_chipstitle;*/
	var mtitle = temp.m_chipstitle.trim();
	var chipscount = "";
	if(IsBoolean(temp.m_designMode)){
		var totalChips = temp.m_legendObjectArr.length;
	}else{
		var totalChips = temp.m_savedfilterschips.length;
	}
	if(IsBoolean(temp.m_showchipscount)){
		chipscount = (mtitle !== "") ? " : " + totalChips : totalChips;
	}
	titleSpan.innerHTML = mtitle + chipscount;	
	titleSpan.setAttribute("style", "padding: 6px 0px 6px 0px;");
	$(titleSpan).css({
	"color": convertColorToHex(this.m_fontcolor),
	"font-size": this.m_fontsize * this.minWHRatio()+"px",
	"font-family": selectGlobalFont(this.m_fontfamily),
	"font-weight": this.m_fontweight,
	"font-style": this.m_fontstyle,
	"cursor": this.m_cursortype,
	"margin":"10px"
	});
	//titleCountSpan.innerHTML = "" + temp.m_savedfilterschips.length;
	titleDiv.setAttribute("id", temp.m_objectid + "titleFilter");
	//titleDiv.setAttribute("class", "chips-title");
	
	if(this.m_imgdata != "" && this.m_imgdata != undefined)
	{
		this.drawSVGImage(titleImageSpan);
		$(titleImageSpan).css({
		"width": "26px",
    	"height": "22px",
    	"margin": "10px"
	});
	}
	else{
		titleImageSpan.setAttribute("class", "chips-title");
		$(titleImageSpan).css({
		"width": "20px",
    	"height": "22px",
    	"margin": "10px"
	});
	}
	
	
	$(titleDiv).append(titleImageSpan);
	//$(titleDiv).append(titleSpan);
	//$(titleDiv).append(titleCountSpan);
	/** Added to support scaling*/
	$(titleDiv).css({
		"display": "inline-flex",
		"padding": "6px 0px 5px 0px"
	});
	$("#FilterChipsContainerDiv" + temp.m_objectid).append(titleDiv);
	$("#FilterChipsContainerDiv" + temp.m_objectid).append(titleSpan);
};

FilterChips.prototype.calculateLegendsWidth = function () {
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
FilterChips.prototype.createSpanToCalculateWidth = function () {
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
FilterChips.prototype.getTextWidth = function (text) {
	var temp = this;
	try{
		$("#textWidthCalcDiv" + temp.m_objectid).html("" + text);
		return $("#textWidthCalcDiv" + temp.m_objectid).width();
	}catch(e){
		return this.ctx.measureText( "" + text ).width;
	}
};
FilterChips.prototype.getNoOfRows = function (extendedWidth) {
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
FilterChips.prototype.getOneRowHeight = function () {
	return (this.marginTop * 1 + this.m_legendheight * 1 + this.marginGap * 1);
};
FilterChips.prototype.getLargestLegend = function () {
	var max = 0;
	for (var i = 0; i < this.legendsWidthArray.length; i++) {
		if (this.legendsWidthArray[i] * 1 > max)
			max = this.legendsWidthArray[i];
	}
	return max;
};
FilterChips.prototype.getLegendMargins = function (extendedWidth) {
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
FilterChips.prototype.repositionLegend = function (chart) {
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

	/* draggable div width to for number of rows of chips and set margin*/
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
FilterChips.prototype.setOriginalPosition = function () {
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

FilterChips.prototype.getLegendTextHeight = function (fontsize, TextfontFamily) {
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
FilterChips.prototype.getDataPointAndUpdateGlobalVariable = function (drillDisplayName, drillField, drillColor) {
	//console.log(drillDisplayName+" , "+drillField+" , "+drillColor); // clicked Legend Value
	var fieldMap={"drillDisplayField":drillDisplayName,"drillField":drillField};
	this.updateDataPoints(fieldMap, drillColor);
};
//# sourceURL=FilterChips.js