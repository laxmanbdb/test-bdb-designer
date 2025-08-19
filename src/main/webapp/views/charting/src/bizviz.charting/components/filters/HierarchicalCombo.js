/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: HierarchicalCombo.js
 * @description Hierarchical filter
 **/
function HierarchicalCombo(m_chartContainer, m_zIndex) {
	this.base = Filter;
	this.base();

	this.m_x = 450;
	this.m_y = 30;
	this.m_width = 100;
	this.m_height = 30;
	
	this.m_hierDropDownWidth = 10;
	this.m_hierDropDownHeight = 120;
	this.m_HierTabLeftMargin = 50;
	this.m_HierTabTopMargin = 60;
	this.m_roots = [];
	this.m_chipRemoved = false;

	var DragDivmargin = 2;
	this.m_dragDivToFilterMargin = DragDivmargin * DragDivmargin;
	this.m_controlleddrill = false;

	this.finalArray = [{
			"id" : 1,
			"name" : "City",
			"parentId" : 0
		}, {
			"id" : 11,
			"name" : "Albin",
			"parentId" : 1
		}, {
			"id" : 112,
			"name" : "Albin1",
			"parentId" : 11
		}
	];
	this.m_objectID = [];
	this.m_componentid = "";
	this.mapToPutInArray = {};
	this.cid = 0;
	this.m_root;
	this.m_nodeArr = [];
	this.selectedRecordArray = [];
	this.m_panelId = "";
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;

	this.m_hierarchytype = [];
	this.m_visible = [];
	this.m_displayname = [];
	this.m_name = [];
	this.m_fieldaggregation = [];
	this.m_currentIndexSelect = "";
	this.m_previousIndexSelect = "";
	this.updateflag = false;
	this.onExpandflag = false;
	this.onCollapseflag = false;
	this.m_categoryName = [];
	this.m_seriesName = [];
	this.m_menupanelfontcolor = "";
	this.m_menupanelfontsize = "12";
	this.m_menupanelrowheight = 30;
	this.m_textboxmargin = 2;
	this.m_cursortype = "pointer";
	this.m_bordercolor = "#d3d3d3";
	this.m_chromecolorpanel = "";
	this.m_panelborderradius = "";
	/**Added to update the filter UI*/
	this.m_advancetheme = "default";
	this.m_advanceproperties = {"borderColor" : "", "iconColor" : "", "borderRadius" : "","rightActionIconPadding" : "", "rightIconPadding" : "", "borderWidth" : "","showParentCheckbox":"true"};
	this.m_advancehighlighter={"borderColor" : "#808080", "borderWidth" : "3","borderStyle":"solid"};
	/**Added to update "Show Selection Limit" box UI*/
	this.m_showselectionlimitui = {"borderColor" : "","borderRadius" : "", "borderWidth" : "", "width":""};
	/**Added to show the OK icon on selection limit reach*/
	this.m_showonselectionlimit = false;
	/**Added for child element properties*/
	this.m_childnodeproperties = {"backgroundColor" : "", "fontColor" : "", "selectionColor" : "", "selectionFontColor" : "", "rolloverColor" : "", "rolloverFontColor" : ""};
	/**Added for expand collapse font icons size*/
	this.m_expandiconsize = 10;
};

/** @description Making prototype of Filter class to inherit its properties and methods into HierarchicalCombo filter **/
HierarchicalCombo.prototype = new Filter;

/** @description This method will parse the chart JSON and create a container **/
HierarchicalCombo.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};
/** @description Getter Method of DataProvider **/
HierarchicalCombo.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
HierarchicalCombo.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "Filter") {
			for (var filterKey in jsonObject[key]) {
				switch (filterKey) {
				case "DataSet":
					break;
				default:
					var propertyName = this.getNodeAttributeName(filterKey);
					nodeObject[propertyName] = jsonObject[key][filterKey];
					break;
				}
			}
		} else {
			var propertyName = this.getNodeAttributeName(key);
			nodeObject[propertyName] = jsonObject[key];
		}
	}
};

/** @description remove already present div of component and create new div , associate the properties and events **/
HierarchicalCombo.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas(this.m_chartContainer, this.m_zIndex);
};

/** @description  Will create an id for component to be used for dashboard operation management**/
HierarchicalCombo.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "ComboTree" + this.m_objectid;
};

/** @description Setter Method of Fields **/
HierarchicalCombo.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	this.m_fields = [];
	this.m_fieldDisplayName = [];
	this.m_Value = [];
	this.m_additionalFields = [];

	var m_categoryName = "";
	var m_seriesName = "";
	var m_additionalFields = "";

	this.m_hierarchytype = [];
	this.m_visible = [];
	this.m_displayname = [];
	this.m_name = [];
	this.m_namebyhierarchyType = {};
	for (var i = 0; i < fieldsJson.length; i++) {
		this.m_name[i] = this.getProperAttributeNameValue(fieldsJson[i], "Name");
		this.m_hierarchytype[i] = this.getProperAttributeNameValue(fieldsJson[i], "hierarchyType");
		this.m_displayname[i] = this.getProperAttributeNameValue(fieldsJson[i], "DisplayName");
		this.m_visible[i] = this.getProperAttributeNameValue(fieldsJson[i], "visible");
		this.m_namebyhierarchyType[this.m_hierarchytype[i]] = this.m_name[i];
		this.m_fieldaggregation[i] = this.getProperAttributeNameValue(fieldsJson[i], "parentAggregation");
	}
	this.setCategoryNames(fieldsJson);
	this.setSeriesNames(fieldsJson);
	this.setFieldsByNames(fieldsJson);
	this.setNoneFieldsByNames(fieldsJson);
	this.setCss();
};

/** @description Setter Method of CategoryNames  **/
HierarchicalCombo.prototype.setCategoryNames = function (fieldsJson) {
	this.m_categoryName = [];
	for (var i = 0; i < fieldsJson.length; i++) {
		if (this.getProperAttributeNameValue(fieldsJson[i], "Name") == "")
			this.m_categoryName[i] = this.getProperAttributeNameValue(fieldsJson[i], "Value");
		else
			this.m_categoryName[i] = this.getProperAttributeNameValue(fieldsJson[i], "Name");
	}
};

/** @description Setter Method of SeriesNames  **/
HierarchicalCombo.prototype.setSeriesNames = function (fieldsJson) {
	this.m_seriesName = [];
	for (var i = 0; i < fieldsJson.length; i++) {
		if (this.getProperAttributeNameValue(fieldsJson[i], "DisplayName") == "")
			this.m_seriesName[i] = this.getProperAttributeNameValue(fieldsJson[i], "DisplayField");
		else
			this.m_seriesName[i] = this.getProperAttributeNameValue(fieldsJson[i], "DisplayName");
	}
};

/** @description Setter Method of FieldsByNames  **/
HierarchicalCombo.prototype.setFieldsByNames = function (fieldsJson) {
	this.m_fieldByName = [];
	for (var i = 0; i < fieldsJson.length; i++) {
		var hType = this.getProperAttributeNameValue(fieldsJson[i], "hierarchyType");
		if (hType == "parent" || hType == "child")
			this.m_fieldByName.push(this.getProperAttributeNameValue(fieldsJson[i], "Name"));
	}
};

/** @description Setter Method of NoneFieldsByNames   **/
HierarchicalCombo.prototype.setNoneFieldsByNames = function (fieldsJson) {
	this.m_noneFieldByName = [];
	for (var i = 0; i < fieldsJson.length; i++) {
		var hType = this.getProperAttributeNameValue(fieldsJson[i], "hierarchyType");
		if (hType == "none")
			this.m_noneFieldByName.push(this.getProperAttributeNameValue(fieldsJson[i], "Name"));
	}
};
/** @description Setter Method of Update CSS for old Dashboard**/
HierarchicalCombo.prototype.setCss = function (){
	this.m_chromecolorpanel = ((this.m_chromecolorpanel !== undefined)&& (this.m_chromecolorpanel !== ""))  ? this.m_chromecolorpanel :  this.m_chromecolor;
	this.m_panelborderradius = (this.m_panelborderradius !== undefined) ? this.m_panelborderradius : this.m_filterborderradius;
	this.m_advancetheme = (this.m_advancetheme !== undefined) ? this.m_advancetheme : "default";
	this.m_menupanelfontcolor = ((this.m_menupanelfontcolor !== undefined)&&(this.m_menupanelfontcolor !== "")) ? this.m_menupanelfontcolor : this.m_fontcolor;

}

/** @description Getter Method of SeriesNames   **/
HierarchicalCombo.prototype.getSeriesNames = function () {
	return this.m_seriesName;
};

/** @description Getter Method of CategoryNames   **/
HierarchicalCombo.prototype.getCategoryNames = function () {
	return this.m_categoryName;
};

/** @description Getter Method of FieldsByNames   **/
HierarchicalCombo.prototype.getFieldsByNames = function () {
	return this.m_fieldByName;
};

/** @description Getter Method of NoneFieldsByNames   **/
HierarchicalCombo.prototype.getNoneFieldsByNames = function () {
	return this.m_noneFieldByName;
};

HierarchicalCombo.prototype.drawObject = function () {
	if( this.m_isDataSetavailable || IsBoolean(this.m_designMode)){
		if (this.getDataProvider()) {
			this.init();
			/*DAS-303*/
			if(this.m_seriesData.length > 0){
				this.drawChart();
			}else{
				this.drawMessage("No Field Available");
			}
			
		}else{
			this.drawMessage(this.m_status.noData);
		}
	}else{
		this.drawMessage(this.m_status.noDataset);
	}
};

/** @description Initialize HierarchicalCombo. **/
HierarchicalCombo.prototype.init = function () {
	this.setCategoryData();
	this.setSeriesData();

	if (this.m_hierarchylevel == "Multiple" || this.m_hierarchylevel == "Single" || this.m_hierarchylevel == "single" || this.m_hierarchylevel == "") {
		this.globalArray = [];
		this.finalArray = [];
		this.m_roots = [];
		this.m_roots = this.getDataProvider();
	} else {
		this.m_categoryData = this.getCategoryData();
		this.m_seriesData = this.getSeriesData();
		this.m_root = this.createTree();
		if (this.m_root) {
			this.m_root.createChild(this.m_nodeArr);
		}
	}
};

/** @description check data is valid or not if not valid then show message like " invalid Data ". **/
HierarchicalCombo.prototype.isProperData = function () {
	if(this.m_hierarchylevel == "Single" && !IsBoolean(this.m_designMode)){
		if(this.getDataProvider().length == 0){
			return {status:false, msg:this.m_status.noData};
		}else{
			for (var i = 0; i < this.m_roots.length; i++) {
				for (var j = 0; j < this.m_name.length; j++) {
					if(this.m_name[j] == this.m_namebyhierarchyType["parent"] || this.m_name[j] == this.m_namebyhierarchyType["child"]){
						if(isNaN(this.m_roots[i][this.m_name[j]]) || this.m_roots[i][this.m_name[j]]===""){
							return {status:false,msg:"Invalid Data!"};
						}
					}
				}
			}
			return {status:true,msg:"OK"};
		}
	}
	else if(this.getDataProvider().length == 0){
		return {status:false, msg:this.m_status.noData};
	}else{
		return {status:true,msg:"OK"};
	}
};

/** @description Drawing of component started by drawing different parts of component like SelectBox,options. **/
HierarchicalCombo.prototype.drawChart = function () {
	var temp = this;
	if(!this.isProperData().status){
		$("#ComboTree"+temp.m_objectid).remove();
		this.drawMessage(this.isProperData().msg);
		return;
	} else {
		this.removeMessage();
	}
	this.selectdiv = this.createSelectBoxDivision();
	this.createSelectBox(this.selectdiv);
	
	if (this.m_hierarchylevel == "Multiple") {
		this.drawMultiHierarchyComboTree();
	} 
	else if (this.m_hierarchylevel == "Single" || this.m_hierarchylevel == "single") {
			this.drawSingleHierarchyComboTree();
	} else {
		this.drawComboTree();
	}

	try {
		if (!IsBoolean(this.m_allowmultipleselection)) {
			this.initJeasyUISingleSelectComboTree();
		} else {
			this.initJeasyUIMultiSelectComboTree();
		}
		this.openPanelOnClickOfTextBox();
		this.setDefaultValueToShowInComboTree();
		this.setComboPanelId();
		this.createActionIcons();
		this.setHierComboCSS();
	} catch (err) {
		console.log("error in drawing with jeasyui");
	}
};

