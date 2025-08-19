/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: PropertyDirective.js
 * @description directive for property pallete
 * **/
(function () {
    /** PropertyManager **/
    angular.module(designerModules.module.PropertyManager)
	    .directive("bizDatasetContainer", function() {
	        return {
	            templateUrl: "./views/dashboardTabs/DatasetPalette.html",
	            controller: "DatasetController"
	        };
	    })
	    .directive("bizFnContainer", function() {
	        return {
	            templateUrl: "./views/dashboardTabs/variableManagement/FnWindow.html",
	            controller: "UserScriptController"
	        };
	    })
	    .directive("bizPropertyPalette", function() {
	        return {
	            templateUrl: "./views/dashboardTabs/DashboardProperties.html",
	            controller: "PropertyController"
	        };
	    })
	    .directive("bizScriptContainer", function() {
	        return {
	            templateUrl: "./views/dashboardTabs/variableManagement/ComponentAttributes.html",
	            controller: "ComponentAttributeController"
	        };
	    });

})();