/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: PropertyController.js
 * @description It controls synchronization of property palette 
 * **/
(function () {
	/** Controller function for property
	 * @param  {Object} $scope         The scope object
	 * @param  {Object} ServiceFactory The ServiceFactory
	 * @return {undefined}                   undefined
	 */
	var propCtrlFn = function($scope, ServiceFactory) {
		$scope.oneAtATime = true;
		$scope.status = { isFirstOpen : true, isFirstDisabled : false };

		$scope.$on("cachePropertyInfo", function (event, propertyInfo) {
			$scope.dataFilePath = propertyInfo.dataFilePath;
			$scope._currentComponentId = propertyInfo.id;
			$scope._objectType = propertyInfo.objectType;
			$scope.componentName = propertyInfo.propFileName;
			$scope.cachePropertyPalette();
		});

		/** It cached the property palette data for further use
		 * @return {undefined}                   undefined
		 */
		$scope.cachePropertyPalette = function () {
			$scope.propertyJson = {};
			if (!$scope.modal.propertyJsonList.hasOwnProperty($scope.componentName)) {
				ServiceFactory.getJsonFileData($scope.dataFilePath, function (_propertyJson) {
					$scope.propertyJson = _propertyJson;
					if (!$scope.modal.propertyJsonList.hasOwnProperty($scope.componentName)) {
						$scope.modal.propertyJsonList[$scope.componentName] = $scope.propertyJson;
					}
				});
			} else {
				$scope.propertyJson = $scope.modal.propertyJsonList[$scope.componentName];
			}
		};

		/** Initializes the property pallet for specific component
		 * @param  {String}  objId       objectId
		 * @param  {Boolean} isDashboard Flag to check it is dashboard or not
		 * @return {undefined}                   undefined
		 */
		$scope.initPropertyPalette = function (objId, isDashboard) {
			if (objId) {
				$scope.component = $scope.getComponentbyId(objId);
				var objName = isDashboard ? "dashboard" : $scope.component["componentType"],
				objType = $scope.component ? AttributeMigration[$scope.component["objectType"]][0] : "Dashboard",
				objFilePath = "./resources/data/property/" + objName + ".data";
				if ($scope.component) {
					$scope.modal.selectedComponentId = objId;
				}

				$scope.propertyJson = {};
				if (!$scope.modal.propertyJsonList.hasOwnProperty(objName)) {
					ServiceFactory.getJsonFileData(objFilePath, function (_propertyJson) {
						$scope.propertyJson = _propertyJson;
						if($scope.modal.globalFontProperties !== undefined){
							for(var key in $scope.propertyJson){
								for(var lab = 0; lab < $scope.propertyJson[key].length;lab++){
									if($scope.propertyJson[key][lab]["attributeName"] !== undefined && ($scope.propertyJson[key][lab]["attributeName"] == "FontFamily" || $scope.propertyJson[key][lab]["attributeName"].indexOf("FontFamily") > -1 || $scope.propertyJson[key][lab]["attributeName"].indexOf("fontFamily") > -1)){
										$scope.propertyJson[key][lab]["options"] = $scope.modal.globalFontProperties
									}
								}
							}
						}
						$scope.modal.propertyJson = $scope.synchronizeProperty($scope.propertyJson, objType, objId);
						if (!$scope.modal.propertyJsonList.hasOwnProperty(objName)) {
							$scope.modal.propertyJsonList[objName] = $scope.propertyJson;
							if (!$scope.$$phase) {
								$scope.$apply(function () {
									$scope.modal.currentSelectedPellet = $scope.modal.propertyJson;
								});
							}
						}
					});
				} else {
					$scope.propertyJson = $scope.modal.propertyJsonList[objName];
					if($scope.modal.globalFontProperties !== undefined){
						for(var key in $scope.propertyJson){
							for(var lab = 0; lab < $scope.propertyJson[key].length;lab++){
								if($scope.propertyJson[key][lab]["attributeName"] !== undefined && ($scope.propertyJson[key][lab]["attributeName"] == "FontFamily" || $scope.propertyJson[key][lab]["attributeName"].indexOf("FontFamily") > -1 || $scope.propertyJson[key][lab]["attributeName"].indexOf("fontFamily") > -1)){
									$scope.propertyJson[key][lab]["options"] = $scope.modal.globalFontProperties
								}
							}
						}
					}
					$scope.modal.propertyJson = $scope.synchronizeProperty($scope.propertyJson, objType, objId);
					if (!$scope.$$phase) {
						$scope.$apply(function () {
							$scope.modal.currentSelectedPellet = $scope.modal.propertyJson;
						});
					}
				}
			}
		};

		/** Synchronize property palette with the property json
		 * @param  {Object} _basePropertyData Original property data
		 * @param  {String} _objectType       Object type
		 * @param  {STring} id                Id of the component
		 * @return {undefined}                   undefined
		 */
		$scope.synchronizeProperty = function (_basePropertyData, _objectType, id) {
			var _listOfComponentJSON = null,
			_dashboardJSON = null;
			$scope._currentComponentJSON = null;
			try {
				if (_objectType == "Dashboard") {
					$scope._currentComponentJSON = $scope.modal.selectedDashboard.json.Dashboard;
				} else {
					/** To get selected dashboard layout type */
					_listOfComponentJSON = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object;
					$scope._currentComponentJSON = DesignerUtil.prototype.findInArray(_listOfComponentJSON, "objectID", id);
				}
				$.each(_basePropertyData, function (idx, obj) {
					if (idx != "Info") {
						$.each(obj, function (idx, subObj) {
							var selectedValue = ServiceFactory.correctObjectFormat($scope.getCurrentPropertyValue(subObj.attributeName, subObj.propertyName, _objectType));
							switch (subObj.type) {
							case "select":
								subObj.value = DesignerUtil.prototype.findInArray(subObj.options, "key", selectedValue);
								break;
							case "CascadedParentSelect":
								subObj.value = DesignerUtil.prototype.findInArray(subObj.options, "key", selectedValue);
								$scope.cascadedParentsChild[subObj.cascadedChild] = [];
								if (subObj.value != undefined)
									$scope.cascadedParentsChild[subObj.cascadedChild] = subObj.value.child;
								break;
							case "CascadedChildSelect":
								subObj.value = DesignerUtil.prototype.findInArray($scope.cascadedParentsChild[subObj.attributeName], "key", selectedValue);
								break;
							case "gradient":
								var _gColorArray = selectedValue.split(",");
								subObj.value = {
									"gColor_1" : _gColorArray[0],
									"gColor_2" : _gColorArray[1]
								};
								break;
							case "color":
								if (!isNaN(selectedValue)) {
									subObj.value = convertColorToHex(selectedValue);
								} else if (ServiceFactory.isValidHexColorString(selectedValue)) {
									subObj.value = selectedValue;
								} else {
									subObj.value = "#0DAEA7"; //Default Color
								}
								break;
							case "checkbox":
								subObj.value = IsBoolean(selectedValue);
								break;
							case "number":
								subObj.value = parseFloat(selectedValue);
								break;
							default:
								subObj.value = selectedValue;
								break;
							}
						});
					}
				});
			} catch (error) {
				console.error(error.message);
			}
			return _basePropertyData;
		};

		/** Gets current value of the specific property
		 * @param  {String} attributeName name of the attribute
		 * @param  {String} propertyName  name of the property
		 * @param  {String} widgetType    type of the widget
		 * @return {undefined}               undefined
		 */
		$scope.getCurrentPropertyValue = function (attributeName, propertyName, widgetType) {
			try {
				var returnValue = "";
				var obj;
				if (widgetType == "Dashboard") {
					obj = $scope._currentComponentJSON;
					var layoutType = $scope.modal.layoutType || "AbsoluteLayout";
					switch (propertyName) {
					case "absoluteLayout":
						var oldTheme = ["brown-theme","black-theme","bstorycard-theme","orange-theme"];
						returnValue = obj[layoutType][attributeName];
						if (oldTheme.indexOf(returnValue) > -1 && attributeName === "designerTheme") {
							returnValue = "default-theme";
						}
						break;
					case "Dashboard":
						if (attributeName.indexOf("LanguageMapping.") > -1) {
			            	var attr = attributeName.split(".")[1];
			            	returnValue = obj.LanguageMapping[attr];
			            }else{
			            	returnValue = obj[attributeName];
			            }
						break;
					default:
						returnValue = obj[attributeName];
						break;
					}
				} else {
					obj = $scope._currentComponentJSON;
					if (propertyName != undefined && propertyName != "") {
						if (propertyName == "Object") {
							returnValue = obj[attributeName];
						} else {
							returnValue = eval("obj." + propertyName)[attributeName];
						}
					}
				}
				if (returnValue == undefined) {
					returnValue = "";
				}
				return returnValue;
			} catch (error) {
				console.error(error.message);
			}
		};

		/** Check for object validity
		 * @param  {Object}  value value to be checked
		 * @return {Boolean}       true if valid else false
		 */
		$scope.isValidObject = function( value ){
			return angular.isObject(value);
		};
	}

	/** @description Controller definition **/
	angular.module(designerModules.module.DesignerManager)
	.controller("PropertyController", ["$scope", "ServiceFactory", propCtrlFn]);
	
})();
//# sourceURL=PropertyController.js