/** @description Setter Method for set SeriesData. **/
HierarchicalCombo.prototype.setSeriesData = function () {
	this.m_seriesData = [];
	for (var i = 0; i < this.getSeriesNames().length; i++) {
		this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
	}
};

/** @description Getter Method of SeriesData. **/
HierarchicalCombo.prototype.getSeriesData = function () {
	return this.m_seriesData;
};

/** @description Setter Method for set CategoryData . **/
HierarchicalCombo.prototype.setCategoryData = function () {
	this.m_categoryData = [];
	for (var i = 0; i < this.getCategoryNames().length; i++) {
		this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
	}
};

/** @description Getter Method of set CategoryData . **/
HierarchicalCombo.prototype.getCategoryData = function () {
	return this.m_categoryData;
};

/** @description create Div for contains  the SelectBox . **/
HierarchicalCombo.prototype.createSelectBoxDivision = function () {
	var temp = this;
	$("#" + temp.m_componentid).remove();
	var div = document.createElement("div");
	div.setAttribute("id", this.m_componentid);
	div.style.display = "block";
	div.style.position = "absolute";
	div.style.height = this.m_height - this.m_textboxmargin * 2 + "px";
	div.style.width = this.m_width - this.m_textboxmargin * 2 + "px";
	div.style.margin = this.m_textboxmargin + "px";
	$("#draggableDiv" + temp.m_objectid).append(div);
	return div;
};
/** @description create SelectBox and append into SelectBoxDiv. **/
HierarchicalCombo.prototype.createSelectBox = function (selectBoxDiv) {
	var temp = this;
	$("#ComboTree" + temp.m_componentid).remove();
	var dropDownObject = document.createElement("input");
	dropDownObject.id = "ComboTree" + this.m_componentid;
	dropDownObject.style.width = 1 * (this.m_width) - this.m_textboxmargin * 2 + "px";
	dropDownObject.style.height = 1 * (this.m_height) - this.m_textboxmargin * 2 + "px";
	dropDownObject.style.font = this.m_fontstyle + " " + this.m_fontweight + " " + this.fontScaling(this.m_fontsize) + "px " + selectGlobalFont(this.m_fontfamily);
	selectBoxDiv.appendChild(dropDownObject);
};

/** @description manage Data in "this.finalArray" according to name,id,parentId,and noneField. if hierachylevel is multiple **/
HierarchicalCombo.prototype.drawMultiHierarchyComboTree = function () {
	if (this.m_roots != undefined && this.m_hierarchylevel == "Multiple") {
		var columnNames = this.getFieldsByNames();
		var columnCount = 0;
		var arrangedMap = new Object();
		arrangedMap["NoneFields"] = new Object();
		for (var rowcount = 0; rowcount < this.m_roots.length; rowcount++) // Number of Records
		{
			this.arrangeDataIntoMap(this.m_roots, arrangedMap, rowcount, columnNames, columnCount);
		}

		var pid = 0;
		this.cid = 0;
		this.convertInArray(arrangedMap, pid);
		for (var k = 0; k < this.globalArray.length; k++) {
			this.mapToPutInArray = {};
			this.mapToPutInArray["name"] = this.globalArray[k][0];
			this.mapToPutInArray["id"] = this.globalArray[k][1];
			this.mapToPutInArray["parentId"] = this.globalArray[k][2];
			this.mapToPutInArray["NoneFields"] = this.globalArray[k][3];
			this.finalArray.push(this.mapToPutInArray);
		}
	}
};

/** @description arrange data Data into map. **/
HierarchicalCombo.prototype.arrangeDataIntoMap = function (originalData, arrangedMap, rowcount, columnNames, columnCount) {
	if (columnCount < columnNames.length) {
		var columnNameData = originalData[rowcount][columnNames[columnCount]];
		if (arrangedMap[columnNameData] == undefined) {
			arrangedMap[columnNameData] = new Object();
			arrangedMap[columnNameData]["NoneFields"] = {};
			for (var i = 0; i < this.getNoneFieldsByNames().length; i++) {
				arrangedMap[columnNameData]["NoneFields"][this.getNoneFieldsByNames()[i]] = originalData[rowcount][this.getNoneFieldsByNames()[i]];
			}
		} else {
			// Add remaining None Fields data
			for (var i = 0; i < this.getNoneFieldsByNames().length; i++) {
				arrangedMap[columnNameData]["NoneFields"][this.getNoneFieldsByNames()[i]] += "~" + originalData[rowcount][this.getNoneFieldsByNames()[i]];
			}
		}
		columnCount++;
		var flag = this.arrangeDataIntoMap(originalData, arrangedMap[columnNameData], rowcount, columnNames, columnCount);
		if (!flag) {
			return false;
		}
	} else {
		// Add remaining None Fields data
		// 		arrangedMap["NoneFields"] = {};
		// 		for(var i=0 ; i<this.getNoneFieldsByNames().length ; i++){
		// 			arrangedMap["NoneFields"][this.getNoneFieldsByNames()[i]] = originalData[rowcount][this.getNoneFieldsByNames()[i]];
		// 		}
	}
};

/** @description onvertInArray. if non "NoneFields" **/
HierarchicalCombo.prototype.convertInArray = function (arrangedMap, pid) {
	for (var key in arrangedMap) {
		if (key != "NoneFields") {
			var childmap = arrangedMap[key];
			this.cid++;
			var childArray = [key, this.cid, pid, arrangedMap[key]["NoneFields"]];
			this.globalArray.push(childArray);
			this.convertInArray(childmap, this.cid);
		}
	}
};

/** @description will draw SingleLevel HierarchyComboTree.iterate for all root and push data in "this.finalArray". **/
HierarchicalCombo.prototype.drawSingleHierarchyComboTree = function () {
	var temp = this;
	this.finalArray = [];
	for (var i = 0; i < this.m_roots.length; i++) {
		var newMap = {};
		for (var j = 0; j < this.m_name.length; j++) {
			if (this.m_roots[i][this.m_namebyhierarchyType["parent"]] == this.m_roots[i][this.m_namebyhierarchyType["child"]]) {
				this.m_roots[i]["parentid"] = 0;
			}
			if (this.m_name[j] == this.m_namebyhierarchyType["parent"]) {
				newMap["parentId"] = {};
				newMap["parentId"] = this.m_roots[i][this.m_name[j]];
			} else if (this.m_name[j] == this.m_namebyhierarchyType["child"]) {
				newMap["id"] = {};
				newMap["id"] = this.m_roots[i][this.m_name[j]];
			} else {
				newMap["name"] = {};
				newMap["name"] = this.m_roots[i][this.m_name[j]];
			}
		}
		this.finalArray.push(newMap);
	}
};
/** @description will draw SingleLevel HierarchyComboTree.iterate for all root and push data in "this.finalArray". **/
HierarchicalCombo.prototype.drawComboTree = function () {
	var whiteDivisionObject = this.getWhiteDivision(); //division in which ul,li,span's division are appended
	if (this.m_root) {
		this.createUlLiSpanDivision(whiteDivisionObject);
	}
	this.createDropDownDivision(); //a division in which "select" and "V" button are appended.
};

/** @description initialize and set properties for SingleSelect ComboTree. **/
HierarchicalCombo.prototype.initJeasyUISingleSelectComboTree = function () {
	var temp = this;
	jqEasyUI("#ComboTree" + temp.m_componentid).combotree({
		data : this.finalArray,
		state : closed,
		loadFilter : function (rows) {
			return convert(rows);
		},
		advanceTheme : temp.m_advancetheme,
		onClick : function (node) {
			temp.setPanelExpandCollapse(node);
			jqEasyUI("#ComboTree" + temp.m_componentid).combotree("showPanel");
			temp.setPanelScroll();
			jqEasyUI("#ComboTree" + temp.m_componentid).combotree("setValue", node.id);
			temp.m_currentIndexSelect = $("#ComboTree" + temp.m_componentid).combotree("getValue");
		},
		onShowPanel : function () {
			$("#SearchTextBox"+ temp.m_componentid).val("");
			$( "#combotreeDiv"+temp.m_panelId+" .tree-node" ).show();
			temp.setHierComboCSS();
		},
		onHidePanel : function () {
			if (IsBoolean(temp.updateflag)) {
				temp.updateflag = false;
			} else {
				if (temp.m_previousIndexSelect != "") {
					jqEasyUI("#ComboTree" + temp.m_componentid).combotree("clear");
					jqEasyUI("#ComboTree" + temp.m_componentid).combotree("setValue", temp.m_previousIndexSelect);
				}
			}
			temp.setHierComboCSS();
		}
	});
};

/** @description initialize and set properties for MultiSelect ComboTree. **/
HierarchicalCombo.prototype.initJeasyUIMultiSelectComboTree = function () {
	var temp = this;
	jqEasyUI("#ComboTree" + temp.m_componentid).combotree({
		data : this.finalArray,
		temp: temp,
		multiple : true,
		cascadeCheck : !IsBoolean(temp.m_controlledselection),
		advanceTheme : temp.m_advancetheme,
		showCheckBox : IsBoolean(temp.m_advanceproperties.showParentCheckbox),
		onLoadSuccess: function (node, data) {
			temp.setHierComboCSS();
		},
		loadFilter : function (rows) {
			var data = convert(rows);
			if (data.d) {
				return data.d;
			} else {
				return data;
			}
		},
		onClick : function (node) {
			temp.setPanelExpandCollapse(node);
			jqEasyUI("#ComboTree" + temp.m_componentid).combotree("showPanel");
			temp.setPanelScroll();
		},
		onShowPanel : function () {
			$("#SearchTextBox"+ temp.m_componentid).val("");
			$( "#combotreeDiv"+temp.m_panelId+" .tree-node" ).show();
			temp.setPanelScroll();
		},
		onHidePanel : function () {
			temp.panelOpen = false;
			if (IsBoolean(temp.updateflag)){
				temp.updateflag = false;
			}else if (IsBoolean(temp.onExpandflag) || IsBoolean(temp.onCollapseflag)) {
				temp.onExpandflag = false;
				temp.onCollapseflag = false;
				jqEasyUI("#ComboTree" + temp.m_componentid).combotree("clear");
				if (temp.m_previousIndexSelect != ""){
					jqEasyUI("#ComboTree" + temp.m_componentid).combotree("setValues", temp.m_previousIndexSelect);
				}
			} else {
				jqEasyUI("#ComboTree" + temp.m_componentid).combotree("clear");
				// added below if condtion for BDD-675 when cascading filter is used.
				if (!(Array.isArray(temp.m_previousIndexSelect))) {
					jqEasyUI("#ComboTree" + temp.m_componentid).combotree("setValue", temp.m_previousIndexSelect);
				} else {
					if (temp.m_previousIndexSelect != ""){
						jqEasyUI("#ComboTree" + temp.m_componentid).combotree("setValues", temp.m_previousIndexSelect);
					}
				}
			}
			temp.setHierComboCSS();
		},
		onExpand : function (node) {
			temp.onExpandflag = true;
			temp.setPanelScroll();
			if(node.state !== "open") {
				jqEasyUI("#ComboTree" + temp.m_componentid).combotree("hidePanel");
				jqEasyUI("#ComboTree" + temp.m_componentid).combotree("showPanel");
			}

		},
		onCollapse : function (node) {
			temp.onCollapseflag = true;
			//commented this for BDD-675 in case of enabled check box
			//jqEasyUI("#ComboTree" + temp.m_componentid).combotree("hidePanel");
			//jqEasyUI("#ComboTree" + temp.m_componentid).combotree("showPanel");
		},
		onChange : function () {
			temp.m_currentIndexSelect = $("#ComboTree" + temp.m_componentid).combotree("getValues");
			var allIds = temp.finalArray.map(function(obj){return obj.id;});
			/**Added to hide OK button when none of the field is selected*/
			if(IsBoolean(temp.m_hideokbutton)){
				if(temp.m_currentIndexSelect.length > 0){
					$("#OK" + temp.m_componentid).css("display", "block");
				}else{
					$("#OK" + temp.m_componentid).css("display", "none");
				}
			}
			if(temp.m_currentIndexSelect.length == allIds.length){
				$("#SelectAll" + temp.m_componentid).removeClass("bd-checkbox").addClass("bd-checked");
			}else{
				$("#SelectAll" + temp.m_componentid).removeClass("bd-checked").addClass("bd-checkbox");
			}
			if (temp.m_hierarchylevel == "Multiple" && !IsBoolean(temp.m_controlledselection) && IsBoolean(temp.m_customselection)) {
				var value = temp.m_currentIndexSelect.length + "/" + temp.m_selectionlimit;
				$("#ComboTreeSelectionLimit" + temp.m_componentid).val(value);
				if (IsBoolean(temp.m_showonselectionlimit)) {
					if (temp.m_currentIndexSelect.length !== temp.m_selectionlimit) {
						$("#OK" + temp.m_componentid).css("display", "none");
					} else {
						$("#OK" + temp.m_componentid).css("display", "block");
					}
				}
			}
		}
	});
};

