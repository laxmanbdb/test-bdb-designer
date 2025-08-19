/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: Filter.js
 * @description Parent class of all filter components 
 **/
function Filter() {
	this.base = Widget;
	this.base();
	this.m_checkboxselected;
	this.m_dataurl = "";
	this.m_indexstring = "";
	this.m_fieldname = "";
	this.m_fontstyle = "";
	this.m_fontsize = "";
	this.m_selectedindex = "";
	this.m_type = "";
	this.m_direction = "";
	this.m_showckeckbox = "";
	this.m_name = "";
	this.m_globalkey = "";
	this.m_id = "";
	this.m_fontcolor = "";
	this.m_hierarchylevel = "";
	this.m_layout = "";
	this.m_fontweight = "";
	this.m_textdecoration = "";
	this.m_fontfamily = "";
	this.m_chromecolor = "";
	this.m_selectioncolor = "";
	this.m_rollovercolor = "";
	this.m_selectedvalue = "";
	this.m_description = "";
	this.m_dataSetObject = "";
	this.m_isActive = true;
	this.m_valuesObject = [];
	this.m_controlledselection = false;
	this.m_dashboardname = "";
	this.m_allowmultipleselection = "";
	this.m_backgroundcolor = "#FFFFFF";
	this.m_associatedfilterchipsid = ""; /**DAS-4**/
	this.m_categoryData = [];
	this.m_seriesData = [];
	/**Added to hide OK button when none of the field is selected*/
	this.m_hideokbutton = false;
	/**Added to update search box UI*/
	this.m_searchboxuiobj = {
		"placeholder":"Search ...",
		"border": "1",
        "borderStyle":"solid",
        "borderColor": "#c2c2c2",
        "backgroundColor": "transparent",
        "margin": "3",
        "padding":"5"
	};
	this.m_title = new FilterTitle();
	/** Whether to execute the script or not after GlobalVariable update from selectedIndex **/
	this.m_enablegvautoupdate = false;
	this.m_notifygvautoupdate = false;
};

/** @description Making prototype of Widget class to inherit its properties and methods into Filter. **/
Filter.prototype = new Widget;

/**DAS-4**/
/** @description method to get the associated filterchips object **/
Filter.prototype.getFilterChipsComponentObj = function() {
	if (this.m_associatedfilterchipsid !== "" && IsBoolean(!this.m_designMode) && this.m_dashboard) {
		for (var i = 0; i < this.m_dashboard.m_widgetsArray.length; i++) {
			if (this.m_associatedfilterchipsid == this.m_dashboard.m_widgetsArray[i].m_objectid) {
				return this.m_dashboard.m_widgetsArray[i];
			}
		}
	}
};

/** @description method to set dashboard's div objectID and creating dragableDiv. **/
Filter.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
};

/** @description Getter methods of Type. **/
Filter.prototype.getType = function () {
	return this.m_objecttype;
};

/** @description Getter methods of GlobalKey. **/
Filter.prototype.getGlobalKey = function () {
	return this.m_globalkey;
};

/** @description Getter methods of FieldName. **/
Filter.prototype.getFieldName = function () {
	return this.m_fieldname;
};

/** @description Setter methods to set DataSet. **/
Filter.prototype.setDataSet = function (dataSetObject) {
	this.m_dataSetObject = dataSetObject;
};

/** @description Getter methods of DataSet. **/
Filter.prototype.getDataSet = function () {
	return this.m_dataSetObject;
};

/** @description Getter methods of Values. **/
Filter.prototype.getValues = function () {
	return this.m_values;
};

Filter.prototype.getTitle = function() {
	return this.m_title;
};

/** @description Setter methods to set Data. **/
Filter.prototype.setData = function () {
	this.setSeriesData(this.getFieldsByValues());
	this.setCategoryData(this.getFieldsByLabels());
	//this.m_dataView.copyData(this.m_dataStore);
};

/** @description Getter methods of FieldsByLabels. **/
Filter.prototype.getFieldsByLabels = function () {
	var labels = [];
	for (var i = 0; i < this.getValues().length; i++) {
		var m_formattedDisplayName = this.formattedDescription(this, this.getValues()[i].getLabel());
		labels.push(m_formattedDisplayName);
		//labels.push(this.getValues()[i].label);
	}
	return labels;
};

