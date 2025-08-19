/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: FrameworkUtil.js
 * @description Contains Utility methods used across the dashboard framework
 * */

/** Dashboard level variables used in framework and charting, initialization at designer/build-config/build/appSettings.js **/
dGlobals = dGlobals || {};
dGlobals.isDevMode = true;
dGlobals.documentEventsTracker = {};
dGlobals.webSocketTracker = [];
dGlobals.scriptHelpUrl = "./resources/help/script_help.html";
/** designerHelpUrl is to open custom help page of annitek **/
dGlobals.designerHelpUrl = "";
/** set default layout type **/
dGlobals.layoutType = "AbsoluteLayout";
dGlobals.translateJSONUrl = "./resources/bizviz-i18n/designer.strings.";
dGlobals.bizVizLogo = "../../shared/brand/images/BIZVIZ_logo.png";
dGlobals.mapJSONUrl = appRootPath + designerContextRoot + "views/charting/src/bizviz.charting/components/resources/map/";
dGlobals.componentJSONUrl = appRootPath + designerContextRoot + "views/designer/resources/bizvizchart-themes/";
dGlobals.componentJSUrl = appRootPath + designerContextRoot + "views/charting/src/bizviz.charting/components/";
/** dashboardState: will bind the window-resize event only once in a window for mobile device
 * resize = false : will not resize the dashboard in desktop/ PC as it has several issues now **/
dGlobals.dashboardState = {orientationchange: false, resize: false};
dGlobals.langMap = {
	"isEnabled": "false",
	"language": "all",
	"name": "",
	"hideBrackets": "false",
	"screenName": "dashboard",
	"data": {}
};
dGlobals.pageInOpenDoc = false;
dGlobals.enableGetDataCache = false;

var maxsrc = "images/maxmize.png";
var minsrc = "images/minimize.png";

var nivflag = false;
var isGroup = false;
var maximizedChart = "";

var isTouchEnabled = false;
var isScaling = false;

var widthRatio = 1;
var heightRatio = 1;
var mouseX = 0;
var mouseY = 0;
var pageX;
var pageY;

var pageInPortal = true;
var headerdata = {};
var formdata = {};
var token = "";

/** Instance creation for these variables done from FrameworkComponent's instantiateDashboardModules **/
var parser, dataManager, serviceManager, gvController, rendererController, frameworkController, frameworkUtil;

function FrameworkUtil() {
};

FrameworkUtil.prototype.initUnloadEvent = function(){
	try{
	    window.onbeforeunload = function(){
	    	/** To kill the python process which was initiated during preview and did not completed **/
	    	/** TODO update here when implemented for R/Spark **/
	    	try{
	    		if (dataManager && dataManager != undefined) {
	    			dataManager.clearAllPythonHttpRequests();
	    		}
	    	}catch(e){
	    		console.log(e);
	    	}
		};
	}catch(e){
		console.log(e);
	}
};

/** @description Check for object is JSON or not **/
FrameworkUtil.prototype.ISJson = function (jsonValue) {
	try {
		var JSONdata = JSON.parse(jsonValue);
	} catch (error) {
		return jsonValue;
	}
	return JSONdata;
};
/** @description remove the undefined and blanks from the array **/
FrameworkUtil.prototype.cleanArray = function (arr) {
	arr = $.grep(arr, function (n) {
			return (n)
		});
	return arr;
};
/** @description Removing the null undefined values from connection data **/
FrameworkUtil.prototype.cleanData = function (data) {
	var cleanedData = [];
	if(data){
		for (var i = 0; i < data.length; i++) {
			if (Object.keys(data[i]).length == 1) {
				for (var key in data[i]) {
					if (data[i].hasOwnProperty(key) && data[i][key] != undefined && data[i][key] !== "") {
						cleanedData.push(data[i]);
					}
				}
			} else if (Object.keys(data[i]).length > 1) {
				for (var key1 in data[i]) {
					if (data[i].hasOwnProperty(key1) && data[i][key1] == undefined) {
						data[i][key1] = "null";
					}
				}
				cleanedData.push(data[i]);
			} else {
				// Do nothing
			} 
		}
	}
	return cleanedData;
};
/** @description check for boolean true or false **/
FrameworkUtil.prototype.IsBoolean = function (value) {
	if (value === "true") {
		return true;
	} else if (value === "false") {
		return false;
	} else {
		return value;
	}
};
/** @description returns the uniwue values from the array **/
FrameworkUtil.prototype.uniqueInArray = function (arr, value, attr) {
	arr = $.grep(arr, function (n) {
			if (n.attr == value) {
				return (n);
			}
		});
	return arr;
};
/** @description convert xml to string **/
FrameworkUtil.prototype.XMLToString = function (oXML) {
	/** code for IE **/
	if (window.ActiveXObject) {
		var oString = oXML.xml;
		return oString;
	}
	else {
		/** code for Chrome, Safari, Firefox, Opera, etc **/
		return (new XMLSerializer()).serializeToString(oXML);
	}
};
/** @description convert string to xml **/
FrameworkUtil.prototype.StringToXML = function (oString) {
	/** code for IE **/
	if (window.ActiveXObject) {
		var oXML = new ActiveXObject("Microsoft.XMLDOM");
		oXML.loadXML(oString);
		return oXML;
	}
	else {
		/** code for Chrome, Safari, Firefox, Opera, etc **/
		return (new DOMParser()).parseFromString(oString, "text/xml");
	}
};
/** @description convert xml to JSON **/
FrameworkUtil.prototype.convertXMLToJSON = function (xmlDoc) {
	return (new X2JS().xml_str2json(this.cleanNIV(xmlDoc)));
};
/** @description remove unnecessory characters from the xml **/
FrameworkUtil.prototype.cleanNIV = function (s) {
	var result = encodeURI(s).replace(/\%00|%01|%02|%03|%04|%05|%06|%07|%08|%09|%0A|%0B|%0C|%0D|%0E|%0F|%10|%11|%12|%13|%14|%15|%16|%17|%18|%19|%1A|%1B|%1C|%1D|%1E|%1F|%7F|%C3%A0|%C4%80|%E1%80%80|%EF%BF%BD/g, "");
	result = decodeURI(result);
	result = result.replace(/<br\s*[\/]?>/gi, "\n");
	return result;
};
/** @description converts string to JSON **/
FrameworkUtil.prototype.convertStringToJson = function (jsonString) {
	while (typeof jsonString != "object") {
		try {
			jsonString = JSON.parse(jsonString);
		} catch (e) {
			console.log(e);
			return "";
		}
	}
	return jsonString;
};
/** @description check for the pressed key-it should be numeric **/
FrameworkUtil.prototype.isNumberKey = function (evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode;
	//	if ( charCode > 31 && ( charCode < 48 || charCode > 57 ) )//Does not allow any other characters except number
	if (charCode > 31 && (charCode != 46 && (charCode < 48 || charCode > 57))) //Does not allow any other characters except number and decimal point
		return false;
	return true;
};