/** @description Setter Method of PanelExpandCollapse. **/
HierarchicalCombo.prototype.setPanelExpandCollapse = function (node) {
	var temp = this;
	var t = jqEasyUI("#ComboTree" + temp.m_componentid).combotree("tree");
	if (node.state == "closed"){
		t.tree("expand", node.target);
		$(node.target).find(".icons.bd-plus").removeClass("icons bd-plus").addClass("icons bd-minus");
	}else{
		t.tree("collapse", node.target);
		$(node.target).find(".icons.bd-minus").removeClass("icons bd-minus").addClass("icons bd-plus");
	}
};

/** @description Setter Method of PanelScroll. **/
HierarchicalCombo.prototype.setPanelScroll = function () {
	var temp = this;
	var t = jqEasyUI("#ComboTree" + temp.m_componentid).combotree("tree");
	$("#combotreeDiv" + (temp.m_panelId)).css({
		"width": "100%",
		"border-radius": "0px"});
};
/** @description method to open panel after click on Textbox. **/
HierarchicalCombo.prototype.openPanelOnClickOfTextBox = function () {
	var temp = this;
	temp.panelOpen = false;
	if (!temp.m_designMode) {
		$("#" + temp.m_componentid).find("input.combo-text").on("click", function () {
			if (temp.panelOpen) {
				temp.panelOpen = false;
				jqEasyUI("#ComboTree" + temp.m_componentid).combotree("hidePanel");
			} else {
				temp.panelOpen = true;
				jqEasyUI("#ComboTree" + temp.m_componentid).combotree("showPanel");
			}
		});
	} else {
		$("#" + temp.m_componentid).on("click", function () {
			$(".panel.combo-p").css("display", "none");
		});
	}
};

/** @description Setter Method of DefaultValue To ShowInComboTree. **/
HierarchicalCombo.prototype.setDefaultValueToShowInComboTree = function () {
	var defaultValue = "Select";
	var temp = this;
	var previousIndexSelect = [];
	this.m_previousIndexSelect = [];
	var filterChipsObj = this.getFilterChipsComponentObj();
	if(filterChipsObj !== undefined && filterChipsObj.m_legendObjectArr.length > 0){
		var prevTextArr = filterChipsObj.m_filterDisplayValues[this.m_objectid];
		if (filterChipsObj.m_removedChipValue !== undefined && IsBoolean(temp.m_allowmultipleselection)) {
			temp.m_previousIndexSelect = [];
		} else {
			temp.selectedRecordArray = [];
		}
		if (this.m_associatedfilterchipsid !== "" && filterChipsObj.m_removedChipValue !== undefined) {
			var arr = this.m_dataProvider.filter(function(obj) {
				for (var key in obj) {
					if (obj[key] == filterChipsObj.m_removedChipValue) {
						return obj;
					}
				}
			})
			removedInd = this.finalArray.indexOf(filterChipsObj.m_removedChipValue);
		}

		if (prevTextArr !== undefined && prevTextArr.length > 0 && arr !== undefined && arr.length > 0) {
			arr.map(function(ele) {
				if (prevTextArr.indexOf(ele[temp.m_categoryName[0]]) >= 0) {
					var ind = prevTextArr.indexOf(ele[temp.m_categoryName[0]]);
					(ind >= 0) ? prevTextArr.splice(ind, 1): prevTextArr;
				}
				if (prevTextArr.indexOf(ele[temp.m_categoryName[1]]) >= 0) {
					var ind = prevTextArr.indexOf(ele[temp.m_categoryName[1]]);
					(ind >= 0) ? prevTextArr.splice(ind, 1): prevTextArr;
				}
			})
		}
		temp.m_previousIndexSelect = (prevTextArr.length == 0) ? [] : temp.m_currentIndexSelect;
		for(var i=0; i<temp.finalArray.length; i++){
			if(filterChipsObj.m_removedChipValue !== temp.finalArray[i].name){
				temp.m_currentIndexSelect = [];
				break;
			}
		}
		if (filterChipsObj.m_legendObjectArr.length > 0 && temp.m_previousIndexSelect.length > 0 && filterChipsObj.m_removedChipValue !== undefined) {
			/**Added for select multiple index default through script */
			jqEasyUI("#ComboTree" + temp.m_componentid).combotree("setValues", temp.m_previousIndexSelect);
			filterChipsObj.m_removedChipValue = undefined;
		} else {
			var selectedIndexArr =  (Array.isArray(temp.m_previousIndexSelect)) ? temp.m_previousIndexSelect.map(Number) : [];
			if (!IsBoolean(this.m_designMode) && selectedIndexArr.length > 0) {
				var defaultValueMap = sdk.getGlobalVariable(this.m_referenceid).attributes;
				var reformattedArray = this.finalArray.map(function (obj) {
					var rObj = {};
					for (var key in obj) {
						rObj[key] = obj[key];
					}
					return rObj;
				});
				var hierarichalData = this.createHierarichalData(reformattedArray);
				var returnedData = null;
				var count = 0;
				for (var key in defaultValueMap) {
					var selectedValueArr = defaultValueMap[key].split(',');
					if (defaultValueMap[key] != "" ) {
						if (count == 0) {
							var returnedValue = [];
							var k=0;
							for(i = 0; i<selectedValueArr.length; i++){
								for (var j = 0; j < hierarichalData.length; j++) {
									returnedData = searchTree(hierarichalData[j], selectedValueArr[i]);
									if (returnedData != null) {
										returnedValue[k] = returnedData;
										k++;
										break;
									}
								}
							}
						} else {
							if (returnedValue != null) {
								this.m_previousIndexSelect = [];
								for(i=0; i<returnedValue.length; i++){
									this.m_previousIndexSelect.push(String(returnedValue[i]["id"]));
								}
							}
						}
						count++;
					}
				}
				if (returnedValue != null) {
					previousIndexSelect = [];
					for(i=0; i<returnedValue.length; i++){
						previousIndexSelect.push(String(returnedValue[i]["id"]));
					}
				} else {
					previousIndexSelect = [-1];
					temp.m_previousIndexSelect = [-1];
				}
			};
			jqEasyUI("#ComboTree" + temp.m_componentid).combotree("setValues", temp.m_previousIndexSelect);
		}
	} else {
		var selectedIndexArr =  (Array.isArray(temp.m_previousIndexSelect)) ? temp.m_previousIndexSelect.map(Number) : []; // convert string array into number
		for (var key in this.finalArray) {
			if (this.finalArray[key]["parentId"] != undefined) {
				defaultValue = this.finalArray[0]["id"];
				/**Added for select multiple index default through script */
				if (selectedIndexArr.length > 0) {
					if (selectedIndexArr.indexOf(this.finalArray[key]["id"]) > -1) {
						previousIndexSelect.push(this.finalArray[key]["id"]);
					}
				} else {
					if(IsBoolean(this.m_designMode)){
						if (this.finalArray[key]["parentId"] == 0) {
							defaultValue = this.finalArray[key]["id"];
							previousIndexSelect.push(this.finalArray[key]["id"]);
							break;
						}
					}
					else {
						if(!IsBoolean(this.m_designMode) && !IsBoolean(this.m_chipRemoved)){
							if (this.finalArray[key]["parentId"] == 0) {
								defaultValue = this.finalArray[key]["id"];
								previousIndexSelect.push(this.finalArray[key]["id"]);
								break;
							}
						} else {
							defaultValue = "Select";
						}
					}
				}
			}
		}
		if (!IsBoolean(this.m_designMode) && selectedIndexArr.length > 0) {
			var defaultValueMap = sdk.getGlobalVariable(this.m_referenceid).attributes;
			var reformattedArray = this.finalArray.map(function (obj) {
				var rObj = {};
				for (var key in obj) {
					rObj[key] = obj[key];
				}
				return rObj;
			});
			var hierarichalData = this.createHierarichalData(reformattedArray);
			var returnedData = null;
			var count = 0;
			for (var key in defaultValueMap) {
				if (defaultValueMap[key] != "") {
					if (count == 0) {
						for (var j = 0; j < hierarichalData.length; j++) {
							returnedData = searchTree(hierarichalData[j], defaultValueMap[key]);
							if (returnedData != null) {
								break;
							}
						}
					} else {
						if (returnedData != null) {
							this.m_previousIndexSelect.push(returnedData["id"]);
						}
					}
					count++;
				}
			}
			if (returnedData != null) {
				previousIndexSelect = [];
				previousIndexSelect.push(returnedData["id"]);
				defaultValue = returnedData["id"];
			}
		};
		if (temp.m_hierarchylevel == "Multiple" && temp.m_allowmultipleselection && !IsBoolean(temp.m_controlledselection) && IsBoolean(temp.m_customselection) ) {
			temp.isSingleChild = false // Determine h-combo has only one hierarchy level
			if(temp.m_hierarchytype.length > 1) {
				var count = 0;
				for (var j = 0; j < temp.m_hierarchytype.length; j++) {
					if (temp.m_hierarchytype[j] != "none") {
						count++;
					}
				}
				temp.isSingleChild = (count > 2) ? false : ((selectedIndexArr.length > 0) ? true : false);
			}
			if (temp.isSingleChild) {
				/**Below code will remove parent node index from array of selection indexs */
				for (var i = 0; i < this.finalArray.length; i++) {
					if(this.finalArray[i].parentId == 0 && previousIndexSelect.indexOf(this.finalArray[i].id) > -1) {
						var index = previousIndexSelect.indexOf(this.finalArray[i].id);
						previousIndexSelect.splice(index, 1);
					}
				}
				/**Added for provide custom selection of child nodes*/
				if (temp.m_selectionlimit != "" && temp.m_selectionlimit < previousIndexSelect.length) {
					previousIndexSelect.splice(temp.m_selectionlimit, previousIndexSelect.length);
				}
			}
		}
		this.m_previousIndexSelect = previousIndexSelect;
		// added below condtion for BDD-675 when cascading filter is used.
		if(previousIndexSelect.length == 0) {
			this.m_previousIndexSelect = defaultValue;
		}
		if (selectedIndexArr.length > 0 && previousIndexSelect.length > 0) {
			/**Added for select multiple index default through script */
			jqEasyUI("#ComboTree" + temp.m_componentid).combotree("setValues", previousIndexSelect);
		} else {
			jqEasyUI("#ComboTree" + temp.m_componentid).combotree("setValue", defaultValue);
		}
	}
	/** To pass default filter selected index value to associated component on preview **/
	/** commented this method bcz connection loading multiple times  **/
	if(IsBoolean(this.m_enablegvautoupdate)){
		this.m_notifychange = this.m_notifygvautoupdate;
		this.getValueAndUpdateGlobalVariable();
	}
};

