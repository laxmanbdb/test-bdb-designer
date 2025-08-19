/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: WordCloudChart.js
 * @description WordCloud chart
 **/
function WordCloudChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();
	this.m_x = 400;
	this.m_y = 240;
	this.m_width = 300;
	this.m_height = 240;

	this.m_categoryNames = [];
	this.m_seriesNames = [];
	this.m_confidenceNames = [];
	this.m_categoryData = [];
	this.m_seriesData = [];
	this.m_confidenceData = [];

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_isCategoryAvailable = true;

	this.m_shuffledtext = true;
	this.m_nthtextvalue = 10;
	this.m_showntext = false;
	this.m_maxvalue = 0;
	this.m_minvalue = 0;
	this.m_cmaxvalue = 0;
	this.m_cminvalue = 0;
	this.m_maxvaluefontsize = 45;
	this.m_minvaluefontsize = 8;
	this.m_rotatetext = true;

	this.m_excludepronouns = true;
	this.m_excludedwords = "all,another,any,anybody,anyone,anything,both,each,each other,either,everybody,everyone,everything,few,he,her,hers,herself,him,himself,his,I,it,its,itself,little,many,me,mine,more,most,much,my,myself,neither,no one,nobody,none,nothing,one,one another,other,others,our,ours,ourselves,several,she,some,somebody,someone,something,that,their,theirs,them,themselves,these,they,this,those,us,we,what,whatever,which,whichever,who,whoever,whom,whomever,whose,you,your,yours,yourself,yourselves";

	this.m_range1 = [];
	this.m_range2 = [];
	this.m_color = [];
	this.m_ranges = "0-20,20-100";
	this.m_colors = "#cccccc,26265";
	this.m_rangecolorbarwidth = 15;
	this.m_rangecolorbartextwidth = 20;
	this.m_highlightcolor = "#fff2a8";
	this.m_userandomcolor = true;
	this.m_showrangebar = false;
	this.m_wordfontfamily = "Roboto";
	this.m_converttolowercase = false;
};

WordCloudChart.prototype = new Chart();

WordCloudChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

WordCloudChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
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

WordCloudChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

WordCloudChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.m_draggableDiv.style.overflow = "hidden";
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

WordCloudChart.prototype.setDraggableCanvasSize = function () {
	var draggableCanvas = document.getElementById("draggableCanvas" + this.m_objectid);
	if (draggableCanvas != "" && draggableCanvas != undefined) {
		var topMargin = (this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
		//draggableCanvas.height = topMargin;
		draggableCanvas.height = this.m_height;
		draggableCanvas.width = this.m_width;
	}
};

WordCloudChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

WordCloudChart.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	var categoryJson = [];
	var seriesJson = [];
	var confidenceJson = [];
	this.m_fieldsJson = fieldsJson;
	for (var i = 0; i < fieldsJson.length; i++) {
		var fieldType = this.getProperAttributeNameValue(fieldsJson[i], "Type");
		switch (fieldType) {
		case "Category":
			categoryJson.push(fieldsJson[i]);
			break;
		case "Series":
			seriesJson.push(fieldsJson[i]);
			break;
		case "CalculatedField":
			seriesJson.push(fieldsJson[i]);
			break;
		case "Lift":
			seriesJson.push(fieldsJson[i]);
			break;
		case "Confidence":
			confidenceJson.push(fieldsJson[i]);
			break;
		default:
			break;
		}
	}
	if (categoryJson.length > 0) {
		this.m_isCategoryAvailable = true;
		this.setCategory(categoryJson);
		this.setSeries(seriesJson);
		this.setConfidence(confidenceJson);
	} else {
		this.m_isCategoryAvailable = false;
	}
};

WordCloudChart.prototype.setCategory = function (categoryJson) {
	this.m_categoryNames = [];
	this.m_allCategoryNames = [];
	this.m_allCategoryDisplayNames = [];
	this.m_categoryDisplayNames = [];
	this.m_categoryVisibleArr = {};
	var count = 0;
	// only one category can be set for pie chart, preference to first one
	for (var i = 0; i < categoryJson.length; i++) {
		this.m_allCategoryNames[i] = this.getProperAttributeNameValue(categoryJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(categoryJson[i], "DisplayName"));
		this.m_allCategoryDisplayNames[i] = m_formattedDisplayName;
		var isVisible = this.getProperAttributeNameValue(categoryJson[i], "visible");
		this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]] = isVisible;
		if (IsBoolean(isVisible)) {
			this.m_categoryDisplayNames[count] = m_formattedDisplayName;
			this.m_categoryNames[count] = this.getProperAttributeNameValue(categoryJson[i], "Name");
			count++;
		}
	}
};

WordCloudChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesVisibleArr = {};
	this.m_allSeriesDisplayNames = [];
	this.m_allSeriesNames = [];
	var count = 0;
	for (var i = 0; i < seriesJson.length; i++) {
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.m_allSeriesDisplayNames[i] = m_formattedDisplayName;
		this.m_allSeriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
		var isVisible = this.getProperAttributeNameValue(seriesJson[i], "visible");
		this.m_seriesVisibleArr[this.m_allSeriesDisplayNames[i]] = isVisible;
		if (IsBoolean(isVisible)) {
			this.m_seriesDisplayNames[count] = m_formattedDisplayName;
			this.m_seriesNames[count] = this.getProperAttributeNameValue(seriesJson[i], "Name");
			count++;
		}
	}
};

WordCloudChart.prototype.setConfidence = function (confidenceJson) {
	this.m_confidenceNames = [];
	this.m_allConfidenceNames = [];
	this.m_confidenceDisplayNames = [];
	var count = 0;
	for (var i = 0; i < confidenceJson.length; i++) {
		this.m_allConfidenceNames[i] = this.getProperAttributeNameValue(confidenceJson[i], "Name");
		var isVisible = this.getProperAttributeNameValue(confidenceJson[i], "visible");
		this.m_confidenceNames[i] = this.getProperAttributeNameValue(confidenceJson[i], "Name");
		if (IsBoolean(isVisible)) {
			this.m_confidenceNames[count] = this.getProperAttributeNameValue(confidenceJson[i], "Name");
			var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(confidenceJson[i], "DisplayName"));
			this.m_confidenceDisplayNames[count] = m_formattedDisplayName;
			count++;
		}
	}
};

WordCloudChart.prototype.getAllCategoryNames = function () {
	return this.m_allCategoryNames;
};
WordCloudChart.prototype.getAllSeriesNames = function () {
	return this.m_allSeriesNames;
};
WordCloudChart.prototype.getAllConfidenceNames = function () {
	return this.m_allConfidenceNames;
};

WordCloudChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};

WordCloudChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

WordCloudChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};

WordCloudChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};

WordCloudChart.prototype.getConfidenceNames = function () {
	return this.m_confidenceNames;
};

WordCloudChart.prototype.getConfidenceDisplayNames = function () {
	return this.m_confidenceDisplayNames;
};
/** @description Setter Method of AllFieldsName **/
WordCloudChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getAllCategoryNames().length; i++) {
		this.m_allfieldsName.push(this.getAllCategoryNames()[i]);
	}
	for (var j = 0; j < this.getAllSeriesNames().length; j++) {
		this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
	}
	for (var k = 0; k < this.getAllConfidenceNames().length; k++) {
		this.m_allfieldsName.push(this.getAllConfidenceNames()[k]);
	}
};
/** @description Getter Method of AllFieldsName **/
WordCloudChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};
WordCloudChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
};

WordCloudChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0; i < this.getSeriesNames().length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
};

WordCloudChart.prototype.setConfidenceData = function () {
	this.m_confidenceData = [];
	if (this.getConfidenceNames()[0] != undefined) {
		for (var i = 0; i < this.getConfidenceNames().length; i++) {
			this.m_confidenceData[i] = this.getDataFromJSON(this.getConfidenceNames()[i]);
		}
	} else {
		this.m_confidenceData = this.m_seriesData;
	}
};

WordCloudChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

WordCloudChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

WordCloudChart.prototype.getConfidenceData = function () {
	return this.m_confidenceData;
};

WordCloudChart.prototype.init = function () {
	this.setPronounsMap();
	this.initializeColor();
	this.getRanges();
	/** Pronouns should be removed before limiting the words **/
	this.excludePronounsFromDataProvider();
	this.showLimitedWords();
	this.shuffleDataProvider();

	this.setCategoryData();
	this.setSeriesData();
	this.setConfidenceData();
	this.setAllFieldsName();

	this.isSeriesDataEmpty();
	this.m_chartFrame.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);

	if (!IsBoolean(this.m_isEmptySeries)){
		this.setMaxMinFrequencyOfWords();
		this.setMaxMinConfidenceOfWords();
	}
	this.setRangeColorBarTextWidth();
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};

