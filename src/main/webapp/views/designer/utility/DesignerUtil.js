/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: DesignerUtil.js
 * @description Utility methods used across the designer module
 */
//# sourceURL=DesignerUtil.js

/** @description method is used for number validation and returns the boolean value
 * @param {Object} event: keyboard event object
 * @returns {Boolean} whether key pressed is number or not
 *  **/
function checkValidNumber(event) {
	var charCode = (event.which) ? event.which : event.keyCode;
	if (charCode != 45 && charCode > 31 && (charCode < 48 || charCode > 57))
		return false;
	
	/** For bvz-number-spinner these max and min are no more target attribute**/
	if(event.target.attributes.max){
		var max = event.target.attributes.max.nodeValue;
		var min = event.target.attributes.min.nodeValue;
		var value = event.target.value + String.fromCharCode(event.which);
		if (max != "" || min != "") {
			if (min != "" && max == "")
				return ((value * 1) >= (min * 1));
			else if (min == "" && max != "")
				return ((value * 1) <= (max * 1));
			else if (max != "" && min != "")
				return ((value * 1) >= (min * 1) && (value * 1) <= (max * 1));
			else
				return false;
		} else {
			return true;
		}
	}else{
		return true;
	}
};

/** @description Method will return the color code in hexadecimal format
 * @param {String} colorString: 
 * @returns {String} Hexadecimal string for the input string
 * **/
function convertColorToHex(colorString) {
	var m_colors = colorString;
	var icolor = "";
	var str = "" + m_colors;
	if ((startsWith(str, "0x")) || (startsWith(str, "0X"))) {
		icolor = m_colors.substr(2, 7);
	} else if ((startsWith(str, "#"))) {
		icolor = m_colors.substr(1, 6);
		if (icolor.length <= 3)
			icolor = addString(icolor);
	} else if (isNaN(str)) {
		icolor = str;
		if (icolor.length == 3) {
			for (var i = 0; i < icolor.length; i++)
				icolor += icolor[i] + "" + icolor[i];
		} else if (icolor.length < 6) {
			icolor = padColorString(icolor);
		}
	} else {
		icolor = Number(m_colors).toString(16);
		icolor = padColorString(icolor);
	}
	if (icolor.length > 6)
		icolor = icolor.substring(icolor.length - 6, icolor.length);

	var hex = ("#" + icolor);
	return (isValidHex(hex)) ? hex : "#000000";
};

/** @description Method will check a string start with particular character or not.
 * @param {String} str: 
 * @param {String} prefix: 
 * @returns {Boolean} Whether str contains prefix as prefix or not
 *  **/
function startsWith(str, prefix) {
	return (str.indexOf(prefix) === 0);
};

function getPublicFilters(dashboardJson) {
	var layoutType = dashboardJson.layoutType;
	dashboardJson.PublicFilters = [];
	for(var i = 0; i < dashboardJson[layoutType].Object.length; i++){
		var comp = dashboardJson[layoutType].Object[i];
	 switch(comp.componentType){
		case "combo_filter":
		case "list_filter":
			if(IsBoolean(comp.Filter.publicFilter)){
			  var fields = comp.Filter.DataSet.Fields;
			  for(var j = 0; j < fields.length; j++){
				if(fields[j].Type == "Value"){
					var obj = {"globalKey":fields[j].Name};
					dashboardJson.PublicFilters.push(obj);
				}
			  }
			}
			break;
		case "hierarchical_combo":
			if(IsBoolean(comp.Filter.publicFilter)){
				  var fields = comp.Filter.DataSet.Fields;
				  for(var j = 0; j < fields.length; j++){
					if(fields[j].hierarchyType == "child"){
						var obj = {"globalKey":fields[j].Name};
						dashboardJson.PublicFilters.push(obj);
					}
				  }
				}
		break;
		case "default":
		break;
	 
	 }
	}
	return dashboardJson.PublicFilters;
};

/** @description Method will check that a string is valid hexadecimal string or not. **/
function isValidHex(str) {
	return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(str);
};

