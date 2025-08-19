/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: RefreshButton.js
 * @description RefreshButton
 **/
function RefreshButton(m_chartContainer, m_zIndex) {
	// console.log("inside RefreshButton() constructor");
	this.base = Widget;
	this.base();

	this.m_connectionstoberefreshed = "";
	this.m_fontstyle = "";
	this.m_label = "";
	this.m_fontweight = "";
	this.m_tooltip = "";
	this.m_chromeColor = "";
	this.m_fontsize = "";
	this.m_fontfamily = "";
	this.m_color = "";
	this.m_radius = 5;
	this.observerDataProvider = [];
	this.m_objectID = [];
	this.m_componentid = "";

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
};

RefreshButton.prototype = new Widget;

RefreshButton.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

RefreshButton.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "RefreshButton") {
			for (var refreshButtonKey in jsonObject[key]) {
				this.setAttributeValueToNode(refreshButtonKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

RefreshButton.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

RefreshButton.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
};

RefreshButton.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2)
		this.m_objectid = this.m_objectid.split(".")[1];
	this.m_componentid = "textBoxDiv" + this.m_objectid;
};

RefreshButton.prototype.draw = function () {
	this.drawObject();
};

RefreshButton.prototype.drawObject = function () {
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback!="")
		onAfterRender(this.m_onafterrendercallback);
};

RefreshButton.prototype.init = function () {
	this.m_chromeColor = convertColorToHex(this.m_chromeColor);
	this.m_chromeColorOpacity = hex2rgb(convertColorToHex(this.m_chromeColor), 0.4);
	this.m_color = convertColorToHex(this.m_color);
	this.setObserverDataProvider();
};

RefreshButton.prototype.drawChart = function () {
	var temp = this;
	var refreshButtonDiv = this.drawRefreshButtonDiv();
	var refreshButton = this.drawRefreshButton(refreshButtonDiv);
	this.setrefreshButtonCSS(refreshButton);

	refreshButton.onclick = function () {
		for (var i = 0; i < temp.observerDataProvider.length; i++) {
			dataManager.initiateService(temp.observerDataProvider[i], frameworkController.setXMLResponse.bind(frameworkController));
		}
	};
	refreshButton.onmouseover = function () {
		$("#" + temp.m_refreshButtonId).css("textShadow", "0.2px 0.2px 0.5px rgba(#fff,#fff,#fff,1)");
		temp.setBackgroundGradient(temp.m_chromecolor, temp.m_chromeColorOpacity);
	};
	refreshButton.onmouseout = function () {
		$("#" + temp.m_refreshButtonId).css("textShadow", "0px 0px 0px rgba(#fff,#fff,#fff,1)");
		temp.setBackgroundGradient(temp.m_chromeColorOpacity, temp.m_chromecolor);
	};

	var topposition = this.m_y * 1 + this.m_height * 1 + 6;
	$("#draggableDiv" + temp.m_objectid).hover(function () {
		var id = "TooltipDiv" + temp.m_objectid;
		var tooltipDiv = document.createElement("div");
		tooltipDiv.innerHTML = temp.m_tooltip;
		tooltipDiv.setAttribute("id", id);
		tooltipDiv.setAttribute("style", "padding:5px;position:fixed;font-family:" + temp.m_defaultfontfamily + ";font-size:10px;top:" + topposition + "px;" + "z-index:100;background-color:#A6EEDB;border-radius:5px;");
		$("#draggableDiv" + temp.m_objectid).append(tooltipDiv);
	}, function () {
		$("#TooltipDiv" + temp.m_objectid).remove();
	});
};

RefreshButton.prototype.setBackgroundGradient = function (darkcolor, lightcolor) {
	var temp = this;
	$("#" + temp.m_refreshButtonId).css("background", lightcolor);
	$("#" + temp.m_refreshButtonId).css("background", "-webkit-gradient(linear, left top, left bottom, from(" + lightcolor + "), to(" + darkcolor + "))");
	$("#" + temp.m_refreshButtonId).css("background", "-moz-linear-gradient(top,  " + lightcolor + ",  " + darkcolor + ")");
};

RefreshButton.prototype.drawRefreshButtonDiv = function () {
	var temp = this;
	var refreshButtonDiv = document.createElement("div");
	refreshButtonDiv.setAttribute("id", this.m_componentid);
	$("#draggableDiv" + temp.m_objectid).append(refreshButtonDiv);
	refreshButtonDiv.style.position = "absolute";
	refreshButtonDiv.style.zIndex = 5;
	return refreshButtonDiv;
};

RefreshButton.prototype.drawRefreshButton = function (refreshButtonDiv) {
	var refreshButton = document.createElement("input");
	refreshButton.type = "button";
	refreshButton.style.border = "1px solid #ffffd0";
	refreshButton.style.font = this.m_fontstyle + " " + this.m_fontweight + " " + this.fontScaling(this.m_fontsize) + "px " + selectGlobalFont(this.m_fontfamily);
	refreshButton.setAttribute("class", "refreshButton");
	this.m_refreshButtonId = "refreshButton" + this.m_componentid;
	refreshButton.setAttribute("id", this.m_refreshButtonId);
	refreshButton.value = this.m_label;
	refreshButtonDiv.appendChild(refreshButton);
	return refreshButton;
};

RefreshButton.prototype.setrefreshButtonCSS = function (refreshButton) {
	var temp = this;
	$("#" + temp.m_refreshButtonId).css("width", this.m_width);
	$("#" + temp.m_refreshButtonId).css("height", this.m_height);
	$("#" + temp.m_refreshButtonId).css("borderRadius", this.m_radius + "px");
	$("#" + temp.m_refreshButtonId).css("color", this.m_color);
	$("#" + temp.m_refreshButtonId).css("textShadow", "2px 2px 2px rgba(0,0,0,0.5)");
	this.setBackgroundGradient(this.m_chromecolor, this.m_chromeColorOpacity);
};

RefreshButton.prototype.setObserverDataProvider = function () {
	this.observerDataProvider = [];
	var connectioIdArray = this.m_connectionstoberefreshed.split(",");
	for (var i = 0; i < connectioIdArray.length; i++) {
		var dataProvider = this.m_dashboard.getDataProviders().m_dataUrlIdObjMap[connectioIdArray[i]];
		if (dataProvider != null)
			this.observerDataProvider.push(dataProvider);
	}
};
//# sourceURL=RefreshButton.js