/**
 * Copyright � 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: SankeyChartChart.js
 * @description SankeyChartChart
 **/
function SankeyChart(m_chartContainer, m_zIndex) {
    this.base = Chart;
    this.base();
    this.m_x = 680;
    this.m_y = 320;
    this.m_width = 300;
    this.m_height = 260;
    this.m_barWidth = 10;
    /** Array Creation for storing the Values which will use in drawing of chart and object creation of X,Y Axis **/
    this.m_categoryData = [];
    this.m_seriesData = [];
    this.m_categoryNames = [];
    this.m_seriesNames = [];
    this.m_barSeriesArray = [];
    this.m_xPositionArray = [];
    this.m_yPositionArray = [];
    this.m_barWidth = "";
    this.m_barHeightArray = [];
    this.m_seriesVisiblityPosition;
    this.m_showpercentvalue = false;
    this.m_showmarkingorpercentvalue = false;
    this.m_showPercentValueFlag = true;
    this.m_seriesInitializeFlag = true;
    this.noOfRows = 1;
    this.m_title = new svgTitle(this);
    this.m_subTitle = new svgSubTitle();
    this.m_chartContainer = m_chartContainer;
    this.m_zIndex = m_zIndex;
    this.m_showhorizontalmarkerline = false;
    this.m_subcategoryorientation = "left";
    this.m_mergesubcategory = "false";
    this.dataMap = {};
    /**Random colors */
    this.m_color = [];
    this.m_colors = "#cccccc,26265";
    this.m_defaultcolor = "#808080";
    this.m_cloudgradients = "#216cdf, #285bbb, #284b99, #253b77, #202c58";
    this.m_aggroperation = "avg";
    this.m_showcatsubcatpartitioner = "true";
    this.m_showcatpartitioner = "true";
    this.m_enableanimation = "false";
    this.m_baranimationduration = 0.5;
    this.m_stackborderwidth = "0";
    this.m_stackbordercolor = "#ffffff";
    this.m_enablestackshadow = "false";
    this.m_stackshadowcolor = "#000000";
    this.m_stackshadowopacity = "0.3";
    this.m_canvastype = "svg";
    this.m_stacksvgtype = "rect";
    // added for controlling uniform bar widths using script
    this.m_controlbarwidth = "auto";
    this.m_stackborderradius = "0";
    this.enableDrillHighlighter = "false";
    this.m_textalign = "right";
	this.m_drilltoggle = true;
	this.m_categorycolors = {
		"categoryDefaultColor": "",
        "categoryDefaultColorSet": "",
        "showColorsFromCategoryName": "false",
        "CategoryColor": []
    };
	this.m_conditionalcolors = {
		"ConditionalColor": []
	}
	this.m_subcategorycolors = {
		"subCategoryDefaultColor": "",
		"subCategoryDefaultColorSet": "",
		"showColorsFromSubCategoryName": "false",
		"subCategoryColor": []
    };
	
	
	this.m_sankeydata = {"nodes":[],"links":[]};
	this.m_nullValue = false;
	this.firstLevelNodes= "";
};

