/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: ThemeManager.js
 * @description  it is responsible for applying portal theme on the designer
 * **/
//# sourceURL=ThemeManager.js

 /**
 * @description Main Function which will apply portal theme to the designer
 * @param {Object} _portalPreference: object which contains css properties of portal theme
 * */
var
loadColorSchemeFromPortal = function (_portalPreference) {
	//applyHeaderColorScheme(_portalPreference);
	applyMainMenuColorScheme(_portalPreference);
},

applyHeaderColorScheme = function (_portalPreference) {
	$("#header").css("background-color", _portalPreference["headerBGColor"]);
	$(".headerControlIcon").css("color", _portalPreference["headerTextAndIconColor"]);
	//			HOVER
	$(".headerControlIcon").hover(
		function () {
			$(this).css("background-color", _portalPreference["headerTextAndIconBGHoverColor"]);
			$(this).css("color", _portalPreference["headerTextAndIconHoverColor"]);
		},
		function () {
			$(this).css("background-color", _portalPreference["headerBGColor"]);
			$(this).css("color", _portalPreference["headerTextAndIconColor"]);
	});
},

applyMainMenuColorScheme = function (_portalPreference) {
	$(".navbar-inverse").css(
			"background-color",_portalPreference["navBarBGColor"]);
	$(".navbar-inverse a").css(
			"color",_portalPreference["navBarTextAndIconColor"]);

	$(".dropdown .dropdown-menu li").css(
			"background-color",_portalPreference["navBarBGColor"]);
	$(".dropdown .dropdown-menu li a").css(
			"color",_portalPreference["navBarTextAndIconColor"]);

	$("body").find(".navbar-inverse .navbar-nav>.active>a").css({
		"background-color": _portalPreference["menuPanelBGColor"],
		"color": _portalPreference["menuPanelTextAndIconColor"]});
	$("body").find(".navbar-inverse .open>a").css({
		"background-color": _portalPreference["menuPanelBGColor"],
		"color": _portalPreference["menuPanelTextAndIconColor"]});
	//			HOVER
	$(".navbar-inverse div ul li a").hover(
		function () {
			$(this).css({
				"background-color": _portalPreference["navBarTextAndIconBGHoverColor"],
				"color": _portalPreference["navBarTextAndIconHoverColor"]
			});
		},
		function () {
			$(this).css({
				"background-color": _portalPreference["navBarBGColor"],
				"color": _portalPreference["navBarTextAndIconColor"]
			});
	});
},

applyDashboardMenuColorScheme = function (_portalPreference) {
	$("#dashboard-tabs").show();
	$("#dash-prop-tab").css({"background-color": _portalPreference["menuPanelBGColor"]});
	$("#dash-prop-tab li a").css({"color": _portalPreference["menuPanelTextAndIconColor"]});
	$("#dash-prop-tab li a:hover").css({
		"background-color": _portalPreference["menuPanelTextAndIconBGHoverColor"],
		"color": _portalPreference["menuPanelTextAndIconHoverColor"]
	});
},

applyDashboardColorScheme = function (_portalPreference) {
	$("#dashboardTabs li a").css({"background": "#EEEEDD", "color": "black"});
	$("#dashboardTabs li.active a").css({
		"background-color": _portalPreference["menuPanelBGColor"],
		"color": _portalPreference["menuPanelTextAndIconColor"]
	});
},

applyFloatingWindowColorScheme = function (_portalPreference) {
	$(".biz-viz-side-window").css("border", "0px solid " + _portalPreference["menuPanelBGColor"]);
	$("#DataSourceContainer").css("border-top", "1px solid " + _portalPreference["menuPanelBGColor"]);
	$("#variableBox").css("border-top", "1px solid " + _portalPreference["menuPanelBGColor"]);
	$(".bizVizControlBoxFooter").css("background-color", _portalPreference["menuPanelBGColor"]);
},

applyPropertyWindowColorScheme = function (_portalPreference) {
	/** set property-palette theme **/
	$("#DashboardPropertyPalette").find(".panel-title").css({
		"background-color" : _portalPreference["navBarBGColor"],
		"color" : _portalPreference["navBarTextAndIconColor"],
	});
	/** set property-palette header theme **/
	$(".bizVizControlBoxFooter").css({
		"background-color": _portalPreference["contextMenuBGColor"],
		"color" : _portalPreference["navBarTextAndIconColor"],
	});
},
getDefaultDesignerPreference = function (callback, args) {
	$http.get("./resources/data/UserPreference.data")
	.success(function (response) {
		callback(response, args);
	})
	.error(function () {
		console.log("error");
	});
},
removeInlineCssFrom = function (selector) {
	$(selector).attr("style", function (i, style) {
		return style.replace(/display[^;]+;?/g, "");
	});
};
