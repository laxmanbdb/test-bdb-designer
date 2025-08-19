/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: DatePicker.js
 * @description DatePicker
 **/
function DatePicker(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();

	this.m_description = "";
	this.m_fontweight = "";
	this.m_textalign = "";

	this.m_virtualdatafield = "";
	this.m_datarownumber = "";
	this.m_virtualdataid = "";

	this.m_labelfontfamily = "";
	this.m_globalkey = "";
	this.m_yearnavigationenabled = "false";
	this.m_opencalendarenabled = false;
	this.m_monthnavigationenabled =false;
	this.m_showothermonthdate = false;
	this.m_outputformat = "";
	this.m_textdecoration = "";
	this.m_labeltextdecoration = "";
	this.m_fontfamily = "";
	this.m_chromecolor = "";
	this.m_rollovercolor = "";
	this.m_color = "";
	this.m_backgroundcolor = "#dddddd";
	this.m_selectioncolor = "";
	this.m_labelfontsize = "";
	this.m_fontsize = "";
	this.m_labelfontstyle = "";
	this.m_fontstyle = "";
	this.m_defaultdate = "";
	this.m_yearrange = "10";

	this.m_formatstring = "";
	this.m_labelcolor = "";
	this.m_objectID = [];
	this.m_fieldname = "";
	this.m_fieldNameValueMap = new Object();
	this.dateValue = "";

	this.m_fromdate = "";
	this.m_todate = "";
	this.m_enabledaterange = false;
	this.selectedDate = "";
	this.userString = "";

	this.m_requiredFormateFlag = false;

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;

	this.m_objectID = [];
	this.m_componentid = "";
	this.m_defaultdatesmap = {};
	this.m_panelbgcolor = "#FFFFFF";
	this.m_cursortype = "pointer";
	this.m_enhanceddate = false;
	this.m_datetype = "";
	this.m_startdatecolor = "#000000";
	this.m_enddatecolor = "#000000";
	this.m_associatecomp ="";
	this.m_startseleteddate ="";
	this.m_endseleteddate ="";
	this.m_nodefaultdate = false;
	this.m_pretext = "";
	this.associatecompselecteddate = "";
};

/** @description Using prototype inheriting the variable and method of Widget into DatePicker. **/
DatePicker.prototype = new Widget();

/** @description This method will parse the chart JSON and create a container **/
DatePicker.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
DatePicker.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "DateSelector") {
			for (var labelKey in jsonObject[key]) {
				this.setAttributeValueToNode(labelKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

/** @description Getter method for Field Name **/
DatePicker.prototype.getFieldName = function () {
	return this.m_fieldname;
};

/** @description Canvas Initialization **/
DatePicker.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description Creating Draggable Div and Canvas **/
DatePicker.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
};

/** @description Creating component ID **/
DatePicker.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "datePickerDiv" + this.m_objectid;
};

/** @description Setting DataProvider and required Data formate date and default date **/
DatePicker.prototype.setDataProvider = function (date) {
	this.userString = date;
	var rqdFormateDate = this.parseDateString(date);
	this.m_defaultdate = rqdFormateDate;
};

/** @description Parse the date string into required format **/
DatePicker.prototype.parseDateString = function (dateString) {
	var requiredForamte = "";
	var index = -1;
	var splitCharacter = "";
	if (dateString.indexOf("-") != index)
		splitCharacter = "-";

	if (dateString.indexOf("/") != index)
		splitCharacter = "/";

	if (splitCharacter != "")
		requiredForamte = this.requiredFormateDate(dateString, splitCharacter);
	return requiredForamte;
};

/** @description Getter Method for required format date. **/
DatePicker.prototype.requiredFormateDate = function (comingdate, sign) {
	var strArray = comingdate.split(sign);
	var dateFormatArr = this.m_formatstring.split(sign); //Added for resolve dd<12 dateformat issue 
	var dayPosition = "";
	var monthPosition = "";
	var yearPosition = "";
	var str = "";
	if (strArray.length == 3) {
		for (var i = 0; i < strArray.length; i++) {
			if (strArray[i] * 1 > 1000) {
				yearPosition = i * 1;
			} else if (dateFormatArr[i] == "dd" || strArray[i] * 1 > 12) {
				dayPosition = i * 1;
			} else if (strArray[i] * 1 <= 12) {
				if (monthPosition === "")
					monthPosition = i * 1;
				else
					dayPosition = i * 1;
			}else{
				// Do nothing
			}
		}
	}
	if (strArray.length == 3)
		str = strArray[monthPosition] + sign + strArray[dayPosition] + sign + strArray[yearPosition];
	return str;
};

/** @description Getter Method for Formatted date.**/
DatePicker.prototype.getFormattedDate = function (dateString, dateFormate) {
	var year, arr;
	switch (dateFormate) {
	case "dd-mm-yy":
		arr = dateString.indexOf("-") > 0 ? dateString.split("-") : dateString.split("/");
		year = (arr[2].length == 4) ? arr[2] : getFullYear(arr[2]);
		return arr[1] + "-" + arr[0] + "-" + year;
	case "dd-yy-mm":
		arr = dateString.indexOf("-") > 0 ? dateString.split("-") : dateString.split("/");
		year = (arr[1].length == 4) ? arr[1] : getFullYear(arr[1]);
		return arr[2] + "-" + arr[0] + "-" + year;
	case "mm-dd-yy":
		arr = dateString.indexOf("-") > 0 ? dateString.split("-") : dateString.split("/");
		year = (arr[2].length == 4) ? arr[2] : getFullYear(arr[2]);
		return arr[0] + "-" + arr[1] + "-" + year;
	case "mm-yy-dd":
		arr = dateString.indexOf("-") > 0 ? dateString.split("-") : dateString.split("/");
		year = (arr[1].length == 4) ? arr[1] : getFullYear(arr[1]);
		return arr[0] + "-" + arr[2] + "-" + year;
	case "yy-dd-mm":
		arr = dateString.indexOf("-") > 0 ? dateString.split("-") : dateString.split("/");
		year = (arr[0].length == 4) ? arr[0] : getFullYear(arr[0]);
		return arr[2] + "-" + arr[1] + "-" + year;
	case "yy-mm-dd":
		arr = dateString.indexOf("-") > 0 ? dateString.split("-") : dateString.split("/");
		year = (arr[0].length == 4) ? arr[0] : getFullYear(arr[0]);
		return arr[1] + "-" + arr[2] + "-" + year;
	case "dd/mm/yy":
		arr = dateString.indexOf("-") > 0 ? dateString.split("-") : dateString.split("/");
		year = (arr[2].length == 4) ? arr[2] : getFullYear(arr[2]);
		return arr[1] + "/" + arr[0] + "/" + year;
	case "dd/yy/mm":
		arr = dateString.indexOf("-") > 0 ? dateString.split("-") : dateString.split("/");
		year = (arr[1].length == 4) ? arr[1] : getFullYear(arr[1]);
		return arr[2] + "/" + arr[0] + "/" + year;
	case "mm/dd/yy":
		arr = dateString.indexOf("-") > 0 ? dateString.split("-") : dateString.split("/");
		year = (arr[2].length == 4) ? arr[2] : getFullYear(arr[2]);
		return arr[0] + "/" + arr[1] + "/" + year;
	case "mm/yy/dd":
		arr = dateString.indexOf("-") > 0 ? dateString.split("-") : dateString.split("/");
		year = (arr[1].length == 4) ? arr[1] : getFullYear(arr[1]);
		return arr[0] + "/" + arr[2] + "/" + year;
	case "yy/dd/mm":
		arr = dateString.indexOf("-") > 0 ? dateString.split("-") : dateString.split("/");
		year = (arr[0].length == 4) ? arr[0] : getFullYear(arr[0]);
		return arr[2] + "/" + arr[1] + "/" + year;
	case "yy/mm/dd":
		arr = dateString.indexOf("-") > 0 ? dateString.split("-") : dateString.split("/");
		year = (arr[0].length == 4) ? arr[0] : getFullYear(arr[0]);
		return arr[1] + "/" + arr[2] + "/" + year;
	case "yyyy-mm-ddThh:mm:ss.sss-hh.mm":
		return dateString;
	case "yyyy-mm-ddThh:mm:ss.sss":
		return dateString;
	default:
		return dateString;
	}
};

/** @description Getter Method for DataProvider and required date **/
DatePicker.prototype.getDataProvider = function () {
	return (this.selectedDate == "") ? new Date() : this.selectedDate;
};

/** @description Setter Method for Target value. **/
DatePicker.prototype.setTargetValue = function (dateformate) {
	var str = (dateformate.indexOf("-") > 0) ? dateformate.split("-") : dateformate.split("/");
	if (str.length == 3) {
		this.m_requiredFormateFlag = true;
		this.m_formatstring = this.updateFormateAccordingToUpdate(dateformate);
	}
};

/** @description Getter Method For target value. **/
DatePicker.prototype.getTargetValue = function () {
	return this.m_formatstring;
};

/** @description Will return the update format according to the date. **/
DatePicker.prototype.updateFormateAccordingToUpdate = function (Formate) {
	var str = Formate;
	str = (str.toLowerCase()).replace("yyyy", "yy");
	return str;
};

/** @description Starting of Date Picker Drawing **/
DatePicker.prototype.draw = function () {
	this.drawObject();
};

/** @description Calling init and drawChart function **/
DatePicker.prototype.drawObject = function () {
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback!="")
		onAfterRender(this.m_onafterrendercallback);
};

