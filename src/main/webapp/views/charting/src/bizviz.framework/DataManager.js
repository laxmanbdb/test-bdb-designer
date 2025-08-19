/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: DataManager.js
 * @description Contains the operations related to the data 
 * */
/**
 * @description Constructor DataManager 
 * */
function DataManager() {
	this.allowTimelyRefresh = false;
	this.timeoutIdsMap = {};
	this.m_dashboard = "";
};
DataManager.prototype.setDashboard = function (dashboard) {
	this.m_dashboard = dashboard;
};
/** @description This method will check for startup loading flag, if it is true - initiate the service calling **/
DataManager.prototype.initiateService = function (dataProvider, callBack) {
	this.timeoutIdsMap[dataProvider.m_id] = "";
	if (IsBoolean(dataProvider["m_loadatstartup"])) {
		dataProvider.getDataFromConnection(dataProvider.getDataSetValues(), callBack);
		this.handleTimelyRefresh(dataProvider, callBack);
	}
};

/** @description If timelyRefresh flag is set to true, will set the mechanism to reload service after given time interval **/
DataManager.prototype.handleTimelyRefresh = function (dataProvider, callBack) {
	if (IsBoolean(dataProvider["m_timelyrefresh"]) && dataProvider["m_refreshminutes"] != 0 && dataProvider["m_refreshminutes"] != undefined) {
		var temp = this;
		console.log("Auto refresh '"+dataProvider["m_id"] +"' in next " + temp.getProperInterval(dataProvider["m_refreshminutes"]) +". Time now is "+ new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds() );
		/** Clear the previous interval and make a new interval from this point-of-time **/
		this.clearTimelyRefresh( dataProvider.m_id );
		temp.timeoutIdsMap[dataProvider.m_id] = 
			setInterval(function () {
				console.log("Auto refresh '"+dataProvider["m_id"] +"' in next " + temp.getProperInterval(dataProvider["m_refreshminutes"]) +". Time now is "+ new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds() );
				dataProvider.getDataFromConnection(dataProvider.getDataSetValues(), callBack);
			}, dataProvider["m_refreshminutes"] * 60000);
	}
};
/** @description Will set the timelyRefresh flag to false **/
DataManager.prototype.stopTimelyRefresh = function () {
	this.allowTimelyRefresh = false;
};
/** @description Will returns the time for the given minutes **/
DataManager.prototype.getProperInterval = function ( min ) {
	var result = [];
	if(min){
		var value = min*60;
		var units = {
				"year": 365*24*60*60,
				"month": 30*24*60*60,
				"week": 7*24*60*60,
				"day": 24*60*60,
				"hour": 60*60,
				"minute": 60,
				"second": 1
		}
		for(var name in units) {
			var p =  Math.floor(value/units[name]);
			if(p == 1) {
				result.push("" + p + " " + name);
			}
			if(p >= 2) {
				result.push("" + p + " " + name + "s");
			}
			value %= units[name];
		}
	}
	return result.join(" ");
};
/** @description Will clear connection's timeout **/
DataManager.prototype.clearTimelyRefresh = function (connId) {
	clearInterval( this.timeoutIdsMap[connId] );
};
/** @description Will clear all the timeouts **/
DataManager.prototype.clearAllTimelyRefresh = function () {
	for(var connId in this.timeoutIdsMap){
		if( this.timeoutIdsMap.hasOwnProperty(connId) ){
			clearInterval( this.timeoutIdsMap[connId] );
		}
	}
};
/** @description Will close all the opened WebSockets when going back to design mode **/
DataManager.prototype.clearAllWebSockets = function () {
	if(this.m_dashboard !== ""){
		var dUrls = this.m_dashboard.getDataProviders().getDataURL();
		for(var i=0; i<dUrls.length; i++){
			if(dUrls[i].m_type == "ws"){
				try{
					if(this.m_dashboard.m_widgetsArray.length > 0){
						this.m_dashboard.m_widgetsArray[0].m_designMode = true;
					}
					dUrls[i].m_webservice.m_ws.close();
				}catch(e){
					console.log(e);
				}
			}
		}
	}
};
/** @description Will clear all pending Http requests **/
DataManager.prototype.clearAllHttpRequests = function () {
	/** $.ajaxQ is defined in FrameworkUtil **/
	$.ajaxQ.abortAll();
};
/** @description Will clear all Http requests which was set on an interval to pull data **/
DataManager.prototype.clearAllPythonHttpRequests = function () {
	if(this.m_dashboard !== ""){
		var dUrls = this.m_dashboard.getDataProviders().getDataURL();
		for(var i=0; i<dUrls.length; i++){
			if(dUrls[i].m_typespecifier == "pa" && dUrls[i].m_webservice.m_workflowtype == "python"){
				try{
					dUrls[i].m_webservice.stopPythonProcess();
				}catch(e){
					console.log(e);
				}
			}
		}
	}
};

/** @description This method will return obj with data and associated components information **/
DataManager.prototype.manipulateData = function (data) {
	var obj = {};
	obj["DataSet"] = this.getDataSetChartObject(data);
	obj["VirtualDataSet"] = this.getVirtualDataSetChartObject(data);
	return obj;
};

/** @description return the associated dataset objects in form of array **/
DataManager.prototype.getDataSetChartObject = function (data) {
	var dataSetChartObject = [];
	for (var i = 0; i < data.dataSetValues.getDataSets().length; i++) {
		var dataSet = data.dataSetValues.getDataSets()[i];
		dataSet.setDataStore(data.dataObject);
		dataSet.setDataView(data.dataObject);
		dataSetChartObject[i] = dataSet.getData();
	}
	return dataSetChartObject;
};

/** @deprecated **/
/** @description return the associated virtual dataset objects in form of array **/
DataManager.prototype.getVirtualDataSetChartObject = function (data) {
	var virtualDataSetChartObject = [];
	for (var j = 0; j < data.dataSetValues.getVirtualDataSets().length; j++) {
		virtualDataSetChartObject[j] = {};
		var virtualDataSet = data.dataSetValues.getVirtualDataSets()[j];
		var chart = virtualDataSet.getRegisteredWidgetsArray();
		var virtualDataSetFieldInfo = virtualDataSet.getRegisteredWidgetsFieldInfoArray();
		virtualDataSetChartObject[j]["Chart"] = chart;
		virtualDataSetChartObject[j]["Data"] = this.getVirtualDataSetValue(virtualDataSetFieldInfo, data.dataObject);
		virtualDataSetChartObject[j]["DataPointToUpdate"] = this.getVirtualDataSetValueToUpdate(virtualDataSetFieldInfo, data.dataObject);
	}
	return virtualDataSetChartObject;
};
/** @deprecated **/
DataManager.prototype.getVirtualDataSetValue = function (virtualDataSetFieldInfo, data) {
	var virtualDataValue = [];
	for (var i = 0; i < virtualDataSetFieldInfo.length; i++) {
		if (virtualDataSetFieldInfo[i].dataRowNumber != "" && virtualDataSetFieldInfo[i].virtualDataField != "" && data.length > 0) {
			virtualDataValue[i] = data[virtualDataSetFieldInfo[i].dataRowNumber][virtualDataSetFieldInfo[i].virtualDataField];
		} else
			virtualDataValue[i] = "";
	}
	return virtualDataValue;
};
/** @deprecated **/
DataManager.prototype.getVirtualDataSetValueToUpdate = function (virtualDataSetFieldInfo, data) {
	/**	used in image to update the global variable **/
	var virtualDataValue = [];
	for (var i = 0; i < virtualDataSetFieldInfo.length; i++) {
		if (virtualDataSetFieldInfo[i].dataRowNumber != "" && virtualDataSetFieldInfo[i].virtualDataField != "" && data.length > 0) {
			virtualDataValue[i] = data[virtualDataSetFieldInfo[i].dataRowNumber][virtualDataSetFieldInfo[i].valuefield];
		} else
			virtualDataValue[i] = "";
	}
	return virtualDataValue;
};

function DataSetValues() {
	this.m_connectionId;
	this.m_fieldName = [];
	this.m_fieldNameValues = []; /** this array holds a map at every index **/
	this.m_dataUrl;
	this.m_registerdWidgets = [];
	this.m_registeredDataSet = [];
	this.m_registeredVirtualDataSet = [];
	this.m_XMLData = "";
	this.m_numberOfRecords = 0;
	this.dashboard = "";
};

/** @description Storing the connection object which has this associated dataset **/
DataSetValues.prototype.init = function (dataURLObj) {
	this.m_dataUrl = dataURLObj;
	this.dashboard = this.m_dataUrl.dashboard;
	this.m_connectionId = this.m_dataUrl.getId();
	this.m_fieldName = this.m_dataUrl.m_fieldNamesArray;
};

/** @description getter method for all field names **/
DataSetValues.prototype.getFieldNames = function () {
	return this.m_fieldName;
};

/** @deprecated **/
/** @description setter method for data **/
DataSetValues.prototype.setXmlData = function (XmlData) {
	this.m_XMLData = XmlData;
};

/** @deprecated **/
/** @description getter method for data **/
DataSetValues.prototype.getXmlData = function () {
	return this.m_XMLData;
};

/** @deprecated **/
/** @description Setting the associated virtual dataset in array **/
DataSetValues.prototype.registerVirtualDataSetWithDataSetValues = function (virtualDataSet) {
	this.m_registeredVirtualDataSet.push(virtualDataSet);
};

