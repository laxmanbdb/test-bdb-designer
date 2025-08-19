/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: ComboFilter.js
 * @description Combo filter
 **/
function ComboFilter(m_chartContainer, m_zIndex) {
	this.base = Filter;
	this.base();
	this.m_fieldNameValueMap = new Object();
	this.m_dropDownDivHeight = 100;
	this.m_objectID = [];
	this.m_componentid = "";
	this.m_selectedindex = "";

	this.additionalFields;
	this.m_values = [];
	this.m_fields = [];
	this.staticOptsValue = [];
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_isMultiselectPanelVisible = false;
	this.m_enhanceCheckbox = false;
	this.m_checkboxstatus = {};
	this.m_bordercolor = "#d3d3d3";
	/**DAS-651 temp remove global border color update */
	this.m_cbbordercolor = "#d3d3d3";
	this.m_bgcolor = "#ffffff";
	this.m_bgopacity = 1;
	this.m_categoryName = [];
	this.m_seriesName = [];
	this.preSelectedValue = {cat:"", ser:""};
	this.m_menupanelfontcolor = "#333333";
	this.m_menupanelfontsize = "12";
	this.m_menupanelfontweight = "normal";
	this.m_cursortype = "pointer";
	this.m_selectedindexarray = [];
	this.m_panelheight = 200;
	this.m_panelzindex = 99999;
	this.m_actionbarheight = 25;
    this.m_actionbarenabled = true;
    this.m_actionbartooltip = false;
	this.m_arrowwidth = 20;
	this.m_menupanelrowheight = 30;
	this.m_selectiontype = "";
	this.m_showsearch = true;
	this.m_hoverbackgroundcolor="#cccccc";
	this.m_show = false;
	this.m_updateddesign ="false";
	this.m_allvaluesdisplay = {"enable":"false","text":"All", "value":"All"};/**Added to pass all vales in selection type "Default" and "Single Select"*/
};
/** @description Making prototype of Filter class to inherit its properties and methods into Combo filter **/
ComboFilter.prototype = new Filter;

/** @description This method will parse the chart JSON and create a container **/
ComboFilter.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Getter Method of DataProvider **/
ComboFilter.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
ComboFilter.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	this.componentJson = jsonObject;
	this.m_values = [];
	for (var key in jsonObject) {
		if (key == "Filter") {
			for (var filterKey in jsonObject[key]) {
				switch (filterKey) {
				case "DataSet":
					this.m_isDataSetavailable = true;
					break;
				case "Values":
					var valuesArray = this.getArrayOfSingleLengthJson(jsonObject[key][filterKey]);
					for (var i = 0; i < valuesArray.length; i++) {
						var values = new Values();
						values.setLabel(this.getProperAttributeNameValue(valuesArray[i], "label"));
						values.setValue(this.getProperAttributeNameValue(valuesArray[i], "value"));
						this.m_values.push(values);
					}
					break;
				case "Title":
					for (var titleKey in jsonObject[key][filterKey]) {
						var propertyName = this.getNodeAttributeName(titleKey);
						nodeObject.m_title[propertyName] = jsonObject[key][filterKey][titleKey];
					}
					break;
				default:
					var propertyName = this.getNodeAttributeName(filterKey);
					nodeObject[propertyName] = jsonObject[key][filterKey];
				}
			}
		} else {
			var propertyName = this.getNodeAttributeName(key);
			nodeObject[propertyName] = jsonObject[key];
		}
	}
};
/** @description remove already present div of component and create new div , associate the properties and events **/
ComboFilter.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas(this.m_chartContainer, this.m_zIndex);
};
/** @description Setter Method of Fields **/
ComboFilter.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	this.m_fields = [];
	this.m_fieldDisplayName = [];
	this.m_Value = [];
	this.m_additionalFields = [];

	var m_categoryName = "";
	var m_seriesName = "";
	var m_additionalFields = "";
	if (fieldsJson.length == 1) {
		// from flex
		for (var i = 0; i < fieldsJson.length; i++) {
			m_categoryName = this.getProperAttributeNameValue(fieldsJson[i], "DisplayField");
			m_seriesName = this.getProperAttributeNameValue(fieldsJson[i], "Value");
			m_additionalFields = this.getProperAttributeNameValue(fieldsJson[i], "additionalFields");
		}
	} else {
		// from designer
		for (var i1 = 0; i1 < fieldsJson.length; i1++) {
			switch (fieldsJson[i1].Type) {
			case "Value":
				m_seriesName = fieldsJson[i1].Name;
				break;
			case "DisplayField":
				m_categoryName = fieldsJson[i1].Name;
				break;
			case "additionalFields":
				m_additionalFields = fieldsJson[i1].Name;
				break;
			default:
				break;
			}
		}
	}
	this.setCategoryNames(m_categoryName);
	this.setSeriesNames(m_seriesName, m_additionalFields);
};
/** @description Getter Method of getField  **/
ComboFilter.prototype.getField = function () {
	return this.m_fields;
};
/** @description Initialize ComboFilterand setData.  **/
ComboFilter.prototype.init = function () {
	this.SelectionType();
	if (!IsBoolean(this.m_isDataSetavailable)){
		this.setData();
	} else {
		this.setCategoryData(this.getCategoryforDataSet());
		this.setSeriesData(this.getSeriesforDataSet());
	}

	if (IsBoolean(this.m_isDataSetavailable)) {
		if (this.getSeriesNames().length != 0 && this.getCategoryNames().length != 0) {
			this.setUniqueData();
		}
	} else {
		this.staticOptsValue = this.m_seriesData;
		this.displayField = this.m_categoryData;
	}
};
/**Added to resolve old configuration issue*/
ComboFilter.prototype.SelectionType = function () {
	if((this.m_selectiontype === undefined)||(this.m_selectiontype === "")){
		this.m_selectiontype = IsBoolean(this.m_allowmultipleselection) ? "multiselect" : "default";  
    }
}
/** @description Getter Method of CategoryData for DataSet **/
ComboFilter.prototype.getCategoryforDataSet = function () {
	this.m_categoryData = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
		if (((this.m_selectiontype == "default") || (this.m_selectiontype == "singleselect")) && IsBoolean(this.m_allvaluesdisplay.enable)) {
	    	/**Added to set last display value for "All"*/
			/*var DuplicateArray = [];
			DuplicateArray = getDuplicateArray(this.m_categoryData[i]);
			var categoryDataString = DuplicateArray.toString();
			this.m_allvaluesdisplay["categoryDataString"] = categoryDataString;
	        this.m_categoryData[i].unshift(this.m_allvaluesdisplay.text);*/
			this.m_categoryData[i].unshift(this.m_allvaluesdisplay.text);
	    }
	}
	this.m_categoryData = convertArrayType(this.m_categoryData);
	return this.m_categoryData;
};

/** @description Getter Method of SeriesData for DataSet **/
ComboFilter.prototype.getSeriesforDataSet = function () {
	this.m_seriesData = [];
	for (var i = 0; i < this.getSeriesNames().length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
		if (((this.m_selectiontype == "default") || (this.m_selectiontype == "singleselect")) && IsBoolean(this.m_allvaluesdisplay.enable)) {
	    	/**Added to set last value for "All"*/
			/*var DuplicateArray = [];
			DuplicateArray = getDuplicateArray(this.m_seriesData[i]);
			var seriesDataString = DuplicateArray.toString();
	        this.m_seriesData[i].unshift(seriesDataString);*/
			this.m_seriesData[i].unshift(this.m_allvaluesdisplay.value)
	    }
	}
	this.m_seriesData = convertArrayType(this.m_seriesData);
	return this.m_seriesData;
};

/** @description Getter Method of FieldDisplayName  **/
ComboFilter.prototype.getFieldDisplayName = function () {
	return this.m_fieldDisplayName;
};

/** @description Getter Method of FieldValue  **/
ComboFilter.prototype.getFieldValue = function () {
	return this.m_Value;
};

/** @description Getter Method of CategoryNames  **/
ComboFilter.prototype.setCategoryNames = function (category) {
	this.m_categoryName = [];
	if (category != "" && category != undefined)
		this.m_categoryName[0] = category;
};

/** @description Setter Method of SeriesNames  **/
ComboFilter.prototype.setSeriesNames = function (series, additionalFieldsName) {
	this.m_seriesName = [];
	if (series != "" && series != undefined)
		this.m_seriesName.push(series);
	if (additionalFieldsName != "" && additionalFieldsName != undefined) {
		var additionalFields = additionalFieldsName.split(",");
		for (var j = 0; j < additionalFields.length; j++) {
			if (this.m_seriesName[0] != additionalFields[j]) {
				if (this.getCategoryNames().length > 0 && this.getCategoryNames()[0] != additionalFields[j])
					this.m_seriesName.push(additionalFields[j]);
			}
		}
	}
};

/** @description Getter Method of CategoryNames  **/
ComboFilter.prototype.getCategoryNames = function () {
	return this.m_categoryName;
};

/** @description Getter Method of SeriesNames  **/
ComboFilter.prototype.getSeriesNames = function () {
	return this.m_seriesName;
};

/** @description  Will create an id for component to be used for dashboard operation management**/
ComboFilter.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "simpleCombo" + this.m_objectid;
};

/** @description Getter Method of additionalFields  **/
ComboFilter.prototype.getadditionalFields = function () {
	return this.m_additionalFields;
};

/** @description will call init() and draw () of ListFilter **/
ComboFilter.prototype.drawObject = function() {
	if (this.m_isDataSetavailable || IsBoolean(this.m_designMode)) {
	    if (this.getDataProvider().length > 0) {
	        this.init();
	        if (this.m_selectiontype == "default") {
	            this.drawChart();
	        } else {
	            this.drawMultiSelect();
	            if(this.staticOptsValue.length<=0 && IsBoolean(!this.m_designMode))
		    	{
	            /*DAS-303*/
		    	$("#textBox" + this.m_objectid).val("No Field Available");
		    	$("#textBox" + this.m_objectid).css("color","red");
		    	$("#arrowdownsimpleCombo" + this.m_objectid).css("display","none");
		    	}
	        }
	        /**DAS-4**/
	        //this.updateFilterChipsComponent();
	    } else {
	        this.drawMessage(this.m_status.noData);
	    }
	} else {
	    this.drawMessage(this.m_status.noDataset);
	}
};
/**DAS-4**/
/** @description will call draw() method of FilterChips **/
ComboFilter.prototype.updateFilterChipsComponent = function() {
	var temp = this;
	if (!IsBoolean(this.m_designMode)) {
		var filterChipsObj = this.getFilterChipsComponentObj();
		if (filterChipsObj != undefined){
			/*for (var i = 0; i < this.staticOptsValue.length; i++) {			
				var value = this.staticOptsValue[i];
				var text = this.displayField[i];					
				if (this.getSelectedIndex(i)) {
					save value to filterchips array
					filterChipsObj.m_savedfilterschips.push({"key":text});
				}
				//filterChipsObj[]
			}*/
			filterChipsObj.m_filterDisplayValues[temp.m_objectid] = temp.getValue().split(',');
		}
	}
};


/** @desciption method overridden from widget class to hide the opened panel for multipselect combo **/
ComboFilter.prototype.hideWidget = function () {
	var temp = this;
	this.visibilityStatus = false;
	var panel =	$("#AdvanceCheckList"+temp.m_objectid);
	if(panel && panel.is(":visible")){
		this.m_isMultiselectPanelVisible = (IsBoolean(!this.m_actionbarenabled)) ? true : this.m_isMultiselectPanelVisible;
		temp.comboArrowToggleCB();
		panel.css("display", "none");
		this.m_isMultiselectPanelVisible = false;
	}
	$("#draggableDiv" + temp.m_objectid).css("display", "none");
};
/** @description Setter Method, will set UniqueData.  **/
ComboFilter.prototype.setUniqueData = function () {
	this.staticOptsValue = [];
	this.displayField = [];
	var uniqueSeriesData = [];
	var uniqueCategoryData = [];
	for (var i = 0; i < this.m_seriesData.length; i++) {
		var exist = false;
		for (var j = 0; j < this.staticOptsValue.length; j++) {
			// there will be only one value field , so we can directly use index:zero
			if (this.staticOptsValue[j] == this.m_seriesData[i][0]) {
				exist = true;
				break;
			}
		}
		if (!exist) {
			this.staticOptsValue.push(this.m_seriesData[i][0]);
			this.displayField.push(this.m_categoryData[i][0]);

			uniqueCategoryData.push(this.m_categoryData[i]);
			uniqueSeriesData.push(this.m_seriesData[i]);
		}
	}
	this.m_categoryData = uniqueCategoryData;
	this.m_seriesData = uniqueSeriesData;
};