/** @description Date Picker initialization **/
DatePicker.prototype.init = function () {
	this.m_chromecolor = convertColorToHex(this.m_chromecolor);
	this.m_rollovercolor = convertColorToHex(this.m_rollovercolor);
	this.m_color = convertColorToHex(this.m_color);
	this.m_selectioncolor = convertColorToHex(this.m_selectioncolor);
	this.setDateWithFormate();
	this.m_requiredFormateFlag = false;
};

/** @description Setter Method for date with format. **/
DatePicker.prototype.setDateWithFormate = function () {
	if (IsBoolean(this.m_requiredFormateFlag)) {
		if (this.userString != "" && this.m_formatstring != "")
			this.m_defaultdate = this.getFormattedDate(this.userString, this.m_formatstring);
	}
	return;
};

/** @description Getter Method for value if global variable. **/
DatePicker.prototype.getTextValueFromGlobalVariable = function () {
	var str = this.m_text;
	var key = this.m_text;
	var re = /\[(.*?)\]/g;
	for (var m = re.exec(key); m; m = re.exec(key)) {
		if (this.m_dashboard != "" && this.m_dashboard.getGlobalVariable() != "") {
			var globalVarValue = this.m_dashboard.getGlobalVariable().getFieldValue(m[1]);
			str = str.replace(m[0], globalVarValue);
		}
	}
	return str;
};

/** @description Drawing of DatePicker. **/
DatePicker.prototype.drawChart = function () {
	var temp = this;
	if (IsBoolean(this.m_isActive)) {
		//DAS-772 showing message when date is not associated .
		if((temp.m_datetype == "start" || temp.m_datetype == "end") && temp.m_associatecomp == ""  && !IsBoolean(this.m_designMode)){
			this.drawMessage("No associated date available");
		}else{
			this.drawDatePicker();
		}
		
	}
};