/** @deprecated **/
/** @description getter method for the associated virtual dataset **/
DataSetValues.prototype.getVirtualDataSets = function () {
	return this.m_registeredVirtualDataSet;
};

/** @description Setting the associated dataset in array **/
DataSetValues.prototype.registerDataSetsWithDataSetValues = function (dataSet) {
	this.m_registeredDataSet.push(dataSet);
};

/** @description getter method for the associated dataset **/
DataSetValues.prototype.getDataSets = function () {
	return this.m_registeredDataSet;
};

/** @description Will store the data coming from connections **/
DataSetValues.prototype.update = function (XmlData) {
	this.setXmlData(XmlData);
	var m_fieldNameValues = this.parseDataInDataSetValues(XmlData);
	this.setDataInMap(m_fieldNameValues);
	this.notifyDataUpdate();
};

/** @deprecated **/
/** @description update the registered virtual datasets when data received  **/
DataSetValues.prototype.updateVirtualDataSet = function () {
	for (var i = 0; i < this.m_registeredVirtualDataSet.length; i++) {
		this.notifyVirtualDataUpdate(this.m_registeredVirtualDataSet[i].m_observerVirtualWidgetArray);
	}
};
/** @deprecated **/
DataSetValues.prototype.notifyVirtualDataUpdate = function (virtualDataSetWidgetsArray) {
	for (var i = 0; i < virtualDataSetWidgetsArray.length; i++) {
		virtualDataSetWidgetsArray[i].m_fieldSetValue = this;
		virtualDataSetWidgetsArray[i].m_initialvisibility = true;

		if (!virtualDataSetWidgetsArray[i].m_isDataSetavailable)
			virtualDataSetWidgetsArray[i].updateWidgetsDataSetValues();
		else {
			var widget = virtualDataSetWidgetsArray[i];
			widget.notifyWidgetsDataUpdate(widget.m_fieldSetValue);
		}
	}
};

/** @description update the registered datasets when data received  **/
DataSetValues.prototype.notifyDataUpdate = function () {
	for (var i = 0; i < this.m_registerdWidgets.length; i++) {
		this.m_registerdWidgets[i].notifyWidgetsDataUpdate(this);
	}
};

/** @description parse the XML response and store into map **/
DataSetValues.prototype.parseDataInDataSetValues = function (XMLData) {
	var temp = this;
	var m_fieldNameValues = [];
	var m_records = "Records";
	var m_record = "Record";
	if (/n\w{4}hWSDL/.test(this.m_dataUrl.m_type) || this.m_dataUrl.m_type == "web") {
		m_records = "records";
		m_record = "record";
	} else if (this.m_dataUrl.m_type == "clarityWSDL") {
		m_records = "Records";
		m_record = "Record";
	}

	var recordsObj = $(XMLData).find(m_records);
	this.m_numberOfRecords = 0;
	$(recordsObj).find(m_record).each(function () {
		var hashmap = new Object();
		for (var i = 0; i < temp.m_fieldName.length; i++) {
			var tagName = temp.m_fieldName[i];
			var tagData = $(this).find(tagName).text();
			hashmap[tagName] = tagData;
			/** set data into map[fieldName] = dataValue **/
		}
		m_fieldNameValues[temp.m_numberOfRecords] = hashmap;
		temp.m_numberOfRecords++;
	});
	return m_fieldNameValues;
};

/** @description setter method to set the connection data  **/
DataSetValues.prototype.setDataInMap = function (m_fieldNameValues) {
	this.m_fieldNameValues = m_fieldNameValues;
};

/** @description setter method to set the count of records in connection data  **/
DataSetValues.prototype.setNumberOfRecord = function (numberOfRecord) {
	this.m_numberOfRecords = numberOfRecord;
};

function DataSet() {
	this.m_datasource = "";
	this.m_id = "";

	this.m_Fields = [];
	this.m_Aggregation = new Aggregation();
	this.m_AutoManipulator = new AutoManipulator();
	this.m_DataSetFilter = new DataSetFilter();
	this.m_CalculatedField = new CalculatedFields();
	this.m_AppendRowsEnable = false;

	this.m_registeredWidget = "";
	this.m_seriesJson = [];
	this.m_categoryJson = [];
	this.dashboard = "";
	this.m_operationorder = {0: "calcField", 1: "appendRows", 2: "autoManipulator", 3: "filter", 4: "aggregation"};
};

DataSet.prototype.setOperationOrder = function (obj) {
	this.m_operationorder = obj;
};
DataSet.prototype.getOperationOrder = function () {
	return this.m_operationorder;
};

DataSet.prototype.setDashboard = function (dashboard) {
	this.dashboard = dashboard;
};

DataSet.prototype.setDataSource = function (dataSource) {
	this.m_datasource = datasource;
};

DataSet.prototype.getDataSource = function () {
	return this.m_datasource;
};

DataSet.prototype.setId = function (id) {
	this.m_id = id;
};

DataSet.prototype.getId = function () {
	return this.m_id;
};

DataSet.prototype.setAppendRows = function (m_AppendRows) {
	this.m_AppendRows = m_AppendRows;
};

DataSet.prototype.getAppendRows = function () {
	return this.m_AppendRows;
};

DataSet.prototype.setAppendRowsEnable = function (m_AppendRowsEnable) {
	this.m_AppendRowsEnable = m_AppendRowsEnable;
};

DataSet.prototype.getAppendRowsEnable = function () {
	return this.m_AppendRowsEnable;
};

DataSet.prototype.setAggregation = function (m_Aggregation) {
	this.m_Aggregation = m_Aggregation;
};

DataSet.prototype.getAggregation = function () {
	return this.m_Aggregation;
};

DataSet.prototype.setAutoManipulator = function (m_AutoManipulator) {
	this.m_AutoManipulator = m_AutoManipulator;
};

DataSet.prototype.getAutoManipulator = function () {
	return this.m_AutoManipulator;
};

DataSet.prototype.setDataSetFilter = function (m_DataSetFilter) {
	this.m_DataSetFilter = m_DataSetFilter;
};

DataSet.prototype.getDataSetFilter = function () {
	return this.m_DataSetFilter;
};

DataSet.prototype.setFields = function (fieldObject) {
	this.m_Fields.push(fieldObject);
};

DataSet.prototype.getFields = function () {
	return this.m_Fields;
};

DataSet.prototype.setFieldsJson = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
};

DataSet.prototype.getFieldsJson = function () {
	return this.m_fieldsJson;
};

DataSet.prototype.setDataStore = function (data) {
	this.m_dataStore = data;
};

DataSet.prototype.setDataView = function (data) {
	this.m_dataView = data;
};

DataSet.prototype.getDataStore = function () {
	return this.m_dataStore;
};

DataSet.prototype.getDataView = function () {
	return this.m_dataView;
};
DataSet.prototype.dataSetFieldsJSONParsing = function (dataSetJsonFields) {
	var fieldsJsonArray = parser.getArrayOfSingleLengthJson(dataSetJsonFields);
	for (var i = 0; i < fieldsJsonArray.length; i++) {
		var fieldObject = new Fields();
		this.setFields(fieldObject);
		parser.parseAttributesAndSetToNode(fieldsJsonArray[i], fieldObject);
	}
	this.setFieldsJson(fieldsJsonArray);
};
/** @description Return an object which holds the component information and filtered data after operations **/
DataSet.prototype.getData = function () {
	var dataSetChartObject = {};
	dataSetChartObject["Chart"] = this.getRegisteredWidget();
	var fieldJson = this.putOperationOnFieldJson(this.getFieldsJson(), this.getDataView());
	dataSetChartObject["Fields"] = fieldJson;
	this.setDataView(this.putOperationOnDataView(this.getDataStore()));
	dataSetChartObject["Data"] = this.getDataView();
	return dataSetChartObject;
};

/** @description this method will refresh the dataset according to given global condition or static fields **/
DataSet.prototype.refreshDataFromConnection = function (callBack) {
	var obj = {};
	obj["DataSet"] = [];
	var dataSetChartObject = {};
	dataSetChartObject["Chart"] = this.getRegisteredWidget();
	dataSetChartObject["Fields"] = this.putOperationOnFieldJson(this.getFieldsJson(), this.getDataStore());
	this.setDataView(this.putOperationOnDataView(this.getDataStore()));
	dataSetChartObject["Data"] = this.getDataView();
	obj["DataSet"][0] = dataSetChartObject;
	callBack(obj);
};

/** @description Method will rearrange the dataset fields according to aggregation or auto-manipulator condition **/
DataSet.prototype.putOperationOnFieldJson = function (fieldJson, data) {
	if (IsBoolean(this.getAggregation().getEnable())) {
		return this.getFieldJsonForAggregation(fieldJson);
	} else if (IsBoolean(this.getAutoManipulator().getEnable())) {
		return this.getFieldJsonForAutomanipulator(fieldJson, data);
	} else {
		return fieldJson;
	}
};

/** @description Method will rearrange the dataset fields according to aggregation condition **/
DataSet.prototype.getFieldJsonForAggregation = function (fieldJson) {
	var aggregatedJson = fieldJson;
	var groupByNode = this.getAggregation().getGroupByNode();
	var summaryfields = this.getUniqueSumeryOpFields(this.getAggregation()).field;
	if (groupByNode != "" && groupByNode != "none") {
		if(groupByNode.split(",").length > 1){
			summaryfields = summaryfields.concat( groupByNode.split(",") );
		}else{
			summaryfields.push(groupByNode);
		}
		aggregatedJson = [];
		for (var i = 0; i < fieldJson.length; i++) {
			for (var j = 0; j < summaryfields.length; j++) {
				if (this.getProperAttributeNameValue(fieldJson[i], "fieldname") == summaryfields[j] || this.getProperAttributeNameValue(fieldJson[i], "Name") == summaryfields[j])
					aggregatedJson.push(fieldJson[i]);
			}
		}
	}
	return aggregatedJson;
};

