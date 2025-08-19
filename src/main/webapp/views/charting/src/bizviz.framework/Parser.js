/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: Parser.js
 * @description parses the dashboard JSON, create class objects and store the properties in object
 * */

/**
 * @description Constructor Parser
 * */
function Parser() {
	this.dashboardJson = "";
	this.dashboard = "";
};
/** @description initialize the parser
 * @param {Object} json: dashboard JSON
 * @param {Object} dashboardObject: dashboard object 
 *  **/
Parser.prototype.init = function (json, dashboardObject) {
	this.dashboardJson = json;
	this.dashboard = dashboardObject;
};
/** @description parses an object, creates a variable and sets the values in given reference object 
 * @param {Object} json: dashboard JSON
 * @param {Object} obj: reference to the class where variable and value has to be set  
 *  **/
Parser.prototype.parseAttributesAndSetToNode = function (json, obj) {
	for (var attribute in json) {
		this.setAttributeValueToNode(attribute, json[attribute], obj);
	}
};
/** @description creates a proper variable and sets the values in given reference object 
 * @param {String} attributeName:  name from the json
 * @param {Object} obj: reference to the class where variable and value has to be set  
 *  **/
Parser.prototype.setAttributeValueToNode = function (attributeName, attributeValue, obj) {
	var propertyName = this.getNodeAttributeName(attributeName);
	obj[propertyName] = attributeValue;
};
/** @description converts the attributeName to lower case, prefix "m_" to it and return
 * @param {String} attributeName:  name from the json such as "dashboardID"
 * return {String} proper Variable name such as "m_dashboardid" 
 *  **/
Parser.prototype.getNodeAttributeName = function (key) {
	return "m_" + (key.toLowerCase().replace("__", "").replace("_", ""));
};
/** @description removes the multiple underscored from the attribute name if present any( to support old XML based NIV files to created)
 * @param {String} attributeName:  name from the json 
 * return {String} proper Variable 
 *  **/
Parser.prototype.getKeyAfterRemoveUnderscore = function (key) {
	return key.replace("__", "").replace("_", "");
};
/** @description find the value of given attribute in given json object
 * @param {Object} json:  json object
 * @param {String} name:  name of an attribute from the json 
 * return {String} value to that variable  
 *  **/
Parser.prototype.getProperAttributeNameValue = function (json, name) {
	for (var key in json) {
		if (key.replace("__", "").replace("_", "") == name) {
			return json[key];
		}
	}
};
/** @description will convert an object to single length array 
 * @param {Object} json: if parameter is an object type, convert it to array
 * @return {Object} return array of length=1 if parameter is object type 
 *  **/
Parser.prototype.getArrayOfSingleLengthJson = function (json) {
	if ($.isArray(json)) {
		return json;
	} else {
		return [json];
	}
};
/** @description parsing of dashboard components **/
Parser.prototype.parseDashboardJSON = function () {
	var dashboardJsonObject = this.dashboardJson.Niv["Dashboard"];
	/** Setting the id in dashboard object **/
	this.dashboard.m_id = this.getProperAttributeNameValue(dashboardJsonObject, "id");
	this.dashboard.m_layouttype = this.getProperAttributeNameValue(dashboardJsonObject, "layoutType") || "AbsoluteLayout";
	/** Setting cache flag in dashboard object **/
	this.dashboard.m_enablecache = this.getProperAttributeNameValue(dashboardJsonObject, "enableCache") || "false";
	this.dashboard.m_enablereportburst = this.getProperAttributeNameValue(dashboardJsonObject, "enableReportBurst") || "false";
	this.dashboard.m_reportburstbutton = this.getProperAttributeNameValue(dashboardJsonObject, "reportBurstButtonId") || "reportBurstButton";
	
	this.parseDashboardOptions(dashboardJsonObject);
	this.parseLanguageMapping(dashboardJsonObject);
	this.parseFlashVars(dashboardJsonObject);
	this.parseAuthProfiles(dashboardJsonObject);
	this.parseDataProviders(dashboardJsonObject);
	this.parseGlobalVariable(dashboardJsonObject);
	this.parseOfflineData(dashboardJsonObject);
	this.parseDataSetExpressions(dashboardJsonObject);
	this.parseGroupings(dashboardJsonObject);
	this.parseAbsoluteLayout(dashboardJsonObject);
};
/** @description parsing of dashboard options 
 * @param {Object} dashboardJson: dashboard JSON object 
 * **/
