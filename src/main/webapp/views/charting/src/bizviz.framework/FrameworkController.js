/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: FrameworkController.js
 * @description Controls the drawing of dashboard
 * */

/** @description Constructor FrameworkController **/
function FrameworkController() {
	this.dashboard = "";
	this.m_dataStore = "";
	this.m_chunkdatalimit = 6;
	this.m_chunkdatatimeout = 100;
	this.m_dashboardviewstate = true;
}
/** @description get the JSON or stringified JSON from different and start dashboard drawing process **/
FrameworkController.prototype.initializeDashboardXMLOrJson = function (complete) {
	if (complete.trees.tree.fileName.indexOf(".bvzx") != -1) {
		var dashboardJson = frameworkUtil.convertStringToJson(complete.trees.tree.data);
		if (dashboardJson !== undefined && dashboardJson !== null && dashboardJson !== "") {
			if (dashboardJson.Niv !== undefined && dashboardJson.Niv.Dashboard !== undefined) {
				this.processDashboardDrawing(dashboardJson);
			} else {
				var dj = {};
				dj.Niv = dashboardJson.dashboardJson;
				if (dj.Niv !==undefined && dj.Niv.Dashboard !== undefined) {
					this.processDashboardDrawing(dj);
				} else {
					alertPopUpModal({type:'error', message:'Dashboard is not valid', timeout: '5000'});
				}
			}
		} else {
			alertPopUpModal({type:'error', message:'Dashboard is not valid', timeout: '5000'});
		}
	} else if (complete.trees.tree.fileName.indexOf(".niv") !== -1 || complete.trees.tree.fileName.indexOf(".bvz") !== -1) {
		var nivContent = decrypt(complete.trees.tree.data);
		this.init(nivContent);
	} else {
		// Do nothing
	}
};
/** @description will be called in case of NIV files which has xml format **/
FrameworkController.prototype.init = function (xmlDoc) {
	var dashboardJson = frameworkUtil.convertXMLToJSON(xmlDoc);
	this.processDashboardDrawing(dashboardJson);
};
/** @description will sets the dashboardViewState **/
FrameworkController.prototype.setDashboardViewState = function (state) {
	this.m_dashboardviewstate = state;
};/** @description returns the dashboardViewState value **/
FrameworkController.prototype.getDashboardViewState = function () {
	return this.m_dashboardviewstate ;
};
/** @description Method will load the required chart scripts and call the callback **/
FrameworkController.prototype.processDashboardDrawing = function (dashboardJson) {
	var fwkCtrl = this;
	var imports = dashboardJson.Niv.Dashboard.imports||[];
	var importsStat = dashboardJson.Niv.Dashboard.importsStat||1;
	/** if a dashboard is created by dragging components and saved or exported without previewing it then 
	* imports and global variables will not be available in dashboardJson, And it throws error when published to portal 
	**/
	if(imports.length<1 || importsStat<1 || (dashboardJson.Niv.Dashboard.AbsoluteLayout && dashboardJson.Niv.Dashboard.AbsoluteLayout.Object && (imports.length != dashboardJson.Niv.Dashboard.AbsoluteLayout.Object.length ))){
		for(var i=0 ; i<dashboardJson.Niv.Dashboard.AbsoluteLayout.Object.length ; i++){
			/** Need to check for old dashboard with NIV files **/
			var obj = dashboardJson.Niv.Dashboard.AbsoluteLayout.Object[i];
			if(obj && obj != null && obj.designData){
				var compClassName = obj.designData["class"];
				if(imports.indexOf(compClassName) == -1){
					imports.push(compClassName);
				}
			}else{
				imports = ["*"];
				break;
			}
		}
	}
	if(imports.length<1 || importsStat<1 || (dashboardJson.Niv.Dashboard.MobileLayout && dashboardJson.Niv.Dashboard.MobileLayout.Object && (imports.length != dashboardJson.Niv.Dashboard.MobileLayout.Object.length ))){
		for(var i=0 ; i<dashboardJson.Niv.Dashboard.MobileLayout.Object.length ; i++){
			/** Need to check for old dashboard with NIV files **/
			var obj = dashboardJson.Niv.Dashboard.MobileLayout.Object[i];
			if(obj && obj != null && obj.designData){
				var compClassName = obj.designData["class"];
				if(imports.indexOf(compClassName) == -1){
					imports.push(compClassName);
				}
			}else{
				imports = ["*"];
				break;
			}
		}
	}
	if(imports.length<1 || importsStat<1 || (dashboardJson.Niv.Dashboard.TabletLayout && dashboardJson.Niv.Dashboard.TabletLayout.Object && (imports.length != dashboardJson.Niv.Dashboard.TabletLayout.Object.length ))){
			for(var i=0 ; i<dashboardJson.Niv.Dashboard.TabletLayout.Object.length ; i++){
				/** Need to check for old dashboard with NIV files **/
				var obj = dashboardJson.Niv.Dashboard.TabletLayout.Object[i];
				if(obj && obj != null && obj.designData){
					var compClassName = obj.designData["class"];
					if(imports.indexOf(compClassName) == -1){
						imports.push(compClassName);
					}
				}else{
					imports = ["*"];
					break;
				}
			}
		}
	frameworkUtil.loadCompScripts(imports, function () {
		window.jqEasyUI = jQuery.noConflict(true);
		window.$ = jqEasyUI;

		fwkCtrl.dashboard = new DashBoard();
		/** Will remove the null from the Objects array of AbsoluteLayout, otherwise dashboard is crashing while opening **/
		dashboardJson.Niv.Dashboard.AbsoluteLayout.Object = frameworkUtil.removeNullFromObjectsArray(dashboardJson.Niv.Dashboard.AbsoluteLayout.Object);
		fwkCtrl.dashboard.setDashboardJson( dashboardJson );
		parser.init(dashboardJson, fwkCtrl.dashboard);
		parser.parseDashboardJSON();
		fwkCtrl.onBeforeDashboardLoad();
		/**Below method is to enable global filter values in report burst**/
		fwkCtrl.enableGlobalFilter();
	});
};

