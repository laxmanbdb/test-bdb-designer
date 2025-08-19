/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: ComponentDimensionWorker.js
 * @description manages movement of component in design area 
 * **/
$.each($scope.modal.listOfSelectedComponents, function (index, element) {
	var leftPos = $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).position().left - 1;
	var rightEnd = leftPos + $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).width();
	var propObjx = {
		"attributeName" : "x",
		"propertyName" : "Object",
		"type" : "Number",
		"value" : leftPos
	};
	$scope.modal.selectedComponentId = element;
	propObjx["value"] = rightEnd - $("#dcc_" + $scope.modal.listOfSelectedComponents[index]).width();
	$scope.updateObjectWithPropertyValue(propObjx);
	var componentJSON = $scope.getComponentbyId($scope.modal.selectedComponentId);
	$scope.redrawComponent(componentJSON);
})