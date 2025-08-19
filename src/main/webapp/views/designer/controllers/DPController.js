/**
 * Copyright � 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: DPController.js
 * @description DPController is the parent controller of CSV/EXCEL/WEBSERVICE/MERGED connector 
 * **/
(function () {
	/** Controller function for DataSoure Connectors
	 * @param  {Object} $scope        	The scope object
	 * @param  {Object} timeout 		The Timeout
	 * @param  {Object} ServiceFactory 	The ServiceFactory
	 * @return {undefined}              undefined
	 */
	var DPControllerFn = function ($scope, $timeout, ServiceFactory) {
		$scope.sheetsMap = {};
		$scope.modal.connectorConfig.connectors = null;
		$scope.activeNodeId = "";
		$scope.displayOptions = false;
		$scope.selectedDataSource = {
			"web": "",
			"pa": "",
			"ds": "",
			"datasheet": ""
		};
		$scope.selectedQuery = {
			"web": "",
			"pa": "",
			"ds": "",
			"datasheet": ""
		};
		$scope.entitySetsJson = {};
		$scope.selectedConnection = "";
		ServiceFactory.getJsonFileData("./resources/data/connectors.data", function (dJson) {
			/** Hide the predictive connector for lite user **/
			if (IsBoolean(ServiceFactory.AUTH_INFO.get("lite")) && dJson) {
				for (var i = 0; i < dJson.length; i++) {
					if (dJson[i].type == "pa") {
						dJson[i].enabled = false;
					}
				}
			}

			$scope.modal.connectorConfig.connectors = dJson;
		});

		/**
		 * One time initialization when DataConnectionMainPage loads
		 * @return {undefined} undefined
		 */
		$scope.initDataManager = function () {
			$scope.dmUiActive = {
				conn: {
					isUiActive: false
				}
			};
		};

		/**
		 * One time initialization when DataConnectionMainPage loads
		 * @return {undefined} undefined
		 */
		$scope.removeHighlighterFromAllConnection = function () {
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL.map(function (dUrl) {
				dUrl.isUiActive = false;
			});
		};

		/**
		 * Notify select all fields
		 * @return {undefined} undefined
		 */
		$scope.onFieldSelectAll = function () {
			angular.forEach($scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet, function (field) {
				field.added = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.selectedAllAvailable;
				$scope.onFieldCheckBoxClick(field);
			});
			$scope.createWhereClause();
		};

		/**
		 * Click handler when click on condition checkbox
		 * @param  {Object} conditionField    The condition object
		 * @param  {Boolean} createWhereClause Flag to know where clause will be created or not
		 * @return {undefined}                   undefined
		 */
		$scope.onConditionCheckBoxClick = function (conditionField, createWhereClause) {
			if (IsBoolean(conditionField.added)) {
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.allConditionSelected = false;
			}
			/** STATEMENT to block creating whereclause on select all **/
			if (IsBoolean(createWhereClause) || createWhereClause == undefined) {
				$scope.createWhereClause();
			}
		};

		/**
		 * Creates a where clause
		 * @return {undefined} undefined
		 */
		$scope.createWhereClause = function () {
			var clauses = [];
			var clausesMap = {};
			angular.forEach($scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet, function (conditionField) {
				if (IsBoolean(conditionField.added)) {
					clauses.push(conditionField.name + "=" + conditionField.condition);
					clausesMap[conditionField.name] = conditionField.condition;
				} else {
					delete clausesMap[conditionField.name];
				}
			});
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.WhereClause.Con = {};
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.WhereClause.Con.Clause = clauses.toString();
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.WhereClause.Con.ClauseMap = clausesMap;
		};

		/**
		 * Called when all condition selected
		 * @return {undefined} undefined
		 */
		$scope.onConditionSelectAll = function () {
			angular.forEach($scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet, function (conditionField) {
				conditionField.added = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.allConditionSelected;
				$scope.onConditionCheckBoxClick(conditionField);
			});
		};

		/**
		 * Click handler when cliked on field check box
		 * @param  {Object} field The field object
		 * @return {undefined}       undefined
		 */
		$scope.onFieldCheckBoxClick = function (field) {
			if (field.added) {
				DesignerUtil.prototype.pushToArrayWithoutDuplicate($scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection["FieldSet"], "name", field);
				if ($scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection["FieldSet"].length == $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet.length) {
					$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.selectedAllAvailable = true;
				}
			} else {
				DesignerUtil.prototype.deleteFromArray($scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection["FieldSet"], field);
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.selectedAllAvailable = false;
				$scope.modal.removeFieldFromDataSet(field.name, field.dataSource);
			}
		};

		/**
		 * [changeToDefaultSelect_OnLoadScript description]
		 * @return {undefined} undefined
		 */
		$scope.changeToDefaultSelect_OnLoadScript = function () {
			$timeout(function () {
				$(".sel_InternalFunctionScrptOnLoad").prop("selectedIndex", -1);
			}, 500);
		};

		/**
		 * Context menu option selection handler
		 * @param  {Object} _object selected option
		 * @return {undefined}         undefined
		 */
		$scope.handleCxtMenuOpnSelection = function (_object) {
			var
				_selectedOpn = _object.item.label,
				_parentNodeId = $scope.activeNodeId,
				_connector = DesignerUtil.prototype.findInArray($scope.modal.connectorConfig.connectors, "id", _parentNodeId),
				_dataURL = null;
			switch (_selectedOpn) {
				case "Add-Connection":
					$scope.addNewConnection(_connector);
					break;
				case "Delete":
					_dataURL = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL, "id", _parentNodeId);
					$scope.deleteConnection(_dataURL);
					break;
				default:
					break;
			}
		};

		/**
		 * Called on selection of node
		 * @param  {Object} _event The event object
		 * @param  {Object} _data  The data
		 * @return {undefined}        undefined
		 */
		$scope.onNodeSelect = function (_event, _data) {
			var
				_node = _data.node,
				_nId = _node.id;
			//			var _nParentId = _node.parent;
			//			var _nText = _node.text;
			$scope.activeNodeId = _nId;
			switch (_nId) {
				case "csv_connection":
				case "excel_connection":
				case "webservice_connection":
					$scope.connectorCxtMenu = {
						"Add-Connection": {
							"label": "Add-Connection",
							"action": function (_object) {
								$scope.handleCxtMenuOpnSelection(_object);
							}
						}
					};
					break;
				default:
					$scope.connectorCxtMenu = {
						"Delete": {
							"label": "Delete",
							"action": function (_object) {
								$scope.handleCxtMenuOpnSelection(_object);
							}
						}
					};
					break;
			}
			if (_nId != "csv_connection" && _nId != "excel_connection" && _nId != "webservice_connection") {
				$scope.setConnectionSelected(DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL, "id", _nId));
			}
		};
		/**
		 * @function
		 * @description It'll verify for not empty connection name
		 * @param { object } sConn - The selected connection object
		 * */
		$scope.validateConnection = function (sConn) {
			if (sConn && !sConn.connectionName.trim()) {
				ServiceFactory.showNotification("Connection name can not be empty", "alert-warning", 3000);
				sConn.connectionName = "Connection-" + sConn.id.split("_")[1];
			}
		};

		/**
		 * Updates connection tree
		 * @param  {Object} _selectedConnection selected connection
		 * @return {undefined}                     undefined
		 */
		$scope.updateConnectionTree = function (_selectedConnection) {
			var
				_allConnections = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL,
				_connection = DesignerUtil.prototype.findInArray(_allConnections, "id", _selectedConnection.id);
			_connection.text = _selectedConnection.connectionName;
			$scope.modal.notifyConnectionListChange();
		};

		/**
		 * Sets the connection as selected
		 * @param {Object} dataURL The data url object
		 */
		$scope.setConnectionSelected = function (dataURL) {

			$scope.clearObjectSearchKey();
			$scope.changeToDefaultSelect_OnLoadScript();
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection = dataURL;
			var conId = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.id;
			var DashId = $scope.modal.selectedDashboard.id;
			if ($scope.sheetsMap[DashId + "" + conId] == undefined) {
				$scope.sheets = [];
				$scope.sheets[$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.sheet] = [];
				$scope.sheetsMap[DashId + "" + conId] = $scope.sheets;
			}
			$scope.$broadcast('connectionSelected', dataURL);
			$scope.modal.updateDashboardStatus(1);
		};

		/**
		 * For setting active connection on UI
		 * @param {Object} e    The event object
		 * @param {Object} dUrl url
		 * @returns {undefined} undefined
		 */
		$scope.setSelectedConnList = function (e, dUrl) {
			var displayActive = function (dUrl) {
				$scope.dmUiActive.conn.isUiActive = false;
				$scope.removeHighlighterFromAllConnection();
				dUrl.isUiActive = true;
				$scope.dmUiActive.conn = dUrl;
			};
			if (e) {
				e.stopImmediatePropagation();
				displayActive(dUrl);
			}
		};

		/**
		 * Adds new connection
		 * @param {Object} connectorData The connector data
		 * @returns {undefined} undefined
		 */
		$scope.displayConnectorInfo = function (connectorData) {
			if ($scope.modal.selectedDashboard != "") {
				$("#connectorInfoDialog").modal("show");
			} else {
				ServiceFactory.showNotification("No dashboard present", "alert-warning", 3000);
			}
		};
		/**
		 * Adds new connection
		 * @param {Object} connectorData The connector data
		 * @returns {undefined} undefined
		 */
		$scope.addNewConnection = function (connectorData) {
			var _newConnectionNode = {};
			connectorData.state = {
				opened: true,
				disabled: false,
				selected: true
			};
			if ($scope.modal.selectedDashboard != "") {
				$scope.selectedConnection = $scope.getNewDataURLObject();
				$scope.setDefaultPropertiesToConnection(connectorData);
				if ($scope.selectedConnection.typeSpecifier == connectorData.name) {
					_newConnectionNode.id = $scope.selectedConnection.id;
					_newConnectionNode.text = $scope.selectedConnection.connectionName;
					_newConnectionNode.parent = connectorData.id;
				}
				$scope.pushToDataURLArray($scope.selectedConnection);
				$scope.setConnectionSelected($scope.selectedConnection);
				$scope.removeHighlighterFromAllConnection();
				$scope.selectedConnection.isUiActive = true;
				$scope.modal.notifyConnectionListChange();
				ServiceFactory.showNotification($scope.selectedConnection.connectionName + " has been created", "alert-info", 3000);
			} else {
				ServiceFactory.showNotification("No dashboard present", "alert-warning", 3000);
			}
		};

		/**
		 * Sets connection's default properties
		 * @param {Object} connectorData connection object
		 * @returns {undefined} undefined
		 */
		$scope.setDefaultPropertiesToConnection = function (connectorData) {
			var uniqueId = $scope.modal.getUniqueConnectionID("C");
			$scope.selectedConnection.id = uniqueId;
			$scope.selectedConnection.connectionName = "Connection-" + uniqueId.slice(2);
			$scope.selectedConnection.typeSpecifier = connectorData.name;
			$scope.selectedConnection.Type = connectorData.type;
			$scope.selectedConnection.variable = $scope.getNewVariableJson({});
			$scope.selectedConnection.variable.Key = $scope.selectedConnection.id;
			$scope.selectedConnection.calculatedFieldList = [];
		};

		/**
		 * Deletes a connection
		 * @param  {Object} dataURL data url
		 * @return {undefined}         undefined
		 */
		$scope.deleteConnection = function (dataURL) {
			var _connectionId = dataURL.id,
				array = $scope.getDataURLArray(),
				index = array.indexOf(dataURL);
			$scope.deleteConnectionReferences(_connectionId);
			/** remove all datasets from components **/
			$scope.modal.removeDataSetFromComponentObjects(_connectionId);
			$scope.modal.removeDatafromOfflineData(_connectionId);
			$scope.modal.removeDatasetExpressions(_connectionId);
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection = array;
			array.splice(index, 1);
			$scope.modal.notifyConnectionListChange();
			ServiceFactory.showNotification(dataURL.connectionName + " has been deleted", "alert-info", 3000);
		};

		/**
		 * Handle csv/excel data is keep on adding in offline data with same connection id. 
		 * when browsing  diff csv/excel evrytime in same connection
		 * @param {object} datas The data object
		 */
		$scope.addDataToOffLineData = function (datas) {
			var offLineData = $scope.modal.selectedDashboard.json.Dashboard.OffLineData.Data;
			if (offLineData.length > 0) {
				var flagData = true;
				for (var i = 0; i < offLineData.length; i++) {
					if (offLineData[i].id == datas.id) {
						$scope.modal.selectedDashboard.json.Dashboard.OffLineData.Data.splice(i, 1, datas);
						flagData = false;
						break;
					}
				}
				if (flagData)
					$scope.modal.selectedDashboard.json.Dashboard.OffLineData.Data.push(datas);
			} else {
				$scope.modal.selectedDashboard.json.Dashboard.OffLineData.Data.push(datas);
			}
		};

		/**
		 * Gets data url object from a prototype
		 * @return {undefined} undefined
		 */
		$scope.getNewDataURLObject = function () {
			var newObject = "";
			return angular.copy($scope.modal.selectedDashboard.json.DataProviders_DataURL, newObject);
		};

		/**
		 * Gets data url from the main JSON
		 * @param  {String} id connection id
		 * @return {object}    data url
		 */
		$scope.getDataURLFromMainJSON = function (id) {
			var temp = $.grep($scope.getDataURLArray(), function (element, index) {
				return element["id"] == id;
			});
			return temp[0];
		};

		/**
		 * Gets array of data urls
		 * @return {Array} array of data urls
		 */
		$scope.getDataURLArray = function () {
			if ($scope.modal.selectedDashboard.json != undefined)
				return $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL;
			else
				return [];
		};

		/**
		 * Adds a connection to the DataURLArray
		 * @param  {Object} durlObject item to be pushed
		 * @return {undefined}            undefined
		 */
		$scope.pushToDataURLArray = function (durlObject) {
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL.push(durlObject);
		};

		/**
		 * [deleteConnectionReferences description]
		 * @param  {[type]} id [description]
		 * @return {[type]}    [description]
		 */
		$scope.deleteConnectionReferences = function (id) { };

		/**
		 * [toggleNode description]
		 * @param  {[type]} _nodeObject [description]
		 * @return {[type]}             [description]
		 */
		$scope.toggleNode = function (_nodeObject) { };

		/**
		 * Calculated Field creation methods
		 * @return {undefined} undefined
		 */
		$scope.createNewCalculatedField = function () {
			$scope.calcFieldMode = "Create";
			var calcFieldName = $scope.getCalcFieldName($scope.modal.selectedDashboard.json.Dashboard.DatasetExpressions.DatasetExpression, "CalcField");
			$scope.modal.calcFieldConfig = {
				selectedDataSetExpressionName: calcFieldName,
				selectedDataSetExpressionRename: calcFieldName,
				selectedDataSetExpressionId: calcFieldName,
				selectedDataSetExpressionScript: "",
				selectedDataSetExpressionVariables: {
					variable: []
				},
				alreadyExist: false,
				alreadyExistWarning: ""
			};
			$scope.showModelPopup("calculatedFieldModel");
		};

		/**
		 * Updates calculated field list
		 * @return {undefined} undefined
		 */
		$scope.updateCalculatedFieldList = function (renamedText) {
			var result = $scope.isCalcFieldExists($scope.modal.calcFieldConfig.selectedDataSetExpressionId, $scope.modal.calcFieldConfig.selectedDataSetExpressionName);
			if (IsBoolean(result[0])) {
				/*Updating Existing Calculation Field*/
				$scope.modal.selectedDashboard.json.Dashboard.DatasetExpressions.DatasetExpression[result[1]].name = $scope.modal.calcFieldConfig.selectedDataSetExpressionName;
				$scope.modal.selectedDashboard.json.Dashboard.DatasetExpressions.DatasetExpression[result[1]].expressionScript.cdata = $scope.modal.calcFieldConfig.selectedDataSetExpressionScript;
				$scope.modal.selectedDashboard.json.Dashboard.DatasetExpressions.DatasetExpression[result[1]].variables = $scope.modal.calcFieldConfig.selectedDataSetExpressionVariables;
				var index = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.calculatedFieldList.indexOf($scope.selectedField);
				var associatedDatasets = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object;
				console.log("associatedDatasets",associatedDatasets);
				for (var i = 0; i < associatedDatasets.length; i++) {
					var componentName = associatedDatasets[i].subElement;
					if (associatedDatasets[i][componentName]["DataSet"] != undefined) {
						for (var j = 0; j < associatedDatasets[i][componentName]["DataSet"].Fields.length; j++) {
							if (associatedDatasets[i][componentName]["DataSet"].Fields[j].Name == $scope.selectedField.name) {
								associatedDatasets[i][componentName]["DataSet"].Fields[j].Name = renamedText;
								associatedDatasets[i][componentName]["DataSet"].Fields[j].DisplayName = renamedText;
								associatedDatasets[i][componentName]["DataSet"].Fields[j].expressionID = renamedText;
								associatedDatasets[i][componentName]["DataSet"].Fields[j].fieldname = renamedText;
								associatedDatasets[i][componentName]["DataSet"].Fields[j].displayname = renamedText;
							}
						}
					}/*else{
							    $scope.modal.selectedDashboard.json.Dashboard.DatasetExpressions.DatasetExpression[result[1]].name = renamedText;
								$scope.modal.selectedDashboard.json.Dashboard.DatasetExpressions.DatasetExpression[result[1]].expressionScript.cdata = $scope.modal.calcFieldConfig.selectedDataSetExpressionScript;
								$scope.modal.selectedDashboard.json.Dashboard.DatasetExpressions.DatasetExpression[result[1]].variables = $scope.modal.calcFieldConfig.selectedDataSetExpressionVariables;
						   }*/
				}
				$scope.selectedField.name = renamedText;
				$scope.selectedField.id = renamedText;
				$scope.modal.selectedDashboard.json.Dashboard.DatasetExpressions.DatasetExpression[result[1]].name = renamedText;
				$scope.modal.selectedDashboard.json.Dashboard.DatasetExpressions.DatasetExpression[result[1]].id = renamedText;
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.calculatedFieldList[index].name = renamedText;
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.calculatedFieldList[index].id = renamedText;
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.calculatedFieldList[index].expressionScript.cdata = $scope.modal.calcFieldConfig.selectedDataSetExpressionScript;
			} else {
				/*Creating new Calculation Field*/
				var DatasetExpression = $scope.getNewDatasetExpressionObject();
				DatasetExpression.id = renamedText;
				DatasetExpression.dataSource = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.id;
				DatasetExpression.name = renamedText;
				DatasetExpression.expressionScript.cdata = $scope.modal.calcFieldConfig.selectedDataSetExpressionScript;
				DatasetExpression.variables = $scope.modal.calcFieldConfig.selectedDataSetExpressionVariables;
				$scope.modal.selectedDashboard.json.Dashboard.DatasetExpressions.DatasetExpression.push(DatasetExpression);
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.calculatedFieldList.push(DatasetExpression);
			}
		};
		$scope.checkExist = function (keyEvent, text) {
			var checkDuplicate = $scope.isCalcFieldExistDataSet(text, text);
			if (IsBoolean(checkDuplicate[0]) || text == "") {
				$scope.modal.calcFieldConfig.alreadyExist = true;
				$scope.modal.calcFieldConfig.alreadyExistWarning = (text === "") ? "Name cannot be empty" : "'" + text + "' already exists";
			} else {
				$scope.modal.calcFieldConfig.alreadyExist = false;
				$scope.modal.calcFieldConfig.alreadyExistWarning = "";
			}
		};

		/**
		 * Edits calculated fields
		 * @param  {Object} field The field to be edited
		 * @return {undefined}       undefined
		 */
		$scope.editCalculatedField = function (field) {
			$scope.calcFieldMode = "Update";
			$scope.modal.calcFieldConfig = $scope.modal.calcFieldConfig || {};
			$scope.modal.calcFieldConfig = {
				selectedDataSetExpressionName: $scope.modal.replaceCFSpecialCharWithUnderscore(field.name),
				selectedDataSetExpressionRename: $scope.modal.replaceCFSpecialCharWithUnderscore(field.name),
				selectedDataSetExpressionId: field.id,
				selectedDataSetExpressionScript: field.expressionScript.cdata,
				selectedDataSetExpressionVariables: field.variables,
				alreadyExist: false,
				alreadyExistWarning: ""
			};
			$scope.selectedField = field;
			/** Old dashboards are not showing updated scripted of calcField when opened in edit mode **/
			var dsexp = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.calculatedFieldList;
			for (var i = 0; i < dsexp.length; i++) {
				if (dsexp[i].id == field.id) {
					$scope.modal.calcFieldConfig.selectedDataSetExpressionScript = dsexp[i].expressionScript.cdata;
				}
			}
			$scope.showModelPopup("calculatedFieldModel");
		};

		/**
		 * Deletes calculated field
		 * @param  {Object} field Field to be deleted
		 * @return {undefined}       undefined
		 */
		$scope.deleteCalculatedField = function (field) {
			var index = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.calculatedFieldList.indexOf(field);
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.calculatedFieldList.splice(index, 1);

			//var index = $scope.modal.selectedDashboard.json.Dashboard.DatasetExpressions.DatasetExpression.indexOf(field);
			//$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.calculatedFieldList.splice(index, 1);

			$scope.modal.removeFieldFromDataSet(field.name, field.dataSource);
		};

		/**
		 * Gets a dataset expression object
		 * @return {Object} dataset expression object
		 */
		$scope.getNewDatasetExpressionObject = function () {
			var newObject = "";
			return angular.copy($scope.modal.selectedDashboard.json.DatasetExpressions_DatasetExpression, newObject);
		};

		/**
		 * Gets field name of calculated field
		 * @param  {Array} arr       
		 * @param  {String} shortName shortName
		 * @return {String}           name of the field
		 */
		$scope.getCalcFieldName = function (arr, shortName) {
			var proposedNewName = shortName + (arr.length * 1 + 1);
			var flag = $scope.modal.checkIDUsed(arr, "name", proposedNewName);
			while (flag) {
				proposedNewName = shortName + "_" + randomChar(2);
				flag = $scope.modal.checkIDUsed(arr, "name", proposedNewName);
			}
			return proposedNewName;
		};

		$scope.isCalcFieldExistDataSet = function (id, name) {
			var cf = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.calculatedFieldList;
			var af = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet
			var dse = [];
			for (var i1 = 0; i1 < af.length; i1++) {
				dse.push(af[i1]);
			}
			for (var i2 = 0; i2 < cf.length; i2++) {
				dse.push(cf[i2]);
			}

			for (var i = 0; i < dse.length; i++) {
				if (dse[i].name == name)
					return [true, i];
			}
			return [false, ""];
		};
		/**
		 * Checks for the existance of a calculated field
		 * @param  {String}  id   field id
		 * @param  {String}  name field name
		 * @return {Array}      an array haveing two element [{Boolean} isExist, {Number} index]
		 */
		$scope.isCalcFieldExists = function (id, name) {
			var dse = $scope.modal.selectedDashboard.json.Dashboard.DatasetExpressions.DatasetExpression;
			var selcalc = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.calculatedFieldList;
			for (var i = 0; i < dse.length; i++) {
				for (var j = 0; j < selcalc.length; j++) {
					if (dse[i].id == id && dse[i].dataSource == selcalc[j].dataSource)
						return [true, i];
				}
			}
			return [false, ""];
		};
		$scope.getNewDatasetExpressionVariablesObject = function () {
			var newObject = "";
			return angular.copy($scope.modal.selectedDashboard.json.DatasetExpressions_DatasetExpression_variables_variable, newObject);
		};
		$scope.addNewCalculatedFieldVariable = function () {
			var variable = $scope.getNewDatasetExpressionVariablesObject();
			variable.name = $scope.getCalcFieldName($scope.modal.calcFieldConfig.selectedDataSetExpressionVariables.variable, "x");
			variable.value = "0";
			$scope.modal.calcFieldConfig.selectedDataSetExpressionVariables.variable.push(variable);
		};
		$scope.deleteCalculatedFieldVariable = function (variable) {
			var index = $scope.modal.calcFieldConfig.selectedDataSetExpressionVariables.variable.indexOf(variable);
			$scope.modal.calcFieldConfig.selectedDataSetExpressionVariables.variable.splice(index, 1);
		};
		$scope.deleteAllCalculatedFieldVariable = function () {
			$scope.modal.calcFieldConfig.selectedDataSetExpressionVariables.variable = [];
		};
		$scope.delCalculatedField = function (calcFieldToRemove, event) {
			$scope.calcFieldToRemove = calcFieldToRemove;
			$scope.showModelPopup("deleteCalcFieldConfirmation");
		};
		$scope.handleCalcFieldDeleteAlertConfirmation = function (_event, _handler) {
			if (_handler == "DEL-CAlCFIELD") {
				$scope.deleteCalculatedField($scope.calcFieldToRemove);
			}
		};

		/** Condition update whenever text in the textBox is updated
		 * @param {Object} conditionField particular object of that row
		 * **/
		$scope.onConditionTextBoxUpdate = function (conditionField) {
			if (conditionField.condition === "") {
				conditionField.added = false;
			}
			$scope.createWhereClause(conditionField);
			$scope.displayOptions = false;
		};
		$scope.updateSelectedValue = function (e, item, conditionField) {
			conditionField.condition = item.actualTag;
			$scope.onConditionTextBoxUpdate(conditionField);
		};
		$scope.getCompName = function (item) {
			var refID = item.displayTag.split(".")[0];
			// Added 'objectName' and 'referenceID' in item obj to support search based on objectName & referenceID;
			item["objectName"] = "";
			item["referenceID"] = "";
			var comp = $scope.getComponentbyReferenceId(refID);
			if (comp) {
				item["objectName"] = comp.objectName;
				item["referenceID"] = comp.referenceID;
				return comp.objectName;
			} else {
				return "";
			}
		};
		$scope.toggleGlobalVarOptions = function (e, row, index) {
			var $curTag = $(e.target);
			$scope.setSelectedItem = row.name + index;
			if ($curTag.hasClass("bvz-display-placeholder") ||
				$curTag.hasClass("bvz-display") || $curTag.hasClass("condition-gv-picker")) {
				if ($scope.displayOptions) {
					$scope.displayOptions = false;
					$scope.defValQuery = "";
				} else {
					$scope.displayOptions = true;
					setTimeout(function () {
						$(".bvz-search").focus();
					});
				}
			} else if ($curTag.hasClass("bvz-search")) {
				// Do nothing
			} else {
				$scope.displayOptions = false;
				$scope.defValQuery = "";
			}
		};
	};

	/** Controller function for CSV Connection
	 * @param  {Object} $scope        	The scope object
	 * @param  {Object} timeout 		The Timeout
	 * @param  {Object} ServiceFactory 	The ServiceFactory
	 * @return {undefined}              undefined
	 */
	var CSVControllerFn = function ($scope, $timeout, ServiceFactory) {
		$scope.getFileContent = function (fileInfo) {
			var isCSV = (fileInfo.fileName.substring(fileInfo.fileName.length - 4, fileInfo.fileName.length)).toLowerCase() == ".csv" ? true : false;
			if (isCSV) {
				if (fileInfo.fileData != "") {
					var dataArray = $scope.convertCSVToArray(fileInfo.fileData);
					// check the changed file is same file or new file, and then call method for update chart dataset or refresh dataset accordingly.(@lakhan)
					var previousFileName = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.url;
					var isQueryChange = fileInfo.fileName == previousFileName;
					$scope.updateDashboardJson(fileInfo, dataArray, isQueryChange);
					if (isQueryChange) {
						var fields = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet;
						var calcFields = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.calculatedFieldList;
						$scope.modal.removeChangedFieldFromAvailableDataSet(fields, calcFields);
					} else {
						$scope.modal.refreshDataUrlAvailableDataSet();
					}
				} else {
					ServiceFactory.showNotification("This CSV file does not have data", "alert-warning", 3000);
				}
			} else {
				ServiceFactory.showNotification("File type is not supported", "alert-danger", 3000);
			}
			var inputfile = $("#" + $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.id);
			inputfile[0].value = "";
		};

		$scope.$on("connectionSelected", function (evt, args) {
			$scope.selectionChangeToCsv(args.typeSpecifier);
		});
		$scope.onInitCsv = function () {
			/** Do nothing **/
		};
		$scope.selectionChangeToCsv = function (typeSpecifier) {
			if (typeSpecifier == "csv") {
				pasteElementChange("txt_UserScript_csv");
			}
		};
		$scope.convertCSVToArray = function (strData) {
			var strDelimiter = ",";
			var objPattern = new RegExp(
				("(\\"
					+ strDelimiter
					+ "|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\"\\"
					+ strDelimiter + "\\r\\n]*))"),
				"gi");

			var arrData = [[]];
			var arrMatches = null;
			while (arrMatches = objPattern.exec(strData)) {
				var strMatchedDelimiter = arrMatches[1];
				if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
					arrData.push([]);
				}
				var strMatchedValue;
				if (arrMatches[2]) {
					strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
				} else {
					strMatchedValue = arrMatches[3];
				}
				arrData[arrData.length - 1].push(strMatchedValue);
			}
			return arrData;
		};
		/*$scope.convertArrayToJson = function (arrData) {
			var jsonDataArray = [];
			for (var i = 1; i < arrData.length; i++) {
				jsonData = {};
				for (var j = 0; j < arrData[i].length; j++) {
					jsonData[arrData[0][j]] = arrData[i][j];
				}
				jsonDataArray.push(jsonData);
			}
			return jsonDataArray;
		};*/
		$scope.dataFields = function (arrData) {
			var data = [];
			for (var i = 0; i < arrData.length; i++) {
				var value = arrData[i];
				arrData[i] = ("" + value);
				//arrData[i] = ("" + value).replace(/\s+/g, "");
				if (arrData[i] == undefined || arrData[i] == "undefined" || arrData[i] === "") {
					data.push("_blank" + (i + 1));
				} else {
					data.push(arrData[i]);
				}
			}
			return data;
		};
		$scope.getNewFieldJSON = function () {
			var newJSON = "";
			return angular.copy($scope.modal.selectedDashboard.json.DataProviders_DataURL_FieldSet, newJSON);
		};
		$scope.getNewOfflineDataJSON = function () {
			var newJSON = "";
			return angular.copy($scope.modal.selectedDashboard.json.OffLineData_Data, newJSON);
		};
		$scope.updateDashboardJson = function (fileInfo, dataArray, isQueryChange) {
			/*var datacontent = $scope.convertArrayToJson(dataArray);*/
			var csvDataFields = $scope.dataFields(dataArray[0]);
			dataArray[0] = csvDataFields;
			var datacontent = dataArray;
			var datas = $scope.getNewOfflineDataJSON();
			datas.id = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.id;
			datas.Records.Record = datacontent;
			$scope.addDataToOffLineData(datas);
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.url = fileInfo.fileName;
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.offLineDataID = $scope.modal.selectedDashboard.json.Dashboard.OffLineData.Data.id;
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet = [];
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet = [];
			if (!isQueryChange) {
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet = [];
			}
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.dataType = "Array";
			$scope.fillAvailableFieldSet(angular.copy(csvDataFields));
			$scope.fillAvailableConditionSet(angular.copy(csvDataFields));
		};
		$scope.fillAvailableFieldSet = function (data) {
			var dataArray = [];
			if (typeof data !== "object")
				dataArray.push(data);
			else
				dataArray = data;

			dataArray.sort(function (x, y) {
				var a = String(x).toUpperCase();
				var b = String(y).toUpperCase();
				return a > b ? 1 : (a < b ? -1 : 0);
			});
			for (var i = 0; i < dataArray.length; i++) {
				var field = $scope.getNewFieldJSON();
				field.name = dataArray[i];
				field.added = true;
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet.push(field);
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet.push(field);
			}
		};
		$scope.fillAvailableConditionSet = function (data) {
			var dataArray = [];
			if (typeof data !== "object")
				dataArray.push(data);
			else
				dataArray = data;

			dataArray.sort(function (x, y) {
				var a = String(x).toUpperCase();
				var b = String(y).toUpperCase();
				return a > b ? 1 : (a < b ? -1 : 0);
			});
			var conditionListArray = dataArray;
			var tempArray = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet;

			/** if condition_fields_name is still available in Query, then keep same in the JSON **/
			var prevConditionListArray = [];
			for (var i1 = 0; i1 < conditionListArray.length; i1++) {
				for (var j1 = 0; j1 < tempArray.length; j1++) {
					if (tempArray[j1].name.toLowerCase() == conditionListArray[i1].toLowerCase()) {
						prevConditionListArray.push(tempArray[j1]);
						break;
					}
				}
			}
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet = angular.copy(prevConditionListArray);

			for (var i = 0; i < conditionListArray.length; i++) {
				var isNewCondition = true;
				for (var j = 0; j < prevConditionListArray.length; j++) {
					if (prevConditionListArray[j].name.toLowerCase() == conditionListArray[i].toLowerCase()) {
						isNewCondition = false;
						break;
					}
				}
				/** if condition_field has been newly added in query or old condition_fields_name has been updated, then update in the JSON **/
				if (isNewCondition) {
					var conditionField = {};
					conditionField["name"] = conditionListArray[i];
					conditionField["added"] = false;
					conditionField.condition = "";
					$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet.push(conditionField);
				}
			}
		};
		$scope.updateOfflineData = function () {
			$scope.modal.selectedOffLineData.Records.Record = $scope.modal.selectedConnection.SelectedFields.connData;
		};

	};


	/** Controller function for Excel Connector
	 * @param  {Object} $scope        	The scope object
	 * @param  {Object} timeout 		The Timeout
	 * @param  {Object} ServiceFactory 	The ServiceFactory
	 * @param  {Object} XLSXReaderService 	The XLSXReaderService
	 * @return {undefined}              undefined
	 */
	var ExcelControllerFn = function ($scope, $timeout, ServiceFactory, XLSXReaderService) {
		$scope.selectedSheetName = "";
		$scope.fieldNames = "";
		var jQueryScript = document.createElement('script');
		jQueryScript.setAttribute('src', './resources/plugins/xlsxReader/jszip.js');
		document.head.appendChild(jQueryScript);
		var jQueryScript = document.createElement('script');
		jQueryScript.setAttribute('src', './resources/plugins/xlsxReader/lodash.min.js');
		document.head.appendChild(jQueryScript);
		var jQueryScript = document.createElement('script');
		jQueryScript.setAttribute('src', './resources/plugins/xlsxReader/xlsx-reader.js');
		document.head.appendChild(jQueryScript);
		var jQueryScript = document.createElement('script');
		jQueryScript.setAttribute('src', './resources/plugins/xlsxReader/xlsx.js');
		document.head.appendChild(jQueryScript);
		var conId = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.id;
		var DashId = $scope.modal.selectedDashboard.id;
		if ($scope.sheetsMap[DashId + "" + conId] == undefined) {
			$scope.sheets = [];
			$scope.sheets[$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.sheet] = [];
			$scope.sheetsMap[DashId + "" + conId] = $scope.sheets;
		}
		$scope.$on("connectionSelected", function (evt, args) {
			$scope.selectionChangeToExcel(args.typeSpecifier);
		});
		$scope.onInitExcel = function () {
			/** Do Nothing **/
		};
		$scope.selectionChangeToExcel = function (typeSpecifier) {
			if (typeSpecifier == "excel") {
				pasteElementChange("txt_UserScript_excel");
			}
		};
		$scope.HandleBrowseClick = function (id) {
			$("#" + id).click();
		};
		$scope.fileChanged = function (files) {
			$scope.isProcessing = true;
			$scope.sheets = [];
			var isEXCEL = (files[0].name.substring(files[0].name.length - 5, files[0].name.length)).toLowerCase() == ".xlsx" ? true : false;
			if (isEXCEL) {
				if (((files || "") != "") && files.length > 0) {
					if (files[0].size < $scope.modal.userPreference.defaultLimitConfigs.excelFile) {
						$scope.excelFile = files[0];
						$scope.excelFileName = files[0].name;
						XLSXReaderService.readFile($scope.excelFile, true, false)
							.then(
								function (xlsxData) {
									$scope.sheets = xlsxData.sheets;
									$scope.setSelectedSheet($scope.sheets);
									$scope.isProcessing = false;
									$scope.updateJSONString($scope);
								});
					} else {
						ServiceFactory.showNotification("File size should not exceed 3MB", "alert-warning", 3000);
					}
				}
				var inputfile = $("#" + $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.id);
				inputfile.replaceWith(inputfile.val(""));
			} else {
				ServiceFactory.showNotification("File Type not supported", "alert-warning", 3000);
				return;
			}
			$scope.previousConnId = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.id;
			$scope.previousFileName = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.url;
			$scope.previousSheetName = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.sheet;
			$scope.updateDashboardJsonWhenSheetNotSelected();
		};
		/** @Description change Selected sheet if same file select than previous selected sheet will be selected Sheet otherwise first Sheet **/
		$scope.setSelectedSheet = function (sheets) {
			var ConnId = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.id;
			if ($scope.excelFileName == $scope.previousFileName && $scope.previousConnId == ConnId) {
				if (sheets[$scope.previousSheetName] != undefined) {
					$scope.selectedSheetName = $scope.previousSheetName;
				} else {
					$scope.modal.refreshDataUrlAvailableDataSet();
					for (var key in sheets) {
						if (sheets.hasOwnProperty(key)) {
							$scope.selectedSheetName = key;
							break;
						}
					}
				}
			} else {
				for (var key1 in sheets) {
					if (sheets.hasOwnProperty(key1)) {
						$scope.selectedSheetName = key1;
						break;
					}
				}
			}
		};
		$scope.updateJSONString = function (dropDown) {
			$scope.selectedSheetName = dropDown.selectedSheetName;
			var conId = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.id;
			var DashId = $scope.modal.selectedDashboard.id;
			$scope.sheetsMap[DashId + "" + conId] = $scope.sheets;
			if ($scope.selectedSheetName != undefined) {
				var dataArray = $scope.sheets[$scope.selectedSheetName];
				var excelDataFields = $scope.dataFields(dataArray.data[0]);
				$scope.updateDashboardJson($scope.excelFileName, dataArray, $scope.selectedSheetName, excelDataFields);
				var isQueryChange = $scope.isDifferentFile();
				$scope.setQueryfieldsAndConditions(excelDataFields, isQueryChange);
				if (isQueryChange) {
					$scope.modal.refreshDataUrlAvailableDataSet();
				} else {
					var fields = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet;
					var calcFields = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.calculatedFieldList;
					$scope.modal.removeChangedFieldFromAvailableDataSet(fields, calcFields);
				}
			} else {
				$scope.updateDashboardJsonWhenSheetNotSelected();
			}
		};
		/** when sheet changes **/
		$scope.updateSheet = function () {
			$scope.selectedSheetName = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.sheet;
			var conId = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.id;
			var DashId = $scope.modal.selectedDashboard.id;
			//$scope.sheetsMap[$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.id]=$scope.sheets;
			$scope.excelFileName = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.url;
			if ($scope.selectedSheetName != undefined) {
				var dataArray = $scope.sheetsMap[DashId + "" + conId][$scope.selectedSheetName];
				var excelDataFields = $scope.dataFields(dataArray.data[0]);
				$scope.updateDashboardJson($scope.excelFileName, dataArray, $scope.selectedSheetName, excelDataFields);
				var isQueryChange = $scope.isDifferentSheet();
				$scope.setQueryfieldsAndConditions(excelDataFields, isQueryChange);
				$scope.modal.refreshDataUrlAvailableDataSet();
			} else {
				$scope.updateDashboardJsonWhenSheetNotSelected();
			}
		};
		/** @description Update method because previous file was not coming proper **/
		$scope.isDifferentFile = function () {
			var isQueryChange = true;
			var selectedConn = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection;
			if ($scope.previousFileName == $scope.excelFileName && $scope.previousConnId == selectedConn.id) {
				isQueryChange = false;
			}
			return isQueryChange;
		};
		/** @description Update method because previous file was not coming proper **/
		$scope.isDifferentSheet = function () {
			var isQueryChange = true;
			var selectedConn = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection;
			if ($scope.previousFileName == $scope.excelFileName && $scope.previousConnId == selectedConn.id && $scope.selectedSheetName == $scope.previousSheetName) {
				isQueryChange = false;
			}
			return isQueryChange;
		};
		/** @description refresh dataconnection / offline data and datasets **/
		$scope.updateDashboardJsonWhenSheetNotSelected = function () {
			var offlinedata = $scope.modal.selectedDashboard.json.Dashboard.OffLineData.Data;
			for (var i = 0; i < offlinedata.length; i++) {
				if (offlinedata[i].id == $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.id) {
					offlinedata[i].Records.Record = {};
					break;
				}
			}
			if ($scope.isDifferentFile()) {
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.url = "";
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.sheet = "";
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet = [];
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet = [];
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet = [];
				$scope.modal.refreshDataUrlAvailableDataSet();
			}
		};
		$scope.dataFields = function (arrData) {
			var data = [];
			/** When selected excel sheet is empty, arrData is undefined **/
			if (arrData) {
				for (var i = 0; i < arrData.length; i++) {
					var value = arrData[i];
					arrData[i] = ("" + value);
					if (arrData[i] == undefined || arrData[i] == "undefined" || arrData[i] === "") {
						data.push("_blank" + (i + 1));
					} else {
						data.push(arrData[i]);
					}
				}
			}
			return data;
		};
		$scope.updateDashboardJson = function (fileInfo, dataArray, sheet, excelDataFields) {
			dataArray.data[0] = excelDataFields;
			var datacontent = dataArray.data;
			var datas = $scope.getNewOfflineDataJSON();
			datas.id = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.id;
			datas.Records.Record = datacontent;
			$scope.addDataToOffLineData(datas);
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.url = fileInfo;
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.sheet = sheet;
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.offLineDataID = $scope.modal.selectedDashboard.json.Dashboard.OffLineData.Data.id;
		};
		$scope.setQueryfieldsAndConditions = function (excelDataFields, isQueryChange) {
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet = [];
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet = [];
			if (isQueryChange) {
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet = [];
			}
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.dataType = "Array";
			$scope.fillAvailableFieldSet(angular.copy(excelDataFields));
			$scope.fillAvailableConditionSet(angular.copy(excelDataFields));
		};
		$scope.fillAvailableFieldSet = function (data) {
			var dataArray = [];
			if (typeof data !== "object") {
				dataArray.push(data);
			} else {
				dataArray = data;
			}
			dataArray.sort(function (x, y) {
				var a = String(x).toUpperCase();
				var b = String(y).toUpperCase();
				return a > b ? 1 : (a < b ? -1 : 0);
			});
			for (var i = 0; i < dataArray.length; i++) {
				var field = $scope.getNewFieldJSON();
				field.name = dataArray[i];
				field.added = true;
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet.push(field);
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet.push(field);
			}
		};
		$scope.fillAvailableConditionSet = function (data) {
			var dataArray = [];
			if (typeof data !== "object") {
				dataArray.push(data);
			} else {
				dataArray = data;
			}
			dataArray.sort(function (x, y) {
				var a = String(x).toUpperCase();
				var b = String(y).toUpperCase();
				return a > b ? 1 : (a < b ? -1 : 0);
			});
			var conditionListArray = dataArray;
			var tempArray = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet;

			/** if condition_fields_name is still available in Query, then keep same in the JSON **/
			var prevConditionListArray = [];
			for (var i1 = 0; i1 < conditionListArray.length; i1++) {
				for (var j1 = 0; j1 < tempArray.length; j1++) {
					if (tempArray[j1].name.toLowerCase() == conditionListArray[i1].toLowerCase()) {
						prevConditionListArray.push(tempArray[j1]);
						break;
					}
				}
			}
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet = angular.copy(prevConditionListArray);

			for (var i = 0; i < conditionListArray.length; i++) {
				var isNewCondition = true;
				for (var j = 0; j < prevConditionListArray.length; j++) {
					if (prevConditionListArray[j].name.toLowerCase() == conditionListArray[i].toLowerCase()) {
						isNewCondition = false;
						break;
					}
				}
				/** if condition_field has been newly added in query or old condition_fields_name has been updated, then update in the JSON **/
				if (isNewCondition) {
					var conditionField = {};
					conditionField["name"] = conditionListArray[i];
					conditionField["added"] = false;
					conditionField.condition = "";
					$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet.push(conditionField);
				}
			}
		};
		$scope.updateOfflineData = function () {
			$scope.modal.selectedOffLineData.Records.Record = $scope.modal.selectedConnection.SelectedFields.connData;
		};
		$scope.getNewOfflineDataJSON = function () {
			var newJSON = "";
			return angular.copy($scope.modal.selectedDashboard.json.OffLineData_Data, newJSON);
		};
		$scope.getNewFieldJSON = function () {
			var newJSON = "";
			return angular.copy($scope.modal.selectedDashboard.json.DataProviders_DataURL_FieldSet, newJSON);
		};

	};


	/** Controller function for WebService Connector
	 * @param  {Object} $scope        	The scope object
	 * @param  {Object} timeout 		The Timeout
	 * @param  {Object} ServiceFactory 	The ServiceFactory
	 * @return {undefined}              undefined
	 */
	var WebserviceControllerFn = function ($scope, $timeout, ServiceFactory) {
		$scope.queriesAvailable = "";
		$scope.configCAPPMConnector = {
			enable: false, config: {
				"dataSourceID": "CA",
				"dataSourceName": "CA",
				"dataSourceType": "",
				"date": "",
				"hostName": ""
			}
		};
		$scope.setValueArray = [];
		$scope.$on("connectionSelected", function (evt, args) {
			$scope.setValueArray = [];
			$scope.reloadConnectionDetail(args.typeSpecifier);
		});
		$scope.onInit = function () {
			/** TODO for PCYC:SSO user, (ServiceFactory.AUTH_INFO.get("authType") === "ca" || ServiceFactory.AUTH_INFO.get("authType") === "sso") **/
			$scope.configCAPPMConnector.enable = (ServiceFactory.AUTH_INFO.get("authType") === "ca");
			$scope.loadUserDataSourceList(false, function () {
				$scope.reloadConnectionDetail("web");
			});
		};
		$scope.loadUserDataSourceList = function (forceLoad, cb) {
			if ($scope.modal.userDataSourceList.web == "" || IsBoolean(forceLoad)) {
				ServiceFactory.postRequestToServer(req_url.designer["getDatasourceList"], {}, ServiceFactory.setupFormData({ 'hasPublishedService': true }),
					function (data, status, headers, config) {
						/** Success CallBack **/
						if (data.dataSources.success && data.dataSources.dataSourcesList !== undefined) {
							var arr = DesignerUtil.prototype.getArrayOfSingleLengthJson(data.dataSources.dataSourcesList);
							arr.sort(function (a, b) {
								var x = String(a["dataSourceName"]).toUpperCase();
								var y = String(b["dataSourceName"]).toUpperCase();
								return ((x < y) ? -1 : ((x > y) ? 1 : 0));
							});
							if ($scope.configCAPPMConnector.enable) {
								/** Prepend CA data source **/
								$scope.modal.userDataSourceList.web = [$scope.configCAPPMConnector.config].concat(arr);

							} else {
								$scope.modal.userDataSourceList.web = [].concat(arr);

							}
						} else {
							ServiceFactory.showNotification("No data source found", "alert-info", 3000);
						}
						$scope.web =  JSON.parse(JSON.stringify($scope.selectedDataSource.web));
						$scope.$apply();
						cb && cb();
					}, function (data, status, headers, config) {
						/** Failure CallBack **/
						cb && cb();
					});
			} else {
				cb && cb();
			}
		};
		$scope.reloadConnectionDetail = function (typeSpecifier) {
			if (typeSpecifier == "web") {
				$scope.loadSavedSourceAndService();
				pasteElementChange("txt_UserScript_Web");
			}
		};
		$scope.loadSavedSourceAndService = function () {
			if ($scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection) {
				var selectedDsIndex = DesignerUtil.prototype.findIndexInArray($scope.modal.userDataSourceList.web, "dataSourceID", $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.selectedDataSourceID);
				if ($scope.modal.userDataSourceList.web[selectedDsIndex]) {
					$scope.selectedDataSource.web = $scope.modal.userDataSourceList.web[selectedDsIndex];
					//$scope.resetDsCombo(selectedDsIndex);
					$scope.resetDsCombo($scope.selectedDataSource.web.$$hashKey);
					$scope.listQueries(true, function () {
						$scope.setQueryFromMap();
					});
				} else {
					$scope.resetDsCombo("");
					$scope.resetQsCombo();
				}
			}
		};

		$scope.setQueryFromMap = function () {
			$scope.setValueArray = [];
			if ($scope.modal.selectedDashboard && $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection && $scope.selectedDataSource.web!== null) {
				$scope.queriesAvailable = angular.copy($scope.modal.dataSourceQueryMap[$scope.selectedDataSource.web["dataSourceID"]]);
				if ($scope.queriesAvailable) {
					/**DAS-918 */
					var selectedQsIndex = DesignerUtil.prototype.findIndexInArray($scope.queriesAvailable, "queryName", $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.queryName);
					if($scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.selectedServiceID != ""){
						var selectedQsIndex = DesignerUtil.prototype.findIndexInArray($scope.queriesAvailable, "serviceId", $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.selectedServiceID);
					}
					try {
						if ($scope.queriesAvailable[selectedQsIndex]) {
							if ($("#d-queries")) {
								$timeout(function () {
									$scope.selectedQuery.web = $scope.queriesAvailable[selectedQsIndex];
									if($scope.queriesAvailable[selectedQsIndex]){
										var val = $scope.queriesAvailable[selectedQsIndex].$$hashKey;
										var value;
										if (val != undefined) {
											$scope.setValueArray.push($scope.queriesAvailable[selectedQsIndex]);
											$scope.selectedQuery.web = $scope.setValueArray[0];
											value = $scope.setValueArray[0].$$hashKey;
											$("#d-queries").select2("val", value);
										}
									}
									
								}, 100);
							}
						} else if ($("#d-queries")) {
							$timeout(function () {
								$("#d-queries").select2();
							}, 100);
						} else {
							// Do nothing
						}
					} catch (e) {
						console.log(e);
					}
				} else {
					$scope.resetDsCombo("");
				}
			} else {
				$scope.resetDsCombo("");
			}
		};
		$scope.listQueries = function (fromSavedFileLoad, cb) {
			$scope.selectedDataSource.web = ($scope.selectedDataSource.web !== null) ? $scope.selectedDataSource.web : (($scope.web != undefined)?JSON.parse(JSON.stringify($scope.web)):$scope.selectedDataSource.web );
			if (!$scope.selectedDataSource.web) {
				$scope.queriesAvailable = "";
				$scope.resetQsCombo();
			} else {
				var dsId = $scope.selectedDataSource.web["dataSourceID"] || $scope.selectedDataSource.web;
				var formData = {};
				if (dsId == "CA") {
					formData = { "dataSourceID": 0, "type": "ca" };
					$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.serviceType = "clarityWSDL";
				} else {
					formData = { "dataSourceID": dsId };
					$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.serviceType = "bizviz";
					$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.Type = "web";
				}
				if (dsId !== "bizviz") {
					$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.selectedDataSourceID = $scope.selectedDataSource.web["dataSourceID"];
					$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.dataSourceName = $scope.selectedDataSource.web["dataSourceName"];
					$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.dataSourceType = $scope.selectedDataSource.web["dataSourceType"];
					$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.databaseName = $scope.selectedDataSource.web["databaseName"];
					$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.hostName = $scope.selectedDataSource.web["hostName"];
					ServiceFactory.postRequestToServer(req_url.designer["listQueryServices"], {}, ServiceFactory.setupFormData(formData),
						function (data, status, headers, config) {
							if (data && data.queryServices && data.queryServices.success && data.queryServices.queryServicesList != undefined) {
								var queryListArray = [].concat(DesignerUtil.prototype.getArrayOfSingleLengthJson(data.queryServices.queryServicesList));
								queryListArray.sort(function (a, b) {
									var x = String(a["queryName"]).toUpperCase();
									var y = String(b["queryName"]).toUpperCase();
									return ((x < y) ? -1 : ((x > y) ? 1 : 0));
								});
								$scope.queriesAvailable = queryListArray;
								if ($scope.selectedDataSource.web != null) {
									$scope.modal.dataSourceQueryMap[$scope.selectedDataSource.web["dataSourceID"]] = queryListArray;
								}
								if(cb){
									cb();
								}else{
									$scope.setQueryFromMap();
								}								
								$scope.$apply();
							} else {
								$scope.queriesAvailable = "";
								$scope.setQueryfieldsAndConditions(false);
								$scope.resetQsCombo();
								$scope.$apply();
							}
						}, function () {
							$scope.queriesAvailable = "";
							$scope.setQueryfieldsAndConditions(false);
							$scope.resetQsCombo();
							$scope.$apply();
						});
				} else {
					$scope.queriesAvailable = "";
					$scope.setQueryfieldsAndConditions(false);
					$scope.resetQsCombo();
					$scope.$apply();
				}
			}
		};
		$scope.setQueryfieldsAndConditions = function (isQueryChange) {
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet = [];
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet = [];
			if (isQueryChange) {
				//$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet = [];
			}

			/** Clear the information of Sort and slice when query is changed **/
			var dsId
			if ($scope.selectedDataSource.web != null) {
				dsId = $scope.selectedDataSource.web["dataSourceID"] || $scope.selectedDataSource.web;
			}

			if (dsId == "CA" && $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.ClarityOptionalCondition) {
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.ClarityOptionalCondition.ClaritySort.Columns = [{ sortField: "", sortDirection: "" }];
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.ClarityOptionalCondition.ClaritySort.sliceIndex = "";
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.ClarityOptionalCondition.ClaritySort.sliceCount = "";
			}
			if ($scope.selectedQuery.web && $scope.selectedQuery.web["queryLink"] != undefined) {
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.url = $scope.selectedQuery.web["queryLink"];
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.queryName = $scope.selectedQuery.web["queryName"];
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.nividhQueryName = $scope.selectedQuery.web["nividhQueryName"];
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.selectedServiceID = $scope.selectedQuery.web["serviceId"];
				$scope.getQueryFields();
				$scope.getQueryFilters();
			} else {
				/** queryLink undefined if service not published from Portal **/
				if (isQueryChange) {
					$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.selectedServiceID = "";
				}
			}
		};
		$scope.getQueryFields = function () {
			var formData = {
				"queryServiceId": $scope.selectedQuery.web["serviceId"]
			};
			ServiceFactory.postRequestToServer(
				req_url.designer["getFieldValues"], {}, ServiceFactory.setupFormData(formData),
				function (data, status, headers, config) {
					if (data && data.queryServices && data.queryServices.success && data.queryServices.fieldName != undefined) {
						$scope.fillAvailableFields(data.queryServices.fieldName);
						$scope.updateAvailableDataSet();
						$scope.$apply();
					} else {
						//do nothing
					}
				});
		};
		$scope.fillAvailableFields = function (data) {
			var dataArray = [];
			if (typeof data !== "object")
				dataArray.push(data);
			else
				dataArray = data;

			dataArray.sort(function (x, y) {
				var a = String(x).toUpperCase();
				var b = String(y).toUpperCase();
				return a > b ? 1 : (a < b ? -1 : 0);
			});
			var fieldListArray = DesignerUtil.prototype.getArrayOfSingleLengthJson(dataArray);
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet = [];
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet = [];
			for (var i = 0; i < fieldListArray.length; i++) {
				var field = $scope.getNewFieldJSON();
				/** TODO toLowerCase needs to be removed once portal returning proper fieldname **/
				field.name = fieldListArray[i].toLowerCase();
				field.added = true;
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet.push(field);
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet.push(field);
			}
		};
		$scope.getNewFieldJSON = function () {
			var newJSON = "";
			return angular.copy($scope.modal.selectedDashboard.json.DataProviders_DataURL_FieldSet, newJSON);
		};
		$scope.getQueryFilters = function () {
			var formData = {
				"id": $scope.selectedQuery.web["serviceId"]
			};
			ServiceFactory.postRequestToServer(
				req_url.designer[($scope.selectedDataSource.web.dataSourceID === "CA") ? "getClarityFilter" : "getAllFilter"], {}, ServiceFactory.setupFormData(formData),
				function (data, status, headers, config) {
					if(data.queryServices.filter == undefined){
						data.queryServices.filter = [];
					}
					if (data && data.queryServices && data.queryServices.success && data.queryServices.filter != undefined) {
						$scope.fillAvailableConditionSet(data.queryServices.filter);
						$scope.$apply();
					} else {
						//do nothing
					}
				});
		};
		/** @description Update Conditions list when query-refreshed or changed **/
		$scope.fillAvailableConditionSet = function (conditionSetArray) {
			var conditionListArray = DesignerUtil.prototype.getArrayOfSingleLengthJson(conditionSetArray);
			var tempArray = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet;
			/** if condition_fields_name is still available in Query, then keep same in the JSON **/
			var prevConditionListArray = [];
			for (var i1 = 0; i1 < conditionListArray.length; i1++) {
				for (var j1 = 0; j1 < tempArray.length; j1++) {
					if (tempArray[j1].name.toLowerCase() == conditionListArray[i1].toLowerCase()) {
						prevConditionListArray.push(tempArray[j1]);
						break;
					}
				}
			}
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet = angular.copy(prevConditionListArray);
			for (var i = 0; i < conditionListArray.length; i++) {
				var isNewCondition = true;
				for (var j = 0; j < prevConditionListArray.length; j++) {
					if (prevConditionListArray[j].name.toLowerCase() == conditionListArray[i].toLowerCase()) {
						isNewCondition = false;
						break;
					}
				}
				/** if condition_field has been newly added in query or old condition_fields_name has been updated, then update in the JSON **/
				if (isNewCondition) {
					var conditionField = {};
					conditionField["name"] = conditionListArray[i].toLowerCase();
					conditionField["displayName"] = IsBoolean(conditionListArray[i].toLowerCase()[0] === "_") ? (conditionListArray[i].toLowerCase()).slice(1, conditionListArray[i].length) : conditionListArray[i].toLowerCase();
					conditionField["added"] = false;
					conditionField.condition = "";
					conditionField.mandatoryField = IsBoolean(conditionListArray[i].toLowerCase()[0] === "_") ? true : false;
					$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet.push(conditionField);
				}
			}
		};
		/** @description Update method because sometime data was not loading .and also need to update Chart DataSet when service Refresh **/
		$scope.onQueryChange = function () {
			var prevURL = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.url;
			$scope.isExistingServiceFlag = false;
			if (this.isExistingService(prevURL)) {
				$scope.isExistingServiceFlag = true;
				$scope.setQueryfieldsAndConditions(false);
			} else {
				/** BDD-805 Clear the dataset of associated chart before getting fields from new query **/
				//$scope.modal.refreshDataUrlAvailableDataSet();
				$scope.setQueryfieldsAndConditions(true);
			}
		};
		/** @description add isExistingService() for check sevice isExisting or not **/
		$scope.isExistingService = function (prevURL) {
			var curURL;
			if ($scope.selectedQuery.web != null) {
				curURL = $scope.selectedQuery.web["queryLink"];
			}

			if (prevURL == curURL) {
				return true;
			} else {
				/** BP-4750 Migration case when both URL are different **/
				var curServiceName = (curURL) ? "" + curURL.split(/[/ ]+/).pop() : "";
				var prevServiceName = (prevURL) ? "" + prevURL.split(/[/ ]+/).pop() : "";
				return (prevServiceName == curServiceName);
			}
		};
		/** @description add for call after getting the data from server **/
		$scope.updateAvailableDataSet = function () {
			if (IsBoolean($scope.isExistingServiceFlag)) {
				var fields = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet;
				var calcFields = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.calculatedFieldList;
				$scope.modal.removeChangedFieldFromAvailableDataSet(fields, calcFields);
			}
		};
		$scope.resetDsCombo = function (val) {
			if ($("#d-datasources")) {
				try {
					$timeout(function () {
						$("#d-datasources").select2("val", val);
					}, 500);
				} catch (e) {
					console.log(e);
				}
			}
		};
		$scope.resetQsCombo = function (val) {
			if ($("#d-queries")) {
				if (val != undefined) {
					try {
						$timeout(function () {
							var value = val.$$hashKey;
							console.log("value", value);
							$("#d-queries").select2("val", value);
						}, 10);
					} catch (e) {
						console.log(e);
					}
				} else {
					try {
						$timeout(function () {
							$("#d-queries").select2();
						}, 10);
					} catch (e) {
						console.log(e);
					}
				}
			}
		};

	}; //nik web End



	/** Controller function for DataStore Connector
	 * @param  {Object} $scope        	The scope object
	 * @param  {Object} timeout 		The Timeout
	 * @param  {Object} ServiceFactory 	The ServiceFactory
	 * @return {undefined}              undefined
	 */
	var DSControllerFn = function ($scope, $timeout, ServiceFactory) {
		$scope.datastoreAvailable = "";
		$scope.onInit = function () {
			$scope.loadUserDataSourceList();
		};

		$scope.$on("connectionSelected", function (evt, args) {
			$scope.reloadConnectionDetail(args.typeSpecifier);
		});

		$scope.reloadConnectionDetail = function (typeSpecifier) {
			if (typeSpecifier == "ds") {
				$scope.loadSavedSourceAndService();
				pasteElementChange("txt_UserScript_DS");
			}
		};

		$scope.loadUserDataSourceList = function (forceLoad) {
			var dataSourceListArray = [];
			var formData = {
				"consumerName": "CUBEPROCESSSERVICE",
				"serviceName": "getDatastoreDetails",
				"data": JSON.stringify({
					"id": "0",
					"datasourcetype": "all"
				}),
				"isSecure": "true"
			};
			if (forceLoad != undefined || $scope.modal.userDataSourceList.ds == "") {
				ServiceFactory.postRequestToServer(
					req_url.designer["pluginService"], {}, ServiceFactory.setupFormData(formData),
					function (data, status, headers, config) {
						$scope.modal.userDataSourceList.ds = "";
						if (data && data.success && data.bizvizCubes != undefined) {
							dataSourceListArray = dataSourceListArray.concat(DesignerUtil.prototype.getArrayOfSingleLengthJson(data.bizvizCubes));
							dataSourceListArray.sort(function (a, b) {
								var x = String(a["title"]).toUpperCase();
								var y = String(b["title"]).toUpperCase();
								return ((x < y) ? -1 : ((x > y) ? 1 : 0));
							});
						} else {
							$scope.selectedDataSource.ds = "";
						}
						$scope.modal.userDataSourceList.ds = dataSourceListArray;
						$scope.loadSavedSourceAndService();
					});
			} else {
				$timeout(function () {
					$scope.loadSavedSourceAndService();
				}, 1500);
			}
		};

		$scope.getDatasourceIdByConnectId = function (id) {
			for (var i = 0; i < $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL.length; i++) {
				if ($scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL[i].id == id) {
					return $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL[i].selectedDataSourceID;
				}
			}
			return "";
		};


		$scope.loadSavedSourceAndService = function () {
			if ($scope.modal.selectedDashboard.json && $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection && $scope.modal.userDataSourceList.ds !== "") {
				var temp = DesignerUtil.prototype.findIndexInArray($scope.modal.userDataSourceList.ds, "id", $scope.getDatasourceIdByConnectId($scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.id));
				try {
					if ($scope.modal.userDataSourceList.ds[temp]) {
						$scope.selectedDataSource.ds = $scope.modal.userDataSourceList.ds[temp];
						$timeout(function () {
						var val = $scope.modal.userDataSourceList.ds[temp].$$hashKey;
						},0);
						if ($("#d-ds-datasources")) {
							$timeout(function () {
							  val = $scope.modal.userDataSourceList.ds[temp].$$hashKey;
							  $("#d-ds-datasources").select2("val", val);
							},0);
						}
					} else if ($("#d-ds-datasources")) {
						$timeout(function () {
						  $("#d-ds-datasources").select2("val", "");
						},0);
					} else {
						// Do nothing
					}
				} catch (e) {
					console.log(e);
				}
				$scope.$evalAsync();
			}
		};

		$scope.listQueries = function (fromSavedFileLoad, cb) {
			if (!$scope.selectedDataSource.ds) {
				return false;
			}
			var dsId = $scope.selectedDataSource.ds["id"] || $scope.selectedDataSource.ds;
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.serviceType = "bizvizDS";
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.Type = "ds";
			var formData = {};
			formData = {
				"consumerName": "CUBEPROCESSSERVICE",
				"serviceName": "getCubeInfo",
				"data": JSON.stringify({
					"id": "" + dsId + ""
				}),
				"isSecure": "true"
			};
			if (dsId != "bizviz") {
				var isQueryChange = (dsId === $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.selectedDataSourceID) ? false : true;
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.selectedDataSourceID = angular.copy($scope.selectedDataSource.ds["id"]);
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.selectedServiceID = angular.copy($scope.selectedDataSource.ds["id"]);
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.dataSourceType = angular.copy("bizvizDS");
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.queryName = angular.copy($scope.selectedDataSource.ds["name"]);
				ServiceFactory.postRequestToServer(req_url.designer["pluginService"], {}, ServiceFactory.setupFormData(formData),
					function (data, status, headers, config) {
						try {
							$scope.setQueryfieldsAndConditions(isQueryChange);
							var queryListArray = [];
							if (data && data.success && data.bizvizCube != undefined && data.bizvizCube.defenition != undefined) {
								/** TODO to handle the issue https://bdbizviz.atlassian.net/browse/BP-4006 from UI side **/
								var columNamesJson = {};
								if ((JSON.parse(data.bizvizCube.defenition)).fieldDef) {
									columNamesJson = (JSON.parse(data.bizvizCube.defenition)).fieldDef;
								} else {
									if ((JSON.parse(data.bizvizCube.cubeOptions)).columnNmae) {
										columNamesJson = (JSON.parse(data.bizvizCube.cubeOptions)).columnNmae;
									} else {
										columNamesJson = (JSON.parse(data.bizvizCube.cubeOptions)).columnName;
									}
								}
								var dimension = columNamesJson.facts;
								var measure = columNamesJson.measures;
								var timedate = columNamesJson.time;
								if (dimension) {
									for (var i = 0; i < dimension.length; i++) {
										queryListArray.push(dimension[i]);
									}
								}
								if (measure) {
									for (var j = 0; j < measure.length; j++) {
										queryListArray.push(measure[j]);
									}
								}
								if (timedate) {
									for (var k = 0; k < timedate.length; k++) {
										queryListArray.push(timedate[k]);
									}
								}
							}
							$scope.fillAvailableFields(queryListArray);
							$scope.fillAvailableConditionSet(queryListArray);
							$scope.updateAvailableDataSet();
							$scope.$apply();
						} catch (e) {
							console.log(e);
						}
					},
					function () {
						$scope.fillAvailableFields([]);
						$scope.fillAvailableConditionSet([]);
						$scope.updateAvailableDataSet();
						$scope.$apply();
					});
			} else {
				$scope.setQueryfieldsAndConditions(true);
			}
		};

		$scope.setQueryfieldsAndConditions = function (isQueryChange) {
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.url = "";
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet = [];
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet = [];
			if (isQueryChange) {
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet = [];
			}
		};

		$scope.fillAvailableFields = function (data) {
			var dataArray = [];
			if (typeof data !== "object")
				dataArray.push(data);
			else
				dataArray = data;

			dataArray.sort(function (x, y) {
				var a = String(x).toUpperCase();
				var b = String(y).toUpperCase();
				return a > b ? 1 : (a < b ? -1 : 0);
			});
			var fieldListArray = DesignerUtil.prototype.getArrayOfSingleLengthJson(dataArray);
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet = [];
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet = [];
			for (var i = 0; i < fieldListArray.length; i++) {
				var field = $scope.getNewFieldJSON();
				field.name = fieldListArray[i];
				field.added = true;
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet.push(field);
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet.push(field);
			}
		};

		$scope.fillAvailableConditionSet = function (data) {
			var dataArray = [];
			if (typeof data !== "object")
				dataArray.push(data);
			else
				dataArray = data;

			dataArray.sort(function (x, y) {
				var a = String(x).toUpperCase();
				var b = String(y).toUpperCase();
				return a > b ? 1 : (a < b ? -1 : 0);
			});
			var conditionListArray = DesignerUtil.prototype.getArrayOfSingleLengthJson(dataArray);
			var tempArray = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet;

			/** if condition_fields_name is still available in Query, then keep same in the JSON **/
			var prevConditionListArray = [];
			for (var i1 = 0; i1 < conditionListArray.length; i1++) {
				for (var j1 = 0; j1 < tempArray.length; j1++) {
					if (tempArray[j1].name.toLowerCase() == conditionListArray[i1].toLowerCase()) {
						prevConditionListArray.push(tempArray[j1]);
						break;
					}
				}
			}
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet = angular.copy(prevConditionListArray);

			for (var i = 0; i < conditionListArray.length; i++) {
				var isNewCondition = true;
				for (var j = 0; j < prevConditionListArray.length; j++) {
					if (prevConditionListArray[j].name.toLowerCase() == conditionListArray[i].toLowerCase()) {
						isNewCondition = false;
						break;
					}
				}
				/** if condition_field has been newly added in query or old condition_fields_name has been updated, then update in the JSON **/
				if (isNewCondition) {
					var conditionField = {};
					conditionField["name"] = conditionListArray[i];
					conditionField["added"] = false;
					conditionField.condition = "";
					$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet.push(conditionField);
				}
			}
		};

		$scope.getNewFieldJSON = function () {
			var newJSON = "";
			return angular.copy($scope.modal.selectedDashboard.json.DataProviders_DataURL_FieldSet, newJSON);
		};

		$scope.updateAvailableDataSet = function () {
			var fields = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet;
			var calcFields = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.calculatedFieldList;
			$scope.modal.removeChangedFieldFromAvailableDataSet(fields, calcFields);
		};
	};




	/** Controller function for Predictive Connector
	 * @param  {Object} $scope        	The scope object
	 * @param  {Object} timeout 		The Timeout
	 * @param  {Object} ServiceFactory 	The ServiceFactory
	 * @return {undefined}              undefined
	 */
	var PAControllerFn = function ($scope, $timeout, ServiceFactory) {
		$scope.formData = {};
		$scope.onInit = function () {
			$scope.loadUserDataSourceList();
		};

		$scope.$on("connectionSelected", function (evt, args) {
			$scope.reloadConnectionDetail(args.typeSpecifier);
		});
		$scope.reloadConnectionDetail = function (typeSpecifier) {
			if (typeSpecifier == "pa") {
				$scope.loadSavedSourceAndService();
				pasteElementChange("txt_UserScript_PA");
			}
		};

		/** @desciption this method loads the predictive models and set into a factory varibale **/
		$scope.loadUserDataSourceList = function (forceLoad) {
			var dataSourceListArray = [];
			var formData = {
				"consumerName": "BIZVIZ_PA",
				"serviceName": "GET_ALL_PUBLISHED_WORKFLOW",
				"data": JSON.stringify({ "isPublished": 1 }), "isSecure": true
			};
			if (forceLoad != undefined || $scope.modal.userDataSourceList.pa == "") {
				ServiceFactory.postRequestToServer(
					req_url.designer["pluginService"], {}, ServiceFactory.setupFormData(formData),
					function (data, status, headers, config) {
						$scope.modal.userDataSourceList.pa = "";
						if (data && data.success && data.predictiveModelList != undefined) {
							dataSourceListArray = dataSourceListArray.concat(DesignerUtil.prototype.getArrayOfSingleLengthJson(data.predictiveModelList));
							dataSourceListArray.sort(function (a, b) {
								var x = String(a["title"]).toUpperCase();
								var y = String(b["title"]).toUpperCase();
								return ((x < y) ? -1 : ((x > y) ? 1 : 0));
							});
						} else {
							$scope.selectedDataSource.pa = "";
							if (data && !data.predictiveModelList) {
								ServiceFactory.showNotification("No Predictive model found", "alert-info", 3000);
							}
						}
						$scope.modal.userDataSourceList.pa = dataSourceListArray;
						$scope.loadSavedSourceAndService();
					});
			} else {
				$timeout(function () {
					$scope.loadSavedSourceAndService();
				}, 1500);
			}

			/** Check for Spark configuration in Portal for alerts*/
			/** Commented below method to remove the sparksettings alert in designer connection page
			as we are not checking R,Python workflows, change made according to BDD-645(2)*/
			//$scope.getSparkSettings();
		};
		$scope.getSparkSettings = function () {
			//			var sparkBizvizLocation;
			var reqData = {
				"id": "",
				"type": 12,
				"status": 1,
				"spaceKey": ServiceFactory.AUTH_INFO.get("spacekey"),
				"IsSparkWorkspaceLoad": true,
				"settings": ""
			};
			var formData = {
				"consumerName": "BIZVIZ_PA",
				"serviceName": "getSettingsFromPa",
				"data": JSON.stringify(reqData),
				"isSecure": true
			};
			ServiceFactory.postRequestToServer(req_url.designer["pluginService"], {}, ServiceFactory.setupFormData(formData),
				function (response) {
					if (response && !response.hasOwnProperty("status") && response["predictiveSparkServerSettings"] != undefined) {
						/*
						var tempJson = response["predictiveSparkServerSettings"];
						var newSettings = {
//		    				"pahost": tempJson["paHost"],
//		    				"paport": tempJson["paPort"],
//		    				"papassword": btoa(tempJson["paPassword"]),
//		    				"pausername": tempJson["paUserName"],
//		    				"paapplication": tempJson["paApplication"],
							"paWebUrl": tempJson["paWebUrl"]
						};
						
						sparkBizvizLocation = newSettings.paWebUrl;
						var testSparkServerdata = {
							"consumerName": "BIZVIZ_PA",
							"serviceName": "testSparkConnection",
							"data": JSON.stringify(newSettings),
							"isSecure": true
						};
						ServiceFactory.postRequestToServer(req_url.designer["pluginService"], {}, testSparkServerdata, 
							function(result, status) {
								if(result && result.success){
									if(sparkBizvizLocation != undefined){
										console.log(result.message);
										ServiceFactory.showNotification(result.message, "alert-success", 3000);
									}
								}else{
									ServiceFactory.showNotification("Predictive spark server is not configured", "alert-danger", 3000);
								}
						});*/
						ServiceFactory.showNotification("Spark server successfully connected", "alert-success", 3000);
					} else if (response && !response.success) {
						ServiceFactory.showNotification("Predictive spark server is not configured", "alert-danger", 3000);
					} else {
						ServiceFactory.showNotification("No Plugin for displaying the Predictive content, Please contact the administartor", "alert-danger", 3000);
					}
				});
		};

		$scope.loadSavedSourceAndService = function () {
			if ($scope.modal.selectedDashboard.json && $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection && $scope.modal.userDataSourceList.pa !== "") {
				var temp = DesignerUtil.prototype.findIndexInArray($scope.modal.userDataSourceList.pa, "modelId", $scope.getDatasourceIdByConnectId($scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.id));
				try {
					if ($scope.modal.userDataSourceList.pa[temp]) {
						$scope.selectedDataSource.pa = $scope.modal.userDataSourceList.pa[temp];
						if ($("#d-pa-datasources")) {
							$timeout(function () {
								var val = $scope.modal.userDataSourceList.pa[temp].$$hashKey;
								$("#d-pa-datasources").select2("val", val);
							}, 0);
						}
						/* when this select2 updated, it will automatically trigger listQueries method */
						//						$scope.listQueries(true);
					} else if ($("#d-pa-datasources")) {
						$timeout(function () {
							$("#d-pa-datasources").select2("val", "");
						}, 0);
					} else {
						// Do nothing
					}
				} catch (e) {
					console.log(e);
				}
				$scope.$apply();
			}
		};
		$scope.getDatasourceIdByConnectId = function (id) {
			for (var i = 0; i < $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL.length; i++) {
				if ($scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL[i].id == id) {
					return $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL[i].selectedDataSourceID;
				}
			}
			return "";
		};
		$scope.listQueries = function (fromSavedFileLoad) {
			if (!$scope.selectedDataSource.pa) {
				$scope.fillAvailableFields([]);
				return false;
			}
			var dsId = $scope.selectedDataSource.pa["modelId"] || $scope.selectedDataSource.pa;
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.serviceType = "bizvizPA";
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.Type = "web";
			var formData = {
				"consumerName": "BIZVIZ_PA", "serviceName": "GET_METADATA_OF_PUBLISHED_WORKFLOW",
				"data": JSON.stringify({ "workflowId": "" + dsId + "" }), "isSecure": "true",
			};
			if (dsId != "bizviz") {
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.selectedDataSourceID = angular.copy($scope.selectedDataSource.pa["modelId"]);
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.selectedServiceID = angular.copy($scope.selectedDataSource.pa["modelId"]);
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.dataSourceType = angular.copy("bizvizPA");
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.queryName = angular.copy($scope.selectedDataSource.pa["title"]);

				ServiceFactory.postRequestToServer(req_url.designer["pluginService"], {}, ServiceFactory.setupFormData(formData),
					function (data, status, headers, config) {
						try {
							var queryListArray = [];
							var queryFilterArray = [];
							var pJsonDef = "";
							$scope.setQueryfieldsAndConditions(false);
							if (data && data.success && data.preictiveModel != undefined && data.preictiveModel.predictiveJsonDefinition != undefined) {
								var resp = JSON.parse(data.preictiveModel.predictiveJsonDefinition);
								resp.metadata.map(function (obj) {
									queryListArray.push(obj.field);
								});

								if (IsBoolean(resp.isSpark)) {
									//									resp.filterComponent.map(function(obj){
									//										for(var key in obj["filterKeyValuePair"]){
									//											queryFilterArray.push(key);
									//										}
									//									});
									if (resp.sparkfilterComponent && resp.sparkfilterComponent[0]) {
										queryFilterArray = resp.sparkfilterComponent[0].filterArray;
									}
								} else {
									resp.filterComponent.map(function (obj) {
										for (var key in obj["filter"]) {
											queryFilterArray.push(key);
										}
									});
								}

								/** Update the additional info into the PredictiveJsonDef **/
								resp.workFlowType = data.preictiveModel.workFlowType;
								pJsonDef = resp;
							}
							$scope.fillAvailableFields(queryListArray);
							$scope.fillAvailableConditionSet(queryFilterArray);
							$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.PredictiveJsonDef = pJsonDef;
							$scope.updateAvailableDataSet();
							$scope.$apply();
						} catch (e) {
							console.log(e);
						}
					}, function () {
						$scope.fillAvailableFields([]);
						$scope.fillAvailableConditionSet([]);
						$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.PredictiveJsonDef = "";
						$scope.updateAvailableDataSet();
						$scope.$apply();
					});
			} else {
				$scope.setQueryfieldsAndConditions(false);
			}
		};
		$scope.fillAvailableFields = function (data) {
			var dataArray = [];
			if (typeof data !== "object")
				dataArray.push(data);
			else
				dataArray = data;

			dataArray.sort(function (x, y) {
				var a = String(x).toUpperCase();
				var b = String(y).toUpperCase();
				return a > b ? 1 : (a < b ? -1 : 0);
			});
			var fieldListArray = DesignerUtil.prototype.getArrayOfSingleLengthJson(dataArray);
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet = [];
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet = [];
			for (var i = 0; i < fieldListArray.length; i++) {
				var field = $scope.getNewFieldJSON();
				field.name = fieldListArray[i];
				field.added = true;
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet.push(field);
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet.push(field);
			}
		};
		$scope.fillAvailableConditionSet = function (data) {
			var dataArray = [];
			if (typeof data !== "object")
				dataArray.push(data);
			else
				dataArray = data;

			dataArray.sort(function (x, y) {
				var a = String(x).toUpperCase();
				var b = String(y).toUpperCase();
				return a > b ? 1 : (a < b ? -1 : 0);
			});
			var conditionListArray = DesignerUtil.prototype.getArrayOfSingleLengthJson(dataArray);
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet = [];
			for (var i = 0; i < conditionListArray.length; i++) {
				var conditionField = {};
				/** Need to keep the font case as it is */
				conditionField["name"] = conditionListArray[i];
				conditionField["added"] = false;
				conditionField.condition = "";
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet.push(conditionField);
			}
		};
		/** @description add for call after getting the data from server **/
		$scope.updateAvailableDataSet = function () {
			var fields = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet;
			var calcFields = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.calculatedFieldList;
			$scope.modal.removeChangedFieldFromAvailableDataSet(fields, calcFields);
		};
		$scope.setQueryfieldsAndConditions = function (isQueryChange) {
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.url = "";
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.PredictiveJsonDef = "";
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet = [];
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet = [];
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet = [];
		};
		$scope.getNewFieldJSON = function () {
			var newJSON = "";
			return angular.copy($scope.modal.selectedDashboard.json.DataProviders_DataURL_FieldSet, newJSON);
		};

	};

	/**Excel Connector**/

	/** Controller function for Datasheet Connector
	 * @param  {Object} $scope        	The scope object
	 * @param  {Object} timeout 		The Timeout
	 * @param  {Object} ServiceFactory 	The ServiceFactory
	 * @return {undefined}              undefined
	 */
	var DataSheetControllerFn = function ($scope, $timeout, ServiceFactory) {
		$scope.formData = {};
		$scope.onInit = function () {
			$scope.loadUserDataSourceList();
		};

		$scope.$on("connectionSelected", function (evt, args) {
			$scope.reloadConnectionDetail(args.typeSpecifier);
		});
		$scope.reloadConnectionDetail = function (typeSpecifier) {
			if (typeSpecifier == "datasheet") {
				$scope.loadSavedSourceAndService();
				pasteElementChange("txt_UserScript_DataSheet");
			}
		};

		/** @desciption this method loads the Datasheet and set into a factory varibale **/
		$scope.loadUserDataSourceList = function (forceLoad) {
			var dataSourceListArray = [];
			var formData = {
				"consumerName": "BDBDATASHEET",
				"serviceName": "getAllDataSheet",
				"data": JSON.stringify({ "type": 2 }), "spacekey": ServiceFactory.AUTH_INFO.get("spacekey")
			};
			if (forceLoad != undefined || $scope.modal.userDataSourceList.datasheet == "") {
				ServiceFactory.postRequestToServer(
					req_url.designer["pluginService"], {}, ServiceFactory.setupFormData(formData),
					function (data, status, headers, config) {
						$scope.modal.userDataSourceList.datasheet = "";
						if (data && data.success && data.bizvizMetadatas !== undefined) {
							dataSourceListArray = dataSourceListArray.concat(DesignerUtil.prototype.getArrayOfSingleLengthJson(data.bizvizMetadatas));
							dataSourceListArray.sort(function (a, b) {
								var x = String(a["title"]).toUpperCase();
								var y = String(b["title"]).toUpperCase();
								return ((x < y) ? -1 : ((x > y) ? 1 : 0));
							});
						} else {
							$scope.selectedDataSource.datasheet = "";
							if (data && !data.bizvizMetadatas) {
								ServiceFactory.showNotification("No Datasheet found", "alert-info", 3000);
							}
						}
						$scope.modal.userDataSourceList.datasheet = dataSourceListArray;
						$scope.loadSavedSourceAndService();
					});
			} else {
				$timeout(function () {
					$scope.loadSavedSourceAndService();
				}, 1500);
			}
		};

		$scope.loadSavedSourceAndService = function () {
			if ($scope.modal.selectedDashboard.json && $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection && $scope.modal.userDataSourceList.datasheet !== "") {
				var temp = DesignerUtil.prototype.findIndexInArray($scope.modal.userDataSourceList.datasheet, "id", $scope.getDatasourceIdByConnectId($scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.id));
				try {
					if ($scope.modal.userDataSourceList.datasheet[temp]) {
						$scope.selectedDataSource.datasheet = $scope.modal.userDataSourceList.datasheet[temp];
						if ($("#d-datasheet-datasources")) {
							$timeout(function () {
								temp = $scope.selectedDataSource.datasheet.$$hashKey;
								$("#d-datasheet-datasources").select2("val", temp);
							}, 10);
						}
					} else if ($("#d-datasheet-datasources")) {
						$timeout(function () {
							$("#d-datasheet-datasources").select2("val", "");
						}, 0);
					} else {
						// Do nothing
					}
				} catch (e) {
					console.log(e);
				}
				$scope.$evalAsync();
			}
		};
		$scope.getDatasourceIdByConnectId = function (id) {
			for (var i = 0; i < $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL.length; i++) {
				if ($scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL[i].id == id) {
					return $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL[i].selectedDataSourceID;
				}
			}
			return "";
		};
		$scope.listQueries = function (fromSavedFileLoad) {
			if (!$scope.selectedDataSource.datasheet) {
				$scope.fillAvailableFields([]);
				return false;
			}
			var dsId = $scope.selectedDataSource.datasheet["id"] || $scope.selectedDataSource.datasheet;
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.serviceType = "bizvizdatasheet";
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.Type = "datasheet";
			var formData = {
				"consumerName": "BDBDATASHEET", "serviceName": "getAllDataSheetById",
				"data": JSON.stringify({ "id": "" + dsId + "" }), "isSecure": "true",
			};
			if (dsId != "bizviz") {
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.selectedDataSourceID = angular.copy($scope.selectedDataSource.datasheet["id"]);
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.selectedServiceID = angular.copy($scope.selectedDataSource.datasheet["id"]);
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.dataSourceType = angular.copy("bizvizdatasheet");
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.queryName = angular.copy($scope.selectedDataSource.datasheet["name"]);

				ServiceFactory.postRequestToServer(req_url.designer["pluginService"], {}, ServiceFactory.setupFormData(formData),
					function (data, status, headers, config) {
						try {
							var queryListArray = [];
							var queryFilterArray = [];
							var pJsonDef = "";
							$scope.setQueryfieldsAndConditions(false);
							if (data && data.success && data.bizvizMetadata != undefined && data.bizvizMetadata.metadata != undefined) {
								var resp = JSON.parse(data.bizvizMetadata.metadata);
								resp.columns.map(function (obj) {
									if (obj.title !== 'BDB_DS_ID') {
										queryListArray.push(obj.title);
									}
									if (IsBoolean(obj.filter)) {
										queryFilterArray.push(obj.title);
									}
								});
								pJsonDef = resp;
							}
							$scope.fillAvailableFields(queryListArray);
							$scope.fillAvailableConditionSet(queryFilterArray);
							$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.datasheetJsonDef = pJsonDef;
							$scope.updateAvailableDataSet();
							$scope.$apply();
						} catch (e) {
							console.log(e);
						}
					}, function () {
						$scope.fillAvailableFields([]);
						$scope.fillAvailableConditionSet([]);
						$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.datasheetJsonDef = "";
						$scope.updateAvailableDataSet();
						$scope.$apply();
					});
			} else {
				$scope.setQueryfieldsAndConditions(false);
			}
		};
		$scope.fillAvailableFields = function (data) {
			var dataArray = [];
			if (typeof data !== "object")
				dataArray.push(data);
			else
				dataArray = data;

			dataArray.sort(function (x, y) {
				var a = String(x).toUpperCase();
				var b = String(y).toUpperCase();
				return a > b ? 1 : (a < b ? -1 : 0);
			});
			var fieldListArray = DesignerUtil.prototype.getArrayOfSingleLengthJson(dataArray);
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet = [];
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet = [];
			for (var i = 0; i < fieldListArray.length; i++) {
				var field = $scope.getNewFieldJSON();
				field.name = fieldListArray[i];
				field.added = true;
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet.push(field);
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet.push(field);
			}
		};
		$scope.fillAvailableConditionSet = function (data) {
			var dataArray = [];
			if (typeof data !== "object")
				dataArray.push(data);
			else
				dataArray = data;

			dataArray.sort(function (x, y) {
				var a = String(x).toUpperCase();
				var b = String(y).toUpperCase();
				return a > b ? 1 : (a < b ? -1 : 0);
			});
			var conditionListArray = DesignerUtil.prototype.getArrayOfSingleLengthJson(dataArray);
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet = [];
			for (var i = 0; i < conditionListArray.length; i++) {
				var conditionField = {};
				/** Need to keep the font case as it is */
				conditionField["name"] = conditionListArray[i];
				conditionField["added"] = false;
				conditionField.condition = "";
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet.push(conditionField);
			}
		};
		/** @description add for call after getting the data from server **/
		$scope.updateAvailableDataSet = function () {
			var fields = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet;
			var calcFields = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.calculatedFieldList;
			$scope.modal.removeChangedFieldFromAvailableDataSet(fields, calcFields);
		};
		$scope.setQueryfieldsAndConditions = function (isQueryChange) {
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.url = "";
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.datasheetJsonDef = "";
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.FieldSet = [];
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableFieldSet = [];
			$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.availableConditionSet = [];
		};
		$scope.getNewFieldJSON = function () {
			var newJSON = "";
			return angular.copy($scope.modal.selectedDashboard.json.DataProviders_DataURL_FieldSet, newJSON);
		};

	};

	/**Excel Connector End**/


	/** Controller function for Websocket Connector
	 * @param  {Object} $scope        	The scope object
	 * @param  {Object} timeout 		The Timeout
	 * @param  {Object} ServiceFactory 	The ServiceFactory
	 * @return {undefined}              undefined
	 */
	var WSControllerFn = function ($scope, $timeout, ServiceFactory) {
		$scope.onInit = function () {
		};
		$scope.$on("connectionSelected", function (evt, args) {
			$scope.reloadConnectionDetail(args.typeSpecifier);
		});
		$scope.reloadConnectionDetail = function (typeSpecifier) {
			if (typeSpecifier == "ws") {
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.serviceType = "bizvizWS";
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.Type = "ws";
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.selectedServiceID = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.url;
				pasteElementChange("txt_UserScript_WS");
			}
		};
	};


	/** Controller function for Derived Data Connector
	 * @param  {Object} $scope        	The scope object
	 * @param  {Object} timeout 		The Timeout
	 * @param  {Object} ServiceFactory 	The ServiceFactory
	 * @return {undefined}              undefined
	 */
	var DdataControllerFn = function ($scope, $timeout, ServiceFactory) {
		$scope.leftCriteriaOperand = "";
		$scope.rightCriteriaOperand = "";
		$scope.connectionList = [];
		$scope.parentConnection_1 = {};
		$scope.parentConnection_2 = {};
		$scope.parentFields_1 = [];
		$scope.parentFields_2 = [];
		$scope.mergedFieldList = [];
		$scope.draggedConnection = {};
		$scope.conditionalOperator = [];
		$scope.selectedCriteriaOperator = {}
		$scope.selected
		$scope.criteria = "";
		$scope.dFieldName = "";
		$scope.displayCriteriaBuilder = true;
		$scope.displayOpenCriteriaBuilder = true;
		$scope.displayCriteria = true;
		$scope.derivedCondition = {
			"criteria": [$scope.criteria]
		};

		/**
		 * @function
		 * @description init function fired when connection page loads
		 * */
		$scope.onInit = function () {
			$scope.connectionList = $scope.getConnectionList();
			$scope.conditionalOperator = [{
				opId: "eq",
				displayName: "Equal",
				symbol: "=="
			}, {
				opId: "neq",
				displayName: "Not Equal",
				symbol: "!="
			}
			];
			$scope.$on("connectionSelected", function (evt, args) {
				$scope.reloadConnectionDetails(args.typeSpecifier);
			});
			$scope.selectedCriteriaOperator = $scope.conditionalOperator[0];
			$scope.setConnectionSelected($scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection);
		};

		/**
		 * @function
		 * @description callback function fired when click on the connection
		 * @param { string } typeSpecifier - the type specifier of the connection
		 * */
		$scope.reloadConnectionDetails = function (typeSpecifier) {
			if (typeSpecifier && typeSpecifier === "derived") {
				$scope.reloadParentConnections();
				$scope.reloadCriteria();
				$scope.reloadDerivedFields();
				$scope.$apply();
			}
		};

		/**
		 * @function
		 * @description reloads the both the parent connections
		 * */
		$scope.reloadParentConnections = function () {
			var parentSouceId_1 = $scope.getSelectedConnection()["parentSource"];
			var parentSouceId_2 = $scope.getSelectedConnection()["childSource"];
			$scope.parentConnection_1 = DesignerUtil.prototype.findInArray($scope.connectionList, "id", parentSouceId_1);
			$scope.parentConnection_2 = DesignerUtil.prototype.findInArray($scope.connectionList, "id", parentSouceId_2);
			$scope.parentFields_1 = $scope.getParentFields(parentSouceId_1);
			$scope.parentFields_2 = $scope.getParentFields(parentSouceId_2);
		};

		/**
		 * @function
		 * @description reloads the criteria
		 * */
		$scope.reloadCriteria = function () {
			var
				selectedConnection = $scope.getSelectedConnection(),
				deriveConditions = selectedConnection["deriveConditions"];
			$scope.criteria = deriveConditions ? $scope.getSelectedConnection()["deriveConditions"]["criteria"][0] : "";
		};

		/**
		 * @function
		 * @description reloads the derived field
		 * */
		$scope.reloadDerivedFields = function () {
			var
				selectedConnection = $scope.getSelectedConnection();
			$scope.mergedFieldList = selectedConnection["availableFieldSet"] || [];
		};

		/**
		 * @function
		 * @description returns the parent fields specified by the connection id
		 * @param { string } connId - connection id
		 * */
		$scope.getParentFields = function (connId) {
			var connection = null;
			if (connId) {
				connection = $scope.getConnectionByConnId(connId)["FieldSet"];
			}
			return connection;
		};

		/**
		 * @function
		 * @description returns the connection specified by connection id
		 * @param { string } connId - connection id
		 * */
		$scope.getConnectionByConnId = function (connId) {
			var
				connections = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL,
				connection = null;
			if (connId && connections) {
				connection = DesignerUtil.prototype.findInArray(connections, "id", connId);
			}
			return connection;
		};

		/**
		 * @function
		 * @description returns the selected connection
		 * */
		$scope.getSelectedConnection = function () {
			var selConnId = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.id,
				conns = $scope.getConnectionList();
			return DesignerUtil.prototype.findInArray(conns, "id", selConnId);
		};

		/**
		 * @function
		 * @description returns the connection list of the selected dashboard
		 * */
		$scope.getConnectionList = function () {
			return $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL;
		};

		/**
		 * @function
		 * @description callback function fired when first connection changed
		 * @param { string } connId - the connection id
		 * */
		$scope.onFirstConnectionChange = function (connId) {
			$scope.parentFields_1 = $scope.getParentFields(connId);
			$scope.removePreviousConnFieldsFromMergedFieldist($scope.parentConnection_2);
			for (var i = 0; i < $scope.parentFields_1.length; i++) {
				var field = angular.copy($scope.parentFields_1[i]);
				field["parentConnection"] = connId;
				field["parentField"] = field.name;
				$scope.addToMeargedFieldList(field);
			}
			$scope.getSelectedConnection()["parentSource"] = $scope.parentConnection_1.id;
			$scope.getSelectedConnection()["availableFieldSet"] = $scope.mergedFieldList;
			$scope.getSelectedConnection()["FieldSet"] = $scope.mergedFieldList;
			$scope.$apply();
		};

		/**
		 * @function
		 * @description callback function fired when second connection changed
		 * @param { string } connId - the connection id
		 * */
		$scope.onSecondConnectionChange = function (connId) {
			$scope.parentFields_2 = $scope.getParentFields(connId);
			$scope.removePreviousConnFieldsFromMergedFieldist($scope.parentConnection_1);
			for (var i = 0; i < $scope.parentFields_2.length; i++) {
				var field = angular.copy($scope.parentFields_2[i]);
				field["parentConnection"] = connId;
				field["parentField"] = field.name;
				$scope.addToMeargedFieldList(field);
			}
			$scope.getSelectedConnection()["childSource"] = $scope.parentConnection_2.id;
			$scope.getSelectedConnection()["availableFieldSet"] = $scope.mergedFieldList;
			$scope.getSelectedConnection()["FieldSet"] = $scope.mergedFieldList;
			$scope.$apply();
		};

		/**
		 * @function
		 * @description callback function fired when field is being dragged
		 * @param { object } connection - the connection of the dragged field
		 * */
		$scope.onFieldDragSuccess = function (connection) {
			$scope.draggedConnection = connection;
		};

		/**
		 * @function
		 * @description callback function fired when left criteria operand changes
		 * */
		$scope.onLeftCriteriaOperandChange = function (data, ev) {
			$scope.criteria = "";
			$scope.leftCriteriaOperand = $scope.draggedConnection.id + "." + data.name;
		};

		/**
		 * @function
		 * @description callback function fired when right criteria operand changes
		 * */
		$scope.onRightCriteriaOperandChange = function () {
			$scope.criteria = "";
			$scope.rightCriteriaOperand = $scope.draggedConnection.id + "." + data.name;
		};

		/**
		 * @function
		 * @description creates criteria
		 * */
		$scope.createCriteria = function () {
			var oldCriteria = $scope.criteria,
				newCriteria;
			if (oldCriteria && oldCriteria != "") {
				oldCriteria += " && ";
			}
			newCriteria = $scope.parentConnection_1.id
				+ "."
				+ $scope.leftCriteriaOperand.name
				+ $scope.selectedCriteriaOperator.symbol
				+ $scope.parentConnection_2.id
				+ "."
				+ $scope.rightCriteriaOperand.name;
			if (!(oldCriteria.search(newCriteria) > -1)) {
				$scope.criteria = oldCriteria + newCriteria;
				$scope.derivedCondition = {
					"criteria": [$scope.criteria]
				};
				$scope.getSelectedConnection()["deriveConditions"] = $scope.derivedCondition;
			}
			$scope.displayCriteria = true;
		};

		/**
		 * @function
		 * @description hides criteria builder
		 * */
		$scope.hideCriteriaBulder = function () {
			$scope.displayCriteria = true;
		};

		/**
		 * @function
		 * @description display criteria builder
		 * */
		$scope.showCriteriaBuilder = function () {
			if (!$scope.displayCriteriaBuilder || $scope.displayCriteria) {
				if ($scope.parentFields_1 && $scope.parentFields_2) {
					if ($scope.parentFields_1.length > 0 && $scope.parentFields_2.length > 0) {
						$scope.leftCriteriaOperand = $scope.parentFields_1[0];
						$scope.rightCriteriaOperand = $scope.parentFields_2[0];
						$scope.displayCriteriaBuilder = true;
						$scope.displayCriteria = false;
					} else {
						ServiceFactory.showNotification("Selected connection does not have fields", "alert-danger", 3000);
					}
				} else {
					if (!$scope.parentFields_1) {
						ServiceFactory.showNotification("Select a connection for Left-Table", "alert-warning", 3000);
					} else if (!$scope.parentFields_2) {
						ServiceFactory.showNotification("Select a connection for Right-Table", "alert-warning", 3000);
					} else {
						// Do nothing
					}
				}
			}
		};

		/**
		 * @function
		 * @description opens the rename dialog box
		 * @param { object } field - field object
		 * */
		$scope.showRenameFieldDialog = function (field) {
			$scope.dFieldName = field.name;
			$scope.oldFieldName = field.name;
			$scope.showModelPopup('renameDerivedFields');
		};

		/**
		 * @function
		 * @description rename the field name
		 * */
		$scope.renameField = function () {
			var fieldSet = $scope.getSelectedConnection()["FieldSet"],
				newFieldName = $scope.dFieldName.trim(),
				regEx = /^[a-zA-Z_][a-zA-Z_0-9]*$/i;
			if (!(regEx.test(newFieldName))) {
				ServiceFactory.showNotification("Field name must starts with \"Alphabet\" or \"Underscore\" ", "alert-warning", 3000);
				return false;
			}
			if (newFieldName && newFieldName != "") {
				for (var i = 0; i < fieldSet.length; i++) {
					if (fieldSet[i].name === $scope.oldFieldName) {
						$scope.removeFieldsFromCompDataset(fieldSet[i]);
						fieldSet[i].name = $scope.dFieldName;
					}
				}
				$scope.mergedFieldList = fieldSet;
				$scope.getSelectedConnection()["availableFieldSet"] = $scope.mergedFieldList;
				$scope.getSelectedConnection()["FieldSet"] = $scope.mergedFieldList;
				$scope.hideModelPopup('renameDerivedFields');

			} else {
				ServiceFactory.showNotification("Field name can not be empty", "alert-warning", 3000);
			}
		};

		/**
		 * It'll remove the dataset from the component
		 * @param  {object} oldField The field object before renaming
		 */
		$scope.removeFieldsFromCompDataset = function (oldField) {
			var dbObjects = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object,
				obj, subEle, dataSet, fields;
			for (var i = 0; i < dbObjects.length; i++) {
				obj = dbObjects[i];
				subEle = obj.subElement;
				dataSet = obj[subEle].DataSet;
				fields = dataSet ? dataSet.Fields : [];
				for (var j = 0; j < fields.length; j++) {
					if (fields[j].Name == oldField.name) {
						fields.splice(j, 1);
						break;
					}
				}
			}
		};

		/**
		 * @function
		 * @description callback on drop sucess
		 * @param { object } field - connection field
		 * @param { object } ev - event
		 * @param { object } draggedConnection - connection of the currently dragged field
		 * */
		$scope.onFieldDropSuccess = function (field, ev, draggedConnection) {
			var cpyField = angular.copy(field);
			cpyField["parentConnection"] = $scope.draggedConnection.id;
			cpyField["parentField"] = field.name;
			$scope.addToMeargedFieldList(cpyField);
			$scope.getSelectedConnection()["availableFieldSet"] = $scope.mergedFieldList;
			$scope.getSelectedConnection()["FieldSet"] = $scope.mergedFieldList;
		};

		/**
		 * @function
		 * @description adds entry from the meargedFieldList
		 * @param { object } field - connection field
		 * */
		$scope.addToMeargedFieldList = function (field) {
			if (!$scope.isMeargedFieldListContains(field)) {
				$scope.mergedFieldList.push(field);
			}
			else {
				field.name = field.name + "_R";
				$scope.mergedFieldList.push(field);
			}
		};

		/**
		 * @function
		 * @description removes entry from the meargedFieldList
		 * @param { object } field - connection field
		 * */
		$scope.removeFromMeargedFieldList = function (field) {
			var fieldIndex = -1;
			for (var i = 0; i < $scope.mergedFieldList.length; i++) {
				if ($scope.mergedFieldList[i]["name"] === field.name) {
					fieldIndex = i;
					break;
				}
			}
			$scope.mergedFieldList.splice(fieldIndex, 1);
		};

		/**
		 * @function
		 * @description checks for the mergedFieldList entry
		 * @param { object } field - connection field
		 * */
		$scope.isMeargedFieldListContains = function (field) {
			if (field) {
				for (var i = 0; i < $scope.mergedFieldList.length; i++) {
					if ($scope.mergedFieldList[i]["name"] === field.name) {
						return true;
					}
				}
			}
			return false;
		};

		/**
		 * @function
		 * @description remove the previous connection fields before merging new fields in mergedFieldList entry
		 * @param { object } connection Object
		 * @author EID20
		 * */
		$scope.removePreviousConnFieldsFromMergedFieldist = function (connObj) {
			var arr = [];
			if (connObj) {
				for (var i = 0; i < $scope.mergedFieldList.length; i++) {
					if ($scope.mergedFieldList[i]["parentConnection"] == connObj.id) {
						arr.push($scope.mergedFieldList[i]);
					}
				}
			}
			$scope.mergedFieldList = arr;
		};

	};

	/** @description Controller definition **/
	angular.module(designerModules.module.DesignerPropertyManager)
		.controller("DPController", ["$scope", "$timeout", "ServiceFactory", DPControllerFn]);

	/** @description Controller definition **/
	angular.module(designerModules.module.DesignerPropertyManager)
		.controller("CSVController", ["$scope", "$timeout", "ServiceFactory", CSVControllerFn]);

	/** @description Controller definition **/
	angular.module(designerModules.module.DesignerPropertyManager)
		.controller("ExcelController", ["$scope", "$timeout", "ServiceFactory", "XLSXReaderService", ExcelControllerFn]);

	/** @description Controller definition **/
	angular.module(designerModules.module.DesignerPropertyManager)
		.controller("WebserviceController", ["$scope", "$timeout", "ServiceFactory", WebserviceControllerFn]);

	/** @description Controller definition **/
	angular.module(designerModules.module.DesignerPropertyManager)
		.controller("PAController", ["$scope", "$timeout", "ServiceFactory", PAControllerFn]);

	/** @description Controller definition **/
	angular.module(designerModules.module.DesignerPropertyManager)
		.controller("DataSheetController", ["$scope", "$timeout", "ServiceFactory", DataSheetControllerFn]);

	/** @description Controller definition **/
	angular.module(designerModules.module.DesignerPropertyManager)
		.controller("DSController", ["$scope", "$timeout", "ServiceFactory", DSControllerFn]);

	/** @description Controller definition **/
	angular.module(designerModules.module.DesignerPropertyManager)
		.controller("WSController", ["$scope", "$timeout", "ServiceFactory", WSControllerFn]);

	/** @description Controller definition **/
	angular.module(designerModules.module.DesignerPropertyManager)
		.controller("DdataController", ["$scope", "$timeout", "ServiceFactory", DdataControllerFn]);

})();
//# sourceURL=DPController.js