/** @description Getter methods of FieldsByValues. **/
Filter.prototype.getFieldsByValues = function () {
	var values = [];
	for (var i = 0; i < this.getValues().length; i++) {
		values.push(this.getValues()[i].getValue());
		//values.push(this.getValues()[i].value);
	}
	return values;
};

/** @description Getter methods of FieldsByNames. **/
Filter.prototype.getFieldsByNames = function () {
	var cat = [];
	for (var i = 0; i < this.getDataSet().getFields().length; i++) {
		if (this.getDataSet().getFields()[i].gethierarchyType() == "parent") {
			cat.push(this.getDataSet().getFields()[i].getName());
		} else {}
	}
	for (var i = 0; i < this.getDataSet().getFields().length; i++) {
		if (this.getDataSet().getFields()[i].gethierarchyType() == "child") {
			cat.push(this.getDataSet().getFields()[i].getName());
		} else {}
	}
	return cat;
};

// need to change according to the  filter type
/** @description Getter methods of CategoryNames. **/
Filter.prototype.getCategoryNames = function () {
	this.cat = [];
	for (var i = 0; i < this.getDataSet().getFields().length; i++) {
		if (this.getDataSet().getFields()[i].getName() == "") {
			this.cat[i] = this.getDataSet().getFields()[i].getvalue();
		} else {
			this.cat[i] = this.getDataSet().getFields()[i].getName();
		}
	}
	return this.cat;
};

/** @description Getter methods of SeriesNames. **/
Filter.prototype.getSeriesNames = function () {
	this.ser = [];
	for (var i = 0; i < this.getDataSet().getFields().length; i++) {
		if (this.getDataSet().getFields()[i].getDisplayName() == "") {
			this.ser[i] = this.getDataSet().getFields()[i].getdisplayField();
		} else {
			this.ser[i] = this.getDataSet().getFields()[i].getDisplayName();
		}
	}
	return this.ser;
};

/** @description Getter methods of XMLData. **/
Filter.prototype.getXMLData = function () {
	var connectionId = this.getDataSet().getDataSource();
	var xmlDataObj = this.m_dashboard.getXMLData(connectionId);
	return xmlDataObj;
};

/** @description Getter methods of ToolTipData. **/
Filter.prototype.getToolTipData = function (mouseX, mouseY) {
	return "";
};

/** @description Getter methods of CategoryData. **/
Filter.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

/** @description Setter methods to set CategoryData. **/
Filter.prototype.setCategoryData = function (categoryData) {
	this.m_categoryData = categoryData;
};

/** @description Getter methods of SeriesData. **/
Filter.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

/** @description Setter methods of SeriesData. **/
Filter.prototype.setSeriesData = function (seriesData) {
	this.m_seriesData = seriesData;
};

/** @description Getter methods of FieldNameValues. **/
Filter.prototype.getFieldNameValues = function () {
	return this.m_fieldNameValues;
};

/** @description method will return the Scaled font-size. **/
Filter.prototype.fontScaling = function (fontSize) {
	return fontSize * this.minWHRatio();
};
Filter.prototype.removeMessage = function () {
	var temp = this;
	$("#StatusMsg"+temp.m_objectid).remove();
};
/** Calls the drawObject of various filter and then render call back **/
Filter.prototype.draw = function () {
	this.drawObject();
	if(this.m_onafterrendercallback != ""){
		onAfterRender(this.m_onafterrendercallback);
	}
};
/** @description method use for draw the message. **/
Filter.prototype.drawMessage = function (message) {
	var temp = this;
	temp.removeMessage();
	if(temp.m_componenttype == "list_filter"){
		$("#listBoxdiv" + temp.m_objectid).remove();
	}
	if(this.m_componenttype =="combo_filter"){
		$("#simpleCombo" + temp.m_objectid).remove();
	}
	var div = document.createElement("div");
	div.id = "StatusMsg"+temp.m_objectid;
	div.style.position = "absolute";
	div.style.fontSize =  this.fontScaling( this.m_statusfontsize )+"px";
	div.style.fontFamily = selectGlobalFont(this.m_statusfontfamily);
	div.style.color = this.m_statuscolor;
	div.style.width ="100%";
	div.style.height = "100%";
	div.style.lineHeight = this.m_height+"px";
	div.style.textAlign = "center";
	div.style.verticalAlign = "middle";
	div.innerHTML = message;
	$("#draggableDiv" + temp.m_objectid).css("background", convertColorToHex(this.m_backgroundcolor));
	$("#draggableDiv" + temp.m_objectid).append(div);
};