/** @description Drawing of component started by drawing different parts of component like dropdown,options. **/
ComboFilter.prototype.drawChart = function() {
    var temp = this;

    $("#" + temp.m_componentid).remove();
    var simpleComboDivisionObject = this.createSimpleComboDivision();
    if (IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient)) {
        if (this.m_title.m_position === "top") {
            var titleDiv = this.titleContainerDiv();
            $(simpleComboDivisionObject).append(titleDiv);
        } else if (this.m_title.m_position === "left" || this.m_title.m_position === "right") {
            var titleLeftDiv = this.titleLeftContainerDiv();
            $(simpleComboDivisionObject).append(titleLeftDiv);
        }else{
        	// Do nothing
        }
    }
    var dropDownObject = this.createDropDown(simpleComboDivisionObject);
    this.createOption(dropDownObject);
};
/** @description creating a div in which we are adding select box. **/
ComboFilter.prototype.createSimpleComboDivision = function() {
    var temp = this;
    var simpleComboDivisionObject = document.createElement("div");
    simpleComboDivisionObject.setAttribute("id", this.m_componentid);
    simpleComboDivisionObject.style.display = "block";    
    simpleComboDivisionObject.style.position = "absolute";
    simpleComboDivisionObject.style.height = this.m_height + "px";
    simpleComboDivisionObject.style.width = this.m_width + "px";
    if (IsBoolean(this.m_isMazimizedInGroup)){
        simpleComboDivisionObject.style.zIndex = "201";
    }
    $("#draggableDiv" + temp.m_objectid).append(simpleComboDivisionObject);
    return simpleComboDivisionObject;
};
ComboFilter.prototype.titleLeftContainerDiv = function () {
	$("#titleLeftContainer" + this.m_objectid).remove();
	var tDivLeft = document.createElement("div");
	tDivLeft.setAttribute("id", "titleLeftContainer" + this.m_objectid);
	if(IsBoolean(this.m_title.m_showgradient)){
		//IsBoolean(this.m_title.m_showtitle) || 
		/**@description DAS-610 removed this.m_title.m_showtitle from above condition as it is showing color when any one of the 
		title or show box is enabled to make it support only for show box removed or condition**/
		tDivLeft.style.background = (this.m_title.m_gradientcolor).split(",")[0];
	}
	tDivLeft.style.float = (this.m_title.m_position === "right")?"right":"left";	
	
	var tcdp=(this.m_enhanceCheckbox==true)?"0px 16px":"0px 5px";
	
	$(tDivLeft).css({"overflow":"hidden","width":this.m_title.m_titlewidth+"%","height":this.m_height+"px","font-style":this.m_title.m_fontstyle,
		"font-weight":this.m_title.m_fontweight,"font-family":selectGlobalFont(this.m_title.m_fontfamily),"font-size":this.fontScaling(this.m_title.m_fontsize) + "px",
		"color":this.m_title.m_fontcolor,"text-align":this.m_title.m_align,"text-decoration":this.m_title.m_textdecoration,
		"padding":tcdp, "border-color": "#c2c2c2", "border-style": "solid","border-width": (this.m_title.m_position === "left" ? "1px 0px 1px 1px" : "1px 1px 1px 0px"),
		"border-radius": (this.m_title.m_position === "left" ? "4px 0px 0px 4px" : (this.m_title.m_position === "right" ? "0px 4px 4px 0px" : ""))
	});
	
	var tSpan = document.createElement("span");
	tSpan.setAttribute("id", "titleLeftContainerSpan" + this.m_objectid);
	if(IsBoolean(this.m_title.m_showtitle)){
		tSpan.innerHTML = this.formattedDescription(this, this.m_title.getDescription());
	}else{
		tSpan.innerHTML = "";
	}
	/**DAS-629 title text center align vertically */
	if(this.m_title.m_align === "left" && this.m_title.m_position=="left" && this.m_enhanceCheckbox==true)
	{
		$(tSpan).css({"vertical-align":"middle","display":"table-cell","height":this.m_height+"px",
			"font-size":this.fontScaling(this.m_title.m_fontsize) + "px","text-align":this.m_title.m_align,"text-decoration":this.m_title.m_textdecoration,
			"width":this.m_width +"px","bottom": "12px"});
		
	}else
	$(tSpan).css({"vertical-align":"middle","display":"table-cell","height":this.m_height+"px",
		"font-size":this.fontScaling(this.m_title.m_fontsize) + "px","text-align":this.m_title.m_align,"text-decoration":this.m_title.m_textdecoration,
		"width":this.m_width +"px"});
	
	tDivLeft.appendChild(tSpan);
	return tDivLeft;
};

/** @description creating a SELECT element and append into containerDiv. **/
ComboFilter.prototype.createDropDown = function (simpleComboDivisionObject) {
	var temp = this;
	var dropDownObject = document.createElement("SELECT");
	dropDownObject.id = "selectBoxId" + this.m_objectid;
	$(dropDownObject).addClass('combo-arrow-single');
	dropDownObject.style.color = convertColorToHex(this.m_fontcolor);
	dropDownObject.style.cursor = this.m_cursortype;
	dropDownObject.style.display = "block";
	dropDownObject.style.position = "absolute";
	dropDownObject.style.border = "1px solid #c2c2c2";
	if(this.m_filterbgcolor != undefined)
	dropDownObject.style.backgroundColor = convertColorToHex(this.m_filterbgcolor);
	var padding = (this.m_height - this.fontScaling(this.m_fontsize * 1) * 1.5)/2;
	if(IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient)){
		switch(this.m_title.m_position){
			case "top":
				dropDownObject.style.width = "100%";
				dropDownObject.style.height = (this.m_height*1 - this.fontScaling(this.m_title.m_titlebarheight)*1) + "px";
				dropDownObject.style.top = (this.fontScaling(this.m_title.m_titlebarheight)*1) + "px";
				dropDownObject.style.left = "0%";
				padding = (this.m_height - this.fontScaling(this.m_title.m_titlebarheight) * 1 - this.fontScaling(this.m_fontsize * 1) * 1.5)/2;
				break;
			case "left":
				dropDownObject.style.width = (100 - this.m_title.m_titlewidth) + "%";
				dropDownObject.style.height = this.m_height + "px";
				dropDownObject.style.top = "0%";
				dropDownObject.style.left = this.m_title.m_titlewidth + "%";
				break;
			case "right":
				dropDownObject.style.width = (100 - this.m_title.m_titlewidth) + "%";
				dropDownObject.style.height = this.m_height + "px";
				dropDownObject.style.top = "0%";
				dropDownObject.style.left = "0%";
				break;
			default:
				break;
		}
	}else{
		dropDownObject.style.width = this.m_width + "px";
		dropDownObject.style.height = this.m_height + "px";
		dropDownObject.style.top = "0%";
		dropDownObject.style.left = "0%";
	}
	dropDownObject.style.padding = padding+"px 2px "+padding+"px 2px";
	this.setOptionFontProperty(dropDownObject);
	
	if(this.staticOptsValue.length*1===1) {
		$(dropDownObject).mouseup(function() {
		    var open = $(this).data("isopen");
		    if(open) {
				temp.m_notifychange = true;
		    	temp.handleOnChangeEvent(this.value, this.options[this.selectedIndex].innerText, this.selectedIndex);
		    	temp.m_selectedindexarray = this.selectedIndex;
		    }
		    $(this).data("isopen", !open);
		});
	} else {
		dropDownObject.onchange = function () {
			/** this.options[this.selectedIndex].text is removing the trailing spaces, need to preserve the original text to pass in filters **/
			temp.m_notifychange = true;
			temp.handleOnChangeEvent(this.value, this.options[this.selectedIndex].innerText, this.selectedIndex);
			temp.m_selectedindexarray = this.selectedIndex;
		};
	}	
	simpleComboDivisionObject.appendChild(dropDownObject);
	return dropDownObject;
};
/** @description creates  options element and append into SELECT box. **/
ComboFilter.prototype.createOption = function (dropDownObject) {
	if(this.staticOptsValue.length>0){
	for (var i = 0; i < this.staticOptsValue.length; i++) {
		var op = document.createElement("option");
		op.style.cursor = this.m_cursortype;
		op.value = this.staticOptsValue[i];
		op.text = this.displayField[i];
		op.selectedIndex = i;
		dropDownObject.appendChild(op);
		if (this.getSelectedIndex(i)) {
			dropDownObject.selectedIndex = this.m_selectedindex;
			this.m_selectedindexarray = this.m_selectedindex;// Added for filtersaver
			/** To pass default filter selected index value to associated component on preview **/
	        /** commented this method bcz connection loading multiple times  **/
			if(IsBoolean(this.m_enablegvautoupdate)){
				this.m_notifychange = this.m_notifygvautoupdate;
				/**Commented below lines bcz not used in default type */
				//this.preSelectedValue.cat = this.getDisplayValue();
				//this.preSelectedValue.ser = this.getValue();
				this.handleOnChangeEvent(this.staticOptsValue[i], this.displayField[i], i);
			}
		}
	}
}else {
	if(!IsBoolean(this.m_designMode)){
	  var i = 0;
	  var op = document.createElement("option");
	  op.style.cursor = this.m_cursortype;
	  op.style.disabled = "disabled";
	  op.value = "No Field Available";
	  op.text = "No Field Available";
	  op.selectedIndex = i;
	  dropDownObject.appendChild(op);
	}
	}
};

ComboFilter.prototype.getChipsValue = function () {
	

}
/** @description Setter method for set font properties of options. **/
ComboFilter.prototype.setOptionFontProperty = function (op) {
	op.style.fontFamily = selectGlobalFont(this.m_fontfamily);
	op.style.fontStyle = this.m_fontstyle;
	op.style.fontSize = this.fontScaling(this.m_fontsize) + "px";
	op.style.fontWeight = this.m_fontweight;
};

/** @description method to control onchangeEvent and updateDataPoint. **/
ComboFilter.prototype.handleOnChangeEvent = function (optionValue, optionText, selectedIndex) {
	var temp = this;
	var fieldNameValueMap = {};
	var fieldName = (temp.getFieldName() == "" || temp.getFieldName() == undefined) ? "Value" : temp.getFieldName();
	
	//Moved on top, To prevent overriding the original display nand value field
	if (this.componentJson.variable != undefined){
		for (var i = 0; i < this.componentJson.variable.DefaultValues.DefaultValue.length; i++) {
			fieldNameValueMap[this.componentJson.variable.DefaultValues.DefaultValue[i].name] = optionValue;
		}
	}
	if (IsBoolean(temp.m_isDataSetavailable)) {
		if(this.getSeriesNames().length > 0 && this.getCategoryNames().length > 0){
			if(temp.m_seriesData[0] != undefined){
				for (var i1 = 0; i1 < temp.m_seriesData[0].length; i1++) {
					fieldNameValueMap[temp.getSeriesNames()[i1]] = temp.m_seriesData[selectedIndex][i1];
				}
				fieldNameValueMap[fieldName] = optionValue;
				for (var i2 = 0; i2 < this.getSeriesNames().length; i2++) {
					fieldNameValueMap[this.getSeriesNames()[i2]] = optionValue;
				}
				for (var j = 0; j < temp.getCategoryNames().length; j++) {
					/**
					 * Check weather the select type is default or Single select.
					 * Check opentext value should equal to "ALL" or user defined value for All.
					 * If all the conditions will full fill then only it will assign all display values string to the category value map.
					 * For passing all values string array of all the display values need to be mapped. */
					/*if (((temp.m_selectiontype == "default") || (temp.m_selectiontype == "singleselect")) && IsBoolean(temp.m_allvaluesdisplay.enable) && (optionText == temp.m_allvaluesdisplay.text)) {
						fieldNameValueMap[this.getCategoryNames()[j]] = temp.m_allvaluesdisplay.categoryDataString;
			        }else{*/
			        	fieldNameValueMap[this.getCategoryNames()[j]] = optionText;
			        //}
				}
			}
		}
	} else {
		fieldNameValueMap[fieldName] = ("" + optionValue).replace(/^ +/gm, "");
	}
	temp.updateDataPoints(fieldNameValueMap);
};

