/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: GlobalVariableController.js
 * @description Contains global variable management in the dashboard
 * */

/**
 * @description Constructor GlobalVariableController
 * */
function GlobalVariableController() {
	this.dashboard = "";
};
/**
 * @description initializing gv controller 
 * @param {Object} dashboard: dashboard object
 * */
GlobalVariableController.prototype.init = function (dashboard) {
	this.dashboard = dashboard;
};
/**
 * @description update the values of global variables and calls notify
 * @param {Object} componentObject: reference of clicked component
 * @param {Object} fieldNameValueMap: data of clicked datapoint
 * @param {String} drillColor: hexadecimal color code when clicked on a datapoint 
 * */
GlobalVariableController.prototype.updateGlobalVariable = function (componentObject, fieldNameValueMap, drillColor) {
	if (this.dashboard != "") {
		var globalVariableObj = this.dashboard.getGlobalVariable();
		if (globalVariableObj != "" && globalVariableObj != undefined) {
			var variableObj = globalVariableObj.map[componentObject.getGlobalKey()];
			if (variableObj != undefined) {
				if (drillColor != "" && drillColor != undefined) {
					/** null is coming when we are updating gv from connections user script
						we should not update drill color as it will replace the existing drill color
					**/
					variableObj.updateDrillColor(drillColor);
				}
				variableObj.m_notifychange = ((componentObject.m_notifychange != undefined) ? componentObject.m_notifychange : true);
				variableObj.update(fieldNameValueMap);
			}
		}
	}
};
/**
 * @description update the values of global variables attribute only  
 * @param {String} globalKey: get gv reference from this key
 * @param {String} attributeName: attribute name of the globalvariable
 * @param {String} attributeValue: value of the atribute 
 * */
GlobalVariableController.prototype.updateGlobalVarAttribute = function (globalKey, attributeName, attributeValue) {
	if (this.dashboard != "") {
		var globalVariableObj = this.dashboard.getGlobalVariable();
		if (globalVariableObj != "" && globalVariableObj != undefined) {
			var variableObj = globalVariableObj.map[globalKey];
			if (variableObj != undefined) {
				variableObj.updateAttribute(attributeName, attributeValue);
			}
		}
	}
};

/*********************************************************************************/
 
/**
 * @description constructor GlobalVariable 
 * */
function GlobalVariable() {
	this.m_Variable = [];
	this.map = new Object();
};
/**
 * @description Setter method of variable object
 * @param {Object} Variable: Variable reference 
 * */
GlobalVariable.prototype.setVariable = function (Variable) {
	this.m_Variable.push(Variable);
};
/**
 * @description Getter method of variable object
 * return {Object} Variable: Variable reference 
 * */
GlobalVariable.prototype.getVariable = function () {
	return this.m_Variable;
};
/**
 * @description Set the variable class references in this class 
 * @param {Object} globalVariable: one globalVariable reference  
 * */
GlobalVariable.prototype.setGlobalVariables = function (globalVariable) {
	this.createKeyVariableObjectMap(globalVariable);
};
/**
 * @description get the global key from variable class which will be used as key 
 * @param {Object} globalVariable: one globalVariable reference  
 * */
GlobalVariable.prototype.createKeyVariableObjectMap = function (globalVariable) {
	var key = globalVariable.getkey();
	this.createMap(key, globalVariable);
};
/**
 * @description adding a key-value pair to the map 
 * @param {String} key: globalKey of a variable class  
 * @param {Object} value: reference of variable class
 * */
GlobalVariable.prototype.createMap = function (key, value) {
	this.map[key] = value;
};
/**
 * @description Getter method to get all the default attributes and values  
 * @param {Object} globalVariable: reference of variable class
 * return {Object} Array of Strings which has attribute:default_values 
 * */
GlobalVariable.prototype.getDefaultValueParameters = function (globalVariable) {
	//DefaultValue="{m_display:SEP13,m_index:21}
	var defaultValue = globalVariable.getdefaultValue();
	var re = new RegExp("\{(.*?)\}");
	var commasplitParameters = [];
	if (defaultValue != null && defaultValue != "") {
		var matchedString = defaultValue.match(re);
		if (matchedString.length == 2)
			commasplitParameters = matchedString[1].split(",");
	}
	return commasplitParameters;
};
/**
 * @description Add a key in variable class's map object
 * @param {String} key: name of the key to find variable class reference 
 * @param {String} fieldName: add a new key in the map object of variable class
 * */
GlobalVariable.prototype.addField = function (key, fieldName) {
	var variable = this.map[key];
	variable.createField(fieldName);
};
/**
 * @description Add a key-value in variable class's map object by splitting it from "." 
 * @param {String} key: name of the key to find variable class reference 
 * @param {String} fieldValue: 
 * */