Parser.prototype.parseDashboardOptions = function (dashboardJson) {
	var json = dashboardJson.DashboardOptions;
	if (json != "" && json != undefined) {
		var obj = new DashboardOptions();
		this.dashboard.setDashboardOptions(obj);
		this.parseAttributesAndSetToNode(json, obj);
	}
};
/** @description parsing of dashboard LanguageMapping 
 * @param {Object} dashboardJson: dashboard JSON object 
 * **/
Parser.prototype.parseLanguageMapping = function (dashboardJson) {
	var json = dashboardJson.LanguageMapping;
	if (json != "" && json != undefined) {
		var obj = new LanguageMapping();
		this.parseAttributesAndSetToNode(json, obj);
		this.dashboard.setLanguageMapping(obj);
	}
};
/** @description parsing of flash variables 
 * @param {Object} dashboardJson: dashboard JSON object 
 * **/
Parser.prototype.parseFlashVars = function (dashboardJson) {
	var json = dashboardJson.FlashVars;
	var obj = new FlashVars();
	this.dashboard.setFlashVars(obj);
	if (json != "" && json != undefined) {
		var paramArray = this.getArrayOfSingleLengthJson(json.Param);
		for (var i = 0; i < paramArray.length; i++) {
			var childJson = paramArray[i];
			var childObj = new Param();
			this.parseAttributesAndSetToNode(childJson, childObj);
			obj.setParam(childObj);
		}
	}
};
/** @description parsing of auth profiles 
 * @param {Object} dashboardJson: dashboard JSON object 
 * **/
Parser.prototype.parseAuthProfiles = function (dashboardJson) {
	var json = dashboardJson.AuthProfiles;
	if (json != "" && json != undefined) {
		var obj = new AuthProfiles();
		this.dashboard.setAuthProfiles(obj);
		var profileArray = this.getArrayOfSingleLengthJson(json.Profile);
		for (var i = 0; i < profileArray.length; i++) {
			var childJson = profileArray[i];
			var childObj = new Profile();
			this.parseAttributesAndSetToNode(childJson, childObj);
			obj.setProfile(childObj);
		}
	}
};
/** @description parsing of Connectors 
 * @param {Object} dashboardJson: dashboard JSON object 
 * **/
Parser.prototype.parseDataProviders = function (dashboardJson) {
	var json = dashboardJson.DataProviders;
	var obj = new DataProviders();
	this.dashboard.setDataProviders(obj);
	if (json != "" && json != undefined) {
		var jsonArray = this.getArrayOfSingleLengthJson(json.DataURL);
		for (var i = 0; i < jsonArray.length; i++) {
			var childJson = jsonArray[i];
			var dpType = this.getProperAttributeNameValue(childJson, "Type");
			var DataURLObj = (dpType == "offline") ? new OfflineDataProvider() : (dpType == "derived") ? new DerivedDataProvider() : new OnlineDataProvider();
			var dataType = this.getProperAttributeNameValue(childJson, "dataType");
			DataURLObj.setDataType(dataType);
			DataURLObj.setDashboard(this.dashboard);
			for (var key in childJson) {
				switch (key) {
				case "FieldSet":
					var fieldSetJsonArray = this.getArrayOfSingleLengthJson(childJson[key]);
					for (var j = 0; j < fieldSetJsonArray.length; j++) {
						var fieldSetJson = fieldSetJsonArray[j];
						var fieldSetObj = new FieldSet();
						this.parseAttributesAndSetToNode(fieldSetJson, fieldSetObj);
						DataURLObj.setFieldSet(fieldSetObj);
					}
					break;
				case "WhereClause":
					var nivCon = new Con();
					for (var attribute in childJson[key]["Con"]) {
						switch (attribute) {
						case "ClauseMap":
							nivCon.m_clausemap = childJson[key]["Con"]["ClauseMap"];
							break;
						default:
							this.setAttributeValueToNode(attribute, childJson[key]["Con"][attribute], nivCon);
							break;
						}
					}
					DataURLObj.setCon(nivCon);
					break;
				case "ClarityOptionalCondition":
					var ClaritySliceObj = new ClaritySlice();
					DataURLObj.setClaritySlice(ClaritySliceObj);
					this.parseAttributesAndSetToNode(childJson[key]["ClaritySlice"], ClaritySliceObj);

					var ClaritySortObj = new ClaritySort();
					DataURLObj.setClaritySort(ClaritySortObj);
					this.parseAttributesAndSetToNode(childJson[key]["ClaritySort"], ClaritySortObj);
					break;
				case "query":
					var queryJson = childJson[key];
					if (queryJson != undefined && queryJson != "") {
						var queryParamsMap = new Object();
						for (var queryKey in queryJson) {
							queryParamsMap[queryKey] = this.getProperAttributeNameValue(queryJson[queryKey], "value");
						}
						DataURLObj.setQueryParamsMap(queryParamsMap);
					}
					break;
				default:
					var propertyName = this.getNodeAttributeName(key);
					DataURLObj[propertyName] = childJson[key];
					break;
				}
			}
			DataURLObj.setKeys();
			obj.m_dataUrlIdObjMap[DataURLObj.getId()] = DataURLObj;
			obj.setDataURL(DataURLObj);
		}
	}
};
/** @description parsing of global variable 
 * @param {Object} dashboardJson: dashboard JSON object 
 * **/
