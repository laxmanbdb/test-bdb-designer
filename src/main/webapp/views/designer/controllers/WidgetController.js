/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: WidgetController.js
 * @description It controls widgets in the component tray
 * **/
(function () {
	/** Controller function for WidgetsLibrary
	 * @param  {Object} $scope         The scope object
	 * @param  {Object} ServiceFactory The ServiceFactory
	 * @return {undefined}                   undefined
	 */
	var widgetControllerFn = function ($scope, ServiceFactory) {
		$scope.wGroups = [];
		$scope.widgets = [];
		$scope.allWidgets = [];
		$scope.charts = [];
		$scope.advCharts = [];
		$scope.grids = [];
		$scope.filters = [];
		$scope.others = [];
		$scope.active = false;
		$scope.activeGroupId = "";
		$scope.draggedItem = {};
		$scope.search = "";
		$scope.searchFound = true;
		$scope.searchActive = false;
		$scope.view = {};
		$scope.WILD_CARD = {
			ALL_COMPONENTS : "*",
			ALL_CHARTS : "*chart"
		};

		/**
		 * @description It'll be called when WidgetController will load.
		 * */
		$scope.initWidgets = function () {
			var widgetDataPath = "./resources/data/widgets.data",
    			onGetData = function (data) {
    				$scope.wGroups = data.wGroups;
    				$scope.prepareAllWidgets();
    				$scope.showCharts();
    			};
			$scope.view = {
		        viewIcon : "nt-apps-icon",
		        isListView : false
			};
			ServiceFactory.getJsonFileData( widgetDataPath, onGetData );
		};
		
		/**
         * @description It'll display the CHARTS group widgets
         * */
		$scope.showCharts = function() {
		    var repeater = setInterval( function() {
                var chartGroup = angular.element( $( "#CHARTS" )[ 0 ] );
                if( chartGroup.length ) {
                    chartGroup.trigger( "click" );
                    $(".group-widget-separator").find(".pointer").css("left", 20);
//                    $( '[data-toggle="tooltip"]' ).tooltip( "show" );
                    clearInterval( repeater );
                }
            }, 100 );
		};

		/**
		 * @description It'll switch the view of components display
		 * */
		$scope.switchView = function () {
			if ($scope.view.isListView) {
				$scope.view.isListView = false;
				$scope.view.viewIcon = "nt-apps-icon";
			} else {
				$scope.view.isListView = true;
				$scope.view.viewIcon = "nt-chart-list-icon";
			}
		};
		/**
		 * @description It'll loop through all widget groups and prepares the complete widget list.
		 * */
		$scope.prepareAllWidgets = function () {
			for (var i = 0; i < $scope.wGroups.length; i++) {
				switch ($scope.wGroups[i]["gId"]) {
				case "CHARTS":
					$scope.charts = $scope.wGroups[i]["gItems"];
					$scope.allWidgets = $.merge($scope.allWidgets, $scope.charts);
					break;
				case "GRIDS":
					$scope.grids = $scope.wGroups[i]["gItems"];
					$scope.allWidgets = $.merge($scope.allWidgets, $scope.grids);
					break;
				case "FILTERS":
					$scope.filters = $scope.wGroups[i]["gItems"];
					$scope.allWidgets = $.merge($scope.allWidgets, $scope.filters);
					break;
				case "ADV_CHARTS":
					$scope.advCharts = $scope.wGroups[i]["gItems"];
					$scope.allWidgets = $.merge($scope.allWidgets, $scope.advCharts);
					break;
				case "OTHER":
					$scope.others = $scope.wGroups[i]["gItems"];
					$scope.allWidgets = $.merge($scope.allWidgets, $scope.others);
					break;
				default:
					break;
				}
			}
		};

		/**
		 * @description It'll fill-up the widgets for display
		 * @param { object } evt - The event object
		 * @param { object } wGr - The widgetGroup object
		 * */
		$scope.displayWidgets = function (evt, wGr) {
			if (evt) {
			    evt.stopPropagation();
				$scope.displayAsCurrent(evt);
				$scope.movePointer(evt);
			}

			$scope.activeGroupId = wGr.gId;
			$scope.widgets = wGr.gItems;
			wGr.disabled = false;
			$scope.searchFound = true;
			$scope.search = "";
			$scope.searchActive = false;
			$scope.disableOtherGroups(wGr);
		};

		/**
		 * @description It'll display as selected the current clicked widget group.
		 * @param { object } evt - The event object
		 * */
		$scope.displayAsCurrent = function (evt) {
			$scope.removeSelection();
			$(evt.currentTarget).find(".highlighter").addClass("current");
		};

		/**
		 * @description It'll turn to un-selected state for all widget group
		 * */
		$scope.removeSelection = function () {
			$(".highlighter").removeClass("current");
		};

		/**
		 * @description It'll disabled other groups which is not active
		 * @param { object } wGr - The clicked widget group
		 * */
		$scope.disableOtherGroups = function (wGr) {
			for (var i = 0; i < $scope.wGroups.length; i++) {
				if (wGr.gId != $scope.wGroups[i].gId) {
					$scope.wGroups[i].disabled = true;
				}
			}
			$scope.active = true;
		};

		/**
		 * @description It'll enable all widget group
		 * */
		$scope.enableAllGroups = function () {
			for (var i = 0; i < $scope.wGroups.length; i++) {
				$scope.wGroups[i].disabled = false;
			}
			$scope.active = false;
		};

		/**
		 * @description It'll prepare the helper of dragged component
		 * @param { object } w - The widget object
		 * */
		$scope.setDraggedItem = function (e, w) {
			e = e || window.event;
			var btnPressed = e.buttons,
			MOUSE_BUTTON = {
				LEFT : 1,
				CENTER : 2,
				RIGHT : 3
			};
			if (btnPressed == MOUSE_BUTTON.LEFT ||
				btnPressed == MOUSE_BUTTON.RIGHT ||
				btnPressed == MOUSE_BUTTON.CENTER) {
				return false;
			} else {
				$scope.draggedItem = w;
				return true;
			}
		};

		/**
		 * @description It'll check the token for normal or wild card token
		 * @param { string } token - The search token
		 * */
		$scope.isWildCardToken = function (token) {
			var
			WILD_CARD = $scope.WILD_CARD,
			WILD_CARD_KEYS = Object.keys(WILD_CARD);

			for (var i = 0; i < WILD_CARD_KEYS.length; i++) {
				if (token == WILD_CARD[WILD_CARD_KEYS[i]]) {
					return true;
				}
			}
			return false;
		};

		/**
		 * @description It'll prepare the widget list to display while searching
		 * @param { string } token - The search token
		 * */
		$scope.prepareWidgetList = function (token) {
			var
			wName = null,
			ciwName = null,
			ciToken = token.trim().toLowerCase();

			$scope.widgets = [];
			$scope.searchActive = $scope.search.length > 0 ? true : false;

			if (!ciToken) {
				$scope.enableAllGroups();
				$scope.active = false;
				$scope.clearSearch();
				return false;
			} else if ($scope.isWildCardToken(ciToken)) {
				switch (ciToken) {
				case $scope.WILD_CARD.ALL_COMPONENTS:
					$scope.widgets = $scope.allWidgets;
					break;
				case $scope.WILD_CARD.ALL_CHARTS:
					$scope.widgets = $.merge($.merge([], $scope.charts), $scope.advCharts);
					break;
				default:
					break;
				}
			} else {
				for (var i = 0; i < $scope.allWidgets.length; i++) {
					wName = $scope.allWidgets[i].name;
					ciwName = wName ? wName.trim().toLowerCase() : "";
					if (ciwName && ciwName.indexOf(ciToken) != -1) {
						$scope.widgets.push($scope.allWidgets[i]);
					}
				}
			}

			if ($scope.widgets.length) {
				$scope.searchFound = true;
			} else {
				$scope.searchFound = false;
			}
		};

		/**
		 * @description It'll clear the search list and display last clicked group item
		 * */
		$scope.clearSearch = function () {
			var $lsg = $("#" + $scope.activeGroupId);
			$scope.search = "";
			if ($lsg.length) {
				setTimeout(function () {
					angular.element($lsg[0]).trigger("click");
				}, 1);
			}
		};

		/**
		 * @description It'll perform a search on widgets
		 * */
		$scope.searchWidget = function () {
			$scope.removeSelection();
			$scope.disableOtherGroups({
				id : "BIZVIZ"
			});
			$scope.prepareWidgetList($scope.search);
			$(".group-widget-separator").find(".pointer").css("left", 156);
		};

		/**
		 * @description It'll move the pointer which points to the widget belonging group
		 * @param { object } evt - The event object
		 * */
		$scope.movePointer = function (evt) {
			var
			halfElWidth = evt.currentTarget.clientWidth / 2,
			offsetLeft = evt.currentTarget.offsetLeft,
			left = offsetLeft + halfElWidth - 5;
			$(".group-widget-separator").find(".pointer").css("left", left);
		};

	};

	/** @description Controller definition **/
	angular.module(designerModules.module.DesignerPropertyManager)
	.controller("WidgetController", ["$scope", "ServiceFactory", widgetControllerFn]);

})();
//# sourceURL=WidgetController.js