/** @description create HierarchycalData According to parent and child. **/
HierarchicalCombo.prototype.createHierarichalData = function (array) {
	var map = {};
	for (var i = 0; i < array.length; i++) {
		var obj = array[i];
		obj.children = [];
		map[obj.id] = obj;
		var parent = obj.parentId || "0";
		if (!map[parent]) {
			map[parent] = {
				children : []
			};
		}
		map[parent].children.push(obj);
	}
	return (map["0"]) ? map["0"].children : [];
};

/** @description Method will return default value. **/
HierarchicalCombo.prototype.compareDefaultValue = function (fields, Value) {
	var defaultValue = Value;
	var defaultValueMap = sdk.getGlobalVariable(this.m_referenceid).attributes;
	for (var i = 0; i < fields.length; i++) {
		if (defaultValueMap[fields[i]] != undefined && defaultValueMap[fields[i]] != "") {
			for (var j = 0; j < this.finalArray.length; j++) {
				if (defaultValueMap[fields[i]] == this.finalArray[j].name) {
					defaultValue = this.finalArray[j]["id"];
				}
			}
		}
	}
	return defaultValue;
};

/** @description Setter Method of ComboPanelId for HierarchicalCombo. **/
HierarchicalCombo.prototype.setComboPanelId = function () {
	var divOBJs = $(".combo-panel");
	//if(this.m_panelId == "" )
	{
		var divOBJs = document.getElementsByClassName("combo-panel");
		for (var i = 0; i < divOBJs.length; i++) {
			divOBJs[i].id = "combotreeDiv" + i;
		}
		this.m_panelId = i - 1;
	}
};

/** @description method to create Action Icon and bind events.. **/
HierarchicalCombo.prototype.createActionIcons = function () {
	var temp = this;
	temp.m_selectAll = "Select All";
	$("#OK" + temp.m_componentid).remove();
	$("#Cancel" + temp.m_componentid).remove();
	$("#SelectAll" + temp.m_componentid).remove();
	var fontIconWidth = temp.m_menupanelfontsize;
	var SearchBox = temp.createSearchBox();
	var width = 0;
	var selectionLimitBox = document.createElement("input");
	var SearchBoxDiv = document.createElement("div");
	var BoxHeight = 1*temp.m_menupanelrowheight + 2*temp.m_searchboxuiobj.margin;
	SearchBoxDiv.setAttribute("id", "SearchBoxDiv"+ temp.m_componentid);
	var propObj = temp.setAdvanceThemeCSS();
	var selectionPropObj = temp.setSelectionLimitCSS();
	$(SearchBoxDiv).css({"display": "block","height": BoxHeight + "px","width":"100%","background-color" : temp.m_hexChromeColor, "padding-right":"2px"});
	if (temp.m_hierarchylevel == "Multiple" && !IsBoolean(temp.m_controlledselection) && IsBoolean(temp.m_customselection) && IsBoolean(temp.m_showselectionlimit)) {
		$("#ComboTreeSelectionLimit" + temp.m_componentid).remove();
		selectionLimitBox.id = "ComboTreeSelectionLimit" + temp.m_componentid;
		width = selectionPropObj.width;
		$(selectionLimitBox).css({
			"width": width + "px",
			"height": 1 * temp.m_menupanelrowheight + "px",
			"border": temp.m_searchboxuiobj.border + "px",
			"border-style": temp.m_searchboxuiobj.borderStyle,
			"display": "block",
			"border-color": temp.m_searchboxuiobj.borderColor,
			"background-color": temp.m_searchboxuiobj.backgroundColor,
			"margin": temp.m_searchboxuiobj.margin + "px",
			"padding": temp.m_searchboxuiobj.padding + "px",
			"color": convertColorToHex(temp.m_fontcolor),
			"font-size": temp.m_fontsize * temp.minWHRatio() + "px",
			"font-family": selectGlobalFont(temp.m_fontfamily),
			"font-weight": temp.m_fontweight,
			"font-style": temp.m_fontstyle,
			"border-width": selectionPropObj.borderWidth + "px",
			"border-color": convertColorToHex(selectionPropObj.borderColor),
			"border-radius": selectionPropObj.borderRadius + "px",
			"position": "relative",
			"float": "left"
		});
		var value = jqEasyUI("#ComboTree" + temp.m_componentid).combotree("getValues").length + "/" + temp.m_selectionlimit;
		$(selectionLimitBox).val(value);
		SearchBoxDiv.appendChild(selectionLimitBox);
	}else{
		selectionLimitBox.style.display = "none";
	}
	if((temp.m_advancetheme !== undefined) && (temp.m_advancetheme == "advance")){
		$(SearchBox).css({"width": "calc(100% - "+ (2*propObj.rightActionIconPadding + (temp.m_fontsize * temp.minWHRatio())*2) +"px)","border-radius" : propObj.borderRadius + "px","border-color": convertColorToHex(propObj.borderColor),"border-width" : propObj.borderWidth + "px"});
		$(SearchBoxDiv).append(SearchBox);
		var span1 = "<span class='icons bd-close' value='' id=\"Cancel" + temp.m_componentid + "\" style='color:"+convertColorToHex(propObj.iconColor)+";font-size:"+(fontIconWidth)+"px; cursor:pointer; position:relative;float:right;line-height:"+ BoxHeight +"px;padding-right: "+ propObj.rightActionIconPadding +"px;'></span>"; 
		var span2 = "<span class='icons bd-check-2' value='' id=\"OK" + temp.m_componentid + "\" style='color:"+convertColorToHex(propObj.iconColor)+";font-size:"+(fontIconWidth)+"px; cursor:pointer; position:relative;float:right;line-height:"+ BoxHeight +"px;padding-right: "+ propObj.rightActionIconPadding +"px;'></span>";
		$(SearchBoxDiv).append(selectionLimitBox);
		$(SearchBoxDiv).append(span1);
		$(SearchBoxDiv).append(span2);
		$(SearchBoxDiv).insertBefore($("#combotreeDiv" + temp.m_panelId).find(".tree"));
		$("#combotreeDiv" + temp.m_panelId).find(".tree").css({"max-height":"calc(100% - "+(2*temp.m_searchboxuiobj.margin + 1*temp.m_menupanelrowheight)+"px)", "overflow" : "auto"});
	}else{
		if(IsBoolean(temp.m_allowmultipleselection)){
			var div = "<div style='position:absolute;bottom:0px;padding:4px 2px 0px 2px;width:100%;height:24px;background:" + convertColorToHex(temp.m_chromecolorpanel) + ";box-shadow: 0px 1px 2px 2px rgba(0,0,0,0.1)'>" +
			"<span class='icons bd-checkbox' value='' id=\"SelectAll" + temp.m_componentid + "\" style='color:"+convertColorToHex(temp.m_menupanelfontcolor)+";font-size:"+(fontIconWidth)+"px; cursor:pointer; position:relative;float:left;padding:2px 5px 0px 5px;'></span>" +
			"<span class='icons bd-close' value='' id=\"Cancel" + temp.m_componentid + "\" style='color:"+convertColorToHex(temp.m_menupanelfontcolor)+";font-size:"+(fontIconWidth)+"px; cursor:pointer; position:relative;float:right;padding:0px 5px 0px 5px;'></span>" + 
			"<span class='icons bd-check-2' value='' id=\"OK" + temp.m_componentid + "\" style='color:"+convertColorToHex(temp.m_menupanelfontcolor)+";font-size:"+(fontIconWidth)+"px; cursor:pointer; position:relative;float:right;padding:0px 5px 0px 10px;'></span>" + "</div>";
		}else{	
			var div = "<div style='position:absolute;bottom:0px;padding:4px 2px 0px 2px;width:100%;height:24px;background:" + convertColorToHex(temp.m_chromecolorpanel) + ";box-shadow: 0px 1px 2px 2px rgba(0,0,0,0.1)'>" +
			"<span class='icons bd-close' value='' id=\"Cancel" + temp.m_componentid + "\" style='color:"+convertColorToHex(temp.m_menupanelfontcolor)+";font-size:"+(fontIconWidth)+"px; cursor:pointer; position:relative;float:right;padding:2px 5px 0px 5px;'></span>" + 
			"<span class='icons bd-check-2' value='' id=\"OK" + temp.m_componentid + "\" style='color:"+convertColorToHex(temp.m_menupanelfontcolor)+";font-size:"+(fontIconWidth)+"px; cursor:pointer; position:relative;float:right;padding:0px 10px 0px 5px;'></span>" + "</div>";
		}
		$(SearchBox).css({"width": "calc(100% - "+ (2*propObj.rightIconPadding + width*1) +"px)","border-radius" : temp.m_panelborderradius + "px","border-color": convertColorToHex(propObj.borderColor),"border-width" : propObj.borderWidth + "px"});
		$($(SearchBox)[0].childNodes[1]).css({"right": (2*propObj.rightIconPadding + width*1 + 10)+"px"});
		//$(SearchBox).css({"width": "100%","border-radius" : temp.m_panelborderradius + "px","border-color": convertColorToHex(propObj.borderColor),"border-width" : propObj.borderWidth + "px"});
		$(SearchBoxDiv).append(SearchBox);
		$(SearchBoxDiv).append(selectionLimitBox);
		/**Added to insert or append Search Box before list*/
		$(SearchBoxDiv).insertBefore($("#combotreeDiv" + temp.m_panelId).find(".tree"));
		$("#combotreeDiv" + temp.m_panelId).append(div);
		$("#combotreeDiv" + temp.m_panelId).find(".tree").css({"max-height":"calc(100% - "+(2*temp.m_searchboxuiobj.margin + 1*temp.m_menupanelrowheight + 25)+"px)", "overflow" : "auto"});
	}
	$("#SearchTextCross"+ temp.m_componentid).click(function(event) {
		$("#SearchTextBox"+ temp.m_componentid).val('');
		$( "#"+divid+" .tree-node" ).hide();
		$( "#"+divid+" .tree-node" ).filter(function(ind){
			var criteria = $(event.target).val().toLowerCase();
			var isCriteriaMatched = (($(this).find("span.tree-title").text().toLowerCase().indexOf("") != -1) || ($(this).find("span.tree-title-child").text().toLowerCase().indexOf("") != -1));
			if(isCriteriaMatched) {
				var parentNode = $.data($("#"+divid).find("ul")[0], "tree").data;
					var parentElement;
					var elementId = ($(this).attr("index")) ? $(this).attr("index").split("node_")[1] : "";
					var flag = true;
					for (var k = 0; k < parentNode.length; k++) {
						if(parentNode[k].children !== undefined){
							var childLength = parentNode[k].children.length;
							if (parentNode[k].children && childLength > 0) {
							for (var l = 0; l < childLength; l++) {
								if (parentNode[k].children[l].id == elementId && flag) {
									parentElement = $("#"+parentNode[k].domId);
									flag = false;
									$(parentElement).css("display", "block");
									var t = jqEasyUI("#ComboTree" + temp.m_componentid).combotree("tree");
									if(parentElement.hasClass("icons bd-minus") || criteria == "") {
										t.tree("collapse", parentElement);
									} else {
										t.tree("expand", parentElement);
									}
								}
							}
						}
					}
				}
			}
			return isCriteriaMatched;
		}).show();
	});
	var extn = (temp.m_advancetheme == "advance") ? 28 : 12;
	$("#OK" + temp.m_componentid).on("mouseenter", function(e){
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
		//var divTop = e.pageY - e.offsetY- PageTop + offsetTop + 8;
		var divTop = e.pageY - e.offsetY + offsetTop + extn;
		var divLeft = e.pageX - PageLeft - offsetLeft + 25;
		var tooltipDiv = document.createElement("div");
		tooltipDiv.innerHTML = "OK";
		tooltipDiv.setAttribute("id", "toolTipDiv");
		tooltipDiv.setAttribute("class", "settingIcon");
		tooltipDiv.setAttribute("placement", "bottom");
		$(document.body).append(tooltipDiv);
		
		var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
			"top": divTop + "px",
			"left": divLeft + "px",
			"z-index":"999999"
		});
		$(tooltipDiv).css(tooltipObjCss);
		var wd = tooltipDiv.offsetWidth * 1;
		ht = tooltipDiv.offsetHeight * 1;
		var lt = e.pageX - e.offsetX - (wd/2) - 8 +  "px";
				$(tooltipDiv).css("left",lt);
				//$(tooltipDiv).css("box-shadow","0 5px 15px -5px rgb(0 0 0 / 50%)");
	}).on("mouseleave", function(){
		//$(this).css({"color": convertColorToHex(temp.m_menupanelfontcolor)});
		temp.removeToolTipDiv();
	}).on("click", function () {
		temp.updateflag = true;
		if (temp.m_currentIndexSelect != "") {
			temp.m_previousIndexSelect = temp.m_currentIndexSelect;
		}
		temp.m_notifychange = true;
		temp.getValueAndUpdateGlobalVariable();
		temp.panelOpen = false;
		jqEasyUI("#ComboTree" + temp.m_componentid).combotree("hidePanel");
		temp.m_isRowClicked = false;
	});
	$("#Cancel" + temp.m_componentid).on("mouseenter", function(e){
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
		//var divTop = e.pageY - e.offsetY- PageTop + offsetTop + 8;
		var divTop = e.pageY - e.offsetY + offsetTop + extn;
		var divLeft = e.pageX - PageLeft - offsetLeft + 25;
		var tooltipDiv = document.createElement("div");
		tooltipDiv.innerHTML = "Cancel";
		tooltipDiv.setAttribute("id", "toolTipDiv");
		tooltipDiv.setAttribute("class", "settingIcon");
		tooltipDiv.setAttribute("placement", "bottom");
		$(document.body).append(tooltipDiv);
		
		var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
			"top": divTop + "px",
			"left": divLeft + "px",
			"z-index":"999999"
		});
		$(tooltipDiv).css(tooltipObjCss);
		var wd = tooltipDiv.offsetWidth * 1;
		ht = tooltipDiv.offsetHeight * 1;
		var lt = e.pageX - e.offsetX - (wd/2) - 8 +  "px";
				$(tooltipDiv).css("left",lt);
				//$(tooltipDiv).css("box-shadow","0 5px 15px -5px rgb(0 0 0 / 50%)");
	}).on("mouseleave", function(){
		//$(this).css({"color": convertColorToHex(temp.m_menupanelfontcolor)});
		temp.removeToolTipDiv();
	}).on("click", function () {
		if (temp.m_isRowClicked)
			jqEasyUI("#ComboTree" + temp.m_componentid).combotree("clear");
		if (temp.m_previousIndexSelect != "") {
			jqEasyUI("#ComboTree" + temp.m_componentid).combotree("setValues", temp.m_previousIndexSelect);
		}
		temp.panelOpen = false;
		jqEasyUI("#ComboTree" + temp.m_componentid).combotree("hidePanel");
		
		/** reset the css of previous selected items **/
		$("#combotreeDiv" + temp.m_panelId).find(".tree-node").each(function () {
			$(this).css("background", convertColorToHex(temp.m_chromecolorpanel));
			var applySelectionColor = (temp.m_advancetheme = "advance") ? (IsBoolean(temp.m_advanceproperties.showParentCheckbox) && $("#combotreeDiv" + temp.m_panelId).find(".tree-node-selected").hasClass("parent-node") ? true : false): true;
			if(applySelectionColor){
				$("#combotreeDiv" + temp.m_panelId).find(".tree-node-selected").css("background", convertColorToHex(temp.m_selectioncolor));
			}
		});
	});
	$("#SelectAll" + temp.m_componentid).on("mouseenter", function(e){
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
		//var divTop = e.pageY - e.offsetY- PageTop + offsetTop + 8;
		var divTop = e.pageY - e.offsetY + offsetTop + extn;
		var divLeft = e.pageX - PageLeft - offsetLeft + 25;
		var tooltipDiv = document.createElement("div");
		tooltipDiv.innerHTML = temp.m_selectAll;
		tooltipDiv.setAttribute("id", "toolTipDiv");
		tooltipDiv.setAttribute("class", "settingIcon");
		tooltipDiv.setAttribute("placement", "bottom");
		$(document.body).append(tooltipDiv);
		
		var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
			"top": divTop + "px",
			"left": divLeft + "px",
			"z-index":"999999"
		});
		$(tooltipDiv).css(tooltipObjCss);
		var wd = tooltipDiv.offsetWidth * 1;
		ht = tooltipDiv.offsetHeight * 1;
		var lt = e.pageX - e.offsetX - (wd/2) - 9 + "px";
				$(tooltipDiv).css("left",lt);
				//$(tooltipDiv).css("box-shadow","0 5px 15px -5px rgb(0 0 0 / 50%)");
	}).on("mouseleave", function(){
		$(this).css({"color": convertColorToHex(temp.m_menupanelfontcolor)});
		temp.removeToolTipDiv();
	}).on("click", function () {
		if($(this).attr("class").indexOf("bd-checked") != -1) {
			var isCheck = false
			temp.removeToolTipDiv();
			temp.m_selectAll = "Select All";
			//$(this).attr("title", "Select All");
			$(this).removeClass("bd-checked");
			$(this).addClass("bd-checkbox");
			jqEasyUI("#ComboTree" + temp.m_componentid).combotree("setValues", []);
		}else{
			var isCheck = true;
			temp.removeToolTipDiv();
			temp.m_selectAll = "Remove All";
			//$(this).attr("title", "Remove All");
			$(this).removeClass("bd-checkbox");
			$(this).addClass("bd-checked");
			jqEasyUI("#ComboTree" + temp.m_componentid).combotree("setValues", temp.finalArray.map(function(obj){return obj.id;}));
		}
	});
	/*$("#Search" + temp.m_componentid).on("click", function () {
		if($("#SearchTextBox"+temp.m_componentid).is(":visible")){
			$("#SearchTextBox"+temp.m_componentid).css("display","none");
			$("#SelectAll"+temp.m_componentid).css("display","block");
			$("#Cancel"+temp.m_componentid).css("display","block");
			$("#OK"+temp.m_componentid).css("display","block");
		}else{
			$("#SearchTextBox"+temp.m_componentid).css("display","block").focus().val("");
			$("#SelectAll"+temp.m_componentid).css("display","none");
			$("#Cancel"+temp.m_componentid).css("display","none");
			$("#OK"+temp.m_componentid).css("display","none");
		}*/
		var divid = "combotreeDiv"+temp.m_panelId;
		$( "#"+divid+" .tree-node" ).show();
		$("#SearchTextBox"+ temp.m_componentid).keyup(function(event) {
			var criteria = $(event.target).val().toLowerCase();
			$( "#"+divid+" .tree-node" ).hide();
			$( "#"+divid+" .tree-node" ).filter(function(ind){
				var isCriteriaMatched = (($(this).find("span.tree-title").text().toLowerCase().indexOf(criteria) != -1) || ($(this).find("span.tree-title-child").text().toLowerCase().indexOf(criteria) != -1));
				if(isCriteriaMatched) {
					var parentNode = $.data($("#"+divid).find("ul")[0], "tree").data;
					var parentElement;
					var elementId = ($(this).attr("index")) ? $(this).attr("index").split("node_")[1] : "";
					var flag = true;
					for (var k = 0; k < parentNode.length; k++) {
						if(parentNode[k].children !== undefined){
							var childLength = parentNode[k].children.length;
							if (parentNode[k].children && childLength > 0) {
								for (var l = 0; l < childLength; l++) {
									if (parentNode[k].children[l].id == elementId && flag) {
										parentElement = $("#"+parentNode[k].domId);
										flag = false;
										$(parentElement).css("display", "block");
										var t = jqEasyUI("#ComboTree" + temp.m_componentid).combotree("tree");
										if(parentElement.hasClass("icons bd-minus") || criteria == "") {
											t.tree("collapse", parentElement);
										} else {
											t.tree("expand", parentElement);
										}
									}
								}
							}
						}
					}
				}
				return isCriteriaMatched;
			}).show();
		});
	//});
};

