/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: MainMenuController.js
 * @description It controls main page actions 
 * **/
(function () {
	/** Controller function for MainMenus
	 * @param  {Object} $scope			the scope object
	 * @param  {Object} $window			the $window
	 * @param  {Object} ServiceFactory	the ServiceFactory
	 * @param  {Object} DesignerFactory	the DesignerFactory
	 * @param  {Object} $compile		the $compile
	 * @param  {Object} $translate		the $translate
	 * @param  {Object} $timeout		the $timeout
	 * @return {undefined}				undefined
	 */
	var mainMenuControllerFn = function ($scope, $window, ServiceFactory, DesignerFactory, $compile, $translate, $timeout, $interval, $mdMenu, $document) {
		$scope.modal = DesignerFactory;
		$scope.recentlyClickedItem = "";
		$scope.newDashboardName = "Untitled Dashboard";
		$scope.scriptHelpUrl = dGlobals.scriptHelpUrl;
		$scope.designerHelpUrl = dGlobals.designerHelpUrl;
		$scope.searchVisible = false;
		$scope.controlDisable = false;
		$scope.alreadyPublished = false;
		$scope.publishAction = "PUB_OVERRIDE";
		$scope.pubInfoMsg = "";
		$scope.maxTabLength = 3;
		$scope.openProcessingItem = "";
		$scope.updateDashAction = "";
		$scope.selectedWorkspace = {};
		$scope.serverAlertMsg = {
			text : "",
			type : ""
		};
		$scope.languageList =
			[{
				locale : "en-US",
				displayName : "English(US)",
			}, {
				locale : "hi-IN",
				displayName : "हिंदी(भारत)",
			}
		];
		$scope.brandConfig = window.app_brand_cfg;
		$scope.selectedLanguage = $scope.languageList[0];
		/**getiing workspace key and name from admin setting */
		var selectedWorkspace = window.sessionStorage.getItem('workspace');
		var WorkspaceDetail = selectedWorkspace.split("_");
		$scope.selectedWorkspaceKey = WorkspaceDetail[0];
		$scope.selectedWorkspaceName = WorkspaceDetail[1];
		/**get stored @selectedTheme from localStrogae if saved and applied it to body data-theme attribute */
		//$scope.currentTheme = localStorage.getItem('theme') || 'light';
		$scope.currentTheme = window.sessionStorage.getItem('theme');
		document.body.setAttribute('data-theme', $scope.currentTheme);

		/**@desc function to change dark-light theme for UI */
		$scope.toggleDarkMode = function() {
		this.darkMode = !this.darkMode;
		var theme = this.darkMode ? 'dark' : 'light';
		document.body.setAttribute('data-theme', theme);
		$scope.currentTheme = theme;
		// Save the selected theme in local storage
		localStorage.setItem('theme', theme);
		};
		$scope.isUserDropdownOpen = false;
		$scope.isUserAlertOpen = false;
		$scope.isUserNavigationOpen = false;
		/**header user login ui */
		$scope.toggleUserDropdown = function(){
			$scope.isUserAlertOpen = false;
			$scope.isUserNavigationOpen = false;
			$scope.isUserDropdownOpen = !$scope.isUserDropdownOpen;
		};
		/**header user alert ui */
		$scope.toggleUserAlertNotification = function(){
			$scope.isUserDropdownOpen = false;
			$scope.isUserNavigationOpen = false;
			$scope.isUserAlertOpen = !$scope.isUserAlertOpen;
		};
		/**header user navigation ui */
		$scope.toggleUserNavigation = function(){
			$scope.isUserDropdownOpen = false;
			$scope.isUserAlertOpen = false;
			$scope.isUserNavigationOpen = !$scope.isUserNavigationOpen;
		};
		$scope.userNotification = function(){
			window.location.href = "/home/#/notifications";
		}
		$scope.userLogout = function(){
			var singoutroute = 'signin';
			if (sessionStorage.getItem('bvz_authInfo') && JSON.parse(sessionStorage.getItem('bvz_authInfo')).user.lite === true) {
			    singoutroute = 'lite-preview';
			}
			if(window['headerSettings']['signOuturl'] == 'default'){
				/**DAS-1230 @desc logout service */
				var
				REQ_URL = "/auth/logout",
				REQ_DATA = {
					token: ServiceFactory.AUTH_INFO.get("token"),
					userId : ServiceFactory.AUTH_INFO.get("userID"),
					spaceKey : ServiceFactory.AUTH_INFO.get("spacekey")
				},
				requestSuccessFn = function (data, success) {
				var _success = data.users.success;
				if(_success){
					localStorage.clear();
					sessionStorage.clear();
					window.location.href = "/home/#/"+singoutroute;
				}else{
					localStorage.clear();
					sessionStorage.clear();
					window.location.href = "/home/#/"+singoutroute;
				}
				},
				requestFailedFn = function (data_gws, success) {
				 /**clear all session */
				 localStorage.clear();
				 sessionStorage.clear();
				 window.location.href = "/home/#/"+singoutroute;
				}
				BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA,requestSuccessFn, requestFailedFn);
			}else{
			localStorage.clear();
			sessionStorage.clear();
			window.location.href = "/home/#/"+singoutroute;
			}
		}
		/**user naogation header menu */
		var iconNumberToValue = {
			    '998315': 'administration',
			    '898305': 'security',
			    // '829590' : "bdbForm",
			    '829590': 'forms',
			    '798406': 'pipeline',
			    '798306': 'dataConnector',
			    '498314': 'designer',
			    '98323': 'servey',
			    '98317': 'ds_lab',
				'98407': 'genai'
			  };
		var permissions = [];
		permissions.push({
			        icon: 'home',
			        name: 'Home',
			        nameId: 'Home',
			        menuDisplayType: 1,
			        status: 1,
			  });
		if (sessionStorage.getItem('bvz_authInfo') && JSON.parse(sessionStorage.getItem('bvz_authInfo')).permissions) {
			var userPermissions = JSON.parse(sessionStorage.getItem('bvz_authInfo')).permissions;
			userPermissions.map(function(perm) {
				if (perm.name == 'Data Science Labs') perm.name = 'DS Lab';
				if (perm.name == 'BDB Form') perm.name = 'Forms';
				if (perm.name == 'User') perm.name = 'Security';	
				if(perm.name == 'Data Agent' ) perm.icon = '98407';			
				permissions.push({
			        icon: iconNumberToValue[perm.icon],
			        name: perm.name,
			        nameId: perm.nameId,
			        menuDisplayType: perm.menuDisplayType,
			        status: perm.status
				});
			});
		}
		permissions.push({
		  icon: 'reports',
		  name: 'Report',
		  nameId: 'Report',
		  menuDisplayType: 1,
		  status: 1
		});
		$scope.headerNavMenu = permissions;
		
		$scope.dashboardResizeConfig = {
		    start: function (e, ui) {
		    	//fix#20765.1 && fix#20765.2
		    	var uiResizable = $(this).data("uiResizable"), 
		    		originalSize = uiResizable.originalSize,
		    		sizeDiff = uiResizable.sizeDiff;
		    	originalSize.width += sizeDiff.width;
		    	originalSize.height += sizeDiff.height;
		    },
		    stop: function( e, ui ) {
		    	var size = $(this).data("uiResizable").size;
	    		$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.width = (size.width - (size.width % $scope.modal.bgGridSize));
	    		$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.height = (size.height - (size.height % $scope.modal.bgGridSize));
	    		/** Update the component property, it will call redraw internally **/
	    		$scope.initPropertyPalette($scope.getActiveDashboardId(), true);
		    }
		};
		$scope.dashboardSelectConfig = {
		    filter : ".bizvizComponent",
		    start: function( e, ui ) {
		        e.preventDefault();
		        $(".c-group").removeClass("selected-group");
                $scope.deselectAllComponent();
                $("#designerCxtMenuContainer .dropdown-menu").hide();
                if($scope.isBoxVisible){
                	$scope.createPropertyPalette($scope.modal.selectedDashboard.id,true);
                }
                $scope.dragSelectList = [];
		    },
		    selecting : function (e, ui) {
                var cId = ui.selecting.id.split("dcc_")[1];
                $scope.dragSelectList.push(cId);
            },
            unselecting : function (e, ui) {
                var cId = ui.unselecting.id.split("dcc_")[1],
                index = $scope.dragSelectList.indexOf(cId);
                $scope.dragSelectList.splice(index, 1);
            },
            stop : function (e, ui) {
                for (var i = 0; i < $scope.dragSelectList.length; i++) {
                    $scope.selectComponent($scope.dragSelectList[i]);
                }
            }
		};
		$scope.permissions={ //DAS-1064
			view:0,
			edit:0,
			execute:0,
		}
		$scope.includeUserbtn = false;
		$scope.deleteUser_GroupModalHeader = "";
		/** Material menus to open **/
		$scope.openMenu = function($mdMenu, ev) {
			var originatorEv = ev;
			$mdMenu.open(ev);
		};
		
		/** Sets the SnapTogrid size to the design area 
         * Should be 1 for old dashboards, should be 10/20/50/100 for newer dashboards, Cannot be 0 **/
        $scope.setSnapToGridSize = function() {
        	$scope.modal.bgGridSize = ($scope.modal.userPreference.snapToGrid) ? Number($scope.modal.userPreference.snapToGrid.size) : 1;
        };
        
		/** mainMenuSelectedWindow will be initialized from selected menu in main menu page **/
		//$scope.mainMenuSelectedWindow = "";
        $scope.afterMenuReady = function() {
            applyMainMenuColorScheme( $scope.portalPreference );
        };
		
		/** @description It will initialize all the dependencies for MainMenuController **/
		$scope.onInitMainMenu = function () {
			/** For showing active workspace and dashboard in workspace management page **/
	        $scope.uiActive = {
	            menu: {
	                isUiActive: false
	            },
	            workspace: {
	                isActive: false
	            },
	            dashboard: {
	                isActive: false
	            },
	            allDashboard: false,
	            trash: false
	        };
			$timeout(function () {
				$scope.modal.hideBootLoader = true;
				$(".bvz-loader-container").hide();
			});
			/** Sets the user information to modal for use in controller **/
			$scope.initAuthInfo(BIZVIZ.SDK.getAuthInfo());
			/** dashVarMap is the hash which stores variables of a dashboard, dashboardId is the key and gVar are the value**/
			$scope.modal.dashVarMap = {};
			$scope.modal.readySdkPropList = [];
			/** Read the json and set the window level global variables **/
			ServiceFactory.getJsonFileData("./resources/data/appSettings.data", function (json) {
				/** global is a global variable which is coming from appSettings.js file **/
				for(var key in json.global){
					global[key] = json.global[key];
				}
				$scope.modal.global = global;
				$scope.ver = $scope.modal.global.versionLabel;
			});
			/** Setup loader for ajax start to stop in designer module**/
			designerInitLoader();
			ServiceFactory.getJsonFileData("./resources/data/sdkConfig.data", function (dJson) {
				$scope.modal.sdkProperties = dJson;
				for (var obj in $scope.modal.sdkProperties) {
					$scope.modal.readySdkPropList.push(obj);
				}
			});
			ServiceFactory.getJsonFileData("./resources/data/containers/templateConfig.data", function (data) {
				$scope.modal.responsiveTemplates = data["templates"];
			});
			ServiceFactory.getJsonFileData("./resources/data/tourConfig.data", function (data) {
				$scope.modal.tourConfig = data;
			});
			
			$scope.getWorkspaces($scope.updatePublishPage);
			/** @description CallBack is written here**/
			$scope.getSavedUserPreferences(
				function (svdUsrprefs) {
					svdUsrprefs = DesignerUtil.prototype.ISJson(svdUsrprefs);
					var usrPrefsString = null;
					if (!(svdUsrprefs instanceof Object)) {
						ServiceFactory.getJsonFileData("./resources/data/UserPreference.data", function (_preferences) {
							$scope.modal.userPreference = _preferences;
							$scope.modal.userPreference.showGridLines = ServiceFactory.correctObjectFormat($scope.modal.userPreference.showGridLines);
							if($scope.modal.userPreference.snapToGrid){
								$scope.modal.userPreference.snapToGrid.size = ServiceFactory.correctObjectFormat($scope.modal.userPreference.snapToGrid.size);
							}else{
								$scope.modal.userPreference.snapToGrid = {"enable": true, "size": 1};
							}
							$scope.setSnapToGridSize();
							if($scope.modal.userPreference.defaultLimitConfigs){
								$scope.modal.userPreference.defaultLimitConfigs = ServiceFactory.correctObjectFormat($scope.modal.userPreference.defaultLimitConfigs);
							}else{
								$scope.modal.userPreference.defaultLimitConfigs = {
									"excelFile": "3145728", /** 3MB: 3145728, 5MB: 5242880, 6MB: 6291456, 10MB: 10485760 **/
									"imgFile": "3145728",
									"bvzxFile": "3145728"
								};
							}
							$scope.modal.userPreference.defaultSettings.dashboardBorderThickness = ServiceFactory.correctObjectFormat($scope.modal.userPreference.defaultSettings.dashboardBorderThickness);
							$scope.modal.userPreference.defaultSettings.notifyOnSuccess = ServiceFactory.correctObjectFormat($scope.modal.userPreference.defaultSettings.notifyOnSuccess);
							$scope.modal.userPreference.defaultSettings.blockNotificaton = ServiceFactory.correctObjectFormat($scope.modal.userPreference.defaultSettings.blockNotificaton);
							$scope.modal.userPreference.defaultSettings.showShadow = ServiceFactory.correctObjectFormat($scope.modal.userPreference.defaultSettings.showShadow);
							$scope.modal.userPreference.defaultSettings.enableMultipleDrag = ServiceFactory.correctObjectFormat($scope.modal.userPreference.defaultSettings.enableMultipleDrag);
							usrPrefsString = JSON.stringify($scope.modal.userPreference);
							$scope.updateUserPreferences(usrPrefsString);
						});
					} else {
						$scope.modal.userPreference = svdUsrprefs;
						$scope.modal.userPreference.showGridLines = ServiceFactory.correctObjectFormat($scope.modal.userPreference.showGridLines);
						if($scope.modal.userPreference.snapToGrid){
							$scope.modal.userPreference.snapToGrid.size = ServiceFactory.correctObjectFormat($scope.modal.userPreference.snapToGrid.size);
						}else{
							$scope.modal.userPreference.snapToGrid = {"enable": true, "size": 1};
						}
						$scope.setSnapToGridSize();
						if($scope.modal.userPreference.defaultLimitConfigs){
							$scope.modal.userPreference.defaultLimitConfigs = ServiceFactory.correctObjectFormat($scope.modal.userPreference.defaultLimitConfigs);
						}else{
							$scope.modal.userPreference.defaultLimitConfigs = {
								"excelFile": "3145728",
								"imgFile": "3145728",
								"bvzxFile": "3145728"
							};
						}
						$scope.modal.userPreference.defaultSettings.dashboardBorderThickness = ServiceFactory.correctObjectFormat($scope.modal.userPreference.defaultSettings.dashboardBorderThickness);
					}
					$scope.loadMainMenuList();
					$scope.loadheaderNavMenu();
					/** LKD DAS-408 @description call global theme service and assign available theme in @scope.modal.globalThemeDbConfig */
					/*
					var
					REQ_URL = "/bizviz/pluginService",
					REQ_DATA = {
		      			spacekey: ServiceFactory.AUTH_INFO.get("spacekey"),
		      			token: ServiceFactory.AUTH_INFO.get("token"),
		      			consumerName: "BIZVIZSETTINGS",
		      			serviceName: "getMasterSettings",
		      			data: {"type":"dashboardtheme"}
		      	},
					requestSuccessFn = function (data, success) {
		      		if(success && data && data.settings){
		      			if(data.settings[0].settings != ""){
		      				$scope.modal.globalThemeDbConfig = convertStringToJson(data.settings[0].settings);
		      			}else{
		      				ServiceFactory.showNotification("Empty Theme List", "alert-info", 3000);
		      			}
		      		}else{
		      			ServiceFactory.showNotification("Failed to get Theme List", "alert-danger", 3000);
		      		}
		      	},
		      	requestFailedFn = function (data_gws, success) {
		      		 ServiceFactory.showNotification("Failed to get Theme List", "alert-danger", 3000);
		      	}
		      	
		      	BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA,requestSuccessFn, requestFailedFn);
		      	*/
				});

			function openPropDatasetFxWindow(event, icon){
				event.stopPropagation();
				var tempScope = angular.element(document.getElementById("obc-settings")).scope();
				if (icon == "appearance") {
					tempScope.executeAction(tempScope.modal.selectedComponentId, "openPropWindow");
				} else if (icon == "dataSettings") {
					tempScope.executeAction(tempScope.modal.selectedComponentId, "openDatasetWindow");
				} else if (icon == "fx") {
					tempScope.executeAction(tempScope.modal.selectedComponentId, "openFnWindow");
				} else {
                	// Do nothing
                }
			}
			$("body").on("click", ".obc-settings-list li md-icon", function (event) {
				openPropDatasetFxWindow(event, event.target.getAttribute('name'));
			});
			$("body").on("click", ".obc-settings-list li img", function (event) {
				openPropDatasetFxWindow(event, event.target.name);
			});
			/**
			 * Calling the same function two times.
			 * Dataset palette was hiding because of this line.
			 * So after commenting the same line now it's calling only once.
			 */
			/*$("body").on("click", ".ca-settings-list li img", function (event) {
				openPropDatasetFxWindow(event, event.target.name);
			});*/
			/**The name attribute on <md-icon> is not a standard attribute that gets included in event.target. */
			$("body").on("click", ".ca-settings-list img", function (event) {
				openPropDatasetFxWindow(event, event.target.name);
			});
			$("body").on("click", ".ca-settings-list md-icon", function (event) {
				openPropDatasetFxWindow(event, event.target.getAttribute('name'));
			});
			$("body").on("click", ".propertyDivIcons li img", function (event) {
				openPropDatasetFxWindow(event, event.target.name);
			});
			$("body").on("click", ".propertyDivIcons li md-icon", function (event) {
				openPropDatasetFxWindow(event, event.target.getAttribute('name'));
			});
			/*$("body").on("click", ".propertyDivIcons li", function (event) {
				openPropDatasetFxWindow(event, event.target.id);
			});*/
			$("body").on("click", function (event) {
				$("#designerCxtMenuContainer .dropdown-menu").hide();
				if (!$(event.target).hasClass("comp-appearance-icon")) {
					$(".comp-appearance-icon").popover("hide");
					$(".bizVizControlBoxBody .popover").remove();
				}
			});
		};
		/**
		 * @description It will get all the workspaces for logged in user
		 * @param { function } _callbackFunction - The callback function
		 * @param { boolean } internalRefresh - The boolean value which tells the function to show or not the notification
		 * */
		$scope.getWorkspaces = function (_callbackFunction, internalRefresh) {
			var
			REQ_URL = req_url.designer["getAllWorkspaceAndDashboard"],
			REQ_DATA = {},
			wsObj = { wsList : [], dbList : [], wsNdb : {} },
			requestSuccessFn = function (data_gws, success) {
				var _success = data_gws.DesignerResp.success,
				_hasDashboards = data_gws.DesignerResp.dashboards ? true : false,
				dbList = _hasDashboards ? DesignerUtil.prototype.getArrayOfSingleLengthJson(data_gws.DesignerResp.dashboards) : [];
				if (_success) {
					$scope.updateTrashedItems();
					/**
					 * Loop is reversed to show last added workspace/dashboard on top in manage page.
					 * Single loop is used to set the list of workspaces/dashboards and wsNdb list
					 */
					for (var i = dbList.length - 1; i >= 0; i--) {
						if (!dbList[i].isDashboard) {
							try {
								wsObj.wsList.push(dbList[i]);
								if (!wsObj.wsNdb[dbList[i]["dashboardId"]])
									wsObj.wsNdb[dbList[i]["dashboardId"]] = [];
							} catch (e) {
								console.error(e);
							}
						} else if (dbList[i].isDashboard) {
							try {
								dbList[i]["isOpen"] = ($scope.isOpenDb(dbList[i].dashboardId)) ? true : false;
								wsObj.dbList.push(dbList[i]);
								if (!wsObj.wsNdb[dbList[i]["parentId"]])
									wsObj.wsNdb[dbList[i]["parentId"]] = [];
								wsObj.wsNdb[dbList[i]["parentId"]].push(dbList[i]);
							} catch (e) {
								console.error(e)
							}
						} else {
	                    	// Do nothing
	                    }
					}
					$scope.modal.wsObj = wsObj;
					if (_callbackFunction && typeof(_callbackFunction) === "function") {
						_callbackFunction(wsObj);
					}
					$timeout.cancel($scope.timeout);
					if (wsObj.wsList.length == 0) {
						$scope.modal.zeroWorkspcae = true;
					} else {
						$scope.modal.zeroWorkspcae = false;
					}
					internalRefresh ? false : ServiceFactory.closeAllNotifications();
					internalRefresh ? false : $scope.serverAlertMsg = {
						text : "Workspaces has been loaded",
						type : "alert-success"
					};
				} else {
					internalRefresh ? false : ServiceFactory.closeAllNotifications();
					internalRefresh ? false : $scope.serverAlertMsg = {
						text : "Failed to load workspaces",
						type : "alert-danger"
					};
				}
				ServiceFactory.hideLoader();
			},
			requestFailedFn = function (data_gws, success) {
				if (_callbackFunction && typeof(_callbackFunction) === "function") {
					_callbackFunction(wsObj);
				}
			};
			internalRefresh ? false : ServiceFactory.showNotification("Getting workspaces", "alert-info", 30000);
			$scope.timeout = $timeout(function () {
				internalRefresh ? false : ServiceFactory.showNotification("Server is taking more than usual time", "alert-warning", 3000);
			}, 30000);
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA,requestSuccessFn, requestFailedFn);
		};
		
		/** @description Fetch the preferences saved by user **/
		$scope.getSavedUserPreferences = function (callback) {
			var REQ_URL = req_url.designer["getUserDesignerPreferences"],
			REQ_DATA = {},
			requestSuccessFn = function (data, success) {
				if (data && data.DesignerResp && data.DesignerResp.success) {
					if (typeof(callback) === "function") {
						if (data.DesignerResp.designerPreferences) {
							callback(data.DesignerResp.designerPreferences.preferences);
						} else {
							callback(false);
						}
					} else {
						console.info("callback function is undefined");
					}
				} else {
					ServiceFactory.showNotification("Failed to get preferences", "alert-danger", 3000);
				}
				ServiceFactory.hideLoader();
			},
			requestFailedFn = function (data, success) {
				if (data && data.DesignerResp) {
					if (typeof(callback) === "function") {
						if (data.DesignerResp.designerPreferences) {
							callback(data.DesignerResp.designerPreferences.preferences);
						} else {
							callback(false);
						}
					} else {
						console.info("callback function is undefined");
					}
				} else {
					ServiceFactory.showNotification("Failed to get preferences", "alert-danger", 3000);
				}
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
		};
		
		/**
		 * @description It will save or update user-preferences into the database
		 * @param { object } usrPrefs - The user-preferences object
		 * @param { function } callback - The callback function
		 * */
		$scope.updateUserPreferences = function (usrPrefs, callback) {
			var REQ_URL = req_url.designer["saveOrUpdateUserDesignerPreferences"],
			prefId = ServiceFactory.AUTH_INFO.get("preferenceObject").preferenceId,
			REQ_DATA = { "preferences" : usrPrefs },
			requestSuccessFn = function (sData, success) {
				if (sData && sData.DesignerResp && sData.DesignerResp.success) {
					ServiceFactory.showNotification("Preferences has been saved", "alert-success", 3000);
					if (typeof(callback) === "function") {
						callback(sData.users);
					}
				} else {
					ServiceFactory.showNotification("Failed to save preferences", "alert-danger", 3000);
				}
				ServiceFactory.hideLoader();
			};
			if (prefId) {
				REQ_DATA["preferenceID"] = prefId;
			}
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn);
		};
		
		/** @description get the list of menus on main page **/
		$scope.loadMainMenuList = function() {
           ServiceFactory.getJsonFileData( "./resources/data/mainMenu.data", function( mainMenuList ) {
                $scope.mainMenuList = mainMenuList;
                var designerIcons = angular.copy(window.app_brand_cfg.enableDesignerIcons);
                for(var i =0; i < $scope.mainMenuList.length; i++){
                	if($scope.mainMenuList[i].title == "Help" && IsBoolean(!designerIcons.Help)){
                		$scope.mainMenuList[i].enabled = false;
                	}
                }
				var manageItem = $scope.mainMenuList.find(function(item) {
					return item.id === "MANAGE";
				});
				$scope.setMainMenuActive(manageItem);
            });
			
        };
		$scope.unreadmessages = 0;
		$scope.unreadnotifications = [];
		if (sessionStorage.getItem('bvz_authInfo') && JSON.parse(sessionStorage.getItem('bvz_authInfo')).notificationCount) {
		   	$scope.unreadmessages = JSON.parse(sessionStorage.getItem('bvz_authInfo')).notificationCount;
		}
		if (sessionStorage.getItem('bvz_authInfo') && JSON.parse(sessionStorage.getItem('bvz_authInfo')).notifications) {
			$scope.unreadnotifications = JSON.parse(sessionStorage.getItem('bvz_authInfo')).notifications;
		}
		$scope.NavHeaderSvgLists = {
			home: 'nt-header-home',
			administration: 'nt-header-admin',
			security: 'nt-header-security',
			forms: 'nt-header-form',
			pipeline: 'nt-header-pipeline',
			dataConnector: 'nt-header-dataconnector',
			designer: 'nt-header-designer',
			servey: 'nt-header-survey',
			ds_lab: 'nt-header-ds_lab',
			reports: 'nt-header-reports',
			genai : 'nt-header-genAi'
		};
		$scope.loadheaderNavMenu = function(){
		//$scope.headerNavMenu = permissions;
		};
		/**header main menu navigation */
		$scope.navigateBy = function(item, routeName){
			var appRootPath = window.parent['appRootPath'] || window['appRootPath'];
			var route = $scope.permissionsRoute(item);
			var url = `${window['server_url']}${route}`;
			if (appRootPath) {
			appRootPath = appRootPath.replace(/\/$/, '');
			url = `${appRootPath}${route}`;
			}
			if (
			item &&
			item != '' &&
			(item.name === 'Designer' || item.name == 'Form' || item.name == 'Survey')
			)
			window.open(url, '_blank');
			else parent.window.location.href = url;			
		};
		/**@desc header menu module route path */
		$scope.permissionsRoute = function(app){
		      var route= "/home/#/";
			if (app.name == 'Data Pipeline') {
		        route = '/datapipeline/index.html';
		      } else if (app.name == 'Home') {
		        route = '/home/#/home/document';
		      } else if (app.name == 'Admin') {
		        route = '/home/#/admin';
		      } else if (app.name == 'Security') {
		        route = '/home/#/users';
		      } else if (app.name == 'Forms') {
		        route = '/forms/index.html';
		      } else if (app.name == 'Data Center') {
		        route = '/datacenter/#/connectors';
		      } else if (app.name == 'Designer') {
		        route = '/designer/views/designer/designhome.html';
		      } else if (app.name == 'Survey') {
		        route = '/survey/views/survey/index.html#/';
		      } else if (app.name == 'DS Lab') {
		        route = '/notebook/index.html';
		      } else if (app.name == 'Report') {
		        route = '/home/#/home/action/createstory';
		      }	else if (app.name == 'Data Agent') {
				route = '/newGenAi/#/genai';
			}
			  
			  return route;
		};
		/** @description For setting active workspace, Handles showing/hiding of highlighter div **/
        $scope.setWorkspaceSelected = function ( e, ws ) {
            var displayActive = function( ws ) {
               if( typeof( ws ) == "object" ) {
                    $scope.uiActive.allDashboard = false;
                    $scope.uiActive.trash = false;
                    $scope.uiActive.workspace.isActive = false;
                    ws.isActive = true;
                    $scope.uiActive.workspace = ws;
                }
                else {
                    if( ws == "ALL_DASHBOARD" ) {
                        $scope.uiActive.workspace.isActive = false;
                        $scope.uiActive.trash = false;
                        $scope.uiActive.allDashboard = true;
                    }
                    else if( ws == "TRASH" ) {
                        $scope.uiActive.workspace.isActive = false;
                        $scope.uiActive.allDashboard = false;
                        $scope.uiActive.trash = true;
                    } else {
                    	// Do nothing
                    }
                }
            };
            if( e ) {
                e.stopImmediatePropagation();
                $scope.modal.sWsVisible = false;
                $scope.modal.wsSearchKey = "";
                $scope.recentlyClickedItem = e.currentTarget.children[0].innerHTML.trim();
                if( $scope.recentlyClickedItem === "Trash" ) {
                    $scope.modal.dashboardSpaceHeader = "Trashed Items";
                    $scope.modal.dashboardSpaceMsg = "No item found !";
                } else {
                    $scope.modal.dashboardSpaceHeader = "Dashboards";
                    $scope.modal.dashboardSpaceMsg = "No dashboard found !";
                }
                displayActive( ws );
            }
        };
        /** @description For setting active dashboard, Handles showing/hiding of highlighter div **/
        $scope.setDashboardSelected = function ( e, db ) {
            var displayActive = function( db ) {
                if( db ) {
                    $scope.uiActive.dashboard.isActive = false;
                    db.isActive = true;
                    $scope.uiActive.dashboard = db;
                }
            };
            if( e ) {
                e.stopImmediatePropagation();
                $scope.modal.sWsVisible = false;
                $scope.modal.wsSearchKey = "";
                displayActive( db );
            }
        };
		$scope.handleMainMenuToggle = function( e, menu , status){
			if(menu.subMenu != undefined && menu.subMenu.length > 0){
							var spanElement = angular.element(e.currentTarget).find('span.nt-dropdown-icon');
							if(spanElement.length>0){
								spanElement.removeClass("nt-dropdown-icon").addClass("nt-dropdown-icon-open");
							}else{
								var spanElement1 = angular.element(e.currentTarget).find('span.nt-dropdown-icon-open');
								if(spanElement1.length>0){
									spanElement1.removeClass("nt-dropdown-icon-open").addClass("nt-dropdown-icon");
								}
							}	
						}
			if(!status){
				angular.element(document.querySelectorAll('span.nt-dropdown-icon-open'))
				    .removeClass('nt-dropdown-icon-open')
				    .addClass('nt-dropdown-icon');
			}
		};
        /** @description Event Callbacks for menus on main page **/
        $scope.handleMainMenuClick = function( e, menu ) {
			ServiceFactory.closeAllNotifications();
            var mId = menu.id;
            switch( mId ) {
                case "NEW":
                    break;
                case "WORKSPACE":
                    $scope.openCreateWorkspaceModal();
                    break;
                case "DASHBOARD":
                    $scope.createNewDashboard();
                    break;
                case "RES_DASHBOARD":
                    $scope.selectTemplate();
                    break;
                case "MANAGE":
                    $scope.modal.mainMenuSelectedWindow = "workspaceManagement";
                    $scope.setMainMenuActive( menu );
                    break;
                case "OPEN":
                    break;
                case "TEMPLATES":
                    $scope.modal.mainMenuSelectedWindow = "templates";
                    $scope.openTemplate();
                    $scope.setMainMenuActive( menu );
                    break;
                case "SAMPLEDB":
                    $scope.modal.mainMenuSelectedWindow = "sampleDashboard";
                    $scope.setMainMenuActive( menu );
                    break;
                case "OPN_FRM_LKL_DISK":
                    $scope.HandleBrowseClick( "browseBVZXDashboard" );
                    break;
                case "PREFERENCES":
                    $scope.modal.mainMenuSelectedWindow = "userPreferencesDashboard";
                    $scope.showUserPreference();
                    $scope.setMainMenuActive( menu );
                    break;
                case "SAVE_AS":
                    $scope.openSaveAsDialog( e );
                    break;
				case "GUIDED_TOUR":
				    $scope.startTour('designerHome');
				    break;				
                case "HELP":
                    $scope.modal.mainMenuSelectedWindow = "designerHelp";
                    $scope.doHelp();
                    $scope.setMainMenuActive( menu );
                    break;
                case "EXIT":
                    $scope.exitDesigner();
                    break;
                default:
                    $scope.modal.mainMenuSelectedWindow = "workspaceManagement";
                    $scope.setMainMenuActive( menu );
                    break;
            }
        };
        /*DAS-418 @description open template from manage page*/
        $scope.openTemplate = function (internalRefresh) {
        	$scope.templateMap = {};
        	var
			REQ_URL = req_url.designer["getAllWorkspaceAndDashboard"],
			REQ_DATA = {"type":"6"},
			templObj = { templWsList : [], templDbList : [], templWsNdb : {} },
			requestSuccessFn = function (data_gws, success) {
				var _success = data_gws.DesignerResp.success,
				_hasDashboards = data_gws.DesignerResp.dashboards ? true : false,
				templDbList = _hasDashboards ? DesignerUtil.prototype.getArrayOfSingleLengthJson(data_gws.DesignerResp.dashboards) : [];
				if (_success) {
					for (var i = templDbList.length - 1; i >= 0; i--) {
						if (!templDbList[i].isDashboard) {
							try {
								templObj.templWsList.push(templDbList[i]);
								if (!templObj.templWsNdb[templDbList[i]["dashboardId"]])
									templObj.templWsNdb[templDbList[i]["dashboardId"]] = [];
							} catch (e) {
								console.error(e);
							}
						} else if (templDbList[i].isDashboard) {
							try {
								if (templDbList[i].templateJson !== undefined) {
									templDbList[i]["templateJson"] = JSON.parse(templDbList[i].templateJson);
									templDbList[i]["templateJson"]["dashboardTemplateJson"]["templId"] = "template"+i;
									var imgBase64 = templDbList[i]["templateJson"]["dashboardTemplateJson"]["thumbNailBase64"];
									templDbList[i]["templateJson"]["dashboardTemplateJson"]["thumbNailBase64"] = "data:image/png;base64, " + imgBase64;
									templDbList[i]["templateFlag"] = true;
								}
								templDbList[i]["isOpen"] = ($scope.isOpenDb(templDbList[i].dashboardId)) ? true : false;
								templObj.templDbList.push(templDbList[i]);
								if (!templObj.templWsNdb[templDbList[i]["parentId"]])
									templObj.templWsNdb[templDbList[i]["parentId"]] = [];
								templObj.templWsNdb[templDbList[i]["parentId"]].push(templDbList[i]);
							} catch (e) {
								console.error(e)
							}
						} else {
	                    	// Do nothing
	                    }
					}
					$scope.modal.templObj = templObj;
					$timeout.cancel($scope.timeout);
					internalRefresh ? false : ServiceFactory.closeAllNotifications();
					internalRefresh ? false : $scope.serverAlertMsg = {
						text : "Templates has been loaded",
						type : "alert-success"
					};
					$scope.$apply();
				} else {
					internalRefresh ? false : ServiceFactory.closeAllNotifications();
					internalRefresh ? false : $scope.serverAlertMsg = {
						text : "Failed to load Template",
						type : "alert-danger"
					};
				}
				ServiceFactory.hideLoader();
			},
			requestFailedFn = function (data_gws, success) {
				console.log(data_gws);
			};
			internalRefresh ? false : ServiceFactory.showNotification("Getting Templates", "alert-info", 30000);
			$scope.timeout = $timeout(function () {
				internalRefresh ? false : ServiceFactory.showNotification("Server is taking more than usual time", "alert-warning", 3000);
			}, 30000);
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA,requestSuccessFn, requestFailedFn);
        };
        $scope.backToTemplateHome = function () {
        	$scope.modal.mainMenuSelectedWindow = "templates";
        };
        /** @description Called from manage page when clicked on Templates option **/
		$scope.listContainingTemplates = function (templWsId) {
			if (!templWsId) {
				$scope.templateMap["templatelist"] = $scope.modal.templObj.templDbList;

			} else {
				$scope.templateMap["templatelist"] = $scope.modal.templObj.templWsNdb[templWsId];
			}
			$scope.modal.mainMenuSelectedWindow = "templateList";
		};
		/** @description Called from manage page when mouse hovered on Templates**/
		$scope.onhoverTemplates = function (allTemplObj) {
			allTemplObj["templateFlag"] = false;
		};
		/** @description Called from manage page when mouse out on Templates**/
		$scope.onleaveTemplates = function (allTemplObj) {
			allTemplObj["templateFlag"] = true;
		};
		/** @description Called from manage page when clicked on Templates option **/
		$scope.downloadTemplateData = function (templWsId) {
			if (templWsId.templateJson) {
				var excelResponse = templWsId.templateJson.dashboardTemplateJson.excelBase64;
				var isIE = /*@cc_on!@*/ false;
				var isSafari = Object.prototype.toString.call(window['HTMLElement']).indexOf('Constructor');
				/** for IE browser **/
				if (isIE || !!document['documentMode'] || /Edge/.test(navigator.userAgent)) {
				    var contentType = excelResponse.split(',')[0];
				    contentType = contentType || '';
				    var sliceSize = 512;
				    var b64Data = excelResponse.split(',')[0];
				    b64Data = b64Data.replace(/^[^,]+,/, '');
				    b64Data = b64Data.replace(/\s/g, '');
				    var byteCharacters = window.atob(b64Data);
				    var byteArrays = [];
				    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
				        var slice = byteCharacters.slice(offset, offset + sliceSize);

				        var byteNumbers = new Array(slice.length);
				        for (var i = 0; i < slice.length; i++) {
				            byteNumbers[i] = slice.charCodeAt(i);
				        }

				        var byteArray = new Uint8Array(byteNumbers);

				        byteArrays.push(byteArray);
				    }

				    var blob = new Blob(byteArrays, {
				        type: contentType
				    });

				    if (window['saveAs']) {
				        window['saveAs'](blob, "TemplateData.xlsx");
				    } else {
				        window.navigator.msSaveBlob(blob, "TemplateData.xlsx");
				    }
				} else if (isSafari > 0) {
				    /** for Safari browser **/
				    window.open(excelResponse);
				} else {
				    /** for other browsers chrome, firefox, opera **/
				    var link = document.createElement('a');
				    link.setAttribute('id', 'anchor');
				    document.body.appendChild(link);
				    var anchorobj = document.getElementById('anchor');
				    anchorobj['href'] = 'data:application/octet-stream;base64,' + excelResponse;
				    anchorobj['download'] = "TemplateData.xlsx";
				    anchorobj.click();
				    anchorobj.remove();
				}
			} else {
				ServiceFactory.showNotification("File cann't be downloaded", "alert-danger", 3000);
			}
		};
        
        
		/** @description It will opens the new workspace modal dialog-box **/
		$scope.openCreateWorkspaceModal = function () {
			$scope.showModelPopup('newWorkspaceModal');
			$scope.setFocusOnInput("#newWorkspaceModal", "#workspaceName");
		};
		
		/** @description Create a New Dashboard **/
		$scope.createNewDashboard = function (_plusClickFlag, responsive) {
			ServiceFactory.closeAllNotifications();
			if ($scope.modal.dashboardTabs.length < $scope.maxTabLength) {
				/**Added to support multiple selected components drag */
				if(IsBoolean($scope.multiSelected) && IsBoolean($scope.modal.userPreference.defaultSettings.enableMultipleDrag)){
					$scope.deselectAllComponent();
				}
				if (!$scope.isLastScriptLoaded) {
					ServiceFactory.showLoader();
				}
				var dashboardId = getIdWithTimeStamp("dashboard");
				/**DAS-1167 */
				//$scope.currentTheme = localStorage.getItem('theme') || 'light';
				$scope.currentTheme = window.sessionStorage.getItem('theme') || 'light';
				if($scope.currentTheme == "dark"){
					$scope.onCustomThemeUpdateDropdown();	
				}
				$scope.addNewDashboardDiv(dashboardId, $scope.newDashboardName, $scope.addNewDashboardCallBack, responsive);
				$scope.modal.createHistoryProperties(dashboardId);
			} else {
				ServiceFactory.showNotification("Please close a dashboard", "alert-danger", 3000);
			}
			if (!_plusClickFlag) {
				// $scope.toggleMenu();
			}
		};
		
		/** DAS-418 @description Create a New Dashboard From Template **/
		$scope.createNewDashboardTemplate = function (_plusClickFlag, responsive) {
			if ($scope.modal.dashboardTabs.length < $scope.maxTabLength) {
				/**Added to support multiple selected components drag */
				if(IsBoolean($scope.multiSelected) && IsBoolean($scope.modal.userPreference.defaultSettings.enableMultipleDrag)){
					$scope.deselectAllComponent();
				}
				if (!$scope.isLastScriptLoaded) {
					ServiceFactory.showLoader();
				}
				var dashboardId = getIdWithTimeStamp("dashboard");
				$scope.addNewDashboardTemplateDiv(dashboardId, $scope.newDashboardName, $scope.addNewDashboardCallBack, responsive, $scope.templateDashboardJson);
				$scope.modal.createHistoryProperties(dashboardId);
			} else {
				ServiceFactory.showNotification("Please close a dashboard", "alert-danger", 3000);
			}
			if (!_plusClickFlag) {
				// $scope.toggleMenu();
			}
		};
		
		/** @description It will open the template selection dialog-box **/
		$scope.selectTemplate = function () {
			$scope.showModelPopup('templateSelection');
		};
		        
		/** @description Set menu as active and show the selection bar **/
        $scope.setMainMenuActive = function( mObj ) {
            $scope.uiActive.menu.isUiActive = false;
            mObj.isUiActive = true;
            $scope.uiActive.menu = mObj;
        };

		/** @description Browse .bvzx file and trigger file browse event from glyph-icon **/
		$scope.HandleBrowseClick = function (id) {
			var dataFilePath = "./resources/bizvizchart-themes/default-theme/AllComponentsData.data";
	        var propertyFilePath = "./resources/data/property/allpropertydata.data";
	        var dashboardPorpertyFilePath = "./resources/data/property/dashboard.data";
			ServiceFactory.getJsonFileData(dataFilePath, function(cjson) {
	             $scope.modal.compMetaData = cjson;
	         });
	        ServiceFactory.getJsonFileData(propertyFilePath, function(cjson) {
	             $scope.modal.propertyData = cjson;
	         });
	        ServiceFactory.getJsonFileData(dashboardPorpertyFilePath, function(propjson) {
	             $scope.modal.globalFontProperties = propjson["Global Font And Themes"][4]["options"];
	         });
			$scope.loadComps();
			$timeout(function(){
				$("#" + id).val("").click();
			},0);
		};
		
		/** @description open the preference page to set designer preference **/
		$scope.showUserPreference = function () {
			$scope.modal["userPreference"]["display"] = true;
			$timeout(function () {
				//				if (!Modernizr.inputtypes.color) {
				//					$("input[type='number']").spinner({
				//						spin : function (event, ui) {
				//							var v = $(this).spinner("value");
				//							$scope.modal.userPreference.compSelcOpts["thickness"] = v;
				//						}
				//					});
				//				}
				if (navigator.appVersion.indexOf("Win") != -1 || !Modernizr.inputtypes.color) {
					$scope.initSpectrumColorPicker("input[type='color']");
				}
			}, 10)
		};
		
		/** @description Open SaveAs dialog to save a dashboard in another folder **/
		$scope.openSaveAsDialog = function () {
			ServiceFactory.closeAllNotifications();
			$scope.modal.saveAsDashboardName = "Copy_Of_" + $scope.modal.selectedDashboard.name;
			if ($scope.modal.dashboardTabs.length > 0) {
				if (!($scope.modal.wsObjForSave.wsList) || !($scope.modal.wsObjForSave.wsList.length > 0)){
					$scope.refreshWorkSpaceList();
				}
				$scope.showModelPopup('saveAsModalDialog');
				$scope.setFocusOnInput("#saveAsModalDialog", "#saveAsdashboardName");
			} else {
				ServiceFactory.showNotification("There is no opened dashboard to save", "alert-warning", 3000);
			}
		};

		/** @description TODO Better Help section **/
		$scope.doHelp = function () {
			if($scope.designerHelpUrl !== ""){
				window.open($scope.designerHelpUrl, "_blank");
			}
		};
		
		/** @description Will close the designer tab in browser **/
		$scope.exitDesigner = function () {
			$scope.showModelPopup('exitModalDialog');
//			$window.close();
//			try{
//				/** Top is topmost window, which can be called from inner iframes  **/
//				top.close();
//			}catch(e){
//				console.log(e);
//			}
		};
		
		$scope.updateExitDesigner = function () {
		    $scope.hideModelPopup('exitModalDialog');
			
			window.location.href = window.location.origin+"/home/#/";

		    // Close the current window
		    if (window.opener) {
		        // If there is an opener (meaning it's a new window opened from another window)
		        window.close();
		    } else if (window.top === window.self) {
		        // If it's the topmost window (i.e., not an iframe)
		        $window.close();
		    } else {
		        // If it's an iframe within another window, try closing the top window
		        try {
		            top.close();
		        } catch (e) {
		            console.log(e);
		        }
		    }
		};

		/**
		 * @description It will create new BOOTSTRAPPED-DASHBOARD
		 * @since 2.0.0
		 * */
		$scope.createNewResponsiveDashboard = function (tp) {
			$scope.selectedTemplate = tp;
			$scope.createNewDashboard(false, true);
			$scope.hideModelPopup('templateSelection');
		};
		
		/** @description  **/
		$scope.saveUserPrefs = function () {
			var usrPrefsString = JSON.stringify($scope.modal.userPreference);
			$scope.updateUserPreferences(usrPrefsString);
		};
		
		/** @description Reload the workspace and dashboards - called from UI also **/
		$scope.refreshWorkSpaceList = function () {
			$scope.getWorkspaces(function (_wsObj) {
				if (_wsObj.wsList.length > 0) {
					if ($scope.$apply(function () {}) != undefined) {
						$scope.$apply(function () {
							$scope.modal.wsObj = _wsObj;
							$scope.modal.wsObjForSave = angular.copy(_wsObj);
							$scope.modal.selectedWorkspaceIdForSave = $scope.modal.wsObjForSave.wsList[0].dashboardId;
						});
					} else {
						$scope.modal.wsObj = _wsObj;
						$scope.modal.wsObjForSave = angular.copy(_wsObj);
						$scope.modal.selectedWorkspaceIdForSave = $scope.modal.wsObjForSave.wsList[0].dashboardId;
					}
				}
			});
		};
		
		/** @description It will check for the DASHBOARD is open or not **/
		$scope.isOpenDb = function (dbId) {
			for (var i = 0; i < $scope.modal.dashboardTabs.length; i++) {
				if ($scope.modal.dashboardTabs[i].json.Dashboard.backendId == dbId) {
					return true;
				}
			}
			return false;
		};
		/** @description Create a new workspace **/
		$scope.createNewWorkspace = function (_callbackFunction) {
			var nWsName = $scope.modal.newWorkspaceName.trim();
			if (nWsName) {
				$scope.addNewWorkspace(nWsName, _callbackFunction);
				$scope.modal.newWorkspaceName = "Untitled WorkSpace";
				$scope.hideModelPopup('newWorkspaceModal');
			} else {
				ServiceFactory.showNotification("Workspace name can not be empty", "alert-danger", 3000);
			}
		};

		/** @description  Add a workspace in database **/
		$scope.addNewWorkspace = function (workspaceName, _callbackFunction) {
			var
			REQ_URL = req_url.designer["createWorkspace"],
			REQ_DATA = {
				workspaceName : workspaceName,
				workspaceJSON : ""
			},
			requestSuccessFn = function (data, success) {
				var _ncwId = JSON.parse(data.DesignerResp.params).id;
				if (data.DesignerResp.success) {
					$scope.refreshList();
					ServiceFactory.showNotification("Workspace has been created", "alert-success", 3000);
					if (_callbackFunction) {
						_callbackFunction(workspaceName, _ncwId);
					}
				} else {
					ServiceFactory.showNotification("Failed to create workspace", "alert-danger", 3000);
				}
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn);
		};

		/** @description Will reset the dashboard name when write in textbox **/
		$scope.reSetModal = function () {
			if ($scope.modal.selectedDashboard) {
				$scope.modal.selectedDashboard.name = $scope.modal.selectedDashboard.json.Dashboard.name
			}
		};
		
		/** @description update the tab name when renaing a dashboard **/
		$scope.syncDbNameWithTabName = function (dbId) {
			var dbtList = $scope.modal.dashboardTabs,
			aDashboard = $scope.modal.selectedDashboard,
			aTab = DesignerUtil.prototype.findInArray(dbtList, "id", dbId);
			if (aDashboard.name) {
				aTab.name = aDashboard.name;
				$scope.modal.selectedDashboard.json.Dashboard.name = aDashboard.name;
			} else {
				aTab.name = $scope.newDashboardName;
				$scope.modal.selectedDashboard.json.Dashboard.name = aTab.name;
			}
		};

		/** @description Will update the dashboard variables with new copy of sdk properties **/
		$scope.initHintVariables = function (dbId) {
			$scope.modal.dashVarMap[dbId] = angular.copy($scope.modal.readySdkPropList);
			DesignerFactory.refreshAllObjectList();
		};	

		/** @description Create a dashboard in database **/
		$scope.createNewDashboardInDB = function () {
			var _wsId = $scope.modal.selectedWorkspaceIdForSave,
			_dbName = $scope.modal.selectedDashboard.name,
			_dJson = $scope.modal.selectedDashboard.json;
			if( $scope.modal.wsObj.wsList && $scope.modal.wsObj.wsList.length == 0 ) {
			    $scope.createNewWorkspace(function (_wsName, _wsId) {
                    $scope.modal.wsObj = { wsList : [], dbList : [] };
                    $timeout(function () {
                        $scope.modal.wsObj.wsList.push({
                            "dashboardId" : _wsId,
                            "dashboardName" : _wsName,
                            "isDashboard" : false,
                            "spaceKey" : ServiceFactory.AUTH_INFO.get("spacekey"),
                            "status" : true,
                            "userId" : ServiceFactory.AUTH_INFO.get("userID")
                        });
                        $scope.selectedWorkspace = $scope.modal.wsObj.wsList[0];
                        $scope.modal.userPreference.display = false;
                        $scope.modal.dbCreationInProgress = true;
                        if (_dbName) {
                            if (_wsId) {
                                $scope.createNewDashboardInDatabase(_wsId, _dbName, _dJson);
                				$scope.hideModelPopup('saveDbModalDialog');
                            } else {
                                ServiceFactory.showNotification("Please select a workspace", "alert-danger", 3000);
                            }
                        } else {
                            ServiceFactory.showNotification("Dashboard name can not be empty", "alert-danger", 3000);
                        }
                    },1);
                } );
			}
			else if (_dbName) {
				if (_wsId) {
					$scope.createNewDashboardInDatabase(_wsId, _dbName, _dJson);
					$scope.hideModelPopup('saveDbModalDialog');
				} else {
					ServiceFactory.showNotification("Please select a workspace", "alert-danger", 3000);
				}
			} else {
				ServiceFactory.showNotification("Dashboard name can not be empty", "alert-danger", 3000);
			}
		};

		/** @description SaveAs: Create a copy of dashboard and save to same/other workspace - called from model dialog**/
		$scope.saveCopyOfDashboardAsInDB = function () {
			var nDbName = $scope.modal.saveAsDashboardName.trim();
			if(nDbName){
				var _wsId = $scope.modal.selectedWorkspaceIdForSave;
				if (_wsId != undefined && _wsId != "") {
					var _dbName = $scope.modal.saveAsDashboardName;
					var _dJson = angular.copy($scope.modal.selectedDashboard.json);
					//var _iJson = angular.copy($scope.modal.selectedDashboard.infojson);
					_dJson.Dashboard.name = _dbName;
					_dJson.Dashboard.id = getIdWithTimeStamp("dashboard");
					/** remove publishDocId when duplicating the dashboard **/
					$scope.removeDashboardPublishDetailsFromDownloadedJson(_dJson);
					
					var absolutelayoutobjects = _dJson.Dashboard.AbsoluteLayout.Object;
					_dJson = JSON.stringify(_dJson);
					for (var i = 0; i < absolutelayoutobjects.length; i++) {
						var objId = angular.copy(absolutelayoutobjects[i]["objectID"]);
						var newObjId = getIdWithTimeStamp("BVZ-" + i + "-");
						var re = new RegExp(objId, "g");
						_dJson = _dJson.replace(re, newObjId);
					}
					_dJson = convertStringToJson(_dJson);
					/** Callback method of save dashboard **/
					$scope.createNewDashboardInDatabase(_wsId, _dbName, _dJson, 
						function (dResponse) {
						var dResponseObj = DesignerUtil.prototype.ISJson(dResponse["params"]);
						if (dResponse.success) {
							$scope.refreshList(function (wsObj) {
								for (var i = 0; i < wsObj.dbList.length; i++) {
									if (wsObj.dbList[i]["dashboardId"] == dResponseObj["dashboardId"]) {
	//									$scope.modal.dbInsideWs.push(wsObj.dbList[i]);
										ServiceFactory.showNotification("Dashboard has been saved", "alert-success", 3000);
										break;
									}
								}
							});
						} else {
							ServiceFactory.showNotification("Error", "alert-danger", 3000);
						}
					});//, _iJson
					$scope.hideModelPopup('saveAsModalDialog');
				} else {
					ServiceFactory.showNotification("Please select a workspace", "alert-danger", 3000);
				}
			}else {
				ServiceFactory.showNotification("Dashboard name can not be empty", "alert-danger", 3000);
			}
		};

		/**
		 * @description It will create DASHBOARD in database
		 * @param { string } _wsId - The workspace ID
		 * @param { string } _dbName - The DASHBOARD name
		 * @param { string } _dJson - The DASHBOARD JSON
		 * @param { function } _callback - The callback function
		 * */
		$scope.createNewDashboardInDatabase = function (_wsId, _dbName, _dJson, _callback, _iJson) {
			/**DAS-1082 */
			var docId = _wsId;
			var spacekey = encryptText(window.sessionStorage.getItem('bvz_spacekey'));
			var userid = encryptText(window.sessionStorage.getItem('bvz_userid'));

			var reqHeader = {
				authtoken: window.sessionStorage.getItem('bvz_token'),
				spacekey: spacekey,
				docid: docId,
				userID: userid
			};
			var
			REQ_URL = req_url.designer["createDashboard"],
			DES_PARAMS = { workspaceId : _wsId.toString(), dashboardName : _dbName, dashboardJSON : "{}", infoJSON: "{}" },
			REQ_DATA = {
				dashboardParameters : JSON.stringify(DES_PARAMS)
			},
			requestSuccessFn = function (data, success) {
				if (data.DesignerResp.success) {
					/** _dbId is the id of this record in workspace table **/
					var _createdDashboard = JSON.parse(data.DesignerResp.params),
					_dbId = _createdDashboard["dashboardId"];
					$scope.saveDashboardInDB(_wsId, _dbId, _dbName, _dJson, _callback, undefined, _iJson);
				} else {
					ServiceFactory.showNotification("Failed to create dashboard", "alert-danger", 3000);
					ServiceFactory.hideLoader();
				}
			},
			requestErrorFn = function (data, success) {
				ServiceFactory.hideLoader();
				ServiceFactory.showNotification("Failed to create dashboard", "alert-danger", 3000);
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequestDocId(REQ_URL, REQ_DATA, reqHeader, requestSuccessFn, requestErrorFn);
			//BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn, requestErrorFn);
		};

		/**
		 * It saves the dashboard data to the database
		 * @param  {String}   wsId The workspace Id
		 * @param  {String}   dbId  The dashboard Id
		 * @param  {String}   dbName The dashboard name
		 * @param  {Object}   dJsonToSave The dashboard Object to be saved
		 * @param  {Function} cb The callback function
		 * @param  {Boolean}   keepMenuView Flag for menu
		 */
		$scope.saveDashboardInDB = function (wsId, dbId, dbName, dJsonToSave, cb, keepMenuView, infojson, ispublish) {
		    var dbJson, dbinfoJson, desParams, reqData, reqUrl = req_url.designer["saveDashboard"];
			var docId = wsId + "_" + dbId;
			var spacekey = encryptText(window.sessionStorage.getItem('bvz_spacekey'));
			var userid = encryptText(window.sessionStorage.getItem('bvz_userid'));

			var reqHeader = {
				authtoken: window.sessionStorage.getItem('bvz_token'),
				spacekey: spacekey,
				docid: docId,
				userID: userid
			};
		    dbId = dbId.toString();
		    wsId = wsId.toString();
		    dJsonToSave["changeStatus"] = 0;
		    dJsonToSave["Dashboard"]["workspaceId"] = wsId;
		    dJsonToSave["Dashboard"]["backendId"] = dbId;
		    dJsonToSave["Dashboard"]["name"] = dbName;
		    var reqUrl = "/designer/saveDashboardWithComponents/";
			/** Update the lastUpdate property of dashboard with UTC timestamp **/
			try {
		    	if((infojson == null || infojson == undefined) && dJsonToSave["Dashboard"]["versionDetails"] != undefined){
		    		dJsonToSave["Dashboard"]["versionDetails"]["lastUpdate"] = getTimeStamp();
		    		var infojson = dJsonToSave["Dashboard"]["versionDetails"];
		    		//delete dJsonToSave["Dashboard"]["versionDetails"];
		    	} else if((infojson != null || infojson != undefined) && dJsonToSave["Dashboard"]["versionDetails"] == undefined) {
		    		infojson["lastUpdate"] = getTimeStamp();
		    	} else {
		    		var versionDetails = {};
		    		versionDetails["author"] = "BizViz Technologies Pvt. Ltd.";
		    		versionDetails["edittedBy"] = "";
		    		versionDetails["lastUpdate"] = "";
		    		versionDetails["dashboardVersion"] = "7.6.0";
		    		versionDetails["publishDocId"] = "";
		    		versionDetails["publishedVersions"] = [];
		    		versionDetails["lastPublishedVersion"] = "";
		    		versionDetails["createdDesignerVersion"] = "";
		    		versionDetails["lastUpdatedDesignerVersion"] = "7.5.1";
		    		versionDetails["lastUpdatedDesignerDate"] = "16/09/2022";
		    		dJsonToSave["Dashboard"]["versionDetails"] = versionDetails;
		    	}
		    } catch(e){
		    	console.log(e);
		    }
		    /*DAS-201 @description create @dashboardComponentsJson data to pass into savedashboardComponets Service*/
		    var dashboardComponentsdata = dJsonToSave.Dashboard.AbsoluteLayout.Object;
		    var spaceKey = window.sessionStorage.getItem('bvz_spacekey');
			var dashboardComponentsdatajsonData = [];
			/*create components objects data*/
			for (var i = 0; i < dashboardComponentsdata.length; i++) {
				dashboardComponentsdata[i].zindex = i;
			    var jsondata = {
			    		"objectId" : dashboardComponentsdata[i].objectID,
					    "unShowHidden": dashboardComponentsdata[i].unShowHidden,
					    "spaceKey": spaceKey,
					    "status": 1,
					    "dashboardId": dbId,
					    "data": angular.toJson(dashboardComponentsdata[i])
			    };			   
			    dashboardComponentsdatajsonData.push(jsondata);
			}
		    /* DAS-401 removing complete chartJson from Dashboard.AbsoluteLayout.Object and keep only objectID(s) */
		    /*
			var componentsData = dJsonToSave.Dashboard.AbsoluteLayout.Object;
		    var componentsId = [];
		    for (var i = 0; i < componentsData.length; i++) {
		        var objectId = {
		            objectID: componentsData[i].objectID,
		            unShowHidden: componentsData[i].unShowHidden,
		        	};
		        componentsId.push(objectId);
		    }
		    dJsonToSave.Dashboard.AbsoluteLayout.Object = componentsId;
		    */
		    dbJson = angular.toJson(dJsonToSave);
		    dbinfoJson = angular.toJson(infojson);
		    var dbComponentJson = angular.toJson(dashboardComponentsdatajsonData);
		    /*desParams = {
		        workspaceId: wsId,
		        dashboardId: dbId,
		        dashboardName: dbName,
		        dashboardJSON: dbJson,
		        infoJSON: dbinfoJson
		    };*/
		    if(IsBoolean(ispublish)){
		    	desParams = {
				        workspaceId: wsId,
				        dashboardId: dbId,
				        dashboardName: dbName,
				        infoJSON: dbinfoJson,
				        dashboardComponentJSON: dbComponentJson
				};
		    } else {
		    	desParams = {
				        workspaceId: wsId,
				        dashboardId: dbId,
				        dashboardName: dbName,
				        dashboardJSON: dbJson,
				        dashboardComponentJSON: dbComponentJson
				};
		    }
		    desParams = angular.toJson(desParams);
		    reqData = {
		        dashboardParameters: desParams
		    };
		    /**
		     * This is the success callback function for the server response
		     * @param  {Object} data The response Object
		     */
		    var requestSuccessFn = function(data, status) {
		        if (data.DesignerResp.success) {
		            if (cb) {
		                if (typeof cb === "function") {
		                    cb(data.DesignerResp);
		                } else {
		                    $scope.closeDashboardTabAndDiv($scope.modal.dashboardToClose.id, $scope.modal.dashboardToClose.index);
		                }
		            }
			        ServiceFactory.hideLoader();
		            ServiceFactory.showNotification("Dashboard has been saved", "alert-success", 3000);
		            $scope.refreshList();
		            if (!keepMenuView) {
		                $scope.hideMenu();
		            }
		        }
		        else {
			        ServiceFactory.hideLoader();
		            ServiceFactory.showNotification("Failed to save dashboard", "alert-danger", 3000);
		        }
		    },
			requestErrorFn = function (data, success) {
		        ServiceFactory.hideLoader();
				ServiceFactory.showNotification("Failed to save dashboard", "alert-danger", 3000);
			};

		    ServiceFactory.showLoader({timeout: '180000'});
			BIZVIZ.SDK.secureRequestDocId(reqUrl, reqData, reqHeader, requestSuccessFn, requestErrorFn);
		};
		
		/*DAS-418 @description save template dashbaordJsonData to database with additional @type parameter */
		$scope.saveTemplateInDB = function(wsId, dbId, dbName, dJsonToSave, cb, keepMenuView, infojson, ispublish) {
		    var dbJson, dbinfoJson, desParams, reqData, reqUrl = req_url.designer["saveDashboard"];
		    dbId = dbId.toString();
		    wsId = wsId.toString();
		    dJsonToSave["changeStatus"] = 0;
		    dJsonToSave["Dashboard"]["workspaceId"] = wsId;
		    dJsonToSave["Dashboard"]["backendId"] = dbId;
		    dJsonToSave["Dashboard"]["name"] = dbName;
		    var reqUrl = "/designer/saveTemplate";
		    /** Update the lastUpdate property of dashboard with UTC timestamp **/
		    try {
		        if ((infojson == null || infojson == undefined) && dJsonToSave["Dashboard"]["versionDetails"] != undefined) {
		            dJsonToSave["Dashboard"]["versionDetails"]["lastUpdate"] = getTimeStamp();
		            var infojson = dJsonToSave["Dashboard"]["versionDetails"];
		            //delete dJsonToSave["Dashboard"]["versionDetails"];
		        } else if ((infojson != null || infojson != undefined) && dJsonToSave["Dashboard"]["versionDetails"] == undefined) {
		            infojson["lastUpdate"] = getTimeStamp();
		        } else {
		            var versionDetails = {};
		            versionDetails["author"] = "BizViz Technologies Pvt. Ltd.";
		            versionDetails["edittedBy"] = "";
		            versionDetails["lastUpdate"] = "";
		            versionDetails["dashboardVersion"] = "7.6.0";
		            versionDetails["publishDocId"] = "";
		            versionDetails["publishedVersions"] = [];
		            versionDetails["lastPublishedVersion"] = "";
		            versionDetails["createdDesignerVersion"] = "";
		            versionDetails["lastUpdatedDesignerVersion"] = "7.5.1";
		            versionDetails["lastUpdatedDesignerDate"] = "16/09/2022";
		            dJsonToSave["Dashboard"]["versionDetails"] = versionDetails;
		        }
		    } catch (e) {
		        console.log(e);
		    }

		    dbJson = angular.toJson(dJsonToSave);
		    dbinfoJson = angular.toJson(infojson);
		    /*desParams = {
		        workspaceId: wsId,
		        dashboardId: dbId,
		        dashboardName: dbName,
		        dashboardJSON: dbJson,
		        infoJSON: dbinfoJson
		    };*/
		    if (IsBoolean(ispublish)) {
		        desParams = {
		            workspaceId: wsId,
		            //dashboardId: dbId,
		            dashboardName: dbName,
		            infoJSON: dbinfoJson
		        };
		    } else {
		        desParams = {
		            workspaceId: wsId,
		            //dashboardId: dbId,
		            dashboardName: dbName,
		            dashboardJSON: dbJson
		        };
		    }
		    desParams = angular.toJson(desParams);
		    reqData = {
		        dashboardParameters: desParams,
		        type: "6"
		    };
		    /**
		     * This is the success callback function for the server response
		     * @param  {Object} data The response Object
		     */
		    var requestSuccessFn = function(data) {
		            if (data.DesignerResp.success) {
		                if (cb) {
		                    if (typeof cb === "function") {
		                        cb(data.DesignerResp);
		                    } else {
		                        $scope.closeDashboardTabAndDiv($scope.modal.dashboardToClose.id, $scope.modal.dashboardToClose.index);
		                    }
		                }
		                ServiceFactory.hideLoader();
		                ServiceFactory.showNotification("Dashboard template has been saved", "alert-success", 3000);
		            } else {
		                ServiceFactory.hideLoader();
		                ServiceFactory.showNotification("Failed to save dashboard template", "alert-danger", 3000);
		            }
		        },
		        requestErrorFn = function(data, success) {
		            ServiceFactory.hideLoader();
		            ServiceFactory.showNotification("Failed to save dashboard template", "alert-danger", 3000);
		        };

		    ServiceFactory.showLoader({
		        timeout: '180000'
		    });
		    BIZVIZ.SDK.secureRequest(reqUrl, reqData, requestSuccessFn, requestErrorFn);
		};
		
		/** @description  **/
		$scope.addNewDashboardCallBack = function (dashboardId, dashboardName, dashboardJson, infojson, responsive) {
			$scope.addInDashboardTab(dashboardId, dashboardName, dashboardJson, infojson, responsive);
			$scope.setSelectedDashboard(dashboardId);
			$timeout(function () {
				if (!$scope.isSelectedDashboardResponsive()) {
					$scope.applyUserDefaultSettings();
//					$scope.initResizeDashboard(dashboardId);
//					$scope.initDragSelection(dashboardId);
				} else {
					$scope.handleContainersIds();
				}
				$scope.dashboardTabClick(dashboardId);
			}, 1);
			if ($scope.isMainMenuVisible) {
				/** Hide the main menu - written in designerController **/
				$scope.hideMenu();
				ServiceFactory.hideLoader();
			}
		};

		/** @description  **/
		$scope.addInDashboardTab = function (dId, dName, dJson, dinfojson) {
			var dbTab = {
				id : dId,
				name : dName,
				json : dJson,
				infojson : dinfojson,
				responsive : $scope.isSelectedDashboardResponsive()
			};
			$scope.modal.dashboardTabs.push(dbTab);
		};
		/** @description Will set a dashboard as selected **/
		$scope.setSelectedDashboard = function (dId) {
			for (var i = 0; i < $scope.modal.dashboards.length; i++) {
				if ($scope.modal.dashboards[i].id == dId) {
					$scope.modal.selectedDashboard = $scope.modal.dashboards[i];
					$scope.modal.layoutType = $scope.modal.selectedDashboard.json.Dashboard.layoutType;
					break;
				}
			}
		};
		/** @description Checks whether selected dashboard is responsive or not, returns true if found responsive **/
		$scope.isSelectedDashboardResponsive = function () {
			if ($scope.modal.selectedDashboard) {
				return $scope.modal.selectedDashboard.json.Dashboard.responsive;
			}else{
				return false;
			}
		};		
		/** @description Will apply the user preferred properties to dashboard **/
		$scope.applyUserDefaultSettings = function () {
			if($scope.modal.userPreference){
				$scope.setDashboardPropertyInJson($scope.modal.userPreference.defaultSettings);
				$scope.setDashboardsDefaultCSS($scope.modal.userPreference.defaultSettings);
//				$scope.showHideGridLines( $scope.modal.userPreference.showGridLines );
			}
		};
		/** @description Will initialize the resize of dashboard components **/
		$scope.initResizeDashboard = function (dashboardId) {
//			$("#" + dashboardId).resizable();
//			$("#" + dashboardId).on("resizestop", function (event, ui) {
//				$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.width = $(this).width();
//				$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.height = $(this).height();
//				 /** Update the component property, it will call redraw internally **/
//				$scope.initPropertyPalette();
//			});
		};
		/** @description Will initialize the selection of dashboard components **/
		$scope.initDragSelection = function (dId) {
//			$("#" + dId).selectable({
//				filter : ".bizvizComponent",
//				start : function (e, ui) {
//					e.preventDefault();
//					$scope.deselectAllComponent();
//					$("#designerCxtMenuContainer .dropdown-menu").hide();
//					$scope.dragSelectList = [];
//				},
//				selecting : function (e, ui) {
//					var cId = ui.selecting.id.split("dcc_")[1];
//					$scope.dragSelectList.push(cId);
//				},
//				unselecting : function (e, ui) {
//					var cId = ui.unselecting.id.split("dcc_")[1],
//					index = $scope.dragSelectList.indexOf(cId);
//					$scope.dragSelectList.splice(index, 1);
//				},
//				stop : function (e, ui) {
//					for (var i = 0; i < $scope.dragSelectList.length; i++) {
//						$scope.selectComponent($scope.dragSelectList[i]);
//					}
//				}
//			});
		};
		/** @description Set parentID and ID for responsive dashboard **/
		$scope.handleContainersIds = function () {
			var containers = $scope.modal.selectedDashboard.json.Dashboard["Containers"]["Container"];
			for (var i = 0; i < containers.length; i++) {
				if (containers[i]["parent"]) {
					containers[i]["parent"] = $scope.modal.getSelectedDashboardId() + "-" + containers[i]["parent"];
				}
				containers[i]["id"] = $scope.modal.getSelectedDashboardId() + "-" + containers[i]["id"];
			}
		};

		/** @description Will be triggered when tab is clicked **/
		$scope.dashboardTabClick = function (dId) {
			/**Added to support multiple selected components drag */
			if(IsBoolean($scope.multiSelected) && IsBoolean($scope.modal.userPreference.defaultSettings.enableMultipleDrag)){
				$scope.deselectAllComponent();
			}
		    var $dbTabs = $("#dashboardTabs"), 
		        $dbTabPane = $(".dashboardContents").find(".tab-pane"),
		        $clickedTab = $("#tab" + dId),
		        $clickedTabPane = $("#" + dId).closest(".tab-pane");

		    $dbTabs.find("li").removeClass("active");
		    //fix #22380
		    $dbTabPane.removeClass("active");
		    $clickedTab.addClass("active");
		    $clickedTabPane.addClass("active");
		    
		    $scope.reloadDefault("");
		    if (!$scope.modal.dashbaordLoadingInProgress) {
		        $scope.setSelectedDashboard(dId);
		        $scope.resetFunctionWindow(undefined, false, "Dashboard");
		    }
		    $scope.setSelectedLayout();
		    if (!$scope.isSelectedDashboardResponsive()) {
		        $scope.setDashboardCSS($scope.modal.userPreference);
		    }
		    $scope.setPortalPreferenceTheme();
		    /** ResetGroupManagement is written in designerController **/
		    $scope.resetGroupManagement();
		    $scope.setSelectedConnection();
		};
		/**@deprecated*/
		$scope.dashboardTabClick_old = function (dId) {
			$("#dashboardTabs").find("li").removeClass("active");
			$("#dashboardTabs").find("li#tab" + dId).addClass("active");
			$(".tab-pane").removeClass("active");
			$("#" + dId).closest( ".tab-pane" ).addClass("active");
			/** reloadDefault will hide all right side menu boxes, if any of the box is opened **/
			$scope.reloadDefault("");
			if (!$scope.modal.dashbaordLoadingInProgress) {
				$scope.setSelectedDashboard(dId);
				$scope.resetFunctionWindow( undefined, false, "Dashboard" );
			}
			if (!$scope.isSelectedDashboardResponsive()) {
				$scope.setDashboardCSS($scope.modal.userPreference);
			}
			$scope.setPortalPreferenceTheme();
			/** ResetGroupManagement is written in designerController **/
			$scope.resetGroupManagement();
			$scope.setSelectedConnection();
		};
		/** @description  **/
		$scope.setDashboardCSS = function (_preference) {
			if (_preference != undefined) {
				var _showGridLines = _preference["showGridLines"],
				_showDashboardBorder = _preference["defaultSettings"]["showDashboardBorder"],
				_absLayout = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType],
				_backendId = $scope.modal.selectedDashboard.json.Dashboard["backendId"],
				_isNewDb = false;
				if (_backendId != "" || _backendId != undefined) {
					_isNewDb = true;
				}
				if (_isNewDb) {
					var borderThickness = (_showDashboardBorder) ? _absLayout.borderThickness * 2 : 0;
					$("#mainDesignerViewDiv #" + $scope.modal.selectedDashboard.id).css({
						"height" : (_absLayout.height * 1) + borderThickness,
						"width" : (_absLayout.width * 1) + borderThickness,
						"border" : _showDashboardBorder ? _absLayout.borderThickness + "px solid " + _absLayout.borderColor : "",
					});
				} else {
					var borderThickness = (_absLayout.showBorder == undefined || IsBoolean(_absLayout.showBorder) == true) ? _absLayout.borderThickness*2 : 0;
					$("#mainDesignerViewDiv #" + $scope.modal.selectedDashboard.id).css({
						"height" : (_absLayout.height * 1) + borderThickness,
						"width" : (_absLayout.width * 1) + borderThickness,
						"border" : (_absLayout.showBorder == undefined || IsBoolean(_absLayout.showBorder) == true) ? _absLayout.borderThickness + "px solid " + _absLayout.borderColor : "",
					});
				}
				/**Added OR(||) condition on below statements to provide support to old dashboard of mobile and tablet view  */
				var deg = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].gradientRotation || "0";
				var grads = ["rgba(255,255,255,1)", "rgba(255,255,255,1)"];
				var gradientString = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].gradients || "#FFFFFF";
				//			if( _isNewDb ) {
				//				gradientString = _preference[ "defaultSettings" ][ "dashboardBackgroundColor" ];
				//			}
				var bgAlpha = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].bgAlpha || "1";
				if (gradientString != "") {
					var gradientArray = gradientString.split(",");
					if (gradientArray.length == 1) {
						grads[0] = hex2rgb(convertColorToHex(gradientArray[0]), bgAlpha);
						grads[1] = hex2rgb(convertColorToHex(gradientArray[0]), bgAlpha);
					} else {
						for (var i = 0; i < gradientArray.length; i++) {
							grads[i] = hex2rgb(convertColorToHex(gradientArray[i]), bgAlpha);
						}
					}
				}

				var gradsStr = "";
				for (var j = 0; j < grads.length; j++) {
					var suffix = (j < grads.length - 1) ? " ," : "";
					gradsStr += grads[j] + suffix;
				}

				var gridLines = _showGridLines ? "url(./resources/images/svg/bgGrid.png), " : "";
				$("#mainDesignerViewDiv #" + $scope.modal.selectedDashboard.id).css({
					"background" : gridLines + "linear-gradient(" + deg + "deg," + gradsStr + ")"
				});
				/* Standard syntax */
				$("#mainDesignerViewDiv #" + $scope.modal.selectedDashboard.id).css({
					"background" : gridLines + "-webkit-linear-gradient(" + deg + "deg, " + gradsStr + ")"
				});
				/* For Safari 5.1 to 6.0 */
				$("#mainDesignerViewDiv #" + $scope.modal.selectedDashboard.id).css({
					"background" : gridLines + "-o-linear-gradient(" + deg + "deg, " + gradsStr + ")"
				});
				/* For Opera 11.1 to 12.0 */
				$("#mainDesignerViewDiv #" + $scope.modal.selectedDashboard.id).css({
					"background" : gridLines + "-moz-linear-gradient(" + deg + "deg, " + gradsStr + ")"
				});
				/* For Firefox 3.6 to 15 */
			}
		};

		/** @description  **/
		$scope.setPortalPreferenceTheme = function () {
			if ($scope.portalPreference) {
				//methods written in thememanager.js
				applyDashboardMenuColorScheme($scope.portalPreference);
				applyFloatingWindowColorScheme($scope.portalPreference);
				applyDashboardColorScheme($scope.portalPreference);
			}
		};

		/** @description Will set the design mode background in grid or plain **/
		$scope.showHideGridLines = function (_showGridLines) {
			var deg = "",
			grads = "",
			gradientString = "",
			bgAlpha = "";
			if ($scope.modal.selectedDashboard) {
				deg = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.gradientRotation;
				grads = ["rgba(255,255,255,1)", "rgba(255,255,255,1)"];
				gradientString = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.gradients;
				bgAlpha = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.bgAlpha;
			}
			if (gradientString != "") {
				var gradientArray = gradientString.split(",");
				if (gradientArray.length == 1) {
					grads[0] = hex2rgb(convertColorToHex(gradientArray[0]), bgAlpha);
					grads[1] = hex2rgb(convertColorToHex(gradientArray[0]), bgAlpha);
				} else {
					for (var i = 0; i < gradientArray.length; i++) {
						grads[i] = hex2rgb(convertColorToHex(gradientArray[i]), bgAlpha);
					}
				}
			}
			var gridLines = _showGridLines ? "url(./resources/images/bgGrid.png), " : "";
			$(".draggablesParentDiv").css({
				"background" : gridLines + "linear-gradient(" + deg + "deg, " + grads[0] + ", " + grads[1] + ")"
			});
			/* Standard syntax */
			$(".draggablesParentDiv").css({
				"background" : gridLines + "-webkit-linear-gradient(" + deg + "deg, " + grads[0] + ", " + grads[1] + ")"
			});
			/* For Safari 5.1 to 6.0 */
			$(".draggablesParentDiv").css({
				"background" : gridLines + "-o-linear-gradient(" + deg + "deg, " + grads[0] + ", " + grads[1] + ")"
			});
			/* For Opera 11.1 to 12.0 */
			$(".draggablesParentDiv").css({
				"background" : gridLines + "-moz-linear-gradient(" + deg + "deg, " + grads[0] + ", " + grads[1] + ")"
			});
			/* For Firefox 3.6 to 15 */
		};

		/** @description  **/
		$scope.setDashboardsDefaultCSS = function (defaultSettings) {
			var borderThickness = defaultSettings["showDashboardBorder"] ? defaultSettings["dashboardBorderThickness"]*2 : 0;
			$("#mainDesignerViewDiv #" + $scope.modal.selectedDashboard.id).css({
				"height" : defaultSettings["dashboardHeight"]*1 + borderThickness,
				"width" : defaultSettings["dashboardWidth"]*1 + borderThickness,
				"border" : defaultSettings["showDashboardBorder"] ? defaultSettings["dashboardBorderThickness"] + "px solid " + defaultSettings["dashboardBorderColor"] : "none",
				"background-color" : defaultSettings["dashboardBackgroundColor"]
			});
//			$( "#mainDesignerViewDiv" ).perfectScrollbar();
		};
		/** @description Update the dashboard JSON with preferred settings **/
		$scope.setDashboardPropertyInJson = function (defaultSettings) {
			if (defaultSettings["fixedDashboardDimensions"]) {
				$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.width = defaultSettings["dashboardWidth"];
				$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.height = defaultSettings["dashboardHeight"];
			} else {
				$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.width = $(".rw-container").get(0).clientWidth - 10;
				$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.height = $(".rw-container").get(0).clientHeight - 10;
			}
			$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.borderColor = defaultSettings["dashboardBorderColor"];
			$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.borderThickness = defaultSettings["dashboardBorderThickness"];
			$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.gradients = defaultSettings["dashboardBackgroundColor"];
		};
		
		/** @description When dashboards has been switched by tabs - reset the selected connection for last selected dashboard **/
		$scope.setSelectedConnection = function () {
			var selectedConn;
			try {
				selectedConn = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection;
				if (selectedConn) {
					$scope.setConnectionSelected($scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection);
					$timeout(function () {
						angular.element("#UI_" + selectedConn.id).trigger("click");						
					/** add click event because default selected connection changes was not reflecting when dashboard reopened **/
					},1);
				}
			} catch (error) {
				console.error(error);
			}
		};
		/** @description Will check for unsaved dashboard - do the action according to button clicked **/
		$scope.closeModelDashboardResponse = function (dashboardExistInDb) {
			var _wsId = $scope.modal.dashboardToClose.json.Dashboard.workspaceId == "" ? $scope.selectedWorkspace["dashboardId"] : $scope.modal.dashboardToClose.json.Dashboard.workspaceId,
			_dbackendId = $scope.modal.dashboardToClose.json.Dashboard.backendId,
			_dbName = $scope.modal.dashboardToClose.name,
			_dJson = $scope.modal.dashboardToClose.json,
			_dinfojson = $scope.modal.dashboardToClose.infojson;
			if (_dbName.length > 0 || dashboardExistInDb == "close") {
				if (_wsId != undefined || dashboardExistInDb == "close") {
					switch (dashboardExistInDb) {
					case false:
						/** crate new dashboard and save **/
						$scope.createNewDashboardInDatabase(_wsId, _dbName, _dJson, "CreateSaveAndClose");
						break;
					case true:
						/** save existing dashboard **/
						$scope.saveDashboardInDB(_wsId, _dbackendId, _dbName, _dJson, "SaveAndClose", undefined, _dinfojson);
						break;
					default:
						/** simply close the dashboard **/
						$scope.closeDashboardTabAndDiv($scope.modal.dashboardToClose.id, $scope.modal.dashboardToClose.index);
						break;
					}
					$scope.saveDashboardBeforeClose = false;
					$scope.hideModelPopup('closeAndSaveDbModalDialog');
					 /** it will hide all right side menu boxes, if any of the box is opened **/
					$scope.reloadDefault("");
				} else {
					console.info("Please select a workspace");
				}
			} else {
				console.info("Dashboard name can not be empty");
			}
		};

		/** @description It will return the index of workspace from the workspace list, if id matches */
		$scope.getIndexOfWsFromWsListByWsId = function (wsId) {
			var wsList = $scope.modal.wsObj.wsList,
			index = -1;
			for (var i = 0; i < wsList.length; i++) {
				if (wsId == wsList[i]["dashboardId"]) {
					index = i;
					break;
				}
			}
			return index;
		};

		/**@description Will be called from manage page dashboard list **/
		$scope.triggerCloaseDashboardFromManagePage = function (backendId) {
			var openDbList,
			backendIdFromTabsList,
			uiId;
			try {
				openDbList = $scope.modal.dashboardTabs;
				for (var i = 0; i < openDbList.length; i++) {
					backendIdFromTabsList = openDbList[i]["json"]["Dashboard"]["backendId"];
					if (backendId == backendIdFromTabsList) {
						uiId = openDbList[i]["id"];
						$scope.closeDashboard(uiId, i);
						return true;
					}
				}
				return false;
			} catch (error) {
				console.error(error);
				return false;
			}
		};

		/** @description Close the dashboard, ask for save before close **/
		$scope.closeDashboard = function (dId, index) {
			ServiceFactory.closeAllNotifications();
			var changedStatus = $scope.modal.dashboardTabs[index]["json"]["changeStatus"],
			relWsId = 0;
			if (changedStatus != undefined && changedStatus > 0) {
				$scope.saveDashboardBeforeClose = false;
				$scope.modal.dashboardToClose = {
					"id" : dId,
					"name" : $scope.modal.dashboardTabs[index].name,
					"json" : $scope.modal.dashboardTabs[index].json,
					"infojson":$scope.modal.dashboardTabs[index].infojson,
					"dashboardExistInDatabase" : $scope.modal.dashboardTabs[index].json.Dashboard.backendId == "" ? false : true,
					"index" : index
				};
				relWsId = $scope.modal.dashboardTabs[index].json.Dashboard.workspaceId;
				if (relWsId) {
					$scope.selectedWorkspace = $scope.modal.wsObj.wsList[$scope.getIndexOfWsFromWsListByWsId(relWsId)] || {};
				}
				$scope.showModelPopup('closeAndSaveDbModalDialog');
				$("#closeAndSaveDbModalDialog").css("zIndex", "9999999999");
				$scope.setFocusOnInput("#closeAndSaveDbModalDialog", "#saveAsdashboardName");
			} else {
				$scope.closeDashboardTabAndDiv(dId, index);
			}
		};

		/** @description Remove the tab from design area **/
		$scope.closeDashboardTabAndDiv = function (dId, index) {
			var dbObject = $scope.getDashboardByTimeStampId(dId),
			db = DesignerUtil.prototype.findInArray($scope.modal.wsObj.dbList, "dashboardId", dbObject.backendId);
			$("#dashboardTabs").find("li #tab_" + dId).remove();
			$scope.removeFromDashboardTab(index);
			$scope.removeFromDashboard(dId);
			$("#" + dId).remove();
			if (db != undefined){
				db["isOpen"] = false;
			}

			/** Clean the residuals of closed dashboard **/
			$scope.modal.componentListInObjectBrowser = [];
			$scope.modal.listOfSelectedComponents = [];
			$scope.modal.dashVarMap[dId] = [];
			$scope.modal.historyProperties[dId] = [];
			$scope.modal.selectedVariableDefaultValue = [];
			$scope.modal.calcFieldConfig = {};
			
			if ($scope.modal.selectedDashboard.id == dId) {
				/** set new tab as selected **/
				if ($scope.modal.dashboards.length > 0) {
					var tabIndex = index == $scope.modal.dashboardTabs.length ? index - 1 : index;
					/** to update selected dashboard  layout type**/
					$scope.modal.layoutType = $scope.modal.dashboardTabs[tabIndex].json.Dashboard.layoutType;
					$scope.dashboardTabClick($scope.modal.dashboardTabs[tabIndex].id);
				} else {
					$scope.modal.layoutType = "";
					$scope.modal.selectedDashboard = "";
				}
			} else {
				/** to upadte selected dashboard  layout type**/
				$scope.modal.layoutType = $scope.modal.selectedDashboard.json.Dashboard.layoutType;
				$scope.dashboardTabClick($scope.modal.selectedDashboard.id);
			}
			$scope.reloadDefault("")
		};
		/** @description Remove the item from tab list **/
		$scope.removeFromDashboardTab = function (index) {
			$scope.modal.dashboardTabs.splice(index, 1);
		};
		/** @description Remove dashboard from the dashboard array **/
		$scope.removeFromDashboard = function (dId) {
			for (var i = 0; i < $scope.modal.dashboards.length; i++) {
				if ($scope.modal.dashboards[i].id == dId) {
					$scope.modal.dashboards.splice(i, 1);
					break;
				}
			}
			return {};
		};

		/** @description Apply the user preferences as soon as user changes **/
		$scope.onPreferenceChange = function () {
			$scope.showHideGridLines($scope.modal.userPreference.showGridLines);
			$scope.applySelectedLanguage();
		};
		$scope.onSnapToGridPreferenceChange = function () {
			$scope.setSnapToGridSize();
		};
		/** @description Will set the language to translate the designer headings **/
		$scope.applySelectedLanguage = function () {
			var selectedLanguage = $scope.selectedLanguage,
			locale = selectedLanguage.locale;
			$translate.use(locale);
		};
		
		/** @description Search field in manage page **/
		$scope.toggleSearchWs = function (e) {
			ServiceFactory.closeAllNotifications();
			e.stopPropagation();
			if ($scope.modal.sWsVisible) {
				$scope.modal.sWsVisible = false;
				$scope.modal.wsSearchKey = "";
			} else {
				$scope.modal.sWsVisible = true;
				$timeout(function () {
					$("input[ name='worspace_search' ]").focus();
				}, 10);
			}
		};

		/** @description Will be called from design mode/ keyboard shortcut **/
		$scope.saveDashboard = function () {
			ServiceFactory.closeAllNotifications();
			if ($scope.modal.selectedDashboard != "") {
				if (!$scope.controlDisable) {
					//$scope.saveDashboardPrompt($scope.modal.selectedDashboard.json, $scope.modal.selectedDashboard.infojson);
					$scope.saveDashboardPrompt($scope.modal.selectedDashboard.json);
					$scope.controlDisable = true;
					$timeout(function () {
						$scope.controlDisable = false;
					}, 3000);
				}
			} else {
				ServiceFactory.showNotification("Invalid dashboard configuration", "alert-success", 3000);
			}
		};
		
		/*DAS-418 @description saveDashbaord as template*/
		$scope.saveDashboardTemplate = function(dashboardParam) {
			$scope.saveDashboardTemplateFlg = false;
			$scope.saveDashboardTemplateName = "";
			var
			REQ_URL = req_url.designer["openDashboard"],
			DES_PARAMS = {
				dashboardId : dashboardParam.dashboardId.toString()
			},
			REQ_DATA = {
				dashboardParameters : JSON.stringify(DES_PARAMS)
			},
			requestSuccessFn = function (data, success) {
				if (data && data.DesignerResp && data.DesignerResp.success && data.DesignerResp.params) {
						var json = JSON.parse(data.DesignerResp.params);
						$scope.saveDashboardTemplateFlg = true;
						$scope.saveDashboardTemplateName = dashboardParam.dashboardName;
						$scope.saveDashboardPrompt(json.dashboardJson);
						/*
						$scope.removeDashboardPublishDetailsFromDownloadedJson(bvzxFile.dashboardJson);
						$scope.exportToDefaultLocation(dashboardProperties.dashboardName, bvzxFile);
						*/
					} else {
					ServiceFactory.showNotification("Invalid dashboard configuration", "alert-danger", 3000);
				}
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn);
		};

		/** @description Open model for save dashboard **/
		$scope.saveDashboardPrompt = function (_dashboardJsonToSave) {//_dashboardJsonToSave, dashboardinfojson
			var _activeDashboard = _dashboardJsonToSave["Dashboard"],
			_dbBackendId = _activeDashboard["backendId"],
			_wsId = _activeDashboard["workspaceId"],
			_dbName = _activeDashboard["name"],
			_isDashboardExists = _dbBackendId == "" ? false : true;
			if (!_isDashboardExists) {
				if ($scope.modal.wsObj.wsList != undefined && $scope.modal.wsObj.wsList.length > 0) {
					$scope.modal.wsObjForSave = angular.copy($scope.modal.wsObj);
					$scope.modal.selectedWorkspaceIdForSave = $scope.modal.wsObjForSave.wsList[0].dashboardId;
					$timeout(function () {
						$scope.modal.userPreference.display = false;
						$scope.modal.dbCreationInProgress = true;
					},1);
				} else {
					ServiceFactory.showNotification("Workspace not found", "alert-info", 3000);
				}
				$scope.showModelPopup('saveDbModalDialog');
				$scope.setFocusOnInput("#saveDbModalDialog", "#dashboardName");
			} else {
				//$scope.saveDashboardInDB(_wsId, _dbBackendId, _dbName, _dashboardJsonToSave, undefined, undefined, dashboardinfojson);
				/*DAS-418*/
				if($scope.saveDashboardTemplateFlg == true){
					$scope.saveTemplateInDB(_wsId, _dbBackendId, $scope.saveDashboardTemplateName, _dashboardJsonToSave, undefined, undefined, undefined);
				}else{
					$scope.saveDashboardInDB(_wsId, _dbBackendId, _dbName, _dashboardJsonToSave, undefined, undefined, undefined);
				}
			}
		};

		/** @description export Dashboard to local disk **/
		$scope.exportDashboard = function (dashboardProperties) {
			if (!dashboardProperties)
				return false;
			var
			REQ_URL = req_url.designer["openDashboard"],
			DES_PARAMS = {
				dashboardId : dashboardProperties.dashboardId.toString()
			},
			REQ_DATA = {
				dashboardParameters : JSON.stringify(DES_PARAMS)
			},
			requestSuccessFn = function (data, success) {
				if (data && data.DesignerResp && data.DesignerResp.success && data.DesignerResp.params) {
						var bvzxFile = JSON.parse(data.DesignerResp.params);
						bvzxFile.dashboardJson.Dashboard.id = getIdWithTimeStamp("dashboard");
						$scope.removeDashboardPublishDetailsFromDownloadedJson(bvzxFile.dashboardJson);
						/**DAS-577 change componentsId while exporting to bvzfile for @getDashbaordWithCOmponnets*/
						_activeDashboardJson = bvzxFile.dashboardJson;
						var absolutelayoutobjects = _activeDashboardJson.Dashboard.AbsoluteLayout.Object;
						_activeDashboardJson = JSON.stringify(_activeDashboardJson);
						for (var i = 0; i < absolutelayoutobjects.length; i++) {
							var objId = angular.copy(absolutelayoutobjects[i]["objectID"]);
							var newObjId = getIdWithTimeStamp("BVZ-" + i + "-");
							var re = new RegExp(objId, "g");
							_activeDashboardJson = _activeDashboardJson.replace(re, newObjId);
						}
						bvzxFile.dashboardJson = JSON.parse(_activeDashboardJson);
						$scope.exportToDefaultLocation(dashboardProperties.dashboardName, bvzxFile);
					} else {
					ServiceFactory.showNotification("Invalid dashboard configuration", "alert-danger", 3000);
				}
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn);
		};
		/** @description export from design page **/
		$scope.exportCurrentDashboard = function () {
			ServiceFactory.closeAllNotifications();
			var _activeDashboard = $scope.modal.selectedDashboard;
			if (_activeDashboard != "") {
				var _activeDashboardJson = angular.copy(_activeDashboard.json);
				_activeDashboardJson.Dashboard.id = getIdWithTimeStamp("dashboard");
				$scope.removeDashboardPublishDetailsFromDownloadedJson(_activeDashboardJson);
				/**DAS-577 change componentsId while exporting to bvzfile for @getDashbaordWithCOmponnets**/
					var absolutelayoutobjects = _activeDashboardJson.Dashboard.AbsoluteLayout.Object;
					_activeDashboardJson = JSON.stringify(_activeDashboardJson);
					for (var i = 0; i < absolutelayoutobjects.length; i++) {
						var objId = angular.copy(absolutelayoutobjects[i]["objectID"]);
						var newObjId = getIdWithTimeStamp("BVZ-" + i + "-");
						var re = new RegExp(objId, "g");
						_activeDashboardJson = _activeDashboardJson.replace(re, newObjId);
				}
				_activeDashboardJson = JSON.parse(_activeDashboardJson);
				$scope.exportToDefaultLocation(_activeDashboard.name, {
					"dashboardJson" : _activeDashboardJson
				});
			} else {
				ServiceFactory.showNotification("No active dashboard", "alert-danger", 3000);
			}
		};
		/** @description export to local disk - diff browser support **/
		$scope.exportToDefaultLocation = function (dName, dJson) {
			var link = document.createElement("a");
			link.setAttribute("id", "anchor");
			document.body.appendChild(link);
			var iframe = document.createElement("iframe");
			document.body.appendChild(iframe);
			iframe.setAttribute("id", "exportIframe");
			iframe.style.display = "none";
			iframe.style.visibility = "hidden";
			if (isIE = /*@cc_on!@*/ false || !!document.documentMode){
				/** IE **/
				var data = angular.toJson(dJson);
				var blobObject = new Blob([data]);
				window.navigator.msSaveBlob(blobObject, dName + ".bvzx");
			} else if (isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0){
				var uri = "data:application/...," + encodeURIComponent(angular.toJson(dJson));
				location.replace(uri);
			} else {
				var anchorobj = $("#anchor");
				var data = angular.toJson(dJson);
				var blob = new Blob([data], {
						type : "text/plain"
					}); //new way
				var bvz_url = URL.createObjectURL(blob);
				$(anchorobj).attr({
					"download" : dName + ".bvzx",
					"href" : bvz_url
				});
				$(anchorobj)[0].click();
			}
			$("#exportIframe").remove();
		};

		/** @description reload Workspace and update publish page **/
		$scope.reloadWorkSpaces = function () {
			$scope.getWorkspaces($scope.updatePublishPage);
		};

		/** @description  **/
		$scope.updatePublishPage = function (wsObj) {
			if (ServiceFactory.AUTH_INFO.get("rootFolders") != null) {
				$timeout(function(){
					$scope.selectedFolderToPublish = ServiceFactory.AUTH_INFO.get("rootFolders")[0];
				},1);
				$scope.loadFolderStructure();
			} else {
				ServiceFactory.showNotification("Failed to get Root-Folder", "alert-danger", 3000);
			}
		};
		
		/** @description load the folder tree of portal **/
		$scope.loadFolderStructure = function () {
			$scope.publishFolder = [];
			var rootFolder = ServiceFactory.AUTH_INFO.get("rootFolders");
			for (var i = 0; i < rootFolder.length; i++) {
				/** Do not show ShareWithMe folder in publish dialoge.(Issue #28168) **/
				if(rootFolder[i].type !== "share_with_me"){
					var nodeJson = {
						"name" : "",
						"id" : "",
						"nodes" : []
					};
					nodeJson.id = rootFolder[i].id;
					nodeJson.name = rootFolder[i].title;
					nodeJson.nodes = [];
					nodeJson.isChildPresent = false;
					$scope.publishFolder.push(nodeJson);
				}
			}
		};
		/** @description Model for publish to portal - called from Manage Page **/
		$scope.openPublishDialog_OLD = function (db) {
			$scope.publishDashboardName = db.dashboardName;
			$scope.publishDashboardDescription = "Published from dashboard designer";
			$scope.dashboardToPublish = db;
			$scope.getDashboardJsonFromServer(db.dashboardId, function (data) {
				if (data.DesignerResp.success) {
					$scope.drParams = data.DesignerResp.params;
					var jsonData = convertStringToJson(data.DesignerResp.params),
					dJson = jsonData["dashboardJson"];
					/** Check for invalid dashboard JSON - when publishing */
					if (dJson.Dashboard) {
						$scope.pubDocId = dJson.Dashboard.versionDetails.publishDocId;
						$scope.checkForAlreadyPublished($scope.pubDocId, $scope.showPublishDialog);
					} else {
						ServiceFactory.showNotification("Invalid dashboard configuration", "alert-danger", 3000);
					}
				} else {
					ServiceFactory.showNotification("Invalid dashboard configuration", "alert-danger", 3000);
				}
			}, function(){
				ServiceFactory.showNotification("Failed to get dashboard file for publishing", "alert-danger", 3000);
			});
		};
		$scope.gitExport =  function ($event, dashboardItem, action) {
			$event.stopPropagation();
			$scope.modal.gitexportconfig = {
					commitMessage : "",
					dashboardId : dashboardItem.dashboardId
			};
		
			if (!$scope.isInUse(dashboardItem.dashboardId)) {
				$scope.updateDashAction = action;
				$scope.isTrashAction = false;
				$scope.updateModalPopup($event, dashboardItem, action);
				$scope.showModelPopup('gitExportModalDialog');
				$scope.setFocusOnInput("#gitExportModalDialog", "#dashboardName");
			} else {
				ServiceFactory.showNotification("Workspace is in use", "alert-danger", 3000);
			}
		}
		/** @description Model for export to VCS - called from Manage Dashboard **/
		$scope.vcsPush =  function ($event, dashboardItem, action) {
			$event.stopPropagation();
			$scope.modal.vcsexportconfig = {
					commitMessage : "",
					pushItem : "vcs",
					pushType :[
			               { label: 'Dashboard Versioning', value: 'vcs'},
			               { label: 'Git Export', value: 'gitmigration' }
			               ],
					dashboardId : String(dashboardItem.dashboardId)
			};
		
			if (!$scope.isInUse(dashboardItem.dashboardId)) {
				$scope.updateDashAction = action;
				$scope.isTrashAction = false;
				$scope.updateModalPopup($event, dashboardItem, action);
				$scope.showModelPopup('vcsExportModalDialog');
				$scope.setFocusOnInput("#vcsExportModalDialog", "#dashboardName");
			} else {
				ServiceFactory.showNotification("Workspace is in use", "alert-danger", 3000);
			}
		}
		/** @description Model for import from VCS - called from Manage Dashboard **/
		$scope.openVcsImportDialog =  function ($event, db) {
			$event.stopPropagation();
			$scope.modal.pullDashboard={
						pushVersion:""
						};
			$scope.modal.importVcsDbConfig = {
					name: $scope.modal.replaceSpecialCharWithUnderscore(db.dashboardName),
					description: "Pull from VCS",
					dashboardInfo: db,
					dashboardId : String(db.dashboardId),
					publishedVersions: []
			};
			
			$scope.getDashboardVersionList();
		}
		/*method to get list of pushed dashboard version for @dashboardId*/
		$scope.getDashboardVersionList = function(){
			var spaceKey = window.sessionStorage.getItem('bvz_spacekey');
			var token = window.sessionStorage.getItem('bvz_token');
			var docId =  $scope.modal.importVcsDbConfig.dashboardId;
			var userid = window.sessionStorage.getItem('bvz_userid');
			var dashName=$scope.modal.importVcsDbConfig.name;		
			var requrl = "/bizviz/pluginService";
			var data={
				    "dashId": docId,
				    "name": dashName,
				    "module": "Dashboard"
			};
			var reqdata = {
					    "data": data,
					    "spacekey": spaceKey,
					    "consumerName":"BVZGIT",
					    "serviceName":"fetchComponentVersions",
					    "isSecure":true
					    
			};
			requestSuccessFn = function (response,success) {
				if(response.success){
				for(var i1=0; i1<response.data.length; i1++){
				$scope.modal.importVcsDbConfig.publishedVersions.push(response.data[i1]);
				}
				ServiceFactory.showNotification("Version list successfully loaded", "alert-success", 3000);
				ServiceFactory.hideLoader();
				$scope.showModelPopup('vcsImportModalDialog');
				}
				else
					{	
					ServiceFactory.showNotification(response.errorMessage, "alert-danger", 3000);
					}
				
			},
			requestFailedFn = function (response, success) {
				ServiceFactory.showNotification("Error in fetching version list", "alert-danger", 3000);
				$scope.showModelPopup('vcsImportModalDialog');
				ServiceFactory.hideLoader();
			};		
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(requrl, reqdata, requestSuccessFn, requestFailedFn);
		}
		/*method to pull dashboard based on @pushVersion selection*/
		$scope.updateVcsImport = function (){
			if($scope.modal.pullDashboard.pushVersion=="")
				ServiceFactory.showNotification("Please select version", "alert-danger", 3000);
			else
				{
				/*pull dashboard vesion with @commitid*/
				/*get pushed dashboard version for @dashboardId*/
				var spaceKey = window.sessionStorage.getItem('bvz_spacekey');
				var token = window.sessionStorage.getItem('bvz_token');
				var docId =  $scope.modal.importVcsDbConfig.dashboardId;
				var userid = window.sessionStorage.getItem('bvz_userid');
				var dashName=$scope.modal.importVcsDbConfig.name;
				
				var requrl = "/bizviz/pluginService";
				var data={
					    "dashId": docId,
					    "name": dashName,
					    "module": "Dashboard",
					    "commitId":String($scope.modal.pullDashboard.pushVersion)
				};
				var reqdata = {
						    "data": data,
						    "spacekey": spaceKey,
						    "consumerName":"BVZGIT",
						    "serviceName":"pullDashboard",
						    "isSecure":true
						    
				};
				requestSuccessFn = function (response) {
					if(response.success)
					ServiceFactory.showNotification("Dashboard Imported successfully !", "alert-success", 3000);
					else
					ServiceFactory.showNotification(response.errorMessage, "alert-danger", 3000);
				},
				requestFailedFn = function (response, success) {
					ServiceFactory.showNotification("Dashboard Not Imported !", "alert-danger", 3000);
				};
				BIZVIZ.SDK.secureRequest(requrl, reqdata, requestSuccessFn, requestFailedFn);
				}
		}
		/*[DAS-205]start share workspace and dashboard*/
		/** @description Model for DAS-205 share workspace to user - called from Manage Page **/
		$scope.openShareWokspaceDialog = function ($event,dashboardItem) {
			$event.stopPropagation();
			$scope.modal.shareWorkspaceDbConfig = {
					name: $scope.modal.replaceSpecialCharWithUnderscore(dashboardItem.dashboardName),
					description: "Share from dashboard designer",
					dashboardInfo: dashboardItem,
					dashboardJson: "",
					pubDocId: 0,
					publishedVersions: [],
					sharedTo: {selectedUsers: [], selectedGroups: [], excludedUsers: []},
					publishTo: {users: [], userGroupsList: [], excludeUsers: []},
					publishNew: {users: [], userGroupsList: [], excludeUsers: []},
					selectedTab: 0,
					alreadyPublished: false,
					publishAction: "PUB_NEW",
					selectedFolderName: "",
					publishTime: "",
					currentUser: {
						address: "",
						fullName: ServiceFactory.AUTH_INFO.get("user").fullName,
						id: ServiceFactory.AUTH_INFO.get("user").id,
						lastLoginDate: ServiceFactory.AUTH_INFO.get("user").lastLoginDate,
						spaceKey: ServiceFactory.AUTH_INFO.get("user").spaceKey,
						state: "",
						status: ServiceFactory.AUTH_INFO.get("user").status,
						thirdPartyUser: "",
						uniqueId: ServiceFactory.AUTH_INFO.get("user").uniqueId || ServiceFactory.AUTH_INFO.get("user").emailID,
						userName: ServiceFactory.AUTH_INFO.get("user").userName,
						userType: ServiceFactory.AUTH_INFO.get("user").userType,
						published: false
					},
					legacyPubVersion: ""
				};
			
			/*get shared user group list*/
			$scope.getShareWorkspacePrviledgeUserAndGroupList();
			
							$scope.getShareWorkspaceUserAndGroupList(function () {
								$scope.showModelPopup('shareWorkspaceModalDialog');
								$scope.setFocusOnInput("#shareWorkspaceModalDialog", "#publishUserSearchW");
								$scope.onShareWorkspaceActionChange();
							}, function(){
								ServiceFactory.showNotification("Failed to get list of users", "alert-danger", 3000);
							});             		
		};
		/** @description  get the user and group list for already shared workspace **/
		$scope.getShareWorkspacePrviledgeUserAndGroupList = function () {
			//console.log("workSpaceId for workspace: "+$scope.modal.shareWorkspaceDbConfig.dashboardInfo.dashboardId);
			//DAS-1064 Entitlement Implementation For Dashboard Designer
			if (!$scope.modal.shareWorkspaceDbConfig.sharedTo.selectedUsersAccessPrivileges) {
				$scope.modal.shareWorkspaceDbConfig.sharedTo.selectedUsersAccessPrivileges = [];
			}
			if (!$scope.modal.shareWorkspaceDbConfig.sharedTo.selectedGroupAccessPrivileges) {
				$scope.modal.shareWorkspaceDbConfig.sharedTo.selectedGroupAccessPrivileges = [];
			}
			if (!$scope.modal.shareWorkspaceDbConfig.sharedTo.excludedGroupUsers) {//DAS-1081
				$scope.modal.shareWorkspaceDbConfig.sharedTo.excludedGroupUsers = [];
			}
			if (!$scope.modal.shareWorkspaceDbConfig.sharedTo.excludedGroupUsers) {
				$scope.modal.shareWorkspaceDbConfig.sharedTo.excludedGroupUsers = [];
			}
			var
			REQ_URL = "/designer/getDashborardWorkSpacePriviligeDetails",
			REQ_DATA = { workSpaceId : $scope.modal.shareWorkspaceDbConfig.dashboardInfo.dashboardId },
			requestSuccessFn = function (data, success) {
				if(data.userprivilegeResp.selectedUsers && data.userprivilegeResp.selectedUsers.length > 0){
					for(var i1=0; i1<data.userprivilegeResp.selectedUsers.length; i1++){
						$scope.modal.shareWorkspaceDbConfig.sharedTo.selectedUsers.push(parseInt(data.userprivilegeResp.selectedUsers[i1]));
						$scope.modal.shareWorkspaceDbConfig.sharedTo.selectedUsersAccessPrivileges.push(data.userprivilegeResp.selectedUsersAccessPrivileges[i1]);
					}
				}
				if(data.userprivilegeResp.selectedGroups && data.userprivilegeResp.selectedGroups.length > 0){
					for(var i1=0; i1<data.userprivilegeResp.selectedGroups.length; i1++){
						$scope.modal.shareWorkspaceDbConfig.sharedTo.selectedGroups.push(parseInt(data.userprivilegeResp.selectedGroups[i1]));
						$scope.modal.shareWorkspaceDbConfig.sharedTo.selectedGroupAccessPrivileges.push(data.userprivilegeResp.selectedGroupAccessPrivileges[i1]);
					}
				}
				if(data.userprivilegeResp.excludedUsers && data.userprivilegeResp.excludedUsers.length > 0)
				{
					for (var i1 = 0; i1 < data.userprivilegeResp.excludedUsers.length; i1++) {
						$scope.modal.shareWorkspaceDbConfig.sharedTo.excludedUsers.push(parseInt(data.userprivilegeResp.excludedUsers[i1]));
					}
				}
				//DAS-1081
				if(data.userprivilegeResp.excludedGroupUsers.length > 0 )
				{
					for (var i1 = 0; i1 < data.userprivilegeResp.excludedGroupUsers.length; i1++) {
						$scope.modal.shareWorkspaceDbConfig.sharedTo.excludedGroupUsers.push((data.userprivilegeResp.excludedGroupUsers[i1]));
					}
				}
				
				ServiceFactory.hideLoader();
			},
			requestFailedFn = function (data, success) {
				ServiceFactory.showNotification("Failed to get shared list of users", "alert-danger", 3000);
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
		};
		/** @description  get the excluded user and group list for shared workspace**/
		$scope.getWorkspaceExcludeUsersFromGroupList = function() {//DAS-1064 Entitlement Implementation For Dashboard Designer
			/*remove texbox value if any clicking on exclude user tab*/
			document.getElementById('excludeUser_searchW').value="";
		    var groupIds = [];
		    angular.forEach($scope.modal.shareWorkspaceDbConfig.publishNew.userGroupsList, function(usergroup) {
				// Check if the Group has been selected (checkbox is checked)
				if (usergroup.published) {
					groupIds.push(Number(usergroup.id));
				}
			});
			/*var x = document.getElementById('selectListuser_groups');
			for (var i = 0; i < x.length; i++) {
				groupIds.push(Number(x[i].value));
		      }*/
		    var
		        REQ_URL = req_url.designer["getusersfromgroups"],
		        REQ_DATA = {
		            groupIds: groupIds
		        },
		        requestSuccessFn = function(data, success) {
		            ServiceFactory.hideLoader();
		            if (data.userGroups.assignedUsers) {
		                var j = 0;
		                for (var i = 0; i < data.userGroups.assignedUsers.length; i++) {
		                    var excludedUser = DesignerUtil.prototype.findInArray($scope.modal.shareWorkspaceDbConfig.publishNew.excludeUsers, "id", data.userGroups.assignedUsers[i].id);
		                    if (excludedUser && IsBoolean(excludedUser.published)) {
		                        data.userGroups.assignedUsers[i].published = true;
		                    } else {
		                        data.userGroups.assignedUsers[i].published = false;
		                    }
		                    var excludeUser = DesignerUtil.prototype.findInArray($scope.modal.shareWorkspaceDbConfig.publishTo.excludeUsers, "id", data.userGroups.assignedUsers[i].id);
		                    if (excludeUser && IsBoolean(excludeUser.published)) {
		                        data.userGroups.assignedUsers[i].published = true;
		                        j++;
		                    } else {
		                        data.userGroups.assignedUsers[i].published = false;
		                    }
		                }
		                /*@reset Users for multile time back and go*/
		                $scope.modal.shareWorkspaceDbConfig.publishNew.excludeUsers=[];
		                $scope.modal.shareWorkspaceDbConfig.publishTo.excludeUsers=[];
		                for(var i=0; i<data.userGroups.assignedUsers.length; i++){
							if($scope.modal.shareWorkspaceDbConfig.sharedTo.excludedUsers.indexOf(data.userGroups.assignedUsers[i].id)==-1)
								$scope.modal.shareWorkspaceDbConfig.publishNew.excludeUsers.push( data.userGroups.assignedUsers[i] );
							else
							$scope.modal.shareWorkspaceDbConfig.publishTo.excludeUsers.push( data.userGroups.assignedUsers[i] );
						}
		                //$scope.modal.shareWorkspaceDbConfig.publishNew.excludeUsers = data.userGroups.assignedUsers;
		                $scope.$apply();
		            }
		            excludeUserCount =  j;
		        };
		    ServiceFactory.showLoader();
		    BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn);
		};
		/** @description  get the user and group list for share workspace **/
		$scope.getShareWorkspaceUserAndGroupList = function (sCallback, eCallback) {
			var
			REQ_URL = "/designer/loadDashboardWorkspacePrivilege",
			REQ_DATA = { id : 11 },
			requestSuccessFn = function (data, success) {
				if (data.userGroups.users) {
					for(var i=0; i<data.userGroups.users.length; i++){
						if ($scope.modal.shareWorkspaceDbConfig.sharedTo.selectedUsers.indexOf(data.userGroups.users[i].id) == -1) {
							$scope.modal.shareWorkspaceDbConfig.publishNew.users.push(data.userGroups.users[i]);
						} else {
							$scope.modal.shareWorkspaceDbConfig.publishNew.users.push(data.userGroups.users[i]);
							$scope.modal.shareWorkspaceDbConfig.publishTo.users.push(data.userGroups.users[i]);
						}
					}
				}
				if (data.userGroups.userGroupsList) {
					for(var j=0; j<data.userGroups.userGroupsList.length; j++){
						if ($scope.modal.shareWorkspaceDbConfig.sharedTo.selectedGroups.indexOf(data.userGroups.userGroupsList[j].id) == -1) {
							$scope.modal.shareWorkspaceDbConfig.publishNew.userGroupsList.push(data.userGroups.userGroupsList[j]);
						}
						else {
							$scope.modal.shareWorkspaceDbConfig.publishNew.userGroupsList.push(data.userGroups.userGroupsList[j]);
							$scope.modal.shareWorkspaceDbConfig.publishTo.userGroupsList.push(data.userGroups.userGroupsList[j]);
						}
					}
				}
				$scope.modal.shareWorkspaceDbConfig.publishNew.excludeUsers = [];
				//DAS-1081 exclude users list 
				$scope.modal.shareWorkspaceDbConfig.publishTo.excludedGroupUsers = []
				if ($scope.modal.shareWorkspaceDbConfig.sharedTo.excludedGroupUsers.length > 0) {
					angular.forEach($scope.modal.shareWorkspaceDbConfig.sharedTo.excludedGroupUsers, function(exclusers) {
						var excuser = JSON.parse(exclusers);
						angular.forEach($scope.modal.shareWorkspaceDbConfig.publishNew.users, function(exuser) {
							var userslist = Object.values(excuser);
							for (var k = 0; k < userslist.length; k++) {
								for (var j = 0; j < userslist[k].length; j++) { 
									if (userslist[k][j] == exuser.id) {
										var group = Object.keys(excuser)
										angular.forEach($scope.modal.shareWorkspaceDbConfig.publishTo.userGroupsList, function(groups) {
											if(group == groups.id){
												var userGroup = groups.name;
												let ExcludedUsers = {
													userid: userslist[k][j],
													userName: exuser.userName,
													groupName: userGroup,
													groupId: group[0],
												};
												$scope.modal.shareWorkspaceDbConfig.publishTo.excludedGroupUsers.push(ExcludedUsers);
											}
										});
									}
								}
							}
						});
					});
				}

				if (sCallback && typeof(sCallback === "function")) {
					sCallback(data);
				}
				ServiceFactory.hideLoader();
			},
			requestFailedFn = function (data, success) {
				if (data.DesignerResp.success) {
					if (eCallback && typeof(eCallback === "function")) {
						eCallback(data);
					}
				}
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
		};
		/** @description on changing the Action Share Workspace from ShareDashboard popup **/
		var userListCount = 0;
		var userGroupListCount = 0;
		var excludedUserCount = 0;
		$scope.onShareWorkspaceActionChange = function(){
			var uListCount = 0;
			var ugListCount = 0;
			var exListCount = 0;
			if($scope.modal.shareWorkspaceDbConfig.publishTo.users.length > 0){
				uListCount = $scope.modal.shareWorkspaceDbConfig.publishTo.users.length;
			}
			userListCount = uListCount;
			if ($scope.modal.shareWorkspaceDbConfig.publishTo.userGroupsList.length > 0) {
				ugListCount = $scope.modal.shareWorkspaceDbConfig.publishTo.userGroupsList.length;
			}
			userGroupListCount = ugListCount;
			if($scope.modal.shareWorkspaceDbConfig.publishTo.excludeUsers.length > 0){
				exListCount = $scope.modal.shareWorkspaceDbConfig.publishTo.excludeUsers.length;
			}
			excludedUserCount = exListCount;
			/*remove below after apply service for count shared users count
			
			$('md-tab-item')[0].childNodes[0].data = "Users (" + uListCount + ")";
			$('md-tab-item')[1].childNodes[0].data = "User Groups (" + ugListCount + ")";
			$('md-tab-item')[2].childNodes[0].data = "Exclude Users (" + exListCount + ")";
			
			*/
			$('md-tab-item')[0].childNodes[0].data = "Users";
			$('md-tab-item')[1].childNodes[0].data = "User Groups";
			$('md-tab-item')[2].childNodes[0].data = "Exclude Users";
		}
		/** @description Model for DAS-205 share dashboard to user - called from Manage Page **/
		$scope.openShareDialog = function (db) {
			$scope.modal.shareDbConfig = {
					name: $scope.modal.replaceSpecialCharWithUnderscore(db.dashboardName),
					description: "Share from dashboard designer",
					dashboardInfo: db,
					dashboardJson: "",
					pubDocId: 0,
					publishedVersions: [],
					sharedTo: {selectedUsers: [],selectedGroups:[],excludedUsers: []},
					publishTo: {users: [], userGroupsList: [], excludeUsers: []},
					publishNew: {users: [], userGroupsList: [], excludeUsers: []},
					selectedTab: 0,
					alreadyPublished: false,
					publishAction: "PUB_NEW",
					publishTime: "",
					currentUser: {
						address: "",
						fullName: ServiceFactory.AUTH_INFO.get("user").fullName,
						id: ServiceFactory.AUTH_INFO.get("user").id,
						lastLoginDate: ServiceFactory.AUTH_INFO.get("user").lastLoginDate,
						spaceKey: ServiceFactory.AUTH_INFO.get("user").spaceKey,
						state: "",
						status: ServiceFactory.AUTH_INFO.get("user").status,
						thirdPartyUser: "",
						uniqueId: ServiceFactory.AUTH_INFO.get("user").uniqueId || ServiceFactory.AUTH_INFO.get("user").emailID,
						userName: ServiceFactory.AUTH_INFO.get("user").userName,
						userType: ServiceFactory.AUTH_INFO.get("user").userType,
						published: false
					},
					legacyPubVersion: ""
				};
			
			/*get shared user group list*/
			$scope.getShareDashboardPrviledgeUserAndGroupList();
			
			$scope.getShareDashboardUserAndGroupList(function () {
				$scope.showModelPopup('shareModalDialog');
				$scope.setFocusOnInput("#shareModalDialog", "#publishUserSearchD");
				$scope.onShareActionChange();
			}, function(){
				ServiceFactory.showNotification("Failed to get list of users", "alert-danger", 3000);
			});
		};
		/** @description  get the user and group list for share dashboard service **/
		$scope.getShareDashboardPrviledgeUserAndGroupList = function () {
			//DAS-1064 Entitlement Implementation For Dashboard Designer
			if (!$scope.modal.shareDbConfig.sharedTo.selectedUsersAccessPrivileges) {
				$scope.modal.shareDbConfig.sharedTo.selectedUsersAccessPrivileges = [];
			}
			if (!$scope.modal.shareDbConfig.sharedTo.selectedGroupAccessPrivileges) {
				$scope.modal.shareDbConfig.sharedTo.selectedGroupAccessPrivileges = [];
			}
			if (!$scope.modal.shareDbConfig.sharedTo.excludedGroupUsers) {
				$scope.modal.shareDbConfig.sharedTo.excludedGroupUsers = [];
			}
			if (!$scope.modal.shareDbConfig.sharedTo.excludedGroupUsers) {
				$scope.modal.shareDbConfig.sharedTo.excludedGroupUsers = [];
			}
			var
			REQ_URL = "/designer/getDashborardPriviligeDetails",
			REQ_DATA = { workSpaceId : $scope.modal.shareDbConfig.dashboardInfo.dashboardId },
			requestSuccessFn = function (data, success) {
		
				if(data.userprivilegeResp.selectedUsers && data.userprivilegeResp.selectedUsers.length > 0){
					for(var i1=0; i1<data.userprivilegeResp.selectedUsers.length; i1++){
				$scope.modal.shareDbConfig.sharedTo.selectedUsers.push(parseInt(data.userprivilegeResp.selectedUsers[i1]));
				$scope.modal.shareDbConfig.sharedTo.selectedUsersAccessPrivileges.push(data.userprivilegeResp.selectedUsersAccessPrivileges[i1]);
					}
			}
				if(data.userprivilegeResp.selectedGroups && data.userprivilegeResp.selectedGroups.length > 0){
					for(var i1=0; i1<data.userprivilegeResp.selectedGroups.length; i1++){
				$scope.modal.shareDbConfig.sharedTo.selectedGroups.push(parseInt(data.userprivilegeResp.selectedGroups[i1]));
				$scope.modal.shareDbConfig.sharedTo.selectedGroupAccessPrivileges.push(data.userprivilegeResp.selectedGroupAccessPrivileges[i1]);
					}
				}
				if(data.userprivilegeResp.excludedUsers && data.userprivilegeResp.excludedUsers.length > 0)
					{
					for(var i1=0; i1<data.userprivilegeResp.excludedUsers.length; i1++){
				$scope.modal.shareDbConfig.sharedTo.excludedUsers.push(parseInt(data.userprivilegeResp.excludedUsers[i1]));
					}
					}
					//DAS-1081 exclude users list 
				if(data.userprivilegeResp.excludedGroupUsers.length > 0 )
				{
					for (var i1 = 0; i1 < data.userprivilegeResp.excludedGroupUsers.length; i1++) {
						$scope.modal.shareDbConfig.sharedTo.excludedGroupUsers.push((data.userprivilegeResp.excludedGroupUsers[i1]));
					}
				}
				ServiceFactory.hideLoader();
			},
			requestFailedFn = function (data, success) {
				ServiceFactory.showNotification("Failed to get shared list of users", "alert-danger", 3000);
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
		};

		/** @description  get the user and group list for share dashboard **/
		$scope.getShareDashboardUserAndGroupList = function (sCallback, eCallback) {
			var
			REQ_URL = "/designer/loadDashboardPrivilege",
			REQ_DATA = { id : 12 },
			requestSuccessFn = function (data, success) {
				if (data.userGroups.users) {
					for(var i=0; i<data.userGroups.users.length; i++){
						if ($scope.modal.shareDbConfig.sharedTo.selectedUsers.indexOf(data.userGroups.users[i].id) == -1) {
							$scope.modal.shareDbConfig.publishNew.users.push(data.userGroups.users[i]);
						}
						else {
							$scope.modal.shareDbConfig.publishNew.users.push(data.userGroups.users[i]);
							$scope.modal.shareDbConfig.publishTo.users.push(data.userGroups.users[i]);
						}
					}
				}
				if (data.userGroups.userGroupsList) {
					for(var j=0; j<data.userGroups.userGroupsList.length; j++){
						if ($scope.modal.shareDbConfig.sharedTo.selectedGroups.indexOf(data.userGroups.userGroupsList[j].id) == -1) {
							$scope.modal.shareDbConfig.publishNew.userGroupsList.push(data.userGroups.userGroupsList[j]);
						}
						else {
							$scope.modal.shareDbConfig.publishNew.userGroupsList.push(data.userGroups.userGroupsList[j]);
							$scope.modal.shareDbConfig.publishTo.userGroupsList.push(data.userGroups.userGroupsList[j]);
						}
					}
				}
		
				$scope.modal.shareDbConfig.publishNew.excludeUsers = [];
				//DAS-1081 exclude users list 
				$scope.modal.shareDbConfig.publishTo.excludedGroupUsers = []
				if ($scope.modal.shareDbConfig.sharedTo.excludedGroupUsers.length > 0) {
					angular.forEach($scope.modal.shareDbConfig.sharedTo.excludedGroupUsers, function(exclusers) {
						var excuser = JSON.parse(exclusers);
						angular.forEach($scope.modal.shareDbConfig.publishNew.users, function(exuser) {
							var userslist = Object.values(excuser);
							for (var k = 0; k < userslist.length; k++) {
								for (var j = 0; j < userslist[k].length; j++) { 
									if (userslist[k][j] == exuser.id) {
										var group = Object.keys(excuser)
										angular.forEach($scope.modal.shareDbConfig.publishTo.userGroupsList, function(groups) {
											if(group == groups.id){
												var userGroup = groups.name;
												let ExcludedUsers = {
													userid: userslist[k][j],
													userName: exuser.userName,
													groupName: userGroup,
													groupId: group[0],
												};
												$scope.modal.shareDbConfig.publishTo.excludedGroupUsers.push(ExcludedUsers);
											}
										});
									}
								}
							}
						});
					});
				}
				if (sCallback && typeof(sCallback === "function")) {
					sCallback(data);
				}
				ServiceFactory.hideLoader();
			},
			requestFailedFn = function (data, success) {
				if (data.DesignerResp.success) {
					if (eCallback && typeof(eCallback === "function")) {
						eCallback(data);
					}
				}
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
		};
		/** @description on changing the Action from ShareDashboard popup **/
		var userListCount = 0;
		var userGroupListCount = 0;
		var excludedUserCount = 0;
		$scope.onShareActionChange = function(){
			var uListCount = 0;
			var ugListCount = 0;
			var exListCount = 0;
			if($scope.modal.shareDbConfig.publishTo.users.length > 0){
				uListCount = $scope.modal.shareDbConfig.publishTo.users.length;
			}
			userListCount = uListCount;
			if ($scope.modal.shareDbConfig.publishTo.userGroupsList.length > 0) {
				ugListCount = $scope.modal.shareDbConfig.publishTo.userGroupsList.length;
			}
			userGroupListCount = ugListCount;
			if($scope.modal.shareDbConfig.publishTo.excludeUsers.length > 0){
				exListCount = $scope.modal.shareDbConfig.publishTo.excludeUsers.length;
			}
			excludedUserCount = exListCount;
			/*remove below after apply service for count shared users count
			
			$('md-tab-item')[0].childNodes[0].data = "Users (" + uListCount + ")";
			$('md-tab-item')[1].childNodes[0].data = "User Groups (" + ugListCount + ")";
			$('md-tab-item')[2].childNodes[0].data = "Exclude Users (" + exListCount + ")";
			
			*/
			$('md-tab-item')[0].childNodes[0].data = "Users";
			$('md-tab-item')[1].childNodes[0].data = "User Groups";
			$('md-tab-item')[2].childNodes[0].data = "Exclude Users";
		}
		/** @description  get the excluded user and group list for shared workspace**/
		$scope.getDashboardExcludeUsersFromGroupList = function() {
		   /*clear text box value if any on exclude user tab click*/
			document.getElementById('excludeUser_searchD').value="";
			var groupIds = [];
		    var selGroup=new Array();
			/*var x = document.getElementById('selectListuser_group');old UI
			for (var i = 0; i < x.length; i++) {
				groupIds.push(Number(x[i].value));
		      }*/
		      //DAS-1064 Entitlement Implementation For Dashboard Designer
			angular.forEach($scope.modal.shareDbConfig.publishNew.userGroupsList, function(usergroup) {
				// Check if the Group has been selected (checkbox is checked)
				if (usergroup.published) {
					groupIds.push(Number(usergroup.id));
				}
			});
		    var
		        REQ_URL = req_url.designer["getusersfromgroups"],
		        REQ_DATA = {
		            groupIds: groupIds
		        },
		        requestSuccessFn = function(data, success) {
		            ServiceFactory.hideLoader();
		            if (data.userGroups.assignedUsers) {
		                var j = 0;
		                for (var i = 0; i < data.userGroups.assignedUsers.length; i++) {
		                    var excludedUser = DesignerUtil.prototype.findInArray($scope.modal.shareDbConfig.publishNew.excludeUsers, "id", data.userGroups.assignedUsers[i].id);
		                    if (excludedUser && IsBoolean(excludedUser.published)) {
		                        data.userGroups.assignedUsers[i].published = true;
		                    } else {
		                        data.userGroups.assignedUsers[i].published = false;
		                    }
		                    var excludeUser = DesignerUtil.prototype.findInArray($scope.modal.shareDbConfig.publishTo.excludeUsers, "id", data.userGroups.assignedUsers[i].id);
		                    if (excludeUser && IsBoolean(excludeUser.published)) {
		                        data.userGroups.assignedUsers[i].published = true;
		                        j++;
		                    } else {
		                        data.userGroups.assignedUsers[i].published = false;
		                    }
		                }
		                /*@reset Users for multile time back and go*/
		                $scope.modal.shareDbConfig.publishNew.excludeUsers=[];
		                $scope.modal.shareDbConfig.publishTo.excludeUsers=[];
		                for(var i=0; i<data.userGroups.assignedUsers.length; i++){
							if($scope.modal.shareDbConfig.sharedTo.excludedUsers.indexOf(data.userGroups.assignedUsers[i].id)==-1)
								$scope.modal.shareDbConfig.publishNew.excludeUsers.push( data.userGroups.assignedUsers[i] );
							else
							$scope.modal.shareDbConfig.publishTo.excludeUsers.push( data.userGroups.assignedUsers[i] );
						}
		                //$scope.modal.shareDbConfig.publishNew.excludeUsers = data.userGroups.assignedUsers;
		                $scope.$apply();
		            }
		            excludeUserCount =  j;
		            
		        };
		    ServiceFactory.showLoader();
		    BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn);
		};
		/*share dashboard service with users/usergroups @pluginId @parentId*/
		$scope.shareDashboardToUserGroups = function (){
			var spaceKey = window.sessionStorage.getItem('bvz_spacekey');
			var authtoken = window.sessionStorage.getItem('bvz_token');
			var docId =  $scope.modal.shareDbConfig.dashboardInfo.dashboardId;
			var parentId =  $scope.modal.shareDbConfig.dashboardInfo.parentId;
			var userID = window.sessionStorage.getItem('bvz_userid');
			
			var selUser=new Array();
			selUser = this.shareDashboardToUser();
			
			var selGroup=new Array();
			selGroup = this.shareDashboardToGroup();
			
			var exclUser=new Array();
			exclUser = this.shareDashboardExcludedUsers();
/*			var x = document.getElementById('selectListuser_list');
			for (var i = 0; i < x.length; i++) {
		         selUser.push(Number(x[i].value));
		      }
			
			var x = document.getElementById('selectListuser_group');
			for (var i = 0; i < x.length; i++) {
				selGroup.push(Number(x[i].value));
		      }
			
			var x = document.getElementById('selectListexclude_user');
			for (var i = 0; i < x.length; i++) {
				exclUser.push(Number(x[i].value));
		      }*/
		      //DAS-1064 Entitlement Implementation For Dashboard Designer
			var isAnyUserSelected = false;
			var isAnyGroupSelected = false;
			//[DAS-1104] Share Dashboard / workspace - UI Heading and Error Message 
			var isSharePosible = false;
			var isAnyUserpermissionSelected = false;
			
			if ($scope.permissions.view == 1 || $scope.permissions.edit == 1 || $scope.permissions.execute == 1) {
				isAnyUserpermissionSelected = true;
			}
			angular.forEach($scope.modal.shareDbConfig.publishNew.users, function(user) {
				if (user.published){
					isAnyUserSelected = true;
				}
			});
			angular.forEach($scope.modal.shareDbConfig.publishNew.userGroupsList, function(usergroup) {
				if (usergroup.published) {
					isAnyGroupSelected = true;
				}
			});
			if ($scope.deleteUser_GroupModalHeader !== "Revoke" && IsBoolean(!$scope.includeUserbtn)) {
				if (IsBoolean(isAnyUserpermissionSelected)) {
					if (IsBoolean(isAnyUserSelected) || IsBoolean(isAnyGroupSelected)) {
						isSharePosible = true;

					} else {
						ServiceFactory.showNotification("Please select atleast 1 user or group", "alert-danger", 3000);
						isSharePosible = false;
					}

				} else {
					ServiceFactory.showNotification("Please select atleast 1 permission", "alert-danger", 3000);
					isSharePosible = false;
				}
			} else {
				isSharePosible = true;
			}
			if (IsBoolean(isSharePosible)){
				var REQ_URL = "/designer/shareDashboard/";
				var REQ_DATA = {
							"pluginId" : docId,
							"selectedUsers" :angular.toJson(selUser),
							"selectedGroups" : angular.toJson(selGroup),
							"excludedUsers" : angular.toJson(exclUser),
							"type" : 12,
							"spacekey" : spaceKey,
						    "parentId" : parentId
						    
				};
				requestSuccessFn = function (success) {
					if (success) {
						$scope.hideModelPopup('shareModalDialog');
						if($scope.deleteUser_GroupModalHeader == "Revoke"){//[DAS-1104] Share Dashboard / workspace - UI Heading and Error Message 
							ServiceFactory.showNotification("privilege revoked successfully", "alert-success", 3000);
							$scope.deleteUser_GroupModalHeader = "";
						}else if(IsBoolean($scope.includeUserbtn)){
							$scope.includeUserbtn = false;
							ServiceFactory.showNotification("Dashboard shared successfully", "alert-success", 3000);
						}
						else{
							ServiceFactory.showNotification("Dashboard shared successfully", "alert-success", 3000);							
						}
					}else{
						ServiceFactory.showNotification("Dashboard not shared successfully", "alert-danger", 3000);
					}
					ServiceFactory.hideLoader();
				},
				requestFailedFn = function (data, success) {
					ServiceFactory.showNotification("Unsuccessfull share", "alert-danger", 3000);
					ServiceFactory.hideLoader();
				};
				ServiceFactory.showLoader();
				BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
			}
			$scope.permissions={ //resetting permission checkbox
				view:0,
				edit:0,
				execute:0,
			}
		}
		/*share workspace service with users/usergroups @pluginId @parentId*/
		$scope.shareWorkspaceDashboardToUserGroups = function (){
			var spaceKey = window.sessionStorage.getItem('bvz_spacekey');
			var authtoken = window.sessionStorage.getItem('bvz_token');
			var docId =  $scope.modal.shareWorkspaceDbConfig.dashboardInfo.dashboardId;
			var userID = window.sessionStorage.getItem('bvz_userid');
			//DAS-1064 Entitlement Implementation For Dashboard Designer
			var selUser=new Array();
			selUser = this.shareWorkspaceToUser();
			
			var selGroup=new Array();
			selGroup = this.shareWorkspaceToGroup();
			
			var exclUser=new Array();
			exclUser = this.shareWorkspaceExcludedUsers();
			/*var x = document.getElementById('selectListuser_lists');
			for (var i = 0; i < x.length; i++) {
		         selUser.push(Number(x[i].value));
		      }*/
			/*var x = document.getElementById('selectListuser_groups');
			for (var i = 0; i < x.length; i++) {
				selGroup.push(Number(x[i].value));
		      }*/
			
			/*var x = document.getElementById('selectListexclude_users');
			for (var i = 0; i < x.length; i++) {
				exclUser.push(Number(x[i].value));
		      }
			*/
			//DAS-1064 Entitlement Implementation For Dashboard Designer
			var isAnyUserSelected = false;
			var isAnyGroupSelected = false;
			//[DAS-1104] Share Dashboard / workspace - UI Heading and Error Message 
			var isSharePosible = false;
			var isAnyUserpermissionSelected = false;
			
			if ($scope.permissions.view == 1 || $scope.permissions.edit == 1 || $scope.permissions.execute == 1) {
				isAnyUserpermissionSelected = true;
			}
			angular.forEach($scope.modal.shareWorkspaceDbConfig.publishNew.users, function(user) {
				if (user.published) {
					isAnyUserSelected = true;
				}
			});
			angular.forEach($scope.modal.shareWorkspaceDbConfig.publishNew.userGroupsList, function(usergroup) {
				if (usergroup.published) {
					isAnyGroupSelected = true;
				}
			});

			if ($scope.deleteUser_GroupModalHeader !== "Revoke" && IsBoolean(!$scope.includeUserbtn)) {
				if (IsBoolean(isAnyUserpermissionSelected)) {
					if (IsBoolean(isAnyUserSelected) || IsBoolean(isAnyGroupSelected)) {
						isSharePosible = true;

					} else {
						ServiceFactory.showNotification("Please select atleast 1 user or group", "alert-danger", 3000);
						isSharePosible = false;
					}

				} else {
					ServiceFactory.showNotification("Please select atleast 1 permission", "alert-danger", 3000);
					isSharePosible = false;
				}
			} else {
				isSharePosible = true;
				$scope.includeUserbtn = false;
			}
			
			if (IsBoolean(isSharePosible)){
				var REQ_URL = "/designer/shareDashboardWorkSpace/";
				var REQ_DATA = {
							"pluginId" : docId,
							"selectedUsers" :angular.toJson(selUser),
							"selectedGroups" : angular.toJson(selGroup),
							"excludedUsers" : angular.toJson(exclUser),
							"type" : 11,
							"spacekey" : spaceKey
				};
										
				requestSuccessFn = function (success) {
					if (success) {
						$scope.hideModelPopup('shareWorkspaceModalDialog');
						//[DAS-1104] Share Dashboard / workspace - UI Heading and Error Message 
						if ($scope.deleteUser_GroupModalHeader == "Revoke") {
							ServiceFactory.showNotification("privilege revoked successfully", "alert-success", 3000);
							$scope.deleteUser_GroupModalHeader = "";
						} else {
							ServiceFactory.showNotification("Workspace shared successfully", "alert-success", 3000);
						}
					} else {
						ServiceFactory.showNotification("Workspace not shared successfully", "alert-danger", 3000);
					}
					ServiceFactory.hideLoader();
				},
				requestFailedFn = function (data, success) {
					ServiceFactory.showNotification("Unsuccessfull share", "alert-danger", 3000);
					ServiceFactory.hideLoader();
				};
				ServiceFactory.showLoader();
				BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
			}
			$scope.permissions={ //resetting permission checkbox
				view:0,
				edit:0,
				execute:0,
			}
		}
		/** code for add remove list item from dropdown of users/groups **/
    	$scope.moveItem = function(src, dest) {	
    		$('#'+src+ 'option:selected').each( function() {
                $('#'+dest).append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
            $(this).remove();
        });
    		angular.element(document.querySelector('#'+dest)).append(angular.element(document.querySelector('#'+src)).find("option:selected"));
    		angular.element(document.querySelector('#'+src)).find("option:selected").remove();
    		disableSelection( dest );
    	};
    	$scope.moveAllItems = function(src, dest) {
    		var select1 = document.getElementById(src);
    		var select2 = document.getElementById(dest);
    		select2.innerHTML = select2.innerHTML+select1.innerHTML;
    		select1.innerHTML="";
    		disableSelection( dest );
    	};
    	function disableSelection( dest ){
    		try{
    			var currentId = '#'+dest+" "+'option' ;
    			$(currentId ).prop("selected", false);
    		}catch( err ){
    			
    		}
    	};
    	/*@description search textbox feature in dropdown*/
    	$scope.filterFunction = function(textbox,dropdown) {
    		  var input,filter,div, a, i;
    		  input = document.getElementById(textbox);
    		  filter = input.value.toUpperCase();
    		  div = document.getElementById(dropdown);
    		  a = div.getElementsByTagName("option");
    		  for (i = 0; i < a.length; i++) {
    		    txtValue = a[i].textContent || a[i].innerText;
    		    if (txtValue.toUpperCase().indexOf(filter) > -1) {
    		      a[i].style.display = "";
    		    } else {
    		      a[i].style.display = "none";
    		    }
    		  }
    		};
		/*@description search textbox feature in new UI //DAS-1064 Entitlement Implementation For Dashboard Designer*/
		$scope.UserfilterFunction = function(textbox, dropdown) {
			var input, filter, div, listItems, i, txtValue;
			input = document.getElementById(textbox);
			filter = input.value.toUpperCase();
			div = document.getElementById(dropdown);
			listItems = div.getElementsByTagName('md-list-item');
			for (i = 0; i < listItems.length; i++) {
				var h5 = listItems[i].getElementsByTagName('h5')[0];
				if (h5) {
					txtValue = h5.textContent || h5.innerText;
					if (txtValue.toUpperCase().indexOf(filter) > -1) {
						listItems[i].style.display = "";
					} else {
						listItems[i].style.display = "none";
					}
				}
			}
		};
		$scope.onPermissionChange = function(permissions){
			$scope.permissions = permissions;
			$scope.permissions = {
				view: $scope.permissions.view ? 1 : 0,
				edit: $scope.permissions.edit ? 1 : 0,
				execute: $scope.permissions.execute ? 1 : 0,
			};
		}
		/*@description Editing for shared workspace users/groups */
		$scope.deleteWorkspaceList = function(deleteuser) {
			angular.forEach($scope.modal.shareWorkspaceDbConfig.publishTo.users, function(user) {
				if (user.id == deleteuser.id) {
					$scope.modal.shareWorkspaceDbConfig.selectedTab = 0;
						var userindex = $scope.modal.shareWorkspaceDbConfig.publishTo.users.findIndex(function(removeUser) {
							return removeUser.id === deleteuser.id;
						});
						if (userindex !== -1) {
							$scope.modal.shareWorkspaceDbConfig.publishTo.users.splice(userindex, 1);
						}
				}
			});
			angular.forEach($scope.modal.shareWorkspaceDbConfig.publishTo.userGroupsList, function(usergroup) {
				if (usergroup.id == deleteuser.id) {
					$scope.modal.shareWorkspaceDbConfig.selectedTab = 1
						var groupindex = $scope.modal.shareWorkspaceDbConfig.publishTo.userGroupsList.findIndex(function(removeGroup) {
							return removeGroup.id === deleteuser.id;
						});
						if (groupindex !== -1) {
							$scope.modal.shareWorkspaceDbConfig.publishTo.userGroupsList.splice(groupindex, 1);
						}
				}
			});
			//DAS-1081 exclude users list 
			angular.forEach($scope.modal.shareWorkspaceDbConfig.publishTo.excludedGroupUsers, function(excelUser) {
				if (excelUser.groupId == deleteuser.id) {
					var groupindex = $scope.modal.shareWorkspaceDbConfig.publishTo.excludedGroupUsers.findIndex(function(removeUserGrp) {
						return (removeUserGrp.groupId * 1) === deleteuser.id;
					});
					if (groupindex !== -1) {
						$scope.modal.shareWorkspaceDbConfig.publishTo.excludedGroupUsers.splice(groupindex, 1);
					}
				}
			});
		}
		/*@description exclude users list include button*/ 
		$scope.includeUser = function(user) {
			$scope.includeUserbtn = true;
			angular.forEach($scope.modal.shareWorkspaceDbConfig?.sharedTo.excludedUsers, function(excldedusers) {
				if (user.userid == excldedusers) {
					var groupindex = $scope.modal.shareWorkspaceDbConfig.sharedTo.excludedUsers.findIndex(function(addUser) {
						return addUser === user.userid;
					});
					if (groupindex !== -1) {
						$scope.modal.shareWorkspaceDbConfig.sharedTo.excludedUsers.splice(groupindex, 1);
					}
					var userIndex = $scope.modal.shareWorkspaceDbConfig.publishTo.excludedGroupUsers.findIndex(function(removeUser) {
						return removeUser.userid === user.userid;
					});
					if (userIndex !== -1) {
						$scope.modal.shareWorkspaceDbConfig.publishTo.excludedGroupUsers.splice(userIndex, 1);
					}
				}
			});
			angular.forEach($scope.modal.shareDbConfig?.sharedTo.excludedUsers, function(excldedusers) {
				if (user.userid == excldedusers) {
					var groupindex = $scope.modal.shareDbConfig.sharedTo.excludedUsers.findIndex(function(addUser) {
						return addUser === user.userid;
					});
					if (groupindex !== -1) {
						$scope.modal.shareDbConfig.sharedTo.excludedUsers.splice(groupindex, 1);
					}
					var userIndex = $scope.modal.shareDbConfig.publishTo.excludedGroupUsers.findIndex(function(removeUser) {
						return removeUser.userid === user.userid;
					});
					if (userIndex !== -1) {
						$scope.modal.shareDbConfig.publishTo.excludedGroupUsers.splice(userIndex, 1);
					}
				}
			});
		}
		/*@description getting user previlage to show in UI*/
		$scope.getPrivileges = function(userId) {
			var result = 'N/A';

			angular.forEach($scope.modal.shareDbConfig?.sharedTo.selectedUsersAccessPrivileges, function(privilege) {
				var privileges = JSON.parse(privilege); // Parse each privilege string
				if (privileges[userId]) {
					var userPrivileges = privileges[userId];
					var allowedPrivileges = [];
					for (var key in userPrivileges) {
						if (userPrivileges[key] === 1) {
							// Capitalize the first letter of the key and push to the array
							allowedPrivileges.push(key.charAt(0).toUpperCase() + key.slice(1));
						}
					}
					if (allowedPrivileges.length > 0) {
						result = allowedPrivileges.join(', ');
					}
				}
			});
			angular.forEach($scope.modal.shareDbConfig?.sharedTo.selectedGroupAccessPrivileges, function(privilege) {
				var privileges = JSON.parse(privilege); // Parse each privilege string
				if (privileges[userId]) {
					var userPrivileges = privileges[userId];
					var allowedPrivileges = [];
					for (var key in userPrivileges) {
						if (userPrivileges[key] === 1) {
							// Capitalize the first letter of the key and push to the array
							allowedPrivileges.push(key.charAt(0).toUpperCase() + key.slice(1));
						}
					}
					if (allowedPrivileges.length > 0) {
						result = allowedPrivileges.join(', ');
					}
				}
			});
			angular.forEach($scope.modal.shareWorkspaceDbConfig?.sharedTo.selectedUsersAccessPrivileges, function(privilege) {
				var privileges = JSON.parse(privilege); // Parse each privilege string
				if (privileges[userId]) {
					var userPrivileges = privileges[userId];
					var allowedPrivileges = [];
					for (var key in userPrivileges) {
						if (userPrivileges[key] === 1) {
							// Capitalize the first letter of the key and push to the array
							allowedPrivileges.push(key.charAt(0).toUpperCase() + key.slice(1));
						}
					}
					if (allowedPrivileges.length > 0) {
						result = allowedPrivileges.join(', ');
					}
				}
			});
			angular.forEach($scope.modal.shareWorkspaceDbConfig?.sharedTo.selectedGroupAccessPrivileges, function(privilege) {
				var privileges = JSON.parse(privilege); // Parse each privilege string
				if (privileges[userId]) {
					var userPrivileges = privileges[userId];
					var allowedPrivileges = [];
					for (var key in userPrivileges) {
						if (userPrivileges[key] === 1) {
							// Capitalize the first letter of the key and push to the array
							allowedPrivileges.push(key.charAt(0).toUpperCase() + key.slice(1));
						}
					}
					if (allowedPrivileges.length > 0) {
						result = allowedPrivileges.join(', ');
					}
				}
			});
			// Return the result after the loop completes
			return result;
		};
		/*@description delete confirmation alert for workspace*/
		$scope.confirmDeleteUserGroup = function($event,user_Group,user_groupName,type) {
			$event.stopPropagation();
			$scope.user_groupName = user_groupName;
			$scope.type = type;
			$scope.user_GroupToDelete = user_Group;
			$scope.deleteUser_GroupModalHeader = "Revoke";
			$scope.showModelPopup('confirmDeleteUserGroupModal');
		};
		/*@description delete users or group for workspace*/
		$scope.deleteUser_Group = function(user_Group,type) {
			if (type == 'workspace') {
				$scope.deleteWorkspaceList(user_Group);
				$scope.shareWorkspaceDashboardToUserGroups()
			}else if(type == 'dashboard'){
				$scope.deleteUsersForDashboard(user_Group);
				$scope.shareDashboardToUserGroups();
			}
				$scope.closeDeleteUserGroupModal();
		};

		$scope.closeDeleteUserGroupModal = function() {
			$scope.setModelWatcherStatus('confirmDeleteUserGroupModal', false);
		};

		/*@description deleting for dashboard shared users/groups */
		$scope.deleteUsersForDashboard = function(deleteUser) {
			angular.forEach($scope.modal.shareDbConfig.publishTo.users, function(user) {
				if (user.id == deleteUser.id) {
					$scope.modal.shareDbConfig.selectedTab = 0;
					var userindex = $scope.modal.shareDbConfig.publishTo.users.findIndex(function(removeUser) {
						return removeUser.id === deleteUser.id;
					});
					if (userindex !== -1) {
						// If the user is found, remove the user from published view
						$scope.modal.shareDbConfig.publishTo.users.splice(userindex, 1);
					}
				}
			});
			angular.forEach($scope.modal.shareDbConfig.publishTo.userGroupsList, function(usergroup) {
				if (usergroup.id == deleteUser.id) {
					$scope.modal.shareDbConfig.selectedTab = 1
					var groupindex = $scope.modal.shareDbConfig.publishTo.userGroupsList.findIndex(function(removeGroup) {
						return removeGroup.id === deleteUser.id;
					});
					if (groupindex !== -1) {
						// If the user is found, remove the group from published view
						$scope.modal.shareDbConfig.publishTo.userGroupsList.splice(groupindex, 1);
					}
				}

			});
			angular.forEach($scope.modal.shareDbConfig.publishTo.excludedGroupUsers, function(excelUser) {
				if (excelUser.groupId == deleteUser.id) {
					var groupindex = $scope.modal.shareDbConfig.publishTo.excludedGroupUsers.findIndex(function(removeUserGrp) {
						return (removeUserGrp.groupId * 1) === deleteUser.id;
					});
					if (groupindex !== -1) {
						$scope.modal.shareDbConfig.publishTo.excludedGroupUsers.splice(groupindex, 1);
					}
				}
			});
		}
		$scope.shareWorkspaceToUser = function() {
			var selUser = [];
			if ($scope.deleteUser_GroupModalHeader !== "Revoke" && IsBoolean(!$scope.includeUserbtn)){//[DAS-1104] Share Dashboard / workspace - UI Heading and Error Message 
				angular.forEach($scope.modal.shareWorkspaceDbConfig.publishNew.users, function(user) {
					var userpermissions = {};
					// Check if the user has been selected (checkbox is checked)
					if (user.published) {
						userpermissions[String(user.id)] = $scope.permissions;
						selUser.push(userpermissions);
						//selUser.push(Number(user.id));
					}
				});
			}
			angular.forEach($scope.modal.shareWorkspaceDbConfig.publishTo.users, function(selectedusers) {
				// Check if previously user has been selected 
				if (selectedusers.published !== false) {
					angular.forEach($scope.modal.shareWorkspaceDbConfig.sharedTo.selectedUsersAccessPrivileges, function(privilege) {
						let privilegeObj = JSON.parse(privilege);
						var userAlreadyExists = selUser.some(function(userObj) {
							return Object.keys(userObj)[0] === String(selectedusers.id);
						});
						if (!userAlreadyExists && privilegeObj[selectedusers.id]) {
							selUser.push(privilegeObj);
						}
					});
				}
			});

			return selUser;
		};
		$scope.shareWorkspaceToGroup = function() {
			var selGroup = [];
			if ($scope.deleteUser_GroupModalHeader !== "Revoke"){
				angular.forEach($scope.modal.shareWorkspaceDbConfig.publishNew.userGroupsList, function(usergroup) {
					var userpermissions = {};
					// Check if the Group has been selected (checkbox is checked)
					if (usergroup.published) {
						userpermissions[String(usergroup.id)] = $scope.permissions;
						selGroup.push(userpermissions);
					}
				});
			}
			angular.forEach($scope.modal.shareWorkspaceDbConfig.publishTo.userGroupsList, function(selectedusergroup) {
				// Check if previously group has been selected 
				if (selectedusergroup.published !== false) {
					angular.forEach($scope.modal.shareWorkspaceDbConfig.sharedTo.selectedGroupAccessPrivileges, function(privilege) {
						let privilegeObj = JSON.parse(privilege);
						var userAlreadyExists = selGroup.some(function(userObj) {
							return Object.keys(userObj)[0] === String(selectedusergroup.id);
						});
						if (!userAlreadyExists && privilegeObj[selectedusergroup.id]) {
							selGroup.push(privilegeObj);
						}
					});
				}
			});

			return selGroup;
		};
		$scope.shareWorkspaceExcludedUsers = function() {
			var ExcUsers = [];
			if ($scope.deleteUser_GroupModalHeader !== "Revoke" && IsBoolean(!$scope.includeUserbtn)) {
				angular.forEach($scope.modal.shareWorkspaceDbConfig.publishNew.excludeUsers, function(exclusers) {
					// Check if the Group has been selected (checkbox is checked)
					if (exclusers.published) {
						ExcUsers.push(Number(exclusers.id));
					}
				});
			}
			angular.forEach($scope.modal.shareWorkspaceDbConfig.sharedTo.excludedUsers, function(previousexclusers) {
				// Check if the Group has been selected (checkbox is checked)
				if (previousexclusers.published != false) {
					ExcUsers.push(Number(previousexclusers));
				}
			});

			return ExcUsers;
		};
		/*@description Dashboard sharing*/
		$scope.shareDashboardToUser = function() {
			var selUser = [];
			if ($scope.deleteUser_GroupModalHeader !== "Revoke" && IsBoolean(!$scope.includeUserbtn)) {
				angular.forEach($scope.modal.shareDbConfig.publishNew.users, function(user) {
					var userpermissions = {};
					// Check if the user has been selected (checkbox is checked)
					if (user.published) {
						userpermissions[String(user.id)] = $scope.permissions;
						selUser.push(userpermissions);
					}
				});
			}
			angular.forEach($scope.modal.shareDbConfig.publishTo.users, function(selectedUser) {
				if (selectedUser.published !== false) {
					angular.forEach($scope.modal.shareDbConfig.sharedTo.selectedUsersAccessPrivileges, function(privilege) {
						let privilegeObj = JSON.parse(privilege);
						var userAlreadyExists = selUser.some(function(userObj) {
							return Object.keys(userObj)[0] === String(selectedUser.id);
						});
						if (!userAlreadyExists && privilegeObj[selectedUser.id]) {
							selUser.push(privilegeObj);
						}
					});
				}
			});
			return selUser;
		}
		$scope.shareDashboardToGroup = function(){
			var selGroup = [];
			if ($scope.deleteUser_GroupModalHeader !== "Revoke" && IsBoolean(!$scope.includeUserbtn)){
				angular.forEach($scope.modal.shareDbConfig.publishNew.userGroupsList, function(usergroup) {
					var userpermissions = {};
					// Check if the Group has been selected (checkbox is checked)
					if (usergroup.published) {
						userpermissions[String(usergroup.id)] = $scope.permissions;
						selGroup.push(userpermissions);
					}
				});
			}
			angular.forEach($scope.modal.shareDbConfig.publishTo.userGroupsList, function(selectedusergroup) {
				// Check if previously group has been selected 
				if (selectedusergroup.published !== false) {
					angular.forEach($scope.modal.shareDbConfig.sharedTo.selectedGroupAccessPrivileges, function(privilege) {
						let privilegeObj = JSON.parse(privilege);
						var userAlreadyExists = selGroup.some(function(userObj) {
							return Object.keys(userObj)[0] === String(selectedusergroup.id);
						});
						if (!userAlreadyExists && privilegeObj[selectedusergroup.id]) {
							selGroup.push(privilegeObj);
						}
					});
				}
			});

			return selGroup;
		}
		$scope.shareDashboardExcludedUsers = function() {
			var ExcUsers = [];
			if ($scope.deleteUser_GroupModalHeader !== "Revoke" && IsBoolean(!$scope.includeUserbtn)) {
				angular.forEach($scope.modal.shareDbConfig.publishNew.excludeUsers, function(exclusers) {
					// Check if the Group has been selected (checkbox is checked)
					if (exclusers.published) {
						ExcUsers.push(Number(exclusers.id));
					}
				});
			}
			angular.forEach($scope.modal.shareDbConfig.sharedTo.excludedUsers, function(previousexclusers) {
				// Check if the Group has been selected (checkbox is checked)
				if (previousexclusers) {
					ExcUsers.push(Number(previousexclusers));
				}
			});

			return ExcUsers;
		};
    		/*@description clear search textbox and list dropdown*/
        	$scope.clearfilterFunction = function(textbox,dropdown) {
        		  var div,input, a, i;
        		  input = document.getElementById(textbox);
        		  input.value = "";
        		  div = document.getElementById(dropdown);
        		  a = div.getElementsByTagName('md-list-item');
        		  for (i = 0; i < a.length; i++) {
        		      a[i].style.display = "";
        		  }
        		};
		/*[DAS-206]end share workspace and dashboard*/
		/** @description Model for publish to portal - called from Manage Page **/
		$scope.openPublishDialog = function (db) {
			$scope.modal.publishDbConfig = {
				name: $scope.modal.replaceSpecialCharWithUnderscore(db.dashboardName),
				description: "Published from dashboard designer",
				dashboardInfo: db,
				dashboardJson: "",
				pubDocId: 0,
				publishedVersions: [],
				publishToFolder: "",
				publishToFolderId: "",
				publishTo: {users: [], userGroupsList: [], excludeUsers: []},
				publishNew: {users: [], userGroupsList: [], excludeUsers: []},
				selectedTab: 0,
				alreadyPublished: false,
				publishAction: "PUB_NEW",
				publishTime: "",
				currentUser: {
					address: "",
					fullName: ServiceFactory.AUTH_INFO.get("user").fullName,
					id: ServiceFactory.AUTH_INFO.get("user").id,
					lastLoginDate: ServiceFactory.AUTH_INFO.get("user").lastLoginDate,
					spaceKey: ServiceFactory.AUTH_INFO.get("user").spaceKey,
					rootFolders: ServiceFactory.AUTH_INFO.get("rootFolders"), /**DAS-624 */
					state: "",
					status: ServiceFactory.AUTH_INFO.get("user").status,
					thirdPartyUser: "",
					uniqueId: ServiceFactory.AUTH_INFO.get("user").uniqueId || ServiceFactory.AUTH_INFO.get("user").emailID,
					userName: ServiceFactory.AUTH_INFO.get("user").userName,
					userType: ServiceFactory.AUTH_INFO.get("user").userType,
					published: false
				},
				legacyPubVersion: ""
			};
			$scope.getDashboardJsonFromServer($scope.modal.publishDbConfig.dashboardInfo.dashboardId, function (data) {
				if (data.DesignerResp.success) {
					$scope.modal.publishDbConfig.dashboardJson = data.DesignerResp.params;
					var jsonData = convertStringToJson(data.DesignerResp.params),
					dJson = jsonData["dashboardJson"],
					iJson = jsonData["infoJson"];
					
					/** Check for invalid dashboard JSON - when publishing */
					if (dJson && dJson.Dashboard && iJson == null) {
						$scope.modal.publishDbConfig.publishToFolderId = "";
						$scope.getSelectedFolderValue($scope.modal.publishDbConfig.publishToFolderId);
						$scope.modal.publishDbConfig.pubDocId = dJson.Dashboard.versionDetails.publishDocId || 0;
						/**check dashboard published */
						if(dJson.Dashboard.versionDetails.publishDocId !== "" && dJson.Dashboard.versionDetails.publishDocId !== 0){
							$scope.modal.publishDbConfig.alreadyPublished = true;
							$scope.modal.publishDbConfig.publishAction = "PUB_OVERRIDE";
							/** Old published dashboard should be added into version array **/
							if(dJson.Dashboard.versionDetails.publishedVersions == undefined){
								dJson.Dashboard.versionDetails.publishedVersions = [];
								$scope.modal.publishDbConfig.legacyPubVersion = {
									id: $scope.modal.publishDbConfig.pubDocId, 
									name: $scope.modal.publishDbConfig.name, 
									description: $scope.modal.publishDbConfig.description, 
									publishTime: dJson.Dashboard.versionDetails.publishedOn,
									publishFolder: $scope.modal.publishDbConfig.publishToFolderId,
									legacyPubVersion: true
								};
								dJson.Dashboard.versionDetails.publishedVersions.push( $scope.modal.publishDbConfig.legacyPubVersion );
							}
						}
						$scope.modal.publishDbConfig.publishedVersions = dJson.Dashboard.versionDetails.publishedVersions || [];
						var versionObj = DesignerUtil.prototype.findInArray($scope.modal.publishDbConfig.publishedVersions, "id", $scope.modal.publishDbConfig.pubDocId);
						if(versionObj){
							$scope.modal.publishDbConfig.name = $scope.modal.replaceSpecialCharWithUnderscore(versionObj.name || $scope.modal.publishDbConfig.name);
							$scope.modal.publishDbConfig.description = versionObj.description || $scope.modal.publishDbConfig.description;					
						}
						$scope.getUserAndGroupList(function () {
							$scope.showModelPopup('publishModalDialog');
							$scope.setFocusOnInput("#publishModalDialog", "#publishUserSearch");
							$scope.onActionChange();
						}, function(){
							ServiceFactory.showNotification("Failed to get list of users", "alert-danger", 3000);
						});
					} else if(dJson && dJson.Dashboard && iJson != null){
						$scope.modal.publishDbConfig.publishToFolderId = iJson.publishFolderId || "";
						$scope.getSelectedFolderValue($scope.modal.publishDbConfig.publishToFolderId,iJson);
						$scope.modal.publishDbConfig.pubDocId = iJson.publishDocId || 0;
						if(iJson.publishDocId !== "" && iJson.publishDocId !== 0){
							$scope.modal.publishDbConfig.alreadyPublished = true;
							$scope.modal.publishDbConfig.publishAction = "PUB_OVERRIDE";
							/** Old published dashboard should be added into version array **/
							if(iJson.publishedVersions == undefined){
								iJson.publishedVersions = [];
								$scope.modal.publishDbConfig.legacyPubVersion = {
									id: $scope.modal.publishDbConfig.pubDocId, 
									name: $scope.modal.publishDbConfig.name, 
									description: $scope.modal.publishDbConfig.description, 
									publishTime: iJson.publishedOn,
									publishFolder: $scope.modal.publishDbConfig.publishToFolderId,
									legacyPubVersion: true
								};
								iJson.publishedVersions.push( $scope.modal.publishDbConfig.legacyPubVersion );
							}
						}
						$scope.modal.publishDbConfig.publishedVersions = iJson.publishedVersions || [];
						
						var versionObj = DesignerUtil.prototype.findInArray($scope.modal.publishDbConfig.publishedVersions, "id", $scope.modal.publishDbConfig.pubDocId);
						if(versionObj){
							$scope.modal.publishDbConfig.name = $scope.modal.replaceSpecialCharWithUnderscore(versionObj.name || $scope.modal.publishDbConfig.name);
							$scope.modal.publishDbConfig.description = versionObj.description || $scope.modal.publishDbConfig.description;					
						}
						$scope.getUserAndGroupList(function () {
							$scope.showModelPopup('publishModalDialog');
							$scope.setFocusOnInput("#publishModalDialog", "#publishUserSearch");
							$scope.onActionChange();
						}, function(){
							ServiceFactory.showNotification("Failed to get list of users", "alert-danger", 3000);
						});
					} else {
						ServiceFactory.showNotification("Invalid dashboard configuration", "alert-danger", 3000);
					}
				} else {
					ServiceFactory.showNotification("Invalid dashboard configuration", "alert-danger", 3000);
				}
			}, function(){
				ServiceFactory.showNotification("Failed to get dashboard file for publishing", "alert-danger", 3000);
			});
		};
		/** @description  get the user and group list **/
		$scope.getUserAndGroupList = function (sCallback, eCallback) {
			var
			REQ_URL = req_url.designer["loadPrivilege"],
			REQ_DATA = { treeID : $scope.modal.publishDbConfig.pubDocId },
			requestSuccessFn = function (data, success) {
				/** dashboard is already published, whether with old or new approach **/
				if($scope.modal.publishDbConfig.pubDocId !== "" && $scope.modal.publishDbConfig.pubDocId !== 0){
					/** published to atleast 1 user, then dashboard was published with new approach **/
					if (data.userGroups.assignedUsers && data.userGroups.assignedUsers.length > 0) {
						var isPublishedToCurrentUser = false;
						for(var i1=0; i1<data.userGroups.assignedUsers.length; i1++){
							/** push all users except current user **/
							if($scope.modal.publishDbConfig.currentUser.id !== data.userGroups.assignedUsers[i1].id){
								data.userGroups.assignedUsers[i1].published = true;
								$scope.modal.publishDbConfig.publishTo.users.push( data.userGroups.assignedUsers[i1] );
								$scope.modal.publishDbConfig.publishNew.users.push( data.userGroups.assignedUsers[i1] );
							}else{
								isPublishedToCurrentUser = true;
								data.userGroups.assignedUsers[i1].published = true;
								$scope.modal.publishDbConfig.publishNew.users.push( data.userGroups.assignedUsers[i1] );
							}
						}
						/** push current user if it was published to current user with new approach **/
						if(IsBoolean(isPublishedToCurrentUser)){
							$scope.modal.publishDbConfig.currentUser.published = true;
							$scope.modal.publishDbConfig.publishTo.users.push( $scope.modal.publishDbConfig.currentUser);
						}
					} else {
						/** There is no Usersing above, now check that it should not be published to any group, so it was published with old approach **/
						if (data.userGroups.assignedUserGroups && data.userGroups.assignedUserGroups.length == 0) {
							/** push the current user, as it was published with old approach **/
							/** with new approach, dashboard was published to only groups, so current user will not be pushed **/
							//$scope.modal.publishDbConfig.publishTo.users.push( $scope.modal.publishDbConfig.currentUser);
							/** DAS-350:commenting above line for unpublish issue**/ 
							$scope.modal.publishDbConfig.disablepublish = true;
						}		
					}
					
					/** new Dashboard published to some groups **/
					if (data.userGroups.assignedUserGroups) {
						for(var j1=0; j1<data.userGroups.assignedUserGroups.length; j1++){
							data.userGroups.assignedUserGroups[j1].published = true;
							$scope.modal.publishDbConfig.publishTo.userGroupsList.push( data.userGroups.assignedUserGroups[j1] );
							$scope.modal.publishDbConfig.publishNew.userGroupsList.push( data.userGroups.assignedUserGroups[j1] );
						}
					}
					if (data.userGroups.excludeUsers) {
						for(var k=0; k<data.userGroups.excludeUsers.length; k++){
							data.userGroups.excludeUsers[k].published = true;
							$scope.modal.publishDbConfig.publishTo.excludeUsers.push( data.userGroups.excludeUsers[k] );
						}
					}
				}
				
				/** publish new dashboard **/
				if(!IsBoolean($scope.modal.publishDbConfig.currentUser.published)){
					$scope.modal.publishDbConfig.publishNew.users.push( $scope.modal.publishDbConfig.currentUser );
				}
				if (data.userGroups.users) {
					for(var i=0; i<data.userGroups.users.length; i++){
						data.userGroups.users[i].published = false;
						$scope.modal.publishDbConfig.publishNew.users.push( data.userGroups.users[i] );
					}
				}
				if (data.userGroups.userGroupsList) {
					for(var j=0; j<data.userGroups.userGroupsList.length; j++){
						data.userGroups.userGroupsList[j].published = false;
						$scope.modal.publishDbConfig.publishNew.userGroupsList.push( data.userGroups.userGroupsList[j] );
					}
				}
				$scope.modal.publishDbConfig.publishNew.excludeUsers = [];
				
				if (sCallback && typeof(sCallback === "function")) {
					sCallback(data);
				}
				ServiceFactory.hideLoader();
			},
			requestFailedFn = function (data, success) {
				if (data.DesignerResp.success) {
					if (eCallback && typeof(eCallback === "function")) {
						eCallback(data);
					}
				}
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
		};
		/** @description  get the user and group list **/
		$scope.getExcludeUsersFromGroupList = function() {
		    var groupIds = [];
		    $scope.modal.publishDbConfig.publishNew.userGroupsList.map(function(obj) {
		        if (IsBoolean(obj.published)) {
		            groupIds.push(obj.id);
		        }
		    });
		    var
		        REQ_URL = req_url.designer["getusersfromgroups"],
		        REQ_DATA = {
		            groupIds: groupIds
		        },
		        requestSuccessFn = function(data, success) {
		            ServiceFactory.hideLoader();
		            if (data.userGroups.assignedUsers) {
		                var j = 0;
		                for (var i = 0; i < data.userGroups.assignedUsers.length; i++) {
		                    var excludedUser = DesignerUtil.prototype.findInArray($scope.modal.publishDbConfig.publishNew.excludeUsers, "id", data.userGroups.assignedUsers[i].id);
		                    if (excludedUser && IsBoolean(excludedUser.published)) {
		                        data.userGroups.assignedUsers[i].published = true;
		                        j++;
		                    } else {
		                        data.userGroups.assignedUsers[i].published = false;
		                    }
		                }
		                $scope.modal.publishDbConfig.publishNew.excludeUsers = data.userGroups.assignedUsers;
		                $scope.$apply();
		            }
		            excludeUserCount =  j;
		            /** DAS-1066**/
		            if($scope.modal.publishDbConfig.publishAction == "PUB_NEW"){
						$('md-tab-item')[2].childNodes[0].data = "Exclude Users (" + excludeUserCount + ")";
					}
		           // $('md-tab-item')[2].childNodes[0].data = "Exclude Users (" + excludeUserCount + ")";
		        };
		    ServiceFactory.showLoader();
		    BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn);
		};
		$scope.getAllExcludeUsersFromGroupList = function() {
		    var groupIds = [];
		    $scope.modal.publishDbConfig.publishNew.userGroupsList.map(function(obj) {
		        if (IsBoolean(obj.published)) {
		            groupIds.push(obj.id);
		        }
		    });
		    var
		        REQ_URL = "/document/getAllUsersFromGroups",
		        REQ_DATA = {
		            groupIds: groupIds
		        },
		        requestSuccessFn = function(data, success) {
		            ServiceFactory.hideLoader();
		            if (data.userGroups.assignedUsers) {
		                var j = 0;
		                for (var i = 0; i < data.userGroups.assignedUsers.length; i++) {
		                    var excludedUser = DesignerUtil.prototype.findInArray($scope.modal.publishDbConfig.publishNew.excludeUsers, "id", data.userGroups.assignedUsers[i].id);
		                    if (excludedUser && IsBoolean(excludedUser.published)) {
		                        data.userGroups.assignedUsers[i].published = true;
		                        j++;
		                    } else {
		                        data.userGroups.assignedUsers[i].published = false;
		                    }
		                }
		                $scope.modal.publishDbConfig.publishNew.excludeUsers = data.userGroups.assignedUsers;
		                $scope.$apply();
		            }
		            excludeUserCount =  j;
		            /** DAS-1066**/
		            if($scope.modal.publishDbConfig.publishAction == "PUB_NEW"){
						$('md-tab-item')[2].childNodes[0].data = "Exclude Users (" + excludeUserCount + ")";
					}
		           // $('md-tab-item')[2].childNodes[0].data = "Exclude Users (" + excludeUserCount + ")";
		        };
		    ServiceFactory.showLoader();
		    BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn);
		};
		/**DAS-674 update folderName value to show/hide userlist*/
		$scope.getSelectedFolderValue = function(folderId,iJson){
		    // Find the selected option by comparing its value
		    if(folderId == ""){
				$scope.modal.publishDbConfig.selectedFolderName = "My Documents";
			}else{
				if(iJson){
					angular.forEach(iJson.publishedVersions, function(docid) {
						if (docid.id === iJson.publishDocId) {
							folderId = docid.publishFolder;
						}
					});
				}
				angular.forEach($scope.modal.publishDbConfig.currentUser.rootFolders, function(ws) {
					if (ws.id === folderId) {
						// Access the text of the selected option
						$scope.modal.publishDbConfig.selectedFolderName = ws.title;
					}
				});
			}

		}
		/**@description get published folder name from publishedVersion array folderId */
		$scope.getPublishedFolderName = function(folderId){
		    // Find the selected option by comparing its value
		    var foldername ="My Documents";
		    if(folderId != undefined){
				angular.forEach($scope.modal.publishDbConfig.currentUser.rootFolders, function (ws) {
		      if (ws.id === folderId) {
		        // Access the text of the selected option
		        foldername = ws.title;
		      }
		    });
			}
		    return foldername;
		}
		$scope.getUserGroupsForVersion = function(){
			$scope.modal.publishDbConfig.publishTo.users = [];
			$scope.modal.publishDbConfig.publishTo.userGroupsList = [];
			$scope.modal.publishDbConfig.publishTo.excludeUsers = [];
			$scope.modal.publishDbConfig.publishNew.users = [];
			$scope.modal.publishDbConfig.publishNew.userGroupsList = [];
			var
			REQ_URL = req_url.designer["loadPrivilege"],
			REQ_DATA = { treeID : $scope.modal.publishDbConfig.pubDocId },
			requestSuccessFn = function (data, success) {
				/**DAS-674 get current selected shared folder and update userlist window*/
				var sharedFolderId = ";"
				if ($scope.modal.publishDbConfig.publishAction !== "PUB_NEW") {
				var sPVIndex = $scope.modal.publishDbConfig.publishedVersions.findIndex(function(item) {return item.id === $scope.modal.publishDbConfig.pubDocId;});
				var sharedFolderId = $scope.modal.publishDbConfig.publishedVersions[sPVIndex].publishFolder || "";
				}
				$scope.getSelectedFolderValue(sharedFolderId);
				
				if($scope.modal.publishDbConfig.pubDocId !== "" && $scope.modal.publishDbConfig.pubDocId !== 0){
					/**DAS-674 */
					if (data.userGroups.assignedUsers) {
					    for (var i1 = 0; i1 < data.userGroups.assignedUsers.length; i1++) {
					        data.userGroups.assignedUsers[i1].published = true;
					        $scope.modal.publishDbConfig.publishTo.users.push(data.userGroups.assignedUsers[i1]);
					        $scope.modal.publishDbConfig.publishNew.users.push(data.userGroups.assignedUsers[i1]);
					        if ($scope.modal.publishDbConfig.currentUser.id == data.userGroups.assignedUsers[i1].id) {
					            $scope.modal.publishDbConfig.currentUser.published = true;
					        }
					    }
					}
				    if(!IsBoolean($scope.modal.publishDbConfig.currentUser.published))
					    $scope.modal.publishDbConfig.publishNew.users.push($scope.modal.publishDbConfig.currentUser);
					
					if (data.userGroups.assignedUsers && data.userGroups.assignedUsers.length == 0) {
						 //Old published dashboard when switched from other version, should display current user
						var isLegacyPubVersionAvailable = DesignerUtil.prototype.findInArray($scope.modal.publishDbConfig.publishedVersions, "legacyPubVersion", true); 
						if(isLegacyPubVersionAvailable){
						//	 push current user if old dashboard published to current user
							$scope.modal.publishDbConfig.publishTo.users.push($scope.modal.publishDbConfig.currentUser );
						}
					}                     
					
					if (data.userGroups.assignedUserGroups) {
						for(var j1=0; j1<data.userGroups.assignedUserGroups.length; j1++){
							data.userGroups.assignedUserGroups[j1].published = true;
							$scope.modal.publishDbConfig.publishTo.userGroupsList.push( data.userGroups.assignedUserGroups[j1] );
							$scope.modal.publishDbConfig.publishNew.userGroupsList.push( data.userGroups.assignedUserGroups[j1] );
						}
					}
					if (data.userGroups.excludeUsers) {
						for(var k=0; k<data.userGroups.excludeUsers.length; k++){
							data.userGroups.excludeUsers[k].published = true;
							$scope.modal.publishDbConfig.publishTo.excludeUsers.push( data.userGroups.excludeUsers[k] );
							$scope.modal.publishDbConfig.publishNew.excludeUsers.push( data.userGroups.excludeUsers[k] );
						}
					}
					if (data.userGroups.users){
						for(var i2=0; i2<data.userGroups.users.length; i2++){
							$scope.modal.publishDbConfig.publishNew.users.push( data.userGroups.users[i2] );
						}
					}	
					if (data.userGroups.userGroupsList){
						for(var j2=0; j2<data.userGroups.userGroupsList.length; j2++){
							$scope.modal.publishDbConfig.publishNew.userGroupsList.push( data.userGroups.userGroupsList[j2] );
						}
					}
					$scope.getExcludeUsersFromGroupList();
					$scope.onActionChange();
				}
				if ($scope.modal.publishDbConfig.publishAction !== "PUB_NEW") {
				    if (data.userGroups.assignedUsers.length == 0 && data.userGroups.assignedUserGroups.length == 0) {
				        $scope.modal.publishDbConfig.disablepublish = true;
				    } else {
				        $scope.modal.publishDbConfig.disablepublish = false;
				    }
				} else {
				    $scope.modal.publishDbConfig.disablepublish = false;
				}
				var versionObj = DesignerUtil.prototype.findInArray($scope.modal.publishDbConfig.publishedVersions, "id", $scope.modal.publishDbConfig.pubDocId);
				if(versionObj){
					$scope.modal.publishDbConfig.name = $scope.modal.replaceSpecialCharWithUnderscore(versionObj.name || $scope.modal.publishDbConfig.name);
					$scope.modal.publishDbConfig.description = versionObj.description || $scope.modal.publishDbConfig.description;					
				}
				$scope.$apply();
				ServiceFactory.hideLoader();
			},
			requestFailedFn = function (data, success) {
				$scope.$apply();
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
		}
		/** @description on changing the Action from PublishDashboard popup **/
		var userListCount = 0;
		var userGroupListCount = 0;
		var excludeUserCount = 0;
		$scope.onActionChange = function(){
			var uListCount = 0;
			var ugListCount = 0;
			var exListCount = 0;
			if($scope.modal.publishDbConfig.publishTo.users.length > 0){
				uListCount = $scope.modal.publishDbConfig.publishTo.users.length;
			}
			userListCount = uListCount;
			if ($scope.modal.publishDbConfig.publishTo.userGroupsList.length > 0) {
				ugListCount = $scope.modal.publishDbConfig.publishTo.userGroupsList.length;
			}
			userGroupListCount = ugListCount;
			if($scope.modal.publishDbConfig.publishTo.excludeUsers.length > 0){
				exListCount = $scope.modal.publishDbConfig.publishTo.excludeUsers.length;
			}
			excludeUserCount = exListCount;
			$('md-tab-item')[0].childNodes[0].data = "Users (" + uListCount + ")";
			$('md-tab-item')[1].childNodes[0].data = "User Groups (" + ugListCount + ")";
			$('md-tab-item')[2].childNodes[0].data = "Exclude Users (" + exListCount + ")";
			$('md-tab-item')[2].childNodes[0].data = "Exclude Users (" + exListCount + ")";
		}
		/** @description on checking/unchecking the checkbox from PublishDashboard popup **/
		$scope.onSelectDeselectUser = function(id, isChecked){
			if($scope.modal.publishDbConfig.publishAction === "PUB_NEW" && !($scope.modal.publishDbConfig.alreadyPublished)){
				var userId = id;
				var checked = isChecked;
				$scope.onSelectDeselectUserPublishNew(userId, checked);
			}else{
				if($('.md-active')[0].childNodes[0].data.includes("Users") && !$('.md-active')[0].childNodes[0].data.includes("Exclude Users")){
					if(isChecked){
						for(var count = 0; count < $scope.modal.publishDbConfig.publishNew.users.length; count++){
							if($scope.modal.publishDbConfig.publishNew.users[count].id === id){
								userListCount++;
							}
						}
						$('md-tab-item')[0].childNodes[0].data = "Users (" + userListCount + ")";
					}else if(!isChecked){
						for(var uCount = 0; uCount < $scope.modal.publishDbConfig.publishNew.users.length; uCount++){
							if($scope.modal.publishDbConfig.publishNew.users[uCount].id === id){
								userListCount--;
							}
						}
						$('md-tab-item')[0].childNodes[0].data = "Users (" + userListCount + ")";
					}
				}
				if($('.md-active')[0].childNodes[0].data.includes("User Groups")){
					$scope.getExcludeUsersFromGroupList();
					if(isChecked){
						for(var count = 0; count < $scope.modal.publishDbConfig.publishNew.userGroupsList.length; count++){
							if($scope.modal.publishDbConfig.publishNew.userGroupsList[count].id === id){
								userGroupListCount++;
							}
						}
						$('md-tab-item')[1].childNodes[0].data = "User Groups (" + userGroupListCount + ")";
					}else if(!isChecked){
						for(var count = 0; count < $scope.modal.publishDbConfig.publishNew.userGroupsList.length; count++){
							if($scope.modal.publishDbConfig.publishNew.userGroupsList[count].id === id){
								userGroupListCount--;
							}
						}
						$('md-tab-item')[1].childNodes[0].data = "User Groups (" + userGroupListCount + ")";
					}
				}
				if($('.md-active')[0].childNodes[0].data.includes("Exclude Users")){
					if(isChecked){
						for(var count = 0; count < $scope.modal.publishDbConfig.publishNew.excludeUsers.length; count++){
							if($scope.modal.publishDbConfig.publishNew.excludeUsers[count].id === id){
								excludeUserCount++;
							}
						}
						$('md-tab-item')[2].childNodes[0].data = "Exclude Users (" + excludeUserCount + ")";
					}else if(!isChecked){
						for(var count = 0; count < $scope.modal.publishDbConfig.publishNew.excludeUsers.length; count++){
							if($scope.modal.publishDbConfig.publishNew.excludeUsers[count].id === id){
								excludeUserCount--;
							}
						}
						$('md-tab-item')[2].childNodes[0].data = "Exclude Users (" + excludeUserCount + ")";
					}
				}
			}
		}
		/** @description on checking/unchecking the checkbox from PublishDashboard popup for Publish as New **/
		$scope.onSelectDeselectUserPublishNew = function(userid, checked){
			if($('.md-active')[0].childNodes[0].data.includes("Users") && !$('.md-active')[0].childNodes[0].data.includes("Exclude Users")){
				if(checked){
					for(var count = 0; count < $scope.modal.publishDbConfig.publishNew.users.length; count++){
						if($scope.modal.publishDbConfig.publishNew.users[count].id === userid){
							userListCount++;
						}
					}
					$('md-tab-item')[0].childNodes[0].data = "Users (" + userListCount + ")";
				}else if(!checked){
					for(var uCount = 0; uCount < $scope.modal.publishDbConfig.publishNew.users.length; uCount++){
						if($scope.modal.publishDbConfig.publishNew.users[uCount].id === userid){
							userListCount--;
						}
					}
					$('md-tab-item')[0].childNodes[0].data = "Users (" + userListCount + ")";
				}
			}
			if($('.md-active')[0].childNodes[0].data.includes("User Groups")){
				$scope.getExcludeUsersFromGroupList();
				if(checked){
					for(var count = 0; count < $scope.modal.publishDbConfig.publishNew.userGroupsList.length; count++){
						if($scope.modal.publishDbConfig.publishNew.userGroupsList[count].id === userid){
							userGroupListCount++;
						}
					}
					$('md-tab-item')[1].childNodes[0].data = "User Groups (" + userGroupListCount + ")";
				}else if(!checked){
					for(var count = 0; count < $scope.modal.publishDbConfig.publishNew.userGroupsList.length; count++){
						if($scope.modal.publishDbConfig.publishNew.userGroupsList[count].id === userid){
							userGroupListCount--;
						}
					}
					$('md-tab-item')[1].childNodes[0].data = "User Groups (" + userGroupListCount + ")";
				}
			}
			if($('.md-active')[0].childNodes[0].data.includes("Exclude Users")){
				if(checked){
					for(var count = 0; count < $scope.modal.publishDbConfig.publishNew.excludeUsers.length; count++){
						if($scope.modal.publishDbConfig.publishNew.excludeUsers[count].id === userid){
							excludeUserCount++;
						}
					}
					$('md-tab-item')[2].childNodes[0].data = "Exclude Users (" + excludeUserCount + ")";
				}else if(!checked){
					for(var count = 0; count < $scope.modal.publishDbConfig.publishNew.excludeUsers.length; count++){
						if($scope.modal.publishDbConfig.publishNew.excludeUsers[count].id === userid){
							excludeUserCount--;
						}
					}
					$('md-tab-item')[2].childNodes[0].data = "Exclude Users (" + excludeUserCount + ")";
				}
			}
		}
		/*VCS Push*/
		
		$scope.updateVcsExport = function () {
			var commitMessage = $scope.modal.vcsexportconfig.commitMessage;
			var pushType = $scope.modal.vcsexportconfig.pushItem;						
			if(commitMessage.trim() != ""){
				ServiceFactory.showLoader();
				
				if(pushType=="gitmigration")
					$scope.updateVcsGitExport();
				else
					$scope.updateVcsPushExport();
					
			}else{
				ServiceFactory.showNotification("Commit Message cannot be empty", "alert-danger", 3000);
			}
		
		};
		$scope.updateVcsPushExport = function () {
			var commitMessage = $scope.modal.vcsexportconfig.commitMessage;			
			var spaceKey = window.sessionStorage.getItem('bvz_spacekey');
			var token = window.sessionStorage.getItem('bvz_token');
			var docId =  $scope.modal.vcsexportconfig.dashboardId;
			var userid = window.sessionStorage.getItem('bvz_userid');

			var requrl = "/bizviz/pluginService";
			var data={
				    "dashId": docId,
				    "commitMsg": commitMessage,
				    "module": "Dashboard"
			};
			var reqdata = {
					    "data": data,
					    "spacekey": spaceKey,
					    "consumerName":"BVZGIT",
					    "serviceName":"exportDashboardForVersion",
					    "isSecure":true
					    
			};
			requestSuccessFn = function (data) {
				if (data.success) {
					ServiceFactory.showNotification("Dashboard has been pushed successfully", "alert-success", 3000);
				}else{
					ServiceFactory.showNotification(data.errorMessage, "alert-danger", 3000);
				}
				ServiceFactory.hideLoader();
			},
			requestFailedFn = function (data, success) {
				ServiceFactory.showNotification("Unsuccessfull export", "alert-danger", 3000);
				ServiceFactory.hideLoader();
			};
			BIZVIZ.SDK.secureRequest(requrl, reqdata, requestSuccessFn, requestFailedFn);		
		};
		/*function to call gitexport based on vcs push type @gitmigration*/
		$scope.updateVcsGitExport = function () {
			var commitMessage = $scope.modal.vcsexportconfig.commitMessage;			
			var spaceKey = window.sessionStorage.getItem('bvz_spacekey');
			var token = window.sessionStorage.getItem('bvz_token');
			var docId =  $scope.modal.vcsexportconfig.dashboardId;
			var userid = window.sessionStorage.getItem('bvz_userid');

			var requrl = "/workspace/exportDashboardGitMigration";
			var reqdata = {
					    "spacekey": spaceKey,
					    "dashID": docId,
					    "commitMessage": commitMessage,
					    "module": "Dashboard"				    
			};
			requestSuccessFn = function (data) {
				if (data.success) {
					ServiceFactory.showNotification("Dashboard has been exported successfully", "alert-success", 3000);
				}else{
					ServiceFactory.showNotification(data.errorMessage, "alert-danger", 3000);
				}
				ServiceFactory.hideLoader();
			},
			requestFailedFn = function (data, success) {
				ServiceFactory.showNotification("Unsuccessfull export", "alert-danger", 3000);
				ServiceFactory.hideLoader();
			};
			
				BIZVIZ.SDK.secureRequest(requrl, reqdata, requestSuccessFn, requestFailedFn);
		};
		
		$scope.updateGitExport = function () {
			var commitMessage = $scope.modal.gitexportconfig.commitMessage;
			
			var spaceKey = window.sessionStorage.getItem('bvz_spacekey');
			var token = window.sessionStorage.getItem('bvz_token');
			var docId =  $scope.modal.gitexportconfig.dashboardId;
			var userid = window.sessionStorage.getItem('bvz_userid');
			
			var requrl = "/workspace/exportDashboard/";
			var reqdata = {
					    "dashID": docId,
					    "commitMessage": commitMessage,
					    "module": "Dashboard",
					    "spacekey": spaceKey
			};
					
			requestSuccessFn = function (success) {
				if (success) {
					ServiceFactory.showNotification("File has been exported successfully", "alert-success", 3000);
				}else{
					ServiceFactory.showNotification("Unsuccessfull export", "alert-danger", 3000);
				}
				ServiceFactory.hideLoader();
			},
			requestFailedFn = function (data, success) {
				ServiceFactory.showNotification("Unsuccessfull export", "alert-danger", 3000);
				ServiceFactory.hideLoader();
			};
			
			if(commitMessage.trim() != ""){
				ServiceFactory.showLoader();
				BIZVIZ.SDK.secureRequest(requrl, reqdata, requestSuccessFn, requestFailedFn);
			}else{
				ServiceFactory.showNotification("Commit Message cannot be empty", "alert-danger", 3000);
			}
			
			/*
			if(commitMessage.trim() != ""){
				var spaceKey = window.sessionStorage.getItem('bvz_spacekey');
				var token = window.sessionStorage.getItem('bvz_token');
				var docId =  $scope.modal.gitexportconfig.dashboardId;
				var userid = window.sessionStorage.getItem('bvz_userid');
				 //if($scope.isSFTPConfigured){
					var dwdurl;
					dwdurl = "http"
						+ (bizviz_rest_cfg.https ? "s" : "")
						+ "://"
						+ bizviz_rest_cfg.domain
						+ (bizviz_rest_cfg.port == "" ? "" : ":"
						+ bizviz_rest_cfg.port)
						+ "/cxf"
						+ "/exportDashboardGit"
						+ "?dashID="
						+ docId
						+ "&spaceKey="
						+ spaceKey
						+ "&userid="
						+ userid
						+ "&commitMessage="
						+ commitMessage;
					
					var newwindow = window.open(dwdurl, "_blank");

					$timeout(function(){
						newwindow.close();
						ServiceFactory.showNotification("File has been exported successfully", "alert-success", 3000);
					}, 3000);
			} else {
					ServiceFactory.showNotification("Commit Message cannot be empty", "alert-danger", 3000);
			}*/
			$scope.hideModelPopup('gitExportModalDialog');				
					//ServiceFactory.showNotification("Your File has been downloaded in SFTP server", "alert-success", 3000);
					//UtilFactory.showAlert("Your File has been downloaded in SFTP server","info");
				// }else{
				//	 UtilFactory.showAlert("Migration SFTP settings are not Configured","error");
				//}
		};
		
		/** @description  get the user and group list **/
		$scope.publishDashboardToUserGroups = function () {
			if (!$scope.modal.publishDbConfig.dashboardInfo){
				return false;
			}else{
				/** Add Current user to the top of list for publishing option **/
				var assignedUserGroupRecords = [],
				assignedUsers = [],
				excludeUserRecords = [];
				
				if($scope.modal.publishDbConfig.publishAction == "PUB_OVERRIDE"){
					$scope.modal.publishDbConfig.publishTo.userGroupsList.map(function(obj){
						if(IsBoolean(obj.published)){
							assignedUserGroupRecords.push(obj.id);
						}
					});
					$scope.modal.publishDbConfig.publishTo.users.map(function(obj){
						if(IsBoolean(obj.published)){
							assignedUsers.push(obj.id);
						}
					});
					$scope.modal.publishDbConfig.publishTo.excludeUsers.map(function(obj){
						if(IsBoolean(obj.published)){
							excludeUserRecords.push(obj.id);
						}
					});
				}else{
					$scope.modal.publishDbConfig.publishNew.userGroupsList.map(function(obj){
						if(IsBoolean(obj.published)){
							assignedUserGroupRecords.push(obj.id);
						}
					});
					$scope.modal.publishDbConfig.publishNew.users.map(function(obj){
						if(IsBoolean(obj.published)){
							assignedUsers.push(obj.id);
						}
					});
					$scope.modal.publishDbConfig.publishNew.excludeUsers.map(function(obj){
						if(IsBoolean(obj.published)){
							excludeUserRecords.push(obj.id);
						}
					});
				}
				var
				dbJsonObj = convertStringToJson($scope.modal.publishDbConfig.dashboardJson),
				dbObj = dbJsonObj["dashboardJson"]["Dashboard"],
				publicFilters = [];//getPublicFilters(dbObj);
				hasMobileView = ((dbObj.MobileLayout && dbObj.MobileLayout.Object.length > 0) ? 1 : 0);
				/** update saved layout type on publish for mobile view **/
				dbObj.layoutType = "AbsoluteLayout";
				var isReportBurst = (dbObj.enableReportBurst === undefined || IsBoolean(!dbObj.enableReportBurst)) ? "0" : "1";
				
				var pubDocId = ($scope.modal.publishDbConfig.publishAction == "PUB_OVERRIDE") ? ($scope.modal.publishDbConfig.pubDocId || 0) : 0;
				
				/*DAS-674 check if shared folder is public folder then disable user window assign default cureent user in assignedUser array*/
				//var folderId = ($scope.modal.publishDbConfig.publishAction == "PUB_OVERRIDE")?$scope.modal.publishDbConfig.publishToFolderId:$scope.modal.publishDbConfig.publishToFolder;

				//DAS-944 Dashboard -Publish pop-up issue
				var docId = $scope.modal.publishDbConfig.pubDocId;
				if ($scope.modal.publishDbConfig.publishAction == "PUB_OVERRIDE") {
					angular.forEach($scope.modal.publishDbConfig.publishedVersions, function(docid) {
						if (docid.id === docId) {
							var folderId = docid.publishFolder;
						}
					});
				}else{
					var folderId = $scope.modal.publishDbConfig.publishToFolder
				}
				 var foldername="";
					for(var i=0; i<$scope.modal.publishDbConfig.currentUser.rootFolders.length; i++)
					{
						if(folderId == $scope.modal.publishDbConfig.currentUser.rootFolders[i].id){
							foldername = $scope.modal.publishDbConfig.currentUser.rootFolders[i].title;
						}
					}
				if(foldername == "Public Documents"){
					/**CP-4268  empty userlist */
					/* if user first select mydocumnet and slecte user and then change to public documents */
					assignedUserGroupRecords = [];
					assignedUsers = [];
					excludeUserRecords = [];
					if (assignedUsers.indexOf($scope.modal.publishDbConfig.currentUser.id) !== -1) {
						    //"user exists in the array .do nothing
						}else{
							assignedUsers.push($scope.modal.publishDbConfig.currentUser.id);
						}				
				}
				var		
				REQ_URL = req_url.designer["saveDocuments"],
				REQ_DATA = {
					assignedUserGroupRecords: assignedUserGroupRecords,
					assignedUsers: assignedUsers,
					excludeUserRecords: excludeUserRecords,
					contentId: pubDocId,
					isReportBurst : isReportBurst,
					globalFilter : publicFilters,	
					dashboardtype: "2", 
					imagename: "dashboard.png",
					position: "0", 
					type: "file", 
					originalfilename: $scope.modal.publishDbConfig.name + ".bvzx",
					title: $scope.modal.publishDbConfig.name, 
					description: $scope.modal.publishDbConfig.description,
					dependencyDetails: JSON.stringify($scope.findUsedQueryServiceIDs(dbObj)),
					mobileViewVal: hasMobileView,
					
					file: JSON.stringify({
						Niv: { Dashboard: dbObj }
					}),
					
					width: dbObj.AbsoluteLayout.width, 
					height: dbObj.AbsoluteLayout.height
				},
				requestSuccessFn = function (data, success) {
					if (data && data.trees && data.trees.success) {
						ServiceFactory.showNotification("Dashboard has been published", "alert-success", 3000);
						$scope.modal.publishDbConfig.publishTime = getNumericTimeStamp();
						$scope.updatePublishedDetailsAndSaveDashboard(dbJsonObj, data);
					} else {
						ServiceFactory.showNotification("Failed to publish dashboard", "alert-danger", 3000);
					}
					ServiceFactory.hideLoader();
				},
				requestFailedFn = function (data, success) {
					ServiceFactory.showNotification("Failed to publish dashboard", "alert-danger", 3000);
					ServiceFactory.hideLoader();
				};
				
				if (assignedUsers.length > 0 || assignedUserGroupRecords.length > 0) {
					/* DAS-130:show err message when publish to empty group */
				    if ($scope.modal.publishDbConfig.publishAction != "PUB_OVERRIDE" && (assignedUsers.length == 0 && assignedUserGroupRecords.length > 0 && $scope.modal.publishDbConfig.publishNew.excludeUsers.length == 0)) {
				        ServiceFactory.showNotification("Please select a group having user", "alert-warning", 3000);
				    } else {
				        ServiceFactory.showLoader();
				        if($scope.modal.publishDbConfig.publishToFolder != ""){
						REQ_DATA["parentid"]= $scope.modal.publishDbConfig.publishToFolder;
						}
				        BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
				    }
				} else {
				    ServiceFactory.showNotification("Please select atleast one user or group", "alert-warning", 3000);
				}
			}
			$scope.hideModelPopup('publishModalDialog');
		};
		/** @description update the dashboard json with publish details **/
		$scope.updatePublishedDetailsAndSaveDashboard = function(jsn, data) {
		    if (jsn.infoJson == null && jsn.dashboardJson.Dashboard.versionDetails != undefined) {
		        jsn.dashboardJson.Dashboard.versionDetails.publishDocId = data.trees.tree.id;
		        jsn.dashboardJson.Dashboard.versionDetails.publishedBy = ServiceFactory.AUTH_INFO.get("userID");
		        jsn.dashboardJson.Dashboard.versionDetails.publishedOn = $scope.modal.publishDbConfig.publishTime;
		        jsn.dashboardJson.Dashboard.versionDetails.publishedAt = ServiceFactory.AUTH_INFO.get("spacekey");
		        /** Store published Version **/
		        if (jsn.dashboardJson.Dashboard.versionDetails.publishedVersions == undefined) {
		            jsn.dashboardJson.Dashboard.versionDetails.publishedVersions = [];
		        }

		        /** Old published dashboard should be added into version array and save to workspace table **/
		        if ($scope.modal.publishDbConfig.legacyPubVersion !== "") {
		            var isLegacyPubVersionAvailable = DesignerUtil.prototype.findInArray(jsn.dashboardJson.Dashboard.versionDetails.publishedVersions, "id", $scope.modal.publishDbConfig.legacyPubVersion.id);
		            if (!isLegacyPubVersionAvailable) {
		                jsn.dashboardJson.Dashboard.versionDetails.publishedVersions.push($scope.modal.publishDbConfig.legacyPubVersion);
		            }
		        }

		        var isContentIdAvailable = DesignerUtil.prototype.findInArray(jsn.dashboardJson.Dashboard.versionDetails.publishedVersions, "id", data.trees.tree.id);
		        if (!isContentIdAvailable) {
		            if (jsn.infoJson == null) {
		                jsn.infoJson = {};
		                jsn.infoJson = JSON.parse(JSON.stringify(jsn.dashboardJson.Dashboard.versionDetails));
		                /**DAS-674 */
		                if($scope.modal.publishDbConfig.publishToFolder !=""){
						jsn.infoJson.publishFolderId = $scope.modal.publishDbConfig.publishToFolder;
						}
		                jsn.infoJson.publishedVersions.push({
		                    id: data.trees.tree.id,
		                    name: $scope.modal.publishDbConfig.name,
		                    description: $scope.modal.publishDbConfig.description,
		                    publishTime: $scope.modal.publishDbConfig.publishTime,
		                    publishFolder: $scope.modal.publishDbConfig.publishToFolder,
		                    legacyPubVersion: false
		                });
		                jsn.dashboardJson.Dashboard.versionDetails.publishedVersions = [];
		            } else {
		                jsn.infoJson.publishedVersions.push({
		                    id: data.trees.tree.id,
		                    name: $scope.modal.publishDbConfig.name,
		                    description: $scope.modal.publishDbConfig.description,
		                    publishTime: $scope.modal.publishDbConfig.publishTime,
		                    publishFolder: $scope.modal.publishDbConfig.publishToFolder,
		                    legacyPubVersion: false
		                });
		            }
		            /*jsn.dashboardJson.Dashboard.versionDetails.publishedVersions.push( {
		            	id: data.trees.tree.id, 
		            	name: $scope.modal.publishDbConfig.name, 
		            	description: $scope.modal.publishDbConfig.description, 
		            	publishTime: $scope.modal.publishDbConfig.publishTime,
		            	legacyPubVersion: false
		            });*/
		        } else {
		            isContentIdAvailable.description = $scope.modal.publishDbConfig.description;
		            isContentIdAvailable.publishTime = $scope.modal.publishDbConfig.publishTime;
		        }
		        //$scope.saveDashboardInDB(jsn.dashboardJson.Dashboard.workspaceId, jsn.dashboardJson.Dashboard.backendId, jsn.dashboardJson.Dashboard.name, jsn.dashboardJson, undefined, true);
		        $scope.saveDashboardInDB(jsn.dashboardJson.Dashboard.workspaceId, jsn.dashboardJson.Dashboard.backendId, jsn.dashboardJson.Dashboard.name, jsn.dashboardJson, undefined, true, jsn.infoJson, true);
		    } else {
		        if($scope.modal.publishDbConfig.publishToFolder !=""){
					jsn.infoJson.publishFolderId = $scope.modal.publishDbConfig.publishToFolder;
				}
		        jsn.infoJson.publishDocId = data.trees.tree.id;
		        jsn.infoJson.publishedBy = ServiceFactory.AUTH_INFO.get("userID");
		        jsn.infoJson.publishedOn = $scope.modal.publishDbConfig.publishTime;
		        jsn.infoJson.publishedAt = ServiceFactory.AUTH_INFO.get("spacekey");
		        jsn.infoJson.publishFolder = $scope.modal.publishDbConfig.publishToFolder;
		        /** Store published Version **/
		        if (jsn.infoJson.publishedVersions == undefined) {
		            jsn.infoJson.publishedVersions = [];
		        }

		        /** Old published dashboard should be added into version array and save to workspace table **/
		        if ($scope.modal.publishDbConfig.legacyPubVersion !== "") {
		            var isLegacyPubVersionAvailable = DesignerUtil.prototype.findInArray(jsn.infoJson.publishedVersions, "id", $scope.modal.publishDbConfig.legacyPubVersion.id);
		            if (!isLegacyPubVersionAvailable) {
		                jsn.infoJson.publishedVersions.push($scope.modal.publishDbConfig.legacyPubVersion);
		            }
		        }

		        var isContentIdAvailable = DesignerUtil.prototype.findInArray(jsn.infoJson.publishedVersions, "id", data.trees.tree.id);
		        if (!isContentIdAvailable) {
		            jsn.infoJson.publishedVersions.push({
		                id: data.trees.tree.id,
		                name: $scope.modal.publishDbConfig.name,
		                description: $scope.modal.publishDbConfig.description,
		                publishTime: $scope.modal.publishDbConfig.publishTime,
		                publishFolder: $scope.modal.publishDbConfig.publishToFolder,
		                legacyPubVersion: false
		            });
		        } else {
		            isContentIdAvailable.description = $scope.modal.publishDbConfig.description;
		            isContentIdAvailable.publishTime = $scope.modal.publishDbConfig.publishTime;
		        }
		        $scope.saveDashboardInDB(jsn.dashboardJson.Dashboard.workspaceId, jsn.dashboardJson.Dashboard.backendId, jsn.dashboardJson.Dashboard.name, jsn.dashboardJson, undefined, true, jsn.infoJson, true);
		        //$scope.saveDashboardInDB(jsn.dashboardJson.Dashboard.workspaceId, jsn.dashboardJson.Dashboard.backendId, jsn.dashboardJson.Dashboard.name, undefined, undefined, true, jsn.infoJson);
		    }
		};
		
		/** @description  get the dashboard from back end for the given ID **/
		$scope.getDashboardJsonFromServer = function (dId, sCallback, eCallback) {
			var
			REQ_URL = req_url.designer["openDashboard"],
			DES_PARAMS = { dashboardId : dId.toString() },
			REQ_DATA = { dashboardParameters : JSON.stringify(DES_PARAMS) },
			requestSuccessFn = function (data, success) {
				if (data.DesignerResp.success) {
					if (sCallback && typeof(sCallback === "function")) {
						sCallback(data);
					}
				}
				ServiceFactory.hideLoader();
			},
			requestFailedFn = function (data, success) {
				if (data.DesignerResp.success) {
					if (eCallback && typeof(eCallback === "function")) {
						eCallback(data);
					}
				}
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
		};
		
		/**
		 * @description - checks for the document to already published
		 * @param { number } docId - the document id which is going to be publish
		 * @param { function } sCallback - the success callback function
		 * @author EID-201
		 * */
		$scope.checkForAlreadyPublished = function (docId, sCallback) {
			var
			REQ_URL = req_url.designer["getDocumentInfoById"],
			REQ_DATA = { docId : docId || "0" },
			requestSuccessFn = function (data, success) {
				if (sCallback && typeof(sCallback === "function")) {
					sCallback(data);
				}
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn);
		};
		
		/** @description check publish status and show message **/
		$scope.showPublishDialog = function (data) {
			/** Adding parentId check also after change in response from portal **/
			if (data.trees.tree && data.trees.tree.parentId) {
				$scope.alreadyPublished = true;
				$scope.publishAction = "PUB_OVERRIDE";
				$scope.pubInfoMsg = "This dashboard is already published to \"" + data.trees.fileOrFolderPath + "\"";
				$scope.modal.selectedDirToPublish.id = data.trees.tree.parentId.id;
			} else {
				$scope.pubDocId = "0";
				$scope.alreadyPublished = false;
			}
			$scope.$apply();
			$scope.showModelPopup('publishModalDialog');
			$scope.setFocusOnInput("#publishModalDialog", "#dashboardName");
		};

		/** @description Will trigger publish call of backend **/
		$scope.publishToPortal = function (dashboardProperties) {
			if($scope.modal.publishDbConfig.name != "") {
				$scope.publishDashboard(dashboardProperties, $scope.drParams);
			} else {
				ServiceFactory.showNotification("Dashboard name can not be empty", "alert-danger", 3000);
			}
		};

		/** @description Publish service call **/
		$scope.publishDashboard = function (dashboardProperties, dashboardJson) {
			if (!dashboardProperties){
				return false;
			}else{
				var
				REQ_URL = req_url.designer["uploadDashboard"],
				pubDocId = $scope.publishAction === "PUB_OVERRIDE" ? $scope.pubDocId : "0",
				dbJsonObj = convertStringToJson(dashboardJson),
				dbObj = dbJsonObj["dashboardJson"]["Dashboard"],
				hasMobileView = ((dbObj.MobileLayout && dbObj.MobileLayout.Object.length > 0) ? 1 : 0);
				/* update saved layout type on publish portal for mobile view */
				dbObj.layoutType = "AbsoluteLayout";
				var
				usedQS = JSON.stringify($scope.findUsedQueryServiceIDs(dbObj)),
				FILE_OBJ = {
					Niv : { Dashboard : dbObj }
				},
				REQ_DATA = {
					parentid : $scope.modal.selectedDirToPublish.id,
					position : "0", type : "file", dashboardtype : "2", imagename : "dashboard.png",
					id : pubDocId,
					mobileViewVal: hasMobileView,
					title : $scope.modal.publishDbConfig.name, description : $scope.modal.publishDbConfig.description,
					width : dbObj.AbsoluteLayout.width, height : dbObj.AbsoluteLayout.height,
					file : JSON.stringify(FILE_OBJ),
					dependencyDetails : usedQS,
					originalfilename : $scope.modal.publishDbConfig.name + ".bvzx"
				},
				requestSuccessFn = function (data, success) {
					if (data && data.trees && data.trees.success) {
						ServiceFactory.showNotification("Dashboard has been published to \"" + $scope.modal.selectedDirToPublish.title + "\"", "alert-success", 3000);
						$scope.updatePublishedDetails(dbJsonObj, data);
					} else {
						ServiceFactory.showNotification("Failed to publish dashboard", "alert-danger", 3000);
					}
					ServiceFactory.hideLoader();
				};
				if (dbObj) {
					ServiceFactory.showLoader();
					BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA,requestSuccessFn);
				} else {
					ServiceFactory.showNotification("Invalid dashboard configuration", "alert-danger", 3000);
				}
			}
			$scope.hideModelPopup('publishModalDialog');
		};

		/** @description update the dashboard json with publish details **/
		$scope.updatePublishedDetails = function (jsn, data) {
			jsn.dashboardJson.Dashboard.versionDetails.publishDocId = data.trees.tree.id;
			jsn.dashboardJson.Dashboard.versionDetails.publishedBy = data.trees.tree.userId;
			jsn.dashboardJson.Dashboard.versionDetails.publishedOn = data.trees.tree.lastUpdatedDate;
			jsn.dashboardJson.Dashboard.versionDetails.publishedAt = data.trees.tree.spaceKey;
			/** Store published Version **/
			if(jsn.dashboardJson.Dashboard.versionDetails.publishedVersions == undefined){
				jsn.dashboardJson.Dashboard.versionDetails.publishedVersions = [];
			}
			var isContentIdAvailable = DesignerUtil.prototype.findInArray(jsn.dashboardJson.Dashboard.versionDetails.publishedVersions, "id", data.trees.tree.id); 
			if(!isContentIdAvailable){
				jsn.dashboardJson.Dashboard.versionDetails.publishedVersions.push( {
					id: data.trees.tree.id, 
					name: $scope.modal.publishDbConfig.name, 
					description: $scope.modal.publishDbConfig.description, 
					publishTime: $scope.modal.publishDbConfig.publishTime,
					legacyPubVersion: false
				});
			}else{
				isContentIdAvailable.description = $scope.modal.publishDbConfig.description;
				isContentIdAvailable.publishTime = $scope.modal.publishDbConfig.publishTime;
			}
			$scope.saveDashboardInDB(jsn.dashboardJson.Dashboard.workspaceId, jsn.dashboardJson.Dashboard.backendId, jsn.dashboardJson.Dashboard.name, jsn.dashboardJson, undefined, true);
		};

		/** @description will pass the services used in dashboard - useful for migration **/
		$scope.findUsedQueryServiceIDs = function (dashboardObj) {
			var list = [];
			var cTypes = {
				"bizviz": "dataService", "web": "dataService", 
				"bizvizDS": "dataStore", "ds": "dataStore", 
				"bizvizPA": "paService", 
				"bizvizWS": "webSocket", "ws": "webSocket"
			};
			angular.forEach(dashboardObj.DataProviders.DataURL, function (durl) {
				/** Connection which are of type dataService/ dataStore/ paService/ webSocket, those should be passed in dependency detail **/
				if (durl.Type !== "offline" && durl.selectedServiceID) {
					list.push({
						"queryServiceID" : ""+durl.selectedServiceID,
						"type" : cTypes[ (durl.serviceType ? durl.serviceType : durl.Type) ]
					});
				}
			});
			return list;
		};
		
		/** WORKSPACE MANAGEMENT **/
		/** @description checking the folder state **/
		$scope.isExpanded = function ($el) {
			return $el.hasClass("glyphicon-folder-open") ? true : false;
		};

		/** @description  **/
		$scope.handleCollapseExpand = function (_event) {
			var $targetEl = $(_event.target);
			$(_event.target.parentNode.parentNode.parentNode.childNodes[3]).slideToggle();
			if ($scope.isExpanded($targetEl)) {
				$targetEl.removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close");
			} else {
				$targetEl.removeClass("glyphicon-folder-close").addClass("glyphicon-folder-open");
			}
		};

		/** @description  **/
		$scope.setSelectedStyles = function ($event, item) {
			var lock = $scope.checkInAlreadyOpenedList(item.dashboardId);
			setSelectedStylesInTree($event.currentTarget, lock);
		};

		/** @description  **/
		$scope.checkInAlreadyOpenedList = function (id) {
			var flag = false;
			angular.forEach($scope.modal.dashboardTabs, function (dashboard) {
				if (dashboard.json.Dashboard.backendId.toString() == id.toString() ||
					dashboard.json.Dashboard.workspaceId.toString() == id.toString()) {
					flag = true;
				}
			});
			return flag;
		};
		

		/** @description Action on workspace or dashboard item **/
		$scope.updateDashboard = function ($event, dashboardItem, action) {
			$event.stopPropagation();
			if (!$scope.isInUse(dashboardItem.dashboardId)) {
				$scope.updateDashAction = action;
				$scope.isTrashAction = false;
				$scope.updateModalPopup($event, dashboardItem, action);
				$scope.showModelPopup('updateModalDialog');
				$scope.setFocusOnInput("#updateModalDialog", "#dashboardName");
			} else {
				ServiceFactory.showNotification("Workspace is in use", "alert-danger", 3000);
			}
		};
		$scope.openInfoDialog = function(dashboardItem) {
			var
			REQ_URL = "/designer/getWorkspaceDashboardInfoDetails/",
			REQ_DATA = { workspaceId : dashboardItem.dashboardId, spacekey: dashboardItem.spaceKey },
			requestSuccessFn = function (data, success) {
				var _success = data.wokspaceResp.success;
				if (_success) {
					var infodata = data.wokspaceResp.bizvizWorkspace;
					$scope.date = (infodata.lastUpdatedDate == 0 ? "NA" : infodata.lastUpdatedDate);
		    		$scope.name = (infodata.updatedBy == "" ? "NA" : infodata.updatedBy);
				} else {
					$scope.date = (dashboardItem.lastUpdatedDate == 0 ? "NA" : dashboardItem.lastUpdatedDate);
		    		$scope.name = (dashboardItem.updatedBy == "" ? "NA" : dashboardItem.updatedBy);
				}
				$scope.showModelPopup('infoDialog');
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn);
			/*
		    $scope.date = (dashboardItem.lastUpdatedDate == 0 ? "NA" : dashboardItem.lastUpdatedDate);
		    $scope.name = (dashboardItem.updatedBy == "" ? "NA" : dashboardItem.updatedBy);
		    */
		    
		};
		/** @description Remove the selected workspace from the list of all workspace **/
		$scope.filterSameWS = function(ws) {
		    if (!ws.isActive) {
		        return ws;
		    }
		};
		/** @description This function will check the specified workspace is open or not **/
		$scope.isInUse = function (wsId) {
			var openDashboards = $scope.modal.dashboardTabs,
			wsContains = $scope.modal.wsObj.wsNdb[wsId],
			odId = 0;
			if (wsContains) {
				for (var i = 0; i < openDashboards.length; i++) {
					odId = openDashboards[i].json.Dashboard.backendId;
					for (var j = 0; j < wsContains.length; j++) {
						if (odId == wsContains[j].dashboardId) {
							return true;
						}
					}
				}
			}
			return false;
		};
		/** @description choose from the act, and open model for the action **/
		$scope.updateModalPopup = function ($event, dashboardItem, action) {
			$scope.updateModalHeader = $event.currentTarget.attributes["headername"].value;
			var id = dashboardItem.dashboardId;
			$scope.itemToUpdate = id;
			$scope.dashboardToUpdate = id;
			$scope.modal.dashActionConfig.nameOfWorkspaceToUpdate = "";
			$scope.modal.dashActionConfig.nameOfDashboardToUpdate = dashboardItem.dashboardName;
			switch ($scope.updateDashAction) {
			case "renameDashboard":
				$scope.updateBtnLabel = "Rename";
				$scope.dashboardNameLabel = "Dashboard";
				$scope.modal.dashActionConfig.nameOfDashboardToUpdate = $scope.modal.replaceSpecialCharWithUnderscore(dashboardItem.dashboardName);
				break;
			case "renameWorkspace":
				$scope.updateBtnLabel = "Rename";
				$scope.dashboardNameLabel = "Workspace";
				$scope.modal.dashActionConfig.nameOfDashboardToUpdate = $scope.modal.replaceSpecialCharWithUnderscore(dashboardItem.dashboardName);
				break;
			case "deleteWorkspace":
				$scope.updateBtnLabel = "Remove";
				$scope.deleteWarning = 'If you are removing the workspace "' + $scope.modal.dashActionConfig.nameOfDashboardToUpdate + '", dashboards under the workspace will be moved to Trash. Are you sure to move it to trash?';
					// to do
					return;
				break;
			case "saveDashboardAsTemplate":
				$scope.updateBtnLabel = "Save";
				$scope.dashboardNameLabel = "Save Dashboard as Template";
				$scope.modal.dashActionConfig.nameOfDashboardToUpdate = $scope.modal.replaceSpecialCharWithUnderscore(dashboardItem.dashboardName);
				break;
			case "deleteDashboard":
				$scope.updateBtnLabel = "Remove";
				$scope.deleteWarning = 'Are you sure to remove the dashboard "' + $scope.modal.dashActionConfig.nameOfDashboardToUpdate + '"?';
				// to do
				return;
				break;
			case "moveDashboard":
				$scope.updateBtnLabel = "Move";
				break;
				//TRASH
			case "trash_RemoveDashboard":
				$scope.updateBtnLabel = "Remove From Trash";
				$scope.deleteWarning = 'Are you sure to remove the dashboard "' + $scope.modal.dashActionConfig.nameOfDashboardToUpdate + '"?';
				break;
			case "trash_RestoreDashboard":
				$scope.updateBtnLabel = "Restore";
				break;
			case "trash_RemoveWorkspace":
				$scope.updateBtnLabel = "Remove From Trash";
				$scope.deleteWarning = 'Are you sure to remove the workspace "' + $scope.modal.dashActionConfig.nameOfDashboardToUpdate + '"?';
				break;
			case "trash_RestoreWorkspace":
				$scope.updateBtnLabel = "Restore";
				$scope.deleteWarning = 'Do you want to restore workspace "' + $scope.modal.dashActionConfig.nameOfDashboardToUpdate + '" and its contents?';
				break;
			case "gitExport":
				$scope.updateBtnLabel = "Push";
			default:
				break;
			}
		};

		/** @description  **/
		$scope.updateDashboardOrWorkspace = function () {
			var designParam = {
				"dashboardId" : $scope.itemToUpdate.toString()
			};
			var flag = false;
			switch ($scope.updateDashAction) {
				case "renameDashboard":
					if ($scope.modal.dashActionConfig.nameOfDashboardToUpdate != "") {
						designParam["dashboardName"] = $scope.modal.dashActionConfig.nameOfDashboardToUpdate; 
						flag = true;
						$scope.hideUpdateModalDialog();
					}
					else{
						ServiceFactory.showNotification("Dashboard name can not be empty", "alert-danger", 3000);
					}					
					break;
				case "renameWorkspace":
					if ($scope.modal.dashActionConfig.nameOfDashboardToUpdate != "") {
						designParam["dashboardName"] = $scope.modal.dashActionConfig.nameOfDashboardToUpdate;
						flag = true;
						$scope.hideUpdateModalDialog();
					}
					else{
						ServiceFactory.showNotification("Workspace name can not be empty", "alert-danger", 3000);
					}					
					break;
				case "saveDashboardAsTemplate":
					if ($scope.modal.dashActionConfig.nameOfDashboardToUpdate != "") {
						designParam["dashboardName"] = $scope.modal.dashActionConfig.nameOfDashboardToUpdate;
						flag = false;
						$scope.hideUpdateModalDialog();
						$scope.saveDashboardTemplate(designParam);
					}
					else{
						ServiceFactory.showNotification("Dashboard template name can not be empty", "alert-danger", 3000);
					}					
					break;
				case "deleteWorkspace":
					designParam["workspaceId"] = $scope.itemToUpdate.toString();
					$scope.deleteDashboardOrWSFromDB(designParam, true);
					$scope.hideUpdateModalDialog();
					return;
					break;
				case "deleteDashboard":
					$scope.deleteDashboardOrWSFromDB(designParam, false);
					$scope.hideUpdateModalDialog();
					break;
				case "moveDashboard":
					if ($scope.modal.dashActionConfig.nameOfWorkspaceToUpdate["dashboardId"]) {
						designParam["workspaceId"] = $scope.modal.dashActionConfig.nameOfWorkspaceToUpdate["dashboardId"].toString();						
						flag = true;
						$scope.hideUpdateModalDialog();
					}
					else{
						ServiceFactory.showNotification("Workspace name can not be empty", "alert-danger", 3000);
					}
					break;
				default:
					break;
			}
			if (flag){
				$scope.updateDashboardOrWorkspaceInDB(designParam);
			}
		};
		
		$scope.hideUpdateModalDialog = function () {
			angular.element("#updateModalDialog").modal("hide");
			$scope.hideModelPopup('updateModalDialog');
		};
		/** @description It will open a dialog-box for permission to clean the trash,Setting the dialog parameters in this method **/
		$scope.showModalPopupRemoveAllTrashItems = function ($event, dashboardItem, action) {
			$scope.updateModalHeader = $event.currentTarget.attributes["headername"].value;
			$scope.updateBtnLabel = "Remove All";
			$scope.deleteWarning = "Are you sure you want to permanently remove all the items?";
            $scope.showModelPopup("cleanTrashModalDialog");
		};

		/** @description will clean all the trash items in one go **/
		$scope.removeAllTrashItems = function () {
			var dbdparams = {};
			var dashboardId = [],
			workspaceId = [];
			for (var i = 0; i < $scope.trashItems.length; i++) {
				if ($scope.trashItems[i].isDashboard){
					dashboardId.push($scope.trashItems[i].dashboardId);
				}else{
					workspaceId.push($scope.trashItems[i].dashboardId);
				}
			}
			dbdparams.dashboardId = JSON.stringify(dashboardId);
			dbdparams.workspaceId = JSON.stringify(workspaceId);
			var url = req_url.designer["deleteDashboardPermanently"];
			var data = {
				"spacekey" : $.jStorage.get("spacekey"),
				"token" : $.jStorage.get("token"),
				"dashboardParameters" : JSON.stringify(dbdparams)
			};
			BIZVIZ.SDK.secureRequest(url, data, function (data) {
				var _success = data.DesignerResp.success;
				if (_success) {
					$scope.refreshList();
					$scope.serverAlertMsg = { text : "Trash has been cleaned", type : "alert-success" }
				} else {
					$scope.serverAlertMsg = { text : "Failed to clean the trash", type : "alert-success" }
				}
			}, $scope.secureRequestErrorHandler);
		};

		/** @description will be called when do action on trash item  **/
		$scope.trashActions = function ($event, dashboardItem, action) {
			var relWsId = dashboardItem["parentId"];
			action += (dashboardItem.isDashboard ? "Dashboard" : "Workspace");
			$scope.isTrashAction = true;
			$event.stopPropagation();
			$scope.updateDashAction = action;
			$scope.updateModalPopup($event, dashboardItem, action);
			if (relWsId) {
				$scope.modal.dashActionConfig.nameOfWorkspaceToUpdate = $scope.modal.wsObj.wsList[$scope.getIndexOfWsFromWsListByWsId(relWsId)];
			} else {
				$scope.modal.dashActionConfig.nameOfWorkspaceToUpdate = {};
			}
			$scope.showModelPopup('updateModalDialog');
		};

		/** @description action on trash items **/
		$scope.updateFromTrash = function () {
			var
			designParam = { dashboardId : $scope.itemToUpdate.toString() };
			switch ($scope.updateDashAction) {
				case "trash_RemoveDashboard":
					designParam.dashboardId = JSON.stringify([$scope.itemToUpdate]);
					$scope.deleteFromTrash(designParam);
					break;
				case "trash_RestoreDashboard":
					if ($scope.modal.dashActionConfig.nameOfWorkspaceToUpdate["dashboardId"]) {
						designParam["restoreTo"] = $scope.modal.dashActionConfig.nameOfWorkspaceToUpdate["dashboardId"].toString();
						$scope.restoreFromTrash(designParam);
					}
					break;
				case "trash_RemoveWorkspace":
//					designParam["workspaceId"] = $scope.itemToUpdate.toString();
					designParam.dashboardId = JSON.stringify([$scope.itemToUpdate]);
					designParam.workspaceId = JSON.stringify([$scope.itemToUpdate]);
					$scope.deleteFromTrash(designParam);
					break;
				case "trash_RestoreWorkspace":
					designParam["workspaceId"] = $scope.itemToUpdate.toString();
					$scope.restoreFromTrash(designParam);
					break;
				default:
					break;
			}
		};

		/** @description Call delete method for dashboard or workspace **/
		$scope.deleteDashboardOrWSFromDB = function (dbdparams, isParent) {
			var
			REQ_URL = req_url.designer["trashDashboard"],
			REQ_DATA = { dashboardParameters : JSON.stringify(dbdparams) },
			requestSuccessFn = function (data, success) {
				var _success = data.DesignerResp.success;
				if (_success) {
					if (!isParent) {
						$scope.serverAlertMsg = { text : "Dashboard has been deleted", type : "alert-success" };
						for (var i = 0; i < $scope.modal.dbInsideWs.length; i++) {
							if ($scope.modal.dbInsideWs[i]["dashboardId"] == dbdparams.dashboardId) {
								$scope.modal.dbInsideWs.splice(i, 1);
								break;
							}
						}
					}else{
						$scope.serverAlertMsg = { text : "Workspace has been deleted", type : "alert-success" };
					}
					$scope.refreshList();
				} else {
					$scope.serverAlertMsg = { text : "Failed to delete", type : "alert-danger" };
				}
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn);
		};

		/** @description restore an item from trash **/
		$scope.restoreFromTrash = function (dbdparams) {
			var
			REQ_URL = req_url.designer["restoreDashboardFromTrash"],
			REQ_DATA = { dashboardParameters : JSON.stringify(dbdparams) },
			requestSuccessFn = function (data, success) {
				var _success = data.DesignerResp.success;
				if (_success) {
					$scope.refreshList();
					$scope.serverAlertMsg = { text : "Successfully restored", type : "alert-success" };
				} else {
					$scope.serverAlertMsg = { text : "Failed to restore", type : "alert-danger" };
				}
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn);
		};
		
		/** @description Updates the trashed item view **/
		$scope.updateTrashedItems = function() {
			$scope.getTrashItems( function( tItems ) {
				if( $scope.uiActive.trash ) {
					$scope.modal.dbInsideWs = tItems;
				}
			} );
		};

		/** @description delete an item From Trash **/
		$scope.deleteFromTrash = function (dbdparams) {
			var
			REQ_URL = req_url.designer["deleteDashboardPermanently"],
			REQ_DATA = { dashboardParameters : JSON.stringify(dbdparams) },
			requestSuccessFn = function (data, success) {
				var _success = data.DesignerResp.success;
				if (_success) {
					$scope.refreshList();
					$scope.updateTrashedItems();
					$scope.serverAlertMsg = { text : "Removed from trash", type : "alert-success" };
				} else {
					$scope.serverAlertMsg = { text : "Failed to remove", type : "alert-success" };
				}
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn);
		};

		/** @description service to fetch trash items **/
		$scope.getTrashItems = function ( cb ) {
			var
			REQ_URL = req_url.designer["getTrashItems"],
			REQ_DATA = {},
			requestSuccessFn = function (data, success) {
				var trashItems = data.DesignerResp.success ? data.DesignerResp.dashboards ? data.DesignerResp.dashboards : [] : [];
				$scope.trashItems = [];
				if (!ServiceFactory.isArray(trashItems)) {
					$scope.trashItems[0] = trashItems;
				} else {
					$scope.trashItems = trashItems;
				}
				if( cb && typeof cb === "function" ) {
					cb( trashItems );
				}
//				if ($scope.trashItems) {
//					var zeroTrash = !($scope.trashItems.length > 0)
//				}
				if ($scope.recentlyClickedItem === "Trash") {
					if ($scope.trashItems.lenth === 0) {
						$scope.modal.dashboardSpaceMsg = "No item found !";
						$scope.zeroDashboard = true;
					} else {
						$scope.zeroDashboard = false;
					}
					$scope.modal.dbInsideWs = $scope.trashItems;
				}
				ServiceFactory.showNotification($scope.serverAlertMsg["text"], $scope.serverAlertMsg["type"], 3000);
				$scope.serverAlertMsg = { text : "", type : "" };
				$scope.$apply();
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn);
		};

		/** @description service to update the dashboard or workspace in database **/
		$scope.updateDashboardOrWorkspaceInDB = function (dbdparams) {
			var
			REQ_URL = req_url.designer["updateDashboardOrWorkspace"],
			REQ_DATA = {
				dashboardParameters : JSON.stringify(dbdparams)
			},
			requestSuccessFn = function (data, success) {
				var _success = data.DesignerResp.success;
				if (_success) {
					/**when workspace is empty and workspace has been renamed
					 * it will update alert message**/
					$scope.serverAlertMsg = {
						text : "Workspace has been renamed",
						type : "alert-success"
					};
					if (dbdparams.workspaceId) {
						for (var i = 0; i < $scope.modal.dbInsideWs.length; i++) {
							if ($scope.modal.dbInsideWs[i]["dashboardId"] == dbdparams.dashboardId) {
								$scope.modal.dbInsideWs.splice(i, 1);
								break;
							}
						}
						$scope.serverAlertMsg = {
							text : "Dashboard has been moved",
							type : "alert-success"
						};
					} else if (dbdparams.dashboardName) {
						for (var i1 = 0; i1 < $scope.modal.dbInsideWs.length; i1++) {
							/** "if" condition will update alert when dashboard has been renamed, "else" condition 
							* will update alert when workspace has been renamed **/
							if ($scope.modal.dbInsideWs[i1]["dashboardId"] == dbdparams.dashboardId) {
								$scope.modal.dbInsideWs[i1]["dashboardName"] = dbdparams.dashboardName;
								$scope.serverAlertMsg = {
									text : "Dashboard has been renamed",
									type : "alert-success"
								};
								break;
							} else {
								$scope.serverAlertMsg = {
									text : "Workspace has been renamed",
									type : "alert-success"
								};
							}
						}
					} else {
						$scope.serverAlertMsg = {
							text : "Dashboard has been updated",
							type : "alert-success"
						};
					}
					$scope.refreshList();
				} else {
					$scope.serverAlertMsg = {
						text : "Failed to update",
						type : "alert-danger"
					};
				}
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn);
		};

		/** @description called to reload the workspace list **/
		$scope.refreshList = function (callback) {
			$scope.getWorkspaces(function (_wsObj) {
				if (_wsObj.wsList.length > 0) {
					$scope.modal.zeroWorkspcae = false;
					$scope.modal.wsObj = _wsObj;
					$scope.$apply();
				} else {
					$scope.modal.zeroWorkspcae = true;
				}
				if (callback && typeof(callback) == "function") {
					callback(_wsObj);
				}
			}, true);

		};

		/** @description show notification when refresh finished **/
		$scope.onrefreshComplete = function () {
			ServiceFactory.showNotification("Workspace has been refreshed", "alert-info", 3000);
		};

		/** @description Open from local disk **/
		$scope.browseBVZXDashboard = function (filesSelected) {
			if ($scope.modal.dashboardTabs.length == 3) {
				ServiceFactory.showNotification("Please close a dashboard", "alert-success", 3000);
				return false;
			}
			if (filesSelected != undefined && filesSelected.fileName.indexOf(".bvzx") != -1) {
				var imageData = filesSelected.fileData;
				var bvzxFile = convertStringToJson(imageData);
				if (bvzxFile != undefined && bvzxFile != "") {
					if (bvzxFile["dashboardJson"] != undefined) {
						$scope.modal.dashboardVisibleComponents = [];
						$scope.modal.dashboardHiddenComponents = [];
						$scope.removeDashboardPublishDetailsFromDownloadedJson(bvzxFile.dashboardJson);
						$scope.openProcessingItem = {
							"dashboardId" : bvzxFile.dashboardJson.Dashboard.id,
							"dashboardName" : bvzxFile.dashboardJson.Dashboard.name,
							"isDashboard" : "true",	"parentId" : "00000000",
							"spaceKey" : ServiceFactory.AUTH_INFO.get("spacekey"),
							"status" : ServiceFactory.AUTH_INFO.get("token"),
							"userId" : ServiceFactory.AUTH_INFO.get("userID")
						};
						var openDashboardsInfo = $scope.isDashboardAlredyOpened(bvzxFile.dashboardJson.Dashboard.backendId, bvzxFile.dashboardJson.Dashboard.id);
						if (!openDashboardsInfo.exist) {
							$scope.loadDashboardInDesigner(bvzxFile);
						} else {
							ServiceFactory.showNotification("Dashboard with same id is already opened", "alert-info", 3000);
							$scope.toggleMenu();
							$scope.dashboardTabClick(openDashboardsInfo.dashboardId);
						}
					} else {
						ServiceFactory.showNotification("Invalid dashboard configuration", "alert-danger", 3000);
					}
				} else {
					ServiceFactory.showNotification("Invalid dashboard configuration", "alert-danger", 3000);
				}
			} else {
				ServiceFactory.showNotification("File type is not supported", "alert-danger", 3000);
			}
		};

		/** @description check for dashboard already opened in design mode or not **/
		$scope.isDashboardAlredyOpened = function (backendId, dashboardId) {
			for (var i = 0; i < $scope.modal.dashboardTabs.length; i++) {
				if ($scope.modal.dashboardTabs[i].json.Dashboard.backendId == backendId && backendId != "") {
					return { exist : true, dashboardId : $scope.modal.dashboardTabs[i].json.Dashboard.id };
				}
				if ($scope.modal.dashboardTabs[i].json.Dashboard.id == dashboardId) {
					return { exist : true, dashboardId : $scope.modal.dashboardTabs[i].json.Dashboard.id };
				}
			}
			return { exist : false, dashboardId : "" };
		};
		/** @description remove the details from dashboard when it is opened from local disk, or made a copy of dashboard or exported **/
		$scope.removeDashboardPublishDetailsFromDownloadedJson = function (dashboardJson) {
			/**if dashboard is saved but JSON not saved due to UTF-8 2/3/4 bytes issue or any other issue, it may break here **/
			if(dashboardJson && dashboardJson.Dashboard){
				dashboardJson.Dashboard.backendId = "";
				dashboardJson.Dashboard.workspaceId = "";
				if(dashboardJson.Dashboard.versionDetails){
					dashboardJson.Dashboard.versionDetails.publishDocId = 0;
					dashboardJson.Dashboard.versionDetails.publishedVersions = [];
				}
			}
		};
		/** @description will open the dashboard in design mode browsed from local disk **/
		$scope.loadDashboardInDesigner = function (json) {
			 var dataFilePath = "./resources/bizvizchart-themes/default-theme/AllComponentsData.data";
	         var propertyFilePath = "./resources/data/property/allpropertydata.data";
	         ServiceFactory.getJsonFileData(dataFilePath, function(cjson) {
	             $scope.modal.compMetaData = cjson;
	         });
	         ServiceFactory.getJsonFileData(propertyFilePath, function(cjson) {
	             $scope.modal.propertyData = cjson;
	          });			
			if ($scope.modal.dashboardTabs.length < $scope.maxTabLength) {
				var dashboardJson = convertStringToJson(json).dashboardJson;
				var infojson = convertStringToJson(json).infoJson;
				/**reset dataset color on importing dashboard (For themes)**/
				delete $scope.datasetcolor;
				/**End**/
				if (dashboardJson != undefined && dashboardJson.Dashboard != undefined) {
					if (!dashboardJson.Dashboard.AbsoluteLayout.designerTheme) {
						dashboardJson.Dashboard.AbsoluteLayout.designerTheme = "default-theme";
					}
					/** to update layoutType in old dashboard **/
					dashboardJson.Dashboard.layoutType = "AbsoluteLayout";
					$scope.modal.layoutType = dashboardJson.Dashboard.layoutType;
					dashboardJson.Dashboard.workspaceId = $scope.openProcessingItem.parentId;
					dashboardJson.Dashboard.name = $scope.openProcessingItem.dashboardName;
					var dashboardId = dashboardJson.Dashboard.id;
					var dashboardName = dashboardJson.Dashboard.name;
					var openDashboardsInfo = $scope.isDashboardAlredyOpened(dashboardJson.Dashboard.backendId, dashboardJson.Dashboard.id);
					if (!openDashboardsInfo.exist) {
						/** to open the dashboard which doesn't have dashboard id in json **/
//						if(dashboardJson.Dashboard.backendId){
//							dashboardJson.Dashboard.id = "recoveredId"+dashboardJson.Dashboard.backendId;
//							dashboardId = dashboardJson.Dashboard.id;
//						}
						if (dashboardId != "" && dashboardId != undefined) {
							$scope.toggleMenu();
							
							/** Will remove the null from the Objects array of AbsoluteLayout, otheriwse dashboard is crashing while opening **/
							dashboardJson.Dashboard.AbsoluteLayout.Object = DesignerUtil.prototype.removeNullFromObjectsArray(dashboardJson.Dashboard.AbsoluteLayout.Object);
							
							$scope.modal.selectedDashboard = {
								"id" : dashboardId,
								"name" : dashboardName,
								"json" : dashboardJson,
								"infojson" : infojson
							};
							$scope.appendDesignDataForDashboard();
							$scope.modal.selectedDashboard.componentObjectList = {};
							$scope.modal.dashboards.push($scope.modal.selectedDashboard);
							$scope.selectedTheme[$scope.getActiveDashboardId()] = dashboardJson.Dashboard.AbsoluteLayout.designerTheme;
							$scope.selectedGlobalProperty[$scope.getActiveDashboardId()] = {};
							$scope.selectedGlobalProperty[$scope.getActiveDashboardId()][$scope.modal.layoutType] = dashboardJson.Dashboard[$scope.modal.layoutType].globalProperties;
							$scope.loadDesignerThemeInfo($scope.selectedTheme[$scope.getActiveDashboardId()], function(){
								/* Written inside timeout to make sure digest cycle take it on priority and render the dashboard container div */
								$timeout(function(){
									$scope.applySettingsToOpenedDashboard(dashboardId, dashboardName, dashboardJson, infojson);
									$scope.selectedTheme[$scope.getActiveDashboardId()] = dashboardJson.Dashboard.AbsoluteLayout.designerTheme;
								},0);
								/* Above timeout is required to render the dashboard container div so that coponents can be appended to it */
								$timeout(function(){
									$scope.modal.prepForBroadcast();								
								},1);
							});
							return true;
						} else {
							ServiceFactory.showNotification("Invalid dashboard configuration", "alert-warning", 3000);
						}
					}
				} else {
					ServiceFactory.showNotification("Invalid dashboard configuration", "alert-danger", 3000);
				}
			} else {
				/* in multiple click case */
//				ServiceFactory.showNotification("Close a dashboard", "alert-warning", 3000);
			}
		};
		
		/**DAS-418 @description will open the dashboard template in design mode browsed from template page **/
		$scope.loadTemplateInDesigner = function (json) {
			 var dataFilePath = "./resources/bizvizchart-themes/default-theme/AllComponentsData.data";
	         var propertyFilePath = "./resources/data/property/allpropertydata.data";
	         ServiceFactory.getJsonFileData(dataFilePath, function(cjson) {
	             $scope.modal.compMetaData = cjson;
	         });
	         ServiceFactory.getJsonFileData(propertyFilePath, function(cjson) {
	             $scope.modal.propertyData = cjson;
	          });
	         ServiceFactory.showNotification("Please verify scripts in dashboard and its components", "alert-warning", 6000);
			if ($scope.modal.dashboardTabs.length < $scope.maxTabLength) {
				var dashboardJson = convertStringToJson(json).dashboardJson;
				var infojson = convertStringToJson(json).infoJson;
				/**reset dataset color on importing dashboard (For themes)**/
				delete $scope.datasetcolor;
				/**End**/
				if (dashboardJson != undefined && dashboardJson.Dashboard != undefined) {
					if (!dashboardJson.Dashboard.AbsoluteLayout.designerTheme) {
						dashboardJson.Dashboard.AbsoluteLayout.designerTheme = "default-theme";
					}
					/** to update layoutType in old dashboard **/
					dashboardJson.Dashboard.layoutType = "AbsoluteLayout";
					$scope.modal.layoutType = dashboardJson.Dashboard.layoutType;
					dashboardJson.Dashboard.workspaceId = $scope.openProcessingItem.parentId;
					dashboardJson.Dashboard.name = $scope.openProcessingItem.dashboardName;
					/*assign new dashboardId and remove wordsaceId, backendId to make as a new dashboard*/
					dashboardJson.Dashboard.id = getIdWithTimeStamp("dashboard");
					dashboardJson.Dashboard.workspaceId = "";
					dashboardJson.Dashboard.backendId = "";
					/*empty dashboard area script if any used*/
					/*dashboardJson.Dashboard.variable.userScript.value = "";*/
					/*empty dashboard connections if any used*/
					dashboardJson.Dashboard.DataProviders.DataURL = [];
					dashboardJson.Dashboard.DataProviders.queryServiceList = [];
					dashboardJson.Dashboard.DataProviders.selectedConnection = [];
					/*removing components user sript if any */
					for(var i=0; i<dashboardJson.Dashboard.AbsoluteLayout.Object.length; i++){
						
						/*dashboardJson.Dashboard.AbsoluteLayout.Object[i].variable.userScript.value = "";*/
						var subElement= dashboardJson.Dashboard.AbsoluteLayout.Object[i].subElement;
						var subElementDataSet= dashboardJson.Dashboard.AbsoluteLayout.Object[i][subElement].DataSet;
						if(subElement && subElementDataSet){
							/*remove datasource connection*/
							dashboardJson.Dashboard.AbsoluteLayout.Object[i][subElement].DataSet.dataSource = "";
							/*remove datasource value*/
							dashboardJson.Dashboard.AbsoluteLayout.Object[i][subElement].DataSet.Fields = [];
						}
						
					}
					$scope.templateDashboardJson = dashboardJson;
					var dashboardId = dashboardJson.Dashboard.id;
					var dashboardName = dashboardJson.Dashboard.name;
					var openDashboardsInfo = $scope.isDashboardAlredyOpened(dashboardJson.Dashboard.backendId, dashboardJson.Dashboard.id);
					if (!openDashboardsInfo.exist) {
						/** to open the dashboard which doesn't have dashboard id in json **/
//						if(dashboardJson.Dashboard.backendId){
//							dashboardJson.Dashboard.id = "recoveredId"+dashboardJson.Dashboard.backendId;
//							dashboardId = dashboardJson.Dashboard.id;
//						}
						if (dashboardId != "" && dashboardId != undefined) {
							$scope.toggleMenu();
							
							/** Will remove the null from the Objects array of AbsoluteLayout, otheriwse dashboard is crashing while opening **/
							dashboardJson.Dashboard.AbsoluteLayout.Object = DesignerUtil.prototype.removeNullFromObjectsArray(dashboardJson.Dashboard.AbsoluteLayout.Object);
							
							$scope.modal.selectedDashboard = {
								"id" : dashboardId,
								"name" : dashboardName,
								"json" : dashboardJson,
								"infojson" : infojson
							};
							$scope.appendDesignDataForDashboard();
							$scope.modal.selectedDashboard.componentObjectList = {};
							$scope.modal.dashboards.push($scope.modal.selectedDashboard);
							$scope.selectedTheme[$scope.getActiveDashboardId()] = dashboardJson.Dashboard.AbsoluteLayout.designerTheme;
							$scope.selectedGlobalProperty[$scope.getActiveDashboardId()] = {};
							$scope.selectedGlobalProperty[$scope.getActiveDashboardId()][$scope.modal.layoutType] = dashboardJson.Dashboard[$scope.modal.layoutType].globalProperties;
							$scope.loadDesignerThemeInfo($scope.selectedTheme[$scope.getActiveDashboardId()], function(){
								/* Written inside timeout to make sure digest cycle take it on priority and render the dashboard container div */
								$timeout(function(){
									$scope.applySettingsToOpenedDashboard(dashboardId, dashboardName, dashboardJson, infojson);
									$scope.selectedTheme[$scope.getActiveDashboardId()] = dashboardJson.Dashboard.AbsoluteLayout.designerTheme;
								},0);
								/* Above timeout is required to render the dashboard container div so that coponents can be appended to it */
								$timeout(function(){
									$scope.modal.prepForBroadcast();								
								},1);
							});
							return true;
						} else {
							ServiceFactory.showNotification("Invalid dashboard configuration", "alert-warning", 3000);
						}
					}
				} else {
					ServiceFactory.showNotification("Invalid dashboard configuration", "alert-danger", 3000);
				}
			} else {
				/* in multiple click case */
//				ServiceFactory.showNotification("Close a dashboard", "alert-warning", 3000);
			}
		};
		
		/** @description set the drag resize and preference settings to opened dashboard **/
		$scope.applySettingsToOpenedDashboard = function (dashboardId, dashboardName, dashboardJson, infojson) {
			$scope.addInDashboardTab(dashboardId, dashboardName, dashboardJson, infojson);
			$scope.setDashboardsDefaultCSS($scope.modal.userPreference.defaultSettings);
			$scope.showHideGridLines($scope.modal.userPreference.showGridLines);
			$scope.modal.createHistoryProperties(dashboardId);
			$timeout(function () {
				if (!$scope.isSelectedDashboardResponsive()) {
					$scope.setDashboardCSS($scope.modal.userPreference);
//					$scope.initResizeDashboard(dashboardId, dashboardJson);
//					$scope.initDragSelection(dashboardId);
				}
				$scope.dashboardTabClick(dashboardId);
				/** This method sets the status to zero for newly opened dashboard **/
				$scope.modal.updateDashboardStatus(0);
			}, 10);
		};
		
		/** @description Will be called when a dashboard is opened from manage page **/
		$scope.OpenDasboard = function (dashboardProperties, event) {
			event ? event.stopPropagation() : "";
			if (!dashboardProperties)
				return false;
			$scope.openProcessingItem = dashboardProperties;
			var dataFilePath = "./resources/bizvizchart-themes/default-theme/AllComponentsData.data";
	        var propertyFilePath = "./resources/data/property/allpropertydata.data";
			var dashboardPorpertyFilePath = "./resources/data/property/dashboard.data";
	        ServiceFactory.getJsonFileData(dataFilePath, function(cjson) {
	             $scope.modal.compMetaData = cjson;
	         });
	        ServiceFactory.getJsonFileData(propertyFilePath, function(cjson) {
	             $scope.modal.propertyData = cjson;
	         });
	        ServiceFactory.getJsonFileData(dashboardPorpertyFilePath, function(propjson) {
	             $scope.modal.globalFontProperties = propjson["Global Font And Themes"][4]["options"];
	         });
	        ServiceFactory.getJsonFileData("./resources/bizvizchart-themes/default-theme/chart/CopyComponent.data", function(copyjson) {
	             $scope.modal.copyJson = copyjson["Properties"]["Object"];
	        });
			/** Will load all the component script in page **/
			$scope.loadComps();
			var
			REQ_URL = req_url.designer["openDashboard"],
			openDashboardsInfo = $scope.isDashboardAlredyOpened(dashboardProperties.dashboardId, "");
			var DES_PARAMS = { dashboardId : dashboardProperties.dashboardId.toString() },
			REQ_DATA = { dashboardParameters : JSON.stringify(DES_PARAMS) },
			requestSuccessFn = function (data, success) {
				if (data && data.DesignerResp.success) {
					$scope.openDashboardSaveAlertUser(dashboardProperties);
					/*DAS-201 call getDashboardComponents*/					
					var dashboardJson = convertStringToJson(data.DesignerResp.params).dashboardJson;
					/*check if dashboardJson is not empty*/
					if(dashboardJson.Dashboard){
						var theme = dashboardJson.Dashboard[dashboardJson.Dashboard.layoutType].designerTheme;
						if(theme !== "default-theme"){
							var themeFilePath = "./resources/bizvizchart-themes/"+theme+"/themeConfig.data";
							ServiceFactory.getJsonFileData(themeFilePath, function(cjson) {
								$scope.modal.themeData = cjson;
							});
						}
						var componentsData = dashboardJson.Dashboard.AbsoluteLayout.Object;
						var componentsId = [];
						for(var i=0; i<componentsData.length; i++){
								componentsId.push(componentsData[i].objectID);
						}
						$scope.getDashboardComponents(dashboardProperties,data.DesignerResp.params,componentsId);
					} else {
						ServiceFactory.showNotification("Invalid dashboard configuration", "alert-danger", 3000);
					}
					
					/*
					var successCB = $scope.loadDashboardInDesigner(data.DesignerResp.params);
					if (successCB) {
						dashboardProperties.isOpen = true;
						ServiceFactory.closeAllNotifications();
						ServiceFactory.showNotification("Dashboard has been loaded", "alert-success", 3000);
						$scope.enableSaveDashboardInInterval()
					} else {
						ServiceFactory.closeAllNotifications();
					}
					*/
				} else {
					ServiceFactory.showNotification("Invalid dashboard configuration", "alert-danger", 3000);
				}
				
			},
			requestFailedFn = function (data) {
	      		 ServiceFactory.showNotification("Invalid dashboard configuration", "alert-danger", 3000);
	      	};
			if (!openDashboardsInfo.exist) {
				if ($scope.modal.dashboardTabs.length < $scope.maxTabLength) {
					ServiceFactory.showNotification("Getting dashboard", "alert-info", 30000);
					$scope.modal.dashbaordLoadingInProgress = true;
					ServiceFactory.showLoader();
					BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
				} else {
					ServiceFactory.showNotification("Please close a dashboard", "alert-warning", 3000);
					$scope.toggleMenu();
				}
			} else {
				ServiceFactory.showNotification("Dashboard with same id is already opened", "alert-info", 3000);
				$scope.toggleMenu();
				$scope.dashboardTabClick(openDashboardsInfo.dashboardId);
			}
		};
		
		/** DAS-201 @description Will be called getdashboardComponents after openeDashboard from manage page **/
		$scope.getDashboardComponents = function (dashboardProperties,DesignerResp,componentsId) {
			var spaceKey = window.sessionStorage.getItem('bvz_spacekey');
			var token = window.sessionStorage.getItem('bvz_token');
			var userid = window.sessionStorage.getItem('bvz_userid');
			var REQ_URL = "/workspace/getDashboardComponents";
			$scope.modal.dashboardVisibleComponents = [];
			$scope.modal.getDashboardComponents = false;
			$scope.modal.dashboardHiddenComponents = [];
			$scope.modal.dashboardComponents = [];
			var REQ_DATA = { 
					"dashboardComponents" : angular.toJson(componentsId),
					"token": token,
					"dashboardId": dashboardProperties.dashboardId,
				    "spacekey": spaceKey					
			},
			requestSuccessFn = function (data) {
				if (data && data.wokspaceResp.success) {
					var componentsData = data.wokspaceResp.components;
					$scope.modal.getDashboardComponents = true;
					for(var i=0;i<componentsData.length;i++)
						{
							$scope.modal.dashboardComponents.push(convertStringToJson(componentsData[i].data));
							if(IsBoolean(componentsData[i].unShowHidden) == false){
								$scope.modal.dashboardVisibleComponents.push(convertStringToJson(componentsData[i].data));
							}else{
								$scope.modal.dashboardHiddenComponents.push(convertStringToJson(componentsData[i].data));
							}						
						}
					/*call this function when load saved dashboard from manage page*/
					var successCB = $scope.loadDashboardInDesignerFromDb(DesignerResp);
					if (successCB) {
						dashboardProperties.isOpen = true;
						ServiceFactory.closeAllNotifications();
						ServiceFactory.showNotification("Dashboard has been loaded", "alert-success", 3000);
						$scope.enableSaveDashboardInInterval();
						/*check if hidden components not empty and merge all visible and hidden components into $scope.modal.selectedDashboard*/
						if($scope.modal.dashboardHiddenComponents.length > 0 ){
							//var completeDashboardJson = $scope.modal.dashboardVisibleComponents.concat($scope.modal.dashboardHiddenComponents);
							//$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object = $scope.modal.dashboardComponents; //completeDashboardJson;	
						}
					} else {
						ServiceFactory.closeAllNotifications();
					}
				}
				/*DAS-201 when there is not componentsJson for old saved dashboard */
				if (data && !data.wokspaceResp.success) {
					/*call this function when load saved dashboard from manage page*/
					var successCB = $scope.loadDashboardInDesigner(DesignerResp);
					if (successCB) {
						dashboardProperties.isOpen = true;
						ServiceFactory.closeAllNotifications();
						ServiceFactory.showNotification("Dashboard has been loaded", "alert-success", 3000);
						$scope.enableSaveDashboardInInterval();
					} else {
						ServiceFactory.closeAllNotifications();
					}
				}
				ServiceFactory.hideLoader();
			},
			requestFailedFn = function (data) {
	      		 ServiceFactory.showNotification("Invalid dashboard configuration", "alert-danger", 3000);
	      	}
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
		};
		
		
		/**DAS-201 @description will open the dashboard in design mode open from manage page **/
		$scope.loadDashboardInDesignerFromDb = function (json) {
			 var dataFilePath = "./resources/bizvizchart-themes/default-theme/AllComponentsData.data";
	         var propertyFilePath = "./resources/data/property/allpropertydata.data";
	         var dashboardPorpertyFilePath = "./resources/data/property/dashboard.data";
	         ServiceFactory.getJsonFileData(dataFilePath, function(cjson) {
	             $scope.modal.compMetaData = cjson;
	         });
	         ServiceFactory.getJsonFileData(propertyFilePath, function(cjson) {
	             $scope.modal.propertyData = cjson;
	         })
	         ServiceFactory.getJsonFileData(dashboardPorpertyFilePath, function(propjson) {
	             $scope.modal.globalFontProperties = propjson["Global Font And Themes"][4]["options"];
	         });
			if ($scope.modal.dashboardTabs.length < $scope.maxTabLength) {
				var dashboardJson = convertStringToJson(json).dashboardJson;
				var infojson = convertStringToJson(json).infoJson;
				/**reset dataset color on importing dashboard (For themes)**/
				delete $scope.datasetcolor;
				/**End**/
				if (dashboardJson != undefined && dashboardJson.Dashboard != undefined) {
					if (!dashboardJson.Dashboard.AbsoluteLayout.designerTheme) {
						dashboardJson.Dashboard.AbsoluteLayout.designerTheme = "default-theme";
					}
					/** to update layoutType in old dashboard **/
					dashboardJson.Dashboard.layoutType = "AbsoluteLayout";
					$scope.modal.layoutType = dashboardJson.Dashboard.layoutType;
					dashboardJson.Dashboard.workspaceId = $scope.openProcessingItem.parentId;
					dashboardJson.Dashboard.name = $scope.openProcessingItem.dashboardName;
					var dashboardId = dashboardJson.Dashboard.id;
					var dashboardName = dashboardJson.Dashboard.name;
					var openDashboardsInfo = $scope.isDashboardAlredyOpened(dashboardJson.Dashboard.backendId, dashboardJson.Dashboard.id);
					if (!openDashboardsInfo.exist) {
						/** to open the dashboard which doesn't have dashboard id in json **/
//						if(dashboardJson.Dashboard.backendId){
//							dashboardJson.Dashboard.id = "recoveredId"+dashboardJson.Dashboard.backendId;
//							dashboardId = dashboardJson.Dashboard.id;
//						}
						if (dashboardId != "" && dashboardId != undefined) {
							$scope.toggleMenu();
							/*replace json Dashboard.AbsoluteLayout.Obejct with visiblecomponents object*/
							var completeDashboardJson = $scope.modal.dashboardVisibleComponents.concat($scope.modal.dashboardHiddenComponents);
							//dashboardJson.Dashboard.AbsoluteLayout.Object = completeDashboardJson;
							//dashboardJson.Dashboard.AbsoluteLayout.Object = $scope.modal.dashboardVisibleComponents;
							/** Will remove the null from the Objects array of AbsoluteLayout, otheriwse dashboard is crashing while opening **/
							dashboardJson.Dashboard.AbsoluteLayout.Object = DesignerUtil.prototype.removeNullFromObjectsArray(dashboardJson.Dashboard.AbsoluteLayout.Object);
							
							$scope.modal.selectedDashboard = {
								"id" : dashboardId,
								"name" : dashboardName,
								"json" : dashboardJson,
								"infojson" : infojson
							};
							
							$scope.appendDesignDataForDashboard();
							$scope.modal.selectedDashboard.componentObjectList = {};
							$scope.modal.dashboards.push($scope.modal.selectedDashboard);
							$scope.selectedTheme[$scope.getActiveDashboardId()] = dashboardJson.Dashboard.AbsoluteLayout.designerTheme;
							$scope.selectedGlobalProperty[$scope.getActiveDashboardId()] = {};
							$scope.selectedGlobalProperty[$scope.getActiveDashboardId()][$scope.modal.layoutType] = dashboardJson.Dashboard[$scope.modal.layoutType].globalProperties;
							$scope.selectedGlobalProperty[$scope.getActiveDashboardId()]["MobileLayout"] = dashboardJson.Dashboard["MobileLayout"].globalProperties;
							$scope.selectedGlobalProperty[$scope.getActiveDashboardId()]["TabletLayout"] = dashboardJson.Dashboard["TabletLayout"].globalProperties;
							$scope.loadDesignerThemeInfo($scope.selectedTheme[$scope.getActiveDashboardId()], function(){
								/* Written inside timeout to make sure digest cycle take it on priority and render the dashboard container div */
								$timeout(function(){
									$scope.applySettingsToOpenedDashboard(dashboardId, dashboardName, dashboardJson, infojson);
									$scope.selectedTheme[$scope.getActiveDashboardId()] = dashboardJson.Dashboard.AbsoluteLayout.designerTheme;
								},0);
								/* Above timeout is required to render the dashboard container div so that coponents can be appended to it */
								$timeout(function(){
									$scope.modal.prepForBroadcast();								
								},1);
							});
							return true;
						} else {
							ServiceFactory.showNotification("Invalid dashboard configuration", "alert-warning", 3000);
						}
					}
				} else {
					ServiceFactory.showNotification("Invalid dashboard configuration", "alert-danger", 3000);
				}
			} else {
				/* in multiple click case */
//				ServiceFactory.showNotification("Close a dashboard", "alert-warning", 3000);
			}
		};
		
		/** DAS-201 function to render hidden components after visible components in background */
		$scope.rednerHiddenDashboarComponents = function(json){
			var dashboardJson = convertStringToJson(json).dashboardJson;
			dashboardJson.Dashboard.AbsoluteLayout.Object = $scope.dashboardHiddenComponents;
			/** Will remove the null from the Objects array of AbsoluteLayout, otheriwse dashboard is crashing while opening **/
			dashboardJson.Dashboard.AbsoluteLayout.Object = DesignerUtil.prototype.removeNullFromObjectsArray(dashboardJson.Dashboard.AbsoluteLayout.Object);
			
			$scope.modal.selectedDashboard.json = dashboardJson;
			
			$scope.appendDesignDataForDashboard();
			$scope.modal.dashboards =[];
			$scope.modal.selectedDashboard.componentObjectList = {};
			$scope.modal.dashboards.push($scope.modal.selectedDashboard);
				/* Above timeout is required to render the dashboard container div so that coponents can be appended to it */
				$timeout(function(){
					$scope.modal.prepForBroadcast();								
				},1);
		}
		
		/** DAS-418 @description Will be called when a template is opened from template folder **/
		$scope.OpenTemplateDasboard = function (dashboardProperties, event) {
			event ? event.stopPropagation() : "";
			if (!dashboardProperties)
				return false;
			$scope.openProcessingItem = dashboardProperties;
			var dataFilePath = "./resources/bizvizchart-themes/default-theme/AllComponentsData.data";
	        var propertyFilePath = "./resources/data/property/allpropertydata.data";
			ServiceFactory.getJsonFileData(dataFilePath, function(cjson) {
	             $scope.modal.compMetaData = cjson;
	         });
	        ServiceFactory.getJsonFileData(propertyFilePath, function(cjson) {
	             $scope.modal.propertyData = cjson;
	         });
			/** Will load all the component script in page **/
			$scope.loadComps();
			var
			REQ_URL = req_url.designer["openDashboard"],
			openDashboardsInfo = $scope.isDashboardAlredyOpened(dashboardProperties.dashboardId, "");
			var DES_PARAMS = { dashboardId : dashboardProperties.dashboardId.toString() },
			REQ_DATA = { dashboardParameters : JSON.stringify(DES_PARAMS) },
			requestSuccessFn = function (data, success) {
				if (data && data.DesignerResp.success) {
					var successCB = $scope.loadTemplateInDesigner(data.DesignerResp.params);
					$scope.removeDashboardPublishDetailsFromDownloadedJson($scope.modal.selectedDashboard.json);
					if (successCB) {
						dashboardProperties.isOpen = true;
						ServiceFactory.closeAllNotifications();
						ServiceFactory.showNotification("Template has been loaded", "alert-success", 3000);
						$scope.enableSaveDashboardInInterval()
					} else {
						ServiceFactory.closeAllNotifications();
					}
				} else {
					ServiceFactory.showNotification("Invalid dashboard template configuration", "alert-danger", 3000);
				}
				ServiceFactory.hideLoader();
			};
			if (!openDashboardsInfo.exist) {
				if ($scope.modal.dashboardTabs.length < $scope.maxTabLength) {
					ServiceFactory.showNotification("Getting dashboard", "alert-info", 30000);
					$scope.modal.dashbaordLoadingInProgress = true;
					ServiceFactory.showLoader();
					BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn);
				} else {
					ServiceFactory.showNotification("Please close a dashboard", "alert-warning", 3000);
					$scope.toggleMenu();
				}
			} else {
				ServiceFactory.showNotification("Dashboard template with same id is already opened", "alert-info", 3000);
				$scope.toggleMenu();
				$scope.dashboardTabClick(openDashboardsInfo.dashboardId);
			}
		};
		/* call after openDashboard */
		$scope.openDashboardSaveAlertUser = function(dashboardProperties){
			var websocketforalert = new WebSocket(window['bizviz_camelwebsocket'] || parent.window['bizviz_camelwebsocket']);
			var token = window.sessionStorage.getItem('bvz_token');
			var userid = window.sessionStorage.getItem('bvz_userid');
			var workspaceId = dashboardProperties.parentId.toString();
			var dashboardId = dashboardProperties.dashboardId.toString();
			var socketdata = {
				"type": "add",
				"data": {},
				"key": dashboardId,
				"token": token,
				"userinfo": userid
			};
			websocketforalert.onopen = function(e) {
				if (websocketforalert.readyState === WebSocket.OPEN) {
					//console.log("Websocket opened");
					websocketforalert.send(JSON.stringify(socketdata));
				}
			};
			// Listen for messages
			websocketforalert.addEventListener('message', function (event) {
			    if(event.data){
			    	var response = JSON.parse(event.data);
			    	/*
			    	console.log('Message from server ', dashboardProperties.isOpen+","+response);
			    	console.log('Message from server key ', response.key);
				    console.log('current dashboardId ', dashboardId);
				    */
				    if(dashboardProperties.isOpen == true && response.key === dashboardId && response.userId !== userid){
				    	$scope.showModelPopup('websoketAlertModalDialog');
				    }	
			    }
			    
			});
			websocketforalert.onclose = function(event) {
				//console.log("closing");
				/*re-open websocket only if dashboard is opened*/
				if(dashboardProperties.isOpen == true){
					$scope.openDashboardSaveAlertUser(dashboardProperties);	
				}
			};
			websocketforalert.onerror = function(event) {
				console.log("error"+event.data);
			};
		};
		/*DAS-320 close dashboardand open same dashboard with new changes*/
		$scope.closeOpenSameDashboard = function () {
			$scope.hideModelPopup('websoketAlertModalDialog');
			/*get dashboardId and Index from @$scope.modal.dashboardTabs for closing dashboard*/
			var dashboardIndex = 0;
			var dashboardIdtoClose ="";
			var currentDashboardId = $scope.openProcessingItem.dashboardId.toString();
			for(var i=0; i<$scope.modal.dashboardTabs.length; i++){
				if(currentDashboardId === $scope.modal.dashboardTabs[i]['json']['Dashboard']['backendId']){
					dashboardIndex = i;
					dashboardIdtoClose = $scope.modal.dashboardTabs[i].id;
				}
			}
			if(dashboardIdtoClose !=""){
				var dashboardId = $scope.openProcessingItem.dashboardId;
				/*close currently opened dashboard*/
				//$scope.closeDashboard(dashboardIdtoClose, dashboardIndex);
				$scope.closeDashboardTabAndDiv(dashboardIdtoClose, dashboardIndex);
				$scope.toggleMenu();
				/*again opened same dashboard*/
		    	$scope.OpenDasboard($scope.openProcessingItem,"");
			}else{
				ServiceFactory.showNotification(" Changes not applied. Try after some times", "alert-info", 3000);
			}
			
		}
		/** @description Saving dashboard continuously in given interval **/
		$scope.enableSaveDashboardInInterval = function () {
			/* TODO Take timeInterval from preference or from dashboard */
			// var timeInterval = $scope.modal.userPreference.timeIntervals.saveDashboard;
			// var timeInterval = $scope.modal.selectedDashboard.json.Dashboard.timeIntervals.saveDashboard;
			/*
			var timeInterval = 30000;
			$interval(function(){
				var _dashboardJsonToSave = $scope.modal.selectedDashboard.json;
				var _activeDashboard = _dashboardJsonToSave["Dashboard"],
				_dbBackendId = _activeDashboard["backendId"],
				_wsId = _activeDashboard["workspaceId"],
				_dbName = _activeDashboard["name"],
				_isDashboardExists = _dbBackendId == "" ? false : true;
				if (_isDashboardExists) {
					$scope.saveDashboardInDB(_wsId, _dbBackendId, _dbName, _dashboardJsonToSave);
				}
			}, timeInterval);
			*/
		};

		/** @description to copy the current component's json, called when ctrl+j is pressed **/
		$scope.copyComponentJson = function () {
			if ($scope.modal.selectedComponentId != "") {
				$scope.selectedComponentJSON = JSON.stringify($scope.getComponentbyId($scope.modal.selectedComponentId), null, 4);
				$scope.showModelPopup("copyComponentJsonModalDialog");
				$scope.setFocusOnInput("#copyComponentJsonModalDialog", ".custom-text-area-jsonData");
			} else {
				ServiceFactory.showNotification("Please select a component", "alert-info", 3000);
			}
		};

		/** @description will open the scripting help page in new tab **/
		$scope.goToScriptHelp = function (locationID) {
			window.open($scope.scriptHelpUrl + (locationID ? "#" + locationID : ""), "_blank");
		};
		/** @description will open the Connector information text box*/
		$scope.openConnectorInfo = function(){
            $scope.showModelPopup("connectorInfoBox");
		}
		$scope.checkLast = function(isLast) {
		  if (isLast) {
		    // Call only once after last item rendered
		    $scope.listContainingDashboards();
		  }
		};
		/** @description Called from manage page when clicked on a workspace or dashboard **/
		$scope.listContainingDashboards = function (wsId) {
			/** need to clear the search field, otherwise it will not show any dashboard in other workspace **/
			$scope.workSpaceAndDashboardSearch = "";
			if (!wsId) {
				$scope.modal.dbInsideWs = $scope.modal.wsObj.dbList;

			} else if (wsId == "trash") {
				$scope.modal.dbInsideWs = $scope.trashItems;
			} else {
				$scope.modal.dbInsideWs = $scope.modal.wsObj.wsNdb[wsId];
			}
			if ($scope.modal.dbInsideWs.length == 0) {
				$scope.zeroDashboard = true;
			} else {
				$scope.zeroDashboard = false;
			}
		};

		/** @description search box toggling **/
		$scope.toggleSearchBox = function () {
			ServiceFactory.closeAllNotifications();
			if ($scope.searchVisible) {
				$scope.workSpaceAndDashboardSearch = "";
				$scope.searchVisible = false;
			} else {
				$scope.searchVisible = true;
				$timeout(function () {
					$("#search-db").focus();
				}, 10);
			}
		};

		/** @description It will reset the dashboard search from the workspace management page **/
		$scope.resetDashboardSearch = function () {
			$scope.workSpaceAndDashboardSearch = "";
		};

		/** @description Bootstrap tour configuration which will guide user through dashboard designer **/
		$scope.startTour = function (page) {
			ServiceFactory.closeAllNotifications();
			/** https://bootstraptour.com/api/ **/
			var tourSteps = angular.copy($scope.modal.tourConfig[page].steps);
			switch(page){
			case "designerHome":
				tourSteps.unshift({
					"orphan": true,
					"title": "Welcome, " + $scope.modal.AUTH_INFO.user.userName,
					"placement": "bottom",
					"content": "This tour of Dashboard designer will guide you through the action items on this home page"
				});
				break;
			default:
				break;
			}
			
			// Instance the tour
			var tour = new Tour({
				name: $scope.modal.tourConfig[page].name,
				steps: tourSteps,
				smartPlacement: true,
				storage: false,
				backdrop: true,
				animation: false,
				template: '<div class="popover tour"><div class="arrow">&nbsp;</div><h3 class="popover-title">&nbsp;</h3><div class="popover-content">&nbsp;</div><div class="popover-navigation"><button class="btn btn-default" data-role="prev">&laquo; Prev</button> <button class="btn btn-default" data-role="next">Next &raquo;</button> <button class="btn btn-default" data-role="end">End tour</button></div></div>'
			});

			if (tour.ended()) {
				// Restart the tour
				tour.restart();
			} else {
				// Initialize the tour
				tour.init();
				// Start the tour after page loaded
				tour.start();
			}
		};
	};
	/** @description Controller definition **/
	angular.module("designer")
	.controller("MainMenuController", ["$scope", "$window", "ServiceFactory", "DesignerFactory", "$compile", "$translate", "$timeout", "$interval",  "$mdMenu", "$document", mainMenuControllerFn]);
	
})();
//# sourceURL=MainMenuController.js