/** @description Method will rearrange the dataset fields according to auto-manipulator condition **/
DataSet.prototype.getFieldJsonForAutomanipulator = function (fieldJson, data) {
	var catGroup = this.getAutoManipulator().getCategoryGroup();
	var temp_category = this.geCategoryNameFromCatGroup(data, catGroup);
	var uniqueCategory = this.getUniqueCatNames(temp_category);
	var serGroup = this.getAutoManipulator().getSeriesGroup();
	var valueField = this.getAutoManipulator().getValueField();
	var allUniqueSeriesNames = [];
	var subCategory = this.m_AutoManipulator.m_subcategorygroup;
	if (subCategory == undefined) {
	    allUniqueSeriesNames = this.getSeriesNamesFromUniqueCategorys(data, uniqueCategory, catGroup, serGroup, valueField); //Old Code
	    return this.getSeriesNamesFromSerGroup(fieldJson, uniqueCategory, catGroup, serGroup, valueField, allUniqueSeriesNames); //Old code out of if else
	} else { 
		//When subcategory didnot pass from script, Field data will be calculated accordingly
	    var temp_subcategory = this.geCategoryNameFromCatGroup(data, subCategory);
	    var uniquesubCategory = this.getUniqueCatNamesByCat(temp_subcategory,uniqueCategory,data,catGroup,subCategory);
	    allUniqueSeriesNames = this.getSeriesNamesFromUniqueSubCategorys(data, uniquesubCategory, subCategory, serGroup, valueField);
	    return this.getSeriesNamesFromSerGroupWithSubCat(fieldJson, uniqueCategory, catGroup, uniquesubCategory, subCategory, serGroup, valueField, allUniqueSeriesNames);
	}
	
};
DataSet.prototype.getUniqueCatNamesByCat = function (subcat,uniqueCat,data,catGroup,subCategory){
	/**To get unique subcategory name according to category**/
	var allfieldByCat = [];
	for(var i = 0; i < uniqueCat.length; i++){
		var fieldByCat = [];
		for(var j = 0; j < data.length; j++){
			if(data[j][catGroup] === uniqueCat[i]){
				fieldByCat.push(data[j][subCategory]);
			}
		}
		allfieldByCat.push(fieldByCat);
	}
	var finalFieldByCat = [];
	for(var k = 0; k < allfieldByCat.length; k++){
		finalFieldByCat.push.apply(finalFieldByCat,this.getUniqueCatNames(allfieldByCat[k]));
	}
	return finalFieldByCat;
};
/** @description Method will generate fields and its properties for auto manipulation generated fields**/
DataSet.prototype.getSeriesNamesFromSerGroupWithSubCat = function (fieldJson, uniqueCategory, catGroup, uniquesubCategory, subCategory, serGroup, valueField, allUniqueSeriesNames) {
	var autoJson = [];
	var color = this.getCategoryColor(allUniqueSeriesNames);
	autoJson.push( this.getFieldJsonforOneField("Category", "#000000", catGroup) );
	autoJson.push( this.getFieldJsonforOneField("SubCategory", "#000000", subCategory) );
	for (var i = 0; i < allUniqueSeriesNames.length; i++) {
		var json = this.getFieldJsonforOneField("Series", color[i], allUniqueSeriesNames[i]);
		autoJson.push( this.updateAutoJson(json) );
	};
	return autoJson;
};
/** @description Method will generate fields and its properties for auto manipulation generated fields**/
DataSet.prototype.getSeriesNamesFromSerGroup = function (fieldJson, uniqueCategory, catGroup, serGroup, valueField, allUniqueSeriesNames) {
	var autoJson = [];
	var color = this.getCategoryColor(allUniqueSeriesNames);
	autoJson.push( this.getFieldJsonforOneField("Category", "#000000", catGroup) );
	for (var i = 0; i < allUniqueSeriesNames.length; i++) {
		var json = this.getFieldJsonforOneField("Series", color[i], allUniqueSeriesNames[i]);
		autoJson.push( this.updateAutoJson(json) );
	};
	return autoJson;
};
/** @description method can be used for changing the field properties **/
DataSet.prototype.updateAutoJson = function (json) {
	return json;
};
/** @description Method has default fields properties **/
DataSet.prototype.getFieldJsonforOneField = function (type, color, name) {
	var json = new Object();
	json["Type"] = type;
	json["Color"] = color;
	json["Name"] = name;
	json["DisplayName"] = name;
	json["visible"] = true;
	json["ChartType"] = "column";
	json["axis"] = "left";
	json["Precision"] = "0";
	json["PlotType"] = "point";
	json["PlotRadius"] = "5";
	json["OtherField"] = "";
	json["PlotTransparency"] = "1";
	json["DataSeperator"] = "~";
	json["hierarchyType"] = "none";
	json["DataLabelCustomProperties"] = {
			"showDataLabel"	: "false",
			"useFieldColor"	: "false",
			"dataLabelTextAlign" : "center",
			"dataLabelFontColor" : "#000000",
			"dataLabelRotation" : "0",
			"dataLabelFontSize" : "12",
			"datalabelFontStyle" : "normal",
			"datalabelFontWeight" : "normal",
			"datalabelFontFamily" : "Roboto",
			"datalabelField" : "",
			"datalabelPosition" : "Top"
		};
	/** placeholders for grid and filters **/
	json["fieldname"] = name;
	json["displayname"] = name;
	json["DisplayField"] = name;
	json["Value"] = name;
	return json;
};

/** @description Method will set the category colors for all the fields when category color indicator is applied **/
DataSet.prototype.getCategoryColor = function (allUniqueSeriesNames) {
	var color = new Array();
	if (this.getRegisteredWidget().getCategoryColors() && this.getRegisteredWidget().getCategoryColors().m_categorydefaultcolorset != "") {
		var defaultColorSetString = (this.getRegisteredWidget().getCategoryColors().m_categorydefaultcolorset);
		var defaultColorSet = defaultColorSetString.split(",");
		/**		Old way to use defaultColor for remaining series **/
		//		var defaultColor = this.getRegisteredWidget().getCategoryColors().getCategoryDefaultColor();
		//		for(var i=0 ; i<allUniqueSeriesNames.length ; i++){
		//			if(defaultColorSet[i] != undefined)
		//				color[i] = defaultColorSet[i];
		//			else
		//				color[i] = defaultColor;
		//		}

		/**		New way to repeat the color of series instead of using same color for remaining series **/
		for (var i = 0; i < allUniqueSeriesNames.length; i++) {
			defaultColorSet.push(convertColorToHex(defaultColorSet[i]));
		}
		color = defaultColorSet.splice(0, allUniqueSeriesNames.length);
	} else {
		/**		Use random color if nothing is given **/
		for (var i = 0; i < allUniqueSeriesNames.length; i++) {
			color.push(convertColorToHex(getRandomColor()));
		}
	}
	return color;
};

/** @description Apply various operations on data **/
DataSet.prototype.putOperationOnDataView = function (dataStore) {
	var data = getDuplicateArray(dataStore);
	for(var key in this.m_operationorder){
		if(this.m_operationorder.hasOwnProperty(key)){
			switch(this.m_operationorder[key]){
			case "calcField":
				var dataCalculatedFields = this.getCalculatedFields();
				if (dataCalculatedFields.length > 0) {
					data = this.getCalculatedFieldAppendedData(dataCalculatedFields, data);
				}
				break;
			case "appendRows":
				if (IsBoolean(this.getAppendRowsEnable())){
					data = this.getAppendRowsData(data);
				}
				break;
			case "autoManipulator":
				if (IsBoolean(this.getAutoManipulator().getEnable())){
					data = this.getAutoManipulatorData(data);
				}
				break;
			case "filter":
				if (this.getDataSetFilter().getConditionsArr().length > 0){
					data = this.getFilteredData(data);
				}
				break;
			case "aggregation":
				if (IsBoolean(this.getAggregation().getEnable())){
					data = this.getAggregatedData(data);
				}
				break;
			default:
				break;
			}
		}
	}
	return data;
};

/** @description Method will return those field which are the types of calculatedField **/
DataSet.prototype.getCalculatedFields = function () {
	/** Removed because calculated field not added in dataSet before drag drop in field section*/
	/*var arr = $.grep(data, function (a) {
		return a.m_type == "CalculatedField" || a.m_fieldtype == "CalculatedField";
	});*/
	/**Added for adding calculated field in the data set*/
	var dataConnArray = this.dashboard.m_DataProviders.m_dataurl;
	for (var i = 0; i < dataConnArray.length; i++) {
		if (this.m_datasource == dataConnArray[i].m_id) {
			var arr = dataConnArray[i].m_calculatedfieldlist;
			break;
		}
	}
	return arr;
};