Parser.prototype.parseGlobalVariable = function (dashboardJson) {
	var json  = this.getAllVariables(dashboardJson);
	var obj = new GlobalVariable();
	this.dashboard.setGlobalVariable(obj);
	if (json != "" && json != undefined) {
		var variableJsonArray = this.getArrayOfSingleLengthJson(json.Variable);
		for (var i = 0; i < variableJsonArray.length; i++) {
			var childJson = variableJsonArray[i];
			var variableObj = new Variable();
			variableObj.m_dashboard = this.dashboard;
			for (var key in childJson) {
				switch (key) {
				case "DefaultValues":
					if (childJson[key] != "") {
						var defaultValuesJsonArray = this.getArrayOfSingleLengthJson(childJson[key].DefaultValue);
						for (var j = 0; j < defaultValuesJsonArray.length; j++) {
							var defaultValuesObj = new DefaultValues();
							variableObj.setDefaultValues(defaultValuesObj);
							this.parseAttributesAndSetToNode(defaultValuesJsonArray[j], defaultValuesObj);
							if (defaultValuesObj.m_text.length == 0){
								defaultValuesObj.m_text = "";
							}
							defaultValuesObj.setDefaultValuesNameValueMap(defaultValuesObj.m_name, defaultValuesObj.m_text);
						}
					}
					break;
				case "DataProviderMap":
					break;
				case "DataSetMap":
					break;
				case "VisibilityTriggerMap":
					break;
				case "ImageMap":
					break;
				case "userScript":
					if (childJson[key] != "" || childJson[key] != undefined) {
						if (childJson[key]["__cdata"] != undefined) {
							variableObj.setUserScript(childJson[key]["__cdata"]);
						} else {
							variableObj.setUserScript(childJson[key]["value"]);
						}
					}

					break;

				default:
					var propertyName = this.getNodeAttributeName(key);
					variableObj[propertyName] = childJson[key];
					break;
				}
			}
			variableObj.setDefaultValuesInMap();
			obj.setVariable(variableObj);
			obj.setGlobalVariables(variableObj);
		}
	}
};
/**
 * @description method for setting components/dashboard/connections/context object variables  
 * @param {Object} dashboardJson: dashboard JSON object
 * @return array of variables and sets globalkey when opened from portal
 * **/
Parser.prototype.getAllVariables = function(dashboardJson) {
    var json = {};
    var contextObj = {"Key": "context","userScript": {"value": ""},"DefaultValues": {"DefaultValue": []}};
    json.Variable = [];
    json.Variable.push(contextObj);
    json.Variable.push(dashboardJson.variable);
    var layoutType = this.getLayoutByDevice(dashboardJson).layoutType;
    for (var i = 0; i < dashboardJson[layoutType].Object.length; i++) {
        /** setting globalkey for the components in dashboard json when opened from publish portal **/
        var comp = dashboardJson[layoutType].Object[i];
        if (comp && comp !== null) {
        	json.Variable.push(dashboardJson[layoutType].Object[i].variable);
            try {
                var node = comp["subElement"];
                var nodeAttribute = comp["globalVariableKeyAttribute"];
                comp[node][nodeAttribute] = comp.variable.Key;
            } catch (e) {
                console.log(e);
            }
        }
    }
    for (var j = 0; j < dashboardJson.DataProviders.DataURL.length; j++) {
        json.Variable.push(dashboardJson.DataProviders.DataURL[j].variable);
    }
    return json;
};

/** @description parsing of offline connector data 
 * @param {Object} dashboardJson: dashboard JSON object 
 * **/
