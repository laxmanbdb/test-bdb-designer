/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: SparkLineChart.js
 * @description SparkLineChart
 **/
function SparkLineChart(m_chartContainer,m_zIndex){
	this.base = Chart;
	this.base();

	this.m_x=680;
	this.m_y=20;
	this.m_width=300;
	this.m_height=260;
	this.m_radius=2;
	this.m_showmaximizebutton = false;
	this.finalData = [];
	this.m_showborder = false;
	this.m_borderradius = "1";
	this.m_borderthickness = "1";
	this.m_lineSeries=[];
	this.m_colorNames=[];
	/*this.m_pointSeries=[];*/
	
	/*J-query Library Properties Start*/
	
	/*Line Properties Start*/
	this.m_sparklinetype = "line";
	this.m_linecolor = "#0000f0";
	this.m_fillcolor = "#c0d0f0";
	this.m_fillcoloropacity = "1";
	this.m_lineWidth = "1";
	this.m_spotcolor = "#f08000";
	this.m_minspotcolor = "#ff0000";
	this.m_maxspotcolor = "#ff0000";
	this.m_highlightspotcolor = "#ffaaaa";
	this.m_highlightlinecolor = "#000000";
	this.m_spotradius = "1";
	this.m_normalrangemin = "undefined";
	this.m_normalrangemax = "undefined";
	this.m_normalrangecolor ="#c0c0c0";
	this.m_disabletooltips = true;
	this.m_drawnormalontop = "true";
	this.m_datalabel = false;
	/*Line Properties End*/
	
	/*Bar Properties Start*/
	this.m_barcolor = "#16A085";
	this.m_negbarcolor = "#D24D57";
	this.m_zerobarcolor = "#defedf";
	this.m_barzeroaxis = true;
	this.m_barspacing = "1";
	/*Bar Properties End*/
	
	/*Tristate Properties Start*/
	this.m_tristatebarspacing = "1";
	this.m_tristateposbarcolor = "#16A085";
	this.m_tristatenegbarcolor = "#D24D57";
	this.m_tristatezerobarcolor = "#defedf";
	/*Tristate Properties End*/
	this.m_fontfamily = "Roboto";
	
	/*J-query Library Properties End*/

	this.m_categoryNames=[];
	this.m_seriesNames=[];
	this.m_chartContainer = m_chartContainer ;
	this.m_zIndex = m_zIndex ;
	this.m_autoaxissetup = true;
	this.m_formater = "Currency";
};
/** @description Making prototype of chart class to inherit its properties and methods into Line chart **/
SparkLineChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
SparkLineChart.prototype.setProperty=function(chartJson){
	this.ParseJsonAttributes(chartJson.Object ,this);
	this.initCanvas();	//create draggable div
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
SparkLineChart.prototype.ParseJsonAttributes=function(jsonObject,nodeObject){
	this.chartJson = jsonObject;
	for(var key in jsonObject ){
		if(key == "Chart"){
			if(jsonObject[key]["sparkLineType"] == undefined){
				jsonObject[key]["sparkLineType"] = jsonObject[key]["type"];
				delete jsonObject[key]["type"];
			}
			for (var chartKey in jsonObject[key] ){
				switch(chartKey){
				default :
					var propertyName = this.getNodeAttributeName( chartKey );
					nodeObject[propertyName] = jsonObject[key][chartKey];
					break;
				}
			}
		}
		else{
			var propertyName = this. getNodeAttributeName( key );
			nodeObject[propertyName] = jsonObject[key];
		}
	}
};

/** @description Setter Method of DataProvider **/
SparkLineChart.prototype.setDataProvider=function(m_dataProvider){
	this.m_dataProvider = m_dataProvider;
};

/** @description Getter Method of DataProvider **/
SparkLineChart.prototype.getDataProvider=function(){
	return this.m_dataProvider ;
};

/** @description Setter Method of Fields according to fieldType **/
SparkLineChart.prototype.setFields=function(fieldsJson){
	this.m_fieldsJson = fieldsJson ;
	var categoryJson = [] ;
	var seriesJson = [] ;

	for(var i=0 ; i<fieldsJson.length ; i++){
		var fieldType = this.getProperAttributeNameValue(fieldsJson[i],"Type");
		switch(fieldType) {
			case "Category" :
				categoryJson.push(fieldsJson[i]);
				break;
			case "Series" :
				seriesJson.push(fieldsJson[i]);
				break;
			case "CalculatedField" :
				seriesJson.push(fieldsJson[i]);
				break;
			default :
				break;
		}
	}
	this.setCategory(categoryJson);
	this.setSeries(seriesJson);
};

/** @description Setter Method of Category iterate for all category. **/
SparkLineChart.prototype.setCategory=function(categoryJson){
	this.m_categoryNames = [] ;
	this.m_categoryDisplayNames = [] ;
	this.m_allCategoryNames = [] ;
	this.m_allCategoryDisplayNames = [] ;
	this.m_categoryVisibleArr = {};
	var count = 0;
	for(var i=0 ; i<categoryJson.length ; i++){
		this.m_allCategoryNames[i] = this.getProperAttributeNameValue(categoryJson[i],"Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(categoryJson[i], "DisplayName"));
		this.m_allCategoryDisplayNames[i] = m_formattedDisplayName;
		this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]]= this.getProperAttributeNameValue(categoryJson[i],"visible");
		if(IsBoolean(this.m_categoryVisibleArr[this.m_allCategoryDisplayNames[i]])){
			this.m_categoryNames[count] = this.getProperAttributeNameValue(categoryJson[i],"Name");
			this.m_categoryDisplayNames[count] = m_formattedDisplayName;
			count++;
		}
	}
};