/** @description Making prototype of chart class to inherit its properties and methods into Bar chart **/
SankeyChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
SankeyChart.prototype.setProperty = function(chartJson) {
    this.ParseJsonAttributes(chartJson.Object, this);
    this.initCanvas();
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
SankeyChart.prototype.ParseJsonAttributes = function(jsonObject, nodeObject) {
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
                    case "CategoryColors":
                        var categoryColorsObject = new CategoryColors();
                        this.setCategoryColors(categoryColorsObject);
                        for (var CategoryColorsKey in jsonObject[key][chartKey]) {
                            switch (CategoryColorsKey) {
                                case "CategoryColor":
                                    var CategoryColorArray = this.getArrayOfSingleLengthJson(jsonObject[key][chartKey][CategoryColorsKey]);
                                    categoryColorsObject.cateogryNameColorMap = new Object();
                                    for (var i = 0; i < CategoryColorArray.length; i++) {
                                        var categoryColorObject = new CategoryColor();
                                        categoryColorsObject.setCategoryColor(categoryColorObject);
                                        for (var CategoryColorKey in CategoryColorArray[i]) {
                                            var propertyName = this.getNodeAttributeName(CategoryColorKey);
                                            categoryColorObject[propertyName] = CategoryColorArray[i][CategoryColorKey];
                                        }
                                        categoryColorsObject.cateogryNameColorMap[categoryColorObject.getCategoryName()] = categoryColorObject.getColor();
                                    }
                                    break;
                                default:
                                    var propertyName = this.getNodeAttributeName(CategoryColorsKey);
                                    nodeObject.m_categoryColors[propertyName] = jsonObject[key][chartKey][CategoryColorsKey];
                                    break;
                            }
                        }
                        categoryColorsObject.setCategoryDefaultColorSet();
                        break;
                    case "SubCategoryColors":
                        var subCategoryColorsObject = new SubCategoryColors();
                        this.setSubCategoryColors(subCategoryColorsObject);
                        for (var SubCategoryColorsKey in jsonObject[key][chartKey]) {
                            switch (SubCategoryColorsKey) {
                                case "subCategoryColor":
                                    var SubCategoryColorArray = this.getArrayOfSingleLengthJson(jsonObject[key][chartKey][SubCategoryColorsKey]);
                                    subCategoryColorsObject.subcateogryNameColorMap = new Object();
                                    for (var i = 0; i < SubCategoryColorArray.length; i++) {
                                        var subCategoryColorObject = new SubCategoryColor();
                                        subCategoryColorsObject.setSubCategoryColor(subCategoryColorObject);
                                        for (var SubCategoryColorKey in SubCategoryColorArray[i]) {
                                            var propertyName = this.getNodeAttributeName(SubCategoryColorKey);
                                            subCategoryColorObject[propertyName] = SubCategoryColorArray[i][SubCategoryColorKey];
                                        }
                                        subCategoryColorsObject.subcateogryNameColorMap[subCategoryColorObject.getSubCategoryName()] = subCategoryColorObject.getColor();
                                    }
                                    break;
                                default:
                                    var propertyName = this.getNodeAttributeName(SubCategoryColorsKey);
                                    nodeObject.m_subCategoryColors[propertyName] = jsonObject[key][chartKey][SubCategoryColorsKey];
                                    break;
                            }
                        }
                        subCategoryColorsObject.setSubCategoryDefaultColorSet();
                        break;
                    case "ConditionalColors":
                        if (jsonObject[key][chartKey] != "") {
                            var conditionalColorsObject = new ConditionalColors();
                            this.setConditionalColors(conditionalColorsObject);
                            var ConditionalColorArray = this.getArrayOfSingleLengthJson(jsonObject[key][chartKey]["ConditionalColor"]);
                            for (var i = 0; i < ConditionalColorArray.length; i++) {
                                var conditionalColorObject = new ConditionalColor();
                                conditionalColorsObject.setConditionalColor(conditionalColorObject);
                                for (var conditionalColorKey in ConditionalColorArray[i]) {
                                    var propertyName = this.getNodeAttributeName(conditionalColorKey);
                                    conditionalColorObject[propertyName] = ConditionalColorArray[i][conditionalColorKey];
                                }
                            }
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

/** @description Getter for DataProvider **/
SankeyChart.prototype.getDataProvider = function() {
    return this.m_dataProvider;
};

/** @description Getter for categoryNames **/
SankeyChart.prototype.getCategoryNames = function() {
    return this.m_categoryNames;
};

/** @description Getter for Category Display Name **/
SankeyChart.prototype.getCategoryDisplayNames = function() {
    return this.m_categoryDisplayNames;
};

/** @description Getter for SubCategory Names **/
SankeyChart.prototype.getSubCategoryNames = function() {
    return this.m_subCategoryNames;
};
SankeyChart.prototype.drawNodeChartToolTip = function(toolTipData) {
    var data = toolTipData.data;
	var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
	var tc = "<table class=\" chart-tooltip bdtooltip\" >";
	tc += "<tr><td colspan=\"3\" class=\"chart-tooltip-head\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'><span class='colorspan' style='background-color:" + data[0].color + ";'></span>" + data[0].text + "</td></tr>";
	tc += "<tr><td align=\"left\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'>Name</td><td align=\"left\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'>" + data[1].text + "</td></tr>";
	tc += "<tr><td align=\"left\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'>Value</td><td align=\"left\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'>" + data[1].value + "</td></tr>";
	if(data[2] !== undefined){
		tc += "<tr><td align=\"left\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'>Percentage</td><td align=\"left\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'>" + data[2].percentage + " %</td></tr>";
	}
	tc += "</table>";
	return tc;
};
SankeyChart.prototype.drawEdgeChartToolTip = function(toolTipData) {
    var data = toolTipData.data;
	var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
	var tc = "<table class=\" chart-tooltip bdtooltip\" >";
	tc += "<tr><td colspan=\"3\" class=\"chart-tooltip-head\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'><span class='colorspan' style='background-color:" + data[0].color + ";'></span>" + data[0].text + "</td></tr>";
	tc += "<tr><td align=\"left\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'>Source</td><td align=\"left\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'>" + data[1].source + "</td></tr>";
	tc += "<tr><td align=\"left\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'>Target</td><td align=\"left\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'>" + data[1].target + "</td></tr>";
	tc += "<tr><td align=\"left\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'>Value</td><td align=\"left\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'>" + data[1].value + "</td></tr>";
	
	if(data[2] !== undefined){
		tc += "<tr><td align=\"left\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'>Percentage</td><td align=\"left\" style='background:"+this.m_tooltipbackgroundcolor+";font-size:"+parseInt(this.m_tooltipfontsize)+"px;'>" + data[2].percentage + " %</td></tr>";
	}
	tc += "</table>";
	return tc;
};
SankeyChart.prototype.getToolTipData = function (params,i) {
	var temp=this;
	var datat=[];
	if(params.data != undefined){
	if(params.dataType == "edge"){
	datat[0] = {
		"text" : "Edge Link",
		"color" : params.color,
		"value" : params.value,
	};
	datat[1] = {
		"source" : params.data.source,
		"target" : params.data.target,
		"value" : params.data.actvalue,
		"percentage" : params.data.percentage
	};	
	if(IsBoolean(temp.m_showpercentvalue)){
		datat[2] = {
		"percentage" : params.data.percentage
	};	
		}
	}else{
		datat[0] = {
		"text" : "Node",
		"color" : params.color,
		"value" : temp.m_sankeydata.nodes[i].actvalue,
	};
	datat[1] = {
	"text" : params.data.name,
	"value" : temp.m_sankeydata.nodes[i].actvalue,
	"percentage" : temp.m_sankeydata.nodes[i].percentage
	};
	if(IsBoolean(temp.m_showpercentvalue)){
		datat[2] = {
			"percentage" : temp.m_sankeydata.nodes[i].percentage
			};
		}
		
	}
	}
	
	var toolTipData = {};
	toolTipData.cat = "";
	toolTipData.data = new Array();
	for(var i = 0; datat.length > i; i++){
		/**check value precison */
		if (datat[i].value == "" || isNaN(datat[i].value) || datat[i].value == null || datat[i].value == "null") {
			datat[i].value = datat[i].value;
        } else {
            var num = datat[i].value * 1;
            if (num % 1 != 0 && temp.m_tooltipprecision !== "default") {
            	datat[i].value = num.toFixed(temp.m_tooltipprecision);
            } else {
            	datat[i].value = num * 1;
            }
        }
        	/**check percentage precison */
		if (datat[i].percentage == "" || isNaN(datat[i].percentage) || datat[i].percentage == null || datat[i].percentage == "null") {
			datat[i].percentage = datat[i].percentage;
        } else {
            var num = datat[i].percentage * 1;
            if (num % 1 != 0 && temp.m_tooltipprecision !== "default") {
            	datat[i].percentage = num.toFixed(temp.m_tooltipprecision);
            } else {
            	datat[i].percentage = num * 1;
            }
        }
       datat[i].value =  this.getUpdatedFormatterForToolTip(datat[i].value,datat[i].text);
	}
	toolTipData.data = datat;
	return toolTipData;
};
/** @description set Formatter data. **/
SankeyChart.prototype.setFormatter = function () {
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
SankeyChart.prototype.setSecondaryFormatter = function() {
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
SankeyChart.prototype.getFormatterForToolTip = function(value) {
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
SankeyChart.prototype.getPrecisonData = function(params) {
	var param = params;
	var data = param.value;
	if(!IsBoolean(this.m_showpercentvalue)){
		var value = data;
	}else{
		var per = data.split("%");
		var value = per[0];
	}
	var isCommaSeparated = (("" + value).indexOf(",") > 0) ? true : false;
	var signPosition = (this.m_signposition != "") ? this.m_signposition : "suffix";
	var precision = this.m_precision;
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
	} else {
		valueToBeFormatted = (valueToBeFormatted == "NaN") ? value : valueToBeFormatted;
	}
	/**set precsion only for value */
	if(!IsBoolean(this.m_showpercentvalue)){
		return param.name+" : "+valueToBeFormatted;
	}else{
		return param.name+" : "+valueToBeFormatted+"%";
	}

};
/** @description Will update data value according to the secondunit Formatter setting. **/
SankeyChart.prototype.getSecondaryFormaterAddedText = function(textValue, secondaryUnitSymbol) {
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
SankeyChart.prototype.getFieldFormatterForToolTip = function (fieldname,value) {
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

/* 
SankeyChart.prototype.setLabelWidth = function() {
    this.m_labelwidth = 0;
    //var maxSeriesVal = (("" + this.min).length <= ("" + this.max).length) ? this.max : this.min;
    var maxSeriesVal = [];
    if (this.m_charttype == "100%") {
        maxSeriesVal = 100;
    }
    var maxSeriesValDecimal = maxSeriesVal;
    this.ctx.beginPath();
    this.ctx.font = this.m_yAxis.getLabelFontWeight() + " " + this.fontScaling(this.m_yAxis.getLabelFontSize()) + "px " + this.m_yAxis.getLabelFontFamily();
    this.m_labelwidth = this.ctx.measureText(maxSeriesValDecimal).width;
    this.ctx.closePath();
    if (!IsBoolean(this.m_fixedlabel)) {
        if (IsBoolean(this.m_yAxis.getLeftaxisFormater())) {
            if (this.getSecondaryFormater() != "none" && this.getSecondaryFormater() != "") {
                if (this.getSecondaryUnit() != "none" && this.getSecondaryUnit() != "") {
                    var secondunit = this.m_util.getFormatterSymbol(this.getSecondaryFormater(), this.getSecondaryUnit());
                    if (this.getSecondaryUnit() == "auto" && this.m_unit == "Rupees") {
                        maxSeriesVal = getNumberFormattedNumericValue(maxSeriesVal * 1, this.m_precision, this.m_unit);
                    } else if (this.getSecondaryUnit() == "auto") {
                        maxSeriesVal = getNumberFormattedValue(maxSeriesVal * 1);
                    } else if (this.getSecondaryUnit() == "none") {
                        maxSeriesVal = this.m_util.updateTextWithFormatter(maxSeriesVal, secondunit, this.m_precision);
                    }
                }
            }
            if (this.m_formater != "none" && this.m_formater != "") {
                if (this.m_unit != "none" && this.m_unit != "") {
                    var unit = this.m_util.getFormatterSymbol(this.m_formater, this.m_unit);
                    maxSeriesVal = maxSeriesVal + "" + unit;
                }
            }
            this.ctx.beginPath();
            this.ctx.font = this.m_yAxis.m_labelfontstyle + " " + this.m_yAxis.m_labelfontweight + " " + this.fontScaling(this.m_yAxis.m_labelfontsize) + "px " + selectGlobalFont(this.m_yAxis.m_labelfontfamily);
            maxSeriesVal = getFormattedNumberWithCommas(maxSeriesVal, this.m_numberformatter);
            this.m_labelwidth = this.ctx.measureText(maxSeriesVal).width;
            this.ctx.closePath();
        }
    }
};
*/

/** @description Getting Field JSON and pusing into category,subcategory,series array according to field type**/
SankeyChart.prototype.setFields = function(fieldsJson) {
    this.m_fieldsJson = fieldsJson;
    var categoryJson = [];
    this.m_categoryJSON = [];
    this.m_subCategoryJSON = [];
    var seriesJson = [];
    var subCategoryJson = [];

    for (var i = 0; i < fieldsJson.length; i++) {
        //if (IsBoolean(fieldsJson[i].visible)) {
        var fieldType = this.getProperAttributeNameValue(fieldsJson[i], "Type");
        switch (fieldType) {
            case "Category":
                categoryJson.push(fieldsJson[i]);
                this.m_categoryJSON.push(fieldsJson[i]);
                break;
            case "SubCategory":
                subCategoryJson.push(fieldsJson[i]);
                this.m_subCategoryJSON.push(fieldsJson[i]);
                break;
            case "Series":
                seriesJson.push(fieldsJson[i]);
                break;
            case "CalculatedField":
                seriesJson.push(fieldsJson[i]);
                break;
            default:
                break;
        }
        //}
    }
    if ((subCategoryJson.length > 0 && categoryJson.length > 0)) {
        if (subCategoryJson[0].Name == categoryJson[0].Name) {
            subCategoryJson = categoryJson;
            categoryJson = [];
        }
    }
    if ((subCategoryJson.length == 0 && categoryJson.length != 0)) {
        this.m_subcategoryorientation = "left";
        subCategoryJson = categoryJson;
        categoryJson = [];
    }
    this.setCategory(categoryJson);
    this.setSubCategory(subCategoryJson);
    this.setSeries(seriesJson);
};

/** @description From category JSON getting the Name,Display Name and setting into categoryName,categoryDisplayName array**/
SankeyChart.prototype.setCategory = function(categoryJson) {
    this.m_categoryNames = [];
    this.m_categoryFieldColor = [];
    this.m_categoryDisplayNames = [];
    this.m_allCategoryNames = [];
    this.m_allCategoryDisplayNames = [];
    this.m_categoryVisibleArr = {};
    var count = 0;
    //only one category can be set for line chart, preference to first one
    for (var i = 0; i < categoryJson.length; i++) {
        this.m_allCategoryNames[i] = this.getProperAttributeNameValue(categoryJson[i], "Name");
        var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(categoryJson[i], "DisplayName"));
        this.m_allCategoryDisplayNames[i] = m_formattedDisplayName;
        this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]] = this.getProperAttributeNameValue(categoryJson[i], "visible");
        if (IsBoolean(this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]])) {
            this.m_categoryNames[count] = this.getProperAttributeNameValue(categoryJson[i], "Name");
            this.m_categoryDisplayNames[count] = m_formattedDisplayName;
            this.m_categoryFieldColor[count] = this.getProperAttributeNameValue(categoryJson[i], "Color");
            count++;
        }
    }
};

/** @description  From Subcategory JSON getting the name.displayName and setting into subCategoryName,subCategoryDisplayName Array**/
SankeyChart.prototype.setSubCategory = function(subCategoryJson) {
    this.m_subCategoryNames = [];
    this.m_subCategoryDisplayNames = [];
    this.m_allSubCategoryNames = [];
    this.m_allSubCategoryDisplayNames = [];
    this.m_subCategoryVisibleArr = {};
    var count = 0;
    for (var i = 0; i < subCategoryJson.length; i++) {
        this.m_allSubCategoryNames[i] = this.getProperAttributeNameValue(subCategoryJson[i], "Name");
        var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(subCategoryJson[i], "DisplayName"));
        this.m_allSubCategoryDisplayNames[i] = m_formattedDisplayName;
        this.m_subCategoryVisibleArr[this.m_allSubCategoryDisplayNames[i]] = this.getProperAttributeNameValue(subCategoryJson[i], "visible");
        if (IsBoolean(this.m_subCategoryVisibleArr[this.m_allSubCategoryDisplayNames[i]])) {
            this.m_subCategoryNames[count] = this.getProperAttributeNameValue(subCategoryJson[i], "Name");
            this.m_subCategoryDisplayNames[count] = m_formattedDisplayName;
        }
    }
};

/** @description Getting series fields and storing series field attribute into different-2 series attribute array **/
SankeyChart.prototype.setSeries = function(seriesJson) {
    this.m_seriesNames = [];
    this.m_seriesDisplayNames = [];
    this.m_seriesColors = [];
    this.m_legendNames = [];
    this.m_seriesVisibleArr = {};
    this.m_allSeriesDisplayNames = [];
    this.m_allSeriesNames = [];
    this.m_plotTrasparencyArray = [];
    this.m_seriesDataLabelProperty = [];
    var count = 0;
    this.legendMap = {};
    for (var i = 0; i < seriesJson.length; i++) {
        //this.m_seriesNames[i] = this.getProperAttributeNameValue(seriesJson[i],"Name");
        var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
        this.m_allSeriesDisplayNames[i] = m_formattedDisplayName;
        this.m_allSeriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
        this.m_seriesVisibleArr[this.m_allSeriesNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
        if (IsBoolean(this.m_seriesVisibleArr[this.m_allSeriesNames[i]])) {
            this.m_seriesDisplayNames[count] = m_formattedDisplayName;
            this.m_seriesNames[count] = this.getProperAttributeNameValue(seriesJson[i], "Name");
            this.m_legendNames[count] = m_formattedDisplayName;
            this.m_seriesColors[count] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i], "Color"));
            this.m_seriesDataLabelProperty[count] = this.getProperAttributeNameValue(seriesJson[i], "DataLabelCustomProperties");
            if (this.m_seriesDataLabelProperty[count] !== undefined) {
                if (IsBoolean(this.m_seriesDataLabelProperty[count].useFieldColor)) {
                    this.m_seriesDataLabelProperty[count].dataLabelFontColor = this.m_seriesColors[count];
                }
                if ((this.m_seriesDataLabelProperty[count].showPercentValue !== undefined) && IsBoolean(this.m_seriesDataLabelProperty[count].showPercentValue) && (this.m_charttype == "100%")) {
                    this.m_seriesDataLabelProperty[count].datalabelField = this.m_seriesNames[count];
                }
                if (IsBoolean(this.m_seriesDataLabelProperty[count].dataLabelUseComponentFormater)) {
                    this.m_seriesDataLabelProperty[count].datalabelFormaterCurrency = this.m_unit;
                    this.m_seriesDataLabelProperty[count].datalabelFormaterPrecision = this.m_precision;
                    this.m_seriesDataLabelProperty[count].datalabelFormaterPosition = this.m_signposition;
                    this.m_seriesDataLabelProperty[count].datalabelFormaterUnit = this.m_secondaryunit;
                }
            } else {
                this.m_seriesDataLabelProperty[count] = this.getDataLabelProperties();
            }
            var transparency = this.getProperAttributeNameValue(seriesJson[i], "PlotTransparency");
            this.m_plotTrasparencyArray[count] = (transparency != undefined && transparency !== null && transparency !== "") ? transparency : 1;
            var tempMap = {
                "seriesName": this.m_seriesNames[count],
                "displayName": this.m_seriesDisplayNames[count],
                "color": this.m_seriesColors[count],
                "shape": "cube"
            };
            this.legendMap[this.m_seriesNames[count]] = tempMap;
            count++;
        }
    }
    this.setLegendsIntialLoad(this.m_defaultlegendfields);
};