/**************************Multiselect***************************************/
/** @description method will draw MultiSelectCombo. **/
ComboFilter.prototype.drawMultiSelect = function () {
	var temp = this;
	$("#" + this.m_componentid).remove();
	var mainDiv = this.createFilterMainDiv();
	this.hidePanelOnClick();
	/*CP 1013*/
	this.hidePanel();

	if (IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient)) {
	    if (this.m_title.m_position === "top") {
	        var titleDiv = this.titleContainerDiv();
	        $(mainDiv).append(titleDiv);
	        /**DAS-669 */
    	//$(titleDiv).css({"padding": "0px 16px"});
	    } else if (this.m_title.m_position === "left" || this.m_title.m_position === "right") {
	        var titleLeftDiv = this.titleLeftContainerDiv();
	        $(mainDiv).append(titleLeftDiv);
	        /**DAS-669 */
    	//$(titleLeftDiv).css({"padding": "0px 16px"});
	    } else {
	        // Do nothing
	    }
	}

	/*CP-689 enhancement*/
	if (this.m_enhanceCheckbox == true) {
	    var comboBox = this.createComboBoxEnhance();
	    var ArrowBox = this.createArrowBoxEhance();
	} else {
		var comboBox = this.createComboBox();
		var ArrowBox = this.createArrowBox();
	}

	$(mainDiv).append(comboBox);
	$(mainDiv).append(ArrowBox);
	
    if(temp.m_filterbgcolor != undefined){
		$("#textBox" + temp.m_objectid).css("background", convertColorToHex(temp.m_filterbgcolor));
		$(ArrowBox).css("background", convertColorToHex(temp.m_filterbgcolor));
	}
	/**DAS-629 */
	$("#textBox" + temp.m_objectid).css("color", convertColorToHex(temp.m_title.m_fontcolor));
	/**DAS-427 **/
    if (this.m_selectiontype == "multiselect") {
		if(temp.m_filterbgcolor != undefined){
         $("#textBox" + temp.m_objectid).css("background", convertColorToHex(temp.m_filterbgcolor));
         }
         $("#"+temp.m_componentid).find('input').css("border-style","solid" ,"border-width", "1px 0px 1px 1px","border-color","#c2c2c2");
	    // $("#"+temp.m_componentid).find('div').css("border-width", "1px 1px 1px 0px","border-color","#c2c2c2","border-style", "solid");
	     //$("#draggableDiv"+temp.m_componentid).css("border", "1px solid red");
     }
	if (!this.m_designMode && this.m_enhanceCheckbox == true && this.m_filterbgcolor == undefined) {
	    $(comboBox).hover(
	        function() {
				$(comboBox).css("background", temp.m_hoverbackgroundcolor);
				$(ArrowBox).css("background", temp.m_hoverbackgroundcolor);
				$(titleLeftDiv).css("background", temp.m_hoverbackgroundcolor);
	        },
	        function() {
	            $(comboBox).css("background", (temp.m_title.m_gradientcolor).split(",")[0]);
				$(ArrowBox).css("background", (temp.m_title.m_gradientcolor).split(",")[0]);
				//$(titleLeftDiv).css("background", convertColorToHex(temp.m_chromecolor));
				$(titleLeftDiv).css("background", (temp.m_title.m_gradientcolor).split(",")[0]);
	        }
	    )
	    $(ArrowBox).hover(
	        function() {
				$(comboBox).css("background", temp.m_hoverbackgroundcolor);
				$(ArrowBox).css("background",  temp.m_hoverbackgroundcolor);
				$(titleLeftDiv).css("background", temp.m_hoverbackgroundcolor);
	        },
	        function() {
	            $(comboBox).css("background", (temp.m_title.m_gradientcolor).split(",")[0]);
				$(ArrowBox).css("background", (temp.m_title.m_gradientcolor).split(",")[0]);
				//$(titleLeftDiv).css("background", convertColorToHex(temp.m_chromecolor));
				$(titleLeftDiv).css("background", (temp.m_title.m_gradientcolor).split(",")[0]);
	        }
	    )
	   $(titleLeftDiv).hover(
	        function() {
				$(comboBox).css("background", temp.m_hoverbackgroundcolor);
				$(ArrowBox).css("background", temp.m_hoverbackgroundcolor);
				$(titleLeftDiv).css("background", temp.m_hoverbackgroundcolor);
	        },
	        function() {
	           $(comboBox).css("background", (temp.m_title.m_gradientcolor).split(",")[0]);
			   $(ArrowBox).css("background", (temp.m_title.m_gradientcolor).split(",")[0]);
			   $(titleLeftDiv).css("background", (temp.m_title.m_gradientcolor).split(",")[0]);
	        }
	    ) 
	}
	
	else if(!this.m_designMode && this.m_enhanceCheckbox == true && this.m_filterbgcolor != undefined){
	  $(comboBox).hover(
          function() {
              $(comboBox).css("background", temp.m_hoverbackgroundcolor);
              $(ArrowBox).css("background", temp.m_hoverbackgroundcolor);
              $(titleLeftDiv).css("background", temp.m_hoverbackgroundcolor);
          },
          function() {
              $(comboBox).css("background", convertColorToHex(temp.m_filterbgcolor));
              $(ArrowBox).css("background", convertColorToHex(temp.m_filterbgcolor));
              //$(titleLeftDiv).css("background", convertColorToHex(temp.m_backgroundcolor));
              $(titleLeftDiv).css("background", (temp.m_title.m_gradientcolor).split(",")[0]);
          }
      )
      $(ArrowBox).hover(
          function() {
              $(comboBox).css("background", temp.m_hoverbackgroundcolor);
              $(ArrowBox).css("background", temp.m_hoverbackgroundcolor);
              $(titleLeftDiv).css("background", temp.m_hoverbackgroundcolor);
          },
          function() {
              $(comboBox).css("background", convertColorToHex(temp.m_filterbgcolor));
              $(ArrowBox).css("background", convertColorToHex(temp.m_filterbgcolor));
              //$(titleLeftDiv).css("background", convertColorToHex(temp.m_backgroundcolor));
              $(titleLeftDiv).css("background", (temp.m_title.m_gradientcolor).split(",")[0]);
          }
      )
      $(titleLeftDiv).hover(
          function() {
              $(comboBox).css("background", temp.m_hoverbackgroundcolor);
              $(ArrowBox).css("background", temp.m_hoverbackgroundcolor);
              $(titleLeftDiv).css("background", temp.m_hoverbackgroundcolor);
          },
          function() {
              $(comboBox).css("background", convertColorToHex(temp.m_filterbgcolor));
              $(ArrowBox).css("background", convertColorToHex(temp.m_filterbgcolor));
              //$(titleLeftDiv).css("background", convertColorToHex(temp.m_chromecolor));
              $(titleLeftDiv).css("background", (temp.m_title.m_gradientcolor).split(",")[0]);
          }
      )
	}

	if (!this.m_designMode) {
	    this.listContainerDiv();

	    if (IsBoolean(this.m_actionbarenabled)) {
	        this.createActionIcons();
	    } else {
	        /** Get search bar working even when action icons are not visible **/
	        this.initSearchBarEvent();
	    }

	    /** To pass default filter selected index value to associated component on preview **/
	    /** commented this method bcz connection loading multiple times  **/
	    if (IsBoolean(this.m_enablegvautoupdate)) {
	        this.m_notifychange = this.m_notifygvautoupdate;
	        this.preSelectedValue.cat = this.getDisplayValue();
	        this.preSelectedValue.ser = this.getValue();
	        this.handleOnChangeEvent(this.getValue(), this.getDisplayValue(), 0);
	    }
	}
	/**Added for Combo filter Select type*/
	if (this.m_selectiontype == "singleselect") {
	    $("#actionIconContainer" + this.m_objectid).css("display", "none");
	}

	var disva = this.getDisplayValue();
	if (disva == "" || disva == null)
	    disva = this.formattedDescription(this, this.m_title.getDescription());

	if (IsBoolean(this.m_title.m_showonlytitle)) {

	    comboBox.value = this.formattedDescription(this, this.m_title.getDescription());
	} else
	    comboBox.value = disva;
	
};
/**Added to close panel on click from out side of the div.*/
ComboFilter.prototype.hidePanelOnClick = function() {
    var temp = this;
    $(".draggablesParentDiv").click(
        function(e) {
            var panel = $("#draggableDiv" + temp.m_objectid);
            var panel_2 = $("#AdvanceCheckList" + temp.m_objectid);
            if (e.target.id != panel.attr('id') && !panel.has(e.target).length && e.target.id != panel_2.attr('id') && !panel_2.has(e.target).length) {
                if (panel_2 && panel_2.is(":visible")) {
                	temp.cancelButtonCB();
            		$("#AdvanceCheckList" + temp.m_objectid).hide();
            		if (temp.m_enhanceCheckbox == true) {
            			if (!IsBoolean(temp.m_title.m_showtitle) && !IsBoolean(temp.m_title.m_showgradient)) {
            			    document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
            			    document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
            			} else {
            			    if (temp.m_title.m_position === "left") {
            			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "0px";
            			        document.getElementById("titleLeftContainer" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
            			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
            			    } else if (temp.m_title.m_position === "right") {
            			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "0px";
            			        document.getElementById("titleLeftContainer" + temp.m_objectid).style.borderBottomRightRadius = "4px";
            			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
            			    } else {
            			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
            			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
            			    }
            			}
            		    $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").removeClass('combo-arrow-enhance-open');
            		    $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").addClass('combo-arrow-enhance');
            		    $("#draggableDiv" + temp.m_objectId).css({
            		        "box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0)",
            		        "-webkit-box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0)"
            		    });
            		    if ($("#textBox" + temp.m_objectid).val() == "")
            		        $("#textBox" + temp.m_objectid).val(temp.formattedDescription(temp, temp.m_title.getDescription()));
            		}
            		temp.m_isMultiselectPanelVisible = false;
                }
            }else if((!temp.m_actionbarenabled) && (temp.m_show) && e.target.id != panel.attr('id') && panel.has(e.target).length && e.target.id != panel_2.attr('id') && !panel_2.has(e.target).length){
                if (panel_2 && panel_2.is(":visible")) {
                	temp.cancelButtonCB();
            		$("#AdvanceCheckList" + temp.m_objectid).hide();
            		if (temp.m_enhanceCheckbox == true) {
            			if (!IsBoolean(temp.m_title.m_showtitle) && !IsBoolean(temp.m_title.m_showgradient)) {
            			    document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
            			    document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
            			} else {
            			    if (temp.m_title.m_position === "left") {
            			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "0px";
            			        document.getElementById("titleLeftContainer" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
            			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
            			    } else if (temp.m_title.m_position === "right") {
            			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "0px";
            			        document.getElementById("titleLeftContainer" + temp.m_objectid).style.borderBottomRightRadius = "4px";
            			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
            			    } else {
            			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
            			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
            			    }
            			}
            		    $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").removeClass('combo-arrow-enhance-open');
            		    $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").addClass('combo-arrow-enhance');
            		    $("#draggableDiv" + temp.m_objectId).css({
            		        "box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0)",
            		        "-webkit-box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0)"
            		    });
            		    if ($("#textBox" + temp.m_objectid).val() == "")
            		        $("#textBox" + temp.m_objectid).val(temp.formattedDescription(temp, temp.m_title.getDescription()));
            		}
            		temp.m_isMultiselectPanelVisible = false;
                }
            }
            if(temp.staticOptsValue.length<=0 && IsBoolean(!temp.m_designMode)){
	            /*DAS-303*/
	        	$("#textBox" + temp.m_objectid).val("No Field Available");
	        	$("#textBox" + temp.m_objectid).css("color","red");
	        	$("#AdvanceCheckList" + temp.m_objectid).hide();
        	}
        }
    );
};

/**CP 1013 Added to close panel on zoom in/out side of the div.*/
ComboFilter.prototype.hidePanel = function() {
    var temp = this;
    $(window).on('resize',
        function(e) {
            var panel = $("#draggableDiv" + temp.m_objectid);
            var panel_2 = $("#AdvanceCheckList" + temp.m_objectid);
            if (e.target.id != panel.attr('id') && !panel.has(e.target).length && e.target.id != panel_2.attr('id') && !panel_2.has(e.target).length) {
                if (panel_2 && panel_2.is(":visible")) {
                	temp.cancelButtonCB();
            		$("#AdvanceCheckList" + temp.m_objectid).hide();
            		if (temp.m_enhanceCheckbox == true) {
            			if (!IsBoolean(temp.m_title.m_showtitle) && !IsBoolean(temp.m_title.m_showgradient)) {
            			    document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
            			    document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
            			} else {
            			    if (temp.m_title.m_position === "left") {
            			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "0px";
            			        document.getElementById("titleLeftContainer" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
            			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
            			    } else if (temp.m_title.m_position === "right") {
            			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "0px";
            			        document.getElementById("titleLeftContainer" + temp.m_objectid).style.borderBottomRightRadius = "4px";
            			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
            			    } else {
            			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
            			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
            			    }
            			}
            		    $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").removeClass('combo-arrow-enhance-open');
            		    $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").addClass('combo-arrow-enhance');
            		    $("#draggableDiv" + temp.m_objectId).css({
            		        "box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0)",
            		        "-webkit-box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0)"
            		    });
            		    if ($("#textBox" + temp.m_objectid).val() == "")
            		        $("#textBox" + temp.m_objectid).val(temp.formattedDescription(temp, temp.m_title.getDescription()));
            		}
            		temp.m_isMultiselectPanelVisible = false;
                }
            }else if((!temp.m_actionbarenabled) && (temp.m_show) && e.target.id != panel.attr('id') && panel.has(e.target).length && e.target.id != panel_2.attr('id') && !panel_2.has(e.target).length){
                if (panel_2 && panel_2.is(":visible")) {
                	temp.cancelButtonCB();
            		$("#AdvanceCheckList" + temp.m_objectid).hide();
            		if (temp.m_enhanceCheckbox == true) {
            			if (!IsBoolean(temp.m_title.m_showtitle) && !IsBoolean(temp.m_title.m_showgradient)) {
            			    document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
            			    document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
            			} else {
            			    if (temp.m_title.m_position === "left") {
            			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "0px";
            			        document.getElementById("titleLeftContainer" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
            			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
            			    } else if (temp.m_title.m_position === "right") {
            			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "0px";
            			        document.getElementById("titleLeftContainer" + temp.m_objectid).style.borderBottomRightRadius = "4px";
            			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
            			    } else {
            			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
            			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
            			    }
            			}
            		    $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").removeClass('combo-arrow-enhance-open');
            		    $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").addClass('combo-arrow-enhance');
            		    $("#draggableDiv" + temp.m_objectId).css({
            		        "box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0)",
            		        "-webkit-box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0)"
            		    });
            		    if ($("#textBox" + temp.m_objectid).val() == "")
            		        $("#textBox" + temp.m_objectid).val(temp.formattedDescription(temp, temp.m_title.getDescription()));
            		}
            		temp.m_isMultiselectPanelVisible = false;
                }
            }
            if(temp.staticOptsValue.length<=0 && IsBoolean(!temp.m_designMode)){
	            /*DAS-303*/
	        	$("#textBox" + temp.m_objectid).val("No Field Available");
	        	$("#textBox" + temp.m_objectid).css("color","red");
	        	$("#AdvanceCheckList" + temp.m_objectid).hide();
        	}
        }
    );
};

/** @description create "div" to contains multiselect combo. **/
ComboFilter.prototype.createFilterMainDiv = function () {
	var temp = this;
	var mainDiv = document.createElement("div");
	mainDiv.id = this.m_componentid;
	mainDiv.style.left = "0px";
	mainDiv.style.position = "absolute";
	mainDiv.style.top = "0px";
	mainDiv.style.height = this.m_height + "px";
	mainDiv.style.width = this.m_width + "px";
	$("#draggableDiv" + temp.m_objectid).append(mainDiv);
	return mainDiv;
};
/** @description used input element for multiselect combo. **/
ComboFilter.prototype.createComboBox = function () {
	var temp = this;
	var combo = document.createElement("input");
	combo.type = "text";
	combo.setAttribute("id", "textBox" + this.m_objectid);
	if(IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient)){
		if(this.m_title.m_position === "left" || this.m_title.m_position === "right"){
			combo.style.width = (this.m_width * (100 - this.m_title.m_titlewidth)/100) - this.m_arrowwidth + "px";
			combo.style.height = (this.m_height * 1) + "px";
		}else{
			combo.style.width = (this.m_width - this.m_arrowwidth) + "px";
			combo.style.height = (this.m_height * 1 - this.fontScaling(this.m_title.m_titlebarheight)*1) + "px";
		}
	}else{
		combo.style.width = (this.m_width - this.m_arrowwidth) + "px";
		combo.style.height = (this.m_height * 1) + "px";
	}
	/**DAS-453 */
	$(combo).attr('readonly', true).css({
		"border-style": "solid",
		"border-width": "1px 0px 1px 1px",
		"border-color": "#c2c2c2",
		"position": "absolute",
		"display":"inline",
		"cursor": this.m_cursortype,
		"color": (this.m_title.m_fontcolor),
		"font-size": this.m_title.m_fontsize * this.minWHRatio()+"px",
		"font-family": selectGlobalFont(this.m_title.m_fontfamily),
		"font-weight": this.m_title.m_fontweight,
		"font-style": this.m_title.m_fontstyle,
		"outline": "none",
		"line-height": this.m_height+"px", /* Adjust as needed */
		"text-overflow": "ellipsis",
		"padding": "0px " + 4 * this.minWHRatio() + "px"
		}).click(function () {
		temp.comboArrowToggleCB();
	});
	
	return combo;
};

/*for enhanceChecbox figma*/
ComboFilter.prototype.createComboBoxEnhance = function () {
	var temp = this;
	var combo = document.createElement("input");
	combo.type = "text";
	if (IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient)) {
	    combo.setAttribute("id", "textBox" + this.m_objectid);
	} else {
	    if (IsBoolean(this.m_title.m_showonlytitle)) {
	        combo.setAttribute("id", "textBox" + this.m_objectid);
	        $("#textBox" + this.m_objectid).val(this.formattedDescription(this, this.m_title.getDescription()));
	    } else {
	        combo.setAttribute("id", "textBox" + this.m_objectid);
	    }
	}
	if (IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient)) {
	    if (this.m_title.m_position === "left" || this.m_title.m_position === "right") {
	        combo.style.width = (this.m_width * (100 - this.m_title.m_titlewidth) / 100) - this.m_arrowwidth + "px";
	        combo.style.height = (this.m_height * 1) + "px";
	    } else {
	        combo.style.width = (this.m_width - this.m_arrowwidth) + "px";
	        combo.style.height = (this.m_height * 1 - this.fontScaling(this.m_title.m_titlebarheight) * 1) + "px";
	    }
	} else {
	    combo.style.width = (this.m_width - this.m_arrowwidth) + "px";
	    combo.style.height = (this.m_height * 1) + "px";
	}
//	if (IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient)) {
//	    //no backgroun color for selection box
//	} else {
//	    combo.style.background = (this.m_title.m_gradientcolor).split(",")[0];
//	}
	combo.style.background = (this.m_title.m_gradientcolor).split(",")[0];
	if (IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient)) {
	    /*CP 956 border radius*/
	    /**DAS-629 selected text styles based on font title style properties */
	    $(combo).attr('readonly', true).css({
	        "border-style": "solid",
	        "border-width": "1px 0px 1px 1px",
	        "border-color": "#c2c2c2",
//	        "border-radius": "0px 0px 0px 4px",
   	        "border-radius": this.m_title.m_position === "left" ? "0px" : (this.m_title.m_position === "right" ? "4px 0px 0px 4px" : "0px 0px 0px 4px"),
	        "display": "inline",
	        "position": "absolute",
	        "cursor": this.m_cursortype,
	        "color": (this.m_title.m_fontcolor),
	        "font-size": this.fontScaling(this.m_title.m_fontsize) + "px",
	        "font-family": selectGlobalFont(this.m_title.m_fontfamily),
	        "font-weight": this.m_title.m_fontweight,
	        "font-style": this.m_title.m_fontstyle,
	        "outline": "none",
	        "line-height": this.m_height+"px", /* Adjust as needed */
	        "text-overflow": "ellipsis",
	        "padding": "0px 29.5px 0px 18px"
	    }).click(function() {
	        temp.comboArrowToggleCB();
	    });
	} else {
	    $(combo).attr('readonly', true).css({
	        "border-style": "solid",
	        "border-width": "1px 0px 1px 1px",
	        "border-color": "#c2c2c2",
	        "border-radius": "4px 0px 0px 4px",
	        "display": "inline",
	        "position": "absolute",
	        "cursor": this.m_cursortype,
	        "color": (this.m_title.m_fontcolor),
	        "font-size": this.fontScaling(this.m_title.m_fontsize) + "px",
	        "font-family": selectGlobalFont(this.m_title.m_fontfamily),
	        "font-weight": this.m_title.m_fontweight,
	        "font-style": this.m_title.m_fontstyle,
	        "outline": "none",
	        "line-height": this.m_height+"px", /* Adjust as needed */
	        "text-overflow": "ellipsis",
	        //	"margin-left":"5px",
	        //    "padding": "0px 18px"
	        "padding": "0px 29.5px 0px 18px"
	    }).click(function() {
	        temp.comboArrowToggleCB();
	    });
	}
	/*
	var tSpan = document.createElement("span");
	tSpan.setAttribute("id", "titleEnhanceContainerSpan" + this.m_objectid);
	tSpan.innerHTML = this.formattedDescription(this, this.m_title.getDescription());	
	$(tSpan).css({"position":"relative", "display":"table-cell","vertical-align":"middle","height":this.fontScaling(this.m_title.m_titlebarheight)+"px",
			"font-size":this.fontScaling(this.m_title.m_fontsize) + "px","text-align":this.m_title.m_align,"text-decoration":this.m_title.m_textdecoration,
			"width":this.m_width+"px"});
	combo.appendChild(tSpan);
	*/
	return combo;
};

