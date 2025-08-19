/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: MultiSelectComboFilter.js
 * @description MultiSelectCombo filter
 **/
function MultiSelectComboFilter(m_chartContainer, m_zIndex) {
	this.base = Filter;
	this.base();
	this.selvalue = "";
	this.m_panelId = "";
	this.m_values = [];

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
};

MultiSelectComboFilter.prototype = new Filter;

MultiSelectComboFilter.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};
MultiSelectComboFilter.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "simpleCombo" + this.m_objectid;
};

MultiSelectComboFilter.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

MultiSelectComboFilter.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	this.componentJson = jsonObject;
	this.m_values = [];
	for (var key in jsonObject) {
		if (key == "Filter") {
			for (var filterkey in jsonObject[key]) {
				switch (filterkey) {
				case "DataSet":
					this.m_isDataSetavailable = true;
					break;
				case "Values":
					for (var i = 0; i < jsonObject[key][filterkey].length; i++) {
						var values = new Values();
						values.setLabel(this.getProperAttributeNameValue(jsonObject[key][filterkey][i], "label"));
						values.setValue(this.getProperAttributeNameValue(jsonObject[key][filterkey][i], "value"));
						this.m_values.push(values);
					}
					break;
				default:
					var propertyName = this.getNodeAttributeName(filterkey);
					nodeObject[propertyName] = jsonObject[key][filterkey];
					break;
				}
			}
		} else {
			var propertyName = this.getNodeAttributeName(key);
			nodeObject[propertyName] = jsonObject[key];
		}
	}
};

MultiSelectComboFilter.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas(this.m_chartContainer, this.m_zIndex);
};

MultiSelectComboFilter.prototype.setFields = function (fieldsJson) {
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
			var m_categoryName = this.getProperAttributeNameValue(fieldsJson[i], "DisplayField");
			var m_seriesName = this.getProperAttributeNameValue(fieldsJson[i], "Value");
			var m_additionalFields = this.getProperAttributeNameValue(fieldsJson[i], "additionalFields");
		}
	} else {
		// from designer
		for (var i = 0; i < fieldsJson.length; i++) {
			switch (fieldsJson[i].Type) {
			case "Value":
				var m_seriesName = fieldsJson[i].Name;
				break;
			case "DisplayField":
				var m_categoryName = fieldsJson[i].Name;
				break;
			case "additionalFields":
				var m_additionalFields = fieldsJson[i].Name;
				break;
			}
		}
	}
	this.setCategoryNames(m_categoryName);
	this.setSeriesNames(m_seriesName, m_additionalFields);
};

MultiSelectComboFilter.prototype.setCategoryNames = function (category) {

	this.m_categoryName = [];
	if (category != "" && category != undefined)
		this.m_categoryName[0] = category;
};

MultiSelectComboFilter.prototype.setSeriesNames = function (series, additionalFieldsName) {
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

MultiSelectComboFilter.prototype.getCategoryNames = function () {
	return this.m_categoryName;
};

MultiSelectComboFilter.prototype.getSeriesNames = function () {
	return this.m_seriesName;
};

MultiSelectComboFilter.prototype.drawObject = function () {
	this.init();
	if (IsBoolean(this.m_isActive)){
		this.drawChart();
	}
};

MultiSelectComboFilter.prototype.init = function () {
	//this.m_componentid = "multiselect"+this.m_objectid;

	if (!IsBoolean(this.m_isDataSetavailable))
		this.setData();
	else {
		this.setCategoryData(this.getCategoryforDataSet());
		this.setSeriesData(this.getSeriesforDataSet());
	}

	if (IsBoolean(this.m_isDataSetavailable)) {
		if (this.getSeriesNames().length != 0 && this.getCategoryNames().length != 0) {
			this.setUniqueData();
		}
	} else {
		this.value = this.m_seriesData;
		this.displayField = this.m_categoryData;
	}
};

MultiSelectComboFilter.prototype.setUniqueData = function () {
	this.value = [];
	this.displayField = [];

	var uniqueSeriesData = [];
	var uniqueCategoryData = [];
	for (var i = 0; i < this.m_seriesData.length; i++) {
		var exist = false;
		for (var j = 0; j < this.value.length; j++) {
			// there will be only one value field , so we can directly use index:zero
			if (this.value[j] == this.m_seriesData[i][0]) {
				exist = true;
				break;
			}
		}
		if (!exist) {
			this.value.push(this.m_seriesData[i][0]);
			this.displayField.push(this.m_categoryData[i][0]);

			uniqueCategoryData.push(this.m_categoryData[i]);
			uniqueSeriesData.push(this.m_seriesData[i]);
		}
	}

	this.m_categoryData = uniqueCategoryData;
	this.m_seriesData = uniqueSeriesData;
};

MultiSelectComboFilter.prototype.getCategoryforDataSet = function () {
	this.m_categoryData = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}

	this.m_categoryData = convertArrayType(this.m_categoryData);
	return this.m_categoryData;
};