/** @description Getter for legend information**/
SankeyChart.prototype.getLegendInfo = function() {
    return this.legendMap;
};

/** @description Getter for All Series Names **/
SankeyChart.prototype.getAllSeriesNames = function() {
    return this.m_allSeriesNames;
};

/** @description Getter for All Category Names **/
SankeyChart.prototype.getAllCategoryNames = function() {
    return this.m_allCategoryNames;
};

/** @description Getter for All Sub Category Names **/
SankeyChart.prototype.getAllSubCategoryNames = function() {
    return this.m_allSubCategoryNames;
};

/** @description Getter for series Names**/
SankeyChart.prototype.getSeriesNames = function() {
    return this.m_seriesNames;
};

/** @description Getter for series display Names **/
SankeyChart.prototype.getSeriesDisplayNames = function() {
    return this.m_seriesDisplayNames;
};

/** @description Getter for series colors **/
SankeyChart.prototype.getSeriesColors = function() {
    return this.m_seriesColors;
};

/** @description Setter for legend Names **/
SankeyChart.prototype.setLegendNames = function(m_legendNames) {
    this.m_legendNames = m_legendNames;
};

/** @description Getter for legend Names**/
SankeyChart.prototype.getLegendNames = function() {
    return this.m_legendNames;
};

/** @description Pushing all field name into this.m_allFieldsName array  **/
SankeyChart.prototype.setAllFieldsName = function() {
    this.m_allfieldsName = [];
    for (var i = 0; i < this.getAllCategoryNames().length; i++) {
        this.m_allfieldsName.push(this.getAllCategoryNames()[i]);
    }
    for (var i = 0; i < this.getAllSubCategoryNames().length; i++) {
        this.m_allfieldsName.push(this.getAllSubCategoryNames()[i]);
    }
    for (var j = 0; j < this.getAllSeriesNames().length; j++) {
        this.m_allfieldsName.push(this.getAllSeriesNames()[j]);
    }
};

/** @description Getter for All Fields Name **/
SankeyChart.prototype.getAllFieldsName = function() {
    return this.m_allfieldsName;
};

/** @description Setter for All fields Display Name **/
SankeyChart.prototype.setAllFieldsDisplayName = function() {
    this.m_allfieldsDisplayName = [];
    for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
        this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
    }
    for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
        this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
    }
};

/** @description Getter for All Fields DisplayName **/
SankeyChart.prototype.getAllFieldsDisplayName = function() {
    return this.m_allfieldsDisplayName;
};

/** @description Setting Category Data into this.m_categoryData Array **/
SankeyChart.prototype.setCategoryData = function() {
    this.m_categoryData = [];
    this.isEmptyCategory = true;
    for (var i = 0; i < this.getCategoryNames().length; i++) {
        this.isEmptyCategory = false;
        this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
    }
};

/** @description Setting subcategory Data into this.m_subcategoryData **/
SankeyChart.prototype.setSubCategoryData = function() {
    this.m_subCategoryData = [];
    this.isEmptySubCategory = true;
    for (var i = 0; i < this.getSubCategoryNames().length; i++) {
        this.isEmptySubCategory = false;
        this.m_subCategoryData[i] = this.getDataFromJSON(this.getSubCategoryNames()[i]);
    }
};

/** @description Getter for SubCategory Data **/
SankeyChart.prototype.getSubCategoryData = function() {
    return this.m_subCategoryData;
};

/** @description Getter for Category Data**/
SankeyChart.prototype.getCategoryData = function() {
    return this.m_categoryData;
};

/** @description Setter for Series Data **/
SankeyChart.prototype.setSeriesData = function() {
    this.m_seriesData = [];
    for (var i = 0; i < this.getSeriesNames().length; i++) {
        this.m_seriesData.push(this.getDataFromJSON(this.getSeriesNames()[i]));
    }
};

/** @description Getter for Series Data **/
SankeyChart.prototype.getSeriesData = function() {
    return this.m_seriesData;
};

/** @description Setter for Series Color **/
SankeyChart.prototype.setSeriesColor = function(m_seriesColor) {
    this.m_seriesColor = m_seriesColor;
};

/** @description Getter for Series Color **/
SankeyChart.prototype.getSeriesColor = function() {
    return this.m_seriesColor;
};

/** @description SankeyChart initialization of title,subtitle,chartFrame,XAxis,YAxis class **/
SankeyChart.prototype.init = function() {
    this.setCategoryData();
    this.setSubCategoryData();
    this.setSeriesData();
    this.initializeColor();
    this.setSankeyData();
    this.visibleSeriesInfo = this.getVisibleSeriesData(this.getSeriesData());
    this.setColorsForSeries();
    if (this.getCategoryNames().length != 0 && this.getSubCategoryNames()[0] != undefined) {
        this.manageRepeatedSubCategory();
    }
    this.setAllFieldsName();
    this.setAllFieldsDisplayName();
    this.isSeriesDataEmpty();
    this.setShowSeries(this.getAllFieldsName());
    this.updateSeriesDataWithCommaSeperators();

    this.visibleSeriesInfo = this.getVisibleSeriesData(this.getSeriesData());
    this.createSVG();
    this.initMouseClickEventForSVG(this.svgContainerId);
    this.m_chartFrame.init(this);
    this.m_title.init(this);
    this.m_subTitle.init(this);
    this.setFormatter();
	this.setSecondaryFormatter();
    /**Old Dashboard directly previewing without opening in designer*/
    this.initializeToolTipProperty();
    this.m_tooltip.init(this);
};

SankeyChart.prototype.setSankeyData = function() {
	var temp= this;
	var catName = temp.m_categoryNames[0];
	var subCatName = temp.m_subCategoryNames[0];
	var serName = temp.m_seriesNames[0];
	var linksData = temp.m_dataProvider.map(function(data) {
		var source = data[catName];
  		var target = data[subCatName];
	  if (source && target && source !== "null" && target !== "null" && source !== null && target !== null) {
	  return {
	    source: source,
	    target: target,
	    value: temp.countDecimalPlaces(parseFloat(data[serName]))
	  };
	  }
	});
	// DAS-729 Remove null or undefined values from the array if needed
	linksData = linksData.filter(function(link) {
  		return link !== null && link !== undefined;
	});
	
	// Extract unique names
	var names = new Set();
	linksData.forEach(function(item) {
	  names.add(item.source);
	  names.add(item.target);
	});

	/**get nodes which have source nodes */
	var nodeSources = {};

	linksData.forEach(function(entry) {
  		var sourceNode = entry.source;
  		var targetNode = entry.target;

  		if (!nodeSources[targetNode]) {
    	nodeSources[targetNode] = [];
  		}

  		nodeSources[targetNode].push(sourceNode);
	});
	
	// Create an object to store the unique names and their values
	var result1 = {};
	var nodeNames = new Set();
	names.forEach(function(name) {
	  result1[name] = 0; // Initialize value to 0
	});
	/**check whether names are first level nodes or not */
	names.forEach(function(node) {
		if(nodeSources[node] == undefined) /**check for first nodes */
		{
			linksData.forEach(function(item) {
				if(item.source == node)
	  			result1[node] += item.value;
			});
		}else{
			/**next level nodes */
			var tempnode = node;
			nodeSources[node].forEach(function(node1){
				linksData.forEach(function(item) {
				if(item.target == tempnode && item.source== node1)
	  			result1[node] += item.value;
			});
			});
			
		}
	});
	
	// Loop through the array and update the values with the desired precision
	// Create a new object with the rounded values
	var result = {};
	
	for (const key in result1) {
	  if (result1.hasOwnProperty(key)) {
	    result[key] = parseFloat(temp.countDecimalPlaces(result1[key]));
	  }
	}
	
	// Assign values to unique names
	/*
	linksData.forEach(function(item) {
	  result[item.source] += item.value;
	});
	
	
	linksData.forEach(function(item) {
		if(result[item.target] === 0){
			nodeNames.add(item.target);
		}
	});
	
	var nodeNameList = Array.from(nodeNames);
	
	linksData.forEach(function(link) {
	  var targetNode = nodeNameList.find(function(node) {
	    return node === link.target;
	  });
	  if (targetNode) {
	    result[targetNode] += link.value;
	  }
	});
	*/
	
	/**first level nodestotal value as 100% */
	var allNodes = Object.entries(result).map(function([key, value]) {
    return key;
  	});
  	var sourceNodes = linksData.map(function(link) {
    return link.target;
  	});
  	var firstNodes = allNodes.filter(function(node) {
    return !sourceNodes.includes(node);
  	});
  	
  	var totalValue = 0;
  	firstNodes.forEach(function (node) {
		Object.entries(result).map(function([key, value]) {
			if(key==node){
				totalValue+=value;
			}
			
			});
	});
	
	temp.getFirstlevelNodes(result, linksData);
	
	totalValue = parseFloat(temp.countDecimalPlaces(totalValue)) ;
  	// Calculate the total value for normalization
	//var totalValue = parseFloat(linksData.reduce(function(sum, item) { return sum + item.value; }, 0));
	
	/**source/target category color alert */
	var catcolor = temp.getCategoryColors().m_categoryColor;
	var subcatcolor = (this.getSubCategoryColors() != undefined)?this.getSubCategoryColors().m_subcategoryColor:[];
	// Output the unique names and their values
	
	var randomColor = [];
	for(i=0; i<50; i++){
		randomColor.push("#" + Math.floor(Math.random()*16777215).toString(16));
	}
	
		// Configure the series data
	var nodesData = Object.entries(result).map(function([key, value]) {
		var pct = parseFloat(temp.countDecimalPlaces(value / totalValue * 100).toString());
		var val= IsBoolean(temp.m_showpercentvalue)? ((pct > 0) ? pct + '%' : ''):value;
		/**DAS-623 */
		var nodecolor = IsBoolean(temp.m_showrandomnodecolor) ? (temp.getRandomHexColor()):(temp.chartJson.Chart.Level.Colors == "")?temp.m_defaultcolor:"";
		var itemStyle = "";
		if(nodecolor !="")
		{
			itemStyle = {
            	color: nodecolor,
            	 borderColor: nodecolor
          		}
			
		}
		var colorcode ="";
		if(catcolor.length>0){
			/**check color alert in source */
			colorcode = temp.returnCategoryColor(catcolor,key);
		}
		if(subcatcolor.length>0){
			var subcatcolorcode = temp.returnSubCategoryColor(subcatcolor,key);
			if(subcatcolorcode!="")
			colorcode = subcatcolorcode;
		}

		if(colorcode == ""){
			colorcode = temp.getValueColorAlert(value);
		}
		
		
		if(colorcode !=""){
			return ({
				name: key,
				value: val,
				itemStyle: {
				color: colorcode,
				borderColor: colorcode
				},
				total: totalValue,
				actvalue: value,
				percentage: pct
			});		
		}else{
				return ({
				name: key,
				value: val,
				itemStyle: itemStyle,
				total: totalValue,
				actvalue: value,
				percentage: pct
			});
			
		}
		
	});
		/**create links data */
		var linksData = linksData.map(function(item) { 
			return ({
		  		source: item.source,
		  		target: item.target,
		  		value: item.value,
		  		total: totalValue,
		  		actvalue: item.value,
		  		percentage: parseFloat(temp.countDecimalPlaces(item.value / totalValue * 100).toString())
		})});
	
	temp.m_nullValue = linksData.some(function(data) {
	  return isNaN(data.value) || data.source === "null" || data.target === "null";
	});
	
	temp.m_sankeydata["nodes"] = nodesData;
	temp.m_sankeydata["links"] = linksData;
	
	temp.m_nullValue = temp.checkSameNodeName(temp.m_sankeydata);
	
	// Initialize a variable to store the highest width of first and last level nodes	
	
	/**first level nodes */
	var allNodes = temp.m_sankeydata.nodes.map(function(node) {
    return node.name;
  	});
  	var sourceNodes = temp.m_sankeydata.links.map(function(link) {
    return link.target;
  	});
  	var firstLevelNodes = allNodes.filter(function(node) {
    return !sourceNodes.includes(node);
  });  
  		
	temp.highestFirstWidth = this.calculateNodeWidth(firstLevelNodes);
  	
  	/**last level nodes */  	
  	var allNodes = temp.m_sankeydata.nodes.map(function(node) {
    return node.name;
  	});
  	var sourceNodes = temp.m_sankeydata.links.map(function(link) {
    return link.source;
  	});
  	var lastLevelNodes = allNodes.filter(function(node) {
    return !sourceNodes.includes(node);
  	});
  	
	temp.highestLastWidth = this.calculateNodeWidth(lastLevelNodes);
	
};