FrameworkUtil.prototype.removeNullFromObjectsArray = function(arr) {
    var index = -1,
        arr_length = arr ? arr.length : 0,
        resIndex = -1,
        result = [];

    while (++index < arr_length) {
        var value = arr[index];
        if (value) {
            result[++resIndex] = value;
        }
    }
    return result;
};

/** @description For loading req scripts/all scripts **/
var _scrCount = 0;
FrameworkUtil.prototype.loadCompScripts = function (scripts, callback) {
	scripts = scripts || "*";
	_scrCount = 0;
	console.log("import : " + scripts);
	var urls;
	/** set dev/production source as per global mode **/
	var src_url = (dGlobals.isDevMode) ? dGlobals.src_url_charts.devJS : dGlobals.src_url_charts.prodJS;
	
	if (scripts == "*") {
		var allScrCount = 0;
		for (var k in src_url) {
			if (src_url.hasOwnProperty(k)) {
				allScrCount++;
			}
		}
		urls = [];
		for (var key in src_url) {
			if (src_url.hasOwnProperty(key)) {
				urls.push(src_url[key]);

				if(dGlobals.src_url_pluginDependency_JS[scripts[i]]){
					dGlobals.src_url_pluginDependency_JS[scripts[i]].map(function(dependency){
						dependencyJSUrls.push(dependency);
					})
				}
				if(dGlobals.src_url_pluginDependency_CSS[scripts[i]]){
					dGlobals.src_url_pluginDependency_CSS[scripts[i]].map(function(dependency){
						dependencyCSSUrls.push(dependency);
					})
				}
			}
		}

		loadScript({"urls": dependencyJSUrls, "type": "script", "async": "false", "cbArgs": "", "eCB": "", "sCB": ""});
		loadCSS({"urls": dependencyCSSUrls, "type": "text", "async": "false", "cbArgs": "", "eCB": "", "sCB": function(args, rule){
			$("<div />", {
				html: '<style>' + rule + '</style>'
			}).appendTo("body");
		}});
		loadScript({"urls": urls, "type": "script", "async": "false", "cbArgs": "", "eCB": "", "sCB": callback});
	} else {
		/** To support already published doc in portal, which does not have dependent scripts pushed in import **/
		if(scripts.indexOf("TrellisChart") != -1){
			var trellisDependencyScript = ["BarChart", "BubbleChart", "ColumnStackChart", "LineChart"];
			for(var t=0 ; t<trellisDependencyScript.length ; t++){
				if(scripts.indexOf(trellisDependencyScript[t]) == -1){
					scripts.push(trellisDependencyScript[t]);
				}
			}
		}
		var c = scripts.length;
		if(c != 0){
			urls = [];
			var dependencyJSUrls = [];
			var dependencyCSSUrls = [];
			for (var i = 0; i < c; i++) {
				if (src_url.hasOwnProperty(scripts[i])) {
					urls.push(src_url[scripts[i]]);
					
					if(dGlobals.src_url_pluginDependency_JS[scripts[i]]){
						dGlobals.src_url_pluginDependency_JS[scripts[i]].map(function(dependency){
							dependencyJSUrls.push(dependency);
						})
					}
					if(dGlobals.src_url_pluginDependency_CSS[scripts[i]]){
						dGlobals.src_url_pluginDependency_CSS[scripts[i]].map(function(dependency){
							dependencyCSSUrls.push(dependency);
						})
					}
				}
			}
			loadScript({"urls": dependencyJSUrls, "type": "script", "async": "false", "cbArgs": "", "eCB": "", "sCB": ""});
			loadCSS({"urls": dependencyCSSUrls, "type": "text", "async": "false", "cbArgs": "", "eCB": "", "sCB": function(args, rule){
				$("<div />", {
					html: '<style>' + rule + '</style>'
				}).appendTo("body");
			}});
			loadScript({"urls": urls, "type": "script", "async": "false", "cbArgs": "", "eCB": "", "sCB": callback});
		}else{
			callback();
		}
	}
};

/** Load Scripts dynamically, when all files loaded call the callback **/
function loadScript(args) {
	var loadStatus = [];
	var arr = args.urls;
	var type = args.type;
	var cbArgs = args.cbArgs;
	var async = IsBoolean(args.async);
	var sCB = args.sCB;
	var eCB = args.eCB;
	for(var i=0; i<arr.length; i++ ){
		(function(url, type){
			$.when($.ajax({
				url: url,
				dataType: type,
				cache: true,
				error: function(a,b,c){
					console.log(c);
					hideLoader();
					alertPopUpModal({type:'error', message:'Error!<br>'+(c && c.message), timeout: '5000'});
					hideDashboardPreLoader();
					eCB && eCB(cbArgs);
				},
				async: async
			})).then(function(data, success){
				hideLoader();
				loadStatus.push({loading: success, url: url});
				if(loadStatus.length == arr.length){
					sCB && sCB(cbArgs, data);
				}
			});
		})(arr[i], type);
	}
};

/** Load CSS dynamically, must return css content to add in document-style-tag **/
function loadCSS(args) {
	var arr = args.urls;
	var type = args.type;
	var cbArgs = args.cbArgs;
	var async = IsBoolean(args.async);
	var sCB = args.sCB;
	var eCB = args.eCB;
	for(var i=0; i<arr.length; i++ ){
		(function(url, type){
			$.when($.ajax({
				url: url,
				dataType: type,
				cache: true,
				error: function(a,b,c){
					console.log(c);
					hideLoader();
					eCB && eCB(cbArgs);
				},
				async: async,
			})).then(function(data, success) {
				hideLoader();
				sCB && sCB(cbArgs, data);
			});
		})(arr[i], type);
	}
};


/** Dynamic loading - jquery way **/
$.cachedScript = function (url, options) {
	options = $.extend(options || {}, {
			dataType : "script",
			cache : true,
			url : url
		});
	return $.ajax(options);
};