/** @description creating array for each property of fields and storing in arrays **/
SparkLineChart.prototype.setSeries=function(seriesJson){
	this.m_seriesNames = [] ;
	this.m_seriesDisplayNames = [] ;
	this.m_seriesColors = [] ;
	this.m_legendNames = [] ;
	this.m_seriesVisibleArr = {};// added for checklist
	this.m_plotRadiusArray = [];
	this.m_plotTrasparencyArray = [];
	this.m_plotShapeArray =[];
	this.m_allSeriesDisplayNames=[];
	this.m_allSeriesNames=[];
	var count = 0 ;
	this.legendMap={};
	for(var i=0 ; i<seriesJson.length ; i++){
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(seriesJson[i], "DisplayName"));
		this.m_allSeriesDisplayNames[i] = m_formattedDisplayName;
		this.m_allSeriesNames[i]=this.getProperAttributeNameValue(seriesJson[i],"Name");
		this.m_seriesVisibleArr[this.m_allSeriesNames[i]]= this.getProperAttributeNameValue(seriesJson[i],"visible");
		if(IsBoolean(this.m_seriesVisibleArr[this.m_allSeriesNames[i]])){
			this.m_seriesDisplayNames[count] = m_formattedDisplayName;
			this.m_seriesColors[count] = convertColorToHex(this.getProperAttributeNameValue(seriesJson[i],"Color"));
			this.m_legendNames[count] = m_formattedDisplayName;
			this.m_seriesNames[count] = this.getProperAttributeNameValue(seriesJson[i],"Name");
			var radius = this.getProperAttributeNameValue(seriesJson[i],"PlotRadius");
			this.m_plotRadiusArray[count] = (radius != undefined && radius !== null && radius !== "") ? radius : 2 ;
			var transparency = this.getProperAttributeNameValue(seriesJson[i],"PlotTransparency");
			this.m_plotTrasparencyArray[count] = (transparency != undefined && transparency !== null && transparency !== "") ? transparency : 1 ;
			var shape = this.getProperAttributeNameValue(seriesJson[i],"PlotType");
			this.m_plotShapeArray[count] = (shape != undefined && shape !== null && shape !== "") ? shape : "point" ;
			var tempMap = {
			    "seriesName": this.m_seriesNames[count],
			    "displayName": this.m_seriesDisplayNames[count],
			    "color": this.m_seriesColors[count],
			    "shape": this.m_plotShapeArray[count],
			    "index": count
			};
			this.legendMap[this.m_seriesNames[count]]=tempMap;
			count++;
		}

	}
};

/** @description Getter Method of Category DisplayNames **/
/*SparkLineChart.prototype.getLegendInfo=function(){
	return this.legendMap;
};*/