/** @description Return the data after adding calculated field data  **/
DataSet.prototype.getCalculatedFieldAppendedData = function (fields, data) {
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < fields.length; j++) {
			var expId = this.dashboard.getDataSetExpressions().getDataSetExpressionbyID(fields[j].dataSource +""+ fields[j].id);
			data[i][fields[j].id] = (expId) ? this.getExpressionValue(expId, data[i]) : "";
		}
	}
	return data;
};

/** @description it will evaluate the expression and return the valid value  **/
DataSet.prototype.getExpressionValue = function (dataExpression, data) {
	//	var variables = dataExpression.getVariables();
	var variables = [];
	/**	causing too much iteration as variables keep on adding,	if some variables are not present , it is picking old values **/
	var NameValueMap = {};
	variables = this.appendAllFieldAsVariable(data, variables);
	for (var variableIndex = 0; variableIndex < variables.length; variableIndex++) {
		var val = "";
		if ((variables[variableIndex].m_value.indexOf(".") > -1) && (variables[variableIndex].m_value.substring(0, 1) == "@")) {
			var variableValue = variables[variableIndex].m_value;
			var globalVariableName = variableValue.substring(1, variableValue.length);
			val = this.dashboard.m_GlobalVariable.getFieldValue(globalVariableName, this.dashboard);
		} else {
			/** To Support Data with Comma in it **/
//			if (isNaN(variables[variableIndex].m_value))
//				val = data[variables[variableIndex].m_value];
//			else
				val = getNumericComparableValue(variables[variableIndex].m_value);
		}
//		val = (val == "" || val == null || isNaN(val)) ? null : val ;
//		val = (val == "" || val == null) ? null : val ;
		/** This has to return undefined to get same result for generated calculated values for empty"", undefined and null 
		 * ""+20 should return "", null+30 should return "", undefined+43 shold return "" same as EXCEL operation
		 * "Hello"+20 should return "" in case of numerical operation, if user want it to concat, use JS method ("Hello").concat("-world");
		 * **/
		val = (val == undefined || val == null) ? undefined : val ;
		NameValueMap[variables[variableIndex].m_name] = val;
	}
	var expScript = dataExpression.getExpressionScript().getExpressionScript();
	expScript = this.m_registeredWidget.getValueFromGlobalVariable(expScript, "curly", true);
	var resultValue = this.m_CalculatedField.createDynamicVariableAndEval(NameValueMap, expScript);
	return resultValue;
};

/** @description Create all field name as key-value pair to use in eval to evaluate given expression **/
DataSet.prototype.appendAllFieldAsVariable = function (dataObj, variable) {
	var i = variable.length;
	if (!i){
		i = 0;
	}
	for(var key in dataObj){
		if(dataObj.hasOwnProperty(key)){
			variable[i] = {"m_name" : key + "","m_value" : dataObj[key] + ""};
			i++;
		}
	}
	return variable;
};

/** @description to format the JSON object and get correct variable name, converted from NIV **/
DataSet.prototype.getProperAttributeNameValue = function (json, name) {
	for (var key in json) {
		if(json.hasOwnProperty(key) && key.replace("__", "").replace("_", "") == name) {
			return json[key];
		}
	}
};

/** @description return all the field name available for a dataset **/
DataSet.prototype.getAllFieldNames = function (jsonArray) {
	var fieldNameArr = {};
	for (var i = 0; i < jsonArray.length; i++) {
		for (var key in jsonArray[i]) {
			if(jsonArray[i].hasOwnProperty(key)){
				fieldNameArr[key] = "";
			}
		}
	}
	var allFieldNames = [];
	for (var key1 in fieldNameArr){
		if(fieldNameArr.hasOwnProperty(key1)){
			allFieldNames.push(key1);
		}
	}
	return allFieldNames;
};

/** @description find the global variables from the condition and replace with gv value  **/
DataSet.prototype.convertConditions = function (filterConditionsArray) {
	var filterConditions = [];
	for (var i = 0; i < filterConditionsArray.length; i++) {
		var key = filterConditionsArray[i];
		var str = key;
		try {
			var re = /\{(.*?)\}/g;
			for (var m = re.exec(key); m; m = re.exec(key)) {
				var globalVariableObj = this.dashboard.getGlobalVariable();
				if (globalVariableObj != "" && globalVariableObj != undefined) {
					var globalVarValue = globalVariableObj.getFieldValue(m[1]);
					str = str.replace(m[0], globalVarValue);
				}
			}
		} catch (e) {
			console.log(e);
		}
		filterConditions[i] = str;
	}
	return filterConditions;
};

/** @description This method will add some extra rows in existing data if additional data was added through script **/
DataSet.prototype.getAppendRowsData = function (data) {
	var rows = this.getAppendRows();
	var fields = {};
	for(var j=0; j<data.length; j++){
		for(var key in data[j]){
			if(data[j].hasOwnProperty(key)){
				fields[key] = "";
			}
		}
	}
	for(var i=0; i<rows.length; i++){
		var row = {};
		for(var key1 in fields){
			if(fields.hasOwnProperty(key1)){
				row[key1] = rows[i][key1];
			}
		}
		data.push(row);
	}
	return data;
};

/** @description return unique summery fields for aggregation **/
DataSet.prototype.getUniqueSumeryOpFields = function (aggregation) {
	var opField = {
		"field" : [],
		"operation" : []
	};
	var map = {};
	var fieldSplit = aggregation.getSummaryFields().split(",");
	var opSplit = aggregation.getSummaryOperations().split(",");
	for (var i = 0; i < fieldSplit.length; i++) {
		if (map[fieldSplit[i]] == undefined) {
			map[fieldSplit[i]] = opSplit[i];
			opField.field[i] = fieldSplit[i];
			opField.operation[i] = opSplit[i];
		}
	}
	return opField;
};

/** @description Return the data after aggregation applied **/
DataSet.prototype.getAggregatedData = function (data) {
	var aggregation = this.getAggregation();
	var aggregatedData = data;
	/**	arrange  aggregation information into req formate **/
	var groupByNode = aggregation.getGroupByNode();
	if(groupByNode && groupByNode !== "" && (groupByNode.split(",").length > 1)){
		return this.getMultiDimensionAggregatedData(data);
	}else{
		var summaryoperation = this.getUniqueSumeryOpFields(aggregation).operation;
		var summaryfields = this.getUniqueSumeryOpFields(aggregation).field;
	
		/**	this check not required now, as groupBy is not mandatory now **/
	//	if(groupByNode!="" && groupByNode!="none"){
			/**	convert data into required formate **/
			var dataArr = this.getDataforAggregation(data, groupByNode, summaryfields);
			var groupByNodeArr = dataArr.groupNodeData;
			var fieldMap = dataArr.fieldsData;
	
			/**	calculate aggregation according to given aggregation **/
			aggregation.init(groupByNodeArr, fieldMap, summaryoperation, summaryfields);
			var catser = aggregation.calculate();
			var groupNodedata = catser.groupNode;
			var fieldsDataMap = catser.fieldDataMap;
			fieldsDataMap[groupByNode] = groupNodedata;
	
			/**	reconvert data into originalData formate **/
			aggregatedData = this.getReconvertedData(groupNodedata, fieldsDataMap);
	//	}
			return aggregatedData;
	}
};
DataSet.prototype.getMultiDimensionAggregatedData = function (data) {
	var aggregation = this.getAggregation();
	var aggrDim = aggregation.getGroupByNode().split(",");
	var aggrMeas = this.getUniqueSumeryOpFields(aggregation).field;
	var aggrOpr = this.getUniqueSumeryOpFields(aggregation).operation;
	
	function groupBy( array , callBack ){
		var groups = {};
		array.forEach( function( options ){
			var group = JSON.stringify( callBack(options) );
			groups[group] = groups[group] || [];
			groups[group].push( options );  
		});
		return Object.keys(groups).map( function( group ){
			return groups[group]; 
		})
	}

	var result = groupBy(data, function(item){
		var arr = [];
		for(var i=0; i<aggrDim.length; i++){
			arr[i] = item[aggrDim[i]];
		}
		return arr;
	});
		
	var records = [];
	for(var i=0; i<result.length; i++){
		records[i] = {};
		var measureValArray = {};
		for(var j=0; j<result[i].length; j++){
			for(var k=0; k<aggrDim.length; k++){
				records[i][ aggrDim[k] ] = result[i][j][ aggrDim[k] ];
			}
			for(var l=0; l<aggrMeas.length; l++){
				if(measureValArray[ aggrMeas[l] ] == undefined){
					measureValArray[ aggrMeas[l] ] = [];
				}
				var val = result[i][j][ aggrMeas[l] ];
				measureValArray[ aggrMeas[l] ].push( val );
			}
		}
		for(var m=0; m<aggrOpr.length; m++){
			records[i][ aggrMeas[m] ] = aggregation.calculateAggregation(aggrOpr[m], measureValArray[aggrMeas[m]]);
		}
	}
	return records;
};

/** @description Arrange groupBy summerFields data into array and return **/
DataSet.prototype.getDataforAggregation = function (data, groupByNode, summaryfields) {
	var groupByNodeArr = [];
	var fieldMap = {};
	if (groupByNode != "" && groupByNode != "none") {
		for (var key in data) {
			if (data.hasOwnProperty(key)){
				groupByNodeArr.push("" + data[key][groupByNode] + "");
			}
		}
		fieldMap[groupByNode] = groupByNodeArr;
	} else {
		for (var key1 in data) {
			if (data.hasOwnProperty(key1)){
				groupByNodeArr.push("Sum");
			}
		}
		/**	here groupByNode is blank... we can use all remaining fields name here to show NA as the data **/
		fieldMap[groupByNode] = groupByNodeArr;
	}

	for (var i = 0; i < summaryfields.length; i++) {
		var valueArr = [];
		for (var key2 in data) {
			if (data.hasOwnProperty(key2)) {
				valueArr.push(data[key2][summaryfields[i]]);
			}
		}
		fieldMap[summaryfields[i]] = valueArr;
	}
	return {
		groupNodeData : groupByNodeArr,
		fieldsData : fieldMap
	};
};