/** DAS-725 @description get color alert for node based on node value **/
SankeyChart.prototype.getValueColorAlert = function (value) {
	var temp = this;
	/**get seriesc conditional color */
	var seriesColors = "";
	var seriesColor = temp.getConditionalColors().m_ConditionalColor;
	if((seriesColor != undefined && seriesColor !== null && seriesColor !== "" && seriesColor.length>0)) {
		for (var i = 0; i < seriesColor.length; i++) {
			var compareTo = parseFloat(seriesColor[i].m_compareto);
			var operator = (seriesColor[i].m_operator == "=") ? "==" : "" + seriesColor[i].m_operator;
				try {
					if ((operator == "==" || operator == "!=") && IsBoolean(isNaN(value))) {
						eval("result  = '" + value + "'" + operator + "'" + compareTo + "'");
					} else if (operator == "between") {
						var compareTo = seriesColor[i].m_compareto;
						var values = ("" + compareTo).split("~");
						if (value >= values[0] * 1 && value <= values[1] * 1) {
							result = true;
						} else {
							result = false;
						}
					} else {
						eval("result  = " + value + operator + compareTo);
					}
				} catch (e) {
					result = false;
				}
				
				/**return alert color if match found */
				if (IsBoolean(result)) {
					seriesColors = convertColorToHex(seriesColor[i].m_color);
				}
			}
	}
	return seriesColors;
}

/**@description function to get random color code */
SankeyChart.prototype.getRandomHexColor = function() {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
};

/**@description function to get alert color code based on source category */
SankeyChart.prototype.returnCategoryColor = function(catcolor, key){
	var colorcode ="";
	var temp=this;
	var firstNodes = temp.firstLevelNodes; /**source nodes */

		if(catcolor.length>0){
		for (var i = 0; i < catcolor.length; i++) {
				var isSubstringInArray = firstNodes.includes(key);
			if(key.indexOf(catcolor[i].m_categoryname) !== -1 && catcolor[i].m_categoryname!="" && isSubstringInArray){			
				colorcode = catcolor[i].m_color; 			
			}
			}
	}
	return colorcode;
	
};
/**@description function to get alert color code based on taget category */
SankeyChart.prototype.returnSubCategoryColor = function(catcolor, key){
	var colorcode ="";
	var temp=this;
	var firstNodes = temp.firstLevelNodes;/**source nodes */
		if(catcolor.length>0){
		for (var i = 0; i < catcolor.length; i++) {
			var isSubstringInArray = firstNodes.includes(key);
			if(key.indexOf(catcolor[i].m_subcategoryname) !== -1 && catcolor[i].m_subcategoryname!="" && !isSubstringInArray){		
				colorcode = catcolor[i].m_color; 			
			}
			}
	}
	return colorcode;
	
}
/** @description get sankey levels of nodes */
SankeyChart.prototype.calculateNumberOfLevels = function (data) {
	var uniqueNodes = new Set();
	var maxLevel = 0;
  // Iterate through the data to collect unique nodes and determine levels
  	data.forEach(function (item) {
    	uniqueNodes.add(item.source);
    	uniqueNodes.add(item.target);
	});
  var levels = {};
  data.forEach(function (item) {
    var sourceLevel = levels[item.source] || 1;
    var targetLevel = sourceLevel + 1;
    levels[item.target] = targetLevel;
    maxLevel = Math.max(maxLevel, targetLevel);
  });
  return maxLevel;
}

/** description get source nodes */
SankeyChart.prototype.getFirstlevelNodes = function(result, linksData) {
	/**last level nodes */  
	var temp = this;
  	var allNodes = Object.entries(result).map(function([key, value]) {
    return key;
  	});
  	var sourceNodes = linksData.map(function(link) {
    return link.target;
  	});
  	var firstNodes = allNodes.filter(function(node) {
    return !sourceNodes.includes(node);
  	});
  	
  	temp.firstLevelNodes = firstNodes;
}
/**@description function to get get the number of decimal places from a number */
SankeyChart.prototype.countDecimalPlaces = function(number){
	var temp = this;
	/*
  if (Math.floor(number) === number) {
    // If the number is an integer, there are no decimal places
    return number;
  }
  // Convert the number to a string
  var numberString = number.toString();
  // Find the position of the decimal point
  var decimalPosition = numberString.indexOf('.');
  // Return the length of the string after the decimal point
  var len = numberString.length - decimalPosition - 1;
  if(len>5){
	  return number.toFixed(5);
  }
  else{
	return number;  
  }
  */
 	if(isNaN(number)){
		 return 0;
	 }else{
	var decimal = 0;
	var text = number.toString();
	// verify if number 0.000005 is represented as "5e-6"
	if (text.indexOf('e-') > -1) {
	var [base, trail] = text.split('e-');
	var deg = parseInt(trail, 10);
	decimal =  deg;
	}
	// count decimals for number in representation like "0.123456"
	if (Math.floor(number) !== number) {
	decimal = number.toString().split(".")[1].length || 0;
	}
	if(decimal>5){
	  return number.toFixed(5);
  	}
  	else{
	return number;  
  	}
		 
	 }
  
  
};

/**function to calculate node labels width and returm highest among them */
SankeyChart.prototype.calculateNodeWidth = function(nodesArray){
	var temp = this;
	var highestFirstWidth = 0;
	var params = {}
	nodesArray.forEach(function(node) {
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		document.body.appendChild(svg);
		var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
		text.setAttribute("fill", "black");
		text.setAttribute("font-size", temp.m_labelfontsize + "px"); // Example font size
		text.setAttribute("font-family", temp.m_labelfontfamily); // Example font family
		text.setAttribute("font-weight", temp.m_labelfontweight); // Example font family
		var foundObject = temp.m_sankeydata.nodes.find(obj => obj.name === node);
		if (foundObject) {
			params.value = foundObject.value;
			params.name = node;
			var a = temp.getPrecisonData(params)
			text.textContent = a;
		} else {
			text.textContent = node;
		}

		svg.appendChild(text);
		var textWidth = text.getBBox().width;
		if (textWidth > highestFirstWidth) {
			highestFirstWidth = textWidth;
		}
		document.body.removeChild(svg);
	});
	return highestFirstWidth;
};

/** @description If a category contains duplicate SubCategory than performing aggrigation and assigning to subcategory values**/
SankeyChart.prototype.manageRepeatedSubCategory = function() {
    /**Map Creation of Data**/
    var mapData = {};
    var mapDataLabel = {};
    var mapColor = {};
    for (var i = 0; i < this.m_categoryData[0].length; i++) {
        if (mapData[this.m_categoryData[0][i]] == undefined) {
            mapData[this.m_categoryData[0][i]] = {};
            mapDataLabel[this.m_categoryData[0][i]] = {};
            mapColor[this.m_categoryData[0][i]] = {};
        }
        if (mapData[this.m_categoryData[0][i]][this.m_subCategoryData[0][i]] == undefined) {
            mapData[this.m_categoryData[0][i]][this.m_subCategoryData[0][i]] = [];
            mapDataLabel[this.m_categoryData[0][i]][this.m_subCategoryData[0][i]] = [];
            mapColor[this.m_categoryData[0][i]][this.m_subCategoryData[0][i]] = [];
        }
        var arr = [];
        var arrDataLabel = [];
        var seriesColor = [];
        this.setSeriesDataLabel();
        for (var k = 0; k < this.m_seriesData.length; k++) {
            arr.push(this.m_seriesData[k][i]);
        }
        for (var k = 0; k < this.m_seriesDataForDataLabel.length; k++) {
            arrDataLabel.push(this.m_seriesDataForDataLabel[k][i]);
        }
        for (var k = 0; k < this.m_seriesColorsArray.length; k++) {
            seriesColor.push(this.m_seriesColorsArray[k][i]);
        }
        mapData[this.m_categoryData[0][i]][this.m_subCategoryData[0][i]].push(arr);
        mapDataLabel[this.m_categoryData[0][i]][this.m_subCategoryData[0][i]].push(arrDataLabel);
        mapColor[this.m_categoryData[0][i]][this.m_subCategoryData[0][i]].push(seriesColor);
    }
    /**ending of map creation**/
    /**starting of setting average of repeated subcategory in category**/
    for (var key in mapData) {
        for (var key1 in mapData[key]) {
            var SumArry = [];
            var SumArryDataLabel = [];
            var colorArry = [];
            for (var j = 0; j < mapData[key][key1][0].length; j++) {
                var processArr = [];
                var processArrDataLabel = [];
                var processColorArry = [];
                for (var i = 0; i < mapData[key][key1].length; i++) {
                    if (isNaN(mapData[key][key1][i][j])) {
                        /**To support comma values (eg. "12,345.97","-12,345.97") **/
                        var RemovedCommaData = removeCommaFromSrting(mapData[key][key1][i][j]);
                        if (RemovedCommaData !== "") {
                            processArr.push(RemovedCommaData);
                        } else {
                            processArr.push(mapData[key][key1][i][j]);
                        }
                    } else {
                        processArr.push(mapData[key][key1][i][j]);
                    }
                    processArrDataLabel.push(mapDataLabel[key][key1][i][j]);
                    processColorArry.push(mapColor[key][key1][i][j]);
                }
                /**Added
                 * To check weather sub category contain same name, if it is then it shows the average of all that values.
                 * If all the values are string then after apply aggregation it will return empty string and nothing will display in tooltip in the place of value.
                 * If any of the value is numeric there then it will display that.
                 */
                if (processArr.length === 1) {
                    SumArry.push(processArr[0]);
                    SumArryDataLabel.push(processArrDataLabel[0]);
                    colorArry.push(processColorArry[0]);
                } else {
                    var AggregatedValue = getAggregationOperatedData(processArr, this.m_aggroperation);
                    if (AggregatedValue === "") {
                        for (var l = 0; processArr.length > l; l++) {
                            if (processArr[l] == 0) {
                                AggregatedValue = 0;
                                break;
                            }
                        }
                    }
                    SumArry.push(AggregatedValue);
                    SumArryDataLabel.push(getAggregationOperatedData(processArrDataLabel, this.m_aggroperation));
                    colorArry.push(processColorArry[0]);
                }
            }
            mapData[key][key1] = SumArry;
            mapDataLabel[key][key1] = SumArryDataLabel;
            mapColor[key][key1] = colorArry;
        }
    }
    /**reinitialize the category,subcategory,seriesData array**/
    this.m_categoryData[0] = [];
    this.m_subCategoryData[0] = [];
    this.m_seriesData = [];
    this.m_seriesDataForDataLabel = [];
    this.m_seriesColorsArray = [];
    for (var key in mapData) {
        for (var key1 in mapData[key]) {
            for (var i = 0; i < mapData[key][key1].length; i++) {
                this.m_seriesData[i] = [];
                this.m_seriesDataForDataLabel[i] = [];
                this.m_seriesColorsArray[i] = [];
            }
        }
    }
    /**reset the category,subcategory,seriesData**/
    for (var key in mapData) {
        for (var key1 in mapData[key]) {
            this.m_categoryData[0].push(key);
            this.m_subCategoryData[0].push(key1);
            for (var i = 0; i < mapData[key][key1].length; i++) {
                this.m_seriesData[i].push(mapData[key][key1][i]);
                this.m_seriesDataForDataLabel[i].push(mapDataLabel[key][key1][i]);
                this.m_seriesColorsArray[i].push(mapColor[key][key1][i]);
            }
        }
    }
};

