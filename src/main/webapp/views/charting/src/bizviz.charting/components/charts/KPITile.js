/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: KPITile.js
 * @description KPITile.js
 **/
function KPITile(m_chartContainer, m_zIndex) {
    this.base = Chart;
    this.base();

    this.m_x = 680;
    this.m_y = 20;
    this.m_width = 450;
    this.m_height = 300;
    this.m_radius = 2;
    this.m_showmaximizebutton = false;
    this.finalData = [];
    this.m_showborder = false;
    this.m_borderradius = "1";
    this.m_borderthickness = "1";
    this.m_lineSeries = [];
    this.m_colorNames = [];
    this.m_kpitiledirection = "horizontal";
    this.m_enabletooltip = "false";
    this.m_tileborder = "2px solid ";
    this.m_tileborderopacity = "0.6";
    this.m_paddingfordiv = 5;
    this.m_toppaddingseries = 3;
    this.m_noofbranches = "1";
    this.m_paddingbettile = 5;
    /*this.m_pointSeries=[];*/

    /*J-query Library Properties Start*/

    /*Line Properties Start*/
    this.m_sparklinetype = "line";
    this.m_linecolor = "#006488";
    this.m_fillcolor = "#86dff9";
    this.m_fillcoloropacity = "0.1";
    this.m_lineWidth = "1";
    this.m_spotcolor = "#f08000";
    this.m_minspotcolor = "#ff0000";
    this.m_maxspotcolor = "#ff0000";
    this.m_highlightspotcolor = "#ffaaaa";
    this.m_highlightlinecolor = "#000000";
    this.m_spotradius = "2";
    this.m_normalrangemin = "undefined";
    this.m_normalrangemax = "undefined";
    this.m_normalrangecolor = "#c0c0c0";
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


    /*J-query Library Properties End*/

    this.m_valueNames = [];
    this.m_seriesNames = [];
    this.m_chartContainer = m_chartContainer;
    this.m_zIndex = m_zIndex;

    /**Category, Primary and Secondary Series font properties*/
    this.m_categoryfontcolor = "#000000";
    this.m_categoryfontsize = "12";
    this.m_categoryfontstyle = "normal";
    this.m_categoryfontweight = "normal";
    this.m_categoryfontfamily = "Roboto";
    this.m_primaryseriesfontcolor = "#000000";
    this.m_primaryseriesfontsize = "12";
    this.m_primaryseriesfontstyle = "normal";
    this.m_primaryseriesfontweight = "normal";
    this.m_primaryseriesfontfamily = "Roboto";
    this.m_secondaryseriesfontcolor = "#000000";
    this.m_secondaryseriesfontsize = "12";
    this.m_secondaryseriesfontstyle = "normal";
    this.m_secondaryseriesfontweight = "normal";
    this.m_secondaryseriesfontfamily = "Roboto";
    
    /**Trend Component properties*/
    this.m_trendsize = 0.30;
	this.m_positivetrendcolor = "#1bcc07";
	this.m_negativetrendcolor = "#fd0101";
	this.m_zerotrendcolor = "#d1d911";
	this.m_trendshapes = {min: "bd-down-arrow", max: "bd-up-arrow", zero: "bd-minus"};
};
/** @description Making prototype of chart class to inherit its properties and methods into Line chart **/
KPITile.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
KPITile.prototype.setProperty = function(chartJson) {
    this.ParseJsonAttributes(chartJson.Object, this);
    this.initCanvas(); //create draggable div
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
KPITile.prototype.ParseJsonAttributes = function(jsonObject, nodeObject) {
    this.chartJson = jsonObject;
    for (var key in jsonObject) {
        if (key == "Chart") {
            for (var chartKey in jsonObject[key]) {
                switch (chartKey) {
                    default: var propertyName = this.getNodeAttributeName(chartKey);
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

/** @description Setter Method of DataProvider **/
KPITile.prototype.setDataProvider = function(dataProvider) {
    this.m_dataProvider = dataProvider;
};

/** @description Getter Method of DataProvider **/
KPITile.prototype.getDataProvider = function() {
    return this.m_dataProvider;
};

/** @description Setter Method of Fields according to fieldType **/
KPITile.prototype.setFields = function(fieldsJson) {
    this.m_fieldsJson = fieldsJson;
    var categoryJson = [];
    var seriesJson = [];
    var indicatorJson = [];

    for (var i = 0; i < fieldsJson.length; i++) {
        var fieldType = this.getProperAttributeNameValue(fieldsJson[i], "Type");
        switch (fieldType) {
            case "Category":
                categoryJson.push(fieldsJson[i]);
                break;
            case "Series":
                seriesJson.push(fieldsJson[i]);
                break;
            case "Indicator":
                indicatorJson.push(fieldsJson[i]);
                break;
            case "CalculatedField":
                indicatorJson.push(fieldsJson[i]);
                break;
            default:
                break;
        }
    }
    this.setCategory(categoryJson);
    this.setSeries(seriesJson);
    this.setIndicator(indicatorJson);
};

/** @description Setter Method of Category iterate for all category. **/
KPITile.prototype.setCategory = function(categoryJson) {
    this.m_categoryNames = [];
    this.m_allcategoryNames = [];
    this.m_categoryVisibleArr = [];
    this.m_categoryTextAlign = [];
    var count = 0;
    for (var i = 0; i < categoryJson.length; i++) {
        this.m_allcategoryNames[i] = this.getProperAttributeNameValue(categoryJson[i], "Name");
        this.m_categoryVisibleArr[this.m_allcategoryNames[i]] = this.getProperAttributeNameValue(categoryJson[i], "visible");
        if (IsBoolean(this.m_categoryVisibleArr[this.m_allcategoryNames[i]])) {
            this.m_categoryNames[count] = this.getProperAttributeNameValue(categoryJson[i], "Name");
            this.m_categoryTextAlign[count] = this.getProperAttributeNameValue(categoryJson[i], "textAlign");
            count++;
        }
    }
};
/** @description Setter Method of Series iterate for all Series. **/
KPITile.prototype.setSeries = function(seriesJson) {
    this.m_seriesNames = [];
    this.m_allseriesNames = [];
    this.m_seriesVisibleArr = [];
    this.m_currencyArr = [];
    this.m_positionArr = [];
    this.m_textAlignArr = [];
    this.m_numberFormatter = [];
    var count = 0;
    for (var i = 0; i < seriesJson.length; i++) {
        this.m_allseriesNames[i] = this.getProperAttributeNameValue(seriesJson[i], "Name");
        this.m_seriesVisibleArr[this.m_allseriesNames[i]] = this.getProperAttributeNameValue(seriesJson[i], "visible");
        if (IsBoolean(this.m_seriesVisibleArr[this.m_allseriesNames[i]])) {
            this.m_seriesNames[count] = this.getProperAttributeNameValue(seriesJson[i], "Name");
            this.m_currencyArr[count] = this.getProperAttributeNameValue(seriesJson[i], "unitname");
            this.m_positionArr[count] = this.getProperAttributeNameValue(seriesJson[i], "signposition");
            this.m_textAlignArr[count] = this.getProperAttributeNameValue(seriesJson[i], "textAlign");
            this.m_numberFormatter[count] = this.getProperAttributeNameValue(seriesJson[i], "numberFormatter");
            count++;
        }
    }
};

/** @description Setter Method of Indicator iterate for all Indicator. **/
KPITile.prototype.setIndicator = function(indicatorJson) {
    this.m_indicatorNames = [];
    this.m_indicatorDisplayNames = [];
    this.m_indicatorVisibleArr = []; // added for checklist
    this.m_allIndicatorDisplayNames = [];
    this.m_allIndicatorNames = [];
    this.m_indicatorType = [];
    var count = 0;
    for (var i = 0; i < indicatorJson.length; i++) {
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(indicatorJson[i], "DisplayName"));
        this.m_allIndicatorDisplayNames[i] = m_formattedDisplayName;
        this.m_allIndicatorNames[i] = this.getProperAttributeNameValue(indicatorJson[i], "Name");
        this.m_indicatorVisibleArr[this.m_allIndicatorNames[i]] = this.getProperAttributeNameValue(indicatorJson[i], "visible");
        if (IsBoolean(this.m_indicatorVisibleArr[this.m_allIndicatorNames[i]])) {
            this.m_indicatorDisplayNames[count] = m_formattedDisplayName;
            this.m_indicatorNames[count] = this.getProperAttributeNameValue(indicatorJson[i], "Name");
            this.m_indicatorType[count] = this.getProperAttributeNameValue(indicatorJson[i], "IndicatorType");
            count++;
        }

    }
};

/** @description Getter for All Category names**/
KPITile.prototype.getAllCategoryNames = function() {
    return this.m_allcategoryNames;
};

/** @description Getter Method of Category Names **/
KPITile.prototype.getCategoryNames = function() {
    return this.m_categoryNames;
};

/** @description Getter Method of Category text Align**/
KPITile.prototype.getCategoryTextAlign = function() {
    return this.m_categoryTextAlign;
};

/** @description Getter for Series names**/
KPITile.prototype.getSeriesNames = function() {
    return this.m_seriesNames;
};

/** @description Getter for Series Currency names**/
KPITile.prototype.getSeriesCurrency = function() {
    return this.m_currencyArr;
};

/** @description Getter for Series Currency position names**/
KPITile.prototype.getSeriesSignPosition = function() {
    return this.m_positionArr;
};

/** @description Getter for Series text Align**/
KPITile.prototype.getSeriesTextAlign = function() {
    return this.m_textAlignArr;
};

/** @description Getter for Series Number Formatter**/
KPITile.prototype.getSeriesNumberFormatter = function() {
    return this.m_numberFormatter;
};

/** @description Getter Method of All Indicator Names **/
KPITile.prototype.getAllIndicatorNames = function() {
    return this.m_allIndicatorNames;
};

/** @description Getter Method of Indicator Names **/
KPITile.prototype.getIndicatorNames = function() {
    return this.m_indicatorNames;
};

/** @description Getter Method of Indicator DisplayNames **/
KPITile.prototype.getIndicatorDisplayNames = function() {
    return this.m_indicatorDisplayNames;
};

/** @description Getter Method of Indicator type **/
KPITile.prototype.getIndicatorType = function() {
    return this.m_indicatorType;
};


/** @description Setter Method of IndicatorData **/
KPITile.prototype.setIndicatorData = function() {
    this.m_indicatorData = [];
    var indicatorData = [];
    var indicatorDataArr = [];
    this.toolTipData = [];
    this.trendComponentAvailable = false;
    this.SparkLineAvailable = [];
    if ((this.getIndicatorNames() !== undefined) && (this.getIndicatorNames().length > 0)) {
        for (var i = 0, length = this.getIndicatorNames().length; i < length; i++) {
            this.m_indicatorData[i] = this.getDataFromJSON(this.getIndicatorNames()[i]);
            this.toolTipData[i] = this.getDataFromJSON(this.getIndicatorNames()[i]);
            this.SparkLineAvailable[i] = [];
            for (var j = 0; j < this.m_indicatorData[i].length; j++) {
                indicatorData = (typeof this.m_indicatorData[i][j] === 'string') ? (this.m_indicatorData[i][j].split(',')) : this.m_indicatorData[i][j];
                this.m_indicatorData[i][j] = [];
                this.toolTipData[i][j] = [];
                if (Array.isArray(indicatorData)) {
                    for (var k = 0; k < indicatorData.length; k++) {
                        this.m_indicatorData[i][j][k] = isNaN(indicatorData[k] * 1) ? indicatorData[k] : indicatorData[k] * 1;
                        this.toolTipData[i][j][k] = indicatorData[k];
                    }
                } else {
                    this.toolTipData[i][j][0] = indicatorData;
                }
                this.SparkLineAvailable[i][j] = (this.getIndicatorType()[i] == "sparkline")&&(this.m_indicatorData[i][j].length > 0) ? true : false;
                if ((this.getIndicatorType()[i] == "trend") && (this.m_indicatorData[i][j].length >= 3)) {
                    var trendFlag = true;
                    for (var l = 0; l < 3; l++) {
                        if (isNaN(this.m_indicatorData[i][j][l] * 1) && (this.m_indicatorData[i][j][l] !== "")) {
                            trendFlag = false;
                            break;
                        }
                    }
                    if (IsBoolean(trendFlag)) {
                        this.m_indicatorData[i][j] = (this.m_indicatorData[i][j][0] < this.m_indicatorData[i][j][1]) ? "min" : ((this.m_indicatorData[i][j][0] > this.m_indicatorData[i][j][2]) ? "max" : "neutral");
                        this.trendComponentAvailable = true;
                    }
                }
            }
        }
    }
};
/** @description Getter Method of IndicatorData **/
KPITile.prototype.getIndicatorData = function() {
    return this.m_indicatorData;
};
KPITile.prototype.setSeriesField = function() {
    this.m_seriesdata = [];
    for (var i = 0; i < this.getSeriesNames().length; i++) {
        this.m_seriesdata[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
        var currencySymbol = this.m_util.getCurrencySymbol(this.getSeriesCurrency()[i]);
        var signPosition = this.getSeriesSignPosition()[i];
        var text = "";
        for (var j = 0; this.m_seriesdata[i].length > j; j++) {
            text = this.m_seriesdata[i][j];
            text = getFormattedNumberWithCommas(text, this.getSeriesNumberFormatter()[i]);
            this.m_seriesdata[i][j] = this.m_util.addFormatter(text, currencySymbol, signPosition);
        }
    }
};
KPITile.prototype.getSeriesField = function() {
    return this.m_seriesdata;
};
KPITile.prototype.setCategoryField = function() {
    this.m_categorydata = [];
    for (var i = 0; i < this.getCategoryNames().length; i++) {
        this.m_categorydata[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
    }
};
KPITile.prototype.getCategoryField = function() {
    return this.m_categorydata;
};
/** @description Setter Method of AllFieldsName iterate for all Fields **/
KPITile.prototype.setAllFieldsName = function() {
    this.m_allfieldsName = [];
    for (var i = 0; i < this.getAllCategoryNames().length; i++) {
        this.m_allfieldsName.push(this.getAllCategoryNames()[i]);
    }
    for (var j = 0; j < this.getAllIndicatorNames().length; j++) {
        this.m_allfieldsName.push(this.getAllIndicatorNames()[j]);
    }
};

/** @description Getter Method of All FieldsName **/
KPITile.prototype.getAllFieldsName = function() {
    return this.m_allfieldsName;
};

/** @description Setter Method of AllFieldsDisplayName **/
KPITile.prototype.setAllFieldsDisplayName = function() {
    this.m_allfieldsDisplayName = [];
    for (var i = 0; i < this.getCategoryNames().length; i++) {
        this.m_allfieldsDisplayName.push(this.getCategoryNames()[i]);
    }
    for (var j = 0; j < this.getCategoryNames().length; j++) {
        this.m_allfieldsDisplayName.push(this.getIndicatorNames()[j]);
    }
};

/** @description Getter Method of All FieldsDisplayName **/
KPITile.prototype.getAllFieldsDisplayName = function() {
    return this.m_allfieldsDisplayName;
};

/** @description initialization of KPITile **/
KPITile.prototype.init = function() {
    this.setCategoryField();
    this.setSeriesField();
    this.setIndicatorData();
    this.setAllFieldsName();
    this.setAllFieldsDisplayName();
    this.isSeriesDataEmpty();
    this.setShowSeries(this.getAllFieldsName());
    this.m_chartFrame.init(this);
};

KPITile.prototype.isSeriesDataEmpty = function() {
    this.m_isEmptySeries = true;
    if (this.m_dataProvider.length > 0) {
        this.m_isEmptySeries = false;
    }
};


/** @description Drawing of chart started by drawing different parts of chart **/
KPITile.prototype.drawChart = function() {
    this.drawObject();
    var map = this.IsDrawingPossible();
    if (IsBoolean(map.permission)) {
        $("#draggableDiv").remove();
        var temp = this;
        var Width = temp.m_width * 1 - 10;
        var Top = 5;
        var Left = 5;
        var Height = temp.m_height * 1 - 10;
        var NoOfKPITile = temp.m_dataProvider.length;
        var IsCategoryAvailable = false;
        /**Formula Splitting KPI tile in no of branches*/
        var NoOfTileInEachBranch = Math.floor(NoOfKPITile / this.m_noofbranches) + (((NoOfKPITile % this.m_noofbranches) !== 0) ? 1 : 0);
        var NoOfBranches = (Math.floor(NoOfKPITile/NoOfTileInEachBranch)<this.m_noofbranches)  ? (NoOfKPITile%NoOfTileInEachBranch ===0) ? Math.floor(NoOfKPITile/NoOfTileInEachBranch) : Math.floor(NoOfKPITile/NoOfTileInEachBranch) + 1 : this.m_noofbranches; 
        for (var l = 0; NoOfBranches > l; l++) {
        	var initPoint = l*NoOfTileInEachBranch;
        	var length = (l+1)*NoOfTileInEachBranch;
        	for (var i = initPoint; length > i; i++) {
        		if(i<NoOfKPITile){
        		$("#KPITileSingleDiv" + temp.m_objectid + i).remove();
        		if(NoOfKPITile > 1){
        			if (this.m_kpitiledirection === "vertical") {
        				Width = (temp.m_width * 1) / NoOfTileInEachBranch - temp.m_paddingbettile*1 - 2 * (temp.m_paddingbettile*1 / NoOfTileInEachBranch);
                		Left = temp.m_paddingbettile*1 + Width * (i - initPoint) + temp.m_paddingbettile*1 * (i - initPoint);
                		Height = (temp.m_height * 1) / NoOfBranches - temp.m_paddingbettile*1 - 2 * (temp.m_paddingbettile*1 / NoOfBranches);
                		Top = temp.m_paddingbettile*1 + Height * l + temp.m_paddingbettile * l;
        			}else{
        				Width = (temp.m_width * 1) / NoOfBranches - temp.m_paddingbettile*1 - 2 * (temp.m_paddingbettile*1 / NoOfBranches);
                		Top = temp.m_paddingbettile*1 + Height * (i - initPoint) + temp.m_paddingbettile*1 * (i - initPoint);
                		Height = (temp.m_height * 1) / NoOfTileInEachBranch - temp.m_paddingbettile*1 - 2 * (temp.m_paddingbettile*1 / NoOfTileInEachBranch);
                		Left = temp.m_paddingbettile*1 + Width * l + temp.m_paddingbettile * l;
        			}
        		}else {
                    Height = (temp.m_height * 1) / NoOfKPITile - temp.m_paddingbettile*1 - 2 * (temp.m_paddingbettile*1 / NoOfKPITile);
                    Width = (temp.m_width * 1) - temp.m_paddingbettile*2;
                    Top = temp.m_paddingbettile*1 + Height * i + temp.m_paddingbettile * i;
                    Left = temp.m_paddingbettile*1;
                }
            /*if(NoOfKPITile > 1){
            	if (this.m_kpitiledirection === "horizontal") {
                    Width = (temp.m_width * 1) / NoOfKPITile - 5 - 2 * (5 / NoOfKPITile);
                    Top = 5;
                    Left = 5 + Width * i + 5 * i;
                    Height = (temp.m_height * 1 - 10);
                } else {
                    Height = (temp.m_height * 1) / NoOfKPITile - 5 - 2 * (5 / NoOfKPITile);
                    Width = (temp.m_width * 1) - 10;
                    Top = 5 + Height * i + 5 * i;
                    Left = 5;

                }
            }*/
            var canvasDiv = document.createElement("div");
            canvasDiv.setAttribute("id", "KPITileSingleDiv" + temp.m_objectid + i);
            var borderProp = (IsBoolean(temp.m_showborder)) ? temp.m_tileborder + hex2rgb(temp.m_bordercolor, temp.m_tileborderopacity) : "";
            /**Added for background color.
             * Background color should apply on only KPITileSingleDiv.
             */
            var gradientColorArr = [];
            var gradientColor = "";
            gradientColorArr = (temp.m_bggradients).split(",");
            gradientColor = "linear-gradient" +"(" + temp.m_bggradientrotation + "deg," + temp.m_chartFrame.m_bgGradientColors[0];
            if (temp.m_chartFrame.m_bgGradientColors.length > 1) {
                for (var k = 1; k < temp.m_chartFrame.m_bgGradientColors.length; k++) {
                    gradientColor += "," + temp.m_chartFrame.m_bgGradientColors[k];
                }
                gradientColor += ")";
            } else {
                gradientColor = temp.m_chartFrame.m_bgGradientColors[0];
            }
            $(canvasDiv).css({position : "absolute", top : Top +"px", left : Left + "px", height : Height + "px", width : Width + "px", border : borderProp, "border-radius" : "2px", "background" : gradientColor});
            $("#draggableDiv" + temp.m_objectid).append(canvasDiv);
            /**Added to remove border from      main div.*/
            $("#draggableDiv" + temp.m_objectid).css({border : "none"});
            if (this.m_categorydata.length > 0) {
            	IsCategoryAvailable = true;
                this.drawCategoryField(i, Top, Left, Height, Width);
            }
            if (this.getSeriesNames().length > 0){
            	this.drawSeriesField(i, Top, Left, Height, Width, IsCategoryAvailable);
            }
            var IndicatorLength = this.getIndicatorNames().length;
            if (IndicatorLength > 0) {
                for (var j = 0; j < IndicatorLength; j++) {
                    if (this.getIndicatorType()[j] == "trend") {
                    	this.drawTrendComponent(this.getIndicatorData()[j][i], Top, Left, Height, Width, i,j);
                    } else {
                        this.drawSparkChart(j, i, Top, Left, Height, Width);
                    }
                }

            }
        	}
        }
        }
    } else {
        $("#draggableCanvas" + this.m_objectid).show();
        this.m_chartFrame.drawFrame();
        this.drawMessage(map.message);
    }
};

KPITile.prototype.IsDrawingPossible = function() {
    if (IsBoolean(this.m_isEmptySeries)) {
        var map = {
            "permission": "false",
            message: this.m_status.noSeries
        };
    } else {
        map = {
            "permission": "true",
            message: this.m_status.success
        };
    }
    return map;
}
KPITile.prototype.drawObject = function() {
    this.ctx.clearRect(this.m_x, this.m_y, this.m_width, this.m_height);
    this.m_chartFrame.init(this);
    this.drawChartFrame();
    if (this.m_dataProvider.length == 0) {
        this.drawMessage(this.m_status.noDataset);
    }
};


KPITile.prototype.drawCategoryField = function(i,Top,Left,Height,Width) {
    var temp = this;
    var CategoryPara = document.createElement("p");
    var node = document.createTextNode(this.m_categorydata[0][i]);
    CategoryPara.setAttribute("id", "CategoryPara" + temp.m_objectid + i);
    $(CategoryPara).css({position : "absolute", top :  "5px", left : "5px", width : (Width-5) + "px", color : temp.m_categoryfontcolor, overflow : "hidden",  "margin-bottom" : "0px", "white-space" : "nowrap", "text-overflow" : "ellipsis", "font-weight" : temp.m_categoryfontweight, "font-size" : temp.fontScaling(temp.m_categoryfontsize * 1) + "px", "font-style" : temp.m_categoryfontstyle, "font-family" : selectGlobalFont(temp.m_categoryfontfamily), "text-align" : temp.getCategoryTextAlign()[0], "padding": this.m_paddingfordiv + "px"});
    if (IsBoolean(temp.m_enabletooltip)) {
    	CategoryPara.setAttribute('title',temp.m_categorydata[0][i]);
    }
    $(CategoryPara).append(node);
    $("#KPITileSingleDiv" + temp.m_objectid + i).append(CategoryPara);
};

KPITile.prototype.drawSeriesField = function(i,Top,Left,Height,Width, IsCategoryAvailable) {
    var temp = this;
    var SeriesDiv = document.createElement("div");
    var widthSeriesDiv = "";
    var heightSeriesDiv = 95;
    SeriesDiv.setAttribute("id", "SeriesDiv" + temp.m_objectid + i);
    if (IsBoolean(temp.trendComponentAvailable)) {
        widthSeriesDiv = (Width) * 0.6;
    } else {
    	widthSeriesDiv = Width - temp.m_paddingfordiv*2;
    }
    if(IsCategoryAvailable){
    	Top = (Height) * 0.2;
    	heightSeriesDiv = 75;
    }
    if((this.SparkLineAvailable[0] !== undefined)&&(this.SparkLineAvailable[0][i])){
    	heightSeriesDiv = heightSeriesDiv - 33;
    }
    $(SeriesDiv).css({position : "absolute", top :  Top + "px", left : "5px", height : heightSeriesDiv + "%",  "padding": temp.m_paddingfordiv + "px", width : widthSeriesDiv + "px"});
    var primarySeries = document.createElement("p");
    var nodeprimarySeries = document.createTextNode(temp.m_seriesdata[0][i]);
    primarySeries.setAttribute("id", "primarySeries" + temp.m_objectid + i);
    if((this.SparkLineAvailable[0] !== undefined)&&(this.SparkLineAvailable[0][i])){
        $(primarySeries).css({color : temp.m_primaryseriesfontcolor,width : (widthSeriesDiv - temp.m_paddingfordiv), overflow : "hidden",  "margin-bottom" : "0px", "white-space" : "nowrap", "text-overflow" : "ellipsis", "font-weight" : temp.m_primaryseriesfontweight, "font-size" : temp.fontScaling(temp.m_primaryseriesfontsize * 1) + "px", "font-style" : temp.m_primaryseriesfontstyle, "font-family" : selectGlobalFont(temp.m_primaryseriesfontfamily), "text-align" : temp.getSeriesTextAlign()[0], "padding-top" : temp.m_toppaddingseries + "px"});
    }else{
    	$(primarySeries).css({color : temp.m_primaryseriesfontcolor, width : (widthSeriesDiv - temp.m_paddingfordiv), overflow : "hidden", "margin-bottom" : "0px", "text-overflow" : "ellipsis", "font-weight" : temp.m_primaryseriesfontweight, "font-size" : temp.fontScaling(temp.m_primaryseriesfontsize * 1) + "px", "font-style" : temp.m_primaryseriesfontstyle, "font-family" : selectGlobalFont(temp.m_primaryseriesfontfamily), "text-align" : temp.getSeriesTextAlign()[0], "padding-top" : temp.m_toppaddingseries + "px"});
    }
    if (IsBoolean(temp.m_enabletooltip)) {
    	//primarySeries.setAttribute('title',temp.m_seriesdata[0][i]);
    }
    $(primarySeries).append(nodeprimarySeries);
    $(SeriesDiv).append(primarySeries);
    if ((temp.m_seriesdata[1])&&(temp.m_seriesdata[1][i])) {
        var nodeSecondarySeries = document.createTextNode(temp.m_seriesdata[1][i]);
        var secondarySeries = document.createElement("p");
        secondarySeries.setAttribute("id", "secondarySeries" + temp.m_objectid + i);
        if((this.SparkLineAvailable[0] !== undefined)&&(this.SparkLineAvailable[0][i])){
            $(secondarySeries).css({color : temp.m_secondaryseriesfontcolor,width : (widthSeriesDiv - temp.m_paddingfordiv), overflow : "hidden",  "margin-bottom" : "0px", "white-space" : "nowrap", "text-overflow" : "ellipsis", "font-weight" : temp.m_secondaryseriesfontweight, "font-size" : temp.fontScaling(temp.m_secondaryseriesfontsize * 1) + "px", "font-style" : temp.m_secondaryseriesfontstyle, "font-family" : selectGlobalFont(temp.m_secondaryseriesfontfamily), "text-align" : temp.getSeriesTextAlign()[1], "padding-top" : temp.m_toppaddingseries + "px"});
        }else{
            $(secondarySeries).css({color : temp.m_secondaryseriesfontcolor, width : (widthSeriesDiv - temp.m_paddingfordiv),overflow : "hidden",  "margin-bottom" : "0px", "text-overflow" : "ellipsis", "font-weight" : temp.m_secondaryseriesfontweight, "font-size" : temp.fontScaling(temp.m_secondaryseriesfontsize * 1) + "px", "font-style" : temp.m_secondaryseriesfontstyle, "font-family" : selectGlobalFont(temp.m_secondaryseriesfontfamily), "text-align" : temp.getSeriesTextAlign()[1], "padding-top" : temp.m_toppaddingseries + "px"});
        }
        if (IsBoolean(temp.m_enabletooltip)) {
        	//secondarySeries.setAttribute('title',temp.m_seriesdata[1][i]);
        }
        $(secondarySeries).append(nodeSecondarySeries);
        $(SeriesDiv).append(secondarySeries);
        if (IsBoolean(temp.m_enabletooltip)) {
	    	//TrendDiv.setAttribute('title', temp.getIndicatorDisplayNames()[j] + '=' +temp.toolTipData[j][i][0]);
	    	$(secondarySeries).on("mouseenter", function(e){
	        	if(!temp.m_designMode){
	        		//$(this).css({"color": "#000000"});
	        		temp.removeToolTipDiv();
	        		var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
	        		var scrollLeft =  (parentDiv == null) ? 0 : parentDiv.scrollLeft;
	        		var scrollTop =  (parentDiv == null) ? 0 : parentDiv.scrollTop;
	        		var offset = (parentDiv == null) ? 0 : $(parentDiv).offset();
	        		var clientTop = (parentDiv == null) ? temp.m_draggableDiv.clientTop : $(parentDiv)[0].clientTop;
	        		var clientLeft = (parentDiv == null) ? temp.m_draggableDiv.clientLeft : $(parentDiv)[0].clientLeft;
	        		var PageTop = ((offset == 0) ? 0 : offset.top) + clientTop - scrollTop;
	        		var PageLeft = ((offset == 0) ? 0 : offset.left) + clientLeft - scrollLeft; 
	        		var offsetLeft = $(this)[0].offsetLeft;
	        		var offsetTop = $(this)[0].offsetTop;
	        		var divTop = e.pageY - e.offsetY- PageTop + ((secondarySeries.offsetHeight * 1)/2) + 8;
	        		var divLeft = e.pageX - PageLeft - offsetLeft + 25;
	        		var tooltipDiv = document.createElement("div");
	        		tooltipDiv.innerHTML = temp.m_seriesdata[1][i];
	        		tooltipDiv.setAttribute("id", "toolTipDiv");
	        		tooltipDiv.setAttribute("class", "settingIcon");
	        		tooltipDiv.setAttribute("placement", "bottom");
	        		if(parentDiv == null){
	        			document.body.appendChild(tooltipDiv);
	        		}else{
	        			$(".draggablesParentDiv").append(tooltipDiv);
	        		}
	        		var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
	        			"top": divTop + "px",
	        			"left": divLeft + "px"
	        		});
	        		$(tooltipDiv).css(tooltipObjCss);
	        		var wd = tooltipDiv.offsetWidth * 1;
	        		ht = tooltipDiv.offsetHeight * 1;
	        		var lt = e.pageX - e.offsetX - PageLeft - (wd/2) + ((secondarySeries.offsetWidth * 1)/2) - 8;
	        		if(lt + PageLeft < PageLeft){
	        			lt = (temp.m_draggableDiv.offsetLeft * 1) + offsetLeft + ((secondarySeries.offsetWidth * 1)/2) - 20 - 40;
	        			/** 20 is tooltip margin and 40 is settingIcon left. **/
	        			tooltipDiv.setAttribute("placement", "bottom-left");
	        		} 
	        		$(tooltipDiv).css("left", lt + "px");
	        		$(tooltipDiv).css("box-shadow","0 5px 15px -5px rgb(0 0 0 / 50%)");	        		
	        	}
	    	}).on("mouseleave", function(){
	    		//$(this).css({"color": convertColorToHex(temp.m_menupanelfontcolor)});
	    		temp.removeToolTipDiv();
	    	});
        }
    }
   $("#KPITileSingleDiv" + temp.m_objectid + i).append(SeriesDiv);
};

KPITile.prototype.drawTrendComponent = function(key,Top,Left,Height,Width,i,j) {
	 var temp = this;
	    $("#TrendDiv" + temp.m_objectid + i).remove();
	    var TrendDiv = document.createElement("div");
	    TrendDiv.setAttribute("id", "TrendDiv" + temp.m_objectid);
	    $(TrendDiv).css({position : "absolute", top :  (Height) * 0.3 + "px", left : (Width) * 0.6 + 5 + "px"});
	    if (IsBoolean(temp.m_enabletooltip)) {
	    	//TrendDiv.setAttribute('title', temp.getIndicatorDisplayNames()[j] + '=' +temp.toolTipData[j][i][0]);
	    }
	    
	    var shapes = document.createElement("i");
	    var mulCons = (Height>Width) ? Width : Height;
	    shapes.style.fontSize = ((mulCons * temp.m_trendsize > 90) ? 90 : mulCons * temp.m_trendsize) + "px";
	    switch (key) {
		case "min":
			shapes.style.color = temp.m_negativetrendcolor;
			$(shapes).attr("class", temp.m_trendshapes.min);
			break;
		case "max":
			shapes.style.color = temp.m_positivetrendcolor ;
			$(shapes).attr("class", temp.m_trendshapes.max);
			break;
		case "neutral":
			shapes.style.color = temp.m_zerotrendcolor;
			$(shapes).attr("class", temp.m_trendshapes.zero);
			break;
		default:
			
			break;
	}
	    $(TrendDiv).append(shapes);
	    $("#KPITileSingleDiv" + temp.m_objectid + i).append(TrendDiv);    
	    if (IsBoolean(temp.m_enabletooltip)) {
	    	//TrendDiv.setAttribute('title', temp.getIndicatorDisplayNames()[j] + '=' +temp.toolTipData[j][i][0]);
	    	$(TrendDiv).on("mouseenter", function(e){
	        	if(!temp.m_designMode){
	        		//$(this).css({"color": "#000000"});
	        		temp.removeToolTipDiv();
	        		var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
	        		var scrollLeft =  parentDiv.scrollLeft;
	        		var scrollTop =  parentDiv.scrollTop;
	        		var offset = $(parentDiv).offset();
	        		var PageTop =  offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
	        		var PageLeft = offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft; 
	        		var offsetLeft = $(this)[0].offsetLeft;
	        		var offsetTop = $(this)[0].offsetTop;
	        		var divTop = e.pageY - e.offsetY- PageTop + ((TrendDiv.offsetHeight * 1)/2) + 8;
	        		var divLeft = e.pageX - PageLeft - offsetLeft + 25;
	        		var tooltipDiv = document.createElement("div");
	        		tooltipDiv.innerHTML = temp.getIndicatorDisplayNames()[j] + '=' +temp.toolTipData[j][i][0];
	        		tooltipDiv.setAttribute("id", "toolTipDiv");
	        		tooltipDiv.setAttribute("class", "settingIcon");
	        		tooltipDiv.setAttribute("placement", "bottom");
	        		$(".draggablesParentDiv").append(tooltipDiv);
	        		
	        		var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
	        			"top": divTop + "px",
	        			"left": divLeft + "px"
	        		});
	        		$(tooltipDiv).css(tooltipObjCss);
	        		var wd = tooltipDiv.offsetWidth * 1;
	        		ht = tooltipDiv.offsetHeight * 1;
	        		var lt = e.pageX - e.offsetX - PageLeft - (wd/2) + ((TrendDiv.offsetWidth * 1)/2) - 8 +  "px";
	        		$(tooltipDiv).css("left",lt);
	        		$(tooltipDiv).css("box-shadow","0 5px 15px -5px rgb(0 0 0 / 50%)");
	        	}
	    	}).on("mouseleave", function(){
	    		//$(this).css({"color": convertColorToHex(temp.m_menupanelfontcolor)});
	    		temp.removeToolTipDiv();
	    	});
	    }
};

KPITile.prototype.drawSparkChart = function(j,i,Top,Left,Height,Width) {
    var temp = this;
    var myvalues = this.m_indicatorData[j][i];
    var canvasDiv = document.createElement("div");
    canvasDiv.setAttribute("class", "dynamicsparkline" + temp.m_objectid + i);
    $(canvasDiv).css({position : "absolute", width : (Width-5) + "px", height : (Height * 0.33) + "px", bottom : "0px"});
    $("#KPITileSingleDiv" + temp.m_objectid + i).append(canvasDiv);
    temp.m_disabletooltips = !IsBoolean(temp.m_enabletooltip);
    var tooltipBGColor = hex2rgb(convertColorToHex(temp.m_tooltipbackgroundcolor), temp.m_tooltipbackgroundtransparency);
    if (this.m_sparklinetype == "line") {
        $(".dynamicsparkline" + temp.m_objectid + i).sparkline(myvalues, {
            type: "line",
            lineColor: temp.m_linecolor,
            fillColor: hex2rgb(temp.m_fillcolor, temp.m_fillcoloropacity),
            space: true,
            lineWidth: temp.m_linewidth,
            gradColor: 'transparent',
            alpha: 'transparent',
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
            disableTooltips: (!temp.m_designMode) ? temp.m_disabletooltips : true,
            tooltipBackgroundColor: tooltipBGColor,
            tooltipFontSize : temp.m_tooltipfontsize,
            fieldName: temp.m_indicatorDisplayNames[j],
            marginTop: Math.round(temp.m_height * 0.67),
            width: Math.round(Width - 5),
            height: Math.round(Height * 0.33)
        });
    } else if (this.m_sparklinetype == "bar") {
        var widthBar = (temp.m_width - 3) / (myvalues.length);
        $(".dynamicsparkline" + temp.m_objectid + i).sparkline(myvalues, {
            type: "bar",
            zeroAxis: temp.m_barzeroaxis,
            zeroColor: temp.m_zerobarcolor,
            barColor: temp.m_barcolor,
            showBorder: temp.m_showborder,
            negBarColor: temp.m_negbarcolor,
            gradColor: 'transparent',
            alpha: 'transparent',
            gradRotation: temp.m_bggradientrotation,
            barSpacing: ((widthBar - temp.m_barspacing) > 0) ? temp.m_barspacing : 1,
            barWidth: ((widthBar - temp.m_barspacing) > 0) ? widthBar - temp.m_barspacing : widthBar,
            disableTooltips: (!temp.m_designMode) ? temp.m_disabletooltips : true,
            tooltipBackgroundColor: tooltipBGColor,
            tooltipFontSize : temp.m_tooltipfontsize,
            enableTagOptions: true,
            fieldName: temp.m_indicatorDisplayNames[j],
            width: Math.round(Width),
            height: Math.round(Height* 0.33)
        });
    } else if (this.m_sparklinetype == "tristate") {
        var widthBar = (temp.m_width - 3) / (myvalues.length);
        $(".dynamicsparkline" + temp.m_objectid + i).sparkline(myvalues, {
            type: "tristate",
            posBarColor: temp.m_tristateposbarcolor,
            negBarColor: temp.m_tristatenegbarcolor,
            zeroBarColor: temp.m_tristatezerobarcolor,
            showBorder: temp.m_showborder,
            gradColor: 'transparent',
            alpha: 'transparent',
            gradRotation: temp.m_bggradientrotation,
            disableTooltips: (!temp.m_designMode) ? temp.m_disabletooltips : true,
            tooltipBackgroundColor: tooltipBGColor,
            tooltipFontSize : temp.m_tooltipfontsize,
            fieldName: temp.m_indicatorDisplayNames[j],
            barSpacing: ((widthBar - temp.m_tristatebarspacing) > 0) ? temp.m_tristatebarspacing : 1,
            barWidth: ((widthBar - temp.m_tristatebarspacing) > 0) ? widthBar - temp.m_tristatebarspacing : widthBar,
            width: Math.round(Width),
            height: Math.round(Height* 0.33)
        });
    }
    $(".dynamicsparkline" + temp.m_objectid + i).bind("sparklineClick", function(ev) {
        var sparkline = ev.sparklines[0],
            region = sparkline.getCurrentRegionFields();
        var drillField = temp.getIndicatorNames()[j];
        if(sparkline.currentRegion !== undefined){
	        var fieldNameValueMap = temp.getFieldNameValueMap(sparkline.currentRegion,drillField,i);
	        var drillDisplayField = temp.getIndicatorDisplayNames()[j];
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
};

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
KPITile.prototype.initCanvas = function() {
    var temp = this;
    $("#draggableDiv" + temp.m_objectid).remove();
    this.initializeDraggableDivAndCanvas();
};

/** @description  initialization of draggable div and its inner Content **/
KPITile.prototype.initializeDraggableDivAndCanvas = function() {
    this.setDashboardNameAndObjectId();
    this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
    this.createDraggableCanvas(this.m_draggableDiv);
    this.setCanvasContext();
    this.initMouseMoveEvent(this.m_chartContainer);
    this.initMouseClickEvent();
};



/** @description Will Draw ChartFrame on canvas . **/
KPITile.prototype.drawChartFrame = function() {
    this.m_chartFrame.drawFrame();
};
KPITile.prototype.getToolTipData = function(mouseX, mouseY, toolTipData) {};

/**Added to get field value map for drill*/
KPITile.prototype.getFieldNameValueMap = function(i, drillField,k) {
    var m_fieldNameValueMap = new Object();
    var indicatorData = this.getDataProvider()[k][drillField];
    var indicatorDataArr = [];
    indicatorDataArr = (indicatorData.split(','));
    for (var j = 0; j < indicatorDataArr.length; j++) {
        indicatorDataArr[j] = isNaN(indicatorDataArr[j] * 1) ? indicatorDataArr[j] : indicatorDataArr[j] * 1;
    }
    m_fieldNameValueMap[drillField] = indicatorDataArr[i];
    return m_fieldNameValueMap;
};
//# sourceURL=KPITile.js