Filter.prototype.titleContainerDiv = function() {
	$("#titleContainer" + this.m_objectid).remove();
	var BorderColor = (this.m_type == "list")&&(this.m_listbordercolor !== undefined)&&(this.m_listbordercolor !== "") ? "transparent" : "#c2c2c2";
	var tDiv = document.createElement("div");
	tDiv.setAttribute("id", "titleContainer" + this.m_objectid);
	if(IsBoolean(this.m_title.m_showgradient)){
		tDiv.style.background = (this.m_title.m_gradientcolor).split(",")[0];
	}
	var tcdp=(this.m_enhanceCheckbox==true)?"12px 16px":"0px 5px";
	
	var radius=(this.m_enhanceCheckbox==true && this.m_type == "dropdown")?"4px 4px 0px 0px":"0px";
	
	if(this.m_type == "list"){
		
		$(tDiv).css({"overflow": "hidden", "width": "100%", "height":this.fontScaling(this.m_title.m_titlebarheight)+"px",
			"font-style":this.m_title.m_fontstyle, "font-weight":this.m_title.m_fontweight, "font-family":selectGlobalFont(this.m_title.m_fontfamily),
			"font-size":this.fontScaling(this.m_title.m_fontsize) + "px", "color":this.m_title.m_fontcolor,"text-align":this.m_title.m_align,
			"text-decoration":this.m_title.m_textdecoration,"padding":tcdp, "border-color": "#c2c2c2", "border-style": "solid","border-width": "0px 0px 1px 0px","border-radius": radius
		});
		
	}
	else
		{
		
		$(tDiv).css({"overflow": "hidden", "width": "100%", "height":this.fontScaling(this.m_title.m_titlebarheight)+"px",
			"font-style":this.m_title.m_fontstyle, "font-weight":this.m_title.m_fontweight, "font-family":selectGlobalFont(this.m_title.m_fontfamily),
			"font-size":this.fontScaling(this.m_title.m_fontsize) + "px", "color":this.m_title.m_fontcolor,"text-align":this.m_title.m_align,
			"text-decoration":this.m_title.m_textdecoration,"padding":tcdp, "border-color": "#c2c2c2", "border-style": "solid","border-width": "1px 1px 0px 1px","border-radius": radius
		});
		
		
		}
	
	var tSpan = document.createElement("span");
	tSpan.setAttribute("id", "titleContainerSpan" + this.m_objectid);
	if(IsBoolean(this.m_title.m_showtitle)){
		tSpan.innerHTML = this.formattedDescription(this, this.m_title.getDescription());
	}else{
		tSpan.innerHTML = "";
	}
	
	if((this.m_type == "list" || this.m_type == "dropdown") && this.m_title.m_align === "left" && this.m_enhanceCheckbox==true)
		{
		
		$(tSpan).css({"position":"relative", "display":"table-cell","height":this.fontScaling(this.m_title.m_titlebarheight)+"px",
			"font-size":this.fontScaling(this.m_title.m_fontsize) + "px","text-align":this.m_title.m_align,"text-decoration":this.m_title.m_textdecoration,
			"width":this.m_width+"px"});
	
		}
	else	
	$(tSpan).css({"vertical-align":"middle", "position":"relative", "display":"table-cell","height":this.fontScaling(this.m_title.m_titlebarheight)+"px",
		"font-size":this.fontScaling(this.m_title.m_fontsize) + "px","text-align":this.m_title.m_align,"text-decoration":this.m_title.m_textdecoration,
		"width":this.m_width+"px"});
	
	tDiv.appendChild(tSpan);
	return tDiv;
};