/** @description Method will covert the color code from Hexadecimal to RGBA. **/
function hex2rgb(hex, opacity) {
	if (hex) {
		var rgb = hex.replace("#", "").match(/(.{2})/g);
		var i = 3;
		while (i--) {
			rgb[i] = parseInt(rgb[i], 16);
		}
		if (typeof opacity === "undefined") {
			return "rgb(" + rgb.join(", ") + ")";
		}
		return "rgba(" + rgb.join(", ") + ", " + opacity + ")";
	} else {
		return hex;
	}
};
var dotflag = false;
var minusflag = false;

/** @description Method will check that entered input is number or not. **/
function checkOnlyNumericValue(event) {
	var unicode = event.charCode ? event.charCode : event.keyCode;
	var value = (event.target.value + String.fromCharCode(event.which));
	var maxlength = event.target.max * 1;
	if (value.length > maxlength && unicode != 8 && unicode != 46)
		return false;
	var splitvalue = (event.target.value).split("");

	var checkflag = false;
	for (var i = 0; i < splitvalue.length; i++) {
		if (splitvalue[i] == ".")
			checkflag = true;
	}
	var checkminusflag = false;
	for (var i = 0; i < splitvalue.length; i++) {
		if (splitvalue[i] == "-" || unicode == 45) {
			checkminusflag = true;
			minusflag = true;
			break;
		}
	}
	if (checkflag == false)
		dotflag = false;
	if (checkminusflag == false)
		minusflag = false;

	if (unicode != 8) {
		if (unicode == 46 && dotflag == false) {
			dotflag = true;
			return;
		} else if (unicode == 45 && minusflag == false) {
			minusflag = true;
			return;
		}
		if (unicode < 48 || unicode > 57)
			return false;
	}
};

/** @description Method will check text is valid or not. **/
function checkValidText(event) {
	var max = event.target.attributes.maxLength.nodeValue;
	var value = event.target.value + String.fromCharCode(event.which);
	if (max != "") {
		if (value.length <= max * 1)
			return true;
		else
			return false;
	} else
		return true;
};

/**
 * @function
 * @description It'll bootstrap the designer application after loading the bizviz-init file
 * */
function onLoadBizvizInit() {
	angular.bootstrap( document, [ "designer" ], {
	    strictDi: false
	} );
}

function initSession() {
    $( ".bvz-loader-container" ).hide();
}

function DesignerUtil() {};

/** @description getter Method of  InnerObjectbyString. **/
DesignerUtil.prototype.getInnerObjectbyString = function (o, s) {
	s = s.replace(/\[(\w+)\]/g, ".$1");
	s = s.replace(/^\./, "");
	var a = s.split(".");
	while (a.length) {
		var n = a.shift();
		if (n in o) {
			o = o[n];
		} else {
			return;
		}
	}
	return o;
};

/** @description Method will convert the JSON string to JSON Object. **/
DesignerUtil.prototype.ISJson = function (jsonValue) {
	try {
		var JSONdata = JSON.parse(jsonValue);
	} catch (error) {
		return jsonValue;
	}
	return JSONdata;
};

/** @description Method will return array of  SingleLengthJson. **/
DesignerUtil.prototype.getArrayOfSingleLengthJson = function (json) {
	if ($.isArray(json)) {
		return json;
	} else {
		return [json];
	}
};

/** @description Method will check a object in array if not then only push. **/
DesignerUtil.prototype.pushToArrayWithoutDuplicate = function (arr, attr, objToPush) {
	if (arr == undefined) {
		arr = [];
	}
	if (DesignerUtil.prototype.findInArray(arr, attr, objToPush[attr]) == undefined) {
		arr.push(objToPush);
	}
};

/** @description Method will delete an object from Array. **/
DesignerUtil.prototype.deleteFromArray = function (array, obj) {
	var index = array.indexOf(obj);
		array.splice(index, 1);
};

DesignerUtil.prototype.cleanArray = function (arr) {
	arr = $.grep(arr, function (n) {
			return (n);
		});
	return arr;
};

/** @description Method will check an element in array or not. **/
DesignerUtil.prototype.findInArray = function (arr, name, value) {
	if (arr != undefined) {
		var result = $.grep(arr, function (n) {
				var v = null;
				if (n && typeof(n) === "object") {
					v = n[name];
				}
				return (v == value);
			});
		if (result.length > 0) {
			return result[0];
		} else {
			return undefined;
		}
	}
	return undefined;
};

