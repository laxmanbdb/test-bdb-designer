/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: NumericStepper.js
 * @description NumericStepper
 **/
function NumericStepper(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();

	this.m_value = "0";
	this.m_fontsize = "";
	this.m_fontfamily = "";
	this.m_stepsize = "";
	this.m_fontstyle = "";
	this.m_minimum = "";
	this.m_maximum = "";
	this.m_fontweight = "";
	this.m_globalkey = "";
	this.m_width = "";
	this.m_chromecolor = "";
	this.m_height = "";
	this.m_fieldname = "";
	this.m_selectioncolor = "";
	this.m_rollovercolor = "";
	this.m_color = "";
	this.m_objectID = [];
	this.m_componentid = "";
	this.m_stepperId = "";

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
};

/** @description Using prototype inheriting the variable and method of Widget into NumericStepper. **/
NumericStepper.prototype = new Widget();

/** @description This method will parse the chart JSON and create a container. **/
NumericStepper.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Setter Method for DataProvider and required value. **/
NumericStepper.prototype.setDataProvider = function (val) {
	this.m_value = val;
};

/** @description Iterate through chart JSON and set class variable values with JSON values. **/
NumericStepper.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "NumericStepper") {
			for (var stepperKey in jsonObject[key]) {
				this.setAttributeValueToNode(stepperKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

/** @description Canvas Initialization. **/
NumericStepper.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description Creating Draggable Div and Canvas. **/
NumericStepper.prototype.initializeDraggableDivAndCanvas = function () {
	this.setDashboardNameAndObjectId();
	this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
};

/** @description Creating component ID. **/
NumericStepper.prototype.setDashboardNameAndObjectId = function () {
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_objectId = this.m_objectid;
	this.m_componentid = "numericStepperDiv" + this.m_objectid;
	this.m_stepperId = "numericStepper" + this.m_objectId;
};

/** @description Starting of NumericStepper Drawing. **/
NumericStepper.prototype.draw = function () {
	this.drawObject();
};

/** @description Calling init and drawChart function. **/
NumericStepper.prototype.drawObject = function () {
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback!="")
		onAfterRender(this.m_onafterrendercallback);
};

/** @description NumericStepper initialization. **/
NumericStepper.prototype.init = function () {
	this.m_chromecolor = convertColorToHex(this.m_chromecolor);
	this.m_color = convertColorToHex(this.m_color);
};

/** @description Drawing of NumericStepper. **/
NumericStepper.prototype.drawChart = function () {
	this.removeStepperDiv();
	this.drawStepperDiv();
	this.drawStepper();
	this.setStepperDefaultValue();
	//this.drawMouseUpOnStepper();
	this.setStepperCSS();
};

/** @description This method will remove existing div element into the DOM. **/
NumericStepper.prototype.removeStepperDiv = function () {
	var temp = this;
	$("#" + temp.m_componentid).remove();
};

/** @description Drawing of NumericStepper Div. **/
NumericStepper.prototype.drawStepperDiv = function () {
	var temp = this;
	var ParentDivObj = document.createElement("div");
	ParentDivObj.setAttribute("id", this.m_componentid);
	ParentDivObj.style.width = (this.m_width) + "px";
	ParentDivObj.style.height = (this.m_height) + "px";

	$("#draggableDiv" + temp.m_objectid).append(ParentDivObj);
	var divObj = document.createElement("input");
	divObj.setAttribute("id", this.m_stepperId);

	divObj.style.width = (this.m_width) + "px";
	divObj.style.height = (this.m_height) + "px";
	divObj.style.color = this.m_color;
	divObj.style.fontStyle = this.m_fontstyle;
	divObj.style.fontWeight = this.m_fontweight;
	divObj.style.fontFamily = selectGlobalFont(this.m_fontfamily);

	divObj.value = this.m_value;
	$("#" + temp.m_componentid).append(divObj);
	return divObj;
};

/** @description Drawing of Stepper with min max limit. **/
NumericStepper.prototype.drawStepper = function () {
	var temp = this;
	if (temp.m_designMode) {
		$("#" + temp.m_stepperId).spinner({
			min : temp.m_minimum * 1,
			max : temp.m_maximum * 1,
			step : temp.m_stepsize * 1,
			onSpinUp : function () {
				temp.handleMouseEvent();
			},
			onSpinDown : function () {
				temp.handleMouseEvent();
			}
		});
	}else{
		jqEasyUI("#" + temp.m_stepperId).numberspinner({
			min : temp.m_minimum * 1,
			max : temp.m_maximum * 1,
			editable : true,
			increment : temp.m_stepsize * 1,
			onSpinUp : function () {
				temp.handleMouseEvent();
			},
			onSpinDown : function () {
				temp.handleMouseEvent();
			}
		});
		/** Keyboard enter event to update global variable **/
		$('#'+temp.m_componentid).find(".textbox-text").keyup(function(e){
			if(e.keyCode == 13){
				temp.handleMouseEvent();
			}
		});
	}
};

NumericStepper.prototype.drawMouseUpOnStepper = function () {};

/** @description Setter Method for stepper default value. **/
NumericStepper.prototype.setStepperDefaultValue = function () {
	var temp = this;
	if (!temp.m_designMode) {
		jqEasyUI("#" + temp.m_stepperId).numberspinner("setValue", temp.m_value);
	}
};

/** @description Setter Method for stepper CSS. **/
NumericStepper.prototype.setStepperCSS = function () {
	var temp = this;
	$("#" + temp.m_componentid + " span a").css({
		"background": this.m_chromecolor,
		"opacity": "1"
	});
	$("#" + temp.m_componentid + " span.spinner").css({
		"border": "1px solid " + this.m_chromecolor,
		"border-radius": "0px",
		"position": "absolute",
		"top": "0px",
		"left": "0px"
	});
	var padding = ((this.m_height - this.fontScaling(this.m_fontsize * 1))/2);
	$("#" + temp.m_componentid + " span input").css({
		"font-size": this.fontScaling(this.m_fontsize * 1) + "px",
		"font-style": this.m_fontstyle,
		"font-weight": this.m_fontweight,
		"font-family": selectGlobalFont(this.m_fontfamily),
		"color": this.m_color,
		"background-color": this.m_chromecolor,
		"margin-top": "px",
		"padding-top": padding+"px",
		"padding-bottom": padding+"px",
		"border-radius": "0px",
		"height": "100%",
		"width": (temp.m_width)+"px"
	});
	$(".spinner-arrow-up").css("background", "");
	$(".spinner-arrow-down").css("background", "");
	
	$("#" + temp.m_componentid + " span.ui-spinner").css({
		"height": "100%"
	});
	$("#" + temp.m_componentid + " span.ui-spinner input").css({
		"width": (temp.m_width)+"px",
		"padding": "0px 5px 0px 5px",
		"margin": "0px",
		"height": "100%"
	});
};

/** @description Method will trigger the mouse event and get the value according to the current value. **/
NumericStepper.prototype.handleMouseEvent = function () {
	var temp = this;
	var stepperValue = jqEasyUI("#" + temp.m_stepperId).numberspinner("getValue");
	if (!IsBoolean(this.m_designMode)) {
		temp.getDataPointAndUpdateGlobalVariable(stepperValue);
	}
};

/** @description Creating Map and setting field name,required Data in Map **/
NumericStepper.prototype.getDataPointAndUpdateGlobalVariable = function (stepperValue) {
	this.m_value = stepperValue;
	if (this.m_value != "") {
		var fieldNameValueMap = {};
		var fieldname = (this.m_fieldname == "" || this.m_fieldname == undefined) ? "Value" : this.m_fieldname;
		fieldNameValueMap[fieldname] = this.m_value;
		this.updateDataPoints(fieldNameValueMap);
	}
};
//# sourceURL=NumericStepper.js