/** @description Getter Method of Category DisplayNames **/
SparkLineChart.prototype.getAllSeriesNames=function(){
	return this.m_allSeriesNames;
};

/** @description Getter for All Category names**/
SparkLineChart.prototype.getAllCategoryNames = function () {
	return this.m_allCategoryNames;
};

/** @description Getter Method of Category DisplayNames **/
SparkLineChart.prototype.getCategoryNames=function(){
	return this.m_categoryNames ;
};

/** @description Getter Method of Category DisplayNames **/
SparkLineChart.prototype.getCategoryDisplayNames=function(){
	return this.m_categoryDisplayNames ;
};

/** @description Getter Method of Category Names **/
SparkLineChart.prototype.getSeriesNames=function(){
	return this.m_seriesNames ;
};

/** @description Getter Method of Category DisplayNames **/
SparkLineChart.prototype.getSeriesDisplayNames=function(){
	return this.m_seriesDisplayNames ;
};

/** @description Getter Method of SeriesColors  **/
SparkLineChart.prototype.getSeriesColors=function(){
	return this.m_seriesColors ;
};

/** @description Setter Method of SeriesColor **/
SparkLineChart.prototype.setSeriesColor=function(m_seriesColor){
	this.m_seriesColor  = m_seriesColor ;
};

/** @description Setter Method of  LegendNames **/
SparkLineChart.prototype.setLegendNames=function(m_legendNames){
	this.m_legendNames = m_legendNames ;
};