Parser.prototype.parseOfflineData = function (dashboardJson) {
	var offlineData = dashboardJson.OffLineData;
	if (offlineData != "" && offlineData != undefined) {
		var offlineDataJsonArray = this.getArrayOfSingleLengthJson(dashboardJson.OffLineData.Data);
		for (var i = 0; i < offlineDataJsonArray.length; i++) {
			var json = offlineDataJsonArray[i];
			var data = [];
			if (json.Records != undefined && json.Records != "" && json.Records.Record != undefined && json.Records.Record != "")
				data = this.getArrayOfSingleLengthJson(json.Records.Record);
			this.dashboard.m_dataMap[this.getProperAttributeNameValue(json, "id")] = data;
		}
	}
};
/** @description parsing of datasetExpressions which is used in CalculatedField
 * @param {Object} dashboardJson: dashboard JSON object 
 * **/
Parser.prototype.parseDataSetExpressions = function (dashboardJson) {
	var datasetExpressions = dashboardJson.DatasetExpressions;
	if (datasetExpressions != "" && datasetExpressions != undefined) {
		var DataSetExpressionsObj = new DataSetExpressions();
		this.dashboard.setDataSetExpressions(DataSetExpressionsObj);

		var datasetExpressionJsonArray = this.getArrayOfSingleLengthJson(datasetExpressions.DatasetExpression);
		for (var j = 0; j < datasetExpressionJsonArray.length; j++) {
			var datasetExpressionJson = datasetExpressionJsonArray[j];
			var datasetExpressionObj = new DataSetExpression();
			this.parseAttributesAndSetToNode(datasetExpressionJson, datasetExpressionObj);

			if (datasetExpressionJson.variables != "" && datasetExpressionJson.variables != undefined) {
				var variableJsonArray = this.getArrayOfSingleLengthJson(datasetExpressionJson.variables.variable);
				for (var k = 0; k < variableJsonArray.length; k++) {
					var variableJson = variableJsonArray[k];
					var variableObj = new DataSetExpressionVariable();
					datasetExpressionObj.setVariables(variableObj);
					this.parseAttributesAndSetToNode(variableJson, variableObj);
				}
			}
			var expressionStringJson = datasetExpressionJson.expressionScript;
			if (expressionStringJson != "" && expressionStringJson != undefined) {
				var expressionScript = new DataSetExpressionscript();
				datasetExpressionObj.setExpressionScript(expressionScript);
				expressionScript.setExpressionScript(this.getProperAttributeNameValue(expressionStringJson, "cdata"));
			}
			DataSetExpressionsObj.setDataSetExpression(datasetExpressionObj);
		}
	}
};

/** Return the layout as per the device type and if mobile & tablet layout objects length is 0 then return AbsoluteLayout**/
Parser.prototype.getLayoutByDevice = function (dashboardJson) {
	dashboardJson["AbsoluteLayout"]["layoutType"] = "AbsoluteLayout";
	if(detectDevice.mobile()){
		if(dashboardJson.MobileLayout){
			dashboardJson.MobileLayout["layoutType"] = "MobileLayout";
			return (dashboardJson.MobileLayout.Object.length > 0) ? dashboardJson.MobileLayout : dashboardJson["AbsoluteLayout"];
		}else{
			return dashboardJson["AbsoluteLayout"];
		}
	}else if(detectDevice.tablet()){
		if(dashboardJson.TabletLayout){
			dashboardJson.TabletLayout["layoutType"] = "TabletLayout";
			return (dashboardJson.TabletLayout.Object.length > 0) ? dashboardJson.TabletLayout : dashboardJson["AbsoluteLayout"];
		}else{
			return dashboardJson["AbsoluteLayout"];
		}
	}else{
		dashboardJson[this.dashboard.m_layouttype || "AbsoluteLayout"].layoutType = this.dashboard.m_layouttype || "AbsoluteLayout";
		return dashboardJson[this.dashboard.m_layouttype || "AbsoluteLayout"];
	}
};
/** Re sets the alignment properties in the components as per the device type **/
Parser.prototype.ReAlignAbsoluteLayoutForMobile = function (dashboardJson) {
	var json = "";
	json = this.getLayoutByDevice(dashboardJson);
	if (json != "" && json != undefined) {
		var absoluteLayout = this.dashboard.getAbsoluteLayout();
		absoluteLayout.m_width = json.width;
		absoluteLayout.m_height = json.height;
		var objectJsonArray = this.getArrayOfSingleLengthJson(json.Object);
		for (var i = 0; i < objectJsonArray.length; i++) {
			var id = objectJsonArray[i].referenceID;
			var ObjectObj = this.dashboard.m_widgetsArray.find(function(obj){
				return obj.m_referenceid == id;
			});
			
			ObjectObj.m_x = objectJsonArray[i].x;
			ObjectObj.m_y = objectJsonArray[i].y;
			ObjectObj.m_width = objectJsonArray[i].width;
			ObjectObj.m_height = objectJsonArray[i].height;
		}
	}	
};
/** @description parsing of absolute layout and objects 
 * @param {Object} dashboardJson: dashboard JSON object 
 * **/