/** @description Method will return the index of an element in array. **/
DesignerUtil.prototype.findIndexInArray = function (arr, name, value) {
	var indexes = $.map(arr, function (obj, index) {
			if (obj[name] == value) {
				return index;
			}
		});
		if (indexes.length > 0) {
			return indexes[0];
		} else {
			return -1;
		}
};

/** @description Method will check a value in array or not. **/
DesignerUtil.prototype.findInArrayByValues = function (arr, name1, name2, value1, value2) {
	var result = $.grep(arr, function (n) {
			return (n[name1] == value1 && n[name2] == value2);
		});
	if (result.length > 0) {
		return result[0];
	} else {
		return undefined;
	}
};

/** @description Method will return the boolean value . **/
DesignerUtil.prototype.IsBoolean = function (value) {
	if (value === "true") {
		return true;
	} else if (value === "false") {
		return false;
	} else {
		return value;
	}
};
/** @description Method will return the array of unique values. **/
DesignerUtil.prototype.uniqueInArray = function (arr, value, attr) {
	arr = $.grep(arr, function (n) {
			if (n.attr == value) {
				return (n);
			}
		});
	return arr;
};

/** @description Method will convert XML to String and return . **/
DesignerUtil.prototype.XMLToString = function (oXML) {
	//code for IE
	if (window.ActiveXObject) {
		var oString = oXML.xml;
		return oString;
	}
	// code for Chrome, Safari, Firefox, Opera, etc.
	else {
		return (new XMLSerializer()).serializeToString(oXML);
	}
};

/** @description Method will convert String to XML and return . **/
DesignerUtil.prototype.StringToXML = function (oString) {
	//code for IE
	if (window.ActiveXObject) {
		var oXML = new ActiveXObject("Microsoft.XMLDOM");
		oXML.loadXML(oString);
		return oXML;
	}
	// code for Chrome, Safari, Firefox, Opera, etc.
	else {
		return (new DOMParser()).parseFromString(oString, "text/xml");
	}
};

/** @description Method will return true if charater is number else return false. **/
DesignerUtil.prototype.isNumberKey = function (evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode;
	//	if ( charCode > 31 && ( charCode < 48 || charCode > 57 ) )//Does not allow any other charecters excpet number
	if (charCode > 31 && (charCode != 46 && (charCode < 48 || charCode > 57))) //Does not allow any other charecters excpet number and decimal point
		return false;
	return true;
};