/** @description Getting series data from comma seperator values **/
SankeyChart.prototype.updateSeriesDataWithCommaSeperators = function() {
    this.m_displaySeriesDataFlag = [];
    for (var i = 0; i < this.m_seriesData.length; i++) {
        this.m_displaySeriesDataFlag[i] = [];
        for (var j = 0; j < this.m_seriesData[i].length; j++) {
            this.m_displaySeriesDataFlag[i][j] = true;
            if (isNaN(this.m_seriesData[i][j])) {
                this.m_displaySeriesDataFlag[i][j] = false;
                this.m_seriesData[i][j] = getNumericComparableValue(this.m_seriesData[i][j]);
            }
        }
    }
};

/** @description Drawing of chartFrame,Title,Subtitle,XAxis,YAxis,BarChart **/
SankeyChart.prototype.drawChart = function() {
    var temp= this;
    this.drawChartFrame();
    this.drawTitle();
    this.drawSubTitle();
    this.drawLegends();
	var map = this.IsDrawingPossible();
	$('#chart_container' + temp.m_objectid).remove();
	if (IsBoolean(map.permission)) {
	    if ((!IsBoolean(this.isEmptyCategory)) || (!IsBoolean(this.isEmptySubCategory))) {
	        if (!IsBoolean(this.m_isEmptySeries)) {
	            if (IsBoolean(this.isVisibleSeries())) {
					if(IsBoolean(this.m_nullValue)){
						this.drawSVGMessage("Invalid Sankey Data");
					} else {
						this.drawConatiner();
						this.setSVGDimension();
						this.drawSankeyChart();
					}
		        } else {
	                this.drawSVGMessage("No visible Series Available");
	            }
	        } else {
	            this.drawSVGMessage(this.m_status.noData);
	        }
	    } else {
	        this.drawSVGMessage("No Visible Category OR SubCategory Field Available");
	    }
    }else {
		this.drawSVGMessage(map.message);
	}
};

SankeyChart.prototype.drawConatiner = function() {
	var temp = this;
	$('#chart_container' + temp.m_objectid).remove();
	var chartContainer = document.createElement('div');
	chartContainer.setAttribute('id', 'chart_container' + temp.m_objectid);
	chartContainer.onclick = (function () {
		temp.getDataPointAndUpdateGlobalVariable();
	});
	$("#draggableDiv" + temp.m_objectid).append(chartContainer);
};