GlobalVariable.prototype.addFieldByKey = function (key, fieldValue) {
	/** fieldValue = "gv10.val"; **/
	var fields = key.split("\\.");
	if (fields.length === 2) {
		this.addFieldValueByKeyAndField(fields[0], fields[1], fieldValue);
	}
};
/**
 * @description Add a key-value in variable class's map object  
 * @param {String} key: name of the key to find variable class reference 
 * @param {String} fieldName: name of the key to update in variable class's map object
 * @param {String} fieldValue: value for the key to update in variable class's map object
 * */
GlobalVariable.prototype.addFieldValueByKeyAndField = function (key, fieldName, fieldValue) {
	var variable = this.map[key];
	variable.createFieldValue(fieldName, fieldValue);
};
/**
 * @description Getter method to fetch value of a gv string  
 * @param {String} key: name of the key to find variable class reference 
 * return {String} value for the key from variable class's map object
 * */
GlobalVariable.prototype.getFieldValue = function (key) {
	/** here the parameter will be like "resource.resource_name" **/
	var fields = key.split(".");
	if (fields.length == 2) {
		return this.getFieldValueByKeyAndField(fields[0], fields[1]);
	} else if (fields.length == 3) {
		var map = this.getFieldValueByKeyAndField(fields[0], fields[1])
		if(map){
			return map[fields[2]];
		}else{
			return key;
		}
	} else {
		return key;
	}
};
/**
 * @description Get the average value from complete array of values(Deprecated for grid-gauge update)  
 * @param {String} key: name of the key to find variable class reference 
 * @param {String} field: name of the key to find values from variable class's map object
 * return {Number} average value for the key from variable class's map object
 * */
GlobalVariable.prototype.getFieldValueByKeyAndField = function (key, field) {
	if (field.indexOf("@") == -1) {
		var variable = this.map[key];
		if (variable != undefined)
			return variable.getFieldValue(field);
	} else {
		var re = new RegExp("\@(.*?)\@");
		var matchedStr = field.match(re);
		field = field.replace(matchedStr[0], "");
		/** op was given as AVG in the string  such as "resource.spendHrs@AVG" **/
		var op = matchedStr[1].replace(matchedStr[0], "");
		variable = this.map[key];
		if (variable != undefined) {
			this.reqColumnDataArr = variable.getFieldValueArray(field);
			if (this.reqColumnDataArr == "" || this.reqColumnDataArr == undefined) {
				return 0;
			} else {
				return eval("this.get" + op + "();");
			}
		}
	}
};
/**
 * @description Get the average value from complete array of values(Deprecated)  
 * return {Number} average of the array
 * */
GlobalVariable.prototype.getAVG = function () {
	var sum = 0;
	for (var i = 0; i < this.reqColumnDataArr.length; i++) {
		sum = sum * 1 + this.reqColumnDataArr[i] * 1;
	}
	var avg = ((sum / this.reqColumnDataArr.length).toFixed(1)) * 1;
	return avg;
};

/*********************************************************************************/

/**
 * @description Constructor Variable 
 * */
function Variable() {
	this.m_key = "";
	this.m_defaultvalue = "";

	this.m_DataProviderMap = "";
	this.m_DataSetMap = "";
	this.m_VisibilityTriggerMap = "";
	this.m_defaultValues = [];

	this.map = new Object();
	this.fieldNameDataArraymap = new Object(); //
	this.m_observer = [];
	this.m_observerDsetId = [];
	this.m_defaultValuekeys = [];

	this.m_observerDataProvider = [];
	this.m_observerDataSet = [];
	this.m_observerWidget = [];

	this.m_observerWidgetsForDrillColor = [];

	this.m_dashboard = "";
	this.specialValues = ["#SYSTEM.DATE"];
	//UserScriptExecuter
	this.userScript = "";
	/** Added to control the script execution after global variable update **/
	this.m_notifychange = true;
};
/**
 * @description Setter of userScript class reference 
 * @param {Object} userScript object
 * */
Variable.prototype.setUserScript = function (userScript) {
	this.userScript = userScript;
};
/**
 * @description Setter of DataProvider 
 * @param {Object} DataProviderMapObj object
 * */
Variable.prototype.setDataProviderMap = function (DataProviderMapObj) {
	this.m_DataProviderMap = DataProviderMapObj;
};
/**
 * @description Getter of DataProvider 
 * @return {Object} DataProviderMapObj object
 * */
Variable.prototype.getDataProviderMap = function () {
	return this.m_DataProviderMap;
};
/**
 * @description Setter of DataSet
 * @param {Object} DataSetMapObj object
 * */