/** @description returns the array after removing null values from array **/
DesignerUtil.prototype.removeNullFromObjectsArray = function(arr) {
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
/** @description Method will return random Hexadecimal colocodes. **/
function getRandomHexColor() {
	// take it from json
	var designerFlatColors = ["#D24D57", "#F22613", "#D91E18", "#96281B", "#EF4836", "#D64541", "#C0392B", "#CF000F", "#E74C3C", "#DB0A5B",
		"#F64747", "#F1A9A0", "#D2527F", "#E08283", "#F62459", "#E26A6A", "#674172", "#AEA8D3", "#913D88", "#9A12B3",
		"#BF55EC", "#BE90D4", "#8E44AD", "#9B59B6", "#446CB3", "#E4F1FE", "#4183D7", "#59ABE3", "#81CFE0", "#52B3D9",
		"#C5EFF7", "#22A7F0", "#3498DB", "#2C3E50", "#19B5FE", "#336E7B", "#22313F", "#6BB9F0", "#1E8BC3", "#3A539B",
		"#1F3A93", "#89C4F4", "#4B77BE", "#5C97BF", "#4ECDC4", "#A2DED0", "#87D37C", "#90C695", "#26A65B", "#03C9A9",
		"#68C3A3", "#65C6BB", "#1BBC9B", "#1BA39C", "#66CC99", "#36D7B7", "#C8F7C5", "#86E2D5", "#2ECC71", "#16A085",
		"#3FC380", "#019875", "#03A678", "#4DAF7C", "#2ABB9B", "#00B16A", "#1E824C", "#049372", "#26C281", "#F5D76E",
		"#F7CA18", "#F4D03F", "#FDE3A7", "#F89406", "#EB9532", "#E87E04", "#F4B350", "#F2784B", "#EB974E", "#F5AB35",
		"#D35400", "#F39C12", "#F9690E", "#F9BF3B", "#F27935", "#E67E22", "#ECECEC", "#6C7A89", "#D2D7D3", "#EEEEEE",
		"#BDC3C7", "#ECF0F1", "#95A5A6", "#DADFE1", "#ABB7B7", "#F2F1EF", "#BFBFBF"];
	return designerFlatColors[Math.floor(Math.random() * designerFlatColors.length)];

	//return "#"+(Math.random()*0xFFFFFF<<0).toString(16);
};

/** @description Method will return the boolean value . **/
function IsBoolean(value) {
	if (value === "true") {
		return true;
	} else if (value === "false") {
		return false;
	} else {
		return value;
	}
};

/** @descriptionThis method will ignore the NEGATIVE SIGN and returns only MAGNITUDE of the data. **/
function _getMagnitude(_data) {
	return Math.abs(_data);
};

/** @description Method will initialize loader for designer. **/
function designerInitLoader() {
	$(document).ajaxStart(function () {
		$.blockUI({
			message : "<div class=\"la-ball-clip-rotate la-dark la-lg\"><div></div></div>",
			timeout : 10000,
			css : {
				zIndex : 9999999999,
				border : "none",
				top : "25%",
				background : "transparent"
			},
			overlayCSS : {
				backgroundColor : "#2dc3e8",
				opacity : 0.2,
				cursor : "wait",
				zIndex : 9999999999
			}
		});
	});
	$(document).ajaxStop($.unblockUI);
};

/** @description Method will return the date string based on system Date. **/
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

/** @description Method will convert the char from lowercase to uppercase. **/
String.prototype.initCap = function () {
	return this.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
		return m.toUpperCase();
	});
};

/** @description Method will return the formattedDateTime  . **/
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

/** @description Method will return the time zone. **/
function getZoneDate(d, tzOffset) {
	var nd = new Date();
	var offset = d.getTimezoneOffset() * 60 * 1000;
	tzOffset = tzOffset * 60 * 1000;
	nd.setTime(d.getTime() + offset + tzOffset);
	return nd;
};

/** @description Method will create and return Date string based on given format. **/
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

/** @description Method will return the Date separator symbol. **/
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
	}
	return seperatorSymbol;
};

/** @description Method will parse date element. **/
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
	}
	return retString;
};

