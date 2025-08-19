/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: DataSourceDirective.js
 * @description directive for connections 
 * **/
(function () {
    /** DataSourceManager **/
    angular.module(designerModules.module.DataSourceManager)
	    .directive("bizDataSourceContainer", function() {
	        return {
	            restrict: "E",
	            templateUrl: "./views/dashboardTabs/dataConnection/DataConnectionMainPage.html",
	            controller: "DPController"
	        };
	    })
	    .directive("csvConnection", function() {
	        return {
	            restrict: "E",
	            templateUrl: "./views/dashboardTabs/dataConnection/CSVConnectionPage.html",
	            controller: "CSVController"
	        };
	    })
	    .directive("excelConnection", function() {
	        return {
	            restrict: "E",
	            templateUrl: "./views/dashboardTabs/dataConnection/ExcelConnectionPage.html",
	            controller: "ExcelController"
	        };
	    })
	    .directive("webserviceConnection", function() {
	        return {
	            restrict: "E",
	            templateUrl: "./views/dashboardTabs/dataConnection/WebserviceConnectionPage.html",
	            controller: "WebserviceController"
	        };
	    })
	    .directive("paConnection", function() {
	        return {
	            restrict: "E",
	            templateUrl: "./views/dashboardTabs/dataConnection/PAConnectionPage.html",
	            controller: "PAController"
	        };
	    })
	    .directive("dsConnection", function() {
	        return {
	            restrict: "E",
	            templateUrl: "./views/dashboardTabs/dataConnection/DSConnectionPage.html",
	            controller: "DSController"
	        };
	    })
	    .directive("wsConnection", function() {
	        return {
	            restrict: "E",
	            templateUrl: "./views/dashboardTabs/dataConnection/WSConnectionPage.html",
	            controller: "WSController"
	        };
	    })
	    .directive("datasheetConnection", function() {
	        return {
	            restrict: "E",
	            templateUrl: "./views/dashboardTabs/dataConnection/DataSheetConnectionPage.html",
	            controller: "DataSheetController"
	        };
	    })
	    .directive("ddataConnection", function() {
	        return {
	            restrict: "E",
	            templateUrl: "./views/dashboardTabs/dataConnection/DdataConnectionPage.html",
	            controller: "DdataController"
	        };
	    })
	    .directive("onReadFile", ["$parse", "ServiceFactory", function($parse, ServiceFactory) {
	        return {
	            restrict: "A",
	            scope: false,
	            link: function(scope, element, attrs) {
	                var fn = $parse(attrs.onReadFile);
	                var reader = new FileReader();
	                element.on("change", function(onChangeEvent) {
	                    if ((onChangeEvent.srcElement || onChangeEvent.target).files.length > 0) {
	                        var fileObject = (onChangeEvent.srcElement || onChangeEvent.target).files[0];
	                        if ( (fileObject.name).toLowerCase().indexOf(".gif") != -1 || (fileObject.name).toLowerCase().indexOf(".png") != -1 || (fileObject.name).toLowerCase().indexOf(".jpg") != -1 || (fileObject.name).toLowerCase().indexOf(".jpeg") != -1) {
	                            if (fileObject.size < scope.modal.userPreference.defaultLimitConfigs.imgFile) {
	                            	reader.readAsDataURL(fileObject);
	                            } else {
	                            	ServiceFactory.showNotification("File size should not exceed 3MB", "alert-warning", 2000);
	                            }
	                        } else {
	                        	if (fileObject.size < scope.modal.userPreference.defaultLimitConfigs.bvzxFile) {
	                        		  reader.readAsText(fileObject);
	                        	}else {
	                            	ServiceFactory.showNotification("File size should not exceed 3MB", "alert-warning", 2000);
	                            }
	                        }
	                    }
	                    reader.onload = function(onLoadEvent) {
	                        scope.$apply(function() {
	                            fn(scope, {
	                                $file: {
	                                    fileData: onLoadEvent.target.result,
	                                    fileName: fileObject.name
	                                }
	                            });
	                        });
	                    };
	                });
	            }
	        };
	    }]);

})();