/** To find the origin of alert popup **/
(function() {
    var oldAlert = window.alert;
    window.alert = function() {
    	if(dGlobals.isDevMode){
    		debugger;
    	}
    	oldAlert.apply(window,arguments);
    };
    
  //define a new console
    var console = (function(oldCons){
    	var isDM = true; /* dGlobals.isDevMode;*/
        return {
            log: function(text){
            	if(isDM){
            		oldCons.log(text);
            	}
                // Your code
            },
            info: function (text) {
            	if(isDM){
            		oldCons.info(text);
            	}
                // Your code
            },
            warn: function (text) {
            	if(isDM){
            		oldCons.warn(text);
            	}
                // Your code
            },
            error: function (text) {
            	if(isDM){
            		oldCons.error(text);
            	}
                // Your code
            }
        };
    }(window.console));
})();


//Then redefine the old console
window.console = console;

/** removes http:, https:, www. from the given url **/
function getNoProtocolUrl(url){
	try{
		return url.replace("http:", "").replace("https:", "").replace("www.", "");
	}catch(e){
		return url; /* "//"+url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]; */
	}
};

/** @description Will read the Niv(XML) file and initialize the dashboard drawing **/
function readXMLAndDrawDashboard() {
	/** this method will enable the loader **/
	initLoader();

	if ($("#hiddenInputField") != null) {
		var url = $("#hiddenInputField").val();
		if (url != "") {
			$(document).ready(function () {
				$.when($.ajax({
					url : url,
					dataType : "text",
					type : "GET",
					success : processResponse,
					error : function (data) {
						alertPopUpModal({type:'error', message:'Failed to read the XML', timeout: '5000'});
					},
					traditional : true,
					//crossDomain : true,
					headers : {
						"X-Requested-With" : "XMLHttpRequest"
					},
					contentType : "text/xml; charset=utf-8",
					complete : processCompleteResponse,
				})).then(function (complete) {
					nivflag = true;
					var nivContent = decrypt(complete);
					frameworkController.init(nivContent);
				});
			});
		} else {
			alertPopUpModal({type:'error', message:'Invalid XML path', timeout: '5000'});
		}
	} else {
		alertPopUpModal({type:'error', message:'Please give a path of XML in hiddenInputField', timeout: '5000'});
	}
};

function processResponse(xmlHttpRequest, status, data) {
	//console.log("status to read xml and get content : "+status);
};
function processCompleteResponse(xmlHttpRequest, status, data) {
	//console.log("dashboard loading : "+status);
};

/** @description It will decrypt the encoded NIV 
 * @param {Object} file: file content of niv 
 * **/
function decrypt(file) {
	var x = file;
	file = file.replace(/\s/g, "");
	file = file.replace(/=/g, "");
	var crypted = "";
	try {
		var decryptedcode = atob(file);
		crypted = xor(decryptedcode, "HaNDle1WiTH2CaRE");
	} catch (e) {
		crypted = x;
	}

	return crypted;
};
/** @description It will XOR the encoded NIV 
 * @param {Object} data:  content of niv 
 * @param {Object} key:  key to be xor'ed with 
 * **/
function xor(data, key) {
	var result = "";
	for (var i = 0; i < data.length; i++) {
		if (i > (key.length - 1)) {
			key += key;
		}
		result += String.fromCharCode(data.charCodeAt(i)^key.charCodeAt(i));
	}
	return result;
};

function ReflectUtil() {};
/**
 * @param strClass: class name
 * @param optionals: constructor arguments
 * @description method used for create a new instance
 * */
ReflectUtil.newInstance = function (strClass) {
	var args = Array.prototype.slice.call(arguments, 1);
	var clsClass = eval(strClass);
	function F() {
		return clsClass.apply(this, args);
	}
	F.prototype = clsClass.prototype;
	return new F();
};

/** windowWH variable will be used to resize dashboard when orientation changes **/
var windowWH = {"aw": window.innerWidth, "ah": window.innerHeight, 
		"w": window.innerWidth, "h": window.innerHeight, 
		"o": window.orientation};





