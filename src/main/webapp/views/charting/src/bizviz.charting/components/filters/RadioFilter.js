/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: RadioFilter.js
 * @description Radio filter
 **/
function RadioFilter(m_chartContainer, m_zIndex) {
	this.base = Filter;
	this.base();
	this.m_fieldNameValueMap = new Object();
	this.m_objectID = [];
	this.m_componentid = "";
	this.m_values = [];
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_radiospacing = 5;
	this.m_transparency = 1;
	this.m_orientation = "Horizontal";
	this.m_selectioncolor = "#ffffff";
	this.m_circlecolor = "#1b7ced";
	this.m_circlesize = "15";
	this.m_selectionfontcolor = "#000000";
	this.m_rollovercolor = "#d9d7d8";
	this.m_bordercolor = "#fafafa";
	this.m_borderradius = "5";
	this.m_radioitemheight = "20";
	this.m_cursortype = "pointer";
	this.m_viewtype = "radio";
	this.m_buttoncolor = "#e8edec";
	this.m_bordersize = "1";
	this.m_buttonpadding = "4";
	this.m_selectedindexarray = [];
	this.m_enhanceradio = false;
	this.m_enhanceradioobj ={};
	this.m_enhanceradioobj.intialtop = 7;
	this.m_enhanceradioobj.margin ='0 5px 0 0';
	this.m_enhanceradioobj.intialwidth = 24;
	this.m_enhanceradioobj.intialheight = 24;
	this.m_enhanceradioobj.intialborder = '0px solid #cecfd0';
	this.m_enhanceradioobj.intialimg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23CECFD0' stroke-width='1.5'%3E%3Cg%3E%3Cg%3E%3Cg%3E%3Cg%3E%3Cg transform='translate(-462 -809) translate(32 106) translate(0 128) translate(0 514) translate(414) translate(0 49)'%3E%3Ccircle cx='12' cy='12' r='11.25' transform='translate(16 12)'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A";
	this.m_enhanceradioobj.selectedtop = 7;
	this.m_enhanceradioobj.selectedleft =0;
	this.m_enhanceradioobj.selectedwidth = 24;
	this.m_enhanceradioobj.selectedheight = 24;
	this.m_enhanceradioobj.selectedimg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cdefs%3E%3Cfilter id='utybsmjpua' width='115.3%25' height='128.2%25' x='-7.7%25' y='-14.1%25' filterUnits='objectBoundingBox'%3E%3CfeOffset dy='16' in='SourceAlpha' result='shadowOffsetOuter1'/%3E%3CfeGaussianBlur in='shadowOffsetOuter1' result='shadowBlurOuter1' stdDeviation='16'/%3E%3CfeColorMatrix in='shadowBlurOuter1' result='shadowMatrixOuter1' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'/%3E%3CfeMerge%3E%3CfeMergeNode in='shadowMatrixOuter1'/%3E%3CfeMergeNode in='SourceGraphic'/%3E%3C/feMerge%3E%3C/filter%3E%3C/defs%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg%3E%3Cg filter='url(%23utybsmjpua)' transform='translate(-404 -365) translate(32 106)'%3E%3Cg%3E%3Cg%3E%3Cg%3E%3Cg transform='translate(356 100) translate(0 49) translate(0 98) translate(16 12)'%3E%3Ccircle cx='12' cy='12' r='11.25' stroke='%23282830' stroke-width='1.5'/%3E%3Ccircle cx='12' cy='12' r='8' fill='%23282830'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A";
	this.m_enhanceradioobj.intialbackground = "transparent";
	this.m_enhanceradioobj.selectedbackground = "transparent";
	this.m_hrl= false;
	this.m_hrltop= "18px";
	this.m_hrlbtm= "-2px";
	this.m_verticalpadding = 4;
	this.m_buttontopspacing = 2;
};

/** @description Making prototype of Filter class to inherit its properties and methods into Radio filter **/
RadioFilter.prototype = new Filter;

/** @description This method will parse the chart JSON and create a container **/
RadioFilter.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description  Will create an id for component to be used for dashboard operation management**/
RadioFilter.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "radioGroupDiv" + this.m_objectid;
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
RadioFilter.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
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
RadioFilter.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

RadioFilter.prototype.drawObject = function () {
	this.init();
	if (IsBoolean(this.m_isActive)){
		this.drawChart();
	}
	if(this.m_onafterrendercallback != ""){
		onAfterRender(this.m_onafterrendercallback);
	}
};