/** @description create createArrowBox  for multiselect combo. **/
ComboFilter.prototype.createArrowBox = function () {
	var temp = this;
	var Arrow = document.createElement("div");
	Arrow.style.width = this.m_arrowwidth + "px";
	Arrow.style.display = "inline";
	Arrow.style.position = "absolute";
	Arrow.style.right = "0px";
	if(IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient)){
		if(this.m_title.m_position === "left"){
			Arrow.style.height = (this.m_height * 1) + "px";
		}else if(this.m_title.m_position === "right"){
			Arrow.style.height = (this.m_height * 1) + "px";
			Arrow.style.right = this.m_title.m_titlewidth + "%";
		}else if(this.m_title.m_position === "top"){
			Arrow.style.height = (this.m_height * 1 - this.fontScaling(this.m_title.m_titlebarheight)*1) + "px";
		}else{
			// Do nothing
		}
	}else{
		Arrow.style.height = (this.m_height * 1) + "px";
	}
	$(Arrow).css("box-sizing", "border-box");
	$(Arrow).css("-moz-box-sizing", "border-box");
	$(Arrow).css("-webkit-box-sizing", "border-box");
	$(Arrow).css("box-sizing", "border-box");
	/**DAS-651 */
	Arrow.style.borderStyle = "solid";
    Arrow.style.borderWidth = "1px 1px 1px 0px";
    if (IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient)) {
	    if (this.m_title.m_position === "left") {
			Arrow.style.borderRadius = "0px 4px 4px 0px";
		}
	    }
    Arrow.style.borderColor = "#c2c2c2";
	Arrow.style.textAlign = "center";
	Arrow.style.color = "#333333";
	/**DAS-596 combofilter arrow bg color update */
	Arrow.style.background = "#ffffff";
	if(this.m_filterbgcolor != undefined){
		Arrow.style.background = convertColorToHex(this.m_filterbgcolor);
	}
	if(this.m_enhanceCheckbox==true)
		if(this.m_filterbgcolor != undefined){
		  Arrow.style.background = convertColorToHex(this.m_filterbgcolor);
		}
		else {
	      Arrow.style.background = (this.m_title.m_gradientcolor).split(",")[0];
	      }
	//$("#"+temp.m_componentid).find('input').css("border", "0px solid red");
	//$("#"+temp.m_componentid).find('div').css("border","1px solid rg(194,194,194)");
	var innerIcon = '<span class="textbox-addon textbox-addon-right" id="arrowdown' + temp.m_componentid + '" style="right: 0px; width:100%; height: 100%;"><a href="javascript:void(0)" class="textbox-icon combo-arrow" icon-index="0" tabindex="-1" style="width: 18px; height: 100%; background-color :rgba(242, 242, 242, 0)"></a></span>';
	$(Arrow).append(innerIcon);
	Arrow.style.cursor = this.m_cursortype;
	$(Arrow).click(function () {
		if(temp.getSelectedIndex.length > 0){
			$("#OK" + temp.m_componentid).css("display", "block");
		}else{
			$("#OK" + temp.m_componentid).css("display", "none");
		}
		temp.comboArrowToggleCB();
	});
	return Arrow;
};

/*enhance checkbox UI CP-689 arrow box*/
ComboFilter.prototype.createArrowBoxEhance = function () {
	var temp = this;
	var Arrow = document.createElement("div");
	Arrow.setAttribute("id", "arrowBox" + this.m_objectid);
	Arrow.style.width = this.m_arrowwidth + "px";
	Arrow.style.display = "inline";
	Arrow.style.position = "absolute";
	Arrow.style.right = "0px";
	if (IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient)) {
	    if (this.m_title.m_position === "left") {
	        Arrow.style.height = (this.m_height * 1) + "px";
	    } else if (this.m_title.m_position === "right") {
	        Arrow.style.height = (this.m_height * 1) + "px";
	        Arrow.style.right = this.m_title.m_titlewidth + "%";
	    } else if (this.m_title.m_position === "top") {
	        Arrow.style.height = (this.m_height * 1 - this.fontScaling(this.m_title.m_titlebarheight) * 1) + "px";
	    } else {
	        // Do nothing
	    }
	} else {
	    Arrow.style.height = (this.m_height * 1) + "px";
	}
	$(Arrow).css("box-sizing", "border-box");
	$(Arrow).css("-moz-box-sizing", "border-box");
	$(Arrow).css("-webkit-box-sizing", "border-box");
	$(Arrow).css("box-sizing", "border-box");
	//$(Arrow).css("padding", "20px");	
	if (!IsBoolean(this.m_title.m_showtitle) && !IsBoolean(this.m_title.m_showgradient)) {
	    $(Arrow).css("border-radius", "0px 4px 4px 0px");
	} else {
	    if (this.m_title.m_position === "left")
	        $(Arrow).css("border-radius", "0px 4px 4px 0px");
	    else if (this.m_title.m_position === "right")
	        $(Arrow).css("border-radius", "0px");
	    else
	        $(Arrow).css("border-radius", "0px 0px 4px 0px");
	}
	/**DAS-651 */
	Arrow.style.borderStyle = "solid";
    Arrow.style.borderWidth = "1px 1px 1px 0px";
    if (IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient)) {
	    if (this.m_title.m_position === "left") {
			Arrow.style.borderRadius = "0px 4px 4px 0px";
		}
	    }
    Arrow.style.borderColor = "#c2c2c2";
	Arrow.style.textAlign = "center";
	Arrow.style.color = "#333333";
	
	
	Arrow.style.textAlign = "center";
