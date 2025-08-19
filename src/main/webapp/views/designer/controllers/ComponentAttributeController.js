/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: ComponentAttributeController.js
 * @description Component Attribute Controller
 */
(function () {
	/** Controller function for Dashboard Components
	 * @param  {Object} $scope        	The scope object
	 * @param  {Object} timeout 		The Timeout
	 * @param  {Object} ServiceFactory 	The ServiceFactory
	 * @return {undefined}              undefined
	 */
	var UserScriptControllerFn = function ($scope, $timeout, ServiceFactory) {
		$scope.varAs = "COMPONENT";
		$scope.showCompSearch = false;
		$scope.showConnSearch = false;
		$scope.uiActive = { "variable": {} };

		/**
		 * Show the search box for component or connection
		 * @param  {String} _for The type of object
		 */
		$scope.showSearchField = function (_for) {
			switch (_for) {
				case "COMPONENT":
					if ($scope.showCompSearch) {
						$scope.compSearch = "";
						$scope.showCompSearch = false;
					} else {
						$scope.showCompSearch = true;
						$timeout(function () {
							$("#vCompSearch").focus();
						}, 10);
					}
					break;
				case "CONNECTION":
					if ($scope.showConnSearch) {
						$scope.connSearch = "";
						$scope.showConnSearch = false;
					} else {
						$scope.showConnSearch = true;
						$timeout(function () {
							$("#vConnSearch").focus();
						}, 10);
					}
					break;
				default:
					break;
			}
		};
		
		/** Sort configuration for connections explorer */
		$scope.connSortCfg = {
			axis: "y",
			tolerance: "pointer",
			containment: "parent",
			cursor: "move",
			revert: true,
			placeholder: "s-o-p-h",
			scroll: true,
			handle: ".connReorderDragDiv",
			start: function( e, ui ) {
				$scope.oldConnIndex = ui.item.index();
			},
			stop: function( e, ui ) {
				var newIndex = ui.item.index();
				$timeout( function() {
					$scope.updateConnindex( $scope.oldConnIndex, newIndex );
				}, 0 );
			}
		};
		/**
		 * Updates the order of connections in UI and order of connections in dashboard json,
		 * connections will be loaded in the order they appear in dashboard json
		 * @param  {Number} oldConnIndex (start event)
		 * @param  {Number} newConnIndex (stop event)
		 * @return {undefined}          undefined
		 */
		$scope.updateConnindex = function( oldConnIndex, newConnIndex ) {
			var connObjects = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.DataURL;
			if(connObjects && connObjects.length > 0){
				Array.prototype.move = function ( old_index, new_index ) {
					var isIndexOutOfBound = false;
					if( new_index >= this.length ) {
						var k = new_index - this.length;
						isIndexOutOfBound = true;
						while( ( k-- ) + 1 ) {
							this.push( undefined );
						}
					}
					this.splice( new_index, 0, this.splice( old_index, 1 )[ 0 ] );
					/** Removed undefined or null value from component list array. 
					 * some jquery index() method return wrong index value, when move component to end of the component array list position*/
					if( isIndexOutOfBound ) {
						var list = JSON.parse(JSON.stringify(this));
						this.splice(0,this.length);
						for (var j = 0; j < list.length; j++){
							if (list[j] !== undefined && list[j] !== null) {
								this.push(list[j]);
							}
						}
					}
				};
				connObjects.move(oldConnIndex, newConnIndex);
			}
		};
		
		/**
		 * refresh the component attribute list
		 */
		$scope.resetComponentAttributesList = function () {
			$scope.modal.cm.refresh();
//			$scope.setSelectedVariable($scope.modal.selectedDashboard.json.Dashboard.AbsoluteLayout.Object[0])
		};

		/** 
		 * set an item as selected
		 * @param  {[type]} $selector jQury object]
		 */
		$scope.appearAsSelectedVariableList = function ($selector) {
			$(".var-list").removeClass("active-workspace");
			$selector.addClass("active-workspace");
		};
		/** 
		 * Adds dataset settings button to the component list
		 * @param {String} cid is the component id 
		 */
		$scope.addDatasetBtnOnComponents = function (cid) {
			$scope.modal.isDatasetEnabled = IsBoolean($scope.getComponentbyId(cid).isDataSetAvailable);
			return $scope.modal.isDatasetEnabled;
		};
		
		/** 
		 *  Properties button SingleClick Handler
		 */
		$scope.dashboardPropertiesBtnClickHandler = function () {
			$scope.createPropertyPalette($scope.modal.selectedDashboard.id, true);
		};
		/**
		 * This function will activate the selected variable
		 * @param {Object} e     event
		 * @param {Object} vObj  variable object
		 * @param {String} vType variable type
		 * @return {undefined} undefined
		 */
		$scope.setSelectedVariable = function( e, vObj, vType ) {
			var
			
			/**
			 * Selects the component temporarly
			 * @param  {Boolean} isLocked Flag for locked component
			 * @param  {String}  cId      Component id
			 */
			temporarySelectComponent = function( isLocked, cId ) {
				$scope.deselectAllComponent();
				$scope.modal.selectedComponentId = cId;
				$scope.modal.selectedComponentContainer = "#" + $scope.modal.selectedDashboard.id;
				$scope.addToSelectedComponentList(cId);
				if( !IsBoolean( isLocked ) ) {
					$timeout( function() {
						$scope.displayAsSelected( cId );
						$scope.showResizableHandles( cId );
						$scope.showSettingsBtn( cId );
					}, 0 );
				}
				$timeout( $scope.$apply.bind( $scope ) );
			},
			
			/**
			 * Handles variable selection as component
			 * @param  {Object} compObj The component object
			 */
			handleComponentAsVarable = function( compObj ) {
				var cId = compObj[ "objectID" ];
				if( cId ) {
					$scope.selectedVariable = compObj[ "variable" ];
					$scope.varAs = "COMPONENT";
					temporarySelectComponent( compObj[ "showLocked" ], cId );
					$scope.resetFunctionWindow( undefined, true, vType );
					$scope.fetchAttributes( vObj );
					$scope.modal.scriptFor = compObj[ "objectName" ];
					$scope.populateGvarDefaultValueList();
//				    $scope.appearAsSelectedVariableList( $( "#compAttributesCompLi_" + compObj[ "objectName" ] ) );
					displayActive( compObj );
				}
			}, 
			
			/**
			 * Handles variable selection as connection
			 * @param  {Object} connObj The connection object
			 */
			handleConnectionAsVarable = function( connObj ) {
				$scope.selectedVariable = connObj[ "variable" ];
				$scope.varAs = "CONNECTION";
				$scope.modal.scriptFor = connObj[ "connectionName" ];
				$scope.resetFunctionWindow( undefined, false, vType );
				$scope.populateGvarDefaultValueList();
//				        $scope.appearAsSelectedVariableList( $( "#compAttributesConnLi_" + connObj[ "id" ] ) );
				displayActive( connObj );
			},
			
			/**
			 * Handles variable selection as dashboard
			 */
			handleDashboardAsVarable = function() {
				$scope.selectedVariable = null;
				$scope.varAs = "Dashboard";
				$scope.modal.scriptFor = "Dashboard";
				$scope.resetFunctionWindow( undefined, false, vType );
//				$scope.appearAsSelectedVariableList( $( "#compAttributesDashboard" ) );
				displayActive( "Dashboard" );
			},
			
			/**
			 * Show as active
			 * @param  {Object} varObj The variable object
			 */
			displayActive = function( varObj ) {
				if( varObj ) {
					if( typeof ( varObj ) == "object" ) {
						$scope.uiActive.dashboard = false;
						$scope.uiActive.variable.isUiActiveCA = false;
						varObj.isUiActiveCA = varObj.isUiActiveCA || true;
						$scope.uiActive.variable = varObj;
					}
					else {
						$scope.uiActive.variable.isUiActiveCA = false;
						$scope.uiActive.dashboard = true;
					}
				}
			};
			if( vType ) {
				try {
					switch( vType ) {
						case "Component":
							$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object.map(function(obj){
								if(obj && obj != null){
									obj.isUiActiveCA = false;
								}
							});
							handleComponentAsVarable( vObj );
							break;
						case "Connection":
							handleConnectionAsVarable( vObj );
							break;
						case "Dashboard":
							handleDashboardAsVarable();
							break;
						default:
							$scope.selectedVariable = null;
							break;
					}
				}
				catch( error ) {
					console.error( error );
				}
				finally {
					$timeout(function () {
						$scope.modal.cm.refresh();
						$scope.modal.cm.focus();
					}, 10);
					$('.nav-tabs a[href="#scriptContent"]').closest( "li" ).removeClass( "active" );
					$('.nav-tabs a[href="#scriptContent"]').tab("show");
					$(".c-group").removeClass("selected-group");
				}
			}
		};

		/**
		 * Gets the component attributes details
		 * @param  {Object} comp The component object
		 * @returns {undefined} undefined
		 */
		$scope.fetchAttributes = function (comp) {
			if (comp[comp["subElement"]]["DataSet"]) {
				var fields = comp[comp["subElement"]]["DataSet"]["Fields"];
				$scope.checkAndFill(fields);
			} else if (!IsBoolean(comp.isDataSetAvailable) || IsBoolean(comp.isValueFieldsAvailable)) {
				var fieldName = comp[comp["subElement"]]["fieldName"];
				if (fieldName != undefined) {
					$scope.checkAndFill([{ "Name" : fieldName } ]);
				}
			}
		};

		/**
		 * Checks for the attributes and the assign value
		 * @param  {Array} fields The list of fields
		 */
		$scope.checkAndFill = function (fields) {
			var defValueArray = [];
			var defaultValues = angular.copy($scope.selectedVariable["DefaultValues"]["DefaultValue"]);
			$scope.selectedVariable.DefaultValues.DefaultValue = [];
			$scope.modal.selectedVariableDefaultValue = "";
			if(fields){
				for (var i = 0; i < fields.length; i++) {
					var field = fields[i];
					var item = DesignerUtil.prototype.findInArray(defaultValues, "name", field["Name"])
					if (item == undefined) {
						var displayTag = $scope.selectedVariable.Key + "." + field.Name;
						$scope.pushToDefaultValues(field.Name, "", displayTag, displayTag);
					} else {
						var displayTag = item.displayTag;
						var re = new RegExp("\{(.*?)\}");
						var matchedString = (item.actualTag).match(re);
						var actualTag = matchedString[1];
						$scope.pushToDefaultValues(field.Name, item.text, displayTag, actualTag);
					}
				}
			}
		};

		/**
		 * Deletes an attribute
		 * @param  {String} attr The attribute name
		 */
		$scope.deleteAttribute = function (attr) {
			var index = $scope.selectedVariable.DefaultValues.DefaultValue.indexOf(attr)
			$scope.selectedVariable.DefaultValues.DefaultValue.splice(index, 1);
		};

		/**
		 * Creates a new attribute
		 */
		$scope.createNewAttribute = function () {
			if ($scope.modal.selectedDashboard != "") {
				$scope.showModelPopup('gvarAddAttrModal');
			} else {
				ServiceFactory.showNotification("No dashboard found", "alert-success", 3000);
			}
		};
		
		/**
		 * Callback function, called when new attribue is added
		 */
		$scope.onNewAttributeAdd = function () {
			var item = DesignerUtil.prototype.findInArray($scope.selectedVariable["DefaultValues"]["DefaultValue"], "name", $scope.newAttributeName);
			if (item == undefined){
				$scope.pushToDefaultValues($scope.newAttributeName, $scope.newAttributeValue, $scope.selectedVariable.Key.$scope.newAttributeName, $scope.selectedVariable.Key.$scope.newAttributeName);
			}else{
				item.value = $scope.newAttributeValue;
			}
		};

		/**
		 * Updates the selected variable JSON
		 * @param  {String} name       The default value name
		 * @param  {String} value      The value
		 * @param  {String} displayTag The display tag name
		 * @param  {String} actualTag  The actual tag name
		 */
		$scope.pushToDefaultValues = function (name, value, displayTag, actualTag) {
			if(DesignerUtil.prototype.findInArray($scope.selectedVariable.DefaultValues.DefaultValue,"name",name) == undefined){
				var defval = $scope.getNewDefaultValueJson();
				defval.name = name;
				defval.text = value;
				defval.displayTag = displayTag;
				defval.actualTag = "{" + actualTag + "}";
				defval.actualTagForLabels = "[" + actualTag + "]";
				$scope.selectedVariable.DefaultValues.DefaultValue.push(defval);
				$scope.modal.selectedVariableDefaultValue = $scope.selectedVariable.DefaultValues.DefaultValue;
			}
		};
		
		/**
		 * Gets a fresh object of variable
		 * @param  {Object} newObject The new object for default value
		 */
		$scope.getNewDefaultValueJson = function (newObject) {
			return angular.copy($scope.modal.selectedDashboard.json.GlobalVariable_Variable_DefaultValues_DefaultValue, newObject);
		};

		/**
		 * Show the script help page
		 */
		$scope.showDashboardScript = function () {
			$('.nav-tabs a[href="#scriptContent"]').tab("show");
		};
		
		/**
		 * Search the component by its name
		 * @param  {Object}  component The component object
		 * @return {Boolean}           true if found else false
		 */
		$scope.isComponentInCompList = function (component) {
			if ($scope.compSearch == undefined) {
				return true;
			}
			return (component.referenceID.toLowerCase()).indexOf($scope.compSearch.toLowerCase()) > -1;
		};
		
		/**
		 * Search the connection by its name
		 * @param  {Object}  conn The connection object
		 * @return {Boolean}      true if found else false
		 */
		$scope.isConnInConnList = function (conn) {
			if ($scope.connSearch == undefined) {
				return true;
			}else{
				return (conn.connectionName.toLowerCase()).indexOf($scope.connSearch.toLowerCase()) > -1;
			}
		};
		/**
		 * Initialize the component attribute window
		 */
		$scope.initComponentAttribute = function() {
			$scope.uiActive = {
				variable: {
					isUiActiveCA: false
				},
				dashboard: false
			};
		};
		
		/**
		 * print  method for testing attributes value
		 * @param  {Object} obj The object
		 */
		$scope.printer = function (obj) {
		};
	};

	/** @description Controller definition **/
	angular.module(designerModules.module.UserScriptManager)
	.controller("ComponentAttributeController", ["$scope", "$timeout", "ServiceFactory", UserScriptControllerFn	])

})();
//# sourceURL=ComponentAttributeController.js