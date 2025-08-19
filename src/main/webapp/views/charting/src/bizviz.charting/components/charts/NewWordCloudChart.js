/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: NewWordCloudChart.js
 * @description NewWordCloud chart
 **/
function NewWordCloudChart(m_chartContainer, m_zIndex) {
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
	this.m_chartData = [];

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_isCategoryAvailable = true;

	this.m_shuffledtext = false;
	this.m_nthtextvalue = 10;
	this.m_maxtextvalue = 2000;
	this.m_showntext = false;
	this.m_maxvalue = 0;
	this.m_minvalue = 0;
	this.m_cmaxvalue = 0;
	this.m_cminvalue = 0;
	this.m_maxvaluefontsize = 60;
	this.m_minvaluefontsize = 20;
	this.m_rotatetext = true;

	this.m_excludepronouns = true;
	this.m_excludedwords = "all,another,any,anybody,anyone,anything,both,each,each other,either,everybody,everyone,everything,few,he,her,hers,herself,him,himself,his,I,it,its,itself,little,many,me,mine,more,most,much,my,myself,neither,no one,nobody,none,nothing,one,one another,other,others,our,ours,ourselves,several,she,some,somebody,someone,something,that,their,theirs,them,themselves,these,they,this,those,us,we,what,whatever,which,whichever,who,whoever,whom,whomever,whose,you,your,yours,yourself,yourselves";

	this.m_range1 = [];
	this.m_range2 = [];
	this.m_color = [];
	this.m_ranges = "0-20,20-100";
	this.m_colors = "#cccccc,26265";
	this.m_defaultcolor = "#808080";
	this.m_cloudgradients = "#216cdf, #285bbb, #284b99, #253b77, #202c58";
	this.m_rangecolorbarwidth = 15;
	this.m_rangecolorbartextwidth = 20;
	this.m_highlightcolor = "#fff2a8";
	this.m_highlightfontsize = "12";
	this.m_userandomcolor = true;
	this.m_showrangebar = false;
	this.m_wordfontfamily = "BizvizFont";
	this.m_layoutanimation = false;
	this.m_wordcloudshape = "square";
	this.m_rotationrangemin = "0";
	this.m_rotationrangemax = "90";
	this.m_rotationrangestep = "90";
	this.m_shadowdepth= "0";
	this.m_shadowoffestx= "0";
	this.m_shadowoffesty= "0";
	this.m_shadowcolor= "#fff",
	this.m_converttolowercase = false;
	this.m_shrinktofit = true;
	this.m_cloudgridsize = "5";
	this.m_wordpadding = "0";
	this.m_tooltipbackgroundtransparency= "1";
	this.m_wordlayoutshape = "none";
	this.m_wordinputformat = "word";
};

NewWordCloudChart.prototype = new Chart();

NewWordCloudChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

NewWordCloudChart.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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

NewWordCloudChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

NewWordCloudChart.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.m_draggableDiv.style.overflow = "hidden";
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

NewWordCloudChart.prototype.setDraggableCanvasSize = function () {
	var draggableCanvas = document.getElementById("draggableCanvas" + this.m_objectid);
	if (draggableCanvas != "" && draggableCanvas != undefined) {
		var topMargin = (this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
		//draggableCanvas.height = topMargin;
		draggableCanvas.height = this.m_height;
		draggableCanvas.width = this.m_width;
	}
};

NewWordCloudChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

NewWordCloudChart.prototype.setFields = function (fieldsJson) {
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

NewWordCloudChart.prototype.setCategory = function (categoryJson) {
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

NewWordCloudChart.prototype.setSeries = function (seriesJson) {
	this.m_seriesNames = [];
	this.m_seriesDisplayNames = [];
	this.m_seriesVisibleArr = {};
	this.m_allSeriesDisplayNames = [];
	this.m_allSeriesNames = [];
	/**formatter */
	this.m_precisionArr = [];
	this.m_isfixedlabelArr = [];
	this.m_formatterArr = [];
	this.m_unitnameArr = [];
	this.m_signpositionArr = [];
	this.m_secondformatterArr = [];
	this.m_secondunitnameArr = [];
	this.m_columnTypeArr = [];
	this.formatterMap = {};
	this.legendMap = {};
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
			/**formatter */
			this.m_precisionArr[count] = this.getProperAttributeNameValue(seriesJson[i], "Precision");
			this.m_isfixedlabelArr[count] = this.getProperAttributeNameValue(seriesJson[i], "isfixedlabel");
			this.m_formatterArr[count] = this.getProperAttributeNameValue(seriesJson[i], "formatter");
			this.m_unitnameArr[count] = this.getProperAttributeNameValue(seriesJson[i], "unitname");
			this.m_signpositionArr[count] = this.getProperAttributeNameValue(seriesJson[i], "signposition");
			this.m_secondformatterArr[count] = this.getProperAttributeNameValue(seriesJson[i], "secondformatter");
			this.m_secondunitnameArr[count] = this.getProperAttributeNameValue(seriesJson[i], "secondunitname");
			this.m_columnTypeArr[count] = this.getProperAttributeNameValue(seriesJson[i], "cellType");
				var tempMap = {
				"precision" : this.m_precisionArr[count],
				"isfixedlabel" : this.m_isfixedlabelArr[count],
				"formatter" : this.m_formatterArr[count],
				"unitname" : this.m_unitnameArr[count],
				"signposition" : this.m_signpositionArr[count],
				"secondformatter" : this.m_secondformatterArr[count],
				"secondunitname" : this.m_secondunitnameArr[count]
			};
			this.formatterMap[this.m_seriesNames[count]] = tempMap;
			count++;
		}
	}
};

NewWordCloudChart.prototype.setConfidence = function (confidenceJson) {
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

NewWordCloudChart.prototype.getAllCategoryNames = function () {
	return this.m_allCategoryNames;
};
NewWordCloudChart.prototype.getAllSeriesNames = function () {
	return this.m_allSeriesNames;
};
NewWordCloudChart.prototype.getAllConfidenceNames = function () {
	return this.m_allConfidenceNames;
};

NewWordCloudChart.prototype.getCategoryNames = function () {
	return this.m_categoryNames;
};

NewWordCloudChart.prototype.getCategoryDisplayNames = function () {
	return this.m_categoryDisplayNames;
};

NewWordCloudChart.prototype.getSeriesNames = function () {
	return this.m_seriesNames;
};

NewWordCloudChart.prototype.getSeriesDisplayNames = function () {
	return this.m_seriesDisplayNames;
};

NewWordCloudChart.prototype.getConfidenceNames = function () {
	return this.m_confidenceNames;
};

NewWordCloudChart.prototype.getConfidenceDisplayNames = function () {
	return this.m_confidenceDisplayNames;
};
/** @description Setter Method of AllFieldsName **/
NewWordCloudChart.prototype.setAllFieldsName = function () {
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
NewWordCloudChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};
NewWordCloudChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
};

NewWordCloudChart.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0; i < this.getSeriesNames().length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
};