/** @description initialization of RadioFilter **/
RadioFilter.prototype.init = function () {
	/*this.m_dataStore.setCategoryData(this.getFieldsByLabels());
	this.m_dataStore.setSeriesData(this.getFieldsByValues());
	this.m_dataView.copyData(this.m_dataStore);*/
	this.m_componentid = "radioGroupDiv" + this.m_objectid;
	this.setData();
	this.m_categoryData = this.getCategoryData();
	this.m_seriesData = this.getSeriesData();

	if (this.m_x < 0)
		this.m_x = 0;
};
/** @description Drawing of component started by drawing different parts of component like container,radio. **/
RadioFilter.prototype.drawChart = function () {
	var containerDiv = this.drawContainerDiv();
	this.drawRadioFilter(containerDiv);
};

/** @description iterate for all  of component started by drawing different parts of component like checkbox,label. **/
RadioFilter.prototype.drawRadioFilter = function (containerDiv) {
	if(this.m_categoryData.length > 0){
		for (var i = 0; i < this.m_categoryData.length; i++) {
			var labelObj = this.drawLabel(this.m_categoryData[i]);
			if (this.m_viewtype === "button") {
				this.drawButton(this.m_categoryData[i], this.m_seriesData[i], containerDiv, labelObj, i, (this.m_categoryData.length - 1));
			} else if (this.m_viewtype === "radio" && !IsBoolean(this.m_enhanceradio)){
				this.drawRadio(this.m_categoryData[i], this.m_seriesData[i], containerDiv, labelObj, i, (this.m_categoryData.length - 1));
			} else if (this.m_viewtype === "enhance_button"){
				this.drawEnhanceButton(this.m_categoryData[i], this.m_seriesData[i], containerDiv, labelObj, i, (this.m_categoryData.length - 1));
				if(this.m_radiospacing === 0) {
					if(i==0){
						$("#RLContainer"+this.m_componentid+i).css({
							"border-top-right-radius" : "0px",
							"border-bottom-right-radius" : "0px"
						});
					}
					if(i>0&&i<this.m_categoryData.length){
						$("#RLContainer"+this.m_componentid+i).css({
							"border-radius" : "0px"
						});
					}
					if(i==this.m_categoryData.length-1){
						$("#RLContainer"+this.m_componentid+i).css({
							"border-top-right-radius" : this.m_borderradius + "px",
							"border-bottom-right-radius" : this.m_borderradius + "px"
						});
					}
				}
			} else if(this.m_viewtype === "radio" && this.m_enhanceradio === true){
				this.drawEnhanceRadio(this.m_categoryData[i], this.m_seriesData[i], containerDiv, labelObj, i, (this.m_categoryData.length - 1));
			}
		}
	} else {
		this.drawMessage(this.m_status.noData);
	}
};
/** @description create a 'div' element  for contains the Radio. **/
RadioFilter.prototype.drawContainerDiv = function () {
	var temp = this;
	$("#" + temp.m_componentid).remove();
	var containerDivObj = document.createElement("div");
	containerDivObj.setAttribute("id", this.m_componentid);
	containerDivObj.style.position = "absolute";
	containerDivObj.style.width = this.m_width + "px";
	containerDivObj.style.height = this.m_height + "px";
	containerDivObj.style.overflow = "auto";
	containerDivObj.style.background = hex2rgb(convertColorToHex(this.m_chromecolor), this.m_transparency);
	$("#draggableDiv" + temp.m_objectid).append(containerDivObj);

	return containerDivObj;
};
/** @description will create the Radio element and append into container Div. **/
RadioFilter.prototype.drawRadio = function (radioLabel, radioValue, containerDiv, labelObj, radioIndex, radioLength) {
	var radioObj = document.createElement("input");
	radioObj.setAttribute("type", "radio");
	radioObj.setAttribute("id", "radio" + this.m_componentid + "" + radioLabel+"-"+radioIndex);
	radioObj.setAttribute("class", "option-input-cr cr-radio");
	radioObj.setAttribute("name", (this.m_id != "") ? this.m_id : this.m_componentid);
	radioObj.setAttribute("value", radioValue);
	radioObj.style.height = this.m_circlesize + "px";
	radioObj.style.width = this.m_circlesize + "px";
	radioObj.style.margin = "0px 5px 0px 5px";
	radioObj.style.verticalAlign = "middle";
	radioObj.style.cursor = this.m_cursortype;
	radioObj.style.setProperty("accent-color",this.m_circlecolor);
	
	var valueContainer = document.createElement("div");
	valueContainer.setAttribute("class", "RLContainer"+this.m_componentid);
	valueContainer.style.display = (this.m_orientation == "vertical") ? "inherit" : "inline-block";
	/*Updated for removing default shadow BDD-76 */
	//valueContainer.style.boxShadow = "inset 0 0 1px " + convertColorToHex(this.m_bordercolor);
	valueContainer.style.borderRadius = this.m_borderradius + "px";
	valueContainer.style.height = "auto";
	
	var radioDiv = document.createElement("div");
	radioDiv.style.cursor = this.m_cursortype;
	radioDiv.style.display = "table-cell";
	radioDiv.style.verticalAlign = "middle";
	radioDiv.appendChild(radioObj);
	valueContainer.appendChild(radioDiv);
	
	labelObj.setAttribute("For", "radio" + this.m_componentid + "" + radioLabel+"-"+radioIndex);
	labelObj.style.display = "table-cell";
	labelObj.style.wordWrap = "break-word";
	labelObj.style.cursor = this.m_cursortype;
	labelObj.style.margin = "0px";
	labelObj.style.width = (this.m_orientation == "vertical") ? "100%" : "auto";
	labelObj.style.height = this.m_radioitemheight + "px";
	valueContainer.appendChild(labelObj);
	
	containerDiv.appendChild(valueContainer);
	
	var defaultVerticalAlignMargin = 4;
	valueContainer.style.margin = (this.m_orientation == "vertical") ?
			(defaultVerticalAlignMargin/2 + this.m_radiospacing/2) + "px " + defaultVerticalAlignMargin/2 + "px" :
				("0px " + this.m_radiospacing/2 + "px 0px "+ defaultVerticalAlignMargin/2 + "px");
	
	valueContainer.style.padding = (this.m_orientation == "vertical") ? "0px 0px 0px 0px" : "0px 4px 0px 0px";
	if (!IsBoolean(this.m_designMode)) {
		this.setSlectionBackground(radioObj, valueContainer, radioLabel);
	}
	if (radioIndex == this.m_selectedindex) {
		this.m_selectedindexarray = this.m_selectedindex; // Added for filterSaver
		radioObj.setAttribute("checked", true);
		/** commented this method bcz connection loading multiple times  **/
		if(IsBoolean(this.m_enablegvautoupdate)){
			this.m_notifychange = this.m_notifygvautoupdate;
			this.handleOnChangeEvent(radioObj, valueContainer, radioLabel);
			if (this.m_viewtype === "button") {
				valueContainer.style.background = convertColorToHex(this.m_selectioncolor);
				valueContainer.style.color = convertColorToHex(this.m_selectionfontcolor);
			}
		}
	}
};
RadioFilter.prototype.drawButton = function (radioLabel, radioValue, containerDiv, labelObj, radioIndex, radioLength) {
	var temp = this;
	var radioObj = document.createElement("input");
	radioObj.setAttribute("type", "radio");
	radioObj.setAttribute("id", "radio" + this.m_componentid + "" + radioLabel+"-"+radioIndex);
	radioObj.setAttribute("class", "ui-helper-hidden-accessible");
	radioObj.setAttribute("name", (this.m_id != "") ? this.m_id : this.m_componentid);
	radioObj.setAttribute("value", radioValue);
	//radioObj.style.height = this.m_radioitemheight + "px";
	//radioObj.style.margin = "0px 5px 0px 5px";
	radioObj.style.verticalAlign = "text-top";
	radioObj.style.visibility = "hidden";
	
	var valueContainer = document.createElement("div");
	valueContainer.setAttribute("class", "RLContainer"+this.m_componentid);
	valueContainer.style.display = (this.m_orientation == "vertical") ? "inherit" : "inline-block";
	valueContainer.style.borderRadius = this.m_borderradius + "px";
	valueContainer.style.height = "auto";
	valueContainer.style.backgroundColor = this.m_buttoncolor;
	valueContainer.style.border = this.m_bordersize + "px solid " + this.m_bordercolor;
	valueContainer.appendChild(radioObj);
	
	labelObj.setAttribute("For", "radio" + this.m_componentid + "" + radioLabel+"-"+radioIndex);
	labelObj.style.display = "inline-block";
	labelObj.style.wordWrap = "break-word";
	labelObj.style.cursor = this.m_cursortype;
	labelObj.style.margin = "0px";
	labelObj.style.width = (this.m_orientation == "vertical") ? "100%" : "auto";
	labelObj.style.padding = this.m_buttonpadding + "px";
	valueContainer.appendChild(labelObj);
	this.setButtonCss(valueContainer);
	containerDiv.appendChild(valueContainer);
	
	var defaultVerticalAlignMargin = 4;
	valueContainer.style.margin = (this.m_orientation == "vertical") ?
			(defaultVerticalAlignMargin/2 + this.m_radiospacing/2) + "px " + defaultVerticalAlignMargin/2 + "px" :
				(this.m_buttontopspacing+ "px " + this.m_radiospacing/2 + "px 0px "+ defaultVerticalAlignMargin/2 + "px");
	
	valueContainer.style.padding = (this.m_orientation == "vertical") ? "0px 0px 0px 0px" : "0px 4px 0px 0px";
	if (!IsBoolean(this.m_designMode)) {
		valueContainer.onchange = function() {
				temp.setButtonCss($(".RLContainer" + temp.m_componentid));
				$(this).css({
					"background-image" : "none",
					"outline" : "0",
					"-webkit-box-shadow" : "inset 0 2px 4px rgba(0,0,0,0.15),0 1px 2px rgba(0,0,0,0.05)",
					"-moz-box-shadow" : "inset 0 2px 4px rgba(0,0,0,0.15),0 1px 2px rgba(0,0,0,0.05)",
					"box-shadow" : "inset 0 2px 4px rgba(0,0,0,0.15),0 1px 2px rgba(0,0,0,0.05)",
					"background-color" : convertColorToHex(temp.m_selectioncolor),
					"color" : convertColorToHex(temp.m_selectionfontcolor)
				});
				var index = temp.m_categoryData.indexOf(radioLabel);
				temp.m_selectedindexarray = (index > -1) ? index : 0;
				temp.m_notifychange = true;
				temp.handleOnChangeEvent(radioObj, valueContainer, radioLabel);
			};
	}
	if (radioIndex == this.m_selectedindex) {
		this.m_selectedindexarray = this.m_selectedindex; // Added for filterSaver
		radioObj.setAttribute("checked", true);
		$(valueContainer).css({
			"background-image" : "none",
			"-webkit-box-shadow" : "inset 0 2px 4px rgba(0,0,0,0.15),0 1px 2px rgba(0,0,0,0.05)",
			"-moz-box-shadow" : "inset 0 2px 4px rgba(0,0,0,0.15),0 1px 2px rgba(0,0,0,0.05)",
			"box-shadow" : "inset 0 2px 4px rgba(0,0,0,0.15),0 1px 2px rgba(0,0,0,0.05)",
			"background-color" : convertColorToHex(temp.m_selectioncolor),
			"color" : convertColorToHex(temp.m_selectionfontcolor)
		});
		/** commented this method bcz connection loading multiple times  **/
		if(IsBoolean(this.m_enablegvautoupdate)){
			this.m_notifychange = this.m_notifygvautoupdate;
			this.handleOnChangeEvent(radioObj, valueContainer, radioLabel);
		}
	}
};