/** @description method to create Advance Theme CSS **/
HierarchicalCombo.prototype.setAdvanceThemeCSS = function () {
	var Obj = {};
	Obj["borderColor"] = (this.m_advanceproperties.borderColor === "") ? this.m_menupanelfontcolor : this.m_advanceproperties.borderColor;
	Obj["iconColor"] = (this.m_advanceproperties.iconColor === "") ? this.m_menupanelfontcolor : this.m_advanceproperties.iconColor;
	Obj["borderRadius"] = (this.m_advanceproperties.borderRadius === "") ? this.m_panelborderradius : this.m_advanceproperties.borderRadius;
	Obj["rightActionIconPadding"] = (this.m_advanceproperties.rightActionIconPadding === "") ? 5 : this.m_advanceproperties.rightActionIconPadding;
	Obj["rightIconPadding"] = (this.m_advanceproperties.rightIconPadding === "") ? 1 : this.m_advanceproperties.rightIconPadding;
	Obj["borderWidth"] = (this.m_advanceproperties.borderWidth === "") ? 1 : this.m_advanceproperties.borderWidth;
	return Obj;
}

/** @description method to create Selection Limit Box CSS **/
HierarchicalCombo.prototype.setSelectionLimitCSS = function () {
	var Obj = {};
	var refObj = this.setAdvanceThemeCSS();
	Obj["borderColor"] = (this.m_showselectionlimitui.borderColor === "") ? refObj.borderColor : this.m_showselectionlimitui.borderColor;
	Obj["borderRadius"] = (this.m_showselectionlimitui.borderRadius === "") ?  refObj.borderRadius : this.m_showselectionlimitui.borderRadius;
	Obj["borderWidth"] = (this.m_showselectionlimitui.borderWidth === "") ?  refObj.borderWidth : this.m_showselectionlimitui.borderWidth;
	Obj["width"] = (this.m_showselectionlimitui.width === "") ?  "40" : this.m_showselectionlimitui.width;
	return Obj;
}
/** @description method to create Selection Limit Box CSS **/
HierarchicalCombo.prototype.childNodeCSS = function () {
	var Obj = {};
	Obj["backgroundColor"] = (this.m_childnodeproperties.backgroundColor === "") ? this.m_chromecolorpanel : this.m_childnodeproperties.backgroundColor;
	Obj["fontColor"] = (this.m_childnodeproperties.fontColor === "") ?  this.m_menupanelfontcolor : this.m_childnodeproperties.fontColor;
	Obj["selectionColor"] = (this.m_childnodeproperties.selectionColor === "") ? this.m_selectioncolor : this.m_childnodeproperties.selectionColor;
	Obj["selectionFontColor"] = (this.m_childnodeproperties.selectionFontColor === "") ?  this.m_menupanelfontcolor : this.m_childnodeproperties.selectionFontColor;
	Obj["rolloverColor"] = (this.m_childnodeproperties.rolloverColor === "") ?  this.m_rollovercolor : this.m_childnodeproperties.rolloverColor;
	Obj["rolloverFontColor"] = (this.m_childnodeproperties.rolloverFontColor === "") ?  this.m_menupanelfontcolor : this.m_childnodeproperties.rolloverFontColor;
	return Obj;
}
/** @description Setter Method of CSS for HierarchicalCombo. **/
HierarchicalCombo.prototype.setHierComboCSS = function () {
	var temp = this;
	var childNodeProp = this.childNodeCSS();
	$("#"+temp.m_componentid).find("span.combo").css({
		"border-radius": "0px",
		"border": "1px solid #eeeeee",
		"top": "0px",
		"position": "absolute"
	});
	
	$("#" + temp.m_componentid).find("input.combo-text").css("height", this.m_height + "px");
	$("#" + temp.m_componentid).find("span.combo-arrow").css("height", this.m_height * 1 + "px");
	$("#" + temp.m_componentid).find(".textbox-icon").css("width", "25px");
	
	$("#ComboTree" + temp.m_objectid).find(".combo-text").css("vertical-align", "top");	
	$("#" + temp.m_componentid).find("span span .combo-arrow").css("background-color", convertColorToHex(this.m_chromecolor));
	
	$("#combotreeDiv" + temp.m_panelId).css("font-size", this.fontScaling(this.m_fontsize) + "px");
	if((temp.m_advancetheme !== undefined) && (temp.m_advancetheme == "advance")){
		$("#combotreeDiv" + temp.m_panelId).find("ul:first").css({"padding": "5px 0px 5px 0px"});
	}
	$("#combotreeDiv" + temp.m_panelId).find("span").removeClass("tree-icon tree-folder tree-folder-open").removeClass("tree-file").removeClass("datagrid-sort-icon");
	$("#combotreeDiv" + temp.m_panelId).css({
		"text-align": "left",
		"background": convertColorToHex(this.m_chromecolorpanel),
		"padding": "0px"
	});
	/*var padding = ((this.m_menupanelrowheight - 24)/2);*/
	var padding = ((this.m_menupanelrowheight - 24)/1);
	var height = ((this.m_advancetheme !== undefined) && (this.m_advancetheme == "advance")) ? this.m_menupanelrowheight + 5  : this.m_menupanelrowheight;
	$("#combotreeDiv" + temp.m_panelId).find(".tree-node").css({
		"padding-top": padding+"px", 
		"padding-bottom": padding+"px",
		"height": height + "px",
		"display": "flex"
	});
	var width = (this.m_advancetheme == "advance") ? "75%" : "85%";
	$("#combotreeDiv" + temp.m_panelId).find(".tree-title").css({
		"font-size": this.fontScaling(this.m_fontsize) + "px",
		"text-decoration": this.m_textdecoration,
		/*"line-height": (height-12) + "px",*/
		"width": width,
		"overflow": "hidden",
		"white-space": "nowrap"
	});
	$("#combotreeDiv" + temp.m_panelId).find(".tree-title-child").css({
		"font-size": this.fontScaling(this.m_fontsize) + "px",
		"text-decoration": this.m_textdecoration,
		/*"line-height": (height - 12) + "px",*/
		"width": "75%",
		"padding-top" : "4px",
		"text-overflow" : "ellipsis",
    	"white-space" : "nowrap",
    	"overflow" : "hidden"
	});
	if((temp.m_advancetheme !== undefined) && (temp.m_advancetheme == "advance")){
		var borderProp = temp.m_advancehighlighter.borderWidth + "px " + temp.m_advancehighlighter.borderStyle + " " + temp.m_advancehighlighter.borderColor;
	}else{
		var borderProp = "none";
	}
	$("#combotreeDiv" + temp.m_panelId).find(".tree-node").find("span").each(function() {
		if (this.getAttribute("class") === "tree-checkbox tree-checkbox0") {
			return false;
		}
		$(this).css("text-decoration", temp.m_textdecoration);
		if (this.getAttribute("class") === "tree-title parent-node") {
			$(this).parent().css({
				"border-left": borderProp
			});
		}
	});
	$("#combotreeDiv" + temp.m_panelId).find(".tree-node").each(function() {
		$(this).find(".icons.bd-plus").css({
			"display": "inline-block",
			"color": temp.m_menupanelfontcolor,
			"font-size": temp.fontScaling(temp.m_expandiconsize) + "px",
			"line-height": (temp.m_menupanelrowheight - 5) + "px",
			"margin-right": "10px"
		});
		if($(this).find("span").hasClass("child-node")){
			$(this).css({
				"background": convertColorToHex(childNodeProp.backgroundColor),
				"color": convertColorToHex(childNodeProp.fontColor)
			});
			if((temp.m_advancetheme == undefined) || (temp.m_advancetheme == "default")){
				$(this).parent().find(".tree-indent").css({
					"margin-right": "5px"
				});
			}
		}
	});
	$("#combotreeDiv" + temp.m_panelId).find("li").each(function (x, v) {
		if ($(v).find("ul").find("li").length > 0) {}
		else {
			$(v).find(".tree-hit").remove();
		}
	});

	$("#combotreeDiv" + temp.m_panelId).css({
		"color": this.m_menupanelfontcolor,
		"font-family": selectGlobalFont(this.m_fontfamily),
		"font-style": this.m_fontstyle,
		"font-weight": this.m_fontweight,
		"overflow":"hidden"
	});
	$("#" + temp.m_componentid).find(".textbox-text").css({
		"height": "100%",
		"font-style": this.m_fontstyle,
		"font-size": this.fontScaling(this.m_fontsize) + "px",
		"text-decoration": this.m_textdecoration,
		"color": this.m_fontcolor,
		"font-family": selectGlobalFont(this.m_fontfamily),
		"font-weight": this.m_fontweight,
		"cursor": this.m_cursortype,
		"padding-left": 5 + "px",
		"text-overflow": "ellipsis"
	});
	$("#combotreeDiv" + temp.m_panelId).find(".tree-node-selected").css({
		"color": temp.m_menupanelfontcolor
	});
	$("#combotreeDiv" + temp.m_panelId).find(".tree-node").hover(
		function () {
			if($(this).find("span").hasClass("child-node")){
				$(this).css({
					"background": convertColorToHex(childNodeProp.rolloverColor),
					"color": convertColorToHex(childNodeProp.rolloverFontColor)
				});
			}else{
				$(this).css({
					"background": convertColorToHex(temp.m_rollovercolor),
					"color": convertColorToHex(temp.m_menupanelfontcolor)
				});
			}
		},
		function () {
			if($(this).find("span").hasClass("child-node")){
				$(this).css({
					"background": convertColorToHex(childNodeProp.backgroundColor),
					"color": convertColorToHex(childNodeProp.fontColor)
				});
			}else{
				$(this).css({
					"background": convertColorToHex(temp.m_chromecolorpanel)
				});
			}
			$("#combotreeDiv" + temp.m_panelId).queue(function (next) {
				if($("#combotreeDiv" + temp.m_panelId).find(".tree-node-selected").hasClass("child-node")){
					$("#combotreeDiv" + temp.m_panelId).find(".tree-node-selected").css({
						"background": convertColorToHex(childNodeProp.selectionColor),
						"color": convertColorToHex(childNodeProp.selectionFontColor)
					});
				}else{
					var applySelectionColor = (temp.m_advancetheme == "advance") ? (IsBoolean(temp.m_advanceproperties.showParentCheckbox)  ? true : false): true;
					if(applySelectionColor){
						$("#combotreeDiv" + temp.m_panelId).find(".tree-node-selected").css({
							"background": convertColorToHex(temp.m_selectioncolor)
						});
					}
				}
				$("#combotreeDiv" + temp.m_panelId).find(".tree-checkbox1").parent().each(function () {
					if($(this).find("span").hasClass("child-node")){
						$(this).css({
							"background": convertColorToHex(childNodeProp.selectionColor),
							"color": convertColorToHex(childNodeProp.selectionFontColor)
						});
					}else{
						var applySelectionColor = (temp.m_advancetheme == "advance") ? (IsBoolean(temp.m_advanceproperties.showParentCheckbox)  ? true : false): true;
						if(applySelectionColor){
							$(this).css({
								"background": convertColorToHex(temp.m_selectioncolor)
							});
						}
					}
				});
				$("#combotreeDiv" + temp.m_panelId).find(".tree-checkbox0").parent().each(function () {
					if($(this).find("span").hasClass("child-node")){
						$(this).css({
							"background": convertColorToHex(childNodeProp.backgroundColor),
							"color": convertColorToHex(childNodeProp.fontColor)
						});
					}else{
						$(this).css({
							"background": convertColorToHex(temp.m_chromecolorpanel)
						});
					}
				});
				next();
			});
		}).click(function () {
			temp.m_isRowClicked = true;
			$("#combotreeDiv" + temp.m_panelId).find(".tree-node").each(function () {
				if($(this).find("span").hasClass("child-node")){
					$(this).css({
						"background": convertColorToHex(childNodeProp.backgroundColor),
						"color": convertColorToHex(childNodeProp.fontColor)
					});
				}else{
					$(this).css({
						"background": convertColorToHex(temp.m_chromecolorpanel)
					});
				}
			});
			$("#combotreeDiv" + temp.m_panelId).delay(20).queue(function (next) {
				if($("#combotreeDiv" + temp.m_panelId).find(".tree-node-selected").hasClass("child-node")){
					$("#combotreeDiv" + temp.m_panelId).find(".tree-node-selected").css({
						"background": convertColorToHex(childNodeProp.selectionColor),
						"color": convertColorToHex(childNodeProp.selectionFontColor)
					});
				}else{
					var applySelectionColor = (temp.m_advancetheme == "advance") ? (IsBoolean(temp.m_advanceproperties.showParentCheckbox)  ? true : false): true;
					if(applySelectionColor){
						$("#combotreeDiv" + temp.m_panelId).find(".tree-node-selected").css({
							"background": convertColorToHex(temp.m_selectioncolor)
						});
					}
				}
				$("#combotreeDiv" + temp.m_panelId).find(".tree-checkbox1").parent().each(function () {
					if($(this).find("span").hasClass("child-node")){
						$(this).css({
							"background": convertColorToHex(childNodeProp.selectionColor),
							"color": convertColorToHex(childNodeProp.selectionFontColor)
						});
					}else{
						var applySelectionColor = (temp.m_advancetheme == "advance") ? (IsBoolean(temp.m_advanceproperties.showParentCheckbox)  ? true : false): true;
						if(applySelectionColor){
							$(this).css({
								"background": convertColorToHex(temp.m_selectioncolor)
							});
						}
					}
				});
				$("#combotreeDiv" + temp.m_panelId).find(".tree-checkbox0").parent().each(function () {
					if($(this).find("span").hasClass("child-node")){
						$(this).css({
							"background": convertColorToHex(childNodeProp.backgroundColor),
							"color": convertColorToHex(childNodeProp.fontColor)
						});
					}else{
						$(this).css({
							"background": convertColorToHex(temp.m_chromecolorpanel)
						});
					}
				});
				next();
			});
	});
	/** When dropdown loaded, selection color is not showing **/
	$("#combotreeDiv" + temp.m_panelId).delay(20).queue(function (next) {
		$("#combotreeDiv" + temp.m_panelId).find(".tree-node").each(function () {
			if($(this).find("span").hasClass("child-node")){
				$(this).css({
					"background": convertColorToHex(childNodeProp.backgroundColor),
					"color": convertColorToHex(childNodeProp.fontColor)
				});
			}else{
				$(this).css({
					"background": convertColorToHex(temp.m_chromecolorpanel)
				});
			}
		});
		if($("#combotreeDiv" + temp.m_panelId).find(".tree-node-selected").hasClass("child-node")){
			$("#combotreeDiv" + temp.m_panelId).find(".tree-node-selected").css({
				"background": convertColorToHex(childNodeProp.selectionColor),
				"color": convertColorToHex(childNodeProp.selectionFontColor)
			});
		}else{
			var applySelectionColor = (temp.m_advancetheme == "advance") ? (IsBoolean(temp.m_advanceproperties.showParentCheckbox)  ? true : false): true;
			if(applySelectionColor){
				$("#combotreeDiv" + temp.m_panelId).find(".tree-node-selected").css({
					"background": convertColorToHex(temp.m_selectioncolor)
				});
			}
		}
		$("#combotreeDiv" + temp.m_panelId).find(".tree-checkbox1").parent().each(function () {
			if($(this).find("span").hasClass("child-node")){
				$(this).css({
					"background": convertColorToHex(childNodeProp.selectionColor),
					"color": convertColorToHex(childNodeProp.selectionFontColor)
				});
			}else{
				var applySelectionColor = (temp.m_advancetheme == "advance") ? (IsBoolean(temp.m_advanceproperties.showParentCheckbox)  ? true : false): true;
				if(applySelectionColor){
					$(this).css({
						"background": convertColorToHex(temp.m_selectioncolor)
					});
				}
			}
		});
		$("#combotreeDiv" + temp.m_panelId).find(".tree-checkbox0").parent().each(function () {
			if($(this).find("span").hasClass("child-node")){
				$(this).css({
					"background": convertColorToHex(childNodeProp.backgroundColor),
					"color": convertColorToHex(childNodeProp.fontColor)
				});
			}else{
				$(this).css({
					"background": convertColorToHex(temp.m_chromecolorpanel)
				});
			}
		});
		
		next();
	});
	
	/** Setting uniform border in combo boxes **/
	$("#combotreeDiv" + temp.m_panelId).parent().css({
		"border-right": "1px solid " + convertColorToHex(this.m_bordercolor),
		"border-left": "1px solid " + convertColorToHex(this.m_bordercolor),
		"border-bottom": "1px solid " + convertColorToHex(this.m_bordercolor),
	});
	
	$("#ComboTree" + temp.m_objectid).find(".textbox").css({ //Set mainDiv radius
		"border-radius": temp.m_filterborderradius + "px",
		"backgroundColor": convertColorToHex(temp.m_chromecolor)
		});
	$("#combotreeDiv" + temp.m_panelId).parent().css({ //Set dropDownBox radius
		"border-radius": temp.m_panelborderradius + "px",
	});
	$("#ComboTree" + temp.m_objectid).find(".textbox-text-readonly").css("backgroundColor", convertColorToHex(temp.m_chromecolor));//Set backgroundColor of inputBox
};