/** @description Method will get called only on resize of the browser window in publish portal DAS-475**/
FrameworkController.prototype.resizeRedraw = function (dashboardJson) {
	var fwkCtrl = this;
	//window.jqEasyUI = jQuery.noConflict(true);
	//window.$ = jqEasyUI;

	fwkCtrl.dashboard = new DashBoard();
	/** Will remove the null from the Objects array of AbsoluteLayout, otherwise dashboard is crashing while opening **/
	dashboardJson.Niv.Dashboard.AbsoluteLayout.Object = frameworkUtil.removeNullFromObjectsArray(dashboardJson.Niv.Dashboard.AbsoluteLayout.Object);
	fwkCtrl.dashboard.setDashboardJson( dashboardJson );
	parser.init(dashboardJson, fwkCtrl.dashboard);
	parser.parseDashboardJSON();
	fwkCtrl.onBeforeDashboardLoad();
	/**Below method is to enable global filter values in report burst**/
	fwkCtrl.enableGlobalFilter();
};

FrameworkController.prototype.enableGlobalFilter = function () {
	/**Adding below set timeout for updating global filter in open doc of report burst**/
	setTimeout(function () {
		sdk.filterReportBurst();
	}, 120000);
};
FrameworkController.prototype.onBeforeDashboardLoad = function () {
	if(IsBoolean(frameworkController.dashboard.m_enablereportburst)){
		sdk.createExportComponentForReportBurst();
    }
	bizviz.init(frameworkController.dashboard);
	gvController.init(frameworkController.dashboard);
	this.setValuesFromQueryString();
	this.registerObserverNotifiers();
	this.dashboard.initWindowResizeEvent();
	this.initiateComponents();
	bizviz.updateGlobalVariable("dashboard", {}, true);
	/*DAS-299 added above line to call dashboard script*/
	this.getLanguageMappingAndDrawDashboard();
	/** Register unload event to stop background processes **/
	frameworkUtil.initUnloadEvent();
};
FrameworkController.prototype.getLanguageMappingAndDrawDashboard = function () {
	var fwkCtrl = this;
	setTimeout(function(){
		fwkCtrl.initLanguageMapping(function(){
			fwkCtrl.drawStaticComponents();
			//fwkCtrl.drawHiddenComponents();
			fwkCtrl.initService();
		});
	}, 100);
};