Parser.prototype.parseAbsoluteLayout = function (dashboardJson) {
	var layout = this.getLayoutByDevice(dashboardJson);
	dGlobals.layoutType = layout.layoutType; // set active layouttype to Dashboard level variable
	var json = dashboardJson[layout.layoutType];
	if (json != "" && json != undefined) {
		var absoluteLayout = new AbsoluteLayout();
		this.dashboard.setAbsoluteLayout(absoluteLayout);
		for (var key in json) {
			switch (key) {
			case "Object":
				absoluteLayout.m_width = layout.width;
				absoluteLayout.m_height = layout.height;
				var objectJsonArray = this.getArrayOfSingleLengthJson(layout.Object || []);
				for (var i = 0; i < objectJsonArray.length; i++) {
					var ObjectObj;
					/** Parse all the widgets one by one and store the reference in m_widgetsArray **/
					if (layout.layoutType !== "AbsoluteLayout" && layout.pinedObject !== undefined) {
						// filtering unPined components
						for (var j = 0; j < (layout.pinedObject).length; j++) {
							if (layout.pinedObject[j].objectID == objectJsonArray[i].objectID) {
								ObjectObj = this.widgetJSONParsing(objectJsonArray[i]);
								ObjectObj.m_dashboard = this.dashboard;
								if (ObjectObj != "") {
									this.dashboard.m_widgetsArray.push(ObjectObj);
								}
							}
						}
					} else {
						ObjectObj = this.widgetJSONParsing(objectJsonArray[i]);
						ObjectObj.m_dashboard = this.dashboard;
						if (ObjectObj != "") {
							this.dashboard.m_widgetsArray.push(ObjectObj);
						}
					}
				}
				break;
			default:
				this.setAttributeValueToNode(key, json[key], absoluteLayout);
				break;
			}
		}
		absoluteLayout.m_bootstrap = this.dashboard.isBootstrap();
		this.dashboard.setScalingEnabled(absoluteLayout.m_scalingenabled);
	}
};
/** @description parsing of components grouping 
 * @param {Object} dashboardJson: dashboard JSON object 
 * **/
Parser.prototype.parseGroupings = function(dashboardJson) {
    var dGroups = dashboardJson.componentGroups;
    if (dGroups !== undefined) {
	    var compObjs = dashboardJson.AbsoluteLayout.Object;
	    for (var i = 0; i < compObjs.length; i++) {
	    	if (compObjs[i]) {
		        compObjs[i]["groupings"] = "";
		        var groupNames = [];
		        for (var j = 0; j < dGroups.length; j++) {
		            if (dGroups[j].aCompIds.length) {
		                if (dGroups[j].aCompIds.indexOf(compObjs[i].objectID) != -1) {
		                    groupNames.push(dGroups[j].gName)
		                }
		            }
		        }
		        if (groupNames.length) {
		            compObjs[i]["groupings"] = groupNames.join();
		        }
	    	}
	    }
    }
};

/** @description method will convert the old object types to compatible ones 
 * @param {Object} objectType: an object
 * @return {Object} compatible object
 * **/
Parser.prototype.convertOldObjectTypes = function (objectType) {
	if (/n\w{4}h/.test(objectType)) {
		return objectType.replace(/n\w{4}h/i, "");
	} else {
		return objectType;
	}
};
/** @description Component Parsing method calling 
 * @param {Object} widgetJson: json for one widget
 * @return {Object} reference of the widget
 * **/