/** @description Getter Method of DefaultValue To ShowInComboTree. **/
HierarchicalCombo.prototype.getValueAndUpdateGlobalVariable = function () {
	var map = {};
	if (this.m_hierarchylevel == "Single" || this.m_hierarchylevel == "single") {
		map = this.getSelctedValueMap();
	} else {
		map = this.getFieldNameValueMap(this.getSelctedValueMap());
	}
	this.updateDataPoints(map);
};

/** @description Getter Method of FieldNameValueMap. **/
HierarchicalCombo.prototype.getFieldNameValueMap = function (valueOfSelected) {
	var fieldNameValueMap = new Object();
	if (valueOfSelected.length > 0) {
		if (!IsBoolean(this.m_allowmultipleselection)) {
			for (var i = 0; i < this.getName().length; i++) {
				fieldNameValueMap[this.getName()[i]] = valueOfSelected[0][i];
			}
			for (var j = 0; j < this.m_hierarchytype.length; j++) {
				if (this.m_hierarchytype[j] == "none") {
					var valueArry = [];
					for (var index = 0; index < valueOfSelected.length; index++) {
						valueArry.push(valueOfSelected[index][j]);
					}
					if (this.m_fieldaggregation[j] == "none" && valueArry.length == 1)
						fieldNameValueMap["drillField_" + this.getName()[j]] = valueArry[0];
					else if (this.m_fieldaggregation[j] == "none")
						fieldNameValueMap["drillField_" + this.getName()[j]] = "";
					else
						fieldNameValueMap["drillField_" + this.getName()[j]] = getAggregationOperatedData(valueArry, this.m_fieldaggregation[j]);
				}
			}
		} else {
			for (var i = 0; i < this.getName().length; i++) {
				fieldNameValueMap[this.getName()[i]] = valueOfSelected[i];
			}
			for (var j = 0; j < this.m_hierarchytype.length; j++) {
				if (this.m_hierarchytype[j] == "none") {
					var str = ("" + valueOfSelected[j]).split(",");
					var valueArry = [];
					for (var index = 0; index < str.length; index++) {
						valueArry.push(str[index]);
					}
					if (this.m_fieldaggregation[j] == "none" && valueArry.length == 1)
						fieldNameValueMap["drillField_" + this.getName()[j]] = valueArry[0];
					else if (this.m_fieldaggregation[j] == "none")
						fieldNameValueMap["drillField_" + this.getName()[j]] = "";
					else
						fieldNameValueMap["drillField_" + this.getName()[j]] = getAggregationOperatedData(valueArry, this.m_fieldaggregation[j]);
				}
			}
		}
	} else {
		fieldNameValueMap = {};
		for (var i = 0; i < this.getName().length; i++) {
			fieldNameValueMap[this.getName()[i]] = "";
		}
	}
	return fieldNameValueMap;
};

