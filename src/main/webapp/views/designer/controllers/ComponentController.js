/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: ComponentController.js
 * @description Component Attribute Controller
 */
(function () {
	/** Controller function for WidgetsLibrary
	 * @param  {Object} $scope         The scope object
	 * @param  {Object} ServiceFactory The ServiceFactory
	 * @return {undefined}                   undefined
	 */
	var componentControllerFn = function ($scope, ServiceFactory) {
		$scope.types = [{
				"value" : "all",
				"label" : "All",
				"header" : "Components"
			}, {
				"value" : "chart",
				"label" : "Charts",
				"header" : "Charts"
			}, {
				"value" : "container",
				"label" : "Containers",
				"header" : "Containers"
			}, {
				"value" : "datagrid",
				"label" : "Grids",
				"header" : "Grids"
			}, {
				"value" : "filter",
				"label" : "Filters",
				"header" : "Filters"
			}, {
				"value" : "singleValuedComponent",
				"label" : "Others",
				"header" : "Others"
			}
		];
		$scope.cat = $scope.types[0];
		
		/** @description service will fetch the configuration JSON for the dragged component **/
		ServiceFactory.getJsonFileData("./resources/data/Components.data", function (data) {
			$scope.allComponentData = data;
			$scope.componentData = data;
//			$("select#typeCombo").val("All");
		});
		
		/**
		 * Set the data for dragged item
		 * @param  {Object} ev The event object
		 */
		$scope.drag = function (ev) {
			ev.dataTransfer.setData("text", ev.target.id);
		};
		
		/**
		 * Checks for the available component in the list
		 * @param  {Object}  component The component object
		 * @return {Boolean}           true if found else false
		 */
		$scope.isComponentInList = function (component) {
			if ($scope.query == undefined) {
				return true;
			}
			return (component.name.toLowerCase()).indexOf($scope.query.toLowerCase()) > -1;
		};

		/**
		 * This method will update the component data according to selection in filter
		 * @param  {String} componentType Type of the component
		 */
		$scope.filterComponentData = function (componentType) {
			var allcomps = $scope.allComponentData;
			if (componentType != "all") {
				var comp = [];
				for (var i = 0; i < allcomps.length; i++) {
					if (allcomps[i].type == componentType)
						comp.push(allcomps[i]);
				}
				$scope.componentData = comp;
			} else {
				$scope.componentData = allcomps;
			}
		};
	};

	/** @description Controller definition **/
	angular.module(designerModules.module.DesignerPropertyManager)
	.controller("ComponentController", ["$scope", "ServiceFactory", componentControllerFn]);

})();
//# sourceURL=ComponentController.js