Parser.prototype.widgetJSONParsing = function (widgetJson) {
	var conponentObject = "";
	var name = "";
	var objectType = this.getProperAttributeNameValue(widgetJson, "objectType");
	objectType = this.convertOldObjectTypes(objectType);
	if (objectType) {
		try {
			switch (objectType) {
			case "chart": {
					name = this.getProperAttributeNameValue(widgetJson["Chart"], "Type");
					conponentObject = this.createWidgetObject(name);
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					this.dataSetJSONParsing(widgetJson["Chart"]["DataSet"], conponentObject);
					break;
				}
			case "funnel": {
					name = this.getProperAttributeNameValue(widgetJson["Funnel"], "Type");
					conponentObject = this.createWidgetObject(name);
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					this.dataSetJSONParsing(widgetJson["Funnel"]["DataSet"], conponentObject);
					break;
				}
			case "datagrid": {
					name = this.getProperAttributeNameValue(widgetJson["DataGrid"], "DataGridType");
					conponentObject = this.createWidgetObject(name);
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					this.dataSetJSONParsing(widgetJson["DataGrid"]["DataSet"], conponentObject);
					break;
				}
			case "filter": {
					name = this.getProperAttributeNameValue(widgetJson["Filter"], "Type");
					conponentObject = this.createWidgetObject(name);
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					this.dataSetJSONParsing(widgetJson["Filter"]["DataSet"], conponentObject);
					break;
				}
			case "scorecard": {
					conponentObject = new ScoreCard();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					this.dataSetJSONParsing(widgetJson["Scorecard"]["DataSet"], conponentObject);
					break;
				}

			case "hslider": {
					conponentObject = new HSlider();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					break;
				}
			case "tabs": {
					conponentObject = new Tabs();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					break;
				}
			case "rectangle": {
					conponentObject = new Rectangle();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					break;
				}
			case "legend": {
					conponentObject = new Legend();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					break;
				}
			case "filterchips": {
				conponentObject = new FilterChips();
				conponentObject.chartJson = widgetJson;
				conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
				break;
			}
			case "numericstepper": {
					conponentObject = new NumericStepper();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					break;
				}
			case "vslider": {
					conponentObject = new VSlider();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					break;
				}
				//Other Components
			case "comments": {
					conponentObject = new Comments();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					break;
				}
			case "bullet": {
					conponentObject = new Bullet();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					conponentObject.SetIsVirtualDataSetAvailable();
					break;
				}
			case "gauge": {
					conponentObject = new Gauge();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					conponentObject.SetIsVirtualDataSetAvailable();
					break;
				}
			case "guidedtour": {
					conponentObject = new GuidedTour();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					conponentObject.SetIsVirtualDataSetAvailable();
					break;
				}
			case "semigauge": {
					conponentObject = new SemiGauge();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					conponentObject.SetIsVirtualDataSetAvailable();
					break;
				}
			case "image": {
					conponentObject = new ImageComponent();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					conponentObject.SetIsVirtualDataSetAvailable();
					break;
				}
			case "inputbox": {
				conponentObject = new InputBox();
				conponentObject.chartJson = widgetJson;
				conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
				conponentObject.SetIsVirtualDataSetAvailable();
				break;
			}
			case "label": {
					conponentObject = new Label();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					conponentObject.SetIsVirtualDataSetAvailable();
					break;
				}
			case "textbox": {
					conponentObject = new TextBox();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					conponentObject.SetIsVirtualDataSetAvailable();
					break;
				}
			case "trend": {
					conponentObject = new Trend();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					conponentObject.SetIsVirtualDataSetAvailable();
					break;
				}
			case "date": {
					conponentObject = new DatePicker();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					break;
				}
			case "dataSearch": {
				conponentObject = new DataSearch();
				conponentObject.chartJson = widgetJson;
				conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
				break;
			}
			case "checklist": {
					conponentObject = new CheckList();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					break;
				}
				//Button Components
			case "info": {
					conponentObject = new InfoButton();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					break;
				}
			case "exportppt": {
					conponentObject = new ExportToPPTButton();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					break;
				}
			case "filtersaver": {
				conponentObject = new FilterSaver();
				conponentObject.chartJson = widgetJson;
				conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
				break;
			}
			case "exportall": {
					conponentObject = new ExportAll();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					break;
				}
			case "refreshbutton": {
					conponentObject = new RefreshButton();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					break;
				}
			case "urlbutton": {
				// Same as below case
			}
			case "URLButton": {
					conponentObject = new UrlButton();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					break;
				}
			case "InputButton": {
				conponentObject = new InputButton();
				conponentObject.chartJson = widgetJson;
				conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
				break;
			}
			case "TabComponent": {
				conponentObject = new TabComponent();
				conponentObject.chartJson = widgetJson;
				conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
				break;
			}
			case "SVGShape": {
					conponentObject = new SVGShape();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					break;
				}
			case "SVGImage": {
					conponentObject = new SVGImage();
					conponentObject.chartJson = widgetJson;
					conponentObject.ParseJsonAttributes(widgetJson, conponentObject);
					break;
				}
			default:
				alertPopUpModal({type: 'warning', message: "Component" + objectType + " is not available", timeout: '3000'});
				break;
			}
		} catch (e) {
			alertPopUpModal({type: 'warning', message: "Component" + objectType + " is not available", timeout: '3000'});
		}
	}
	return conponentObject;
};
/** @description Parsing of dataset -> fields, filter, autoManipulator, aggregation 
 * @param {Object} dataSetJson: json for dataset of one widget
 * @param {Object} conponentObject: widget reference
 * **/