/** @description  This method will ignore the NEGATIVE SIGN and returns only MAGNITUDE of the data **/
function _getMagnitude(_data) {
	return Math.abs(_data);
};
/** @description initialize the loader when service calling starts **/
function initLoader() {
	try{
		$(window.parent.document).find(".blockUI").remove();
	}catch(e){
		console.log(e);
	}
	if(dGlobals.documentEventsTracker && !dGlobals.documentEventsTracker.ajaxStart){
		dGlobals.documentEventsTracker.ajaxStart = true;
		$(document).ajaxStart(function () {
			showLoader();
		});
	}
	if(dGlobals.documentEventsTracker && !dGlobals.documentEventsTracker.ajaxStop){
		dGlobals.documentEventsTracker.ajaxStop = true;
		$(document).ajaxStop(function () {
			hideLoader();
		});
	}
};
/** @description show the block UI loader **/
function showLoader() {
	//if( !$(document).find(".blockUI").length ){
		showBlockUILoader(180000);
	//}
};
/**@description added below method for custom exportexcel loader text**/
function showBlockUILoaderExcel(tOut,msg) {
	var hit =  window.innerHeight,wid = window.innerWidth;
	var scrollLeft = $(window).scrollLeft();
	var scrollTop = $(window).scrollTop();
	var str = "<span style='top: 40%; position: relative;'>",
	msg = (msg == undefined || msg.trim() == "") ? "Please wait ! Excel is downloading..." : msg;
	var ed = "<span>";
	var messagestr = str + msg + ed;
	$.blockUI({
		message : messagestr,
		timeout : tOut,
		css : {
			zIndex : 9999999999,
			border : "none",
			background : "white",
			position: "absolute",
		    padding: "0px",
		    "margin-top": hit*(5/100) + scrollTop +"px",
		    "margin-right": wid*(7.5/100)+"px",
		    "margin-bottom": hit*(5/100)+"px",
		    "margin-left": wid*(7.5/100) + scrollLeft +"px",
		    width: wid*(85/100)+"px",
		    height: hit*(90/100) +"px",
		    top: "0px",
		    left: "0px",
		    textAlign: "center",
		    cursor: "wait"		
		},
		overlayCSS : {
			backgroundColor : "#282830",
			opacity : "0.8", 
			cursor : "wait",
			position: "absolute",
			zIndex : 9999999999
		}
	});
};
/** @description hide the block UI loader **/
function showBlockUILoader(tOut) {
	$.blockUI({
		message : "<div class=\"la-ball-clip-rotate la-dark la-lg\"><div></div></div>",
		timeout : tOut,
		css : {
			zIndex : 9999999999,
			border : "none",
			background : "transparent",
			position: "absolute",
		    padding: "0px",
		    margin: "auto",
		    width: "100%",
		    height: "0%",
		    top: "40%",
		    left: "0px",
		    textAlign: "center",
		    cursor: "wait"		
		},
		overlayCSS : {
			backgroundColor : (app_brand_cfg && app_brand_cfg.dashboardLoaderOverlayBackground ? app_brand_cfg.dashboardLoaderOverlayBackground : "#2dc3e8"),
			opacity : (app_brand_cfg && app_brand_cfg.dashboardLoaderOverlayAlpa ? app_brand_cfg.dashboardLoaderOverlayAlpa : "0.25"), 
			cursor : "wait",
			zIndex : 9999999999
		}
	});
};
/**@description added below method for loader text**/
function showBlockUILoaderExport(tOut,msg) {
	var hit =  window.innerHeight,wid = window.innerWidth;
	var scrollLeft = $(window).scrollLeft();
	var scrollTop = $(window).scrollTop();
	var str = "<span style='top: 40%; position: relative;'>",
	msg = (msg == undefined || msg.trim() == "") ? "Please wait ! PDF is downloading..." : msg;
	var ed = "<span>";
	var messagestr = str + msg + ed;
	$.blockUI({
		message : messagestr,
		timeout : tOut,
		css : {
			zIndex : 9999999999,
			border : "none",
			background : "white",
			position: "absolute",
		    padding: "0px",
		    "margin-top": hit*(5/100) + scrollTop +"px",
		    "margin-right": wid*(7.5/100)+"px",
		    "margin-bottom": hit*(5/100)+"px",
		    "margin-left": wid*(7.5/100) + scrollLeft +"px",
		    width: wid*(85/100)+"px",
		    height: hit*(90/100) +"px",
		    top: "0px",
		    left: "0px",
		    textAlign: "center",
		    cursor: "wait"		
		},
		overlayCSS : {
			backgroundColor : "#282830",
			opacity : "0.8", 
			cursor : "wait",
			position: "absolute",
			zIndex : 9999999999
		}
	});
};
/**@description added below method for loader text without timeout**/
function showBlockUILoaderLongExport(msg) {
	var hit =  window.innerHeight,wid = window.innerWidth;
	var scrollLeft = $(window).scrollLeft();
	var scrollTop = $(window).scrollTop();
	var str = "<span style='top: 40%; position: relative;'>",
	msg = (msg == undefined || msg.trim() == "") ? "Please wait ! PDF is downloading..." : msg;
	var ed = "<span>";
	var messagestr = str + msg + ed;
	$.blockUI({
		message : messagestr,
		css : {
			zIndex : 9999999999,
			border : "none",
			background : "white",
			position: "absolute",
		    padding: "0px",
		    "margin-top": hit*(5/100) + scrollTop +"px",
		    "margin-right": wid*(7.5/100)+"px",
		    "margin-bottom": hit*(5/100)+"px",
		    "margin-left": wid*(7.5/100) + scrollLeft +"px",
		    width: wid*(85/100)+"px",
		    height: hit*(90/100) +"px",
		    top: "0px",
		    left: "0px",
		    textAlign: "center",
		    cursor: "wait"		
		},
		overlayCSS : {
			backgroundColor : "#282830",
			opacity : "0.8", 
			cursor : "wait",
			position: "absolute",
			zIndex : 9999999999
		}
	});
};
/** @description hide the block UI loader **/
function hideLoader() {
	if($.isEmptyObject($.ajaxQ.getAll())){
		hideBlockUILoader();
	}
};
/** @description hide the block UI loader **/
function hideBlockUILoader() {
	$.unblockUI();
};
function hideDashboardPreLoader(){
	$( ".bvz-loader-container" ).hide();
};
/** @description Stores all Ajax-requests in an object **/
$.ajaxQ = (function(){
	var id = 0, Q = {};
	$(document).ajaxSend(function(e, jqx){
		jqx._id = ++id;
		Q[jqx._id] = jqx;
	});

	$(document).ajaxComplete(function(e, jqx){
		delete Q[jqx._id];
		hideLoader();
	});

	return {
		abortAll: function(){
			var r = [];
			$.each(Q, function(i, jqx){
				r.push(jqx._id);
				delete Q[jqx._id];
				jqx.abort();
			});
			hideLoader();
			return r;
		},
		getAll: function(){
			return Q;
		}
	};
})();

/** @description parser of system date variable **/
function parseSystemDateDefaultValue(fieldValue, specifier) {
	var dateStr = fieldValue;
	try {
		var firstBrackIndex = fieldValue.search("\\)");
		var nextBrackIndex = fieldValue.lastIndexOf("\(");
		var format = fieldValue.substring(specifier.length + 1, firstBrackIndex);
		var zone = fieldValue.substr(nextBrackIndex);
		zone = zone.substring(1, zone.length - 1);
		dateStr = formattedDateTime(format, zone);
	} catch (error) {
		//		do nothing
		//		parse errors may come due to wrong configurations also
	}
	return dateStr;
};
function formattedDateTime(format, zoneOffset) {
	var date = new Date();
	if (zoneOffset != "") {
		if (zoneOffset.search(".") != -1) {
			var dig = new Number(zoneOffset.split(".")[1]);
			dig = (dig * 10) / 6;
			zoneOffset = zoneOffset.split(".")[0] + "." + dig;
		}
		var off = new Number(zoneOffset);
		off = off * 60;
		date = getZoneDate(date, off);
	}
	return createDateString(date, format);
};
function getZoneDate(d, tzOffset) {
	var nd = new Date();
	var offset = d.getTimezoneOffset() * 60 * 1000;
	tzOffset = tzOffset * 60 * 1000;
	nd.setTime(d.getTime() + offset + tzOffset);
	return nd;
};
function createDateString(selectedDate, outputFormat) {
	var output = "";
	var seperator = getDateSeparator(outputFormat);
	if (outputFormat != "") {
		if (seperator != "") {
			var elements = new Array();
			elements = outputFormat.split(seperator);
			for (var i = 0; i < elements.length; i++) {
				output += parseElementOfDate(elements[i], selectedDate) + seperator;
			}
		} else {
			output = parseElementOfDate(outputFormat, selectedDate);
		}
		if (output.charAt(output.length - 1) == seperator) {
			output = output.substring(0, output.lastIndexOf(seperator));
		}
	}
	return output;
};
function getDateSeparator(outputFormat) {
	var seperatorSymbol = "";
	if (outputFormat.indexOf("-") != -1) {
		seperatorSymbol = "-";
	} else if (outputFormat.indexOf(".") != -1) {
		seperatorSymbol = ".";
	} else if (outputFormat.indexOf("/") != -1) {
		seperatorSymbol = "/";
	} else if (outputFormat.indexOf("_") != -1) {
		seperatorSymbol = "_";
	} else {
		// Do nothing
	}
	return seperatorSymbol;
};
function parseElementOfDate(element, date) {
	var retString = "";
	if (element.toLowerCase() == "dd") {
		var _d = date.getDate();
		if (_d < 10) {
			retString = "0" + _d;
		} else {
			retString = date.getDate().toString();
		}
	} else if (element.toLowerCase() == "d") {
		retString = date.getDate().toString();
	} else if (element.toLowerCase() == "mm") {
		var mn = date.getMonth() + 1;
		if (mn < 10) {
			retString = "0" + mn;
		} else {
			retString = mn.toString();
		}
	} else if (element.toLowerCase() == "m") {
		retString = (date.getMonth() + 1).toString();
	} else if (element.toLowerCase() == "yy") {
		retString = date.getFullYear().toString().substr(2, 2);
	} else if (element == "MMM") {
		retString = monthFromIndex(date.getMonth(), false, true);
	} else if (element == "mmm") {
		retString = monthFromIndex(date.getMonth(), false, false);
	} else if (element == "MMMM") {
		retString = monthFromIndex(date.getMonth(), true, true);
	} else if (element == "mmmm") {
		retString = monthFromIndex(date.getMonth(), true, false);
	} else if (element.toLowerCase() == "yyyy") {
		retString = date.getFullYear().toString();
	} else {
		// Do nothing
	}
	return retString;
};
function monthFromIndex(ind, fulllength, caps) {
	var month = "";
	switch (ind) {
	case 0:
		month = "January"
		break;
	case 1:
		month = "February"
		break;
	case 2:
		month = "March"
		break;
	case 3:
		month = "April"
		break;
	case 4:
		month = "May"
		break;
	case 5:
		month = "June"
		break;
	case 6:
		month = "July"
		break;
	case 7:
		month = "August"
		break;
	case 8:
		month = "September"
		break;
	case 9:
		month = "October"
		break;
	case 10:
		month = "November"
		break;
	case 11:
		month = "December"
		break;
	default: 
		break;
	}
	if (!caps) {
		month = month.toLowerCase();
	}
	if (fulllength) {
		return month;
	} else {
		return month.substr(0, 3);
	}
};