Variable.prototype.setDataSetMap = function (DataSetMapObj) {
	this.m_DataSetMap = DataSetMapObj;
};
/**
 * @description Getter of DataSet
 * @return {Object} DataSetMapObj object
 * */
Variable.prototype.getDataSetMap = function () {
	return this.m_DataSetMap;
};


/**
 * @description Setter of defaultValues
 * @param {Object} defaultValues object
 * */
Variable.prototype.setDefaultValues = function (defaultValues) {
	this.m_defaultValues.push(defaultValues);
};
/**
 * @description Getter of defaultValues
 * @return {Object} defaultValues object
 * */
Variable.prototype.getDefaultValues = function () {
	return this.m_defaultValues;
};
/**
 * @description Getter of key of the variable 
 * @return {String} key
 * */
Variable.prototype.getkey = function () {
	return this.m_key;
};
/**
 * @description Getter of defaultValue
 * @return {Object} defaultValue object
 * */
Variable.prototype.getdefaultValue = function () {
	return this.m_defaultvalue;
};
/**
 * @description Getter of all the default value keys 
 * @return {Object} defaultValueKeys array
 * */
Variable.prototype.getDefaultValuekeys = function () {
	return this.m_defaultValuekeys;
};
/**
 * @description Add a key in defaultValueKeys array
 * @param {String} key: key to be added 
 * */
Variable.prototype.setDefaultValuekeys = function (key) {
	this.m_defaultValuekeys.push(key);
};
/**
 * @description Updated the values in defaultValues and call notify method 
 * @param {Object} fieldNameValueMap: key-value pair object for new values 
 * */
Variable.prototype.update = function (fieldNameValueMap) {
	this.updateDefaultValueMap(fieldNameValueMap);
	if(IsBoolean(this.m_notifychange)){
		this.notify();
	}
};
/**
 * @description Updated the values in defaultValues 
 * @param {Object} fieldNameValueMap: key-value pair object for new values 
 * */
Variable.prototype.updateDefaultValueMap = function (fieldNameValueMap) {
	for (var i = 0; i < this.getDefaultValuekeys().length; i++) {
		var k = this.getDefaultValuekeys()[i];
		this.map[k] = fieldNameValueMap[k];
	}
	// to update keys out of default values
	if (fieldNameValueMap != undefined) {
		for (var key in fieldNameValueMap) {
			this.map[key] = fieldNameValueMap[key];
		}
	}
};
/**
 * @description Updated the values for the key in the map
 * @param {Object} name: key name
 * @param {Object} name: value
 * */
Variable.prototype.updateAttribute = function (name, value) {
	this.map[name] = value;
};
/**
 * @description Updated the array values for the key in the map
 * @param {Object} fieldNameValueMap: new key-value map
 * */
Variable.prototype.updateDefaultValueArrayMap = function (fieldNameValueMap) {
	for (var i = 0; i < this.getDefaultValuekeys().length; i++) {
		var key = this.getDefaultValuekeys()[i];
		this.fieldNameDataArraymap[key] = fieldNameValueMap[key];
	}
};
/**
 * @description Notify will call the script which is written on change of this gv 
 * */
Variable.prototype.notify = function () {
	this.notifyDataProviders();
	this.notifyDataSet();
	this.notifyWidget();
	if (this.userScript != "") {
		UserScriptExecuter.prototype.execute(this.userScript, this.toSimplifiedObject());
	}
	/** Should be triggered after the script execution, so that if any new key-val pair added in global-variable vaue, that can be used in labels **/
	this.notifyDynamicalyUpdateComponents();
};
/**
 * @description make a map from the key and map together
 * @return {Object} map
 * */
Variable.prototype.toSimplifiedObject = function () {
	return {
		"key" : this["m_key"],
		"attributes" : this["map"]
	};
};
/**
 * @description notify all the associated Dataproviders
 * */
Variable.prototype.notifyDataProviders = function () {
	for (var i = 0; i < this.m_observerDataProvider.length; i++) {
		this.m_observerDataProvider[i].getDataFromConnection(this.m_observerDataProvider[i].getDataSetValues(), frameworkController.setXMLResponse.bind(frameworkController));
	}
};
/**
 * @description notify all the associated DataSet
 * */
Variable.prototype.notifyDataSet = function () {
	for (var i = 0; i < this.m_observerDataSet.length; i++) {
		var dataSet = this.m_observerDataSet[i];
		dataSet.refreshDataFromConnection(frameworkController.renderComponentsWithDataSet);
	}
};
/**
 * @description notify all the associated Widget
 * */