Parser.prototype.dataSetJSONParsing = function (dataSetJson, conponentObject) {
	if (dataSetJson != "" && dataSetJson != undefined) {
		var dataSet = new DataSet();
		dataSet.setDashboard(this.dashboard);
		conponentObject.m_isDataSetavailable = true;
		this.dashboard.m_dataSetsArray.push(dataSet);
		for (var dataSetKey in dataSetJson) {
			try {
				switch (dataSetKey) {
				case "Fields":
					dataSet.dataSetFieldsJSONParsing(dataSetJson.Fields);
					break;
				case "AutoManipulator":
					var autoManipulator = new AutoManipulator();
					dataSet.setAutoManipulator(autoManipulator);
					this.parseAttributesAndSetToNode(dataSetJson[dataSetKey], autoManipulator);
					break;
				case "Aggregation":
					var aggregation = new Aggregation();
					dataSet.setAggregation(aggregation);
					this.parseAttributesAndSetToNode(dataSetJson[dataSetKey], aggregation);
					break;
				case "DataSetFilter":
					var dataSetFilter = new DataSetFilter();
					dataSet.setDataSetFilter(dataSetFilter);
					this.parseAttributesAndSetToNode(dataSetJson[dataSetKey], dataSetFilter);
					dataSetFilter.conditionSplitter();
					break;
				default:
					if (this.getKeyAfterRemoveUnderscore(dataSetKey) == "dataSource"){
						conponentObject.setDataSourceId(dataSetJson[dataSetKey]);
					}else if (this.getKeyAfterRemoveUnderscore(dataSetKey) == "id"){
						conponentObject.setDataSetId(dataSetJson[dataSetKey]);
					}else{
						// Do nothing
					}
					this.setAttributeValueToNode(dataSetKey, dataSetJson[dataSetKey], dataSet);
					break;
				}
			} catch (e) {
				alertPopUpModal({type: 'warning', message: "Data Set key" + dataSetKey + " is not available", timeout: '3000'});
			}
		}
	}
};
/** @description create object of the component according to the type
 * @param {String} component: component name
 * @return {Object} reference of newly created widget  
 **/