FrameworkController.prototype.drawHiddenComponents = function () {
	try{
		if(IsBoolean(this.dashboard.m_enablereportburst)){
			sdk.createExportComponentForReportBurst();
	    }
	}catch(e){
		console.log(e);
	}
};
FrameworkController.prototype.initLanguageMapping = function (cb) {
	if(IsBoolean(dGlobals.langMap.isEnabled)){
		if(req_url.designer.getLanguageSettingContents && (dGlobals.langMap.name !== "" || dGlobals.langMap.id !== "")){
			showLoader();
			var temp = this;
			var formData = {
				"languageSettingName": dGlobals.langMap.name,
				"languageKey": dGlobals.langMap.language
			};
			/** For dashboard migration pass the Language Mapping Id**/
			if(dGlobals.langMap.id){
				formData.languageSettingId = dGlobals.langMap.id;
			}
			makeSecureRequest({
				url: base_url + req_url.designer.getLanguageSettingContents, method: "POST", formData: {
					"data": JSON.stringify(formData),
					"serviceName": "getLanguageSettingContents",
					"spacekey": parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey,
					"token": parent.BIZVIZ.SDK.getAuthInfo().authToken,
					"userid": parent.BIZVIZ.SDK.getAuthInfo().user.id
				}, 
				params: {
					headers: {
						authtoken: parent.BIZVIZ.SDK.getAuthInfo().authToken,
						spacekey: encryptText(parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey),
						userid: encryptText(parent.BIZVIZ.SDK.getAuthInfo().user.id)
					}
				}
			},
			function(complete) {
				hideLoader();
				if(complete){
					try{
						complete = getDecryptedResponse(complete);
						var result = complete;
						if(result && IsBoolean(result.success)){
							temp.setLanguageMappingData(result.languageSettingContents);
						}
					}catch(e){
						console.log(e);
					}
				}
				cb && cb();
			},
			function() {
				hideLoader();
				cb && cb();
			});
		}else{
			console.log("Invalid Language Setting Configuration");
			cb();
		}
	}else{
		cb();
	}
};
FrameworkController.prototype.setLanguageMappingData = function (arr) {
	var json = {};
	if(arr){
		arr.map(function(obj){
			if(dGlobals.langMap.language === "all" || obj.languageKey == dGlobals.langMap.language){
				json[""+obj.key] = obj.value;
			}
		});
	}
	dGlobals.langMap.data = json;
};
/** @description this method will redraw the dashboard when window resized or orientation changed in ipad **/
FrameworkController.prototype.resizeDashboard = function () {
/*
 * if(isScaling){
		for (var i = 0, len = this.dashboard.m_widgetsArray.length; i < len; i++) {
			this.dashboard.m_widgetsArray[i].hideToolTip();
			this.dashboard.m_widgetsArray[i].m_x = this.dashboard.m_widgetsArray[i].chartJson.x;
			this.dashboard.m_widgetsArray[i].m_y = this.dashboard.m_widgetsArray[i].chartJson.y;			
			this.dashboard.m_widgetsArray[i].m_width = this.dashboard.m_widgetsArray[i].chartJson.width;
			this.dashboard.m_widgetsArray[i].m_height = this.dashboard.m_widgetsArray[i].chartJson.height;
			this.dashboard.m_widgetsArray[i].m_initialvisibility = this.dashboard.m_widgetsArray[i].chartJson.initialVisibility;
		}
		this.initiateComponents();
		this.drawStaticComponents();
		this.initService();
	}
*/
	if(isScaling){
		var fwkCtrl = this;
		parser.parseDashboardJSON();
		gvController.init(fwkCtrl.dashboard);
		fwkCtrl.setValuesFromQueryString();
		fwkCtrl.registerObserverNotifiers();
		fwkCtrl.initiateComponents();
		this.getLanguageMappingAndDrawDashboard();
	}
};
/** @description this method will store the params in gv or flash vars depend upon the type **/
FrameworkController.prototype.setValuesFromQueryString = function () {
	var parameters = this.getQueryStrings();
	for (var key in parameters) {
		if (key !== undefined && key !== "") {
			if (key.indexOf(".") > -1) {
				this.setValuesToGlobalVariable(key, parameters[key]);
			} else {
				this.setValuesToFlashVars(key, parameters[key]);
			}
		}
	}
};
/** @description method to extract key-value params from the url **/
FrameworkController.prototype.getQueryStrings = function () {
	var parameters = {};
	var decode = function (s) {
		return decodeURIComponent(s.replace(/\+/g, " "));
	};
	var queryString = location.search.substring(1);
	if (queryString !== "" && queryString !== undefined) {
		var keyValues = queryString.split("&");
		for (var i=0; i<keyValues.length; i++) {
			var key = keyValues[i].split("=");
			if (key.length > 1) {
				parameters[decode(key[0])] = decode(key[1]);
			}
		}
	}
	return parameters;
};
/** @description update the global variable **/
FrameworkController.prototype.setValuesToGlobalVariable = function (paramName, value) {
	var keys = paramName.split(".");
	gvController.updateGlobalVarAttribute(keys[0], keys[1], value);
};
/** @description update the flash variable **/
FrameworkController.prototype.setValuesToFlashVars = function (flashVarName, value) {
	if (this.dashboard !== undefined && this.dashboard !== "") {
		var flashVars = this.dashboard.getFlashVars();
		if (flashVars === "") {
			var flashvars = new FlashVars();
			this.dashboard.setFlashVars(flashvars);
		}
		var paramObj = flashVars.getParamFromName(flashVarName);
		if (paramObj === "") {
			paramObj = new Param();
			paramObj.setName(flashVarName);
			paramObj.setValue(value);
			flashVars.setParam(paramObj);
		} else {
			paramObj.setValue(value);
		}
	}
};
/** @description will register the observer - notifiers for connections, datasets etc. **/
FrameworkController.prototype.registerObserverNotifiers = function () {
	this.dashboard.initializeDataProvider();
};
/** @description Will call the init methods of component- which will initialize their container i.e. canvas/ div etc. **/
FrameworkController.prototype.initiateComponents = function () {
	rendererController.initiateComponents(this.dashboard);
};
/** @description draw static components like image,labels,textboxes etc. **/
FrameworkController.prototype.drawStaticComponents = function () {
	rendererController.drawStaticComponents();
};
/** @description Method will call all the services asynchronously, fetch the data and call the callbacks **/
FrameworkController.prototype.initService = function () {
	/** Will show the loader when web-services pull the data **/
	initLoader();
	var temp = this;
	dataManager.setDashboard(this.dashboard);
	/*
	for (var i = 0; i < this.dashboard.getDataProviders().getDataURL().length; i++) {
		var dataProvider = this.dashboard.getDataProviders().getDataURL()[i];
		dataManager.initiateService(dataProvider, this.setXMLResponse.bind(this));
	};
	*/
	var serviceTypeMap = [];
	var loadAtStartupStatus = {"load": [], "noLoad": []};
	var dUrls = this.dashboard.getDataProviders().getDataURL();
	for (var i = 0; i < dUrls.length; i++) {
		var serviceType = dUrls[i].m_servicetype ? dUrls[i].m_servicetype : dUrls[i].m_type;
		if(dUrls[i].m_type === "web" && (serviceType == "clarityWSDL" || serviceType !== "bizvizPA")){
			var isTypeExist = serviceTypeMap.some(function(v) {
			    return v.type === dUrls[i].m_datasourcetype;
			});
			if(!isTypeExist && dUrls[i].m_datasourcetype){
				serviceTypeMap.push({
					type: dUrls[i].m_datasourcetype
				});
			}
		}
		if (IsBoolean(dUrls[i].m_loadatstartup)) {
			loadAtStartupStatus.load.push(dUrls[i]);
		}else{
			loadAtStartupStatus.noLoad.push(dUrls[i]);
		}
	}
	this.initWSDLCalls(serviceTypeMap, function (complete) {
		if(complete){
			try{
				complete = getDecryptedResponse(complete);
				/** For dataService type of connections, set the soapEndPoint **/
				var result = JSON.parse(complete);
				for (var i = 0; i < dUrls.length; i++) {
					var serviceType = dUrls[i].m_servicetype ? dUrls[i].m_servicetype : dUrls[i].m_type;
					if(dUrls[i].m_type === "web" && (serviceType == "clarityWSDL" || serviceType !== "bizvizPA")){
						for (var j = 0; j < result.length; j++) {
							if(result[j] && result[j].type === dUrls[i].m_datasourcetype){
								/** Set to the data provider **/
								dUrls[i].setSOAPEndPoint(result[j].url);
								/** Set to the web service **/
								dUrls[i].getWebService().setQueryEndPoint(result[j].url);
								break;
							}
						}
					}
				}
			}catch(e){
				console.log(e);
			}
		}
		temp.initServiceBlocks(0, loadAtStartupStatus.load.concat(loadAtStartupStatus.noLoad));
	});
};
/** Get all the EndPoints of the services at first and then make getRecords call **/
FrameworkController.prototype.initWSDLCalls = function (serviceTypeMap, cb) {
	/** Call getEndpointUrl only when there is atleast one webService connection available **/
	if(serviceTypeMap.length > 0 && req_url.designer.getEndpointUrl){
		showLoader();
		makeSecureRequest({
			url: base_url + req_url.designer.getEndpointUrl, method: "POST", formData: {
				"data": JSON.stringify({"dcType": serviceTypeMap}),
				"spacekey": parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey,
				"token": parent.BIZVIZ.SDK.getAuthInfo().authToken,
				"userid": parent.BIZVIZ.SDK.getAuthInfo().user.id
			}, 
			params: {
				headers: {
					authtoken: parent.BIZVIZ.SDK.getAuthInfo().authToken,
					spacekey: encryptText(parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey),
					userid: encryptText(parent.BIZVIZ.SDK.getAuthInfo().user.id)
				}
			}
		},
		function(complete) {
			hideLoader();
			cb && cb(complete);
		},
		function() {
			hideLoader();
			cb && cb();
		});
	}else{
		cb && cb();
	}
};
/** @description To load services in a chunk **/
FrameworkController.prototype.initServiceBlocks = function (indexLimit, services) {
	var temp = this;
	function drawNextChunk(){
		if(++indexLimit*temp.m_chunkdatalimit < services.length){
			temp.initServiceBlocks(indexLimit, services);
		}
	}
	for (var i = indexLimit*temp.m_chunkdatalimit; i < services.length; i++) {
		if(i<(indexLimit+1)*temp.m_chunkdatalimit){
			var dataProvider = this.dashboard.getDataProviders().getDataURL()[i];
			if(dataProvider.m_type === "ds"){
				dataManager.initiateService(dataProvider, this.setXMLResponseForDs.bind(this));
			}else{
				dataManager.initiateService(dataProvider, this.setXMLResponse.bind(this));
			}
		} else {
			setTimeout(	drawNextChunk, temp.m_chunkdatatimeout);
			break;
		}
	}
};
/** @description Method will be called when connection got a response **/
FrameworkController.prototype.setXMLResponse = function (data) {
	if( this.getDashboardViewState() ){
		this.notifyObserverComponents(data);
	}
};
/** @description Method will be called when connection got a response **/
FrameworkController.prototype.setXMLResponseForDs = function (data,i,registerComponent) {
	if( this.getDashboardViewState() ){
		this.notifyObserverComponentsForDs(data,i,registerComponent);
	}
};
/** @description to store the complete data received in a connection response **/
FrameworkController.prototype.notifyObserverComponents = function (data) {
	data.dataObject =   frameworkUtil.cleanData(data.dataObject);
	this.m_dataStore = data;
	this.updateWholeData(data);
	if(IsBoolean(data && data.status && data.status.isDataReceived)){
		this.callNotifierCallbacks(data);
		/** Here notifierCB takes the control to the Derived Data Provider and comes back with new data object **/
		this.m_dataStore = data;
		this.updateConnectionGlobalVariable(this.m_dataStore);
	}
	var obj = dataManager.manipulateData(data);
	this.renderComponentsWithDataSet(obj);
	this.renderComponentsWithVirtualDataSet(obj);
};
/** @description to store the complete data received in a connection response **/
FrameworkController.prototype.notifyObserverComponentsForDs = function (data,i,registerComponent) {
	data.dataObject =   frameworkUtil.cleanData(data.dataObject);
	this.m_dataStore = data;
	this.updateWholeData(data);
	if(IsBoolean(data && data.status && data.status.isDataReceived)){
		this.callNotifierCallbacks(data);
		/** Here notifierCB takes the control to the Derived Data Provider and comes back with new data object **/
		this.m_dataStore = data;
		this.updateConnectionGlobalVariable(this.m_dataStore);
	}
	var obj = dataManager.manipulateData(data);
	this.renderComponentsWithDataSetForDs(obj,i,registerComponent);
	this.renderComponentsWithVirtualDataSet(obj);
};
/** @description to store the complete data received in a connection response **/
FrameworkController.prototype.updateWholeData = function (data) {
	data.dataSetValues.m_dataUrl.setWholeData(data.dataObject);
};
/** @description to store the complete data received in a connection response **/
FrameworkController.prototype.callNotifierCallbacks = function (data) {
	data.dataSetValues.m_dataUrl.callNotifierCallbacks(data.dataObject);
};
/** @description When Connection loads, it updated the gv and script will be executed **/
FrameworkController.prototype.updateConnectionGlobalVariable = function (data) {
	gvController.updateGlobalVariable(data.dataSetValues.m_dataUrl, {
		"data" : data.dataObject,
		"FrameworkComponent" : this.m_dataStore
	}, "");
};
/** @description Component which has a valid dataset, will draw **/
FrameworkController.prototype.renderComponentsWithDataSet = function (obj) {
	if (obj) {
		for (var i = 0; i < obj.DataSet.length; i++) {
			rendererController.drawComponent(obj.DataSet[i]);
		}
	}
};
/** @description Component which has a valid dataset, will draw **/
FrameworkController.prototype.renderComponentsWithDataSetForDs = function (obj,k,registerComponent) {
	if (obj) {
	    if (obj.DataSet[k]["Chart"].m_datasetid !== registerComponent) {
	        for (var i = 0; i < obj.DataSet.length; i++) {
	            if (obj.DataSet[i]["Chart"].m_datasetid === registerComponent) {
	                k = i;
	                break;
	            }
	        }
	    }
	    var lnth = obj.DataSet[k]["Fields"];
	    var fieldMatch = this.getFieldValues(lnth, "hierarchyType");
	    /**Concatenating aggregation function with field names**/
	    for (var j = 0; j < lnth.length; j++) {
	        if ((lnth[j].dstype !== "none" || lnth[j].Type === "XField") && lnth[j].dstype !== undefined) {
	            if (obj.DataSet[k]["Chart"].m_objecttype == "datagrid") {
	                var checkAggr = (lnth[j].fieldname).split("_");
	                lnth[j].fieldname = (checkAggr[0] === lnth[j].dstype) ? lnth[j].fieldname : lnth[j].dstype + "_" + lnth[j].fieldname;
	                /**Modify Json when associating legend component for series values (For DataGrid)**/
	                if( obj.DataSet[k]["Chart"].m_defaultlegendfields && obj.DataSet[k]["Chart"].m_defaultlegendfields[j]) {
	                	obj.DataSet[k]["Chart"].m_defaultlegendfields[j]["key"] = lnth[j].fieldname;
	                }
	                /****/
	                if (obj.DataSet[k]["Chart"].m_alertObj && obj.DataSet[k]["Chart"].m_alertObj[lnth[j].Name]) {
	                	var alertObj = obj.DataSet[k]["Chart"].m_alertObj;
	                	//for (var c = 0; c < Object.keys(alert).length; c++) {
	                		alertObj[lnth[j].fieldname] = (checkAggr[0] === lnth[j].dstype)?obj.DataSet[k]["Chart"].m_alertObj[lnth[j].fieldname]:obj.DataSet[k]["Chart"].m_alertObj[lnth[j].Name];
	                		alertObj[lnth[j].fieldname].m_name = (checkAggr[0] === lnth[j].dstype) ? alertObj[lnth[j].fieldname].m_name : lnth[j].dstype + "_" + alertObj[lnth[j].fieldname].m_name;
	                		alertObj[lnth[j].fieldname].m_comparecolumn = (checkAggr[0] === lnth[j].dstype) ? alertObj[lnth[j].fieldname].m_comparecolumn : lnth[j].dstype + "_" + alertObj[lnth[j].fieldname].m_comparecolumn;
	                		delete alertObj[lnth[j].Name];
	                	//}
	                }
	            } else {
	                var checkAggr = (lnth[j].Name).split("_");
	                
	                if (obj.DataSet[k]["Chart"].m_conditionalColors && obj.DataSet[k]["Chart"].m_conditionalColors.m_ConditionalColor) {
	                    if (lnth[j].Type === "Category" || checkAggr[0] === lnth[j].dstype) {
	                        // Not Required for category
	                    } else {
	                        var condCol = obj.DataSet[k]["Chart"].m_conditionalColors.m_ConditionalColor;
	                        var condColJson = obj.DataSet[k]["Chart"].chartJson[obj.DataSet[k]["Chart"].m_subelement].ConditionalColors.ConditionalColor;
	                        for (var c = 0; c < condCol.length; c++) {
		                        if(condCol[c].m_seriesname === lnth[j].Name) {
		                        	 condCol[c].m_seriesname = lnth[j].dstype + "_" + condCol[c].m_seriesname;
			                         condCol[c].m_comparedfield = lnth[j].dstype + "_" + condCol[c].m_comparedfield;
			                         
			                         /**Updating json for repeater case**/
			                         condColJson[c].seriesName = lnth[j].dstype + "_" + condColJson[c].seriesName;
			                         condColJson[c].comparedField = lnth[j].dstype + "_" + condColJson[c].comparedField;
		                        }
	                        }
	                        /**Modify Json when associating legend component for series values (For Charts)**/
	    	                if( obj.DataSet[k]["Chart"].m_defaultlegendfields ) {
	    	                	for (var defld = 0; defld < obj.DataSet[k]["Chart"].m_defaultlegendfields.length; defld++) {
	    	                		if (obj.DataSet[k]["Chart"].m_defaultlegendfields[defld]["key"] === lnth[j].Name) {
	    	                			obj.DataSet[k]["Chart"].m_defaultlegendfields[defld]["key"] = (checkAggr[0] === lnth[j].dstype) ? lnth[j].Name : lnth[j].dstype + "_" + lnth[j].Name;
	    	                		}
	    	                	}
	    	                	//obj.DataSet[k]["Chart"].m_defaultlegendfields[j-1]["key"] = (checkAggr[0] === lnth[j].dstype) ? lnth[j].Name : lnth[j].dstype + "_" + lnth[j].Name;
	    	                }
	                    }
	                }
	                var flag = (lnth[j].Type === "Category" || lnth[j].hierarchyType === "parent" || lnth[j].hierarchyType === "child" || checkAggr[0] === lnth[j].dstype);
	                lnth[j].Name = (IsBoolean(flag)) ? lnth[j].Name : lnth[j].dstype + "_" + lnth[j].Name;
	                if (obj.DataSet[k]["Chart"].m_type === "Plot") {
	                    lnth[j].OtherField = (IsBoolean(flag)) ? lnth[j].OtherField : lnth[j].dstype + "_" + lnth[j].OtherField;
	                    lnth[j].ColorField = (IsBoolean(flag)) ? lnth[j].ColorField : lnth[j].dstype + "_" + lnth[j].ColorField;
	                }
	                lnth[j].DataLabelCustomProperties.datalabelField = (IsBoolean(flag)) ? lnth[j].DataLabelCustomProperties.datalabelField : lnth[j].dstype + "_" + lnth[j].DataLabelCustomProperties.datalabelField;
	                /**AdditionalField object has been modified for Tree Map, handling multiple datalabels**/
	                if (obj.DataSet[k]["Chart"].m_type === "TreeMap") {
	                	var combineField = "";
	                	var splitField = (lnth[j].AdditionalField).split(",");
	                	for (var x = 0; x < splitField.length; x++) {
	                		var labelFlag = (fieldMatch[splitField[x]] === "parent" || fieldMatch[splitField[x]] === "child");
	                		var newField = (IsBoolean(flag) || IsBoolean(labelFlag)) ? splitField[x]:lnth[j].dstype + "_" + splitField[x];
	                		if (x === splitField.length-1) {
	                			combineField = combineField + newField;
	                		} else {
	                			combineField = combineField + newField + ",";
	                		}
	                	}
	                	lnth[j].AdditionalField = combineField;
	                }
	            }
	        }
	    }
	    rendererController.drawComponent(obj.DataSet[k]);
	}
};