/** @description check for boolean true or false **/
function IsBoolean(value) {
	if (value === "true") {
		return true;
	} else if (value === "false") {
		return false;
	} else {
		return value;
	}
};
/** @description check whether, parameter is an array or an object **/
function IsTypeOfArray(obj) {
	if (typeof obj == 'object' && Object.prototype.toString.call(obj) == '[object Array]'){
		return true;
	} else {
		return false;
	}
};


/** Method to watch angular watchers count **/
function getWatchers(root) {
	root = angular.element(root || document.documentElement);
	
	function getElemWatchers(element) {
		var isolateWatchers = getWatchersFromScope(element.data().$isolateScope);
		var scopeWatchers = getWatchersFromScope(element.data().$scope);
		var watchers = scopeWatchers.concat(isolateWatchers);
		angular.forEach(element.children(), function (childElement) {
			watchers = watchers.concat(getElemWatchers(angular.element(childElement)));
		});
		return watchers;
	}

	function getWatchersFromScope(scope) {
		if (scope) {
			return scope.$$watchers || [];
		} else {
			return [];
		}
	}

	return getElemWatchers(root);
};

/************************* USER INFO AND CUSTOM PROPERTY DETAILS **************************/

/** sets the doc parameters from modify-doc-option-in-portal for consumption in script **/
function setDocParameters(complete) {
	if(complete.trees.dashBoardParameters && complete.trees.dashBoardParameters.length > 0){
		var dbParametersMap = {};
		var dashBoardParameters = complete.trees.dashBoardParameters;
		for(var i=0; i<dashBoardParameters.length; i++){
			/** 1: User Properties, 2: System Properties **/
			if(dashBoardParameters[i].customParamType == 1 || dashBoardParameters[i].customParamType == 2){
				dbParametersMap[dashBoardParameters[i].paramName] = dashBoardParameters[i].name;
			}
		}
		bizviz.addContextExceptionKey("dashboard_dashboardparameters");
		bizviz.setContext("dashboard_dashboardparameters", dbParametersMap, true);
	}else{
		console.log('No dashboard parameters');
	}
};
/** @description sets the custom-field-props in sdk-context **/
function setUserCustomField(customProp){
	if (bizviz != undefined && customProp) {
		for(var i=0; i<customProp.length; i++){
			if(customProp[i]["key"]){
				bizviz.addContextExceptionKey("user_" + customProp[i]["key"]);
				bizviz.addContext("user_" + customProp[i]["key"], customProp[i]["value"], true);
			}
		}
	}else{
		console.log('No user custom properties');
	}
};
/** @description save the user detail in context- can be used in dashboard script **/
function saveLoggedUser(userData) {
	if (bizviz != undefined) {
		bizviz.resetContext();
		bizviz.addContext("localtime", new Date().getTime(), true);
		bizviz.addContext("dashboard_user", userData, true);
		bizviz.addContext("dashboard_isopendoc", false, true);
		bizviz.addContext("dashboard_dashboardparameters", {}, true);
		try {
			if (userData) {
				for (var key in userData) {
					if (userData.hasOwnProperty(key)) {
						bizviz.addContextExceptionKey("dashboard_" + key.toLowerCase());
						bizviz.addContext("dashboard_" + key.toLowerCase(), userData[key], true);
					}
				}
			}
		} catch (e) {
			console.log(e);
		}
	}
};
/** @description returns the currently logged user, get from jStorage **/
function getLoggedUser() {
	/** Checks for the available Auth in current Document **/
	var auth = BIZVIZ.SDK.getAuthInfo();
	if(auth && Object.keys(auth).length === 0 && auth.constructor === Object){
		/** Checks for the available Auth in Platform **/
		auth = parent.BIZVIZ.SDK.getAuthInfo();
	}
	/** Checks for the available Auth in BIZVIZ SDK **/
	if(auth && Object.keys(auth).length != 0){
		/** update LoginToken also in user properties **/
		auth.user.authToken = auth.authToken || "";
		auth.user.authType = auth.authType || "";
		auth.user.token = auth.token || "";
		auth.user.preference = (auth.preference) ? auth.preference.themeID : [];
		auth.user.customproperties = (auth.preference && auth.preference.userID && auth.preference.userID.customproperties) ? JSON.parse(auth.preference.userID.customproperties) : ((auth.user && auth.user.customproperties) ? JSON.parse(auth.user.customproperties) : []);
		/** DO not delete saveLoggedUser(): Old dashboard uses the direct keys (i.e dashboard_userType) to get user info **/
		saveLoggedUser(auth.user);
	}else {
		/** Take the Auth from session storage if not available in BIZVIZ.SDK **/
		if ( window.sessionStorage ){
			saveLoggedUser( JSON.parse(window.sessionStorage.getItem('bvz_authInfo')) );
		}
	}
};
function setLoggedUserAndCustomProperties(customProp){
	getLoggedUser();
	if(customProp && customProp.preference && customProp.preference.userID && customProp.preference.userID.customproperties) {
		setUserCustomField(JSON.parse(customProp.preference.userID.customproperties));
	} else if(customProp && customProp.user && customProp.user.customproperties) {
		setUserCustomField(JSON.parse(customProp.user.customproperties));
	}else{
		// Do nothing
	}
};
/** sets whether a doc is opendoc or not **/
function setIsOpenDocument() {
	if(getUrlParameters().type === "opendoc"){
		dGlobals.pageInOpenDoc = true;
	}else{
		dGlobals.pageInOpenDoc = false;
	}
	bizviz.setContext("dashboard_isopendoc", dGlobals.pageInOpenDoc, true);
};
function setHeader(formdata) {
	headerdata = {};
	if(parent.opendoc != undefined && IsBoolean(parent.opendoc)){
		headerdata = {
			"authtoken": window.sessionStorage.getItem('bvz_token'),
			"spacekey": window.sessionStorage.getItem('bvz_spacekey'),
			"userid": window.sessionStorage.getItem('bvz_userid')
		};
	} else {
		headerdata = {
			"authtoken": window.sessionStorage.getItem('bvz_token'),
			"spacekey": window.sessionStorage.getItem('bvz_spacekey')
		};
		if( window.sessionStorage.getItem('bvz_userid') ){
			headerdata["userid"] = window.sessionStorage.getItem('bvz_userid');
		}else{
			headerdata["userid"] = formdata["userid"];
		}
	}
	/** Encrypting Request Headers **/
	headerdata.spacekey = encryptText(headerdata.spacekey);
	headerdata.userid = encryptText(headerdata.userid);
};
function getUrlParameters() {
	var params = {};
	if(window.location.href){
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for (var i = 0; i < hashes.length; i++) {
			var hash = hashes[i].split('=');
			params[hash[0]] = hash[1];
		}
	}
	return params;
};
function setDataAndToken(token, spacekey, id) {
	formdata = {};
	token = window.sessionStorage.getItem('bvz_token');
	formdata = {
		"token": window.sessionStorage.getItem('bvz_token'),
		"spacekey": window.sessionStorage.getItem('bvz_spacekey'),
		"id": getUrlParameters().docid,
		"dashboardView": (detectDevice.mobile() ? "Mobile" : (detectDevice.tablet() ? "Tablet" : "Desktop"))
	};
};