//	if (IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient)) {
//	    //no backgroun color for selection box
//	} else {
//	    Arrow.style.background = (this.m_title.m_gradientcolor).split(",")[0];
//	}
	//Arrow.style.background = (this.m_title.m_gradientcolor).split(",")[0];
	if(temp.filterbgcolor != undefined){
		Arrow.style.background  = convertColorToHex(temp.m_filterbgcolor);
	}
	else {
	Arrow.style.background = (this.m_title.m_gradientcolor).split(",")[0];
	}
	var innerIcon = '<span class="textbox-addon textbox-addon-right enhance-combo" id="arrowdown' + temp.m_componentid + '" style="right: 0px; width:100%; height: 100%;margin-right: 21px;"><a href="javascript:void(0)" class="textbox-icon combo-arrow-enhance" icon-index="0" tabindex="-1" style="width: 18px; height: 100%; background-color: rgba(242, 242, 242, 0);"></a></span>';
	$(Arrow).append(innerIcon);
	Arrow.style.cursor = this.m_cursortype;
	$(Arrow).click(function() {
	    if (temp.getSelectedIndex.length > 0) {
	        $("#OK" + temp.m_componentid).css("display", "block");
	    } else {
	        $("#OK" + temp.m_componentid).css("display", "none");
	    }
	    temp.comboArrowToggleCB();
	});
	return Arrow;
};