/** @description Drawing of Date Picker. **/ 
DatePicker.prototype.drawDatePicker = function () {
	this.drawDatePickerDiv();
	this.drawDatePickerWidget();
};
DatePicker.prototype.removeMessage = function () {
	var temp = this;
	$("#StatusMsg"+temp.m_objectid).remove();
};
/** Calls the drawObject of various filter and then render call back **/
/** @description method use for draw the message. **/
DatePicker.prototype.drawMessage = function (message) {
	var temp = this;
	temp.removeMessage();
	var div = document.createElement("div");
	div.id = "StatusMsg"+temp.m_objectid;
	div.style.position = "absolute";
	div.style.fontSize =  this.fontScaling( this.m_statusfontsize )+"px";
	div.style.fontFamily = selectGlobalFont(this.m_statusfontfamily);
	div.style.color = this.m_statuscolor;
	div.style.width ="100%";
	div.style.height = "100%";
	div.style.lineHeight = this.m_height+"px";
	div.style.textAlign = "center";
	div.style.verticalAlign = "middle";
	div.innerHTML = message;
	$("#draggableDiv" + temp.m_objectid).css("background", convertColorToHex(this.m_backgroundcolor));
	$("#draggableDiv" + temp.m_objectid).append(div);
};
/** @description Drawing of DatePicker Div. **/
DatePicker.prototype.drawDatePickerDiv = function () {
	var temp = this;
	temp.m_left = temp.m_left * 1;
	temp.m_top = temp.m_top * 1;
	if ($("#" + temp.m_componentid) != null){
		$("#" + temp.m_componentid).remove();
	}

	var datePickerDiv = document.createElement("div");
	datePickerDiv.setAttribute("id", temp.m_componentid);
	datePickerDiv.setAttribute("class", "date");
	datePickerDiv.style.position = "absolute";
	datePickerDiv.style.width = this.m_width + "px";
	datePickerDiv.style.height = this.m_height + "px";
	var input = document.createElement("input");
	input.setAttribute("id", "input" + this.m_componentid);
	if (!this.m_designMode) {
		input.style.width = (this.m_width * 1) + "px";
		input.style.height = (this.m_height * 1) + "px";
	} else {
		input.style.width = this.m_width + "px";
		input.style.height = this.m_height + "px";
	}
	input.style.margin = "0px";
	input.style.border = "1px solid #c2c2c2";
	input.style.display = "block";
	input.style.outline = "none";
	input.setAttribute("readonly", "true");
	var padding = ((this.m_height - this.fontScaling(this.m_fontsize * 1) * 1.5)/2);
	input.style.padding = "0px 3px";
	//padding+"px 2px "+padding+"px 2px";
	input.style.cursor = this.m_cursortype;
	input.style.font = this.m_fontstyle + " " + this.m_fontweight + " " + this.fontScaling(this.m_fontsize * 1) + "px " + selectGlobalFont(this.m_fontfamily);
	input.style.textAlign = this.m_textalign;
	input.style.color = this.m_color;
	input.style.textDecoration = this.m_textdecoration;
	if(IsBoolean(temp.m_enhanceddate)){
		input.style.outline = "none";
	
		$(input).css({
			"margin": "0px",
			"border": "0px solid transparent",
			"display": "block",
			"padding": "10px 14px",
			"cursor": "pointer",
			//"background-color": "rgba(0, 0, 0, 0.05)",
			"background-color": convertColorToHex(temp.m_backgroundcolor),
		});
		$(input).hover(
				function () {
					$(this).css({
						"background": "rgba(0,0,0,0.1)"
					});
				},
				function () {
					$(this).css({
						//"background": "rgba(0,0,0,0.05)"
						"background": convertColorToHex(temp.m_backgroundcolor),
					});
				});
	}
	
	datePickerDiv.appendChild(input);	
	var dashboardwidth = this.m_chartContainer[0].offsetWidth;
	var dashboardHeight = this.m_chartContainer[0].scrollHeight;

   /* if (IsBoolean(temp.m_opencalendarenabled)) {
    $(document).ready(function() {
        $("#input" + temp.m_componentid).datepicker('show');
    });
    }*/
    
	if (!this.m_designMode) {
		/*input.onclick = function () {
			$("#ui-datepicker-div").css({
				"width":"350px",
				"display": "block",
				"left":temp.m_left,
				"border-radius": "4px",
				"z-index":"99999",
				"background": temp.m_panelbgcolor
			});*/
		/**commented above function for fixing the positioning issue, after changing the container of datepicker div from body to dashboard parent**/
		/*
		input.onmousedown = function () {
			var parentDiv = (temp.m_objecttype == "gauge" || temp.m_objecttype == "semigauge") ? document.body : document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
		    var scrollLeft = parentDiv.scrollLeft;
		    var scrollTop = parentDiv.scrollTop;
		    var offset = $(parentDiv).offset();
		    var PageTop = offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
		    var PageLeft = offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft;
		    var height = $('#ui-datepicker-div').outerHeight();

			$(document.body).append($('#ui-datepicker-div'));
			//CP-1013
			temp.checkWindowResize($('#ui-datepicker-div'));
			if(temp.m_dashboard.m_AbsoluteLayout.m_layouttype == 'AbsoluteLayout'){
				$("#ui-datepicker-div").css({
					"width":"350px",
					"display": "block",
					"left":temp.m_left + PageLeft,
					"top": temp.m_top + (temp.m_height*1) + PageTop,
					"border-radius": "4px",
					"z-index":"99999",
					"background": temp.m_panelbgcolor,
					"box-shadow": "rgb(0 0 0 / 12%) 0px 8px 16px 0px",
				});
				if ((dashboardwidth - 350) < (temp.m_left + PageLeft)) {
				    var left = (temp.m_left + PageLeft) - (350 - temp.m_width);
				    $("#ui-datepicker-div").css({
				        "left": left,
				    });
				};
				if ((temp.m_top + (temp.m_height * 1) + PageTop) > (dashboardHeight - height)) {
				    var top = temp.m_top - height;
				    $("#ui-datepicker-div").css({
				        "top": top,
				        "box-shadow": "rgb(0 0 0 / 12%) 0px -8px 16px 0px",
				    });
				};
			} else {
				$("#ui-datepicker-div").css({
					"width":"300px",
					"display": "block",
					"left":temp.m_left + PageLeft,
					"top": temp.m_top + (temp.m_height*1) + PageTop,
					"border-radius": "4px",
					"z-index":"99999",
					"background": temp.m_panelbgcolor,
					"box-shadow": "rgb(0 0 0 / 12%) 0px 8px 16px 0px",
				});
				if ((dashboardwidth - 300) < (temp.m_left + PageLeft)) {
				    var left = (temp.m_left + PageLeft) - (300 - temp.m_width);
				    if(left>0){
						$("#ui-datepicker-div").css({
					        "left": left,
					    });
					}
				};
				if ((temp.m_top + (temp.m_height * 1) + PageTop) > (dashboardHeight - height)) {
				    var top = temp.m_top - height;
				    $("#ui-datepicker-div").css({
				        "top": top,
				        "box-shadow": "rgb(0 0 0 / 12%) 0px -8px 16px 0px",
				    });
				};
			}
			//if(IsBoolean(!temp.m_enhanceddate) || temp.m_enhanceddate == undefined)
			//temp.setCss();
			//else
			//temp.setnewCss();
		};*/
		input.onmouseup = function () {
			var parentDiv = (temp.m_objecttype == "gauge" || temp.m_objecttype == "semigauge") ? document.body : document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
		    var scrollLeft = parentDiv.scrollLeft;
		    var scrollTop = parentDiv.scrollTop;
		    var offset = $(parentDiv).offset();
		    var PageTop = offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
		    var PageLeft = offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft;
		    var height = $('#ui-datepicker-div').outerHeight();
		    var width = $('#ui-datepicker-div').outerWidth();
		    $(document.body).append($('#ui-datepicker-div'));
		    
		    var left= temp.m_left+PageLeft;
		    
		    if($("#draggableDiv" + temp.m_objectId).css("position")=="fixed")
				left=temp.m_left+PageLeft;				
		    /*DAS-772 Fonts and color are not matching with dashboard.*/
			$(".ui-datepicker-month").css({
				"font-family": temp.m_fontfamily,
				"color":temp.m_color
			})
			$(".ui-datepicker-year").css({
				"font-family": temp.m_fontfamily,
				"color":temp.m_color
			})
			$(".ui-datepicker-calendar").find("th").find("span").css({
				"font-family": temp.m_fontfamily,
				"color":temp.m_color
			})
		
			$(".ui-state-default").each(function() {
				if ($(this).hasClass("ui-state-active")) {
					this.style.setProperty('color', 'white', 'important');
				} else {
					this.style.setProperty('color', `${temp.m_color}`, 'important');
				}
				this.style.setProperty('font-family', `${temp.m_fontfamily}`, 'important');
			});
				
			/*DAS-772 Adding start and end range circle color*/
			if (temp.m_datetype != "none") {
				var startDateElement = $("td.ui-state-startdate").find("a.ui-state-default")[0];
				var endDateElement = $("td.ui-state-enddate").find("a.ui-state-default")[0];

				if (temp.m_datetype == "start") {
					if (startDateElement) {
						startDateElement.style.cssText = `background:${temp.m_startdatecolor} !important;`;
					}
					if (endDateElement) {
						endDateElement.style.cssText = `background:${temp.m_enddatecolor} !important;`;
					}
				} else {
					if (endDateElement) {
						endDateElement.style.cssText = `background:${temp.m_enddatecolor} !important;`;
					}
					if (startDateElement) {
						startDateElement.style.cssText = `background:${temp.m_startdatecolor} !important;`;
				}
				}
			}
			
			if(temp.m_dashboard.m_AbsoluteLayout.m_layouttype == 'AbsoluteLayout'){
				$("#ui-datepicker-div").css({
					"width":"350px",
					"display": "block",
					"left":left,
					//"top": temp.m_top + (temp.m_height*1) + (PageTop*1),
					"border-radius": "4px",
					"z-index":"99999",
					"background": temp.m_panelbgcolor
				});
				if ((dashboardwidth - 350) < (temp.m_left + PageLeft)) {
				    left = left - (350 - temp.m_width);
				    $("#ui-datepicker-div").css({
				        "left": left,
				    });
				};
				if ((temp.m_top + (temp.m_height * 1) + PageTop) > (dashboardHeight - height)) {
				    var top = temp.m_top - height;
				    $("#ui-datepicker-div").css({
				        "top": top,
				        "box-shadow": "rgb(0 0 0 / 12%) 0px -8px 16px 0px",
				    });
				};
			} else if (temp.m_dashboard.m_AbsoluteLayout.m_layouttype == 'MobileLayout') {
				//DAS-1101 MOBILE VIEW - DATE PICKER - CALENDER POP UP POSITION IS NOT PROPER.
				$("#ui-datepicker-div").css({
					"width": "300px",
					"display": "block",
					"left": (PageLeft * 1) + 10,
					"top": top,
					"border-radius": "4px",
					"z-index": "99999",
					"background": temp.m_panelbgcolor
				});
				if ((dashboardwidth) < (temp.m_left + temp.m_width)) {
				    left = ((left  + temp.m_width) - width);
				    $("#ui-datepicker-div").css({
				        "left": left,
				    });
				};
				// Get the offset and height of the input field
				var	inputOffset = $(input).offset();             
				var inputHeight = $(input).outerHeight()// Calculate available space
				var windowHeight = $(window).height();             
				var scrollTop = $(window).scrollTop();             
				var bottomSpace = (windowHeight - (inputOffset.top - scrollTop) - inputHeight)-35;             
				var topSpace = inputOffset.top - scrollTop;// Check available space above and below input and position popup
				if (bottomSpace < height && topSpace > bottomSpace) {                 
					// More space above than below, position above                
					$("#ui-datepicker-div").css({
						top: inputOffset.top - height,
					});
				} else {
					// More space below or equal, position below 
					$("#ui-datepicker-div").css({
						top: inputOffset.top + inputHeight,
					});
				}
			} else {
				$("#ui-datepicker-div").css({
					"width": "300px",
					"display": "block",
					/*"left":(PageLeft*1) + 10,*/
					"left": left,
					"top": top,
					"border-radius": "4px",
					"z-index": "99999",
					"background": temp.m_panelbgcolor
				});
				//DAS-1101 Tab View - Date picker - Calender pop up position is not proper.
				// Get the offset and height of the input field
				var	inputOffset = $(input).offset();             
				var inputHeight = $(input).outerHeight()// Calculate available space
				var windowHeight = $(window).height();             
				var scrollTop = $(window).scrollTop();             
				var bottomSpace = (windowHeight - (inputOffset.top - scrollTop) - inputHeight)-35;             
				var topSpace = inputOffset.top - scrollTop;// Check available space above and below input and position popup
				if (bottomSpace < height && topSpace > bottomSpace) {                 
					// More space above than below, position above                
					$("#ui-datepicker-div").css({
						top: inputOffset.top - height,
					});
				} else {
					// More space below or equal, position below 
					$("#ui-datepicker-div").css({
						top: inputOffset.top + inputHeight,
					});
				}
				if ((dashboardwidth) < (temp.m_left + PageLeft)) {
					left = ((left + temp.m_width) - width);
					$("#ui-datepicker-div").css({
						"left": left,
					});
				};
			};
			
			//if(IsBoolean(!temp.m_enhanceddate) || temp.m_enhanceddate == undefined)
			//temp.setCss();
			//else
			//temp.setnewCss();
		};
	}
	input.oncontextmenu = function () {
		$("#ui-datepicker-div").css("display", "none");
	};

	$("#draggableDiv" + temp.m_objectid).append(datePickerDiv);
	$("#draggableDiv" + temp.m_objectid).css("border-radius", "4px");
};