SankeyChart.prototype.setSVGDimension = function() {
	//var ht = (this.getTitleBarHeight() * 1) + (IsBoolean(this.m_subTitle.m_showsubtitle) ? this.m_subTitle.m_subtitleText.getBBox().height * 1 + this.m_subTitle.m_titleMargin : 0);
	//var ht = this.m_subTitle.m_titleMargin + (IsBoolean(this.m_subTitle.m_showsubtitle) ? this.m_subTitle.m_subtitleText.getBBox().height * 1 : 0);
	var ht = this.m_subTitle.m_titleMargin + (IsBoolean(this.m_subTitle.m_showsubtitle) ? this.m_subTitle.m_subtitleText != undefined ? this.m_subTitle.m_subtitleText.getBBox().height * 1  : this.m_subTitle.m_subTitleBarHeight*1 : 0);
	$("#" + this.svgContainerId).css("height", this.m_height+"px");
	$("#GradientRect" + this.m_objectid).css("height", this.m_height+"px");
	$("#chart_container" + this.m_objectid).css("top", (ht+5)+"px");
	$("#chart_container" + this.m_objectid).css("height", this.m_height-ht + "px");
	$("#chart_container" + this.m_objectid).css("width", this.m_width + "px");
	$("#chart_container" + this.m_objectid).css("position", "absolute");
};
/** @description set random color */
SankeyChart.prototype.initializeColor = function () {
	this.m_color = [];
	if (!IsBoolean(this.m_showrandomnodecolor)) {
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
/** @description Check Sankey Chart data id source and target node is same **/
SankeyChart.prototype.checkSameNodeName = function(sankeyData) {
  
  for (var j = 0; j < sankeyData.links.length; j++) {
    var link = sankeyData.links[j];
    var sourceNode = link.source;
    var targetNode = link.target;

    if (sourceNode && targetNode && sourceNode === targetNode) {
      return true; // Same node name found for source and target
    }
  }

  return false;
};

/** @description Draw Sankey Chart**/
SankeyChart.prototype.drawSankeyChart = function() {
	var temp = this;
	var dom = document.getElementById("chart_container" + temp.m_objectid);
	//dom.style.overflow = "auto";
	var myChart = echarts.init(dom, null, {
	  renderer: 'svg'
	});
	var data = temp.m_sankeydata;		
	var levels = [];   
	var levelnumber = temp.calculateNumberOfLevels(temp.m_sankeydata.links)
	if(!IsBoolean(temp.m_showrandomnodecolor)){
		var colors = temp.chartJson.Chart.Level.Colors.split(",");
		
		for(i=0; i<colors.length; i++){
			if(colors[i] != ""){
				levels.push({
					"depth": i,
					"itemStyle": {
				    	"color": colors[i]
				    }
				});
		}	
		}
		
	}
	/**check if there is any empty level */
	for(var i=0;i<levelnumber;i++){
		if(levels.length>0){
			if(levels[i] == undefined)
			{
				levels.push({
					"depth": i,
					"itemStyle": {
				    	"color": temp.m_defaultcolor
				    }
				});
			}
		}
	}
	myChart.showLoading();
	/**DAS-625 */
	switch (temp.m_textalign) {
	  case 'left':
	    var left= (temp.highestFirstWidth + 10 + "px");
		var right= "0";
	    break;
	
	  case 'top':
	    var left= (temp.highestFirstWidth/2) + "px";
		var right= (temp.highestLastWidth/2) + "px";
	    break;
	
	  case 'bottom':
	    var left= (temp.highestFirstWidth/2) + "px";
		var right= (temp.highestLastWidth/2) + "px";
	    break;
	
	  default:
		var left= "0";
		var right= (temp.highestLastWidth + 10 + "px");
	    break;
	}
	var option = {
			tooltip: {
				show:IsBoolean(temp.m_customtextboxfortooltip.dataTipType!="None"),
				responsive: true,
        		trigger: 'item',				
				formatter: function (params) {
					var toolTipData = temp.getToolTipData(params,params.dataIndex);
					if(params.data.source!=undefined)
					return temp.drawEdgeChartToolTip(toolTipData);
					else
					return temp.drawNodeChartToolTip(toolTipData);
			    },
			    //backgroundColor: temp.m_tooltipbackgroundcolor,
			    borderColor: temp.m_tooltipbordercolor,
			    borderWidth: 2,
			    padding: 0,
			    textStyle: {
					fontSize: temp.m_tooltipfontsize,
					color: temp.m_tooltipfontcolor,
					fontStyle: temp.m_tooltipfontstyle,
					fontWeight: temp.m_tooltipfontweight,
					fontFamily: temp.m_tooltipfontfamily
				}
			},
			//color: IsBoolean(temp.m_showrandomnodecolor) ? randomColor : "",
			animation: temp.m_enableanimation,
			textStyle : {
				fontFamily: temp.m_labelfontfamily,
				fontSize: Number(temp.m_labelfontsize),
				fontStyle: temp.m_labelfontstyle,
				fontWeight: temp.m_labelfontweight,
				color: temp.m_labelfontcolor,
			},
			series: [{
				type: 'sankey',
				data: data.nodes,
				links: data.links,
				left: left,
				right: right,
				emphasis: {
					focus: temp.m_highlightpathstyle
				},
				//layoutIterations: 0,
				nodeGap: parseFloat(temp.m_nodegap),
				levels: levels,
				nodeAlign: 'left',
				
				lineStyle: {
					color: temp.m_linestyle,
					curveness: 0.5,
					opacity: parseFloat(temp.m_lineopacity)
				},
				label: {
					formatter: function (params) {
						return temp.getPrecisonData(params);				      
				    },
				    position: temp.m_textalign,
			        textStyle: {
						fontFamily: temp.m_labelfontfamily,
						fontSize: Number(temp.m_labelfontsize),
						fontStyle: temp.m_labelfontstyle,
						fontWeight: temp.m_labelfontweight,
						color: temp.m_labelfontcolor
			        },
			  	}
			}]
		};
		try{
			myChart.setOption((option));
			
		}catch(e)
		{
			console.log(e);
		}
		if (option && typeof option === 'object') {
	  myChart.setOption(option);
	  myChart.hideLoading();
	}
	
	
};

/** @description drawing line accroding to the passed parameter value**/
SankeyChart.prototype.drawLine = function(startX, StartY, endX, endY) {
    var temp = this;
    var newLine = drawSVGLine(startX, StartY, endX, endY, "0.5", hex2rgb(this.m_markercolor, this.m_markertransparency));
    $("#horizontallinegrp" + temp.m_objectid).append(newLine);
};

/** @description Canvas Initialization and removing already present canvas which have same id **/
SankeyChart.prototype.initCanvas = function() {
    var temp = this;
    $("#draggableDiv" + temp.m_objectid).remove();
    this.initializeDraggableDivAndCanvas();
};

/** @description Initialization of Draggable Div and Canvas **/
SankeyChart.prototype.initializeDraggableDivAndCanvas = function() {
    this.setDashboardNameAndObjectId();
    this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
    this.createDraggableCanvas(this.m_draggableDiv);
    this.setCanvasContext();
    this.createSVG();
    $("#draggableCanvas" + this.m_objectid).hide();
    this.initMouseMoveEvent(this.m_chartContainer);
    this.initMouseClickEventForSVG(this.svgContainerId);
};

/** @description createSVG Method used for create SVG element for Chart **/
SankeyChart.prototype.createSVG = function() {
    var temp = this;
    this.svgContainerId = "svgContainer" + temp.m_objectid;
    $("#" + temp.svgContainerId).remove();
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xlink", "http://www.w3.org/1999/xlink");
    svg.setAttribute("width", this.m_width);
    svg.setAttribute("height", this.m_height);
    svg.setAttribute("id", this.svgContainerId);
    $("#draggableDiv" + temp.m_objectid).append(svg);
};

/** @description Calculating required parameters which will use in further processing inside this function **/
SankeyChart.prototype.initializeCalculation = function() {
    var seriesData = this.updateSeriesData(this.visibleSeriesInfo.seriesData);
    var categoryData = this.updateSeriesData(this.m_categoryData);
    var subCategoryData = this.updateSeriesData(this.m_subCategoryData);

    this.calculateMinimumMaximum(seriesData);

    this.setChartDrawingArea();
    //create map Array
    this.dataMap = {};
    if (IsBoolean(this.isEmptyCategory) && !IsBoolean(this.isEmptySubCategory)) {
        this.m_calculation.init(this, subCategoryData, this.visibleSeriesInfo.seriesData, this.dataMap);
    } else if (!IsBoolean(this.isEmptyCategory) && IsBoolean(this.isEmptySubCategory)) {
        this.m_calculation.init(this, categoryData, this.visibleSeriesInfo.seriesData, this.dataMap);
    } else {
        for (var i = 0; i < categoryData.length; i++) {
            if (this.dataMap[categoryData[i][0]] == undefined) {
                this.dataMap[categoryData[i][0]] = {};
            }
            this.dataMap[categoryData[i][0]][subCategoryData[i][0]] = seriesData[i];
        }
        this.m_calculation.init(this, subCategoryData, this.visibleSeriesInfo.seriesData, this.dataMap);
    }
    this.m_xPositionArray = this.m_calculation.getXPositionArray();
    this.m_yPositionArray = this.m_calculation.getYPositionArray();
    this.m_barWidth = this.m_calculation.getbarWidth();
    this.m_noofseries = this.m_calculation.xAxisData.length;
    this.m_barGap = this.m_calculation.getBarGap();
    this.m_barWidthArray = this.m_calculation.getstackHeightArray();

    if ((IsBoolean(this.getCounterFlagForSeriesVisiblity())) && IsBoolean(this.m_showmarkingorpercentvalue)) {
        this.m_percentageArray = IsBoolean(this.m_showpercentvalue) ? (IsBoolean(this.getCheckedAllPosContainigZero()) ? (this.getPercentage()) : (this.getRoundValue(this.getPercentage(), 100))) : (this.getPercentage());
        //this.m_percentageArray = this.getPercentage();
        this.m_showPerCentageFlag = true;
    } else {
        this.m_percentageArray = this.getArrayWhenPercentFlagIsFalse();
        this.m_seriesInitializeFlag = false;
    }
    //this.setColorsForSeries();
    this.initializeBars();
    this.initializeDataLabel();
};

/** @Description calculate the Min/Max value and get required ScaleInfo of The Axis **/
SankeyChart.prototype.calculateMinimumMaximum = function(seriesdata) {
    var minMax;
    if (this.m_charttype.toLowerCase() == "clustered") {
		minMax = this.calculateMinMaxValue(seriesdata);
	} else {
		if((this.m_charttype.toLowerCase() == "stacked") && (seriesdata[0].length === 1)) {
			minMax = this.calculateMinMaxValue(seriesdata);
		} 	else {
			minMax = this.calculateFinalMinMaxValue(seriesdata);
		}
	}

    var calculatedMin = minMax.min;
    var calculatedMax = minMax.max;

    var niceScaleObj = this.getCalculateNiceScale(calculatedMin, calculatedMax, this.m_basezero, this.m_autoaxissetup, this.m_minimumaxisvalue, this.m_maximumaxisvalue, (this.m_height));
    this.min = niceScaleObj.min;
    this.max = niceScaleObj.max;
    this.m_numberOfMarkers = niceScaleObj.markerArray.length;
    this.m_yAxisText = niceScaleObj.step;
    this.m_yAxisMarkersArray = niceScaleObj.markerArray;
};

/** @description calculate max,min from series data**/
SankeyChart.prototype.calculateFinalMinMaxValue = function(xAxisData) {
    var calculateMax = (isNaN(xAxisData[0][0] * 1)) ? 0 : xAxisData[0][0] * 1;
    var calculateMin = (isNaN(xAxisData[0][0] * 1)) ? 0 : xAxisData[0][0] * 1;
    if (this.m_charttype == "100%") {
        var negFlag = false;
        for (var i = 0, length = xAxisData.length; i < length; i++) {
            for (var j = 0, innerlength = xAxisData[i].length; j < innerlength; j++) {
                if (xAxisData[i][j] < 0) {
                    negFlag = true;
                    break;
                }
            }
        }
        calculateMax = 100;
        calculateMin = (IsBoolean(negFlag)) ? -100 : 0;
    } else {
        for (var i = 0, length = xAxisData.length; i < length; i++) {
            var height = 0;
            var negHeight = 0;
            var stackLength = xAxisData[i].length;
            for (var j = 0; j < stackLength; j++) { // number of stacks in one rectangle
                if (!isNaN(xAxisData[i][j] * 1)) {
                    if (xAxisData[i][j] * 1 > 0)
                        height = (height) * 1 + (xAxisData[i][j] * 1) * 1;
                    else
                        negHeight = (xAxisData[i][j] * 1) * 1 + (negHeight) * 1;
                }
            }
            if ((height) >= (calculateMax))
                calculateMax = height * 1;
            if ((negHeight * 1) < (calculateMin))
                calculateMin = negHeight * 1;
        }
    }
    return {
        max: calculateMax,
        min: calculateMin
    };
};

/** @description Calculating box division for each category with respect to the number of category and chart width , height **/
SankeyChart.prototype.calculateCategoryBoxSize = function() {
    var boxWidth = {};
    var y = this.getEndX() - this.m_barGap / 2;
    var i = Object.keys(this.dataMap).length - 1;
    for (Object.keys(this.dataMap)[i] in this.dataMap) {
        var count = 0;
        for (var subCat in this.dataMap[Object.keys(this.dataMap)[i]]) {
            count++;
        }
        if (IsBoolean(this.m_mergesubcategory) && this.m_categoryNames[0] != undefined) {
            y = y - (count * this.m_barWidth) - (this.m_barGap / 2);
        } else {
            y = y - (count * this.m_barWidth + this.m_barGap * count - this.m_barGap / 2);
        }
        boxWidth[Object.keys(this.dataMap)[i]] = y;

        y = y - this.m_barGap / 2;
        i--;
    }
    return boxWidth;
};

/** @description Checking is all series data conatin zero **/
SankeyChart.prototype.getCheckedAllPosContainigZero = function() {
    var flag = true;
    for (var i = 0; i < this.m_seriesData[this.m_seriesVisiblityPosition].length; i++) {
        if (this.m_seriesData[this.m_seriesVisiblityPosition][i] != 0)
            flag = false;
    }
    return flag;
};

/** @description Initializing percent array with Zero **/
SankeyChart.prototype.getArrayWhenPercentFlagIsFalse = function() {
    var per = [];
    for (var i = 0; i < this.m_seriesData.length; i++) {
        per[i] = 0;
    }
    return per;
};

/** @description Calculating Percentage of series values **/
SankeyChart.prototype.getPercentage = function() {
    var per = [];
    var sumOfSeries = this.getSumOfSeriesData();
    for (var i = 0; i < this.m_seriesData[this.m_seriesVisiblityPosition].length; i++) {
        if (IsBoolean(this.m_showpercentvalue)) {
            if (this.m_seriesData[this.m_seriesVisiblityPosition][i] > 0)
                per[i] = (this.m_seriesData[this.m_seriesVisiblityPosition][i] / sumOfSeries) * 100;
            else
                per[i] = 0;
            this.m_showPercentValueFlag = true;
        } else
            per[i] = this.m_seriesData[this.m_seriesVisiblityPosition][i];
    }
    return per;
};

/** @description Calculating sum of series data**/
SankeyChart.prototype.getSumOfSeriesData = function() {
    var sum = 0;
    for (var i = 0; i < this.m_seriesData[this.m_seriesVisiblityPosition].length; i++) {
        if (this.m_seriesData[this.m_seriesVisiblityPosition][i] == "NaN")
            this.m_seriesData[this.m_seriesVisiblityPosition][i] = 0;
        if (this.m_seriesData[this.m_seriesVisiblityPosition][i] > 0)
            sum = sum * 1 + this.m_seriesData[this.m_seriesVisiblityPosition][i] * 1;
    }
    return sum;
};

/** @description BarSeries Initialization**/
SankeyChart.prototype.initializeBars = function() {
    this.m_barSeriesArray = {};
    for (var i = 0; i < this.visibleSeriesInfo.seriesName.length; i++) {
        this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[i]] = new GroupColumnSeries();
        var barWidth = (this.m_charttype == "clustered") ? this.m_barWidth / this.visibleSeriesInfo.seriesName.length : this.m_barWidth;
        /**Added for bar drawing position issue*/
        if (this.m_charttype == "clustered") {
            barWidth = barWidth * this.clusteredbarpadding;
        }
        this.m_barSeriesArray[this.visibleSeriesInfo.seriesName[i]].init(this.m_xPositionArray[i], this.m_yPositionArray[i], barWidth, this.m_barWidthArray[i], this.m_percentageArray, this.getColorsForSeries()[i], this.m_strokecolor, this.m_showmarkingorpercentvalue, this.m_showPercentValueFlag, this.m_seriesInitializeFlag, this.m_plotTrasparencyArray[i], this);
    }
};
/** @description Data Label for BarSeries Initialization**/
SankeyChart.prototype.initializeDataLabel = function() {
    this.m_valueTextSeries = {};
    if (!(this.getCategoryNames().length != 0 && this.getSubCategoryNames()[0] != undefined)) {
        this.m_seriesDataForDataLabel = [];
    }
    /**Added when subcategory is not there in the chart*/
    if ((this.m_seriesDataForDataLabel.length === undefined) || IsBoolean(this.isEmptySubCategory) || (this.m_seriesDataForDataLabel.length === 0)) {
        this.setSeriesDataLabel();
    }
    for (var k = 0, i1 = 0; i1 < this.m_seriesNames.length; i1++) {
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i1]])) {
            if (IsBoolean(this.m_seriesDataLabelProperty[i1].showDataLabel)) {
                if ((this.m_charttype == "100%") && (this.m_seriesDataLabelProperty[k].showPercentValue !== undefined) && IsBoolean(this.m_seriesDataLabelProperty[k].showPercentValue)) {
                    this.m_seriesDataForDataLabel[k] = this.getPercentageForHundred()[k];
                    var value = k;
                } else {
                    var value = i1;
                }
                var barWidth = (this.m_charttype == "clustered") ? this.m_barWidth / this.visibleSeriesInfo.seriesName.length : this.m_barWidth;
                this.m_valueTextSeries[this.m_seriesNames[i1]] = new SVGValueTextSeries();
                this.m_valueTextSeries[this.m_seriesNames[i1]].init(this.m_xPositionArray[k], this.m_yPositionArray[k], this, this.m_seriesDataForDataLabel[value], this.m_seriesDataLabelProperty[i1], this.m_seriesData[i1], barWidth, this.m_barWidthArray[k], "column");
            };
            k++;
        }
    }
};