/** @description Getter Method will return  Data in array form data-provider. **/
HierarchicalCombo.prototype.getDataProviderInArrayForm = function () {
	var map = [];
	for (var i = 0; i < this.getDataProvider().length; i++) {
		map[i] = [];
		for (var j = 0; j < this.getName().length; j++) {
			map[i][j] = this.getDataProvider()[i][this.getName()[j]];
		}
	}
	return map;
};

/** @description Getter Method of SelectedRecord. **/
HierarchicalCombo.prototype.getSelectedRecord = function (count, map) {
	for (var i = 0; i < this.getName().length; i++) {
		if (count == 0)
			this.singleMap[this.getName()[i]] = "" + map[this.getName()[i]];
		else
			this.singleMap[this.getName()[i]] = this.singleMap[this.getName()[i]] + "," + map[this.getName()[i]];
	}
};
/** @description Method of getSelctedValueMap Of SingleLevel hierarichalCombo. **/
HierarchicalCombo.prototype.getSelctedValueMapOfSingleLevel = function () {
	this.singleMap = {};
	var temp = this;
	if (!IsBoolean(this.m_allowmultipleselection)) {
		var tree = jqEasyUI("#ComboTree" + temp.m_componentid).combotree("tree");
		var node = tree.tree("getSelected");
		if (node != null) {
			var id = node.id;
			for (var k = 0; k < this.m_roots.length; k++) {
				if (this.m_roots[k][this.m_namebyhierarchyType["child"]] == id) {
					this.getSelectedRecord(0, this.m_roots[k]);
				}
			}
		}
	} else {
		var val = jqEasyUI("#ComboTree" + temp.m_componentid).combotree("getValues");
		var count = 0;
		/** set the blank values in map when selected options are zero **/
		if(val.length == 0){
			for (var i1 = 0; i1 < this.getName().length; i1++) {
				this.singleMap[this.getName()[i1]] = "";
			}
		}
		for (var k = 0; k < this.m_roots.length; k++) {
			for (var i = 0; i < val.length; i++) {
				if (this.m_roots[k][this.m_namebyhierarchyType["child"]] == val[i]) {
					this.getSelectedRecord(count++, this.m_roots[k]);
				}
			}
		}
	}
	return this.singleMap;
};

/** @description Method of getSelctedValueMap Of SingleLevel hierarichalCombo. **/
HierarchicalCombo.prototype.getSelctedValueMapOfMultiLevel = function () {
	var relatedData = [];
	var map = [];
	map = this.getDataProviderInArrayForm();
	var temp = this;
	if (!IsBoolean(this.m_allowmultipleselection)) {
		var t = jqEasyUI("#ComboTree" + temp.m_componentid).combotree("tree");
		var node = t.tree("getSelected");
		if (node != null) {
			var id = node.id;
			this.selectedRecordArray = [];
			this.getParentArray(id);

			for (var i = 0; i < map.length; i++) {
				var k = 0;
				var flag = true;
				for (var j = this.selectedRecordArray.length - 1; j >= 0; j--) {
					if (this.selectedRecordArray[j] != map[i][k]) {
						flag = false;
						break;
					}
					k++;
				}
				if (flag) {
					relatedData.push(this.updateDataMap(map[i], this.selectedRecordArray));
				}
			}
		}
	} else {
		var t = jqEasyUI("#ComboTree" + temp.m_componentid).combotree("tree");
		var node = jqEasyUI("#ComboTree" + temp.m_componentid).combotree("getValues");
		if (node != null) {
			var id = node;
			this.selectedRecordArray = [];
			for (var i = 0; i < id.length; i++) {
				this.getMultiLevelMultiSelect(id[i]);
			}
			for (var i = 0; i < this.selectedRecordArray.length; i++) {
				relatedData.push(this.getCommaSeparatedString(this.getUniqueArr(this.selectedRecordArray[i])));
				if (i == this.selectedRecordArray.length - 1) {
					for (var j = 0; j < this.getNoneFieldsByNames().length; j++) {
						var data = "";
						for (var k = 0; k < this.selectedRecordArray[i].length; k++) {
							var suffix = (k < this.selectedRecordArray[i].length - 1) ? "," : "";
							var noneFields = this.selectedRecordArray[i][k]["NoneFields"];
							data += noneFields[this.getNoneFieldsByNames()[j]] + suffix;
						}
						relatedData.push(data);
					}
				}
			}
		}
	}
	return relatedData;
};
/** @description if selectedMapvalue is match with allMapValue then store that value in updateMap and return. **/
HierarchicalCombo.prototype.updateDataMap = function (allMapValue, selectedMapvalue) {
	if (IsBoolean(this.m_controlleddrill)) {
		var updateMap = {};
		var flagvalue = false;
		for (var key in allMapValue) {
			if (allMapValue.hasOwnProperty( key )) {
				for (var key1 in selectedMapvalue) {
					if (allMapValue[key] === selectedMapvalue[key1]) {
						flagvalue = true;
						break;
					}
				}
				if (IsBoolean(flagvalue)) {
					updateMap[key] = allMapValue[key];
					flagvalue = false;
				} else {
					updateMap[key] = "";
				}
			}
		}
		return updateMap;
	} else{
		return allMapValue;
	}
};

/** @description getter method of  selectedMapvalue. **/
HierarchicalCombo.prototype.getSelctedValueMap = function () {
	if (this.m_hierarchylevel == "Single" || this.m_hierarchylevel == "single") {
		return this.getSelctedValueMapOfSingleLevel();
	} else if (this.m_hierarchylevel == "Multiple") {
		return this.getSelctedValueMapOfMultiLevel();
	}
};

/** @description getter method of  UniqueArray. **/
HierarchicalCombo.prototype.getUniqueArr = function (list) {
	var result = [];
	$.each(list, function (i, e) {
		if ($.inArray(e.name, result) == -1)
			result.push(e.name);
	});
	return result;
};

/** @description getter method for CommaSeparatedString. **/
HierarchicalCombo.prototype.getCommaSeparatedString = function (arr) {
	var newstr = "";
	for (var i = 0; i < arr.length; i++) {
		var suffix = (i < arr.length - 1) ? "," : "";
		newstr += arr[i] + suffix;
	}
	return newstr;
};

