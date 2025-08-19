/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: CheckBoxFilter.js
 * @description Checkbox component
 **/
function CheckboxFilter(m_chartContainer, m_zIndex) {
	this.base = Filter;
	this.base = Filter;
	this.base();
	this.m_objectID = [];
	this.m_componentid = "";
	this.m_valuesObject = [];
	this.m_values = [];
	this.m_chromecolor = "#FFFFFF";
	this.m_transparency = 1;
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_cursortype = "pointer";
	this.m_selectedindexarray = [];
	this.m_enhanceCheckbox=false;
	this.checkboxNames = [];
	this.checkboxDisplayNames = [];
	this.checkboxColors = [];
	this.checkboxShapes = [];
	this.m_checkboxcolors = "#E08283,#38d3a9,#797979";
	this.m_checkboxvalue = "1,1,1";
	this.m_checkboxnames = "Series1,Series2,Series3";
	this.m_checkboxshapes = "cube,triangle,point";
	this.marginLeft = 15;
	this.marginTop = 10;
	this.marginGap = 10;
	this.m_rowpadding = 0;
	this.m_columnpadding = 0;
};
/** @description Making prototype of Filter class to inherit its properties and methods into CheckBox filter **/
CheckboxFilter.prototype = new Filter;

/** @description This method will parse the chart JSON and create a container **/
CheckboxFilter.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description  Will create an id for component to be used for dashboard operation management**/
CheckboxFilter.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "checkboxdiv" + this.m_objectid;
};