/********************************** Dashboard Loading Methods in Platform **********************************/
function loadDashboardAfterDocReady(){
	$(document).ready(function() {
		setDataAndToken("token", "spacekey", "id");
		setHeader(formdata);
		setLoggedUserAndCustomProperties(BIZVIZ.SDK.getAuthInfo());
		/**BDD-834 getting 'getData' json from local storage and checking republish, version change**/
		var urlParam = getUrlParameters();
		var bvzxData = JSON.parse(localStorage.getItem('bvz_' + urlParam.docid));
		if (bvzxData === null || bvzxData.publishedDate !== urlParam.pubOn) {
			getDashboardData();
		} else {
			console.log('Get dashboard JSON successfull');
			hideDashboardPreLoader();
			bvzxData = getDecryptedObject(bvzxData.jsonData);
			initializeDashboardDrawing(bvzxData);
		}
		/** Deprecated approach to get openDoc JSON from jStorage **/
		/*
		if( $.jStorage.get("opendoc") && $.jStorage.get("openDocData") ){
			getOpenDocDashboardData();
		}else{
			getDashboardData();
		}
		*/
	});
};
function getDashboardData(){
	showLoader();
	formdata = getEncryptedObject(formdata);
	$.when($.ajax({
		url: base_url + req_url.home.getData,
		type: 'POST',
		data: formdata,
		headers: headerdata,
		success: function(data) {
			/**BDD-834 saving getData service in local storage**/
			if (IsBoolean(dGlobals.enableGetDataCache)) {
				var urlParam = getUrlParameters();
				var jsonMap = {
					"publishedDate" : urlParam.pubOn,
					"jsonData" : getDuplicateObject(data)
				}
				localStorage.setItem('bvz_' + urlParam.docid, JSON.stringify(jsonMap));
			}
			console.log('Get dashboard JSON successfull');
		},
		error: function(data) {
			console.log('Failed to get dashboard JSON');
			hideLoader();
			hideDashboardPreLoader();
		},
		traditional: true,
		crossDomain: true,
		complete: processResponse
	})).then(function(complete) {
		hideLoader();
		hideDashboardPreLoader();
		complete = getDecryptedObject(complete);
		initializeDashboardDrawing(complete);
	});
};
function initializeDashboardDrawing(complete){
	if(complete && complete.trees && complete.trees.tree && complete.trees.tree.data){
		setIsOpenDocument();
		setDocParameters(complete);
		frameworkController.initializeDashboardXMLOrJson(complete);
	}else{
		alertPopUpModal({type:'error', message:'Invalid Dasboard file', timeout: '5000'});
	}	
};

/********************************************************************/

/** Deprecated methods **/
function getOpenDocDashboardData(){
	var complete = $.jStorage.get("openDocData");
	$.jStorage.deleteKey("openDocData");
	if(complete && complete.trees && complete.trees.tree && complete.trees.tree.data){
		hideDashboardPreLoader();
		/** this method will enable the loader **/
		initLoader();
		initializeDashboardDrawing(complete);
	}else{
		hideDashboardPreLoader();
		alertPopUpModal({type:'error', message:'Dasboard file is not valid', timeout: '5000'});
	}
};
function setFlashVariables() {
	var url = base_url + req_url.designer.getFlashVars;
	setDataAndToken("token", "spacekey", "docId");
	setHeader(formdata);
	formdata = getEncryptedObject(formdata);
	$.when($.ajax({
		type: "POST",
		url: url,
		data: formdata,
		headers: headerdata,
		crossDomain: true,
		success: function(data, status) {
			setFlashVarsToFramework(data, status);
		},
		error: function(data, status) {
			alertPopUpModal({type:'error', message:'Error: ' + status, timeout: '5000'});
		}
	})).then(function(complete) {});
};
function setFlashVarsToFramework(data, status) {
	var flashVarString = data.trees.flashVars;
	$("input[name=hiddenFilter]").val(flashVarString);
	var flashVariablesMap = {};
	if (flashVarString != undefined && flashVarString != "") {
		var flashVars = flashVarString.split("&");
		for (var i = 0; i < flashVars.length; i++) {
			var arr = flashVars[i].split("=");
			flashVariablesMap[arr[0]] = arr[1];
		}
	}
};