/** @description getter method for ParentArray. **/
HierarchicalCombo.prototype.getParentArray = function (id) {
	this.selectedRecordArray = [];
	this.getIterativeParentArray(id);
};
/** @description getter method for IterativeParentArray . **/
HierarchicalCombo.prototype.getIterativeParentArray = function (id) {
	for (var i = 0; i < this.finalArray.length; i++) {
		if (this.finalArray[i]["id"] == id) {
			if (id * 1 > 0) {
				this.selectedRecordArray.push(this.finalArray[i]["name"]);
				var parentId = this.finalArray[i]["parentId"];
				this.getIterativeParentArray(parentId);
			}
		}
	}
};
/** @description getter method for MultiLevelMultiSelect . **/
HierarchicalCombo.prototype.getMultiLevelMultiSelect = function (id, arr1) {
	if (arr1 != undefined)
		var arr = arr1;
	else
		var arr = [];

	for (var i = 0; i < this.finalArray.length; i++) {
		if (this.finalArray[i]["id"] == id) {
			if (id * 1 > 0) {
				//this.selectedRecordArray.push(this.finalArray[i]["name"]);
				var parentId = this.finalArray[i]["parentId"];
				arr.push(this.finalArray[i]);
				if (parentId == 0) {
					this.setInSelectedArray(arr);
					return;
				} else
					this.getMultiLevelMultiSelect(parentId, arr);
			}
		}
	}
};
/** @description setter method of SelectedArray. **/
HierarchicalCombo.prototype.setInSelectedArray = function (arr) {
	for (var i = 0; i < arr.length; i++) {
		if (this.selectedRecordArray[arr.length - (i + 1)] == undefined) {
			this.selectedRecordArray[arr.length - (i + 1)] = [];
		}
		this.selectedRecordArray[arr.length - (i + 1)].push(arr[i]);
	}
};

/** @description getter method of HierarchyType. **/
HierarchicalCombo.prototype.getHierarchyType = function () {
	return this.m_hierarchytype;
};
/** @description setter method of HierarchyType. **/
HierarchicalCombo.prototype.setHierarchyType = function (hierarchyType) {
	this.m_hierarchytype = hierarchyType;
};

/** @description getter method of Visible. **/
HierarchicalCombo.prototype.getVisible = function () {
	return this.m_visible;
};
/** @description setter method for Visible. **/
HierarchicalCombo.prototype.setVisible = function (visible) {
	this.m_visible = visible;
};

/** @description getter method of DisplayName. **/
HierarchicalCombo.prototype.getDisplayName = function () {
	return this.m_displayname;
};
/** @description setter method for DisplayName. **/
HierarchicalCombo.prototype.setDisplayName = function (displayName) {
	this.m_displayname = displayName;
};
/** @description setter method for Name. **/
HierarchicalCombo.prototype.setName = function (name) {
	this.m_name = name;
};

/** @description setter method of tName. **/
HierarchicalCombo.prototype.getName = function () {
	return this.m_name;
};
/** @description method used for convert and return nodes Array. **/
function convert(rows) {
	function exists(rows, parentId) {
		for (var i = 0; i < rows.length; i++) {
			if (rows[i].id == parentId)
				return true;
		}
		return false;
	}

	var nodes = [];
	// get the top level nodes
	for (var i = 0; i < rows.length; i++) {
		var row = rows[i];
		if (!exists(rows, row.parentId)) {
			nodes.push({
				id : row.id,
				text : row.name,
				state : "closed"
			});
		}
	}

	var toDo = [];
	for (var i = 0; i < nodes.length; i++) {
		toDo.push(nodes[i]);
	}
	while (toDo.length) {
		var node = toDo.shift(); //the parent node
		//get the children nodes
		for (var i = 0; i < rows.length; i++) {
			var row = rows[i];
			if (row.parentId == node.id) {
				var child = {
					id : row.id,
					text : row.name,
					state : "closed"
				};
				if (node.children) {
					node.children.push(child);
				} else {
					node.children = [child];
				}
				toDo.push(child);
			}
		}
	}
	return nodes;
};
/** @description method used for createTree. **/
HierarchicalCombo.prototype.createTree = function () {
	var m_root = "";
	for (var i = 0; i < this.m_seriesData.length; i++) {
		var node = new Node(this.m_seriesData[i]);
		this.m_nodeArr.push(node);
		//storing all node's object in m_nodeArr
	}
	for (var j = 0; j < this.m_nodeArr.length; j++) {
		//for m_root node
		if (this.m_nodeArr[j].m_pid == this.m_nodeArr[j].m_cid) {
			m_root = this.m_nodeArr[j];
		}
	}
	return m_root;
};
/** @description create outerDiv and set css and return object. **/
HierarchicalCombo.prototype.getWhiteDivision = function () {
	var temp = this;
	$("#outerdiv").css("top", this.m_height + "px");
	$("#outerdiv").css("width", parseInt(this.m_width) + parseInt(this.m_hierDropDownWidth) + "px");
	$("#outerdiv").css("height", parseInt(this.m_hierDropDownHeight) + "px");
	$("#outerdiv").css("position", "absolute");
	$("#outerdiv").css("border", "1px solid black");
	$("#outerdiv").css("background", "#f8f8f8");
	$("#outerdiv").css("display", "#none");
	$("#outerdiv").css("overflow", "#scroll");
	$("#draggableDiv" + temp.m_objectid).append($("#outerdiv"));
	return ($("#outerdiv"));
};
/** @description create div for contains UI/LI/SPAN Elements used for draw hierarchyCombo. **/
HierarchicalCombo.prototype.createUlLiSpanDivision = function (whiteDivisionObject) {
	var temp = this;
	var ulLiSpanDivisionObject = document.createElement("div");
	ulLiSpanDivisionObject.setAttribute("id", "myNav");
	$("#draggableDiv" + temp.m_objectid).append(ulLiSpanDivisionObject);

	var ULS = this.createUlLiSpan(); //creating ul,li span
	var a = this.anchorOnclick(this.m_root); //create and onclick of <a>

	ULS[1].appendChild(a);
	ULS[0].appendChild(ULS[1]);
	ulLiSpanDivisionObject.appendChild(ULS[0]);

	this.spanOnclick(ULS[2], ULS[0], this.m_root); //span tag are used for "+" and "-" extention
	$("#outerdiv").append(ulLiSpanDivisionObject);
};
/** @description method used for create  UI/LI/SPAN elements. **/
HierarchicalCombo.prototype.createUlLiSpan = function () {
	var ul = document.createElement("ul");
	ul.style.type = "none";
	var li = document.createElement("li");
	li.style.type = "none";
	var span = document.createElement("span");
	li.appendChild(span);

	this.plusString = '<span id="plusSign" style="font-size:16px; font-weight:bold"><img src="images/plus.png"></span>';
	this.minusString = '<span id="minusSign" style="font-size:16px;font-weight:bold"><img src="images/minus.png"> </span>';
	span.innerHTML = this.plusString;
	return [ul, li, span];
};
/** @description method used to create anchor tag and bind onclick event on it. **/
HierarchicalCombo.prototype.anchorOnclick = function (m_root) {
	var temp = this;
	var a = document.createElement("a");
	a.appendChild(document.createTextNode(m_root.m_name));
	a.style.font = this.m_fontstyle + " " + this.m_fontweight + " " + this.fontScaling(this.m_fontsize) + "px " + selectGlobalFont(this.m_fontfamily);
	a.onclick = function () {
		$("#hier").val(a.innerHTML);
		$("#outerdiv").css("display", "none");
		var optionValue = $("#hier").val();
		var childId = m_root.m_cid;
		var parrentId = m_root.m_pid;
		var AllData = [parrentId, childId, optionValue];
		var globalKey = temp.getGlobalKey();
		var variableObj = temp.m_dashboard.getGlobalVariable().map[globalKey];
		var fieldNameValueMap = new Object();
		for (var i = 0; i < temp.getDataSet().getFields().length; i++) {
			fieldNameValueMap[temp.getDataSet().getFields()[i].getName()] = AllData[i];
		}
		variableObj.update(fieldNameValueMap);
	};
	return a;
};
/** @description bind onclick with span. **/
HierarchicalCombo.prototype.spanOnclick = function (span, ul, m_root) {
	var temp = this;
	var li;
	span.onclick = function () {
		span.innerHTML = span.innerHTML === temp.plusString ? temp.minusString : temp.plusString;
		if (span.innerHTML === temp.minusString) {
			li = temp.drawChild(m_root, ul);
			for (var i = 0; i < li.length; i++) {
				ul.appendChild(li[i]);
			}
		} else {
			for (var i1 = 0; i1 < li.length; i1++) {
				ul.removeChild(li[i1]);
			}
		}

	};
};
/** @description create Division for drop-down. **/
HierarchicalCombo.prototype.createDropDownDivision = function () {
	//adding the div with option tag
	var temp = this;
	var dropDownDivObject = document.createElement("div");
	dropDownDivObject.setAttribute("id", "selectDiv");
	dropDownDivObject.style.display = "inline-flex";
	dropDownDivObject.style.position = "absolute";
	dropDownDivObject.style.height = this.m_height + "px";
	$("#draggableDiv" + temp.m_objectid).append(dropDownDivObject);
	$("#footleft").append($("#draggablesParentDiv" + temp.m_dashboardname));

	var selectButtonObject = this.createSelectButton(); //creating "select" button
	var VButtonObject = this.createVButton(); //creating "V" button

	dropDownDivObject.appendChild(selectButtonObject);
	dropDownDivObject.appendChild($("#hier1"));
};
/** @description create button "Select" and set properties. **/
HierarchicalCombo.prototype.createSelectButton = function () {
	var selectButtonObject = document.createElement("input");
	selectButtonObject.style.zIndex = "1";
	selectButtonObject.type = "button";
	selectButtonObject.id = "hier";
	selectButtonObject.name = "hier";
	var x = selectButtonObject.value = "Select";
	selectButtonObject.style.font = this.m_fontstyle + " " + this.m_fontweight + " " + this.fontScaling(this.m_fontsize) + "px " + selectGlobalFont(this.m_fontfamily);
	selectButtonObject.style.fontSize = this.fontScaling(this.m_fontsize);
	selectButtonObject.style.width = (x.clientWidth) + "px";
	selectButtonObject.style.height = parseInt(this.m_height) + "px";
	selectButtonObject.style.background = "#ECECEC";
	selectButtonObject.style.float = "left";
	return selectButtonObject;
};
/** @description create button "V" and set properties. **/
HierarchicalCombo.prototype.createVButton = function () {
	$("#hier1").attr("name", "hier1");
	$("#hier1").css("display", "block");
	$("#hier1").css("z-index", "1");
	$("#hier1").css("background", "url(images/hierDown.png)");
	$("#hier1").css("backgroundColor", "f1f1f1");
	$("#hier1").css("height", parseInt(this.m_height) - 0.5 + "px");
	$("#hier1").css("width", "22px");
	$("#hier1").css("float", "left");
	$("#hier1").css("margin-left", "-1px");
	return ($("#hier1"));
};
/** @description method for draw child. **/
HierarchicalCombo.prototype.drawChild = function (rootNode, ul) {
	var temp = this;
	var ulChild = [];
	for (var i = 0; i < rootNode.m_childArr.length; i++) {
		ulChild[i] = temp.addAChild(rootNode.m_childArr[i]);
	}
	return ulChild;
};
/** @description method for add child element. **/
HierarchicalCombo.prototype.addAChild = function (rootNode) {
	var ULS = this.createUlLiSpan(); //creating ul,li span
	this.spanOnclick(ULS[2], ULS[0], rootNode);
	var a = this.anchorOnclick(rootNode); //create and onclick of <a>
	ULS[1].appendChild(a);
	ULS[0].appendChild(ULS[1]);
	return ULS[0];
};
/** @description method for hide  child. **/
HierarchicalCombo.prototype.divHide = function () {
	if ($("#outerdiv") != undefined || $("#outerdiv") != null) {
		if ($("#outerdiv").css("display") == "block") {
			$("#outerdiv").css("display", "none");
		}
	}
};
/** @description method for searchTree if title is matching return element. **/
function searchTree(element, matchingTitle) {
	if (element.name == matchingTitle) {
		return element;
	} else if (element.children != null) {
		var result = null;
		for (var l = 0; result == null && l < element.children.length; l++) {
			result = searchTree(element.children[l], matchingTitle);
		}
		return result;
	}
	return null;
};
//# sourceURL=HierarchicalCombo.js