Variable.prototype.notifyWidget = function () {
	for (var i = 0; i < this.m_observerWidget.length; i++) {
		if (IsBoolean(this.m_observerWidget[i].m_isVisibiltyConstraintFlag) && IsBoolean(this.m_observerWidget[i].m_isChartVisible))
			this.m_observerWidget[i].componentVisibility();
	}
};
/**
 * @description notify all the associated components which needs to be updated after every gv change 
 * */
Variable.prototype.notifyDynamicalyUpdateComponents = function () {
	frameworkController.renderComponentsWithDynamicUpdate(this.m_dashboard.m_observerDynamicalyUpdateComponent);
};
/**
 * @description update the drill color in the associated widget 
 * @param {String} drillColor: hexadecimal color code
 * */
Variable.prototype.updateDrillColor = function (drillColor) {
	for (var i = 0; i < this.m_observerWidgetsForDrillColor.length; i++) {
		this.m_observerWidgetsForDrillColor[i].m_startDrill = true;
		this.m_observerWidgetsForDrillColor[i].m_drillColor = drillColor;
	}
};

/**
 * @description add the data provider in the array
 * @param {Object} m_dataProvider: object of the data provider 
 * */
Variable.prototype.registerDataProvider = function (m_dataProvider) {
	this.m_observerDataProvider.push(m_dataProvider);
};

/**
 * @description find the dataset from the connID and add in m_observerDataSetArray
 * @param {String} component: object which has to be updated when this gv change
 * */
Variable.prototype.registerDataSet = function (component) {
	this.m_observerDataSet.push(component);
};

/**
 * @description add the component in m_observerWidgetsForDrillColor
 * @param {Object} component: object which has to be updated when this gv change
 * */
Variable.prototype.registerWidgetsForDrillColor = function (component) {
	this.m_observerWidgetsForDrillColor.push(component);
};
/**
 * @description add the component in registerWidgets
 * @param {Object} component: object which has to be updated when this gv change
 * */
Variable.prototype.registerWidgets = function (component) {
	this.registerWidgets.push(component);
};
/**
 * @description add the key in map
 * @param {String} fieldName: key name 
 * */
Variable.prototype.createField = function (fieldName) {
	this.map[fieldName] = "";
};
/**
 * @description add the key in map
 * @param {String} fieldName: key 
 * @param {String} fieldValue: value 
 * */
Variable.prototype.createFieldValue = function (fieldName, fieldValue) {
	var specifier = this.specialValueExist(fieldValue);
	if (fieldValue != "") {
		var match1 = fieldValue.match(/'(.*?)'/);
		var match2 = fieldValue.match(/"(.*?)"/);

		if (match1 != null && match1.length == 2)
			this.map[fieldName] = match1[1];
		else if (match2 != null && match2.length == 2)
			this.map[fieldName] = match2[1];
		else if (specifier != "")
			this.map[fieldName] = this.getSpecialValues(fieldValue, specifier);
		else
			this.map[fieldName] = fieldValue;
	} else {
		this.map[fieldName] = fieldValue;
	}
};
/**
 * @description check for any special value like System date in the value to be update 
 * @param {String} fieldValue: value 
 * @return {String} special value 
 * */
Variable.prototype.specialValueExist = function (fieldValue) {
	for (var spVal in this.specialValues) {
		if (fieldValue.indexOf(this.specialValues[spVal]) == 0) {
			return this.specialValues[spVal];
		}
	}
	return "";
};
/**
 * @description Getter method for special value 
 * @param {String} fieldValue: value 
 * @param {String} specifier: character from which date has to be splitted 
 * */
Variable.prototype.getSpecialValues = function (fieldValue, specifier) {
	return parseSystemDateDefaultValue(fieldValue, specifier)
};
/**
 * @description Getter method for value for the given key 
 * @param {String} fieldName: key 
 * */
Variable.prototype.getFieldValue = function (fieldName) {
	return this.map[fieldName];
};
/**
 * @description Getter method for value array for the given key 
 * @param {String} fieldName: key 
 * */
Variable.prototype.getFieldValueArray = function (fieldName) {
	return this.fieldNameDataArraymap[fieldName];
};
/**
 * @description set DefaultValuesInMap
 * */
Variable.prototype.setDefaultValuesInMap = function () {
	for (var i = 0; i < this.getDefaultValues().length; i++) {
		var map = this.getDefaultValues()[i].getDefaultValuesNameValueMap();
		for (var key in map) {
			this.createField(key);
			this.createFieldValue(key, map[key]);
			this.setDefaultValuekeys(key);
		}
	}
};
//# sourceURL=GlobalVariableController.js