/** @description create Input element for Search Box and set property and return objects. **/
Filter.prototype.createSearchBox = function() {
	var temp = this;
	
	var parentdiv = document.createElement("div");
	parentdiv.setAttribute("id", "SearchParentText"+ temp.m_componentid);
	
    var mainDiv = document.createElement("input");
    mainDiv.setAttribute("id", "SearchTextBox"+ temp.m_componentid);
    mainDiv.setAttribute("placeholder", temp.m_searchboxuiobj.placeholder);
    
    var crossdiv = document.createElement("span");
    crossdiv.setAttribute("id", "SearchTextCross"+ temp.m_componentid);
    crossdiv.innerHTML = "x";
    if(IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient))
    	var top=this.m_titlebarheight;
    else
    	var top="0";
    
    $(crossdiv).css({
    	"position": "absolute",
    	"right": "10px",
    	"top": top,
    	"line-height": "35px"
    });
    
    $(mainDiv).css({
    	"cursor": "text",
		"color": convertColorToHex(temp.m_fontcolor),
		"font-size": temp.m_fontsize * temp.minWHRatio()+"px",
		"font-family": selectGlobalFont(temp.m_fontfamily),
		"font-weight": temp.m_fontweight,
		"font-style": temp.m_fontstyle,
        "position": "relative",
        "float": "left",
        "width": "calc(100% - "+(2*temp.m_searchboxuiobj.margin )+"px)",
        "height": 1*temp.m_menupanelrowheight + "px",
        "border": temp.m_searchboxuiobj.border + "px",
        "border-style":temp.m_searchboxuiobj.borderStyle,
        "display": "block",
        "border-color": temp.m_searchboxuiobj.borderColor,
        "background-color": temp.m_searchboxuiobj.backgroundColor,
        "margin": temp.m_searchboxuiobj.margin + "px",
        "padding":temp.m_searchboxuiobj.padding + "px",
        "padding-right": "15px"
    });
    if((temp.m_type == "list") && IsBoolean(temp.m_enableborder)){
    	mainDiv.style.boxShadow = temp.m_listelementproperty.boxShadow;
    	mainDiv.style.borderRadius = temp.m_listelementproperty.borderRadius + "px";
    	mainDiv.style.borderColor = temp.m_listbordercolor;
    }
    if((temp.m_componenttype == "hierarchical_combo") && (temp.m_advancetheme == "advance")){
    	$(crossdiv).css({
    		"left": "calc(100% - "+(temp.m_fontsize * temp.minWHRatio() * 4 )+"px)",
    	});
    }
    
    parentdiv.append(mainDiv);
    parentdiv.append(crossdiv);
    return parentdiv;
};

/** @description constructor method of Filter title class. **/

function FilterTitle() {
	this.m_showtitle = false;
	this.m_showgradient = false;
	this.m_align = "left";
	this.m_formattedDescription = "";
	this.m_titlebarheight = 25;
	this.m_gradientcolorsArray = [];
	this.m_chartLeftRightMargin = 5;
	
	this.m_fontsize = 10;
	this.m_fontweight = "normal";
	this.m_fontfamily = "Roboto";
	this.m_fontstyle = "normal";
	this.m_fontcolor = "#000000";
	this.m_textalign = "center";
	this.m_textdecoration = "none";
	this.m_align = "center";
	this.m_description = "";
	this.m_titlewidth = 50;
	this.m_showonlytitle = false;
};
FilterTitle.prototype.getDescription = function() {
	return this.m_description;
};
FilterTitle.prototype.showLoaderIcon = function() {
	// Do nothing
};
FilterTitle.prototype.hideLoaderIcon = function() {
	// Do nothing
};
FilterTitle.prototype.setLoaderContent = function(content, status) {
	// Do nothing
};

/** @description constructor method of  Values class. **/
function Values() {
	this.m_label = "";
	this.m_value = "";
	this.m_uncheckedvalue = "";
};

/** @description Getter methods of Value. **/
Values.prototype.getValue = function () {
	return this.m_value;
};

/** @description Setter methods to set Value. **/
Values.prototype.setValue = function (value) {
	this.m_value = value;
};

/** @description Getter methods of Label. **/
Values.prototype.getLabel = function () {
	return this.m_label;
};

/** @description Setter methods for set Label. **/
Values.prototype.setLabel = function (label) {
	this.m_label = label;
};

/** @description Getter methods of UncheckedValue. **/
Values.prototype.getUncheckedValue = function () {
	return this.m_uncheckedvalue;
};

/** @description Setter methods for set the Unchecked Value. **/
Values.prototype.setUncheckedValue = function (uncheckValue) {
	this.m_uncheckedvalue = uncheckValue;
};
//# sourceURL=Filter.js