/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: ServiceManager.js
 * @description Responsible for fetching data from webservices  
 * **/

/** @description Constructor ServiceManager **/
function ServiceManager() {};
/** @description Callback when service is successfully returns the response **/
function Success(jqXHR, exception) {
	hideLoader();
	//console.log("Web Service call Success");
};
/** @description Callback when service is failed to returns the response **/
function Error(jqXHR, exception) {
	hideLoader();
	//console.log("Web Service call failed");
};
/** @description Callback when service calling is completed **/
function ProcessResponse() {
	//console.log("ProcessResponse: ");
};
/** @description converts the XML/JSON response to an object 
 * @param {Object} XMLData: Data object
 * @param {String} subElements: "Records" or "records"
 * @param {String} wsdlType: xml or json
 * @return {Object} m_fieldNameValues: object which contains the data from the connection
 * **/
function convertXMLToJSON(XMLData, subElements, wsdlType) {
	var m_fieldNameValues = [];
	var m_records = "records";
	var m_record = "record";
	if (subElements && subElements != "") {
		m_records = subElements[0];
		m_record = subElements[1];
	}
	try {
		var recordsObj = $(XMLData).find(m_records);
		if (wsdlType == "JSON") {
			/** JSON type of response **/
			if ($(recordsObj)[0]) {
				m_fieldNameValues = $(recordsObj)[0]["textContent"];
				m_fieldNameValues = getDecryptedResponse(m_fieldNameValues);
				if (m_fieldNameValues) {
					m_fieldNameValues = frameworkUtil.convertStringToJson(m_fieldNameValues);
				}
			}
		} else if (wsdlType == "ARRAY") {
			/** Array type of response **/
		} else {
			/** XML type of response **/
			$(recordsObj).find(m_record).each(function() {
				var hashmap = {};
				var childs = $(this).children();
				for (var i = 0; i < childs.length; i++) {
					var tagName = (childs[i].localName == undefined) ? childs[i].tagName : childs[i].localName;
					var tagData = childs[i].textContent;
					hashmap[tagName] = tagData;
				}
				m_fieldNameValues.push(hashmap);
			});
		}
	} catch (e) {
		console.log("Error in converting service response !" + e);
	}
	return m_fieldNameValues;
};
function convertToJSON(XMLData, subElements, wsdlType) {
	var m_fieldNameValues = [];
	try {
		if (wsdlType == "JSON") {
			/** JSON type of response **/
			if (XMLData) {
				m_fieldNameValues = XMLData;
				m_fieldNameValues = getDecryptedResponse(m_fieldNameValues);
				if (m_fieldNameValues) {
					m_fieldNameValues = frameworkUtil.convertStringToJson(m_fieldNameValues);
				}
			}
		} else if (wsdlType == "ARRAY") {
			/** Array type of response **/
		} else {
			// Do nothing
		}
	} catch (e) {
		console.log("Error in converting service response !" + e);
	}
	return m_fieldNameValues;
};
/** @description decryption methods for DataService response
 *  @param {Object} complete: response object
 *  @return {Object}  complete: decrypted object
 *  **/
function getDecryptedResponse(resp) {
	var authInfo = parent.BIZVIZ.SDK.getAuthInfo();
	var decryptedData, decryptedText;
	if (authInfo.key && resp) {
		var isString = false;
		try {
			if (typeof resp === 'string' || resp instanceof String) {
				resp = JSON.parse(resp);
				isString = true;
			}
			if (resp.data) {
				var key = CryptoJS.enc.Base64.parse(authInfo.key);
				decryptedData = CryptoJS.TripleDES.decrypt(resp.data, key, {
					mode: CryptoJS.mode.ECB
				});
				decryptedText = decryptedData.toString(CryptoJS.enc.Utf8);
				if (!isString) {
					decryptedText = JSON.parse(decryptedText);
				}
			} else {
				return resp;
			}
		} catch (err) {
			decryptedText = {};
		}
		return decryptedText
	} else {
		return resp;
	}
};
/** @description decryption methods for PAService response
 *  @param {Object} complete: response object
 *  @return {Object}  complete: decrypted object
 *  **/
function getDecryptedObjectForPA(resp) {
	var authInfo = parent.BIZVIZ.SDK.getAuthInfo();
	var decryptedText, decryptedData;
	if (authInfo.key && resp.data) {
		var isString = false;
		try {
			if (typeof resp !== "object") {
				resp = JSON.parse(resp);
				isString = true;
			}
			var key = CryptoJS.enc.Base64.parse(authInfo.key);
			decryptedData = CryptoJS.TripleDES.decrypt(resp.data, key, {
				mode: CryptoJS.mode.ECB
			});
			decryptedText = decryptedData.toString(CryptoJS.enc.Utf8);
			if (!isString) {
				decryptedText = JSON.parse(decryptedText);
			}
		} catch (err) {
			decryptedText = {};
		}
		return decryptedText;
	} else {
		resp = JSON.parse(resp.data);
		return resp;
	}
};

function getDecryptedObjectForPAPython(resp) {
	var authInfo = parent.BIZVIZ.SDK.getAuthInfo();
	var decryptedText;
	if( authInfo.key && resp.data) {
		var key, decryptedData, decryptedText;
		var isString = false;
		key = CryptoJS.enc.Base64.parse(authInfo.key);
		try {

			if(typeof resp !== "object" || resp instanceof String) {
				resp = JSON.parse(resp);
				isString = true;
			}
			decryptedData = CryptoJS.TripleDES.decrypt(resp.data, key, {
				mode: CryptoJS.mode.ECB
			});
			
			decryptedData.sigBytes = resp.sig;
			decryptedText = decryptedData.toString(CryptoJS.enc.Utf8);
			
			if(typeof decryptedText !== "object" || decryptedText instanceof String){
    			var d = decryptedText.replace(new RegExp('True', 'g'), true);
    			d = d.replace(new RegExp('False', 'g'), false);
    			try{
    				decryptedText = JSON.parse(d);
    			}
    			catch(err){
    				d = decryptedText.replace(new RegExp('\'', 'g'), '"');
    				decryptedText = JSON.parse(d);
    			}
			}
			
		} catch(err) {
			decryptedText = {};
		}
		return decryptedText
	} else {
		if(resp instanceof Array || resp instanceof Object){
			return resp;
		}
		else{
			try{
				return JSON.parse(resp);
			}catch(e){
				console.log(e);
				return resp; 
			}
		}
	}
};
/** @description Encryption methods for JSON object
 *  @param {Object} data: object
 *  @return {strong} data: encrypted string
 *  **/
