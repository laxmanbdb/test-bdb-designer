/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: FilterSaver.js
 * @description FilterSaver component
 **/
function FilterSaver(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();

	this.m_height = "";
	this.m_width = "";
	this.m_tooltip = "";
	this.m_chromecolor = "";
	this.m_label = "";
	this.m_fontfamily = "";
	this.m_fontsize = "12";
	this.m_color = "";
	this.m_fontweight = "";
	this.m_fontstyle = "";
	this.m_objectId = 0;
	this.m_chartRef;
	this.m_objectID = [];
	this.m_componentid;
	this.m_borderradius = 0;
	this.m_iconfontsize = 12;
	this.m_checkboxfontsize = 14;

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_cursortype = "pointer";
	this.isCriteriaUpdated  = false;
	this.dashboardCriteriaList = [];
	//this.m_cascadingarraydef = [];
	this.m_filtersavermap = {
		"enableCheckBox": "false",
		"popupHeaderText": "Filter Saver",
		"popupAddCriteriaText": "Add Criteria",
		"popupListCriteriaText": "Criteria List",
		"listFilterComponents": "",
		"cascadingDefinition": []
	}
	this.m_updateddesign = true;
};
FilterSaver.prototype = new Widget;

FilterSaver.prototype.setProperty = function(chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};
FilterSaver.prototype.initCanvas = function() {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};
FilterSaver.prototype.getObjectName = function() {
	return this.getObjectType();
};
FilterSaver.prototype.ParseJsonAttributes = function(jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == 'FilterSaver') {
			for (var key1 in jsonObject[key]) {
				this.setAttributeValueToNode(key1, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};
FilterSaver.prototype.initializeDraggableDivAndCanvas = function(dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
};
FilterSaver.prototype.setDashboardNameAndObjectId = function() {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "FilterSaver" + this.m_objectid;
};
FilterSaver.prototype.draw = function() {
	this.drawObject();
};
FilterSaver.prototype.drawObject = function() {
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback != ""){
		onAfterRender(this.m_onafterrendercallback);
	}
};
FilterSaver.prototype.init = function() {
	this.setBorderRadius();
};
FilterSaver.prototype.setBorderRadius = function() {
	var radius = (typeof InstallTrigger !== 'undefined') ? (this.m_borderradius) : (((this.m_borderradius > 15) && (this.m_height < 50)) ? 14 : this.m_borderradius);
	this.m_borderradius = (this.m_height >= 20) ? radius : 9;
};
FilterSaver.prototype.drawChart = function() {
	this.createButtonDIv();
	//this.initMouseAndTouchEvent("#" + this.m_objectid);
	this.initMouseAndTouchEventSVC("#" + this.m_objectid);
};
FilterSaver.prototype.createButtonDIv = function() {
	var temp = this;
	$("#" + temp.m_objectid).remove();
	var button = document.createElement('input');
	button.setAttribute('type', "button");
	button.setAttribute('id', temp.m_objectid);
	var padding = ((this.m_height - this.fontScaling(this.m_fontsize * 1) * 1.5)/2);
	$(button).css({
		"height": this.m_height + "px",
		"width": (this.m_width) + "px",
		"font": this.m_fontstyle + " " + this.m_fontweight + " " + this.fontScaling(this.m_fontsize) + "px " + selectGlobalFont(this.m_fontfamily),
		"background": convertColorToHex(this.m_chromecolor),
		"color": convertColorToHex(this.m_color),
		"border": "5px",
		"border-radius": this.m_borderradius + 'px',
		"padding": padding+"px 2px "+padding+"px 2px"
	});
	button.value = this.formattedDescription(this, this.m_label);
	$('#draggableDiv' + temp.m_objectid).append(button);
	return button;
};
FilterSaver.prototype.createPopupForFilterSaver = function() {
	var topControlBtnContainer = document.createElement("div");
	topControlBtnContainer.setAttribute("class", "filterSvaer-controlBtn-container");
	
	var addCriteriaBtn = this.createControlButton("addCriteria", this.m_filtersavermap.popupAddCriteriaText); 
	var getCriteriaBtn = this.createControlButton("getCriteriaList", this.m_filtersavermap.popupListCriteriaText); 
	topControlBtnContainer.appendChild(addCriteriaBtn);
	topControlBtnContainer.appendChild(getCriteriaBtn);

	var pop = this.mainDiv(); 
	pop.appendChild(topControlBtnContainer); 
	var mainContainer = document.createElement("div"); 
	mainContainer.setAttribute("id", "mainContainer" + this.m_objectid);
	mainContainer.setAttribute("class", "filterSaver-mainContainer");
	pop.appendChild(mainContainer);
	
	$(pop).dialog({
		title: this.m_filtersavermap.popupHeaderText,
		closed: false,
		cache: false,
		modal: true,
		draggable: false,
		position: {
            my: "center",
            at: "center",
            of: window
        },
		onClose: function() {
			$('#dialogdiv').dialog("destroy");
		},
	});
	$(".panel-title").css({
		"background-color": (IsBoolean(this.m_updateddesign) ? '#ffffff' : this.m_chromeColor),
		"padding": (IsBoolean(this.m_updateddesign) ? '24px' : '5px'),
		"font-style": this.m_fontstyle,
		"font-weight": (IsBoolean(this.m_updateddesign) ? '800' : this.m_fontweight),
		"font-size": (IsBoolean(this.m_updateddesign) ? "24px" : (this.fontScaling(this.m_fontsize) + "px")),
		"font-family": selectGlobalFont(this.m_fontfamily),
		"color": (IsBoolean(this.m_updateddesign) ? '#434344' : this.m_color),
		"text-align": (IsBoolean(this.m_updateddesign) ? 'left' : 'center') 
	});
	$(".panel-tool").css({
		"height": "21px",
		"width": "26px",
		"margin": "-14px 3px 0px 0px"
	});
	$(".panel-tool a").css("vertical-align", "middle");
	$("dialogdiv .panel-header, .panel-body").css({
		"font-style": this.m_fontstyle,
		"font-weight": this.m_fontweight,
		"font-size": this.fontScaling(this.m_fontsize) + "px",
		"font-family": selectGlobalFont(this.m_fontfamily),
		"border-style": "none"
	});
	$(".window").css("background", "linear-gradient(to bottom,#ffffff 0,#ffffff 20%)");
	$(".window-shadow").css("display", "none");

	this.initializeClickEvents();
};
/** @description method will create firstinnerdiv mode buttons **/
FilterSaver.prototype.createControlButton = function(id, value) {
	var Button = document.createElement('input');
	Button.type = "button";
	Button.setAttribute('id', id + this.m_objectid);
	Button.setAttribute('class', "filterSaverControlBtn");
	Button.value = value;
	$(Button).css({
		"font": "normal" + " " + (IsBoolean(this.m_updateddesign) ? '600' : 'normal') + " " + (IsBoolean(this.m_updateddesign) ? '18' : '14') * this.minWHRatio() + "px " + (IsBoolean(this.m_updateddesign) ? this.m_fontfamily : selectGlobalFont(this.m_defaultFontFamily)),
		"cursor": this.m_cursortype,
		"box-shadow": (IsBoolean(this.m_updateddesign) ? 'none' : "rgba(0, 0, 0, 0.14) 0px 0px 2px 0px, rgba(0, 0, 0, 0.01) 0px 0px 0px 1px"),
	});
	return Button;
};
/** @description method will create pop div for dialog **/
FilterSaver.prototype.mainDiv = function() {
	var dialogdiv = document.createElement('div');
	dialogdiv.id = "dialogdiv";
	var width = (!IsBoolean(this.m_designMode) && this.m_dashboard.m_AbsoluteLayout.m_layouttype == "MobileLayout") ? "90%" : (IsBoolean(this.m_updateddesign) ? "700px" : "500px");
	$(dialogdiv).css({
		"width": width,
		"height": "auto",
		"padding": (IsBoolean(this.m_updateddesign) ? "13px" : "0px"),
		"color": (IsBoolean(this.m_updateddesign) ? "#434344" : this.m_color)
	});
	return dialogdiv;
};
/** @description method will create secondinnerdiv with all components names **/
FilterSaver.prototype.createFilterInfoContainer = function() {
	var widgetArray = this.m_dashboard.m_widgetsArray; // dashboard components array 
	var boxSecondInnerDiv = document.createElement("div");
	boxSecondInnerDiv.setAttribute("id", "boxSecondInnerDiv");
	boxSecondInnerDiv.setAttribute("class", "filterSaver-filterInfoListContainer");
	if(IsBoolean(this.m_updateddesign)){
		boxSecondInnerDiv.setAttribute("class", "filterSaver-filterInfoListCont");
	} else {
		boxSecondInnerDiv.setAttribute("class", "filterSaver-filterInfoListContainer");
	}

	var ul = document.createElement("ul");
	ul.setAttribute("class", "filterSaver-filterInfo-ul");
	boxSecondInnerDiv.append(ul);

	if (this.m_filtersavermap.listFilterComponents === "") {
	    for (var k = 0; k < widgetArray.length; k++) {
	        if (widgetArray[k].m_objecttype == "filter") {
	            var cObj = widgetArray[k];
	            if (cObj.m_variable.DefaultValues.DefaultValue.length > 0 && cObj.fieldNameValueMap) {
	                var innerHTML = [];
	                var compInfo = {
	                    "compName": cObj.chartJson.designData["class"],
	                    "compId": cObj.m_title.m_description //cObj.m_objectname cObj.m_variable["Key"]
	                };
	                if (cObj.chartJson && (cObj.chartJson.componentType == "combo_filter" || cObj.chartJson.componentType == "list_filter")) {
	                    innerHTML.push({
	                        "name": cObj.m_categoryName[0],
	                        "value": cObj.fieldNameValueMap[cObj.m_categoryName[0]]
	                    });
	                } else if (cObj.chartJson && (cObj.chartJson.componentType == "radio_filter")) {
	                    innerHTML.push({
	                        "name": "Label",
	                        "value": cObj.fieldNameValueMap["Label"]
	                    });
	                } else if (cObj.chartJson && (cObj.chartJson.componentType == "hierarchical_combo")) {
	                    for (var l = 0; l < cObj.m_variable.DefaultValues.DefaultValue.length; l++) {
	                        var dValues = cObj.m_variable.DefaultValues.DefaultValue[l];
	                        innerHTML.push({
	                            "name": dValues.name,
	                            "value": cObj.fieldNameValueMap[dValues.name]
	                        });
	                    }
	                }
	                this.createRow(cObj.m_objectid, compInfo, innerHTML, ul);
	            }
	        }
	    }
	} else {
	    for (var k = 0; k < widgetArray.length; k++) {
	        if (widgetArray[k].m_objecttype == "filter" && (this.m_filtersavermap.listFilterComponents).indexOf(widgetArray[k].m_referenceid) > -1) {
	            var cObj = widgetArray[k];
	            if (cObj.m_variable.DefaultValues.DefaultValue.length > 0 && cObj.fieldNameValueMap) {
	                var innerHTML = [];
	                var compInfo = {
	                    "compName": cObj.chartJson.designData["class"],
	                    "compId": cObj.m_title.m_description //cObj.m_objectname cObj.m_variable["Key"]
	                };
	                if (cObj.chartJson && (cObj.chartJson.componentType == "combo_filter" || cObj.chartJson.componentType == "list_filter")) {
	                    innerHTML.push({
	                        "name": cObj.m_categoryName[0],
	                        "value": cObj.fieldNameValueMap[cObj.m_categoryName[0]]
	                    });
	                } else if (cObj.chartJson && (cObj.chartJson.componentType == "radio_filter")) {
	                    innerHTML.push({
	                        "name": "Label",
	                        "value": cObj.fieldNameValueMap["Label"]
	                    });
	                } else if (cObj.chartJson && (cObj.chartJson.componentType == "hierarchical_combo")) {
	                    for (var l = 0; l < cObj.m_variable.DefaultValues.DefaultValue.length; l++) {
	                        var dValues = cObj.m_variable.DefaultValues.DefaultValue[l];
	                        innerHTML.push({
	                            "name": dValues.name,
	                            "value": cObj.fieldNameValueMap[dValues.name]
	                        });
	                    }
	                }
	                this.createRow(cObj.m_objectid, compInfo, innerHTML, ul);
	            }
	        }
	    }
	}

	$("#mainContainer" + this.m_objectid).append(boxSecondInnerDiv);
};
/** @description It will create criteria name text box  */
FilterSaver.prototype.createCriteriaNameInputContainer = function() {
	var temp = this;
	var criteriaNameDiv = document.createElement("div");
	criteriaNameDiv.setAttribute('id', "criteriaNameDiv" + this.m_objectid);
	/*criteriaNameDiv.setAttribute("class", "filterSaver-criteriaNameDiv");*/
	if(IsBoolean(this.m_updateddesign)){
		criteriaNameDiv.setAttribute("class", "filterSaver-crtriaNameDiv");
	} else {
		criteriaNameDiv.setAttribute("class", "filterSaver-criteriaNameDiv");
	}
	
	var textBox = document.createElement("input");
	textBox.type = "text";
	textBox.setAttribute("id", "criteriaSaverTextBox" + temp.m_objectid);
	textBox.innerHTML = "";
	this.setFontCSS(textBox);
	
	textBox.setAttribute("placeholder", "Enter criteria name");
	criteriaNameDiv.appendChild(textBox);
	
	$("#mainContainer" + this.m_objectid).append(criteriaNameDiv);
};
/** @description It will draw dashboard criteria list */
FilterSaver.prototype.drawCriteriaList = function() {
	var temp = this;
	$("#criteriaList" + temp.m_objectid).remove();
	var criteriaListDiv = document.createElement("div");
	criteriaListDiv.setAttribute("id", "criteriaList" + temp.m_objectid);
	criteriaListDiv.setAttribute("class", "filterSaverListDiv");

	var ul = document.createElement("ul");
	ul.setAttribute("id", "criteriaUL" + temp.m_objectid);
	
	for (var i = 0; i < this.dashboardCriteriaList.length; i++) {
		var cObj = this.dashboardCriteriaList[i];
		var li = temp.createList(cObj);
		ul.appendChild(li);
	}
	$(criteriaListDiv).append(ul);
	$("#mainContainer" + this.m_objectid).append(criteriaListDiv);
	$("#criteriaList" + temp.m_objectid).hide();
	return criteriaListDiv;
};
/** @description create info div when filter component info and saved criteria list is empty */
FilterSaver.prototype.createEmptyListAlert = function (id, status) {
	var temp = this;
	$("#" + id + temp.m_objectid).remove();
	var div = document.createElement("div");
	div.setAttribute("id", id + temp.m_objectid);
	if(IsBoolean(this.m_updateddesign)){
		div.setAttribute("class", "filterSaver-emptyListAlrt");
	} else {
		div.setAttribute("class", "filterSaver-emptyListAlert");
	}
	var lbl = document.createElement("span");
	lbl.innerHTML = status;
	this.setFontCSS(lbl);
	
	$(div).append(lbl);
	$("#mainContainer" + this.m_objectid).append(div);
	$(div).hide();
};

/** @description Will display modal popup to delete criteria*/
FilterSaver.prototype.deleteCriteriaPopUpModal = function(cName, cIds) {
    var temp = this;
    $("#deletetCriteriaPopUp" + temp.m_objectid).remove();
    $("#transparentBGDiv" + temp.m_objectid).remove();
    var transparentBGDiv = document.createElement("div");
    transparentBGDiv.setAttribute("id", "transparentBGDiv" + temp.m_objectid);
    transparentBGDiv.setAttribute("class", "filterSaver-deleteCriteriaPopUp-bgDiv");
    var h = $(".window").height();
    transparentBGDiv.style.height = (h + 10) + "px";

    var div = document.createElement("div");
    div.setAttribute("id", "deletetCriteriaPopUp" + temp.m_objectid);
    div.setAttribute("class", "filterSaver-deleteCriteriaPopUp");
    
    var htmlContent = "<div style='background-color: #006684; width: 100%; height: 24%;'> <span style='float: left; padding: 8px; color: #ffffff;'> Delete Criteria </span>   <span class='bdmenuicon icons bd-close close-modalPopUp'  title='Close' style='float: right; padding: 8px; color: #ffffff; cursor: pointer;'></span>  </div>" +
        "<div style='height: 52%; width: 100%; background-color: #ffffff; text-align: left; padding: 20px 8px 20px 8px;'>Do you want to delete criteria '" + cName + "'. </div>" +
        "<div style='width: 100%; height: 24%; background-color: #eaeaea; padding: 3px;'> <button class='filterSaver-DelPopUpBtns close-modalPopUp' style='background:rgb(255,87,34); float: right;'>No</button> <button class='filterSaver-DelPopUpBtns' id='delCriteria'style='background-color: #006684; float: right;'> Yes </button> </div>";
    div.innerHTML = htmlContent;
    transparentBGDiv.appendChild(div);
    $("#dialogdiv").append(transparentBGDiv);

    $(div).find("#delCriteria").on("click", function(e) {
        temp.deleteDashboardCriterias({
            "selectedIds": cIds
        });
        $(transparentBGDiv).remove();
    });
    $(div).find(".close-modalPopUp").on("click", function(e) {
        $(transparentBGDiv).remove();
    });
};
/** @description It will create criteria list
 * @param { object } cObj - dashboard criteria object 
 * */
FilterSaver.prototype.createList = function(cObj) {
    var temp = this;
    var li = document.createElement("li");
	li.setAttribute('id', "li" + cObj.id);
	li.setAttribute('class', "filterSaver-li");

	var label = document.createElement("span");
	label.setAttribute("class", "filterSaver-li-label");
	label.innerHTML = cObj.criteriaName;
	label.title = cObj.criteriaName;
	this.setFontCSS(label);
    
	var apply = temp.createCriteriaListControlBtns("apply" + cObj.id, "Apply", cObj, "bd-ok");
    var del = temp.createCriteriaListControlBtns("delete" + cObj.id, "Delete", cObj, "bd-cross");

    li.appendChild(label);
    li.appendChild(apply);
    li.appendChild(del);
    
    return li;
};

/** @description It will create criteria list control buttons
 *  @param { string } id - button id
 *  @param { string } value - button value or name
 * @param { object } cObj - dashboard criteria object 
 * */
FilterSaver.prototype.createCriteriaListControlBtns = function(id, value, cObj, icon) {
    var temp = this;
    var controlButton = document.createElement("span");
    controlButton.setAttribute('id', id + temp.m_objectid);
    controlButton.setAttribute("class", "filterSaver-li-controlBtn bdmenuicon icons " + icon);
    //controlButton.title = value;
    controlButton.value = value;
    $(controlButton).on("mouseenter", function(e){
		//$(this).css({"color": "#000000"});
		temp.removeToolTipDiv();
		var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
		var scrollLeft =  parentDiv.scrollLeft;
		var scrollTop =  parentDiv.scrollTop;
		var offset = $(parentDiv).offset();
		var PageTop =  offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
		var PageLeft = offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft; 
		var offsetLeft = $(this)[0].offsetLeft;
		var offsetTop = $(this)[0].offsetTop;
		var divTop = e.pageY - e.offsetY- PageTop + 30;
		var divLeft = e.pageX - PageLeft - offsetLeft + 25;
		var tooltipDiv = document.createElement("div");
		tooltipDiv.innerHTML = value;
		tooltipDiv.setAttribute("id", "toolTipDiv");
		tooltipDiv.setAttribute("class", "settingIcon");
		tooltipDiv.setAttribute("placement", "bottom");
		$(document.body).append(tooltipDiv);
		
		var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
			"top": divTop + "px",
			"left": divLeft + "px"
		});
		$(tooltipDiv).css(tooltipObjCss);
		var wd = tooltipDiv.offsetWidth * 1;
		ht = tooltipDiv.offsetHeight * 1;
		var lt = e.pageX - e.offsetX - PageLeft - (wd/2) + 14 +  "px";
				$(tooltipDiv).css("left",lt);
				//$(tooltipDiv).css("box-shadow","0 5px 15px -5px rgb(0 0 0 / 50%)");
	}).on("mouseleave", function(){
		//$(this).css({"color": convertColorToHex(temp.m_menupanelfontcolor)});
		temp.removeToolTipDiv();
	});
    $(controlButton).css({
		"font-size": this.fontScaling(this.m_iconfontsize) + "px",
	});

    $(controlButton).bind("click", cObj, function(event) {
        var cObj = event.data;
        var dId;
        switch (this.value) {
            case "Delete":
                var criteriaIds = [];
                dId = temp.m_dashboard.m_dashboardjson.Niv.Dashboard.backendId;
                if (dId != "" && dId != null) {
                	criteriaIds.push(cObj["id"]);
                    temp.deleteCriteriaPopUpModal(cObj["criteriaName"], criteriaIds);
                }
                break;
            case "Apply":
                dId = temp.m_dashboard.m_dashboardjson.Niv.Dashboard.backendId;
                if (dId != "" && dId != null) {
                    temp.getDashboardCriteriaById({
                        "criteriaId": cObj["id"]
                    });
                }
                break;

            default:
        }
    });
    return controlButton;
};
/** @description method will apply selected criteria on filter component**/
FilterSaver.prototype.applyDashboardCriteria = function(criteriaArray) {
	var criteriaList = criteriaArray;
	var cList = [];
	/**Arranging the criteriaArray in cascaded filter flow order**/
	if (this.m_filtersavermap.cascadingDefinition.length > 0) {
		for (var a = 0 ; a < this.m_filtersavermap.cascadingDefinition.length; a++) {
			for (var b = 0; b < criteriaList.length; b++) {
				if (this.m_filtersavermap.cascadingDefinition[a] === criteriaList[b].key ) {
					cList.push(criteriaList[b]);
				}
			}
		}
	} else {
		cList = criteriaList;
	}
	
	if (cList.length > 0) {
		if (this.m_filtersavermap.cascadingDefinition.length !== 0) {
			for (var i = cList.length - 1; i >= 0; i--) {
				if (i === 0){
					var gvObj = cList[i];
					sdk.updateGlobalVariable(gvObj.key, gvObj.attributes);
					var compObj = sdk.getWidget(gvObj.key);
					this.updateComponentSelectedIndex(compObj, gvObj);
				} else {
					var gvObj = cList[i];
					sdk.updateGlobalVariable(gvObj.key, gvObj.attributes);
					var compObj = sdk.getWidget(gvObj.key);
					this.updateOnlyComponentSelectedIndex(compObj, gvObj);
				}
			}
		} else {
			for (var i = 0; i < cList.length; i++) {
				var gvObj = cList[i];
				sdk.updateGlobalVariable(gvObj.key, gvObj.attributes);
				var compObj = sdk.getWidget(gvObj.key);
				this.updateComponentSelectedIndex(compObj, gvObj);
			}
		}
	}
	//this.handleOnChangeEvent();
	$('#dialogdiv').dialog("destroy");
};
/** @description method will update selected index to component object before redraw **/
FilterSaver.prototype.updateComponentSelectedIndex = function(compObj, criteriaObj) {
    if (compObj) {
	    switch (compObj.chartJson.componentType) {
	        case "combo_filter":
	            compObj.m_selectedindex = criteriaObj.selectedIndex;
	            compObj.draw();
	            break;
	        case "list_filter":
	            compObj.m_selectedindex = criteriaObj.selectedIndex;
	            compObj.draw();
	            break;
	        case "checkbox_filter":
	            var flag = (criteriaObj.selectedIndex == "1") ? true : false;
	            compObj.m_checkboxselected = flag;
	            compObj.draw();
	            break;
	        case "radio_filter":
	            compObj.m_selectedindex = criteriaObj.selectedIndex;
	            compObj.draw();
	            break;
	        case "hierarchical_combo":
	            if (IsBoolean(compObj.m_allowmultipleselection)) {
	                compObj.m_currentIndexSelect = criteriaObj.selectedIndex;
	                jqEasyUI("#ComboTree" + compObj.m_componentid).combotree("setValues", compObj.m_currentIndexSelect);
	            } else {
	                compObj.m_currentIndexSelect = criteriaObj.selectedIndex;
	                jqEasyUI("#ComboTree" + compObj.m_componentid).combotree("setValue", compObj.m_currentIndexSelect);
	            }
	            break;
	        default:
	    }
    }
};
/** @description method will update selected index to component object **/
FilterSaver.prototype.updateOnlyComponentSelectedIndex = function(compObj, criteriaObj) {
    if (compObj) {
	    switch (compObj.chartJson.componentType) {
	        case "combo_filter":
	            compObj.m_selectedindex = criteriaObj.selectedIndex;
	            break;
	        case "list_filter":
	            compObj.m_selectedindex = criteriaObj.selectedIndex;
	            break;
	        case "checkbox_filter":
	            var flag = (criteriaObj.selectedIndex == "1") ? true : false;
	            compObj.m_checkboxselected = flag;
	            break;
	        case "radio_filter":
	            compObj.m_selectedindex = criteriaObj.selectedIndex;
	            break;
	        case "hierarchical_combo":
	            if (IsBoolean(compObj.m_allowmultipleselection)) {
	                compObj.m_currentIndexSelect = criteriaObj.selectedIndex;
	                jqEasyUI("#ComboTree" + compObj.m_componentid).combotree("setValues", compObj.m_currentIndexSelect);
	            } else {
	                compObj.m_currentIndexSelect = criteriaObj.selectedIndex;
	                jqEasyUI("#ComboTree" + compObj.m_componentid).combotree("setValue", compObj.m_currentIndexSelect);
	            }
	            break;
	        default:
	    }
    }
};
/** @description method will create dashboard criteria table  **/
FilterSaver.prototype.createRow = function(id, compInfo, dValues, ul) {
    var temp = this;
    var li = document.createElement("li");
	li.setAttribute('id', "filterDetailLi" + id);
	/*li.setAttribute('class', "filterSaver-filterInfo-li");*/
	if(IsBoolean(this.m_updateddesign)){
		li.setAttribute('class', "filterSaver-flterInfo-li");
	} else {
		li.setAttribute('class', "filterSaver-filterInfo-li");
	}
	
	if (IsBoolean(this.m_filtersavermap.enableCheckBox)) {
		var checkbox = document.createElement("span");
		checkbox.setAttribute("class", "li-inputCheck filterSaver-li-controlBtn");
		var checkboxbutton = this.createCheckBoxButton(id);
		checkbox.appendChild(checkboxbutton);
		li.appendChild(checkbox);
	}

	var fLabel = document.createElement("span");
	fLabel.setAttribute("class", "filterSaver-filterInfo-li-label");
	fLabel.setAttribute("id", id);
	//fLabel.innerHTML = compInfo["compName"] + "  [<span style='font-style: italic;'> " + compInfo["compId"] + " </span> ]  ";
	fLabel.innerHTML = "<span style='font-style: (IsBoolean(this.m_updateddesign) ? normal : italic);'> " + compInfo["compId"] + " </span> ";
	this.setFontCSS(fLabel);

	/*var filterDisplayInfoIcon = document.createElement("span");
	filterDisplayInfoIcon.setAttribute("class", "filterSaver-li-controlBtn bd-arrow-left2 accordion");
	filterDisplayInfoIcon.title = "Show Filter Display Value";*/
	var filterDisplayInfoDiv = document.createElement("div");
	filterDisplayInfoDiv.setAttribute("class","filterDisplayInfoDiv panel");
	for (var j = 0; j < dValues.length; j++) {
		var displayName = document.createElement("span");
		displayName.setAttribute("class","filterDisplayInfoSpan-left");
		displayName.innerHTML = dValues[j].name;
		this.setFontCSS(displayName);
		
		var displayValue = document.createElement("span");
		displayValue.setAttribute("class","filterDisplayInfoSpan-right");
		displayValue.innerHTML = dValues[j].value;
		this.setFontCSS(displayValue);
		
		filterDisplayInfoDiv.appendChild(displayName);
		filterDisplayInfoDiv.appendChild(displayValue);
	}
	
	//li.appendChild(checkbox);
	li.appendChild(fLabel);
	//li.appendChild(filterDisplayInfoIcon);
	$(ul).append(li);
	$(ul).append(filterDisplayInfoDiv);
	
		/*$(filterDisplayInfoIcon).css({
		"font-size": this.fontScaling(this.m_iconfontsize) + "px",
		"transform": "rotate(-90deg)",
		"color": "#777",
		"border": "none",
    	"background": "none",
    	"padding": "8px"
	});*/
	
	if (!temp.m_designMode) {
		/** initialize clear text button event */
		/*if (detectDevice.mobile() || detectDevice.tablet()) {
			filterDisplayInfoIcon.addEventListener("touchstart", function (event) {
				this.classList.toggle("active");
			    var panel = $(this).parent()[0].nextElementSibling;
			    if (panel.style.display === "block") {
			      panel.style.display = "none";
			      $(this).css("transform", "rotate(-90deg)");
			    } else {
			      panel.style.display = "block";
			      $(this).css("transform", "rotate(90deg)");
			    }
			}, false);
		} else {
			filterDisplayInfoIcon.addEventListener("click", function (event) {
				this.classList.toggle("active");
			    var panel = $(this).parent()[0].nextElementSibling;
			    if (panel.style.display === "block") {
			      panel.style.display = "none";
			      $(this).css("transform", "rotate(-90deg)");
			    } else {
			      panel.style.display = "block";
			      $(this).css("transform", "rotate(90deg)");
			    }
			}, false);
		}*/
	}
};

