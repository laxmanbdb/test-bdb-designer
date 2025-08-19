/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: DesignerFactory.js
 * @description factory class for operations across designer 
 * **/
(function () {
    var designerFactoryFn = function ($rootScope) {
        var services = {};

        services.xhrCounter = 0;
        services.xhrInProgress = false;
        services.isDatasetEnabled = false;
        services.isScriptEnabled = false;
        services.dbCreationInProgress = false;
        services.wsObj = {};

        services.dashboards = [];
        services.dashboardTabs = [];
        services.selectedDashboardContainer = "";
        services.selectedDashboard = "";
        services.objectListChange = 0;
        services.usersPortalPreference = "";
        services.rawComponentJSONlist = {};
        services.propertyJson = {};
        services.propertyJsonList = {};
        services.propertyData = {};
        services.compMetaData = {};

        services.selectedComponent = {};
        services.selectedComponentId = "";
        services.selectedVariableDefaultValue = "";
        services.selectedComponentContainer;

        services.listOfSelectedComponents = [];
        services.userDataSourceList = {
            "web" : "",
            "pa" : "",
            "ds" : "",
            "datasheet" : ""
        };
        services.objectsList = [];
        services.historyProperties = {};

        /** DashboardAction config object **/
        services.dashActionConfig = {};
        
        /** Calc field config object **/
        services.calcFieldConfig = {};
        
        /** publish modal config object **/
        services.publishDbConfig = {};
        
        /** Connections config object **/
        services.connectorConfig = {};
        
        /** Add keys when popup is enabled so useless watchers will not be created **/
        services.modelPopupStatus = {};
        
        /**LKD DAS-408 global theme modal config object **/
        services.globalThemeDbConfig = {};
        
        // it will used to call a method of one controller from another controller
        services.prepForBroadcast = function () {
            $rootScope.$broadcast("getJsonFromOpenDashoardAndDrawComponent");
        };
        services.createHistoryProperties = function (dashboardID) {
            services.historyProperties[dashboardID] = {
                "historyStack" : [],
                "historyActiveStack" : [],
                "compHistory" : [],
                "historyStackPointer" : -1,
                "skipHistoryRegister" : false,
                "historyLength" : 100,
            };
        };
        services.currentHistoryProperties = function (historyPropertyObject) {
            return historyPropertyObject == undefined ? services.historyProperties[services.selectedDashboard.id] : services.historyProperties[services.selectedDashboard.id] = historyPropertyObject;
        };
        services.removeHistoryProperties = function (dashboardID) {
            services.historyProperties[dashboardID] = undefined;
        };
        services.selectedDashboardHistoryProperties = function (property, value) {
            return value == undefined ? services.historyProperties[services.selectedDashboard.id][property] : services.historyProperties[services.selectedDashboard.id][property] = value;
        };

        /**
         * @function
         * @description checks whether argument is an array or not
         * @param { any } arg0 - The argument to check
         * @author EID201
         **/
        services.isArray = function (arg0) {
            var checkStatus = false;
            if (arg0) {
                checkStatus = Object.prototype.toString.call(arg0) === "[object Array]";
            }
            return checkStatus;
        };

        /**
         * @function
         * @description checks whether argument is an array or not
         * @param { any } _array - The array for checking
         * @param { any } _item - The array to be checked
         * @author EID201
         **/
        services.isArrayContains = function (_array, _item) {
            var checkStatus = false;
            if (services.isArray(_array)) {
                checkStatus = _array.indexOf(_item) != -1 ? true : false;
            }
            return checkStatus;
        };

        services.notifyObjectListChange = function () {
            services.objectListChange++;
            services.refreshAllObjectList();
            services.updateDashboardStatus(1);
        };
        services.notifyConnectionListChange = function () {
            services.refreshAllObjectList();
        };

        services.getSelectedDashboardId = function () {
            return services.selectedDashboard.id;
        };

        services.refreshAllObjectList = function () {
            var isVarAvailable = false;
            services.selectedDashboard.objectsList = [];
            angular.forEach(services.selectedDashboard.json.Dashboard[services.layoutType].Object, function (object) {
                if (object && typeof(object) === "object") {
                    services.selectedDashboard.objectsList.push({
                        "name" : object.objectName,
                        "id" : object.objectID,
                        "refId" : object.referenceID
                    });
                }
            });
            angular.forEach(services.selectedDashboard.json.Dashboard.DataProviders.DataURL, function (object) {
                if (object && typeof(object) == "object") {
                    services.selectedDashboard.objectsList.push({
                        "name" : object.connectionName,
                        "id" : object.id,
                        "refId" : object.id
                    });
                }
            });

            services.dashVarMap[services.getSelectedDashboardId()] = [];
            services.dashVarMap[services.getSelectedDashboardId()].push("sdk");
            services.dashVarMap[services.getSelectedDashboardId()].push("changedItem");
            angular.forEach(services.selectedDashboard.objectsList, function (varObj) {
                var objToPush = varObj.name + " >> '" + varObj.refId + "'";
                services.dashVarMap[services.getSelectedDashboardId()].push(objToPush);
                if (varObj.name === services.scriptFor) {
                    isVarAvailable = true;
                }
            });
            if (!isVarAvailable) {
                services.scriptFor = "";
            }

            //          angular.forEach( services.selectedDashboard.objectsList, function( varObj ) {
            //              var objToPush = varObj.name + " >> '" + varObj.refId + "'";
            //              if( !services.isArrayContains( services.dashVarMap[ services.getSelectedDashboardId() ], objToPush ) ) {
            //                  services.dashVarMap[ services.getSelectedDashboardId() ].push( objToPush );
            //              }
            //
            //              if( varObj.name === services.scriptFor ) {
            //                  isVarAvailable = true;
            //              }
            //          });
            //          if( !isVarAvailable ) {
            //              services.scriptFor = "";
            //          }
        };

        /**
         * @function
         * @description - Added to refresh DataSet from DataSource refresh or delete
         * @author UNKNOWN
         * @modified_by EID201
         * */
        // Description : Update this Method for refresh Chart DataSet, when change the selected file/Services.
		// Author : Lakhan
		services.refreshDataUrlAvailableDataSet = function() {
			var associatedDataset;
			try{
				associatedDataset = services.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.AssociatedDataSet;
				for( var i = 0; i < associatedDataset.length; i++ ) {
					angular.forEach(services.selectedDashboard.json.Dashboard.AbsoluteLayout.Object, function (object) {
						if (object && typeof(object) === "object") {
							if(object.referenceID==associatedDataset[ i ][ "component" ]){
								object[object.subElement].DataSet.Fields=[];
							}
						}
					});
				}
			}
			catch( error ){
				console.error( error );
			}
		};
		
		// Description : If we taking same service/file after changes (add/delete/update) column. then related field remove from Chart Dataset.
		// Author : Lakhan
		services.removeChangedFieldFromAvailableDataSet = function(fields, calcFields) {
			var associatedDataset;
			try{
				 associatedDataset = services.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.AssociatedDataSet;
					for( var i = 0; i < associatedDataset.length; i++ ) {
						angular.forEach(services.selectedDashboard.json.Dashboard.AbsoluteLayout.Object, function (object) {
							if (object && typeof(object) === "object") {
								if(object.referenceID == associatedDataset[ i ][ "component" ]){
									var associatedFieldObject = (object[object.subElement].DataSet.Fields);
									angular.forEach(associatedFieldObject,function(object){			
										var index = fields.map(function(field){return field.name;}).indexOf(object.Name);
										var cIndex = calcFields.map(function(cfield){return cfield.name;}).indexOf(object.Name);
										if(index == -1 && cIndex == -1){
											var currentIndex = associatedFieldObject.indexOf(object);
											associatedFieldObject.splice(currentIndex, 1);
											services.removeChangedFieldFromAvailableDataSet(fields, calcFields);
										}
									});
								}
							}
						});
					}
			}
			catch( error){
				console.error( error );
			}
		};
		
        services.removeFromDataUrlAvailableDataSet = function (dataset) {
            //removed when DataSet refreshed its connection
            var index = services.selectedDatasource.AssociatedDataSet.indexOf(dataset);
            services.selectedDatasource.AssociatedDataSet.splice(index, 1);
        };
        services.removeDataSetFromComponentObjects = function (_connectionId) {
            var selectedConnection = DesignerUtil.prototype.findInArray(services.selectedDashboard.json.Dashboard.DataProviders.DataURL, "id", _connectionId);
            if (selectedConnection) {
                var associatedDataSet = selectedConnection.AssociatedDataSet;
                if (associatedDataSet) {
                    for (var i = 0; i < associatedDataSet.length; i++) {
                        associatedDataSet[i].component["DataSet"] = "";
                    }
                }
            }
        };
        services.removeFieldFromDataSet = function (fieldName,con) {
        	var associatedDatasets = services.selectedDashboard.json.Dashboard.AbsoluteLayout.Object;
            for (var i = 0; i < associatedDatasets.length; i++) {
            	var componentName = associatedDatasets[i].subElement;
            	if(associatedDatasets[i][componentName]["DataSet"] != undefined){
            		for (var j = 0; j < associatedDatasets[i][componentName]["DataSet"].Fields.length; j++) {
                        if (associatedDatasets[i][componentName]["DataSet"].Fields[j].Name == fieldName && associatedDatasets[i][componentName]["DataSet"].dataSource === con) {
                            var index = associatedDatasets[i][componentName]["DataSet"].Fields.indexOf(associatedDatasets[i][componentName]["DataSet"].Fields[j]);
                                associatedDatasets[i][componentName]["DataSet"].Fields.splice(index, 1);
                        }
                    }
            	}
            }
        };

        services.removeDatafromOfflineData = function (connectionID) {
            var data = services.selectedDashboard.json.Dashboard.OffLineData.Data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == connectionID) {
                    var index = services.selectedDashboard.json.Dashboard.OffLineData.Data.indexOf(data[i]);
                    services.selectedDashboard.json.Dashboard.OffLineData.Data.splice(index, 1);
                    break;
                }
            }
        };

        services.removeDatasetExpressions = function (connectionID) {
            var DatasetExpressions = angular.copy(services.selectedDashboard.json.Dashboard.DatasetExpressions.DatasetExpression);
            for (var i = 0; i < DatasetExpressions.length; i++) {
                if (DatasetExpressions[i].dataSource == connectionID) {
                    var index = services.selectedDashboard.json.Dashboard.DatasetExpressions.DatasetExpression.indexOf(DatasetExpressions[i]);
                    services.selectedDashboard.json.Dashboard.DatasetExpressions.DatasetExpression.splice(index, 1);
                }
            }
        };

        services.getUniqueComponentID = function () {
            var proposedNewID = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0,
                    v = c == "x" ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            proposedNewID = global.componetIDPrefix + proposedNewID;
            return proposedNewID;
        };
        services.getUniqueReference = function (shortName) {
            var proposedNewName = shortName + (services.getSelectedDashboardsComponentCount() * 1 + 1);
            var flag = services.checkIDUsed(services.selectedDashboard.json.Dashboard.AbsoluteLayout.Object, "referenceID", proposedNewName);
            while (flag) {
                proposedNewName = shortName + "_" + randomChar(2);
                flag = services.checkIDUsed(services.selectedDashboard.json.Dashboard.AbsoluteLayout.Object, "referenceID", proposedNewName);
            }
            return proposedNewName;
        };

        services.checkIDUsed = function (objectArray, attributeName, proposedNewID) {
            if (objectArray) {
                for (var j = 0; j < objectArray.length; j++) {
                	if (objectArray[j] && objectArray[j][attributeName] == proposedNewID) {
                        return true;
                    }
                }
            }
            return false;
        };
        services.getSelectedDashboardsComponentCount = function () {
            return services.selectedDashboard.json.Dashboard.AbsoluteLayout.Object.length;
        };
        services.getSelectedDashboardsConnectionCount = function () {
            return services.selectedDashboard.json.Dashboard.DataProviders.DataURL.length;
        };

        services.getUniqueConnectionID = function (shortName) {
            var proposedNewID = shortName + "_" + (services.getSelectedDashboardsConnectionCount() * 1 + 1);
            var flag = services.checkIDUsed(services.selectedDashboard.json.Dashboard.DataProviders.DataURL, "id", proposedNewID);
            while (flag) {
                proposedNewID = shortName + "_" + randomChar(2);
                flag = services.checkIDUsed(services.selectedDashboard.json.Dashboard.AbsoluteLayout.Object, "objectID", proposedNewID);
            }
            return proposedNewID;
        };
        services.getfieldSetFromConnection = function (connectionID) {

            var temp = $.grep(services.selectedDashboard.json.Dashboard.DataProviders.DataURL, function (n) {
                    if (n.id == connectionID) {
                        return (n);
                    }
                });
            if (temp[0] != undefined) {
                return temp[0]["FieldSet"];
            } else {
                return undefined;
            }
        };
        services.getCalculatedFieldSetFromConnection = function (connectionID) {

            var temp = $.grep(services.selectedDashboard.json.Dashboard.DataProviders.DataURL, function (n) {
                    if (n.id == connectionID) {
                        return (n);
                    }
                });
            if (temp[0] != undefined) {
                return temp[0]["calculatedFieldList"];
            } else {
                return undefined;
            }
        };
        services.getDatasetFromComponent = function (componentID) {

            var temp = $.grep(selectedDashboard.json.Dashboard.AbsoluteLayout.Object, function (n) {
                    if (n.id == componentID) {
                        return (n);
                    }
                });
            if (temp[0] != undefined) {
                return temp[0]["Chart"]["Dataset"];
            } else {
                return undefined;
            }
        };
        /*Call this method whenever user made a change on dashboard, connection change, property change script change etc */
        services.updateDashboardStatus = function (status) {
            if (services.selectedDashboard != undefined) {
                services.selectedDashboard["json"]["changeStatus"] = status;
            }
        };
        /** dashboard name/ workspace name **/
        services.replaceSpecialCharWithUnderscore = function(str){
			/* Accepted A-Za-z0-9!@#$%^&() _+~`;.,
			 * Not Accepted  \/*=:<>?|{}[]"'- */
			try{
				return str.replace(/[\/\\\[\]'"*=:<>?|{}-]/g, '_');
			}catch(e){
				return str;
			}
		};
		/** Calc field **/
        services.replaceCFSpecialCharWithUnderscore = function(str){
			/* Accepted A-Za-z0-9 _
			 * Not Accepted  \/*=:<>?|{}[]"'-~`!@#$%^&()+;,. */
			try{
				return str.replace(/[\/\\\[\]'"*=:<>?|{}-~`!@#$%^&()+;,.]/g, '_');
			}catch(e){
				return str;
			}
		};
		
        services.selectedConnection = "";
        services.selectedDataURL = "";
        services.selectedOffLineData = "";
        services.selectedDataSource = "";
        services.selectedQueryService = "";
        services.dataSourceQueryMap = [];
        
        /** Service level parameters, used in designer controllers, should be initialized once only **/
		services.selectedWorkspaceIdForSave = "";
		services.wsObjForSave = {};
		services.dbInsideWs = [];
		services.newWorkspaceName = "Untitled Workspace";
		services.dashboardSpaceMsg = "No dashboard found !";
		services.workspaceSpaceMsg = "No Workspace found !";
		services.dashboardSpaceHeader = "Dashboards";
		services.workSpaceHeader = "Workspaces";
		services.bgGridSize = 10;
		services.databackdrop = "static";
		services.userPreference = {
			compSelcOpts: {thickness: 1, color: "#999999"},
			defaultSettings: {
				blockNotificaton: true,
				dashboardBackgroundColor: "#FFFFFF",
				dashboardBorderColor: "#08AEA8",
				dashboardBorderThickness: 1,
				dashboardHeight: 566,
				dashboardWidth: 929,
				fixedDashboardDimensions: false,
				gridLinesColor: "#CCCCCC",
				hideShadow: true,
				language: "en-US",
				notifyOnSuccess: true,
				showDashboardBorder: true,
				syncComponentProperty: false,
				showSettingsButton: true
			},
			display: true,
			showGridLines: false,
			snapToGrid: {enable: "true", size: 1}		
		};
		services.layoutType = "AbsoluteLayout";
		services.newDir = false;

        return services;
    };
    
	angular.module("designer")
	.factory("DesignerFactory", [ "$rootScope", designerFactoryFn ] );
	
})();
//# sourceURL=DesignerFactory.js