function getEncryptedObject(data) {
	var authInfo = parent.BIZVIZ.SDK.getAuthInfo();
	var encryptedText;
	/** Always do EncodeURI without depending upon encryption enabled/disabled **/
	data = transformRequest(data);
	if( authInfo.key && data ) {
		var key, encData;
		try {
			key = CryptoJS.enc.Base64.parse(authInfo.key);
			encData = CryptoJS.TripleDES.encrypt(data, key, {
				mode: CryptoJS.mode.ECB
			});
			encryptedText = encData.toString();
		} catch(err) {
			encryptedText = "{}";
		}
		return encryptedText;
	} else {
		return data;
	}
};
function transformRequest (obj) {
	var str = [];
	for(var p in obj) {
		if(Array.isArray(obj[p])) {
			for(var ctr = 0, size = obj[p].length; ctr < size; ctr ++) {
				str.push(encodeURIComponent(p) + "[]=" + encodeURIComponent(obj[p][ctr]));
			}
		} else {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
	}
	return str.join("&");
};
function encryptText(data) {
	var authInfo = parent.BIZVIZ.SDK.getAuthInfo();
	var encryptedText;
	if( authInfo.key && data ) {
		var key, encData;
		data = data.toString();
		try {
			key = CryptoJS.enc.Base64.parse(authInfo.key);
			encData = CryptoJS.TripleDES.encrypt(data, key, {
				mode: CryptoJS.mode.ECB
			});
			encryptedText = encData.toString();
		} catch(err) {
			encryptedText = "{}";
		}
		return encryptedText;
	} else {
		return data;
	}
};
/** @description Makes Ajax call, triggers callBack on success and on error
 *  @param {Object} request: object
 *  @param {function} scb: success calback method
 *  @return {function} ecb: error callback method
 *  **/
function makeSecureRequest(request, scb, ecb) {
	var config = {
		type: request.method,
		url: request.url,
		data: getEncryptedObject(request.formData),
		cname: request.compName,
		cache: false,
		traditional: true,
		crossDomain: true,
		success: function() {
			hideLoader();
		},
		error: function(jqXHR, xhr, statusCode) {
			hideLoader();
			switch (statusCode.status) {
    			/*case 200:
    			case 204: break;
    			case 500:*/
    			case 404:
    				BIZVIZ.SDK.Auth.internalErrorOccured(jqXHR.status);
    				break;
    			case 304:
    				parent.BIZVIZ.SDK.Auth.initSession();				// Session Exipred
    				break;
    			case 305:
    				BIZVIZ.SDK.Auth.pemissionDenied();				// Session Exipred
    				ecb && ecb.call(this, jqXHR, status);
    				return null;
			}
			ecb && ecb();
		},
		complete: ProcessResponse
	};
	/** global ajax events **/
	if( request.global !== undefined ){
		config.global = request.global;
	}
	/** Add additional information in Ajax configuration if any present **/
	if (request.params !== null) {
		for (var key in request.params) {
			config[key] = request.params[key];
		}
	}
	/** Calling of jQuery Ajax **/
	$.when($.ajax(config)).then(function(complete, status) {
		if(status == "notmodified") {
			parent.BIZVIZ.SDK.Auth.initSession();					// Session Exipred
		}else{
			scb && scb(complete, status,config.cname);
		}
	});
};

function makeUnSecureRequest(request, scb, ecb) {
	var config = {
		type: request.method,
		url: request.url,
		data: request.formData,
		cname: request.compName,
		cache: false,
		traditional: true,
		crossDomain: true,
		success: function() {
			hideLoader();
		},
		error: function(jqXHR, xhr, statusCode) {
			hideLoader();
			switch (statusCode.status) {
				/*case 200:
				case 204: break;
				case 500:*/
				case 404:
					BIZVIZ.SDK.Auth.internalErrorOccured(statusCode.status);
					break;
				case 304:
					parent.BIZVIZ.SDK.Auth.initSession();				// Session Exipred
					break;
				case 305:
					BIZVIZ.SDK.Auth.pemissionDenied();				// Session Exipred
					return null;
			}
			ecb && ecb();
		},
		complete: ProcessResponse
	};
	/** global ajax events **/
	if( request.global !== undefined ){
		config.global = request.global;
	}
	/** Add additional information in Ajax configuration if any present **/
	if (request.params !== null) {
		for (var key in request.params) {
			config[key] = request.params[key];
		}
	}
	/** Calling of jQuery Ajax **/
	$.when($.ajax(config)).then(function(complete, status) {
		if(status == "notmodified") {
			parent.BIZVIZ.SDK.Auth.initSession();					// Session Exipred
		}else{
			scb && scb(complete, status,config.cname);
		}
	});
};
/*********************************************************************************/
/** @description Constructor DataService, parent of all services **/
function DataService(){
	this.m_datatype = "JSON";
};
/** @description Setter method to set the values object 
 *  @param {Object} values: Object which has the details of filter-key-values 
 *  **/
DataService.prototype.setValue = function(value) {
	this.m_value = value;
};
DataService.prototype.setDataType = function(dataType){
	this.m_datatype = dataType;
};
DataService.prototype.getDataType = function(){
	return this.m_datatype;
};
DataService.prototype.clearComponentLoader = function(dataSetValues) {
	for (var i = 0; i < dataSetValues.m_registeredDataSet.length; i++) {
		var chart = dataSetValues.m_registeredDataSet[i].m_registeredWidget;
		/** If it is a chart type then show the loader **/
		try{
			if(chart && chart.getTitle()){
				chart.getTitle().clearLoaderContent();
				break;
			}
		}catch(e){
			console.log(e);
		}
	}
};
DataService.prototype.setComponentLoader = function(dataSetValues, status) {
	for (var i = 0; i < dataSetValues.m_registeredDataSet.length; i++) {
		var chart = dataSetValues.m_registeredDataSet[i].m_registeredWidget;
		/** If it is a chart type then show the loader **/
		try{
			if (chart.getTitle()) {
				chart.setShowLoaderIcon(status.isLoader);
				if (status.isLoader && chart && chart.getTitle()) {
					chart.getTitle().showLoaderIcon();
				} else if(chart && chart.getTitle()){
					chart.getTitle().hideLoaderIcon();
				} else {
					// Do nothing
				}
				if(chart && chart.getTitle()){
					chart.getTitle().setLoaderContent(status.message, status.state);
				}
			}
			if (status.state == "progress") {
				chart.m_status.noData = "Data is loading...";
				chart.m_statuscolor = "#2E7D32";
			} else {
				chart.m_status.noData = "Data not available !";
				chart.m_statuscolor = "#EF6C00";
			}
		}catch(e){
			console.log(e);
		}
	}
};
/*********************************************************************************/
/** @description Constructor NQueryWebService **/
function NQueryWebService() {
	this.base = DataService;
	this.base();
	this.m_url = "";
	this.m_key = [];
	this.m_value = [];
	this.m_dashboard = "";
	this.m_rowlimit = "";
};
NQueryWebService.prototype = new DataService;
/** @description initialize the nQuery service 
 * @param {Object} dataUrl: object holds  properties related to nquery web service 
 * **/
NQueryWebService.prototype.init = function(dataUrl) {
	this.m_url = dataUrl.getUrl();
	this.m_key = dataUrl.getKeys();
	this.m_connid = dataUrl.getId();
	this.m_skipfiltervalues = dataUrl.getSkipFilterValues();
	this.m_queryendpoint = dataUrl.getSOAPEndPoint();
	this.m_dashboard = dataUrl.m_dashboard;
};
/** @description Calls the WSDL service first which fetches EndPoints and then proxy service is called to fetch data from.
 *  @param {Object} value: Object which keep the filter parameter's values
 *  @param {Object} dataSetValues: Object which has the details of components who consumes data from this connection 
 *  @param {function} callBack: Callback when service is completed
 *  **/
NQueryWebService.prototype.callWebservice = function(value, dataSetValues, callBack) {
	var temp = this;
	var url = this.m_url;
	this.setValue(value);
	if (url && url != "") {
		if (!(url.indexOf("?") > -1)) {
			/** Use SOAPEndPoint from JSON if it is available, else call WSDL service **/
			if(this.getQueryEndPoint() && this.getQueryEndPoint() !== ""){
				/** Call to getRecords **/
				temp.callWebServiceWithQueryEndPoint(dataSetValues, callBack);
			} else {
				/** Call to get the WSDL info and SOAP EndPoint **/
				//this.callWebserviceWithKey(dataSetValues, callBack);
				var dp = temp.m_dashboard.m_DataProviders.m_dataUrlIdObjMap[temp.m_connid];
				servicetypemap = [];
				servicetypemap.push({
					type : dp.m_datasourcetype
				});
				makeSecureRequest({
					url: base_url + req_url.designer.getEndpointUrl, method: "POST", formData: {
						"data": JSON.stringify({"dcType": servicetypemap}),
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
					complete = getDecryptedResponse(complete);
					/** For dataService type of connections, set the soapEndPoint **/
					var result = JSON.parse(complete);
					if (result[0].url !== "") {
						temp.m_dashboard.m_DataProviders.m_dataUrlIdObjMap[temp.m_connid].setSOAPEndPoint(result[0].url);
						temp.setQueryEndPoint(result[0].url);
						temp.callWebServiceWithQueryEndPoint(dataSetValues, callBack);
					}
				},
				function() {
					hideLoader();
					//callBack && callBack();
				});
			}
		} else {
			showLoader();
			makeSecureRequest({
				url: url,
				method: "POST",
				formData: temp.getSOAPEnvelope(),
				params: {
					headers: { "X-Requested-With": "XMLHttpRequest" },
					jsonp: false,
					jsonpCallback: false,
					contentType: "text/xml; charset=utf-8"
				}
			},
			function(complete) {
				hideLoader();
				var data = {
					"dataSetValues": dataSetValues,
					"dataObject": convertXMLToJSON(complete, "", temp.getDataType()),
					"status": { "isDataReceived": true }
				};
				callBack(data);
			},
			function() {
				hideLoader();
				var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
				callBack(data);
			});
		}
	}
};
/** @description Will fetch the WSDL and trigger callBack to fetch the actual service data 
 *  @param {Object} dataSetValues: Object which has the details of components who consumes data from this connection 
 *  @param {function} callBack: Callback when service is completed * 
 * **/
NQueryWebService.prototype.callWebserviceWithKey = function(dataSetValues, callBack) {
	var temp = this;
	var url = this.getServiceURL();
	showLoader();
	makeSecureRequest({ 
		url: url, method: "GET", formData: {}, params: null 
	},
	function(complete) {
		/** Success call back, now call the getRecords service and fetch the actual DataSet **/
		hideLoader();
		if (complete) {
			var queryEndPoint = temp.getEndPointLocation(complete);
			if (queryEndPoint !== "") {
				temp.setQueryEndPoint(queryEndPoint);
				temp.callWebServiceWithQueryEndPoint(dataSetValues, callBack);
			}
		} else {
			console.log("Failed to get Query EndPoint !");
		}
	},
	function() {
		/** If service fails, pass the blank data object to the callback, so that charts can display "Data not available" message **/
		var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
		callBack(data);
	});
};
/** @description Jetty server has bug to handle simultaneous requests,
 * changed the way of url - now it takes service name from url and append with another url from portal
 * @return updated url 
 **/
NQueryWebService.prototype.getServiceURL = function() {
	var href = this.m_url.split("/");
	var url = href[href.length - 1];
	url = (url == "") ? href[href.length - 2] : url;
	if (url == undefined) {
		return this.m_url;
	} else if (bizviz_dashboard_WSDL) {
		return bizviz_dashboard_WSDL + url;
	} else {
		// Do nothing
	}
	return this.m_url;
};
/** @description returns the end point 
 * @return EndPoint from the WSDL XML
 * **/
NQueryWebService.prototype.getEndPointLocation = function(data) {
	try {
		//		var json = parser.convertXMLToJSON(data);
		//		return json["definitions"]["service"]["port"][0]["address"]["_location"] ;
		return $($($($($($(data).children()[0]).children()[7])[0]).children()[0]).children()[0])[0].getAttribute("location");
	} catch (e) {
		//		return "http://192.168.1.69:8090/BizVizEP/queryservices/QueryService.QueryServiceHttpSoap11Endpoint" ;
		console.log("Error in getting Query End Point");
		console.log(e);
	}
	return "";
};
/** @description Setter method for EndPoints 
 * @param {String} queryEndPoint: End point 
 * **/
NQueryWebService.prototype.setQueryEndPoint = function(queryEndPoint) {
	this.m_queryendpoint = queryEndPoint;
};
/** @description Getter method for EndPoints 
 * **/
NQueryWebService.prototype.getQueryEndPoint = function() {
	return this.m_queryendpoint;
};
/** @description calls the service which fetches records in response 
 * @param {Object} dataSetValues: Object which has the details of components who consumes data from this connection 
 * @param {function} callBack: Callback when service is completed
 * **/
NQueryWebService.prototype.callWebServiceWithQueryEndPoint = function(dataSetValues, callBack) {
	var data = this.getProxyData();
	var url = this.getProxyURL();
	if (url != "") {
		var temp = this;
		if( IsBoolean(dataSetValues.m_dataUrl.m_timelyrefresh) ){
			/** Show component's loader **/
			temp.setComponentLoader(dataSetValues, { isLoader: true, message: "Data is loading...", state: "progress" });
		}else{
			showLoader();
		}
		makeSecureRequest({
			url: url, method: "POST", formData: data, 
			global: !IsBoolean(dataSetValues.m_dataUrl.m_timelyrefresh),
			params: {
				headers: {
					authtoken: parent.BIZVIZ.SDK.getAuthInfo().authToken,
					spacekey: encryptText(parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey),
					userid: encryptText(parent.BIZVIZ.SDK.getAuthInfo().user.id)
				}
			}
		},
		function(complete) {
			if( IsBoolean(dataSetValues.m_dataUrl.m_timelyrefresh) ){
				/** Hide component's loader **/
				temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Data loading completed", state: "completed" });
			}else{
				hideLoader();
			}
			var data = {
				"dataSetValues": dataSetValues,
				"dataObject": convertXMLToJSON(complete, "", temp.getDataType()),
				"status": { "isDataReceived": true }
			};
			try {
				if (complete != undefined && complete.children != undefined && complete.children[0] != undefined && complete.children[0].textContent == "Invalid Authentication Token") {
					alertPopUpModal({type:'warning', message:'Invalid auth token', timeout: '3000'});
				} else {
					callBack(data);
				}
			} catch (e) {
				console.log(e);
				callBack(data);
			}
		},
		function() {
			var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
			callBack(data);
		});
	}
};
/** @description prepare SOAP message for service call 
 * @return {Object} object contains the endPoint URL and SOAP envelope
 * **/
NQueryWebService.prototype.getProxyData = function() {
    return {
        "url": this.getQueryEndPoint(),
        "wsdl": this.getProxyEnvelope(),
        "isCached": this.getCachedFlag(),
        "docId": this.getDocID()
    };
};
/** @description Getter method for document id **/
NQueryWebService.prototype.getDocID = function() {
	if(IsBoolean(this.m_dashboard.m_enablecache) && pageInPortal !== undefined){
		return getUrlParameters().docid;
	}else{
		return "";
	}
};

/** @description Getter method for cache flag **/
NQueryWebService.prototype.getCachedFlag = function() {
	if(IsBoolean(this.m_dashboard.m_enablecache) && (pageInPortal !== undefined)){
	    var urlParam = getUrlParameters();
	    var dbMap = {};
	    var jsonMap = JSON.parse(localStorage.getItem("dbCacheMap"));
	    /**checking whether data is available in localStorage or not**/
	    if (localStorage.getItem("dbCacheMap") === null || localStorage.getItem("dbCacheMap") === "{}") {
	        dbMap[urlParam.docid] = dbMap[urlParam.docid] || {};
	        dbMap[urlParam.docid][this.m_connid] = this.m_value;
	        dbMap[urlParam.docid]["cacheddate"] = dbMap[urlParam.docid]["cacheddate"] || new Date();
	        localStorage.setItem("dbCacheMap", JSON.stringify(dbMap));
	        return this.m_dashboard.m_enablecache;
	    } else {
	    	/**checking whether loaded dashboard is available in localStorage or not**/
	    	if (jsonMap[urlParam.docid] === undefined) {
	    		jsonMap[urlParam.docid] = jsonMap[urlParam.docid] || {};
				jsonMap[urlParam.docid][this.m_connid] = this.m_value;
				jsonMap[urlParam.docid]["cacheddate"] = jsonMap[urlParam.docid]["cacheddate"] || new Date();
				localStorage.setItem("dbCacheMap", JSON.stringify(jsonMap));
				return this.m_dashboard.m_enablecache;
	    	} else {
	    		var filterValue = jsonMap[urlParam.docid][this.m_connid];
		        if (filterValue === undefined) {
		            jsonMap[urlParam.docid] = jsonMap[urlParam.docid] || {};
		            jsonMap[urlParam.docid][this.m_connid] = this.m_value;
		            localStorage.setItem("dbCacheMap", JSON.stringify(jsonMap));
		            return this.m_dashboard.m_enablecache;
		        }
		        if (JSON.stringify(filterValue) === JSON.stringify(this.m_value)) {
		            return true;
		        } else {
		            return false;
		        }
	    	}
	    }
	}else{
		return false;
	}
};

/** @description Getter method for SOAP Enevelope
 * @return {String} SOAP envelope
 * **/
NQueryWebService.prototype.getProxyEnvelope = function() {
	return btoa('<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">' +
		'<Body>' +
		'<executeQuery xmlns="http://webservice.required.bdbizviz.com">' + this.getFilterParams() +
		'<AuthToken xmlns="">' + this.getAuthToken() + '</AuthToken>' +
		'<key xmlns="">' + this.getKeyParams() + '</key>' +
		'</executeQuery>' +
		'</Body>' +
		'</Envelope>');
};
/** @description Getter method for Filter params 
 * @return {String} Filter keys and values string
 * **/
NQueryWebService.prototype.getFilterParams = function() {
	if (this.m_key.length == 0) {
		return '<filter xmlns=""/>';
	} else {
		var tempXML = '';
		for (var i = 0; i < this.m_key.length; i++) {
			/** When filter-parameter-value is empty / null / any user defined values, no need to pass the xml tag into service-call **/
			if(this.m_skipfiltervalues.indexOf(this.m_value[i]) === -1){
				tempXML += '<' + this.m_key[i] + '>' + this.m_value[i] + '</' + this.m_key[i] + '>';
			}
		}
		return '<filter xmlns="">' + tempXML + '</filter>';
	}
};
/** @description Getter method for Sauthentication token
 * @return {String} token value depends upon the dashboard opening in openDoc or in portal
 * **/
NQueryWebService.prototype.getAuthToken = function() {
	if (parent.opendoc && parent.opendoc !== undefined && parent.$.jStorage !== undefined) {
		return parent.$.jStorage.get("opendoctoken");
	}
	if (pageInPortal != undefined && parent.BIZVIZ.SDK.getAuthInfo().authToken != undefined) {
		return parent.BIZVIZ.SDK.getAuthInfo().authToken;
	}
	var authToken = "";
	var flashParams = this.m_dashboard.m_FlashVars.m_param;
	for (var i = 0; i < flashParams.length; i++) {
		if (/n\w{4}hToken/.test(flashParams[i].m_name) || flashParams[i].m_name == "token") {
			authToken = flashParams[i].m_value;
		}
	}
	return authToken;
};
/** @description Getter method for SOAP Key xml string 
 * @return {String} xml string for service name, data type and data limit 
 * **/
NQueryWebService.prototype.getKeyParams = function() {
	return "<serviceName>" + this.getServiceName() + "</serviceName>" +
		"<dataType>" + this.getDataType() + "</dataType>" +
		"<Limit>" + this.getLimit() + "</Limit>";
};
/** @description Getter method for ServiceName
 * @return {String} remove the pre text and url parameter if any from the url to get service name 
 * **/
NQueryWebService.prototype.getServiceName = function() {
	var n = this.m_url.split("/");
	var code = n[n.length - 1];
	return (code.indexOf("?") > -1) ? (code.split("?"))[0] : code;
};
/** @description Getter method for Data Limit
 * @return {String} empty string
 * **/
NQueryWebService.prototype.getLimit = function() {
	return this.m_rowlimit;
};
/** @description Getter method for Proxy url to fetch the data from plateform's data management module
 * @return {String} url of proxt service
 * **/
NQueryWebService.prototype.getProxyURL = function() {
	return base_url + req_url.designer.getProxyURL;
};
/** @description Getter method for SOAP envelope
 * @return {String} XML string of SOAP
 * **/
NQueryWebService.prototype.getSOAPEnvelope = function() {
	return '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> ' +
		'<SOAP-ENV:Body> ' +
		'<ns:executeQuery xmlns:ns="http://qaaws.bdbizviz.com/xsd">' + this.getFilterParams() +
		' <AuthToken xmlns="">' + this.getAuthToken() + '</AuthToken> ' +
		'</ns:executeQuery> ' +
		'</SOAP-ENV:Body> ' +
		'</SOAP-ENV:Envelope>';
};
/*********************************************************************************/
/** @description Constructor ClarityWebService **/
function ClarityWebService() {
	this.base = DataService;
	this.base();
	this.m_url = "";
	this.m_key = [];
	this.m_value = [];
	this.m_dataProvider = "";
	this.m_rowlimit = "";
	this.m_sortfield = [];
	this.m_sortdirection = [];
	this.m_sliceindex = "";
	this.m_slicecount = "";
};
ClarityWebService.prototype = new DataService;
/** @description initialize the nQuery service 
 * @param {Object} dataUrl: object holds  properties related to nquery web service 
 * **/
ClarityWebService.prototype.init = function(dataUrl) {
	this.m_url = removeParamsFromURL(dataUrl.getUrl());
	this.m_key = dataUrl.getKeys();
	this.m_connid = dataUrl.getId();
	this.m_dashboard = dataUrl.m_dashboard;
	this.setClaritySortAndSlice(dataUrl);	
};
ClarityWebService.prototype.setClaritySortAndSlice = function(dataUrl) {
	try{
		this.m_sortfield = dataUrl.getClaritySortField();
		this.m_sortdirection = dataUrl.getClaritySortDirection();
		this.m_sliceindex = dataUrl.getClaritySliceIndex();
		this.m_slicecount = dataUrl.getClaritySliceCount();
	}catch(e){
		console.log(e);
	}
};
/** @description Calls the service to fetch data .
 *  @param {Object} value: Object which keep the filter parameter's values
 *  @param {Object} dataSetValues: Object which has the details of components who consumes data from this connection 
 *  @param {function} callBack: Callback when service is completed
 *  **/
ClarityWebService.prototype.callWebservice = function(value, dataSetValues, callBack) {
	if (this.m_url != "") {
		var temp = this;
		this.setClaritySortAndSlice(dataSetValues.m_dataUrl);
		this.setValue(value);
		showLoader();
		makeSecureRequest({ 
			url: temp.getProxyURL(), method: "POST", formData: temp.getProxyData(), 
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
			var data = {
				"dataSetValues": dataSetValues,
				"dataObject": convertXMLToJSON(complete, ["records", "record"], temp.getDataType()),
				"status": { "isDataReceived": true }
			};
			callBack(data);
		},
		function() {
			var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
			callBack(data);
		});
	}
};
/** @description prepare SOAP message for service call 
 * @return {Object} object contains the endPoint URL and SOAP envelope
 * **/
ClarityWebService.prototype.getProxyData = function() {
	return {
		"url": this.getClarityWSDL(),
		"wsdl": this.getClaritySOAP()
	};
};
/** @description Getter method for clarityWSDL
 * @return {String} contains wsdl url
 * **/
ClarityWebService.prototype.getClarityWSDL = function() {
	var str = "";
	if (parent.$.jStorage !== undefined && parent.$.jStorage.get("user") && parent.$.jStorage.get("user").clarityWsdl) {
		str = parent.$.jStorage.get("user").clarityWsdl || "";
	} else {
		str = parent.BIZVIZ.SDK.getAuthInfo().clarityWsdl || "";
	}
	return str + "/niku/xog";
};
/** @description Getter method for claritySOAP
 * @return {String} SOAP xml
 * **/
ClarityWebService.prototype.getClaritySOAP = function() {
	return '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
		'<SOAP-ENV:Header>' +
		'<tns:Auth xmlns:tns="http://www.niku.com/xog/Query">' +
		'<tns:SessionID>' + this.getClaritySessionID() + '</tns:SessionID>' +
		'</tns:Auth>' +
		'</SOAP-ENV:Header>' +
		'<SOAP-ENV:Body>' +
		'<tns:Query xmlns:tns="http://www.niku.com/xog/Query">' +
		'<tns:Code>' + this.getCode() + '</tns:Code>' +
		'<tns:Filter>' + this.getFilter() + '</tns:Filter>' +
		'<tns:Sort>' + this.getClaritySort() + '</tns:Sort>' +
		'<tns:Slice>' + this.getClaritySlice() + '</tns:Slice>' +
		'</tns:Query>' +
		'</SOAP-ENV:Body>' +
		'</SOAP-ENV:Envelope>';
};
/** @description Getter method for Clarity Sort configuration 
 * @return {String} contains XML with column and order details
 * **/
ClarityWebService.prototype.getClaritySort = function() {
	var str = "";
	try{
		if(this.m_sortfield.length > 0 && this.m_sortdirection.length > 0){
			str += '<tns:Column><tns:Name>' + this.m_sortfield.join(",") + '</tns:Name><tns:Direction>' + this.m_sortdirection.join(",") + '</tns:Direction></tns:Column>';
		}
	}catch(e){
		console.log(e);
		str = "";
	}
	return str;
};
/** @description Getter method for Clarity Slice configuration 
 * @return {String} contains XML with starting index and number of records details
 * **/
ClarityWebService.prototype.getClaritySlice = function() {
	var str = "";
	if(this.m_sliceindex !== "" && this.m_slicecount !== ""){
		str = '<tns:Number>' + this.m_sliceindex + '</tns:Number><tns:Size>' + this.m_slicecount + '</tns:Size>';
	}
	return str;
};
/** @description Getter method for Clarity authentication token 
 * @return {String} contains token when clarity services are called 
 * **/
ClarityWebService.prototype.getClaritySessionID = function() {
	if (parent.opendoc && parent.opendoc != undefined && parent.$.jStorage !== undefined) {
		return parent.$.jStorage.get("opendoctoken");
	}
	if (pageInPortal != undefined && parent.BIZVIZ.SDK.getAuthInfo().authToken != undefined) {
		return parent.BIZVIZ.SDK.getAuthInfo().authToken;
	}
	var authToken = "";
	var flashParams = this.m_dashboard.m_FlashVars.m_param;
	for (var i = 0; i < flashParams.length; i++) {
		if (/n\w{4}hToken/.test(flashParams[i].m_name) || flashParams[i].m_name == "token") {
			authToken = flashParams[i].m_value;
		}
	}
	return authToken;
};
/** @description Getter method for SOAP code
 * @return {String} contains updated url
 * **/
ClarityWebService.prototype.getCode = function() {
	var n = this.m_url.split("/");
	return n[n.length - 1];
};
/** @description Getter method for SOAP filter params
 * @return {String} contains string of filter parameters xml
 * **/
ClarityWebService.prototype.getFilter = function() {
	var tempXML = "";
	for (var i = 0; i < this.m_key.length; i++) {
		tempXML += "<tns:" + this.m_key[i] + ">" + this.m_value[i] + "</tns:" + this.m_key[i] + ">";
	}
	return tempXML;
};
/** @description Getter method for Proxy URL
 * @return {String} getProxyURL
 * **/
ClarityWebService.prototype.getProxyURL = function() {
	return base_url + req_url.designer.getProxyURL;
};
/*****************************************************************/
/** @description Constructor PAWebService **/
function PAWebService() {
	this.base = DataService;
	this.base();
	this.m_url = "";
	this.m_key = [];
	this.m_value = [];
	this.m_dataProvider = "";
	this.m_rowlimit = "";
	this.m_ws = "";
	this.m_workflowtype = "";
	this.m_processid = "";
	this.m_pythonintervaltimeout = 3000;
};
PAWebService.prototype = new DataService;
/** @description initialize the nQuery service 
 * @param {Object} dataUrl: object holds  properties related to nquery web service 
 * **/
PAWebService.prototype.init = function(dataUrl) {
	this.m_url = dataUrl.getUrl();
	this.m_key = dataUrl.getKeys();
	this.m_connid = dataUrl.getId();
	this.m_pajsondef = dataUrl.getPredictiveJsonDef();
	this.m_dashboard = dataUrl.m_dashboard;
};
/** @description get the workflowID from the PAJsonDefination
 *  @param {string} m_connid: connection ID
 *  returns {string} dsId: workflow Id for this connection
 *  **/
PAWebService.prototype.getWorkFlowID = function(m_connid){
	var dsId;
	for(var i=0; i<this.m_dashboard.m_DataProviders.m_dataurl.length; i++){
		var obj = this.m_dashboard.m_DataProviders.m_dataurl[i];
		if(obj.m_id === m_connid){
			dsId = obj.m_selecteddatasourceid;
			break;
		}
	}
	return dsId;
};
/** @description Calls the service to fetch data .
 *  @param {Object} value: Object which keep the filter parameter's values
 *  @param {Object} dataSetValues: Object which has the details of components who consumes data from this connection 
 *  @param {function} callBack: Callback when service is completed
 *  **/
PAWebService.prototype.callWebservice = function(value, dataSetValues, callBack) {
	var temp = this;
	var dsId = this.getWorkFlowID( this.m_connid );
	this.setValue(value);
	if (dsId !== "" && dataSetValues.m_dataUrl.m_predictivejsondef !== "") {
		/*var reqData = {"workflowId": ""+ dsId +""}; 
		makeSecureRequest({
			url: base_url + req_url.designer.pluginService,
			method: "POST",
			formData: temp.getFormData( reqData, "GET_METADATA_OF_PUBLISHED_WORKFLOW" ),
			params: {
				async: true,
				crossDomain: true,
				headers: temp.getHeaders()
			}
		},
		function(data, status) {*/
			//data = getDecryptedResponse(data);
			//if (data && data.success && data.preictiveModel != undefined && data.preictiveModel.predictiveJsonDefinition != undefined) {
				//temp.m_pajsondef = JSON.parse(data.preictiveModel.predictiveJsonDefinition);
				//dataSetValues.m_dataUrl.m_predictivejsondef.isPython
				//dataSetValues.m_dataUrl.m_predictivejsondef.isSpark
				var sparkProcessStatus = IsBoolean(dataSetValues.m_dataUrl.m_predictivejsondef.isSpark) || false;
				var isPythonWorkflow = IsBoolean(dataSetValues.m_dataUrl.m_predictivejsondef.isPython) || false;
				showLoader();
				/** to show loader at first load */
				var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": false } };
				callBack(data);
				hideLoader();
				try {
					temp.setComponentLoader(dataSetValues, { isLoader: true, message: "Data is loading...", state: "progress" });
					if (sparkProcessStatus) {
						this.m_workflowtype = "spark";
						temp.setSparkWebSocket(dataSetValues, temp, callBack);
					} else if(isPythonWorkflow){
						this.m_workflowtype = "python";
						temp.setPythonWebSocket(dataSetValues, temp, callBack);
					} else {
						this.m_workflowtype = "r";
						temp.setCamelWebSocket(dataSetValues, temp, callBack);
					}
				} catch (e) {
					console.log(e);
					temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Data refresh failed", state: "completed" });
					data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
					callBack(data);
				}
				/*}
			},
		function() {
			temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Data refresh failed", state: "completed" });
			var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
			callBack(data);
		});*/
	}else{
		console.log( "Invalid predictivejsondef");
	}
};
PAWebService.prototype.setSparkWebSocket = function(dataSetValues, temp, callBack) {
	this.getSparkSettings(function(result, status) {
		var predictiveJsonDef = temp.m_pajsondef.predictiveJosnDef;
		if (predictiveJsonDef && IsBoolean(status)) {
			if (predictiveJsonDef.processes) {
				for (var key in predictiveJsonDef.processes) {
					if (predictiveJsonDef.processes[key].ProcessMethod == "datafilter") {
						var expression = predictiveJsonDef.processes[key].FilterValuesFromPredictive;
						if (expression) {
							for (var i = 0, len = temp.m_key.length; i < len; i++) {
								expression = expression.replace("@" + temp.m_key[i] + "@", "'" + temp.m_value[i] + "'");
							}
							if (expression !== predictiveJsonDef.processes[key].FilterValuesFromPredictive) {
								predictiveJsonDef.processes[key].options.expression = expression;
							}
						}
						break;
					}
				}
			}
			var isForceStart = false;
			var loc = result.sparkBizvizLocation;
			if (dGlobals.webSocketTracker[temp.m_connid] && dGlobals.webSocketTracker[temp.m_connid] !== "") {
				dGlobals.webSocketTracker[temp.m_connid].close();
			}
			temp.m_ws = new WebSocket(loc);
			dGlobals.webSocketTracker[temp.m_connid] = temp.m_ws;
			var interval;
			temp.m_ws.onopen = function(m) {
				/** When WS opens we need to call executeSparkProcess to get the rsponse messages and data **/
				interval = setInterval(function() {
					var sw_temp = temp.m_ws;
					var websocketRequestData = {
						"url": temp.get_base_url_for_spark_internal(),
						"token": parent.BIZVIZ.SDK.getAuthInfo().authToken,
						"reqData": "ping"
					};
					if (sw_temp != null && sw_temp.readyState == 1) {
						sw_temp.send(JSON.stringify(websocketRequestData));
					} else {
						console.log("Spark websocket connection with server lost");
						clearInterval(interval);
						if (sw_temp && sw_temp != null){
							sw_temp.close();
						}
					}
				}, 60000);
				predictiveJsonDef["ProcessID"] = "SparkProcess" + new Date().getTime() + "_" + temp.getUUID();
				var websocketRequestData = {
					"url": temp.get_base_url_for_spark_internal(),
					"token": parent.BIZVIZ.SDK.getAuthInfo().authToken,
					"reqData": predictiveJsonDef["ProcessID"]
				};
				temp.m_ws.send(JSON.stringify(websocketRequestData));
				var reqData = {};
				predictiveJsonDef.processParams.enableLogStatus = false;
				reqData["jsonDefinition"] = JSON.stringify(predictiveJsonDef);
				makeSecureRequest({
					url: base_url + req_url.designer.pluginService,
					method: "POST",
					formData: temp.getFormData( reqData, "executeSparkProcess" ),
					params: {
						headers: temp.getHeaders(),
						async: false,
						crossDomain: true
					}
				},
				function(complete) {
					var response = getDecryptedResponse(complete);
					if (response && response.success) {
						if (isForceStart != undefined && isForceStart) {
							console.log("This process may take a while. Please check log for the process status.");
							temp.m_ws.close();
							temp.setComponentLoader(dataSetValues, { isLoader: false, message: response.processStatus, state: "completed" });
						} else {
							temp.setComponentLoader(dataSetValues, { isLoader: true, message: "Spark socket open: " + response.message, state: "progress" });
						}
					} else {
						temp.m_ws.close();
						if (response.outPutJsonData != undefined && response.outPutJsonData != null) {
							var x = JSON.parse(response.outPutJsonData);
							if (x.statusCode == "702") {
								console.log("Cached data. For latest parameter changes, Clear cache and run");
							} else if (x.statusCode == "700") {
								console.log("Failed executeSparkProcess !");
								//failCb(predictiveJsonDef); 
							} else if (x.statusCode == "701") {
								console.log("Force start required !");
								//failCb(predictiveJsonDef); 
							} else {
								console.log(x.error);
								//console.log(response.message, response.error);
							}
						}
						temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Failed", state: "completed" });
						var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
						callBack(data);
					}
					console.log("execute spark process service: Completed");
				},
				function() {
					// Do nothing
				});
			};
			temp.m_ws.onmessage = function(m) {
				var predictiveProcessStatus = JSON.parse(m.data);
				temp.checkProcessStatusFromSocket(dataSetValues, callBack, predictiveJsonDef, temp.m_ws, predictiveProcessStatus, null, null, interval);
			};
			temp.m_ws.onerror = function(m) {
				clearInterval(interval);
				console.log("websocket connection with server failed. Please try again.");
				temp.m_ws.close();
				dGlobals.webSocketTracker[temp.m_connid].close();
				/** If service fails pass the blank data object to the callback, 
				 * so the chart can show the "Data not available message" **/
				temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Data refresh failed", state: "completed" });
				var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
				callBack(data);
			};
			temp.m_ws.onclose = function(m) {
				dGlobals.webSocketTracker[temp.m_connid] = null;
			}
		}else{
			temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Failed to get spark settings", state: "completed" });
			var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
			callBack(data);
		}
	}); /* End of getSpartSetting srvice callback */
};
PAWebService.prototype.getUUID = function() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0,
			v = c == "x" ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};
PAWebService.prototype.getSparkBizvizLocation = function(newSettings) {
	//sparkBizvizLocation = "ws://" + newSettings.pahost + ":" + newSettings.paport + "/spark-websocket";
	var pathOfSparkWebsocket;
	var protocolType = window.location.protocol.replace(":", "");
	for(var i=0;i<bizviz_pa_spark_servers["server"].length;i++){
		 var obj = {};
		 obj = bizviz_pa_spark_servers["server"][i];
		 if(obj.ip == newSettings.pahost && obj.port == newSettings.paport && obj.protocol == protocolType){
			 pathOfSparkWebsocket = obj.ws_url;
		 }
	}
	return pathOfSparkWebsocket;
};

PAWebService.prototype.getSparkSettings = function(cb) {
	var temp = this;
	temp.m_sparkbizvizlocation = "";
	var sparkBizvizLocation;
	var reqData = {
		"id": "",
		"type": 12,
		"status": 1,
		"spaceKey": parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey,
		"IsSparkWorkspaceLoad": true,
		"settings": ""
	};
	var data = {
//		"consumerName": "BIZVIZSETTINGS",
//		"serviceName": "getSettings",
		"consumerName": "BIZVIZ_PA",
		"serviceName": "getSettingsFromPa",
		"data": JSON.stringify(reqData),
		"isSecure": true,
		"spacekey": parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey,
		"token": parent.BIZVIZ.SDK.getAuthInfo().authToken
	};
	function getSettingsCB(response, status) {
		response = getDecryptedResponse(response);
//		if (response != null && response != undefined && !response.hasOwnProperty("status") && (response.settings.length != 0) && (response.settings[0].settings != undefined) && response["predictiveSparkServerSettings"] != undefined) {
		if (response != null && response != undefined && !response.hasOwnProperty("status") && response["predictiveSparkServerSettings"] != undefined) {
//			response = JSON.parse(response)["predictiveSparkServerSettings"];
//			var tempJson = JSON.parse(response.settings[0].settings);
			var tempJson = response["predictiveSparkServerSettings"];
			var newSettings = {
				/*"pahost": tempJson["paHost"],
				"paport": tempJson["paPort"],
				"papassword": btoa(tempJson["paPassword"]),
				"pausername": tempJson["paUserName"],
				"paapplication": tempJson["paApplication"],*/
				"paWebUrl": tempJson["paWebUrl"]
			};
			/** This method is deprecated in V3.2 **/
//			sparkBizvizLocation = temp.getSparkBizvizLocation(newSettings);
			sparkBizvizLocation = tempJson["paWebUrl"];
			temp.m_sparkbizvizlocation = sparkBizvizLocation;
			var result = {};
			result.sparkBizvizLocation = sparkBizvizLocation;
			/* Callback to make WebSocket connection */
			cb && cb(result, response.success);
			
			/* Test the spark server connection */
		/*	function testSparkConnectionCB(result, status) {
				result = getDecryptedResponse(result);
				if (result.success) {
					if (sparkBizvizLocation != undefined) {
						console.log(result.message);
					}
				} else {
					temp.showNotificationWindow("Predictive Spark Settings are not configured  !", 3000);
				}
			};
			makeSecureRequest({
				url: base_url + req_url.designer.pluginService,
				method: "POST",
				formData: temp.getFormData( newSettings, "testSparkConnection" ),
				params: {
					async: false,
					crossDomain: true,
					headers: temp.getHeaders()
				}
			},
			function(complete, status) {
				testSparkConnectionCB(complete, status);
			},
			function(complete, status) {
				testSparkConnectionCB(complete, status);
			});*/
			
		} else {
			temp.showNotificationWindow("Predictive Spark Settings are not configured  !", 3000);
			cb && cb({}, false);
		}
	};
	makeSecureRequest({
		url: base_url + req_url.designer.pluginService,
		method: "POST",
		formData: data,
		params: {
			async: false,
			crossDomain: true,
			headers: temp.getHeaders()
		}
	},
	function(complete, status) {
		getSettingsCB(complete, status);
	},
	function(complete, status) {
		getSettingsCB(complete, status);
	});
};
PAWebService.prototype.showNotificationWindow = function(msg, tOut) {
	var x = screen.width / 2 - 400 / 2;
	var y = screen.height / 2 - 100 / 2;
	var popup_window = window.open("", "", "width=400, height=100, left=" + x + ", top=" + y + ", toolbar=0, location=0, directories=0, status=0, menubar=0");
	try{
		popup_window.document.write(msg);
		popup_window.focus();
		setTimeout(function() {
			popup_window.close();
		}, tOut);
	} catch (e) {
		alertPopUpModal({type:'warning', message:'Pop-up Blocker is enabled! Please add this site to your exception list', timeout: '3000'});
	}
};
PAWebService.prototype.getHeaders = function() {
	return {
		"Content-Type": "application/x-www-form-urlencoded",
		"authtoken": parent.BIZVIZ.SDK.getAuthInfo().authToken,
		"spacekey": encryptText(parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey),
		"userid": encryptText(parent.BIZVIZ.SDK.getAuthInfo().user.id),
	};
};
PAWebService.prototype.checkProcessStatusFromSocket = function(dataSetValues, callBack, predictiveJsonDef, sw_temp, predictiveProcessStatus, fileWriterComList, interval, sparkInterval) {
	var temp = this;
	if (predictiveProcessStatus.processStatus == "SparkJobStatus") {
		temp.setComponentLoader(dataSetValues, { isLoader: true, message: predictiveProcessStatus.processStatus + ": " + predictiveProcessStatus.socketStatus.status, state: "progress" });
	} else {
		var arr = [];
		if (predictiveProcessStatus.processStatus != undefined) {
			var status = predictiveProcessStatus.processStatus;
			arr = status.split("_");
		}
		if (arr[0] === "Completed") {
			temp.setComponentLoader(dataSetValues, { isLoader: true, message: "Completed", state: "completed" });
			var token = parent.BIZVIZ.SDK.getAuthInfo().authToken;
			var userId = parent.BIZVIZ.SDK.getAuthInfo().user.id;
			sw_temp.send("remove_" + predictiveJsonDef["ProcessID"] + "_" + token + "_" + userId);
			if (sparkInterval != null) {
				sw_temp.close();
				clearInterval(sparkInterval);
			}
			temp.setComponentLoader(dataSetValues, { isLoader: false, message: arr[1], state: "completed" });
			var resData = predictiveProcessStatus.responseData;
			/** Call the applyModel to fetch the actual data in charts **/
			temp.fetchResultViaSocket(predictiveJsonDef, dataSetValues, callBack);
		} else if (arr[0] === "Failed") {
			temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Failed", state: "completed" });
			if (interval != undefined) {
				sw_temp.send("remove_" + predictiveJsonDef["ProcessID"] + "_" + token + "_" + userId);
				sw_temp.close();
				clearInterval(interval);
			}
			if (sparkInterval != undefined) {
				sw_temp.close();
				clearInterval(sparkInterval);
			}
			console.log("Process  failed..");
			var token = parent.BIZVIZ.SDK.getAuthInfo().authToken;
			var userId = parent.BIZVIZ.SDK.getAuthInfo().user.id;
			if (predictiveProcessStatus.responseData != null && predictiveProcessStatus.responseData.outPutJsonData != null) {
				var responseData = JSON.parse(predictiveProcessStatus.responseData)
				var outputJsonData = JSON.parse(responseData.outPutJsonData);
				if (outputJsonData.message != undefined) {
					var message = outputJsonData.message.split("||");
					message.map(function(obj) {
						console.log(obj);
					});
				}
			}
			var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
			callBack(data);
		} else {
			if (arr[1] != undefined) {
				temp.setComponentLoader(dataSetValues, { isLoader: true, message: arr[1], state: "progress" });
			} else {
				temp.setComponentLoader(dataSetValues, { isLoader: true, message: "Process is in progess..", state: "progress" });
			}
		}
	}
};
PAWebService.prototype.get_base_url_for_spark_internal = function(){
	/** Depricated in v3.2 **/
	/*
	if(bizviz_pa_spark_servers["base_url_for_spark_internal"] != undefined){
		var base_url_for_spark = bizviz_pa_spark_servers["base_url_for_spark_internal"];
		var httpOrhttps =  base_url_for_spark.https == true ? "https://" : "http://";
		return httpOrhttps+""+ base_url_for_spark.domain + (base_url_for_spark.port == "" ? "" : ":" + base_url_for_spark.port) + "/cxf";
	}else{
		return "";
	}
	*/
	try{
		var base_url_for_spark = {};
		base_url_for_spark = bizviz_pa_spark_to_karaf_communication;
		var httpOrhttps =  base_url_for_spark.https == true ? "https://" : "http://";
		return httpOrhttps+""+ base_url_for_spark.domain + (base_url_for_spark.port == "" ? "" : ":" + base_url_for_spark.port) + "/cxf";
     }
     catch(Err){
    	 return "";
     }
};

PAWebService.prototype.fetchResultViaSocket = function(predictiveJsonDef, dataSetValues, callBack) {
	var temp = this;
	var componentId = 17; //TODO
	for (var key in predictiveJsonDef.processes) {
		if (predictiveJsonDef.processes[key].ProcessMethod == "applymodel") {
			componentId = key;
			break;
		}
	}
	var ProcessMethod = "applymodel";
	var webSocketRequestString = "response," + predictiveJsonDef.ProcessID + "," + componentId + "," + ProcessMethod;
	/*var location = bizviz_pa_spark_socket;*/
	var location = (temp.m_sparkbizvizlocation !== "") ? temp.m_sparkbizvizlocation : bizviz_pa_spark_socket;
	var ws = new WebSocket(location);
	var data;
	ws.onopen = function(m) {
		temp.setComponentLoader(dataSetValues, { isLoader: true, message: "ApplyModel is started", state: "progress" });
		var websocketRequestData = {
			"url": temp.get_base_url_for_spark_internal(),
			"token": parent.BIZVIZ.SDK.getAuthInfo().authToken,
			"reqData": webSocketRequestString
		};
		ws.send(JSON.stringify(websocketRequestData));
	};
	ws.onmessage = function(m) {
		data = temp.processOutput(JSON.parse(m.data));
		temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Data loading successful", state: "completed" });
		var data = { "dataSetValues": dataSetValues, "dataObject": data, "status": { "isDataReceived": true } };
		callBack(data);
	};
	ws.onclose = function(m) {
		temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Failed to get data from ApplyModel", state: "completed" });
	};
	ws.onerror = function(m) {
		temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Error in getting data from ApplyModel", state: "completed" });
	};
	return true;
};
PAWebService.prototype.processOutput = function(response) {
	if (response.success && response.responseData.success) {
		return response.responseData.outPutJsonData["OutputJsonData"];
	} else {
		return [];
	}
};
PAWebService.prototype.getRSettings = function(cb) {
	var temp = this;
	this.m_rbizvizvisuallocation = "";
	function getRserverSettingsCB(result, status) {
		result = getDecryptedResponse(result);
		if (result && (result.predictiveRServerSettings != undefined)) {
			if (result.success && result.predictiveRServerSettings) {
				var loc = "ws://" + result.predictiveRServerSettings.ip + ":" + result.predictiveRServerSettings.port + "/camel-websocket";
				temp.m_rbizvizvisuallocation = result.predictiveRServerSettings.rVisUrl;
				console.log("Active R Server: " + loc);
				cb && cb(result, true);
			} else {
				temp.showNotificationWindow("Predictive R-settings are not configured", 3000);
				cb && cb(result, false);
			}
		} else {
			temp.showNotificationWindow("Predictive R-settings are not configured", 3000);
			cb && cb(result, false);
		}
	};
	makeSecureRequest({
		url: base_url + req_url.designer.pluginService,
		method: "POST",
		formData: temp.getFormData( {IsRWorkspaceLoad:true}, "getRserverSettings" ),
		params: {
			async: false,
			crossDomain: true,
			headers: temp.getHeaders()
		}
	},
	function(complete, status) {
		getRserverSettingsCB(complete, status);
	},
	function(complete, status) {
		getRserverSettingsCB(complete, status);
	});
};

PAWebService.prototype.setPythonWebSocket = function(dataSetValues, temp, callBack) {
	this.m_pythonbizvizlocation = "";
	this.m_pythonbizvizvisuallocation = "";
	function getSettingsCB(response, status) {
		response = getDecryptedResponse(response);
		if (response != undefined && response != null) {
			if (!response.hasOwnProperty("status") && IsBoolean(response.success)) {
				if (response.predictivePythonServerSettings) {
					var tempJson = response["predictivePythonServerSettings"];
					/*
					var testPythonServerdata = {};
					var newSettings = {
//						"pahost" : tempJson["paHost"],
//						"paport" : tempJson["paPort"],
//						"papassword" : tempJson["paPassword"],
//						"pausername" : tempJson["paUserName"],
						"paPythonWebUrl" : tempJson["paWebUrl"],
						"paVizUrl" : tempJson["paVizUrl"]
					};
					*/
					temp.m_pythonbizvizlocation = tempJson["paWebUrl"];
					temp.m_pythonbizvizvisuallocation = tempJson["paVizUrl"] || "";
					
					var predictiveJsonDef = temp.m_pajsondef.predictiveJosnDef || {};
					
					/** Update for Filters in Python Workflow **/
					try{
						if (predictiveJsonDef.processes) {
							for (var key in predictiveJsonDef.processes) {
								/** Update R Server Filter configuration / FilterXML in PAJsonDefination **/
								if (predictiveJsonDef.processes[key].filter){
									if( predictiveJsonDef.processes[key].filterXml) {
										var tempXML = '<filter xmlns="">';
										for (var i = 0, len = temp.m_key.length; i < len; i++) {
											predictiveJsonDef.processes[key].filter[temp.m_key[i]] = temp.m_value[i];
											tempXML += '<' + temp.m_key[i] + '>' + temp.m_value[i] + '</' + temp.m_key[i] + '>';
										}
										tempXML += '</filter>';
										predictiveJsonDef.processes[key].filterXml = tempXML;
									}
									if(predictiveJsonDef.processes[key].filter){
										for(var fkey in predictiveJsonDef.processes[key].filter){
											var index = temp.m_key.indexOf(fkey);
											if(index >= 0){
												predictiveJsonDef.processes[key].filter[fkey] = temp.m_value[index];
											}else{
												predictiveJsonDef.processes[key].filter[fkey] = "";
											}
										}
									}
								}
							}
						}
					}catch(e){
						console.log(e);
					}
					
					/** Update Process ID everytime **/
					predictiveJsonDef.ProcessID = "PythonProcess" + new Date().getTime()+"_"+temp.getUUID();
					
					/** Update Process ID everytime, must remove "dash" from it **/
					//predictiveJsonDef.ProcessID = "PythonProcess" + new Date().getTime()+"_"+service.getUUID().split("-").join(""); 
					
					
					/** New WebService Way Start **/
					
					temp.m_processid = predictiveJsonDef.ProcessID;
					
					var data = {};
					var url = req_url.predictive.pluginService;
					data["consumerName"] = "BIZVIZ_PA";
					data["serviceName"] = "executePythonProcess";
					var reqData = {};
					var isForceStart = false;
					reqData["jsonDefinition"] = JSON.stringify(predictiveJsonDef);
					data["data"] = JSON.stringify(reqData);
					data["isSecure"] = true;
					window.setTimeout(function() {
						showLoader();
						makeSecureRequest({
							url: base_url + req_url.designer.pluginService,
							method: "POST",
							formData: temp.getFormData(reqData, "executePythonProcess"),
							params: {
								crossDomain: true,
								headers: temp.getHeaders()
							}
						}, function(response, requestData) {
							hideLoader();
							response = getDecryptedResponse(response);
							if (response && response.success) {
								if (isForceStart != undefined && isForceStart) {
									console.log("This process may take a while. Please check log for the process status.");
								} else if (response.outPutJsonData !== "" && response.outPutJsonData != undefined && JSON.parse(response.outPutJsonData).statusCode == '702') {
									console.log("Cached data. For latest parameter changes, Clear cache and run");
								} else {
									console.log("Data loading in progress from python");
								}
								
								try{
									var pythonInterval  = setInterval(function (){
									var requestData={};
									requestData["url"]=temp.get_base_url_for_python_internal();
									requestData["token"]=parent.BIZVIZ.SDK.getAuthInfo().authToken;
									requestData["reqData"]=predictiveJsonDef["ProcessID"];
								    temp.checkStatus(requestData, 'componentProcessStatus',
									    function(responseData){
								    	if(responseData && !responseData.error){
								    		var fileData = responseData;
									    	fileData = eval(fileData) || [];
											temp.checkProcessStatusForPython(fileData,pythonInterval,dataSetValues, temp, predictiveJsonDef, callBack);								    		
								    	}else{
								    		clearInterval(pythonInterval);
								    		alertPopUpModal({type:'error', message:responseData.error, timeout: '3000'});
								    		var data = {
							    				"dataSetValues": dataSetValues,
							    				"dataObject": {},
							    				"status": {
							    					"isDataReceived": true,
							    					"summary": "",
							    					"graph": ""
							    				}
							    			};
							    			temp.setComponentLoader(dataSetValues, {
							    				isLoader: false,
							    				message: "Data loading failed, " + responseData.error,
							    				state: "completed"
							    			});
							    			callBack(data);
								    	}
								    },
								    function(responseData){
								    	clearInterval(pythonInterval);
							    		alertPopUpModal({type:'error', message:"Error in service calling", timeout: '3000'});
							    		var data = {
						    				"dataSetValues": dataSetValues,
						    				"dataObject": {},
						    				"status": {
						    					"isDataReceived": true,
						    					"summary": "",
						    					"graph": ""
						    				}
						    			};
						    			temp.setComponentLoader(dataSetValues, {
						    				isLoader: false,
						    				message: "Data loading failed, ",
						    				state: "completed"
						    			});
						    			callBack(data);
								    }
								    );
								}, temp.m_pythonintervaltimeout);
								temp.m_ws = pythonInterval;
								}catch(e){
									hideLoader();
								}
								
							} else {
								if (response.outPutJsonData != undefined && response.outPutJsonData != null) {
									var x = JSON.parse(response.outPutJsonData);
									if (x.statusCode == '702') {
										console.log("Cached data. For latest parameter changes, Clear cache and run");
									} else if (x.statusCode == '700') {
										//								failCb(predictiveJsonDef); 
									} else if (x.statusCode == '701') {
										isForceStart = true;
										//								failCb(predictiveJsonDef); 
									} else {
										console.log("Error !", "Process initialization failed.");
										console.log(response.message);
									}
								} else if (response.errorMessage != undefined && response.errorMessage != null && response.errorMessage != "") {
									console.log("Error !", "Process initialization failed.");
									console.log(response.errorMessage);
								}
							}
						});
					}, 0);
					
					/** New WebService Way End **/
					
					
					/** Old WebSocket Way Start **/
					/*
					temp.m_ws = new WebSocket(temp.m_pythonbizvizlocation);
					var pythonInterval;
					dGlobals.webSocketTracker[temp.m_connid] = temp.m_ws;
					temp.m_ws.onopen = function(m) {
						pythonInterval = window.setInterval(function() {
							var sw_temp = temp.m_ws;
							var websocketRequestData = {};
							websocketRequestData["url"] = temp.get_base_url_for_python_internal();
							websocketRequestData["token"] = parent.BIZVIZ.SDK.getAuthInfo().authToken;
							websocketRequestData["reqData"] = "ping";
							if (sw_temp.readyState == 1) {
								sw_temp.send(JSON.stringify(websocketRequestData));
							} else {
								clearInterval(pythonInterval);
								console.log("websocket connection with server lost.Please contact the administrator.");
								sw_temp.close();
							}
						}, 60000);
						var websocketRequestData = {};
						websocketRequestData["url"] = temp.get_base_url_for_python_internal();
						websocketRequestData["token"] = parent.BIZVIZ.SDK.getAuthInfo().authToken;
						websocketRequestData["reqData"] = predictiveJsonDef["ProcessID"];
						temp.m_ws.send(JSON.stringify(websocketRequestData));
						var data = {};
						var url = req_url.predictive.pluginService;
						data["consumerName"] = "BIZVIZ_PA";
						data["serviceName"] = "executePythonProcess";
						var reqData = {};
						var isForceStart = false;
						reqData["jsonDefinition"] = JSON.stringify(predictiveJsonDef);
						data["data"] = JSON.stringify(reqData);
						data["isSecure"] = true;
						window.setTimeout(function() {
							showLoader();
							makeSecureRequest({
								url: base_url + req_url.designer.pluginService,
								method: "POST",
								formData: temp.getFormData(reqData, "executePythonProcess"),
								params: {
									crossDomain: true,
									headers: temp.getHeaders()
								}
							}, function(response, requestData) {
								hideLoader();
								response = getDecryptedResponse(response);
								if (response && response.success) {
									if (isForceStart != undefined && isForceStart) {
										console.log("This process may take a while. Please check log for the process status.");
										temp.m_ws.close();
									} else if (response.outPutJsonData !== "" && response.outPutJsonData != undefined && JSON.parse(response.outPutJsonData).statusCode == '702') {
										console.log("Cached data. For latest parameter changes, Clear cache and run");
										temp.m_ws.close();
									} else {
										console.log("Data loading in progress from python");
									}
								} else {
									temp.m_ws.close();
									if (response.outPutJsonData != undefined && response.outPutJsonData != null) {
										var x = JSON.parse(response.outPutJsonData);
										if (x.statusCode == '702') {
											console.log("Cached data. For latest parameter changes, Clear cache and run");
										} else if (x.statusCode == '700') {
											//								failCb(predictiveJsonDef); 
										} else if (x.statusCode == '701') {
											isForceStart = true;
											//								failCb(predictiveJsonDef); 
										} else {
											console.log("Error !", "Process initialization failed.");
											console.log(response.message);
										}
									} else if (response.errorMessage != undefined && response.errorMessage != null && response.errorMessage != "") {
										console.log("Error !", "Process initialization failed.");
										console.log(response.errorMessage);
									}
								}
							});
						}, 0);
					};
					// on message for python server side response
					temp.m_ws.onmessage = function(m) {
						var predictiveProcessStatus = JSON.parse(m.data);
						if(predictiveProcessStatus.processStatus == "PythonJobStatus") {
							temp.fetchResultViaPythonSocket(predictiveJsonDef, dataSetValues, callBack, temp.m_ws, predictiveProcessStatus);
						}
					};
					temp.m_ws.onerror = function(m) {
						clearInterval(pythonInterval);
						console.log("websocket connection with server failed. Please try again.");
						temp.setComponentLoader(dataSetValues, {
							isLoader: false,
							message: "Data loading failed",
							state: "completed"
						});
						var data = {
							"dataSetValues": dataSetValues,
							"dataObject": {},
							"status": {
								"isDataReceived": true,
								"summary": "",
								"graph": ""
							}
						};
						callBack(data);
						temp.m_ws.close();
					};
					temp.m_ws.onclose = function(m) {
						clearInterval(pythonInterval);
						temp.m_ws = null;
					};
					*/
					/** Old WebSocket Way End **/
					
					
					/** Test Python workflows **/
					/*
					testPythonServerdata["consumerName"] = "BIZVIZ_PA";
					testPythonServerdata["serviceName"] = "testPythonServerConnection";
					testPythonServerdata["data"] = JSON.stringify(newSettings);
					testPythonServerdata["isSecure"] = true;
					makeSecureRequest({
						url: base_url + req_url.designer.pluginService,
						method: "POST",
						formData: testPythonServerdata,
						params: {
							async: false,
							crossDomain: true,
							headers: temp.getHeaders()
						}
					},
					function(complete, status) {
						console.log(complete);
					},
					function(complete, status) {
						console.log(complete);
					});
					*/
					
				} else {
					temp.showNotificationWindow("Predictive Python Settings are not configured  !", 3000);
					callBack && callBack({}, false);
				}
			} else {
				temp.showNotificationWindow("Predictive Python Settings are not configured  !", 3000);
				callBack && callBack({}, false);
			}
		} else {
			temp.showNotificationWindow("Predictive Python Settings are not configured  !", 3000);
			callBack && callBack({}, false);
		}
	};
	
	var reqData = {
		"id" : "",
		"type" : 201,
		"status" : 1,
		"spaceKey" : parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey,
		"token" : parent.BIZVIZ.SDK.getAuthInfo().authToken,
		"IsPythonWorkspaceLoad": true,
		"settings" : ""
	};
	var data = {};
	data["consumerName"] = "BIZVIZ_PA";
	data["serviceName"] = "getSettingsFromPa";
	data["spacekey"] = parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey;
	data["token"] = parent.BIZVIZ.SDK.getAuthInfo().authToken;
	data["data"] = JSON.stringify(reqData);
	data["isSecure"] = true;
	makeSecureRequest({
		url: base_url + req_url.designer.pluginService,
		method: "POST",
		formData: data,
		params: {
			async: false,
			crossDomain: true,
			headers: temp.getHeaders()
		}
	},
	function(complete, status) {
		getSettingsCB(complete, status);
	},
	function(complete, status) {
		getSettingsCB(complete, status);
	});	
};

/** Method will be triggered from preview page when going back to design mode **/
PAWebService.prototype.stopPythonProcess = function(data, endPoint, scb, ecb){
	var temp = this;
	clearInterval(temp.m_ws);
	var triggerStopPythonProcess = function() {
		var requestData = {};
		requestData["url"] = temp.get_base_url_for_python_internal();
		requestData["token"] = parent.BIZVIZ.SDK.getAuthInfo().authToken;
		requestData["reqData"] = temp.m_processid;
		
		var data = {};
		data["consumerName"] = "BIZVIZ_PA";
		data["serviceName"] = "stopPythonProcess";
		data["spacekey"] = parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey;
		data["token"] = parent.BIZVIZ.SDK.getAuthInfo().authToken;
		data["data"] = JSON.stringify(requestData);
		data["isSecure"] = true;
	
		makeSecureRequest({
			url: base_url + req_url.designer.pluginService,
			method: "POST",
			formData: data,
			params: {
				async: false,
				crossDomain: true,
				headers: temp.getHeaders()
			}
		},
		function(complete, status) {
			// Do nothing
		},
		function(complete, status) {
			// Do nothing
		});	
	};
	if(temp.m_processid !== ""){
		triggerStopPythonProcess();
	}
};
PAWebService.prototype.checkStatus = function(data, endPoint, scb, ecb){
	var enc_key = null;
	if (parent.BIZVIZ.SDK.getAuthInfo().key != undefined || parent.BIZVIZ.SDK.getAuthInfo().key != null || parent.BIZVIZ.SDK.getAuthInfo().key != "") {
		enc_key = parent.BIZVIZ.SDK.getAuthInfo().key;
	}
	data["ENC"] = enc_key;

	makeUnSecureRequest({
		method: 'POST',
		url: this.m_pythonbizvizvisuallocation + endPoint,
		formData: data,
		params: {
			headers: {
				"Content-Type": undefined,
				"ENC": enc_key
			}
		}
	}, function success(response) {
		response = getDecryptedObjectForPAPython(response);
		scb && scb(response);
	}, function error(response) {
		response = getDecryptedObjectForPAPython(response);
		ecb && ecb(response);
	});
};

PAWebService.prototype.checkProcessStatusForPython = function(predictiveProcessStatus,pythonInterval,dataSetValues, temp, predictiveJsonDef, callBack){
	temp.clearComponentLoader(dataSetValues);
	for (var i = 0; i < predictiveProcessStatus.length; i++) {
		if(typeof predictiveProcessStatus[i] == "string"){
			predictiveProcessStatus[i] = JSON.parse(predictiveProcessStatus[i]);
		}
		if (predictiveProcessStatus[i].responseData != null && predictiveProcessStatus[i].responseData != undefined) {
			if(predictiveProcessStatus[i].responseData.indexOf("_PA_Python_Logging_") != -1 || predictiveProcessStatus[i].responseData.indexOf("CSE_") != -1 || predictiveProcessStatus[i].responseData.indexOf("ESW_") != -1){
				/* Do not show log in component loader when log starts with these keys */
			}else{
				temp.setComponentLoader(dataSetValues, {
					isLoader: true,
					message: predictiveProcessStatus[i].responseData,
					state: "progress"
				});				
			}
		} else if (predictiveProcessStatus[i].error != null) {
			hideLoader();
			clearInterval(pythonInterval);
			console.log(predictiveProcessStatus[i].error);
			var data = {
				"dataSetValues": dataSetValues,
				"dataObject": {},
				"status": {
					"isDataReceived": true,
					"summary": "",
					"graph": ""
				}
			};
			temp.setComponentLoader(dataSetValues, {
				isLoader: false,
				message: "Data loading failed, " + predictiveProcessStatus[i].error,
				state: "completed"
			});
			callBack(data);
			/** break the loop here if error comes in intermediate steps of workflow, so it wont execute finished/done **/
			break;
		} else if (predictiveProcessStatus[i].finished != null && predictiveProcessStatus[i].finished == "done") {
			var componentId,
			ProcessMethod;
			if (predictiveJsonDef["lastNodeDetails"]) {
				componentId = predictiveJsonDef["lastNodeDetails"];
				ProcessMethod = predictiveJsonDef.processes[predictiveJsonDef["lastNodeDetails"]].ProcessMethod;
			} else {
				for (var key in predictiveJsonDef.processes) {
					if (predictiveJsonDef.processes[key].ProcessType === "PythonProcess" || predictiveJsonDef.processes[key].ProcessType === "DataReaderProcess") {
						componentId = key;
						ProcessMethod = predictiveJsonDef.processes[key].ProcessMethod;
					}
				}
			}

			temp.setComponentLoader(dataSetValues, {
				isLoader: false,
				message: predictiveProcessStatus[i].responseData,
				state: "completed"
			});

			clearInterval(pythonInterval);

			var requestData = {};
			requestData["url"] = temp.get_base_url_for_python_internal();
			requestData["token"] = parent.BIZVIZ.SDK.getAuthInfo().authToken;
			requestData["reqData"] = "response," + predictiveJsonDef.ProcessID + "," + componentId + "," + ProcessMethod;

			temp.checkStatus(requestData, 'componentOutputData',
				function (responseData) {
				if (responseData && !responseData.error) {
					hideLoader();
					var data = {
						"dataSetValues": dataSetValues,
						"dataObject": {},
						"status": {
							"isDataReceived": true,
							"summary": "",
							"graph": ""
						}
					};
					if (responseData.outPutJsonData) {
						if (responseData.outPutJsonData.OutputJsonData) {
							data.dataObject = responseData.outPutJsonData.OutputJsonData;
						}
						if (responseData.outPutJsonData.Summary) {
							data.status.summary = responseData.outPutJsonData.Summary;
						}
						if (responseData.outPutJsonData.graphData) {
							/** Support multiple URL being sent from PA workflow **/
							var arr = parser.getArrayOfSingleLengthJson(responseData.outPutJsonData.graphData);
							var urlArr = [];
							for(var i=0; i<arr.length; i++){
								urlArr.push( temp.m_pythonbizvizvisuallocation + "" + arr[i] );
							}
							data.status.graph = urlArr.join(",");
							/** Supports only one URL being sent from PA workflow **/
							//data.status.graph = temp.m_pythonbizvizvisuallocation + "" + responseData.outPutJsonData.graphData;
						}
					}
					temp.setComponentLoader(dataSetValues, {
						isLoader: false,
						message: "Data loading successful with summary",
						state: "completed"
					});
					callBack(data);
				} else {
					clearInterval(pythonInterval);
					alertPopUpModal({
						type: 'error',
						message: responseData.error,
						timeout: '3000'
					});
				}
			},
				function (responseData) {
				clearInterval(pythonInterval);
				alertPopUpModal({
					type: 'error',
					message: "Error in service calling",
					timeout: '3000'
				});
				var data = {
					"dataSetValues": dataSetValues,
					"dataObject": {},
					"status": {
						"isDataReceived": true,
						"summary": "",
						"graph": ""
					}
				};
				temp.setComponentLoader(dataSetValues, {
					isLoader: false,
					message: "Data loading failed ",
					state: "completed"
				});
				callBack(data);
			});

		} else {
			// Do nothing
		}
	}
};

PAWebService.prototype.get_base_url_for_python_internal = function(){
	try{
		var base_url_for_python = {};
		base_url_for_python= bizviz_pa_python_to_karaf_communication;
		var httpOrhttps =  base_url_for_python.https == true ? "https://" : "http://";
		return httpOrhttps+""+ base_url_for_python.domain + (base_url_for_python.port == "" ? "" : ":" + base_url_for_python.port) + "/cxf";
	}catch(Err){
        return "";
	}
};

PAWebService.prototype.fetchResultViaPythonSocket = function(predictiveJsonDef, dataSetValues, callBack, sw_temp, predictiveProcessStatus) {
	var temp = this;
	if (predictiveProcessStatus.responseData != null) {
		if (predictiveProcessStatus.responseData != undefined) {
			temp.setComponentLoader(dataSetValues, {
				isLoader: true,
				message: predictiveProcessStatus.responseData,
				state: "progress"
			});
		} else {
			temp.setComponentLoader(dataSetValues, {
				isLoader: true,
				message: "Process is in progess..",
				state: "progress"
			});
		}
	} else if (predictiveProcessStatus.finished != null && predictiveProcessStatus.finished == "done") {
		temp.setComponentLoader(dataSetValues, {
			isLoader: true,
			message: "Completed",
			state: "completed"
		});
		
		var componentId, ProcessMethod;
		if(predictiveJsonDef["lastNodeDetails"]){
			componentId = predictiveJsonDef["lastNodeDetails"];
			ProcessMethod = predictiveJsonDef.processes[predictiveJsonDef["lastNodeDetails"]].ProcessMethod;
		} else {
			for (var key in predictiveJsonDef.processes) {
				if (predictiveJsonDef.processes[key].ProcessType === "PythonProcess" || predictiveJsonDef.processes[key].ProcessType === "DataReaderProcess") {
					componentId = key;
					ProcessMethod = predictiveJsonDef.processes[key].ProcessMethod;
				}
			}
		}
		
		var webSocketRequestString = "response," + predictiveJsonDef.ProcessID + "," + componentId + "," + ProcessMethod;
		sw_temp.send(webSocketRequestString);
		temp.setComponentLoader(dataSetValues, {
			isLoader: false,
			message: predictiveProcessStatus.responseData,
			state: "completed"
		});
		try {
			if(temp.m_pythonbizvizlocation !== ""){
				var ws = new WebSocket(temp.m_pythonbizvizlocation);
			}else{
				console.log("Invalid Python Socket Location");
			}
		} catch (e) {
			console.log(e);
		}
		var data;
		ws.onopen = function(m) {
			var websocketRequestData = {};
			websocketRequestData["url"] = temp.get_base_url_for_python_internal();
			websocketRequestData["token"] = parent.BIZVIZ.SDK.getAuthInfo().authToken;
			websocketRequestData["reqData"] = webSocketRequestString;
			ws.send(JSON.stringify(websocketRequestData));
		};
		ws.onmessage = function(m) {
			hideLoader();
			var data = {
				"dataSetValues": dataSetValues,
				"dataObject": {},
				"status": {
					"isDataReceived": true,
					"summary": "",
					"graph": ""
				}
			};
			if (m && m.data) {
				var resp_data = JSON.parse(m.data);
				data.dataObject = temp.processOutput(resp_data);
				if (resp_data && resp_data.responseData && resp_data.responseData.outPutJsonData && resp_data.responseData.outPutJsonData.Summary) {
					data.status.summary = resp_data.responseData.outPutJsonData.Summary;
				}
				if (resp_data && resp_data.responseData && resp_data.responseData.outPutJsonData && resp_data.responseData.outPutJsonData.graphData) {
					data.status.graph = temp.m_pythonbizvizvisuallocation + "" + resp_data.responseData.outPutJsonData.graphData;
				}
				temp.setComponentLoader(dataSetValues, {
					isLoader: false,
					message: "Data loading successful with summary",
					state: "completed"
				});
				callBack(data);
			} else {
				temp.setComponentLoader(dataSetValues, {
					isLoader: false,
					message: "Data loading in progress",
					state: "progress"
				});
				callBack(data);
			}
		};
		ws.onclose = function(m) {
			hideLoader();
		};
		ws.onerror = function(m) {
			hideLoader();
            ws.close();
			temp.setComponentLoader(dataSetValues, {
				isLoader: false,
				message: "Failed to get data from python workflow",
				state: "completed"
			});
		};
	} else if (predictiveProcessStatus.error != null) {
		hideLoader();
		console.log(predictiveProcessStatus.error);
		var data = {
			"dataSetValues": dataSetValues,
			"dataObject": {},
			"status": {
				"isDataReceived": true,
				"summary": "",
				"graph": ""
			}
		};
		temp.setComponentLoader(dataSetValues, {
			isLoader: false,
			message: "Data loading failed, " + predictiveProcessStatus.error,
			state: "completed"
		});
		if (sw_temp && sw_temp != null){
			sw_temp.close();
		}
		callBack(data);
	} else {
		// Do nothing
	} 
};
PAWebService.prototype.setCamelWebSocket = function(dataSetValues, temp, callBack) {
	var predictiveJsonDef = temp.m_pajsondef.predictiveJosnDef || {};
	temp.getRSettings(function(result, status) {
		if (IsBoolean(status)) {
			if (predictiveJsonDef.Process) {
				for (var key in predictiveJsonDef.Process) {
					/** Update R Server Filter configuration / FilterXML in PAJsonDefination **/
					if (predictiveJsonDef.Process[key].filter && predictiveJsonDef.Process[key].filterXml) {
						var tempXML = '<filter xmlns="">';
						for (var i = 0, len = temp.m_key.length; i < len; i++) {
							predictiveJsonDef.Process[key].filter[temp.m_key[i]] = temp.m_value[i];
							tempXML += '<' + temp.m_key[i] + '>' + temp.m_value[i] + '</' + temp.m_key[i] + '>';
						}
						tempXML += '</filter>';
						/**commented below tempXML for removal of the filterxml value in req data of PA service**/
						predictiveJsonDef.Process[key].filterXml = "";//tempXML;
					}
					/** Update R Server Connection configuration in PAJsonDefination **/
					if (predictiveJsonDef.Process[key].ProcessType == "RProcess" && predictiveJsonDef.Process[key].connectionMap) {
						predictiveJsonDef.Process[key].connectionMap["IP"] = result.predictiveRServerSettings.ip;
						predictiveJsonDef.Process[key].connectionMap["Password"] = result.predictiveRServerSettings.password;
						predictiveJsonDef.Process[key].connectionMap["Port"] = result.predictiveRServerSettings.port;
						predictiveJsonDef.Process[key].connectionMap["Username"] = result.predictiveRServerSettings.username;
					}
				}
				/**Added below loop for removal of the filterxml value in req data of PA service**/
				for (var key in predictiveJsonDef.Processw) {
					if (predictiveJsonDef.Processw[key].filter) {// && predictiveJsonDef.Process[key].filterXml
						predictiveJsonDef.Processw[key].filterXml = "";
					}
				}
			}
			/** Update Process ID everytime, must remove "dash" from it **/
			predictiveJsonDef.ProcessID = "RProcess" + temp.getUUID().split("-").join("");
			/** Update the token in PAJsonDefination when Workflow input is a Query service **/
			predictiveJsonDef.token = parent.BIZVIZ.SDK.getAuthInfo().authToken;
			
			if (dGlobals.webSocketTracker[temp.m_connid] && dGlobals.webSocketTracker[temp.m_connid] !== "") {
				dGlobals.webSocketTracker[temp.m_connid].close();
			}
			
			
			var reqData = {};
			
			reqData["jsonDefinition"] = JSON.stringify(predictiveJsonDef);
			/** Update whether it is R or Java workflow **/
			reqData["isRWorkSpace"] = (IsBoolean(dataSetValues.m_dataUrl.m_predictivejsondef.isR)) ? true : false;
			//reqData["timezone"] = new Date().getTimezoneOffset();
			reqData["dataSource"] = (predictiveJsonDef["Process"]) ? JSON.stringify(predictiveJsonDef["Process"][0]) : "";
			
			
			//window.setTimeout(function() {
				makeSecureRequest({
					url: base_url + req_url.designer.pluginService,
					method: "POST",
					formData: temp.getFormData(reqData, "excecutePaDProcess"),
					params: {
						crossDomain: true,
						headers: temp.getHeaders()
					}
				},
				function(complete) {
					hideLoader();
					complete = getDecryptedResponse(complete);
					if (complete == undefined || !IsBoolean(complete.success)) {
						temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Failed to execute PA-process", state: "completed" });
					} else {
						temp.setComponentLoader(dataSetValues, { isLoader: true, message: "Execute PA-process is successful, Waiting for WebSocket response", state: "progress" });
					}
					console.log("execute pa process service: Completed");
					/** WebSocket creation and updating chart loader and messages **/
					var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": false } };
					callBack(data);
					
					var getDataFlag = false;
					var formdata = { "processId" : predictiveJsonDef.ProcessID };
					//var a = { "processId" : "RProcess77b39fdf8669488a9b5e1f8b932381d5" };
					formdata = JSON.stringify(formdata);
					var jsonData = JSON.parse(complete.outPutJsonData);
					var RFflowTime = window.setInterval(function() {
						makeSecureRequest({
							url: base_url + req_url.designer.pluginService,
							method: "POST",
							formData: {"consumerName": "BIZVIZ_PA", "serviceName": "workflowStatus","data": formdata,"isSecure": true,"spacekey": encryptText(parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey)},
							params: {
								crossDomain: true,
								headers: temp.getHeaders()
							}
						},
						function(complete) {
							hideLoader();
							var complete = getDecryptedResponse(complete);
							if (complete == undefined || !IsBoolean(complete.success)) {
								temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Failed to execute PA-process", state: "completed" });
							} else {
								var msg = JSON.parse(complete.outPutJsonData);
								for(var i = 0; i < msg.length; i++) {
									temp.setComponentLoader(dataSetValues, { isLoader: true, message: msg[i], state: "progress" });
									if (msg[i] === "Workflow finished") {
										getDataFlag = true;
									}
								}
							}
							//** When executePaProcess called, WS sends messages that is being captured here and loading the chart loader. 
							 /*  Once we get the data- showing into the chart and hiding the chart loader */
							var response = {};
							var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": false, "summary": "", "graph": "" } };
							try {
								//response = getDecryptedObjectForPA(complete);
								response = getDecryptedResponse(complete);
							} catch (e) {
								console.log(e);
							}
							if (response.success && IsBoolean(getDataFlag)) {
								/** isPerformancePresent = true, take applyModelId and call service to pull dataset using 'NodeIdOfApplyModel' **/
								if (IsBoolean(predictiveJsonDef.isPerformancePresent)) {
									var reqData = {
										"ProcessId": predictiveJsonDef["ProcessID"],
										"NodeId": predictiveJsonDef["NodeIdOfApplyModel"] || 11,
										"tabType": "data",
										"ConnectionIndex": [0]
									};
									/** Step1: Calling getCachedData service to pull data */
									makeSecureRequest({
										url: base_url + req_url.designer.pluginService,
										method: "POST",
										formData: temp.getFormData(reqData, "getCachedData"),
										params: {
											crossDomain: true,
											headers: temp.getHeaders()
										}
									},
									function(complete) {
										hideLoader();
										complete = getDecryptedResponse(complete);
										/**start**/
										/** Data is received, parse it and call the callback, close the WS **/
										if (complete && complete.outPutJsonData !== null && JSON.parse(complete.outPutJsonData)[0] && JSON.parse(JSON.parse(complete.outPutJsonData)[0]).OutputJsonData) {
											data.status.isDataReceived = true;
											data.dataObject = frameworkUtil.convertStringToJson(JSON.parse(JSON.parse(complete.outPutJsonData)[0]).OutputJsonData);
											temp.setComponentLoader(dataSetValues, { isLoader: true, message: "Data refresh completed", state: "progress" });
											if (dGlobals.webSocketTracker[temp.m_connid] != null) {
												/** dataset is received, call service to get Summary using 'lastNodeDetails' **/
												
												temp.getRPerformanceWorkflowSummary(predictiveJsonDef, data, dataSetValues, function(){
													temp.getRPerformanceWorkflowGraph(predictiveJsonDef, data, dataSetValues, callBack);
												});
												
											} else {
												temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Data refresh failed", state: "completed" });
												callBack(data);
											}
										} else {
											temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Data refresh failed", state: "completed" });
											callBack(data);
										}
									},
									function(complete) {
										hideLoader();
										var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
										callBack(data);
									});
								} else {
									/** Call getCachedData service, which will pull the dataset and summary both **/
									var reqData = {
										"ProcessId": predictiveJsonDef["ProcessID"],
										"NodeId": predictiveJsonDef["lastNodeDetails"] || 11,
										"tabType": "data",
										"ConnectionIndex": [0]
									};
									/** Calling getCachedData service to pull dataset and summary **/
									clearInterval(RFflowTime);
									//window.setTimeout(function() {
										makeSecureRequest({
											url: base_url + req_url.designer.pluginService,
											method: "POST",
											formData: temp.getFormData(reqData, "getCachedData"),
											params: {
												crossDomain: true,
												headers: temp.getHeaders()
											}
										},
										function(complete) {
											hideLoader();
											complete = getDecryptedResponse(complete);
											data.status.isDataReceived = true;
											if (complete && complete.outPutJsonData && complete.outPutJsonData !== null && JSON.parse(complete.outPutJsonData)[0] && JSON.parse(JSON.parse(complete.outPutJsonData)[0]).OutputJsonData) {
												data.dataObject = frameworkUtil.convertStringToJson(JSON.parse(JSON.parse(complete.outPutJsonData)[0]).OutputJsonData);
												
												temp.getRWorkflowSummary(predictiveJsonDef, data, dataSetValues, function(){
													temp.getRWorkflowGraph(predictiveJsonDef, data, dataSetValues, callBack);
												});
												
											} else {
												temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Data refresh failed", state: "completed" });
												callBack(data);
											}
										},
										function(complete) {
											hideLoader();
											var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
											callBack(data);
										});
									//}, 3000);
								}
							} else {
								/** WS still sending messages, keep showing the loader and update the message log **/
								temp.setComponentLoader(dataSetValues, { isLoader: true, message: response.processStatus, state: "progress" });
							}
						},
						function(complete) {
							hideLoader();
						});
					}, 3000);
					
				},
				function(complete) {
					hideLoader();
					temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Failed to execute PA-process", state: "completed" });
					var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
					callBack(data);
				});
			//}, 0);
			/**start**/
			
			/** new service call srart **/
			
			/** new service call srart **/
			
			/** BDD-467 Updates required after token change in Jetty.xml **/
			//temp.m_ws = new WebSocket(bizviz_websocket + "camel-websocket");
			/*temp.m_ws = new WebSocket(bizviz_camelwebsocket);
			dGlobals.webSocketTracker[temp.m_connid] = temp.m_ws;
			var interval;
			var reqData = {};
			reqData["jsonDefinition"] = JSON.stringify(predictiveJsonDef);
			*//** Update whether it is R or Java workflow **//*
			reqData["isRWorkSpace"] = (IsBoolean(dataSetValues.m_dataUrl.m_predictivejsondef.isR)) ? true : false;
			reqData["dataSource"] = (predictiveJsonDef["Process"]) ? JSON.stringify(predictiveJsonDef["Process"][0]) : "";
			temp.m_ws.onopen = function(m) {
				*//** When WS opens we need to call executePaProcess to get the rsponse messages and data **//*
				interval = setInterval(function() {
					var sw_temp = temp.m_ws;
					if (sw_temp != null && sw_temp.readyState == 1) {
						sw_temp.send("ping");
					} else {
						console.log("Camel websocket connection with server lost");
						clearInterval(interval);
						if (sw_temp && sw_temp != null){
							sw_temp.close();
						}
					}
				}, 120000);
				
				*//** BDD-467 Updates required after token change in Jetty.xml **//*
//				temp.m_ws.send("add_" + predictiveJsonDef["ProcessID"] + "_" + parent.BIZVIZ.SDK.getAuthInfo().authToken + "_" + parent.BIZVIZ.SDK.getAuthInfo().user.id);
				temp.m_ws.send(JSON.stringify({
					type: "add",
					key: predictiveJsonDef["ProcessID"],
					token: parent.BIZVIZ.SDK.getAuthInfo().authToken,
					userId: parent.BIZVIZ.SDK.getAuthInfo().user.id
				}));
				
				makeSecureRequest({
					url: base_url + req_url.designer.pluginService,
					method: "POST",
					formData: temp.getFormData(reqData, "excecutePaProcess"),
					params: {
						crossDomain: true,
						headers: temp.getHeaders()
					}
				},
				function(complete) {
					hideLoader();
					complete = getDecryptedResponse(complete);
					if (complete == undefined || !IsBoolean(complete.success) || (complete.processStatus && complete.processStatus.indexOf("Failed_") > -1) ) {
						temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Failed to execute PA-process", state: "completed" });
					} else {
						temp.setComponentLoader(dataSetValues, { isLoader: true, message: "Execute PA-process is successful, Waiting for WebSocket response", state: "progress" });
					}
					console.log("execute pa process service: Completed");
					*//** WebSocket creation and updating chart loader and messages **//*
					var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": false } };
					callBack(data);
				},
				function(complete) {
					hideLoader();
					temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Failed to execute PA-process", state: "completed" });
					var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
					callBack(data);
				});
			};
			temp.m_ws.onmessage = function(m) {
				*//** When executePaProcess called, WS sends messages that is being captured here and loading the chart loader. 
				 *  Once we get the data- showing into the chart and hiding the chart loader **//*
				var response = {};
				var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": false, "summary": "", "graph": "" } };
				try {
					response = getDecryptedObjectForPA(m);
				} catch (e) {
					console.log(e);
				}
				if (response.success &&
					response.responseData &&
					JSON.parse(response.responseData).outPutJsonData) {
					*//** isPerformancePresent = true, take applyModelId and call service to pull dataset using 'NodeIdOfApplyModel' **//*
					if (IsBoolean(predictiveJsonDef.isPerformancePresent)) {
						var reqData = {
							"ProcessId": predictiveJsonDef["ProcessID"],
							"NodeId": predictiveJsonDef["NodeIdOfApplyModel"] || 11,
							"tabType": "data",
							"ConnectionIndex": [0]
						};
						*//** Step1: Calling getCachedData service to pull data **//*
						makeSecureRequest({
							url: base_url + req_url.designer.pluginService,
							method: "POST",
							formData: temp.getFormData(reqData, "getCachedData"),
							params: {
								crossDomain: true,
								headers: temp.getHeaders()
							}
						},
						function(complete) {
							hideLoader();
							complete = getDecryptedResponse(complete);
							*//** Data is received, parse it and call the callback, close the WS **//*
							if (complete && complete.outPutJsonData !== null && JSON.parse(complete.outPutJsonData)[0] && JSON.parse(JSON.parse(complete.outPutJsonData)[0]).OutputJsonData) {
								data.status.isDataReceived = true;
								data.dataObject = frameworkUtil.convertStringToJson(JSON.parse(JSON.parse(complete.outPutJsonData)[0]).OutputJsonData);
								temp.setComponentLoader(dataSetValues, { isLoader: true, message: "Data refresh completed", state: "progress" });
								if (dGlobals.webSocketTracker[temp.m_connid] != null) {
									*//** dataset is received, call service to get Summary using 'lastNodeDetails' **//*
									
									temp.getRPerformanceWorkflowSummary(predictiveJsonDef, data, dataSetValues, function(){
										temp.getRPerformanceWorkflowGraph(predictiveJsonDef, data, dataSetValues, callBack);
									});
									
								} else {
									temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Data refresh failed", state: "completed" });
									callBack(data);
								}
							} else {
								temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Data refresh failed", state: "completed" });
								callBack(data);
							}
						},
						function(complete) {
							hideLoader();
							var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
							callBack(data);
						});
					} else {
						*//** Call getCachedData service, which will pull the dataset and summary both **//*
						var reqData = {
							"ProcessId": predictiveJsonDef["ProcessID"],
							"NodeId": predictiveJsonDef["lastNodeDetails"] || 11,
							"tabType": "data",
							"ConnectionIndex": [0]
						};
						*//** Calling getCachedData service to pull dataset and summary **//*
						makeSecureRequest({
							url: base_url + req_url.designer.pluginService,
							method: "POST",
							formData: temp.getFormData(reqData, "getCachedData"),
							params: {
								crossDomain: true,
								headers: temp.getHeaders()
							}
						},
						function(complete) {
							hideLoader();
							complete = getDecryptedResponse(complete);
							data.status.isDataReceived = true;
							*//** Data is received, parse it and call the callback, close the WS **//*
							if (complete && complete.outPutJsonData && complete.outPutJsonData !== null && JSON.parse(complete.outPutJsonData)[0] && JSON.parse(JSON.parse(complete.outPutJsonData)[0]).OutputJsonData) {
								data.dataObject = frameworkUtil.convertStringToJson(JSON.parse(JSON.parse(complete.outPutJsonData)[0]).OutputJsonData);
								
								temp.getRWorkflowSummary(predictiveJsonDef, data, dataSetValues, function(){
									temp.getRWorkflowGraph(predictiveJsonDef, data, dataSetValues, callBack);
								});
								
							} else {
								temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Data refresh failed", state: "completed" });
								callBack(data);
							}
						},
						function(complete) {
							hideLoader();
							var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
							callBack(data);
						});
					}
				} else {
					*//** WS still sending messages, keep showing the loader and update the message log **//*
					temp.setComponentLoader(dataSetValues, { isLoader: true, message: response.processStatus, state: "progress" });
				}
			}; // onmessage close
			temp.m_ws.onerror = function(m) {
				clearInterval(interval);
				console.log("websocket connection with server failed. Please try again.");
				temp.m_ws.close();
				dGlobals.webSocketTracker[temp.m_connid].close();
				*//** If service fails pass the blank data object to the callback, 
				 * so the chart can show the "Data not available message" **//*
				temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Data refresh failed", state: "completed" });
				var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": false } };
				callBack(data);
			};
			temp.m_ws.onclose = function(m) {
				dGlobals.webSocketTracker[temp.m_connid] = null;
			};*/
		} else {
			temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Data refresh failed", state: "completed" });
			var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
			callBack(data);
		}
	}); //getRSettings close
};
PAWebService.prototype.getRWorkflowSummary = function(predictiveJsonDef, data, dataSetValues, cb) {
	var temp = this;
	/** dataset is received, call service to get Summary using 'lastNodeDetails' **/
	var reqData = {
		"ProcessId": predictiveJsonDef["ProcessID"],
		"NodeId": predictiveJsonDef["lastNodeDetails"] || 11,
		"tabType": "summary",
		"ConnectionIndex": [0]
	};
	
	/** Step2: Calling getCachedData service to pull summary **/
	makeSecureRequest({
		url: base_url + req_url.designer.pluginService,
		method: "POST",
		formData: temp.getFormData(reqData, "getCachedData"),
		params: {
			crossDomain: true,
			headers: temp.getHeaders()
		}
	},
	function(complete) {
		complete = getDecryptedResponse(complete);
		data.status.isDataReceived = true;
		/** Data is received, parse it and call the callback, close the WS **/
		if (complete && complete.outPutJsonData && complete.outPutJsonData !== null && JSON.parse(complete.outPutJsonData)[0] ) {
			try{
				var isValid = JSON.parse(JSON.parse(complete.outPutJsonData))["summary"];
				var arr = ((isValid) ? isValid : JSON.parse(JSON.parse(complete.outPutJsonData))["Summary"]);
				if(typeof arr === 'string'){
					data.status.summary = arr;
				}else{
					data.status.summary = ((arr && arr[0]) ? arr[0][0] : undefined);
				}
				temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Getting summary successful", state: "progress" });
			}catch(e){
				console.log(e);
				temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Failed to get summary", state: "progress" });
			}
		}
		cb();
	},
	function(complete) {
		cb();
	});
};
PAWebService.prototype.getRWorkflowGraph = function(predictiveJsonDef, data, dataSetValues, callBack) {
	var temp = this;
	/** dataset is received, call service to get Summary using 'lastNodeDetails' **/
	var reqData = {
			"ProcessId": predictiveJsonDef["ProcessID"],
			"NodeId": predictiveJsonDef["lastNodeDetails"] || 11,
			"tabType": "chart",
			"ConnectionIndex": [0]
		};
		
		/** Step2: Calling getCachedData service to pull summary **/
		makeSecureRequest({
			url: base_url + req_url.designer.pluginService,
			method: "POST",
			formData: temp.getFormData(reqData, "getCachedData"),
			params: {
				crossDomain: true,
				headers: temp.getHeaders()
			}
		},
		function(complete) {
			hideLoader();
			complete = getDecryptedResponse(complete);
			data.status.isDataReceived = true;
			/** Data is received, parse it and call the callback, close the WS **/
			if (complete && complete.outPutJsonData && complete.outPutJsonData !== null && JSON.parse(complete.outPutJsonData)[0] ) {
				try{
					var isValid = JSON.parse(complete.outPutJsonData)[0]["url"];
					var arr = ((isValid) ? isValid : JSON.parse(JSON.parse(complete.outPutJsonData)[0])["url"]);
					data.status.graph = (arr) ? (temp.m_rbizvizvisuallocation + "" + arr) : undefined;
				}catch(e){
					console.log(e);
				}
			}
			temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Data refresh completed", state: "completed" });
			callBack(data);
			/*if (dGlobals.webSocketTracker[temp.m_connid] != null) {
				dGlobals.webSocketTracker[temp.m_connid].close();
				dGlobals.webSocketTracker[temp.m_connid] = null;
				callBack(data);
			}*/
		},
		function(complete) {
			hideLoader();
			var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
			callBack(data);
		});
};
PAWebService.prototype.getRPerformanceWorkflowSummary = function(predictiveJsonDef, data, dataSetValues, cb) {
	var temp = this;
	/** dataset is received, call service to get Summary using 'lastNodeDetails' **/
	var reqData = {
		"ProcessId": predictiveJsonDef["ProcessID"],
		"NodeId": predictiveJsonDef["lastNodeDetails"] || 11,
		"tabType": "summary",
		"ConnectionIndex": [0]
	};
	
	/** Step2: Calling getCachedData service to pull summary **/
	makeSecureRequest({
		url: base_url + req_url.designer.pluginService,
		method: "POST",
		formData: temp.getFormData(reqData, "getCachedData"),
		params: {
			crossDomain: true,
			headers: temp.getHeaders()
		}
	},
	function(complete) {
		complete = getDecryptedResponse(complete);
		data.status.isDataReceived = true;
		/** Data is received, parse it and call the callback, close the WS **/
		if (complete && complete.outPutJsonData && complete.outPutJsonData !== null && JSON.parse(complete.outPutJsonData)[0] && JSON.parse(JSON.parse(complete.outPutJsonData)[0]).OutputJsonData) {
			try{
				data.status.summary = JSON.parse(JSON.parse(complete.outPutJsonData))["Summary"];
				temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Getting summary successful", state: "progress" });
			}catch(e){
				console.log(e);
				temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Failed to get summary", state: "progress" });
			}
		} else if (complete && complete.outPutJsonData && complete.outPutJsonData !== null && JSON.parse(complete.outPutJsonData)[0] ) {
			try{
				var isValid = JSON.parse(JSON.parse(complete.outPutJsonData))["summary"];
				var arr = ((isValid) ? isValid : JSON.parse(JSON.parse(complete.outPutJsonData))["Summary"]);
				if(typeof arr === 'string'){
					data.status.summary = arr;
				}else{
					data.status.summary = ((arr && arr[0]) ? arr[0][0] : undefined);
				}
				temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Getting summary successful", state: "progress" });
			}catch(e){
				console.log(e);
				temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Failed to get summary", state: "progress" });
			}
		} else {
			// Do nothing
		} 
		cb();
	},
	function(complete) {
		cb();
	});
};
PAWebService.prototype.getRPerformanceWorkflowGraph = function(predictiveJsonDef, data, dataSetValues, callBack) {
	var temp = this;
	/** dataset is received, call service to get Summary using 'lastNodeDetails' **/
	var reqData = {
			"ProcessId": predictiveJsonDef["ProcessID"],
			"NodeId": predictiveJsonDef["lastNodeDetails"] || 11,
			"tabType": "chart",
			"ConnectionIndex": [0]
		};
		
		/** Step2: Calling getCachedData service to pull summary **/
		makeSecureRequest({
			url: base_url + req_url.designer.pluginService,
			method: "POST",
			formData: temp.getFormData(reqData, "getCachedData"),
			params: {
				crossDomain: true,
				headers: temp.getHeaders()
			}
		},
		function(complete) {
			hideLoader();
			complete = getDecryptedResponse(complete);
			data.status.isDataReceived = true;
			/** Data is received, parse it and call the callback, close the WS **/
			if (complete && complete.outPutJsonData && complete.outPutJsonData !== null && JSON.parse(complete.outPutJsonData)[0] ) {
				try{
					var isValid = JSON.parse(complete.outPutJsonData)[0]["url"];
					var arr = ((isValid) ? isValid : JSON.parse(JSON.parse(complete.outPutJsonData)[0])["url"]);
					data.status.graph = (arr) ? (temp.m_rbizvizvisuallocation + "" + arr) : undefined;
				}catch(e){
					console.log(e);
				}
			}
			temp.setComponentLoader(dataSetValues, { isLoader: false, message: "Data refresh completed", state: "completed" });
			if (dGlobals.webSocketTracker[temp.m_connid] != null) {
				dGlobals.webSocketTracker[temp.m_connid].close();
				dGlobals.webSocketTracker[temp.m_connid] = null;
				callBack(data);
			}
		},
		function(complete) {
			hideLoader();
			var data = { "dataSetValues": dataSetValues, "dataObject": {}, "status": { "isDataReceived": true } };
			callBack(data);
		});
};
PAWebService.prototype.getFormData = function(reqData, serviceName) {
	return {
		"consumerName": "BIZVIZ_PA",
		"data": JSON.stringify(reqData),
		"from": 0,
		"isSecure": true,
		"rows": 9999,
		"serviceName": serviceName,
		"spacekey": parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey,
		"token": parent.BIZVIZ.SDK.getAuthInfo().authToken,
		"userid": parent.BIZVIZ.SDK.getAuthInfo().user.id
	};
};
PAWebService.prototype.getDataAndSummary = function(predictiveJsonDef, complete) {
	var map = { data: {}, summary: "" };
	try {
		var processType = predictiveJsonDef.Process[predictiveJsonDef["lastNodeDetails"]].ProcessType;
		var summary = "summary";
		if (["DirectData", "dataTypeDefinition", "filter", "formula", "normalization", "sample", "rdatasplit", "clustering"].indexOf(processType) > -1) {
			summary = "summary";
		} else if (["forecasting", "association", "outliers", "regression", "decisionTree", "correlation", "rapplymodel"].indexOf(processType) > -1) {
			summary = "Summary";
		} else {
			// Do nothing
		} 
		map.data = frameworkUtil.convertStringToJson(JSON.parse(JSON.parse(complete.outPutJsonData)[0]).OutputJsonData);
		map.summary = JSON.parse(JSON.parse(complete.outPutJsonData))[summary];
	} catch (e) {
		console.log(e);
	}
	return map;
};
/*****************************************************************/

/** @description Constructor DSWebService **/
function DSWebService() {
	this.base = DataService;
	this.base();
	this.m_url = "";
	this.m_key = [];
	this.m_value = [];
	this.m_dataProvider = "";
	this.m_rowlimit = "";
};
DSWebService.prototype = new DataService;
/** @description initialize the nQuery service 
 * @param {Object} dataUrl: object holds  properties related to nquery web service 
 * **/
DSWebService.prototype.init = function(dataUrl) {
	this.m_url = dataUrl.getUrl();
	this.m_key = dataUrl.getKeys();
	this.m_connid = dataUrl.getId();
	this.m_dashboard = dataUrl.m_dashboard;
};
/** @description Data store service call**/
DSWebService.prototype.callWebservice = function(value, dataSetValues, callBack) {
    var temp = this;
    var compIndex = -1;
    this.setValue(value);
    var dsId = this.getWorkFlowID(this.m_connid);
    this.getDSFormDataset(value, dataSetValues, dsId);
    /** show loader only when there is atleast one chart registered with DS connector **/
    if(this.m_registeredDataSetFormData.length > 0){
        showLoader();
    }
    for (var i = 0; i < this.m_registeredDataSetFormData.length; i++) {
        var reqData = this.m_registeredDataSetFormData[i];
        var service = dsId + parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey;
        var fd = temp.getFormData(reqData, service);
        makeSecureRequest({
                url: base_url + req_url.designer.getDsData,
                method: "POST",
                formData: fd,
                compName: reqData.DsComponent,
                params: {
                    headers: {
                        authtoken: parent.BIZVIZ.SDK.getAuthInfo().authToken,
                        spacekey: encryptText(parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey),
                        userid: encryptText(parent.BIZVIZ.SDK.getAuthInfo().user.id)
                    }
                }
            },
            function(complete, sucess, component) {
            	complete = getDecryptedResponse(complete);
                hideLoader();
                compIndex++;
                var data = {
                    "dataSetValues": dataSetValues,
                    "dataObject": convertToJSON(complete, "", temp.getDataType()),
                    "status": {
                        "isDataReceived": true
                    }
                };
                callBack(data, compIndex, component);
            },
            function() {
                var data = {
                    "dataSetValues": dataSetValues,
                    "dataObject": {},
                    "status": {
                        "isDataReceived": true
                    }
                };
                callBack(data, compIndex, component);
            });
    }
};
/** @description creating data,filter object to get response of data store**/
DSWebService.prototype.getDSFormDataset = function(value, dataSetValues, dsId) {
	this.m_registeredDataSetFormData = [];
	var filterValue = this.filterOperation(value);
	for(var i = 0; i < dataSetValues.m_registeredDataSet.length; i++){
		var dataObj = {};
		var objOpr = this.objectOperation(dataSetValues.m_registeredDataSet[i], dsId);
		dataObj["category"] = objOpr["dataDimesnionARR"];
		dataObj["series"] = objOpr["dataMeasureARR"];
		dataObj["filter"] = filterValue;
		dataObj["filterList"] = "None";
		dataObj["mergedCubes"] = [];
		dataObj["currentCube"] = null;
		dataObj["isMergeEnabled"] = false;
		dataObj["mergedCubeDetails"] = {};
		dataObj["transDim"] = "";
		dataObj["customField"] = [];
		dataObj["rules"] = [];
		dataObj["properties"] = {};
		dataObj["querytype"] = "simple";
		dataObj["mergedDataStore"] = {};
		dataObj["masterDataStore"] = dsId;
		dataObj["DsComponent"] = dataSetValues.m_registeredDataSet[i].m_id;
		this.m_registeredDataSetFormData.push(dataObj);
	}
};

/** @description creating data,filter object to get response of data store**/
DSWebService.prototype.objectOperation = function(dataSetValues, dsId) {
	var map = {};
	var dataMeasureARR = [];
	var dataDimesnionARR = [];
	var dstypeObj = ["year","quarter","month","date","week"];
	//dataObj = {};
	for (var j = 0; j < dataSetValues.m_fieldsJson.length; j++) {
		var dataMeasureObj = {};
	    var dataDimensionObj = {};
	    var fieldObjects = dataSetValues.m_fieldsJson[j];
	    if ( (fieldObjects.dstype === "none" && dataSetValues.m_registeredWidget.m_type !== 'Plot') || fieldObjects.Type === "Category" || fieldObjects.Type === "SubCategory" || fieldObjects.hierarchyType === "parent" || fieldObjects.hierarchyType === "child") {
	    	if (fieldObjects.dsdate !== undefined) {
				var dsdateObject = (fieldObjects.dsdate).split(":");
				var dateInterval = dsdateObject[0];
				var dateFormat = dsdateObject[1];
				dataDimensionObj["dimension"] = fieldObjects.Name;
				dataDimensionObj["interval"] = (dstypeObj.indexOf(dateInterval) > -1)?dateInterval:"";
				dataDimensionObj["sourceID"] = dsId;
				if ((dstypeObj.indexOf(dateInterval) > -1)) {
					dataDimensionObj["format"] = dateFormat;
				}
	    	} else {
	    		dataDimensionObj["dimension"] = fieldObjects.Name;
				dataDimensionObj["interval"] = "";
				dataDimensionObj["sourceID"] = dsId;
	    	}
	        dataDimesnionARR.push(dataDimensionObj);
	    } else {
    		dataMeasureObj["measure"] = fieldObjects.OtherField;
	        dataMeasureObj["op"] = (dataSetValues.m_registeredWidget.m_type === 'Plot')?"none":fieldObjects.dstype;
	        dataMeasureObj["sourceID"] = dsId;
	        dataMeasureARR.push(dataMeasureObj);
	    }
	}
	map["dataDimesnionARR"] = dataDimesnionARR;
	map["dataMeasureARR"] = dataMeasureARR;
	return map;
};

/** @description creating data,filter object to get response of data store**/
DSWebService.prototype.filterOperation = function(value) {
	var filterData = {};
	for (var l = 0; l < value.length; l++) {
		if( (value[l] !== "") && (value[l] !== undefined) && (value.length > 0) ){
			var filterArray = value[l].split(",");
			filterData[this.m_key[l]] = filterArray;
		}
	}
	return filterData;
};

/** @description getting the Workflow Id for Data Store**/
DSWebService.prototype.getWorkFlowID = function(m_connid){
	var dsId;
	for(var i=0; i<this.m_dashboard.m_DataProviders.m_dataurl.length; i++){
		var obj = this.m_dashboard.m_DataProviders.m_dataurl[i];
		if(obj.m_id === m_connid){
			dsId = obj.m_selectedserviceid;
			break;
		}
	}
	return dsId;
};
/** @description creating form data object for Data Store**/
DSWebService.prototype.getFormData = function(reqData, serviceName) {
	return {
		"isSecure": true,
		"consumerName": "CUBEPROCESSSERVICE",
		"serviceName": serviceName,
		"viewId": 0,
		"viewInfo":JSON.stringify(reqData),
		"facts":"{}",
		"data": "{}",
		"token": parent.BIZVIZ.SDK.getAuthInfo().authToken,
		"spacekey": parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey
	};
};


/** @description Constructor DSWebService **/
function DatasheetService() {
	this.base = DataService;
	this.base();
	this.m_url = "";
	this.m_key = [];
	this.m_value = [];
	this.m_dataProvider = "";
	this.m_rowlimit = "";
	this.m_sliceindex = "0";
	this.m_slicecount = "1000";
};
DatasheetService.prototype = new DataService;
/** @description initialize the nQuery service 
 * @param {Object} dataUrl: object holds  properties related to nquery web service 
 * **/
DatasheetService.prototype.init = function(dataUrl) {
	this.m_url = dataUrl.getUrl();
	this.m_key = dataUrl.getKeys();
	this.m_connid = dataUrl.getId();
	this.m_dashboard = dataUrl.m_dashboard;
	this.m_skipfiltervalues = dataUrl.getSkipFilterValues();
};
/** @description setter method for Slicer values 
 * **/
DatasheetService.prototype.setSlicerDetails = function(dataSetValues) {
	/** to get slicer info **/
	this.m_sliceindex = dataSetValues.m_dataUrl.getClaritySliceIndex();
	this.m_slicecount = dataSetValues.m_dataUrl.getClaritySliceCount();	
};
/** @description Getter method for Filter params 
 * @return {String} Filter string
 * **/
DatasheetService.prototype.getFilterParams = function(dataSetValues) {
	var str = '';
	if (this.m_key.length == 0) {
		return str;
	} else {
		try{
			var columns = dataSetValues.m_dataUrl.m_datasheetjsondef.columns;
			for(var i = 0; i<columns.length; i++){
				var index = this.m_key.indexOf(columns[i].title);
				if(index > -1 && this.m_value[index] != undefined){
					if(columns[i].type == "autocomplete" || columns[i].type == "dropdown"){
						if(str !=""){
							str += " and "+ this.m_key[index] +" eq "+ "'"+ this.m_value[index] +"'";
						}
						else{
							str += this.m_key[index] +" eq "+ "'"+ this.m_value[index] +"'";
						}
					}
					else {
						if(str != ""){
							str += " and "+"contains("+ this.m_key[index] +","+ "'"+ this.m_value[index] +"')";
						}
						else{
							str += "contains("+ this.m_key[index] +","+ "'"+ this.m_value[index] +"')";
						}
					}	
				}
			}
		}catch(e){
			console.log("error in filter string setting!");
		}
	}
	return str;
};
/** @description Data store service call**/
DatasheetService.prototype.callWebservice = function(value, dataSetValues, callBack) {
	var temp = this;
	this.setSlicerDetails(dataSetValues);
	this.setValue(value);
	var fd = {
		isSecure: true,
		"consumerName": "BDBDATASHEET",
		"serviceName": "getSheetRecords",
		"data": JSON.stringify({
			"bizvizdatasheetId": dataSetValues.m_dataUrl.m_selecteddatasourceid,
			"top": "500",
			"skip": "" + temp.m_sliceindex,
			"filter": temp.getFilterParams( dataSetValues ),
			"dataType": "json"
		}),
		"spacekey": parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey
	};

	makeSecureRequest({
		url: base_url + req_url.designer.pluginService,
		method: "POST",
		formData: fd,
		params: {
			headers: {
				authtoken: parent.BIZVIZ.SDK.getAuthInfo().authToken,
				spacekey: encryptText(parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey),
				userid: encryptText(parent.BIZVIZ.SDK.getAuthInfo().user.id)
			}
		}
	},
		function (complete, sucess, component) {
		complete = getDecryptedResponse(complete);
		hideLoader();
		var jsonData = complete.value;
		/* 
		var jsonData = [];
		if (complete && complete.value && complete.value.data) {
			var fields = (complete.value.columns ? complete.value.columns : []);
			complete.value.data.map(function (record) {
				var obj = {};
				record.map(function (val, i) {
					obj[fields[i]] = val;
				});
				jsonData.push(obj);
			})
		}
		*/
		var data = {
			"dataSetValues": dataSetValues,
			"dataObject": jsonData,
			"status": {
				"isDataReceived": true
			}
		};
		callBack(data);
	},
		function () {
		var data = {
			"dataSetValues": dataSetValues,
			"dataObject": {},
			"status": {
				"isDataReceived": true
			}
		};
		callBack(data);
	});
};

/** @description Constructor WSWebService **/
function WSWebService() {
	this.base = DataService;
	this.base();
	this.m_url = "";
	this.m_key = [];
	this.m_value = [];
	this.m_dataProvider = "";
	this.m_rowlimit = "";
	this.m_ws = "";
};
WSWebService.prototype = new DataService;
/** @description initialize the nQuery service 
 * @param {Object} dataUrl: object holds  properties related to nquery web service 
 * **/
WSWebService.prototype.init = function(dataUrl) {
	this.m_url = dataUrl.getUrl();
	this.m_key = dataUrl.getKeys();
	this.m_connid = dataUrl.getId();
	this.m_dashboard = dataUrl.m_dashboard;
};
WSWebService.prototype.getWebSocket = function() {
	return this.m_ws;
};
WSWebService.prototype.callWebservice = function(value, dataSetValues, callBack) {
	try{
		this.initWebSocket(value, dataSetValues, callBack);
	}catch(e){
		console.log(e);
	}
}
/*
WSWebService.prototype.callWebservice = function(value, dataSetValues, callBack) {
	try{
		if(this.m_url.indexOf("ws:") >= 0 || this.m_url.indexOf("wss:") >= 0){
			this.initWebSocket(value, dataSetValues, callBack);
		}else{
			this.initAPIWebservice(value, dataSetValues, callBack);
		}
	}catch(e){
		console.log(e);
	}
};
WSWebService.prototype.initAPIWebservice = function(value, dataSetValues, callBack) {
	var temp = this;
	var data = {
		"dataSetValues": dataSetValues,
		"dataObject": {},
		"status": {
			"isDataReceived": true,
			"state": "",
			"message": ""
		}
	};
	$.ajax({
		url: temp.m_url,
		success: function(data, success) {
			if (success && response) {
				data.dataObject = response;
				callBack && callBack(data);
			} else {
				callBack && callBack(data);
			}
		}
	});
};
*/
WSWebService.prototype.initWebSocket = function(value, dataSetValues, callBack) {
	var temp = this;
	var ws_url;
	temp.m_value = value;
	temp.m_datasetvalues = dataSetValues;
	var spacekey = parent.BIZVIZ.SDK.getAuthInfo().user.spaceKey;
	var data = {
		"dataSetValues": dataSetValues,
		"dataObject": {},
		"status": {
			"isDataReceived": true,
			"state": "",
			"message": ""
		}
	};//(temp.m_url.indexOf(spacekey) < 0) && 
	if (dataSetValues.m_dataUrl.m_guid && dataSetValues.m_dataUrl.m_guid !== "" && dataSetValues.m_dataUrl.m_igid && dataSetValues.m_dataUrl.m_igid !== "" && dataSetValues.m_dataUrl.m_igs && dataSetValues.m_dataUrl.m_igs !== "") {
    	ws_url = temp.m_url + "?guid=" + dataSetValues.m_dataUrl.m_guid + "&spaceKey=" + spacekey + "&ingestionId=" + dataSetValues.m_dataUrl.m_igid + "&ingestionSecret=" + dataSetValues.m_dataUrl.m_igs;
	} else {
		ws_url = temp.m_url;
	}
	/** Close the webSocket before reconnecting to same **/
	if (dGlobals.webSocketTracker[temp.m_connid] && dGlobals.webSocketTracker[temp.m_connid] !== "") {
		dGlobals.webSocketTracker[temp.m_connid].close();
	}
	try{
		temp.m_ws = new WebSocket(ws_url);
		dGlobals.webSocketTracker[temp.m_connid] = temp.m_ws;
	}catch(e){
		console.log(e);
	}
	temp.m_ws.onopen = function(m) {
		//console.log(temp.m_connid + " Websocket opened");
		data.status.state = "open";
		data.status.message = m.data || "";
		callBack(data);
	};
	temp.m_ws.onmessage = function(m) {
		//console.log(temp.m_connid + " Websocket message" + m.data);
		data.dataObject = {};
		data.status.state = "message";
		data.status.message = m.data || "";
		if(m && m.data){
			try{
				data.dataObject = [JSON.parse(m.data)];
				data.status.message = JSON.parse(m.data).key;
			}catch(e){
				data.dataObject = [{"key": m.data}];
				data.status.message = m.data;
			}
		}
		callBack(data);
	};
	temp.m_ws.onerror = function(m) {
		//console.log(temp.m_connid + " Websocket error");
		temp.m_ws.close();
		dGlobals.webSocketTracker[temp.m_connid].close();
		data.status.state = "error";
		data.status.message = m.data || "";
		callBack(data);
	};
	temp.m_ws.onclose = function(m) {
		//console.log(temp.m_connid + " Websocket close");
		dGlobals.webSocketTracker[temp.m_connid] = null;
		/**DAS-1127 */
		data.dataObject = {};
		data.status.state = "close";
		data.status.message = m.data || "";
		callBack(data);
		if(IsBoolean(!temp.m_dashboard.m_widgetsArray[0].m_designMode)){
			temp.initWebSocket(temp.m_value,temp.m_datasetvalues,callBack);
		}
	};
};
//# sourceURL=ServiceManager.js