MultiSelectComboFilter.prototype.getSeriesforDataSet = function () {
	this.m_seriesData = [];
	for (var i = 0; i < this.getSeriesNames().length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);

	}
	this.m_seriesData = convertArrayType(this.m_seriesData);
	return this.m_seriesData;

};

MultiSelectComboFilter.prototype.drawChart = function () {
	var temp = this;

	$("#" + temp.m_componentid).remove();
	var simpleComboDivisionObject = this.createSimpleComboDivision();
	var dropDownObject = this.createDropDown(simpleComboDivisionObject);
	var selectedOptionText = this.createOption(dropDownObject);

	//var footerDivisionObject = this.createFooterDivision();

	//this.handleOnChangeEvent(dropDownObject.value,true);
	//this.setColor();
	var temp = this;

	jqEasyUI("#selectBoxId" + temp.m_objectid).combobox({
		required : true,
		editable : false,
		valueField : "value",
		multiple : true,
		panelHeight : "auto",
		//footer:"#footer"+temp.m_objectid],
		//tools:"#footer"+temp.m_objectid],
		onSelect : function (record) {
			var text = jqEasyUI("#selectBoxId" + temp.m_objectid).find("combo-text").val();

			temp.selectColor();
		},
		onUnselect : function (record) {

			temp.unselectColor();
		},

		onHidePanel : function () {
			temp.panelOpen = false;
		},
		onShowPanel : function () {
			temp.panelOpen = true;
			temp.selectColor();
		}
	});
	this.openPanelOnClickOfTextBox();
	this.getComboPanelId();
	this.createActionIcons();
	temp.setCss();
	temp.setSelectedOptionText(selectedOptionText);
};

MultiSelectComboFilter.prototype.createSimpleComboDivision = function () {
	//creating a div in which we are adding select box
	var temp = this;
	var simpleComboDivisionObject = document.createElement("div");
	simpleComboDivisionObject.setAttribute("id", this.m_componentid);
	simpleComboDivisionObject.style.display = "block";
	simpleComboDivisionObject.style.position = "absolute";
	simpleComboDivisionObject.style.height = this.m_height + "px";
	$("#draggableDiv" + temp.m_objectid).append(simpleComboDivisionObject);
	return simpleComboDivisionObject;
};

MultiSelectComboFilter.prototype.createDropDown = function (simpleComboDivisionObject) {
	var temp = this;
	var dropDownObject = document.createElement("SELECT");
	dropDownObject.id = "selectBoxId" + this.m_objectid;
	dropDownObject.style.color = convertColorToHex(this.m_fontcolor);
	dropDownObject.style.border = "1px solid #c2c2c2";

	var width = (this.m_width > 200) ? 200 : this.m_width;
	dropDownObject.style.width = width + "px";

	dropDownObject.style.height = this.m_height + "px";
	this.setOptionFontProperty(dropDownObject);
	dropDownObject.onchange = function () {
		temp.handleOnChangeEvent(this.value, this.options[this.selectedIndex].text, this.selectedIndex);
	}
	simpleComboDivisionObject.appendChild(dropDownObject);
	return dropDownObject;
};

