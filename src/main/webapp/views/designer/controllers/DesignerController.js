/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: DesignerController.js
 * @description It controls all the actions happening across designer screens 
 * **/
(function() {
	/** Configuration function for Dashboard translate
	 * @param  {Object} $translateProvider 	The translateProvider
	 * @return {undefined}              undefined
	 */
    var designerConfigFn = function($translateProvider) {
        var selectedLanguage = BIZVIZ.SDK.language.get() || "en-US";
        if (selectedLanguage) {
            switch (selectedLanguage) {
                case "hi":
                    selectedLanguage = "hi-IN";
                    break;
                case "en":
                    selectedLanguage = "en-US";
                    break;
                default:
                    break;
            }
        }
        if (angular.element.ajaxSetup) {
            angular.element.ajaxSetup({
                cache: true
            });
        }
        $translateProvider.useSanitizeValueStrategy("escape");
        $translateProvider.useStaticFilesLoader({
            prefix: dGlobals.translateJSONUrl,
            suffix: ".json"
        });
        $translateProvider.preferredLanguage(selectedLanguage);
    };
    
    /** @description Configuration definition **/
    angular.module("designer")
    .config(["$translateProvider", designerConfigFn]);
    
    
	/** Controller function for Dashboard Components
	 * @param  {Object} $scope        	The scope object
	 * @param  {Object} timeout 		The Timeout
	 * @param  {Object} ServiceFactory 	The ServiceFactory
	 * @return {undefined}              undefined
	 */
    var designerControllerFn = function($scope, $rootScope, ServiceFactory, hotkeys, notify, $translate) {
    	$scope.bizVizLogo = dGlobals.bizVizLogo;
        $scope.isMainMenuVisible = true;
        $scope.previewLabel = "Preview";
        $scope.previewStage = false;
        $scope.dopreviewState = "yes";
        $scope.dpIcon = "";
        $scope.objectSearchKey = "";
        $scope.actualTag = "";
        $scope.selectedGlobalVariable = {};
        $scope.defValFilterList = [];
        $scope.dataURL4removeConnection = null;
        $scope.enablePreviewButton = false;
        $scope.scrRes = {
            "ht": "",
            "wt": "100%"
        };
        
        $scope.dashboardView = {
        		viewIcon : "nt-preview-icon",
		        isPreview : false
		};
/*
		$scope.toasterOptions = {
            "limit": 1,
            "position-class": "toast-top-center",
            "time-out": {
                "toast-success": 3000, 
                "toast-info": 2000, 
                "toast-warning": 3000, 
                "toast-error": 3000
            },
            "close-button": {
                "toast-success": true, 
                "toast-info":false, 
                "toast-warning": false, 
                "toast-error": false
            }
        };
*/

        $scope.showModelPopup = function(selector) {
			ServiceFactory.closeAllNotifications();
        	$scope.setModelWatcherStatus(selector, true);
        	$("#"+selector).modal("show");
        };

        $scope.hideModelPopup = function(selector) {
        	$("#"+selector).modal("hide");
        	$scope.setModelWatcherStatus(selector, false);
        };
        
        $scope.hideAllModelPopup = function()
        {
			$(".modal.show").each(function(){
				var selector  = $(this).attr('id');
				$("#"+selector).modal("hide");
        		$scope.setModelWatcherStatus(selector, false);
			});
		}
        
        $scope.setModelWatcherStatus = function(id, status) {
        	$scope.modal.modelPopupStatus[id] = status;
        	try{
        		if(status){
        			/**added below condition to fix issue after updating angular js version**/
        			if ($rootScope.$$phase == '$apply' || $rootScope.$$phase == '$digest') {
        				$rootScope.$$phase = null;
        			}
        				$scope.$apply();
        		}else{
        			$scope.$evalAsync();
        		}
        		/** ERROR $scope.$apply(); throws error because digest cycle already running. refer-> https://docs.angularjs.org/error/$rootScope/inprog **/
        	}catch(e){
        		console.log(e);
        	}
        };
        
        /** @description It'll check for the active modal dialog **/
        $scope.isAnyModalDialogActive = function() {
            if ($(".modal .in").length) {
                return true;
            } else {
                return false;
            }
        };

        /** This is a callback function which will fire after last script loaded and set a flag */
        $scope.lastScriptOnLoad = function() {
            $scope.isLastScriptLoaded = true;
        };

        /** @description It'll set the preferred language as selected language
         * @param { string } selectedLanguage - The selected language
         * @deprecated **/
        $scope.setPreferedLanguage = function(selectedLanguage) {
            if (selectedLanguage) {
                switch (selectedLanguage) {
                    case "hi":
                        selectedLanguage = "hi-IN";
                        break;
                    case "en":
                        selectedLanguage = "en-US";
                        break;
                    default:
                        break;
                }
                $translate.use(selectedLanguage);
            }
        };

        /** @description It'll initialize the authentication information of the logged in user 
         * and call the loadColorSchemeFromPortal in Util for loading portal theme
         * @param { object } authInfo - The Authentication Information of the logged in user **/
        $scope.initAuthInfo = function(authInfo) {
            $scope.modal.AUTH_INFO = authInfo;
            $scope.portalPreference = ServiceFactory.AUTH_INFO.get("preferenceObject");
            //$scope.updateToBDBThemeTest();
            if ($scope.portalPreference) {
                loadColorSchemeFromPortal($scope.portalPreference);
            }
        };
        $scope.updateToBDBThemeTest = function(){
        	var bdbTheme = {
        			"headerBGColor": "#006684",
        			"headerTextAndIconColor": "#ffffff",
        			"headerTextAndIconBGHoverColor": "#006684",
        			"headerTextAndIconHoverColor": "#ffffff",
        			
        			"menuPanelBGColor": "#86dff9",
        			"menuPanelTextAndIconColor": "#006684",
        			"menuPanelTextAndIconBGHoverColor": "#86dff9",
        			"menuPanelTextAndIconHoverColor": "#006684",

        			"navBarBGColor": "#e0dfdf",
        			"navBarTextAndIconColor": "#000000",
        			"navBarTextAndIconBGHoverColor": "#cecdcd",
        			"navBarTextAndIconHoverColor": "#000000",

        			"contextMenuBGColor": "#ffffff",
        			"contextMenuTextAndIconColor": "#006684",
        			"contextMenuTextAndIconBGHoverColor": "#cecdcd",
        			"contextMenuTextAndIconHoverColor": "#000000",

        			"folderTextColor": "#000",
        			"treeSlideBarColor": "#006488"
        		};
        	for(var key in bdbTheme){
        		$scope.portalPreference[key] = bdbTheme[key];
        	}
        };

        /** @description collapsePropertyWindow when mouse is clicked in the screen **/
//            $( document ).on( "mouseup keydown", $scope.collapsePropertyWindows );

        /** @description onDocumentClick description 
         * @param  {[type]} evt [description] **/
        $scope.onDocumentClick = function(evt) {
            if (navigator.appVersion.indexOf("Win") != -1 || !Modernizr.inputtypes.color) {
            	$scope.initSpectrumColorPicker("input[type='color']");
            }
            $scope.modal.sWsVisible = false;
            $scope.modal.wsSearchKey = "";
        };
        /**DAS-1077 @desc method to get list of pushed dashboard version for @dashboardId*/
		$scope.getDesignerRecords = function(docId){		
			var requrl = "/designer/getDesignerRecords";
			var reqdata = {};
			
			var spacekey = encryptText(window.sessionStorage.getItem('bvz_spacekey'));
			var userid = encryptText(window.sessionStorage.getItem('bvz_userid'));
			
			var reqHeader = {
				authtoken: window.sessionStorage.getItem('bvz_token'),
				spacekey: spacekey,
				docid: docId,
				userID: userid
			};
			requestSuccessFn = function (response,success) {
				if(response.success){
					$scope.dopreviewState = "yes";
				}
				else
					{	
					$scope.dopreviewState = "no";
					}
				
			},
			requestFailedFn = function (response, success) {
				$scope.dopreviewState = "error";
			};		
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequestDocId(requrl, reqdata, reqHeader, requestSuccessFn, requestFailedFn);
		};

        /** @description togglePreview window **/
        $scope.togglePreview = function() {
			ServiceFactory.closeAllNotifications();
			$scope.hideAllModelPopup();
            if ($scope.modal.selectedDashboard && $scope.modal.selectedDashboard !== "") {
				/**DAS-1077 */
				var docid =  $scope.modal.selectedDashboard.json.Dashboard.backendId != "" ? $scope.modal.selectedDashboard.json.Dashboard.workspaceId + "_" + $scope.modal.selectedDashboard.json.Dashboard.backendId : 0 ; 
				if(!$scope.previewStage){
				$scope.getDesignerRecords(docid);
				}
				if($scope.dopreviewState == "yes"){
                if ($scope.previewStage) {
                    if (!IsBoolean($scope.modal.selectedDashboard.componentObjectList)) {
                        $scope.modal.dashboards[$scope.modal.dashboards.length - 1] = "";
                        $scope.modal.dashboards.length = $scope.modal.dashboards.length - 1;
                        $scope.modal.selectedDashboard = $scope.previewSelectedDashboard;
                        /**Below line added for updating selected layouttype to resolve "Dashboard when saved in mobile view and Previewed from manage page, 
                         * changing the mode to mobile view for already opened dashboard in design mode." */
                        $scope.modal.layoutType = ($scope.modal.selectedDashboard) ? $scope.modal.selectedDashboard.json.Dashboard.layoutType : "";
                        $scope.enablePreviewButton = false;
                    }
                    $scope.showHomeButton();
                    $scope.showSaveButton();
                    $scope.showDashboardTabs();
                    $scope.stopPreview();
                } else {
						$scope.hideHomeButton();
	                    $scope.hideSaveButton();
	                    $scope.hideDashboardTabs();
	                    $scope.doPreview();
                }
                $scope.previewStage = !$scope.previewStage;
                }else{
					if($scope.dopreviewState == "error"){
							ServiceFactory.showNotification("Access Denied", "alert-danger", 3000);
						}else{
							ServiceFactory.showNotification("Access Denied", "alert-danger", 3000);
						}	
				}
            } else {
                ServiceFactory.showNotification("No dashboard available for preview", "alert-warning", 3000);
            }
        };
        /** @description previewFromManagePage window*/
        $scope.previewFromManagePage = function(dashboardProperties, event) {
            event ? event.stopPropagation() : "";
            if (!dashboardProperties)
                return false;
            $scope.openProcessingItem = dashboardProperties;
            /**DAS-1077 */
            var docid = dashboardProperties.parentId + "_" + dashboardProperties.dashboardId; 
			$scope.getDesignerRecords(docid);
			if($scope.dopreviewState == "no"){
				ServiceFactory.showNotification("Dashboard Preview Permission denied", "alert-danger", 3000);
				return false;
			}
			if($scope.dopreviewState == "error"){
				ServiceFactory.showNotification("Internal Server Error", "alert-danger", 3000);
				return false;
			}
            /** Will load all the component script in page **/
            $scope.loadComps();
            if ($scope.modal.selectedDashboard && $scope.modal.selectedDashboard !== "") {
                $scope.previewSelectedDashboard = {};
                $scope.previewSelectedDashboard = $scope.modal.selectedDashboard;
            }
            var
                REQ_URL = req_url.designer["openDashboard"],
                DES_PARAMS = {
                    dashboardId: dashboardProperties.dashboardId.toString()
                },
                REQ_DATA = {
                    dashboardParameters: JSON.stringify(DES_PARAMS)
                },
                requestSuccessFn = function(data, success) {
                    if (data && data.DesignerResp.success) {
                        var successCB = $scope.loadDashboardInPreview(data.DesignerResp.params);
                        if (successCB) {
                            dashboardProperties.isOpen = true;
                            ServiceFactory.closeAllNotifications();
                            ServiceFactory.showNotification("Dashboard has been loaded", "alert-success", 3000);
                        } else {
                            ServiceFactory.closeAllNotifications();
                        }
                    } else {
                        ServiceFactory.showNotification("Invalid dashboard configuration", "alert-danger", 3000);
                    }
                    $scope.hideHomeButton();
                    $scope.hideSaveButton();
                    $scope.hideDashboardTabs();
                    $scope.doPreview();
                    $scope.previewStage = !$scope.previewStage;
                    $scope.$apply();
                };
            $scope.enablePreviewButton = true;
            BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn);
        };
        $scope.previewThemeTemplate = function($event, href, name) {
        	$scope.previewOrEditThemeObj = {url: href, name: name};
        	$scope.showModelPopup("previewThemeTemplateModal");
        };
        
        $scope.previewOrEditThemeUrlFromWelcomePage = function($event, isPreview) {
        	ServiceFactory.getJsonFileData($scope.previewOrEditThemeObj.url, function(json) {
        		$scope.loadComps();
        		if(IsBoolean(isPreview)){
                    if ($scope.modal.selectedDashboard && $scope.modal.selectedDashboard !== "") {
                        $scope.previewSelectedDashboard = {};
                        $scope.previewSelectedDashboard = $scope.modal.selectedDashboard;
                    }
                    $scope.enablePreviewButton = true;
                    $scope.openProcessingItem = {
                		dashboardId: json.dashboardJson.Dashboard.id,
                		dashboardName: json.dashboardJson.Dashboard.name,
                		parentId: json.dashboardJson.Dashboard.workspaceId
                    };                
                    var successCB = $scope.loadDashboardInPreview(json);
                    $scope.hideHomeButton();
                    $scope.hideSaveButton();
                    $scope.hideDashboardTabs();
                    $scope.doPreview();
                    $scope.previewStage = !$scope.previewStage;        			
        		} else {
        			$scope.browseBVZXDashboard({
                        fileData: json,
                        fileName: $scope.previewOrEditThemeObj.name + ".bvzx"
                    });
        		}
                $scope.$apply();
            });
        };

        $scope.loadDashboardInPreview = function(json) {
            var dashboardJson = convertStringToJson(json).dashboardJson;
            dashboardJson.Dashboard.workspaceId = $scope.openProcessingItem.parentId;
            dashboardJson.Dashboard.name = $scope.openProcessingItem.dashboardName;
            var dashboardId = dashboardJson.Dashboard.id;
            var dashboardName = dashboardJson.Dashboard.name;
            $scope.modal.layoutType = dashboardJson.Dashboard.layoutType || "AbsoluteLayout";
            $scope.toggleMenu();

            /** Will remove the null from the Objects array of AbsoluteLayout, otheriwse dashboard is crashing while opening **/
            dashboardJson.Dashboard.AbsoluteLayout.Object = DesignerUtil.prototype.removeNullFromObjectsArray(dashboardJson.Dashboard.AbsoluteLayout.Object);

            $scope.modal.selectedDashboard = {
                "id": dashboardId,
                "name": dashboardName,
                "json": dashboardJson
            };
            $scope.modal.dashboards.push($scope.modal.selectedDashboard);
            $scope.initHintVariables($scope.modal.selectedDashboard.id);
        };
        /** @description switchDevicesAndPreview
         * @param { string } dName - The device name **/
        $scope.switchDevicesAndPreview = function(dName) {
            if (!!dName.trim()) {
                switch (dName) {
                    case "LG":
                        $scope.scrRes.ht = "";
                        $scope.scrRes.wt = "100%";
                        break;
                    case "MD":
                        $scope.scrRes.ht = "";
                        $scope.scrRes.wt = "996";
                        break;
                    case "SM":
                        $scope.scrRes.ht = "";
                        $scope.scrRes.wt = "768";
                        break;
                    case "XS":
                        $scope.scrRes.ht = "";
                        $scope.scrRes.wt = "480";
                        break;
                    default:
                }
                $scope.stopPreview();
                $scope.doPreview();
            }
        };

        /** @description changePreviewLayout  
         * @return {[type]} [description] **/
        $scope.changePreviewLayout = function() {
            var scrWt = $scope.isSelectedDashboardResponsive() ? $scope.scrRes.wt : "100%",
                $previewContainer = $("#bizVizPreview"),
                $oPrevBackground = $(".prevBackground"),
                $prevContParent = $previewContainer.parent(),
                $prevBackground = $("<div></div>"),
                winWt = $(window).width(),
                halfScrWt = scrWt / 2,
                halfWinWt = winWt / 2,
                left = halfWinWt - halfScrWt;

            $prevBackground.addClass("prevBackground").css({
                "z-index": "1000"
            });
            $oPrevBackground.remove();
            $prevContParent.append($prevBackground);

            $previewContainer.width(scrWt);
            if (scrWt == "100%") {
                $previewContainer.css("left", 0);
            } else {
                $previewContainer.css("left", left);
            }
        };

        /** @description doPreview
         * @return {[type]} [description] **/
        $scope.doPreview = function() {
            ServiceFactory.showNotification("Previewing dashboard", "alert-info", 3000);
            $scope.changePreviewLayout();
            $("#bizVizPreview").css("z-index", 1001);
            $scope.previewLabel = "Back to Design";
            $("#bizVizPreview").show();
            $scope.loadSelectedDashboard();
           /* $("#previewBtn i").removeClass("bd-preview").addClass("bd-close");*/
            $scope.dashboardView.viewIcon = "nt-close-icon",
            $scope.dashboardView.isPreview = true;
        };

        /**
         @description stopPreview description]
         * @return {[type]} [description]
         */
        $scope.stopPreview = function() {
        	ServiceFactory.closeAllNotifications();
            $scope.stopDashboardProcesses();
            $("#bizVizPreview").hide();
            $("#bizVizPreview").css("z-index", -999);
            $scope.previewLabel = "Preview";
            /*$("#previewBtn i").removeClass("bd-close").addClass("bd-preview");*/
            $scope.dashboardView.viewIcon = "nt-preview-icon",
            $scope.dashboardView.isPreview = false;
            $(".prevBackground").remove();
        };

        /**
         @description stopDashboardProcesses description]
         * @return {[type]} [description]
         */
        $scope.stopDashboardProcesses = function() {
            if ($("#dashboardViewerFrame")[0] && $("#dashboardViewerFrame")[0].contentWindow && $("#dashboardViewerFrame")[0].contentWindow.DashBoard != undefined) {
                $("#dashboardViewerFrame")[0].contentWindow.stopDashboardProcesses();
            }
        };

        /** @description toggleMenu method called when clicked on right panel menu icons **/
        $scope.toggleMenu = function() {
			ServiceFactory.closeAllNotifications();
            if (!$scope.isMainMenuVisible) {
                $scope.showMenu();
            } else {
                $scope.hideMenu();
            }
        };

        $scope.showMenu = function() {
            $(".file-menu").removeClass("hideSM").addClass("showSM");
            $scope.hideDashboardHeader();
            $scope.isMainMenuVisible = true;
        };

        $scope.hideMenu = function() {
            $(".file-menu").removeClass("showSM").addClass("hideSM");
            $scope.showDashboardHeader();
            $scope.isMainMenuVisible = false;
        };

        $scope.hideDashboardHeader = function() {
            $scope.hideDashboardTabs();
            $scope.hidePreviewBtn();
            $scope.hideSaveButton();
        };

        $scope.showDashboardHeader = function() {
            $scope.showDashboardTabs();
            $scope.showPreviewBtn();
            $scope.showSaveButton();
        };

        $scope.hideDashboardTabs = function() {
            $("#dashboardTabs").hide();
            $(".rw-container").hide();
        };

        $scope.showDashboardTabs = function() {
            $("#dashboardTabs").show();
            $(".rw-container").show();
        };

        $scope.hidePreviewBtn = function() {
            //$("#previewBtn").hide();
        };

        $scope.showPreviewBtn = function() {
            //$("#previewBtn").show();
        };

        $scope.hideSaveButton = function() {
            $("#saveBtn").hide();
        };

        $scope.showSaveButton = function() {
            $("#saveBtn").show();
        };

        $scope.hideHomeButton = function() {
            $("#designerHomeIcon").hide();
        };

        $scope.showHomeButton = function() {
            $("#designerHomeIcon").show();
        };

        $scope.handleAlertConfirmation = function(_event, _handler) {
            switch (_handler) {
                case "DEL-COMP":
                	/**Added to handle delete operation in multiselect*/
                    if ($scope.multiSelected) {
                        var deleteFromObjectBrowser = true;
                        $scope.multiSelectDragConfiguration(deleteFromObjectBrowser);
                    }
                    $scope.delComp();
                    break;
                case "DEL-ALL-COMP":
                    $scope.delAllComp();
                    break;
                case "DEL-CONN":
                    $scope.delConn($scope.dataURL4removeConnection);
                    break;
                default:
                    break;
            }
        };
        
        $scope.delComp = function() {
            var cId = $scope.modal.selectedComponentId;
            var comp = $scope.getComponentbyId(cId);
            $scope.toggleRemoveComponentWindow(cId);
            var a = $scope.removeComponentbyId(cId);
			if (a === "pinned") {
				ServiceFactory.showNotification("Cannot remove: component(s) are pinned on mobile/tablet.", "alert-danger", 3000);
			}
            $scope.rcc = cId;
            $scope.registerInHistory("delete",comp);
        };
        /** @description for hiding component windows from design mode **/
        $scope.toggleRemoveComponentWindow = function(cId) {
            $scope.removeMenuSelection();
            $scope.reloadDefault("");
        };

        $scope.delAllComp = function() {
            $scope.deleteAll();
        };
        $scope.doYouWantToDelete = function() {
            $scope.showModelPopup("deleteCompConfirmation");
        };
        $scope.doYouWantToDeleteAll = function() {
            if ($scope.modal.listOfSelectedComponents.length == $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object.length) {
                $scope.showModelPopup("deleteAllCompConfirmation");
            } else {
                $scope.showModelPopup("deleteSelectedCompConfirmation");
            }
        };

        $scope.delConn = function(dataURL) {
            $scope.deleteConnection(dataURL);
        };
        $scope.doYouWantToDeleteConn = function(dURL4rmConn, event) {
            event.stopPropagation();
            $scope.dataURL4removeConnection = dURL4rmConn;
            $scope.showModelPopup("deleteConnConfirmation");
        };

        /** @description getUserPropsByToken Service need to be called on every preview 
         * as custom field value can be changed in portal tab and in preview it is used **/
        $scope.getUserPropsByToken = function() {
            var REQ_URL = req_url.designer["getUserPropsByToken"],
                REQ_DATA = {},
                requestSuccessFn = function(data, success) {
                    var prop = (data) ? ((data.users) ? (data.users.userProps || "[]") : "[]") : "[]";
                    $scope.loadSelectedDashboard(JSON.parse(prop));
                },
                requestFailFn = function() {
                    console.log("Failed to load user's custom properties!");
                    $scope.loadSelectedDashboard();
                };
            try {
                BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn, requestFailFn);
            } catch (e) {
                console.log("Error in getting user's custom properties!");
            }
        };
        /** @description load the current dashboard in preview mode **/
        $scope.loadSelectedDashboard = function() {
            try {
                $scope.updateObjectsForSaveAndPreview();
                $scope.updateDashboardJSONForPreview();
                /** if preview IFrame is already loaded it has the charting scripts, redraw the dashboard is only needed **/
                if ($("#dashboardViewerFrame")[0].contentWindow.DashBoard == undefined) {
                    $("#dashboardViewerFrame").attr("src", "./views/Preview.html");
                } else {
                    $("#dashboardViewerFrame")[0].contentWindow.drawDashboard(global.dashboardJSONForPreview);
                }
            } catch (error) {
                ServiceFactory.showNotification("Preview Error: " + error + ", " + error.message, "alert-warning", 3000);
            }
        };

        $scope.updateObjectsForSaveAndPreview = function() {
          //$scope.applyGlobalvariablesToAllObjects();
        	/* Commented above method to remove global variable scripts and reduce json,
        	 * added a new method below to set importcomponents and importstat.        	
        	 */
        	$scope.setImportComponentsToDashboardJson();
            $scope.updateAuthTokenInJSON();
        };

        /** Copy of dashboard should be sent to preview, so that change by script would not affect the original JSON **/
        $scope.updateDashboardJSONForPreview = function() {
            global.dashboardJSONForPreview = {
                "Niv": angular.copy($scope.modal.selectedDashboard.json)
            };
        };
        $scope.setImportComponentsToDashboardJson = function() {
        	 $scope.modal.selectedDashboard.json.Dashboard.imports = [];
        	 /** stat will be zero again on drop complete of a new component so set it to 1 **/
        	 $scope.modal.selectedDashboard.json.Dashboard.importsStat = 1;
        	 angular.forEach($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object, function(comp) {
                 if (comp) {
                     try {
                         $scope.pushImport(comp.designData.class);
                     } catch (e) {
                         console.log(e);
                     }
                 }
             });
        };
        /** Creating global variable for all components and connection
        also updating used Query service details for the purpose of
        migration of services from one portal to another **/
        $scope.applyGlobalvariablesToAllObjects = function() {
            $scope.modal.selectedDashboard.json.Dashboard.GlobalVariable.Variable = [];
            $scope.modal.selectedDashboard.json.Dashboard.DataProviders.queryServiceList = [];
            $scope.modal.selectedDashboard.json.Dashboard.imports = [];
            /** stat will be zero again on drop complete of a new component so set it to 1 **/
            $scope.modal.selectedDashboard.json.Dashboard.importsStat = 1;
            $scope.addContextGlobalVar();
            $scope.addDashboardGlobalVar();
            angular.forEach($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object, function(comp) {
                if (comp) {
                    try {
                        var node = comp["subElement"];
                        var nodeAttribute = comp["globalVariableKeyAttribute"];
                        comp[node][nodeAttribute] = comp.variable.Key;
                        $scope.modal.selectedDashboard.json.Dashboard.GlobalVariable.Variable.push(comp.variable);
                        $scope.pushImport(comp.designData.class);
                    } catch (e) {
                        console.log(e);
                    }
                }
            });
            angular.forEach($scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL, function(durl) {
                $scope.modal.selectedDashboard.json.Dashboard.GlobalVariable.Variable.push(durl.variable);
                if (durl.selectedServiceID) {
                    $scope.modal.selectedDashboard.json.Dashboard.DataProviders.queryServiceList.push({
                        "queryServiceID": durl.selectedServiceID
                    });
                }
            });
        };

        $scope.pushImport = function(cls) {
            if ($scope.modal.selectedDashboard.json.Dashboard.imports.indexOf(cls) == -1) {
                $scope.modal.selectedDashboard.json.Dashboard.imports.push(cls);
                $scope.pushDependentImports(cls);
            }
        };

        /** @description Dependent Scripts should be pushed to imports 
         *  in order to support the trellis chart drawing in portal and opendoc.
         *  TODO in future if any new chart type is added in Trellis chart, same has to be updated here **/
        $scope.pushDependentImports = function(cls) {
            if (cls == "TrellisChart") {
                var trellisDependencyScript = ["BarChart", "BubbleChart", "ColumnStackChart", "LineChart"];
                for (var t = 0; t < trellisDependencyScript.length; t++) {
                    if ($scope.modal.selectedDashboard.json.Dashboard.imports.indexOf(trellisDependencyScript[t]) == -1) {
                        $scope.modal.selectedDashboard.json.Dashboard.imports.push(trellisDependencyScript[t]);
                    }
                }
            }
        };

        $scope.addContextGlobalVar = function() {
            var ctxt = $scope.getNewVariableJson();
            if (ctxt) {
                ctxt.Key = "context";
                $scope.modal.selectedDashboard.json.Dashboard.GlobalVariable.Variable.push(ctxt);
            }
        };

        $scope.addDashboardGlobalVar = function() {
            $scope.modal.selectedDashboard.json.Dashboard.GlobalVariable.Variable.push($scope.modal.selectedDashboard.json.Dashboard.variable);
        };

        /** THIS method has to be changed according to	authentication process in the application. 
         * Right now its picking from TempAuthentication mechanism inside 
         * /bizviz.designer_qa/WebContent/common/TempAuthentication.js **/
        $scope.updateAuthTokenInJSON = function() {
            var param = $scope.newParamJSON();
            if (param) {
                param["name"] = "token";
                param["value"] = ServiceFactory.AUTH_INFO.get("token");
                $scope.modal.selectedDashboard.json.Dashboard.FlashVars.Param = [];
                $scope.modal.selectedDashboard.json.Dashboard.FlashVars.Param.push(param);
            }
        };

        $scope.newParamJSON = function() {
            var newJSON = "";
            return angular.copy($scope.modal.selectedDashboard.json.FlashVars_Param, newJSON);
        };

        /** @description called from OpenDasboard to load the Charting component scripts **/
        $scope.loadComps = function() {
            if (!$scope.importCompSrc) {
                $scope.importCompSrc = "./views/designArea/importcomponents.html";
            }
        };

        /** @description Exit menu operation in main menu page **/
        angular.element(document).ready(function() {
            window.onbeforeunload = confirmExit;
            function confirmExit() {
                if (IsBoolean($scope.anyDashboardModified())) {
                    return "There are unsaved changes in your design.";
                }
            }
        });
        $scope.anyDashboardModified = function() {
        	if($scope.modal && $scope.modal.dashboards){
        		for (var i = 0; i < $scope.modal.dashboards.length; i++) {
	                if ($scope.modal.dashboards[i]["json"]["changeStatus"] > 0) {
	                    return true;
	                }
	            }
        	}
            return false;
        };

        $scope.searchClickHandle = function() {
            $scope.searchButtonToggle = !$scope.searchButtonToggle;
            if ($scope.searchButtonToggle == true) {
                $scope.populateGvarDefaultValueList();
            }
        };
        $scope.populateGvarDefaultValueList = function() {
            try {
                $scope.defaultValueList = [];
                angular.forEach($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, function(comp) {
                    $scope.defaultValueList = $.merge($scope.defaultValueList, comp.variable.DefaultValues.DefaultValue);
                });
            } catch (error) {
                console.log(error.message);
            }
        };
       
        $scope.toggleObjOptions = function(e) {
            var $curTag = $(e.target);
            $scope.displayFnOptions = false;
            if ($curTag.hasClass("bvz-display") ||
                $curTag.hasClass("bvz-display-placeholder") ||
                $curTag.hasClass("glyphicon")) {
                if ($scope.displayObjOptions) {
                    $scope.displayObjOptions = false;
                    $scope.objQuery = "";
                } else {
                    $scope.displayObjOptions = true;
                    setTimeout(function() {
                        $(".bvz-search").focus();
                    });
                }
            } else if ($curTag.hasClass("bvz-search")) {} else {
                $scope.displayObjOptions = false;
                $scope.objQuery = "";
            }
        };

        $scope.updateSelectedObjSearch = function(e, obj) {
            $scope.selectedObj = obj;
        };

        $scope.updateSelectedValueInSearch = function(e, item) {
            //			$scope.actualTag = item.actualTag;
            //			$scope.searchButtonToggle = false;
            $scope.selectedGlobalVariable = item;
        };
        $scope.secureRequestErrorHandler = function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                ServiceFactory.closeAllNotifications();
                clearTimeout($scope.timeout);
                $.unblockUI();
                $("#sessionWarning").modal("show");
            }
        };

        /**---------------------------- Keyboard shortcuts for designer action ------------------------------------
        		alt+ctrl+n ------------ Create new dashboard
        		ctrl+o ---------------- Open a dashboard from local machine
        		ctrl+s ---------------- Save dashboard
        		ctrl+shift+s ---------- SaveAs dashboard (save to another workspace)
        		alt+ctrl+s ------------ Save to local disk
        		ctrl+g ---------------- Manage component groups
        		ctrl+j ---------------- Copy component JSON
        		ctrl+z ---------------- Undo the property change
        		ctrl+y ---------------- Redo the property change
        		ctrl+a ---------------- Select all components
        		del ------------------- Delete selected component(s)
        		left ------------------ Move selected component left by one pixel
        		right ----------------- Move selected component right one pixel
        		up -------------------- Move selected component up one pixel
        		down ------------------ Move selected component down one pixel
        		ctrl+b ---------------- Send selected component back one step
        		ctrl+shift+b ---------- Send selected component backward at the end
        		ctrl+f ---------------- Bring selected component to front one step
        		ctrl+shift+f ---------- Bring selected component forward at the front
        **/
        (function() {
            $scope.HOTKEY_CONFIGs = [{
                "name": "createNewDashboard",
                "config": {
                    "combo": "alt+ctrl+n",
                    "description": "Create new dashboard",
                    "callback": function(e) {
                        if ($scope.isAnyModalDialogActive()) return false;
                        e.preventDefault();
                        $scope.createNewDashboard(true);
                    }
                }
            }, {
                "name": "OpenDashboard",
                "config": {
                    "combo": "ctrl+o",
                    "description": "Open dashboard from local",
                    "callback": function(e) {
                        if ($scope.isAnyModalDialogActive()) return false;
                        e.preventDefault();
                        /** To hide the home page window set this variable to true **/
                        $scope.isMainMenuVisible = true;
                        $scope.HandleBrowseClick("browseBVZXDashboard");
                        /** Reset this variable to true as toggleMenu() in browseBVZXDashboard() toggling this variable value */
                        $scope.isMainMenuVisible = true;
                    }
                }
            }, {
                "name": "SaveDashboard",
                "config": {
                    "combo": "ctrl+s",
                    "description": "Save dashboard",
                    "callback": function(e) {
                        if ($scope.isAnyModalDialogActive()) return false;
                        e.preventDefault();
                        $scope.saveDashboard();
                    }
                }
            }, {
                "name": "SaveAsDashboard",
                "config": {
                    "combo": "ctrl+shift+s",
                    "description": "SaveAs dashboard",
                    "callback": function(e) {
                        if ($scope.isAnyModalDialogActive()) return false;
                        e.preventDefault();
                        $scope.openSaveAsDialog();
                    }
                }
            }, {
                "name": "SaveToLocalDiskDashboard",
                "config": {
                    "combo": "alt+ctrl+s",
                    "description": "Save to local disk dashboard",
                    "callback": function(e) {
                        if ($scope.isAnyModalDialogActive()) return false;
                        e.preventDefault();
                        $scope.exportCurrentDashboard();
                    }
                }
            }, {
                "name": "ManageComponentGroup",
                "config": {
                    "combo": "ctrl+g",
                    "description": "Manage component groups",
                    "callback": function(e) {
                        if ($scope.isAnyModalDialogActive()) return false;
                        e.preventDefault();
                        if ($scope.modal.selectedDashboard != "") {
                            //$scope.showAddToGroupDialog();
                        }
                    }
                }
            }, {
                "name": "CopyComponentJson",
                "config": {
                    "combo": "ctrl+j",
                    "description": "Copy component json",
                    "callback": function(e) {
                        if ($scope.isAnyModalDialogActive()) return false;
                        e.preventDefault();
                        $scope.copyComponentJson();
                    }
                }
            }, {
                "name": "Undo",
                "config": {
                    "combo": "ctrl+z",
                    "description": "Undo the property change",
                    "callback": function(e) {
                    	if ($scope.modal.layoutType == "AbsoluteLayout") {
	                    	if ($scope.isAnyModalDialogActive()) return false;
	                    	e.preventDefault();
	                    	var historyProperty = $scope.modal.currentHistoryProperties();
	                    	if (historyProperty.historyStackPointer >= 0) {
	                    	    historyProperty.skipHistoryRegister = true;
	                    	    if (historyProperty.historyActiveStack[historyProperty.historyStackPointer].action !== "oldComp") {
	                    	        for (var i = 0; i < historyProperty.compHistory.length; i++) {
	                    	            var key1 = historyProperty.historyActiveStack[historyProperty.historyStackPointer].object.objectID;
	                    	            var key2 = Object.keys(historyProperty.compHistory[i])[0];
	                    	            if (key1 === key2) {
	                    	                var index = historyProperty.compHistory[i][key1].length - 2;
	                    	                if (historyProperty.historyActiveStack[historyProperty.historyStackPointer].executionID === undefined) {
	                    	                    angular.forEach($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object, function(comp, index) {
	                    	                        if (comp.objectID == historyProperty.historyActiveStack[historyProperty.historyStackPointer].object.objectID) {
	                    	                            $scope.toggleRemoveComponentWindow(comp.objectID);
	                    	                            $scope.removeComponentbyId(comp.objectID);
	                    	                        }
	                    	                    });
	                    	                } else if (historyProperty.historyActiveStack[historyProperty.historyStackPointer].action === "delete") {
	                    	                    var comp = historyProperty.historyStack[historyProperty.historyStackPointer].object;
	                    	                    var data = comp.designData;
	                    	                    $scope.onDropComplete(data, "redo", comp);
	                    	                } else {
	                    	                    if (index > -1) {
	                    	                        $scope.executeHistory(historyProperty.compHistory[i][key1][index]);
	                    	                    }
	                    	                }
	                    	                historyProperty.compHistory[i][key1].pop();
	                    	                break;
	                    	            }
	                    	        }
	                    	        historyProperty.historyActiveStack.pop();
	                    	        historyProperty.historyStackPointer--;
	                    	    }
	                    	}
	                    	historyProperty.skipHistoryRegister = false;
	                    	$scope.modal.currentHistoryProperties(historyProperty);
	                    }
                    }
                }
            }, {
                "name": "ReDo",
                "config": {
                    "combo": "ctrl+y",
                    "description": "Redo the property change",
                    "callback": function(e) {
                    	if ($scope.modal.layoutType == "AbsoluteLayout") {
	                    	if ($scope.isAnyModalDialogActive()) return false;
	                    	e.preventDefault();
	                    	var historyProperty = $scope.modal.currentHistoryProperties();
	                    	if (historyProperty.historyStackPointer < historyProperty.historyStack.length - 1) {
	                    	    historyProperty.skipHistoryRegister = true;
	                    	    historyProperty.historyStackPointer++;
	                    	    if (historyProperty.historyStack[historyProperty.historyStackPointer].action !== "oldComp") {
	                    	        historyProperty.historyActiveStack.push(historyProperty.historyStack[historyProperty.historyStackPointer]);
	                    	        for (var i = 0; i < historyProperty.compHistory.length; i++) {
	                    	            var key1 = historyProperty.historyStack[historyProperty.historyStackPointer].object.objectID;
	                    	            var key2 = Object.keys(historyProperty.compHistory[i])[0];
	                    	            if (key1 === key2) {
	                    	                historyProperty.compHistory[i][key1].push(historyProperty.historyStack[historyProperty.historyStackPointer]);
	                    	                break;
	                    	            }
	                    	        }
	                    	        if (historyProperty.historyStack[historyProperty.historyStackPointer].executionID === undefined) {
	                    	            var comp = historyProperty.historyStack[historyProperty.historyStackPointer].object;
	                    	            var data = comp.designData;
	                    	            $scope.onDropComplete(data, "redo", comp);
	                    	        } else {
	                    	            if (historyProperty.historyStack[historyProperty.historyStackPointer].action === "delete") {
	                    	                angular.forEach($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object, function(comp, index) {
	                    	                    if (comp.objectID == historyProperty.historyActiveStack[historyProperty.historyStackPointer].object.objectID) {
	                    	                        $scope.toggleRemoveComponentWindow(comp.objectID);
	                    	                        $scope.removeComponentbyId(comp.objectID);
	                    	                    }
	                    	                });
	                    	            } else {
	                    	                $scope.executeHistory(historyProperty.historyActiveStack[historyProperty.historyStackPointer]);
	                    	            }
	                    	        }
	                    	    }
	                    	}
	                    	historyProperty.skipHistoryRegister = false;
	                    	$scope.modal.currentHistoryProperties(historyProperty);
	                    }
                    }
                }
            }, {
                "name": "SelectAll",
                "config": {
                    "combo": "ctrl+a",
                    "description": "Select all components",
                    "callback": function(e) {
                        if ($scope.isAnyModalDialogActive()) return false;
                        e.preventDefault();
                        $scope.selectAllComponents();
                    }
                }
            }, {
                "name": "DeleteComponent",
                "config": {
                    "combo": "del",
                    "description": "Delete selected component(s)",
                    "callback": function(e) {
                        if ($scope.isAnyModalDialogActive()) return false;
                        e.preventDefault();
                        if ($scope.modal.listOfSelectedComponents) {

                            if ($scope.modal.listOfSelectedComponents.length > 0  && $scope.modal.layoutType == "AbsoluteLayout") {
                                $scope.doYouWantToDeleteAll();
                            }
                        }
                    }
                }
            }, {
                "name": "MoveLeft",
                "config": {
                    "combo": "left",
                    "description": "Move selected component left by one pixel",
                    "callback": function(e) {
                        if ($scope.isAnyModalDialogActive()) return false;
                        e.preventDefault();
                        if($scope.multiSelected){
                        	$scope.removeMultiSelectedWrapDiv();
                        }
                        var component = "";
                        $.each($scope.modal.listOfSelectedComponents, function(index, element) {
                        	if($scope.component==undefined){
                        		component = $scope.getComponentbyId(element);
                        	}else{
                        		component = $scope.component;
                        	}
                        	if(!IsBoolean(component.showLocked)){
                        		 var leftPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).position().left - 1;
                                 if (leftPos != 0) {
                                     var rightEnd = leftPos + $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).width();
                                     var propObjx = {
                                         "attributeName": "x",
                                         "propertyName": "Object",
                                         "type": "Number",
                                         "value": leftPos
                                     };
                                     $scope.modal.selectedComponentId = element;
                                     propObjx["value"] = rightEnd - $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).width();
                                     $scope.updateObjectWithPropertyValue(propObjx);
                                     $scope.initPropertyPalette($scope.modal.listOfSelectedComponents[index]); //UPDATES PROPERTY PALETTE
                                     var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
                                     $scope.redrawComponent(componentJSON);
                                 }
                        	}
                        });
                        if($scope.multiSelected){
                        	$scope.multiSelectDragConfiguration();
                        }
                    }
                }
            }, {
                "name": "MoveRight",
                "config": {
                    "combo": "right",
                    "description": "Move selected component right by one pixel",
                    "callback": function(e) {
                        if ($scope.isAnyModalDialogActive()) return false;
                        e.preventDefault();
                        if($scope.multiSelected){
                        	$scope.removeMultiSelectedWrapDiv();
                        }
                        var dbId = $scope.modal.selectedDashboard.id,
                    		component = "";
                        $.each($scope.modal.listOfSelectedComponents, function(index, element) {
                        	if($scope.component==undefined){
                        		component = $scope.getComponentbyId(element);
                        	}else{
                        		component = $scope.component;
                        	}
                        	if(!IsBoolean(component.showLocked)){
                        		var leftPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).position().left;
                                var dbWidth = $("#" + dbId).width();
                                var compWidth = $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).width();
                                if (leftPos + compWidth < dbWidth) {
                                    var rightEnd = leftPos + $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).width() + 1;
                                    var propObjx = {
                                        "attributeName": "x",
                                        "propertyName": "Object",
                                        "type": "Number",
                                        "value": leftPos
                                    };
                                    $scope.modal.selectedComponentId = element;
                                    propObjx["value"] = rightEnd - $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).width();
                                    $scope.updateObjectWithPropertyValue(propObjx);
                                    $scope.initPropertyPalette($scope.modal.listOfSelectedComponents[index]); //UPDATES PROPERTY PALETTE
                                    componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
                                    $scope.redrawComponent(componentJSON);
                                }
                        	}
                        });
                        if($scope.multiSelected){
                        	$scope.multiSelectDragConfiguration();
                        }
                    }
                }
            }, {
                "name": "MoveUp",
                "config": {
                    "combo": "up",
                    "description": "Move selected component up by one pixel",
                    "callback": function(e) {
                        if ($scope.isAnyModalDialogActive()) return false;
                        e.preventDefault();
                        if($scope.multiSelected){
                        	$scope.removeMultiSelectedWrapDiv();
                        }
                        var component = "";
                        $.each($scope.modal.listOfSelectedComponents, function(index, element) {
                        	if($scope.component==undefined){
                        		component = $scope.getComponentbyId(element);
                        	}else{
                        		component = $scope.component;
                        	}
                        	if(!IsBoolean(component.showLocked)){
                        		/** Updated for mobile and tab view when dashboardDiv is scrollable */
                        		if ($scope.modal.layoutType !== "AbsoluteLayout") {
                        			var topPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[index])[0].offsetTop - 1;
                        		} else {
                        			var topPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).position().top - 1;
                        		}
                                if (topPos != 0) {
                                    var propObjy = {
                                        "attributeName": "y",
                                        "propertyName": "Object",
                                        "type": "Number",
                                        "value": topPos
                                    };
                                    $scope.modal.selectedComponentId = element;
                                    $scope.updateObjectWithPropertyValue(propObjy);
                                    $scope.initPropertyPalette($scope.modal.listOfSelectedComponents[index]); //UPDATES PROPERTY PALETTE
                                    componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
                                    $scope.redrawComponent(componentJSON);
                                }
                        	}
                        });
                        if($scope.multiSelected){
                        	$scope.multiSelectDragConfiguration();
                        }
                    }
                }
            }, {
                "name": "MoveDown",
                "config": {
                    "combo": "down",
                    "description": "Move selected component down by one pixel",
                    "callback": function(e) {
                        if ($scope.isAnyModalDialogActive()) return false;
                        e.preventDefault();
                        var dbId = $scope.modal.selectedDashboard.id,
                        	component = "";
                        if($scope.multiSelected){
                        	$scope.removeMultiSelectedWrapDiv();
                        }
                        $.each($scope.modal.listOfSelectedComponents, function(index, element) {
                        	if($scope.component==undefined){
                        		component = $scope.getComponentbyId(element);
                        	}else{
                        		component = $scope.component;
                        	}
                        	if(!IsBoolean(component.showLocked)){
                        		/** Updated for mobile and tab view when dashboardDiv is scrollable */
                        		if ($scope.modal.layoutType !== "AbsoluteLayout") {
        							var topPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[index])[0].offsetTop;
        						} else {
                        			var topPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).position().top;
        						}
                                var dbHeight = $("#" + dbId).height();
                                var compHeight = $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).height();
                                if (topPos + compHeight < dbHeight) {
                                    var botEnd = topPos + $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).height();
                                    var propObjy = {
                                        "attributeName": "y",
                                        "propertyName": "Object",
                                        "type": "Number",
                                        "value": topPos
                                    };
                                    $scope.modal.selectedComponentId = element;
                                    propObjy["value"] = botEnd - $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).height() + 1;
                                    $scope.updateObjectWithPropertyValue(propObjy);
                                    $scope.initPropertyPalette($scope.modal.listOfSelectedComponents[index]); //UPDATES PROPERTY PALETTE
                                    componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
                                    $scope.redrawComponent(componentJSON);
                                }
                        	}
                        });
                        if($scope.multiSelected){
                        	$scope.multiSelectDragConfiguration();
                        }
                    }
                }
            }, {
                "name": "SendToBack",
                "config": {
                    "combo": "ctrl+b",
                    "description": "Send selected component back one step",
                    "callback": function(e) {
                        if ($scope.isAnyModalDialogActive()) return false;
                        e.preventDefault();
                        if ($scope.modal.listOfSelectedComponents.length == 0) {
                            ServiceFactory.showNotification("Select a component", "alert-warning", 3000);
                        } else if ($scope.modal.listOfSelectedComponents.length == 1) {
                            $scope.sendToBack();
                        } else {
                            ServiceFactory.showNotification("Please select only one component", "alert-warning", 3000);
                        }
                    }
                }
            }, {
                "name": "SendBackward",
                "config": {
                    "combo": "ctrl+shift+b",
                    "description": "Send selected component backward at the end",
                    "callback": function(e) {
                        if ($scope.isAnyModalDialogActive()) return false;
                        e.preventDefault();
                        if ($scope.modal.listOfSelectedComponents.length == 0) {
                            ServiceFactory.showNotification("Select a component", "alert-warning", 3000);
                        } else if ($scope.modal.listOfSelectedComponents.length == 1) {
                            $scope.sendBackward();
                        } else {
                            ServiceFactory.showNotification("Please select only one component", "alert-warning", 3000);
                        }
                    }
                }
            }, {
                "name": "BringToFront",
                "config": {
                    "combo": "ctrl+f",
                    "description": "Bring to front",
                    "callback": function(e) {
                        if ($scope.isAnyModalDialogActive()) return false;
                        e.preventDefault();
                        if ($scope.modal.listOfSelectedComponents.length == 0) {
                            ServiceFactory.showNotification("Select a component", "alert-warning", 3000);
                        } else if ($scope.modal.listOfSelectedComponents.length == 1) {
                            $scope.bringToFront();
                        } else {
                            ServiceFactory.showNotification("Please select only one component", "alert-warning", 3000);
                        }
                    }
                }
            }, {
                "name": "BringForward",
                "config": {
                    "combo": "ctrl+shift+f",
                    "description": "Bring selected component forward at the front",
                    "callback": function(e) {
                        if ($scope.isAnyModalDialogActive()) return false;
                        e.preventDefault();
                        if ($scope.modal.listOfSelectedComponents.length == 0) {
                            ServiceFactory.showNotification("Select a component", "alert-warning", 3000);
                        } else if ($scope.modal.listOfSelectedComponents.length == 1) {
                            $scope.bringForward();
                        } else {
                            ServiceFactory.showNotification("Please select only one component", "alert-warning", 3000);
                        }
                    }
                }
            }];

            /** Add all the key configuration in hotkeys **/
            for (var i = 0; i < $scope.HOTKEY_CONFIGs.length; i++) {
                hotkeys.add($scope.HOTKEY_CONFIGs[i]["config"]);
            }
        })();

        /** ----------------------------------- Keyboard shortcuts ------------------------------------------- **/

        /** INPUT VALIDATOR **/
        $scope.restrictInput = function(e, _type) {
            e = e || window.event;
            var KEY_CODES = {
                    BACKSPACE: 8,
                    TAB: 9,
                    ENTER: 13,
                    SHIFT: 16,
                    CTRL: 17,
                    ALT: 18,
                    ESC: 27,
                    SPACE: 32,
                    PAGE_UP: 33,
                    PAGE_DOWN: 34,
                    END: 35,
                    HOME: 36,
                    LEFT: 37,
                    UP: 38,
                    RIGHT: 39,
                    DOWN: 40,
                    DELETE: 46
                },
                charCode = e.which ? e.which : e.keyCode,
                charStr = String.fromCharCode(charCode);
            cursorPos = e.target.selectionStart,
            beforeStr = e.target.value,
            afterStr = beforeStr.substr(0, cursorPos) + charStr + beforeStr.substr(cursorPos);

            if (charCode == KEY_CODES.BACKSPACE ||
                charCode == KEY_CODES.ENTER ||
                charCode == KEY_CODES.LEFT ||
                charCode == KEY_CODES.RIGHT ||
                charCode == KEY_CODES.UP ||
                charCode == KEY_CODES.DOWN ||
                charCode == KEY_CODES.END ||
                charCode == KEY_CODES.HOME ||
                charCode == KEY_CODES.DELETE) {
                return;
            }

            if (_type != undefined) {
                switch (_type) {
                    case "positiveNumberOnly":
                        var regEx = /\d/;
                        if (!(regEx.test(charStr)) || charStr == "-") {
                            ServiceFactory.showNotification("Only positive numbers are allowed", "alert-info", 3000);
                            e.preventDefault();
                        }
                        break;
                    case "fieldName":
                        var regEx = /^[a-zA-Z_][a-zA-Z_0-9]*$/i;
                        if (charStr != "" && !(regEx.test(afterStr))) {
                            ServiceFactory.showNotification("Space or special character not allowed", "alert-info", 3000);
                            e.preventDefault();
                        }
                        break;
                    default:
                        break;
                }
            }
        };

        $scope.validateInput = function(e, _type) {
            e = e || window.event;
            var inputValue = e.target.value;
            var outputValue = inputValue;

            if (_type != undefined) {
                switch (_type) {
                    case "borderThickness":
                        if (outputValue > 10) {
                            setTimeout(function() {
                                $translate("Border thickness should not be greater than 10").then(function(data) {
                                    ServiceFactory.showNotification(data, "alert-warning", 3000);
                                    for (var i = 0; i < inputValue.length; i++) {
                                        if (outputValue > 10) {
                                            outputValue = outputValue.substring(0, outputValue.length - 1);
                                        }
                                    }
                                    e.target.value = outputValue;
                                });
                            }, 100);
                        }
                        break;
                    case "fieldName":
                        var regEx = /^[a-zA-Z_][a-zA-Z_0-9]*$/i;
                        break;
                    default:
                        break;
                }
            }
        };
    };

	/** @description Controller definition **/
    angular.module("designer")
    .controller("DesignerController", ["$scope", "$rootScope", "ServiceFactory", "hotkeys", "notify", "$translate", designerControllerFn]);

})();
//# sourceURL=DesignerController.js