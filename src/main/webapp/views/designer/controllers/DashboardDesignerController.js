/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: DashboardDesignerController.js
 * @description It controls all the activities going on in design area 
 * **/
(function() {
	/** Controller function for Designer Operations
	 * @param  {Object} $rootScope         	The rootScope object
	 * @param  {Object} $scope         		The rootScope object
	 * @param  {Object} $timeout        	The timeout object
	 * @param  {Object} ServiceFactory 		The ServiceFactory
	 * @param  {Object} DesignerFactory     The DesignerFactory
	 * @param  {Object} $translate         	The translate
	 * @param  {Object} $cacheFactory       The cacheFactory
	 * @return {undefined}                  undefined
	 */
    var dashboardDesignerControllerFn = function($rootScope, $scope, $timeout, ServiceFactory, DesignerFactory, $translate, $cacheFactory, textAngularManager) {
        $scope.modal = DesignerFactory;
        $scope.selectedTemplate = {};
        $scope.gradientColorList = [];
        $scope.customprop = {};
        $scope.selectedTheme = {};
        $scope.selectedGlobalProperty = {};
        $scope.designerThemeInfo = {};
        $scope.custompropBubbleBand = {};
        $scope.custompropRangeIndicator = {};
        $scope.custompropBulletBand = {};
        $scope.custompropGaugeIndicator = {};
        $scope.prePos = {};
        $scope.cSpaceMap = {};
        $scope.tabIndex = 0;
        $scope.isOpen = true;
        /** variable to set the selected component json, used in Dataset windows/ prop palette header **/
        $scope.component = "";
		$scope.cAllJson = {};
		$scope.customThemeUpdateDropdown = {"heading":""};
        
        /**
         * Adds a dashboard
         * @param {String} dId        The dashboard id
         * @param {String} dName      The dashbaord name
         * @param {Function} callBack   The Callback, called when new dashboard has been added
         * @param {Boolean} responsive Flag to know the dashboard is responsive or not
         */
        $scope.addNewDashboardDiv = function(dId, dName, callBack, responsive) {
            $scope.loadComps();
            ServiceFactory.getJsonFileData("./resources/data/property/dashboard.data", function(propjson) {
	             $scope.modal.globalFontProperties = propjson["Global Font And Themes"][4]["options"];
	         });
	       	ServiceFactory.getJsonFileData("./resources/bizvizchart-themes/default-theme/chart/CopyComponent.data", function(copyjson) {
	             $scope.modal.copyJson = copyjson["Properties"]["Object"];
	        });
			ServiceFactory.getJsonFileData("./resources/bizvizchart-themes/default-theme/AllComponentsData.data", function(cjson) {
				 $scope.cAllJson = cjson;
			});
            ServiceFactory.getJsonFileData("./resources/data/dashboard.data", function(dJson) {
                $scope.modal.selectedDashboard = {
                    "id": dId,
                    "name": dName,
                    "json": dJson
                };
                $scope.modal.selectedDashboard.componentObjectList = {};
                $scope.modal.selectedDashboard.json.Dashboard.id = dId;
                $scope.modal.selectedDashboard.json.Dashboard.name = dName;
                $scope.setSnapToGridSize();
                $scope.modal.layoutType = "AbsoluteLayout";
                $scope.appendDesignDataForDashboard();
                $scope.selectedTheme[$scope.getActiveDashboardId()] = dJson.Dashboard.AbsoluteLayout.designerTheme ? dJson.Dashboard.AbsoluteLayout.designerTheme : "default-theme";
                $scope.loadDesignerThemeInfo($scope.selectedTheme[$scope.getActiveDashboardId()], function() {
                    $scope.initHintVariables(dId);
                    if (responsive) {
                        var tPath = $scope.selectedTemplate.tPath || $scope.modal.responsiveTemplates[0];
                        ServiceFactory.getJsonFileData(tPath, function(layout) {
                            $scope.modal.selectedDashboard.json.Dashboard["Containers"] = layout;
                            $scope.modal.selectedDashboard.json.Dashboard["responsive"] = true;
                            callBack(dId, dName, dJson, responsive);
                        });
                    } else {
                        callBack(dId, dName, dJson);
                    }
                    $scope.modal.dashboards.push($scope.modal.selectedDashboard);
                });
                $scope.selectedGlobalProperty[$scope.getActiveDashboardId()] = {};
                $scope.selectedGlobalProperty[$scope.getActiveDashboardId()]["AbsoluteLayout"] = dJson.Dashboard["AbsoluteLayout"].globalProperties;
                $scope.selectedGlobalProperty[$scope.getActiveDashboardId()]["MobileLayout"] = dJson.Dashboard["MobileLayout"].globalProperties;
                $scope.selectedGlobalProperty[$scope.getActiveDashboardId()]["TabletLayout"] = dJson.Dashboard["TabletLayout"].globalProperties;
            });
        };
        /*create new design container for template in designer*/
        $scope.addNewDashboardTemplateDiv = function(dId, dName, callBack, responsive, dJson) {
            $scope.loadComps();
            ServiceFactory.getJsonFileData("./resources/data/dashboard.data", function(data) {
                $scope.modal.selectedDashboard = {
                    "id": dId,
                    "name": dName,
                    "json": dJson
                };
                $scope.modal.selectedDashboard.componentObjectList = {};
                var componentsData = dJson.Dashboard.AbsoluteLayout.Object;
    		    var componentsId = [];
    		    var objectsList = [];
    		    for (var i = 0; i < componentsData.length; i++) {
    		        var objectId = {
    		            objectID: componentsData[i].objectID
    		        	};
    		        var list = {
        		            id: componentsData[i].objectID,
        		            name: componentsData[i].objectName,
        		            refId: componentsData[i].referenceID,
        		        	};
    		        componentsId.push(objectId);
    		        objectsList.push(list);
    		    }
    		    $scope.modal.selectedDashboard.componentObjectList = componentsId;
    		    $scope.modal.selectedDashboard.objectsList = objectsList;
                $scope.modal.selectedDashboard.json.Dashboard.id = dId;
                $scope.modal.selectedDashboard.json.Dashboard.name = dName;
                $scope.setSnapToGridSize();
                $scope.modal.layoutType = "AbsoluteLayout";
                $scope.appendDesignDataForDashboard();
                $scope.selectedTheme[$scope.getActiveDashboardId()] = dJson.Dashboard.AbsoluteLayout.designerTheme ? dJson.Dashboard.AbsoluteLayout.designerTheme : "default-theme";
                $scope.loadDesignerThemeInfo($scope.selectedTheme[$scope.getActiveDashboardId()], function() {
                    $scope.initHintVariables(dId);
                    if (responsive) {
                        var tPath = $scope.selectedTemplate.tPath || $scope.modal.responsiveTemplates[0];
                        ServiceFactory.getJsonFileData(tPath, function(layout) {
                            $scope.modal.selectedDashboard.json.Dashboard["Containers"] = layout;
                            $scope.modal.selectedDashboard.json.Dashboard["responsive"] = true;
                            callBack(dId, dName, dJson, responsive);
                        });
                    } else {
                        callBack(dId, dName, dJson);
                    }
                    $scope.modal.dashboards.push($scope.modal.selectedDashboard);
                });
            });
        };

        /** @description methods add the variable key on components for Scripting and global variable **/
        $scope.appendDesignDataForDashboard = function() {
            if (!$scope.modal.selectedDashboard.json.Dashboard["variable"]) {
                var v_object = $scope.getNewVariableJson({});
                v_object["Key"] = "dashboard";
                $scope.modal.selectedDashboard.json.Dashboard["variable"] = v_object;
            }
        };

        /**
         * Dashboard Context Menu options
         * @param  {String} _selectedOption Option selected
         * @param  {Boolean} _isDisabled     Flag to know disability of menu
         */
        $scope.handleContextMenuSelection = function(_selectedOption, _isDisabled) {
            if (_isDisabled) {
                return false;
            }
            switch (_selectedOption) {
                case "doPreview":
                    $scope.togglePreview();
                    break;
                case "dataSources":
                    $scope.toggleDataSource();
                    break;
                case "components":
                    $scope.toggleComponents();
                    break;
                case "dashboardObjects":
                    $scope.objectBrowserWindow();
                    break;
                case "componentAttributes":
                    $scope.toggleVariableWindow("0");
                    break;
                case "selectAll":
                    $scope.selectAllComponents();
                    break;
                case "dbProperties":
                    $scope.dashboardDblClickHandler($scope.modal.selectedDashboard.id);
                    break;
                case "compProperties":
                    $scope.executeAction($scope.modal.selectedComponentId, "openPropWindow");
                    break;
                case "dataSets":
                    $scope.executeAction($scope.modal.selectedComponentId, "openDatasetWindow");
                    break;
                case "scriptOnChange":
                    $scope.executeAction($scope.modal.selectedComponentId, "openFnWindow");
                    break;
                case "duplicate":
                    $scope.createDuplicate(false, $scope.getComponentbyId($scope.modal.selectedComponentId));
                    break;
                case "copyProperties":
                    $scope.copyProperties($scope.getComponentbyId($scope.modal.selectedComponentId));
                    break;
                case "pasteProperties":
                    $scope.pasteProperties($scope.getComponentbyId($scope.modal.selectedComponentId));
                    break;
                case "compRemove":
                    $scope.executeAction($scope.modal.selectedComponentId, "removeComponent");
                    break;
                case "alignLeft":
                	$scope.alignLeft();
                    break;
                case "alignRight":
                	$scope.alignRight();
                    break;
                case "alignTop":
                	$scope.alignTop();
                    break;
                case "alignBottom":
                	$scope.alignBottom();
                    break;
                case "alignHorizontal":
                	$scope.alignHorizontal();
                    break;
                case "alignVertical":
                	$scope.alignVertical();
                    break;
                case "equalHorizontal":
                	$scope.equalHorizontal();
                    break;
                case "equalVertical":
                	$scope.equalVertical();
                    break;
                case "equalHeight":
                	$scope.equalHeight();
                    break;
                case "equalWidth":
                	$scope.equalWidth();
                    break;
                case "duplicateComponents":
                    $scope.duplicateComponents($scope.modal.listOfSelectedComponents);
                    break;
                case "deleteAll":
                    $scope.doYouWantToDeleteAll();
                    break;
                case "sendToBack":
                    $scope.sendToBack();
                    break;
                case "sendBackward":
                    $scope.sendBackward();
                    break;
                case "bringToFront":
                    $scope.bringToFront();
                    break;
                case "bringForward":
                    $scope.bringForward();
                    break;
                case "manageGroup":
                    //$scope.showAddToGroup();
                	$scope.showGroupPanel();
                    break;
                case "lockComp":
                	$scope.lockSelectedComponent();
                    break;
                case "unLockComp":
                	$scope.unLockSelectedComponent();
                    break;
                default:
                    ServiceFactory.showNotification("Invalid selection", "alert-warning", 3000);
            }
        };

        /**
         * Initialize the context menu functionality on the dashboard and the component
         */
        $scope.initContextMenu = function() {
            $("body").on("mouseenter", ".bizvizComponent", function(_event) {
                _event.stopPropagation();
                $(this).dContextMenu({
                    menuSelector: ["#alignmentCxtMenu", "#compCxtMenu"],
                    containment: ".draggablesParentDiv",
                    menuSelected: function(a, b, c) {
                        var _selectedOption = null;
                        if (b[0] == "a") {
                            _selectedOption = b[0].parentNode.id;
                        } else {
                            _selectedOption = b[0].parentNode.id;
                        }
                        var _isDisabled = $(b[0].parentNode).hasClass("disabled");
                        $scope.handleContextMenuSelection(_selectedOption, _isDisabled);
                    }
                }, $scope.isMultiEleSelected);
            });
            $("body").on("mouseenter", ".draggablesParentDiv", function(_event) {
                _event.stopPropagation();
                $(this).dContextMenu({
                    menuSelector: ["#alignmentCxtMenu", "#dbCxtMenu"],
                    containment: ".draggablesParentDiv",
                    menuSelected: function(a, b, c) {
                        var _selectedOption = null;
                        if (b[0].localName == "a") {
                            _selectedOption = b[0].parentNode.id;
                        } else {
                            _selectedOption = b[0].parentNode.id;
                        }
                        var _isDisabled = $(b[0].parentNode).hasClass("disabled");
                        $scope.handleContextMenuSelection(_selectedOption, _isDisabled);
                    }
                }, $scope.isMultiEleSelected);
            });
        };

        (function() {
            $scope.initContextMenu();
        })();

        /** @description Checks for the multiple component selection
         * @return {Boolean} true if multiple component selected else false **/
        $scope.isMultiEleSelected = function() {
            return $scope.modal.listOfSelectedComponents.length > 1 ? true : false;
        };

        /** @description handler for dashboard click event
         * @param  {String} dId The dashboard id **/
        $scope.dashboardBodyClickHandler = function(dId) {
            //        	$scope.deselectAllComponent();
        };

        /**
         * Double click handler for the dashboard
         * @param  {String} dId The dashboard id
         */
        $scope.dashboardDblClickHandler = function(dId) {
            $scope.createPropertyPalette(dId, true);
        };
        
        $scope.manageDatasetColors = function(component) {
        	var compDataset = component[component.subElement].DataSet;
        	if (compDataset) {
        		if (compDataset["Fields"] && compDataset["Fields"].length > 0) {
        			for (var i = 0; i < compDataset["Fields"].length; i++) {
            			if ($scope.datasetcolor) {
            				if($scope.datasetcolor[compDataset.id]) {
            					$scope.datasetcolor[compDataset.id][compDataset["Fields"][i].Name] = {};
            					$scope.datasetcolor[compDataset.id][compDataset["Fields"][i].Name]["Color"] = compDataset["Fields"][i].Color;
            				} else {
            					$scope.datasetcolor[compDataset.id] = {};
            					$scope.datasetcolor[compDataset.id][compDataset["Fields"][i].Name] = {};
            					$scope.datasetcolor[compDataset.id][compDataset["Fields"][i].Name]["Color"] = compDataset["Fields"][i].Color;
            				}
            			} else {
            				$scope.datasetcolor = {};
            				$scope.datasetcolor[compDataset.id] = {};
            				$scope.datasetcolor[compDataset.id][compDataset["Fields"][i].Name] = {};
            				$scope.datasetcolor[compDataset.id][compDataset["Fields"][i].Name]["Color"] = compDataset["Fields"][i].Color;
            			}
            		}
        		}
        	}
        }
        
        /** @description This method is created for supporting old configured dashboard.
         * TODO New feature/properties added in new releases must be added here as well 
         * @param {Object} component The component object 
         * this method updates for existing components of old dashboard**/
        $scope.SupportOldConfiguredDashboard = function(component) {
            if (component) {
            	$scope.manageDatasetColors(component);
            	component.groupings = component.groupings || "";
                switch (component.objectType) {
					case "datagrid":
                    	component[component.subElement].pagination = (component[component.subElement].pagination === undefined) ?  "false" :component[component.subElement].pagination;
                    	component[component.subElement].maxRow = (component[component.subElement].maxRow == undefined) ? "10" : component[component.subElement].maxRow;
                    	component[component.subElement].exportToCSV = (component[component.subElement].exportToCSV == undefined) ? "true" : component[component.subElement].exportToCSV;
                        break;
                    case "exportppt":
                        component.designData.type = "singleValuedComponent";
                        if(component[component.subElement].exportWindow == undefined){
                    		component[component.subElement].exportWindow = "true";
                    	}
                        component[component.subElement].pdfType = (component[component.subElement].pdfType === undefined) ? "screenshot" : component[component.subElement].pdfType;
                        component[component.subElement].pdfGridType = (component[component.subElement].pdfGridType === undefined) ? "striped" : component[component.subElement].pdfGridType;
                        component[component.subElement].pdfTabularOrientation = (component[component.subElement].pdfTabularOrientation === undefined) ? "l" : component[component.subElement].pdfTabularOrientation;
                        component[component.subElement].pdfFilterDetails = (component[component.subElement].pdfFilterDetails === undefined) ? "false" : component[component.subElement].pdfFilterDetails;
                        component[component.subElement].pdfPages = (component[component.subElement].pdfPages === undefined) ? "single" : component[component.subElement].pdfPages;
                        component[component.subElement].pdfHeadingColor = (component[component.subElement].pdfHeadingColor === undefined) ? "#006684" : component[component.subElement].pdfHeadingColor;
                        component[component.subElement].pdfSubHeadingColor = (component[component.subElement].pdfSubHeadingColor === undefined) ? "#f5f5f5" : component[component.subElement].pdfSubHeadingColor;
                        component[component.subElement].pdfHeadingOpacity = (component[component.subElement].pdfHeadingOpacity === undefined) ? 1 : component[component.subElement].pdfHeadingOpacity;
                        component[component.subElement].pdfSubHeadingOpacity = (component[component.subElement].pdfSubHeadingOpacity === undefined) ? 1 : component[component.subElement].pdfSubHeadingOpacity;
                        component[component.subElement].pdfHFontColor = (component[component.subElement].pdfHFontColor === undefined) ? "#ffffff" : component[component.subElement].pdfHFontColor;
                        component[component.subElement].pdfSHFontColor = (component[component.subElement].pdfSHFontColor === undefined) ? "#000000" : component[component.subElement].pdfSHFontColor;
                        component[component.subElement].showDataServices = (component[component.subElement].showDataServices === undefined) ? "true" : component[component.subElement].showDataServices;
                        component[component.subElement].showExcel = (component[component.subElement].showExcel === undefined) ? "true" : component[component.subElement].showExcel;
                        component[component.subElement].showPpt = (component[component.subElement].showPpt === undefined) ? "true" : component[component.subElement].showPpt;
                        component[component.subElement].showPdf = (component[component.subElement].showPdf === undefined) ? "true" : component[component.subElement].showPdf;
                        component[component.subElement].showPng = (component[component.subElement].showPng === undefined) ? "true" : component[component.subElement].showPng;
                        component[component.subElement].showPrint = (component[component.subElement].showPrint === undefined) ? "true" : component[component.subElement].showPrint;
                        break;
                    case "image":
                    	if(component[component.subElement].cursorType == undefined){
                    		component[component.subElement].cursorType = "default";
                    	}
                        break;
                    case "date":
                    	if(component[component.subElement].enhanceddate == undefined){
                    		component[component.subElement].enhanceddate = false;
                    	}
                    	if(component[component.subElement].datetype == undefined){
                    		component[component.subElement].datetype = "none";
                    	}
                    	if(component[component.subElement].backgroundColor == undefined){
							component[component.subElement].backgroundColor = "#dddddd";
						}
                    	if(component[component.subElement].monthNavigationEnabled == undefined){
                    		component[component.subElement].monthNavigationEnabled = false;
                    	}
                    	if(component[component.subElement].yearRange == undefined){
                    		component[component.subElement].yearRange = "10";
                    	}
                    	if(component[component.subElement].startdatecolor == undefined){
                    		component[component.subElement].startdatecolor = "#000000";
                    	}
                    	if(component[component.subElement].enddatecolor == undefined){
                    		component[component.subElement].enddatecolor = "#000000";
                    	}
                    case "label":
                    	component[component.subElement].labelPadding = component[component.subElement].labelPadding || 0;
                    	component[component.subElement].cursorType = component[component.subElement].cursorType || "pointer";
                    	component[component.subElement].labelTextRotation = component[component.subElement].labelTextRotation || "horizontal";
                    	if(component[component.subElement].borderWidth == undefined){
							component[component.subElement].borderWidth = 0;
						}
                        if(component[component.subElement].hoverEnabled == undefined){
							component[component.subElement].hoverEnabled = false;
						}
                    	if(component[component.subElement].hoverColor == undefined){
						   component[component.subElement].hoverColor = "#dddddd";
						}
                    	$scope.addDefaultLabelFormatterProperties(component)
                    	break;
                    case "SVGImage":
                    	if(component[component.subElement].cursorType == undefined){
                    		component[component.subElement].cursorType = "pointer";
                    	}
                        break;
                    case "SVGShape":
                    	if(component[component.subElement].cursorType == undefined){
                    		component[component.subElement].cursorType = "pointer";
                    	}
                        break;
                    case "filterchips":
                    	if(component[component.subElement].imgData == undefined){
                    		component[component.subElement].imgData = "";
                    	}
                    	if(component[component.subElement].chipsTitle == undefined){
                    		component[component.subElement].chipsTitle = "Applied Filters";
                    	}
                    	if(component[component.subElement].btnTitle == undefined){
                    		component[component.subElement].btnTitle = "All Filters";
                    	}
                    	if(component[component.subElement].popupTitle == undefined){
                    		component[component.subElement].popupTitle = "Additional Filters";
                    	}
                    	if(component[component.subElement].chipsBgColor == undefined){
                    		component[component.subElement].chipsBgColor = "#efefef";
                    	}
                    	if(component[component.subElement].chipsFontColor == undefined){
                    		component[component.subElement].chipsFontColor = "#000000";
                    	}
                    	if(component[component.subElement].btnBgColor == undefined){
                    		component[component.subElement].btnBgColor = "#ffffff";
                    	}
						if(component[component.subElement].filterBgColor == undefined){
                    		component[component.subElement].filterBgColor = "#ffffff";
                    	}
						if(component[component.subElement].filterHeaderBgColor == undefined){
                    		component[component.subElement].filterHeaderBgColor = "#EFF0F0";
                    	}
                    	if(component[component.subElement].closeBtnBgColor == undefined){
                    		component[component.subElement].closeBtnBgColor = "#000000";
                    	}
                    	if(component[component.subElement].showAllFilterButton == undefined){
                    		component[component.subElement].showAllFilterButton = true;
                    	}
                    	if(component[component.subElement].showChipsCount == undefined){
                    		component[component.subElement].showChipsCount = true;
                    	}
                        break;
                    case "gauge":
                    	component[component.subElement].SecondaryUnit = component[component.subElement].SecondaryUnit || "none";
                    	component[component.subElement].Unit = component[component.subElement].Unit || "none";
                    	component[component.subElement].Precision = component[component.subElement].Precision || "default";
                    	component[component.subElement].SignPosition = component[component.subElement].SignPosition || "prefix";
                    	break;
                    case "semigauge":
                    	component[component.subElement].SecondaryUnit = component[component.subElement].SecondaryUnit || "none";
                    	component[component.subElement].Unit = component[component.subElement].Unit || "none";
                    	component[component.subElement].Precision = component[component.subElement].Precision || "default";
                    	component[component.subElement].SignPosition = component[component.subElement].SignPosition || "prefix";
                    	break;
                    case "legend":
                    	if(component.Legend.associatedChartId !== "") {
                    		$scope.addDefaultLegendProperties(component);
                    	}
                    	component.Legend.legendTextAlign = (component.Legend.legendTextAlign === undefined) ? "left" : component.Legend.legendTextAlign;
                    	component.Legend.rowPadding = (component.Legend.rowPadding === undefined) ? "4" : component.Legend.rowPadding;
                    	component.Legend.columnPadding = (component.Legend.columnPadding === undefined) ? "0" : component.Legend.columnPadding;
                    	break;
                    case "hslider":
                    	if(component[component.subElement].backgroundColor == undefined){
                    		component[component.subElement].backgroundColor = "#FFFFFF";
                    		component[component.subElement].backgroundAlpha = "0";
                    	}
                    	component[component.subElement].unit = (component[component.subElement].unit === undefined) ?  "auto" :component[component.subElement].unit;
                    	component[component.subElement].freezeHandle = (component[component.subElement].freezeHandle === undefined) ? "false":component[component.subElement].freezeHandle;
                    	component[component.subElement].enhancedHSlider = (component[component.subElement].enhancedHSlider === undefined) ? "false":component[component.subElement].enhancedHSlider;
                        break;
                    case "vslider":
                    	if(component[component.subElement].backgroundColor == undefined){
                    		component[component.subElement].backgroundColor = "#FFFFFF";
                    		component[component.subElement].backgroundAlpha = "0";
                    	}
                    	component[component.subElement].unit = (component[component.subElement].unit === undefined) ?  "auto" :component[component.subElement].unit;
                    	component[component.subElement].freezeHandle = (component[component.subElement].freezeHandle === undefined) ? "false":component[component.subElement].freezeHandle;
                    	component[component.subElement].enhancedVSlider = (component[component.subElement].enhancedVSlider === undefined) ? "false":component[component.subElement].enhancedVSlider;
                        break;
                    case "chart":
                    	component[component.subElement].updatedDesign = (component[component.subElement].updatedDesign === undefined) ?  "false" :component[component.subElement].updatedDesign;
                    	component[component.subElement].exportToCSV = (component[component.subElement].exportToCSV === undefined) ?  true :component[component.subElement].exportToCSV;
                        switch (component[component.subElement].Type) {
                        case "Bar":
                            if(component[component.subElement].showSettingMenuButton == undefined){
                        		component[component.subElement].showSettingMenuButton = false;
                        	}
                        	if(component[component.subElement].controlBarWidth == "350"){
                        		component[component.subElement].controlBarWidth = "auto";
                        	}
                            if(component[component.subElement].enableAnimation == undefined){
                            	component[component.subElement].enableAnimation = false;
                            }
							if (component[component.subElement].enablethresholdfill == undefined) {
								component[component.subElement].enablethresholdfill = false;
							}
							if (component[component.subElement].thresholdfilllevel == undefined) {
								component[component.subElement].thresholdfilllevel = "low,middle,top";
							}
							if (component[component.subElement].thresholdfillcolor == undefined) {
								component[component.subElement].thresholdfillcolor = "#ffea00,#00FF00,#ff0000";
							}
							if (component[component.subElement].thresholdfillopacity == undefined) {
								component[component.subElement].thresholdfillopacity = "0.3,0.3,0.3";
							}
							if (component[component.subElement].thresholdfilllabel == undefined) {
								component[component.subElement].thresholdfilllabel = "Low,Middle,Top";
							}
							if (component[component.subElement].thresholdfilllabelcolor == undefined) {
								component[component.subElement].thresholdfilllabelcolor = "#000000,#000000,#000000";
							}
                            //Slider properties DAS-564
							if(component[component.subElement].showSlider == undefined){
                            	component[component.subElement].showSlider = false;
                            }
                            if(component[component.subElement].sliderBorderColor == undefined){
                            	component[component.subElement].sliderBorderColor = "#cccccc";
                            }
                            if(component[component.subElement].sliderHeightRatio == undefined){
                            	component[component.subElement].sliderHeightRatio = "7";
                            }
                            if(component[component.subElement].sliderRangeFlag == undefined){
                            	component[component.subElement].sliderRangeFlag = false;
                            }
                            if(component[component.subElement].sliderRangeValue == undefined){
                            	component[component.subElement].sliderRangeValue = "10";
                            }
                            if(component[component.subElement].sliderPosition == undefined){
                            	component[component.subElement].sliderPosition = "default";
                            }
                            if(component[component.subElement].sliderBorderOpacity == undefined){
                            	component[component.subElement].sliderBorderOpacity = "0.5";
                            }
                            if(component[component.subElement].sliderOpacitySelection == undefined){
                            	component[component.subElement].sliderOpacitySelection = "0.5";
                            }
                            if(component[component.subElement].sliderOpacityContainer == undefined){
                            	component[component.subElement].sliderOpacityContainer = "0.1";
                            }
                            if(component[component.subElement].showRangeSelector == undefined){
                            	component[component.subElement].showRangeSelector = false;
                            }
                            if(component[component.subElement].rangeSelectorOpacity == undefined){
                            	component[component.subElement].rangeSelectorOpacity = "0.2";
                            }
                            if(component[component.subElement].showSliderText == undefined){
                            	component[component.subElement].showSliderText = false;
                            }
                            if(component[component.subElement].sliderRange == undefined){
                            	component[component.subElement].sliderRange = "auto";
                            }
                        	component[component.subElement].stackBorderRadius = (component[component.subElement].stackBorderRadius != undefined) ? component[component.subElement].stackBorderRadius : "0";
                        	component[component.subElement].stackBorderColor = (component[component.subElement].stackBorderColor != undefined) ? component[component.subElement].stackBorderColor : "#ffffff";
                        	component[component.subElement].stackBorderWidth = (component[component.subElement].stackBorderWidth != undefined) ? component[component.subElement].stackBorderWidth : "0";
                        	if (component.Chart.DataSet && component.Chart.DataSet.Fields) {
                            	for (var i3 = 0; i3 < component.Chart.DataSet.Fields.length; i3++) {
                            		if (component.Chart.DataSet.Fields[i3].Type == "Series") {
                            			var field3 = component.Chart.DataSet.Fields[i3];
                            			field3.DataLabelCustomProperties.datalabelBackgroundRect = (field3.DataLabelCustomProperties.datalabelBackgroundRect !== undefined) ? field3.DataLabelCustomProperties.datalabelBackgroundRect : false;
                            			field3.DataLabelCustomProperties.datalabelBackgroundRectColor = (field3.DataLabelCustomProperties.datalabelBackgroundRectColor !== undefined) ? field3.DataLabelCustomProperties.datalabelBackgroundRectColor : "#ffffff";
                            			field3.DataLabelCustomProperties.datalabelStrokeColor = (field3.DataLabelCustomProperties.datalabelStrokeColor !== undefined) ? field3.DataLabelCustomProperties.datalabelStrokeColor : "#000000";
                            		}
                                }
                            }
                            if (component[component.subElement].ShowXAxisThreshold == undefined) {
									component[component.subElement].ShowXAxisThreshold = false;
								}
								if (component[component.subElement].MinimumXAxisThreshold == undefined) {
									component[component.subElement].MinimumXAxisThreshold = "0";
								}
								if (component[component.subElement].MaximumXAxisThreshold == undefined) {
									component[component.subElement].MaximumXAxisThreshold = "50";
								}
								if (component[component.subElement].minimumthresholdstrokecolor == undefined) {
									component[component.subElement].minimumthresholdstrokecolor = "#00FF00";
								}
								if (component[component.subElement].maximumthresholdstrokecolor == undefined) {
									component[component.subElement].maximumthresholdstrokecolor = "#FF0000";
								}
                        	break;
                        case "BenchmarkAnalysis":
								if (component[component.subElement].headerfontsize == undefined) {
									component[component.subElement].headerfontsize = "16";
								}
								if (component[component.subElement].headerfontcolor == undefined) {
									component[component.subElement].headerfontcolor = "#000000";
								}
								if (component[component.subElement].headerchromecolor == undefined) {
									component[component.subElement].headerchromecolor = "#E7E7E7";
								}
								if (component[component.subElement].headerfontweight == undefined) {
									component[component.subElement].headerfontweight = "bold";
								}
								if (component[component.subElement].gridlabelfontcolor == undefined) {
									component[component.subElement].gridlabelfontcolor = "#000000";
								}
								if (component[component.subElement].gridlabelfontsize == undefined) {
									component[component.subElement].gridlabelfontsize = "14";
								}
								if (component[component.subElement].gridlabelfontweight == undefined) {
									component[component.subElement].gridlabelfontweight = "normal";
								}
								if (component[component.subElement].fitColumns == undefined) {
									component[component.subElement].fitColumns = true;
								}
								if (component[component.subElement].textWrap == undefined) {
									component[component.subElement].textWrap = false;
								}
								if (component[component.subElement].showdatavalidation == undefined) {
									component[component.subElement].showdatavalidation = true;
								}
							
                        case "Bubble":
                            	$scope.addDynamicRangeProperties(component);
                            	$scope.addConditionalCategoryColors(component);
                                component[component.subElement].SolidColorFill = component[component.subElement].SolidColorFill || "false";
                                if (component.Chart.DataSet && component.Chart.DataSet.Fields) {
                                    for (var i = 0; i < component.Chart.DataSet.Fields.length; i++) {
                                        if (component.Chart.DataSet.Fields[i].Type == "Series") {
                                            var field = component.Chart.DataSet.Fields[i];
                                            if (IsBoolean(component[component.subElement].rangeEnabledSeries) == undefined) {
                                                field.ColorField = field.ColorField;
                                            } else {
                                                if (IsBoolean(component[component.subElement].rangeEnabledSeries)) {
                                                    field.ColorField = (field.ColorField) ? field.ColorField : "";
                                                } else {
                                                    field.ColorField = "";
                                                }
                                            }
                                        }
                                    }
                                }
                                break;
                            case "BoxPlot":
                            	component[component.subElement].legendfontFamily  = component[component.subElement].legendfontFamily || "Ubuntu";
                            	break;
                            case "CandleStick":
                            	component[component.subElement].showTooltipCategory  = component[component.subElement].showTooltipCategory || "true";
                            	break;
                            case "Circumplex":
                            	component[component.subElement].lineWidth = component[component.subElement].lineWidth || 100;
                                if(component[component.subElement].enableAnimation == undefined){
                                	component[component.subElement].enableAnimation = false;
                                }
                                break;
                            case "Decomposition":
                            	component[component.subElement].showPercentage = component[component.subElement].showPercentage || "true";
                            	component[component.subElement].maxNodes = component[component.subElement].maxNodes || "10";
                            	component[component.subElement].aggregationType = component[component.subElement].aggregationType || "sum";
                            	component[component.subElement].nodeColor = component[component.subElement].nodeColor || "#f5f5f5";
                                component[component.subElement].fillColor = component[component.subElement].fillColor || "#0d78bf";
                                component[component.subElement].nodeHeight = component[component.subElement].nodeHeight || 30; 
                                component[component.subElement].labelFontColor = component[component.subElement].labelFontColor || "#000000";
                                component[component.subElement].labelFontSize = component[component.subElement].labelFontSize || "12";
                                component[component.subElement].labelFontStyle = component[component.subElement].labelFontStyle || "normal";
                                component[component.subElement].labelFontWeight = component[component.subElement].labelFontWeight || "normal";
                                component[component.subElement].labelFontFamily = component[component.subElement].labelFontFamily || "BizvizFont";    
                                component[component.subElement].labelValueFontColor = component[component.subElement].labelValueFontColor || "#000000";
                                component[component.subElement].labelValueFontSize = component[component.subElement].labelValueFontSize || "12";
                                component[component.subElement].labelValueFontStyle = component[component.subElement].labelValueFontStyle || "normal";
                                component[component.subElement].labelValueFontWeight = component[component.subElement].labelValueFontWeight || "normal";
                                component[component.subElement].labelValueFontFamily = component[component.subElement].labelValueFontFamily || "BizvizFont";                                 
                                break;
                            case "GroupBar":
                            	$scope.addConditionalCategoryColors(component);
                            	component[component.subElement].yAxis.subCategoryFontSize = (component[component.subElement].yAxis.subCategoryFontSize) ? component[component.subElement].yAxis.subCategoryFontSize : "10";
                                component[component.subElement].stackBorderRadius = (component[component.subElement].stackBorderRadius != undefined) ? component[component.subElement].stackBorderRadius : "0";
                        		component[component.subElement].stackBorderColor = (component[component.subElement].stackBorderColor != undefined) ? component[component.subElement].stackBorderColor : "#ffffff";
                        		component[component.subElement].stackBorderWidth = (component[component.subElement].stackBorderWidth != undefined) ? component[component.subElement].stackBorderWidth : "0";
                                if (component[component.subElement].SubCategoryColors == undefined) {
                                    component[component.subElement].SubCategoryColors = {};
                                    component[component.subElement].SubCategoryColors.subCategoryDefaultColor = "";
                                    component[component.subElement].SubCategoryColors.subCategoryDefaultColorSet = "";
                                    component[component.subElement].SubCategoryColors.showColorsFromSubCategoryName = "false";
                                    component[component.subElement].SubCategoryColors.subCategoryColor = [];
                                }
                                if(component[component.subElement].enableAnimation == undefined){
                                	component[component.subElement].enableAnimation = false;
                                }
								//Slider properties DAS-1251
								if(component[component.subElement].showSlider == undefined){
	                            	component[component.subElement].showSlider = false;
	                            }
	                            if(component[component.subElement].sliderBorderColor == undefined){
	                            	component[component.subElement].sliderBorderColor = "#cccccc";
	                            }
	                            if(component[component.subElement].sliderHeightRatio == undefined){
	                            	component[component.subElement].sliderHeightRatio = "7";
	                            }
	                            if(component[component.subElement].sliderRangeFlag == undefined){
	                            	component[component.subElement].sliderRangeFlag = false;
	                            }
	                            if(component[component.subElement].sliderRangeValue == undefined){
	                            	component[component.subElement].sliderRangeValue = "10";
	                            }
	                            if(component[component.subElement].sliderPosition == undefined){
	                            	component[component.subElement].sliderPosition = "default";
	                            }
	                            if(component[component.subElement].sliderBorderOpacity == undefined){
	                            	component[component.subElement].sliderBorderOpacity = "0.5";
	                            }
	                            if(component[component.subElement].sliderOpacitySelection == undefined){
	                            	component[component.subElement].sliderOpacitySelection = "0.5";
	                            }
	                            if(component[component.subElement].sliderOpacityContainer == undefined){
	                            	component[component.subElement].sliderOpacityContainer = "0.1";
	                            }
	                            if(component[component.subElement].showRangeSelector == undefined){
	                            	component[component.subElement].showRangeSelector = false;
	                            }
	                            if(component[component.subElement].rangeSelectorOpacity == undefined){
	                            	component[component.subElement].rangeSelectorOpacity = "0.2";
	                            }
	                            if(component[component.subElement].showSliderText == undefined){
	                            	component[component.subElement].showSliderText = false;
	                            }
	                            if(component[component.subElement].sliderRange == undefined){
	                            	component[component.subElement].sliderRange = "auto";
	                            }
                                if (component.Chart.DataSet && component.Chart.DataSet.Fields) {
                                	for (var i3 = 0; i3 < component.Chart.DataSet.Fields.length; i3++) {
                                		if (component.Chart.DataSet.Fields[i3].Type == "Series") {
                                			var field3 = component.Chart.DataSet.Fields[i3];
                                			field3.DataLabelCustomProperties.datalabelBackgroundRect = (field3.DataLabelCustomProperties.datalabelBackgroundRect !== undefined) ? field3.DataLabelCustomProperties.datalabelBackgroundRect : false;
                                			field3.DataLabelCustomProperties.datalabelBackgroundRectColor = (field3.DataLabelCustomProperties.datalabelBackgroundRectColor !== undefined) ? field3.DataLabelCustomProperties.datalabelBackgroundRectColor : "#ffffff";
                                			field3.DataLabelCustomProperties.datalabelStrokeColor = (field3.DataLabelCustomProperties.datalabelStrokeColor !== undefined) ? field3.DataLabelCustomProperties.datalabelStrokeColor : "#000000";
                                		}
                                    }
                                }
                                break;
                            case "GroupColumn":
                            	component[component.subElement].stackBorderRadius = (component[component.subElement].stackBorderRadius != undefined) ? component[component.subElement].stackBorderRadius : "0";
	                        	component[component.subElement].stackBorderColor = (component[component.subElement].stackBorderColor != undefined) ? component[component.subElement].stackBorderColor : "#ffffff";
	                        	component[component.subElement].stackBorderWidth = (component[component.subElement].stackBorderWidth != undefined) ? component[component.subElement].stackBorderWidth : "0";
	                        	component[component.subElement].xAxis.xAxisCategoryTextWrap = (component[component.subElement].xAxis.xAxisCategoryTextWrap) ? component[component.subElement].xAxis.xAxisCategoryTextWrap : "false";
	                        	component[component.subElement].xAxis.xAxisSubCategoryTextWrap = (component[component.subElement].xAxis.xAxisSubCategoryTextWrap) ? component[component.subElement].xAxis.xAxisSubCategoryTextWrap : "false";
	                        	if (component.Chart.DataSet && component.Chart.DataSet.Fields) {
                                	for (var i3 = 0; i3 < component.Chart.DataSet.Fields.length; i3++) {
                                		if (component.Chart.DataSet.Fields[i3].Type == "Series") {
                                			var field3 = component.Chart.DataSet.Fields[i3];
                                			field3.DataLabelCustomProperties.datalabelBackgroundRect = (field3.DataLabelCustomProperties.datalabelBackgroundRect !== undefined) ? field3.DataLabelCustomProperties.datalabelBackgroundRect : false;
                                			field3.DataLabelCustomProperties.datalabelBackgroundRectColor = (field3.DataLabelCustomProperties.datalabelBackgroundRectColor !== undefined) ? field3.DataLabelCustomProperties.datalabelBackgroundRectColor : "#ffffff";
                                			field3.DataLabelCustomProperties.datalabelStrokeColor = (field3.DataLabelCustomProperties.datalabelStrokeColor !== undefined) ? field3.DataLabelCustomProperties.datalabelStrokeColor : "#000000";
                                		}
                                    }
                                }
                                break;
                            case "HeatMap":
                            	$scope.addDynamicRangeProperties(component);
                            	if (component[component.subElement].bgGradients === "0xffffff") {
                        	        component[component.subElement].bgGradients = "#ffffff";
                            	}
                                component[component.subElement].SolidColorFill = component[component.subElement].SolidColorFill || "false";
                                if(component[component.subElement].enableAnimation == undefined){
                                	component[component.subElement].enableAnimation = false;
                                }
                                if(component[component.subElement].xAxis.xAxisTextWrap == undefined){
                                	component[component.subElement].xAxis.xAxisTextWrap = false;
                                }
                                break;
                            case "KnowledgeGraph":
                            	component[component.subElement].customNodeTypeShapes = component[component.subElement].customNodeTypeShapes || "dot,box,ellipsis,star";
                            	component[component.subElement].customNodeRangeShapes = component[component.subElement].customNodeRangeShapes || "dot,box,ellipsis,star";
                            	component[component.subElement].customNodeTypeColors = component[component.subElement].customNodeTypeColors || "#E08283,#38d3a9,#797979,#eeeeee";
                            	component[component.subElement].customNodeRangeColors = component[component.subElement].customNodeRangeColors || "#E08283,#38d3a9,#797979,#eeeeee";  
                            	component[component.subElement].customNodeLevelShapes = component[component.subElement].customNodeLevelShapes || "dot,star,square";
                            	component[component.subElement].customNodeLevelColors = component[component.subElement].customNodeLevelColors || "#E08283,#38d3a9,#797979";  
                            	component[component.subElement].shapeLevel = component[component.subElement].shapeLevel || "Level1,Level2,Level3"; 
                            	component[component.subElement].colorLevel = component[component.subElement].colorLevel || "Level1,Level2,Level3"; 
                            	component[component.subElement].shapeType = component[component.subElement].shapeType || "Default"; 
                            	component[component.subElement].shapeDisplayName = component[component.subElement].shapeDisplayName || "Low,Medium,High,Very High";  
                            	component[component.subElement].colorDisplayName = component[component.subElement].colorDisplayName || "Low,Medium,High,Very High"; 
                            	component[component.subElement].customShapeRange = component[component.subElement].customShapeRange || "0~5,5~10,10~20,20~30";  
                            	component[component.subElement].customColorRange = component[component.subElement].customColorRange || "0~5,5~10,10~20,20~30"; 
                                break;
                            case "Line":
                            	$scope.addConditionalCategoryColors(component);
                                if (component.Chart.DataSet && component.Chart.DataSet.Fields) {
                                	for (var i1 = 0; i1 < component.Chart.DataSet.Fields.length; i1++) {
                                		if (component.Chart.DataSet.Fields[i1].Type == "Series") {
                                			var field1 = component.Chart.DataSet.Fields[i1];
                                			field1.LineType = (field1.LineType) ? field1.LineType : "straight";
                                			field1.LineWidth = ( field1.LineWidth !== undefined && field1.LineWidth !== "" ) ?  field1.LineWidth : 2;
                                		}
                                    }
								}
								if (component[component.subElement].showAnnotation == undefined) {
									component[component.subElement].showAnnotation = false;
								}
								if (component[component.subElement].annotationDataType == undefined) {
									component[component.subElement].annotationDataType = "number";
								}
								if (component[component.subElement].annotationRadius == undefined) {
									component[component.subElement].annotationRadius = "1";
								}
								if (component[component.subElement].annotationOpacity == undefined) {
									component[component.subElement].annotationOpacity = "1";
								}
								if (component[component.subElement].annotationColor == undefined) {
									component[component.subElement].annotationColor = "#FF5733";
								}
								if (component[component.subElement].annotationFormat == undefined) {
									component[component.subElement].annotationFormat = "year";
								}
								if (component[component.subElement].annotationxdata == undefined) {
									component[component.subElement].annotationxdata = [];
								}
								if (component[component.subElement].AnnotationTooltipTitle == undefined) {
									component[component.subElement].AnnotationTooltipTitle = "Annotation";
								}
								if (component[component.subElement].lineType == undefined) {
									component[component.subElement].lineType = "false";
								}
								if (component[component.subElement]["Annotation"] === undefined) {
									component[component.subElement]["Annotation"] = {
										"Category": "2013, 2015, 2017",
										"Label": "Low, Medium, High",
										"DataSource": "",
										"DataSourceId": "",
										"DataLabel": "",
										"DataValue": ""
									};
								}
								if (component[component.subElement].ShowYAxisThreshold == undefined) {
									component[component.subElement].ShowYAxisThreshold = false;
								}
								if (component[component.subElement].MinimumYAxisThreshold == undefined) {
									component[component.subElement].MinimumYAxisThreshold = "0";
								}
								if (component[component.subElement].MaximumYAxisThreshold == undefined) {
									component[component.subElement].MaximumYAxisThreshold = "50";
								}
								if (component[component.subElement].minimumthresholdstrokecolor == undefined) {
									component[component.subElement].minimumthresholdstrokecolor = "#00FF00";
								}
								if (component[component.subElement].maximumthresholdstrokecolor == undefined) {
									component[component.subElement].maximumthresholdstrokecolor = "#FF0000";
								}
								if (component[component.subElement].enableThresholdFill == undefined) {
									component[component.subElement].enableThresholdFill = false;
								}
								if (component[component.subElement].thresholdFillLevel == undefined) {
									component[component.subElement].thresholdFillLevel = "low,middle,top";
								}
								if (component[component.subElement].thresholdFillColor == undefined) {
									component[component.subElement].thresholdFillColor = "#ffea00,#00FF00,#ff0000";
								}
								if (component[component.subElement].thresholdFillOpacity == undefined) {
									component[component.subElement].thresholdFillOpacity = "0.3,0.3,0.3";
								}
								if (component[component.subElement].thresholdFillLabel == undefined) {
									component[component.subElement].thresholdFillLabel = "Low,Middle,Top";
								}
								if (component[component.subElement].thresholdFillLabelColor == undefined) {
									component[component.subElement].thresholdFillLabelColor = "#000000,#000000,#000000";
								}
								break;
							case "Mixed":
								if (component[component.subElement].ShowYAxisThreshold == undefined) {
									component[component.subElement].ShowYAxisThreshold = false;
								}
								if (component[component.subElement].MinimumYAxisThreshold == undefined) {
									component[component.subElement].MinimumYAxisThreshold = "0";
								}
								if (component[component.subElement].MaximumYAxisThreshold == undefined) {
									component[component.subElement].MaximumYAxisThreshold = "50";
								}
								if (component[component.subElement].minimumthresholdstrokecolor == undefined) {
									component[component.subElement].minimumthresholdstrokecolor = "#00FF00";
								}
								if (component[component.subElement].maximumthresholdstrokecolor == undefined) {
									component[component.subElement].maximumthresholdstrokecolor = "#FF0000";
								}
								if (component[component.subElement].enablethresholdfill == undefined) {
									component[component.subElement].enablethresholdfill = false;
								}
								if (component[component.subElement].thresholdfilllevel == undefined) {
									component[component.subElement].thresholdfilllevel = "low,middle,top";
								}
								if (component[component.subElement].thresholdfillcolor == undefined) {
									component[component.subElement].thresholdfillcolor = "#ffea00,#00FF00,#ff0000";
								}
								if (component[component.subElement].thresholdfillopacity == undefined) {
									component[component.subElement].thresholdfillopacity = "0.3,0.3,0.3";
								}
								if (component[component.subElement].thresholdfilllabel == undefined) {
									component[component.subElement].thresholdfilllabel = "Low,Middle,Top";
								}
								if (component[component.subElement].thresholdfilllabelcolor == undefined) {
									component[component.subElement].thresholdfilllabelcolor = "#000000,#000000,#000000";
								}
								if (component[component.subElement].showAnnotation == undefined) {
									component[component.subElement].showAnnotation = false;
								}
								if (component[component.subElement].annotationDataType == undefined) {
									component[component.subElement].annotationDataType = "number";
								}
								if (component[component.subElement].annotationRadius == undefined) {
									component[component.subElement].annotationRadius = "1";
								}
								if (component[component.subElement].annotationOpacity == undefined) {
									component[component.subElement].annotationOpacity = "1";
								}
								if (component[component.subElement].annotationColor == undefined) {
									component[component.subElement].annotationColor = "#FF5733";
								}
								if (component[component.subElement].annotationFormat == undefined) {
									component[component.subElement].annotationFormat = "year";
								}
								if (component[component.subElement].annotationxdata == undefined) {
									component[component.subElement].annotationxdata = [];
								}
								if (component[component.subElement].AnnotationTooltipTitle == undefined) {
									component[component.subElement].AnnotationTooltipTitle = "Annotation";
								}
								if (component[component.subElement].lineType == undefined) {
									component[component.subElement].lineType = "false";
								}
								if (component[component.subElement]["Annotation"] === undefined) {
									component[component.subElement]["Annotation"] = {
										"Category": "2013, 2015, 2017",
										"Label": "Low, Medium, High",
										"DataSource": "",
										"DataSourceId": "",
										"DataLabel": "",
										"DataValue": ""
									};
								}
						break;
							case "Pie":
                                if(component[component.subElement].showSettingMenuButton == undefined){
                            		component[component.subElement].showSettingMenuButton = false;
                            	}
                            	if(component[component.subElement].actualValues == undefined){
                            		component[component.subElement].actualValues = false;
                            	}
                                if(component[component.subElement].enableAnimation == undefined){
                                	component[component.subElement].enableAnimation = false;
                                }
                                if(component.showSliceValue !== undefined){
                                	component[component.subElement].showSliceValue = component.showSliceValue;
                                	delete component["showSliceValue"];
                                }
                                if(component.sliceLimit !== undefined){
                                	component[component.subElement].sliceLimit = component.sliceLimit;
                                	delete component["sliceLimit"];
                                }
                            	$scope.addConditionalCategoryColors(component);
                            	if (component.Chart.DataSet && component.Chart.DataSet.Fields) {
                                	for (var i3 = 0; i3 < component.Chart.DataSet.Fields.length; i3++) {
                                		if (component.Chart.DataSet.Fields[i3].Type == "Series") {
                                			var field3 = component.Chart.DataSet.Fields[i3];
                                			field3.DataLabelCustomProperties.datalabelBackgroundRect = (field3.DataLabelCustomProperties.datalabelBackgroundRect !== undefined) ? field3.DataLabelCustomProperties.datalabelBackgroundRect : false;
                                			field3.DataLabelCustomProperties.datalabelBackgroundRectColor = (field3.DataLabelCustomProperties.datalabelBackgroundRectColor !== undefined) ? field3.DataLabelCustomProperties.datalabelBackgroundRectColor : "#ffffff";
                                			field3.DataLabelCustomProperties.datalabelStrokeColor = (field3.DataLabelCustomProperties.datalabelStrokeColor !== undefined) ? field3.DataLabelCustomProperties.datalabelStrokeColor : "#000000";
                                		}
                                    }
                                }
                                break;
                            case "Plot":
                                if (component[component.subElement].Legend == undefined) {
                                    component[component.subElement].higherValuesAreGood = true;
                                    component[component.subElement].showFrequencyBar = false;
                                    component[component.subElement].Legend = {};
                                    component[component.subElement].Legend.DisplayName = "Very Low,Low,Medium,High,Very High,Extremely High";
                                    component[component.subElement].Legend.Ranges = "0~20,20~30,30~50,50~70,70~100,100~140";
                                    component[component.subElement].Legend.Colors = "#E74C3C,#DB0A5B,#F7CA18,#F89406,#36D7B7,#26A65B";
                                }
                                if (component[component.subElement].ShowXAxisThreshold === undefined) {
                                	component[component.subElement].ShowXAxisThreshold = "false";
                                }
                                if (component[component.subElement].MinimumXAxisThreshold === undefined) {
                                	component[component.subElement].MinimumXAxisThreshold = "0";
                                }
                                if (component[component.subElement].MaximumXAxisThreshold === undefined) {
                                	component[component.subElement].MaximumXAxisThreshold = "50";
                                }
                                if (component[component.subElement].ShowYAxisThreshold === undefined) {
                                	component[component.subElement].ShowYAxisThreshold = "false";
                                }
                                if (component[component.subElement].MinimumYAxisThreshold === undefined) {
                                	component[component.subElement].MinimumYAxisThreshold = "0";
                                }
                                if (component[component.subElement].MaximumYAxisThreshold === undefined) {
                                	component[component.subElement].MaximumYAxisThreshold = "50";
                                }
                                $scope.addDynamicRangeProperties(component);
                                component[component.subElement].SolidColorFill = component[component.subElement].SolidColorFill || "false";
                                if (component.Chart.DataSet && component.Chart.DataSet.Fields) {
                                    for (var i2 = 0; i2 < component.Chart.DataSet.Fields.length; i2++) {
                                        var field2 = component.Chart.DataSet.Fields[i2];
                                        field2.OtherFieldDisplayName = (field2.OtherFieldDisplayName) ? field2.OtherFieldDisplayName : field2.Name;
                                        field2.RadiusFieldDisplayName = (field2.RadiusFieldDisplayName) ? field2.RadiusFieldDisplayName : "Radius";
                                        field2.ColorFieldDisplayName = (field2.ColorFieldDisplayName) ? field2.ColorFieldDisplayName : "Color";
                                    }
                                }
                                if(component.Chart.ConditionalColors.ConditionalColor.length > 0){
                                	for (var a = 0; a < component.Chart.ConditionalColors.ConditionalColor.length; a++) {
                                		component.Chart.ConditionalColors.ConditionalColor[a].opacity = (component.Chart.ConditionalColors.ConditionalColor[a].opacity == undefined) ? 1: component.Chart.ConditionalColors.ConditionalColor[a].opacity;
                                    }
                                }
                                break;
                            case "SparkLine":
                            	if(component[component.subElement].sparkLineType == undefined){
                            		component[component.subElement].sparkLineType = component[component.subElement].type;
                            	}
                            	if(component[component.subElement].minimumAxisValue == undefined){
                            		component[component.subElement].minimumAxisValue = "0";
                            	}
                            	if(component[component.subElement].autoaxisSetup == undefined){
                            		component[component.subElement].autoaxisSetup = "true";
                            	}
                            	if(component[component.subElement].Unit == undefined){
                            		component[component.subElement].Unit = "none";
                            	}
                            	if(component[component.subElement].SignPosition == undefined){
                            		component[component.subElement].SignPosition = "prefix";
                            	}
                            	if(component[component.subElement].NumberFormatter == undefined){
                            		component[component.subElement].NumberFormatter = "number";
                            	}
                                break;
                            case "Timeline":
                            	component[component.subElement].sliderPosition = (component[component.subElement].sliderPosition) ? component[component.subElement].sliderPosition : "default";
                            	component[component.subElement].legendfontFamily  = component[component.subElement].legendfontFamily || "Ubuntu";
                            	component[component.subElement].legendbackgroundColor = (component[component.subElement].legendbackgroundColor != undefined) ? component[component.subElement].legendbackgroundColor : "#FFFFFF";
                            	component[component.subElement].legendbackgroundTransparency = (component[component.subElement].legendbackgroundTransparency != undefined) ? component[component.subElement].legendbackgroundTransparency : "1";
                            	component[component.subElement].stackBorderColor = (component[component.subElement].stackBorderColor != undefined) ? component[component.subElement].stackBorderColor : "#ffffff";
                            	component[component.subElement].stackBorderWidth = (component[component.subElement].stackBorderWidth != undefined) ? component[component.subElement].stackBorderWidth : "0.5";
                            	component[component.subElement].stackBorderRadius = (component[component.subElement].stackBorderRadius != undefined) ? component[component.subElement].stackBorderRadius : "0";
                            	component[component.subElement].secondaryAxisLabelFontColor = (component[component.subElement].secondaryAxisLabelFontColor != undefined) ? component[component.subElement].secondaryAxisLabelFontColor : component[component.subElement].yAxis.LabelFontColor;
                            	component[component.subElement].secondaryAxisLabelFontSize = (component[component.subElement].secondaryAxisLabelFontSize != undefined) ? component[component.subElement].secondaryAxisLabelFontSize : component[component.subElement].yAxis.LabelFontSize;
                            	component[component.subElement].secondaryAxisLabelFontStyle = (component[component.subElement].secondaryAxisLabelFontStyle != undefined) ? component[component.subElement].secondaryAxisLabelFontStyle : component[component.subElement].yAxis.LabelFontStyle;
                            	component[component.subElement].secondaryAxisLabelFontWeight = (component[component.subElement].secondaryAxisLabelFontWeight != undefined) ? component[component.subElement].secondaryAxisLabelFontWeight : component[component.subElement].yAxis.LabelFontWeight;
                            	component[component.subElement].secondaryAxisLabelFontFamily = (component[component.subElement].secondaryAxisLabelFontFamily != undefined) ? component[component.subElement].secondaryAxisLabelFontFamily : component[component.subElement].yAxis.LabelFontFamily;
                            	component[component.subElement].secondaryAxisLabelTextDecoration = (component[component.subElement].secondaryAxisLabelTextDecoration != undefined) ? component[component.subElement].secondaryAxisLabelTextDecoration : component[component.subElement].yAxis.LabelTextDecoration;
                            	if (component[component.subElement].fixedLegend == undefined) {
                                    component[component.subElement].fixedLegend = true;
                                    component[component.subElement].legendPosition = "horizontalTopLeft";
                                }
                                if(component[component.subElement].enableAnimation == undefined){
                                	component[component.subElement].enableAnimation = false;
                                }
                                if(component[component.subElement].showSettingMenuButton == undefined){
                            		component[component.subElement].showSettingMenuButton = false;
                            	}
                                if(component[component.subElement].showLineSecondAxis == undefined){
                                	component[component.subElement].showLineSecondAxis = false;
                                }
                                if(component[component.subElement].lineSecondAxisColor == undefined){
                                	component[component.subElement].lineSecondAxisColor = component[component.subElement].yAxis.LineYAxisColor || "#FFFFFF";
                                }
                                if(component[component.subElement].xAxis.xAxisMarkers == undefined){
                                	component[component.subElement].xAxis.xAxisMarkers = component[component.subElement].xAxis.xAxisMarkers || "auto";
                                }
                                if(component[component.subElement].xAxis.xAxisTextWrap == undefined){
                                	component[component.subElement].xAxis.xAxisTextWrap = false;
                                }
                                if (component.Chart.DataSet && component.Chart.DataSet.Fields) {
                                	for (var i3 = 0; i3 < component.Chart.DataSet.Fields.length; i3++) {
                                		if (component.Chart.DataSet.Fields[i3].Type == "Series") {
                                			var field3 = component.Chart.DataSet.Fields[i3];
                                			field3.enableFillArea = (field3.enableFillArea == undefined) ? IsBoolean(component.Chart.fillarea): field3.enableFillArea;
                                			field3.FanSeriesType = (field3.FanSeriesType) ? field3.FanSeriesType : "none";
                                			field3.FillAreaColor = (field3.FillAreaColor == undefined) ? field3.Color : field3.FillAreaColor;
                                			field3.FillTransparency = ( field3.FillTransparency !== undefined && field3.FillTransparency !== "" ) ?  field3.FillTransparency : 0.6;
                                			field3.DataLabelCustomProperties.datalabelBackgroundRect = (field3.DataLabelCustomProperties.datalabelBackgroundRect !== undefined) ? field3.DataLabelCustomProperties.datalabelBackgroundRect : false;
                                			field3.DataLabelCustomProperties.datalabelBackgroundRectColor = (field3.DataLabelCustomProperties.datalabelBackgroundRectColor !== undefined) ? field3.DataLabelCustomProperties.datalabelBackgroundRectColor : "#ffffff";
                                			field3.DataLabelCustomProperties.datalabelStrokeColor = (field3.DataLabelCustomProperties.datalabelStrokeColor !== undefined) ? field3.DataLabelCustomProperties.datalabelStrokeColor : "#000000";
                                		}
                                    }
                                }
                                if (component[component.subElement].enablethresholdfill == undefined) {
									component[component.subElement].enablethresholdfill = false;
								}
								if (component[component.subElement].thresholdfilllevel == undefined) {
									component[component.subElement].thresholdfilllevel = "low,middle,top";
								}
								if (component[component.subElement].thresholdfillcolor == undefined) {
									component[component.subElement].thresholdfillcolor = "#ffea00,#00FF00,#ff0000";
								}
								if (component[component.subElement].thresholdfillopacity == undefined) {
									component[component.subElement].thresholdfillopacity = "0.3,0.3,0.3";
								}
								if (component[component.subElement].thresholdfilllabel == undefined) {
									component[component.subElement].thresholdfilllabel = "Low,Middle,Top";
								}
								if (component[component.subElement].thresholdfilllabelcolor == undefined) {
									component[component.subElement].thresholdfilllabelcolor = "#000000,#000000,#000000";
								}
                                if (component[component.subElement].ShowYAxisThreshold == undefined) {
									component[component.subElement].ShowYAxisThreshold = false;
								}
								if (component[component.subElement].MinimumYAxisThreshold == undefined) {
									component[component.subElement].MinimumYAxisThreshold = "0";
								}
								if (component[component.subElement].MaximumYAxisThreshold == undefined) {
									component[component.subElement].MaximumYAxisThreshold = "50";
								}
								if (component[component.subElement].minimumthresholdstrokecolor == undefined) {
									component[component.subElement].minimumthresholdstrokecolor = "#00FF00";
								}
								if (component[component.subElement].maximumthresholdstrokecolor == undefined) {
									component[component.subElement].maximumthresholdstrokecolor = "#FF0000";
								}
                                if (component[component.subElement].showAnnotation == undefined) {
									component[component.subElement].showAnnotation = false;
								}
								if (component[component.subElement].annotationDataType == undefined) {
									component[component.subElement].annotationDataType = "number";
								}
								if (component[component.subElement].annotationRadius == undefined) {
									component[component.subElement].annotationRadius = "1";
								}
								if (component[component.subElement].annotationOpacity == undefined) {
									component[component.subElement].annotationOpacity = "1";
								}
								if (component[component.subElement].annotationColor == undefined) {
									component[component.subElement].annotationColor = "#FF5733";
								}
								if (component[component.subElement].annotationFormat == undefined) {
									component[component.subElement].annotationFormat = "year";
								}
								if (component[component.subElement].AnnotationTooltipTitle == undefined) {
									component[component.subElement].AnnotationTooltipTitle = "Annotation";
								}
								if (component[component.subElement].lineType == undefined) {
									component[component.subElement].lineType = "false";
								}
								if (component[component.subElement].annotationxdata == undefined) {
									component[component.subElement].annotationxdata = [];
								}
								if (component[component.subElement]["Annotation"] === undefined) {
									component[component.subElement]["Annotation"] = {
										"Category": "2013, 2015, 2017",
										"Label": "Low, Medium, High",
										"DataSource": "",
										"DataSourceId": "",
										"DataLabel": "",
										"DataValue": ""
									};
								}
                            	break;
                            case "TreeMap":
                            	$scope.addDynamicRangeProperties(component);
                                component[component.subElement].position = (component[component.subElement].position) ? component[component.subElement].position : "center";
                                component[component.subElement].bodyStrokeColorLineWidth = (component[component.subElement].bodyStrokeColorLineWidth) ? component[component.subElement].bodyStrokeColorLineWidth : "1";
                            	if (component.Chart.DataSet && component.Chart.DataSet.Fields) {
                            	    for (var i4 = 0; i4 < component.Chart.DataSet.Fields.length; i4++) {
                            	        if (component.Chart.DataSet.Fields[i4].Type == "Series") {
                            	            var field4 = component.Chart.DataSet.Fields[i4];
                            	            field4.AdditionalField = (field4.AdditionalField) ? field4.AdditionalField : field4.Name;
                            	        }
                            	    }
                            	}
                                break;
                            case "Trellis":
                                component[component.subElement].Aggregation = component[component.subElement].Aggregation || "sum";
                                component[component.subElement].drawingmode = component[component.subElement].drawingmode || "horizontal";
                                component[component.subElement].showhorizontalGridLines = component[component.subElement].showhorizontalGridLines || "true";
                                component[component.subElement].horizontalGridLineColor = component[component.subElement].horizontalGridLineColor || "#e5dede";
                                component[component.subElement].verticalGridLineColor = component[component.subElement].verticalGridLineColor || "#e5dede";
                                component[component.subElement].headerchromeColor = component[component.subElement].headerchromeColor || "#FFFFFF";
                                component[component.subElement].headerFontColor = component[component.subElement].headerFontColor || "#4d4d4d";
                                component[component.subElement].headerFontSize = component[component.subElement].headerFontSize || 12;
                                component[component.subElement].headerFontStyle = component[component.subElement].headerFontStyle || "normal";
                                component[component.subElement].headerFontWeight = component[component.subElement].headerFontWeight || "bold";
                                component[component.subElement].headerFontFamily = component[component.subElement].headerFontFamily || "Roboto";
                                component[component.subElement].headerTextAlign = component[component.subElement].headerTextAlign || "left";
                                component[component.subElement].headerTextDecoration = component[component.subElement].headerTextDecoration || "none";
                                component[component.subElement].ChartType = component[component.subElement].ChartType || "bar";
                                component[component.subElement].MergeFieldChartType = component[component.subElement].MergeFieldChartType || "stacked";
                                break;
                            case "WordCloud":
                                if (component[component.subElement].Legend == undefined) {
                                    component[component.subElement].Legend = {};
                                    component[component.subElement].Legend.DisplayName = "Low,Medium,High,Very High";
                                    component[component.subElement].Legend.Ranges = "0~2,2~5,5~12,12~25";
                                    component[component.subElement].Legend.Colors = "#E74C3C,#F7CA18,#36D7B7,#26A65B";
                                }
                                component[component.subElement].useRandomColor = component[component.subElement].useRandomColor || false;
                                component[component.subElement].showRangeBar = component[component.subElement].showRangeBar || false;
                                $scope.addDynamicRangeProperties(component);
                                break;
                            case "NewWordCloud":
								component[component.subElement].wordInputFormat = component[component.subElement].wordInputFormat || "word";
								component[component.subElement].maxTextValue = component[component.subElement].maxTextValue || "1000";
								break;
                            case "Sankey":
                                component[component.subElement].highlightPathStyle = component[component.subElement].highlightPathStyle || "adjacency";
                                component[component.subElement].textAlign = component[component.subElement].textAlign || "right";
                                component[component.subElement].tooltipBackgroundColor = component[component.subElement].tooltipBackgroundColor || "#ffffff";
                                component[component.subElement].tooltipBorderColor = component[component.subElement].tooltipBorderColor || "#000000";
                                component[component.subElement].tooltipPrecision = component[component.subElement].tooltipPrecision || "default";
                                component[component.subElement].showTooltip = component[component.subElement].showTooltip || "true";
                                component[component.subElement].tooltipFontSize = component[component.subElement].tooltipFontSize || "12";
                                component[component.subElement].tooltipFontStyle = component[component.subElement].tooltipFontStyle || "normal";
                                component[component.subElement].tooltipFontWeight = component[component.subElement].tooltipFontWeight || "normal";
                                component[component.subElement].tooltipFontFamily = component[component.subElement].tooltipFontFamily || "BizvizFont";
                                component[component.subElement].tooltipFontColor = component[component.subElement].tooltipFontColor || "#000000";
                                if (component[component.subElement]["SubCategoryColors"] === undefined) {
                                	component[component.subElement]["SubCategoryColors"] = {
                                		"subCategoryDefaultColor": "",
										"subCategoryDefaultColorSet": "",
										"showColorsFromSubCategoryName": "false",
										"subCategoryColor": []
                			        };
                            	}
                            	component[component.subElement].SecondaryUnit = component[component.subElement].SecondaryUnit || "none";
                    			component[component.subElement].Unit = component[component.subElement].Unit || "none";
                    			component[component.subElement].Precision = component[component.subElement].Precision || "default";
                    			component[component.subElement].SignPosition = component[component.subElement].SignPosition || "prefix";
                    			component[component.subElement].NumberFormatter = component[component.subElement].NumberFormatter || "none";
                                break;
                            case "WorldMap":
                            	$scope.addDynamicRangeProperties(component);
                            	if (component[component.subElement]["CategoryColors"] === undefined) {
                                	component[component.subElement]["CategoryColors"] = {
                                		"categoryDefaultColor": "",
                			            "categoryDefaultColorSet": "",
                			            "showColorsFromCategoryName": "false",
                			            "CategoryColor": []
                			        };
                            	}
                            	if (component[component.subElement]["ConditionalColors"] === undefined) {
                                	component[component.subElement]["ConditionalColors"] = {
                						"ConditionalColor": []
                					}
                            	}
                                component[component.subElement].SolidColorFill = component[component.subElement].SolidColorFill || "false";
                                component[component.subElement].geometryType = component[component.subElement].geometryType || "marker";
                                component[component.subElement].lineType = component[component.subElement].lineType || "straight";
                                component[component.subElement].lineThickness = component[component.subElement].lineThickness || 3;
                                break;
                            default:
                                break;
                        }
                        /**When Chart's indicator color value has been compared with 0**/
                        if(component[component.subElement].ConditionalColors !== undefined){
                        	var ColorCondition = component[component.subElement].ConditionalColors.ConditionalColor;
                        	if(ColorCondition){
	                        	for(var s = 0; s < ColorCondition.length; s++){
	                        		if(ColorCondition[s].compareTo === 0){
	                        			ColorCondition[s].compareTo = "0";
	                        		}
	                        	}
                        	}
                        }
                        break;
                    case "filter" :
                    	switch (component[component.subElement].Type) { 
                    	case "list":
                    		  component[component.subElement].selectionFontColor = component[component.subElement].selectionFontColor || "#000000";
                    		  if(component[component.subElement].Title == undefined){
                    			  component[component.subElement].Title = {
                			            "FontWeight": "normal",
                			            "Description": "Year",
                			            "FontSize": "12",
                			            "TextDecoration": "none",
                			            "Align": "left",
                			            "FontFamily": "Roboto",
                			            "FontColor": "#808080",
                 						"FontStyle": "normal",
                 						"showTitle": "false",
                 						"showGradient": "false",
                 						"GradientColor": "#F5F5F5,#F5F5F5",
                			            "TitleBarHeight" : "25"
                          		  };
                    		  }
                    		  component[component.subElement].ListBorderColor = (component[component.subElement].ListBorderColor !== undefined) ? component[component.subElement].ListBorderColor : "#c2c2c2";
                              component[component.subElement].enableBorder = (component[component.subElement].enableBorder !== undefined) ? component[component.subElement].enableBorder : "false";
                              component[component.subElement].enableGVAutoUpdate = (component[component.subElement].enableGVAutoUpdate == undefined) ? false : component[component.subElement].enableGVAutoUpdate;
                              component[component.subElement].notifyGVAutoUpdate = (component[component.subElement].notifyGVAutoUpdate == undefined) ? false : component[component.subElement].notifyGVAutoUpdate;
                              component[component.subElement].menupanelRowHeight = (component[component.subElement].menupanelRowHeight == undefined) ? "32" : component[component.subElement].menupanelRowHeight;
                              component[component.subElement].actionBarHeight = (component[component.subElement].actionBarHeight == undefined) ? "25" : component[component.subElement].actionBarHeight;
                              component[component.subElement].menupanelFontColor = (component[component.subElement].menupanelFontColor == undefined) ? "#333333" : component[component.subElement].menupanelFontColor;
                    		  break;
                    	  case "ComboTree":
                              component[component.subElement].selectionLimit = (component[component.subElement].selectionLimit == undefined) ? "0" : component[component.subElement].selectionLimit;
                              component[component.subElement].customSelection = (component[component.subElement].customSelection == undefined) ? "false" : component[component.subElement].customSelection;
                              component[component.subElement].showSelectionLimit = (component[component.subElement].showSelectionLimit == undefined) ? "false" : component[component.subElement].showSelectionLimit;
                              component[component.subElement].filterBorderRadius = (component[component.subElement].filterBorderRadius == undefined) ? "0" : component[component.subElement].filterBorderRadius;
                              component[component.subElement].chromeColorPanel = (component[component.subElement].chromeColorPanel !== undefined)  ? component[component.subElement].chromeColorPanel :  component[component.subElement].chromeColor;
                              component[component.subElement].panelBorderRadius = (component[component.subElement].panelBorderRadius !== undefined) ? component[component.subElement].panelBorderRadius : component[component.subElement].filterBorderRadius;
                              component[component.subElement].advanceTheme = (component[component.subElement].advanceTheme !== undefined) ? component[component.subElement].advanceTheme : "default";
                              component[component.subElement].menuPanelFontColor = (component[component.subElement].menuPanelFontColor !== undefined) ? component[component.subElement].menuPanelFontColor : component[component.subElement].FontColor;
                              component[component.subElement].enableGVAutoUpdate = (component[component.subElement].enableGVAutoUpdate == undefined) ? false : component[component.subElement].enableGVAutoUpdate;
                              component[component.subElement].notifyGVAutoUpdate = (component[component.subElement].notifyGVAutoUpdate == undefined) ? false : component[component.subElement].notifyGVAutoUpdate;
                              break;
                    	  case "dropdown":
                    		  if(component[component.subElement].Title == undefined){
                    			  component[component.subElement].Title = {
     	                    			"FontWeight": "normal",
     	          			            "Description": "Year",
     	          			            "FontSize": "12",
     	          			            "TextDecoration": "none",
     	          			            "Align": "left",
     	          			            "FontFamily": "Roboto",
     	          			            "FontColor": "#808080",
     	           						"FontStyle": "normal",
     	           						"showTitle": "false",
     	           						"showGradient": "false",
     	           						"GradientColor": "#F5F5F5,#F5F5F5",
     	          			            "TitleBarHeight" : "25",
     	          			            "Position" : "top"
                       		  	  };
                    		  }
                    		  
                    		  component[component.subElement].rollOverColor = (component[component.subElement].rollOverColor !== undefined)&&(component[component.subElement].rollOverColor !== "0xE8F2FE") ? component[component.subElement].rollOverColor : "#d9d7d8";
                    		  component[component.subElement].m_cbbordercolor = (component[component.subElement].m_cbbordercolor !== undefined) ? component[component.subElement].m_cbbordercolor : "#d3d3d3";
                    		  component[component.subElement].filterbgColor = (component[component.subElement].filterbgColor !== undefined) ? component[component.subElement].filterbgColor : "#dddddd";
                              component[component.subElement].chromeColor = (component[component.subElement].chromeColor !== undefined)&&(component[component.subElement].chromeColor !== "0xcccccc") ? component[component.subElement].chromeColor : "#f2f2f2";
                              component[component.subElement].selectionColor = (component[component.subElement].selectionColor !== undefined)&&(component[component.subElement].selectionColor !== "0xE8F2FE") ? component[component.subElement].selectionColor : "#BDC3C7";
                              component[component.subElement].enableGVAutoUpdate = (component[component.subElement].enableGVAutoUpdate == undefined) ? false : component[component.subElement].enableGVAutoUpdate;
                              component[component.subElement].notifyGVAutoUpdate = (component[component.subElement].notifyGVAutoUpdate == undefined) ? false : component[component.subElement].notifyGVAutoUpdate;
                              if(component[component.subElement].SelectionType === undefined){
                            	  component[component.subElement].SelectionType = IsBoolean(component[component.subElement].allowMultipleSelection) ? "multiselect" : "default";  
                              }
                              if (component[component.subElement].backgroundColor == undefined) {
                                   component[component.subElement].backgroundColor = "#ffffff";
                              }
                              component[component.subElement].actionBarTooltip = (component[component.subElement].actionBarTooltip == undefined) ? "true" : "false";  
                              break;
                    	  case "radiogroup":
                		      if(component[component.subElement].viewType == undefined){
                		         component[component.subElement].viewType = "radio";      
                		      }
                		      component[component.subElement].buttonColor = component[component.subElement].buttonColor || "#e8edec";
                		      component[component.subElement].circleColor = component[component.subElement].circleColor || "#1b7ced";
                		      component[component.subElement].circleSize = component[component.subElement].circleSize || "15";
                		      component[component.subElement].buttonPadding = component[component.subElement].buttonPadding || "4";
                		      component[component.subElement].buttonTopSpacing = component[component.subElement].buttonTopSpacing || "4";
                		      /** To convert oldDashboard(PS) color code into Hex **/
                		      component[component.subElement].selectionColor = convertColorToHex(component[component.subElement].selectionColor);
                              component[component.subElement].enableGVAutoUpdate = (component[component.subElement].enableGVAutoUpdate == undefined) ? false : component[component.subElement].enableGVAutoUpdate;
                              component[component.subElement].notifyGVAutoUpdate = (component[component.subElement].notifyGVAutoUpdate == undefined) ? false : component[component.subElement].notifyGVAutoUpdate;
                		      break;
                		  case "checkboxgroup":
                		      component[component.subElement].checkboxDirection == component[component.subElement].checkboxDirection || "horizontal";
                		      component[component.subElement].checkboxColors = component[component.subElement].checkboxColors || "#039DEF,#124CA3,#00BCD4#e8edec";
                		      component[component.subElement].checkboxNames = component[component.subElement].checkboxNames || "Label 1,Label 2,Label 3";
                		      component[component.subElement].checkboxShapes = component[component.subElement].checkboxShapes || "unchecked,unchecked,unchecked";
                		      component[component.subElement].checkboxValue = component[component.subElement].checkboxValue || "1,1,1";
                		      component[component.subElement].toggleCheckedColor = component[component.subElement].toggleCheckedColor || "#2196F3";
                		      component[component.subElement].toggleUnCheckedColor = component[component.subElement].toggleUnCheckedColor || "#cccccc";
                		      component[component.subElement].toggleCheckboxLayout = component[component.subElement].toggleCheckboxLayout || "false";
                		      component[component.subElement].toggleShape = component[component.subElement].toggleShape || "round";
                		      break;
                    	  default:
                              break;
                    	}
                    	break;
                   	case "TabComponent":
						   if(component[component.subElement].tabAlignment == undefined){
            		         	component[component.subElement].tabAlignment = "horizontal";     
            		      	}
            		      	if(component[component.subElement].contentAlignment == undefined){
            		         	component[component.subElement].contentAlignment = "center";     
            		      	}
                    default:
                        break;
                }
                switch (component.subElement) {
                    case "Chart":
                    	if (component.Chart.hideLegendOnStart == undefined) {
                    		component.Chart.hideLegendOnStart = true;
                    	}
                        if (component.Chart.yAxis) {
                            /** Changes for charts which have yaxis , no changes for heatmap/ funnels/ treemaps **/
                            component.Chart.FixedLabel = false;
                            component.Chart.Formater = "Currency";
                            component.Chart.SecondaryFormater = "Number";
                            component.Chart.yAxis.leftaxisFormater = true;
                            component.Chart.rightaxisFormater = true;
                            component.Chart.Unit = (component.Chart.Unit) ? component.Chart.Unit : 'none';
                            component.Chart.SecondaryUnit = (component.Chart.SecondaryUnit) ? component.Chart.SecondaryUnit : 'none';
                            $scope.addDefaultCustomTextBoxForToolTipProperties(component);
                            $scope.addDefaultCustomTextBoxForToolTipFormatterProperties(component);
                            component.Chart.barWidth = (component.Chart.barWidth) ? component.Chart.barWidth : 50;
                            component.Chart.maxBarWidth = (component.Chart.maxBarWidth) ? component.Chart.maxBarWidth : 40;
                            component.Chart.minBarWidth = (component.Chart.minBarWidth) ? component.Chart.minBarWidth : 20;
                            component.Chart.sliderRange = (component.Chart.sliderRange) ? component.Chart.sliderRange : "auto";
                            component.Chart.chartAlignment = (component.Chart.chartAlignment) ? component.Chart.chartAlignment : "center";
                            component.Chart.zeroMarkerLine = (component.Chart.zeroMarkerLine ) ? component.Chart.zeroMarkerLine : "false";
                            component.Chart.zeroMarkerColor = (component.Chart.zeroMarkerColor) ? component.Chart.zeroMarkerColor : "#CCCCCC";
                            component.Chart.secondAxisZeroMarkerLine = (component.Chart.secondAxisZeroMarkerLine ) ? component.Chart.secondAxisZeroMarkerLine : "false";
                            component.Chart.secondAxisZeroMarkerColor= (component.Chart.secondAxisZeroMarkerColor ) ? component.Chart.secondAxisZeroMarkerColor : "#CCCCCC";
                            component.Chart.verticalZeroMarkerLine = (component.Chart.verticalZeroMarkerLine ) ? component.Chart.verticalZeroMarkerLine : "false";
                            component.Chart.verticalZeroMarkerColor = (component.Chart.verticalZeroMarkerColor ) ? component.Chart.verticalZeroMarkerColor : "#CCCCCC";
                            component.Chart.NumberFormatter = (component.Chart.NumberFormatter ) ? component.Chart.NumberFormatter : "none";
                            component.Chart.SecondaryAxisNumberFormatter = (component.Chart.SecondaryAxisNumberFormatter ) ? component.Chart.SecondaryAxisNumberFormatter : "none";
                            component.Chart.repeaterCommonMarker = (component.Chart.repeaterCommonMarker) ? component.Chart.repeaterCommonMarker : "false";
                            if(component.Chart.Title.TitleBarHeight == undefined) {
                            	component.Chart.Title.TitleBarHeight = "25";
                            }
                            if (component.Chart.DataSet && component.Chart.DataSet.Fields) {
                            	$scope.addDefaultDataLabelProperties(component);
                            	if (component.Chart.Type == "Timeline" || component.Chart.Type == "Bar") {
                                	$scope.addDefaultChartProperties(component);
                                }
                            }
                        } else if (component.Chart.Type == "TreeMap") {
                        	$scope.addDefaultTreeMapProperties(component);
                        } else if (component.Chart.Type == "WorldMap") {
                        	$scope.addDefaultWorldMapProperties(component);
                        } else if (component.Chart.Type == "Progress") {
                        	$scope.addDefaultProgressPieProperties(component);
                        } else {
                        	// Do nothing
                        }
                        component.Chart.tooltipBackgroundColor = (component.Chart.tooltipBackgroundColor ) ? component.Chart.tooltipBackgroundColor : "#FFFFFF";
                        component.Chart.tooltipBackgroundTransparency = (component.Chart.tooltipBackgroundTransparency ) ? component.Chart.tooltipBackgroundTransparency : "1";
                        component.Chart.tooltipBorderColor = (component.Chart.tooltipBorderColor ) ? component.Chart.tooltipBorderColor : "#E0DFDF";
                        component.Chart.customTooltipWidth = (component.Chart.customTooltipWidth ) ? component.Chart.customTooltipWidth : "auto";
                        component.Chart.tooltipPrecision = (component.Chart.tooltipPrecision ) ? component.Chart.tooltipPrecision : "default";
                        component.Chart.tooltipHighlighter = (component.Chart.tooltipHighlighter ) ? component.Chart.tooltipHighlighter : "false";
                        component.Chart.tooltipFontSize = (component.Chart.tooltipFontSize != undefined) ? component.Chart.tooltipFontSize : "12";
                        component.Chart.legendfontSize = (component.Chart.legendfontSize != undefined) ? component.Chart.legendfontSize : "10";
                        component.Chart.colorOpacity = (component.Chart.colorOpacity !== undefined) ? component.Chart.colorOpacity : "1";
                        component.Chart.exportType = (component.Chart.exportType != undefined) ? component.Chart.exportType : "screenshot";
                        break;
                    case "Funnel":
                    	$scope.addDefaultFunnelProperties(component);
                    	component[component.subElement].exportToCSV  = component[component.subElement].exportToCSV || true;
                    	if(component[component.subElement].chartType == undefined || component[component.subElement].chartType === ""){
                 	       component[component.subElement].chartType = "inverted";
                        }
                    	if (component[component.subElement].DataSet && component[component.subElement].DataSet.Fields) {
                    		$scope.addDefaultDataLabelProperties(component);
                    	}
                    	component[component.subElement].exportType = (component[component.subElement].exportType != undefined) ? component[component.subElement].exportType : "screenshot";
                        break;
                    case "DataGrid":
                    	component[component.subElement].exportToCSV  = component[component.subElement].exportToCSV || "true";
                    	component[component.subElement].updatedDesign = (component[component.subElement].updatedDesign === undefined) ?  "false" :component[component.subElement].updatedDesign;
                    	$scope.addDefaultDataGridProperties(component);
                    	component[component.subElement].exportType = (component[component.subElement].exportType != undefined) ? component[component.subElement].exportType : "screenshot";
                    	component[component.subElement].showMultipleCheckbox = (component[component.subElement].showMultipleCheckbox != undefined) ? component[component.subElement].showMultipleCheckbox : "false";
						for (var j = 0; j <component[component.subElement].DataSet.Fields.length; j++) {
							component[component.subElement].DataSet.Fields[j].dateformat = (component[component.subElement].DataSet.Fields[j].dateformat  != undefined) ? component[component.subElement].DataSet.Fields[j].dateformat  : "none";
							component[component.subElement].DataSet.Fields[j].showcellmerge = (component[component.subElement].DataSet.Fields[j].showcellmerge  != undefined) ? component[component.subElement].DataSet.Fields[j].showcellmerge  : "false";
							component[component.subElement].DataSet.Fields[j].CellMergeCustomProperties = (component[component.subElement].DataSet.Fields[j].CellMergeCustomProperties  != undefined) ? component[component.subElement].DataSet.Fields[j].CellMergeCustomProperties  : {};
						}
                        break;
                    case "Scorecard":
                    	$scope.addDefaultScoreCardProperties(component);
                    	component[component.subElement].exportType = (component[component.subElement].exportType != undefined) ? component[component.subElement].exportType : "screenshot";
                    	component[component.subElement].exportToCSV  = component[component.subElement].exportToCSV || "true";
                    	break;
                    default:
                        break;
                }
                
                if(component[component.subElement].showBorder == undefined || component[component.subElement].showBorder === ""){
                	component[component.subElement].showBorder = false;
                }
                if(component[component.subElement].borderColor == undefined || component[component.subElement].borderColor === ""){
                	component[component.subElement].borderColor = "#BDC3C7";
                }
                if(component[component.subElement].borderThickness == undefined || component[component.subElement].borderThickness === ""){
                	component[component.subElement].borderThickness = "1";
                }
                if(component[component.subElement].borderRadius == undefined || component[component.subElement].borderRadius === ""){
                	component[component.subElement].borderRadius = "0";
                }
                if(component[component.subElement].showShadow == undefined){
                	component[component.subElement].showShadow = false;
                	component[component.subElement].shadowColor = "#000000";
                	component[component.subElement].shadowOpacity = "0.1";
                }
                if(component[component.subElement].TitleBarHeight == undefined || component[component.subElement].TitleBarHeight === ""){
                	component[component.subElement].TitleBarHeight = "25";
                }
				
            }
            return component;
        };
        /** to add changes for funnel type charts for old dashboard components(Funnel, Inverted Funnel, Pyramid) **/
        $scope.addDefaultFunnelProperties = function(component) {
        	component.Funnel.FixedLabel = false;
            component.Funnel.Formater = "Currency";
            component.Funnel.SecondaryFormater = "Number";
            component.Funnel.Precision = (component.Funnel.Precision) ? component.Funnel.Precision : 0;
            component.Funnel.SignPosition = (component.Funnel.SignPosition) ? component.Funnel.SignPosition : "prefix";
            component.Funnel.Unit = (component.Funnel.Unit) ? component.Funnel.Unit : "none";
            component.Funnel.SecondaryUnit = (component.Funnel.SecondaryUnit) ? component.Funnel.SecondaryUnit : "none";
            component.Funnel.NumberFormatter = (component.Funnel.NumberFormatter ) ? component.Funnel.NumberFormatter : "none";
            $scope.addDefaultCustomTextBoxForToolTipProperties(component);
            component.Funnel.Title.TitleBarHeight = (component.Funnel.Title.TitleBarHeight) ? component.Funnel.Title.TitleBarHeight : "25";
            component.Funnel.hideLegendOnStart = component.Funnel.hideLegendOnStart || true;
            component.Funnel.tooltipBackgroundColor = (component.Funnel.tooltipBackgroundColor ) ? component.Funnel.tooltipBackgroundColor : "#FFFFFF";
            component.Funnel.tooltipBackgroundTransparency = (component.Funnel.tooltipBackgroundTransparency ) ? component.Funnel.tooltipBackgroundTransparency : "1";
            component.Funnel.tooltipBorderColor = (component.Funnel.tooltipBorderColor ) ? component.Funnel.tooltipBorderColor : "#E0DFDF";
            component.Funnel.customTooltipWidth = (component.Funnel.customTooltipWidth ) ? component.Funnel.customTooltipWidth : "auto";
            component.Funnel.tooltipPrecision = (component.Funnel.tooltipPrecision ) ? component.Funnel.tooltipPrecision : "default";
            component.Funnel.tooltipHighlighter = (component.Funnel.tooltipHighlighter ) ? component.Funnel.tooltipHighlighter : "false";
            component.Funnel.tooltipFontSize = (component.Funnel.tooltipFontSize != undefined) ? component.Funnel.tooltipFontSize : "12";
            component.Funnel.legendfontSize = (component.Funnel.legendfontSize != undefined) ? component.Funnel.legendfontSize : "10";
            if (component.Funnel.Type == "InvertedFunnel") {
                component.Funnel.showcustom = "true";
                $scope.addDefaultCustomTextBoxForToolTipFormatterProperties(component);
            }
            if (component.Funnel.DataSet && component.Funnel.DataSet.Fields) {
                for (var i = 0; i < component.Funnel.DataSet.Fields.length; i++) {
                    var field = component.Funnel.DataSet.Fields[i];
                    field.PlotTransparency = (field.PlotTransparency * 1 != 0 && field.PlotTransparency != undefined) ? field.PlotTransparency : 1;
                }
            }
        };
        /** to add default properties for treemap of old dashboards **/
        $scope.addDefaultTreeMapProperties = function(component) {
            component.Chart.FixedLabel = false;
            component.Chart.Formater = "Currency";
            component.Chart.SecondaryFormater = "Number";
            component.Chart.Unit = (component.Chart.Unit) ? component.Chart.Unit : "none";
            component.Chart.NumberFormatter = (component.Chart.NumberFormatter) ? component.Chart.NumberFormatter : "none";
            component.Chart.SecondaryUnit = (component.Chart.SecondaryUnit) ? component.Chart.SecondaryUnit : "none";
            component.Chart.Title.TitleBarHeight = (component.Chart.Title.TitleBarHeight) ? component.Chart.Title.TitleBarHeight : "25";
            component.Chart.showcustom = "true";
            $scope.addDefaultCustomTextBoxForToolTipProperties(component);
            $scope.addDefaultCustomTextBoxForToolTipFormatterProperties(component);
        };
        /** to add default properties for Chart of old dashboards **/
        $scope.addDefaultChartProperties = function(component) {
        	for (var i = 0; i < component.Chart.DataSet.Fields.length; i++) {
        		var field = component.Chart.DataSet.Fields[i];
        		if((field.dstype === undefined || field.dstype === "none") && field.Type === "Series"){
        			field["dstype"] = "sum";
        		}
        	}
        };
        /** to add default properties & dataset field properties for worldmap of old dashboards **/
        $scope.addDefaultWorldMapProperties = function(component) {
            component.Chart.Title.TitleBarHeight = (component.Chart.Title.TitleBarHeight) ? component.Chart.Title.TitleBarHeight : "25";
            component.Chart.svgType = (component.Chart.svgType) ? component.Chart.svgType : "svg";
            component.Chart.showcustom = "true";
            /*DAS-301*/
            //component.Chart.lineType = "straight";
            $scope.addDefaultCustomTextBoxForToolTipProperties(component);
            $scope.addDefaultCustomTextBoxForToolTipFormatterProperties(component);
            if (component.Chart.DataSet && component.Chart.DataSet.Fields) {
                for (var i = 0; i < component.Chart.DataSet.Fields.length; i++) {
                    var field = component.Chart.DataSet.Fields[i];
                    var temp = field.unitname;
                    var temp1 = field.secondunitname;
                    if (field.formatter == "Number") {
                        field.secondunitname = temp;
                    }
                    if (field.secondformatter == "Currency") {
                        field.unitname = temp1;
                    }

                    field.formatter = "Currency";
                    field.secondformatter = "Number";
                    field.isfixedlabel = false;
                    field.Precision = (field.Precision * 1 != 0) ? field.Precision : 0;
                    field.signposition = (field.signposition) ? field.signposition : "prefix";
                    field.secondunitname = (field.secondunitname != "") ? field.secondunitname : "none";
                    field.unitname = (field.unitname != "") ? field.unitname :    "none";
                    field.numberFormatter = (field.numberFormatter) ? field.numberFormatter : "number";
                }
            }
        };
        /** to add default properties for progress pie of old dashboards **/
        $scope.addDefaultProgressPieProperties = function(component) {
        	component.Chart.Title.TitleBarHeight = (component.Chart.Title.TitleBarHeight) ? component.Chart.Title.TitleBarHeight: "25";
            $scope.addDefaultCustomTextBoxForToolTipProperties(component);
        };
        /** to add default properties of datagrids for old dashboards(simple,paging,pivot grids) **/
        $scope.addDefaultDataGridProperties = function(component) {
        	if (component.DataGrid.DataSet && component.DataGrid.DataSet.Fields) {
                for (var i = 0; i < component.DataGrid.DataSet.Fields.length; i++) {
                    var field = component.DataGrid.DataSet.Fields[i];
                    var temp = field.unitname;
                    var temp1 = field.secondunitname;
                    if (field.formatter == "Number") {
                        field.secondunitname = temp;
                    }
                    if (field.secondformatter == "Currency") {
                        field.unitname = temp1;
                    }
                    if(field["cellType"] == undefined){
                    	field["cellType"] = IsBoolean(field["isNumeric"])?"Numeric":"none";
                    }
                    if(field.dstype === undefined){
                    	field["dstype"] = "none";
            		}
                    field.formatter = "Currency";
                    field.secondformatter = "Number";
                    field.isfixedlabel = false;
                    field.precision = (field.precision * 1 != 0) ? field.precision : 0;
                    field.signposition = (field.signposition) ? field.signposition : "prefix";
                    field.secondunitname = (field.secondunitname != "") ? field.secondunitname : "none";
                    field.unitname = (field.unitname != "") ? field.unitname : "none";
                    field.rowAggregation = field.rowAggregation || "none";
                    field.showTooltip = field.showTooltip || "false";
                    field.numberFormatter = field.numberFormatter || "none";
                    if(field.sorting == undefined) {
                        field.sorting = "true";
                    }
                    if (component.DataGrid.Alerts && component.DataGrid.Alerts.AlertColumn && component.DataGrid.Alerts.AlertColumn.length > 0) {
                        for(var j = 0 ; j < component.DataGrid.Alerts.AlertColumn.length; j++){                          
                            var alertField =  component.DataGrid.Alerts.AlertColumn[j];
                            if(field.Name == alertField.name){
                            	if(component.DataGrid.Alerts.AlertColumn[j].showTooltip !== undefined)
                            		field.showTooltip = component.DataGrid.Alerts.AlertColumn[j].showTooltip;
                            }
                        }
                    }
                }
            }

            if (component.DataGrid.Alerts && component.DataGrid.Alerts.AlertColumn && component.DataGrid.Alerts.AlertColumn.length > 0) {
                for (var k = 0; k < component.DataGrid.Alerts.AlertColumn.length; k++) {
                    component.DataGrid.Alerts.AlertColumn[k].showDynamicRange = component.DataGrid.Alerts.AlertColumn[k].showDynamicRange || false;
                    component.DataGrid.Alerts.AlertColumn[k].minColor = component.DataGrid.Alerts.AlertColumn[k].minColor || "#f89406";
                    component.DataGrid.Alerts.AlertColumn[k].maxColor = component.DataGrid.Alerts.AlertColumn[k].maxColor || "#00b16a";
                }
            }
            if (component.DataGrid.DatagridStyles.alternateRowsColor) {
                var alt = component.DataGrid.DatagridStyles.alternateRowsColor;
                if (alt.split(",").length == 1) {
                    component.DataGrid.DatagridStyles.alternateRowsColor = alt + "," + alt;
                }
            } else {
                component.DataGrid.DatagridStyles.alternateRowsColor = "#ffffff,#ffffff";
            }
            component.DataGrid.useFieldColorAsHeader = component.DataGrid.useFieldColorAsHeader || false;
            if(component.DataGrid.Title.TitleBarHeight == undefined) {
            	component.DataGrid.Title.TitleBarHeight = "25";
            }
            if(component[component.subElement].fitColumns == undefined) {
            	component[component.subElement].fitColumns = (component.componentType == "dynamic_data_grid") ? false : true;
            }
            if(component[component.subElement].scrollViewLimit == undefined) {
            	component[component.subElement].scrollViewLimit = 0;
            }
            /**BDD - 888 Removed the additional RowHeight property as it was causing the conflict**/
            if(component.DataGrid.RowHeight != undefined && component.componentType == "paging_data_grid"){
                delete component.DataGrid.RowHeight;
            }
        };
        /** to add default properties of ScoreCard for old dashboards(simple,paging,pivot grids) **/
        $scope.addDefaultScoreCardProperties = function(component) {
        	if (component.Scorecard.DataSet && component.Scorecard.DataSet.Fields) {
                for (var i = 0; i < component.Scorecard.DataSet.Fields.length; i++) {
                    var field = component.Scorecard.DataSet.Fields[i];
                    var temp = field.unitname;
                    var temp1 = field.secondunitname;
                    if (field.formatter == "Number") {
                        field.secondunitname = temp;
                    }
                    if (field.secondformatter == "Currency") {
                        field.unitname = temp1;
                    }
                    if(field["cellType"] == undefined){
                    	field["cellType"] = IsBoolean(field["isNumeric"])?"Numeric":"none";
                    }
                    field.formatter = "Currency";
                    field.secondformatter = "Number";
                    field.isfixedlabel = false;
                    field.precision = (field.precision * 1 != 0) ? field.precision : 0;
                    field.signposition = (field.signposition) ? field.signposition : "prefix";
                    field.secondunitname = (field.secondunitname != "") ? field.secondunitname : "none";
                    field.unitname = (field.unitname != "") ? field.unitname : "none";
                    field.showTooltip = field.showTooltip || "false";
                    field.numberFormatter = field.numberFormatter || "none";
                    if(field.sorting == undefined) {
                        field.sorting = "true";
                    }
                    if(field.parentAggregation === undefined){
                    	field.parentAggregation = "none";
                    }
                    if (component.Scorecard.Alerts && component.Scorecard.Alerts.AlertColumn && component.Scorecard.Alerts.AlertColumn.length > 0) {
                        for(var j = 0 ; j < component.Scorecard.Alerts.AlertColumn.length; j++){                                        
                            var alertField =  component.Scorecard.Alerts.AlertColumn[j];
                            if(field.Name == alertField.name){
                            	if(component.Scorecard.Alerts.AlertColumn[j].showTooltip !== undefined)
                            		field.showTooltip = component.Scorecard.Alerts.AlertColumn[j].showTooltip;      
                            }
                        }
                    }
                }
            }
            if (component.Scorecard.Alerts && component.Scorecard.Alerts.AlertColumn && component.Scorecard.Alerts.AlertColumn.length > 0) {
                for (var k = 0; k < component.Scorecard.Alerts.AlertColumn.length; k++) {
                    component.Scorecard.Alerts.AlertColumn[k].showDynamicRange = component.Scorecard.Alerts.AlertColumn[k].showDynamicRange || false;
                    component.Scorecard.Alerts.AlertColumn[k].minColor = component.Scorecard.Alerts.AlertColumn[k].minColor || "#f89406";
                    component.Scorecard.Alerts.AlertColumn[k].maxColor = component.Scorecard.Alerts.AlertColumn[k].maxColor || "#00b16a";
                }
            }
            if(component[component.subElement].fitColumns == undefined) {
            	component[component.subElement].fitColumns = true;
            }
            if (component.Scorecard.alternaterowscolor) {
                var alt = component.Scorecard.alternaterowscolor;
                if (alt.split(",").length == 1) {
                    component.Scorecard.alternaterowscolor = alt + "," + alt;
                }
            } else {
                component.Scorecard.alternaterowscolor = "#ffffff,#ffffff";
            }
        };
        /** to add default values of conditional/category colors for old dashboard components(Bubble,Groupbar,Line,Pie) **/
        $scope.addConditionalCategoryColors = function(component) {
        	if (component[component.subElement].ConditionalColors == undefined) {
                component[component.subElement].ConditionalColors = {};
                component[component.subElement].ConditionalColors.ConditionalColor = [];
            }
            if (component[component.subElement].CategoryColors == undefined) {
                component[component.subElement].CategoryColors = {};
                component[component.subElement].CategoryColors.categoryDefaultColor = "";
                component[component.subElement].CategoryColors.categoryDefaultColorSet = "";
                component[component.subElement].CategoryColors.showColorsFromCategoryName = "false";
                component[component.subElement].CategoryColors.CategoryColor = [];
            }
        };
        /** to add default values of DynamicRange color Properties for old dashboard components(Bubble,Heatmap,plot,treemap,wordcloud,worldmap) **/
        $scope.addDynamicRangeProperties = function(component) {
        	component[component.subElement].showDynamicRange = component[component.subElement].showDynamicRange || false;
            component[component.subElement].maxRangeColor = component[component.subElement].maxRangeColor || "#00b16a";
            component[component.subElement].minRangeColor = component[component.subElement].minRangeColor || "#f89406";
        };
        /** to add default DataLabel Custom Properties for old dashboard components **/
        $scope.addDefaultDataLabelProperties = function(component) {
        	for (var i = 0; i < component[component.subElement].DataSet.Fields.length; i++) {
                var field = component[component.subElement].DataSet.Fields[i];
                /** When dashboard does not have data labels and formatters **/
                if (field.DataLabelCustomProperties == undefined) {
                    field.DataLabelCustomProperties = {};
                    if(((component[component.subElement].Type === "Pie") && IsBoolean(component.showSliceValue)) || ((component.subElement === "Funnel") && IsBoolean(component.Funnel.showLayerValue))){
                        field.DataLabelCustomProperties.showDataLabel = true;
                    }else{
                         field.DataLabelCustomProperties.showDataLabel = (field.DataLabelCustomProperties.showDataLabel) ? field.DataLabelCustomProperties.showDataLabel : "false";   
                    }
                    field.DataLabelCustomProperties.showDataLabel = (field.DataLabelCustomProperties.showDataLabel) ? field.DataLabelCustomProperties.showDataLabel : "false";
                    /*DAS-316*/
                    field.DataLabelCustomProperties.hideDataLabel = (field.DataLabelCustomProperties.hideDataLabel) ? field.DataLabelCustomProperties.hideDataLabel : "false";
                    field.DataLabelCustomProperties.hideDataLabelText = (field.DataLabelCustomProperties.hideDataLabelText) ? field.DataLabelCustomProperties.hideDataLabelText : "";
                    field.DataLabelCustomProperties.useFieldColor = (field.DataLabelCustomProperties.useFieldColor) ? field.DataLabelCustomProperties.useFieldColor : "false";
                    field.DataLabelCustomProperties.showPercentValue = (field.DataLabelCustomProperties.useFieldColor) ? field.DataLabelCustomProperties.showPercentValue : "false";
                    field.DataLabelCustomProperties.dataLabelFontColor = (field.DataLabelCustomProperties.dataLabelFontColor) ? field.DataLabelCustomProperties.dataLabelFontColor : "#808080";
                    field.DataLabelCustomProperties.dataLabelDefaultFontColor = (field.DataLabelCustomProperties.dataLabelDefaultFontColor) ? field.DataLabelCustomProperties.dataLabelDefaultFontColor : "#ffffff";
                    field.DataLabelCustomProperties.dataLabelFontSize = (field.DataLabelCustomProperties.dataLabelFontSize) ? field.DataLabelCustomProperties.dataLabelFontSize : 12;
                    field.DataLabelCustomProperties.dataLabelRotation = (field.DataLabelCustomProperties.dataLabelRotation) ? field.DataLabelCustomProperties.dataLabelRotation : "0";
                    field.DataLabelCustomProperties.dataLabelTextAlign = (field.DataLabelCustomProperties.dataLabelTextAlign) ? field.DataLabelCustomProperties.dataLabelTextAlign : "center";
                    field.DataLabelCustomProperties.datalabelField = (field.DataLabelCustomProperties.datalabelField) ? field.DataLabelCustomProperties.datalabelField : field.Name;
                    field.DataLabelCustomProperties.datalabelFontFamily = (field.DataLabelCustomProperties.datalabelFontFamily) ? field.DataLabelCustomProperties.datalabelFontFamily : "Roboto";
                    field.DataLabelCustomProperties.datalabelFontStyle = (field.DataLabelCustomProperties.datalabelFontStyle) ? field.DataLabelCustomProperties.datalabelFontStyle : "normal";
                    field.DataLabelCustomProperties.datalabelFontWeight = (field.DataLabelCustomProperties.datalabelFontWeight) ? field.DataLabelCustomProperties.datalabelFontWeight : "normal";
                    field.DataLabelCustomProperties.datalabelPosition = (field.DataLabelCustomProperties.datalabelPosition) ? field.DataLabelCustomProperties.datalabelPosition : "Top";
                    field.DataLabelCustomProperties.dataLabelUseComponentFormater = (field.DataLabelCustomProperties.dataLabelUseComponentFormater) ? field.DataLabelCustomProperties.dataLabelUseComponentFormater : true;
                    field.DataLabelCustomProperties.datalabelFormaterUnit = (field.DataLabelCustomProperties.datalabelFormaterUnit) ? field.DataLabelCustomProperties.datalabelFormaterUnit : "none";
                    field.DataLabelCustomProperties.datalabelFormaterPrecision = (field.DataLabelCustomProperties.datalabelFormaterPrecision) ? field.DataLabelCustomProperties.datalabelFormaterPrecision : "default";
                    field.DataLabelCustomProperties.datalabelFormaterCurrency = (field.DataLabelCustomProperties.datalabelFormaterCurrency) ? field.DataLabelCustomProperties.datalabelFormaterCurrency : "none";
                    field.DataLabelCustomProperties.datalabelFormaterPosition = (field.DataLabelCustomProperties.datalabelFormaterPosition) ? field.DataLabelCustomProperties.datalabelFormaterPosition : "suffix";
                    field.DataLabelCustomProperties.datalabelBackgroundRect = (field.DataLabelCustomProperties.datalabelBackgroundRect) ? field.DataLabelCustomProperties.datalabelBackgroundRect : "false";
                    field.DataLabelCustomProperties.datalabelBackgroundRectColor = (field.DataLabelCustomProperties.datalabelBackgroundRectColor) ? field.DataLabelCustomProperties.datalabelBackgroundRectColor : "#ffffff";
                    field.DataLabelCustomProperties.datalabelStrokeColor = (field.DataLabelCustomProperties.datalabelStrokeColor) ? field.DataLabelCustomProperties.datalabelStrokeColor : "#000000";
                    field.DataLabelCustomProperties.showPercentValue = (field.DataLabelCustomProperties.showPercentValue) ? field.DataLabelCustomProperties.showPercentValue : "false";
                } else if (field.DataLabelCustomProperties.datalabelFormaterUnit == undefined) {
                	/** When dashboard does have data labels but doesn't had formatters **/
                	field.DataLabelCustomProperties.datalabelFormaterUnit = (field.DataLabelCustomProperties.datalabelFormaterUnit) ? field.DataLabelCustomProperties.datalabelFormaterUnit : "none";
                    field.DataLabelCustomProperties.datalabelFormaterPrecision = (field.DataLabelCustomProperties.datalabelFormaterPrecision) ? field.DataLabelCustomProperties.datalabelFormaterPrecision : "default";
                    field.DataLabelCustomProperties.datalabelFormaterCurrency = (field.DataLabelCustomProperties.datalabelFormaterCurrency) ? field.DataLabelCustomProperties.datalabelFormaterCurrency : "none";
                    field.DataLabelCustomProperties.datalabelFormaterPosition = (field.DataLabelCustomProperties.datalabelFormaterPosition) ? field.DataLabelCustomProperties.datalabelFormaterPosition : "suffix";
                    field.DataLabelCustomProperties.showPercentValue = (field.DataLabelCustomProperties.showPercentValue) ? field.DataLabelCustomProperties.showPercentValue : "false";
                } else {
                	/*DAS-316*/
                	field.DataLabelCustomProperties.hideDataLabel = (field.DataLabelCustomProperties.hideDataLabel) ? field.DataLabelCustomProperties.hideDataLabel : "false";
                    field.DataLabelCustomProperties.hideDataLabelText = (field.DataLabelCustomProperties.hideDataLabelText) ? field.DataLabelCustomProperties.hideDataLabelText : "";
                    field.DataLabelCustomProperties.dataLabelDefaultFontColor = (field.DataLabelCustomProperties.dataLabelDefaultFontColor) ? field.DataLabelCustomProperties.dataLabelDefaultFontColor : "#ffffff";
                	field.DataLabelCustomProperties.showPercentValue = (field.DataLabelCustomProperties.showPercentValue) ? field.DataLabelCustomProperties.showPercentValue : "false";
                }
            }
        };
        /** for old dashboards if legend is associated with other component adding default legend fields as selected **/
        $scope.addDefaultLegendProperties = function(component) {
        	var associatedComponent = $scope.getComponentbyId(component.Legend.associatedChartId);
        	if (associatedComponent && associatedComponent.defaultLegendFields === undefined && associatedComponent.Chart.DataSet !== undefined) {
        	    associatedComponent.defaultLegendFields = [];
        	    var componentDataSet = associatedComponent.Chart.DataSet.Fields;
        	    for (var i = 0; i < componentDataSet.length; i++) {
        	        if ((componentDataSet[i].Type == "Series" || componentDataSet[i].Type == "Values") && componentDataSet[i].visible && componentDataSet[i].hierarchyType !== "parent") {
        	            associatedComponent.defaultLegendFields.push({
        	                "key": componentDataSet[i].Name,
        	                "value": true
        	            });
        	        }
        	    }
        	}
        };
        /** for old dashboards add default label formatter properties **/
        $scope.addDefaultLabelFormatterProperties = function (component) {
            component[component.subElement].Formater = component[component.subElement].Formater || "Currency";
            component[component.subElement].Unit = component[component.subElement].Unit || "none";
            component[component.subElement].SignPosition = component[component.subElement].SignPosition || "prefix";
            component[component.subElement].Precision = component[component.subElement].Precision || "default";
            component[component.subElement].NumberFormatter = component[component.subElement].NumberFormatter || "none";
            component[component.subElement].SecondaryFormater = component[component.subElement].SecondaryFormater || "Number";
            component[component.subElement].SecondaryUnit = component[component.subElement].SecondaryUnit || "none";
        };
        /** for old dashboards add default custom tooltip formatter properties **/
        $scope.addDefaultCustomTextBoxForToolTipProperties = function (component) {
    		if (component[component.subElement].CustomTextBoxForToolTip === undefined) {
    			component[component.subElement].CustomTextBoxForToolTip = {
					"dataTipTypeArray": "",
					"dataTipType": "",
					"datatipData": ""
    			};
    			if (IsBoolean(component[component.subElement].showTooltip)) {
    				component[component.subElement].CustomTextBoxForToolTip["dataTipType"] = "Default";
                }else{
                	component[component.subElement].CustomTextBoxForToolTip["dataTipType"] = "None";
                }
            }
        };
        /** To handle Intermediate dashboards which has custom tooltip but no field level formatters **/
        $scope.addDefaultCustomTextBoxForToolTipFormatterProperties = function (component) {
            
    		if (component[component.subElement].CustomTextBoxForToolTip.dataTipTypeForDisplay === undefined) {
                component[component.subElement].CustomTextBoxForToolTip.dataTipTypeForDisplay = {};
            }

    		if (component[component.subElement].CustomTextBoxForToolTip.dataTipTypeForDisplay["useComponentFormatter"] === undefined) {
    			component[component.subElement].CustomTextBoxForToolTip.dataTipTypeForDisplay["useComponentFormatter"] = true;
    		}

    		if (component[component.subElement].CustomTextBoxForToolTip.dataTipTypeForDisplay["formatter"] === undefined) {
    			component[component.subElement].CustomTextBoxForToolTip.dataTipTypeForDisplay["formatter"] = {};
    		}

    		if (component[component.subElement].CustomTextBoxForToolTip.dataTipTypeForDisplay["displayWindow"] === undefined) {
    			component[component.subElement].CustomTextBoxForToolTip.dataTipTypeForDisplay["displayWindow"] = "textBox";
    		}
        	
        };
        
        /** manage groupings of components in skeleton of old configured dashboard **/
        $scope.ManageOldConfiguredDashboardGrouping = function(compObj) {
            var dGroups = $scope.modal.selectedDashboard.json.Dashboard.componentGroups || [];
            compObj["groupings"] = "";
            var groupNames = [];
            for (var i = 0; i < dGroups.length; i++) {
                if (dGroups[i].aCompIds.length) {
                    if (dGroups[i].aCompIds.indexOf(compObj.objectID) != -1) {
                        groupNames.push(dGroups[i].gName)
                    }
                }
            }
            if (groupNames.length) {
                compObj["groupings"] = groupNames.join();
            }
        };
        /** @description Will be called when a saved dashboard opens and broadcasted from mainMenuController **/
        $scope.$on("getJsonFromOpenDashoardAndDrawComponent", function() {
        	/*DAS-201 check for render visiblehidden components*/
        	if($scope.modal.getDashboardComponents){
        		$scope.RenderDashoardHiddenDrawComponent();
        		return true;
        	}
            $scope.modal.compCtr = 0;
            var componentIds = [],
                handleComponentRendering = function(jsonData, args) {
                    var totalComponentInDb = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object.length;
                    var comp = args["component"];
                    var cParent = comp.parent;
                    var componentClass = comp.designData.class;
                    var componentData = $scope.componentJson = DesignerUtil.prototype.ISJson(jsonData)[comp.designData.class];

                    /* * draw component code **/
                    var chartZIndex = (args["index"]);
                    var cId = componentData.Properties.Object.objectID = comp.objectID;
                    componentIds.push(cId);
                    var left = componentData.Properties.Object.x = comp.x;
                    var top = componentData.Properties.Object.y = comp.y;
                    var height = comp.height;
                    var width = comp.width;
                    componentData.Properties.Object.objectName = comp.objectName;

                    if (cParent && cParent.indexOf("dashboard") == -1) {
                        $scope.chartContainerId = $scope.modal.getSelectedDashboardId() + "-" + cParent;
                    } else {
                        $scope.chartContainerId = cParent;
                    }
                    var chartContainer = $scope.addDesignerComponentContainer(cId, left, top, height, width, chartZIndex);
                    /** Setting the x, y to 0 for drawing the external division **/
                    comp.x = 0;
                    comp.y = 0;
                    var component = ReflectUtil.newInstance(componentClass, chartContainer, "inherit");
                    //component.setProperty(componentData.Properties);
                    component.m_designMode = true;
                    component.setProperty({
                        "Object": args["component"]
                    });
                    /** Re-setting the x, y to 0 for managing property **/
                    comp.x = left;
                    comp.y = top;
                    if (componentData.Data != undefined && componentData.Fields != undefined) {
                        component.setDataProvider(componentData.Data);
                        component.setFields(componentData.Fields);
                    }
                    try {
                        if ($scope.modal.rawComponentJSONlist[componentClass] == null ||
                            $scope.modal.rawComponentJSONlist[componentClass] == undefined ||
                            $scope.modal.rawComponentJSONlist[componentClass] == "") {
                            $scope.modal.rawComponentJSONlist[componentClass] = JSON.parse(JSON.stringify(componentData));
                        }
                        component.draw();

                        /** BDD-726 component shadow shows when dashboard re-opened and hides when new component added **/
                        $scope.updateComponentShadowFromPreference();
                        
                        /** Adding setting icons to the component **/
                        $scope.addSettingBtns(cId, componentData.Properties.Object.isDataSetAvailable, componentData.Properties.Object.enableScript);
                    } catch (e) {
                        console.log("error in drawing of component!");
                        console.log(e);
                    }

                    $scope.handleComponentSelection(cId, false, false, true);
                    if (!$scope.isSelectedDashboardResponsive()) {
                        $scope.initDragComponent(component);
                        $scope.initResizeComponent(component);
                    }
                    $scope.AddInComponentObjectList(cId, component);
                    $scope.addDblClickEvent(cId);
                    $scope.modal.selectedComponentId = cId;
                    if (componentIds.length == $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object.length) {
                         //  $scope.loadPropertyPalettesInBg(componentIds);
                         loadpropertyfile($scope.modal.propertyData);
                    }
                    function loadpropertyfile(propertydata) {
                        for (var i = 0; i < componentIds.length; i++) {
                            var component = $scope.getComponentbyId(componentIds[i]),
                                propFileName = component["componentType"],
                                _propertyJson = [];
                            for (var jj = 0; jj < propertydata.length; jj++) {
                                if (propertydata[jj].Info != undefined && propertydata[jj].Info[0].class == component.designData.class){
                                	_propertyJson = propertydata[jj];
                                	break;
                                }
                            }       
                            if (!$scope.modal.propertyJsonList.hasOwnProperty(propFileName)) {
                                $scope.modal.propertyJsonList[propFileName] = _propertyJson;
                            }
                        }
                    }
                    if (IsBoolean(comp.showLocked)) {
                        $scope.lockComponent(false, {
                            "lockComponent": true,
                            "objectID": comp.objectID
                        }, true);
                    }
                    if (IsBoolean(comp.unShowHidden)) {
                        $scope.hideComponent(false, {
                            "hideComponent": true,
                            "objectID": comp.objectID
                        }, true);
                    }

                    if ($scope.modal.compCtr != totalComponentInDb - 1) {
                        $scope.modal.compCtr++;
                    } else {
                        $scope.modal.dashbaordLoadingInProgress = false;
                    }
                    // $scope.initHintVariables( DesignerFactory.getSelectedDashboardId() );
                };
                
            /**cleared saved json, produced while toggling properties/themes**/
        	delete $scope.updatedJson;
        	delete $scope.themesOnLoad;
        	
            /** Add new properties in existing old configured dashboard's metadata **/
            $scope.updateOldConfiguredDashboardMetadata();
            /** Add new properties in skeleton of old configured dashboard **/
            $scope.supportOldConfiguredDashboardSkeleton();
            $scope.setSnapToGridSize();
            
            var objs = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object;
            if (objs.length > 0) {
                for (var ii = 0; ii < objs.length; ii++) {
                    var component = objs[ii];
                    /**Removing "newdrag" object when importing old dashboard [Start]**/
                    delete component["newdrag"];
                    /**[End]**/
                    var args = null;
                    $scope.setSelectedVariable(undefined, component, "Component");
                    $scope.ManageOldConfiguredDashboardGrouping(component);
                    try {
                        component = $scope.SupportOldConfiguredDashboard(component);
                    } catch (e) {
                        console.log("Error in updating old configured dashboard");
                    }
                    if (component && typeof(component) === "object") {
                        args = {
                            "component": component,
                            "index": ii
                        };
                        $scope.dropCoordinates = {
                            "x": component.x,
                            "y": component.y
                        };                       
//                             $scope.getThemeJsonOnImport(component, args, function(cJson, args) {
//                                 handleComponentRendering(cJson, args);
//                             });
                        var cJson = $scope.modal.compMetaData[component.designData.class];
                        handleComponentRendering(cJson, args);
                    }
                    /** Old dashboard components register in Undo Redo stack*/
                    if ($scope.modal.layoutType == "AbsoluteLayout") {
                    	$scope.registerInHistory("oldComp", component);
                    }
                }
            } else {
                /** When there was no component in dashboard. selectedDashboard was not changing when clicked on tab**/
                $scope.modal.dashbaordLoadingInProgress = false;
            }
            
            /**BDD-546 : Added to support old configuration For Mobile, Tab layout*/
            var ObjectDashboard = $scope.modal.selectedDashboard.json.Dashboard;
            for (var keyOld in ObjectDashboard) {
                if ((keyOld === "MobileLayout") || (keyOld === "TabletLayout")) {
                	var objs2 = $scope.modal.selectedDashboard.json.Dashboard[keyOld].Object;
                    if (objs2.length > 0) {
                        for (var ij = 0; ij < objs2.length; ij++) {
                            var componentOld = objs2[ij];
                            try {
                                componentOld = $scope.SupportOldConfiguredDashboard(componentOld);
                            } catch (e) {
                                console.log("Error in updating old configured dashboard");
                            }
                        }
                    } else {
                        /** When there was no component in dashboard. selectedDashboard was not changing when clicked on tab**/
                        $scope.modal.dashbaordLoadingInProgress = false;
                    }
                }
            }
            $scope.initHintVariables(DesignerFactory.getSelectedDashboardId());
        });
        
        /**DAS-201 @description Will be called after render visible components broadcasted from mainMenuController **/
        $scope.RenderDashoardHiddenDrawComponent = function() {
        	//$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object = $scope.modal.dashboardHiddenComponents;
            $scope.modal.compCtr = 0;
            var componentIds = [],
                handleComponentRendering = function(jsonData, args) {
                    var totalComponentInDb = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object.length;
                    var comp = args["component"];
                    var cParent = comp.parent;
                    var componentClass = comp.designData.class;
                    var componentData = $scope.componentJson = DesignerUtil.prototype.ISJson(jsonData)[comp.designData.class];

                    /* * draw component code **/
                    var chartZIndex = (args["index"]);
                    var cId = componentData.Properties.Object.objectID = comp.objectID;
                    componentIds.push(cId);
                    var left = componentData.Properties.Object.x = comp.x;
                    var top = componentData.Properties.Object.y = comp.y;
                    var height = comp.height;
                    var width = comp.width;
                    componentData.Properties.Object.objectName = comp.objectName;

                    if (cParent && cParent.indexOf("dashboard") == -1) {
                        $scope.chartContainerId = $scope.modal.getSelectedDashboardId() + "-" + cParent;
                    } else {
                        $scope.chartContainerId = cParent;
                    }
                    var chartContainer = $scope.addDesignerComponentContainer(cId, left, top, height, width, chartZIndex);
                    /** Setting the x, y to 0 for drawing the external division **/
                    comp.x = 0;
                    comp.y = 0;
                    var component = ReflectUtil.newInstance(componentClass, chartContainer, "inherit");
                    //component.setProperty(componentData.Properties);
                    component.m_designMode = true;
                    component.setProperty({
                        "Object": args["component"]
                    });
                    /** Re-setting the x, y to 0 for managing property **/
                    comp.x = left;
                    comp.y = top;
                    if (componentData.Data != undefined && componentData.Fields != undefined) {
                        component.setDataProvider(componentData.Data);
                        component.setFields(componentData.Fields);
                    }
                    try {
                        if ($scope.modal.rawComponentJSONlist[componentClass] == null ||
                            $scope.modal.rawComponentJSONlist[componentClass] == undefined ||
                            $scope.modal.rawComponentJSONlist[componentClass] == "") {
                            $scope.modal.rawComponentJSONlist[componentClass] = JSON.parse(JSON.stringify(componentData));
                        }
                        component.draw();

                        /** BDD-726 component shadow shows when dashboard re-opened and hides when new component added **/
                        $scope.updateComponentShadowFromPreference();
                        
                        /** Adding setting icons to the component **/
                        $scope.addSettingBtns(cId, componentData.Properties.Object.isDataSetAvailable, componentData.Properties.Object.enableScript);
                    } catch (e) {
                        console.log("error in drawing of component!");
                        console.log(e);
                    }

                    $scope.handleComponentSelection(cId, false, false, true);
                    if (!$scope.isSelectedDashboardResponsive()) {
                        $scope.initDragComponent(component);
                        $scope.initResizeComponent(component);
                    }
                    $scope.AddInComponentObjectList(cId, component);
                    $scope.addDblClickEvent(cId);
                    $scope.modal.selectedComponentId = cId;
                    if (componentIds.length == $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object.length) {
                         //  $scope.loadPropertyPalettesInBg(componentIds);
                         loadpropertyfile($scope.modal.propertyData);
                    }
                    function loadpropertyfile(propertydata) {
                        for (var i = 0; i < componentIds.length; i++) {
                            var component = $scope.getComponentbyId(componentIds[i]),
                                propFileName = component["componentType"],
                                _propertyJson = [];
                            for (var jj = 0; jj < propertydata.length; jj++) {
                                if (propertydata[jj].Info != undefined && propertydata[jj].Info[0].class == component.designData.class){
                                	_propertyJson = propertydata[jj];
                                	break;
                                }
                            }       
                            if (!$scope.modal.propertyJsonList.hasOwnProperty(propFileName)) {
                                $scope.modal.propertyJsonList[propFileName] = _propertyJson;
                            }
                        }
                    }
                    if (IsBoolean(comp.showLocked)) {
                        $scope.lockComponent(false, {
                            "lockComponent": true,
                            "objectID": comp.objectID
                        }, true);
                    }
                    if (IsBoolean(comp.unShowHidden)) {
                        $scope.hideComponent(false, {
                            "hideComponent": true,
                            "objectID": comp.objectID
                        }, true);
                    }

                    if ($scope.modal.compCtr != totalComponentInDb - 1) {
                        $scope.modal.compCtr++;
                    } else {
                        $scope.modal.dashbaordLoadingInProgress = false;
                    }
                    // $scope.initHintVariables( DesignerFactory.getSelectedDashboardId() );
                };
                
            /**cleared saved json, produced while toggling properties/themes**/
        	delete $scope.updatedJson;
        	delete $scope.themesOnLoad;  
        	/** Add new properties in existing old configured dashboard's metadata **/
            $scope.updateOldConfiguredDashboardMetadata();
            /** Add new properties in skeleton of old configured dashboard **/
            $scope.supportOldConfiguredDashboardSkeleton();
            $scope.setSnapToGridSize();
            if($scope.modal.dashboardVisibleComponents.length < 1 && $scope.modal.dashboardHiddenComponents.length < 1){
				var completeDashboardJson = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object;
			} else{
				var completeDashboardJson = $scope.modal.dashboardVisibleComponents.concat($scope.modal.dashboardHiddenComponents);
			}
            				
            var objs = completeDashboardJson;
            //var objs = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object;
            if (objs.length > 0) {
                for (var ii = 0; ii < objs.length; ii++) {
                    var component = objs[ii];
                    /**Removing "newdrag" object when importing old dashboard [Start]**/
                    delete component["newdrag"];
                    /**[End]**/
                    var args = null;
                    $scope.setSelectedVariable(undefined, component, "Component");
                    $scope.ManageOldConfiguredDashboardGrouping(component);
                    try {
                        component = $scope.SupportOldConfiguredDashboard(component);
                        var index = ($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object).findIndex(function(element) {
                            return element.objectID === component.objectID;
                        });
                        if (index !== -1) {
                            $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object[index] = component;
                        }
                    } catch (e) {
                        console.log("Error in updating old configured dashboard");
                    }
                    /*check for first hidden components and hide the loader*/
                    if(component.unShowHidden == true){
                    	ServiceFactory.hideLoader();
                    }
                    if (component && typeof(component) === "object") {
                        args = {
                            "component": component,
                            "index": objs[ii].zindex
                        };
                        $scope.dropCoordinates = {
                            "x": component.x,
                            "y": component.y
                        };                       
//                             $scope.getThemeJsonOnImport(component, args, function(cJson, args) {
//                                 handleComponentRendering(cJson, args);
//                             });
                        var cJson = $scope.modal.compMetaData[component.designData.class];
                        /**DAS-679 */
                        if(component.themeType !== undefined && component.themeType !== "default-theme" && Array.isArray(cJson[component.designData.class].Fields)){

							var dthemeJson = $scope.modal.themeData.dashboardTheme;
							cJson[component.designData.class].Fields.forEach(function(obj, ind){
								if(obj.Color !== undefined && dthemeJson.datasetColors !== undefined && dthemeJson.datasetColors[ind] !== undefined){
									obj.Color = dthemeJson.datasetColors[ind];
								}
							})
						}
                        handleComponentRendering(cJson, args);
                    }
                    /** Old dashboard components register in Undo Redo stack*/
                    if ($scope.modal.layoutType == "AbsoluteLayout") {
                    	$scope.registerInHistory("oldComp", component);
                    }
                }
            } else {
                /** When there was no component in dashboard. selectedDashboard was not changing when clicked on tab**/
                $scope.modal.dashbaordLoadingInProgress = false;
            }
            
            /**BDD-546 : Added to support old configuration For Mobile, Tab layout*/
            var ObjectDashboard = $scope.modal.selectedDashboard.json.Dashboard;
            for (var keyOld in ObjectDashboard) {
                if ((keyOld === "MobileLayout") || (keyOld === "TabletLayout")) {
                	var objs2 = $scope.modal.selectedDashboard.json.Dashboard[keyOld].Object;
                    if (objs2.length > 0) {
                        for (var ij = 0; ij < objs2.length; ij++) {
                            var componentOld = objs2[ij];
                            try {
                                componentOld = $scope.SupportOldConfiguredDashboard(componentOld);
                            } catch (e) {
                                console.log("Error in updating old configured dashboard");
                            }
                        }
                    } else {
                        /** When there was no component in dashboard. selectedDashboard was not changing when clicked on tab**/
                        $scope.modal.dashbaordLoadingInProgress = false;
                    }
                }
            }
            $scope.initHintVariables(DesignerFactory.getSelectedDashboardId());
        };
        
        /** @description Update new values in old Dashboard's blocks like DataProvider to support changes done in newer designer versions **/
        $scope.updateOldConfiguredDashboardMetadata = function() {
        	/** Add Mobile and Tablet layout objects in old dashboard **/
        	if ($scope.modal.selectedDashboard.json.Dashboard.MobileLayout == undefined) {
	        	$scope.modal.selectedDashboard.json.Dashboard.MobileLayout = {
		        	"resolution": "375x663",
		        	"width": "375",
		        	"height": "663",
		        	"border": 1 + "px solid #a9a9a9",
		        	"pinedObject": [],
		        	"Object": []
	        	};
        	} else {
        		if ($scope.modal.selectedDashboard.json.Dashboard.MobileLayout.pinedObject == undefined) {
        			$scope.modal.selectedDashboard.json.Dashboard.MobileLayout.pinedObject = [];
        		}
        	}
        	if ($scope.modal.selectedDashboard.json.Dashboard.TabletLayout == undefined) {
	        	$scope.modal.selectedDashboard.json.Dashboard.TabletLayout = {
		        	"resolution": "1024x768",
		        	"width": "1024",
		        	"height": "768",
		        	"border": 1 + "px solid #a9a9a9",
		        	"pinedObject": [],
		        	"Object": []
	        	};
        	} else {
	        	if ($scope.modal.selectedDashboard.json.Dashboard.TabletLayout.pinedObject == undefined) {
	        		$scope.modal.selectedDashboard.json.Dashboard.TabletLayout.pinedObject = [];
	        	}
        	}

        	/** making dashboard json global variables empty array, as we are not accessing them in parser **/
        	$scope.modal.selectedDashboard.json.Dashboard.GlobalVariable.Variable = [];
        	
        	/** setting showShadow to false for old dashboards **/
        	if ($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.showShadow == undefined) {
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.showShadow = "false";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.shadowColor = "#000000";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.shadowOpacity = "0.1";
        	}
        	if ($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties == undefined) {
        		$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties = {};
        		$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Background = {};
        		$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Title = {};
        		$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.SubTitle = {};
        		$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Formatter = {};
        		$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Legend = {};
        		$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis = {};
        		$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.yAxis = {};
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.BackgroundValue = false;
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.TitleValue = false;
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.SubTitleValue = false;
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.LegendValue = false;
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxisValue = false;
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.yAxisValue = false;
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Background.showBorder = true;
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Background.borderColor = "#EFF0F0";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Background.borderRadius = "0";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Title.showTitle = true;
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Title.TitleBarHeight = "48";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Title.FontColor = "#000000";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Title.FontFamily = "BizvizFont";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Title.FontSize = "17";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Title.FontStyle = "normal";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Title.FontWeight = "600";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Title.TextDecoration = "none";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Title.Align = "left";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.SubTitle.showSubTitle = false;
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.SubTitle.FontColor = "#000000";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.SubTitle.FontFamily = "BizvizFont";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.SubTitle.FontSize = "17";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.SubTitle.FontStyle = "normal";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.SubTitle.FontWeight = "600";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.SubTitle.TextDecoration = "none";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.SubTitle.Align = "left";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Formatter.NumberFormatter = "number";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Formatter.Precision = "default";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Formatter.Unit = "none";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Formatter.SecondaryUnit = "none";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Formatter.SignPosition = "prefix";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Legend.showLegends = false;
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Legend.legendfontColor = "#494950";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Legend.legendfontFamily = "BizvizFont";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Legend.legendfontSize = "14";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Legend.legendfontStyle = "normal";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Legend.legendfontWeight = "normal";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Legend.legendtextDecoration = "none";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.Legend.hideLegendOnStart = true;
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis.CategoryMarkingColor = "#FFFFFF";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis.FontColor = "#494950";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis.FontFamily = "BizvizFont";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis.FontSize = "14";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis.FontStyle = "normal";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis.FontWeight = "normal";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis.TextDecoration = "none";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis.LabelFontColor = "#494950";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis.LabelFontFamily = "BizvizFont";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis.LabelFontSize = "14";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis.LabelFontStyle = "normal";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis.LabelFontWeight = "normal";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis.LabelTextDecoration = "none";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis.LabelTilted = false;
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis.Labelrotation = "90";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis.LineXAxisColor = "#859EBE";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis.ShowLineXAxis = true;
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.xAxis.TickMarks = true;
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.yAxis.FontColor = "#494950";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.yAxis.FontFamily = "BizvizFont";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.yAxis.FontSize = "14";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.yAxis.FontStyle = "normal";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.yAxis.FontWeight = "normal";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.yAxis.TextDecoration = "none";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.yAxis.LabelFontColor = "#494950";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.yAxis.LabelFontFamily = "BizvizFont";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.yAxis.LabelFontSize = "14";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.yAxis.LabelFontStyle = "normal";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.yAxis.LabelFontWeight = "normal";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.yAxis.LabelTextDecoration = "none";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.yAxis.LabelTilted = false;
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.yAxis.Labelrotation = "90";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.yAxis.LineXAxisColor = "#859EBE";
	        	$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.globalProperties.yAxis.ShowLineYAxis = "none";
	        	$scope.selectedGlobalProperty[$scope.getActiveDashboardId()][$scope.modal.layoutType] = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].globalProperties;
        	} 
        	/** setting scalingView to FitToPage for old dashboards **/
        	if ($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.scalingView == undefined) {
        		$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.scalingView = "fitToPage";
        	}
        	if ($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.dashboardAlign == undefined) {
        		$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.dashboardAlign = "none";
        	}
        	if ($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.enableResize == undefined) {
        		$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.enableResize = "false";
        	}
        	if ($scope.modal.selectedDashboard.json.Dashboard.designConfig == undefined) {
        		$scope.modal.selectedDashboard.json.Dashboard.designConfig = {};
        		$scope.modal.selectedDashboard.json.Dashboard.designConfig.snapGridSize = 1;
        	}
        	
        	if ($scope.modal.selectedDashboard.json.Dashboard.PublicFilters == undefined) {
        		$scope.modal.selectedDashboard.json.Dashboard.PublicFilters = [];
        	}

        	/** sets the actual DataURL object to the selectedConnection variable **/
        	if ($scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection !== undefined) {
        		var selConnId = (($scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection[0]) ? 
        				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection[0].id : 
        					$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.id);
        		var conns = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL;
        		$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection = DesignerUtil.prototype.findInArray(conns, "id", selConnId);

            	/** Update the config in selected connection **/
            	if ($scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection !== undefined && $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.ClarityOptionalCondition == undefined) {
    	        	$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.ClarityOptionalCondition = {
    	        			"ClaritySort": { "Columns": [{"sortField": "", "sortDirection": ""}] },
    	        			"ClaritySlice":{ "sliceIndex": "", "sliceCount": "" }
    	        	};
            	}
        	}
        	/** Update the config in available connections **/
        	for(var i3=0; i3<$scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL.length; i3++){
	        	var dpr = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL[i3];
	        	if (dpr && dpr.ClarityOptionalCondition == undefined) {
		        	dpr.ClarityOptionalCondition = {
		        			"ClaritySort": { "Columns": [{"sortField": "", "sortDirection": ""}] },
		        			"ClaritySlice":{ "sliceIndex": "", "sliceCount": "" }
		        	};
	        	}
	        	if (dpr.Type === "web") {
	        	      for (var c = 0; c < dpr.availableConditionSet.length; c++) {
	        	              if (dpr.availableConditionSet[c].displayName === undefined) {
	        	            	  dpr.availableConditionSet[c].displayName = IsBoolean(dpr.availableConditionSet[c].name[0] === "_") ? (dpr.availableConditionSet[c].name).slice(1, dpr.availableConditionSet[c].name.length) : dpr.availableConditionSet[c].name;
	        	              }
	        	              if (dpr.availableConditionSet[c].mandatoryField === undefined) {
	        	            	  dpr.availableConditionSet[c].mandatoryField = IsBoolean(dpr.availableConditionSet[c].name[0] === "_") ? true : false;  
	        	              }
	        	      }
	        	}
        	}
        	/** LanguageMapping need to be stored as a dashboard level properties to consume the ids in migration **/
        	if ($scope.modal.selectedDashboard.json.Dashboard.LanguageMapping == undefined) {
	        	$scope.modal.selectedDashboard.json.Dashboard.LanguageMapping = {
        			"enable": "false",
        			"mappingName": "",
        			"mappingId": "",
        			"language": "all"
        	   };
        	}
        };
        /** @description Update new values in old Dashboard Skeleton to support changes done in newer designer versions 
         * this method updates for new  components dragged in old dashboard for old dashboard**/
        $scope.supportOldConfiguredDashboardSkeleton = function() {
            try {
            	/** Add Mobile and Tablet layout objects in old dashboard **/
                var dashboardkey = ["AbsoluteLayout_Object_DataGrid_DataSet_Fields", "AbsoluteLayout_Object_Scorecard_DataSet_Fields", "AbsoluteLayout_Object_DynamicDataGrid_DataSet_Fields", "AbsoluteLayout_Object_Chart_DataSet_Fields"];
                for (var s = 0; s < dashboardkey.length; s++) {
                    if ($scope.modal.selectedDashboard.json[dashboardkey[s]] !== undefined) {
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].formatter = "Currency";
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].secondformatter = "Number";
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].isfixedlabel = "false";
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].Precision = 0;
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].unitname = "none";
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].secondunitname = "none";
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].signposition = "suffix";
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].LineWidth = "2";
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].LineType = "straight";
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].cellType = "none";
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].rowAggregation = "none";
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].IndicatorType = "sparkline";
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].AdditionalField = $scope.modal.selectedDashboard.json[dashboardkey[s]].Name;/**Added for TreeMap additional data label field*/
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].FanSeriesType = "none";
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].FillTransparency = "0.6";
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].Opacity = "1";
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].fontColor = ($scope.modal.selectedDashboard.json[dashboardkey[s]].fontColor === undefined) ? "#000000" : $scope.modal.selectedDashboard.json[dashboardkey[s]].fontColor;
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].fontSize = ($scope.modal.selectedDashboard.json[dashboardkey[s]].fontSize === undefined) ? "16" : $scope.modal.selectedDashboard.json[dashboardkey[s]].fontSize;
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].fontStyle = ($scope.modal.selectedDashboard.json[dashboardkey[s]].fontStyle === undefined) ? "normal" : $scope.modal.selectedDashboard.json[dashboardkey[s]].fontStyle;
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].fontWeight = ($scope.modal.selectedDashboard.json[dashboardkey[s]].fontWeight === undefined) ? "normal" : $scope.modal.selectedDashboard.json[dashboardkey[s]].fontWeight;
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].fontFamily = ($scope.modal.selectedDashboard.json[dashboardkey[s]].fontFamily === undefined) ? "BizvizFont" : $scope.modal.selectedDashboard.json[dashboardkey[s]].fontFamily;
                        $scope.modal.selectedDashboard.json[dashboardkey[s]].enableColumnStyle = ($scope.modal.selectedDashboard.json[dashboardkey[s]].enableColumnStyle === undefined) ? "false" : $scope.modal.selectedDashboard.json[dashboardkey[s]].enableColumnStyle;
                        /** For old dashboards where AbsoluteLayout_Object_DynamicDataGrid_DataSet_Fields is not present in json, code should not break **/
                        if($scope.modal.selectedDashboard.json[dashboardkey[s]].dstype === undefined){
                        		$scope.modal.selectedDashboard.json[dashboardkey[s]]["dstype"] = "none";
                    	} else {
                    		/**on importing old dashboard having dstype "none" and component type is chart (dragging new component on old Db)**/
                        	if ($scope.modal.selectedDashboard.json[dashboardkey[s]].dstype === "none" && dashboardkey[s] === "AbsoluteLayout_Object_Chart_DataSet_Fields") {
                        		$scope.modal.selectedDashboard.json[dashboardkey[s]]["dstype"] = "sum";
                        	}
                    	}
                        /** If dsdate object is not available in old dashboard.**/
                        if ($scope.modal.selectedDashboard.json[dashboardkey[s]].dsdate === undefined) {
                        	$scope.modal.selectedDashboard.json[dashboardkey[s]]["dsdate"] = "none";
                        }
                        /**DAS-1137 If dateformat object is not available in old dashboard.**/
                        if ($scope.modal.selectedDashboard.json[dashboardkey[s]].dateformat === undefined) {
                        	$scope.modal.selectedDashboard.json[dashboardkey[s]]["dateformat"] = "none";
                        }
						/**DAS-1274 If dateformat object is not available in old dashboard.**/
                        if ($scope.modal.selectedDashboard.json[dashboardkey[s]].showcellmerge === undefined) {
                        	$scope.modal.selectedDashboard.json[dashboardkey[s]]["showcellmerge"] = "false";
                        }
                    }
                }
                
                /**Added for new common properties in Funnel and Chart*/
                var dashboardkeyforNewPropChartFunnel = ["AbsoluteLayout_Object_Chart_DataSet_Fields", "AbsoluteLayout_Object_Funnel_DataSet_Fields"];
                for (var s1 = 0; s1 < dashboardkeyforNewPropChartFunnel.length; s1++) {
                	if ($scope.modal.selectedDashboard.json[dashboardkeyforNewPropChartFunnel[s1]] !== undefined) {
                		$scope.modal.selectedDashboard.json[dashboardkeyforNewPropChartFunnel[s1]].PlotTransparency = "1";
                		$scope.modal.selectedDashboard.json[dashboardkeyforNewPropChartFunnel[s1]].DataLabelCustomProperties = {
                                "showDataLabel": "false",
								"hideDataLabel": "false",
								"hideDataLabelText": "",
                                "useFieldColor": "false",
                                "showPercentValue": "false",
                                "dataLabelTextAlign": "center",
                                "dataLabelFontColor": "#808080",
                                "dataLabelDefaultFontColor": "#ffffff",
                                "dataLabelRotation": "0",
                                "dataLabelFontSize": "12",
                                "datalabelFontStyle": "normal",
                                "datalabelFontWeight": "normal",
                                "datalabelFontFamily": "Roboto",
                                "datalabelField": "",
                                "datalabelPosition": "Top",
                                "dataLabelUseComponentFormater":true,
                        		"datalabelFormaterUnit":"none",
                        		"datalabelFormaterPrecision":"default",
                        		"datalabelFormaterCurrency":"none",
                        		"datalabelFormaterPosition":"suffix",
                        		"datalabelBackgroundRect":"false",
            					"datalabelBackgroundRectColor":"#ffffff",
            					"datalabelStrokeColor":"#000000"
                            }
                	}
                }
                
                var alertKey = ["AbsoluteLayout_Object_DataGrid_Alerts_AlertColumn", "AbsoluteLayout_Object_Scorecard_Alerts_AlertColumn"];
                for (var s2 = 0; s2 < alertKey.length; s2++) {
                	if ($scope.modal.selectedDashboard.json[alertKey[s2]] !== undefined) {
	                    if (!$scope.modal.selectedDashboard.json[alertKey[s2]].minColor) {
	                        $scope.modal.selectedDashboard.json[alertKey[s2]].showDynamicRange = "false";
	                        $scope.modal.selectedDashboard.json[alertKey[s2]].minColor = "#f89406";
	                        $scope.modal.selectedDashboard.json[alertKey[s2]].maxColor = "#00b16a";
	                    }
	                    if ($scope.modal.selectedDashboard.json[alertKey[s2]]["customIcon"] === undefined) {
	                    	$scope.modal.selectedDashboard.json[alertKey[s2]]["customIcon"] = "bd-down-arrow,bd-minus,bd-up-arrow";
	                    }
                	}
                }
                
                if ($scope.modal.selectedDashboard.json.DataProviders_DataURL.PredictiveJsonDef == undefined) {
                    $scope.modal.selectedDashboard.json.DataProviders_DataURL.PredictiveJsonDef = "";
                }
                if ($scope.modal.selectedDashboard.json.DataProviders_DataURL.parentSource == undefined) {
                    $scope.modal.selectedDashboard.json.DataProviders_DataURL.parentSource = "";
                }
                if ($scope.modal.selectedDashboard.json.DataProviders_DataURL.childSource == undefined) {
                    $scope.modal.selectedDashboard.json.DataProviders_DataURL.childSource = "";
                }
                if ($scope.modal.selectedDashboard.json.DataProviders_DataURL.deriveConditions == undefined) {
                    $scope.modal.selectedDashboard.json.DataProviders_DataURL.deriveConditions = {};
                    $scope.modal.selectedDashboard.json.DataProviders_DataURL.deriveConditions.criteria = [""];
                }
                if ($scope.modal.selectedDashboard.json.DataProviders_DataURL.dataType == undefined) {
                    $scope.modal.selectedDashboard.json.DataProviders_DataURL.dataType = "JSON";
                }
                if ($scope.modal.selectedDashboard.json.DataProviders_DataURL.ClarityOptionalCondition == undefined) {
                	$scope.modal.selectedDashboard.json.DataProviders_DataURL.ClarityOptionalCondition = {
                		"ClaritySort": { "Columns": [{"sortField": "", "sortDirection": ""}] },
	        			"ClaritySlice":{ "sliceIndex": "", "sliceCount": "" }
	        		};
	        	}
                
                if ($scope.modal.selectedDashboard.json.AbsoluteLayout_Object_DataGrid_DataSet_Fields.showTooltip == undefined) {
                    $scope.modal.selectedDashboard.json.AbsoluteLayout_Object_DataGrid_DataSet_Fields.showTooltip = "false";
                }
                if ($scope.modal.selectedDashboard.json.AbsoluteLayout_Object_DataGrid_DataSet_Fields.sorting == undefined) {
                    $scope.modal.selectedDashboard.json.AbsoluteLayout_Object_DataGrid_DataSet_Fields.sorting = "true";
                }
                if ($scope.modal.selectedDashboard.json.AbsoluteLayout_Object_DataGrid_DataSet_Fields.precision == "0") {
                    $scope.modal.selectedDashboard.json.AbsoluteLayout_Object_DataGrid_DataSet_Fields.precision = "default";
                }
                if ($scope.modal.selectedDashboard.json.AbsoluteLayout_Object_DataGrid_DataSet_Fields.numberFormatter == undefined) {
                    $scope.modal.selectedDashboard.json.AbsoluteLayout_Object_DataGrid_DataSet_Fields.numberFormatter = "none";
                }
                if ($scope.modal.selectedDashboard.json.AbsoluteLayout_Object_Scorecard_DataSet_Fields.showTooltip == undefined) {
                    $scope.modal.selectedDashboard.json.AbsoluteLayout_Object_Scorecard_DataSet_Fields.showTooltip = "false";
                }
                if ($scope.modal.selectedDashboard.json.AbsoluteLayout_Object_Scorecard_DataSet_Fields.sorting == undefined) {
                    $scope.modal.selectedDashboard.json.AbsoluteLayout_Object_Scorecard_DataSet_Fields.sorting = "true";
                }
                if ($scope.modal.selectedDashboard.json.AbsoluteLayout_Object_Scorecard_DataSet_Fields.precision == "0") {
                    $scope.modal.selectedDashboard.json.AbsoluteLayout_Object_Scorecard_DataSet_Fields.precision = "default";
                }
                if ($scope.modal.selectedDashboard.json.AbsoluteLayout_Object_Scorecard_DataSet_Fields.numberFormatter == undefined) {
                    $scope.modal.selectedDashboard.json.AbsoluteLayout_Object_Scorecard_DataSet_Fields.numberFormatter = "none";
                }
                if ($scope.modal.selectedDashboard.json.AbsoluteLayout_Object_Scorecard_DataSet_Fields.parentAggregation == undefined) {
                    $scope.modal.selectedDashboard.json.AbsoluteLayout_Object_Scorecard_DataSet_Fields.parentAggregation = "none";
                }                
            } catch (error) {
                console.log(error);
            }
        };

        /** @description Loades property palette for the component
         * @param  {String} componentIds The component id **/
        $scope.loadPropertyPalettesInBg = function(componentIds) {
            var index = 0;
            $scope.loadPropertyPalette(componentIds, index);
        };

        /**
         * Loades property palettes from the service
         * @param  {String} componentIds The component id
         * @param  {String} index        The index
         */
        $scope.loadPropertyPalette = function(componentIds, index) {
            var component = $scope.getComponentbyId(componentIds[index]),
                propFileName = component["componentType"],
                _dataFilePath = "./resources/data/property/" + propFileName + ".data";

            ServiceFactory.getJsonFileData(_dataFilePath, function(_propertyJson) {
                if (!$scope.modal.propertyJsonList.hasOwnProperty(propFileName)) {
                    $scope.modal.propertyJsonList[propFileName] = _propertyJson;
                }
                index++;
                if (index < componentIds.length) {
                    $scope.loadPropertyPalette(componentIds, index);
                }
            });
        };

        /**
         * Called after completing the drop event
         * @param  {Object} data  The data
         * @param  {Object} evt   The event
         * @param  {Object} cJson The component JSON
         */
        $scope.onDropComplete = function(data, evt, cJson) {
            var
                infoDataArray = [data, cJson],
                cType = data.type,
                cClass = data.class,
                /** BDD-532 Adding of Pre-Scripted Custom component in component shelf, Variation of any chart can be added as a new item without adding whole new component **/
                cThemeClass = ((data.subClass && data.subClass !== "") ? data.subClass : data.class),
                aDbId = $scope.getActiveDashboardId(),
                sTheme = $scope.selectedTheme,
                sGlobalProperty = $scope.selectedGlobalProperty,
                dThemeName = "default-theme",
                basePath = "./resources/bizvizchart-themes/",
                filePath = null,
                /**
                 * Callback for the error handling
                 * @param  {Number} status     The status code
                 * @param  {Object} passedData The passed data object
                 */
                errorCallback = function(status, passedData) {
                    if (status == 404) {
                        filePath = basePath + dThemeName + "/" + cType + "/" + cClass + ".data";
                        ServiceFactory.getJsonFileData(
                            filePath,
                            $scope.onGetJsonDataOfComponent,
                            infoDataArray,
                            function(status, passedData) {});
                    }
                },
                /** @descriptio Sets the co-ordinates for dropping object
                 * @param {object} evt The event object **/
                setDroppingCoordinates = function(evt) {
                    var isDuplicating = evt.duplicating,
                        xCo, yCo, offsetTop, offsetLeft;
                    var $chartContainer = $("#" + $scope.chartContainerId);
                    var borderThickness = $chartContainer[0].style.border.split("px")[0] * 1;
                    if (isDuplicating) {
                        xCo = evt.event.pageX;
                        yCo = evt.event.pageY;
                        xCo = (xCo > $scope.modal.bgGridSize) ? (xCo - xCo%$scope.modal.bgGridSize): ($scope.modal.bgGridSize);
                        yCo = (yCo > $scope.modal.bgGridSize) ? (yCo - yCo%$scope.modal.bgGridSize): ($scope.modal.bgGridSize);
                    /** When redo deleted component coordinates should be same as before delete operation perform */
                    } else if (evt === "redo") {
                        xCo = cJson.x;
                        yCo = cJson.y;
                    } else {
                        offsetTop = $chartContainer.offset().top - $chartContainer.parent().parent().offset().top;
                        offsetLeft = $chartContainer.offset().left - $chartContainer.parent().parent().offset().left;
                        xCo = evt.event.pageX + Math.abs(offsetLeft) - borderThickness;
                        yCo = evt.event.pageY + Math.abs(offsetTop) - borderThickness;
                        xCo = (xCo > $scope.modal.bgGridSize) ? (xCo - xCo%$scope.modal.bgGridSize + borderThickness): ($scope.modal.bgGridSize + borderThickness);
                        yCo = (yCo > $scope.modal.bgGridSize) ? (yCo - yCo%$scope.modal.bgGridSize + borderThickness): ($scope.modal.bgGridSize + borderThickness);
                    }
                    xCo = (xCo > $scope.modal.bgGridSize) ? (xCo - xCo%$scope.modal.bgGridSize + borderThickness): ($scope.modal.bgGridSize + borderThickness);
                    yCo = (yCo > $scope.modal.bgGridSize) ? (yCo - yCo%$scope.modal.bgGridSize + borderThickness): ($scope.modal.bgGridSize + borderThickness);
                    $scope.dropCoordinates = {
                        x: xCo,
                        y: yCo
                    };
                };
            try {
                $scope.chartContainerId = evt.dropDestination ? evt.dropDestination[0].id : aDbId;
                if (cType && !!cType.trim()) {
                    setDroppingCoordinates(evt);
                    
                    filePath = basePath + "default-theme/" + cType + "/" + cThemeClass + ".data";
                    var themefilePath;
                    /**Remove else, when implemented for all themes**/
                    if(sTheme[aDbId] !== "default-theme") {
                    	themefilePath = basePath + sTheme[aDbId] + "/themeConfig.data";
                    } else {
                    	themefilePath = basePath + sTheme[aDbId] + "/" + cType + "/" + cThemeClass + ".data";
                    }
                    
                    var cachedData = $scope.getHttpCachedData(filePath);
                    var themecachedData = $scope.getHttpCachedData(themefilePath);
                    if (themecachedData === undefined) {
                    	infoDataArray["filePath"] = filePath;
                    	infoDataArray["errorCallback"] = errorCallback;
                    	ServiceFactory.getJsonFileData(
                            themefilePath,
                            $scope.getJsonDataOnLoad,
                            infoDataArray,
                            errorCallback
                        );
                    }
                    if (cachedData && themecachedData && cachedData[0] == 200) {
                    	$scope.isDuplicate = (evt.duplicating === undefined)?false:evt.duplicating;
                    	infoDataArray["themeData"] = JSON.parse(themecachedData[1])["DashboardObjects"];                    	
                    	infoDataArray["gpData"] = $scope.selectedGlobalProperty[aDbId][$scope.modal.layoutType];
                        $scope.onGetJsonDataOfComponent(JSON.parse(cachedData[1]), infoDataArray);
                    } else {
                    	if (themecachedData !== undefined) {
                    		infoDataArray["themeData"] = JSON.parse(themecachedData[1])["DashboardObjects"];
                    		infoDataArray["gpData"] = $scope.selectedGlobalProperty[aDbId][$scope.modal.layoutType];
                    		ServiceFactory.getJsonFileData(
                                filePath,
                                $scope.onGetJsonDataOfComponent,
                                infoDataArray,
                                errorCallback
                            );
                    	}
                    }
                } else {}
            } catch (e) {
                console.error(e);
            } finally {
                /** importsStat will be zero until previewed **/
                $scope.modal.selectedDashboard.json.Dashboard.importsStat = 0;
            }
        };

        /** @description Callback returns the cached data from http cache 
         * @param  {String} key as file path**/
        $scope.getHttpCachedData = function(key) {
            return $cacheFactory.get("$http").get(key);
        };
        
        /**Updating json theme, when new component has been dragged in old dashboard**/
        $scope.updateDraggedComponentJson = function(jsonData, args, themejsonData) {
        	var compType = jsonData.Properties.Object.subElement;
        	var jd = jsonData.Properties.Object[compType];       	
        	if(themejsonData.Properties != undefined){
        		var tjd = themejsonData.Properties.Object[compType];
        		jsonData.Properties.Object.themeType = themejsonData.Properties.Object.themeType;
        	} else {
        		var tjd = themejsonData;
        	}       	
        	/**appending an object in component's json to identify whether new component has
        	 * been dragged on Old dashboard**/
        	jsonData.Properties.Object["newdrag"] = true;
        	for (var key in tjd) {
        		if (tjd.hasOwnProperty(key)) {
        			var type = typeof(tjd[key]);
        			if(jd[key] != undefined){
        				if (type === "object") {
            	    		for(var key1 in tjd[key]) {
            	    			jd[key][key1] = tjd[key][key1];
                	        }
            	    	} else {
            	    		jd[key] = tjd[key];
            	    	}
        			}       			
        		}
        	}
        };
        
        /**Dragging components in themes mode when cache is empty**/
        $scope.getJsonDataOnLoad = function(jsonData, args) {
        	args["themeData"] = jsonData;
        	args["gpData"] = $scope.selectedGlobalProperty[$scope.getActiveDashboardId()][$scope.modal.layoutType];
        	ServiceFactory.getJsonFileData(
        		args["filePath"],
                $scope.onGetJsonDataOfComponent,
                args,
                args["errorCallback"]
            );
        };
        
        /** @description Callback function called after getting JSON
         * @param  {Object} jsonData The JSON data
         * @param  {Object} args     The arguments **/
        $scope.onGetJsonDataOfComponent = function(jsonData, args) {
        	//themejsonData = args["themeData"];
        	if (args["themeData"] !== undefined) {
        		$scope.updateDraggedComponentJson(jsonData[args[0].class], args, args["themeData"][args[0].class]);
        	}
        	if (args["gpData"] !== undefined) {
        	    var json = jsonData[args[0].class];
        	    var compType = json.Properties.Object.subElement;
        	    var jd = json.Properties.Object[compType];
        	    json.Properties.Object["newdrag"] = true;
        	    var updatedjson = $scope.propertyUpdate(args["gpData"], jd, compType);
        	    json.Properties.Object[compType] = updatedjson;
        	}
            var data = args[0];
            var properties = args[1];
            $scope.componentJson = DesignerUtil.prototype.ISJson(jsonData);
            $scope.componentJson = $scope.componentJson[data.class];
            if (properties != undefined) {
                $scope.componentJson = $scope.modifyComponentPropertiesForCopy(properties, $scope.componentJson);
            }
            $scope.drawComponent($scope.componentJson, data.class);
            $scope.updateComponentShadowFromPreference();
            $scope.appendDesignData($scope.componentJson, data);
            /** component should be registerInHistory after design data in component object bcz of that registerInHistory() added here */
            $scope.registerInHistory("add", $scope.componentJson.Properties.Object);
            /** To provide the Display Value Field to the single value component and component which does not contain any field**/
            var compObj = $scope.componentJson.Properties.Object;
            compObj["groupings"] = "";
            if(compObj.designData.type !== "chart" && compObj.designData.type !== "datagrid") {
            	$scope.setSelectedVariable(null, compObj, "Component");
            } else {
            	//Added for update connection dataset conditions list when duplicating the component(chart and grid). @BDD-760.
                if ($scope.isDuplicate) {
                    $scope.setSelectedVariable(null, compObj, "Component");     
                }
            }
            /** Notify the modal if object list is changed (ADD or Delete of Component) **/
            $scope.modal.notifyObjectListChange();
            $scope.cacheAndEmitPropertyPalette();
            
            /**storing component json when duplicating**/
            /*$scope.updatedJson = ($scope.updatedJson === undefined)?{}:$scope.updatedJson;
            $scope.updatedJson[compObj.objectID] = getDuplicateObject(compObj);*/
        };
        $scope.updateComponentShadowFromPreference = function() {
        	 if(IsBoolean($scope.modal.userPreference.defaultSettings.hideShadow)){
        		 $("#mainDesignerViewDiv #" + $scope.modal.selectedDashboard.id + " .draggableWidgetDiv").removeClass("enableShadow").addClass("disableShadow");
             }else{
            	 $("#mainDesignerViewDiv #" + $scope.modal.selectedDashboard.id + " .draggableWidgetDiv").addClass("enableShadow").removeClass("disableShadow");
             }
        };
        /** @description Modifies some component property for copy purpose
         * @param  {Object} propertyToCopy Source object of property
         * @param  {Object} original       Target object
         * @return {Object}                The modified property object **/
        $scope.modifyComponentPropertiesForCopy = function(propertyToCopy, original) {
            var cpy = angular.copy(propertyToCopy);
            if (DesignerUtil.prototype.IsBoolean(cpy["isDataSetAvailable"])) {
                if (cpy[cpy.subElement]["DataSet"] != undefined) {
                    cpy[cpy.subElement]["DataSet"]["id"] = $scope.modal.getUniqueReference(cpy.shortName);
                }
            }
            /** Remove the association from the duplicated component **/
            if (cpy[cpy.subElement].associatedLegendId) {
            	cpy[cpy.subElement].associatedLegendId = "";
                /** Remove the default field status of legend fields **/
                if (cpy.defaultLegendFields) {
                	delete cpy.defaultLegendFields;
                }
            }

            original["Properties"] = {
                "Object": cpy
            };
            return original;
        };

        /** @description Cache the property palette object for further use **/
        $scope.cacheAndEmitPropertyPalette = function() {
            var component = $scope.getComponentbyId($scope.modal.selectedComponentId),
                propFileName = component["componentType"],
                objectType = component ? AttributeMigration[component["objectType"]][0] : "Dashboard",
                _dataFilePath = "./resources/data/property/" + propFileName + ".data";
            $scope.$emit("cachePropertyInfo", {
                dataFilePath: _dataFilePath,
                propFileName: propFileName,
                id: $scope.modal.selectedComponentId,
                objectType: objectType
            });
        };

        /** @description Gets the property palette object of the selected component **/
        $scope.getPropertyPalette = function() {
            var component = $scope.getComponentbyId($scope.modal.selectedComponentId),
                propFileName = component["componentType"],
                objectType = component ? AttributeMigration[component["objectType"]][0] : "Dashboard",
                _dataFilePath = "./resources/data/property/" + propFileName + ".data";
            $scope.$emit("propertyInfo", {
                dataFilePath: _dataFilePath,
                propFileName: propFileName,
                id: $scope.modal.selectedComponentId,
                objectType: objectType
            });
        };

        /** @description Adds some meta-data to the component object
         * @param  {Object} componentJson The component object
         * @param  {String|Object} data          Data **/
        $scope.appendDesignData = function(componentJson, data) {
            componentJson["Properties"]["Object"]["designData"] = data;
            var v_object = $scope.getNewVariableJson({});
            v_object["Key"] = componentJson["Properties"]["Object"]["referenceID"];
            if (componentJson["autoAddScriptsFromDesigner"] != undefined) {
                v_object["userScript"]["value"] = componentJson["autoAddScriptsFromDesigner"];
            }
            componentJson["Properties"]["Object"]["variable"] = v_object;
        };

        /** @description Close all the opened window or model box on design area **/
        $scope.toggleDesignArea = function() {
            $scope.reloadDefault();
        };

        /** @description cascadedParentsChild is used to update cascade when parent update (formatters)**/
        $scope.cascadedParentsChild = {};

        /** @description Updates the parent with specified property
         * @param  {Object} prop The property object **/
        $scope.updateCascadedParent = function(prop) {
            $scope.cascadedParentsChild[prop.cascadedChild] = prop.value.child;
        };

        /**
         * Click handler for property
         * @param  {Object} prop The property object
         */
        $scope.onPropertyClick = function(prop) {
            $scope.gradientColorList = [];
            var colours = [];
            if ("" + prop.value != "NaN" && prop.value != "") {
                colours = ("" + prop.value).split(",");
            } else {
                colours[0] = "#ffffff";
            }
            for (var i = 0; i < colours.length; i++) {
                var datasetField = {};
                datasetField.index = i;
                datasetField.value = convertColorToHex(colours[i]);
                $scope.gradientColorList.push(datasetField);
            }
            $scope.customprop = prop;
            $scope.showModelPopup("customColorWindow");
            if (navigator.appVersion.indexOf("Win") != -1 || !Modernizr.inputtypes.color) {
                $timeout(function() {
                    $scope.initSpectrumColorPicker("input[type='color']");
                }, 0.01);
            }
        };

        $scope.initSpectrumColorPicker = function(selector){
        	/** Default configuration is set in designer\resources\plugins\polyfills\spectrum.js itself **/
        	/** Remove ununsed spectrums **/
        	$(".sp-container").remove();
        	$(selector).spectrum({});
        };
        /**Map for custom properties in property palette **/
        $scope.customPropTypes = {
			"customColor": {title: "Add Colors",  icon: "glyphicon-tint", callBack: "onPropertyClick"}, 
			"customGridColor": {title: "Add Colors",  icon: "glyphicon-tint", callBack: "onGridPropertyClick"}, 
			"customText": {title: "Add Text",  icon: "glyphicon-new-window", callBack: "onCustomTextClick"}, 
		    "customTextBox": {title: "Add Custom Text Box",  icon: "glyphicon-new-window", callBack: "onCustomTextBoxClick"}, 
		    "customFile": {title: "Browse SVG file",  icon: "glyphicon-new-window", callBack: "onCustomFileClick"}, 
		    "customFileFilterChips": {title: "Browse SVG file",  icon: "glyphicon-new-window", callBack: "onCustomFileFilterChipsClick"}, 
		    "customImageBrowse": {title: "Add Image",  icon: "glyphicon-new-window", callBack: "onCustomImageBrowseClick"}, 
		    "customRangeIndicatorWindow": {title: "Range Properties",  icon: "glyphicon-new-window", callBack: "onCustomRangeIndicatorClick"},
		    "customLevelIndicatorWindow": {title: "Sankey Level Properties",  icon: "glyphicon-new-window", callBack: "onCustomLevelIndicatorClick"},
		    "customAnnotationWindow": {title: "Manage Annotations",  icon: "glyphicon-new-window", callBack: "onCustomAnnotationWindowClick"},
		    "customShapeSelectorWindow": {title: "Knowledge Shapes Selector",  icon: "glyphicon-new-window", callBack: "onCustomShapeSelectorClick"},
		    "customColorSelectorWindow": {title: "Knowledge Color Selector",  icon: "glyphicon-new-window", callBack: "onCustomColorSelectorClick"},
		    "customBulletBandWindow": {title: "Color Ranges",  icon: "glyphicon-new-window", callBack: "onCustomBulletRangeClick"}, 
		    "customBubbleColorBandWindow": {title: "Band Properties",  icon: "glyphicon-new-window", callBack: "onCustomBubbleColorBandClick"}, 
		    "customAssignChartWindow": {title: "Associate a Chart",  icon: "glyphicon-new-window", callBack: "onCustomAssignChartClick"},
		    "customAssignFilterWindow": {title: "Associate Filters",  icon: "glyphicon-new-window", callBack: "onCustomAssignFilterClick"},
		    "customAssignDSChartWindow": {title: "Associate a Chart",  icon: "glyphicon-new-window", callBack: "onCustomAssignDSChartClick"},
		    "customManageTabsWindow": {title: "Manage Tabs",  icon: "glyphicon-new-window", callBack: "onCustomTabClick"},
		    "customAssociateGroupsWindow": {title: "Associate Groups",  icon: "glyphicon-new-window", callBack: "onAssociateGroupsClick"},
		    "customLegendsWindow": {title: "Associate a Chart",  icon: "glyphicon-new-window", callBack: "onCustomLegendClick"},
		    "customCheckboxesWindow": {title: "Associate a Chart",  icon: "glyphicon-new-window", callBack: "onCustomCheckboxClick"}, 
		    "customURLButtonParametersWindow": {title: "Add Parameters",  icon: "glyphicon-new-window", callBack: "onCustomURLButtonParameterClick"}, 
		    "customTrendRangeWindow": {title: "Update Base Range",  icon: "glyphicon-new-window", callBack: "onCustomTrendRangeClick"}, 
		    "customGaugeAlertWindow": {title: "Color Ranges",  icon: "glyphicon-new-window", callBack: "onCustomGaugeIndicatorClick"}, 
		    "customBoxPlotFillColorWindow": {title: "Box Fill Color Properties",  icon: "glyphicon-new-window", callBack: "onCustomBoxFillColorClick"}, 
		    "customThresholdFillWindow": {title: "Fill Threshold colors",  icon: "glyphicon-new-window", callBack: "onCustomThresholdFillWindowClick"},
		    "customProjTimelineMilestoneWindow": {title: "Milestone Configuration",  icon: "glyphicon-new-window", callBack: "onCustomProjTimelineMilestoneClick"}, 
		    "customProjTimelineTaskWindow": {title: "Task Configuration",  icon: "glyphicon-new-window", callBack: "onCustomProjTimelineTaskClick"},
		    "customTextBoxForToolTip": {title: "Tool Tip",  icon: "glyphicon-new-window", callBack: "onCustomTextBoxForToolTip"},
		    "customTextBoxForJSPaths": {title: "JS and CSS Source Paths",  icon: "glyphicon-new-window", callBack: "onCustomTextBoxForJSPaths"},
		    "customTextBoxForJSContent": {title: "JS, HTML and CSS Content",  icon: "glyphicon-new-window", callBack: "onCustomTextBoxForJSContent"},
			"customPublishedWidgets": {title: "Published Widgets",  icon: "glyphicon-new-window", callBack: "onCustomPublishedWidgets"},
			"customTourWindow": {title: "Add Tour",  icon: "glyphicon-new-window", callBack: "onTourClick"},
		    "customLanguageMappingDropdown": {title: "Select a Mapping",  icon: "glyphicon-new-window", callBack: "onCustomLanguageMappingDropdown"},
		    "customThemeMappingDropdown": {title: "Select a Theme",  icon: "glyphicon-new-window", callBack: "onCustomThemeMappingDropdown"},
		    "globalPropertyDropdown": {title: "Select Properties",  icon: "glyphicon-new-window", callBack: "onglobalpropertymappingDropdown"},
		    "customAssignDateWindow": {title: "Associate a Date",  icon: "glyphicon-new-window", callBack: "onCustomAssignDateClick"},
		    "customAnnotationMixedWindow": {title: "Manage Annotations",  icon: "glyphicon-new-window", callBack: "onCustomAnnotationMixedWindowClick"},
		    "customAnnotationTimeLineWindow": {title: "Manage Annotations",  icon: "glyphicon-new-window", callBack: "onCustomAnnotationTimeLineWindowClick"}
		};
		/**@desc funtion to get dataconnections based on type */
		$scope.customAnnotationCOnnectionFilter = function(connections, type){
		    return connections.filter(function(item) {
		            return item.Type === type;
		    });
		}
		/**DAS-972 @description Methods to set annotation dataset **/
		$scope.onCustomAnnotationTimeLineWindowClick = function(prop) {
			if (!$scope.modal.selectedComponentId) {
				return false;
			}
			$scope.custompropAnnotation = prop;
			$scope.custompropAnnotation.value = [];
			$scope.modal.selectedConnectionsDataSet = [];
			/**filter only excel/csv */
			var connectionList = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL;
			var connections = $scope.customAnnotationCOnnectionFilter(connectionList, "offline");
			$scope.modal.selectedDashboardDataProviders = connections;
			var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
			var DataSource = componentJSON.Chart.Annotation.DataSource;
			var DataSourceId = componentJSON.Chart.Annotation.DataSourceId;
			var DataLabel = componentJSON.Chart.Annotation.DataLabel;
			var DataValue = componentJSON.Chart.Annotation.DataValue;
			$scope.modal.selectedAnnotationDatasource = DataSource || "";
			$scope.modal.selectedAnnotationDatasourceId = DataSourceId || "";
			$scope.modal.selectedAnnotationDataLabel = DataLabel || "";
			$scope.modal.selectedAnnotationDataValue = DataValue || "";
			/**populate dataset fieldset based on saved connectionId */
			var selectedconnection = DesignerUtil.prototype.findInArray(connections, "id", DataSourceId);
			$scope.modal.selectedConnectionsDataSet = (selectedconnection) ? selectedconnection.FieldSet : [];
			$scope.showModelPopup("customAnnotationTimeLineWindow");
		};
		/** DAS-972 @desc after selecting connection pouplate the field set in label and value dropdown */
        $scope.changeTimeLineAnnotationDatasource = function(connectionName)
        {
			var connections = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL;
			var connection = DesignerUtil.prototype.findInArray(connections, "connectionName", connectionName);
			$scope.modal.selectedAnnotationDatasource = connectionName;
			$scope.modal.selectedAnnotationDatasourceId = connection.id;
			$scope.modal.selectedConnectionsDataSet  = connection.FieldSet;
			/**reset field maps */
			$scope.modal.selectedAnnotationDataLabel = "";
            $scope.modal.selectedAnnotationDataValue = "";
		};
		$scope.changeTimeLineAnnotationDataFieldLabel = function(field){
			$scope.modal.selectedAnnotationDataLabel = field;
		};
		$scope.changeTimeLineAnnotationDataFieldValue = function(field){
			$scope.modal.selectedAnnotationDataValue = field;
		};
		/**@desc update all anootaion dataset values */
		$scope.UpdateTimeLineAnnottaionConnectionData = function(){
			var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);            
            componentJSON.Chart.Annotation.DataSource = $scope.modal.selectedAnnotationDatasource;
            componentJSON.Chart.Annotation.DataSourceId = $scope.modal.selectedAnnotationDatasourceId;
            componentJSON.Chart.Annotation.DataLabel = $scope.modal.selectedAnnotationDataLabel;
            componentJSON.Chart.Annotation.DataValue = $scope.modal.selectedAnnotationDataValue;
		};
		/**@desc reset all anootaion dataset values */
		$scope.resetTimeLineAnnotationDataConnection = function(){
			$scope.modal.selectedAnnotationDatasource = "";
			$scope.modal.selectedAnnotationDatasourceId = "";
			$scope.modal.selectedConnectionsDataSet  = "";
			$scope.modal.selectedAnnotationDataLabel = "";
            $scope.modal.selectedAnnotationDataValue = "";
		}
		/**DAS-955 @description Methods to set annotation dataset **/
		$scope.onCustomAnnotationMixedWindowClick = function(prop) {
			if (!$scope.modal.selectedComponentId) {
				return false;
			}
			$scope.custompropAnnotation = prop;
			$scope.custompropAnnotation.value = [];
			$scope.modal.selectedConnectionsDataSet = [];
			/**filter only excel/csv */
			var connectionList = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL;
			var connections = $scope.customAnnotationCOnnectionFilter(connectionList, "offline");
			$scope.modal.selectedDashboardDataProviders = connections;
			var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
			var DataSource = componentJSON.Chart.Annotation.DataSource;
			var DataSourceId = componentJSON.Chart.Annotation.DataSourceId;
			var DataLabel = componentJSON.Chart.Annotation.DataLabel;
			var DataValue = componentJSON.Chart.Annotation.DataValue;
			$scope.modal.selectedAnnotationDatasource = DataSource || "";
			$scope.modal.selectedAnnotationDatasourceId = DataSourceId || "";
			$scope.modal.selectedAnnotationDataLabel = DataLabel || "";
			$scope.modal.selectedAnnotationDataValue = DataValue || "";
			/**populate dataset fieldset based on saved connectionId */
			var selectedconnection = DesignerUtil.prototype.findInArray(connections, "id", DataSourceId);
			$scope.modal.selectedConnectionsDataSet = (selectedconnection) ? selectedconnection.FieldSet : [];
			$scope.showModelPopup("customAnnotationMixedWindow");
		};
		/** DAS-955 @desc after selecting connection pouplate the field set in label and value dropdown */
        $scope.changeMixedAnnotationDatasource = function(connectionName)
        {
			var connections = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL;
			var connection = DesignerUtil.prototype.findInArray(connections, "connectionName", connectionName);
			$scope.modal.selectedAnnotationDatasource = connectionName;
			$scope.modal.selectedAnnotationDatasourceId = connection.id;
			$scope.modal.selectedConnectionsDataSet  = connection.FieldSet;
			/**reset field maps */
			$scope.modal.selectedAnnotationDataLabel = "";
            $scope.modal.selectedAnnotationDataValue = "";
		};
		$scope.changeMixedAnnotationDataFieldLabel = function(field){
			$scope.modal.selectedAnnotationDataLabel = field;
		};
		$scope.changeMixedAnnotationDataFieldValue = function(field){
			$scope.modal.selectedAnnotationDataValue = field;
		};
		/**@desc update all anootaion dataset values */
		$scope.UpdateMixedAnnottaionConnectionData = function(){
			var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);            
            componentJSON.Chart.Annotation.DataSource = $scope.modal.selectedAnnotationDatasource;
            componentJSON.Chart.Annotation.DataSourceId = $scope.modal.selectedAnnotationDatasourceId;
            componentJSON.Chart.Annotation.DataLabel = $scope.modal.selectedAnnotationDataLabel;
            componentJSON.Chart.Annotation.DataValue = $scope.modal.selectedAnnotationDataValue;
		};
		/**@desc reset all anootaion dataset values */
		$scope.resetMixedAnnotationDataConnection = function(){
			$scope.modal.selectedAnnotationDatasource = "";
			$scope.modal.selectedAnnotationDatasourceId = "";
			$scope.modal.selectedConnectionsDataSet  = "";
			$scope.modal.selectedAnnotationDataLabel = "";
            $scope.modal.selectedAnnotationDataValue = "";
		}
		/**DAS-954 @description Methods to set annotation dataset **/
		$scope.onCustomAnnotationWindowClick = function(prop) {
			if (!$scope.modal.selectedComponentId) {
				return false;
			}
			$scope.custompropAnnotation = prop;
			$scope.custompropAnnotation.value = [];
			$scope.modal.selectedConnectionsDataSet = [];
			/**filter only excel/csv */
			var connectionList = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL;
			var connections = $scope.customAnnotationCOnnectionFilter(connectionList, "offline");
			$scope.modal.selectedDashboardDataProviders = connections;
			var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
			var DataSource = componentJSON.Chart.Annotation.DataSource;
			var DataSourceId = componentJSON.Chart.Annotation.DataSourceId;
			var DataLabel = componentJSON.Chart.Annotation.DataLabel;
			var DataValue = componentJSON.Chart.Annotation.DataValue;
			$scope.modal.selectedAnnotationDatasource = DataSource || "";
			$scope.modal.selectedAnnotationDatasourceId = DataSourceId || "";
			$scope.modal.selectedAnnotationDataLabel = DataLabel || "";
			$scope.modal.selectedAnnotationDataValue = DataValue || "";
			/**populate dataset fieldset based on saved connectionId */
			var selectedconnection = DesignerUtil.prototype.findInArray(connections, "id", DataSourceId);
			$scope.modal.selectedConnectionsDataSet = (selectedconnection) ? selectedconnection.FieldSet : [];
			$scope.showModelPopup("customAnnotationWindow");
		};
		/** DAS-954 @desc after selecting connection pouplate the field set in label and value dropdown */
		$scope.changeAnnotationDatasource = function(connectionName) {
			var connections = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL;
			var connection = DesignerUtil.prototype.findInArray(connections, "connectionName", connectionName);
			$scope.modal.selectedAnnotationDatasource = connectionName;
			$scope.modal.selectedAnnotationDatasourceId = connection.id;
			$scope.modal.selectedConnectionsDataSet = connection.FieldSet;
			/**reset field maps */
			$scope.modal.selectedAnnotationDataLabel = "";
			$scope.modal.selectedAnnotationDataValue = "";
		};
		$scope.changeAnnotationDataFieldLabel = function(field) {
			$scope.modal.selectedAnnotationDataLabel = field;
		};
		$scope.changeAnnotationDataFieldValue = function(field) {
			$scope.modal.selectedAnnotationDataValue = field;
		};
		/**@desc update all anootaion dataset values */
		$scope.UpdateAnnottaionConnectionData = function() {
			var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
			componentJSON.Chart.Annotation.DataSource = $scope.modal.selectedAnnotationDatasource;
			componentJSON.Chart.Annotation.DataSourceId = $scope.modal.selectedAnnotationDatasourceId;
			componentJSON.Chart.Annotation.DataLabel = $scope.modal.selectedAnnotationDataLabel;
			componentJSON.Chart.Annotation.DataValue = $scope.modal.selectedAnnotationDataValue;
		};
		/**@desc reset all anootaion dataset values */
		$scope.resetAnnotationDataConnection = function() {
			$scope.modal.selectedAnnotationDatasource = "";
			$scope.modal.selectedAnnotationDatasourceId = "";
			$scope.modal.selectedConnectionsDataSet = "";
			$scope.modal.selectedAnnotationDataLabel = "";
			$scope.modal.selectedAnnotationDataValue = "";
		}
        /** @description callBack for custom properties **/
        $scope.getCustomIconClickCB = function(prop) {
        	$scope[ $scope.customPropTypes[prop.type]["callBack"] ](prop);
        };
        
        /** @description add color to the dataset fields **/
        $scope.addColor = function() {
            var datasetField = {};
            datasetField.index = $scope.gradientColorList.length;
            datasetField.value = getRandomHexColor();
            $scope.gradientColorList.push(datasetField);
            if (navigator.appVersion.indexOf("Win") != -1 || !Modernizr.inputtypes.color) {
                $timeout(function() {
                	$scope.initSpectrumColorPicker("input[type='color']");
                }, 0.01);
            }
        };

        /** @description Updates custom colors **/
        $scope.updateCustomColor = function() {
            var colorstr = "";
            for (var i = 0; i < $scope.gradientColorList.length; i++) {
                colorstr += $scope.gradientColorList[i].value + ",";
            }
            colorstr = colorstr.substring(0, colorstr.length - 1);
            $scope.customprop.value = colorstr;
            $scope.onPropertyChange($scope.customprop);
        };

        /**
         * Removes specified color from gradientColorList
         * @param  {String} color Color
         * @return {undefined}       undefined
         */
        $scope.removeCustomColor = function(color) {
            var index = $scope.gradientColorList.indexOf(color);
            $scope.gradientColorList.splice(index, 1);
        };

        /** @description Updates custom colors **/
        $scope.onCustomLanguageMappingDropdown = function(prop) {
        	$scope.customLanguageMapping = angular.copy(prop);
        	$scope.customLanguageMapping.options = [];
        	$scope.customLanguageMapping.heading = "Language Mapping Selection";
        	$scope.customLanguageMapping.mappingName = $scope.modal.selectedDashboard.json.Dashboard.LanguageMapping.mappingName;
        	$scope.customLanguageMapping.mappingId = $scope.modal.selectedDashboard.json.Dashboard.LanguageMapping.mappingId;
    		$scope.customLanguageMapping.value = $scope.modal.selectedDashboard.json.Dashboard.LanguageMapping.mappingId;
        	var
			REQ_URL = req_url.designer["getAllLanguageSetting"],
			REQ_DATA = {
        			spacekey: ServiceFactory.AUTH_INFO.get("spacekey"),
        			token: ServiceFactory.AUTH_INFO.get("token"),
        			serviceName: "getAllLanguageSetting",
        			data: ""
        	},
			requestSuccessFn = function (data, success) {
        		if(success && data && data.languageSettings){
        			if(data.languageSettings.length > 0){
		        		var arr = data.languageSettings;
		        		var opts = [];
		        		for(var i=0; i<arr.length; i++){
		        			opts.push({key: arr[i].id, value: arr[i].name});
		        			if($scope.customLanguageMapping.value == arr[i].id){
		         			   $scope.customLanguageMapping.mappingId = arr[i].id;
		         			   $scope.customLanguageMapping.mappingName = arr[i].name;
		         		   }
		        		}
		        		$scope.customLanguageMapping.options = angular.copy(opts);
		                $scope.showModelPopup("customLanguageMappingDropdown");
        			}else{
        				ServiceFactory.showNotification("Empty Language Mapping List", "alert-info", 3000);
        			}
        		}else{
        			ServiceFactory.showNotification("Failed to get Language Mapping List", "alert-danger", 3000);
        		}
        	},
        	requestFailedFn = function (data_gws, success) {
        		 ServiceFactory.showNotification("Failed to get Language Mappings", "alert-danger", 3000);
        	}
        	
        	BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA,requestSuccessFn, requestFailedFn);
        };
       $scope.updateCustomLanguageMappingDropdown = function(){
    	   var opts = $scope.customLanguageMapping.options;
    	   for(var i=0; i<opts.length; i++){
    		   if($scope.customLanguageMapping.value == opts[i].key){
    			   $scope.customLanguageMapping.mappingId = opts[i].key;
    			   $scope.customLanguageMapping.mappingName = opts[i].value;
    			   break;
    		   }
    	   }
    	   $scope.onPropertyChange($scope.customLanguageMapping);
      };	    
      $scope.onglobalpropertymappingDropdown = function(prop) {
	       $scope.globalPropertyMapping = angular.copy(prop);
	        $scope.globalPropertyMapping.options = {};
	        $scope.globalPropertyMapping.properties = [];
	        $scope.globalPropertyMapping.heading = "Global Property Selection";

	        $scope.globalPropertyMapping.FontFamilyOptions = [];
	        $scope.globalPropertyMapping.FontStyleOptions = [];
	        $scope.globalPropertyMapping.FontWeightOptions = [];
	        $scope.globalPropertyMapping.TextAlignOptions = [];
	        $scope.globalPropertyMapping.TextDecorationOptions = [];

	        var fontweight = [{"key":"normal","value":"Normal"},{"key":"bold","value":"Bold"},{"key":"300","value":"300"},{"key":"600","value":"600"},{"key":"900","value":"900"}];
		    var fontfamily = [{"key":"Arial","value":"Arial"},{"key":"BizvizFont","value":"BizvizFont"},{"key":"BizvizFontRegular","value":"BizvizFontRegular"},{"key":"Cambria","value":"Cambria"},{"key":"Helvetica","value":"Helvetica"},{"key":"Lucida Bright","value":"Lucida Bright"},{"key":"Monotype Corsiva","value":"Monotype Corsiva"},{"key":"Papyrus","value":"Papyrus"},{"key":"'Raleway', sans-serif","value":"Raleway"},{"key":"Roboto","value":"Roboto"},{"key":"Times New Roman","value":"Times New Roman"},{"key":"Ubuntu","value":"Ubuntu"},{"key":"Verdana","value":"Verdana"}];
		    var fontstyle = [{"key":"normal","value":"Normal"},{"key":"italic","value":"Italic"}];
		    var textdecoration = [{"key":"none","value":"None"},{"key":"underline","value":"Underline"}];
		    var textalign = [{"key":"left","value":"Left"},{"key":"center","value":"Center"},{"key":"right","value":"Right"}];
		    var unit = [{"key":"none","value":"None"},{"key":"auto","value":"Auto"},{"key":"Percent","value":"%"},{"key":"Thousand","value":"K"},{"key":"Million","value":"M"},{"key":"Billion","value":"B"},{"key":"Trillion","value":"T"},{"key":"Quadrillion","value":"Q"},{"key":"Lac","value":"Lacs"},{"key":"Crore","value":"Cr"}];
		    var precison = [{"key":"default","value":"Default"},{"key":"0","value":"None"},{"key":"1","value":".0"},{"key":"2","value":".00"},{"key":"3","value":".000"},{"key":"4","value":".0000"},{"key":"6","value":".000000"},{"key":"8","value":".00000000"}];
		    var currency = [{"key":"none","value":"None"},{"key":"Cent","value":"CENT"},{"key":"Euro","value":"EURO"},{"key":"Rupees","value":"INR"},{"key":"Pound","value":"POUND"},{"key":"USD","value":"USD"},{"key":"Yen","value":"YEN"}];
		    var position = [{"key":"prefix","value":"Prefix"},{"key":"suffix","value":"Suffix"}];
		    var numberFormatter = [{"key":"none","value":"None"},{"key":"indiannumber","value":"Indian"},{"key":"number","value":"International"}];

		    var selectedGlobalProperty = $scope.selectedGlobalProperty[$scope.getActiveDashboardId()][$scope.modal.layoutType];
		    
	        $scope.globalPropertyMapping.FontFamilyOptions = angular.copy(fontfamily);
	        $scope.globalPropertyMapping.FontStyleOptions = angular.copy(fontstyle);
	        $scope.globalPropertyMapping.FontWeightOptions = angular.copy(fontweight);
	        $scope.globalPropertyMapping.TextAlignOptions = angular.copy(textalign);
	        $scope.globalPropertyMapping.TextDecorationOptions = angular.copy(textdecoration);
	        $scope.globalPropertyMapping.UnitOptions = angular.copy(unit);
	        $scope.globalPropertyMapping.PrecisionOptions = angular.copy(precison);
	        $scope.globalPropertyMapping.CurrencyOptions = angular.copy(currency);
	        $scope.globalPropertyMapping.PositionOptions = angular.copy(position);
	        $scope.globalPropertyMapping.NumbFormatterOptions = angular.copy(numberFormatter);
	        
	        $scope.globalPropertyMapping.options.BackgroundValue = selectedGlobalProperty.BackgroundValue;
	        $scope.createVariables("Background");
	        $scope.globalPropertyMapping.options.TitleValue = selectedGlobalProperty.TitleValue;
	        $scope.createVariables("Title");
	        $scope.globalPropertyMapping.options.SubTitleValue = selectedGlobalProperty.SubTitleValue;
	        $scope.createVariables("SubTitle");
	        $scope.globalPropertyMapping.options.LegendValue = selectedGlobalProperty.LegendValue;
	        $scope.createVariables("Legend");
	        $scope.globalPropertyMapping.options.FormatterValue = selectedGlobalProperty.FormatterValue;
	        $scope.createVariables("Formatter");
	        $scope.globalPropertyMapping.options.xAxisValue = selectedGlobalProperty.xAxisValue;
	        $scope.createVariables("xAxis");
	        $scope.globalPropertyMapping.options.yAxisValue = selectedGlobalProperty.yAxisValue;
	        $scope.createVariables("yAxis");

	        $scope.showModelPopup("globalPropertyDropdown");
	    };
	    $scope.createVariables = function(obj) {
        	$scope.globalPropertyMapping.properties[obj] = {};
        	var selectedGlobalProperty = $scope.selectedGlobalProperty[$scope.getActiveDashboardId()][$scope.modal.layoutType];
            if (obj == "Legend") {
                $scope.globalPropertyMapping.properties[obj].showLegends = selectedGlobalProperty[obj].showLegends;
                $scope.globalPropertyMapping.properties[obj].legendfontColor = selectedGlobalProperty[obj].legendfontColor;
                $scope.globalPropertyMapping.properties[obj].legendfontFamily = selectedGlobalProperty[obj].legendfontFamily;
                $scope.globalPropertyMapping.properties[obj].legendfontSize = selectedGlobalProperty[obj].legendfontSize;
                $scope.globalPropertyMapping.properties[obj].legendfontStyle = selectedGlobalProperty[obj].legendfontStyle;
                $scope.globalPropertyMapping.properties[obj].legendfontWeight = selectedGlobalProperty[obj].legendfontWeight;
                $scope.globalPropertyMapping.properties[obj].legendtextDecoration = selectedGlobalProperty[obj].legendtextDecoration;
                $scope.globalPropertyMapping.properties[obj].hideLegendOnStart = selectedGlobalProperty[obj].hideLegendOnStart;
            } else if (obj == "Formatter") {
                $scope.globalPropertyMapping.properties[obj].NumberFormatter = selectedGlobalProperty[obj].NumberFormatter;
                $scope.globalPropertyMapping.properties[obj].Precision = selectedGlobalProperty[obj].Precision;
                $scope.globalPropertyMapping.properties[obj].Unit = selectedGlobalProperty[obj].Unit;
                $scope.globalPropertyMapping.properties[obj].SecondaryUnit = selectedGlobalProperty[obj].SecondaryUnit;
                $scope.globalPropertyMapping.properties[obj].SignPosition = selectedGlobalProperty[obj].SignPosition;
            } else if (obj == "Background") {
                $scope.globalPropertyMapping.properties[obj].showBorder = selectedGlobalProperty[obj].showBorder;
                $scope.globalPropertyMapping.properties[obj].borderColor = selectedGlobalProperty[obj].borderColor;
                $scope.globalPropertyMapping.properties[obj].borderRadius = selectedGlobalProperty[obj].borderRadius;
            } else {
                $scope.globalPropertyMapping.properties[obj].FontSize = selectedGlobalProperty[obj].FontSize;
                $scope.globalPropertyMapping.properties[obj].FontColor = selectedGlobalProperty[obj].FontColor;
                $scope.globalPropertyMapping.properties[obj].FontFamily = selectedGlobalProperty[obj].FontFamily;
                $scope.globalPropertyMapping.properties[obj].FontWeight = selectedGlobalProperty[obj].FontWeight;
                $scope.globalPropertyMapping.properties[obj].FontStyle = selectedGlobalProperty[obj].FontStyle;
                $scope.globalPropertyMapping.properties[obj].TextDecoration = selectedGlobalProperty[obj].TextDecoration;
                $scope.globalPropertyMapping.properties[obj].Align = selectedGlobalProperty[obj].Align;
            }

            if (obj == "Title") {
                $scope.globalPropertyMapping.properties[obj].showTitle = selectedGlobalProperty[obj].showTitle;
                $scope.globalPropertyMapping.properties[obj].TitleBarHeight = selectedGlobalProperty[obj].TitleBarHeight;
            }
            if (obj == "SubTitle") {
                $scope.globalPropertyMapping.properties[obj].showSubTitle = selectedGlobalProperty[obj].showSubTitle;
            }
            if (obj == "xAxis" || obj == "yAxis") {
                $scope.globalPropertyMapping.properties[obj].LabelFontColor = selectedGlobalProperty[obj].LabelFontColor;
                $scope.globalPropertyMapping.properties[obj].LabelFontFamily = selectedGlobalProperty[obj].LabelFontFamily;
                $scope.globalPropertyMapping.properties[obj].LabelFontSize = selectedGlobalProperty[obj].LabelFontSize;
                $scope.globalPropertyMapping.properties[obj].LabelFontStyle = selectedGlobalProperty[obj].LabelFontStyle;
                $scope.globalPropertyMapping.properties[obj].LabelFontWeight = selectedGlobalProperty[obj].LabelFontWeight;
                $scope.globalPropertyMapping.properties[obj].LabelTextDecoration = selectedGlobalProperty[obj].LabelTextDecoration;
                $scope.globalPropertyMapping.properties[obj].LabelTilted = selectedGlobalProperty[obj].LabelTilted;
                $scope.globalPropertyMapping.properties[obj].Labelrotation = selectedGlobalProperty[obj].Labelrotation;
            }
            if (obj == "xAxis") {
                $scope.globalPropertyMapping.properties[obj].CategoryMarkingColor = selectedGlobalProperty[obj].CategoryMarkingColor;
                $scope.globalPropertyMapping.properties[obj].LineXAxisColor = selectedGlobalProperty[obj].LineXAxisColor;
                $scope.globalPropertyMapping.properties[obj].ShowLineXAxis = selectedGlobalProperty[obj].ShowLineXAxis;
                $scope.globalPropertyMapping.properties[obj].TickMarks = selectedGlobalProperty[obj].TickMarks;
                $scope.globalPropertyMapping.properties[obj].LabelTilted = selectedGlobalProperty[obj].LabelTilted;
                $scope.globalPropertyMapping.properties[obj].Labelrotation = selectedGlobalProperty[obj].Labelrotation;
            }
            if (obj == "yAxis") {
                $scope.globalPropertyMapping.properties[obj].LineYAxisColor = selectedGlobalProperty[obj].LineYAxisColor;
                $scope.globalPropertyMapping.properties[obj].ShowLineYAxis = selectedGlobalProperty[obj].ShowLineYAxis;
            }
        };
        
        $scope.updateGlobalPropertyDropdown = function() {
        	var options = $scope.globalPropertyMapping.options;
        	var keys = Object.keys($scope.globalPropertyMapping.options);
        	for (var j = 0; j < keys.length; j++) {
        		$scope.selectedGlobalProperty[$scope.getActiveDashboardId()][$scope.modal.layoutType][keys[j]] = options[keys[j]];
        	}
            $scope.applyGlobalProperty($scope.globalPropertyMapping.properties);
            $scope.setDashboardCSS($scope.modal.userPreference);
        };
        $scope.toggleGpHeader = function(arg) {
            if ($scope.globalPropertyMapping.toggleValue == arg && !IsBoolean($scope.globalPropertyMapping.options[arg + "Value"])) {
                $scope.globalPropertyMapping.toggleValue = "";
            } else {
                $scope.globalPropertyMapping.toggleValue = arg;
            }
        };
      /**LKD DAS-408 @description Updates custom themes **/
      $scope.onCustomThemeMappingDropdown = function(prop) {
      	$scope.customThemeMapping = prop;
      	$scope.customThemeMapping.options = [];
      	$scope.customThemeMapping.heading = "Dashboard Theme Selection";
      	$scope.customThemeMapping.themeName = $scope.selectedTheme[$scope.getActiveDashboardId()];
      	$scope.customThemeMapping.themeId = $scope.selectedTheme[$scope.getActiveDashboardId()];
  		$scope.customThemeMapping.value = $scope.selectedTheme[$scope.getActiveDashboardId()];
  		
  		var themearr = $scope.modal.globalThemeDbConfig;
  		var opts = [{key:"default-theme", value:"default-theme"},{key:"dark-theme", value:"dark-theme"},{key:"material-theme", value:"material-theme"},{"key":"EmeraldForest","value":"EmeraldForest"},{"key":"BurnishedBronze","value":"BurnishedBronze"},{"key":"SkyOasis","value":"SkyOasis"},{"key":"CharcoalGrey","value":"CharcoalGrey"}];
  		/*
		angular.forEach(themearr, function(theme, name){
			opts.push({key: name, value: name});
			if($scope.customThemeMapping.value == name){
 			   $scope.customThemeMapping.themeId = name;
 			   $scope.customThemeMapping.themeName = name;
 		   }
		});
		*/
  		angular.forEach(opts, function(theme, name){
			if($scope.customThemeMapping.value == theme.name){
 			   $scope.customThemeMapping.themeId = theme.name;
 			   $scope.customThemeMapping.themeName = theme.name;
 		   }
		});
		$scope.customThemeMapping.options = opts;
        $scope.showModelPopup("customThemeMappingDropdown");
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
		        		var themearr = convertStringToJson(data.settings[0].settings);
		        		var opts = [{key:"default-theme", value:"default-theme"}];
		        		angular.forEach(themearr, function(theme, name){
		        			opts.push({key: name, value: name});
		        			if($scope.customThemeMapping.value == name){
		         			   $scope.customThemeMapping.themeId = name;
		         			   $scope.customThemeMapping.themeName = name;
		         		   }
		        		});
		        		$scope.customThemeMapping.options = angular.copy(opts);
		                $scope.showModelPopup("customThemeMappingDropdown");
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
      };
	  /**LKD DAS-1167 @description Updates @designer @theme if ui theme set as @dark mode**/
	  $scope.onCustomThemeUpdateDropdown = function() {
	  	$scope.customThemeUpdateDropdown.heading = "Update Dashboard Theme for Dark Mode";
	  	$scope.showModelPopup("customThemeUpdateDropdown");
	  };
	  /**LKD DAS-1167 @description Updates @designer @theme if ui theme set as @dark mode**/
	  $scope.updateCustomThemeUpdateDropdown = function(){
			var comp = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType];	
			comp['designerTheme'] = "dark-theme";
			$scope.newDesignerTheme = "dark-theme";
		    $scope.applyDesignerTheme($scope.newDesignerTheme);
		    $scope.setDashboardCSS($scope.modal.userPreference);
	  };
      
      /*DAS-408 update selected theme*/
      $scope.updateCustomThemeMappingDropdown = function() {
		  	var comp = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType];
			comp[$scope.customThemeMapping["attributeName"]] = $scope.customThemeMapping.value;
		  	$scope.themeProp = $scope.customThemeMapping;
		  	$scope.newDesignerTheme = $scope.customThemeMapping.value;
    	    $scope.applyDesignerTheme($scope.newDesignerTheme);
    	    $scope.setDashboardCSS($scope.modal.userPreference);
    	};
        /**
         * Click handler for the Grid properties
         * @param  {Object} prop The property object
         * @return {undefined}      undefined
         */
        $scope.onGridPropertyClick = function(prop) {
            $scope.gridColorList = [];
            var colours = [];
            if ("" + prop.value != "NaN" && prop.value != "")
                colours = ("" + prop.value).split(",");
            else
                colours[0] = "#ffffff";
            for (var i = 0; i < colours.length; i++) {
                var datasetField = {};
                datasetField.index = i;
                datasetField.value = convertColorToHex(colours[i]);
                $scope.gridColorList.push(datasetField);
            }
            $scope.customgridprop = prop;
            $scope.showModelPopup("customGridColorWindow");
            if (navigator.appVersion.indexOf("Win") != -1 || !Modernizr.inputtypes.color) {
                $timeout(function() {
                	$scope.initSpectrumColorPicker("input[type='color']");
                }, 0.01);
            }
        };

        /**
         * Updates grid colors
         * @return {undefined} undefined
         */
        $scope.updateGridColors = function() {
            var colorstr = "";
            for (var i = 0; i < $scope.gridColorList.length; i++) {
                colorstr += $scope.gridColorList[i].value + ",";
            }
            colorstr = colorstr.substring(0, colorstr.length - 1);
            $scope.customgridprop.value = colorstr;
            $scope.onPropertyChange($scope.customgridprop);
        };

        /**
         * Click handler for browse svg files
         * @param  {Object} prop The property object
         * @return {undefine}      undefine
         */
        $scope.onCustomFileClick = function(prop) {
            $("#browseSVG").click().on("change", function(evt) {
                evt.stopImmediatePropagation();
                var file = evt.target.files[0];
                if (file.type == "image/svg+xml") {
                    var fReader = new FileReader();
                    fReader.onload = function(e) {
                        var fText = fReader.result;
                        prop.value = fText;
                        $scope.onPropertyChange(prop);
                    };
                    fReader.readAsText(file);
                } else {
                    ServiceFactory.showNotification("Please use SVG file instead of " + file.name, "alert-danger", 3000);
                }
            });
        };
        
         /** DAS-473
         * Click handler for browse svg files for Filterchips Title
         * @param  {Object} prop The property object
         * @return {undefine}      undefine
         */
        $scope.onCustomFileFilterChipsClick = function(prop) {
            $("#browseSVGFilterchips").click().on("change", function(evt) {
                evt.stopImmediatePropagation();
                var file = evt.target.files[0];
                if (file.type == "image/svg+xml") {
                    var fReader = new FileReader();
                    fReader.onload = function(e) {
                        var fText = fReader.result;
                        prop.value = fText;
                        $scope.onPropertyChange(prop);
                    };
                    fReader.readAsText(file);
                } else {
                    ServiceFactory.showNotification("Please use SVG file instead of " + file.name, "alert-danger", 3000);
                }
            });
        };

        /**
         * Click handler for custom text
         * @param  {Object} prop The property object
         * @return {undefine}      undefine
         */
        $scope.onCustomTextClick = function(prop) {
            $scope.customprop = prop;
            $scope.customprop.text = prop.value;
            $scope.showModelPopup("customTextWindow");
        };

        /**
         * Updates the custom text value
         * @return {undefine} undefine
         */
        $scope.updateCustomTextValue = function() {
            $scope.customprop.value = $scope.customprop.text;
            $scope.onPropertyChange($scope.customprop);
        };
		/**DAS-1228 @desc Published Widgets from datacenter list Popup*/
		 $scope.onCustomPublishedWidgets = function(prop) {
            $scope.customPropPublishedWidgets = angular.copy(prop);
            if (!$scope.modal.selectedComponentId){
                return false;
            }
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
			var associatedWidget = componentJSON.Chart.associatedWidgetData;
			var spaceKey = window.sessionStorage.getItem('bvz_spacekey');
			$scope.selectedWidgetData = associatedWidget;
			var
			REQ_URL = "/widget/getAllPublishWidgets/",
			REQ_DATA = { isPublished : 1, spaceKey: spaceKey },
			requestSuccessFn = function (data, success) {
				var _success = data.widgetResp.success;
				if (_success) {
					$scope.widgetData = data.widgetResp.bizvizWidgets.map(widget => {
					    const parsedData = JSON.parse(widget.data);
					    return {
					      id: widget.id,
						  datasetname: $scope.getPublishedWidgetDatasetName(widget.referenceId),
					      properties: parsedData.properties,
						  viewData: parsedData
					    };
					  });
				} else {
					$scope.widgetData = [];
				}
				$scope.showModelPopup('customPublishedWidgets');
				ServiceFactory.hideLoader();
			},
			requestFailedFn = function (data, success) {
				ServiceFactory.showNotification("Failed to load Publihsed Widgets", "alert-danger", 3000);
				ServiceFactory.hideLoader();
			};
			ServiceFactory.showLoader();
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn); 
		};
		$scope.getPublishedWidgetDatasetName = function(datasetId) {
			var spaceKey = window.sessionStorage.getItem('bvz_spacekey');
			var
			REQ_URL = "/datasource/vieweditqueryservice/",
			REQ_DATA = { serviceId : datasetId, spaceKey: spaceKey },
			requestSuccessFn = function (data, success) {
				var _success = data.queryServices.success;
				if (_success) {
					return data.queryServices.queryService.queryName;
				} else {
					return "Default";
				}
			},
			requestFailedFn = function (data, success) {
				return "Default";
			};
			BIZVIZ.SDK.secureRequest(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
		};
		$scope.setSelectedPublihsedWidget = function(viewdata){
			$scope.selectedWidgetData = viewdata;
		};
		$scope.updateSelectedPublihsedWidget = function(){
			var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
			componentJSON.Chart.associatedWidgetData = $scope.selectedWidgetData;
		};
        /**Custom JS Paths*/
        $scope.onCustomTextBoxForJSPaths = function(prop) {
            $scope.customprop = angular.copy(prop);
            $scope.customprop.activePath = "JS";
            if (!$scope.modal.selectedComponentId){
                return false;
            }
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            $scope.customprop.jspaths = componentJSON.Chart[prop.attributeName.split("-")[0]] || [];
            $scope.customprop.csspaths = componentJSON.Chart[prop.attributeName.split("-")[1]] || [];
            $scope.showModelPopup("customTextBoxForJSPaths");
        };
       $scope.addPathInJSPaths = function() {
    	   if($scope.customprop.activePath == "JS"){
    		   $scope.customprop.jspaths.push({name: "", src: ""});
    	   }else if($scope.customprop.activePath == "CSS"){
    		   $scope.customprop.csspaths.push({name: "", src: ""});
    	   } else {
    		   // Do nothing
    	   }
       };
       $scope.removeAllJSPaths = function() {
    	   if($scope.customprop.activePath == "JS"){
    		   $scope.customprop.jspaths = [];
    	   } else if($scope.customprop.activePath == "CSS"){
    		   $scope.customprop.csspaths = [];
    	   } else {
    		   // Do nothing
    	   }
       };
       $scope.removeJSPath= function(path) {
    	   var index;
    	   if($scope.customprop.activePath == "JS"){
    		   index = $scope.customprop.jspaths.indexOf(path);
    		   $scope.customprop.jspaths.splice(index,1);
    	   } else if($scope.customprop.activePath == "CSS"){
    		   index = $scope.customprop.csspaths.indexOf(path);
    		   $scope.customprop.csspaths.splice(index,1);
    	   } else {
    		   // Do nothing
    	   }
       };
       $scope.updateCustomTextBoxForJSPaths = function(){
	       	var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
	        if($scope.customprop.activePath=="JS"){
	        	componentJSON.Chart.JSPaths = $scope.customprop.jspaths;
	        }
	        if($scope.customprop.activePath=="CSS"){
	        	componentJSON.Chart.CSSPaths = $scope.customprop.csspaths;
	        }
           $scope.redrawComponent(componentJSON);
           /* Synchronize Updates the color band ranges property from desktop to mobile and tablet view*/
           if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
        	   $scope.syncUpdateCustomTextBoxForJSPathsInMobileView(componentJSON);
           }
       };
       $scope.syncUpdateCustomTextBoxForJSPathsInMobileView = function(compObj) {
      	 var mobileLayoutObj = $scope.getComponentFromMobileLayout(compObj.objectID);
           if (mobileLayoutObj) {
        	   mobileLayoutObj.Chart.JSPaths = $scope.customprop.jspaths;
        	   mobileLayoutObj.Chart.CSSPaths = $scope.customprop.csspaths;
           }
           var tabletLayoutObj = $scope.getComponentFromTabletLayout(compObj.objectID);
           if (tabletLayoutObj) {
        	   mobileLayoutObj.Chart.JSPaths = $scope.customprop.jspaths;
        	   mobileLayoutObj.Chart.CSSPaths = $scope.customprop.csspaths;
           }
      };
       
       
      $scope.onCustomTextBoxForJSContent = function(prop) {
          $scope.customprop = angular.copy(prop);
          $scope.customprop.activePath = "JS";
          if (!$scope.modal.selectedComponentId)
              return false;
          var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
          $scope.customprop.jstext = componentJSON.Chart[prop.attributeName.split("-")[0]] || "";
          $scope.customprop.csstext = componentJSON.Chart[prop.attributeName.split("-")[1]] || "";
          $scope.customprop.htmltext = componentJSON.Chart[prop.attributeName.split("-")[2]] || "";
          $scope.showModelPopup("customTextBoxForJSContent");
      };
      $scope.updateCustomTextBoxForJSContent = function(){
	       	var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
        	componentJSON.Chart.JSContent = $scope.customprop.jstext;
        	componentJSON.Chart.CSSContent = $scope.customprop.csstext;
        	componentJSON.Chart.HTMLContent = $scope.customprop.htmltext;
          $scope.redrawComponent(componentJSON);
          /* Synchronize Updates the color band ranges property from desktop to mobile and tablet view*/
          if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
        	  $scope.syncUpdateCustomTextBoxForJSContentInMobileView(componentJSON);
          }
      };
      $scope.syncUpdateCustomTextBoxForJSContentInMobileView = function(compObj) {
     	 var mobileLayoutObj = $scope.getComponentFromMobileLayout(compObj.objectID);
          if (mobileLayoutObj) {
        	  mobileLayoutObj.Chart.JSContent = $scope.customprop.jstext;
        	  mobileLayoutObj.Chart.CSSContent = $scope.customprop.csstext;
        	  mobileLayoutObj.Chart.HTMLContent = $scope.customprop.htmltext;
          }
          var tabletLayoutObj = $scope.getComponentFromTabletLayout(compObj.objectID);
          if (tabletLayoutObj) {
        	  tabletLayoutObj.Chart.JSContent = $scope.customprop.jstext;
        	  tabletLayoutObj.Chart.CSSContent = $scope.customprop.csstext;
        	  tabletLayoutObj.Chart.HTMLContent = $scope.customprop.htmltext;
          }
     };

     /**Custom Tool Tip*/
     $scope.onCustomTextBoxForToolTip = function(prop) {
         $scope.customprop = prop;
         $scope.selectedFieldDisplayArray = [];
         $scope.customprop.text = "";
         $scope.dataSetFields = [];
         $scope.dataSetFieldsName = [];
         var compObject = ($scope.component.subElement == "Funnel") ? $scope.component.Funnel : $scope.component.Chart;
         if ((compObject.DataSet) && (compObject.DataSet.Fields.length !== 0)) {
             /**Added for getting selected field from Data set*/
             for (var i = 0; compObject.DataSet.Fields.length > i; i++) {
                 ($scope.selectedFieldDisplayArray).push("<p>" + compObject.DataSet.Fields[i].DisplayName + " : " + "[" + compObject.DataSet.Fields[i].Name + "]</p>");
             }
             $scope.customprop.text = $scope.selectedFieldDisplayArray.join("\n");
             var dataObj = $scope.fieldForSelection($scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL, compObject.DataSet.dataSource);
             $scope.dataSetFields = dataObj.DataArraySelect;
             $scope.dataSetFieldsName = dataObj.DataArray;
         }
         $scope.version = textAngularManager.getVersion();
         $scope.versionNumber = $scope.version.substring(1);
		/** Set testAngular input display */
         if (((compObject.CustomTextBoxForToolTip) ? ((compObject.CustomTextBoxForToolTip.datatipData) ? false : true) : true)) {
             $scope.orightml = $scope.customprop.text;
             $scope.htmlcontent = $scope.customprop.text;
             $scope.disabled = false;
         } else {
             $scope.htmlcontent = compObject.CustomTextBoxForToolTip.datatipData;
         }
         /**Set Data Tip type and default value*/
         if (!($scope.customprop.value.dataTipTypeArray)) {
             $scope.dataTipTypeForDisplay = {
                 "dataTipTypeArray": "",
                 "dataTipType": "",
                 "datatipData": "",
                 "formatter": {},
                 "useComponentFormatter": true,
                 "displayWindow": "textBox"
             };
             if ((compObject.showTooltip == undefined) || IsBoolean(compObject.showTooltip)) {
                 $scope.dataTipTypeForDisplay.dataTipType = "Default";
             } else {
                 $scope.dataTipTypeForDisplay.dataTipType = "None";
             }
             $scope.dataTipTypeForDisplay.dataTipTypeArray = (prop.showcustom == "true") ? ["None", "Default", "Custom"] : ["None", "Default"];
             if (compObject.Type === "MitoPlot") {
                 $scope.dataTipTypeForDisplay.dataTipTypeArray = ["None", "Custom"];
                 $scope.dataTipTypeForDisplay.dataTipType = "None";
             }
             if (compObject.Type === "Decomposition" || compObject.Type === "KnowledgeGraph" || compObject.Type === "Sankey" ) {
                 $scope.dataTipTypeForDisplay.dataTipTypeArray = ["None", "Default"];
                 $scope.dataTipTypeForDisplay.dataTipType = "Default";
             }
             $scope.dataTipTypeForDisplay.datatipData = $scope.htmlcontent;
             $scope.setFormatterTooltip();
         } else {
             $scope.dataTipTypeForDisplay = {};
             $scope.setFormatterTooltip();
             $scope.dataTipTypeForDisplay["dataTipType"] = $scope.customprop.value.dataTipType;
             $scope.dataTipTypeForDisplay["dataTipTypeArray"] = $scope.customprop.value.dataTipTypeArray;
             $scope.dataTipTypeForDisplay["datatipData"] = $scope.customprop.value.datatipData;
             $scope.dataTipTypeForDisplay["useComponentFormatter"] = $scope.customprop.value.useComponentFormatter;
             $scope.dataTipTypeForDisplay["displayWindow"] = $scope.customprop.value.displayWindow;
         }
         $scope.dataTipTypeForDisplay["showToolTipFormatter"] = $scope.getShowToolTipFormatter($scope.component[$scope.component.subElement].Type);
         $scope.showModelPopup("customTextBoxForToolTip");
     };
     $scope.getShowToolTipFormatter = function(compName) {
         switch (compName) {
             case "Area":
                 return true;
                 break;
             case "Line":
                 return true;
                 break;
             case "Timeline":
                 return true;
                 break;
             case "Column":
                 return true;
                 break;
             case "Bar":
                 return true;
                 break;
             case "Mixed":
                 return true;
                 break;
             case "GroupBar":
                 return true;
                 break;
             case "HeatMap":
                 return true;
                 break;
             case "Bubble":
                 return true;
                 break;
             case "TreeMap":
            	 return true;
            	 break;
             case "Plot":
            	 return true;
            	 break;
             case "WorldMap":
            	 return true;
            	 break;
             default:
                 return false;
         }
     };
     $scope.setFormatterTooltip = function() {
    	 if ($scope.dataTipTypeForDisplay.formatter === undefined) {
    		 $scope.dataTipTypeForDisplay["formatter"] = {};
    	 }
         if (($scope.dataSetFieldsName.length > 0)&&($scope.modal.propertyJson.Formatter!==undefined)) {
             for (var l = 0; $scope.dataSetFieldsName.length > l; l++) {
            	 var newSetFormatter = ($scope.customprop.value.formatter === undefined ) ? true : (($scope.customprop.value.formatter[$scope.dataSetFieldsName[l]] === undefined) ? true : false);
            	 if(newSetFormatter){
            		 for (var m = 0; $scope.modal.propertyJson.Formatter.length > m; m++) {
                         if ($scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]] === undefined) {
                             $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]] = {};
                         }
                         if ($scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]][$scope.modal.propertyJson.Formatter[m].attributeName] === undefined) {
                             $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]][$scope.modal.propertyJson.Formatter[m].attributeName] = {
                                 "options": $scope.modal.propertyJson.Formatter[m].options,
                                 "value": $scope.modal.propertyJson.Formatter[m].value.key
                             };
                         } else {
                             break;
                         }
                     }
            	 }else{
            		 if ($scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]] === undefined) {
                         $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]] = {};
                     }
            		 $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]] = $scope.customprop.value.formatter[$scope.dataSetFieldsName[l]];
            		 /** When reopen the tooltip box, add the options for all formatter properties **/
            		 for (var m1 = 0; $scope.modal.propertyJson.Formatter.length > m1; m1++) {
            			 $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]][$scope.modal.propertyJson.Formatter[m1].attributeName].options = $scope.modal.propertyJson.Formatter[m1].options;
            		 }
            	 }
             }
         }
         /**DAS-528 formatter for WorldMap From component class dataset series properties */
         if (($scope.dataSetFieldsName.length > 0)&&($scope.component.componentType == "world_map")) {
             for (var l = 0; $scope.dataSetFieldsName.length > l; l++) {
				 var newSetFormatter = ($scope.customprop.value.formatter === undefined ) ? true : (($scope.customprop.value.formatter[$scope.dataSetFieldsName[l]] === undefined) ? true : false);
				 if(newSetFormatter){
					 
					 var filedsetproperties = $scope.datasetDesignProperties[$scope.component.designData.class].FieldProperties;
            		 
            		 for (var m1 = 0; $scope.datasetDesignProperties[$scope.component.designData.class].FieldProperties.length > m1; m1++) {
						
						if ($scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]] === undefined) {
                             $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]] = {};
                         }						 
						  /**filed properties formatter variable names are different than tooltip fromatter  */
						 if(filedsetproperties[m1].attributeName == "unitname"){
							 $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]]["Unit"] = {
								 "options" : filedsetproperties[m1].options,
							 	 "value" : filedsetproperties[m1].value
							 };
						 }
						 if(filedsetproperties[m1].attributeName == "secondunitname"){
							 $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]]["SecondaryUnit"] = {
								 "options" : filedsetproperties[m1].options,
							 	 "value" : filedsetproperties[m1].value
							 };
						 }
						 if(filedsetproperties[m1].attributeName == "numberFormatter"){
							 $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]]["NumberFormatter"] = {
								 "options" : filedsetproperties[m1].options,
							 	 "value" : filedsetproperties[m1].value
							 };
						 }
						 if(filedsetproperties[m1].attributeName == "Precision"){
							 $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]]["Precision"] = {
								 "options" : filedsetproperties[m1].options,
							 	 "value" : filedsetproperties[m1].value
							 };
						 }
						 if(filedsetproperties[m1].attributeName == "signposition"){
							 $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]]["SignPosition"] = {
								 "options" : filedsetproperties[m1].options,
							 	 "value" : filedsetproperties[m1].value
							 };
						 }
						 
						 }
					 
				 }else{
					 if ($scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]] === undefined) {
                         $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]] = {};
                     }
                     $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]] = $scope.customprop.value.formatter[$scope.dataSetFieldsName[l]];
					 /** When reopen the tooltip box, add the options for all formatter properties **/
					 var filedsetproperties = $scope.datasetDesignProperties[$scope.component.designData.class].FieldProperties;
            		 for (var m1 = 0; $scope.datasetDesignProperties[$scope.component.designData.class].FieldProperties.length > m1; m1++) {
						 /**filed properties formatter variable names are different than tooltip fromatter  */
						 if(filedsetproperties[m1].attributeName == "unitname"){
							 $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]]["Unit"].options = filedsetproperties[m1].options;
							 $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]]["Unit"].value = filedsetproperties[m1].value;
						 }
						 if(filedsetproperties[m1].attributeName == "secondunitname"){
							 $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]]["SecondaryUnit"].options = filedsetproperties[m1].options;
						 }
						 if(filedsetproperties[m1].attributeName == "numberFormatter"){
							 if($scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]]["NumberFormatter"] === undefined){
								 $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]]["NumberFormatter"] = {
								 "options" : filedsetproperties[m1].options,
							 	 "value" : filedsetproperties[m1].value
							 };
							 }else{
								 $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]]["NumberFormatter"].options = filedsetproperties[m1].options;
							 }
							 
						 }
						 if(filedsetproperties[m1].attributeName == "Precision"){
							 $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]]["Precision"].options = filedsetproperties[m1].options;
						 }
						 if(filedsetproperties[m1].attributeName == "signposition"){
							 $scope.dataTipTypeForDisplay.formatter[$scope.dataSetFieldsName[l]]["SignPosition"].options = filedsetproperties[m1].options;
						 }
						 
						 }
				 }
				 
				 }
			}
     };
     /**Added for getting complete Data Set for select Box*/
     $scope.fieldForSelection = function (dataSet, id) {
     	var DataArraySelect = [];
     	var dataNameArray = [];
     	var dataObj = {
     		"DataArraySelect": [],
     		"DataArray": []
     	};
     	for (var i = 0, dataSetLength = dataSet.length; i < dataSetLength; i++) {
     		if (dataSet[i].id == id) {
     			var DataArray = dataSet[i].FieldSet;
     			for (var k = 0, m = DataArray.length; m > k; k++) {
     				(DataArraySelect).push(DataArray[k].name + " : " + "[" + DataArray[k].name + "]");
     				dataNameArray.push(DataArray[k].name);
     			}

     			var calculatedFieldArr = dataSet[i].calculatedFieldList;
     			/**Added for support calculatedFields in custom tooltip*/
     			for (var k1 = 0, m1 = calculatedFieldArr.length; m1 > k1; k1++) {
     				(DataArraySelect).push(calculatedFieldArr[k1].name + " : " + "[" + calculatedFieldArr[k1].name + "]");
     				dataNameArray.push(calculatedFieldArr[k1].name);
     			}
				
     			dataObj["DataArraySelect"] = DataArraySelect;
     			dataObj["DataArray"] = dataNameArray;
				break;
     		}
     	}
     	return dataObj;
     };
        /**Update text field for custom Tool Box*/
        $scope.updateTextField = function(selectedItem) {
            var textArray = [];
            var text = "";
            textArray = selectedItem.split(/\[+(.*?)\]+/g);
            text = "<p>" + textArray[0] + "[" + textArray[1] + "]</p>";
            $scope.dataTipTypeForDisplay.datatipData = $scope.dataTipTypeForDisplay.datatipData + text;
        };
        /**Update custom tool tip content, call after svae*/
        $scope.updateCustomTextBoxForToolTip = function(data) {
        	if(data){
        		for(var key in data.formatter){
        			if(data.formatter.hasOwnProperty(key)){
        				for(var key1 in data.formatter[key]){
                			if(data.formatter[key].hasOwnProperty(key1)){
                        		delete data.formatter[key][key1].options;
                			}
        				}
        			}
        		}
        	}
            $scope.customprop.value = data;
            $scope.onPropertyChange($scope.customprop);
        };
        /**
         * Click handler for custom text box
         * @param  {Object} prop The prorty object
         * @return {undefine}      undefine
         */
        $scope.onCustomTextBoxClick = function(prop) {
            $scope.customprop = prop;
            $scope.customprop.text = prop.value;
            $scope.showModelPopup("customTextBoxWindow");
        };

        /**
         * Click handler for buttons parameters
         * @param  {Object} prop The property object
         * @return {undefine}      undefine
         */
        $scope.onCustomURLButtonParameterClick = function(prop) {
            $scope.customprop = prop;
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            $scope.customprop.value = [];
            if (componentJSON.URLButton.Params.Param && componentJSON.URLButton.Params.Param.length != 0) {
                var param = componentJSON.URLButton.Params.Param;
                for (var i = 0; i < param.length; i++) {
                    var paramJson = {};
                    paramJson.name = param[i].name;
                    paramJson.value = param[i].value;
                    $scope.customprop.value.push(paramJson);
                }
            }
            $scope.showModelPopup("customURLButtonParametersWindow");
        };

        /**
         * Adds Url buttons parameter
         */
        $scope.addURLButtonParam = function() {
            var param = {
                "name": "Name",
                "value": ""
            };
            $scope.customprop.value.push(param);
        };

        /**
         * Removes URL buttons parameters
         * @param  {String} param The parameter to remove
         * @return {undefine}       undefine
         */
        $scope.removeURLButtonParameter = function(param) {
            var index = $scope.customprop.value.indexOf(param);
            $scope.customprop.value.splice(index, 1);
        };

        /**
         * Removes all parameters from URL button
         * @return {[type]} [description]
         */
        $scope.removeAllURLButtonParameter = function() {
            $scope.customprop.value = [];
        };

        /**
         * Updates selected component with URL parameter
         * @return {undefined} undefined
         */
        $scope.updateComponentJsonWithURLParameter = function() {
            var prop = $scope.customprop;
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            DesignerUtil.prototype.getInnerObjectbyString(componentJSON, prop["propertyName"])[prop["attributeName"]] = prop["value"];
            /* Synchronize Updates selected component with URL parameter property from desktop to mobile and tablet view */
            if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
            	$scope.syncUpdateComponentJsonWithURLParameterInMobileView(componentJSON, prop);
            }
        };
        
        /**
         * Synchronize Updates selected component with URL parameter property to mobile and tablet view from desktop view
         */
        $scope.syncUpdateComponentJsonWithURLParameterInMobileView = function(compObj, prop) {
        	 var mobileLayoutObj = $scope.getComponentFromMobileLayout(compObj.objectID);
             if (mobileLayoutObj) {
                 DesignerUtil.prototype.getInnerObjectbyString(mobileLayoutObj, prop["propertyName"])[prop["attributeName"]] = prop["value"];
             }
             var tabletLayoutObj = $scope.getComponentFromTabletLayout(compObj.objectID);
             if (tabletLayoutObj) {
                 DesignerUtil.prototype.getInnerObjectbyString(tabletLayoutObj, prop["propertyName"])[prop["attributeName"]] = prop["value"];
             }
        };
        
        $scope.goToCDNLibraryPage = function() {
        	window.open("//cdnjs.com/libraries/", "_blank");
        };

        /**
         * Loads the ckEditor page in new tab of browser for ease of BI developer to format the HTML content
         * @return {undefined} undefined
         */
        $scope.goToHTMLEditor = function() {
            window.open("./resources/help/HTMLEditor.html", "_blank");
        };
        /**
         * Loads the icon browser to pick a icon for shape 
         * @return {undefined} undefined
         */
        $scope.goToBizvizFontIconBrowser = function() {
            window.open("../charting/src/bizviz.charting/components/resources/font-icons.html", "_blank");
        };
        /**
         * Click handler for BubbleColorBand
         * @param  {Object} prop The property object
         * @return {undefined}      undefined
         */
        $scope.onCustomBubbleColorBandClick = function(prop) {
            if (!$scope.modal.selectedComponentId)
                return false;
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            $scope.custompropBubbleBand = prop;
            $scope.custompropBubbleBand.value = [];
            if (componentJSON.Chart.BandDisplayNames != "") {
                var names = componentJSON.Chart.BandDisplayNames.split(",");
                var ranges = componentJSON.Chart.ColorBandRanges.split(",");
                var colors = componentJSON.Chart.BandColors.split(",");
                var alphas = componentJSON.Chart.BandAlphas.split(",");
                for (var i = 0; i < names.length; i++) {
                    var bandColorJson = {};
                    bandColorJson.name = names[i];
                    bandColorJson.range = ranges[i];
                    bandColorJson.color = colors[i];
                    bandColorJson.alpha = alphas[i] * 1;
                    $scope.custompropBubbleBand.value.push(bandColorJson);
                }
            }
            $scope.showModelPopup("customBubbleColorBandWindow");
        };

        /**
         * Add the range for color bands
         */
        $scope.addColorBandRange = function() {
            var bandColorJson = {};
            bandColorJson.name = "Band";
            bandColorJson.range = 0;
            bandColorJson.color = "#08AEA8";
            bandColorJson.alpha = 0.5;
            $scope.custompropBubbleBand.value.push(bandColorJson);
        };

        /**
         * Updates the color band ranges
         */
        $scope.UpdateBandColorRange = function() {
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            var names = "";
            var ranges = "";
            var colors = "";
            var alphas = "";
            var bands = $scope.custompropBubbleBand.value;
            for (var i = 0; i < bands.length; i++) {
                var suffix = (i < bands.length - 1) ? "," : "";
                names += bands[i].name + suffix;
                ranges += bands[i].range + suffix;
                colors += bands[i].color + suffix;
                alphas += bands[i].alpha + suffix;
            }
            componentJSON.Chart.BandDisplayNames = names;
            componentJSON.Chart.ColorBandRanges = ranges;
            componentJSON.Chart.BandColors = colors;
            componentJSON.Chart.BandAlphas = alphas;
            $scope.redrawComponent(componentJSON);
            /* Synchronize Updates the color band ranges property from desktop to mobile and tablet view*/
            if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
            	$scope.syncUpdateBandColorRangeInMobileView(componentJSON, names, ranges, colors, alphas);
            }
        };
        
        /**
         * Synchronize the Updates the color band ranges property to mobile and tablet view from desktop view
         */
        $scope.syncUpdateBandColorRangeInMobileView = function(compObj, names, ranges, colors, alphas) {
        	 var mobileLayoutObj = $scope.getComponentFromMobileLayout(compObj.objectID);
             if (mobileLayoutObj) {
            	 mobileLayoutObj.Chart.BandDisplayNames = names;
            	 mobileLayoutObj.Chart.ColorBandRanges = ranges;
            	 mobileLayoutObj.Chart.BandColors = colors;
            	 mobileLayoutObj.Chart.BandAlphas = alphas;
             }
             var tabletLayoutObj = $scope.getComponentFromTabletLayout(compObj.objectID);
             if (tabletLayoutObj) {
            	 tabletLayoutObj.Chart.BandDisplayNames = names;
            	 tabletLayoutObj.Chart.ColorBandRanges = ranges;
            	 tabletLayoutObj.Chart.BandColors = colors;
            	 tabletLayoutObj.Chart.BandAlphas = alphas;
             }
        };
        
        /**
         * Removes specified color from color band ranges
         * @param  {String} band The color
         * @return {undefined}      undefined
         */
        $scope.removeBandColorRange = function(band) {
            var index = $scope.custompropBubbleBand.value.indexOf(band);
            $scope.custompropBubbleBand.value.splice(index, 1);
        };

        /**
         * Removes all colors from color band ranges
         * @return {undefined} undefined
         */
        $scope.removeAllBandColorRange = function() {
            $scope.custompropBubbleBand.value = [];
        };
        
        /**
         * Click handler for Associate Groups in tabs
         * @param  {Object} prop The property object
         * @return {undefined}      undefined
         */
         $scope.onAssociateGroupsClick = function(prop) {
            $scope.custompropAssociateGroups = prop;
            $scope.AssignedTab = "";
            $scope.custompropAssociateGroups.value = [];
            var tabComponentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            var tabObjectArr = tabComponentJSON[tabComponentJSON.subElement].tabObjectArr||[];
            if (tabObjectArr != "") {
                for (var i = 0; i < tabObjectArr.length; i++) {
                    var tabComponentJSON = {};
                    tabComponentJSON.name = tabObjectArr[i].tabName;
                    tabComponentJSON.id = tabObjectArr[i].tabId;
                    $scope.custompropAssociateGroups.value.push(tabComponentJSON);
                }
            }
            $scope.custompropAssociateGroups.groups = [];
            $scope.showModelPopup("customAssociateGroupsWindow");
        };
        /**
         * Change handler for Manage Tab button
         * @param  {Object} component The component object
         * @return {undefined}           undefined
         */
        $scope.onChangeAssociateDefaultTab = function(tab) {
			var tabJson=tab;
		}
        
        /**
         * Change handler for tabs
         * @param  {Object} tab The component object
         * @return {undefined}           undefined
         */
       
        $scope.onAddTabs = function(tab) {
            var tabComponentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            $scope.assignedGroups = tabComponentJSON[tabComponentJSON.subElement].associateGroups||[];
            $scope.AssignedTab = tab;
            var dGroups = $scope.modal.selectedDashboard.json.Dashboard.componentGroups || [];
            var index = $scope.assignedGroups.map(function(e) { return e.key; }).indexOf(tab.id);
            $scope.custompropAssociateGroups.groups = [];
            for (var i = 0; i < dGroups.length; i++) {
                if (dGroups[i].aCompIds.length) {
					var checked=(index!=-1 && $scope.assignedGroups[index].value.indexOf(dGroups[i].gName)!=-1)?true:false;
                    $scope.custompropAssociateGroups.groups.push({
                        "key": dGroups[i].$$hashKey,
                        "selected":checked,
                        "value": dGroups[i].gName
                    });
                }
            }
        };
        
        /**
         * Change handler for groups
         * @param  {Object} grp The component object
         * @return {undefined}           undefined
         */
       
        $scope.onAddRemoveGroups1 = function(grp) {
        	if (!grp.groups) {
        	    $scope.assignedGroupIds.push(grp);
        	} else {
        	    var idToRemove = grp.$$hashKey;
        	    var index = $scope.assignedGroupIds.findIndex(function(item) {
        	        return item == idToRemove;
        	    }); //.indexOf(idToRemove);
        	    $scope.assignedGroupIds.splice(index, 1);
        	}
        };
        
        /** CP-1134/DAS-4
         * Updates associated filter
         */
        $scope.UpdateAssociateGroup = function(grp) {
        	var tabComponentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
        	var groups = [];
        	var index = $scope.assignedGroups.map(function(e) { return e.key; }).indexOf($scope.AssignedTab.id);
			if(index ==-1){
				if(grp.selected == false)
				{
					groups.push(grp.value);
				}
				$scope.assignedGroups.push({
	                "key": $scope.AssignedTab.id,
	                "value": groups
	            });
            }else{
				groups = $scope.assignedGroups[index].value;
				if(grp.selected == false)
				{
					groups.push(grp.value);
				} else {
					i = groups.indexOf(grp.value);
					groups.splice(i, 1);
				}
				$scope.assignedGroups[index].value = groups;
			}
        };
        
        $scope.SaveAssociateGroup = function(){
			var tabComponentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            tabComponentJSON[tabComponentJSON.subElement].associateGroups = $scope.assignedGroups;
		}
        
        $scope.onAddRemovetabs = function(component) {
        	//console.log($scope.assignedFilterIds);
        	if (!IsBoolean(component.selected)) {
        		$scope.assignTabId = component.id;
        	}
        	//console.log($scope.assignedFilterIds);
        	// var filterComponentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
        };

        /**
         * Click handler for custom Tabs
         * @param  {Object} prop The property object
         * @return {undefined}      undefined
         */
        $scope.onCustomTabClick = function(prop) {
            $scope.custompropTab = prop;
            $scope.custompropTab.value = [];
            var tabComponentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            $scope.assignTabId = tabComponentJSON.TabComponent.assignTabId;
            
            var tabObjectArr = tabComponentJSON.TabComponent.tabObjectArr;
            if (tabObjectArr != "") {
                for (var i = 0; i < tabObjectArr.length; i++) {
                    var tabComponentJSON = {};
                    tabComponentJSON.name = tabObjectArr[i].tabName;
                    tabComponentJSON.selected = (tabObjectArr[i].tabId === $scope.assignTabId)?'true' : 'false';
                    tabComponentJSON.id = tabObjectArr[i].tabId;
                    tabComponentJSON.icon = tabObjectArr[i].tabIcon;
                    $scope.custompropTab.value.push(tabComponentJSON);
                }
            }
            $scope.showModelPopup("customManageTabsWindow");
        };

        /**
         * Adds legend
         */
        $scope.addTab = function() {
            var tabComponentJSON = {};
            $scope.count=($scope.count==undefined) ? 0 : $scope.count;
            var tabObjectArr = $scope.getComponentbyId($scope.modal.selectedComponentId).TabComponent.tabObjectArr;
            tabComponentJSON.name = "Tab";
            tabComponentJSON.selected = "false";
            tabComponentJSON.id = "Tab" + $scope.getComponentbyId($scope.modal.selectedComponentId).objectID + (tabObjectArr.length+$scope.count);
            tabComponentJSON.icon = "bd-diamond";
            $scope.count++;
            $scope.custompropTab.value.push(tabComponentJSON);
        };

        /**
         * Updates tabs
         * @return {undefined} undefined
         */
        $scope.updateTabs = function(tab) {
			$scope.count = 0;
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            var tabs = $scope.custompropTab.value;
            componentJSON.TabComponent.tabObjectArr = [];
            for (var i = 0; i < tabs.length; i++) {
				var tab={
						"tabId":"Tab"+$scope.modal.selectedComponentId+i,
						"tabName": tabs[i].name,
						"tabDisplayName": tabs[i].name,
						"tabIcon": tabs[i].icon
				};
				componentJSON.TabComponent.tabObjectArr.push(tab);
            }
            componentJSON.TabComponent.assignTabId = $scope.assignTabId;
            //componentJSON.TabComponent.tabNames = names;
//            componentJSON.TabComponent.tabColors = colors;
			componentJSON.TabComponent.redraw=true;
            $scope.redrawComponent(componentJSON);
            /* Synchronize Updates legend property from desktop to mobile and tablet view*/
            /*if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
            	$scope.syncUpdateLegendsInMobileView(componentJSON, names);
            }*/
        };
        
        /**
         * Synchronize the Updates legend property to mobile and tablet view from desktop view
         */
        /*$scope.syncUpdateTabsInMobileView = function(compObj, names, colors, groups) {
        	 var mobileLayoutObj = $scope.getComponentFromMobileLayout(compObj.objectID);
             if (mobileLayoutObj) {
            	 mobileLayoutObj.Tab.tabNames = names;
//            	 mobileLayoutObj.Tab.tabColors = colors;
             }
             var tabletLayoutObj = $scope.getComponentFromTabletLayout(compObj.objectID);
             if (tabletLayoutObj) {
            	 tabletLayoutObj.Tab.tabNames = names;
//            	 tabletLayoutObj.Tab.tabColors = colors;
             }
        };*/
        
        /**
         * Removes tab
         * @param  {Object} prop The property object
         * @return {undefined}      undefined
         */
        $scope.removeTab = function(prop) {
            var index = $scope.custompropTab.value.indexOf(prop);
            $scope.custompropTab.value.splice(index, 1);
        };

        /**
         * Removes all legends
         * @return {undefined} undefined
         */
        $scope.removeAllTabs = function() {
            $scope.custompropTab.value = [];
        };

        /**
         * Click handler for custom legend
         * @param  {Object} prop The property object
         * @return {undefined}      undefined
         */
        $scope.onCustomLegendClick = function(prop) {
            $scope.custompropLegend = prop;
            $scope.custompropLegend.value = [];
            $scope.custompropLegend.shapes = ["cube", "cross", "point", "polygon", "quad", "star", "triangle"];
            var legendComponentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            if (legendComponentJSON.Legend.legendShapes != "") {
                var legendNames = legendComponentJSON.Legend.legendNames.split(",");
                var legendColors = legendComponentJSON.Legend.legendColors.split(",");
                var legendShapes = legendComponentJSON.Legend.legendShapes.split(",");
                for (var i = 0; i < legendNames.length; i++) {
                    var legendNamesJson = {};
                    legendNamesJson.name = legendNames[i];
                    legendNamesJson.color = legendColors[i];
                    legendNamesJson.shape = legendShapes[i];
                    $scope.custompropLegend.value.push(legendNamesJson);
                }
            }
            $scope.showModelPopup("customLegendsWindow");
        };

        /**
         * Adds legend
         */
        $scope.addLegend = function() {
            var legendNamesJson = {};
            legendNamesJson.name = "Series";
            legendNamesJson.color = "#08AEA8";
            legendNamesJson.shape = "cube";
            $scope.custompropLegend.value.push(legendNamesJson);
        };

        /**
         * Updates legend
         * @return {undefined} undefined
         */
        $scope.updateLegends = function() {
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            var names = "";
            var colors = "";
            var shapes = "";
            var legends = $scope.custompropLegend.value;
            for (var i = 0; i < legends.length; i++) {
                var suffix = (i < legends.length - 1) ? "," : "";
                names += legends[i].name + suffix;
                colors += legends[i].color + suffix;
                shapes += legends[i].shape + suffix;
            }
            componentJSON.Legend.legendNames = names;
            componentJSON.Legend.legendColors = colors;
            componentJSON.Legend.legendShapes = shapes;
            $scope.redrawComponent(componentJSON);
            /* Synchronize Updates legend property from desktop to mobile and tablet view*/
            if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
            	$scope.syncUpdateLegendsInMobileView(componentJSON, names, colors, shapes);
            }
        };
        
        /**
         * Synchronize the Updates legend property to mobile and tablet view from desktop view
         */
        $scope.syncUpdateLegendsInMobileView = function(compObj, names, colors, shapes) {
        	 var mobileLayoutObj = $scope.getComponentFromMobileLayout(compObj.objectID);
             if (mobileLayoutObj) {
            	 mobileLayoutObj.Legend.legendNames = names;
            	 mobileLayoutObj.Legend.legendColors = colors;
            	 mobileLayoutObj.Legend.legendShapes = shapes;
             }
             var tabletLayoutObj = $scope.getComponentFromTabletLayout(compObj.objectID);
             if (tabletLayoutObj) {
            	 tabletLayoutObj.Legend.legendNames = names;
            	 tabletLayoutObj.Legend.legendColors = colors;
            	 tabletLayoutObj.Legend.legendShapes = shapes;
             }
        };
        
        /**
         * Removes legend
         * @param  {Object} prop The property object
         * @return {undefined}      undefined
         */
        $scope.removeLegend = function(prop) {
            var index = $scope.custompropLegend.value.indexOf(prop);
            $scope.custompropLegend.value.splice(index, 1);
        };

        /**
         * Removes all legends
         * @return {undefined} undefined
         */
        $scope.removeAllLegends = function() {
            $scope.custompropLegend.value = [];
        };
        
               /**
         * Click handler for custom checkbox
         * @param  {Object} prop The property object
         * @return {undefined}      undefined
         */
        $scope.onCustomCheckboxClick = function(prop) {
            $scope.custompropCheckbox = prop;
            $scope.custompropCheckbox.value = [];
            $scope.custompropCheckbox.shapes = ["checked","unchecked"];
            var checkboxComponentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            if (checkboxComponentJSON.Filter.checkboxShapes != "") {
                var checkboxNames = checkboxComponentJSON.Filter.checkboxNames.split(",");
                var checkboxColors = checkboxComponentJSON.Filter.checkboxColors.split(",");
                var checkboxValue = checkboxComponentJSON.Filter.checkboxValue.split(",");
                var checkboxShapes = checkboxComponentJSON.Filter.checkboxShapes.split(",");
                for (var i = 0; i < checkboxNames.length; i++) {
                    var checkboxNamesJson = {};
                    checkboxNamesJson.name = checkboxNames[i];
                    checkboxNamesJson.color = checkboxColors[i];
                    checkboxNamesJson.value = checkboxValue[i];
                    checkboxNamesJson.shape = checkboxShapes[i];
                    $scope.custompropCheckbox.value.push(checkboxNamesJson);
                }
            }
            $scope.showModelPopup("customCheckboxesWindow");
        };

        /**
         * Adds Checkbox
         */
        $scope.addCheckbox = function() {
            var checkboxNamesJson = {};
            checkboxNamesJson.name = "Label";
            checkboxNamesJson.color = "#08AEA8";
            checkboxNamesJson.value = "1";
            checkboxNamesJson.shape = "unchecked";
            $scope.custompropCheckbox.value.push(checkboxNamesJson);
        };
        /**
         * Remove Checkbox
         */
        $scope.removeCheckbox = function(prop) {
            var index = $scope.custompropCheckbox.value.indexOf(prop);
            $scope.custompropCheckbox.value.splice(index, 1);
        };

        /**
         * Updates Checkbox
         * @return {undefined} undefined
         */
        $scope.updateCheckboxes = function() {
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            var names = "";
            var colors = "";
            var values = "";
            var shapes = "";
            var checkboxes = $scope.custompropCheckbox.value;
            for (var i = 0; i < checkboxes.length; i++) {
                var suffix = (i < checkboxes.length - 1) ? "," : "";
                names += checkboxes[i].name + suffix;
                colors += checkboxes[i].color + suffix;
                values += checkboxes[i].value + suffix;
                shapes += checkboxes[i].shape + suffix;
            }
            componentJSON.Filter.checkboxNames = names;
            componentJSON.Filter.checkboxColors = colors;
            componentJSON.Filter.checkboxValue = values;
            componentJSON.Filter.checkboxShapes = shapes;
            $scope.redrawComponent(componentJSON);
            /* Synchronize Updates legend property from desktop to mobile and tablet view*/
            if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
            	$scope.syncUpdateFiltersInMobileView(componentJSON, names, colors,values, shapes);
            }
        };
          /**
         * Synchronize the Updates checkbox filter property to mobile and tablet view from desktop view
         */
        $scope.syncUpdateFiltersInMobileView = function(compObj, names, colors, shapes) {
        	 var mobileLayoutObj = $scope.getComponentFromMobileLayout(compObj.objectID);
             if (mobileLayoutObj) {
            	 mobileLayoutObj.Filter.checkboxNames = names;
            	 mobileLayoutObj.Filter.checkboxColors = colors;
            	 mobileLayoutObj.Filter.checkboxValue = values;
            	 mobileLayoutObj.Filter.checkboxShapes = shapes;
             }
             var tabletLayoutObj = $scope.getComponentFromTabletLayout(compObj.objectID);
             if (tabletLayoutObj) {
            	 tabletLayoutObj.Filter.checkboxNames = names;
            	 tabletLayoutObj.Filter.checkboxColors = colors;
            	 tabletLayoutObj.Filter.checkboxValue = values;
            	 tabletLayoutObj.Filter.checkboxShapes = shapes;
             }
        };
        
        /**
         * Click handler for custom filters
         * @param  {Object} prop The property object
         * @return {undefined}      undefined
         */
        $scope.onCustomAssignFilterClick = function(prop) {
            $scope.custompropAssignChart = prop;
            $scope.componentListMap = {};
            var componentInfo = [];
            /*
            componentInfo.push({
                "key": "none",
                "value": "None"
            });
            */
            var objects = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object;
            var filterComponentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            $scope.assignedFilterIds = filterComponentJSON[filterComponentJSON.subElement].assignedFilters;
            
            for (var i = 0; i < objects.length; i++) {
            	if (objects[i].objectType == "filter" || objects[i].componentType == "date_picker") {
                	var checked=($scope.assignedFilterIds.indexOf(objects[i].objectID)!=-1)?true:false;
                	componentInfo.push({
                        "key": objects[i].objectID,
                        "selected":checked,
                        "value": objects[i].objectName
                    });
                }
            }
           
            $scope.componentListMap["options"] = componentInfo;
            $scope.showModelPopup("customAssignFilterWindow");
        };
        
        /** CP-1134/DAS-4
         * Updates associated filter
         */
        $scope.UpdateAssociateFilter = function() {
        	
        	var filterComponentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
        	filterComponentJSON[filterComponentJSON.subElement].assignedFilters = $scope.assignedFilterIds;
        	
        };
        
        /**
         * Change handler for filters
         * @param  {Object} component The component object
         * @return {undefined}           undefined
         */
       
        $scope.onAddRemoveFilters = function(component) {
        	//console.log($scope.assignedFilterIds);
        	if (!component.selected) {
        	    $scope.assignedFilterIds.push(component.key);
        	} else {
        	    var idToRemove = component.key;
        	    var index = $scope.assignedFilterIds.findIndex(function(item) {
        	        return item == idToRemove;
        	    }); //.indexOf(idToRemove);
        	    $scope.assignedFilterIds.splice(index, 1);
        	}
        	//console.log($scope.assignedFilterIds);
        	// var filterComponentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
        };
           
        
        /** When associate to DS, it doesn't need Fields information **/
        $scope.onAddRemoveFiltersDS = function(component) {
            $scope.assignedChartId = ((component.key == "none") ? "" : component.key);
        };

           /**
		  * Click handler for datepicker components
		  * @param  {Object} prop The property object
		  * @return {undefined}      undefined
		  */
		 $scope.onCustomAssignDateClick = function(prop) {
		     $scope.custompropAssignChart = prop;
		     $scope.componentListMap = {};
		     var componentInfo = [];
		
		     componentInfo.push({
		         "key": "none",
		         "value": "None"
		     });
		
		     var objects = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object;
		     var dateComponentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
		     $scope.associatedDateIds = dateComponentJSON[dateComponentJSON.subElement].associatecomp;
		     var selectedObjectId = $scope.modal.selectedComponentId;
		     var component = {
		         key: $scope.associatedDateIds
		     };
		     if ($scope.associatedDateIds !== "") {
		         $scope.onChangeAssociateDateDS(component);
		     }
		     if ($scope.associatedDateIds === "") {
		         $scope.associatedDateIdsDataSetFields = [];
		     }
		
		     for (var i = 0; i < objects.length; i++) {
		         if (objects[i].objectType == "date" && objects[i].objectID != selectedObjectId) {
		             componentInfo.push({
		                 "key": objects[i].objectName,
		                 "value": objects[i].objectName
		             });
		         }
		     }
		
		     $scope.componentListMap["options"] = componentInfo;
		     $scope.showModelPopup("customAssignDateWindow");
		 };
		
		 /**
		  * Change handler for datepicker
		  * @param  {Object} component The component object
		  * @return {undefined}           undefined
		  */
		 $scope.onChangeAssociateDate = function(component) {
		
		     $scope.assignedDateIds = ((component.key == "none") ? "" : component.key);
		     $scope.showSelectAll = false;
		     $scope.componentType = true;
		     // var assignedComponent = $scope.getComponentbyId($scope.assignedDateIds);
		     var assignedComponent = $scope.assignedDateIds;
		     if (assignedComponent !== undefined && assignedComponent.subElement === "date") {
		         $scope.assignedComponentDataSet = assignedComponent.date;
		     } else {
		         // Do nothing
		     }
		 };
		
		 $scope.onChangeAssociateDateDS = function(component) {
		     $scope.associatedDateIds = ((component.key == "none") ? "" : component.key);
		 };
		
		 /* Updates associated datepicker
		  */
		 $scope.updateAssociatedDate = function() {
		
		     var dateComponentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
		     dateComponentJSON[dateComponentJSON.subElement].associatecomp = $scope.assignedDateIds;
		
		 };
		 
        /**
         * Click handler for custom charts
         * @param  {Object} prop The property object
         * @return {undefined}      undefined
         */
        $scope.onCustomAssignChartClick = function(prop) {
            $scope.custompropAssignChart = prop;
            $scope.componentListMap = {};
            var componentInfo = [];
            componentInfo.push({
                "key": "none",
                "value": "None"
            });
            var objects = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object;
            var legendComponentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            $scope.AssignedComponent = legendComponentJSON[legendComponentJSON.subElement].associatedChartId;
            $scope.showSelectAll = false;
            var component = {key : $scope.AssignedComponent};
            if($scope.AssignedComponent !== "") {
            	$scope.onChangeAssociateChart(component);
            }
            if($scope.AssignedComponent === "") {
                $scope.assignedChartDataSetFields = [];
            }
            for (var i = 0; i < objects.length; i++) {
                if ((objects[i].objectType == "chart" || objects[i].objectType == "funnel" || objects[i].objectType == "datagrid" || objects[i].objectType == "scorecard") &&
                    objects[i][objects[i]["subElement"]]["Type"] != "SentimentPlot" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "Progress" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "WordCloud" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "TreeMap" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "Chevron" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "BoxPlot" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "Plot" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "Waterfall" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "Histogram" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "SparkLine" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "Sankey" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "NewWordCloud" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "Decomposition" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "KnowledgeGraph" &&
                    ///objects[i][objects[i]["subElement"]]["DataGridType"] != "DynamicDatagrid" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "ProjectTimeline" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "MitoPlot" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "CandleStick" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "DTC" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "Trellis") {
                    componentInfo.push({
                        "key": objects[i].objectID,
                        "value": objects[i].objectName
                    });
                }
            }
            $scope.componentListMap["options"] = componentInfo;
            $scope.showModelPopup("customAssignChartWindow");
        };
        
        /**
         * Click handler for custom charts
         * @param  {Object} prop The property object
         * @return {undefined}      undefined
         */
        $scope.onCustomAssignDSChartClick = function(prop) {
            $scope.custompropAssignChart = prop;
            $scope.componentListMap = {};
            var componentInfo = [];
            componentInfo.push({
                "key": "none",
                "value": "None"
            });
            var objects = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object;
            var dsComponentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            $scope.AssignedComponent = dsComponentJSON[dsComponentJSON.subElement].associatedDSChartId;
            $scope.showSelectAll = false;
            var component = {key : $scope.AssignedComponent};
            if($scope.AssignedComponent !== "") {
            	$scope.onChangeAssociateChart(component);
            }
            if($scope.AssignedComponent === "") {
                $scope.assignedChartDataSetFields = [];
            }
            for (var i = 0; i < objects.length; i++) {
                if ((objects[i].objectType == "chart" || objects[i].objectType == "funnel" || objects[i].objectType == "datagrid" || objects[i].objectType == "scorecard") &&
                    objects[i][objects[i]["subElement"]]["Type"] != "SentimentPlot" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "Progress" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "WordCloud" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "TreeMap" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "Chevron" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "BoxPlot" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "Plot" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "Waterfall" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "Histogram" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "SparkLine" &&
                    //objects[i][objects[i]["subElement"]]["DataGridType"] != "DynamicDatagrid" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "ProjectTimeline" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "MitoPlot" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "CandleStick" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "DTC" &&
                    objects[i][objects[i]["subElement"]]["Type"] != "Trellis") {
                    componentInfo.push({
                        "key": objects[i].objectID,
                        "value": objects[i].objectName
                    });
                }
            }
            $scope.componentListMap["options"] = componentInfo;
            $scope.showModelPopup("customAssignChartWindow");
        };

        /**
         * Change handler for charts
         * @param  {Object} component The component object
         * @return {undefined}           undefined
         */
        $scope.onChangeAssociateChart = function(component) {
            $scope.assignedChartId = ((component.key == "none") ? "" : component.key);
            $scope.showSelectAll = false;
            $scope.componentType = true;
            var assignedComponent = $scope.getComponentbyId($scope.assignedChartId);
            if(assignedComponent !== undefined && assignedComponent.subElement === "Chart"){
               $scope.assignedComponentDataSet = assignedComponent.Chart;
               $scope.componentType = (assignedComponent.Chart.Type !== "Pie") ? true : false;
            } else if (assignedComponent !== undefined && assignedComponent.subElement === "Funnel"){
               $scope.assignedComponentDataSet = assignedComponent.Funnel;
               $scope.componentType = false;
            }  else if (assignedComponent !== undefined && assignedComponent.subElement === "DataGrid") {
               $scope.assignedComponentDataSet = assignedComponent.DataGrid;     
            } else if (assignedComponent !== undefined && assignedComponent.subElement === "Scorecard"){
               $scope.assignedComponentDataSet = assignedComponent.Scorecard;     
            } else {
            	// Do nothing
            }
            if($scope.assignedChartId !== "" && $scope.assignedComponentDataSet.DataSet && assignedComponent !== undefined) {
	            $scope.assignedChartDataSetFields = [];
	            $scope.showSelectAll = ($scope.assignedComponentDataSet.DataSet.Fields.length !== 0) ? true : $scope.showSelectAll;
	            $scope.selected = [];
	            var savedLegendFields = assignedComponent.defaultLegendFields;
	            $scope.assignedChartDataSetFields = $scope.getSelectedComponentDatasetFields($scope.assignedComponentDataSet.DataSet.Fields, savedLegendFields);
	            $scope.selected = $scope.assignedChartDataSetFields.slice(0);
	            $scope.selectedLegendFields = $scope.assignedChartDataSetFields.slice(0);
            } else {
                $scope.assignedChartDataSetFields = [];
            }
        };
        /** When associate to DS, it doesnt need Filds information **/
        $scope.onChangeAssociateChartDS = function(component) {
            $scope.assignedChartId = ((component.key == "none") ? "" : component.key);
        };
        $scope.getSelectedComponentDatasetFields = function(selectedComponentDataset, savedLegendFields) {
        	var dataFields = [];
        	for(var i = 0 ; i < selectedComponentDataset.length ;i++) {
        		if((selectedComponentDataset[i].Type == "Series" || selectedComponentDataset[i].Type == "Values") && selectedComponentDataset[i].visible && selectedComponentDataset[i].hierarchyType !== "parent") {
            		dataFields.push({
        				"key": selectedComponentDataset[i].Name,
        				"value": $scope.getValueForField(selectedComponentDataset[i].Name, savedLegendFields)
                	});
            	}
            }
        	return dataFields;
        };
        $scope.getValueForField = function(fieldName, savedLegendFields, i) {
        	var value = true;
        	if(savedLegendFields && savedLegendFields.length !== 0){
        		for(var j = 0; j < savedLegendFields.length; j++) {
                    if(fieldName == savedLegendFields[j].key) {
                    	value = savedLegendFields[j].value;
                    	break;
                    }
            	}
        	}        	
            return value;
        };
        $scope.isIndeterminate = function() {
            return ($scope.selected.length !== 0 &&
                $scope.selected.length !== $scope.selectedLegendFields.length);
          };
        $scope.isChecked = function() {
        	var predicate = false;
        	for(var i = 0; i < $scope.selectedLegendFields.length; i++) {
                for(var j = 0; j < $scope.selected.length; j++) {
                	if(($scope.selectedLegendFields[i].value == true) && ($scope.selected[j].value == true)) {
                              predicate = true;  
                        } else {
                              predicate = false;
                              break;
                        }
                }
        	}	
        	return predicate;
          };
	      $scope.toggleAll = function(event) {
	    	  	 var flag = $(event.currentTarget).hasClass("md-checked");
		    	 for(var i = 0; i < $scope.selectedLegendFields.length; i++) {
		    	     $scope.selectedLegendFields[i].value = !flag;
		    	 }
		    	 if ($scope.selected.length === 0 || $scope.selected.length > 0) {
	    	    	$scope.selected = $scope.selectedLegendFields.slice(0);
		    	 }
	    	  };  
        $scope.toggle = function(option,list) {
        	var idx = list.indexOf(option);
            if (idx > -1) {            
            	list[idx].value = !(list[idx].value);
            } else {
            	list.push(option);
            }
            $scope.selectedLegendFields = list;
        };
        $scope.exists = function (option, list) {
			   for (var k = 0; k < list.length; k++) {
			       if (list[k].key == option.key) {
			    	   /** Keep this logic as it is, changing is making issue in field-checkbox of legend-association **/
			           if (option.value = list[k].value){
			        	   return true;
			           }else{
			        	   return false;
			           }
			       }
			   }
          };
        /**
         * Updates associated charts
         */
        $scope.UpdateAssociateChart = function() {
            var legendComponentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            if (legendComponentJSON.subElement === "DataSearch") {
            	$scope.UpdateDataSearchAssociateChart();
            } else {
	            legendComponentJSON[legendComponentJSON.subElement].associatedChartId = $scope.assignedChartId;
	            if ($scope.assignedChartId != "") {
	                var associatedChartJSON = $scope.getComponentbyId($scope.assignedChartId);
	                associatedChartJSON[associatedChartJSON.subElement].associatedLegendId = $scope.modal.selectedComponentId;
	                var associatedComponentLegendWithLegendJson = $scope.getComponentbyId($scope.assignedChartId);
		            associatedComponentLegendWithLegendJson.defaultLegendFields =  $scope.selectedLegendFields;
		            
		            /** Synchronize absoluteLayout Associated Component legend property with mobile and tablet view component object **/
	                if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
	                    var mobileLayoutObj = $scope.getComponentFromMobileLayout($scope.assignedChartId);
	                    if (mobileLayoutObj) {
	                        mobileLayoutObj[mobileLayoutObj.subElement].associatedLegendId = $scope.modal.selectedComponentId;
	                        var mobileLayoutAssociatedComponentLegendWithLegendJson = $scope.getComponentFromMobileLayout($scope.assignedChartId);
	                        mobileLayoutAssociatedComponentLegendWithLegendJson.defaultLegendFields = $scope.getSelectedLegendFieldsForMobileLayout(mobileLayoutAssociatedComponentLegendWithLegendJson, $scope.selectedLegendFields);
	                    }
	                    var tabletLayoutObj = $scope.getComponentFromTabletLayout($scope.assignedChartId);
	                    if (tabletLayoutObj) {
	                        tabletLayoutObj[tabletLayoutObj.subElement].associatedLegendId = $scope.modal.selectedComponentId;
	                        var tabletLayoutAssociatedComponentLegendWithLegendJson = $scope.getComponentFromTabletLayout($scope.assignedChartId);
	                        tabletLayoutAssociatedComponentLegendWithLegendJson.defaultLegendFields = $scope.getSelectedLegendFieldsForMobileLayout(tabletLayoutAssociatedComponentLegendWithLegendJson, $scope.selectedLegendFields);
	                    }
	                }
	            }
	            $scope.removeAssociateChart($scope.assignedChartId, $scope.modal.selectedComponentId);
	            $scope.redrawComponent(legendComponentJSON);
            }
        };
        
        /**
         * Updates DataSearch associated charts
         */
        $scope.UpdateDataSearchAssociateChart = function() {
        	 var dsComponentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
        	 dsComponentJSON[dsComponentJSON.subElement].associatedDSChartId = $scope.assignedChartId;
            if ($scope.assignedChartId != "") {
                var associatedChartJSON = $scope.getComponentbyId($scope.assignedChartId);
                associatedChartJSON[associatedChartJSON.subElement].associatedDSId = $scope.modal.selectedComponentId;
               
	            /** Synchronize absoluteLayout Associated Component legend property with mobile and tablet view component object **/
                if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
                    var mobileLayoutObj = $scope.getComponentFromMobileLayout($scope.assignedChartId);
                    if (mobileLayoutObj) {
                        mobileLayoutObj[mobileLayoutObj.subElement].associatedDSId = $scope.modal.selectedComponentId;
                    }
                    var tabletLayoutObj = $scope.getComponentFromTabletLayout($scope.assignedChartId);
                    if (tabletLayoutObj) {
                        tabletLayoutObj[tabletLayoutObj.subElement].associatedDSId = $scope.modal.selectedComponentId;
                    }
                }
            }
            $scope.removeDSAssociateChart($scope.assignedChartId, $scope.modal.selectedComponentId);
            $scope.redrawComponent(dsComponentJSON);
        };
        /**
         * Removes associated charts
         * @param  {String} chartid  The chart id
         * @param  {String} legendid The legend id
         * @return {undefined}          undefined
         */
        $scope.removeAssociateChart = function(chartid, legendid) {
        	var objects = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object;
        	 for (var i = 0; i < objects.length; i++) {
        	     if (objects[i][objects[i].subElement].associatedLegendId == legendid && objects[i].objectID != chartid) {
        	         objects[i][objects[i].subElement].associatedLegendId = "";

        	         /** Synchronize absoluteLayout Associated Component legend property with mobile and tablet view component object **/
        	         if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
        	             var mobileLayoutObj = $scope.getComponentFromMobileLayout(objects[i].objectID);
        	             if (mobileLayoutObj) {
        	                 mobileLayoutObj[mobileLayoutObj.subElement].associatedLegendId = "";
        	             }
        	             var tabletLayoutObj = $scope.getComponentFromTabletLayout(objects[i].objectID);
        	             if (tabletLayoutObj) {
        	                 tabletLayoutObj[tabletLayoutObj.subElement].associatedLegendId = "";
        	             }
        	         }
        	     }
        	 }
        };
        
        /**
         * Removes DataSearch associated charts
         * @param  {String} chartid  The chart id
         * @param  {String} dsid The DataSearch id
         * @return {undefined}          undefined
         */
        $scope.removeDSAssociateChart = function(chartid, dsid) {
        	var objects = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object;
        	 for (var i = 0; i < objects.length; i++) {
        	     if (objects[i][objects[i].subElement].associatedDSId == dsid && objects[i].objectID != chartid) {
        	         objects[i][objects[i].subElement].associatedDSId = "";

        	         /** Synchronize absoluteLayout Associated Component legend property with mobile and tablet view component object **/
        	         if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
        	             var mobileLayoutObj = $scope.getComponentFromMobileLayout(objects[i].objectID);
        	             if (mobileLayoutObj) {
        	                 mobileLayoutObj[mobileLayoutObj.subElement].associatedDSId = "";
        	             }
        	             var tabletLayoutObj = $scope.getComponentFromTabletLayout(objects[i].objectID);
        	             if (tabletLayoutObj) {
        	                 tabletLayoutObj[tabletLayoutObj.subElement].associatedDSId = "";
        	             }
        	         }
        	     }
        	 }
        };
        /**
         * Methods to return selected legend fields of mobile and tablet layout component object
         * @param  {Object} compObj The component object
         * @param  {Array} legendFields  selected Legend Fields of absolute layout component
         * @return {Array} selectedLegendFields   selected fields of component object
         */
        $scope.getSelectedLegendFieldsForMobileLayout = function(compObj,legendFields) {
        	var compFields = compObj[compObj.subElement].DataSet.Fields;
        	var selectedLegendFields = [];
        	for (var i = 0; i < compFields.length; i++) {
        		if (compFields[i].Type == "Series") {
        			for (var j = 0; j < legendFields.length; j++) {
        				if (compFields[i].Name == legendFields[j].key) {
        					selectedLegendFields.push(legendFields[j]);
        				}
        			}
        		}
        	}
        	return selectedLegendFields;
        };
        
                /**
         * Methods to set Threshold colors
         * @param  {Object} prop The property object
         * @return {undefined}      undefined
         */
        $scope.onCustomThresholdFillWindowClick = function(prop) {
			var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
			$scope.custompropThresholdFillColors = prop;
			$scope.custompropThresholdFillColors.componentType = componentJSON.componentType
			$scope.custompropThresholdFillColors.value = [];
			var nprop = DesignerUtil.prototype.getInnerObjectbyString(componentJSON, $scope.custompropThresholdFillColors.propertyName);
			var levels = nprop[$scope.custompropThresholdFillColors.attributes.level].split(",");
			var color = nprop[$scope.custompropThresholdFillColors.attributes.color].split(",");
			var label = nprop[$scope.custompropThresholdFillColors.attributes.label].split(",");
			var opacity = nprop[$scope.custompropThresholdFillColors.attributes.opacity].split(",");
			var labelcolor = nprop[$scope.custompropThresholdFillColors.attributes.labelcolor].split(",");
			var nameLength = levels.length;
			for (var i = 0; i < nameLength; i++) {
				var rangeColorJson = {};
				rangeColorJson.level = levels[i];
				rangeColorJson.color = color[i];
				rangeColorJson.label = label[i];
				rangeColorJson.opacity = opacity[i] * 1;
				rangeColorJson.labelcolor = labelcolor[i];
				$scope.custompropThresholdFillColors.value.push(rangeColorJson);
			}

			$scope.showModelPopup("CustomThresholdFillWindow");
		};

        /**
         * Updates box fill color
         * @returns {undefined} undefined
         */
        $scope.UpdateThresholdBoxFillColors = function() {
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            var levels = "";
            var color = "";
            var label = "";
            var opacity = "";
            var labelcolor = "";
            var indicatorRanges = $scope.custompropThresholdFillColors.value;
            for (var i = 0; i < indicatorRanges.length; i++) {
                var suffix = (i < indicatorRanges.length - 1) ? "," : "";
                levels += indicatorRanges[i].level + suffix;
                color += indicatorRanges[i].color + suffix;
                label += indicatorRanges[i].label + suffix;
                opacity += indicatorRanges[i].opacity + suffix;
                labelcolor += indicatorRanges[i].labelcolor + suffix;
            }
            var prop = DesignerUtil.prototype.getInnerObjectbyString(componentJSON, $scope.custompropThresholdFillColors.propertyName);
            prop[$scope.custompropThresholdFillColors.attributes.level] = levels;
            prop[$scope.custompropThresholdFillColors.attributes.color] = color;
            prop[$scope.custompropThresholdFillColors.attributes.label] = label;
            prop[$scope.custompropThresholdFillColors.attributes.opacity] = opacity;
            prop[$scope.custompropThresholdFillColors.attributes.labelcolor] = labelcolor;
            $scope.redrawComponent(componentJSON);
		};
		
		$scope.removeAllThresholdFillColors = function() {
			$scope.custompropThresholdFillColors.value = [];
		};
        /**
         * Methods to set BoxPlot Chart's box colors
         * @param  {Object} prop The property object
         * @return {undefined}      undefined
         */
        $scope.onCustomBoxFillColorClick = function(prop) {
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            $scope.custompropBoxFillColors = prop;
            $scope.custompropBoxFillColors.componentType = componentJSON.componentType
            $scope.custompropBoxFillColors.value = [];
            if (componentJSON.Chart.boxGroupNames != "") {
                var nprop = DesignerUtil.prototype.getInnerObjectbyString(componentJSON, $scope.custompropBoxFillColors.propertyName);
                var names = nprop[$scope.custompropBoxFillColors.attributes.names].split(",");
                var lowerColors = nprop[$scope.custompropBoxFillColors.attributes.lowerColors].split(",");
                var upperColors = nprop[$scope.custompropBoxFillColors.attributes.upperColors].split(",");
                var opacity = nprop[$scope.custompropBoxFillColors.attributes.opacity].split(",");
                var nameLength = names.length;
                if(componentJSON.componentType == "benchmark_analysis_chart"){
					nameLength = 1;
				}
                for (var i = 0; i < nameLength; i++) {
                    var rangeColorJson = {};
                    rangeColorJson.name = names[i];
                    rangeColorJson.lower = lowerColors[i];
                    rangeColorJson.upper = upperColors[i];
                    rangeColorJson.opacity = opacity[i] * 1;
                    $scope.custompropBoxFillColors.value.push(rangeColorJson);
                }
            }
            $scope.showModelPopup("customBoxFillColorWindow");
        };

        /**
         * Adds box fill color
         * @returns {undefined} undefined
         */
        $scope.addBoxFillColor = function() {
            var rangeColorJson = {};
            rangeColorJson.name = "Group";
            rangeColorJson.lower = "#f89406";
            rangeColorJson.upper = "#6c7a89";
            rangeColorJson.opacity = 0.8;
            $scope.custompropBoxFillColors.value.push(rangeColorJson);
        };

        /**
         * Updates box fill color
         * @returns {undefined} undefined
         */
        $scope.UpdateBoxFillColors = function() {
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            var names = "";
            var lowers = "";
            var uppers = "";
            var opacity = "";
            var indicatorRanges = $scope.custompropBoxFillColors.value;
            for (var i = 0; i < indicatorRanges.length; i++) {
                var suffix = (i < indicatorRanges.length - 1) ? "," : "";
                names += indicatorRanges[i].name + suffix;
                lowers += indicatorRanges[i].lower + suffix;
                uppers += indicatorRanges[i].upper + suffix;
                opacity += indicatorRanges[i].opacity + suffix;
            }
            var prop = DesignerUtil.prototype.getInnerObjectbyString(componentJSON, $scope.custompropBoxFillColors.propertyName);
            prop[$scope.custompropBoxFillColors.attributes.names] = names;
            prop[$scope.custompropBoxFillColors.attributes.lowerColors] = lowers;
            prop[$scope.custompropBoxFillColors.attributes.upperColors] = uppers;
            prop[$scope.custompropBoxFillColors.attributes.opacity] = opacity;
            $scope.redrawComponent(componentJSON);
            /* Synchronize Updates box fill color property from desktop to mobile and tablet view*/
            if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
            	$scope.syncUpdateBoxFillColorsInMobileView(componentJSON, names, lowers, uppers, opacity);
            }
        };
        
        /**
         * Synchronize the Updates box fill color property to mobile and tablet view from desktop view
         */
        $scope.syncUpdateBoxFillColorsInMobileView = function(compObj, names, lowers, uppers, opacity) {
        	 var mobileLayoutObj = $scope.getComponentFromMobileLayout(compObj.objectID);
             if (mobileLayoutObj) {
            	 var prop = DesignerUtil.prototype.getInnerObjectbyString(mobileLayoutObj, $scope.custompropBoxFillColors.propertyName);
                 prop[$scope.custompropBoxFillColors.attributes.names] = names;
                 prop[$scope.custompropBoxFillColors.attributes.lowerColors] = lowers;
                 prop[$scope.custompropBoxFillColors.attributes.upperColors] = uppers;
                 prop[$scope.custompropBoxFillColors.attributes.opacity] = opacity;
             }
             var tabletLayoutObj = $scope.getComponentFromTabletLayout(compObj.objectID);
             if (tabletLayoutObj) {
            	 var nprop = DesignerUtil.prototype.getInnerObjectbyString(tabletLayoutObj, $scope.custompropBoxFillColors.propertyName);
                 nprop[$scope.custompropBoxFillColors.attributes.names] = names;
                 nprop[$scope.custompropBoxFillColors.attributes.lowerColors] = lowers;
                 nprop[$scope.custompropBoxFillColors.attributes.upperColors] = uppers;
                 nprop[$scope.custompropBoxFillColors.attributes.opacity] = opacity;
             }
        };
        
        /**
         * Removes box fill color
         * @param {String} boxFillColor The box fill color
         * @returns {undefined} undefined
         */
        $scope.removeBoxFillColor = function(boxFillColor) {
            var index = $scope.custompropBoxFillColors.value.indexOf(boxFillColor);
            $scope.custompropBoxFillColors.value.splice(index, 1);
        };

        /**
         * Removes all box fill colors
         * @return {undefined} undefined
         */
        $scope.removeAllBoxFillColors = function() {
            $scope.custompropBoxFillColors.value = [];
        };

        $scope.onCustomProjTimelineMilestoneClick = function(prop) {
            if (!$scope.modal.selectedComponentId){
                return false;
            }
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            $scope.custompropRangeIndicator = prop;
            $scope.custompropRangeIndicator.value = [];
            var nprop = DesignerUtil.prototype.getInnerObjectbyString(componentJSON, $scope.custompropRangeIndicator.propertyName);
            var names = nprop[$scope.custompropRangeIndicator.attributes.names].split(",");
            var shapes = nprop[$scope.custompropRangeIndicator.attributes.shapes].split(",");
            var colors = nprop[$scope.custompropRangeIndicator.attributes.colors].split(",");
            var positions = nprop[$scope.custompropRangeIndicator.attributes.positions].split(",");

            if (shapes[0] != "") {
                for (var i = 0; i < names.length; i++) {
                    var rangeColorJson = {};
                    rangeColorJson.name = names[i];
                    rangeColorJson.shape = shapes[i];
                    rangeColorJson.position = IsBoolean(positions[i]);
                    rangeColorJson.color = colors[i];
                    $scope.custompropRangeIndicator.value.push(rangeColorJson);
                }
            }
            $scope.showModelPopup("customProjTimelineMilestoneWindow");
        };
        $scope.addProjTimelineMilestone = function() {
            var rangeColorJson = {};
            rangeColorJson.name = "Milestone";
            rangeColorJson.shape = "arrowup";
            rangeColorJson.position = "true";
            rangeColorJson.color = "#08AEA8";
            $scope.custompropRangeIndicator.value.push(rangeColorJson);
        };

        $scope.UpdateProjTimelineMilestone = function(prop) {
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            var names = "";
            var shapes = "";
            var positions = "";
            var colors = "";
            var indicatorRanges = $scope.custompropRangeIndicator.value;
            for (var i = 0; i < indicatorRanges.length; i++) {
                var suffix = (i < indicatorRanges.length - 1) ? "," : "";
                names += indicatorRanges[i].name + suffix;
                shapes += indicatorRanges[i].shape + suffix;
                colors += indicatorRanges[i].color + suffix;
                positions += indicatorRanges[i].position + suffix;
            }
            var nprop = DesignerUtil.prototype.getInnerObjectbyString(componentJSON, $scope.custompropRangeIndicator.propertyName);
            nprop[$scope.custompropRangeIndicator.attributes.names] = names;
            nprop[$scope.custompropRangeIndicator.attributes.shapes] = shapes;
            nprop[$scope.custompropRangeIndicator.attributes.colors] = colors;
            nprop[$scope.custompropRangeIndicator.attributes.positions] = positions;
            $scope.redrawComponent(componentJSON);
        };
        $scope.onCustomProjTimelineTaskClick = function(prop) {
            if (!$scope.modal.selectedComponentId){
                return false;
            }
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            $scope.custompropRangeIndicator = prop;
            $scope.custompropRangeIndicator.value = [];
            var nprop = DesignerUtil.prototype.getInnerObjectbyString(componentJSON, $scope.custompropRangeIndicator.propertyName);
            var names = nprop[$scope.custompropRangeIndicator.attributes.names].split(",");
            var shapes = nprop[$scope.custompropRangeIndicator.attributes.shapes].split(",");
            var colors = nprop[$scope.custompropRangeIndicator.attributes.colors].split(",");

            if (shapes[0] != "") {
                for (var i = 0; i < names.length; i++) {
                    var rangeColorJson = {};
                    rangeColorJson.name = names[i];
                    rangeColorJson.shape = shapes[i];
                    rangeColorJson.color = colors[i];
                    $scope.custompropRangeIndicator.value.push(rangeColorJson);
                }
            }
            $scope.showModelPopup("customProjTimelineTaskWindow");
        };
        $scope.addProjTimelineTask = function() {
            var rangeColorJson = {};
            rangeColorJson.name = "Task";
            rangeColorJson.shape = "rectangle";
            rangeColorJson.color = "#08AEA8";
            $scope.custompropRangeIndicator.value.push(rangeColorJson);
        };

        $scope.UpdateProjTimelineTask = function(prop) {
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            var names = "";
            var shapes = "";
            var colors = "";
            var indicatorRanges = $scope.custompropRangeIndicator.value;
            for (var i = 0; i < indicatorRanges.length; i++) {
                var suffix = (i < indicatorRanges.length - 1) ? "," : "";
                names += indicatorRanges[i].name + suffix;
                shapes += indicatorRanges[i].shape + suffix;
                colors += indicatorRanges[i].color + suffix;
            }
            var nprop = DesignerUtil.prototype.getInnerObjectbyString(componentJSON, $scope.custompropRangeIndicator.propertyName);
            nprop[$scope.custompropRangeIndicator.attributes.names] = names;
            nprop[$scope.custompropRangeIndicator.attributes.shapes] = shapes;
            nprop[$scope.custompropRangeIndicator.attributes.colors] = colors;
            $scope.redrawComponent(componentJSON);
        };
        
        /** @description Methods to set  level wise color for sankey  **/
        $scope.onCustomLevelIndicatorClick = function(prop) {
            if (!$scope.modal.selectedComponentId){
                return false;
            }
            /**DAS-751 */
            var names = "";
            var shapes = "";
            var colors = "";
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            $scope.custompropLevelIndicator = prop;
            $scope.custompropLevelIndicator.value = [];
            if (componentJSON.Chart.Level.DisplayLevelName != "") {
                var nprop = DesignerUtil.prototype.getInnerObjectbyString(componentJSON, $scope.custompropLevelIndicator.propertyName);
                var names = nprop[$scope.custompropLevelIndicator.attributes.names].split(",");
                var colors = nprop[$scope.custompropLevelIndicator.attributes.colors].split(",");
            }
            if (names[0] != "") {
                for (var i = 0; i < names.length; i++) {
                    var levelColorJson = {};
                    levelColorJson.name = names[i];
                    levelColorJson.color = colors[i];
                    $scope.custompropLevelIndicator.value.push(levelColorJson);
                }
            }
            $scope.showModelPopup("customLevelIndicatorWindow");
        };
        /* @description Methods to set  shapes based on node group or range for knowledge  */
        $scope.onCustomShapeSelectorClick = function(prop) {
            if (!$scope.modal.selectedComponentId){
                return false;
            }
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            $scope.custompropShapeSelector = prop;
            $scope.custompropShapeSelector.typevalue = [];
            $scope.custompropShapeSelector.rangevalue = [];
            $scope.custompropShapeSelector.levelvalue = [];
            $scope.custompropShapeSelector.SVGshape = false;
            $scope.custompropShapeSelector.shape = ["dot","box","ellipsis","text","star","circle","diamond","square","triangle","triangledown","database"];
            $scope.custompropShapeSelector.shapeIndicatorTypeOptions = ["type","value","level"];
            $scope.custompropShapeSelector.shapeTypeOptions = ["Default","Custom","SVG"];
            if (componentJSON.Chart.nodeTypes != "" || componentJSON.Chart.DisplayName != "") {
                var nprop = DesignerUtil.prototype.getInnerObjectbyString(componentJSON, $scope.custompropShapeSelector.propertyName);
                var tnames = nprop[$scope.custompropShapeSelector.attributes.tnames].split(",");
                var tshapes = nprop[$scope.custompropShapeSelector.attributes.typeShapes].split(",");
                var rshapes = nprop[$scope.custompropShapeSelector.attributes.rangeShapes].split(",");
                var rnames = nprop[$scope.custompropShapeSelector.attributes.rnames].split(",");
                var ranges = nprop[$scope.custompropShapeSelector.attributes.ranges].split(",");
                var lnames = nprop[$scope.custompropShapeSelector.attributes.lnames].split(",");
                var lshapes = nprop[$scope.custompropShapeSelector.attributes.levelShapes].split(",");
              //  var colors = nprop[$scope.custompropShapeSelector.attributes.colors].split(",");
            }
            $scope.custompropShapeSelector.shapeIndicatorType = nprop[$scope.custompropShapeSelector.attributes.indicatorType];
            $scope.custompropShapeSelector.shapeType = nprop[$scope.custompropShapeSelector.attributes.shapeType];
            $scope.custompropShapeSelector.SVGshape = nprop.svgShape;
            if (rnames[0] != "") {
                for (var i = 0; i < rnames.length; i++) {
                    var shapesJson = {};
                    shapesJson.rname = rnames[i];
                    shapesJson.shape = rshapes[i];
                    shapesJson.ranges = ranges[i];
                    var range = ranges[i].split("~");
                    shapesJson.rangeFrom = range[0];
                    shapesJson.rangeUpTo = range[1];
                    $scope.custompropShapeSelector.rangevalue.push(shapesJson);
                }
            }
            if (tnames[0] != "") {
                for (var i = 0; i < tnames.length; i++) {
                    var shapesJson = {};
                    shapesJson.tname = tnames[i];
                    shapesJson.shape = tshapes[i];
                    $scope.custompropShapeSelector.typevalue.push(shapesJson);
                }
            }
            if (lnames[0] != "") {
                for (var i = 0; i < lnames.length; i++) {
                    var shapesJson = {};
                    shapesJson.lname = lnames[i];
                    shapesJson.shape = lshapes[i];
                    $scope.custompropShapeSelector.levelvalue.push(shapesJson);
                }
            }
            $scope.showModelPopup("customShapeSelectorWindow");
        };
        $scope.onCustomSVGFileClick = function(prop) {
        	var idname = 'browseSVGShape' + Object.values(prop)[0];
        	var element = document.getElementById(idname);
        	$(element).click().change(function(evt) {          
                evt.stopImmediatePropagation();
                // var property = prop;
                var file = evt.target.files[0];
                if (file.type == "image/svg+xml") {
                    var fReader = new FileReader();
                    fReader.onload = function(e) {
                        var fText = fReader.result;
                        var value = fText.replace(/,/g, ' ');
                        prop.shape = value;
                      //$scope.onSVGImageChange(prop);
                    };
                    fReader.readAsText(file);
                } else {
                    ServiceFactory.showNotification("Please use SVG file instead of " + file.name, "alert-danger", 3000);
                }
            });
        };
        /* @description Methods to set node color based on node group or range for knowledge  */
        $scope.onCustomColorSelectorClick = function(prop) {
            if (!$scope.modal.selectedComponentId) {
                return false;
            }
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            $scope.custompropColorSelector = prop;
            $scope.custompropColorSelector.typevalue = [];
            $scope.custompropColorSelector.rangevalue = [];
            $scope.custompropColorSelector.levelvalue = [];
            $scope.custompropColorSelector.colorIndicatorTypeOptions = ["type", "value", "level"];
            //$scope.custompropColorSelector.color = ["#E08283,#38d3a9,#797979,#eeeeee"];
            if (componentJSON.Chart.colorTypes != "" || componentJSON.Chart.DisplayName != "") {
                var nprop = DesignerUtil.prototype.getInnerObjectbyString(componentJSON, $scope.custompropColorSelector.propertyName);
                var names = nprop[$scope.custompropColorSelector.attributes.tnames].split(",");
                var tcolors = nprop[$scope.custompropColorSelector.attributes.typeColors].split(",");
                var rcolors = nprop[$scope.custompropColorSelector.attributes.rangeColors].split(",");
                var rnames = nprop[$scope.custompropColorSelector.attributes.rnames].split(",");
                var tnames = nprop[$scope.custompropColorSelector.attributes.tnames].split(",");
                var lnames = nprop[$scope.custompropColorSelector.attributes.lnames].split(",");
                var ranges = nprop[$scope.custompropColorSelector.attributes.ranges].split(",");
                var lcolors = nprop[$scope.custompropColorSelector.attributes.levelColors].split(",");
            }
            $scope.custompropColorSelector.colorIndicatorType = nprop[$scope.custompropColorSelector.attributes.indicatorType];
            if (rnames[0] != "") {
                for (var i = 0; i < rnames.length; i++) {
                    var colorsJson = {};
                    colorsJson.color = rcolors[i];
                    colorsJson.rname = rnames[i];
                    colorsJson.ranges = ranges[i];
                    var range = ranges[i].split("~");
                    colorsJson.rangeFrom = range[0];
                    colorsJson.rangeUpTo = range[1];
                    $scope.custompropColorSelector.rangevalue.push(colorsJson);
                }
            }
            if (tnames[0] != "") {
                for (var i = 0; i < tnames.length; i++) {
                    var colorsJson = {};
                    colorsJson.tname = tnames[i];
                    colorsJson.color = tcolors[i];
                    $scope.custompropColorSelector.typevalue.push(colorsJson);
                }
            }
            if (lnames[0] != "") {
                for (var i = 0; i < lnames.length; i++) {
                    var colorsJson = {};
                    colorsJson.lname = lnames[i];
                    colorsJson.color = lcolors[i];
                    $scope.custompropColorSelector.levelvalue.push(colorsJson);
                }
            }
            $scope.showModelPopup("customColorSelectorWindow");
        };

        /** @description Methods to set  Range Indicators in Bubble/ HeatMap/ TreeMap etc.  **/
        $scope.onCustomRangeIndicatorClick = function(prop) {
            if (!$scope.modal.selectedComponentId){
                return false;
            }
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            $scope.custompropRangeIndicator = prop;
            $scope.custompropRangeIndicator.value = [];
            if (componentJSON.Chart.rangedSeriesDisplayNames != "") {
                var nprop = DesignerUtil.prototype.getInnerObjectbyString(componentJSON, $scope.custompropRangeIndicator.propertyName);
                var names = nprop[$scope.custompropRangeIndicator.attributes.names].split(",");
                var ranges = nprop[$scope.custompropRangeIndicator.attributes.ranges].split(",");
                var colors = nprop[$scope.custompropRangeIndicator.attributes.colors].split(",");
                if (ranges[0] != "") {
                    for (var i = 0; i < names.length; i++) {
                        var rangeColorJson = {};
                        rangeColorJson.name = names[i];
                        var range = ranges[i].split("~");
                        rangeColorJson.rangeFrom = range[0];
                        rangeColorJson.rangeUpTo = range[1];
                        rangeColorJson.color = colors[i];
                        $scope.custompropRangeIndicator.value.push(rangeColorJson);
                    }
                }
            }
            $scope.custompropRangeIndicator.dynamicColorRange = {};
            /*DAS-439 adding component type for custom message in color range indiactor*/
            $scope.custompropRangeIndicator.dynamicColorRange.componentType = componentJSON.componentType;
            $scope.custompropRangeIndicator.dynamicColorRange.showDynamicRange = IsBoolean(componentJSON.Chart.showDynamicRange);
            $scope.custompropRangeIndicator.dynamicColorRange.minRangeColor = componentJSON.Chart.minRangeColor;
            $scope.custompropRangeIndicator.dynamicColorRange.maxRangeColor = componentJSON.Chart.maxRangeColor;
            $scope.showModelPopup("customRangeIndicatorWindow");
        };

        /**
         * Adds range indicator color
         */
        $scope.addRangeIndicatorRange = function() {
            var rangeColorJson = {};
            /*DAS-439 color range alert range default values*/
            var indicatorRanges = $scope.custompropRangeIndicator.value.length;
            if(indicatorRanges == 0){
			rangeColorJson.name = "Range";
            rangeColorJson.rangeFrom = "0";
            rangeColorJson.rangeUpTo = "20";
            rangeColorJson.color = "#08AEA8";
			}else{
			var lastRange = parseFloat($scope.custompropRangeIndicator.value[indicatorRanges-1].rangeUpTo);
			rangeColorJson.name = "Range";
            rangeColorJson.rangeFrom = lastRange.toString();
            rangeColorJson.rangeUpTo = (lastRange + 20).toString();
            rangeColorJson.color = "#08AEA8";
			}
            
            $scope.custompropRangeIndicator.value.push(rangeColorJson);
        };
        
        /**
         * Adds Sankey level indicator color
         */
        $scope.addLevelIndicatorRange = function() {
            var levelColorJson = {};
            /*DAS-439 color range alert range default values*/
            var indicatorLevels = $scope.custompropLevelIndicator.value.length;
            if(indicatorLevels == 0){
				/**DAS-751 */
				levelColorJson.name = "Level 1";
	            levelColorJson.color = "#08AEA8";
			}else{
				levelColorJson.name = "Level " + (indicatorLevels+1);
	            levelColorJson.color = "#08AEA8";
			}
            
            $scope.custompropLevelIndicator.value.push(levelColorJson);
        };
        /**  Adds Knowledge custom shapes   */
        $scope.addCustomShapesLevel = function() {
            var customShapesJson = {};
            if ($scope.custompropShapeSelector.shapeIndicatorType == "value") {
                var indicatorLevels = $scope.custompropShapeSelector.rangevalue.length;
                if (indicatorLevels == 0) {
                	customShapesJson.rname = "Range";
                	customShapesJson.rangeFrom = "0";
                	customShapesJson.rangeUpTo = "5";
                	customShapesJson.shape = "dot";
                } else {
                    var lastRange = parseFloat($scope.custompropShapeSelector.rangevalue[indicatorLevels - 1].rangeUpTo);
                    customShapesJson.rname = "Range";
                    customShapesJson.rangeFrom = lastRange.toString();
                    customShapesJson.rangeUpTo = (lastRange + 20).toString();
                    customShapesJson.shape = "dot";
                }
                $scope.custompropShapeSelector.rangevalue.push(customShapesJson);
            } else if($scope.custompropShapeSelector.shapeIndicatorType == "level"){
            	 var indicatorLevels = $scope.custompropShapeSelector.levelvalue.length;
                 customShapesJson.lname = "Level " + (indicatorLevels + 1);
                 customShapesJson.shape = "dot";
                 $scope.custompropShapeSelector.levelvalue.push(customShapesJson);
            } else if($scope.custompropShapeSelector.shapeIndicatorType == "type"){
                var indicatorLevels = $scope.custompropShapeSelector.typevalue.length;
                customShapesJson.tname = "Type " + (indicatorLevels + 1);
                customShapesJson.shape = "dot";
                $scope.custompropShapeSelector.typevalue.push(customShapesJson);
            } else{}
        };
        /** Adds Knowledge custom colors */
        $scope.addCustomColorsLevel = function() {
            var customColorsJson = {};
            if ($scope.custompropColorSelector.colorIndicatorType == "value") {
                var indicatorLevels = $scope.custompropColorSelector.rangevalue.length;
                if (indicatorLevels == 0) {
                    customColorsJson.rname = "Range";
                    customColorsJson.rangeFrom = "0";
                    customColorsJson.rangeUpTo = "5";
                    customColorsJson.color = "#08AEA8";
                } else {
                    var lastRange = parseFloat($scope.custompropColorSelector.rangevalue[indicatorLevels - 1].rangeUpTo);
                    customColorsJson.rname = "Range";
                    customColorsJson.rangeFrom = lastRange.toString();
                    customColorsJson.rangeUpTo = (lastRange + 20).toString();
                    customColorsJson.color = "#08AEA8";
                }
                $scope.custompropColorSelector.rangevalue.push(customColorsJson);
            } else if($scope.custompropColorSelector.colorIndicatorType == "level"){
                var indicatorLevels = $scope.custompropColorSelector.levelvalue.length;
                customColorsJson.lname = "Level " + (indicatorLevels + 1);
                customColorsJson.color = "#08AEA8";
                $scope.custompropColorSelector.levelvalue.push(customColorsJson);
            } else if($scope.custompropColorSelector.colorIndicatorType == "type"){
                var indicatorLevels = $scope.custompropColorSelector.typevalue.length;
                customColorsJson.tname = "Type " + (indicatorLevels + 1);
                customColorsJson.color = "#08AEA8";
                $scope.custompropColorSelector.typevalue.push(customColorsJson);
            } else{};
        };
        /**
         * Updates range indicator color
         */
        $scope.UpdateRangeIndicatorRange = function() {
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            var names = "";
            var ranges = "";
            var colors = "";
            var indicatorRanges = $scope.custompropRangeIndicator.value;
            /* DAS-439 HeatMap frequency bar range */
            var validRange = true;
            var inValidRange = true;
            var inValidNumber = true; 
            for (var i = 0; i < indicatorRanges.length; i++) {
                var suffix = (i < indicatorRanges.length - 1) ? "," : "";
                names += indicatorRanges[i].name + suffix;
                if(indicatorRanges[i].rangeFrom == "" || indicatorRanges[i].rangeUpTo == ""){
					validRange = false;
				}
				if(indicatorRanges[i].rangeFrom != "" && indicatorRanges[i].rangeUpTo != "" && parseFloat(indicatorRanges[i].rangeFrom) >= parseFloat(indicatorRanges[i].rangeUpTo) ){
					inValidRange = false;
				}
				if((isNaN(indicatorRanges[i].rangeFrom) || isNaN(indicatorRanges[i].rangeUpTo)) && (indicatorRanges[i].rangeFrom != "" && indicatorRanges[i].rangeUpTo != "") ){
					inValidNumber = false;
				}
                var range = indicatorRanges[i].rangeFrom + "~" + indicatorRanges[i].rangeUpTo;
                ranges += range + suffix;
                colors += indicatorRanges[i].color + suffix;
            }
            if(!IsBoolean(validRange)){
				ServiceFactory.showNotification("Range values must not be empty", "alert-warning", 3000);
				$scope.onCustomRangeIndicatorClick($scope.custompropRangeIndicator);
				return false;
			}
			if(!IsBoolean(inValidNumber)){
				ServiceFactory.showNotification("Range values only accepts numbers", "alert-warning", 3000);
				$scope.onCustomRangeIndicatorClick($scope.custompropRangeIndicator);
				return false;
			}
			if(!IsBoolean(inValidRange)){
				ServiceFactory.showNotification("RangeFrom should be less than RangeUpto", "alert-warning", 3000);
				$scope.onCustomRangeIndicatorClick($scope.custompropRangeIndicator);
				return false;
			}
			/**calculatiuon to check continous series arnage validator for heat map chaart only */
			var validRangeSeries = true;
			var rangeSeriesArray= ranges.split(",");
			for (var i = 0; i < rangeSeriesArray.length-1; i++){
				var rangedata1  = rangeSeriesArray[i].split("~");
				var rangedata2  = rangeSeriesArray[i+1].split("~");
				if(parseInt(rangedata1[1])!==parseInt(rangedata2[0])){
					validRangeSeries = false;
				}
			}
			if(!IsBoolean(validRangeSeries) && $scope.custompropRangeIndicator.dynamicColorRange.componentType =='heat_map_chart'){
				ServiceFactory.showNotification("Color Range must in continues series for Heat Map.", "alert-warning", 3000);
				$scope.onCustomRangeIndicatorClick($scope.custompropRangeIndicator);
				return false;
			}
			
            var prop = DesignerUtil.prototype.getInnerObjectbyString(componentJSON, $scope.custompropRangeIndicator.propertyName);
            prop[$scope.custompropRangeIndicator.attributes.names] = names;
            prop[$scope.custompropRangeIndicator.attributes.ranges] = ranges;
            prop[$scope.custompropRangeIndicator.attributes.colors] = colors;
            componentJSON.Chart.showDynamicRange = $scope.custompropRangeIndicator.dynamicColorRange.showDynamicRange;
            componentJSON.Chart.minRangeColor = $scope.custompropRangeIndicator.dynamicColorRange.minRangeColor;
            componentJSON.Chart.maxRangeColor = $scope.custompropRangeIndicator.dynamicColorRange.maxRangeColor;
            $scope.redrawComponent(componentJSON);
            /* Synchronize Updates range indicator color from desktop to mobile and tablet view*/
            if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
            	$scope.syncUpdateRangeIndicatorRangeInMobileView(componentJSON, names, ranges, colors);
            }
        };
        
        /*Save the changes of level indicator color for sankey*/        
		$scope.UpdateLevelIndicatorColor = function() {
			var colors = "";
			var names = "";
		    var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
		    var indicatorLevels = $scope.custompropLevelIndicator.value;
		    for (var i = 0; i < indicatorLevels.length; i++) {
		        var suffix = (i < indicatorLevels.length - 1) ? "," : "";
		        colors += indicatorLevels[i].color + suffix;
		        names += indicatorLevels[i].name + suffix;
		    }
		    var prop = DesignerUtil.prototype.getInnerObjectbyString(componentJSON, $scope.custompropLevelIndicator.propertyName);
		    prop[$scope.custompropLevelIndicator.attributes.colors] = colors;
		    prop[$scope.custompropLevelIndicator.attributes.names] = names;
		    $scope.redrawComponent(componentJSON);
        };
        /* Save the changes of indicator shape for knowledge */        
		$scope.UpdateCustomShapes = function() {			
			var names = "";
			var shapes = "";
			var ranges = "";
		    var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
		    var prop = DesignerUtil.prototype.getInnerObjectbyString(componentJSON, $scope.custompropShapeSelector.propertyName);
		    prop[$scope.custompropShapeSelector.attributes.indicatorType] =  $scope.custompropShapeSelector.shapeIndicatorType;
		    prop[$scope.custompropShapeSelector.attributes.shapeType] =  $scope.custompropShapeSelector.shapeType;
		    if($scope.custompropShapeSelector.shapeIndicatorType == "value"){
		    	var indicatorLevels = $scope.custompropShapeSelector.rangevalue;
			    for (var i = 0; i < indicatorLevels.length; i++) {
			        var suffix = (i < indicatorLevels.length - 1) ? "," : "";
			        shapes += indicatorLevels[i].shape + suffix;
			        names += indicatorLevels[i].rname + suffix;
			        ranges += indicatorLevels[i]["rangeFrom"] + "~" + indicatorLevels[i]["rangeUpTo"] + suffix;
			    }
			    prop[$scope.custompropShapeSelector.attributes.ranges] = ranges;
			    prop[$scope.custompropShapeSelector.attributes.rnames] = names;
			    prop[$scope.custompropShapeSelector.attributes.rangeShapes] = shapes;
		    } else if($scope.custompropShapeSelector.shapeIndicatorType == "level"){
		    	var indicatorLevels = $scope.custompropShapeSelector.levelvalue;
			    for (var i = 0; i < indicatorLevels.length; i++) {
			        var suffix = (i < indicatorLevels.length - 1) ? "," : "";
			        shapes += indicatorLevels[i].shape + suffix;
			        names += indicatorLevels[i].lname + suffix;			        
			    }
			    prop[$scope.custompropShapeSelector.attributes.lnames] = names;
			    prop[$scope.custompropShapeSelector.attributes.levelShapes] = shapes;
		    } else {
		    	var indicatorLevels = $scope.custompropShapeSelector.typevalue;
			    for (var i = 0; i < indicatorLevels.length; i++) {
			        var suffix = (i < indicatorLevels.length - 1) ? "," : "";
			        shapes += indicatorLevels[i].shape + suffix;
			        names += indicatorLevels[i].tname + suffix;			        
			    }
			    prop[$scope.custompropShapeSelector.attributes.tnames] = names;
			    prop[$scope.custompropShapeSelector.attributes.typeShapes] = shapes;
		    }
		    $scope.redrawComponent(componentJSON);
        };
        /** Save the changes of indicator color for knowledge **/        
		$scope.UpdateCustomColors = function() {
			var colors = "";
			var names = "";	
			var ranges = "";
		    var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
		    var prop = DesignerUtil.prototype.getInnerObjectbyString(componentJSON, $scope.custompropColorSelector.propertyName);
		    prop[$scope.custompropColorSelector.attributes.indicatorType] =  $scope.custompropColorSelector.colorIndicatorType;
		    if($scope.custompropColorSelector.colorIndicatorType == "value"){
		    	var indicatorLevels = $scope.custompropColorSelector.rangevalue;
			    for (var i = 0; i < indicatorLevels.length; i++) {
			        var suffix = (i < indicatorLevels.length - 1) ? "," : "";
			        colors += indicatorLevels[i].color + suffix;
			        names += indicatorLevels[i].rname + suffix;
			        ranges += indicatorLevels[i]["rangeFrom"] + "~" + indicatorLevels[i]["rangeUpTo"] + suffix;
			    }
			    prop[$scope.custompropColorSelector.attributes.ranges] = ranges;
			    prop[$scope.custompropColorSelector.attributes.rnames] = names;
			    prop[$scope.custompropColorSelector.attributes.rangeColors] = colors;
		    } else if($scope.custompropColorSelector.colorIndicatorType == "level"){
		    	var indicatorLevels = $scope.custompropColorSelector.levelvalue;
			    for (var i = 0; i < indicatorLevels.length; i++) {
			        var suffix = (i < indicatorLevels.length - 1) ? "," : "";
			        colors += indicatorLevels[i].color + suffix;
			        names += indicatorLevels[i].lname + suffix;			        
			    }
			    prop[$scope.custompropColorSelector.attributes.lnames] = names;
			    prop[$scope.custompropColorSelector.attributes.levelColors] = colors
		    } else {
		    	var indicatorLevels = $scope.custompropColorSelector.typevalue;
			    for (var i = 0; i < indicatorLevels.length; i++) {
			        var suffix = (i < indicatorLevels.length - 1) ? "," : "";
			        colors += indicatorLevels[i].color + suffix;
			        names += indicatorLevels[i].tname + suffix;			        
			    }
			    prop[$scope.custompropColorSelector.attributes.tnames] = names;
			    prop[$scope.custompropColorSelector.attributes.typeColors] = colors;
		    }
		    $scope.redrawComponent(componentJSON);
        };
        
        /**
         * Synchronize Updates range indicator color from desktop to mobile and tablet view
         */
        $scope.syncUpdateRangeIndicatorRangeInMobileView = function(compObj, names, ranges, colors) {
        	var prop;
        	var mobileLayoutObj = $scope.getComponentFromMobileLayout(compObj.objectID);
            if (mobileLayoutObj) {
                prop = DesignerUtil.prototype.getInnerObjectbyString(mobileLayoutObj, $scope.custompropRangeIndicator.propertyName);
                prop[$scope.custompropRangeIndicator.attributes.names] = names;
                prop[$scope.custompropRangeIndicator.attributes.ranges] = ranges;
                prop[$scope.custompropRangeIndicator.attributes.colors] = colors;
                mobileLayoutObj.Chart.showDynamicRange = $scope.custompropRangeIndicator.dynamicColorRange.showDynamicRange;
                mobileLayoutObj.Chart.minRangeColor = $scope.custompropRangeIndicator.dynamicColorRange.minRangeColor;
                mobileLayoutObj.Chart.maxRangeColor = $scope.custompropRangeIndicator.dynamicColorRange.maxRangeColor;
            }
            var tabletLayoutObj = $scope.getComponentFromTabletLayout(compObj.objectID);
            if (tabletLayoutObj) {
                prop = DesignerUtil.prototype.getInnerObjectbyString(tabletLayoutObj, $scope.custompropRangeIndicator.propertyName);
                prop[$scope.custompropRangeIndicator.attributes.names] = names;
                prop[$scope.custompropRangeIndicator.attributes.ranges] = ranges;
                prop[$scope.custompropRangeIndicator.attributes.colors] = colors;
                tabletLayoutObj.Chart.showDynamicRange = $scope.custompropRangeIndicator.dynamicColorRange.showDynamicRange;
                tabletLayoutObj.Chart.minRangeColor = $scope.custompropRangeIndicator.dynamicColorRange.minRangeColor;
                tabletLayoutObj.Chart.maxRangeColor = $scope.custompropRangeIndicator.dynamicColorRange.maxRangeColor;
            }
        };
       
        /**
         * Removes specified color form range indicator color
         * @param  {String} band The color
         * @return {undefined}      undefined
         */
        $scope.removeRangeIndicatorRange = function(band) {
            var index = $scope.custompropRangeIndicator.value.indexOf(band);
            $scope.custompropRangeIndicator.value.splice(index, 1);
        };
        
        /* DAS-581*/
        $scope.removeLevelIndicator = function(band) {
            var index = $scope.custompropLevelIndicator.value.indexOf(band);
            $scope.custompropLevelIndicator.value.splice(index, 1);
        };
        $scope.removeCustomShapeLevel = function(band) {
        	if($scope.custompropShapeSelector.shapeIndicatorType == "type"){
        		 var index = $scope.custompropShapeSelector.typevalue.indexOf(band);
                 $scope.custompropShapeSelector.typevalue.splice(index, 1);
        	}else if($scope.custompropShapeSelector.shapeIndicatorType == "value"){
        		var index = $scope.custompropShapeSelector.rangevalue.indexOf(band);
                $scope.custompropShapeSelector.rangevalue.splice(index, 1);
        	}else if($scope.custompropShapeSelector.shapeIndicatorType == "level"){
        		var index = $scope.custompropShapeSelector.levelvalue.indexOf(band);
                $scope.custompropShapeSelector.levelvalue.splice(index, 1);
        	}else{
        		//
        	}
        };
        $scope.removeCustomColorLevel = function(band) {
        	if($scope.custompropColorSelector.colorIndicatorType == "type"){
       		    var index = $scope.custompropColorSelector.typevalue.indexOf(band);
                $scope.custompropColorSelector.typevalue.splice(index, 1);
       	    }else if($scope.custompropColorSelector.colorIndicatorType == "value"){
       		   var index = $scope.custompropColorSelector.rangevalue.indexOf(band);
               $scope.custompropColorSelector.rangevalue.splice(index, 1);
          	}else if($scope.custompropColorSelector.colorIndicatorType == "level"){
       		   var index = $scope.custompropColorSelector.levelvalue.indexOf(band);
               $scope.custompropColorSelector.levelvalue.splice(index, 1);
         	}else{
        		//
        	}
        };
        $scope.removeCustomShapeIndicatorRange = function(band) {
            var index = $scope.custompropShapeSelector.rangevalue.indexOf(band);
            $scope.custompropShapeSelector.rangevalue.splice(index, 1);
        };
        $scope.removeCustomColorIndicatorRange = function(band) {
            var index = $scope.custompropColorSelector.rangevalue.indexOf(band);
            $scope.custompropColorSelector.rangevalue.splice(index, 1);
        };       

        /** DAS-439 colorindicator range auto update next min value from previous max value*/
        $scope.updateNextRangeIndicatorRange = function(rangeUpto,rangIndex) {
            if(rangeUpto != "" && $scope.custompropRangeIndicator.value[rangIndex+1] !=undefined){
			$scope.custompropRangeIndicator.value[rangIndex+1].rangeFrom = rangeUpto;	
			}
        };

        /**
         * Removes all colors from the range indicator range
         * @return {undefined} undefined
         */
        $scope.removeAllRangeIndicatorRange = function() {
            $scope.custompropRangeIndicator.value = [];
        };

		/*DAS-581*/        
        $scope.removeAllLevelIndicatorRange = function() {
            $scope.custompropLevelIndicator.value = [];
        };

        $scope.removeAllCustomShapeSelector = function() {
        	if($scope.custompropShapeSelector.shapeIndicatorType == "value"){
        		$scope.custompropShapeSelector.rangevalue = [];
        	} else if($scope.custompropShapeSelector.shapeIndicatorType == "level"){
        		$scope.custompropShapeSelector.levelvalue = [];
        	} else {
        		$scope.custompropShapeSelector.typevalue = [];
        	}
        };
        $scope.removeAllCustomColorSelector = function() {
        	if($scope.custompropColorSelector.colorIndicatorType == "value"){
        		$scope.custompropColorSelector.rangevalue = [];
        	} else if($scope.custompropColorSelector.colorIndicatorType == "level"){
        		$scope.custompropColorSelector.levelvalue = [];
        	} else {
        		$scope.custompropColorSelector.typevalue = [];
        	}          
        };

        /** @description Methods to set Bullet Component property setting  **/
        $scope.onCustomBulletRangeClick = function(prop) {
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            var type = prop.propertyName;
            $scope.custompropBulletBand = prop;
            $scope.custompropBulletBand.value = [];
            if (componentJSON[type].rangedSeriesDisplayNames != "") {
                var names = componentJSON[type].rangedSeriesDisplayNames.split(",");
                var ranges = componentJSON[type].rangesOfSeries.split(",");
                var colors = componentJSON[type].rangedColors.split(",");
                var alphas = componentJSON[type].alphas.split(",");
                for (var i = 0; i < names.length; i++) {
                    var bulletRangeJson = {};
                    var range = ranges[i].split("~");
                    bulletRangeJson.name = names[i];
                    bulletRangeJson.rangeFrom = range[0];
                    bulletRangeJson.rangeUpTo = range[1];
                    bulletRangeJson.color = colors[i];
                    bulletRangeJson.alpha = alphas[i] * 1;
                    $scope.custompropBulletBand.value.push(bulletRangeJson);
                }
            }
            $scope.showModelPopup("customBulletBandWindow");
        };

        /**
         * Adds bullet band range
         * @returns {undefined} undefined
         */
        $scope.addBulletBandRange = function() {
            var bulletRangeJson = {};
            bulletRangeJson.name = "Range";
            bulletRangeJson.rangeFrom = 0;
            bulletRangeJson.rangeUpTo = 0;
            bulletRangeJson.color = "#08AEA8";
            bulletRangeJson.alpha = 0.5;
            $scope.custompropBulletBand.value.push(bulletRangeJson);
        };
        /**
         * Updates bullet band range
         * @returns {undefined} undefined
         */
        $scope.UpdateBulletRange = function() {
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            var names = "";
            var ranges = "";
            var colors = "";
            var alphas = "";
            var type = $scope.custompropBulletBand.propertyName;
            var bands = $scope.custompropBulletBand.value;
            for (var i = 0; i < bands.length; i++) {
                var suffix = (i < bands.length - 1) ? "," : "";
                names += bands[i].name + suffix;
                var range = bands[i].rangeFrom + "~" + bands[i].rangeUpTo;
                ranges += range + suffix;
                colors += bands[i].color + suffix;
                alphas += bands[i].alpha + suffix;
            }
            componentJSON[type].rangedSeriesDisplayNames = names;
            componentJSON[type].rangesOfSeries = ranges;
            componentJSON[type].rangedColors = colors;
            componentJSON[type].alphas = alphas;
            $scope.redrawComponent(componentJSON);
            /* Synchronize Updates bullet band range property from desktop to mobile and tablet view */
            if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
            	$scope.syncUpdateBulletRangeInMobileView(componentJSON, names, ranges, colors, alphas);
            }
        };
        
        /**
         * Synchronize the Updates bullet band range property to mobile and tablet view from desktop view
         */
        $scope.syncUpdateBulletRangeInMobileView = function(compObj, names, ranges, colors, alphas) {
        	 var type = $scope.custompropBulletBand.propertyName;
        	 var mobileLayoutObj = $scope.getComponentFromMobileLayout(compObj.objectID);
             if (mobileLayoutObj) {
            	 mobileLayoutObj[type].rangedSeriesDisplayNames = names;
            	 mobileLayoutObj[type].rangesOfSeries = ranges;
            	 mobileLayoutObj[type].rangedColors = colors;
            	 mobileLayoutObj[type].alphas = alphas;
             }
             var tabletLayoutObj = $scope.getComponentFromTabletLayout(compObj.objectID);
             if (tabletLayoutObj) {
            	 tabletLayoutObj[type].rangedSeriesDisplayNames = names;
            	 tabletLayoutObj[type].rangesOfSeries = ranges;
            	 tabletLayoutObj[type].rangedColors = colors;
            	 tabletLayoutObj[type].alphas = alphas;
             }
        };
        
        /**
         * Removes specified band from the band color range
         * @param  {String} band The band color
         * @return {undefined}      undefined
         */
        $scope.removeBulletBandColorRange = function(band) {
            var index = $scope.custompropBulletBand.value.indexOf(band);
            $scope.custompropBulletBand.value.splice(index, 1);
        };

        /**
         * Removes all bullet band range
         * @returns {undefined} undefined
         */
        $scope.removeAllBulletRange = function() {
            $scope.custompropBulletBand.value = [];
        };

        /** @description Methods to set Trend Component property setting  **/
        $scope.onCustomTrendRangeClick = function(prop) {
            $scope.customprop = prop;
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            var range = componentJSON[$scope.customprop.propertyName][$scope.customprop.attributeName].split(",");
            $scope.customprop.from = (range[0]) * 1;
            $scope.customprop.upTo = (range[1]) * 1;
            $scope.showModelPopup("customTrendRangeWindow");
        };

        /**
         * Updates trend range
         * @return {undefined} undefined
         */
        $scope.updateTrendRange = function() {
            var prop = $scope.customprop;
            var value = ((prop.from == "") ? "0" : prop.from) + "," + ((prop.upTo == "") ? "0" : prop.upTo);
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            var comp = DesignerUtil.prototype.getInnerObjectbyString(componentJSON, prop["propertyName"]);
            comp[prop["attributeName"]] = value;
            $scope.redrawComponent(componentJSON);
            /* Synchronize Updates trend range property from desktop to mobile and tablet view */
            if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
            	$scope.syncUpdateTrendRangeInMobileView(componentJSON, prop, value);
            }
        };
        
        /**
         * Synchronize the Updates trend range property to mobile and tablet view from desktop view
         */
        $scope.syncUpdateTrendRangeInMobileView = function(compObj, prop, value) {
        	var comp; 
        	var mobileLayoutObj = $scope.getComponentFromMobileLayout(compObj.objectID);
             if (mobileLayoutObj) {
            	 comp = DesignerUtil.prototype.getInnerObjectbyString(mobileLayoutObj, prop["propertyName"]);
                 comp[prop["attributeName"]] = value;
             }
             var tabletLayoutObj = $scope.getComponentFromTabletLayout(compObj.objectID);
             if (tabletLayoutObj) {
            	 comp = DesignerUtil.prototype.getInnerObjectbyString(tabletLayoutObj, prop["propertyName"]);
                 comp[prop["attributeName"]] = value;
             }
        };
        
        /** @description Methods to set Gauge property setting  **/
        $scope.onCustomGaugeIndicatorClick = function(prop) {
            $scope.custompropGaugeIndicator = prop;
            $scope.custompropGaugeIndicator.value = [];
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            if (componentJSON[prop["propertyName"]].colors != "") {
                var colors = componentJSON[prop["propertyName"]].colors.split(",");
                var ratios = componentJSON[prop["propertyName"]].ratios.split(",");
                var alphas = componentJSON[prop["propertyName"]].alphas.split(",");
                for (var i = 0; i < colors.length; i++) {
                    var json = {};
                    json.color = colors[i];
                    json.ratio = (ratios[i]) * 1;
                    json.alpha = (alphas[i]) * 1;
                    $scope.custompropGaugeIndicator.value.push(json);
                }
            }
            $scope.showModelPopup("customGaugeAlertWindow");
            if (navigator.appVersion.indexOf("Win") != -1 || !Modernizr.inputtypes.color) {
            	$scope.initSpectrumColorPicker("input[type='color']");
            }
        };

        /**
         * Adds guage indicator
         */
        $scope.addGaugeIndicator = function() {
            var json = {};
            json.ratio = 0;
            json.alpha = 1;
            json.color = "#08AEA8";
            $scope.custompropGaugeIndicator.value.push(json);
            $timeout(function() {
                if (navigator.appVersion.indexOf("Win") != -1 || !Modernizr.inputtypes.color) {
                	$scope.initSpectrumColorPicker("input[type='color']");
                }
            }, 0.01);
        };

        /**
         * Updates gauge indicator
         * @return {undefined} undefined
         */
        $scope.updateGaugeIndicator = function() {
            var ratios = "";
            var colors = "";
            var alphas = "";
            var ranges = $scope.custompropGaugeIndicator.value;
            for (var i = 0; i < ranges.length; i++) {
                var suffix = (i < ranges.length - 1) ? "," : "";
                ratios += ranges[i].ratio + suffix;
                colors += ranges[i].color + suffix;
                alphas += ranges[i].alpha + suffix;
            }
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            var comp = DesignerUtil.prototype.getInnerObjectbyString(componentJSON, $scope.custompropGaugeIndicator.propertyName);
            comp.ratios = ratios;
            comp.colors = colors;
            comp.alphas = alphas;
            $scope.redrawComponent(componentJSON);
            /* Synchronize Updates gauge indicator property from desktop to mobile and tablet view */
            if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
            	$scope.syncUpdateGaugeIndicatorInMobileView(componentJSON, ratios, colors, alphas);
            }
        };
        
        /**
         * Synchronize the Updates gauge indicator property to mobile and tablet view from desktop view
         */
        $scope.syncUpdateGaugeIndicatorInMobileView = function(compObj, ratios, colors, alphas) {
        	var comp; 
        	var mobileLayoutObj = $scope.getComponentFromMobileLayout(compObj.objectID);
        	if (mobileLayoutObj) {
            	comp = DesignerUtil.prototype.getInnerObjectbyString(mobileLayoutObj, $scope.custompropGaugeIndicator.propertyName);
                 comp.ratios = ratios;
                 comp.colors = colors;
                 comp.alphas = alphas;
             }
             var tabletLayoutObj = $scope.getComponentFromTabletLayout(compObj.objectID);
             if (tabletLayoutObj) {
            	 comp = DesignerUtil.prototype.getInnerObjectbyString(tabletLayoutObj, $scope.custompropGaugeIndicator.propertyName);
                 comp.ratios = ratios;
                 comp.colors = colors;
                 comp.alphas = alphas;
             }
        };
        
        /**
         * Removes specified indicator from gauge indicator
         * @param  {String} indicator The indicator
         * @return {undefined}           undefined
         */
        $scope.removeGaugeIndicator = function(indicator) {
            var index = $scope.custompropGaugeIndicator.value.indexOf(indicator);
            $scope.custompropGaugeIndicator.value.splice(index, 1);
        };

        /**
         * Removes all gauge indicator
         * @return {undefined} undefined
         */
        $scope.removeAllGaugeIndicator = function() {
            $scope.custompropGaugeIndicator.value = [];
        };
        
        /** @description Methods to set Image Component properties  **/
        $scope.onCustomImageBrowseClick = function(prop) {
            var comp = $scope.getComponentbyId($scope.modal.selectedComponentId);
            $scope.inputMode = comp[comp.subElement].imageSourceType;
            $scope.custompropImageComp = prop;
            $scope.inputModeBase64 = true;
            $scope.customInputImageName = comp[comp.subElement].imageSourceName;
            $scope.oldImage = $scope.customInputImageName;
            if ($scope.inputMode == "URL") {
                $scope.inputModeBase64 = false;
                $scope.customInputImageURL = prop.value;
            }
            $scope.showModelPopup("customImageBrowseWindow");
        };

        /**
         * Click handler for image browse button
         */
        $scope.HandleImageBrowseClick = function() {
            $("#customImageBrowse").click();
        };

        /**
         * Callback function on select image
         * @param  {Object} inputModeBase64     base64 string
         * @param  {Array} customInputImageURL Image urls
         * @return {undefined}                     undefined
         */
        $scope.customImageBrowseSelection = function(inputModeBase64, customInputImageURL) {
            if (!inputModeBase64) {
                if (customInputImageURL != undefined && customInputImageURL.length > 0) {
                    $scope.custompropImageComp.value = customInputImageURL;
                } else {
                    ServiceFactory.showNotification("Enter a valid URL", "alert-warning", 3000);
                }
                $scope.inputMode = "URL";
            } else {
                $scope.inputMode = "base64";
            }

            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            componentJSON[componentJSON.subElement].imageSourceName = $scope.customInputImageName;
            componentJSON[componentJSON.subElement].imageSourceType = $scope.inputMode;
            $scope.redrawComponent(componentJSON);
            $scope.onPropertyChange($scope.custompropImageComp);
            /* Synchronize select image property from desktop to mobile and tablet view */
            if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
            	$scope.syncCustomImageBrowseSelectionInMobileView(componentJSON);
            }
        };
        
        /**
         * Synchronize the select image property to mobile and tablet view from desktop view
         */
        $scope.syncCustomImageBrowseSelectionInMobileView = function(compObj) {
        	 var mobileLayoutObj = $scope.getComponentFromMobileLayout(compObj.objectID);
             if (mobileLayoutObj) {
            	 mobileLayoutObj[mobileLayoutObj.subElement].imageSourceName = $scope.customInputImageName;
            	 mobileLayoutObj[mobileLayoutObj.subElement].imageSourceType = $scope.inputMode;
             }
             var tabletLayoutObj = $scope.getComponentFromTabletLayout(compObj.objectID);
             if (tabletLayoutObj) {
            	 tabletLayoutObj[tabletLayoutObj.subElement].imageSourceName = $scope.customInputImageName;
            	 tabletLayoutObj[tabletLayoutObj.subElement].imageSourceType = $scope.inputMode;
             }
        };
        
        /**
         * Returns image source type
         * @param  {String} imageSourceType The image source type
         * @return {undefined}                 undefined
         */
        $scope.getImageSourceType = function(imageSourceType) {
            return {
                "label": "type : ",
                "type": "text",
                "value": imageSourceType,
                "attributeName": "imageSourceType",
                "propertyName": "Image"
            };
        };

        /**
         * Callback to load image files
         * @param  {Object} filesSelected selected file object
         * @return {undefined}               undefined
         */
        $scope.loadImageFile = function(filesSelected) {
            var imageData = filesSelected.fileData;
            if (imageData != undefined) {
                if (imageData.substring(0, 23).indexOf("jpeg") > -1) {
                    imageData = imageData.split("data:image/jpeg;base64,")[1];
                } else if (imageData.substring(0, 23).indexOf("png") > -1) {
                    imageData = imageData.split("data:image/png;base64,")[1];
                } else {
                	// Do nothing
                }
            }
            $scope.customInputImageName = filesSelected.fileName;
            $scope.custompropImageComp.value = imageData;
        };

        /**
         * Called when property of a component is changed
         * @param {Object} prop The property object
         * @return {undefined} undefined
         */
        $scope.onPropertyChange = function(prop) {
            if (prop.propertyName == "absoluteLayout") {
                $scope.updateDashboardLayoutProperty(prop);
            } else if (prop.propertyName == "Dashboard") {
                $scope.updateDashboardProperty(prop);
            } else {
                $scope.updateObjectWithPropertyValue(prop);
                var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
                if (componentJSON) {
                    if (IsBoolean(componentJSON.showLocked) && (["x", "y", "width", "height"].indexOf(prop.attributeName) > -1) ) {
                        ServiceFactory.showNotification("" + componentJSON.objectName + " is locked", "alert-info", 3000);
                    } else {
                        /** No need to redraw the chart when component is only repositioned **/
                        if (prop.attributeName != "x" && prop.attributeName != "y") {
                        	var OriginalPosition = {};
                        	OriginalPosition = {
                        			"X" : componentJSON.x,
                        			"Y" : componentJSON.y
                        	};
                        	if(IsBoolean($scope.modal.userPreference.defaultSettings.enableMultipleDrag)){
                            	if(IsBoolean($scope.multiSelected)){
                            		componentJSON.x = $("#dcc_" + $scope.modal.selectedComponentId)["0"].offsetLeft;
                            		componentJSON.y = $("#dcc_" + $scope.modal.selectedComponentId)["0"].offsetTop;
                            	}
                        	}
                            $scope.redrawComponent(componentJSON);
                            if(IsBoolean($scope.multiSelected) && IsBoolean($scope.modal.userPreference.defaultSettings.enableMultipleDrag)){
                        		componentJSON.x = OriginalPosition.X;
                        		componentJSON.y = OriginalPosition.Y;
                        	}
                        } else {
                        	var enableMultipleDrag = IsBoolean($scope.modal.userPreference.defaultSettings.enableMultipleDrag) ? (IsBoolean($scope.multiSelected) ? false : true) : true;
                        	/**Added to resolve position change issue in multiple component selection (Same type)*/
                        	if(enableMultipleDrag){
                        		$("#dcc_" + $scope.modal.selectedComponentId).css(((prop.attributeName == "x") ? "left" : "top"), prop.value + "px");
                        	}
                        }
                    }
                    /** UPDATING OBJECT BROWER WINDOW **/
                    var comp = DesignerUtil.prototype.findInArray($scope.componentsList, "objectID", componentJSON["objectID"]);
                    comp["objectName"] = componentJSON["objectName"];
                } else {
                    ServiceFactory.showNotification("Component is not selected", "alert-danger", 3000);
                }
                
                if (prop.attributeName == "objectName") {
                    $scope.syncObjectNameInObjectBrowser(prop.value);
                }
                /** Synchronize absoluteLayout component object property with mobile and tablet view component object property **/
                if(IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout" && (["x", "y", "width", "height"].indexOf(prop.attributeName) == -1)) {
                	$scope.syncComponentPropertyInMobileView("compProperty", componentJSON, prop);
                	$scope.syncComponentPropertyInTabletView("compProperty", componentJSON, prop);
                }
            }
            $scope.modal.updateDashboardStatus(1);
        };
        /**onLockPropertyDisable to be added for disabling the x,y,height & width properties when selected Dashboard is locked*/
        $scope.onLockPropertyDisable = function(prop) {
            var disableEnable = 0;
            if ($scope.modal.selectedDashboard !== undefined && $scope.modal.selectedDashboard !== "") {
                var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
                if (componentJSON !== undefined && IsBoolean(componentJSON.showLocked) && (["x", "y", "width", "height"].indexOf(prop.attributeName) > -1) ) {
                    disableEnable = 1;
                }
            }
            return disableEnable;
        };
        /**
         * Synchronize objectName with object broser window
         * @param {Object} objectName The updated name of the object
         * @return {undefined} undefined
         */
        $scope.syncObjectNameInObjectBrowser = function(objectName) {
            var obc = getSelectedComponentFromObjectBroser();
            obc.objectName = objectName;

            function getSelectedComponentFromObjectBroser() {
                var cliob = $scope.modal.componentListInObjectBrowser,
                    cId = $scope.getSelectedComponents()[0];
                return $.grep(cliob, function(c, i) {
                    return c.objectID == cId;
                })[0];
            }
        };
        /**
         * Synchronize desktop view component property with mobile view component object
         * @param {Object} 	compObj  absoluteLayout component object
         * @param {Object} prop The property object
         */
        $scope.syncComponentPropertyInMobileView = function (type, compObj, prop) {
        	try {
        		var compJson = $scope.getComponentFromMobileLayout(compObj.objectID);
        		if (compJson) {
        			switch (type) {
	        			case "compProperty" :
		        			$scope.updateMVObjectWithDVPropertyValue(compJson, prop);
	        				break;
	        			case "compFieldProperty" :
	        				var compDataset = compJson[compJson.subElement]["DataSet"];
		        			$scope.syncMobileViewCompFieldProperty(compDataset, prop);
	        				break;
	        			case "dataLabelProperty" :
	        				$scope.updateCustomDataLabelPropertiesJsonForMobileView(compJson, prop);
	        				break;
	        			case "indicatorProperty" :
	        				break;
	        			case "alertProperty" :
	        				$scope.syncComponentAlertProperty(compJson, prop);
	        				break;
	        			default :
        			}
	        	}
        	} catch (e) {
        		console.log(e);
        	}
        };
        /**
         * Synchronize desktop view component property with tablet view component object
         * @param {Object} 	compObj  absoluteLayout component object
         * @param {Object} prop The property object
         */
        $scope.syncComponentPropertyInTabletView = function (type, compObj, prop) {
        	try {
        		var compJson = $scope.getComponentFromTabletLayout(compObj.objectID);
        		if (compJson) {
        			switch (type) {
	        			case "compProperty" :
		        			$scope.updateMVObjectWithDVPropertyValue(compJson, prop);
	        				break;
	        			case "compFieldProperty" :
	        				var compDataset = compJson[compJson.subElement]["DataSet"];
		        			$scope.syncMobileViewCompFieldProperty(compDataset, prop);
	        				break;
	        			case "dataLabelProperty" :
	        				 $scope.updateCustomDataLabelPropertiesJsonForMobileView(compJson, prop);
	        				break;
	        			case "indicatorProperty" :
	        				break;
	        			case "alertProperty" :
	        				$scope.syncComponentAlertProperty(compJson, prop);
	        				break;
	        			default :
        			}
        		}
        	} catch (e) {
        		console.log(e);
        	}
        };
        /**
         * Updates the mobile and tablet view component object with changes property value of desktop view
         * @param  {Object} componentJSON  mobile/tablet view object
         * @param  {Object} prop  The property object
         * @return {undefined}      undefined
         */
        $scope.updateMVObjectWithDVPropertyValue = function(componentJSON, prop) {
            if (componentJSON) {
                if (prop["propertyName"] == "Object") {
                    componentJSON[prop["attributeName"]] = prop["value"];
                } else {
                    /** Some of the values are in the form of JavaScript Object **/
                    if (typeof(prop["value"]) == "object") {
                        if (prop["type"] == "gradient") {
                            var _gString = prop["value"]["gColor_1"] + "," + prop["value"]["gColor_1"];
                            /** removed two color bars from UI, internally it is copying the selected color as 2nd color **/
                            //var _gString = prop[ "value" ][ "gColor_1" ] + "," + prop[ "value" ][ "gColor_2" ];
                            DesignerUtil.prototype.getInnerObjectbyString(componentJSON, prop["propertyName"])[prop["attributeName"]] = _gString;
                        } else {
                            if ((prop["type"] == "date")||(prop["type"] == "customTextBoxForToolTip"))
                                DesignerUtil.prototype.getInnerObjectbyString(componentJSON, prop["propertyName"])[prop["attributeName"]] = prop["value"];
                            else
                                DesignerUtil.prototype.getInnerObjectbyString(componentJSON, prop["propertyName"])[prop["attributeName"]] = prop["value"]["key"];
                        }
                    } else {
                        DesignerUtil.prototype.getInnerObjectbyString(componentJSON, prop["propertyName"])[prop["attributeName"]] = prop["value"];
                    }
                }
            }
        };
        $scope.syncMobileViewCompFieldProperty = function (compObjDataset, prop) {
        	if (compObjDataset) {
	        	var fields = compObjDataset.Fields;
				for (var i = 0; i < fields.length; i++) {
					if (fields[i][$scope.datasetDesignProperties[$scope.component.designData.class]["name"]] === $scope.selectedField.name && fields[i]["Type"] === $scope.selectedField.fieldJson.Type) {
						if (typeof(prop["value"]) === "object" && prop["value"] !== null) {
							fields[i][prop.attributeName] = prop.value.key;
						} else {
							fields[i][prop.attributeName] = prop.value;
							if($scope.selectedField.fieldJson.Type=="Category" && prop.attributeName=="Color"){
								$scope.updateDefaultCategoryColorIndicator(prop.value);
							}
						}
					}
				}
        	}
        };
		/** Synchronize the absoluteLayout component object script and group property in mobile and tablet view**/
        $scope.syncComponentScriptingandGroupingProperty = function (compObj) {
        	var absoluteLayoutObj = angular.copy(DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object, "objectID", compObj.objectID));
        	if (compObj.objectID == absoluteLayoutObj.objectID) {
	        	compObj["groupings"] = absoluteLayoutObj["groupings"];
	        	compObj["variable"] = absoluteLayoutObj["variable"];
        	}
        };
		/** Synchronize the absoluteLayout component object datalabel property in mobile and tablet view**/
        $scope.updateCustomDataLabelPropertiesJsonForMobileView = function(compObj, prop) {
		    for (var i = 0; i < compObj[compObj.subElement].DataSet.Fields.length; i++) {
		        if (IsBoolean(compObj[compObj.subElement].DataSet.Fields[i].Name == $scope.selectedField.name)) {
		        	compObj[compObj.subElement].DataSet.Fields[i].DataLabelCustomProperties = $scope.selectedField.fieldJson.DataLabelCustomProperties;
		        }
		    }
		};
		/** Synchronize the alert JSON when alert Properties changed or OK button clicked from model in mobile and tablet view**/
		$scope.syncComponentAlertProperty = function (compObj, prop) {
			if (compObj[compObj.subElement].Alerts.AlertColumn === undefined){
				compObj[compObj.subElement].Alerts["AlertColumn"] = [];
			}
			var alertColumns = compObj[compObj.subElement].Alerts.AlertColumn;
			var flag = false;
			for (var i = 0; i < alertColumns.length; i++) {
				if (alertColumns[i].name === $scope.alertJson.name) {
					if (IsBoolean($scope.alertJson.showAlert)){
						compObj[compObj.subElement].Alerts.AlertColumn.splice(i, 1, $scope.alertJson);
					}else{
						compObj[compObj.subElement].Alerts.AlertColumn.splice(i, 1);
					}
					flag = true;
					break;
				}
			}
			if (!IsBoolean(flag) && IsBoolean($scope.alertJson.showAlert)){
				compObj[compObj.subElement].Alerts.AlertColumn.push($scope.alertJson);
			}
		};
        /**
         * Updates the dashboard layout properties
         * @param  {Object} prop The property object
         * @return {undefined}      undefined
         */
        $scope.updateDashboardLayoutProperty = function(prop) {
            var comp = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType];
            if (prop["attributeName"] == "resolution") {
                if (prop.value.value != "Auto") {
                    var res = prop.value.key.split("x");
                    comp.width = res[0];
                    comp.height = res[1];
                } else {
                    comp.width = $(".rw-container").get(0).clientWidth - 10;
                    comp.height = $(".rw-container").get(0).clientHeight - 10;
                }
            }
            if (prop["attributeName"] === "designerTheme") {
            	
            	$scope.themeProp = prop;
            	$scope.newDesignerTheme = prop.value.key;
                $scope.showModelPopup("changeThemeDialog");
                
                /*$scope.applyDesignerTheme(prop.value.key);*/
            }
            comp[prop["attributeName"]] = (typeof(prop["value"]) == "object") ? prop["value"]["key"] : prop["value"];
            /** setDashboardCSS() is written in main menu controller **/
            $scope.setDashboardCSS($scope.modal.userPreference);
        };
        
        $scope.updateThemeDesigner = function(){
        	$scope.hideModelPopup('changeThemeDialog');
        	$scope.applyDesignerTheme($scope.newDesignerTheme);
        }
        
        $scope.resetThemeDesigner = function(){
        	var defaultSelectedTheme = $scope.selectedTheme[$scope.getActiveDashboardId()];
        	$scope.newDesignerTheme = defaultSelectedTheme;
            for(var i=0; i<$scope.themeProp.options.length; i++)
            	{
            	if(defaultSelectedTheme == $scope.themeProp.options[i].key){
            		$scope.themeProp.value = $scope.themeProp.options[i];
            		}
            	}
        }
        /**
         * Updates the dashboard properties
         * @param  {Object} prop The property object
         * @return {undefined}      undefined
         */
        $scope.updateDashboardProperty = function(prop) {
            var comp = $scope.modal.selectedDashboard.json.Dashboard;
            if (prop["attributeName"] == "LanguageMapping.mappingId") {
            	$scope.modal.selectedDashboard.json.Dashboard.LanguageMapping.mappingId = prop.mappingId;
            	$scope.modal.selectedDashboard.json.Dashboard.LanguageMapping.mappingName = prop.mappingName;
            }else if (prop["attributeName"].indexOf("LanguageMapping.") > -1) {
            	var attr = prop["attributeName"].split(".")[1];
            	$scope.modal.selectedDashboard.json.Dashboard.LanguageMapping[attr] = prop.value;
            }else{
            	comp[prop["attributeName"]] = (typeof(prop["value"]) == "object") ? prop["value"]["key"] : prop["value"];
            }
        };
        
        /**
         * Adds the settings buttons to the component
         * @param {String}  cId                The component id
         * @param {Boolean} isDataSetAvailable Flag for dataset
         * @param {Boolean}  enableScript       Flag for script
         */
        $scope.addSettingBtns = function(cId, isDataSetAvailable, enableScript) {
            var setBtnTop = 0;
            $scope.addPropertySettingBtn(cId, setBtnTop);
            setBtnTop += 25;
            if (isDataSetAvailable != undefined && isDataSetAvailable != false && isDataSetAvailable != "false") {
                $scope.addDatasetSettingBtn(cId, setBtnTop);
                setBtnTop += 25;
            }
            setBtnTop += 25;
            if (IsBoolean(enableScript)) {
                $scope.addFnBtn(cId, setBtnTop);
            }
            $scope.addRemoveBtn(cId, setBtnTop);
        };
        $scope.addDblClickEvent = function(cId) {
        	$("#draggableDiv" + cId).on("dblclick", function(event) {
            	var compId = global["componetIDPrefix"] + event.currentTarget.id.split(global["componetIDPrefix"])[1];
            	if ($scope.isSelectedComponent(cId)) {
                    event.stopPropagation();
                } else {
                    $scope.selectComponent(cId);
                }
            	// Added for prevent open property panel when component is locked on dbl click
            	var cObj = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, "objectID", cId);
                var showLock = cObj["showLocked"];
                if (!showLock) {
            	   $scope.executeAction(compId, "openPropWindow");
                }
            });
        }

        /**
         * Adds property settings button to the component
         * @param {String} cId The component id
         * @param {undefined} top undefined
         */
        $scope.addPropertySettingBtn = function(cId, top) {
            var _content = "<div class=\"comp-settings-btn\" id=\"propCtrlDiv" + cId + "\">" +
                "<img id=\"propCtrlBtn" + cId + "\" src=\"./resources/images/svg/Properties.svg\" title=\"Properties\" />" +
                "</div>";
            $("#cbc_" + cId).append(_content);
            $("#propCtrlDiv" + cId).css({
                top: top + "px",
                display: "block"
            }).on("click", function(event) {
                var cId = global["componetIDPrefix"] + event.target.id.split(global["componetIDPrefix"])[1];
                if ($scope.isSelectedComponent(cId)) {
                    event.stopPropagation();
                } else {
                    $scope.selectComponent(cId);
                }
                $scope.executeAction(cId, "openPropWindow");
                /*Added to initialize datePicker component changeMonth and changeYear property */
                var comp = $scope.getComponentbyId(cId);
                if (comp["componentType"] == "date_picker") {
                	$scope.initializeDatePickerCalendarProperty();
                }
            }).on("dblclick", function(event) {
                event.stopPropagation();
            });
        };

        /**
         * Adds dataset settings button to the component
         * @param {String} cId The component id
         * @param {undefined} top undefined
         */
        $scope.addDatasetSettingBtn = function(cId, top) {
            var _content = "<div class=\"comp-settings-btn\" id=\"dataCtrlDiv" + cId + "\">" +
                "<img id=\"dataCtrlBtn" + cId + "\" src=\"./resources/images/svg/data_settings.svg\" title=\"Dataset\"/>" +
                "</div>";
            $("#cbc_" + cId).append(_content);
            $("#dataCtrlDiv" + cId).css({
                top: top + "px",
                display: "block"
            }).on("click", function(event) {
                var cId = global["componetIDPrefix"] + event.target.id.split(global["componetIDPrefix"])[1];
                if ($scope.isSelectedComponent(cId)) {
                    event.stopPropagation();
                } else {
                    $scope.selectComponent(cId);
                }
                $scope.executeAction(cId, "openDatasetWindow");
            }).on("dblclick", function(event) {
                event.stopPropagation();
            });
        };

        /**
         * Adds script button to the component
         * @param {String} cId The component id
         * @param {undefined} top undefined
         */
        $scope.addFnBtn = function(cId, top) {
            var _content = "<div class=\"comp-settings-btn\" id=\"fnDiv" + cId + "\">" +
                "<img id=\"fnBtn" + cId + "\" src=\"./resources/images/svg/f_x.svg\" title=\"Script on Load\"/>" +
                "</div>";
            $("#cbc_" + cId).append(_content);
            $("#fnDiv" + cId).css({
                top: top + "px",
                display: "block"
            }).on("click", function(event) {
                var cId = global["componetIDPrefix"] + event.target.id.split(global["componetIDPrefix"])[1];
                if ($scope.isSelectedComponent(cId)) {
                    event.stopPropagation();
                } else {
                    $scope.selectComponent(cId);
                }
                $scope.executeAction(cId, "openFnWindow");
            }).on("dblclick", function(event) {
                event.stopPropagation();
            });
        };

        /**
         * Adds delete button to the component
         * @param {String} cId The component id
         * @param {undefined} top undefined
         */
        $scope.addRemoveBtn = function(cId, top) {
            var _content = "<div class=\"comp-settings-btn\" id=\"compRemoveDiv" + cId + "\">" +
                "<img id=\"compRemoveBtn" + cId + "\" src=\"./resources/images/svg/Close.svg\" title=\"Remove\"/>" +
                "</div>";
            $("#cbc_" + cId).append(_content);
            $("#compRemoveDiv" + cId).css({
                top: top + "px",
                display: "block"
            }).on("click", function(event) {
                var cId = global["componetIDPrefix"] + event.target.id.split(global["componetIDPrefix"])[1];
                if ($scope.isSelectedComponent(cId)) {
                    event.stopPropagation();
                } else {
                    $scope.selectComponent(cId);
                }
                var showLock = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object, "objectID", cId)["showLocked"];
                if (showLock != true) {
                    $scope.executeAction(cId, "removeComponent");
                }
            }).on("dblclick", function(event) {
                event.stopPropagation();
            });
        };

        /**
         * Adds template
         * @param  {String} cId The component id
         * @param  {Number} top The top position
         * @return {undefined}     undefined
         */
        $scope.addtempBtn = function(cId, top) {
            var _content = "<div class=\"comp-settings-btn\" id=\"tempDiv" + cId + "\">" +
                "<img id=\"tempBtn" + cId + "\" src=\"./resources/images/svg/showAll.svg\" title=\"Script -on-change\"/>" +
                "</div>";
            $("#cbc_" + cId).append(_content);
            $("#tempDiv" + cId).css({
                    width: "20px",
                    height: "20px",
                    top: top + "px",
                    left: "100%",
                    border: "1px solid #816666",
                    cursor: "pointer",
                    display: "none"
                })
                .on("click", function(event) {
                    $scope.alignVerticalLeft();
                })
                .on("dblclick", function(event) {
                    event.stopPropagation();
                });
        };

        /**
         * Click handler for settings buttons
         * @param  {String} cId    The component id
         * @param  {String} action Action specified
         * @return {undefined}        undefined
         */
        $scope.executeAction = function(cId, action) {
            switch (action) {
                case "openPropWindow":
                    $scope.createPropertyPalette(cId);
                    $scope.rcc = cId;
                    break;
                case "openDatasetWindow":
                    $scope.toggleDatasetPalette(cId);
                    $scope.invokeDatasetpaletteUpdation(cId);
                    $scope.rcc = cId;
                    break;
                case "removeComponent":
                    var sCid = $scope.modal.selectedComponentId;
                    if (sCid) {
                        $scope.doYouWantToDelete();
                    }
                    break;
                case "openFnWindow":
                    var compObj = $scope.getComponentbyId(cId);
                    $scope.toggleVariableWindow("0");
                    $scope.setSelectedVariable(null, compObj, "Component");
                    $scope.rcc = cId;
                    break;
                case "duplicateComponent":
                    $scope.duplicateComponent(cId);
                    break;
                default:
                    break;
            }
        };

        /**
         * Creates and adds container to the component
         * @param {String} cId            The component id
         * @param {Number} left           Left position
         * @param {Number} top            Top position
         * @param {Number} height         Height
         * @param {Number} width          Width
         * @param {Number} assignedZIndex Assigned z-index
         * @returns {undefined} undefined
         */
        $scope.addDesignerComponentContainer = function(cId, left, top, height, width, assignedZIndex) {
            var
                zIndex = (assignedZIndex !== undefined)?assignedZIndex:$scope.getMaxZindex(),
                $selectedDashboard = $("#" + $scope.modal.selectedDashboard.id),
                $resizableHandle = null,
                $dccContainer = null,
                $xDcc = $("#dcc_" + cId),
                $cDcc = $("<div></div>"),
                $cCbc = $("<div></div>"),
                dccClickHandler = function(evt) {
                    evt.stopPropagation();
                    $(".c-group").removeClass("selected-group");
                    $("#designerCxtMenuContainer .dropdown-menu").hide();
                    $scope.handleComponentSelection(cId, evt.ctrlKey || evt.metaKey);
                    
                    /**If property palette is visible, user can open other component's property palette by single click **/
                	if(IsBoolean($scope.isBoxVisible)){
                		$scope.executeAction(cId, "openPropWindow");
                		/*Added for initialize datePicker comp property when user switch comp property palette by using single click */
                		var comp = $scope.getComponentbyId(cId);
                        if (comp["componentType"] == "date_picker") {
                        	$scope.initializeDatePickerCalendarProperty();
                        }
                	}
                };
//                var dccMouseMoveHandler = function(evt) {},
//                var dccMouseOutHandler = function(evt) {};
            while ($scope.isAssignedZindex(zIndex)) {
            	zIndex++;
            }
            if ($xDcc.length && assignedZIndex == undefined) {
                zIndex = $xDcc.zIndex();
            }

            $cCbc.attr("id", "cbc_" + cId).
            addClass("cbc");

            $cDcc.attr("id", "dcc_" + cId).
            addClass("bizvizComponent").
            css({
                left: $scope.isSelectedDashboardResponsive() ? "0" : left + "px",
                top: $scope.isSelectedDashboardResponsive() ? "0" : top + "px",
                height: $scope.isSelectedDashboardResponsive() ? "100%" : height * 1 + 4 + "px",
                width: $scope.isSelectedDashboardResponsive() ? "100%" : width * 1 + 4 + "px"
            }).
            on("click", dccClickHandler).
            append($cCbc);

            if ($scope.isSelectedDashboardResponsive()) {
                $dccContainer = $("#" + $scope.chartContainerId);
                $scope.cSpaceMap[$scope.chartContainerId] = false;
                $cDcc.css("position", "relative");
            } else {
                $dccContainer = $selectedDashboard;
                $resizableHandle = $scope.createResizableHandles();
                $cDcc.css("z-index", zIndex).append($resizableHandle);
            }

            if ($xDcc.length) {
                $xDcc.remove();
            }
            $dccContainer.append($cDcc);
            return $cDcc;
        };

        /**
         * Updates container dimentions
         * @param  {String} cId            The component id
         * @param  {Number} left           Left position
         * @param  {Number} top            Top position
         * @param  {Number} height         Height
         * @param  {Number} width          Width
         * @param  {Number} assignedZIndex Assigned z-index
         * @return {undefined}                undefined
         */
        $scope.updateComponentContainerSizeAndCoordinates = function(cId, left, top, height, width) {
            $("#dcc_" + cId).css({
                left: left + "px",
                top: top + "px",
                height: height * 1 + $scope.modal.userPreference.compSelcOpts["thickness"] * 2 + "px",
                width: width * 1 + $scope.modal.userPreference.compSelcOpts["thickness"] * 2 + "px"
            });
        };

        /**
         * Displays the settings buttons
         * @param  {String} cId The component id
         * @return {undefined}     undefined
         */
        $scope.showSettingsBtn = function(cId) {
        	/** Added to disable component setting buttons in mobile and tablet view **/
        	if ($scope.modal.layoutType == "AbsoluteLayout") {
	            $("#dcc_" + cId + " #cbc_" + cId).css({
	                display: "block"
	            });
        	}
        };

        /**
         * Hides the settings buttons
         * @param  {String} cId The component id
         * @return {undefined}     undefined
         */
        $scope.hideSettingsBtn = function(cId) {
            $("#dcc_" + cId + " #cbc_" + cId).css({
                display: "none"
            });
        };

        /**
         * Displays the resizable handles
         * @param  {String} cId The component id
         * @return {undefined}     undefined
         */
        $scope.showResizableHandles = function(cId) {
            $("#dcc_" + cId + " .ui-resizable-handle").css({
                display: "block"
            });
        };

        /**
         * Hides the resizable handles
         * @param  {String} cId The component id
         * @return {undefined}     undefined
         */
        $scope.hideResizableHandles = function(cId) {
            $("#dcc_" + cId + " .ui-resizable-handle").css({
                display: "none"
            });
        };
        
        /** Initialize datePicker component changeMonth and changeYear property */
        $scope.initializeDatePickerCalendarProperty = function() {
        	$(".datePickerInProperty").each(function() {
                $(this).datepicker({
                    changeMonth: true,
                    changeYear: true
                });
            });
        };
        
        /**
         * Creates the resizable handles
         * @return {undefined} undefined
         */
        $scope.createResizableHandles = function() {
            var
                handleResizableHandlesClick = function(evt) {
                    evt.stopPropagation();
                },
                $resizableHandles = $("<div class=\"wrh ui-resizable-handle corner-handle ui-resizable-nw nw-handle\"></div>" +
                    "<div class=\"wrh ui-resizable-handle ui-resizable-ne corner-handle ne-handle\"></div>" +
                    "<div class=\"wrh ui-resizable-handle ui-resizable-sw corner-handle sw-handle\"></div>" +
                    "<div class=\"wrh ui-resizable-handle ui-resizable-se corner-handle se-handle\"></div>" +
                    "<div class=\"wrh ui-resizable-handle ui-resizable-n n-handle\"></div>" +
                    "<div class=\"wrh ui-resizable-handle ui-resizable-s s-handle\"></div>" +
                    "<div class=\"wrh ui-resizable-handle ui-resizable-e e-handle\"></div>" +
                    "<div class=\"wrh ui-resizable-handle ui-resizable-w w-handle\"></div>")
                .on("click", handleResizableHandlesClick).css("border-color", $scope.modal.userPreference.compSelcOpts.color);
            return $resizableHandles;
        };

        /**@description Draw the component 
         * @param cConfigJson - component configuration, componentClassName 
        **/
        $scope.drawComponent = function(cConfigJson, cClass) {
           if(cConfigJson["Properties"]["Object"]["themeType"] != undefined && cConfigJson["Properties"]["Object"]["themeType"] !== "default-theme"){
				var colors = $scope.designerThemeInfo[cConfigJson["Properties"]["Object"]["themeType"]]["datasetColors"];
				if(cConfigJson["Fields"] !== undefined){
					cConfigJson["Fields"].forEach(function(obj, ind){
						if(obj.Color !== undefined && colors !== undefined && colors[ind] !== undefined){
							obj.Color = colors[ind];
						}
					})
				}
			 }
            var

                aDbId = $scope.getActiveDashboardId(),
                $aDb = $("#" + aDbId),
                zIndex = "inherit",
                cProperty = cConfigJson["Properties"],
                cData = cConfigJson["Data"],
                cFields = cConfigJson["Fields"],
                c = cProperty["Object"],
                cName = c.objectName,
                datasetEnabled = c.isDataSetAvailable,
                scriptEnabled = c.enableScript,
                rcJsonList = $scope.modal.rawComponentJSONlist,
                csThickness = $scope.modal.userPreference.compSelcOpts["thickness"],
                sName = c["shortName"],
                dropPos = $scope.dropCoordinates,
                //fix#20765.3
                leftOffset = $aDb.parent().parent().offset().left,
                topOffset = $aDb.parent().parent().offset().top,
                //===========
                height = c.height,
                width = c.width,
                updateDesignerConfig = function() {
                    $scope.AddComponentJsonToDashboardJson(cConfigJson);
                    cName = cConfigJson.Properties.Object.objectName;
                    $scope.AddInComponentObjectList(cId, cObj)
                    $scope.modal.selectedComponentId = cId;
                    $scope.handleComponentSelection(cId, false, false, true);
                    /** component should be registerInHistory after design data in component object bcz of that registerInHistory() commented here */
                   //$scope.registerInHistory("add", c);
                    ServiceFactory.showNotification(cName + " has been added", "alert-info", 3000);
                },
                cId = null,
                refId = null,
                cObj = null,
                left = null,
                top = null,
                responsive = null,
                $cContainer = null;
            try {
                if ($scope.cSpaceMap[$scope.chartContainerId]) {
                    ServiceFactory.showNotification("Can not add more than one component in a container", "alert-danger", 3000);
                    return false;
                }
                if (!rcJsonList[cClass]) {
                    rcJsonList[cClass] = JSON.parse(JSON.stringify(cConfigJson));
                }
                /** When deleted component redraw from register History(Undo/Redo), comp. coordinates should be same.  */
                if ($scope.modal.currentHistoryProperties().skipHistoryRegister) {
                    cId = cConfigJson.Properties.Object.objectID;
                    refId = cConfigJson.Properties.Object.referenceID; 
                    left = dropPos["x"];
                    top = dropPos["y"];
                } else {
                     cId = $scope.modal.getUniqueComponentID();
                     refId = $scope.modal.getUniqueReference(sName);
                     left = dropPos["x"] - leftOffset;
                     top = dropPos["y"] - topOffset;
                }
                $cContainer = $scope.addDesignerComponentContainer(cId, left, top, height, width);
                cObj = ReflectUtil.newInstance(cClass, $cContainer, zIndex);
                cObj.m_designMode = true;
                c["objectID"] = cId;
                c["referenceID"] = refId;
                c["objectName"] = refId;
                c["showLocked"] = false;
                c["unShowHidden"] = false;

                if ($scope.isSelectedDashboardResponsive()) {
                    c["parent"] = $scope.chartContainerId;
                    c["bootstrap"] = true;
                    responsive = c.bootstrap;
                }
                c["x"] = 0;
                c["y"] = 0;
                cObj.setProperty(cProperty);
                c["x"] = left;
                c["y"] = top;
                if (cData && cFields) {
                    cObj.setDataProvider(cData);
                    cObj.setFields(cFields);
                }
                if (IsBoolean($scope.isDuplicate) && c["themeType"] === "default-theme") {
                	$scope.updatedJson = ($scope.updatedJson === undefined)?{}:$scope.updatedJson;
                	$scope.updatedJson[c["objectID"]] = getDuplicateObject(c);
                }
                cObj.draw();
                $scope.addSettingBtns(cId, datasetEnabled, scriptEnabled);
                $scope.addDblClickEvent(cId);
                if (!responsive) {
                	$scope.initDragComponent(cObj);
                    $scope.initResizeComponent(cObj);
                } else {
                    $scope.cSpaceMap[$scope.chartContainerId] = true;
                }
                c["x"] -= csThickness;
                c["y"] -= csThickness;
                if (IsBoolean(c.showLocked)) {
                    $scope.lockComponent(false, {
                        "lockComponent": true,
                        "objectID": cId
                    });
                }
                if (IsBoolean(c.unShowHidden)) {
                    $scope.hideComponent(false, {
                        "hideComponent": true,
                        "objectID": cId
                    });
                }
                updateDesignerConfig();
            } catch (e) {
                console.error(e);
            }
        };

        /**
         * Re-Renders the active dashboard
         * @return {undefined} undefined
         */
        $scope.reDrawActiveDashboard = function() {
            var
                actDasJson = $scope.modal.selectedDashboard.json.Dashboard,
                actDasCmpobjs = actDasJson.AbsoluteLayout.Object,
                cJson = null;
            try {
                for (var i = 0; i < actDasCmpobjs.length; i++) {
                    cJson = actDasCmpobjs[i];
                    $scope.redrawComponent(cJson);
                }
            } catch (e) {
                console.error(e);
            }
        };

        /**
         * Re-Draws the component after changing property
         * @param  {Object} cJson  The component JSON
         * @param  {Number} zIndex The z-index
         * @return {undefined}        undefined
         */
        $scope.redrawComponent = function(cJson, zIndex) {
            var
                cId = cJson.objectID,
                left = cJson.x,
                top = cJson.y,
                height = cJson.height,
                width = cJson.width,
                c = null,
                cObj = null,
                cName = null,
                cClass = null,
                rcJson = null;
            try {
                c = $scope.getComponentbyId(cId);
                cName = c["componentType"];
                cClass = $scope.modal.propertyJsonList[cName]["Info"][0]["class"];
                rcJson = $scope.getRawJSONbyClass(cClass);
                if(rcJson.Fields !== undefined)
                	rcJson.Fields = $scope.modal.selectedDashboard.componentObjectList[cJson.objectID].m_fieldsJson
                cObj = $scope.getComponentObjectFromComponentObjectList(cId);
                cObj.m_designMode = true;
                cObj.m_objectid = cId;
                c.x = 0;
                c.y = 0;
                /** To prevent multiple times drawing of grid components when component is resied in designer **/
                cObj.setIsResizedInDesigner((c.width != cObj.m_width || c.height != cObj.m_height));
                cObj.ParseJsonAttributes(c, cObj);
                c.x = left;
                c.y = top;
                if (rcJson.Data && rcJson.Fields) {
                    cObj.setDataProvider(rcJson.Data);
                    cObj.setFields(rcJson.Fields);
                }
                if (!$scope.modal.currentHistoryProperties().skipHistoryRegister && $scope.modal.layoutType == "AbsoluteLayout") {
                    $scope.registerInHistory("change", c);
                }
                if (!$scope.isSelectedDashboardResponsive()) {
                    $scope.updateComponentContainerSizeAndCoordinates(cId, left, top, height, width);
                } else {
                    cObj.initializeForBootstrap();
                }
                cObj.setDraggableDivSize();
            	cObj.setDraggableDivShadow();
                cObj.setDraggableCanvasSize();
                cObj.reSetCanvasCoordinates();
                cObj.draw();
                if (IsBoolean(cJson.showLocked)) {
                    $scope.lockComponent(false, {
                        "lockComponent": true,
                        "objectID": cId
                    }, true);
                }
                if (IsBoolean(cJson.unShowHidden)) {
                    $scope.hideComponent(false, {
                        "hideComponent": true,
                        "objectID": cId
                    }, true);
                }
            } catch (e) {
                console.error(e);
            }
        };
           
        /**
         * Updates the component object with changes property value
         * @param  {Object} prop The property object
         * @return {undefined}      undefined
         */
        $scope.updateObjectWithPropertyValue = function(prop) {
        	$scope.updatedJson = ($scope.updatedJson === undefined)?{}:$scope.updatedJson;
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            if (componentJSON) {
                if (prop["propertyName"] == "Object") {
                    componentJSON[prop["attributeName"]] = prop["value"];
                } else {
                    /** Some of the values are in the form of JavaScript Object **/
                    if (typeof(prop["value"]) == "object") {
                        if (prop["type"] == "gradient") {
                            var _gString = prop["value"]["gColor_1"] + "," + prop["value"]["gColor_1"];
                            /** removed two color bars from UI, internally it is copying the selected color as 2nd color **/
                            //var _gString = prop[ "value" ][ "gColor_1" ] + "," + prop[ "value" ][ "gColor_2" ];
                            DesignerUtil.prototype.getInnerObjectbyString(componentJSON, prop["propertyName"])[prop["attributeName"]] = _gString;
                        } else {
                            if ((prop["type"] == "date")||(prop["type"] == "customTextBoxForToolTip"))
                                DesignerUtil.prototype.getInnerObjectbyString(componentJSON, prop["propertyName"])[prop["attributeName"]] = prop["value"];
                            else {
								try{
                            		DesignerUtil.prototype.getInnerObjectbyString(componentJSON, prop["propertyName"])[prop["attributeName"]] = prop["value"]["key"];
 								} catch(e){
									console.log("The key and the value are null");
								}      
                            }
                        }
                    } else {
                        DesignerUtil.prototype.getInnerObjectbyString(componentJSON, prop["propertyName"])[prop["attributeName"]] = prop["value"];
                    }
                    
                    /**saving updated json, when component properties has been changed**/
                    if (componentJSON.themeType === "default-theme") {
                    	$scope.updatedJson[componentJSON.objectID] = getDuplicateObject(componentJSON);
                    } else {
                    	/**Remove if-else, when implemented for all themes and write above commented code**/
                    	var filePath = (componentJSON.themeType !== "default-theme")?"./resources/bizvizchart-themes/" + componentJSON.themeType + "/themeConfig.data":"./resources/bizvizchart-themes/" + componentJSON.themeType + "/" + componentJSON.designData.type + "/"+componentJSON.designData.class+".data";
                        var cachedData = $scope.getHttpCachedData(filePath);
                        if ($scope.updatedJson[componentJSON.objectID] === undefined) {
                        	//var defaultfilePath = "./resources/bizvizchart-themes/default-theme/" + componentJSON.designData.type + "/"+componentJSON.designData.class+".data";
                        	/**DAS-594 while open dashboard component data loaded using allComponents.data  */
                        	var defaultfilePath = "./resources/bizvizchart-themes/default-theme/AllComponentsData.data";
                        	var defcachedData = $scope.getHttpCachedData(defaultfilePath);
							if(defcachedData != undefined)
                        	$scope.updatedJson[componentJSON.objectID] = (JSON.parse(defcachedData[1]))[componentJSON.designData.class][componentJSON.designData.class].Properties.Object;
                        }
                        if (cachedData && cachedData[0] == 200) {
                        	var themeJson = (componentJSON.themeType !== "default-theme")?JSON.parse(cachedData[1])["DashboardObjects"]:JSON.parse(cachedData[1]);
                        	var a = $scope.configureJson(getDuplicateObject($scope.updatedJson[componentJSON.objectID]),getDuplicateObject(componentJSON),themeJson[componentJSON.designData.class].Properties.Object,prop);
                        	$scope.updatedJson[componentJSON.objectID] = a;
                        }
                    }
                }
            }
        };
        
        /** Returns the JSON of specified class **/
        $scope.configureJson = function(existingJson,compJSON,themeJson,prop) {
        	var arr = (prop.propertyName).split(".");
        	if (arr.length == 1) {
        		if ((themeJson[arr[0]]).hasOwnProperty(prop.attributeName)) {
        			// Do nothing
        		} else {
        			existingJson[arr[0]][prop.attributeName] = compJSON[arr[0]][prop.attributeName];
        		}
     	   	} else {
     	   		existingJson[arr[0]][arr[1]][prop.attributeName] = compJSON[arr[0]][arr[1]][prop.attributeName];
     	   	}
        	return existingJson;
        };

        /**
         * Returns the JSON of specified class
         * @param  {String} componentClass Component's class name
         * @return {object}                The component object
         */
        $scope.getRawJSONbyClass = function(componentClass) {
            return $scope.modal.rawComponentJSONlist[componentClass];
        };

        /**
         * Returns component object by component id
         * @param  {String} id The component id
         * @return {Object}    The component object
         */
        $scope.getComponentbyId = function(id) {
            //			return DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object, "objectID", "Obj."+id);
            return DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, "objectID", id);
        };
        
        /**
         * Returns component object by component reference id
         * @param  {String} rID The reference id
         * @return {Object}    The component object
         */
        $scope.getComponentbyReferenceId = function(rID) {
            return DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, "referenceID", rID);
        };
        
        /**
         * Returns mobile layout component object by component id
         * @param  {String} id The component id
         * @return {Object}    The component object
         */
        $scope.getComponentFromMobileLayout = function(id) {
        	if ($scope.modal.selectedDashboard.json.Dashboard.MobileLayout) {
        		return DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard.MobileLayout.Object, "objectID", id);
        	} else {
        		return undefined;
        	}
        };
        /**
         * Returns tablet layout component object by component id
         * @param  {String} id The component id
         * @return {Object}    The component object
         */
        $scope.getComponentFromTabletLayout = function(id) {
        	if ($scope.modal.selectedDashboard.json.Dashboard.TabletLayout) {
        		return DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard.TabletLayout.Object, "objectID", id);
        	} else {
        		return undefined;
        	}
        };

        /**
         * Returns dashboard object by timestamp id
         * @param  {String} tDid The timestamp id
         * @return {Object}      The dashboard object
         */
        $scope.getDashboardByTimeStampId = function(tDid) {
            return DesignerUtil.prototype.findInArray($scope.modal.dashboards, "id", tDid)["json"]["Dashboard"];
        };

        /**
         * It'll remove the component from the dashboard safely
         * @param  {String} id The compoennt id
         * @return {undefined}    undefined
         */
		$scope.removeComponentbyId = function(id) {
			var component = $scope.getComponentbyId(id),
				$dCc = $("#dcc_" + id),
				cContainerId = $dCc.parent().attr("id"),
				compObj = null,
				removedObject = null,
				groupings = [],
				Mobpinned = false,
				Tabpinned = false;

			var Moblayout = $scope.modal.selectedDashboard.json.Dashboard.MobileLayout?.Object || [];
			if (Moblayout && Moblayout.length > 0) {
				for (var n = 0; n < Moblayout.length; n++) {
					var mobileViewCompObj = Moblayout[n];
					if (mobileViewCompObj && typeof (mobileViewCompObj) === "object" && mobileViewCompObj.objectID == id) {
						Mobpinned = Moblayout[n].isPined;
					}
				}
			}
			var Tablayout = $scope.modal.selectedDashboard.json.Dashboard.TabletLayout?.Object || [];
			if (Tablayout && Tablayout.length > 0) {
				for (var n = 0; n < Tablayout.length; n++) {
					var tabletViewCompObj = Tablayout[n];
					
					if (tabletViewCompObj && typeof (tabletViewCompObj) === "object" && tabletViewCompObj.objectID == id) {
						Tabpinned = Tablayout[n].isPined;
					}
				}
			}
			if (IsBoolean(Mobpinned) || IsBoolean(Tabpinned)) {
				//ServiceFactory.showNotification("Cannot remove:component(s) are pinned on mobile/tablet.", "alert-danger", 3000);
				return "pinned";
			} else {
				for (var n = 0; n < $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object.length; n++) {
					compObj = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object[n];
					if (compObj && typeof (compObj) === "object" && compObj.objectID == id) {
						if (compObj.hasOwnProperty("groupings")) {
							groupings = compObj["groupings"].split(",");
							for (var i = 0; i < groupings.length; i++) {
								$scope.removeComponentFromDashboardGroup(id, groupings[i]);
							}
						}
						removedObject = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object.splice(n, 1);
						/** To remove component default values **/
						$scope.populateGvarDefaultValueList();
						ServiceFactory.showNotification(component.objectName + " has been deleted", "alert-info", 3000);
						removedObject = null;
						break;
					}
				}
				/** To remove component from tablet view layout **/
				var tabletViewObj = $scope.modal.selectedDashboard.json.Dashboard.TabletLayout;
				if (tabletViewObj && tabletViewObj.Object.length > 0) {
					var removedTabletViewObject = null;
					for (var n = 0; n < $scope.modal.selectedDashboard.json.Dashboard.TabletLayout.Object.length; n++) {
						var tabletViewCompObj = $scope.modal.selectedDashboard.json.Dashboard.TabletLayout.Object[n];
						if (tabletViewCompObj && typeof (tabletViewCompObj) === "object" && tabletViewCompObj.objectID == id) {
							removedTabletViewObject = $scope.modal.selectedDashboard.json.Dashboard.TabletLayout.Object.splice(n, 1);
							removedTabletViewObject = null;
							break;
						}
					}
				}
				/** To remove component from mobile view layout **/
				var mobileViewObj = $scope.modal.selectedDashboard.json.Dashboard.MobileLayout;
				if (mobileViewObj && mobileViewObj.Object.length > 0) {
					var removedMobileViewObject = null;
					for (var n = 0; n < $scope.modal.selectedDashboard.json.Dashboard.MobileLayout.Object.length; n++) {
						var mobileViewCompObj = $scope.modal.selectedDashboard.json.Dashboard.MobileLayout.Object[n];
						if (mobileViewCompObj && typeof (mobileViewCompObj) === "object" && mobileViewCompObj.objectID == id) {
							removedMobileViewObject = $scope.modal.selectedDashboard.json.Dashboard.MobileLayout.Object.splice(n, 1);
							removedMobileViewObject = null;
							break;
						}
					}
				}
				$dCc.remove();
				$scope.deselectComponent(id);
				$scope.modal.notifyObjectListChange();
				$scope.cSpaceMap[cContainerId] = false;
			}
		}

        /** @description COMPONENT SELECTION SECTION **/

        /** @description It will watch for selection color change and update the selected component selection color */
        $scope.$watch("modal.userPreference.compSelcOpts.color", function(nColor, oColor) {
            $(".bizvizComponent").css("border-color", nColor);
            $(".wrh").css("border-color", nColor);
        });

        /**
         * Click handler for the component selection
         * @param  {String}  cId              The component id
         * @param  {Boolean} isCtrlKeyPressed Flag for Ctrl key pressed
         * @param  {Object}  event            The event object
         * @param  {Boolean}  openMode        Flag for open mode dashbaord
         * @return {undefined}                undefined
         */
        $scope.handleComponentSelection = function(cId, isCtrlKeyPressed, event, openMode) {
            event ? event.stopPropagation() : "";
            if (!isCtrlKeyPressed) {
                if (!$scope.isSelectedComponent(cId)) {
                    $scope.deselectAllComponent();
                    $scope.selectComponent(cId, openMode);
                } else {
                    if ($scope.modal.listOfSelectedComponents.length > 1) {
                        $scope.deselectAllComponent();
                        $scope.selectComponent(cId);
                    } else {
                        //$scope.deselectComponent(cId);
                    }
                }
            } else {
                if (!$scope.isSelectedComponent(cId)) {
                    $scope.selectComponent(cId);
                } else {
                    $scope.deselectComponent(cId);
                    if ($scope.multiSelected) {
                    	$scope.removeMultiSelectedWrapDiv();
                        $scope.multiSelectDragConfiguration();
                    }
                }
            }
        };

        /**
         * De-Select all components
         * @return {undefined} undefined
         */
        $scope.deselectAllComponent = function() {
            var loscz = $scope.modal.listOfSelectedComponents;
            for (var i = 0, l = loscz.length; i < l; i++) {
                $scope.deselectComponent(loscz[0]);
            }
        };

        /**
         * [hideSettingsBtnFromAllSelectedComponentsExceptLastOne description]
         * @return {[type]} [description]
         */
        $scope.hideSettingsBtnFromAllSelectedComponentsExceptLastOne = function() {
            var losc = $scope.modal.listOfSelectedComponents;
            for (var i = 0, l = losc.length; i < l; i++) {
                $scope.hideSettingsBtn(losc[i]);
            }
        };
        $scope.selectComponent = function(cId, openMode) {
            var cObj = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, "objectID", cId);
            var showLock = cObj["showLocked"];
            var isHidden = cObj["unShowHidden"];
            window.cxtMenuEnabled = true;
            if (IsBoolean(isHidden) && !openMode) {
                ServiceFactory.showNotification("Component is hidden", "alert-info", 3000);
                return false;
            }
            $scope.modal.selectedComponentId = cId;
            $scope.modal.selectedComponentContainer = "#" + $scope.modal.selectedDashboard.id;
            $scope.addToSelectedComponentList(cId);
            /** Timeout is required for jQuery's action completion #15471 **/
            $timeout(function() {
                $scope.hideSettingsBtnFromAllSelectedComponentsExceptLastOne();
                $scope.displayAsSelected(cId);
                if (!IsBoolean(showLock)) {
                    $scope.showResizableHandles(cId);
                }
                if (IsBoolean($scope.modal.userPreference.defaultSettings.showSettingsButton) && !IsBoolean(showLock)) {
                    $scope.showSettingsBtn(cId);
                }
            }, 0);

            $scope.modal.isDatasetEnabled = IsBoolean($scope.getComponentbyId(cId).isDataSetAvailable);
            $scope.modal.isScriptEnabled = IsBoolean($scope.getComponentbyId(cId).enableScript);
            $(".comp-appearance-icon").popover("hide");
            $(".bizVizControlBoxBody .popover").remove();
            if (openMode !== undefined && !openMode) {
                $scope.$apply();
            }
            if(IsBoolean($scope.modal.userPreference.defaultSettings.enableMultipleDrag)){
            	if ($scope.multiSelected) {
                    $scope.multiSelectDragConfiguration();
                } else {
                    var DivForMultiSelect = $("#dcc_" + $scope.modal.listOfSelectedComponents[0]);
                    if ((DivForMultiSelect["0"] != undefined) && (DivForMultiSelect["0"].parentNode != undefined)) {
                        var parent = DivForMultiSelect["0"].parentNode,
                        parentId = parent.id;
                        if (((parentId).indexOf("WrapDivForMultiSelect") !== -1)) {
                            var $dccContainer = $("#" + parentId),
                            $dccContainerParent = $("#" + $dccContainer[0].parentNode.id);
                            DivForMultiSelect["0"].childNodes[0].draggable("option", "disabled", false);
                            DivForMultiSelect["0"].childNodes[0].css({
                                "background-image": "none",
                                "opacity": "1.0"
                            });
                            $dccContainerParent.append(DivForMultiSelect["0"].childNodes[0]);
                            $dccContainer.remove();
                        }
                    }
                }
            }
            
        };

        $scope.multiSelectDragConfiguration = function(deleteFromObjectBrowser) {
        	if($scope.modal.userPreference.defaultSettings.enableMultipleDrag){
        		 deleteFromObjectBrowser = (deleteFromObjectBrowser === undefined) ? false : deleteFromObjectBrowser;
                 var
                     DivForMultiSelect = $("#dcc_" + $scope.modal.listOfSelectedComponents[0]),
                     LengthSelectedComponent = $scope.modal.listOfSelectedComponents.length,
                     WrapDivHeightArr = [],
                     WrapDivWidthArr = [],
                     WrapDivLeftArr = [],
                     WrapDivTopArr = [],
                     selectedDivArr = [],
                     componentArr = [],
                     listOfSelectedComponentsArr = [],
                     $dccContainer = "";
                 listOfSelectedComponentsArr = $scope.deleteFromObjectBrowserUpdate($scope.modal.listOfSelectedComponents,deleteFromObjectBrowser);
                 LengthSelectedComponent = listOfSelectedComponentsArr.length;
                 DivForMultiSelect = $("#dcc_" + listOfSelectedComponentsArr[0]);
                 if (DivForMultiSelect["0"] !== undefined) {
                     var parentId = DivForMultiSelect["0"].parentNode.id;
                     if (((parentId).indexOf("WrapDivForMultiSelect") == -1)) {
                         var WrapDivForMultiSelect = $("<div></div>");
                         WrapDivForMultiSelect.attr("id", "WrapDivForMultiSelect" + (parentId));
                         $dccContainer = $("#" + parentId);
                         $dccContainer.append(WrapDivForMultiSelect);
                     } else {
                    	 var WrapDivForMultiSelect = $("#" + parentId);
                     }
                     if ((WrapDivForMultiSelect !== undefined) && (WrapDivForMultiSelect["0"].childNodes !== undefined) && (WrapDivForMultiSelect["0"].childNodes.length !== LengthSelectedComponent)) {
                         for (var i = 0; LengthSelectedComponent > i; i++) {
                             var cId = listOfSelectedComponentsArr[i];
                             var selectedDiv = $("#dcc_" + cId);
                             var WrapDivHeight = "";
                             var WrapDivWidth = "";
                             var WrapDivTop = "";
                             var WrapDivLeft = "";
                             var component = $scope.getComponentbyId(cId);
                             if ((component !== undefined) && (!IsBoolean(component.showLocked))) {
                                 selectedDiv.draggable("option", "disabled", true);
                                 WrapDivWidthArr.push(component.x * 1 + component.width * 1);
                                 WrapDivHeightArr.push(component.y * 1 + component.height * 1);
                                 WrapDivTopArr.push(component.y * 1);
                                 WrapDivLeftArr.push(component.x * 1)
                                 WrapDivHeight = WrapDivHeightArr.reduce(function(a, b) {
                                     return Math.max(a, b);
                                 });

                                 WrapDivWidth = WrapDivWidthArr.reduce(function(a, b) {
                                     return Math.max(a, b);
                                 });

                                 WrapDivTop = WrapDivTopArr.reduce(function(a, b) {
                                     return Math.min(a, b);
                                 });

                                 WrapDivLeft = WrapDivLeftArr.reduce(function(a, b) {
                                     return Math.min(a, b);
                                 });
                                 selectedDiv.css({
                                     "background-image": "none",
                                     "opacity": "0.9"
                                 });
                                 componentArr.push(component);
                                 selectedDivArr.push(selectedDiv);
                                 WrapDivForMultiSelect.append(selectedDiv);
                             }
                         }
                         $(WrapDivForMultiSelect).css({
                             left: WrapDivLeft + "px",
                             top: WrapDivTop + "px",
                             height: (WrapDivHeight - WrapDivTop) + "px",
                             width: (WrapDivWidth - WrapDivLeft) + "px",
                             "z-index": "auto"
                         });
                         for (var j = 0; selectedDivArr.length > j; j++) {
                             selectedDivArr[j].css({
                                 top: (componentArr[j].y - WrapDivTop) + "px",
                                 left: (componentArr[j].x - WrapDivLeft) + "px"
                             });
                         }
                         $scope.wrapdivstarty = WrapDivTop;
                         $scope.wrapdivstartx = WrapDivLeft;
                     }
                     var dragConfig = {
                         grid: [$scope.modal.bgGridSize, $scope.modal.bgGridSize],
                         containment: "parent",
                         
                         stop: function(evt, ui) {
                             var
                                 LengthSelectedComponent = $scope.modal.listOfSelectedComponents.length,
                                 $pTarget = $("#" + evt.target.parentElement.id),
                                 parentOffset = $(this).parent().offset(),
                                 PageX = evt.pageX - parentOffset.left,
                                 PageY = evt.pageY - parentOffset.top,
                                 startX = $scope.origionalPositionWrapDivForMultiSelect.pageX * 1 - $scope.wrapdivstartx,
                                 startY = $scope.origionalPositionWrapDivForMultiSelect.pageY * 1 - $scope.wrapdivstarty,
                                 endX = $pTarget["0"].offsetWidth,
                                 endY = $pTarget["0"].offsetHeight;
                             	var top;
                                 if(($scope.modal.layoutType !== undefined )&&($scope.modal.layoutType !=="AbsoluteLayout")){
									//DAS-818 Move multiselect component is not working while scrolling.
                                 	 top = (startY > PageY) ? (startY - $scope.origionalPositionWrapDivForMultiSelect.pageY * 1) : ui.position.top - ui.originalPosition.top;
                                 }else{
                                 	 top = (startY > PageY) ? (startY - $scope.origionalPositionWrapDivForMultiSelect.pageY * 1) : (((PageY - startY) + evt.target.offsetHeight > endY) ? ((endY + startY) - ($scope.origionalPositionWrapDivForMultiSelect.pageY * 1 + evt.target.offsetHeight)) : PageY - $scope.origionalPositionWrapDivForMultiSelect.pageY * 1);
                                 }
                                 var left = (startX > PageX) ? (startX - $scope.origionalPositionWrapDivForMultiSelect.pageX * 1) : (((PageX - startX) + evt.target.offsetWidth > endX) ? ((endX + startX) - ($scope.origionalPositionWrapDivForMultiSelect.pageX * 1 + evt.target.offsetWidth)) : PageX - $scope.origionalPositionWrapDivForMultiSelect.pageX * 1),
                                 cId = "",
                                 yActualPosition = "";
                                 var unitMultipleTop = ( top > 0 ) ? 1 : -1;
                                 var unitMultipleLeft = ( left > 0 ) ? 1 : -1;
                                 var wrapDivtop = Math.abs(top);
                                 var wrapDivleft = Math.abs(left);
                                 top = (Math.abs(wrapDivtop - $scope.wrapdivstarty) > $scope.modal.bgGridSize) ? (wrapDivtop - wrapDivtop % $scope.modal.bgGridSize) : ((wrapDivtop > $scope.modal.bgGridSize) ? (wrapDivtop - $scope.modal.bgGridSize) : 0);
                                 top = top*unitMultipleTop;
                                 left = (Math.abs(wrapDivleft - $scope.wrapdivstartx) > $scope.modal.bgGridSize) ? (wrapDivleft - wrapDivleft % $scope.modal.bgGridSize) : ((wrapDivleft > $scope.modal.bgGridSize) ? (wrapDivleft - $scope.modal.bgGridSize) : 0);
                                 left = left*unitMultipleLeft;
                             for (var i = 0; LengthSelectedComponent > i; i++) {
                                 cId = $scope.modal.listOfSelectedComponents[i];
                                 var Component = $scope.getComponentbyId($scope.modal.listOfSelectedComponents[i]);
                                 if (Component !== undefined) {
                                     Component.x = ((Component.x * 1 + left) >= 0) ? (Component.x * 1 + left) : Component.x * 1;
                                     //Component.x = (Component.x*1 < 10 )? 10:((Component.x*1 + Component.width*1 > $pTarget.width()*1)? $pTarget.width()*1-Component.width*1 : Component.x*1);
                                     yActualPosition = Component.y;
                                     Component.y = ((Component.y * 1 + top) > 0 ? (Component.y * 1 + top) : (Component.y * 1 + top) * -1);
                                     Component.y = ((top < 0) && (yActualPosition * 1 < top * -1)) ? Component.y * -1 : Component.y * 1;
                                     Component.y = (Component.y >= 0) ? Component.y : yActualPosition * 1;
                                     //Component.y = ((top<0)&&(Component.y*1<top*-1))?10:((Component.y*1 + Component.height*1 > $pTarget.height()*1)? $pTarget.height()*1-Component.height*1 : Component.y*1);
                                     $(evt.target).css("cursor", "auto");
                                     if ((component !== undefined) && (component.showLocked !== undefined) && (!IsBoolean(component.showLocked))) {
                                         $scope.updatePosition(cId, Component.y, Component.x);
                                         $scope.initPropertyPalette(cId);
                                     }
                                 }
                             }
                             $scope.deselectAllComponent();
                             $scope.modal.updateDashboardStatus(1);
                         },

                         start: function(evt, ui) {
                        	 var parentOffset = $(this).parent().offset();
                             $scope.origionalPositionWrapDivForMultiSelect = {      
                                 pageX: evt.pageX - parentOffset.left,
                                 pageY: evt.pageY - parentOffset.top
                             };
                         }
                     };
                     WrapDivForMultiSelect.draggable(dragConfig);
                     WrapDivForMultiSelect.unbind("click").click(function(evt) {
                         if (evt.ctrlKey) {
                             var underDiv = [];
                             $timeout(function() {
                             	underDiv = $(document.elementsFromPoint(evt.clientX, evt.clientY));
                             	$scope.removeMultiSelectedWrapDiv();
                                 if ((underDiv[3] !== undefined) && (underDiv[3].id !== undefined) && ((underDiv[3].id).indexOf("dcc_") !== -1) && (($scope.modal.listOfSelectedComponents).indexOf(underDiv[3].id) === -1)) {
                                 	var underDivArr = (underDiv[3].id).split("dcc_"),
                                     	underDivID = underDivArr[1];
                                 	$scope.selectComponent(underDivID);
                                 } else {
                                     $scope.deselectAllComponent();
                                     $(".c-group").removeClass("selected-group");
                                 }
                             },0);
                         } else {
                             $scope.deselectAllComponent();
                             $(".c-group").removeClass("selected-group");
                         }
                     });
                 }
        	}
        };
        $scope.deleteFromObjectBrowserUpdate = function(listOfSelectedComponents, deleteFromObjectBrowser) {
            var listOfSelectedComponentsArr = [],
            	length = "";
            if(IsBoolean(deleteFromObjectBrowser)){
            	length = listOfSelectedComponents.length - 1;
                for (var i = 0; length > i; i++) {
                    component = $scope.getComponentbyId(listOfSelectedComponents[i]);
                    if ((component !== undefined) && (listOfSelectedComponents[i] !== listOfSelectedComponents[length])) {
                        listOfSelectedComponentsArr.push(listOfSelectedComponents[i]);
                    }
                }
            }else{
            	length = listOfSelectedComponents.length;
                for (var i1 = 0; length > i1; i1++) {
                    component = $scope.getComponentbyId(listOfSelectedComponents[i1]);
                    if ((component !== undefined) && (!IsBoolean(component.showLocked))) {
                        listOfSelectedComponentsArr.push(listOfSelectedComponents[i1]);
                    }
                }
            }
            return listOfSelectedComponentsArr;
        }
        $scope.deselectComponent = function(cId, MultiDradDivUpdate) {
        	if($scope.modal.userPreference.defaultSettings.enableMultipleDrag){
        		MultiDradDivUpdate = (MultiDradDivUpdate!==undefined) ? MultiDradDivUpdate : false;
                var deselectComponentDiv = $("#dcc_" + cId);
                if((deselectComponentDiv["0"]!=undefined)&&(deselectComponentDiv["0"].parentNode!=undefined)){
                	var
                	parent = deselectComponentDiv["0"].parentNode,
                    parentId = parent.id;
                    /**Added For MultiSelect*/
                    if (((parentId).indexOf("WrapDivForMultiSelect") !== -1)) {
                        var 
                        	$dccContainer = $("#" + parentId),
                            component = $scope.getComponentbyId(cId),
                        	$dccContainerParent = $("#"+ $dccContainer[0].parentNode.id);
                        if (component !== undefined) {
                        	IsBoolean(component.showLocked) ? deselectComponentDiv.draggable("option", "disabled", true) : deselectComponentDiv.draggable("option", "disabled", false);
                            deselectComponentDiv.css({
                                left: component.x*1,
                                top: component.y*1,
                                "background-image": "none",
                                "opacity": "1.0"
                            });
                        }
                        	$dccContainerParent.append(deselectComponentDiv);
                        	if($dccContainer["0"].childNodes.length === 0){
                        		$dccContainer.remove();
                        	}
                    }
                }
                if(!MultiDradDivUpdate){
                	$scope.removeFromSelectedComponentList(cId);
                    //$scope.modal.selectedComponentId = "";//DAS-967
                    /** Timeout is required for jQuery's action completion #15471 **/
                    $timeout(function() {
                        $scope.displayAsDeSelected(cId);
                        $scope.hideResizableHandles(cId);
                        $scope.hideSettingsBtn(cId);
                    },0);
                }
        	}else{
        		$scope.removeFromSelectedComponentList(cId);
                // $scope.modal.selectedComponentId = "";//DAS-967
                /** Timeout is required for jQuery's action completion #15471 **/
                $timeout(function() {
                    $scope.displayAsDeSelected(cId);
                    $scope.hideResizableHandles(cId);
                    $scope.hideSettingsBtn(cId);
                },0);
        	}
        };
        $scope.addToSelectedComponentList = function(cId) {
        	if ($scope.modal.listOfSelectedComponents.indexOf(cId) == -1)
        		$scope.modal.listOfSelectedComponents.push(cId);
            if ($scope.modal.listOfSelectedComponents.length > 1) {
                $scope.multiSelected = true;
            }
        };
        $scope.removeFromSelectedComponentList = function(cId) {
            var index = $scope.modal.listOfSelectedComponents.indexOf(cId);
            $scope.modal.listOfSelectedComponents.splice(index, 1);
            $scope.multiSelected = $scope.modal.listOfSelectedComponents.length > 1;
        };
        $scope.displayAsSelected = function(cId) {
            var $cContainer = $("#dcc_" + cId),
                $wContainer = $("#draggableDiv" + cId),
                bThickness = $scope.modal.userPreference.compSelcOpts["thickness"],
                bColor = $scope.modal.userPreference.compSelcOpts["color"],
                border = bThickness + "px solid " + bColor,
                refBorder = bThickness + "px dashed " + bColor;
            if ($cContainer.length) {
                $cContainer.css("border", border);
                if (!$scope.isSelectedDashboardResponsive()) {
                    $cContainer.css({
                        height: $wContainer.height() * 1 + bThickness * 2,
                        width: $wContainer.width() * 1 + bThickness * 2,
                        left: $cContainer.css("left").split("px")[0] * 1 - bThickness + "px",
                        top: $cContainer.css("top").split("px")[0] * 1 - bThickness + "px"
                    });
                }
                if ($scope.modal.listOfSelectedComponents.length > 1) {
                    cId = $scope.modal.listOfSelectedComponents[0];
                    $("#dcc_" + cId).css({
                        border: refBorder
                    });
                }
            }
        };
        $scope.displayAsDeSelected = function(cId) {
            var $cContainer = $("#dcc_" + cId),
                $wContainer = $("#draggableDiv" + cId),
                bThickness = $scope.modal.userPreference.compSelcOpts["thickness"];
//                var bColor = $scope.modal.userPreference.compSelcOpts["color"];
//                var border = bThickness + "px solid " + bColor;
//                var refBorder = bThickness + "px dashed " + bColor;
            if ($cContainer.length) {
                $cContainer.css("border", "none");
                if (!$scope.isSelectedDashboardResponsive()) {
                    $cContainer.css({
                        height: $wContainer.height() * 1 - bThickness * 2,
                        width: $wContainer.width() * 1 - bThickness * 2,
                        left: $cContainer.css("left").split("px")[0] * 1 + bThickness + "px",
                        top: $cContainer.css("top").split("px")[0] * 1 + bThickness + "px"
                    });
                }
            }
        };
        $scope.isSelectedComponent = function(cId) {
            var
                answer = false,
                loscz = $scope.modal.listOfSelectedComponents;
            if (loscz.indexOf(cId) !== -1) {
                answer = true;
            }
            return answer;
        };

        /** DRAG OF COMPONENT **/
        var constrainedPosition = {};
        /**@description Initialize dragging capability of a component, @params c - The component object  **/
        $scope.initDragComponent = function(c) {
            var
                $dCc = $("#dcc_" + c.m_objectid),
                $cBc = $("#cbc_" + c.m_objectid),
                dragConfig = {
            		grid: [ $scope.modal.bgGridSize, $scope.modal.bgGridSize ],
                    containment: "parent",
                    ghost: true,
                    cancel: false,
                    stop: function(evt, ui) {
                        var
                            top = this.style.top.split("px")[0],
                            left = this.style.left.split("px")[0],
                            cId = global["componetIDPrefix"] + evt.target.id.split(global["componetIDPrefix"])[1];

                        top = (top > $scope.modal.bgGridSize) ? (top - top % $scope.modal.bgGridSize) : $scope.modal.bgGridSize;
                        left = (left > $scope.modal.bgGridSize) ? (left - left % $scope.modal.bgGridSize) : $scope.modal.bgGridSize;
                        $(evt.target).css({"left": left+"px", "top": top+"px", "opacity": 1, "cursor": "auto"});

                        $scope.updatePosition(cId, top, left);
                        $scope.initPropertyPalette(cId);
                        $scope.modal.updateDashboardStatus(1);
                    },
                    drag: function(evt, ui) {
                        var
                            $target = $("#" + evt.target.id),
                            $pTarget = $("#" + evt.target.parentElement.id),
                            calculatedOffset = null;
                        $target.css({"opacity": 0.9, "cursor": "move"});
                        if ($scope.prePos.top == ui.position.top && $scope.prePos.left == ui.position.left) {
                            if ($target.offset().left + $target.width() > $pTarget.width()) {
                                calculatedOffset = $cBc.width() + 5;
                                $cBc.css("left", "calc( 0% - " + calculatedOffset + "px )");
                            } else {
                                $cBc.css("left", "100%");
                            }
                            if ($target.offset().top + $target.height() > $pTarget.height() &&
                                $cBc.outerHeight() >= $dCc.outerHeight()) {
                                $cBc.css("top", "-" + $cBc.height() + "px");
                            } else {
                                $cBc.css("top", "0%");
                            }
                        } else {
                            $cBc.css({
                                "left": "100%",
                                "top": "0px"
                            });
                        }
                        $scope.prePos = ui.position;
                    }
                };
            $dCc.draggable(dragConfig);
        };
        $scope.updatePosition = function(id, top, left) {
            var c = $scope.getComponentbyId(id);
            c.x = left;
            c.y = top;
            if ($scope.modal.layoutType == "AbsoluteLayout") {
            	$scope.registerInHistory("change", c);
            }
        };
        $scope.updateDimention = function(id, height, width) {
            var c = $scope.getComponentbyId(id);
            c.height = height;
            c.width = width;
            if ($scope.modal.layoutType == "AbsoluteLayout") {
            	$scope.registerInHistory("change", c);
            }
        };
        $scope.initResizeComponent = function(component) {
            var resizConfig = {
            	grid: $scope.modal.bgGridSize,
                handles: {
                    "nw": ".nw-handle",
                    "ne": ".ne-handle",
                    "sw": ".sw-handle",
                    "se": ".se-handle",
                    "n": ".n-handle",
                    "e": ".e-handle",
                    "s": ".s-handle",
                    "w": ".w-handle"
                },
                delay: 100,
                distance: 5
            };
        	$("#dcc_" + component.m_objectid).resizable(resizConfig);
        	$("#dcc_" + component.m_objectid).on("resizestart", function(event, ui) {
        		$(this).css({"opacity": 0.9});
        	});
            $("#dcc_" + component.m_objectid).on("resizestop", function(event, ui) {
                var targetComponentId = global["componetIDPrefix"] + event.target.id.split(global["componetIDPrefix"])[1],
                    targetComponent = $scope.getComponentbyId(targetComponentId);
                if ($.inArray(targetComponentId, $scope.modal.listOfSelectedComponents) == -1) {
                    $scope.modal.listOfSelectedComponents.push(targerComponentId);
                }
                targetComponent.x = ui.position.left;
                targetComponent.y = ui.position.top;

                var w,h;
                if($scope.modal.bgGridSize === 1){
                	w = $(this).width();
                	h = $(this).height();
                }else{
                	var borderThickness = ($scope.modal.bgGridSize !== 1) ? targetComponent[targetComponent.subElement].borderThickness * 1 : 0;
                    w = $(this).width() + borderThickness*2;
                    w = (w- w%$scope.modal.bgGridSize);
                    h = $(this).height() + borderThickness*2;
                    h = (h- h%$scope.modal.bgGridSize);
                }
                $(this).css({"opacity": 1, "width": w+"px", "height": h+"px"});

                targetComponent.width = w;
                targetComponent.height = h;
                var multiSelectDiv = false;
                if(IsBoolean($scope.multiSelected) && IsBoolean($scope.modal.userPreference.defaultSettings.enableMultipleDrag)){
                	targetComponent.y = targetComponent.y + $scope.wrapdivstarty;
                	targetComponent.x = targetComponent.x + $scope.wrapdivstartx;
                	$scope.deselectComponent(targetComponent.objectID);
                	multiSelectDiv = true;
            	}
                $scope.redrawComponent(targetComponent);
                if(multiSelectDiv){
                	$scope.selectComponent(targetComponent.objectID);
            	}
                /** for update property in pallet **/
                $scope.initPropertyPalette(component.m_objectid);
                /** To update the change status when the component is resized **/
                $scope.modal.updateDashboardStatus(1);
            });
            if (!$scope.isSelectedComponent(component.m_objectid)) {
                $scope.hideResizableHandles(component.m_objectid);
            }
        };

        $scope.modal.componentObjectList = {};
        $scope.AddInComponentObjectList = function(id, component) {
            $scope.modal.selectedDashboard.componentObjectList[id] = component;
        };
        $scope.getComponentObjectFromComponentObjectList = function(id) {
            return $scope.modal.selectedDashboard.componentObjectList[id];
        };

        $scope.AddComponentJsonToDashboardJson = function(componentData) {
            $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object.push(componentData.Properties.Object);
        };
        /** @description Property palette creation for the component **/
        $scope.createPropertyPalette = function(componentId, isDashboard) {
            $scope.toggleDashboardPropertyPalette(componentId);
            $scope.initPropertyPalette(componentId, isDashboard);
            $timeout(function() {
                applyPropertyWindowColorScheme(ServiceFactory.AUTH_INFO.get("preferenceObject"));
                if (navigator.appVersion.indexOf("Win") != -1 || !Modernizr.inputtypes.color) {
                	$scope.initSpectrumColorPicker("input[type='color']");
                }
            }, 100);
        };

        $scope.getNewVariableJson = function(newObject) {
            return angular.copy($scope.modal.selectedDashboard.json.GlobalVariable_Variable, newObject);
        };
        $scope.getDashboardJson = function() {
            ServiceFactory.getJsonFileData("./resources/data/dashboard.data", function(jsonData) {
                return jsonData;
            });
        };

        /** @description ontext Menu operations callbacks **/
        $scope.alignHorizontalLeft = function() {
        	$scope.removeMultiSelectedWrapDiv();
            var leftPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[0]).position().left;
            var topPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[0]).position().top;
            var propObjx = {
                "attributeName": "x",
                "propertyName": "Object",
                "type": "Number",
                "value": 4
            };
            var propObjy = {
                "attributeName": "y",
                "propertyName": "Object",
                "type": "Number",
                "value": topPos
            };
            $.each($scope.modal.listOfSelectedComponents, function(index, element) {
                $scope.modal.selectedComponentId = element;
                $scope.updateObjectWithPropertyValue(propObjx);
                $scope.updateObjectWithPropertyValue(propObjy);
                leftPos += $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).width();
                //				topPos += $("#dcc_"+$scope.modal.listOfSelectedComponents[index]).height();
                propObjx.value = leftPos;
                //				propObjy.value = topPos;
                var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
                if (!IsBoolean(componentJSON.showLocked)) {
                    $scope.redrawComponent(componentJSON);
                }
            });
            $scope.multiSelectDragConfiguration();
            ServiceFactory.showNotification("Horizontally Aligned", "alert-info", 3000);
        };
        $scope.alignVerticalLeft = function() {
        	$scope.removeMultiSelectedWrapDiv();
//          var leftPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[0]).position().left;
            var topPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[0]).position().top;
            var propObjx = {
                "attributeName": "x",
                "propertyName": "Object",
                "type": "Number",
                "value": 4
            };
            var propObjy = {
                "attributeName": "y",
                "propertyName": "Object",
                "type": "Number",
                "value": topPos
            };
            $.each($scope.modal.listOfSelectedComponents, function(index, element) {
                $scope.modal.selectedComponentId = element;
                $scope.updateObjectWithPropertyValue(propObjx);
                $scope.updateObjectWithPropertyValue(propObjy);
//				leftPos += $("#dcc_"+$scope.modal.listOfSelectedComponents[index]).width();
                topPos += $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).height();
//				propObjx.value = leftPos;
                propObjy.value = topPos;
                var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
                if (!IsBoolean(componentJSON.showLocked)) {
                    $scope.redrawComponent(componentJSON);
                }
            });
            $scope.multiSelectDragConfiguration();
            ServiceFactory.showNotification("Vertically Aligned", "alert-info", 3000);
        };
        $scope.equalHorizontal = function() {
        	$scope.removeMultiSelectedWrapDiv();
            var ref_1st = $("#dcc_" + $scope.modal.listOfSelectedComponents[0]),
                ref_2nd = $("#dcc_" + $scope.modal.listOfSelectedComponents[1]),
                commonDistH = ref_2nd.position().left - (ref_1st.position().left + ref_1st.width()),
                propLeft, $targetEl, $prevEl, componentJSON, $dashboard, elFitWidth;
            for (var i = 0; i < $scope.modal.listOfSelectedComponents.length; i++) {
                if (i > 1) {
                    $targetEl = $("#dcc_" + $scope.modal.listOfSelectedComponents[i]);
                    $prevEl = $("#dcc_" + $scope.modal.listOfSelectedComponents[i - 1]);
                    propLeft = {
                        attributeName: "x",
                        propertyName: "Object",
                        type: "Number",
                        value: $prevEl.position().left + $prevEl.width() + commonDistH
                    };
                    $scope.modal.selectedComponentId = $scope.modal.listOfSelectedComponents[i];
                    $scope.updateObjectWithPropertyValue(propLeft);
                    componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
                    if (!IsBoolean(componentJSON.showLocked)) {
                        $scope.redrawComponent(componentJSON);
                    }
                    $dashboard = $("#" + $scope.modal.selectedDashboard.id);
                    elFitWidth = $targetEl.position().left + $targetEl.width();
                    if (elFitWidth > $dashboard.width()) {
                        $dashboard.css("width", elFitWidth);
                    }
                }
            }
            $scope.multiSelectDragConfiguration();
            ServiceFactory.showNotification("Equal Space Horizontally", "alert-info", 3000);
        };
        $scope.equalVertical = function() {
        	$scope.removeMultiSelectedWrapDiv();
            var ref_1st = $("#dcc_" + $scope.modal.listOfSelectedComponents[0]),
                ref_2nd = $("#dcc_" + $scope.modal.listOfSelectedComponents[1]),
        		/** Updated for mobile and tab view when dashboardDiv is scrollable */
                commonDistV = ($scope.modal.layoutType !== "AbsoluteLayout") ? ref_2nd[0].offsetTop  - (ref_1st[0].offsetTop + ref_1st.height()) : ref_2nd.position().top - (ref_1st.position().top + ref_1st.height()),
                propTop, $prevEl, $targetEl, componentJSON, $dashboard, elFitHeight;
            for (var i = 0; i < $scope.modal.listOfSelectedComponents.length; i++) {
                if (i > 1) {
                    $targetEl = $("#dcc_" + $scope.modal.listOfSelectedComponents[i]);
                    $prevEl = $("#dcc_" + $scope.modal.listOfSelectedComponents[i - 1]);
                    propTop = {
                        attributeName: "y",
                        propertyName: "Object",
                        type: "Number",
                        value: ($scope.modal.layoutType !== "AbsoluteLayout") ? $prevEl[0].offsetTop + $prevEl.height() + commonDistV : $prevEl.position().top + $prevEl.height() + commonDistV
                    };
                    $scope.modal.selectedComponentId = $scope.modal.listOfSelectedComponents[i];
                    $scope.updateObjectWithPropertyValue(propTop);
                    componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
                    if (IsBoolean(componentJSON.showLocked == false)) {
                        $scope.redrawComponent(componentJSON);
                    }
                    $dashboard = $("#" + $scope.modal.selectedDashboard.id);
                    elFitHeight = ($scope.modal.layoutType !== "AbsoluteLayout") ? $targetEl[0].offsetTop + $targetEl.height() : $targetEl.position().top + $targetEl.height();
                    if (elFitHeight > $dashboard.height()) {
                        $dashboard.css("height", elFitHeight);
                    }
                }
            }
            $scope.multiSelectDragConfiguration();
            ServiceFactory.showNotification("Equal Space Vetically", "alert-info", 3000);
        };
        $scope.alignLeft = function() {
        	$scope.removeMultiSelectedWrapDiv();
            var leftPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[0]).position().left;
            var propObjx = {
                "attributeName": "x",
                "propertyName": "Object",
                "type": "Number",
                "value": leftPos
            };
            $.each($scope.modal.listOfSelectedComponents, function(index, element) {
                $scope.modal.selectedComponentId = element;
                $scope.updateObjectWithPropertyValue(propObjx);
                var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
                if (!IsBoolean(componentJSON.showLocked)) {
                    $scope.redrawComponent(componentJSON);
                }
            });
            $scope.multiSelectDragConfiguration();
            ServiceFactory.showNotification("Left Aligned", "alert-info", 3000);
        };
        $scope.alignRight = function() {
        	$scope.removeMultiSelectedWrapDiv();
            var leftPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[0]).position().left;
            var rightEnd = leftPos + $("#dcc_" + $scope.modal.listOfSelectedComponents[0]).width();
            var propObjx = {
                "attributeName": "x",
                "propertyName": "Object",
                "type": "Number",
                "value": leftPos
            };
            $.each($scope.modal.listOfSelectedComponents, function(index, element) {
                $scope.modal.selectedComponentId = element;
                propObjx["value"] = rightEnd - $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).width();
                $scope.updateObjectWithPropertyValue(propObjx);
                var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
                if (!IsBoolean(componentJSON.showLocked)) {
                    $scope.redrawComponent(componentJSON);
                }
            });
            $scope.multiSelectDragConfiguration();
            ServiceFactory.showNotification("Right Aligned", "alert-info", 3000);
        };
        $scope.alignTop = function() {
        	$scope.removeMultiSelectedWrapDiv();
        	var topPos;
        	/** Updated for mobile and tab view when dashboardDiv is scrollable */
        	if ($scope.modal.layoutType !== "AbsoluteLayout") {
                topPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[0])[0].offsetTop;
        	} else {
        	    topPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[0]).position().top;    
        	}
            var propObjy = {
                "attributeName": "y",
                "propertyName": "Object",
                "type": "Number",
                "value": topPos
            };
            $.each($scope.modal.listOfSelectedComponents, function(index, element) {
                if (index > 0) {
                    $scope.modal.selectedComponentId = element;
                    $scope.updateObjectWithPropertyValue(propObjy);
                    var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
                    if (!IsBoolean(componentJSON.showLocked)) {
                        $scope.redrawComponent(componentJSON);
                    }
                }
            });
            $scope.multiSelectDragConfiguration();
            ServiceFactory.showNotification("Top Aligned", "alert-info", 3000);
        };      
        $scope.duplicateComponents = function(objs) {
            var dataobj = [];
            var duplicatedComps = [];
            for (var i = 0; i < objs.length; i++) {
                dataobj[i] = [];
                var comp = $scope.getComponentbyId(objs[i]);
                var data = comp.designData;
                var aDbOffset = $("#" + $scope.getActiveDashboardId()).parent().parent().offset();
                var xPos = parseInt(comp.x) + 30;
                xPos = (xPos - xPos % $scope.modal.bgGridSize);
                xPos = (xPos < (10 + aDbOffset.left)) ? (30 + aDbOffset.left) : xPos;
                var yPos = parseInt(comp.y) + 30;
                yPos = (yPos - yPos % $scope.modal.bgGridSize);
                yPos = (yPos < (10 + aDbOffset.top)) ? (30 + aDbOffset.top) : yPos;
                var obj = {
                    event: {
                        pageX: xPos,
                        pageY: yPos
                    },
                    duplicating: true
                };
                dataobj[i].push(data, obj, comp);
            }
            for (var i = 0; i < dataobj.length; i++) {
                //            $scope.onDropComplete(data, obj, comp);
                $scope.onDropComplete(dataobj[i][0], dataobj[i][1], dataobj[i][2]);
                duplicatedComps.push($scope.modal.selectedComponentId);
            }
            for (var i = 0; i < duplicatedComps.length; i++) {
                $scope.selectComponent(duplicatedComps[i]);
            }
        };        
        $scope.alignBottom = function() {
        	$scope.removeMultiSelectedWrapDiv();
        	var topPos;
        	/** Updated for mobile and tab view when dashboardDiv is scrollable */
        	if ($scope.modal.layoutType !== "AbsoluteLayout") {
                topPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[0])[0].offsetTop;
        	} else {
        	    topPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[0]).position().top;    
        	}
            var botEnd = topPos + $("#dcc_" + $scope.modal.listOfSelectedComponents[0]).height();
            var propObjy = {
                "attributeName": "y",
                "propertyName": "Object",
                "type": "Number",
                "value": topPos
            };
            $.each($scope.modal.listOfSelectedComponents, function(index, element) {
                if (index > 0) {
                    $scope.modal.selectedComponentId = element;
                    propObjy["value"] = botEnd - $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).height();
                    $scope.updateObjectWithPropertyValue(propObjy);
                    var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
                    if (!IsBoolean(componentJSON.showLocked)) {
                        $scope.redrawComponent(componentJSON);
                    }
                }
            });
            $scope.multiSelectDragConfiguration();
            ServiceFactory.showNotification("Bottom Aligned", "alert-info", 3000);
        };
        $scope.alignHorizontal = function() {
        	$scope.removeMultiSelectedWrapDiv();
            var topPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[0]).position().top;
            var botEnd = topPos + $("#dcc_" + $scope.modal.listOfSelectedComponents[0]).height();
            var mid = topPos + ((botEnd - topPos) / 2)
            var propObjy = {
                "attributeName": "y",
                "propertyName": "Object",
                "type": "Number",
                "value": topPos
            };
            $.each($scope.modal.listOfSelectedComponents, function(index, element) {
                if (index > 0) {
                    $scope.modal.selectedComponentId = element;
                    propObjy["value"] = mid - $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).height() / 2;
                    $scope.updateObjectWithPropertyValue(propObjy);
                    var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
                    if (!IsBoolean(componentJSON.showLocked)) {
                        $scope.redrawComponent(componentJSON);
                    }
                }
            });
            $scope.multiSelectDragConfiguration();
        };
        $scope.alignVertical = function() {
        	$scope.removeMultiSelectedWrapDiv();
            var leftPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[0]).position().left;
            var rightEnd = leftPos + $("#dcc_" + $scope.modal.listOfSelectedComponents[0]).width();
            var mid = leftPos + ((rightEnd - leftPos) / 2)
            var propObjx = {
                "attributeName": "x",
                "propertyName": "Object",
                "type": "Number",
                "value": leftPos
            };
            $.each($scope.modal.listOfSelectedComponents, function(index, element) {
                if (index > 0) {
                    $scope.modal.selectedComponentId = element;
                    propObjx["value"] = mid - $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).width() / 2;
                    $scope.updateObjectWithPropertyValue(propObjx);
                    var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
                    if (!IsBoolean(componentJSON.showLocked)) {
                        $scope.redrawComponent(componentJSON);
                    }
                }
            });
            $scope.multiSelectDragConfiguration();
        };
        $scope.equalWidth = function() {
        	$scope.removeMultiSelectedWrapDiv();
        	/**Added to resolve 2px difference issue*/
            var wd = $scope.getComponentbyId($scope.modal.listOfSelectedComponents[0]);
            var propObjx = {
                "attributeName": "width",
                "propertyName": "Object",
                "type": "Number",
                "value": wd.width
            };
            $.each($scope.modal.listOfSelectedComponents, function(index, element) {
                if (index > 0) {
                    $scope.modal.selectedComponentId = element;
                    $scope.updateObjectWithPropertyValue(propObjx);
                    var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
                    if (!IsBoolean(componentJSON.showLocked)) {
                        $scope.redrawComponent(componentJSON);
                    }
                }
            });
            $scope.multiSelectDragConfiguration();
            ServiceFactory.showNotification("Equal Width", "alert-info", 3000);
        };
        $scope.equalHeight = function() {
        	$scope.removeMultiSelectedWrapDiv();
        	/**Added to resolve 2px difference issue*/
            var ht = $scope.getComponentbyId($scope.modal.listOfSelectedComponents[0]);
            var propObjx = {
                "attributeName": "height",
                "propertyName": "Object",
                "type": "Number",
                "value": ht.height
            };
            $.each($scope.modal.listOfSelectedComponents, function(index, element) {
                if (index > 0) {
                    $scope.modal.selectedComponentId = element;
                    $scope.updateObjectWithPropertyValue(propObjx);
                    var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
                    if (!IsBoolean(componentJSON.showLocked)) {
                        $scope.redrawComponent(componentJSON);
                    }
                }
            });
            $scope.multiSelectDragConfiguration();
            ServiceFactory.showNotification("Equal Height", "alert-info", 3000);
        };
        /**Added to remove multi select wrap div*/
        $scope.removeMultiSelectedWrapDiv = function() {
            if ($scope.modal.userPreference.defaultSettings.enableMultipleDrag) {
                var MultiDradDivUpdate = true,
                    loscz = $scope.modal.listOfSelectedComponents;
                for (var i = 0, l = loscz.length; i < l; i++) {
                    $scope.deselectComponent(loscz[i], MultiDradDivUpdate);
                }
            }
        }
        $scope.deleteAll = function() {
			var showNotification = false;
            var _scl = $scope.modal.listOfSelectedComponents,
                DivForMultiSelect = $("#dcc_" + _scl[0]);
            if ((DivForMultiSelect["0"] != undefined) && (DivForMultiSelect["0"].parentNode != undefined)) {
                var
                    parent = DivForMultiSelect["0"].parentNode,
                    parentId = parent.id;
            }
           /**DAS-1267 multiselect delete issue */
            /*for (var i = 0, l = _scl.length; i < l; i++) {*/
			for (var i = _scl.length - 1; i >= 0; i--) {
                /** Added for when component deleted using Del key or delete multiple comp bcz component deletion operation should be register in Undo Redo stack*/
            	 var comp = $scope.getComponentbyId(_scl[0]);
                 if ($scope.modal.layoutType == "AbsoluteLayout") {
                 	$scope.registerInHistory("delete", comp);
				}
				var a = $scope.removeComponentbyId(_scl[i]);

				if (a === "pinned") {
					showNotification = true;
				}
			}
			if (IsBoolean(showNotification)) {
				ServiceFactory.showNotification("Cannot remove: component(s) are pinned on mobile/tablet.", "alert-danger", 3000);
			}

            //			ServiceFactory.showNotification( "Deleted", "alert-success", 3000 );

            if (IsBoolean($scope.modal.userPreference.defaultSettings.enableMultipleDrag) && (parentId !== undefined) && ((parentId).indexOf("WrapDivForMultiSelect") !== -1)) {
                var $dccContainer = $("#" + parentId);
                $dccContainer.remove();
            }
        };

        /** @description Select all those component on the selected dashboard if the component is NOT HIDDEN & NOT SELECTED **/
        $scope.selectAllComponents = function() {
            var _compList = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object;
            if (_compList.length > 0 && _compList.length != $scope.modal.listOfSelectedComponents.length) {
                for (var i = 0; i < _compList.length; i++) {
                    var _cId = _compList[i]["objectID"],
                        _isHidden = IsBoolean(_compList[i]["unShowHidden"]);
                    if (!_isHidden && !$scope.isSelectedComponent(_cId)) {
                        $scope.selectComponent(_cId);
                    }
                }
                ServiceFactory.showNotification("All components are selected", "alert-info", 3000);
            }
            return _compList;
        };

        /** UNDO-REDO **/
        $scope.historyCounter = 0;
        $scope.registerInHistory = function(action, componentJson) {
            $scope.historyCounter++;
            var historyProperty = $scope.modal.currentHistoryProperties();
            if (historyProperty) {
                if (historyProperty.historyActiveStack.length > historyProperty.historyLength) {
                    historyProperty.historyStack.shift();
                    historyProperty.historyActiveStack.shift();
                    historyProperty.historyStackPointer--;
                }
                if (historyProperty.historyActiveStack.length > 0 && historyProperty.skipHistoryRegister) {
                    historyProperty.skipHistoryRegister = false;
                    /** redraw from history is happening here **/
                } else {
                    if (historyProperty.historyStackPointer != historyProperty.historyStack.length - 1) {
                        historyProperty.historyStack.splice(historyProperty.historyStackPointer + 1, historyProperty.historyStack.length);
                    }
                    var historyObject = angular.copy({
                        "action": action,
                        "object": componentJson,
                        "executionID": $scope.historyCounter
                    });
                    var obj;
                    switch (historyObject.action) {
                        case "add":
                            /** add as change again to make the component not deletable before add **/
                            historyObject = angular.copy({
                                "action": "change",
                                "object": componentJson
                            });
                            obj = {};
                            obj[historyObject.object.objectID] = new Array();
                            obj[historyObject.object.objectID].push(historyObject);
                            historyProperty.compHistory.push(obj);
                            historyProperty.historyStack.push(historyObject);
                            historyProperty.historyActiveStack.push(historyObject);
                            historyProperty.historyStackPointer++;
                            break;
                        case "oldComp":
                            /** Added for support old dashboard components **/
                            historyObject = angular.copy({
                                "action": "oldComp",
                                "object": componentJson
                            });
                            obj = {};
                            obj[historyObject.object.objectID] = new Array();
                            obj[historyObject.object.objectID].push(historyObject);
                            historyProperty.compHistory.push(obj);
                            historyProperty.historyStack.push(historyObject);
                            historyProperty.historyActiveStack.push(historyObject);
                            historyProperty.historyStackPointer++;
                            break;
                        case "change":
                        	for (var i = 0; i < historyProperty.compHistory.length; i++) {
                        	    if (Object.keys(historyProperty.compHistory[i])[0] === historyObject.object.objectID) {
                        	        historyProperty.compHistory[i][historyObject.object.objectID].push(angular.copy(historyObject));
                        	        break;
                        	    }
                        	}
                            historyProperty.historyStack.push(historyObject);
                            historyProperty.historyActiveStack.push(historyObject);
                            historyProperty.historyStackPointer++;
                            break;
                        case "groupAction":
                            break;
                        case "delete":
                        	for (var i = 0; i < historyProperty.compHistory.length; i++) {
                        	    if (Object.keys(historyProperty.compHistory[i])[0] === historyObject.object.objectID) {
                        	        historyProperty.compHistory[i][historyObject.object.objectID].push(angular.copy(historyObject));
                        	        break;
                        	    }
                        	}
                        	historyProperty.historyStack.push(historyObject);
                        	historyProperty.historyActiveStack.push(historyObject);
                        	historyProperty.historyStackPointer++;
                            break;
                        default:
                            break;
                    }
                }
                $scope.modal.currentHistoryProperties(historyProperty);
            }
        };
        $scope.executeHistory = function(historyObject) {
            switch (historyObject.action) {
                case "change":
                    $scope.replaceComponentInJson(historyObject.object);
                    $scope.redrawComponent(historyObject.object);
                    break;
                case "groupAction":
                    angular.forEach(historyObject.object, function(comp, index) {
                        if (comp) {
                            $scope.replaceComponentInJson(comp.object);
                            $scope.redrawComponent(comp.object);
                        }
                    });
                    break;
                case "add":
                    //TO DO
                    break;
                case "delete":
                    //TO DO
                    break;
                case "oldComp":
                	$scope.replaceComponentInJson(historyObject.object);
                    $scope.redrawComponent(historyObject.object);
                    break;
                default:
                    break;
            }
        };
        /** @description Need to change if required, replacing the, existing json inside main json with a new copy**/
        $scope.replaceComponentInJson = function(component) {
            if (component) {
                var cpy = angular.copy(component);
                angular.forEach($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object, function(comp, index) {
                    if (comp.objectID == cpy.objectID) {
                        $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object[index] = cpy;
                    }
                });
            }
        };
        
        $scope.copyProperties = function(compProp) {
		    //$scope.modal.copiedProperties = compProp;
		    var component = compProp.subElement;
			jsonObject = getDuplicateObject($scope.modal.copyJson);
		    for (var key in jsonObject) {
				if (key == "General") {
					for (var chartKey in jsonObject[key]) {
		                switch (chartKey) {
							case "Title":
		                        for (var titleKey in jsonObject[key][chartKey]) {
									if(compProp[component] !== undefined &&  compProp[component][chartKey] !== undefined)
										jsonObject[key][chartKey][titleKey] = compProp[component][chartKey][titleKey];
		                        }
		                        break;
		                    case "SubTitle":
		                        for (var subTitleKey in jsonObject[key][chartKey]) {
									if(compProp[component] !== undefined &&  compProp[component][chartKey] !== undefined)
										jsonObject[key][chartKey][subTitleKey] = compProp[component][chartKey][subTitleKey];
		                        }
		                        break;
	                        default:
		                    	if(compProp[component] !== undefined &&  compProp[component][chartKey] !== undefined)
		                        	jsonObject[key][chartKey] = compProp[component][chartKey];
		                        break;
						}
	                }
					
				}else if (key == "Chart") {
		            for (var chartKey in jsonObject[key]) {
		                switch (chartKey) {
		                    case "xAxis":
		                        for (var xAxisKey in jsonObject[key][chartKey]) {
									if(compProp[key] !== undefined &&  compProp[key][chartKey] !== undefined)				
		                            	jsonObject[key][chartKey][xAxisKey] = compProp[key][chartKey][xAxisKey];
		                        }
		                        break;
		                    case "yAxis":
		                        for (var yAxisKey in jsonObject[key][chartKey]) {
									if(compProp[key] !== undefined &&  compProp[key][chartKey] !== undefined)
		                            	jsonObject[key][chartKey][yAxisKey] = compProp[key][chartKey][yAxisKey];
		                        }
		                        break;
		                    /*case "CategoryColors":
		                        var categoryColorsObject = new CategoryColors();
		                        this.setCategoryColors(categoryColorsObject);
		                        for (var CategoryColorsKey in jsonObject[key][chartKey]) {
		                            switch (CategoryColorsKey) {
		                                case "CategoryColor":
		                                    var CategoryColorArray = this.getArrayOfSingleLengthJson(jsonObject[key][chartKey][CategoryColorsKey]);
		                                    categoryColorsObject.cateogryNameColorMap = new Object();
		                                    for (var i = 0; i < CategoryColorArray.length; i++) {
		                                        var categoryColorObject = new CategoryColor();
		                                        categoryColorsObject.setCategoryColor(categoryColorObject);
		                                        for (var CategoryColorKey in CategoryColorArray[i]) {
		                                            var propertyName = this.getNodeAttributeName(CategoryColorKey);
		                                            categoryColorObject[propertyName] = CategoryColorArray[i][CategoryColorKey];
		                                        }
		                                        categoryColorsObject.cateogryNameColorMap[categoryColorObject.getCategoryName()] = categoryColorObject.getColor();
		                                    }
		                                    break;
		                                default:
		                                    var propertyName = this.getNodeAttributeName(CategoryColorsKey);
		                                    nodeObject.m_categoryColors[propertyName] = jsonObject[key][chartKey][CategoryColorsKey];
		                                    break;
		                            }
		                        }
		                        categoryColorsObject.setCategoryDefaultColorSet();
		                        break;
		                    case "ConditionalColors":
		                        if (jsonObject[key][chartKey] != "") {
		                            var conditionalColorsObject = new ConditionalColors();
		                            this.setConditionalColors(conditionalColorsObject);
		                            var ConditionalColorArray = this.getArrayOfSingleLengthJson(jsonObject[key][chartKey]["ConditionalColor"]);
		                            for (var i = 0; i < ConditionalColorArray.length; i++) {
		                                var conditionalColorObject = new ConditionalColor();
		                                conditionalColorsObject.setConditionalColor(conditionalColorObject);
		                                for (var conditionalColorKey in ConditionalColorArray[i]) {
		                                    var propertyName = this.getNodeAttributeName(conditionalColorKey);
		                                    conditionalColorObject[propertyName] = ConditionalColorArray[i][conditionalColorKey];
		                                }
		                            }
		                        }
		                        break;*/
		                    default:
		                    	if(compProp[key] !== undefined &&  compProp[key][chartKey] !== undefined)
		                        	jsonObject[key][chartKey] = compProp[key][chartKey];
		                        break;
		                }
		            }
		        }else if (key == "Funnel") {
					for (var FunnelKey in jsonObject[key]) {
							switch (FunnelKey) {
							/*case "Title":
								for (var titleKey in jsonObject[key][FunnelKey]) {
									if(compProp[key] !== undefined &&  compProp[key][FunnelKey] !== undefined)				
		                            	jsonObject[key][FunnelKey][titleKey] = compProp[key][FunnelKey][titleKey];
								}
								break;
							case "SubTitle":
								for (var subTitleKey in jsonObject[key][FunnelKey]) {
									if(compProp[key] !== undefined &&  compProp[key][FunnelKey] !== undefined)				
		                            	jsonObject[key][FunnelKey][subTitleKey] = compProp[key][FunnelKey][subTitleKey];
								}
								break;*/
							case "legends":
								for (var legendsKey in jsonObject[key][FunnelKey]) {
									if(compProp[key] !== undefined &&  compProp[key][FunnelKey] !== undefined)				
		                            	jsonObject[key][FunnelKey][legendsKey] = compProp[key][FunnelKey][legendsKey];
								}
								break;
							default:
								if(compProp[key] !== undefined &&  compProp[key][FunnelKey] !== undefined)
		                        	jsonObject[key][FunnelKey] = compProp[key][FunnelKey];
								break;
						}
					}
				} else if (key == "DataGrid") {
		            for (var chartKey in jsonObject[key]) {
		                switch (chartKey) {
		                    /*case "Title":
		                        for (var titleKey in jsonObject[key][chartKey]) {
		                            if(compProp[key] !== undefined &&  compProp[key][chartKey] !== undefined)				
		                            	jsonObject[key][chartKey][titleKey] = compProp[key][chartKey][titleKey];
		                        }
		                        break;
		                    case "SubTitle":
		                        for (var subTitleKey in jsonObject[key][chartKey]) {
		                            if(compProp[key] !== undefined &&  compProp[key][chartKey] !== undefined)				
		                            	jsonObject[key][chartKey][subTitleKey] = compProp[key][chartKey][subTitleKey];
		                        }
		                        break;*/
		                    case "LinkButton":
		                        for (var linkButtonKey in jsonObject[key][chartKey]) {
		                            if(compProp[key] !== undefined &&  compProp[key][chartKey] !== undefined)				
		                            	jsonObject[key][chartKey][linkButtonKey] = compProp[key][chartKey][linkButtonKey];
		                        }
		                        break;
		                    case "Column":
		                        for (var columnKey in jsonObject[key][chartKey]) {
		                            if(compProp[key] !== undefined &&  compProp[key][chartKey] !== undefined)				
		                            	jsonObject[key][chartKey][columnKey] = compProp[key][chartKey][columnKey];
		                        }
		                        break;
		                    case "DatagridStyles":
		                        for (var datagridStylesKey in jsonObject[key][chartKey]) {
		                            if(compProp[key] !== undefined &&  compProp[key][chartKey] !== undefined)				
		                            	jsonObject[key][chartKey][datagridStylesKey] = compProp[key][chartKey][datagridStylesKey];
		                        }
		                        break;
		                    case "RowData":
		                        for (var rowDataKey in jsonObject[key][chartKey]) {
		                            if(compProp[key] !== undefined &&  compProp[key][chartKey] !== undefined)				
		                            	jsonObject[key][chartKey][rowDataKey] = compProp[key][chartKey][rowDataKey];
		                        }
		                        break;
		                    case "LinkBar":
		                        for (var linkBarKey in jsonObject[key][chartKey]) {
		                            if(compProp[key] !== undefined &&  compProp[key][chartKey] !== undefined)				
		                            	jsonObject[key][chartKey][linkBarKey] = compProp[key][chartKey][linkBarKey];
		                        }
		                        break;
		                    /*case "Alerts":
		                        for (var alertsKey in jsonObject[key][chartKey]) {
		                            if (alertsKey == "AlertColumn") {
		                                var alertJson = jsonObject[key][chartKey];
		                                var alertColumnJsonArray = this.getArrayOfSingleLengthJson(alertJson.AlertColumn);
		                                for (var i = 0; i < alertColumnJsonArray.length; i++) {
		                                    var alertColumnObj = new AlertColumn();
		                                    nodeObject.m_alerts.setAlertColumns(alertColumnObj);
		                                    var fieldname = this.getProperAttributeNameValue(alertColumnJsonArray[i], "name");
		                                    this.m_alertObj[fieldname] = alertColumnObj;
		                                    for (var attribute in alertColumnJsonArray[i]) {
		                                        this.setAttributeValueToNode(attribute, alertColumnJsonArray[i], alertColumnObj);
		                                    }
		                                }
		                            }
		                        }
		                        break;*/
		                    default:
		                        if(compProp[key] !== undefined &&  compProp[key][chartKey] !== undefined)
		                        	jsonObject[key][chartKey] = compProp[key][chartKey];
		                        break;
		                }
		            }
		        } else if (key == "Scorecard") {
					for (var chartKey in jsonObject[key]) {
						switch (chartKey) {
						/*case "TitleWindow":
							break;
						case "SubTitle":
							for (var subTitleKey in jsonObject[key][chartKey]) {
								if(compProp[key] !== undefined &&  compProp[key][chartKey] !== undefined)				
		                            jsonObject[key][chartKey][subTitleKey] = compProp[key][chartKey][subTitleKey];
							}
							break;*/
						case "SummaryRows":
							break;
						case "value":
							break;
						/*case "Alerts":
							if (this.m_designMode){
								this.parseDefaultAlertJson($.parseJSON(this.defaultAlertJson), nodeObject);
							}else {
								for (var alertsKey in jsonObject[key][chartKey]) {
									if (alertsKey == "AlertColumn") {
										var alertJson = jsonObject[key][chartKey];
										var alertColumnJsonArray = this.getArrayOfSingleLengthJson(alertJson.AlertColumn);
										for (var i = 0; i < alertColumnJsonArray.length; i++) {
											var alertColumnObj = new AlertColumn();
											nodeObject.m_alerts.setAlertColumns(alertColumnObj);
											var fieldname = this.getProperAttributeNameValue(alertColumnJsonArray[i], "name");
											this.m_alertObj[this.getStringARSC(fieldname)] = alertColumnObj;
											for (var attribute in alertColumnJsonArray[i]) {
												this.setAttributeValueToNode(attribute, alertColumnJsonArray[i], alertColumnObj);
											}
										}
									}
								}
							}
							break;*/
						default:
							if(compProp[key] !== undefined &&  compProp[key][chartKey] !== undefined)
		                        jsonObject[key][chartKey] = compProp[key][chartKey];
							break;
						}
					}
				} else {
		            jsonObject[key] = compProp[key];
		        }
		    }
			
			$scope.modal.copiedProperties = jsonObject;
			//$scope.modal.copiedCompleteProperties = getDuplicateObject(compProp);
			//$scope.redrawComponent(jsonObject);
		};
		
		$scope.pasteProperties = function(compProp) {
		    var jObj = getDuplicateObject($scope.modal.copiedProperties);
		
		    /*for (var key in compProp) {
		        if (jObj.hasOwnProperty(key)) {
		            var mapType = typeof(compProp[key]);
		            if (mapType === "object") {
		                for (var key1 in compProp[key]) {
		                    if (jObj[key].hasOwnProperty(key1)) {
		                        var mapType = typeof(compProp[key][key1]);
		                        if (mapType === "object") {
		                            for (var key2 in compProp[key][key1]) {
		                                if (jObj[key][key1].hasOwnProperty(key2) && jObj[key][key1][key2] !== "") {
		                                    compProp[key][key1][key2] = jObj[key][key1][key2];
		                                }
		                            }
		                        } else if (jObj[key][key1] !== ""){
		                            compProp[key][key1] = jObj[key][key1];
		                        }
		                    }
		
		
		                }
		            } else if(jObj[key] !== ""){
		            	compProp[key] = jObj[key];
		        	}
		        }
		    }*/
		    for (var key in jObj) {
		        if (compProp.hasOwnProperty(key) || key == "General") {
					if(key == "General")
						dupkey = compProp["subElement"];
					else
						dupkey = key;
		            var mapType = typeof(jObj[key]);
		            if (mapType === "object") {
		                for (var key1 in jObj[key]) {
		                    if (jObj[key].hasOwnProperty(key1)) {
		                        var mapType = typeof(jObj[key][key1]);
		                        if (mapType === "object" && dupkey == "Scorecard" && (key1 == "Title" || key1 == "DatagridStyles")) {
									for (var key2 in jObj[key][key1]) {
		                                if (jObj[key][key1].hasOwnProperty(key2) && jObj[key][key1][key2] !== "") {
											var key2val = key2.toLocaleLowerCase();
											if(key2 == "selectionColor"){
												compProp[dupkey]["selectedrowcolor"] = jObj[key][key1][key2];
											}
											if(compProp[dupkey][key2val] != undefined ){
												compProp[dupkey][key2val] = jObj[key][key1][key2];
											} else if(compProp[dupkey][key2] !== undefined) {
												compProp[dupkey][key2] = jObj[key][key1][key2];
											}
		                                }
		                            }
								} else if (mapType === "object") {
		                            for (var key2 in jObj[key][key1]) {
		                                if (jObj[key][key1].hasOwnProperty(key2) && jObj[key][key1][key2] !== "" && compProp[dupkey][key1] !== undefined && compProp[dupkey][key1][key2] !== undefined) {
		                                    compProp[dupkey][key1][key2] = jObj[key][key1][key2];
		                                }
		                            }
		                        } else if (jObj[key][key1] !== "" && compProp[dupkey][key1] !== undefined){
		                            compProp[dupkey][key1] = jObj[key][key1];
		                        }
		                    }
		                }
		            } else if(jObj[key] !== "" && compProp[dupkey] !== undefined){
		            	compProp[dupkey] = jObj[key];
		        	}
		        }
		    }
		
		    $scope.redrawComponent(compProp);
		};

        /** Duplicate the component **/
        $scope.duplicateComponent = function(cId) {
            var comp = $scope.getComponentbyId(cId);
            var data = comp.designData;
            var aDbOffset = $("#" + $scope.getActiveDashboardId()).parent().parent().offset();
            var xPos = parseInt(comp.x) + 30;
            xPos = (xPos - xPos%$scope.modal.bgGridSize);
            xPos = (xPos < (10 + aDbOffset.left)) ? (30 + aDbOffset.left) : xPos;
            var yPos = parseInt(comp.y) + 30;
            yPos = (yPos - yPos%$scope.modal.bgGridSize);
            yPos = (yPos < (10 + aDbOffset.top)) ? (30 + aDbOffset.top) : yPos;
            var obj = {
                event: {
                    pageX: xPos,
                    pageY: yPos
                },
                duplicating: true
            };
            $scope.onDropComplete(data, obj, comp);
        };

        /**@description sends the selected/specified component at one position bottom **/
        $scope.sendToBack = function(objId) {
            var cIdTgt = objId || $scope.modal.selectedComponentId;
            if ($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object.length != 1) {
                var cIdRef = $scope.getBackComponentId(cIdTgt);
                $scope.swapCompIndexes(cIdTgt, cIdRef);
                $scope.swapZindexes(cIdTgt, cIdRef);
                $scope.modal.notifyObjectListChange();
            }
        };
        /**@description brings the selected/specified component on one position top **/
        $scope.bringToFront = function(objId) {
            var cIdTgt = objId || $scope.modal.selectedComponentId;
            var zIndexTgt = $("#dcc_" + cIdTgt)[0].style.zIndex * 1;
            var maxZindex = $scope.getMaxZindexOriginal();
            if (zIndexTgt != maxZindex) {
                var cIdRef = $scope.getFrontComponentId(cIdTgt);
                $scope.swapCompIndexes(cIdTgt, cIdRef);
                $scope.swapZindexes(cIdTgt, cIdRef);
                $scope.modal.notifyObjectListChange();
            }
        };
        /**@description sends the selected component at the bottom most position **/
        $scope.sendBackward = function() {
            var cIdTgt = $scope.modal.selectedComponentId;
            var zIndexTgt = $("#dcc_" + cIdTgt)[0].style.zIndex * 1;
            var minZindex = $scope.getMinZindex();
            while (zIndexTgt > minZindex) {
                $scope.sendToBack();
                zIndexTgt = $("#dcc_" + cIdTgt)[0].style.zIndex * 1;
            }
        };
        /**@description brings the selected component on the top most position **/
        $scope.bringForward = function() {
            var cIdTgt = $scope.modal.selectedComponentId;
            var zIndexTgt = $("#dcc_" + cIdTgt)[0].style.zIndex * 1;
            var maxZindex = $scope.getMaxZindexOriginal();
            while (zIndexTgt < maxZindex) {
                $scope.bringToFront();
                zIndexTgt = $("#dcc_" + cIdTgt)[0].style.zIndex * 1;
            }
        };
        /**@description swap the component indexes in the absolute layout's object list @param cIdTgt - target component, cIdRef - refrence component **/
        $scope.swapCompIndexes = function(cIdTgt, cIdRef) {
            var cIndexTgt = $scope.getComponentIndex(cIdTgt),
                cIndexRef = $scope.getComponentIndex(cIdRef),
                dbObjs = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object,
                cObjTgt = null,
                cObjRef = null;
            if (cIndexTgt != undefined && cIndexRef != undefined && dbObjs != undefined && typeof(dbObjs) === "object") {
                cObjTgt = dbObjs[cIndexTgt];
                cObjRef = dbObjs[cIndexRef];
                dbObjs[cIndexTgt] = cObjRef;
                dbObjs[cIndexRef] = cObjTgt;
            }
        };
        /**@description swap the zIndexes of the specified component @param cIdTgt - target component, cIdRef - refrence component **/
        $scope.swapZindexes = function(cIdTgt, cIdRef) {
            var zIndexTgt = $("#dcc_" + cIdTgt)[0].style.zIndex;
            var zIndexRef = (cIdRef === undefined)?undefined:$("#dcc_" + cIdRef)[0].style.zIndex;
            if (zIndexTgt && zIndexRef) {
                $("#dcc_" + cIdTgt).css("zIndex", zIndexRef);
                $("#dcc_" + cIdRef).css("zIndex", zIndexTgt);
            }
        };

        /** Switching the z-index of component by context menu action **/
        $scope.getComponentIndex = function(cIdTgt) {
            var dbObjs = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object;
            if (dbObjs && typeof(dbObjs) === "object") {
                for (var i = 0; i < dbObjs.length; i++) {
                    var compObj = dbObjs[i];
                    if (compObj && compObj["objectID"] == cIdTgt) {
                        return i;
                    }
                }
            }
            return null;
        };
        $scope.getBackComponentId = function(cIdTgt) {
            var dbId = $scope.modal.selectedDashboard.id;
            var zIndexTgt = $("#" + dbId + " #dcc_" + cIdTgt)[0].style.zIndex * 1;
            var zIndexRef = zIndexTgt * 1 - 1;
            while (!$scope.isAssignedZindex(zIndexRef) && zIndexRef>-1) {
                zIndexRef--;
            }
            var $comps = $("#" + dbId + " .bizvizComponent");
            for (var i = 0; i < $comps.length; i++) {
                var zIndex = $comps[i].style.zIndex * 1;
                if (zIndex == zIndexRef) {
                    return $comps[i]["id"].split("dcc_")[1];
                }
            }
        };
        $scope.isAssignedZindex = function(zIndex) {
            var dbId = $scope.modal.selectedDashboard.id;
            var $comps = $("#" + dbId + " .bizvizComponent");
            for (var i = 0; i < $comps.length; i++) {
                var zIc = $comps[i].style.zIndex * 1;
                if (zIndex == zIc) {
                    return true;
                }
            }
            return false;
        };
        $scope.getMinZindex = function() {
            var dbId = $scope.modal.selectedDashboard.id;
            var $comps = $("#" + dbId + " .bizvizComponent"),
                minZindex = $comps.length != 0 ? $comps[0].style.zIndex * 1 : 0;
            for (var i = 1; i < $comps.length; i++) {
                var zIndex = $comps[i].style.zIndex * 1;
                if (zIndex < minZindex) {
                    minZindex = zIndex;
                }
            }
            return minZindex;
        };
        $scope.getMaxZindex = function() {
            var dbId = $scope.modal.selectedDashboard.id;
            var $comps = $("#" + dbId + " .bizvizComponent"),
                maxZindex = $comps.length != 0 ? $comps[$comps.length - 1].style.zIndex*1+1 : 0;
            for (var i = 1; i < $comps.length; i++) {
                var zIndex = $comps[i].style.zIndex * 1;
                if (zIndex > maxZindex) {
                    maxZindex = zIndex;
                }
            }
            return maxZindex;
        };
        $scope.getMaxZindexOriginal = function() {
            var dbId = $scope.modal.selectedDashboard.id;
            var $comps = $("#" + dbId + " .bizvizComponent"),
                maxZindex = $comps.length != 0 ? $comps[$comps.length - 1].style.zIndex*1 : 0;
            for (var i = 0; i < $comps.length; i++) {
                var zIndex = $comps[i].style.zIndex * 1;
                if (zIndex > maxZindex) {
                    maxZindex = zIndex;
                }
            }
            return maxZindex;
        };
        $scope.getFrontComponentId = function(cIdTgt) {
            var dbId = $scope.modal.selectedDashboard.id;
            var zIndexTgt = $("#" + dbId + " #dcc_" + cIdTgt)[0].style.zIndex * 1;
            var zIndexRef = zIndexTgt * 1 + 1;
            while (!$scope.isAssignedZindex(zIndexRef)) {
                zIndexRef++;
            }
            var $comps = $("#" + dbId + " .bizvizComponent");
            for (var i = 0; i < $comps.length; i++) {
                var zIndex = $comps[i].style.zIndex * 1;
                if (zIndex == zIndexRef) {
                    return $comps[i]["id"].split("dcc_")[1];
                }
            }
        };
        $scope.getForwardComponentId = function() {
            var dbId = $scope.modal.selectedDashboard.id;
            var maxZindex = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object.length;
            var $comps = $("#" + dbId + " .bizvizComponent");
            for (var i = 0; i < $comps.length; i++) {
                var zIndex = $comps[i].style.zIndex * 1;
                if (zIndex == maxZindex) {
                    return $comps[i]["id"].split("dcc_")[1];
                }
            }
        };
        $scope.getBackwardComponentId = function() {
            var dbId = $scope.modal.selectedDashboard.id;
            var $comps = $("#" + dbId + " .bizvizComponent");
            var minZindex = $scope.getMinZindex();
            for (var i = 0; i < $comps.length; i++) {
                var zIndex = $comps[i].style.zIndex * 1;
                if (zIndex == minZindex) {
                    return $comps[i]["id"].split("dcc_")[1];
                }
            }
        };

        /**GROUP MANAGEMENT **/
        $scope.selectedGroup = "";
        $scope.newGroup = null;
        $scope.fromExistingGroup = false;
        /**@description return available groups of selected dashboard **/
        $scope.getDashboardGroups = function() {
            return $scope.modal.selectedDashboard.json.Dashboard.componentGroups;
        };
        /**@description return group object of specified group name @param gName - name of the group **/
        $scope.getGroupByGroupName = function(gName) {
            var dashboardGroups = $scope.getDashboardGroups();
            for (var i = 0; i < dashboardGroups.length; i++) {
                if (dashboardGroups[i].gName === gName) {
                    return dashboardGroups[i];
                }
            }
            return null;
        };
        /**@description resets the value of selected group **/
        $scope.resetGroupManagement = function() {
            $scope.selectedGroup = "";
            $scope.newGroup = "";
            $scope.fromExistingGroup = false;
        };
        /**@description return list of selected components on the current dashboard as array of component ids **/
        $scope.getSelectedComponents = function() {
            return $scope.modal.listOfSelectedComponents;
        };
        /**@description return currently selected group name **/
        $scope.getSelectedGroup = function() {
            return $scope.selectedGroup;
        };
        /**@description checks whether the group of specified name is already created or not @param gName - name of the group **/
        $scope.isNewDashboardGroup = function(gName) {
            var result = true;
            var dbGroups = $scope.getDashboardGroups();
            for (var i = 0; i < dbGroups.length; i++) {
                if (dbGroups[i].gName === gName) {
                    result = false;
                    break;
                }
            }
            return result;
        };
        /**@description adds the newly created group into the dashboard group list @param group - the group object **/
        $scope.addToDashboardGroups = function(group) {
            if ($scope.isNewDashboardGroup(group.gName)) {
                $scope.getDashboardGroups().push(group);
                $scope.newGroup = "";
                $timeout(function() {
                    $scope.selectGroup(null, group.gName);
                    $scope.$apply();
                }, 10);
            } else {
                ServiceFactory.showNotification("Group name is already exist", "alert-warning", 3000);
            }
        };

        /**@description creates and add a new dashboard group to the dashboard group list @param gName - the group name **/
        $scope.createNewDashboardGroup = function(gName) {
            var gNameWithoutWhiteSpace = gName.replace(/\s/g, "");
            if (gNameWithoutWhiteSpace == "") {
                ServiceFactory.showNotification("Group name can not be empty", "alert-danger", 3000);
                return false;
            }
            var g = gNameWithoutWhiteSpace.split(",");
            var newDashboardGroup = null;
            for (var i = 0; i < g.length; i++) {
                newDashboardGroup = {
                    gName: g[i],
                    aCompIds: []
                }
                $scope.addToDashboardGroups(newDashboardGroup);
            }
        };
        /**@description manages the group inside the supplied component object and returns
         * list of assigned groups as comma separated string of groups
         * @param { object } compObj - the component object
         * @param { string | array } group - the group in the form of string or array of string
         * @param { string } action - the action performed as ADD or REMOVE **/
        $scope.manageGroupingInComponent = function(compObj, group, action) {
            var
                existingGroups = compObj["groupings"],
                groupArray = existingGroups ? existingGroups.replace(/\s/g, "").split(",") : [],
                newGroups = "",
                index = -1;
            if (action && action === "ADD") {
                if (group && typeof(group) === "string") {
                    if (group.indexOf(",") == -1) {
                        if (!ServiceFactory.isArrayContains(groupArray, group)) {
                            groupArray.push(group);
                        }
                    } else {
                        return $scope.manageGroupingInComponent(compObj, group.split(","), "ADD");
                    }
                } else if (group && ServiceFactory.isArray(group)) {
                    for (var i = 0; i < group.length; i++) {
                        if (!ServiceFactory.isArrayContains(groupArray, group[i])) {
                            groupArray.push(group[i]);
                        }
                    }
                } else {
                	// Do nothing
                }
                $scope.newGroup = "";
            } else if (action && action === "REMOVE") {
                if (group && typeof(group) === "string") {
                    index = groupArray.indexOf(group);
                    groupArray.splice(index, 1);
                } else if (group && ServiceFactory.isArray(group)) {
                    for (var i1 = 0; i1 < group.length; i1++) {
                        index = groupArray.indexOf(group[i1]);
                        groupArray.splice(index, 1);
                    }
                } else {
                	// Do nothing
                }
            } else {
            	// Do nothing
            }
            for (var i2 = 0; i2 < groupArray.length; i2++) {
                newGroups += groupArray[i2] + ",";
            }
            newGroups = newGroups.substring(0, newGroups.length - 1);
            return newGroups;
        };
        /**@description adds the selected component to the selected group and then manage groups inside the component **/
        $scope.addSelectedComponentToSelectedGroup = function() {
            var selectedComponents = $scope.getSelectedComponents();
            var selectedGroup = $scope.getGroupByGroupName($scope.selectedGroup);
            var aComps = selectedGroup.aCompIds;
            for (var i = 0; i < selectedComponents.length; i++) {
                if (!ServiceFactory.isArrayContains(aComps, selectedComponents[i])) {
                    var compObj = $scope.getComponentbyId(selectedComponents[i]);
                    compObj["groupings"] = $scope.manageGroupingInComponent(compObj, $scope.selectedGroup, "ADD");
                    aComps.push(selectedComponents[i]);
                }
            }
        };
        /**@description removes component from group and then manage groups inside the component
         * @param cId - the component Id, gName - the group name **/
        $scope.removeComponentFromDashboardGroup = function(cId, gName) {
            var selectedGroup,
                aComps,
                index;
            try {
                selectedGroup = $scope.getGroupByGroupName(gName);
                if (selectedGroup) {
                    aComps = selectedGroup.aCompIds;
                    index = aComps.indexOf(cId);
                    if (index != -1) {
                        var compObj = $scope.getComponentbyId(cId);
                        compObj["groupings"] = $scope.manageGroupingInComponent(compObj, gName, "REMOVE");
                        /** Remove grouping from mobile and tablet view component if component exist */
                        var mobileCompObj = $scope.getComponentFromMobileLayout(cId);
                        if (mobileCompObj) {
                        	mobileCompObj["groupings"] = $scope.manageGroupingInComponent(mobileCompObj, gName, "REMOVE");
                        }
                        var tabletCompObj = $scope.getComponentFromTabletLayout(cId);
                        if (tabletCompObj) {
                        	tabletCompObj["groupings"] = $scope.manageGroupingInComponent(tabletCompObj, gName, "REMOVE");
                        }
                        aComps.splice(index, 1);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        /** @description Deletes the group from designer and from component assigned to it **/
        $scope.removeGroup = function(e, group) {
            var dbGroups;
            e.stopPropagation();
            try {
                dbGroups = $scope.getDashboardGroups();
                if (group.aCompIds.length) {
                    for (var i = 0; i < group.aCompIds.length; i++) {
                        $scope.removeComponentFromDashboardGroup(group.aCompIds[i], group.gName);
                    }
                }
                dbGroups.splice(dbGroups.indexOf(group), 1);
                if (dbGroups.length == 0) {
                    $scope.fromExistingGroup = false;
                }
            } catch (error) {
                console.error(error);
            }
        };
        /**@description selects a group @param  e - the event, selectedGroup - the group to be selected  **/
        $scope.selectGroup = function(e, selectedGroup) {
            var isSelectedGroup = null,
                $target = null;
            if (e) {
                $target = $(e.currentTarget);
            } else {
                $target = $("#" + selectedGroup);
            }
            isSelectedGroup = $target.hasClass("c-active-group");
            $(".c-group").removeClass("c-active-group");
            $(".a-comps").hide();
            if (isSelectedGroup) {
                $target.removeClass("c-active-group");
                $target.parent().find(".a-comps").hide();
                $scope.selectedGroup = "";
                $scope.fromExistingGroup = false;
            } else {
                $target.addClass("c-active-group");
                $target.parent().find(".a-comps").show();
                $scope.selectedGroup = selectedGroup;
                $scope.fromExistingGroup = true;
            }
        };
        /**@description opens ADD TO GROUP dialog box **/
        $scope.showAddToGroupDialog = function() {
            $scope.newGroup = "";
            $scope.showModelPopup("addGroupDialog");
        };
        $scope.applyGlobalProperty = function(property) {
        	var existingComponents = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object,
                isExistingComponent = existingComponents.length > 0,
                cJson = null;
            if ($scope.updatedJson === undefined) {
                $scope.updatedJson = {};
            }
            var globalproperty = Object.assign(property,$scope.globalPropertyMapping.options);
            $scope.selectedGlobalProperty[$scope.getActiveDashboardId()][$scope.modal.layoutType] = $scope.propertyUpdate(globalproperty, $scope.selectedGlobalProperty[$scope.getActiveDashboardId()][$scope.modal.layoutType]);
            if(IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout"){
            	$scope.selectedGlobalProperty[$scope.getActiveDashboardId()]["MobileLayout"] = $scope.propertyUpdate(globalproperty, $scope.selectedGlobalProperty[$scope.getActiveDashboardId()][$scope.modal.layoutType]);
            	$scope.selectedGlobalProperty[$scope.getActiveDashboardId()]["TabletLayout"] = $scope.propertyUpdate(globalproperty, $scope.selectedGlobalProperty[$scope.getActiveDashboardId()][$scope.modal.layoutType]);
            	$scope.modal.selectedDashboard.json.Dashboard["MobileLayout"].globalProperties = $scope.selectedGlobalProperty[$scope.getActiveDashboardId()]["MobileLayout"];
            	$scope.modal.selectedDashboard.json.Dashboard["TabletLayout"].globalProperties = $scope.selectedGlobalProperty[$scope.getActiveDashboardId()]["TabletLayout"];
    		} 
            $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].globalProperties = $scope.selectedGlobalProperty[$scope.getActiveDashboardId()][$scope.modal.layoutType];
            if (isExistingComponent) {
                for (var i = 0; i < existingComponents.length; i++) {
                    cJson = existingComponents[i];
                    if (cJson.newdrag === undefined) {
                        $scope.updatedJson[cJson.objectID] = getDuplicateObject(cJson);
                    } else {
                        delete cJson["newdrag"];
                    }
                    var themes = $scope.selectedGlobalProperty[$scope.getActiveDashboardId()][$scope.modal.layoutType];
                    $scope.onGetGloalPropertyJsonDataOfComponent(themes, cJson);
                }
            }
        };

        /** DESIGNER THEME MANAGEMENT **/

        /**@description return the active dashboard id **/
        $scope.getActiveDashboardId = function() {
            return $scope.modal.selectedDashboard.id;
        };
        /**@description gets the default component configuration according to the theme selected
         * @param { object } cJson - the component json
         * @param { function } cbFun - the callback function in which the component json and the theme json is passed as arguments
         **/
        $scope.getThemeJson = function(cJson, args, cbFun) {
            var themes = $scope.selectedTheme[$scope.getActiveDashboardId()];
            var filePath;
//            var filePath = "./resources/bizvizchart-themes/" + themes + "/" + cJson.designData.type + "/" + cJson.designData.class + ".data";
            /**Remove else, when implemented for all themes**/
            if (themes !== "default-theme") {
            	filePath = "./resources/bizvizchart-themes/" + themes + "/themeConfig.data";
            } else {
            	filePath = "./resources/bizvizchart-themes/" + themes + "/" + cJson.designData.type + "/" + cJson.designData.class + ".data";
            }
            ServiceFactory.getJsonFileData(
                filePath,
                function(response) {
                    cbFun && cbFun(response, args);
                },
                ((args) ? args : null),
                function(status, passedData) {
                    if (status === 404) {
                        ServiceFactory.showNotification($scope.selectedTheme[$scope.getActiveDashboardId()] + " configuration not found. Rendering from default-theme", "alert-info", 3000);
                        ServiceFactory.getJsonFileData(
                            "./resources/bizvizchart-themes/default-theme/" + cJson.designData.type + "/" + cJson.designData.class + ".data",
                            function(response) {
                                cbFun && cbFun(response, args);
                            },
                            ((args) ? args : null),
                            function(status, passedData) {
                                if (status === 404) {}
                            });
                    }
                });
        };
        
        /**Getting the default-theme json on importing the dashboard (.bvzx) **/
        $scope.getThemeJsonOnImport = function(cJson, args, cbFun) {
//            var themes = $scope.selectedTheme[$scope.getActiveDashboardId()];
//            var filePath = "./resources/bizvizchart-themes/" + themes + "/" + cJson.designData.type + "/" + cJson.designData.class + ".data";
            var filePath = "./resources/bizvizchart-themes/default-theme/" + cJson.designData.type + "/" + cJson.designData.class + ".data";
            ServiceFactory.getJsonFileData(filePath,
                function(response) {
                    cbFun && cbFun(response, args);
                },
                ((args) ? args : null),
                function(status, passedData) {
                    if (status === 404) {
                        ServiceFactory.showNotification($scope.selectedTheme[$scope.getActiveDashboardId()] + " configuration not found. Rendering from default-theme", "alert-info", 3000);
                        ServiceFactory.getJsonFileData("./resources/bizvizchart-themes/default-theme/" + cJson.designData.type + "/" + cJson.designData.class + ".data",
                            function(response) {
                                cbFun && cbFun(response, args);
                            },
                            ((args) ? args : null),
                            function(status, passedData) {
                                if (status === 404) {}
                            });
                    }
                });
        };

        /**@description returns the dataset colors A/C to the theme specified
         * @param { string } theme - the name of the theme
         **/
        $scope.getDatasetColorsFromTheme = function(theme) {
            return $scope.designerThemeInfo[theme]["datasetColors"] || [];
        };

        /**@description apply the specified theme to all the existing components and next component
         * @param { string } theme - the name of the theme
         **/
        $scope.applyDesignerTheme = function(theme) {
			var existingComponents = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object,
		    isExistingComponent = existingComponents.length > 0,
		    cJson = null;
		
			if ($scope.updatedJson === undefined) {
			    $scope.updatedJson = {};
			}
			if ($scope.themesOnLoad === undefined) {
			    $scope.themesOnLoad = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.designerTheme;
			}
			/**Below condition is for disabling global properties while switching themes**/
			if($scope.globalPropertyMapping !== undefined){
				var keys = Object.keys($scope.globalPropertyMapping.options);
	        	for (var j = 0; j < keys.length; j++) {
	        		$scope.selectedGlobalProperty[$scope.getActiveDashboardId()][$scope.modal.layoutType][keys[j]] = false;
	        		$scope.globalPropertyMapping.options[keys[j]] = false;
	        	}
	        	$scope.applyGlobalProperty($scope.globalPropertyMapping.properties);
			}
			$scope.selectedTheme[$scope.getActiveDashboardId()] = theme;
			$scope.loadDesignerThemeInfo(theme, function() {
			    var themes = $scope.selectedTheme[$scope.getActiveDashboardId()];
			    var filePath = (themes !== "default-theme") ? "./resources/bizvizchart-themes/" + themes + "/themeConfig.data" : "";
			    var cachedData = (themes !== "default-theme") ? $scope.getHttpCachedData(filePath) : "";
			    
			    /**Below bgcolor variable is for updating dashboard bg color on switching themes **/
			    if (themes !== "default-theme" && cachedData && cachedData[0] == 200) {
			        var bggradients = JSON.parse(cachedData[1])["dashboardTheme"].Dashboard["backgroundColor"];
			    } else {
			        var bggradients = "#FFFFFF";
			    }
			    $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].gradients = bggradients;
				$scope.modal.selectedDashboard.json.Dashboard["MobileLayout"].gradients = bggradients;
				$scope.modal.selectedDashboard.json.Dashboard["TabletLayout"].gradients = bggradients;
			    $scope.setDashboardCSS($scope.modal.userPreference);
			
			    if (isExistingComponent) {
			        for (var i = 0; i < existingComponents.length; i++) {
			            cJson = existingComponents[i];
			            if (cJson.newdrag === undefined && (cJson.themeType === $scope.themesOnLoad || cJson.themeType === undefined)) {
			                $scope.updatedJson[cJson.objectID] = getDuplicateObject(cJson);
			            } else {
			                delete cJson["newdrag"];
			                $scope.themesOnLoad = (i === (existingComponents.length - 1)) ? "" : $scope.themesOnLoad;
			            }
			            cJson.themeType = theme;
			            var themes = $scope.selectedTheme[$scope.getActiveDashboardId()];
			
			            /*if (themes === "default-theme") {
			            	var filePath = "./resources/bizvizchart-themes/" + themes + "/" + cJson.designData.type + "/" + cJson.designData.class + ".data";
			            } else {
			            	var filePath = "./resources/bizvizchart-themes/" + themes + "/" + cJson.designData.type + "/themeConfig.data";
			            }*/
			            /**Remove if-else, when implemented for all themes and write above commented code**/
			            var filePath = (themes !== "default-theme") ? "./resources/bizvizchart-themes/" + themes + "/themeConfig.data" : "./resources/bizvizchart-themes/" + themes + "/" + cJson.designData.type + "/" + cJson.designData.class + ".data";
			            var cachedData = $scope.getHttpCachedData(filePath);
			            if (cachedData && cachedData[0] == 200) {
			                var parsedData = (themes !== "default-theme") ? JSON.parse(cachedData[1])["DashboardObjects"] : JSON.parse(cachedData[1]);
			                var parsedData1 = (themes !== "default-theme") ? JSON.parse(cachedData[1])["dashboardTheme"] : JSON.parse(cachedData[1]);
			                $scope.onGetThemeJsonDataOfComponent(parsedData, cJson, parsedData1);
			            } else {
			                $scope.getThemeJson(cJson, existingComponents[i], function(tData, ocJson) {
			                    $scope.onGetThemeJsonDataOfComponent(tData, ocJson);
			                });
			            }
			        }
			    }
			});
		};

        $scope.onGetThemeJsonDataOfComponent = function(tData, ocJson, dthemeJson) {
        	var compJsonObj = tData[ocJson.designData.class].Properties.Object;
        	if ($scope.updatedJson && (compJsonObj.themeType === "default-theme") && $scope.updatedJson[ocJson.objectID] !== undefined ) {
        		tData[ocJson.designData.class].Properties.Object = getDuplicateObject($scope.updatedJson[ocJson.objectID]);  
        	}
        	$scope.newjson = $scope.themeUpdate(tData, ocJson);
            $scope.modal.rawComponentJSONlist[ocJson.designData.class].Properties = tData[ocJson.designData.class].Properties;
            
            /**Below conditions are to update theme series colors in the designer view **/
            if(dthemeJson !== undefined && compJsonObj.themeType !== "default-theme" && Array.isArray($scope.modal.selectedDashboard.componentObjectList[ocJson.objectID].m_fieldsJson)){
				$scope.modal.selectedDashboard.componentObjectList[ocJson.objectID].m_fieldsJson.forEach(function(obj, ind){
					if(obj.Color !== undefined && dthemeJson.datasetColors !== undefined && dthemeJson.datasetColors[ind] !== undefined){
						obj.Color = dthemeJson.datasetColors[ind];
					}
				})
			} else if (compJsonObj.themeType == "default-theme" && Array.isArray($scope.modal.selectedDashboard.componentObjectList[ocJson.objectID].m_fieldsJson)){
				var colorArr = (dthemeJson !== undefined ) ? dthemeJson[ocJson.designData.class].Fields : tData[ocJson.designData.class].Fields;
				$scope.modal.selectedDashboard.componentObjectList[ocJson.objectID].m_fieldsJson.forEach(function(obj, ind){
						if(obj.Color !== undefined && colorArr[ind].Color !== undefined){
							obj.Color = colorArr[ind].Color;
						}
					})
			}
            
            /**	PREVENTING OBJECTS **/
            var id = ocJson[ocJson["subElement"]]["id"] || "";
            var dataSet = ocJson[ocJson["subElement"]]["DataSet"] || "",
                conditionalColors = ocJson[ocJson["subElement"]]["ConditionalColors"] || {},
                categoryColors = ocJson[ocJson["subElement"]]["CategoryColors"] || {},
                nObj = $scope.newjson;
            /** RE-PLACEING PREVENTED OBJECTS **/
            nObj["id"] = id;
            nObj["DataSet"] = dataSet;
            nObj["ConditionalColors"] = conditionalColors;
            nObj["CategoryColors"] = categoryColors;
            var ncJson = $scope.updateDatasetColorsWithTheme(ocJson);
            ncJson[ocJson["subElement"]] = nObj;
            $scope.redrawComponent(ncJson);
        };
        
        /**Updating theme json, when themes has beeen changed from dashboard property pallette**/
        $scope.themeUpdate = function(tData, ocJson) {
        	var updatedJson = getDuplicateObject(ocJson[ocJson["subElement"]]);
        	var tDJsonData = getDuplicateObject(tData[ocJson.designData.class].Properties.Object[ocJson["subElement"]]);

        	for (var key in tDJsonData) {
        	    if (tDJsonData.hasOwnProperty(key)) {
        	    	var mapType = typeof(tDJsonData[key]);
        	    	if (mapType === "object") {
        	    		for(var key1 in tDJsonData[key]) {
            	        	updatedJson[key][key1] = tDJsonData[key][key1];
            	        }
        	    	} else {
        	    		updatedJson[key] = tDJsonData[key];
        	    	}
        	    }
        	}
        	return updatedJson;
        };
        /**@description apply the specified properties to all the existing components and next component        **/
        $scope.onGetGloalPropertyJsonDataOfComponent = function(tData, ocJson) {
         	var compJsonObj = tData;
         	$scope.newjson = $scope.propertyUpdate(tData, ocJson[ocJson["subElement"]], ocJson["subElement"]);
         	if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
         		var mobileLayoutJson = $scope.modal.selectedDashboard.json.Dashboard.MobileLayout.Object;
         		var mindex = mobileLayoutJson.findIndex(function(obj) {
         			return obj.objectID === ocJson.objectID;
         		});
         		if (mindex != -1) {
         			mocJson = mobileLayoutJson[mindex];
         			mobileLayoutJson[mindex][mocJson["subElement"]] = $scope.propertyUpdate(tData, mocJson[mocJson["subElement"]], mocJson["subElement"]);
         		}
         		var tabletLayoutJson = $scope.modal.selectedDashboard.json.Dashboard.TabletLayout.Object;
         		var tindex = tabletLayoutJson.findIndex(function(obj) {
         			return obj.objectID === ocJson.objectID;
         		});
         		if (tindex != -1) {
         			tocJson = tabletLayoutJson[tindex];
         			tabletLayoutJson[tindex][tocJson["subElement"]] = $scope.propertyUpdate(tData, tocJson[tocJson["subElement"]], tocJson["subElement"]);
         		}
         	}
         	//$scope.modal.rawComponentJSONlist[ocJson.designData.class].Properties = tData;
         	/**	PREVENTING OBJECTS **/
         	var id = ocJson[ocJson["subElement"]]["id"] || "";
         	var dataSet = ocJson[ocJson["subElement"]]["DataSet"] || "",
         		conditionalColors = ocJson[ocJson["subElement"]]["ConditionalColors"] || {},
         		categoryColors = ocJson[ocJson["subElement"]]["CategoryColors"] || {},
         		nObj = $scope.newjson;
         	/** RE-PLACEING PREVENTED OBJECTS **/
         	nObj["id"] = id;
         	nObj["DataSet"] = dataSet;
         	nObj["ConditionalColors"] = conditionalColors;
         	nObj["CategoryColors"] = categoryColors;
         	var ncJson = $scope.updateDatasetColorsWithTheme(ocJson);
         	ncJson[ocJson["subElement"]] = nObj;
         	$scope.redrawComponent(ncJson);
         };
        /**Updating property json, when properties has beeen changed from dashboard global property pallette**/
        $scope.propertyUpdate = function(tData, ocJson, compType) {
            var compJsonData = getDuplicateObject(ocJson),
                mappingData = getDuplicateObject(tData),
                check;
            if ($scope.globalPropertyMapping != undefined) {
                var property = $scope.globalPropertyMapping.options;
                for (var key0 in property) {
                    if (IsBoolean(property[key0])) {
                        check = key0.replace("Value", "");
                        if (compType == undefined || (check == "Background") || (compType == "Chart" || compType == "DataGrid" || compType == "Funnel" || compType == "InvertedFunnel" || compType == "Pyramid" || compType == "Scorecard")) {
                            var tDJsonData = mappingData[check];
                            var updatedJson = compJsonData[check] != undefined ? compJsonData[check] : compJsonData;
                            if (compType == "Scorecard") {
                                if (check == "Title") {
                                    updatedJson = compJsonData;
                                } else if (check == "xAxis" || check == "yAxis") {
                                    updatedJson = "";
                                } else {}
                            }
                            for (var key in tDJsonData) {
                                if (tDJsonData.hasOwnProperty(key)) {
                                    var mapType = typeof(tDJsonData[key]);
                                    if (mapType === "object") {
                                        for (var key1 in tDJsonData[key]) {
                                            if (updatedJson[key][key1] != undefined) {
                                                updatedJson[key][key1] = tDJsonData[key][key1];
                                            }
                                        }
                                    } else {
                                        if (updatedJson != undefined && updatedJson[key] != undefined) {
                                            updatedJson[key] = tDJsonData[key];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return compJsonData;
        };

        /**@description updates the dataset colors A/C to theme selected
         * @param { object } cJson - the component json
         **/
        $scope.updateDatasetColorsWithTheme = function(cJson) {
            var isDatasetAvailable = !!cJson[cJson["subElement"]]["DataSet"],
                isFieldsAvailable = isDatasetAvailable ? !!cJson[cJson["subElement"]]["DataSet"]["Fields"] : false,
                aFields = (isDatasetAvailable && isFieldsAvailable) ? cJson[cJson["subElement"]]["DataSet"]["Fields"] : [],
                datasetColors = $scope.getDatasetColorsFromTheme($scope.selectedTheme[$scope.getActiveDashboardId()]),
                colorCount = 0;
            for (var i = 0; i < aFields.length; i++) {
                if (i > datasetColors.length) {
                    colorCount = 0;
                }
                if ($scope.datasetcolor && $scope.datasetcolor[cJson.objectName]) {
                	if ($scope.datasetcolor[cJson.objectName][aFields[i].Name] !== undefined && $scope.selectedTheme[$scope.getActiveDashboardId()] === "default-theme") {
                    	aFields[i]["Color"] = $scope.datasetcolor[cJson.objectName][aFields[i].Name]["Color"];
                    	colorCount++;
                    } else {
                    	aFields[i]["Color"] = datasetColors[colorCount++];
                    }
                } else {
                	aFields[i]["Color"] = datasetColors[colorCount++];
                }
            }
            return cJson;
        };

        /**@description Loads the dashboard theme data from the json file of specified theme
         * @param { string } theme - the name of the theme
         **/
        $scope.loadDesignerThemeInfo = function(theme, cb) {
            if (!$scope.designerThemeInfo.hasOwnProperty(theme)) {
            	var path = (theme === "default-theme") ?"./resources/bizvizchart-themes/" + $scope.selectedTheme[$scope.getActiveDashboardId()] + "/dashboardTheme.data":"./resources/bizvizchart-themes/" + $scope.selectedTheme[$scope.getActiveDashboardId()] + "/themeConfig.data";
                ServiceFactory.getJsonFileData(
                    path,
                    function(dtInfo) {
                    	$scope.designerThemeInfo[theme] = (theme !== "default-theme")?dtInfo["dashboardTheme"]:dtInfo;
                        cb && cb();
                    },
                    null,
                    function(status, passedData) {
                        if (status === 404) {
                            ServiceFactory.getJsonFileData(
                                "./resources/bizvizchart-themes/default-theme/dashboardTheme.data",
                                function(dtInfo) {
                                    $scope.designerThemeInfo[theme] = dtInfo;
                                    cb && cb();
                                },
                                null,
                                function(status, passedData) {
                                    if (status === 404) {
                                        cb && cb();
                                    }
                                });
                        }
                    });
            } else {
                cb && cb();
            }
        };

        /** @description returns the css for item highlighter **/
        $scope.getHighlighterStyle = function() {
            var usrPref = $scope.modal.userPreference;
            return {
                height: "100%",
                width: "3px",
                background: usrPref ? usrPref.compSelcOpts.color : /*"#FF0000"*/"var(--selected-state)",
                position: "absolute"
            };
        };
        
        /** @description focus on input **/
        $scope.setFocusOnInput = function(modelObj, inputObj) {
	        $timeout( function() {
				$(modelObj).find(inputObj).focus();
			},100);
        };
        /** Switch the dashboard tab should update the layout type **/
        $scope.setSelectedLayout = function(){
        	$scope.modal.layoutType = $scope.modal.selectedDashboard.json.Dashboard.layoutType || "AbsoluteLayout";
        };
        
        /** @description dashboard tour open on click**/
        $scope.onTourClick = function(prop) {
        	var componentInfo = [];
        	var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
        	$scope.allTourPropMap = {
        		"customtour": prop,
        		"tourListMap": {},
        		"tourComponentType": false,
        		"selectedIndex": {"tabValue":0},
        		"associateTourList": ((componentJSON.associatedTourList).length === 0)?[]:getDuplicateArray(componentJSON.associatedTourList),
        		"associateTourComponent": (componentJSON.associatedTour === undefined)?{}:getDuplicateObject(componentJSON.associatedTour),	
        		"tourButton": (componentJSON.associatedTourButtonList === undefined)?{}:getDuplicateObject(componentJSON.associatedTourButtonList),
        		"placementDrop"	: {"auto":"auto","top":"top","bottom":"bottom","right":"right","left":"left"}
        	};
            /*$scope.customtour = prop;
            $scope.tourListMap = {};
            $scope.associateTourComponent = {};
            $scope.tourComponentType = false;
            $scope.selectedIndex = {"tabValue":0};*/
            /*$scope.associateTourList = ((componentJSON.associatedTourList).length === 0)?[]:getDuplicateArray(componentJSON.associatedTourList);
            $scope.associateTourComponent = (componentJSON.associatedTour === undefined)?{}:getDuplicateObject(componentJSON.associatedTour);
            $scope.tourButton = (componentJSON.associatedTourButtonList === undefined)?{}:getDuplicateObject(componentJSON.associatedTourButtonList);*/
            var objects = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object;
            for (var i = 0; i < objects.length; i++) {
                componentInfo.push({
                	"key": objects[i].objectID,
                    "value": objects[i].objectName
                });
            }
            $scope.allTourPropMap["tourListMap"]["options"] = componentInfo;
            $scope.showModelPopup("customTourWindow");
            
            /** Sort configuration for connections explorer */
    		$scope.tourSortCfg = {
    			axis: "y",
    			tolerance: "pointer",
    			containment: "parent",
    			cursor: "move",
    			revert: true,
    			placeholder: "s-o-p-h",
    			scroll: true,
    			handle: ".tourReorderDragDiv",
    			start: function( e, ui ) {
    				$scope.oldTourIndex = ui.item.index();
    			},
    			stop: function( e, ui ) {
    				var newTourIndex = ui.item.index();
    				$timeout( function() {
    					$scope.updateTourindex( $scope, $scope.oldTourIndex, newTourIndex );
    				}, 0 );
    			}
    		};
        };
        /** @description update property when component is selected from drop down**/
        $scope.onApplyTourProperty = function(prop) {
            $scope.allTourPropMap["tourComponentType"] = true;
            $scope.allTourPropMap["tourButton"][prop.value] = ($scope.allTourPropMap["tourButton"][prop.value] === undefined)?true:$scope.allTourPropMap["tourButton"][prop.value];
            //var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            $scope.allTourPropMap["titlePlaceholder"] = "Title";
            $scope.allTourPropMap["tourObj"] = {
            	"compName": prop.value,
                "title": "",
                "content": "",
                "placement": "",
                "duration": "",
                "orderIndex": ""
            };
            if (Object.keys($scope.allTourPropMap["associateTourComponent"]).indexOf(prop.value) > -1) {
                $scope.allTourPropMap["tourObj"].title = $scope.allTourPropMap["associateTourComponent"][prop.value].title;
                $scope.allTourPropMap["tourObj"].content = $scope.allTourPropMap["associateTourComponent"][prop.value].content;
                $scope.allTourPropMap["tourObj"].placement = $scope.allTourPropMap["associateTourComponent"][prop.value].placement;
                $scope.allTourPropMap["tourObj"].duration = $scope.allTourPropMap["associateTourComponent"][prop.value].duration;
                $scope.allTourPropMap["tourObj"].orderIndex = $scope.allTourPropMap["associateTourComponent"][prop.value].orderIndex;
            } /*else if (Object.keys(componentJSON.associatedTour).indexOf(prop.value) > -1) {
                $scope.allTourPropMap["tourObj"].title = componentJSON.associatedTour[prop.value].title;
                $scope.allTourPropMap["tourObj"].content = componentJSON.associatedTour[prop.value].content;
                $scope.allTourPropMap["tourObj"].placement = componentJSON.associatedTour[prop.value].placement;
                $scope.allTourPropMap["tourObj"].duration = componentJSON.associatedTour[prop.value].duration;
                $scope.allTourPropMap["tourObj"].orderIndex = componentJSON.associatedTour[prop.value].orderIndex;
            }*/
        };
        /** @description update property when title,palcement,duration etc has been changed**/
        $scope.onChangeTourProperty = function(comp) {
        	if ($scope.allTourPropMap["tourButton"][comp.compName] !== false) {
        		$scope.allTourPropMap["tourButton"][comp.compName] = false;
        		$scope.allTourPropMap["titlePlaceholder"] = "Title";
        	}
        	if (comp.title === "") {
        		$scope.allTourPropMap["tourButton"][comp.compName] = true;
        		$scope.allTourPropMap["titlePlaceholder"] = "*Title (Field can't be empty)";
        	}
            $scope.allTourPropMap["associateTourComponent"][comp.compName] = getDuplicateObject(comp);
        };
        /** @description update placement property drop down is changed**/
        $scope.onChangeTourDropdown = function(comp,placementText) {
        	if ($scope.allTourPropMap["tourButton"][comp.compName] !== false) {
        		$scope.allTourPropMap["tourButton"][comp.compName] = false;
        	}
        	comp.placement = placementText;
            $scope.allTourPropMap["associateTourComponent"][comp.compName] = getDuplicateObject(comp);
        };
        /** @description adding component to the list tab to perform tour operation**/
        $scope.addToTourList = function(comp) {
        	$scope.allTourPropMap["tourButton"][comp.compName] = true;
        	$scope.allTourPropMap["associateTourComponent"][comp.compName] = getDuplicateObject(comp);
        	if ($scope.allTourPropMap["associateTourComponent"] && $scope.allTourPropMap["associateTourComponent"][comp.compName] && $scope.allTourPropMap["associateTourComponent"][comp.compName]["orderIndex"] === "") {
        		if (Object.keys($scope.allTourPropMap["associateTourComponent"]).length === 1) {
        			$scope.allTourPropMap["tourObj"]["orderIndex"] = 0;
        			$scope.allTourPropMap["associateTourComponent"][comp.compName]["orderIndex"] = 0;
            	} else {
            		$scope.allTourPropMap["tourObj"]["orderIndex"] = Object.keys($scope.allTourPropMap["associateTourComponent"]).length - 1;
            		$scope.allTourPropMap["associateTourComponent"][comp.compName]["orderIndex"] = Object.keys($scope.allTourPropMap["associateTourComponent"]).length - 1;
            	}
        	}
        	var data = getDuplicateObject($scope.allTourPropMap["associateTourComponent"]);
            var dataArray = [];
            for (var key in data) {
            	dataArray[data[key]["orderIndex"]] = data[key];
            }
            dataArray.sort(function (a, b) {
                return a.orderIndex - b.orderIndex;
            });
            $scope.allTourPropMap["associateTourList"] = dataArray;
            $scope.allTourPropMap["tourComponentType"] = false;
            ServiceFactory.showNotification("Configuration has been added to the list", "alert-info", 3000);
        };
        /** @description saving tour property for associated component in the form of json**/
        $scope.SaveTourProperty = function() {
            var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
            componentJSON.associatedTour = getDuplicateObject($scope.allTourPropMap["associateTourComponent"]);
            componentJSON.associatedTourList = getDuplicateArray($scope.allTourPropMap["associateTourList"]);
            componentJSON.associatedTourButtonList = getDuplicateObject($scope.allTourPropMap["tourButton"]);
            delete $scope.allTourPropMap["associateTourComponent"];
            delete $scope.associateTourList;
        };
        /** @description deleting tour component from the tour list tab**/
        $scope.onTourDelete = function(comp) {
        	delete $scope.allTourPropMap["associateTourComponent"][comp.compName];
        	($scope.allTourPropMap["associateTourList"]).splice(comp.orderIndex,1);
        	for (var i = 0; i < $scope.allTourPropMap["associateTourList"].length; i++) {
        		$scope.allTourPropMap["associateTourList"][i]["orderIndex"] = i;
        		$scope.allTourPropMap["associateTourComponent"][$scope.allTourPropMap["associateTourList"][i].compName]["orderIndex"] = i;
        	}
        	delete $scope.allTourPropMap["tourButton"][comp.compName];
        };
        /** @description updating component property from the tour list tab**/
        $scope.onTourEdit = function(comp) {
        	$scope.allTourPropMap["selectedIndex"]["tabValue"] = 0;
        	$scope.allTourPropMap["tourComponentType"] = true;
        	var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
        	$scope.allTourPropMap["tourObj"] = {
            	"compName": comp.compName,
                "title": "",
                "content": "",
                "placement": "",
                "duration": "",
                "orderIndex": ""
            };
        	$scope.allTourPropMap["tourObj"].title = comp.title;
            $scope.allTourPropMap["tourObj"].content = comp.content;
            $scope.allTourPropMap["tourObj"].placement = comp.placement;
            $scope.allTourPropMap["tourObj"].duration = comp.duration;
            $scope.allTourPropMap["tourObj"].orderIndex = comp.orderIndex;
        };
        /** @description updating index of component from tour list (for sorting)**/
		$scope.updateTourindex = function(temp, oldIndex, newIndex) {
			var order = [];
			if(oldIndex !== newIndex) {
				if (oldIndex > newIndex) {
					for (var i = 0,k = 0; k < (temp.allTourPropMap["associateTourList"]).length; i++,k++) {
						if (k === oldIndex) {
							if (k !== (temp.allTourPropMap["associateTourList"]).length - 1) {
						        temp.allTourPropMap["associateTourList"][k+1]["orderIndex"] = i;
						        temp.allTourPropMap["associateTourComponent"][temp.allTourPropMap["associateTourList"][k+1].compName]["orderIndex"] = i;
		                        order.push(temp.allTourPropMap["associateTourList"][k+1]);
		                        k = k + 1;  
							}
						} else if (i === newIndex) {
							temp.allTourPropMap["associateTourList"][oldIndex]["orderIndex"] = newIndex;
							temp.allTourPropMap["associateTourComponent"][temp.allTourPropMap["associateTourList"][oldIndex].compName]["orderIndex"] = newIndex;
							order.push(temp.allTourPropMap["associateTourList"][oldIndex]);
							k = k - 1;
						} else {
							temp.allTourPropMap["associateTourList"][k]["orderIndex"] = i;
							temp.allTourPropMap["associateTourComponent"][temp.allTourPropMap["associateTourList"][k].compName]["orderIndex"] = i;
							order.push(temp.allTourPropMap["associateTourList"][k]);
						}
					}
				} else {
					for (var i = 0,k = 0; i < (temp.allTourPropMap["associateTourList"]).length; i++,k++) {
						if (i === oldIndex) {
							temp.allTourPropMap["associateTourList"][k+1]["orderIndex"] = i;
							temp.allTourPropMap["associateTourComponent"][temp.allTourPropMap["associateTourList"][k+1].compName]["orderIndex"] = i;
	                        order.push(temp.allTourPropMap["associateTourList"][k+1]);
	                        k = k + 1;
						} else if (i === newIndex) {
							temp.allTourPropMap["associateTourList"][oldIndex]["orderIndex"] = i;
							temp.allTourPropMap["associateTourComponent"][temp.allTourPropMap["associateTourList"][oldIndex].compName]["orderIndex"] = i;
							order.push(temp.allTourPropMap["associateTourList"][oldIndex]);
							k = k - 1;
						} else {
							temp.allTourPropMap["associateTourList"][k]["orderIndex"] = i;
							temp.allTourPropMap["associateTourComponent"][temp.allTourPropMap["associateTourList"][k].compName]["orderIndex"] = i;
							order.push(temp.allTourPropMap["associateTourList"][k]);
						}
					}
				}
				temp.allTourPropMap["associateTourList"] = [];
	            temp.allTourPropMap["associateTourList"] = order;
			}
		};
        
        /** switchDashboardView **/
        $scope.switchDashboardView = function(dView) {
			ServiceFactory.closeAllNotifications();
        	var id = $scope.getActiveDashboardId();
        	var widthRatio, heightRatio, borderThickness, w, h;
            switch (dView) {
                case "Desktop":
                	$scope.modal.layoutType = "AbsoluteLayout";
                    $("#" + id).css({
                    	"width": $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.width + "px", 
                    	"height": $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.height + "px",
                    	"top": "0px",
                    	"left": "0px",
            			"border": $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].borderThickness + "px solid " + $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].borderColor,
                    	"overflow": "hidden"
                    }).resizable('enable');
                    $scope.setDashboardBGColor();
                    /** Added for prevent component to register in Undo/Redo history stack when layout switch to desktop mode*/
                    $scope.modal.currentHistoryProperties().skipHistoryRegister = true;
                    
                	$("#" + id).find(".bizvizComponent").each(function(index, comp){
                		var objId = comp["id"].split("dcc_")[1];
                		var aCompJson = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object, "objectID", objId);
                		$scope.redrawComponent(aCompJson);
                		$scope.manageDashboardViewComponent(aCompJson);
                	});
                	$scope.modal.currentHistoryProperties().skipHistoryRegister = false;
                    break;
                case "Tablet":
                	/** If not have in dashboard json create an empty object **/
                	$scope.modal.layoutType = "TabletLayout";
                	/** Toggle active group palette **/
                	$scope.modal.isActiveBox = true;
                	$scope.reloadDefault();
                	if(!$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType]){
                		$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType] = {
            				"resolution": "1024x768",
            				"width": "1024",
            				"height": "768",
                			"border": borderThickness + "px solid #a9a9a9",
                			"pinedObject": [],
            				"Object": []
            			};
                	}
					widthRatio = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].width / $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.width;
            		heightRatio = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].height / $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.height;
            		borderThickness = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.borderThickness;
            		$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].borderThickness = borderThickness;
            		w = $("#" + id).parent().width()/2 - $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].width/2;
            		w = (w < 0 ) ? 0 : w;
            		h = $("#" + id).parent().height()/2 - $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].height/2;
            		h = (h < 0) ? 0 : h;
            		$("#" + id).css({
            			"width": Number($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].width) + borderThickness*2 + "px",
            			"height": Number($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].height) + borderThickness*2 + "px",
            			"top": h + "px",
            			"left": w + "px",
            			"border": borderThickness + "px solid #a9a9a9",
            			"overflow-x": "hidden","overflow-y": "auto", "opacity": "1"}).resizable('disable');//DAS-818 Move multiselect component is not working while scrolling.
            		$scope.setDashboardBGColor();
            		
                	if($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object.length == 0){
                		/** Will remove undefined and null objects from Component object array*/
                		$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object.filter(function(obj){
                			return (obj !== undefined && obj !== null);
                		});
                		$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object = angular.copy($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object);
	            		
	                	$("#" + id).find(".bizvizComponent").each(function(index, comp){
	                		var objId = comp["id"].split("dcc_")[1];
	                		var aCompJson = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object, "objectID", objId);
	                		var compJson = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, "objectID", objId);
	                		if (compJson) {
		                		compJson.x =  aCompJson.x * widthRatio;
		                		compJson.y =  aCompJson.y * heightRatio;
		                		compJson.width =  aCompJson.width * widthRatio;
		                		compJson.height =  aCompJson.height * heightRatio;
		                		$(comp).css({"left": compJson.x + "px", "top": compJson.y + "px", "width": compJson.width + "px",  "height": compJson.height + "px"})
		                		compJson["isPined"] = false;
		                		$scope.redrawComponent(compJson);
		                		$(comp).hide();
	                		}
	                	});
                	}else{
                		if($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object.length !== $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object.length){
                			$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object.map(function(aCompJson){
                				var isMissing = true;
                				$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object.map(function(obj){
                    				if(obj.objectID === aCompJson.objectID){
                    					isMissing = false;
                    					return;
                    				}
                				});
                				if(isMissing){
                					var compJson = angular.copy(aCompJson);
                					/** It will check whether objId exist or not in given array of objects. */
                					var doesIdExist = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object.some(function(obj) {
                					    return obj.objectID === compJson.objectID;
                					});
                					if (!doesIdExist) {
	                					$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object.push( compJson );
	                					compJson.x =  aCompJson.x * widthRatio;
	                					compJson.y =  aCompJson.y * heightRatio;
	        	                		compJson.width =  aCompJson.width * widthRatio;
	        	                		compJson.height =  aCompJson.height * heightRatio;
	        	                		$("#" + id).find(".bizvizComponent #"+aCompJson.objectID).css({"left": compJson.x + "px", "top": compJson.y + "px", "width": compJson.width + "px",  "height": compJson.height + "px"})
	        	                		$scope.redrawComponent(compJson);
	        	                		$scope.manageDashboardViewComponent(compJson);
	        	                		if (compJson["isPined"] === undefined) {
		        	                		compJson["isPined"] = false;
		        	                		$("#dcc_" + aCompJson.objectID).hide();
	        	                		}
                					}
                				}
                			});
                		}
                		$("#" + id).find(".bizvizComponent").each(function(index, comp){
                			var objId = comp["id"].split("dcc_")[1];
                			try {
	                			var compJson = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, "objectID", objId);
	                			if (compJson) {
		                			$scope.redrawComponent(compJson);
		                			$scope.manageDashboardViewComponent(compJson);
		                			if (compJson["isPined"] === false) {
		                			    $("#dcc_" + compJson.objectID).hide();
			                		} else {
			                			compJson["isPined"] = true;
			                			var pinedComponent = {
			                				"objectID":compJson.objectID
			                			}
			                			$("#dcc_" + compJson.objectID).show();
			                			var pinedObjs = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].pinedObject;
			                			var isPined = false;
			                			for (var j = 0; j < pinedObjs.length; j++) {
			                				if (pinedObjs[j].objectID == compJson.objectID) {
			                					isPined = true;
			                				}
			                			}
			                			if (!isPined) {
			                				$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].pinedObject.push(pinedComponent);
			                			}
			                			/** Synchronize absoluteLayout component object script and group property with mobile and tablet view component object property **/
			                            if(IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty)) {
			                            	$scope.syncComponentScriptingandGroupingProperty(compJson);
			                            }
			                            if ($scope.isSelectedComponent(compJson.objectID)) {
			            					$scope.deselectComponent(compJson.objectID);
			            				}
			                		}
	                			}
                			} catch (e) {
                				console.log(e);
                			}
                		});
                	}
                    break;
                case "Mobile":
                	$scope.modal.layoutType = "MobileLayout";
                	/** Toggle active group palette **/
                	$scope.modal.isActiveBox = true;
                	$scope.reloadDefault();
                	if(!$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType]){
                		$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType] = {
            				"resolution": "375x663",
            				"width": "375",
            				"height": "663",
            				"border": borderThickness + "px solid #a9a9a9",
            				"pinedObject": [],
            				"Object": []
            			};
                	}
					widthRatio = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].width / $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.width;
            		heightRatio = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].height / $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.height;
            		borderThickness = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.borderThickness;
            		$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].borderThickness = borderThickness;
            		w = $("#" + id).parent().width()/2 - $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].width/2;
            		w = (w < 0 ) ? 0 : w;
            		h = $("#" + id).parent().height()/2 - $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].height/2;
            		h = (h < 0) ? 0 : h;
            		$("#" + id).css({
            			"width": Number($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].width) + borderThickness*2 + "px",
            			"height": Number($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].height) + borderThickness*2 + "px",
            			"top": h + "px",
            			"left": w + "px",
            			"border": borderThickness + "px solid #a9a9a9",
            			"overflow-x": "hidden", "overflow-y": "auto","opacity": "1"}).resizable('disable');//DAS-818 Move multiselect component is not working while scrolling.
            		$scope.setDashboardBGColor();

                	if($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object.length == 0){
                		/** Will remove undefined and null objects from Component object array*/
                		$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object = $scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object.filter(function(obj){
                			return (obj !== undefined && obj !== null);
                		});
                		$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object = angular.copy($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object);
                		if(IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty)){
                			$scope.selectedGlobalProperty[id][$scope.modal.layoutType] = angular.copy($scope.selectedGlobalProperty[id].AbsoluteLayout);
                		}             		
	                	$("#" + id).find(".bizvizComponent").each(function(index, comp){
	                		var objId = comp["id"].split("dcc_")[1];
	                		var aCompJson = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object, "objectID", objId);
	                		var compJson = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, "objectID", objId);
        					if (compJson) {
		                		var compWH = $scope.componentDefaultWHForMobileView(compJson);
		                		compJson.y =  aCompJson.y * heightRatio;
		                		compJson.x = compWH.x;
		                		compJson.width = compWH.width;
		                		compJson.height = compWH.height;
		                		$(comp).css({"left": compJson.x + "px", "top": compJson.y + "px", "width": compJson.width + "px",  "height": compJson.height + "px"})
		                		//$(comp).find(".draggableWidgetDiv").css({"left": compJson.x + "px", "top": compJson.y + "px", "width": compJson.width + "px",  "height": compJson.height + "px"})
		                		compJson["isPined"] = false;
		                		$scope.redrawComponent(compJson);
		                		$(comp).hide();
        					}
	                	});
                	}else{
                		if($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object.length !== $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object.length){
                			$scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object.map(function(aCompJson){
                				var isMissing = true;
                				$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object.map(function(obj){
                    				if(obj.objectID === aCompJson.objectID){
                    					isMissing = false;
                    					return;
                    				}
                				});
                				if(isMissing){
                					var compJson = angular.copy(aCompJson);
                					/** It will check whether objId exist or not in given array of objects. */
                					var doesIdExist = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object.some(function(obj) {
                					    return obj.objectID === compJson.objectID;
                					});
                					if (!doesIdExist) {
	                					$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object.push( compJson );
	                					var compWH = $scope.componentDefaultWHForMobileView(compJson);
	                					compJson.y =  aCompJson.y * heightRatio;
	                					compJson.x = compWH.x;
	        	                		compJson.width = compWH.width;
	        	                		compJson.height = compWH.height;
	        	                		$("#" + id).find(".bizvizComponent #"+aCompJson.objectID).css({"left": compJson.x + "px", "top": compJson.y + "px", "width": compJson.width + "px",  "height": compJson.height + "px"})
	        	                		$scope.redrawComponent(compJson);
	        	                		$scope.manageDashboardViewComponent(compJson);
	        	                		if (compJson["isPined"] === undefined) {
		        	                		compJson["isPined"] = false;
		        	                		$("#dcc_" + compJson.objectID).hide();
	        	                		}
                					}
                				}
                			});
                		}
                		$("#" + id).find(".bizvizComponent").each(function(index, comp){
                			var objId = comp["id"].split("dcc_")[1];
                			try {
	                			var compJson = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, "objectID", objId);
	                			if (compJson) {
		                			$scope.redrawComponent(compJson);
		                			$scope.manageDashboardViewComponent(compJson);
		                			if (compJson["isPined"] === false) {
		                			    $("#dcc_" + compJson.objectID).hide();
			                		} else {
		                				compJson["isPined"] = true;
			                			var pinedComponent = {
				                			"objectID":compJson.objectID
				                		}
				                		$("#dcc_" + compJson.objectID).show();
			                			var pinedObjs = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].pinedObject;
			                			var isPined = false;
			                			for (var j = 0; j < pinedObjs.length; j++) {
			                				if (pinedObjs[j].objectID == compJson.objectID) {
			                					isPined = true;
			                				}
			                			}
			                			if (!isPined) {
			                				$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].pinedObject.push(pinedComponent);
			                			}
			                			/** Synchronize absoluteLayout component object script and group property with mobile and tablet view component object property **/
			                            if(IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty)) {
			                            	$scope.syncComponentScriptingandGroupingProperty(compJson);
			                            }
			                            if ($scope.isSelectedComponent(compJson.objectID)) {
			            					$scope.deselectComponent(compJson.objectID);
			            				}
			                		}
	                			}
                			} catch (e) {
                				console.log(e);
                			}
                		});
                	}
                    break;
                default:
            }
            $scope.modal.selectedDashboard.json.Dashboard.layoutType = $scope.modal.layoutType;
            $scope.reloadDefault();
        };
        /** manage component show/hide and lock/unlock operation in Tab & mobile view **/
        $scope.manageDashboardViewComponent = function(comp) {
    	    $scope.lockComponent(false, {
    	        "lockComponent": comp.showLocked,
    	         "objectID": comp.objectID
    	        }, true);
    	    $scope.hideComponent(false, {
    	    	"hideComponent": comp.unShowHidden,
    	    	"objectID": comp.objectID
            	}, true);
        };
        /**Set dashboard background color according to layout type  **/
        $scope.setDashboardBGColor = function() {
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
			var _showGridLines = $scope.modal.userPreference["showGridLines"];
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
        };
        /** Return default height, width and x position of mobile view components **/
        $scope.componentDefaultWHForMobileView = function(compObj) {
            switch (compObj["objectType"]) {
                case "chart":
                    switch (compObj[compObj.subElement].Type) {
                        case "SparkLine":
                            return {
                                "width": 250,
                                "height": 120,
                                "x": 10
                            }
                            break;
                        case "Progress":
                            return {
                                "width": 150,
                                "height": 150,
                                "x": 10
                            }
                            break;
                        case "KPITile":
                            return {
                                "width": 250,
                                "height": 150,
                                "x": 10
                            }
                            break;
                        default:
                            return {
                                "width": 300,
                                "height": 250,
                                "x": 10
                            }
                    }
                    break;
                case "funnel":
                    return {
                        "width": 200,
                        "height": 250,
                        "x": 10
                    }
                    break;
                case "datagrid":
                    return {
                        "width": 300,
                        "height": 250,
                        "x": 10
                    }
                    break;
                case "scorecard":
                    return {
                        "width": 300,
                        "height": 250,
                        "x": 10
                    }
                    break;
                case "filter":
                    switch (compObj[compObj.subElement].Type) {
                        case "list":
                            return {
                                "width": 120,
                                "height": 150,
                                "x": 10
                            }
                            break;
                        default:
                            return {
                                "width": 120,
                                "height": 25,
                                "x": 10
                            }
                    }
                    break;
                case "bullet":
                    return {
                        "width": 200,
                        "height": 50,
                        "x": 10
                    }
                    break;
                case "rectangle":
                    return {
                        "width": 160,
                        "height": 70,
                        "x": 10
                    }
                    break;
                case "gauge":
                    return {
                        "width": 100,
                        "height": 100,
                        "x": 10
                    }
                    break;
                case "semigauge":
                    return {
                        "width": 100,
                        "height": 100,
                        "x": 10
                    }
                    break;
                case "textbox":
                    return {
                        "width": 150,
                        "height": 30,
                        "x": 10
                    }
                    break;
                case "hslider":
                    return {
                        "width": 150,
                        "height": 50,
                        "x": 10
                    }
                    break;
                case "vslider":
                    return {
                        "width": 50,
                        "height": 150,
                        "x": 10
                    }
                    break;
                default:
                    return {
                	 	"width": (compObj.width > 200) ? 200 : compObj.width,
                	 	"height": (compObj.height > 50) ? 50 : compObj.height,
                        "x": 10
                    }
            }
        };
        
    };
    
	/** @description Controller definition **/
    angular.module("designer").
    controller("DashboardDesignerController", ["$rootScope", "$scope", "$timeout", "ServiceFactory", "DesignerFactory", "$translate", "$cacheFactory","textAngularManager", dashboardDesignerControllerFn]);
})();
//# sourceURL=DashboardDesignerController.js