MultiSelectComboFilter.prototype.createOption = function (dropDownObject) {
	var temp = this;
	var selectedOptionText = "Choose";
	for (var i = 0; i < this.value.length; i++) {
		var op = document.createElement("option");
		op.value = this.value[i];
		op.text = this.displayField[i];
		op.selectedIndex = i;
		dropDownObject.appendChild(op);
		if (this.m_selectedindex == "" || this.m_selectedindex < 0) {
			dropDownObject.selectedIndex = -1;
		} else if (i == this.m_selectedindex) {
			op.selected = "true";
			dropDownObject.selectedIndex = this.m_selectedindex;
			selectedOptionText = this.displayField[i];
		}
	}
	return selectedOptionText;
};

MultiSelectComboFilter.prototype.setOptionFontProperty = function (op) {
	op.style.fontFamily = selectGlobalFont(this.m_fontfamily);
	op.style.fontStyle = this.m_fontstyle;
	op.style.fontSize = this.fontScaling(this.m_fontsize) + "px";
	op.style.fontWeight = this.m_fontweight;
};

MultiSelectComboFilter.prototype.openPanelOnClickOfTextBox = function () {
	var temp = this;
	temp.panelOpen = false;
	$("#" + temp.m_componentid).find("input.combo-text").on("click", function () {
		if (temp.panelOpen) {
			temp.panelOpen = false;
			jqEasyUI("#selectBoxId" + temp.m_objectid).combobox("hidePanel");
		} else {
			temp.panelOpen = true;
			jqEasyUI("#selectBoxId" + temp.m_objectid).combobox("showPanel");
		}
	});
};

MultiSelectComboFilter.prototype.getComboPanelId = function () {
	var divOBJs = $(".combo-panel");

	if (this.m_panelId == "") {
		var divOBJs = document.getElementsByClassName("combo-panel");
		for (var i = 0; i < divOBJs.length; i++) {
			divOBJs[i].id = "combotreeDiv" + i;
		}
		this.m_panelId = i - 1;
	}
};

MultiSelectComboFilter.prototype.createActionIcons = function () {
	var temp = this;
	var div = "<div style='position:absolute;top:0px;width:100%;height:24px;background:#ffffff;'><input id=\"OK" + temp.m_componentid + "\" type='button'value='' style='float:left;width:25px;height:100%;background:url(images/OK.png);background-repeat:no-repeat;'><input type='button'value='' id=\"Cancel" + temp.m_componentid + "\" style='float:left;width:25px;height:100%;background:url(images/Cancel.png);background-repeat:no-repeat;'>";
	$("#combotreeDiv" + temp.m_panelId).append(div);

	$("#OK" + temp.m_componentid).on("click", function () {
		var values;
		var texts;
		var opts = jqEasyUI("#selectBoxId" + temp.m_objectid).combobox("options");
		if (opts.multiple) {
			values = jqEasyUI("#selectBoxId" + temp.m_objectid).combobox("getValues").join(opts.separator);
			texts = jqEasyUI("#selectBoxId" + temp.m_objectid).combobox("getText");
		} else {
			values = jqEasyUI("#selectBoxId" + temp.m_objectid).combobox("getValue");
		}
		temp.handleOnChangeEvent(values, texts, true);
		temp.setSelectedOptionText(texts);

		temp.panelOpen = false;
		jqEasyUI("#selectBoxId" + temp.m_objectid).combobox("hidePanel");
	});
	$("#Cancel" + temp.m_componentid).on("click", function () {
		temp.panelOpen = false;
		jqEasyUI("#selectBoxId" + temp.m_objectid).combobox("hidePanel");
	});
};

