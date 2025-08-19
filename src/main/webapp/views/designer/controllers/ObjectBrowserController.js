/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: ObjectBrowserController.js
 * @description It controls Object Browser window activity
 * **/
(function () {
	/** Controller function for Objects Browser
	 * @param  {Object} $scope			the scope object
	 * @param  {Object} ServiceFactory	the ServiceFactory
	 * @param  {Object} $timeout		the $timeout
	 * @return {undefined}				undefined
	 */
	var obCtrlFn = function($scope, ServiceFactory, $timeout ) {
		$scope.componentsList = [];
		$scope.hideAll = false;
		$scope.lockAll = false;
		$scope.hide_showAllBtnIcon = "./resources/images/svg/hideAll.svg";
		$scope.hideShowGlyph = "nt-eye-close-icon";
		$scope.groupCompHideShowGlyph = "visibility_off";
		$scope.lockMoveGlyph = "lock";
		$scope.hide_showAllToolTip = "Hide All";
		$scope.hide_showAllgCompToolTip = "Hide All Components";
		$scope.lock_unlockAllBtnIcon = "./resources/images/svg/lockAll.svg";
		$scope.lock_unlockAllToolTip = "Lock All";
		$scope.deleteAllBtnIcon = "./resources/images/svg/delete.svg";
		$scope.oldIndex = -1; //Old index holder while sorting objects
		$scope.isSortingActive = false; //Flag to know the active sorting status
		$scope.disableObjectList = false;
		
		/** Sort configuration for object explorer */
		$scope.objectSortCfg = {
			axis: "y",
			tolerance: "pointer",
			containment: "parent",
			cursor: "move",
			revert: true,
			placeholder: "s-o-p-h",
			scroll: true,
			handle: ".compReorderDragDiv",
			start: function( e, ui ) {
				$scope.isSortingActive = true;
				$scope.oldIndex = ui.item.index();
			},
			stop: function( e, ui ) {
				var newIndex = ui.item.index();
				$timeout( function() {
					$scope.updateZindex( $scope.oldIndex, newIndex );
					$scope.isSortingActive = false;
				}, 0 );
			}
		};

		/**
		 * Updates the z-index of component in UI and order in dashboard json
		 * @param  {Number} oldIndxe Old z index
		 * @param  {Number} newIndex New z index
		 * @return {undefined}          undefined
		 */
		$scope.updateZindex = function( oldIndxe, newIndex ) {
			var cList = $scope.componentsList,
			dbObjects = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object;
			if(dbObjects && dbObjects.length > 0){
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
				cList.move( oldIndxe, newIndex );
				dbObjects.move(oldIndxe,newIndex);
				for( var i = 0; i < cList.length; i++ ) {
					try {
						//$( "#dcc_" + cList[ i ].objectID ).zIndex( i );
						$( "#dcc_" + cList[ i ].objectID ).css('zIndex', i);
					}
					catch( error ) {
						console.error( error );
					}
				}
			}
		};
				
		/**
		 * For prevention of selection/de-selection while sorting
		 * @param  {String}  cId              Component ID
		 * @param  {Boolean} isCtrlKeyPressed Flag to check the ctrl key
		 * @param  {Object}  event            Event object
		 * @param  {Boolean}  openMode        Flag to check open mode
		 * @return {undefined}                undefined
		 */
		$scope.prepareComponentSelectionFromObjExp = function( cId, isCtrlKeyPressed, event, openMode ) {
			/** Checking whether sorting is active or not **/
			if( !$scope.isSortingActive ) {
				$(".c-group").removeClass("selected-group");
				$scope.handleComponentSelection( cId, isCtrlKeyPressed, event, openMode );
			}
		};

		/** @description watcher for selected dashboard **/
		$scope.$watch("modal.selectedDashboard", function () {
			$scope.updateComponentList();
		});

		$scope.$watch("modal.objectListChange", function () {
			$scope.updateComponentList();
		});
		$scope.$watch("modal.layoutType", function () {
			$scope.updateComponentList();
		});
		/**
		 * Cleans the object serach
		 * @return {undefined} undefined
		 */
		$scope.clearObjectSearch = function() {
			$scope.objecBrowserSearchkey = "";
		};

		/**
		 * update the component list whenever a component is dragged
		 * @return {undefined} undefined
		 */
		$scope.updateComponentList = function () {
			$scope.componentsList = [];
			if ($scope.modal.selectedDashboard != undefined) {
				if ($scope.modal.selectedDashboard.json != undefined) {
					$.each($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, function (index, value) {
						if (value && typeof(value) === "object") {
							var item = {
								objectName : $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object[index]["objectName"],
								objectID : $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object[index]["objectID"],
								hideComponent : $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object[index]["unShowHidden"],
								lockComponent : $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object[index]["showLocked"],
								pinedComponent : $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object[index]["isPined"] || false,
								referenceID: $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object[index]["referenceID"]
							};
							$scope.componentsList.push(item);
							$scope.modal.componentListInObjectBrowser = $scope.componentsList;
							/** Update component zIndex when Dashboard layout change */  
							//$( "#dcc_" + item.objectID ).zIndex( index );
							$( "#dcc_" + item.objectID ).css("zIndex", index );
						}
					});
				}
			}
			$scope.hideAll = false;				
			if($scope.isAllHidden){//DAS-696 hide all icon not changing on hiding 
				$scope.hideAll = true;				
			}
			$scope.lockAll = false;
		};
		/**
		 * This function will set Manage Dashboard Component panel is enable
		 */
		$scope.initObjectBrowser = function () {
			$scope.modal.isActiveBox = true;
		};
		
		/**
		 * This function will enable Manage Group panel and Disable Manage Dashboard Component panel 
		 */
		$scope.showAddToGroup = function () {
			if ($scope.modal.isActiveBox) {
				$scope.modal.isActiveBox = false;
				$scope.showGrpBtns = true;
			} else {
				$scope.modal.isActiveBox = true;
				$scope.showGrpBtns = false;
			}
		};
		
		/**
		 * This function will enable Manage Group panel on context menu selection
		 */
		$scope.showGroupPanel = function () {
			$scope.reloadDefault("objectBrowser");
			if (!$scope.isBoxVisible) {
				$scope.setMenuSelection("#toggleObjectBrowser");
				$("#objectBrowser").removeClass("bvz-invisible");
				$("#objectBrowser").removeClass("hideBox").addClass("showBox");
				$(".dashboardContents").css({width : "calc( 100% - "+$scope.bvzRCBoxWidth+"px )"});
				$scope.isBoxVisible = true;
				$scope.modal.isActiveBox = false;
				$scope.showGrpBtns = true;
			}
		};
		/**
		 * update the name in dashboard json when component name changed
		 * @param  {Object} comp The component object
		 * @return {undefined}      undefined
		 */
		$scope.onChangeComponentName = function (event, comp) {
			var component = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, "objectID", comp.objectID);
			component["objectName"] = comp.objectName;
			$scope.disableObjectList = false;
			$scope.modal.refreshAllObjectList();/*BDD-785,Added this to refresh all objects, when rename a component from object browser. To get the name of component in script editor. */
		};
		$scope.renameComp = function () {
			$scope.disableObjectList = true;
		};
		/**@description select group component **/
		$scope.selectGroupComponent = function(gName) {
		    var dbGroups = $scope.getDashboardGroups();
		    for (var i = 0; i < dbGroups.length; i++) {
		        if (dbGroups[i].gName === gName) {
		            var compIds = $scope.modal.selectedDashboard.json.Dashboard.componentGroups[i].aCompIds;
		            for (var j = 0; j < compIds.length; j++) {
		                $scope.selectComponent(compIds[j]);
		            }
		            break;
		        }
		    }
		};
		/**@description deSelect group component **/
		$scope.deSelectGroupComponent = function(gName) {
		    var dbGroups = $scope.getDashboardGroups();
		    for (var i = 0; i < dbGroups.length; i++) {
		        if (dbGroups[i].gName === gName) {
		            var compIds = $scope.modal.selectedDashboard.json.Dashboard.componentGroups[i].aCompIds;
		            for (var j = 0; j < compIds.length; j++) {
		                $scope.deselectComponent(compIds[j]);
		            }
		            break;
		        }
		    }
		};
        /**@description get selected dashboard group and update modal **/
		$scope.renameGroup = function (event) {
			event.stopPropagation();
			$scope.showGrpBtns = false;
			/** When we rename non selected group than store $scope.selectedGroup to temp and later reassign to $scope.selectedGroup  */
			$scope.tempGrp = $scope.selectedGroup;
			$scope.selectedGroup = this.g.gName;
			$scope.groupNameUpadte = $scope.selectedGroup;
			$scope.modal.selectedGroup = $scope.getSelectedGroup();
			$("#groupListContainer #" + $scope.selectedGroup).find(".w-list-option").hide();
			$("#groupListContainer #" + $scope.selectedGroup).parent().siblings().addClass("disableListEvent");
		};
		
        /**@description rename dashboard group to the dashboard group list @String gName - the group name **/
		$scope.updateGroupName = function(event, gName) {
			event.stopPropagation();
		    var gNameWithoutWhiteSpace = gName.replace(/\s/g, "");
		    $scope.modal.selectedGroup = this.g.gName || $scope.selectedGroup; // updating seleted group
		    $("#groupListContainer #" + $scope.selectedGroup).find(".w-list-option").show();
		    $("#groupListContainer #" + $scope.selectedGroup).parent().siblings().removeClass("disableListEvent");
		    $scope.showGrpBtns = true;
		    if (gNameWithoutWhiteSpace == "") {
		        ServiceFactory.showNotification("Group name cann't be empty", "alert-danger", 3000);
		        return false;
		    }
		    if (!(/^[a-zA-Z0-9_-]+$/i.test(gNameWithoutWhiteSpace))) {
		        ServiceFactory.showNotification("Group name should not contain any special character", "alert-danger", 3000);
		        return false;
		    }
		    var g = gNameWithoutWhiteSpace.split(",");

		    var result = true;
		    var dbGroups = $scope.getDashboardGroups();
		    for (var i = 0; i < dbGroups.length; i++) {
		        if (dbGroups[i].gName === g[0]) {
		            result = false;
		            break;
		        }
		    }
		    if (result) {
		        for (var i = 0; i < dbGroups.length; i++) {
		            if (dbGroups[i].gName === $scope.modal.selectedGroup) {
		                var compIds = $scope.modal.selectedDashboard.json.Dashboard.componentGroups[i].aCompIds;
		                for (var j = 0; j < compIds.length; j++) {
		                    var compObj = $scope.getComponentbyId(compIds[j]);
		                    var groupNames = compObj["groupings"].split(",");
		                    groupNames = groupNames.map(function(val) {
		                        return val.replace(/\s/g, '')
		                    });
		                    var index = groupNames.indexOf(dbGroups[i].gName);
		                    if (index !== -1) {
		                        groupNames[index] = g[0];
		                    }
		                    compObj["groupings"] = groupNames.join();
		                }
		                $scope.modal.selectedDashboard.json.Dashboard.componentGroups[i].gName = g[0];
		                $scope.groupNameUpadte = g[0];
		                $scope.selectedGroup  = g[0];
		                ServiceFactory.showNotification("Group name updated", "alert-info", 3000);
		                break;
		            }
		        }
		    } else {
		        ServiceFactory.showNotification("Group name already exists", "alert-info", 3000);
		    }
		    $scope.selectedGroup = $scope.tempGrp;// Reassign tempgrp value
		    $scope.tempGrp = null;
		};
        /**@description creates and add a new dashboard group to the dashboard group list @String gName - the group name **/
		$scope.createDashboardGroup = function () {
			$scope.fromExistingGroup =false;
	        var newDashboardGroup = null;
	        var index = 0;
	        for (var i = 0; i < 50; i++) {
	        	index = i;
	           
	        	newDashboardGroup = {
	        			gName: "grp"+index,
	                    aCompIds: [],
	                    gCompHidden: false,
	                    iClass: $scope.groupCompHideShowGlyph,
	                    tooltip: $scope.hide_showAllgCompToolTip
	        	}
	        	if ($scope.isNewDashboardGroup(newDashboardGroup.gName)) {
	                $scope.getDashboardGroups().push(newDashboardGroup);
	                $scope.newGroup = "";
	                $timeout(function() {
	                    //$scope.selectedGroup = newDashboardGroup.gName;
	                    $scope.$apply();
	                }, 10);
	                break;
	            } else {
	            	continue;
	            }
	        }
		};
        /**@description adds the selected component to the selected group and then manage groups inside the component **/
		$scope.addSelectedComponentToSelectedGroup = function (event) {
			//event.stopPropagation();
			/** When we add comp into non selected group than store $scope.selectedGroup to temp and later reassign to $scope.selectedGroup  */
			var tempGrp = $scope.selectedGroup;
			$scope.selectedGroup = this.g.gName;
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
			$scope.selectedGroup = tempGrp;// reassign temp to $scope.selectedGroup
		};
        /**@description selects a group @param  e - the event, selectedGroup - the group to be selected  **/
		$scope.selectGroup = function(e, selectedGroup) {
			var x = e.x || e.clientX;
			var y = e.y || e.clientY;
			if (x && y) {
			    var isSelectedGroup = null,
			        $target = null;
			    if (e) {
			        $target = $(e.currentTarget);
			    } else {
			        $target = $("#" + selectedGroup);
			    }
			    if (e.ctrlKey) {
			        isSelectedGroup = $target.hasClass("selected-group");
			        if (isSelectedGroup) {
			            $target.removeClass("selected-group");
			            $scope.deSelectGroupComponent(selectedGroup);
			        } else {
			            $target.addClass("selected-group");
			            $scope.selectGroupComponent(selectedGroup);
			        }
			    } else {
			        isSelectedGroup = $target.hasClass("c-active-group");
			        if($(".c-group").hasClass("selected-group")){
			        	$(".c-group").parent().find(".selected-group").each(function(index, element){
			        		$scope.deSelectGroupComponent(element.id)
			        	});
			        	$(".c-group").removeClass("selected-group");
			        }
			        $(".c-group").removeClass("c-active-group");
			        //$(".a-comps").hide();
			        $(".a-comps").css({"visibility": "hidden"});
			        if (isSelectedGroup) {
			            $target.removeClass("c-active-group");
			            //$target.parent().find(".a-comps").hide();
			            $target.parent().find(".a-comps").css({"visibility": "hidden"});
			            $scope.selectedGroup = "";
			            $scope.fromExistingGroup = false;
			        } else {
			            $target.addClass("c-active-group");
			            //$target.parent().find(".a-comps").show();
			            $target.parent().find(".a-comps").css({"visibility": "visible"});
			            $scope.selectedGroup = selectedGroup;
			            $scope.fromExistingGroup = true;
			        }
			    }
			}
		};
        /**@description return currently selected group name **/
		$scope.getSelectedGroup = function () {
			return $scope.selectedGroup;
		};
		/** @description duplicate all the components in the selected group **/
		$scope.duplicateGroup = function(event, grpObj) {
		    var dbGroups;
		    event ? event.stopPropagation() : "";
		    var selectedgroup = $scope.getGroupByGroupName(grpObj);
		    var group = angular.copy(selectedgroup);
		    try {
		        dbGroups = $scope.getDashboardGroups();
		        if (group.aCompIds.length) {
		            $scope.duplicateComponents(group.aCompIds);
		            //                    $scope.createDashboardGroup();
		            //                    $scope.addSelectedComponentToSelectedGroup();
		        }
		    } catch (error) {
		        console.error(error);
		    }
		};
        /**@description opens REMOVE GROUP dialog box  **/
		$scope.deleteGroup = function (event,gName) {
			event.stopPropagation();
			/** When we delete non selected group than store $scope.selectedGroup to temp and later reassign to $scope.selectedGroup  */
			$scope.tempGrp = $scope.selectedGroup;
			$scope.selectedGroup = gName;
			$scope.deleteWarning = 'Are you sure to remove the group"'+ gName +'"?';
			$("#deleteGroupModalDialog").modal("show");
		};
		 /** @description Deletes the group from designer and from component assigned to it **/
        $scope.removeGroup = function (event, grpObj) {
            var dbGroups;
            event ? event.stopPropagation() : "";
            var group = angular.copy(grpObj);
            try {
                dbGroups = $scope.getDashboardGroups();
                if (group.aCompIds.length) {
                    for (var i = 0; i < group.aCompIds.length; i++) {
                        $scope.removeComponentFromDashboardGroup(group.aCompIds[i], group.gName);
                    }
                }
                dbGroups.splice(dbGroups.indexOf(grpObj), 1);
                if (dbGroups.length == 0) {
                    $scope.fromExistingGroup = false;
                }
            } catch (error) {
                console.error(error);
            }
            $scope.selectedGroup = $scope.tempGrp;// Reassign tempgrp value to selectedGroup
		    $scope.tempGrp = null;
			$("#deleteGroupModalDialog").modal("hide");
        };
        $scope.deleteAllDbGroupsDialog = function (event) {
            event.stopPropagation();
            var dbGroups = $scope.getDashboardGroups();
            if (dbGroups.length) {
                $scope.deleteAllWarning = "Are you sure to remove all the groups ?"
                $("#deleteAllGroupModalDialog").modal("show");
            } else
                ServiceFactory.showNotification("No group available", "alert-info", 3000);
        };
		$scope.deleteAllDbGroups = function (event) {
		    event.stopPropagation();
		    var dbGroups = $scope.getDashboardGroups();
		    var groups = angular.copy(dbGroups);
		    for (var i = 0; i < groups.length; i++) {
		        if (groups[i].aCompIds.length) {
		            for (var j = 0; j < groups[i].aCompIds.length; j++) {
		                $scope.removeComponentFromDashboardGroup(groups[i].aCompIds[j], groups[i].gName);
		            }
		        }
		        //dbGroups.splice(dbGroups.indexOf(dbGroups[i]), 1);
		        for (var k = 0; k < dbGroups.length; k++) {
		        	if (dbGroups[k].gName == groups[i].gName) {
		        		dbGroups.splice(k, 1);
		        		break;
		        	}
		        }
		        if (dbGroups.length == 0) {
		            $scope.fromExistingGroup = false;
		        }
		    }
		    $scope.selectedGroup = "";
		    $("#deleteAllGroupModalDialog").modal("hide");
		};
		/**
		 * Delete a component from UI and dahboardJSON
		 * @param  {Object} event Event object
		 * @param  {Object} comp  Component object
		 * @return {undefined}       undefined
		 */
		$scope.deleteComponent = function(event, comp) {
		    event.stopPropagation();
		    $scope.deselectAllComponent();
		    $scope.selectComponent(comp.objectID);
		    $scope.executeAction(comp.objectID, "removeComponent");
		};

		/**
		 * to move the component up in object browser window and z-index in UI
		 * @param  {Object} event Event object
		 * @param  {Object} comp  Component object
		 * @param  {Number} index index of the component
		 * @return {undefined}       undefined
		 */
		$scope.shiftComponentUp = function (event, comp, index) {
			event.stopPropagation();
			var componentJSON = $scope.getComponentbyId($scope.componentsList[index].objectID);
			$scope.redrawComponent(componentJSON, $("#dcc_" + $scope.componentsList[index].objectID).zIndex() + 1);
			componentJSON = $scope.getComponentbyId($scope.componentsList[index + 1].objectID);
			$scope.redrawComponent(componentJSON, $("#dcc_" + $scope.componentsList[index + 1].objectID).zIndex() - 1);
			$scope.swapPositions(index, index + 1);
		};

		/**
		 * to move the component down in object browser window and z-index in UI
		 * @param  {Object} event Event object
		 * @param  {Object} comp  Component object
		 * @param  {Number} index index of the component
		 * @return {undefined}       undefined
		 */
		$scope.shiftComponentDown = function (event, comp, index) {
			event.stopPropagation();
			var componentJSON = $scope.getComponentbyId($scope.componentsList[index].objectID);
			$scope.redrawComponent(componentJSON, $("#dcc_" + $scope.componentsList[index].objectID).zIndex() - 1);
			componentJSON = $scope.getComponentbyId($scope.componentsList[index - 1].objectID);
			$scope.redrawComponent(componentJSON, $("#dcc_" + $scope.componentsList[index - 1].objectID).zIndex() + 1);
			$scope.swapPositions(index, index - 1);
		};

		/**
		 * Swaps the index
		 * @param  {Number} index1 index1
		 * @param  {Number} index2 index2
		 * @return {undefined}        undefined
		 */
		$scope.swapPositions = function (index1, index2) {
			var comp1 = $scope.componentsList[index1];
			var comp2 = $scope.componentsList[index2];
			var compJson1 = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object[index1];
			var compJson2 = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object[index2];
			$scope.componentsList[index1] = comp2;
			$scope.componentsList[index2] = comp1;
			$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object[index1] = compJson2;
			$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object[index2] = compJson1;
		};

		/**
		 * Create another copy of component
		 * @param  {Object} event The event object
		 * @param  {Object} comp  The component object
		 * @return {undefined}       undefined
		 */
		$scope.createDuplicate = function (event, comp) {
			event ? event.stopPropagation() : "";
			$scope.selectComponent(comp.objectID);
			$scope.executeAction(comp["objectID"], "duplicateComponent")
		};

		/**
		 * Settings icon for an item - which will open sub property windows when selected
		 * @param  {Object} event Event object
		 * @return {undefined}       undefined
		 */
		$scope.handlePopover = function (event) {
			event.stopPropagation();
			var popoverSettings = {
				placement : "top",
				container : "#objectBrowser .bizVizControlBoxBody",
				html : true,
				selector : ".comp-appearance-icon",
				content : function () {
					return $("#obc-settings").html();
				}
			};
			$(".comp-appearance-icon").popover(popoverSettings);
			$(".comp-appearance-icon").popover("toggle");
		};
		$scope.pinUnpinComp  = function(event, comp) {
			var compObj = $scope.getComponentbyId(comp.objectID);
			if (!comp.pinedComponent) {
				compObj.isPined = true;
				comp.pinedComponent = true;
				$("#dcc_" + comp.objectID).show();
				var pinedComponent ={
					"objectID": comp.objectID
				}
				if ($scope.isSelectedComponent(comp.objectID)) {
					$scope.deselectComponent(comp.objectID);
				}
				$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].pinedObject.push(pinedComponent);
			} else {
				compObj.isPined = false;
				comp.pinedComponent = false;
				$("#dcc_" + comp.objectID).hide();
				var pinedObj = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].pinedObject;
				for (var i = 0; i < pinedObj.length; i++) {
					if (pinedObj[i].objectID == comp.objectID) {
						$scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].pinedObject.splice(i, 1);
					}
				}
			}
		};
		/**
		 * Hide the component from the design Area
		 * @param  {Object} event    Event object
		 * @param  {Object} comp     The component object
		 * @param  {Boolean} openMode check mode is open mode or not
		 * @return {undefined}          undefined
		 */
		$scope.hideComponent = function (event, comp, openMode) {
			comp.hideComponent = (event == false) ? comp.hideComponent : !comp.hideComponent;
			event ? event.stopPropagation() : "";
			$(".comp-appearance-icon").popover("hide");
			$(".bizVizControlBoxBody .popover").remove();
			var component = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, "objectID", comp.objectID);
			component["unShowHidden"] = comp.hideComponent;
			if (IsBoolean(comp.hideComponent) && !openMode) {
				ServiceFactory.showNotification("" + component.objectName + " is now Hidden", "alert-info", 3000);
			} else if (!openMode) {
				ServiceFactory.showNotification("" + component.objectName + " is now Visible", "alert-info", 3000);
			}
			if (IsBoolean(comp.hideComponent)) {
				if ($scope.isSelectedComponent(comp.objectID)) {
					$scope.deselectComponent(comp.objectID);
				}
				/*DAS-696:library based charts not drawing properly when hidden initially*/
				$("#dcc_" + comp.objectID).css({"visibility": "hidden", "display": "none"});
				$("#dcc_" + comp.objectID).css({"visibility": "hidden"});
			} else {
				$("#dcc_" + comp.objectID).css({"visibility": "visible", "display": "block"});
				$("#dcc_" + comp.objectID).css({"visibility": "visible"});
				$scope.hideAll = false;
				$scope.hide_showAllBtnIcon = "./resources/images/svg/hideAll.svg";
				$scope.hideShowGlyph = "nt-eye-close-icon";
				$scope.hide_showAllToolTip = "Hide All";
				//DAS-1010 benchmark Grid not loading on hide and show component in design mode & DAS-696
				if (component.componentType == "benchmark_analysis_chart" || component.objectType  === "datagrid" || component.componentType === "decomposition_chart" || component.componentType === "knowledge_graph_chart") {
					$scope.redrawComponent(component)
				}
			}
			
			if( $scope.isAllHidden() ) {
				$scope.hideShowGlyph = "nt-eye-open-icon";
				$scope.hide_showAllToolTip = "Show All";
				$scope.hideAll = true;
			}
		};
		
		/**
		 * Hides all the component in the design area
		 * @param  {Array} complist list of the component
		 * @return {undefined}          undefined
		 */
		$scope.hideAllComponent = function (complist) {
			$scope.hideAll = !$scope.hideAll;
			if ($scope.modal.selectedDashboard != "") {
				if(complist.length != 0){
					for (var key = 0; key < complist.length; key++) {
						var component = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, "objectID", complist[key].objectID);
						//DAS-696 Grids and Knowledge & decomposition charts were not drawing properly in canvas when initially hidden
						if (component.componentType == "benchmark_analysis_chart" || component.componentType  === "tree_grid" ||component.objectType  === "datagrid" || component.componentType === "decomposition_chart" || component.componentType === "knowledge_graph_chart") {
							$scope.redrawComponent(component)
						}
						if (IsBoolean($scope.hideAll)) {
							component["unShowHidden"] = true;
							complist[key].hideComponent = true;
							$("#dcc_" + complist[key].objectID).css({"visibility": "hidden", "display": "none"});
						} else {
							component["unShowHidden"] = false;
							complist[key].hideComponent = false;
							$("#dcc_" + complist[key].objectID).css({"visibility": "visible", "display": "block"});
						}
					}
					if (!IsBoolean($scope.hideAll)) {
						$scope.hide_showAllBtnIcon = "./resources/images/svg/hideAll.svg";
						$scope.hideShowGlyph = "nt-eye-close-icon";
						$scope.hide_showAllToolTip = "Hide All";
						ServiceFactory.showNotification("All components are hidden", "alert-info", 3000);
					} else {
						$scope.hide_showAllBtnIcon = "./resources/images/svg/showAll.svg";
						$scope.hideShowGlyph = "nt-eye-open-icon";
						$scope.hide_showAllToolTip = "Show All";
						ServiceFactory.showNotification("All components are visible", "alert-info", 3000);
					}
				}else{
					ServiceFactory.showNotification("No component available", "alert-warning", 3000);
				}
			} else {
				ServiceFactory.showNotification("No dashboard found", "alert-danger", 3000);
			}
		};
		/**
		 * Hides all the component of specific group in the design area
		 * @param  {group}	Group object
		 */
		$scope.hideAllGroupComponent = function (event, group ) {
			event.stopPropagation();
			var groupComponentIds = group.aCompIds;
			var compObj = [];
			var isGrpCompPined = true;
			for (var i = 0; i < groupComponentIds.length; i++) {
				compObj.push($scope.getComponentbyId(groupComponentIds[i]));
				/** Added for prevent show/hide group operation when group components unpinned */
				if ($scope.modal.layoutType !== "AbsoluteLayout" && !compObj[i].isPined) {
					isGrpCompPined = false;
					break;
				}
			}
			if (isGrpCompPined) {
				if ($scope.modal.selectedDashboard != "") {
					if (compObj.length != 0) {
						for (var key = 0; key < compObj.length; key++) {
							if(compObj[key] != undefined){
								var component = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, "objectID", compObj[key].objectID);
								//DAS-696 Grids and Knowledge & decomposition charts were not drawing properly in canvas when initially hidden
								if (component.componentType == "benchmark_analysis_chart" || component.componentType  === "tree_grid" ||component.objectType  === "datagrid" || component.componentType === "decomposition_chart" || component.componentType === "knowledge_graph_chart") {
									$scope.redrawComponent(component)
								}
							if (!IsBoolean(group.gCompHidden)) {
								component["unShowHidden"] = true;
								compObj[key].hideComponent = true;
								$("#dcc_" + compObj[key].objectID).css({"visibility": "hidden", "display": "none"});
								$("#ob-hideComp-checkbox" + compObj[key].objectID).prop('checked', true);
							} else {
								component["unShowHidden"] = false;
								compObj[key].hideComponent = false;
								$("#dcc_" + compObj[key].objectID).css({"visibility": "visible", "display": "block"});
								$("#ob-hideComp-checkbox" + compObj[key].objectID).prop('checked', false);
							}
							}
						}
						if (!IsBoolean(group.gCompHidden)) {
							group.iClass = "visibility";
							group.tooltip = "Show All Components";
							group.gCompHidden = true;
							ServiceFactory.showNotification("All components are hidden", "alert-info", 3000);
						} else {
							group.iClass = "visibility_off";
							group.tooltip = "Hide All Components";
							group.gCompHidden = false;
							ServiceFactory.showNotification("All components are visible", "alert-info", 3000);
						}
					} else {
						ServiceFactory.showNotification("No component available", "alert-warning", 3000);
					}
				} else {
					ServiceFactory.showNotification("No dashboard found", "alert-danger", 3000);
				}
			} else {
				ServiceFactory.showNotification("Group components are unpinned", "alert-danger", 3000);
			}
			if ($scope.isAllHidden()) {
				$scope.hideShowGlyph = "nt-eye-open-icon";
				$scope.hide_showAllToolTip = "Show All";
				$scope.hideAll = true;
			}
		};
		/**
		 * Check all components are hidden or visible
		 * @return {Boolean} true if all hidden else false
		 */
		$scope.isAllHidden = function() {
			var nOfHiddenComps = $( "input[name='HIDE_BTN']:checked" ).length,
			nOfAllComps = $scope.modal.selectedDashboard.json?.Dashboard[$scope.modal.layoutType].Object.length;
			return nOfHiddenComps === nOfAllComps;
		};
		
		/**
		 * Check all compoenent are locked or not
		 * @return {Boolean} true if all locked else false
		 */
		$scope.isAllLock = function() {
			var nOfLockedComps = $( "input[name='LOCK_BTN']:checked" ).length,
			nOfAllComps = $scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object.length;
			return nOfLockedComps === nOfAllComps;
		};
		
		/** Lock selected comp from context menu selection */
		$scope.lockSelectedComponent = function() {
			for (var i = 0; i < $scope.modal.listOfSelectedComponents.length; i++) {
				var comp = $scope.getManageComponentObj($scope.modal.listOfSelectedComponents[i]);
				if (comp) {
					var compJsonObj = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, "objectID", comp.objectID);
					compJsonObj["showLocked"] = true;
					comp.lockComponent = true;
					$("#dcc_" + comp.objectID).resizable("option", "disabled", true);
					$("#dcc_" + comp.objectID).draggable("option", "disabled", true);
					$("#dcc_" + comp.objectID).css({"background-image": "none", "opacity": "0.9"});
					/**added to hide Resize Handles & Setting Button when component is locked*/
					$scope.hideResizableHandles(comp.objectID);
					$scope.hideSettingsBtn(comp.objectID);
				}
			}
			if( $scope.isAllLock() ) {
				$scope.lockMoveGlyph = "lock_open";
				$scope.lockAll = true;
				$scope.lock_unlockAllToolTip = "Unlock All";
			}
		};
		
		/** Unlock selected comp from context menu selection */
		$scope.unLockSelectedComponent = function() {
			for (var i = 0; i < $scope.modal.listOfSelectedComponents.length; i++) {
				var comp = $scope.getManageComponentObj($scope.modal.listOfSelectedComponents[i]);
				if (comp) {
					var compJsonObj = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, "objectID", comp.objectID);
					compJsonObj["showLocked"] = false;
					comp.lockComponent = false;
					$("#dcc_" + comp.objectID).resizable("option", "disabled", false);
					$("#dcc_" + comp.objectID).draggable("option", "disabled", false);
					$("#dcc_" + comp.objectID).css({"background-image": "none", "opacity": "1.0"});
					$scope.lockAll = false;
					$scope.lock_unlockAllBtnIcon = "./resources/images/svg/lockAll.svg";
					$scope.lockMoveGlyph = "lock";
					$scope.lock_unlockAllToolTip = "Lock All";
				}
			}
		};
		
		/** Return selected component manage comp property object */
		$scope.getManageComponentObj = function(compID) {
			for (var j = 0; j < $scope.modal.componentListInObjectBrowser.length; j++) {
				if (compID == $scope.modal.componentListInObjectBrowser[j].objectID) {
					return $scope.modal.componentListInObjectBrowser[j];
				}
			}
		};
		
		/**
		 * lock a component in UI - x/y/w/h prop cannot be changed
		 * @param  {Object} event    Event object
		 * @param  {Object} comp     Component object
		 * @param  {Boolean} openMode open mode
		 * @return {undefined}          undefined
		 */
		$scope.lockComponent = function (event, comp, openMode) {
			comp.lockComponent = (event == false) ? comp.lockComponent : !comp.lockComponent;
			event ? event.stopPropagation() : "";
			$(".comp-appearance-icon").popover("hide");
			$(".bizVizControlBoxBody .popover").remove();
			/**Added to update multiselect wrap div after Lock*/
			if ($scope.multiSelected) {
				$scope.removeMultiSelectedWrapDiv();
			}
			var component = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, "objectID", comp.objectID);
			component["showLocked"] = comp.lockComponent;
			if (IsBoolean(comp.lockComponent) && !openMode) {
				ServiceFactory.showNotification("" + component.objectName + " is now Locked", "alert-info", 3000);
			} else if (!openMode) {
				ServiceFactory.showNotification("" + component.objectName + " is now Unlocked", "alert-info", 3000);
			}
			if (IsBoolean(comp.lockComponent)) {
				$("#dcc_" + comp.objectID).resizable("option", "disabled", true);
				$("#dcc_" + comp.objectID).draggable("option", "disabled", true);
				$("#dcc_" + comp.objectID).css({"background-image": "none", "opacity": "0.9"});
				/**added to hide Resize Handles & Setting Button when component is locked*/
				$scope.hideResizableHandles(comp.objectID);
				$scope.hideSettingsBtn(comp.objectID);
			} else {
				$("#dcc_" + comp.objectID).resizable("option", "disabled", false);
				$("#dcc_" + comp.objectID).draggable("option", "disabled", false);
				$("#dcc_" + comp.objectID).css({"background-image": "none", "opacity": "1.0"});
				$scope.lockAll = false;
				$scope.lock_unlockAllBtnIcon = "./resources/images/svg/lockAll.svg";
				$scope.lockMoveGlyph = "lock";
				$scope.lock_unlockAllToolTip = "Lock All";
			}
			if( $scope.isAllLock() ) {
				$scope.lockMoveGlyph = "lock_open";
				$scope.lockAll = true;
				$scope.lock_unlockAllToolTip = "Unlock All";
			}
			if ($scope.multiSelected) {
				$scope.multiSelectDragConfiguration();
			}
		};

		/**
		 * lock all the component in the design area
		 * @param  {Array} complist component list
		 * @return {undefined}          undefined
		 */
		$scope.lockAllComponent = function (complist) {
			$scope.lockAll = !$scope.lockAll;
			if ($scope.modal.selectedDashboard != "") {
				if(complist.length != 0){
					/**Added to update multiselect wrap div after Lock*/
					if ($scope.multiSelected) {
						$scope.removeMultiSelectedWrapDiv();
					}
					for (var key = 0; key < complist.length; key++) {
						var component = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, "objectID", complist[key].objectID);
						if (IsBoolean($scope.lockAll)) {
							component["showLocked"] = true;
							complist[key].lockComponent = true;
							$("#dcc_" + complist[key].objectID).resizable("option", "disabled", true);
							$("#dcc_" + complist[key].objectID).draggable("option", "disabled", true);
							$("#dcc_" + complist[key].objectID).css({"background-image": "none", "opacity": "0.9"});
							/**added to hide Resize Handles & Setting Button when component is locked*/
							$scope.hideResizableHandles(complist[key].objectID);
							$scope.hideSettingsBtn(complist[key].objectID);
						} else {
							component["showLocked"] = false;
							complist[key].lockComponent = false;
							$("#dcc_" + complist[key].objectID).resizable("option", "disabled", false);
							$("#dcc_" + complist[key].objectID).draggable("option", "disabled", false);
							$("#dcc_" + complist[key].objectID).css({"background-image": "none", "opacity": "1.0"});
						}
					}

					if (!IsBoolean($scope.lockAll)) {
						$scope.lock_unlockAllBtnIcon = "./resources/images/svg/lockAll.svg";
						$scope.lockMoveGlyph = "lock";
						$scope.lock_unlockAllToolTip = "Lock All";
						ServiceFactory.showNotification("All components are unlocked", "alert-info", 3000);
					} else {
						$scope.lock_unlockAllBtnIcon = "./resources/images/svg/unlockAll.svg";
						$scope.lockMoveGlyph = "lock_open";
						$scope.lock_unlockAllToolTip = "Unlock All";
						ServiceFactory.showNotification("All components are locked", "alert-info", 3000);
					}
					if ($scope.multiSelected) {
						$scope.multiSelectDragConfiguration();
					}
				}else{
					ServiceFactory.showNotification("No component available", "alert-warning", 3000);
				}
			} else {
				ServiceFactory.showNotification("No dashboard found", "alert-warning", 3000);
			}
		};

		/**
		 * delete all the component of dashboard
		 * @param  {Array} complist component list
		 * @return {undefined}          undefined
		 */
		$scope.deleteAllComponent = function (complist) {
			if ($scope.modal.selectedDashboard != "") {
				if(complist.length != 0){
					for (var key = 0; key < complist.length; key++) {
						if ($scope.modal.listOfSelectedComponents.indexOf(complist[key].objectID) == -1)
							$scope.modal.listOfSelectedComponents.push(complist[key].objectID);
					}
					/**Change modalPopUp of deleteAllComponent from objectBrowserList to resolve delete comp issue with context menu del option 
					 * It will deSelectAll comp when click on 'No' option of Popup */
					//$scope.doYouWantToDeleteAll();
					$scope.showModelPopup("deleteAllCompConfirmationFromManageDashPallete");
				}else{
					ServiceFactory.showNotification("No component available", "alert-warning", 3000);
				}
			} else {
				ServiceFactory.showNotification("No dashboard found", "alert-warning", 3000);
			}
		};
	}
	
	/** @description Controller definition **/
	angular.module(designerModules.module.DesignerManager)
	.controller("ObjectBrowserController", ["$scope", "ServiceFactory", "$timeout", obCtrlFn]);
	
})();
//# sourceURL=ObjectBrowserController.js