/** @description Getter Method of LegendNames **/
SparkLineChart.prototype.getLegendNames=function(){
	return this.m_legendNames ;
};
/** @description Setter Method of Category Data. **/
SparkLineChart.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	this.isEmptyCategory = true;
	if (this.getCategoryNames().length > 0) {
		this.isEmptyCategory = false;
		for (var i = 0,length=this.getCategoryNames().length ; i <length ; i++) {
			this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
		}
	}
};
/** @description Getter Method of Category Data. **/
SparkLineChart.prototype.getCategoryData = function () {
	return this.m_categoryData;
};
/** @description Setter Method of SeriesData **/
SparkLineChart.prototype.setSeriesData=function(){
	this.m_seriesData = [] ;
	for(var i=0 ; i<this.getSeriesNames().length ; i++){
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
};


/** @description Getter Method of SeriesData **/
SparkLineChart.prototype.getSeriesData=function(){
	return this.m_seriesData ;
};

/** @description Setter Method of AllFieldsName iterate for all Fields **/
SparkLineChart.prototype.setAllFieldsName=function(){
	this.m_allfieldsName = [] ;
	for(var i=0 ; i<this.getAllCategoryNames().length ; i++){
		this.m_allfieldsName.push( this.getAllCategoryNames()[i] );
	}
	for(var j=0 ; j<this.getAllSeriesNames().length ; j++){
		this.m_allfieldsName.push( this.getAllSeriesNames()[j] );
	}
};

/** @description Getter Method of All FieldsName **/
SparkLineChart.prototype.getAllFieldsName=function(){
	return this.m_allfieldsName ;
};

/** @description Setter Method of AllFieldsDisplayName **/
SparkLineChart.prototype.setAllFieldsDisplayName=function(){
	this.m_allfieldsDisplayName = [] ;
	for(var i=0 ; i<this.getCategoryDisplayNames().length ; i++){
		this.m_allfieldsDisplayName.push( this.getCategoryDisplayNames()[i] );
	}
	for(var j=0 ; j<this.getSeriesDisplayNames().length ; j++){
		this.m_allfieldsDisplayName.push( this.getSeriesDisplayNames()[j] );
	}
};

/** @description Getter Method of All FieldsDisplayName **/
SparkLineChart.prototype.getAllFieldsDisplayName=function(){
	return this.m_allfieldsDisplayName ;
};

/** @description initialization of SparkLineChart **/
SparkLineChart.prototype.init = function(){
	this.setCategoryData();
	this.setSeriesData();
	this.setAllFieldsName();
	this.setAllFieldsDisplayName();

	this.isSeriesDataEmpty();
	this.setShowSeries(this.getAllFieldsName());
	this.updateSeriesDataWithCommaSeperators();

	this.m_chartFrame.init(this);
	this.initializeToolTipProperty();
};
/** @description initialization of SparkLineChart tooltip**/
SparkLineChart.prototype.initializeToolTipProperty = function() {
    if (this.m_customtextboxfortooltip == "") {
        this.m_customtextboxfortooltip = {
            "dataTipTypeArray": "",
            "dataTipType": "Default",
            "datatipData": ""
        }
        if (!IsBoolean(this.m_disabletooltips)) {
            this.m_customtextboxfortooltip.dataTipType = "None";
        }
        /**Added to support old dashboard, direct Preview without going on to design mode*/
    } else if (this.m_customtextboxfortooltip.dataTipTypeArray == "") {
        if (!IsBoolean(this.m_disabletooltips)) {
            this.m_customtextboxfortooltip.dataTipType = "None";
        }
    }
    	if(this.m_customtextboxfortooltip.dataTipType == "Default"){
        	this.m_disabletooltips = true;
        }else{
        	this.m_disabletooltips = false;
        }
};
/** @description update seriesData if Data having comma separated value. **/
SparkLineChart.prototype.updateSeriesDataWithCommaSeperators = function(){
	this.m_displaySeriesDataFlag =[];
	if(this.m_seriesData.length > 0){
		for(var i  = 0 ; this.m_seriesData.length > i; i++ ){
			this.m_displaySeriesDataFlag[i]=[];
			this.finalData[i] = [];
			for(var j = 0 ; j < this.m_seriesData[i].length ; j++){
				this.m_displaySeriesDataFlag[i][j]=true;
				if(isNaN(this.m_seriesData[i][j])){
					this.m_displaySeriesDataFlag[i][j]=false;
					this.m_seriesData[i][j]=getNumericComparableValue(this.m_seriesData[i][j]);
					if(!isNaN(this.m_seriesData[i][j])){
						this.finalData[i].push(this.m_seriesData[i][j]);
					}
				}else{
					var value = this.m_seriesData[i][j];
					this.m_seriesData[i][j] = ("" +value).replace(/\s+/g, "");
					if((this.m_seriesData[i][j] !== "") && (this.m_seriesData[i][j] !== undefined )){
						this.finalData[i].push(this.m_seriesData[i][j]);
					}
				}
			}
		}
	}
};

/** @description will return true if at-least one series is visible. **/
SparkLineChart.prototype.isVisibleSeriesAvailable = function(){
	for(var index=0; index < this.getSeriesNames().length; index++){
		if(IsBoolean(this.m_seriesVisibleArr[this.m_seriesNames[index]])){
			return true;
		}
	}
	return false;
};

/** @description Drawing of chart started by drawing different parts of chart like ChartFrame,Title,SubTitle **/
SparkLineChart.prototype.drawChart=function(){
	this.m_chartFrame.drawFrame();
	var map = this.IsDrawingPossible();
	if ( IsBoolean(map.permission) ){
		this.drawSparkChart();
	}
	else{
		$("#draggableCanvas" + this.m_objectid).show();
		this.drawMessage(map.message);
	}
};

SparkLineChart.prototype.drawObject = function () {
	this.ctx.clearRect(this.m_x, this.m_y, this.m_width, this.m_height);
	this.m_chartFrame.init(this);
	this.drawChartFrame();
	this.drawMessage(this.m_status.noDataset);
};

SparkLineChart.prototype.IsDrawingPossible = function() {
	var map = {};
		if (!IsBoolean(this.m_isEmptySeries)) {
			if (IsBoolean(this.isVisibleSeries())) {
				map = {
					"permission": "true",
					message: this.m_status.success
				};
			} else {
				map = {
					"permission": "false",
					message: this.m_status.noSeries
				};
			}
		} else {
			if (IsBoolean(this.m_allSeriesDisplayNames.length > 0)) {
				if (IsBoolean(this.isVisibleSeries())) {
					if ((IsBoolean(this.m_isEmptySeries))) {
						map = {
							"permission": "false",
							message: this.m_status.noData
						};
					}
				} else {
					map = {
						"permission": "false",
						message: this.m_status.noSeries
					};
				}
			} else {
				map = {
					"permission": "false",
					message: this.m_status.noFields
				};
			}
		}
	return map;
};
SparkLineChart.prototype.drawSparkChart = function() {
    var temp = this;
    var Composite = false;
    var lineColorArray = [];
    lineColorArray = temp.m_linecolor.split(',');
    $("#draggableDiv").remove();
    $("#draggableCanvas" + temp.m_objectid).hide();
    $(".dynamicsparkline" + temp.m_objectid).remove();
    var canvasDiv = document.createElement("div");
    canvasDiv.style.width = (temp.m_width) + "px";
    canvasDiv.style.height = (temp.m_height) + "px";
    canvasDiv.setAttribute("class", "dynamicsparkline" + temp.m_objectid);
    $("#draggableDiv" + temp.m_objectid).append(canvasDiv);
    var tooltipdata = IsBoolean(temp.m_disabletooltips) ? false : true;
    var tooltipBGColor = hex2rgb(convertColorToHex(temp.m_tooltipbackgroundcolor), temp.m_tooltipbackgroundtransparency);
    if (this.m_sparklinetype == "line") {
        for (var i = 0; temp.finalData.length > i; i++) {
            lineColorArray[i] = (lineColorArray[i] == undefined) ? lineColorArray[0] : lineColorArray[i];
            Composite = (i === 0) ? false : true;
            $(".dynamicsparkline" + temp.m_objectid).sparkline(temp.finalData[i], {
                type: "line",
                lineColor: lineColorArray[i],
                fillColor: hex2rgb(temp.m_fillcolor, temp.m_fillcoloropacity),
                space: true,
                composite: Composite,
                showBorder: temp.m_showborder,
                borderThickness: temp.m_borderthickness,
                lineWidth: temp.m_linewidth,
                gradColor: temp.m_bggradients,
                alpha: temp.m_bgalpha,
                gradRotation: temp.m_bggradientrotation,
                spotColor: temp.m_spotcolor,
                minSpotColor: temp.m_minspotcolor,
                maxSpotColor: temp.m_maxspotcolor,
                highlightSpotColor: temp.m_highlightspotcolor,
                highlightLineColor: temp.m_highlightlinecolor,
                spotRadius: temp.m_spotradius,
                normalRangeMin: temp.m_normalrangemin,
                normalRangeMax: temp.m_normalrangemax,
                normalRangeColor: temp.m_normalrangecolor,
                dataLabel: (!temp.m_designMode) ? temp.m_datalabel : false,
                disableTooltips: (!temp.m_designMode) ? tooltipdata : true,
                tooltipBackgroundColor: tooltipBGColor,
                tooltipFontSize : temp.m_tooltipfontsize,
                fieldName: temp.m_allfieldsDisplayName[i],
                tooltipvisibility : "hidden",
                tooltipFormatter: function(sp, options, fields, index) {
                		return temp.getToolTipFormat(sp, options, fields, index);
                	},
                width: Math.round(temp.m_width),
                height: Math.round(temp.m_height)
            });
        }
    } else if (this.m_sparklinetype == "bar") {
            var widthBar = (temp.m_width - 3) / (temp.finalData[0].length);
            $(".dynamicsparkline" + temp.m_objectid).sparkline(temp.finalData[0], {
                type: "bar",
                zeroAxis: temp.m_barzeroaxis,
                zeroColor: temp.m_zerobarcolor,
                barColor: temp.m_barcolor,
                showBorder: temp.m_showborder,
                borderThickness: temp.m_borderthickness,
                negBarColor: temp.m_negbarcolor,
                gradColor: temp.m_bggradients,
                alpha: temp.m_bgalpha,
                gradRotation: temp.m_bggradientrotation,
                tooltipBackgroundColor: tooltipBGColor,
                tooltipFontSize : temp.m_tooltipfontsize,
                barSpacing: ((widthBar - temp.m_barspacing) > 0) ? temp.m_barspacing : 1,
                barWidth: ((widthBar - temp.m_barspacing) > 0) ? widthBar - temp.m_barspacing : widthBar,
                disableTooltips: (!temp.m_designMode) ? tooltipdata : true,
                enableTagOptions: true,
                fieldName: temp.m_fieldsJson[0].DisplayName,
                tooltipvisibility : "hidden",
                tooltipFormatter: function(sp, options, fields, index) {
                		return temp.getToolTipFormat(sp, options, fields[0], index);
            		},
                width: Math.round(temp.m_width),
                height: Math.round(temp.m_height),
                /**when chartRangeMin is 'undefined' it will take range from the available series data**/
                chartRangeMin: IsBoolean(temp.m_autoaxissetup) ? undefined : temp.m_minimumaxisvalue 
            });
        } else if (this.m_sparklinetype == "tristate") {
            var widthBar = (temp.m_width - 3) / (temp.finalData[0].length);
            $(".dynamicsparkline" + temp.m_objectid).sparkline(temp.finalData[0], {
                type: "tristate",
                posBarColor: temp.m_tristateposbarcolor,
                negBarColor: temp.m_tristatenegbarcolor,
                zeroBarColor: temp.m_tristatezerobarcolor,
                showBorder: temp.m_showborder,
                borderThickness: temp.m_borderthickness,
                gradColor: temp.m_bggradients,
                alpha: temp.m_bgalpha,
                gradRotation: temp.m_bggradientrotation,
                tooltipBackgroundColor: tooltipBGColor,
                tooltipFontSize : temp.m_tooltipfontsize,
                disableTooltips: (!temp.m_designMode) ? tooltipdata : true,
                fieldName: temp.m_fieldsJson[0].DisplayName,
                tooltipvisibility : "hidden",
                barSpacing: ((widthBar - temp.m_tristatebarspacing) > 0) ? temp.m_tristatebarspacing : 1,
                barWidth: ((widthBar - temp.m_tristatebarspacing) > 0) ? widthBar - temp.m_tristatebarspacing : widthBar,
        		tooltipFormatter: function(sp, options, fields, index) {
            			return temp.getToolTipFormat(sp, options, fields, index);
            		},		
                width: Math.round(temp.m_width),
                height: Math.round(temp.m_height)
            });
        }
    $(".dynamicsparkline" + temp.m_objectid).bind("sparklineClick", function(ev) {
        var sparkline = ev.sparklines[0],
            region = sparkline.getCurrentRegionFields();
        if(sparkline.currentRegion !== undefined){
	        var fieldNameValueMap = temp.getFieldNameValueMap(sparkline.currentRegion);
	        var drillField = temp.getSeriesNames()[0];
	        var drillDisplayField = temp.getSeriesDisplayNames()[0];
	        var drillValue = fieldNameValueMap[drillField];
	        if (temp.m_sparklinetype == "line") {
	            var drillColor = temp.m_linecolor;
	        } else if (temp.m_sparklinetype == "bar") {
	            if (drillValue > 0) {
	                var drillColor = temp.m_barcolor;
	            } else if (drillValue < 0) {
	                var drillColor = temp.m_negbarcolor;
	            } else {
	                var drillColor = temp.m_barzeroaxis;
	            }
	        } else {
	            if (drillValue > 0) {
	                var drillColor = temp.m_tristateposbarcolor;
	            } else if (drillValue < 0) {
	                var drillColor = temp.m_tristatenegbarcolor;
	            } else {
	                var drillColor = temp.m_tristatezerobarcolor;
	            }
	        }
	        fieldNameValueMap.drillField = drillField;
	        fieldNameValueMap.drillDisplayField = drillDisplayField;
	        fieldNameValueMap.drillValue = drillValue;
	        temp.updateDataPoints(fieldNameValueMap, drillColor);
        }
    });
    this.finalData = [];
};

/** @description return format of chart tooltip  **/
SparkLineChart.prototype.getToolTipFormat = function(sp, options, fields, index) {
    var format = "";
    var border = this.m_tooltipborderwidth + "px solid " + this.m_tooltipbordercolor;
    var bgClr = hex2rgb(convertColorToHex(this.m_tooltipbackgroundcolor), this.m_tooltipbackgroundtransparency);
    var value = (options.userOptions.type == "line") ? fields.y : fields.value;
    var newVal;
    if (value % 1 != 0 && this.m_tooltipprecision !== "default") {
        newVal = value.toFixed(this.m_tooltipprecision);
    } else {
        newVal = value * 1;
    }
    newVal = this.getFormattedData(newVal);
    if(this.m_categoryData.length>0){
    	if (index === 0) {
            format += "<table class=\" chart-tooltip toolTip\" style='visibility:visible;background:" + bgClr + ";width:"+this.m_customtooltipwidth+"px;border:" + border + ";font-family:"+selectGlobalFont(this.m_fontfamily)+";'><tr><td colspan=\"4\" style='background:" + bgClr + ";border:" + border + ";'><span style= width:auto;font-weight:bold;> " + this.m_categoryData[0][fields.offset] + "</span></td></tr>"
        }
        format += "<tr><td style='background:" + bgClr + ";border:" + border + ";'><span style= 'width:auto;margin-right:0px;color:" + fields.color + ";'>&#9679;</span>" + this.m_seriesDisplayNames[index] + "</td><td style='background:" + bgClr + ";border:" + border + ";'><span style= width:auto;>" + newVal + "</span></td></tr>";
        if (index === this.m_seriesDisplayNames.length - 1) {
            format += "</table>"
        }
    }else{
    	if(this.m_seriesDisplayNames.length == 1){
            format = "<table class=\" chart-tooltip toolTip\" style='visibility:visible;background:" + bgClr + ";width:"+this.m_customtooltipwidth+"px;border:" + border + ";font-family:"+selectGlobalFont(this.m_fontfamily)+";'><tr><td colspan=\"4\" style='background:" + bgClr + ";border:" + border + ";'><span style= width:auto;font-weight:bold;> " + this.m_seriesDisplayNames[index] + "</span></td></tr><tr><td style='background:" + bgClr + ";border:" + border + ";'><span style= 'width:auto;margin-right:0px;color:" + fields.color + ";'>&#9679;</span>" + newVal + "</td></tr></table>"
    	}else{
    		if (index === 0) {
                format += "<table class=\" chart-tooltip toolTip\" style='visibility:visible;background:" + bgClr + ";width:"+this.m_customtooltipwidth+"px;border:" + border + ";font-family:"+selectGlobalFont(this.m_fontfamily)+";'>"
            }
            format += "<tr><td style='background:" + bgClr + ";border:" + border + ";'><span style= 'width:auto;margin-right:0px;color:" + fields.color + ";'>&#9679;</span>" + this.m_seriesDisplayNames[index] + "</td><td style='background:" + bgClr + ";border:" + border + ";'><span style= width:auto;>" + newVal + "</span></td></tr>";
            if (index === this.m_seriesDisplayNames.length - 1) {
                format += "</table>"
            }
    	}
    }
    return format;
};

/** @description setting formatter on tooltip**/
SparkLineChart.prototype.getFormattedData = function(val){
	var formatter = this.getFormater();
	var unit = this.getUnit();
	var precision;
    if (this.m_tooltipprecision !== "default") {
        precision = this.m_tooltipprecision;
    } else {
        precision = (val + "").split(".");
        if (precision[1] !== undefined) {
            precision = precision[1].length;
        } else {
            precision = 0;
        }
    }
	var data = this.getLocaleWithPrecision(val, precision, this.m_numberformatter);
	this.m_unitSymbol = this.m_util.getFormatterSymbol(formatter, unit);
	data = (this.m_signposition === "prefix")?(this.m_unitSymbol+""+data ):(data +""+ this.m_unitSymbol);
	return data;
};

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
SparkLineChart.prototype.initCanvas=function(){
	var temp = this ;
	$("#draggableDiv"+temp.m_objectid).remove() ;
	this.initializeDraggableDivAndCanvas();
};

/** @description  initialization of draggable div and its inner Content **/
SparkLineChart.prototype.initializeDraggableDivAndCanvas = function(){
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer,this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseMoveEvent(this.m_chartContainer);
	this.initMouseClickEvent();
};

/** @description  return Colors for Series. **/
SparkLineChart.prototype.getColorsForSeries=function()
{
	return this.m_seriesColorsArray ;
};

/** @description Will Draw ChartFrame on canvas . **/
SparkLineChart.prototype.drawChartFrame=function(){
	this.m_chartFrame.drawFrame();
};
//# sourceURL=SparkLineChart.js