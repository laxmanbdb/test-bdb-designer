/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: TabComponent.js
 * @description Tab Component
 **/
function TabComponent(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();
	
	this.m_fontsize = "";
	this.m_fontcolor = "";
	this.m_chromecolor = "";
	this.m_height = "";
	this.m_fontfamily = "Roboto";
	this.m_encode = "";
	this.m_width = "";
//	this.m_tooltip = "";
	this.m_fontstyle = "";
	this.m_opendoc = "";
	this.m_fontweight = "";
	this.m_label = "";
	this.m_globalkey = "";
	this.m_buttoncategory = "";
	this.m_useoutlinedbuttons = false;

	this.m_objectID = [];
	this.m_componentid = "";
//	this.checkToolTipDesc = "";

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_cursortype = "pointer";
	
//	this.m_tabcolors = "#E08283,#38d3a9,#797979";
	this.m_tabnames = "Tab1,Tab2,Tab3";
	this.m_tabgroups = "cube,triangle,point";
	this.tabNames = [];
	this.tabDisplayNames = [];
//	this.tabColors = [];
	this.tabGroups = [];
	this.m_tabobjectarr = [];
	this.legendsWidthArray = [];
	this.m_associategroups = [];
	this.m_selectioncolor="#cccccc";
	this.m_tabdefaulticon="bd-diamond";
	this.m_assigntabid="";
	
	this.m_btnpadding="";
	this.m_backgroundopacity="";
	
	this.m_buttonwidth = "";
	
	this.m_contentalignment = "";
	
	this.m_borderonselection = "false";
};

TabComponent.prototype = new Widget();

TabComponent.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

TabComponent.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "TabComponent") {
			for (var urlKey in jsonObject[key]) {
				this.setAttributeValueToNode(urlKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

TabComponent.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

TabComponent.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
	this.setCanvasContext();
	this.initMouseClickEvent();
};
TabComponent.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "inputDiv" + this.m_objectid;
};

TabComponent.prototype.draw = function () {
	this.drawObject();
};

TabComponent.prototype.drawObject = function () {
	//this.callDrawInit();
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback!="")
		onAfterRender(this.m_onafterrendercallback);
};

TabComponent.prototype.init = function () {
	if(this.m_tabobjectarr.length==0){
		this.setManageTabs();
	}
};
TabComponent.prototype.setManageTabs = function (chart) {
	var temp = this;
	this.tabNames = this.m_tabnames.split(",");
	this.tabDisplayNames = this.m_tabnames.split(",");
	this.tabDisplayNames = this.tabDisplayNames.map(function(name){
		return temp.getValueFromGlobalVariable(name, "square", false);
	});
	this.tabColors = this.m_tabcolors.split(",");
	this.tabGroups = this.m_tabgroups.split(",");
	
	for (var i = 0; i < this.tabNames.length; i++) {
		this.m_tabobjectarr.push({
			"tabId":"Tab"+this.m_objectid+i,
			"tabName": this.tabNames[i],
			"tabIcon": this.m_tabdefaulticon,
			"tabDisplayName": this.tabDisplayNames[i]
		});
	}
};
TabComponent.prototype.drawChart = function () {
	if (IsBoolean(this.m_isActive)) {
		this.drawTabComponent();
//		this.initMouseAndTouchEvent("#TabComponent" + this.m_objectid);
	}
};

TabComponent.prototype.removeTabComponentDiv = function () {
	$("#urlDiv" + this.m_objectid).remove();
};