/**@description checking the width for range bar markers **/
WordCloudChart.prototype.setRangeColorBarTextWidth = function () {
	this.ctx.font = "12px "+ selectGlobalFont(this.m_wordfontfamily);
	if(IsBoolean(this.m_showdynamicrange)){
		this.m_rangecolorbartextwidth = Math.max( this.ctx.measureText(this.m_cminvalue).width, this.ctx.measureText(this.m_cmaxvalue).width );
	}else{
		var temp = this;
		var arr = this.m_range1.concat(this.m_range2);
		var widthArr = arr.map(function(num) {
			return temp.ctx.measureText(num).width;
		});
		this.m_rangecolorbartextwidth = Math.max.apply(Math, widthArr);
	}
};

WordCloudChart.prototype.setPronounsMap = function () {
	if (IsBoolean(this.m_excludepronouns)) {
		var pronounArray = (this.m_excludedwords) ? this.m_excludedwords.split(",") : [];
		this.m_pronounsmap = new Object();
		for (var i = 0; i < pronounArray.length; i++) {
			this.m_pronounsmap[("" + pronounArray[i]).toLowerCase()] = ("" + pronounArray[i]).toLowerCase();
		}
	}
};

WordCloudChart.prototype.getPronounsMap = function () {
	return this.m_pronounsmap;
};

WordCloudChart.prototype.initializeColor = function () {
	this.m_color = [];
	if (!IsBoolean(this.m_userandomcolor)) {
		var color = this.m_colors.split(",");
		for (var i = 0; i < color.length; i++) {
			if (color[i] != undefined)
				this.m_color[i] = convertColorToHex(color[i]);
			else
				this.m_color[i] = this.m_color[i - 1];
		}
	}
};

WordCloudChart.prototype.getRanges = function () {
	if (!IsBoolean(this.m_userandomcolor)) {
		this.m_range = this.m_ranges.split(",");
		this.m_range1 = [];
		this.m_range2 = [];

		for (var i = 0; i < this.m_range.length; i++) {
			var splitter = this.m_range[i].indexOf("~") > -1 ? "~" : "-";
			var m_rangeForLegend = (this.m_range[i].split(splitter));
			this.m_range1[i] = m_rangeForLegend[0];
			this.m_range2[i] = m_rangeForLegend[1];
		}

		Array.prototype.max = function () {
			return Math.max.apply(null, this);
		};

		Array.prototype.min = function () {
			return Math.min.apply(null, this);
		};

		this.m_minRangeValue = [this.m_range1.min(), this.m_range2.min()].min();
		this.m_maxRangeValue = [this.m_range1.max(), this.m_range2.max()].max();
	}
};

WordCloudChart.prototype.showLimitedWords = function () {
	var data = this.getDataProvider();
	if (IsBoolean(this.m_showntext)) {
		var seriesName = this.m_seriesNames[0];
		var sortData = data.sort(function (a, b) {
				return b[seriesName] - a[seriesName]; // Descending Order.
			});

		this.m_dataProvider = [];
		for (var i = 0; i < this.m_nthtextvalue; i++) {
			if (i < data.length)
				this.m_dataProvider[i] = sortData[i];
		}
	}
};

WordCloudChart.prototype.shuffleDataProvider = function () {
	var sourceArray = this.getDataProvider();
		if (IsBoolean(this.m_shuffledtext)) {
			for (var n = 0; n < sourceArray.length - 1; n++) {
				var k = n + Math.floor(Math.random() * (sourceArray.length - n));
				var temp = sourceArray[k];
				sourceArray[k] = sourceArray[n];
				sourceArray[n] = temp;
			}
			this.m_dataProvider = sourceArray;
		}
};

WordCloudChart.prototype.excludePronounsFromDataProvider = function () {
	if (IsBoolean(this.m_excludepronouns)) {
		for (var ii = 0; ii < this.getCategoryNames().length; ii++) {
			var fieldName = this.getCategoryNames()[ii];
			if (ii == 0) {
				var data = [];
				for (var i = 0; i < this.getDataProvider().length; i++) {
					if(this.getDataProvider()[i] !== null){
						if (IsBoolean(this.m_excludepronouns)) {
							var val = this.getDataProvider()[i][fieldName];
							if (val && this.getPronounsMap()[val.toString().toLowerCase()] != val.toString().toLowerCase())
								data.push(this.getDataProvider()[i]);
						} else{
							data.push(this.getDataProvider()[i]);
						}
					}
				}
				this.m_dataProvider = data;
			}
		}
	}
};