FilterSaver.prototype.initMouseAndTouchEvent = function (comp) {
	if (!IsBoolean(this.m_designMode)) {
		var temp = this;
		this.checkToolTipDesc = this.updateToolTipInfo(this.m_tooltip);
		var mousemoveFn = function (e) {
			if (!temp.m_designMode && temp.m_tooltip != "" && temp.m_tooltip != " ") {
				e.stopPropagation();
				temp.removeToolTipDiv();
				var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
				var scrollLeft =  parentDiv.scrollLeft;
				var scrollTop =  parentDiv.scrollTop;
				var offset = $(parentDiv).offset();
				var PageTop =  offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
				var PageLeft = offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft; 
				var offsetLeft = $(this)[0].offsetLeft;
				var offsetTop = $(this)[0].offsetTop;
				var divTop = e.pageY - PageTop - offsetTop + 5;
				var divLeft = e.pageX - PageLeft - offsetLeft + 5;
				var tooltipDiv = document.createElement("div");
				tooltipDiv.innerHTML = temp.checkToolTipDesc;
				tooltipDiv.setAttribute("id", "toolTipDiv");
				tooltipDiv.setAttribute("class", "settingIcon");
				tooltipDiv.setAttribute("placement", "bottom");
				$(".draggablesParentDiv").append(tooltipDiv);
				
				/*var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
					"top": divTop + "px",
					"left": divLeft + "px"
				});
				$(tooltipDiv).css(tooltipObjCss);*/
				
				var wd = temp.m_width * 1,
				ht = temp.m_height * 1;
				var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
					"top": e.pageY - e.offsetY + ht  - PageTop - offsetTop - 11 + "px",
					"left": e.pageX - e.offsetX - PageLeft - offsetLeft + 10 + "px"
				});
				//"top": temp.m_top + ht  - PageTop - offsetTop - 11 + "px",
				//"left": temp.m_left  - PageLeft - offsetLeft + 10 + "px"
				$(tooltipDiv).css(tooltipObjCss);
				//var lt =  temp.m_left + (wd/2) - (tooltipDiv.offsetWidth/2) - PageLeft - offsetLeft +5+ "px";
				var lt =  e.pageX - e.offsetX + (wd/2) - (tooltipDiv.offsetWidth/2) - 8 +  "px";
				$(tooltipDiv).css("left",lt);
				$(tooltipDiv).css("box-shadow","0 5px 15px -5px rgb(0 0 0 / 50%)");
				
				/** Adjust if going out of boundary **/
				if (divTop * 1 + 10 * 1 + $(tooltipDiv).height() * 1 > temp.m_dashboard.m_AbsoluteLayout.m_height*1 + scrollTop) {
					divTop = PageTop * 1 - 10 + scrollTop * 1 - $(tooltipDiv).height() * 1;
					$(tooltipDiv).css("top", divTop);
				}
				if (divLeft * 1 + 10 * 1 + $(tooltipDiv).width() * 1 > temp.m_dashboard.m_AbsoluteLayout.m_width*1 + scrollLeft) {
					divLeft = divLeft - $(tooltipDiv).width() * 1;
					$(tooltipDiv).css("left", divLeft);   
				}
			}
		};
		var mouseoutFn = function(e){
			temp.removeToolTipDiv();
		};
		var clickFn = function(e){
			temp.createPopupForFilterSaver();
			//temp.handleOnChangeEvent();
		};
		var hoverFn = function(e){
			$(this).css("cursor", temp.m_cursortype);
		};
		var touchstartFn = function(e){
			e.stopImmediatePropagation();
			if (!temp.m_designMode && temp.m_tooltip != "" && temp.m_tooltip != " ") {
				if($(".draggablesParentDiv").find("#" + "toolTipDiv").length === 0 ){
					var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
					var scrollLeft =  parentDiv.scrollLeft;
					var scrollTop =  parentDiv.scrollTop;
					var PageTop = e.originalEvent.touches[0].pageY; 
					var PageLeft = e.originalEvent.touches[0].pageX;
					var divTop = PageTop * 1 + scrollTop * 1 + 20 * 1 ;
					var divLeft = (((PageLeft * 1 + scrollLeft * 1) - 150) < 0) ? (PageLeft * 1 + scrollLeft * 1) : (PageLeft * 1 + scrollLeft * 1) - 160;
					var tooltipDiv = document.createElement("div");
					tooltipDiv.innerHTML = temp.checkToolTipDesc;
					tooltipDiv.setAttribute("id", "toolTipDiv");
					tooltipDiv.setAttribute("class", temp.m_objecttype + "ToolTipDiv");
					$(".draggablesParentDiv").append(tooltipDiv);
					var tStyles = $.extend(temp.getTooltipStyles(), {
						"top": divTop + "px",
						"left": divLeft + "px"
					});
					$(tooltipDiv).css(tStyles);
					
					/** Adjust if going out of boundary **/
					if (divTop * 1 + 20 * 1 + $(tooltipDiv).height() * 1 > temp.m_dashboard.m_AbsoluteLayout.m_height + scrollTop) {
						divTop = PageTop * 1 - 20 + scrollTop * 1 - $(tooltipDiv).height() * 1;
						$(tooltipDiv).css("top", divTop);
					}
					if (divLeft * 1 + 10 * 1 + $(tooltipDiv).width() * 1 > temp.m_dashboard.m_AbsoluteLayout.m_width + scrollLeft) {
						divLeft = PageTop * 1 - 10 + scrollLeft * 1 - $(tooltipDiv).width() * 1;
						$(tooltipDiv).css("left", divLeft);
					}
				}else{
					temp.removeToolTipDiv();
				}
			}
		};
		
		if ("ontouchstart" in document.documentElement) {
			/** captures touch event on container div **/
			$("#draggableDiv" + temp.m_objectid).bind("touchstart", function(e) {
				e.stopImmediatePropagation();
				if($("." + temp.m_objecttype + "ToolTipDiv").length){
					mouseoutFn.bind($(comp))(e);
				}else{
					touchstartFn.bind(this)(e);
				}
				clickFn.bind(this)(e);
			}).bind("touchend", function(e) {
				/** Do Nothing **/
			});
		}else{
			$(comp).click(function (e) {
				mouseoutFn.bind(this)(e);
				clickFn.bind(this)(e);
			})
			.hover(function (e) {
				hoverFn.bind(this)(e);
			})
			.mousemove(function (e) {
				mousemoveFn.bind(this)(e);
			})
			.mouseout(function (e) {
				mouseoutFn.bind(this)(e);
			});
		}
		
		/** captures swipe events on division **/
		$("#draggableDiv" + temp.m_objectid).on("swipeleft", function(e) {
			onSwipeLeft(temp, e);
		}).on("swiperight", function(e) {
			onSwipeRight(temp, e);
		}).on("mousewheel", function(e) {
			temp.hideToolTip();
		});

		$(".draggablesParentDiv").on("scroll", function(e) {
			temp.hideToolTip();
		});
		$("#WatermarkDiv").on("scroll", function(e) {
			temp.hideToolTip();
		});
	}
};
/** @description method will create checkbox **/
FilterSaver.prototype.createCheckBoxButton = function(id) {
	var checkboxbutton = document.createElement("input");
	checkboxbutton.setAttribute("type", "checkbox");
	checkboxbutton.setAttribute("name", "checkboxbutton");
	checkboxbutton.setAttribute("id", id);
	checkboxbutton.setAttribute("class", "option-input-cr cr-checkbox");
	$(checkboxbutton).css({
		"height" : this.fontScaling(this.m_checkboxfontsize) + "px",
		"width" : this.fontScaling(this.m_checkboxfontsize) + "px",
		"margin": "auto", 
		"cursor": this.m_cursortype
	});
	return checkboxbutton;
};
/** @description method will create thirdinnerdiv for save criteria and cancel buttons **/
FilterSaver.prototype.createSaveCancelBtn = function() {
	var saveBtnContainer = document.createElement("div");
	saveBtnContainer.setAttribute('id', "saveCriteria" + this.m_objectid);
	saveBtnContainer.setAttribute("class", "filterSaver-save-btn-container");
	
	var saveCriteriaBtn = this.createSaveCriteriaButton("Save");
	saveBtnContainer.appendChild(saveCriteriaBtn);
	$("#mainContainer" + this.m_objectid).append(saveBtnContainer);
};
/** @description method will show msg when criteria list empty **/
FilterSaver.prototype.showEmptyDivMsg = function() {
	var temp = this;
	if (temp.dashboardCriteriaList.length > 0) {
		$("#savedCriteriaListEmptyAlert" + temp.m_objectid).hide();
		$("#criteriaList" + temp.m_objectid).show();
		$(".filterSaverControlBtn").removeClass("filterSaver-selectedBtn");
		$("#getCriteriaList" + temp.m_objectid).addClass("filterSaver-selectedBtn");
	} else {
		$("#criteriaList" + temp.m_objectid).hide();
		$("#savedCriteriaListEmptyAlert" + temp.m_objectid).show();
		$(".filterSaverControlBtn").removeClass("filterSaver-selectedBtn");
		$("#getCriteriaList" + temp.m_objectid).addClass("filterSaver-selectedBtn");
	}
};
/** @description method will create save criteria button **/
FilterSaver.prototype.createSaveCriteriaButton = function(value) {
	var Button = document.createElement('input');
	Button.type = "submit";
	Button.setAttribute("class", "filterSaver-save-btn");
	Button.value = value;
	
	$(Button).css({
		"font-style": this.m_fontstyle,
		"font-weight": this.m_fontweight,
		"font-size": this.fontScaling(this.m_fontsize) + "px",
		"font-family": selectGlobalFont(this.m_fontfamily),
		"cursor": this.m_cursortype,
		"background": (IsBoolean(this.m_updateddesign) ? '#0D78BF' : '#006684'),
		"padding": (IsBoolean(this.m_updateddesign) ? '8px' : '0px'),
		"border-radius": (IsBoolean(this.m_updateddesign) ? '4px' : '0px')
	});
	return Button;
};
/** @description method will initialize all the events and draw criteria list**/
FilterSaver.prototype.initializeClickEvents = function() {
    var temp = this;
    this.createCriteriaNameInputContainer();
    this.createFilterInfoContainer();
    this.createSaveCancelBtn();
    var listStatus = {
    		"filterInfoList": "No filter component available.",
    		"savedCriteriaList": "No saved criteria available."
    	}
    this.createEmptyListAlert("filterInfoListEmptyAlert", listStatus.filterInfoList);
    this.createEmptyListAlert("savedCriteriaListEmptyAlert", listStatus.savedCriteriaList);

    var dbId = this.m_dashboard.m_dashboardjson.Niv.Dashboard.backendId;
    if (!(this.isCriteriaUpdated) && dbId != "") {
        this.getDashboardCriteriaList({
            "dashboardId": dbId
        }); //call getCriteriaList service
        this.isCriteriaUpdated = true;
    } else {
        this.drawCriteriaList();
        this.showEmptyDivMsg();
    }
    
    $("#usetittlediv").hide();
    $("#criteriaNameDiv" + temp.m_objectid).hide();
    $("#boxSecondInnerDiv").hide();
    $("#saveCriteria" + temp.m_objectid).hide();
    
    if(IsBoolean(this.m_updateddesign)){
		$("#getCriteriaList" + temp.m_objectid).addClass("filterSaver-slctdBtn");
	} else {
		$("#getCriteriaList" + temp.m_objectid).addClass("filterSaver-selectedBtn");
	}

    $("#addCriteria" + temp.m_objectid).click(function() {
        $("#criteriaList" + temp.m_objectid).hide();
       
        $("#savedCriteriaListEmptyAlert" + temp.m_objectid).hide();
        if ($("#boxSecondInnerDiv").find("li").length > 0) {
            $("#filterInfoListEmptyAlert" + temp.m_objectid).hide();
            $("#criteriaNameDiv" + temp.m_objectid).show();
            $("#criteriaSaverTextBox" + temp.m_objectid).focus();
            $("#boxSecondInnerDiv").show();
            $("#saveCriteria" + temp.m_objectid).show();
        } else {
            $("#criteriaNameDiv" + temp.m_objectid).hide();
            $("#saveCriteria" + temp.m_objectid).hide();
            $("#boxSecondInnerDiv").hide();
            $("#filterInfoListEmptyAlert" + temp.m_objectid).show();
        }
        //$("#saveCriteria" + temp.m_objectid).show();
        if(IsBoolean(!this.m_updateddesign)){
			$(".filterSaverControlBtn").removeClass("filterSaver-slctdBtn");
			$(".filterSaverControlBtn").removeClass("filterSaver-selectedBtn");
        	$(this).addClass("filterSaver-slctdBtn");
		} else {
			$(".filterSaverControlBtn").removeClass("filterSaver-selectedBtn");
			$(".filterSaverControlBtn").removeClass("filterSaver-slctdBtn");
        	$(this).addClass("filterSaver-selectedBtn");
		}
    });
    $("#getCriteriaList" + temp.m_objectid).click(function() {
        $("#criteriaNameDiv" + temp.m_objectid).hide();
        $("#saveCriteria" + temp.m_objectid).hide();
        $(".filterSaver-save-btn-container").hide();
        $("#boxSecondInnerDiv").hide();
        $("#filterInfoListEmptyAlert" + temp.m_objectid).hide();
        if (temp.dashboardCriteriaList.length > 0) {
            $("#savedCriteriaListEmptyAlert" + temp.m_objectid).hide();
            $("#criteriaList" + temp.m_objectid).show();
        } else {
            $("#criteriaList" + temp.m_objectid).hide();
            $("#savedCriteriaListEmptyAlert" + temp.m_objectid).show();
        }
        if(IsBoolean(!this.m_updateddesign)){
			$(".filterSaverControlBtn").removeClass("filterSaver-slctdBtn");
        	$(this).addClass("filterSaver-slctdBtn");
		} else {
			$(".filterSaverControlBtn").removeClass("filterSaver-selectedBtn");
        	$(this).addClass("filterSaver-selectedBtn");
		}
    });

    var componentsIDS = [];
    if (IsBoolean(this.m_filtersavermap.enableCheckBox)) {
    	$("input[name='checkboxbutton']").each(function() {
    		$(this).attr('checked', "checked");
    		componentsIDS.push((this.id));
    	});
    	$(".li-inputCheck").on('click', function() {
            $("#saveCriteria" + temp.m_objectid).show();
            var input = $(this).find("input")[0];
            if ($(this).find("input").is(':checked')) {
                componentsIDS.push(input.id);
            } else {
                if (componentsIDS.indexOf(input.id) > -1) {
                    var indx = componentsIDS.indexOf(input.id);
                    componentsIDS.splice(indx, 1);
                }
            }
        });
    } else {
    	$(".filterSaver-filterInfo-li-label").each(function() {
            $(this).attr('checked', "checked");
            componentsIDS.push((this.id));
        });
    }

    $(".filterSaver-save-btn").click(function() {
        temp.saveNewCriteria(componentsIDS);
    });
};
/** @description method will set common font style to selector**/
FilterSaver.prototype.setFontCSS = function(selector) {
	var temp = this;
	$(selector).css({
		"font-style": temp.m_fontstyle,
		"font-weight": temp.m_fontweight,
		"font-size": temp.fontScaling(temp.m_fontsize) + "px",
		"font-family": selectGlobalFont(temp.m_fontfamily)
	});
};
/** @description method will update global variable **/
FilterSaver.prototype.handleOnChangeEvent = function() {
	var fieldNameValueMap = {};
	var fieldname = (this.m_fieldname == "" || this.m_fieldname == undefined) ? "Value" : this.m_fieldname;
	fieldNameValueMap[fieldname] = this.m_fieldvalue;
	this.updateDataPoints(fieldNameValueMap);
};
/** @description Method will save new criteria object  **/
FilterSaver.prototype.saveNewCriteria = function(componentsIdArray) {
    var temp = this;
    var widgetArray = temp.m_dashboard.m_widgetsArray; // dashboard components array 
    var filterData = [];
    var criteriaName = $("#criteriaSaverTextBox" + temp.m_objectid).val();
    if (criteriaName != "" && criteriaName != null) {
        var dId = this.m_dashboard.m_dashboardjson.Niv.Dashboard.backendId;
        if (dId != "") {
            for (var comp = 0; comp < widgetArray.length; comp++) {
                var component = widgetArray[comp];
                if (component.m_objecttype == "filter" && componentsIdArray !== undefined && componentsIdArray.indexOf(component.m_objectid) > -1) {
                    try {
                        var gv = sdk.getGlobalVariable(component.m_globalkey)
                        filterData.push(gv);
                        gv["objectID"] = component.m_objectId;
                        if (component.chartJson.componentType == "hierarchical_combo") {
                            gv["selectedIndex"] = component.m_currentIndexSelect;
                        } else {
                            gv["selectedIndex"] = component.m_selectedindexarray;
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            if (filterData.length > 0) {
	            var filterCriteriaObj = {
	                "criteriaName": criteriaName,
	                "Id": "",
	                "dashboardId": dId,
	                "criteriaList": filterData
	            }
	            this.saveDashboardCriteria(filterCriteriaObj);
	            
	            $("#criteriaSaverTextBox" + temp.m_objectid).val('');
	            $("#criteriaSaverTextBox" + temp.m_objectid).focus();
	            criteriaName = "";
            } else {
            	alertPopUpModal({ type: "warning", message: "Criteria can not be empty", timeout: '3000' });
            }
        } else {
        	alertPopUpModal({ type: "warning", message: "Please save the dashboard before saving a criteria", timeout: '3000' });
        }
    } else {
    	alertPopUpModal({ type: "warning", message: "Criteria name can not be empty", timeout: '3000' });
        $("#criteriaSaverTextBox" + temp.m_objectid).focus();
    }
};
/** @description method will parse dashboard criteria**/
FilterSaver.prototype.parseDashboardCriteria = function(respData) {
    var cObj = JSON.parse(respData.criteriaData);
    this.handleOnChangeEvent();
    this.applyDashboardCriteria(cObj);
};
/** @description method will set dashboard criteria list array**/
FilterSaver.prototype.setCriteriaList = function(respData) {
    var cList = respData.DashboardCriteriaReponse.dashboardcriterialist;
    this.dashboardCriteriaList = cList;
    this.drawCriteriaList();
    this.showEmptyDivMsg();
};
/** @description method will update dashboard criteria list after save and delete criteria**/
FilterSaver.prototype.updateCriteriaList = function(action,respData) {
    switch (action) {
    	case "Delete":
    		var index = -1;
    		for (var i = 0; i < this.dashboardCriteriaList.length; i++) {
    			if (this.dashboardCriteriaList[i].id == respData[0]) {
        			index = i;
        			break;
    			}
    		}
    		if (index > -1) {
        		this.dashboardCriteriaList.splice(index, 1);
    		}
    		this.drawCriteriaList();
    	    this.showEmptyDivMsg();
    		break;
    	case "ADD":
    		var cObj = {
        		"id": respData.id, 
        		"criteriaName": respData.criteriaName
        	};
    		this.dashboardCriteriaList.push(cObj);
    		this.drawCriteriaList();
    		$("#getCriteriaList" + this.m_objectid).click();
    		break;
    	default:
    }

};
/** @description method will get dashboard criteria Ids list from DB**/
FilterSaver.prototype.getDashboardCriteriaList = function(reqData) {
    var temp = this;
    var
        REQ_URL = req_url.designer.getDashboardCriteriaList,
        REQ_DATA = reqData,

        requestSuccessFn = function(respData, success) {
			respData = getDecryptedResponse(respData);
	    	if (respData) {
	    		var resp = respData.DashboardCriteriaReponse;
	            if (resp && resp.success) {
	               temp.setCriteriaList(respData);
	               alertPopUpModal({ type: "success", message: "Saved criteria has been loaded", timeout: '3000' });
	            }
	    	}
        },
        requestFailedFn = function(data_gws, success) {
            alertPopUpModal({ type: "error", message: "Failed to load saved criteria", timeout: '3000' });
        };
    showLoader();
    this.webServiceCall(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
};
/** @description method will create dashboard criteria in DB**/
FilterSaver.prototype.saveDashboardCriteria = function(reqData) {
    var temp = this;
    var
        REQ_URL = req_url.designer.saveDashboardCriteria,
        REQ_DATA = {
            data: JSON.stringify(reqData)
        },

        requestSuccessFn = function(respData, success) {
			respData = getDecryptedResponse(respData);
			if (respData) {
				var resp = respData.DashboardCriteriaReponse;
		        if (resp && resp.success) {
		            temp.isCriteriaUpdated = true;
		            temp.updateCriteriaList("ADD", respData.DashboardCriteriaReponse);
		            alertPopUpModal({ type: "success", message: "Criteria has been saved", timeout: '3000' });
		        }
			}
        },
        requestFailedFn = function(data_gws, success) {
            alertPopUpModal({ type: "error", message: "Failed to save criteria", timeout: '3000' });
        };
    showLoader();
    this.webServiceCall(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
};
/** @description method will get dashboard criteria by Id from DB**/
FilterSaver.prototype.getDashboardCriteriaById = function(reqData) {
    var temp = this;
    var
        REQ_URL = req_url.designer.getDashboardCriteriaById,
        REQ_DATA = reqData,

        requestSuccessFn = function(respData, success) {
			respData = getDecryptedResponse(respData);
	    	if (respData) {
	    		var resp = respData.DashboardCriteriaReponse;
	            if (resp && resp.success) {
	                temp.isCriteriaUpdated = true;
	                temp.parseDashboardCriteria(respData.DashboardCriteriaReponse);
		            alertPopUpModal({ type: "success", message: "Criteria has been applied", timeout: '3000' });
	            }
	    	}
        },
        requestFailedFn = function(data_gws, success) {
            alertPopUpModal({ type: "error", message: "Failed to apply the criteria", timeout: '3000' });
        };
    showLoader();
    this.webServiceCall(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
};
/** @description method will delete dashboard criterias **/
FilterSaver.prototype.deleteDashboardCriterias = function(reqData) {
    var temp = this;
    var
        REQ_URL = req_url.designer.deleteDashboardCriterias,
        REQ_DATA = {
            "criteriaIds": JSON.stringify(reqData)
        },

        requestSuccessFn = function(respData, success) {
			respData = getDecryptedResponse(respData);
	    	if (respData) {
	    		var resp = respData.DashboardCriteriaReponse;
	            if (resp && resp.success) {
	                temp.updateCriteriaList("Delete", reqData.selectedIds);
	                alertPopUpModal({ type: "success", message: "Criteria has been deleted", timeout: '3000' });
	            }
	    	}
        },
        requestFailedFn = function(data_gws, success) {
            alertPopUpModal({ type: "error", message: "Failed to delete criteria", timeout: '3000' });
        };
    showLoader();
    this.webServiceCall(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
};
//# sourceURL=FilterSaver.js
