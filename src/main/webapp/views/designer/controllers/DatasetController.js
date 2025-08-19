/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: DatasetController.js
 * @description It controls all the activities going on in dataset palette area 
 * **/
(function () {
	/** Controller function for Dashboard Components
	 * @param  {Object} $scope        	The scope object
	 * @param  {Object} timeout 		The Timeout
	 * @param  {Object} ServiceFactory 	The ServiceFactory
	 * @return {undefined}              undefined
	 */
	var datasetControllerFn = function ($scope, $timeout, ServiceFactory) {
		$scope.component = "";
		$scope.selectedDataSet = "";
		$scope.selectedField = "";
		$scope.selectedDatasource = "";
		$scope.datasetFieldList = "";
		$scope.alertJson = "";
		$scope.alertFieldProperties = [];
		$scope.datasetFieldTypes = "";
		$scope.dataSetPage = "";
		$scope.fieldContainer = [];
		
		/**	Need to load datasetDesignProperties only once **/
		$scope.datasetDesignProperties = "";
		ServiceFactory.getJsonFileData("./resources/data/ComponentClassDatasetProperties.data", function (jsonData) {
			$scope.datasetDesignProperties = jsonData;
		});

		/** @description invoke Dataset properties palette updation **/
		$scope.invokeDatasetpaletteUpdation = function (cId) {
			$scope.component = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, "objectID", cId);
			$scope.$apply();
			if ($scope.component){
				if (!IsBoolean($scope.component.isValueFieldsAvailable)) {
					$scope.loadDataSet();
					$scope.setDatasetFieldType();
				} else {
					$scope.loadValuesFields();
				}
			}else{
				ServiceFactory.showNotification("Component is not selected", "alert-danger", 3000);
			}
		};
		/** @description load the dataset for selected component if available, if not create an dataset object **/
		$scope.loadDataSet = function () {
			$scope.selectedDataSet = $scope.component[$scope.component.subElement]["DataSet"];
			$scope.selectedDatasource = "";
			$scope.datasetFieldList = [];
			$scope.selectedField = "";
			$scope.fieldContainer = [];
			$scope.alertJson = "";
			$scope.alertFieldProperties = [];
			if ($scope.selectedDataSet !== "" && $scope.selectedDataSet !== undefined) {
				$scope.selectedDatasource = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL, "id", $scope.selectedDataSet.dataSource);
				$scope.setDatasetFieldList();
				$scope.setFieldInContainers();

				/** Fixed for #9240 - unit,formatter not showing when palette reopened of scorecard **/
//				$scope.syncPropertyWithJson();
				$.each($scope.fieldContainer, function (idx, container) {
					$scope.syncPropertyWithJson(container.Fields);
				});
				$scope.$apply();
			} else {
				$scope.datasetFieldList = "";
				$scope.selectedDatasource = "";
				$scope.selectedDataSet = "";
				$scope.component[$scope.component.subElement]["DataSet"] = undefined;
				$scope.setFieldInContainers();

				/** Fixed for #9240 - unit,formatter not showing when palette reopened of scorecard **/
				$scope.syncPropertyWithJson($scope.datasetFieldList);
				$scope.$apply();
			}
			$scope.updateTabSelection("#field-properties");
			$scope.setLiHoverIconCSS();
		};
		/** @description get the field types for the selected fields **/
		$scope.setDatasetFieldType = function () {
			$scope.datasetFieldTypes = $scope.datasetDesignProperties[$scope.component.designData.class].datasetFieldTypes;
			$scope.$apply();
		};

		$scope.onchangeOfFieldType = function (field) {
			field.Type = field.typeObject.value;
		};
		/** @description update css, when tab is changed **/
		$scope.updateTabSelectionById = function (event) {
			$scope.updateTabSelection(event.target.hash);
		};
		
		/**
		 * Creates and returns configurations for sorting fields
		 * @param {Number} index The index of the field container
		 * @returns configuration object for sorting
		 * */
		$scope.getFieldSortCfg = function (index) {
			var oldIndex = -1;
			return {
				axis: "y",
				tolerance: "pointer",
				containment: "parent",
				cursor: "move",
				revert: true,
				placeholder: "s-f-p-h",
				scroll: true,
				start: function (e, ui) {
					oldIndex = ui.item.index();
				},
				stop: function (e, ui) {
					var newIndex = ui.item.index();
					updateFieldIndexes(oldIndex, newIndex);
				}
			};
			
			/**
			 * Updates the field's indexes after re-ordering
			 * @param {Number} oldIndex Index of field before re-ordering
			 * @param {Number} newIndex Index of field after re-ordering
			 * return {undefined} undefined
			 * */
			function updateFieldIndexes(oldIndex, newIndex) {
				var uiFields = $scope.fieldContainer[index].Fields;
				var fields = $scope.selectedDataSet.Fields;
				var temp = uiFields[0].fieldJson;
				var indexes = [];
				
				/**
				 * Moves the item form oldIndex to newIndex
				 * @param {Number} oldIndex
				 * @param {Number} newIndex New index
				 * @returns {undefined} undefined
				 * */
				Array.prototype.move = function (oldIndex, newIndex) {
					if (newIndex >= this.length) {
						var k = newIndex - this.length;
						while ((k--) + 1) {
							this.push(undefined);
						}
					}
					this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
				};
				for (var i = 0; i < fields.length; i++) {
					if (fields[i].Type == temp.Type) {
						indexes.push(i);
					}
				}
				
				$timeout( function() {
					uiFields.move(oldIndex, newIndex);
					for (var i = 0; i < uiFields.length; i++) {
						fields[ indexes[i] ] = uiFields[i].fieldJson;
					}
				}, 0 );
			}
		};
		
		$scope.updateTabSelection = function (tabId) {
			$(".dataSourceTypeTabs").find(".dataSourceTypeTab").removeClass("active");
			$(".dataSourceTypeTabs").find(tabId).addClass("active");

			$(".dataSourceTypeTabsContent").find(".tab-pane").removeClass("active");
			$(".dataSourceTypeTabsContent").find(tabId).addClass("active");
		};

		/** @description update the dataset when new datasource is assigned to the component **/
		$scope.changeDatasource = function () {
			$scope.destroyFromComponent();
			if ($scope.selectedDatasource !== undefined) {
				if ($scope.selectedDataSet === undefined || $scope.selectedDataSet === "" || $scope.selectedDataSet.dataSource === undefined) {
					$scope.createDataSet();
					$scope.addToDataUrlAvailableDataSet();
				} else {
					$scope.updateToDataUrlAvailableDataSet($scope.selectedDataSet.dataSource);
					$scope.addToDataUrlAvailableDataSet();
				}
				$scope.selectedDataSet.dataSource = $scope.selectedDatasource.id;
				$scope.selectedDataSet.Fields = [];
				$scope.setDatasetFieldList();
				$scope.setFieldInContainers();
				$scope.syncPropertyWithJson($scope.datasetFieldList);
			} else {
				$scope.updateToDataUrlAvailableDataSet($scope.selectedDataSet.dataSource);
				$scope.selectedDataSet = "";
			}
			if ($scope.modal.layoutType == "AbsoluteLayout") {
				$scope.registerInHistory("change",$scope.component);
			}
		};
		/** @description update the field list with available field sets in data source **/
		$scope.setDatasetFieldList = function () {
			$scope.datasetFieldList = [];
			if ($scope.selectedDatasource !== undefined) {
				var availableFields = $scope.modal.getfieldSetFromConnection($scope.selectedDatasource.id);
				$scope.colorCount = 0;
				$scope.addFieldsToDatasetFieldList(availableFields, "Field", "name");
				var availableCalculatedFields = $scope.modal.getCalculatedFieldSetFromConnection($scope.selectedDatasource.id);
				$scope.addFieldsToDatasetFieldList(availableCalculatedFields, "CalculatedField", "id");
				$scope.setAllAvailableFieldsName();
			}
		};
		/** @description add all fields and calculated fields to left side field-list in dataset palette **/
		$scope.addFieldsToDatasetFieldList = function (fields, fieldType, fieldProp) {
			var datasetColors = $scope.getDatasetColorsFromTheme($scope.selectedTheme[$scope.getActiveDashboardId()]),
			colorCount = 0;
			angular.forEach(fields, function (field) {
				var datasetField = {};
				datasetField.fieldJson = $scope.getNewFieldObject();
				datasetField.name = field[fieldProp];
				datasetField.fieldJson[$scope.datasetDesignProperties[$scope.component.designData.class]["name"]] = field[fieldProp];
				datasetField.fieldJson[$scope.datasetDesignProperties[$scope.component.designData.class]["displayName"]] = field[fieldProp];
				datasetField.fieldJson["fieldType"] = fieldType;
				datasetField.fieldJson["expressionID"] = field.id;
				datasetField.fieldJson["OtherField"] =  field[fieldProp]; // added for default otherfield for scater plot
				datasetField.fieldJson["OtherFieldDisplayName"] =  field[fieldProp]; // added for default otherfielddisplay name otherfield for scater plot
				datasetField.fieldJson["ColorFieldDisplayName"] = "Color";
				datasetField.fieldJson["RadiusFieldDisplayName"] = "Radius";
				datasetField.fieldJson["AdditionalField"] = ($scope.component.Funnel && $scope.component.Funnel["Type"] == "InvertedFunnel") ? "" : field[fieldProp];//Added for TreeMap and InvertedFunnel Additonal Field property.
				datasetField.fieldJson["tooltipField"] = field[fieldProp];
				/** TODO **/
//				datasetField.fieldJson.Color = getRandomHexColor();
				/** Made colorCount scope variable because for calculated field is getting initialized to 0 again **/
				if ($scope.colorCount === datasetColors.length){
					$scope.colorCount = 0;
				}
				if ($scope.datasetcolor && $scope.datasetcolor[$scope.selectedDataSet.id]) {
					if ($scope.datasetcolor[$scope.selectedDataSet.id][datasetField.fieldJson.Name] !== undefined && $scope.selectedTheme[$scope.getActiveDashboardId()] === "default-theme") {
						datasetField.fieldJson.Color = $scope.datasetcolor[$scope.selectedDataSet.id][datasetField.fieldJson.Name]["Color"];
					} else {
						datasetField.fieldJson.Color = datasetColors[$scope.colorCount++];
					}
				} else {
					datasetField.fieldJson.Color = datasetColors[$scope.colorCount++];
				}
				datasetField.fieldProperties = angular.copy($scope.datasetDesignProperties[$scope.component.designData.class].FieldProperties);
				$scope.datasetFieldList.push(datasetField);
			});
		};
		
		/** @description method is used for bubble/plot/heat map chart to show all fields in colorField/radiusField dropdown **/
		$scope.setAllAvailableFieldsName = function(){
			var arr = [];
			for(var i = 0; i < $scope.datasetFieldList.length; i++){
				arr.push( {key : $scope.datasetFieldList[i]["name"], value: $scope.datasetFieldList[i]["name"]} );
			}
			arr.unshift( {key : "", value : "None"} );
			$scope.availableFieldsName = arr;
		};

		/** @description synchronization of the properties with values given in component dataset field JSON **/
		$scope.syncPropertyWithJson = function (fieldJsonPropJson) {
			$.each(fieldJsonPropJson, function (idx, obj) {
				$.each(obj.fieldProperties, function (idx, subObj) {
					var selectedValue = obj.fieldJson[subObj.attributeName];
					switch (subObj.type) {
					case "select":
						if(typeof(selectedValue) === "object")
							subObj.value = DesignerUtil.prototype.findInArray(subObj.options, "key", selectedValue.key);
						else
							subObj.value = DesignerUtil.prototype.findInArray(subObj.options, "key", selectedValue);
						break;
					case "customSelect":
						subObj.options = angular.copy($scope.availableFieldsName);
						if(typeof(selectedValue) === "object")
							subObj.value = DesignerUtil.prototype.findInArray(subObj.options, "key", selectedValue.key);
						else{
							subObj.value = DesignerUtil.prototype.findInArray(subObj.options, "key", selectedValue);
						}
						break;
					case "customSelectTextBox":
						subObj.options = angular.copy($scope.availableFieldsName);
						if(typeof(selectedValue) === "object"){
							var val = DesignerUtil.prototype.findInArray(subObj.options, "key", selectedValue.key);
							subObj.value = (val) ? val : { key : selectedValue.key, value : selectedValue.key };
						}
						else{
							var val = DesignerUtil.prototype.findInArray(subObj.options, "key", selectedValue);
							subObj.value = (val) ? val : { key : selectedValue, value : selectedValue };
						}
					break;
					case "CascadedParentSelect":
						subObj.value = DesignerUtil.prototype.findInArray(subObj.options, "key", selectedValue);
						$scope.cascadedParentsChild[subObj.cascadedChild] = [];
						if (subObj.value !== undefined)
							$scope.cascadedParentsChild[subObj.cascadedChild] = subObj.value.child;
						break;
					case "CascadedChildSelect":
						subObj.value = DesignerUtil.prototype.findInArray($scope.cascadedParentsChild[subObj.attributeName], "key", selectedValue);
						break;
					case "color":
						if (!isNaN(selectedValue)) {
							subObj.value = convertColorToHex(selectedValue);
						} else if (ServiceFactory.isValidHexColorString(selectedValue)) {
							subObj.value = selectedValue;
						} else {
							subObj.value = "#0DAEA7";
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
			});
		};

		/** @description this method will separate the fields-and-properties in category/series according to their type **/
		$scope.setFieldInContainers = function () {
			$scope.fieldContainer = [];
			var datasetFieldTypes = $scope.datasetDesignProperties[$scope.component.designData.class].datasetFieldTypes;
			for (var i = 0; i < datasetFieldTypes.length; i++) {
				$scope.fieldContainer[i] = {};
				$scope.fieldContainer[i]["Type"] = datasetFieldTypes[i].value;
				$scope.fieldContainer[i]["Label"] = datasetFieldTypes[i].label;
				$scope.fieldContainer[i]["Fields"] = [];
				if ($scope.selectedDataSet !== "" && $scope.selectedDataSet !== undefined && $scope.selectedDataSet.Fields) {
					for (var j = 0; j < $scope.selectedDataSet.Fields.length; j++) {
						if ($scope.selectedDataSet.Fields[j]["Type"] === datasetFieldTypes[i].value) {
							var dataSetFieldJson = $scope.getDataSetFieldJsonWithProperties($scope.selectedDataSet.Fields[j]);
							if (dataSetFieldJson !== undefined){
								$scope.fieldContainer[i]["Fields"].push(dataSetFieldJson);
							}
						}
					}
				}
				
				/** BDD-826 Old dashboard Scatter Plot should display both containers if they have fields in both fields **/
				/**TODO dynamicHide need to set for all components in componentClassDatasetProp file **/
				var str = datasetFieldTypes[i].cssClass;
				if(IsBoolean(datasetFieldTypes[i].dynamicHide) && $scope.fieldContainer[i]["Fields"].length == 0){
					str += " bvz-invisible";
				}
				$scope.fieldContainer[i]["CSSClass"] = str;
				
			}
		};
		/** @description get the updated field JSON for a field **/
		$scope.getDataSetFieldJsonWithProperties = function (dataSetField) {
			var name = dataSetField[$scope.datasetDesignProperties[$scope.component.designData.class]["name"]];
			for (var j = 0; j < $scope.datasetFieldList.length; j++) {
				if ($scope.datasetFieldList[j].name === name) {
					for (var key in dataSetField) {
						if(dataSetField.hasOwnProperty(key)){
							$scope.datasetFieldList[j].fieldJson[key] = dataSetField[key];
						}
					}
					return $scope.datasetFieldList[j];
				}
			}
		};
		/** @description set the clicked field selected **/
		$scope.setSelectedField = function (field) {
			for(var a = 0; a < field.fieldProperties.length; a++){
				if(field.fieldProperties[a]["attributeName"].indexOf("fontFamily") > -1){
					/**DAS-717 : updating global font setting index of global font value to filed options value */
					var oldfontfamily = field.fieldProperties[a].value.key;
					var bizvizFontKey = $scope.modal.globalFontProperties.findIndex(function(font) {
					    return font.value === oldfontfamily;
					});
					field.fieldProperties[a].value = $scope.modal.globalFontProperties[bizvizFontKey];
					field.fieldProperties[a]["options"] = $scope.modal.globalFontProperties;
					
				}
			}
			/** When selected an field **/
			$scope.selectedField = (field);
			$scope.updateAlertJsonForSelectedField(field);
			/** Update for JSON when select Field **/
			if (navigator.appVersion.indexOf("Win") !== -1) {
				setTimeout(function () {
					$scope.initSpectrumColorPicker("input[type='color']");
				}, 0.01);
			}
		};

		/** @description when a field is dropped in any container - it will be updated in component dataset field list **/
		$scope.addFieldToDataSet = function (field, type) {
			if (!$scope.isFieldExist($scope.selectedDataSet.Fields, field.name, type)) {
				field.fieldJson[$scope.datasetDesignProperties[$scope.component.designData.class]["name"]] = field.name;
				field.fieldJson[$scope.datasetDesignProperties[$scope.component.designData.class]["displayName"]] = field.name;
				field.fieldJson["Name"] = field.name;
				field.fieldJson["Type"] = type;
				field.fieldJson["iconPath"] = (type === "Category") ? "./resources/images/svg/Line.svg" : "./resources/images/svg/Column.svg";
				$scope.selectedDataSet.Fields.push(angular.copy(field.fieldJson));
				$scope.setSelectedVariable(undefined,$scope.component,"Component");
				/** For alert Property of DataGrid and ScoreCard **/
				if ($scope.component.designData.type === "datagrid" || $scope.component.designData.type === "scorecard") {
					$scope.alertJson = $scope.getNewAlertColumnObject();
					$scope.alertJson.name = field.name;
					$scope.alertFieldProperties = angular.copy($scope.datasetDesignProperties[$scope.component.designData.class].alertProperties);
					$scope.updateAlertFieldProperties();
				}
			}
			/**  update field property values #14017 **/
			$scope.syncPropertyWithJson([field]);
			
			/**	Set new json and update field name, Add in UI containers **/
			for (var i = 0; i < $scope.fieldContainer.length; i++){
				if ($scope.fieldContainer[i].Type === type) {
					if ($scope.fieldContainer[i].Fields.length > 0) {
						if (!$scope.isFieldJsonExist($scope.fieldContainer[i].Fields, field.name, type)) {
							$scope.fieldContainer[i]["Fields"].push(angular.copy(field));
							$scope.selectedField = angular.copy(field);
							$scope.$apply();
						}
					} else {
						$scope.fieldContainer[i]["Fields"].push(angular.copy(field));
						$scope.selectedField = angular.copy(field);
						$scope.$apply();
					}
				}
			}
			$scope.setLiHoverIconCSS();
			if (!Modernizr.inputtypes.color) {
				$scope.initSpectrumColorPicker("input[type='color']");
			}
			if ($scope.modal.layoutType == "AbsoluteLayout") {
				$scope.registerInHistory("change",$scope.component);
			}
		};

		/** @description to show the delete control on mouse over of field in container **/
		$scope.setLiHoverIconCSS = function () {
			window.setTimeout(function () {
				$(".bvz-list-container li").find(".bvz-btn-icon").hide();
				$(".bvz-list-container li").hover(function () {
					$(this).find(".bvz-btn-icon").show();
				}, function () {
					$(this).find(".bvz-btn-icon").hide();
				});
			}, 10);
		};

		/** @description check whether a field is already exist in dataset field array or not **/
		$scope.isFieldExist = function (fields, name, type) {
			for (var i = 0; i < fields.length; i++) {
				if (fields[i][$scope.datasetDesignProperties[$scope.component.designData.class]["name"]] === name && fields[i].Type === type)
					return true;
			}
			return false;
		};

		/** @description check whether a field json is already exist in dataset field array or not **/
		$scope.isFieldJsonExist = function (fields, name, type) {
			for (var i = 0; i < fields.length; i++) {
				if (fields[i].fieldJson[$scope.datasetDesignProperties[$scope.component.designData.class]["name"]] === name && fields[i].fieldJson.Type === type)
					return true;
			}
			return false;
		};

		/** @description remove a field from the dataset fields and UI containers **/
		$scope.removeField = function (field, type) {
			for (var i = 0; i < $scope.selectedDataSet.Fields.length; i++) {
				if ($scope.selectedDataSet.Fields[i][$scope.datasetDesignProperties[$scope.component.designData.class]["name"]] === field.name) {
					if ($scope.selectedDataSet.Fields[i].Type === type) {
						var indexF = $scope.selectedDataSet.Fields.indexOf($scope.selectedDataSet.Fields[i]);
						$scope.selectedDataSet.Fields.splice(indexF, 1);
						break;
					}
				}
			}
			for (var j = 0; j < $scope.fieldContainer.length; j++) {
				if ($scope.fieldContainer[j].Type === type) {
					var indexFC = $scope.fieldContainer[j].Fields.indexOf(field);
					if (indexFC !== -1) {
						$scope.fieldContainer[j].Fields.splice(indexFC, 1);
						$scope.selectedField = "";
					}
				}
			}
			/** when a field is deleted from the chart, Default Field Values windows not updating until we click item in the left pan **/
			$scope.setSelectedVariable(undefined,$scope.component,"Component");
			if ($scope.modal.layoutType == "AbsoluteLayout") {
				$scope.registerInHistory("change",$scope.component);
			}
		};
		
		/** @description onChangeCustomSelect method is responsible for retrieve the value object in prop **/
		$scope.onChangeCustomSelect = function(prop){
			/** custom change event for radius field or color field **/
			if((prop.value.key !== prop.value.value) && (prop.value.value !="None")){
				/** "if" statement will check key-value pair is same or not when value in color field is changed by text box(user manually enter from keyboard like 3,5 7 etc.) **/
				prop.value.key = prop.value.value;
			}
			$scope.onFieldPropertyChange(prop);
		};
		
		/** @description onFieldPropertyChange method is update field json with corresponding attribute **/
		$scope.onFieldPropertyChange = function (prop) {			
			var fields = $scope.selectedDataSet.Fields;
			var type = "";
			$scope.datasetcolor = $scope.datasetcolor || {};
			$scope.datasetcolor[$scope.selectedDataSet.id] = $scope.datasetcolor[$scope.selectedDataSet.id] || {};
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
					type = fields[i].Type;
				}
			}
			
			for (var j = 0; j < $scope.fieldContainer.length; j++) {
				if ($scope.fieldContainer[j].Type === type) {
					for (var k = 0; k < $scope.fieldContainer[j].Fields.length; k++) {
						if ($scope.fieldContainer[j].Fields[k].name === $scope.selectedField.name && $scope.fieldContainer[j].Fields[k].fieldJson.Type === $scope.selectedField.fieldJson.Type) {
							if (prop.attributeName === "Color") {
								if ($scope.selectedTheme[$scope.getActiveDashboardId()] === "default-theme") {
									$scope.datasetcolor[$scope.selectedDataSet.id][$scope.fieldContainer[j].Fields[k].name] = {};
									$scope.datasetcolor[$scope.selectedDataSet.id][$scope.fieldContainer[j].Fields[k].name][prop.attributeName] = prop.value;
								}
								$scope.fieldContainer[j].Fields[k].fieldJson.Color = prop.value;
							}
							if (typeof(prop.value) == "object") {
								$scope.fieldContainer[j].Fields[k].fieldJson[prop.attributeName] = prop.value.key;
							}
							else {
								$scope.fieldContainer[j].Fields[k].fieldJson[prop.attributeName] = prop.value;
							}
						}
						/** update field property values #14017 **/
						$scope.syncPropertyWithJson([$scope.fieldContainer[j].Fields[k]]);
					}
				}
			}
			if ($scope.modal.layoutType == "AbsoluteLayout") {
				$scope.registerInHistory("change",$scope.component);
			}
			if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
				$scope.syncComponentPropertyInMobileView("compFieldProperty", $scope.component, prop);
				$scope.syncComponentPropertyInTabletView("compFieldProperty", $scope.component, prop);
			}
		};
		/**DAS-907 @description when datasource is refreshed/changed, clear the component refrence object from all Daturl JSON **/
		$scope.removeComponentFromAssociatedataset = function()
		{
			if($scope.component["referenceID"] != undefined){
			var dataUrl = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL;
			for (var i = 0; i < dataUrl.length; i++) {
				var AssociatedDataSet = dataUrl[i].AssociatedDataSet;
				for (var j = 0; j < AssociatedDataSet.length; j++) {
				if (AssociatedDataSet[j].id === $scope.component["referenceID"]){
					AssociatedDataSet.splice(j, 1);
				}
			}
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL[i].AssociatedDataSet = AssociatedDataSet;
			}
			
			}
		}

		/** @description when datasource is refreshed, clear the dataset object from UI and JSON **/
		$scope.refreshConnection = function () {
			$scope.removeComponentFromAssociatedataset();
			$scope.datasetFieldList = [];
			$scope.selectedDatasource = "";
			$scope.selectedDataSet = "";
			$scope.selectedField = "";
			$scope.component[$scope.component.subElement]["DataSet"] = undefined;
			$scope.alertJson = "";
			$scope.alertFieldProperties = [];
			$scope.destroyFromComponent();
			$scope.setFieldInContainers();
		};
		$scope.destroyFromComponent = function () {
			$scope.removeComponentFromAssociatedataset();
			if ($scope.component[$scope.component.subElement]["Alerts"] !== undefined)
				$scope.component[$scope.component.subElement]["Alerts"] = {};
			if ($scope.component[$scope.component.subElement]["ConditionalColors"] !== undefined)
				$scope.component[$scope.component.subElement]["ConditionalColors"]["ConditionalColor"] = [];
			if ($scope.component[$scope.component.subElement]["CategoryColors"] !== undefined)
				$scope.component[$scope.component.subElement]["CategoryColors"]["CategoryColor"] = [];
			if ($scope.component[$scope.component.subElement]["SubCategoryColors"] !== undefined)
				$scope.component[$scope.component.subElement]["SubCategoryColors"]["subCategoryColor"] = [];
		};

		/** @description create a new instance of dataset object and assign the reference id as datasource id **/
		$scope.createDataSet = function () {
			$scope.selectedDataSet = "";
			if ($scope.selectedDatasource !== undefined) {
				$scope.component[$scope.component.subElement]["DataSet"] = $scope.getNewDataSetObject();
				$scope.selectedDataSet = $scope.component[$scope.component.subElement]["DataSet"];
				$scope.selectedDataSet.id = $scope.component["referenceID"];
			}
		};
		
		/** @description register the dataset with the datasource **/
		$scope.addToDataUrlAvailableDataSet = function () {
			var associatedDataset = $scope.getNewAssociatedDataSetObject();
			associatedDataset.id = $scope.selectedDataSet.id;
			/** Instead of storing complete component JSON, use the reference id.  if required ComponentJSON can be retrieved from this id **/
//			associatedDataset.component = $scope.component[$scope.component.subElement];
			associatedDataset.component = $scope.component.referenceID;
			$scope.selectedDatasource.AssociatedDataSet.push(associatedDataset);
		};

		/** @description update the dataset to datasource's associated list **/
		$scope.updateToDataUrlAvailableDataSet = function (dataSource) {
			var dataUrl = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL, "id", dataSource);
			var AssociatedDataSet = angular.copy(dataUrl.AssociatedDataSet);
			for (var i = 0; i < AssociatedDataSet.length; i++) {
				if (AssociatedDataSet[i].id === $scope.selectedDataSet.id){
					dataUrl.AssociatedDataSet.splice(i, 1);
				}
			}
		};

		/** @description remove this dataset from the list of datasource **/
		$scope.removeFromDataUrlAvailableDataSet = function (dataset) {
			var index = $scope.selectedDatasource.AssociatedDataSet.indexOf(dataset);
			$scope.selectedDatasource.AssociatedDataSet.splice(index, 1);
		};

		/** @description get the fresh object of dataset/ field **/
		$scope.getNewDataSetObject = function () {
			var newObject = "";
			return angular.copy($scope.modal.selectedDashboard.json["AbsoluteLayout_Object_" + $scope.component.subElement + "_DataSet"], newObject);
		};
		$scope.getNewFieldObject = function () {
			var newObject = "";
			return angular.copy($scope.modal.selectedDashboard.json["AbsoluteLayout_Object_" + $scope.component.subElement + "_DataSet_Fields"], newObject);
		};
		$scope.getNewAssociatedDataSetObject = function () {
			var newObject = "";
			return angular.copy($scope.modal.selectedDashboard.json.DataProviders_DataURL_AssociatedDataSet, newObject);
		};

		
		/** START Radio filter dataset methods **/
		$scope.availableValues = [];
		$scope.newValueField = { "label": "Label", "value": "Value" };
		$scope.loadValuesFields = function () {
			$scope.availableValues = $scope.component[$scope.component.subElement].Values;
			$scope.$apply();
		};
		$scope.addRowAndValueField = function () {
			$scope.availableValues.push(angular.copy($scope.newValueField));
			$scope.redrawRadioFilter();
		};
		$scope.deleteAllRowAndValueField = function () {
			$scope.availableValues.length = 0;
			$scope.redrawRadioFilter();
		};
		$scope.deleteRowAndValueField = function (valueField) {
			var index = $scope.availableValues.indexOf(valueField);
			$scope.availableValues.splice(index, 1);
			$scope.redrawRadioFilter();
		};
		$scope.redrawRadioFilter = function () {
			if( $scope.modal.selectedComponentId ) {
				$scope.redrawComponent($scope.getComponentbyId($scope.modal.selectedComponentId));
			}
			else {
				console.info( "Component is not selected!!");
			}
		};
		/** END Radio filter dataset methods **/


		/** FIELDS DRAG N DROP EVENTS LISTENERS **/
		$scope.onDragSuccess = function (data, event) {};
		$scope.onDropSuccess = function (data, event, droppingSection) {
			/**DAS-724 @description check reserved filed name for scorecard and datagrid with jquery easyui */
			if($scope.component.objectType == "scorecard"){
				if(data.name == "id" || data.name =="name" || data.name == "state")
				{
					ServiceFactory.showNotification("These fields name are not supported", "alert-info", 3000);
					return true;
				}
			}
			if($scope.component.objectType == "datagrid"){
				if(data.name == "length")
				{
					ServiceFactory.showNotification("These fields name are not supported", "alert-info", 3000);
					return true;
				}
			}
			$scope.addFieldToDataSet(data, droppingSection);
			if (navigator.appVersion.indexOf("Win") !== -1 || !Modernizr.inputtypes.color) {
				setTimeout(function () {
					$scope.initSpectrumColorPicker("input[type='color']");
				}, 0.01);
			}	
			
			
		};

		/** @description when field is dropped in filter component, it has to replace previous field **/
		$scope.onDropSuccessForFilterField = function (data, event, droppingSection) {
			$scope.addFieldToFilterDataSetForFilter(data, droppingSection);
			$scope.setLiHoverIconCSS();
		};
		$scope.addFieldToFilterDataSetForFilter = function (field, type) {
			field.fieldJson[$scope.datasetDesignProperties[$scope.component.designData.class]["name"]] = field.name;
			field.fieldJson[$scope.datasetDesignProperties[$scope.component.designData.class]["displayName"]] = field.name;
			field.fieldJson["Type"] = type;
			if (type === "Value") {
				var isValueFieldExist = false;
				for (var i = 0; i < $scope.selectedDataSet.Fields.length; i++) {
					if ($scope.selectedDataSet.Fields[i]["Type"] === type) {
						$scope.selectedDataSet.Fields[i] = angular.copy(field.fieldJson);
						isValueFieldExist = true;
						break;
					}
				}
				if (!isValueFieldExist){
					$scope.selectedDataSet.Fields.push(angular.copy(field.fieldJson));
				}
			} else if (type === "DisplayField") {
				var isDisplayFieldExist = false;
				for (var i = 0; i < $scope.selectedDataSet.Fields.length; i++) {
					if ($scope.selectedDataSet.Fields[i]["Type"] === type) {
						$scope.selectedDataSet.Fields[i] = angular.copy(field.fieldJson);
						isDisplayFieldExist = true;
						break;
					}
				}
				if (!isDisplayFieldExist){
					$scope.selectedDataSet.Fields.push(angular.copy(field.fieldJson));
				}
			}

			/**	Add field in UI containers **/
			for (var k = 0; k < $scope.fieldContainer.length; k++) {
				if ($scope.fieldContainer[k].Type === type) {
					$scope.fieldContainer[k]["Fields"][0] = angular.copy(field);
					$scope.selectedField = angular.copy(field);
					$scope.$apply();
				}
			}
			$scope.setSelectedVariable(undefined,$scope.component,"Component");
		};
		
		
		/** Dataset Field Alert Properties
		* 1-loadDataSet(){ make an empty object for Alert }
		* 2-addFieldToDataSet() { update the alert for that field }
		* 3-setSelectedField() { when a field is selected, update the alert also }
		* 4-refreshConnection() { when connection refreshed - update the alert also }
		**/
		
		/** @description when a field is selected, reload its alert properties **/
		$scope.updateAlertJsonForSelectedField = function (field) {
			if ($scope.component.designData.type === "datagrid") {
				var flag = false;
				var alertsArr = $scope.component[$scope.component.subElement].Alerts.AlertColumn;
				if (alertsArr !== undefined) {
					for (var i = 0; i < alertsArr.length; i++) {
						if (field.name === alertsArr[i].name) {
							$scope.alertJson = alertsArr[i];
							$scope.alertFieldProperties = angular.copy($scope.datasetDesignProperties[$scope.component.designData.class].alertProperties);
							$scope.updateAlertFieldProperties();
							flag = true;
							break;
						}
					}
				}
				if (IsBoolean(!flag)) {
					$scope.alertJson = $scope.getNewAlertColumnObject();
					$scope.alertJson.name = field.name;
					$scope.alertFieldProperties = angular.copy($scope.datasetDesignProperties[$scope.component.designData.class].alertProperties);
					$scope.updateAlertFieldProperties();
				}
			}
		};
		
		/** @description open the model for selected alert type **/
		$scope.onClickCustomAlertColor = function (prop) {
			if ($scope.alertJson.mode === "Comparison") {
				$scope.updateCustomPropertiesJson();
				$scope.onChangeCompareValue();
				$scope.showModelPopup("customAlertColortWindow");
			} else if ($scope.alertJson.mode === "Static Comparison") {
				$scope.updateCustomPropertiesJson();
				$scope.updateJsonforStaticComparision();
				$scope.showModelPopup("customAlertStaticComparisonWindow");
			} else {
				$scope.updateCustomPropertiesJson();
				$scope.updateAlertRangeJson();
				$scope.showModelPopup("AlertRangeColortWindow");
			}
		};
		/** @description open the model for Custom DataLabel type **/
		$scope.onClickCustomCellMerge = function(prop) {
			$scope.cellMergeArray = [];
		    $scope.updateCellMergeCustomPropertiesJson();
			$scope.showModelPopup("customCellMergeWindow");
		};
		$scope.updateCellMergeCustomPropertiesJson = function() {
			$scope.cellMergeArray = [];
			$scope.datasetField = $scope.setdatasetField();
		    $scope.cellMergeArray = $scope.selectedField.fieldJson.CellMergeCustomProperties;
		};
		/** @description Called when OK button from model is clicked, will update the Cell Merge properties **/
		$scope.updateCellMergePropertiesJson = function(prop) {
		    $scope.selectedField.fieldJson.CellMergeCustomProperties = $scope.cellMergeArray;
			for (var i = 0; i < $scope.component[$scope.component.subElement].DataSet.Fields.length; i++) {
		        if (IsBoolean($scope.component[$scope.component.subElement].DataSet.Fields[i].Name == $scope.selectedField.name)) {
		            $scope.component[$scope.component.subElement].DataSet.Fields[i].CellMergeCustomProperties = $scope.selectedField.fieldJson.CellMergeCustomProperties;
		        }
		    }
		};
		$scope.addCellMergeRow = function () {
			var cellMergeMap = {};
			var rowIndex = Object.keys($scope.cellMergeArray).length;
			cellMergeMap["rowIndex"] = rowIndex;
			cellMergeMap["index"] = "1";
			cellMergeMap["rowspan"] = "2";
			cellMergeMap["colspan"] = "0";
			cellMergeMap["field"] = $scope.selectedField.fieldJson.fieldname;
			$scope.cellMergeArray[rowIndex] = cellMergeMap;
		};
		$scope.deleteCellMerge = function (obj) {
			var index = $scope.cellMergeArray.indexOf(obj);
			$scope.cellMergeArray.splice(index, 1);
		};
		$scope.deleteAllCellMerge = function(){
			$scope.cellMergeArray = [];
		}
		/** @description open the model for Custom DataLabel type **/
		$scope.onClickCustomDataLabel = function(prop) {
		    $scope.updateDataLabelCustomPropertiesJson();
			$scope.showModelPopup("customDataLabelWindow");
		}

		$scope.updateDataLabelCustomPropertiesJson = function() {
		    $scope.customDataLabelProperty = {};
		    $scope.ShowPercentage = true;
		    var ShowPercentageValue = (($scope.component.componentType == 'bar_chart') && ($scope.component.Chart.ChartType == "100%") || ($scope.component.componentType == 'group_bar_chart') && ($scope.component.Chart.ChartType == "100%") || ($scope.component.componentType == 'timeline_chart') && ($scope.component.Chart.ColumnType == "100%")) ? true : false;
		    if(ShowPercentageValue){
		    	$scope.ShowPercentageValue = true;
		    }else{
		    	$scope.ShowPercentageValue = false;
		    	$scope.selectedField.fieldJson.DataLabelCustomProperties.showPercentValue = false;
		    }
		    if($scope.component.componentType == "pie_chart"){
		    	$scope.ShowPercentage = !IsBoolean($scope.component.Chart.showSliceValue);
		    }
		    if($scope.component.objectType == "funnel"){
		    	$scope.ShowPercentage = !IsBoolean($scope.component.Funnel.showLayerValue); 
		    }
		    $scope.datasetField = $scope.setdatasetField();
		    if (IsBoolean(($scope.selectedField.fieldJson.DataLabelCustomProperties.dataLabelFontColor == "") || ($scope.selectedField.fieldJson.DataLabelCustomProperties.datalabelField == ""))) {
		        $scope.selectedField.fieldJson.DataLabelCustomProperties.datalabelField = $scope.selectedField.name;
		    }
		    $scope.customDataLabelProperty["showDataLabel"] = {
		        "value": IsBoolean($scope.selectedField.fieldJson.DataLabelCustomProperties.showDataLabel),
		        "disabled": false
		    };
		    /*DAS-316*/
		    $scope.customDataLabelProperty["hideDataLabel"] = {
			        "value": IsBoolean($scope.selectedField.fieldJson.DataLabelCustomProperties.hideDataLabel),
			        "disabled": false
			    };
		    $scope.customDataLabelProperty["hideDataLabelText"] = {
			        "value": $scope.selectedField.fieldJson.DataLabelCustomProperties.hideDataLabelText,
			        "disabled": false
			    };
		    $scope.customDataLabelProperty["useFieldColor"] = {
		        "value": IsBoolean($scope.selectedField.fieldJson.DataLabelCustomProperties.useFieldColor),
		        "disabled": false
		    };
		    $scope.customDataLabelProperty["showPercentValue"] = {
		    	"value": IsBoolean($scope.selectedField.fieldJson.DataLabelCustomProperties.showPercentValue),
		    	"disabled": false
		    };
		    $scope.customDataLabelProperty["datalabelBackgroundRect"] = {
			    	"value": IsBoolean($scope.selectedField.fieldJson.DataLabelCustomProperties.datalabelBackgroundRect),
			    	"disabled": false
			};
		    $scope.customDataLabelProperty["datalabelBackgroundRectColor"] = {
			        "value": $scope.selectedField.fieldJson.DataLabelCustomProperties.datalabelBackgroundRectColor
			};
		    $scope.customDataLabelProperty["datalabelStrokeColor"] = {
			        "value": $scope.selectedField.fieldJson.DataLabelCustomProperties.datalabelStrokeColor
			};
		    $scope.customDataLabelProperty["dataLabelFontColor"] = {
		        "value": $scope.selectedField.fieldJson.DataLabelCustomProperties.dataLabelFontColor
		    };
		    $scope.customDataLabelProperty["dataLabelDefaultFontColor"] = {
			        "value": $scope.selectedField.fieldJson.DataLabelCustomProperties.dataLabelDefaultFontColor
			    };
		    $scope.customDataLabelProperty["dataLabelFontSize"] = {
		        "value": $scope.selectedField.fieldJson.DataLabelCustomProperties.dataLabelFontSize
		    };
		    $scope.customDataLabelProperty["dataLabelUseComponentFormater"] = {
		    	"value": $scope.selectedField.fieldJson.DataLabelCustomProperties.dataLabelUseComponentFormater
		    };
		    $scope.datasetDesignProperties.DataLabelCustomProperties.datalabelField = {};
		    $scope.datasetDesignProperties.DataLabelCustomProperties.datalabelField.options = $scope.datasetField;
		    for (var key in $scope.datasetDesignProperties.DataLabelCustomProperties) {
		        $scope.customDataLabelProperty[key] = {
		            "options": $scope.datasetDesignProperties.DataLabelCustomProperties[key].options,
		            "value": $scope.selectedField.fieldJson.DataLabelCustomProperties[key]
		        }
		    };
		};
		/** @description set the Data Label Field name options **/
		$scope.setdatasetField = function() {
		    var datasetField = [];
		    for (var i = 0, datasetFieldList = $scope.datasetFieldList.length; datasetFieldList > i; i++) {
		        datasetField[i] = {
		            "key": $scope.datasetFieldList[i].name,
		            "value": $scope.datasetFieldList[i].name
		        }
		    }
		    return datasetField;
		};

		/** @description Called when OK button from model is clicked, will update the Data Label properties **/
		$scope.updateCustomDataLabelPropertiesJson = function(prop) {
		    for (var key in $scope.selectedField.fieldJson.DataLabelCustomProperties) {
		        $scope.selectedField.fieldJson.DataLabelCustomProperties[key] = $scope.customDataLabelProperty[key].value;
		    }
		    for (var i = 0; i < $scope.component[$scope.component.subElement].DataSet.Fields.length; i++) {
		        if (IsBoolean($scope.component[$scope.component.subElement].DataSet.Fields[i].Name == $scope.selectedField.name)) {
		            $scope.component[$scope.component.subElement].DataSet.Fields[i].DataLabelCustomProperties = $scope.selectedField.fieldJson.DataLabelCustomProperties;
		        }
		    }
		    if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
				$scope.syncComponentPropertyInMobileView("dataLabelProperty", $scope.component, prop);
				$scope.syncComponentPropertyInTabletView("dataLabelProperty", $scope.component, prop);
			}
		};
		/** @description open the model for selected series color type **/
		$scope.onClickCustomRadiusRange = function (prop) {
			  $scope.updateFixedRadius(); // method for finding radius field or fixed radius
			  $scope.updateRadiusRangeAdvancePropertiesJson();
			  $scope.showModelPopup("customRadiusRangeWindow");
			  $scope.fixedRadiusValue = 0;
		};
		/** @description method will update radius value for bubble and plot chart  **/
		$scope.updateFixedRadius = function () {
			$scope.isFixedRadius = false;		
			$scope.datasetField = $scope.setdatasetField();	
			$scope.allFields = [];
			for(var i = 0; i < $scope.datasetField.length;i++){
				$scope.allFields[i] = $scope.datasetField[i].value;				
			}
			if($scope.component.componentType == "scattered_plot_chart"){
				$scope.radiusField = $scope.selectedField.fieldJson.PlotRadius;
				$scope.fixedRadiusValue = $scope.radiusField;
			} else {
				$scope.radiusField = $scope.selectedField.fieldJson.RadiusField;
				$scope.fixedRadiusValue = (!isNaN($scope.radiusField)) ? $scope.radiusField : 0 ;
			}
			if($scope.radiusField === ""){
				$scope.radiusField = $scope.selectedField.fieldJson.Name;
			}
			if($scope.allFields.indexOf($scope.radiusField) !== -1){
				$scope.isFixedRadius = false;
			} else {
				$scope.isFixedRadius = true; 
			}
			if(!isNaN($scope.radiusField) && $scope.radiusField !== $scope.selectedField.fieldJson.Name)
				$scope.radiusField =$scope.selectedField.fieldJson.Name;
		};
		/** @description method will update fields  - update the default properties for bubble and plot chart **/
		$scope.updateRadiusRangeAdvancePropertiesJson = function () {
			$scope.customRangeColorPropertiesJson = {};
			var selectedFieldDatasetFields = $scope.datasetField.slice(0);
			selectedFieldDatasetFields.unshift( {key : "", value : "None"} );
			if($scope.component.componentType === 'timeline_chart'){
				$scope.customRangeColorPropertiesJson["isFixedRadius"] = {				
						"value" : ($scope.selectedField.fieldJson.isFixedRadius === undefined) ? true : $scope.selectedField.fieldJson.isFixedRadius,
						"disabled" : false
				};
				$scope.customRangeColorPropertiesJson["fixedValue"] = {
						"value" : ($scope.selectedField.fieldJson.PlotRadius === undefined) ? 3 : $scope.selectedField.fieldJson.PlotRadius
				};
				$scope.customRangeColorPropertiesJson["radiusField"] = {
						"options": $scope.datasetField,
						"value" : (($scope.selectedField.fieldJson.radiusField === undefined) || (!IsBoolean($scope.selectedField.fieldJson.isFixedRadius))) ? $scope.radiusField : $scope.selectedField.fieldJson.radiusField 
				};
			}else{
				$scope.customRangeColorPropertiesJson["isFixedRadius"] = {				
						"value" : $scope.isFixedRadius,
						"disabled" : false
				};
				$scope.customRangeColorPropertiesJson["fixedValue"] = {
						"value" :$scope.fixedRadiusValue
				};
				$scope.customRangeColorPropertiesJson["radiusField"] = {
						"options": $scope.datasetField,
						"value" : $scope.radiusField
				};
			}
			
			$scope.customRangeColorPropertiesJson["colorField"] = {
					"options": selectedFieldDatasetFields,
					"value": $scope.selectedField.fieldJson.ColorField
			};
			$scope.customRangeColorPropertiesJson["otherField"] = {
					"options": $scope.datasetField,
					"value":  $scope.selectedField.fieldJson.OtherField
			};
			$scope.customRangeColorPropertiesJson["otherFieldDisplayName"] = {				
					"value": $scope.selectedField.fieldJson.OtherFieldDisplayName
			};
			$scope.customRangeColorPropertiesJson["radiusFieldDisplayName"] = {				
					"value": $scope.selectedField.fieldJson.RadiusFieldDisplayName
			};
			$scope.customRangeColorPropertiesJson["colorFieldDisplayName"] = {				
					"value": $scope.selectedField.fieldJson.ColorFieldDisplayName
			};
		};
		/** @description Called when SAVE button from model is clicked, will update the Radius & Color Field properties for Bubble Chart **/
		$scope.updateRadiusRangeCustomAdvancePropertiesJson = function(prop) {
			if($scope.component.componentType == "scattered_plot_chart"){
				/**Added for differentiating fixed radius and dynamic radius */
				$scope.selectedField.fieldJson.isFixedRadius = $scope.customRangeColorPropertiesJson.isFixedRadius.value;
				if($scope.customRangeColorPropertiesJson.isFixedRadius.value){
					$scope.selectedField.fieldJson.PlotRadius = $scope.customRangeColorPropertiesJson.fixedValue.value;
				} else {
					$scope.selectedField.fieldJson.PlotRadius = $scope.customRangeColorPropertiesJson.radiusField.value;
				}
			}else if($scope.component.componentType == "timeline_chart"){
				$scope.selectedField.fieldJson.isFixedRadius = $scope.customRangeColorPropertiesJson.isFixedRadius.value;
				$scope.selectedField.fieldJson.PlotRadius = $scope.customRangeColorPropertiesJson.fixedValue.value;
				$scope.selectedField.fieldJson.RadiusField = $scope.customRangeColorPropertiesJson.radiusField.value;
			} else {
				if($scope.customRangeColorPropertiesJson.isFixedRadius.value){
					$scope.selectedField.fieldJson.RadiusField = $scope.customRangeColorPropertiesJson.fixedValue.value;
				} else {
					$scope.selectedField.fieldJson.RadiusField = $scope.customRangeColorPropertiesJson.radiusField.value;
				}
			}
			
			$scope.selectedField.fieldJson.OtherField = $scope.customRangeColorPropertiesJson.otherField.value;
			$scope.selectedField.fieldJson.OtherFieldDisplayName = $scope.customRangeColorPropertiesJson.otherFieldDisplayName.value;
			$scope.selectedField.fieldJson.RadiusFieldDisplayName = $scope.customRangeColorPropertiesJson.radiusFieldDisplayName.value;
			$scope.selectedField.fieldJson.ColorFieldDisplayName = $scope.customRangeColorPropertiesJson.colorFieldDisplayName.value;
			$scope.selectedField.fieldJson.ColorField = $scope.customRangeColorPropertiesJson.colorField.value;
			for (var i = 0; i < $scope.component[$scope.component.subElement].DataSet.Fields.length; i++) {
			    if (IsBoolean($scope.component[$scope.component.subElement].DataSet.Fields[i].Name == $scope.selectedField.name)) {
			        $scope.component[$scope.component.subElement].DataSet.Fields[i].RadiusField = $scope.selectedField.fieldJson.RadiusField;
			        $scope.component[$scope.component.subElement].DataSet.Fields[i].ColorField = $scope.selectedField.fieldJson.ColorField;
			        $scope.component[$scope.component.subElement].DataSet.Fields[i].PlotRadius = $scope.selectedField.fieldJson.PlotRadius;
			        $scope.component[$scope.component.subElement].DataSet.Fields[i].OtherField = $scope.selectedField.fieldJson.OtherField;
			        $scope.component[$scope.component.subElement].DataSet.Fields[i].OtherFieldDisplayName = $scope.selectedField.fieldJson.OtherFieldDisplayName;
			        $scope.component[$scope.component.subElement].DataSet.Fields[i].RadiusFieldDisplayName = $scope.selectedField.fieldJson.RadiusFieldDisplayName;
			        $scope.component[$scope.component.subElement].DataSet.Fields[i].ColorFieldDisplayName = $scope.selectedField.fieldJson.ColorFieldDisplayName;
			        $scope.component[$scope.component.subElement].DataSet.Fields[i].isFixedRadius = $scope.selectedField.fieldJson.isFixedRadius;
			    }
			}
		};
		/**	@description will update the other field, color field and radius field displayname for plot chart modal according to other field**/
		$scope.updateOtherFieldDpName = function(type) {
			switch (type) {
		    case "OtherField":
		        $scope.customRangeColorPropertiesJson.otherFieldDisplayName.value = $scope.customRangeColorPropertiesJson.otherField.value;
		        break;
		    case "ColorField":
		        $scope.customRangeColorPropertiesJson.colorFieldDisplayName.value = $scope.customRangeColorPropertiesJson.colorField.value;
		        break;
		    case "RadiusField":
		        $scope.customRangeColorPropertiesJson.radiusFieldDisplayName.value = $scope.customRangeColorPropertiesJson.radiusField.value;
		}
		};
		/** @description depending upon the alert type selection - update the default properties **/
		$scope.updateCustomPropertiesJson = function () {
			switch ($scope.alertJson.mode) {
			case "Comparison":
				$scope.customAlertPropertiesJson = {};
				if ($scope.alertJson.alertSize === undefined) {
					$scope.alertJson.alertSize = 12;
				}
				$scope.customAlertPropertiesJson["fixedValueCompare"] = {
					"value" : IsBoolean($scope.alertJson.fixedValueCompare),
					"disabled" : false
				};
				$scope.customAlertPropertiesJson["fixedValue"] = {
					"value" : parseFloat($scope.alertJson.fixedValue)
				};
				$scope.customAlertPropertiesJson["compareColumn"] = {
					"options" : $scope.datasetFieldList,
					"value" : $scope.alertJson.compareColumn
				};
				$scope.customAlertPropertiesJson["alertPosition"] = {
					"options" : [{
							"key" : "left", "value" : "Left"
						}, {
							"key" : "right", "value" : "Right"
						}
					],
					"value" : $scope.alertJson.alertPosition
				};
				$scope.customAlertPropertiesJson["alertSize"] = {
						"value" : $scope.alertJson.alertSize
					};
				$scope.customAlertPropertiesJson["alertType"] = {
					"options" : [{
							"key" : "arrow", "value" : "Arrow"
						}, {
							"key" : "tick", "value" : "Check Mark"
						}, {
							"key" : "dot", "value" : "Dot"
						}, {
							"key" : "textcolor", "value" : "Text Color"
						}, {
							"key" : "bar", "value" : "Bar"
						}, {
							"key" : "colorfill", "value" : "Color Fill"
						}
					],
					"value" : $scope.alertJson.alertType
				};
				break;
			case "Static Comparison":
				$scope.StaticComparisionAlertPropertiesJson = {};
				if ($scope.alertJson.alertSize === undefined) {
					$scope.alertJson.alertSize = 12;
				}
				$scope.StaticComparisionAlertPropertiesJson["rowStaticIndicator"] = ($scope.alertJson.alertType === "customshape")?false:true;
				$scope.StaticComparisionAlertPropertiesJson["columnName"] = {
					"value" : $scope.alertJson.name
				};
				$scope.StaticComparisionAlertPropertiesJson["compareColumn"] = {
					"options" : $scope.datasetFieldList,
					"value" : $scope.alertJson.compareColumn || $scope.alertJson.name
				};
				$scope.StaticComparisionAlertPropertiesJson["alertPosition"] = {
					"options" : [{
							"key" : "left", "value" : "Left"
						}, {
							"key" : "right", "value" : "Right"
						}
					],
					"value" : $scope.alertJson.alertPosition
				};
				$scope.StaticComparisionAlertPropertiesJson["alertSize"] = {
						"value" : $scope.alertJson.alertSize
					};
				$scope.StaticComparisionAlertPropertiesJson["alertType"] = {
					"options" : [{
						"key" : "star", "value" : "Star"
					}, {
						"key" : "hexagon", "value" : "Hexagon"
					}, {
						"key" : "diamond", "value" : "Diamond"
					}, {
						"key" : "dot", "value" : "Dot"
					}, {
						"key" : "textcolor", "value" : "Text Color"
					}, {
						"key" : "colorfill", "value" : "Color Fill"
					},{
						"key" : "customshape", "value" : "Custom Shape"
					}
					],
					"value" : $scope.alertJson.alertType
				};
				$scope.StaticComparisionAlertPropertiesJson["customIcon"] = {
						"value" : $scope.alertJson.customIcon
					};
				break;
			default:
				$scope.customPropertiesJson = {};
				if ($scope.alertJson.alertSize === undefined) {
					$scope.alertJson.alertSize = 12;
				}
				$scope.customPropertiesJson.showDynamicRange = IsBoolean($scope.alertJson.showDynamicRange);
				$scope.customPropertiesJson.minColor = $scope.alertJson.minColor;
				$scope.customPropertiesJson.maxColor = $scope.alertJson.maxColor;
				$scope.customPropertiesJson["compareColumn"] = {
					"options" : $scope.datasetFieldList,
					"disabled" : true
				};
				$scope.customPropertiesJson["alertPosition"] = {
					"options" : [{
							"key" : "left", "value" : "Left"
						}, {
							"key" : "right", "value" : "Right"
						}
					],
					"value" : $scope.alertJson.alertPosition
				};
				$scope.customPropertiesJson["alertSize"] = {
						"value" : $scope.alertJson.alertSize
					};
				$scope.customPropertiesJson["alertType"] = {
					"options" : [{
							"key" : "star", "value" : "Star"
						}, {
							"key" : "hexagon", "value" : "Hexagon"
						}, {
							"key" : "diamond", "value" : "Diamond"
						}, {
							"key" : "dot", "value" : "Dot"
						}, {
							"key" : "textcolor", "value" : "Text Color"
						}, {
							"key" : "bar", "value" : "Bar"
						}, {
							"key" : "colorfill", "value" : "Color Fill"
						}
					],
					"value" : $scope.alertJson.alertType
				};
				break;
			}
		};
		$scope.checkRowStaticIndicator = function (alertPropertiesJson) {
			$scope.StaticComparisionAlertPropertiesJson["rowStaticIndicator"] = (alertPropertiesJson.key === "customshape")?false:true;
		};
		/** @description update the alert JSON when fixedValue comparison check box updated **/
		$scope.onChangeCompareValue = function () {
			var comparefield = (IsBoolean($scope.customAlertPropertiesJson.fixedValueCompare.value)) ? 
				parseFloat($scope.customAlertPropertiesJson.fixedValue.value) : 
					$scope.customAlertPropertiesJson.compareColumn.value;
			var alertColor = $scope.alertJson.colors.split(",");
			$scope.numeralComparision = [];
			var operator = ["<", "=", ">"];
			$scope.updateCustomeAlertPropertiesJson();
			for (var i = 0; i < 3; i++) {
				var alertMap = {};
				alertMap["AlertColumn"] = $scope.alertJson.name;
				alertMap["Operator"] = operator[i];
				alertMap["CompareColumn"] = comparefield;
				alertMap["AlertColor"] = convertColorToHex(alertColor[i]);
				$scope.numeralComparision.push(alertMap);
			}
		};
		/** @description update compare column option for scored card **/
		$scope.updateCustomeAlertPropertiesJson = function(){
			if($scope.component.objectType == "scorecard"){
				if($scope.alertJson.mode === "Comparison")
					$scope.customAlertPropertiesJson.compareColumn.options = $scope.fieldContainer[0].Fields;
				else if($scope.alertJson.mode === "Static Comparison") 
					$scope.StaticComparisionAlertPropertiesJson.compareColumn.options = $scope.fieldContainer[0].Fields;
			}
		};
		
		/** @description call back when alert property is changed **/
		$scope.onAlertPropertyChange = function(prop) {
		    if ($scope.alertJson.hasOwnProperty(prop.attributeName)) {
		        if (typeof(prop["value"]) === "object") {
		            $scope.alertJson[prop.attributeName] = prop.value.value;
		        } else {
		            $scope.alertJson[prop.attributeName] = prop.value;
		        }
		    }
		    if (prop.attributeName == "mode") {
		        if ($scope.component.designData.type === "datagrid" || $scope.component.designData.type === "scorecard") {
		            $scope.alertJson.alertType = "colorfill";
		        }
		    }
		    $scope.saveAlert();
		};
		
		/** @description properties for alert type of indicator **/
		$scope.addAlertRange = function () {
			var alertMap = {};
			alertMap["index"] = $scope.alertRangeArray.length;
			alertMap["RangeFrom"] = "";
			alertMap["RangeUpTo"] = "";
			alertMap["AlertColor"] = getRandomHexColor();
			alertMap["Delete"] = $scope.alertRangeArray.length;
			$scope.alertRangeArray.push(alertMap);
		};
		$scope.deleteAlertRange = function (obj) {
			var index = $scope.alertRangeArray.indexOf(obj);
			$scope.alertRangeArray.splice(index, 1);
		};
		$scope.deleteAllAlertRanges = function(){
			$scope.alertRangeArray = [];
		}
		$scope.deleteAlertRangeForStaticComparision = function (obj) {
			var index = $scope.numeralComparision.indexOf(obj);
			$scope.numeralComparision.splice(index, 1);
		};
		$scope.deleteAllAlertRangeForStaticComparision = function(){
			$scope.numeralComparision = [];
		};
		$scope.updateAlertRangeJson = function () {
			$scope.alertRangeArray = [];
			if($scope.alertJson.ranges !== ""){
				var alertColor = $scope.alertJson.colors.split(",");
				var alertRange = $scope.alertJson.ranges.split(",");
				for (var i = 0; i < alertRange.length; i++) {
					var alertMap = {};
					alertMap["index"] = i;
					alertMap["RangeFrom"] = alertRange[i].split("~")[0];
					alertMap["RangeUpTo"] = alertRange[i].split("~")[1];
					alertMap["AlertColor"] = convertColorToHex(alertColor[i]);
					alertMap["Delete"] = i;
					$scope.alertRangeArray.push(alertMap);
				}
			}
		};

		/** @description update the property of alert field **/
		$scope.updateAlertFieldProperties = function () {
			for (var key in $scope.alertJson) {
				for (var i = 0; i < $scope.alertFieldProperties.length; i++) {
					if ($scope.alertFieldProperties[i]["attributeName"] === key) {
						if ($scope.alertFieldProperties[i]["attributeName"] === "compareColumn") {
							$scope.alertFieldProperties[i].options = [];
							for (var key2 in $scope.datasetFieldList) {
								$scope.alertFieldProperties[i].options.push({
									"key" : $scope.datasetFieldList[key2].name,
									"value" : $scope.datasetFieldList[key2].name
								});
							}
						} else {
							if($scope.alertFieldProperties[i].type === "checkbox"){
								$scope.alertFieldProperties[i]["value"] = IsBoolean($scope.alertJson[key]);
							}else{
								$scope.alertFieldProperties[i]["value"] = $scope.alertJson[key];
							}
						}
					}
				}
			}
		};
	/** @description Called when OK button from model is clicked, will update the alert color properties **/
		$scope.updateAlertColor = function (prop) {
			if ($scope.alertJson.mode === "Comparison") {
				var newColor = "";
				for (var i = 0; i < $scope.numeralComparision.length; i++) {
					newColor += $scope.numeralComparision[i].AlertColor + ",";
				}
				$scope.alertJson.colors = newColor.substring(0, newColor.length - 1);
				$scope.alertJson.alertType = $scope.customAlertPropertiesJson.alertType.value;
				$scope.alertJson.alertPosition = $scope.customAlertPropertiesJson.alertPosition.value;
				$scope.alertJson.alertSize = $scope.customAlertPropertiesJson.alertSize.value;
				$scope.alertJson.fixedValue = $scope.customAlertPropertiesJson.fixedValue.value;
				$scope.alertJson.fixedValueCompare = $scope.customAlertPropertiesJson.fixedValueCompare.value;
				$scope.alertJson.compareColumn = $scope.customAlertPropertiesJson.compareColumn.value;
				$scope.saveAlert();
			} else if ($scope.alertJson.mode === "Static Comparison") {
				$scope.alertJson.compareColumn = $scope.StaticComparisionAlertPropertiesJson.compareColumn.value;
				$scope.alertJson.alertType = $scope.StaticComparisionAlertPropertiesJson.alertType.value;
				$scope.alertJson.alertPosition = $scope.StaticComparisionAlertPropertiesJson.alertPosition.value;
				$scope.alertJson.alertSize = $scope.StaticComparisionAlertPropertiesJson.alertSize.value;
				var newColor = "";
				var newRange = "";
				var newOperator = "";
				var newDirection = "";
				for (var i = 0; i < $scope.numeralComparision.length; i++) {
					newRange += $scope.numeralComparision[i].Range + ",";
					newColor += $scope.numeralComparision[i].AlertColor + ",";
					newOperator += $scope.numeralComparision[i].SelectedOperator + ",";
					newDirection += $scope.numeralComparision[i].customIcon + ",";
				}
				$scope.alertJson.staticRange = newRange.substring(0, newRange.length - 1);
				$scope.alertJson.colors = newColor.substring(0, newColor.length - 1);
				$scope.alertJson.operatorName = newOperator.substring(0, newOperator.length - 1);
				$scope.alertJson.customIcon = newDirection.substring(0, newDirection.length - 1);
				$scope.alertJson.fixedValueCompare = "false";
				$scope.saveAlert();
			} else {
				$scope.alertJson.compareColumn = $scope.customPropertiesJson.compareColumn.value;
				$scope.alertJson.alertType = $scope.customPropertiesJson.alertType.value;
				$scope.alertJson.alertPosition = $scope.customPropertiesJson.alertPosition.value;
				$scope.alertJson.alertSize = $scope.customPropertiesJson.alertSize.value;
				var newColor = "";
				var newRange = "";
				for (var i = 0; i < $scope.alertRangeArray.length; i++) {
					newRange += $scope.alertRangeArray[i].RangeFrom + "~" + $scope.alertRangeArray[i].RangeUpTo + ",";
					newColor += $scope.alertRangeArray[i].AlertColor + ",";
				}
				$scope.alertJson.ranges = newRange.substring(0, newRange.length - 1);
				$scope.alertJson.colors = newColor.substring(0, newColor.length - 1);
				$scope.alertJson.showDynamicRange = $scope.customPropertiesJson.showDynamicRange;
//				$scope.alertJson.minColor = $scope.customPropertiesJson.minColor;
//				$scope.alertJson.maxColor = $scope.customPropertiesJson.maxColor;
				$scope.saveAlert();
			}
		};

		/** @description update the default properties for static alert **/
		$scope.updateJsonforStaticComparision = function () {
			$scope.numeralComparision = [];
			if($scope.alertJson.staticRange !== ""){
				$scope.updateCustomeAlertPropertiesJson();
				var comparefield = $scope.StaticComparisionAlertPropertiesJson.compareColumn.value;
				var alertColor = $scope.alertJson.colors.split(",");
				if ($scope.alertJson.staticRange === undefined)
					$scope.alertJson.staticRange = "0,1,2";
				if ($scope.alertJson.operatorName === undefined)
					$scope.alertJson.operatorName = ">,==,<=";
				var colorRange = $scope.alertJson.staticRange.split(",");
				var selectedOperator = $scope.alertJson.operatorName.split(",");
				if ($scope.alertJson.customIcon === undefined) {
					$scope.alertJson.customIcon = "bd-down-arrow,bd-minus,bd-up-arrow";
				}
				if ($scope.alertJson.alertSize === undefined) {
					$scope.alertJson.alertSize = 12;
				}
				var customIconArr = $scope.alertJson.customIcon.split(",");
				var operator = {
					"options" : [{
							"value" : "<", "key" : "<"
						}, {
							"value" : "<=", "key" : "<="
						}, {
							"value" : "==", "key" : "=="
						}, {
							"value" : "!=", "key" : "!="
						}, {
							"value" : ">", "key" : ">"
						}, {
							"value" : ">=", "key" : ">="
						}
					]
				};
				for (var i = 0; i < colorRange.length; i++) {
					var alertMap = {};
					alertMap["index"] = i;
					alertMap["Range"] = colorRange[i];
					alertMap["Operator"] = operator;
					alertMap["SelectedOperator"] = selectedOperator[i];
					alertMap["CompareColumn"] = comparefield;
					alertMap["Delete"] = i;
					alertMap["customIcon"] = customIconArr[i];
					alertMap["AlertColor"] = convertColorToHex(alertColor[i]);
					$scope.numeralComparision.push(alertMap);
				}
			}
		};
		$scope.addStaticAlertRange = function () {
			var alertMap = {};
			var operator = {
				"options" : [{
						"value" : "<", "key" : "<"
					}, {
						"value" : "<=", "key" : "<="
					}, {
						"value" : "==", "key" : "=="
					}, {
						"value" : "!=", "key" : "!="
					}, {
						"value" : ">", "key" : ">"
					}, {
						"value" : ">=", "key" : ">="
					}
				]
			};
			alertMap["index"] = $scope.numeralComparision.length;
			alertMap["Range"] = "0";
			alertMap["Operator"] = operator;
			alertMap["SelectedOperator"] = "<";
			alertMap["CompareColumn"] = $scope.StaticComparisionAlertPropertiesJson.compareColumn.value;
			alertMap["Delete"] = $scope.numeralComparision.length;
			alertMap["customIcon"] = "bd-minus";
			alertMap["AlertColor"] = getRandomHexColor();
			$scope.numeralComparision.push(alertMap);
		};

		/** update the alert JSON when alert Properties changed or OK button clicked from model **/
		$scope.saveAlert = function (prop) {
			if ($scope.component[$scope.component.subElement].Alerts.AlertColumn === undefined){
				$scope.component[$scope.component.subElement].Alerts["AlertColumn"] = [];
			}
			var alertColumns = $scope.component[$scope.component.subElement].Alerts.AlertColumn;
			var flag = false;
			for (var i = 0; i < alertColumns.length; i++) {
				if (alertColumns[i].name === $scope.alertJson.name) {
					if (IsBoolean($scope.alertJson.showAlert)){
						$scope.component[$scope.component.subElement].Alerts.AlertColumn.splice(i, 1, $scope.alertJson);
					}else{
						$scope.component[$scope.component.subElement].Alerts.AlertColumn.splice(i, 1);
					}
					flag = true;
					break;
				}
			}
			if (!IsBoolean(flag) && IsBoolean($scope.alertJson.showAlert)){
				$scope.component[$scope.component.subElement].Alerts.AlertColumn.push($scope.alertJson);
			}
			/** Synchronize absoluteLayout component object property with mobile and tablet view component object property **/
            if(IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
            	$scope.syncComponentPropertyInMobileView("alertProperty", $scope.component, prop);
            	$scope.syncComponentPropertyInTabletView("alertProperty", $scope.component, prop);
            }
		};

		/** @description get fresh objects for alert and alertColumn properties **/
		$scope.getNewAlertsObject = function () {
			var newObject = "";
			return angular.copy($scope.modal.selectedDashboard.json["AbsoluteLayout_Object_" + $scope.component.subElement + "_Alerts"], newObject);
		};
		$scope.getNewAlertColumnObject = function () {
			var newObject = "";
			return angular.copy($scope.modal.selectedDashboard.json["AbsoluteLayout_Object_" + $scope.component.subElement + "_Alerts_AlertColumn"], newObject);
		};
		$scope.onCustomMapFileClick = function(prop) {
            $("#browseMapSVG").click().on("change", function(evt) {
                evt.stopImmediatePropagation();
                var file = evt.target.files[0];
                if (file.type == "image/svg+xml") {
                    var fReader = new FileReader();
                    fReader.onload = function(e) {
                        var fText = fReader.result;
                        prop.value = fText;
                        $scope.selectedIndicatorModal.icon = prop.value;
                    };
                    fReader.readAsText(file);
                } else {
                    ServiceFactory.showNotification("Please use SVG file instead of " + file.name, "alert-danger", 3000);
                }
            });
        };
        $scope.showSVG = function(browseMapSVG) {
			$scope.browseMapSVG = browseMapSVG;
			$scope.selectedIndicatorModal.showSvg = browseMapSVG;
		}
		/** Conditional/Category Color Indicator **/
		$scope.updateOperatorList = function (fixedValueComparison) {
			$scope.compareOperators = [];
			$scope.compareOperators.push({ "value" : "", "key" : "" });
			$scope.compareOperators.push({ "value" : "<", "key" : "<" });
			$scope.compareOperators.push({ "value" : "<=", "key" : "<=" });
			$scope.compareOperators.push({ "value" : "==", "key" : "==" });
			$scope.compareOperators.push({ "value" : "!=", "key" : "!=" });
			$scope.compareOperators.push({ "value" : ">", "key" : ">" });
			$scope.compareOperators.push({ "value" : ">=", "key" : ">=" });
			if (fixedValueComparison) {
				$scope.compareOperators.push({ "value" : "between", "key" : "between" });		
			}
			$scope.fixedValueComparison = fixedValueComparison;
			if($scope.selectedIndicator !== undefined){// && $scope.selectedIndicatorModal !== undefined 
				$scope.selectedIndicator.flag = fixedValueComparison;
				$scope.selectedIndicatorModal.flag = fixedValueComparison;
			}
		};

		/** @description create New Conditional Color Indicator **/
		$scope.createNewConditionalColorIndicator = function () {
			if ($scope.selectedField.fieldJson !== "" && $scope.selectedField.fieldJson !== undefined) {
				$scope.compareOperators = [];
				$scope.selectedIndicatorModal = {};
				$scope.indicatorWindowMode = "Create";
				$scope.fixedValueComparison = true;
				$scope.browseMapSVG = false;
				$scope.updateOperatorList($scope.fixedValueComparison);
				$scope.selectedIndicator = $scope.getNewConditionalColorObject();
				$scope.selectedIndicator.seriesName = $scope.selectedField.name;
				$scope.selectedIndicator.operator = "==";
				$scope.selectedIndicator.compareTo = "0";
				$scope.selectedIndicator.opacity = 1;
				$scope.selectedIndicator.comparedField = $scope.selectedField.name;
				$scope.selectedIndicator.otherField =  $scope.selectedField.fieldJson.OtherField; //other field
				$scope.selectedIndicator.flag = $scope.fixedValueComparison;
				$scope.selectedIndicator.showSvg = $scope.browseMapSVG;
				$scope.compareColumnFields = [];
				for (var i = 0; i < $scope.datasetFieldList.length; i++) {
					if($scope.component.componentType == "decomposition_chart") {
						if($scope.datasetFieldList[i].fieldJson.Type == "Category"){
							$scope.compareColumnFields.push($scope.datasetFieldList[i]["name"]);
						}
						if($scope.datasetFieldList[i]["name"] === $scope.selectedField.name){
							$scope.compareColumnFields.push($scope.datasetFieldList[i]["name"]);
						}
					} else {
						$scope.compareColumnFields.push($scope.datasetFieldList[i]["name"]);
					}
				}
				/*for (var i = 0; i < $scope.fieldContainer.length; i++) {
					if ($scope.fieldContainer[i]["Type"] === $scope.selectedField.fieldJson.Type && $scope.fieldContainer[i]["Type"] =="Series" ){
						for(var j = 0 ; j <  $scope.fieldContainer[i]["Fields"].length ; j++){
							$scope.compareColumnFields.push($scope.fieldContainer[i]["Fields"][j]["name"]);	
						}
					}else if($scope.fieldContainer[i]["Type"] =="YField" || $scope.fieldContainer[i]["Type"] =="XField"){
						for(var j = 0 ; j <  $scope.fieldContainer[i]["Fields"].length ; j++){
							$scope.compareColumnFields.push($scope.fieldContainer[i]["Fields"][j]["name"]);
							if($scope.fieldContainer[i]["Fields"][j]["fieldJson"]["OtherField"] !== "")
								$scope.compareColumnFields.push($scope.fieldContainer[i]["Fields"][j]["fieldJson"]["OtherField"]);
						}
					}
				}*/
				var result =[];
				for(var i = 0 ; i <$scope.compareColumnFields.length ; i++){
					if(result.indexOf($scope.compareColumnFields[i]) === -1){
						result.push($scope.compareColumnFields[i]);
					}
				}
				$scope.compareColumnFields = result;
				$scope.selectedIndicator.color = "#08aea8";
				$scope.selectedIndicator.icon = "bd-cross";
				$scope.selectedIndicatorModal = angular.copy($scope.selectedIndicator);
				$scope.showModelPopup("conditionalColorModel");
			} else {
				ServiceFactory.showNotification("Select a field", "alert-danger", 3000);
			}
		};

		/** @description edit category and conditional color indicator**/
		$scope.editChartIndicator = function (field) {
			$scope.indicatorWindowMode = "Update";
			$scope.selectedIndicatorModal = angular.copy(field);
			$scope.selectedIndicator = field;
			$scope.browseMapSVG = (field.showSvg == undefined)?$scope.browseMapSVG:field.showSvg;
			$scope.selectedIndicatorModal.opacity = (field.opacity==undefined) ? "1" :field.opacity;
			$scope.selectedIndicator.opacity = (field.opacity==undefined) ? "1" :field.opacity;
			if ($scope.selectedField.fieldJson.Type === "Series" || $scope.selectedField.fieldJson.Type === "YField" || $scope.selectedField.fieldJson.Type === "XField") {
				if (isNaN(field.compareTo) && (field.compareTo).indexOf("~") < 0){
				//if (IsBoolean(!field.flag) && (field.compareTo).indexOf("~") < 0){
					//$scope.fixedValueComparison = false;
					var fixvalcomp = false;
				}else{
					//$scope.fixedValueComparison = true;
					var fixvalcomp = true;
				}
				$scope.fixedValueComparison = (field.flag == undefined) ? fixvalcomp : field.flag;
				$scope.selectedIndicatorModal.flag = (field.flag == undefined) ? $scope.fixedValueComparison : field.flag;
				$scope.selectedIndicator.flag = (field.flag == undefined) ? $scope.fixedValueComparison : field.flag;
				$scope.updateOperatorList($scope.fixedValueComparison);
				$scope.compareColumnFields = [];
				for (var i = 0; i < $scope.datasetFieldList.length; i++) {
					if($scope.component.componentType == "decomposition_chart") {
						if($scope.datasetFieldList[i].fieldJson.Type == "Category"){
							$scope.compareColumnFields.push($scope.datasetFieldList[i]["name"]);
						}
						if($scope.datasetFieldList[i]["name"] === $scope.selectedIndicatorModal.seriesName){
							$scope.compareColumnFields.push($scope.datasetFieldList[i]["name"]);
						}
					} else {
						$scope.compareColumnFields.push($scope.datasetFieldList[i]["name"]);
					}
				}
				/*for (var i = 0; i < $scope.fieldContainer.length; i++) {
					if ($scope.fieldContainer[i]["Type"] === $scope.selectedField.fieldJson.Type && $scope.fieldContainer[i]["Type"] =="Series" ){
						for(var j = 0 ; j <  $scope.fieldContainer[i]["Fields"].length ; j++){
							$scope.compareColumnFields.push($scope.fieldContainer[i]["Fields"][j]["name"]);	
						}
					}else if($scope.fieldContainer[i]["Type"] =="YField" || $scope.fieldContainer[i]["Type"] =="XField"){
						for(var j = 0 ; j <  $scope.fieldContainer[i]["Fields"].length ; j++){
							$scope.compareColumnFields.push($scope.fieldContainer[i]["Fields"][j]["name"]);
							if($scope.fieldContainer[i]["Fields"][j]["fieldJson"]["OtherField"] !== ""){
								$scope.compareColumnFields.push($scope.fieldContainer[i]["Fields"][j]["fieldJson"]["OtherField"]);
							}
						}
					}
				}*/
				var result =[];
				for(var i = 0 ; i <$scope.compareColumnFields.length ; i++){
					if(result.indexOf($scope.compareColumnFields[i]) === -1)
						result.push($scope.compareColumnFields[i]);
				}
				$scope.compareColumnFields = result;
				$scope.showModelPopup("conditionalColorModel");
			}
		};
		/** @description update the category and conditional color indicator **/
		$scope.updateChartIndicator = function (field) {
			if ($scope.selectedField.fieldJson.Type === "Series" || $scope.selectedField.fieldJson.Type === "YField" || $scope.selectedField.fieldJson.Type === "XField") {
				$scope.selectedIndicator.seriesName = field.seriesName;
				$scope.selectedIndicator.operator = field.operator;
				$scope.selectedIndicator.compareTo = String(field.compareTo);
				$scope.selectedIndicator.comparedField = field.comparedField;
				$scope.selectedIndicator.color = field.color;
				$scope.selectedIndicator.icon = field.icon;
				$scope.selectedIndicator.opacity = field.opacity;
			}
		};
		/** @description add an item in conditional colors array **/
		$scope.updateConditionalColorList = function () {
			$scope.component[$scope.component.subElement].ConditionalColors.ConditionalColor.push($scope.selectedIndicatorModal);
            /** Synchronize absoluteLayout component object property with mobile and tablet view component object property **/
			if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
				var tabletViewComp = $scope.getComponentFromTabletLayout($scope.component.objectID);
				if (tabletViewComp) {
					tabletViewComp[tabletViewComp.subElement].ConditionalColors.ConditionalColor.push($scope.selectedIndicatorModal);
				}
				var mobileViewComp = $scope.getComponentFromMobileLayout($scope.component.objectID);
				if (mobileViewComp) {
					mobileViewComp[mobileViewComp.subElement].ConditionalColors.ConditionalColor.push($scope.selectedIndicatorModal);
				}
			}
		};
		/** @description delete an item from the array **/
		$scope.deleteConditionalIndicator = function (indicator) {
			var index = $scope.component[$scope.component.subElement].ConditionalColors.ConditionalColor.indexOf(indicator);
			$scope.component[$scope.component.subElement].ConditionalColors.ConditionalColor.splice(index, 1);
            /** Synchronize absoluteLayout component object property with mobile and tablet view component object property **/
			if (IsBoolean($scope.modal.userPreference.defaultSettings.syncComponentProperty) && $scope.modal.layoutType == "AbsoluteLayout") {
				var tabletViewComp = $scope.getComponentFromTabletLayout($scope.component.objectID);
				if (tabletViewComp) {
					tabletViewComp[tabletViewComp.subElement].ConditionalColors.ConditionalColor.splice(index, 1);
				}
				var mobileViewComp = $scope.getComponentFromMobileLayout($scope.component.objectID);
				if (mobileViewComp) {
					mobileViewComp[mobileViewComp.subElement].ConditionalColors.ConditionalColor.splice(index, 1);
				}
			}
		};
		/** @description get fresh object of conditional color **/
		$scope.getNewConditionalColorObject = function () {
			var newObject = "";
			return angular.copy($scope.modal.selectedDashboard.json.AbsoluteLayout_Object_Chart_ConditionalColors_ConditionalColor, newObject);
		};
		
		/** @description category color indicator methods **/
		$scope.updateDefaultCategoryColorIndicator = function (color) {
			if (IsBoolean($scope.component[$scope.component.subElement].CategoryColors.showColorsFromCategoryName)) {
				$scope.component[$scope.component.subElement].CategoryColors.categoryDefaultColor = color;
				$scope.component[$scope.component.subElement].CategoryColors.categoryDefaultColorSet =color;
			}
		};
		$scope.createNewCategoryColorIndicator = function () {
			if ($scope.selectedField.fieldJson !== "" && $scope.selectedField.fieldJson !== undefined) {
				$scope.component[$scope.component.subElement].CategoryColors.showColorsFromCategoryName = "true";
				$scope.component[$scope.component.subElement].CategoryColors.categoryDefaultColor = $scope.selectedField.fieldJson.Color;
				$scope.component[$scope.component.subElement].CategoryColors.categoryDefaultColorSet = $scope.selectedField.fieldJson.Color;
				$scope.selectedIndicator = $scope.getNewCategoryColorObject();
				$scope.selectedIndicator.seriesName = "";
				$scope.selectedIndicator.color = "#08aea8";
				$scope.updateCategoryColorList();
			} else {
				ServiceFactory.showNotification("Select a field", "alert-danger", 3000);
			}
		};
		$scope.createNewSubCategoryColorIndicator = function () {
			if ($scope.selectedField.fieldJson !== "" && $scope.selectedField.fieldJson !== undefined) {
				$scope.component[$scope.component.subElement].SubCategoryColors.showColorsFromSubCategoryName = "true";
				$scope.component[$scope.component.subElement].SubCategoryColors.subCategoryDefaultColor = $scope.selectedField.fieldJson.Color;
				$scope.component[$scope.component.subElement].SubCategoryColors.subCategoryDefaultColorSet = $scope.selectedField.fieldJson.Color;
				$scope.selectedIndicator = $scope.getNewSubCategoryColorObject();
				$scope.selectedIndicator.seriesName = "";
				$scope.selectedIndicator.color = "#08aea8";
				$scope.updateSubCategoryColorList();
			} else {
				ServiceFactory.showNotification("Select a field", "alert-danger", 3000);
			}
		};
		$scope.updateCategoryColorList = function () {
			$scope.component[$scope.component.subElement].CategoryColors.CategoryColor.push($scope.selectedIndicator);
		};		
		$scope.updateSubCategoryColorList = function () {
			$scope.component[$scope.component.subElement].SubCategoryColors.subCategoryColor.push($scope.selectedIndicator);
		};
		$scope.deleteCategoryIndicator = function (indicator) {
			var index = $scope.component[$scope.component.subElement].CategoryColors.CategoryColor.indexOf(indicator);
			$scope.component[$scope.component.subElement].CategoryColors.CategoryColor.splice(index, 1);
		};		
		$scope.deleteSubCategoryIndicator = function (indicator) {
			var index = $scope.component[$scope.component.subElement].SubCategoryColors.subCategoryColor.indexOf(indicator);
			$scope.component[$scope.component.subElement].SubCategoryColors.subCategoryColor.splice(index, 1);
		};		
		$scope.getNewCategoryColorObject = function () {
			var newObject = "";
			return angular.copy($scope.modal.selectedDashboard.json.AbsoluteLayout_Object_Chart_CategoryColors_CategoryColor, newObject);
		};
		$scope.getNewSubCategoryColorObject = function () {
			var newObject = "";
			return angular.copy($scope.modal.selectedDashboard.json.AbsoluteLayout_Object_Chart_SubCategoryColors_subCategoryColor, newObject);
		};
		
		/** @description filter method to check whether a field is available in list or not  **/
		$scope.isFieldInList = function (field) {
			if ($scope.modal.FieldsSearchkey === undefined) {
				return true;
			}
			return (field.name.toLowerCase()).indexOf($scope.modal.FieldsSearchkey.toLowerCase()) > -1;
		};
		/** @description check whether a property should be visible for container or not **/
		$scope.checkPropVisibilityForContainer = function( field, prop ) {
			for(var i=0; i<prop.propertyFor.length ; i++){
				if(prop.propertyFor[i] === field.fieldJson.Type){
					return true;
				}
			}
			return false;
		};
		
		/** @description when mouse over on the field name, make it selected for drag **/
		$scope.setDraggedField = function( e, field ) {
			e = e || window.event;
			var btnPressed = e.buttons,
			MOUSE_BUTTON = {
				LEFT : 1,
				CENTER : 2,
				RIGHT : 3
			};
			if (btnPressed === MOUSE_BUTTON.LEFT ||
				btnPressed === MOUSE_BUTTON.RIGHT ||
				btnPressed === MOUSE_BUTTON.CENTER) {
				return false;
			} else {
				$scope.draggedField = field;
				return true;
			}
		};
	};

	/** @description Controller definition **/
	angular.module(designerModules.module.DesignerPropertyManager)
	.controller("DatasetController", ["$scope", "$timeout", "ServiceFactory", datasetControllerFn]);

})();
//# sourceURL=DatasetController.js