WordCloudChart.prototype.setMaxMinFrequencyOfWords = function () {
	var arr = this.getSeriesData()[0];
	/** Clean the data before calculating min-max, getting max and min as NAN when first element of an array is NAN **/
	var data = arr.filter(function(n){ return (n != undefined && n != "" && !isNaN(n*1) ) }); 
	for (var i = 0; i < data.length; i++) {
		if (i == 0) {
			this.m_maxvalue = data[i] * 1;
			this.m_minvalue = data[i] * 1;
		}
		if ((data[i] * 1) >= this.m_maxvalue * 1)
			this.m_maxvalue = data[i] * 1;
		if ((data[i] * 1) <= this.m_minvalue * 1)
			this.m_minvalue = data[i] * 1;
	}
};
WordCloudChart.prototype.setMaxMinConfidenceOfWords = function () {
	var arr = this.getConfidenceData()[0];
	this.m_cmaxvalue = 0;
	this.m_cminvalue = 0;
	/** Clean the data before calculating min-max, getting max and min as NAN when first element of an array is NAN **/
	var data = arr.filter(function(n){ return (n != undefined && n != "" && !isNaN(n*1) ) }); 
	for (var i = 0; i < data.length; i++) {
		if (i == 0) {
			this.m_cmaxvalue = data[i] * 1;
			this.m_cminvalue = data[i] * 1;
		}
		if ((data[i] * 1) >= this.m_cmaxvalue * 1)
			this.m_cmaxvalue = data[i] * 1;
		if ((data[i] * 1) <= this.m_cminvalue * 1)
			this.m_cminvalue = data[i] * 1;
	}
};
WordCloudChart.prototype.drawChart = function () {
	var temp = this;
	if (IsBoolean(this.m_isEmptySeries)){
		document.getElementById("draggableCanvas" + temp.m_objectid).height = this.m_height;
	}
	this.ctx.clearRect(this.m_x, this.m_y, this.m_width, this.m_height);
	this.drawChartFrame();
	this.drawTitle();
	this.drawSubTitle();
	//to remove the canvas if title/subtitle not present
	//this.removeCanvasFromDiv();
	if (!IsBoolean(this.m_isEmptySeries)) {
		var mainDiv = this.drawWordCloudChart();
		this.drawRangeColorBar();
		this.drawCloud(mainDiv);
	} else {
		$("#tagCloudDiv" + temp.m_objectid).remove();
		$("#draggableCanvas" + temp.m_objectid).css("display", "block");
		this.drawMessage(this.m_status.noData);
	}
};

WordCloudChart.prototype.removeCanvasFromDiv = function () {
	var temp = this;
	//Removing canvas if there is no title and subtitle
	if ((!IsBoolean(this.getShowGradient())) && (!IsBoolean(this.m_showmaximizebutton)) && (!IsBoolean(this.getTitle().m_showtitle)) && (!IsBoolean(this.m_subTitle.m_showsubtitle)))
		$("#draggableCanvas" + temp.m_objectid).css("display", "none");
	else
		$("#draggableCanvas" + temp.m_objectid).css("display", "block");

};
WordCloudChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

WordCloudChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

WordCloudChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