/**@description added method for enhanced radio button**/
RadioFilter.prototype.drawEnhanceButton = function (radioLabel, radioValue, containerDiv, labelObj, radioIndex, radioLength) {
	$("#enhancedradio").remove();
	var styleElem = document.head.appendChild(document.createElement("style"));
	styleElem.setAttribute("id", "enhancedradio");
	styleElem.innerHTML = ".enhance-radio label:before { content: ' '; display: inline-block !important; position: relative !important; top: "+this.m_enhanceradioobj.intialtop+"px !important; margin: "+this.m_enhanceradioobj.margin+" !important; width: "+this.m_enhanceradioobj.intialwidth+"px !important; height: "+this.m_enhanceradioobj.intialheight+"px !important; border-radius: 50% !important; border: "+this.m_enhanceradioobj.intialborder+" !important; background-color: "+this.m_enhanceradioobj.intialbackground+" !important; background-image: url(\""+this.m_enhanceradioobj.intialimg+"\") } .enhance-radio input[type=radio]:checked + label:after { border-radius: 50% !important; position: absolute !important; top:"+this.m_enhanceradioobj.selectedtop+"px !important; left:"+this.m_enhanceradioobj.selectedleft+"px !important; width:"+this.m_enhanceradioobj.selectedwidth+"px !important; height: "+this.m_enhanceradioobj.selectedheight+"px !important; content: ' '; background: "+this.m_enhanceradioobj.selectedbackground+" !important; background-image: url(\""+this.m_enhanceradioobj.selectedimg+"\") !important; display: block !important; }"; 

	//styleElem.innerHTML = '.enhance-radio label:before { content: " "; display: inline-block !important; position: relative !important; top: 5px !important; margin: 0 5px 0 0 !important; width: 20px !important; height: 20px !important; border-radius: 11px !important; border: 1px solid red !important; background-color: transparent !important; } .enhance-radio input[type=radio]:checked + label:after {border-radius: 11px !important;width: 5px !important;height: 5px !important;position: absolute !important;top: 12px !important;left: 7px !important;content: " "; display: block !important;background: red !important;}';
	//styleElem.innerHTML = '.enhance-radio label:before { content: " "; display: inline-block !important; position: relative !important; top: 5px !important; margin: 0 5px 0 0 !important; width: 20px !important; height: 20px !important; border-radius: 11px !important; border: 0px solid red !important;  background: #fff url("https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/basura.svg") no-repeat 50% !important;} .enhance-radio input[type=radio]:checked + label:after {border-radius: 11px !important;width: 12px !important;height: 12px !important;position: absolute !important;top: 12px !important;left: 7px !important;content: " "; display: block !important;background: black !important;background-image: url("https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/beacon.svg") !important;}';
	
	var temp = this;
	var radioObj = document.createElement("input");
	radioObj.setAttribute("type", "radio");
	radioObj.setAttribute("id", "radio" + this.m_componentid + "" + radioLabel+"-"+radioIndex);
	radioObj.setAttribute("class", "ui-helper-hidden-accessible");
	radioObj.setAttribute("name", (this.m_id != "") ? this.m_id : this.m_componentid);
	radioObj.setAttribute("value", radioValue);
	radioObj.style.verticalAlign = "text-top";
	radioObj.style.visibility = "hidden";
	
	var valueContainer = document.createElement("div");
	valueContainer.setAttribute("class", "RLContainer"+this.m_componentid);
	valueContainer.setAttribute("id", "RLContainer"+this.m_componentid + radioIndex);
	valueContainer.style.display = (this.m_orientation == "vertical") ? "inherit" : "inline-block";
	valueContainer.style.borderRadius = this.m_borderradius + "px";
	valueContainer.style.height = "auto";
	valueContainer.style.backgroundColor = this.m_buttoncolor;
	valueContainer.appendChild(radioObj);
	
	labelObj.setAttribute("For", "radio" + this.m_componentid + "" + radioLabel+"-"+radioIndex);
	labelObj.style.display = "inline-block";
	labelObj.style.wordWrap = "break-word";
	labelObj.style.cursor = this.m_cursortype;
	labelObj.style.margin = "6px 0px";
	labelObj.style.width = (this.m_orientation == "vertical") ? "100%" : "auto";
	labelObj.style.padding = (this.m_orientation == "vertical") ? this.m_buttonpadding + "px" : this.m_buttonpadding + "px 30px";
	valueContainer.appendChild(labelObj);
	this.setEnhancedButtonCss(valueContainer);
	containerDiv.appendChild(valueContainer);
	
	var hrl = document.createElement("hr");
	hrl.setAttribute("class", "hrl");
	var hrltop=this.m_hrltop,hrlbtm=this.m_hrlbtm;
	$(".hrl").css({"margin-top": hrltop,"margin-bottom":hrlbtm});
	
	var defaultVerticalAlignMargin = this.m_verticalpadding;
	valueContainer.style.margin = (this.m_orientation == "vertical") ?
			(defaultVerticalAlignMargin/2 + this.m_radiospacing) + "px " + defaultVerticalAlignMargin/2 + "px" :
				(this.m_buttontopspacing+ "px " + this.m_radiospacing + "px 0px 0px");

	if (!IsBoolean(this.m_designMode)) {
		this.setSlectionBackground(radioObj, valueContainer, radioLabel);
	}
	
	if(radioIndex !== radioLength && this.m_hrl && this.m_orientation == "vertical"){
		containerDiv.appendChild(hrl);
	}
	
	if (radioIndex == this.m_selectedindex) {
		this.m_selectedindexarray = this.m_selectedindex; // Added for filterSaver
		radioObj.setAttribute("checked", true);
		$(valueContainer).css({
			"background-image" : "none",
			"background-color" : convertColorToHex(temp.m_selectioncolor),
			"color" : convertColorToHex(temp.m_selectionfontcolor),
			"border" : "1px solid"+temp.m_buttoncolor
		});
		//commented this method bcz connection loading multiple times
		if(IsBoolean(this.m_enablegvautoupdate)){
			this.m_notifychange = this.m_notifygvautoupdate;
			this.handleOnChangeEvent(radioObj, valueContainer, radioLabel);
			if (this.m_viewtype === "button") {
				valueContainer.style.background = convertColorToHex(this.m_selectioncolor);
				valueContainer.style.color = convertColorToHex(this.m_selectionfontcolor);
			}
		}
	}
	
	/*DAS-251 support for filterchips*/
	var filterChipsObj = this.getFilterChipsComponentObj();
	if(filterChipsObj !== undefined){
		var prevTextArr = filterChipsObj.m_filterDisplayValues[this.m_objectid];
		if (filterChipsObj.m_removedChipValue !== undefined) {
			this.m_selectedindex = [];
		} else if (prevTextArr != undefined && prevTextArr.length > 0 && typeof this.m_selectedindex == "string") { //
			this.m_selectedindex = [];
		} else if (prevTextArr != undefined && prevTextArr.length > 0 && Array.isArray(this.m_selectedindex)) {
			var tempind = this.m_selectedindex;
			this.m_selectedindex = [];
			if (tempind !== "" && !Array.isArray(tempind))
				this.m_selectedindex.push(tempind)
			else if (Array.isArray(tempind) && tempind.indexOf("-1") >= 0)
				this.m_selectedindex = [];
			else
				this.m_selectedindex = tempind;
		} else {
			//do nothing
		}
		
		if (this.m_associatedfilterchipsid !== "" && filterChipsObj.m_removedChipValue !== undefined) {
			var arr = this.m_dataProvider.filter(function(obj) {
				for (var key in obj) {
					if (obj[key] == filterChipsObj.m_removedChipValue) {
						return obj;
					}
				}
			})
			removedInd = this.Value.indexOf(filterChipsObj.m_removedChipValue);
		}
		if (prevTextArr !== undefined && prevTextArr.length > 0 && arr !== undefined && arr.length > 0) {
			arr.map(function(ele) {
				if (prevTextArr.indexOf(ele[temp.m_categoryName[0]]) >= 0) {
					var ind = prevTextArr.indexOf(ele[temp.m_categoryName[0]]);
					var ind2 = filterChipsObj.m_savedtext.indexOf(ele[temp.m_categoryName[0]]);
					(ind >= 0) ? prevTextArr.splice(ind, 1): prevTextArr;
					(ind2 >= 0) ? filterChipsObj.m_savedtext.splice(ind2, 1): filterChipsObj.m_savedtext;
				}
			})
			temp.m_selectedindex = (prevTextArr.length == 0) ? [] : temp.m_selectedindex;
		}
		
	
	}
};
RadioFilter.prototype.drawEnhanceRadio = function (radioLabel, radioValue, containerDiv, labelObj, radioIndex, radioLength) {
	$("#enhancedradio").remove();
	var styleElem = document.head.appendChild(document.createElement("style"));
	styleElem.setAttribute("id", "enhancedradio");
	styleElem.innerHTML = ".enhance-radio label:before { content: ' '; display: inline-block !important; position: relative !important; top: "+this.m_enhanceradioobj.intialtop+"px !important; margin: "+this.m_enhanceradioobj.margin+" !important; width: "+this.m_enhanceradioobj.intialwidth+"px !important; height: "+this.m_enhanceradioobj.intialheight+"px !important; border-radius: 50% !important; border: "+this.m_enhanceradioobj.intialborder+" !important; background-color: "+this.m_enhanceradioobj.intialbackground+" !important; background-image: url(\""+this.m_enhanceradioobj.intialimg+"\") } .enhance-radio input[type=radio]:checked + label:after { border-radius: 50% !important; position: absolute !important; top:"+this.m_enhanceradioobj.selectedtop+"px !important; left:"+this.m_enhanceradioobj.selectedleft+"px !important; width:"+this.m_enhanceradioobj.selectedwidth+"px !important; height: "+this.m_enhanceradioobj.selectedheight+"px !important; content: ' '; background: "+this.m_enhanceradioobj.selectedbackground+" !important; background-image: url(\""+this.m_enhanceradioobj.selectedimg+"\") !important; display: block !important; }"; 

	//styleElem.innerHTML = '.enhance-radio label:before { content: " "; display: inline-block !important; position: relative !important; top: 5px !important; margin: 0 5px 0 0 !important; width: 20px !important; height: 20px !important; border-radius: 11px !important; border: 1px solid red !important; background-color: transparent !important; } .enhance-radio input[type=radio]:checked + label:after {border-radius: 11px !important;width: 5px !important;height: 5px !important;position: absolute !important;top: 12px !important;left: 7px !important;content: " "; display: block !important;background: red !important;}';
	//styleElem.innerHTML = '.enhance-radio label:before { content: " "; display: inline-block !important; position: relative !important; top: 5px !important; margin: 0 5px 0 0 !important; width: 20px !important; height: 20px !important; border-radius: 11px !important; border: 0px solid red !important;  background: #fff url("https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/basura.svg") no-repeat 50% !important;} .enhance-radio input[type=radio]:checked + label:after {border-radius: 11px !important;width: 12px !important;height: 12px !important;position: absolute !important;top: 12px !important;left: 7px !important;content: " "; display: block !important;background: black !important;background-image: url("https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/beacon.svg") !important;}';
	
	var temp = this;
	var radioObj = document.createElement("input");
	radioObj.setAttribute("type", "radio");
	radioObj.setAttribute("id", "radio" + this.m_componentid + "" + radioLabel+"-"+radioIndex);
	radioObj.setAttribute("class", "enhance-radio");
	radioObj.setAttribute("name", (this.m_id != "") ? this.m_id : this.m_componentid);
	radioObj.setAttribute("value", radioValue);
	radioObj.style.height = this.m_fontsize + "px";
	radioObj.style.margin = "0px 5px 0px 5px";
	radioObj.style.verticalAlign = "text-top";
	radioObj.style.cursor = this.m_cursortype;
	
	var valueContainer = document.createElement("div");
	valueContainer.setAttribute("class", "enhance-radio");
	valueContainer.style.display = (this.m_orientation == "vertical") ? "inherit" : "inline-block";
	valueContainer.style.borderRadius = this.m_borderradius + "px";
	valueContainer.style.height = this.fontScaling(this.m_radioitemheight) + "px";
	var radioDiv = document.createElement("div");
	radioDiv.style.cursor = this.m_cursortype;
	radioDiv.style.display = "table-cell";
	valueContainer.appendChild(radioObj);
	
	labelObj.setAttribute("For", "radio" + this.m_componentid + "" + radioLabel+"-"+radioIndex);
	labelObj.style.display = "table-cell";
	labelObj.style.wordWrap = "break-word";
	labelObj.style.cursor = this.m_cursortype;
	labelObj.style.margin = "0px";
	labelObj.style.width = (this.m_orientation == "vertical") ? "100%" : "auto";
	labelObj.style.height = this.m_radioitemheight + "px";
	valueContainer.appendChild(labelObj);
	containerDiv.appendChild(valueContainer);
	
	var hrl = document.createElement("hr");
	hrl.setAttribute("class", "hrl");
	var hrltop=this.m_hrltop,hrlbtm=this.m_hrlbtm;
	$(".hrl").css({"margin-top": hrltop,"margin-bottom":hrlbtm});
	
	var defaultVerticalAlignMargin = this.m_verticalpadding;
	valueContainer.style.margin = (this.m_orientation == "vertical") ?
			(defaultVerticalAlignMargin/2 + this.m_radiospacing) + "px " + defaultVerticalAlignMargin/2 + "px" :
				("0px " + this.m_radiospacing/2 + "px 0px "+ defaultVerticalAlignMargin/2 + "px");
	valueContainer.style.padding = (this.m_orientation == "vertical") ? "0px 0px 0px 0px" : "0px 4px 0px 0px";

	if (!IsBoolean(this.m_designMode)) {
		radioObj.onchange = function() {
			var index = temp.m_categoryData.indexOf(radioLabel);
			temp.m_selectedindexarray = (index > -1) ? index : 0;
			temp.m_notifychange = true;
			temp.handleOnChangeEvent(radioObj, valueContainer, radioLabel);
		};
	}
	
	if(radioIndex !== radioLength && this.m_hrl && this.m_orientation == "vertical"){
		containerDiv.appendChild(hrl);
	}
	
	if (radioIndex == this.m_selectedindex) {
		this.m_selectedindexarray = this.m_selectedindex; // Added for filterSaver
		radioObj.setAttribute("checked", true);

		//commented this method bcz connection loading multiple times
		if(IsBoolean(this.m_enablegvautoupdate)){
			this.m_notifychange = this.m_notifygvautoupdate;
			this.handleOnChangeEvent(radioObj, valueContainer, radioLabel);
			if (this.m_viewtype === "button") {
				valueContainer.style.background = convertColorToHex(this.m_selectioncolor);
				valueContainer.style.color = convertColorToHex(this.m_selectionfontcolor);
			}
		}
	}
	
	/*DAS-251 support for filterchips*/
	var filterChipsObj = this.getFilterChipsComponentObj();
	if(filterChipsObj !== undefined){
		var prevTextArr = filterChipsObj.m_filterDisplayValues[this.m_objectid];
		if (filterChipsObj.m_removedChipValue !== undefined) {
			this.m_selectedindex = [];
		} else if (prevTextArr != undefined && prevTextArr.length > 0 && typeof this.m_selectedindex == "string") { //
			this.m_selectedindex = [];
		} else if (prevTextArr != undefined && prevTextArr.length > 0 && Array.isArray(this.m_selectedindex)) {
			var tempind = this.m_selectedindex;
			this.m_selectedindex = [];
			if (tempind !== "" && !Array.isArray(tempind))
				this.m_selectedindex.push(tempind)
			else if (Array.isArray(tempind) && tempind.indexOf("-1") >= 0)
				this.m_selectedindex = [];
			else
				this.m_selectedindex = tempind;
		} else {
			//do nothing
		}
		
		if (this.m_associatedfilterchipsid !== "" && filterChipsObj.m_removedChipValue !== undefined) {
			var arr = this.m_dataProvider.filter(function(obj) {
				for (var key in obj) {
					if (obj[key] == filterChipsObj.m_removedChipValue) {
						return obj;
					}
				}
			})
			removedInd = this.Value.indexOf(filterChipsObj.m_removedChipValue);
		}
		if (prevTextArr !== undefined && prevTextArr.length > 0 && arr !== undefined && arr.length > 0) {
			arr.map(function(ele) {
				if (prevTextArr.indexOf(ele[temp.m_categoryName[0]]) >= 0) {
					var ind = prevTextArr.indexOf(ele[temp.m_categoryName[0]]);
					var ind2 = filterChipsObj.m_savedtext.indexOf(ele[temp.m_categoryName[0]]);
					(ind >= 0) ? prevTextArr.splice(ind, 1): prevTextArr;
					(ind2 >= 0) ? filterChipsObj.m_savedtext.splice(ind2, 1): filterChipsObj.m_savedtext;
				}
			})
			temp.m_selectedindex = (prevTextArr.length == 0) ? [] : temp.m_selectedindex;
		}
		
	
	}
};