MultiSelectComboFilter.prototype.setCss = function () {
	var temp = this;

	$("#simpleCombo" + this.m_objectid).find(".combo-arrow").css("background-color", convertColorToHex(this.m_chromecolor));

	$("#combotreeDiv" + temp.m_panelId).find(".combobox-item:first").css("padding-top", "25px");

	$("#combotreeDiv" + temp.m_panelId).find(".combobox-item").css("font-size", temp.fontScaling(temp.m_fontsize) + "px");
	$("#combotreeDiv" + temp.m_panelId).find(".combobox-item").css("color", convertColorToHex(this.m_fontcolor));
	$("#combotreeDiv" + temp.m_panelId).find(".combobox-item").css("font-family", selectGlobalFont(temp.m_fontfamily));
	$("#combotreeDiv" + temp.m_panelId).find(".combobox-item").css("font-weight", temp.m_fontweight);
	$("#combotreeDiv" + temp.m_panelId).find(".combobox-item").css("font-style", temp.m_fontstyle);

	$("#simpleCombo" + this.m_objectid).find(".combo-text").css("font-size", temp.fontScaling(temp.m_fontsize) + "px");
	$("#simpleCombo" + this.m_objectid).find(".combo-text").css("vertical-align", "top");
	$("#simpleCombo" + this.m_objectid).find(".combo-text").css("text-align", "left");
	$("#simpleCombo" + this.m_objectid).find(".combo-text").css("color", convertColorToHex(this.m_fontcolor));
	$("#simpleCombo" + this.m_objectid).find(".combo-text").css("font-family", selectGlobalFont(temp.m_fontfamily));
	$("#simpleCombo" + this.m_objectid).find(".combo-text").css("font-weight", temp.m_fontweight);
	$("#simpleCombo" + this.m_objectid).find(".combo-text").css("font-style", temp.m_fontstyle);
	$("#simpleCombo" + this.m_objectid).find(".combo-text").css("margin-top", "-1px");
};

MultiSelectComboFilter.prototype.setSelectedOptionText = function (selectedOptionText) {
	var temp = this;
	if (selectedOptionText == "")
		selectedOptionText = "Choose";
	$("#simpleCombo" + temp.m_objectid).find(".combo .combo-text").val(selectedOptionText);
};

MultiSelectComboFilter.prototype.selectColor = function () {

	var selectionColor = convertColorToHex(this.m_selectioncolor);
	$("div").children("div.combo-panel").find(".combobox-item-selected").css({
		"background-color" : selectionColor
	});
};

MultiSelectComboFilter.prototype.unselectColor = function () {

	$("div").children("div.combo-panel").find(".combobox-item-hover").css({
		"background-color" : "white"
	});
};

MultiSelectComboFilter.prototype.handleOnChangeEvent = function (optionValue, optionText, selectedIndex) {
	var temp = this;
	var fieldName = (temp.getFieldName() == "" || temp.getFieldName() == undefined) ? "Value" : temp.getFieldName();
	var fieldNameValueMap = {};
	if (IsBoolean(temp.m_isDataSetavailable)) {
		for (var i = 0; i < temp.m_seriesData[0].length; i++) {
			fieldNameValueMap[temp.getSeriesNames()[i]] = temp.m_seriesData[selectedIndex][i];
		}
		fieldNameValueMap[this.getSeriesNames()] = optionValue;
		fieldNameValueMap[fieldName] = optionValue;
		fieldNameValueMap[this.getCategoryNames()] = optionText;
	} else {
		fieldNameValueMap[fieldName] = ("" + optionValue).replace(/^ +/gm, "");
	}

	if (this.componentJson.variable != undefined)
		for (var i = 0; i < this.componentJson.variable.DefaultValues.DefaultValue.length; i++) {
			fieldNameValueMap[this.componentJson.variable.DefaultValues.DefaultValue[i].name] = ("" + optionValue).replace(/^ +/gm, "");
		}
	temp.updateDataPoints(fieldNameValueMap);
};
//# sourceURL=MultiSelectComboFilter.js