TabComponent.prototype.drawTabComponent = function () {
	var temp = this;
	if ($("#urlDiv" + this.m_objectid) != null){
		$("#urlDiv" + this.m_objectid).remove();
	}

	var obj = document.createElement("div");
	obj.setAttribute("id", "urlDiv" + this.m_objectid);
	obj.style.width = this.m_width + "px";
	obj.style.top = "0px";

	$("#draggableDiv" + temp.m_objectid).append(obj);
	obj.style.position = "absolute";
	var padding = ((this.m_height - this.fontScaling(this.m_fontsize * 1) * 1)/2);
	for(var i=0,length=temp.m_tabobjectarr.length;i<length;i++){
		var button = document.createElement("div");
		var icon = temp.m_tabobjectarr[i].tabIcon||"";
		var shape = "";
		if(icon != ""){
			icon = (icon.includes('bd-glyphicon')) ? (icon.replace("bd-", "")) : icon;
			shape = '<i class="'+icon+'" style="margin-right: 1rem; height: '+this.fontScaling(this.m_fontsize)+'px; width: '+this.fontScaling(this.m_fontsize)+'px;"></i>';
		}
		var value = '<span class="value'+temp.m_objectid+i+'" style="height: '+this.fontScaling(this.m_fontsize)+'px;">'+this.formattedDescription(this, temp.m_tabobjectarr[i].tabName)+'</span>'
//		button.appendChild(shape);
		button.innerHTML = (temp.m_tabobjectarr[i].tabName == "") ? shape : shape + value;
		button.setAttribute("id", "TabComponent" + temp.m_objectid + i);
		button.setAttribute("class", "TabComponent"+temp.m_objectid);
		
		var valueContainer = document.createElement("div");
		valueContainer.setAttribute("class", "TabContainer"+this.m_componentid);
		valueContainer.setAttribute("id", "TabContainer"+this.m_componentid + i);
		valueContainer.style.height = "auto";
		valueContainer.style.display = "inline-block";
		(temp.m_tabalignment == "horizontal") ? valueContainer.style.marginRight = temp.m_btnpadding+"px" : valueContainer.style.marginBottom = temp.m_btnpadding+"px";
		obj.appendChild(valueContainer);
		valueContainer.appendChild(button);
		if(temp.m_tabalignment == "vertical"){
			$(button).css({
				"width": Math.round(this.m_width)+"px",
				"height": temp.m_buttonwidth + "px",
				"margin": "4px 0px",
			});
		} else {
			$(button).css({
				"width": temp.m_buttonwidth + "px",
				"height": Math.round(this.m_height)+"px",
				"margin":"0px 4px"
			});
		}
		$(button).css({
			"border-radius": this.m_borderradius + "px",
			"font-style": this.m_fontstyle,
			"font-weight": this.m_fontweight,
			"font-size": this.fontScaling(this.m_fontsize),
			"font-family": selectGlobalFont(this.m_fontfamily),
			//"padding": "0px "+this.m_btnpadding+"px",
			"text-align": "center",
			"background-color": this.m_chromecolor,
			"color": temp.m_fontcolor,
			"display": "flex",
			"flex-direction": "inherit",
			"align-items": "center",
			"opacity": this.m_backgroundopacity,
			"padding": "10px",
			"justify-content": temp.m_contentalignment
		});
		if (!IsBoolean(this.m_designMode)) {
			if(temp.m_assigntabid && (temp.m_assigntabid == temp.m_tabobjectarr[i].tabId)){
				var tabId =temp.m_assigntabid;
				var assignedGroups=temp.m_associategroups;
				var allGroups = sdk.getAllGroups();
				for(var k=0; k < allGroups.length; k++) {
					 allGroups[k] = allGroups[k].replace('g_', '');
				}
				var index = assignedGroups.map(function(e) { return e.key; }).indexOf(tabId);
				if(index!=-1){
					var tabGroups= assignedGroups[index].value;
					sdk.hideGroup(allGroups);
					sdk.showGroup(tabGroups);	
				} else {
					sdk.hideGroup(allGroups);
				}
				$("#TabComponent"+temp.m_objectid+(i)).css({
					"background-color": temp.m_selectioncolor,
				});
				(temp.m_tabalignment == "vertical") ? $("#TabComponent"+temp.m_objectid+(i)).css({
					"background-color": temp.m_selectioncolor, 
					"border-right": (IsBoolean(temp.m_borderonselection) ? temp.m_borderwidth + "px solid " + temp.m_bordercolor : "none")
				})
				: $("#TabComponent"+temp.m_objectid+(i)).css({
					"background-color": temp.m_selectioncolor,
					"border-bottom": (IsBoolean(temp.m_borderonselection) ? temp.m_borderwidth + "px solid " + temp.m_bordercolor : "none")
				});
			}
			button.onclick = (function () {
				temp.getDataPointAndUpdateGlobalVariable();
			});
			button.addEventListener("click", function(){
				var tabId =this.id;
				tabId = tabId.replace('Component','');
				var assignedGroups=temp.m_associategroups;
				var allGroups = sdk.getAllGroups();
				for(var k=0; k < allGroups.length; k++) {
					 allGroups[k] = allGroups[k].replace('g_', '');
				}
				/*for(i=0; i<assignedGroups.length; i++){
					var index = assignedGroups[i].indexOf(tabId)
				}*/
				var index = assignedGroups.map(function(e) { return e.key; }).indexOf(tabId);
				if(index!=-1){
					var tabGroups= assignedGroups[index].value;
					sdk.hideGroup(allGroups);
					sdk.showGroup(tabGroups);	
				}
				$(".TabComponent"+temp.m_objectid).css({
					"background-color": temp.m_chromecolor,
					"border": "0px"
				});
				
				(temp.m_tabalignment == "vertical") ? $(this).css({
						"background-color": temp.m_selectioncolor, 
						"border-right": (IsBoolean(temp.m_borderonselection) ? temp.m_borderwidth + "px solid " + temp.m_bordercolor : "none")
					})
				: $(this).css({
						"background-color": temp.m_selectioncolor,
						"border-bottom": (IsBoolean(temp.m_borderonselection) ? temp.m_borderwidth + "px solid " + temp.m_bordercolor : "none")
					})
			});
		}
	}
	$("#draggableDiv" + this.m_objectid).css("border-radius", this.m_borderradius + "px");
};
/*TabComponent.prototype.initMouseAndTouchEvent = function (comp) {
	if (!IsBoolean(this.m_designMode)) {
		var temp = this;
//		this.checkToolTipDesc = this.updateToolTipInfo(this.m_tooltip);
		var mousemoveFn = function (e) {
			$(this).css({
				"background-color": temp.m_hovercolor,
				"border": "1px solid " + temp.m_hovercolor,
				"color": temp.m_fontcolor
			});
		};
		var mouseoutFn = function(e){
			$(this).css({
				"background-color": temp.m_chromecolor,
				"border": "1px solid " + temp.m_chromecolor,
				"color": temp.m_fontcolor
			});
		};
		var clickFn = function(e){
			if (!IsBoolean(this.m_designMode)) {
				temp.getDataPointAndUpdateGlobalVariable();
			}
		};
		var hoverFn = function(e){
			$(this).css("cursor", temp.m_cursortype);
		};
		var touchstartFn = function(e){
			//DO NOTHING
		};
		if ("ontouchstart" in document.documentElement) {
//			* captures touch event on container div *
			$("#draggableDiv" + temp.m_objectid).bind("touchstart", function(e) {
				e.stopImmediatePropagation();
				if($("." + temp.m_objecttype + "ToolTipDiv").length){
					mouseoutFn.bind($(comp))(e);
				}else{
					touchstartFn.bind(this)(e);
				}
				clickFn.bind(this)(e);
			}).bind("touchend", function(e) {
//				* Do Nothing *
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
		
//		* captures swipe events on division *
		$("#draggableDiv" + temp.m_objectid).on("swipeleft", function(e) {
			onSwipeLeft(temp, e);
		}).on("swiperight", function(e) {
			onSwipeRight(temp, e);
		}).on("mousewheel", function(e) {
//			temp.hideToolTip();
		});

		$(".draggablesParentDiv").on("scroll", function(e) {
//			temp.hideToolTip();
		});
		$("#WatermarkDiv").on("scroll", function(e) {
//			temp.hideToolTip();
		});
	}
};*/

TabComponent.prototype.getDataPointAndUpdateGlobalVariable = function () {
	var fieldNameValueMap = {};
	var fieldname = (this.m_fieldname === "" || this.m_fieldname === undefined) ? "Value" : this.m_fieldname;
	fieldNameValueMap[fieldname] = this.m_fieldvalue;
	this.updateDataPoints(fieldNameValueMap);
};
//# sourceURL=TabComponent.js