/** @description Convert array dimensions **/
DataSet.prototype.getReconvertedData = function (groupNodedata, fieldsDataMap) {
	var fieldData = [];
	for (var i = 0; i < groupNodedata.length; i++) {
		var temp = {};
		for (var key in fieldsDataMap) {
			if(fieldsDataMap.hasOwnProperty(key)){
				temp[key] = (fieldsDataMap[key][i]);
			}
		}
		fieldData[i] = temp;
	}
	return fieldData;
};

/** @description Filter out the dataset according to the given conditions **/
DataSet.prototype.getFilteredData = function (data) {
	var filterConditionsArray = this.convertConditions(this.getDataSetFilter().getConditionsArr());
	var sortedFilterConditionAndRecord = this.getSortedRecords(data, filterConditionsArray);
	var filterConditionsArray = sortedFilterConditionAndRecord[0];
	var filteredRecordsArray = sortedFilterConditionAndRecord[1];
	var limitDataCondition = sortedFilterConditionAndRecord[2];
	var filteredData = sortedFilterConditionAndRecord[1];

	if (filterConditionsArray != "") {
		var index = 0;
		var filteredRecordNumbers = [];
		var fieldnames = this.getAllFieldNames(data);
		var operators =  [ "==", "!=", ">", "<", ">=", "<=" ];
		while (index < filterConditionsArray.length) {
			var formula = filterConditionsArray[index];
			/** Discard empty string given as filter condition **/
			if (formula != "") {
				var formuladub = "";
				/** mapField variable contains the field name on which conditions is written **/
				var mapField = "";
				/** to support OR condition like "City=='Hyderabad'||City=='Bangalore'" **/
				var formulas = formula.split("||");
				for(var f=0; f<formulas.length; f++){
					for(var op=0; op<operators.length; op++){
						var arr = formulas[f].split(operators[op]);
						if(arr.length == 2){
							mapField = arr[0].trim();
						}	
					}
				}
				
				/** If field name is in square bracket "if" condition will execute**/
				if (formula.indexOf('[') > -1 && formula.indexOf(']') > -1){
					for (var p = 0; p < filteredRecordsArray.length; p++) {
						/** Total number of records **/
						for (var q = 0; q < fieldnames.length; q++) {
							/** Number of pairs in one record **/
							var find = "["+fieldnames[q].trim()+"]";
							var isStrictStringCompare;
							var value;
							if (find != "" && formula.indexOf(find) !== -1 && find == mapField ){
								var regbracket = /\[(.*?)\]/g;
								var re = new RegExp(regbracket, "g");
								formuladub = formula.replace(re, "value");
							    isStrictStringCompare = (formula.indexOf("=='") != -1 || formula.indexOf("!='") != -1) ? true : false;
								find = find.replace(/[\[\]']+/g,'');
								if (!isStrictStringCompare) {
								 value = getNumericComparableValue(filteredRecordsArray[p][find]);
								} else {
									value = filteredRecordsArray[p][find];
								}

								var result = true;
								try {
									if (value == undefined)
										result = true;
									else
										eval("result = " + "" + formuladub);
								} catch (e) {
									console.log(e);
									console.log("Invalid Condition( Compare value is string type then enclose it in single quote )");
								}

								if (result == true) {
									/** whole record is pushed in filteredRecordNumbers array, next condition will be evaluated on this array **/
									filteredRecordNumbers.push(filteredRecordsArray[p]);
								}
							}
						}
					}
				}else{
					for (var p = 0; p < filteredRecordsArray.length; p++) {
						/** Total number of records **/
						for (var q = 0; q < fieldnames.length; q++) {
							/** Number of pairs in one record **/
							var find = fieldnames[q].trim();
							if (find != "" && formula.indexOf(find) !== -1 && find == mapField ){
								var re = new RegExp(find, "g");
								formuladub = formula.replace(re, "value");
								isStrictStringCompare = (formula.indexOf("=='") != -1 || formula.indexOf("!='") != -1) ? true : false;

								if (!isStrictStringCompare) {
									value = getNumericComparableValue(filteredRecordsArray[p][find]);
								} else {
									value = filteredRecordsArray[p][find];
								}

								var result = true;
								try {
									if (value == undefined)
										result = true;
									else
										eval("result = " + "" + formuladub);
								} catch (e) {
									console.log(e);
									console.log("Invalid Condition( Compare value is string type then enclose it in single quote )");
								}

								if (result == true) {
									/** whole record is pushed in filteredRecordNumbers array, next condition will be evaluated on this array **/
									filteredRecordNumbers.push(filteredRecordsArray[p]);
								}
							}
						}
					}
				}
				filteredRecordsArray = null;
				filteredRecordsArray = filteredRecordNumbers;
				filteredData = filteredRecordNumbers;
				filteredRecordNumbers = [];
			}
			index++;
		}
	}
	/**	Limit the records after filtering every condition **/
	filteredData = this.getLimitedRecords(filteredData, limitDataCondition);
	return filteredData;
};

/** @description Sort the dataset according to the sort order **/
DataSet.prototype.getSortedRecords = function (data, filterConditionsArray) {
	var newConditionarray = [];
	var newRecordArr = [];
	var sortingCondition = "";
	var limitDataCondition = "";

	for (var i = 0; i < filterConditionsArray.length; i++) {
		if ((filterConditionsArray[i].toLowerCase()).indexOf("order ") != -1 && ((filterConditionsArray[i].toLowerCase()).indexOf(" by ") != -1)) {
			sortingCondition = filterConditionsArray[i];
		} else if ((filterConditionsArray[i].toLowerCase()).indexOf("limit ") != -1) {
			limitDataCondition = filterConditionsArray[i];
		} else {
			newConditionarray.push(filterConditionsArray[i]);
		}
	}
	if (sortingCondition != "" && sortingCondition.match(/\w+|\[[^"]+\]/g).length > 2) {
		if (sortingCondition.indexOf('[') > -1 && sortingCondition.indexOf(']') > -1){
			var sortConditionParams = sortingCondition.match(/\w+|\[[^"]+\]/g);
		}else{
			var sortConditionParams = sortingCondition.split(" ");
		}
		var newArray = [];
		for (var i = 0; i < sortConditionParams.length; i++) {
			if (typeof sortConditionParams[i] == "string" && sortConditionParams[i]) {
				newArray.push(sortConditionParams[i]);
			}
		}
		sortConditionParams = newArray;
		var RecordsArray = data;
		var fieldName = sortConditionParams[2].replace(/[[\]]/g,'');
		var sortOrder = sortConditionParams[3];
		var sortedData = newRecordArr = RecordsArray;
		try {
			var numeric = this.isSortedFieldNumeric(fieldName, RecordsArray);
			var sortedData = this.sortOn(RecordsArray, fieldName, sortOrder, numeric);
			newRecordArr = sortedData;
		} catch (e) {
			console.log(e);
		}
	} else if (limitDataCondition != "") {
		newRecordArr = data;
	} else {
		newConditionarray = filterConditionsArray;
		newRecordArr = data;
	}
	return ([newConditionarray, newRecordArr, limitDataCondition]);
};

/** @description Limit the records in dataset, limit value will be given as filter condition **/
DataSet.prototype.getLimitedRecords = function (filteredData, limitDataCondition) {
	if (limitDataCondition != "") {
		limitDataCondition = limitDataCondition.trim();
		if (limitDataCondition.split("limit").length == 2) {
			var limitStr = limitDataCondition.split("limit");
			if (limitStr[1]) {
				var dataLimit = limitStr[1].trim();
				if (dataLimit.indexOf("~") == -1 && !isNaN(dataLimit * 1)) {
					filteredData = (dataLimit != "" && filteredData.length > dataLimit) ? filteredData.slice(0, dataLimit) : filteredData;
				} else {
					var dataLimit = limitStr[1].trim();
					var dataBetween = dataLimit.split("~");
					if (dataBetween.length == 2 && !isNaN(dataBetween[0].trim() * 1) && !isNaN(dataBetween[1].trim() * 1)) {
						filteredData = filteredData.slice(dataBetween[0].trim(), dataBetween[1].trim());
					}
				}
			}
		}
	}
	return filteredData;
};

/** @description Check for sort field type **/
DataSet.prototype.isSortedFieldNumeric = function (fieldName, RecordsArray) {
	for (var i = 0; i < RecordsArray.length; i++) {
		if (isNaN(RecordsArray[i][fieldName]))
			return false;
	}
	return true;
};

/** @description will apply sort on the field of records **/
DataSet.prototype.sortOn = function (arr, prop, sortOrder, numeric) {
	var temp = this;
	/** Ensure there's a property **/
	if (!prop || !arr) {
		return arr
	}
	/** boolean value for data ordering **/
	var reverse = ((sortOrder === "asc") || (sortOrder === "numasc") || (sortOrder === undefined))?false:true;
	/** Set up sort function **/
	
	/**Sort values by string sorting (order case: "sasc and sdesc") **/
	var sort_by = function (field, rev, primer) {
		/** Return the required a,b function **/
		return function (a, b) {
			/** Reset a, b to the field **/
			a = primer(a[field]),
			b = primer(b[field]);
			/**	Do actual sorting, reverse as needed **/
			return ((a < b) ? -1 : ((a > b) ? 1 : 0)) * (rev ? -1 : 1);
		}
	}
	
	/**Sort values by numeric sorting (order case: "asc and desc") **/
	var sort_by_numeric = function (field, rev, primer) {
		/** Return the required a,b function **/
		return function (a, b) {
			a = primer(a[field]),
			b = primer(b[field]);
			if(isNaN(a)){
	          return 1;
	        }else if(isNaN(b)){
	          return -1;
	        }else{
	        	return ((a < b) ? -1 : ((a > b) ? 1 : 0)) * (rev ? -1 : 1);
	        }
		}
	}
	/**	Distinguish between numeric and string to prevent 100's from coming before smaller	e.g. 1, 20, 3, 4000, 50 **/
	if(sortOrder === "asc" || sortOrder === "desc"){
		if(numeric){
			/** Do sort "in place" with sort_by function **/
			arr.sort(sort_by(prop, reverse, function (a) {
				/**	- Force value to a string.	- Replace any non numeric characters.	- Parse as float to allow 0.02 values **/
				return parseFloat(String(a).replace(/[^0-9.-]+/g, ""));
			}));
		}else{
			/** Do sort "in place" with sort_by function **/
			arr.sort(sort_by(prop, reverse, function (a) {
				/** Force value to string **/
				return String(a).toUpperCase();
			}));
		}
		return arr;
	}else{
		arr.sort(sort_by_numeric(prop, reverse, function (a) {
			/** if value is comma seperated, it will remove comma and will pass numeric value **/
			var str1 = String(a);
	        str1.replace(/\,/g,"");
	        a = str1.replace(/\,/g,"");
	        /** Pass numeric value **/
			return (a*1);
		}));
		return arr;
	}
};

/** @description Calculate the automanipulator and set the fields and data accordingly **/
DataSet.prototype.getAutoManipulatorData = function (data) {
	var catGroup = this.getAutoManipulator().getCategoryGroup();
	var agOperation = this.getAutoManipulator().getAggregationOperation();
	var temp_category = this.geCategoryNameFromCatGroup(data, catGroup);
	var uniqueCategory = this.getUniqueCatNames(temp_category);
	var serGroup = this.getAutoManipulator().getSeriesGroup();
	var valueField = this.getAutoManipulator().getValueField();
	var subCategory = this.m_AutoManipulator.m_subcategorygroup;
	var allUniqueSeriesNames = [];
	if (subCategory == undefined) {
	    allUniqueSeriesNames = this.getSeriesNamesFromUniqueCategorys(data, uniqueCategory, catGroup, serGroup, valueField);
	    return this.getSeriesNamesDataFromSerGroup(data, uniqueCategory, catGroup, serGroup, valueField, allUniqueSeriesNames, agOperation);
	} else {
	    //When subcategory didnot pass from script, Manipulated data will be calculated accordingly
	    var temp_subcategory = this.geCategoryNameFromCatGroup(data, subCategory);
	    var uniquesubCategory = this.getUniqueCatNamesByCat(temp_subcategory,uniqueCategory,data,catGroup,subCategory);
	    var uniquesubCategoryArr = this.getUniqueCatNamesByCatArr(temp_subcategory,uniqueCategory,data,catGroup,subCategory);
	    allUniqueSeriesNames = this.getSeriesNamesFromUniqueSubCategorys(data, uniquesubCategory, subCategory, serGroup, valueField);
	    return this.getSeriesNamesDataFromSerGroupWithSubCat(data, uniqueCategory, catGroup, uniquesubCategoryArr, subCategory, serGroup, valueField, allUniqueSeriesNames, agOperation);
	}
};
/** @description calculate seriesdata for series **/
DataSet.prototype.getSeriesNamesDataFromSerGroupWithSubCat = function (data, uniqueCategory, catGroup, uniquesubCategory, subCategory, serGroup, valueField, allUniqueSeriesNames, agOperation) {
	/**Getting series names according to category and subcategory fields**/
	var automanipulatordataArray = [];
	var automanipulatordata = [];
	for(var a = 0; a < uniqueCategory.length; a++){
		for(var b = 0; b < uniquesubCategory[a].length; b++){
			automanipulatordataArray[b] = {};
			automanipulatordataArray[b][catGroup] = uniqueCategory[a];
			automanipulatordataArray[b][subCategory] = uniquesubCategory[a][b];
			for (var i = 0; i < allUniqueSeriesNames.length; i++) {
				var matchedArr = [];
				for (var q = 0; q < data.length; q++) {
					if (uniqueCategory[a] == data[q][catGroup] && uniquesubCategory[a][b] == data[q][subCategory] && allUniqueSeriesNames[i] == data[q][serGroup]) {
						matchedArr.push( (data[q][valueField] !== undefined ) ? data[q][valueField] : "" );
					}
				}
				automanipulatordataArray[b][allUniqueSeriesNames[i]] = this.getValueForAutomaipulatorResultArray(matchedArr, agOperation);
			}
		}
		automanipulatordata.push.apply(automanipulatordata,automanipulatordataArray);
	}
	return automanipulatordata;
};
DataSet.prototype.getUniqueCatNamesByCatArr = function (subcat,uniqueCat,data,catGroup,subCategory){
	/**Getting respective series data, according to category and subcategory fields**/
	var allfieldByCat = [];
	for(var i = 0; i < uniqueCat.length; i++){
		var fieldByCat = [];
		for(var j = 0; j < data.length; j++){
			if(data[j][catGroup] === uniqueCat[i]){
				fieldByCat.push(data[j][subCategory]);
			}
		}
		allfieldByCat.push(fieldByCat);
	}
	var finalFieldByCat = [];
	for(var k = 0; k < allfieldByCat.length; k++){
		finalFieldByCat.push(this.getUniqueCatNames(allfieldByCat[k]));
	}
	return finalFieldByCat;
};
DataSet.prototype.getValueForAutomaipulatorResultArray = function (arr, op) {
	if (arr && arr.length > 0) {
		if(op === "first") {
			return arr[0];
		} else if(op === "last") {
			return arr[arr.length-1];
		} else {
			return getAggregationOperatedData(arr, op);
		}
	} else {
		return "";
	}
};
DataSet.prototype.getSeriesNamesFromUniqueSubCategorys = function (data, uniqueCategory, catGroup, serGroup, valueField) {
	this.m_seriesNamesCategoryWise = "";
	var allSeriesNames = [];
	var temp_seriesNames = [];
	var temp_seriesData = [];
	for (var p = 0; p < uniqueCategory.length; p++) {
		temp_seriesNames[p] = [];
		temp_seriesData[p] = [];
		for (var q = 0; q < data.length; q++) {
			if (uniqueCategory[p] == data[q][catGroup]) {
				if (data[q][serGroup]) {
					temp_seriesNames[p].push(data[q][serGroup]);
					allSeriesNames.push(data[q][serGroup]);
				}
			}
		}
	}
	this.m_seriesNamesCategoryWise = temp_seriesNames;
	var allUniqueSeriesNames = [];
	allUniqueSeriesNames = this.getUniqueCatNames(allSeriesNames);
	return allUniqueSeriesNames;
};
/** @description Will return the data for catGroup field **/
DataSet.prototype.geCategoryNameFromCatGroup = function (data, catGroup) {
	var temp_category = [];
	for (var i = 0; i < data.length; i++) {
		if (data[i][catGroup]) {
			temp_category.push(data[i][catGroup]);
		}
	}
	return temp_category;
};

/** @description returns unique values from the category data **/
DataSet.prototype.getUniqueCatNames = function (temp_category) {
	function onlyUnique(value, index, self) {
		return self.indexOf(value) == index;
	}
	return temp_category.filter(onlyUnique);
};

/** @description Find the series for automanipulator **/
DataSet.prototype.getSeriesNamesFromUniqueCategorys = function (data, uniqueCategory, catGroup, serGroup, valueField) {
	this.m_seriesNamesCategoryWise = "";
	var allSeriesNames = [];
	var temp_seriesNames = [];
	var temp_seriesData = [];
	for (var p = 0; p < uniqueCategory.length; p++) {
		temp_seriesNames[p] = [];
		temp_seriesData[p] = [];
		for (var q = 0; q < data.length; q++) {
			if (uniqueCategory[p] == data[q][catGroup]) {
				if (data[q][serGroup]) {
					temp_seriesNames[p].push(data[q][serGroup]);
					allSeriesNames.push(data[q][serGroup]);
				}
			}
		}
	}
	this.m_seriesNamesCategoryWise = temp_seriesNames;
	var allUniqueSeriesNames = [];
	allUniqueSeriesNames = this.getUniqueCatNames(allSeriesNames);
	return allUniqueSeriesNames;
};

/** @description calculate seriesdata for series **/
DataSet.prototype.getSeriesNamesDataFromSerGroup = function (data, uniqueCategory, catGroup, serGroup, valueField, allUniqueSeriesNames, agOperation) {
	var automanipulatordata = [];
	for (var p = 0; p < uniqueCategory.length; p++) {
		automanipulatordata[p] = {};
		automanipulatordata[p][catGroup] = uniqueCategory[p];
		for (var i = 0; i < allUniqueSeriesNames.length; i++) {
			var matchedArr = [];
			for (var q = 0; q < data.length; q++) {
				if (uniqueCategory[p] == data[q][catGroup] && allUniqueSeriesNames[i] == data[q][serGroup]) {
					matchedArr.push( (data[q][valueField] !== undefined) ? data[q][valueField] : "" );
				}
			}
			automanipulatordata[p][allUniqueSeriesNames[i]] = this.getValueForAutomaipulatorResultArray(matchedArr, agOperation);
		}
	}
	return automanipulatordata;
};

/** @description register widget with the dataset **/
DataSet.prototype.registerWidgetsWithDataSet = function (component) {
	this.m_registeredWidget = component;
};

/** @description getter method of registered widget **/
DataSet.prototype.getRegisteredWidget = function () {
	return this.m_registeredWidget;
};

/** Fields -> store the details of each field in dataset **/
function Fields() {
	this.m_displayfield = "";
	this.m_value = "";
	this.m_charttype = "";
	this.m_plotradius = "";
	this.m_color = "0";
	this.m_displayname = "";
	this.m_otherfield = "";
	this.m_precision = "0";
	this.m_name = "";
	this.m_radiusfield = "";
	this.m_type = "";
	this.m_axis = "";
	this.m_formula = "";
	this.m_visible = "true";
	this.m_fexprn = "";
	//	filters
	this.m_hierarchytype = "";
	this.m_defaultchild = "";
	this.m_additionalfields = "";
	//	ScoreCard
	this.m_formatter = "";
	this.m_align = "center";
	this.m_isWeb = "";
	this.m_expressionid = "";
	this.m_textalign = "center";
};

Fields.prototype.getFormatter = function () {
	return this.m_formatter;
};

Fields.prototype.getdisplayField = function () {
	return this.m_displayfield;
};
Fields.prototype.getvalue = function () {
	return this.m_value;
};
Fields.prototype.getChartType = function () {
	return this.m_charttype;
};
Fields.prototype.getPlotRadius = function () {
	return this.m_plotradius;
};
Fields.prototype.getColor = function () {
	return this.m_color;
};
Fields.prototype.getDisplayName = function () {
	return this.m_displayname;
};
Fields.prototype.getOtherField = function () {
	return this.m_otherfield;
};
Fields.prototype.getPrecision = function () {
	return this.m_precision;
};
Fields.prototype.getName = function () {
	return this.m_name;
};
Fields.prototype.getRadiusField = function () {
	return this.m_radiusfield;
};
Fields.prototype.getType = function () {
	return this.m_type;
};
Fields.prototype.getAxis = function () {
	return this.m_axis;
};
Fields.prototype.getFormula = function () {

	return this.m_formula;
};
Fields.prototype.setVisible = function (visible) {
	this.m_visible = visible;
};
Fields.prototype.getVisible = function () {
	return this.m_visible;
};
Fields.prototype.getFexpr = function () {
	return this.m_fexprn;
};

Fields.prototype.gethierarchyType = function () {
	return this.m_hierarchytype;
};
Fields.prototype.getdefaultchild = function () {
	return this.m_defaultchild;
};
Fields.prototype.getadditionalFields = function () {
	return this.m_additionalfields;
};

Fields.prototype.getIsWeb = function () {
	return this.m_isWeb;
};
Fields.prototype.getTextAlign = function () {
	return this.m_textalign;
};

/** Aggregation -> according to given configuration, aggregate the dataset **/
function Aggregation() {
	this.m_groupbynode = "";
	this.m_summaryoperations = "";
	this.m_enable = "";
	this.m_summaryfields = "";
};

Aggregation.prototype.getGroupByNode = function () {
	return this.m_groupbynode;
};
Aggregation.prototype.getSummaryOperations = function () {
	return this.m_summaryoperations;
};
Aggregation.prototype.setSummaryOperations = function (summaryoperations) {
	return this.m_summaryoperations = summaryoperations;
};
Aggregation.prototype.getEnable = function () {
	return this.m_enable;
};
Aggregation.prototype.getSummaryFields = function () {
	return this.m_summaryfields;
};
Aggregation.prototype.setSummaryOperations = function (reqAggregationOperation) {
	this.m_summaryoperations = reqAggregationOperation;
};
Aggregation.prototype.init = function (groupByNode, fieldsData, summaryOperation, summaryFields) {
	this.groupByNode = groupByNode;
	this.fieldsData = fieldsData;
	this.summaryOperation = summaryOperation;
	this.summaryFields = summaryFields;

	Array.prototype.contains = function (v) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] === v) {
				return true;
			}
		}
		return false;
	};
	Array.prototype.unique = function () {
		var arr = [];
		for (var i = 0; i < this.length; i++) {
			if (!arr.contains(this[i])) {
				arr.push(this[i]);
			}
		}
		return arr;
	};
};
Aggregation.prototype.calculate = function () {
	var uniqueData = this.groupByNode.unique();
	var aggArr = [];
	for (var k = 0; k < this.summaryFields.length; k++) {
		for (var i = 0; i < uniqueData.length; i++) {
			aggArr[i] = [];
			for (var j = 0; j < this.groupByNode.length; j++) {
				if (uniqueData[i] == this.groupByNode[j]) {
					var value = getNumericComparableValue(this.fieldsData[this.summaryFields[k]][j]);
					aggArr[i].push(value);
				}
			}
		}
		var tempArr = [];
		for (var i1 = 0; i1 < aggArr.length; i1++) {
			tempArr.push(this.calculateAggregation(this.summaryOperation[k], aggArr[i1]));
		}
		this.fieldsData[this.summaryFields[k]] = tempArr;
	}
	return {
		groupNode : uniqueData,
		fieldDataMap : this.fieldsData
	};
};
Aggregation.prototype.calculateAggregation = function (operation, values) {
	var operation = (operation) ? operation.toLowerCase() : "sum";
	return getAggregationOperatedData(values, operation);
};

/** Aggregation Calculation methods to get aggregated dataset **/
function AggregationCalculation() {
	this.m_catArray;
	this.m_seriesArray;
	this.m_operation;

	/** added for implement AggregationCalculation grid **/
	this.groupByNode;
	this.fieldsData;
	this.summaryOperation;
	this.summaryFields;
};
AggregationCalculation.prototype.init = function (catarr, seriesarr, operation) {
	this.m_catArray = catarr;
	this.m_seriesArray = seriesarr;
	this.m_operation = operation;

	Array.prototype.contains = function (v) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] === v) {
				return true;
			}
		}
		return false;
	};
	Array.prototype.unique = function () {
		var arr = [];
		for (var i = 0; i < this.length; i++) {
			if (!arr.contains(this[i])) {
				arr.push(this[i]);
			}
		}
		return arr;
	};
};
AggregationCalculation.prototype.calculate = function () {
	var uniqueCat = [];
	var m_sameDataTypedCategory = [];
	/** converting each value to string type , so comparison can be done if data is like  '2012' and 2012 **/
	for (var i = 0; i < this.m_catArray.length; i++) {
		m_sameDataTypedCategory.push("" + this.m_catArray[i] + "");
	}
	uniqueCat = m_sameDataTypedCategory.unique();
	/** for every unique category, an array is generated dynamically and corresponding values has been pushed **/
	var aggArr = [];
	for (var i = 0; i < uniqueCat.length; i++) {
		var darr = "aggArr[" + i + "]= [];";
		eval(darr);
		for (var j = 0; j < m_sameDataTypedCategory.length; j++) {
			if (uniqueCat[i] == m_sameDataTypedCategory[j]) {
				/**	each array contain all the values of one type of category */
				eval("aggArr[" + i + "].push(this.m_seriesArray[j])");
			}
		}
	}
	var aggSeries = [];
	this.m_operation = this.m_operation.split(",");
	var temp = this;
	for (var i1 = 0; i1 < uniqueCat.length; i1++) {
//		eval( "aggSeries["+i1+"] = temp."+this.m_operation[i1]+"(aggArr["+i1+"]);");
		if (aggArr[i1][0] != undefined)
			aggSeries[i1] = this.SUM(aggArr[i1]);
	}
	return {
		category : uniqueCat,
		series : aggSeries
	};
};
AggregationCalculation.prototype.init1 = function (groupByNode, fieldsData, summaryOperation, summaryFields) {
	this.groupByNode = groupByNode;
	this.fieldsData = fieldsData;
	this.summaryOperation = summaryOperation;
	this.summaryFields = summaryFields;

	Array.prototype.contains = function (v) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] === v) {
				return true;
			}
		}
		return false;
	};
	Array.prototype.unique = function () {
		var arr = [];
		for (var i = 0; i < this.length; i++) {
			if (!arr.contains(this[i])) {
				arr.push(this[i]);
			}
		}
		return arr;
	};
};
AggregationCalculation.prototype.calculate1 = function () {
	var uniqueData = this.groupByNode.unique();
	var aggArr = [];
	for (var k = 0; k < this.summaryFields.length; k++) {
		for (var i = 0; i < uniqueData.length; i++) {
			aggArr[i] = [];
			for (var j = 0; j < this.groupByNode.length; j++) {
				if (uniqueData[i] == this.groupByNode[j]) {
					var value = getNumericComparableValue(this.fieldsData[this.summaryFields[k]][j]);
					aggArr[i].push(value);
				}
			}
		}
		var tempArr = [];
		for (var i1 = 0; i1 < aggArr.length; i1++) {
			tempArr.push(this.calculateAggregation(this.summaryOperation[k], aggArr[i1]));
		}
		this.fieldsData[this.summaryFields[k]] = tempArr;
	}
	return {
		groupNode : uniqueData,
		fieldDataMap : this.fieldsData
	};
};
AggregationCalculation.prototype.calculateAggregation = function (operation, values) {
	var operation = operation.toLowerCase();
	switch (operation) {
	case "sum":
		var sum = "";
		for (var i = 0; i < values.length; i++) {
			if (!isNaN(values[i]) && values[i] != "")
				sum = sum * 1 + values[i] * 1;
		}
		return sum;
	case "avg":
		var sum = "";
		for (var i = 0; i < values.length; i++) {
			if (!isNaN(values[i]) && values[i] != "")
				sum = sum * 1 + values[i] * 1;
		}
		if (sum != "")
			return sum / values.length;
		else
			return "";
	case "max":
		var max = values[0];
		for (var i = 0; i < values.length; i++) {
			if (!isNaN(values[i]) && values[i] != "")
				if (values[i] > max)
					max = values[i];
		}
		return max;
	case "min":
		var min = values[0];
		for (var i = 0; i < values.length; i++) {
			if (!isNaN(values[i]) && values[i] != "")
				if (values[i] < min)
					min = values[i];
		}
		return min;
	case "count":
		return values.length;
	default:
		return;
	}
};
AggregationCalculation.prototype.SUM = function (valuess) {
	var sum = [];
	/**	two, loop to get sum for each stack , i=zero===> first stack values of each unique category  is added **/
	var temp = 0;
	for (var i = 0; i < valuess[0].length; i++) {
		for (var j = 0; j < valuess.length; j++) {
			if (valuess[j][i] === "") {}
			else {
				temp += (valuess[j][i]) * 1;
			}
		}
	}
	/** sum is one d array hold the aggregated values for each unique category **/
	sum[0] = temp;
	return sum;
};
AggregationCalculation.prototype.AVG = function (values) {
	var avg = [];
	var sum = this.SUM(values);
	for (var i = 0; i < values[0].length; i++) {
		avg[i] = sum[i] / values.length;
	}
	return avg;
};
AggregationCalculation.prototype.MAX = function (values) {
	var max = [];
	for (var i = 0; i < values[0].length; i++) {
		var maxVal = 0;
		for (var j = 0; j < values.length; j++) {
			if (parseInt(values[j][i]) > parseInt(maxVal)) {
				maxVal = values[j][i];
			}
		}
		max[i] = maxVal;
	}
	return max;
};
AggregationCalculation.prototype.MIN = function (values) {
	var min = [];
	for (var i = 0; i < values[0].length; i++) {
		var minval = values[0][i];
		for (var j = 0; j < values.length; j++) {
			if (values[j][i] < minval) {
				minval = values[j][i];
			}
		}
		min[i] = minval;
	}
	return min;
};
AggregationCalculation.prototype.COUNT = function (values) {
	var count = [];
	for (var i = 0; i < values[0].length; i++) {
		var counter = 0;
		for (var j = 0; j < values.length; j++) {
			if (parseInt(values[j][i])) {
				counter++;
			}
		}
		count[i] = counter;
	}
	return count;
};