Parser.prototype.createWidgetObject = function (component) {
	var chartObj = "";
	var widgetName;
	var isComponentPresent = true;
	try {
		switch (component.toLowerCase()) {
			//Charts
		case "area":
			widgetName = "Area";
			chartObj = new AreaChart();
			break;
		case "bar":
			widgetName = "Bar";
			chartObj = new BarChart();
			break;
		case "benchmarkanalysis":
			widgetName = "BenchmarkAnalysis";
			chartObj = new BenchmarkAnalysisChart();
			break;
		case "boxplot":
			widgetName = "BoxPlot";
			chartObj = new BoxPlotChart();
			break;
		case "bubble":
			widgetName = "Bubble";
			chartObj = new BubbleChart();
			break;
		case "candlestick":
			widgetName = "CandleStick";
			chartObj = new CandleStickChart();
			break;
		case "chevron":
			widgetName = "Chevron";
			chartObj = new ChevronChart();
			break;
		case "circumplex":
			widgetName = "Circumplex";
			chartObj = new CircumplexChart();
			break;
		case "column":
			widgetName = "Column";
			chartObj = new ColumnStackChart();
			break;
		case "dtc":
			widgetName = "DecisionTreeChart";
			chartObj = new DecisionTreeChart();
			break;
		case "groupbar":
			widgetName = "GroupBar";
			chartObj = new GroupBarChart();
			break;
		case "groupcolumn":
			widgetName = "GroupColumn";
			chartObj = new GroupColumnChart();
			break;
		case "heatmap":
			widgetName = "HeatMap";
			chartObj = new HeatMapChart();
			break;
		case "histogram":
			widgetName = "Histogram";
			chartObj = new HistogramChart();
			break;
		case "knowledgegraph":
			widgetName = "KnowledgeGraph";
			chartObj = new KnowledgeGraphChart();
			break;
		case "kpitile":
			widgetName = "KPITile";
			chartObj = new KPITile();
			break;
		case "line":
			widgetName = "Line";
			chartObj = new LineChart();
			break;
		case "mitoplot":
			widgetName = "MitoPlot";
			chartObj = new MitoPlotChart();
			break;
		case "mixed":
			widgetName = "Mixed";
			chartObj = new MixedChart();
			break;
		case "pie":
			widgetName = "Pie";
			chartObj = new PieChart();
			break;
		case "piedoughnut":
			widgetName = "PieDoughnut";
			chartObj = new PieDoughnutChart();
			break;
		case "sankey":
			widgetName = "Sankey";
			chartObj = new SankeyChart();
			break;
		case "plot":
			widgetName = "ScatteredPlot";
			chartObj = new ScatteredPlotChart();
			break;
		case "progress":
			widgetName = "Progress";
			chartObj = new ProgressChart();
			break;
		case "projecttimeline":
			widgetName = "ProjectTimeline";
			chartObj = new ProjectTimelineChart();
			break;
		case "roadmap":
			widgetName = "Roadmap";
			chartObj = new RoadMapChart();
			break;
		case "sentimentplot":
			widgetName = "SentimentPlot";
			chartObj = new SentimentPlotChart();
			break;
		case "sparkline":
			widgetName = "Sparkline";
			chartObj = new SparkLineChart();
			break;
		case "spider":
			widgetName = "Spider";
			chartObj = new SpiderChart();
			break;
		case "timearea":
			widgetName = "TimeArea";
			chartObj = new TimeAreaChart();
			break;
		case "timecolumnstack":
			widgetName = "TimeColumnStack";
			chartObj = new TimeColumnStackChart();
			break;
		case "timeline":
			widgetName = "Timeline";
			chartObj = new TimelineChart();
			break;
		case "decomposition":
			widgetName = "Decomposition";
			chartObj = new DecompositionChart();
			break;
		case "treemap":
			widgetName = "TreeMap";
			chartObj = new TreeMapChart();
			break;
		case "trellis":
			widgetName = "Trellis";
			chartObj = new TrellisChart();
			break;
		case "waterfall":
			widgetName = "Waterfall";
			chartObj = new WaterfallChart();
			break;
		case "wordcloud":
			widgetName = "WordCloud";
			chartObj = new WordCloudChart();
			break;
		case "newwordcloud":
			widgetName = "NewWordCloudChart";
			chartObj = new NewWordCloudChart();
			break;
			//DataGrids
		case "datagrid":
			widgetName = "Datagrid";
			chartObj = new SimpleDataGrid();
			break;
		case "dynamicdatagrid":
			widgetName = "DynamicDataGrid";
			chartObj = new DynamicDataGrid();
			break;
		case "jexceldatagrid":
			widgetName = "JExcelDataGrid";
			chartObj = new JExcelDataGrid();
			break;
		case "pagingdatagrid":
			widgetName = "PagingDatagrid";
			chartObj = new PagingDataGrid();
			break;
			//funnels
		case "funnel":
			widgetName = "Funnel";
			chartObj = new SimpleFunnelChart();
			break;
		case "invertedfunnel":
			widgetName = "InvertedFunnel";
			chartObj = new InvertedFunnelChart();
			break;
		case "pyramid":
			widgetName = "Pyramid";
			chartObj = new PyramidChart();
			break;
			//Filters
		case "checkboxgroup":
			widgetName = "CheckBox";
			chartObj = new CheckboxFilter();
			break;
		case "dropdown":
			widgetName = "ComboBox";
			chartObj = new ComboFilter();
			break;
		case "combotree":
			widgetName = "HierarchyCombo";
			chartObj = new HierarchicalCombo();
			break;
		case "radiogroup":
			widgetName = "Radio";
			chartObj = new RadioFilter();
			break;
		case "list":
			widgetName = "List";
			chartObj = new ListFilter();
			break;

		case "worldmap":
			widgetName = "WorldMapChart";
			chartObj = new WorldMapChart();
			break;
		case "globe":
			widgetName = "Globe";
			chartObj = new GlobeChart();
			break;
		case "customchart":
			widgetName = "CustomChart";
			chartObj = new CustomChart();
			break;
		case "widgetchart":
				widgetName = "WidgetChart";
				chartObj = new WidgetChart();
				break;
		default:
			isComponentPresent = false;
			alertPopUpModal({type: 'warning', message: "Component of type: " + component.toLowerCase() + " is not available", timeout: '3000'});
			return "";
			break;
		}
	} catch (e) {
		alertPopUpModal({type: 'warning', message: "Component of type: " + component.toLowerCase() + " is not available", timeout: '3000'});
		// TODO: handle exception
	}
	return chartObj;
};
//# sourceURL=Parser.js