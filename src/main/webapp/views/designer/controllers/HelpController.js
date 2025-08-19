/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: HelpController.js
 * @description HelpController.js is the controller for help section 
 * **/
(function() {
    /** Controller function for WidgetsLibrary
     * @param  {Object} $scope         The scope object
     * @param  {Object} ServiceFactory The ServiceFactory
     * @param  {Object} DesignerFactory The DesignerFactory
     * @param  {Object} $compile The Compile
     * @param  {Object} $translate The Translate
     * @param  {Object} $timeout The Timeout
     * @return {undefined}                   undefined
     */
    var HelpControllerFn = function($scope, $window, ServiceFactory, DesignerFactory, $compile, $translate, $timeout) {
        $scope.modal = DesignerFactory;
        $scope.helpModel = "./views/templates/HelpIntroduction.html";
        $scope.pageForDisplay = function($event, menu) {
            if (IsBoolean(IsBoolean((menu.subMenu !== undefined) && (menu.subMenu.length > 0)))) {
                if (menu.isActive == false) {
                    menu.isActive = true;
                } else {
                    menu.isActive = false;
                };
            } else if (IsBoolean((menu.childSubMenu !== undefined) && (menu.childSubMenu.length > 0))) {
                if (menu.isActive == false) {
                    menu.isActive = true;
                } else {
                    menu.isActive = false;
                };
            } else {
                var mId = menu.Url;
                $scope.helpModel = mId;
            }
        };
        ServiceFactory.getJsonFileData("./resources/data/HelpMenu.data", function(helpMenuList) {
            $scope.helpData = helpMenuList;
            $scope.helpMenuList = helpMenuList.helpMenus;
        });
        $scope.tryItHelpFeature = function($event, href) {
            ServiceFactory.getJsonFileData(href, function(tryItJSON) {
                $scope.tryItJSON = tryItJSON;
                var file = {};
                var fileNameArray = [];
                fileNameArray = href.split("/")
                file = {
                    fileData: $scope.tryItJSON,
                    fileName: fileNameArray[fileNameArray.length - 1]
                }
                $scope.loadComps();
                $scope.browseBVZXDashboard(file);
            });
        }
        $scope.downloadHelpFeature = function($event, href) {
            ServiceFactory.getJsonFileData(href, function(downloadJSON) {
                $scope.download = downloadJSON;
                var fileNameArray = [];
                var fileName= "";
                fileNameArray = href.split("/");
                fileName= fileNameArray[fileNameArray.length - 1];
                fileNameArray = fileName.split(".");
                fileName = fileNameArray[0];
                $scope.exportToDefaultLocation(fileName,$scope.download);
            });
        }
    }
    
    angular.module(designerModules.module.HelpManager)
        .controller("HelpController", ["$scope", "$window", "ServiceFactory", "DesignerFactory", "$compile", "$translate", "$timeout", HelpControllerFn]);
})();
//# sourceURL=HelpController.js