/** @description getting field property according to field name **/
FrameworkController.prototype.getFieldValues = function (lnth, typeObj) {
	var map = {};
	for (var i = 0; i < lnth.length; i++) {
		if (lnth[i].Name !== undefined) {
			map[lnth[i].Name] = lnth[i][typeObj];
		}
	}
	return map;
};

/** @description Deprecated method - to draw component which takes data from dataset **/
FrameworkController.prototype.renderComponentsWithVirtualDataSet = function (obj) {
	if (obj) {
		for (var j = 0; j < obj.VirtualDataSet.length; j++) {
			rendererController.drawSingleValueComponent(obj.VirtualDataSet[j]);
		}
	}
};
/** @description Draw components like label/gauge/textbox which should update dynamically **/
FrameworkController.prototype.renderComponentsWithDynamicUpdate = function(components) {
	if (components) {
		for (var i = 0; i < components.length; i++) {
			components[i].draw();
			/*DAS-693:added to hide the comp based on initial visibility to prevent delay in hiding on preview*/
			rendererController.componentIniitialVisibility(components[i]);
		}
	}
};
/** @description Method to redrawComponents - Used in bootstrap of charting! **/
FrameworkController.prototype.redrawObjects = function () {
	var cmps = rendererController.getDashboard().m_widgetsArray;
	var bs = rendererController.getDashboard().isBootstrap();
	if (bs) {
		rendererController.getDashboard().getAbsoluteLayout().drawAbsoluteCanvas();
		rendererController.getDashboard().getAbsoluteLayout().drawMaximizeOverlayDiv();
	}
	for (var i = 0; i < cmps.length; i++) {
		if (bs) {
			cmps[i].initializeForBootstrap();
		}
		cmps[i].setDraggableCanvasSize();
		cmps[i].draw();
	}
};
//# sourceURL=FrameworkController.js