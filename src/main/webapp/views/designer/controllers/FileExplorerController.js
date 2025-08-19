/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: FileExplorerController.js
 * @description It controls Folder Directory of portal in publish option of manage page 
 * **/
(function () {
	/** Controller function for Dashboard Components
	 * @param  {Object} $scope        	The scope object
	 * @param  {Object} timeout 		The Timeout
	 * @param  {Object} ServiceFactory 	The ServiceFactory
	 * @return {undefined}              undefined
	 */
	var fileExplorerControllerFn = function ($scope, ServiceFactory) {
		$scope.dirStrBackup = {};
		$scope.newDirName = "New folder";

		$scope.selectedDir = {
			id : 0,
			isChildPresent : true,
			name : "Home",
			nodes : []
		};

		/**
		 * changes the mode to directory creation mode
		 * @author EID201
		 * @returns {undefined} undefined
		 * */
		$scope.goToCreateDirMode = function () {
			$scope.modal.newDir = true;
			$scope.newDirName = "New folder";
			setTimeout(function () {
				$(".newDirInput").focus();
			}, 10);
		};

		/**
		 * creates new directory in the specified directory
		 * @param { object } parentDir - the parent directory object
		 * @author EID201
		 * @returns {undefined} undefined
		 * */
		$scope.createNewDir = function (parentDir) {
			var
			REQ_URL = req_url.designer["uploadDashboard"],
			currentTime = new Date().toString(),
			dirTitle = $scope.newDirName.trim(),
			REQ_DATA = {
				position : "0",
				type : "folder",
				parentid : parentDir.id,
				dashboardtype : "0",
				id : "0",
				imagename : "dashboard.png",
				title : dirTitle,
				description : "Created from dashboard designer on " + currentTime,
				file : ""
			},
			requestSuccessFn = function (data, success) {
				var newlyCreatedDir = null,
				parentId = null;
				if (data.trees.success) {
					newlyCreatedDir = data.trees.tree;
					parentId = data.trees.tree.parentId.id;
					$scope.dirStrBackup[parentId].push({
						id : newlyCreatedDir.id,
						isChildPresent : false,
						name : newlyCreatedDir.title,
						nodes : [],
						parent : parentId
					});
					$scope.dirList = $scope.dirStrBackup[parentId];
					$scope.modal.newDir = false;
					$scope.newDirName = "New folder";
						$scope.$apply();
				} else {
					ServiceFactory.showNotification("Failed to ceate a folder", "alert-danger", 3000);
				}

				ServiceFactory.hideLoader();
			};

			if (dirTitle != null && dirTitle != "") {
				ServiceFactory.showLoader();

				BIZVIZ.SDK.secureRequest(
					REQ_URL,
					REQ_DATA,
					requestSuccessFn);
			} else {
				ServiceFactory.showNotification("Folder name can not be empty", "alert-warning", 3000);
			}

		};

		/**
		 * updates the selected directory for publishing dashboard
		 * @param { object } dir - the directory object
		 * @author EID201
		 * @returns {undefined} undefined
		 * */
		$scope.setSelectedDirToPublish = function (dir) {
			$scope.selectedFolderToPublish = {
				"id" : dir.id,
				"title" : dir.name
			};
			$scope.modal.selectedDirToPublish = {
				"id" : dir.id,
				"title" : dir.name
			};
		};

		/**
		 * updates the directory list
		 * @author EID201
		 * @returns {undefined} undefined
		 * */
		$scope.loadPortalDirs = function () {
			$scope.dirList = $scope.publishFolder;
			if ($scope.dirList) {
				for (var i = 0; i < $scope.dirList.length; i++) {
					$scope.dirList[i]["parent"] = 0;
				};
				$scope.dirStrBackup["dirList"] = [angular.copy($scope.selectedDir)];
				$scope.dirStrBackup["0"] = angular.copy($scope.dirList);
				$scope.setSelectedDirToPublish($scope.selectedDir);
			}
		};

		/**
		 * updates the directory list with child directories
		 * @param { object } dir - the directory object
		 * @author EID201
		 * @returns {undefined} undefined
		 * */
		$scope.getChildDirs = function (dir) {
			var
			REQ_URL = req_url.designer["getListView"],
			REQ_DATA = {
				nodeid : dir.id,
				orderType : "DateDesc"
			},
			requestSuccessFn = function (data, success) {
				var childs = DesignerUtil.prototype.getArrayOfSingleLengthJson(data.trees.treesList);
				for (var i = 0; i < childs.length; i++) {
					if (childs[i] != undefined && childs[i].type == "folder") {
						dir.isChildPresent = true;
						var n = {
							name : "",
							id : "",
							nodes : []
						};
						n.id = childs[i].id;
						n.name = childs[i].title;
						n.nodes = [];
						n.isChildPresent = false;
						n.parent = dir.id;
						dir.nodes.push(n);
					}
				}
				$scope.dirList = dir.nodes;
				$scope.selectedDir = dir;
				$scope.setSelectedDirToPublish($scope.selectedDir);
				$scope.dirStrBackup[dir.id] = angular.copy($scope.dirList);
				$scope.dirStrBackup["dirList"].push(dir);
				$scope.$apply();
				ServiceFactory.hideLoader();
			};

			dir.nodes = [];
			if ($scope.dirStrBackup[dir.id]) {
				$scope.dirList = $scope.dirStrBackup[dir.id];
				$scope.selectedDir = dir;
				$scope.setSelectedDirToPublish($scope.selectedDir);
			} else {
				ServiceFactory.showLoader();

				BIZVIZ.SDK.secureRequest(
					REQ_URL,
					REQ_DATA,
					requestSuccessFn);
			}

		};

		/**
		 * returns the directory object by directory id
		 * @param { string } dirId - the directory id
		 * @author EID201
		 * @returns {Object} the directory object
		 * */
		$scope.getDirById = function (dirId) {
			return DesignerUtil.prototype.findInArray($scope.dirStrBackup["dirList"], "id", dirId);
		};

		/**
		 * update the directory list to the parent directory
		 * @param { object } dir - the directory object
		 * @author EID201
		 * */
		$scope.getParentDir = function (dir) {
			if ($scope.modal.newDir) {
				$scope.modal.newDir = false;
				return;
			} else if (dir && dir.id != 0) {
				$scope.dirList = $scope.dirStrBackup[dir.parent];
				$scope.selectedDir = $scope.getDirById(dir.parent);
				$scope.setSelectedDirToPublish($scope.selectedDir);
			}
		};

		/**
		 * update the directory list to the root directory
		 * @param { object } dir - the directory object
		 * @returns {undefined} undefined
		 * @author EID201
		 * */
		$scope.goToRootDir = function () {
			$scope.dirList = $scope.dirStrBackup[0];
			$scope.selectedDir = $scope.getDirById(0);
			$scope.setSelectedDirToPublish($scope.selectedDir);
		};

		$scope.loadPortalDirs();
	};

	/** @description Controller definition **/
	angular.module("designer")
	.controller("FileExplorerController", ["$scope", "ServiceFactory", fileExplorerControllerFn]);

})();
//# sourceURL=FileExplorerController.js