/********* Encryption Methods ***********/
function getDecryptedObject(resp) {
	var authInfo = parent.BIZVIZ.SDK.getAuthInfo();
	
	var decryptedText;
	if( authInfo.key && resp ) {
		var key, decryptedData, decryptedText;
		var isString = false;
		try {
			if(typeof resp === 'string' || resp instanceof String) {
				resp = JSON.parse( resp );
				isString = true;
			}
			if( resp.data ) {
				key = CryptoJS.enc.Base64.parse(authInfo.key);
				decryptedData = CryptoJS.TripleDES.decrypt(resp.data, key, {
					mode: CryptoJS.mode.ECB
				});
				decryptedText = decryptedData.toString(CryptoJS.enc.Utf8);
				if(!isString) {
					decryptedText = JSON.parse(decryptedText);
				}
			} else {
				return resp;
			}
		} catch(err) {
			decryptedText = {};
		}
		return decryptedText
	} else {
		return resp;
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

function encryptText (data) {
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

function getEncryptedObject(data) {
	var authInfo = parent.BIZVIZ.SDK.getAuthInfo();
	
	var encryptedText;
	if( authInfo.key && data ) {
		var key, encData;
		try {
			data = transformRequest(data);
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
/********************************** Dashboard Loading Methods in Platform **********************************/

/** @description ajax service call to given url **/
function requestToServer(url, token, successhandle) {
	var data = { "token" : token };
	$.ajax({
		type : "POST",
		url : url,
		data : data,
		crossDomain : true,
		success : successhandle,
		error : function (data, status) {
			alertPopUpModal({type:'error', message:'Error: ' + status, timeout: '5000'});
		}
	});
};
/** @description URL updation  **/
function removeParamsFromURL(url) {
	return url.split("?")[0];
};
function replaceDomain(url, newDomain) {
	return url.replace(extractDomain(url), newDomain)
};
function extractDomain(url) {
	var domain;
	if(url.indexOf("://") > -1){
		domain = url.split("/")[2];
	} else{
		domain = url.split("/")[0];
	}
	return domain.split(":")[0];
};

/** @description adds an element to the array if it does not already exist using a comparer function **/
function pushIfNotExist(array, element, compareFunc) {
	if (!checkInArray(array, compareFunc)) {
		array.push(element);
	}
};
/** @description check for item available in array or not **/
function checkInArray(array, compareFunc) {
	for (var i = 0; i < array.length; i++) {
		if (compareFunc(array[i]))
			return true;
	}
	return false;
};
/** @description return the comma removed number from the numeric string **/
function getNumericComparableValue(value) {
	var newValue = value;
	try {
		var isValueContainsChar = (/[a-zA-Z]/.test(value));
		if (!isValueContainsChar) {
			newValue = getCommaRemovedValue(value);
		}
	} catch (e) {
		console.log(e);
	}
	return newValue;
};
/** @description returns the numeric comparable number **/
function getCommaRemovedValue(value) {
	var newValue = value;
	if (isNaN(value) && value != undefined) {
		newValue = ("" + value).replace(/\,/g, "");
	}
	return newValue;
};
/** @description method put aggregation operations on given array **/
function getAggregationOperatedData(values, operation) {
	switch (operation) {
	case "sum":
	// made it zero for Dynamic datagrid aggregation sum operation
		var sum = 0;
		for (var i = 0; i < values.length; i++) {
			var temp = getNumericComparableValue(values[i]);
			if (!isNaN(temp) && temp != "")
				sum = sum * 1 + temp * 1;
		}
		return sum;
	case "avg":
		var sum = "";
		for (var i = 0; i < values.length; i++) {
			var temp = getNumericComparableValue(values[i]);
			if (!isNaN(temp) && temp != "")
				sum = sum * 1 + temp * 1;
		}
		if (sum != "")
			return sum / values.length;
		else
			return "";
	case "max":
		var max = values[0];
		for (var i = 0; i < values.length; i++) {
			var temp = getNumericComparableValue(values[i]);
			if (!isNaN(temp) && (temp != "" || temp == 0))
				if (temp*1 > max*1)
					max = temp;
		}
		return max;
	case "min":
		var min = values[0];
		for (var i = 0; i < values.length; i++) {
			var temp = getNumericComparableValue(values[i]);
			if (!isNaN(temp) && (temp != "" || temp == 0))
				if (temp*1 < min*1)
					min = temp;
		}
		return min;
	case "count":
		return values.length;
	case "uniquevalue":
		return $.unique(values);
	default:
		return;
	}
};
/** returns a deep copy of array to prevent circular reference **/
function getDuplicateArray( arr ){
	try{
		return JSON.parse(JSON.stringify( arr ));
	}catch(e){
		return arr;
	}
};



//this will run on <=IE9, possibly some niche browsers
// new webkit-based, FireFox, IE10 already have native version of this.
window.btoa = function (data) {
	// DO NOT ADD UTF8 ENCODING CODE HERE!!!!

	// UTF8 encoding encodes bytes over char code 128
	// and, essentially, turns an 8-bit binary streams
	// (that base64 can deal with) into 7-bit binary streams.
	// (by default server does not know that and does not recode the data back to 8bit)
	// You destroy your data.

	// binary streams like jpeg image data etc, while stored in JavaScript strings,
	// (which are 16bit arrays) are in 8bit format already.
	// You do NOT need to char-encode that before base64 encoding.

	// if you, by act of fate
	// have string which has individual characters with code
	// above 255 (pure unicode chars), encode that BEFORE you base64 here.
	// you can use absolutely any approch there, as long as in the end,
	// base64 gets an 8bit (char codes 0 - 255) stream.
	// when you get it on the server after un-base64, you must
	// UNencode it too, to get back to 16, 32bit or whatever original bin stream.

	// Note, Yes, JavaScript strings are, in most cases UCS-2 -
	// 16-bit character arrays. This does not mean, however,
	// that you always have to UTF8 it before base64.
	// it means that if you have actual characters anywhere in
	// that string that have char code above 255, you need to
	// recode *entire* string from 16-bit (or 32bit) to 8-bit array.
	// You can do binary split to UTF16 (BE or LE)
	// you can do utf8, you can split the thing by hand and prepend BOM to it,
	// but whatever you do, make sure you mirror the opposite on
	// the server. If server does not expect to post-process un-base64
	// 8-bit binary stream, think very very hard about messing around with encoding.

	// so, long story short:
	// DO NOT ADD UTF8 ENCODING CODE HERE!!!!

	/* @preserve
	====================================================================
	base64 encoder
	MIT, GPL

	version: 1109.2015
	discuss at: http://phpjs.org/functions/base64_encode
	+   original by: Tyler Akins (http://rumkin.com)
	+   improved by: Bayron Guevara
	+   improved by: Thunder.m
	+   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	+   bugfixed by: Pellentesque Malesuada
	+   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	+   improved by: Rafal Kukawski (http://kukawski.pl)
	+                Daniel Dotsenko, Willow Systems Corp, willow-systems.com
	====================================================================
	 */

	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	b64a = b64.split(''),
	o1,
	o2,
	o3,
	h1,
	h2,
	h3,
	h4,
	bits,
	i = 0,
	ac = 0,
	enc = "",
	tmp_arr = [],
	r;

	do { // pack three octets into four hexets
		o1 = data.charCodeAt(i++);
		o2 = data.charCodeAt(i++);
		o3 = data.charCodeAt(i++);

		bits = o1 << 16 | o2 << 8 | o3;

		h1 = bits >> 18 & 0x3f;
		h2 = bits >> 12 & 0x3f;
		h3 = bits >> 6 & 0x3f;
		h4 = bits & 0x3f;

		// use hexets to index into b64, and append result to encoded string
		tmp_arr[ac++] = b64a[h1] + b64a[h2] + b64a[h3] + b64a[h4];
	} while (i < data.length);

	enc = tmp_arr.join('');
	r = data.length % 3;
	return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
	// end of base64 encoder MIT, GPL
};

window.atob = function (data) {
	// http://kevin.vanzonneveld.net
	// +   original by: Tyler Akins (http://rumkin.com)
	// +   improved by: Thunder.m
	// +      input by: Aman Gupta
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   bugfixed by: Onno Marsman
	// +   bugfixed by: Pellentesque Malesuada
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +      input by: Brett Zamir (http://brett-zamir.me)
	// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
	// *     returns 1: 'Kevin van Zonneveld'
	// mozilla has this native
	// - but breaks in 2.0.0.12!
	//if (typeof this.window['atob'] == 'function') {
	//    return atob(data);
	//}
	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	o1,
	o2,
	o3,
	h1,
	h2,
	h3,
	h4,
	bits,
	i = 0,
	ac = 0,
	dec = "",
	tmp_arr = [];

	if (!data) {
		return data;
	}

	data += '';

	do { // unpack four hexets into three octets using index points in b64
		h1 = b64.indexOf(data.charAt(i++));
		h2 = b64.indexOf(data.charAt(i++));
		h3 = b64.indexOf(data.charAt(i++));
		h4 = b64.indexOf(data.charAt(i++));

		bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

		o1 = bits >> 16 & 0xff;
		o2 = bits >> 8 & 0xff;
		o3 = bits & 0xff;

		if (h3 === 64) {
			tmp_arr[ac++] = String.fromCharCode(o1);
		} else if (h4 === 64) {
			tmp_arr[ac++] = String.fromCharCode(o1, o2);
		} else {
			tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
		}
	} while (i < data.length);
	dec = tmp_arr.join('');
	return dec;
};

window.detectDevice = {
	userAgent : window.navigator.userAgent.toLowerCase(),
	type : ['mobile', 'tablet', 'desktop'],		os : ['ios', 'iphone', 'ipad', 'ipod', 'android', 'blackberry', 'windows', 'fxos', 'meego', 'television'],
	size : function () {
		return {"height": window.innerHeight - 8, "width" : window.innerWidth - 8};
	},
	television : function () {
		var i = 0;
		var tv = ['googletv', 'viera', 'smarttv', 'internet.tv', 'netcast', 'nettv', 'appletv', 'boxee', 'kylo', 'roku', 'dlnadoc', 'roku', 'pov_tv', 'hbbtv', 'ce-html'];
		while (i < tv.length) {
			if (this.find(tv[i])) {
				return true;
			}
			i++;
		}
		return false;
	},
	portrait : function () {
		return window.innerHeight / window.innerWidth > 1;
	},
	landscape : function () {
		return window.innerHeight / window.innerWidth < 1;
	},		macos : function () {
		return this.find('mac');
	},
	ios : function () {
		return this.iphone() || this.ipod() || this.ipad();
	},
	iphone : function () {
		return !this.windows() && this.find('iphone');
	},
	ipod : function () {
		return this.find('ipod');
	},
	ipad : function () {
		return this.find('ipad');
	},
	android : function () {
		return !this.windows() && this.find('android');
	},
	androidPhone : function () {
		return this.android() && this.find('mobile');
	},
	androidTablet : function () {
		return this.android() && !this.find('mobile');
	},
	blackberry : function () {
		return this.find('blackberry') || this.find('bb10') || this.find('rim');
	},
	blackberryPhone : function () {
		return this.blackberry() && !this.find('tablet');
	},
	blackberryTablet : function () {
		return this.blackberry() && this.find('tablet');
	},
	windows : function () {
		return this.find('windows');
	},
	windowsPhone : function () {
		return this.windows() && this.find('phone');
	},
	windowsTablet : function () {
		return this.windows() && this.find('touch') && !this.windowsPhone();
	},
	fxos : function () {
		return (this.find('(mobile') || this.find('(tablet')) && this.find(' rv:');
	},
	fxosPhone : function () {
		return this.fxos() && this.find('mobile');
	},
	fxosTablet : function () {
		return this.fxos() && this.find('tablet');
	},
	meego : function () {
		return this.find('meego');
	},
	cordova : function () {
		return window.cordova && location.protocol === 'file:';
	},
	nodeWebkit : function () {
		return _typeof(window.process) === 'object';
	},
	mobile : function () {
		return this.androidPhone() || this.iphone() || this.ipod() || this.windowsPhone() || this.blackberryPhone() || this.fxosPhone() || this.meego();
	},
	tablet : function () {
		return this.ipad() || this.androidTablet() || this.blackberryTablet() || this.windowsTablet() || this.fxosTablet();
	},
	desktop : function () {
		return !this.tablet() && !this.mobile();
	},
	find : function (needle) {
		return this.userAgent.indexOf(needle) !== -1;
	}
};
	 
/** SCREEN WIDTH LIMIT **/
var small_screen_lim = 770;
var window_height = $(window).height();
var window_width = $(window).width();

//# sourceURL=FrameworkUtil.js