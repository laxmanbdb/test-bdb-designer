/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: DesignerPropertyController.js
 * @description It controls all the activities on Property palette
 * **/
(function () {
	/** Controller function for Designer Property palettes
	 * @param  {Object} $scope        	The scope object
	 * @param  {Object} $rootScope 		The rootScope
	 * @return {undefined}              undefined
	 */
	var DesignerPropertyControllerFn = function ($scope, $rootScope, ServiceFactory) {
			$scope.isBoxVisible = false;
			$scope.rcc = "";
			$scope.bizVizRightControlComponentBoxContainerWidth = 270;
			$scope.bvzRCBoxWidth = $scope.bizVizRightControlComponentBoxContainerWidth - 5;
			
			/** @description closes all the opened widnows in designer **/
			$scope.reloadDefault = function (id) {
				$(".sp-cancel").click();
				$scope.removeMenuSelection();
				if (id == "" || id == undefined) {
					try {
						$("input,textarea").blur();
					} catch (ex) {
						console.log(ex);
					}
					$("#compBox").removeClass("showBox").addClass("hideBox").addClass("bvz-invisible");
					$("#variableBox").removeClass("showBox").addClass("hideBox").addClass("bvz-invisible");
					$("#DashboardPropertyPalette").removeClass("showBox").addClass("hideBox").addClass("bvz-invisible");
					$("#DataSourceContainer").removeClass("showBox").addClass("hideBox").addClass("bvz-invisible");
					$("#objectBrowser").removeClass("showBox").addClass("hideBox").addClass("bvz-invisible");
					$("#DatasetPalette").removeClass("showBox").addClass("hideBox").addClass("bvz-invisible");
					$("#FnWindow").removeClass("showBox").addClass("hideBox").addClass("bvz-invisible");

					$scope.isBoxVisible = false;
				} else {
					if ($scope.isBoxVisible && $("#" + id).hasClass("hideBox")) {
						$("#compBox").removeClass("showBox").addClass("hideBox").addClass("bvz-invisible");
						$("#variableBox").removeClass("showBox").addClass("hideBox").addClass("bvz-invisible");
						$("#DashboardPropertyPalette").removeClass("showBox").addClass("hideBox").addClass("bvz-invisible");
						$("#DataSourceContainer").removeClass("showBox").addClass("hideBox").addClass("bvz-invisible");
						$("#objectBrowser").removeClass("showBox").addClass("hideBox").addClass("bvz-invisible");
						$("#DatasetPalette").removeClass("showBox").addClass("hideBox").addClass("bvz-invisible");
						$("#FnWindow").removeClass("showBox").addClass("hideBox").addClass("bvz-invisible");

						$scope.isBoxVisible = false;
					}
				}
				$(".dashboardContents").css({
					width : "100%"
				});
				if ($scope.isSelectedDashboardResponsive() && !$.isEmptyObject($scope.modal.propertyJsonList)) {
					setTimeout($scope.reDrawActiveDashboard, 10);
				}
			};
			$rootScope.$on("collapsePropertyWindows", $scope.collapsePropertyWindows);
			$scope.collapsePropertyWindows = function (_event) {
				if (_event.target.parentElement != undefined) {
					if ($("#" + _event.target.id).hasClass("draggablesParentDiv")
						 || $("#" + _event.target.parentElement.id).hasClass("draggableWidgetDiv")
						 || _event.which == 27) {
						if ($scope.isBoxVisible) {
							$scope.reloadDefault("");
						}
					}
				}
			};
			
			/** @description highlights the opened window in designer **/
			$scope.setMenuSelection = function (item) {
				$scope.removeMenuSelection();
				var usrPref = $scope.modal.userPreference;
				var color= usrPref ? "#C5B5FE": "#C5B5FE";
				$(item + " div").css({"opacity": "0.8", "border-left": "3px solid" + color});
				$(item).css({"background": "#ffffff"});
				$(item + " a i").css({"color": color});
			};
			$scope.removeMenuSelection = function () {
				$(".mainTabIcon div").css({"opacity": "1", "border-left": "0px"});
				$(".mainTabIcon").css({"background": "#434344"});
				$(".mainTabIcon div a i").css({"color": "#ffffff"});
			};
			
			/** @description toggle Maximize/Minimize the design mode area **/
			$scope.toggleHeader = function () {
				ServiceFactory.closeAllNotifications();
				if ($("#toggleHeader a md-icon").attr("class").search("nt-expand-icon") != -1) {
					$("#toggleHeader a md-icon").removeClass("nt-expand-icon").addClass("nt-resize-small-icon");
				} else {
					$("#toggleHeader a md-icon").removeClass("nt-resize-small-icon").addClass("nt-expand-icon");
				}

				if ((document.fullScreenElement && document.fullScreenElement !== null) || 
					(!document.mozFullScreen && !document.webkitIsFullScreen)) {
						if (document.documentElement.requestFullScreen) {
							document.documentElement.requestFullScreen();
						} else if (document.documentElement.mozRequestFullScreen) {
							document.documentElement.mozRequestFullScreen();
						} else if (document.documentElement.webkitRequestFullScreen) {
							document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
						}
				} else {
					if (document.cancelFullScreen) {
						document.cancelFullScreen();
					} else if (document.mozCancelFullScreen) {
						document.mozCancelFullScreen();
					} else if (document.webkitCancelFullScreen) {
						document.webkitCancelFullScreen();
					} 
				}
			};
			
			/** @description toggle Datasources window **/
			$scope.toggleDataSource = function () {
				ServiceFactory.closeAllNotifications();
				$scope.reloadDefault("DataSourceContainer");
				if (!$scope.isBoxVisible) {
					$scope.setMenuSelection("#toggleDatasource");
					$("#DataSourceContainer").removeClass("bvz-invisible");
					$("#DataSourceContainer").removeClass("hideBox").addClass("showBox");
					$scope.isBoxVisible = true;
				} else {
					$scope.removeMenuSelection();
					$("#DataSourceContainer").removeClass("showBox").addClass("hideBox");
					$("#DataSourceContainer").addClass("bvz-invisible");
					$scope.isBoxVisible = false;
				}
			};
			
			/** @description toggle Components window **/
			$scope.toggleComponents = function () {
				ServiceFactory.closeAllNotifications();
				$scope.reloadDefault("compBox");
				if (!$scope.isBoxVisible) {
					$scope.setMenuSelection("#toggleCompContainer");
					$("#compBox").removeClass("bvz-invisible");
					$("#compBox").removeClass("hideBox").addClass("showBox");
					$(".dashboardContents").css({width : "calc( 100% - "+$scope.bvzRCBoxWidth+"px )"});
					$scope.setFocusOnInput("#compBox", "#compSearch");
					$scope.isBoxVisible = true;
					if ($("select#typeCombo :selected").text() == "") {
						$("select#typeCombo").val("");
					}
				} else {
					$scope.removeMenuSelection();
					$("#compBox").removeClass("showBox").addClass("hideBox");
					$("#compBox").addClass("bvz-invisible");
					$(".dashboardContents").css({width : "100%"});
					$scope.isBoxVisible = false;
				}
			};
			
			/** @description toggle Object Browser window **/
			$scope.objectBrowserWindow = function () {
				ServiceFactory.closeAllNotifications();
				$scope.reloadDefault("objectBrowser");
				if (!$scope.isBoxVisible) {
					$scope.setMenuSelection("#toggleObjectBrowser");
					$("#objectBrowser").removeClass("bvz-invisible");
					$("#objectBrowser").removeClass("hideBox").addClass("showBox");
					$(".dashboardContents").css({width : "calc( 100% - "+$scope.bvzRCBoxWidth+"px )"});
					$scope.isBoxVisible = true;
				} else {
					$scope.removeMenuSelection();
					$("#objectBrowser").removeClass("showBox").addClass("hideBox");
					$("#objectBrowser").addClass("bvz-invisible");
					$(".dashboardContents").css({width : "100%"});
					$scope.isBoxVisible = false;
				}
			};
			
			/** @description toggle Component Variables window **/
			$scope.toggleVariableWindow = function(selectedtab) {
				ServiceFactory.closeAllNotifications();
				/**Added to resolve toggle issue of script page tabs.*/
			    if (selectedtab !== undefined) {
			        $scope.selectedtab = (selectedtab === "0") ? false : true;
			    }
			    $scope.reloadDefault("variableBox");
			    if (!$scope.isBoxVisible) {
			        $scope.setMenuSelection("#toggleVarWin");
			        $("#variableBox").removeClass("bvz-invisible");
			        $("#variableBox").removeClass("hideBox").addClass("showBox");
			        $scope.isBoxVisible = true;
			        $scope.resetComponentAttributesList();
			    } else {
			        $scope.removeMenuSelection();
			        $("#variableBox").removeClass("showBox").addClass("hideBox");
			        $("#variableBox").addClass("bvz-invisible");
			        $scope.isBoxVisible = false;
			    }
			};

			/** @description toggle component or dashboard property window **/
			$scope.toggleDashboardPropertyPalette = function (cId) {
				ServiceFactory.closeAllNotifications();
				$scope.reloadDefault("DashboardPropertyPalette");
				$scope.removeMenuSelection();
				if ($scope.rcc == cId) {
					if (!$scope.isBoxVisible) {
						$("#DashboardPropertyPalette").removeClass("bvz-invisible");
						$("#DashboardPropertyPalette").removeClass("hideBox").addClass("showBox");
						$(".dashboardContents").css({width : "calc( 100% - "+$scope.bvzRCBoxWidth+"px )"});
						$scope.isBoxVisible = true;
					} else {
						/*$("#DashboardPropertyPalette").removeClass("showBox").addClass("hideBox");
						$("#DashboardPropertyPalette").addClass("bvz-invisible");
						$(".dashboardContents").css({width : "100%"});
						$scope.isBoxVisible = false;*/
					}
				} else {
					$("#DashboardPropertyPalette").removeClass("bvz-invisible");
					$("#DashboardPropertyPalette").removeClass("hideBox").addClass("showBox");
					$(".dashboardContents").css({width : "calc( 100% - "+$scope.bvzRCBoxWidth+"px )"});
					$scope.isBoxVisible = true;
				}
			};
			
			/** @description toggle component dataset window **/
			$scope.toggleDatasetPalette = function (cId) {
				ServiceFactory.closeAllNotifications();
				$scope.removeMenuSelection();
				$scope.reloadDefault("DatasetPalette");
				if ($scope.rcc == cId) {
					if (!$scope.isBoxVisible) {
						$("#DatasetPalette").removeClass("bvz-invisible");
						$("#DatasetPalette").removeClass("hideBox").addClass("showBox");
						$(".dashboardContents").css({width : "calc( 100% - "+$scope.bvzRCBoxWidth+"px )"});
						$scope.isBoxVisible = true;
					} else {
						$("#DatasetPalette").removeClass("showBox").addClass("hideBox");
						$("#DatasetPalette").addClass("bvz-invisible");
						$(".dashboardContents").css({width : "100%"});
						$scope.isBoxVisible = false;
					}
				} else {
					$("#DatasetPalette").removeClass("bvz-invisible");
					$("#DatasetPalette").removeClass("hideBox").addClass("showBox");
					$(".dashboardContents").css({width : "calc( 100% - "+$scope.bvzRCBoxWidth+"px )"});
					$scope.isBoxVisible = true;
				}
			};

			/** @description toggle component or dashboard script window **/
			$scope.toggleFnWindow = function (cId) {
				$scope.removeMenuSelection();
				$scope.reloadDefault("FnWindow");
				if ($scope.rcc == cId) {
					if (!$scope.isBoxVisible) {
						$("#FnWindow").removeClass("bvz-invisible");
						$("#FnWindow").removeClass("hideBox").addClass("showBox");
						$scope.isBoxVisible = true;
					} else {
						$("#FnWindow").removeClass("showBox").addClass("hideBox");
						$("#FnWindow").addClass("bvz-invisible");
						$scope.isBoxVisible = false;
					}
				} else {
					$("#FnWindow").removeClass("bvz-invisible");
					$("#FnWindow").removeClass("hideBox").addClass("showBox");
					$scope.isBoxVisible = true;
				}
				if ($scope.isBoxVisible) {
					$scope.resetFunctionWindow("", true, "Component");
				}
			};
			/** @description Display modal popup to delete mobile or Tab layout object **/
			$scope.deleteLayoutModalPopup = function (layoutType) {
				if (layoutType != "AbsoluteLayout" && layoutType != "") {
					if (layoutType == "MobileLayout") {
		    			$scope.showModelPopup("deleteMobileViewConfirmation");
					} else {
						$scope.showModelPopup("deleteTabletViewConfirmation");
					}
				}
			};
			/** @description Delete selected layout object**/
			$scope.deleteLayout = function (event, layoutType) {
				if (layoutType == $scope.modal.layoutType) {
					var objLength = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object.length;
					var pinedObjLength = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].pinedObject.length;
					$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].pinedObject.splice(0, pinedObjLength);
					$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object.splice(0, objLength);
					$scope.switchDashboardView('Desktop');
				}
			};
			/*
			//REMOVED MAXIMIZATION OF SCRIPT WINDOW COZ OF CODE MIRROR
			$scope.maximizeUserScriptWindow = function( _event, _fromMax ) {
				if( !_fromMax ) {
					$scope.reloadDefault("");
					$scope.resetFunctionWindow( "scriptEditorMax" );
					$( "#userScriptMax" ).modal( "show" );
				}
				else {
					$scope.toggleFnWindow( $scope.modal.selectedComponentId );
				}
			}
			*/
		};

	/** @description Controller definition **/
	angular.module("designer")
	.controller("DesignerPropertyController", ["$scope", "$rootScope", "ServiceFactory", DesignerPropertyControllerFn]);

})();
//# sourceURL=DesignerPropertyController.js