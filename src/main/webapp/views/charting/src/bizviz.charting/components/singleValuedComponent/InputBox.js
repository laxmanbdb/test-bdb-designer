/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: InputBox.js
 * @description InputBox
 **/
function InputBox(m_chartContainer, m_zIndex) {
	// console.log("inside InputBox() constructor");
	this.base = Widget;
	this.base();

	this.m_fontstyle = "";
	this.m_fontsize = "";
	this.m_text = "";
	this.m_fontweight = "";
	this.m_contentbackgroundcolor = "#fff";
	this.m_height = "";
	this.m_textdecoration = "";
	this.m_contentbackgroundalpha = "";
	this.isdynamic = "";
	this.m_fontfamily = "";
	this.m_virtualdatafield = "";
	this.m_width = "";
	this.m_datarownumber = "";
	this.m_virtualdataid = "";
	this.m_bordervisible = "";
	this.m_bordercolor = "#000000";
	this.m_borderthickness = "1";
	this.m_color = "";
	this.m_editable = "";
	this.m_inputtype = "text";
	this.m_textBoxText = "";
	this.m_pretag = "";
	this.m_objectID = [];
	this.m_componentid = "";
	this.m_globalkey = "";
	this.m_fieldvalue = "";
	this.m_borderradius = 0;
	this.m_borderstyle = "solid";
	this.m_textboxpadding = "5";
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
};

InputBox.prototype = new Widget;

InputBox.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

InputBox.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "InputBox") {
			for (var textBoxKey in jsonObject[key]) {
				this.setAttributeValueToNode(textBoxKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

InputBox.prototype.setDataProvider = function (data) {
	this.m_text = data;
};
InputBox.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

InputBox.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
};

InputBox.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length === 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "textBoxDiv" + this.m_objectid;
};

InputBox.prototype.draw = function () {
	this.drawObject();
};

InputBox.prototype.drawObject = function () {
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback!="")
		onAfterRender(this.m_onafterrendercallback);
};

InputBox.prototype.init = function () {
	if (!IsBoolean(this.m_isdynamic)){
		this.m_labelText = this.m_text;
	}else if (this.m_m_virtualdataid === "" || this.m_virtualdatafield === "" || this.m_datarownumber === ""){
		this.m_labelText = this.getValueFromGlobalVariable(this.m_text, "square");
	} else{
		// Do nothing
	}
};

InputBox.prototype.getTextValueFromGlobalVariable = function () {
	var str, key;
	str = key = this.m_text;
	var re = /\[(.*?)\]/g;
	for (var m = re.exec(key); m; m = re.exec(key)) {
		if (this.m_dashboard !== "" && this.m_dashboard.getGlobalVariable() !== "") {
			var globalVarValue = this.m_dashboard.getGlobalVariable().getFieldValue(m[1]);
			str = str.replace(m[0], globalVarValue);
		}
	}
	return str;
};

InputBox.prototype.drawChart = function () {
	if (IsBoolean(this.m_isActive)) {
		try{
			this.drawTextBox();
		}catch(e){
			console.log(e);
		}
	}
};
InputBox.prototype.getDataProvider = function () {
	return this.m_textBoxText;
};
InputBox.prototype.drawTextBox = function () {
	var temp = this;
	this.m_textBoxText = this.m_labelText;
	if ($("#" + temp.m_componentid) !== null)
		$("#" + temp.m_componentid).remove();

	var obj = document.createElement("div");
	obj.setAttribute("id", this.m_componentid);
	obj.setAttribute("class", "textBoxDiv");
	obj.style.width = this.m_width + "px";
	obj.style.height = this.m_height + "px";
	obj.style.position = "absolute";
	
	
	var box = document.createElement("input");
	box.type = this.m_inputtype;
	box.placeholder = (this.m_inputtype == "text") ? "Enter text" : "";
	box.style.overflow = "auto";
	box.style.cursor = "pointer";
	box.style.position = "absolute";
	box.setAttribute("background", "transparent");
	box.style.font = this.m_fontstyle + " " + this.m_fontweight + " " + this.fontScaling(this.m_fontsize) + "px " + selectGlobalFont(this.m_fontfamily);
	box.style.color = convertColorToHex(this.m_color);
	box.style.width = this.m_width + "px";
	box.style.height = this.m_height + "px";
	box.style.backgroundColor = hex2rgb(convertColorToHex(this.m_contentbackgroundcolor), this.m_contentbackgroundalpha);
	if (IsBoolean(this.m_bordervisible)) {
		box.style.border = ""+this.m_borderthickness+"px "+ this.m_borderstyle + "" + convertColorToHex(this.m_bordercolor);
		box.style.borderRadius = this.m_borderradius + "px";
		$("#draggableDiv" + this.m_objectid).css("border-radius",this.m_borderradius + "px");
	}
	else{
		box.style.border = "none";
	}
		
	box.style.padding = this.m_textboxpadding+"px";
	if (!IsBoolean(this.m_editable)) {
	box.setAttribute("readonly", "true");
	}
	/** Convert to string, otherwise it will throw error when numeric values is set from sdk.setValues method **/
	var temp1 = ""+this.m_textBoxText;
	if ( (temp1 != undefined && temp1 !== null && temp1 !== "") && !IsBoolean(this.m_designMode) && (temp1.search("<html>")) === -1) {
		box.style.overflowX = "hidden";
		var newString = "";
		for (var z = 0; z < temp1.length; z++) {
			if (temp1[z] === " " && temp1[z + 1] === " ")
				newString += "&nbsp;";
			else
				newString += temp1[z];
		}

		this.m_textBoxText = newString;

		if (this.m_textBoxText !== "") {
				box.value = this.m_textBoxText;
		}
	} else {
		box.value = this.m_textBoxText;
	}
	obj.appendChild(box);
	if (!IsBoolean(temp.m_designMode)) {
		box.onclick = (function () {
			temp.getDataPointAndUpdateGlobalVariable();
		});
	}

	$(box).on("keyup", function () {
//		$("#desc").val($(this).html());
//		console.log($(this).html());
		temp.m_textBoxText = this.value;
		temp.m_text = temp.m_textBoxText;
	});
	$("#draggableDiv" + temp.m_objectid).append(obj);
};
InputBox.prototype.getDataPointAndUpdateGlobalVariable = function () {
	//	if(this.m_fieldvalue!==""){
	var fieldNameValueMap = {};
	var fieldname = (this.m_fieldname === "" || this.m_fieldname === undefined) ? "Value" : this.m_fieldname;
	fieldNameValueMap[fieldname] = this.m_fieldvalue;
	this.updateDataPoints(fieldNameValueMap);
	//	}
};
//# sourceURL=InputBox.js