ComboFilter.prototype.getActionBarHeight = function() {
	return (IsBoolean(this.m_actionbarenabled) && this.m_selectiontype == "multiselect") ? this.m_actionbarheight : 0;
};
/** @description create ActionIcons  for multiselect combo. **/
ComboFilter.prototype.comboArrowToggleCB = function () {
	var temp = this;	
	if (IsBoolean(temp.m_isMultiselectPanelVisible)) {
		temp.cancelButtonCB();
		$("#AdvanceCheckList" + temp.m_objectid).hide();
		if (this.m_enhanceCheckbox == true) {
			if (!IsBoolean(this.m_title.m_showtitle) && !IsBoolean(this.m_title.m_showgradient)) {
			    document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
			    document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
			} else {
			    if (this.m_title.m_position === "left") {
			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "0px";
			        document.getElementById("titleLeftContainer" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
			    } else if (this.m_title.m_position === "right") {
			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "0px";
			        document.getElementById("titleLeftContainer" + temp.m_objectid).style.borderBottomRightRadius = "4px";
			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
			    } else {
			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
			    }
			}
		    	    
		    $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").removeClass('combo-arrow-enhance-open');
		    $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").addClass('combo-arrow-enhance');
		    $("#draggableDiv" + temp.m_objectId).css({
		        "box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0)",
		        "-webkit-box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0)"
		    });
		}
		temp.m_isMultiselectPanelVisible = false;
	} else {
		/**Added below css here to resolve the issue of multiSelectCombo drop down list when change the position of component through script  @BDD-794*/
		var parentDiv = $("#draggableDiv" + temp.m_objectId)[0];
		var left=parentDiv.offsetLeft + "px";
		var position="absolute";
	    if($(parentDiv).css("position")=="fixed")
	    	{	
	    	position="fixed";
	    	}
		
		$("#AdvanceCheckList" + temp.m_objectid).css({
			"left": left,
			"position": position,
			"top": (parentDiv.offsetTop + parentDiv.offsetHeight) + "px"
		});
		$("#AdvanceCheckList" + temp.m_objectid).show();
		if (this.m_enhanceCheckbox == true) {
		    document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "0px";
		    document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "0px";
		    if (IsBoolean(temp.m_title.m_showtitle)) {
		        if (temp.m_title.m_position === "left")
		            document.getElementById("titleLeftContainer" + temp.m_objectid).style.borderBottomLeftRadius = "0px";
		        else if (temp.m_title.m_position === "right")
		            document.getElementById("titleLeftContainer" + temp.m_objectid).style.borderBottomRightRadius = "0px";
		    }
		    $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").addClass('combo-arrow-enhance-open');
		    $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").removeClass('combo-arrow-enhance');
		    $("#draggableDiv" + temp.m_objectId).css({
		        "box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0.1)",
		        "-webkit-box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0.1)"
		    });
		}
		temp.m_isMultiselectPanelVisible = true;
	}
	/**DAS-629 @description heck if all checkbox is selected */
			if(IsBoolean(temp.m_actionbarenabled)){	
		    for (var key in temp.m_checkboxstatus) {	
		        if (!IsBoolean(temp.m_checkboxstatus[key])) {	
		            $("#SelectAll" + temp.m_componentid).prop('checked', false);	
		            break;	
		        } else {	
		            $("#SelectAll" + temp.m_componentid).prop('checked', true);	
		        }	
		    }	
		}
	
	if(1)
		{
	if($("#textBox" + temp.m_objectid).val()=="")
	$("#textBox" + temp.m_objectid).val(temp.formattedDescription(temp, temp.m_title.getDescription()));
		
		}
	/** set height of container after reducing icon bar height and padding **/
	var enHt=(this.m_enhanceCheckbox)?30:0;
	$("#InnerContainer"+temp.m_objectid).css({
		"height": (temp.m_panelheight - temp.m_menupanelrowheight - (temp.m_searchboxuiobj.margin*2+1) + enHt)+"px"
		//"height": (temp.m_panelheight - temp.getActionBarHeight() - temp.m_menupanelrowheight)+"px"
	});
};
/** @description create ActionIcons  for multiselect combo. **/
ComboFilter.prototype.createActionIcons = function () {
	var temp = this;
	this.m_selectAll = "Select All";
	//var selectAll=(IsBoolean(this.m_updateddesign)?this.m_selectAll:"");
	var mainDiv = $("#AdvanceCheckList" + this.m_objectid);
	$("#OK" + temp.m_componentid).remove();
	$("#Cancel" + temp.m_componentid).remove();
	$("#SelectAll" + temp.m_componentid).remove();
//	var width = (IsBoolean(temp.m_title.m_showtitle) && temp.m_title.m_position != "top") ? (temp.m_width / 2 ) : temp.m_width;
	var fontIconWidth = this.m_menupanelfontsize  * this.minWHRatio();
	/** remove this padding-size from actual list's height **/
	var iconPadding = 6;
	var maxHeight = this.m_panelheight - this.getActionBarHeight() - this.m_menupanelrowheight;
	
	var selectallmargin=(this.m_enhanceCheckbox)?"margin-left: 16px !important;":"margin-left:3px !important;";
	
	var select_checkbox=(this.m_enhanceCheckbox)?"combofiltercheckbox":"";
	
	var radius=(this.m_enhanceCheckbox)?"0px 0px 4px 4px":"0";
	var selectAll=(!IsBoolean(this.m_actionbartooltip))?"<label style='color:"+convertColorToHex(this.m_menupanelfontcolor)+";font-size:"+(fontIconWidth)+"px;font-weight:"+(this.m_menupanelfontweight)+"; cursor:"+this.m_cursortype+"; position:relative;padding:2px 5px 0px 5px;'>"+this.m_selectAll+"</label>":"";
	var width=(this.m_enhanceCheckbox)?($("#simpleCombo"+this.m_objectid).width())+"px":"auto";
	/*DAS-148 added @top @left border for @actionbar @marginLeft:-1px to coverup with main div*/
	var div = "<div id='actionIconContainer"+temp.m_objectid+"' style='position:relative;padding:"+iconPadding+"px 2px 0px 2px;;border-radius:"+radius+";bottom:0px;width:auto;min-height:"+ this.m_menupanelrowheight + "px;height:auto;margin-left:-1px;background:" + convertColorToHex(this.m_chromecolor) + ";max-height:"+maxHeight+"px; border-top:1px solid "+ convertColorToHex(this.m_cbbordercolor)+"; border-left:1px solid "+ convertColorToHex(this.m_cbbordercolor)+";'>" +
	"<input type='checkbox' class='multiComboCheckbox cr-checkbox "+select_checkbox+" ' id='SelectAll" + temp.m_componentid +"' style='color:"+convertColorToHex(this.m_menupanelfontcolor)+";font-size:"+(fontIconWidth)+"px; cursor:"+this.m_cursortype+"; position:relative;float:left;padding:2px 5px 0px 5px;"+selectallmargin+"' />"+selectAll+	
	//"<span class='icons "+select_checkbox+" bd-checkbox' value='' id=\"SelectAll" + temp.m_componentid + "\" style='color:"+convertColorToHex(this.m_menupanelfontcolor)+";font-size:"+(fontIconWidth)+"px; cursor:"+this.m_cursortype+"; position:relative;float:left;padding:2px 5px 0px 5px;'> "+selectAll+" </span>" +
		"<span class='icons bd-close' value='' id=\"Cancel" + temp.m_componentid + "\" style='color:"+convertColorToHex(this.m_menupanelfontcolor)+";font-size:"+(fontIconWidth)+"px; cursor:"+this.m_cursortype+"; position:relative;float:right;padding:2px 5px 0px 5px;'></span>" + 
		"<span class='icons bd-check-2' value='' id=\"OK" + temp.m_componentid + "\" style='color:"+convertColorToHex(this.m_menupanelfontcolor)+";font-size:"+(fontIconWidth)+"px; cursor:"+this.m_cursortype+"; position:relative;float:right;padding:2px 10px 0px 5px;'/></span></div>";
	$(mainDiv).append(div);
	/* *DAS-148*
	if (IsBoolean(this.m_isallselected)) {
	    $("#SelectAll" + temp.m_componentid).removeClass("bd-checkbox");
	    $("#SelectAll" + temp.m_componentid).addClass("bd-checked");
	} else if (!IsBoolean(this.m_isallselected)) {
	    $("#SelectAll" + temp.m_componentid).removeClass("bd-checked");
	    $("#SelectAll" + temp.m_componentid).addClass("bd-checkbox");
	} else {
	    //do nothing
	}
	*/
	
	$("#OK" + temp.m_componentid).on("mouseenter", function(e){
		$(this).css({"color": "#000000"});
		temp.removeToolTipDiv();
		var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
		var scrollLeft =  parentDiv.scrollLeft;
		var scrollTop =  parentDiv.scrollTop;
		var offset = $(parentDiv).offset();
		var PageTop =  offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
		var PageLeft = offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft; 
		var offsetLeft = $(this)[0].offsetLeft;
		var offsetTop = $(this)[0].offsetTop;
		var divTop = e.pageY - e.offsetY- PageTop + offsetTop + 12;
		var divLeft = e.pageX - PageLeft - offsetLeft + 25;
		var tooltipDiv = document.createElement("div");
		tooltipDiv.innerHTML = "OK";
		tooltipDiv.setAttribute("id", "toolTipDiv");
		tooltipDiv.setAttribute("class", "settingIcon");
		tooltipDiv.setAttribute("placement", "bottom");
		if(IsBoolean(temp.m_actionbartooltip)){
			$(".draggablesParentDiv").append(tooltipDiv);
		}
		
		var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
			"top": divTop + "px",
			"left": divLeft + "px"
		});
		$(tooltipDiv).css(tooltipObjCss);
		var wd = tooltipDiv.offsetWidth * 1;
		ht = tooltipDiv.offsetHeight * 1;
		var lt = e.pageX - e.offsetX - PageLeft - (wd/2) - 10 + "px";
				$(tooltipDiv).css("left",lt);
				//$(tooltipDiv).css("box-shadow","0 5px 15px -5px rgb(0 0 0 / 50%)");
	}).on("mouseleave", function(){
		$(this).css({"color": convertColorToHex(temp.m_menupanelfontcolor)});
		temp.removeToolTipDiv();
	}).on("click", function () {
		temp.m_notifychange = true;
		temp.handleOnChangeEvent(temp.getValue(), temp.getDisplayValue(), 0);
		temp.preSelectedValue.cat = temp.getDisplayValue();
		temp.preSelectedValue.ser = temp.getValue();
		$("#AdvanceCheckList" + temp.m_objectid).hide();
		if (temp.m_enhanceCheckbox == true) {
			if (!IsBoolean(temp.m_title.m_showtitle) && !IsBoolean(temp.m_title.m_showgradient)) {
			    document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
			    document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
			} else {
			    if (temp.m_title.m_position === "left") {
			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "0px";
			        document.getElementById("titleLeftContainer" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
			    } else if (temp.m_title.m_position === "right") {
			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "0px";
			        document.getElementById("titleLeftContainer" + temp.m_objectid).style.borderBottomRightRadius = "4px";
			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
			    } else {
			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
			    }
			}
		    $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").removeClass('combo-arrow-enhance-open');
		    $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").addClass('combo-arrow-enhance');
		    $("#draggableDiv" + temp.m_objectId).css({
		        "box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0)",
		        "-webkit-box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0)"
		    });
		    if ($("#textBox" + temp.m_objectid).val() == "")
		        $("#textBox" + temp.m_objectid).val(temp.formattedDescription(temp, temp.m_title.getDescription()));
		} else {	
			if ($("#textBox" + temp.m_objectid).val() == "")	
		        $("#textBox" + temp.m_objectid).val(temp.formattedDescription(temp, temp.m_title.getDescription()));	
		}
		temp.m_isMultiselectPanelVisible = false;
	});
	$("#Cancel" + temp.m_componentid).on("mouseenter", function(e){
		$(this).css({"color": "#000000"});
		temp.removeToolTipDiv();
		var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
		var scrollLeft =  parentDiv.scrollLeft;
		var scrollTop =  parentDiv.scrollTop;
		var offset = $(parentDiv).offset();
		var PageTop =  offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
		var PageLeft = offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft; 
		var offsetLeft = $(this)[0].offsetLeft;
		var offsetTop = $(this)[0].offsetTop;
		var divTop = e.pageY - e.offsetY- PageTop + offsetTop + 12;
		var divLeft = e.pageX - PageLeft - offsetLeft + 25;
		var tooltipDiv = document.createElement("div");
		tooltipDiv.innerHTML = "Cancel";
		tooltipDiv.setAttribute("id", "toolTipDiv");
		tooltipDiv.setAttribute("class", "settingIcon");
		tooltipDiv.setAttribute("placement", "bottom");
		if(IsBoolean(temp.m_actionbartooltip)){
			$(".draggablesParentDiv").append(tooltipDiv);
		}
		
		var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
			"top": divTop + "px",
			"left": divLeft + "px"
		});
		$(tooltipDiv).css(tooltipObjCss);
		var wd = tooltipDiv.offsetWidth * 1;
		ht = tooltipDiv.offsetHeight * 1;
		var lt = e.pageX - e.offsetX - PageLeft - (wd/2) - 9 + "px";
				$(tooltipDiv).css("left",lt);
				//$(tooltipDiv).css("box-shadow","0 5px 15px -5px rgb(0 0 0 / 50%)");
	}).on("mouseleave", function(){
		$(this).css({"color": convertColorToHex(temp.m_menupanelfontcolor)});
		temp.removeToolTipDiv();
	}).on("click", function () {
		temp.cancelButtonCB();
		$("#AdvanceCheckList" + temp.m_objectid).hide();
		if (temp.m_enhanceCheckbox == true) {
			if (!IsBoolean(temp.m_title.m_showtitle) && !IsBoolean(temp.m_title.m_showgradient)) {
			    document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
			    document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
			} else {
			    if (temp.m_title.m_position === "left") {
			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "0px";
			        document.getElementById("titleLeftContainer" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
			    } else if (temp.m_title.m_position === "right") {
			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "0px";
			        document.getElementById("titleLeftContainer" + temp.m_objectid).style.borderBottomRightRadius = "4px";
			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
			    } else {
			        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
			        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
			    }
			}
		    $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").removeClass('combo-arrow-enhance-open');
		    $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").addClass('combo-arrow-enhance');
		    $("#draggableDiv" + temp.m_objectId).css({
		        "box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0)",
		        "-webkit-box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0)"
		    });
		    if ($("#textBox" + temp.m_objectid).val() == "")
		        $("#textBox" + temp.m_objectid).val(temp.formattedDescription(temp, temp.m_title.getDescription()));
		}
		temp.m_isMultiselectPanelVisible = false;
	});
	$("#SelectAll" + temp.m_componentid).on("mouseenter", function(e){
		$(this).css({"color": "#000000"});
		temp.removeToolTipDiv();
		var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
		var scrollLeft =  parentDiv.scrollLeft;
		var scrollTop =  parentDiv.scrollTop;
		var offset = $(parentDiv).offset();
		var PageTop =  offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
		var PageLeft = offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft; 
		var offsetLeft = $(this)[0].offsetLeft;
		var offsetTop = $(this)[0].offsetTop;
		var divTop = e.pageY - e.offsetY- PageTop + offsetTop + 12;
		var divLeft = e.pageX - PageLeft - offsetLeft + 25;
		var tooltipDiv = document.createElement("div");
		tooltipDiv.innerHTML = temp.m_selectAll;
		tooltipDiv.setAttribute("id", "toolTipDiv");
		tooltipDiv.setAttribute("class", "settingIcon");
		tooltipDiv.setAttribute("placement", "bottom");
		if(IsBoolean(temp.m_actionbartooltip)){
			$(".draggablesParentDiv").append(tooltipDiv);
		}
		
		var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
			"top": divTop + "px",
			"left": divLeft + "px"
		});
		$(tooltipDiv).css(tooltipObjCss);
		var wd = tooltipDiv.offsetWidth * 1;
		ht = tooltipDiv.offsetHeight * 1;
		var lt = e.pageX - e.offsetX - PageLeft - (wd/2) - 10 + "px";
				$(tooltipDiv).css("left",lt);
				//$(tooltipDiv).css("box-shadow","0 5px 15px -5px rgb(0 0 0 / 50%)");
	}).on("mouseleave", function(){
		$(this).css({"color": convertColorToHex(temp.m_menupanelfontcolor)});
		temp.removeToolTipDiv();
	}).on('change', function () {
		var isCheck;
		/*DAS-148*/
		if ($(this).is(":checked")) {
			isCheck = true
			temp.removeToolTipDiv();
			temp.m_selectAll = "Select All";
			//$(this).attr("title", "Select All");
			//$(this).removeClass("bd-checked");
			//$(this).addClass("bd-checkbox");
		}else{
			isCheck = false;
			temp.removeToolTipDiv();
			temp.m_selectAll = "Remove All";
			//$(this).attr("title", "Remove All");
			//$(this).removeClass("bd-checkbox");
			//$(this).addClass("bd-checked");
		}
		var filterChipsObj = temp.getFilterChipsComponentObj();
		if (filterChipsObj != undefined){
			filterChipsObj.m_removedChipParentValues = [];
		}
		/**Added for selection color and bacground color on click select all*/
		for (var key in temp.m_checkboxstatus) {
		    $("#checklist" + temp.m_componentid + key).attr("checked", isCheck);
		    $("#checklist" + temp.m_componentid + key).prop("checked", isCheck);
		    if(isCheck == false){
		    	var value = key.split('-')[0];
		    	var value1 = value.replace(/_/g, ' ');
		    	value1 = (isNaN(value1)) ? value1 : value1 * 1;
		        if (filterChipsObj != undefined){
		        	var ind = filterChipsObj.m_savedtext.indexOf(value1);
		         	if (ind > -1) {
		         		filterChipsObj.m_savedtext.splice(ind, 1);
		         		//filterChipsObj.m_removedChipValue = value;
		         		filterChipsObj.m_removedChipParentValues.push(value);
		         	}
		        }
		    }
		    temp.m_checkboxstatus[key] = isCheck;
		    if (temp.m_checkboxstatus[key]) {
		        $("#itemDiv" + temp.m_componentid + key).css("background", convertColorToHex(temp.m_selectioncolor));
		    } else {
		        $("#itemDiv" + temp.m_componentid + key).css("background", convertColorToHex(temp.m_chromecolor));
		    }
		}
		$("#textBox" + temp.m_objectid).val(temp.getEnhancedDisplayValue());
	});
	/*$("#Search" + temp.m_componentid).on("mouseenter", function(){
		$(this).css({"color": "#000000"});
	}).on("mouseleave", function(){
		$(this).css({"color": convertColorToHex(temp.m_menupanelfontcolor)});
	}).on("click", function () {
		if($("#SearchTextBox"+temp.m_componentid).is(":visible")){
			$("#SearchTextBox"+temp.m_componentid).css("display","none");
			if (temp.m_selectiontype == "multiselect") {
			    $("#SelectAll" + temp.m_componentid).css("display", "block");
			    $("#Cancel" + temp.m_componentid).css("display", "block");
			    $("#OK" + temp.m_componentid).css("display", "block");
			}
		}else{
			$("#SearchTextBox"+temp.m_componentid).css("display","block").focus().val("");
			$("#SelectAll"+temp.m_componentid).css("display","none");
			$("#Cancel"+temp.m_componentid).css("display","none");
			$("#OK"+temp.m_componentid).css("display","none");
		}*/
		this.initSearchBarEvent();
	//});
};
ComboFilter.prototype.initSearchBarEvent = function() {
	var temp = this;
	var divid = "InnerContainer"+temp.m_objectid;
	$( "#"+divid+" .checkLabeItem" ).show();
	$("#SearchTextBox"+ temp.m_componentid).keyup(function(event) {
	  	var criteria = $(event.target).val().toLowerCase();
	  	$( "#"+divid+" .checkLabeItem" ).hide();
	    $( "#"+divid+" .checkLabeItem" ).filter(function(ind){
	    	return $(this).find("label").text().toLowerCase().indexOf(criteria) != -1;
	    }).show();
	});
	$("#SearchTextCross"+ temp.m_componentid).click(function(event) {
   	 $("#SearchTextBox"+ temp.m_componentid).val('');
   	$( "#"+divid+" .checkLabeItem" ).hide();
    $( "#"+divid+" .checkLabeItem" ).filter(function(ind){
    	return $(this).find("label").text().toLowerCase().indexOf("") != -1;
    }).show();
	});
};
/** @description create list of checkbox and labels and append into container. **/
ComboFilter.prototype.cancelButtonCB = function () {
	var temp = this;
	temp.m_show = false;
	if(temp.staticOptsValue.length == 0){
		$("#textBox" + temp.m_objectid).val("");
		$("#textBox" + temp.m_objectid).css("color", "red");
	}else{
		/*$("#textBox" + temp.m_objectid).val(temp.preSelectedValue.cat);*/
		/*DAS-136*/
		var selectedVal=temp.preSelectedValue.cat;
		if(selectedVal.indexOf(',')>-1){
			selectedVal=selectedVal.replaceAll(',', ', ');
		}
		$("#textBox" + temp.m_objectid).val(selectedVal);
		
		/**DAS-629 when selectedindex is empty then show title description */
		if (selectedVal == "") {
			$("#textBox" + temp.m_objectid).val(temp.formattedDescription(temp, temp.m_title.getDescription()));
			}
	}
	
	var value, valNumeric;
	if(isNaN(temp.preSelectedValue.ser)){
    	value = temp.preSelectedValue.ser.split(",");
    	valNumeric = false;
    }else{
    	value = temp.preSelectedValue.ser;
    	valNumeric = true;
    }
	for (var key in temp.m_checkboxstatus) {
		var key1=key.split("-");
		key = key1[0];
		var index = key1[1];
		var flag = false;
		if(valNumeric) {
			if (key == getStringARSC(value)){
				flag = true;
			}
		}else{
			for (var j = 0; j < value.length; j++) {
				if (key == getStringARSC(value[j]))
					flag = true;
			}
		}
		if (flag){
			key = key+"-"+index;
			$("#checklist"+ temp.m_componentid + key).attr("checked", true);
			$("#checklist"+ temp.m_componentid + key).prop("checked", true);
			$("#itemDiv" + temp.m_componentid + key).css("background", convertColorToHex(temp.m_selectioncolor));
			temp.m_checkboxstatus[key] = true;
		}
		else{
			key = key+"-"+index;
			$("#checklist"+ temp.m_componentid + key).attr("checked", false);
			$("#checklist"+ temp.m_componentid + key).prop("checked", false);
			$("#itemDiv" + temp.m_componentid + key).css("background", convertColorToHex(temp.m_chromecolor));
			temp.m_checkboxstatus[key] = false;
		}
		var isAllselected;
		for (var key in temp.m_checkboxstatus) {
		    if (!IsBoolean(temp.m_checkboxstatus[key])) {
		        isAllselected = false;
		        break;
		    } else {
		        isAllselected = true;
		    }
		}
		if (IsBoolean(isAllselected)) {
			/*DAS-148*/
		    //$("#SelectAll" + temp.m_componentid).addClass("bd-checked");
		    //$("#SelectAll" + temp.m_componentid).removeClass("bd-checkbox");
		    $("#SelectAll" + temp.m_componentid).prop('checked', true);
		} else if (!IsBoolean(isAllselected)) {
		    //$("#SelectAll" + temp.m_componentid).removeClass("bd-checked");
		    //$("#SelectAll" + temp.m_componentid).addClass("bd-checkbox");
		    $("#SelectAll" + temp.m_componentid).prop('checked', false);
		} else {
		    //
		}
	}
};
/** @description create list of checkbox and labels and append into container. **/
ComboFilter.prototype.listContainerDiv = function () {
	var temp = this;
	var removedInd = "-1";
	temp.m_checkboxstatus = {};
	$("#AdvanceCheckList" + temp.m_objectid).remove();
	var mainDiv = this.createMainDiv();
	$(temp.m_chartContainer).append(mainDiv);
	var SearchBox = this.createSearchBox();
	var innerContainerDiv = this.innerContainerDiv();
	/**Added below changes for supporting filterchips functionality**/
	var filterChipsObj = this.getFilterChipsComponentObj();
	if(filterChipsObj !== undefined){
		var prevTextArr = filterChipsObj.m_filterDisplayValues[this.m_objectid];
		
		if(filterChipsObj.m_removedChipParentValues.length > 0){
			filterChipsObj.m_filterDisplayValues[this.m_objectid] = [];
			if(filterChipsObj.m_savedtext.length > 0){
				prevTextArr.map(function(val){
				 	var ind2 = filterChipsObj.m_savedtext.indexOf(val);
				 	(ind2 >= 0) ? filterChipsObj.m_savedtext.splice(ind2, 1): filterChipsObj.m_savedtext;
				})
			}
		}
		
		prevTextArr = filterChipsObj.m_filterDisplayValues[this.m_objectid];
		if (filterChipsObj.m_removedChipValue !== undefined) {
		    this.m_selectedindex = [];
		} else if (prevTextArr != undefined && prevTextArr.length > 0 && typeof this.m_selectedindex == "string") { //
		    this.m_selectedindex = [];
		} else if (prevTextArr != undefined && prevTextArr.length > 0 && Array.isArray(this.m_selectedindex)) {
		    var tempind = this.m_selectedindex;
		    this.m_selectedindex = [];
		    if (tempind !== "" && !Array.isArray(tempind))
		        this.m_selectedindex.push(tempind)
		    else if (Array.isArray(tempind) && tempind.indexOf("-1") >= 0)
		        this.m_selectedindex = [];
		    else
		        this.m_selectedindex = tempind;
		} else {
		    //do nothing
		}

		if (this.m_associatedfilterchipsid !== "" && filterChipsObj.m_removedChipValue !== undefined) {
		    var arr = this.m_dataProvider.filter(function(obj) {
		        for (var key in obj) {
		            if (obj[key] == filterChipsObj.m_removedChipValue) {
		                return obj;
		            }
		        }
		    })
		    removedInd = this.staticOptsValue.indexOf(filterChipsObj.m_removedChipValue);
		}

		if (prevTextArr !== undefined && prevTextArr.length > 0 && arr !== undefined && arr.length > 0) {
		    arr.map(function(ele) {
		        if (prevTextArr.indexOf(ele[temp.m_categoryName[0]]) >= 0) {
		            var ind = prevTextArr.indexOf(ele[temp.m_categoryName[0]]);
		            var ind2 = filterChipsObj.m_savedtext.indexOf(ele[temp.m_categoryName[0]]);
		            (ind >= 0) ? prevTextArr.splice(ind, 1): prevTextArr;
		            (ind2 >= 0) ? filterChipsObj.m_savedtext.splice(ind2, 1): filterChipsObj.m_savedtext;
		        }
		    })
		    temp.m_selectedindex = (prevTextArr.length == 0) ? [] : temp.m_selectedindex;
		}
	}
	/**Added above changes for supporting filterchips functionality**/

	for (var j = 0; j < this.staticOptsValue.length; j++) {
	    if (this.m_associatedfilterchipsid !== "" && removedInd < 0 && filterChipsObj !== undefined && filterChipsObj.m_removedChipValue !== undefined) {
	        var prevTextArr = filterChipsObj.m_filterDisplayValues[this.m_objectid];
	        //filterChipsObj.m_removedChipValue;
	        if (prevTextArr !== undefined && prevTextArr.length > 0 && filterChipsObj !== undefined && filterChipsObj.m_removedChipValue !== undefined && filterChipsObj.m_removedChipValue !== this.displayField[j] && prevTextArr.indexOf(this.displayField[j]) >= 0) { //
	            //var selInd = prevTextArr.indexOf(this.displayField[j]);
	            this.m_selectedindex.push(j);
	        }
	    } else if (prevTextArr !== undefined && prevTextArr.length > 0 && prevTextArr.indexOf(this.displayField[j]) >= 0) {
	        this.m_selectedindex.push(j);
	    }
	    if (!Array.isArray(this.m_selectedindex) && Array.isArray(tempind) && tempind.indexOf("-1") >= 0)
	        this.m_selectedindex = "-1";


	    var idValue = getStringARSC(this.staticOptsValue[j]) + "-" + j; /*BDD-833, To get the data of same magnitude but different sign(Ex. -1 & 1)*/
	    var itemDiv = document.createElement("div");
	    itemDiv.setAttribute("id", "itemDiv" + this.m_componentid+idValue);
	    var childCheckBox = this.createCheckBox(this.staticOptsValue[j], idValue, j);
	    var label = this.createLabel(this.displayField[j], this.staticOptsValue[j], idValue);
	    itemDiv.setAttribute("class", "checkLabeItem");
	    if (this.m_enhanceCheckbox) {
	        if (temp.m_selectiontype == "singleselect")
	            itemDiv.setAttribute("class", "checkLabeItem comboItemss");
	        else
	            itemDiv.setAttribute("class", "checkLabeItem comboItem");
	    }
	    var padding = ((this.m_menupanelrowheight - 24) / 2);
	    $(itemDiv).css({
	        "padding": padding + "px 0px",
	        "background": convertColorToHex(temp.m_chromecolor),
	        "display": "flex",
	        "height": (!temp.m_enhanceCheckbox) ? ("auto") : (this.m_menupanelrowheight + "px"),
	        "cursor": this.m_cursortype
	    });
	    if (this.getSelectedIndex(j)) {
	        $(itemDiv).css("background", convertColorToHex(temp.m_selectioncolor));
	        if (temp.m_selectiontype == "singleselect") {
	            $(itemDiv).css("cursor", "default");
	            $(label).css("cursor", "default");
	        }
	    }
	    $(itemDiv).append(childCheckBox);
	    $(itemDiv).append(label);
	    $(innerContainerDiv).append(itemDiv);
	    $(itemDiv).hover(
	        function() {
	            $(this).css("background", convertColorToHex(temp.m_rollovercolor));
	        },
	        function() {
	            var idValueDiv = this.id.split("itemDiv" + temp.m_componentid)[1];
	            if (temp.m_checkboxstatus[idValueDiv]) {
	                $(this).css("background", convertColorToHex(temp.m_selectioncolor));

	                /**CP-920: added this condition to show default cursor for selected value**/
	                if (temp.m_selectiontype == "singleselect") {
	                    $(this).css("cursor", "default");
	                    $(this).find("label").css("cursor", "default");
	                }
	            } else {
	                $(this).css("background", convertColorToHex(temp.m_chromecolor));

	                if (temp.m_selectiontype == "singleselect") {
	                    $(this).css("cursor", "pointer");
	                    $(this).find("label").css("cursor", "pointer");
	                }
	            }
	        });
	    /**Added to make complete div clickable
	     * onClick of div value will pass to getDisplayValue*/
	    if (temp.m_selectiontype == "singleselect") {
			if(temp.m_filterbgcolor !=undefined) {
			 $("#textBox" + temp.m_objectid).css("background", convertColorToHex(temp.m_filterbgcolor));
			 }
            //$("#arrowdownsimpleCombo" + temp.m_objectid).css("background", convertColorToHex(temp.m_chromecolor));
	        $(itemDiv).on("click", function(e) {
	            e.preventDefault()
	            $.each(temp.m_checkboxstatus, function(key, value) {
	                if (temp.m_checkboxstatus[key]) {
	                    temp.m_checkboxstatus[key] = false;
	                    $("#checklist" + temp.m_componentid + key).attr("checked", false);
	                    $("#itemDiv" + temp.m_componentid + key).css("background", convertColorToHex(temp.m_chromecolor));
	                }
	            });
	            //$("#textBox" + temp.m_objectid).val(temp.getEnhancedDisplayValue());
	            var checkboxid = "#" + e.currentTarget.childNodes["0"].id;
	            $(checkboxid).attr("checked", true);
	            temp.m_checkboxstatus[checkboxid.split("checklist" + temp.m_componentid)[1]] = true;
	            $("#textBox" + temp.m_objectid).val(temp.getEnhancedDisplayValue());
	            temp.m_notifychange = true;
	            temp.handleOnChangeEvent(temp.getValue(), temp.getDisplayValue(), 0);
	            temp.preSelectedValue.cat = temp.getDisplayValue();
	            temp.preSelectedValue.ser = temp.getValue();
	            $("#AdvanceCheckList" + temp.m_objectid).hide();
	            if (temp.m_enhanceCheckbox == true) {
	                if (!IsBoolean(temp.m_title.m_showtitle) && !IsBoolean(temp.m_title.m_showgradient)) {
	                    document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
	                    document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
	                } else {
	                    if (temp.m_title.m_position === "left") {
	                        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "0px";
	                        document.getElementById("titleLeftContainer" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
	                        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
	                    } else if (temp.m_title.m_position === "right") {
	                        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "0px";
	                        document.getElementById("titleLeftContainer" + temp.m_objectid).style.borderBottomRightRadius = "4px";
	                        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
	                    } else {
	                        document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
	                        document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
	                    }
	                }
	                $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").removeClass('combo-arrow-enhance-open');
	                $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").addClass('combo-arrow-enhance');
	                $("#draggableDiv" + temp.m_objectId).css({
	                    "box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0)",
	                    "-webkit-box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0)"
	                });
	            }
	            temp.m_isMultiselectPanelVisible = false;
	        });
	    }

	    if (this.getSelectedIndex(j)) {
	        this.m_checkboxstatus[idValue] = true;
	    } else {
	        this.m_checkboxstatus[idValue] = false;
	    }
	}

	this.m_isallselected = true;
	for (var key in temp.m_checkboxstatus) {
	    if (!IsBoolean(temp.m_checkboxstatus[key])) {
	        this.m_isallselected = false;
	        break;
	    } else {
	        this.m_isallselected = true;
	    }
	}

	if (this.m_showsearch)
	    $(mainDiv).append(SearchBox);

	$(mainDiv).append(innerContainerDiv);
	$("#SearchTextCross" + temp.m_componentid).click(function(event) {
	    $("#SearchTextBox" + temp.m_componentid).val('');
	});

};
/** @description create div element for innerContainer and set property  and return objects. **/
ComboFilter.prototype.innerContainerDiv = function () {
	$("#InnerContainer" + this.m_objectid).remove();
	var mainDiv = document.createElement("div");
	mainDiv.style.overflow = "auto";
	mainDiv.setAttribute("id", "InnerContainer" + this.m_objectid);
	mainDiv.setAttribute("class", "table");
	mainDiv.style.borderSpacing = "0px";
	mainDiv.style.margin = "0px";
	mainDiv.style.width = "100%";
	var hgt= this.m_searchboxuiobj.margin*2+1;
	//mainDiv.style.maxHeight = (this.m_panelheight - this.getActionBarHeight() - this.m_menupanelrowheight) + "px";
	mainDiv.style.maxHeight = (this.m_panelheight - hgt - this.m_menupanelrowheight) + "px";
	if (this.m_enhanceCheckbox){
		mainDiv.style.maxHeight = (this.m_panelheight - hgt - this.m_menupanelrowheight) + 30 +"px";
	}
	mainDiv.style.color = convertColorToHex(this.m_fontcolor);
	mainDiv.style.backgroundColor =	hex2rgb(convertColorToHex(this.m_chromecolor), this.m_bgopacity);
	return mainDiv;
};
/** @description create CheckBox and map on-change event and return objects. **/
ComboFilter.prototype.createCheckBox = function (value, idValue, index) {
	var temp = this;
	var checkbox = document.createElement("input");
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("class", "multiComboCheckbox cr-checkbox");

	if (this.m_enhanceCheckbox)
	    checkbox.setAttribute("class", "multiComboCheckbox combofiltercheckbox cr-checkbox");

	checkbox.setAttribute("id", "checklist" + this.m_componentid + idValue);
	if (temp.m_selectiontype == "singleselect") {
	    checkbox.style.visibility = "hidden";
	    checkbox.style.display = "none";
	    checkbox.style.width = 0;
	} else
	    checkbox.style.display = "flex";

	checkbox.style.cursor = this.m_cursortype;
	/*checkbox.style.display = "table-cell";*/
	checkbox.style.verticalAlign = "middle";
	checkbox.style.fontSize = 14 * this.minWHRatio() + "px";
	/*checkbox.style.margin = "6px 4px";*/
	checkbox.style.margin = "auto 4px";
	if (this.getSelectedIndex(index)) {
	    $(checkbox).attr("checked", true);
	    this.preSelectedValue.cat = this.displayField[index];
	    this.preSelectedValue.ser = value;
	} else {
	    $(checkbox).attr("checked", false);
	}

	checkbox.onchange = function() {
	    var idValueDiv;
	    temp.m_show = true;
	    if ($(this).is(":checked")) {
	        $(this).attr("checked", true);
	        idValueDiv = this.id.split("checklist" + temp.m_componentid)[1];
	        temp.m_checkboxstatus[idValueDiv] = true;
	        $("#textBox" + temp.m_objectid).val(temp.getEnhancedDisplayValue());
	        $("#itemDiv" + temp.m_componentid + idValueDiv).css("background", convertColorToHex(temp.m_selectioncolor));
	    } else {
	        $(this).attr("checked", false);
	        idValueDiv = this.id.split("checklist" + temp.m_componentid)[1];
	        temp.m_checkboxstatus[idValueDiv] = false;
	        $("#textBox" + temp.m_objectid).val(temp.getEnhancedDisplayValue());
	        if ($("#textBox" + temp.m_objectid).val() == '') {
	            $("#textBox" + temp.m_objectid).val(temp.formattedDescription(temp, temp.m_title.getDescription()));
	        }
	        var filterChipsObj = temp.getFilterChipsComponentObj();
	        var value = idValueDiv.split('-')[0];
	        var value1 = value.replace(/_/g, ' ');
	        value1 = (isNaN(value1)) ? value1 : value1 * 1;
	        if (filterChipsObj != undefined){
	        	var ind = filterChipsObj.m_savedtext.indexOf(value1);
	         	if (ind > -1) {
	         		filterChipsObj.m_savedtext.splice(ind, 1);
	         		filterChipsObj.m_removedChipValue = value;
	         	}
	        }
	       
	        $("#itemDiv" + temp.m_componentid + idValueDiv).css("background", convertColorToHex(temp.m_chromecolor));
	    }
	    var isAllSelected = "";
	    for (var key in temp.m_checkboxstatus) {
	        if (!IsBoolean(temp.m_checkboxstatus[key])) {
	            isAllSelected = false;
	            break;
	        } else {
	            isAllSelected = true;
	        }
	    }
	    var parValues;	
	    var isAllSelected = ""; 	
	    var filterChipsObj = temp.getFilterChipsComponentObj();	
	    	if (filterChipsObj != undefined){
				filterChipsObj.m_removedChipParentValues = [];
			}	
	    if(IsBoolean(temp.m_actionbarenabled)){	
		    for (var key in temp.m_checkboxstatus) {	
		        if (!IsBoolean(temp.m_checkboxstatus[key])) {	
		            isAllSelected = false;	
		            break;	
		        } else {	
		            isAllSelected = true;	
		        }	
		    }	
		}	
		if(filterChipsObj != undefined){	
			for (var key in temp.m_checkboxstatus) {	
			    if (IsBoolean(temp.m_checkboxstatus[key])) {	
					filterChipsObj.m_removedChipParentValues = [];	
			        break;	
			    } else {	
					var value = key.split('-')[0];	
			        filterChipsObj.m_removedChipParentValues.push(value);	
			    }	
			}	
		}
	    if (IsBoolean(isAllSelected)) {
	        //$("#SelectAll" + temp.m_componentid).attr("title", "Remove All");
	        //$("#SelectAll" + temp.m_componentid).removeClass("bd-checkbox");
	        //$("#SelectAll" + temp.m_componentid).addClass("bd-checked");
	        $("#SelectAll" + temp.m_componentid).prop('checked', true);/*DAS-148*/
	    } else if (!IsBoolean(isAllSelected)) {
	        //$("#SelectAll" + temp.m_componentid).attr("title", "Select All");
	        //$("#SelectAll" + temp.m_componentid).addClass("bd-checkbox");
	        //$("#SelectAll" + temp.m_componentid).removeClass("bd-checked");
	        $("#SelectAll" + temp.m_componentid).prop('checked', false);/*DAS-148*/
	    } else {
	        // Do nothing
	    }

	    if (IsBoolean(temp.m_actionbarenabled)) {
	        /** Do nothing, OK button click will take care **/
	    } else {
	        /** Update GV when state of a checkbox has been changed **/
	        temp.m_notifychange = true;
	        temp.handleOnChangeEvent(temp.getValue(), temp.getDisplayValue(), 0);
	        temp.preSelectedValue.cat = temp.getDisplayValue();
	        temp.preSelectedValue.ser = temp.getValue();
	        //$("#AdvanceCheckList" + temp.m_objectid).hide();
	        if (temp.m_enhanceCheckbox == true) {
	            //document.getElementById("textBox"+temp.m_objectid).style.borderBottomLeftRadius="4px";
	            //document.getElementById("arrowBox"+temp.m_objectid).style.borderBottomRightRadius ="4px";

	            //$("span#arrowdownsimpleCombo"+temp.m_objectid+" a ").removeClass('combo-arrow-enhance-open');
	            //$("span#arrowdownsimpleCombo"+temp.m_objectid+" a ").addClass('combo-arrow-enhance');

	            if ($("#textBox" + temp.m_objectid).val() == "")
	                $("#textBox" + temp.m_objectid).val(temp.formattedDescription(temp, temp.m_title.getDescription()));
	        }
	        temp.m_isMultiselectPanelVisible = false;
	    }

	};
	return checkbox;
};

/** @description create Label element and set font property  and return objects. **/
ComboFilter.prototype.createLabel = function (name, value, idValue) {
	var label = document.createElement("label");
	label.style.fontSize = this.m_fontsize * this.minWHRatio() + "px";
	label.style.fontFamily = selectGlobalFont(this.m_fontfamily);
	label.style.fontWeight = this.m_fontweight;
	label.style.fontStyle = this.m_fontstyle;
	label.style.color = convertColorToHex(this.m_fontcolor);
	label.style.cursor = this.m_cursortype;
	label.style.display = "table-cell";
	
	
	
	if (this.m_enhanceCheckbox) {
	    label.setAttribute("class", "enhaceComboLabel");
	    label.style.overflow = "hidden";
	    label.style.whiteSpace = "nowrap";
	    label.style.textOverflow = "ellipsis";
	}
	
	if (this.m_enhanceCheckbox && this.m_selectiontype == "singleselect")
		label.setAttribute("class", "enhaceComboLabelNoMargin");
	
	label.style.verticalAlign = "middle";
	label.style.margin = "6px 4px";
	label.innerHTML = name;
	label.style.width = "100%";
	label.setAttribute("For", "checklist" + this.m_componentid + idValue);	
	return label;
};

/** @description return true if selectedIndex value match to current index value . **/
ComboFilter.prototype.getSelectedIndex = function(index) {
	var flag = false;
	if (Array.isArray(this.m_selectedindex)) {
		var strArr = this.m_selectedindex.map(String);
		var strIndex = index.toString();
		var idx = strArr.indexOf(strIndex);
		flag = (idx > -1) ? true : flag;
	} else {
		flag = (this.m_selectedindex == index) ? true : flag
	}
	return flag;
};

ComboFilter.prototype.getValue = function () {
	var selectedValue = "";
	for (var j = 0; j < this.staticOptsValue.length; j++) {
		if ( IsBoolean(this.m_checkboxstatus[ getStringARSC(this.staticOptsValue[j]) +"-"+ j ]) ){ /*BDD-833, To get the data of same magnitude but different sign(Ex. -1 & 1)*/
			selectedValue += this.staticOptsValue[j] + ",";
		}
	}
	return selectedValue.substring(0, selectedValue.length - 1);
};
ComboFilter.prototype.getDisplayValue = function () {
	var selectedValue = "";
	this.m_selectedindexarray = [];
	for (var j = 0; j < this.staticOptsValue.length; j++) {
		if ( IsBoolean(this.m_checkboxstatus[ getStringARSC(this.staticOptsValue[j]) +"-"+ j ]) ){  /*BDD-833, To get the data of same magnitude but different sign(Ex. -1 & 1)*/
			if(j==0)
				selectedValue += this.displayField[j] + ",";
			else
				selectedValue += ""+this.displayField[j] + ",";
				
			this.m_selectedindexarray.push(j);
		}
	}
	selectedValue=selectedValue.trim();
	/**Added to hide OK button when none of the field is selected*/
	if(IsBoolean(this.m_hideokbutton)){
		if(selectedValue.length > 0){
			$("#OK" + this.m_componentid).css("display", "block");
		}else{
			$("#OK" + this.m_componentid).css("display", "none");
		}
	}
	
	/*
	if(selectedValue.substring(0, selectedValue.length - 1)=="" || selectedValue.substring(0, selectedValue.length - 1)==null)
		selectedValue= this.formattedDescription(this, this.m_title.getDescription())+ ",";
	
	if (IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient)) {
	    return selectedValue.substring(0, selectedValue.length - 1);
	} else {
	    if (IsBoolean(this.m_title.m_showonlytitle)) {

	        return this.formattedDescription(this, this.m_title.getDescription());
	    } else {
	        return selectedValue.substring(0, selectedValue.length - 1);
	    }

	}
	*/
	return selectedValue.substring(0, selectedValue.length - 1);
};
/*CP-689 enhancement*/
ComboFilter.prototype.getEnhancedDisplayValue = function () {
	var selectedValue = "";
	this.m_selectedindexarray = [];
	for (var j = 0; j < this.staticOptsValue.length; j++) {
		if ( IsBoolean(this.m_checkboxstatus[ getStringARSC(this.staticOptsValue[j]) +"-"+ j ]) ){  /*BDD-833, To get the data of same magnitude but different sign(Ex. -1 & 1)*/
			/*CP-689 enhancement*/
			if(j==0)
			selectedValue += this.displayField[j] + ",";
			else
				selectedValue += " "+this.displayField[j] + ",";
				
			this.m_selectedindexarray.push(j);
		}
	}
	selectedValue=selectedValue.trim();
	/**Added to hide OK button when none of the field is selected*/
	if(IsBoolean(this.m_hideokbutton)){
		if(selectedValue.length > 0){
			$("#OK" + this.m_componentid).css("display", "block");
		}else{
			$("#OK" + this.m_componentid).css("display", "none");
		}
	}
	
	/*
	if(selectedValue.substring(0, selectedValue.length - 1)=="" || selectedValue.substring(0, selectedValue.length - 1)==null)
		selectedValue= this.formattedDescription(this, this.m_title.getDescription())+ ",";
	
	if (IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient)) {
	    return selectedValue.substring(0, selectedValue.length - 1);
	} else {
	    if (IsBoolean(this.m_title.m_showonlytitle)) {

	        return this.formattedDescription(this, this.m_title.getDescription());
	    } else {
	        return selectedValue.substring(0, selectedValue.length - 1);
	    }

	}
	*/
	return selectedValue.substring(0, selectedValue.length - 1);
};


/** @description create div element and set property  and return objects. **/
ComboFilter.prototype.createMainDiv = function () {
	var temp = this;
	var mainDiv = document.createElement("div");
	mainDiv.setAttribute("id", "AdvanceCheckList" + this.m_objectid);

	var topmargin = (this.m_y * 1 + this.m_height * 1) + "px";
	if (this.m_enhanceCheckbox == true)
	    var topmargin = (this.m_y * 1 + this.m_height * 1 - this.m_title.m_titlebarheight * 1) + "px";
	
	/*DAS-148*/
	var maxheight = this.m_panelheight;
	if (this.m_actionbarenabled == true && this.m_selectiontype == "multiselect"){
		maxheight = maxheight + this.m_menupanelrowheight +1;
	}
	if (this.m_enhanceCheckbox && this.m_selectiontype == "multiselect"){
		maxheight=maxheight+30;
	}
	
	if (this.m_showsearch)
	    var pheight = maxheight + "px";
	else
	    var pheight = (pheight - 1 * this.m_menupanelrowheight) + "px";

	/*CP-956*/
	$radius = (this.m_enhanceCheckbox == true) ? "0px 0px 4px 4px" : "0";

	$(mainDiv).css({
	    "left": (this.m_x * 1) + "px",
	    "top": topmargin,
	    "height": pheight,
	    "width": this.m_width + "px",
	    "position": "absolute",
	    "z-index": this.m_panelzindex,
	    "display": "none",
	    "overflow": (this.m_actionbarenabled == true) ? "initial" : "hidden",
	    "border-right": "1px solid " + convertColorToHex(this.m_cbbordercolor),
	    "border-left": "1px solid " + convertColorToHex(this.m_cbbordercolor),
	    "border-bottom": "1px solid " + convertColorToHex(this.m_cbbordercolor),
	    //		"background-color": hex2rgb(convertColorToHex(this.m_bgcolor), this.m_bgopacity),
	    "background": hex2rgb(convertColorToHex(this.m_chromecolor), this.m_bgopacity),
	    "border-radius": $radius,
	    "box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0.1)",
	    "-webkit-box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0.1)"
	});
	/*CP 1013*/
	//this.checkWindowResize(mainDiv);
	/*
	$(window).resize(function() {
		
		
		if (IsBoolean(temp.m_isMultiselectPanelVisible)) {
			temp.cancelButtonCB();
			$("#AdvanceCheckList" + temp.m_objectid).hide();
			if (temp.m_enhanceCheckbox == true) {
			    document.getElementById("textBox" + temp.m_objectid).style.borderBottomLeftRadius = "4px";
			    document.getElementById("arrowBox" + temp.m_objectid).style.borderBottomRightRadius = "4px";
			    $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").removeClass('combo-arrow-enhance-open');
			    $("span#arrowdownsimpleCombo" + temp.m_objectid + " a ").addClass('combo-arrow-enhance');
			    $("#draggableDiv" + temp.m_objectId).css({
			        "box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0)",
			        "-webkit-box-shadow": "0px 16px 32px 0px rgba(0, 0, 0, 0)"
			    });
			}
			temp.m_isMultiselectPanelVisible = false;
		}
		
	});
	*/
	return mainDiv;
};

/****************************************************************************************************************/
function DataFields() {
	this.m_displayField = "";
	this.m_value = "";
	this.m_additionFields = "";
	this.m_name = "";
	this.m_displayName = "";
};

/** @description Getter method for FieldDisplayName. **/
DataFields.prototype.getFieldDisplayName = function () {
	return this.m_displayField;
};
/** @description Setter method for FieldDisplayName. **/
DataFields.prototype.setFieldDisplayName = function (displayField) {
	this.m_displayField = displayField;
};
/** @description Getter method for Value. **/
DataFields.prototype.getValue = function () {
	return this.m_value;
};
/** @description Setter method for Value. **/
DataFields.prototype.setValue = function (value) {
	this.m_value = value;
};
/** @description Setter method for AdditionFields. **/
DataFields.prototype.setAdditionFields = function (additionFields) {
	this.m_additionFields = additionFields;
};
/** @description Getter method for AdditionFields. **/
DataFields.prototype.getAdditionFields = function () {
	return this.m_additionFields;
};
/** @description Setter method for Name. **/
DataFields.prototype.setName = function (name) {
	this.m_name = name;
};
/** @description Getter method for Name. **/
DataFields.prototype.getName = function () {
	return this.m_name;
};
/** @description Setter method for DisplayName. **/
DataFields.prototype.setDisplayName = function (displayName) {
	this.m_displayName = displayName;
};
/** @description Getter method for DisplayName. **/
DataFields.prototype.getDisplayName = function () {
	return this.m_displayName;
};
//# sourceURL=ComboFilter.js