/** @description creating series data for data label**/
SankeyChart.prototype.setSeriesDataLabel = function() {
    this.m_seriesDataForDataLabel = [];
    for (var k = 0, length = this.getDataProvider().length; k < length; k++) {
        var record = this.getDataProvider()[k];
        for (var j = 0, serlength = this.getSeriesNames().length; j < serlength; j++) {
            if (!this.m_seriesDataForDataLabel[j]) {
                this.m_seriesDataForDataLabel[j] = [];
            }
            var dataFordatalabel = this.getValidFieldDataFromRecord(record, this.m_seriesDataLabelProperty[j].datalabelField);
            this.m_seriesDataForDataLabel[j][k] = dataFordatalabel;
        }
    }
};
/** @description Getter for Series Color **/
SankeyChart.prototype.getColorsForSeries = function() {
    return this.m_seriesColorsArray;
};

/** @description Setter for Series Color **/
SankeyChart.prototype.setColorsForSeries = function() {
	
	var isemptyCat = true;//DAS-1122
	for (var i = 0; i < this.m_categoryData.length && isemptyCat; i++) {
		isemptyCat = Array.isArray(this.m_categoryData[i]) && this.m_categoryData[i].length === 0;
	}

    this.m_seriesColorsArray = [];
    if (IsBoolean(this.m_enablecolorfromdrill) && IsBoolean(this.m_startDrill)) {
        for (var i = 0; i < this.visibleSeriesInfo.seriesData.length; i++) {
            this.m_seriesColorsArray[i] = [];
            for (var j = 0; j < this.visibleSeriesInfo.seriesData[i].length; j++) {
                this.m_seriesColorsArray[i][j] = this.m_drillColor;
            }
        }
    } else if (!IsBoolean(this.m_designMode) && (this.getCategoryColors() != undefined) && this.getCategoryColors() != "" && this.getCategoryColors().getCategoryColor().length > 0 && IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName()) && this.m_categoryJSON.length > 0) {
        var categoryColors = [];
        if (this.m_subCategoryNames.length > 0 && this.m_categoryNames.length == 0) {
            categoryColors = this.getCategoryColors().getCategoryColorsForCategoryNames(this.getSubCategoryData()[0], this.m_categoryFieldColor);
        } else {
            categoryColors = this.getCategoryColors().getCategoryColorsForCategoryNames(this.getCategoryData()[0], this.m_categoryFieldColor);
        }
        for (var i = 0; i < this.visibleSeriesInfo.seriesData.length; i++) {
            this.m_seriesColorsArray[i] = [];
            for (var j = 0; j < this.visibleSeriesInfo.seriesData[i].length; j++) {
                this.m_seriesColorsArray[i][j] = categoryColors[j];
            }
        }
    } else if (!IsBoolean(this.m_designMode) && (this.getSubCategoryColors() != undefined) && this.getSubCategoryColors() != "" && this.getSubCategoryColors().getSubCategoryColor().length > 0 && IsBoolean(this.getSubCategoryColors().getshowColorsFromSubCategoryName()) && this.m_subCategoryJSON.length > 0) {
        var categoryColors = this.getSubCategoryColors().getSubCategoryColorsForSubCategoryNames(this.getSubCategoryData()[0], this.m_categoryFieldColor);
        for (var i = 0; i < this.visibleSeriesInfo.seriesData.length; i++) {
            this.m_seriesColorsArray[i] = [];
            for (var j = 0; j < this.visibleSeriesInfo.seriesData[i].length; j++) {
                this.m_seriesColorsArray[i][j] = categoryColors[j];
            }
        }
    } else if (!IsBoolean(this.m_designMode) && this.getCategoryColors() != "" && (!IsBoolean(this.getCategoryColors().getshowColorsFromCategoryName()) || this.getCategoryColors().getCategoryColor().length == 0) && this.getConditionalColors() != "" && this.getConditionalColors() != undefined && this.getConditionalColors().getConditionalColor().length > 0 && !IsBoolean(isemptyCat)) {
        var conditionalColors = this.getConditionalColors().getConditionalColorsForConditions(this.visibleSeriesInfo.seriesName, this.visibleSeriesInfo.seriesColor, this.visibleSeriesInfo.seriesData, this);
        for (var i = 0; i < this.visibleSeriesInfo.seriesData.length; i++) {
            this.m_seriesColorsArray[i] = [];
            for (var j = 0; j < this.visibleSeriesInfo.seriesData[i].length; j++) {
                this.m_seriesColorsArray[i][j] = conditionalColors[i][j];
            }
        }
    } else {
        var seriesColors = this.visibleSeriesInfo.seriesColor;
        for (var i = 0; i < this.visibleSeriesInfo.seriesData.length; i++) {
            this.m_seriesColorsArray[i] = [];
            for (var j = 0; j < this.visibleSeriesInfo.seriesData[i].length; j++) {
                this.m_seriesColorsArray[i][j] = seriesColors[i];
            }
        }
    }
};

/** @description Tranforming dimension of 2D array **/
SankeyChart.prototype.updateSeriesData = function(array) {
    var arr = [];
    if ((array != undefined && array !== null && array !== "") && array.length != 0) {
        for (var i = 0; i < array[0].length; i++) {
            arr[i] = [];
            for (var j = 0; j < array.length; j++) {
                arr[i][j] = array[j][i];
            }
        }
    }
    return arr;
};

/** @description Drawing of Title **/
SankeyChart.prototype.drawTitle = function() {
    this.m_title.draw();
};

/** @description Drawing of SubTitle **/
SankeyChart.prototype.drawSubTitle = function() {
    this.m_subTitle.draw();
};

/** @description Drawing of XAxis**/
SankeyChart.prototype.drawXAxis = function() {
    this.createHorizontalLineGroup('horizontallinegrp');
    if (IsBoolean(this.m_showverticalmarkerline))
        this.drawPartitionLine();
    if (IsBoolean(this.m_showcatpartitioner))
        this.drawCategoryPartitionLine();
    this.createXAxisMarkerLabelGroup('xaxislabelgrp');
    this.createXAxisCategoryMarkerLabelGroup('xaxiscategorylabelgrp');
    this.createXAxisSubCategoryMarkerLabelGroup('xaxissubcategorylabelgrp');
    this.drawHorizontalPartLine();
    this.m_xAxis.markXaxis();
    this.m_xAxis.drawXAxis();
    this.m_xAxis.drawSubCategory();
    this.m_xAxis.drawCategory();
};

/** @description Drawing Vertical Partiton line between category and subcategory**/
SankeyChart.prototype.drawHorizontalPartLine = function() {
    var startY = this.getStartY() + this.getSubCatTextMargin() + 10;
    this.drawLine(this.getStartX(), startY, this.getEndX(), startY);
};

/** @description centralized method to create group for xaxis , yaxis , data label, etc  **/
SankeyChart.prototype.createXAxisCategoryMarkerLabelGroup = function(name) {
    var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute('id', name + this.m_objectid);
    group.setAttribute('class', name);
    $(group).css({
        "font-family": selectGlobalFont(this.m_xAxis.getLabelFontFamily()),
        "font-style": this.m_xAxis.getLabelFontStyle(),
        "font-size": this.fontScaling(this.m_xAxis.getLabelFontSize()) + "px",
        "font-weight": this.m_xAxis.getLabelFontWeight(),
        "text-decoration": this.m_xAxis.getLabelTextDecoration()
    });
    $("#" + this.svgContainerId).append(group);
    //return group;
};

SankeyChart.prototype.createXAxisSubCategoryMarkerLabelGroup = function(name) {
    var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute('id', name + this.m_objectid);
    group.setAttribute('class', name);
    $(group).css({
        "font-family": selectGlobalFont(this.m_xAxis.getLabelFontFamily()),
        "font-style": this.m_xAxis.getLabelFontStyle(),
        "font-size": this.fontScaling(this.m_xAxis.m_subcategoryfontsize) + "px",
        "font-weight": this.m_xAxis.getLabelFontWeight(),
        "text-decoration": this.m_xAxis.getLabelTextDecoration()
    });
    $("#" + this.svgContainerId).append(group);
    //return group;
};

/** @description Calculating StartX,StartY,EndX,EndY for partition line**/
SankeyChart.prototype.drawCategoryPartitionLine = function() {
    var startPoint = this.getStartY() + this.getSubCatTextMargin() + this.m_yAxis.m_axislinetotextgap;
    if (this.m_subcategoryorientation == "left")
        startPoint = this.getStartY() + this.getCatTextMargin() + this.getSubCatTextMargin() + this.m_yAxis.m_axislinetotextgap;
    else
        startPoint = this.getStartY() + this.getCatTextMargin() + this.m_yAxis.m_axislinetotextgap;

    var boxSize = this.calculateCategoryBoxSize();
    for (var key in boxSize) {
        this.drawLine(boxSize[key], this.getStartY() * 1, boxSize[key], startPoint);
    }
};

/** @description Drawing Line which will create partition between the category Data**/
SankeyChart.prototype.drawPartitionLine = function() {
    var startPoint = this.getStartX();
    this.drawLine(startPoint, this.getStartY() * 1 + 1 * 1, this.getEndX() * 1 - 1 * 1, this.getStartY() * 1 + 1 * 1);
    var boxSize = this.calculateCategoryBoxSize();
    for (var key in boxSize) {
        this.drawLine(boxSize[key], this.getStartY() * 1, boxSize[key], this.getEndY() * 1);
    }
};

/** @description Drawing Y Axis**/
SankeyChart.prototype.drawYAxis = function() {
    if (IsBoolean(this.m_showhorizontalmarkerline))
        this.m_yAxis.horizontalMarkerLines();
    if (IsBoolean(this.m_zeromarkerline) && !IsBoolean(this.m_basezero) && IsBoolean(this.m_yAxis.hasNegativeAxisMarker(this.m_yAxisMarkersArray)))
        this.m_yAxis.zeroMarkerLine();
    this.createYAxisMarkerLabelGroup('yaxislabelgrp');
    this.m_yAxis.drawYAxis();
    this.m_yAxis.markYaxis();
};

/** @description Drawing Vertical Partiton line between category and subcategory**/
SankeyChart.prototype.drawVerticalPartLine = function() {
    var startX = this.getStartX() - this.getSubCatTextMargin();
    this.drawLine(startX, this.getStartY(), startX, this.getEndY());
};

/** @description Will Draw ChartFrame and gradient if given any, default is #ffffff **/
SankeyChart.prototype.drawChartFrame = function() {
    this.m_chartFrame.drawSVGFrame();
    this.getBGGradientColorToContainer();
};

/** @description Will generate the gradient and fill in background of chart  **/
SankeyChart.prototype.getBGGradientColorToContainer = function() {
    var temp = this;
    // code for creating shadow of strokeline width
    var defsElement = document.createElementNS('http://www.w3.org/2000/svg', "defs");
    var filterElement = document.createElementNS(NS, "filter");
    filterElement.setAttribute("id", "stackShadow" + temp.m_objectid);
    // offset is the element we're going to use to create the dropshadow.
    // we want drop shadow directly underneath element offset is 0,0
    var feOffset = document.createElementNS(NS, "feOffset");
    feOffset.setAttribute("dx", "0");
    feOffset.setAttribute("dy", "0");
    feOffset.setAttribute("result", "offOut");
    feOffset.setAttribute("in", "SourceGraphic");
    var feGaussianBlur = document.createElementNS(NS, "feGaussianBlur");
    feGaussianBlur.setAttribute("result", "blurOut");
    feGaussianBlur.setAttribute("in", "offOut");
    feGaussianBlur.setAttribute("stdDeviation", "1");
    var feColorMatrix = document.createElementNS(NS, "feColorMatrix");
    feColorMatrix.setAttribute("in", "blurOut");
    feColorMatrix.setAttribute("result", "color-out");
    feColorMatrix.setAttribute("type", "matrix");
    feColorMatrix.setAttribute("values", hex2Matrix(this.m_stackshadowcolor, this.m_stackshadowopacity));
    var feBlend = document.createElementNS(NS, "feBlend");
    feBlend.setAttribute("in", "SourceGraphic");
    feBlend.setAttribute("in2", "color-out");
    feBlend.setAttribute("mode", "normal");
    filterElement.appendChild(feOffset);
    filterElement.appendChild(feGaussianBlur);
    filterElement.appendChild(feColorMatrix);
    filterElement.appendChild(feBlend);
    defsElement.appendChild(filterElement);
    $("#" + temp.svgContainerId).append(defsElement);
};