NewWordCloudChart.prototype.setConfidenceData = function () {
	this.m_confidenceData = [];
	if (this.getConfidenceNames()[0] != undefined) {
		for (var i = 0; i < this.getConfidenceNames().length; i++) {
			this.m_confidenceData[i] = this.getDataFromJSON(this.getConfidenceNames()[i]);
		}
	} else {
		this.m_confidenceData = this.m_seriesData;
	}
};

NewWordCloudChart.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

NewWordCloudChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

NewWordCloudChart.prototype.getConfidenceData = function () {
	return this.m_confidenceData;
};

NewWordCloudChart.prototype.init = function () {
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
	
	this.setFormatter();
	this.setSecondaryFormatter();

	if (!IsBoolean(this.m_isEmptySeries)){
		/**DAS-981 */
		if(this.m_wordinputformat == "word"){
			this.setMaxMinFrequencyOfWords();
			this.setMaxMinConfidenceOfWords();
		}
	}
	this.setRangeColorBarTextWidth();
	/**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};

/**@description checking the width for range bar markers **/
NewWordCloudChart.prototype.setRangeColorBarTextWidth = function () {
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

NewWordCloudChart.prototype.setPronounsMap = function () {
	if (IsBoolean(this.m_excludepronouns)) {
		var pronounArray = (this.m_excludedwords) ? this.m_excludedwords.split(",") : [];
		this.m_pronounsmap = new Object();
		for (var i = 0; i < pronounArray.length; i++) {
			this.m_pronounsmap[("" + pronounArray[i]).toLowerCase()] = ("" + pronounArray[i]).toLowerCase();
		}
	}
};

NewWordCloudChart.prototype.getPronounsMap = function () {
	return this.m_pronounsmap;
};

NewWordCloudChart.prototype.initializeColor = function () {
	this.m_color = [];
	if (!IsBoolean(this.m_userandomcolor)) {
		var color = this.m_colors.split(",");
		for (var i = 0; i < color.length; i++) {
			if (color[i] != undefined)
				this.m_color[i] = convertColorToHex(color[i]);
			else
				this.m_color[i] = this.m_color[i - 1];
		}
	}else{
		var color = this.m_cloudgradients.split(",");
		for (var i = 0; i < color.length; i++) {
			if (color[i] != undefined)
				this.m_color[i] = convertColorToHex(color[i]);
			else
				this.m_color[i] = this.m_color[i - 1];
		}
	}
};

NewWordCloudChart.prototype.getRanges = function () {
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

NewWordCloudChart.prototype.showLimitedWords = function () {
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

NewWordCloudChart.prototype.shuffleDataProvider = function () {
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

NewWordCloudChart.prototype.excludePronounsFromDataProvider = function () {
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

NewWordCloudChart.prototype.setMaxMinFrequencyOfWords = function () {
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
NewWordCloudChart.prototype.setMaxMinConfidenceOfWords = function () {
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
NewWordCloudChart.prototype.drawChart = function () {
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
	if (!IsBoolean(this.m_isEmptySeries) && this.m_wordinputformat == "word") {
		var mainDiv = this.drawWordCloudChart();
		this.drawRangeColorBar();
		this.createWordData();
		this.drawCloud(mainDiv);
	} else if (this.getCategoryData() && this.getCategoryData()[0].length > 0 && this.m_wordinputformat != "word"){
		var mainDiv = this.drawWordCloudChart();
		this.drawRangeColorBar();
		this.createParaWordData();
		this.drawCloud(mainDiv);
	}else {
		$("#tagCloudDiv" + temp.m_objectid).remove();
		$("#draggableCanvas" + temp.m_objectid).css("display", "block");
		this.drawMessage(this.m_status.noData);
	}
};

NewWordCloudChart.prototype.removeCanvasFromDiv = function () {
	var temp = this;
	//Removing canvas if there is no title and subtitle
	if ((!IsBoolean(this.getShowGradient())) && (!IsBoolean(this.m_showmaximizebutton)) && (!IsBoolean(this.getTitle().m_showtitle)) && (!IsBoolean(this.m_subTitle.m_showsubtitle)))
		$("#draggableCanvas" + temp.m_objectid).css("display", "none");
	else
		$("#draggableCanvas" + temp.m_objectid).css("display", "block");

};
NewWordCloudChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};

NewWordCloudChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

NewWordCloudChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

NewWordCloudChart.prototype.drawRangeColorBarRanges = function (height) {
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

NewWordCloudChart.prototype.drawRangeColorBar = function () {
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

NewWordCloudChart.prototype.drawWordCloudChart = function () {
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
	mainDiv.style.overflow = "hidden";

	$("#draggableDiv" + temp.m_objectid).css("overflow-x", "hidden");
	$("#draggableDiv" + temp.m_objectid).css("overflow-y", "hidden");
	$("#draggableDiv" + temp.m_objectid).css("background", hex2rgb("#ffffff", this.m_bgalpha));
	$("#draggableDiv" + temp.m_objectid).append(mainDiv);
	return mainDiv;
};

NewWordCloudChart.prototype.drawCloud = function () {
	var temp = this;
	var chart = echarts.init(document.getElementById("tagCloudDiv"+temp.m_objectid),null,{
	 renderer:'svg'	
	});
	var mainchart = document.getElementById("tagCloudDiv"+temp.m_objectid);
	var width = mainchart.offsetWidth;
	var height = mainchart.offsetHeight;

	var centerX = width / 2;
	var centerY = height / 2;
	temp.drawLoaderIcon(centerX,centerY);
	//chart.showLoading();
	try {
		var timer = null;
		var delay = 500;
		if (timer === null) {
	       timer = setTimeout(function() {
	       	timer = null;
			temp.drawWordCloudText(chart);
			}, delay);
		}else{
			clearTimeout(timer);
	       	timer=null;
		}
	} catch (e) {
		console.log("error in calculation of word cloud!");
	}
};
/** @description to show loader when chart take time to draw**/
NewWordCloudChart.prototype.drawLoaderIcon = function(x, y) {
	var temp = this;
	var image = document.createElement("div");
	image.setAttribute("id", "dcloaderImage" + temp.m_objectid);
	image.setAttribute("class", "loaderImage");
	$("#tagCloudDiv" + temp.m_objectid).append(image);
	$("#dcloaderImage" + temp.m_objectid).css({
		"z-index": (temp.m_zIndex + 2),
		"left": x + "px",
		"top": y + "px"
	}).on("click", function() {
		$("#loaderImageContent" + temp.m_objectid).toggle("slide", {
			direction: "up"
		}, 200);
		$("#loaderImageContentArrow" + temp.m_objectid).toggle();
	}).append('<div style="position:absolute;height:100%;width:100%;left:0px;top:0px;" class="la-ball-clip-rotate la-dark la-lg loaderImageRotation"><div style="border-width:2px;height:80%;width:80%;"></div></div>');
	$("#dcloaderImage" + temp.m_objectid).show();
};
/**@descriptin draw word cloud using d3 chart library */
NewWordCloudChart.prototype.drawWordCloudD3 = function () {
	var temp = this;
	// List of words
	var myWords = ["Hello", "Everybody", "How", "Are", "You", "Today", "It", "Is", "A", "Lovely", "Day", "I", "Love", "Coding", "In", "My", "Van", "Mate", "Peace", "Love", "Keep", "The", "Good", "Work", "Make", "Love", "Not", "War","Surfing","R", "R",
   "Data-Viz","Python","Linux","Programming","Graph Gallery","Biologie", "Resistance",
   "Computing","Data-Science","Reproductible","GitHub","Script", "Experimentation","Talk","Conference","Writing",
   "Publication","Analysis","Bioinformatics","Science","Statistics","Data",
   "Programming","Wheat","Virus","Genotyping","Work","Fun","Surfing","R", "R",
   "Data-Viz","Python","Linux","Programming","Hello", "Everybody", "How", "Are", "You", "Today", "It", "Is", "A", "Lovely", "Day", "I", "Love", "Coding", "In", "My", "Van", "Mate", "Peace", "Love", "Keep", "The", "Good", "Work", "Make", "Love", "Not", "War","Surfing","R", "R",
   "Data-Viz","Python","Linux","Programming","Graph Gallery","Biologie", "Resistance",
   "Computing","Data-Science","Reproductible","GitHub","Script", "Experimentation","Talk","Conference","Writing",
   "Publication","Analysis","Bioinformatics","Science","Statistics","Data",
   "Programming","Wheat","Virus","Genotyping","Work","Fun","Surfing","R", "R",
   "Data-Viz","Python","Linux","Programming"]

	// set the dimensions and margins of the graph
	var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3.select("#tagCloudDiv"+temp.m_objectid).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  	.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
// Wordcloud features that are different from one word to the other must be here
	var layout = d3.layout.cloud()
  	.size([width, height])
  	.words(myWords.map(function(d) { return {text: d}; }))
  	.padding(5)        //space between words
  	.rotate(-45)       // rotation angle in degrees
  	.fontSize(20)      // font size of words
  	.on("end", drawd3);
	layout.start();
	
	function drawd3(words) {
  	svg
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", 20)
        .style("fill", "#69b3a2")
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
        }

// This function takes the output of 'layout' above and draw the words
// Wordcloud features that are THE SAME from one word to the other can be here
	
};

NewWordCloudChart.prototype.drawWordCloudText = function (chart) {
	var temp = this;
    var data = temp.m_chartData;
    var maskImage = null;
    var width="95%";
    var height = "95%";
    var left = 10;
    var right = 10;
   	//chart.showLoading();
   	setTimeout(function() {
		   $("#dcloaderImage" + temp.m_objectid).hide();
	}, 500);
    if(temp.m_wordlayoutshape !== "none"){
		 maskImage = new Image();
		 width="100%";
    	 height = "100%";
    	 left =0;
    	 right = 0;
	}
	if(IsBoolean(temp.m_shrinktofit)){
			var seriesdata ={
                    type: 'wordCloud',
                    gridSize: parseInt(temp.m_cloudgridsize),
                    sizeRange: [temp.m_minvaluefontsize*1, temp.m_maxvaluefontsize*1],
                    rotationRange: [temp.m_rotationrangemin, temp.m_rotationrangemax],
                    rotationStep: parseInt(temp.m_rotationrangestep),
                    shape: temp.m_wordcloudshape,
                    drawOutOfBound: false,
                    shrinkToFit: IsBoolean(temp.m_shrinktofit),
                    maskImage:maskImage,
                    keepAspect: false,
                    left : left,
                    right : right,
					top:0,
                    width: width,
                    height: height, 
                    layoutAnimation: IsBoolean(temp.m_layoutanimation),
                    emphasis: {
						focus: 'self',
						textStyle: {
						color: convertColorToHex(temp.m_highlightcolor),
						fontSize : temp.m_highlightfontsize,
						},
                		itemStyle: {
                    		shadowBlur: 10,
                    		shadowColor: 'rgba(0, 0, 0, 0.5)'
                		}
            		},
                    textStyle: {
			            fontFamily: selectGlobalFont(temp.m_wordfontfamily),
			            fontWeight: 'bold',
			            textShadowBlur: parseInt(temp.m_shadowdepth),
			            textShadowOffsetX : parseInt(temp.m_shadowoffestx),
			            textShadowOffsetY : parseInt(temp.m_shadowoffesty),
                		textShadowColor: temp.m_shadowcolor,
			            // Color can be a callback function or a color string
			            color: function () {
			                // Random color
			                return hex2rgb(temp.m_color[Math.floor(Math.random() * temp.m_color.length)],temp.m_fillopacity);
			                
			            }
			        },
                    data
                };
			}else{
				var seriesdata = {
                    type: 'wordCloud',
                    gridSize: parseInt(temp.m_cloudgridsize),
                    sizeRange: [temp.m_minvaluefontsize*1, temp.m_maxvaluefontsize*1],
                    rotationRange: [temp.m_rotationrangemin, temp.m_rotationrangemax],
                    rotationStep: parseInt(temp.m_rotationrangestep),
                    shape: temp.m_wordcloudshape,
                    drawOutOfBound: false,
                    shrinkToFit: IsBoolean(temp.m_shrinktofit),
                    maskImage:maskImage,
                    keepAspect: false,
                    left : left,
                    right : right,
					top:0,
                    width: width,
                    height: height, 
                    layoutAnimation: IsBoolean(temp.m_layoutanimation),
                    textStyle: {
			            fontFamily: selectGlobalFont(temp.m_wordfontfamily),
			            fontWeight: 'bold',
			            textShadowBlur: parseInt(temp.m_shadowdepth),
			            textShadowOffsetX : parseInt(temp.m_shadowoffestx),
			            textShadowOffsetY : parseInt(temp.m_shadowoffesty),
                		textShadowColor: temp.m_shadowcolor,
			            // Color can be a callback function or a color string
			            color: function () {
			                // Random color
			                return hex2rgb(temp.m_color[Math.floor(Math.random() * temp.m_color.length)],temp.m_fillopacity);
			                
			            }
			        },
                    data
                };
			}
    var option = {
                tooltip: {
					show:IsBoolean(temp.m_customtextboxfortooltip.dataTipType!="None"),
					responsive: true,
        			trigger: 'item',
        			backgroundColor: temp.m_tooltipbackgroundcolor,
        			borderColor : temp.m_tooltipbordercolor,
        			padding: 0,
        			opacity: parseFloat(temp.m_tooltipbackgroundtransparency),
        			formatter: function (params) {
						var toolTipData = temp.getToolTipData(params,params.dataIndex);
						return temp.drawDefaultChartToolTip(toolTipData);
					},
        			textStyle: {
            			//fontSize: parseInt(temp.m_tooltipfontsize)
        			}
					},
                series: [ seriesdata ]
            };
           //chart.setOption(option);
           if(temp.m_wordlayoutshape !== "none"){ 
           	maskImage.onload = function () {
                option.series[0].maskImage;
                chart.setOption(option); 
                chart.hideLoading();  
            }
            maskImage.src = appRootPath + 'designer/views/designer/resources/images/cloud-'+temp.m_wordlayoutshape+'.png';
            }else{
					chart.setOption(option);
					chart.hideLoading();
			}
			//window.addEventListener('resize', chart.resize);
            /**drill update */
			chart.on('click', 'series.wordCloud', function (el) {
			var fieldNameValueMap = {};
			fieldNameValueMap = temp.getFieldNameValueMap(el.dataIndex);
			var drillColor = el.color;
			temp.updateDataPointsToGV( { "drillRecord":fieldNameValueMap, "drillColor":drillColor });
			});
			chart.on('mouseover', function (params) {
			if(params.event.target.style.fontSize>temp.m_highlightfontsize && IsBoolean(temp.m_shrinktofit)){
			  chart.dispatchAction({
			    type: 'downplay',
			    seriesIndex: params.seriesIndex,
			    dataIndex: params.dataIndex
			  });
			  }
			});
			
};
NewWordCloudChart.prototype.drawDefaultChartToolTip = function(toolTipData) {
    var data = toolTipData.data;
	var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
	var tc = "<table class=\" chart-tooltip bdtooltip\" style = 'border:" + border + ";background:"+this.m_tooltipbackgroundcolor+";width:"+this.m_customtooltipwidth+";'>";
	tc += "<tr><td colspan=\"3\" class=\"chart-tooltip-head\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'><span class=\"colorspan\" style=\"background-color:" + data[0].color + ";\"></span>" + data[0].text + "</td></tr>";
	tc += "<tr><td align=\"left\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'>" + data[1].text + "</td><td align=\"left\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'>" + data[1].value + "</td></tr>";
	if(this.m_confidenceDisplayNames.length !== 0 && this.m_wordinputformat == "word"){
		tc += "<tr><td align=\"left\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'>" + data[2].text + "</td><td align=\"left\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'>" + data[2].value + "</td></tr>";
	}
	tc += "</table>";
	return tc;
};
NewWordCloudChart.prototype.getToolTipData = function (params,i) {
	var datat=[];
	var getSeriesData = this.getSeriesData()[0];
	var getColorData = this.getConfidenceData()[0];
	datat[0] = {
		"text" : params.data.name,
		"value" : params.data.value,
		"color" : params.color,
	};
	datat[1] = {
	"text" : (this.m_wordinputformat == "word") ? this.m_seriesDisplayNames[0] : "Frequency",
	"value" : (this.m_wordinputformat == "word") ? getSeriesData[i] : params.data.value
	};
	if(this.m_confidenceDisplayNames.length !== 0 && (this.m_wordinputformat == "word")){
		datat[2] = {
			"text" : this.m_confidenceDisplayNames[0],
			"value" : (this.m_wordinputformat == "word") ? getColorData[i] : params.data.value
			};
	}
	var toolTipData = {};
	toolTipData.cat = "";
	toolTipData.data = new Array();
	for(var i = 0; datat.length > i; i++){
		if (datat[i].value == "" || isNaN(datat[i].value) || datat[i].value == null || datat[i].value == "null") {
			datat[i].value = datat[i].value;
        } else {
            var num = datat[i].value * 1;
            if (this.m_tooltipprecision !== "default") {
            	datat[i].value = num.toFixed(this.m_tooltipprecision);
            } else {
            	datat[i].value = num * 1;
            }
        }
        datat[i].value = this.getUpdatedFormatterForToolTip(datat[i].value,datat[i].text);
	}
	toolTipData.data = datat;
	return toolTipData;
};
/** @description set Formatter data. **/
NewWordCloudChart.prototype.setFormatter = function () {
	this.m_unitSymbol = "";
	this.m_formatterPosition = "";
	this.m_isFormatter = false;
	if (this.m_formater != "none" && this.m_formater != "") {
		var formatter = this.getFormater();
		var unit = this.getUnit();
		if (unit != "none" && unit != "") {
			this.m_isFormatter = true;
			this.m_unitSymbol = this.m_util.getFormatterSymbol(formatter, unit);
			this.m_formatterPosition = this.getSignPosition();
			if (this.m_formatterPosition == "") {
				this.m_formatterPosition = "suffix";
			}
		}
	}
};
/** @description set secondunit Formatter setting. **/
NewWordCloudChart.prototype.setSecondaryFormatter = function() {
	this.m_secondaryUnitSymbol = "";
	this.m_secondaryFormatterPosition = "";
	this.m_isSecondaryFormatter = false;
	//	if(this.m_secondaryformater != "none" && this.m_secondaryformater != "" && this.getSecondaryUnit() != "Percent")
	if (this.m_secondaryformater != "none" && this.m_secondaryformater != "") {
		/** remove condition for Percent because secondary formatter is not working for % **/
		var secondaryFormatter = this.getSecondaryFormater();
		var secondaryUnit = this.getSecondaryUnit();
		if (secondaryUnit != "" && secondaryUnit != "none" && secondaryUnit != undefined) {
			this.m_isSecondaryFormatter = true;
			this.m_secondaryUnitSymbol = this.m_util.getFormatterSymbol(secondaryFormatter, secondaryUnit);
		}
		this.m_secondaryFormatterPosition = "suffix";
	}
};
/** @description Will update data value according to the component Formatter setting. **/
NewWordCloudChart.prototype.getFormatterForToolTip = function(value) {
    if (!isNaN(getNumericComparableValue(value))) {
        // added check for value is number or not otherwise return same string value
        var isCommaSeparated = (("" + value).indexOf(",") > 0) ? true : false;
        var signPosition = (this.m_signposition != "") ? this.m_signposition : "suffix";
        var precision = this.m_tooltipprecision;
        var unit = this.m_unit;
        var secondUnit = this.m_secondaryunit;
        var formatter = "Currency";
        var secondFormatter = "Number";
        var valueToBeFormatted = (precision === "default") ? (getNumericComparableValue(value) * 1) : (getNumericComparableValue(value) * 1).toFixed(precision);
        if (unit != "") {
            var formatterSymbol = this.m_util.getFormatterSymbol(formatter, unit);
            var secondFormatterSymbol = this.m_util.getFormatterSymbol(secondFormatter, secondUnit);
            /* To Add Number formatter */
            if (secondFormatterSymbol == "auto") {
                value = getNumericComparableValue(value);
                var symbol = getNumberFormattedSymbol(value * 1, unit);
                var val = getNumberFormattedNumericValue(value * 1, precision, unit);
                var text = this.m_util.updateTextWithFormatter(val, "", precision);
                valueToBeFormatted = this.m_util.addFormatter(text, symbol, "suffix");
            } else {
                var unitSymbol = secondFormatterSymbol;
                valueToBeFormatted = this.m_util.updateTextWithFormatter(valueToBeFormatted, unitSymbol, precision);
                if (secondFormatterSymbol != "none" && secondFormatterSymbol != "" && secondFormatterSymbol != "") {
                    valueToBeFormatted = this.m_util.addFormatter(valueToBeFormatted, secondFormatterSymbol, "suffix");
                }
            }
            /* To add Currency formatter */
            valueToBeFormatted = (valueToBeFormatted == "NaN" || valueToBeFormatted === "") ? "" : this.m_util.addFormatter(getFormattedNumberWithCommas(valueToBeFormatted, this.m_numberformatter) , formatterSymbol, signPosition);
            return valueToBeFormatted;
        } else {
            return (valueToBeFormatted == "NaN") ? value : valueToBeFormatted;
        }
    } else {
    	return value;
    	}
};
/** @description Will update data value according to the secondunit Formatter setting. **/
NewWordCloudChart.prototype.getSecondaryFormaterAddedText = function(textValue, secondaryUnitSymbol) {
	var formattedText = textValue;
	var secondaryFormatterPosition = "suffix";
	try {
		eval("var formattedText = this.m_util.addUnitAs" + secondaryFormatterPosition + "(textValue,secondaryUnitSymbol);");
	} catch (e) {
		return formattedText;
	}
	return formattedText;
};
/** @description Will update data value according to the filed Formatter setting. **/
NewWordCloudChart.prototype.getFieldFormatterForToolTip = function (fieldname,value) {
	var data = value;
	data = getNumericComparableValue(data);
	if (isNaN(data) || data == "" || data == undefined){
		return data;
	} else {
		/** for story need to show the formatters in tooltip as they are not showing the values on states **/
		this.m_precision = this.formatterMap[fieldname].precision;
		var m_precision;
		if (this.m_precision !== "default") {
		    m_precision = this.m_precision;
		} else {
		    m_precision = (data + "").split(".");
		    if (m_precision[1] !== undefined) {
		        m_precision = m_precision[1].length;
		    } else {
		        m_precision = 0;
		    }
		}
		
		if (this.formatterMap[fieldname].secondformatter != "none" && this.formatterMap[fieldname].secondformatter != "" && this.formatterMap[fieldname].secondunitname != "" && this.formatterMap[fieldname].secondunitname != "none") {
			this.m_secondaryUnitSymbol = this.m_util.getFormatterSymbol(this.formatterMap[fieldname].secondformatter, this.formatterMap[fieldname].secondunitname);
			this.m_secondaryFormatterPosition = "suffix";
			if (this.m_secondaryUnitSymbol != "auto") {
				try {
					data = this.m_util.updateTextWithFormatter(data, this.m_secondaryUnitSymbol, m_precision);
					data = this.getLocaleWithPrecision(data, m_precision);
					eval("data = this.m_util.addUnitAs" + this.m_secondaryFormatterPosition + "(data,this.m_secondaryUnitSymbol);");
				} catch (e) {}
			} else {
				var symbol = getNumberFormattedSymbol(data * 1);
				data = getNumberFormattedNumericValue(data * 1, m_precision);
				data = this.getLocaleWithPrecision(data, m_precision);
				eval("data = this.m_util.addUnitAs" + this.m_secondaryFormatterPosition + "(data,symbol);");
			}
		}else{
			data = this.getLocaleWithPrecision(data, m_precision);
		}
		
		if (this.formatterMap[fieldname].formatter != "none" && this.formatterMap[fieldname].formatter != "" && this.formatterMap[fieldname].unitname != "none" && this.formatterMap[fieldname].unitname != "") {
			this.m_unitSymbol = this.m_util.getFormatterSymbol(this.formatterMap[fieldname].formatter, this.formatterMap[fieldname].unitname);
			if(this.m_unitSymbol != undefined) {
				if (this.formatterMap[fieldname].signposition == "") {
					this.formatterMap[fieldname].signposition = "suffix";
				}
				return this.m_util.addFormatter(data, this.m_unitSymbol, this.formatterMap[fieldname].signposition, m_precision);
			}
		}
	}
	return data;
};
/**@description create word cloud data array from josn data */
NewWordCloudChart.prototype.createWordData = function () {
	var temp = this;
	var getCategoryData = this.getCategoryData()[0];
	var getSeriesData = this.getSeriesData()[0];
	var getColorData = this.getConfidenceData()[0];
	var data = [];
	for(var i=0;i<getCategoryData.length;i++){
		var word = this.getWordWithFontCase(String(getCategoryData[i]));
		var calcFont = parseInt(this.getFontRatio(getSeriesData[i]));
		var colorStyle = {
				"fontSize": calcFont,
				"color": hex2rgb(temp.m_color[Math.floor(Math.random() * temp.m_color.length)],temp.m_fillopacity),
				"highligherSize": parseInt(temp.m_highlightfontsize)
			};
		/**use pallet color when random color is false*/	
		if (!IsBoolean(this.m_userandomcolor)) {
			var wordColor = (hex2rgb(this.getColorAsRange(getColorData[i]).color, this.m_fillopacity));
			colorStyle = {
				"color": wordColor,
				"fontSize": calcFont,
				"highligherSize": parseInt(temp.m_highlightfontsize)
			}
		}
		/**check empahsis based on font-size */	
		if(calcFont>parseInt(temp.m_highlightfontsize)){
			var emphasis = {
				focus: 'self',
				textStyle: {
					color: convertColorToHex(temp.m_highlightcolor)	
					}
				};
			}else{
				var emphasis = {
					focus: 'self',
					textStyle: {
						color: convertColorToHex(temp.m_highlightcolor),
						fontSize: parseInt(temp.m_highlightfontsize)	
					}
				};
			}
		
		if(IsBoolean(temp.m_shrinktofit)){
			data[i] = {
				"name" : word,
				"value" : parseFloat(getSeriesData[i]),
				"textStyle": colorStyle
			};	
		}else{
			data[i] = {
				"name" : word,
				"value" : parseFloat(getSeriesData[i]),
				"textStyle": colorStyle,
				"emphasis":emphasis
			};
			
		}
		
	}
	this.m_chartData = data;
};
/**@description create word cloud data array from josn data of paragpraph type */
NewWordCloudChart.prototype.createParaWordData = function () {
	var temp = this;
	var finalData = [];
	var paragraph = "";
	var getCategoryData = this.getCategoryData()[0];
	for(var i=0;i<getCategoryData.length;i++){
		paragraph = paragraph +", "+ getCategoryData[i];
	}
	// Remove punctuation from all pragraphs
	var cleanedParagraph = paragraph.replace(/[^\w\s]/g, '');
	// Split into words
    var words = cleanedParagraph.split(/\s+/);
    /**remove any empty data from the filtered data */
    finalData = words.filter(element => element !== "");
    /**limit the words with maxlimit */
	finalData = finalData.slice(0, this.m_maxtextvalue);
    /**exclude pronouns from words */
    if (IsBoolean(this.m_excludepronouns)) {
		var data = [];
		for(var i=0;i<finalData.length;i++){
			var newwords = finalData[i];
		if (newwords && this.getPronounsMap()[newwords.toString().toLowerCase()] != newwords.toString().toLowerCase()){
			data.push(newwords);
			}
		}
		finalData = data;
	}
	/*limited data */
	if (IsBoolean(this.m_showntext)) {
		var limitedData = [];
		limitedData = finalData.slice(0, this.m_nthtextvalue);
		finalData = limitedData;
	}
	/*shuffle data*/
	if (IsBoolean(this.m_shuffledtext)) {
		var sourceArry = finalData;
			for (var n = 0; n < sourceArry.length - 1; n++) {
				var k = n + Math.floor(Math.random() * (sourceArry.length - n));
				var temp1 = sourceArry[k];
				sourceArry[k] = sourceArry[n];
				sourceArry[n] = temp1;
			}
			finalData = sourceArry;
	}
	/**change case of words before words unique count */
	var uppercasedData = finalData.map(function(word) {
  		return temp.getWordWithFontCase(word.trim());
	});
	finalData = uppercasedData;
    // Count unique words
    var wordCounts = {};
    /**count quniuqe words and their frequency */
    finalData.forEach(function(word) {
		var trimedword= word.trim();
    if (wordCounts[trimedword]) {
        wordCounts[trimedword]++;
    } else {
        wordCounts[trimedword] = 1;
    }
    });
    /**calculate min max range of words count */
    var min = 0;
	var max = 0;	
	for (const word in wordCounts) {
	    if (wordCounts.hasOwnProperty(word)) {
	        const count = wordCounts[word];
	        if (count < min) {
	            min = count;
	        }
	        if (count > max) {
	            max = count;
	        }
	    }
	}
	/**@desc assign minmax value for rangecolor arary */
	this.m_minvalue = min;
	this.m_maxvalue = max;
	var data = [];
	var i = 0;
	for (var text in wordCounts) {
		var word = text;
		var calcFont = parseInt(this.getFontRatio(wordCounts[text]));
		var colorStyle = {
				"fontSize": calcFont,
				"color": hex2rgb(temp.m_color[Math.floor(Math.random() * temp.m_color.length)],temp.m_fillopacity),
				"highligherSize": parseInt(temp.m_highlightfontsize)
			};
		/**use pallet color when random color is false*/	
		if (!IsBoolean(this.m_userandomcolor)) {
			var wordColor = (hex2rgb(this.getColorAsRange(wordCounts[text]).color, this.m_fillopacity));
			colorStyle = {
				"color": wordColor,
				"fontSize": calcFont,
				"highligherSize": parseInt(temp.m_highlightfontsize)
			}
		}
		/**check empahsis based on font-size */	
		if(calcFont>parseInt(temp.m_highlightfontsize)){
			var emphasis = {
				focus: 'self',
				textStyle: {
					color: convertColorToHex(temp.m_highlightcolor)	
					}
				};
			}else{
				var emphasis = {
					focus: 'self',
					textStyle: {
						color: convertColorToHex(temp.m_highlightcolor),
						fontSize: parseInt(temp.m_highlightfontsize)	
					}
				};
			}
		
		if(IsBoolean(temp.m_shrinktofit)){
			data[i] = {
				"name" : word,
				"value" : parseFloat(wordCounts[text]),
				"textStyle": colorStyle
			};	
		}else{
			data[i] = {
				"name" : word,
				"value" : parseFloat(wordCounts[text]),
				"textStyle": colorStyle,
				"emphasis":emphasis
			};
			
		}
		i++;
		
	}
	this.m_chartData = data;
};
NewWordCloudChart.prototype.getWordWithFontCase = function (word) {
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

NewWordCloudChart.prototype.getColorAsRange = function (data) {
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
		if (data * 1 < this.m_range1[0] * 1) {
			color = this.m_defaultcolor;
			index = 0;
		}
		if (data * 1 >= this.m_range2[this.m_range2.length - 1] * 1) {
			color = this.m_defaultcolor;
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

NewWordCloudChart.prototype.createShuffledArray = function (from, to) {
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

NewWordCloudChart.prototype.getTextWidth = function (text, font) {
	var w = 0;
	var temp = this;

	$("#textWidthCalcDiv" + temp.m_objectid).css({
		"font" : font + "px " + selectGlobalFont(this.m_wordfontfamily)
	});
	$("#textWidthCalcDiv" + temp.m_objectid).html("" + text);
	w = $("#textWidthCalcDiv" + temp.m_objectid).width();
	return w;
};

NewWordCloudChart.prototype.getTextHeight = function (word, font) {
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

NewWordCloudChart.prototype.rotateText = function (i, freuqency, text, textDiv, calcFont) {
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

NewWordCloudChart.prototype.getFontRatio = function (data) {
	var numerator = (this.m_maxvalue == this.m_minvalue) ? 1 : data - this.m_minvalue;
	var denominator = (this.m_maxvalue == this.m_minvalue) ? 1 : this.m_maxvalue - this.m_minvalue;
	var percentage = numerator / denominator;
	var fontWeight = percentage * (this.m_maxvaluefontsize - this.m_minvaluefontsize) * 1 + this.m_minvaluefontsize * 1;
	return fontWeight;
};

NewWordCloudChart.prototype.showTooltipOnText = function (e, data) {
	var temp = this;
	var toolTipData = temp.getToolTipData(data,e);
	if (temp.m_hovercallback && temp.m_hovercallback != "") {
		temp.drawCallBackContent(mouseX, mouseY, toolTipData);
	} else {
		temp.drawTooltipContent(toolTipData);
	}
};

NewWordCloudChart.prototype.drawTooltipContent = function (toolTipData) {
	this.m_tooltip.draw(toolTipData, this.m_componenttype);
};

NewWordCloudChart.prototype.hideTooltipOnText = function (e) {
	$("#toolTipDiv").remove();
};

NewWordCloudChart.prototype.getStartX = function () {
	var marginForYAxisLabels = 0;
	return (this.m_x + marginForYAxisLabels);
};

NewWordCloudChart.prototype.getStartY = function () {
	var marginForXAxisLabels = 0;
	return (this.m_y + this.m_height - marginForXAxisLabels);
};

NewWordCloudChart.prototype.getEndX = function () {
	var rightSideMargin = 0;
	return (this.m_x + this.m_width - rightSideMargin);
};

NewWordCloudChart.prototype.getEndY = function () {
	return (this.m_y + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
};

NewWordCloudChart.prototype.drawTooltip = function (mouseX, mouseY) {
	// not required from canvas or div's hover event
};
//# sourceURL=NewWordCloudChart.js