/** @description Setter Method of DataProvider **/
CheckboxFilter.prototype.setDataProvider = function (m_dataProvider) {
	this.m_dataProvider = m_dataProvider;
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
CheckboxFilter.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	this.componentJson = jsonObject;
	this.m_values = [];
	for (var key in jsonObject) {
		if (key == "Filter") {
			for (var filterkey in jsonObject[key]) {
				switch (filterkey) {
				case "Values":
					var valuesArray = this.getArrayOfSingleLengthJson(jsonObject[key][filterkey]);
					for (var i = 0; i < valuesArray.length; i++) {
						var values = new Values();
						values.setLabel(this.getProperAttributeNameValue(valuesArray[i], "label"));
						values.setValue(this.getProperAttributeNameValue(valuesArray[i], "value"));
						values.setUncheckedValue(this.getProperAttributeNameValue(valuesArray[i], "unCheckedValue"));
						this.m_values.push(values);
					}
					break;
				default:
					this.setAttributeValueToNode(filterkey, jsonObject[key], nodeObject);
					break;
				}
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
CheckboxFilter.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas(this.m_chartContainer, this.m_zIndex);
};

CheckboxFilter.prototype.drawObject = function () {
	this.init();
	this.checkBoxWidth=(this.m_fontsize*1 <12 ) ? 12 : this.m_fontsize*1 ;
	this.setCheckboxInfoForMultiple();
	if (IsBoolean(this.m_isActive)){
			this.drawChart();
	}
	if(this.m_onafterrendercallback != ""){
		onAfterRender(this.m_onafterrendercallback);
	}
};

/** @description initialization of CheckboxFilter **/
CheckboxFilter.prototype.init = function () {};

CheckboxFilter.prototype.setCheckboxInfoForMultiple = function (chart) {
	var temp = this;
	this.m_checkboxObjectArr = [];
	this.checkboxNames = this.m_checkboxnames.split(",");
	this.checkboxDisplayNames = this.m_checkboxnames.split(",");
	this.checkboxDisplayNames = this.checkboxDisplayNames.map(function(name){
		return temp.getValueFromGlobalVariable(name, "square", false);
	});
	this.checkboxColors = this.m_checkboxcolors.split(",");
	this.checkboxValue = this.m_checkboxvalue.split(",");
	this.checkboxShapes = this.m_checkboxshapes.split(",");
	
	for (var i = 0; i < this.checkboxNames.length; i++) {
		this.m_checkboxObjectArr.push({
			"checkboxName": this.checkboxNames[i],
			"checkboxShape": this.checkboxShapes[i],
			"checkboxColor": this.checkboxColors[i],
			"checkboxDisplayName": this.checkboxDisplayNames[i],
			"checkboxValue": this.checkboxValue[i]
		});
	}
};

/** @description Drawing of component started by drawing different parts of component like checkbox,label. **/
CheckboxFilter.prototype.drawChart = function () {
	var temp = this;

	$("#CheckboxContainerDiv" + this.m_componentid).remove();
	var obj = document.createElement("div");
	obj.setAttribute("id", "CheckboxContainerDiv"+this.m_componentid);
	obj.style.position = "absolute";
	obj.style.width = this.m_width + "px";
	obj.style.height = this.m_height + "px";
	obj.style.background = hex2rgb(convertColorToHex(this.m_chromecolor), this.m_transparency);
	$("#draggableDiv" + temp.m_objectid).append(obj);
	var allowMultipleSelection = IsBoolean(this.m_allowmultipleselection);
	temp.createcheckboxbeforeStyle(temp.m_toggleheight,temp.m_togglewidth,temp.m_togglecolor);
		if(allowMultipleSelection){
			this.drawMultiCheckboxParent();
		}else{
			
			if(IsBoolean(temp.m_togglecheckboxlayout)){
				var checkbox = this.createToggleCheckbox();
				obj.appendChild(checkbox);
			}else{
				var checkbox = this.createCheckbox(); //create a checkbox
				var label = this.createLabel(); //create a label
				obj.appendChild(checkbox);
				obj.appendChild(label);
			}
			
			//this.checkboxOnchange(checkbox); //onchange event of checkbox
		}
};

/** @description method will create the Checkbox Element and return the object of Element. **/
CheckboxFilter.prototype.createCheckbox = function () {
	var temp= this;
	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.name = this.getValues()[0].getLabel();
	checkbox.value = this.getValues()[0].getValue();
	checkbox.id = this.getObjectID();
	checkbox.setAttribute("class", "cr-checkbox");
	if(this.m_enhanceCheckbox)
		checkbox.setAttribute("class", "option-input-cr cr-checkbox");
	checkbox.style.verticalAlign = "text-top";
	checkbox.style.cursor = this.m_cursortype;
		checkbox.style.marginTop = "2px";
	if(this.m_enhanceCheckbox)
		checkbox.style.margin = "0px 0px 0px 16px";
	//checkbox.style.position = "relative";
	//checkbox.style.margin = "0px";
	if (IsBoolean(this.m_checkboxselected)){
		checkbox.checked = true;
	}
	temp.checkboxOnchange(checkbox);
	return checkbox;
};

/** @description method will create the Checkbox Element and return the object of Element. **/
CheckboxFilter.prototype.createToggleCheckbox = function () {
	var temp =this;
	var toggleSwitch = document.createElement("label");
	toggleSwitch.setAttribute("class", "switch");
	toggleSwitch.setAttribute("id", temp.m_componentid + 'switch');
	toggleSwitch.style.width = "100%";
	toggleSwitch.style.height = temp.m_toggleheight + "px";
	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.name = temp.getValues()[0].getLabel();
	checkbox.value = temp.getValues()[0].getValue();
	checkbox.id = temp.getObjectID();
	var toggleSlider = document.createElement("span");
	toggleSlider.setAttribute("id", temp.m_componentid + 'slider');
	if(temp.m_toggleshape == "round"){
		toggleSlider.setAttribute("class", "slider round");
	}else{
		toggleSlider.setAttribute("class", "slider");
	}
	toggleSlider.style.width = (temp.m_togglewidth) + "px";
	toggleSlider.style.height = (temp.m_toggleheight) + "px";
	
	/**create toggle label */
	var label = document.createElement("span");
	label.htmlFor = "id";
	label.style.font = this.m_fontstyle + " " + this.m_fontweight + " " + this.fontScaling(this.m_fontsize) + "px " + selectGlobalFont(this.m_fontfamily);
	label.style.color = convertColorToHex(this.m_fontcolor);
	label.style.marginLeft = "10px";
	label.style.verticalAlign = "middle";
	label.style.position = "relative";
	label.style.display = "inline-block";
	label.style.cursor = this.m_cursortype;
	label.setAttribute("For", this.getObjectID());
	var CBlabel = this.formattedDescription(this, this.getValues()[0].getLabel());
	label.appendChild(document.createTextNode(CBlabel));

	/**append span and checkbox to label */
	toggleSwitch.append(checkbox);
	toggleSwitch.append(toggleSlider);
	toggleSwitch.append(label);
	if (IsBoolean(this.m_checkboxselected)){
		checkbox.checked = true;
		toggleSlider.style.backgroundColor = convertColorToHex(temp.m_togglecheckedcolor);
	}
	temp.checkboxOnchange(checkbox);
	/**click event */
	toggleSwitch.addEventListener('click', function() {

    if (checkbox.checked) {
      toggleSlider.style.backgroundColor = convertColorToHex(temp.m_togglecheckedcolor);
      toggleSlider.style.transition = '0.4s';
      //toggleSlider.style.before.transform = 'translateX(20px)';
    } else {
      toggleSlider.style.backgroundColor = convertColorToHex(temp.m_toggleuncheckedcolor);;
      toggleSlider.style.transition = '0.4s';
      //toggleSlider.style.before.transform = 'translateX(0)';
    }
  });
	
	return toggleSwitch;
};

/** @description method will create the toggle slider before css Element. **/
CheckboxFilter.prototype.createcheckboxbeforeStyle = function (knobHeight,knobWidth, bgcolor){	
	var style = document.createElement('style');
	style.textContent = `
	input:checked + .slider:before {
  	-webkit-transform: translateX(${knobWidth-knobHeight}px);
  	-ms-transform: translateX(${knobWidth-knobHeight}px);
  	transform: translateX(${knobWidth-knobHeight}px);
	}
    .slider::before {
	  position: absolute;
	  content: "";
	  height: ${knobHeight-8}px; /* Height of the knob */
      width: ${knobHeight-8}px; /* Width of the knob */
	  left: 4px;
	  top: 4px;
	  bottom: 4px;
	  background-color: ${bgcolor};
	  -webkit-transition: .4s;
	  transition: .4s;
    }
  `;
  document.head.appendChild(style);
}

/** @description method will create the Checkbox Element and return the object of Element. **/
CheckboxFilter.prototype.createToggleCheckboxMultiple = function (i) {
	var temp =this;
	var toggleSwitch = document.createElement("label");
	toggleSwitch.setAttribute("class", "switch");
	toggleSwitch.setAttribute("id", temp.m_componentid + "Multiswitch" + i);
	toggleSwitch.style.width = "100%";
	toggleSwitch.style.height = temp.m_toggleheight + "px";
	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.name = temp.m_checkboxObjectArr[i].checkboxName;
	checkbox.value = temp.m_checkboxObjectArr[i].checkboxValue;
	checkbox.setAttribute("id", temp.m_componentid + "MultiCheckbox" + i);
	var toggleSlider = document.createElement("span");
	toggleSlider.setAttribute("id", temp.m_componentid + 'slider' + i);
	if(temp.m_toggleshape == "round"){
		toggleSlider.setAttribute("class", "slider round");
	}else{
		toggleSlider.setAttribute("class", "slider");
	}
	toggleSlider.style.width = (temp.m_togglewidth) + "px";
	toggleSlider.style.backgroundColor = convertColorToHex(temp.m_toggleuncheckedcolor);
	toggleSlider.style.height = (temp.m_toggleheight) + "px";
	
	/**create toggle label */
	var label = document.createElement("span");
	label.htmlFor = "id"+ i;
	label.style.font = this.m_fontstyle + " " + this.m_fontweight + " " + this.fontScaling(this.m_fontsize) + "px " + selectGlobalFont(this.m_fontfamily);
	label.style.color = convertColorToHex(this.m_fontcolor);
	label.style.marginLeft = "10px";
	label.style.verticalAlign = "middle";
	label.style.position = "relative";
	label.style.display = "inline-block";
	label.style.cursor = this.m_cursortype;
	label.setAttribute("For", this.getObjectID()+ i);
	var CBlabel = this.m_checkboxObjectArr[i].checkboxDisplayName;
	label.appendChild(document.createTextNode(CBlabel));
	
	
	/**append span and checkbox to label */
	toggleSwitch.append(checkbox);
	toggleSwitch.append(toggleSlider);
	toggleSwitch.append(label);
	/**checked checkbox by default */
    if (IsBoolean(this.m_checkboxObjectArr[i].checkboxShape == "checked")){
		checkbox.checked = true;
		toggleSlider.style.backgroundColor = convertColorToHex(temp.m_togglecheckedcolor);
	}
	temp.checkboxOnchange(checkbox);
	/**click event */
	toggleSwitch.addEventListener('click', function() {

    if (checkbox.checked) {
      toggleSlider.style.backgroundColor = convertColorToHex(temp.m_togglecheckedcolor);
      toggleSlider.style.transition = '0.4s';
      //toggleSlider.style.before.transform = 'translateX(20px)';
    } else {
      toggleSlider.style.backgroundColor = convertColorToHex(temp.m_toggleuncheckedcolor);
      toggleSlider.style.transition = '0.4s';
      //toggleSlider.style.before.transform = 'translateX(0)';
    }
  });
	
	return toggleSwitch;
};

/** @description method will create the label Element and return the object of Element. **/
CheckboxFilter.prototype.createLabel = function () {
	var label = document.createElement("label");
	label.htmlFor = "id";
	label.style.font = this.m_fontstyle + " " + this.m_fontweight + " " + this.fontScaling(this.m_fontsize) + "px " + selectGlobalFont(this.m_fontfamily);
	label.style.color = convertColorToHex(this.m_fontcolor);
	label.style.marginLeft = "2px";
	label.style.marginTop = "2px";
	label.style.cursor = this.m_cursortype;
	label.setAttribute("For", this.getObjectID());
	//label.style.marginBottom = "10px";
	label.style.verticalAlign = "middle";
	
	if(this.m_enhanceCheckbox)
    	label.setAttribute("class", "ehanceCheckboxLabel");
	
	var CBlabel = this.formattedDescription(this, this.getValues()[0].getLabel());
	label.appendChild(document.createTextNode(CBlabel));
	return label;
};
/**DAS-827 */
CheckboxFilter.prototype.drawMultiCheckboxParent = function() {
	var temp = this;
    for (var i = 0; i < temp.m_checkboxObjectArr.length; i++) {
        if (temp.m_checkboxObjectArr[i].checkboxName != "") {
            temp.drawMultiCheckboxDiv(i);
            temp.drawMultiCheckbox(i);
            if(!IsBoolean(temp.m_togglecheckboxlayout)){
            temp.drawHtmlCheckboxText(i);
            }
        }
    }
};
/**DAS-827 */
CheckboxFilter.prototype.drawMultiCheckboxDiv = function(i) {
    var temp = this;
    var LegendDiv = document.createElement("div");
    LegendDiv.setAttribute("id", "CheckboxDiv" + this.m_componentid + i);
    LegendDiv.setAttribute("class", "legend-row-div");
    if (this.m_direction == "vertical") {
        LegendDiv.setAttribute("style", "display: table-row;vertical-align:top;cursor: "+this.m_cursortype+";");
    } else {
        LegendDiv.setAttribute("style", "display: inline-flex; padding-top: "+temp.fontScaling(2)+"px; vertical-align:top; margin-right: 15px; cursor: "+this.m_cursortype+";");
    }
    $("#CheckboxContainerDiv" + temp.m_componentid).append(LegendDiv);
};
/**DAS-827 */
CheckboxFilter.prototype.drawMultiCheckbox = function(i) {
    var temp = this;
    var checkBoxDiv = document.createElement("div");
	checkBoxDiv.setAttribute("id", this.m_componentid + "MultiCheckboxDiv" + i);
    //checkBoxDiv.setAttribute("class", "legend-checkbox-div");
    checkBoxDiv.setAttribute("style", "display: table-cell;vertical-align: middle;text-align: center;padding: " + this.m_rowpadding/2 + "px " + this.m_columnpadding +"px " + this.m_rowpadding/2 + "px " + this.m_columnpadding +"px;");
    if(IsBoolean(temp.m_togglecheckboxlayout)){
	var toggleSwitch = temp.createToggleCheckboxMultiple(i);
    $(checkBoxDiv).append(toggleSwitch);
	}
    else{
    var checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("class", "cr-checkbox");
    checkBox.name = temp.m_checkboxObjectArr[i].checkboxName;
	checkBox.value = temp.m_checkboxObjectArr[i].checkboxValue;
    /**checked checkbox by default */
    if (IsBoolean(this.m_checkboxObjectArr[i].checkboxShape == "checked")){
		checkBox.checked = true;
	}
    if(this.m_enhanceCheckbox)
    checkBox.setAttribute("class", "option-input-cr cr-checkbox");
    checkBox.setAttribute("id", this.m_componentid + "MultiCheckbox" + i);
    checkBoxDiv.setAttribute("id", this.m_componentid + "MultiCheckboxDiv" + i);
    //checkBoxDiv.setAttribute("class", "legend-checkbox-div");
    checkBoxDiv.setAttribute("style", "display: table-cell;vertical-align: middle;text-align: center;width: 25px;padding: " + this.m_rowpadding/2 + "px " + this.m_columnpadding +"px " + this.m_rowpadding/2 + "px " + this.m_columnpadding +"px;");

    $(checkBoxDiv).append(checkBox);
    $("#CheckboxDiv" + this.m_componentid + i).append(checkBoxDiv);
    this.checkboxOnchange(checkBox); //onchange event of checkbox
	}
    $("#CheckboxDiv" + this.m_componentid + i).append(checkBoxDiv);
    
};
CheckboxFilter.prototype.drawHtmlCheckboxText = function (i) {
	var temp = this;
	var labelObj = document.createElement("div");
	var labelObjLabel = document.createElement("label");
	var labelObjSpan = document.createElement("span");
	labelObjLabel.setAttribute("for", this.m_objectid + "MultiCheckbox" + i);
	labelObjSpan.innerHTML = this.m_checkboxObjectArr[i].checkboxDisplayName;
	labelObj.setAttribute("id", temp.m_componentid + "" + i);
	var styleStr = "display:table-cell;vertical-align:middle;padding:" + this.m_rowpadding/2 + "px " + this.m_columnpadding +"px " + this.m_rowpadding/2 + "px " + this.m_columnpadding +"px;";
	labelObj.setAttribute("style", styleStr);
	labelObj.setAttribute("class", "legend-label-div");
	/**Added selectGlobalFont for active the global font*/
	labelObjSpan.setAttribute("style", "margin-bottom:0px;cursor: " + this.m_cursortype + ";font-weight:" + this.m_fontweight + ";font-size:" + this.fontScaling(this.m_fontsize * 1) + "px;font-style:" +
		this.m_fontstyle + ";font-family:" + selectGlobalFont(this.m_fontfamily) + ";color:" + this.m_fontcolor + ";text-decoration:" + this.m_textdecoration + ";");
	$(labelObjLabel).append(labelObjSpan);
	$(labelObj).append(labelObjLabel);
	$("#CheckboxDiv" + this.m_componentid + i).append(labelObj);
	/** When legend with checkbox is there, no need for label event, change will be auto-triggered because of "For" relation with checkbox **/
	if (!IsBoolean(temp.m_designMode)) {
		labelObj.onclick = (function () {
			temp.getDataPointAndUpdateGlobalVariable(temp.m_checkboxObjectArr[i].checkboxDisplayName, temp.m_checkboxObjectArr[i].checkboxName, temp.m_checkboxObjectArr[i].checkboxColor);
		});
	}
	/** Added to support scaling*/
	if(IsBoolean(temp.m_togglecheckboxlayout)){
		$(labelObjLabel).css({
		"display": "inline-flex",
		"margin-bottom": "0px",
		"vertical-align": "-webkit-baseline-middle",
		"margin-left": "10px"
	});
	}else{
		$(labelObjLabel).css({
		"display": "inline-flex",
		"margin-bottom": "0px",
		"vertical-align": "middle",
		"margin-left": "10px"
	});
	}
	
};

/** @description will register the onchange event with checkbox . **/
CheckboxFilter.prototype.checkboxOnchange = function (checkbox) {
	var temp = this;
	if (!IsBoolean(this.m_designMode)) {
		checkbox.onchange = function () {
			/**DAS-827 */
			if(IsBoolean(temp.m_allowmultipleselection)){
				/**DAS-1294 */
				var container = document.getElementById("CheckboxContainerDiv"+temp.m_componentid);
				var checkedValues = Array.from(
				    container.querySelectorAll('input[type="checkbox"]:checked')
				).map(function (checkbox) {
				    return checkbox.value;
				}).join(", "); // Join values with commas
				//var value = IsBoolean(this.checked) ? this.value : 0 ;
				var value = checkedValues;
			}else{
				var value = IsBoolean(this.checked) ? temp.getValues()[0].getValue() : temp.getValues()[0].getUncheckedValue();
			}
			temp.m_selectedindexarray = IsBoolean(this.checked) ? 1 : 0;
			temp.handleOnChangeEvent(value);
		};
	}
};

/** @description will handle the operation with onchange Event. **/
CheckboxFilter.prototype.handleOnChangeEvent = function (value) {
	var temp = this;
	var fieldNameValueMap = {};
	var fieldName = (temp.getFieldName() == "" || temp.getFieldName() == undefined) ? "Value" : temp.getFieldName();
	fieldNameValueMap[fieldName] = ("" + value).replace(/^ +/gm, "");

	if (this.componentJson.variable != undefined) {
		for (var i = 0; i < this.componentJson.variable.DefaultValues.DefaultValue.length; i++) {
			fieldNameValueMap[this.componentJson.variable.DefaultValues.DefaultValue[i].name] = ("" + value).replace(/^ +/gm, "");
		}
	}
	temp.updateDataPoints(fieldNameValueMap);
};
//# sourceURL=CheckboxFilter.js