/** @description overrite drawObject Method  because of ChartFrame and Titles are drawn on SVG  **/
SankeyChart.prototype.drawObject = function() {
    this.drawSVGObject();
};

/** @description drawing Data Label on bar chart**/
SankeyChart.prototype.drawDataLabel = function() {
	this.m_overlappeddatalabelarrayX=[];
	this.m_overlappeddatalabelarrayY=[];
    for (var i = 0, length = this.m_seriesNames.length; i < length; i++) {
        if (IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[i]])) {
            var valueText = this.m_valueTextSeries[this.m_seriesNames[i]];
            if (IsBoolean(this.m_seriesDataLabelProperty[i].showDataLabel)) {
                this.createDataLabelGroup(valueText, 'datalabelgrp', i, this.m_seriesNames[i]);
                this.m_valueTextSeries[this.m_seriesNames[i]].drawSVGValueTextSeries();
            }
        }
    }
};
/** @description Get Sum of Array**/
SankeyChart.prototype.getArraySUM = function(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] < 0)
            arr[i] = arr[i] * (-1);
        if (!isNaN(arr[i]))
            sum = sum * 1 + arr[i] * 1;
    }
    return sum;
};

/** @description Transforming array values and assigning into new Array **/
SankeyChart.prototype.getUpdateSeriesDataWithCategory = function(arr) {
    var updateArray = [];
    for (var i = 0; i < arr[0].length; i++) {
        updateArray[i] = [];
        for (var j = 0; j < arr.length; j++) {
            updateArray[i][j] = arr[j][i];
        }
    }
    return updateArray;
};

/** @description Converting series data value into percent value**/
SankeyChart.prototype.setPercentageForHundred = function() {
    var serData = this.getUpdateSeriesDataWithCategory(this.visibleSeriesInfo.seriesData);
    this.m_SeriesDataInPerForHundredChart;
    var updateValue = [];
    for (var i = 0; i < serData.length; i++) {
        var totalSerData = this.getArraySUM(serData[i]);
        updateValue[i] = [];
        for (var j = 0; j < serData[i].length; j++) {
            if (serData[i][j] !== "" && (!isNaN(serData[i][j])))
                updateValue[i][j] = (serData[i][j] / totalSerData) * 100;
            else
                updateValue[i][j] = 0;
        }
    }
    if (updateValue.length > 0)
        this.m_SeriesDataInPerForHundredChart = this.getUpdateSeriesDataForHundredPercentageChart(updateValue);
};

/** @description Getter for series data when chart type is hundred percent**/
SankeyChart.prototype.getPercentageForHundred = function() {
    return this.m_SeriesDataInPerForHundredChart;
};

/** @description Updating series data and converting it into percentage when chart type is hundred percent chart**/
SankeyChart.prototype.getUpdateSeriesDataForHundredPercentageChart = function(arr) {
    var updatArray = [];
    for (var i = 0, length = arr[0].length; i < length; i++) {
        updatArray[i] = [];
        for (var j = 0, innerlength = arr.length; j < innerlength; j++) {
            updatArray[i][j] = arr[j][i];
        }
    }

    for (var i = 0, length = this.visibleSeriesInfo.seriesData.length; i < length; i++) {
        for (var j = 0, innerlength = this.visibleSeriesInfo.seriesData[i].length; j < innerlength; j++) {
            if (!isNaN(this.visibleSeriesInfo.seriesData[i][j])) {
                if (this.visibleSeriesInfo.seriesData[i][j] * 1 < 0)
                    updatArray[i][j] = updatArray[i][j] * (-1);
            }
        }
    }
    return updatArray;
};

/** @description Get Drill Color on which bar it is clicked**/
SankeyChart.prototype.getDrillColor = function(mouseX, mouseY) {
    if (!IsBoolean(this.m_isEmptySeries)) {
        if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
            var barWidth;
            /**Added to resolve BDD-682 issue*/
            var drillMinStackHeight = (this.m_charttype == "stacked") ? 0 : this.m_drillminstackheight;
            for (var i = 0; i < this.m_xPositionArray.length; i++) {
                for (var j = 0; j <= this.m_xPositionArray[i].length; j++) {
                    if (this.m_barWidthArray[i][j] * 1 < 0) {
                        barWidth = (this.m_barWidthArray[i][j] * 1 < -drillMinStackHeight) ? this.m_barWidthArray[i][j] * 1 : -drillMinStackHeight;
                        var range1 = this.m_yPositionArray[i][j] * 1;
                        var range2 = this.m_yPositionArray[i][j] * 1 - barWidth;
                    } else {
                        barWidth = (IsBoolean(this.m_basezero) && (this.visibleSeriesInfo.seriesData[i][j] * 1 < 0)) ? 0 : (this.m_barWidthArray[i][j] * 1 > drillMinStackHeight) ? this.m_barWidthArray[i][j] * 1 : drillMinStackHeight;
                        var range1 = this.m_yPositionArray[i][j] * 1;
                        var range2 = this.m_yPositionArray[i][j] * 1 + barWidth;
                    }
                    if(this.m_charttype == "clustered"){
						if(mouseY >= range1 && mouseY <= range2 && mouseX >= this.m_xPositionArray[i][j] * 1 && mouseX <= (this.m_xPositionArray[i][j] * 1 + (this.m_barWidth * 1/this.m_xPositionArray.length))){
							return i;
						}
					}else{
                    if (mouseY >= range1 && mouseY <= range2 && mouseX >= this.m_xPositionArray[i][j] * 1 && mouseX <= (this.m_xPositionArray[i][j] * 1 + this.m_barWidth * 1)) {
                        return i;
                    }
                }
                }
            }
        }
    }
};

/** @description Calling DrawToolTip method when series is not empty**/
SankeyChart.prototype.drawTooltip = function(mouseX, mouseY) {
    if (!IsBoolean(this.m_isEmptySeries) && !this.m_designMode) {
        var toolTipData = this.getToolTipData(mouseX, mouseY);
        if (this.m_hovercallback && this.m_hovercallback != "") {
            this.drawCallBackContent(mouseX, mouseY, toolTipData);
        } else {
            this.drawTooltipContent(toolTipData);
        }
    }
};

/** @description Converting selected bar details into DOM element for tooltip**/
SankeyChart.prototype.drawTooltipContent = function(toolTipData) {
    this.m_tooltip.draw(toolTipData, this.m_componenttype);
};

/** @description Getting Drilled bar and fetching bar information**/
SankeyChart.prototype.getDrillDataPoints = function(mouseX, mouseY) {
    if (!IsBoolean(this.m_isEmptySeries) && IsBoolean(this.isVisibleSeries())) {
        if ((mouseX >= this.getStartX()) && (mouseX <= this.getEndX()) && (mouseY <= this.getStartY()) && (mouseY >= this.getEndY())) {
            var barWidth;
            var isDrillIndexFound = false;
            var drillMinStackHeight = (this.m_charttype == "stacked") ? 0 : this.m_drillminstackheight;
            for (var i = 0; i < this.m_xPositionArray.length; i++) {
                for (var j = 0; j < this.m_xPositionArray[i].length; j++) {
                    if (this.m_barWidthArray[i][j] * 1 < 0) {
                        barWidth = (this.m_barWidthArray[i][j] * 1 < -drillMinStackHeight) ? this.m_barWidthArray[i][j] * 1 : -drillMinStackHeight;
                        var range1 = this.m_yPositionArray[i][j] * 1 + barWidth;
                        var range2 = this.m_yPositionArray[i][j] * 1;
                    } else {
                        barWidth = (IsBoolean(this.m_basezero) && (this.visibleSeriesInfo.seriesData[i][j] * 1 < 0)) ? 0 : (this.m_barWidthArray[i][j] * 1 > drillMinStackHeight) ? this.m_barWidthArray[i][j] * 1 : drillMinStackHeight;
                        var range1 = this.m_yPositionArray[i][j] * 1;
                        var range2 = this.m_yPositionArray[i][j] * 1 + barWidth;
                    }
                    if (mouseY >= range1 && mouseY <= range2 && mouseX >= this.m_xPositionArray[i][j] * 1 && mouseX <= (this.m_xPositionArray[i][j] * 1 + (this.m_barWidth * 1))) {
                        var fieldNameValueMap = this.getFieldNameValueMap(j);
                        /**Clicked color drills as the drill-color not series color.*/
                        var drillColor = this.getColorsForSeries()[i][j];
                        var drillField = this.visibleSeriesInfo.seriesName[i];
                        var drillDisplayField = this.visibleSeriesInfo.seriesDisplayName[i];
                        var drillValue = fieldNameValueMap[drillField];
                        fieldNameValueMap.drillField = drillField;
                        fieldNameValueMap.drillDisplayField = drillDisplayField;
                        fieldNameValueMap.drillValue = drillValue;
                        isDrillIndexFound = true;
                        fieldNameValueMap.drillIndex = j;
                        return {
                            "drillRecord": fieldNameValueMap,
                            "drillColor": drillColor
                        };
                    }
                }
            }
            if (this.m_charttype == "stacked" && !isDrillIndexFound) {
                for (var k = 0, length = this.xPositions.length; k < length; k++) {
                    if (mouseY <= (this.xPositions[k] * 1 + this.m_barWidth * 1) && (mouseY >= this.xPositions[k] * 1)) {
                        for (var l = 0, innerlength = this.m_xPositionArray.length; l < innerlength; l++) {
                            if (((mouseX >= this.m_xPositionArray[l][k]) && (mouseX <= this.m_xPositionArray[l][k] + this.m_drillminstackheight)) || ((mouseX <= this.m_xPositionArray[l][k] + this.m_barWidthArray[l][k]) && (mouseX >= this.m_xPositionArray[l][k] - this.m_drillminstackheight))) {
                                var fieldNameValueMap = this.getFieldNameValueMap(k);
                                var drillColor = this.m_drillColor;
                                var drillField = "";
                                var drillDisplayField = "";
                                var drillValue = "";
                                fieldNameValueMap.drillField = drillField;
                                fieldNameValueMap.drillDisplayField = drillDisplayField;
                                fieldNameValueMap.drillValue = drillValue;
                                isDrillIndexFound = true;
                                fieldNameValueMap.drillIndex = j;
                                return {
                                    "drillRecord": fieldNameValueMap,
                                    "drillColor": drillColor
                                };
                            }
                        }
                    }
                }
            }
        }
    }
};

SankeyChart.prototype.getDataPointAndUpdateGlobalVariable = function () {
	var fieldNameValueMap = {};
	var fieldname = (this.m_fieldname === "" || this.m_fieldname === undefined) ? "Value" : this.m_fieldname;
	fieldNameValueMap[fieldname] = this.m_fieldvalue;
	this.updateDataPoints(fieldNameValueMap);
};

//# sourceURL=SankeyChart.js