/** @description Method will return the Month Name according to index. **/
function monthFromIndex(ind, fulllength, caps) {
	var month = "";
	switch (ind) {
	case 0:
		month = "January";
			break;
	case 1:
		month = "February";
			break;
	case 2:
		month = "March";
			break;
	case 3:
		month = "April";
			break;
	case 4:
		month = "May";
			break;
	case 5:
		month = "June";
			break;
	case 6:
		month = "July";
			break;
	case 7:
		month = "August";
			break;
	case 8:
		month = "September";
			break;
	case 9:
		month = "October";
			break;
	case 10:
		month = "November";
			break;
	case 11:
		month = "December";
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

/** @description Method will return the random characters. **/
function randomChar(n) {
	if (!n) {
		n = 5;
	}

	var text = "";
	var possible = "ABCDEFGHJKLMNPQRSTUVWXYZ";

	for (var i = 0; i < n; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
};

/** @description Method will return the  unique id generated with current time **/
function getIdWithTimeStamp(id) {
	return id + "" + getTimeStamp();
};

/** @description Method will return the formatted string based on Date & Time. **/
function getTimeStamp() {
	var date = new Date();
	return date.getUTCFullYear() + "" + date.getUTCMonth() + "" + date.getUTCDate() + "" + date.getUTCHours() + "" + date.getUTCMinutes() + "" + date.getUTCSeconds() + "" + date.getUTCMilliseconds();
};
function getNumericTimeStamp() {
	return new Date().getTime();
};
/** @description Method will return the Array Of SingleLengthJson. **/
function getArrayOfSingleLengthJson(json) {
	if ($.isArray(json)) {
		return json;
	} else {
		return [json];
	}
};

/** @description Getter Method of SelectionRange. **/
var getSelectionRange = function (element) {
	var
	startCharIndex = 0,
	endCharIndex = 0,
	nValue,
	range,
	tInputRange,
	length,
	endRange;

	if (typeof(element.selectionStart) == "number" &&
		typeof(element.selectionEnd) == "number") {

		startCharIndex = element.selectionStart;
		endCharIndex = element.selectionEnd;
	} else {
		range = document.selection.createRange();
		if (range && range.parentElement() == element) {
			length = element.value.length;
			nValue = element.value.replace(/\r\n/g, "\n");

			tInputRange = element.createTextRange();
			tInputRange.moveToBookmark(range.getBookmark());

			endRange = element.createTextRange();
			endRange.collapse(false);

			if (tInputRange.comareEndPints("StartToEnd", endRange) > -1) {
				startCharIndex = endCharIndex = length;
			} else {
				startCharIndex = -tInputRange.moveStart("character", -length);
				startCharIndex += nValue.slice(0, startCharIndex).split("\n").length - 1;

				if (tInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
					endCharIndex = length;
				} else {
					endCharIndex = -tInputRange.moveEnd("character", -length);
					endCharIndex += normalizedValue.slice(0, endCharIndex).split("\n").length - 1;
				}
			}
		}
	}

	return {
		startP : startCharIndex,
		endP : endCharIndex
	};
};

/** @description Method will replace the selected test. **/
var replaceSelectedText = function (element, text) {
	var sRange = getSelectionRange(element),
	val = element.value;
	element.value = val.slice(0, sRange.startP) + text + val.slice(sRange.endP);
};

/** @description Method used for  insert the Text At Cursor Position. **/
function insertTextAtCursorPos(textBoXId, valueToInsert) {
	//	  var cursorPos = $("#"+textBoXId).prop("selectionStart");
	//      var v = $("#"+textBoXId).val();
	//      var textBefore = v.substring(0,  cursorPos );
	//      var textAfter  = v.substring( cursorPos, v.length );
	//      $("#"+textBoXId).val( textBefore+ valueToInsert +textAfter );
	//
	replaceSelectedText($("#" + textBoXId)[0], valueToInsert);
	$("#" + textBoXId).focus();
	return $("#" + textBoXId).val();
};

/** @description method will convert  String To JSON . **/
function convertStringToJson(jsonString) {
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

/** @description method will return the indented JSON. **/
function getIndentJSON(json) {
	if (json)
		return JSON.stringify(json, null, "\t");
	else
		return json;
};

/** @description method for Custom Alert Messege **/
function showDesignerAlertMessage(_messageString, _container, _msgType) {
	var _textColor = "#000000";
	switch (_msgType) {
	case "success":
		_textColor = "green";
		break;
	case "error":
		_textColor = "red";
		break;
	default:
		_textColor = "#000000";
		break;
	}
	$(_container).empty().append(_messageString).css("color", _textColor);
	setTimeout(function () {
		$(_container).empty();
	}, 3000);
};

/** @description devtools-detect Detect if DevTools is open 
 * https://github.com/sindresorhus/devtools-detect by Sindre Sorhus MIT License * */
function checkDevToolStatus() {
	"use strict";
	var devtools = {
		open : false
	};
	var threshold = 160;
	var emitEvent = function (state) {
		window.dispatchEvent(new CustomEvent("devtoolschange", {
				detail : {
					open : state
				}
			}));
	};

	setInterval(function () {
		if ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || window.outerWidth - window.innerWidth > threshold ||
			window.outerHeight - window.innerHeight > threshold) {
			if (!devtools.open) {
				emitEvent(true);
			}
			devtools.open = true;
		} else {
			if (devtools.open) {
				emitEvent(false);
			}

			devtools.open = false;
		}
	}, 500);

	if (typeof module !== "undefined" && module.exports) {
		module.exports = devtools;
	} else {
		window.devtools = devtools;
	}
};

/** @description Method is used to check whether the console is open or not **/
function CheckSuspiciousUserActivity() {
	checkDevToolStatus();
	var devToolsOpenStatus = window.devtools.open;
	window.addEventListener("devtoolschange", function (e) {
		devToolsOpenStatus = e.detail.open;
		if (devToolsOpenStatus) {
			suspiciousUserActivityAction();
		}
	});
	if (devToolsOpenStatus) {
		suspiciousUserActivityAction();
	}
};

function suspiciousUserActivityAction() {
	alert("close the dev tool");
};



/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: MainMenu.js
 * @description  controls the contextmenu options on components
 * **/

var selectedItemInTree = "";
var clickedDashboardNodeId = "";
function setSelectedStylesInTree(elem, lock) {
	$(selectedItemInTree).removeClass("o-tree-active");
	$(selectedItemInTree).find(".ws-edit-opt").hide();
	$(selectedItemInTree).find(".ws-lock-opt").hide();

	$(elem).addClass("o-tree-active");
	if (!lock) {
		$(elem).find(".ws-edit-opt").show();
	} else {
		$(elem).find(".ws-lock-opt").show();
	}
	selectedItemInTree = elem;
}
function displayLockInWorkspaceTree() {
	if (selectedItemInTree != "") {
		$(selectedItemInTree).find(".ws-edit-opt").hide();
		$(selectedItemInTree).find(".ws-lock-opt").show();
	}
}
function hideLockInWorkspaceTree() {
	if (selectedItemInTree != "") {
		$(selectedItemInTree).find(".ws-edit-opt").show();
		$(selectedItemInTree).find(".ws-lock-opt").hide(); ;
	}
}
function pasteElementChange(changeTo) {
	$(".paste-element").attr("paste-to", changeTo)
}
(function ($, window) {
	window.$rOpenMenu = null;
	window.cxtMenuEnabled = true;
	$.fn.dContextMenu = function (config, callback) {
		var isMultiEleSelected = false,
		menuIndex = 0;
		return this.each(function () {
			$(this).off("contextmenu").on("contextmenu", function (event) {
				event.preventDefault();
				event.stopPropagation();
				isMultiEleSelected = callback();
				menuIndex = isMultiEleSelected ? 0 : 1;
				if (window.$rOpenMenu) {
					window.$rOpenMenu.hide();
				}
				if (config.menuSelector[menuIndex] == "#compCxtMenu" && 
				        angular.element($("body")).scope().modal.selectedComponentId != 
				            "BVZ" + event.currentTarget.id.split("BVZ")[1]) {
				    var portalTheme = angular.element($("body")).injector().get("ServiceFactory").AUTH_INFO.get("preferenceObject");
                    $( event.target ).closest( ".bizvizComponent"  ).click();
                    angular.element( $("body")).scope().initPropertyPalette(angular.element($("body")).scope().modal.selectedComponentId, false);
                    applyPropertyWindowColorScheme(portalTheme);
				}
				var 
				menuSelector = $( config.menuSelector[ menuIndex ] );
				if( window.cxtMenuEnabled || $( event.target ).hasClass( "draggablesParentDiv" ) ) {
				    window.$rOpenMenu = menuSelector.data( "invokedOn", 
				            menuSelector.show()
				            .css( {
				                position : "absolute",
				                left : getLeft( event ),
				                top : getTop( event )
				            } )
				    );
				}

				dContextMenuClickHandler();

				return false;
			});
			function dContextMenuClickHandler() {
				$(config.menuSelector[menuIndex]).off("click").on("click", function (event) {
					$(this).hide();
					var $invokedOn = $(this).data("invokedOn");
					var $selectedMenu = $(event.target);
					config.menuSelected.call($(this), $invokedOn, $selectedMenu);
				});
			}

		});
		function getLeft(event) {
			var mouseX = event.pageX;
			var pageWidth = $(config.containment).width();
			var x = $(config.containment);
			var menuWidth = $(config.menuSelector[menuIndex]).width();

			if (mouseX + menuWidth > pageWidth && mouseX > menuWidth) {
				return mouseX - menuWidth;
			} else
				return mouseX;
		}
		function getTop(event) {
			var mouseY = event.pageY;
			var pageHeight = $(config.containment).height();
			var menuHeight = $(config.menuSelector[menuIndex]).height();

			if (mouseY + menuHeight > pageHeight && mouseY > menuHeight) {
				return mouseY - menuHeight - 10;
			} else
				return mouseY;
		}
	};
})(jQuery, window);