/** @description Drawing of DatePicker with its all option and set all property. **/
DatePicker.prototype.drawDatePickerWidget = function () {
	var temp = this;
	var formattedText = "";
	if(this.m_startseleteddate !== ""){
		this.m_todate = this.m_startseleteddate;
	}
	if(this.m_endseleteddate !== ""){
		this.m_fromdate = this.m_endseleteddate;
	} 
	temp.m_defaultdatesmap = {}; // Added to remove default date when selecting new date
	var defaultDate = new Date();
	defaultDate.setHours(0,0,0,0); 
	if (this.m_defaultdate == "") {
		if(IsBoolean(this.m_nodefaultdate)) {
			var nodeafaultdate = '';
			formattedText = $.datepicker.formatDate(temp.m_formatstring, nodeafaultdate);
		} else {
			formattedText = $.datepicker.formatDate(temp.m_formatstring, defaultDate);
		}
	} else {
		var strdate = this.m_defaultdate;
		strdate = strdate.replace(/-/g, "/");
		defaultDate = new Date(strdate);
		defaultDate.setHours(0,0,0,0);
		formattedText = $.datepicker.formatDate(temp.m_formatstring, defaultDate);
	}
	formattedText = (this.m_pretext !=="") ? this.m_pretext + formattedText : formattedText;
	//this.selectedDate = defaultDate;
	this.selectedDate = IsBoolean(this.m_nodefaultdate) ? "":defaultDate;
	$("#input" + temp.m_componentid)[0].value = formattedText;

	this.minDateValue = "";
	this.maxDateValue = "";

	var currentDate = (this.m_defaultdate != "") ? this.m_defaultdate : defaultDate;
	var calMinDate = new Date(currentDate);
	var calMaxDate = new Date(currentDate);
	  
	if (IsBoolean(this.m_enabledaterange) && this.m_todate !== "" && this.m_fromdate !== ""){
		if(this.m_todate != "" && this.m_fromdate != "") {
			this.minDateValue = new Date(this.m_todate);
			this.maxDateValue = new Date(this.m_fromdate);
		}
		if (this.m_todate == "" && this.m_fromdate != "") {
			this.minDateValue = defaultDate;
			this.maxDateValue = new Date(this.m_fromdate);
		}
		if (this.m_fromdate == "" && this.m_todate != "") {
			this.minDateValue = new Date(this.m_todate);
			this.maxDateValue = defaultDate;
		}
		/** Below line commented to resolved default date selection issue (Default date and selected date should be same. @BDD-650)*/
		//defaultDate = (defaultDate < this.minDateValue) ? this.maxDateValue : (defaultDate > this.maxDateValue) ? this.minDateValue : defaultDate ;
		calMinDate = this.minDateValue;
		calMaxDate = this.maxDateValue;
	}else {
		if(this.m_yearrange*1<0 || isNaN(this.m_yearrange*1) || this.m_yearrange*1 == undefined || this.m_yearrange == "")
			this.m_yearrange = 0;
		var minYear = (this.m_yearrange*1 % 2 == 0 && this.m_yearrange*1 !== 0) ? (this.m_yearrange / 2 )  : parseInt(this.m_yearrange / 2) ;
		var maxYear = (this.m_yearrange*1 % 2 == 0) ? this.m_yearrange / 2 : (this.m_yearrange*1 == 1) ? 1 : parseInt(this.m_yearrange / 2) ;
		var bottomYr = calMinDate.getFullYear() - minYear;
		var topYr = calMaxDate.getFullYear() + maxYear;
		// 2016 - 100,2000,2016,4000
		if((calMinDate.getFullYear()-minYear) < 100){
			var newMinYear = calMinDate.getFullYear()-100;
			var additionalyrs = (this.m_yearrange - calMinDate.getFullYear() + 100);
			bottomYr = calMinDate.getFullYear() - newMinYear;
			topYr = calMaxDate.getFullYear() + additionalyrs;
			topYr = (topYr>9999)?9999:topYr;
		}
		calMinDate.setFullYear(bottomYr);
		calMaxDate.setFullYear(topYr);
		this.minDateValue = calMinDate;
		this.maxDateValue = calMaxDate;
	}
	calMinDate.setHours(0,0,0,0);
	calMinDate.setHours(0,0,0,0);
	this.minDateValue = calMinDate;
	this.maxDateValue = calMaxDate;

	this.m_yearnavigationenabled = IsBoolean(this.m_yearnavigationenabled);
	if(IsBoolean(this.m_nodefaultdate)){
		this.m_defaultdatesmap = {};
	} else {
		this.m_defaultdatesmap[ new Date(defaultDate.getFullYear(), defaultDate.getMonth(), defaultDate.getDate()) ] = new Date(defaultDate.getFullYear(), defaultDate.getMonth(), defaultDate.getDate());
	}
	/*if(this.m_associatecomp !==""){
		this.associatecompselecteddate = sdk.getWidget(this.m_associatecomp).selectedDate;
	}	*/
	$("#input" + temp.m_componentid).datepicker({
		dateFormat: temp.m_formatstring,
		onSelect: function(dateText, inst) {
			/*DAS-1093 Start date shouldn't be more than end date and vice versa*/
			var date = $.datepicker.parseDate(inst.settings.dateFormat || $.datepicker._defaults.dateFormat, dateText, inst.settings);

			// If this is the start date picker and the selected date is after the end date, reset the selection.
			if (temp.m_datetype === "start" && temp.associatecompselecteddate) {
				if (date > temp.associatecompselecteddate) {
					alertPopUpModal({
                                type: "error",
                                message: "Start date cannot be greater than the end date ",
                                timeout: '3000'
                            });
					$(this).datepicker('setDate', temp.selectedDate); // Reset the date to the last valid one
					return;
				}
			}

			// If this is the end date picker and the selected date is before the start date, reset the selection.
			if (temp.m_datetype === "end" && temp.associatecompselecteddate) {
				if (date < temp.associatecompselecteddate) {
					alertPopUpModal({
                                type: "error",
                                message: "End date cannot be lesser than the start date",
                                timeout: '3000'
                            });
					$(this).datepicker('setDate', temp.selectedDate); // Reset the date to the last valid one
					return;
				}
			}

			temp.m_defaultdatesmap = {}; // Reset the default date map when a new date is selected
			var outformat = $.datepicker.formatDate(temp.m_outputformat, date, inst.settings);

			if (!IsBoolean(temp.m_designMode)) {
				temp.getDataPointAndUpdateGlobalVariable(outformat, date);
			}

			// Update the selectedDate with the current selected date.
			temp.selectedDate = date;
		},
		onChangeMonthYear : function () {
			setTimeout(function () {
				/*if(IsBoolean(!temp.m_enhanceddate) || temp.m_enhanceddate == undefined)
				temp.setCss();
				else
				temp.setnewCss();*/
				/*DAS-772 Fonts and color are not matching with dashboard.*/
				$(".ui-datepicker-month").css({
					"font-family": temp.m_fontfamily,
					"color":temp.m_color
				})
				$(".ui-datepicker-calendar").find("th").find("span").css({
					"font-family": temp.m_fontfamily,
					"color":temp.m_color
				})
				$(".ui-datepicker-year").css({
					"font-family": temp.m_fontfamily,
					"color": temp.m_color
				})
				$(".ui-state-default").each(function() {
					if ($(this).hasClass("ui-state-active")) {
						this.style.setProperty('color', 'white', 'important');
					} else {
						this.style.setProperty('color', `${temp.m_color}`, 'important');
					}
					this.style.setProperty('font-family', `${temp.m_fontfamily}`, 'important');
				});
				/*DAS-772 Adding start and end range circle color*/
				if (temp.m_datetype != "none") {
					var startDateElement = $("td.ui-state-startdate").find("a.ui-state-default")[0];
					var endDateElement = $("td.ui-state-enddate").find("a.ui-state-default")[0];

					if (temp.m_datetype == "start") {
						if (startDateElement) {
							startDateElement.style.cssText = `background:${temp.m_startdatecolor} !important;`;
						}
						if (endDateElement) {
							endDateElement.style.cssText = `background:${temp.m_enddatecolor} !important;`;
					}
					} else {
						if (endDateElement) {
							endDateElement.style.cssText = `background:${temp.m_enddatecolor} !important;`;
						}
						if (startDateElement) {
							startDateElement.style.cssText = `background:${temp.m_startdatecolor} !important;`;
					}
					}
				}
				var parentDiv = (temp.m_objecttype == "gauge" || temp.m_objecttype == "semigauge") ? document.body : document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
		    	var offset = $(parentDiv).offset();
		    	var PageTop = offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
				var height = $('#ui-datepicker-div').outerHeight();
				var dashboardHeight = temp.m_chartContainer[0].offsetHeight;
				if ((temp.m_top + (temp.m_height * 1)) > (dashboardHeight - height)) {
				    var top = temp.m_top - height + PageTop;
				    $("#ui-datepicker-div").css({
				        "top": top,
				        "box-shadow": "rgb(0 0 0 / 12%) 0px -8px 16px 0px",
				    });
				};
			},0.3);
		},
		beforeShowDay: function(date) {
			//$('#WatermarkDiv').append($('#ui-datepicker-div'));
			//$('.draggablesParentDiv').append($('#ui-datepicker-div'));
	        var highlight = temp.m_defaultdatesmap[date];
	        var sm = (date.getDate() <= 9) ? " ui-state-startdate-middle":" ui-state-startdate-middle2",
	        em = (date.getDate() <= 9) ? " ui-state-enddate-middle" : " ui-state-enddate-middle2";
	        if(temp.m_associatecomp !==""){
	    		temp.associatecompselecteddate = sdk.getWidget(temp.m_associatecomp).selectedDate;
	    	}	
	    	//DAS-772 showing message when date is not associated 
	        if (highlight && temp.associatecompselecteddate !="") {
			
	        	if(temp.m_datetype == "start" && date.getTime() < temp.associatecompselecteddate.getTime())
	        		return [true, " ui-state-active ui-state-startdate"];
	        	else if(temp.m_datetype == "end" && date.getTime() > temp.associatecompselecteddate.getTime())
	        		return [true, " ui-state-active ui-state-enddate"];
	        	else
	        		return [true, " ui-state-active"];
	        } else if((temp.selectedDate != "") && ((date > temp.selectedDate) || (date.getTime() == temp.selectedDate.getTime())) && ((date < temp.maxDateValue) || (date.getTime() == temp.maxDateValue.getTime())) && temp.m_datetype == "start"){
	        	if(temp.m_associatecomp != ""){
	        		if(date.getTime()  == temp.selectedDate.getTime()  && temp.selectedDate < temp.associatecompselecteddate){
	        			return [true, " ui-state-startdate"];
	        		}else if(temp.associatecompselecteddate !== "" && (date.getTime() == temp.associatecompselecteddate.getTime()) && (date.getTime()  == temp.selectedDate.getTime())){
	        			return [true, " ui-state-active"];
	        		} else if(temp.associatecompselecteddate !== "" && (date.getTime() == temp.associatecompselecteddate.getTime() || date < temp.associatecompselecteddate)){
	        			return (date.getTime() == temp.associatecompselecteddate.getTime()) ? [true, "ui-state-active ui-state-enddate"] : [true, sm];
	        			//return [true, " ui-state-startdate"];
	        		} else {
	        			return [true, "", ""];
	        		}
	        	} else {
	        		return [true, " ui-state-startdate"];
	        	}
	        	/*if(date.getTime() == temp.maxDateValue.getTime()){
	        		return [true, " ui-state-startmaxdate"];
	        	}
	        	else
	        	return [true, " ui-state-startdate"];*/
	        } else if((temp.selectedDate != "") && ((date < temp.selectedDate) || (date.getTime() == temp.selectedDate.getTime())) && ((date > temp.minDateValue) || (date.getTime() == temp.minDateValue.getTime())) && temp.m_datetype == "end"){
	        	if(temp.m_associatecomp != ""){
	        		if(date.getTime()  == temp.selectedDate.getTime() && temp.selectedDate > temp.associatecompselecteddate && temp.associatecompselecteddate !== ""){
	        			return [true, " ui-state-enddate"];
	        		}else if(temp.associatecompselecteddate !== "" && (date.getTime() == temp.associatecompselecteddate.getTime()) && (date.getTime()  == temp.selectedDate.getTime())){
	        			return [true, " ui-state-active"];
	        		}else if(temp.associatecompselecteddate !== "" && (date.getTime() == temp.associatecompselecteddate.getTime() || date > temp.associatecompselecteddate)){
	        			return (date.getTime() == temp.associatecompselecteddate.getTime()) ? [true, "ui-state-active ui-state-startdate"] : [true, em];
	        			//return [true, " ui-state-enddate"];
	        		} else {
	        			return [true, "", ""];
	        		}
	        	} else {
	        		return [true, " ui-state-enddate"];
	        	}
	        	/*if(date.getTime() == temp.minDateValue.getTime()){
	        		return [true, " ui-state-endmaxdate"];
	        	}
	        	else
	        	return [true, " ui-state-enddate"];*/
	        } else {
	        	return [true, "", ""];
	        }
	    },
	    firstDay :1,
	    nextText: '',
	    prevText: '',
	    dayNames: [ "", "", "", "", "", "", "" ],
		dayNamesMin: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
		defaultDate : new Date(defaultDate.getFullYear(), defaultDate.getMonth(), defaultDate.getDate()),
		changeMonth : IsBoolean(temp.m_monthnavigationenabled),
		showOtherMonths : IsBoolean(temp.m_showothermonthdate),
		changeYear : IsBoolean(temp.m_yearnavigationenabled),
		yearRange: calMinDate.getFullYear()+":"+calMaxDate.getFullYear(),
		minDate : new Date(temp.minDateValue.getFullYear(), temp.minDateValue.getMonth(), temp.minDateValue.getDate()),
		maxDate : new Date(temp.maxDateValue.getFullYear(), temp.maxDateValue.getMonth(), temp.maxDateValue.getDate()),
	});
};