WordCloudChart.prototype.drawRangeColorBarRanges = function (height) {
	var temp = this;
	$("#colorRangeBarRangesDiv" + temp.m_objectid).remove();
	var outerDiv = document.createElement("div");
	var topMargin = (this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
	topMargin = (topMargin == 0) ? 10 : topMargin;
	outerDiv.id = "colorRangeBarRangesDiv" + this.m_objectid;
	outerDiv.style.width = this.m_rangecolorbartextwidth+"px";
	outerDiv.style.height = height + "px";
	outerDiv.style.display = "inline-block";
	outerDiv.style.top = topMargin + "px";
	outerDiv.style.position = "absolute";
	outerDiv.style.left = "4px";
	//outerDiv.style.border = "1px solid black";

	this.m_title.m_titleBarHeight;
	
	var range1 = (!IsBoolean(this.m_showdynamicrange)) ? (this.m_range1) : [parseInt(this.m_cminvalue)];
	var range2 = (!IsBoolean(this.m_showdynamicrange)) ? (this.m_range2) : [parseInt((this.m_cmaxvalue*1 + this.m_cminvalue*1)/2), parseInt(this.m_cmaxvalue)];

	for (var i = (range2.length - 1); i >= -1; i--) {
		var innerDiv = document.createElement("div");
		innerDiv.id = "colorRangeBarRangesTextDiv" + this.m_objectid;
		innerDiv.style.verticalAlign = "bottom";
		innerDiv.style.textAlign = "center";
		var text = document.createElement("span");
		text.style.height = "inherit";
		// text.style.display = "table-cell";
		text.style.fontSize = temp.fontScaling(12)+"px";
		text.style.fontFamily = selectGlobalFont(temp.m_wordfontfamily);
		if (i == -1) {
			text.innerHTML = range1[0];
			text.style.verticalAlign = "bottom";
			innerDiv.style.marginTop = "-5px";
		} else {
			innerDiv.style.height = (height / range2.length) + "px";
			text.innerHTML = range2[i];
			text.style.verticalAlign = "top";
		}
		innerDiv.appendChild(text);
		outerDiv.appendChild(innerDiv);
	}
	$("#draggableDiv" + temp.m_objectid).append(outerDiv);
};

WordCloudChart.prototype.drawRangeColorBar = function () {
	var temp = this;
	if (!IsBoolean(this.m_userandomcolor)) {
		if (IsBoolean(this.m_showrangebar)) {
			var topMargin = (this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
			topMargin = (topMargin == 0) ? 10 : topMargin;
			var height = this.m_height - topMargin - 20;
			this.drawRangeColorBarRanges(height);
			var color = (!IsBoolean(this.m_showdynamicrange)) ? (this.m_color) : ([this.m_minrangecolor,this.m_maxrangecolor]);
			var range1 = (!IsBoolean(this.m_showdynamicrange)) ? (this.m_range1) : [parseInt(this.m_minvalue), parseInt(this.m_maxvalue/2)];
			var range2 = (!IsBoolean(this.m_showdynamicrange)) ? (this.m_range2) : [parseInt(this.m_maxvalue/2), parseInt(this.m_maxvalue)];
		
			//var left = temp.ctx.measureText(range2).width*1 + 2; 
			var left = this.m_rangecolorbartextwidth*1 + 8;
			$("#colorRangeBarDiv" + temp.m_objectid).remove();
			var mainDiv = document.createElement("div");
			mainDiv.id = "colorRangeBarDiv" + temp.m_objectid;
			mainDiv.style.height = height + "px";
			mainDiv.style.cursor = "pointer";
			mainDiv.style.width = this.m_rangecolorbarwidth + "px";
			mainDiv.style.display = "inline-block";
			mainDiv.style.top = topMargin + "px";
			mainDiv.style.position = "absolute";
			mainDiv.style.left = (left * 1) + "px";
			for (var i = (color.length - 1); i >= 0; i--) {
				var colorRangeDiv = document.createElement("div");
				colorRangeDiv.style.height = (height / color.length) + "px";
				colorRangeDiv.id = temp.m_objectid + "colorRangeBar" + i;
				colorRangeDiv.setAttribute("class", "colorRangeBarSection" + this.m_objectid);
				colorRangeDiv.style.backgroundColor = color[i];
				colorRangeDiv.title = range1[i] + " to " + range2[i];
				colorRangeDiv.onclick = function () {
					$(".colorRangeBarSection" + temp.m_objectid).css("border", "0px solid #cccccc");
					$(".wordCloudText" + temp.m_objectid).css("background", "transparent");

					if (!$("#" + this.id).hasClass("selectedRangeBar")) {
						$(".colorRangeBarSection" + temp.m_objectid).removeClass("selectedRangeBar");
						$(this).addClass("selectedRangeBar");
						$(this).css("border", "1px solid #000000");

						$("." + this.id).css("background", convertColorToHex(temp.m_highlightcolor));
					} else {
						$(this).removeClass("selectedRangeBar");
					}
				};
				mainDiv.appendChild(colorRangeDiv);
			}
			$("#draggableDiv" + temp.m_objectid).append(mainDiv);
		} else {
			$("#colorRangeBarRangesDiv" + temp.m_objectid).remove();
			$("#colorRangeBarDiv" + temp.m_objectid).remove();
		}
	} else {
		$("#colorRangeBarRangesDiv" + temp.m_objectid).remove();
		$("#colorRangeBarDiv" + temp.m_objectid).remove();
	}
};

WordCloudChart.prototype.drawWordCloudChart = function () {
	var temp = this;
	var width = this.m_width * 1;
	var scrollMargin = 1;
	var topMargin = (this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
	var height = this.m_height - topMargin - scrollMargin;

	var rangecolorbarmargin = 0;
	if (!IsBoolean(this.m_userandomcolor) && IsBoolean(this.m_showrangebar)) {
		rangecolorbarmargin = this.m_rangecolorbarwidth * 1 + this.m_rangecolorbartextwidth * 1 + 5 * 1;
	}

	//Removing treemapdiv before creating new div
	$("#tagCloudDiv" + temp.m_objectid).remove();
	var mainDiv = document.createElement("div");
	mainDiv.id = "tagCloudDiv" + temp.m_objectid;
	if (IsBoolean(this.m_showborder)) {
		mainDiv.style.width = (this.m_width * 1 - rangecolorbarmargin * 1 - 4) + "px";
		mainDiv.style.left = (rangecolorbarmargin * 1 + 2) + "px";
	} else {
		mainDiv.style.width = this.m_width - rangecolorbarmargin + "px";
		mainDiv.style.left = rangecolorbarmargin + "px";
	}
	mainDiv.style.height = height + "px";
	mainDiv.style.verticalAlign = "middle";
	//mainDiv.style.background = hex2rgb("#ffffff",this.m_bgalpha);
	mainDiv.style.display = "table-cell";
	mainDiv.style.textAlign = "center";
	mainDiv.style.top = topMargin + "px";
	mainDiv.style.position = "absolute";
	mainDiv.style.overflowY = "auto";
	mainDiv.style.overflowX = "auto";

	$("#textWidthCalcDiv" + temp.m_objectid).remove();
	var textWidthDiv = document.createElement("div");
	textWidthDiv.id = "textWidthCalcDiv" + temp.m_objectid;
	textWidthDiv.style.position = "absolute";
	textWidthDiv.style.float = "left";
	textWidthDiv.style.whiteSpace = "nowrap";
	textWidthDiv.style.visibility = "hidden";
	textWidthDiv.style.display = "none";
	textWidthDiv.style.font = "0px " + selectGlobalFont(this.m_wordfontfamily);
	document.body.appendChild(textWidthDiv);

	$("#textWidthCalcSpan" + temp.m_objectid).remove();
	var textWidthSpan = document.createElement("span");
	textWidthSpan.style.position = "absolute";
	textWidthSpan.id = "textWidthCalcSpan" + temp.m_objectid;
	document.body.appendChild(textWidthSpan);

	$("#textWidthCalcBlock" + temp.m_objectid).remove();
	var textWidthBlock = document.createElement("div");
	textWidthBlock.id = "textWidthCalcBlock" + temp.m_objectid;
	textWidthBlock.style.display = "inline-block";
	textWidthBlock.style.position = "absolute";
	textWidthBlock.style.verticalAlign = "bottom";
	textWidthBlock.style.width = "1px";
	textWidthBlock.style.height = "0px";
	document.body.appendChild(textWidthBlock);

	$("#draggableDiv" + temp.m_objectid).css("overflow-x", "hidden");
	$("#draggableDiv" + temp.m_objectid).css("overflow-y", "hidden");
	$("#draggableDiv" + temp.m_objectid).css("background", hex2rgb("#ffffff", this.m_bgalpha));
	$("#draggableDiv" + temp.m_objectid).append(mainDiv);
	return mainDiv;
};

WordCloudChart.prototype.drawCloud = function (mainDiv) {
	try {
		this.drawWordCloudText(mainDiv, 0);
	} catch (e) {
		console.log("error in calculation of word cloud!");
	}
};

WordCloudChart.prototype.drawWordCloudText = function (mainDiv, indexLimit) {
	var temp = this;
	var getSeriesData = this.getSeriesData()[0];	
	for (var i = indexLimit*temp.m_chunkdatalimit; i < getSeriesData.length; i++) {
		if(i<(indexLimit+1)*temp.m_chunkdatalimit){
			temp.drawWordInDiv(i,mainDiv);
		} else {
			setTimeout(function () {
				if(++indexLimit*temp.m_chunkdatalimit < getSeriesData.length)
					temp.drawWordCloudText(mainDiv, indexLimit);
			}, temp.m_chunkdatatimeout);
			break;
		}
	}
};

WordCloudChart.prototype.drawWordInDiv = function (i,mainDiv) {
	var temp = this;
	var getCategoryData = this.getCategoryData()[0];
	var getSeriesData = this.getSeriesData()[0];
	var getColorData = this.getConfidenceData()[0];
	
	var calcFont = this.getFontRatio(getSeriesData[i]);
	var textDiv = document.createElement("div");
	textDiv.className = "cloudTextDiv";
	textDiv.id = "cloudTextDiv" + i;

	var word = this.getWordWithFontCase(getCategoryData[i]);

	var maxSizeText = this.getTextWidth(word, calcFont);

	textDiv.innerHTML = word;
	textDiv.style.fontSize = calcFont + "px";
	textDiv.style.fontFamily = selectGlobalFont(this.m_wordfontfamily);
	if (IsBoolean(this.m_customtextboxfortooltip.dataTipType=="None")){
		textDiv.title = word + " (" + getSeriesData[i] + ") ";
	}
	textDiv.style.display = "inline-block";
	textDiv.style.padding = "0 2px";
	textDiv.style.overflow = "hidden";
	if (IsBoolean(this.m_userandomcolor)) {
		wordColor = convertColorToHex(getRandomColor());
		textDiv.style.color = hex2rgb(wordColor, this.m_fillopacity);
	} else {
		//var wordColor = hex2rgb(this.getColorAsRange(getColorData[i]).color, this.m_fillopacity);
		var wordColor = (!IsBoolean(this.m_showdynamicrange)) ? 
				(hex2rgb(this.getColorAsRange(getColorData[i]).color, this.m_fillopacity)) : 
					(hex2rgb(this.getColorAsRange(getColorData[i]).color, this.m_fillopacity));
		textDiv.style.color = wordColor;
		textDiv.setAttribute("class", "wordCloudText" + this.m_objectid + " " + this.getColorAsRange(getColorData[i]).cssClass);
	}

	if (IsBoolean(this.m_rotatetext)) {
		if (i % 5 == 0 && maxSizeText < 40) {
			this.rotateText(i, getSeriesData[i], word, textDiv, calcFont);
		}
	}

	var data = [];
	data[0] = {
		"text" : word,
		"value" : word,
		"color" : wordColor
	};
	data[1] = {
		"text" : this.m_seriesDisplayNames[0],
		"value" : getSeriesData[i]
	};
	if(this.m_confidenceDisplayNames.length !== 0 ){
		data[2] = {
			"text" : this.m_confidenceDisplayNames[0],
			"value" : getColorData[i]
		};
	}
	$(textDiv).data("data", data);

	if (IsBoolean(this.m_customtextboxfortooltip.dataTipType!=="None")) {
		var oldColor;
		textDiv.onmouseover = function (e) {
			oldColor = this.style.color;
			this.style.cursor = "pointer";
			this.style.color = "#cff400";
			if (!temp.m_designMode) {
				temp.showTooltipOnText(e, $(this).data("data"));
			}
		};
		textDiv.onmouseout = function (e) {
			this.style.color = oldColor;
			temp.hideTooltipOnText(e);
		};
	}
	textDiv.onclick = function (e) {
		if ("ontouchstart" in document.documentElement) {
			onMouseMove(temp);
		} else {
			var fieldNameValueMap = {};
			fieldNameValueMap = temp.getFieldNameValueMap(i);
			var drillColor = data[0]["color"];
			temp.updateDataPointsToGV( { "drillRecord":fieldNameValueMap, "drillColor":drillColor });
		}
	};
	$(textDiv)[0].addEventListener("touchstart", function(event) {
		if (singleClickTimer == null) {
			singleClickTimer = setTimeout(function() {
				singleClickTimer = null;
				onMouseMove(temp);
			}, temp.m_doubletaptimeout);
		} else {
			clearTimeout(singleClickTimer);
			singleClickTimer = null;
			var fieldNameValueMap = {};
			fieldNameValueMap = temp.getFieldNameValueMap(i);
			var drillColor = data[0]["color"];
			temp.updateDataPointsToGV( { "drillRecord":fieldNameValueMap, "drillColor":drillColor } );
		}
	}, false);
	mainDiv.appendChild(textDiv);
};
WordCloudChart.prototype.getWordWithFontCase = function (word) {
	switch (this.m_wordcase) {
	case "none":
		return word;
		break;
	case "lower":
		return word.toLowerCase();
		break;
	case "upper":
		return word.toUpperCase();
		break;
	case "title":
		function toTitleCase(str) {
			return ("" + str).replace(/\w\S*/g, function (txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		}
		return toTitleCase(word);
		break;
	default:
		return word;
		break;
	}
};

WordCloudChart.prototype.getColorAsRange = function (data) {
	var color = "#CCCCCC";
	var index = 0;
	if(!IsBoolean(this.m_showdynamicrange)){
		for (var i = 0; i < this.m_range1.length; i++) {
			if (data * 1 >= this.m_range1[i] * 1 && data * 1 < this.m_range2[i] * 1) {
				color = this.m_color[i];
				index = i;
				break;
			}
		}
		if (data * 1 <= this.m_range1[0] * 1) {
			color = this.m_color[0];
			index = 0;
		}
		if (data * 1 >= this.m_range2[this.m_range2.length - 1] * 1) {
			color = this.m_color[this.m_range2.length - 1];
			index = this.m_range2.length - 1;
		}
	}
	else{
		var mid = (this.m_cmaxvalue*1 + this.m_cminvalue*1)/2;
		if((data*1 >= this.m_cminvalue) && (data*1 < mid)){
			color = this.m_minrangecolor;
			index = 0;
		}else if((data*1 >= mid) && (data*1 <= this.m_cmaxvalue)){
			color = this.m_maxrangecolor;
			index = 1;
		}
	}
	return {
		"color" : color,
		"cssClass" : this.m_objectid + "colorRangeBar" + index
	};
};

WordCloudChart.prototype.createShuffledArray = function (from, to) {
	var i = to - from + 1;
	var a = Array(i);
	while (i) {
		var j = Math.floor(Math.random() * i--);
		var temp = isNaN(a[i]) ? (i + from) : a[i];
		a[i] = isNaN(a[j]) ? (j + from) : a[j];
		a[j] = temp;
	}
	return a;
};

WordCloudChart.prototype.getTextWidth = function (text, font) {
	var w = 0;
	var temp = this;

	$("#textWidthCalcDiv" + temp.m_objectid).css({
		"font" : font + "px " + selectGlobalFont(this.m_wordfontfamily)
	});
	$("#textWidthCalcDiv" + temp.m_objectid).html("" + text);
	w = $("#textWidthCalcDiv" + temp.m_objectid).width();
	return w;
};

WordCloudChart.prototype.getTextHeight = function (word, font) {
	var height = 0;
	var temp = this;
	$("#textWidthCalcSpan" + temp.m_objectid).css({
		"font" : font + "px " + selectGlobalFont(this.m_wordfontfamily)
	});
	$("#textWidthCalcSpan" + temp.m_objectid).html("" + word);
	try {
		//height = $("#textWidthCalcBlock" + temp.m_objectid).offset().top - $("#textWidthCalcSpan" + temp.m_objectid).offset().top;
		height = $("#textWidthCalcSpan" + temp.m_objectid)[0].clientHeight;
	} catch (e) {
		console.log(e);
	}
	$("#textWidthCalcSpan" + temp.m_objectid).html("");
	return height;
};

WordCloudChart.prototype.rotateText = function (i, freuqency, text, textDiv, calcFont) {
	var textHeight = this.getTextHeight(text, calcFont);
	textDiv.style.width = textHeight + "px";
	textDiv.style.lineHeight = "1";
	textDiv.innerHTML = "";
	var rotateDiv = document.createElement("div");
	rotateDiv.id = "rotated" + i;
	rotateDiv.className = "rotated";
	rotateDiv.innerHTML = text;
	rotateDiv.style.fontSize = calcFont + "px";
	textDiv.appendChild(rotateDiv);
};

WordCloudChart.prototype.getFontRatio = function (data) {
	var numerator = (this.m_maxvalue == this.m_minvalue) ? 1 : data - this.m_minvalue;
	var denominator = (this.m_maxvalue == this.m_minvalue) ? 1 : this.m_maxvalue - this.m_minvalue;
	var percentage = numerator / denominator;
	var fontWeight = percentage * (this.m_maxvaluefontsize - this.m_minvaluefontsize) * 1 + this.m_minvaluefontsize * 1;
	return fontWeight;
};

WordCloudChart.prototype.showTooltipOnText = function (e, data) {
	var temp = this;
	var toolTipData = temp.getToolTipData(data,e);
	if (temp.m_hovercallback && temp.m_hovercallback != "") {
		temp.drawCallBackContent(mouseX, mouseY, toolTipData);
	} else {
		temp.drawTooltipContent(toolTipData);
	}
};

WordCloudChart.prototype.drawTooltipContent = function (toolTipData) {
	this.m_tooltip.draw(toolTipData, this.m_componenttype);
};

WordCloudChart.prototype.hideTooltipOnText = function (e) {
	$("#toolTipDiv").remove();
};

WordCloudChart.prototype.getStartX = function () {
	var marginForYAxisLabels = 0;
	return (this.m_x + marginForYAxisLabels);
};

WordCloudChart.prototype.getStartY = function () {
	var marginForXAxisLabels = 0;
	return (this.m_y + this.m_height - marginForXAxisLabels);
};

WordCloudChart.prototype.getEndX = function () {
	var rightSideMargin = 0;
	return (this.m_x + this.m_width - rightSideMargin);
};

WordCloudChart.prototype.getEndY = function () {
	return (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};

WordCloudChart.prototype.getToolTipData = function (data,e) {
	var toolTipData = {};
	toolTipData.cat = "";
	toolTipData.data = new Array();
	var dataArr = [];
	for(var i = 0; data.length > i; i++){
		if (data[i].value == "" || isNaN(data[i].value) || data[i].value == null || data[i].value == "null") {
			data[i].value = data[i].value;
        } else {
            var num = data[i].value * 1;
            if (num % 1 != 0 && this.m_tooltipprecision !== "default") {
            	data[i].value = num.toFixed(this.m_tooltipprecision);
            } else {
            	data[i].value = num * 1;
            }
        }
	}
	toolTipData.data = data;
	return toolTipData;
};

WordCloudChart.prototype.drawTooltip = function (mouseX, mouseY) {
	// not required from canvas or div's hover event
};
//# sourceURL=WordCloudChart.js