RadioFilter.prototype.setEnhancedButtonCss = function(valueContainer) {
	var temp = this;
	$(valueContainer).css({
		"background-color": temp.m_buttoncolor,
		"background-repeat": "repeat-x",
	});
};

RadioFilter.prototype.setButtonCss = function(valueContainer) {
	var temp = this;
	$(valueContainer).css({
		"background-color": temp.m_buttoncolor,
		"background-image": "-moz-linear-gradient(top,#fff," + temp.m_buttoncolor + ")",
		"background-image": "-webkit-gradient(linear,0 0,0 100%,from(#fff),to("+ temp.m_buttoncolor + "))",
		"background-image": "-webkit-linear-gradient(top,#fff," + temp.m_buttoncolor + ")",
		"background-image": "-o-linear-gradient(top,#fff," + temp.m_buttoncolor + ")",
		"background-image": "linear-gradient(to bottom,#fff,"+ temp.m_buttoncolor + ")",
		"background-repeat": "repeat-x",
		"-webkit-box-shadow": "inset 0 1px 0 rgba(255,255,255,0.2),0 1px 2px rgba(0,0,0,0.05)",
		"-moz-box-shadow ": "inset 0 1px 0 rgba(255,255,255,0.2),0 1px 2px rgba(0,0,0,0.05)",
		"box-shadow": "inset 0 1px 0 rgba(255,255,255,0.2),0 1px 2px rgba(0,0,0,0.05)"
	});
};
RadioFilter.prototype.setSlectionBackground = function(radioObj, valueContainer, radioLabel) {
	var temp = this;
	radioObj.onchange = function() {
		/**DAS-884 */
		$(".RLContainer" + temp.m_componentid).css("background-color", (temp.m_viewtype === "radio") ? "" : convertColorToHex(temp.m_buttoncolor));
		/*Can be uncomment for selection color*/
		$(this).parent().css("background", convertColorToHex((temp.m_viewtype === "radio") ? temp.m_chromecolor : temp.m_selectioncolor));
		$(this).parent().css("border", "1px solid"+convertColorToHex((temp.m_viewtype === "radio") ? temp.m_chromecolor : temp.m_buttoncolor));
		var index = temp.m_categoryData.indexOf(radioLabel);
		temp.m_selectedindexarray = (index > -1) ? index : 0;
		temp.m_notifychange = true;
		temp.handleOnChangeEvent(radioObj, valueContainer, radioLabel);
	};
	/*Can be uncomment for Mouse Hover*/
	/*valueContainer.onmouseover = function () {
		$(this).css({
			"box-shadow": "inset 0px 0px 2px 1px " + convertColorToHex(temp.m_rollovercolor),
			"-webkit-box-shadow": "inset 0px 0px 2px 1px " + convertColorToHex(temp.m_rollovercolor)
		});
	};
	valueContainer.onmouseout = function () {
		$(this).css({
			"box-shadow": "inset 0px 0px 0px 0px " + convertColorToHex(temp.m_rollovercolor),
			"-webkit-box-shadow": "inset 0px 0px 0px 0px " + convertColorToHex(temp.m_rollovercolor)
		});
	};*/
};
/** @description handled the event of radio . **/
RadioFilter.prototype.handleOnChangeEvent = function (radioObj, valueContainer, radioLabel) {
	var temp = this;
	var fieldNameValueMap = {};
	var fieldName = (temp.getFieldName() == "" || temp.getFieldName() == undefined) ? "Value" : temp.getFieldName();
	fieldNameValueMap[fieldName] = ("" + radioObj.value).replace(/^ +/gm, "");
	/** Adding the label to the drill object **/
	fieldNameValueMap["Label"] = radioLabel;
	if (this.componentJson.variable != undefined){
		for (var i = 0; i < this.componentJson.variable.DefaultValues.DefaultValue.length; i++) {
			fieldNameValueMap[this.componentJson.variable.DefaultValues.DefaultValue[i].name] = ("" + radioObj.value).replace(/^ +/gm, "");
		}
	}
	temp.updateDataPoints(fieldNameValueMap);
};
/** @description used for create the Label element for show the name of radio. **/
RadioFilter.prototype.drawLabel = function (labelText) {
	var labelObj = document.createElement("label");
	labelObj.appendChild(document.createTextNode(labelText));
	labelObj.style.color = convertColorToHex(this.m_fontcolor);
	labelObj.style.fontSize = this.fontScaling(this.m_fontsize) + "px";
	labelObj.style.fontFamily = selectGlobalFont(this.m_fontfamily);
	labelObj.style.fontStyle = this.m_fontstyle;
	labelObj.style.fontWeight = this.m_fontweight;
	labelObj.style.verticalAlign = "middle";
	return labelObj;
};
//# sourceURL=RadioFilter.js