/** @description Creating Map and setting field name,required Data in Map **/
DatePicker.prototype.getDataPointAndUpdateGlobalVariable = function (val, date) {
	this.selectedDate = date;
	var fieldNameValueMap = {};
	var fieldname = (this.m_fieldname == "" || this.m_fieldname == undefined) ? "Value" : this.m_fieldname;
	fieldNameValueMap[fieldname] = val;
	fieldNameValueMap["ClickValue"] = this.m_fieldvalue;
	fieldNameValueMap["dateObject"] = date;
	this.updateDataPoints(fieldNameValueMap);
};

/** @description This Method will check date set for DataProvider. **/
DatePicker.prototype.checkDateForSetDataProvider = function () {
	/*if(IsBoolean(this.setFormateStringFlag)){

	}
	this.setDataProviderFlag = true;*/
};

/** @description Setter Method for CSS **/
DatePicker.prototype.setCss = function () {
	var temp = this;
	$(".ui-datepicker-calendar").css({"font-family": selectGlobalFont(temp.m_fontfamily)});
	$(".ui-datepicker-header.ui-widget-header.ui-helper-clearfix.ui-corner-all").css({
		"background": convertColorToHex(temp.m_chromecolor),
		"border": "none",
		"border-radius": "0px"
	});
	$(".ui-datepicker-calendar").find("td").find("a").each(function () {
		$(this).css("color", temp.m_color);
	});
	$(".ui-datepicker-calendar").find("thead").find("tr").css("color", temp.m_color);
	$(".ui-state-active").css("color", temp.m_selectioncolor);
	$(".ui-widget-content.ui-state-active").css("color", temp.m_selectioncolor);
	$(".ui-widget-header.ui-state-active").css("color", temp.m_selectioncolor);
	$(".ui-state-active a").css("color", temp.m_selectioncolor);
	$(".ui-state-active a:link").css("color", temp.m_selectioncolor);
	$(".ui-widget-header .ui-state-active").css("color", temp.m_selectioncolor);
	
	$(".ui-datepicker-header.ui-widget-header.ui-helper-clearfix.ui-corner-all").find(".ui-datepicker-title").find("select").each(function(){
		  $(this).css("color","#000000");
	});
	$(".ui-datepicker-month").css({"font-family": selectGlobalFont(temp.m_fontfamily), "cursor": temp.m_cursortype});
	$(".ui-datepicker-year").css({"font-family": selectGlobalFont(temp.m_fontfamily), "cursor": temp.m_cursortype});
	$("#ui-datepicker-div").css({
		"border":"1px solid #ddd",
		"box-shadow":" 0 0 0 0 rgba(0, 0, 0, 0.12)"
	});
	
	$("table.ui-datepicker-calendar").find("td").hover(
		function () {
			$(this).find("a").css({
				"background": temp.m_rollovercolor,
				"border": "1px solid " + temp.m_rollovercolor
			});
		},
		function () {
			$(this).find("a").css({
				"background": "#f5f5f5",
				"border": "1px solid #e0dfdf"
			});
		});

	$("div.ui-datepicker-header.ui-widget-header.ui-helper-clearfix.ui-corner-all").find("a").hover(
		function () {
			$(this).css({
				"background-color": temp.m_rollovercolor,
				"background": temp.m_rollovercolor,
				"border": "1px solid " + temp.m_rollovercolor,
				"cursor": temp.m_cursortype
			});
		},
		function () {
			$(this).css({
				"background-color": temp.m_chromecolor,
				"background": temp.m_chromecolor,
				"border": "1px solid " + temp.m_chromecolor,
				"cursor": temp.m_cursortype
			});
		});
};