/** Automanipulator -> Parse the data and create category and series fields from data according to given parameters **/
function AutoManipulator() {
	this.m_additionalfield = "";
	this.m_enable = "";
	this.m_seriesgroup = "false";
	this.m_categorygroup = "";
	this.m_valuefield = "";
	this.m_agoperation = "last";
};
AutoManipulator.prototype.getAdditionalField = function () {
	return this.m_additionalfield;
};
AutoManipulator.prototype.getEnable = function () {
	return this.m_enable;
};
AutoManipulator.prototype.getSeriesGroup = function () {
	return this.m_seriesgroup;
};
AutoManipulator.prototype.getCategoryGroup = function () {
	return this.m_categorygroup;
};
AutoManipulator.prototype.getValueField = function () {
	return this.m_valuefield;
};
/** aggregate operation for the automanipulator resultset **/
AutoManipulator.prototype.getAggregationOperation = function () {
	return this.m_agoperation;
};

/** CalculatedField -> to add a field in dataset which is being calculated on given condition **/
function CalculatedFields() {
	this.m_recordsObj = "";
	this.m_seriesName = "";
	this.m_formula = "";
};
CalculatedFields.prototype.init = function (recordsObj, seriesName, formula) {
	this.m_recordsObj = recordsObj;
	this.m_seriesName = seriesName;
	this.m_formula = formula;
};
CalculatedFields.prototype.createDynamicVariableAndEval = function (NameValueMap, expScript) {
	/**Flag true,If Calc Script is having Bracket**/
	if(/\[(.*?)\]/g.exec(expScript) != null){
		var scriptFlag = true;
	}
	/**Replacing NameValueMap Keys with single character, to minimize issue in eval()**/
	if(IsBoolean(scriptFlag)){
		var replacedVar = "x";
		var map = {};
		var i = 0;
		Object.keys(NameValueMap).forEach(function(key) {
		  var replaced = replacedVar + (i++);
		  map[key] = replaced;
		  if (key !== replaced) {
			  NameValueMap[replaced] = NameValueMap[key];
		    delete NameValueMap[key];
		  }
		});
	}else{
		NameValueMap = JSON.parse(JSON.stringify(NameValueMap).replace(/\s(?=\w+":)/g, ""));
	}
	
	for (var name in NameValueMap) {
		var variableName = IsBoolean(scriptFlag)?name:name.replace(/[[\]]/g, "").replace(/@/g, "").replace(/\./g, "_");
		try {
			if( isNaN(NameValueMap[name]) ){
				eval("var " + variableName + " = '" + NameValueMap[name] + "';");
			}
			else{
				eval("var " + variableName + " = " + NameValueMap[name] + ";");
			}
		} catch (e) {
			//console.log(e);DAS-865 shows console error when data is ""
			console.log("Invalid column name: '" + variableName + "'");
		}
		if (name.indexOf(".") > -1) {
			expScript = expScript.replace(name.replace(/[[\]]/g, ""), variableName);
		}
	}
	try {
		if(IsBoolean(scriptFlag)){
			/**Will replace string inside square bracket with their respective keys**/
			while(/\[(.*?)\]/g.exec(expScript) != null) { 
				expScript = expScript.replace( /\[(.*?)\]/g.exec(expScript)[0], map[/\[(.*?)\]/g.exec(expScript)[1]] ); 
			}
		}else{
			expScript = expScript.replace(/[[\]]/g, "").replace(/@/g, "");
		}
		var resultOfScript = eval(expScript + ";");
	} catch (ex) {
		console.log(ex);
	}
	return resultOfScript;
};
CalculatedFields.prototype.addCalculatedFieldValueInSeries = function (chartObj, calFieldName, categoryDataLength, totalData) {
	var expObj = chartObj.m_dashboard.getDataSetExpressions().getDataSetExpressionbyID(calFieldName);
	var expScript = chartObj.m_dashboard.getDataSetExpressions().getDataSetExpressionbyID(calFieldName).getExpressionScript().getExpressionScript();
	var variables = expObj.getVariables();
	var data = totalData.m_fieldNameValues;

	var calculatedFieldData = [];
	var NameValueMap = {};
	for (var categoryDataIndex = 0; categoryDataIndex < categoryDataLength; categoryDataIndex++) {
		for (var variableIndex = 0; variableIndex < variables.length; variableIndex++) {
			var val = "";
			if ((variables[variableIndex].m_value.indexOf(".") > -1) && (variables[variableIndex].m_value.substring(0, 1) == "@")) {
				var variableValue = variables[variableIndex].m_value;
				var globalVariableName = variableValue.substring(1, variableValue.length);
				val = chartObj.m_dashboard.m_GlobalVariable.getFieldValue(globalVariableName, chartObj.m_dashboard);
			} else {
				if (isNaN(variables[variableIndex].m_value))
					val = data[categoryDataIndex][variables[variableIndex].m_value];
				else
					val = variables[variableIndex].m_value;
			}

			if (val == "" || val == null || isNaN(val))
				val = 0;
			NameValueMap[variables[variableIndex].m_name] = val;
		}

		try {
			var resultValue = this.createDynamicVariableAndEval(NameValueMap, expScript);

			if (!isNaN(resultValue))
				calculatedFieldData[categoryDataIndex] = resultValue;
			else
				calculatedFieldData[categoryDataIndex] = 0;
		} catch (e) {
			alertPopUpModal({type:'error', message:'Calculated Field: ' + e, timeout: '3000'});
		}
	}
	return calculatedFieldData;
};

/** DataSetFilter to get filter, sorting, limit conditions on dataset **/
function DataSetFilter() {
	this.m_condition;
	this.m_conditionsArr = [];
};
DataSetFilter.prototype.getCondition = function () {
	return this.m_condition;
};
DataSetFilter.prototype.getConditionsArr = function () {
	return this.m_conditionsArr;
};
DataSetFilter.prototype.conditionSplitter = function () {
	var filterCondition = this.getCondition();
	if (filterCondition.indexOf(",") != -1) {
		this.commaSplitArr = filterCondition.split(",");
		this.m_conditionsArr = this.commaSplitArr;
	} else {
		this.m_conditionsArr.push(filterCondition);
	}
};
//# sourceURL=DataManager.js