DatePicker.prototype.setnewCss = function () {
	var temp = this;
	$(".ui-datepicker-calendar").css({"font-family": selectGlobalFont(temp.m_fontfamily)});
	$(".ui-datepicker-calendar").css("font-size","14px");//this.fontScaling(this.m_fontsize * 1)
	$(".ui-datepicker-header.ui-widget-header.ui-helper-clearfix.ui-corner-all").css({
		"background": convertColorToHex(temp.m_chromecolor),
		"border": "none",
		"border-radius": "0px"
	});
	
	$(".ui-datepicker-prev.ui-corner-all.ui-state-disabled").find("span").removeClass('ui-icon ui-icon-circle-triangle-w');
	$(".ui-datepicker-prev.ui-corner-all").find("span").removeClass('ui-icon ui-icon-circle-triangle-w');
	$(".ui-datepicker-prev.ui-corner-all").remove("span");
	$("#leftsvg").remove();
	
	$(".ui-datepicker-prev.ui-corner-all").append('<svg id="leftsvg" xmlns="http://www.w3.org/2000/svg" width="24" height="25" ><g fill="none" fill-rule="evenodd"><g transform="translate(-64 -187) translate(32 106)"><path d="M0 0H24V24H0z" transform="translate(16 66) translate(0 2) rotate(90 13 27)"/><g fill="#8B8C90"><path d="M.293.293c.39-.39 1.024-.39 1.414 0L7 5.586 12.293.293c.39-.39 1.024-.39 1.414 0 .39.39.39 1.024 0 1.414l-6 6c-.39.39-1.024.39-1.414 0l-6-6c-.39-.39-.39-1.024 0-1.414z" transform="translate(16 66) translate(0 2) rotate(90 13 27) translate(5 8)"/></g></g></g></svg>');
	$(".ui-datepicker-prev.ui-corner-all").find("span").html('');
	$(".ui-datepicker-prev.ui-corner-all").css("color", "#000");
	$(".ui-datepicker-next.ui-corner-all").find("span").removeClass('ui-icon ui-icon-circle-triangle-e');
	$(".ui-datepicker-next.ui-corner-all").remove("span");
	$("#rightsvg").remove();
	$(".ui-datepicker-next.ui-corner-all").append('<svg id="rightsvg" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25"><g fill="none" fill-rule="evenodd"><g  transform="translate(-367 -187) translate(32 106)"><g><path d="M0 0H24V24H0z" transform="translate(16 66) translate(0 2) matrix(0 1 1 0 319 14)"/><g fill="#8B8C90"><path d="M.293.293c.39-.39 1.024-.39 1.414 0L7 5.586 12.293.293c.39-.39 1.024-.39 1.414 0 .39.39.39 1.024 0 1.414l-6 6c-.39.39-1.024.39-1.414 0l-6-6c-.39-.39-.39-1.024 0-1.414z" transform="translate(16 66) translate(0 2) matrix(0 1 1 0 319 14) translate(5 8)"/></g></g></g></g></svg>');
	$(".ui-datepicker-next.ui-corner-all").find("span").html('');
	$(".ui-datepicker-next.ui-corner-all").css("color", "#000");
	$(".ui-datepicker-title").css("color", temp.m_color);
	$(".ui-datepicker-title").css("font-size","16px");
	
	$(".ui-datepicker-calendar").find("td").find("a").each(function () {
		$(this).css("color", temp.m_color);
	});
	$(".ui-datepicker-calendar").find("thead").find("tr").css("color", temp.m_color);
	//$(".ui-state-active").css("color", temp.m_selectioncolor);
	$(".ui-widget-content.ui-state-active").css("color", temp.m_selectioncolor);
	$(".ui-widget-header.ui-state-active").css("color", temp.m_selectioncolor);
	//$(".ui-state-active a").css("color", temp.m_selectioncolor);
	//$(".ui-state-active a:link").css("color", temp.m_selectioncolor);
	$(".ui-widget-header .ui-state-active").css("color", temp.m_selectioncolor);
	
	$(".ui-datepicker td").css("padding","0px");
	
	$(".ui-datepicker-days-cell-over.ui-state-active.ui-datepicker-current-day.ui-datepicker-today").css("border", "0px solid transparent");
	
	$(".ui-state-active.ui-datepicker-current-day.ui-datepicker-today").css("border", "0px solid transparent");
	$(".ui-datepicker-days-cell-over.ui-state-active.ui-datepicker-current-day").css("border", "0px solid transparent");
	
	$(".ui-datepicker-header.ui-widget-header.ui-helper-clearfix.ui-corner-all").find(".ui-datepicker-title").find("select").each(function(){
		  $(this).css("color",temp.m_color);
	});
	$("#ui-datepicker-div").css({
		"width":"350px",
		"border":"0px solid",
		"box-shadow":" 0 8px 16px 0 rgba(0, 0, 0, 0.12)"
	});
	var dashboardwidth = this.m_chartContainer[0].offsetWidth;
	var position = $("#ui-datepicker-div").position();
	if(position.left + 265 > dashboardwidth){
		position.left -=110;
		$("#ui-datepicker-div").offset({left:position.left})
	}
	
	$(".ui-datepicker th").css("width","45px");
	$(".ui-datepicker tr").css("height","38px");
	//$(".ui-datepicker td").css("width","45px");
	$(".ui-datepicker-header.ui-widget-header.ui-helper-clearfix.ui-corner-all").css("background-color","#ffffff");
	
	$(".ui-datepicker-month").css({"font-family": selectGlobalFont(temp.m_fontfamily), "cursor": temp.m_cursortype});
	$(".ui-datepicker-year").css({"font-family": selectGlobalFont(temp.m_fontfamily), "cursor": temp.m_cursortype});
	
	$(".ui-state-default").css({
		"color":temp.m_color,
		"background":"#ffffff",
		"border":"0px solid transparent",
		"text-align": "center",
		"height": "38px",
		"width": "38px",
		"padding-top": "9px",
		"border-radius": "50%",
		"font-weight": "normal",
		"font-stretch": "normal",
		"font-style": "normal",
		"line-height": 1.43,
		"letter-spacing":" normal"
	});
	
	$(".ui-state-default.ui-state-highlight.ui-state-active").css({
		"color":"#ffffff",
		"background":temp.m_selectioncolor,
		"border":"0px solid transparent",
		"text-align": "center",
		"height": "38px",
		"width": "38px",
		"padding-top": "9px",
		"border-radius": "50%"	
	});
	$(".ui-state-default.ui-state-active").css({
		"color":"#ffffff",
		"background":temp.m_selectioncolor,
		"border":"0px solid transparent",
		"text-align": "center",
		"height": "38px",
		"width": "38px",
		"padding-top": "9px",
		"border-radius": "50%"
	});
	
	
	$("table.ui-datepicker-calendar").find("td").hover(
		function () {
			var spanClass = $(this).find("a").attr('class');
			if(spanClass == "ui-state-default ui-state-highlight ui-state-active" || spanClass == "ui-state-default ui-state-active"|| spanClass == "ui-state-default ui-state-active ui-state-hover"){
				$(this).find("a").css({
				"color":"#ffffff", 
				"background":temp.m_selectioncolor,
				"border":"0px solid transparent",
				"text-align": "center"
			});
			   }else{
			$(this).find("a").css({
				"background": temp.m_rollovercolor,
				"border": "0px solid transparent"
			});
			   }
		},
		function () {
			var spanClass = $(this).find("a").attr('class');
			if(spanClass == "ui-state-default ui-state-highlight ui-state-active" || spanClass == "ui-state-default ui-state-active"|| spanClass == "ui-state-default ui-state-active ui-state-hover"){
				$(this).find("a").css({
				"color":"#ffffff", 
				"background":temp.m_selectioncolor,
				"border":"0px solid transparent",
				"text-align": "center"
			});
			   }else{
			$(this).find("a").css({
				"background": "#ffffff",
				"border": "0px solid transparent"
			});
			   }
		});
	/*
	$("table.ui-datepicker-calendar").find("td").hover(
		function () {
			$(this).find("a").css({
				"background": temp.m_rollovercolor,
				"border": "1px solid " + temp.m_rollovercolor
			});
		},
		function () {
			$(this).find("a").css({
				"background": "#f5f5f5",
				"border": "1px solid #e0dfdf"
			});
		});

	$("div.ui-datepicker-header.ui-widget-header.ui-helper-clearfix.ui-corner-all").find("a").hover(
		function () {
			$(this).css({
				"background-color": temp.m_rollovercolor,
				"background": temp.m_rollovercolor,
				"border": "1px solid " + temp.m_rollovercolor,
				"cursor": temp.m_cursortype
			});
		},
		function () {
			$(this).css({
				"background-color": temp.m_chromecolor,
				"background": temp.m_chromecolor,
				"border": "1px solid " + temp.m_chromecolor,
				"cursor": temp.m_cursortype
			});
		});
*/};
//# sourceURL=DatePicker.js